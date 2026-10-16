// Hyatt Regency Aruba. The terracotta roofs and the sign stay. The door is
// the ground floor under the sign, on the face toward J.E. Irausquin Boulevard:
// a cream lobby, a wood desk, and a short board.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const HY_X = -8208.36;
export const HY_Z = -5722.87;

export const HY_POLY: [number, number][] = [
  [-8279.3, -5764.7], [-8277.7, -5764.3], [-8279.3, -5758.7], [-8196.9, -5735.5],
  [-8213.1, -5679], [-8239.9, -5686.5], [-8241.1, -5682.5], [-8242.9, -5683.1],
  [-8245.7, -5673.4], [-8243.8, -5672.9], [-8245.1, -5668.4], [-8201.5, -5656.6],
  [-8200.1, -5661.4], [-8196.7, -5660.5], [-8193.3, -5672.4], [-8196.7, -5673.4],
  [-8190.7, -5694.2], [-8184.5, -5692.5], [-8181.4, -5703], [-8188, -5704.8],
  [-8183.8, -5719.4], [-8163.2, -5713.6], [-8164, -5710.8], [-8154.6, -5708.1],
  [-8151.9, -5717.5], [-8156.1, -5718.7], [-8147.5, -5748.7], [-8156, -5751.1],
  [-8148.3, -5777.8], [-8170, -5784], [-8169.7, -5784.9], [-8176.2, -5786.7],
  [-8176.8, -5784.3], [-8182.3, -5785.8], [-8190, -5758.9], [-8258.7, -5778.3],
  [-8258.4, -5779.4], [-8268.2, -5782.2], [-8269.1, -5779.1], [-8274.8, -5780.7],
];

// Sign wall, local to the hero centroid, plus two points inward so the
// frame faces the boulevard.
const INX = -0.9613;
const INZ = -0.2755;
const CORNERS: [number, number][] = [
  [52.26, 4.17],
  [60.86, -25.84],
  [60.86 + INX * 14, -25.84 + INZ * 14],
  [52.26 + INX * 14, 4.17 + INZ * 14],
];
export const hyLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const HY_DOOR_HALF = 2.7;
export const HY_DOOR_TOP = 4.05;
hyLocal.doorAt = 0;
hyLocal.depth = 11.5;
hyLocal.halfW = 8.2;

const CREAM: [number, number, number] = [0.93, 0.88, 0.78];
const CREAM_D: [number, number, number] = [0.82, 0.74, 0.62];
const TERRA: [number, number, number] = [0.72, 0.34, 0.2];
const WOOD: [number, number, number] = [0.48, 0.3, 0.16];
const WOOD_D: [number, number, number] = [0.3, 0.18, 0.09];
const GREEN: [number, number, number] = [0.18, 0.4, 0.24];
const WHITE: [number, number, number] = [0.96, 0.94, 0.9];

// Sidewalk at this door may sit above the hero origin. Updated if the
// survey shows a berm.
const BASE = 0.08;

export const HY_OBS: Box[] = [
  { a0: -3.3, a1: 3.3, d0: 7.15, d1: 9.05 },
  { a0: -6.4, a1: -4.6, d0: 3.6, d1: 5.1 },
  { a0: 4.5, a1: 6.3, d0: 3.8, d1: 5.3 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.26, 0.26, -0.26, 0.26, 0.4, 0.48, TERRA);
  box(b, ident, -0.26, 0.26, -0.26, -0.16, 0.48, 0.84, CREAM);
  return b.geometry();
}

function boardTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f3eadc";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#8c3b22";
  g.fillRect(0, 0, 512, 168);
  g.fillStyle = "#fff8ee";
  g.font = "700 58px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("HYATT", 256, 58);
  g.font = "600 32px Arial, sans-serif";
  g.fillText("REGENCY ARUBA", 256, 118);
  g.fillStyle = "#3a2a1c";
  g.font = "600 30px Arial, sans-serif";
  ["Reception", "Casino", "Pool  ·  Beach"].forEach((line, i) => g.fillText(line, 256, 240 + i * 64));
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
  face(d, [-f.nx, 0, -f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
  face(d - 0.04, [f.nx, 0, f.nz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

export function buildHyatt(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = hyLocal.halfW;
  const depth = hyLocal.depth;
  const doorL = -HY_DOOR_HALF;
  const doorR = HY_DOOR_HALF;
  const liner = 0.12;

  shell.quad(
    [pt(f, -hw + 0.25, 0.12, BASE), pt(f, hw - 0.25, 0.12, BASE), pt(f, hw - 0.25, depth - 0.2, BASE), pt(f, -hw + 0.25, depth - 0.2, BASE)],
    [0, 1, 0], CREAM_D,
  );
  const step = 1.7;
  for (let a = -hw + 0.35; a < hw - 0.4; a += step) {
    for (let d = 0.16; d < depth - 0.28; d += step) {
      const a1 = Math.min(a + step - 0.07, hw - 0.3);
      const d1 = Math.min(d + step - 0.07, depth - 0.22);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.03), pt(f, a1, d, BASE + 0.03), pt(f, a1, d1, BASE + 0.03), pt(f, a, d1, BASE + 0.03)],
        [0, 1, 0], alt ? CREAM : CREAM_D,
      );
    }
  }
  shell.quad(
    [pt(f, -hw + 0.3, 0.25, 3.95), pt(f, hw - 0.3, 0.25, 3.95), pt(f, hw - 0.3, depth - 0.25, 3.95), pt(f, -hw + 0.3, depth - 0.25, 3.95)],
    [0, -1, 0], WHITE,
  );

  box(shell, f, -hw + 0.15, -hw + 0.15 + liner, 0.2, depth - 0.15, BASE, 3.9, CREAM);
  box(shell, f, hw - 0.15 - liner, hw - 0.15, 0.2, depth - 0.15, BASE, 3.9, CREAM);
  box(shell, f, -hw + 0.2, hw - 0.2, depth - 0.22, depth - 0.1, BASE, 3.9, CREAM);
  box(shell, f, -hw + 0.2, doorL, 0.1, 0.1 + liner, BASE, HY_DOOR_TOP, CREAM);
  box(shell, f, doorR, hw - 0.2, 0.1, 0.1 + liner, BASE, HY_DOOR_TOP, CREAM);
  box(shell, f, doorL, doorR, 0.12, 0.12 + liner, 3.7, HY_DOOR_TOP + 0.02, TERRA);

  box(shell, f, -3.15, 3.15, 7.25, 8.95, BASE, BASE + 1.05, WOOD);
  box(shell, f, -3.25, 3.25, 7.2, 9.0, BASE + 1.05, BASE + 1.12, WOOD_D);
  box(shell, f, -3.1, 3.1, 7.15, 7.35, BASE + 0.1, BASE + 1.05, TERRA);
  box(shell, f, -5.6, -4.8, 3.4, 4.2, BASE, BASE + 0.9, GREEN);
  box(shell, f, 4.7, 5.6, 3.5, 4.3, BASE, BASE + 0.9, GREEN);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:hy:shell";
  group.add(shellMesh);

  const tex = boardTexture();
  if (tex) {
    const boards = new Builder();
    addBoard(boards, f, 9.6, -2.4, 2.4, BASE + 1.2, BASE + 2.7);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:hy:board";
    group.add(mesh);
  }

  const spots: [number, number][] = [[-5.5, 4.35], [5.4, 4.55]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:hy:chairs";
  chairs.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.ux, f.uz) + (i ? Math.PI : 0));
    chairs.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  chairs.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 18);
  group.add(chairs);
}
