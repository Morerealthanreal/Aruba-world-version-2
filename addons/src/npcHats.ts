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
  glassGeo = paint(merged ?? left, LENS);
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
  const nose = paint(new BoxGeometry(0.014, 0.028, 0.016).translate(0, 0.086, 0.112), tone.getHex());
  const brow = tone.clone().multiplyScalar(0.32).getHex();
  const browL = paint(new BoxGeometry(0.05, 0.009, 0.01).translate(-0.036, 0.148, 0.124), brow);
  const browR = paint(new BoxGeometry(0.05, 0.009, 0.01).translate(0.036, 0.148, 0.124), brow);
  const lip = paint(new BoxGeometry(0.052, 0.016, 0.014).translate(0, 0.062, 0.13), 0xb85a58);
  const eyeL = paint(new SphereGeometry(0.016, 8, 6).translate(-0.034, 0.108, 0.104), EYE);
  const eyeR = paint(new SphereGeometry(0.016, 8, 6).translate(0.034, 0.108, 0.104), EYE);
  const pupilL = paint(new SphereGeometry(0.008, 6, 5).translate(-0.034, 0.108, 0.116), PUPIL);
  const pupilR = paint(new SphereGeometry(0.008, 6, 5).translate(0.034, 0.108, 0.116), PUPIL);
  const parts = [nose, browL, browR, lip, eyeL, eyeR, pupilL, pupilR];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  const geo = merged ?? nose;
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
  // One nape lock so the plait starts in hair. Side spheres read as buns.
  const volume = new SphereGeometry(0.04, 7, 5).translate(0, 0.015, -0.072);
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
      pieces.push(paint(seg, tint));
    }
  }
  const tie = new TorusGeometry(0.018, 0.003, 5, 10);
  tie.rotateX(Math.PI / 2);
  tie.translate(0, 0.198, -0.06);
  paint(tie, tone.clone().multiplyScalar(0.55).getHex());
  const tail = new SphereGeometry(0.012, 6, 5);
  tail.scale(1.15, 1.45, 0.7);
  tail.translate(0, -0.308, -0.072);
  paint(tail, hex);
  pieces.push(tie, tail);
  const braid = mergeGeometries(pieces, false);
  for (const piece of pieces) {
    if (braid) piece.dispose();
  }
  const made = {
    volume: paint(volume, hex),
    braid: braid ?? tail,
  };
  hairCache.set(hex, made);
  return made;
}

function necklaceGeometry() {
  if (neckGeo) return neckGeo;
  // Neck local. A short chain on the neck, one pendant on the upper chest.
  const ring = new TorusGeometry(0.05, 0.006, 6, 16);
  ring.rotateX(Math.PI / 2);
  ring.translate(0, 0.016, 0.034);
  const bail = new CylinderGeometry(0.0036, 0.0036, 0.03, 5);
  bail.translate(0, -0.006, 0.058);
  const pendant = new SphereGeometry(0.016, 8, 6);
  pendant.scale(0.7, 1.15, 0.4);
  pendant.translate(0, -0.026, 0.078);
  const links = [ring, bail, pendant];
  const merged = mergeGeometries(links, false);
  for (const link of links) {
    if (merged) link.dispose();
  }
  neckGeo = paint(merged ?? ring, GOLD);
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
