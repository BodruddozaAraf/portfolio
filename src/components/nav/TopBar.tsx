import Link from "next/link";
import { microcopy, profile } from "@/content";
import { TURN_BACK } from "@/lib/page-turn";

// The camp's top bar: the B.A. monogram home, and the two routes a visitor needs at any moment.
// Over the night hero on the home page ("night"); elsewhere it takes the colors of the surface it
// sits on ("inherit"). It carries the page's skip link, the first thing a keyboard reaches: out
// of sight until focused (5.2).

type TopBarProps = {
  surface?: "night" | "inherit";
  /** Where the skip link goes: the page's main by default; the home page skips the hero. */
  skip?: { href: string; label: string };
};

const SKIP_TO_CONTENT = { href: "#content", label: "Skip to the page" };

export function TopBar({
  surface = "night",
  skip = SKIP_TO_CONTENT,
}: TopBarProps) {
  const initials = profile.name
    .split(" ")
    .map((part) => `${part[0]}.`)
    .join("");
  return (
    <header
      className={
        surface === "night"
          ? "night absolute inset-x-0 top-0 z-10 bg-transparent"
          : "relative z-10"
      }
    >
      <a
        href={skip.href}
        className="night text-small fixed top-3 left-3 z-50 -translate-y-24 px-4 py-2 focus:translate-y-0"
      >
        {skip.label}
      </a>
      <nav
        aria-label="Primary"
        className="shell flex h-16 items-center justify-between md:h-20"
      >
        <Link
          href="/"
          transitionTypes={TURN_BACK}
          className="font-display text-small tracking-poster ease-journal inline-grid size-11 place-items-center rounded-full border border-current/60 transition-colors duration-(--dur-hover) hover:border-(--surface-accent) hover:text-(--surface-accent)"
        >
          <span aria-hidden>{initials}</span>
          <span className="sr-only">{profile.name}, home</span>
        </Link>
        <ul className="text-small flex items-center gap-6 tracking-(--tracking-caps) uppercase">
          <li>
            <Link
              href="/plain"
              className="ease-journal underline-offset-[0.3em] transition-colors duration-(--dur-hover) hover:text-(--surface-accent) hover:underline"
            >
              Plain mode
            </Link>
          </li>
          <li>
            <Link
              href="/#send-word"
              transitionTypes={TURN_BACK}
              className="ease-journal underline-offset-[0.3em] transition-colors duration-(--dur-hover) hover:text-(--surface-accent) hover:underline"
            >
              {microcopy.telegram.cta}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
