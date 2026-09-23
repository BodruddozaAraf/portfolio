import { Poster } from "@/components/journal/Poster";
import { Stamp } from "@/components/journal/Stamp";
import { HandwrittenText } from "@/components/journal/HandwrittenText";
import { microcopy, profile, skillName } from "@/content";
import { seededRange } from "@/lib/seed";

// 3. Wanted. The poster nailed to a wooden post, the figures around it as stamped tickets. The poster's
// "known associates" are profile.strengths; every figure is also plain text.

export function Wanted() {
  return (
    <section
      id="wanted"
      aria-labelledby="wanted-title"
      className="overflow-x-clip"
    >
      <div className="chapter shell relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)_minmax(0,1fr)] lg:gap-10">
        {/* the post the poster is nailed to */}
        <span
          aria-hidden
          className="wood shadow-pinned absolute inset-y-0 left-1/2 hidden w-28 -translate-x-1/2 lg:block"
        />
        <ul className="order-2 grid gap-5 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:justify-items-end">
          {profile.stats.slice(0, 3).map((stat) => (
            <Ticket key={stat.value} value={stat.value} label={stat.label} />
          ))}
        </ul>

        <Poster
          seed="wanted"
          className="text-ink order-1 mx-auto w-full max-w-md text-center lg:order-2"
        >
          <h2
            id="wanted-title"
            className="font-display text-h1 tracking-poster uppercase"
          >
            {microcopy.wanted.heading}
            <span className="sr-only">: skills and reputation</span>
          </h2>
          <div className="paper-dark shadow-pasted mx-auto mt-6 grid aspect-[4/5] w-3/5 place-items-center">
            <HandwrittenText variant="note" as="span" className="px-4">
              portrait to come
            </HandwrittenText>
          </div>
          <p className="font-display text-h1 tracking-poster mt-6 uppercase">
            {profile.posterName}
          </p>
          <p className="text-small text-ink-soft mt-1">{profile.name}</p>
          <p className="text-lead mt-5">{microcopy.wanted.charge}</p>
          <p className="mt-2 italic">{microcopy.wanted.aside}</p>
          <div className="border-ink/20 mt-6 border-t pt-5">
            <p className="font-note text-lead text-ink-soft">
              Known associates
            </p>
            <p className="mt-1">
              {profile.strengths.map((id) => skillName.get(id)).join(", ")}
            </p>
          </div>
          <div className="mt-7">
            <Stamp seed="reward">{microcopy.wanted.reward}</Stamp>
          </div>
          <p className="font-type text-small mt-6">
            {microcopy.wanted.available}
          </p>
        </Poster>

        <ul className="order-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:justify-items-start">
          {profile.stats.slice(3).map((stat) => (
            <Ticket key={stat.value} value={stat.value} label={stat.label} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Ticket({ value, label }: { value: string; label: string }) {
  return (
    <li
      className="paper-dark text-ink shadow-pinned w-full max-w-64 px-5 py-4"
      style={{ rotate: `${seededRange(value, 1.5)}deg` }}
    >
      <p className="font-type text-h4 leading-none">{value}</p>
      <p className="text-small mt-2">{label}</p>
    </li>
  );
}
