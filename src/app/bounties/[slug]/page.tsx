import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { getProject, projects } from "@/content";
import { bountyBodies, type BountySlug } from "@/content/case-studies";
import { openGraphBase, shareCard } from "@/lib/site";

// /bounties/[slug]: one case study per bounty. Facts come from projects.ts, prose from the MDX
// body (D44). Only the four known slugs are built; anything else is a 404.

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/bounties/[slug]">,
): Promise<Metadata> {
  const project = getProject((await props.params).slug);
  if (!project) return {};
  const title = `${project.name}: ${project.tagline}`;
  const images = shareCard(
    project.slug,
    `A bounty poster for ${project.bountyTitle}: ${project.name}, pinned to a wooden board beside the name Bodruddoza Araf`,
  );
  return {
    title: `${project.name}: ${project.tagline}`,
    description: `${project.bountyTitle}. ${project.name}, ${project.tagline}. Built with ${project.stackLine}.`,
    alternates: { canonical: `/bounties/${project.slug}` },
    openGraph: {
      ...openGraphBase,
      url: `/bounties/${project.slug}`,
      type: "article",
      title,
      images,
    },
    twitter: { card: "summary_large_image", title, images },
  };
}

export default async function BountyPage(props: PageProps<"/bounties/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  const load = bountyBodies[slug as BountySlug];
  if (!project || !load) notFound();
  const { default: Body } = await load();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <CaseStudy
      seed={project.slug}
      title={project.bountyTitle}
      posterLine={project.posterLine}
      name={project.name}
      tagline={project.tagline}
      meta={project.client ? <p>{project.client}</p> : undefined}
      metric={project.metric}
      stackLine={project.stackLine}
      links={project.links}
      screenshots={project.screenshots}
      back={{ href: "/#bounties", label: "Back to the board" }}
      next={{
        href: `/bounties/${next.slug}`,
        title: next.bountyTitle,
        name: next.name,
      }}
    >
      <Body />
    </CaseStudy>
  );
}
