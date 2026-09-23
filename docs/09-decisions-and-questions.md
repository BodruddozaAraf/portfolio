# 09 — Decisions and Open Questions

## Decision log
Newest at the bottom. Don't re-open a decision without Araf's say-so; if one changes, add a
new row that supersedes the old one.

| # | Date | Decision | Why |
|---|---|---|---|
| D1 | 2026-09-23 | Theme: Wild West outlaw journal inspired by Arthur Morgan / RDR2; original art only | Araf's choice; IP-safe approach |
| D2 | 2026-09-23 | Content comes from the resume, **not** GitHub | Araf's instruction |
| D3 | 2026-09-23 | Stack: Next.js 16 App Router, TS, Tailwind v4, R3F, GSAP, Lenis, Motion, MDX, Vercel | Matches Araf's skills; best-in-class for this kind of site |
| D4 | 2026-09-23 | Phone number never shown on the site | Privacy |
| D5 | 2026-09-23 | Phase 1 ships a content-complete static site before any 3D | Always have a working, deployable portfolio |
| D6 | 2026-09-23 | Git: `main` + one branch per step, merge commits (`--no-ff`), milestone tags | Easy tracking and rollback (Araf's request) |
| D7 | 2026-09-23 | Jack The Jelli gets its own bounty case study (besides the 3 resume projects) | It's the strongest story on the resume |
| D8 | 2026-09-23 | ~~AI chat persona is "an old camp hand"~~ superseded by D19 | IP safety |
| D9 | 2026-09-23 | npm as package manager | Already installed |
| D10 | 2026-09-23 | GitHub repo name: **`portfolio`** (public), under `BodruddozaAraf` | Q1 |
| D11 | 2026-09-23 | Domain: **`bodruddozaaraf.me`** (Namecheap, free via GitHub Student Pack, **expires ~Sept 2027**, renew or migrate before then). Status: Active | Q2 |
| D12 | 2026-09-23 | Hosting: **Vercel**, not GitHub Pages. DNS at Namecheap: `A @ 76.76.21.21`, `CNAME www cname.vercel-dns.com`. Remove `CNAME` file from the old `BodruddozaAraf.github.io` repo | Server features + previews; GitHub Pages is static only |
| D13 | 2026-09-23 | Wanted poster uses a **real photo turned into a sketch**, but a **placeholder image** is used until the site is built | Q3, Q12 |
| D14 | 2026-09-23 | Resume PDF is public at `/resume.pdf` | Q4 |
| D15 | 2026-09-23 | BRAC University start: **Fall 2022** | Q5 |
| D16 | 2026-09-23 | News Topic Classification has no public link | Q6 |
| D17 | 2026-09-23 | Thesis figures/sample outputs are **deferred to "Future work"** (roadmap "Later"). v1 shows metrics, the architecture diagram and the metaphor animation only | Q7 |
| D18 | 2026-09-23 | Jack The Jelli: may show screenshots + client name/link (Araf to provide screenshots) | Q8 |
| D19 | 2026-09-23 | **No email service (Resend dropped).** Contact = "telegram" form that composes the message client-side and opens it in the visitor's own mail (Gmail compose link + `mailto:` option), addressed to bodruddozaaraf@gmail.com. No server code for contact | Q9: Araf wants mail to come *from the sender's own address*; a service like Resend can only send from our domain (with the visitor as reply-to), so it was dropped |
| D20 | 2026-09-23 | **Ask Arthur AI chat dropped for now** (moved to "Later"). Phase 5 removed; Polish & launch is now Phase 5 | Araf's decision |
| D21 | 2026-09-23 | Wanted poster name: just **"ARAF"** (full name elsewhere); no outlaw nickname | Q11 |
| D22 | 2026-09-23 | No Blender assumed: free CC0 models + procedural geometry | Q13 default |
| D23 | 2026-09-23 | Nothing beyond the resume to feature | Q14 |
| D24 | 2026-09-23 | Reuse existing GitHub repo `portfolio`: old site's files deleted in a normal commit (history kept at `6122b3f`, no force-push). Old Netlify site `portfolioaraf.netlify.app` is obsolete; Araf to remove it on Netlify | Araf: "delete the contents… I don't need them anymore" |
| D25 | 2026-09-23 | Design skills installed and mandatory for UI work: `design-taste-frontend` (Leonxlnx/taste-skill) and `impeccable` (pbakaus). Workflow in `docs/10-design-skills.md`; product record in `PRODUCT.md`; `DESIGN.md` written in step 1.2 | Araf's request |
| D26 | 2026-09-23 | **No custom cursor** (supersedes 03 §6 cursor spec). Dead Eye keeps red X marks as an effect | Taste skill 9.A: custom cursors are an AI tell and hurt accessibility/performance |
| D27 | 2026-09-23 | Icons: Phosphor Icons only, one weight | Taste 3.C, 9.E |
| D28 | 2026-09-23 | Sketch art from public-domain 19th-century engravings, traced to SVG strokes (supersedes "generated SVG line art") | Taste 4.8: avoid invented decorative SVGs; PD engravings fit the era |
| D29 | 2026-09-23 | Hero: max 4 text elements, no scroll cue, no location strip | Taste 4.7, 9.F |
| D30 | 2026-09-23 | Satchel: no proficiency bars | Taste 9.F |
| D31 | 2026-09-23 | Zero em/en dashes in visible copy; `·` max one per line | Taste 9.G |
| D32 | 2026-09-23 | No dark-mode variant: one deliberate night → paper theme switch; heritage serif + paper palette are justified overrides | Brief is explicitly vintage; taste 4.11 allows one theme switch |
| D33 | 2026-09-23 | No eyebrow labels or section numbers; chapter numbering only on the loader title card | impeccable craft floor (hard ban), taste 9.F |
| D34 | 2026-09-23 | Taste dials: VARIANCE 8, MOTION 8, DENSITY 3. impeccable mode: Experience. Build path: code-first | See `10-design-skills.md` |
| D35 | 2026-09-23 | Theme/plan beats the design skills on any conflict; skills are guardrails only. Agent decides conflicts (delegated by Araf). `PRODUCT.md` accepted | Araf: "if the skills conflict with the design then drop them, it's your call" |
| D36 | 2026-09-23 | Body serif is **IM Fell English** (regular + italic, no bold). Handwriting: Homemade Apple (≥ 22px entries) + Caveat (≥ 18px notes) | Araf's pick in step 1.2. Emphasis is italic; hierarchy by size, face, color |
| D37 | 2026-09-23 | Font budget: 5 families site-wide (Rye, IM Fell English, Homemade Apple, Caveat, Special Elite). **Sancreek dropped**; JetBrains Mono loads only on routes that show code (step 1.6) | `04` budget is ≤ 5 families |
| D38 | 2026-09-23 | Paper, leather and grain textures are **original procedural rasters** from `scripts/textures.mjs` (WebP ≤ 150 KB each), not downloaded CC0 files. Live SVG filter backgrounds rejected | SVG `feTurbulence` backgrounds rasterized so slowly that the browser pane could not screenshot; rasters are cheap and IP-clean |
| D39 | 2026-09-23 | `/styleguide` ships in builds but is unlinked and `noindex` | Useful on Vercel previews for review; not part of the site |
| D40 | 2026-09-23 | No overshoot/bounce easing tokens. The "pin settle" becomes a keyframed swing in step 2.4 | impeccable detector (bounce-easing); `03` motion principle "nothing bounces" |
| D41 | 2026-09-23 | Theme mechanics: every region uses one surface utility (`paper`, `paper-light`, `paper-dark`, `leather`, `night`) that sets `--surface-*` vars; buttons, links, selection, caret and focus read them. Radius scale cleared (square only), Tailwind default palette cleared | See DESIGN.md "The Surface Rule" |
| D42 | 2026-09-23 | **No Netlify, anywhere** (supersedes the Netlify note in D24). The Netlify connector is disabled in Claude sessions; Araf unlinks the `portfolioaraf` site from the repo and removes the Netlify GitHub App's access. Vercel is the only host (D12) | Araf: "I don't want any affiliations with Netlify" |
| D43 | 2026-09-23 | Content layer: typed data in `src/content/*`, parsed by Zod and cross-checked (no dashes, no phone-like numbers, balanced `**key term**` markers, known skill ids, real bounty/research links) when `@/content` loads; the root layout imports it, so every build validates. Grouped resume skills are split into single skills for "Used in". Optional fields (`client`, `metric`, timeline `when`) stay empty rather than guessed | Step 1.3; never invent facts |
| D44 | 2026-09-23 | Case-study metadata lives in `src/content/projects.ts`; MDX files hold only the body. `@next/mdx` with `src/mdx-components.tsx` (strong renders italic, D36) | One source of truth per fact |
| D45 | 2026-09-23 | Public-domain engravings are used two ways (Araf: the raw images are good as they are): **raw plates** via `Engraving` (grayscale, paper tone lifted, multiplied onto the page, captioned) and **traced sketches** via `SketchSVG` for draw-on. Tracing pipeline: `scripts/trace-sketch.mjs` (ffmpeg + `potrace`, a dev-only GPL-2.0 tool that never ships). First source: Winslow Homer, *Camping Out in the Adirondack Mountains* (1874, SAAM, CC0) | Araf approved sourcing and the download in step 1.4 |
| D46 | 2026-09-23 | Tilt allowances: pasted items and handwriting up to 0.6deg, pinned posters up to 1.5deg, stamps up to 8deg; all seeded. Stamps never cover facts (DESIGN.md, The Legible Stamp Rule) | A 0.6deg poster board reads as a grid, not a board |

## Open questions for Araf
None currently open. Add new ones here as `Q15`, `Q16`, … with a default.

| # | Question | Default if unanswered |
|---|---|---|
| — | — | — |
