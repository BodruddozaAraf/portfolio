# 09 — Decisions and Open Questions

## Decision log
Newest at the bottom. Don't re-open a decision without Araf's say-so; if one changes, add a
new row that supersedes the old one.

| # | Date | Decision | Why |
|---|---|---|---|
| D1 | 2026-09-23 | Theme: Wild West outlaw journal inspired by Arthur Morgan / RDR2; original art only | Araf's choice; IP-safe approach |
| D2 | 2026-09-23 | Content comes from the resume, **not** GitHub | Araf's instruction |
| D3 | 2026-09-23 | Stack: Next.js 16 App Router, TS, Tailwind v4, R3F, GSAP, Lenis, Motion, MDX, Vercel | Matches Araf's skills; best-in-class for this kind of site |
| D4 | 2026-09-23 | Phone number never shown on the site | Privacy |
| D5 | 2026-09-23 | Phase 1 ships a content-complete static site before any 3D | Always have a working, deployable portfolio |
| D6 | 2026-09-23 | Git: `main` + one branch per step, merge commits (`--no-ff`), milestone tags | Easy tracking and rollback (Araf's request) |
| D7 | 2026-09-23 | Jack The Jelli gets its own bounty case study (besides the 3 resume projects) | It's the strongest story on the resume |
| D8 | 2026-09-23 | AI chat persona is "an old camp hand", not literally Arthur Morgan | IP safety |
| D9 | 2026-09-23 | npm as package manager | Already installed |

## Open questions for Araf
Status: ❓ open · ✅ answered (move the answer into the decision log)

| # | Question | Default if unanswered |
|---|---|---|
| Q1 | GitHub repo: name and **public or private**? | `portfolio`, public (portfolio repos help recruiters) |
| Q2 | Do you have a **custom domain** (e.g. `araf.dev`)? Want to buy one? | Use `*.vercel.app` until launch |
| Q3 | **Photo** for the wanted poster: use a real photo (turned into a sketch look), or a fully illustrated/anonymous silhouette? | Silhouette with hat, swap later |
| Q4 | Can the **resume PDF** be downloadable on the site? | Yes, from `/resume.pdf` |
| Q5 | **BRAC University start year** (for the map timeline)? | Show "BRAC University" without a start year |
| Q6 | **News Topic Classification**: any GitHub repo / notebook link? | No link, case study only |
| Q7 | **Thesis**: can you share the paper/report, figures, sample outputs (input/masked/output images)? Is it publishable? | Use metrics and a diagram only; metaphor animation |
| Q8 | **Jack The Jelli**: OK to show screenshots of the store / mention the client by name? (Resume already names it.) | Yes, name + link, screenshots if you provide them |
| Q9 | **Contact form email provider**: OK with Resend (free tier) via Vercel? Or just a `mailto:`? | Resend |
| Q10 | **Ask Arthur AI**: OK with small ongoing API cost (via Vercel AI Gateway)? Preferred model? | Yes, cheap fast model via AI Gateway, strict rate limits |
| Q11 | **Nickname / outlaw alias** for the wanted poster? (e.g. "Araf 'The Sole Engineer'", or something friends call you) | "The Sole Engineer" |
| Q12 | **Sketch art**: will you draw/commission any, or should we generate SVG line art (AI-assisted + cleaned)? | Generated SVG line art |
| Q13 | Can you use **Blender**, or should the 3D scene rely on free models + code-generated geometry? | Free models + procedural |
| Q14 | Anything else to feature beyond the resume (certifications, talks, hackathons)? | No |
