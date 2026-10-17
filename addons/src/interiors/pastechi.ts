// The Pastechi House, Caya G.F. Betico Croes 42, Oranjestad.
// Open shopfront under the existing green PASTECHI HOUSE sign. Interior is rebuilt
// from street photos and listings (counter, glass warmer, menu of the real fillings,
// small red monobloc chairs and tables). No photographs are used as textures.
import {
  CanvasTexture, DoubleSide, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial,
  Quaternion, Sphere, SphereGeometry, SRGBColorSpace, Vector3,
} from "three";
import type { Box, Frame as Vol } from "./volume";
import { frameFromEdge } from "./volume";
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

// Hero wall corners (GLB, metres from the footprint centroid). The street face
// is the south edge; the sign sits in the middle of it.
const CORNERS: [number, number][] = [
  [-5.05, 7.775],
  [3.25, 8.675],
  [5.05, -7.826],
  [-3.25, -8.625],
];
export const pastechiLocal: Vol = frameFromEdge(CORNERS, 2, 3);
pastechiLocal.doorAt = 0;

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
  { a0: -3.6, a1: -0.35, d0: 2.6, d1: 4.05 },
  { a0: -2.4, a1: -0.6, d0: 2.05, d1: 2.75 },
  { a0: 1.85, a1: 2.85, d0: 1.15, d1: 2.15 },
  { a0: -2.9, a1: -1.9, d0: 4.9, d1: 5.9 },
  { a0: 1.3, a1: 2.3, d0: 5.7, d1: 6.7 },
  { a0: -2.7, a1: -1.7, d0: 8.7, d1: 9.7 },
  { a0: 1.05, a1: 2.05, d0: 9.5, d1: 10.5 },
  { a0: -2.2, a1: -1.2, d0: 11.9, d1: 12.9 },
  { a0: -3.5, a1: -0.45, d0: 14.3, d1: 15.9 },
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
  const quad = (depth: number, normal: [number, number, number], uv: [[number, number], [number, number], [number, number], [number, number]]) => {
    b.quad([
      pt(f, a - halfW, depth, y0), pt(f, a + halfW, depth, y0),
      pt(f, a + halfW, depth, y1), pt(f, a - halfW, depth, y1),
    ], normal, [1, 1, 1], uv);
  };
  // street side, then the room side a couple of centimetres further in
  quad(d, [-f.nx, 0, -f.nz], [[0, 0], [1, 0], [1, 1], [0, 1]]);
  quad(d + 0.02, [f.nx, 0, f.nz], [[1, 0], [0, 0], [0, 1], [1, 1]]);
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
    [pt(f, -2.25, -0.5, 0.03), pt(f, 2.25, -0.5, 0.03), pt(f, 2.25, 0.16, 0.03), pt(f, -2.25, 0.16, 0.03)],
    [0, 1, 0], TILE_B,
  );

  // ceiling and two warm light panels (unlit material, so these read as the shop lights)
  shell.quad(
    [pt(f, -hw + 0.28, 0.5, 3.42), pt(f, hw - 0.28, 0.5, 3.42), pt(f, hw - 0.28, depth - 0.35, 3.42), pt(f, -hw + 0.28, depth - 0.35, 3.42)],
    [0, -1, 0], [0.93, 0.92, 0.88],
  );
  for (const d of [2.2, 8.2]) {
    shell.quad(
      [pt(f, -1.1, d, 3.48), pt(f, 1.1, d, 3.48), pt(f, 1.1, d + 0.55, 3.48), pt(f, -1.1, d + 0.55, 3.48)],
      [0, -1, 0], [1, 0.95, 0.78],
    );
  }

  // Liners follow the slanted walls, inset so they sit inside the hero shell.
  // The sign is on the street face above y 2.7; the opening stops below it.
  const liner = 0.12;
  const doorL = -2.4, doorR = 2.4;
  box(shell, f, -hw + 0.18, -hw + 0.18 + liner, 0.4, depth - 0.25, 0.05, 3.52, CREAM);
  box(shell, f, hw - 0.18 - liner, hw - 0.18, 0.4, depth - 0.25, 0.05, 3.52, CREAM);
  box(shell, f, -hw + 0.25, hw - 0.25, depth - 0.3, depth - 0.3 + liner, 0.05, 3.52, CREAM);
  box(shell, f, -hw + 0.2, doorL, 0.2, 0.2 + liner, 0.02, 2.22, CREAM);
  box(shell, f, doorR, hw - 0.2, 0.2, 0.2 + liner, 0.02, 2.22, CREAM);
  box(shell, f, doorL, doorR, 0.2, 0.2 + liner, 2.08, 2.26, CREAM);
  box(shell, f, -hw + 0.22, doorL, 0.22, 0.32, 0.02, 0.14, RED);
  box(shell, f, doorR, hw - 0.22, 0.22, 0.32, 0.02, 0.14, RED);
  box(shell, f, doorL, doorR, 0.18, 0.3, 2.1, 2.24, GREEN);

  // counter on one side of the opening; the centre aisle stays walkable
  box(shell, f, -3.45, -0.45, 2.75, 3.9, 0.04, 1.0, WOOD);
  box(shell, f, -3.5, -0.4, 2.7, 3.95, 1.0, 1.06, TOP);
  box(shell, f, -3.4, -0.5, 2.7, 2.82, 0.48, 0.98, GREEN);
  box(shell, f, -2.25, -0.7, 2.15, 2.7, 1.06, 1.14, STEEL);
  box(shell, f, -2.15, -0.8, 2.22, 2.62, 1.14, 1.18, GOLD);

  // back kitchen counter
  box(shell, f, -3.4, -0.55, 14.4, 15.75, 0.04, 0.92, STEEL);
  box(shell, f, -2.6, -1.2, 14.55, 15.4, 0.92, 0.98, [0.2, 0.18, 0.16]);
  box(shell, f, -2.45, -1.35, 14.7, 15.2, 0.98, 1.06, [1, 0.42, 0.08]);

  // ceiling fan (static blades; the hub reads as the fans guests mention)
  box(shell, f, -0.08, 0.08, 7.9, 8.06, 3.15, 3.42, STEEL);
  box(shell, f, -0.85, 0.85, 7.94, 8.02, 3.28, 3.34, CREAM);
  box(shell, f, -0.04, 0.04, 7.15, 8.8, 3.28, 3.34, CREAM);

  const shellGeo = shell.geometry();
  const shellMat = new MeshBasicMaterial({ vertexColors: true, side: DoubleSide });
  const shellMesh = new Mesh(shellGeo, shellMat);
  shellMesh.name = "aw:pastechi:shell";
  shellMesh.castShadow = false;
  shellMesh.receiveShadow = false;
  group.add(shellMesh);

  const tex = menuTexture();
  if (tex) {
    const boards = new Builder();
    addMenu(boards, f, -1.9, 3.92, 1.4, 2.65, 1.05);
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
  const y0 = 1.18, y1 = 1.48, a0 = -2.2, a1 = -0.75, d0 = 2.18, d1 = 2.66;
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
    [2.35, 1.65],
    [-2.4, 5.4],
    [1.8, 6.2],
    [-2.2, 9.2],
    [1.55, 10.0],
    [-1.7, 12.4],
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
  for (const a of [-1.95, -1.6, -1.25, -0.9]) {
    for (const d of [2.3, 2.52]) {
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
