"use client";

import { useEffect, useRef, useState } from "react";
import { EASE, dur } from "@/lib/motion";
import { useLenis } from "@/lib/lenis";

// 0. Chapter I (docs/05-sections.md section 0). A title card over the night while the page
// settles: the campfire sketch draws itself in graphite, then the card lifts off the camp.
//
// The server always renders the card; CSS shows it only when the boot script set
// html[data-loader="show"] (first page of a session, on "/", not in Plain mode or under reduced
// motion). It lifts once the sketch is drawn and the fonts and page have loaded, and never later
// than 3.5s after navigation. Any click, key, wheel or touch lifts it at once. CSS fades it out
// from 3s regardless, so the cap holds even when scripts arrive late or fail. It is decorative,
// so assistive tech skips it.

const SKETCH = "/sketches/campfire.svg";
const MAX_MS = 3500;
const LIFT_S = 0.5;

type LoaderProps = { title: string; tips: string[] };

export function Loader({ title, tips }: LoaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [sketch, setSketch] = useState<string | null>(null);
  const [showing, setShowing] = useState(false);
  const onDrawn = useRef<() => void>(() => {});
  const lenis = useLenis();

  // draw the sketch once its path is on the page: graphite strokes, then a faint wash of tone
  // (a full fill reads as a photographic negative on the night)
  useEffect(() => {
    const el = ref.current;
    if (!el || !sketch) return;
    let kill = () => {};
    import("@/lib/gsap").then(({ gsap }) => {
      const tl = gsap
        .timeline({ onComplete: () => onDrawn.current() })
        .fromTo(
          el.querySelector(".loader-stroke"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: dur.draw, ease: "power1.inOut" },
        )
        .to(
          el.querySelector(".loader-fill"),
          { fillOpacity: 0.18, duration: 0.4, ease: EASE },
          "-=0.3",
        );
      kill = () => tl.kill();
    });
    return () => kill();
  }, [sketch]);

  // hold the page still while the card is up
  useEffect(() => {
    if (!lenis || !showing) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, showing]);

  useEffect(() => {
    const html = document.documentElement;
    const el = ref.current;
    if (!el || html.dataset.loader !== "show") return;
    setShowing(true);

    let lifted = false;
    const timers: number[] = [];
    const gsapReady = import("@/lib/gsap");

    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const skip = () => lift(true);
    const removeListeners = () =>
      events.forEach((e) => window.removeEventListener(e, skip));

    const lift = (immediate = false) => {
      if (lifted) return;
      lifted = true;
      removeListeners();
      const done = () => {
        html.dataset.loader = "done";
        setShowing(false);
      };
      if (immediate) return done();
      gsapReady.then(({ gsap }) =>
        gsap.to(el, {
          autoAlpha: 0,
          duration: LIFT_S,
          ease: EASE,
          onComplete: done,
        }),
      );
    };

    // the latest moment the card may start lifting, so it is gone by MAX_MS
    const deadline = Math.max(0, MAX_MS - LIFT_S * 1000 - performance.now());
    timers.push(window.setTimeout(() => lift(), deadline));

    const pageReady = Promise.all([
      document.fonts.ready,
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((r) =>
            window.addEventListener("load", r, { once: true }),
          ),
    ]);

    let drawn: Promise<void> = Promise.resolve();
    fetch(SKETCH)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((svg) => {
        const d = svg.match(/ d="([^"]+)"/)?.[1];
        if (!d || lifted) return;
        drawn = new Promise<void>((resolve) => (onDrawn.current = resolve));
        setSketch(d);
        return drawn;
      })
      .catch(() => {})
      .finally(() => pageReady.then(() => drawn).then(() => lift()));

    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));

    return () => {
      timers.forEach(clearTimeout);
      removeListeners();
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
        <svg
          viewBox="0 0 680 316"
          className="text-paper-light/85 aspect-[680/316] w-[min(24rem,78vw)]"
        >
          {sketch ? (
            <>
              <path
                className="loader-fill"
                d={sketch}
                fill="currentColor"
                fillOpacity={0}
              />
              <path
                className="loader-stroke"
                d={sketch}
                pathLength={1}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.7}
                strokeDasharray={1}
                strokeDashoffset={1}
              />
            </>
          ) : null}
        </svg>
        <p className="font-display text-h2 tracking-poster text-center uppercase">
          {title}
        </p>
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
