// McDonald's, Palm Beach (J.E. Irausquin Boulevard). The hero keeps its yellow
// arches and sign. The storefront beside the sign opens into a dining room:
// order counter, menu board, red chairs. Built from meshes only.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SphereGeometry, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const MCD_X = -7957.65;
export const MCD_Z = -5466.6;
export const MCD_POLY: [number, number][] = [
  [-7969.2, -5451.9],
  [-7951.9, -5448.8],
  [-7946.1, -5481.3],
  [-7963.4, -5484.4],
];

// Ground-wall corners. Entrance is the north edge, under the roadside sign.
const CORNERS: [number, number][] = [
  [-11.55, 14.7],
  [5.75, 17.8],
  [11.55, -14.7],
  [-5.75, -17.8],
];
export const mcdLocal: Vol = frameFromEdge(CORNERS, 1, 0);
// Dining room only. The sign board covers along -3.5..3.5 and the yellow
// blade sits near along 6, so the opening is the clear stretch to the east.
export const MCD_DOOR_AT = -5.5;
export const MCD_DOOR_HALF = 2.15;
export const MCD_DOOR_TOP = 2.9;
mcdLocal.doorAt = MCD_DOOR_AT;
mcdLocal.depth = 16;

const RED: [number, number, number] = [0.86, 0.05, 0.04];
const RED_D: [number, number, number] = [0.62, 0.04, 0.03];
const YEL: [number, number, number] = [1, 0.74, 0.05];
const GREY: [number, number, number] = [0.78, 0.78, 0.76];
const GREY_D: [number, number, number] = [0.62, 0.62, 0.6];
const CREAM: [number, number, number] = [0.93, 0.91, 0.86];
const WOOD: [number, number, number] = [0.45, 0.28, 0.14];

/** along / inward solids. Walk lines at doorAt and along -6.2 stay clear. */
export const MCD_OBS: Box[] = [
  { a0: -2.5, a1: 4.7, d0: 3.05, d1: 4.45 },
  { a0: -4.4, a1: -3.8, d0: 1.9, d1: 2.6 },
  { a0: -7.55, a1: -6.95, d0: 1.9, d1: 2.6 },
  { a0: -7.9, a1: -6.7, d0: 4.9, d1: 6.35 },
  { a0: -4.3, a1: -3.1, d0: 6.05, d1: 7.55 },
  { a0: -7.75, a1: -6.65, d0: 8.65, d1: 10.2 },
  { a0: 0.85, a1: 1.95, d0: 5.05, d1: 6.55 },
  { a0: 3.2, a1: 4.4, d0: 8.45, d1: 9.95 },
  { a0: -3.2, a1: 3.4, d0: 13.25, d1: 15.05 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.2, 0.2, -0.18, 0.18, 0.42, 0.48, RED);
  box(b, ident, -0.2, 0.2, -0.2, -0.14, 0.48, 0.92, RED_D);
  for (const [x, z] of [[-0.16, -0.14], [0.16, -0.14], [-0.16, 0.14], [0.16, 0.14]] as const) {
    box(b, ident, x - 0.02, x + 0.02, z - 0.02, z + 0.02, 0.02, 0.42, RED_D);
  }
  return b.geometry();
}
function tableGeo() {
  const b = new Builder();
  box(b, ident, -0.42, 0.42, -0.42, 0.42, 0.7, 0.76, GREY);
  box(b, ident, -0.06, 0.06, -0.06, 0.06, 0.04, 0.7, GREY_D);
  return b.geometry();
}

function menuTexture() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f4f1ea";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#db0007";
  g.fillRect(0, 0, 512, 78);
  g.fillStyle = "#ffbc0d";
  g.beginPath();
  g.arc(70, 118, 28, Math.PI, 0);
  g.arc(108, 118, 28, Math.PI, 0);
  g.fill();
  g.fillStyle = "#ffffff";
  g.font = "700 36px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("McDONALD'S", 300, 40);
  const rows: [string, string][] = [
    ["Big Mac", "8.50"],
    ["Cheeseburger", "3.50"],
    ["Quarter Pounder", "7.50"],
    ["McNuggets", "6.00"],
    ["Fries", "3.00"],
    ["McFlurry", "4.50"],
    ["Coca-Cola", "2.50"],
    ["Coffee", "2.50"],
  ];
  rows.forEach((r, i) => {
    const y = 130 + i * 40;
    g.fillStyle = i % 2 ? "#fff6d8" : "#f4f1ea";
    g.fillRect(16, y - 22, 480, 40);
    g.fillStyle = "#2a2118";
    g.font = "600 26px Arial, sans-serif";
    g.textAlign = "left";
    g.fillText(r[0], 32, y);
    g.textAlign = "right";
    g.fillText(r[1], 480, y);
  });
  g.fillStyle = "#db0007";
  g.font = "700 20px Arial, sans-serif";
  g.textAlign = "center";
  g.fillText("i'm lovin' it", 256, 480);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function addMenu(b: Builder, f: Frame, a: number, d: number, y0: number, y1: number, halfW: number) {
  const quad = (depth: number, normal: [number, number, number], uv: [[number, number], [number, number], [number, number], [number, number]]) => {
    b.quad([
      pt(f, a - halfW, depth, y0), pt(f, a + halfW, depth, y0),
      pt(f, a + halfW, depth, y1), pt(f, a - halfW, depth, y1),
    ], normal, [1, 1, 1], uv);
  };
  // Room side faces the dining room. UVs are flipped against the street face so
  // the board reads left to right from inside this storefront.
  quad(d, [-f.nx, 0, -f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
  quad(d + 0.03, [f.nx, 0, f.nz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

function sit(mesh: InstancedMesh, i: number, f: Frame, a: number, d: number, yaw: [number, number]) {
  const p = pt(f, a, d, 0);
  pos.set(p[0], 0, p[2]);
  quat.setFromAxisAngle(up, Math.atan2(yaw[0], yaw[1]));
  mesh.setMatrixAt(i, m4.compose(pos, quat, scl));
}

export function buildMcdonalds(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = mcdLocal.halfW;
  const depth = mcdLocal.depth;
  const doorL = MCD_DOOR_AT - MCD_DOOR_HALF;
  const doorR = MCD_DOOR_AT + MCD_DOOR_HALF;

  shell.quad(
    [pt(f, -hw + 0.35, 0.2, 0.02), pt(f, hw - 0.35, 0.2, 0.02), pt(f, hw - 0.35, depth - 0.35, 0.02), pt(f, -hw + 0.35, depth - 0.35, 0.02)],
    [0, 1, 0], [0.7, 0.7, 0.68],
  );
  const step = 1.3;
  for (let a = -hw + 0.5; a < hw - 0.6; a += step) {
    for (let d = 0.25; d < depth - 0.5; d += step) {
      const a1 = Math.min(a + step - 0.04, hw - 0.45);
      const d1 = Math.min(d + step - 0.04, depth - 0.4);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, 0.04), pt(f, a1, d, 0.04), pt(f, a1, d1, 0.04), pt(f, a, d1, 0.04)],
        [0, 1, 0], alt ? GREY : GREY_D,
      );
    }
  }
  shell.quad(
    [pt(f, -hw + 0.4, 0.25, 3.15), pt(f, hw - 0.4, 0.25, 3.15), pt(f, hw - 0.4, depth - 0.4, 3.15), pt(f, -hw + 0.4, depth - 0.4, 3.15)],
    [0, -1, 0], [0.9, 0.9, 0.88],
  );

  const liner = 0.12;
  box(shell, f, -hw + 0.22, -hw + 0.22 + liner, 0.35, depth - 0.3, 0.04, 3.2, CREAM);
  box(shell, f, hw - 0.22 - liner, hw - 0.22, 0.35, depth - 0.3, 0.04, 3.2, CREAM);
  box(shell, f, -hw + 0.3, hw - 0.3, depth - 0.32, depth - 0.2, 0.04, 3.2, CREAM);
  box(shell, f, -hw + 0.25, doorL, 0.16, 0.16 + liner, 0.02, 2.9, CREAM);
  box(shell, f, doorR, hw - 0.25, 0.16, 0.16 + liner, 0.02, 2.9, CREAM);
  box(shell, f, doorL, doorR, 0.18, 0.18 + liner, 2.62, 2.88, YEL);
  box(shell, f, doorL + 0.04, doorL + 0.18, 0.2, 0.48, 0.02, 2.75, RED);
  box(shell, f, doorR - 0.18, doorR - 0.04, 0.2, 0.48, 0.02, 2.75, RED);
  box(shell, f, -hw + 0.3, hw - 0.3, 0.2, 0.42, 2.92, 3.18, CREAM);

  // order counter west of the entrance, under the sign
  box(shell, f, -2.4, 4.6, 3.15, 4.35, 0.04, 1.05, WOOD);
  box(shell, f, -2.5, 4.7, 3.08, 4.42, 1.05, 1.12, [0.95, 0.95, 0.93]);
  box(shell, f, -2.35, 4.55, 3.08, 3.22, 0.42, 1.02, RED);
  box(shell, f, -1.6, 1.6, 3.04, 3.18, 1.12, 1.22, YEL);
  // self-order kiosks just inside the storefront, either side of the aisle
  box(shell, f, -4.35, -3.85, 1.95, 2.5, 0.04, 1.35, [0.16, 0.16, 0.17]);
  box(shell, f, -4.28, -3.92, 1.9, 2.02, 0.7, 1.22, [0.05, 0.05, 0.06]);
  box(shell, f, -7.5, -7.0, 1.95, 2.5, 0.04, 1.35, [0.16, 0.16, 0.17]);
  box(shell, f, -7.43, -7.07, 1.9, 2.02, 0.7, 1.22, [0.05, 0.05, 0.06]);
  // service counter at the back of the dining room
  box(shell, f, -3.0, 3.2, 13.4, 14.9, 0.04, 1.0, [0.22, 0.22, 0.24]);
  box(shell, f, -1.2, 1.0, 13.55, 14.6, 1.0, 1.08, YEL);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:mcd:shell";
  group.add(shellMesh);

  const tex = menuTexture();
  if (tex) {
    const boards = new Builder();
    addMenu(boards, f, -2.15, 2.55, 1.35, 2.75, 0.7);
    addMenu(boards, f, 1.0, 4.5, 1.45, 2.9, 1.55);
    const menu = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    menu.name = "aw:mcd:menu";
    group.add(menu);
  }

  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), 10);
  const tables = new InstancedMesh(tableGeo(), new MeshBasicMaterial({ vertexColors: true }), 5);
  chairs.name = "aw:mcd:chairs";
  tables.name = "aw:mcd:tables";
  chairs.frustumCulled = false;
  tables.frustumCulled = false;
  const spots: [number, number][] = [[-7.3, 5.6], [-3.7, 6.8], [-7.2, 9.4], [1.4, 5.8], [3.8, 9.2]];
  spots.forEach(([a, d], i) => {
    sit(tables, i, f, a, d, [0, 1]);
    sit(chairs, i * 2, f, a, d - 0.7, [f.nx, f.nz]);
    sit(chairs, i * 2 + 1, f, a, d + 0.7, [-f.nx, -f.nz]);
  });
  chairs.count = spots.length * 2;
  tables.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  tables.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 24);
  tables.boundingSphere = new Sphere(new Vector3(0, 1, 0), 24);
  group.add(chairs, tables);

  // a few fries-yellow boxes on the counter as the pickup order
  const bags = new InstancedMesh(new SphereGeometry(0.08, 5, 4), new MeshBasicMaterial({ color: 0xffbc0d }), 4);
  bags.name = "aw:mcd:bags";
  bags.frustumCulled = false;
  const bs = new Vector3(0.7, 1.1, 0.7);
  [-1.4, -0.3, 0.8, 1.9].forEach((a, i) => {
    const p = pt(f, a, 3.7, 1.22);
    pos.set(p[0], p[1], p[2]);
    bags.setMatrixAt(i, m4.compose(pos, quat.identity(), bs));
  });
  bags.count = 4;
  bags.instanceMatrix.needsUpdate = true;
  bags.boundingSphere = new Sphere(new Vector3(0, 1, 0), 20);
  group.add(bags);
}
