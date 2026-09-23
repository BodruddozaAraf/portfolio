import { ArrowDown } from "@phosphor-icons/react/ssr";
import { preload } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content";

// 1. The Camp. Night, the fire low on the right, four text elements only (D29): name, role,
// one sentence, two CTAs. This is the static placeholder; Phase 3 replaces the art with the 3D
// camp and keeps the copy exactly as is.

const FIRE_MASK = "/sketches/campfire-mask.webp";

export function Hero() {
  // the silhouette is the largest thing in the first viewport: start its fetch in the <head>
  // CSS masks are fetched in CORS mode, so the preload must match or the image loads twice
  preload(FIRE_MASK, {
    as: "image",
    fetchPriority: "high",
    crossOrigin: "anonymous",
  });
  return (
    <section
      aria-label="Introduction"
      className="night from-night via-night-blue to-dusk relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-linear-to-b from-35%"
    >
      {/* Firelight: a warm pool on the ground where the fire burns */}
      <div
        aria-hidden
        className="absolute -right-[10%] -bottom-[20%] -z-10 aspect-square w-[90%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-ember)_55%,transparent),color-mix(in_srgb,var(--color-ember)_12%,transparent)_55%,transparent)] md:w-[60%]"
      />
      {/* The logs, as dark shapes against the glow. A CSS mask (a raster of the exported sketch) keeps the
          path data out of the HTML (inlined, it was the page's largest payload). */}
      <div
        aria-hidden
        className="bg-night absolute right-[-6%] bottom-[4%] -z-10 aspect-[680/316] w-[80%] [mask-image:url(/sketches/campfire-mask.webp)] [mask-size:contain] [mask-repeat:no-repeat] opacity-90 md:right-[2%] md:w-[46%]"
      />

      <div className="shell pt-28 pb-40 md:pt-24 md:pb-24">
        <div className="max-w-3xl">
          <h1 className="font-display text-h1 sm:text-display tracking-poster uppercase">
            {profile.name}
          </h1>
          <p className="text-h4 text-paper-light/90 mt-6">{profile.roleLine}</p>
          <p className="text-lead text-paper-light/80 mt-4 max-w-xl italic">
            {profile.heroLine}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#about" icon={<Icon icon={ArrowDown} />}>
              Open the journal
            </Button>
            <Button href="/plain" variant="outline">
              Plain mode
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
