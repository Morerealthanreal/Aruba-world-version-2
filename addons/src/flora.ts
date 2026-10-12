// More vegetation variety (round 3): bougainvillea against houses, aloe clumps near the
// kadushi/cactus scatter, sea grape along the low coastal palms. A already has coconut
// palms, divi-divi, kadushi and generic shrubs.
// Cost: one InstancedMesh per species per tile (crossed alpha-tested cards / a 40-tri
// rosette), distance-culled per instance on the CPU when the player moves, textures
// drawn once on a 256 px canvas (mipmapped). No shadows cast. Off with ?flora=0.
import { BufferGeometry, CanvasTexture, Color, DoubleSide, Float32BufferAttribute, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, SRGBColorSpace, Vector3, type Object3D } from "three";
import type { AGame } from "./env";

type Row = [number, number, number, number, number];
type Bld = { p: [number, number][]; k?: string; h?: number };
type Reg = { state: string; group?: Object3D; json?: { b?: Bld[] }; rx: number; rz: number; __awFlora?: Bucket[] };
type Bucket = { im: InstancedMesh; mats: Float32Array; cx: Float32Array; cz: Float32Array; n: number; range: number; box: [number, number, number, number] };

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

function leafTexture(kind: "boug" | "grape"): CanvasTexture {
  const S = 256, c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d")!;
  const r = rng(kind === "boug" ? 7 : 11);
  // bush silhouette: dense at the bottom-centre, ragged top
  const n = kind === "boug" ? 520 : 260;
  for (let i = 0; i < n; i++) {
    const u = r(), v = Math.pow(r(), 0.7);
    const px = S * (0.5 + (u - 0.5) * (0.35 + 0.65 * (1 - v * 0.6))), py = S * (1 - v * 0.95);
    const g = 70 + r() * 70;
    x.fillStyle = kind === "boug" ? `rgb(${30 + r() * 30},${g},${25 + r() * 25})` : `rgb(${40 + r() * 30},${g + 20},${30 + r() * 20})`;
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
  stats = { regions: 0, boug: 0, aloe: 0, grape: 0, drawn: 0 };
  private card = cardGeo();
  private aloe = aloeGeo();
  private mBoug: MeshStandardMaterial;
  private mGrape: MeshStandardMaterial;
  private mAloe: MeshStandardMaterial;
  private live = new Set<Reg>();
  private lastX = 1e9; private lastZ = 1e9;
  private mul: number;

  constructor(private g: AGame, mobile: boolean) {
    const tier = (g.real as unknown as { q: { name: string } }).q.name;
    this.mul = (tier === "low" ? 0.6 : tier === "med" ? 0.85 : 1) * (mobile ? 0.8 : 1);
    const mk = (map: CanvasTexture) => new MeshStandardMaterial({ map, alphaTest: 0.45, side: DoubleSide, roughness: 0.85, metalness: 0 });
    this.mBoug = mk(leafTexture("boug"));
    this.mGrape = mk(leafTexture("grape"));
    this.mAloe = new MeshStandardMaterial({ color: new Color(0x6f8f5a), roughness: 0.6, metalness: 0, side: DoubleSide });
    const A = g.real as unknown as { update: (...a: unknown[]) => void; regions: Map<string, Reg> };
    const orig = A.update.bind(A);
    A.update = (...a: unknown[]) => { orig(...a); this.update(A.regions, a[0] as number, a[2] as number); };
  }

  private heightAt(x: number, z: number): number {
    const A = this.g.real as unknown as { surfaceAt?: (x: number, z: number) => number; heightAt: (x: number, z: number) => number };
    return A.heightAt(x, z);
  }

  private bucket(r: Reg, geo: BufferGeometry, mat: MeshStandardMaterial, mats: number[], range: number, name: string): Bucket | null {
    const n = mats.length / 16;
    if (!n) return null;
    const im = new InstancedMesh(geo, mat, n);
    im.name = "aw:flora:" + name;
    im.frustumCulled = false; im.castShadow = false; im.receiveShadow = true; im.matrixAutoUpdate = false;
    im.count = 0; im.visible = false;
    const M = new Float32Array(mats), cx = new Float32Array(n), cz = new Float32Array(n);
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (let i = 0; i < n; i++) { cx[i] = M[i * 16 + 12]; cz[i] = M[i * 16 + 14]; x0 = Math.min(x0, cx[i]); x1 = Math.max(x1, cx[i]); z0 = Math.min(z0, cz[i]); z1 = Math.max(z1, cz[i]); }
    r.group!.add(im as unknown as Object3D);
    return { im, mats: M, cx, cz, n, range: range * Math.sqrt(this.mul), box: [x0, z0, x1, z1] };
  }

  private build(r: Reg) {
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
      if (!b.p || b.p.length < 3) continue;
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
    for (const arr of veg.lists.k || []) for (const [x, , z] of arr) {
      if (Math.floor((x - (this.M().X0)) / this.M().RS) !== r.rx || Math.floor((z - this.M().Z0) / this.M().RS) !== r.rz) continue;
      if (rnd() > 0.5 * this.mul) continue;
      const k = 1 + Math.floor(rnd() * 4);
      for (let j = 0; j < k; j++) { const a = rnd() * 6.28, d = 1.5 + rnd() * 4; const sc = 0.7 + rnd() * 0.8; push(aloe, x + Math.cos(a) * d, z + Math.sin(a) * d, sc, sc * (0.8 + rnd() * 0.5), rnd() * 6.28, 0.02); }
    }
    // sea grape near the shore: low palms (y < 3.5 m)
    for (const arr of veg.lists.p || []) for (const [x, y, z] of arr) {
      if (y > 3.5 || Math.floor((x - this.M().X0) / this.M().RS) !== r.rx || Math.floor((z - this.M().Z0) / this.M().RS) !== r.rz) continue;
      if (rnd() > 0.45 * this.mul) continue;
      const a = rnd() * 6.28, d = 3 + rnd() * 5;
      push(grape, x + Math.cos(a) * d, z + Math.sin(a) * d, 2.4 + rnd() * 1.8, 1.6 + rnd() * 1.4, rnd() * 6.28);
    }
    const out: Bucket[] = [];
    for (const b of [this.bucket(r, this.card, this.mBoug, boug, 180, "boug"), this.bucket(r, this.aloe, this.mAloe, aloe, 110, "aloe"), this.bucket(r, this.card, this.mGrape, grape, 220, "grape")]) if (b) out.push(b);
    this.stats.boug += boug.length / 16; this.stats.aloe += aloe.length / 16; this.stats.grape += grape.length / 16; this.stats.regions++;
    r.__awFlora = out;
    this.live.add(r);
  }

  private M() { return (this.g.real as unknown as { M: { X0: number; Z0: number; RS: number } }).M; }

  private cull(r: Reg, x: number, z: number) {
    for (const b of r.__awFlora || []) {
      const hi2 = b.range * b.range;
      const bx = Math.max(b.box[0] - x, 0, x - b.box[2]), bz = Math.max(b.box[1] - z, 0, z - b.box[3]);
      if (bx * bx + bz * bz >= hi2) { b.im.count = 0; b.im.visible = false; continue; }
      const dst = b.im.instanceMatrix.array as Float32Array; let c = 0;
      for (let i = 0; i < b.n; i++) { const dx = b.cx[i] - x, dz = b.cz[i] - z; if (dx * dx + dz * dz < hi2) { dst.set(b.mats.subarray(i * 16, i * 16 + 16), c * 16); c++; } }
      b.im.count = c; b.im.visible = c > 0;
      if (c) { b.im.instanceMatrix.clearUpdateRanges(); b.im.instanceMatrix.addUpdateRange(0, c * 16); b.im.instanceMatrix.needsUpdate = true; }
    }
  }

  update(regions: Map<string, Reg>, x: number, z: number) {
    for (const r of regions.values()) if (!r.__awFlora && r.state === "built" && r.group && r.json) { this.build(r); this.lastX = 1e9; break; }
    if (this.live.size > regions.size) { const cur = new Set(regions.values()); for (const r of this.live) if (!cur.has(r)) { for (const b of r.__awFlora || []) b.im.dispose(); this.live.delete(r); } }
    if ((x - this.lastX) ** 2 + (z - this.lastZ) ** 2 < 36) return;
    this.lastX = x; this.lastZ = z;
    let drawn = 0;
    for (const r of this.live) { this.cull(r, x, z); for (const b of r.__awFlora || []) drawn += b.im.count; }
    this.stats.drawn = drawn;
  }
}
