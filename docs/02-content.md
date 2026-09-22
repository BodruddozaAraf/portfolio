# 02 — Content (source of truth)

Derived from `E:\Job Search\Resumes\Bodruddoza_Araf_Resume.pdf` (read 2026-09-23).
**Rules:** don't invent facts. Numbers must match exactly. If the resume changes, update this
file first, then the data files in code (`src/content/`). Phase 1 turns this doc into typed data.

Themed copy (marked 🤠) is a *draft* and can be edited freely. Facts (marked 📌) cannot.

---

## Identity 📌
- **Name:** Bodruddoza Araf
- **Title:** Full-Stack Developer (also positioned as AI / ML Engineer)
- **Location:** Dhaka, Bangladesh
- **Email:** bodruddozaaraf@gmail.com
- **GitHub:** https://github.com/BodruddozaAraf
- **LinkedIn:** https://www.linkedin.com/in/bodruddoza-araf-5989a22b7/
- **Phone:** ❌ on the resume but **NOT to be published** on the site.
- **Availability:** Graduating October 2026, available full time.

## Summary 📌
Full-stack developer who took an e-commerce platform from empty repository to a live store
taking nationwide orders in two months, as the only engineer on it. Strongest in TypeScript,
Next.js, React and the data layer, with production LLM work and research depth in deep
learning for computer vision. Graduating October 2026 and available full time.

🤠 Journal-voice version (About page, handwritten):
> *Dhaka, 2026.* Been riding with code a good while now. Took a store from an empty repo to
> orders coming in from every corner of the country in two months, no posse, just me.
> TypeScript and Next.js are my iron; the data layer is where I sleep easy. Lately I've been
> teaching machines to see what ain't there. Finishing up at BRAC University come October,
> and looking for a crew to ride with full time.

---

## Experience 📌

### Full-Stack Developer (Contract), Jack The Jelli
- **Dates:** June 2026 to August 2026
- **Company:** Leather goods brand, Dhaka. https://jackthejelli.com
- Shipped a complete e-commerce platform **as the sole engineer in two months**, covering
  storefront, cart, cash-on-delivery checkout, order tracking, customer accounts and an admin
  back-office in a single **Next.js 16, TypeScript and MongoDB** codebase.
- Designed order placement to stay correct under failure: **idempotency keys** block duplicate
  orders, **guarded atomic decrements** restore stock exactly once on cancellation, and
  **snapshotted line items** stop later product edits rewriting order history.
- Hardened a public, unauthenticated checkout with **rate-limited server actions** and
  **server-side delivery pricing across all 64 districts**, plus guest orders that attach to
  an account on email verification.
- Cut launch infrastructure cost to **effectively zero** by persuading the founders to defer
  the payment gateway, AI search and third-party APIs until after scale.

🤠 Poster headline: "The Leather Job: one gun, two months, sixty-four districts."
🤠 Nice thematic fit: a *leather goods* brand in a leather-journal site.
- Screenshots of the store may be shown (D18). ❗ Araf to provide them; placeholders until then.

---

## Projects 📌 (resume projects only, in this order)

### 1. EduBridge AI: AI Study-Abroad Advisor
- **Stack:** Next.js 16, TypeScript, PostgreSQL, Gemini API (+ Clerk, Zod, Neon, Drizzle ORM)
- **GitHub:** https://github.com/BodruddozaAraf/edubridge-ai
- **Live:** https://edubridge-ai-sigma.vercel.app
- Built a university and scholarship matching platform for first-generation international
  students to a **live client brief from Freelancer.com**, pairing **deterministic eligibility
  scoring** with the **Google Gemini API** so every recommendation carries an explanation,
  strengths and a roadmap.
- Implemented **Clerk authentication with webhook user sync**, **Zod-validated intake**, a
  **conversational AI advisor** and a **recommendations dashboard** on **Neon Postgres through
  Drizzle ORM**.
- 🤠 Bounty title: "The Crossing": guiding greenhorns to far-off lands.

### 2. PC-Builders: PC Configurator and Storefront
- **Stack:** React 19, Node.js, Express, MongoDB, Redis (+ Vite, Zustand, JWT, Cloudinary, bcrypt)
- **GitHub:** https://github.com/BodruddozaAraf/PC-Builders
- **Live:** https://pc-builders.onrender.com
- Built a full PC build configurator spanning **CPU, motherboard, RAM, GPU and storage** as
  one coherent specification, plus a **budget-constrained selector** that assembles a
  compatible component set to a price the customer picks.
- Implemented the backend with **JWT auth, Redis caching, Cloudinary storage and bcrypt
  hashing**, behind a deployed **React 19 and Vite** frontend using **Zustand** for state.
- 🤠 Bounty title: "The Gunsmith": custom builds to any budget.

### 3. News Topic Classification: NLP Architecture Comparison
- **Stack:** Python, TensorFlow/Keras, Gensim, scikit-learn
- **Links:** none (no public repo/notebook; D16). Case study page only.
- Ran a controlled comparison, as sole implementer, of **three preprocessing strategies**, **two
  word representations (TF-IDF, custom Skip-gram)** and **six architectures (DNN, SimpleRNN,
  GRU, LSTM, Bi-GRU, Bi-LSTM)**, reaching **91.9% accuracy and 0.919 macro F1**.
- Recovered two dead baselines: diagnosed **exploding-gradient collapse at chance accuracy
  (LSTM 25.0%, SimpleRNN 26.6%)** and brought them to **91.4% and 87.3%** with **gradient
  clipping and targeted regularisation**.
- Drove preprocessing from exploratory analysis, using **bigram frequency to isolate HTML
  noise** and **POS tagging to justify lemmatisation over stemming**, and **removed 22,067
  duplicate records**.
- 🤠 Bounty title: "The Telegraph Sorter": reading the wires and sorting every message.

---

## Research 📌

### Deep Learning-Based Complete Image Prediction from Partial or Occluded Images
- **Type:** Undergraduate thesis, **Defended 2026**
- **Supervisor:** Dr. Chowdhury Mofizur Rahman, BRAC University
- **Stack:** PyTorch
- Co-developed a **GAN-free, single-pass image completion framework** (**Dual-Manifold VQ-VAE**,
  **Latent Attention U-Net Mapper** and **Multi-Scale Detail Injection**) reaching **27.60 dB
  PSNR** and **0.861 SSIM** at roughly **32 ms per 256x256 image**.
- Owned **mask generation**, **zero-shot evaluation on four unseen datasets**, **retraining of
  five baselines under matched conditions**, and the ablations showing a **52.7% cut in mapper
  validation latent loss**; placed **2nd of 6 on zero-shot average PSNR**.
- 🤠 Headline: "The Torn Page": seeing what the fire took.
- 🤠 Signature visual: a torn or burnt journal sketch that "completes itself" as you scroll
  (a visual metaphor for image completion; not a real model run in v1).
- **Future work (not v1, D17):** real thesis figures and sample input/masked/output images,
  paper/report link, and possibly an in-browser demo.

---

## Skills 📌 (for the Satchel and the Wanted poster)
| Category | Items |
|---|---|
| Languages | TypeScript, JavaScript, Python, SQL |
| Frontend | React, Next.js (App Router), TailwindCSS, shadcn/ui, Zustand, TanStack Query |
| Backend & Auth | Node.js, Express, Next.js Server Actions, REST APIs, Zod, JWT, Better Auth, Clerk |
| Databases | MongoDB (Mongoose), PostgreSQL (Neon, Drizzle, Prisma), Redis |
| Machine Learning | PyTorch, TensorFlow / Keras, scikit-learn, Gensim, NumPy, pandas |
| Tooling | Git, Vercel, Render, Cloudinary, Google Gemini API, Vercel AI SDK |
| Spoken | English (professional working proficiency), Bangla (native) |

---

## Education 📌
- **BRAC University**, Dhaka: B.Sc. in Computer Science. **Expected October 2026.**
- **Started:** Fall 2022 (D15).

## Extracurricular 📌
- Won the **Rising Star Football Tournament twice** with the Football Club of BRAC University,
  taking **Best Striker** in the first title and **Best Midfielder** in the second.
- Reached the **semi-finals at TARC** during the Residential Semester.
- 🤠 Journal placement: a "Camp Stories" page with a sketched football and a pinned medal.

---

## Themed microcopy drafts 🤠
- **Wanted poster** (name shown as just **ARAF**, D21): "WANTED: ARAF. For shipping a whole store in two months,
  single-handed. Also suspected in crimes against legacy code. REWARD: one full-time offer.
  Available from October 2026."
- **Loading tips:**
  - "Tip: Idempotency keys stop a nervous customer from buying the same saddle twice."
  - "Tip: If your LSTM is stuck at 25%, check for exploding gradients before blaming the horse."
  - "Tip: Never deploy on a Friday, partner."
  - "Tip: Hold Tab to open the wheel."
  - "Tip: Press E to steady your aim."
- **Telegram (contact):** "SEND WORD STOP ARAF READS EVERY TELEGRAM STOP". The form opens the
  visitor's own mail (Gmail compose / mail app) pre-filled to bodruddozaaraf@gmail.com (D19).
- **404:** "You've wandered off the map, partner."
- **Footer colophon:** "Built by hand in Dhaka. Inspired by a certain outlaw's journal. All art original."
