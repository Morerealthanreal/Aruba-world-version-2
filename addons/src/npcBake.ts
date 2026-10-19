// CC0 Quaternius bodies, recolored in code to modern Aruba beach clothes.
// Fully opaque: shirts, shorts, cover-ups, sundress colors. No photo textures.
import {
  AnimationClip, BufferGeometry, Color, Float32BufferAttribute,
  Mesh, SkinnedMesh, type Object3D,
} from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { oilMaterial } from "./npcOil";

export type BeachOutfit = {
  file: string;
  skin: number;
  hair: number;
  top: number;
  bottom: number;
  shoe: number;
};

// Six different bodies. Skin tones are distinct on purpose.
export const BEACH_OUTFITS: readonly BeachOutfit[] = [
  { file: "people/w-casual.glb", skin: 0xc68642, hair: 0x8a3a22, top: 0xf7f4ee, bottom: 0x2f5d96, shoe: 0xc4a574 },
  { file: "people/m-casual.glb", skin: 0x8d5524, hair: 0x1a1412, top: 0x7eb6d9, bottom: 0xe6d2a8, shoe: 0x8a6244 },
  { file: "people/m-hoodie.glb", skin: 0xe0ac69, hair: 0x4a3020, top: 0xf3efe4, bottom: 0x3d6f8f, shoe: 0xc4a574 },
  { file: "people/w-worker.glb", skin: 0xf1c27d, hair: 0x8a5a32, top: 0xf7f3ea, bottom: 0xf2c14e, shoe: 0xb08968 },
  { file: "people/w-adventurer.glb", skin: 0x6b3a22, hair: 0x241816, top: 0xfffaf4, bottom: 0xd98b6a, shoe: 0xc4a574 },
  { file: "people/m-adventurer.glb", skin: 0xa86b45, hair: 0x2a1c14, top: 0x3e8f7a, bottom: 0xd8c3a5, shoe: 0x6e5344 },
];

const SOURCE_MAPS = ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "emissiveMap"];

/** The baked body uses the oil shader. Drop the GLB textures so a later draw cannot upload them. */
function releaseSourceMaterial(mesh: Mesh) {
  const mats = !mesh.material ? [] : Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const mat of mats) {
    const bag = mat as unknown as { [key: string]: { isTexture?: boolean; dispose?: () => void } | undefined; dispose?: () => void };
    for (const key of SOURCE_MAPS) {
      const tex = bag[key];
      if (tex?.isTexture) tex.dispose?.();
    }
    bag.dispose?.();
  }
}

const HAIR = new Set(["Hair", "Hair_Brown", "Hair_Blond", "Eyebrows", "Moustache", "DarkBrown", "Brown"]);
const EYES = new Set(["Eye", "Eyes"]);

export type BakedPerson = {
  proto: Object3D;
  idle: AnimationClip;
  walk: AnimationClip;
  triangles: number;
  skin: number;
  hair: number;
  female: boolean;
};

function materialName(mesh: Mesh): string {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return mat?.name || "";
}

function paint(geo: BufferGeometry, hex: number, kind: number) {
  const color = new Color(hex);
  const n = geo.getAttribute("position").count;
  const data = new Float32Array(n * 3);
  const kinds = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    data[i * 3] = color.r;
    data[i * 3 + 1] = color.g;
    data[i * 3 + 2] = color.b;
    kinds[i] = kind;
  }
  geo.setAttribute("color", new Float32BufferAttribute(data, 3));
  geo.setAttribute("awKind", new Float32BufferAttribute(kinds, 1));
}

function surfaceKind(name: string): number {
  if (name === "Skin" || name === "Skin_Darker") return 1;
  if (HAIR.has(name)) return 3;
  if (EYES.has(name)) return 5;
  return 2;
}

function yRange(geo: BufferGeometry) {
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  return { min: box.min.y, max: box.max.y };
}

function clothColor(outfit: BeachOutfit, name: string, min: number, max: number): number | null {
  if (name === "Skin_Darker") return new Color(outfit.skin).multiplyScalar(0.86).getHex();
  if (name === "Skin") return outfit.skin;
  if (EYES.has(name)) return 0x1b130f;
  if (name === "Worker_Yellow" && min > 1.6) return null; // hard hat, not a beach hat
  if (min > 1.64 && !HAIR.has(name)) return null;
  if (HAIR.has(name) && min > 1.45) return outfit.hair;
  if (max < 0.32 || (min < 0.08 && max < 0.5)) return outfit.shoe;
  if (max < 1.2 && min < 0.55) return outfit.bottom;
  return outfit.top;
}

export function bakePerson(gl: GLTF, outfit: BeachOutfit): BakedPerson {
  const clip = (name: string) => {
    const found = gl.animations.find((animation) => animation.name === name);
    if (!found) throw new Error(`beach crowd missing ${name} on ${outfit.file}`);
    return found;
  };
  const parts: BufferGeometry[] = [];
  let skeleton: SkinnedMesh["skeleton"] | null = null;
  let bind: SkinnedMesh["bindMatrix"] | null = null;
  const doomed: Mesh[] = [];
  gl.scene.updateWorldMatrix(true, true);
  gl.scene.traverse((object) => {
    const mesh = object as SkinnedMesh;
    if (!mesh.isSkinnedMesh) return;
    doomed.push(mesh);
    const name = materialName(mesh);
    const src = mesh.geometry;
    const range = yRange(src);
    const hex = clothColor(outfit, name, range.min, range.max);
    if (hex == null) return;
    const geo = src.clone();
    paint(geo, hex, surfaceKind(name));
    if (!geo.getAttribute("skinIndex") || !geo.getAttribute("skinWeight") || !geo.getIndex()) return;
    for (const key of Object.keys(geo.attributes)) {
      if (key !== "position" && key !== "normal" && key !== "uv" && key !== "skinIndex" && key !== "skinWeight" && key !== "color" && key !== "awKind") {
        geo.deleteAttribute(key);
      }
    }
    if (!geo.getAttribute("uv")) {
      const count = geo.getAttribute("position").count;
      geo.setAttribute("uv", new Float32BufferAttribute(new Float32Array(count * 2), 2));
    }
    if (!geo.getAttribute("normal")) geo.computeVertexNormals();
    parts.push(geo);
    skeleton = mesh.skeleton;
    bind = mesh.bindMatrix;
  });
  if (!parts.length || !skeleton || !bind) throw new Error(`beach crowd empty ${outfit.file}`);
  const merged = mergeGeometries(parts, false);
  if (!merged) throw new Error(`beach crowd merge ${outfit.file}`);
  merged.clearGroups();
  for (const geo of parts) geo.dispose();
  const skin = new SkinnedMesh(merged, oilMaterial());
  skin.name = "aw:beach-person";
  skin.bind(skeleton, bind);
  skin.castShadow = false;
  skin.receiveShadow = false;
  skin.frustumCulled = false;
  merged.computeBoundingSphere();
  if (merged.boundingSphere) {
    merged.boundingSphere.center.set(0, 0.95, 0);
    merged.boundingSphere.radius = Math.max(merged.boundingSphere.radius, 1.7);
  }
  const triangles = (merged.index ? merged.index.count : merged.getAttribute("position").count) / 3;
  for (const mesh of doomed) {
    mesh.parent?.remove(mesh);
    mesh.geometry.dispose();
    releaseSourceMaterial(mesh);
  }
  gl.scene.add(skin);
  return {
    proto: gl.scene,
    idle: clip("Idle"),
    walk: clip("Walk"),
    triangles,
    skin: outfit.skin,
    hair: outfit.hair,
    female: outfit.file.includes("/w-"),
  };
}
