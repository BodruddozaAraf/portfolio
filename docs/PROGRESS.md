# PROGRESS: current state of the project

> **Update this file at the end of every session and in every PR.**
> A new session should be able to read ONLY this file and know exactly what to do next.

## Now
- **Current phase:** Phase 0: Planning
- **Current step:** 0.1 Planning docs (`docs/planning`) complete, awaiting Araf's review + answers to open questions
- **Active branch:** `docs/planning`
- **Next action:** Araf answers `09-decisions-and-questions.md` Q1–Q14 (or accepts defaults) →
  merge `docs/planning` into `main` → create GitHub remote (step 0.2) → start step 1.1
- **Blockers:** GitHub CLI (`gh`) not installed / not authenticated on this machine, so the
  remote repo can't be created by the agent yet. Araf needs to either:
  (a) `winget install GitHub.cli` then `gh auth login`, or
  (b) create an empty repo on github.com and share the URL.

## Checklist
Mirrors `06-roadmap.md`. `[x]` done · `[~]` in progress · `[ ]` todo.

### Phase 0: Planning
- [x] 0.1 Planning docs (`docs/planning`)
- [ ] 0.2 GitHub remote + push `main` + tag `v0.0.0-plan`

### Phase 1: Foundation
- [ ] 1.1 scaffold
- [ ] 1.2 design-tokens
- [ ] 1.3 content-layer
- [ ] 1.4 journal-primitives
- [ ] 1.5 sections-static
- [ ] 1.6 case-studies
- [ ] 1.7 plain-mode
- [ ] 1.8 seo-meta
- [ ] 1.9 contact-form
- [ ] 1.10 deploy → `v0.1.0`

### Phase 2: 2D Motion
- [ ] 2.1 motion-infra · [ ] 2.2 loader · [ ] 2.3 about-wanted · [ ] 2.4 bounty-board
- [ ] 2.5 map-trail · [ ] 2.6 satchel-camp-telegram · [ ] 2.7 page-transitions · [ ] 2.8 cursor-grain → `v0.2.0`

### Phase 3: 3D Camp
- [ ] 3.1 r3f-setup · [ ] 3.2 camp-environment · [ ] 3.3 campfire · [ ] 3.4 props-horse
- [ ] 3.5 scroll-camera · [ ] 3.6 postprocessing · [ ] 3.7 research-reconstruct → `v0.3.0`

### Phase 4: Signature features
- [ ] 4.1 weapon-wheel · [ ] 4.2 dead-eye · [ ] 4.3 sound · [ ] 4.4 og-images → `v0.4.0`

### Phase 5: Ask Arthur
- [ ] 5.1 ask-api · [ ] 5.2 ask-ui · [ ] 5.3 ask-evals → `v0.5.0`

### Phase 6: Polish and launch
- [ ] 6.1 perf · [ ] 6.2 a11y · [ ] 6.3 cross-browser · [ ] 6.4 tests/CI · [ ] 6.5 launch → `v1.0.0`

## Session log
Newest first. One entry per session: date, branch, what was done, what's next.

### 2026-09-23 · `docs/planning`
- Read resume (`E:\Job Search\Resumes\Bodruddoza_Araf_Resume.pdf`) incl. embedded links.
- Initialized git repo (`main`, initial commit), created `docs/planning`.
- Wrote `CLAUDE.md`, `docs/README.md`, `01`–`09`, this file.
- Environment: Windows 11, Node v22.17.0, npm 11.6.1, git user `BoduBhai`. `gh` not installed.
- **Next:** answers to open questions → merge → GitHub remote → Phase 1.
