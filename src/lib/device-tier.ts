// Device tiers (docs/04-architecture.md): what this device gets in the hero.
//   high  full 3D camp, postprocessing, all particles
//   mid   3D without postprocessing, fewer particles, pixel ratio capped at 1.5
//   low   the static hero image with CSS layers, no WebGL (phones land here too)
// Decided once per visit from the core count, memory, screen, pointer and a quick look at the
// GPU. It is a first guess: the camp's performance monitor can still step down while it runs.
// `?tier=high|mid|low` overrides the guess (for testing on machines the heuristic gets wrong).

export type Tier = "high" | "mid" | "low";

const TIERS: readonly Tier[] = ["high", "mid", "low"];

// software rasterizers and remote-desktop adapters: WebGL works, but far too slowly
const SOFTWARE =
  /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i;
// integrated GPUs that handle the scene without the postprocessing
const INTEGRATED = /intel|uhd|iris|hd graphics|mali|adreno|powervr|videocore/i;

function gpuRenderer(): string | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", {
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) return null;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      info
        ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return renderer;
  } catch {
    return null;
  }
}

/** The `?tier=` override, if the URL carries a valid one. */
export function tierOverride(): Tier | null {
  try {
    const value = new URLSearchParams(location.search).get("tier");
    return TIERS.includes(value as Tier) ? (value as Tier) : null;
  } catch {
    return null;
  }
}

let cached: Tier | null = null;

/** This device's tier. Client only; the answer is cached for the visit. */
export function detectTier(): Tier {
  if (cached) return cached;
  cached = tierOverride() ?? guess();
  return cached;
}

function guess(): Tier {
  // phones: touch first and a narrow screen
  const coarse = matchMedia("(pointer: coarse)").matches;
  if (coarse && Math.min(screen.width, screen.height) < 600) return "low";

  const cores = navigator.hardwareConcurrency || 4;
  // Chromium only; elsewhere assume enough
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (cores < 4 || memory < 4) return "low";

  const renderer = gpuRenderer();
  if (!renderer || SOFTWARE.test(renderer)) return "low";
  if (INTEGRATED.test(renderer) || coarse) return "mid";
  return cores >= 8 && memory >= 8 ? "high" : "mid";
}
