import type { Profile } from "./schema";

// Source: docs/02-content.md "Identity" and "Summary". The phone number is never published (D4).

export const profile: Profile = {
  name: "Bodruddoza Araf",
  posterName: "ARAF",
  title: "Full-Stack Developer",
  roleLine: "Full-Stack and AI/ML Engineer",
  location: "Dhaka, Bangladesh",
  email: "bodruddozaaraf@gmail.com",
  availability: "Graduating October 2026, available full time.",
  heroLine: "Graduating October 2026 and available full time.",
  summary:
    "Full-stack developer who took an e-commerce platform from empty repository to a live store taking nationwide orders in two months, as the only engineer on it. Strongest in TypeScript, Next.js, React and the data layer, with production LLM work and research depth in deep learning for computer vision. Graduating October 2026 and available full time.",
  journalEntry: {
    dateline: "Dhaka, 2026.",
    body: "Been riding with code a good while now. Took a store from an empty repo to orders coming in from every corner of the country in two months, no posse, just me. TypeScript and Next.js are my iron; the data layer is where I sleep easy. Lately I've been teaching machines to see what ain't there. Finishing up at BRAC University come October, and looking for a crew to ride with full time.",
  },
  links: {
    github: { label: "GitHub", href: "https://github.com/BodruddozaAraf" },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/bodruddoza-araf-5989a22b7/",
    },
    email: { label: "Email", href: "mailto:bodruddozaaraf@gmail.com" },
    // Public per D14; the PDF itself lands in public/ with asset A15.
    resume: { label: "Resume", href: "/resume.pdf" },
  },
  // Wanted-poster stamps (docs/05-sections.md section 3)
  stats: [
    { value: "2 months", label: "sole engineer, empty repo to live store" },
    { value: "64 districts", label: "server-side delivery pricing" },
    { value: "91.9%", label: "accuracy, news topic classification" },
    { value: "27.60 dB", label: "PSNR, image completion thesis" },
    { value: "2nd of 6", label: "zero-shot average PSNR" },
  ],
  // The summary's "strongest in", with the data layer as the two databases on the resume, plus
  // the thesis framework; shown as the wanted poster's "known associates"
  strengths: [
    "typescript",
    "nextjs",
    "react",
    "mongodb",
    "postgresql",
    "pytorch",
  ],
  spokenLanguages: [
    { name: "English", level: "professional working proficiency" },
    { name: "Bangla", level: "native" },
  ],
};
