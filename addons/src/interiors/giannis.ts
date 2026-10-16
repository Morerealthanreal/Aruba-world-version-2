// Gianni's, the open terrace on J.E. Irausquin Boulevard.
// The awning, posts, plants and the glowing sign stay. Under them: green and
// white tiles, a host stand, and a short Italian menu.
// No photographs are used as textures.
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
const RED: [number, number, number] = [0.7, 0.12, 0.14];
const WOOD: [number, number, number] = [0.42, 0.26, 0.12];

const BASE = 0.12;

export const GN_OBS: Box[] = [
  { a0: -1.5, a1: 1.5, d0: 5.3, d1: 6.7 },
  { a0: -4.2, a1: -2.6, d0: 2.4, d1: 3.8 },
  { a0: 2.4, a1: 4.0, d0: 2.4, d1: 3.8 },
  { a0: -1.1, a1: 1.1, d0: 3.3, d1: 4.5 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.22, 0.22, -0.22, 0.22, 0.4, 0.46, RED);
  box(b, ident, -0.22, 0.22, -0.22, -0.14, 0.46, 0.82, WHITE);
  return b.geometry();
}

function boardTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f7f3ea";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#1c6b38";
  g.fillRect(0, 0, 512, 168);
  g.fillStyle = "#fffdf6";
  g.font = "700 52px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("GIANNI'S", 256, 62);
  g.font = "600 26px Arial, sans-serif";
  g.fillText("RISTORANTE", 256, 122);
  g.fillStyle = "#7a1c22";
  g.fillRect(0, 168, 512, 10);
  g.fillStyle = "#1c3a18";
  g.font = "600 32px Arial, sans-serif";
  ["Pasta", "Pizza", "Tiramisu"].forEach((line, i) => g.fillText(line, 256, 250 + i * 68));
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

  const tables: [number, number][] = [[-3.4, 3.1], [3.2, 3.1], [0, 3.9]];
  for (const [a, d] of tables) {
    box(shell, f, a - 0.55, a + 0.55, d - 0.4, d + 0.4, BASE, BASE + 0.74, WOOD);
    box(shell, f, a - 0.62, a + 0.62, d - 0.46, d + 0.46, BASE + 0.74, BASE + 0.82, WHITE);
  }
  box(shell, f, -1.4, 1.4, 5.4, 6.55, BASE, BASE + 1.05, WOOD);
  box(shell, f, -1.5, 1.5, 5.3, 6.65, BASE + 1.05, BASE + 1.14, GREEN);
  box(shell, f, -1.35, 1.35, 5.25, 5.45, BASE + 0.2, BASE + 1.05, RED);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:gn:shell";
  group.add(shellMesh);

  const tex = boardTexture();
  if (tex) {
    const boards = new Builder();
    addBoard(boards, f, 6.8, -1.3, 1.3, BASE + 1.15, BASE + 2.35);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:gn:board";
    group.add(mesh);
  }

  const spots: [number, number][] = [[-4.2, 3.1], [-2.6, 3.1], [2.4, 3.1], [4.0, 3.1], [-0.9, 3.2], [0.9, 3.2]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:gn:chairs";
  chairs.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.nx, f.nz) + (i % 2 ? Math.PI : 0));
    chairs.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  chairs.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
  group.add(chairs);
}
