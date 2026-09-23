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

export function useLenis() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
