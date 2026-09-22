# 08 — Assets

Every third-party asset MUST be logged in the table at the bottom with source and license.
Only CC0 / OFL / MIT / CC-BY (with attribution in the footer credits) are allowed.
**Never** use anything ripped from RDR2 or other games.

## Sources (approved)
| Type | Source | License |
|---|---|---|
| Fonts | Google Fonts (Rye, Sancreek, Homemade Apple, Caveat, IM Fell English, Libre Baskerville, Special Elite, JetBrains Mono) | OFL / Apache |
| Textures (paper, leather, wood) | Poly Haven, ambientCG, Textures.com free tier (check license) | CC0 |
| HDRI (night sky lighting) | Poly Haven | CC0 |
| 3D models | Poly Haven, Quaternius, Kenney, Sketchfab (filter: CC0 / CC-BY, downloadable), or made in Blender | CC0 / CC-BY |
| Sound | freesound.org (CC0 filter), Sonniss GDC bundles, Pixabay audio | CC0 / royalty-free |
| Icons / tech logos | Simple Icons (redrawn in ink style) | CC0 |
| Sketch illustrations | **Public-domain 19th-century engravings/illustrations** (Wikimedia Commons PD, Library of Congress, Old Book Illustrations, Internet Archive; verify PD status per image), processed to a graphite/ink look and traced to stroke SVG with potrace for draw-on (D28). Placeholders (e.g. picsum) until sourced | Public domain |

## Needed assets list
| ID | Asset | Format target | Phase | Status |
|---|---|---|---|---|
| A01 | Paper texture (tileable, warm) | AVIF/WebP ≤ 150 KB | 1 | todo |
| A02 | Leather texture | AVIF ≤ 150 KB + normal map (3D) | 1/3 | todo |
| A03 | Wood planks (bounty board) | AVIF ≤ 150 KB | 1 | todo |
| A04 | Map illustration (original, stylized) | SVG | 2 | todo |
| A05 | Sketch set: campfire, desk/laptop, football, satchel items, horse, lantern | SVG line art | 1–2 | todo |
| A06 | Portrait (sketch-style) for the wanted poster | SVG or high-contrast PNG | 1 | placeholder first (`picsum.photos/seed/wanted-portrait/...`, desaturated); real photo → sketch later (D13) |
| A07 | Hero fallback render | AVIF 1920w + 960w | 3 (placeholder in 1) | todo |
| A08 | Campfire, logs, stones | glTF (meshopt) | 3 | todo |
| A09 | Horse (low-poly, idle anim) | glTF ≤ 800 KB | 3 | todo |
| A10 | Journal (closed + opening anim) | glTF ≤ 500 KB | 3 | todo |
| A11 | Bedroll, lantern, pines, rocks | glTF | 3 | todo |
| A12 | Night HDRI | 1k HDR / KTX2 | 3 | todo |
| A13 | Audio: fire crackle, wind, page flip, pin tack, stamp, telegraph, heartbeat, harmonica sting | OGG + MP3, mono, ≤ 200 KB each | 4 | todo |
| A14 | Favicon / monogram "B.A." stamp | SVG + PNG set | 1 | todo |
| A15 | Resume PDF | PDF | 1 | todo (public, D14) |
| A16 | Jack The Jelli store screenshots | AVIF | 1 | ❗ Araf to provide (D18) |

## Pipeline
- Images: export AVIF + WebP; use `next/image`.
- 3D: Blender → glTF → `gltf-transform optimize` (meshopt + KTX2) → `gltfjsx` for typed
  components.
- Audio: normalize, trim silence, mono, OGG primary + MP3 fallback.
- SVG: run through SVGO; keep `stroke` paths (not fills) for draw-on animation.

## Attribution log
| Asset ID | File path | Source URL | Author | License |
|---|---|---|---|---|
| (none yet) | | | | |
