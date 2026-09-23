// Checks that the 3D camp's palette (src/components/three/palette.ts) mirrors the CSS color tokens
// (src/styles/tokens.css).
//   node --experimental-strip-types --no-warnings scripts/test-palette.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { palette } from "../src/components/three/palette.ts";

const css = readFileSync(
  new URL("../src/styles/tokens.css", import.meta.url),
  "utf8",
);

for (const [name, hex] of Object.entries(palette)) {
  const m = css.match(
    new RegExp(String.raw`--color-${name}:\s*(#[0-9a-f]{6})`, "i"),
  );
  assert.ok(m, `tokens.css has no --color-${name}`);
  assert.equal(hex.toLowerCase(), m[1].toLowerCase(), `--color-${name}`);
}

console.log("camp palette: ok");
