// r192: building LOD at cell granularity, keeping r186's low draw-call count. Off with ?bbatch=0
// (falls back to r186's per-region merge, bldMerge.ts).
// r186 merged each region's bld:* meshes per material into one mesh. That cut draw calls but gave
// every merged mesh a ~700 m bounding sphere, so A's own distance rules (trim/balconies within
// detailR, contact decals within contactR, walls/roofs within bldR) and frustum culling stopped
// removing anything: every near region drew all of its trim and walls (~830k tris at Oranjestad).
// Here each region's bld:* meshes of one material become ONE BatchedMesh (one multi-draw call)
// whose instances are A's original cell meshes. A's rules are applied per instance with A's
// cadence and focus point (A's 0.5 s cull, streaming centre incl. __awAhead), and each pass
// (main + shadow) frustum-tests every visible instance against its world bounding sphere, which
// is what three did for the original per-cell meshes. Geometry is world space (identity matrices),
// so no per-instance matrix work. Batches are filled a few cells per frame under a time budget
// and swapped in only when complete.
import { BatchedMesh, Frustum, Matrix4, Sphere, type BufferGeometry, type Camera, type Material, type Mesh, type Object3D } from "three";
import type { AGame } from "./env";

type M = Mesh & { isInstancedMesh?: boolean };
type Reg = { state: string; group?: Object3D; __awBB?: Batch[] };
type Q = { bldR: number; detailR: number; contactR: number };
type A = { q: Q; regions: Map<string, Reg>; update: (...a: number[]) => unknown; cullT?: number };
type BM = BatchedMesh & {
  _multiDrawStarts: Int32Array; _multiDrawCounts: Int32Array; _multiDrawCount: number; _multiDrawBytesPerElement: number;
  _indirectTexture: { image: { data: Uint32Array }; needsUpdate: boolean }; _geometryInfo: Array<{ start: number; count: number }>; _visibilityChanged: boolean;
};
/** world-space bounding spheres per instance (instance i draws geometry i) + the current candidate list */
export type CullSet = { cx: Float32Array; cy: Float32Array; cz: Float32Array; r: Float32Array; vis: Uint16Array; nVis: number };
type Batch = CullSet & { bm: BM; kind: number; n: number };
type Job = { R: Reg; list: M[]; i: number; b: Batch };

const IDENT = new Matrix4(), _m = new Matrix4(), _fr = new Frustum();
const KIND_BLD = 0, KIND_TRIM = 1, KIND_CONTACT = 2;

// per pass (main + shadow): frustum-test the candidate instances, write three's multi-draw lists directly
// (BatchedMesh's own version reads + transforms every instance matrix; ours are identity)
export function multiDrawCull(this: BM, _r: unknown, _s: unknown, camera: Camera, geometry: BufferGeometry) {
  const b = this.userData.awb as CullSet;
  _m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  _fr.setFromProjectionMatrix(_m, camera.coordinateSystem, (camera as unknown as { reversedDepth?: boolean }).reversedDepth);
  const P = _fr.planes, bpe = geometry.index ? geometry.index.array.BYTES_PER_ELEMENT : 1;
  const starts = this._multiDrawStarts, counts = this._multiDrawCounts, ind = this._indirectTexture.image.data, info = this._geometryInfo;
  let n = 0;
  outer: for (let k = 0; k < b.nVis; k++) {
    const i = b.vis[k], x = b.cx[i], y = b.cy[i], z = b.cz[i], nr = -b.r[i];
    for (let p = 0; p < 6; p++) { const pl = P[p], nn = pl.normal; if (nn.x * x + nn.y * y + nn.z * z + pl.constant < nr) continue outer; }
    const gi = info[i]; starts[n] = gi.start * bpe; counts[n] = gi.count; ind[n] = i; n++;
  }
  this._indirectTexture.needsUpdate = true;
  this._multiDrawCount = n; this._multiDrawBytesPerElement = bpe; this._visibilityChanged = false;
}

export class BldBatch {
  stats = { regions: 0, batches: 0, cells: 0, visCells: 0, maxSlice: 0, failed: 0 };
  private jobs: Job[] = [];
  private live = new Set<Reg>();
  private fx = NaN; private fz = NaN;
  constructor(private g: AGame, private budget: number) {
    const A = g.real as unknown as A, orig = A.update.bind(A);
    A.update = (...a: number[]) => {
      const r = orig(...a);
      if (A.cullT === 0) { // A's distance cull just ran: same focus A used
        const ah = (window as unknown as { __awAhead?: number[] }).__awAhead;
        this.fx = a[0] + (ah ? ah[0] : 0); this.fz = a[2] + (ah ? ah[1] : 0);
        this.cullAll();
      }
      return r;
    };
  }
  pending() { return this.jobs.length; }

  frame() {
    const A = this.g.real as unknown as A, t0 = performance.now();
    if (this.live.size) { // regions A disposed: free batch textures (A's disposeRegion only frees geometries)
      let gone = 0; for (const R of this.live) if (!R.group || !R.group.parent) gone++;
      if (gone) for (const R of [...this.live]) if (!R.group || !R.group.parent) { for (const b of R.__awBB || []) b.bm.dispose(); this.live.delete(R); }
    }
    if (!this.jobs.length) for (const R of A.regions.values()) if (!R.__awBB && R.state === "built" && R.group) { this.collect(R); break; }
    while (this.jobs.length && performance.now() - t0 < this.budget) {
      const j = this.jobs[0];
      if (!j.list[0].parent || !j.R.group || !j.R.group.parent) { this.jobs.shift(); j.b.bm.dispose(); continue; } // region unloaded meanwhile
      const bm = j.b.bm, m = j.list[j.i], geo = m.geometry as BufferGeometry;
      try { bm.addInstance(bm.addGeometry(geo)); } catch (e) { console.warn("[aw-bb]", e); this.stats.failed++; this.jobs.shift(); bm.dispose(); continue; }
      if (++j.i === j.list.length) { this.jobs.shift(); this.swap(j); }
    }
    const dt = performance.now() - t0; if (dt > this.stats.maxSlice) this.stats.maxSlice = dt;
  }

  private collect(R: Reg) {
    const root = R.group!, buckets = new Map<string, M[]>();
    root.traverse((o) => {
      const m = o as M;
      if (!m.isMesh || m.isInstancedMesh || !m.name.startsWith("bld:") || m.name === "bld:kit" || Array.isArray(m.material)) return;
      let p: Object3D | null = m; while (p && p !== root) { if (!p.matrix.equals(IDENT)) return; p = p.parent; }
      const geo = m.geometry as BufferGeometry;
      if (Object.keys(geo.morphAttributes).length || geo.groups.length || !geo.attributes.position.count) return;
      if (!geo.boundingSphere) geo.computeBoundingSphere();
      const k = m.name + "|" + (m.material as Material).uuid + "|" + Object.keys(geo.attributes).sort().map((a) => a + (geo.attributes[a] as { array: { constructor: { name: string } } }).array.constructor.name + geo.attributes[a].itemSize + (geo.attributes[a].normalized ? "n" : "")).join(",") + "|" + (geo.index ? 1 : 0) + "|" + (m.castShadow ? 1 : 0) + (m.receiveShadow ? 1 : 0) + "|" + m.renderOrder + "|" + m.frustumCulled + m.visible;
      (buckets.get(k) || buckets.set(k, []).get(k)!).push(m);
    });
    R.__awBB = [];
    for (const list of buckets.values()) {
      if (list.length < 2 || list.length > 65535) continue;
      let nv = 0, ni = 0;
      for (const m of list) { const g = m.geometry as BufferGeometry; nv += g.attributes.position.count; ni += g.index ? g.index.count : 0; }
      const f = list[0], n = list.length;
      const bm = new BatchedMesh(n, nv, ni, f.material as Material) as BM;
      bm.name = "aw:bb:" + f.name.slice(4);
      bm.castShadow = f.castShadow; bm.receiveShadow = f.receiveShadow; bm.renderOrder = f.renderOrder;
      bm.sortObjects = false; bm.perObjectFrustumCulled = true; bm.matrixAutoUpdate = false;
      const b: Batch = { bm, kind: f.name === "bld:MeshBasicMaterial" ? KIND_CONTACT : f.name === "bld:trim" ? KIND_TRIM : KIND_BLD, n, cx: new Float32Array(n), cy: new Float32Array(n), cz: new Float32Array(n), r: new Float32Array(n), vis: new Uint16Array(n), nVis: 0 };
      const all = new Sphere(), s = new Sphere();
      list.forEach((m, i) => { const bs = (m.geometry as BufferGeometry).boundingSphere!; b.cx[i] = bs.center.x; b.cy[i] = bs.center.y; b.cz[i] = bs.center.z; b.r[i] = bs.radius; if (i) all.union(s.copy(bs)); else all.copy(bs); });
      bm.boundingSphere = all;
      bm.userData.awb = b;
      bm.onBeforeRender = multiDrawCull as unknown as BatchedMesh["onBeforeRender"];
      this.jobs.push({ R, list, i: 0, b });
    }
    this.stats.regions++;
  }

  private swap(j: Job) {
    const { R, list, b } = j;
    R.group!.add(b.bm);
    for (const m of list) { m.removeFromParent(); (m.geometry as BufferGeometry).dispose(); }
    R.__awBB!.push(b); this.live.add(R);
    this.stats.batches++; this.stats.cells += b.n;
    this.cull(b);
  }

  private cullAll() {
    let v = 0;
    for (const R of this.live) for (const b of R.__awBB || []) { this.cull(b); v += b.nVis; }
    this.stats.visCells = v;
  }

  // A's rule per mesh: (distance to bounding-sphere centre) - radius < range
  private cull(b: Batch) {
    if (!Number.isFinite(this.fx)) { b.vis.forEach((_, i) => (b.vis[i] = i)); b.nVis = b.n; return; }
    const q = (this.g.real as unknown as A).q;
    const T = b.kind === KIND_CONTACT ? q.contactR : b.kind === KIND_TRIM ? q.detailR : q.bldR;
    let c = 0;
    for (let i = 0; i < b.n; i++) if (Math.hypot(b.cx[i] - this.fx, b.cz[i] - this.fz) - b.r[i] < T) b.vis[c++] = i;
    b.nVis = c; b.bm.visible = c > 0;
  }
}
