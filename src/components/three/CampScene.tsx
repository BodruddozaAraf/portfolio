"use client";

import { useFrame } from "@react-three/fiber";
import type { Tier } from "@/lib/device-tier";
import { CameraRig } from "./CameraRig";
import { CAPTURE_TIME, capture } from "./capture";
import { Campfire } from "./Campfire";
import { Horse } from "./Horse";
import { camp } from "./materials";
import { Mist } from "./Mist";
import { Pines } from "./Pines";
import { Props } from "./Props";
import { Sky } from "./Sky";
import { Terrain } from "./Terrain";
import { DETAIL } from "./world";

// The camp at night (docs/05-sections.md section 1): a clearing on a hillside, pines on the hill
// shoulders, the land falling away into a misty valley, ridge after ridge to the mountains, and
// stars. Built up over Phase 3: the land in 3.2, the fire in 3.3, the props and the horse in 3.4.

export function CampScene({ tier }: { tier: Exclude<Tier, "low"> }) {
  const detail = DETAIL[tier];
  useFrame((state, delta) => {
    camp.uTime.value = capture
      ? CAPTURE_TIME
      : camp.uTime.value + Math.min(delta, 0.1);
    camp.uPixelRatio.value = state.viewport.dpr;
  });
  const far = capture !== "near";
  const near = capture !== "far";
  return (
    <>
      <CameraRig />
      {far ? <Sky stars={detail.stars} /> : null}
      <Terrain ground={near} ridges={far} />
      <Pines count={detail.pines} hill={near} ridge={far} />
      {far ? <Mist layers={detail.mist} /> : null}
      {near ? (
        <>
          <Campfire sparks={detail.sparks} />
          <Props />
          <Horse />
        </>
      ) : null}
    </>
  );
}
