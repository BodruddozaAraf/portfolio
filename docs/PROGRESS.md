# PROGRESS: current state of the project

> **Update this file at the end of every session and in every PR.**
> A new session should be able to read ONLY this file and know exactly what to do next.

## Now
- **Current phase:** Phase 1: Foundation
- **Current step:** 1.6 case-studies done on `phase-1/case-studies` (PR open, awaiting Araf's merge).
- **Active branch:** `phase-1/case-studies`
- **Next action:** after the 1.6 PR merges, start step 1.7 on branch `phase-1/plain-mode`:
  `/plain` (all content, text-first, printable, < 1 s) + a persisted Plain mode toggle (Zustand,
  localStorage in try/catch). The TopBar, hero and colophon already link to `/plain`.
- **Blockers:** none. (`gh` is at `C:\Program Files\GitHub CLI\gh.exe`; in Git Bash add it to
  PATH if missing: `export PATH="$PATH:/c/Program Files/GitHub CLI"`.)
- **Pending from Araf (non-blocking):** Jack The Jelli screenshots (A16); real photo for the
  wanted poster and About (A06); resume PDF (A15, `/resume.pdf` is linked but missing); more PD
  engravings for A05 (satchel items, football, lantern, horse) when Araf wants them sourced.
- **Full-page screenshots:** the hero is `min-h-[100dvh]`, so a tall headless window fills with
  night. Use Playwright with a real viewport: install `playwright-core` in a scratch folder
  (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`), launch with `executablePath` pointing at
  `~/AppData/Local/ms-playwright/chromium_headless_shell-1234/.../chrome-headless-shell.exe`,
  viewport 1440x900 and 390x844, `fullPage: true`.
- **Tracing sketches:** `node scripts/trace-sketch.mjs <source.jpg> <name> --crop w:h:x:y --blur 0
  --threshold 72 --turd 30 --tolerance 1.0 --width 680 --preview out.svg` (campfire settings).
  Keep source images out of the repo; log every source in `08-assets.md`.
- **Screenshots:** the in-app browser pane often times out on screenshots. Use headless capture:
  Playwright's `chrome-headless-shell.exe` (in `~/AppData/Local/ms-playwright/`) with
  `--screenshot --window-size=390,12000` for mobile (regular headless Chrome clamps narrow widths).

## Checklist
Mirrors `06-roadmap.md`. `[x]` done · `[~]` in progress · `[ ]` todo.

### Phase 0: Planning
- [x] 0.1 Planning docs (`docs/planning`), open questions answered (D10–D23)
- [x] 0.2 GitHub remote + push `main` + tag `v0.0.0-plan`

### Phase 1: Foundation
- [x] 1.1 scaffold (Next.js 16.3.6, React 19.2, Tailwind v4, ESLint 9 + Prettier)
- [x] 1.2 design-tokens (DESIGN.md, tokens, fonts, textures, surfaces, `/styleguide`)
- [x] 1.3 content-layer (`src/content/*`, Zod + build-time invariants, MDX)
- [x] 1.4 journal-primitives (Page, Spread, HandwrittenText, SketchSVG, Engraving, Poster, Pin, Stamp, InkUnderline, KeyText)
- [x] 1.5 sections-static (all ten sections, every 02 fact on the home page)
- [x] 1.6 case-studies (4 bounties + thesis, MDX bodies, copy check in lint)
- [x] 1.7 plain-mode (`/plain`, persisted switch, print styles)
- [x] 1.8 seo-meta (Lighthouse SEO 100, a11y 100, BP 100; perf 77 owed to 5.1)
- [ ] 1.9 contact-form (client-side Gmail/mailto)
- [ ] 1.10 deploy + bodruddozaaraf.me DNS → `v0.1.0`

### Phase 2: 2D Motion
- [ ] 2.1 motion-infra · [ ] 2.2 loader · [ ] 2.3 about-wanted · [ ] 2.4 bounty-board
- [ ] 2.5 map-trail · [ ] 2.6 satchel-camp-telegram · [ ] 2.7 page-transitions · [ ] 2.8 grain → `v0.2.0`

### Phase 3: 3D Camp
- [ ] 3.1 r3f-setup · [ ] 3.2 camp-environment · [ ] 3.3 campfire · [ ] 3.4 props-horse
- [ ] 3.5 scroll-camera · [ ] 3.6 postprocessing · [ ] 3.7 research-reconstruct → `v0.3.0`

### Phase 4: Signature features
- [ ] 4.1 weapon-wheel · [ ] 4.2 dead-eye · [ ] 4.3 sound · [ ] 4.4 og-images → `v0.4.0`

### Phase 5: Polish and launch
- [ ] 5.1 perf · [ ] 5.2 a11y · [ ] 5.3 cross-browser · [ ] 5.4 tests/CI · [ ] 5.5 launch → `v1.0.0`

(Ask Arthur AI chat was dropped for v1; see D20 and roadmap "Later".)

## Session log
Newest first. One entry per session: date, branch, what was done, what's next.

### 2026-09-23 (l) · `phase-1/seo-meta`
- Merged PR #8 (1.7). Metadata base, title template, canonicals, shared OG base, JSON-LD Person,
  sitemap, robots, themed 404, favicon set and OG/Twitter image (D54), rendered by
  `scripts/brand/render.mjs` (run with `PLAYWRIGHT_CHROMIUM` and a `NODE_PATH` that has
  `playwright-core`). Lighthouse (production build): SEO/A11y/BP 100 on /, /plain, bounties,
  research. Home perf 77 simulated: hero sketch moved to a raster CSS mask, HTML 161 KB to 74 KB
  gzip (D55). Remaining perf work belongs to step 5.1.

### 2026-09-23 (k) · `phase-1/plain-mode`
- Merged PR #7. Araf asked for the rest of Phase 1 (1.7 to 1.10) end to end, PRs merged by the
  agent, then a hand-off prompt for a new chat.
- `/plain`: every fact in resume order, one column, static, prints ink-on-white with link URLs.
  Switch "Keep the whole journal plain" (`PlainModeSwitch`, `src/lib/preferences.ts`, Zustand
  persist with a safe storage). `next/script` beforeInteractive sets `html[data-plain]`; CSS
  drops grain, tilts and motion (D52). Verified toggle, persistence, pre-paint apply, no console
  errors in dev and production.
- Resume PDF withheld (D53): the resume has the phone number. Links appear once a phone-free
  `public/resume.pdf` exists.

### 2026-09-23 (j) · `phase-1/case-studies`
- Merged PR #6. Built `/bounties/[slug]` x4 and `/research/image-completion` (SSG,
  `dynamicParams = false`, unknown slugs 404). `CaseStudy` shell: wood header with the poster
  (h1), meta, live/GitHub links, back link; MDX body; the stack; "next on the board".
- MDX bodies in `src/content/case-studies/*.mdx`, typed registry `index.ts`. New MDX blocks
  `Ledger`, `Figures`, `Compare` (registered globally in `src/mdx-components.tsx`).
- Truth pass on every body: removed four phrases that went past the resume (an invented split of
  work in EduBridge, "from the first field", "delivered", Redis "in front", "the thesis asks").
- `scripts/check-copy.mjs` in `npm run lint` (D51). TopBar gained `surface="inherit"`.
- Checked: all external links 200 (Render cold-starts in about 6 s; LinkedIn answers bots with
  999, expected). Captures at 1440 and 390 for a bounty and the thesis page. Detector clean.
- **Next:** merge PR, then 1.7 plain-mode.

### 2026-09-23 (i) · `phase-1/sections-static`
- Merged PR #5. Home page `/` built from `@/content` with the journal primitives, all server
  components: TopBar (monogram, Plain mode, Send word), Hero (night, fire glow, campfire sketch
  as silhouette, 4 text elements), About (spread: entry + photo placeholder + margin facts +
  lawmen note), Wanted (poster on a wooden post, stat tickets), Bounty Board (wood, 4 seeded
  posters linking to `/bounties/[slug]`, "the job, in full" disclosure), Research (pipeline,
  metrics ledger, Homer plate, link to `/research/image-completion`), Trail So Far (pins +
  dotted trail, then the full record: job and degree), Satchel (leather, category tags with
  derived "Used in"), Camp Stories, Telegram Office (mailto CTA + direct links), Colophon.
- New: `wood` surface + `wood.webp` (A03), `shell` and `chapter` layout utilities,
  `profile.strengths` (validated skill ids) for the poster's known associates.
- Two inspection rounds with real-viewport Playwright captures (1440, 390). Fixed: hero name
  clipped on phones, false "All art original" colophon (D48), Jack poster repeating its name,
  medal text overflow, stretched satchel tags, telegram card misaligned, Wanted merging with the
  board (D49). Fact check: 44 of 44 key resume facts present (D47). No horizontal scroll at 390.
- Detector clean, provenance on 6 rasters, typecheck/lint/format/build pass.
- **Next:** merge PR, then 1.6 case-studies.

### 2026-09-23 (h) · `phase-1/journal-primitives`
- Verified Netlify is fully gone: PR #4 ran no Netlify checks, no Netlify statuses on `main`,
  `portfolioaraf.netlify.app` returns 404 (D42 done).
- Araf chose to source real sketch art now and approved the download: Winslow Homer, *Camping Out
  in the Adirondack Mountains* (Harper's Weekly 1874, SAAM 1967.66.4, CC0, 2.5 MB, kept in scratch
  only). Araf: the raw engravings are good as they are, so they ship two ways (D45): a raw plate
  (`public/engravings/camping-out-adirondacks.webp`) and a traced campfire sketch
  (`scripts/trace-sketch.mjs`, potrace dev dependency; 190 paths, 40 KB gzip).
- `src/components/journal/`: Page, Spread, HandwrittenText, SketchSVG, Engraving, Poster, Pin,
  Stamp (+ `stamp-wear.webp` mask from textures.mjs), InkUnderline, KeyText; `src/lib/seed.ts`
  for deterministic tilts (D46). All server components. `/styleguide` Journal section shows them
  with real content (journal entry + summary spread, wanted poster, Leather Job bounty poster).
- Two inspection rounds (1440px, 390px): fixed WANTED overflow, a stamp covering the stack line,
  heavy sketch tone. Detector clean; provenance on all 5 rasters. DESIGN.md: journal primitives,
  The Plate Rule, The Legible Stamp Rule, updated Tilt Rule; sidecar regenerated.
- **Next:** merge PR, then 1.5 sections-static.

### 2026-09-23 (g) · `phase-1/content-layer`
- Netlify (Araf's request, D42): disabled the Netlify connector for Claude sessions. The repo is
  still linked to Netlify site `portfolioaraf` via the Netlify GitHub App (it built a deploy
  preview for PR #3 and still deploys `main`); only Araf can unlink it in Netlify/GitHub settings.
- Content layer: `schema.ts` (Zod 4), data files `profile`, `experience` (+ education),
  `projects`, `research`, `skills`, `extras` (extracurricular, map timeline, microcopy),
  `format.ts` (month/range formatting with spaced hyphens, `**key term**` helpers),
  `validate.ts` (no dashes, no phone-like numbers, balanced markers, one middle dot, unique ids,
  skill and link cross-refs), `index.ts` (parse + validate on load, `skillUsage` map for
  "Used in", `getProject`). Root layout imports `@/content`, so every build validates (D43).
  Verified: a planted em dash, phone number and bad skill id each failed `next build`.
- Jack The Jelli bounty reuses the experience bullets verbatim. Optional facts (`client`,
  `metric`, EduBridge's date) are left empty rather than guessed.
- MDX: `@next/mdx` in `next.config.ts`, `src/mdx-components.tsx` (strong renders italic);
  `/styleguide` has a Prose section rendering `prose-sample.mdx` (D44).
- typecheck, lint, format, build, `impeccable detect` all clean; checked 1440px and 390px.
- **Next:** merge PR, then 1.4 journal-primitives.

### 2026-09-23 (f) · `phase-1/design-tokens`
- Ran impeccable `context` + `new-work`. World is brief-pinned (03, D32, D35), so no concept roll;
  direction contract in `.impeccable/surfaces/src-app-styleguide-page-tsx.md`. Code-led (no image
  generation). Araf picked **IM Fell English** body + Homemade Apple/Caveat hands (D36).
- `src/styles/tokens.css`: `@theme static` with the 03 palette, 9-step fluid type scale, warm
  shadows, `--ease-journal`, motion/layout vars; Tailwind default palette, radii, shadows cleared.
- `src/app/fonts.ts`: 5 families via `next/font` (Sancreek dropped, D37). `globals.css`: surface
  utilities `paper`/`paper-light`/`paper-dark`/`leather`/`night` + `burn`, each setting
  `--surface-*` vars that drive selection, caret, focus rings, scrollbar and button colors (D41).
- Textures: original procedural WebP tiles from `scripts/textures.mjs` (paper 115 KB, leather
  114 KB, grain 35 KB) with embedded provenance (D38). Live SVG-filter textures were too slow.
- Components: `Grain` (fixed static layer), `Icon` (Phosphor, regular), `Button` (printed ticket,
  solid/outline, surface-aware), `TextLink`. `/styleguide` (noindex, D39) reads tokens.css at build.
- impeccable: detector clean (dropped the overshoot ease, D40). Finish review and documenter ran
  in-thread (`reference/degraded/`, no subagents without Araf's ask): fix round (burn edges,
  swatch outlines, mobile motion ledger), verdict: all 3 resolved. Wrote `DESIGN.md` +
  `.impeccable/design.json`. typecheck, lint, format, build all pass.
- **Next:** merge PR, then 1.3 content-layer.

### 2026-09-23 (e) · `chore/design-skills`
- Installed (Araf's request) `design-taste-frontend` via `npx skills add … -a claude-code --copy`
  and `impeccable` via `npx impeccable install -y --providers=claude --scope=project` (the
  interactive install failed with "invalid zip data"; the non-interactive form worked).
- Engine binary + `.claude/settings.local.json` (impeccable detector hooks) are gitignored/local.
- Read both skills; wrote `docs/10-design-skills.md`, `PRODUCT.md` (impeccable product record),
  decisions D25-D34 (no custom cursor, Phosphor icons, PD engravings for sketches, hero rules,
  no proficiency bars, no dashes, no eyebrows, dials 8/8/3). Updated 03/05/06/08, CLAUDE.md.

### 2026-09-23 (d) · `phase-1/scaffold`
- Scaffolded with `create-next-app@latest` (TS, Tailwind, ESLint, App Router, `src/`, `@/*`),
  copied into the repo. Next 16.3.6 / React 19.2.8.
- Added Prettier (+ tailwind plugin, eslint-config-prettier), scripts `typecheck`
  (`next typegen && tsc --noEmit`; needed for global `LayoutProps` types), `format`, `format:check`.
- `AGENTS.md` is managed by Next.js (`next dev` rewrites its block); `CLAUDE.md` imports it.
- Placeholder home page + metadata. typecheck, lint, build all pass.

### 2026-09-23 (c) · `chore/remove-legacy-site` → `main`
- Araf authenticated `gh`. Repo `BodruddozaAraf/portfolio` already existed (old HTML/CSS/JS
  site, Feb 2026, Netlify `portfolioaraf.netlify.app`). Per Araf: its contents were deleted
  (commit on `chore/remove-legacy-site`, merged with `--allow-unrelated-histories`; the old
  site remains in history at `6122b3f`). See D24.
- Pushed `main` + tag `v0.0.0-plan`. Set repo description + homepage.
- **Next:** Phase 1, step 1.1 `phase-1/scaffold`.

### 2026-09-23 (b) · `docs/planning` → `main`
- Inspected `BodruddozaAraf/BodruddozaAraf.github.io`: only README + `CNAME` (bodruddozaaraf.me),
  auto-created by the Namecheap Student Pack flow. Decided to host on Vercel instead (D12).
- Recorded Araf's answers as decisions D10–D23 and updated all docs: contact is client-side
  Gmail/mailto (no Resend), Ask Arthur dropped, Phase 6 renumbered to Phase 5.
- Installed GitHub CLI via winget. Merged `docs/planning` into `main` (`--no-ff`).
- **Next:** `gh auth login` (Araf) → create remote → Phase 1.

### 2026-09-23 (a) · `docs/planning`
- Read resume (`E:\Job Search\Resumes\Bodruddoza_Araf_Resume.pdf`) incl. embedded links.
- Initialized git repo (`main`, initial commit), created `docs/planning`.
- Wrote `CLAUDE.md`, `docs/README.md`, `01`–`09`, this file.
- Environment: Windows 11, Node v22.17.0, npm 11.6.1, git user `BoduBhai`.
