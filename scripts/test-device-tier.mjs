// Checks the device tier guess (src/lib/device-tier.ts) against real GPU names.
//   node --experimental-strip-types --no-warnings scripts/test-device-tier.mjs
import assert from "node:assert/strict";
import { tierFor } from "../src/lib/device-tier.ts";

const phone = (renderer, memory = 8) =>
  tierFor({ coarse: true, phone: true, cores: 2, memory, renderer });
const desktop = (renderer, cores = 8, memory = 8) =>
  tierFor({ coarse: false, phone: false, cores, memory, renderer });

// phones that run the camp
assert.equal(phone("Apple GPU"), "mid", "iPhone (Safari)");
assert.equal(
  phone("ANGLE (Qualcomm, Adreno (TM) 740, OpenGL ES 3.2)"),
  "mid",
  "Adreno 740",
);
assert.equal(phone("Adreno (TM) 650"), "mid", "Adreno 650");
assert.equal(phone("Mali-G78 MP14"), "mid", "Mali-G78");
assert.equal(phone("Mali-G710 MC10"), "mid", "Mali-G710");
assert.equal(phone("Samsung Xclipse 920"), "mid", "Xclipse");
assert.equal(phone("Immortalis-G715"), "mid", "Immortalis");
// phones that get the picture
assert.equal(phone("Adreno (TM) 610"), "low", "Adreno 610");
assert.equal(phone("Mali-G52 MC2"), "low", "Mali-G52");
assert.equal(phone("PowerVR Rogue GE8320"), "low", "PowerVR");
assert.equal(phone("Apple GPU", 2), "low", "a phone reporting 2 GB");
assert.equal(phone(null), "low", "no WebGL2");
// desktops, unchanged
assert.equal(
  desktop("ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11)"),
  "high",
  "RTX",
);
assert.equal(
  desktop("ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11)"),
  "mid",
  "Intel UHD",
);
assert.equal(
  desktop("ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)))"),
  "low",
  "SwiftShader",
);
assert.equal(
  desktop("ANGLE (NVIDIA, GeForce GTX 1050)", 2),
  "low",
  "two cores",
);

console.log("device tiers: ok");
