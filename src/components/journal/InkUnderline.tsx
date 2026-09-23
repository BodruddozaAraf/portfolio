import type { ReactNode } from "react";
import { seededSequence } from "@/lib/seed";

// A quick pen stroke under a key figure. The line wanders a little and rises toward the end, the
// way a hand underlines; the seed keeps it stable. pathLength=1 lets step 2.3 draw it on.

type InkUnderlineProps = {
  children: ReactNode;
  seed?: string;
  tone?: "blood" | "ink";
  double?: boolean;
  className?: string;
};

function stroke(seed: string, y: number) {
  const r = seededSequence(seed);
  const points = Array.from({ length: 7 }, (_, i) => ({
    x: i * (100 / 6) + (i && i < 6 ? (r() - 0.5) * 4 : 0),
    y: y - i * 0.35 + (r() - 0.5) * 1.6,
  }));
  return points.reduce(
    (d, p, i) =>
      i === 0
        ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
        : `${d} T ${p.x.toFixed(1)} ${p.y.toFixed(1)}`,
    "",
  );
}

const tones = { blood: "text-blood", ink: "text-ink" };

export function InkUnderline({
  children,
  seed = "underline",
  tone = "blood",
  double = false,
  className = "",
}: InkUnderlineProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        aria-hidden
        focusable="false"
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute inset-x-[-4%] -bottom-[0.32em] h-[0.5em] w-[108%] overflow-visible ${tones[tone]}`}
      >
        <path
          d={stroke(seed, 5)}
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {double ? (
          <path
            d={stroke(`${seed}:2`, 9)}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
      </svg>
    </span>
  );
}
