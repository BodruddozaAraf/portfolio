// Content-wide rules that a per-field schema cannot express. Any failure throws, and since the
// root layout imports the content, `next build` fails instead of shipping a broken fact.

type Issue = { path: string; message: string };

const DASHES = /[–—]/; // en and em dash (D31)
// Bangladeshi mobile numbers and any long digit run: the phone is never published (D4)
const PHONE = /(?:\+?880[\s-]?)?\b01[3-9]\d{2}[\s-]?\d{6}\b|\d(?:[\s-]?\d){9,}/;

function walk(
  value: unknown,
  path: string,
  visit: (text: string, path: string) => void,
) {
  if (typeof value === "string") visit(value, path);
  else if (Array.isArray(value))
    value.forEach((v, i) => walk(v, `${path}[${i}]`, visit));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value))
      walk(v, path ? `${path}.${k}` : k, visit);
}

export type ContentGraph = {
  skillIds: string[];
  projects: { slug: string; skills: string[] }[];
  research: { slug: string; skills: string[] };
  strengths: string[];
  experience: { id: string; bounty?: string }[];
  timeline: { id: string; href?: string }[];
};

export function validateContent(
  all: Record<string, unknown>,
  graph: ContentGraph,
) {
  const issues: Issue[] = [];
  const fail = (path: string, message: string) =>
    issues.push({ path, message });

  walk(all, "", (text, path) => {
    if (DASHES.test(text))
      fail(path, "contains an em or en dash; use a hyphen, comma or colon");
    if (PHONE.test(text))
      fail(path, "looks like a phone number; the phone is never published");
    if ((text.match(/\*\*/g) ?? []).length % 2)
      fail(path, "unbalanced **key term** markers");
    if ((text.match(/·/g) ?? []).length > 1)
      fail(path, "more than one middle dot in a line");
  });

  const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of dupes(graph.skillIds))
    fail("skills", `duplicate skill id "${id}"`);
  for (const s of dupes(graph.projects.map((p) => p.slug)))
    fail("projects", `duplicate slug "${s}"`);
  for (const id of dupes(graph.timeline.map((m) => m.id)))
    fail("timeline", `duplicate id "${id}"`);

  const known = new Set(graph.skillIds);
  for (const owner of [...graph.projects, graph.research])
    for (const id of owner.skills)
      if (!known.has(id))
        fail(`${owner.slug}.skills`, `unknown skill id "${id}"`);

  for (const id of graph.strengths)
    if (!known.has(id)) fail("profile.strengths", `unknown skill id "${id}"`);

  const bounties = new Set(graph.projects.map((p) => p.slug));
  for (const job of graph.experience)
    if (job.bounty && !bounties.has(job.bounty))
      fail(`experience.${job.id}.bounty`, `no bounty "${job.bounty}"`);

  for (const pin of graph.timeline) {
    const bounty = pin.href?.match(/^\/bounties\/(.+)$/)?.[1];
    if (bounty && !bounties.has(bounty))
      fail(`timeline.${pin.id}.href`, `no bounty "${bounty}"`);
    const study = pin.href?.match(/^\/research\/(.+)$/)?.[1];
    if (study && study !== graph.research.slug)
      fail(`timeline.${pin.id}.href`, `no research "${study}"`);
  }

  if (issues.length) {
    const list = issues.map((i) => `  - ${i.path}: ${i.message}`).join("\n");
    throw new Error(`Content validation failed (src/content):\n${list}`);
  }
}
