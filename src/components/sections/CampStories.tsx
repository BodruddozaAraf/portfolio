import { Page } from "@/components/journal/Page";
import { Stamp } from "@/components/journal/Stamp";
import { extracurricular } from "@/content";

// 8. Camp Stories. Small and charming: one page with a newspaper clipping and two medals. The
// football sketch (A05) joins it when that engraving is sourced.

export function CampStories() {
  const [tournament, tarc] = extracurricular.achievements;
  return (
    <section id="camp" aria-labelledby="camp-title" className="chapter shell">
      <Page spine="left" className="mx-auto max-w-3xl">
        <h2
          id="camp-title"
          className="font-display text-h2 tracking-poster uppercase"
        >
          Camp Stories
        </h2>
        <p className="font-note text-lead text-ink-soft mt-2">
          {extracurricular.group}
        </p>

        <article className="paper-light shadow-pasted mt-8 -rotate-[0.5deg] px-6 py-6 md:px-8">
          <h3 className="font-display text-h3 tracking-poster leading-tight uppercase">
            {tournament.title}
          </h3>
          <p className="text-lead mt-3 max-w-(--measure)">
            {tournament.detail}
          </p>
          <ul className="mt-6 flex flex-wrap gap-5" aria-label="Awards">
            <li>
              <Stamp shape="round" size="lg" seed="best-striker" tone="ink">
                Best Striker
              </Stamp>
            </li>
            <li>
              <Stamp shape="round" size="lg" seed="best-midfielder" tone="ink">
                Best Midfielder
              </Stamp>
            </li>
          </ul>
        </article>

        <p className="text-lead mt-8">
          <span className="font-display tracking-poster uppercase">
            {tarc.title}.
          </span>{" "}
          {tarc.detail}
        </p>
      </Page>
    </section>
  );
}
