// Renaissance Mall, the Havenstraat center bay in Oranjestad.
// The glass under the ARUBA ALOE sign opens into a short hall: Hot Look and
// Pier Market counters, an Aruba Aloe stand, and benches. The clay-pink facade,
// awnings, and the shop signs on the street stay.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const RN_X = -7394.59;
export const RN_Z = 73.48;

export const RN_POLY: [number, number][] = [
  [-7455.2, 74], [-7445.5, 81.5], [-7448.2, 84.9], [-7443.9, 88.2], [-7441.1, 84.6],
  [-7416.9, 103.3], [-7418.3, 105.1], [-7409.5, 111.9], [-7406, 107.4], [-7392.2, 118],
  [-7383.1, 107.9], [-7378.1, 112.9], [-7349.3, 74.9], [-7354.7, 70.9], [-7349, 63.4],
  [-7343.6, 67.5], [-7340.6, 63.5], [-7359, 48.5], [-7354.5, 42.7], [-7364.4, 35],
  [-7365.7, 36.8], [-7402.9, 7.9], [-7423.4, 37], [-7425.1, 35.7],
];

// Havenstraat edge, A at the west end, B at the east end. Default normal points in.
const CORNERS: [number, number][] = [
  [-8.31, -65.58],
  [28.89, -36.68],
  [28.89 + -0.6135 * 16, -36.68 + 0.7897 * 16],
  [-8.31 + -0.6135 * 16, -65.58 + 0.7897 * 16],
];
export const rnLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const RN_DOOR_HALF = 2.55;
export const RN_DOOR_TOP = 3.4;
rnLocal.doorAt = 0;
rnLocal.depth = 13.6;
rnLocal.halfW = 6.4;

const CREAM: [number, number, number] = [0.94, 0.9, 0.82];
const CREAM_D: [number, number, number] = [0.86, 0.8, 0.7];
const TERR: [number, number, number] = [0.62, 0.26, 0.14];
const TILE_A: [number, number, number] = [0.91, 0.87, 0.78];
const TILE_B: [number, number, number] = [0.76, 0.6, 0.46];
const RED: [number, number, number] = [0.82, 0.08, 0.1];
const NAVY: [number, number, number] = [0.08, 0.16, 0.42];
const GREEN: [number, number, number] = [0.08, 0.52, 0.22];
const GOLD: [number, number, number] = [0.72, 0.56, 0.22];
const WOOD: [number, number, number] = [0.4, 0.26, 0.14];

const BASE = 0.06;

/** along / inward solids. The centre aisle stays clear. */
export const RN_OBS: Box[] = [
  { a0: -5.5, a1: -2.4, d0: 9.5, d1: 12.4 },
  { a0: 2.4, a1: 5.5, d0: 9.5, d1: 12.4 },
  { a0: -1.8, a1: 1.8, d0: 11.5, d1: 13.35 },
  { a0: -2.9, a1: -1.7, d0: 4.4, d1: 5.5 },
  { a0: 1.7, a1: 2.9, d0: 4.4, d1: 5.5 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function benchGeo() {
  const b = new Builder();
  box(b, ident, -0.7, 0.7, -0.22, 0.22, 0.42, 0.5, WOOD);
  box(b, ident, -0.7, 0.7, -0.24, -0.16, 0.5, 0.88, TERR);
  for (const [x, z] of [[-0.58, -0.16], [0.58, -0.16], [-0.58, 0.16], [0.58, 0.16]] as const) {
    box(b, ident, x - 0.03, x + 0.03, z - 0.03, z + 0.03, 0.04, 0.42, [0.28, 0.22, 0.16]);
  }
  return b.geometry();
}

function signTexture(title: string, sub: string, lines: string[], bg: string, head: string, fg: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = head;
  g.fillRect(0, 0, 512, sub ? 196 : 150);
  g.fillStyle = "#fffdf8";
  g.font = "700 58px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(title, 256, sub ? 72 : 75);
  if (sub) {
    g.font = "600 36px Arial, sans-serif";
    g.fillText(sub, 256, 140);
  }
  g.fillStyle = fg;
  g.font = "600 40px Arial, sans-serif";
  lines.forEach((line, i) => g.fillText(line, 256, 280 + i * 70));
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function addBoard(b: Builder, f: Frame, d: number, a0: number, a1: number, y0: number, y1: number) {
  const face = (inward: number, normal: [number, number, number], uv: [[number, number], [number, number], [number, number], [number, number]]) => {
    b.quad([
      pt(f, a0, inward, y0), pt(f, a1, inward, y0),
      pt(f, a1, inward, y1), pt(f, a0, inward, y1),
    ], normal, [1, 1, 1], uv);
  };
  // Frame does not flip, so the guest-facing -N face reads left to right.
  face(d, [-f.nx, 0, -f.nz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
  face(d - 0.04, [f.nx, 0, f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

export function buildRenmall(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = rnLocal.halfW;
  const depth = rnLocal.depth;
  const doorL = -RN_DOOR_HALF;
  const doorR = RN_DOOR_HALF;

  shell.quad(
    [pt(f, -hw + 0.25, 0.2, BASE), pt(f, hw - 0.25, 0.2, BASE), pt(f, hw - 0.25, depth - 0.2, BASE), pt(f, -hw + 0.25, depth - 0.2, BASE)],
    [0, 1, 0], CREAM_D,
  );
  const step = 1.7;
  for (let a = -hw + 0.35; a < hw - 0.4; a += step) {
    for (let d = 0.3; d < depth - 0.3; d += step) {
      const a1 = Math.min(a + step - 0.08, hw - 0.32);
      const d1 = Math.min(d + step - 0.08, depth - 0.25);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.02), pt(f, a1, d, BASE + 0.02), pt(f, a1, d1, BASE + 0.02), pt(f, a, d1, BASE + 0.02)],
        [0, 1, 0], alt ? TILE_A : TILE_B,
      );
    }
  }
  // terracotta runner down the aisle
  shell.quad(
    [pt(f, -0.7, 0.4, BASE + 0.04), pt(f, 0.7, 0.4, BASE + 0.04), pt(f, 0.7, depth - 0.5, BASE + 0.04), pt(f, -0.7, depth - 0.5, BASE + 0.04)],
    [0, 1, 0], TERR,
  );
  shell.quad(
    [pt(f, -hw + 0.3, 0.45, 3.28), pt(f, hw - 0.3, 0.45, 3.28), pt(f, hw - 0.3, depth - 0.25, 3.28), pt(f, -hw + 0.3, depth - 0.25, 3.28)],
    [0, -1, 0], CREAM,
  );
  box(shell, f, doorL, doorR, 0.2, 1.1, 3.18, 3.36, TERR);

  box(shell, f, -hw + 0.15, -hw + 0.38, 0.35, depth - 0.25, BASE, 3.26, CREAM);
  box(shell, f, hw - 0.38, hw - 0.15, 0.35, depth - 0.25, BASE, 3.26, CREAM);
  box(shell, f, -hw + 0.3, hw - 0.3, depth - 0.38, depth - 0.18, BASE, 3.26, CREAM);
  box(shell, f, -hw + 0.25, doorL, 0.12, 0.34, BASE, RN_DOOR_TOP, CREAM_D);
  box(shell, f, doorR, hw - 0.25, 0.12, 0.34, BASE, RN_DOOR_TOP, CREAM_D);
  // terracotta band on the three walls, not across the aisle
  box(shell, f, -hw + 0.15, -hw + 0.42, 0.35, depth - 0.25, 2.55, 2.78, TERR);
  box(shell, f, hw - 0.42, hw - 0.15, 0.35, depth - 0.25, 2.55, 2.78, TERR);
  box(shell, f, -hw + 0.3, hw - 0.3, depth - 0.42, depth - 0.16, 2.55, 2.78, TERR);

  // Pier Market, west side of the hall (image-right from the street)
  box(shell, f, -5.4, -2.5, 9.6, 12.2, BASE, BASE + 1.05, CREAM);
  box(shell, f, -5.45, -2.45, 9.5, 9.72, BASE + 1.05, BASE + 2.35, NAVY);
  box(shell, f, -5.3, -2.6, 9.48, 9.64, BASE + 1.05, BASE + 1.16, GOLD);
  // Hot Look, east side
  box(shell, f, 2.5, 5.4, 9.6, 12.2, BASE, BASE + 1.05, CREAM);
  box(shell, f, 2.45, 5.45, 9.5, 9.72, BASE + 1.05, BASE + 2.35, RED);
  box(shell, f, 2.6, 5.3, 9.48, 9.64, BASE + 1.05, BASE + 1.16, GOLD);
  // Aruba Aloe, the shop over this bay, at the back of the hall
  box(shell, f, -1.7, 1.7, 11.7, 13.15, BASE, BASE + 1.05, CREAM);
  box(shell, f, -1.85, 1.85, 11.55, 11.82, BASE + 1.05, BASE + 2.45, GREEN);
  box(shell, f, -1.6, 1.6, 11.5, 11.68, BASE + 1.05, BASE + 1.16, GOLD);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:renmall:shell";
  group.add(shellMesh);

  const boards: [string, string, string[], string, string, string, number, number, number, number, number][] = [
    ["PIER MARKET", "", [], "#102050", "#102050", "#ffffff", -5.2, -2.7, 9.42, BASE + 1.2, BASE + 2.2],
    ["HOT LOOK", "", [], "#d01218", "#d01218", "#ffffff", 2.7, 5.2, 9.42, BASE + 1.2, BASE + 2.2],
    ["ARUBA ALOE", "", [], "#0e7a32", "#0e7a32", "#ffffff", -1.55, 1.55, 11.48, BASE + 1.2, BASE + 2.3],
    ["RENAISSANCE", "MALL", [], "#f6f0e4", "#8a3a18", "#3a2414", -1.6, 1.6, 2.35, 2.35, 3.15],
  ];
  boards.forEach((s, i) => {
    const tex = signTexture(s[0], s[1], s[2], s[3], s[4], s[5]);
    if (!tex) return;
    const b = new Builder();
    addBoard(b, f, s[8], s[6], s[7], s[9], s[10]);
    const mesh = new Mesh(b.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:renmall:sign" + i;
    group.add(mesh);
  });

  const spots: [number, number][] = [[-2.3, 4.9], [2.3, 4.9]];
  const benches = new InstancedMesh(benchGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  benches.name = "aw:renmall:benches";
  benches.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.ux, f.uz));
    benches.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  benches.count = spots.length;
  benches.instanceMatrix.needsUpdate = true;
  benches.boundingSphere = new Sphere(new Vector3(0, 1, 0), 18);
  group.add(benches);
}
