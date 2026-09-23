import type { ReactNode } from "react";
import { seededRange } from "@/lib/seed";
import type { HtmlTag } from "@/lib/html-tag";

// Handwriting is decoration (DESIGN.md, The Real Text Rule): it is real, selectable text, and any
// fact it carries must also appear in the body face nearby.
//   entry: Homemade Apple, 24 to 28px, short journal entries
//   note:  Caveat, 20 to 22px, margin notes and annotations
// Pass `lines` to break the text where the writer would; step 2.3 reveals them one at a time.

type HandwrittenTextProps = {
  variant?: "entry" | "note";
  as?: HtmlTag;
  lines?: string[];
  children?: ReactNode;
  /** Seed for a slight hand-held tilt (max 0.6deg); omit for none. */
  tilt?: string;
  className?: string;
};

const variants = {
  entry: "font-hand text-h4 leading-[1.75] text-ink",
  note: "font-note text-lead leading-snug text-ink-soft",
};

export function HandwrittenText({
  variant = "entry",
  as: Tag = "p",
  lines,
  children,
  tilt,
  className = "",
}: HandwrittenTextProps) {
  const rotate = tilt ? seededRange(tilt, 0.6) : 0;
  return (
    <Tag
      className={`${variants[variant]} ${className}`}
      style={rotate ? { rotate: `${rotate}deg` } : undefined}
    >
      {lines
        ? lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))
        : children}
    </Tag>
  );
}
