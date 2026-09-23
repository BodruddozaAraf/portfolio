"use client";

import { useRef, type ReactNode } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { useLazyGsap } from "@/hooks/useLazyGsap";
import { useScrollMoment } from "@/hooks/useScrollMoment";
import { dur, reducedFade } from "@/lib/motion";

// Wanted's moment (docs/05-sections.md section 3). The poster flutters down in the wind and
// settles (keyframes, never an overshoot ease, D40), the pin is hammered home with a small shake,
// REWARD slams down (scale 1.6 to 1, from -8deg, 180ms, then a 2px shake) and the stamped tickets
// drop in while their figures count up. On a pointer that hovers, the poster then leans toward
// the cursor. Reduced motion: a short fade, figures shown as they are.
// Parts: data-moment="poster" (with a [data-pin]), "stamp", "ticket", and [data-count] figures.

const TILT_DEG = 5;

export function WantedMoment({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const level = useMotionLevel();

  useScrollMoment(ref, ({ tl, level, q }) => {
    const [poster] = q('[data-moment="poster"]');
    const pin = poster?.querySelector("[data-pin]");
    const stamp = q('[data-moment="stamp"] > *');
    const tickets = q('[data-moment="ticket"]');
    if (!poster) return;

    if (level === "reduced") {
      tl.fromTo(
        [poster, ...tickets],
        { opacity: 0 },
        { opacity: 1, duration: reducedFade },
      );
      return;
    }

    const shake = (distance: number) => ({
      keyframes: { x: [0, distance, -distance, distance / 2, 0] },
      duration: 0.2,
      ease: "none",
    });

    // no leaning while it is being hung
    poster.dataset.hanging = "";
    tl.set(poster, { transformPerspective: 900, transformOrigin: "50% 0%" })
      .fromTo(
        poster,
        { opacity: 0, y: -32, rotationX: -32 },
        {
          keyframes: {
            opacity: [0, 1, 1, 1, 1],
            y: [-32, 0, 0, 0, 0],
            rotationX: [-32, 11, -5, 2, 0],
            easeEach: "sine.inOut",
          },
          duration: 1.2,
          ease: "none",
        },
      )
      .fromTo(
        pin ?? [],
        { scale: 1.8 },
        { keyframes: { scale: [1.8, 0.9, 1] }, duration: 0.18, ease: "none" },
        "-=0.15",
      )
      .to(poster, shake(1.5), "<")
      .fromTo(
        stamp,
        { opacity: 0, scale: 1.6, rotation: -8 },
        {
          opacity: 0.9,
          scale: 1,
          rotation: 0,
          duration: dur.stamp,
          ease: "power4.in",
        },
        "+=0.1",
      )
      .to(poster, shake(2))
      .set([poster, ...stamp], { clearProps: "transform,opacity" })
      .call(() => delete poster.dataset.hanging)
      .fromTo(
        tickets,
        { opacity: 0, y: -18 },
        {
          opacity: 1,
          y: 0,
          duration: dur.pin,
          stagger: 0.1,
          clearProps: "transform,opacity",
        },
        0.4,
      );

    for (const el of q("[data-count]")) {
      const target = el.dataset.count ?? "0";
      const decimals = target.split(".")[1]?.length ?? 0;
      const counter = { value: 0 };
      el.textContent = (0).toFixed(decimals);
      tl.to(
        counter,
        {
          value: Number(target),
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = counter.value.toFixed(decimals);
          },
          onComplete: () => {
            el.textContent = target;
          },
        },
        0.6,
      );
    }
    return () => {
      delete poster.dataset.hanging;
      for (const el of q("[data-count]"))
        el.textContent = el.dataset.count ?? "";
    };
  });

  // the lean toward the cursor, on pointers that hover
  useLazyGsap(
    ref,
    ({ gsap }) => {
      const poster = ref.current?.querySelector<HTMLElement>(
        '[data-moment="poster"]',
      );
      if (
        !poster ||
        level !== "full" ||
        !matchMedia("(hover: hover) and (pointer: fine)").matches
      )
        return;
      const toX = gsap.quickTo(poster, "rotationX", { duration: 0.5 });
      const toY = gsap.quickTo(poster, "rotationY", { duration: 0.5 });
      const onMove = (e: PointerEvent) => {
        if (poster.dataset.hanging !== undefined) return;
        const r = poster.getBoundingClientRect();
        gsap.set(poster, {
          transformPerspective: 900,
          transformOrigin: "50% 50%",
        });
        toY(((e.clientX - r.left) / r.width - 0.5) * 2 * TILT_DEG);
        toX(-((e.clientY - r.top) / r.height - 0.5) * 2 * TILT_DEG);
      };
      const onLeave = () => {
        toX(0);
        toY(0);
      };
      poster.addEventListener("pointermove", onMove);
      poster.addEventListener("pointerleave", onLeave);
      return () => {
        poster.removeEventListener("pointermove", onMove);
        poster.removeEventListener("pointerleave", onLeave);
      };
    },
    [level],
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
