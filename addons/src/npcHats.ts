// Two shared hat meshes. Colour is a material property, so a hat adds no texture.
import {
  BufferGeometry, CylinderGeometry, Matrix4, Mesh, MeshStandardMaterial, BoxGeometry,
  type Object3D,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { NpcHat } from "./npcCast";

let strawGeo: BufferGeometry | null = null;
let capGeo: BufferGeometry | null = null;
let strawMat: MeshStandardMaterial | null = null;
let capMat: MeshStandardMaterial | null = null;

export function attachHat(root: Object3D, hat: NpcHat) {
  if (hat === "none") return;
  const head = root.getObjectByName("head");
  if (!head || head.children.some((child) => child.name === "aw:hat")) return;
  const mesh = new Mesh(hat === "straw" ? strawGeometry() : capGeometry(), hat === "straw" ? strawMaterial() : capMaterial());
  mesh.name = "aw:hat";
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  head.add(mesh);
}

function strawGeometry() {
  if (strawGeo) return strawGeo;
  const brim = new CylinderGeometry(0.16, 0.16, 0.012, 12);
  brim.translate(0, 0.15, 0);
  const crown = new CylinderGeometry(0.068, 0.074, 0.05, 10);
  crown.translate(0, 0.18, 0);
  const merged = mergeGeometries([brim, crown], false);
  if (merged) {
    brim.dispose();
    crown.dispose();
    strawGeo = merged;
  } else strawGeo = brim;
  return strawGeo;
}

function capGeometry() {
  if (capGeo) return capGeo;
  const crown = new CylinderGeometry(0.07, 0.078, 0.048, 10);
  crown.translate(0, 0.162, 0.01);
  const brim = new BoxGeometry(0.15, 0.01, 0.08);
  brim.applyMatrix4(new Matrix4().makeTranslation(0, 0.148, 0.07));
  const merged = mergeGeometries([crown, brim], false);
  if (merged) {
    crown.dispose();
    brim.dispose();
    capGeo = merged;
  } else capGeo = crown;
  return capGeo;
}

function strawMaterial() {
  if (!strawMat) {
    strawMat = new MeshStandardMaterial({ color: 0xe6c98a, roughness: 0.84, metalness: 0 });
  }
  return strawMat;
}

function capMaterial() {
  if (!capMat) {
    capMat = new MeshStandardMaterial({ color: 0x3d4a5c, roughness: 0.8, metalness: 0 });
  }
  return capMat;
}
