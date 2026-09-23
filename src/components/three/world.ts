import type { Tier } from "@/lib/device-tier";

// Where things stand in the camp, in meters. The fire is the origin; the camera looks at it from
// the front left and a little above, and the land falls away behind it into a misty valley,
// ridge after ridge, to the mountains at dusk.

export type Vec3 = [number, number, number];

export const FIRE: Vec3 = [0, 0, 0];

/** The establishing shot. The rig frames the fire to the right of the hero copy. */
export const CAMERA = {
  position: [-1.2, 1.7, 7.6] as Vec3,
  // nearly level, so the sky gets the top half and the fire sits low in the frame
  target: [0.3, 1.38, 0] as Vec3,
  fov: 38,
};

/** The clearing's far edge: past it the hillside drops into the valley. */
export const GROUND_EDGE_Z = -14;

/**
 * The ridges behind the camp, near to far: distance, foot and crest height, roughness, and how
 * much extra haze they carry (each one paler than the one in front).
 */
export const RIDGES = [
  {
    z: -34,
    base: -9,
    crest: 0.6,
    relief: 3.2,
    scale: 0.05,
    seed: 11,
    haze: 0.16,
  },
  { z: -62, base: -14, crest: 3, relief: 6, scale: 0.03, seed: 23, haze: 0.34 },
  {
    z: -105,
    base: -20,
    crest: 8.5,
    relief: 11,
    scale: 0.02,
    seed: 37,
    haze: 0.5,
  },
  {
    z: -170,
    base: -30,
    crest: 15,
    relief: 22,
    scale: 0.012,
    seed: 51,
    haze: 0.62,
  },
] as const;

/** Per-tier budgets for the things that cost the most. */
export const DETAIL: Record<
  Exclude<Tier, "low">,
  { stars: number; pines: number; mist: number }
> = {
  high: { stars: 1800, pines: 260, mist: 3 },
  mid: { stars: 900, pines: 140, mist: 2 },
};
