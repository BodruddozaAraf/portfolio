import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { InkUnderline } from "@/components/journal/InkUnderline";
import { PageTurn } from "@/components/fx/PageTurn";
import { Poster } from "@/components/journal/Poster";
import { Stamp } from "@/components/journal/Stamp";
import { TopBar } from "@/components/nav/TopBar";
import { Colophon } from "@/components/sections/Colophon";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Link as ContentLink, Project, Stat } from "@/content";
import { TURN_BACK, TURN_FORWARD } from "@/lib/page-turn";
import { Screens } from "./Screens";

// The case-study page (docs/05-sections.md section 4): the poster pinned to the board, then the
// account on paper, then the stack, the links and the next bounty. The board's poster morphs into
// this header's poster on the way in and back again on the way out (a named view transition, D61).

type CaseStudyProps = {
  seed: string;
  title: string;
  posterLine?: string;
  name: string;
  tagline: string;
  meta?: ReactNode;
  metric?: Stat;
  stackLine: string;
  links: ContentLink[];
  /** Stamp on the poster: "Claimed" for bounties, "Defended" for the thesis. */
  stamp?: string;
  back: { href: string; label: string };
  next?: { href: string; title: string; name: string };
  /** Screenshots of the live work, shown after the account. */
  screenshots?: Project["screenshots"];
  children: ReactNode;
};

export function CaseStudy({
  seed,
  title,
  posterLine,
  name,
  tagline,
  meta,
  metric,
  stackLine,
  links,
  stamp = "Claimed",
  back,
  next,
  screenshots,
  children,
}: CaseStudyProps) {
  return (
    <PageTurn>
      <div className="wood">
        <TopBar surface="inherit" />
        <header className="shell grid items-center gap-10 pt-6 pb-16 md:pt-10 md:pb-24 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-16">
          <ViewTransition
            name={`poster-${seed}`}
            share="poster-morph"
            default="none"
          >
            <Poster seed={seed} className="text-ink">
              <h1 className="font-display text-h1 tracking-poster uppercase">
                {title}
              </h1>
              {posterLine ? (
                <p className="text-lead mt-3 italic">{posterLine}</p>
              ) : null}
              <p className="mt-6">
                <span className="text-h4">{name}</span>
                <span className="text-small text-ink-soft block">
                  {tagline}
                </span>
              </p>
              {metric ? (
                <p className="mt-6">
                  <InkUnderline seed={`${seed}-metric`}>
                    <span className="font-type text-h3">{metric.value}</span>
                  </InkUnderline>
                  <span className="text-small mt-3 block">{metric.label}</span>
                </p>
              ) : null}
              <div className="mt-7">
                <Stamp seed={`${seed}-claimed`}>{stamp}</Stamp>
              </div>
            </Poster>
          </ViewTransition>
          <div className="text-paper-light">
            {meta ? <div className="text-lead">{meta}</div> : null}
            {links.length ? (
              <ul className="mt-8 flex flex-wrap gap-4">
                {links.map((l) => (
                  <li key={l.href}>
                    <Button
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      variant="outline"
                      icon={<Icon icon={ArrowSquareOut} />}
                    >
                      {l.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-8">
              <Link
                href={back.href}
                transitionTypes={TURN_BACK}
                className="text-small hover:text-ember-glow inline-flex items-center gap-2 tracking-(--tracking-caps) uppercase underline-offset-[0.3em] hover:underline"
              >
                <Icon icon={ArrowLeft} />
                {back.label}
              </Link>
            </p>
          </div>
        </header>
      </div>

      <main id="content" className="shell chapter">
        <article className="max-w-(--measure) lg:max-w-4xl">{children}</article>

        {screenshots?.length ? (
          <Screens
            title="The store, as it stands"
            shots={screenshots}
            seed={seed}
          />
        ) : null}

        <section
          aria-labelledby="stack-title"
          className="border-ink/20 mt-20 max-w-3xl border-t pt-10"
        >
          <h2 id="stack-title" className="font-note text-h4 text-ink-soft">
            The stack
          </h2>
          <p className="font-type text-lead mt-3">{stackLine}</p>
        </section>

        {next ? (
          <nav aria-label="Next bounty" className="mt-20">
            <Link
              href={next.href}
              transitionTypes={TURN_FORWARD}
              className="group paper-light shadow-pinned ease-journal hover:shadow-lifted inline-flex max-w-full items-center gap-6 px-6 py-5 transition-[translate,box-shadow] duration-(--dur-hover) motion-safe:hover:-translate-y-0.5"
            >
              <span>
                <span className="font-note text-lead text-ink-soft block">
                  next on the board
                </span>
                <span className="font-display text-h3 tracking-poster group-hover:text-blood block uppercase">
                  {next.title}
                </span>
                <span className="text-small block">{next.name}</span>
              </span>
              <Icon icon={ArrowRight} size={28} className="shrink-0" />
            </Link>
          </nav>
        ) : null}
      </main>
      <Colophon />
    </PageTurn>
  );
}
