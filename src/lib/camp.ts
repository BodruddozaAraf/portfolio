"use client";

import { useSyncExternalStore } from "react";
import type { Tier } from "./device-tier";

// The 3D camp's state, shared with code that must not import three.js (the loader, the hero).
//   status    "off"      no WebGL for this visit (low tier, phones, reduced motion, Plain mode)
//             "loading"  the 3D chunk is on its way or the scene is compiling
//             "ready"    the first frames are drawn; the canvas fades in over the static hero
//   progress  0 to 1 while loading (chunk requested, chunk loaded, scene built, first frames)
//   tier      the running tier; the performance monitor may lower it
// The status is mirrored on <html data-camp> so CSS can follow it too.

export type CampStatus = "off" | "loading" | "ready";
export type CampState = { status: CampStatus; progress: number; tier: Tier };

let state: CampState = { status: "off", progress: 0, tier: "low" };
const listeners = new Set<() => void>();

export function setCamp(next: Partial<CampState>) {
  state = { ...state, ...next };
  if (typeof document !== "undefined")
    document.documentElement.dataset.camp = state.status;
  listeners.forEach((l) => l());
}

/** The state right now, for callbacks that should not re-render. */
export function getCamp() {
  return state;
}

export function subscribeCamp(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const serverState: CampState = { status: "off", progress: 0, tier: "low" };

export function useCamp() {
  return useSyncExternalStore(subscribeCamp, getCamp, () => serverState);
}
