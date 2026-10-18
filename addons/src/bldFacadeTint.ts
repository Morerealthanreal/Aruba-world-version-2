// Recolor OSM building shells when batched (vertex colors are baked per cell).
import type { BufferAttribute, BufferGeometry } from "three";
import { KORPS_MAX_X, KORPS_MAX_Z, KORPS_MIN_X, KORPS_MIN_Z } from "./korpsFacade";

/** #f5f3ef */
const CREAM = { r: 245 / 255, g: 243 / 255, b: 239 / 255 };

function geoOverlapsKorps(geo: BufferGeometry) {
  const pos = geo.getAttribute("position") as BufferAttribute | undefined;
  if (!pos?.count) return false;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  return maxX >= KORPS_MIN_X && minX <= KORPS_MAX_X && maxZ >= KORPS_MIN_Z && minZ <= KORPS_MAX_Z;
}

/** Cream wall/trim/tiles/roof/site-wall cells for Korps Politie (batched or merged meshes). */
export function tintKorpsPolitieShell(geo: BufferGeometry, meshName: string) {
  if (meshName === "bld:kit" || meshName === "bld:MeshBasicMaterial") return;
  const shell =
    meshName.startsWith("bld:") ||
    meshName.startsWith("aw:bb:") ||
    meshName === "walls" ||
    meshName === "wall";
  if (!shell) return;
  if (!geoOverlapsKorps(geo)) return;
  const col = geo.getAttribute("color") as BufferAttribute | undefined;
  if (!col || col.itemSize < 3) return;
  for (let i = 0; i < col.count; i++) {
    col.setXYZ(i, CREAM.r, CREAM.g, CREAM.b);
  }
  col.needsUpdate = true;
}
