"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { setCamp, useCamp } from "@/lib/camp";
import type { Tier } from "@/lib/device-tier";
import { capture } from "./capture";
import { spine } from "./dolly";
import { CampScene } from "./CampScene";
import { camp } from "./materials";
import { CAMERA, FIRE } from "./world";
import { Vector3 } from "three";

// The 3D camp's own chunk (loaded by CampStage, never in the first JavaScript). It owns the WebGL
// canvas: pixel ratio per tier, the first-frames handshake that tells the page the camp is ready,
// and the performance monitor that steps the tier down when the frame rate cannot hold.

export type CampCanvasProps = {
  tier: Exclude<Tier, "low">;
  /** false while the hero is off screen: the render loop stops */
  active: boolean;
};

const DPR: Record<CampCanvasProps["tier"], [number, number]> = {
  high: [1, 2],
  mid: [1, 1.5],
};

export function CampCanvas({ tier, active }: CampCanvasProps) {
  const [min, max] = DPR[tier];
  const [dpr, setDpr] = useState(max);
  const ready = useCamp().status === "ready";

  return (
    <Canvas
      flat
      dpr={Math.min(dpr, max, window.devicePixelRatio)}
      frameloop={active ? "always" : "never"}
      gl={{
        antialias: tier === "high",
        // capture mode keeps its pixels (and the near layer's transparency) for the export script
        alpha: capture === "near",
        preserveDrawingBuffer: capture !== null,
        stencil: false,
        powerPreference: "high-performance",
      }}
      camera={{
        fov: CAMERA.fov,
        near: 0.1,
        far: 400,
        position: CAMERA.position,
      }}
      onCreated={({ gl }) => {
        gl.domElement.dataset.scene = "camp-scene";
        gl.domElement.addEventListener("webglcontextlost", () =>
          setCamp({ status: "off", tier: "low" }),
        );
        setCamp({ progress: 0.75 });
      }}
    >
      <CampScene tier={tier} />
      <FirstFrames />
      <FpsProbe />
      {/* judged only while running and once the scene has settled, so a pause or the compile
          hitch never reads as a slow device */}
      {active && ready && !capture ? (
        <PerformanceMonitor
          flipflops={3}
          onChange={({ factor }) => setDpr(min + (max - min) * factor)}
          onDecline={({ fps }) => {
            if (tier === "high") setCamp({ tier: "mid" });
            else if (fps < 30) setCamp({ tier: "low" });
          }}
          onFallback={() => setCamp({ tier: "low" })}
        />
      ) : null}
    </Canvas>
  );
}

const fireHeart = new Vector3(FIRE[0], FIRE[1] + 0.35, FIRE[2]);

/** Compiles every shader up front, then reports ready after a few drawn frames. */
function FirstFrames() {
  const { gl, scene, camera } = useThree();
  const frames = useRef(0);
  useEffect(() => {
    gl.compile(scene, camera);
    setCamp({ progress: 0.9 });
  }, [gl, scene, camera]);
  useFrame((state) => {
    frames.current += 1;
    if (frames.current !== 3) return;
    setCamp({ status: "ready", progress: 1 });
    if (capture) {
      // where the fire's heart and the journal land, as fractions of the canvas, for the static
      // hero's CSS glow and its scroll zoom
      const at = (v: Vector3) => {
        const p = v.clone().project(state.camera);
        return { x: (p.x + 1) / 2, y: (1 - p.y) / 2 };
      };
      (window as Window & { __campCapture?: object }).__campCapture = {
        fire: at(fireHeart),
        journal: at(spine),
      };
    }
  });
  return null;
}

/**
 * With `?stats` in the URL, the frame rate of each second lands on window.__campFps and the fire's
 * flare on window.__campFlare (testing).
 */
function FpsProbe() {
  const [on] = useState(
    () =>
      typeof location !== "undefined" &&
      new URLSearchParams(location.search).has("stats"),
  );
  const acc = useRef({ frames: 0, since: 0 });
  useFrame(() => {
    if (!on) return;
    const now = performance.now();
    const a = acc.current;
    if (!a.since) a.since = now;
    a.frames += 1;
    if (now - a.since >= 1000) {
      const w = window as Window & {
        __campFps?: number[];
        __campFlare?: number;
      };
      (w.__campFps ??= []).push(
        Math.round((a.frames * 1000) / (now - a.since)),
      );
      w.__campFlare = Math.round(camp.uFlare.value * 100) / 100;
      a.frames = 0;
      a.since = now;
    }
  });
  return null;
}
