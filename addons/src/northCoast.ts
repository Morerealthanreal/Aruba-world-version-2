// North-coast landmarks: Alto Vista Chapel, Bushiribana gold mill, the collapsed
// Natural Bridge and the baby bridge, the Ayo boulders, and the coral dirt tracks
// with their cairns. Positions are OSM. Ground photos set the colours and massing.
// Nothing here is a photo texture.
//
// Phone soak: one static mesh, one dirt mesh, and four instanced prop meshes,
// all allocated at startup and uploaded once. ?north=0 turns it off.
// Stays clear of the California Lighthouse, Arashi, Arikok and Hooiberg.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, DoubleSide, Group,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, SphereGeometry, Vector3,
} from "three";
import type { AGame } from "./env";

type Pt = [number, number];
type Ring = number[][];
type CoastData = {
  anchors: Pt[];
  chapel: { c: Pt; ring: Ring };
  ruin: { ring: Ring };
  collapse: Pt;
  baby: Pt;
  lips: Ring[];
  ayo: Ring;
  rocks: number[][];
  cairns: number[][];
  crosses: number[][];
  cacti: number[][];
  roads: Ring[];
};
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
  vegDirty?: boolean;
  hero?: { polys: number[][][]; pts: number[][] };
};
type Job = { key: string; ids: number[]; at: number };
type Sink = { n: number };

const SHOW = 1100;
const CELL = 8;
const DIRT_MAX = 1400;
const STATIC_V = 4500;
const YEL = 0xf2e29a;
const WHITE = 0xf7f5f0;
const DOOR = 0x6b3e2c;
const SPIRE = 0x232826;
const DARK = 0x34383c;
const DARKER = 0x2a2e32;
const LIMESTONE = 0xd2c4a8;
const CLIFF = 0x6a5b4a;
const ARCH = 0xb08960;
const ARCH_DARK = 0x7a5c42;
const BENCH = 0xf3e7a8;
const ROCK_COL = [0xc4a882, 0xb49678, 0xa89080, 0xd2c0a4, 0x8f8478];
const CACTUS_COL = [0x3d6b38, 0x4a7840, 0x2f5a30];
const CAIRN_COL = [0x8d8680, 0xa09890, 0x6f6a64];

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
    if ((yi > z) !== (yj > z) && x < ((ring[j][0] - ring[i][0]) * (z - yi)) / (yj - yi) + ring[i][0]) c = !c;
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

export class NorthCoast {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: CoastData | null = null;
  private low: boolean;
  private mask = new Set<string>();
  private dirtMat: MeshLambertMaterial;
  private staticMat: MeshLambertMaterial;
  private dirt: Mesh;
  private built: Mesh;
  private rocks: InstancedMesh;
  private cairns: InstancedMesh;
  private crosses: InstancedMesh;
  private cacti: InstancedMesh;
  private dPos: Float32Array;
  private dNor: Float32Array;
  private dIdx: Uint32Array;
  private dCorn = new Float32Array(0);
  private dJobs: Job[] = [];
  private dV = 3;
  private dI = 3;
  private dUpV = 0;
  private dUpI = 0;
  private dDirty = false;
  private dDone = false;
  private sPos: Float32Array;
  private sNor: Float32Array;
  private sCol: Float32Array;
  private sIdx: Uint32Array;
  private sV = 3;
  private sI = 3;
  private sUpV = 0;
  private sUpI = 0;
  private chapelOn = false;
  private ruinOn = false;
  private gapOn = false;
  private babyOn = false;
  private hid = false;
  private rockOn: Uint8Array;
  private cairnOn: Uint8Array;
  private crossOn: Uint8Array;
  private cactusOn: Uint8Array;
  private rockN = 0;
  private cairnN = 0;
  private crossN = 0;
  private cactusN = 0;
  private m = new Matrix4();
  private q = new Quaternion();
  private v = new Vector3();
  private up = new Vector3(0, 1, 0);
  private scale = new Vector3();
  private tint = new Color();

  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    this.low = g.real?.q.name === "low";
    this.group.name = "aw:north";
    g.scene.add(this.group);
    this.dirtMat = new MeshLambertMaterial({ color: 0xc4a882 });
    this.dirtMat.polygonOffset = true;
    this.dirtMat.polygonOffsetFactor = -2;
    this.dirtMat.polygonOffsetUnits = -4;
    this.staticMat = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true, side: DoubleSide });
    this.dirt = this.sheet("dirt", this.dirtMat, DIRT_MAX, false);
    this.dPos = this.dirt.geometry.getAttribute("position").array as Float32Array;
    this.dNor = this.dirt.geometry.getAttribute("normal").array as Float32Array;
    this.dIdx = this.dirt.geometry.getIndex()!.array as Uint32Array;
    this.built = this.sheet("built", this.staticMat, STATIC_V / 4, true);
    this.sPos = this.built.geometry.getAttribute("position").array as Float32Array;
    this.sNor = this.built.geometry.getAttribute("normal").array as Float32Array;
    this.sCol = this.built.geometry.getAttribute("color").array as Float32Array;
    this.sIdx = this.built.geometry.getIndex()!.array as Uint32Array;
    this.rocks = this.blank(new SphereGeometry(1, 5, 4).translate(0, 1, 0), 0xffffff, 28);
    this.cairns = this.blank(this.cairnGeo(), 0xffffff, 18);
    this.crosses = this.blank(this.crossGeo(), 0xf4f1ea, 8);
    this.cacti = this.blank(this.cactusGeo(), 0xffffff, 16);
    this.rockOn = new Uint8Array(28);
    this.cairnOn = new Uint8Array(18);
    this.crossOn = new Uint8Array(8);
    this.cactusOn = new Uint8Array(16);
    this.tint.setHex(0xffffff);
    for (const m of [this.rocks, this.cairns, this.cacti]) m.setColorAt(0, this.tint);
    this.installVeg();
    this.bakeGpu();
    void this.load();
  }

  pending() {
    if (!this.data) return 1;
    let n = 0;
    if (!this.dDone) for (const job of this.dJobs) if (job.at < job.ids.length && this.hasKey(job.key)) n++;
    if (!this.chapelOn && this.hasH(this.data.chapel.c[0], this.data.chapel.c[1])) n++;
    const ruin = centroid(this.data.ruin.ring);
    if (!this.ruinOn && this.hasH(ruin[0], ruin[1])) n++;
    if (!this.gapOn && this.hasH(this.data.collapse[0], this.data.collapse[1])) n++;
    if (!this.babyOn && this.hasH(this.data.baby[0], this.data.baby[1])) n++;
    return n;
  }

  stats() {
    return {
      chapel: this.chapelOn, ruin: this.ruinOn, gap: this.gapOn, baby: this.babyOn,
      roads: Math.max(0, (this.dI - 3) / 6), rocks: this.rockN, cairns: this.cairnN,
      crosses: this.crossN, cacti: this.cactusN, pending: this.pending(),
    };
  }

  frame() {
    if (!this.data) return;
    this.hideFootprints();
    this.pumpDirt();
    this.pumpBuilt();
    this.placeProps();
    const cam = this.g.camera.position;
    let show = false;
    const anchors = this.data.anchors;
    for (let i = 0; i < anchors.length; i++) {
      const dx = cam.x - anchors[i][0], dz = cam.z - anchors[i][1];
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
      const res = await fetch("./data/real/north_coast.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as CoastData;
    } catch {
      return;
    }
    const d = this.data;
    this.prepDirt();
    this.bury(this.rocks, d.rocks.length);
    this.bury(this.cairns, d.cairns.length);
    this.bury(this.crosses, d.crosses.length);
    this.bury(this.cacti, d.cacti.length);
    this.fillMask();
    this.hideFootprints();
    this.world.vegDirty = true;
    this.bakeGpu();
  }

  private prepDirt() {
    const d = this.data!;
    const corners: number[] = [];
    const keys: string[] = [];
    const half = 2.7, lift = 0.22;
    const push = (quad: Pt[], key: string) => {
      if (keys.length >= DIRT_MAX) return;
      for (const [x, z] of quad) corners.push(x, z, lift);
      keys.push(key);
    };
    for (const path of d.roads) {
      for (let i = 1; i < path.length; i++) {
        const p = path[i - 1], q = path[i];
        const dx = q[0] - p[0], dz = q[1] - p[1];
        const L = Math.hypot(dx, dz) || 1;
        const nx = -dz / L * half, nz = dx / L * half;
        push([[p[0] - nx, p[1] - nz], [q[0] - nx, q[1] - nz], [p[0] + nx, p[1] + nz], [q[0] + nx, q[1] + nz]], this.regKey((p[0] + q[0]) * 0.5, (p[1] + q[1]) * 0.5));
      }
    }
    const yard = (cx: number, cz: number, hw: number, hd: number) => {
      const step = 6;
      for (let x = cx - hw; x < cx + hw; x += step) for (let z = cz - hd; z < cz + hd; z += step) {
        push([[x, z], [x + step, z], [x, z + step], [x + step, z + step]], this.regKey(x + step * 0.5, z + step * 0.5));
      }
    };
    yard(d.chapel.c[0], d.chapel.c[1] + 4, 12, 16);
    const rc = centroid(d.ruin.ring);
    yard(rc[0], rc[1], 12, 10);
    this.dCorn = Float32Array.from(corners);
    this.dJobs = this.jobsOf(keys);
    this.dDone = this.dJobs.length === 0;
  }

  private jobsOf(keys: string[]): Job[] {
    const map = new Map<string, number[]>();
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      let a = map.get(k);
      if (!a) map.set(k, a = []);
      a.push(i);
    }
    const jobs: Job[] = [];
    for (const [key, ids] of map) jobs.push({ key, ids, at: 0 });
    return jobs;
  }

  private pumpDirt() {
    if (this.dDone) return;
    let budget = this.low ? 500 : 280;
    let open = false;
    for (const job of this.dJobs) {
      if (job.at >= job.ids.length) continue;
      if (!this.hasKey(job.key)) { open = true; continue; }
      while (job.at < job.ids.length && budget > 0) {
        this.emitDirt(job.ids[job.at++]);
        budget--;
      }
      if (job.at < job.ids.length) open = true;
      if (budget <= 0) break;
    }
    if (!open) this.dDone = true;
    if (this.dDirty) this.uploadDirt();
  }

  private emitDirt(qi: number) {
    const b = qi * 12;
    const base = this.dV;
    if (base + 4 > this.dPos.length / 3) return;
    for (let k = 0; k < 4; k++) {
      const x = this.dCorn[b + k * 3], z = this.dCorn[b + k * 3 + 1], lift = this.dCorn[b + k * 3 + 2];
      const h = this.hAt(x, z) + lift;
      const o = (base + k) * 3;
      this.dPos[o] = x; this.dPos[o + 1] = Number.isFinite(h) ? h : 0; this.dPos[o + 2] = z;
      const s = 4, dx = this.hAt(x + s, z) - this.hAt(x - s, z), dz = this.hAt(x, z + s) - this.hAt(x, z - s);
      const q = Math.hypot(dx, 8, dz) || 1;
      this.dNor[o] = -dx / q; this.dNor[o + 1] = 8 / q; this.dNor[o + 2] = -dz / q;
    }
    const ii = this.dI;
    this.dIdx[ii] = base; this.dIdx[ii + 1] = base + 1; this.dIdx[ii + 2] = base + 2;
    this.dIdx[ii + 3] = base + 2; this.dIdx[ii + 4] = base + 1; this.dIdx[ii + 5] = base + 3;
    this.dV += 4;
    this.dI += 6;
    this.dDirty = true;
  }

  private uploadDirt() {
    const g = this.dirt.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const idx = g.getIndex()!;
    pos.clearUpdateRanges(); nor.clearUpdateRanges(); idx.clearUpdateRanges();
    pos.addUpdateRange(this.dUpV * 3, (this.dV - this.dUpV) * 3);
    nor.addUpdateRange(this.dUpV * 3, (this.dV - this.dUpV) * 3);
    idx.addUpdateRange(this.dUpI, this.dI - this.dUpI);
    pos.needsUpdate = true; nor.needsUpdate = true; idx.needsUpdate = true;
    g.setDrawRange(0, this.dI);
    g.computeBoundingSphere();
    this.dUpV = this.dV; this.dUpI = this.dI; this.dDirty = false;
    this.dirt.frustumCulled = false;
  }

  private pumpBuilt() {
    const d = this.data!;
    const sink: Sink = { n: 0 };
    if (!this.chapelOn && this.hasH(d.chapel.c[0], d.chapel.c[1])) {
      this.chapel(d.chapel.c[0], d.chapel.c[1]);
      this.chapelOn = true;
      sink.n++;
    }
    const rc = centroid(d.ruin.ring);
    if (!this.ruinOn && this.hasH(rc[0], rc[1])) {
      this.ruin(d.ruin.ring);
      this.ruinOn = true;
      sink.n++;
    }
    if (!this.gapOn && this.hasH(d.collapse[0], d.collapse[1])) {
      this.collapsed(d.collapse, d.lips);
      this.gapOn = true;
      sink.n++;
    }
    if (!this.babyOn && this.hasH(d.baby[0], d.baby[1])) {
      this.arch(d.baby);
      this.babyOn = true;
      sink.n++;
    }
    if (sink.n) this.uploadBuilt();
  }

  private chapel(cx: number, cz: number) {
    const x0 = cx - 2.9, x1 = cx + 2.9, z0 = cz - 6.5, z1 = cz + 6.5;
    const ys = [this.hAt(x0, z0), this.hAt(x1, z0), this.hAt(x0, z1), this.hAt(x1, z1)].filter((y) => Number.isFinite(y));
    if (ys.length < 4) return;
    const base = Math.min(...ys) - 0.2;
    const eave = base + 4.15;
    const ridge = eave + 1.75;
    this.quad([x0, base, z0], [x1, base, z0], [x1, eave, z0], [x0, eave, z0], YEL);
    this.tri([x0, eave, z0], [x1, eave, z0], [cx, ridge, z0], YEL);
    this.quad([x0, base, z0], [x0, base, z1], [x0, eave, z1], [x0, eave, z0], YEL);
    this.quad([x1, base, z1], [x1, base, z0], [x1, eave, z0], [x1, eave, z1], YEL);
    // South gable is the door front, facing inland, with the sea behind the north wall.
    this.quad([x0, base, z1], [cx - 0.95, base, z1], [cx - 0.95, eave, z1], [x0, eave, z1], YEL);
    this.quad([cx + 0.95, base, z1], [x1, base, z1], [x1, eave, z1], [cx + 0.95, eave, z1], YEL);
    this.quad([x0, eave - 0.15, z1], [x1, eave - 0.15, z1], [x1, eave, z1], [x0, eave, z1], YEL);
    this.tri([x0, eave, z1], [x1, eave, z1], [cx, ridge, z1], YEL);
    this.quad([x0, eave, z0], [x0, eave, z1], [cx, ridge, z1], [cx, ridge, z0], 0xe6d48a);
    this.quad([x1, eave, z1], [x1, eave, z0], [cx, ridge, z0], [cx, ridge, z1], 0xe6d48a);
    this.quad([x0, eave - 0.08, z0], [x0, eave + 0.16, z0], [x0, eave + 0.16, z1], [x0, eave - 0.08, z1], WHITE);
    this.quad([x1, eave + 0.16, z0], [x1, eave - 0.08, z0], [x1, eave - 0.08, z1], [x1, eave + 0.16, z1], WHITE);
    this.box(cx, base + 1.35, z1 + 0.08, 1.7, 2.5, 0.12, 0, DOOR);
    this.tri([cx - 1.05, base + 2.45, z1 + 0.12], [cx + 1.05, base + 2.45, z1 + 0.12], [cx, base + 3.55, z1 + 0.12], WHITE);
    this.box(cx, base + 0.16, z1 + 1.1, 2.4, 0.28, 1.5, 0, 0x8d8680);
    const sx = cx, sz = z1 - 0.15;
    this.box(sx, ridge + 0.55, sz, 1.15, 1.2, 1.15, 0, WHITE);
    this.spire(sx, ridge + 1.15, sz, 0.85, 2.35);
    this.box(sx, ridge + 3.7, sz, 0.08, 0.72, 0.08, 0, SPIRE);
    this.box(sx, ridge + 3.85, sz, 0.48, 0.08, 0.08, 0, SPIRE);
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        this.box(cx + side * 4.3, base + 0.28, z1 + 2.4 + row * 2.5, 2.5, 0.42, 0.62, 0, BENCH);
      }
    }
    this.yardWall(cx, cz, base);
  }

  private yardWall(cx: number, cz: number, base: number) {
    const y0 = base, y1 = base + 0.85;
    const x0 = cx - 11, x1 = cx + 11, z0 = cz - 9, z1 = cz + 15;
    this.quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], 0xc4b89a);
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], 0xc4b89a);
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], 0xc4b89a);
    this.quad([x0, y0, z1], [cx - 2.4, y0, z1], [cx - 2.4, y1, z1], [x0, y1, z1], 0xc4b89a);
    this.quad([cx + 2.4, y0, z1], [x1, y0, z1], [x1, y1, z1], [cx + 2.4, y1, z1], 0xc4b89a);
  }

  private spire(x: number, y: number, z: number, r: number, h: number) {
    const peak: [number, number, number] = [x, y + h, z];
    const rim: [number, number, number][] = [[x - r, y, z - r], [x + r, y, z - r], [x + r, y, z + r], [x - r, y, z + r]];
    for (let i = 0; i < 4; i++) this.tri(peak, rim[i], rim[(i + 1) % 4], SPIRE);
  }

  private ruin(ringIn: Ring) {
    const ring = openRing(ringIn);
    if (ring.length < 3) return;
    const ys = ring.map(([x, z]) => this.hAt(x, z)).filter((y) => Number.isFinite(y));
    if (!ys.length) return;
    const base = Math.min(...ys) - 0.25;
    const c = centroid(ring);
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const tall = len > 6 ? 5.2 + (i % 4) * 0.7 : 3.1 + (i % 2) * 0.6;
      const col = i % 2 ? DARK : DARKER;
      this.stoneWall(a, b, base, base + tall, col, c, len > 6.5);
    }
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      this.box(c[0] + Math.cos(a) * 3.2, base + 0.45, c[1] + Math.sin(a) * 2.4, 1.6 + (i % 2) * 0.8, 0.9, 1.3, a, 0x3a3430);
    }
  }

  private stoneWall(a: Pt, b: Pt, y0: number, y1: number, hex: number, c: Pt, hole: boolean) {
    const dx = b[0] - a[0], dz = b[1] - a[1];
    const L = Math.hypot(dx, dz) || 1;
    let nx = -(c[0] - (a[0] + b[0]) * 0.5), nz = -(c[1] - (a[1] + b[1]) * 0.5);
    const nl = Math.hypot(nx, nz) || 1;
    nx = nx / nl * 0.72; nz = nz / nl * 0.72;
    const face = (ox: number, oz: number, yb: number, yt: number) => {
      this.quad([a[0] + ox, yb, a[1] + oz], [b[0] + ox, yb, b[1] + oz], [b[0] + ox, yt, b[1] + oz], [a[0] + ox, yt, a[1] + oz], hex);
    };
    if (!hole) {
      face(0, 0, y0, y1);
      face(nx, nz, y0, y1);
    } else {
      const sill = y0 + 1.45, head = y0 + 3.15;
      face(0, 0, y0, sill);
      face(0, 0, head, y1);
      face(nx, nz, y0, sill);
      face(nx, nz, head, y1);
      const ux = dx / L, uz = dz / L;
      const pier = 0.38 * L;
      for (const t of [pier * 0.5, L - pier * 0.5]) {
        const mx = a[0] + ux * t, mz = a[1] + uz * t;
        this.quad([mx, sill, mz], [mx + nx, sill, mz + nz], [mx + nx, head, mz + nz], [mx, head, mz], hex);
      }
    }
    this.quad([a[0], y1, a[1]], [b[0], y1, b[1]], [b[0] + nx, y1, b[1] + nz], [a[0] + nx, y1, a[1] + nz], 0x4a4e52);
  }

  private collapsed(at: Pt, lips: Ring[]) {
    const y = this.hAt(at[0], at[1]);
    if (!Number.isFinite(y)) return;
    let drew = false;
    for (const line of lips) {
      for (let i = 1; i < line.length; i++) {
        const a = line[i - 1], b = line[i];
        const ya = this.hAt(a[0], a[1]), yb = this.hAt(b[0], b[1]);
        if (!Number.isFinite(ya) || !Number.isFinite(yb)) continue;
        this.quad([a[0], ya - 2.4, a[1]], [b[0], yb - 2.4, b[1]], [b[0], yb - 0.15, b[1]], [a[0], ya - 0.15, a[1]], CLIFF);
        this.quad([a[0], ya - 0.15, a[1]], [b[0], yb - 0.15, b[1]], [b[0], yb + 1.15, b[1]], [a[0], ya + 1.15, a[1]], LIMESTONE);
        drew = true;
      }
    }
    if (!drew) {
      this.quad([at[0] - 14, y - 2.2, at[1]], [at[0] - 5, y - 2.2, at[1]], [at[0] - 5, y + 1.2, at[1]], [at[0] - 14, y + 1.4, at[1]], LIMESTONE);
      this.quad([at[0] + 5, y - 2.2, at[1]], [at[0] + 14, y - 2.2, at[1]], [at[0] + 14, y + 1.5, at[1]], [at[0] + 5, y + 1.1, at[1]], LIMESTONE);
    }
    for (let i = 0; i < 5; i++) {
      const a = i * 1.3;
      this.box(at[0] + Math.cos(a) * (1.5 + i * 0.7), y + 0.35, at[1] + Math.sin(a) * 1.6, 1.4 + (i % 2), 0.7 + (i % 3) * 0.25, 1.1, a, i % 2 ? CLIFF : 0x4e463e);
    }
    const sx = at[0] + 2.5, sz = at[1] + 8;
    const sy = this.hAt(sx, sz);
    const gy = Number.isFinite(sy) ? sy : y;
    this.box(sx - 0.45, gy + 0.55, sz, 0.18, 1.1, 0.18, 0, 0xd9d4cc);
    this.box(sx + 0.45, gy + 0.55, sz, 0.18, 1.1, 0.18, 0, 0xd9d4cc);
    this.box(sx, gy + 1.35, sz, 1.35, 0.85, 0.08, 0, 0xf4f1ea);
  }

  private arch(at: Pt) {
    const y = this.hAt(at[0], at[1]);
    if (!Number.isFinite(y)) return;
    let dx = 0, dz = -1, drop = 0;
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const h = this.hAt(at[0] + Math.cos(a) * 14, at[1] + Math.sin(a) * 14);
      if (Number.isFinite(h) && y - h > drop) { drop = y - h; dx = Math.cos(a); dz = Math.sin(a); }
    }
    const px = -dz, pz = dx;
    const top = y + 4.5;
    const sill = y + 0.25;
    const deck = y + 2.55;
    const place = (along: number, through: number, sx: number, sy: number, sz: number, hex: number) => {
      this.oriented(at[0] + px * along + dx * through, (sy < 0 ? top : sill) + Math.abs(sy) * 0.5, at[1] + pz * along + dz * through, sx, Math.abs(sy), sz, px, pz, hex);
    };
    // Abutments and a thick walkable deck, open underneath. Not a rebuilt span at the collapse.
    this.oriented(at[0] + px * -5.6, y + 2.1, at[1] + pz * -5.6, 3.4, 4.6, 7.2, px, pz, ARCH);
    this.oriented(at[0] + px * 5.6, y + 2.1, at[1] + pz * 5.6, 3.4, 4.6, 7.2, px, pz, ARCH);
    this.oriented(at[0], deck + 0.95, at[1], 14.6, 1.9, 7.4, px, pz, ARCH);
    this.oriented(at[0] + dx * 0.2, deck - 0.15, at[1] + dz * 0.2, 7.2, 0.45, 5.4, px, pz, ARCH_DARK);
    place(0, 2.2, 2.2, 0.7, 1.6, 0xc4a27a);
    place(-3.2, -1.4, 1.4, 0.55, 1.2, 0x9a7048);
  }

  private oriented(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, px: number, pz: number, hex: number) {
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const dx = pz, dz = -px;
    const corner = (x: number, y: number, z: number): [number, number, number] => [
      cx + px * x + dx * z, cy + y, cz + pz * x + dz * z,
    ];
    const c = [
      corner(-hx, -hy, -hz), corner(hx, -hy, -hz), corner(hx, -hy, hz), corner(-hx, -hy, hz),
      corner(-hx, hy, -hz), corner(hx, hy, -hz), corner(hx, hy, hz), corner(-hx, hy, hz),
    ];
    const faces = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]];
    for (const f of faces) this.quad(c[f[0]], c[f[1]], c[f[2]], c[f[3]], hex);
  }

  private placeProps() {
    const d = this.data!;
    // rocks: x,z,sx,sy,sz,yaw,lift. cairns/cacti: x,z,yaw,scale. crosses: x,z,yaw.
    this.rockN = this.place(this.rocks, d.rocks, this.rockOn, this.rockN, (i, r, y) => {
      this.setInst(this.rocks, i, r[0], y + (r[6] ?? 0), r[1], r[5] ?? 0, r[2], r[3], r[4]);
      this.tint.setHex(ROCK_COL[i % ROCK_COL.length]);
      this.rocks.setColorAt(i, this.tint);
    });
    this.cairnN = this.place(this.cairns, d.cairns, this.cairnOn, this.cairnN, (i, r, y) => {
      const s = r[3] ?? 1;
      this.setInst(this.cairns, i, r[0], y, r[1], r[2] ?? 0, s, s, s);
      this.tint.setHex(CAIRN_COL[i % CAIRN_COL.length]);
      this.cairns.setColorAt(i, this.tint);
    });
    this.crossN = this.place(this.crosses, d.crosses, this.crossOn, this.crossN, (i, r, y) => {
      this.setInst(this.crosses, i, r[0], y, r[1], r[2] ?? 0, 1, 1, 1);
    });
    this.cactusN = this.place(this.cacti, d.cacti, this.cactusOn, this.cactusN, (i, r, y) => {
      const s = r[3] ?? 1;
      this.setInst(this.cacti, i, r[0], y, r[1], r[2] ?? 0, s, s, s);
      this.tint.setHex(CACTUS_COL[i % CACTUS_COL.length]);
      this.cacti.setColorAt(i, this.tint);
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
      if (++n >= 12) break;
    }
    if (moved) {
      mesh.count = Math.max(mesh.count, placed);
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    return placed;
  }

  private hideFootprints() {
    const hero = this.world.hero;
    if (!hero || !this.data || this.hid) return;
    for (const ring of [this.data.chapel.ring, this.data.ruin.ring]) {
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
    blob(d.chapel.c[0], d.chapel.c[1], 18);
    const rc = centroid(d.ruin.ring);
    blob(rc[0], rc[1], 16);
    blob(d.collapse[0], d.collapse[1], 14);
    blob(d.baby[0], d.baby[1], 12);
    const ayo = d.ayo;
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const p of ayo) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); z0 = Math.min(z0, p[1]); z1 = Math.max(z1, p[1]); }
    for (let x = x0; x <= x1; x += 16) for (let z = z0; z <= z1; z += 16) if (pip(ayo, x, z)) mark(x, z);
    for (const line of d.roads) for (const p of line) mark(p[0], p[1]);
  }

  private hasH(x: number, z: number) { return this.hasKey(this.regKey(x, z)); }

  private hasKey(key: string) {
    const r = this.world.regions.get(key);
    return !!(r && r.H);
  }

  private regKey(x: number, z: number) {
    const M = this.world.M;
    return Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
  }

  private sheet(name: string, mat: MeshLambertMaterial, quads: number, color: boolean) {
    const vMax = 3 + quads * 4, iMax = 3 + quads * 6;
    const pos = new Float32Array(vMax * 3), nor = new Float32Array(vMax * 3), idx = new Uint32Array(iMax);
    for (let i = 0; i < vMax; i++) { pos[i * 3 + 1] = -40; nor[i * 3 + 1] = 1; }
    idx[0] = 0; idx[1] = 1; idx[2] = 2;
    pos[3] = 0.4; pos[8] = 0.4;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("normal", new BufferAttribute(nor, 3));
    if (color) {
      const col = new Float32Array(vMax * 3);
      for (let i = 0; i < col.length; i++) col[i] = 1;
      geo.setAttribute("color", new BufferAttribute(col, 3));
    }
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mesh = new Mesh(geo, mat);
    mesh.name = "aw:north:" + name;
    mesh.castShadow = name === "built" && !this.low;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    this.group.add(mesh);
    return mesh;
  }

  private uploadBuilt() {
    const g = this.built.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const col = g.getAttribute("color") as BufferAttribute;
    const idx = g.getIndex()!;
    pos.clearUpdateRanges(); nor.clearUpdateRanges(); col.clearUpdateRanges(); idx.clearUpdateRanges();
    pos.addUpdateRange(this.sUpV * 3, (this.sV - this.sUpV) * 3);
    nor.addUpdateRange(this.sUpV * 3, (this.sV - this.sUpV) * 3);
    col.addUpdateRange(this.sUpV * 3, (this.sV - this.sUpV) * 3);
    idx.addUpdateRange(this.sUpI, this.sI - this.sUpI);
    pos.needsUpdate = true; nor.needsUpdate = true; col.needsUpdate = true; idx.needsUpdate = true;
    g.setDrawRange(0, this.sI);
    g.computeBoundingSphere();
    this.sUpV = this.sV; this.sUpI = this.sI;
    this.built.frustumCulled = false;
  }

  private room(nVerts: number) {
    return this.sV + nVerts < this.sPos.length / 3 && this.sI + nVerts * 3 < this.sIdx.length;
  }

  private vert(x: number, y: number, z: number, hex: number, nx: number, ny: number, nz: number) {
    const i = this.sV++;
    const o = i * 3;
    this.sPos[o] = x; this.sPos[o + 1] = y; this.sPos[o + 2] = z;
    this.sNor[o] = nx; this.sNor[o + 1] = ny; this.sNor[o + 2] = nz;
    const [r, g, b] = rgb(hex);
    this.sCol[o] = r; this.sCol[o + 1] = g; this.sCol[o + 2] = b;
    return i;
  }

  private face(pts: [number, number, number][], hex: number, fan: boolean) {
    if (!this.room(pts.length)) return;
    const ax = pts[1][0] - pts[0][0], ay = pts[1][1] - pts[0][1], az = pts[1][2] - pts[0][2];
    const bx = pts[2][0] - pts[0][0], by = pts[2][1] - pts[0][1], bz = pts[2][2] - pts[0][2];
    let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
    const L = Math.hypot(nx, ny, nz) || 1;
    nx /= L; ny /= L; nz /= L;
    const ids = pts.map((p) => this.vert(p[0], p[1], p[2], hex, nx, ny, nz));
    if (fan) {
      this.sIdx[this.sI++] = ids[0]; this.sIdx[this.sI++] = ids[1]; this.sIdx[this.sI++] = ids[2];
      return;
    }
    this.sIdx[this.sI++] = ids[0]; this.sIdx[this.sI++] = ids[1]; this.sIdx[this.sI++] = ids[2];
    this.sIdx[this.sI++] = ids[0]; this.sIdx[this.sI++] = ids[2]; this.sIdx[this.sI++] = ids[3];
  }

  private quad(a: [number, number, number], b: [number, number, number], c: [number, number, number], d: [number, number, number], hex: number) {
    this.face([a, b, c, d], hex, false);
  }

  private tri(a: [number, number, number], b: [number, number, number], c: [number, number, number], hex: number) {
    this.face([a, b, c], hex, true);
  }

  private box(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw: number, hex: number) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const p = (x: number, y: number, z: number): [number, number, number] => [cx + x * c - z * s, cy + y, cz + x * s + z * c];
    const corners = [
      p(-hx, -hy, -hz), p(hx, -hy, -hz), p(hx, -hy, hz), p(-hx, -hy, hz),
      p(-hx, hy, -hz), p(hx, hy, -hz), p(hx, hy, hz), p(-hx, hy, hz),
    ];
    const faces: [number, number, number, number][] = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]];
    for (const f of faces) this.quad(corners[f[0]], corners[f[1]], corners[f[2]], corners[f[3]], hex);
  }

  private bakeGpu() {
    const meshes = [this.rocks, this.cairns, this.crosses, this.cacti];
    const prev = meshes.map((m) => m.count);
    for (const m of meshes) {
      if (m.count < 1) {
        this.setInst(m, 0, 0, -80, 0, 0, 1, 1, 1);
        m.count = 1;
        m.instanceMatrix.needsUpdate = true;
      }
      m.frustumCulled = false;
    }
    this.group.visible = true;
    this.dirt.frustumCulled = false;
    this.built.frustumCulled = false;
    try { this.g.renderer.render(this.group, this.g.camera); } catch { /* still playable if the one-shot draw fails */ }
    meshes.forEach((m, i) => { m.count = prev[i]; });
    this.group.visible = false;
  }

  private bury(mesh: InstancedMesh, n: number) {
    for (let i = 0; i < n; i++) this.setInst(mesh, i, 0, -80, 0, 0, 1, 1, 1);
    mesh.count = n;
    mesh.instanceMatrix.needsUpdate = true;
  }

  private setInst(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number) {
    this.v.set(x, y, z);
    this.q.setFromAxisAngle(this.up, yaw);
    this.scale.set(sx, sy, sz);
    this.m.compose(this.v, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private blank(geo: BufferGeometry, color: number, n: number) {
    const mat = new MeshLambertMaterial({ color });
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:north:inst";
    this.group.add(mesh);
    return mesh;
  }

  private cairnGeo() {
    const boxes: BufferGeometry[] = [];
    const widths = [0.72, 0.56, 0.4, 0.26];
    let y = 0;
    for (let i = 0; i < widths.length; i++) {
      const h = 0.16;
      boxes.push(new BoxGeometry(widths[i], h, widths[i] * 0.72).translate(0, y + h / 2, 0));
      y += h;
    }
    return join(boxes);
  }

  private crossGeo() {
    return join([
      new BoxGeometry(0.12, 1.65, 0.08).translate(0, 0.82, 0),
      new BoxGeometry(0.62, 0.1, 0.08).translate(0, 1.15, 0),
    ]);
  }

  private cactusGeo() {
    return join([
      new BoxGeometry(0.32, 2.8, 0.32).translate(0, 1.4, 0),
      new BoxGeometry(0.2, 1.15, 0.2).translate(0.28, 2.15, 0),
      new BoxGeometry(0.16, 0.9, 0.16).translate(-0.24, 1.9, 0.06),
    ]);
  }
}
