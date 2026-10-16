// More vegetation variety (round 3): bougainvillea against houses, aloe clumps near the
// kadushi/cactus scatter, sea grape along the low coastal palms. A already has coconut
// palms, divi-divi, kadushi and generic shrubs.
// Cost: one InstancedMesh per species per tile (crossed alpha-tested cards / a 40-tri
// rosette), distance-culled per instance on the CPU when the player moves, textures
// drawn once on a 256 px canvas (mipmapped). No shadows cast. Off with ?flora=0.
import { BoxGeometry, InstancedBufferAttribute, BufferGeometry, CanvasTexture, Color, DoubleSide, Float32BufferAttribute, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, SRGBColorSpace, Vector3, type Object3D } from "three";
import type { AGame } from "./env";
import { Pool } from "./instPool";

type Row = [number, number, number, number, number];
type Bld = { p: [number, number][]; k?: string; h?: number };
type Reg = { state: string; group?: Object3D; json?: { b?: Bld[] }; rx: number; rz: number; __awFlora?: Bucket[] };
type Bucket = { im: InstancedMesh | null; pool?: Pool; cols?: Float32Array; mats: Float32Array; cx: Float32Array; cz: Float32Array; n: number; range: number; box: [number, number, number, number] };

function rng(seed: number) { let s = (seed * 2654435761) >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function cardGeo(): BufferGeometry {
  // 3 vertical cards at 0/60/120 degrees, base at y=0, 1x1
  const pos: number[] = [], uv: number[] = [], nor: number[] = [], idx: number[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI) / 3, c = Math.cos(a) * 0.5, s = Math.sin(a) * 0.5, b = pos.length / 3;
    pos.push(-c, 0, -s, c, 0, s, c, 1, s, -c, 1, -s);
    uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    for (let k = 0; k < 4; k++) nor.push(0, 1, 0); // up-facing normals: soft, even foliage lighting
    idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

function aloeGeo(): BufferGeometry {
  // rosette of 10 tapered blades leaning outward
  const pos: number[] = [], nor: number[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + (i % 2) * 0.3, lean = 0.55 + (i % 3) * 0.15, len = 0.55 + (i % 4) * 0.08;
    const dx = Math.cos(a), dz = Math.sin(a), px = -dz * 0.05, pz = dx * 0.05;
    const tip = [dx * Math.sin(lean) * len, Math.cos(lean) * len, dz * Math.sin(lean) * len];
    pos.push(px, 0, pz, -px, 0, -pz, tip[0], tip[1], tip[2]);
    pos.push(-px, 0, -pz, px, 0, pz, tip[0], tip[1], tip[2]);
    for (let k = 0; k < 6; k++) nor.push(dx * 0.5, 0.8, dz * 0.5);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
  return g;
}

function leafTexture(kind: "boug" | "grape" | "scrub"): CanvasTexture {
  const S = 256, c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d")!;
  const r = rng(kind === "boug" ? 7 : 11);
  // bush silhouette: dense at the bottom-centre, ragged top
  if (kind === "scrub") {
    // dry desert scrub (wayaka/watapana-like): twiggy, olive-grey, sparse leaves
    x.lineCap = "round";
    for (let i = 0; i < 60; i++) {
      const bx = S * (0.35 + r() * 0.3), a = -Math.PI / 2 + (r() - 0.5) * 2.2, l = S * (0.25 + r() * 0.6);
      x.strokeStyle = `rgb(${80 + r() * 30},${70 + r() * 25},${55 + r() * 20})`; x.lineWidth = 1.5 + r() * 2;
      x.beginPath(); x.moveTo(bx, S); x.lineTo(bx + Math.cos(a) * l, S + Math.sin(a) * l); x.stroke();
    }
    for (let i = 0; i < 700; i++) {
      const u = r(), v = 0.15 + Math.pow(r(), 0.8) * 0.8;
      const px = S * (0.5 + (u - 0.5) * (0.5 + 0.5 * v)), py = S * (1 - v * 0.95);
      const g = 85 + r() * 50;
      x.fillStyle = `rgb(${g * 0.78 + r() * 20},${g},${g * 0.55})`;
      x.beginPath(); x.ellipse(px, py, 2.5 + r() * 3, 1.6 + r() * 2, r() * Math.PI, 0, Math.PI * 2); x.fill();
    }
    const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 2; return t;
  }
  const n = kind === "boug" ? 520 : 260;
  for (let i = 0; i < n; i++) {
    const u = r(), v = Math.pow(r(), 0.7);
    const sp = kind === "grape" ? 0.62 * Math.sqrt(Math.max(0, 1 - Math.pow(v * 1.05 - 0.45, 2) * 3.2)) : 0.35 + 0.65 * (1 - v * 0.6);
    const px = S * (0.5 + (u - 0.5) * sp), py = S * (1 - v * 0.95);
    const g = 70 + r() * 70;
    x.fillStyle = kind === "boug" ? `rgb(${30 + r() * 30},${g},${25 + r() * 25})` : (r() < 0.12 ? `rgb(${150 + r() * 40},${90 + r() * 30},${40})` : `rgb(${90 + r() * 40},${g + 60},${45 + r() * 25})`);
    x.beginPath();
    const w = kind === "boug" ? 5 + r() * 6 : 9 + r() * 9; // sea grape: big round leaves
    x.ellipse(px, py, w, w * (kind === "boug" ? 0.6 : 0.85), r() * Math.PI, 0, Math.PI * 2);
    x.fill();
  }
  if (kind === "boug") {
    // magenta / fuchsia bract clusters, heavier on top
    for (let i = 0; i < 260; i++) {
      const u = r(), v = 0.25 + Math.pow(r(), 0.6) * 0.72;
      const px = S * (0.5 + (u - 0.5) * (0.3 + 0.6 * (1 - v * 0.5))), py = S * (1 - v * 0.95);
      const hue = r() < 0.8 ? 318 + r() * 20 : 20 + r() * 15; // mostly magenta, a few orange
      x.fillStyle = `hsl(${hue},${75 + r() * 20}%,${45 + r() * 15}%)`;
      x.beginPath(); x.arc(px, py, 3 + r() * 5, 0, Math.PI * 2); x.fill();
    }
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 2;
  return t;
}

export class Flora {
  stats = { skipped: 0, regions: 0, boug: 0, aloe: 0, grape: 0, scrub: 0, ac: 0, awn: 0, drawn: 0 };
  private card = cardGeo();
  private aloe = aloeGeo();
  private mBoug: MeshStandardMaterial;
  private mGrape: MeshStandardMaterial;
  private mAloe: MeshStandardMaterial;
  private mScrub: MeshStandardMaterial;
  private mAC = new MeshStandardMaterial({ color: 0xe9e7e1, roughness: 0.55, metalness: 0.15 });
  private mAwn = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0 });
  private acGeo = (() => { const b = new BoxGeometry(0.85, 0.55, 0.42); b.clearGroups(); b.translate(0, 0, 0.21); return b; })();
  private awnGeo = (() => { const b = new BoxGeometry(1, 0.06, 1); b.clearGroups(); b.translate(0, 0, 0.5); return b; })();
  private live = new Set<Reg>();
  private gen: Generator<void, void, void> | null = null; private genR: Reg | null = null; private budget = 2;
  private lastX = 1e9; private lastZ = 1e9;
  private mul: number;
  // r192: one InstancedMesh per species for all regions (instPool.ts), ?ipool=0 for one per region
  private pools: Map<string, { pool: Pool; range: number }> | null = null;

  constructor(private g: AGame, mobile: boolean, pooled = false) {
    if (pooled) this.pools = new Map();
    const tier = (g.real as unknown as { q: { name: string } }).q.name;
    this.mul = (tier === "low" ? 0.6 : tier === "med" ? 0.85 : (g.real as unknown as { q: { id?: string } }).q.id === "desktop" ? 1.4 : 1) * (mobile ? 0.8 : 1);
    const mk = (map: CanvasTexture) => new MeshStandardMaterial({ map, alphaTest: 0.45, side: DoubleSide, roughness: 0.85, metalness: 0 });
    this.mBoug = mk(leafTexture("boug"));
    this.mGrape = mk(leafTexture("grape"));
    this.mScrub = mk(leafTexture("scrub"));
    this.mAloe = new MeshStandardMaterial({ color: new Color(0x6f8f5a), roughness: 0.6, metalness: 0, side: DoubleSide });
    const A = g.real as unknown as { update: (...a: unknown[]) => void; regions: Map<string, Reg> };
    const orig = A.update.bind(A);
    A.update = (...a: unknown[]) => { orig(...a); this.update(A.regions, a[0] as number, a[2] as number); };
  }

  private heightAt(x: number, z: number): number {
    const A = this.g.real as unknown as { surfaceAt?: (x: number, z: number) => number; heightAt: (x: number, z: number) => number };
    return A.heightAt(x, z);
  }

  private bucket(r: Reg, geo: BufferGeometry, mat: MeshStandardMaterial, mats: number[], range: number, name: string, cols?: number[]): Bucket | null {
    const n = mats.length / 16;
    if (!n) return null;
    if (this.pools) {
      const M = new Float32Array(mats), cx = new Float32Array(n), cz = new Float32Array(n);
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
      for (let i = 0; i < n; i++) { cx[i] = M[i * 16 + 12]; cz[i] = M[i * 16 + 14]; x0 = Math.min(x0, cx[i]); x1 = Math.max(x1, cx[i]); z0 = Math.min(z0, cz[i]); z1 = Math.max(z1, cz[i]); }
      let e = this.pools.get(name);
      if (!e) this.pools.set(name, (e = { pool: new Pool(geo, mat, { name: "aw:flora:" + name, castShadow: false, receiveShadow: true, colored: !!cols }, (this.g.real as unknown as { group: Object3D }).group), range: range * Math.sqrt(this.mul) }));
      const b: Bucket = { im: null, pool: e.pool, cols: cols ? new Float32Array(cols) : undefined, mats: M, cx, cz, n, range: e.range, box: [x0, z0, x1, z1] };
      e.pool.add(b);
      return b;
    }
    const im = new InstancedMesh(geo, mat, n);
    im.name = "aw:flora:" + name;
    im.frustumCulled = false; im.castShadow = false; im.receiveShadow = true; im.matrixAutoUpdate = false;
    im.count = 0; im.visible = false;
    const M = new Float32Array(mats), cx = new Float32Array(n), cz = new Float32Array(n);
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (let i = 0; i < n; i++) { cx[i] = M[i * 16 + 12]; cz[i] = M[i * 16 + 14]; x0 = Math.min(x0, cx[i]); x1 = Math.max(x1, cx[i]); z0 = Math.min(z0, cz[i]); z1 = Math.max(z1, cz[i]); }
    let C: Float32Array | undefined;
    if (cols) { C = new Float32Array(cols); im.instanceColor = new InstancedBufferAttribute(new Float32Array(n * 3), 3); }
    r.group!.add(im as unknown as Object3D);
    return { im, cols: C, mats: M, cx, cz, n, range: range * Math.sqrt(this.mul), box: [x0, z0, x1, z1] };
  }

  private *build(r: Reg): Generator<void, void, void> {
    let step = 0;
    const veg = (this.g.real as unknown as { veg: { lists: Record<string, Row[][]> } }).veg;
    const rnd = rng(r.rx * 7919 + r.rz * 104729 + 13);
    const m = new Matrix4(), q = new Quaternion(), s = new Vector3(), p = new Vector3(), Y = new Vector3(0, 1, 0);
    const push = (arr: number[], x: number, z: number, sx: number, sy: number, yaw: number, sink = 0.05) => {
      q.setFromAxisAngle(Y, yaw); p.set(x, this.heightAt(x, z) - sink, z); s.set(sx, sy, sx);
      m.compose(p, q, s); for (const v of m.elements) arr.push(v);
    };
    const boug: number[] = [], aloe: number[] = [], grape: number[] = [];
    // bougainvillea: ~1 in 3 houses, against one wall, 1-3 bushes
    for (const b of r.json?.b || []) {
      if ((++step & 31) === 0) yield;
      if (!b.p || b.p.length < 3 || this.hidden(b)) continue;
      const res = b.k === "house" || b.k === "res" || b.k === "apt";
      if (rnd() > (res ? 0.38 : 0.08) * this.mul) continue;
      // centroid + a random edge, pushed 0.8 m outwards
      let cx = 0, cz = 0; for (const [x, z] of b.p) { cx += x; cz += z; } cx /= b.p.length; cz /= b.p.length;
      const i = Math.floor(rnd() * b.p.length), [ax, az] = b.p[i], [bx, bz] = b.p[(i + 1) % b.p.length];
      const ex = bx - ax, ez = bz - az, L = Math.hypot(ex, ez); if (L < 2.5) continue;
      let nx = -ez / L, nz = ex / L; const mx = (ax + bx) / 2, mz = (az + bz) / 2;
      if ((mx - cx) * nx + (mz - cz) * nz < 0) { nx = -nx; nz = -nz; }
      const k = 1 + Math.floor(rnd() * 3);
      for (let j = 0; j < k; j++) {
        const t = 0.2 + rnd() * 0.6, x = ax + ex * t + nx * 0.8, z = az + ez * t + nz * 0.8;
        push(boug, x, z, 1.5 + rnd() * 1.2, 1.4 + rnd() * 1.4, rnd() * 6.28);
      }
    }
    // aloe clumps around kadushi / cacti
    for (const [x, , z] of this.vegFor(r, "k")) {
      if ((++step & 255) === 0) yield;
      if (Math.floor((x - (this.M().X0)) / this.M().RS) !== r.rx || Math.floor((z - this.M().Z0) / this.M().RS) !== r.rz) continue;
      if (rnd() > 0.5 * this.mul) continue;
      const k = 1 + Math.floor(rnd() * 4);
      for (let j = 0; j < k; j++) { const a = rnd() * 6.28, d = 1.5 + rnd() * 4; const sc = 0.7 + rnd() * 0.8; push(aloe, x + Math.cos(a) * d, z + Math.sin(a) * d, sc, sc * (0.8 + rnd() * 0.5), rnd() * 6.28, 0.02); }
    }
    // sea grape near the shore: low palms (y < 3.5 m)
    for (const [x, y, z] of this.vegFor(r, "p")) {
      if ((++step & 255) === 0) yield;
      if (y > 3.5 || Math.floor((x - this.M().X0) / this.M().RS) !== r.rx || Math.floor((z - this.M().Z0) / this.M().RS) !== r.rz) continue;
      if (rnd() > 0.45 * this.mul) continue;
      const a = rnd() * 6.28, d = 3 + rnd() * 5;
      push(grape, x + Math.cos(a) * d, z + Math.sin(a) * d, 2.4 + rnd() * 1.8, 1.6 + rnd() * 1.4, rnd() * 6.28);
    }
    // facade props: wall AC units (houses + shops), striped-colour awnings over shop fronts
    const ac: number[] = [], awn: number[] = [], awnC: number[] = [];
    const pal = [0x1f7a8c, 0xd94f30, 0xf2b134, 0x2e8b57, 0x7a3e9d, 0xe86a92, 0x2b59c3, 0xf4f1e8];
    const col = new Color(), qp = new Quaternion(), X = new Vector3(1, 0, 0);
    const wallPush = (arr: number[], x: number, z: number, y: number, yaw: number, sx: number, sy: number, sz: number, pitch = 0) => {
      q.setFromAxisAngle(Y, yaw); if (pitch) q.multiply(qp.setFromAxisAngle(X, pitch));
      p.set(x, y, z); s.set(sx, sy, sz); m.compose(p, q, s); for (const v of m.elements) arr.push(v);
    };
    for (const b of r.json?.b || []) {
      if ((++step & 31) === 0) yield;
      if (!b.p || b.p.length < 3 || this.hidden(b)) continue;
      const com = b.k === "com" || b.k === "shop" || b.k === "retail";
      const res = b.k === "house" || b.k === "res" || b.k === "apt";
      if (!com && !res) continue;
      let cx = 0, cz = 0; for (const [x, z] of b.p) { cx += x; cz += z; } cx /= b.p.length; cz /= b.p.length;
      const h = b.h || 4;
      const nE = Math.min(b.p.length, 6);
      for (let e = 0; e < nE; e++) {
        const [ax, az] = b.p[e], [bx, bz] = b.p[(e + 1) % b.p.length];
        const ex = bx - ax, ez = bz - az, L = Math.hypot(ex, ez); if (L < 3) continue;
        let nx = -ez / L, nz = ex / L; const mx = (ax + bx) / 2, mz = (az + bz) / 2;
        if ((mx - cx) * nx + (mz - cz) * nz < 0) { nx = -nx; nz = -nz; }
        const yaw = Math.atan2(nx, nz);
        if (rnd() < (com ? 0.45 : 0.28) * this.mul) {
          const t = 0.15 + rnd() * 0.7, x = ax + ex * t + nx * 0.03, z = az + ez * t + nz * 0.03;
          const gy = this.heightAt(x, z), fl = h > 6 && rnd() < 0.5 ? 3 + Math.floor(rnd() * Math.max(1, (h - 4) / 3)) * 3 : 0;
          wallPush(ac, x, z, gy + Math.min(h - 0.8, 2.3 + fl), yaw, 1, 1, 1);
        }
        if (com && L > 4 && rnd() < 0.5 * this.mul) {
          const w = Math.min(L * 0.8, 3 + rnd() * 6), t = 0.5, x = ax + ex * t + nx * 0.02, z = az + ez * t + nz * 0.02;
          wallPush(awn, x, z, this.heightAt(x, z) + Math.min(h - 0.4, 2.9), yaw, w, 1, 1.1 + rnd() * 0.5, 0.32);
          col.setHex(pal[Math.floor(rnd() * pal.length)]).convertSRGBToLinear(); awnC.push(col.r, col.g, col.b);
        }
      }
    }
    // dry scrub thickets around the kadushi scatter: fills the open cunucu/desert
    const scrub: number[] = [];
    for (const [x, , z] of this.vegFor(r, "k")) {
      if ((++step & 255) === 0) yield;
      if (Math.floor((x - this.M().X0) / this.M().RS) !== r.rx || Math.floor((z - this.M().Z0) / this.M().RS) !== r.rz) continue;
      if (rnd() > 0.7 * this.mul) continue;
      const k = 1 + Math.floor(rnd() * 3);
      for (let j = 0; j < k; j++) { const a = rnd() * 6.28, d = 2 + rnd() * 7; push(scrub, x + Math.cos(a) * d, z + Math.sin(a) * d, 1.8 + rnd() * 2.2, 1.1 + rnd() * 1.4, rnd() * 6.28); }
    }
    this.stats.scrub += scrub.length / 16; this.stats.ac += ac.length / 16; this.stats.awn += awn.length / 16;
    const out: Bucket[] = [];
    for (const b of [this.bucket(r, this.card, this.mBoug, boug, 180, "boug"), this.bucket(r, this.aloe, this.mAloe, aloe, 110, "aloe"), this.bucket(r, this.card, this.mGrape, grape, 220, "grape"), this.bucket(r, this.card, this.mScrub, scrub, 320, "scrub"), this.bucket(r, this.acGeo, this.mAC, ac, 140, "ac"), this.bucket(r, this.awnGeo, this.mAwn, awn, 260, "awn", awnC)]) if (b) out.push(b);
    this.stats.boug += boug.length / 16; this.stats.aloe += aloe.length / 16; this.stats.grape += grape.length / 16; this.stats.regions++;
    r.__awFlora = out;
    this.live.add(r);
  }

  /** same skip rule A's building builder uses: monument exclusions + hero (landmark) footprints */
  private hidden(b: Bld): boolean {
    const w = this.g.real as unknown as { mon?: { excluded?(x: number, z: number, b: Bld): boolean }; hero?: { pts: unknown[]; polys: unknown[]; hides(p: [number, number][]): boolean } };
    let cx = 0, cz = 0; for (const [x, z] of b.p) { cx += x; cz += z; } cx /= b.p.length; cz /= b.p.length;
    // any landmark model nearby (models can overhang the OSM footprint, or not hide it at all):
    // skip if the centroid is within 6 m of a hero footprint bbox, or 30 m of a footprint-less hero
    for (const bb of this.heroBoxes()) if (cx > bb[0] && cx < bb[2] && cz > bb[1] && cz < bb[3]) { this.stats.skipped++; return true; }
    try {
      if (w.mon && w.mon.excluded && w.mon.excluded(cx, cz, b)) { this.stats.skipped++; return true; }
      if (w.hero && (w.hero.pts.length || w.hero.polys.length) && this.nearHero(cx, cz) && w.hero.hides(b.p)) { this.stats.skipped++; return true; }
    } catch { /* keep props if the check fails */ }
    return false;
  }

  private vegIdx: Map<string, Record<string, Row[]>> | null = null; private vegSig = "";
  private vegFor(r: Reg, kind: "k" | "p"): Row[] {
    const lists = (this.g.real as unknown as { veg: { lists: Record<string, Row[][]> } }).veg.lists;
    const sig = (lists.k || []).length + ":" + (lists.p || []).length + ":" + (lists.k || []).reduce((a, x) => a + x.length, 0) + ":" + (lists.p || []).reduce((a, x) => a + x.length, 0);
    if (!this.vegIdx || sig !== this.vegSig) {
      this.vegSig = sig; this.vegIdx = new Map();
      const M = this.M();
      for (const kk of ["k", "p"]) for (const arr of lists[kk] || []) for (const row of arr) {
        const key = Math.floor((row[0] - M.X0) / M.RS) + "," + Math.floor((row[2] - M.Z0) / M.RS);
        let e = this.vegIdx.get(key); if (!e) this.vegIdx.set(key, (e = { k: [], p: [] })); e[kk].push(row);
      }
    }
    const e = this.vegIdx.get(r.rx + "," + r.rz); return e ? e[kind] : [];
  }
  private hb: number[][] | null = null; private hbN = -1;
  private heroBoxes(): number[][] {
    const h = (this.g.real as unknown as { hero?: { list?: Array<{ x: number; z: number; foot?: [number, number][] | null; hero?: { hide_footprint?: unknown } }> } }).hero;
    const L = (h && h.list) || [];
    if (this.hb && this.hbN === L.length) return this.hb;
    this.hb = []; this.hbN = L.length;
    for (const n of L) {
      const f = (n.foot || (Array.isArray(n.hero?.hide_footprint) ? n.hero!.hide_footprint : null)) as [number, number][] | null;
      if (f && f.length > 2) { let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9; for (const [x, z] of f) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); } this.hb.push([x0 - 6, z0 - 6, x1 + 6, z1 + 6]); }
      else if (Number.isFinite(n.x)) this.hb.push([n.x - 30, n.z - 30, n.x + 30, n.z + 30]);
    }
    return this.hb;
  }

  private nearHero(x: number, z: number): boolean {
    for (const bb of this.heroBoxes()) if (x > bb[0] - 60 && x < bb[2] + 60 && z > bb[1] - 60 && z < bb[3] + 60) return true;
    return false;
  }

  private M() { return (this.g.real as unknown as { M: { X0: number; Z0: number; RS: number } }).M; }

  private cull(r: Reg, x: number, z: number) {
    for (const b of r.__awFlora || []) {
      if (!b.im) continue;
      const hi2 = b.range * b.range;
      const bx = Math.max(b.box[0] - x, 0, x - b.box[2]), bz = Math.max(b.box[1] - z, 0, z - b.box[3]);
      if (bx * bx + bz * bz >= hi2) { b.im.count = 0; b.im.visible = false; continue; }
      const dst = b.im.instanceMatrix.array as Float32Array; let c = 0;
      for (let i = 0; i < b.n; i++) { const dx = b.cx[i] - x, dz = b.cz[i] - z; if (dx * dx + dz * dz < hi2) { const s = i * 16, t = c * 16; for (let k = 0; k < 16; k++) dst[t + k] = b.mats[s + k]; if (b.cols) { const dc = b.im.instanceColor!.array as Float32Array; dc[c * 3] = b.cols[i * 3]; dc[c * 3 + 1] = b.cols[i * 3 + 1]; dc[c * 3 + 2] = b.cols[i * 3 + 2]; } c++; } }
      b.im.count = c; b.im.visible = c > 0;
      if (c) { b.im.instanceMatrix.clearUpdateRanges(); b.im.instanceMatrix.addUpdateRange(0, c * 16); b.im.instanceMatrix.needsUpdate = true; if (b.cols) b.im.instanceColor!.needsUpdate = true; }
    }
  }

  update(regions: Map<string, Reg>, x: number, z: number) {
    const t0 = performance.now();
    // genR is the only strong reference to a region once A has unloaded it. Drop it when the
    // build finishes or the group leaves the world, or that region's meshes stay in the heap.
    if (this.genR && (this.genR.state !== "built" || !this.genR.group || !this.genR.group.parent)) { this.gen = null; this.genR = null; }
    if (!this.gen) for (const r of regions.values()) if (!r.__awFlora && r.state === "built" && r.group && r.json) { this.gen = this.build(r); this.genR = r; break; }
    while (this.gen && performance.now() - t0 < this.budget) {
      if (this.genR && (this.genR.state !== "built" || !this.genR.group || !this.genR.group.parent)) { this.gen = null; this.genR = null; break; }
      if (this.gen.next().done) { this.gen = null; this.genR = null; this.lastX = 1e9; }
    }
    for (const r of this.live) if (!r.group || !r.group.parent) { // region disposed by A
      for (const b of r.__awFlora || []) { if (b.im) b.im.dispose(); if (b.pool) b.pool.remove(b); }
      this.live.delete(r); this.lastX = 1e9;
    }
    if ((x - this.lastX) ** 2 + (z - this.lastZ) ** 2 < 36) return;
    this.lastX = x; this.lastZ = z;
    let drawn = 0;
    if (this.pools) { for (const e of this.pools.values()) drawn += e.pool.fill(x, z, -1, e.range); this.stats.drawn = drawn; return; }
    for (const r of this.live) { this.cull(r, x, z); for (const b of r.__awFlora || []) drawn += b.im ? b.im.count : 0; }
    this.stats.drawn = drawn;
  }
}
