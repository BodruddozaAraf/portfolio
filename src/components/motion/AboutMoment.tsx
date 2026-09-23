"use client";

import { useRef, type ReactNode } from "react";
import { useScrollMoment } from "@/hooks/useScrollMoment";
import { dur, reducedFade } from "@/lib/motion";

// About's moment (docs/05-sections.md section 2): the entry writes itself line by line, a pen
// wipe across each line as the page scrolls in, then the pasted photograph and the margin notes
// settle onto the page with a slight turn. Reduced motion: a short fade. Mark the parts with
// data-moment="entry" (its first child is the handwriting) and data-moment="note".

const LINE_S = 0.6;
const LINE_GAP_S = 0.34;

export function AboutMoment({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollMoment(ref, ({ tl, level, q, m }) => {
    const entry = q('[data-moment="entry"] > *');
    const notes = q('[data-moment="note"]');
    if (level === "reduced") {
      tl.fromTo(
        [...entry, ...notes],
        { opacity: 0 },
        { opacity: 1, duration: reducedFade },
      );
      return;
    }

    // aria "none": the lines stay real text inside the paragraph (the default puts an aria-label
    // on the <p>, which a paragraph may not carry)
    const split = m.SplitText.create(entry, { type: "lines", aria: "none" });
    tl.fromTo(
      split.lines,
      { clipPath: "inset(-40% 100% -40% 0%)" },
      {
        clipPath: "inset(-40% 0% -40% 0%)",
        duration: LINE_S,
        ease: "power1.inOut",
        stagger: LINE_GAP_S,
      },
    )
      .fromTo(
        notes,
        { opacity: 0, rotate: -1.5, y: 8 },
        {
          opacity: 1,
          rotate: 0,
          y: 0,
          duration: dur.reveal,
          stagger: 0.12,
          clearProps: "transform,opacity",
        },
        0.5,
      )
      // hand the text back to the browser once written, so it reflows on resize
      .call(() => split.revert());
    return () => split.revert();
  });

  return <div ref={ref}>{children}</div>;
}
