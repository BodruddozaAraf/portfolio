// Motion tokens for script-driven animation (GSAP). The raw values live in src/styles/tokens.css;
// this is their mirror in seconds, and `npm test` fails if the two drift apart.
// Levels: "full" is the journal as designed, "reduced" (prefers-reduced-motion) keeps only fades
// of 200ms or less, "none" (Plain mode, D52) is a still page.

export type MotionLevel = "full" | "reduced" | "none";

/** Durations in seconds, named after the --dur-* tokens. */
export const dur = {
  hover: 0.2,
  stamp: 0.18,
  pin: 0.5,
  reveal: 0.8,
  page: 0.9,
  draw: 1.8,
} as const;

/** --stagger, in seconds. */
export const stagger = 0.06;

/** Longest fade allowed under reduced motion (docs/03 section 5). */
export const reducedFade = 0.2;

/** --ease-journal as cubic-bezier control points. */
export const easeJournal = [0.22, 1, 0.36, 1] as const;

/** The GSAP name of --ease-journal, registered in src/lib/gsap.ts. */
export const EASE = "journal";

/** How far a revealed block rises, in px (docs/03 section 5). */
export const revealRise = 24;
