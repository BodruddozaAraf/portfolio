import Image from "next/image";
import type { Project } from "@/content";
import { seededRange } from "@/lib/seed";

// Screenshots of the live work (A16), pasted into the journal like photographs: a fresh sheet
// border, the pasted shadow, a seeded tilt of half a degree at most (D46). The first one runs
// wide; the rest sit beneath it, a phone shot narrower than the screens beside it.

type Shot = NonNullable<Project["screenshots"]>[number];

export function Screens({
  title,
  shots,
  seed,
}: {
  title: string;
  shots: Shot[];
  seed: string;
}) {
  const [first, ...rest] = shots;
  const photo = (shot: Shot, i: number, sizes: string) => (
    <figure
      key={shot.src}
      className="bg-paper-light shadow-pasted p-2 pb-3"
      style={{ rotate: `${seededRange(`${seed}-shot-${i}`, 0.5)}deg` }}
    >
      <Image
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        sizes={sizes}
        className="h-auto w-full"
      />
      <figcaption className="font-note text-lead text-ink-soft mt-2 px-1">
        {shot.caption}
      </figcaption>
    </figure>
  );
  return (
    <section aria-labelledby="screens-title" className="mt-20 max-w-5xl">
      <h2 id="screens-title" className="font-note text-h4 text-ink-soft">
        {title}
      </h2>
      <div className="mt-6 grid gap-8">
        {photo(first, 0, "(min-width: 1024px) 60rem, 100vw")}
        <div className="grid items-start gap-8 sm:grid-cols-[1fr_1fr_0.55fr]">
          {rest.map((shot, i) =>
            photo(shot, i + 1, "(min-width: 640px) 30vw, 100vw"),
          )}
        </div>
      </div>
    </section>
  );
}
