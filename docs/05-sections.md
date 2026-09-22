# 05 — Section Specs

The home page `/` is one continuous scroll journey. Order and chapter numbers below are
final unless changed in `09-decisions-and-questions.md`. Each section lists: **purpose**,
**content** (from `02-content.md`), **layout**, **interactions / animation**,
**reduced-motion / mobile fallback**, and **done when**.

---

## 0. Loader: "Chapter I"
- **Purpose:** hide 3D asset loading and set the mood in ≤ 3 s.
- **Content:** Chapter card "CHAPTER I · DHAKA" plus a rotating loading tip (from 02).
- **Layout:** full-screen `--night`, centered title, tip at the bottom in italic serif.
- **Animation:** a small graphite sketch (a campfire) draws itself; its progress tracks real
  asset loading (`useProgress` from drei). Fades into the hero.
- **Rules:** show only on the first visit per session (`sessionStorage`). Max 3.5 s even
  if assets are still loading (hero shows fallback image, canvas crossfades in later).
  Skippable with click/Enter.
- **Fallback:** reduced-motion shows no loader.
- **Done when:** first visit shows loader ≤ 3.5 s; revisit in the same session skips it.

## 1. Hero: "The Camp"
- **Purpose:** jaw-drop moment + instant clarity on who and what.
- **Content:** NAME (Rye, huge), "Full-Stack · AI/ML Engineer", "Dhaka · Available Oct 2026",
  two CTAs: **"Open the journal"** (scrolls) and **"Plain mode"**. Small scroll cue.
- **3D scene (R3F):** night hillside at dusk. Campfire centered in the foreground (fire
  shader + point light flicker + sparks particles), bedroll, lantern, a tethered horse as a
  dark silhouette (low-poly), pine silhouettes, layered mountains, starry sky gradient,
  volumetric-looking fog planes. The journal lies closed beside the fire.
- **Interactions:** mouse moves the camera slightly (parallax ±2°). Fire reacts to cursor
  proximity (flares). On scroll (pinned ~150vh): the camera dollies down to the journal, and
  the journal cover opens toward the viewer, crossfading into the paper page DOM of section 2.
- **Fallback:** low tier and mobile get a static rendered image (exported from the 3D scene)
  with 3–4 CSS parallax layers (sky, mountains, trees, fire glow) plus animated CSS embers.
- **Done when:** name and role visible within 2.5 s LCP; the transition to journal is smooth at
  ≥ 55 fps on high tier.

## 2. About: "Journal Entry: Dhaka, 2026"
- **Content:** journal-voice summary (02) + the plain professional summary in a small typed
  note "for the lawmen" (recruiter-friendly version). Sketch of a lamp-lit desk or laptop.
- **Layout:** two-page spread. Left: handwritten entry. Right: sketch + pasted "photograph"
  (Araf's real photo turned into a sketch look; placeholder image until then, D13), key facts in a margin note: location,
  graduating Oct 2026, languages.
- **Animation:** handwriting reveals line by line (clip-path wipe per line) as it scrolls in;
  the sketch draws itself; margin notes fade in with slight rotation.
- **Done when:** all summary facts readable as real text; animation plays once.

## 3. Wanted Poster: "Skills & Reputation"
- **Content:** WANTED poster: sketch portrait (placeholder for now, D13), name "ARAF", "For shipping a whole store in two months,
  single-handed…", REWARD line, "Known associates" = top skills. Below/around it: key
  stats as tally marks and stamps: `2 months · sole engineer`, `64 districts`, `91.9% acc`,
  `27.60 dB PSNR`, `2nd of 6`.
- **Layout:** poster nailed to a wooden post or board, centered, slight rotation. Stats as
  stamped tickets around it.
- **Animation:** the poster flutters in (wind), nails hammer in (tiny shake), the "REWARD" stamp
  slams down. Stat numbers count up. On hover the poster tilts toward the cursor (3D tilt).
- **Done when:** poster text is real HTML (selectable); count-ups respect reduced motion.

## 4. Bounty Board: "Projects"
- **Content:** 4 bounties: **The Leather Job** (Jack The Jelli), **EduBridge AI**,
  **PC-Builders**, **News Topic Classification**. Each poster: title, one-line pitch, stack
  tags, a key metric, and "Claimed" stamp. Research gets its own section (5).
- **Layout:** wooden board, posters pinned at random-ish angles (deterministic seeds so SSR
  matches). Mobile: vertical stack, full width.
- **Interactions:** hover lifts the poster (paper lifts off the pin) with a warm shadow. Click
  zooms the poster to fill the screen (shared-layout animation) and routes to
  `/bounties/[slug]`. Stack tags show ink tooltips.
- **Case study page template (`/bounties/[slug]`):** poster header → "The Job" (problem) →
  "How it was done" (architecture, key decisions, sketch diagram) → "The Take" (results,
  metrics) → stack → links (GitHub, Live) → next bounty. Written in MDX. Diagrams are
  hand-drawn-style SVGs (e.g. idempotent order flow for Jack The Jelli).
- **Done when:** all 4 case studies reachable, links correct, back navigation returns to the
  board scroll position.

## 5. Research: "The Torn Page"
- **Content:** thesis title, supervisor, "Defended 2026", architecture (Dual-Manifold VQ-VAE →
  Latent Attention U-Net Mapper → Multi-Scale Detail Injection), metrics (27.60 dB PSNR, 0.861
  SSIM, ~32 ms/256², 52.7% latent loss cut, 2nd of 6 zero-shot), Araf's owned parts.
- **Signature visual:** a journal sketch with a torn or burnt hole. As you scroll, the
  missing region "reconstructs": low-res blocky patches (VQ tokens) → refined → detailed
  (multi-scale). A metaphor for the model's pipeline. Built with a canvas or WebGL shader over
  a masked image, driven by scroll progress.
- **Architecture diagram:** hand-drawn SVG boxes and arrows that draw on.
- **Link:** "Read the full account" → `/research/image-completion`.
- **Done when:** the metaphor animation reads clearly; all metrics present as text.

## 6. The Map: "Trail So Far" (Experience + Education timeline)
- **Content (chronological):** BRAC University start (Fall 2022) → projects era → EduBridge AI
  (Freelancer.com client) → Jack The Jelli (Jun–Aug 2026) → Thesis defended (2026) →
  Graduation (Oct 2026) → "Next: your outfit?" (CTA to contact).
- **Layout:** an old paper map (original illustration: rivers, hills, a Dhaka-inspired town
  marker). Each milestone is a map pin with a small card.
- **Animation:** a dotted trail (SVG path) draws along the map as you scroll (ScrollTrigger
  scrub); pins drop as the trail reaches them; the camera pans across a large map (pinned
  horizontal scroll on desktop). Mobile: vertical trail.
- **Done when:** every milestone date and fact matches 02.

## 7. The Satchel: "Tools of the Trade" (tech stack)
- **Content:** skill categories from 02.
- **Layout:** an open leather satchel; items spill onto a cloth. Each category is a pouch
  or tin; skills are items (ink-drawn logos + labels). Also "Spoken tongues: English, Bangla".
- **Interaction:** hover a category and its items lift; click opens an inventory panel in
  the RDR2 item-card style (original design): name, "Proficiency" as a filled bar in a
  hand-drawn frame, and "Used in:" linking to bounties that use it.
- **Done when:** every skill listed; "Used in" mapping correct (derived from project data).

## 8. Camp Stories (Extracurricular)
- **Content:** football: Rising Star Tournament ×2, Best Striker, Best Midfielder, TARC
  semi-finals.
- **Layout:** a small journal page with a sketched football, two pinned medals, a
  newspaper-clipping style headline.
- **Done when:** facts present; small and charming, not a big section.

## 9. Telegram Office: "Send Word" (Contact)
- **Content:** telegram form (Name, Email, Message), plus direct links: email, GitHub,
  LinkedIn, resume download. NO phone.
- **Interaction:** typing shows typewriter-style chars; submit plays telegraph clicks, and
  the message "transmits" (letters convert to dots and dashes along a wire), then the page
  shows "DELIVERED" stamp.
- **How sending works (D19, no server):** on "Send", validate (Zod, client-side), play the
  "transmitting" animation, then show two buttons: **"Send via Gmail"** (opens
  `https://mail.google.com/mail/?view=cm&to=bodruddozaaraf@gmail.com&su=…&body=…` in a new tab)
  and **"Use my mail app"** (`mailto:` with subject/body). The mail comes from the visitor's
  own address. Subject: `Telegram from <Name> via bodruddozaaraf.me`.
- **Done when:** both links open pre-filled correctly (URL-encoded, long messages OK); a plain
  `mailto:` link works without JS.

## 10. Footer / Colophon
- "Built by hand in Dhaka", tech credits, "Inspired by a certain outlaw's journal. All art
  original.", asset attributions link, Plain mode link, sound toggle, © 2026.

---

## Global features

### Weapon Wheel navigation
- **Open:** hold `Tab` (desktop) or tap the revolver-cylinder button (always visible,
  bottom-right). Note: Tab-hold must not break normal Tab focus navigation; open only
  after a 250 ms hold, and a quick Tab press behaves normally.
- **Look:** radial wheel (original design) with 8 segments: About, Wanted, Bounties, Research,
  Map, Satchel, Camp, Telegram. Center shows the hovered section name + description.
  Background dims and time "slows" (ambient animations slow to 20%).
- **Select:** mouse direction / arrow keys / click; release or Enter jumps (Lenis
  `scrollTo`). Esc closes.

### Dead Eye (easter egg)
- **Trigger:** press `E` (or the hidden eye icon in the footer).
- **Effect:** ~6 s: screen shifts to a sepia/red-tinted desaturation (CSS filter or a
  postprocessing pass on the canvas), vignette, ambient motion at 25% speed, heartbeat
  sound (if sound on). Clicking links "marks" them with a red X; releasing opens the last
  marked link. Honored only when not in reduced-motion. A small "Dead Eye" meter depletes.
- **Discoverability:** mentioned in a loading tip.

### Ask Arthur: dropped for now (D20)
An AI chat about Araf's work was planned; deferred to "Later" in the roadmap.

### Plain mode
- Toggle in the top bar + `/plain`. Pure HTML/CSS: paper background, body serif, all content,
  links, resume download. Printable. Loads < 1 s.

### Top bar
- Left: monogram "B.A." brand mark (ink stamp). Right: Plain mode, sound toggle, wheel button.
  Hides on scroll down, returns on scroll up.
