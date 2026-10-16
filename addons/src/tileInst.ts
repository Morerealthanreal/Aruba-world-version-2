// Tile instance consolidation (perf round 2).
// A builds one InstancedMesh per building kit set / parked-car lot / prop group: on HIGH
// ~23k kit + ~37k parked + ~3k props InstancedMesh objects (465k kit instances), each
// visited by updateMatrixWorld, the renderer's scene walk and A's 0.5 s cull pass, and
// each visible one is its own draw call (~350 parked draws on HIGH).
// Here, once a region is built, all of those are folded into ONE InstancedMesh per
// (kind, geometry, material) per region ("aw:inst:*", names A's cull pass ignores), and the
// per-lot distance rules A applied (kitR, parkHi/parkR, detailR/2) are applied per
// instance instead: the visible instances are compacted into the front of the buffer,
// one region per frame (round robin), only when the player moved > 4 m.
// Folding a region is sliced (the graph walk, then whole instance groups, ~3 ms per frame); each group's originals are
// removed in the same frame its bucket goes live.
// r192: with pools (instPool.ts, default on, ?ipool=0 off) the buckets of every region that share a
// (kind, geometry, material) draw from one InstancedMesh instead of one per region.
import { InstancedBufferAttribute, InstancedMesh, Matrix4, type BufferGeometry, type Material, type Object3D } from "three";
import { Pool, touchRange } from "./instPool";

type IM = Object3D & { isInstancedMesh: true; count: number; geometry: BufferGeometry; material: Material; instanceMatrix: { array: Float32Array }; instanceColor: { array: Float32Array } | null };
type Q = Record<string, unknown>;
type Bucket = { kind: string; im: InstancedMesh | null; pool?: Pool; mats: Float32Array; cols: Float32Array | null; cx: Float32Array; cz: Float32Array; n: number; box: [number, number, number, number] };
type Reg = { state: string; group?: Object3D; __awInst?: Bucket[] };

const KINDS = new Set(["bld:kit", "parked", "parkedHi", "props"]);

export class TileInstances {
  folded = 0; // original InstancedMesh objects removed
  buckets = 0;
  private lastX = 1e9; private lastZ = 1e9;
  private dirty = new Set<Reg>();
  private pools = new Map<string, Pool>();
  private dirtyPools = new Set<Pool>();
  constructor(private q: Q, private poolParent: Object3D | null = null) {}

  private job: { r: Reg; stack: Object3D[]; groups: Map<string, IM[]>; seen: Set<Object3D>; lists: IM[][] | null; i: number; out: Bucket[] } | null = null;
  /** Fold one built region: walk its graph, then a few instance groups per call, within `budget` ms. Returns true when the region is done. */
  fold(r: Reg, budget = 1e9): boolean {
    if (r.__awInst || r.state !== "built" || !r.group) return false;
    let j = this.job;
    if (!j || j.r !== r) j = this.job = { r, stack: [r.group], groups: new Map(), seen: new Set(), lists: null, i: 0, out: [] };
    const t0 = performance.now();
    if (!j.lists) {
      if (!this.gather(j, t0, budget)) return false;
      j.lists = [...j.groups.values()].filter((l) => l.length >= 2);
    }
    while (j.i < j.lists.length) {
      this.foldList(r, j.lists[j.i++], j.out);
      if (performance.now() - t0 > budget) break;
    }
    if (j.i < j.lists.length) return false;
    this.job = null;
    r.__awInst = j.out;
    if (!this.poolParent) this.dirty.add(r);
    return true;
  }
  /** pre-order walk (traverse's order) of the region graph in budgeted steps; true when complete */
  private gather(j: NonNullable<TileInstances["job"]>, t0: number, budget: number) {
    const st = j.stack;
    for (let n = 1; st.length; n++) {
      const o = st.pop()!, ch = o.children;
      for (let k = ch.length - 1; k >= 0; k--) st.push(ch[k]);
      const m = o as IM;
      if (m.isInstancedMesh && KINDS.has(m.name) && !Array.isArray(m.material) && m.count !== 0) {
        const p = m.parent;
        if (p && !j.seen.has(p)) { p.updateWorldMatrix(true, false); j.seen.add(p); }
        m.updateWorldMatrix(false, false);
        const key = m.name + "|" + m.geometry.uuid + "|" + m.material.uuid + "|" + m.castShadow + "|" + m.receiveShadow + "|" + (m.instanceColor ? 1 : 0);
        let l = j.groups.get(key);
        if (!l) j.groups.set(key, (l = []));
        l.push(m);
      }
      if ((n & 127) === 0 && performance.now() - t0 > budget) return false;
    }
    return true;
  }
  private foldList(r: Reg, list: IM[], out: Bucket[]) {
    const mw = new Matrix4(), mi = new Matrix4();
    {
      if (list.some((m) => !m.parent)) return;
      let n = 0;
      for (const m of list) n += m.count;
      const mats = new Float32Array(n * 16), cx = new Float32Array(n), cz = new Float32Array(n);
      const cols = list[0].instanceColor ? new Float32Array(n * 3) : null;
      let k = 0;
      for (const m of list) {
        for (let i = 0; i < m.count; i++, k++) {
          mi.fromArray(m.instanceMatrix.array, i * 16);
          mw.multiplyMatrices(m.matrixWorld, mi);
          mw.toArray(mats, k * 16);
          cx[k] = mats[k * 16 + 12]; cz[k] = mats[k * 16 + 14];
          if (cols && m.instanceColor) for (let c = 0; c < 3; c++) cols[k * 3 + c] = m.instanceColor.array[i * 3 + c];
        }
      }
      const f = list[0];
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
      for (let i = 0; i < n; i++) { x0 = Math.min(x0, cx[i]); x1 = Math.max(x1, cx[i]); z0 = Math.min(z0, cz[i]); z1 = Math.max(z1, cz[i]); }
      if (this.poolParent) {
        const key = f.name + "|" + f.geometry.uuid + "|" + f.material.uuid + "|" + f.castShadow + "|" + f.receiveShadow + "|" + (cols ? 1 : 0);
        let pool = this.pools.get(key);
        if (!pool) this.pools.set(key, (pool = new Pool(f.geometry, f.material, { name: "aw:inst:" + f.name, castShadow: f.castShadow, receiveShadow: f.receiveShadow, colored: !!cols }, this.poolParent)));
        const b: Bucket = { kind: f.name, im: null, pool, mats, cols, cx, cz, n, box: [x0, z0, x1, z1] };
        pool.add(b); this.dirtyPools.add(pool);
        for (const m of list) { m.parent?.remove(m); this.folded++; }
        out.push(b); this.buckets++;
        return;
      }
      const im = new InstancedMesh(f.geometry, f.material, n);
      im.name = "aw:inst:" + f.name;
      im.castShadow = f.castShadow; im.receiveShadow = f.receiveShadow;
      im.frustumCulled = false; // instances are distance-culled below; the set is small and near the player
      im.matrixAutoUpdate = false;
      im.count = 0;
      im.visible = false;
      if (cols) im.instanceColor = new InstancedBufferAttribute(new Float32Array(n * 3), 3);
      r.group!.add(im as unknown as Object3D);
      for (const m of list) { m.parent?.remove(m); this.folded++; }
      out.push({ kind: f.name, im, mats, cols, cx, cz, n, box: [x0, z0, x1, z1] });
      this.buckets++;
    }
  }

  private range(kind: string): [number, number] {
    const q = this.q;
    const contact = (q.contactR as number) || 220, hi = (q.parkHi as number) || 35;
    if (kind === "bld:kit") return [-1, (q.kitR as number) || 0];
    if (kind === "parked") return [hi, (q.parkR as number) || contact];
    if (kind === "parkedHi") return [-1, hi];
    return [-1, ((q.detailR as number) || 150) * 0.5];
  }

  private cull(r: Reg, x: number, z: number) {
    for (const b of r.__awInst || []) {
      if (!b.im) continue;
      const [lo, hi] = this.range(b.kind);
      const lo2 = lo < 0 ? -1 : lo * lo, hi2 = (hi + 3) * (hi + 3);
      const bx = Math.max(b.box[0] - x, 0, x - b.box[2]), bz = Math.max(b.box[1] - z, 0, z - b.box[3]);
      if (bx * bx + bz * bz >= hi2) { if (b.im.count) { b.im.count = 0; b.im.visible = false; } continue; }
      const dst = b.im.instanceMatrix.array as Float32Array;
      const dc = b.im.instanceColor ? (b.im.instanceColor.array as Float32Array) : null;
      let c = 0;
      for (let i = 0; i < b.n; i++) {
        const dx = b.cx[i] - x, dz = b.cz[i] - z, d = dx * dx + dz * dz;
        if (d >= hi2 || d < lo2) continue;
        const s = i * 16, t = c * 16; for (let k = 0; k < 16; k++) dst[t + k] = b.mats[s + k];
        if (dc && b.cols) { dc[c * 3] = b.cols[i * 3]; dc[c * 3 + 1] = b.cols[i * 3 + 1]; dc[c * 3 + 2] = b.cols[i * 3 + 2]; }
        c++;
      }
      {
        b.im.count = c;
        b.im.visible = c > 0;
        if (c > 0) {
          const mr = (b as unknown as { _mr?: { start: number; count: number }; _cr?: { start: number; count: number } });
          touchRange(b.im.instanceMatrix as unknown as { updateRanges: { start: number; count: number }[]; needsUpdate: boolean }, mr._mr || (mr._mr = { start: 0, count: 0 }), c * 16);
          if (b.im.instanceColor) touchRange(b.im.instanceColor as unknown as { updateRanges: { start: number; count: number }[]; needsUpdate: boolean }, mr._cr || (mr._cr = { start: 0, count: 0 }), c * 3);
        }
      }
    }
  }

  private live = new Set<Reg>();
  /** Per frame, after A's update. x/z = A's streaming focus (player). */
  update(regions: Map<string, Reg>, x: number, z: number) {
    if (this.job && (!this.job.r.group || !this.job.r.group.parent)) { this.live.add(this.job.r); this.job.r.__awInst = this.job.out; this.job = null; }
    let fr = this.job ? this.job.r : undefined;
    if (!fr) for (const r of regions.values()) if (!r.__awInst && r.state === "built") { fr = r; break; }
    if (fr && this.fold(fr, 3)) this.live.add(fr); // one region at a time, sliced
    // regions A disposed (disposeRegion detaches the group): free our instance buffers / leave the pools
    for (const r of this.live) if (!r.group || !r.group.parent) {
      for (const b of r.__awInst || []) { if (b.im) b.im.dispose(); if (b.pool) { b.pool.remove(b); this.dirtyPools.add(b.pool); } }
      this.live.delete(r); this.dirty.delete(r);
    }
    const moved = (x - this.lastX) ** 2 + (z - this.lastZ) ** 2 > 16;
    if (moved) { this.lastX = x; this.lastZ = z; for (const r of this.live) this.dirty.add(r); for (const p of this.pools.values()) this.dirtyPools.add(p); }
    for (const [key, p] of this.pools) if (this.dirtyPools.has(p)) { const [lo, hi] = this.range(key.slice(0, key.indexOf("|"))); p.fill(this.lastX, this.lastZ, lo, hi + 3); }
    this.dirtyPools.clear();
    // far buckets are rejected by their bounding box, so all dirty regions fit in one frame
    for (const r of this.dirty) this.cull(r, this.lastX, this.lastZ);
    this.dirty.clear();
  }
}
