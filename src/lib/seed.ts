// Deterministic "randomness" from a string seed, so server and client render the same tilt,
// jitter and wear (DESIGN.md, The Tilt Rule).

/** FNV-1a hash of the seed, mapped to [0, 1). */
export function seeded(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 4294967296;
}

/** A value in [-max, max] from the seed, rounded to 2 decimals. */
export function seededRange(seed: string, max: number) {
  return Math.round((seeded(seed) * 2 - 1) * max * 100) / 100;
}

/** A small seeded sequence generator for jittered shapes. */
export function seededSequence(seed: string) {
  let n = 0;
  return () => seeded(`${seed}:${n++}`);
}
