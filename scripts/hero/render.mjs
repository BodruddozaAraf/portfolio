// Exports the static hero (A07) from the 3D camp itself, for every visitor without WebGL (low tier,
// phones, reduced motion, Plain mode). Two layers per orientation, taken from the scene's capture
// mode (src/components/three/capture.ts) with the clock frozen:
//   far   sky, stars, ridges, valley mist (opaque)
//   near  the hillside, its trees, the camp, the fire and the horse (transparent above the land)
// plus where the fire's heart and the journal land, so the hero's CSS glow and embers sit on the
// fire at any size and the scroll zoom heads for the journal.
// Needs the site running (npm run build && npx next start -p 3100) and a Chromium:
//   BASE=http://localhost:3100 PLAYWRIGHT_CHROMIUM=<path> NODE_PATH=<dir with playwright-core> \
//     node scripts/hero/render.mjs
// Writes public/hero/{far,near}-{landscape,portrait}.{avif,webp} and
// src/components/sections/hero-art.json.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");
const sharp = require(path.resolve("node_modules/sharp"));

const BASE = process.env.BASE ?? "http://localhost:3100";
const OUT = path.resolve("public/hero");
const SIZES = {
  // a 16:10 desktop at 1920 wide, and a phone at twice 390x844
  landscape: { width: 1440, height: 900, scale: 4 / 3 },
  portrait: { width: 390, height: 844, scale: 2 },
};

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM,
  // the real GPU when there is one; SwiftShader draws the same picture, only slower
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"],
});

async function grab(layer, { width, height, scale }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
  });
  // skip the loader: it is not in the picture
  await context.addInitScript(() =>
    sessionStorage.setItem("outlaw-journal:visited", "1"),
  );
  const page = await context.newPage();
  await page.goto(`${BASE}/?tier=high&capture=${layer}`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__campCapture, null, {
    timeout: 30000,
  });
  await page.waitForTimeout(500);
  const result = await page.evaluate(() => ({
    png: document
      .querySelector("[data-camp-stage] canvas")
      .toDataURL("image/png"),
    fire: window.__campCapture.fire,
    journal: window.__campCapture.journal,
  }));
  await context.close();
  return {
    png: Buffer.from(result.png.split(",")[1], "base64"),
    fire: result.fire,
    journal: result.journal,
  };
}

const point = (p) => ({ x: +p.x.toFixed(4), y: +p.y.toFixed(4) });

const art = {};
for (const [orientation, size] of Object.entries(SIZES)) {
  for (const layer of ["far", "near"]) {
    const { png, fire, journal } = await grab(layer, size);
    const base = path.join(OUT, `${layer}-${orientation}`);
    const img = sharp(png);
    // gradients band easily: keep full chroma and a moderate quality
    await img
      .clone()
      .avif({ quality: 66, chromaSubsampling: "4:4:4", effort: 6 })
      .toFile(`${base}.avif`);
    await img
      .clone()
      .webp({ quality: 80, alphaQuality: 90, effort: 6 })
      .toFile(`${base}.webp`);
    const { width, height } = await img.metadata();
    art[orientation] = {
      width,
      height,
      fire: point(fire),
      journal: point(journal),
    };
    console.log(
      `${layer}-${orientation}: ${width}x${height}`,
      art[orientation],
    );
  }
}
await browser.close();

writeFileSync(
  path.resolve("src/components/sections/hero-art.json"),
  JSON.stringify(art, null, 2) + "\n",
);
