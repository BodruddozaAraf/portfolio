import {
  Color,
  ShaderMaterial,
  Vector3,
  type ShaderMaterialParameters,
} from "three";
import { palette } from "./palette";
import { FIRE } from "./world";

// One light model for the whole camp, shared by every surface: a dim cool moon from behind, the
// campfire as a warm point light that flickers (step 3.3 drives it), and a haze that thickens
// with distance toward the dusk at the horizon. Written as small shaders rather than three's lit
// materials: the camp is drawn as a painting of silhouettes, and one uniform set keeps every
// object in the same light.

export const camp = {
  uTime: { value: 0 },
  /** the canvas's device pixel ratio, for point sizes */
  uPixelRatio: { value: 1 },
  uFirePos: { value: new Vector3(FIRE[0], FIRE[1] + 0.45, FIRE[2]) },
  uFireColor: {
    value: new Color(palette["ember-glow"]).lerp(new Color(palette.ember), 0.5),
  },
  /** 0 = out, about 1 = a healthy fire; the flicker rides on this */
  uFireStrength: { value: 1 },
  /** 0..1: how hard the fire is flaring (a pointer close to it) */
  uFlare: { value: 0 },
  uMoonDir: { value: new Vector3(-0.45, 0.75, -0.5).normalize() },
  uMoonColor: { value: new Color(palette["night-blue"]).multiplyScalar(1.9) },
  uAmbient: { value: new Color(palette["night-blue"]).multiplyScalar(0.55) },
  uHazeLow: {
    value: new Color(palette.dusk).lerp(new Color(palette.ember), 0.06),
  },
  uHazeHigh: { value: new Color(palette["night-blue"]) },
  uHazeDensity: { value: 0.0095 },
};

export const vertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec2 vUv;
  #ifdef USE_INSTANCING_COLOR
    varying vec3 vTint;
  #endif
  void main() {
    vUv = uv;
    vec4 p = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      p = instanceMatrix * p;
      n = mat3(instanceMatrix) * n;
    #endif
    #ifdef USE_INSTANCING_COLOR
      vTint = instanceColor;
    #endif
    vec4 w = modelMatrix * p;
    vWorld = w.xyz;
    vNormal = normalize(mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

/** Uniforms and the light and haze functions, for any fragment shader in the camp. */
export const lightPars = /* glsl */ `
  uniform float uTime;
  uniform vec3 uFirePos;
  uniform vec3 uFireColor;
  uniform float uFireStrength;
  uniform vec3 uMoonDir;
  uniform vec3 uMoonColor;
  uniform vec3 uAmbient;
  uniform vec3 uHazeLow;
  uniform vec3 uHazeHigh;
  uniform float uHazeDensity;

  vec3 fireLight(vec3 wp, vec3 n) {
    vec3 toFire = uFirePos - wp;
    float d = length(toFire);
    float facing = dot(n, toFire / max(d, 1e-4)) * 0.6 + 0.4; // wrapped, so silhouettes glow at the rim
    float fall = uFireStrength / (1.0 + d * d * 0.32);
    return uFireColor * max(facing, 0.0) * fall * 2.8;
  }

  vec3 shade(vec3 albedo, vec3 wp, vec3 n) {
    float moon = max(dot(n, uMoonDir), 0.0);
    vec3 light = uAmbient + uMoonColor * moon * 0.35 + fireLight(wp, n);
    return albedo * light;
  }

  vec3 haze(vec3 color, vec3 wp, float extra) {
    float d = distance(wp, cameraPosition);
    float f = 1.0 - exp(-pow(d * uHazeDensity, 2.0));
    f = clamp(f + extra, 0.0, 1.0);
    // low haze is the warm dusk at the horizon; it cools to night blue with height
    vec3 tone = mix(uHazeLow, uHazeHigh, smoothstep(-6.0, 26.0, wp.y));
    return mix(color, tone, f);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uHaze;
  uniform float uLowMist;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec2 vUv;
  #ifdef USE_INSTANCING_COLOR
    varying vec3 vTint;
  #endif
  ${lightPars}
  #ifdef PATCHY
    float vhash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(vhash(i), vhash(i + vec2(1.0, 0.0)), u.x),
                 mix(vhash(i + vec2(0.0, 1.0)), vhash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
  #endif
  void main() {
    vec3 albedo = uColor;
    #ifdef PATCHY
      // dry grass and bare earth in patches, with a fine grain of tufts
      vec2 q = vWorld.xz;
      float patches = vnoise(q * 0.22) * 0.6 + vnoise(q * 0.9) * 0.3 + vnoise(q * 5.0) * 0.1;
      albedo *= 0.65 + patches * 0.75;
    #endif
    #ifdef USE_INSTANCING_COLOR
      albedo *= vTint;
    #endif
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    // uLowMist: valley mist pooled at the foot of a ridge (uv.y is 0 at its foot)
    float mist = uHaze + uLowMist * pow(1.0 - vUv.y, 2.0);
    vec3 color = haze(shade(albedo, vWorld, n), vWorld, mist);
    #ifdef EMBER
      // wood in the fire glows like coals
      float coal = smoothstep(0.42, 0.04, distance(vWorld, vec3(uFirePos.x, 0.12, uFirePos.z)));
      color += uFireColor * coal * coal * uFireStrength * 1.8;
    #endif
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * A lit, hazed surface of one color. `haze` adds haze on top of the distance haze; `lowMist`
 * pools mist toward the bottom of the surface's uv (the foot of a ridge).
 */
export function campMaterial(
  color: Color,
  {
    haze = 0,
    lowMist = 0,
    ...rest
  }: { haze?: number; lowMist?: number } & ShaderMaterialParameters = {},
) {
  return new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      ...camp,
      uColor: { value: color },
      uHaze: { value: haze },
      uLowMist: { value: lowMist },
    },
    ...rest,
  });
}

/** A palette color, optionally mixed toward another and scaled (for shades between tokens). */
export function tone(
  name: keyof typeof palette,
  {
    mix,
    amount = 0.5,
    scale = 1,
  }: { mix?: keyof typeof palette; amount?: number; scale?: number } = {},
) {
  const c = new Color(palette[name]);
  if (mix) c.lerp(new Color(palette[mix]), amount);
  return c.multiplyScalar(scale);
}
