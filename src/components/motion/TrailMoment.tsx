"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { useLazyGsap } from "@/hooks/useLazyGsap";
import { getLenis } from "@/lib/lenis";
import { dur } from "@/lib/motion";

// The Trail's moment (docs/05-sections.md section 6), scroll-scrubbed because the scroll is the
// journey. On desktop the map sheet is pinned and the camera pans across a wide map
// (data-riding widens the track); the dotted trail is drawn up to where the camera is and each pin
// drops as the trail reaches it. On phones the trail draws down the page instead. Keyboard focus
// on a stop scrolls the page to where that stop is in view. Reduced motion and Plain mode keep
// the static map: every pin in place, the trail fully drawn.
// Parts: [data-trail="track"], "line-h" (svg), "line-v", "stop" (with a [data-pin]), "card".

const WIDE = "(min-width: 64rem)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function TrailMoment({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const level = useMotionLevel();
  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
  const riding = level === "full" && wide;

  useLazyGsap(
    ref,
    ({ gsap, ScrollTrigger }) => {
      const root = ref.current;
      if (!root || level !== "full") return;
      const q = <T extends Element = HTMLElement>(s: string) =>
        Array.from(root.querySelectorAll<T & HTMLElement>(s));
      const stops = q('[data-trail="stop"]');
      const parts = stops.map((s) => [
        s.querySelector<HTMLElement>("[data-pin]"),
        s.querySelector<HTMLElement>('[data-trail="card"]'),
      ]);
      const dropped = new Set<number>();
      // a stop that takes keyboard focus shows at once (with the ones before it), never after
      // the ride catches up: focus must not land on something still invisible (5.2)
      const dropTo = (e: FocusEvent) => {
        const i = stops.findIndex((s) => s.contains(e.target as Node));
        for (let j = 0; j <= i; j++) {
          dropped.add(j);
          gsap.killTweensOf(parts[j]);
          gsap.set(parts[j], { clearProps: "transform,opacity" });
        }
        return i;
      };
      const drop = (i: number) => {
        if (dropped.has(i)) return;
        dropped.add(i);
        gsap.fromTo(
          parts[i],
          { opacity: 0, y: -24 },
          {
            opacity: 1,
            y: 0,
            duration: dur.pin,
            ease: "power2.in",
            stagger: 0.08,
            clearProps: "transform,opacity",
          },
        );
      };

      if (riding) {
        const [track] = q('[data-trail="track"]');
        const sheet = track.parentElement!;
        const [line] = q<SVGSVGElement>('[data-trail="line-h"]');
        const n = stops.length;
        const at = stops.map((_, i) => i / (n - 1));
        const distance = () => track.scrollWidth - sheet.clientWidth;
        const draw = (p: number) => {
          const reach = (0.5 + p * (n - 1)) / n;
          line.style.clipPath = `inset(0 ${(1 - reach) * 100}% 0 0)`;
          at.forEach((t, i) => p >= t - 0.02 && drop(i));
        };
        gsap.set(parts.slice(1).flat(), { opacity: 0 });
        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => draw(self.progress),
            onRefresh: (self) => draw(self.progress),
          },
        });
        draw(0);

        // Tab into a stop the camera has not reached: ride there
        const onFocus = (e: FocusEvent) => {
          sheet.scrollLeft = 0;
          const i = dropTo(e);
          const st = pan.scrollTrigger;
          if (i < 0 || !st) return;
          const y = st.start + at[i] * (st.end - st.start);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { immediate: true });
          else window.scrollTo(0, y);
        };
        root.addEventListener("focusin", onFocus);
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        return () => {
          root.removeEventListener("focusin", onFocus);
          line.style.clipPath = "";
          ScrollTrigger.refresh();
        };
      }

      // phones: the trail draws down the page; only when it starts out of sight
      if (root.getBoundingClientRect().top < window.innerHeight) return;
      const [line] = q('[data-trail="line-v"]');
      const [list] = q("ol");
      gsap.set(parts.flat(), { opacity: 0 });
      root.addEventListener("focusin", dropTo);
      ScrollTrigger.create({
        trigger: list,
        start: "top 70%",
        end: "bottom 70%",
        onUpdate: (self) => {
          line.style.clipPath = `inset(0 0 ${(1 - self.progress) * 100}% 0)`;
          const h = list.offsetHeight;
          stops.forEach(
            (s, i) => self.progress >= (s.offsetTop + 12) / h && drop(i),
          );
        },
      });
      line.style.clipPath = "inset(0 0 100% 0)";
      return () => {
        root.removeEventListener("focusin", dropTo);
        line.style.clipPath = "";
      };
    },
    [level, riding],
  );

  return (
    <div
      ref={ref}
      data-riding={riding ? "" : undefined}
      className={`group ${className}`}
    >
      {children}
    </div>
  );
}
