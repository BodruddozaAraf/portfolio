import Link from "next/link";
import type { CSSProperties } from "react";
import { KeyText } from "@/components/journal/KeyText";
import { Pin } from "@/components/journal/Pin";
import { TrailMoment } from "@/components/motion/TrailMoment";
import {
  education,
  experience,
  formatMonth,
  formatRange,
  timeline,
} from "@/content";
import { ChapterTitle } from "./ChapterTitle";

// 6. Trail So Far. The pins in trail order on the survey map (A04, scripts/map), joined by a
// dotted trail: across the map on desktop, down it on phones. As rendered here the trail is fully
// drawn; TrailMoment turns it into a ride (the camera pans the map on desktop, the trail draws
// with the scroll and the pins drop as it reaches them). Below the map, the record in full.

/** Where each pin sits in the trail band, as a percentage of its height (the trail meanders). */
const bandY = [62, 30, 70, 36, 66, 34];

// the dotted trail through the pins, in a 600 x 100 box stretched over the band
const trailPath = timeline
  .map((_, i) => {
    const x = (i + 0.5) * (600 / timeline.length);
    const y = bandY[i % bandY.length];
    if (i === 0) return `M ${x} ${y}`;
    const px = (i - 0.5) * (600 / timeline.length);
    const py = bandY[(i - 1) % bandY.length];
    const mid = (px + x) / 2;
    return `C ${mid} ${py}, ${mid} ${y}, ${x} ${y}`;
  })
  .join(" ");

export function Trail() {
  return (
    <section id="trail" aria-labelledby="trail-title" className="chapter">
      <div className="shell">
        <ChapterTitle id="trail-title">Trail So Far</ChapterTitle>
      </div>

      <TrailMoment className="shell">
        <div className="shadow-pasted overflow-hidden">
          <div
            data-trail="track"
            className="bg-paper-dark relative bg-[url('/maps/trail.webp'),url('/textures/paper.webp')] bg-size-[cover,512px_512px] bg-center bg-blend-multiply group-data-riding:flex group-data-riding:h-[min(36rem,78vh)] group-data-riding:w-[168rem] group-data-riding:items-center"
          >
            <div className="relative w-full px-6 py-10 md:px-10 lg:px-0 lg:py-12">
              {/* the trail: a dotted line down the page on phones, a meander across the map on desktop */}
              <span
                aria-hidden
                data-trail="line-v"
                className="border-ink/50 absolute top-12 bottom-12 left-[2.44rem] border-l-2 border-dotted md:left-[3.44rem] lg:hidden"
              />
              <svg
                aria-hidden
                data-trail="line-h"
                viewBox="0 0 600 100"
                preserveAspectRatio="none"
                className="text-ink/60 absolute inset-x-0 top-12 hidden h-28 w-full lg:block"
              >
                <path
                  d={trailPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="0.1 11"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-0 lg:pt-28">
                {timeline.map((pin, i) => (
                  <li
                    key={pin.id}
                    data-trail="stop"
                    className="relative grid grid-cols-[2rem_1fr] items-start gap-3 lg:block lg:px-3"
                    style={
                      {
                        "--band-y": bandY[i % bandY.length],
                      } as CSSProperties
                    }
                  >
                    <Pin className="relative mt-3 ml-2 lg:absolute lg:top-[calc(var(--band-y)*0.07rem-7rem)] lg:left-1/2 lg:m-0 lg:-translate-x-1/2 lg:-translate-y-1/2" />
                    <div
                      data-trail="card"
                      className="paper-light shadow-pasted px-4 py-3 lg:mx-auto lg:mt-4 lg:max-w-72"
                    >
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
            </div>
          </div>
        </div>
      </TrailMoment>

      <div className="shell mt-20 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
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
