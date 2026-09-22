# 10 — Design Skills (taste + impeccable)

Two agent skills are installed in this repo to keep the design out of "AI default" territory.
Araf asked for them (2026-09-23) and **they must be used for all UI work.**

| Skill | Where | What it is |
|---|---|---|
| **design-taste-frontend** ("tasteskill") | `.claude/skills/design-taste-frontend/SKILL.md` | Anti-slop rules for landing pages and portfolios: brief inference, three dials, AI-tell bans, a pre-flight checklist (§14) |
| **impeccable** (v4.x, by pbakaus) | `.claude/skills/impeccable/` (+ `.claude/agents/impeccable-*.md`) | A design workflow: PRODUCT.md → DESIGN.md → build → audit/critique/polish, plus a detector that scans UI files for anti-patterns |

Reinstall on a new machine (both are committed, except the impeccable engine binary):
```bash
npx skills experimental_install          # restores design-taste-frontend from skills-lock.json
npx impeccable install -y --providers=claude --scope=project   # restores engine binary + hooks
```

## Precedence (D35)
**The Outlaw's Journal theme and the plan win over the skills.** Araf's rule (2026-09-23): if a
skill conflicts with the design, drop that rule. The skills stay as quality guardrails
(accessibility, performance, AI-tell detection, copy discipline), not as art direction.
When a skill rule fights the theme, follow the theme and add a row to the overrides table below.
The agent makes these calls; Araf delegated them.

## How to use them in this project (workflow)
1. **Every UI session:** run `.claude/skills/impeccable/scripts/impeccable context` once (on
   Windows without `sh`, use `impeccable.cmd`). It loads `PRODUCT.md` and `DESIGN.md`.
2. **Before writing UI code:** read the taste skill §0–§4 and impeccable's
   `reference/craft-floor.md`. State the Design Read (below) in one line.
3. **Step 1.2 (design-tokens)** follows impeccable's `reference/new-work.md` to write
   **`DESIGN.md`** (the visual world) from `docs/03-design-system.md`. From then on,
   `DESIGN.md` is the visual authority and `03` becomes the rationale.
4. **While editing:** the impeccable hook (`.claude/settings.local.json`, local only) runs the
   detector after each Edit/Write of UI files and a deeper pass at the end of each turn.
   Act on its findings. You can also run it by hand: `.claude/skills/impeccable/scripts/impeccable detect src/`.
5. **Before merging any UI step:** run the taste pre-flight checklist (SKILL.md §14) and
   `impeccable detect src/`. For big sections, use impeccable `critique` / `audit`, and
   `polish` in Phase 5.
6. Build path is **code-first** (no image-generation tool on this machine).

## Design Read (taste §0.B)
> Reading this as: **creative developer portfolio for recruiters and engineers, with a
> cinematic Wild-West "outlaw journal" language (graphite, ink, aged paper, campfire night),
> leaning toward Next.js + Tailwind v4 + R3F + GSAP scrolltelling + custom heritage typography.**

impeccable mode: **Experience** (portfolio: the artifact leads, the interface recedes), with
Plain mode serving the recruiter "Read" need.

## Dials (taste §1)
| Dial | Value | Why |
|---|---|---|
| `DESIGN_VARIANCE` | **8** | Pinned posters, torn pages, asymmetric journal spreads |
| `MOTION_INTENSITY` | **8** | 3D hero, scroll-scrubbed camera, drawing sketches (all reduced-motion safe) |
| `VISUAL_DENSITY` | **3** | Airy pages, one idea per spread |

## Where the brief overrides the skills (justified, recorded as decisions)
Both skills say the brief wins when it is explicit. These overrides are deliberate:
| Skill rule | Our position | Justification |
|---|---|---|
| Serif discouraged as default (taste 4.1) | Serif/woodtype display (Rye, Sancreek) and an old-print body serif | Brief is explicitly heritage/vintage (1899 frontier journal). Fraunces and Instrument Serif stay banned |
| Beige/brass/espresso palette banned as default (taste 4.2) | Aged paper + ink + ember palette | The object IS an aged paper journal; the palette is the material, not a "premium" costume. Single accent rule still applies (ember on night, blood-red stamps sparingly) |
| Dark mode mandatory (taste 6.C) | No light/dark toggle; one deliberate night → paper switch | Brand requires paper pages; taste 4.11 allows one deliberate "theme switch on scroll" per page. Night camp hero → journal paper happens exactly once |
| Hand-rolled decorative SVG discouraged (taste 4.8) | Sketch art comes from **public-domain 19th-century engravings**, traced to SVG strokes for draw-on animation | Real source images instead of invented doodles (see 08-assets) |

## Rules adopted from the skills (these change the earlier plan)
- **No custom cursor** (taste 9.A). Dead Eye mode keeps its red X marks as an effect only.
- **Icons: Phosphor** (`@phosphor-icons/react`), one family, one weight. No hand-drawn icons, no emoji as icons.
- **Zero em-dashes and en-dashes in visible site copy** (taste 9.G). Date ranges use a hyphen: "June 2026 - August 2026". Middle dot `·` max one per line.
- **No eyebrows/kicker labels above headings** (impeccable: hard ban). Chapter titles are the headings themselves.
- **No section numbers** as labels (01 / 02 / …).
- **No scroll cue** in the hero; **no locale strip** in the hero ("Dhaka" lives in About).
- **Hero:** max 4 text elements (name, role line, one short sentence, CTAs), CTA labels ≤ 3 words, one label per intent sitewide (e.g. contact is always "Send word").
- **No progress/proficiency bars** in the Satchel (taste 9.F). Show "Used in" bounties instead.
- **Motion must be motivated**; one authored moment per section, not the same entrance everywhere.
- **Never mix GSAP/Three.js with Motion in the same component**; isolate in `'use client'` leaves.
- **No `window.addEventListener('scroll')`**; use ScrollTrigger, Motion `useScroll`, or IntersectionObserver.
- `min-h-[100dvh]`, never `h-screen`. Grain only on a fixed `pointer-events-none` layer.
- Theme browser surfaces too: `::selection`, caret, scrollbars, focus rings, underline offset.
- Loading uses skeletons shaped like the content, not spinners.
- Copy self-audit before merge: no forced metaphors, no "cute but wrong" lines.
