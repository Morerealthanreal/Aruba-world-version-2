// Ayo rock formation and its trail, the Balashi gold-mill ruins, and the
// dry-stone walls along the north-coast dirt roads.
// The Balashi brewery is a different site and is not touched.
// The Natural Pool is not in this set.
// Positions are OSM. Ground photos set the massing and colours.
// Nothing here is a photo texture.
// Phone: one static mesh and three instanced prop meshes. ?inland=0 turns it off.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, DoubleSide, Group,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, SphereGeometry, Vector3,
} from "three";
import type { AGame } from "./env";

type Pt = [number, number];
type V3 = [number, number, number];
type InlandData = {
  anchors: Pt[];
  ayo: Pt[];
  trail: Pt[];
  rocks: number[][];
  cacti: number[][];
  mill: Pt;
  walls: number[][];
  dirt: Pt[][];
};
type HeroChild = { name: string; visible: boolean };
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
  vegDirty?: boolean;
  hero?: { polys: number[][][]; pts: number[][]; group?: { traverse?: (fn: (o: HeroChild) => void) => void } };
};

const SHOW = 1400;
const CELL = 8;
const V_MAX = 2800;
const ROCK_N = 28;
const CACTUS_N = 12;
const WALL_N = 720;
const TAN = 0xc4a36a;
const TAN_DARK = 0x9a7848;
const TAN_LIT = 0xd2b98a;
const HOLE = 0x3a2c1e;
const DIRT = 0x6b4e32;
const STEP = 0x4a443c;
const ROCK_COL = [0xa89888, 0xc2b2a2, 0x8f8174, 0xb7a794];
const WALL_COL = [0x9a8878, 0xb0a090, 0x7d6e62, 0xc4b2a0];
const CACTUS_COL = [0x3d6844, 0x2c5538, 0x4a7a52];

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

export class InlandNorth {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: InlandData | null = null;
  private mask = new Set<string>();
  private mat: MeshLambertMaterial;
  private built: Mesh;
  private rocks: InstancedMesh;
  private cacti: InstancedMesh;
  private walls: InstancedMesh;
  private pos: Float32Array;
  private nor: Float32Array;
  private col: Float32Array;
  private idx: Uint32Array;
  private v = 3;
  private i = 3;
  private upV = 0;
  private upI = 0;
  private millOn = false;
  private trailOn = false;
  private dirtOn = [false, false];
  private hid = false;
  private hideTick = 0;
  private rockOn: Uint8Array;
  private cactusOn: Uint8Array;
  private wallOn: Uint8Array;
  private rockN = 0;
  private cactusN = 0;
  private wallN = 0;
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
    this.group.name = "aw:inland";
    g.scene.add(this.group);
    this.mat = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true, side: DoubleSide });
    this.mat.polygonOffset = true;
    this.mat.polygonOffsetFactor = -2;
    this.mat.polygonOffsetUnits = -4;
    this.built = this.sheet();
    this.pos = this.built.geometry.getAttribute("position").array as Float32Array;
    this.nor = this.built.geometry.getAttribute("normal").array as Float32Array;
    this.col = this.built.geometry.getAttribute("color").array as Float32Array;
    this.idx = this.built.geometry.getIndex()!.array as Uint32Array;
    this.rocks = this.blank(this.rockGeo(), ROCK_N, "rocks");
    this.cacti = this.blank(this.cactusGeo(), CACTUS_N, "cacti");
    this.walls = this.blank(this.wallGeo(), WALL_N, "walls");
    this.rockOn = new Uint8Array(ROCK_N);
    this.cactusOn = new Uint8Array(CACTUS_N);
    this.wallOn = new Uint8Array(WALL_N);
    this.paint(this.rocks, ROCK_N, ROCK_COL[0]);
    this.paint(this.cacti, CACTUS_N, CACTUS_COL[0]);
    this.paint(this.walls, WALL_N, WALL_COL[0]);
    this.bury(this.rocks, ROCK_N);
    this.bury(this.cacti, CACTUS_N);
    this.bury(this.walls, WALL_N);
    this.installVeg();
    this.bakeGpu();
    void this.load();
  }

  stats() {
    return {
      mill: this.millOn, trail: this.trailOn, dirt: this.dirtOn.some(Boolean),
      rocks: this.rockN, cacti: this.cactusN, walls: this.wallN, pending: this.pending(),
    };
  }

  pending() {
    if (!this.data) return 1;
    let n = 0;
    const d = this.data;
    if (!this.millOn && this.hasH(d.mill[0], d.mill[1])) n++;
    if (!this.trailOn && d.trail.length > 1 && this.hasH(d.trail[0][0], d.trail[0][1])) n++;
    for (let i = 0; i < d.rocks.length; i++) if (!this.rockOn[i] && this.hasH(d.rocks[i][0], d.rocks[i][1])) n++;
    for (let i = 0; i < d.walls.length; i++) if (!this.wallOn[i] && this.hasH(d.walls[i][0], d.walls[i][1])) n++;
    return n;
  }

  frame() {
    if (!this.data) return;
    this.hideMill();
    this.buildFixed();
    this.placeProps();
    const cam = this.g.camera.position;
    let show = false;
    for (const a of this.data.anchors) {
      const dx = cam.x - a[0], dz = cam.z - a[1];
      if (dx * dx + dz * dz < SHOW * SHOW) { show = true; break; }
    }
    if (!show) {
      const w = this.data.walls;
      for (let i = 0; i < w.length; i += 30) {
        const dx = cam.x - w[i][0], dz = cam.z - w[i][1];
        if (dx * dx + dz * dz < 800 * 800) { show = true; break; }
      }
    }
    if (this.group.visible !== show) this.group.visible = show;
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

  private async load() {
    try {
      const res = await fetch("./data/real/inland_north.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as InlandData;
    } catch {
      return;
    }
    this.fillMask();
    this.world.vegDirty = true;
    this.bakeGpu();
  }

  private buildFixed() {
    const d = this.data!;
    let dirty = false;
    if (!this.millOn && this.hasH(d.mill[0], d.mill[1])) {
      this.mill(d.mill[0], d.mill[1]);
      this.millOn = true;
      dirty = true;
    }
    if (!this.trailOn && d.trail.length > 2 && this.hasH(d.trail[0][0], d.trail[0][1]) && this.hasH(d.trail[d.trail.length - 1][0], d.trail[d.trail.length - 1][1])) {
      this.ribbon(d.trail, 2.3, DIRT, true);
      this.trailOn = true;
      dirty = true;
    }
    for (let k = 0; k < d.dirt.length && k < this.dirtOn.length; k++) {
      const line = d.dirt[k];
      if (this.dirtOn[k] || line.length < 2) continue;
      if (!this.hasH(line[0][0], line[0][1]) || !this.hasH(line[line.length - 1][0], line[line.length - 1][1])) continue;
      this.ribbon(line, 6.4, DIRT, false);
      this.dirtOn[k] = true;
      dirty = true;
    }
    if (dirty) this.upload();
  }

  private mill(cx: number, cz: number) {
    const gy = (x: number, z: number) => {
      const y = this.hAt(cx + x, cz + z);
      return Number.isFinite(y) ? y : this.hAt(cx, cz);
    };
    const put = (x: number, z: number, sx: number, sy: number, sz: number, hex: number, sink = 0.45) => {
      const y = gy(x, z);
      if (!Number.isFinite(y)) return;
      this.box(cx + x, y + sy / 2 - sink, cz + z, sx, sy, sz, 0, hex);
    };
    put(-8, 0.5, 13, 4.6, 8.5, TAN);
    put(-11, 4.9, 1.4, 2.3, 0.18, HOLE, -0.05);
    put(-7.2, 4.9, 1.35, 2.15, 0.18, HOLE, -0.05);
    put(-4, 4.9, 1.2, 1.7, 0.18, HOLE, -0.05);
    put(2, 7.2, 9, 2.4, 0.75, TAN_DARK);
    put(11.5, 7.2, 5, 2.15, 0.75, TAN);
    put(6.6, 7.55, 1.7, 1.7, 0.22, HOLE, -0.02);
    put(0, -6, 26, 3.4, 0.85, TAN_DARK);
    put(12, -1.5, 9, 6.2, 7.5, TAN_LIT);
    const y = gy(12, -1.5);
    if (Number.isFinite(y)) {
      const top = y + 5.7;
      this.tri([cx + 7.5, top, cz + 2.3], [cx + 16.5, top, cz + 2.3], [cx + 12, top + 2.4, cz + 2.3], TAN_LIT);
      this.quad([cx + 7.5, top, cz + 2.3], [cx + 12, top + 2.4, cz + 2.3], [cx + 12, top + 2.4, cz - 5.2], [cx + 7.5, top, cz - 5.2], 0xe4d2ae);
      this.quad([cx + 16.5, top, cz + 2.3], [cx + 16.5, top, cz - 5.2], [cx + 12, top + 2.4, cz - 5.2], [cx + 12, top + 2.4, cz + 2.3], 0xe4d2ae);
    }
    put(-2, 8, 3.2, 0.7, 2.2, 0x8d7358, 0.15);
    put(4, 9.5, 2.4, 0.55, 1.6, TAN_DARK, 0.1);
    put(9, 10, 1.8, 0.45, 1.4, 0x6e5c48, 0.08);
    const tones = [0x2a3e3a, 0x223632, 0x314844, 0x1c302c];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 5; j++) {
        const x0 = -10 + i * 3.3, z0 = 6 + j * 2.05;
        const corners: [number, number][] = [[x0, z0], [x0 + 3.05, z0], [x0 + 3.05, z0 + 1.85], [x0, z0 + 1.85]];
        const ys = corners.map(([x, z]) => gy(x, z));
        if (ys.some((y) => !Number.isFinite(y))) continue;
        const lift = 0.04;
        this.quad(
          [cx + corners[0][0], ys[0] + lift, cz + corners[0][1]],
          [cx + corners[1][0], ys[1] + lift, cz + corners[1][1]],
          [cx + corners[2][0], ys[2] + lift, cz + corners[2][1]],
          [cx + corners[3][0], ys[3] + lift, cz + corners[3][1]],
          tones[(i + j * 2) % tones.length],
        );
      }
    }
  }

  private ribbon(pts: Pt[], width: number, hex: number, steps: boolean) {
    const half = width / 2;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const L = Math.hypot(dx, dz) || 1;
      const nx = -dz / L * half, nz = dx / L * half;
      const ya = this.hAt(a[0], a[1]), yb = this.hAt(b[0], b[1]);
      if (!Number.isFinite(ya) || !Number.isFinite(yb) || Math.abs(ya - yb) > 3.5) continue;
      if (!this.hasH(a[0], a[1]) || !this.hasH(b[0], b[1])) continue;
      const lift = 0.07;
      this.quad(
        [a[0] - nx, ya + lift, a[1] - nz], [b[0] - nx, yb + lift, b[1] - nz],
        [b[0] + nx, yb + lift, b[1] + nz], [a[0] + nx, ya + lift, a[1] + nz], hex,
      );
      if (steps && i % 5 === 0) {
        const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
        const y = (ya + yb) / 2 + 0.03;
        const wx = nx * 0.7, wz = nz * 0.7;
        this.quad([mx - wx, y, mz - wz], [mx + wx, y, mz + wz], [mx + wx + dx * 0.25, y, mz + wz + dz * 0.25], [mx - wx + dx * 0.25, y, mz - wz + dz * 0.25], STEP);
      }
    }
  }

  private placeProps() {
    const d = this.data!;
    this.rockN = this.place(this.rocks, d.rocks, this.rockOn, this.rockN, ROCK_COL, (r, y) => [r[0], y + (r[6] ?? 0) - (r[4] ?? 1) * 0.32, r[1], r[2] ?? 0, r[3] ?? 1, r[4] ?? 1, r[5] ?? 1]);
    this.cactusN = this.place(this.cacti, d.cacti, this.cactusOn, this.cactusN, CACTUS_COL, (r, y) => {
      const s = r[3] ?? 1;
      return [r[0], y, r[1], r[2] ?? 0, s, s, s];
    });
    this.wallN = this.place(this.walls, d.walls, this.wallOn, this.wallN, WALL_COL, (r, y) => {
      const s = r[3] ?? 1;
      return [r[0], y, r[1], r[2] ?? 0, 1, s, 1];
    });
  }

  private place(mesh: InstancedMesh, rows: number[][], on: Uint8Array, placed: number, colors: number[], put: (row: number[], y: number) => number[]) {
    let n = 0;
    let moved = false;
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
      if (++n >= 16) break;
    }
    if (moved) {
      mesh.count = Math.max(mesh.count, placed);
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    return placed;
  }

  private hideMill() {
    const group = this.world.hero?.group;
    if (!group?.traverse || this.hid || (++this.hideTick % 20) !== 0) return;
    const drop: HeroChild[] = [];
    group.traverse((o) => { if (o.name && (o.name === "balashimill" || o.name.startsWith("balashimill_"))) drop.push(o); });
    for (const o of drop) {
      o.visible = false;
      const node = o as HeroChild & { parent?: { remove(c: HeroChild): void } | null };
      if (node.parent) node.parent.remove(node);
    }
    if (drop.length || this.hideTick > 240) this.hid = true;
  }

  private fillMask() {
    const d = this.data!;
    const mark = (x: number, z: number) => this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
    const blob = (cx: number, cz: number, r: number) => {
      for (let x = cx - r; x <= cx + r; x += CELL) for (let z = cz - r; z <= cz + r; z += CELL) mark(x, z);
    };
    blob(d.mill[0], d.mill[1], 18);
    for (const line of [d.trail, ...d.dirt]) for (const p of line) blob(p[0], p[1], 4);
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
    pos[3] = 0.4; pos[8] = 0.4;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("normal", new BufferAttribute(nor, 3));
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mesh = new Mesh(geo, this.mat);
    mesh.name = "aw:inland:built";
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
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
    this.built.frustumCulled = false;
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

  private face(pts: V3[], hex: number, fan: boolean) {
    if (!this.room(pts.length)) return;
    const ax = pts[1][0] - pts[0][0], ay = pts[1][1] - pts[0][1], az = pts[1][2] - pts[0][2];
    const bx = pts[2][0] - pts[0][0], by = pts[2][1] - pts[0][1], bz = pts[2][2] - pts[0][2];
    let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    const L = Math.hypot(nx, ny, nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const ids = pts.map((p) => this.vert(p[0], p[1], p[2], hex, nx, ny, nz));
    this.idx[this.i++] = ids[0]; this.idx[this.i++] = ids[1]; this.idx[this.i++] = ids[2];
    if (!fan) { this.idx[this.i++] = ids[0]; this.idx[this.i++] = ids[2]; this.idx[this.i++] = ids[3]; }
  }

  private quad(a: V3, b: V3, c: V3, d: V3, hex: number) { this.face([a, b, c, d], hex, false); }
  private tri(a: V3, b: V3, c: V3, hex: number) { this.face([a, b, c], hex, true); }

  private box(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw: number, hex: number) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const p = (x: number, y: number, z: number): V3 => [cx + x * c - z * s, cy + y, cz + x * s + z * c];
    const corners = [
      p(-hx, -hy, -hz), p(hx, -hy, -hz), p(hx, -hy, hz), p(-hx, -hy, hz),
      p(-hx, hy, -hz), p(hx, hy, -hz), p(hx, hy, hz), p(-hx, hy, hz),
    ];
    const faces: [number, number, number, number][] = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]];
    for (const f of faces) this.quad(corners[f[0]], corners[f[1]], corners[f[2]], corners[f[3]], hex);
  }

  private bakeGpu() {
    for (const mesh of [this.rocks, this.cacti, this.walls]) {
      mesh.frustumCulled = false;
      if (mesh.count < 1) {
        this.setInst(mesh, 0, 0, -80, 0, 0, 1, 1, 1);
        mesh.count = 1;
        mesh.instanceMatrix.needsUpdate = true;
      }
    }
    this.group.visible = true;
    this.built.frustumCulled = false;
    try { this.g.renderer.render(this.group, this.g.camera); } catch { /* still playable if the one-shot draw fails */ }
    this.rocks.count = this.rockN;
    this.cacti.count = this.cactusN;
    this.walls.count = this.wallN;
    this.group.visible = false;
  }

  private bury(mesh: InstancedMesh, n: number) {
    for (let i = 0; i < n; i++) this.setInst(mesh, i, 0, -80, 0, 0, 1, 1, 1);
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
  }

  private paint(mesh: InstancedMesh, n: number, hex: number) {
    for (let i = 0; i < n; i++) {
      this.tint.setHex(hex);
      mesh.setColorAt(i, this.tint);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  private setInst(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number) {
    this.vec.set(x, y, z);
    this.q.setFromAxisAngle(this.up, yaw);
    this.scale.set(sx, sy, sz);
    this.m.compose(this.vec, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private blank(geo: BufferGeometry, n: number, name: string) {
    const mat = new MeshLambertMaterial({ color: 0xffffff });
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:inland:" + name;
    this.group.add(mesh);
    return mesh;
  }

  private rockGeo() {
    const main = new SphereGeometry(1, 8, 6).translate(0, 1, 0);
    const side = new SphereGeometry(0.72, 7, 5).translate(0.95, 0.72, 0.15);
    const low = new SphereGeometry(0.58, 6, 4).translate(-0.7, 0.55, 0.4);
    return join([main, side, low]);
  }

  private cactusGeo() {
    return join([
      new BoxGeometry(0.55, 4.2, 0.55).translate(0, 2.1, 0),
      new BoxGeometry(0.4, 2.6, 0.4).translate(0.7, 2.8, 0),
      new BoxGeometry(0.36, 2.1, 0.36).translate(-0.55, 2.4, 0.1),
    ]);
  }

  private wallGeo() {
    const stones: number[][] = [
      [-1.25, 0.16, 0, 1.45, 0.32, 0.52],
      [0.2, 0.15, 0.03, 1.3, 0.3, 0.48],
      [1.4, 0.17, -0.02, 1.05, 0.34, 0.5],
      [-0.95, 0.46, 0.02, 1.55, 0.28, 0.46],
      [0.6, 0.47, -0.03, 1.25, 0.28, 0.44],
      [-0.35, 0.74, 0, 1.15, 0.26, 0.4],
      [0.85, 0.73, 0.03, 0.95, 0.24, 0.38],
    ];
    return join(stones.map(([x, y, z, sx, sy, sz]) => new BoxGeometry(sx, sy, sz).translate(x, y, z)));
  }
}
