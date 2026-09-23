import { z } from "zod";

// Schemas for everything the site says. Values live in the sibling data files and come from
// docs/02-content.md (the resume). Text fields may mark key terms with **double asterisks**;
// renderers decide how to show them (IM Fell has no bold, so usually italic, see DESIGN.md).

const text = z.string().trim().min(1);
const httpsUrl = z.url({ protocol: /^https$/ });
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slug");

/** A month, "YYYY-MM". Days are never needed and would be invented precision. */
export const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "YYYY-MM");

export const linkSchema = z
  .object({
    label: text,
    href: z.union([
      httpsUrl,
      z.string().startsWith("mailto:"),
      z.string().startsWith("/"),
    ]),
  })
  .strict();

// --- skills ------------------------------------------------------------------------------

export const skillCategoryIds = [
  "languages",
  "frontend",
  "backend",
  "databases",
  "machine-learning",
  "tooling",
] as const;

export const skillSchema = z.object({ id: slug, name: text }).strict();

export const skillCategorySchema = z
  .object({
    id: z.enum(skillCategoryIds),
    title: text,
    skills: z.array(skillSchema).min(1),
  })
  .strict();

export const spokenLanguageSchema = z
  .object({ name: text, level: text })
  .strict();

// --- profile -----------------------------------------------------------------------------

export const statSchema = z
  .object({
    value: text,
    label: text,
  })
  .strict();

export const profileSchema = z
  .object({
    name: text,
    /** The wanted-poster name (D21). */
    posterName: text,
    title: text,
    /** Hero role line. */
    roleLine: text,
    location: text,
    email: z.email(),
    availability: text,
    /** Hero sentence, 20 words max (D29). */
    heroLine: text.refine(
      (s) => s.split(/\s+/).length <= 20,
      "hero line is 20 words max",
    ),
    /** Plain, recruiter-facing summary (the "note for the lawmen"). */
    summary: text,
    /** Journal-voice version, shown handwritten; the summary is its real-text twin. */
    journalEntry: z.object({ dateline: text, body: text }).strict(),
    links: z
      .object({
        github: linkSchema,
        linkedin: linkSchema,
        email: linkSchema,
        resume: linkSchema,
      })
      .strict(),
    stats: z.array(statSchema).min(1),
    /** Skill ids behind "Strongest in TypeScript, Next.js, React and the data layer" (summary). */
    strengths: z.array(slug).min(1),
    spokenLanguages: z.array(spokenLanguageSchema).min(1),
  })
  .strict();

// --- experience and education ------------------------------------------------------------

export const experienceSchema = z
  .object({
    id: slug,
    role: text,
    employment: z.enum(["Contract", "Full-time", "Part-time", "Internship"]),
    company: text,
    companyNote: text,
    url: httpsUrl,
    start: monthSchema,
    end: monthSchema.nullable(),
    highlights: z.array(text).min(1),
    /** The bounty that tells this job's story, if any. */
    bounty: slug.optional(),
  })
  .strict();

export const educationSchema = z
  .object({
    institution: text,
    city: text,
    degree: text,
    started: text,
    expected: monthSchema,
  })
  .strict();

// --- projects (bounties) and research ----------------------------------------------------

export const projectSchema = z
  .object({
    slug,
    name: text,
    tagline: text,
    /** Themed poster title, e.g. "The Crossing" (draft copy, editable). */
    bountyTitle: text,
    posterLine: text.optional(),
    /** Who the work was for, only when the resume names a client. */
    client: text.optional(),
    /** Stack exactly as the resume words it. */
    stackLine: text,
    /** Skill ids used, for the Satchel's "Used in" mapping. */
    skills: z.array(slug).min(1),
    links: z.array(linkSchema),
    highlights: z.array(text).min(1),
    /** Only when the resume gives a number; never invented. */
    metric: statSchema.optional(),
    /** Images the owner still has to supply (D18). Empty when none are expected. */
    pendingAssets: z.array(text),
  })
  .strict();

export const researchSchema = z
  .object({
    slug,
    title: text,
    headline: text,
    type: text,
    defended: z.number().int(),
    supervisor: text,
    institution: text,
    stackLine: text,
    skills: z.array(slug).min(1),
    architecture: z.array(text).min(2),
    metrics: z.array(statSchema).min(1),
    highlights: z.array(text).min(1),
    futureWork: z.array(text),
  })
  .strict();

// --- extras: extracurricular, timeline, microcopy ----------------------------------------

export const achievementSchema = z
  .object({ title: text, detail: text })
  .strict();

export const extracurricularSchema = z
  .object({
    group: text,
    achievements: z.array(achievementSchema).min(1),
  })
  .strict();

/** A pin on the map. `when` is omitted when the resume gives no date (never guessed). */
export const milestoneSchema = z
  .object({
    id: slug,
    title: text,
    when: text.optional(),
    detail: text,
    href: z.string().startsWith("/").optional(),
  })
  .strict();

export const loadingTipSchema = z
  .object({
    text,
    /** Hide the tip until this feature ships (weapon wheel is 4.1, Dead Eye is 4.2). */
    requires: z.enum(["weapon-wheel", "dead-eye"]).optional(),
  })
  .strict();

export const microcopySchema = z
  .object({
    wanted: z
      .object({
        heading: text,
        charge: text,
        aside: text,
        reward: text,
        available: text,
      })
      .strict(),
    loadingTips: z.array(loadingTipSchema).min(1),
    telegram: z.object({ heading: text, cta: text, subject: text }).strict(),
    notFound: text,
    colophon: z.array(text).min(1),
  })
  .strict();

export type Link = z.infer<typeof linkSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type SkillCategory = z.infer<typeof skillCategorySchema>;
export type Stat = z.infer<typeof statSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Research = z.infer<typeof researchSchema>;
export type Extracurricular = z.infer<typeof extracurricularSchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type LoadingTip = z.infer<typeof loadingTipSchema>;
export type Microcopy = z.infer<typeof microcopySchema>;
