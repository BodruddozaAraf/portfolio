# 04 — Architecture

## Stack
| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16, App Router**, TypeScript strict | Araf's primary stack; SSG for speed; good SEO |
| Styling | **Tailwind CSS v4** + CSS variables (`tokens.css`) | Fast, consistent tokens |
| 3D | **three**, **@react-three/fiber**, **@react-three/drei**, **@react-three/postprocessing** | Declarative 3D in React |
| Shaders | GLSL via `shaderMaterial` (drei) | Fire, fog, paper, ink effects |
| Scroll animation | **GSAP + ScrollTrigger** (free incl. plugins) | Industry standard, scrubbing, pinning |
| Smooth scroll | **Lenis** | Pairs with ScrollTrigger |
| UI motion | **motion** (Framer Motion) | Weapon wheel, modals, layout transitions |
| Content | **MDX** (`@next/mdx` or `next-mdx-remote`) + typed TS data | Case studies in markdown, data typed |
| Validation | **Zod** | Content schemas, contact form |
| Audio | **howler** | Simple, reliable |
| AI (Phase 5) | **Vercel AI SDK** + **AI Gateway** | Ask Arthur chat |
| Contact form | Server Action → email provider (❓ Resend via Vercel Marketplace; see decisions) | |
| Hosting | **Vercel** | Zero-config Next.js, previews per branch |
| Analytics | Vercel Analytics + Speed Insights | Free, privacy-friendly |
| Lint/format | ESLint (next config) + Prettier | |
| Package manager | npm | Already installed |

## Rendering strategy
- Every page is **statically generated** (SSG). No database.
- 3D canvas is **client-only** and **lazy-loaded** (`next/dynamic`, `ssr: false`), mounted
  after first paint. A static poster image (`hero-fallback.avif`) renders server-side first,
  so the hero has content immediately and the canvas crossfades in.
- Only the contact form and the Ask Arthur API use server code.

## Routes
| Route | Content |
|---|---|
| `/` | The full journey: loader → hero → journal chapters (all sections on one page) |
| `/bounties/[slug]` | Project case study (EduBridge AI, PC-Builders, News Topic Classification, Jack The Jelli) |
| `/research/image-completion` | Thesis case study |
| `/plain` | Plain mode: fast, text-first, printable, everything on one page |
| `/resume.pdf` | Static resume download (❓ confirm Araf wants it public) |
| `/api/ask` | Ask Arthur chat endpoint (Phase 5) |
| `not-found` | Themed 404 ("off the map") |

Plain mode is ALSO a toggle (persisted) that disables 3D, smooth scroll and effects on `/`.

## Folder structure
```
/
├─ CLAUDE.md, README.md
├─ docs/                      # all planning docs (this folder)
├─ public/
│  ├─ fonts/ (if not using next/font google)
│  ├─ textures/  models/  audio/  images/
│  └─ resume.pdf
└─ src/
   ├─ app/
   │  ├─ layout.tsx, page.tsx, not-found.tsx, globals.css
   │  ├─ plain/page.tsx
   │  ├─ bounties/[slug]/page.tsx
   │  ├─ research/[slug]/page.tsx
   │  └─ api/ask/route.ts           (Phase 5)
   ├─ content/
   │  ├─ profile.ts                 # identity, summary, links (from 02-content.md)
   │  ├─ experience.ts, projects.ts, research.ts, skills.ts, extras.ts
   │  ├─ schema.ts                  # zod schemas + inferred types
   │  └─ case-studies/*.mdx
   ├─ components/
   │  ├─ journal/     # Page, Spread, HandwrittenText, SketchSVG, InkUnderline, Stamp
   │  ├─ sections/    # Hero, About, Wanted, BountyBoard, Map, Satchel, Research, CampStories, Telegram
   │  ├─ three/       # CampScene, Campfire, FireShader, Fog, Journal3D, Sky, Terrain
   │  ├─ nav/         # WeaponWheel, TopBar, SectionIndicator
   │  ├─ fx/          # DeadEye, Cursor, Grain, Loader
   │  ├─ audio/       # SoundProvider, SoundToggle
   │  └─ ui/          # Button, Link, Modal (primitives)
   ├─ hooks/          # useReducedMotion, usePlainMode, useLenis, useDeviceTier, useSound
   ├─ lib/            # gsap setup, lenis setup, device detection, utils
   └─ styles/tokens.css
```

## State
Tiny global UI store (Zustand) for: `plainMode`, `soundOn`, `deadEye`, `wheelOpen`,
`deviceTier`, `activeSection`. Persist `plainMode` + `soundOn` in `localStorage` (wrapped in
try/catch).

## Device tiers (decide effects per device)
Computed once on load from `navigator.hardwareConcurrency`, `deviceMemory`, screen size,
and a quick GPU check (drei `PerformanceMonitor` / `detect-gpu`):
| Tier | Gets |
|---|---|
| **high** | Full 3D, postprocessing (bloom, vignette, grain), particles, shaders |
| **mid** | 3D without postprocessing, fewer particles, DPR capped at 1.5 |
| **low / mobile** | Static hero image + 2D parallax layers, no WebGL |
| **reduced-motion** | Same as low, plus no motion (see 03) |

## Performance budgets (requirements)
| Metric | Budget |
|---|---|
| LCP (mobile, 4G) | ≤ 2.5 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| Initial JS (route `/`, gzip) | ≤ 180 KB before the 3D chunk |
| 3D chunk (three + r3f + scene) | ≤ 350 KB gzip, lazy |
| 3D models total | ≤ 3 MB (glTF + Draco/Meshopt, KTX2 textures) |
| Fonts | ≤ 5 families, subset, woff2 |
| Steady-state FPS (high tier) | ≥ 55 fps on a mid laptop |
| Lighthouse mobile | Perf ≥ 85, A11y ≥ 95, BP ≥ 95, SEO 100 |

Techniques: `next/image` (AVIF), `frameloop="demand"` when the canvas is offscreen, pause
the render loop when the tab is hidden, dispose GPU resources on unmount, and code-split
each heavy section with `dynamic()`.

## Accessibility requirements
- Semantic HTML: one `h1`, logical headings, landmarks, lists for lists.
- All decorative SVG / canvas `aria-hidden`; meaningful sketches have `alt`/`aria-label`.
- Full keyboard support: weapon wheel opens with Tab-hold **and** a visible button; arrow
  keys select; Esc closes. Skip-link to content. Visible focus rings (`--ember`).
- Handwritten text is also present as real text (not images).
- Colour contrast AA minimum.
- `prefers-reduced-motion` honored everywhere (see 03 §5).
- Sound never autoplays.
- Dead Eye and other easter eggs never trap focus or hide content.

## SEO and sharing
- Metadata API: title "Bodruddoza Araf, Full-Stack & AI/ML Engineer", description from
  the summary.
- JSON-LD `Person` schema (name, jobTitle, sameAs: GitHub, LinkedIn).
- Dynamic OG images (`next/og`) styled as wanted posters, per page.
- `sitemap.ts`, `robots.ts`.
- Plain mode is crawlable and has all content.

## Environment variables
| Var | Phase | Purpose |
|---|---|---|
| `RESEND_API_KEY` (or chosen provider) | 2 | Contact form email |
| `CONTACT_TO_EMAIL` | 2 | Destination inbox |
| `AI_GATEWAY_API_KEY` (or Vercel OIDC) | 5 | Ask Arthur |
Managed with `vercel env`. Never commit `.env*`.

## Testing and quality
- `npm run typecheck`, `npm run lint`, `npm run build` must pass before every merge.
- Playwright smoke test (Phase 6): home loads, plain mode has all projects, contact form
  validates, 404 renders, no console errors.
- Lighthouse CI on preview deployments (Phase 6).
