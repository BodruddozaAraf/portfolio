import Link from "next/link";
import type { CSSProperties } from "react";
import { profile, skills, skillUsage } from "@/content";
import { TURN_FORWARD } from "@/lib/page-turn";
import { ChapterTitle } from "./ChapterTitle";

// 7. Tools of the Trade. The satchel's pouches on the leather: one tag per category, each tool
// with where it was used, derived from the bounties (D30: no proficiency bars, ever). Hovering a
// pouch lifts what is in it; each tool opens its item card (a native popover, so it works
// without JavaScript and closes on Esc or a click outside): the pouch, and every bounty that used
// it with what that bounty was.

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
          standfirst="What rides in the satchel, and where each piece was last used. Take one out for a closer look."
        >
          Tools of the Trade
        </ChapterTitle>
        <ul className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category, i) => (
            <li
              key={category.id}
              className="group paper-light text-ink shadow-pinned hover:shadow-lifted focus-within:shadow-lifted ease-journal px-6 pt-6 pb-7 transition-shadow duration-(--dur-hover)"
              style={{ rotate: `${tilts[i % tilts.length]}deg` }}
            >
              <h3 className="font-display text-h4 tracking-poster uppercase">
                {category.title}
              </h3>
              <ul className="divide-ink/12 mt-5 divide-y">
                {category.skills.map((skill, j) => {
                  const used = skillUsage.get(skill.id) ?? [];
                  const card = `item-${skill.id}`;
                  return (
                    <li
                      key={skill.id}
                      className="ease-journal py-2.5 transition-[translate] duration-(--dur-hover) motion-safe:group-hover:-translate-y-0.5"
                      style={
                        { transitionDelay: `${j * 25}ms` } as CSSProperties
                      }
                    >
                      <button
                        type="button"
                        popoverTarget={card}
                        className="decoration-ink/30 hover:text-blood hover:decoration-blood cursor-pointer text-left underline decoration-dotted underline-offset-4"
                      >
                        {skill.name}
                      </button>
                      {used.length ? (
                        <span className="text-caption text-ink-soft block">
                          Used in{" "}
                          {used.map((u, k) => (
                            <span key={u.href}>
                              {k ? ", " : ""}
                              <Link
                                href={u.href}
                                transitionTypes={TURN_FORWARD}
                                className="decoration-ink/35 hover:text-blood hover:decoration-blood underline underline-offset-2"
                              >
                                {u.name}
                              </Link>
                            </span>
                          ))}
                        </span>
                      ) : null}
                      <div
                        id={card}
                        popover="auto"
                        role="dialog"
                        aria-labelledby={`${card}-name`}
                        className="item-card paper-light text-ink shadow-lifted m-auto w-[min(26rem,calc(100vw-2rem))] px-7 pt-7 pb-6"
                      >
                        <p
                          id={`${card}-name`}
                          className="font-display text-h3 tracking-poster leading-tight uppercase"
                        >
                          {skill.name}
                        </p>
                        <p className="font-note text-lead text-ink-soft mt-1">
                          from the {category.title.toLowerCase()} pouch
                        </p>
                        <div className="border-ink/20 mt-5 border-t pt-4">
                          <p className="text-small tracking-(--tracking-caps) uppercase">
                            Used in
                          </p>
                          {used.length ? (
                            <ul className="mt-3 space-y-3">
                              {used.map((u) => (
                                <li key={u.href}>
                                  <Link
                                    href={u.href}
                                    transitionTypes={TURN_FORWARD}
                                    className="text-h4 decoration-ink/40 hover:text-blood hover:decoration-blood underline underline-offset-[0.2em]"
                                  >
                                    {u.name}
                                  </Link>
                                  <span className="text-small text-ink-soft block">
                                    {u.line}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-3">
                              No bounty on this board uses it yet.
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          popoverTarget={card}
                          popoverTargetAction="hide"
                          className="text-small decoration-ink/40 hover:text-blood mt-6 cursor-pointer underline underline-offset-[0.22em]"
                        >
                          Put it back
                        </button>
                      </div>
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
