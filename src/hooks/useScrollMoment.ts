"use client";

import type { RefObject } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { MotionLevel } from "@/lib/motion";

// A section's authored moment (DESIGN.md, The One Moment Rule): `build` fills a paused timeline,
// which plays once when the section scrolls in. Following The Still Fallback Rule, nothing is set
// back when the section is already on screen at hydration, and Plain mode gets nothing at all.
// The timeline is built after the fonts load, so anything measured from text (split lines) is
// measured in the real faces.

export type MomentContext = {
  tl: gsap.core.Timeline;
  level: Exclude<MotionLevel, "none">;
  root: HTMLElement;
  q: (selector: string) => HTMLElement[];
};

export function useScrollMoment(
  scope: RefObject<HTMLElement | null>,
  build: (ctx: MomentContext) => void | (() => void),
  { start = "top 70%" }: { start?: string } = {},
) {
  const level = useMotionLevel();

  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root || level === "none" || !contextSafe) return;
      if (root.getBoundingClientRect().top < window.innerHeight * 0.9) return;

      let cleanup: void | (() => void);
      let cancelled = false;
      const setup = contextSafe(() => {
        if (cancelled) return;
        const tl = gsap.timeline({ paused: true });
        const q = (selector: string) =>
          Array.from(root.querySelectorAll<HTMLElement>(selector));
        cleanup = build({ tl, level, root, q });
        ScrollTrigger.create({
          trigger: root,
          start,
          once: true,
          onEnter: () => tl.play(),
        });
      });
      document.fonts.ready.then(setup);
      return () => {
        cancelled = true;
        cleanup?.();
      };
    },
    { scope, dependencies: [level], revertOnUpdate: true },
  );
}
