import type { SkillCategory } from "./schema";

// Source: docs/02-content.md "Skills". Grouped items like "PostgreSQL (Neon, Drizzle, Prisma)"
// are split into separate skills so projects can reference each one; spoken languages live in
// profile.ts.

export const skills: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    skills: [
      { id: "typescript", name: "TypeScript" },
      { id: "javascript", name: "JavaScript" },
      { id: "python", name: "Python" },
      { id: "sql", name: "SQL" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { id: "react", name: "React" },
      { id: "nextjs", name: "Next.js (App Router)" },
      { id: "tailwindcss", name: "TailwindCSS" },
      { id: "shadcn-ui", name: "shadcn/ui" },
      { id: "zustand", name: "Zustand" },
      { id: "tanstack-query", name: "TanStack Query" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Auth",
    skills: [
      { id: "nodejs", name: "Node.js" },
      { id: "express", name: "Express" },
      { id: "server-actions", name: "Next.js Server Actions" },
      { id: "rest-apis", name: "REST APIs" },
      { id: "zod", name: "Zod" },
      { id: "jwt", name: "JWT" },
      { id: "better-auth", name: "Better Auth" },
      { id: "clerk", name: "Clerk" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    skills: [
      { id: "mongodb", name: "MongoDB (Mongoose)" },
      { id: "postgresql", name: "PostgreSQL" },
      { id: "neon", name: "Neon" },
      { id: "drizzle", name: "Drizzle" },
      { id: "prisma", name: "Prisma" },
      { id: "redis", name: "Redis" },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    skills: [
      { id: "pytorch", name: "PyTorch" },
      { id: "tensorflow-keras", name: "TensorFlow / Keras" },
      { id: "scikit-learn", name: "scikit-learn" },
      { id: "gensim", name: "Gensim" },
      { id: "numpy", name: "NumPy" },
      { id: "pandas", name: "pandas" },
    ],
  },
  {
    id: "tooling",
    title: "Tooling",
    skills: [
      { id: "git", name: "Git" },
      { id: "vercel", name: "Vercel" },
      { id: "render", name: "Render" },
      { id: "cloudinary", name: "Cloudinary" },
      { id: "gemini", name: "Google Gemini API" },
      { id: "vercel-ai-sdk", name: "Vercel AI SDK" },
    ],
  },
];
