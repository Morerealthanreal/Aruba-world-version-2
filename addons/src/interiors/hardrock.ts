// Hard Rock Cafe at the South Beach Centre, Palm Beach.
// The sign and the roof guitar stay. The door is the lower north wall
// under the sign: a dark bar, red fascia, stools, and a short menu.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const HR_X = -8050.1;
export const HR_Z = -5471.13;

export const HR_POLY: [number, number][] = [
  [-8057.4, -5467.6],
  [-8044.4, -5465.4],
  [-8042.8, -5474.7],
  [-8055.8, -5476.8],
];

// North edge faces the street. The sign sits on that wall above the door.
const CORNERS: [number, number][] = [
  [-7.3, 3.47],
  [5.7, 5.73],
  [7.3, -3.57],
  [-5.7, -5.67],
];
export const hrLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const HR_DOOR_HALF = 1.65;
export const HR_DOOR_TOP = 3.4;
hrLocal.doorAt = 0;
hrLocal.depth = 7.6;

const BLACK: [number, number, number] = [0.07, 0.07, 0.08];
const RED: [number, number, number] = [0.74, 0.05, 0.07];
const YEL: [number, number, number] = [0.93, 0.74, 0.1];
const WOOD: [number, number, number] = [0.45, 0.28, 0.13];
const WOOD_D: [number, number, number] = [0.28, 0.16, 0.08];
const FLOOR_A: [number, number, number] = [0.14, 0.14, 0.15];
const FLOOR_B: [number, number, number] = [0.22, 0.2, 0.18];
const CREAM: [number, number, number] = [0.93, 0.9, 0.84];

/** along / inward solids. The aisle at along 0 stays clear. */
export const HR_OBS: Box[] = [
  { a0: 1.55, a1: 5.15, d0: 2.15, d1: 3.55 },
  { a0: 1.85, a1: 2.45, d0: 1.45, d1: 2.05 },
  { a0: 3.05, a1: 3.65, d0: 1.45, d1: 2.05 },
  { a0: 4.25, a1: 4.85, d0: 1.45, d1: 2.05 },
  { a0: -4.85, a1: -3.55, d0: 3.15, d1: 4.45 },
  { a0: -4.7, a1: -3.4, d0: 5.45, d1: 6.75 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function stoolGeo() {
  const b = new Builder();
  box(b, ident, -0.16, 0.16, -0.16, 0.16, 0.62, 0.72, BLACK);
  box(b, ident, -0.04, 0.04, -0.04, 0.04, 0.08, 0.62, [0.55, 0.55, 0.58]);
  box(b, ident, -0.14, 0.14, -0.14, 0.14, 0.02, 0.08, BLACK);
  return b.geometry();
}

function tableGeo() {
  const b = new Builder();
  box(b, ident, -0.42, 0.42, -0.42, 0.42, 0.7, 0.76, WOOD);
  box(b, ident, -0.05, 0.05, -0.05, 0.05, 0.05, 0.7, WOOD_D);
  return b.geometry();
}

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.18, 0.18, -0.18, 0.18, 0.42, 0.48, BLACK);
  box(b, ident, -0.18, 0.18, -0.18, -0.12, 0.48, 0.9, RED);
  for (const [x, z] of [[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]] as const) {
    box(b, ident, x - 0.02, x + 0.02, z - 0.02, z + 0.02, 0.04, 0.42, WOOD_D);
  }
  return b.geometry();
}

function menuTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#141416";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#c8102e";
  g.fillRect(0, 0, 512, 92);
  g.fillStyle = "#f5d76e";
  g.font = "700 40px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("HARD ROCK", 256, 36);
  g.font = "600 20px Arial, sans-serif";
  g.fillStyle = "#ffffff";
  g.fillText("CAFE  ·  PALM BEACH", 256, 70);
  const rows: [string, string][] = [
    ["Legendary Burger", "16"],
    ["BBQ Ribs", "22"],
    ["Chicken Wings", "14"],
    ["Grilled Chicken", "17"],
    ["Caesar Salad", "13"],
    ["Fries", "6"],
  ];
  rows.forEach((r, i) => {
    const y = 140 + i * 56;
    g.fillStyle = i % 2 ? "#1c1c20" : "#141416";
    g.fillRect(18, y - 26, 476, 52);
    g.fillStyle = "#f4efe4";
    g.font = "600 26px Arial, sans-serif";
    g.textAlign = "left";
    g.fillText(r[0], 36, y);
    g.fillStyle = "#f5d76e";
    g.textAlign = "right";
    g.fillText(r[1], 472, y);
  });
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function addMenu(b: Builder, f: Frame, a: number, d: number, y0: number, y1: number, halfD: number) {
  const quad = (along: number, normal: [number, number, number], uv: [[number, number], [number, number], [number, number], [number, number]]) => {
    b.quad([
      pt(f, along, d - halfD, y0), pt(f, along, d + halfD, y0),
      pt(f, along, d + halfD, y1), pt(f, along, d - halfD, y1),
    ], normal, [1, 1, 1], uv);
  };
  // Guests stand west of the bar and look east. This face reads left to right.
  quad(a, [-f.ux, 0, -f.uz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
  quad(a - 0.03, [f.ux, 0, f.uz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

export function buildHardrock(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = hrLocal.halfW;
  const depth = hrLocal.depth;
  const doorL = -HR_DOOR_HALF;
  const doorR = HR_DOOR_HALF;
  const liner = 0.1;

  shell.quad(
    [pt(f, -hw + 0.3, 0.15, 0.02), pt(f, hw - 0.3, 0.15, 0.02), pt(f, hw - 0.3, depth - 0.25, 0.02), pt(f, -hw + 0.3, depth - 0.25, 0.02)],
    [0, 1, 0], [0.1, 0.1, 0.11],
  );
  const step = 1.35;
  for (let a = -hw + 0.4; a < hw - 0.45; a += step) {
    for (let d = 0.2; d < depth - 0.35; d += step) {
      const a1 = Math.min(a + step - 0.05, hw - 0.35);
      const d1 = Math.min(d + step - 0.05, depth - 0.28);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, 0.05), pt(f, a1, d, 0.05), pt(f, a1, d1, 0.05), pt(f, a, d1, 0.05)],
        [0, 1, 0], alt ? FLOOR_A : FLOOR_B,
      );
    }
  }
  shell.quad(
    [pt(f, -hw + 0.35, 0.3, 3.55), pt(f, hw - 0.35, 0.3, 3.55), pt(f, hw - 0.35, depth - 0.3, 3.55), pt(f, -hw + 0.35, depth - 0.3, 3.55)],
    [0, -1, 0], [0.1, 0.1, 0.11],
  );

  box(shell, f, -hw + 0.18, -hw + 0.18 + liner, 0.3, depth - 0.2, 0.04, 3.5, BLACK);
  box(shell, f, hw - 0.18 - liner, hw - 0.18, 0.3, depth - 0.2, 0.04, 3.5, BLACK);
  box(shell, f, -hw + 0.25, hw - 0.25, depth - 0.28, depth - 0.16, 0.04, 3.5, BLACK);
  box(shell, f, -hw + 0.25, doorL, 0.12, 0.12 + liner, 0.02, HR_DOOR_TOP, BLACK);
  box(shell, f, doorR, hw - 0.25, 0.12, 0.12 + liner, 0.02, HR_DOOR_TOP, BLACK);
  box(shell, f, doorL, doorR, 0.14, 0.14 + liner, 3.05, 3.32, RED);
  box(shell, f, doorL, doorR, 0.16, 0.16 + liner, 2.92, 3.04, YEL);

  // bar on the east side, red front toward the aisle
  box(shell, f, 1.6, 5.1, 2.2, 3.5, 0.04, 1.05, WOOD);
  box(shell, f, 1.55, 5.15, 2.15, 3.55, 1.05, 1.12, WOOD_D);
  box(shell, f, 1.6, 5.1, 2.15, 2.32, 0.15, 1.05, RED);
  box(shell, f, 1.55, 1.72, 2.2, 3.5, 0.15, 1.05, RED);
  box(shell, f, 1.6, 5.1, 2.15, 2.28, 1.02, 1.08, YEL);

  // guitar on the back wall: body, neck, head
  box(shell, f, -0.55, 0.55, depth - 0.42, depth - 0.22, 1.15, 1.85, RED);
  box(shell, f, -0.08, 0.08, depth - 0.4, depth - 0.24, 1.85, 2.85, WOOD);
  box(shell, f, -0.16, 0.16, depth - 0.4, depth - 0.24, 2.85, 3.1, CREAM);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:hr:shell";
  group.add(shellMesh);

  const tex = menuTexture();
  if (tex) {
    const boards = new Builder();
    addMenu(boards, f, 1.52, 2.85, 1.25, 2.85, 0.85);
    const menu = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    menu.name = "aw:hr:menu";
    group.add(menu);
  }

  const stoolAt: [number, number][] = [[2.15, 1.75], [3.35, 1.75], [4.55, 1.75]];
  const stools = new InstancedMesh(stoolGeo(), new MeshBasicMaterial({ vertexColors: true }), stoolAt.length);
  stools.name = "aw:hr:stools";
  stools.frustumCulled = false;
  stoolAt.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], 0, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(-f.ux, -f.uz));
    stools.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  stools.count = stoolAt.length;
  stools.instanceMatrix.needsUpdate = true;
  stools.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
  group.add(stools);

  const spots: [number, number][] = [[-4.2, 3.8], [-4.05, 6.1]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length * 2);
  const tables = new InstancedMesh(tableGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:hr:chairs";
  tables.name = "aw:hr:tables";
  chairs.frustumCulled = false;
  tables.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const tp = pt(f, a, d, 0);
    pos.set(tp[0], 0, tp[2]);
    quat.setFromAxisAngle(up, 0);
    tables.setMatrixAt(i, m4.compose(pos, quat, scl));
    const c0 = pt(f, a - 0.7, d, 0);
    pos.set(c0[0], 0, c0[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.ux, f.uz));
    chairs.setMatrixAt(i * 2, m4.compose(pos, quat, scl));
    const c1 = pt(f, a + 0.7, d, 0);
    pos.set(c1[0], 0, c1[2]);
    quat.setFromAxisAngle(up, Math.atan2(-f.ux, -f.uz));
    chairs.setMatrixAt(i * 2 + 1, m4.compose(pos, quat, scl));
  });
  chairs.count = spots.length * 2;
  tables.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  tables.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
  tables.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
  group.add(chairs, tables);
}
