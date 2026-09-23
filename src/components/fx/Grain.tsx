"use client";

import { useEffect, useRef } from "react";
import { useMotionLevel } from "@/hooks/useReducedMotion";

// Fixed film-grain layer over everything (docs/06 step 2.8). The grain is a 160px tile on a layer
// one tile larger than the viewport. With full motion the layer jumps to a new offset within one
// tile eight times a second, so the grain flickers like film. A timer sets the transform (8 style
// updates a second; a CSS steps() animation made Chrome restyle every frame), it pauses while the
// tab is hidden, and the transform never repaints the tile, which keeps phone scrolling smooth.
// Still under reduced motion; hidden in Plain mode (globals.css).

const OFFSETS = [
  [0, 0],
  [-47, -113],
  [-131, -29],
  [-79, -151],
  [-13, -67],
  [-103, -89],
  [-151, -7],
  [-61, -131],
];
const FRAME_MS = 125;

export function Grain() {
  const ref = useRef<HTMLDivElement>(null);
  const level = useMotionLevel();

  useEffect(() => {
    const el = ref.current;
    if (!el || level !== "full") return;
    let i = 0;
    let timer = 0;
    const step = () => {
      i = (i + 1) % OFFSETS.length;
      el.style.transform = `translate3d(${OFFSETS[i][0]}px, ${OFFSETS[i][1]}px, 0)`;
    };
    const start = () => {
      window.clearInterval(timer);
      if (!document.hidden) timer = window.setInterval(step, FRAME_MS);
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", start);
      el.style.transform = "";
    };
  }, [level]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="grain-layer tex-grain pointer-events-none fixed -inset-40 z-(--z-grain) opacity-20 will-change-transform"
    />
  );
}
