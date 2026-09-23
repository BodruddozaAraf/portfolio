import { ArrowDown } from "@phosphor-icons/react/ssr";
import { Engraving } from "@/components/journal/Engraving";
import { InkUnderline } from "@/components/journal/InkUnderline";
import { KeyText } from "@/components/journal/KeyText";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { research } from "@/content";
import { ChapterTitle } from "./ChapterTitle";
import { TURN_FORWARD } from "@/lib/page-turn";

// 5. The Torn Page. The thesis in plain figures: the three-stage pipeline, the metrics, what Araf
// owned. The engraving stands in for the torn page until step 3.7 builds the reconstruction.

export function Research() {
  const [lead, ...metrics] = research.metrics;
  return (
    <section
      id="research"
      aria-labelledby="research-title"
      className="chapter shell"
    >
      <ChapterTitle id="research-title" standfirst="Seeing what the fire took.">
        {research.headline}
      </ChapterTitle>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <h3 className="text-h3">{research.title}</h3>
          <p className="font-type text-small mt-4">
            {research.type}, defended {research.defended}. Supervised by{" "}
            {research.supervisor}, {research.institution}. {research.stackLine}.
          </p>

          <ol className="mt-10 space-y-3" aria-label="Pipeline">
            {research.architecture.map((stage, i) => (
              <li key={stage}>
                <p className="border-ink/40 text-lead border px-4 py-3">
                  {stage}
                </p>
                {i < research.architecture.length - 1 ? (
                  <Icon
                    icon={ArrowDown}
                    className="text-ink-soft mx-auto mt-3 block"
                  />
                ) : null}
              </li>
            ))}
          </ol>

          <ul className="mt-10 space-y-4">
            {research.highlights.map((h) => (
              <li key={h} className="max-w-(--measure)">
                <KeyText text={h} />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Engraving
            src="/engravings/camping-out-adirondacks.webp"
            width={1600}
            height={1074}
            alt="Wood engraving: two men rest by a bark lean-to and a smouldering campfire on a lakeshore"
            caption="Camping Out in the Adirondack Mountains, after Winslow Homer, 1874"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <dl className="border-ink/15 mt-10 border-t">
            <div className="border-ink/15 flex items-baseline justify-between gap-6 border-b py-4">
              <dt>{lead.label}</dt>
              <dd>
                <InkUnderline seed="research-psnr" double>
                  <span className="font-type text-h3">{lead.value}</span>
                </InkUnderline>
              </dd>
            </div>
            {metrics.map((m) => (
              <div
                key={m.label}
                className="border-ink/15 flex items-baseline justify-between gap-6 border-b py-4"
              >
                <dt>{m.label}</dt>
                <dd className="font-type text-h4 whitespace-nowrap">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <Button
              href={`/research/${research.slug}`}
              transitionTypes={TURN_FORWARD}
            >
              Read the account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
