// Photographs each case study's share card (src/app/og-card/[page], development only) into
// public/og/<page>.jpg at 1200x630 (step 4.4, D78). Run against the dev server:
//   npm run dev   (then, in another shell)
//   BASE=http://localhost:3000 PLAYWRIGHT_CHROMIUM=<path> NODE_PATH=<dir with playwright-core> \
//     node scripts/brand/og.mjs
// Then re-embed provenance for each file (see docs/08-assets.md).
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = path.resolve("public/og");
mkdirSync(OUT, { recursive: true });

// the pages: every bounty, and the thesis
const slugs = [
  ...readFileSync("src/content/projects.ts", "utf8").matchAll(
    /^\s+slug: "([a-z-]+)",/gm,
  ),
].map((m) => m[1]);
const research = readFileSync("src/content/research.ts", "utf8").match(
  /slug: "([a-z-]+)"/,
)[1];
const pages = [...slugs, `research-${research}`];

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM,
});
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
});
// no loader in the picture
await context.addInitScript(() =>
  sessionStorage.setItem("outlaw-journal:visited", "1"),
);
const page = await context.newPage();
for (const name of pages) {
  await page.goto(`${BASE}/og-card/${name}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // the dev server's own badge is not part of the card
  await page.addStyleTag({
    content: "nextjs-portal { display: none !important; }",
  });
  await page.waitForTimeout(600);
  const file = path.join(OUT, `${name}.jpg`);
  await page
    .locator("[data-og-card]")
    .screenshot({ path: file, type: "jpeg", quality: 86 });
  console.log(`wrote ${file}`);
}
await browser.close();
