import type { Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { Poster } from "@/components/journal/Poster";
import { Stamp } from "@/components/journal/Stamp";
import { TopBar } from "@/components/nav/TopBar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { microcopy } from "@/content";

// The 404 (docs/04-architecture.md, Routes): "off the map". A torn-off notice on the board with
// the way back to camp.

export const metadata: Metadata = {
  title: "Off the map",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="wood flex min-h-[100dvh] flex-col">
      <TopBar surface="inherit" />
      <main
        id="content"
        className="shell grid flex-1 place-items-center pt-6 pb-20 md:pb-28"
      >
        <Poster
          seed="off-the-map"
          className="text-ink w-full max-w-lg text-center"
        >
          <h1 className="font-display text-h1 tracking-poster uppercase">
            Off the Map
          </h1>
          <p className="text-lead mt-4 italic">{microcopy.notFound}</p>
          {/* the campfire sketch as a mask tinted with the ink, not inline paths: the 404 rides in
              every page's payload, so its 28 KB of path data would too (step 5.1) */}
          <div
            aria-hidden
            className="text-ink-soft mx-auto mt-8 aspect-[680/316] w-4/5 bg-current mask-[url(/sketches/campfire.svg)] mask-contain mask-center mask-no-repeat"
          />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" icon={<Icon icon={ArrowLeft} />}>
              Back to camp
            </Button>
            <Button href="/plain" variant="outline">
              Plain mode
            </Button>
          </div>
          <div className="mt-8">
            <Stamp seed="not-found" size="sm">
              Error 404
            </Stamp>
          </div>
        </Poster>
      </main>
    </div>
  );
}
