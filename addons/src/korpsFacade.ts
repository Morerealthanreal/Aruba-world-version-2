// Korps Politie (OSM bld 4074): force cream plaster on the live wall shader and static meshes.
import { type Material, type Object3D, type Mesh } from "three";
import type { AGame } from "./env";
import { chainPatch } from "./nightLights";
import { tintKorpsPolitieShell } from "./bldFacadeTint";

/** Axis-aligned bounds — only bld 4074 occupies this box in r_17_21. */
export const KORPS_MIN_X = 6361.0;
export const KORPS_MAX_X = 6406.5;
export const KORPS_MIN_Z = 9294.0;
export const KORPS_MAX_Z = 9341.5;
/** #f5f3ef — landmarks.json korps_politie_sn.wall */
const CREAM_GLSL = "vec3(0.961, 0.953, 0.937)";

function patchBuildingMat(mat: Material, key: string) {
  chainPatch(mat, key, (s) => {
    if (!s.fragmentShader.includes("vWP")) return;
    if (!s.fragmentShader.includes("awKorpsHit")) {
      s.fragmentShader = s.fragmentShader.replace(
        "#include <common>",
        `#include <common>
float awKorpsHit(vec2 xz) {
  if (xz.x < ${KORPS_MIN_X} || xz.x > ${KORPS_MAX_X} || xz.y < ${KORPS_MIN_Z} || xz.y > ${KORPS_MAX_Z}) return 0.0;
  return 1.0;
}`,
      );
    }
    if (s.fragmentShader.includes("diffuseColor.rgb = col;")) {
      s.fragmentShader = s.fragmentShader.replace(
        "diffuseColor.rgb = col;",
        `if (awKorpsHit(vWP.xz) > 0.5) col = ${CREAM_GLSL};
  diffuseColor.rgb = col;`,
      );
    }
  });
}

function patchMaterial(mat: Material | undefined, key: string) {
  if (mat) patchBuildingMat(mat, key);
}

/** Tint every Korps shell mesh in a built region (incl. site "walls" chunks and batched cells). */
export function tintKorpsMeshesUnder(root: Object3D) {
  root.traverse((o) => {
    const m = o as Mesh;
    if (!m.isMesh || !m.geometry) return;
    const nm = m.name || "";
    if (
      nm.startsWith("bld:") ||
      nm.startsWith("aw:bb:") ||
      nm === "walls" ||
      nm === "wall"
    ) {
      tintKorpsPolitieShell(m.geometry, nm.startsWith("aw:bb:") ? "bld:wall" : nm);
    }
  });
}

function tryInstall(g: AGame) {
  const b = g.real?.buildings;
  if (!b?.wall) return false;
  patchMaterial(b.wall, "korps-wall-v2");
  patchMaterial(b.roof, "korps-roof-v2");
  patchMaterial((b as { tiles?: Material }).tiles, "korps-tiles-v2");
  const mon = g.real as { mon?: { wallMat?: Material } };
  patchMaterial(mon.mon?.wallMat, "korps-mon-wall-v2");
  return true;
}

export function installKorpsFacade(g: AGame) {
  if (tryInstall(g)) return;
  let n = 0;
  const t = setInterval(() => {
    if (tryInstall(g) || ++n > 200) clearInterval(t);
  }, 100);
}
