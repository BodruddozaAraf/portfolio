import type { MDXContent } from "mdx/types";

// Case-study bodies by slug (D44: facts and metadata live in projects.ts / research.ts; the MDX
// holds only the prose). Typed as a Record so a bounty without a body fails typecheck.

type Loader = () => Promise<{ default: MDXContent }>;

export const bountyBodies = {
  "jack-the-jelli": () => import("./jack-the-jelli.mdx"),
  "edubridge-ai": () => import("./edubridge-ai.mdx"),
  "pc-builders": () => import("./pc-builders.mdx"),
  "news-topic-classification": () => import("./news-topic-classification.mdx"),
} satisfies Record<string, Loader>;

export const researchBodies = {
  "image-completion": () => import("./image-completion.mdx"),
} satisfies Record<string, Loader>;

export type BountySlug = keyof typeof bountyBodies;
