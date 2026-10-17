// Moomba Beach Bar. The teal MOOMBA sign stays.
// The door is the glass bay beside that sign: a wood bar, teal top, beach menu.
// Menu names and prices follow the beach bar card. No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const MB_X = -8122.03;
export const MB_Z = -6342.63;

export const MB_POLY: [number, number][] = [
  [-8137.2, -6343.4], [-8137.2, -6339.1], [-8135.8, -6335.8], [-8131.3, -6332.8],
  [-8131.4, -6329], [-8113.5, -6325.6], [-8108.5, -6346.4], [-8104, -6348.9],
  [-8105.7, -6351.9], [-8113.1, -6348], [-8113.1, -6346], [-8116.1, -6346.4],
  [-8119.4, -6343.1], [-8122.1, -6344.5], [-8125, -6347.8], [-8128.8, -6349.1],
  [-8132.3, -6348.7], [-8135.4, -6346.4],
];

const INX = -0.9722;
const INZ = -0.2343;
const CORNERS: [number, number][] = [
  [13.53, -3.77],
  [8.52, 17.02],
  [8.52 + INX * 12, 17.02 + INZ * 12],
  [13.53 + INX * 12, -3.77 + INZ * 12],
];
export const mbLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const MB_DOOR_HALF = 1.45;
export const MB_DOOR_TOP = 1.65;
// The sign sits on the sand at the middle of the wall. The glass bays are beside it.
mbLocal.doorAt = 8;
mbLocal.depth = 7.2;
mbLocal.halfW = 9.5;

const TEAL: [number, number, number] = [0.05, 0.42, 0.48];
const TEAL_D: [number, number, number] = [0.03, 0.28, 0.34];
const SAND: [number, number, number] = [0.90, 0.82, 0.66];
const WHITE: [number, number, number] = [0.96, 0.95, 0.92];
const WARM: [number, number, number] = [0.98, 0.86, 0.62];
const BULB: [number, number, number] = [1, 0.86, 0.42];
const WOOD: [number, number, number] = [0.45, 0.28, 0.14];
const WOOD_D: [number, number, number] = [0.32, 0.18, 0.08];
const AMBER: [number, number, number] = [0.72, 0.42, 0.1];
const RUM: [number, number, number] = [0.36, 0.1, 0.06];
const GLASS: [number, number, number] = [0.78, 0.9, 0.92];
const LIME: [number, number, number] = [0.45, 0.72, 0.28];
const PINK: [number, number, number] = [0.86, 0.38, 0.48];

const BASE = 0.06;

export const MB_OBS: Box[] = [
  { a0: 6.5, a1: 9.4, d0: 4.9, d1: 6.65 },
  { a0: 6.2, a1: 7.2, d0: 2.4, d1: 3.7 },
  { a0: 8.8, a1: 9.6, d0: 2.4, d1: 3.7 },
  { a0: 5.98, a1: 6.44, d0: 4.72, d1: 5.18 },
  { a0: 8.78, a1: 9.24, d0: 4.72, d1: 5.18 },
  { a0: 7.17, a1: 7.73, d0: 2.92, d1: 3.48 },
  { a0: 8.27, a1: 8.83, d0: 2.92, d1: 3.48 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.22, 0.22, -0.22, 0.22, 0.42, 0.5, WHITE);
  box(b, ident, -0.22, 0.22, -0.22, -0.12, 0.5, 0.92, TEAL);
  box(b, ident, -0.06, 0.06, -0.06, 0.06, 0.08, 0.42, WOOD);
  return b.geometry();
}

function stoolGeo() {
  const b = new Builder();
  box(b, ident, -0.16, 0.16, -0.16, 0.16, 0.62, 0.7, WOOD);
  box(b, ident, -0.05, 0.05, -0.05, 0.05, 0.1, 0.62, TEAL);
  box(b, ident, -0.14, 0.14, -0.14, 0.14, 0.16, 0.2, TEAL_D);
  return b.geometry();
}

function paintBoard(g: CanvasRenderingContext2D) {
  g.fillStyle = "#f6f1e6";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#0b6a78";
  g.fillRect(0, 0, 512, 132);
  g.fillStyle = "#f7fffe";
  g.font = "700 52px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("MOOMBA", 256, 46);
  g.font = "600 26px Arial, sans-serif";
  g.fillText("BEACH BAR", 256, 98);
  const rows: [string, string][] = [
    ["Painkiller", ""],
    ["Passion Mojito", ""],
    ["Aruba Ariba", ""],
    ["Hamburger", "21"],
    ["Fish Sandwich", "14"],
    ["Caesar Salad", "15"],
  ];
  rows.forEach((row, i) => {
    const y = 176 + i * 52;
    g.fillStyle = i % 2 === 0 ? "#e5f2f3" : "#f6f1e6";
    g.fillRect(24, y - 22, 464, 48);
    g.fillStyle = "#14343a";
    g.font = "600 28px Arial, sans-serif";
    g.textAlign = "left";
    g.fillText(row[0], 44, y);
    if (row[1]) {
      g.textAlign = "right";
      g.fillText(row[1], 468, y);
    }
  });
}

function paintSpecials(g: CanvasRenderingContext2D) {
  g.fillStyle = "#0b6a78";
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#f6f1e6";
  g.fillRect(12, 12, 232, 232);
  g.fillStyle = "#0b6a78";
  g.fillRect(12, 12, 232, 58);
  g.fillStyle = "#f7fffe";
  g.font = "700 28px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("TODAY", 128, 42);
  const rows: [string, string][] = [
    ["Fish Fingers", "10"],
    ["Wings", "16"],
    ["Nachos", "16"],
  ];
  g.fillStyle = "#14343a";
  g.font = "600 20px Arial, sans-serif";
  rows.forEach((row, i) => {
    const y = 104 + i * 46;
    g.textAlign = "left";
    g.fillText(row[0], 28, y);
    g.textAlign = "right";
    g.fillText(row[1], 226, y);
  });
}

function canvasTex(draw: (g: CanvasRenderingContext2D) => void, w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return null;
  draw(g);
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
  face(d, [-f.nx, 0, -f.nz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
  face(d - 0.03, [f.nx, 0, f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

function plant(mesh: InstancedMesh, f: Frame, spots: [number, number][]) {
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.nx, f.nz));
    mesh.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  mesh.count = spots.length;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  mesh.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
}

function lowTable(shell: Builder, f: Frame, a: number, d: number) {
  box(shell, f, a - 0.28, a + 0.28, d - 0.28, d + 0.28, BASE + 0.4, BASE + 0.48, WOOD);
  box(shell, f, a - 0.24, a - 0.16, d - 0.24, d - 0.16, BASE, BASE + 0.4, TEAL_D);
  box(shell, f, a + 0.16, a + 0.24, d - 0.24, d - 0.16, BASE, BASE + 0.4, TEAL_D);
  box(shell, f, a - 0.24, a - 0.16, d + 0.16, d + 0.24, BASE, BASE + 0.4, TEAL_D);
  box(shell, f, a + 0.16, a + 0.24, d + 0.16, d + 0.24, BASE, BASE + 0.4, TEAL_D);
}

export function buildMoomba(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = mbLocal.halfW;
  const depth = mbLocal.depth;
  const doorAt = mbLocal.doorAt ?? 8;
  const doorL = doorAt - MB_DOOR_HALF;
  const doorR = doorAt + MB_DOOR_HALF;
  const liner = 0.12;

  shell.quad(
    [pt(f, -hw + 0.2, 0.1, BASE), pt(f, hw - 0.2, 0.1, BASE), pt(f, hw - 0.2, depth - 0.18, BASE), pt(f, -hw + 0.2, depth - 0.18, BASE)],
    [0, 1, 0], SAND,
  );
  const step = 1.3;
  for (let a = -hw + 0.28; a < hw - 0.3; a += step) {
    for (let d = 0.16; d < depth - 0.26; d += step) {
      const a1 = Math.min(a + step - 0.06, hw - 0.24);
      const d1 = Math.min(d + step - 0.06, depth - 0.2);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.03), pt(f, a1, d, BASE + 0.03), pt(f, a1, d1, BASE + 0.03), pt(f, a, d1, BASE + 0.03)],
        [0, 1, 0], alt ? SAND : TEAL,
      );
    }
  }
  shell.quad(
    [pt(f, 7.55, 0.35, BASE + 0.05), pt(f, 8.45, 0.35, BASE + 0.05), pt(f, 8.45, 4.85, BASE + 0.05), pt(f, 7.55, 4.85, BASE + 0.05)],
    [0, 1, 0], [0.78, 0.62, 0.4],
  );
  shell.quad(
    [pt(f, -hw + 0.22, 0.18, 1.58), pt(f, hw - 0.22, 0.18, 1.58), pt(f, hw - 0.22, 3.4, 1.58), pt(f, -hw + 0.22, 3.4, 1.58)],
    [0, -1, 0], WHITE,
  );
  shell.quad(
    [pt(f, -hw + 0.22, 3.4, 1.58), pt(f, hw - 0.22, 3.4, 1.58), pt(f, hw - 0.22, depth - 0.18, 1.58), pt(f, -hw + 0.22, depth - 0.18, 1.58)],
    [0, -1, 0], WARM,
  );

  box(shell, f, -hw + 0.12, -hw + 0.12 + liner, 0.16, depth - 0.12, BASE, 1.55, WHITE);
  box(shell, f, hw - 0.12 - liner, hw - 0.12, 0.16, depth - 0.12, BASE, 1.55, WHITE);
  box(shell, f, -hw + 0.16, hw - 0.16, depth - 0.2, depth - 0.08, BASE, 1.55, WHITE);
  box(shell, f, -hw + 0.16, doorL, 0.08, 0.08 + liner, BASE, MB_DOOR_TOP, WHITE);
  box(shell, f, doorR, hw - 0.16, 0.08, 0.08 + liner, BASE, MB_DOOR_TOP, WHITE);
  box(shell, f, doorL, doorR, 0.1, 0.1 + liner, 1.38, MB_DOOR_TOP, TEAL);

  box(shell, f, 6.6, 9.3, 5.25, 6.5, BASE, BASE + 1.02, WOOD);
  box(shell, f, 6.5, 9.4, 5.15, 6.6, BASE + 1.02, BASE + 1.14, TEAL);
  box(shell, f, 6.7, 9.2, 5.08, 5.28, BASE + 0.16, BASE + 1.02, WHITE);
  box(shell, f, 6.55, 9.35, 4.96, 5.08, BASE + 0.08, BASE + 0.2, WOOD_D);
  box(shell, f, 6.48, 7.42, 5.02, 5.1, BASE + 0.24, BASE + 1.1, WOOD_D);
  box(shell, f, 7.48, 8.72, 5.02, 5.1, BASE + 0.24, BASE + 1.1, WOOD_D);

  const bottles: [number, number, [number, number, number]][] = [
    [6.85, 0.28, AMBER],
    [7.15, 0.22, GLASS],
    [7.45, 0.32, RUM],
    [7.8, 0.24, LIME],
    [8.15, 0.3, AMBER],
    [8.5, 0.2, PINK],
    [8.85, 0.26, GLASS],
    [9.12, 0.18, TEAL],
  ];
  for (const [a, h, color] of bottles) {
    box(shell, f, a - 0.05, a + 0.05, 5.9, 6.08, BASE + 1.14, BASE + 1.14 + h, color);
  }
  const glasses: [number, [number, number, number]][] = [
    [6.95, GLASS], [7.35, PINK], [7.7, GLASS], [8.05, LIME], [8.55, GLASS], [8.95, AMBER],
  ];
  for (const [a, color] of glasses) {
    box(shell, f, a - 0.045, a + 0.045, 5.48, 5.62, BASE + 1.14, BASE + 1.28, color);
  }
  for (const a of [7.15, 8.0, 8.85]) {
    box(shell, f, a - 0.1, a + 0.1, 5.55, 5.85, 1.28, 1.5, TEAL);
    box(shell, f, a - 0.02, a + 0.02, 5.66, 5.74, 1.5, 1.56, WOOD_D);
  }
  for (const a of [6.9, 7.45, 8.0, 8.55, 9.1]) {
    box(shell, f, a - 0.05, a + 0.05, 5.32, 5.44, 1.4, 1.52, BULB);
  }
  box(shell, f, 6.55, 9.35, 6.35, 6.5, 1.38, 1.52, TEAL);
  box(shell, f, 6.55, 9.35, 5.2, 5.32, 1.4, 1.52, WARM);

  lowTable(shell, f, 7.45, 3.2);
  lowTable(shell, f, 8.55, 3.2);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:mb:shell";
  group.add(shellMesh);

  const menu = canvasTex(paintBoard, 512, 512);
  if (menu) {
    const boards = new Builder();
    addBoard(boards, f, 5.0, 7.55, 8.64, BASE + 0.32, BASE + 1.06);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: menu, side: DoubleSide }));
    mesh.name = "aw:mb:board";
    group.add(mesh);
  }
  const specials = canvasTex(paintSpecials, 256, 256);
  if (specials) {
    const boards = new Builder();
    addBoard(boards, f, 5.0, 6.56, 7.34, BASE + 0.36, BASE + 1.04);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: specials, side: DoubleSide }));
    mesh.name = "aw:mb:specials";
    group.add(mesh);
  }

  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), 2);
  chairs.name = "aw:mb:chairs";
  plant(chairs, f, [[6.6, 3.0], [9.2, 3.0]]);
  group.add(chairs);

  const stools = new InstancedMesh(stoolGeo(), new MeshBasicMaterial({ vertexColors: true }), 2);
  stools.name = "aw:mb:stools";
  plant(stools, f, [[6.21, 4.95], [9.01, 4.95]]);
  group.add(stools);
}
