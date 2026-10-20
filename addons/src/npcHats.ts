// Beach accessories for the Quaternius crowd. Shared geometry, vertex colors,
// no textures. Placed in Head / Neck / Chest / Hips local space (measured on
// the CC0 rigs): the face sits near z 0.09 and the eyes near y 0.112.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, Float32BufferAttribute,
  Mesh, Quaternion, SphereGeometry, TorusGeometry, Vector3, type Object3D,
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

/** A stretched sphere in head space. Faces stay one merged mesh per skin tone. */
function roundPart(
  radius: number,
  sx: number,
  sy: number,
  sz: number,
  x: number,
  y: number,
  z: number,
  hex: number,
  kind: number,
  width = 8,
  height = 6,
) {
  const geo = new SphereGeometry(radius, width, height);
  geo.scale(sx, sy, sz);
  geo.translate(x, y, z);
  return paint(geo, hex, kind);
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
  // The eye line on this rig is y 0.112, not the forehead. A flattened lens
  // rests on the eyes, with a bridge and short arms.
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

function browArc(side: number, hex: number) {
  const geo = new SphereGeometry(0.024, 8, 5);
  geo.scale(1.05, 0.22, 0.32);
  geo.rotateZ(side * -0.38);
  geo.translate(side * 0.036, 0.148, 0.12);
  return paint(geo, hex, 1);
}

function eyeParts(side: number, lid: number) {
  const x = side * 0.034;
  return [
    roundPart(0.015, 1.12, 0.78, 0.5, x, 0.108, 0.102, EYE, 0, 10, 8),
    roundPart(0.0066, 1, 1, 0.4, x, 0.107, 0.111, 0x5a341c, 5, 8, 6),
    roundPart(0.0034, 1, 1, 0.65, x, 0.107, 0.114, PUPIL, 5, 6, 4),
    // A thin hood sunk into the top of the eye, not a bar in front of it.
    roundPart(0.014, 1.15, 0.18, 0.46, x, 0.118, 0.104, lid, 1, 8, 4),
  ];
}

function faceFor(skin: number) {
  const found = faceCache.get(skin);
  if (found) return found;
  const tone = new Color(skin);
  const skinHex = tone.getHex();
  const brow = tone.clone().multiplyScalar(0.32).getHex();
  const shadow = tone.clone().multiplyScalar(0.42).getHex();
  const lip = tone.clone().lerp(new Color(0xc45b62), 0.58);
  const upper = lip.clone().multiplyScalar(0.84).getHex();
  const lower = lip.getHex();
  // Same anchors as the old slabs: nose near y 0.086, mouth near y 0.06,
  // eyes near y 0.108. Sunglasses hide the eyes except on odd-index men.
  // The mouth is on this shared mesh, so every walker gets it.
  const parts = [
    roundPart(0.009, 0.75, 1.65, 0.85, 0, 0.094, 0.109, skinHex, 1),
    roundPart(0.012, 1, 0.8, 1.08, 0, 0.08, 0.113, skinHex, 1),
    roundPart(0.005, 1.3, 0.45, 0.7, -0.008, 0.073, 0.118, shadow, 5, 6, 4),
    roundPart(0.005, 1.3, 0.45, 0.7, 0.008, 0.073, 0.118, shadow, 5, 6, 4),
    browArc(-1, brow),
    browArc(1, brow),
    roundPart(0.02, 1.2, 0.36, 0.4, 0, 0.061, 0.128, upper, 1, 8, 5),
    roundPart(0.019, 1.28, 0.46, 0.44, 0, 0.053, 0.129, lower, 1, 8, 6),
    roundPart(0.015, 1.05, 0.08, 0.22, 0, 0.057, 0.133, 0x3a1618, 5, 8, 4),
    ...eyeParts(-1, skinHex),
    ...eyeParts(1, skinHex),
  ];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  const geo = merged ?? parts[0];
  geo.clearGroups();
  faceCache.set(skin, geo);
  return geo;
}

const BRAID_UP = new Vector3(0, 1, 0);
const BRAID_A = new Vector3();
const BRAID_B = new Vector3();
const BRAID_DIR = new Vector3();
const BRAID_MID = new Vector3();
const BRAID_QUAT = new Quaternion();

function strandSegment(ax: number, ay: number, az: number, bx: number, by: number, bz: number, radius: number) {
  BRAID_A.set(ax, ay, az);
  BRAID_B.set(bx, by, bz);
  BRAID_DIR.subVectors(BRAID_B, BRAID_A);
  const len = Math.max(0.004, BRAID_DIR.length());
  const geo = new CylinderGeometry(radius, radius, len * 1.08, 6, 1, true);
  BRAID_QUAT.setFromUnitVectors(BRAID_UP, BRAID_DIR.normalize());
  geo.applyQuaternion(BRAID_QUAT);
  BRAID_MID.addVectors(BRAID_A, BRAID_B).multiplyScalar(0.5);
  geo.translate(BRAID_MID.x, BRAID_MID.y, BRAID_MID.z);
  return geo;
}

/** Flat three-strand plait in chest space. One strand crosses in front while the other two sit wide. */
function braidPoint(strand: number, t: number) {
  const y = 0.2 + (-0.3 - 0.2) * t;
  const phase = t * Math.PI * 2 * 5 + strand * (Math.PI * 2 / 3);
  const across = Math.asin(Math.max(-1, Math.min(1, Math.sin(phase)))) / (Math.PI / 2);
  const amp = 0.0082 * (1 - t * 0.34);
  const lift = Math.cos(phase);
  const outward = (lift > 0 ? lift : lift * 0.15) * 0.0052 * (1 - t * 0.2);
  return {
    x: across * amp,
    y,
    z: -0.056 - t * 0.014 - outward,
    radius: 0.0058 * (1 - t * 0.28),
  };
}

function hairFor(hex: number) {
  const found = hairCache.get(hex);
  if (found) return found;
  // A cap, side locks, and a fringe above the sunglasses. The crossing
  // strand braid below stays. The fringe stays above the eye line.
  const bangs = new SphereGeometry(0.055, 8, 6);
  bangs.scale(1.7, 0.45, 0.55);
  bangs.translate(0, 0.175, 0.07);
  const locks = [
    new SphereGeometry(0.04, 6, 5).translate(0, 0.015, -0.072),
    new SphereGeometry(0.078, 8, 6).translate(0, 0.11, -0.04),
    new SphereGeometry(0.09, 8, 6).translate(0, 0.04, -0.13),
    new SphereGeometry(0.055, 6, 5).translate(-0.08, 0.05, -0.02),
    new SphereGeometry(0.055, 6, 5).translate(0.08, 0.05, -0.02),
    bangs,
    new CylinderGeometry(0.028, 0.016, 0.22, 6).translate(-0.095, -0.02, 0.01),
    new CylinderGeometry(0.028, 0.016, 0.22, 6).translate(0.095, -0.02, 0.01),
  ];
  const volume = mergeGeometries(locks, false);
  for (const lock of locks) lock.dispose();
  const pieces: BufferGeometry[] = [];
  const samples = 42;
  const tone = new Color(hex);
  const shades = [1, 0.78, 0.9];
  for (let s = 0; s < 3; s++) {
    const tint = tone.clone().multiplyScalar(shades[s]).getHex();
    for (let i = 0; i < samples - 1; i++) {
      const a = braidPoint(s, i / (samples - 1));
      const b = braidPoint(s, (i + 1) / (samples - 1));
      const seg = strandSegment(a.x, a.y, a.z, b.x, b.y, b.z, (a.radius + b.radius) * 0.5);
      pieces.push(paint(seg, tint, 3));
    }
  }
  const tie = new TorusGeometry(0.018, 0.003, 5, 10);
  tie.rotateX(Math.PI / 2);
  tie.translate(0, 0.198, -0.06);
  paint(tie, tone.clone().multiplyScalar(0.55).getHex(), 3);
  const tail = new SphereGeometry(0.012, 6, 5);
  tail.scale(1.15, 1.45, 0.7);
  tail.translate(0, -0.308, -0.072);
  paint(tail, hex, 3);
  pieces.push(tie, tail);
  const braid = mergeGeometries(pieces, false);
  for (const piece of pieces) {
    if (braid) piece.dispose();
  }
  const made = {
    volume: paint(volume ?? new SphereGeometry(0.04, 6, 5), hex, 3),
    braid: braid ?? tail,
  };
  hairCache.set(hex, made);
  return made;
}

function necklaceGeometry() {
  if (neckGeo) return neckGeo;
  // Neck local. The cross is part of this one cached geometry, not a second
  // chest mesh. That extra mesh grew renderer geometries on the low soak.
  const ring = new TorusGeometry(0.05, 0.006, 6, 16);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.016, 0.034);
  const bail = new CylinderGeometry(0.0036, 0.0036, 0.03, 5);
  bail.translate(0, -0.006, 0.058);
  const upright = new BoxGeometry(0.012, 0.046, 0.008);
  upright.translate(0, -0.034, 0.082);
  const bar = new BoxGeometry(0.028, 0.01, 0.008);
  bar.translate(0, -0.022, 0.086);
  const links = [ring, bail, upright, bar];
  const merged = mergeGeometries(links, false);
  for (const link of links) {
    if (merged) link.dispose();
  }
  const geo = merged ?? ring;
  geo.clearGroups();
  neckGeo = paint(geo, GOLD, 4);
  return neckGeo;
}

function beltGeometry() {
  if (beltGeo) return beltGeo;
  // A smaller ring at the hip line, so the belt sits on the cloth.
  const ring = new TorusGeometry(0.108, 0.012, 6, 16);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.145, -0.01);
  beltGeo = paint(ring, BELT, 2);
  return beltGeo;
}

function buckleGeometry() {
  if (buckleGeo) return buckleGeo;
  const box = new BoxGeometry(0.03, 0.02, 0.008);
  box.translate(0, 0.145, 0.102);
  buckleGeo = paint(box, GOLD, 4);
  return buckleGeo;
}

let phoneGeo: BufferGeometry | null = null;
let talkGeo: BufferGeometry | null = null;
let towelGeo: BufferGeometry | null = null;

function towelGeometry() {
  if (towelGeo) return towelGeo;
  // Wrist local +Y runs from the wrist down past the hand. Negative Y
  // would float the cloth up by the shoulder. Opaque stripes, not sheer.
  const cloth = paint(new BoxGeometry(0.16, 0.38, 0.02).translate(0.02, 0.24, 0.05), 0xf7f4ee, 2);
  const stripe = paint(new BoxGeometry(0.16, 0.048, 0.024).translate(0.02, 0.16, 0.05), 0x2f8f9a, 2);
  const hem = paint(new BoxGeometry(0.16, 0.048, 0.024).translate(0.02, 0.34, 0.05), 0x2f8f9a, 2);
  const parts = [cloth, stripe, hem];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  const geo = merged ?? cloth;
  geo.clearGroups();
  towelGeo = geo;
  return towelGeo;
}

function talkMouthGeometry() {
  if (talkGeo) return talkGeo;
  // Head space, just in front of the closed mouth, so a standing woman reads as mid-sentence.
  const gap = roundPart(0.015, 1.15, 0.32, 0.38, 0, 0.055, 0.14, 0x3a1618, 5, 8, 5);
  const lower = roundPart(0.016, 1.25, 0.46, 0.46, 0, 0.046, 0.136, 0xb85a58, 1, 8, 5);
  const parts = [gap, lower];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  const geo = merged ?? gap;
  geo.clearGroups();
  talkGeo = geo;
  return talkGeo;
}

function phoneGeometry() {
  if (phoneGeo) return phoneGeo;
  // Wrist space. A closed phone, screen facing out, held at the side.
  // One merged geometry: the body is metal, the screen stays the flat oil light.
  const body = paint(new BoxGeometry(0.038, 0.07, 0.006).translate(0, -0.08, 0.03), 0x1c1e22, 4);
  const screen = paint(new BoxGeometry(0.03, 0.056, 0.004).translate(0, -0.08, 0.034), 0x8eb4c8, 0);
  const parts = [body, screen];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  const geo = merged ?? body;
  geo.clearGroups();
  phoneGeo = geo;
  return phoneGeo;
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
    if (female && index % 2 === 0) wear(head, talkMouthGeometry(), "aw:mouth");
    if (female) {
      const locks = hairFor(hair);
      wear(head, locks.volume, "aw:hair");
      if (chest) wear(chest, locks.braid, "aw:braid");
    }
  }
  if (female && neck) wear(neck, necklaceGeometry(), "aw:necklace");
  // Even pool slots are the casual and adventurer women. They hold the phone.
  const wristR = root.getObjectByName("WristR");
  if (female && wristR && index % 2 === 0) wear(wristR, phoneGeometry(), "aw:phone");
  // Odd pool slots are the worker woman. The towel hangs from the left hand.
  const wristL = root.getObjectByName("WristL");
  if (female && wristL && index % 2 === 1) wear(wristL, towelGeometry(), "aw:towel");
  if (hips) {
    wear(hips, beltGeometry(), "aw:belt");
    wear(hips, buckleGeometry(), "aw:buckle");
  }
}
