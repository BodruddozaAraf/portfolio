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

## Tech stack (short)
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · React Three Fiber + drei · GSAP +
ScrollTrigger · Lenis · Motion (Framer Motion) · MDX · Vercel AI SDK (Phase 5) · Vercel hosting.
Package manager: **npm**. Node >= 20.9 (machine has v22).

## Commands (filled in once Phase 1 scaffolds the app)
- `npm run dev`: local dev server
- `npm run build`: production build
- `npm run lint`: lint
- `npm run typecheck`: `tsc --noEmit`
