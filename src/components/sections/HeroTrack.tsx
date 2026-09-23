"use client";

import { useRef } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";
import { useLazyGsap } from "@/hooks/useLazyGsap";

// The hero track's progress for browsers without CSS scroll timelines (older Safari, Firefox):
// ScrollTrigger writes --hero-p (0 at the top, 1 where the track ends) on the track, and the
// fallback rules in globals.css turn it into the same copy fade, zoom to the journal and paper
// as the scroll-timeline version (D79). Browsers with scroll timelines never load it.

export function HeroTrack() {
  const ref = useRef<HTMLSpanElement>(null);
  const level = useMotionLevel();
  useLazyGsap(
    ref,
    ({ ScrollTrigger }) => {
      const track = ref.current?.closest<HTMLElement>("[data-hero-track]");
      if (!track || level !== "full") return;
      if (CSS.supports("animation-timeline: scroll()")) return;
      ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) =>
          track.style.setProperty("--hero-p", self.progress.toFixed(4)),
      });
      return () => track.style.removeProperty("--hero-p");
    },
    [level],
  );
  return <span ref={ref} hidden />;
}
