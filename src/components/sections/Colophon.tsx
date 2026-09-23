import Link from "next/link";
import { microcopy, profile } from "@/content";

// 10. Colophon. Who made it, with what, and whose art it borrows (always credited, D45).

export function Colophon() {
  return (
    <footer className="leather">
      <div className="shell grid gap-10 py-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:py-20">
        <div>
          {microcopy.colophon.map((line) => (
            <p key={line} className="text-lead">
              {line}
            </p>
          ))}
          <p className="text-small text-paper-light/80 mt-6">
            Set in Rye, IM Fell English, Homemade Apple, Caveat and Special
            Elite. Built with Next.js, React and Tailwind CSS.
          </p>
        </div>
        <div className="text-small text-paper-light/80">
          <p>
            Engraving: <em>Camping Out in the Adirondack Mountains</em>, after
            Winslow Homer, Harper&apos;s Weekly, 1874. Smithsonian American Art
            Museum, public domain (CC0).
          </p>
          <p className="mt-4">
            <Link
              href="/plain"
              className="hover:text-ember-glow underline underline-offset-[0.22em]"
            >
              Plain mode
            </Link>
          </p>
          <p className="font-type mt-4">&copy; 2026 {profile.name}</p>
        </div>
      </div>
    </footer>
  );
}
