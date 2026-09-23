"use client";

import type Lenis from "lenis";
import { useSyncExternalStore } from "react";

// The live Lenis instance, or null when smooth scroll is off (reduced motion, Plain mode, /plain).
// Set only by SmoothScroll; read with useLenis() to stop, start or drive the scroll.

let current: Lenis | null = null;
const listeners = new Set<() => void>();

export function setLenis(lenis: Lenis | null) {
  current = lenis;
  listeners.forEach((l) => l());
}

/** The instance right now, for event handlers that should not re-render on change. */
export function getLenis() {
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Takes the reader to a section the way a same-page link does: a glide with smooth scroll on
 * (Lenis), a jump without it, then focus on the section so keyboard and screen reader users
 * land there too.
 */
export function glideTo(target: HTMLElement) {
  const focus = () => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  if (current) current.scrollTo(target, { onComplete: focus });
  else {
    target.scrollIntoView();
    focus();
  }
}

export function useLenis() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
