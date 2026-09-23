---
name: The Outlaw's Journal
description: Portfolio of Bodruddoza Araf as a leather journal found beside a campfire.
colors:
  paper: "#e9dcc0"
  paper-light: "#f3ead6"
  paper-dark: "#d2bf98"
  ink: "#2a2118"
  ink-soft: "#5a4a38"
  ink-faded: "#8a7657"
  night: "#0e0f12"
  night-blue: "#1a2230"
  dusk: "#3b2a2e"
  ember: "#e0892b"
  ember-glow: "#ffb65c"
  blood: "#8e1b1b"
  leather: "#5c3a21"
  brass: "#b08d57"
  sage: "#6e7a5a"
typography:
  display:
    fontFamily: "Rye, Georgia, serif"
    fontSize: "clamp(3.25rem, 1.8472rem + 6.2346vw, 6rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Rye, Georgia, serif"
    fontSize: "clamp(2.125rem, 1.7083rem + 1.8519vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.02em"
  title:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.4167rem + 0.3704vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.2
  lead:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.2083rem + 0.1852vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "clamp(1.0625rem, 1.0208rem + 0.1852vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  hand:
    fontFamily: "Homemade Apple, Caveat, cursive"
    fontSize: "clamp(1.5rem, 1.4167rem + 0.3704vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.7
  note:
    fontFamily: "Caveat, cursive"
    fontSize: "clamp(1.25rem, 1.2083rem + 0.1852vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Special Elite, Courier New, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "IM Fell English, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter: "24px"
  section: "96px"
  measure: "68ch"
  page-max: "1280px"
components:
  button-solid:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-light}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-solid-hover:
    backgroundColor: "{colors.blood}"
    textColor: "{colors.paper-light}"
  button-outline:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-outline-hover:
    textColor: "{colors.blood}"
  button-solid-night:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.night}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-solid-night-hover:
    backgroundColor: "{colors.ember-glow}"
    textColor: "{colors.night}"
  button-solid-leather:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.leather}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  text-field:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
---

# Design System: The Outlaw's Journal

## Overview

**Creative North Star: "The Journal Found by the Fire"**

Every surface is a physical object from one frontier camp: aged paper pages written in iron-gall
ink, a pebbled leather cover, and the night around the fire. The page is never a flat fill; paper
carries procedural foxing, cloudy tooth and fibre flecks, leather carries lit grain, and a fixed
film grain sits over everything. Density is airy (one idea per spread), and structure comes from
ruled ledger lines, pasted notes and printed tickets rather than cards and panels.

The site moves from night to paper exactly once, where the journal opens; everything after that
is paper. Type does the talking in five voices: Rye woodtype for posters and chapter titles, IM
Fell English for everything a recruiter must read, two hands for journal entries and margin notes,
and a typewriter for figures and telegrams. Decorative voices never carry a fact alone.

**Key Characteristics:**
- Textured paper ground, square corners, warm offset shadows.
- One night band, lit by ember; blood red is rare and means "this matters".
- Five faces with fixed jobs; no bold weight exists in the body face.
- Controls are printed tickets with an inner hairline rule.
- Browser surfaces (selection, caret, focus, scrollbar) are themed per surface.

## Colors

A material palette, not a UI palette: paper, ink, fire, leather and one red, each named for the
thing it is.

### Primary
- **Iron-Gall Ink** (ink): body text, sketches, the solid button on paper. 11.6:1 on paper.
- **Campfire Ember** (ember): firelight, the primary action and focus ring on night. 7.1:1 on
  night. Never text on paper (2:1).

### Secondary
- **Wanted-Poster Red** (blood): stamps, Dead Eye marks, the focus ring and button hover on paper,
  selection wash. 6.7:1 on paper.
- **Saddle Leather** (leather): journal cover, satchel, board frames, the scrollbar thumb.

### Tertiary
- **Buckle Brass** (brass): buckles, rules and icons on leather or night. Decoration only on paper
  (2.3:1).
- **Prairie Sage** (sage): map terrain and success marks. Not body text (3.4:1 on paper).
- **Ember Glow** (ember-glow): hover glow and sparks on night.

### Neutral
- **Aged Paper** (paper): the page ground everywhere after the hero.
- **Fresh Sheet** (paper-light): pasted notes, posters and cards on paper; the text color on night
  and leather (16:1 on night).
- **Foxed Edge** (paper-dark): page edges, dividers, the scrollbar track.
- **Faded Ink** (ink-soft): secondary text and annotations (6.3:1).
- **Water-Stained Ink** (ink-faded): captions 24px and up, disabled states. 3.2:1, so never small
  text.
- **Campfire Night** (night), **Night Sky** (night-blue), **Dusk Horizon** (dusk): the camp, the
  sky gradient and the horizon.

### Named Rules
**The Surface Rule.** Every region is exactly one surface (paper, night or leather), set with its
utility class. The surface decides text color, accent, selection, caret, focus ring and button
colors through `--surface-*` variables; components never pick a tone themselves.

**The One Red Rule.** Blood red marks what matters (a stamp, a Dead Eye mark, focus, a hover on a
solid button). It never decorates.

**The No Raw Hex Rule.** Components use tokens only. Tailwind's default palette is cleared, so a
stray `slate-500` does not compile.

## Typography

**Display Font:** Rye (with Georgia)
**Body Font:** IM Fell English (with Georgia, Times New Roman)
**Hand Fonts:** Homemade Apple for entries, Caveat for notes
**Label Font:** Special Elite (with Courier New)

**Character:** a woodtype poster shouting over a 17th-century printed page, annotated by hand and
stamped by a typewriter. Loud display, quiet and honest text.

### Hierarchy
- **Display** (Rye 400, 52 to 96px, 1.0, uppercase, +0.02em): the hero name and poster titles.
  Never above 6rem.
- **Headline** (Rye 400, 34 to 64px, 1.05 to 1.1, uppercase, +0.02em): chapter and section titles
  (h1, h2).
- **Title** (IM Fell 400, 24 to 36px, 1.15 to 1.2): sub-headings (h3, h4), sentence case.
- **Lead** (IM Fell 400 or italic, 20 to 22px, 1.5): section intros and standfirsts.
- **Body** (IM Fell 400, 17 to 19px, 1.6, max 68ch): all reading text.
- **Hand** (Homemade Apple, 22px and up, 1.7): short journal entries only, short lines.
- **Note** (Caveat, 18px and up): margin notes and annotations.
- **Label** (Special Elite 400, 14 to 16px): token names, figures, telegrams, ledger numbers,
  tabular by nature.
- **Button** (IM Fell 400, 16px, uppercase, +0.1em): control labels.

### Named Rules
**The Italic Emphasis Rule.** IM Fell English has no bold. Emphasis in text is italic; hierarchy
comes from size, face and color. Never set `font-bold` on body text (the browser fakes it).

**The Real Text Rule.** Hand and display faces are decoration. Every fact a recruiter needs also
exists as real text in the body or label face.

**The Five Faces Rule.** Five families site-wide, the performance budget. A code face (JetBrains
Mono) is loaded only on routes that show code.

## Layout

Content sits in a centered column up to 80rem (1280px) with a 16px gutter on phones and 24px from
768px up. Reading text is capped at 68ch. Sections breathe: 64px of vertical padding on phones,
96px on desktop, with more space above a heading than below it. Structure is ledger-like: rows
separated by ink hairlines at 15% (`border-ink/15`), not boxes. Multi-column layouts collapse to
one column below 768px, declared per component; nothing may scroll horizontally.

The journal itself (from step 1.4) is a two-page spread on desktop, one page with the spine on the
left on tablet, and a single full-width page on phones.

## Elevation & Depth

Depth is physical: paper lies on paper. Shadows are always offset downward, soft, and tinted with
ink or leather, never black. Rest state is flat or pasted; lift is a response to hover.

### Shadow Vocabulary
- **Pasted** (`0 1px 1px ink/18%, 0 3px 6px -2px ink/22%`): glued flat to the page; swatches,
  tiles.
- **Pinned** (`0 2px 2px ink/16%, 0 12px 22px -10px ink/45%`): a sheet pinned at the top, corners
  lifting; posters, the styleguide header sheet.
- **Lifted** (`0 4px 4px ink/12%, 0 22px 34px -14px leather/55%`): picked up; hover on posters and
  solid buttons.
- **Night** (`0 10px 30px -12px night/85%`): objects on the night surface.

### Named Rules
**The Burn Rule.** A standalone sheet darkens toward its edges (the `burn` utility: inset leather
shadow), never a drawn border.

**The Tilt Rule.** Pasted items and handwriting may rotate up to 0.6deg; posters hanging from a
pin up to 1.5deg; stamps land up to 8deg off true. Every angle comes from a string seed
(`src/lib/seed.ts`), so server and client render the same.

## Shapes

Square everywhere: paper has cut and torn edges, not rounded corners. The radius scale is cleared;
only `rounded-none` and `rounded-full` exist, and round is reserved for real round objects (stamps,
pin heads). Borders are 1px hairlines in the surface color; controls add an inner hairline rule
inset 4px, like a letterpress ticket.

## Components

### Buttons
Printed tickets: square, uppercase IM Fell, an inner hairline rule.
- **Shape:** square (0px), inner rule 1px at 4px inset in the label color at 40%.
- **Solid:** surface solid color with the surface on-solid label (ink with paper-light on paper;
  ember with night on night; paper-light with leather on leather). Padding 14px 24px.
- **Outline:** 1px border and label in the surface text color, inner rule at 25%.
- **Hover:** lifts 2px (motion-safe only), solid turns blood on paper and ember-glow on night or
  leather with the lifted shadow; outline turns the surface accent. 200ms, journal ease.
- **Active:** presses down 1px. **Focus:** 2px surface-accent outline, 3px offset.
- **Disabled:** 55% opacity, no lift.
- **Icon:** optional trailing Phosphor icon that nudges 2px right on hover.
- Labels are 3 words max; one label per intent sitewide ("Send word" for contact).

### Text Links
Ink underline at 45% of the text color, 0.22em offset, 1px. Hover turns text and underline to the
surface accent. External links open in a new tab and announce it to screen readers.

### Inputs / Fields
- **Style:** paper-light at 70% fill, 1px ink bottom rule, square, body face. Label above, never a
  placeholder as label.
- **Focus:** the surface focus ring (blood on paper). The caret is blood on paper, ember on night.

### Icons
Phosphor, regular weight only, 1.25em by default, colored by the text. Decorative icons are
hidden from assistive tech; icon-only controls carry a label.

### Journal primitives (signature)
All server components in `src/components/journal/`, all static until Phase 2 animates them.
- **Page:** aged paper with scorched edges and a leather-tinted gutter on its bound edge.
- **Spread:** two pages on the leather cover (an 8 to 12px leather frame). Side by side from
  1024px, meeting at the spine; stacked below, each bound on its left.
- **HandwrittenText:** `entry` (Homemade Apple, 24 to 28px) or `note` (Caveat, 20 to 22px, faded
  ink). Real text; optional `lines` for per-line reveal later; seeded tilt.
- **SketchSVG:** a traced public-domain engraving (`src/content/sketches`) filled in faded ink with
  a faint displacement wobble; every path has `pathLength=1` for draw-on in step 2.3.
- **Engraving:** the raw engraving as a print: grayscale plate, paper tone lifted to white,
  multiplied onto the page with a light sepia, always captioned with title, artist and year.
- **Poster:** a fresh sheet with burn and the pinned shadow, one or two brass pins, seeded hang.
- **Pin:** a brass tack, 16px, lit from the top left, shadow down and right.
- **Stamp:** Rye caps in blood (or ink), a 3px border with an inner hairline, worn by a mask
  (`public/textures/stamp-wear.webp`), multiplied into the paper; rect or round.
- **InkUnderline:** a seeded pen stroke under a key figure, blood or ink, single or double.
- **KeyText:** renders `**key term**` markers from content as italic `<strong>`.

### Named Rules
**The Plate Rule.** Period art is either traced (SketchSVG, for anything that draws itself) or
shown raw as a plate (Engraving). Never redraw, recolor or composite it into a new picture, and
always credit it.

**The Legible Stamp Rule.** A stamp may overlap paper, never a fact. If it would cover text,
it moves into the flow.

### Surfaces (signature)
`paper`, `paper-light`, `paper-dark`, `leather` and `night` utilities set ground, texture and the
`--surface-*` variables in one class. `burn` adds scorched edges to a sheet. The global grain is a
fixed, pointer-events-none layer at 20% opacity with no blend mode, so it stays cheap to composite.

## Do's and Don'ts

### Do:
- **Do** put every region on exactly one surface utility and let `--surface-*` color its controls.
- **Do** keep body text ink on paper (11.6:1) or paper-light on night (16:1).
- **Do** use italic for emphasis in IM Fell, and Special Elite for figures and tabular data.
- **Do** theme browser surfaces: selection is a blood wash on paper and ember on night, and the
  scrollbar is leather on a paper-dark track.
- **Do** use `--ease-journal` (cubic-bezier(0.22, 1, 0.36, 1)) and the `--dur-*` tokens for motion.
- **Do** regenerate textures with `node scripts/textures.mjs`; they are original and deterministic.

### Don't:
- **Don't** use ember, brass or ink-faded for small text on paper; they fail contrast.
- **Don't** fake a bold weight in IM Fell English.
- **Don't** round corners on paper, posters or controls.
- **Don't** use overshoot or bounce curves. A pinned poster's swing is authored as keyframes that
  settle, never an overshooting global ease.
- **Don't** add a light/dark toggle; the one night-to-paper switch is the theme.
- **Don't** put eyebrow labels above headings or number sections.
- **Don't** use live SVG filter textures as page backgrounds; they are slow to rasterize. Ship the
  generated WebP tiles.
- **Don't** use em or en dashes in visible copy, or more than one middle dot per line.
