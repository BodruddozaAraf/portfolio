"use client";

import { useMemo } from "react";
import { Color } from "three";
import { camp } from "./materials";
import { palette } from "./palette";
import { RIDGES } from "./world";

// Valley mist: a few wide sheets hung in the gaps between the ridges, each a drifting band of
// soft noise that is thickest at the valley floor and fades out well below the crests. The
// sheets are why the ridges read as far apart.

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vWorld;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
    return s;
  }

  void main() {
    vec2 p = vec2(vUv.x * 14.0 + uTime * 0.012 + uSeed, vUv.y * 2.2 + uSeed);
    float n = fbm(p + vec2(fbm(p * 0.7 - uTime * 0.008), 0.0));
    // dense in the lower part of the sheet, feathered to nothing at its top and sides
    float body = smoothstep(1.0, 0.3, vUv.y) * smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    float a = smoothstep(0.25, 0.85, n) * body * uOpacity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

// each sheet hangs just in front of a ridge, from below the sightline over the hill's brow (the
// part hidden anyway) to about the ridge's crest
const SHEETS = [
  { z: RIDGES[0].z + 6, bottom: -6, height: 6.5, opacity: 0.6 },
  { z: RIDGES[1].z + 8, bottom: -9, height: 11, opacity: 0.55 },
  { z: RIDGES[2].z + 12, bottom: -14, height: 19, opacity: 0.5 },
];

export function Mist({ layers }: { layers: number }) {
  const sheets = useMemo(
    () =>
      SHEETS.slice(0, layers).map((s, i) => ({
        ...s,
        width: Math.abs(s.z) * 3.6,
        uniforms: {
          uTime: camp.uTime,
          uSeed: { value: i * 7.3 },
          uOpacity: { value: s.opacity },
          uColor: {
            value: new Color(palette.dusk).lerp(
              new Color(palette["paper-light"]),
              0.12 + i * 0.04,
            ),
          },
        },
      })),
    [layers],
  );
  return (
    <group>
      {sheets.map((s, i) => (
        <mesh
          key={i}
          position={[0, s.bottom + s.height / 2, s.z]}
          renderOrder={1}
        >
          <planeGeometry args={[s.width, s.height]} />
          <shaderMaterial
            vertexShader={vertex}
            fragmentShader={fragment}
            uniforms={s.uniforms}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
