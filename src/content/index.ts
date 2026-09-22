import { z } from "zod";
import {
  education as rawEducation,
  experience as rawExperience,
} from "./experience";
import {
  extracurricular as rawExtracurricular,
  microcopy as rawMicrocopy,
  timeline as rawTimeline,
} from "./extras";
import { profile as rawProfile } from "./profile";
import { projects as rawProjects } from "./projects";
import { research as rawResearch } from "./research";
import {
  educationSchema,
  experienceSchema,
  extracurricularSchema,
  microcopySchema,
  milestoneSchema,
  profileSchema,
  projectSchema,
  researchSchema,
  skillCategorySchema,
} from "./schema";
import { skills as rawSkills } from "./skills";
import { validateContent } from "./validate";

// The one entry point for site content: every value is parsed and cross-checked when this module
// loads, so an invalid fact fails `next build`. Import from "@/content", never the data files.

function parse<T>(name: string, schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new Error(
      `Content validation failed (src/content, ${name}):\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

export const profile = parse("profile", profileSchema, rawProfile);
export const experience = parse(
  "experience",
  z.array(experienceSchema),
  rawExperience,
);
export const education = parse("education", educationSchema, rawEducation);
export const projects = parse("projects", z.array(projectSchema), rawProjects);
export const research = parse("research", researchSchema, rawResearch);
export const skills = parse("skills", z.array(skillCategorySchema), rawSkills);
export const extracurricular = parse(
  "extracurricular",
  extracurricularSchema,
  rawExtracurricular,
);
export const timeline = parse(
  "timeline",
  z.array(milestoneSchema),
  rawTimeline,
);
export const microcopy = parse("microcopy", microcopySchema, rawMicrocopy);

const allSkills = skills.flatMap((category) => category.skills);

validateContent(
  {
    profile,
    experience,
    education,
    projects,
    research,
    skills,
    extracurricular,
    timeline,
    microcopy,
  },
  {
    skillIds: allSkills.map((s) => s.id),
    projects,
    research,
    experience,
    timeline,
  },
);

export type UsedIn = { name: string; href: string };

/** Skill id to the bounties and research that used it, for the Satchel's "Used in" (D30). */
export const skillUsage: ReadonlyMap<string, UsedIn[]> = new Map(
  allSkills.map((skill) => [
    skill.id,
    [
      ...projects
        .filter((p) => p.skills.includes(skill.id))
        .map((p) => ({ name: p.name, href: `/bounties/${p.slug}` })),
      ...(research.skills.includes(skill.id)
        ? [{ name: research.headline, href: `/research/${research.slug}` }]
        : []),
    ],
  ]),
);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export { formatMonth, formatRange, keyTerms, plain } from "./format";
export type * from "./schema";
