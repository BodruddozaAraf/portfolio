"use client";

import { useRef, type ReactNode } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { useLazyGsap } from "@/hooks/useLazyGsap";
import { dur, reducedFade } from "@/lib/motion";

// A stamp slammed down as it appears (docs/03: scale 1.6 to 1 from -8deg in 180ms). For stamps
// that arrive with an action, not on scroll. Reduced motion: a short fade; Plain mode: nothing.

export function SlamIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const level = useMotionLevel();

  useLazyGsap(
    ref,
    ({ gsap }) => {
      const el = ref.current?.firstElementChild;
      if (!el || level === "none") return;
      if (level === "reduced") {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 0.9, duration: reducedFade, clearProps: "opacity" },
        );
        return;
      }
      gsap.fromTo(
        el,
        { opacity: 0, scale: 1.6, rotation: -8 },
        {
          opacity: 0.9,
          scale: 1,
          rotation: 0,
          duration: dur.stamp,
          ease: "power4.in",
          clearProps: "transform,opacity",
        },
      );
    },
    [level],
  );

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
