"use client";

import { useSyncExternalStore } from "react";
import { usePreferences } from "@/lib/preferences";

// The Plain mode switch: when on, the whole journal drops its effects (grain and tilts now;
// smooth scroll and 3D once those phases land). The choice is remembered.

const noop = () => () => {};

export function PlainModeSwitch({ className = "" }: { className?: string }) {
  const plainMode = usePreferences((s) => s.plainMode);
  const setPlainMode = usePreferences((s) => s.setPlainMode);
  // the stored value is only known on the client; the server and first paint render "off"
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const on = hydrated && plainMode;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setPlainMode(!on)}
      className={`group inline-flex items-center gap-3 text-left ${className}`}
    >
      <span
        aria-hidden
        className={`relative inline-block h-6 w-11 shrink-0 border border-current transition-colors duration-(--dur-hover) ${
          on ? "bg-ink" : "bg-transparent"
        }`}
      >
        <span
          className={`ease-journal absolute top-0.5 left-0.5 size-4 transition-[translate,background-color] duration-(--dur-hover) ${
            on ? "bg-paper-light translate-x-5" : "bg-ink"
          }`}
        />
      </span>
      <span>Keep the whole journal plain</span>
    </button>
  );
}
