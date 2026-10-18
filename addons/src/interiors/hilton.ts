// Hilton Aruba Caribbean Resort & Casino. The tower and the high sign stay.
// The door is the ground floor under that sign, on the face toward the drive:
// a white lobby, a navy desk, and a short board.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const HT_X = -8295.39;
export const HT_Z = -5327.6;

export const HT_POLY: [number, number][] = [
  [-8333, -5404.5], [-8327.4, -5389.2], [-8323.1, -5390.9], [-8316, -5372.2],
  [-8324.5, -5369.4], [-8321, -5360.3], [-8324.5, -5358.8], [-8329.4, -5354.3],
  [-8330.8, -5351.3], [-8332.4, -5344.6], [-8331.5, -5338.6], [-8324.8, -5318],
  [-8326.7, -5316.1], [-8328.3, -5312.6], [-8329.1, -5308.6], [-8329, -5305],
  [-8321.7, -5285.8], [-8319.3, -5282.2], [-8313.9, -5279.4], [-8319.1, -5266.5],
  [-8315.4, -5264.4], [-8323.5, -5248.6], [-8314.9, -5244], [-8307.9, -5260.4],
  [-8305.4, -5259.6], [-8300.7, -5270.3], [-8303.1, -5271.7], [-8297.3, -5284],
  [-8298.4, -5287.7], [-8282.3, -5293.9], [-8272.1, -5270.5], [-8246.6, -5280.9],
  [-8250.7, -5288.9], [-8246.3, -5290.9], [-8251.7, -5303.4], [-8255.4, -5302.1],
  [-8270.8, -5335.7], [-8273.5, -5330.5], [-8277.7, -5332.9], [-8273.6, -5340.9],
  [-8269.2, -5339.2], [-8265.7, -5347.7], [-8281, -5353.2], [-8275.3, -5367.4],
  [-8270, -5354.3], [-8262.4, -5357], [-8272.9, -5386.7], [-8266.7, -5389.7],
  [-8270.3, -5398.5], [-8280.4, -5394.3], [-8285.8, -5405.6], [-8287.9, -5404.9],
  [-8295.5, -5388.1],
];

// Sign wall, local to the hero centroid. The two far corners sit inward so
// the frame faces the drive.
const INX = -0.918;
const INZ = 0.3966;
const CORNERS: [number, number][] = [
  [49.08, 36.7],
  [43.68, 24.2],
  [43.68 + INX * 14, 24.2 + INZ * 14],
  [49.08 + INX * 14, 36.7 + INZ * 14],
];
export const htLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const HT_DOOR_HALF = 2.8;
export const HT_DOOR_TOP = 4.15;
htLocal.doorAt = 0;
htLocal.depth = 10.2;
htLocal.halfW = 5.5;

const WHITE: [number, number, number] = [0.96, 0.95, 0.92];
const CREAM: [number, number, number] = [0.93, 0.9, 0.83];
const CREAM_D: [number, number, number] = [0.84, 0.8, 0.72];
const NAVY: [number, number, number] = [0.07, 0.16, 0.36];
const TEAL: [number, number, number] = [0.12, 0.45, 0.52];
const GOLD: [number, number, number] = [0.72, 0.58, 0.28];
const GREEN: [number, number, number] = [0.16, 0.4, 0.26];

const BASE = 0.08;

export const HT_OBS: Box[] = [
  { a0: -2.85, a1: 2.85, d0: 7.1, d1: 9.05 },
  { a0: -4.85, a1: -3.35, d0: 3.55, d1: 5.05 },
  { a0: 3.25, a1: 4.75, d0: 3.55, d1: 5.05 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.28, 0.28, -0.28, 0.28, 0.38, 0.46, TEAL);
  box(b, ident, -0.28, 0.28, -0.28, -0.16, 0.46, 0.86, WHITE);
  return b.geometry();
}

function boardTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f4f1ea";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#12295c";
  g.fillRect(0, 0, 512, 176);
  g.fillStyle = "#f7f4ee";
  g.font = "700 64px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("HILTON", 256, 58);
  g.font = "600 28px Arial, sans-serif";
  g.fillText("ARUBA CARIBBEAN", 256, 124);
  g.fillStyle = "#1a2744";
  g.font = "600 30px Arial, sans-serif";
  ["Reception", "Casino", "Pool  ·  Beach"].forEach((line, i) => g.fillText(line, 256, 248 + i * 64));
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

export function buildHilton(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = htLocal.halfW;
  const depth = htLocal.depth;
  const doorL = -HT_DOOR_HALF;
  const doorR = HT_DOOR_HALF;
  const liner = 0.12;

  shell.quad(
    [pt(f, -hw + 0.25, 0.12, BASE), pt(f, hw - 0.25, 0.12, BASE), pt(f, hw - 0.25, depth - 0.2, BASE), pt(f, -hw + 0.25, depth - 0.2, BASE)],
    [0, 1, 0], CREAM_D,
  );
  const step = 1.65;
  for (let a = -hw + 0.3; a < hw - 0.35; a += step) {
    for (let d = 0.16; d < depth - 0.28; d += step) {
      const a1 = Math.min(a + step - 0.06, hw - 0.28);
      const d1 = Math.min(d + step - 0.06, depth - 0.22);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.03), pt(f, a1, d, BASE + 0.03), pt(f, a1, d1, BASE + 0.03), pt(f, a, d1, BASE + 0.03)],
        [0, 1, 0], alt ? CREAM : CREAM_D,
      );
    }
  }
  // Navy runner from the door to the desk.
  shell.quad(
    [pt(f, -0.7, 0.3, BASE + 0.045), pt(f, 0.7, 0.3, BASE + 0.045), pt(f, 0.7, 6.7, BASE + 0.045), pt(f, -0.7, 6.7, BASE + 0.045)],
    [0, 1, 0], NAVY,
  );
  shell.quad(
    [pt(f, -hw + 0.3, 0.25, 3.95), pt(f, hw - 0.3, 0.25, 3.95), pt(f, hw - 0.3, depth - 0.25, 3.95), pt(f, -hw + 0.3, depth - 0.25, 3.95)],
    [0, -1, 0], WHITE,
  );

  box(shell, f, -hw + 0.15, -hw + 0.15 + liner, 0.2, depth - 0.15, BASE, 3.9, WHITE);
  box(shell, f, hw - 0.15 - liner, hw - 0.15, 0.2, depth - 0.15, BASE, 3.9, WHITE);
  box(shell, f, -hw + 0.2, hw - 0.2, depth - 0.22, depth - 0.1, BASE, 3.9, WHITE);
  box(shell, f, -hw + 0.2, doorL, 0.1, 0.1 + liner, BASE, HT_DOOR_TOP, WHITE);
  box(shell, f, doorR, hw - 0.2, 0.1, 0.1 + liner, BASE, HT_DOOR_TOP, WHITE);
  box(shell, f, doorL, doorR, 0.12, 0.12 + liner, 3.72, HT_DOOR_TOP + 0.02, NAVY);

  box(shell, f, -2.7, 2.7, 7.2, 8.95, BASE, BASE + 1.05, WHITE);
  box(shell, f, -2.8, 2.8, 7.15, 9.0, BASE + 1.05, BASE + 1.14, NAVY);
  box(shell, f, -2.65, 2.65, 7.15, 7.28, BASE + 0.15, BASE + 1.05, GOLD);
  box(shell, f, -4.9, -4.05, 3.5, 4.3, BASE, BASE + 0.85, GREEN);
  box(shell, f, 3.95, 4.8, 3.5, 4.3, BASE, BASE + 0.85, GREEN);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:ht:shell";
  group.add(shellMesh);

  const tex = boardTexture();
  if (tex) {
    const boards = new Builder();
    addBoard(boards, f, 9.55, -2.2, 2.2, BASE + 1.25, BASE + 2.75);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:ht:board";
    group.add(mesh);
  }

  const spots: [number, number][] = [[-4.1, 4.25], [4.0, 4.25]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:ht:chairs";
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
