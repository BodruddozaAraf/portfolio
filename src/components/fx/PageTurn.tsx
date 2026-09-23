import { ViewTransition, type ReactNode } from "react";

// The page itself, for route transitions (docs/06 step 2.7). When a link carries a turn type
// (src/lib/page-turn.ts), the old page is wiped off by the new one like a turned leaf: forward
// from the right edge, back from the left (CSS in globals.css). Other navigations are instant.
// Named elements inside (a bounty poster) still morph on top.

export function PageTurn({ children }: { children: ReactNode }) {
  const turn = {
    "page-forward": "page-forward",
    "page-back": "page-back",
    default: "none",
  };
  return (
    <ViewTransition enter={turn} exit={turn} default="none">
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
