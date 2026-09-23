"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Spherical, Vector3 } from "three";
import { pointer, watchPointer } from "./pointer";
import { CAMERA, FIRE } from "./world";

// The camera: the establishing shot, framed so the fire sits to the right of the hero copy and
// low in the frame at any aspect (a view offset slides the picture without changing the
// perspective), and a slight turn toward a fine pointer (about 2 degrees, eased).

const PARALLAX_YAW = (2 * Math.PI) / 180;
const PARALLAX_PITCH = (1 * Math.PI) / 180;

/**
 * Where the fire should land on screen, in normalized device coordinates, for this aspect, given
 * where the plain camera puts it (`natural`): wide screens move it right of the copy; portrait
 * screens (tablets) keep it nearer the middle and lower, under the copy.
 */
function fireSpot(aspect: number, natural: { x: number; y: number }) {
  const t = Math.min(1, Math.max(0, (aspect - 0.7) / (1.6 - 0.7)));
  // on a phone the copy fills the middle of the screen: the fire goes below it
  return { x: 0.16 + t * 0.28, y: natural.y + (-0.72 - natural.y) * (1 - t) };
}

const target = new Vector3(...CAMERA.target);
const fire = new Vector3(...FIRE);
const base = new Spherical().setFromVector3(
  new Vector3(...CAMERA.position).sub(target),
);

/** Frames the fire for this canvas size: where it projects plainly, then a view offset to move it. */
function frame(camera: PerspectiveCamera, width: number, height: number) {
  camera.aspect = width / height;
  // tall screens widen the lens, so the camp still fits across them
  const tall = Math.min(1, Math.max(0, (1 - camera.aspect) / (1 - 0.46)));
  camera.fov = CAMERA.fov + tall * 22;
  camera.clearViewOffset();
  camera.position.set(...CAMERA.position);
  camera.lookAt(target);
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();
  const at = fire.clone().project(camera);
  const want = fireSpot(camera.aspect, at);
  camera.setViewOffset(
    width,
    height,
    ((at.x - want.x) * width) / 2,
    ((want.y - at.y) * height) / 2,
    width,
    height,
  );
}

export function CameraRig() {
  const eased = useRef({ x: 0, y: 0 });
  const framed = useRef("");

  useEffect(watchPointer, []);

  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    const { width, height } = state.size;
    const key = `${width}x${height}`;
    if (framed.current !== key) {
      frame(camera, width, height);
      framed.current = key;
    }
    const k = 1 - Math.exp(-delta * 2.5);
    eased.current.x += (pointer.x - eased.current.x) * k;
    eased.current.y += (pointer.y - eased.current.y) * k;
    const s = base.clone();
    s.theta -= eased.current.x * PARALLAX_YAW;
    s.phi += eased.current.y * PARALLAX_PITCH;
    camera.position.setFromSpherical(s).add(target);
    camera.lookAt(target);
  });

  return null;
}
