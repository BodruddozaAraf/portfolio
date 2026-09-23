// Capture mode, for exporting the static hero (A07) from the scene itself (scripts/hero/render.mjs):
// `?capture=far` draws the sky, the ridges and the valley mist; `?capture=near` draws the hillside,
// its trees, the camp and the fire on a transparent ground. The clock is frozen at a good moment of
// the flicker, and the canvas keeps its pixels so the script can read them.

export type CaptureLayer = "far" | "near";

export const capture: CaptureLayer | null = (() => {
  if (typeof location === "undefined") return null;
  const value = new URLSearchParams(location.search).get("capture");
  return value === "far" || value === "near" ? value : null;
})();

/** The clock time every capture is taken at, in seconds. */
export const CAPTURE_TIME = 2.35;
