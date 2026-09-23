"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  IcosahedronGeometry,
  InstancedMesh,
  PlaneGeometry,
  Matrix4,
  Quaternion,
  Vector3,
  type PerspectiveCamera,
} from "three";
import { camp, campMaterial, tone } from "./materials";
import { rng } from "./noise";
import { palette } from "./palette";
import { watchPointer, pointer } from "./pointer";
import { FIRE } from "./world";

// The campfire (roadmap 3.3): a ring of stones round crossed logs whose ends glow, layered flames
// drawn by a noise shader on camera-facing cards, sparks that rise and wink out (animated wholly on
// the GPU from the clock), a warm halo in the smoky air, and the light that flickers on everything
// near. A fine pointer that comes close makes it flare: the flames stand taller, the light jumps
// and the sparks hurry.

const FLARE_RADIUS = 240; // px from the fire's heart where the flare begins

// the fire's colors, from the palette: blood at the tips, ember, the glow, a pale core
export const ramp = {
  uDeep: { value: new Color(palette.blood) },
  uEmber: { value: new Color(palette.ember) },
  uGlow: { value: new Color(palette["ember-glow"]) },
  uCore: { value: new Color(palette["paper-light"]) },
};

const noiseGlsl = /* glsl */ `
  float fhash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float fnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(fhash(i), fhash(i + vec2(1.0, 0.0)), u.x),
               mix(fhash(i + vec2(0.0, 1.0)), fhash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float ffbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) { s += a * fnoise(p); p *= 2.07; a *= 0.5; }
    return s;
  }
`;

// a card that turns about its vertical axis to face the camera; `position` is in card units
export const billboard = /* glsl */ `
  uniform vec2 uSize;
  uniform float uGrow; // how much taller the card stands at full flare
  uniform float uFlare;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 center = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec3 toCam = cameraPosition - center;
    toCam.y = 0.0;
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), normalize(toCam)));
    vec2 size = uSize * vec2(1.0 + uFlare * uGrow * 0.3, 1.0 + uFlare * uGrow);
    vec3 wp = center + right * position.x * size.x + vec3(0.0, position.y * size.y, 0.0);
    gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
  }
`;

const flameFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uFlare;
  uniform float uFireStrength;
  uniform vec3 uDeep;
  uniform vec3 uEmber;
  uniform vec3 uGlow;
  uniform vec3 uCore;
  varying vec2 vUv;
  ${noiseGlsl}
  void main() {
    vec2 uv = vUv;
    float t = uTime * (1.5 + uFlare * 0.8);
    // the flame licks upward: noise scrolls up, and bends the flame sideways more as it rises
    float n = ffbm(vec2(uv.x * 3.0 + uSeed, uv.y * 2.4 - t));
    float n2 = ffbm(vec2(uv.x * 6.0 - uSeed, uv.y * 4.0 - t * 1.7));
    float bend = (n - 0.5) * 0.55 * uv.y + (n2 - 0.5) * 0.12;
    float width = mix(0.46, 0.04, pow(uv.y, 0.85));
    float d = abs(uv.x - 0.5 + bend) / width;
    float body = 1.0 - smoothstep(0.45, 1.0, d);
    // ragged top: the flame breaks into tongues that vanish
    float top = smoothstep(1.0, 0.25 + n2 * 0.35, uv.y + (1.0 - n) * 0.25);
    float base = smoothstep(0.0, 0.1, uv.y);
    float shape = body * top * base;
    float heat = shape * (1.15 - uv.y * 0.8) * (0.65 + n * 0.7) * (1.0 + uFlare * 0.4);
    vec3 color = mix(uDeep, uEmber, smoothstep(0.08, 0.4, heat));
    color = mix(color, uGlow, smoothstep(0.4, 0.8, heat));
    color = mix(color, uCore, smoothstep(0.9, 1.25, heat) * 0.7);
    float a = clamp(shape * 0.95, 0.0, 1.0) * clamp(uFireStrength, 0.0, 1.5) * 0.8;
    gl_FragColor = vec4(color * a, a);
    #include <colorspace_fragment>
  }
`;

export const haloFragment = /* glsl */ `
  uniform float uFireStrength;
  uniform vec3 uGlow;
  uniform vec3 uEmber;
  varying vec2 vUv;
  void main() {
    float r = length((vUv - vec2(0.5, 0.4)) * vec2(1.0, 1.25));
    float a = pow(max(1.0 - r * 2.0, 0.0), 2.0) * 0.42 * uFireStrength;
    gl_FragColor = vec4(mix(uEmber, uGlow, 0.35) * a, a);
    #include <colorspace_fragment>
  }
`;

const sparkVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uFlare;
  attribute vec4 aSeed; // phase, speed, drift, size
  varying float vLife;
  void main() {
    float life = fract(aSeed.x + uTime * (0.22 + aSeed.y * 0.3) * (1.0 + uFlare * 1.4));
    float h = life * (1.4 + aSeed.y * 2.2) * (1.0 + uFlare * 0.6);
    vec3 p = position;
    // they rise, drift on the air and wander
    p.y += h + 0.25;
    p.x += sin(uTime * 1.3 + aSeed.x * 40.0) * 0.12 * life + aSeed.z * h * 0.35;
    p.z += cos(uTime * 1.1 + aSeed.x * 23.0) * 0.1 * life;
    vLife = life;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSeed.w * uPixelRatio * (1.0 - life * 0.6) * (6.0 / -mv.z);
  }
`;

const sparkFragment = /* glsl */ `
  uniform vec3 uGlow;
  uniform vec3 uCore;
  varying float vLife;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r) * smoothstep(1.0, 0.55, vLife) * smoothstep(0.0, 0.05, vLife);
    vec3 color = mix(uCore, uGlow, smoothstep(0.0, 0.4, vLife));
    gl_FragColor = vec4(color * a, a);
    #include <colorspace_fragment>
  }
`;

const FLAMES = [
  { x: 0, z: 0, w: 1.05, h: 1.35, seed: 0.0 },
  { x: -0.16, z: 0.06, w: 0.66, h: 1.0, seed: 3.7 },
  { x: 0.18, z: -0.05, w: 0.7, h: 1.12, seed: 7.1 },
  { x: 0.02, z: 0.1, w: 0.44, h: 1.55, seed: 11.9 },
];

function sparkGeometry(count: number) {
  const rand = rng(41);
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.3;
    pos.set([Math.cos(a) * r, 0, Math.sin(a) * r], i * 3);
    seed.set([rand(), rand(), (rand() - 0.5) * 0.6, 2 + rand() * 3.5], i * 4);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new BufferAttribute(seed, 4));
  return g;
}

function Ring() {
  const stonesRef = useRef<InstancedMesh>(null);
  const stone = useMemo(() => new IcosahedronGeometry(0.16, 0), []);
  const stoneMat = useMemo(
    () => campMaterial(tone("ink", { mix: "night-blue", amount: 0.25 })),
    [],
  );
  const logMat = useMemo(
    () =>
      campMaterial(
        tone("night", { mix: "leather", amount: 0.55, scale: 1.3 }),
        {
          defines: { EMBER: "" },
        },
      ),
    [],
  );
  const COUNT = 11;

  useLayoutEffect(() => {
    const mesh = stonesRef.current;
    if (!mesh) return;
    const rand = rng(17);
    const m = new Matrix4();
    const q = new Quaternion();
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2 + rand() * 0.2;
      const r = 0.62 + rand() * 0.06;
      q.setFromAxisAngle(
        new Vector3(rand(), 1, rand()).normalize(),
        rand() * Math.PI,
      );
      const s = 0.8 + rand() * 0.5;
      m.compose(
        new Vector3(Math.cos(a) * r, 0.05, Math.sin(a) * r),
        q,
        new Vector3(s * 1.2, s * 0.7, s),
      );
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  // crossed logs leaning into the fire
  const logs = [
    { rot: [0, 0.3, 1.25], pos: [-0.12, 0.16, 0.04] },
    { rot: [0, 2.4, 1.2], pos: [0.12, 0.16, -0.02] },
    { rot: [0, 4.3, 1.28], pos: [0.02, 0.15, 0.14] },
    { rot: [0.1, 1.2, 1.5], pos: [0, 0.08, -0.12] },
  ] as const;

  return (
    <group>
      <instancedMesh
        ref={stonesRef}
        args={[stone, stoneMat, COUNT]}
        frustumCulled={false}
      />
      {logs.map((l, i) => (
        <mesh
          key={i}
          position={[...l.pos]}
          rotation={[...l.rot]}
          material={logMat}
        >
          <cylinderGeometry args={[0.06, 0.075, 0.95, 6]} />
        </mesh>
      ))}
    </group>
  );
}

export function Campfire({ sparks }: { sparks: number }) {
  const flare = useRef(0);
  const fireScreen = useMemo(() => new Vector3(), []);
  // card units: x from -0.5 to 0.5, y from 0 (the logs) to 1 (the tips)
  const card = useMemo(() => new PlaneGeometry(1, 1).translate(0, 0.5, 0), []);

  const flameMats = useMemo(
    () =>
      FLAMES.map((f) => ({
        ...f,
        uniforms: {
          uTime: camp.uTime,
          uFlare: camp.uFlare,
          uFireStrength: camp.uFireStrength,
          uSeed: { value: f.seed },
          uSize: { value: [f.w, f.h] },
          uGrow: { value: 0.7 },
          ...ramp,
        },
      })),
    [],
  );
  const haloUniforms = useMemo(
    () => ({
      uFireStrength: camp.uFireStrength,
      uFlare: camp.uFlare,
      uSize: { value: [5.5, 4.2] },
      uGrow: { value: 0.15 },
      ...ramp,
    }),
    [],
  );
  const sparkGeo = useMemo(() => sparkGeometry(sparks), [sparks]);
  const sparkUniforms = useMemo(
    () => ({
      uTime: camp.uTime,
      uPixelRatio: camp.uPixelRatio,
      uFlare: camp.uFlare,
      ...ramp,
    }),
    [],
  );

  useEffect(watchPointer, []);

  useFrame((state, delta) => {
    const t = camp.uTime.value;
    // how near the pointer is to the fire's heart, on screen
    let near = 0;
    if (pointer.active) {
      const rect = state.gl.domElement.getBoundingClientRect();
      fireScreen
        .set(FIRE[0], FIRE[1] + 0.5, FIRE[2])
        .project(state.camera as PerspectiveCamera);
      const sx = rect.left + ((fireScreen.x + 1) / 2) * rect.width;
      const sy = rect.top + ((1 - fireScreen.y) / 2) * rect.height;
      const d = Math.hypot(pointer.clientX - sx, pointer.clientY - sy);
      near = 1 - Math.min(1, Math.max(0, (d - 40) / FLARE_RADIUS));
      near = near * near * (3 - 2 * near);
    }
    // flare up fast, die down slowly
    const k = 1 - Math.exp(-delta * (near > flare.current ? 6 : 1.2));
    flare.current += (near - flare.current) * k;
    camp.uFlare.value = flare.current;
    // the flicker: a few incommensurate waves and a little noise
    const flick =
      0.86 +
      0.07 * Math.sin(t * 7.3) +
      0.05 * Math.sin(t * 13.7 + 1.3) +
      0.04 * Math.sin(t * 23.1 + 0.4) +
      (Math.random() - 0.5) * 0.04;
    camp.uFireStrength.value = flick * (1 + flare.current * 0.75);
    camp.uFirePos.value.set(
      FIRE[0] + Math.sin(t * 3.1) * 0.04,
      FIRE[1] + 0.45 + Math.sin(t * 5.3) * 0.05,
      FIRE[2],
    );
  });

  return (
    <group position={FIRE}>
      <Ring />
      <mesh position={[0, 0.2, 0]} renderOrder={2} frustumCulled={false}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          vertexShader={billboard}
          fragmentShader={haloFragment}
          uniforms={haloUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </mesh>
      {flameMats.map((f, i) => (
        <mesh
          key={i}
          geometry={card}
          position={[f.x, 0.08, f.z]}
          renderOrder={3}
          frustumCulled={false}
        >
          <shaderMaterial
            vertexShader={billboard}
            fragmentShader={flameFragment}
            uniforms={f.uniforms}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
      <points geometry={sparkGeo} renderOrder={4} frustumCulled={false}>
        <shaderMaterial
          vertexShader={sparkVertex}
          fragmentShader={sparkFragment}
          uniforms={sparkUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}
