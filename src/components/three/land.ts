import { fbm } from "./noise";
import { GROUND_EDGE_Z, RIDGES } from "./world";

// The shape of the land, shared by the terrain meshes and whatever stands on them (trees, props).

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Ground height of the hillside the camp sits on, at (x, z). */
export function groundHeight(x: number, z: number) {
  const r = Math.hypot(x, z);
  // the clearing around the fire stays flat; the land gets rougher away from it
  const rough = smooth(3.5, 12, r);
  let y = (fbm(x * 0.09, z * 0.09, 4, 7) - 0.5) * 2.4 * rough;
  // a shoulder of the hill rising behind the camp on the left, the side the copy sits on
  y += smooth(2, -26, x) * smooth(4, -14, z) * 5.5;
  // the ground rises gently toward the back right too, then rolls off at the brow
  y += smooth(6, 24, x) * smooth(0, -12, z) * 1.6;
  // the brow: it rolls off into the valley, higher here and lower there
  y -= smooth(GROUND_EDGE_Z + 6, GROUND_EDGE_Z, z) * 4;
  y += (fbm(x * 0.05, 9.1, 3, 13) - 0.5) * 3.2 * smooth(-3, GROUND_EDGE_Z, z);
  return y;
}

/** Height of ridge `i`'s crest at x. */
export function ridgeHeight(i: number, x: number) {
  const r = RIDGES[i];
  const n = fbm(x * r.scale, i * 3.1, 5, r.seed);
  // sharpen the far ranges into peaks
  const peaks = i >= 2 ? Math.pow(n, 1.6) * 1.5 : n;
  return r.crest + (peaks - 0.5) * 2 * r.relief;
}
