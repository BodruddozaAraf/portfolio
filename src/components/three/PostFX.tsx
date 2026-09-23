"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  HalfFloatType,
  Mesh,
  NoBlending,
  OrthographicCamera,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  type Camera,
  type Scene,
  type Texture,
  type WebGLRenderer,
} from "three";
import { dolly, ease } from "./dolly";
import { camp } from "./materials";
import { palette } from "./palette";

// Postprocessing for the high tier (step 3.6), written small instead of pulling in a library (the
// 3D chunk has a 350 KB budget): the scene renders into a half-float target, a dual-filter bloom
// chain (a bright pass, three downsamples, three additive upsamples) gives the fire, the lantern
// and the sparks their glow, and one composite pass adds the bloom, grades the picture (cool
// shadows, warm highlights, a touch of contrast), darkens the corners and lays a fine moving
// grain. The grade and the vignette give way as the camera settles on the journal, so the pages
// meet the paper of the next chapter in their own color. Taking over the frame (useFrame with a
// positive priority) stops R3F's own render.

const LEVELS = 4;

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const prefilter = /* glsl */ `
  uniform sampler2D tMap;
  uniform float uThreshold;
  varying vec2 vUv;
  void main() {
    vec3 c = texture2D(tMap, vUv).rgb;
    float b = max(c.r, max(c.g, c.b));
    // soft knee: pixels ease in above the threshold rather than switching on
    float soft = clamp(b - uThreshold + 0.25, 0.0, 0.5);
    soft = soft * soft / 0.5;
    float w = max(soft, b - uThreshold) / max(b, 1e-4);
    gl_FragColor = vec4(c * w, 1.0);
  }
`;

const down = /* glsl */ `
  uniform sampler2D tMap;
  uniform vec2 uTexel;
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel;
    vec3 s = texture2D(tMap, vUv).rgb * 4.0;
    s += texture2D(tMap, vUv - o).rgb;
    s += texture2D(tMap, vUv + o).rgb;
    s += texture2D(tMap, vUv + vec2(o.x, -o.y)).rgb;
    s += texture2D(tMap, vUv - vec2(o.x, -o.y)).rgb;
    gl_FragColor = vec4(s / 8.0, 1.0);
  }
`;

const up = /* glsl */ `
  uniform sampler2D tMap;
  uniform vec2 uTexel;
  varying vec2 vUv;
  void main() {
    vec2 o = uTexel;
    vec3 s = texture2D(tMap, vUv + vec2(-o.x * 2.0, 0.0)).rgb;
    s += texture2D(tMap, vUv + vec2(-o.x, o.y)).rgb * 2.0;
    s += texture2D(tMap, vUv + vec2(0.0, o.y * 2.0)).rgb;
    s += texture2D(tMap, vUv + vec2(o.x, o.y)).rgb * 2.0;
    s += texture2D(tMap, vUv + vec2(o.x * 2.0, 0.0)).rgb;
    s += texture2D(tMap, vUv + vec2(o.x, -o.y)).rgb * 2.0;
    s += texture2D(tMap, vUv + vec2(0.0, -o.y * 2.0)).rgb;
    s += texture2D(tMap, vUv + vec2(-o.x, -o.y)).rgb * 2.0;
    gl_FragColor = vec4(s / 12.0, 1.0);
  }
`;

const composite = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform float uBloom;
  uniform float uGrade;
  uniform float uVignette;
  uniform float uGrain;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uShadow;
  uniform vec3 uHighlight;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec3 c = texture2D(tScene, vUv).rgb + texture2D(tBloom, vUv).rgb * uBloom;
    // grade in a perceptual space (the scene target is linear)
    vec3 g = pow(max(c, 0.0), vec3(1.0 / 2.2));
    float l = dot(g, vec3(0.2126, 0.7152, 0.0722));
    // split toning: shadows lean to the night, highlights to the fire
    vec3 toned = g * mix(uShadow, vec3(1.0), smoothstep(0.05, 0.35, l));
    toned = mix(toned, toned * uHighlight, smoothstep(0.5, 1.0, l));
    // a little contrast, on the displayable range only (the fire runs brighter than white)
    vec3 k = clamp(toned, 0.0, 1.0);
    toned += (k * k * (3.0 - 2.0 * k) - k) * 0.15;
    g = mix(g, toned, uGrade);
    // corners fall into the dark
    vec2 d = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    g *= mix(1.0, smoothstep(1.15, 0.3, length(d)), uVignette);
    // a fine grain that moves with the frame
    g += (hash(vUv * uResolution + fract(uTime * 7.0) * 91.7) - 0.5) * 0.028 * uGrain;
    gl_FragColor = vec4(pow(max(g, 0.0), vec3(2.2)), 1.0);
    #include <colorspace_fragment>
  }
`;

function target(w: number, h: number, { depth = false, samples = 0 } = {}) {
  return new WebGLRenderTarget(Math.max(1, w), Math.max(1, h), {
    type: HalfFloatType,
    depthBuffer: depth,
    samples,
  });
}

/** A multiplier that tints toward a palette color without changing brightness. */
function tint(name: keyof typeof palette, strength: number) {
  const c = new Color(palette[name]);
  const l = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  return c.multiplyScalar(1 / l).lerp(new Color(1, 1, 1), 1 - strength);
}

/** The passes and their targets. Plain three.js, driven from PostFX's frame loop. */
class Pipeline {
  private quad: Mesh;
  private ortho = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private mats: Record<
    "prefilter" | "down" | "up" | "composite",
    ShaderMaterial
  >;
  private scene: WebGLRenderTarget | null = null;
  private chain: WebGLRenderTarget[] = [];

  constructor() {
    const g = new BufferGeometry();
    // one triangle that covers the screen
    g.setAttribute(
      "position",
      new BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
    );
    this.quad = new Mesh(g);
    this.quad.frustumCulled = false;
    const make = (
      fragmentShader: string,
      uniforms: Record<string, { value: unknown }>,
    ) =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader,
        uniforms,
        depthTest: false,
        depthWrite: false,
        blending: NoBlending,
      });
    this.mats = {
      prefilter: make(prefilter, {
        tMap: { value: null },
        uThreshold: { value: 0.72 },
      }),
      down: make(down, {
        tMap: { value: null },
        uTexel: { value: new Vector2() },
      }),
      up: make(up, { tMap: { value: null }, uTexel: { value: new Vector2() } }),
      composite: make(composite, {
        tScene: { value: null },
        tBloom: { value: null },
        uBloom: { value: 0.9 },
        uGrade: { value: 1 },
        uVignette: { value: 0.45 },
        uGrain: { value: 1 },
        uTime: camp.uTime,
        uResolution: { value: new Vector2() },
        uShadow: { value: tint("night-blue", 0.18) },
        uHighlight: { value: tint("ember-glow", 0.12) },
      }),
    };
    this.mats.up.blending = AdditiveBlending;
  }

  /** The targets follow the drawing buffer; supersampled screens skip MSAA. */
  resize(w: number, h: number, dpr: number) {
    if (this.scene?.width === w && this.scene.height === h) return;
    this.disposeTargets();
    this.scene = target(w, h, { depth: true, samples: dpr >= 1.5 ? 0 : 4 });
    this.chain = Array.from({ length: LEVELS }, (_, i) =>
      target(w >> (i + 1), h >> (i + 1)),
    );
  }

  private pass(
    gl: WebGLRenderer,
    material: ShaderMaterial,
    out: WebGLRenderTarget | null,
    map?: Texture,
  ) {
    if (map) material.uniforms.tMap.value = map;
    this.quad.material = material;
    gl.setRenderTarget(out);
    gl.render(this.quad, this.ortho);
  }

  render(gl: WebGLRenderer, scene: Scene, camera: Camera, settle: number) {
    const { chain } = this;
    if (!this.scene) return;
    gl.setRenderTarget(this.scene);
    gl.render(scene, camera);

    this.pass(gl, this.mats.prefilter, chain[0], this.scene.texture);
    for (let i = 1; i < LEVELS; i++) {
      this.mats.down.uniforms.uTexel.value.set(
        1 / chain[i - 1].width,
        1 / chain[i - 1].height,
      );
      this.pass(gl, this.mats.down, chain[i], chain[i - 1].texture);
    }
    const autoClear = gl.autoClear;
    gl.autoClear = false;
    for (let i = LEVELS - 1; i > 0; i--) {
      this.mats.up.uniforms.uTexel.value.set(
        1 / chain[i].width,
        1 / chain[i].height,
      );
      this.pass(gl, this.mats.up, chain[i - 1], chain[i].texture);
    }
    gl.autoClear = autoClear;

    const u = this.mats.composite.uniforms;
    u.tScene.value = this.scene.texture;
    u.tBloom.value = chain[0].texture;
    u.uGrade.value = settle;
    u.uVignette.value = 0.45 * settle;
    u.uResolution.value.set(this.scene.width, this.scene.height);
    this.pass(gl, this.mats.composite, null);
  }

  private disposeTargets() {
    this.scene?.dispose();
    this.chain.forEach((t) => t.dispose());
  }

  dispose() {
    this.disposeTargets();
    Object.values(this.mats).forEach((m) => m.dispose());
    this.quad.geometry.dispose();
  }
}

export function PostFX() {
  const pipeline = useRef<Pipeline | null>(null);

  useEffect(() => {
    const p = new Pipeline();
    pipeline.current = p;
    return () => {
      pipeline.current = null;
      p.dispose();
    };
  }, []);

  useFrame(({ gl, scene, camera, size, viewport }) => {
    const p = pipeline.current;
    if (!p) return;
    p.resize(
      Math.round(size.width * viewport.dpr),
      Math.round(size.height * viewport.dpr),
      viewport.dpr,
    );
    // grade and vignette ease off as the camera settles on the pages
    p.render(gl, scene, camera, 1 - ease(0.62, 0.95, dolly.progress));
  }, 1);

  return null;
}
