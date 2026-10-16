// The Pastechi House, Caya G.F. Betico Croes 42, Oranjestad.
// Open shopfront under the existing green PASTECHI HOUSE sign. Interior is rebuilt
// from street photos and listings (counter, glass warmer, menu of the real fillings,
// small red monobloc chairs and tables). No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SphereGeometry, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { box, Builder, pt, type Frame } from "./geom";

export const PASTECHI_X = -7087.55;
export const PASTECHI_Z = 24.62;

// OSM footprint, world metres. Collision stays inside this quad.
export const PASTECHI_POLY: [number, number][] = [
  [-7092.6, 32.4],
  [-7084.3, 33.3],
  [-7082.5, 16.8],
  [-7090.8, 16.0],
];

// The hero mesh is the axis-aligned box around that footprint, not the quad
// itself. Street face is the south wall (local z = -8.625), sign centred at x = 0.94.
export const pastechiLocal: Vol = {
  mx: 0,
  mz: -8.625,
  ux: 1,
  uz: 0,
  nx: 0,
  nz: 1,
  halfW: 5.05,
  depth: 17.3,
  minX: -7,
  maxX: 7,
  minZ: -11,
  maxZ: 10,
  doorAt: 0.94,
};

const RED: [number, number, number] = [0.82, 0.1, 0.11];
const RED_D: [number, number, number] = [0.62, 0.06, 0.07];
const CREAM: [number, number, number] = [0.96, 0.93, 0.86];
const TILE_A: [number, number, number] = [0.94, 0.88, 0.76];
const TILE_B: [number, number, number] = [0.84, 0.74, 0.58];
const GREEN: [number, number, number] = [0.02, 0.4, 0.2];
const WOOD: [number, number, number] = [0.48, 0.28, 0.14];
const TOP: [number, number, number] = [0.95, 0.93, 0.88];
const STEEL: [number, number, number] = [0.68, 0.7, 0.72];
const GOLD: [number, number, number] = [0.86, 0.58, 0.16];

/** Solids the walker cannot pass. along / inward metres in the shop frame.
 *  The aisle through the open front (along ≈ 0.94) stays clear. */
export const PASTECHI_OBS: Box[] = [
  { a0: -4.35, a1: -0.2, d0: 2.75, d1: 4.2 },
  { a0: -2.25, a1: -0.55, d0: 2.15, d1: 2.9 },
  { a0: 1.9, a1: 2.85, d0: 1.2, d1: 2.2 },
  { a0: -3.2, a1: -2.2, d0: 5.3, d1: 6.3 },
  { a0: 2.0, a1: 3.0, d0: 5.9, d1: 6.9 },
  { a0: -3.0, a1: -2.0, d0: 9.3, d1: 10.3 },
  { a0: 1.5, a1: 2.5, d0: 10.1, d1: 11.1 },
  { a0: -0.95, a1: 0.15, d0: 12.3, d1: 13.3 },
  { a0: -4.3, a1: -0.45, d0: 14.2, d1: 16.05 },
];

const ident: Frame = { mx: 0, mz: 0, ux: 1, uz: 0, nx: 0, nz: 1 };

function chairGeo() {
  const b = new Builder();
  box(b, ident, -0.19, 0.19, -0.17, 0.17, 0.42, 0.47, RED);
  box(b, ident, -0.19, 0.19, -0.2, -0.145, 0.47, 0.9, RED_D);
  for (const [x, z] of [[-0.15, -0.13], [0.15, -0.13], [-0.15, 0.13], [0.15, 0.13]] as const) {
    box(b, ident, x - 0.018, x + 0.018, z - 0.018, z + 0.018, 0.02, 0.42, RED_D);
  }
  return b.geometry();
}

function tableGeo() {
  const b = new Builder();
  box(b, ident, -0.3, 0.3, -0.3, 0.3, 0.7, 0.75, RED);
  box(b, ident, -0.05, 0.05, -0.05, 0.05, 0.04, 0.7, [0.9, 0.9, 0.88]);
  return b.geometry();
}

function menuTexture() {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#f6f1e4";
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = "#06733a";
  g.fillRect(0, 0, 512, 86);
  g.fillStyle = "#ffffff";
  g.font = "700 40px Arial, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("PASTECHI HOUSE", 256, 46);
  const rows: [string, string][] = [
    ["Cheese", "2.50"],
    ["Ham & Cheese", "3.00"],
    ["Beef", "3.00"],
    ["Chicken", "3.00"],
    ["Tuna", "3.00"],
    ["Keri Keri", "3.50"],
    ["Lobster", "5.00"],
    ["Croquette", "2.00"],
    ["Bitterbal", "2.00"],
    ["Dedito", "2.50"],
    ["Smoothie", "4.00"],
    ["Iced Coffee", "3.50"],
  ];
  rows.forEach((r, i) => {
    const y = 118 + i * 28;
    g.fillStyle = i % 2 ? "#efe6d4" : "#f6f1e4";
    g.fillRect(18, y - 18, 476, 28);
    g.fillStyle = "#2a2118";
    g.font = "600 22px Arial, sans-serif";
    g.textAlign = "left";
    g.fillText(r[0], 32, y);
    g.textAlign = "right";
    g.fillText(r[1], 484, y);
  });
  g.fillStyle = "#06733a";
  g.font = "700 18px Arial, sans-serif";
  g.textAlign = "center";
  g.fillText("spicy garlic sauce  ·  take away or sit in", 256, 484);
  // half-moon pastry, drawn, not a photo
  g.fillStyle = "#e0a030";
  g.beginPath();
  g.arc(256, 452, 16, Math.PI, 0);
  g.quadraticCurveTo(256, 468, 240, 452);
  g.fill();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function addMenu(b: Builder, f: Frame, a: number, d: number, y0: number, y1: number, halfW: number) {
  const p0 = pt(f, a - halfW, d, y0);
  const p1 = pt(f, a + halfW, d, y0);
  const p2 = pt(f, a + halfW, d, y1);
  const p3 = pt(f, a - halfW, d, y1);
  // faces the street (normal -inward) so guests and the open front both read it
  b.quad([p0, p1, p2, p3], [-f.nx, 0, -f.nz], [1, 1, 1], [[0, 0], [1, 0], [1, 1], [0, 1]]);
}

const up = new Vector3(0, 1, 0);
const quat = new Quaternion();
const pos = new Vector3();
const scl = new Vector3(1, 1, 1);
const m4 = new Matrix4();

function sit(mesh: InstancedMesh, i: number, f: Frame, a: number, d: number, yawToward: [number, number]) {
  const p = pt(f, a, d, 0);
  pos.set(p[0], 0, p[2]);
  quat.setFromAxisAngle(up, Math.atan2(yawToward[0], yawToward[1]));
  mesh.setMatrixAt(i, m4.compose(pos, quat, scl));
}

export function buildPastechi(group: Group, f: Frame) {
  const shell = new Builder();
  const hw = pastechiLocal.halfW;
  const depth = pastechiLocal.depth;
  const wall = 0.34;

  // tile floor
  const step = 0.9;
  for (let a = -hw + wall; a < hw - wall - 0.05; a += step) {
    for (let d = 0.2; d < depth - wall - 0.05; d += step) {
      const a1 = Math.min(a + step - 0.03, hw - wall);
      const d1 = Math.min(d + step - 0.03, depth - wall);
      const alt = ((Math.round(a / step) + Math.round(d / step)) & 1) === 0;
      shell.quad(
        [pt(f, a, d, 0.04), pt(f, a1, d, 0.04), pt(f, a1, d1, 0.04), pt(f, a, d1, 0.04)],
        [0, 1, 0], alt ? TILE_A : TILE_B,
      );
    }
  }
  // threshold just outside the open front
  shell.quad(
    [pt(f, -1.6, -0.55, 0.03), pt(f, 3.5, -0.55, 0.03), pt(f, 3.5, 0.18, 0.03), pt(f, -1.6, 0.18, 0.03)],
    [0, 1, 0], TILE_B,
  );

  // ceiling and two warm light panels (unlit material, so these read as the shop lights)
  shell.quad(
    [pt(f, -hw + 0.2, 0.3, 3.5), pt(f, hw - 0.2, 0.3, 3.5), pt(f, hw - 0.2, depth - 0.3, 3.5), pt(f, -hw + 0.2, depth - 0.3, 3.5)],
    [0, -1, 0], [0.93, 0.92, 0.88],
  );
  for (const d of [2.2, 8.2]) {
    shell.quad(
      [pt(f, -1.1, d, 3.48), pt(f, 1.1, d, 3.48), pt(f, 1.1, d + 0.55, 3.48), pt(f, -1.1, d + 0.55, 3.48)],
      [0, -1, 0], [1, 0.95, 0.78],
    );
  }

  // interior liners. Front is open under the sign: two piers and a header.
  const liner = 0.08;
  const doorL = -1.68, doorR = 3.56;
  box(shell, f, -hw + 0.06, -hw + 0.06 + liner, 0.15, depth - 0.12, 0.05, 3.42, CREAM);
  box(shell, f, hw - 0.06 - liner, hw - 0.06, 0.15, depth - 0.12, 0.05, 3.42, CREAM);
  box(shell, f, -hw + 0.12, hw - 0.12, depth - 0.16, depth - 0.16 + liner, 0.05, 3.42, CREAM);
  box(shell, f, -hw + 0.1, doorL, 0.02, 0.02 + liner, 0.02, 3.42, CREAM);
  box(shell, f, doorR, hw - 0.1, 0.02, 0.02 + liner, 0.02, 3.42, CREAM);
  box(shell, f, doorL, doorR, 0.02, 0.02 + liner, 2.42, 3.42, CREAM);
  box(shell, f, -hw + 0.15, hw - 0.15, 0.12, 0.15, 3.05, 3.38, GREEN);
  box(shell, f, doorL, doorR, 0.04, 0.1, 2.4, 2.56, GREEN);
  box(shell, f, -hw + 0.12, doorL, 0.02, 0.1, 0.02, 0.16, RED);
  box(shell, f, doorR, hw - 0.12, 0.02, 0.1, 0.02, 0.16, RED);

  // jambs a few centimetres proud of the red wall, under the existing sign
  box(shell, f, doorL - 0.1, doorL + 0.1, -0.14, 0.16, 0, 2.52, CREAM);
  box(shell, f, doorR - 0.1, doorR + 0.1, -0.14, 0.16, 0, 2.52, CREAM);
  box(shell, f, doorL - 0.1, doorR + 0.1, -0.14, 0.16, 2.36, 2.56, CREAM);

  // counter on the west side of the opening; the centre aisle stays walkable
  box(shell, f, -4.2, -0.3, 2.9, 4.05, 0.04, 1.0, WOOD);
  box(shell, f, -4.25, -0.25, 2.85, 4.1, 1.0, 1.06, TOP);
  box(shell, f, -4.15, -0.35, 2.85, 2.96, 0.48, 0.98, GREEN);
  box(shell, f, -2.15, -0.65, 2.25, 2.85, 1.06, 1.14, STEEL);
  box(shell, f, -2.05, -0.75, 2.32, 2.78, 1.14, 1.18, GOLD);

  // back kitchen counter
  box(shell, f, -4.15, -0.55, 14.4, 15.9, 0.04, 0.92, STEEL);
  box(shell, f, -3.2, -1.4, 14.6, 15.5, 0.92, 0.98, [0.2, 0.18, 0.16]);
  box(shell, f, -3.0, -1.6, 14.75, 15.3, 0.98, 1.06, [1, 0.42, 0.08]);

  // ceiling fan (static blades; the hub reads as the fans guests mention)
  box(shell, f, -0.08, 0.08, 7.9, 8.06, 3.15, 3.42, STEEL);
  box(shell, f, -0.85, 0.85, 7.94, 8.02, 3.28, 3.34, CREAM);
  box(shell, f, -0.04, 0.04, 7.15, 8.8, 3.28, 3.34, CREAM);

  const shellGeo = shell.geometry();
  const shellMat = new MeshBasicMaterial({ vertexColors: true, side: DoubleSide });
  shellMat.polygonOffset = true;
  shellMat.polygonOffsetFactor = -2;
  shellMat.polygonOffsetUnits = -2;
  const shellMesh = new Mesh(shellGeo, shellMat);
  shellMesh.name = "aw:pastechi:shell";
  shellMesh.castShadow = false;
  shellMesh.receiveShadow = false;
  group.add(shellMesh);

  const tex = menuTexture();
  if (tex) {
    const boards = new Builder();
    addMenu(boards, f, -2.15, 4.12, 1.42, 2.68, 1.15);
    addMenu(boards, f, 0.4, depth - 0.2, 1.35, 2.6, 1.05);
    const menu = new Mesh(boards.geometry(), new MeshBasicMaterial({ map: tex, side: DoubleSide }));
    menu.name = "aw:pastechi:menu";
    menu.castShadow = false;
    menu.receiveShadow = false;
    group.add(menu);
  }

  // glass warmer, open on the street side so the pastries read
  const glass = new Builder();
  const gcol: [number, number, number] = [0.75, 0.9, 0.95];
  const y0 = 1.18, y1 = 1.48, a0 = -2.1, a1 = -0.7, d0 = 2.28, d1 = 2.82;
  glass.quad([pt(f, a0, d0, y1), pt(f, a1, d0, y1), pt(f, a1, d1, y1), pt(f, a0, d1, y1)], [0, 1, 0], gcol);
  glass.quad([pt(f, a0, d1, y0), pt(f, a0, d1, y1), pt(f, a0, d0, y1), pt(f, a0, d0, y0)], [-f.ux, 0, -f.uz], gcol);
  glass.quad([pt(f, a1, d0, y0), pt(f, a1, d0, y1), pt(f, a1, d1, y1), pt(f, a1, d1, y0)], [f.ux, 0, f.uz], gcol);
  glass.quad([pt(f, a0, d1, y0), pt(f, a1, d1, y0), pt(f, a1, d1, y1), pt(f, a0, d1, y1)], [f.nx, 0, f.nz], gcol);
  const gmat = new MeshBasicMaterial({ color: 0xb7e4f2, transparent: true, opacity: 0.28, depthWrite: false, side: DoubleSide });
  const gmesh = new Mesh(glass.geometry(), gmat);
  gmesh.name = "aw:pastechi:glass";
  gmesh.renderOrder = 2;
  gmesh.castShadow = false;
  gmesh.receiveShadow = false;
  group.add(gmesh);

  const chairs = new InstancedMesh(chairGeo(), new MeshBasicMaterial({ vertexColors: true }), 12);
  chairs.name = "aw:pastechi:chairs";
  chairs.castShadow = false;
  chairs.receiveShadow = false;
  chairs.frustumCulled = false;
  const tables = new InstancedMesh(tableGeo(), new MeshBasicMaterial({ vertexColors: true }), 6);
  tables.name = "aw:pastechi:tables";
  tables.castShadow = false;
  tables.receiveShadow = false;
  tables.frustumCulled = false;

  const spots: [number, number][] = [
    [2.35, 1.7],
    [-2.7, 5.8],
    [2.5, 6.4],
    [-2.5, 9.8],
    [2.0, 10.6],
    [-0.4, 12.8],
  ];
  spots.forEach(([a, d], i) => {
    sit(tables, i, f, a, d, [0, 1]);
    // two chairs, facing each other across the table, along the shop's inward axis
    const faceIn: [number, number] = [f.nx, f.nz];
    const faceOut: [number, number] = [-f.nx, -f.nz];
    sit(chairs, i * 2, f, a, d - 0.58, faceIn);
    sit(chairs, i * 2 + 1, f, a, d + 0.58, faceOut);
  });
  chairs.count = spots.length * 2;
  tables.count = spots.length;
  chairs.instanceMatrix.needsUpdate = true;
  tables.instanceMatrix.needsUpdate = true;
  chairs.boundingSphere = new Sphere(new Vector3(0, 1, 0), 22);
  tables.boundingSphere = new Sphere(new Vector3(0, 1, 0), 22);
  group.add(chairs, tables);

  const pastry = new InstancedMesh(
    new SphereGeometry(0.09, 6, 4),
    new MeshBasicMaterial({ color: 0xe0a030 }),
    8,
  );
  pastry.name = "aw:pastechi:pastry";
  pastry.castShadow = false;
  pastry.receiveShadow = false;
  pastry.frustumCulled = false;
  const pscl = new Vector3(1.35, 0.45, 0.95);
  let pi = 0;
  for (const a of [-1.85, -1.55, -1.25, -0.95]) {
    for (const d of [2.42, 2.64]) {
      const p = pt(f, a, d, 1.28);
      pos.set(p[0], p[1], p[2]);
      quat.setFromAxisAngle(up, a * 0.4);
      pastry.setMatrixAt(pi++, m4.compose(pos, quat, pscl));
    }
  }
  pastry.count = pi;
  pastry.instanceMatrix.needsUpdate = true;
  pastry.boundingSphere = new Sphere(new Vector3(0, 1, 0), 22);
  group.add(pastry);
}
