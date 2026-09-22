# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Chosen by Araf in planning (docs/09-decisions-and-questions.md D3, D12): Next.js 16 App Router,
TypeScript, Tailwind CSS v4, React Three Fiber + drei, GSAP + ScrollTrigger, Lenis, Motion, MDX.
Hosted on Vercel at bodruddozaaraf.me. Fully static in v1 (no server code, no secrets).

## Users
1. **Recruiters and hiring managers** screening for full-time software, AI or ML roles. They
   skim for 30 to 60 seconds and need: name, role, availability (graduating October 2026,
   available full time), strongest projects, and a way to reach him.
2. **Engineers and tech leads** evaluating technical depth. They open case studies and judge
   decisions (idempotency, atomic stock handling, evaluation methodology, thesis metrics) and
   the engineering quality of the site itself.
3. **Creative-dev and gaming community** who share sites that are genuinely special. Secondary.

## Product Purpose
Personal portfolio of Bodruddoza Araf, a full-stack developer (TypeScript, Next.js, React, data
layer) with production LLM work and deep-learning research in computer vision, based in Dhaka,
Bangladesh. Success means interviews for full-time roles, and a site people remember and share.

## Positioning
The whole site is an outlaw's journal found beside a campfire (inspired by the journal in
Red Dead Redemption 2, built from original art). The theme is earned by real resume facts: a
"lone rider" story where Araf, as the sole engineer, took a leather-goods store from an empty
repository to nationwide orders in two months. The portfolio also proves his craft by being a
technically demanding build (3D, scroll choreography, performance budgets).

## Operating Context
Visitors arrive from a resume, LinkedIn, GitHub, or a shared link, on desktop and mid-range
Android phones. Recruiters often open it between other tasks, so the core facts must be
reachable instantly, including through a text-first Plain mode.

## Capabilities and Constraints
- Content comes only from the resume (docs/02-content.md is the source of truth). Never
  invent projects, metrics, dates, testimonials or claims. Projects are not taken from GitHub.
- The phone number on the resume is never published.
- Contact is client-side: the form opens a pre-filled Gmail compose window or mail app
  addressed to bodruddozaaraf@gmail.com, so mail comes from the sender's own address.
- No AI chat in v1. Thesis figures and sample outputs are future work.
- Resume PDF is public at /resume.pdf.
- Must honor prefers-reduced-motion, work without WebGL, and offer Plain mode.

## Brand Commitments
- Name on the wanted poster is just "ARAF"; full name "Bodruddoza Araf" elsewhere. No nickname.
- Theme: Wild West outlaw journal. IP-safe: no Rockstar logos, screenshots, ripped assets,
  soundtrack, fonts, or Arthur Morgan's likeness. "Red Dead" never appears in the title,
  domain or metadata.
- Voice: playful frontier flavor in themed copy, precise and professional in technical copy.
- Portrait: a real photo of Araf turned into a sketch, with a placeholder image until then.

## Evidence on Hand
- Resume: E:\Job Search\Resumes\Bodruddoza_Araf_Resume.pdf (all facts transcribed to docs/02-content.md).
- Live links: jackthejelli.com, edubridge-ai-sigma.vercel.app, pc-builders.onrender.com.
- Repos: github.com/BodruddozaAraf/edubridge-ai, github.com/BodruddozaAraf/PC-Builders.
- Absent (do not fabricate): Jack The Jelli screenshots (Araf to provide), Araf's photo,
  a News Topic Classification repo, thesis figures, testimonials of any kind.

## Product Principles
1. The work is never behind the art: key facts are findable within seconds on every device.
2. Every claim is real and traceable to the resume.
3. The theme is committed, not decorative: every section has a reason to be a journal page.
4. The site itself is evidence of engineering skill: fast, accessible, well built.

## Accessibility & Inclusion
WCAG 2.2 AA. Full keyboard support, reduced-motion support, no autoplaying sound, all
handwritten or decorative text also available as real text.
