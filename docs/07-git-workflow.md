# 07 — Git Workflow

Goal: every change is traceable and reversible. Anyone can see what changed, when, and why,
and roll back to any milestone.

## Branches
| Branch | Purpose | Rules |
|---|---|---|
| `main` | Always deployable. Production deploys from here. | **Never commit directly.** Only merges from step branches. |
| `docs/<topic>` | Documentation-only changes | e.g. `docs/planning`, `docs/update-content` |
| `phase-N/<step>` | One roadmap step (see `06-roadmap.md`) | e.g. `phase-1/scaffold` |
| `fix/<short-desc>` | Bug fixes found after a step merged | e.g. `fix/map-trail-safari` |
| `content/<short-desc>` | Copy or data-only changes | e.g. `content/resume-oct-update` |

No long-lived `develop` branch: the project is solo, and step branches + `main` is enough.

## Lifecycle of a step
```bash
git checkout main && git pull            # start from latest main
git checkout -b phase-1/scaffold         # branch named exactly as in 06-roadmap.md
# ...work, commit often...
npm run typecheck && npm run lint && npm run build   # must pass (once app exists)
# update docs/PROGRESS.md (tick step, log session)
git push -u origin phase-1/scaffold
# open PR → Vercel preview → review → merge (squash NOT used; use merge commit)
```
If there is no GitHub remote yet, merge locally with `git merge --no-ff <branch>` so the
branch history stays visible.

**Merge style:** merge commits (`--no-ff`), not squash, so each step's detailed commits are
preserved and any single commit can be reverted.

**Delete** the remote branch after merge (history stays in `main`).

## Commit messages: Conventional Commits
```
<type>(<scope>): <summary in imperative, ≤ 72 chars>

<optional body: what and why>
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `content`, `build`, `ci`.
Scopes: section or area names, e.g. `hero`, `wanted`, `bounty`, `map`, `satchel`, `three`,
`nav`, `deadeye`, `ask`, `content`, `tokens`.

Examples:
- `feat(bounty): pin posters with seeded rotation`
- `perf(three): compress horse model with meshopt`
- `content(projects): update EduBridge metrics`
- `docs(progress): complete step 1.3`

## Pull requests
PR title = `[Step X.Y] <description>`. Body template:
```
## Step
X.Y: <name> (docs/06-roadmap.md)

## What changed
- ...

## How to verify
- Preview URL: ...
- Steps: ...

## Checklist
- [ ] typecheck / lint / build pass
- [ ] reduced-motion checked
- [ ] mobile checked
- [ ] docs/PROGRESS.md updated
```

## Tags (milestones)
| Tag | Meaning |
|---|---|
| `v0.0.0-plan` | Planning docs merged |
| `v0.1.0` | Phase 1: foundation live |
| `v0.2.0` | Phase 2: 2D motion |
| `v0.3.0` | Phase 3: 3D hero |
| `v0.4.0` | Phase 4: signature features |
| `v0.5.0` | Phase 5: Ask Arthur |
| `v1.0.0` | Launch |

Annotated tags: `git tag -a v0.1.0 -m "Phase 1: foundation"` then `git push --tags`.

## Going back
| Need | Command |
|---|---|
| See milestones | `git tag -l` |
| Look at an old version | `git checkout v0.2.0` (detached; don't commit here) |
| Undo a merged step on main | `git revert -m 1 <merge-commit-sha>` (new branch → PR) |
| Undo one commit | `git revert <sha>` |
| Start over from a milestone on a new branch | `git checkout -b fix/restart-x v0.2.0` |
| Roll back production fast | Vercel dashboard → promote previous deployment |

**Never** `git push --force` to `main`. Never rewrite `main` history.

## Line endings (Windows)
`.gitattributes` enforces LF in the repo (`* text=auto eol=lf`) to avoid CRLF noise.
