import Link from "next/link";
import { profile, skills, skillUsage } from "@/content";
import { ChapterTitle } from "./ChapterTitle";

// 7. Tools of the Trade. The satchel's pouches on the leather: one tag per category, each tool
// with where it was used, derived from the bounties (D30: no proficiency bars, ever). The
// inventory-card interaction arrives in step 2.6.

const tilts = [-0.5, 0.4, -0.2, 0.6, -0.4, 0.3];

export function Satchel() {
  return (
    <section
      id="satchel"
      aria-labelledby="satchel-title"
      className="leather overflow-x-clip"
    >
      <div className="chapter shell">
        <ChapterTitle
          id="satchel-title"
          standfirst="What rides in the satchel, and where each piece was last used."
        >
          Tools of the Trade
        </ChapterTitle>
        <ul className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category, i) => (
            <li
              key={category.id}
              className="paper-light text-ink shadow-pinned px-6 pt-6 pb-7"
              style={{ rotate: `${tilts[i % tilts.length]}deg` }}
            >
              <h3 className="font-display text-h4 tracking-poster uppercase">
                {category.title}
              </h3>
              <ul className="divide-ink/12 mt-5 divide-y">
                {category.skills.map((skill) => {
                  const used = skillUsage.get(skill.id) ?? [];
                  return (
                    <li key={skill.id} className="py-2.5">
                      <span>{skill.name}</span>
                      {used.length ? (
                        <span className="text-caption text-ink-soft block">
                          Used in{" "}
                          {used.map((u, j) => (
                            <span key={u.href}>
                              {j ? ", " : ""}
                              <Link
                                href={u.href}
                                className="decoration-ink/35 hover:text-blood hover:decoration-blood underline underline-offset-2"
                              >
                                {u.name}
                              </Link>
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        <p className="text-lead mt-12 max-w-(--measure)">
          <span className="font-note text-h4">Spoken tongues:</span>{" "}
          {profile.spokenLanguages
            .map((l) => `${l.name}, ${l.level}`)
            .join("; ")}
          .
        </p>
      </div>
    </section>
  );
}
