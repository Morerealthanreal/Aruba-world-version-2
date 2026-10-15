#!/usr/bin/env node
// Rebuild game/models/moto.glb as a slim sport superbike.
// Procedural geometry only — original shapes, no manufacturer marks.
// Run after `npm ci` in addons/: node tools/generate_moto.mjs
import * as THREE from "../addons/node_modules/three/build/three.module.js";
import { mergeGeometries } from "../addons/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import { GLTFExporter } from "../addons/node_modules/three/examples/jsm/exporters/GLTFExporter.js";
import { writeFile } from "node:fs/promises";

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

// Open arch: left lower edge, over the sharp shoulder, to the right lower edge.
function arch(w, yTop, ySide, yBot, shoulder = 0.4) {
  const rise = Math.max(0.01, yTop - ySide);
  return mirrorProfile([
    [w * 0.62, yBot],
    [w * 0.98, ySide],
    [w * 1.0, ySide + rise * 0.42],
    [w * shoulder, yTop - Math.min(0.012, rise * 0.18)],
    [0, yTop],
  ]);
}

function stationGrid(stations, profile) {
  return stations.map((s) => profile(s).map(([x, y]) => v(x, y, s.z)));
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

function subdivideStations(stations) {
  const out = [];
  for (let i = 0; i < stations.length - 1; i++) {
    const a = stations[i], b = stations[i + 1];
    out.push(a);
    const mid = {};
    for (const key of Object.keys(a)) mid[key] = (a[key] + b[key]) * 0.5;
    out.push(mid);
  }
  out.push(stations[stations.length - 1]);
  return out;
}

// Front of the bike is -Z so heading 0 (movement toward -Z) matches the nose.
const FRONT_Z = -0.72;
const REAR_Z = 0.75;
const FRONT_R = 0.305;
const REAR_R = 0.325;

const FRONT_COWL = [
  { z: -1.20, w: 0.006, yt: 0.50, ys: 0.49, yb: 0.48 },
  { z: -1.12, w: 0.035, yt: 0.58, ys: 0.54, yb: 0.50 },
  { z: -1.04, w: 0.07, yt: 0.70, ys: 0.62, yb: 0.52 },
  { z: -0.96, w: 0.11, yt: 0.84, ys: 0.68, yb: 0.50 },
  { z: -0.88, w: 0.15, yt: 0.98, ys: 0.74, yb: 0.46 },
  { z: -0.80, w: 0.185, yt: 1.06, ys: 0.74, yb: 0.42 },
  { z: -0.72, w: 0.20, yt: 1.02, ys: 0.68, yb: 0.38 },
  { z: -0.64, w: 0.19, yt: 0.94, ys: 0.64, yb: 0.40 },
  { z: -0.56, w: 0.16, yt: 0.90, ys: 0.68, yb: 0.50 },
];

const TAIL_SHELL = [
  { z: -0.46, w: 0.145, yt: 0.88, ys: 0.74 },
  { z: -0.30, w: 0.15, yt: 0.98, ys: 0.78 },
  { z: -0.14, w: 0.14, yt: 0.92, ys: 0.76 },
  { z: 0.02, w: 0.125, yt: 0.84, ys: 0.74 },
  { z: 0.16, w: 0.10, yt: 0.86, ys: 0.78 },
  { z: 0.30, w: 0.06, yt: 0.90, ys: 0.82 },
  { z: 0.42, w: 0.025, yt: 0.86, ys: 0.82 },
  { z: 0.52, w: 0.006, yt: 0.81, ys: 0.79 },
];

function upperArch(w, yTop, ySide) {
  const rise = Math.max(0.01, yTop - ySide);
  return mirrorProfile([
    [w, ySide],
    [w * 0.94, ySide + rise * 0.38],
    [w * 0.36, yTop - Math.min(0.01, rise * 0.15)],
    [0, yTop],
  ]);
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
    const spoke = new THREE.BoxGeometry(0.028, radius * 0.62, 0.07);
    spoke.translate(0, radius * 0.42, 0);
    add(parts, WHEEL, spoke, v(0, y, z), v((i * Math.PI * 2) / 5 + 0.15, 0, 0));
  }
  const discs = front
    ? [{ x: -0.07, r: 0.185 }, { x: 0.07, r: 0.185 }]
    : [{ x: 0.078, r: 0.16 }];
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

function paintShell(parts, stations) {
  const full = stationGrid(stations, (s) => arch(s.w, s.yt, s.ys, s.yb));
  const upper = full.map((ring) => ring.slice(2, 7));
  const left = full.map((ring) => ring.slice(0, 3));
  const right = full.map((ring) => ring.slice(6, 9));
  addGridSmooth(parts, PAINT, upper);
  addGridSmooth(parts, PAINT, left);
  addGridSmooth(parts, PAINT, right);
}

function buildBike(parts, detail) {
  const fine = detail === "near";
  const cowl = fine ? subdivideStations(FRONT_COWL) : FRONT_COWL;
  const tail = fine ? subdivideStations(TAIL_SHELL) : TAIL_SHELL;
  paintShell(parts, cowl);
  addGridSmooth(parts, PAINT, stationGrid(tail, (s) => upperArch(s.w, s.yt, s.ys)), v(0, 0.2, 0));

  // Slim belly pan between the wheels. Stays clear of both tyres.
  const belly = fine
    ? [
      { z: -0.40, w: 0.11, yt: 0.40, yb: 0.30 },
      { z: -0.16, w: 0.135, yt: 0.40, yb: 0.27 },
      { z: 0.08, w: 0.13, yt: 0.40, yb: 0.28 },
      { z: 0.28, w: 0.09, yt: 0.42, yb: 0.32 },
    ]
    : [
      { z: -0.36, w: 0.12, yt: 0.40, yb: 0.29 },
      { z: 0.22, w: 0.09, yt: 0.42, yb: 0.32 },
    ];
  addGridSmooth(parts, PAINT, stationGrid(belly, (s) => mirrorProfile([
    [s.w, s.yt],
    [s.w * 0.7, s.yb],
    [0, s.yb - 0.01],
  ])), v(0, 0.7, 0));

  // Shaped side blister with a machined gold cover standing proud of it.
  for (const side of [-1, 1]) {
    add(parts, PAINT, new THREE.CylinderGeometry(0.15, 0.15, 0.012, fine ? 20 : 10), v(side * 0.15, 0.52, -0.04), v(0, 0, Math.PI / 2));
    add(parts, GOLD, new THREE.CylinderGeometry(0.092, 0.098, 0.03, fine ? 20 : 10), v(side * 0.168, 0.52, -0.04), v(0, 0, Math.PI / 2));
    add(parts, GOLD, new THREE.CylinderGeometry(0.045, 0.045, 0.012, fine ? 12 : 8), v(side * 0.188, 0.52, -0.04), v(0, 0, Math.PI / 2));
    if (fine) {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        add(parts, METAL, new THREE.CylinderGeometry(0.008, 0.008, 0.01, 6), v(side * 0.186, 0.52 + Math.sin(a) * 0.07, -0.04 + Math.cos(a) * 0.07), v(0, 0, Math.PI / 2));
      }
      add(parts, GOLD, new THREE.BoxGeometry(0.018, 0.045, 0.14), v(side * 0.16, 0.66, -0.02));
    }
  }

  // Swept white intake on each side of the nose, dark slot inside.
  for (const side of [-1, 1]) {
    const x = side * 0.232;
    const sheet = (ox, y0, y1, z0, z1) => [[
      v(x + ox, y0, z0), v(x + ox, y1, z0 - 0.02), v(x + ox, y1 - 0.02, z1), v(x + ox, y0 - 0.03, z1 + 0.03),
    ], [
      v(x + ox + side * 0.008, y0, z0), v(x + ox + side * 0.008, y1, z0 - 0.02), v(x + ox + side * 0.008, y1 - 0.02, z1), v(x + ox + side * 0.008, y0 - 0.03, z1 + 0.03),
    ]];
    addGrid(parts, VENT, sheet(0, 0.42, 0.72, -0.62, -1.02), v(0, 0.55, -0.82));
    addGrid(parts, BLACK, sheet(side * 0.014, 0.50, 0.64, -0.74, -0.92), v(0, 0.55, -0.82));
  }

  // Sharp twin lamps low in the nose.
  for (const side of [-1, 1]) {
    add(parts, LIGHT, new THREE.BoxGeometry(0.07, 0.02, 0.012), v(side * 0.05, 0.66, -1.10), v(-0.55, side * 0.35, 0));
  }

  // Tall screen growing out of the nose and leaning back toward the helmet.
  {
    const rows = fine ? 6 : 3;
    const cols = fine ? 8 : 4;
    const screen = [];
    for (let i = 0; i < rows; i++) {
      const t = i / (rows - 1);
      const z = -0.94 + t * 0.30;
      const y0 = 1.00 + t * 0.34;
      const half = 0.13 - t * 0.04;
      const row = [];
      for (let j = 0; j < cols; j++) {
        const u = j / (cols - 1) * 2 - 1;
        row.push(v(u * half, y0 - Math.abs(u) * 0.03, z - Math.abs(u) * 0.035 + Math.sin(t * Math.PI) * 0.02));
      }
      screen.push(row);
    }
    addGridSmooth(parts, GLASS, screen, v(0, 0.7, -0.5));
    add(parts, BLACK, new THREE.BoxGeometry(0.22, 0.012, 0.02), v(0, 0.93, -1.00));
  }
  if (fine) {
    for (const side of [-1, 1]) {
      tube(parts, BLACK, v(side * 0.14, 0.96, -0.78), v(side * 0.30, 1.06, -0.62), 0.009, 6);
      add(parts, BLACK, new THREE.BoxGeometry(0.09, 0.05, 0.014), v(side * 0.32, 1.07, -0.58), v(0.15, side * 0.4, 0));
      add(parts, METAL, new THREE.BoxGeometry(0.07, 0.034, 0.006), v(side * 0.32, 1.07, -0.57), v(0.15, side * 0.4, 0));
    }
  }

  // Close-fitting front fender and a short rear hugger, arched over the tyres.
  const fenderSteps = fine ? 10 : 5;
  addGridSmooth(parts, PAINT, wheelArch(FRONT_R + 0.04, 0.09, FRONT_Z, FRONT_R, -0.9, 0.7, fenderSteps), v(0, FRONT_R, FRONT_Z));
  addGridSmooth(parts, BLACK, wheelArch(REAR_R + 0.035, 0.11, REAR_Z, REAR_R, -0.2, 1.15, fenderSteps), v(0, REAR_R, REAR_Z));

  const wheelSeg = fine
    ? { tube: 8, torus: 24, rim: 20, hub: 14, disc: 28 }
    : { tube: 5, torus: 12, rim: 10, hub: 8, disc: 12 };
  buildWheel(parts, FRONT_Z, FRONT_R, 0.05, wheelSeg, true);
  buildWheel(parts, REAR_Z, REAR_R, 0.064, wheelSeg, false);

  // Forks, yokes and low clip-ons. Rake matches the nose.
  const forkSeg = fine ? 8 : 5;
  for (const side of [-1, 1]) {
    tube(parts, METAL, v(side * 0.09, FRONT_R, FRONT_Z), v(side * 0.055, 0.86, -0.50), 0.016, forkSeg);
    if (fine) tube(parts, BLACK, v(side * 0.09, FRONT_R + 0.02, FRONT_Z), v(side * 0.055, 0.78, -0.52), 0.022, 6);
  }
  tube(parts, BLACK, v(-0.10, 0.84, -0.51), v(0.10, 0.84, -0.51), 0.016, forkSeg);
  tube(parts, BLACK, v(-0.08, 0.70, -0.56), v(0.08, 0.70, -0.56), 0.014, forkSeg);
  for (const side of [-1, 1]) {
    tube(parts, BLACK, v(side * 0.07, 0.72, -0.55), v(side * 0.18, 0.86, -0.40), 0.011, fine ? 6 : 4);
    tube(parts, BLACK, v(side * 0.16, 0.85, -0.42), v(side * 0.22, 0.86, -0.36), 0.014, fine ? 6 : 4);
  }

  // Frame spars and a dark radiator, visible through the open midriff.
  tube(parts, BLACK, v(-0.06, 0.62, -0.42), v(-0.08, 0.48, 0.18), 0.016, forkSeg);
  tube(parts, BLACK, v(0.06, 0.62, -0.42), v(0.08, 0.48, 0.18), 0.016, forkSeg);
  add(parts, BLACK, new THREE.BoxGeometry(0.16, 0.16, 0.04), v(0, 0.50, -0.40));
  add(parts, BLACK, new THREE.BoxGeometry(0.20, 0.16, 0.22), v(0, 0.48, -0.02));

  // Single-sided swingarm on the left, pivot to the rear axle.
  const arm = new THREE.BoxGeometry(0.045, 0.07, 0.62);
  arm.translate(0, 0.01, 0.28);
  add(parts, BLACK, arm, v(-0.10, 0.40, 0.12), v(-0.08, 0, 0));
  add(parts, METAL, new THREE.CylinderGeometry(0.04, 0.04, 0.06, fine ? 12 : 6), v(-0.10, REAR_R, REAR_Z), v(0, 0, Math.PI / 2));

  // Short cans tucked under the tail, outlets just proud of the cowl.
  for (const side of [-1, 1]) {
    const seg = fine ? 10 : 6;
    tube(parts, METAL, v(side * 0.07, 0.50, 0.02), v(side * 0.08, 0.62, 0.28), 0.02, seg);
    add(parts, METAL, new THREE.CylinderGeometry(0.038, 0.03, 0.22, seg), v(side * 0.08, 0.66, 0.40), v(Math.PI / 2.15, 0, 0));
    add(parts, BLACK, new THREE.CylinderGeometry(0.026, 0.026, 0.016, seg), v(side * 0.08, 0.68, 0.52), v(Math.PI / 2.15, 0, 0));
  }

  // Seat pad and a thin lamp across the short tail.
  add(parts, BLACK, new THREE.BoxGeometry(0.16, 0.04, 0.28), v(0, 0.86, 0.10), v(-0.06, 0, 0));
  add(parts, TAIL, new THREE.BoxGeometry(0.08, 0.016, 0.01), v(0, 0.82, 0.515));

  if (fine) {
    // Rearsets, so the boots meet a peg.
    for (const side of [-1, 1]) {
      tube(parts, BLACK, v(side * 0.12, 0.40, 0.22), v(side * 0.20, 0.36, 0.26), 0.01, 5);
      add(parts, METAL, new THREE.CylinderGeometry(0.012, 0.012, 0.04, 6), v(side * 0.20, 0.36, 0.26), v(0, 0, Math.PI / 2));
    }
    tube(parts, BLACK, v(-0.09, 0.40, 0.02), v(-0.11, REAR_R, REAR_Z - 0.08), 0.008, 4);
  }
}

function buildRider(parts, detail) {
  const fine = detail === "near";
  const seg = fine ? 8 : 5;
  const cap = fine ? 3 : 1;
  // Flat sport tuck: hips on the seat, chest on the tank, helmet just behind the screen.
  capsule(parts, SUIT, v(0, 0.92, 0.16), v(0, 1.02, -0.08), 0.11, seg, cap);
  capsule(parts, SUIT, v(0, 1.02, -0.08), v(0, 1.10, -0.30), 0.105, seg, cap);
  add(parts, HELMET, new THREE.SphereGeometry(1, fine ? 16 : 8, fine ? 12 : 6), v(0, 1.18, -0.40), v(0.35, 0, 0), v(0.12, 0.14, 0.145));
  add(parts, HELMET, new THREE.SphereGeometry(1, fine ? 10 : 6, fine ? 8 : 5), v(0, 1.12, -0.48), v(0.4, 0, 0), v(0.09, 0.07, 0.08));
  add(parts, VISOR, new THREE.BoxGeometry(0.15, 0.07, 0.02), v(0, 1.16, -0.52), v(0.5, 0, 0));

  for (const side of [-1, 1]) {
    const shoulder = v(side * 0.16, 1.08, -0.18);
    const elbow = v(side * 0.22, 0.96, -0.36);
    const hand = v(side * 0.16, 0.84, -0.50);
    capsule(parts, SUIT, shoulder, elbow, 0.05, seg, cap);
    capsule(parts, SUIT, elbow, hand, 0.04, seg, cap);
    add(parts, GEAR, new THREE.SphereGeometry(0.042, fine ? 8 : 5, fine ? 6 : 4), hand);

    const hip = v(side * 0.09, 0.92, 0.12);
    const knee = v(side * 0.16, 0.66, -0.02);
    const boot = v(side * 0.14, 0.40, 0.22);
    capsule(parts, SUIT, hip, knee, 0.072, seg, cap);
    capsule(parts, SUIT, knee, boot, 0.055, seg, cap);
    add(parts, GEAR, new THREE.CapsuleGeometry(0.048, 0.11, cap, seg), boot, v(Math.PI / 2.5, 0, side * 0.2), v(1, 1, 1.2));
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
const output = new URL("../game/models/moto.glb", import.meta.url);
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
