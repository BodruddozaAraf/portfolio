# 06 — Roadmap

Phases are sequential. Steps inside a phase are mostly sequential; the order below is the
recommended order. **Each step = one branch = one PR** (see `07-git-workflow.md`).
Branch name is given for every step. Tick steps in `PROGRESS.md`, not here.

**Every UI step:** follow `10-design-skills.md` (taste pre-flight §14 + `impeccable detect src/`
before merge).

Principle: **after Phase 1 the site is deployable and useful.** Every later phase adds wow
on top of a working site; never break the working site.

---

## Phase 0: Planning ✍️
| Step | Branch | Deliverable | Done when |
|---|---|---|---|
| 0.1 | `docs/planning` | All docs in `/docs`, `CLAUDE.md`, README | Araf reviewed docs, open questions answered or defaulted |
| 0.2 | (on `main`) | GitHub remote created, `main` pushed | Repo visible on GitHub; tag `v0.0.0-plan` |

## Phase 1: Foundation (deployable, content-complete, minimal motion) 🧱
Goal: a fast, correct, good-looking *static* journal site with all content. No 3D yet.

| Step | Branch | Deliverable | Done when |
|---|---|---|---|
| 1.1 | `phase-1/scaffold` | Next.js 16 + TS strict + Tailwind v4 + ESLint/Prettier; scripts (`dev`, `build`, `lint`, `typecheck`); `CLAUDE.md` commands updated | `npm run build` passes; blank page renders |
| 1.2 | `phase-1/design-tokens` | Run impeccable `new-work` to write **`DESIGN.md`** from `03` + `10`; then `tokens.css`, Tailwind `@theme`, fonts via `next/font`, Phosphor icons, paper texture + grain + vignette, base typography, themed browser surfaces (selection, focus, scrollbar) | `DESIGN.md` committed; a `/styleguide` dev page shows all tokens, fonts, sample components; `impeccable detect src/` clean |
| 1.3 | `phase-1/content-layer` | `src/content/*` typed data + Zod schemas from `02-content.md`; MDX set up | Typecheck passes; data unit-validated at build |
| 1.4 | `phase-1/journal-primitives` | `Page`, `Spread`, `HandwrittenText`, `SketchSVG` (static), `Stamp`, `Pin`, `Poster`, `InkUnderline`, `Button`, `Link` | Showcased on the styleguide page |
| 1.5 | `phase-1/sections-static` | All sections 1–10 built statically (hero uses static art placeholder), responsive | Every fact from 02 appears; mobile has no horizontal scroll |
| 1.6 | `phase-1/case-studies` | `/bounties/[slug]` ×4 and `/research/image-completion` in MDX | All pages render, links correct |
| 1.7 | `phase-1/plain-mode` | `/plain` + toggle (Zustand store, persisted) | Plain page has all content, prints cleanly |
| 1.8 | `phase-1/seo-meta` | Metadata, JSON-LD, sitemap, robots, 404, favicon, OG image (static v1) | Lighthouse SEO 100 |
| 1.9 | `phase-1/contact-form` | Telegram form: client-side Zod validation → Gmail compose link + `mailto:` (D19) | Both links open pre-filled correctly |
| 1.10 | `phase-1/deploy` | Vercel project linked, preview per PR, production on `main`; Namecheap DNS → Vercel; remove `CNAME` from old github.io repo | https://bodruddozaaraf.me serves the site over HTTPS; tag `v0.1.0` |

## Phase 2: 2D Motion and journal feel 🎞️
Goal: the journal comes alive. Smooth scroll, drawing sketches, stamps, the map trail.

| Step | Branch | Deliverable | Done when |
|---|---|---|---|
| 2.1 | `phase-2/motion-infra` | GSAP + ScrollTrigger + Lenis setup, `useReducedMotion`, motion tokens, section reveal helper | Smooth scroll works; reduced-motion disables it |
| 2.2 | `phase-2/loader` | Chapter I loader with self-drawing sketch + tips | Spec in 05 §0 met |
| 2.3 | `phase-2/about-wanted` | Handwriting reveal, sketch draw-on, wanted poster flutter/stamp, stat count-ups | Spec 05 §2–3 met |
| 2.4 | `phase-2/bounty-board` | Pinned-poster board, hover lift, shared-layout zoom to case study | Spec 05 §4 met |
| 2.5 | `phase-2/map-trail` | Map illustration, scroll-drawn trail, pin drops, horizontal pin on desktop | Spec 05 §6 met |
| 2.6 | `phase-2/satchel-camp-telegram` | Satchel inventory interactions, camp stories, telegram typing + transmit animation | Spec 05 §7–9 met |
| 2.7 | `phase-2/page-transitions` | Route transitions (page turn / ink wipe) between home and case studies | Back nav restores scroll |
| 2.8 | `phase-2/grain` | Global film grain on a fixed `pointer-events-none` layer (no custom cursor, D26) | Off in reduced-motion; no scroll jank on mobile |
| — | merge | tag `v0.2.0` | |

## Phase 3: 3D Camp hero 🔥
Goal: the jaw-drop opener.

| Step | Branch | Deliverable | Done when |
|---|---|---|---|
| 3.1 | `phase-3/r3f-setup` | R3F canvas, lazy load, device tier detection, fallback image flow, perf monitor | Canvas lazy, JS budgets met |
| 3.2 | `phase-3/camp-environment` | Sky gradient + stars, layered terrain/mountains, pines, fog, lighting; CC0 or Blender assets | Scene composed, ≥ 55 fps high tier |
| 3.3 | `phase-3/campfire` | Fire shader, flickering point light, spark particles, cursor-reactive flare | Looks convincing; cheap on GPU |
| 3.4 | `phase-3/props-horse` | Journal model, bedroll, lantern, horse silhouette (idle anim) | Models ≤ 3 MB total, compressed |
| 3.5 | `phase-3/scroll-camera` | Scroll-scrubbed camera dolly + journal opening → crossfade into DOM About section | Seamless both directions |
| 3.6 | `phase-3/postprocessing` | Bloom, vignette, grain, color grade (high tier only) | Tiered correctly |
| 3.7 | `phase-3/research-reconstruct` | Torn-page reconstruction shader for Research section | Spec 05 §5 met |
| — | merge | tag `v0.3.0` | |

## Phase 4: Signature features 🎯
| Step | Branch | Deliverable | Done when |
|---|---|---|---|
| 4.1 | `phase-4/weapon-wheel` | Radial nav (Tab-hold + button + keyboard) | Spec in 05 "Weapon Wheel"; a11y verified |
| 4.2 | `phase-4/dead-eye` | Dead Eye mode | Spec in 05 "Dead Eye" |
| ~~4.3~~ | ~~`phase-4/sound`~~ | Moved to "Later" (D75) | |
| 4.4 | `phase-4/og-images` | Dynamic wanted-poster OG images per page (`next/og`) | Shares look great on LinkedIn/X |
| — | merge | tag `v0.4.0` | |

## Phase 5: Polish and launch 🚀
| Step | Branch | Deliverable | Done when |
|---|---|---|---|
| 5.1 | `phase-5/perf-pass` | Bundle analysis, asset compression, Lighthouse fixes | Budgets in 04 met |
| 5.2 | `phase-5/a11y-pass` | Keyboard, screen reader (NVDA), contrast, reduced-motion audit | A11y ≥ 95, manual checks pass |
| 5.3 | `phase-5/cross-browser` | Chrome, Firefox, Safari (iOS), Android mid-range | No blocking bugs |
| 5.4 | `phase-5/tests` | Playwright smoke tests + CI (GitHub Actions: lint, typecheck, build, e2e) | CI green on PRs |
| 5.5 | `phase-5/launch` | Real photo sketch for the wanted poster, analytics, final content proofread, resume PDF update | tag `v1.0.0` 🎉 |

## Later / nice-to-have (not scheduled)
- **Ask Arthur** AI chat grounded in site content (dropped for v1, D20).
- **Sound** (was step 4.3, deferred by Araf, D75): provider, toggle, ambient and UI sounds, off
  by default and remembered; needs CC0 audio downloads, each approved by Araf.
- **Thesis future work** (D17): real figures + sample outputs, report link.
- Blog ("Campfire Tales"), Bangla language toggle, a real image-completion demo running a
  small ONNX model in the browser (WebGPU), day/night cycle based on visitor's local time,
  guestbook ("Sign the ledger").
