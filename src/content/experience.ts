import type { Education, Experience } from "./schema";

// Source: docs/02-content.md "Experience" and "Education".

export const experience: Experience[] = [
  {
    id: "jack-the-jelli",
    role: "Full-Stack Developer",
    employment: "Contract",
    company: "Jack The Jelli",
    companyNote: "Leather goods brand, Dhaka",
    url: "https://jackthejelli.com",
    start: "2026-06",
    end: "2026-08",
    bounty: "jack-the-jelli",
    highlights: [
      "Shipped a complete e-commerce platform **as the sole engineer in two months**, covering storefront, cart, cash-on-delivery checkout, order tracking, customer accounts and an admin back-office in a single **Next.js 16, TypeScript and MongoDB** codebase.",
      "Designed order placement to stay correct under failure: **idempotency keys** block duplicate orders, **guarded atomic decrements** restore stock exactly once on cancellation, and **snapshotted line items** stop later product edits rewriting order history.",
      "Hardened a public, unauthenticated checkout with **rate-limited server actions** and **server-side delivery pricing across all 64 districts**, plus guest orders that attach to an account on email verification.",
      "Cut launch infrastructure cost to **effectively zero** by persuading the founders to defer the payment gateway, AI search and third-party APIs until after scale.",
    ],
  },
];

export const education: Education = {
  institution: "BRAC University",
  city: "Dhaka",
  degree: "B.Sc. in Computer Science",
  started: "Fall 2022",
  expected: "2026-10",
};
