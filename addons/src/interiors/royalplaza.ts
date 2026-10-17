// Royal Plaza Mall, the Havenstraat front in Oranjestad.
// A bay under a yellow awning opens into a short hall: a gifts counter, a
// jewels counter, a cafe stand, and a Royal Plaza board. The pink facade,
// white arches, gold trim, dome, and the coloured awnings stay.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const RP_X = -7560.24;
export const RP_Z = -42.34;

export const RP_POLY: [number, number][] = [
  [-7616.2, -37.6], [-7599.9, -25.5], [-7577.2, -56.4], [-7568.2, -57.1],
  [-7542.7, -38.7], [-7542.6, -31.1], [-7563.1, -3], [-7545.9, 9.3],
  [-7534.4, -6.7], [-7512, -40.6], [-7511.3, -44.8], [-7511.8, -48.2],
  [-7513.9, -50.9], [-7519.4, -53.7], [-7567, -72.2], [-7573.8, -74.3],
  [-7584.6, -72], [-7591.5, -66.6], [-7601.6, -55.6],
];

// Havenstraat edge. Default normal points into the mall.
const CORNERS: [number, number][] = [
  [-13.56, -31.96],
  [46.34, -8.56],
  [46.34 + -0.3639 * 16, -8.56 + 0.9314 * 16],
  [-13.56 + -0.3639 * 16, -31.96 + 0.9314 * 16],
];
export const rpLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const RP_DOOR_HALF = 1.35;
export const RP_DOOR_TOP = 2.95;
// Centre of the yellow awning bay, just west of the wall midpoint.
rpLocal.doorAt = -1.65;
rpLocal.depth = 12.4;
rpLocal.halfW = 7.4;

const PINK: [number, number, number] = [0.9, 0.28, 0.5];
const CREAM: [number, number, number] = [0.96, 0.94, 0.9];
const TILE_A: [number, number, number] = [0.94, 0.9, 0.86];
const TILE_B: [number, number, number] = [0.84, 0.62, 0.7];
const GOLD: [number, number, number] = [0.78, 0.62, 0.26];
const RED: [number, number, number] = [0.78, 0.1, 0.16];
const BLUE: [number, number, number] = [0.12, 0.32, 0.72];
const YEL: [number, number, number] = [0.93, 0.74, 0.16];
const WOOD: [number, number, number] = [0.42, 0.28, 0.14];
const WARM: [number, number, number] = [1, 0.86, 0.55];

const BASE = 0.05;

/** along / inward solids. The aisle at the yellow bay stays clear. */
export const RP_OBS: Box[] = [
  { a0: -6.5, a1: -3.7, d0: 8.6, d1: 11.4 },
  { a0: 0.4, a1: 3.4, d0: 8.6, d1: 11.4 },
  { a0: -3.1, a1: -0.2, d0: 11.0, d1: 12.15 },
  { a0: -4.3, a1: -3.1, d0: 4.0, d1: 5.1 },
  { a0: 0.5, a1: 1.7, d0: 4.0, d1: 5.1 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function benchGeo() {
  const b = new Builder();
  box(b, ident, -0.65, 0.65, -0.2, 0.2, 0.42, 0.5, WOOD);
  box(b, ident, -0.65, 0.65, -0.22, -0.14, 0.5, 0.86, PINK);
  return b.geometry();
}

function signTexture(title: string, sub: string, items: string[], bg: string, head: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = bg;
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = head;
  g.fillRect(0, 0, 512, sub || items.length ? 168 : 512);
  g.fillStyle = "#fffdf8";
  g.font = "700 64px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(title, 256, sub ? 58 : 84);
  if (sub) {
    g.font = "700 42px Arial, sans-serif";
    g.fillText(sub, 256, 118);
  }
  g.fillStyle = "#fffdf8";
  g.font = "600 36px Arial, sans-serif";
  items.forEach((line, i) => g.fillText(line, 256, 230 + i * 64));
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/** Guest-facing board. The face toward the door reads left to right. */
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

export function buildRoyalplaza(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = rpLocal.halfW;
  const depth = rpLocal.depth;
  const doorAt = rpLocal.doorAt ?? 0;
  const doorL = doorAt - RP_DOOR_HALF;
  const doorR = doorAt + RP_DOOR_HALF;

  shell.quad(
    [pt(f, -hw + 0.25, 0.18, BASE), pt(f, hw - 0.25, 0.18, BASE), pt(f, hw - 0.25, depth - 0.2, BASE), pt(f, -hw + 0.25, depth - 0.2, BASE)],
    [0, 1, 0], [0.9, 0.82, 0.84],
  );
  const step = 1.65;
  for (let a = -hw + 0.35; a < hw - 0.4; a += step) {
    for (let d = 0.28; d < depth - 0.3; d += step) {
      const a1 = Math.min(a + step - 0.08, hw - 0.3);
      const d1 = Math.min(d + step - 0.08, depth - 0.24);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.02), pt(f, a1, d, BASE + 0.02), pt(f, a1, d1, BASE + 0.02), pt(f, a, d1, BASE + 0.02)],
        [0, 1, 0], alt ? TILE_A : TILE_B,
      );
    }
  }
  shell.quad(
    [pt(f, doorAt - 0.55, 0.35, BASE + 0.04), pt(f, doorAt + 0.55, 0.35, BASE + 0.04), pt(f, doorAt + 0.55, depth - 0.45, BASE + 0.04), pt(f, doorAt - 0.55, depth - 0.45, BASE + 0.04)],
    [0, 1, 0], PINK,
  );
  shell.quad(
    [pt(f, -hw + 0.3, 0.4, 2.82), pt(f, hw - 0.3, 0.4, 2.82), pt(f, hw - 0.3, depth - 0.22, 2.82), pt(f, -hw + 0.3, depth - 0.22, 2.82)],
    [0, -1, 0], CREAM,
  );
  box(shell, f, doorL, doorR, 0.18, 0.9, 2.7, 2.9, GOLD);

  box(shell, f, -hw + 0.12, -hw + 0.36, 0.3, depth - 0.22, BASE, 2.8, CREAM);
  box(shell, f, hw - 0.36, hw - 0.12, 0.3, depth - 0.22, BASE, 2.8, CREAM);
  box(shell, f, -hw + 0.28, hw - 0.28, depth - 0.36, depth - 0.16, BASE, 2.8, CREAM);
  box(shell, f, -hw + 0.2, doorL, 0.1, 0.32, BASE, RP_DOOR_TOP, PINK);
  box(shell, f, doorR, hw - 0.2, 0.1, 0.32, BASE, RP_DOOR_TOP, PINK);
  box(shell, f, -hw + 0.12, -hw + 0.4, 0.3, depth - 0.22, 2.15, 2.38, GOLD);
  box(shell, f, hw - 0.4, hw - 0.12, 0.3, depth - 0.22, 2.15, 2.38, GOLD);
  box(shell, f, -hw + 0.28, hw - 0.28, depth - 0.4, depth - 0.14, 2.15, 2.38, GOLD);

  // Gifts, image-right from the street (negative along). Stock sits on the counter.
  box(shell, f, -6.4, -3.8, 8.7, 11.3, BASE, BASE + 1.02, CREAM);
  box(shell, f, -6.45, -3.75, 8.55, 8.82, BASE + 1.02, BASE + 2.2, RED);
  box(shell, f, -6.25, -3.95, 8.52, 8.68, BASE + 1.02, BASE + 1.14, GOLD);
  box(shell, f, -5.9, -5.1, 9.15, 9.85, BASE + 1.05, BASE + 1.42, RED);
  box(shell, f, -4.7, -4.05, 9.2, 9.75, BASE + 1.05, BASE + 1.32, GOLD);
  // Jewels
  box(shell, f, 0.5, 3.3, 8.7, 11.3, BASE, BASE + 1.02, CREAM);
  box(shell, f, 0.45, 3.35, 8.55, 8.82, BASE + 1.02, BASE + 2.2, BLUE);
  box(shell, f, 0.65, 3.15, 8.52, 8.68, BASE + 1.02, BASE + 1.14, GOLD);
  box(shell, f, 1.0, 1.7, 9.15, 9.8, BASE + 1.05, BASE + 1.38, BLUE);
  box(shell, f, 2.05, 2.7, 9.2, 9.7, BASE + 1.05, BASE + 1.28, GOLD);
  // Cafe stand at the back, the colour of this bay's awning
  box(shell, f, -3.0, -0.3, 11.15, 12.05, BASE, BASE + 1.02, CREAM);
  box(shell, f, -3.1, -0.2, 11.0, 11.28, BASE + 1.02, BASE + 2.25, YEL);
  box(shell, f, -2.85, -0.45, 10.96, 11.12, BASE + 1.02, BASE + 1.14, GOLD);
  box(shell, f, -2.4, -1.7, 11.4, 11.85, BASE + 1.05, BASE + 1.36, YEL);

  for (const d of [3.1, 6.2, 9.0]) {
    box(shell, f, doorAt - 0.16, doorAt + 0.16, d - 0.16, d + 0.16, 2.48, 2.66, WARM);
  }

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:royal:shell";
  group.add(shellMesh);

  const boards: [string, string, string[], string, string, number, number, number, number, number][] = [
    ["GIFTS", "", ["Hats", "Postcards"], "#c4121a", "#c4121a", -6.2, -4.0, 8.48, BASE + 1.15, BASE + 2.05],
    ["JEWELS", "", ["Gold", "Watches"], "#163880", "#163880", 0.7, 3.1, 8.48, BASE + 1.15, BASE + 2.05],
    ["CAFE", "", ["Coffee", "Pastries"], "#e0b020", "#a87810", -2.85, -0.45, 10.92, BASE + 1.15, BASE + 2.1],
    ["ROYAL", "PLAZA", ["Gifts", "Jewels", "Cafe"], "#f4e4ea", "#c2185b", doorAt - 1.35, doorAt + 1.35, 2.15, 2.05, 2.75],
  ];
  boards.forEach((s, i) => {
    const tex = signTexture(s[0], s[1], s[2], s[3], s[4]);
    if (!tex) return;
    const b = new Builder();
    addBoard(b, f, s[7], s[5], s[6], s[8], s[9]);
    const mesh = new Mesh(b.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:royal:sign" + i;
    group.add(mesh);
  });

  const spots: [number, number][] = [[doorAt - 2.4, 4.5], [doorAt + 2.4, 4.5]];
  const benches = new InstancedMesh(benchGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  benches.name = "aw:royal:benches";
  benches.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.ux, f.uz));
    benches.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  benches.count = spots.length;
  benches.instanceMatrix.needsUpdate = true;
  benches.boundingSphere = new Sphere(new Vector3(0, 1, 0), 16);
  group.add(benches);
}
