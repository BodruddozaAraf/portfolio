"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";
import { AdditiveBlending, Color, type Group } from "three";
import { billboard, haloFragment, ramp } from "./Campfire";
import { groundHeight } from "./land";
import { camp, campMaterial, tone } from "./materials";
import { palette } from "./palette";
import {
  BEDROLL,
  JOURNAL,
  JOURNAL_TURN,
  LANTERN,
  POST,
  type Vec3,
} from "./world";

/** A spot on the ground itself. */
export const onGround = ([x, , z]: Vec3, lift = 0): Vec3 => [
  x,
  groundHeight(x, z) + lift,
  z,
];

// The things around the fire (step 3.4), all built from simple solids and lit by the camp's own
// light: the journal lying closed by the fire (its cover is hinged at the spine, and the scroll
// camera opens it in 3.5), a rolled wool bedroll with its straps, a lit lantern, and the post the
// horse is tied to.

/** The journal's size in meters: a large field ledger. */
export const BOOK = { w: 0.24, l: 0.32, t: 0.045, board: 0.006 };

export function Journal({ cover }: { cover?: RefObject<Group | null> }) {
  const leather = useMemo(
    () => campMaterial(tone("leather", { scale: 1.05 })),
    [],
  );
  // ruled pages; the stripes also read as page edges on the sides of the block
  const pages = useMemo(
    () =>
      campMaterial(tone("paper-dark", { mix: "leather", amount: 0.12 }), {
        defines: { RULED: "" },
      }),
    [],
  );
  const strap = useMemo(
    () => campMaterial(tone("leather", { mix: "night", amount: 0.5 })),
    [],
  );
  const { w, l, t, board } = BOOK;
  const leaf = 0.003;
  const block = t - board * 2 - leaf;
  return (
    <group position={onGround(JOURNAL)} rotation={[0, JOURNAL_TURN, 0]}>
      {/* back board */}
      <mesh material={leather} position={[0, board / 2, 0]}>
        <boxGeometry args={[w, board, l]} />
      </mesh>
      {/* the page block, a little inset at head, tail and fore-edge */}
      <mesh material={pages} position={[-0.004, board + block / 2, 0]}>
        <boxGeometry args={[w - 0.014, block, l - 0.012]} />
      </mesh>
      {/* the spine */}
      <mesh material={leather} position={[-w / 2, t / 2, 0]}>
        <boxGeometry args={[board * 1.6, t, l]} />
      </mesh>
      {/* front board, hinged on the spine: rotate this group about z to open the book */}
      <group ref={cover} position={[-w / 2, t - board / 2, 0]}>
        <mesh material={leather} position={[w / 2, 0, 0]}>
          <boxGeometry args={[w, board, l]} />
        </mesh>
        {/* the first leaf, glued inside the cover: the left page once the book is open */}
        <mesh
          material={pages}
          position={[w / 2 - 0.004, -board / 2 - leaf / 2, 0]}
        >
          <boxGeometry args={[w - 0.014, leaf, l - 0.012]} />
        </mesh>
        {/* the wrap strap across the cover */}
        <mesh material={strap} position={[w / 2, board * 0.6, 0.02]}>
          <boxGeometry args={[w + 0.004, board * 0.4, 0.022]} />
        </mesh>
      </group>
    </group>
  );
}

function Bedroll() {
  const wool = useMemo(
    () =>
      campMaterial(tone("blood", { mix: "leather", amount: 0.6, scale: 0.55 })),
    [],
  );
  const end = useMemo(
    () => campMaterial(tone("blood", { mix: "night", amount: 0.4 })),
    [],
  );
  const strap = useMemo(
    () => campMaterial(tone("leather", { mix: "night", amount: 0.45 })),
    [],
  );
  const r = 0.16;
  const len = 0.95;
  return (
    <group
      position={onGround(BEDROLL, r * 0.92)}
      rotation={[0, 0.55, Math.PI / 2]}
    >
      <mesh material={wool}>
        <cylinderGeometry args={[r, r, len, 14]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} material={end} position={[0, (side * len) / 2, 0]}>
          <cylinderGeometry args={[r * 0.96, r * 0.96, 0.012, 14]} />
        </mesh>
      ))}
      {[-0.28, 0.28].map((y) => (
        <mesh key={y} material={strap} position={[0, y, 0]}>
          <cylinderGeometry args={[r * 1.04, r * 1.04, 0.035, 14]} />
        </mesh>
      ))}
    </group>
  );
}

function Lantern() {
  const metal = useMemo(
    () => campMaterial(tone("ink", { mix: "brass", amount: 0.35 })),
    [],
  );
  const flame = useMemo(
    () => new Color(palette["ember-glow"]).multiplyScalar(1.6),
    [],
  );
  const glowUniforms = useMemo(
    () => ({
      uFireStrength: camp.uLanternStrength,
      uFlare: { value: 0 },
      uSize: { value: [1.1, 1.1] },
      uGrow: { value: 0 },
      ...ramp,
    }),
    [],
  );
  useFrame(() => {
    // a wick in a glass: a small, slow flicker
    const t = camp.uTime.value;
    camp.uLanternStrength.value =
      0.33 + 0.03 * Math.sin(t * 5.1) + 0.02 * Math.sin(t * 11.7);
  });
  return (
    <group position={onGround(LANTERN)}>
      <mesh material={metal} position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.07, 0.075, 0.03, 10]} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.14, 10]} />
        <meshBasicMaterial color={flame} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          material={metal}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.058,
            0.1,
            Math.sin((i * Math.PI) / 2) * 0.058,
          ]}
        >
          <boxGeometry args={[0.008, 0.15, 0.008]} />
        </mesh>
      ))}
      <mesh material={metal} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.075, 0.06, 10]} />
      </mesh>
      <mesh material={metal} position={[0, 0.27, 0]} rotation={[0, 0.4, 0]}>
        <torusGeometry args={[0.045, 0.006, 5, 12, Math.PI]} />
      </mesh>
      <mesh position={[0, 0.12, 0]} renderOrder={2} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={billboard}
          fragmentShader={haloFragment}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/** The hitching post. The rope to the horse is drawn by the horse, whose head moves. */
export const POST_TOP = onGround(POST, 1.0);

function Post() {
  const wood = useMemo(
    () => campMaterial(tone("leather", { mix: "night", amount: 0.55 })),
    [],
  );
  return (
    <mesh
      material={wood}
      position={onGround(POST, 0.5)}
      rotation={[0.04, 0, -0.05]}
    >
      <cylinderGeometry args={[0.045, 0.06, 1.1, 7]} />
    </mesh>
  );
}

export function Props({ cover }: { cover?: RefObject<Group | null> }) {
  return (
    <group>
      <Journal cover={cover} />
      <Bedroll />
      <Lantern />
      <Post />
    </group>
  );
}
