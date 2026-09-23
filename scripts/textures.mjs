// Generates the journal's tileable material textures (original, deterministic, no sources).
//   node scripts/textures.mjs
// Writes PNGs to .textures-tmp/, then converts them to WebP in public/textures/ with ffmpeg.
// Each texture is a transparent overlay: the page's own token color shows through it.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { deflateSync } from "node:zlib";

const TMP = ".textures-tmp";
const OUT = "public/textures";

// --- tiny PNG encoder (RGBA8) ---------------------------------------------------------
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function png(w, h, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- tileable value noise --------------------------------------------------------------
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/** Noise lattice with periods px, py, sampled in tile space [0, 1). Wraps seamlessly. */
function lattice(px, py, seed) {
  const r = mulberry32(seed);
  const v = Float32Array.from({ length: px * py }, r);
  return (u, w) => {
    const x = u * px;
    const y = w * py;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = smooth(x - x0);
    const fy = smooth(y - y0);
    const at = (i, j) =>
      v[(((j % py) + py) % py) * px + (((i % px) + px) % px)];
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx;
    return a + (b - a) * fy;
  };
}
function fbm(px, py, octaves, seed) {
  const layers = Array.from({ length: octaves }, (_, o) =>
    lattice(px << o, py << o, seed + o * 101),
  );
  const norm = layers.reduce((s, _, o) => s + 0.5 ** o, 0);
  return (u, w) => layers.reduce((s, f, o) => s + f(u, w) * 0.5 ** o, 0) / norm;
}
const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));

function render(size, shade) {
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = shade(x / size, y / size, x, y);
      const i = (y * size + x) * 4;
      buf[i] = r;
      buf[i + 1] = g;
      buf[i + 2] = b;
      buf[i + 3] = Math.round(clamp(a) * 255);
    }
  }
  return png(size, size, buf);
}

// --- materials -------------------------------------------------------------------------

// Aged paper: broad foxing stains, a soft cloudy tooth, and scattered fibre flecks.
function paper() {
  const size = 512;
  const stain = fbm(3, 3, 5, 11);
  const cloud = fbm(24, 24, 3, 29);
  const tooth = lattice(256, 256, 47);
  const fleckR = mulberry32(83);
  const flecks = new Float32Array(size * size);
  for (let n = 0; n < 380; n++) {
    const cx = fleckR() * size;
    const cy = fleckR() * size;
    const len = 1 + fleckR() * 5;
    const ang = fleckR() * Math.PI;
    const strength = 0.08 + fleckR() * 0.2;
    for (let t = 0; t <= len; t += 0.5) {
      const px = Math.floor(cx + Math.cos(ang) * t + size) % size;
      const py = Math.floor(cy + Math.sin(ang) * t + size) % size;
      flecks[py * size + px] = Math.max(flecks[py * size + px], strength);
    }
  }
  return render(size, (u, w, x, y) => {
    const s = clamp((stain(u, w) - 0.5) * 2.2); // only the darker half stains
    const c = cloud(u, w);
    const t = tooth(u, w);
    const a =
      s * 0.16 +
      (c - 0.5) * 0.1 +
      0.05 +
      (t - 0.5) * 0.07 +
      flecks[y * size + x];
    // stains lean warm brown, tooth and flecks lean ink
    const mix = clamp(s * 1.4);
    return [
      Math.round(58 + 40 * mix),
      Math.round(42 + 22 * mix),
      Math.round(26 + 6 * mix),
      a,
    ];
  });
}

// Leather: pebble grain lit from the top left, with darker creases and wear.
function leather() {
  const size = 320;
  const pebble = fbm(40, 40, 3, 3);
  const crease = fbm(5, 7, 4, 9);
  const wear = fbm(2, 2, 4, 17);
  const e = 1 / size;
  return render(size, (u, w) => {
    const h = (a, b) => pebble(a, b) + Math.abs(crease(a, b) - 0.5) * -0.35;
    const dx = h(u + e, w) - h(u - e, w);
    const dy = h(u, w + e) - h(u, w - e);
    const light = clamp(0.5 - (dx + dy) * 6, 0, 1); // light from top left
    const creaseDark = clamp(0.12 - Math.abs(crease(u, w) - 0.5)) * 4.5;
    const worn = clamp((wear(u, w) - 0.55) * 3);
    if (light > 0.5) return [243, 222, 190, (light - 0.5) * 0.28 + worn * 0.08];
    return [22, 12, 6, (0.5 - light) * 0.42 + creaseDark * 0.22];
  });
}

// Film grain: fine, even specks. Used on a fixed overlay at low opacity.
function grain() {
  const size = 160;
  const r = mulberry32(41);
  return render(size, () => {
    const v = r();
    return v > 0.5
      ? [255, 244, 222, (v - 0.5) * 0.5]
      : [20, 15, 10, (0.5 - v) * 0.7];
  });
}

// Stamp wear: an alpha mask for rubber stamps. Mostly solid ink, with patchy gaps where the stamp
// met the paper unevenly, and pinholes of paper grain. Used as CSS mask-image, so only alpha counts.
function stampWear() {
  const size = 256;
  const patches = fbm(4, 4, 4, 61);
  const grainy = lattice(128, 128, 67);
  return render(size, (u, w) => {
    const gap = clamp((patches(u, w) - 0.6) * 4.5); // broad worn areas
    const pin = grainy(u, w) > 0.8 ? 0.85 : 0; // pinholes
    return [255, 255, 255, clamp(1 - gap * 0.75 - pin)];
  });
}

// Weathered wood planks for the bounty board: four planks per tile, long grain along x, a few
// knots, dark seams between planks. Overlay on the leather color.
function wood() {
  const size = 512;
  const grainA = fbm(2, 32, 4, 71);
  const grainB = fbm(1, 90, 3, 73);
  const stainW = fbm(3, 3, 3, 79);
  const fibre = lattice(6, 384, 83);
  const knotR = mulberry32(97);
  const knots = Array.from({ length: 5 }, () => ({
    x: knotR(),
    y: knotR(),
    r: 0.012 + knotR() * 0.02,
  }));
  return render(size, (u, w) => {
    const plank = Math.floor(w * 4);
    const inPlank = w * 4 - plank;
    const shift = plank * 0.37; // each plank's grain is offset
    let g =
      grainA((u + shift) % 1, w) * 0.7 + grainB((u + shift * 2) % 1, w) * 0.3;
    g += (fibre((u + shift) % 1, w) - 0.5) * 0.35; // fine fibres
    for (const k of knots) {
      const dx = Math.min(Math.abs(u - k.x), 1 - Math.abs(u - k.x)) * 0.4;
      const dy = Math.min(Math.abs(w - k.y), 1 - Math.abs(w - k.y));
      const d = Math.hypot(dx, dy) / k.r;
      if (d < 1)
        g -= (1 - d) ** 1.5 * 0.45; // dark burl
      else if (d < 2.4)
        g += (fibre(u, (w + d * 0.01) % 1) - 0.5) * 0.3 * (2.4 - d); // grain bends round it
    }
    const seam = inPlank < 0.018 || inPlank > 0.985;
    const bevel = inPlank < 0.05 ? (0.05 - inPlank) * 6 : 0; // light catches the top edge
    const weather = clamp((stainW(u, w) - 0.45) * 2);
    if (seam) return [14, 8, 4, 0.85];
    const light = clamp((g - 0.5) * 2.6 + bevel * 0.6 + weather * 0.25, -1, 1);
    return light > 0
      ? [236, 214, 178, light * 0.34]
      : [18, 10, 5, -light * 0.5];
  });
}

// Provenance: record the origin inside the file (impeccable embed-prompt), when the tool exists.
function embedOrigin(file, name) {
  const cli = path.join(
    ".claude/skills/impeccable/scripts",
    process.platform === "win32" ? "impeccable.cmd" : "impeccable",
  );
  if (!existsSync(cli)) return;
  const origin = `Original procedural texture '${name}', generated by scripts/textures.mjs (tileable value noise, no third-party source). Transparent overlay tinted by the page token color.`;
  try {
    // .cmd launchers need a shell on Windows, so the prompt is quoted by hand there
    const win = process.platform === "win32";
    execFileSync(
      cli,
      ["embed-prompt", file, "--prompt", win ? `"${origin}"` : origin],
      { stdio: "ignore", shell: win },
    );
  } catch {
    console.warn(`could not embed provenance in ${file}`);
  }
}

mkdirSync(TMP, { recursive: true });
mkdirSync(OUT, { recursive: true });
for (const [name, make, quality] of [
  ["paper", paper, 70],
  ["leather", leather, 62],
  ["grain", grain, 45],
  ["stamp-wear", stampWear, 60],
  ["wood", wood, 66],
]) {
  const src = path.join(TMP, `${name}.png`);
  writeFileSync(src, make());
  execFileSync("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-i",
    src,
    "-c:v",
    "libwebp",
    "-quality",
    String(quality),
    "-pix_fmt",
    "yuva420p",
    path.join(OUT, `${name}.webp`),
  ]);
  const out = path.join(OUT, `${name}.webp`);
  embedOrigin(out, name);
  console.log(`wrote ${out}`);
}
rmSync(TMP, { recursive: true, force: true });
