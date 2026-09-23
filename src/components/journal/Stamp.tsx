import type { ReactNode } from "react";
import { seededRange } from "@/lib/seed";

// A rubber stamp: blood-red ink pressed at an angle, worn where the stamp met the paper unevenly
// (mask from public/textures/stamp-wear.webp). The text is real text. Round stamps are the one
// place a circle is allowed (DESIGN.md, Shapes).

type StampProps = {
  children: ReactNode;
  shape?: "rect" | "round";
  size?: "sm" | "md" | "lg";
  /** Seed for the angle; stamps land up to 8deg off true. */
  seed?: string;
  tone?: "blood" | "ink";
  className?: string;
};

const sizes = {
  sm: "text-small px-3 py-1.5",
  md: "text-lead px-4 py-2",
  lg: "text-h3 px-5 py-2.5",
};
const roundSizes = {
  sm: "size-20 text-caption",
  md: "size-28 text-caption",
  lg: "size-36 text-small",
};
const tones = { blood: "text-blood", ink: "text-ink" };

export function Stamp({
  children,
  shape = "rect",
  size = "md",
  seed = "stamp",
  tone = "blood",
  className = "",
}: StampProps) {
  const rotate = seededRange(seed, 8);
  const offset = `${Math.round((rotate + 8) * 16)}px ${Math.round((8 - rotate) * 9)}px`;
  return (
    <span
      className={`font-display tracking-poster relative inline-flex items-center justify-center border-[3px] border-current leading-none uppercase opacity-90 mix-blend-multiply before:pointer-events-none before:absolute before:inset-[3px] before:border before:border-current before:content-[''] ${
        shape === "round"
          ? `rounded-full text-center before:rounded-full ${roundSizes[size]}`
          : sizes[size]
      } ${tones[tone]} ${className}`}
      style={{
        rotate: `${rotate}deg`,
        maskImage: "url(/textures/stamp-wear.webp)",
        maskSize: "256px 256px",
        maskPosition: offset,
      }}
    >
      {children}
    </span>
  );
}
