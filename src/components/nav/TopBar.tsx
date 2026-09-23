import Link from "next/link";
import { microcopy, profile } from "@/content";

// The camp's top bar: the B.A. monogram home, and the two routes a visitor needs at any moment.
// Over the night hero on the home page ("night"); elsewhere it takes the colors of the surface it
// sits on ("inherit"). The sound toggle and wheel
// button join it in Phase 4.

type TopBarProps = { surface?: "night" | "inherit" };

export function TopBar({ surface = "night" }: TopBarProps) {
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
      <nav
        aria-label="Primary"
        className="shell flex h-16 items-center justify-between md:h-20"
      >
        <Link
          href="/"
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
