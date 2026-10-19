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

function paint(geo: BufferGeometry, hex: number, kind = 0) {
  const color = new Color(hex);
  const count = geo.getAttribute("position").count;
  const data = new Float32Array(count * 3);
  const kinds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    data[i * 3] = color.r;
    data[i * 3 + 1] = color.g;
    data[i * 3 + 2] = color.b;
    kinds[i] = kind;
  }
  geo.setAttribute("color", new Float32BufferAttribute(data, 3));
  geo.setAttribute("awKind", new Float32BufferAttribute(kinds, 1));
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
  strawGeo = paint(merged ?? crown, STRAW, 2);
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
  capGeo = paint(merged ?? brim, CAP, 2);
  return capGeo;
}

function glassGeometry() {
  if (glassGeo) return glassGeo;
  // The eye line on this rig is below the old forehead bar. A flattened
  // lens sits on the eyes, with a bridge and short arms so it reads as glasses.
  const left = new SphereGeometry(0.036, 10, 8);
  left.scale(1.2, 0.68, 0.22);
  left.translate(-0.04, 0.112, 0.12);
  const right = new SphereGeometry(0.036, 10, 8);
  right.scale(1.2, 0.68, 0.22);
  right.translate(0.04, 0.112, 0.12);
  const bridge = new BoxGeometry(0.02, 0.006, 0.006);
  bridge.translate(0, 0.118, 0.114);
  const armL = new BoxGeometry(0.008, 0.006, 0.055);
  armL.translate(-0.074, 0.116, 0.086);
  const armR = new BoxGeometry(0.008, 0.006, 0.055);
  armR.translate(0.074, 0.116, 0.086);
  const parts = [left, right, bridge, armL, armR];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  glassGeo = paint(merged ?? left, LENS, 5);
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
  const nose = paint(new BoxGeometry(0.014, 0.028, 0.016).translate(0, 0.086, 0.112), tone.getHex(), 1);
  const brow = tone.clone().multiplyScalar(0.32).getHex();
  const browL = paint(new BoxGeometry(0.05, 0.009, 0.01).translate(-0.036, 0.148, 0.124), brow, 1);
  const browR = paint(new BoxGeometry(0.05, 0.009, 0.01).translate(0.036, 0.148, 0.124), brow, 1);
  const lip = paint(new BoxGeometry(0.052, 0.016, 0.014).translate(0, 0.062, 0.13), 0xb85a58, 1);
  const eyeL = paint(new SphereGeometry(0.016, 8, 6).translate(-0.034, 0.108, 0.104), EYE, 0);
  const eyeR = paint(new SphereGeometry(0.016, 8, 6).translate(0.034, 0.108, 0.104), EYE, 0);
  const pupilL = paint(new SphereGeometry(0.008, 6, 5).translate(-0.034, 0.108, 0.116), PUPIL, 5);
  const pupilR = paint(new SphereGeometry(0.008, 6, 5).translate(0.034, 0.108, 0.116), PUPIL, 5);
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
  // A cap, side locks, and a fringe above the sunglasses. The fringe stays
  // above the eye line so the lenses and the mouth stay visible.
  const bangs = new SphereGeometry(0.055, 8, 6);
  bangs.scale(1.7, 0.45, 0.55);
  bangs.translate(0, 0.175, 0.07);
  const leftLock = new CylinderGeometry(0.028, 0.016, 0.22, 6);
  leftLock.translate(-0.095, -0.02, 0.01);
  const rightLock = new CylinderGeometry(0.028, 0.016, 0.22, 6);
  rightLock.translate(0.095, -0.02, 0.01);
  const locks = [
    new SphereGeometry(0.078, 8, 6).translate(0, 0.11, -0.04),
    new SphereGeometry(0.09, 8, 6).translate(0, 0.04, -0.13),
    new SphereGeometry(0.055, 7, 5).translate(-0.08, 0.05, -0.02),
    new SphereGeometry(0.055, 7, 5).translate(0.08, 0.05, -0.02),
    bangs,
    leftLock,
    rightLock,
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
    volume: paint(volume ?? locks[0], hex, 3),
    braid: paint(braid ?? beads[0], hex, 3),
  };
  hairCache.set(hex, made);
  return made;
}

function necklaceGeometry() {
  if (neckGeo) return neckGeo;
  const ring = new TorusGeometry(0.055, 0.007, 6, 16);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.01, 0.04);
  neckGeo = paint(ring, GOLD, 4);
  return neckGeo;
}

let crossGeo: BufferGeometry | null = null;
let phoneGeo: BufferGeometry | null = null;

function phoneGeometry() {
  if (phoneGeo) return phoneGeo;
  // Wrist space. A closed phone, screen facing out, held at the side.
  const body = new BoxGeometry(0.038, 0.07, 0.006);
  body.translate(0, -0.08, 0.03);
  const screen = new BoxGeometry(0.03, 0.056, 0.004);
  screen.translate(0, -0.08, 0.034);
  const paintedBody = paint(body, 0x1c1e22, 5);
  const paintedScreen = paint(screen, 0x8eb4c8, 0);
  const merged = mergeGeometries([paintedBody, paintedScreen], false);
  if (merged) {
    body.dispose();
    screen.dispose();
  }
  phoneGeo = merged ?? paintedBody;
  return phoneGeo;
}


function crossGeometry() {
  if (crossGeo) return crossGeo;
  // Chest space. The shirt front is about z 0.12, so the cross sits on the cloth.
  const upright = new BoxGeometry(0.014, 0.078, 0.01);
  upright.translate(0, 0.2, 0.145);
  const bar = new BoxGeometry(0.046, 0.012, 0.01);
  bar.translate(0, 0.218, 0.15);
  const parts = [upright, bar];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  crossGeo = paint(merged ?? upright, GOLD, 4);
  return crossGeo;
}

function beltGeometry() {
  if (beltGeo) return beltGeo;
  const ring = new TorusGeometry(0.132, 0.011, 6, 16);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.17, 0);
  beltGeo = paint(ring, BELT, 5);
  return beltGeo;
}

function buckleGeometry() {
  if (buckleGeo) return buckleGeo;
  const box = new BoxGeometry(0.03, 0.02, 0.008);
  box.translate(0, 0.17, 0.128);
  buckleGeo = paint(box, GOLD, 4);
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
  if (female && chest) wear(chest, crossGeometry(), "aw:cross");
  const wrist = root.getObjectByName("WristR");
  if (female && wrist && index % 2 === 0) wear(wrist, phoneGeometry(), "aw:phone");
  if (hips) {
    wear(hips, beltGeometry(), "aw:belt");
    wear(hips, buckleGeometry(), "aw:buckle");
  }
}
