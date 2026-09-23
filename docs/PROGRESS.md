# PROGRESS: current state of the project

> **Update this file at the end of every session and in every PR.**
> A new session should be able to read ONLY this file and know exactly what to do next.

## Now
- **Current phase:** Phase 3 complete (tag `v0.3.0`). Next: Phase 4 (signature features), after
  Araf's check-in.
- **Live:** https://bodruddozaaraf.me (also https://portfolio-mauve-six-27.vercel.app; Vercel project `portfolio`, team
  "Bodzillaaa's projects"; `main` deploys to production, every PR gets a preview).
- **Active branch:** none. Next: `phase-4/weapon-wheel` (4.1), once Araf has reviewed Phase 3.
- **Next action:** wait for Araf's review of Phase 3 (check-in sent), then Phase 4 step 4.1.
- **Araf (2026-09-23, D74):** load speed and size are not strict; performance budgets are
  guidance now. The loading screen must be animated from the first paint, never a blank wait.
- **Phase 3 numbers:** before: home initial JS 278.5 KB gzip (`node scripts/measure-js.mjs`),
  Lighthouse mobile perf 72 to 73, A11y/BP/SEO 100. After 3.1: initial 279.8 KB, 3D chunk 235.5 KB
  (budget 350), models 0 MB. After 3.2: initial 279.8 KB, 3D chunk 240.5 KB, models 0 MB. After 3.3: 279.8 KB, 242.7 KB,
  0 MB. After 3.4: 279.7 KB, 245.1 KB, 0 MB models; static hero 21 KB (phone) or 34 KB (desktop)
  of AVIF; Lighthouse mobile perf 71 to 72, A11y/BP/SEO 100, CLS 0. After 3.5: 279.7 KB,
  245.8 KB. After 3.6: 279.7 KB, 247.4 KB. After 3.7: 280.2 KB, 247.4 KB (the torn page is its own
  small lazy chunk).
- **Waiting on Araf:**
  1. Vercel > `portfolio` > Settings > Domains: make `bodruddozaaraf.me` (apex) the primary domain
     and let `www` redirect to it. Today the apex redirects to `www`, but `SITE_URL`, canonicals,
     sitemap and OG (D12, D54) use the apex, so every canonical points at a redirect. (Or say the
     word and the code switches to `www` instead.)
  2. Jack The Jelli screenshots (A16), a real photo for the portrait (A06), more PD engravings
     for A05 if wanted.
- **Performance (guidance since D74):** home Lighthouse mobile performance 71 to 73 (target 85),
  home initial JS 280 KB gzip (target 180 KB). Step 5.1 may still improve them; not blocking.
- **Blockers:** none for Phase 2. (`gh` is at `C:\Program Files\GitHub CLI\gh.exe`; in Git Bash
  add it to PATH if missing: `export PATH="$PATH:/c/Program Files/GitHub CLI"`.)
- **Tooling notes for agents:**
  - The in-app browser pane often times out on screenshots and clicks. Capture with Playwright:
    `npm i playwright-core` in a scratch folder (`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`) and launch
    with `executablePath` =
    `~/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe`,
    viewports 1440x900 and 390x844, `fullPage: true` (a tall window breaks the 100dvh hero).
  - Lighthouse: `npx lighthouse` from a scratch folder with
    `CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"`, against `next start`.
  - Vercel connector: calls fail with an explicit `teamId`; call without it.
  - 3D in headless Chromium: the headless shell gets SwiftShader by default (the camp detects it
    as low tier). With `--use-angle=d3d11 --enable-gpu --ignore-gpu-blocklist` it gets the real
    GPU (RTX 3060 here). `?tier=high|mid|low` forces a tier; `?stats` records frames per second
    on `window.__campFps`; `html[data-camp]` is `off`, `loading` or `ready`.
  - JS budgets: `npm run build && node scripts/measure-js.mjs` (initial JS of `/` and the lazy
    3D chunk, gzip).
  - Araf: check Vercel (preview checks, production deploy) once at the end of each phase, not
    after every step; merge step PRs without waiting for the Vercel check.
  - Brand rasters: `scripts/brand/render.mjs` (needs `PLAYWRIGHT_CHROMIUM` + `NODE_PATH` to a
    playwright-core install); textures: `node scripts/textures.mjs`; sketches:
    `scripts/trace-sketch.mjs` then `scripts/export-sketch-svg.mjs`.

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
- [x] 1.9 contact-form (Zod-validated telegram, Gmail + mailto, `npm test`)
- [x] 1.10 deploy (live on Vercel, `v0.1.0`); custom domain DNS waiting on Araf (D57)

### Phase 2: 2D Motion
- [x] 2.1 motion-infra · [x] 2.2 loader · [x] 2.3 about-wanted · [x] 2.4 bounty-board
- [x] 2.5 map-trail · [x] 2.6 satchel-camp-telegram · [x] 2.7 page-transitions · [x] 2.8 grain → `v0.2.0` (tagged)

### Phase 3: 3D Camp
- [x] 3.1 r3f-setup · [x] 3.2 camp-environment · [x] 3.3 campfire · [x] 3.4 props-horse
- [x] 3.5 scroll-camera · [ ] 3.6 postprocessing · [x] 3.7 research-reconstruct → `v0.3.0`

### Phase 4: Signature features
- [ ] 4.1 weapon-wheel · [ ] 4.2 dead-eye · [ ] 4.3 sound · [ ] 4.4 og-images → `v0.4.0`

### Phase 5: Polish and launch
- [ ] 5.1 perf · [ ] 5.2 a11y · [ ] 5.3 cross-browser · [ ] 5.4 tests/CI · [ ] 5.5 launch → `v1.0.0`

(Ask Arthur AI chat was dropped for v1; see D20 and roadmap "Later".)

## Session log
Newest first. One entry per session: date, branch, what was done, what's next.

### 2026-09-23 (ag) · `fix/loader-sketch-timing` · Phase 3 complete
- Phase 3 Vercel check: previews of PRs #22 to #29 and every production deploy READY; production
  of `737bcba` READY on bodruddozaaraf.me. Live smoke test (desktop RTX and 390px phone): loader
  from the first paint, 3D camp ready, hero track 2250px, torn page armed, phone static picture
  with no track, no console errors.
- Found live: on a cold load the card painted at 3.9s and lifted 1.4s later with its sketch still
  drawing (the wait counted from navigation start). Now it counts from first paint; checked with
  a late paint (2.1s): lifts at 7.1s, drawing done. Then `v0.3.0` tagged.

### 2026-09-23 (af) · `fix/loader-first-paint`
- Araf: ignore load speed and size, but the site needs a good animated loading screen, never a
  blank wait (D74). The loader now animates from the first paint without scripts (self-drawing
  SVG sketch with a pen sweep, glow, embers, a crawling fuse), then follows real readiness and
  lifts when the page and camp are ready, capped at 9 s. Budgets in CLAUDE.md and 04 are now
  guidance (accessibility still required).
- Verified (Playwright, `next start`): card at about 150 ms, drawing visible at 0.4, 1.2, 2.2 s,
  lift at 3.55 s on desktop (camp ready) and phone; throttled runs keep it animated and lift at
  the cap; without JS no loader and the page shows. No console errors.

### 2026-09-23 (ae) · `phase-3/research-reconstruct`
- Torn page (D73): the Homer plate burnt through at its campfire, rebuilt on scroll as tokens,
  refined cells, then detail; the pipeline stage doing the work is inked in beside it.
- Verified (Playwright, dev and `next start`): frames at six scroll positions, stages light
  100, 010, 001 in order; reduced motion, Plain mode and a `#research` deep link keep the plate
  whole; no console errors. Initial JS +0.5 KB.

### 2026-09-23 (ad) · `phase-3/postprocessing`
- Hand-written post for the high tier (D72): half-float scene target, dual-filter bloom, a
  perceptual composite (split toning, contrast, vignette, moving grain) that eases off on the
  journal pages. 1.6 KB gzip.
- Verified (Playwright, `next start`): high vs mid captures (post only on high); 60 fps at 2x on
  high, at 4x CPU throttle and while scrolling the dolly; SwiftShader forced high still falls back
  to the static hero; dolly frames end on paper with no grade seam. No console errors.

### 2026-09-23 (ac) · `phase-3/scroll-camera`
- Scroll camera (D71): the hero sticks in a CSS-sized track (full motion, 48rem and up, scroll
  timelines, not Plain mode); the 3D camera dollies from the establishing shot to the journal,
  its cover opens, the view settles on the pages and the paper of About fades up. The static
  picture does the same with a CSS zoom of its two layers. Copy steps back early.
- Verified (Playwright, `next start`): track 2250 on desktop, 3415 on a portrait tablet, none on
  reduced motion, Plain mode and phones; frames captured at 0 to 115% for 3D and static; reverse
  scroll lands on the same frame; "Open the journal" glides through and focuses About at 0;
  `#bounties` deep link at 0; Back restores 4922 exactly; 60 fps at 2x while scrolling; 3.4
  matrix passes. No console errors.

### 2026-09-23 (ab) · `phase-3/props-horse`
- Journal (hinged cover), bedroll, lantern (second light), post, and a horse from extruded side
  profiles that breathes, swishes and grazes, its rope following the halter (D70). Portrait
  screens widen the lens and drop the fire below the copy.
- Static hero (A07) exported from the scene: far and near layers per orientation, pinned to the
  fire's point, CSS glow, embers and scroll drift for full motion. Old mask removed. `campLive`
  switched on: the 3D camp is the default hero on mid and high tiers.
- Verified (Playwright, `next start`): RTX desktop gets 3D (60 fps at 2x, also 4x CPU throttle),
  CSS glow and embers hidden under it; reduced motion, Plain mode, phone, phone reduced and
  SwiftShader get the static picture; each loads only its orientation's two AVIFs; loader 3.0s on
  first visits. Lighthouse mobile 71 to 72 / 100 / 100 / 100 (baseline 72 to 73). No console
  errors. Detector clean; provenance sidecars on the new rasters.

### 2026-09-23 (aa) · `phase-3/campfire`
- Campfire (D69): stones, crossed logs with glowing ends, four noise-shader flame cards, a halo,
  140 GPU sparks, flicker on the shared fire light, and a flare when a fine pointer comes near.
- Verified (Playwright, `next start`): 60 fps at 2x on high and mid (and at 4x CPU throttle);
  flare 0 far, 1 near, 0.04 after 3.5s; 3.1 checks pass. 3D chunk 242.7 KB. No console errors.

### 2026-09-23 (z) · `phase-3/camp-environment`
- Procedural camp land (D68): hillside, four hazed ridges, two conifer kinds instanced in stands,
  sky dome with dusk glow and twinkling stars, drifting valley mist, one shared light and haze
  model, camera framing by view offset plus a 2deg pointer turn. Nothing downloaded.
- Verified (Playwright, `next start`): 60 fps at 2x pixel ratio on high and mid (RTX 3060), also
  under 4x CPU throttling; SwiftShader forced to high (4 to 5 fps) steps down and unmounts the
  canvas, leaving the static hero; 3.1 checks all pass again (off by default, on phones, reduced
  motion, Plain mode; loader lifts at 3.0s); framing checked at 1440x900, 1920x1080 and a
  1024x1366 tablet. No console errors. 3D chunk 240.5 KB gzip.

### 2026-09-23 (y) · `phase-3/r3f-setup`
- Araf: run Phase 3 end to end (3.1 to 3.7), verify each step with Playwright, merge without
  waiting for Vercel, check Vercel and tag `v0.3.0` at the end, ask before downloading any asset.
- three 0.186, R3F 9.8, drei 10.7. `CampStage` in the hero (initial JS +1.3 KB), lazy
  `CampCanvas` chunk (235.5 KB gzip), device tiers, perf monitor, loader waits for the camp and
  its pen follows the camp's progress, 3.5s cap kept (D67). Placeholder scene: the hero's sky
  gradient. Behind the `campLive` flag, so the live site is unchanged.
- Verified (Playwright, `next start`): default and phone: no 3D chunk requested, `data-camp=off`;
  `?tier=high` and `?tier=mid`: ready at about 470ms, 60 fps (RTX 3060), canvas faded in, loader
  lifts at 3.0s; reduced motion and Plain mode: off; with the flag on (temporary build) the guess
  gives 3D on the RTX desktop and a tablet, the static hero on phones and on SwiftShader. No
  console errors. Detector clean.

### 2026-09-23 (x) · `content/resume-pdf`
- Araf: domain DNS and the github.io `CNAME` removal are done; publish the resume with the phone
  number (D66). `public/resume.pdf` added (the resume the content was derived from); the resume
  links now render in the Telegram Office and on `/plain`. Checked: `bodruddozaaraf.me` serves the
  site over HTTPS, but the apex redirects to `www` (see Waiting on Araf).

### 2026-09-23 (w) · `fix/loader-cap` · Phase 2 Vercel check
- Phase 2 Vercel check: previews of PRs #13 to #18 passed; production deploy of `5ee80b2` READY.
  Live smoke test: loader, smooth scroll, Wanted counts, trail ride, board Back restore (3272),
  `/#send-word` deep link, reduced motion: all as local, no console errors.
- Found live: on a cold load the page hydrated at about 5s, so the loader lifted late (its CSS
  fallback started at 4s). The fallback now fades from 3s, so the 3.5s cap holds without scripts
  (D59 updated). Then `v0.2.0` tagged.

### 2026-09-23 (v) · `phase-2/grain` · Phase 2 complete
- Grain flickers at 8 frames a second by transform (timer, paused when hidden), still under
  reduced motion, hidden in Plain mode (D65). SplitText `aria: "none"` fixed the About `<p>`
  aria-label that dropped home a11y to 97.
- Phase 2 regression run (Playwright, `next start`): loader, About, Wanted, board morph and back,
  trail ride and focus, satchel cards, camp medals, telegram, page turns, deep links, back
  restore, grain, reduced motion and Plain mode: all pass, no console errors. Lighthouse mobile:
  home perf 72 to 73, A11y/BP/SEO 100; `/plain` 85/100/100/100; a bounty 79/100/100/100.
- Home initial JS 279.2 KB gzip. Vercel is checked once for the phase after this merge, then
  `v0.2.0` is tagged.

### 2026-09-23 (u) · `phase-2/page-transitions`
- `PageTurn` wraps the home page and every case study; typed links turn the page forward or back
  (wipe, 700ms, D64). Untyped browser navigation is instant; the poster morph still plays.
- Found and fixed three scroll bugs on the way: hashes in the history made Back re-jump to the
  hash (glide pushed one; Next links wrote one); deep links below the Trail landed 1456px short
  because the pin spacer arrives after load; `lenis.scrollTo` right after a route change clamped
  to the previous page's height. `CleanHash` handles all three.
- Verified (Playwright, `next start`): forward and back wipes captured mid-flight; Back from a
  case study restores exactly (3272, 9125); "Back to the journal" lands on Research at 0;
  `/#send-word` deep link lands at 0 on desktop, reduced motion and phone; the top bar's Send word
  from a case study lands at 0; hashes cleared after arrival; no console errors.

### 2026-09-23 (t) · `phase-2/satchel-camp-telegram`
- Satchel pouches lift their tools on hover; every tool opens a popover item card with its pouch
  and "Used in" bounties (with taglines). `CampMoment` pastes the clipping and stamps the medals.
  Telegram: `Transmission` (Morse along a wire) then a "Composed" stamp (`SlamIn`) (D63).
- Found and fixed a JS regression from 2.3 to 2.5: static GSAP imports put about 51 KB gzip into
  the home page's initial JS. New `useLazyGsap` loads GSAP after hydration; all moments,
  `Reveal`, `SlamIn`, `Transmission` use it; `@gsap/react` removed. Home initial JS 278.4 KB.
- Verified (Playwright, `next start`): item cards open, list the right bounties, close on Esc
  with focus back on the tool; medals stamped and settled; telegram transmits then shows the
  compose links with focus on the result; reduced motion goes straight to the result; the 2.3 to
  2.5 checks all pass again after the lazy-GSAP change; no console errors.

### 2026-09-23 (s) · `phase-2/map-trail`
- A04 done: `scripts/map/map.html` + `render.mjs` draw an original survey map (contours, river,
  marsh, Dhaka town, compass) to `public/maps/trail.webp` (87 KB, multiplied onto the paper).
- Trail rebuilt: stops on a meandering SVG dotted trail over the map (static when rendered);
  `TrailMoment` pins the sheet and pans the wide map on desktop, draws the trail and drops pins
  with the scroll, draws the vertical trail on phones, and follows keyboard focus (D62).
- Verified (Playwright, `next start`): pan from 0 to -1456 px across the pin, trail clip grows
  to the last stop, cards drop in order; focusing the last stop brings it fully into view; reduced
  motion shows the static map; phone draws the trail and drops pins; no horizontal scroll; no
  console errors.

### 2026-09-23 (r) · `phase-2/bounty-board`
- Araf: check Vercel once per phase, not after every step (step PRs merge without waiting).
- `BoardMoment` (pin drop and swing), hover and focus lift on board posters, poster morph from
  the board into `/bounties/[slug]` via React `<ViewTransition>` (D61). New token `--dur-morph`.
  Stack-tag tooltips dropped (D61).
- Verified (Playwright, `next start`): posters drop and end untransformed; hover lifts 4px with
  the lifted shadow; clicking a poster morphs it into the case-study header (mid-flight capture),
  lands at scroll 0; Back restores the board scroll exactly (3272 px); reduced motion fades only;
  no console errors.

### 2026-09-23 (q) · `phase-2/about-wanted`
- `src/hooks/useScrollMoment.ts` (a section's once-only timeline), SplitText registered in
  `src/lib/gsap.ts`. `AboutMoment`: handwriting written in line by line, notes settle in.
  `WantedMoment`: flutter, pin hammer, REWARD slam, tickets and count-ups, hover lean (D60).
  `Poster` takes `moment`, `Pin` carries `data-pin`.
- Verified (Playwright, `next start`): 14 split lines wiped in and reverted after; counts run
  38 to 64 and 16.45 to 27.60 and end exact; the lean turns the poster toward the cursor; reduced
  motion fades only, figures unchanged; a reload with Wanted in view shows it finished; phone
  390 px has no horizontal scroll; no console errors.

### 2026-09-23 (p) · `phase-2/loader`
- Araf: finish Phase 2, then check in.
- "Chapter I: Dhaka" loader (`src/components/fx/Loader.tsx`, D59): server-rendered card, shown by
  the new pre-paint boot script (`src/lib/boot-script.ts`) on the first page of a session, only on
  `/`, never in Plain mode or under reduced motion. The campfire sketch draws in graphite from
  `public/sketches/campfire.svg`; the card lifts at about 2.7s, capped at 3.5s; any input skips.
  The boot script also fixes Plain mode applying after first paint (the old `beforeInteractive`
  tag ran late). `microcopy.loaderTitle`; `src/lib/features.ts` hides tips for unbuilt features.
- Verified (Playwright, `next start`): first visit shows it (tip chosen), lifts at 2.6 to 2.7s
  on desktop and phone, reload skips, Enter skips, off with reduced motion, Plain mode, no JS,
  and when a case study is the first page. No console errors in production or dev. Lighthouse
  mobile perf 73 to 74 (unchanged), A11y/BP/SEO 100.

### 2026-09-23 (o) · `phase-2/motion-infra`
- Araf: run Phase 2 step by step (branch, build, verify, PR, merge, PROGRESS), checking in after
  each step.
- Added gsap 3.15 (+ ScrollTrigger, CustomEase, `@gsap/react`) and lenis 1.3.26.
  `src/lib/motion.ts` (token mirror in seconds, `npm test` checks it against tokens.css),
  `src/lib/gsap.ts` (plugins + the `"journal"` ease), `src/hooks/useReducedMotion.ts`
  (`useReducedMotion`, `useMotionLevel`: full / reduced / none), `src/lib/lenis.ts`
  (`useLenis`), `src/components/fx/SmoothScroll.tsx` (root layout; lazy Lenis on the GSAP
  ticker, off for reduced motion, Plain mode and `/plain`; same-page anchors glide, then focus),
  `src/components/fx/Reveal.tsx` (24px rise, optional stagger; never hides in-view content).
  Styleguide Motion section reads motion.ts and demos a staggered reveal. DESIGN.md "Motion"
  (The Still Fallback Rule, The One Moment Rule). D58.
- Verified with Playwright on `next start`: Lenis on at 1440 and 390 (touch stays native), wheel
  inertia, "Open the journal" and "Send word" glide and focus their section, off under reduced
  motion, with Plain mode stored, on `/plain` and after switching Plain mode on then client
  navigating home (and back on after switching off); back from a case study restores the exact
  scroll (3179 px, same as without Lenis); reveal staggers, reduced fade settles in 195 ms; no
  console errors; no horizontal scroll.
- Lighthouse mobile, same machine: perf 74 with and without SmoothScroll (A11y/BP/SEO 100);
  initial JS +2.1 KB gzip (Lenis and GSAP load after hydration). Detector clean.

### 2026-09-23 (n) · `phase-1/deploy`
- Merged PR #10 (1.9). Created Vercel project `portfolio` and deployed `main` (`c33f8ca`) to
  production: READY in about 35 s, public at https://portfolio-mauve-six-27.vercel.app. Live
  Lighthouse: A11y/BP/SEO 100 on / and /plain; perf 77 (/) and 95 (/plain).
- Adding the custom domain was blocked by the agent's permission system (DNS/domain changes), so
  the domain steps, and removing `CNAME` from the old github.io repo, are listed for Araf (D57).
- Phase 1 complete: tag `v0.1.0`.

### 2026-09-23 (m) · `phase-1/contact-form`
- Merged PR #9 (1.8). Telegram form (`src/components/contact/TelegramForm.tsx`) in the Telegram
  Office section; compose builders `src/lib/telegram.ts`; `npm test` runs
  `scripts/test-telegram.mjs` (round-trip of tricky characters, long-message URL lengths).
  Driven end to end with Playwright: errors, focus, Gmail/mailto bodies exact, new tab, edit
  keeps the draft, no-JS mailto links present (D56).

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
