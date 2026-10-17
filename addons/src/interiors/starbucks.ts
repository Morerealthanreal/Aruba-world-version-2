// Starbucks at Paseo Herencia, Palm Beach (J.E. Irausquin Boulevard 382A).
// The siren sign sits on the south face above the entrance. The room is the
// wood bar, pastry case, drink menu and cafe tables from photos of that shop
// and the usual Starbucks bar. No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SphereGeometry, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const SBX_X = -8064.4;
export const SBX_Z = -5917.18;

export const SBX_POLY: [number, number][] = [
  [-8085.1, -5908.6],
  [-8045.2, -5904.4],
  [-8042.6, -5926.7],
  [-8084.7, -5929],
];

// Hero wall corners, metres from the footprint centroid. South edge is the street.
const CORNERS: [number, number][] = [
  [-20.7, 8.57],
  [19.2, 12.77],
  [21.8, -9.53],
  [-20.3, -11.82],
];
export const sbxLocal: Vol = frameFromEdge(CORNERS, 3, 2);
export const SBX_DOOR_AT = 0;
export const SBX_DOOR_HALF = 2.2;
export const SBX_DOOR_TOP = 2.85;
sbxLocal.doorAt = SBX_DOOR_AT;
sbxLocal.depth = 14;

const SIR: [number, number, number] = [0.0, 0.44, 0.29];
const DARK: [number, number, number] = [0.12, 0.22, 0.2];
const WOOD: [number, number, number] = [0.62, 0.4, 0.2];
const WOOD_D: [number, number, number] = [0.4, 0.24, 0.12];
const CREAM: [number, number, number] = [0.95, 0.92, 0.86];
const TILE_A: [number, number, number] = [0.94, 0.92, 0.88];
const TILE_B: [number, number, number] = [0.55, 0.62, 0.58];
const WHITE: [number, number, number] = [0.97, 0.96, 0.94];

/** along / inward solids. The aisle at doorAt (along 0) stays clear. */
export const SBX_OBS: Box[] = [
  { a0: 3.3, a1: 11.3, d0: 2.3, d1: 4.0 },
  { a0: 3.15, a1: 4.7, d0: 1.5, d1: 2.4 },
  { a0: -8.1, a1: -6.9, d0: 4.7, d1: 5.9 },
  { a0: -4.9, a1: -3.5, d0: 7.4, d1: 8.6 },
  { a0: -8.6, a1: -7.4, d0: 9.9, d1: 11.1 },
  { a0: 5.9, a1: 7.1, d0: 6.0, d1: 7.2 },
  { a0: 2.0, a1: 3.2, d0: 8.5, d1: 9.7 },
  { a0: -3.4, a1: -2.2, d0: 10.9, d1: 12.1 },
  { a0: -4.2, a1: 8.2, d0: 12.5, d1: 13.8 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.2, 0.2, -0.18, 0.18, 0.44, 0.5, DARK);
  box(b, ident, -0.2, 0.2, -0.2, -0.14, 0.5, 0.92, SIR);
  for (const [x, z] of [[-0.16, -0.14], [0.16, -0.14], [-0.16, 0.14], [0.16, 0.14]] as const) {
    box(b, ident, x - 0.02, x + 0.02, z - 0.02, z + 0.02, 0.02, 0.44, WOOD_D);
  }
  return b.geometry();
}

function tableGeo() {
  const b = new Builder();
  box(b, ident, -0.42, 0.42, -0.42, 0.42, 0.72, 0.78, WOOD);
  box(b, ident, -0.06, 0.06, -0.06, 0.06, 0.05, 0.72, WOOD_D);
  return b.geometry();
}

function menuTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f3efe6";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#00704a";
  g.fillRect(0, 0, 512, 86);
  g.fillStyle = "#ffffff";
  g.font = "700 40px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("STARBUCKS", 256, 34);
  g.font = "600 18px Arial, sans-serif";
  g.fillText("Paseo Herencia", 256, 66);
  const rows: [string, string][] = [
    ["Pike Place", "4.25"],
    ["Caffe Latte", "5.50"],
    ["Cappuccino", "5.25"],
    ["Americano", "4.50"],
    ["Caramel Macchiato", "6.25"],
    ["Caffe Mocha", "5.95"],
    ["Frappuccino", "6.50"],
    ["Iced Tea", "4.25"],
  ];
  rows.forEach((r, i) => {
    const y = 128 + i * 42;
    g.fillStyle = i % 2 ? "#e7f2ec" : "#f3efe6";
    g.fillRect(16, y - 22, 480, 42);
    g.fillStyle = "#1e3932";
    g.font = "600 24px Arial, sans-serif";
    g.textAlign = "left";
    g.fillText(r[0], 32, y);
    g.textAlign = "right";
    g.fillText(r[1], 476, y);
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
  // Customers stand west of the bar and look east. The room face is -U.
  // UVs run right-to-left on that face so the board reads left to right.
  quad(a, [-f.ux, 0, -f.uz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
  quad(a - 0.03, [f.ux, 0, f.uz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
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

export function buildStarbucks(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = sbxLocal.halfW;
  const depth = sbxLocal.depth;
  const doorL = SBX_DOOR_AT - SBX_DOOR_HALF;
  const doorR = SBX_DOOR_AT + SBX_DOOR_HALF;
  const liner = 0.12;

  shell.quad(
    [pt(f, -hw + 0.4, 0.02, 0.02), pt(f, hw - 0.4, 0.02, 0.02), pt(f, hw - 0.4, depth - 0.3, 0.02), pt(f, -hw + 0.4, depth - 0.3, 0.02)],
    [0, 1, 0], [0.72, 0.69, 0.64],
  );
  const step = 1.6;
  for (let a = -hw + 0.6; a < hw - 0.7; a += step) {
    for (let d = 0.06; d < depth - 0.45; d += step) {
      const a1 = Math.min(a + step - 0.05, hw - 0.5);
      const d1 = Math.min(d + step - 0.05, depth - 0.35);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, 0.07), pt(f, a1, d, 0.07), pt(f, a1, d1, 0.07), pt(f, a, d1, 0.07)],
        [0, 1, 0], alt ? TILE_A : TILE_B,
      );
    }
  }
  shell.quad(
    [pt(f, -hw + 0.45, 0.3, 3.15), pt(f, hw - 0.45, 0.3, 3.15), pt(f, hw - 0.45, depth - 0.35, 3.15), pt(f, -hw + 0.45, depth - 0.35, 3.15)],
    [0, -1, 0], [0.93, 0.9, 0.84],
  );

  box(shell, f, -hw + 0.28, -hw + 0.28 + liner, 0.4, depth - 0.25, 0.04, 3.15, CREAM);
  box(shell, f, hw - 0.28 - liner, hw - 0.28, 0.4, depth - 0.25, 0.04, 3.15, CREAM);
  box(shell, f, -hw + 0.35, hw - 0.35, depth - 0.28, depth - 0.16, 0.04, 3.15, DARK);
  box(shell, f, -hw + 0.3, doorL, 0.16, 0.16 + liner, 0.02, SBX_DOOR_TOP, CREAM);
  box(shell, f, doorR, hw - 0.3, 0.16, 0.16 + liner, 0.02, SBX_DOOR_TOP, CREAM);
  box(shell, f, doorL, doorR, 0.18, 0.18 + liner, 2.52, 2.8, SIR);
  box(shell, f, doorL + 0.04, doorL + 0.16, 0.18, 0.42, 0.02, 2.7, DARK);
  box(shell, f, doorR - 0.16, doorR - 0.04, 0.18, 0.42, 0.02, 2.7, DARK);
  box(shell, f, -hw + 0.35, hw - 0.35, 0.2, 0.4, 2.88, 3.16, CREAM);

  // bar east of the entrance, wood top, siren-green front toward the aisle
  box(shell, f, 3.4, 11.2, 2.45, 3.9, 0.04, 1.05, WOOD);
  box(shell, f, 3.35, 11.25, 2.4, 3.95, 1.05, 1.12, WOOD_D);
  box(shell, f, 3.4, 11.2, 2.4, 2.55, 0.2, 1.05, SIR);
  box(shell, f, 3.2, 4.6, 1.55, 2.35, 0.7, 1.15, WHITE);
  box(shell, f, 3.25, 4.55, 1.6, 2.3, 0.15, 0.7, WOOD_D);
  // handoff counter at the back of the cafe
  box(shell, f, -4.0, 8.0, 12.7, 13.6, 0.04, 1.0, DARK);
  box(shell, f, -1.0, 2.2, 12.85, 13.4, 1.0, 1.08, SIR);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:sbux:shell";
  group.add(shellMesh);

  const tex = menuTexture();
  if (tex) {
    const boards = new Builder();
    addMenu(boards, f, 3.15, 3.15, 1.45, 2.95, 1.15);
    const menu = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    menu.name = "aw:sbux:menu";
    group.add(menu);
  }

  const spots: [number, number][] = [[-7.5, 5.3], [-4.2, 8.0], [-8.0, 10.5], [6.5, 6.6], [2.6, 9.1], [-2.8, 11.5]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length * 2);
  const tables = new InstancedMesh(tableGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:sbux:chairs";
  tables.name = "aw:sbux:tables";
  chairs.frustumCulled = false;
  tables.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    sit(tables, i, f, a, d, [1, 0]);
    sit(chairs, i * 2, f, a - 0.75, d, [f.ux, f.uz]);
    sit(chairs, i * 2 + 1, f, a + 0.75, d, [-f.ux, -f.uz]);
  });
  chairs.count = spots.length * 2;
  tables.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  tables.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 28);
  tables.boundingSphere = new Sphere(new Vector3(0, 1, 0), 28);
  group.add(chairs, tables);

  const cups = new InstancedMesh(new SphereGeometry(0.07, 6, 4), new MeshBasicMaterial({ color: 0xf4f1ea }), 4);
  cups.name = "aw:sbux:cups";
  cups.frustumCulled = false;
  const cs = new Vector3(0.85, 1.15, 0.85);
  [4.2, 6.1, 8.0, 9.6].forEach((a, i) => {
    const p = pt(f, a, 3.15, 1.2);
    pos.set(p[0], p[1], p[2]);
    cups.setMatrixAt(i, m4.compose(pos, quat.identity(), cs));
  });
  cups.count = 4;
  cups.instanceMatrix.needsUpdate = true;
  cups.boundingSphere = new Sphere(new Vector3(0, 1, 0), 22);
  group.add(cups);
}
