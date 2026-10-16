// Tierra del Sol resort around the course: cream villas and two-story condos
// with clay roofs, the entrance gate and sign, and a few palms and columnar
// cacti at the gate. Footprints are OSM. The residential streets stay the
// engine's mapped roads, so this does not lay a second ribbon on them.
// The California Lighthouse and the Arashi shore are not in the data.
//
// One mesh for every building and the gate, one mesh for the streets, and two
// instanced plants. Allocated once at load. ?golf=0 or ?resort=0 turns it off.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, CylinderGeometry, DoubleSide, Float32BufferAttribute,
  Group, InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import type { AGame } from "./env";

type Ring = number[][];
type Villa = { p: Ring; s: number; h: number[] };
type Road = { w: number; p: Ring };
type Plant = { k: "palm" | "cactus"; x: number; z: number; s: number; yaw: number };
type Gate = { x: number; z: number; ax: number; az: number; sx: number; sz: number };
type ResortData = { anchor: number[]; villas: Villa[]; roads: Road[]; gate: Gate; plants: Plant[] };
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
  vegDirty?: boolean;
  hero?: { polys: number[][][]; pts: number[][] };
};
type Job = { key: string; ids: number[]; at: number };

const SHOW = 3200;
const CELL = 8;
const WALL = 0xf3efe4;
const WALL2 = 0xe6d7c4;
const ROOF = 0xb8432c;
const ROOF2 = 0x9c3a26;
const STONE = 0xb7a48e;
const GLASS = 0x243646;
const GRAVEL = 0xd5d0c6;
const ASPHALT = 0x8e8b84;

function rgb(hex: number): [number, number, number] {
  return [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

function openRing(ring: Ring) {
  const p = ring.slice();
  if (p.length > 1 && Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1]) < 0.2) p.pop();
  return p;
}

function signedArea(ring: Ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    a += ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1];
  }
  return a * 0.5;
}

function centroid(ring: Ring): [number, number] {
  const p = openRing(ring);
  let x = 0, z = 0;
  for (const q of p) { x += q[0]; z += q[1]; }
  return [x / p.length, z / p.length];
}

function hullOf(ring: Ring): Ring {
  const pts = openRing(ring).map((p) => [p[0], p[1]] as [number, number]);
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

export class TierraResort {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: ResortData | null = null;
  private low: boolean;
  private mask = new Set<string>();
  private villaMesh: Mesh | null = null;
  private pos!: Float32Array;
  private col!: Float32Array;
  private nor!: Float32Array;
  private idx!: Uint32Array;
  private vUsed = 0;
  private iUsed = 0;
  private upV = 0;
  private upI = 0;
  private vMax = 0;
  private iMax = 0;
  private jobs: Job[] = [];
  private gateDone = false;
  private plantsDone = false;
  private roadMesh: Mesh | null = null;
  private roadCorn: Float32Array | null = null;
  private roadJobs: Job[] = [];
  private rPos!: Float32Array;
  private rNor!: Float32Array;
  private rIdx!: Uint32Array;
  private rv = 0;
  private ri = 0;
  private rUpV = 0;
  private rUpI = 0;
  private palms: InstancedMesh;
  private cacti: InstancedMesh;
  private m = new Matrix4();
  private q = new Quaternion();
  private leanQ = new Quaternion();
  private v = new Vector3();
  private up = new Vector3(0, 1, 0);
  private west = new Vector3(0, 0, 1);
  private scale = new Vector3();

  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    this.low = g.real?.q.name === "low";
    this.group.name = "aw:tds-resort";
    this.group.visible = false;
    g.scene.add(this.group);
    const plant = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true });
    this.palms = this.blank(this.palmGeo(), plant, 8);
    this.cacti = this.blank(this.cactusGeo(), plant, 8);
    this.installVeg();
    void this.load();
  }

  pending() {
    if (!this.data) return 1;
    let n = 0;
    for (const job of this.jobs) if (job.at < job.ids.length && this.hasKey(job.key)) n++;
    if (!this.gateDone && this.hasH(this.data.gate.x, this.data.gate.z)) n++;
    return n;
  }

  frame() {
    if (!this.data) return;
    this.pumpVillas();
    this.fillGate();
    this.placePlants();
    const cam = this.g.camera.position;
    const ax = this.data.anchor[0], az = this.data.anchor[1];
    const show = (cam.x - ax) ** 2 + (cam.z - az) ** 2 < SHOW * SHOW;
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
      const res = await fetch("./data/real/tds_resort.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as ResortData;
    } catch {
      return;
    }
    this.prepVillas();
    this.hideFootprints();
    this.fillMask();
    this.world.vegDirty = true;
    this.bakeGpu();
  }

  private prepVillas() {
    const d = this.data!;
    this.vMax = d.villas.length * 84 + 1400;
    this.iMax = d.villas.length * 140 + 2800;
    this.pos = new Float32Array(this.vMax * 3);
    this.col = new Float32Array(this.vMax * 3);
    this.nor = new Float32Array(this.vMax * 3);
    this.idx = new Uint32Array(this.iMax);
    const ax = d.anchor[0], az = d.anchor[1];
    this.put(ax, -40, az, WALL, 0, 1, 0);
    this.put(ax + 0.4, -40, az, WALL, 0, 1, 0);
    this.put(ax, -40, az + 0.4, WALL, 0, 1, 0);
    this.idx[0] = 0; this.idx[1] = 1; this.idx[2] = 2;
    this.iUsed = 3;
    const by = new Map<string, number[]>();
    d.villas.forEach((v, i) => {
      const key = this.regKey(v.h[0], v.h[1]);
      const list = by.get(key);
      if (list) list.push(i); else by.set(key, [i]);
    });
    for (const [key, ids] of by) this.jobs.push({ key, ids, at: 0 });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(this.pos, 3));
    geo.setAttribute("color", new BufferAttribute(this.col, 3));
    geo.setAttribute("normal", new BufferAttribute(this.nor, 3));
    geo.setIndex(new BufferAttribute(this.idx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mesh = new Mesh(geo, new MeshLambertMaterial({ color: 0xffffff, vertexColors: true, side: DoubleSide }));
    mesh.name = "aw:tds:villas";
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    mesh.castShadow = !this.low;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.villaMesh = mesh;
  }

  private prepRoads() {
    const quads: number[] = [];
    const owner: number[] = [];
    const step = 7;
    for (const road of this.data!.roads) {
      const pts = this.samples(road.p, step);
      const hw = road.w * 0.5;
      for (let i = 1; i < pts.length; i++) {
        const ax = pts[i - 1][0], az = pts[i - 1][1], bx = pts[i][0], bz = pts[i][1];
        const L = Math.hypot(bx - ax, bz - az) || 1;
        const nx = -(bz - az) / L * hw, nz = (bx - ax) / L * hw;
        quads.push(ax + nx, az + nz, ax - nx, az - nz, bx + nx, bz + nz, bx - nx, bz - nz);
        owner.push(quads.length / 8 - 1);
      }
    }
    const nq = owner.length;
    this.roadCorn = new Float32Array(Math.max(1, nq) * 8);
    if (nq) this.roadCorn.set(quads);
    const by = new Map<string, number[]>();
    for (let i = 0; i < nq; i++) {
      const b = i * 8;
      const key = this.regKey((quads[b] + quads[b + 4]) / 2, (quads[b + 1] + quads[b + 5]) / 2);
      const list = by.get(key);
      if (list) list.push(i); else by.set(key, [i]);
    }
    for (const [key, ids] of by) this.roadJobs.push({ key, ids, at: 0 });
    const vMax = Math.max(4, nq * 4 + 4);
    this.rPos = new Float32Array(vMax * 3);
    this.rNor = new Float32Array(vMax * 3);
    this.rIdx = new Uint32Array(Math.max(6, nq * 6 + 6));
    const ax = this.data!.anchor[0], az = this.data!.anchor[1];
    this.rPos[0] = ax; this.rPos[1] = -40; this.rPos[2] = az;
    this.rPos[3] = ax + 0.4; this.rPos[4] = -40; this.rPos[5] = az;
    this.rPos[6] = ax; this.rPos[7] = -40; this.rPos[8] = az + 0.4;
    this.rNor[1] = 1; this.rNor[4] = 1; this.rNor[7] = 1;
    this.rIdx[0] = 0; this.rIdx[1] = 1; this.rIdx[2] = 2;
    this.rv = 3; this.ri = 3;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(this.rPos, 3));
    geo.setAttribute("normal", new BufferAttribute(this.rNor, 3));
    geo.setIndex(new BufferAttribute(this.rIdx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ color: ASPHALT, side: DoubleSide });
    mat.polygonOffset = true;
    mat.polygonOffsetFactor = -2;
    mat.polygonOffsetUnits = -4;
    const mesh = new Mesh(geo, mat);
    mesh.name = "aw:tds:roads";
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.roadMesh = mesh;
  }

  private samples(pts: Ring, step: number) {
    const out: [number, number][] = [[pts[0][0], pts[0][1]]];
    let carry = 0;
    for (let i = 1; i < pts.length; i++) {
      let ax = pts[i - 1][0], az = pts[i - 1][1], bx = pts[i][0], bz = pts[i][1];
      let dist = Math.hypot(bx - ax, bz - az);
      if (dist < 0.05) continue;
      let t = 0;
      while (carry + (1 - t) * dist >= step) {
        const need = step - carry;
        t += need / dist;
        out.push([ax + (bx - ax) * t, az + (bz - az) * t]);
        carry = 0;
      }
      carry += (1 - t) * dist;
    }
    const last = pts[pts.length - 1];
    const prev = out[out.length - 1];
    if (Math.hypot(last[0] - prev[0], last[1] - prev[1]) > 2) out.push([last[0], last[1]]);
    return out;
  }

  private pumpVillas() {
    const budget = this.low ? 4 : 10;
    let left = budget;
    for (const job of this.jobs) {
      if (job.at >= job.ids.length || !this.hasKey(job.key)) continue;
      while (job.at < job.ids.length && left > 0) {
        this.emitVilla(job.ids[job.at++]);
        left--;
      }
      if (left <= 0) break;
    }
    if (left < budget) this.uploadVillas();
  }

  private emitVilla(i: number) {
    const v = this.data!.villas[i];
    const ring = openRing(v.p);
    if (ring.length < 3) return;
    const need = ring.length * 12 + 16;
    if (this.vUsed + need >= this.vMax || this.iUsed + ring.length * 18 + 12 >= this.iMax) return;
    const ys = ring.map(([x, z]) => this.hAt(x, z));
    if (ys.some((y) => !Number.isFinite(y))) return;
    const base = Math.min(...ys) - 0.2;
    const wallH = v.s > 1 ? 6.05 : 3.15;
    const eave = Math.max(...ys) + wallH;
    const c = centroid(ring);
    const crown = eave + (v.s > 1 ? 1.65 : 1.25);
    const wall = i % 3 === 0 ? WALL2 : WALL;
    const roof = i % 5 === 0 ? ROOF2 : ROOF;
    const ccw = signedArea(ring) > 0;
    let long = 0, longLen = 0;
    for (let e = 0; e < ring.length; e++) {
      const a = ring[e], b = ring[(e + 1) % ring.length];
      const dx = b[0] - a[0], dz = b[1] - a[1];
      const len = Math.hypot(dx, dz) || 1;
      if (len > longLen) { longLen = len; long = e; }
      const nx = (ccw ? dz : -dz) / len, nz = (ccw ? -dx : dx) / len;
      const i0 = this.put(a[0], base, a[1], wall, nx, 0, nz);
      const i1 = this.put(b[0], base, b[1], wall, nx, 0, nz);
      const i2 = this.put(b[0], eave, b[1], wall, nx, 0, nz);
      const i3 = this.put(a[0], eave, a[1], wall, nx, 0, nz);
      this.quad(i0, i3, i2, i1);
      const f0 = this.put(a[0] + nx * 0.16, eave - 0.02, a[1] + nz * 0.16, roof, nx, 0, nz);
      const f1 = this.put(b[0] + nx * 0.16, eave - 0.02, b[1] + nz * 0.16, roof, nx, 0, nz);
      const f2 = this.put(b[0] + nx * 0.16, eave + 0.24, b[1] + nz * 0.16, roof, nx, 0, nz);
      const f3 = this.put(a[0] + nx * 0.16, eave + 0.24, a[1] + nz * 0.16, roof, nx, 0, nz);
      this.quad(f0, f3, f2, f1);
    }
    const a = ring[long], b = ring[(long + 1) % ring.length];
    if (longLen > 3.5) {
      const dx = (b[0] - a[0]) / longLen, dz = (b[1] - a[1]) / longLen;
      const nx = ccw ? dz : -dz, nz = ccw ? -dx : dx;
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      const ww = Math.min(1.15, longLen * 0.22), wy = eave - (v.s > 1 ? 3.3 : 1.7), wh = v.s > 1 ? 1.35 : 1.05;
      const q = [
        this.put(mx - dx * ww + nx * 0.14, wy, mz - dz * ww + nz * 0.14, GLASS, nx, 0, nz),
        this.put(mx + dx * ww + nx * 0.14, wy, mz + dz * ww + nz * 0.14, GLASS, nx, 0, nz),
        this.put(mx + dx * ww + nx * 0.14, wy + wh, mz + dz * ww + nz * 0.14, GLASS, nx, 0, nz),
        this.put(mx - dx * ww + nx * 0.14, wy + wh, mz - dz * ww + nz * 0.14, GLASS, nx, 0, nz),
      ];
      this.quad(q[0], q[1], q[2], q[3]);
    }
    const hull = hullOf(ring);
    const peak = this.put(c[0], crown, c[1], roof, 0, 1, 0);
    const rim: number[] = [];
    for (const p of hull) {
      const dx = p[0] - c[0], dz = p[1] - c[1], L = Math.hypot(dx, dz) || 1;
      rim.push(this.put(p[0] + dx / L * 0.55, eave + 0.05, p[1] + dz / L * 0.55, roof, 0, 1, 0));
    }
    for (let e = 0; e < rim.length; e++) this.tri(peak, rim[e], rim[(e + 1) % rim.length]);
  }

  private fillGate() {
    if (this.gateDone || !this.data) return;
    const g = this.data.gate;
    if (!this.hasH(g.x, g.z)) return;
    if (this.vUsed + 700 >= this.vMax || this.iUsed + 1400 >= this.iMax) { this.gateDone = true; return; }
    const yAt = (lx: number, lz: number) => {
      const [x, z] = this.loc(lx, lz);
      return this.hAt(x, z);
    };
    const span = (x0: number, x1: number) => {
      for (let x = x0; x < x1 - 0.2; x += 4.4) {
        const xA = x, xB = Math.min(x + 3.55, x1);
        this.localBox(xA, -0.28, xB, 0.28, 0, 1.45, WALL);
        this.localBox(xA - 0.05, -0.38, xA + 0.62, 0.38, 0, 1.85, STONE);
      }
      this.localBox(x1 - 0.58, -0.32, x1 + 0.05, 0.32, 0, 1.62, STONE);
    };
    span(-18, -2.7);
    span(2.7, 18);
    this.localBox(3.4, 2.3, 6.3, 4.9, 0, 2.7, WALL);
    this.hip(3.4, 2.3, 6.3, 4.9, 2.7, 1.15);
    const slitY = yAt(4.85, 2.3);
    if (Number.isFinite(slitY)) {
      const [x, z] = this.loc(4.85, 2.15);
      this.quad(
        this.put(x - 0.45, slitY + 1.15, z, GLASS, -g.sx, 0, -g.sz),
        this.put(x + 0.45, slitY + 1.15, z, GLASS, -g.sx, 0, -g.sz),
        this.put(x + 0.45, slitY + 2.15, z, GLASS, -g.sx, 0, -g.sz),
        this.put(x - 0.45, slitY + 2.15, z, GLASS, -g.sx, 0, -g.sz),
      );
    }
    this.localBox(-9.2, -3.55, -2.4, -2.85, 0, 1.72, WALL);
    this.disc(-5.8, -3.55, 1.05, 0.58);
    for (let k = 0; k < 4; k++) {
      const x0 = -14 + k * 7;
      this.groundQuad(x0, -4.2, x0 + 7, -0.55, GRAVEL, 0.1);
    }
    this.gateDone = true;
    this.uploadVillas();
  }

  private hip(x0: number, z0: number, x1: number, z1: number, wallTop: number, rise: number) {
    const gy = this.ground((x0 + x1) / 2, (z0 + z1) / 2);
    if (!Number.isFinite(gy)) return;
    const eave = gy + wallTop;
    const [cx, cz] = this.loc((x0 + x1) / 2, (z0 + z1) / 2);
    const peak = this.put(cx, eave + rise, cz, ROOF, 0, 1, 0);
    const rim = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([x, z]) => {
      const [wx, wz] = this.loc(x, z);
      return this.put(wx, eave, wz, ROOF, 0, 1, 0);
    });
    for (let i = 0; i < 4; i++) this.tri(peak, rim[i], rim[(i + 1) % 4]);
  }

  private disc(lx: number, lz: number, yOff: number, rad: number) {
    const gy = this.ground(lx, lz);
    if (!Number.isFinite(gy)) return;
    const g = this.data!.gate;
    const [cx, cz] = this.loc(lx, lz);
    const y = gy + yOff;
    const c = this.put(cx, y, cz, ROOF, -g.sx, 0, -g.sz);
    const rim: number[] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const ox = Math.cos(a) * rad, oy = Math.sin(a) * rad;
      const [x, z] = this.loc(lx + ox, lz);
      rim.push(this.put(x - g.sx * 0.06, y + oy, z - g.sz * 0.06, ROOF, -g.sx, 0, -g.sz));
    }
    for (let i = 0; i < 8; i++) this.tri(c, rim[i], rim[(i + 1) % 8]);
  }

  private localBox(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, hex: number) {
    const gy = this.ground((x0 + x1) / 2, (z0 + z1) / 2);
    if (!Number.isFinite(gy)) return;
    const base = gy + y0;
    const top = gy + y1;
    const corners: [number, number][] = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
    const world = corners.map(([x, z]) => this.loc(x, z));
    const c = centroid(world);
    for (let i = 0; i < 4; i++) {
      const a = world[i], b = world[(i + 1) % 4];
      const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1;
      let nx = dz / L, nz = -dx / L;
      const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      if ((mx - c[0]) * nx + (mz - c[1]) * nz < 0) { nx = -nx; nz = -nz; }
      const i0 = this.put(a[0], base, a[1], hex, nx, 0, nz);
      const i1 = this.put(b[0], base, b[1], hex, nx, 0, nz);
      const i2 = this.put(b[0], top, b[1], hex, nx, 0, nz);
      const i3 = this.put(a[0], top, a[1], hex, nx, 0, nz);
      this.quad(i0, i1, i2, i3);
    }
  }

  private groundQuad(x0: number, z0: number, x1: number, z1: number, hex: number, lift: number) {
    const gy = this.ground((x0 + x1) / 2, (z0 + z1) / 2);
    const y = (Number.isFinite(gy) ? gy : 0) + lift;
    const pts = [[x0, z0], [x1, z0], [x0, z1], [x1, z1]].map(([x, z]) => {
      const [wx, wz] = this.loc(x, z);
      return [wx, y, wz] as [number, number, number];
    });
    const q = pts.map(([x, y, z]) => this.put(x, y, z, hex, 0, 1, 0));
    this.quad(q[0], q[1], q[3], q[2]);
  }

  private ground(lx: number, lz: number) {
    const [x, z] = this.loc(lx, lz);
    return this.hAt(x, z);
  }

  private loc(lx: number, lz: number): [number, number] {
    const g = this.data!.gate;
    return [g.x + g.ax * lx + g.sx * lz, g.z + g.az * lx + g.sz * lz];
  }

  private pumpRoads() {
    if (!this.roadCorn) return;
    const budget = this.low ? 40 : 90;
    let left = budget;
    for (const job of this.roadJobs) {
      if (job.at >= job.ids.length || !this.hasKey(job.key)) continue;
      while (job.at < job.ids.length && left > 0) {
        this.emitRoad(job.ids[job.at++]);
        left--;
      }
      if (left <= 0) break;
    }
    if (left < budget) this.uploadRoads();
  }

  private emitRoad(qi: number) {
    const b = qi * 8;
    const c = this.roadCorn!;
    const lift = 0.16;
    const base = this.rv;
    for (let k = 0; k < 4; k++) {
      const x = c[b + k * 2], z = c[b + k * 2 + 1];
      const h = this.hAt(x, z);
      const o = (base + k) * 3;
      this.rPos[o] = x; this.rPos[o + 1] = Number.isFinite(h) ? h + lift : 0; this.rPos[o + 2] = z;
      const s = 4, dx = this.hAt(x + s, z) - this.hAt(x - s, z), dz = this.hAt(x, z + s) - this.hAt(x, z - s);
      const q = Math.hypot(dx, 8, dz) || 1;
      this.rNor[o] = -dx / q; this.rNor[o + 1] = 8 / q; this.rNor[o + 2] = -dz / q;
    }
    const ii = this.ri;
    this.rIdx[ii] = base; this.rIdx[ii + 1] = base + 1; this.rIdx[ii + 2] = base + 2;
    this.rIdx[ii + 3] = base + 2; this.rIdx[ii + 4] = base + 1; this.rIdx[ii + 5] = base + 3;
    this.rv += 4;
    this.ri += 6;
  }

  private placePlants() {
    if (this.plantsDone || !this.data) return;
    const g = this.data.gate;
    if (!this.hasH(g.x, g.z)) return;
    let palms = 0, cacti = 0;
    for (const p of this.data.plants) {
      const y = this.hAt(p.x, p.z);
      if (!Number.isFinite(y)) continue;
      if (p.k === "palm" && palms < 8) this.setInst(this.palms, palms++, p.x, y, p.z, p.yaw, p.s, -0.22);
      else if (p.k === "cactus" && cacti < 8) this.setInst(this.cacti, cacti++, p.x, y, p.z, p.yaw, p.s, 0);
    }
    this.palms.count = palms;
    this.cacti.count = cacti;
    this.palms.instanceMatrix.needsUpdate = true;
    this.cacti.instanceMatrix.needsUpdate = true;
    this.plantsDone = true;
  }

  private uploadVillas() {
    const mesh = this.villaMesh;
    if (!mesh) return;
    const g = mesh.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const col = g.getAttribute("color") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const ix = g.getIndex()!;
    pos.clearUpdateRanges(); col.clearUpdateRanges(); nor.clearUpdateRanges(); ix.clearUpdateRanges();
    pos.addUpdateRange(this.upV * 3, (this.vUsed - this.upV) * 3);
    col.addUpdateRange(this.upV * 3, (this.vUsed - this.upV) * 3);
    nor.addUpdateRange(this.upV * 3, (this.vUsed - this.upV) * 3);
    ix.addUpdateRange(this.upI, this.iUsed - this.upI);
    pos.needsUpdate = true; col.needsUpdate = true; nor.needsUpdate = true; ix.needsUpdate = true;
    g.setDrawRange(0, this.iUsed);
    g.computeBoundingSphere();
    this.upV = this.vUsed; this.upI = this.iUsed;
  }

  private uploadRoads() {
    const mesh = this.roadMesh;
    if (!mesh) return;
    const g = mesh.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const ix = g.getIndex()!;
    pos.clearUpdateRanges(); nor.clearUpdateRanges(); ix.clearUpdateRanges();
    pos.addUpdateRange(this.rUpV * 3, (this.rv - this.rUpV) * 3);
    nor.addUpdateRange(this.rUpV * 3, (this.rv - this.rUpV) * 3);
    ix.addUpdateRange(this.rUpI, this.ri - this.rUpI);
    pos.needsUpdate = true; nor.needsUpdate = true; ix.needsUpdate = true;
    g.setDrawRange(0, this.ri);
    g.computeBoundingSphere();
    this.rUpV = this.rv; this.rUpI = this.ri;
  }

  private put(x: number, y: number, z: number, hex: number, nx: number, ny: number, nz: number) {
    const i = this.vUsed++;
    const o = i * 3;
    this.pos[o] = x; this.pos[o + 1] = y; this.pos[o + 2] = z;
    const [r, g, b] = rgb(hex);
    this.col[o] = r; this.col[o + 1] = g; this.col[o + 2] = b;
    this.nor[o] = nx; this.nor[o + 1] = ny; this.nor[o + 2] = nz;
    return i;
  }

  private tri(a: number, b: number, c: number) {
    this.idx[this.iUsed++] = a; this.idx[this.iUsed++] = b; this.idx[this.iUsed++] = c;
  }

  private quad(a: number, b: number, c: number, d: number) {
    this.tri(a, b, c); this.tri(a, c, d);
  }

  private hideFootprints() {
    const hero = this.world.hero;
    if (!hero || !this.data) return;
    for (const v of this.data.villas) {
      hero.pts.push(v.h);
      const ring = v.p[0][0] === v.p[v.p.length - 1][0] && v.p[0][1] === v.p[v.p.length - 1][1] ? v.p : v.p.concat([v.p[0]]);
      hero.polys.push(ring);
    }
  }

  private fillMask() {
    const mark = (x: number, z: number) => this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
    for (const v of this.data!.villas) for (const p of v.p) mark(p[0], p[1]);
    for (const r of this.data!.roads) for (const p of r.p) mark(p[0], p[1]);
    for (const p of this.data!.plants) mark(p.x, p.z);
    const g = this.data!.gate;
    for (let lx = -18; lx <= 18; lx += 6) for (let lz = -4; lz <= 6; lz += 4) {
      const [x, z] = this.loc(lx, lz);
      mark(x, z);
    }
  }

  private hasH(x: number, z: number) {
    return this.hasKey(this.regKey(x, z));
  }

  private hasKey(key: string) {
    const r = this.world.regions.get(key);
    return !!(r && r.H);
  }

  private regKey(x: number, z: number) {
    const M = this.world.M;
    return Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
  }

  private setInst(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, s: number, lean: number) {
    this.v.set(x, y, z);
    this.q.setFromAxisAngle(this.up, yaw);
    if (lean) {
      this.leanQ.setFromAxisAngle(this.west, -lean);
      this.q.premultiply(this.leanQ);
    }
    this.scale.set(s, s, s);
    this.m.compose(this.v, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private blank(geo: BufferGeometry, mat: MeshLambertMaterial, n: number) {
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:tds:resort-inst";
    this.group.add(mesh);
    return mesh;
  }

  private paint(geo: BufferGeometry, hex: number) {
    const c = rgb(hex);
    const arr = new Float32Array(geo.attributes.position.count * 3);
    for (let i = 0; i < geo.attributes.position.count; i++) { arr[i * 3] = c[0]; arr[i * 3 + 1] = c[1]; arr[i * 3 + 2] = c[2]; }
    geo.setAttribute("color", new Float32BufferAttribute(arr, 3));
  }

  private palmGeo() {
    const parts: BufferGeometry[] = [];
    const trunk = new CylinderGeometry(0.16, 0.26, 5.2, 5);
    trunk.translate(0, 2.6, 0);
    this.paint(trunk, 0x6b4a2c);
    parts.push(trunk);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const fr = new BoxGeometry(0.18, 0.05, 2.2);
      fr.translate(0, 0, 1.0);
      fr.rotateX(0.65);
      fr.rotateY(a);
      fr.translate(0, 5.05, 0);
      this.paint(fr, i % 2 ? 0x218a3a : 0x17662c);
      parts.push(fr);
    }
    return this.merge(parts);
  }

  private cactusGeo() {
    const g = new CylinderGeometry(0.16, 0.2, 2.4, 5);
    g.translate(0, 1.2, 0);
    this.paint(g, 0x2f7a3a);
    g.computeVertexNormals();
    return g;
  }

  private merge(parts: BufferGeometry[]) {
    const pos: number[] = [], col: number[] = [], nor: number[] = [];
    for (const p of parts) {
      p.computeVertexNormals();
      const pa = p.attributes.position.array as Float32Array;
      const ca = p.attributes.color.array as Float32Array;
      const na = p.attributes.normal.array as Float32Array;
      for (let i = 0; i < pa.length; i++) { pos.push(pa[i]); col.push(ca[i]); nor.push(na[i]); }
      p.dispose();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new Float32BufferAttribute(col, 3));
    g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
    return g;
  }

  private bakeGpu() {
    const meshes = [this.palms, this.cacti];
    const prev = meshes.map((m) => m.count);
    const ax = this.data!.anchor[0], az = this.data!.anchor[1];
    for (const m of meshes) {
      if (m.count === 0) { this.setInst(m, 0, ax, -80, az, 0, 1, 0); m.count = 1; m.instanceMatrix.needsUpdate = true; }
      m.frustumCulled = false;
    }
    this.group.visible = true;
    this.group.traverse((o) => { o.frustumCulled = false; });
    try { this.g.renderer.render(this.group, this.g.camera); } catch { /* still playable if the one-shot draw fails */ }
    meshes.forEach((m, i) => { m.count = prev[i]; });
    this.group.traverse((o) => {
      const mesh = o as InstancedMesh;
      if (mesh.isMesh) mesh.frustumCulled = !mesh.isInstancedMesh;
    });
    this.group.visible = false;
  }
}
