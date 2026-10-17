// Gianni's Ristorante Italiano, the open terrace on J.E. Irausquin Boulevard.
// The awning, posts, and the glowing sign stay. Under them: green and white
// tiles, a host stand, bottles, and the Italian menu.
// Dish names follow the restaurant's menu. No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const GN_X = -8168.34;
export const GN_Z = -5382.19;

export const GN_POLY: [number, number][] = [
  [-8174.15, -5373.8], [-8168.57, -5372.03], [-8162.67, -5390.63], [-8168.25, -5392.4],
];

const INX = 0.953;
const INZ = 0.303;
const CORNERS: [number, number][] = [
  [-5.81, 8.39],
  [0.09, -10.21],
  [0.09 + INX * 10, -10.21 + INZ * 10],
  [-5.81 + INX * 10, 8.39 + INZ * 10],
];
export const gnLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const GN_DOOR_HALF = 2.4;
export const GN_DOOR_TOP = 2.7;
gnLocal.doorAt = 0;
gnLocal.depth = 7.2;
gnLocal.halfW = 6.2;

const GREEN: [number, number, number] = [0.12, 0.42, 0.22];
const GREEN_D: [number, number, number] = [0.08, 0.28, 0.14];
const WHITE: [number, number, number] = [0.95, 0.94, 0.9];
const CREAM: [number, number, number] = [0.93, 0.86, 0.72];
const RED: [number, number, number] = [0.7, 0.12, 0.14];
const WOOD: [number, number, number] = [0.42, 0.26, 0.12];
const WOOD_D: [number, number, number] = [0.3, 0.16, 0.08];
const AMBER: [number, number, number] = [0.62, 0.28, 0.1];
const WINE: [number, number, number] = [0.18, 0.32, 0.16];
const GLASS: [number, number, number] = [0.78, 0.88, 0.9];
const BULB: [number, number, number] = [1, 0.84, 0.42];

const BASE = 0.12;

export const GN_OBS: Box[] = [
  { a0: -1.5, a1: 1.5, d0: 5.3, d1: 6.7 },
  { a0: -4.2, a1: -2.6, d0: 2.4, d1: 3.8 },
  { a0: 2.4, a1: 4.0, d0: 2.4, d1: 3.8 },
  { a0: -1.1, a1: 1.1, d0: 3.3, d1: 4.5 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo(seat: [number, number, number], back: [number, number, number]) {
  const b = new Builder();
  box(b, ident, -0.2, 0.2, -0.2, 0.2, 0.42, 0.48, seat);
  box(b, ident, -0.2, 0.2, -0.2, -0.12, 0.48, 0.86, back);
  box(b, ident, -0.04, 0.04, -0.04, 0.04, 0.08, 0.42, WOOD_D);
  return b.geometry();
}

function paintMenu(g: CanvasRenderingContext2D) {
  g.fillStyle = "#f7f3ea";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#1c6b38";
  g.fillRect(0, 0, 512, 118);
  g.fillStyle = "#fffdf6";
  g.font = "700 48px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("GIANNI'S", 256, 42);
  g.font = "600 24px Arial, sans-serif";
  g.fillText("RISTORANTE", 256, 88);
  g.fillStyle = "#8d1d24";
  g.fillRect(0, 118, 512, 8);
  const rows: [string, string][] = [
    ["Bruschetta Napoli", "8.25"],
    ["Bucatini Siciliana", "20.35"],
    ["Puttanesca", "20.35"],
    ["Vitello Parmigiana", "30.25"],
    ["Ossobuco", "35.75"],
    ["Tiramisu", ""],
  ];
  rows.forEach((row, i) => {
    const y = 168 + i * 52;
    g.fillStyle = i % 2 === 0 ? "#e7f2e4" : "#f7f3ea";
    g.fillRect(18, y - 22, 476, 48);
    g.fillStyle = "#1c3a18";
    g.font = "600 24px Arial, sans-serif";
    g.textAlign = "left";
    g.fillText(row[0], 32, y);
    if (row[1]) {
      g.textAlign = "right";
      g.fillText(row[1], 480, y);
    }
  });
}

function paintSignature(g: CanvasRenderingContext2D) {
  g.fillStyle = "#8d1d24";
  g.fillRect(0, 0, 256, 320);
  g.fillStyle = "#f7f3ea";
  g.fillRect(10, 10, 236, 300);
  g.fillStyle = "#1c6b38";
  g.fillRect(10, 10, 236, 70);
  g.fillStyle = "#fffdf6";
  g.font = "700 22px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("SIGNATURE", 128, 46);
  g.fillStyle = "#1c3a18";
  g.font = "600 20px Arial, sans-serif";
  g.fillText("Spaghetti", 128, 112);
  g.fillText("al Parmigiano", 128, 142);
  g.font = "600 16px Arial, sans-serif";
  g.fillStyle = "#8d1d24";
  g.fillText("tableside", 128, 174);
  g.fillStyle = "#1c3a18";
  g.font = "600 18px Arial, sans-serif";
  g.fillText("Linguine Mare", 128, 220);
  g.fillText("Cannoli", 128, 258);
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

function plant(mesh: InstancedMesh, f: Frame, spots: [number, number][], flip: boolean) {
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.nx, f.nz) + (flip && i % 2 ? Math.PI : 0));
    mesh.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  mesh.count = spots.length;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  mesh.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
}

export function buildGiannis(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = gnLocal.halfW;
  const depth = gnLocal.depth;

  shell.quad(
    [pt(f, -hw + 0.3, 0.15, BASE), pt(f, hw - 0.3, 0.15, BASE), pt(f, hw - 0.3, depth - 0.2, BASE), pt(f, -hw + 0.3, depth - 0.2, BASE)],
    [0, 1, 0], GREEN_D,
  );
  const step = 1.35;
  for (let a = -hw + 0.4; a < hw - 0.35; a += step) {
    for (let d = 0.25; d < depth - 0.3; d += step) {
      const a1 = Math.min(a + step - 0.08, hw - 0.32);
      const d1 = Math.min(d + step - 0.08, depth - 0.22);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.02), pt(f, a1, d, BASE + 0.02), pt(f, a1, d1, BASE + 0.02), pt(f, a, d1, BASE + 0.02)],
        [0, 1, 0], alt ? WHITE : GREEN,
      );
    }
  }
  shell.quad(
    [pt(f, -0.42, 0.3, BASE + 0.04), pt(f, 0.42, 0.3, BASE + 0.04), pt(f, 0.42, 3.05, BASE + 0.04), pt(f, -0.42, 3.05, BASE + 0.04)],
    [0, 1, 0], CREAM,
  );

  const tables: [number, number][] = [[-3.4, 3.1], [3.2, 3.1], [0, 3.9]];
  for (const [a, d] of tables) {
    box(shell, f, a - 0.55, a + 0.55, d - 0.4, d + 0.4, BASE, BASE + 0.74, WOOD);
    box(shell, f, a - 0.62, a + 0.62, d - 0.46, d + 0.46, BASE + 0.74, BASE + 0.8, WHITE);
    box(shell, f, a - 0.62, a + 0.62, d - 0.46, d - 0.4, BASE + 0.8, BASE + 0.86, RED);
    box(shell, f, a - 0.12, a + 0.12, d - 0.1, d + 0.1, BASE + 0.86, BASE + 0.96, CREAM);
  }

  box(shell, f, -1.4, 1.4, 5.4, 6.55, BASE, BASE + 1.05, WOOD);
  box(shell, f, -1.5, 1.5, 5.3, 6.65, BASE + 1.05, BASE + 1.14, GREEN);
  box(shell, f, -1.35, 1.35, 5.25, 5.42, BASE + 0.2, BASE + 0.55, GREEN);
  box(shell, f, -1.35, 1.35, 5.25, 5.42, BASE + 0.55, BASE + 0.68, WHITE);
  box(shell, f, -1.35, 1.35, 5.25, 5.42, BASE + 0.68, BASE + 1.05, RED);
  box(shell, f, -1.15, 1.15, 6.35, 6.5, BASE + 1.14, BASE + 1.22, WOOD_D);

  const bottles: [number, number, [number, number, number]][] = [
    [-0.85, 0.32, WINE],
    [-0.55, 0.26, AMBER],
    [-0.25, 0.34, WINE],
    [0.1, 0.22, GLASS],
    [0.4, 0.3, AMBER],
    [0.75, 0.24, WINE],
  ];
  for (const [a, h, color] of bottles) {
    box(shell, f, a - 0.05, a + 0.05, 6.05, 6.2, BASE + 1.22, BASE + 1.22 + h, color);
  }
  for (const a of [-0.7, -0.2, 0.25, 0.7]) {
    box(shell, f, a - 0.04, a + 0.04, 5.55, 5.68, BASE + 1.14, BASE + 1.28, GLASS);
  }

  box(shell, f, -4.6, 4.6, 1.15, 1.32, 2.32, 2.46, WOOD_D);
  for (const a of [-3.6, -1.8, 0, 1.8, 3.6]) {
    box(shell, f, a - 0.06, a + 0.06, 1.18, 1.3, 2.1, 2.32, BULB);
  }

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:gn:shell";
  group.add(shellMesh);

  const menu = canvasTex(paintMenu, 512, 512);
  if (menu) {
    const boards = new Builder();
    addBoard(boards, f, 5.18, -1.15, 1.15, BASE + 1.22, BASE + 2.42);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: menu, side: DoubleSide }));
    mesh.name = "aw:gn:board";
    group.add(mesh);
  }
  const signature = canvasTex(paintSignature, 256, 320);
  if (signature) {
    const boards = new Builder();
    addBoard(boards, f, 5.18, 1.32, 2.12, BASE + 1.18, BASE + 2.22);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: signature, side: DoubleSide }));
    mesh.name = "aw:gn:signature";
    group.add(mesh);
  }

  const reds = new InstancedMesh(chairGeo(RED, WHITE), new MeshBasicMaterial({ vertexColors: true }), 4);
  reds.name = "aw:gn:chairs";
  plant(reds, f, [[-4.2, 3.1], [-2.6, 3.1], [2.4, 3.1], [4.0, 3.1]], true);
  group.add(reds);

  const greens = new InstancedMesh(chairGeo(GREEN, CREAM), new MeshBasicMaterial({ vertexColors: true }), 2);
  greens.name = "aw:gn:side";
  plant(greens, f, [[-0.9, 3.2], [0.9, 3.2]], true);
  group.add(greens);
}
