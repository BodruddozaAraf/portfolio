# CLAUDE.md — Read this first

This file is the entry point for any AI agent (or human) picking up this project cold.
Context from earlier conversations is NOT available to you. The docs are the only memory.

## What this project is
A highly animated, 3D, Wild-West-themed personal portfolio for **Bodruddoza Araf**
(Full-Stack Developer / AI & ML Engineer, Dhaka, Bangladesh). The whole site is framed as
**"The Outlaw's Journal"**: a leather journal found beside a campfire, whose pages hold his
story, projects and experience. Inspired by Arthur Morgan's journal in *Red Dead Redemption 2*,
but built with **original art only** (see IP rules in `docs/01-vision.md`).

## Mandatory reading order (every new session)
1. `docs/PROGRESS.md`: **what stage we are in, what's done, what's next.** Always read first.
2. `docs/README.md`: index of all docs.
3. The doc(s) for the phase you are working on (see `docs/06-roadmap.md`).
4. `docs/09-decisions-and-questions.md`: decisions already made; do NOT re-litigate them.
5. For ANY UI work: `docs/10-design-skills.md`, then `PRODUCT.md` and `DESIGN.md` (repo root).

## Hard rules
- **Content source of truth is `docs/02-content.md`** (derived from the resume). Never invent
  projects, numbers, dates or claims. Projects come from the resume, NOT from GitHub.
- **Never publish the phone number** from the resume on the site.
- **No Rockstar assets**: no RDR2 logos, screenshots, ripped models, soundtrack, fonts, or
  Arthur Morgan's face/likeness. Original "outlaw journal" aesthetic only.
- **Git workflow is mandatory** (`docs/07-git-workflow.md`): never commit directly to `main`.
  One branch per phase step, merged via PR (or `--no-ff` merge if no remote yet).
- **Update `docs/PROGRESS.md`** at the end of every work session and in every PR:
  tick finished steps, note the current branch, blockers and next action.
- If a decision changes, record it in `docs/09-decisions-and-questions.md` with a date.
- Performance and accessibility budgets in `docs/04-architecture.md` are requirements, not goals.
- **Design skills are mandatory for UI work**: `design-taste-frontend` and `impeccable`
  (`.claude/skills/`). Follow the workflow in `docs/10-design-skills.md`, including the
  pre-flight checklist and `impeccable detect src/` before merging a UI step.
- Zero em-dashes or en-dashes in visible site copy.

## Tech stack (short)
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber + drei · GSAP +
ScrollTrigger · Lenis · Motion (Framer Motion) · MDX · Vercel hosting.
Domain: **bodruddozaaraf.me** (Namecheap DNS → Vercel). Repo: `BodruddozaAraf/portfolio`.
Package manager: **npm**. Node >= 20.9 (machine has v22).

## Commands
- `npm run dev`: local dev server (http://localhost:3000)
- `npm run build`: production build
- `npm run lint`: ESLint (next core-web-vitals + typescript + prettier)
- `npm run typecheck`: `tsc --noEmit`
- `npm run format` / `npm run format:check`: Prettier (with Tailwind class sorting)
- **Before every merge:** `npm run typecheck && npm run lint && npm run build`

## Next.js version note
Next.js 16.3 is newer than most training data. `AGENTS.md` (managed by Next.js, imported
below) says to read the bundled docs in `node_modules/next/dist/docs/` before writing code.

@AGENTS.md
