// Straw hats, caps, and sunglasses for the beach crowd.
// Taken from the #147 hat meshes (shared geometry, no textures) and parented
// to the Quaternius Head bone. Colour is a vertex color on the oil-light shader.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, Float32BufferAttribute,
  Mesh, SphereGeometry, TorusGeometry, type Object3D,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { oilMaterial } from "./npcOil";

export type BeachHat = "none" | "straw" | "cap";

const STRAW = 0xe6c98a;
const CAP = 0x3d4a5c;
const LENS = 0x1a1c1e;
const GOLD = 0xd4af6a;
const BELT = 0x2a241c;

const faceCache = new Map<number, { features: BufferGeometry; lips: BufferGeometry }>();
const hairCache = new Map<number, { volume: BufferGeometry; braid: BufferGeometry }>();
let neckGeo: BufferGeometry | null = null;
let beltGeo: BufferGeometry | null = null;

let strawGeo: BufferGeometry | null = null;
let capGeo: BufferGeometry | null = null;
let glassGeo: BufferGeometry | null = null;

function paint(geo: BufferGeometry, hex: number) {
  const color = new Color(hex);
  const count = geo.getAttribute("position").count;
  const data = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    data[i * 3] = color.r;
    data[i * 3 + 1] = color.g;
    data[i * 3 + 2] = color.b;
  }
  geo.setAttribute("color", new Float32BufferAttribute(data, 3));
  return geo;
}

function strawGeometry() {
  if (strawGeo) return strawGeo;
  const brim = new CylinderGeometry(0.15, 0.16, 0.012, 12);
  brim.translate(0, 0.24, 0.02);
  const crown = new CylinderGeometry(0.07, 0.078, 0.05, 10);
  crown.translate(0, 0.265, 0.01);
  const merged = mergeGeometries([brim, crown], false);
  brim.dispose();
  if (merged) crown.dispose();
  strawGeo = paint(merged ?? crown, STRAW);
  return strawGeo;
}

function capGeometry() {
  if (capGeo) return capGeo;
  const crown = new CylinderGeometry(0.078, 0.084, 0.045, 10);
  crown.translate(0, 0.235, 0.02);
  const brim = new BoxGeometry(0.16, 0.01, 0.08);
  brim.translate(0, 0.22, 0.09);
  const merged = mergeGeometries([crown, brim], false);
  crown.dispose();
  if (merged) brim.dispose();
  capGeo = paint(merged ?? brim, CAP);
  return capGeo;
}

function glassGeometry() {
  if (glassGeo) return glassGeo;
  const left = new BoxGeometry(0.048, 0.028, 0.006);
  left.translate(-0.032, 0.12, 0.1);
  const right = new BoxGeometry(0.048, 0.028, 0.006);
  right.translate(0.032, 0.12, 0.1);
  const bridge = new BoxGeometry(0.016, 0.006, 0.005);
  bridge.translate(0, 0.123, 0.098);
  const merged = mergeGeometries([left, right, bridge], false);
  left.dispose();
  right.dispose();
  if (merged) bridge.dispose();
  glassGeo = paint(merged ?? bridge, LENS);
  return glassGeo;
}

function wear(parent: Object3D, geo: BufferGeometry, name: string) {
  const mesh = new Mesh(geo, oilMaterial());
  mesh.name = name;
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  parent.add(mesh);
}

function faceFor(skin: number) {
  let found = faceCache.get(skin);
  if (found) return found;
  const nose = new BoxGeometry(0.016, 0.038, 0.018);
  nose.translate(0, 0.108, 0.128);
  const browL = new BoxGeometry(0.038, 0.007, 0.008);
  browL.translate(-0.03, 0.15, 0.108);
  const browR = new BoxGeometry(0.038, 0.007, 0.008);
  browR.translate(0.03, 0.15, 0.108);
  const features = mergeGeometries([nose, browL, browR], false);
  nose.dispose();
  browL.dispose();
  browR.dispose();
  const lip = new BoxGeometry(0.034, 0.009, 0.01);
  lip.translate(0, 0.074, 0.12);
  const lipColor = new Color(skin).multiplyScalar(0.72).getHex();
  found = {
    features: paint(features ?? nose, skin),
    lips: paint(lip, lipColor),
  };
  faceCache.set(skin, found);
  return found;
}

function hairFor(hex: number) {
  let found = hairCache.get(hex);
  if (found) return found;
  const a = new SphereGeometry(0.055, 8, 6);
  a.translate(0.045, 0.2, -0.05);
  const b = new SphereGeometry(0.06, 8, 6);
  b.translate(-0.04, 0.22, -0.055);
  const c = new SphereGeometry(0.042, 6, 5);
  c.translate(0.0, 0.25, -0.02);
  const volume = mergeGeometries([a, b, c], false);
  a.dispose();
  b.dispose();
  c.dispose();
  const beads: BufferGeometry[] = [];
  for (let i = 0; i < 7; i++) {
    const bead = new SphereGeometry(0.028 - i * 0.002, 6, 5);
    bead.translate((i % 2 === 0 ? -0.008 : 0.008), 0.2 - i * 0.05, -0.09);
    beads.push(bead);
  }
  const braid = mergeGeometries(beads, false);
  for (const bead of beads) bead.dispose();
  found = {
    volume: paint(volume ?? a, hex),
    braid: paint(braid ?? beads[0], hex),
  };
  hairCache.set(hex, found);
  return found;
}

function necklaceGeometry() {
  if (neckGeo) return neckGeo;
  const ring = new TorusGeometry(0.064, 0.006, 5, 12);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.02, 0.015);
  const pendant = new BoxGeometry(0.012, 0.016, 0.006);
  pendant.translate(0, -0.01, 0.078);
  const merged = mergeGeometries([ring, pendant], false);
  ring.dispose();
  if (merged) pendant.dispose();
  neckGeo = paint(merged ?? pendant, GOLD);
  return neckGeo;
}

function beltGeometry() {
  if (beltGeo) return beltGeo;
  const ring = new TorusGeometry(0.15, 0.012, 6, 14);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.11, 0);
  beltGeo = paint(ring, BELT);
  return beltGeo;
}

/** Hats, sunglasses, face, hair, and jewelry. Shared meshes, no textures. */
export function attachBeachWear(root: Object3D, index: number, skin: number, hair: number, female: boolean) {
  const head = root.getObjectByName("Head");
  const chest = root.getObjectByName("Chest");
  const hips = root.getObjectByName("Hips");
  if (head) {
    const face = faceFor(skin);
    wear(head, face.features, "aw:face");
    wear(head, face.lips, "aw:lips");
    const hat: BeachHat = index % 5 === 4 ? "none" : index % 2 === 0 ? "straw" : "cap";
    if (hat === "straw") wear(head, strawGeometry(), "aw:hat");
    else if (hat === "cap") wear(head, capGeometry(), "aw:hat");
    if (index % 3 !== 2) wear(head, glassGeometry(), "aw:sunglasses");
    if (female) {
      const locks = hairFor(hair);
      wear(head, locks.volume, "aw:hair");
      wear(head, necklaceGeometry(), "aw:necklace");
      if (chest) wear(chest, locks.braid, "aw:braid");
    }
  }
  if (hips) wear(hips, beltGeometry(), "aw:belt");
}
