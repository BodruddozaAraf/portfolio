"use client";

import { useMemo } from "react";
import { BufferAttribute, BufferGeometry, PlaneGeometry } from "three";
import { groundHeight, ridgeHeight } from "./land";
import { campMaterial, tone } from "./materials";
import { RIDGES } from "./world";

// The hillside under the camp and the ridges behind it, each a silhouette a little paler than the
// one in front, with mist pooled at its foot.

function groundGeometry() {
  const g = new PlaneGeometry(96, 30, 192, 60);
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, -3);
  const p = g.attributes.position as BufferAttribute;
  for (let i = 0; i < p.count; i++)
    p.setY(i, groundHeight(p.getX(i), p.getZ(i)));
  g.computeVertexNormals();
  return g;
}

/** A ridge as a curtain facing the camp: its top edge is the crest line, uv.y is 1 at the top. */
function ridgeGeometry(i: number) {
  const r = RIDGES[i];
  const width = Math.abs(r.z) * 3.4;
  const columns = 220;
  const pos = new Float32Array((columns + 1) * 2 * 3);
  const uv = new Float32Array((columns + 1) * 2 * 2);
  const normal = new Float32Array((columns + 1) * 2 * 3);
  const index: number[] = [];
  for (let c = 0; c <= columns; c++) {
    const x = (c / columns - 0.5) * width;
    const top = ridgeHeight(i, x);
    // the crest leans back a little, so the moon catches it
    pos.set([x, top, r.z - 2, x, r.base, r.z], c * 6);
    uv.set([c / columns, 1, c / columns, 0], c * 4);
    normal.set([0, 0.35, 0.94, 0, 0, 1], c * 6);
    if (c < columns) {
      const a = c * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("uv", new BufferAttribute(uv, 2));
  g.setAttribute("normal", new BufferAttribute(normal, 3));
  g.setIndex(index);
  return g;
}

export function Terrain() {
  const ground = useMemo(
    () => ({
      geometry: groundGeometry(),
      material: campMaterial(
        tone("night", { mix: "leather", amount: 0.32, scale: 1.25 }),
        {
          defines: { PATCHY: "" },
        },
      ),
    }),
    [],
  );
  const ridges = useMemo(
    () =>
      RIDGES.map((r, i) => ({
        geometry: ridgeGeometry(i),
        material: campMaterial(
          tone("night", { mix: "night-blue", amount: 0.3 + i * 0.15 }),
          { haze: r.haze, lowMist: 0.3 },
        ),
      })),
    [],
  );
  return (
    <group>
      <mesh geometry={ground.geometry} material={ground.material} />
      {ridges.map((r, i) => (
        <mesh key={i} geometry={r.geometry} material={r.material} />
      ))}
    </group>
  );
}
