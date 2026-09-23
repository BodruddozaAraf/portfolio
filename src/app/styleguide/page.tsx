import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Campfire,
  Compass,
  Envelope,
  FilePdf,
  GithubLogo,
  Horse,
  LinkedinLogo,
  MapPin,
  PenNib,
  Scroll,
} from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/fx/Reveal";
import { Engraving } from "@/components/journal/Engraving";
import { HandwrittenText } from "@/components/journal/HandwrittenText";
import { InkUnderline } from "@/components/journal/InkUnderline";
import { KeyText } from "@/components/journal/KeyText";
import { Poster } from "@/components/journal/Poster";
import { SketchSVG } from "@/components/journal/SketchSVG";
import { Spread } from "@/components/journal/Spread";
import { Stamp } from "@/components/journal/Stamp";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { TextLink } from "@/components/ui/TextLink";
import { getProject, microcopy, profile } from "@/content";
import { campfire } from "@/content/sketches";
import { dur, easeJournal, stagger } from "@/lib/motion";
import ProseSample from "./prose-sample.mdx";
import { contrast, readColorTokens, type ColorToken } from "./tokens";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

type Ground = "paper" | "night" | "leather";

const colorNotes: Record<string, { use: string; on: Ground; pair?: string }> = {
  paper: { use: "Page ground", on: "paper", pair: "ink" },
  "paper-light": {
    use: "Pasted notes, cards on paper, text on night",
    on: "paper",
    pair: "ink",
  },
  "paper-dark": {
    use: "Page edges, dividers, scrollbar track",
    on: "paper",
    pair: "ink",
  },
  ink: { use: "Body text and sketches", on: "paper" },
  "ink-soft": { use: "Secondary text, annotations", on: "paper" },
  "ink-faded": { use: "Captions 24px and up, disabled", on: "paper" },
  night: { use: "Camp ground", on: "night", pair: "paper-light" },
  "night-blue": { use: "Sky, fog tint", on: "night", pair: "paper-light" },
  dusk: { use: "Horizon", on: "night", pair: "paper-light" },
  ember: { use: "Firelight, primary action and focus on night", on: "night" },
  "ember-glow": { use: "Hover glow, sparks", on: "night" },
  blood: { use: "Stamps, Dead Eye marks, focus on paper", on: "paper" },
  leather: {
    use: "Cover, satchel, board frame",
    on: "leather",
    pair: "paper-light",
  },
  brass: { use: "Buckles, rules, icons on leather", on: "night" },
  sage: { use: "Map terrain, success marks", on: "paper" },
};

const paperGroup = [
  "paper",
  "paper-light",
  "paper-dark",
  "ink",
  "ink-soft",
  "ink-faded",
];
const nightGroup = ["night", "night-blue", "dusk", "ember", "ember-glow"];
const accentGroup = ["blood", "leather", "brass", "sage"];

function rating(ratio: number) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "Large text";
  return "Decoration";
}

function pairing(token: ColorToken, byName: Map<string, string>) {
  const note = colorNotes[token.name];
  const groundName = note?.pair ? token.name : (note?.on ?? "paper");
  const fgName = note?.pair ?? token.name;
  const ratio = contrast(
    byName.get(fgName) ?? "#000000",
    byName.get(groundName) ?? "#FFFFFF",
  );
  return { label: `${fgName} on ${groundName}`, ratio, rating: rating(ratio) };
}

const textured: Record<string, string> = {
  paper: "bg-[url('/textures/paper.webp')] bg-size-[512px_512px]",
  "paper-light": "bg-[url('/textures/paper.webp')] bg-size-[512px_512px]",
  "paper-dark": "bg-[url('/textures/paper.webp')] bg-size-[512px_512px]",
  leather: "bg-[url('/textures/leather.webp')] bg-size-[320px_320px]",
};

function Swatch({
  name,
  className = "h-12 w-16",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`shadow-pasted block shrink-0 outline-1 -outline-offset-1 outline-(--surface-fg)/20 ${textured[name] ?? ""} ${className}`}
      style={{ backgroundColor: `var(--color-${name})` }}
    />
  );
}

function LedgerRow({
  token,
  byName,
}: {
  token: ColorToken;
  byName: Map<string, string>;
}) {
  const p = pairing(token, byName);
  return (
    <li className="grid grid-cols-[4rem_1fr] items-center gap-x-5 gap-y-1 border-b border-(--surface-fg)/15 py-4 md:grid-cols-[4rem_9rem_5.5rem_1fr_auto]">
      <Swatch name={token.name} />
      <span className="font-type text-small">{token.name}</span>
      <span className="font-type text-caption md:text-small col-start-2 tabular-nums opacity-80 md:col-start-auto">
        {token.hex}
      </span>
      <span className="col-start-2 md:col-start-auto">
        {colorNotes[token.name]?.use}
      </span>
      <span className="font-type text-caption col-start-2 md:col-start-auto md:text-right">
        {p.label} {p.ratio.toFixed(1)}:1{" "}
        <span className="opacity-75">{p.rating}</span>
      </span>
    </li>
  );
}

function SectionHeading({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-10 max-w-(--measure)">
      <h2 id={id} className="font-display text-h2 tracking-poster uppercase">
        {title}
      </h2>
      <p className="text-lead mt-3 italic opacity-85">{children}</p>
    </div>
  );
}

const faces = [
  {
    face: "Rye",
    role: "Display",
    rule: "Posters and chapter titles. Uppercase, tracking +0.02em, headlines only.",
    sample: (
      <p className="font-display text-h1 tracking-poster uppercase">
        The Leather Job
      </p>
    ),
  },
  {
    face: "IM Fell English",
    role: "Body",
    rule: "Everything a recruiter needs to read. Regular and italic only: emphasis is italic, never bold.",
    sample: (
      <p className="text-body max-w-(--measure)">
        Full-stack developer who took an e-commerce platform from empty
        repository to a live store taking nationwide orders in two months, as
        the only engineer on it.{" "}
        <em>Strongest in TypeScript, Next.js, React and the data layer.</em>
      </p>
    ),
  },
  {
    face: "Homemade Apple",
    role: "Hand",
    rule: "Short journal entries, 22px and up, short lines. Always backed by real text.",
    sample: (
      <p className="font-hand text-h4 leading-[1.7]">
        Dhaka, 2026. Been riding with code a good while now.
      </p>
    ),
  },
  {
    face: "Caveat",
    role: "Note",
    rule: "Margin notes and annotations, 18px and up.",
    sample: (
      <p className="font-note text-h4">
        graduating October 2026, available full time
      </p>
    ),
  },
  {
    face: "Special Elite",
    role: "Type",
    rule: "Telegrams, stamped figures, ledger numbers. Never a costume for body text.",
    sample: (
      <ul className="font-type text-lead flex flex-wrap gap-x-8 gap-y-2 tabular-nums">
        <li>64 districts</li>
        <li>91.9% accuracy</li>
        <li>27.60 dB PSNR</li>
      </ul>
    ),
  },
];

const scale = [
  {
    step: "display",
    px: "52 to 96",
    className: "text-display font-display uppercase tracking-poster",
  },
  {
    step: "h1",
    px: "42 to 64",
    className: "text-h1 font-display uppercase tracking-poster",
  },
  {
    step: "h2",
    px: "34 to 48",
    className: "text-h2 font-display uppercase tracking-poster",
  },
  { step: "h3", px: "28 to 36", className: "text-h3" },
  { step: "h4", px: "24 to 28", className: "text-h4" },
  { step: "lead", px: "20 to 22", className: "text-lead" },
  { step: "body", px: "17 to 19", className: "text-body" },
  { step: "small", px: "16", className: "text-small" },
  { step: "caption", px: "14", className: "text-caption" },
];

// Values come from src/lib/motion.ts, which `npm test` checks against tokens.css.
const ms = (seconds: number) => `${Math.round(seconds * 1000)}ms`;
const motion = [
  {
    token: "--ease-journal",
    value: `cubic-bezier(${easeJournal.join(", ")})`,
    use: "Default ease: weighty, settles slowly",
  },
  { token: "--dur-hover", value: ms(dur.hover), use: "Hover lift and color" },
  {
    token: "--dur-stamp",
    value: ms(dur.stamp),
    use: "A stamp slamming down",
  },
  {
    token: "--dur-pin",
    value: ms(dur.pin),
    use: "Pinning a poster: a keyframed swing that settles, never an overshoot curve",
  },
  {
    token: "--dur-reveal",
    value: ms(dur.reveal),
    use: "Section reveal, 24px rise",
  },
  {
    token: "--dur-morph",
    value: ms(dur.morph),
    use: "A poster morphing between the board and its case study",
  },
  {
    token: "--dur-page",
    value: ms(dur.page),
    use: "Page turn between the journal and a case study",
  },
  {
    token: "--dur-draw",
    value: ms(dur.draw),
    use: "A sketch drawing itself",
  },
  { token: "--stagger", value: ms(stagger), use: "Between revealed siblings" },
];

const motionLevels = [
  {
    level: "Full",
    when: "The journal as designed",
    what: "Lenis smooth scroll, reveals, drawn sketches, stamps and pins.",
  },
  {
    level: "Reduced",
    when: "The system asks for reduced motion",
    what: "The browser's own scroll. Reveals become fades of 200ms or less; sketches arrive drawn.",
  },
  {
    level: "None",
    when: "Plain mode is on",
    what: "A still page: no smooth scroll, no scripted motion, no grain or tilts.",
  },
];

const icons = [
  { icon: Envelope, name: "Envelope" },
  { icon: GithubLogo, name: "GithubLogo" },
  { icon: LinkedinLogo, name: "LinkedinLogo" },
  { icon: FilePdf, name: "FilePdf" },
  { icon: Compass, name: "Compass" },
  { icon: MapPin, name: "MapPin" },
  { icon: Campfire, name: "Campfire" },
  { icon: Horse, name: "Horse" },
  { icon: PenNib, name: "PenNib" },
  { icon: Scroll, name: "Scroll" },
  { icon: BookOpen, name: "BookOpen" },
];

export default async function StyleguidePage() {
  const tokens = await readColorTokens();
  const byName = new Map(tokens.map((t) => [t.name, t.hex]));
  const pick = (names: string[]) =>
    tokens.filter((t) => names.includes(t.name));

  return (
    <main id="content" className="flex-1">
      <div className="mx-auto max-w-(--page-max) px-(--gutter) pt-12 pb-20 md:pt-20 md:pb-28">
        <header className="paper-light burn shadow-pinned max-w-3xl -rotate-[0.4deg] px-6 py-10 md:px-12 md:py-14">
          <h1 className="font-display text-h1 tracking-poster uppercase">
            Styleguide
          </h1>
          <p className="text-lead mt-5 max-w-(--measure)">
            What the journal is made of: paper, ink, firelight, five faces, and
            the rules for using them. Colors are read from the token file at
            build time, so this page cannot drift from the site.
          </p>
          <p className="font-type text-caption text-ink-soft mt-6">
            src/styles/tokens.css
          </p>
        </header>
      </div>

      <section
        aria-labelledby="paper-ink"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="paper-ink" title="Paper and ink">
          The pages. Ink on paper is the only pairing for long text.
        </SectionHeading>
        <ul className="border-ink/15 border-t">
          {pick(paperGroup).map((t) => (
            <LedgerRow key={t.name} token={t} byName={byName} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="accents"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="accents" title="Accents">
          Used sparingly. Blood red marks what matters: stamps, Dead Eye, focus.
        </SectionHeading>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {pick(accentGroup).map((t) => {
            const p = pairing(t, byName);
            return (
              <li key={t.name}>
                <Swatch name={t.name} className="aspect-[4/5] w-full" />
                <p className="font-type text-small mt-4">{t.name}</p>
                <p className="font-type text-caption text-ink-soft tabular-nums">
                  {t.hex}
                </p>
                <p className="mt-2">{colorNotes[t.name]?.use}</p>
                <p className="font-type text-caption text-ink-soft mt-1">
                  {p.label} {p.ratio.toFixed(1)}:1, {p.rating}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="night-camp"
        className="night from-night to-night-blue bg-linear-to-b from-40%"
      >
        <div className="mx-auto max-w-(--page-max) px-(--gutter) py-20 md:py-28">
          <SectionHeading id="night-camp" title="Night camp">
            The camp after dark. The site switches from night to paper exactly
            once, where the journal opens.
          </SectionHeading>
          <ul className="border-paper-light/15 border-t">
            {pick(nightGroup).map((t) => (
              <LedgerRow key={t.name} token={t} byName={byName} />
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap items-center gap-4">
            <Button href="#faces" icon={<Icon icon={ArrowRight} />}>
              Open the journal
            </Button>
            <Button href="#controls" variant="outline">
              Plain mode
            </Button>
          </div>
          <p className="text-paper-light/80 mt-8 max-w-(--measure)">
            Press Tab to walk the focus ring across these controls, and select
            this sentence to see the ember selection.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="faces"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="faces" title="Faces">
          Five families. Handwriting and display are decoration: every fact also
          exists in the body face.
        </SectionHeading>
        <div className="divide-ink/15 border-ink/15 divide-y border-y">
          {faces.map((f) => (
            <article
              key={f.face}
              className="grid gap-6 py-10 md:grid-cols-[16rem_1fr] md:gap-12"
            >
              <div>
                <h3 className="text-h4">{f.face}</h3>
                <p className="font-type text-caption text-ink-soft">{f.role}</p>
                <p className="text-small text-ink-soft mt-3">{f.rule}</p>
              </div>
              <div className="min-w-0 self-center">{f.sample}</div>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="scale"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="scale" title="Scale">
          Nine steps, fluid between phone and desktop. Display never passes
          6rem.
        </SectionHeading>
        <ol>
          {scale.map((s) => (
            <li
              key={s.step}
              className="grid items-baseline gap-2 py-3 md:grid-cols-[10rem_1fr] md:gap-8"
            >
              <span className="font-type text-caption text-ink-soft">
                {s.step}, {s.px}px
              </span>
              <span className={`min-w-0 break-words ${s.className}`}>
                Outlaw&apos;s Journal
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="materials"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="materials" title="Materials">
          Surfaces are textures, not flat fills. Shadows are warm, offset and
          soft.
        </SectionHeading>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-[14rem_14rem]">
          <div className="paper-light burn shadow-pasted col-span-2 row-span-2 flex min-h-64 flex-col justify-end p-6">
            <p className="font-type text-caption">paper-light burn</p>
            <p className="text-small text-ink-soft mt-1 max-w-xs">
              A sheet with scorched edges: the page itself, used for posters and
              journal pages.
            </p>
          </div>
          <div className="paper-dark shadow-pasted flex min-h-40 items-end p-4">
            <p className="font-type text-caption">paper-dark</p>
          </div>
          <div className="leather shadow-pasted flex min-h-40 items-end p-4">
            <p className="font-type text-caption">leather</p>
          </div>
          <div className="night from-night to-dusk shadow-pasted col-span-2 flex min-h-40 items-end bg-linear-to-br p-4">
            <p className="font-type text-caption">night to dusk</p>
          </div>
        </div>

        <ul className="mt-16 grid gap-10 sm:grid-cols-3">
          {[
            {
              name: "shadow-pasted",
              cls: "shadow-pasted rotate-[0.5deg]",
              note: "Glued flat to the page",
            },
            {
              name: "shadow-pinned",
              cls: "shadow-pinned -rotate-[0.6deg]",
              note: "Pinned, lifting at the corners",
            },
            {
              name: "shadow-lifted",
              cls: "shadow-lifted rotate-[0.3deg]",
              note: "Picked up, on hover",
            },
          ].map((s) => (
            <li key={s.name} className={`paper-light px-5 py-8 ${s.cls}`}>
              <p className="font-type text-caption">{s.name}</p>
              <p className="font-note text-lead mt-2">{s.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="controls"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="controls" title="Controls">
          Square printed tickets with an inner rule. One label per intent across
          the whole site.
        </SectionHeading>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-h4">On paper</h3>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                href="mailto:bodruddozaaraf@gmail.com"
                icon={<Icon icon={Envelope} />}
              >
                Send word
              </Button>
              <Button variant="outline" href="#controls">
                Plain mode
              </Button>
              <Button disabled>Send word</Button>
            </div>
            <p className="mt-8 max-w-(--measure)">
              Links sit in running text, like the{" "}
              <TextLink href="https://github.com/BodruddozaAraf/edubridge-ai">
                EduBridge AI repository
              </TextLink>{" "}
              or a jump back to the <TextLink href="#faces">faces</TextLink>.
            </p>
          </div>

          <div className="leather shadow-pinned px-6 py-8 md:px-8">
            <h3 className="text-h4">On leather</h3>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button href="#controls" icon={<Icon icon={FilePdf} />}>
                Resume
              </Button>
              <Button variant="outline" href="#controls">
                Plain mode
              </Button>
            </div>
            <p className="mt-6">
              Text on leather is always paper-light, and links take the ember
              glow, like this one back to the{" "}
              <TextLink href="#materials">materials</TextLink>.
            </p>
          </div>
        </div>

        <h3 className="text-h4 mt-16">Icons</h3>
        <p className="text-small text-ink-soft mt-2 max-w-(--measure)">
          Phosphor, regular weight only, tinted with the text color. Decorative
          icons are hidden from screen readers; icon-only controls carry a
          label.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {icons.map(({ icon, name }) => (
            <li key={name} className="flex flex-col items-start gap-2">
              <Icon icon={icon} size={32} />
              <span className="font-type text-caption text-ink-soft">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="journal"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="journal" title="Journal">
          The objects every section is built from: pages on the leather cover,
          handwriting with its real-text twin, sketches traced from period
          engravings, posters, pins and stamps.
        </SectionHeading>

        <Spread
          label="Sample spread"
          left={
            <>
              <HandwrittenText tilt="entry">
                <span className="block">{profile.journalEntry.dateline}</span>
                {profile.journalEntry.body}
              </HandwrittenText>
            </>
          }
          right={
            <>
              <SketchSVG
                sketch={campfire}
                title="Pen sketch of a smouldering campfire of logs"
                className="text-ink-soft"
              />
              <HandwrittenText variant="note" tilt="caption" className="mt-3">
                the fire, after Winslow Homer, 1874
              </HandwrittenText>
              <h3 className="text-h4 mt-10">A note for the lawmen</h3>
              <p className="mt-3 max-w-(--measure)">{profile.summary}</p>
            </>
          }
        />

        <div className="mt-20 grid items-start gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          <Poster seed="wanted" className="mx-auto w-full max-w-md text-center">
            <p className="font-display text-h1 tracking-poster leading-none uppercase">
              {microcopy.wanted.heading}
            </p>
            <div className="paper-dark shadow-pasted mx-auto mt-6 grid aspect-[4/5] w-3/5 place-items-center">
              <HandwrittenText variant="note" as="span" className="px-4">
                portrait to come
              </HandwrittenText>
            </div>
            <p className="font-display text-h1 tracking-poster mt-6 uppercase">
              {profile.posterName}
            </p>
            <p className="text-lead mt-4">{microcopy.wanted.charge}</p>
            <p className="mt-2 italic">{microcopy.wanted.aside}</p>
            <div className="mt-8">
              <Stamp seed="reward" size="md">
                {microcopy.wanted.reward}
              </Stamp>
            </div>
            <p className="font-type text-small mt-6">
              {microcopy.wanted.available}
            </p>
          </Poster>

          {(() => {
            const bounty = getProject("jack-the-jelli")!;
            return (
              <Poster
                seed={bounty.slug}
                pins={2}
                className="relative mx-auto w-full max-w-md md:mt-16"
              >
                <p className="font-display text-h2 tracking-poster uppercase">
                  {bounty.bountyTitle}
                </p>
                <p className="text-lead mt-2 italic">{bounty.posterLine}</p>
                <p className="mt-6">
                  <span className="text-h4">{bounty.name}</span>
                  <span className="text-small text-ink-soft block">
                    {bounty.tagline}
                  </span>
                </p>
                {bounty.metric ? (
                  <p className="mt-6">
                    <InkUnderline seed={`${bounty.slug}-metric`}>
                      <span className="font-type text-h3">
                        {bounty.metric.value}
                      </span>
                    </InkUnderline>
                    <span className="text-small mt-3 block">
                      {bounty.metric.label}
                    </span>
                  </p>
                ) : null}
                <p className="font-type text-caption text-ink-soft mt-6">
                  {bounty.stackLine}
                </p>
                <div className="mt-7">
                  <Stamp seed="claimed" size="lg">
                    Claimed
                  </Stamp>
                </div>
              </Poster>
            );
          })()}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-h4">Stamps</h3>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Stamp seed="a" size="sm">
                Delivered
              </Stamp>
              <Stamp seed="b">Claimed</Stamp>
              <Stamp seed="c" shape="round">
                B.A.
              </Stamp>
              <Stamp seed="d" shape="round" size="sm" tone="ink">
                Dhaka 2026
              </Stamp>
            </div>
          </div>
          <div>
            <h3 className="text-h4">Ink underline and key terms</h3>
            <p className="mt-6 max-w-(--measure)">
              Reached{" "}
              <InkUnderline seed="acc">
                <span className="font-type">91.9% accuracy</span>
              </InkUnderline>{" "}
              and{" "}
              <InkUnderline seed="psnr" tone="ink" double>
                <span className="font-type">27.60 dB PSNR</span>
              </InkUnderline>
              .
            </p>
            <p className="mt-6 max-w-(--measure)">
              <KeyText text={getProject("jack-the-jelli")!.highlights[1]} />
            </p>
          </div>
        </div>

        <Engraving
          src="/engravings/camping-out-adirondacks.webp"
          width={1600}
          height={1074}
          alt="Wood engraving: two men rest by a bark lean-to and a smouldering campfire on a lakeshore, canoes behind them and a dog to the left"
          caption="Camping Out in the Adirondack Mountains, after Winslow Homer, Harper's Weekly, 1874"
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="mt-20"
        />
      </section>

      <section
        aria-labelledby="motion"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="motion" title="Motion">
          Weighty and organic. Things are drawn, pinned and stamped; nothing
          bounces like an app. With reduced motion, sketches arrive drawn and
          fades stay under 200ms.
        </SectionHeading>
        <dl className="grid gap-x-10 md:grid-cols-2">
          {motion.map((m) => (
            <div
              key={m.token}
              className="border-ink/15 grid gap-x-4 border-b py-4 sm:grid-cols-[1fr_auto]"
            >
              <dt className="font-type text-small">{m.token}</dt>
              <dd className="font-type text-small text-ink-soft tabular-nums">
                {m.value}
              </dd>
              <dd className="mt-1 sm:col-span-2">{m.use}</dd>
            </div>
          ))}
        </dl>
        <h3 className="text-h4 mt-16">Three levels of motion</h3>
        <p className="mt-3 max-w-(--measure)">
          Every scripted animation asks <code>useMotionLevel()</code> first.
          These notes use the reveal helper with a stagger, so on a fresh load
          they rise into place one after another as you scroll to them.
        </p>
        <Reveal as="ul" stagger className="mt-8 grid gap-6 md:grid-cols-3">
          {motionLevels.map((m) => (
            <li key={m.level} className="paper-light shadow-pasted px-6 py-7">
              <p className="text-h4">{m.level}</p>
              <p className="text-ink-soft mt-1 italic">{m.when}</p>
              <p className="mt-3">{m.what}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <section
        aria-labelledby="prose"
        className="mx-auto max-w-(--page-max) px-(--gutter) py-16 md:py-24"
      >
        <SectionHeading id="prose" title="Prose">
          Case studies are MDX. Markdown renders in the journal&apos;s type
          through src/mdx-components.tsx; strong text keeps its meaning but sets
          italic.
        </SectionHeading>
        <div className="paper-light burn shadow-pasted max-w-3xl px-6 py-10 md:px-12 md:py-14">
          <ProseSample />
        </div>
      </section>

      <section
        aria-labelledby="browser"
        className="mx-auto max-w-(--page-max) px-(--gutter) pt-16 pb-28 md:pt-24 md:pb-36"
      >
        <SectionHeading id="browser" title="Browser surfaces">
          The parts the browser draws still belong to the journal.
        </SectionHeading>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-h4">Selection</h3>
            <p className="mt-3">
              Select this line: the highlight is a wash of blood red, like a
              pencil mark in the margin.
            </p>
          </div>
          <div>
            <h3 className="text-h4">Caret and focus</h3>
            <label htmlFor="sg-caret" className="text-small mt-3 block">
              Your name
            </label>
            <input
              id="sg-caret"
              type="text"
              autoComplete="off"
              className="border-ink bg-paper-light/70 text-body mt-2 w-full border-b px-3 py-2"
            />
          </div>
          <div>
            <h3 className="text-h4">Scrollbar</h3>
            <div
              tabIndex={0}
              role="region"
              aria-label="Scrollable sample"
              className="bg-paper-light/60 text-small mt-3 h-36 overflow-y-auto p-4"
            >
              <p>
                Took a store from an empty repo to orders coming in from every
                corner of the country in two months, no posse, just me.
                TypeScript and Next.js are my iron; the data layer is where I
                sleep easy. Lately I&apos;ve been teaching machines to see what
                ain&apos;t there.
              </p>
              <p className="mt-3">
                The scrollbar is leather on a paper-dark track, thin, on every
                scrolling surface.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
