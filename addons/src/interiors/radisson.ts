// Radisson Blu Aruba, Palm Beach. The tower, balconies, and the Radisson Blu
// sign on the east face stay. The door is the north podium, the short side
// that meets the street: white piers and blue glass, opened into a lobby.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const RD_X = -7830.95;
export const RD_Z = -6156.4;

export const RD_POLY: [number, number][] = [
  [-7847.6, -6120],
  [-7820.6, -6117.4],
  [-7814.2, -6193.2],
  [-7841.4, -6195],
];

// North edge, the short street face. Local to the hero centroid.
const CORNERS: [number, number][] = [
  [-16.65, 36.4],
  [10.35, 39.0],
  [16.75, -36.8],
  [-10.45, -38.6],
];
export const rdLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const RD_DOOR_HALF = 3.35;
export const RD_DOOR_TOP = 4.15;
// Two glass bays in the middle of the 27 m face. The lobby is only the
// front of the tower; the rest of the footprint stays solid.
rdLocal.doorAt = 0;
rdLocal.depth = 13.6;
rdLocal.halfW = 9.4;

const WHITE: [number, number, number] = [0.94, 0.94, 0.95];
const NAVY: [number, number, number] = [0.06, 0.2, 0.46];
const BLUE: [number, number, number] = [0.16, 0.4, 0.68];
const CREAM: [number, number, number] = [0.91, 0.88, 0.82];
const PALE: [number, number, number] = [0.74, 0.82, 0.86];
const WOOD: [number, number, number] = [0.52, 0.36, 0.2];
const WOOD_D: [number, number, number] = [0.32, 0.2, 0.1];
const PLANT: [number, number, number] = [0.2, 0.46, 0.26];
const SOFA: [number, number, number] = [0.14, 0.34, 0.6];
// The sidewalk at this door is higher than the hero origin. Floor and
// furniture sit on that sidewalk; the ceiling stays under the podium cut.
const BASE = 1.42;

/** along / inward solids. The aisle at along 0 stays clear to the desk. */
export const RD_OBS: Box[] = [
  { a0: -3.4, a1: 3.4, d0: 8.5, d1: 10.5 },
  { a0: 5.15, a1: 8.7, d0: 2.25, d1: 4.15 },
  { a0: -7.15, a1: -5.35, d0: 4.15, d1: 5.55 },
  { a0: -6.9, a1: -5.1, d0: 6.55, d1: 7.95 },
  { a0: -4.3, a1: -2.7, d0: 5.2, d1: 6.5 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.28, 0.28, -0.28, 0.28, 0.4, 0.48, SOFA);
  box(b, ident, -0.28, 0.28, -0.28, -0.16, 0.48, 0.86, CREAM);
  box(b, ident, -0.26, -0.2, -0.26, 0.26, 0.2, 0.52, WOOD_D);
  box(b, ident, 0.2, 0.26, -0.26, 0.26, 0.2, 0.52, WOOD_D);
  return b.geometry();
}

function tableGeo() {
  const b = new Builder();
  box(b, ident, -0.36, 0.36, -0.36, 0.36, 0.4, 0.46, WOOD);
  box(b, ident, -0.05, 0.05, -0.05, 0.05, 0.05, 0.4, WOOD_D);
  return b.geometry();
}

function boardTexture(kind: "desk" | "clover") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  if (kind === "desk") {
    g.fillStyle = "#0d2748";
    g.fillRect(0, 0, 512, 512);
    g.fillStyle = "#ffffff";
    g.font = "700 54px Arial, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("RADISSON", 256, 150);
    g.fillStyle = "#8ec8f0";
    g.font = "700 48px Arial, sans-serif";
    g.fillText("BLU", 256, 214);
    g.fillStyle = "#d5e4f2";
    g.font = "600 26px Arial, sans-serif";
    const lines = ["Reception", "The Clover", "Pool  ·  Beach"];
    lines.forEach((line, i) => g.fillText(line, 256, 310 + i * 48));
  } else {
    g.fillStyle = "#1c2418";
    g.fillRect(0, 0, 512, 512);
    g.fillStyle = "#2f6b3a";
    g.fillRect(0, 0, 512, 96);
    g.fillStyle = "#f4efe4";
    g.font = "700 40px Arial, sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("THE CLOVER", 256, 40);
    g.font = "600 18px Arial, sans-serif";
    g.fillText("COFFEE  ·  TEA", 256, 74);
    const rows: [string, string][] = [
      ["House Coffee", "4"],
      ["Espresso", "3"],
      ["Iced Tea", "4"],
      ["Fruit Bowl", "8"],
      ["Avocado Toast", "11"],
    ];
    rows.forEach((r, i) => {
      const y = 150 + i * 64;
      g.fillStyle = i % 2 ? "#243024" : "#1c2418";
      g.fillRect(16, y - 28, 480, 56);
      g.fillStyle = "#f4efe4";
      g.font = "600 26px Arial, sans-serif";
      g.textAlign = "left";
      g.fillText(r[0], 36, y);
      g.fillStyle = "#d4e37a";
      g.textAlign = "right";
      g.fillText(r[1], 468, y);
    });
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Back-wall board. Guests look inward (+N); the face reads left to right. */
function addDeskBoard(b: Builder, f: Frame, d: number, a0: number, a1: number, y0: number, y1: number) {
  const face = (inward: number, normal: [number, number, number], uv: [[number, number], [number, number], [number, number], [number, number]]) => {
    b.quad([
      pt(f, a0, inward, y0), pt(f, a1, inward, y0),
      pt(f, a1, inward, y1), pt(f, a0, inward, y1),
    ], normal, [1, 1, 1], uv);
  };
  face(d, [-f.nx, 0, -f.nz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
  face(d - 0.04, [f.nx, 0, f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
}

/** Clover board on the west side of the counter. Same facing as the Hard Rock menu. */
function addCloverBoard(b: Builder, f: Frame, a: number, d: number, y0: number, y1: number, halfD: number) {
  const quad = (along: number, normal: [number, number, number], uv: [[number, number], [number, number], [number, number], [number, number]]) => {
    b.quad([
      pt(f, along, d - halfD, y0), pt(f, along, d + halfD, y0),
      pt(f, along, d + halfD, y1), pt(f, along, d - halfD, y1),
    ], normal, [1, 1, 1], uv);
  };
  quad(a, [-f.ux, 0, -f.uz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
  quad(a - 0.03, [f.ux, 0, f.uz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

export function buildRadisson(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = rdLocal.halfW;
  const depth = rdLocal.depth;
  const doorL = -RD_DOOR_HALF;
  const doorR = RD_DOOR_HALF;
  const liner = 0.12;

  shell.quad(
    [pt(f, -hw + 0.25, 0.12, BASE), pt(f, hw - 0.25, 0.12, BASE), pt(f, hw - 0.25, depth - 0.2, BASE), pt(f, -hw + 0.25, depth - 0.2, BASE)],
    [0, 1, 0], [0.86, 0.84, 0.8],
  );
  const step = 1.6;
  for (let a = -hw + 0.35; a < hw - 0.4; a += step) {
    for (let d = 0.18; d < depth - 0.3; d += step) {
      const a1 = Math.min(a + step - 0.06, hw - 0.3);
      const d1 = Math.min(d + step - 0.06, depth - 0.24);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.03), pt(f, a1, d, BASE + 0.03), pt(f, a1, d1, BASE + 0.03), pt(f, a, d1, BASE + 0.03)],
        [0, 1, 0], alt ? CREAM : PALE,
      );
    }
  }
  shell.quad(
    [pt(f, -hw + 0.3, 0.25, 4.02), pt(f, hw - 0.3, 0.25, 4.02), pt(f, hw - 0.3, depth - 0.25, 4.02), pt(f, -hw + 0.3, depth - 0.25, 4.02)],
    [0, -1, 0], WHITE,
  );
  box(shell, f, -hw + 0.4, hw - 0.4, 0.4, depth - 0.35, 3.88, 4.0, NAVY);

  box(shell, f, -hw + 0.15, -hw + 0.15 + liner, 0.2, depth - 0.15, BASE, 3.98, WHITE);
  box(shell, f, hw - 0.15 - liner, hw - 0.15, 0.2, depth - 0.15, BASE, 3.98, WHITE);
  box(shell, f, -hw + 0.2, hw - 0.2, depth - 0.22, depth - 0.1, BASE, 3.98, WHITE);
  box(shell, f, -hw + 0.2, doorL, 0.1, 0.1 + liner, BASE, RD_DOOR_TOP, WHITE);
  box(shell, f, doorR, hw - 0.2, 0.1, 0.1 + liner, BASE, RD_DOOR_TOP, WHITE);
  box(shell, f, doorL, doorR, 0.12, 0.12 + liner, 3.78, RD_DOOR_TOP + 0.02, NAVY);

  // reception desk, navy front toward the door
  box(shell, f, -3.2, 3.2, 8.6, 10.3, BASE, BASE + 1.05, WOOD);
  box(shell, f, -3.3, 3.3, 8.55, 10.4, BASE + 1.05, BASE + 1.12, WOOD_D);
  box(shell, f, -3.2, 3.2, 8.5, 8.7, BASE + 0.08, BASE + 1.05, NAVY);
  box(shell, f, -3.2, 3.2, 8.52, 8.66, BASE + 0.92, BASE + 1.0, BLUE);

  // The Clover, just inside the entrance on the east side
  box(shell, f, 5.2, 8.6, 2.3, 4.05, BASE, BASE + 1.02, WOOD);
  box(shell, f, 5.15, 8.65, 2.25, 4.1, BASE + 1.02, BASE + 1.1, WOOD_D);
  box(shell, f, 5.2, 5.38, 2.35, 4.0, BASE + 0.1, BASE + 1.02, PLANT);
  box(shell, f, 7.6, 8.4, 2.45, 3.15, BASE + 1.1, BASE + 1.7, PLANT);
  box(shell, f, 6.3, 7.2, 2.4, 3.0, BASE + 1.1, BASE + 1.52, [0.55, 0.62, 0.32]);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:rd:shell";
  group.add(shellMesh);

  const deskTex = boardTexture("desk");
  if (deskTex) {
    const boards = new Builder();
    addDeskBoard(boards, f, 11.15, -2.5, 2.5, BASE + 1.15, BASE + 2.45);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: deskTex, side: DoubleSide }));
    mesh.name = "aw:rd:desk";
    group.add(mesh);
  }
  const cloverTex = boardTexture("clover");
  if (cloverTex) {
    const boards = new Builder();
    addCloverBoard(boards, f, 5.12, 3.15, BASE + 1.15, BASE + 2.35, 0.7);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: cloverTex, side: DoubleSide }));
    mesh.name = "aw:rd:clover";
    group.add(mesh);
  }

  const spots: [number, number][] = [[-6.25, 4.85], [-6.0, 7.25]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length * 2);
  const tables = new InstancedMesh(tableGeo(), new MeshBasicMaterial({ vertexColors: true }), 1);
  chairs.name = "aw:rd:chairs";
  tables.name = "aw:rd:tables";
  chairs.frustumCulled = false;
  tables.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const c0 = pt(f, a - 0.55, d, 0);
    pos.set(c0[0], BASE, c0[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.nx, f.nz));
    chairs.setMatrixAt(i * 2, m4.compose(pos, quat, scl));
    const c1 = pt(f, a + 0.55, d, 0);
    pos.set(c1[0], BASE, c1[2]);
    quat.setFromAxisAngle(up, Math.atan2(-f.nx, -f.nz));
    chairs.setMatrixAt(i * 2 + 1, m4.compose(pos, quat, scl));
  });
  const tp = pt(f, -3.5, 5.85, 0);
  pos.set(tp[0], BASE, tp[2]);
  quat.setFromAxisAngle(up, 0);
  tables.setMatrixAt(0, m4.compose(pos, quat, scl));
  chairs.count = spots.length * 2;
  tables.count = 1;
  chairs.instanceMatrix.needsUpdate = true;
  tables.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 20);
  tables.boundingSphere = new Sphere(new Vector3(0, 1, 0), 20);
  group.add(chairs, tables);
}
