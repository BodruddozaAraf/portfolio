"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { setLenis } from "@/lib/lenis";
import "lenis/dist/lenis.css";

// Lenis smooth scroll (docs/03 section 5: lerp about 0.1), driven by the GSAP ticker so every
// ScrollTrigger reads the same frame. Off under reduced motion, in Plain mode and on /plain, where
// the browser's own scroll is used. Loaded after hydration so it never delays the first paint.
// Same-page anchor links glide too, then move focus to their target like a native jump. They do
// not write the hash into the history, so Back restores the scroll (see CleanHash).

export function SmoothScroll() {
  const level = useMotionLevel();
  const pathname = usePathname();
  const enabled = level === "full" && pathname !== "/plain";

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let teardown = () => {};

    Promise.all([import("lenis"), import("@/lib/gsap")]).then(
      ([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;
        const lenis = new Lenis({
          lerp: 0.1,
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
        });
        const tick = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const onClick = (event: MouseEvent) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const link = (event.target as Element | null)?.closest?.("a[href]");
          if (!(link instanceof HTMLAnchorElement) || link.target === "_blank")
            return;
          // the weapon wheel moves the reader itself (glideTo) once it has closed
          if (link.closest("[data-wheel]")) return;
          const url = new URL(link.href);
          if (
            !url.hash ||
            url.origin !== location.origin ||
            url.pathname !== location.pathname
          )
            return;
          const target = document.getElementById(
            decodeURIComponent(url.hash.slice(1)),
          );
          if (!target) return;
          // capture phase, so Next's Link does not also jump
          event.preventDefault();
          event.stopPropagation();
          lenis.scrollTo(target, {
            onComplete: () => {
              if (!target.hasAttribute("tabindex"))
                target.setAttribute("tabindex", "-1");
              target.focus({ preventScroll: true });
            },
          });
        };
        document.addEventListener("click", onClick, { capture: true });

        setLenis(lenis);
        ScrollTrigger.refresh();
        teardown = () => {
          document.removeEventListener("click", onClick, { capture: true });
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
          setLenis(null);
          ScrollTrigger.refresh();
        };
      },
    );

    return () => {
      cancelled = true;
      teardown();
    };
  }, [enabled]);

  return null;
}
