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
import { tintKorpsPolitieShell } from "./bldFacadeTint";
import { tintKorpsMeshesUnder } from "./korpsFacade";

type M = Mesh & { isInstancedMesh?: boolean };
type Reg = {
  state: string; rx?: number; rz?: number; group?: Object3D; __awBB?: Batch[]; __awSeal?: boolean;
  __awStack?: Object3D[]; __awConfirm?: boolean; __awOpen?: Map<string, Batch>; __awNC?: number; __awWait?: number;
  __awHot?: number; __awHideStack?: Object3D[];
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
type Batch = CullSet & { bm: BM; kind: number; n: number; cap: number; maxV: number; maxI: number; usedV: number; usedI: number; sx: number; sz: number; sr: number; box: Box3; listed: boolean };

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
  stats = { regions: 0, batches: 0, cells: 0, visCells: 0, maxSlice: 0, failed: 0, concealed: 0 };
  private live = new Set<Reg>();
  private taken = new WeakSet<Object3D>();
  private focus: Set<Reg> | null = null;
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
  /** A copy the pump has not finished, or a built region that still needs its first pass.
   *  The animation callback no longer walks these, so the pump has to stay scheduled until they are sealed. */
  busy() {
    for (const R of (this.g.real as unknown as A).regions.values()) {
      if (R.__awSeal || !R.group) continue;
      if (R.__awHot || (R.__awStack && R.__awStack.length) || R.state === "built") return 1;
    }
    return 0;
  }
  frame() { this.sweep(); }
  /** A region job just added meshes. Hide individual building cells so the next paint
   *  doesn't draw them one by one; afterJobs copies them into batches before that paint. */
  touch(R: Reg) {
    if (!R?.group) return;
    R.__awHot = (R.__awHot || 0) + 1;
    R.__awWait = 0;
    R.__awConfirm = false;
    R.__awHideStack = [R.group];
    this.conceal(R);
  }
  /** Copy regions a job just touched, and catch up regions that were already built when batching
   *  started. Runs outside the animation callback. */
  afterJobs() {
    const hot = new Set<Reg>();
    const rest: Reg[] = [];
    for (const R of (this.g.real as unknown as A).regions.values()) {
      if (R.__awSeal || !R.group?.parent) continue;
      const leftover = !!(R.__awStack && R.__awStack.length);
      if (R.__awHot || leftover) { if (R.__awHot) this.conceal(R); hot.add(R); }
      else if (R.state === "built") rest.push(R);
    }
    // Streaming regions first. Already-built regions are only walked once nothing new is waiting,
    // so a catch-up pass cannot starve the block the player is about to enter.
    if (!hot.size) for (const R of rest) hot.add(R);
    if (!hot.size) return;
    this.focus = hot;
    const prev = this.budget;
    this.budget = 8;
    this.ingest();
    this.budget = prev;
    this.focus = null;
  }

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
    // Copying runs in the pump. Rebuilding this walk inside the animation callback was a
    // steady couple of milliseconds on every streaming frame (__awWait stayed 0).
    if (!this.focus) return;
    for (const R of A.regions.values()) {
      if (this.focus && !this.focus.has(R)) continue;
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
      // a region still streaming and unchanged since the last full pass can wait; new children above restart it.
      // Only a pump pass (focus + hot) starts a fresh walk. An empty stack in the frame is not work.
      if (!R.__awStack || !R.__awStack.length) {
        const restart = !!this.focus && ((R.__awHot || 0) > 0 || (R.state === "built" && !R.__awConfirm));
        if (!restart) {
          if ((R.__awWait || 0) > 0 && R.state !== "built") R.__awWait = (R.__awWait || 1) - 1;
          continue;
        }
      }
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
        if (R.__awConfirm) {
          if (R.rx === 17 && R.rz === 21 && R.group) tintKorpsMeshesUnder(R.group);
          R.__awSeal = true; R.__awStack = undefined; R.__awOpen = undefined; R.__awHot = 0; this.stats.regions++;
        }
        else { R.__awConfirm = true; R.__awStack = [R.group]; }
      } else { R.__awStack = undefined; R.__awWait = 0; if (!R.__awHideStack) R.__awHot = 0; }
      if (performance.now() - t0 >= this.budget) break;
    }
    const dt = performance.now() - t0; if (dt > this.stats.maxSlice) this.stats.maxSlice = dt;
  }

  private tryAdd(R: Reg, o: Object3D) {
    const m = o as M;
    if (!m.isMesh || m.isInstancedMesh || !m.name || !m.name.startsWith("bld:") || m.name === "bld:kit" || Array.isArray(m.material)) return;
    if (this.taken.has(m)) return;
    const root = R.group!;
    for (let p: Object3D | null = m; p && p !== root; p = p.parent) if (!p.matrix.equals(IDENT)) { this.release(m); return; }
    const geo = m.geometry as BufferGeometry;
    if (!geo || !geo.attributes.position || !geo.attributes.position.count || Object.keys(geo.morphAttributes).length || geo.groups.length) {
      this.release(m); return;
    }
    const key = this.keyOf(m, geo);
    const vcount = geo.attributes.position.count;
    const icount = geo.index ? geo.index.count : 0;
    let b = R.__awOpen?.get(key);
    if (!b || b.n >= b.cap || b.usedV + vcount > b.maxV || b.usedI + icount > b.maxI) b = this.newBatch(R, m, geo, key) || undefined;
    tintKorpsPolitieShell(geo, m.name);
    if (!b || !this.addGeo(b, geo)) {
      if (b && b.n === 0) { b.bm.dispose(); if (R.__awOpen?.get(key) === b) R.__awOpen.delete(key); }
      if (this.stats.failed < 3) console.warn("[aw-bb] skip", m.name, "v", vcount, "i", icount);
      this.release(m); this.stats.failed++; return;
    }
    b.usedV += vcount; b.usedI += icount;
    this.place(R, b, m, geo);
  }

  private addGeo(b: Batch, geo: BufferGeometry) {
    try { b.bm.addInstance(b.bm.addGeometry(geo)); return true; }
    catch (e) { if (this.stats.failed < 3) console.warn("[aw-bb]", e); return false; }
  }

  private keyOf(m: M, geo: BufferGeometry) {
    let a = "";
    const at = geo.attributes;
    for (const k in at) a += k + (at[k] as { itemSize: number; normalized: boolean }).itemSize + ((at[k] as { normalized: boolean }).normalized ? "n" : "");
    return m.name + "|" + (m.material as Material).uuid + "|" + a + "|" + (geo.index ? 1 : 0) + "|" + (m.castShadow ? 1 : 0) + (m.receiveShadow ? 1 : 0) + "|" + m.renderOrder + "|" + m.frustumCulled + m.visible;
  }

  private newBatch(R: Reg, m: M, geo: BufferGeometry, key: string): Batch | null {
    const vcount = geo.attributes.position.count;
    const icount = geo.index ? geo.index.count : 0;
    // a few similar cells per batch, but never past the uint16 index range (three switches
    // the combined index to uint32 above 65535 vertices). A cell that is already that big
    // gets a batch of exactly its own size.
    const cap = vcount * CAP <= 65535 && icount * CAP <= 262144 ? CAP : 1;
    const nv = vcount * cap, ni = icount * cap;
    let bm: BM;
    try { bm = new BatchedMesh(cap, Math.max(1, nv), ni, m.material as Material) as BM; }
    catch (e) { if (this.stats.failed < 3) console.warn("[aw-bb]", e); return null; }
    bm.name = "aw:bb:" + m.name.slice(4);
    bm.castShadow = m.castShadow; bm.receiveShadow = m.receiveShadow; bm.renderOrder = m.renderOrder;
    bm.sortObjects = false; bm.perObjectFrustumCulled = true; bm.matrixAutoUpdate = false;
    const kind = m.name === "bld:MeshBasicMaterial" ? KIND_CONTACT : m.name === "bld:trim" ? KIND_TRIM : KIND_BLD;
    const b: Batch = {
      bm, kind, n: 0, cap, cx: new Float32Array(cap), cy: new Float32Array(cap), cz: new Float32Array(cap), r: new Float32Array(cap),
      vis: new Uint16Array(cap), nVis: 0, maxV: nv, maxI: ni, usedV: 0, usedI: 0, sx: 0, sz: 0, sr: Infinity, box: new Box3(), listed: false,
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
    if (!b.bm.parent) {
      // stay off the camera until the batched program has been finalized (see MobilePerf.prime)
      b.bm.layers.disable(0);
      const mp = (window as unknown as { __aw?: { mperf?: { prime: (o: Object3D, fn?: () => void) => void } } }).__aw?.mperf;
      if (mp) { try { mp.prime(b.bm, () => b.bm.layers.enable(0)); } catch { b.bm.layers.enable(0); } }
      else b.bm.layers.enable(0);
      R.group!.add(b.bm);
    }
    this.live.add(R);
    this.stats.cells++;
    this.taken.add(m);
    m.removeFromParent();
    geo.dispose();
    R.__awNC = R.group!.children.length;
    this.cull(b);
  }

  /** Cells that can't be batched go back to drawing on their own. */
  private release(m: M) {
    this.taken.add(m);
    if (m.userData.__awHid) { m.visible = true; m.userData.__awHid = 0; }
  }
  private conceal(R: Reg) {
    const stack = R.__awHideStack;
    if (!stack || !stack.length) { R.__awHideStack = undefined; return; }
    const t0 = performance.now();
    let n = 0;
    while (stack.length && n < 8000 && performance.now() - t0 < 3) {
      const o = stack.pop()!;
      const ch = o.children;
      for (let i = ch.length - 1; i >= 0; i--) stack.push(ch[i]);
      const m = o as M;
      n++;
      if (!m.isMesh || m.isInstancedMesh || this.taken.has(m) || !m.visible) continue;
      if (!m.name || !m.name.startsWith("bld:") || m.name === "bld:kit") continue;
      m.visible = false; m.userData.__awHid = 1; this.stats.concealed++;
    }
    if (!stack.length) R.__awHideStack = undefined;
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
