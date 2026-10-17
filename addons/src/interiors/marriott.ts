// Aruba Marriott Resort and Stellaris Casino. The tower and both signs stay.
// The podium sits above the beach, so the lobby is the open front on the sand
// under that sign wall: a warm room, a wood desk, and a short board.
// No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const MR_X = -8000.03;
export const MR_Z = -6711.14;

export const MR_POLY: [number, number][] = [
  [-8059.3, -6773.7], [-8057.7, -6751.8], [-8055.9, -6750.9], [-8047.3, -6751.1],
  [-8045.1, -6753], [-8041.2, -6750.6], [-8039.6, -6753.5], [-8036.2, -6751.3],
  [-8034.9, -6753.5], [-8031.2, -6750.9], [-8029.4, -6753.7], [-8025.7, -6752.1],
  [-8024, -6754.3], [-8020.4, -6752.2], [-8018.9, -6755], [-8015.4, -6752.9],
  [-8013.6, -6755], [-8010.4, -6753.3], [-8008.2, -6755.5], [-8005.4, -6753.4],
  [-8003.1, -6756.2], [-7999.5, -6754.2], [-7998, -6756.1], [-7994.9, -6754.7],
  [-7993.6, -6755.7], [-7991.4, -6759.5], [-7984.5, -6756.9], [-7979.5, -6693.7],
  [-7985.4, -6689.9], [-7988.5, -6694.1], [-7992.1, -6691.4], [-7993.7, -6693.8],
  [-7997.4, -6691], [-7999, -6693.2], [-8003, -6690.6], [-8004.4, -6692.7],
  [-8008, -6690], [-8009.5, -6692.3], [-8013.2, -6689.5], [-8014.9, -6691.9],
  [-8018.4, -6689.3], [-8020.2, -6691.5], [-8023.8, -6688.7], [-8025.4, -6691.2],
  [-8028.9, -6688.4], [-8031.4, -6691.8], [-8034.8, -6689.2], [-8035.5, -6690],
  [-8039.4, -6687.5], [-8040.3, -6688.6], [-8043.7, -6688.5], [-8044.2, -6690.4],
  [-8050.6, -6689.9], [-8050.7, -6688.4], [-8052.5, -6687.7], [-8050.6, -6666.4],
  [-8048.1, -6664.3], [-8042.2, -6664.8], [-8041.2, -6666.4], [-8037.5, -6667],
  [-8034.7, -6665.4], [-8032.6, -6667.5], [-8029.3, -6665.9], [-8027.2, -6667.9],
  [-8024, -6666.2], [-8021.8, -6668.4], [-8018.7, -6666.7], [-8016.6, -6669],
  [-8013.8, -6667.2], [-8011.5, -6669.5], [-8008.2, -6667.4], [-8006.5, -6669.5],
  [-8003, -6667.6], [-8001.4, -6670], [-7997.8, -6668.4], [-7995.8, -6670.5],
  [-7992.3, -6668.6], [-7990.3, -6671.1], [-7986.9, -6669.5], [-7984.9, -6671.9],
  [-7981.7, -6669.7], [-7980, -6672.1], [-7977.7, -6671.6], [-7976.9, -6671.1],
  [-7976.9, -6669.9], [-7975.6, -6669.5], [-7974.7, -6660.1], [-7982, -6659.5],
  [-7980.8, -6644.5], [-7941.1, -6647.9], [-7941.1, -6641.9], [-7929.2, -6643.2],
  [-7929.9, -6655.3], [-7918.2, -6656.1], [-7918.4, -6659.6], [-7933.9, -6668.8],
  [-7934.8, -6676.4], [-7925.7, -6684.9], [-7926.3, -6689.1], [-7916.4, -6698.3],
  [-7918.3, -6717.1], [-7940.6, -6733.6], [-7938.2, -6748.8], [-7947.6, -6766.3],
  [-7960.3, -6759.7], [-7970.2, -6758.9], [-7987, -6779.9], [-8044.5, -6774.2]
];

// Sign wall, local to the hero centroid. The far corners sit inward (+Z).
const INX = 0.0337;
const INZ = 0.9994;
const CORNERS: [number, number][] = [
  [-44.46, -63.06],
  [-59.27, -62.56],
  [-59.27 + INX * 14, -62.56 + INZ * 14],
  [-44.46 + INX * 14, -63.06 + INZ * 14],
];
export const mrLocal: Vol = frameFromEdge(CORNERS, 0, 1);
export const MR_DOOR_HALF = 2.9;
export const MR_DOOR_TOP = 4.15;
mrLocal.doorAt = 0;
mrLocal.depth = 10.4;
mrLocal.halfW = 6.0;

const CREAM: [number, number, number] = [0.94, 0.9, 0.82];
const CREAM_D: [number, number, number] = [0.82, 0.74, 0.62];
const BURG: [number, number, number] = [0.48, 0.12, 0.16];
const WOOD: [number, number, number] = [0.42, 0.26, 0.14];
const WOOD_D: [number, number, number] = [0.28, 0.16, 0.08];
const GREEN: [number, number, number] = [0.16, 0.38, 0.22];
const WHITE: [number, number, number] = [0.96, 0.94, 0.9];

const BASE = 0.08;

export const MR_OBS: Box[] = [
  { a0: -3.2, a1: 3.2, d0: 7.15, d1: 9.15 },
  { a0: -5.15, a1: -3.55, d0: 3.6, d1: 5.15 },
  { a0: 3.45, a1: 5.05, d0: 3.6, d1: 5.15 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.28, 0.28, -0.28, 0.28, 0.38, 0.46, BURG);
  box(b, ident, -0.28, 0.28, -0.28, -0.16, 0.46, 0.86, CREAM);
  return b.geometry();
}

function boardTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f6f0e6";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#7a1e2e";
  g.fillRect(0, 0, 512, 176);
  g.fillStyle = "#fff8f2";
  g.font = "700 54px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("MARRIOTT", 256, 58);
  g.font = "600 30px Arial, sans-serif";
  g.fillText("STELLARIS CASINO", 256, 122);
  g.fillStyle = "#3a241c";
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

export function buildMarriott(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = mrLocal.halfW;
  const depth = mrLocal.depth;
  const doorL = -MR_DOOR_HALF;
  const doorR = MR_DOOR_HALF;
  const liner = 0.12;

  shell.quad(
    [pt(f, -hw + 0.25, 0.12, BASE), pt(f, hw - 0.25, 0.12, BASE), pt(f, hw - 0.25, depth - 0.2, BASE), pt(f, -hw + 0.25, depth - 0.2, BASE)],
    [0, 1, 0], CREAM_D,
  );
  const step = 1.7;
  for (let a = -hw + 0.32; a < hw - 0.36; a += step) {
    for (let d = 0.18; d < depth - 0.3; d += step) {
      const a1 = Math.min(a + step - 0.06, hw - 0.28);
      const d1 = Math.min(d + step - 0.06, depth - 0.22);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, BASE + 0.03), pt(f, a1, d, BASE + 0.03), pt(f, a1, d1, BASE + 0.03), pt(f, a, d1, BASE + 0.03)],
        [0, 1, 0], alt ? CREAM : CREAM_D,
      );
    }
  }
  shell.quad(
    [pt(f, -0.75, 0.3, BASE + 0.045), pt(f, 0.75, 0.3, BASE + 0.045), pt(f, 0.75, 6.8, BASE + 0.045), pt(f, -0.75, 6.8, BASE + 0.045)],
    [0, 1, 0], BURG,
  );
  shell.quad(
    [pt(f, -hw + 0.28, 0.22, 5.5), pt(f, hw - 0.28, 0.22, 5.5), pt(f, hw - 0.28, depth - 0.22, 5.5), pt(f, -hw + 0.28, depth - 0.22, 5.5)],
    [0, -1, 0], WHITE,
  );

  box(shell, f, -hw + 0.15, -hw + 0.15 + liner, 0.2, depth - 0.15, BASE, 5.45, CREAM);
  box(shell, f, hw - 0.15 - liner, hw - 0.15, 0.2, depth - 0.15, BASE, 5.45, CREAM);
  box(shell, f, -hw + 0.2, hw - 0.2, depth - 0.22, depth - 0.1, BASE, 5.45, CREAM);
  box(shell, f, -hw + 0.2, doorL, 0.1, 0.1 + liner, BASE, 5.45, CREAM);
  box(shell, f, doorR, hw - 0.2, 0.1, 0.1 + liner, BASE, 5.45, CREAM);
  box(shell, f, doorL, doorR, 0.12, 0.12 + liner, 3.85, 4.05, BURG);
  box(shell, f, doorL, doorR, 0.1, 0.1 + liner, 4.05, 5.45, CREAM);

  box(shell, f, -3.05, 3.05, 7.25, 9.0, BASE, BASE + 1.05, WOOD);
  box(shell, f, -3.15, 3.15, 7.2, 9.1, BASE + 1.05, BASE + 1.14, BURG);
  box(shell, f, -2.95, 2.95, 7.15, 7.32, BASE + 0.2, BASE + 1.05, WOOD_D);
  box(shell, f, -5.2, -4.3, 3.5, 4.35, BASE, BASE + 0.85, GREEN);
  box(shell, f, 4.2, 5.1, 3.5, 4.35, BASE, BASE + 0.85, GREEN);

  const shellMesh = new Mesh(shell.geometry(), new MeshBasicMaterial({ vertexColors: true, side: DoubleSide }));
  shellMesh.name = "aw:mr:shell";
  group.add(shellMesh);

  const tex = boardTexture();
  if (tex) {
    const boards = new Builder();
    addBoard(boards, f, 9.7, -2.5, 2.5, BASE + 1.25, BASE + 2.8);
    const mesh = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    mesh.name = "aw:mr:board";
    group.add(mesh);
  }

  const spots: [number, number][] = [[-4.35, 4.35], [4.25, 4.35]];
  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), spots.length);
  chairs.name = "aw:mr:chairs";
  chairs.frustumCulled = false;
  spots.forEach(([a, d], i) => {
    const p = pt(f, a, d, 0);
    pos.set(p[0], BASE, p[2]);
    quat.setFromAxisAngle(up, Math.atan2(f.nx, f.nz));
    chairs.setMatrixAt(i, m4.compose(pos, quat, scl));
  });
  chairs.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 18);
  group.add(chairs);
}
