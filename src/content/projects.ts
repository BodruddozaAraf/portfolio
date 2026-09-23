import { experience } from "./experience";
import type { Project } from "./schema";

const jackTheJelli = experience.find((job) => job.id === "jack-the-jelli")!;

// Source: docs/02-content.md "Projects" (resume projects only, in this order) plus Jack The Jelli
// as its own bounty (D7). Bounty titles and poster lines are themed drafts and may be edited;
// every other field is a resume fact.

export const projects: Project[] = [
  {
    slug: "jack-the-jelli",
    name: "Jack The Jelli",
    tagline: "E-commerce platform, built on contract",
    bountyTitle: "The Leather Job",
    posterLine: "One gun, two months, sixty-four districts.",
    client: "A leather goods brand in Dhaka",
    stackLine: "Next.js 16, TypeScript, MongoDB",
    skills: ["nextjs", "typescript", "mongodb", "server-actions"],
    links: [{ label: "Live store", href: "https://jackthejelli.com" }],
    // Same resume bullets as the experience entry, so the two can never drift apart.
    highlights: jackTheJelli.highlights,
    metric: {
      value: "2 months",
      label: "sole engineer, empty repo to live store",
    },
    pendingAssets: ["Store screenshots (A16, D18)"],
  },
  {
    slug: "edubridge-ai",
    name: "EduBridge AI",
    tagline: "AI Study-Abroad Advisor",
    bountyTitle: "The Crossing",
    posterLine: "Guiding greenhorns to far-off lands.",
    client: "A live client brief from Freelancer.com",
    stackLine:
      "Next.js 16, TypeScript, PostgreSQL, Gemini API, Clerk, Zod, Neon, Drizzle ORM",
    skills: [
      "nextjs",
      "typescript",
      "postgresql",
      "gemini",
      "clerk",
      "zod",
      "neon",
      "drizzle",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/BodruddozaAraf/edubridge-ai",
      },
      { label: "Live", href: "https://edubridge-ai-sigma.vercel.app" },
    ],
    highlights: [
      "Built a university and scholarship matching platform for first-generation international students to a **live client brief from Freelancer.com**, pairing **deterministic eligibility scoring** with the **Google Gemini API** so every recommendation carries an explanation, strengths and a roadmap.",
      "Implemented **Clerk authentication with webhook user sync**, **Zod-validated intake**, a **conversational AI advisor** and a **recommendations dashboard** on **Neon Postgres through Drizzle ORM**.",
    ],
    pendingAssets: [],
  },
  {
    slug: "pc-builders",
    name: "PC-Builders",
    tagline: "PC Configurator and Storefront",
    bountyTitle: "The Gunsmith",
    posterLine: "Custom builds to any budget.",
    stackLine:
      "React 19, Node.js, Express, MongoDB, Redis, Vite, Zustand, JWT, Cloudinary, bcrypt",
    skills: [
      "react",
      "nodejs",
      "express",
      "mongodb",
      "redis",
      "zustand",
      "jwt",
      "cloudinary",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/BodruddozaAraf/PC-Builders",
      },
      { label: "Live", href: "https://pc-builders.onrender.com" },
    ],
    highlights: [
      "Built a full PC build configurator spanning **CPU, motherboard, RAM, GPU and storage** as one coherent specification, plus a **budget-constrained selector** that assembles a compatible component set to a price the customer picks.",
      "Implemented the backend with **JWT auth, Redis caching, Cloudinary storage and bcrypt hashing**, behind a deployed **React 19 and Vite** frontend using **Zustand** for state.",
    ],
    pendingAssets: [],
  },
  {
    slug: "news-topic-classification",
    name: "News Topic Classification",
    tagline: "NLP Architecture Comparison",
    bountyTitle: "The Telegraph Sorter",
    posterLine: "Reading the wires and sorting every message.",
    stackLine: "Python, TensorFlow/Keras, Gensim, scikit-learn",
    skills: ["python", "tensorflow-keras", "gensim", "scikit-learn"],
    // No public repo or notebook (D16): case study page only.
    links: [],
    highlights: [
      "Ran a controlled comparison, as sole implementer, of **three preprocessing strategies**, **two word representations (TF-IDF, custom Skip-gram)** and **six architectures (DNN, SimpleRNN, GRU, LSTM, Bi-GRU, Bi-LSTM)**, reaching **91.9% accuracy and 0.919 macro F1**.",
      "Recovered two dead baselines: diagnosed **exploding-gradient collapse at chance accuracy (LSTM 25.0%, SimpleRNN 26.6%)** and brought them to **91.4% and 87.3%** with **gradient clipping and targeted regularisation**.",
      "Drove preprocessing from exploratory analysis, using **bigram frequency to isolate HTML noise** and **POS tagging to justify lemmatisation over stemming**, and **removed 22,067 duplicate records**.",
    ],
    metric: { value: "91.9%", label: "accuracy, 0.919 macro F1" },
    pendingAssets: [],
  },
];
