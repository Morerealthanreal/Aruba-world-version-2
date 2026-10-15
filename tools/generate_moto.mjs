#!/usr/bin/env node
// Rebuild game/models/moto.glb as a slim sport superbike.
// Procedural geometry only — original shapes, no manufacturer marks.
// Run after `npm ci` in addons/: node tools/generate_moto.mjs
import * as THREE from "../addons/node_modules/three/build/three.module.js";
import { mergeGeometries } from "../addons/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import { GLTFExporter } from "../addons/node_modules/three/examples/jsm/exporters/GLTFExporter.js";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// GLTFExporter uses FileReader in browsers. Keep the generator dependency-free in Node.
if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((result) => {
        this.result = result;
        this.onloadend?.();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = `data:${blob.type};base64,${Buffer.from(buffer).toString("base64")}`;
        this.onloadend?.();
      });
    }
  };
}

const physical = (name, options) => {
  const material = new THREE.MeshPhysicalMaterial(options);
  material.name = name;
  return material;
};
const standard = (name, options) => {
  const material = new THREE.MeshStandardMaterial(options);
  material.name = name;
  return material;
};

// Shared by the near and far meshes so the phone compiles each shader once.
// Mesh names stay off the bundle's paint/dark/chrome override list so these
// colours (gold cover, white vents, clear screen) survive loading.
const bikeMaterials = [
  physical("Fairing", {
    color: 0xc81018, metalness: 0.62, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide,
  }),
  standard("Vent", { color: 0xf3f5f7, metalness: 0.08, roughness: 0.38, side: THREE.DoubleSide }),
  standard("Black", { color: 0x14161a, metalness: 0.45, roughness: 0.46, side: THREE.DoubleSide }),
  standard("Tyre", { color: 0x141414, metalness: 0.02, roughness: 0.94 }),
  standard("Wheel", { color: 0x2a2e33, metalness: 0.78, roughness: 0.3 }),
  standard("Gold", { color: 0xe2b340, metalness: 0.95, roughness: 0.24 }),
  standard("Metal", { color: 0xc5ccd1, metalness: 0.9, roughness: 0.22 }),
  standard("Headlight", { color: 0xf7fbff, emissive: 0xe7f2ff, emissiveIntensity: 1.6, metalness: 0.05, roughness: 0.16 }),
  standard("Taillight", { color: 0xe10f28, emissive: 0xff1a30, emissiveIntensity: 1.15, metalness: 0.04, roughness: 0.24 }),
  physical("Screen", {
    color: 0xc5d5e0, metalness: 0.05, roughness: 0.05, transmission: 0.35, transparent: true, opacity: 0.55,
    thickness: 0.15, side: THREE.DoubleSide, depthWrite: false,
  }),
];
const riderMaterials = [
  standard("Suit", { color: 0x1b1e24, metalness: 0.18, roughness: 0.62 }),
  physical("Helmet", { color: 0xf2f3f5, metalness: 0.25, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 }),
  physical("Visor", { color: 0x0c1218, metalness: 0.7, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04 }),
  standard("Gear", { color: 0x101114, metalness: 0.14, roughness: 0.7 }),
];

const PAINT = 0, VENT = 1, BLACK = 2, TYRE = 3, WHEEL = 4, GOLD = 5, METAL = 6, LIGHT = 7, TAIL = 8, GLASS = 9;
const SUIT = 0, HELMET = 1, VISOR = 2, GEAR = 3;

const v = (x, y, z) => new THREE.Vector3(x, y, z);

function partsFor(materials) {
  return materials.map(() => []);
}

function add(parts, material, geometry, position = v(0, 0, 0), rotation = v(0, 0, 0), scale = v(1, 1, 1)) {
  geometry = geometry.clone();
  const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z));
  geometry.applyMatrix4(new THREE.Matrix4().compose(position, quaternion, scale));
  parts[material].push(geometry);
}

function tube(parts, material, start, end, radius, radialSegments = 8) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  if (length < 1e-4) return;
  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), delta.normalize());
  geometry.applyMatrix4(new THREE.Matrix4().compose(start.clone().add(end).multiplyScalar(0.5), quaternion, v(1, 1, 1)));
  parts[material].push(geometry);
}

function capsule(parts, material, start, end, radius, radialSegments = 8, capSegments = 3) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  const geometry = new THREE.CapsuleGeometry(radius, Math.max(0.01, length - radius * 2), capSegments, radialSegments);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), delta.clone().normalize());
  geometry.applyMatrix4(new THREE.Matrix4().compose(start.clone().add(end).multiplyScalar(0.5), quaternion, v(1, 1, 1)));
  parts[material].push(geometry);
}

// Flat panel grid. `center` sits inside the volume so each quad faces outward.
function addGrid(parts, material, grid, center = v(0, 0.5, 0)) {
  const positions = [];
  const normals = [];
  for (let i = 0; i < grid.length - 1; i++) {
    for (let j = 0; j < grid[i].length - 1; j++) {
      const a = grid[i][j];
      const b = grid[i + 1][j];
      const c = grid[i + 1][j + 1];
      const d = grid[i][j + 1];
      const ab = b.clone().sub(a);
      const ad = d.clone().sub(a);
      const geoN = new THREE.Vector3().crossVectors(ab, ad);
      const area = geoN.length();
      if (area < 1e-7) continue;
      const mid = a.clone().add(c).multiplyScalar(0.5);
      const n = geoN.clone();
      if (n.dot(mid.clone().sub(center)) < 0) n.negate();
      n.multiplyScalar(1 / area);
      const order = geoN.dot(n) > 0 ? [a, b, c, a, c, d] : [a, d, c, a, c, b];
      for (const p of order) {
        positions.push(p.x, p.y, p.z);
        normals.push(n.x, n.y, n.z);
      }
    }
  }
  if (!positions.length) return;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  parts[material].push(geometry);
}

// `right` runs from the lower edge up to the centreline. Result runs left edge,
// over the top, and down the right edge without crossing the shell.
function mirrorProfile(right) {
  const pts = [];
  for (let i = 0; i < right.length; i++) pts.push([-right[i][0], right[i][1]]);
  for (let i = right.length - 2; i >= 0; i--) pts.push([right[i][0], right[i][1]]);
  return pts;
}

// Smooth-shaded shell. Separate calls keep a hard crease where panels meet.
function addGridSmooth(parts, material, grid, center = v(0, 0.5, 0)) {
  const cols = grid[0].length;
  const positions = [];
  const indices = [];
  for (const row of grid) for (const p of row) positions.push(p.x, p.y, p.z);
  const at = (i, j) => i * cols + j;
  for (let i = 0; i < grid.length - 1; i++) {
    for (let j = 0; j < cols - 1; j++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
      const pa = grid[i][j], pb = grid[i + 1][j], pd = grid[i][j + 1];
      const geoN = new THREE.Vector3().crossVectors(pb.clone().sub(pa), pd.clone().sub(pa));
      if (geoN.length() < 1e-7) continue;
      const mid = pa.clone().add(grid[i + 1][j + 1]).multiplyScalar(0.5);
      const outward = geoN.dot(mid.clone().sub(center)) >= 0;
      if (outward) indices.push(a, b, c, a, c, d);
      else indices.push(a, d, c, a, c, b);
    }
  }
  if (!indices.length) return;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  parts[material].push(geometry);
}

// Front of the bike is -Z so heading 0 (movement toward -Z) matches the nose.
const FRONT_Z = -0.72;
const REAR_Z = 0.75;
const FRONT_R = 0.305;
const REAR_R = 0.325;

// Compact nose above the front tyre. The lower edge stays beside the tyre, not through it.
const NOSE = [
  { z: -1.16, w: 0.012, yt: 0.64, ys: 0.60, yb: 0.56 },
  { z: -1.05, w: 0.050, yt: 0.76, ys: 0.66, yb: 0.56 },
  { z: -0.94, w: 0.092, yt: 0.90, ys: 0.72, yb: 0.52 },
  { z: -0.84, w: 0.128, yt: 0.98, ys: 0.70, yb: 0.50 },
  { z: -0.74, w: 0.136, yt: 0.94, ys: 0.64, yb: 0.50 },
  { z: -0.62, w: 0.112, yt: 0.90, ys: 0.62, yb: 0.52 },
];

// Slim tank the rider lies on. The crankcase stays open underneath it.
const TANK = [
  { z: -0.48, w: 0.096, yt: 0.86, ys: 0.74 },
  { z: -0.32, w: 0.118, yt: 0.97, ys: 0.78 },
  { z: -0.14, w: 0.108, yt: 0.90, ys: 0.76 },
  { z: 0.02, w: 0.090, yt: 0.84, ys: 0.74 },
];

const TAIL_SHELL = [
  { z: 0.08, w: 0.078, yt: 0.84, ys: 0.74 },
  { z: 0.18, w: 0.052, yt: 0.86, ys: 0.78 },
  { z: 0.28, w: 0.026, yt: 0.83, ys: 0.77 },
  { z: 0.36, w: 0.008, yt: 0.79, ys: 0.76 },
];

const BELLY = [
  { z: -0.30, w: 0.070, yt: 0.40, yb: 0.32 },
  { z: -0.10, w: 0.086, yt: 0.38, yb: 0.28 },
  { z: 0.10, w: 0.072, yt: 0.38, yb: 0.30 },
  { z: 0.22, w: 0.046, yt: 0.40, yb: 0.34 },
];

function catmull(stations, steps) {
  if (steps <= 1) return stations.map((s) => ({ ...s }));
  const out = [];
  const n = stations.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = stations[Math.max(0, i - 1)];
    const p1 = stations[i];
    const p2 = stations[i + 1];
    const p3 = stations[Math.min(n - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const row = {};
      for (const key of Object.keys(p1)) {
        row[key] = 0.5 * (
          2 * p1[key]
          + (-p0[key] + p2[key]) * t
          + (2 * p0[key] - 5 * p1[key] + 4 * p2[key] - p3[key]) * t2
          + (-p0[key] + 3 * p1[key] - 3 * p2[key] + p3[key]) * t3
        );
      }
      row.w = Math.max(0.004, row.w);
      if (row.yb !== undefined && row.ys !== undefined) {
        row.ys = Math.min(row.yt - 0.008, Math.max(row.yb + 0.008, row.ys));
        row.yb = Math.min(row.ys - 0.004, row.yb);
      }
      out.push(row);
    }
  }
  out.push({ ...stations[n - 1] });
  return out;
}

// Right side from the outer bottom, up the flank, over the crown. Open underneath.
function noseSection(w, yTop, ySide, yBot) {
  const rise = Math.max(0.02, yTop - ySide);
  const drop = Math.max(0.02, ySide - yBot);
  const x0 = Math.max(0.055, w * 0.62);
  return mirrorProfile([
    [x0, yBot],
    [w * 0.92, yBot + drop * 0.38],
    [w, ySide],
    [w * 0.86, ySide + rise * 0.32],
    [w * 0.46, yTop - rise * 0.16],
    [w * 0.14, yTop - rise * 0.03],
    [0, yTop],
  ]);
}

function upperArch(w, yTop, ySide) {
  const rise = Math.max(0.02, yTop - ySide);
  return mirrorProfile([
    [w, ySide],
    [w * 0.90, ySide + rise * 0.28],
    [w * 0.52, yTop - rise * 0.16],
    [w * 0.16, yTop - rise * 0.03],
    [0, yTop],
  ]);
}

function bellySection(w, yTop, yBot) {
  const drop = Math.max(0.02, yTop - yBot);
  return mirrorProfile([
    [w, yTop],
    [w * 0.72, yBot + drop * 0.28],
    [w * 0.32, yBot],
    [0, yBot - 0.006],
  ]);
}

function addLoft(parts, material, stations, section, center) {
  const grid = stations.map((s) => section(s).map(([x, y]) => v(x, y, s.z)));
  addGridSmooth(parts, material, grid, center);
}

function ringDisc(inner, outer, segments, face) {
  const ring = new THREE.RingGeometry(inner, outer, segments);
  ring.rotateY(face);
  return ring;
}

function buildWheel(parts, z, radius, tubeR, segments, front) {
  const y = radius;
  add(parts, TYRE, new THREE.TorusGeometry(radius - tubeR, tubeR, segments.tube, segments.torus), v(0, y, z), v(0, Math.PI / 2, 0));
  add(parts, WHEEL, new THREE.TorusGeometry(radius - tubeR - 0.018, 0.018, Math.max(4, segments.tube - 2), segments.rim), v(0, y, z), v(0, Math.PI / 2, 0));
  add(parts, METAL, new THREE.TorusGeometry(radius - tubeR - 0.012, 0.006, 4, segments.rim), v(0, y, z), v(0, Math.PI / 2, 0));
  add(parts, WHEEL, new THREE.CylinderGeometry(0.048, 0.048, 0.06, segments.hub), v(0, y, z), v(0, 0, Math.PI / 2));
  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.BoxGeometry(0.016, radius * 0.70, 0.038);
    spoke.translate(0, radius * 0.40, 0);
    add(parts, WHEEL, spoke, v(0, y, z), v((i * Math.PI * 2) / 5 + 0.2, 0, 0));
  }
  const discs = front
    ? [{ x: -0.072, r: 0.205 }, { x: 0.072, r: 0.205 }]
    : [{ x: 0.08, r: 0.17 }];
  for (const disc of discs) {
    const face = disc.x >= 0 ? -Math.PI / 2 : Math.PI / 2;
    add(parts, METAL, ringDisc(disc.r * 0.38, disc.r, segments.disc, face), v(disc.x, y, z));
    add(parts, METAL, new THREE.TorusGeometry(disc.r - 0.01, 0.012, 6, Math.max(16, segments.disc)), v(disc.x, y, z), v(0, Math.PI / 2, 0));
    if (front) add(parts, BLACK, new THREE.BoxGeometry(0.028, 0.055, 0.04), v(disc.x + Math.sign(disc.x) * 0.01, y + disc.r * 0.72, z + 0.04));
  }
}

function wheelArch(radius, width, z, y, from, to, steps) {
  const grid = [];
  for (let i = 0; i <= steps; i++) {
    const a = from + (to - from) * (i / steps);
    const cy = y + Math.cos(a) * radius;
    const cz = z + Math.sin(a) * radius;
    grid.push([v(-width / 2, cy, cz), v(width / 2, cy, cz)]);
  }
  return grid;
}

function buildBike(parts, detail) {
  const fine = detail === "near";
  const steps = fine ? 3 : 1;
  const nose = catmull(NOSE, steps);
  const tank = catmull(TANK, steps);
  const tail = catmull(TAIL_SHELL, steps);
  const belly = catmull(BELLY, fine ? 2 : 1);
  addLoft(parts, PAINT, nose, (s) => noseSection(s.w, s.yt, s.ys, s.yb), v(0, 0.85, -0.9));
  addLoft(parts, PAINT, tank, (s) => upperArch(s.w, s.yt, s.ys), v(0, 0.45, -0.2));
  addLoft(parts, PAINT, tail, (s) => upperArch(s.w, s.yt, s.ys), v(0, 0.45, 0.2));
  addLoft(parts, PAINT, belly, (s) => bellySection(s.w, s.yt, s.yb), v(0, 0.7, 0));
  // Slim side panels tie the tank to the belly and leave the gold cover proud of them.
  for (const side of [-1, 1]) {
    const stations = [
      { z: -0.40, y0: 0.46, y1: 0.74, x: 0.098 },
      { z: -0.18, y0: 0.40, y1: 0.76, x: 0.112 },
      { z: 0.02, y0: 0.40, y1: 0.74, x: 0.108 },
      { z: 0.16, y0: 0.48, y1: 0.72, x: 0.086 },
    ];
    const rows = fine ? 4 : 2;
    const grid = [];
    for (let i = 0; i < rows; i++) {
      const t = i / (rows - 1);
      const bow = Math.sin(t * Math.PI) * 0.010;
      grid.push(stations.map((s) => v(side * (s.x + bow), s.y0 + (s.y1 - s.y0) * t, s.z)));
    }
    addGridSmooth(parts, PAINT, grid, v(0, 0.55, -0.1));
  }

  // Machined gold crank cover, standing proud of the side skin.
  for (const side of [-1, 1]) {
    const seg = fine ? 20 : 10;
    add(parts, GOLD, new THREE.CylinderGeometry(0.100, 0.108, 0.026, seg), v(side * 0.130, 0.50, -0.06), v(0, 0, Math.PI / 2));
    add(parts, GOLD, new THREE.CylinderGeometry(0.046, 0.046, 0.012, fine ? 12 : 8), v(side * 0.148, 0.50, -0.06), v(0, 0, Math.PI / 2));
    if (fine) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        add(parts, METAL, new THREE.CylinderGeometry(0.007, 0.007, 0.008, 5), v(side * 0.146, 0.50 + Math.sin(a) * 0.074, -0.06 + Math.cos(a) * 0.074), v(0, 0, Math.PI / 2));
      }
    }
  }

  // White intake scoop on each side of the nose, dark slot inside.
  for (const side of [-1, 1]) {
    const rot = v(0.45, side * 0.2, 0);
    add(parts, VENT, new THREE.BoxGeometry(0.014, 0.16, 0.28), v(side * 0.175, 0.66, -0.86), rot);
    add(parts, BLACK, new THREE.BoxGeometry(0.012, 0.09, 0.16), v(side * 0.184, 0.66, -0.86), rot);
  }

  // Twin slit lamps in the nose.
  for (const side of [-1, 1]) {
    add(parts, LIGHT, new THREE.BoxGeometry(0.05, 0.016, 0.01), v(side * 0.032, 0.74, -1.06), v(-0.2, side * 0.25, 0));
  }

  // Tall screen rising off the nose and raking back toward the helmet.
  {
    const rows = fine ? 7 : 3;
    const cols = fine ? 8 : 4;
    const screen = [];
    for (let i = 0; i < rows; i++) {
      const t = i / (rows - 1);
      const z = -0.86 + t * 0.30;
      const y0 = 0.94 + t * 0.32;
      const half = 0.11 - t * 0.04;
      const row = [];
      for (let j = 0; j < cols; j++) {
        const u = j / (cols - 1) * 2 - 1;
        row.push(v(u * half, y0 - u * u * 0.025, z - Math.abs(u) * 0.03 + Math.sin(t * Math.PI) * 0.018));
      }
      screen.push(row);
    }
    addGridSmooth(parts, GLASS, screen, v(0, 0.6, -0.4));
    add(parts, BLACK, new THREE.BoxGeometry(0.20, 0.012, 0.018), v(0, 0.96, -0.99));
  }
  if (fine) {
    for (const side of [-1, 1]) {
      tube(parts, BLACK, v(side * 0.12, 0.98, -0.82), v(side * 0.28, 1.08, -0.66), 0.008, 6);
      add(parts, BLACK, new THREE.BoxGeometry(0.075, 0.042, 0.012), v(side * 0.30, 1.09, -0.62), v(0.2, side * 0.45, 0));
      add(parts, METAL, new THREE.BoxGeometry(0.055, 0.028, 0.005), v(side * 0.305, 1.09, -0.612), v(0.2, side * 0.45, 0));
    }
  }

  const fenderSteps = fine ? 10 : 5;
  addGridSmooth(parts, PAINT, wheelArch(FRONT_R + 0.035, 0.07, FRONT_Z, FRONT_R, -0.85, 0.55, fenderSteps), v(0, FRONT_R, FRONT_Z));
  addGridSmooth(parts, BLACK, wheelArch(REAR_R + 0.03, 0.10, REAR_Z, REAR_R, -0.15, 1.05, fenderSteps), v(0, REAR_R, REAR_Z));

  const wheelSeg = fine
    ? { tube: 8, torus: 28, rim: 24, hub: 12, disc: 32 }
    : { tube: 5, torus: 12, rim: 10, hub: 8, disc: 12 };
  buildWheel(parts, FRONT_Z, FRONT_R, 0.048, wheelSeg, true);
  buildWheel(parts, REAR_Z, REAR_R, 0.062, wheelSeg, false);

  const forkSeg = fine ? 8 : 5;
  for (const side of [-1, 1]) {
    tube(parts, METAL, v(side * 0.08, FRONT_R, FRONT_Z), v(side * 0.048, 0.84, -0.52), 0.015, forkSeg);
    if (fine) tube(parts, BLACK, v(side * 0.08, FRONT_R + 0.02, FRONT_Z), v(side * 0.05, 0.76, -0.54), 0.02, 6);
  }
  tube(parts, BLACK, v(-0.09, 0.82, -0.53), v(0.09, 0.82, -0.53), 0.014, forkSeg);
  tube(parts, BLACK, v(-0.07, 0.68, -0.58), v(0.07, 0.68, -0.58), 0.012, forkSeg);
  for (const side of [-1, 1]) {
    tube(parts, BLACK, v(side * 0.055, 0.78, -0.54), v(side * 0.16, 0.86, -0.40), 0.01, fine ? 6 : 4);
    add(parts, BLACK, new THREE.CylinderGeometry(0.016, 0.016, 0.07, fine ? 8 : 5), v(side * 0.18, 0.86, -0.36), v(0, 0, Math.PI / 2));
  }

  tube(parts, BLACK, v(-0.05, 0.64, -0.42), v(-0.07, 0.46, 0.16), 0.014, forkSeg);
  tube(parts, BLACK, v(0.05, 0.64, -0.42), v(0.07, 0.46, 0.16), 0.014, forkSeg);
  add(parts, BLACK, new THREE.BoxGeometry(0.14, 0.14, 0.03), v(0, 0.52, -0.42));

  // Single-sided swingarm, pivot to the rear axle.
  const arm = new THREE.BoxGeometry(0.04, 0.055, 0.58);
  arm.translate(0, 0.01, 0.26);
  add(parts, BLACK, arm, v(-0.09, 0.40, 0.16), v(-0.06, 0, 0));
  add(parts, METAL, new THREE.CylinderGeometry(0.038, 0.038, 0.05, fine ? 12 : 6), v(-0.09, REAR_R, REAR_Z), v(0, 0, Math.PI / 2));

  // Short under-seat cans. Outlets stop at the tail tip.
  for (const side of [-1, 1]) {
    const seg = fine ? 10 : 6;
    tube(parts, METAL, v(side * 0.05, 0.48, -0.02), v(side * 0.042, 0.66, 0.14), 0.011, seg);
    add(parts, METAL, new THREE.CylinderGeometry(0.030, 0.024, 0.14, seg), v(side * 0.042, 0.70, 0.22), v(Math.PI / 2.6, 0, 0));
    add(parts, BLACK, new THREE.CylinderGeometry(0.020, 0.020, 0.012, seg), v(side * 0.042, 0.728, 0.29), v(Math.PI / 2.6, 0, 0));
  }

  add(parts, BLACK, new THREE.BoxGeometry(0.14, 0.035, 0.22), v(0, 0.86, 0.06), v(-0.08, 0, 0));
  add(parts, TAIL, new THREE.BoxGeometry(0.06, 0.012, 0.01), v(0, 0.80, 0.355));

  if (fine) {
    for (const side of [-1, 1]) {
      tube(parts, BLACK, v(side * 0.10, 0.40, 0.16), v(side * 0.17, 0.36, 0.20), 0.009, 5);
      add(parts, METAL, new THREE.CylinderGeometry(0.011, 0.011, 0.035, 6), v(side * 0.17, 0.36, 0.20), v(0, 0, Math.PI / 2));
    }
  }
}

function buildRider(parts, detail) {
  const fine = detail === "near";
  const seg = fine ? 8 : 5;
  const cap = fine ? 3 : 1;
  // Chest on the tank, hips on the seat, helmet tucked behind the screen.
  capsule(parts, SUIT, v(0, 0.90, 0.10), v(0, 1.00, -0.24), 0.088, seg, cap);
  capsule(parts, SUIT, v(0, 1.00, -0.22), v(0, 1.06, -0.34), 0.072, seg, cap);
  add(parts, HELMET, new THREE.SphereGeometry(1, fine ? 16 : 8, fine ? 12 : 6), v(0, 1.12, -0.40), v(0.55, 0, 0), v(0.105, 0.125, 0.130));
  if (fine) {
    const visor = [];
    for (let i = 0; i <= 5; i++) {
      const a = -0.7 + (i / 5) * 1.4;
      const row = [];
      for (let j = 0; j <= 2; j++) {
        const drop = j / 2;
        row.push(v(Math.sin(a) * (0.09 - drop * 0.01), 0.015 - drop * 0.055, -0.02 - Math.cos(a) * 0.02));
      }
      visor.push(row);
    }
    addGridSmooth(parts, VISOR, visor.map((row) => row.map((p) => {
      const q = p.clone();
      q.applyEuler(new THREE.Euler(0.7, 0, 0));
      q.add(v(0, 1.12, -0.46));
      return q;
    })), v(0, 1.12, -0.2));
  } else {
    add(parts, VISOR, new THREE.BoxGeometry(0.12, 0.05, 0.015), v(0, 1.10, -0.50), v(0.6, 0, 0));
  }

  for (const side of [-1, 1]) {
    const shoulder = v(side * 0.13, 1.02, -0.22);
    const elbow = v(side * 0.18, 0.92, -0.36);
    const hand = v(side * 0.17, 0.85, -0.36);
    capsule(parts, SUIT, shoulder, elbow, 0.042, seg, cap);
    capsule(parts, SUIT, elbow, hand, 0.034, seg, cap);
    add(parts, GEAR, new THREE.SphereGeometry(0.034, fine ? 8 : 5, fine ? 6 : 4), hand);

    const hip = v(side * 0.07, 0.88, 0.08);
    const knee = v(side * 0.14, 0.62, -0.08);
    const boot = v(side * 0.13, 0.40, 0.16);
    capsule(parts, SUIT, hip, knee, 0.058, seg, cap);
    capsule(parts, SUIT, knee, boot, 0.046, seg, cap);
    add(parts, GEAR, new THREE.CapsuleGeometry(0.04, 0.09, cap, seg), boot, v(Math.PI / 2.6, 0, side * 0.15));
  }
}

function mergedMesh(parts, materials, name) {
  const usedMaterials = [];
  const byMaterial = [];
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].length) continue;
    const flat = parts[i].map((geometry) => {
      const solid = geometry.index ? geometry.toNonIndexed() : geometry;
      solid.deleteAttribute("uv");
      return solid;
    });
    byMaterial.push(mergeGeometries(flat, false));
    usedMaterials.push(materials[i]);
  }
  const geometry = mergeGeometries(byMaterial, true);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, usedMaterials);
  mesh.name = name;
  mesh.castShadow = name.indexOf("_far") === -1;
  mesh.receiveShadow = true;
  return mesh;
}

function countTriangles(mesh) {
  const geometry = mesh.geometry;
  return geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
}

function assemble(detail, bikeName, riderName) {
  const bikeParts = partsFor(bikeMaterials);
  const riderParts = partsFor(riderMaterials);
  buildBike(bikeParts, detail);
  buildRider(riderParts, detail);
  return [mergedMesh(bikeParts, bikeMaterials, bikeName), mergedMesh(riderParts, riderMaterials, riderName)];
}

const [bike, rider] = assemble("near", "sport_bike", "sport_rider");
const [bikeFar, riderFar] = assemble("far", "sport_bike_far", "sport_rider_far");

const root = new THREE.Group();
root.name = "ArubaSportMoto";
root.add(bike, rider, bikeFar, riderFar);

const exporter = new GLTFExporter();
const result = await exporter.parseAsync(root, {
  binary: true,
  onlyVisible: true,
  trs: false,
  maxTextureSize: 256,
});
const output = process.env.MOTO_OUT
  ? pathToFileURL(process.env.MOTO_OUT)
  : new URL("../game/models/moto.glb", import.meta.url);
await writeFile(output, Buffer.from(result));

const nearTris = countTriangles(bike) + countTriangles(rider);
const farTris = countTriangles(bikeFar) + countTriangles(riderFar);
const box = new THREE.Box3();
box.expandByObject(bike);
box.expandByObject(rider);
const size = box.getSize(new THREE.Vector3());
console.log(`wrote ${output.pathname}`);
console.log(`near ${Math.round(nearTris)} tris (${Math.round(countTriangles(bike))} bike + ${Math.round(countTriangles(rider))} rider), far ${Math.round(farTris)} tris`);
console.log(`bounds ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)} m, y ${box.min.y.toFixed(2)}..${box.max.y.toFixed(2)}`);
console.log(`bytes ${Buffer.byteLength(result)}`);
