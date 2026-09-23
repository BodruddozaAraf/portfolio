"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { dur, reducedFade, revealRise, stagger } from "@/lib/motion";

// Section reveal helper (docs/03 section 5): the block rises 24px and inks in as it scrolls into
// view, once. With `stagger`, its direct children arrive one after another, 60ms apart; use that
// only for things that read as a list. Reduced motion gets a 200ms fade, Plain mode nothing.
//
// Content is never hidden by the server render: only blocks still below the fold when the page
// hydrates are set back and revealed, so a failed script or a mid-page reload leaves everything
// readable. Use it for supporting content; a section's authored moment gets its own animation.

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  stagger?: boolean;
  className?: string;
};

export function Reveal({
  children,
  as: Tag = "div",
  stagger: staggered = false,
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const level = useMotionLevel();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || level === "none") return;
      if (root.getBoundingClientRect().top < window.innerHeight) return;

      const targets = staggered ? Array.from(root.children) : [root];
      const full = level === "full";
      gsap.set(targets, { opacity: 0, y: full ? revealRise : 0 });
      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: full ? dur.reveal : reducedFade,
            stagger: full && staggered ? stagger : 0,
            clearProps: "transform,opacity",
          }),
      });
    },
    { scope: ref, dependencies: [level, staggered], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
