"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { preload } from "react-dom";
import { getCamp, subscribeCamp } from "@/lib/camp";
import { useLenis } from "@/lib/lenis";
import { EASE } from "@/lib/motion";

// 0. Chapter I (docs/05-sections.md section 0). A title card over the night while the journal
// loads. It moves from the very first paint, before any script: the campfire sketch draws itself
// (an SVG image carrying its own CSS animation), a glow breathes under it, embers rise, and a fuse
// burns along under the title. Once the page's scripts arrive, the fuse follows the real loading
// (fonts, the page and its hero art, and the 3D camp for visitors who get it) and the card lifts
// when everything is ready and the sketch has finished, so the visitor never waits on a blank or
// half-built page (Araf, D74). It never stays longer than LOADER_MAX_MS: CSS fades it out on its
// own by then even if scripts fail. Any click, key, wheel or touch lifts it at once.
//
// The server always renders the card; CSS shows it only when the boot script set
// html[data-loader="show"] (first page of a session, on "/", not in Plain mode or under reduced
// motion). It is decorative, so assistive tech skips it.

const SKETCH = "/sketches/campfire-draw.svg";
/** The longest the card may stay; the CSS fallback in globals.css matches it. */
export const LOADER_MAX_MS = 9000;
/** The sketch's own animation: its pen stroke and wash finish by then. */
const SKETCH_MS = 2900;
const LIFT_S = 0.6;

type LoaderProps = { title: string; tips: string[] };

export function Loader({ title, tips }: LoaderProps) {
  preload(SKETCH, { as: "image", fetchPriority: "high" });
  const ref = useRef<HTMLDivElement>(null);
  const [showing, setShowing] = useState(false);
  const lenis = useLenis();

  // hold the page still while the card is up
  useEffect(() => {
    if (!lenis || !showing) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, showing]);

  useEffect(() => {
    const html = document.documentElement;
    const el = ref.current;
    const fuse = el?.querySelector<HTMLElement>(".loader-fuse");
    if (!el || !fuse || html.dataset.loader !== "show") return;
    setShowing(true);

    let lifted = false;
    const timers: number[] = [];
    const gsapReady = import("@/lib/gsap");
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const skip = () => lift(true);
    const removeListeners = () =>
      events.forEach((e) => window.removeEventListener(e, skip));

    // the fuse takes over from its CSS crawl where it has got to, and never burns backwards
    const from =
      parseFloat(getComputedStyle(fuse).getPropertyValue("--p")) || 0;
    fuse.classList.add("is-live");
    let shown = from;
    const done = { fonts: false, page: false };
    const campProgress = () => {
      const camp = getCamp();
      return camp.status === "loading" ? camp.progress : 1;
    };
    const update = () => {
      const parts = [done.fonts ? 1 : 0, done.page ? 1 : 0, campProgress()];
      const ready = parts.reduce((a, b) => a + b, 0) / parts.length;
      shown = Math.max(shown, from + (1 - from) * ready);
      fuse.style.setProperty("--p", String(shown));
      if (ready >= 1) finish();
    };

    const lift = (immediate = false) => {
      if (lifted) return;
      lifted = true;
      removeListeners();
      stopCamp();
      const hide = () => {
        html.dataset.loader = "done";
        setShowing(false);
      };
      if (immediate) return hide();
      gsapReady.then(({ gsap }) =>
        gsap.to(el, {
          autoAlpha: 0,
          duration: LIFT_S,
          ease: EASE,
          onComplete: hide,
        }),
      );
    };
    // ready: let the sketch finish its drawing first, then lift
    let finishing = false;
    const finish = () => {
      if (finishing) return;
      finishing = true;
      const wait = Math.max(0, SKETCH_MS - performance.now());
      timers.push(window.setTimeout(() => lift(), wait));
    };

    // the latest moment the card may start lifting, so it is gone by LOADER_MAX_MS
    const deadline = Math.max(
      0,
      LOADER_MAX_MS - LIFT_S * 1000 - performance.now(),
    );
    timers.push(window.setTimeout(() => lift(), deadline));

    const stopCamp = subscribeCamp(update);
    document.fonts.ready.then(() => {
      done.fonts = true;
      update();
    });
    const onLoad = () => {
      done.page = true;
      update();
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    update();

    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      timers.forEach(clearTimeout);
      removeListeners();
      stopCamp();
      window.removeEventListener("load", onLoad);
      lifted = true;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="loader night fixed inset-0 z-(--z-loader) place-items-center px-(--gutter)"
    >
      <div className="grid w-full justify-items-center gap-8">
        <div className="loader-sketch relative w-[min(24rem,78vw)]">
          <div className="loader-glow" />
          <div className="loader-embers">
            {EMBERS.map((style, i) => (
              <span key={i} style={style} />
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- an animated SVG: next/image would rasterize it */}
          <img
            src={SKETCH}
            alt=""
            width={680}
            height={316}
            fetchPriority="high"
            className="relative block aspect-[680/316] w-full opacity-85"
          />
        </div>
        <div className="grid justify-items-center gap-4">
          <p className="font-display text-h2 tracking-poster text-center uppercase">
            {title}
          </p>
          <div className="loader-fuse-track">
            <div className="loader-fuse" />
          </div>
        </div>
      </div>
      <ul className="absolute inset-x-0 bottom-10 px-(--gutter) text-center md:bottom-14">
        {tips.map((tip, i) => (
          <li
            key={tip}
            data-tip={i}
            className="loader-tip text-lead text-paper-light/75 mx-auto max-w-(--measure) italic"
          >
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

// embers off the drawn fire: start offset, drift, rise, duration, delay (fixed so SSR matches)
const EMBERS = [
  [-18, -26, 120, 2.6, 0.2],
  [4, 18, 150, 3.1, 0.9],
  [14, -10, 110, 2.4, 1.6],
  [-6, 30, 170, 3.4, 0.5],
  [22, 12, 130, 2.8, 2.1],
  [-26, -6, 140, 3.0, 1.2],
  [8, -32, 160, 3.6, 2.6],
].map(([x, drift, rise, t, delay]) => ({
  "--ember-x": `${x}px`,
  "--ember-drift": `${drift}px`,
  "--ember-rise": `${rise}px`,
  animationDuration: `${t}s`,
  animationDelay: `${delay}s`,
})) as CSSProperties[];
