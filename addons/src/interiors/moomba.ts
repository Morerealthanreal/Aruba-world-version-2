// Moomba Beach Bar. The teal MOOMBA BEACH sign stays.
// The door is the ground floor under that sign: a wood bar, teal top, white room.
// No photographs are used as textures.
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
const TEAL_D: [number, number, number] = [0.03, 0.30, 0.36];
const SAND: [number, number, number] = [0.90, 0.82, 0.66];
const WHITE: [number, number, number] = [0.96, 0.95, 0.92];
const WOOD: [number, number, number] = [0.45, 0.28, 0.14];

const BASE = 0.06;

export const MB_OBS: Box[] = [
  { a0: 6.5, a1: 9.4, d0: 5.1, d1: 6.65 },
  { a0: 6.2, a1: 7.2, d0: 2.4, d1: 3.7 },
  { a0: 8.8, a1: 9.6, d0: 2.4, d1: 3.7 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.24, 0.24, -0.24, 0.24, 0.4, 0.48, WHITE);
  box(b, ident, -0.24, 0.24, -0.24, -0.14, 0.48, 0.86, TEAL);
  return b.geometry();
}

function boardTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f4efe4";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#0d6b7a";
  g.fillRect(0, 0, 512, 176);
  g.fillStyle = "#f7fffe";
  g.font = "700 48px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("MOOMBA BEACH", 256, 68);
  g.font = "600 26px Arial, sans-serif";
  g.fillText("PALM BEACH", 256, 128);
  g.fillStyle = "#16343a";
  g.font = "600 32px Arial, sans-serif";
  ["Burger", "Fish", "Cocktail"].forEach((line, i) => g.fillText(line, 256, 250 + i * 68));
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
  face(d - 0.04, [f.nx, 0, f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

export function buildMoomba(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = mbLocal.halfW;
  const depth = mbLocal.depth;
  const doorL = mbLocal.doorAt - MB_DOOR_HALF;
  const doorR = mbLocal.doorAt + MB_DOOR_HALF;
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
    [pt(f, -hw + 0.22, 0.18, 1.58), pt(f, hw - 0.22, 0.18, 1.58), pt(f, hw - 0.22, depth - 0.18, 1.58), pt(f, -hw + 0.22, depth - 0.18, 1.58)],
    [0, -1, 0], WHITE,
  );

  box(shell, f, -hw + 0.12, -hw + 0.12 + liner, 0.16, depth - 0.12, BASE, 1.55, WHITE);
  box(shell, f, hw - 0.12 - liner, hw - 0.12, 0.16, depth - 0.12, BASE, 1.55, WHITE);
  box(shell, f, -hw + 0.16, hw - 0.16, depth - 0.2, depth - 0.08, BASE, 1.55, WHITE);
  box(shell, f, -hw + 0.16, doorL, 0.08, 0.08 + liner, BASE, MB_DOOR_TOP, WHITE);
  box(shell, f, doorR, hw - 0.16, 0.08, 0.08 + liner, BASE, MB_DOOR_TOP, WHITE);
  box(shell, f, doorL, doorR, 0.1, 0.1 + liner, 1.38, MB_DOOR_TOP, TEAL);

  box(shell, f, 6.6, 9.3, 5.25, 6.5, BASE, BASE + 1.02, WOOD);
  box(shell, f, 6.5, 9.4, 5.15, 6.6, BASE + 1.02, BASE + 1.12, TEAL);
  box(shell, f, 6.7, 9.2, 5.1, 5.3, BASE + 0.15, BASE + 1.02, WHITE);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:mb:shell";
  group.add(shellMesh);

  const tex = boardTexture();
  if (tex) {
    const boards = new Builder();
    addBoard(boards, f, 6.75, 6.7, 9.3, BASE + 0.55, BASE + 1.42);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:mb:board";
    group.add(mesh);
  }

  const spots: [number, number][] = [[6.6, 3.0], [9.2, 3.0]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:mb:chairs";
  chairs.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.nx, f.nz));
    chairs.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  chairs.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
  group.add(chairs);
}
