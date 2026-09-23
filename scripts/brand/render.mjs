// Renders the brand rasters from the HTML sources in this folder (needs a Chromium; see
// docs/PROGRESS.md "Full-page screenshots" for the executable path and playwright-core):
//   PLAYWRIGHT_CHROMIUM=<path> NODE_PATH=<dir with playwright-core> node scripts/brand/render.mjs
// Writes src/app/opengraph-image.jpg, twitter-image.jpg, icon.png, apple-icon.png and favicon.ico
// (from a 512px icon master in the temp folder), plus public/sketches/campfire-mask.webp.
// Afterwards re-embed provenance: .claude/skills/impeccable/scripts/impeccable embed-prompt <file>
// --prompt "<origin>" for each raster (see the origins in docs/08-assets.md).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");
const here = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1"),
);
const app = path.join(here, "../../src/app");
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM,
});

async function shot(file, width, height, out, transparent = false) {
  const type = out.endsWith(".jpg") ? "jpeg" : "png";
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(pathToFileURL(path.join(here, file)).href, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: out,
    type,
    ...(type === "jpeg" ? { quality: 86 } : { omitBackground: transparent }),
  });
  await page.close();
}

await shot("og.html", 1200, 630, path.join(app, "opengraph-image.jpg"));
await shot("og.html", 1200, 630, path.join(app, "twitter-image.jpg"));
// the hero silhouette: a raster mask is far cheaper to paint than the 190-path SVG
const maskPng = path.join(tmpdir(), "outlaw-campfire-mask.png");
await shot("sketch-mask.html", 900, 419, maskPng, true);
const master = path.join(tmpdir(), "outlaw-icon-512.png");
await shot("icon.html", 512, 512, master, true);
await browser.close();

const ff = (...args) =>
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);
ff(
  "-i",
  master,
  "-vf",
  "scale=192:192:flags=lanczos",
  path.join(app, "icon.png"),
);
ff(
  "-i",
  master,
  "-vf",
  "scale=180:180:flags=lanczos",
  path.join(app, "apple-icon.png"),
);
// favicon.ico: an ICO container holding 16, 32 and 48px PNGs (valid in every current browser)
const sizes = [16, 32, 48];
const pngs = sizes.map((size) => {
  const out = path.join(tmpdir(), `outlaw-favicon-${size}.png`);
  ff("-i", master, "-vf", `scale=${size}:${size}:flags=lanczos`, out);
  return readFileSync(out);
});
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(size, e); // width
  header.writeUInt8(size, e + 1); // height
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync(path.join(app, "favicon.ico"), Buffer.concat([header, ...pngs]));
ff(
  "-i",
  maskPng,
  "-c:v",
  "libwebp",
  "-quality",
  "55",
  "-pix_fmt",
  "yuva420p",
  path.join(here, "../../public/sketches/campfire-mask.webp"),
);
console.log("brand rasters written to src/app and public/sketches");
