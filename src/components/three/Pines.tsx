"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { groundHeight, ridgeHeight } from "./land";
import { campMaterial, tone } from "./materials";
import { noise2, rng } from "./noise";
import { GROUND_EDGE_Z, RIDGES } from "./world";

// Pines as low-poly silhouettes in two kinds (a narrow spruce, a broader pine), instanced: four
// draws for the whole forest. They crowd the hill shoulders around the clearing, line the brow of the hill and
// the first ridge, and never stand between the camera and the fire.

function merge(parts: BufferGeometry[]) {
  const geos = parts.map((p) => (p.index ? p.toNonIndexed() : p));
  const count = geos.reduce((n, g) => n + g.attributes.position.count, 0);
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  let o = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array as Float32Array, o * 3);
    nor.set(g.attributes.normal.array as Float32Array, o * 3);
    uv.set(g.attributes.uv.array as Float32Array, o * 2);
    o += g.attributes.position.count;
  }
  const out = new BufferGeometry();
  out.setAttribute("position", new BufferAttribute(pos, 3));
  out.setAttribute("normal", new BufferAttribute(nor, 3));
  out.setAttribute("uv", new BufferAttribute(uv, 2));
  return out;
}

/**
 * A conifer: a trunk and `tiers` stacked cones, narrowing to the top, each tier jittered a little
 * (seeded) so the outline is ragged rather than a clean triangle.
 */
function conifer({
  tiers,
  width,
  height,
  seed,
}: {
  tiers: number;
  width: number;
  height: number;
  seed: number;
}) {
  const rand = rng(seed);
  const trunk = new CylinderGeometry(0.05, 0.09, 0.8, 5);
  trunk.translate(0, 0.4, 0);
  const parts: BufferGeometry[] = [trunk];
  const start = 0.55;
  for (let i = 0; i < tiers; i++) {
    const t = i / (tiers - 1);
    const r = width * (1 - t * 0.82) * (0.88 + rand() * 0.24);
    const h = (height / tiers) * (1.9 - t * 0.5);
    const cone = new ConeGeometry(r, h, 7, 1, true);
    cone.rotateY(rand() * Math.PI);
    cone.translate(
      (rand() - 0.5) * 0.08,
      start + t * (height - start - h * 0.5) + h / 2,
      0,
    );
    parts.push(cone);
  }
  return merge(parts);
}

const KINDS = [
  { tiers: 6, width: 0.8, height: 4.4, seed: 3 }, // a narrow spruce
  { tiers: 4, width: 1.05, height: 3.6, seed: 8 }, // a broader pine
];

type Spot = { x: number; y: number; z: number; s: number };

/** Where the trees stand: `hill` on the camp's hillside, `ridge` along the first ridge. */
function forest(count: number) {
  const rand = rng(97);
  const hill: Spot[] = [];
  const ridge: Spot[] = [];
  // the clearing, and the open ground from the camp to the brow, so the valley shows past the fire
  const open = (x: number, z: number) =>
    Math.hypot(x, z) < 7 || (x > -9 && x < 13 && z > GROUND_EDGE_Z + 1);

  const stands = Math.round(count * 0.3);
  const brow = Math.round(count * 0.2);

  // stands on the hill shoulders either side of the clearing, set back from the camera
  for (let tries = 0; hill.length < stands && tries < stands * 40; tries++) {
    const left = rand() < 0.6;
    const x = left ? -8 - rand() * 30 : 11 + rand() * 26;
    const z = -2 - rand() * (-2 - GROUND_EDGE_Z);
    if (open(x, z)) continue;
    hill.push({ x, y: groundHeight(x, z) - 0.1, z, s: 0.75 + rand() * 0.75 });
  }
  // small clusters along the brow of the hill, silhouetted against the valley mist
  for (let i = 0, placed = 0; placed < brow && i < brow * 40; i++) {
    const cx = (rand() - 0.5) * 80;
    if (Math.abs(cx - 2) < 8) continue; // keep the view behind the fire clear
    for (
      let k = 0;
      k < 2 + Math.floor(rand() * 3) && placed < brow;
      k++, placed++
    ) {
      const x = cx + (rand() - 0.5) * 3;
      const z = GROUND_EDGE_Z + 1 + rand() * 2.5;
      hill.push({ x, y: groundHeight(x, z) - 0.25, z, s: 0.5 + rand() * 0.8 });
    }
  }
  // in clumps along the first ridge's crest, only their tops showing over it
  const r = RIDGES[0];
  const onRidge = count - hill.length;
  for (let tries = 0; ridge.length < onRidge && tries < onRidge * 40; tries++) {
    const x = (rand() - 0.5) * Math.abs(r.z) * 2.6;
    if (noise2(x * 0.16, 3.7, 5) < 0.45) continue;
    const s = 0.5 + Math.pow(rand(), 2.2) * 1.7;
    const back = rand() * 6;
    ridge.push({
      x,
      y: ridgeHeight(0, x) - 0.5 - back * 0.5,
      z: r.z - 1 - back,
      s,
    });
  }
  return { hill, ridge };
}

function Stand({
  spots,
  seed,
  haze,
  geometry,
}: {
  spots: Spot[];
  seed: number;
  haze: number;
  geometry: BufferGeometry;
}) {
  const ref = useRef<InstancedMesh>(null);
  const material = useMemo(
    () =>
      campMaterial(tone("night", { mix: "sage", amount: 0.22, scale: 1.15 }), {
        haze,
      }),
    [haze],
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const rand = rng(seed);
    const m = new Matrix4();
    const q = new Quaternion();
    const up = new Vector3(0, 1, 0);
    const c = new Color();
    spots.forEach((p, i) => {
      q.setFromAxisAngle(up, rand() * Math.PI * 2);
      const w = p.s * (0.8 + rand() * 0.35);
      m.compose(new Vector3(p.x, p.y, p.z), q, new Vector3(w, p.s, w));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.setScalar(0.8 + rand() * 0.35));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [spots, seed]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, spots.length]}
      frustumCulled={false}
    />
  );
}

export function Pines({
  count,
  hill: showHill = true,
  ridge: showRidge = true,
}: {
  count: number;
  hill?: boolean;
  ridge?: boolean;
}) {
  const geometries = useMemo(() => KINDS.map(conifer), []);
  const { hill, ridge } = useMemo(() => forest(count), [count]);
  // alternate the two kinds through each stand
  const split = (spots: Spot[]) =>
    KINDS.map((_, k) => spots.filter((_, i) => i % KINDS.length === k));
  const hillKinds = useMemo(() => split(hill), [hill]);
  const ridgeKinds = useMemo(() => split(ridge), [ridge]);
  return (
    <group>
      {geometries.map((g, k) => (
        <group key={k}>
          {showHill ? (
            <Stand spots={hillKinds[k]} seed={211 + k} haze={0} geometry={g} />
          ) : null}
          {/* hazed like the ridge they stand on */}
          {showRidge ? (
            <Stand
              spots={ridgeKinds[k]}
              seed={307 + k}
              haze={RIDGES[0].haze}
              geometry={g}
            />
          ) : null}
        </group>
      ))}
    </group>
  );
}
