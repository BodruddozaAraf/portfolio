import Link from "next/link";
import { KeyText } from "@/components/journal/KeyText";
import { Pin } from "@/components/journal/Pin";
import {
  education,
  experience,
  formatMonth,
  formatRange,
  timeline,
} from "@/content";
import { ChapterTitle } from "./ChapterTitle";

// 6. Trail So Far. The pins in trail order, joined by a dotted trail: across the page on desktop,
// down it on phones. Below the map, the record in full: the job and the degree, every resume line.
// The drawn map (A04) and the scroll-drawn trail arrive in step 2.5.

export function Trail() {
  return (
    <section id="trail" aria-labelledby="trail-title" className="chapter shell">
      <ChapterTitle id="trail-title">Trail So Far</ChapterTitle>

      <ol className="paper-dark shadow-pasted relative grid gap-10 px-6 py-10 md:px-10 lg:grid-cols-6 lg:gap-6 lg:px-8 lg:py-14">
        {/* the trail: vertical on phones, horizontal on desktop */}
        <span
          aria-hidden
          className="border-ink/45 absolute top-12 bottom-12 left-[1.94rem] border-l-2 border-dotted md:left-[2.94rem] lg:top-[3.94rem] lg:right-10 lg:bottom-auto lg:left-10 lg:border-t-2 lg:border-l-0"
        />
        {timeline.map((pin) => (
          <li
            key={pin.id}
            className="relative grid grid-cols-[1.25rem_1fr] gap-4 lg:block"
          >
            <Pin className="relative mt-1 lg:mx-0 lg:mt-0 lg:mb-6" />
            <div>
              {pin.when ? (
                <p className="font-type text-caption">{pin.when}</p>
              ) : null}
              <h3 className="text-h4 mt-1 leading-tight">
                {pin.href ? (
                  <Link
                    href={pin.href}
                    className="decoration-ink/40 hover:text-blood hover:decoration-blood underline underline-offset-[0.2em] transition-colors duration-(--dur-hover)"
                  >
                    {pin.title}
                  </Link>
                ) : (
                  pin.title
                )}
              </h3>
              <p className="text-small mt-2">{pin.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        {experience.map((job) => (
          <article key={job.id} aria-labelledby={`job-${job.id}`}>
            <h3 id={`job-${job.id}`} className="text-h3">
              {job.role} ({job.employment}), {job.company}
            </h3>
            <p className="font-type text-small mt-2">
              {formatRange(job.start, job.end)}. {job.companyNote}.{" "}
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="decoration-ink/45 hover:text-blood underline underline-offset-[0.22em]"
              >
                {job.url.replace("https://", "")}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
            <ul className="marker:text-ink-soft mt-6 max-w-(--measure) list-disc space-y-3 pl-5">
              {job.highlights.map((h) => (
                <li key={h}>
                  <KeyText text={h} />
                </li>
              ))}
            </ul>
          </article>
        ))}
        <article aria-labelledby="education-title">
          <h3 id="education-title" className="text-h3">
            {education.institution}
          </h3>
          <p className="mt-2">
            {education.degree}, {education.city}.
          </p>
          <p className="font-type text-small mt-2">
            {education.started} - expected {formatMonth(education.expected)}
          </p>
        </article>
      </div>
    </section>
  );
}
