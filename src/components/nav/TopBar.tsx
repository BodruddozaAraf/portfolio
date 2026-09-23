import Link from "next/link";
import { microcopy, profile } from "@/content";

// The camp's top bar: the B.A. monogram home, and the two routes a visitor needs at any moment.
// Sits over the night hero; the sound toggle and wheel button join it in Phase 4.

export function TopBar() {
  const initials = profile.name
    .split(" ")
    .map((part) => `${part[0]}.`)
    .join("");
  return (
    <header className="night absolute inset-x-0 top-0 z-10 bg-transparent">
      <nav
        aria-label="Primary"
        className="shell flex h-16 items-center justify-between md:h-20"
      >
        <Link
          href="/"
          className="border-paper-light/60 font-display text-small tracking-poster ease-journal hover:border-ember hover:text-ember-glow inline-grid size-11 place-items-center rounded-full border transition-colors duration-(--dur-hover)"
        >
          <span aria-hidden>{initials}</span>
          <span className="sr-only">{profile.name}, home</span>
        </Link>
        <ul className="text-small flex items-center gap-6 tracking-(--tracking-caps) uppercase">
          <li>
            <Link
              href="/plain"
              className="ease-journal hover:text-ember-glow underline-offset-[0.3em] transition-colors duration-(--dur-hover) hover:underline"
            >
              Plain mode
            </Link>
          </li>
          <li>
            <a
              href="#send-word"
              className="ease-journal hover:text-ember-glow underline-offset-[0.3em] transition-colors duration-(--dur-hover) hover:underline"
            >
              {microcopy.telegram.cta}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
