import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InkUnderline } from "@/components/journal/InkUnderline";
import { Poster } from "@/components/journal/Poster";
import { Stamp } from "@/components/journal/Stamp";
import { profile, projects, research } from "@/content";
import { SITE_URL } from "@/lib/site";

// The share cards (step 4.4, D78): each case study's poster, pinned to the board, drawn with the
// site's own components, fonts and textures at 1200x630. Development only: scripts/brand/og.mjs
// photographs each card into public/og/<page>.jpg and the pages point their share images there.
// A production build makes none of these pages.

export const dynamicParams = false;
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Card = {
  seed: string;
  title: string;
  line?: string;
  name: string;
  tagline: string;
  metric?: { value: string; label: string };
  stamp: string;
  shot?: { src: string; width: number; height: number };
};

function cards(): Record<string, Card> {
  const all: Record<string, Card> = {};
  for (const p of projects) {
    all[p.slug] = {
      seed: p.slug,
      title: p.bountyTitle,
      line: p.posterLine,
      name: p.name,
      tagline: p.tagline,
      metric: p.metric,
      stamp: "Claimed",
      shot: p.screenshots?.[0],
    };
  }
  all[`research-${research.slug}`] = {
    seed: research.slug,
    title: research.headline,
    line: "Seeing what the fire took.",
    name: "Image completion thesis",
    tagline: `${research.type}, defended ${research.defended}`,
    metric: research.metrics[0],
    stamp: "Defended",
  };
  return all;
}

export function generateStaticParams() {
  if (process.env.NODE_ENV !== "development") return [];
  return Object.keys(cards()).map((page) => ({ page }));
}

export default async function OgCard(props: PageProps<"/og-card/[page]">) {
  if (process.env.NODE_ENV !== "development") notFound();
  const card = cards()[(await props.params).page];
  if (!card) notFound();
  const host = new URL(SITE_URL).host;
  return (
    <div
      data-og-card
      className="wood fixed top-0 left-0 z-(--z-loader) grid h-[630px] w-[1200px] grid-cols-[520px_1fr] items-center gap-14 px-16"
    >
      <Poster seed={card.seed} className="text-ink">
        <p className="font-display text-h1 tracking-poster uppercase">
          {card.title}
        </p>
        {card.line ? (
          <p className="text-lead mt-3 italic">{card.line}</p>
        ) : null}
        <p className="mt-5">
          <span className="text-h4">{card.name}</span>
          <span className="text-small text-ink-soft block">{card.tagline}</span>
        </p>
        {card.metric ? (
          <p className="mt-5">
            <InkUnderline seed={`${card.seed}-metric`}>
              <span className="font-type text-h3">{card.metric.value}</span>
            </InkUnderline>
            <span className="text-small mt-2 block">{card.metric.label}</span>
          </p>
        ) : null}
        <div className="mt-6">
          <Stamp seed={`${card.seed}-claimed`}>{card.stamp}</Stamp>
        </div>
      </Poster>
      <div className="text-paper-light">
        {card.shot ? (
          <figure className="bg-paper-light shadow-pasted mb-8 rotate-[0.6deg] p-2">
            <Image
              src={card.shot.src}
              width={card.shot.width}
              height={card.shot.height}
              alt=""
              priority
              sizes="560px"
              className="h-auto w-full"
            />
          </figure>
        ) : null}
        <p className="font-display text-h2 tracking-poster uppercase">
          {profile.name}
        </p>
        <p className="text-h4 mt-3">{profile.roleLine}</p>
        <p className="font-type text-lead text-paper-light/80 mt-6">{host}</p>
      </div>
    </div>
  );
}
