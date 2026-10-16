// Casibari road walls, kunuku cactus fences, Hooiberg's north slope and summit masts.
// The Hooiberg stairs are a separate hero and are not rebuilt here.
// Positions follow the shipped roads and the summit hero. Photos set the shapes.
// Nothing here is a photo texture.
// Phone: one static mesh and three instanced meshes. ?nin=0 turns it off.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, DoubleSide, Group,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import type { AGame } from "./env";

type Pt = [number, number];
type Row = number[];
type NorthData = {
  anchors: Pt[];
  walls: Row[];
  fences: Row[];
  scrub: Row[];
  antennas: number[][];
  summit: Pt;
};
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
};

const SHOW = 1700;
const CELL = 8;
const V_MAX = 800;
const WALL_N = 140;
const FENCE_N = 240;
const SCRUB_N = 72;
const WALL_COL = [0xb4a89c, 0x978b80, 0xc8bdb2, 0x8f847a];
const FENCE_COL = [0x4e6846, 0x3d5638, 0x5a7450, 0x354832];
const SCRUB_COL = [0x4a5c32, 0x3a4c28, 0x5a6838];

function rgb(hex: number): [number, number, number] {
  return [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

function join(geos: BufferGeometry[]) {
  const parts = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let n = 0;
  for (const p of parts) n += p.getAttribute("position").count;
  const pos = new Float32Array(n * 3);
  let o = 0;
  for (const p of parts) {
    const a = p.getAttribute("position").array as Float32Array;
    pos.set(a, o);
    o += a.length;
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

export class NorthInland {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: NorthData | null = null;
  private mask = new Set<string>();
  private mat: MeshLambertMaterial;
  private built: Mesh;
  private pos: Float32Array;
  private nor: Float32Array;
  private col: Float32Array;
  private idx: Uint32Array;
  private v = 0;
  private i = 0;
  private upV = 0;
  private upI = 0;
  private walls: InstancedMesh;
  private fences: InstancedMesh;
  private scrub: InstancedMesh;
  private wallOn: Uint8Array;
  private fenceOn: Uint8Array;
  private scrubOn: Uint8Array;
  private wallN = 0;
  private fenceN = 0;
  private scrubN = 0;
  private mast = false;
  private m = new Matrix4();
  private q = new Quaternion();
  private vec = new Vector3();
  private up = new Vector3(0, 1, 0);
  private scale = new Vector3();
  private tint = new Color();

  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    this.group.name = "aw:nin";
    g.scene.add(this.group);
    this.mat = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true, side: DoubleSide });
    this.mat.polygonOffset = true;
    this.mat.polygonOffsetFactor = -2;
    this.mat.polygonOffsetUnits = -4;
    this.built = this.sheet();
    this.built.visible = false;
    this.pos = this.built.geometry.getAttribute("position").array as Float32Array;
    this.nor = this.built.geometry.getAttribute("normal").array as Float32Array;
    this.col = this.built.geometry.getAttribute("color").array as Float32Array;
    this.idx = this.built.geometry.getIndex()!.array as Uint32Array;
    this.walls = this.blank(this.wallGeo(), WALL_N, "walls");
    this.fences = this.blank(this.fenceGeo(), FENCE_N, "fences");
    this.scrub = this.blank(this.scrubGeo(), SCRUB_N, "scrub");
    this.wallOn = new Uint8Array(WALL_N);
    this.fenceOn = new Uint8Array(FENCE_N);
    this.scrubOn = new Uint8Array(SCRUB_N);
    this.paint(this.walls, WALL_N, WALL_COL[0]);
    this.paint(this.fences, FENCE_N, FENCE_COL[0]);
    this.paint(this.scrub, SCRUB_N, SCRUB_COL[0]);
    this.bury(this.walls, WALL_N);
    this.bury(this.fences, FENCE_N);
    this.bury(this.scrub, SCRUB_N);
    this.installVeg();
    void this.load();
  }

  stats() {
    const d = this.data;
    return {
      walls: this.wallN, fences: this.fenceN, scrub: this.scrubN, mast: this.mast,
      pending: !d ? 1 : (d.walls.length - this.wallN) + (d.fences.length - this.fenceN) + (d.scrub.length - this.scrubN),
    };
  }

  frame() {
    const d = this.data;
    if (!d) return;
    const cam = (this.g.camera as unknown as { position: { x: number; z: number } }).position;
    let near = false;
    for (const a of d.anchors) if (Math.hypot(cam.x - a[0], cam.z - a[1]) < SHOW) { near = true; break; }
    this.group.visible = near;
    if (!near) return;
    if (!this.mast && this.hasH(d.summit[0], d.summit[1])) {
      if (d.antennas.length) {
        this.masts(d);
        this.upload();
        this.built.visible = true;
      }
      this.mast = true;
    }
    this.wallN = this.place(this.walls, d.walls, this.wallOn, this.wallN, WALL_COL, (r, y) => [r[0], y, r[1], r[2] ?? 0, 1, r[3] ?? 1, 1]);
    this.fenceN = this.place(this.fences, d.fences, this.fenceOn, this.fenceN, FENCE_COL, (r, y) => {
      const s = r[3] ?? 1;
      return [r[0], y, r[1], r[2] ?? 0, s, s, s];
    });
    this.scrubN = this.place(this.scrub, d.scrub, this.scrubOn, this.scrubN, SCRUB_COL, (r, y) => {
      const s = r[3] ?? 1;
      return [r[0], y - 0.15, r[1], r[2] ?? 0, s * 1.6, s, s * 1.4];
    });
  }

  private async load() {
    try {
      const res = await fetch("./data/real/north_inland.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as NorthData;
    } catch {
      return;
    }
    this.fillMask();
  }

  private masts(d: NorthData) {
    for (const [x, z, h] of d.antennas) {
      const y = this.hAt(x, z);
      if (!Number.isFinite(y)) continue;
      this.box(x, y + h / 2, z, 0.42, h, 0.42, 0, 0xc5c9ce);
      this.box(x, y + h - 1.2, z, 3.2, 0.18, 0.18, 0, 0xd0d4d8);
      this.box(x, y + h - 0.4, z, 0.9, 0.7, 0.7, 0, 0x3c4148);
      this.box(x + 1.3, y + h * 0.62, z, 0.9, 0.7, 0.12, 0, 0xb7bcc2);
    }
  }

  private place(mesh: InstancedMesh, rows: Row[], on: Uint8Array, placed: number, colors: number[], put: (row: Row, y: number) => number[]) {
    let n = 0;
    let moved = false;
    let hi = mesh.count;
    for (let i = 0; i < rows.length && i < on.length; i++) {
      if (on[i]) continue;
      const r = rows[i];
      if (!this.hasH(r[0], r[1])) continue;
      const y = this.hAt(r[0], r[1]);
      if (!Number.isFinite(y)) continue;
      const p = put(r, y);
      this.setInst(mesh, i, p[0], p[1], p[2], p[3], p[4], p[5], p[6]);
      this.tint.setHex(colors[i % colors.length]);
      mesh.setColorAt(i, this.tint);
      on[i] = 1;
      placed++;
      moved = true;
      if (i + 1 > hi) hi = i + 1;
      if (++n >= 24) break;
    }
    if (moved) {
      mesh.count = hi;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    return placed;
  }

  private fillMask() {
    const d = this.data!;
    const blob = (cx: number, cz: number, r: number) => {
      for (let x = cx - r; x <= cx + r; x += CELL) {
        for (let z = cz - r; z <= cz + r; z += CELL) this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
      }
    };
    for (const row of [...d.walls, ...d.fences]) blob(row[0], row[1], 3);
  }

  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    const mask = this.mask;
    w.__awVegHit = (x, z, n) => {
      if (mask.has((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)))) return true;
      return prev ? prev(x, z, n) : false;
    };
  }

  private hasH(x: number, z: number) {
    const M = this.world.M;
    const key = Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
    const r = this.world.regions.get(key);
    return !!(r && r.H);
  }

  private sheet() {
    const pos = new Float32Array(V_MAX * 3);
    const nor = new Float32Array(V_MAX * 3);
    const col = new Float32Array(V_MAX * 3);
    const idx = new Uint32Array(V_MAX * 2);
    for (let k = 0; k < V_MAX; k++) { pos[k * 3 + 1] = -40; nor[k * 3 + 1] = 1; col[k * 3] = col[k * 3 + 1] = col[k * 3 + 2] = 1; }
    idx[0] = 0; idx[1] = 1; idx[2] = 2;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("normal", new BufferAttribute(nor, 3));
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mesh = new Mesh(geo, this.mat);
    mesh.name = "aw:nin:built";
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }

  private upload() {
    const g = this.built.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const col = g.getAttribute("color") as BufferAttribute;
    const index = g.getIndex()!;
    pos.clearUpdateRanges(); nor.clearUpdateRanges(); col.clearUpdateRanges(); index.clearUpdateRanges();
    pos.addUpdateRange(this.upV * 3, (this.v - this.upV) * 3);
    nor.addUpdateRange(this.upV * 3, (this.v - this.upV) * 3);
    col.addUpdateRange(this.upV * 3, (this.v - this.upV) * 3);
    index.addUpdateRange(this.upI, this.i - this.upI);
    pos.needsUpdate = true; nor.needsUpdate = true; col.needsUpdate = true; index.needsUpdate = true;
    g.setDrawRange(0, this.i);
    g.computeBoundingSphere();
    this.upV = this.v; this.upI = this.i;
  }

  private room(nVerts: number) {
    return this.v + nVerts < this.pos.length / 3 && this.i + nVerts * 3 < this.idx.length;
  }

  private vert(x: number, y: number, z: number, hex: number, nx: number, ny: number, nz: number) {
    const k = this.v++;
    const o = k * 3;
    this.pos[o] = x; this.pos[o + 1] = y; this.pos[o + 2] = z;
    this.nor[o] = nx; this.nor[o + 1] = ny; this.nor[o + 2] = nz;
    const [r, g, b] = rgb(hex);
    this.col[o] = r; this.col[o + 1] = g; this.col[o + 2] = b;
    return k;
  }

  private face(pts: number[][], hex: number) {
    if (!this.room(pts.length)) return;
    const ax = pts[1][0] - pts[0][0], ay = pts[1][1] - pts[0][1], az = pts[1][2] - pts[0][2];
    const bx = pts[2][0] - pts[0][0], by = pts[2][1] - pts[0][1], bz = pts[2][2] - pts[0][2];
    let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    const L = Math.hypot(nx, ny, nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const ids = pts.map((p) => this.vert(p[0], p[1], p[2], hex, nx, ny, nz));
    this.idx[this.i++] = ids[0]; this.idx[this.i++] = ids[1]; this.idx[this.i++] = ids[2];
    if (pts.length === 4) { this.idx[this.i++] = ids[0]; this.idx[this.i++] = ids[2]; this.idx[this.i++] = ids[3]; }
  }

  private box(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw: number, hex: number) {
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const p = (x: number, y: number, z: number): number[] => [cx + x * c - z * s, cy + y, cz + x * s + z * c];
    const corners = [
      p(-hx, -hy, -hz), p(hx, -hy, -hz), p(hx, hy, -hz), p(-hx, hy, -hz),
      p(-hx, -hy, hz), p(hx, -hy, hz), p(hx, hy, hz), p(-hx, hy, hz),
    ];
    const quads = [[0, 1, 2, 3], [5, 4, 7, 6], [3, 2, 6, 7], [4, 5, 1, 0], [4, 0, 3, 7], [1, 5, 6, 2]];
    for (const q of quads) this.face(q.map((k) => corners[k]), hex);
  }

  private blank(geo: BufferGeometry, n: number, name: string) {
    const mat = new MeshLambertMaterial({ color: 0xffffff });
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:nin:" + name;
    this.group.add(mesh);
    return mesh;
  }

  private paint(mesh: InstancedMesh, n: number, hex: number) {
    this.tint.setHex(hex);
    for (let i = 0; i < n; i++) mesh.setColorAt(i, this.tint);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  private bury(mesh: InstancedMesh, n: number) {
    for (let i = 0; i < n; i++) this.setInst(mesh, i, 0, -80, 0, 0, 1, 1, 1);
    mesh.instanceMatrix.needsUpdate = true;
  }

  private setInst(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number) {
    this.q.setFromAxisAngle(this.up, yaw);
    this.vec.set(x, y, z);
    this.scale.set(sx, sy, sz);
    this.m.compose(this.vec, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private wallGeo() {
    const stones = [
      [-1.15, 0.22, 0, 1.35, 0.44, 0.48],
      [0.15, 0.20, 0.02, 1.2, 0.40, 0.44],
      [1.25, 0.22, -0.02, 1.0, 0.44, 0.46],
      [-0.85, 0.62, 0.02, 1.4, 0.38, 0.42],
      [0.5, 0.64, -0.02, 1.15, 0.36, 0.40],
      [-0.35, 1.02, 0, 1.05, 0.34, 0.36],
      [0.72, 1.00, 0.02, 0.85, 0.32, 0.34],
    ];
    return join(stones.map(([x, y, z, sx, sy, sz]) => new BoxGeometry(sx, sy, sz).translate(x, y, z)));
  }

  private fenceGeo() {
    const cols = [-0.42, -0.12, 0.16, 0.44];
    const hs = [2.5, 3.8, 2.15, 3.25];
    return join(cols.map((x, i) => new BoxGeometry(0.36, hs[i], 0.36).translate(x, hs[i] / 2, (i % 2) * 0.08 - 0.04)));
  }

  private scrubGeo() {
    return join([
      new BoxGeometry(1.1, 0.7, 0.8).translate(0, 0.35, 0),
      new BoxGeometry(0.7, 0.9, 0.55).translate(0.45, 0.4, 0.2),
      new BoxGeometry(0.6, 0.55, 0.7).translate(-0.4, 0.28, -0.15),
    ]);
  }
}
