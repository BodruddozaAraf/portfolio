// Exports every traced sketch module (src/content/sketches/*.ts) as a standalone SVG in
// public/sketches/, for places that only need the silhouette (CSS masks, <img>) and should not
// inline the path data into the HTML. Run after scripts/trace-sketch.mjs.
//   node scripts/export-sketch-svg.mjs

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const dir = "src/content/sketches";
mkdirSync("public/sketches", { recursive: true });
for (const file of readdirSync(dir).filter(
  (f) => /^[a-z-]+\.ts$/.test(f) && !["index.ts", "types.ts"].includes(f),
)) {
  const src = readFileSync(path.join(dir, file), "utf8");
  const viewBox = src.match(/viewBox: "([^"]+)"/)[1];
  // the module is a JSON-like array literal; drop a trailing comma (Prettier adds one)
  const literal = src
    .match(/paths: (\[[\s\S]*?\]),?\s*\n\s*\};/)[1]
    .replace(/,\s*\]$/, "]");
  const paths = JSON.parse(literal);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="#000" d="${paths.join(" ")}"/></svg>\n`;
  const out = path.join("public/sketches", file.replace(/\.ts$/, ".svg"));
  writeFileSync(out, svg);
  console.log(`wrote ${out} (${(svg.length / 1024).toFixed(1)} KB)`);
}
