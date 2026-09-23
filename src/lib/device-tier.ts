// Device tiers (docs/04-architecture.md): what this device gets in the hero.
//   high  full 3D camp, postprocessing, all particles
//   mid   3D without postprocessing, fewer particles, pixel ratio capped at 1.5
//   low   the static hero image with CSS layers, no WebGL
// Decided once per visit from the core count, memory, screen, pointer and a quick look at the
// GPU. It is a first guess: the camp's performance monitor can still step down while it runs.
// Phones with a capable GPU (every iPhone, recent Adreno, Mali-G7x, Xclipse and Immortalis) run
// the mid tier; other phones get the picture (D79).
// `?tier=high|mid|low` overrides the guess (for testing on machines the heuristic gets wrong).

export type Tier = "high" | "mid" | "low";

const TIERS: readonly Tier[] = ["high", "mid", "low"];

// software rasterizers and remote-desktop adapters: WebGL works, but far too slowly
const SOFTWARE =
  /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i;
// integrated GPUs that handle the scene without the postprocessing
const INTEGRATED = /intel|uhd|iris|hd graphics|mali|adreno|powervr|videocore/i;
// phone GPUs that hold the camp at the mid tier: Safari names every iPhone GPU "Apple GPU";
// Adreno 640 and up, Mali-G71 and up (G7x, G6x9, G7xx, G9xx), Samsung Xclipse, Arm Immortalis
const CAPABLE_PHONE =
  /apple gpu|apple a1\d|adreno[^0-9]*(6[4-9]\d|[7-9]\d\d)|mali-g(7[1-9]|[6-9]\d\d|6[89])|xclipse|immortalis/i;

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
  const coarse = matchMedia("(pointer: coarse)").matches;
  return tierFor({
    coarse,
    // phones: touch first and a narrow screen
    phone: coarse && Math.min(screen.width, screen.height) < 600,
    cores: navigator.hardwareConcurrency || 4,
    // Chromium only; elsewhere assume enough
    memory:
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8,
    renderer: gpuRenderer(),
  });
}

/** The tier for a device's traits (pure, so npm test can check it against real GPU names). */
export function tierFor(d: {
  coarse: boolean;
  phone: boolean;
  cores: number;
  memory: number;
  renderer: string | null;
}): Tier {
  if (!d.renderer || SOFTWARE.test(d.renderer)) return "low";
  // phones: the GPU decides (Safari may report few cores even on a fast iPhone)
  if (d.phone)
    return CAPABLE_PHONE.test(d.renderer) && d.memory >= 4 ? "mid" : "low";
  if (d.cores < 4 || d.memory < 4) return "low";
  if (INTEGRATED.test(d.renderer) || d.coarse) return "mid";
  return d.cores >= 8 && d.memory >= 8 ? "high" : "mid";
}
