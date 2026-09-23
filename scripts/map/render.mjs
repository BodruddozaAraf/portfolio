// Renders the trail map (asset A04) from scripts/map/map.html to public/maps/trail.webp.
//   PLAYWRIGHT_CHROMIUM=<path> NODE_PATH=<dir with playwright-core> node scripts/map/render.mjs
// Then re-embed provenance:
//   .claude/skills/impeccable/scripts/impeccable embed-prompt public/maps/trail.webp
//     --prompt "Original procedural map, scripts/map/map.html"
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");
const here = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1"),
);
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM,
});
const page = await browser.newPage({ viewport: { width: 3000, height: 1000 } });
await page.goto(pathToFileURL(path.join(here, "map.html")).href, {
  waitUntil: "load",
});
const png = path.join(tmpdir(), "outlaw-trail-map.png");
// ink on white: the page multiplies it onto the paper (like the engraving plates), which lets
// the file be opaque and lossy
await page.locator("canvas").screenshot({ path: png });
await browser.close();

mkdirSync("public/maps", { recursive: true });
execFileSync("ffmpeg", [
  "-hide_banner",
  "-loglevel",
  "error",
  "-y",
  "-i",
  png,
  "-vf",
  "scale=2400:-1:flags=lanczos,format=gray",
  "-c:v",
  "libwebp",
  "-quality",
  "70",
  "public/maps/trail.webp",
]);
console.log("wrote public/maps/trail.webp");
