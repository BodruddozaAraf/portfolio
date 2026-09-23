import { HandwrittenText } from "@/components/journal/HandwrittenText";
import { Spread } from "@/components/journal/Spread";
import { education, formatMonth, profile } from "@/content";
import { ChapterTitle } from "./ChapterTitle";

// 2. Journal Entry. Left page: the entry in Araf's hand. Right page: the pasted photograph
// (placeholder until A06), the margin facts, and the same story in plain type for the lawmen,
// so nothing a recruiter needs lives only in handwriting.

export function About() {
  const facts = [
    { label: "Based in", value: profile.location },
    {
      label: "Graduating",
      value: `${formatMonth(education.expected)}, ${education.institution}`,
    },
    {
      label: "Speaks",
      value: profile.spokenLanguages
        .map((l) => `${l.name} (${l.level})`)
        .join(", "),
    },
  ];
  return (
    <section id="about" aria-labelledby="about-title" className="chapter shell">
      <ChapterTitle id="about-title">Journal Entry</ChapterTitle>
      <Spread
        label="Journal entry, Dhaka, 2026"
        left={
          <HandwrittenText tilt="about-entry">
            <span className="block">{profile.journalEntry.dateline}</span>
            {profile.journalEntry.body}
          </HandwrittenText>
        }
        right={
          <div className="grid gap-8 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-start">
            <figure className="bg-paper-light shadow-pasted mx-auto w-40 rotate-[1.2deg] p-2 pb-8 sm:mx-0 sm:w-full">
              <div className="paper-dark grid aspect-[4/5] place-items-center">
                <HandwrittenText
                  variant="note"
                  as="span"
                  className="px-3 text-center"
                >
                  photograph to come
                </HandwrittenText>
              </div>
              <figcaption className="sr-only">
                Portrait of {profile.name}, coming soon
              </figcaption>
            </figure>
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-note text-lead text-ink-soft">
                    {f.label}
                  </dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="sm:col-span-2">
              <h3 className="text-h4">A note for the lawmen</h3>
              <p className="mt-3">{profile.summary}</p>
            </div>
          </div>
        }
      />
    </section>
  );
}
