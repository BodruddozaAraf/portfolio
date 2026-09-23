// Checks that the GSAP motion tokens (src/lib/motion.ts) mirror the CSS ones (src/styles/tokens.css).
//   node --experimental-strip-types --no-warnings scripts/test-motion-tokens.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dur, easeJournal, stagger } from "../src/lib/motion.ts";

const css = readFileSync(
  new URL("../src/styles/tokens.css", import.meta.url),
  "utf8",
);
const ms = (name) => {
  const m = css.match(new RegExp(String.raw`--${name}:\s*(\d+)ms`));
  assert.ok(m, `tokens.css has no --${name}`);
  return Number(m[1]) / 1000;
};

const cssDurations = [...css.matchAll(/--dur-([a-z]+):/g)].map((m) => m[1]);
assert.deepEqual(
  cssDurations.sort(),
  Object.keys(dur).sort(),
  "motion.ts dur has the same names as the --dur-* tokens",
);
for (const name of cssDurations)
  assert.equal(dur[name], ms(`dur-${name}`), `--dur-${name}`);
assert.equal(stagger, ms("stagger"), "--stagger");

const ease = css.match(/--ease-journal:\s*cubic-bezier\(([^)]+)\)/);
assert.ok(ease, "tokens.css has --ease-journal");
assert.deepEqual(
  ease[1].split(",").map(Number),
  [...easeJournal],
  "--ease-journal",
);

console.log("motion tokens: ok");
