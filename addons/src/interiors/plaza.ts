// Palm Beach Plaza, the east rotunda entrance off the parking aisle.
// The blue glass under the PALM BEACH PLAZA canopy opens into a short mall
// hall: Skechers and Niel's shopfronts, a cinema marquee, benches, directory.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const PB_X = -7891.58;
export const PB_Z = -5983.49;

export const PB_POLY: [number, number][] = [
  [-7971.5, -5946.6],
  [-7932.6, -5941.9],
  [-7933.2, -5937],
  [-7928.7, -5936.4],
  [-7928.1, -5941.4],
  [-7870.6, -5935.2],
  [-7871.9, -5933.5],
  [-7871.4, -5931.2],
  [-7869.7, -5930.2],
  [-7867.6, -5930.6],
  [-7866.8, -5931.4],
  [-7866.5, -5933.6],
  [-7867.9, -5935.3],
  [-7869.9, -5935.6],
  [-7866.5, -5970.7],
  [-7885.8, -5972.7],
  [-7884.4, -5986.3],
  [-7865.1, -5984.4],
  [-7861.6, -6019.9],
  [-7860.2, -6019.4],
  [-7858.2, -6019.9],
  [-7857, -6021.7],
  [-7857.4, -6023.7],
  [-7859.3, -6025],
  [-7861.4, -6024.6],
  [-7862.6, -6022.9],
  [-7862.3, -6020.7],
  [-7919.6, -6026.3],
  [-7919.1, -6032.4],
  [-7923, -6032.8],
  [-7923.2, -6030.6],
  [-7926.2, -6030.9],
  [-7926.5, -6027.1],
  [-7961.6, -6030.5],
];

// Glass door faces east. Along points north, inward points west into the hall.
export const pbLocal: Vol = {
  mx: 39.8,
  mz: -17.5,
  ux: -0.0995,
  uz: 0.995,
  nx: -0.995,
  nz: -0.0995,
  halfW: 6.2,
  depth: 22,
  minX: -20,
  maxX: 55,
  minZ: -45,
  maxZ: 10,
  doorAt: 0,
  mouthIn: 13.2,
};
export const PB_DOOR_HALF = 3.3;
export const PB_DOOR_TOP = 4.65;

const BLUE: [number, number, number] = [0.05, 0.28, 0.72];
const BLUE_D: [number, number, number] = [0.03, 0.16, 0.42];
const CREAM: [number, number, number] = [0.95, 0.93, 0.9];
const TILE_A: [number, number, number] = [0.93, 0.93, 0.9];
const TILE_B: [number, number, number] = [0.72, 0.78, 0.82];
const PEACH: [number, number, number] = [0.84, 0.58, 0.4];
const RED: [number, number, number] = [0.72, 0.08, 0.12];
const YEL: [number, number, number] = [0.95, 0.78, 0.12];
const WOOD: [number, number, number] = [0.45, 0.3, 0.16];

/** along / inward solids. The centre aisle (along 0) stays clear. */
export const PB_OBS: Box[] = [
  { a0: 3.15, a1: 5.85, d0: 14.1, d1: 16.5 },
  { a0: -5.85, a1: -3.15, d0: 14.1, d1: 16.5 },
  { a0: -2.3, a1: 2.3, d0: 19.1, d1: 21.3 },
  { a0: 2.05, a1: 3.15, d0: 13.5, d1: 14.85 },
  { a0: -3.15, a1: -2.05, d0: 13.5, d1: 14.85 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function benchGeo() {
  const b = new Builder();
  box(b, ident, -0.55, 0.55, -0.22, 0.22, 0.42, 0.5, WOOD);
  box(b, ident, -0.55, 0.55, -0.24, -0.16, 0.5, 0.92, BLUE_D);
  for (const [x, z] of [[-0.46, -0.16], [0.46, -0.16], [-0.46, 0.16], [0.46, 0.16]] as const) {
    box(b, ident, x - 0.03, x + 0.03, z - 0.03, z + 0.03, 0.04, 0.42, [0.25, 0.27, 0.3]);
  }
  return b.geometry();
}

function signTexture(title: string, sub: string, bg: string, fg: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = fg;
  g.font = "700 54px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(title, 256, sub ? 100 : 128);
  if (sub) {
    g.font = "600 28px Arial, sans-serif";
    g.fillText(sub, 256, 168);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function board(b: Builder, f: Frame, a0: number, a1: number, d: number, y0: number, y1: number, normal: 1 | -1) {
  const n: [number, number, number] = [f.nx * normal, 0, f.nz * normal];
  const uv: [[number, number], [number, number], [number, number], [number, number]] = normal < 0
    ? [[1, 0], [0, 0], [0, 1], [1, 1]]
    : [[0, 0], [1, 0], [1, 1], [0, 1]];
  b.quad([
    pt(f, a0, d, y0), pt(f, a1, d, y0), pt(f, a1, d, y1), pt(f, a0, d, y1),
  ], n, [1, 1, 1], uv);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

export function buildPlaza(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = pbLocal.halfW;
  const depth = pbLocal.depth;
  const doorL = -PB_DOOR_HALF;
  const doorR = PB_DOOR_HALF;

  shell.quad(
    [pt(f, -hw + 0.3, 0.15, 0.02), pt(f, hw - 0.3, 0.15, 0.02), pt(f, hw - 0.3, depth - 0.25, 0.02), pt(f, -hw + 0.3, depth - 0.25, 0.02)],
    [0, 1, 0], [0.8, 0.8, 0.78],
  );
  const step = 1.8;
  for (let a = -hw + 0.45; a < hw - 0.5; a += step) {
    for (let d = 0.2; d < depth - 0.35; d += step) {
      const a1 = Math.min(a + step - 0.06, hw - 0.4);
      const d1 = Math.min(d + step - 0.06, depth - 0.3);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, 0.06), pt(f, a1, d, 0.06), pt(f, a1, d1, 0.06), pt(f, a, d1, 0.06)],
        [0, 1, 0], alt ? TILE_A : TILE_B,
      );
    }
  }
  shell.quad(
    [pt(f, -hw + 0.35, 0.4, 4.35), pt(f, hw - 0.35, 0.4, 4.35), pt(f, hw - 0.35, depth - 0.3, 4.35), pt(f, -hw + 0.35, depth - 0.3, 4.35)],
    [0, -1, 0], [0.96, 0.96, 0.94],
  );
  // blue soffit just inside the canopy
  box(shell, f, doorL, doorR, 0.25, 1.3, 4.15, 4.4, BLUE);

  box(shell, f, -hw + 0.2, -hw + 0.38, 0.4, depth - 0.3, 0.04, 4.3, CREAM);
  box(shell, f, hw - 0.38, hw - 0.2, 0.4, depth - 0.3, 0.04, 4.3, CREAM);
  box(shell, f, -hw + 0.3, hw - 0.3, depth - 0.35, depth - 0.18, 0.04, 4.3, CREAM);
  box(shell, f, -hw + 0.3, doorL, 0.12, 0.32, 0.02, PB_DOOR_TOP, PEACH);
  box(shell, f, doorR, hw - 0.3, 0.12, 0.32, 0.02, PB_DOOR_TOP, PEACH);

  // Skechers, north side of the aisle, past the footprint edge
  box(shell, f, 3.2, 5.8, 14.2, 16.4, 0.05, 1.05, CREAM);
  box(shell, f, 3.2, 5.8, 14.15, 14.4, 1.05, 2.55, BLUE);
  box(shell, f, 3.25, 5.75, 14.1, 14.28, 2.55, 2.72, YEL);
  // Niel's, south side
  box(shell, f, -5.8, -3.2, 14.2, 16.4, 0.05, 1.05, CREAM);
  box(shell, f, -5.8, -3.2, 14.15, 14.4, 1.05, 2.45, [0.15, 0.18, 0.45]);
  // cinema counter at the back of the hall
  box(shell, f, -2.2, 2.2, 19.2, 21.2, 0.05, 1.1, [0.12, 0.12, 0.14]);
  box(shell, f, -2.8, 2.8, 19.05, 19.3, 1.1, 2.7, RED);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:plaza:shell";
  group.add(shellMesh);

  const signs: [string, string, string, string, number, number, number, number, number][] = [
    ["SKECHERS", "", "#0a2a6b", "#ffe14a", 3.25, 5.75, 14.12, 1.2, 2.45],
    ["NIEL'S", "FASHION", "#101433", "#ffffff", -5.75, -3.25, 14.12, 1.15, 2.35],
    ["CARIBBEAN", "CINEMAS", "#b00018", "#ffffff", -2.1, 2.1, 19.02, 1.25, 2.55],
    ["PALM BEACH", "PLAZA", "#08306b", "#ffffff", -1.8, 1.8, 6.4, 2.85, 4.05],
  ];
  signs.forEach((s, i) => {
    const tex = signTexture(s[0], s[1], s[2], s[3]);
    if (!tex) return;
    const b = new Builder();
    board(b, f, s[4], s[5], s[6], s[7], s[8], -1);
    const mesh = new Mesh(b.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:plaza:sign" + i;
    group.add(mesh);
  });

  const spots: [number, number][] = [[2.6, 14.15], [-2.6, 14.15]];
  const benches = new InstancedMesh(benchGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  benches.name = "aw:plaza:benches";
  benches.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], 0, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.ux, f.uz));
    benches.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  benches.count = spots.length;
  benches.instanceMatrix.needsUpdate = true;
  benches.boundingSphere = new Sphere(new Vector3(0, 1, 0), 24);
  group.add(benches);
}
