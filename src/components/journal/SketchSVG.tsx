import { useId } from "react";
import type { Sketch } from "@/content/sketches";

// A traced engraving drawn in ink (D28). Paths are outlines filled with the text color; each has
// pathLength=1 so step 2.3 can draw them on with stroke-dashoffset before the fill arrives.
// `wobble` adds a faint hand-drawn displacement. Static in Phase 1.

type SketchSVGProps = {
  sketch: Sketch;
  /** Accessible description; omit when the sketch is purely decorative. */
  title?: string;
  wobble?: boolean;
  className?: string;
};

export function SketchSVG({
  sketch,
  title,
  wobble = true,
  className = "",
}: SketchSVGProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const filter = `sketch-wobble-${id}`;
  return (
    <svg
      viewBox={sketch.viewBox}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      className={`block h-auto w-full ${className}`}
    >
      {wobble ? (
        <defs>
          <filter id={filter} x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035"
              numOctaves="2"
              seed="7"
            />
            <feDisplacementMap in="SourceGraphic" scale="2.2" />
          </filter>
        </defs>
      ) : null}
      <g
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.35"
        strokeLinejoin="round"
        filter={wobble ? `url(#${filter})` : undefined}
      >
        {sketch.paths.map((d, i) => (
          <path key={i} d={d} pathLength={1} />
        ))}
      </g>
    </svg>
  );
}
