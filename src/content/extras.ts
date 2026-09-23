import { education, experience } from "./experience";
import { formatMonth, formatRange } from "./format";
import type { Extracurricular, Microcopy, Milestone } from "./schema";

// Source: docs/02-content.md "Extracurricular" and "Themed microcopy drafts", and the map order
// in docs/05-sections.md section 6. Themed lines are drafts and may be edited.

const jackTheJelli = experience.find((job) => job.id === "jack-the-jelli")!;

export const extracurricular: Extracurricular = {
  group: "Football Club of BRAC University",
  achievements: [
    {
      title: "Rising Star Football Tournament, won twice",
      detail:
        "Best Striker in the first title and Best Midfielder in the second.",
    },
    {
      title: "TARC semi-finals",
      detail:
        "Reached the semi-finals at TARC during the Residential Semester.",
    },
  ],
};

/** Map pins, in trail order. EduBridge AI has no date on the resume, so none is shown. */
export const timeline: Milestone[] = [
  {
    id: "brac-start",
    title: `Started at ${education.institution}`,
    when: education.started,
    detail: `${education.degree}, ${education.city}.`,
  },
  {
    id: "edubridge-ai",
    title: "EduBridge AI",
    detail:
      "A live client brief from Freelancer.com: university and scholarship matching for first-generation international students.",
    href: "/bounties/edubridge-ai",
  },
  {
    id: "jack-the-jelli",
    title: "Jack The Jelli",
    when: formatRange(jackTheJelli.start, jackTheJelli.end),
    detail:
      "Sole engineer: empty repository to a live store taking nationwide orders in two months.",
    href: "/bounties/jack-the-jelli",
  },
  {
    id: "thesis-defended",
    title: "Thesis defended",
    when: "2026",
    detail: "Complete image prediction from partial or occluded images.",
    href: "/research/image-completion",
  },
  {
    id: "graduation",
    title: "Graduation",
    when: formatMonth(education.expected),
    detail: `${education.degree}, ${education.institution}. Available full time.`,
  },
  {
    id: "next",
    title: "Next: your outfit?",
    detail: "The trail goes on from here. Send word.",
    href: "/#send-word",
  },
];

export const microcopy: Microcopy = {
  wanted: {
    heading: "WANTED",
    charge: "For shipping a whole store in two months, single-handed.",
    aside: "Also suspected in crimes against legacy code.",
    reward: "REWARD: one full-time offer.",
    available: "Available from October 2026.",
  },
  loaderTitle: "Chapter I: Dhaka",
  loadingTips: [
    {
      text: "Tip: Idempotency keys stop a nervous customer from buying the same saddle twice.",
    },
    {
      text: "Tip: If your LSTM is stuck at 25%, check for exploding gradients before blaming the horse.",
    },
    { text: "Tip: Never deploy on a Friday, partner." },
    { text: "Tip: Hold Tab to open the wheel.", requires: "weapon-wheel" },
    { text: "Tip: Press E to steady your aim.", requires: "dead-eye" },
  ],
  telegram: {
    heading: "SEND WORD STOP ARAF READS EVERY TELEGRAM STOP",
    cta: "Send word",
    // {name} is replaced with the sender's name (docs/05-sections.md section 9)
    subject: "Telegram from {name} via bodruddozaaraf.me",
  },
  notFound: "You've wandered off the map, partner.",
  colophon: [
    "Built by hand in Dhaka.",
    "Inspired by a certain outlaw's journal. Original art, plus public-domain engravings, credited below.",
  ],
};
