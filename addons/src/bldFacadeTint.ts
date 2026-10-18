// Recolor OSM building shells when batched (vertex colors are already baked per cell).
import type { BufferAttribute, BufferGeometry } from "three";

/** Korps Politie Aruba (OSM bld 4074) — white/cream street facade for Night Watcher. */
const KORPS_POLY: [number, number][] = [
  [6362.0, 9309.3],
  [6377.6, 9311.4],
  [6377.2, 9314.6],
  [6372.1, 9314.0],
  [6368.8, 9338.4],
  [6387.2, 9340.9],
  [6390.4, 9316.9],
  [6383.8, 9316.0],
  [6384.3, 9312.8],
  [6403.7, 9315.4],
  [6405.8, 9300.2],
  [6364.0, 9294.7],
];

const CREAM = { r: 0.9, g: 0.89, b: 0.87 };

function inside(poly: [number, number][], x: number, z: number) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i];
    const [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) hit = !hit;
  }
  return hit;
}

function cellCenter(geo: BufferGeometry) {
  const pos = geo.getAttribute("position") as BufferAttribute;
  if (!pos?.count) return null;
  let x = 0;
  let z = 0;
  const n = pos.count;
  for (let i = 0; i < n; i++) {
    x += pos.getX(i);
    z += pos.getZ(i);
  }
  return { x: x / n, z: z / n };
}

/** Lighten wall/trim/tiles cells inside the Korps Politie footprint (hc >= 0.5 in wall shader). */
export function tintKorpsPolitieShell(geo: BufferGeometry, meshName: string) {
  if (!meshName.startsWith("bld:") || meshName === "bld:kit" || meshName === "bld:roof") return;
  const c = cellCenter(geo);
  if (!c || !inside(KORPS_POLY, c.x, c.z)) return;
  const col = geo.getAttribute("color") as BufferAttribute | undefined;
  if (!col || col.itemSize < 3) return;
  for (let i = 0; i < col.count; i++) {
    col.setXYZ(i, CREAM.r, CREAM.g, CREAM.b);
  }
  col.needsUpdate = true;
}
