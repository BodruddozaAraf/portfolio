import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study/CaseStudy";
import { Engraving } from "@/components/journal/Engraving";
import { projects, research } from "@/content";
import { researchBodies } from "@/content/case-studies";
import { openGraphBase, shareCard } from "@/lib/site";

// /research/[slug]: the thesis account. One slug today (image-completion); figures and sample
// outputs are future work (D17), so the engraving stands in for them, credited.

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: research.slug }];
}

export const metadata: Metadata = {
  title: `${research.headline}: image completion thesis`,
  alternates: { canonical: `/research/${research.slug}` },
  openGraph: {
    ...openGraphBase,
    url: `/research/${research.slug}`,
    type: "article",
    title: `${research.headline}: image completion thesis`,
    images: shareCard(
      `research-${research.slug}`,
      "A poster for The Torn Page, the image completion thesis, stamped Defended, pinned to a wooden board",
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: `${research.headline}: image completion thesis`,
    images: shareCard(
      `research-${research.slug}`,
      "A poster for The Torn Page, the image completion thesis, stamped Defended, pinned to a wooden board",
    ),
  },
  description: `${research.title}. ${research.type}, defended ${research.defended}, ${research.institution}. 27.60 dB PSNR, 0.861 SSIM.`,
};

export default async function ResearchPage(
  props: PageProps<"/research/[slug]">,
) {
  const { slug } = await props.params;
  const load = researchBodies[slug as keyof typeof researchBodies];
  if (slug !== research.slug || !load) notFound();
  const { default: Body } = await load();

  return (
    <CaseStudy
      seed={research.slug}
      title={research.headline}
      posterLine="Seeing what the fire took."
      name={research.title}
      tagline={`${research.type}, defended ${research.defended}`}
      meta={
        <p>
          Supervised by {research.supervisor}, {research.institution}.
        </p>
      }
      metric={research.metrics[0]}
      stackLine={research.stackLine}
      links={[]}
      stamp="Defended"
      back={{ href: "/#research", label: "Back to the journal" }}
      next={{
        href: `/bounties/${projects[0].slug}`,
        title: projects[0].bountyTitle,
        name: projects[0].name,
      }}
    >
      <Body />
      <Engraving
        src="/engravings/camping-out-adirondacks.webp"
        width={1600}
        height={1074}
        alt="Wood engraving: two men rest by a bark lean-to and a smouldering campfire on a lakeshore"
        caption="Camping Out in the Adirondack Mountains, after Winslow Homer, 1874. A stand-in until the thesis figures are published."
        sizes="(min-width: 1024px) 56rem, 100vw"
        className="mt-14"
      />
    </CaseStudy>
  );
}
