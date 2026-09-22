# PROGRESS: current state of the project

> **Update this file at the end of every session and in every PR.**
> A new session should be able to read ONLY this file and know exactly what to do next.

## Now
- **Current phase:** Phase 0: Planning
- **Current step:** 0.2 GitHub remote. Docs are merged into `main` locally.
- **Active branch:** `main` (no step branch open)
- **Next action:** Araf runs `gh auth login` → agent creates public repo
  `BodruddozaAraf/portfolio`, pushes `main` + tag `v0.0.0-plan` → start step 1.1 on `phase-1/scaffold`.
- **Blockers:** GitHub CLI installed (winget, 2026-09-23) but **not authenticated yet**.
- **Pending from Araf (non-blocking):** Jack The Jelli screenshots (A16), real photo for the
  wanted poster later (A06).

## Checklist
Mirrors `06-roadmap.md`. `[x]` done · `[~]` in progress · `[ ]` todo.

### Phase 0: Planning
- [x] 0.1 Planning docs (`docs/planning`), open questions answered (D10–D23)
- [~] 0.2 GitHub remote + push `main` + tag `v0.0.0-plan`

### Phase 1: Foundation
- [ ] 1.1 scaffold
- [ ] 1.2 design-tokens
- [ ] 1.3 content-layer
- [ ] 1.4 journal-primitives
- [ ] 1.5 sections-static
- [ ] 1.6 case-studies
- [ ] 1.7 plain-mode
- [ ] 1.8 seo-meta
- [ ] 1.9 contact-form (client-side Gmail/mailto)
- [ ] 1.10 deploy + bodruddozaaraf.me DNS → `v0.1.0`

### Phase 2: 2D Motion
- [ ] 2.1 motion-infra · [ ] 2.2 loader · [ ] 2.3 about-wanted · [ ] 2.4 bounty-board
- [ ] 2.5 map-trail · [ ] 2.6 satchel-camp-telegram · [ ] 2.7 page-transitions · [ ] 2.8 cursor-grain → `v0.2.0`

### Phase 3: 3D Camp
- [ ] 3.1 r3f-setup · [ ] 3.2 camp-environment · [ ] 3.3 campfire · [ ] 3.4 props-horse
- [ ] 3.5 scroll-camera · [ ] 3.6 postprocessing · [ ] 3.7 research-reconstruct → `v0.3.0`

### Phase 4: Signature features
- [ ] 4.1 weapon-wheel · [ ] 4.2 dead-eye · [ ] 4.3 sound · [ ] 4.4 og-images → `v0.4.0`

### Phase 5: Polish and launch
- [ ] 5.1 perf · [ ] 5.2 a11y · [ ] 5.3 cross-browser · [ ] 5.4 tests/CI · [ ] 5.5 launch → `v1.0.0`

(Ask Arthur AI chat was dropped for v1; see D20 and roadmap "Later".)

## Session log
Newest first. One entry per session: date, branch, what was done, what's next.

### 2026-09-23 (b) · `docs/planning` → `main`
- Inspected `BodruddozaAraf/BodruddozaAraf.github.io`: only README + `CNAME` (bodruddozaaraf.me),
  auto-created by the Namecheap Student Pack flow. Decided to host on Vercel instead (D12).
- Recorded Araf's answers as decisions D10–D23 and updated all docs: contact is client-side
  Gmail/mailto (no Resend), Ask Arthur dropped, Phase 6 renumbered to Phase 5.
- Installed GitHub CLI via winget. Merged `docs/planning` into `main` (`--no-ff`).
- **Next:** `gh auth login` (Araf) → create remote → Phase 1.

### 2026-09-23 (a) · `docs/planning`
- Read resume (`E:\Job Search\Resumes\Bodruddoza_Araf_Resume.pdf`) incl. embedded links.
- Initialized git repo (`main`, initial commit), created `docs/planning`.
- Wrote `CLAUDE.md`, `docs/README.md`, `01`–`09`, this file.
- Environment: Windows 11, Node v22.17.0, npm 11.6.1, git user `BoduBhai`.
