"use client";

import { useFrame } from "@react-three/fiber";
import type { Tier } from "@/lib/device-tier";
import { CameraRig } from "./CameraRig";
import { Campfire } from "./Campfire";
import { camp } from "./materials";
import { Mist } from "./Mist";
import { Pines } from "./Pines";
import { Sky } from "./Sky";
import { Terrain } from "./Terrain";
import { DETAIL } from "./world";

// The camp at night (docs/05-sections.md section 1): a clearing on a hillside, pines on the hill
// shoulders, the land falling away into a misty valley, ridge after ridge to the mountains, and
// stars. Built up over Phase 3: the land in 3.2, the fire in 3.3, the props and the horse in 3.4.

export function CampScene({ tier }: { tier: Exclude<Tier, "low"> }) {
  const detail = DETAIL[tier];
  useFrame((state, delta) => {
    camp.uTime.value += Math.min(delta, 0.1);
    camp.uPixelRatio.value = state.viewport.dpr;
  });
  return (
    <>
      <CameraRig />
      <Sky stars={detail.stars} />
      <Terrain />
      <Pines count={detail.pines} />
      <Mist layers={detail.mist} />
      <Campfire sparks={detail.sparks} />
    </>
  );
}
