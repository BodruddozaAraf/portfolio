// Exports every traced sketch module (src/content/sketches/*.ts) as a standalone SVG in
// public/sketches/, for places that only need the silhouette (CSS masks, <img>) and should not
// inline the path data into the HTML. Run after scripts/trace-sketch.mjs.
// Each sketch also gets a `-draw.svg` twin that draws itself in paper-light graphite with its own
// CSS animation, so an <img> of it animates from the first paint, before any script (the loader).
//   node scripts/export-sketch-svg.mjs

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const dir = "src/content/sketches";
const tokens = readFileSync("src/styles/tokens.css", "utf8");
const ink = tokens.match(/--color-paper-light:\s*(#[0-9a-f]{6})/i)[1];
// one path: the pen stroke draws, then a faint wash of tone fills in behind it
const drawStyle = [
  // the traced strokes are scattered, so a sweep from left to right makes the drawing travel
  `path{fill:${ink};fill-opacity:0;stroke:${ink};stroke-width:.7;stroke-dasharray:1;stroke-dashoffset:1;clip-path:inset(0 100% 0 0);animation:d 2.2s cubic-bezier(.45,0,.55,1) .1s forwards,c 2.2s cubic-bezier(.3,0,.4,1) .1s forwards,w .6s ease 2.2s forwards}`,
  "@keyframes d{to{stroke-dashoffset:0}}",
  "@keyframes c{to{clip-path:inset(0 0 0 0)}}",
  "@keyframes w{to{fill-opacity:.18}}",
  "@media (prefers-reduced-motion:reduce){path{animation:none;stroke-dashoffset:0;clip-path:none;fill-opacity:.18}}",
].join("");
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
  const d = paths.join(" ");
  const draw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><style>${drawStyle}</style><path pathLength="1" d="${d}"/></svg>\n`;
  const drawOut = out.replace(/\.svg$/, "-draw.svg");
  writeFileSync(drawOut, draw);
  console.log(`wrote ${drawOut} (${(draw.length / 1024).toFixed(1)} KB)`);
}
