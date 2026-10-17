// Señor Frog's, Palm Beach. The green wordmark and the yellow walls stay.
// The door is the ground floor under the sign, on the boulevard face:
// a yellow bar, a green band, and a short menu.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const SF_X = -8172.13;
export const SF_Z = -5301.78;

export const SF_POLY: [number, number][] = [
  [-8190.1, -5299.2], [-8165.7, -5290.6], [-8162.5, -5299.5],
  [-8165.9, -5300.6], [-8163.8, -5306.7], [-8184.8, -5314.1],
];

const INX = 0.9422;
const INZ = 0.3351;
const CORNERS: [number, number][] = [
  [-17.97, 2.58],
  [-12.67, -12.32],
  [-12.67 + INX * 12, -12.32 + INZ * 12],
  [-17.97 + INX * 12, 2.58 + INZ * 12],
];
export const sfLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const SF_DOOR_HALF = 2.05;
export const SF_DOOR_TOP = 2.75;
sfLocal.doorAt = 0;
sfLocal.depth = 8.2;
sfLocal.halfW = 5.2;

const YEL: [number, number, number] = [0.95, 0.78, 0.12];
const YEL_D: [number, number, number] = [0.86, 0.66, 0.08];
const GREEN: [number, number, number] = [0.12, 0.52, 0.24];
const GREEN_D: [number, number, number] = [0.08, 0.36, 0.16];
const WOOD: [number, number, number] = [0.45, 0.28, 0.14];
const WHITE: [number, number, number] = [0.96, 0.95, 0.9];

const BASE = 0.52;

export const SF_OBS: Box[] = [
  { a0: -2.6, a1: 2.6, d0: 5.55, d1: 7.35 },
  { a0: -4.3, a1: -2.9, d0: 2.7, d1: 4.15 },
  { a0: 2.8, a1: 4.2, d0: 2.7, d1: 4.15 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.24, 0.24, -0.24, 0.24, 0.4, 0.48, YEL);
  box(b, ident, -0.24, 0.24, -0.24, -0.14, 0.48, 0.86, GREEN);
  return b.geometry();
}

function boardTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#fff6d8";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#1a8a3a";
  g.fillRect(0, 0, 512, 168);
  g.fillStyle = "#fffdf4";
  g.font = "700 46px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("SEÑOR FROG'S", 256, 62);
  g.font = "600 26px Arial, sans-serif";
  g.fillText("PALM BEACH", 256, 122);
  g.fillStyle = "#1c3a18";
  g.font = "600 32px Arial, sans-serif";
  ["Margarita", "Nachos", "Fajitas"].forEach((line, i) => g.fillText(line, 256, 246 + i * 68));
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

export function buildSenorfrogs(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = sfLocal.halfW;
  const depth = sfLocal.depth;
  const doorL = -SF_DOOR_HALF;
  const doorR = SF_DOOR_HALF;
  const liner = 0.12;

  shell.quad(
    [pt(f, -hw + 0.2, 0.1, BASE), pt(f, hw - 0.2, 0.1, BASE), pt(f, hw - 0.2, depth - 0.18, BASE), pt(f, -hw + 0.2, depth - 0.18, BASE)],
    [0, 1, 0], YEL_D,
  );
  const step = 1.35;
  for (let a = -hw + 0.28; a < hw - 0.3; a += step) {
    for (let d = 0.16; d < depth - 0.26; d += step) {
      const a1 = Math.min(a + step - 0.06, hw - 0.24);
      const d1 = Math.min(d + step - 0.06, depth - 0.2);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.03), pt(f, a1, d, BASE + 0.03), pt(f, a1, d1, BASE + 0.03), pt(f, a, d1, BASE + 0.03)],
        [0, 1, 0], alt ? YEL : GREEN,
      );
    }
  }
  shell.quad(
    [pt(f, -hw + 0.22, 0.18, 2.7), pt(f, hw - 0.22, 0.18, 2.7), pt(f, hw - 0.22, depth - 0.18, 2.7), pt(f, -hw + 0.22, depth - 0.18, 2.7)],
    [0, -1, 0], WHITE,
  );

  box(shell, f, -hw + 0.12, -hw + 0.12 + liner, 0.16, depth - 0.12, BASE, 2.68, YEL);
  box(shell, f, hw - 0.12 - liner, hw - 0.12, 0.16, depth - 0.12, BASE, 2.68, YEL);
  box(shell, f, -hw + 0.16, hw - 0.16, depth - 0.2, depth - 0.08, BASE, 2.68, YEL);
  box(shell, f, -hw + 0.16, doorL, 0.08, 0.08 + liner, BASE, SF_DOOR_TOP, YEL);
  box(shell, f, doorR, hw - 0.16, 0.08, 0.08 + liner, BASE, SF_DOOR_TOP, YEL);
  box(shell, f, doorL, doorR, 0.1, 0.1 + liner, 2.42, SF_DOOR_TOP, GREEN);
  box(shell, f, -hw + 0.12, -hw + 0.12 + liner, 0.16, depth - 0.12, 2.2, 2.42, GREEN);
  box(shell, f, hw - 0.12 - liner, hw - 0.12, 0.16, depth - 0.12, 2.2, 2.42, GREEN);
  box(shell, f, -hw + 0.16, hw - 0.16, depth - 0.2, depth - 0.08, 2.2, 2.42, GREEN);

  box(shell, f, -2.4, 2.4, 5.7, 7.2, BASE, BASE + 1.05, WOOD);
  box(shell, f, -2.5, 2.5, 5.6, 7.3, BASE + 1.05, BASE + 1.14, GREEN);
  box(shell, f, -2.3, 2.3, 5.55, 5.75, BASE + 0.15, BASE + 1.05, YEL);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:sf:shell";
  group.add(shellMesh);

  const tex = boardTexture();
  if (tex) {
    const boards = new Builder();
    addBoard(boards, f, 7.55, -2.1, 2.1, BASE + 1.05, BASE + 2.15);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:sf:board";
    group.add(mesh);
  }

  const spots: [number, number][] = [[-3.6, 3.4], [3.5, 3.4]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:sf:chairs";
  chairs.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.nx, f.nz));
    chairs.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  chairs.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 14);
  group.add(chairs);
}
