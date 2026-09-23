"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Spherical, Vector3 } from "three";
import { ease, head, measureTrack, readProgress, spine } from "./dolly";
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
  return {
    x: ((at.x - want.x) * width) / 2,
    y: ((want.y - at.y) * height) / 2,
  };
}

// the dolly's path: from the establishing shot, a swoop up and over to above the journal, then
// straight down onto the open pages, the view turning so the book reads head up
const above = new Vector3();
/** Above the journal, high enough that the whole open spread fits the screen (tall ones too). */
function aboveFor(camera: PerspectiveCamera) {
  const half = Math.tan((camera.fov * Math.PI) / 360);
  // the open spread is about 0.48 by 0.32 m: leave a margin round it
  const height = Math.max(
    0.78,
    0.42 / (2 * half),
    0.62 / (2 * half * camera.aspect),
  );
  return above
    .copy(spine)
    .add(new Vector3(0, height, 0))
    .addScaledVector(head, -0.3 * (height / 0.78));
}
const close = spine.clone().add(new Vector3(0, 0.26, 0));
const worldUp = new Vector3(0, 1, 0);
const tmp = {
  start: new Vector3(),
  ctrl: new Vector3(),
  pos: new Vector3(),
  look: new Vector3(),
  up: new Vector3(),
};

function bezier(out: Vector3, a: Vector3, b: Vector3, c: Vector3, t: number) {
  const u = 1 - t;
  return out
    .copy(a)
    .multiplyScalar(u * u)
    .addScaledVector(b, 2 * u * t)
    .addScaledVector(c, t * t);
}

export function CameraRig() {
  const eased = useRef({ x: 0, y: 0 });
  const framed = useRef("");
  const offset = useRef({ x: 0, y: 0 });

  useEffect(watchPointer, []);

  // the scroll track: measured now, and again whenever it or the window changes size
  useEffect(() => {
    measureTrack();
    const track = document.querySelector("[data-hero-track]");
    const ro = new ResizeObserver(measureTrack);
    if (track) ro.observe(track);
    addEventListener("resize", measureTrack);
    return () => {
      ro.disconnect();
      removeEventListener("resize", measureTrack);
    };
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    const { width, height } = state.size;
    const key = `${width}x${height}`;
    if (framed.current !== key) {
      offset.current = frame(camera, width, height);
      framed.current = key;
    }
    const p = readProgress();
    const approach = ease(0, 0.72, p);
    const descend = ease(0.72, 1, p);

    // the establishing shot, turned a little toward the pointer (less and less as the dolly goes)
    const k = 1 - Math.exp(-delta * 2.5);
    eased.current.x += (pointer.x - eased.current.x) * k;
    eased.current.y += (pointer.y - eased.current.y) * k;
    const s = base.clone();
    s.theta -= eased.current.x * PARALLAX_YAW * (1 - approach);
    s.phi += eased.current.y * PARALLAX_PITCH * (1 - approach);
    const { start, ctrl, pos, look, up } = tmp;
    start.setFromSpherical(s).add(target);

    if (p <= 0) {
      pos.copy(start);
      look.copy(target);
      up.copy(worldUp);
    } else {
      aboveFor(camera);
      ctrl.copy(start).lerp(above, 0.5).add(worldUp);
      bezier(pos, start, ctrl, above, approach).lerp(close, descend);
      look.copy(target).lerp(spine, ease(0, 0.6, p));
      up.copy(worldUp)
        .lerp(head, ease(0.25, 0.7, p))
        .normalize();
    }
    camera.up.copy(up);
    camera.position.copy(pos);
    camera.lookAt(look);
    // the framing offset (fire right of the copy) gives way to the journal in the middle
    const o = 1 - approach;
    camera.setViewOffset(
      width,
      height,
      offset.current.x * o,
      offset.current.y * o,
      width,
      height,
    );
  });

  return null;
}
