"use client";

import { useRef, type ReactNode } from "react";
import { useScrollMoment } from "@/hooks/useScrollMoment";
import { dur, reducedFade } from "@/lib/motion";

// Camp Stories' moment (docs/05-sections.md section 8): the newspaper clipping is pasted onto the
// page, then the two medals are stamped beside the headline, one after the other (the stamp
// motion from docs/03: scale 1.6 to 1 from -8deg in 180ms). Reduced motion: a short fade.
// Parts: data-moment="clipping", and data-moment="medal" around each stamp.

export function CampMoment({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollMoment(ref, ({ tl, level, q }) => {
    const clipping = q('[data-moment="clipping"]');
    const medals = q('[data-moment="medal"] > *');
    if (level === "reduced") {
      tl.fromTo(
        [...clipping, ...medals],
        { opacity: 0 },
        { opacity: 1, duration: reducedFade },
      );
      return;
    }
    tl.fromTo(
      clipping,
      { opacity: 0, y: -12, rotation: -2.5 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: dur.pin,
        clearProps: "transform,opacity",
      },
    ).fromTo(
      medals,
      { opacity: 0, scale: 1.6, rotation: -8 },
      {
        opacity: 0.9,
        scale: 1,
        rotation: 0,
        duration: dur.stamp,
        ease: "power4.in",
        stagger: 0.35,
        clearProps: "transform,opacity",
      },
      "+=0.1",
    );
  });

  return <div ref={ref}>{children}</div>;
}
