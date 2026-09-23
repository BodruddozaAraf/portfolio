// The torn page (docs/05-sections.md section 5, step 3.7): the thesis's pipeline as a picture. A
// hole is burnt through the engraving where its campfire smoulders, and as the reader scrolls the
// missing region comes back the way the model rebuilds an image: coarse quantized patches first
// (the VQ tokens), then finer, truer cells (the latent mapper), then the fine detail injected at
// every scale, until the plate is whole again. Plain WebGL, no three.js: one full-canvas pass.
// Loaded on demand by ReconstructMoment; returns null where WebGL is unavailable.

const vertex = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uP;
  uniform float uAspect;
  uniform vec2 uCenter;
  varying vec2 vUv;

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
    for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.1; a *= 0.5; }
    return s;
  }
  vec3 quant(vec3 c, float levels) { return floor(c * levels + 0.5) / levels; }

  void main() {
    vec2 uv = vUv;
    vec3 plate = texture2D(uTex, uv).rgb;

    // the burn: a ragged hole round the fire, its rim charred
    vec2 q = (uv - uCenter) * vec2(uAspect, 1.0);
    float edge = length(q) + (fbm(uv * 7.0) - 0.5) * 0.14 + (fbm(uv * 23.0) - 0.5) * 0.04;
    float R = 0.22;
    float hole = 1.0 - smoothstep(R - 0.003, R + 0.003, edge);
    float rim = smoothstep(0.018, 0.0, abs(edge - R));
    float scorch = smoothstep(R + 0.07, R, edge) * (1.0 - hole);

    float pTok = smoothstep(0.12, 0.42, uP);
    float pRef = smoothstep(0.42, 0.7, uP);
    float pDet = smoothstep(0.7, 0.95, uP);

    // tokens: coarse cells from a small codebook, arriving in no particular order
    vec2 gridA = vec2(uAspect, 1.0) * 13.0;
    vec2 cellA = floor(uv * gridA);
    vec3 tok = quant(texture2D(uTex, (cellA + 0.5) / gridA).rgb, 3.0);
    float tokOn = step(hash(cellA), pTok * 1.02);
    // refined: cells four times finer, truer tones
    vec2 gridB = gridA * 4.0;
    vec2 cellB = floor(uv * gridB);
    vec3 ref = quant(texture2D(uTex, (cellB + 0.5) / gridB).rgb, 8.0);
    float refOn = step(hash(cellB + 17.0), pRef * 1.02);
    // detail: the fine scales, injected patch by patch until nothing is left to add
    float detOn = smoothstep(0.0, 0.08, pDet * 1.1 - fbm(uv * 30.0) * 0.9 + 0.02);

    vec3 recon = vec3(1.0); // an empty hole: the paper of the page beneath
    recon = mix(recon, tok, tokOn);
    recon = mix(recon, ref, refOn);
    recon = mix(recon, plate, clamp(detOn + step(0.999, uP), 0.0, 1.0));

    vec3 color = mix(plate, recon, hole);
    // the char fades as the page heals
    float heal = 1.0 - pDet;
    color *= 1.0 - scorch * 0.55 * heal;
    color *= 1.0 - rim * 0.85 * heal;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export type Reconstruction = {
  /** Draws the page at progress 0 (burnt) to 1 (whole). */
  draw: (progress: number) => void;
  /** Matches the canvas to its box. */
  resize: () => void;
  dispose: () => void;
};

export function createReconstruction(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  center: [number, number],
): Reconstruction | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uP = gl.getUniformLocation(program, "uP");
  const uAspect = gl.getUniformLocation(program, "uAspect");
  gl.uniform2f(
    gl.getUniformLocation(program, "uCenter"),
    center[0],
    1 - center[1],
  );
  let last = 0;

  const draw = (progress: number) => {
    last = progress;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uP, progress);
    gl.uniform1f(uAspect, canvas.width / Math.max(1, canvas.height));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w === canvas.width && h === canvas.height) return;
    canvas.width = w;
    canvas.height = h;
    draw(last);
  };

  return {
    draw,
    resize,
    dispose: () => {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
