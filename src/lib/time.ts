"use client";

// Slowed time, shared by the features that bend it: the weapon wheel slows the journal's ambient
// motion to 20% while it is open, Dead Eye to 25% (docs/05-sections.md, Global features). Each
// holder asks for a factor under its own key; the slowest one wins, and letting go restores
// the rest. It reaches every clock the journal runs on: GSAP's global timeline (if GSAP has
// loaded), CSS animations and transitions on the document timeline (scroll-driven ones follow
// the scroll, not time, and are left alone), and the 3D camp's clock. Scrolling is never slowed,
// nor anything inside `[data-realtime]` (the wheel's own motion).

const holders = new Map<string, number>();
let scale = 1;
const listeners = new Set<() => void>();

/** The current time scale, 1 when nothing is slowing the journal. */
export function timeScale() {
  return scale;
}

export function onTimeScale(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Slow time to `factor` under `key`, or pass null to let go. */
export function slowTime(key: string, factor: number | null) {
  if (factor === null) holders.delete(key);
  else holders.set(key, factor);
  const next = holders.size ? Math.min(...holders.values()) : 1;
  if (next === scale) return;
  scale = next;
  for (const a of document.getAnimations()) {
    // the controls doing the slowing keep real time (`data-realtime`)
    const target = (a.effect as KeyframeEffect | null)?.target;
    if (target?.closest("[data-realtime]")) continue;
    if (a.timeline === document.timeline) a.playbackRate = scale;
  }
  import("@/lib/gsap").then(({ gsap }) => gsap.globalTimeline.timeScale(scale));
  listeners.forEach((l) => l());
}
