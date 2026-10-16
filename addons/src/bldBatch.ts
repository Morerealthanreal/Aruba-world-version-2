// r192: building LOD at cell granularity, keeping r186's low draw-call count. Off with ?bbatch=0
// (falls back to r186's per-region merge, bldMerge.ts).
// r186 merged each region's bld:* meshes per material into one mesh. That cut draw calls but gave
// every merged mesh a ~700 m bounding sphere, so A's own distance rules (trim/balconies within
// detailR, contact decals within contactR, walls/roofs within bldR) and frustum culling stopped
// removing anything: every near region drew all of its trim and walls (~830k tris at Oranjestad).
// Here each region's bld:* meshes of one material become BatchedMeshes (one multi-draw call each,
// 32 cells) whose instances are A's original cell meshes. Cells are copied in as the region streams,
// the source mesh is removed in that same step, and the partial batch draws immediately — waiting
// for state==="built" left thousands of individual draws for several frames.
// A's trim/contact rules are applied per instance with A's cadence and focus point (A's 0.5 s cull,
// streaming centre incl. __awAhead); walls/roofs keep r186's region-level bldR result (see cull).
// The shell sphere is the half-diagonal of the running cell bounds (a little looser than a vertex
// scan, so shells stay visible at least as far). Each pass frustum-tests every visible instance.
// Geometry is world space (identity matrices), so no per-instance matrix work.
import { BatchedMesh, Box3, Frustum, Matrix4, Sphere, Vector3, type BufferGeometry, type Camera, type Material, type Mesh, type Object3D } from "three";
import type { AGame } from "./env";

type M = Mesh & { isInstancedMesh?: boolean };
type Reg = {
  state: string; group?: Object3D; __awBB?: Batch[]; __awSeal?: boolean;
  __awStack?: Object3D[]; __awConfirm?: boolean; __awOpen?: Map<string, Batch>; __awNC?: number; __awWait?: number;
};
type Q = { bldR: number; detailR: number; contactR: number };
type A = { q: Q; regions: Map<string, Reg>; update: (...a: number[]) => unknown; cullT?: number };
type BM = BatchedMesh & {
  _multiDrawStarts: Int32Array; _multiDrawCounts: Int32Array; _multiDrawCount: number; _multiDrawBytesPerElement: number;
  _indirectTexture: { image: { data: Uint32Array }; needsUpdate: boolean }; _geometryInfo: Array<{ start: number; count: number }>; _visibilityChanged: boolean;
};
/** world-space bounding spheres per instance (instance i draws geometry i) + the current candidate list */
export type CullSet = { cx: Float32Array; cy: Float32Array; cz: Float32Array; r: Float32Array; vis: Uint16Array; nVis: number };
/** sx/sz/sr: shell sphere used for r186's region-level bldR test */
type Batch = CullSet & { bm: BM; kind: number; n: number; cap: number; sx: number; sz: number; sr: number; box: Box3; listed: boolean };

const IDENT = new Matrix4(), _m = new Matrix4(), _fr = new Frustum(), _c = new Vector3(), _sz = new Vector3();
const KIND_BLD = 0, KIND_TRIM = 1, KIND_CONTACT = 2;
const CAP = 32;

// per pass (main + shadow): frustum-test the candidate instances, write three's multi-draw lists directly
// (BatchedMesh's own version reads + transforms every instance matrix; ours are identity).
// The indirect texture (draw -> instance, used only to fetch the instance matrix / colour) is uploaded
// once and never rewritten: every instance matrix is identity and there are no instance colours, so any
// index gives the same result, and rewriting it was a texture upload per batch per pass.
export function multiDrawCull(this: BM, _r: unknown, _s: unknown, camera: Camera, geometry: BufferGeometry) {
  const b = this.userData.awb as CullSet;
  _m.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  _fr.setFromProjectionMatrix(_m, camera.coordinateSystem, (camera as unknown as { reversedDepth?: boolean }).reversedDepth);
  const P = _fr.planes, bpe = geometry.index ? geometry.index.array.BYTES_PER_ELEMENT : 1;
  const starts = this._multiDrawStarts, counts = this._multiDrawCounts, info = this._geometryInfo;
  let n = 0;
  outer: for (let k = 0; k < b.nVis; k++) {
    const i = b.vis[k], x = b.cx[i], y = b.cy[i], z = b.cz[i], nr = -b.r[i];
    for (let p = 0; p < 6; p++) { const pl = P[p], nn = pl.normal; if (nn.x * x + nn.y * y + nn.z * z + pl.constant < nr) continue outer; }
    const gi = info[i]; starts[n] = gi.start * bpe; counts[n] = gi.count; n++;
  }
  if (!this.userData.awInd) { this._indirectTexture.needsUpdate = true; this.userData.awInd = 1; }
  this._multiDrawCount = n; this._multiDrawBytesPerElement = bpe; this._visibilityChanged = false;
}

export class BldBatch {
  stats = { regions: 0, batches: 0, cells: 0, visCells: 0, maxSlice: 0, failed: 0 };
  private live = new Set<Reg>();
  private taken = new WeakSet<Object3D>();
  private fx = NaN; private fz = NaN;
  constructor(private g: AGame, private budget: number, private shellR = Infinity) {
    const A = g.real as unknown as A, orig = A.update.bind(A);
    A.update = (...a: number[]) => {
      this.ingest(); // before the render, so streamed cells never draw one-by-one
      const r = orig(...a);
      if (A.cullT === 0) {
        const ah = (window as unknown as { __awAhead?: number[] }).__awAhead;
        this.fx = a[0] + (ah ? ah[0] : 0); this.fz = a[2] + (ah ? ah[1] : 0);
        this.cullAll();
      }
      return r;
    };
  }
  pending() {
    let n = 0;
    for (const R of (this.g.real as unknown as A).regions.values()) if (!R.__awSeal && R.group) n++;
    return n;
  }
  frame() { this.sweep(); }

  private sweep() {
    if (!this.live.size) return;
    for (const R of [...this.live]) if (!R.group || !R.group.parent) {
      for (const b of R.__awBB || []) b.bm.dispose();
      R.__awBB = undefined; R.__awOpen = undefined; R.__awStack = undefined;
      this.live.delete(R);
    }
  }

  private ingest() {
    this.sweep();
    const A = this.g.real as unknown as A, t0 = performance.now();
    for (const R of A.regions.values()) {
      if (R.__awSeal || !R.group || !R.group.parent) continue;
      if (R.state === "failed") { R.__awSeal = true; continue; }
      const ch = R.group.children, nc = R.__awNC || 0;
      if (ch.length > nc) {
        const stack = R.__awStack || (R.__awStack = []);
        let foreign = false;
        for (let i = nc; i < ch.length; i++) {
          const c = ch[i];
          if (!c.name.startsWith("aw:bb:")) { stack.push(c); foreign = true; }
        }
        if (foreign) { R.__awConfirm = false; R.__awWait = 0; }
      }
      if (ch.length !== nc) R.__awNC = ch.length;
      // a region still streaming and unchanged since the last full pass can wait; new children above restart it
      if ((!R.__awStack || !R.__awStack.length) && (R.__awWait || 0) > 0 && R.state !== "built") { R.__awWait = (R.__awWait || 1) - 1; continue; }
      const stack = R.__awStack || (R.__awStack = [R.group]);
      let guard = 0;
      while (stack.length && performance.now() - t0 < this.budget && guard++ < 6000) {
        const o = stack.pop()!;
        const kids = o.children;
        for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
        this.tryAdd(R, o);
      }
      if (stack.length) break;
      if (R.state === "built") {
        if (R.__awConfirm) { R.__awSeal = true; R.__awStack = undefined; R.__awOpen = undefined; this.stats.regions++; }
        else { R.__awConfirm = true; R.__awStack = [R.group]; }
      } else { R.__awStack = undefined; R.__awWait = 8; }
      if (performance.now() - t0 >= this.budget) break;
    }
    const dt = performance.now() - t0; if (dt > this.stats.maxSlice) this.stats.maxSlice = dt;
  }

  private tryAdd(R: Reg, o: Object3D) {
    const m = o as M;
    if (!m.isMesh || m.isInstancedMesh || !m.name || !m.name.startsWith("bld:") || m.name === "bld:kit" || Array.isArray(m.material)) return;
    if (this.taken.has(m)) return;
    const root = R.group!;
    for (let p: Object3D | null = m; p && p !== root; p = p.parent) if (!p.matrix.equals(IDENT)) { this.taken.add(m); return; }
    const geo = m.geometry as BufferGeometry;
    if (!geo || !geo.attributes.position || !geo.attributes.position.count || Object.keys(geo.morphAttributes).length || geo.groups.length) {
      this.taken.add(m); return;
    }
    const key = this.keyOf(m, geo);
    let b = R.__awOpen?.get(key);
    if (!b || b.n >= b.cap) b = this.newBatch(R, m, geo, key, CAP) || undefined;
    if (!b) { this.taken.add(m); this.stats.failed++; return; }
    if (!this.addGeo(b, geo)) {
      if (b.n === 0) b.bm.dispose();
      const b2 = this.newBatch(R, m, geo, key, 4);
      if (!b2 || !this.addGeo(b2, geo)) {
        if (b2 && b2.n === 0) { b2.bm.dispose(); R.__awOpen?.delete(key); }
        this.taken.add(m); this.stats.failed++; return;
      }
      b = b2;
    }
    this.place(R, b, m, geo);
  }

  private addGeo(b: Batch, geo: BufferGeometry) {
    try { b.bm.addInstance(b.bm.addGeometry(geo)); return true; } catch (e) { console.warn("[aw-bb]", e); return false; }
  }

  private keyOf(m: M, geo: BufferGeometry) {
    let a = "";
    const at = geo.attributes;
    for (const k in at) a += k + (at[k] as { itemSize: number; normalized: boolean }).itemSize + ((at[k] as { normalized: boolean }).normalized ? "n" : "");
    return m.name + "|" + (m.material as Material).uuid + "|" + a + "|" + (geo.index ? 1 : 0) + "|" + (m.castShadow ? 1 : 0) + (m.receiveShadow ? 1 : 0) + "|" + m.renderOrder + "|" + m.frustumCulled + m.visible;
  }

  private newBatch(R: Reg, m: M, geo: BufferGeometry, key: string, cap: number): Batch | null {
    const nv = geo.attributes.position.count * cap;
    const ni = geo.index ? geo.index.count * cap : 0;
    let bm: BM;
    try { bm = new BatchedMesh(cap, Math.max(1, nv), ni, m.material as Material) as BM; }
    catch (e) { console.warn("[aw-bb]", e); return null; }
    bm.name = "aw:bb:" + m.name.slice(4);
    bm.castShadow = m.castShadow; bm.receiveShadow = m.receiveShadow; bm.renderOrder = m.renderOrder;
    bm.sortObjects = false; bm.perObjectFrustumCulled = true; bm.matrixAutoUpdate = false;
    const kind = m.name === "bld:MeshBasicMaterial" ? KIND_CONTACT : m.name === "bld:trim" ? KIND_TRIM : KIND_BLD;
    const b: Batch = {
      bm, kind, n: 0, cap, cx: new Float32Array(cap), cy: new Float32Array(cap), cz: new Float32Array(cap), r: new Float32Array(cap),
      vis: new Uint16Array(cap), nVis: 0, sx: 0, sz: 0, sr: Infinity, box: new Box3(), listed: false,
    };
    bm.userData.awb = b;
    bm.onBeforeRender = multiDrawCull as unknown as BatchedMesh["onBeforeRender"];
    if (!R.__awOpen) R.__awOpen = new Map();
    R.__awOpen.set(key, b);
    return b;
  }

  private place(R: Reg, b: Batch, m: M, geo: BufferGeometry) {
    const i = b.n;
    if (!geo.boundingSphere) geo.computeBoundingSphere();
    const bs = geo.boundingSphere!;
    b.cx[i] = bs.center.x; b.cy[i] = bs.center.y; b.cz[i] = bs.center.z; b.r[i] = bs.radius;
    if (!geo.boundingBox) geo.computeBoundingBox();
    b.box.union(geo.boundingBox!);
    b.box.getCenter(_c); b.box.getSize(_sz);
    b.sx = _c.x; b.sz = _c.z; b.sr = 0.5 * Math.hypot(_sz.x, _sz.y, _sz.z);
    if (!b.bm.boundingSphere) b.bm.boundingSphere = new Sphere(_c.clone(), b.sr);
    else { b.bm.boundingSphere.center.copy(_c); b.bm.boundingSphere.radius = b.sr; }
    b.n = i + 1;
    if (!b.listed) {
      b.listed = true;
      if (!R.__awBB) R.__awBB = [];
      R.__awBB.push(b); this.stats.batches++;
    }
    if (!b.bm.parent) R.group!.add(b.bm);
    this.live.add(R);
    this.stats.cells++;
    this.taken.add(m);
    m.removeFromParent();
    geo.dispose();
    R.__awNC = R.group!.children.length;
    this.cull(b);
  }

  private cullAll() {
    let v = 0;
    for (const R of this.live) for (const b of R.__awBB || []) { this.cull(b); v += b.nVis; }
    this.stats.visCells = v;
  }

  // A's rule per mesh: (distance to bounding-sphere centre) - radius < range. Trim and contact decals
  // get it per cell (the far LOD). Building shells keep r186's result: the rule on the sphere of the
  // whole merged region mesh, so the same blocks show at the same distances (per-cell bldR would
  // empty far blocks that are clearly visible through the light fog); ?bbshell=<m> culls shells per cell.
  private cull(b: Batch) {
    const q = (this.g.real as unknown as A).q, all = () => { for (let i = 0; i < b.n; i++) b.vis[i] = i; b.nVis = b.n; b.bm.visible = b.n > 0; };
    if (!Number.isFinite(this.fx)) return all();
    if (b.kind === KIND_BLD && !Number.isFinite(this.shellR)) {
      if (Math.hypot(b.sx - this.fx, b.sz - this.fz) - b.sr < q.bldR) all(); else { b.nVis = 0; b.bm.visible = false; }
      return;
    }
    const T = b.kind === KIND_CONTACT ? q.contactR : b.kind === KIND_TRIM ? q.detailR : this.shellR;
    let c = 0;
    for (let i = 0; i < b.n; i++) if (Math.hypot(b.cx[i] - this.fx, b.cz[i] - this.fz) - b.r[i] < T) b.vis[c++] = i;
    b.nVis = c; b.bm.visible = c > 0;
  }
}
