import Link from "next/link";
import { ViewTransition } from "react";
import { InkUnderline } from "@/components/journal/InkUnderline";
import { KeyText } from "@/components/journal/KeyText";
import { Poster } from "@/components/journal/Poster";
import { Stamp } from "@/components/journal/Stamp";
import { BoardMoment } from "@/components/motion/BoardMoment";
import { projects } from "@/content";
import { TURN_FORWARD } from "@/lib/page-turn";
import { ChapterTitle } from "./ChapterTitle";

// 4. Bounty Board. Four posters pinned to the planks at seeded angles, staggered so the board
// never reads as a grid. The whole poster links to its case study (step 1.6), except the
// "the job, in full" disclosure, which holds every resume line for the project. The posters drop
// onto their pins as the board scrolls in (BoardMoment), lift off the pin on hover or focus, and
// the chosen one morphs into the case study's header poster (a named view transition, D61).

const stagger = ["md:mt-0", "md:mt-24", "md:-mt-10", "md:mt-14"];

export function BountyBoard() {
  return (
    <section
      id="bounties"
      aria-labelledby="bounties-title"
      className="wood overflow-x-clip"
    >
      <div className="chapter shell">
        <ChapterTitle
          id="bounties-title"
          standfirst="Four jobs on the board, every one of them claimed."
        >
          Bounty Board
        </ChapterTitle>
        <BoardMoment>
          <ul className="grid gap-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
            {projects.map((p, i) => (
              <li key={p.slug} className={stagger[i % stagger.length]}>
                <ViewTransition
                  name={`poster-${p.slug}`}
                  share="poster-morph"
                  default="none"
                >
                  <Poster
                    seed={p.slug}
                    pins={i % 2 ? 2 : 1}
                    moment="poster"
                    className="group text-ink ease-journal focus-within:shadow-lifted hover:shadow-lifted transition-[translate,box-shadow] duration-(--dur-hover) motion-safe:focus-within:-translate-y-1 motion-safe:hover:-translate-y-1"
                  >
                    <h3 className="font-display text-h3 tracking-poster uppercase">
                      <Link
                        href={`/bounties/${p.slug}`}
                        transitionTypes={TURN_FORWARD}
                        className="focus-visible:after:outline-blood after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-8"
                      >
                        {p.bountyTitle}
                      </Link>
                    </h3>
                    {p.posterLine ? (
                      <p className="text-lead mt-2 italic">{p.posterLine}</p>
                    ) : null}
                    <p className="mt-6">
                      <span className="text-h4">{p.name}</span>
                      <span className="text-small text-ink-soft block">
                        {p.tagline}
                      </span>
                    </p>
                    {p.client ? (
                      <p className="text-small mt-3">{p.client}</p>
                    ) : null}
                    {p.metric ? (
                      <p className="mt-6">
                        <InkUnderline seed={`${p.slug}-metric`}>
                          <span className="font-type text-h3">
                            {p.metric.value}
                          </span>
                        </InkUnderline>
                        <span className="text-small mt-3 block">
                          {p.metric.label}
                        </span>
                      </p>
                    ) : null}
                    <p className="font-type text-caption text-ink-soft mt-6">
                      {p.stackLine}
                    </p>
                    <details className="relative z-10 mt-5">
                      <summary className="font-note text-lead text-ink-soft hover:text-blood cursor-pointer">
                        the job, in full
                      </summary>
                      <ul className="marker:text-ink-soft text-small mt-3 list-disc space-y-2 pl-5">
                        {p.highlights.map((h) => (
                          <li key={h}>
                            <KeyText text={h} />
                          </li>
                        ))}
                      </ul>
                    </details>
                    <div className="mt-7 flex items-end justify-between gap-4">
                      <Stamp seed={`${p.slug}-claimed`} size="sm">
                        Claimed
                      </Stamp>
                      <span
                        aria-hidden
                        className="font-note text-lead text-ink-soft decoration-ink/40 group-hover:text-blood group-hover:decoration-blood underline underline-offset-4 transition-colors duration-(--dur-hover)"
                      >
                        read the job
                      </span>
                    </div>
                  </Poster>
                </ViewTransition>
              </li>
            ))}
          </ul>
        </BoardMoment>
      </div>
    </section>
  );
}
