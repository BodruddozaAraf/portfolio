// The camp's colors for three.js and GLSL. A mirror of the palette in src/styles/tokens.css (the
// No Raw Hex Rule: the tokens stay the one source); `npm test` fails if the two drift apart.

export const palette = {
  night: "#0e0f12",
  "night-blue": "#1a2230",
  dusk: "#3b2a2e",
  ember: "#e0892b",
  "ember-glow": "#ffb65c",
  leather: "#5c3a21",
  brass: "#b08d57",
  paper: "#e9dcc0",
  "paper-light": "#f3ead6",
  ink: "#2a2118",
  sage: "#6e7a5a",
} as const;

export type PaletteName = keyof typeof palette;
