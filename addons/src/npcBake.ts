// CC0 Quaternius bodies, recolored in code to modern Aruba beach clothes.
// Fully opaque: shirts, shorts, cover-ups, sundress colors. No photo textures.
// Torso shirts carry a darker collar, a hem, sleeve cuffs, and one band in the shorts color.
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
  /** Open the crew neck into a fitted tank. Casual woman only. */
  tank?: boolean;
  /** Shorter, wider body and gray hair. Still fully clothed. */
  older?: boolean;
};

// Bodies live one file each under src/outfits. Skin, hair, and clothes stay
// distinct on purpose. The casual woman keeps the white tank and denim.
// Extra colorways are older adults and men's clothes, each in its own file.
// Nobody wears a suit, a hard hat, or a mohawk.
export { BEACH_OUTFITS } from "./outfits/index";

const SOURCE_MAPS = ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "emissiveMap"];

/** Crowd and kid rigs share these buffers for the whole session. A region
 *  unload must not drop them, or the next time the camera reaches a beach
 *  the GPU count climbs while the scene count does not. */
export function holdGeometry(geo: BufferGeometry | null | undefined) {
  const held = geo as (BufferGeometry & { __awHeld?: boolean }) | null | undefined;
  if (!held || held.__awHeld) return;
  held.__awHeld = true;
  held.dispose = () => { /* the NPC pool still draws this */ };
}

/** The baked body uses the oil shader. Drop the GLB textures so a later draw cannot upload them. */
function releaseSourceMaterial(mesh: Mesh) {
  const mats = !mesh.material ? [] : Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const mat of mats) {
    const bag = mat as unknown as Record<string, { isTexture?: boolean; dispose?: () => void } | undefined> & { dispose?: () => void };
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
  tank: boolean;
  older: boolean;
};

function materialName(mesh: Mesh): string {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  return mat?.name || "";
}

function surfaceKind(name: string): number {
  if (name === "Skin" || name === "Skin_Darker") return 1;
  if (HAIR.has(name)) return 3;
  if (EYES.has(name)) return 5;
  return 2;
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

function yRange(geo: BufferGeometry) {
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  return { min: box.min.y, max: box.max.y };
}

// A torso shell, not a zipper or a backpack. The band is only painted here.
function torsoShirt(geo: BufferGeometry) {
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  const wide = box.max.x - box.min.x > 0.2;
  const tall = box.max.y - box.min.y > 0.28 && box.max.y > 1.3 && box.min.y < 1.4;
  return wide && tall;
}

// The shirt shell has no skin under it, so a cut neckline is a hole.
// Slim the shoulder caps and paint the scoop and outer shoulders as skin.
// The straps stay cloth. The surface stays closed and it still animates.
// A torso shirt also gets a darker collar, a hem, sleeve cuffs, and one
// band in the shorts color, so the cloth reads up close. No new texture.
function paintTop(geo: BufferGeometry, clothHex: number, skinHex: number, accentHex: number, tank: boolean) {
  const cloth = new Color(clothHex);
  const skin = new Color(skinHex);
  const accent = new Color(accentHex);
  const collarTone = cloth.clone().multiplyScalar(0.55);
  const hemTone = cloth.clone().multiplyScalar(0.62);
  const cuffTone = cloth.clone().multiplyScalar(0.48);
  const shirt = torsoShirt(geo);
  const hemLine = shirt ? geo.boundingBox!.min.y + 0.04 : 0;
  const pos = geo.getAttribute("position");
  const data = new Float32Array(pos.count * 3);
  const kinds = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const ax = Math.abs(x);
    if (tank && y > 1.34 && ax > 0.12) {
      x = Math.sign(x) * (0.12 + (ax - 0.12) * 0.4);
      pos.setX(i, x);
    }
    // A real cut would be a hole. Keep the shell closed and paint a small
    // scoop. Kind 0 stays on the flat oil light: kind 1 on this panel reads
    // as an orange bib.
    const scoop = tank && z > 0.045 && ax < 0.04 && y > 1.5;
    const shoulder = tank && ax > 0.175 && y > 1.48;
    const bare = scoop || shoulder;
    const chest = shirt && !bare && y > 1.28 && y < 1.36 && z > 0.02 && ax < 0.14;
    const collar = shirt && !tank && !bare && y > 1.46 && z > 0.03 && ax < 0.1;
    // The hem is the bottom edge of the shell, including the tank.
    // Cuffs are the outer lip of a short sleeve. A tank has no sleeve.
    const hem = shirt && !bare && y < hemLine;
    const cuff = shirt && !tank && !bare && ax > 0.25 && y > 1.38 && y < 1.5;
    const tone = bare ? skin : cuff ? cuffTone : hem ? hemTone : chest ? accent : collar ? collarTone : cloth;
    data[i * 3] = tone.r;
    data[i * 3 + 1] = tone.g;
    data[i * 3 + 2] = tone.b;
    kinds[i] = bare ? 0 : 2;
  }
  pos.needsUpdate = true;
  geo.setAttribute("color", new Float32BufferAttribute(data, 3));
  geo.setAttribute("awKind", new Float32BufferAttribute(kinds, 1));
  if (tank) geo.computeVertexNormals();
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
    if (hex === outfit.top) paintTop(geo, hex, outfit.skin, outfit.bottom, outfit.tank === true);
    else paint(geo, hex, surfaceKind(name));
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
    tank: outfit.tank === true,
    older: outfit.older === true,
  };
}
