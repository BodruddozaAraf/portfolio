"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ExtrudeGeometry,
  Line,
  LineBasicMaterial,
  Shape,
  Vector2,
  Vector3,
  type Group,
} from "three";
import { camp, campMaterial, tone } from "./materials";
import { palette } from "./palette";
import { onGround, POST_TOP } from "./Props";
import { HORSE } from "./world";

// The tethered horse (spec 05 section 1: "a dark silhouette, low-poly"). Seen side-on from the
// camp, so it is built from side profiles: each part is an outline extruded to its thickness with
// rounded edges (body, neck and head, the four legs in near and far pairs, the tail). The head and
// the tail hang on their own pivots so the horse can live a little: it breathes, swishes its tail,
// and now and then lowers its head to graze, the rope from the post following its halter.
// Coordinates are meters with the horse facing -x, hooves at y = 0, withers about 1.55 m.

type P = [number, number];

const BODY: P[] = [
  [-0.5, 1.5],
  [-0.3, 1.56],
  [-0.05, 1.49],
  [0.25, 1.48],
  [0.52, 1.55],
  [0.75, 1.5],
  [0.88, 1.38],
  [0.9, 1.2],
  [0.84, 1.04],
  [0.7, 0.92],
  [0.5, 0.9],
  [0.3, 0.86],
  [0, 0.83],
  [-0.3, 0.86],
  [-0.52, 0.93],
  [-0.7, 1.05],
  [-0.78, 1.22],
  [-0.72, 1.38],
];

const NECK_PIVOT: P = [-0.6, 1.38];
const NECK: P[] = [
  [-0.5, 1.5],
  [-0.62, 1.68],
  [-0.8, 1.88],
  [-0.98, 2.02],
  [-1.06, 2.06],
  [-1.12, 2.03],
  [-1.24, 1.88],
  [-1.36, 1.7],
  [-1.42, 1.6],
  [-1.4, 1.53],
  [-1.33, 1.51],
  [-1.2, 1.6],
  [-1.08, 1.7],
  [-1.0, 1.74],
  [-0.9, 1.62],
  [-0.8, 1.48],
  [-0.74, 1.36],
  [-0.55, 1.3],
];
const EAR: P[] = [
  [-1.0, 2.03],
  [-1.05, 2.19],
  [-0.96, 2.05],
];
/** where the halter ring sits, for the rope */
const HALTER: P = [-1.2, 1.64];

const FORE_LEG: P[] = [
  [-0.68, 1.05],
  [-0.66, 0.8],
  [-0.63, 0.56],
  [-0.63, 0.5],
  [-0.63, 0.2],
  [-0.62, 0.12],
  [-0.64, 0.04],
  [-0.66, 0],
  [-0.54, 0],
  [-0.555, 0.08],
  [-0.57, 0.14],
  [-0.575, 0.48],
  [-0.57, 0.56],
  [-0.55, 0.8],
  [-0.5, 1.0],
];
const HIND_LEG: P[] = [
  [0.52, 1.02],
  [0.48, 0.8],
  [0.58, 0.62],
  [0.64, 0.5],
  [0.635, 0.2],
  [0.64, 0.12],
  [0.62, 0.04],
  [0.6, 0],
  [0.72, 0],
  [0.715, 0.08],
  [0.705, 0.14],
  [0.715, 0.48],
  [0.74, 0.56],
  [0.78, 0.72],
  [0.84, 0.95],
  [0.8, 1.1],
];

const TAIL_PIVOT: P = [0.86, 1.44];
const TAIL: P[] = [
  [0.84, 1.48],
  [0.93, 1.4],
  [0.99, 1.22],
  [1.01, 1.0],
  [0.99, 0.78],
  [0.95, 0.6],
  [0.9, 0.56],
  [0.9, 0.7],
  [0.91, 0.95],
  [0.89, 1.2],
  [0.83, 1.36],
];

/** An outline as a smooth closed shape, shifted so `origin` is at 0,0 (a part's pivot). */
function outline(points: P[], origin: P = [0, 0], smooth = true) {
  const v = points.map(([x, y]) => new Vector2(x - origin[0], y - origin[1]));
  const shape = new Shape();
  shape.moveTo(v[0].x, v[0].y);
  if (smooth) shape.splineThru([...v.slice(1), v[0]]);
  else v.slice(1).forEach((p) => shape.lineTo(p.x, p.y));
  shape.closePath();
  return shape;
}

function slab(shape: Shape, depth: number, bevel: number) {
  const g = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.7,
    bevelSegments: 2,
    curveSegments: 10,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

export function Horse() {
  const neck = useRef<Group>(null);
  const tail = useRef<Group>(null);
  const body = useRef<Group>(null);
  const halter = useMemo(() => new Vector3(), []);
  const ropeRef = useRef<Line>(null);

  const coat = useMemo(
    () => campMaterial(tone("night", { mix: "leather", amount: 0.5 })),
    [],
  );
  const parts = useMemo(
    () => ({
      body: slab(outline(BODY), 0.36, 0.1),
      neck: slab(outline(NECK, NECK_PIVOT), 0.18, 0.05),
      ear: slab(outline(EAR, NECK_PIVOT, false), 0.03, 0.01),
      fore: slab(outline(FORE_LEG, [0, 0], false), 0.08, 0.025),
      hind: slab(outline(HIND_LEG, [0, 0], false), 0.1, 0.03),
      tail: slab(outline(TAIL, TAIL_PIVOT), 0.07, 0.025),
    }),
    [],
  );

  const rope = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(16 * 3), 3),
    );
    const line = new Line(
      g,
      new LineBasicMaterial({
        color: new Color(palette.leather).multiplyScalar(0.55),
      }),
    );
    line.frustumCulled = false;
    return line;
  }, []);

  useFrame(() => {
    const t = camp.uTime.value;
    // grazing: every 17s the head goes down for a few seconds, eased, with a small nod otherwise
    const cycle = (t + 6) % 17;
    const down = smoothPulse(cycle, 9, 10.6, 14.5, 16);
    if (neck.current) {
      neck.current.rotation.z =
        down * 0.95 + Math.sin(t * 0.9) * 0.025 * (1 - down);
    }
    // the tail: a lazy sway and, now and then, a flick
    if (tail.current) {
      const flick = Math.max(0, Math.sin(t * 0.45)) ** 12;
      tail.current.rotation.y =
        Math.sin(t * 0.7) * 0.18 + Math.sin(t * 9) * 0.35 * flick;
      tail.current.rotation.z = -0.04 + Math.sin(t * 0.5) * 0.03;
    }
    // breathing
    if (body.current) body.current.scale.y = 1 + Math.sin(t * 1.5) * 0.006;
    // the rope from the post to the halter, sagging
    if (neck.current && ropeRef.current) {
      neck.current.localToWorld(
        halter.set(HALTER[0] - NECK_PIVOT[0], HALTER[1] - NECK_PIVOT[1], 0.1),
      );
      const pos = ropeRef.current.geometry.attributes
        .position as BufferAttribute;
      const [ax, ay, az] = POST_TOP;
      for (let i = 0; i < 16; i++) {
        const s = i / 15;
        const sag = Math.sin(s * Math.PI) * 0.28;
        pos.setXYZ(
          i,
          ax + (halter.x - ax) * s,
          ay + (halter.y - ay) * s - sag,
          az + (halter.z - az) * s,
        );
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      <group position={onGround(HORSE, -0.02)} rotation={[0, 0.18, 0]}>
        <group ref={body}>
          <mesh geometry={parts.body} material={coat} />
          {/* legs: near pair in front of the body, far pair behind; the far hind leg rests */}
          <mesh geometry={parts.fore} material={coat} position={[0, 0, 0.13]} />
          <mesh geometry={parts.hind} material={coat} position={[0, 0, 0.12]} />
          <mesh
            geometry={parts.fore}
            material={coat}
            position={[-0.07, 0, -0.13]}
          />
          <mesh
            geometry={parts.hind}
            material={coat}
            position={[0.02, 0.04, -0.12]}
            rotation={[0, 0, 0.05]}
          />
        </group>
        <group ref={neck} position={[NECK_PIVOT[0], NECK_PIVOT[1], 0]}>
          <mesh geometry={parts.neck} material={coat} />
          <mesh geometry={parts.ear} material={coat} position={[0, 0, 0.05]} />
          <mesh
            geometry={parts.ear}
            material={coat}
            position={[0.03, 0, -0.05]}
          />
        </group>
        <group ref={tail} position={[TAIL_PIVOT[0], TAIL_PIVOT[1], 0]}>
          <mesh geometry={parts.tail} material={coat} />
        </group>
      </group>
      <primitive ref={ropeRef} object={rope} />
    </group>
  );
}

/** 0 before `a`, eased up to 1 by `b`, held, eased back to 0 from `c` to `d`. */
function smoothPulse(x: number, a: number, b: number, c: number, d: number) {
  const s = (e0: number, e1: number) => {
    const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return k * k * (3 - 2 * k);
  };
  return s(a, b) * (1 - s(c, d));
}
