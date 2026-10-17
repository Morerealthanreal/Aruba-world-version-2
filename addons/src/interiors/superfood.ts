// Super Food Plaza, Bubali 141-A. The glass at the middle of the front opens
// into a short hall: Jack's Café, Bliss, and the supermarket counter.
// The red SUPER FOOD sign, the flags, and the glass shopfronts stay.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const SU_X = -8769.15;
export const SU_Z = -3535.9;

export const SU_POLY: [number, number][] = [
  [-8815.4, -3502.2],
  [-8750.2, -3482.1],
  [-8722.9, -3569.6],
  [-8788.1, -3589.7],
];

// Front edge, D at the south end and A at the north end. The entrance is the midpoint.
const CORNERS: [number, number][] = [
  [-46.25, 33.7],
  [18.95, 53.8],
  [46.25, -33.7],
  [-18.95, -53.8],
];
export const suLocal: Vol = frameFromEdge(CORNERS, 3, 0);
export const SU_DOOR_HALF = 2.35;
export const SU_DOOR_TOP = 3.45;
suLocal.doorAt = 0;
suLocal.depth = 12.6;
suLocal.halfW = 7.2;

const RED: [number, number, number] = [0.89, 0.13, 0.1];
const CREAM: [number, number, number] = [0.95, 0.93, 0.9];
const TILE_A: [number, number, number] = [0.93, 0.91, 0.88];
const TILE_B: [number, number, number] = [0.82, 0.28, 0.24];
const PINK: [number, number, number] = [0.86, 0.42, 0.55];
const ORANGE: [number, number, number] = [0.9, 0.45, 0.12];
const GREEN: [number, number, number] = [0.16, 0.5, 0.28];
const WOOD: [number, number, number] = [0.42, 0.26, 0.14];
const GOLD: [number, number, number] = [0.76, 0.6, 0.24];
const WARM: [number, number, number] = [1, 0.86, 0.55];

const BASE = 0.06;

/** along / inward solids. The centre aisle stays clear. */
export const SU_OBS: Box[] = [
  { a0: -6.5, a1: -3.1, d0: 8.5, d1: 11.6 },
  { a0: 3.1, a1: 6.5, d0: 8.5, d1: 11.6 },
  { a0: -2.3, a1: 2.3, d0: 10.9, d1: 12.4 },
  { a0: -3.4, a1: -1.8, d0: 4.15, d1: 5.25 },
  { a0: 1.8, a1: 3.4, d0: 4.15, d1: 5.25 },
  { a0: -6.7, a1: -5.05, d0: 2.2, d1: 4.85 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function benchGeo() {
  const b = new Builder();
  box(b, ident, -0.62, 0.62, -0.2, 0.2, 0.42, 0.5, WOOD);
  box(b, ident, -0.62, 0.62, -0.22, -0.14, 0.5, 0.84, RED);
  return b.geometry();
}

function signTexture(title: string, sub: string, lines: string[], bg: string, head: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = head;
  g.fillRect(0, 0, 512, sub ? 188 : 156);
  g.fillStyle = "#fffdf8";
  g.font = "700 54px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(title, 256, sub ? 62 : 78);
  if (sub) {
    g.font = "700 40px Arial, sans-serif";
    g.fillText(sub, 256, 128);
  }
  g.fillStyle = "#fffdf8";
  g.font = "600 36px Arial, sans-serif";
  lines.forEach((line, i) => g.fillText(line, 256, 250 + i * 68));
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Guest-facing board. The face toward the door reads left to right. */
function addBoard(b: Builder, f: Frame, d: number, a0: number, a1: number, y0: number, y1: number) {
  const face = (inward: number, normal: [number, number, number], uv: [[number, number], [number, number], [number, number], [number, number]]) => {
    b.quad([
      pt(f, a0, inward, y0), pt(f, a1, inward, y0),
      pt(f, a1, inward, y1), pt(f, a0, inward, y1),
    ], normal, [1, 1, 1], uv);
  };
  // This front edge runs opposite the other malls, so the door-facing
  // face uses the flipped UVs and still reads left to right.
  face(d, [-f.nx, 0, -f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
  face(d - 0.04, [f.nx, 0, f.nz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

export function buildSuperfood(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = suLocal.halfW;
  const depth = suLocal.depth;
  const doorL = -SU_DOOR_HALF;
  const doorR = SU_DOOR_HALF;

  shell.quad(
    [pt(f, -hw + 0.25, 0.18, BASE), pt(f, hw - 0.25, 0.18, BASE), pt(f, hw - 0.25, depth - 0.2, BASE), pt(f, -hw + 0.25, depth - 0.2, BASE)],
    [0, 1, 0], [0.9, 0.86, 0.84],
  );
  const step = 1.55;
  for (let a = -hw + 0.35; a < hw - 0.4; a += step) {
    for (let d = 0.28; d < depth - 0.3; d += step) {
      const a1 = Math.min(a + step - 0.08, hw - 0.3);
      const d1 = Math.min(d + step - 0.08, depth - 0.24);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.02), pt(f, a1, d, BASE + 0.02), pt(f, a1, d1, BASE + 0.02), pt(f, a, d1, BASE + 0.02)],
        [0, 1, 0], alt ? TILE_A : TILE_B,
      );
    }
  }
  shell.quad(
    [pt(f, -0.62, 0.35, BASE + 0.04), pt(f, 0.62, 0.35, BASE + 0.04), pt(f, 0.62, depth - 0.45, BASE + 0.04), pt(f, -0.62, depth - 0.45, BASE + 0.04)],
    [0, 1, 0], RED,
  );
  shell.quad(
    [pt(f, -hw + 0.3, 0.4, 3.42), pt(f, hw - 0.3, 0.4, 3.42), pt(f, hw - 0.3, depth - 0.22, 3.42), pt(f, -hw + 0.3, depth - 0.22, 3.42)],
    [0, -1, 0], CREAM,
  );
  box(shell, f, doorL, doorR, 0.16, 0.85, 3.22, 3.4, RED);

  box(shell, f, -hw + 0.12, -hw + 0.36, 0.3, depth - 0.22, BASE, 3.4, CREAM);
  box(shell, f, hw - 0.36, hw - 0.12, 0.3, depth - 0.22, BASE, 3.4, CREAM);
  box(shell, f, -hw + 0.28, hw - 0.28, depth - 0.36, depth - 0.16, BASE, 3.4, CREAM);
  box(shell, f, -hw + 0.2, doorL, 0.1, 0.32, BASE, SU_DOOR_TOP, CREAM);
  box(shell, f, doorR, hw - 0.2, 0.1, 0.32, BASE, SU_DOOR_TOP, CREAM);
  box(shell, f, -hw + 0.12, -hw + 0.4, 0.3, depth - 0.22, 2.45, 2.68, RED);
  box(shell, f, hw - 0.4, hw - 0.12, 0.3, depth - 0.22, 2.45, 2.68, RED);
  box(shell, f, -hw + 0.28, hw - 0.28, depth - 0.4, depth - 0.14, 2.45, 2.68, RED);

  // Jack's Café, south of the entrance.
  box(shell, f, -6.4, -3.2, 8.6, 11.5, BASE, BASE + 1.02, CREAM);
  box(shell, f, -6.45, -3.15, 8.48, 8.74, BASE + 1.02, BASE + 2.2, ORANGE);
  box(shell, f, -6.25, -3.35, 8.45, 8.6, BASE + 1.02, BASE + 1.14, WOOD);
  box(shell, f, -5.7, -4.9, 9.15, 9.85, BASE + 1.05, BASE + 1.38, ORANGE);
  box(shell, f, -4.5, -3.7, 9.2, 9.75, BASE + 1.05, BASE + 1.28, WOOD);
  // Bliss, north of the entrance.
  box(shell, f, 3.2, 6.4, 8.6, 11.5, BASE, BASE + 1.02, CREAM);
  box(shell, f, 3.15, 6.45, 8.48, 8.74, BASE + 1.02, BASE + 2.2, PINK);
  box(shell, f, 3.35, 6.25, 8.45, 8.6, BASE + 1.02, BASE + 1.14, GOLD);
  box(shell, f, 3.7, 4.5, 9.15, 9.8, BASE + 1.05, BASE + 1.36, PINK);
  box(shell, f, 4.9, 5.7, 9.2, 9.7, BASE + 1.05, BASE + 1.26, GOLD);
  // Supermarket counter at the back of the hall.
  box(shell, f, -2.15, 2.15, 11.05, 12.25, BASE, BASE + 1.02, CREAM);
  box(shell, f, -2.25, 2.25, 10.92, 11.18, BASE + 1.02, BASE + 2.25, RED);
  box(shell, f, -2.0, 2.0, 10.88, 11.04, BASE + 1.02, BASE + 1.14, GOLD);
  box(shell, f, -1.5, -0.7, 11.35, 11.85, BASE + 1.05, BASE + 1.4, GREEN);
  box(shell, f, -0.4, 0.45, 11.4, 11.8, BASE + 1.05, BASE + 1.32, RED);
  box(shell, f, 0.75, 1.6, 11.35, 11.75, BASE + 1.05, BASE + 1.28, GOLD);

  // Cart corral just inside the door, off the aisle.
  for (let i = 0; i < 3; i++) {
    const d0 = 2.4 + i * 0.75;
    box(shell, f, -6.45, -5.25, d0, d0 + 0.55, BASE + 0.15, BASE + 0.85, RED);
    box(shell, f, -6.4, -5.3, d0 + 0.08, d0 + 0.47, BASE + 0.35, BASE + 0.72, CREAM);
  }

  for (const d of [3.3, 6.5, 9.5]) {
    box(shell, f, -0.14, 0.14, d - 0.14, d + 0.14, 3.02, 3.2, WARM);
  }

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:superfood:shell";
  group.add(shellMesh);

  const boards: [string, string, string[], string, string, number, number, number, number, number][] = [
    ["JACK'S", "CAFE", ["Orange Juice", "Pea Soup", "Coffee"], "#e6731a", "#8a3e08", -6.15, -3.45, 8.42, BASE + 1.16, BASE + 2.08],
    ["BLISS", "", ["Sunblock", "Makeup"], "#db6b8c", "#db6b8c", 3.45, 6.15, 8.42, BASE + 1.16, BASE + 2.08],
    ["SUPER FOOD", "", ["Produce", "Bakery"], "#e2231a", "#e2231a", -1.9, 1.9, 10.86, BASE + 1.16, BASE + 2.12],
    ["SUPER FOOD", "PLAZA", ["Bliss", "Jack's", "Groceries"], "#fff6f4", "#e2231a", -2.15, 2.15, 2.2, 2.15, 3.05],
  ];
  boards.forEach((s, i) => {
    const tex = signTexture(s[0], s[1], s[2], s[3], s[4]);
    if (!tex) return;
    const b = new Builder();
    addBoard(b, f, s[7], s[5], s[6], s[8], s[9]);
    const mesh = new Mesh(b.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:superfood:sign" + i;
    group.add(mesh);
  });

  const spots: [number, number][] = [[-2.6, 4.7], [2.6, 4.7]];
  const benches = new InstancedMesh(benchGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  benches.name = "aw:superfood:benches";
  benches.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.ux, f.uz));
    benches.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  benches.count = spots.length;
  benches.instanceMatrix.needsUpdate = true;
  benches.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
  group.add(benches);
}
