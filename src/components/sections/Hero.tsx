import { ArrowDown } from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { CampStage } from "@/components/three/CampStage";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content";
import { seeded } from "@/lib/seed";
import art from "./hero-art.json";

// 1. The Camp. Night, the fire low on the right, four text elements only (D29): name, role,
// one sentence, two CTAs. The art is the camp itself, exported from the 3D scene
// (scripts/hero/render.mjs, A07) as a far and a near layer per orientation, each placed so the
// fire lands on the same point of the section at any size; a CSS glow and a few embers burn on
// it, and the far layer drifts as the page scrolls (CSS only). This is the finished picture for
// every visitor; on WebGL tiers the 3D camp (CampStage) fades in over it, behind the copy, which
// never changes.

type Orientation = keyof typeof art;
const MEDIA: Record<Orientation, string> = {
  landscape: "(orientation: landscape)",
  portrait: "(orientation: portrait)",
};

export function Hero() {
  // the picture is the first viewport: start the right orientation's layers in the <head>
  for (const orientation of Object.keys(MEDIA) as Orientation[]) {
    for (const layer of ["far", "near"]) {
      preload(`/hero/${layer}-${orientation}.avif`, {
        as: "image",
        type: "image/avif",
        media: MEDIA[orientation],
        fetchPriority: "high",
      });
    }
  }
  const fire = {
    "--fire-lx": art.landscape.fire.x,
    "--fire-ly": art.landscape.fire.y,
    "--fire-px": art.portrait.fire.x,
    "--fire-py": art.portrait.fire.y,
  } as CSSProperties;
  return (
    <section
      aria-label="Introduction"
      className="night relative isolate flex min-h-[100dvh] items-center overflow-hidden"
    >
      <div aria-hidden className="hero-art absolute inset-0 -z-10" style={fire}>
        <div className="hero-layer hero-far" />
        <div className="hero-layer hero-near" />
        <div className="hero-glow" />
        <div className="hero-embers">
          {EMBERS.map((e, i) => (
            <span key={i} style={e as CSSProperties} />
          ))}
        </div>
      </div>
      <CampStage />

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

// a handful of embers rising off the fire: where each starts, how far it drifts, how long it takes
const between = (seed: string, a: number, b: number) =>
  a + seeded(seed) * (b - a);
const EMBERS = Array.from({ length: 9 }, (_, i) => ({
  "--ember-x": `${between(`ember-x-${i}`, -22, 22).toFixed(1)}px`,
  "--ember-drift": `${between(`ember-d-${i}`, -40, 40).toFixed(1)}px`,
  "--ember-rise": `${between(`ember-r-${i}`, 110, 220).toFixed(0)}px`,
  animationDuration: `${between(`ember-t-${i}`, 2.2, 4.2).toFixed(2)}s`,
  animationDelay: `${(-i * 0.47).toFixed(2)}s`,
}));
