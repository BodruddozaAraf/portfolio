// Measures the home page's JavaScript from a production build (run `npm run build` first):
//   initial JS  every <script src> in the prerendered "/" HTML, gzipped (budget 180 KB, docs/04)
//   3D chunk    every other chunk that holds three.js or the camp scene, gzipped (budget 350 KB)
// Usage: node scripts/measure-js.mjs [--json]

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const NEXT = ".next";
const html = readFileSync(join(NEXT, "server/app/index.html"), "utf8");
const initial = new Set(
  [...html.matchAll(/<script[^>]+src="\/_next\/([^"]+)"/g)].map((m) => m[1]),
);

const gz = (file) =>
  gzipSync(readFileSync(join(NEXT, file)), { level: 9 }).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

function walk(dir) {
  return readdirSync(join(NEXT, dir)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(join(NEXT, rel)).isDirectory() ? walk(rel) : [rel];
  });
}

const initialBytes = [...initial].reduce((sum, f) => sum + gz(f), 0);

// The lazy 3D chunks: three.js (its renderer), React Three Fiber (its reconciler root) or the
// camp scene (a marker string the scene module carries)
const MARKERS = ["WebGLRenderer", "__r3f", "camp-scene"];
const lazy = walk("static/chunks")
  .filter((f) => f.endsWith(".js") && !initial.has(f))
  .filter((f) => {
    const src = readFileSync(join(NEXT, f), "utf8");
    return MARKERS.some((m) => src.includes(m));
  })
  .map((f) => ({ file: f, gzip: gz(f) }));
const lazyBytes = lazy.reduce((sum, c) => sum + c.gzip, 0);

if (process.argv.includes("--json")) {
  console.log(
    JSON.stringify({ initial: initialBytes, lazy3d: lazyBytes, chunks: lazy }),
  );
} else {
  console.log(
    `initial JS (/)  ${kb(initialBytes)} gzip in ${initial.size} scripts (budget 180 KB)`,
  );
  console.log(
    `3D chunk        ${kb(lazyBytes)} gzip in ${lazy.length} chunks (budget 350 KB)`,
  );
  for (const c of lazy) console.log(`  ${c.file}  ${kb(c.gzip)}`);
}
