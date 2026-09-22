import {
  Caveat,
  Homemade_Apple,
  IM_Fell_English,
  Rye,
  Special_Elite,
} from "next/font/google";

// Five families site-wide (budget in docs/04-architecture.md). Faces and roles: DESIGN.md.
// Only the faces visible in the first viewport are preloaded.

/** Woodtype display: posters, chapter titles. Headlines only. */
export const rye = Rye({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rye",
});

/** Old-print body serif. Regular and italic only: no bold exists, so emphasis is italic. */
export const imFell = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-im-fell",
});

/** Loose cursive for short journal entries, 22px and up. */
export const homemadeApple = Homemade_Apple({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-homemade-apple",
  preload: false,
});

/** Readable hand for margin notes and annotations, 18px and up. */
export const caveat = Caveat({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  preload: false,
});

/** Typewriter: telegrams, stamped figures, ledger numbers. */
export const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-special-elite",
  preload: false,
});

export const fontVariables = [rye, imFell, homemadeApple, caveat, specialElite]
  .map((font) => font.variable)
  .join(" ");
