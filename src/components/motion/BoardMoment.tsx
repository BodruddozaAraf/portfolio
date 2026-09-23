"use client";

import { useRef, type ReactNode } from "react";
import { useScrollMoment } from "@/hooks/useScrollMoment";
import { dur, reducedFade, stagger } from "@/lib/motion";

// The Bounty Board's moment (docs/05-sections.md section 4, docs/03 "Pin a poster"): each poster
// drops from 40px above onto its pin and swings about the pin until it settles. The swing is
// keyframed and settles without overshooting its resting angle (D40). Reduced motion: a fade.
// Parts: data-moment="poster" on each poster, its tack marked [data-pin].

export function BoardMoment({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollMoment(
    ref,
    ({ tl, level, q }) => {
      const posters = q('[data-moment="poster"]');
      if (level === "reduced") {
        tl.fromTo(
          posters,
          { opacity: 0 },
          { opacity: 1, duration: reducedFade },
        );
        return;
      }
      posters.forEach((poster, i) => {
        const at = i * stagger * 2.5;
        const swing = i % 2 ? 1 : -1;
        tl.fromTo(
          poster,
          { opacity: 0, y: -40, transformOrigin: "50% 1.4rem" },
          { opacity: 1, y: 0, duration: dur.pin, ease: "power2.in" },
          at,
        )
          .fromTo(
            poster,
            { rotation: 0 },
            {
              keyframes: {
                rotation: [0, 2.4 * swing, -1.2 * swing, 0.5 * swing, 0],
              },
              duration: 0.9,
              ease: "none",
            },
            at + dur.pin * 0.8,
          )
          .fromTo(
            poster.querySelectorAll("[data-pin]"),
            { scale: 1.5 },
            { scale: 1, duration: 0.14, ease: "power3.in" },
            at + dur.pin * 0.8,
          )
          .set(poster, { clearProps: "transform,opacity" });
      });
    },
    { start: "top 60%" },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
