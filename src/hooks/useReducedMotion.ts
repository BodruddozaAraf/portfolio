"use client";

import { useSyncExternalStore } from "react";
import { usePreferences } from "@/lib/preferences";
import type { MotionLevel } from "@/lib/motion";

// How much the journal may move for this visitor. The server and the hydration pass render "none",
// so nothing animates until the client knows the real answer.

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** True when the visitor asks the system for reduced motion. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}

const noop = () => () => {};

/** "full", "reduced" (prefers-reduced-motion) or "none" (Plain mode, D52). */
export function useMotionLevel(): MotionLevel {
  const reduced = useReducedMotion();
  const plainMode = usePreferences((s) => s.plainMode);
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  if (!hydrated || plainMode) return "none";
  return reduced ? "reduced" : "full";
}
