"use client";

import { useMemo } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  Vector3,
} from "three";
import { camp } from "./materials";
import { rng } from "./noise";
import { palette } from "./palette";

// The sky: night overhead, night blue lower down, and the last of the dusk along the horizon,
// warmest behind the far range. Stars thin out toward the horizon and twinkle slowly.

const RADIUS = 360;

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vec4(p.xy, p.w * 0.9999, p.w); // at the far plane, behind everything
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uNight;
  uniform vec3 uNightBlue;
  uniform vec3 uDusk;
  uniform vec3 uGlow;
  uniform vec3 uGlowDir;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float e = d.y; // elevation: 0 at the horizon, 1 overhead
    vec3 color = mix(uDusk, uNightBlue, smoothstep(0.0, 0.2, e));
    color = mix(color, uNight, smoothstep(0.16, 0.6, e));
    // the dusk glow, low and to one side
    float toward = max(dot(normalize(vec3(d.x, 0.0, d.z)), uGlowDir), 0.0);
    float glow = pow(toward, 6.0) * (1.0 - smoothstep(-0.02, 0.22, e));
    color += uGlow * glow * 0.55;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

const starVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;
  void main() {
    vec3 d = normalize(position);
    float twinkle = 0.72 + 0.28 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 40.0);
    vAlpha = twinkle * smoothstep(0.03, 0.3, d.y) * 1.4;
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vec4(p.xy, p.w * 0.9999, p.w);
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const starFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, r) * vAlpha;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

function starGeometry(count: number) {
  const rand = rng(5);
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // uniform over the upper hemisphere, a little denser up high
    const y = Math.pow(rand(), 0.8);
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(1 - y * y);
    pos.set(
      [
        Math.cos(a) * r * RADIUS * 0.95,
        y * RADIUS * 0.95,
        Math.sin(a) * r * RADIUS * 0.95,
      ],
      i * 3,
    );
    const bright = rand();
    size[i] = bright > 0.985 ? 4 : bright > 0.85 ? 2.7 : 1.9;
    phase[i] = rand();
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("aSize", new BufferAttribute(size, 1));
  g.setAttribute("aPhase", new BufferAttribute(phase, 1));
  return g;
}

export function Sky({ stars }: { stars: number }) {
  const skyUniforms = useMemo(
    () => ({
      uNight: { value: new Color(palette.night) },
      uNightBlue: { value: new Color(palette["night-blue"]) },
      uDusk: {
        value: new Color(palette.dusk).lerp(new Color(palette.ember), 0.08),
      },
      uGlow: { value: new Color(palette.ember).multiplyScalar(0.28) },
      // behind the far range, a little right of straight ahead
      uGlowDir: { value: new Vector3(0.25, 0, -1).normalize() },
    }),
    [],
  );
  const starGeo = useMemo(() => starGeometry(stars), [stars]);
  const starUniforms = useMemo(
    () => ({
      uTime: camp.uTime,
      uPixelRatio: camp.uPixelRatio,
      uColor: { value: new Color(palette["paper-light"]) },
    }),
    [],
  );

  return (
    <group>
      <mesh renderOrder={-2} frustumCulled={false}>
        <sphereGeometry args={[RADIUS, 32, 16]} />
        <shaderMaterial
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          uniforms={skyUniforms}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
      <points geometry={starGeo} renderOrder={-1} frustumCulled={false}>
        <shaderMaterial
          vertexShader={starVertex}
          fragmentShader={starFragment}
          uniforms={starUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}
