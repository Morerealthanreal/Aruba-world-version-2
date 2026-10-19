// Beach accessories for the Quaternius crowd. Shared geometry, vertex colors,
// no textures. Placed in Head / Neck / Chest / Hips local space (measured on
// the CC0 rigs): the face sits near z 0.09 and the eyes near y 0.15.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, Float32BufferAttribute,
  Mesh, SphereGeometry, TorusGeometry, type Object3D,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { oilMaterial } from "./npcOil";

const STRAW = 0xe6c98a;
const CAP = 0x3d4a5c;
const LENS = 0x14161a;
const GOLD = 0xd4af6a;
const BELT = 0x2a241c;
const EYE = 0xf4f1ea;
const PUPIL = 0x1a120e;

const faceCache = new Map<number, BufferGeometry>();
const hairCache = new Map<number, { volume: BufferGeometry; braid: BufferGeometry }>();
let neckGeo: BufferGeometry | null = null;
let beltGeo: BufferGeometry | null = null;
let buckleGeo: BufferGeometry | null = null;
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
  const brim = new CylinderGeometry(0.168, 0.176, 0.012, 14);
  brim.translate(0, 0.2, 0.02);
  const crown = new CylinderGeometry(0.078, 0.086, 0.07, 10);
  crown.translate(0, 0.232, 0.01);
  const merged = mergeGeometries([brim, crown], false);
  brim.dispose();
  if (merged) crown.dispose();
  strawGeo = paint(merged ?? crown, STRAW);
  return strawGeo;
}

function capGeometry() {
  if (capGeo) return capGeo;
  const crown = new CylinderGeometry(0.082, 0.09, 0.05, 10);
  crown.translate(0, 0.205, 0.015);
  const brim = new BoxGeometry(0.17, 0.01, 0.09);
  brim.translate(0, 0.186, 0.1);
  const merged = mergeGeometries([crown, brim], false);
  crown.dispose();
  if (merged) brim.dispose();
  capGeo = paint(merged ?? brim, CAP);
  return capGeo;
}

function glassGeometry() {
  if (glassGeo) return glassGeo;
  // Eye line is y 0.15. Hair bangs reach z 0.11, so the lenses sit just past that.
  const left = new BoxGeometry(0.058, 0.034, 0.008);
  left.translate(-0.036, 0.152, 0.122);
  const right = new BoxGeometry(0.058, 0.034, 0.008);
  right.translate(0.036, 0.152, 0.122);
  const bridge = new BoxGeometry(0.018, 0.008, 0.006);
  bridge.translate(0, 0.156, 0.118);
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
  const found = faceCache.get(skin);
  if (found) return found;
  const tone = new Color(skin);
  const nose = paint(new BoxGeometry(0.016, 0.032, 0.016).translate(0, 0.112, 0.108), tone.getHex());
  const brow = tone.clone().multiplyScalar(0.45).getHex();
  const browL = paint(new BoxGeometry(0.04, 0.008, 0.008).translate(-0.032, 0.176, 0.108), brow);
  const browR = paint(new BoxGeometry(0.04, 0.008, 0.008).translate(0.032, 0.176, 0.108), brow);
  const lip = paint(new BoxGeometry(0.036, 0.01, 0.008).translate(0, 0.078, 0.104), tone.clone().multiplyScalar(0.55).getHex());
  const eyeL = paint(new SphereGeometry(0.014, 8, 6).translate(-0.032, 0.15, 0.1), EYE);
  const eyeR = paint(new SphereGeometry(0.014, 8, 6).translate(0.032, 0.15, 0.1), EYE);
  const pupilL = paint(new SphereGeometry(0.007, 6, 5).translate(-0.032, 0.15, 0.112), PUPIL);
  const pupilR = paint(new SphereGeometry(0.007, 6, 5).translate(0.032, 0.15, 0.112), PUPIL);
  const parts = [nose, browL, browR, lip, eyeL, eyeR, pupilL, pupilR];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  const geo = merged ?? nose;
  faceCache.set(skin, geo);
  return geo;
}

function hairFor(hex: number) {
  const found = hairCache.get(hex);
  if (found) return found;
  // Volume sits beside and behind the scalp, not as a bun on the crown.
  const locks = [
    new SphereGeometry(0.062, 8, 6).translate(-0.09, 0.06, -0.05),
    new SphereGeometry(0.058, 8, 6).translate(0.088, 0.04, -0.04),
    new SphereGeometry(0.07, 8, 6).translate(0, 0.08, -0.15),
    new SphereGeometry(0.05, 7, 5).translate(0, -0.04, -0.12),
  ];
  const volume = mergeGeometries(locks, false);
  for (const lock of locks) lock.dispose();
  // Chest space: from the nape (y 0.36, z -0.16) down the back to the waist.
  const beads: BufferGeometry[] = [];
  const count = 16;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const bead = new SphereGeometry(0.038 - t * 0.014, 7, 5);
    const x = i % 2 === 0 ? -0.012 : 0.012;
    bead.translate(x, 0.36 - i * 0.042, -0.155 - t * 0.02);
    beads.push(bead);
  }
  const braid = mergeGeometries(beads, false);
  for (const bead of beads) bead.dispose();
  const made = {
    volume: paint(volume ?? locks[0], hex),
    braid: paint(braid ?? beads[0], hex),
  };
  hairCache.set(hex, made);
  return made;
}

function necklaceGeometry() {
  if (neckGeo) return neckGeo;
  const ring = new TorusGeometry(0.07, 0.006, 6, 14);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, -0.03, 0.02);
  const pendant = new BoxGeometry(0.016, 0.022, 0.007);
  pendant.translate(0, -0.07, 0.078);
  const merged = mergeGeometries([ring, pendant], false);
  ring.dispose();
  if (merged) pendant.dispose();
  neckGeo = paint(merged ?? pendant, GOLD);
  return neckGeo;
}

function beltGeometry() {
  if (beltGeo) return beltGeo;
  const ring = new TorusGeometry(0.132, 0.011, 6, 16);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.17, 0);
  beltGeo = paint(ring, BELT);
  return beltGeo;
}

function buckleGeometry() {
  if (buckleGeo) return buckleGeo;
  const box = new BoxGeometry(0.03, 0.02, 0.008);
  box.translate(0, 0.17, 0.128);
  buckleGeo = paint(box, GOLD);
  return buckleGeo;
}

/** Face, hair, hats, sunglasses, and jewelry. Shared meshes, no textures. */
export function attachBeachWear(root: Object3D, index: number, skin: number, hair: number, female: boolean) {
  const head = root.getObjectByName("Head");
  const neck = root.getObjectByName("Neck");
  const chest = root.getObjectByName("Chest");
  const hips = root.getObjectByName("Hips");
  if (head) {
    wear(head, faceFor(skin), "aw:face");
    // Women keep the hair clear. Men wear a straw hat or a cap.
    if (!female && index % 3 !== 2) {
      wear(head, index % 2 === 0 ? strawGeometry() : capGeometry(), "aw:hat");
    }
    if (female || index % 2 === 0) wear(head, glassGeometry(), "aw:sunglasses");
    if (female) {
      const locks = hairFor(hair);
      wear(head, locks.volume, "aw:hair");
      if (chest) wear(chest, locks.braid, "aw:braid");
    }
  }
  if (female && neck) wear(neck, necklaceGeometry(), "aw:necklace");
  if (hips) {
    wear(hips, beltGeometry(), "aw:belt");
    wear(hips, buckleGeometry(), "aw:buckle");
  }
}
