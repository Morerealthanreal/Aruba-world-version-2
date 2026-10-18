// Twelve street people from the CC0 Quaternius modular packs. Each keeps that
// pack's mesh, skeleton, and Idle / Walk / Run. Clothing colours, hats,
// sunglasses, bags, and sandals follow the Aruba photo notes in
// refs/people/aruba-outfits.md. The photos are not textures.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, CylinderGeometry, DoubleSide,
  Float32BufferAttribute, Mesh, MeshStandardMaterial, SkinnedMesh, Vector3,
  type Object3D, type Skeleton, type WebGLRenderer,
} from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { characterLoader, sunDir } from "./characters";
import type { LocoClips } from "./locomotion";

export type OilHat = "none" | "straw" | "cap";

export type OilOutfit = {
  id: number;
  file: string;
  skin: number;
  hair: number;
  top: number;
  bottom: number;
  /** Named cloth pieces that should not share the top/bottom split. */
  colors: Record<string, number>;
  sandals: boolean;
  sunglasses: boolean;
  hat: OilHat;
  bag: boolean;
  /** 1 paints a few cloth motifs. No texture. */
  print: number;
  hideHelmet: boolean;
};

// Colours are taken from the outfit notes, not from the pack's costume dyes.
export const OIL_OUTFITS: readonly OilOutfit[] = [
  { id: 0, file: "people/w-worker.glb", skin: 0xe8c39a, hair: 0x3a2418, top: 0xf7f3ea, bottom: 0xd8d0c2,
    colors: { White: 0xfffaf4, Worker_Vest: 0xf4f0e6, Worker_Yellow: 0xe6c84a }, sandals: true, sunglasses: true, hat: "straw", bag: true, print: 1, hideHelmet: true },
  { id: 1, file: "people/w-casual.glb", skin: 0xc98b68, hair: 0x4a3428, top: 0xe6c84a, bottom: 0x2c4f86,
    colors: {}, sandals: true, sunglasses: false, hat: "cap", bag: false, print: 0, hideHelmet: false },
  { id: 2, file: "people/w-suit.glb", skin: 0xf3d2b4, hair: 0x8a5a32, top: 0xf3efe4, bottom: 0xd8d0c2,
    colors: { White: 0xfffaf4 }, sandals: true, sunglasses: true, hat: "none", bag: true, print: 0, hideHelmet: false },
  { id: 3, file: "people/w-adventurer.glb", skin: 0x8d5a40, hair: 0x241816, top: 0xf7f4ee, bottom: 0xc4a574,
    colors: { Gold: 0xc4a574, Green: 0x3e5c46 }, sandals: true, sunglasses: true, hat: "straw", bag: false, print: 0, hideHelmet: false },
  { id: 4, file: "people/w-punk.glb", skin: 0xb98362, hair: 0x1a1412, top: 0xf7f1e4, bottom: 0x243044,
    colors: { Pink: 0xd96f56, Black: 0x3e5c78 }, sandals: true, sunglasses: true, hat: "cap", bag: true, print: 0, hideHelmet: false },
  { id: 5, file: "people/m-casual.glb", skin: 0x6e4634, hair: 0x1a1412, top: 0xf7f1e4, bottom: 0xc4a574,
    colors: {}, sandals: true, sunglasses: true, hat: "cap", bag: false, print: 0, hideHelmet: false },
  { id: 6, file: "people/m-hoodie.glb", skin: 0xd7a574, hair: 0x3a241c, top: 0x3e7ea8, bottom: 0x243044,
    colors: {}, sandals: true, sunglasses: true, hat: "cap", bag: false, print: 0, hideHelmet: false },
  { id: 7, file: "people/m-farmer.glb", skin: 0xc4a07a, hair: 0x9a9690, top: 0x6e8f73, bottom: 0x5c4636,
    colors: { Beige: 0xe6c98a, Brown: 0x8a6244 }, sandals: true, sunglasses: false, hat: "none", bag: false, print: 0, hideHelmet: false },
  { id: 8, file: "people/m-punk.glb", skin: 0xa56b4c, hair: 0x6a2e24, top: 0xf7f4ee, bottom: 0x2c4f86,
    colors: { Black: 0x2a3038, Red: 0x6a2e24 }, sandals: true, sunglasses: true, hat: "none", bag: false, print: 0, hideHelmet: false },
  { id: 9, file: "people/m-suit.glb", skin: 0xfff4e8, hair: 0xc4a15a, top: 0xe7e2d6, bottom: 0xcfc6b4,
    colors: { White: 0xfffaf4, Tie: 0x314863 }, sandals: false, sunglasses: true, hat: "none", bag: false, print: 0, hideHelmet: false },
  { id: 10, file: "people/m-worker.glb", skin: 0x9a6244, hair: 0x6e6a66, top: 0xe1c587, bottom: 0x4a372c,
    colors: { Worker_Vest: 0xd96f56, LightBrown: 0xf7f1e4 }, sandals: true, sunglasses: false, hat: "cap", bag: false, print: 0, hideHelmet: true },
  { id: 11, file: "people/m-adventurer.glb", skin: 0x6e4634, hair: 0x1a1412, top: 0x3e5c46, bottom: 0xc2b48a,
    colors: { Gold: 0x8a6244, LightGreen: 0x6e8f73 }, sandals: true, sunglasses: true, hat: "straw", bag: false, print: 0, hideHelmet: false },
];

export type OilPerson = { id: number; gl: GLTF };

let loading: Promise<OilPerson[]> | null = null;

export function loadOilCrowd(renderer: WebGLRenderer): Promise<OilPerson[]> {
  loading ||= Promise.all(OIL_OUTFITS.map(async (outfit): Promise<OilPerson> => {
    const gl = await characterLoader(renderer).loadAsync(`./models/${outfit.file}`);
    styleOilPerson(gl.scene, outfit);
    return { id: outfit.id, gl };
  }));
  return loading;
}

export function oilClips(gl: GLTF): LocoClips {
  const clip = (name: string) => {
    const found = gl.animations.find((animation) => animation.name === name);
    if (!found) throw new Error(`oil crowd clip ${name} missing`);
    return found;
  };
  return { idle: clip("Idle"), walk: clip("Walk"), run: clip("Run"), walkMs: 1.25, runMs: 3.6 };
}

export function oilTriangles(root: Object3D) {
  let triangles = 0;
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    const geometry = mesh.geometry;
    triangles += (geometry.index ? geometry.index.count : geometry.getAttribute("position").count) / 3;
  });
  return triangles;
}

type Role = "skin" | "hair" | "brow" | "eye" | "cloth" | "shoe" | "helmet";
type EyeMark = { lx: number; ly: number; lz: number; rx: number; ry: number; rz: number; joint: number };

function smoothSplitNormals(geometry: BufferGeometry) {
  const pos = geometry.getAttribute("position");
  const index = geometry.getIndex();
  if (!pos || !index) return;
  const count = pos.count;
  const faceX = new Float32Array(count);
  const faceY = new Float32Array(count);
  const faceZ = new Float32Array(count);
  for (let t = 0; t < index.count; t += 3) {
    const a = index.getX(t);
    const b = index.getX(t + 1);
    const c = index.getX(t + 2);
    const abx = pos.getX(b) - pos.getX(a);
    const aby = pos.getY(b) - pos.getY(a);
    const abz = pos.getZ(b) - pos.getZ(a);
    const acx = pos.getX(c) - pos.getX(a);
    const acy = pos.getY(c) - pos.getY(a);
    const acz = pos.getZ(c) - pos.getZ(a);
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;
    faceX[a] += nx; faceY[a] += ny; faceZ[a] += nz;
    faceX[b] += nx; faceY[b] += ny; faceZ[b] += nz;
    faceX[c] += nx; faceY[c] += ny; faceZ[c] += nz;
  }
  const groups = new Map<string, number[]>();
  for (let i = 0; i < count; i++) {
    const key = `${Math.round(pos.getX(i) * 2000)}:${Math.round(pos.getY(i) * 2000)}:${Math.round(pos.getZ(i) * 2000)}`;
    const list = groups.get(key);
    if (list) list.push(i);
    else groups.set(key, [i]);
  }
  const out = new Float32Array(count * 3);
  for (const ids of groups.values()) {
    let x = 0, y = 0, z = 0;
    for (const i of ids) { x += faceX[i]; y += faceY[i]; z += faceZ[i]; }
    const length = Math.hypot(x, y, z);
    if (length < 1e-8) continue;
    x /= length; y /= length; z /= length;
    for (const i of ids) { out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z; }
  }
  geometry.setAttribute("normal", new BufferAttribute(out, 3));
}

function meshBox(geometry: BufferGeometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  return {
    minY: box.min.y, maxY: box.max.y, midY: (box.min.y + box.max.y) * 0.5,
    cx: (box.min.x + box.max.x) * 0.5, cy: (box.min.y + box.max.y) * 0.5, cz: (box.min.z + box.max.z) * 0.5,
  };
}

function roleOf(name: string, geometry: BufferGeometry, outfit: OilOutfit): Role {
  const box = meshBox(geometry);
  const span = box.maxY - box.minY;
  const count = geometry.getAttribute("position").count;
  if ((name === "Eye" || name === "Brown") && count < 80 && box.minY > 1.6) return "eye";
  if (name === "Eyebrows" || (name === "Hair_Brown" && count < 140 && span < 0.08)) return count < 140 && span < 0.08 ? "brow" : "hair";
  if (/hair|moustache|beard/i.test(name) || name === "Skin_Darker") return "hair";
  if (name.startsWith("Skin")) return "skin";
  if (outfit.hideHelmet && name === "Worker_Yellow" && box.minY > 1.66) return "helmet";
  // Hair, hoods, and tall collars sit above the eyes. Hats stay cloth so they keep their colour.
  if (box.minY > 1.58 && name !== "Beige" && name !== "Worker_Yellow" && name !== "Earrings") return "hair";
  if (box.maxY < 0.34 && !name.startsWith("Skin")) return "shoe";
  return "cloth";
}

function roundEyes(geometry: BufferGeometry): { geometry: BufferGeometry; eyes: EyeMark } {
  const pos = geometry.getAttribute("position");
  const skin = geometry.getAttribute("skinIndex");
  const joint = skin ? skin.getX(0) : 7;
  const acc = { lx: 0, ly: 0, lz: 0, ln: 0, rx: 0, ry: 0, rz: 0, rn: 0, lrx: 0, lry: 0, lrz: 0, rrx: 0, rry: 0, rrz: 0 };
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (x < 0) { acc.lx += x; acc.ly += y; acc.lz += z; acc.ln++; acc.lrx = Math.max(acc.lrx, Math.abs(x)); }
    else { acc.rx += x; acc.ry += y; acc.rz += z; acc.rn++; }
  }
  const left = acc.ln ? [acc.lx / acc.ln, acc.ly / acc.ln, acc.lz / acc.ln] : [-0.0462, 1.691, 0.156];
  const right = acc.rn ? [acc.rx / acc.rn, acc.ry / acc.rn, acc.rz / acc.rn] : [0.0462, 1.691, 0.156];
  let maxR = 0.004;
  for (let i = 0; i < pos.count; i++) {
    const cx = pos.getX(i) < 0 ? left[0] : right[0];
    const cy = pos.getX(i) < 0 ? left[1] : right[1];
    const cz = pos.getX(i) < 0 ? left[2] : right[2];
    maxR = Math.max(maxR, Math.abs(pos.getX(i) - cx), Math.abs(pos.getY(i) - cy) * 0.8, Math.abs(pos.getZ(i) - cz));
  }
  const rx = Math.max(0.009, maxR * 0.95);
  const ry = Math.max(0.007, maxR * 0.75);
  const rz = Math.max(0.006, maxR * 0.6);
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const add = (cx: number, cy: number, cz: number) => {
    const stacks = 6;
    const slices = 10;
    const base = positions.length / 3;
    for (let iy = 0; iy <= stacks; iy++) {
      const phi = (iy / stacks) * Math.PI;
      for (let ix = 0; ix <= slices; ix++) {
        const theta = (ix / slices) * Math.PI * 2;
        const nx = Math.sin(phi) * Math.cos(theta);
        const ny = Math.cos(phi);
        const nz = Math.sin(phi) * Math.sin(theta);
        positions.push(cx + nx * rx, cy + ny * ry, cz + nz * rz);
        normals.push(nx, ny, nz);
      }
    }
    const row = slices + 1;
    for (let iy = 0; iy < stacks; iy++) {
      for (let ix = 0; ix < slices; ix++) {
        const a = base + iy * row + ix;
        const b = a + row;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  };
  add(left[0], left[1], left[2] + 0.014);
  add(right[0], right[1], right[2] + 0.014);
  const count = positions.length / 3;
  const next = new BufferGeometry();
  next.setAttribute("position", new Float32BufferAttribute(positions, 3));
  next.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  next.setIndex(indices);
  const skinIndex = new Uint16Array(count * 4);
  const skinWeight = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) { skinIndex[i * 4] = joint; skinWeight[i * 4] = 1; }
  next.setAttribute("skinIndex", new BufferAttribute(skinIndex, 4));
  next.setAttribute("skinWeight", new BufferAttribute(skinWeight, 4));
  geometry.dispose();
  return {
    geometry: next,
    eyes: { lx: left[0], ly: left[1], lz: left[2] + 0.014, rx: right[0], ry: right[1], rz: right[2] + 0.014, joint },
  };
}

function softenBrows(geometry: BufferGeometry) {
  const pos = geometry.getAttribute("position");
  let mid = 0;
  for (let i = 0; i < pos.count; i++) mid += pos.getY(i);
  mid /= pos.count || 1;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const arch = 0.003 * (1 - Math.min(1, Math.abs(x) / 0.08));
    pos.setXYZ(i, x, mid + (y - mid) * 0.55 + arch, z - 0.002);
  }
  pos.needsUpdate = true;
}

function oilMaterial(color: number, kind: number, eye: number, part: number, print: number, eyes: EyeMark) {
  const material = new MeshStandardMaterial({ color, roughness: kind === 0 ? 0.94 : kind === 2 ? 0.9 : 0.92, metalness: 0, side: DoubleSide });
  material.envMapIntensity = 0.04;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uAwSunDir = { value: sunDir };
    shader.uniforms.uAwKind = { value: kind };
    shader.uniforms.uAwEye = { value: eye };
    shader.uniforms.uAwPart = { value: part };
    shader.uniforms.uAwPrint = { value: print };
    shader.uniforms.uAwEyeL = { value: new Vector3(eyes.lx, eyes.ly, eyes.lz) };
    shader.uniforms.uAwEyeR = { value: new Vector3(eyes.rx, eyes.ry, eyes.rz) };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>
uniform vec3 uAwSunDir;
uniform float uAwKind;
uniform vec3 uAwEyeL;
uniform vec3 uAwEyeR;
varying vec3 vAwBind;
varying vec3 vAwSunView;`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>
if (uAwKind < 0.5) {
  float awEyeY = (uAwEyeL.y + uAwEyeR.y) * 0.5;
  float awCheek = max(
    exp(-pow((position.x - uAwEyeL.x) / 0.02, 2.0) - pow((position.y - (awEyeY - 0.036)) / 0.016, 2.0)),
    exp(-pow((position.x - uAwEyeR.x) / 0.02, 2.0) - pow((position.y - (awEyeY - 0.036)) / 0.016, 2.0))
  ) * smoothstep(uAwEyeL.z - 0.05, uAwEyeL.z - 0.01, position.z);
  float awJaw = smoothstep(awEyeY - 0.05, awEyeY - 0.12, position.y) * (1.0 - smoothstep(awEyeY - 0.12, awEyeY - 0.2, position.y));
  awJaw *= smoothstep(uAwEyeL.z - 0.08, uAwEyeL.z - 0.02, position.z) * (1.0 - smoothstep(0.02, 0.07, abs(position.x)));
  transformed.z += awCheek * 0.006 + awJaw * 0.003;
  transformed.y -= awJaw * 0.002;
}
vAwBind = position;
vAwSunView = mat3(viewMatrix) * uAwSunDir;`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>
uniform vec3 uAwSunDir;
uniform float uAwKind;
uniform float uAwEye;
uniform float uAwPart;
uniform float uAwPrint;
uniform vec3 uAwEyeL;
uniform vec3 uAwEyeR;
varying vec3 vAwBind;
varying vec3 vAwSunView;
float awHash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}
float awBrush(vec3 p) {
  vec2 st = vec2(dot(p, vec3(0.42, 0.06, 0.88)), dot(p, vec3(-0.12, 1.0, 0.05)));
  vec2 cell = vec2(floor(st.x * 28.0), floor(st.y * 11.0));
  float a = awHash(vec3(cell, 2.1));
  float b = awHash(vec3(cell + vec2(0.0, 1.0), 2.1));
  return mix(a, b, smoothstep(0.12, 0.88, fract(st.y * 11.0)));
}`)
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
vec3 awSun = normalize(vAwSunView);
vec3 awN = normalize(normal);
float awNdL = dot(awN, awSun);
float awLow = smoothstep(0.62, 0.05, uAwSunDir.y);
float awStroke = awBrush(vAwBind);
float awFacing = clamp(dot(awN, normalize(vViewPosition)), 0.0, 1.0);
float awEyeY = (uAwEyeL.y + uAwEyeR.y) * 0.5;
if (uAwKind > 0.5 && uAwKind < 1.5) {
  float awFreq = mix(9.0, 16.0, uAwPart);
  float awFold = sin(vAwBind.x * awFreq + vAwBind.y * 2.2 + (awStroke - 0.5) * 1.6);
  float awTrough = smoothstep(0.15, -0.95, awFold);
  float awRidge = smoothstep(0.1, 0.9, awFold);
  normal = normalize(normal + vec3(cos(vAwBind.x * awFreq) * 0.7, sin(vAwBind.y * 5.0) * 0.16, 0.0));
  diffuseColor.rgb *= mix(vec3(1.0), vec3(0.26, 0.28, 0.32), awTrough * 0.95);
  diffuseColor.rgb *= mix(vec3(1.0), vec3(1.36, 1.22, 1.06), awRidge * 0.88);
  diffuseColor.rgb *= mix(0.78, 1.16, awStroke);
  if (uAwPrint > 0.5) {
    float awSpot = exp(-pow(length((vAwBind.xy - vec2(0.02, awEyeY - 0.42)) / vec2(0.055, 0.07)), 2.0));
    awSpot += exp(-pow(length((vAwBind.xy - vec2(-0.07, awEyeY - 0.62)) / vec2(0.05, 0.06)), 2.0));
    awSpot += exp(-pow(length((vAwBind.xy - vec2(0.06, awEyeY - 0.78)) / vec2(0.045, 0.055)), 2.0));
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.35, 0.48, 0.42), clamp(awSpot, 0.0, 1.0) * 0.62);
  }
} else if (uAwKind < 0.5) {
  float awWrap = clamp(awNdL * 0.32 + 0.68, 0.0, 1.0);
  float awZone = awWrap * awWrap * (3.0 - 2.0 * awWrap);
  float awPlanes = floor(awZone * 5.0 + (awStroke - 0.5) * 0.7) / 5.0;
  awZone = mix(awZone, clamp(awPlanes, 0.0, 1.0), 0.62);
  float awFace = smoothstep(uAwEyeL.z - 0.05, uAwEyeL.z - 0.01, vAwBind.z)
    * smoothstep(awEyeY - 0.18, awEyeY - 0.12, vAwBind.y)
    * (1.0 - smoothstep(awEyeY + 0.05, awEyeY + 0.1, vAwBind.y));
  float awCheek = awFace * max(
    smoothstep(1.05, 0.15, length(vec2((vAwBind.x - uAwEyeL.x) / 0.02, (vAwBind.y - (awEyeY - 0.04)) / 0.016))),
    smoothstep(1.05, 0.15, length(vec2((vAwBind.x - uAwEyeR.x) / 0.02, (vAwBind.y - (awEyeY - 0.04)) / 0.016)))
  );
  float awRose = smoothstep(0.18, 0.48, awZone) * (1.0 - smoothstep(0.7, 0.95, awZone));
  vec3 awLit = mix(vec3(1.34, 0.76, 0.50), vec3(1.12, 0.46, 0.40), awRose * 0.85 + awCheek * 0.6);
  vec3 awShadow = mix(vec3(0.46, 0.32, 0.36), vec3(0.82, 0.40, 0.32), 0.62);
  diffuseColor.rgb *= mix(awShadow, awLit, awZone);
  diffuseColor.rgb *= mix(0.8, 1.14, awStroke);
  totalEmissiveRadiance += vec3(0.98, 0.40, 0.18) * (1.0 - awZone) * 0.2;
  totalEmissiveRadiance += vec3(0.9, 0.28, 0.16) * awCheek * 0.18;
  float awUpper = awFace * smoothstep(1.1, 0.2, length(vec2(vAwBind.x / 0.016, (vAwBind.y - (awEyeY - 0.083)) / 0.0055)));
  float awLower = awFace * smoothstep(1.1, 0.18, length(vec2(vAwBind.x / 0.018, (vAwBind.y - (awEyeY - 0.101)) / 0.007)));
  float awPartLine = awFace * exp(-pow((vAwBind.y - (awEyeY - 0.092)) / 0.0026, 2.0)) * (1.0 - smoothstep(0.012, 0.02, abs(vAwBind.x)));
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.62, 0.22, 0.2), awUpper * 0.78);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.84, 0.38, 0.32), awLower * 0.8);
  diffuseColor.rgb *= mix(1.0, 0.55, awPartLine);
} else if (uAwKind < 2.5) {
  if (uAwPart > 1.5) {
    float awHairs = sin(vAwBind.x * 150.0 + vAwBind.z * 28.0) * 0.5 + 0.5;
    diffuseColor.rgb *= mix(0.55, 1.02, awHairs);
  } else {
    float awFlow = vAwBind.y * 58.0 + vAwBind.x * 14.0 + sin(vAwBind.z * 30.0) * 2.0;
    float awStrand = sin(awFlow + (awStroke - 0.5) * 2.2);
    float awHi = smoothstep(0.35, 0.92, awStrand * 0.5 + 0.5);
    diffuseColor.rgb *= mix(vec3(0.40, 0.26, 0.16), vec3(1.55, 1.12, 0.58), awHi);
    float awEdge = pow(1.0 - awFacing, 1.5);
    diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.7, 0.52, 0.34), awEdge * 0.45);
    diffuseColor.rgb *= mix(0.86, 1.12, awStroke);
  }
}
if (uAwEye > 0.5) {
  float awSide = step(0.0, vAwBind.x);
  vec3 awC = mix(uAwEyeL, uAwEyeR, awSide);
  vec2 awQ = (vAwBind.xy - awC.xy) / vec2(0.0062, 0.0048);
  float awR = length(awQ);
  float awOpen = smoothstep(0.85, 0.05, awQ.y);
  vec3 awLid = vec3(0.55, 0.32, 0.26);
  vec3 awEyeCol = vec3(0.94, 0.9, 0.86);
  awEyeCol = mix(awEyeCol, vec3(0.40, 0.24, 0.16), smoothstep(0.58, 0.36, awR));
  awEyeCol = mix(awEyeCol, vec3(0.1, 0.06, 0.04), smoothstep(0.22, 0.1, awR));
  awEyeCol = mix(awLid, awEyeCol, awOpen);
  diffuseColor.rgb = awEyeCol;
}
float awRim = pow(1.0 - awFacing, 2.05);
float awWhere = uAwKind > 1.5 && uAwKind < 2.5 ? 1.15 : 0.42;
vec3 awGold = vec3(0.98, 0.64, 0.32) * awRim * mix(0.015, 0.3, awLow) * awWhere;
if (uAwEye < 0.5 && uAwKind < 2.5) {
  diffuseColor.rgb += awGold * 0.12;
  totalEmissiveRadiance += awGold * 0.4;
}
`);
  };
  material.customProgramCacheKey = () => `aw-oil-person-v1:${kind}:${eye}:${part}:${print}`;
  return material;
}

function clothColor(name: string, midY: number, outfit: OilOutfit) {
  if (outfit.colors[name] != null && midY > 0.85) return outfit.colors[name];
  if (name === "White" && outfit.colors.White != null) return outfit.colors.White;
  if (midY > 1.05) return outfit.top;
  return outfit.bottom;
}

function boneNamed(skeleton: Skeleton, name: string) {
  const want = name.replace(/\./g, "");
  return skeleton.bones.findIndex((bone) => bone.name.replace(/\./g, "") === want);
}

function bindExtra(host: SkinnedMesh, geometry: BufferGeometry, material: MeshStandardMaterial, bone: number) {
  const count = geometry.getAttribute("position").count;
  const skinIndex = new Uint16Array(count * 4);
  const skinWeight = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) { skinIndex[i * 4] = bone; skinWeight[i * 4] = 1; }
  geometry.setAttribute("skinIndex", new BufferAttribute(skinIndex, 4));
  geometry.setAttribute("skinWeight", new BufferAttribute(skinWeight, 4));
  const mesh = new SkinnedMesh(geometry, material);
  mesh.name = "aw:oil-extra";
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.bind(host.skeleton, host.bindMatrix);
  host.parent?.add(mesh);
}

function hatGeometry(kind: OilHat, y: number) {
  if (kind === "straw") {
    const brim = new CylinderGeometry(0.16, 0.17, 0.012, 14);
    brim.translate(0, y, 0.02);
    const crown = new CylinderGeometry(0.07, 0.078, 0.055, 10);
    crown.translate(0, y + 0.03, 0.01);
    return mergeGeometries([brim, crown], false) ?? brim;
  }
  const crown = new CylinderGeometry(0.09, 0.09, 0.04, 12);
  crown.translate(0, y, 0.02);
  const brim = new BoxGeometry(0.1, 0.012, 0.08);
  brim.translate(0, y - 0.01, 0.1);
  return mergeGeometries([crown, brim], false) ?? crown;
}

function sunglassesGeometry(eyes: EyeMark) {
  const left = new BoxGeometry(0.018, 0.01, 0.004);
  left.translate(eyes.lx, eyes.ly, eyes.lz + 0.012);
  const right = new BoxGeometry(0.018, 0.01, 0.004);
  right.translate(eyes.rx, eyes.ry, eyes.rz + 0.012);
  const bridge = new BoxGeometry(0.012, 0.004, 0.003);
  bridge.translate(0, eyes.ly + 0.002, eyes.lz + 0.01);
  return mergeGeometries([left, right, bridge], false) ?? left;
}

function bagGeometry() {
  const body = new BoxGeometry(0.14, 0.18, 0.06);
  body.translate(0.22, 1.02, 0.04);
  const strap = new BoxGeometry(0.012, 0.28, 0.012);
  strap.translate(0.16, 1.22, 0.02);
  return mergeGeometries([body, strap], false) ?? body;
}

function sandalGeometry(x: number, y: number, z: number) {
  const sole = new BoxGeometry(0.09, 0.015, 0.2);
  sole.translate(x, y, z);
  const strap = new BoxGeometry(0.08, 0.012, 0.016);
  strap.translate(x, y + 0.02, z + 0.02);
  return mergeGeometries([sole, strap], false) ?? sole;
}

function styleOilPerson(root: Object3D, outfit: OilOutfit) {
  const eyes: EyeMark = { lx: -0.046, ly: 1.691, lz: 0.156, rx: 0.046, ry: 1.691, rz: 0.156, joint: 7 };
  const pending: { mesh: Mesh; role: Role; name: string }[] = [];
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    const name = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material).name || "Skin";
    const role = roleOf(name, mesh.geometry, outfit);
    if (role === "eye") {
      const rounded = roundEyes(mesh.geometry);
      mesh.geometry = rounded.geometry;
      eyes.lx = rounded.eyes.lx; eyes.ly = rounded.eyes.ly; eyes.lz = rounded.eyes.lz;
      eyes.rx = rounded.eyes.rx; eyes.ry = rounded.eyes.ry; eyes.rz = rounded.eyes.rz;
      eyes.joint = rounded.eyes.joint;
    } else if (role === "brow") softenBrows(mesh.geometry);
    else smoothSplitNormals(mesh.geometry);
    pending.push({ mesh, role, name });
  });
  const shoes: { x: number; y: number; z: number }[] = [];
  for (const item of pending) {
    const box = meshBox(item.mesh.geometry);
    if (item.role === "shoe" && outfit.sandals) {
      shoes.push({ x: box.cx, y: box.cy, z: box.cz });
      item.mesh.visible = false;
      continue;
    }
    if (item.role === "helmet") {
      item.mesh.visible = false;
      continue;
    }
    const kind = item.role === "skin" ? 0 : item.role === "cloth" ? 1 : item.role === "brow" || item.role === "hair" ? 2 : 3;
    const eye = item.role === "eye" ? 1 : 0;
    const part = item.role === "brow" ? 2 : box.midY < 1.05 && kind === 1 ? 1 : 0;
    const color = item.role === "skin" ? outfit.skin
      : item.role === "hair" || item.role === "brow" ? outfit.hair
      : item.role === "eye" ? 0xf4efe8
      : item.role === "shoe" ? 0x2a2420
      : item.name === "Earrings" ? 0xc4a574
      : clothColor(item.name, box.midY, outfit);
    const print = item.role === "cloth" ? outfit.print : 0;
    item.mesh.material = oilMaterial(color, kind, eye, part, print, eyes);
    item.mesh.frustumCulled = false;
    item.mesh.castShadow = false;
    item.mesh.receiveShadow = true;
  }
  const host = pending.find((item) => (item.mesh as SkinnedMesh).isSkinnedMesh)?.mesh as SkinnedMesh | undefined;
  if (!host?.skeleton) return;
  const head = boneNamed(host.skeleton, "Head");
  const chest = boneNamed(host.skeleton, "Chest");
  const headBone = head >= 0 ? head : eyes.joint;
  if (outfit.hat !== "none") {
    bindExtra(host, hatGeometry(outfit.hat, eyes.ly + 0.1), oilMaterial(outfit.hat === "straw" ? 0xe6c98a : 0x314863, 1, 0, 0, 0, eyes), headBone);
  }
  if (outfit.sunglasses) {
    bindExtra(host, sunglassesGeometry(eyes), oilMaterial(0x1a1c1e, 3, 0, 0, 0, eyes), headBone);
  }
  if (outfit.bag && chest >= 0) {
    bindExtra(host, bagGeometry(), oilMaterial(0xc4a574, 1, 0, 0, 0, eyes), chest);
  }
  for (const shoe of shoes) {
    const foot = boneNamed(host.skeleton, shoe.x < 0 ? "Foot.L" : "Foot.R");
    if (foot < 0) continue;
    bindExtra(host, sandalGeometry(shoe.x, Math.min(shoe.y, 0.06), shoe.z), oilMaterial(0xc4a574, 1, 0, 1, 0, eyes), foot);
  }
}
