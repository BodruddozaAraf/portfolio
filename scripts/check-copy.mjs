// Copy rules for prose the content validator cannot see (MDX bodies, docs are exempt):
// no em or en dashes in visible copy (D31), no phone numbers (D4), at most one middle dot a line.
//   node scripts/check-copy.mjs   (runs as part of `npm run lint`)

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const roots = ["src"];
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(mdx|md)$/.test(name)) files.push(p);
  }
};
roots.forEach(walk);

const rules = [
  [/[–—]/, "em or en dash; use a hyphen, comma or colon"],
  [
    /(?:\+?880[\s-]?)?\b01[3-9]\d{2}[\s-]?\d{6}\b|\d(?:[\s-]?\d){9,}/,
    "looks like a phone number",
  ],
  [/·.*·/, "more than one middle dot in a line"],
];
let failed = 0;
for (const file of files) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      for (const [re, msg] of rules)
        if (re.test(line)) {
          console.error(`${file}:${i + 1}: ${msg}`);
          failed++;
        }
    });
}
if (failed) process.exit(1);
console.log(`copy check: ${files.length} prose files clean`);
