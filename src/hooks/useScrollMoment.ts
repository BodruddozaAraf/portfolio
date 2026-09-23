"use client";

import type { RefObject } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { useLazyGsap, type Gsap } from "@/hooks/useLazyGsap";
import type { MotionLevel } from "@/lib/motion";

// A section's authored moment (DESIGN.md, The One Moment Rule): `build` fills a paused timeline,
// which plays once when the section scrolls in. Following The Still Fallback Rule, nothing is set
// back when the section is already on screen at hydration, and Plain mode gets nothing at all.
// The timeline is built after the fonts load, so anything measured from text (split lines) is
// measured in the real faces. GSAP loads on demand (useLazyGsap).

export type MomentContext = {
  tl: gsap.core.Timeline;
  level: Exclude<MotionLevel, "none">;
  root: HTMLElement;
  q: (selector: string) => HTMLElement[];
  m: Gsap;
};

export function useScrollMoment(
  scope: RefObject<HTMLElement | null>,
  build: (ctx: MomentContext) => void | (() => void),
  { start = "top 70%" }: { start?: string } = {},
) {
  const level = useMotionLevel();

  useLazyGsap(
    scope,
    (m, ctx) => {
      const root = scope.current;
      if (!root || level === "none") return;
      if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;

      let cleanup: void | (() => void);
      let cancelled = false;
      document.fonts.ready.then(() => {
        if (cancelled) return;
        ctx.add(() => {
          const tl = m.gsap.timeline({ paused: true });
          const q = (selector: string) =>
            Array.from(root.querySelectorAll<HTMLElement>(selector));
          cleanup = build({ tl, level, root, q, m });
          m.ScrollTrigger.create({
            trigger: root,
            start,
            once: true,
            onEnter: () => tl.play(),
          });
        });
      });
      return () => {
        cancelled = true;
        cleanup?.();
      };
    },
    [level],
  );
}
