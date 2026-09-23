import type { Metadata } from "next";
import Link from "next/link";
import { KeyText } from "@/components/journal/KeyText";
import { PlainModeSwitch } from "@/components/nav/PlainModeSwitch";
import {
  education,
  experience,
  extracurricular,
  formatMonth,
  formatRange,
  profile,
  projects,
  research,
  skills,
} from "@/content";
import { resumeAvailable } from "@/lib/public-files";

// Plain mode (docs/05-sections.md, Global features): everything on the site, text first, one
// column, printable, no effects. The same facts as the journal, in resume order.

export const metadata: Metadata = {
  title: `${profile.name}, plain`,
  description: profile.summary,
  alternates: { canonical: "/plain" },
};

function H2({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="border-ink/25 text-h3 mt-14 border-b pb-2">
      {children}
    </h2>
  );
}

const link =
  "underline decoration-ink/45 underline-offset-[0.22em] hover:text-blood hover:decoration-blood";

export default function PlainPage() {
  const { email, github, linkedin, resume } = profile.links;
  const contact = [
    { href: email.href, text: profile.email },
    { href: github.href, text: "github.com/BodruddozaAraf" },
    { href: linkedin.href, text: "linkedin.com/in/bodruddoza-araf" },
    ...(resumeAvailable ? [{ href: resume.href, text: "Resume (PDF)" }] : []),
  ];
  return (
    <div className="paper-light min-h-[100dvh]">
      <div className="print-hidden border-ink/15 border-b">
        <div className="text-small mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-(--gutter) py-4">
          <Link href="/" className={link}>
            Open the journal
          </Link>
          <PlainModeSwitch />
        </div>
      </div>

      <main
        id="content"
        className="mx-auto max-w-3xl px-(--gutter) pt-12 pb-24"
      >
        <header>
          <h1 className="text-h1">{profile.name}</h1>
          <p className="text-lead mt-2">
            {profile.roleLine}. {profile.location}.
          </p>
          <p className="mt-2 italic">{profile.availability}</p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {contact.map((c) => (
              <li key={c.href}>
                <a href={c.href} className={link}>
                  {c.text}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <H2 id="summary">Summary</H2>
        <p className="mt-4">{profile.summary}</p>

        <H2 id="experience">Experience</H2>
        {experience.map((job) => (
          <article key={job.id} className="mt-6">
            <h3 className="text-h4">
              {job.role} ({job.employment}),{" "}
              <a href={job.url} className={link}>
                {job.company}
              </a>
            </h3>
            <p className="font-type text-small">
              {formatRange(job.start, job.end)}. {job.companyNote}.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {job.highlights.map((h) => (
                <li key={h}>
                  <KeyText text={h} />
                </li>
              ))}
            </ul>
          </article>
        ))}

        <H2 id="projects">Projects</H2>
        {projects
          .filter((p) => !experience.some((job) => job.bounty === p.slug))
          .map((p) => (
            <article key={p.slug} className="mt-6">
              <h3 className="text-h4">
                <Link href={`/bounties/${p.slug}`} className={link}>
                  {p.name}
                </Link>
                : {p.tagline}
              </h3>
              <p className="font-type text-small">{p.stackLine}</p>
              {p.links.length ? (
                <p className="text-small mt-1">
                  {p.links.map((l, i) => (
                    <span key={l.href}>
                      {i ? ", " : ""}
                      <a href={l.href} className={link}>
                        {l.label}
                      </a>
                    </span>
                  ))}
                </p>
              ) : null}
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {p.highlights.map((h) => (
                  <li key={h}>
                    <KeyText text={h} />
                  </li>
                ))}
              </ul>
            </article>
          ))}

        <H2 id="research">Research</H2>
        <article className="mt-6">
          <h3 className="text-h4">
            <Link href={`/research/${research.slug}`} className={link}>
              {research.title}
            </Link>
          </h3>
          <p className="font-type text-small">
            {research.type}, defended {research.defended}. Supervisor:{" "}
            {research.supervisor}, {research.institution}. {research.stackLine}.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {research.highlights.map((h) => (
              <li key={h}>
                <KeyText text={h} />
              </li>
            ))}
          </ul>
        </article>

        <H2 id="skills">Skills</H2>
        <dl className="mt-4 space-y-2">
          {skills.map((c) => (
            <div key={c.id} className="grid gap-x-4 sm:grid-cols-[10rem_1fr]">
              <dt className="italic">{c.title}</dt>
              <dd>{c.skills.map((s) => s.name).join(", ")}</dd>
            </div>
          ))}
          <div className="grid gap-x-4 sm:grid-cols-[10rem_1fr]">
            <dt className="italic">Spoken</dt>
            <dd>
              {profile.spokenLanguages
                .map((l) => `${l.name} (${l.level})`)
                .join(", ")}
            </dd>
          </div>
        </dl>

        <H2 id="education">Education</H2>
        <p className="mt-4">
          <span className="text-h4">{education.institution}</span>,{" "}
          {education.city}. {education.degree}. {education.started} - expected{" "}
          {formatMonth(education.expected)}.
        </p>

        <H2 id="extracurricular">Extracurricular</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {extracurricular.achievements.map((a) => (
            <li key={a.title}>
              {a.title}, {extracurricular.group}. {a.detail}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
