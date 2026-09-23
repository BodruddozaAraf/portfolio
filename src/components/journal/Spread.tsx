import type { ReactNode } from "react";
import { Page } from "./Page";

// The open journal: two pages on the leather cover. Side by side from lg (the cover shows as a
// thin frame and the pages meet at the spine); stacked below lg, each bound on its left edge.

type SpreadProps = {
  left: ReactNode;
  right: ReactNode;
  /** Accessible name for the spread when it is a landmark region. */
  label?: string;
  className?: string;
};

export function Spread({ left, right, label, className = "" }: SpreadProps) {
  return (
    <section
      aria-label={label}
      className={`leather shadow-pinned grid gap-2 p-2 md:p-3 lg:grid-cols-2 lg:gap-0 ${className}`}
    >
      <Page spine="left-then-right">{left}</Page>
      <Page spine="left">{right}</Page>
    </section>
  );
}
