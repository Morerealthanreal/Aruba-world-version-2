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
  const bridge = paint(new BoxGeometry(0.011, 0.024, 0.01).translate(0, 0.126, 0.102), tone.getHex());
  const tip = paint(new BoxGeometry(0.015, 0.011, 0.012).translate(0, 0.108, 0.108), tone.getHex());
  const brow = tone.clone().multiplyScalar(0.45).getHex();
  const browL = paint(new BoxGeometry(0.04, 0.008, 0.008).translate(-0.032, 0.176, 0.108), brow);
  const browR = paint(new BoxGeometry(0.04, 0.008, 0.008).translate(0.032, 0.176, 0.108), brow);
  const lip = paint(new BoxGeometry(0.036, 0.01, 0.008).translate(0, 0.078, 0.104), tone.clone().multiplyScalar(0.55).getHex());
  const eyeL = paint(new SphereGeometry(0.014, 8, 6).translate(-0.032, 0.15, 0.1), EYE);
  const eyeR = paint(new SphereGeometry(0.014, 8, 6).translate(0.032, 0.15, 0.1), EYE);
  const pupilL = paint(new SphereGeometry(0.007, 6, 5).translate(-0.032, 0.15, 0.112), PUPIL);
  const pupilR = paint(new SphereGeometry(0.007, 6, 5).translate(0.032, 0.15, 0.112), PUPIL);
  const parts = [bridge, tip, browL, browR, lip, eyeL, eyeR, pupilL, pupilR];
  const merged = mergeGeometries(parts, false);
  for (const part of parts) {
    if (merged) part.dispose();
  }
  const geo = merged ?? bridge;
  faceCache.set(skin, geo);
  return geo;
}

function hairFor(hex: number) {
  const found = hairCache.get(hex);
  if (found) return found;
  // One nape lock so the plait starts in hair. Side spheres read as buns.
  const volume = new SphereGeometry(0.04, 7, 5).translate(0, 0.015, -0.072);
  // Chest space. A three-strand plait from the nape (y 0.22) to the waist.
  const strands: BufferGeometry[] = [];
  const segments = 16;
  const y0 = 0.2;
  const y1 = -0.3;
  const span = (y0 - y1) / segments;
  for (let i = 0; i < segments; i++) {
    const t = i / (segments - 1);
    const y = y0 + (y1 - y0) * t;
    // Lie on the back. A wide helix reads as a chain and swings off the shirt.
    const z = -0.062 - t * 0.008;
    const twist = t * Math.PI * 3.2;
    const spread = 0.0065 * (1 - t * 0.15);
    const radius = 0.0055 * (1 - t * 0.25);
    for (let s = 0; s < 3; s++) {
      const angle = twist + (s * Math.PI * 2) / 3;
      const strand = new CylinderGeometry(radius, radius, span * 2.15, 5);
      strand.translate(Math.cos(angle) * spread, y, z + Math.sin(angle) * spread * 0.45);
      strands.push(strand);
    }
  }
  const core = new CylinderGeometry(0.012, 0.0075, y0 - y1, 6);
  core.translate(0, (y0 + y1) / 2, -0.062);
  strands.push(core);
  const tie = new TorusGeometry(0.016, 0.0032, 5, 8);
  tie.rotateX(Math.PI / 2);
  tie.translate(0, 0.205, -0.064);
  const tail = new SphereGeometry(0.014, 6, 5);
  tail.scale(1, 1.25, 0.75);
  tail.translate(0, -0.312, -0.08);
  paint(tie, new Color(hex).multiplyScalar(0.62).getHex());
  for (const strand of strands) paint(strand, hex);
  paint(tail, hex);
  const braid = mergeGeometries([...strands, tie, tail], false);
  for (const strand of strands) strand.dispose();
  if (braid) {
    tie.dispose();
    tail.dispose();
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
