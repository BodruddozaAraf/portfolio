"use client";

import { useMemo } from "react";
import { Color } from "three";
import { palette } from "./palette";

// The sky behind everything: a screen-space quad drawn first, with the hero's own gradient
// (night at the top, through night blue, to the dusk at the horizon), so the canvas fades in over
// the server-rendered hero without a seam.

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uNight;
  uniform vec3 uNightBlue;
  uniform vec3 uDusk;
  varying vec2 vUv;
  void main() {
    float t = 1.0 - vUv.y; // 0 at the top
    vec3 color = uNight;
    color = mix(color, uNightBlue, smoothstep(0.35, 0.675, t));
    color = mix(color, uDusk, smoothstep(0.675, 1.0, t));
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

export function Sky() {
  const uniforms = useMemo(
    () => ({
      uNight: { value: new Color(palette.night) },
      uNightBlue: { value: new Color(palette["night-blue"]) },
      uDusk: { value: new Color(palette.dusk) },
    }),
    [],
  );
  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
