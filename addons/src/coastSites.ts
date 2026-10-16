// Alto Vista Chapel and the pilgrim crosses, Bushiribana gold-mill ruins,
// the collapsed Natural Bridge, Baby Bridge, and three cairn fields.
// Positions are OSM. Ground photos set the massing and colours.
// Nothing here is a photo texture.
//
// The Natural Pool and its Arikok approach are not in this set. Neither are
// the California Lighthouse, Arashi, Hooiberg, or Ayo.
// Phone: one static mesh and two instanced prop meshes, allocated and uploaded
// at load. ?north=0 turns it off.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, DoubleSide, Group,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import type { AGame } from "./env";

type Pt = [number, number];
type Ring = number[][];
type V3 = [number, number, number];
type CoastData = {
  anchors: Pt[];
  chapel: { c: Pt; ring: Ring };
  ruin: Ring;
  collapse: Pt;
  baby: Pt;
  crosses: number[][];
  cairns: number[][];
  hide: Ring[];
};
type HeroChild = { name: string; visible: boolean; onBeforeRender?: (...args: unknown[]) => void };
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
  vegDirty?: boolean;
  hero?: { polys: number[][][]; pts: number[][]; group?: { children: HeroChild[] } };
};

const SHOW = 1100;
const CELL = 8;
const V_MAX = 4200;
const CROSS_N = 10;
const CAIRN_N = 24;
const YEL = 0xe2c25a;
const PEW = 0xefd56e;
const ROOF = 0xe6d7ae;
const TRIM = 0xf6f3ec;
const DOOR = 0x6b3c24;
const ARCH_HOLE = 0x2a1810;
const SPIRE = 0x141614;
const STONE = 0x262422;
const STONE_TOP = 0x3c3834;
const HOLE = 0x0c0b0a;
const ROCK = 0x5c4a3a;
const CORAL = 0x7a624c;
const CORAL_MID = 0x5c4636;
const CORAL_DARK = 0x3e3026;
const CORAL_LIT = 0x947656;
const CAIRN_COL = [0x8d867c, 0xa3988c, 0x6f6a62, 0xb1a494];

function rgb(hex: number): [number, number, number] {
  return [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

function openRing(ring: Ring): Pt[] {
  const p = ring.map((q) => [q[0], q[1]] as Pt);
  if (p.length > 1 && Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1]) < 0.2) p.pop();
  return p;
}

function centroid(ring: Ring): Pt {
  const p = openRing(ring);
  let x = 0, z = 0;
  for (const q of p) { x += q[0]; z += q[1]; }
  return [x / Math.max(1, p.length), z / Math.max(1, p.length)];
}

function pip(ring: Ring, x: number, z: number) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][1], yj = ring[j][1];
    if ((yi > z) !== (yj > z) && x < ((ring[j][0] - ring[i][0]) * (z - yi)) / ((yj - yi) || 1e-6) + ring[i][0]) c = !c;
  }
  return c;
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

export class CoastSites {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: CoastData | null = null;
  private mask = new Set<string>();
  private mat: MeshLambertMaterial;
  private built: Mesh;
  private crosses: InstancedMesh;
  private cairns: InstancedMesh;
  private pos: Float32Array;
  private nor: Float32Array;
  private col: Float32Array;
  private idx: Uint32Array;
  private v = 3;
  private i = 3;
  private upV = 0;
  private upI = 0;
  private chapelOn = false;
  private ruinOn = false;
  private gapOn = false;
  private babyOn = false;
  private hid = false;
  private crossOn: Uint8Array;
  private cairnOn: Uint8Array;
  private crossN = 0;
  private cairnN = 0;
  private hiddenN = 0;
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
    this.group.name = "aw:coast";
    g.scene.add(this.group);
    this.mat = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true, side: DoubleSide });
    this.built = this.sheet();
    this.pos = this.built.geometry.getAttribute("position").array as Float32Array;
    this.nor = this.built.geometry.getAttribute("normal").array as Float32Array;
    this.col = this.built.geometry.getAttribute("color").array as Float32Array;
    this.idx = this.built.geometry.getIndex()!.array as Uint32Array;
    this.crosses = this.blank(this.crossGeo(), 0xf7f4ee, CROSS_N);
    this.cairns = this.blank(this.cairnGeo(), 0xffffff, CAIRN_N);
    this.crossOn = new Uint8Array(CROSS_N);
    this.cairnOn = new Uint8Array(CAIRN_N);
    this.paint(this.crosses, CROSS_N, 0xf7f4ee);
    this.paint(this.cairns, CAIRN_N, 0x8d867c);
    this.bury(this.crosses, CROSS_N);
    this.bury(this.cairns, CAIRN_N);
    this.installVeg();
    this.bakeGpu();
    void this.load();
  }

  pending() {
    if (!this.data) return 1;
    let n = 0;
    const d = this.data;
    if (!this.chapelOn && this.hasH(d.chapel.c[0], d.chapel.c[1])) n++;
    const rc = centroid(d.ruin);
    if (!this.ruinOn && this.hasH(rc[0], rc[1])) n++;
    if (!this.gapOn && this.hasH(d.collapse[0], d.collapse[1])) n++;
    if (!this.babyOn && this.hasH(d.baby[0], d.baby[1])) n++;
    for (let i = 0; i < d.crosses.length; i++) if (!this.crossOn[i] && this.hasH(d.crosses[i][0], d.crosses[i][1])) n++;
    for (let i = 0; i < d.cairns.length; i++) if (!this.cairnOn[i] && this.hasH(d.cairns[i][0], d.cairns[i][1])) n++;
    return n;
  }

  stats() {
    return {
      chapel: this.chapelOn, ruin: this.ruinOn, gap: this.gapOn, baby: this.babyOn,
      crosses: this.crossN, cairns: this.cairnN, hidden: this.hiddenN, pending: this.pending(),
    };
  }

  frame() {
    if (!this.data) return;
    this.hideFootprints();
    this.suppressHeroes();
    this.buildSites();
    this.placeProps();
    const cam = this.g.camera.position;
    let show = false;
    for (const a of this.data.anchors) {
      const dx = cam.x - a[0], dz = cam.z - a[1];
      if (dx * dx + dz * dz < SHOW * SHOW) { show = true; break; }
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
      const res = await fetch("./data/real/coast_sites.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as CoastData;
    } catch {
      return;
    }
    this.fillMask();
    this.hideFootprints();
    this.world.vegDirty = true;
    this.bakeGpu();
  }

  private buildSites() {
    const d = this.data!;
    let dirty = false;
    if (!this.chapelOn && this.hasH(d.chapel.c[0], d.chapel.c[1])) {
      this.chapel(d.chapel.c[0], d.chapel.c[1]);
      this.chapelOn = true;
      dirty = true;
    }
    const rc = centroid(d.ruin);
    if (!this.ruinOn && this.hasH(rc[0], rc[1])) {
      this.ruin(d.ruin);
      this.ruinOn = true;
      dirty = true;
    }
    if (!this.gapOn && this.hasH(d.collapse[0], d.collapse[1])) {
      this.collapsed(d.collapse);
      this.gapOn = true;
      dirty = true;
    }
    if (!this.babyOn && this.hasH(d.baby[0], d.baby[1])) {
      this.arch(d.baby);
      this.babyOn = true;
      dirty = true;
    }
    if (dirty) this.upload();
  }

  private chapel(cx: number, cz: number) {
    const hw = 2.9, hd = 6.1;
    const x0 = cx - hw, x1 = cx + hw, z0 = cz - hd, z1 = cz + hd;
    const ys = [this.hAt(x0, z0), this.hAt(x1, z0), this.hAt(x0, z1), this.hAt(x1, z1)].filter((y) => Number.isFinite(y));
    if (ys.length < 4) return;
    const base = Math.min(...ys);
    const eave = base + 3.65;
    const ridge = eave + 1.8;
    this.quad([x0, base, z0], [x1, base, z0], [x1, eave, z0], [x0, eave, z0], YEL);
    this.tri([x0, eave, z0], [x1, eave, z0], [cx, ridge, z0], YEL);
    this.quad([x0, base, z0], [x0, base, z1], [x0, eave, z1], [x0, eave, z0], YEL);
    this.quad([x1, base, z1], [x1, base, z0], [x1, eave, z0], [x1, eave, z1], YEL);
    const dw = 0.78;
    this.quad([x0, base, z1], [cx - dw, base, z1], [cx - dw, eave, z1], [x0, eave, z1], YEL);
    this.quad([cx + dw, base, z1], [x1, base, z1], [x1, eave, z1], [cx + dw, eave, z1], YEL);
    this.quad([cx - dw, base + 2.7, z1], [cx + dw, base + 2.7, z1], [cx + dw, eave, z1], [cx - dw, eave, z1], YEL);
    this.tri([x0, eave, z1], [x1, eave, z1], [cx, ridge, z1], YEL);
    this.quad(
      [cx - dw + 0.1, base + 0.02, z1 + 0.05], [cx + dw - 0.1, base + 0.02, z1 + 0.05],
      [cx + dw - 0.1, base + 2.15, z1 + 0.05], [cx - dw + 0.1, base + 2.15, z1 + 0.05], ARCH_HOLE,
    );
    this.tri([cx - 0.58, base + 2.05, z1 + 0.07], [cx + 0.58, base + 2.05, z1 + 0.07], [cx, base + 3.15, z1 + 0.07], ARCH_HOLE);
    this.box(cx - 0.3, base + 1.02, z1 + 0.14, 0.46, 2.0, 0.08, 0.18, DOOR);
    this.box(cx + 0.3, base + 1.02, z1 + 0.14, 0.46, 2.0, 0.08, -0.18, DOOR);
    this.quad([x0, eave, z0], [x0, eave, z1], [cx, ridge, z1], [cx, ridge, z0], ROOF);
    this.quad([x1, eave, z1], [x1, eave, z0], [cx, ridge, z0], [cx, ridge, z1], ROOF);
    this.box(cx, eave + 0.05, z1 + 0.1, hw * 2 + 0.35, 0.16, 0.14, 0, TRIM);
    this.box(cx, eave + 0.05, z0 - 0.08, hw * 2 + 0.2, 0.12, 0.1, 0, TRIM);
    const sx = cx, sz = z1 - 1.5;
    this.box(sx, ridge + 0.55, sz, 1.05, 1.2, 1.05, 0, TRIM);
    this.spire(sx, ridge + 1.15, sz, 0.7, 2.15);
    this.box(sx, ridge + 3.4, sz, 0.08, 0.72, 0.08, 0, SPIRE);
    this.box(sx, ridge + 3.55, sz, 0.48, 0.08, 0.08, 0, SPIRE);
    const doorZ = z1 + 16;
    for (let row = 0; row < 2; row++) {
      for (let k = -2; k <= 2; k++) {
        if (k === 0) continue;
        const px = cx + k * 2.7;
        const pz = doorZ + row * 2.7;
        const gy = this.hAt(px, pz);
        const py = Number.isFinite(gy) ? gy : base;
        this.box(px, py + 0.26, pz, 2.15, 0.48, 0.62, 0.15 * k, PEW);
      }
    }
    this.yardWall(cx, cz, base, z1);
  }

  private yardWall(cx: number, cz: number, base: number, front: number) {
    const y0 = base, y1 = base + 0.72;
    const x0 = cx - 11, x1 = cx + 11, z0 = cz - 8, z1 = front + 8;
    const wall = (a: V3, b: V3) => {
      this.quad(a, b, [b[0], y1, b[2]], [a[0], y1, a[2]], 0x6e675e);
      this.quad([a[0], y1, a[2]], [b[0], y1, b[2]], [b[0] + 0.15, y1, b[2] + 0.15], [a[0] + 0.15, y1, a[2] + 0.15], 0x7c756c);
    };
    wall([x0, y0, z0], [x1, y0, z0]);
    wall([x0, y0, z0], [x0, y0, z1]);
    wall([x1, y0, z1], [x1, y0, z0]);
    wall([x0, y0, z1], [cx - 2.2, y0, z1]);
    wall([cx + 2.2, y0, z1], [x1, y0, z1]);
  }

  private spire(x: number, y: number, z: number, r: number, h: number) {
    const peak: V3 = [x, y + h, z];
    const rim: V3[] = [[x - r, y, z - r], [x + r, y, z - r], [x + r, y, z + r], [x - r, y, z + r]];
    for (let k = 0; k < 4; k++) this.tri(peak, rim[k], rim[(k + 1) % 4], SPIRE);
  }

  private ruin(ringIn: Ring) {
    const ring = openRing(ringIn);
    if (ring.length < 3) return;
    const c = centroid(ring);
    const segs: [Pt, Pt][] = [];
    for (let k = 0; k < ring.length; k++) {
      const a = ring[k], b = ring[(k + 1) % ring.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 1.2) continue;
      const n = Math.max(1, Math.round(len / 5.2));
      for (let s = 0; s < n; s++) {
        const t0 = s / n, t1 = (s + 1) / n;
        segs.push([
          [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0],
          [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1],
        ]);
      }
    }
    const heights = [6.6, 3.1, 5.4, 2.3, 6.1, 4.0, 2.6, 5.8, 3.4, 6.9, 2.8, 4.6];
    for (let k = 0; k < segs.length; k++) {
      const [a, b] = segs[k];
      const ground = this.segBase(a, b);
      if (!Number.isFinite(ground)) continue;
      const y0 = ground - 0.85;
      const h = heights[k % heights.length];
      this.stoneWall(a, b, y0, y0 + h, c, h > 3.6);
      if (k % 2 === 0) {
        const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
        let nx = mx - c[0], nz = mz - c[1];
        const nl = Math.hypot(nx, nz) || 1;
        nx /= nl; nz /= nl;
        const ang = Math.atan2(b[0] - a[0], b[1] - a[1]);
        this.box(mx + nx * 1.15, ground + 0.28, mz + nz * 1.15, 1.7 + (k % 3) * 0.35, 0.62, 1.15, ang, k % 4 ? ROCK : 0x2a2622);
      }
    }
    // Two broken interior walls, so the ruin reads as rooms rather than one shell.
    const inner: [Pt, Pt, number][] = [
      [[c[0] - 4.2, c[1] - 1.5], [c[0] + 1.4, c[1] + 2.2], 4.4],
      [[c[0] + 2.6, c[1] - 3.2], [c[0] - 0.8, c[1] + 1.6], 3.2],
    ];
    for (const [a, b, h] of inner) {
      const ground = this.segBase(a, b);
      if (!Number.isFinite(ground)) continue;
      this.stoneWall(a, b, ground - 0.7, ground - 0.7 + h, c, true);
    }
  }

  private segBase(a: Pt, b: Pt) {
    let y = Infinity;
    for (let t = 0; t <= 4; t++) {
      const h = this.hAt(a[0] + (b[0] - a[0]) * (t / 4), a[1] + (b[1] - a[1]) * (t / 4));
      if (Number.isFinite(h)) y = Math.min(y, h);
    }
    return y;
  }

  private stoneWall(a: Pt, b: Pt, y0: number, y1: number, c: Pt, hole: boolean) {
    const dx = b[0] - a[0], dz = b[1] - a[1];
    const L = Math.hypot(dx, dz) || 1;
    let nx = (a[0] + b[0]) * 0.5 - c[0], nz = (a[1] + b[1]) * 0.5 - c[1];
    const nl = Math.hypot(nx, nz) || 1;
    nx = nx / nl * 0.85; nz = nz / nl * 0.85;
    const face = (ox: number, oz: number, yb: number, yt: number, hex: number) => {
      this.quad([a[0] + ox, yb, a[1] + oz], [b[0] + ox, yb, b[1] + oz], [b[0] + ox, yt, b[1] + oz], [a[0] + ox, yt, a[1] + oz], hex);
    };
    const col = ((Math.abs(a[0] + b[0]) * 10) | 0) % 2 ? STONE : 0x1e1c1a;
    if (hole && (L < 3.2 || y1 - y0 < 3.4)) hole = false;
    if (!hole) {
      face(0, 0, y0, y1, col);
      face(nx, nz, y0, y1, col);
    } else {
      const sill = y0 + 1.85, head = Math.min(y1 - 0.65, y0 + 3.85);
      face(0, 0, y0, sill, col);
      face(0, 0, head, y1, col);
      face(nx, nz, y0, sill, col);
      face(nx, nz, head, y1, col);
      const ux = dx / L, uz = dz / L;
      const pier = Math.min(1.1, L * 0.28);
      for (const t of [pier, L - pier]) {
        const mx = a[0] + ux * t, mz = a[1] + uz * t;
        this.quad([mx, sill, mz], [mx + nx, sill, mz + nz], [mx + nx, head, mz + nz], [mx, head, mz], col);
      }
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      this.quad([mx - ux * 0.9, sill, mz - uz * 0.9], [mx + ux * 0.9, sill, mz + uz * 0.9], [mx + ux * 0.9, head, mz + uz * 0.9], [mx - ux * 0.9, head, mz - uz * 0.9], HOLE);
    }
    this.quad([a[0], y1, a[1]], [b[0], y1, b[1]], [b[0] + nx, y1, b[1] + nz], [a[0] + nx, y1, a[1] + nz], STONE_TOP);
  }

  private collapsed(at: Pt) {
    const y = this.hAt(at[0], at[1]);
    if (!Number.isFinite(y)) return;
    const sea = this.seaDir(at[0], at[1]);
    const px = -sea.dz, pz = sea.dx;
    // The span is gone. Cliff heads stand on the two rims; the low ground between them stays open.
    const lump = (ox: number, oz: number, sx: number, sy: number, sz: number, hex: number, sink = 0.55) => {
      const wx = at[0] + px * ox + sea.dx * oz;
      const wz = at[1] + pz * ox + sea.dz * oz;
      const hy = this.hAt(wx, wz);
      const gy = Number.isFinite(hy) ? hy : y;
      this.oriented(wx, gy + sy / 2 - sink, wz, sx, sy, sz, px, pz, hex);
    };
    lump(-7.6, -0.6, 6.2, 4.2, 5.2, CORAL);
    lump(-9.2, 1.1, 4.0, 5.2, 3.6, CORAL_DARK);
    lump(-6.2, 1.8, 4.4, 2.6, 3.2, CORAL_LIT);
    lump(-8.4, -2.2, 3.2, 2.2, 2.8, CORAL_MID);
    lump(7.8, -0.4, 6.4, 4.4, 5.0, CORAL_MID);
    lump(9.4, 1.2, 3.8, 5.4, 3.4, CORAL_DARK);
    lump(6.4, 1.6, 4.2, 2.4, 3.0, CORAL_LIT);
    lump(8.2, -2.0, 3.0, 2.0, 2.6, CORAL);
    // Fallen pieces in the notch, low enough that the gap stays readable.
    lump(-1.6, 2.6, 2.4, 0.85, 1.7, CORAL_DARK, 0.2);
    lump(1.5, 3.4, 1.9, 0.7, 1.5, ROCK, 0.15);
    lump(0.2, 1.4, 2.8, 0.55, 1.8, CORAL_LIT, 0.1);
    const sx = 1290, sz = -2285;
    const sy = this.hAt(sx, sz);
    const gy = Number.isFinite(sy) ? sy : y;
    const yaw = Math.atan2(at[0] - sx, at[1] - sz);
    this.box(sx - 0.7, gy + 0.85, sz, 0.28, 1.7, 0.28, 0, 0xd9d4cc);
    this.box(sx + 0.7, gy + 0.85, sz, 0.28, 1.7, 0.28, 0, 0xd9d4cc);
    this.box(sx, gy + 2.05, sz, 2.15, 1.35, 0.1, yaw, 0xf7f4ee);
    this.box(sx, gy + 2.28, sz, 1.85, 0.22, 0.12, yaw, 0x9a3030);
  }

  private arch(at: Pt) {
    const y = this.hAt(at[0], at[1]);
    if (!Number.isFinite(y)) return;
    const sea = this.seaDir(at[0], at[1]);
    const px = -sea.dz, pz = sea.dx;
    // Step off the cliff onto the drop, so the opening sits over low ground instead of being filled by the heightfield.
    let cx = at[0], cz = at[1], floor = y;
    for (let s = 4; s <= 16; s += 2) {
      const nx = at[0] + sea.dx * s, nz = at[1] + sea.dz * s;
      const h = this.hAt(nx, nz);
      if (Number.isFinite(h) && y - h > 2.2) { cx = nx; cz = nz; floor = h; break; }
    }
    const here: Pt = [cx, cz];
    const span = 8.4, rise = 2.6, depth = 5.2, thick = 1.45;
    const shades = [CORAL_DARK, CORAL_MID, CORAL, CORAL_LIT, CORAL, CORAL_MID, CORAL_DARK, ROCK];
    const n = 8;
    for (let k = 0; k < n; k++) {
      const a0 = Math.PI * k / n;
      const a1 = Math.PI * (k + 1) / n;
      const am = (a0 + a1) / 2;
      const ex = Math.cos(am) * span / 2;
      const ey = Math.sin(am) * rise;
      const tx = -Math.sin(am) * span / 2;
      const ty = Math.cos(am) * rise;
      const tl = Math.hypot(tx, ty) || 1;
      const radial: V3 = [Math.cos(am), Math.sin(am), 0];
      const tangent: V3 = [tx / tl, ty / tl, 0];
      const len = Math.hypot(Math.cos(a0) - Math.cos(a1), 0) * span / 2 + Math.abs(Math.sin(a1) - Math.sin(a0)) * rise;
      const edge = k < 2 || k > n - 3;
      this.archBox(here, floor, sea, px, pz, ex, ey + thick * 0.42, tangent, radial, len * 1.2, edge ? thick * 1.25 : thick, edge ? depth + 0.8 : depth, shades[k]);
    }
    this.oriented(cx + px * 1.4, floor + rise + thick * 0.15, cz + pz * 1.4, 4.6, 0.7, 3.2, px, pz, CORAL);
    this.oriented(cx - px * 1.8, floor + rise + thick * 0.45, cz - pz * 1.8, 3.4, 0.85, 2.6, px, pz, CORAL_LIT);
    this.oriented(cx + px * 0.2 + sea.dx * 0.8, floor + rise + thick * 0.7, cz + pz * 0.2 + sea.dz * 0.8, 2.2, 0.55, 1.6, px, pz, CORAL_MID);
    const foot = (side: number, hex: number) => {
      const ox = side * (span / 2 + 0.4);
      this.oriented(cx + px * ox, floor + rise * 0.72, cz + pz * ox, 3.6, rise * 1.55, depth + 1.4, px, pz, hex);
      this.oriented(cx + px * (ox + side * 1.3) - sea.dx * 0.6, floor + rise * 0.4, cz + pz * (ox + side * 1.3) - sea.dz * 0.6, 2.4, rise * 0.95, 2.8, px, pz, CORAL_DARK);
    };
    foot(-1, CORAL_DARK);
    foot(1, CORAL_MID);
    this.oriented(cx + sea.dx * 2.4, floor + 0.28, cz + sea.dz * 2.4, 2.2, 0.55, 1.5, px, pz, ROCK);
  }

  private archBox(at: Pt, y: number, sea: { dx: number; dz: number }, px: number, pz: number, ex: number, ey: number, tangent: V3, radial: V3, len: number, thick: number, depth: number, hex: number) {
    const ax: V3 = [px * tangent[0], tangent[1], pz * tangent[0]];
    const ay: V3 = [px * radial[0], radial[1], pz * radial[0]];
    const az: V3 = [sea.dx, 0, sea.dz];
    const c: V3 = [at[0] + px * ex, y + ey, at[1] + pz * ex];
    const al = Math.hypot(ax[0], ax[1], ax[2]) || 1;
    const rl = Math.hypot(ay[0], ay[1], ay[2]) || 1;
    ax[0] /= al; ax[1] /= al; ax[2] /= al;
    ay[0] /= rl; ay[1] /= rl; ay[2] /= rl;
    this.basis(c, ax, ay, az, len, thick, depth, hex);
  }

  private seaDir(x: number, z: number) {
    const y = this.hAt(x, z);
    let dx = 0, dz = -1, drop = 0;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const h = this.hAt(x + Math.cos(a) * 18, z + Math.sin(a) * 18);
      if (Number.isFinite(h) && y - h > drop) { drop = y - h; dx = Math.cos(a); dz = Math.sin(a); }
    }
    return { dx, dz };
  }

  private placeProps() {
    const d = this.data!;
    this.crossN = this.place(this.crosses, d.crosses, this.crossOn, this.crossN, (i, r, y) => {
      const s = r[3] ?? 1;
      this.setInst(this.crosses, i, r[0], y, r[1], r[2] ?? 0, s, s, s);
      this.tint.setHex(0xf7f4ee);
      this.crosses.setColorAt(i, this.tint);
    });
    this.cairnN = this.place(this.cairns, d.cairns, this.cairnOn, this.cairnN, (i, r, y) => {
      const s = r[3] ?? 1;
      this.setInst(this.cairns, i, r[0], y, r[1], r[2] ?? 0, s, s, s);
      this.tint.setHex(CAIRN_COL[i % CAIRN_COL.length]);
      this.cairns.setColorAt(i, this.tint);
    });
  }

  private place(mesh: InstancedMesh, rows: number[][], on: Uint8Array, placed: number, put: (i: number, row: number[], y: number) => void) {
    let n = 0;
    let moved = false;
    for (let i = 0; i < rows.length && i < on.length; i++) {
      if (on[i]) continue;
      const r = rows[i];
      if (!this.hasH(r[0], r[1])) continue;
      const y = this.hAt(r[0], r[1]);
      if (!Number.isFinite(y)) continue;
      put(i, r, y);
      on[i] = 1;
      placed++;
      moved = true;
      if (++n >= 8) break;
    }
    if (moved) {
      mesh.count = Math.max(mesh.count, placed);
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    return placed;
  }

  private suppressed(name: string) {
    return name === "bushiribana" || name.startsWith("bushiribana_")
      || name === "altovista" || name.startsWith("altovista_lod") || name.startsWith("altovista_plaza")
      || name.startsWith("naturalbridge_rocks")
      || name === "babybridge" || name.startsWith("babybridge_");
  }

  private suppressHeroes() {
    const group = this.world.hero?.group as { traverse?: (fn: (o: HeroChild) => void) => void } | undefined;
    if (!group?.traverse) return;
    const drop: HeroChild[] = [];
    group.traverse((o) => { if (o.name && this.suppressed(o.name)) drop.push(o); });
    for (const o of drop) {
      o.visible = false;
      const node = o as HeroChild & { parent?: { remove(c: HeroChild): void } | null };
      if (node.parent) node.parent.remove(node);
    }
    this.hiddenN = drop.length;
  }

  private hideFootprints() {
    const hero = this.world.hero;
    if (!hero || !this.data || this.hid) return;
    for (const ring of this.data.hide) {
      hero.polys.push(ring);
      hero.pts.push(centroid(ring));
    }
    this.hid = true;
  }

  private fillMask() {
    const d = this.data!;
    const mark = (x: number, z: number) => this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
    const blob = (cx: number, cz: number, r: number) => {
      for (let x = cx - r; x <= cx + r; x += CELL) for (let z = cz - r; z <= cz + r; z += CELL) mark(x, z);
    };
    blob(d.chapel.c[0], d.chapel.c[1] + 4, 14);
    const ruin = openRing(d.ruin);
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const p of ruin) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); z0 = Math.min(z0, p[1]); z1 = Math.max(z1, p[1]); }
    for (let x = x0; x <= x1; x += CELL) for (let z = z0; z <= z1; z += CELL) if (pip(d.ruin, x, z)) mark(x, z);
    blob(d.collapse[0], d.collapse[1], 12);
    blob(d.baby[0], d.baby[1], 8);
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
    mesh.name = "aw:coast:built";
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

  private oriented(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, px: number, pz: number, hex: number) {
    const dx = pz, dz = -px;
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const corner = (x: number, y: number, z: number): V3 => [cx + px * x + dx * z, cy + y, cz + pz * x + dz * z];
    const c = [
      corner(-hx, -hy, -hz), corner(hx, -hy, -hz), corner(hx, -hy, hz), corner(-hx, -hy, hz),
      corner(-hx, hy, -hz), corner(hx, hy, -hz), corner(hx, hy, hz), corner(-hx, hy, hz),
    ];
    const faces: [number, number, number, number][] = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]];
    for (const f of faces) this.quad(c[f[0]], c[f[1]], c[f[2]], c[f[3]], hex);
  }

  private basis(c: V3, ax: V3, ay: V3, az: V3, sx: number, sy: number, sz: number, hex: number) {
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const p = (x: number, y: number, z: number): V3 => [
      c[0] + ax[0] * x + ay[0] * y + az[0] * z,
      c[1] + ax[1] * x + ay[1] * y + az[1] * z,
      c[2] + ax[2] * x + ay[2] * y + az[2] * z,
    ];
    const corners = [
      p(-hx, -hy, -hz), p(hx, -hy, -hz), p(hx, -hy, hz), p(-hx, -hy, hz),
      p(-hx, hy, -hz), p(hx, hy, -hz), p(hx, hy, hz), p(-hx, hy, hz),
    ];
    const faces: [number, number, number, number][] = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]];
    for (const f of faces) this.quad(corners[f[0]], corners[f[1]], corners[f[2]], corners[f[3]], hex);
  }

  private bakeGpu() {
    for (const mesh of [this.crosses, this.cairns]) {
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
    this.crosses.count = this.crossN;
    this.cairns.count = this.cairnN;
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

  private blank(geo: BufferGeometry, color: number, n: number) {
    const mat = new MeshLambertMaterial({ color });
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:coast:inst";
    this.group.add(mesh);
    return mesh;
  }

  private cairnGeo() {
    const boxes: BufferGeometry[] = [];
    const widths = [0.86, 0.66, 0.48, 0.32, 0.2];
    let y = 0;
    for (let k = 0; k < widths.length; k++) {
      const h = 0.14;
      boxes.push(new BoxGeometry(widths[k], h, widths[k] * 0.78).translate((k % 2) * 0.04, y + h / 2, 0));
      y += h;
    }
    return join(boxes);
  }

  private crossGeo() {
    return join([
      new BoxGeometry(0.38, 0.16, 0.38).translate(0, 0.08, 0),
      new BoxGeometry(0.13, 1.5, 0.09).translate(0, 0.9, 0),
      new BoxGeometry(0.7, 0.12, 0.09).translate(0, 1.28, 0),
    ]);
  }
}
