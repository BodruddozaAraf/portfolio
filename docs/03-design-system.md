# 03 — Design System

> From step 1.2 on, **`DESIGN.md` (repo root, impeccable format) is the visual authority**;
> this file is the original rationale. Skill rules and overrides: `10-design-skills.md`.

All tokens are defined once as CSS custom properties in `src/styles/tokens.css` and exposed
to Tailwind v4 via `@theme`. Never hard-code hex values in components.

## 1. Color

### Paper and ink (journal pages; the default "light" surface)
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#E9DCC0` | Main page background (aged paper) |
| `--paper-light` | `#F3EAD6` | Highlights, cards on paper |
| `--paper-dark` | `#D2BF98` | Page edges, shadows, dividers |
| `--ink` | `#2A2118` | Body text, sketches (graphite/iron-gall ink) |
| `--ink-soft` | `#5A4A38` | Secondary text, annotations |
| `--ink-faded` | `#8A7657` | Captions, disabled |

### Night camp (3D hero, overlays, weapon wheel; the "dark" surface)
| Token | Hex | Use |
|---|---|---|
| `--night` | `#0E0F12` | Base background |
| `--night-blue` | `#1A2230` | Sky gradient, fog tint |
| `--dusk` | `#3B2A2E` | Horizon gradient |
| `--ember` | `#E0892B` | Firelight, primary accent, focus rings on dark |
| `--ember-glow` | `#FFB65C` | Hover glow, sparks |

### Accents (use sparingly)
| Token | Hex | Use |
|---|---|---|
| `--blood` | `#8E1B1B` | Wanted-poster stamps, Dead Eye marks, "important" |
| `--leather` | `#5C3A21` | Journal cover, satchel, wooden board |
| `--brass` | `#B08D57` | Buckles, dividers, icons on leather |
| `--sage` | `#6E7A5A` | Map terrain, success states |

**Contrast rules:** body text is always `--ink` on `--paper` (~12:1) or `--paper-light` on
`--night`. `--ink-faded` (3.2:1) only for text ≥ 24px or decoration; `--ember`, `--brass` and
`--sage` never carry small text on paper. Verify every new pair ≥ 4.5:1 (AA). The `/styleguide`
page computes every pairing from `tokens.css`.

**Theme note:** the site does not have a light/dark toggle. It moves *narratively* from night
(hero) to paper (journal) exactly once, a deliberate "theme switch on scroll" (D32). Plain
mode uses paper + ink only.

**Copy typography rules:** zero em-dashes/en-dashes in visible copy (use hyphens, commas,
colons); `·` at most once per line; no eyebrow labels above headings; no section numbers.

## 2. Typography
All fonts are free (Google Fonts / OFL), loaded with `next/font` and self-hosted, `display: swap`.

| Role | Font | Fallback | Notes |
|---|---|---|---|
| Display: posters, chapter titles | **Rye** | Georgia, serif | Western woodtype. Uppercase, tracking +0.02em. Headlines only. |
| Handwriting: journal entries, annotations | **Homemade Apple** (alt: **Caveat** for smaller sizes) | cursive | Never below 18px. Keep lines short. |
| Body: case studies, plain mode | **IM Fell English** (D36) | Georgia, serif | Regular + italic only: emphasis is italic, never bold. Body 17 to 19px. |
| Mono: code, stats, telegram | **Special Elite** (typewriter) for flavor; **JetBrains Mono** for real code | monospace | |

**Type scale** (fluid with `clamp()`): 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 96 px.
Line-height 1.6 body, 1.1 display. Max line length 70ch.

**Readability rule:** handwriting and display fonts are decoration. Any fact a recruiter
needs (title, dates, stack, metrics) must also appear in the body or mono font.

## 3. Textures and materials
- **Paper:** tiled CC0 paper texture + subtle SVG `feTurbulence` noise overlay + vignette
  burn at page edges. Slight random rotation (±0.6°) on pinned or pasted items.
- **Graphite sketches:** SVG line art, animated with `stroke-dashoffset` so they draw
  themselves. Use a hand-drawn roughness filter (`feDisplacementMap`) for wobble.
- **Ink:** blots and splatters as decorative SVGs; hand-underlines under key metrics.
- **Leather:** journal cover, satchel, board frame. Normal-mapped in 3D, CSS texture in 2D.
- **Wood:** bounty board planks.
- **Film grain:** a very subtle global grain overlay (canvas or CSS), off in reduced-motion.

## 4. Iconography
**Phosphor Icons** (`@phosphor-icons/react`), one family, one weight, tinted with the
ink/ember tokens (D27). No hand-drawn icons, no emoji or Unicode glyphs as icons. For tech-stack logos use simple
monochrome ink versions (Simple Icons, CC0), tinted `--ink`, never full-color brand logos
on the paper.

## 5. Motion language
**Principle: weighty, cinematic, organic.** Things are *drawn*, *pinned*, *stamped*,
*unfolded*. Nothing bounces like an app.

| Motion | Spec |
|---|---|
| Default ease | `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint-ish) |
| Page / section reveal | 600–900 ms, translateY 24px → 0 + opacity, staggered 60 ms |
| Sketch draw-on | 1.2–2.4 s, `stroke-dashoffset`, linear-ish with slight ease |
| Stamp (wanted "REWARD", "DELIVERED") | scale 1.6 → 1, rotate −8°, 180 ms, then 2px shake |
| Pin a poster | drop from −40px, keyframed swing that settles (no overshoot curve, D40), 500 ms |
| Page turn | The new page wipes over the old like a leaf turned from the right edge (forward) or left (back), old page dimmed under it, 700 ms (D64; the 3D page curl is not built) |
| Camera moves (3D) | scroll-scrubbed via GSAP ScrollTrigger, never time-based while scrolling |
| Hover | lift 2–4px + warm shadow, 200 ms |
| Magnetic cursor elements | max 12px pull |

**Scrolling:** Lenis smooth scroll (lerp ~0.1). ScrollTrigger synced to Lenis.

**Reduced motion (`prefers-reduced-motion: reduce`):** no smooth scroll, no parallax, no
camera moves, no Dead Eye time slow. Sketches appear fully drawn. Fades ≤ 200 ms only.
3D hero replaced by a static rendered image.

## 6. Cursor
**No custom cursor** (D26, taste skill 9.A). The native cursor stays. Dead Eye mode
draws red "X" marks where you click, as a visual effect only.

## 7. Sound (off by default)
- Toggle in the corner (icon: a harmonica or a speaker drawn in ink). Choice remembered in
  `localStorage`.
- Ambient: campfire crackle + night wind (hero), soft page rustle (journal).
- UI: page flip, pin tack, stamp thunk, telegraph clicks on submit, heartbeat in Dead Eye.
- All sounds CC0 / original (see `08-assets.md`). Volume ≤ −18 LUFS, short and subtle.
- Library: Howler.js (or a lightweight Web Audio wrapper).

## 8. Layout
- Desktop: journal pages are a two-page spread (left and right pages), max width ~1280px.
- Tablet: single page with the spine on the left.
- Mobile: single page, full width, 16px gutter, pinned elements stacked, no horizontal scroll.
- Grid: 12 columns desktop / 4 columns mobile, 24px / 16px gutters.
