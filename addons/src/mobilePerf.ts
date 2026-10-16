// Frame-cost trims (r186). Off with ?mperf=0.
//  - Phone only: sun shadow map re-renders every 2nd frame (static world; cars/peds move), same as HIGH's hiPerf.
//  - Every device: shader warm-up, including the shadow-map depth variants. Materials are compiled
//    from a signature (not material.id — instances share programs) in the tile-job pump, outside the
//    animation callback, and getUniforms runs there too so the first draw does not stall the frame.
//    ?warmup=full restores the old whole-scene compileAsync.
//  - Textures of those new meshes upload one per frame (renderer.initTexture) so the first draw is not
//    also the upload. Default on; ?preup=0 disables. Only textures of meshes we actually warm.
import { MeshDepthMaterial, Scene, WebGLRenderTarget } from "three";
import type { Object3D } from "three";
import type { AGame } from "./env";
type R = {
  shadowMap: { autoUpdate: boolean; needsUpdate: boolean };
  compile?: (s: unknown, c: unknown, t?: unknown) => unknown;
  compileAsync?: (s: unknown, c: unknown, t?: unknown) => Promise<unknown>;
  debug?: { checkShaderErrors: boolean };
};
type Tex = { isTexture?: boolean; isCubeTexture?: boolean; version: number; image: unknown };
const TEX = ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap", "alphaMap", "bumpMap", "lightMap", "specularMap", "clearcoatNormalMap"];
type Mat = {
  id: number; version: number; type: string; transparent?: boolean; side?: number; visible?: boolean;
  alphaTest?: number; alphaToCoverage?: boolean; vertexColors?: boolean; flatShading?: boolean;
  wireframe?: boolean; fog?: boolean; toneMapped?: boolean; defines?: Record<string, unknown>;
  customProgramCacheKey?: () => string;
};
type O = Object3D & {
  isMesh?: boolean; isPoints?: boolean; isLine?: boolean; isSprite?: boolean; isLight?: boolean;
  isInstancedMesh?: boolean; isBatchedMesh?: boolean; isSkinnedMesh?: boolean; instanceColor?: unknown; _colorsTexture?: unknown;
  castShadow: boolean; receiveShadow: boolean;
  material?: Mat | Mat[];
  geometry?: { attributes: Record<string, unknown>; morphAttributes: Record<string, unknown[]> };
};
type Reg = { group?: Object3D };
export class MobilePerf {
  /** phone shadow cadence; shader warm-up runs on every device */
  on: boolean;
  private n = 0; private t = 0.2; private busy = false;
  private seen = new WeakSet<object>(); private keys = new Set<string>(); private lightKey = "";
  private seenTex = new WeakSet<object>(); private texQ: Tex[] = []; private pend: O[] = []; private inflight = 0;
  private stack: O[] = []; private childN = new WeakMap<object, number>(); private lc = 0;
  // Shadow passes draw with three's depth material: back-face (or the material's shadowSide), the
  // source map/alphaTest copied on, fog off, and a render target bound (working color space, no tone
  // mapping). Compiling that same variant here, then finalizing it outside the animation callback,
  // is what keeps the first shadow draw from stalling the frame.
  private shadowHost = new Scene();
  private shadowDummy = { isXRRenderTarget: false };
  private depthMats = new Map<string, MeshDepthMaterial>();
  stats = { compiles: 0, objs: 0, reps: 0, uploads: 0, depth: 0, synced: 0 };
  private synced = new WeakSet<object>();
  private syncQ: Mat[] = [];
  private queued = new WeakSet<object>();
  private syncTries = new WeakMap<object, number>();
  private holds: { fn: () => void; mats: Mat[]; tries: number }[] = [];
  /** Materials whose programs are finalized. One lookup per draw, no property walk. */
  private hotMat = new WeakSet<object>();
  private deferRec = new WeakMap<object, { frame: number; n: number }>();
  private noted = new WeakSet<object>();
  private uploaded = new WeakSet<object>();
  private gpuQ: O[] = [];
  private warming = false;
  private scratch: WebGLRenderTarget | null = null;
  private frameN = 0;
  constructor(private g: AGame, mobile: boolean, private incremental = true, private preUpload = true) {
    this.on = mobile;
    const A = g.real as unknown as { update?: (...a: number[]) => unknown } | null;
    if (A && A.update) {
      const orig = A.update.bind(A);
      A.update = (...a: number[]) => { this.beforeRender(); return orig(...a); };
    }
    // A mesh that shows up inside this frame's update is drawn before the pump can warm it.
    // Skip that draw (it was not on screen last frame) and warm it before the next paint.
    if (this.incremental) {
      const renderer = g.renderer as unknown as { renderBufferDirect: (...a: unknown[]) => unknown };
      const origRBD = renderer.renderBufferDirect.bind(renderer);
      renderer.renderBufferDirect = (...args: unknown[]) => {
        if (this.warming) return origRBD(...args);
        const material = args[3] as (Mat & { isMeshDepthMaterial?: boolean; isMeshDistanceMaterial?: boolean }) | null | undefined;
        const object = args[4] as O | null | undefined;
        // New geometry uploads inside the draw that first uses it. Skip that draw — the mesh was
        // not on screen last frame — and upload it from the pump before the next paint.
        if (object && !this.uploaded.has(object) && this.deferObject(object)) return;
        if (material && !material.isMeshDepthMaterial && !material.isMeshDistanceMaterial && !this.hotMat.has(material) && this.deferDraw(material, object as O)) return;
        return origRBD(...args);
      };
    }
  }
  /** Phone shadow cadence only. Walking and compiling here was a steady tax on every streaming frame. */
  beforeRender() {
    this.frameN++;
    if (!this.on) return;
    const r = this.g.renderer as unknown as R;
    r.shadowMap.autoUpdate = false;
    if ((this.n++ & 1) === 0) r.shadowMap.needsUpdate = true;
  }
  frame(dt: number) {
    if (!this.incremental && !this.busy) this.full(dt);
  }
  /** Called at the end of the tile-job pump, after new meshes exist and before the next frame. */
  afterJobs() {
    if (!this.incremental) return;
    const t0 = performance.now();
    this.seed();
    // finish the new nodes before the next paint; the walk itself is cheap compared with getUniforms
    while (this.stack.length && performance.now() - t0 < 12) this.walk(2);
    const t1 = performance.now();
    while (this.pend.length && performance.now() - t1 < 10) this.pump(24);
    // getUniforms (the first-draw stall) runs here, outside the animation callback
    this.sync(48);
    // First-use texture uploads were a large share of the >50 ms frames. Drain them here,
    // before the next paint, instead of one-at-a-time inside the animation callback.
    if (this.preUpload && this.texQ.length) this.upload(200, 1e9);
    this.flushGpu();
  }
  /** Programs still waiting to be finalized. The pump keeps going until this is 0 so the next frame does not draw them cold. */
  shaderPending() { return this.syncQ.length + this.holds.length + this.pend.length; }
  /** Scene walk or a texture upload still queued. Incomplete images are not included, so a loading texture cannot spin the pump. */
  backlog() {
    if (this.stack.length || this.gpuQ.length) return 1;
    const n = this.texQ.length;
    for (let i = 0; i < n && i < 16; i++) {
      const t = this.texQ[i], img = t.image as { complete?: boolean } | null | undefined;
      if (t.version > 0 && img && img.complete !== false) return 1;
    }
    return 0;
  }
  /**
   * Link `obj`'s program now and run `onReady` once getUniforms has populated it.
   * onReady is synchronous when that program was already finalized. The draw-time
   * getProgramInfoLog otherwise waits for the driver, so callers keep a new mesh
   * off the camera layer until then.
   */
  prime(obj: O, onReady?: () => void) {
    if (!this.incremental) { onReady?.(); return; }
    const r = this.g.renderer as unknown as R;
    if (r.compile) this.compileObject(obj, r);
    const depth = this.warmShadow(obj, r);
    const mats = matsOf(obj);
    for (const m of depth) mats.push(m);
    const pending: Mat[] = [];
    for (const m of mats) if (m && !this.ready(m)) pending.push(m);
    for (const m of pending) this.queue(m);
    if (!pending.length) { onReady?.(); return; }
    if (onReady) this.holds.push({ fn: onReady, mats: pending, tries: 0 });
  }
  pending() { return this.pend.length + this.stack.length + this.inflight + this.syncQ.length + this.holds.length + (this.busy ? 1 : 0) + this.backlog(); }
  private full(dt: number) {
    if ((this.t -= dt) > 0) return;
    const r = this.g.renderer as unknown as R;
    if (!r.compileAsync) return;
    this.t = 4; this.busy = true;
    r.compileAsync(this.g.scene, this.g.camera).then(() => { this.stats.compiles++; }, () => {}).finally(() => { this.busy = false; });
  }
  private upload(max: number, budget = 2) {
    const r = this.g.renderer as unknown as { initTexture(t: Tex): void; properties: { get(t: Tex): { __version?: number } } };
    const t0 = performance.now();
    let n = 0, skipped = 0;
    // An image that is still loading used to stop the queue, so every texture behind it
    // uploaded on first draw. Park those and keep going.
    while (this.texQ.length && n < max && skipped < this.texQ.length && performance.now() - t0 < budget) {
      const t = this.texQ.shift()!, img = t.image as { complete?: boolean } | null | undefined;
      if (t.version === 0 || !img || img.complete === false) { this.texQ.push(t); skipped++; continue; }
      if (r.properties.get(t).__version === t.version) continue;
      try { r.initTexture(t); } catch { /* image not ready */ }
      n++; this.stats.uploads++;
    }
  }
  private seed() {
    // light set rarely changes (day/night toggles). A full walk every frame was its own hitch.
    if (this.lc++ % 45 === 0) {
      let lk = "";
      const lights = (o: O) => {
        if (o.isLight) lk += o.type + (o.castShadow ? "s" : "") + ",";
        for (let i = 0; i < o.children.length; i++) lights(o.children[i] as O);
      };
      lights(this.g.scene as unknown as O);
      if (lk !== this.lightKey) {
        const first = this.lightKey === "";
        this.lightKey = lk;
        if (!first) { this.keys.clear(); this.depthMats.clear(); this.seen = new WeakSet(); this.childN = new WeakMap(); this.stack.length = 0; this.hotMat = new WeakSet(); this.deferRec = new WeakMap(); this.noted = new WeakSet(); }
      }
    }
    const push = (o: O | undefined | null) => {
      if (!o || this.childN.get(o) === o.children.length) return;
      this.stack.push(o);
    };
    push(this.g.scene as unknown as O);
    const regs = (this.g.real as unknown as { regions?: Map<string, Reg> } | null)?.regions;
    if (regs) for (const R of regs.values()) push(R.group as O | undefined);
  }
  private walk(budget: number) {
    const t0 = performance.now();
    let n = 0;
    while (this.stack.length && n < 800 && performance.now() - t0 < budget) {
      const o = this.stack.pop()!;
      const ch = o.children, cn = ch.length;
      if (this.childN.get(o) === cn) { n++; continue; } // unchanged node; a new child flips the count and re-walks siblings
      this.childN.set(o, cn);
      for (let i = 0; i < cn; i++) this.stack.push(ch[i] as O);
      this.consider(o);
      n++;
    }
  }
  private consider(o: O) {
    if (this.seen.has(o) || !(o.isMesh || o.isPoints || o.isLine || o.isSprite) || !o.material) return;
    this.seen.add(o); this.stats.objs++;
    const geo = o.geometry, at = geo ? geo.attributes : {};
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const f = (o.isInstancedMesh ? (o.instanceColor ? "I" : "i") : "") + (o.isBatchedMesh ? (o._colorsTexture ? "B" : "b") : "") +
      (o.isSkinnedMesh ? "s" : "") + (o.receiveShadow ? "r" : "") + (o.castShadow ? "S" : "") + (at.color ? "c" : "") + (at.tangent ? "t" : "") +
      (at.uv ? "u" : "") + (at.uv1 ? "1" : "") + (at.uv2 ? "2" : "") + (geo && Object.keys(geo.morphAttributes).length ? "m" : "") + o.type;
    let add = false;
    for (const m of mats) {
      if (!m || m.visible === false) continue;
      const k = sig(m, f, this.lightKey);
      if (!this.keys.has(k)) { this.keys.add(k); add = true; }
      // Concealed cells share these textures with the batch that will draw them. Queue even
      // while hidden so the upload happens before that batch's first paint.
      if (this.preUpload) for (const slot of TEX) {
        const t = (m as unknown as Record<string, Tex | null>)[slot];
        if (t && t.isTexture && !t.isCubeTexture && !this.seenTex.has(t)) { this.seenTex.add(t); this.texQ.push(t); }
      }
    }
    if (add) this.pend.push(o);
  }
  private deferObject(o: O): boolean {
    let rec = this.deferRec.get(o);
    if (!rec) this.deferRec.set(o, (rec = { frame: this.frameN, n: 1 }));
    else if (rec.frame !== this.frameN) { rec.frame = this.frameN; rec.n++; }
    // A variant we never manage to warm still has to appear. Two frames is enough for the pump.
    if (rec.n > 2) { this.uploaded.add(o); return false; }
    this.note(o);
    return true;
  }
  private note(o: O) {
    if (!o || this.noted.has(o)) return;
    this.noted.add(o);
    this.gpuQ.push(o);
    if (!this.seen.has(o)) this.consider(o);
    else this.pend.push(o);
  }
  /** Upload a new mesh's buffers outside the animation callback, into a 4×4 target so the canvas is left alone. */
  private flushGpu() {
    if (!this.gpuQ.length) return;
    const r = this.g.renderer as unknown as {
      getRenderTarget(): unknown;
      setRenderTarget(t: unknown): void;
      renderBufferDirect(camera: unknown, scene: unknown, geometry: unknown, material: unknown, object: unknown, group: unknown): void;
    };
    const list = this.gpuQ.splice(0, 240);
    if (!this.scratch) this.scratch = new WebGLRenderTarget(4, 4);
    const prev = r.getRenderTarget();
    this.warming = true;
    try {
      r.setRenderTarget(this.scratch);
      for (const o of list) {
        const geo = o.geometry;
        const mats = matsOf(o);
        if (!geo || !mats.length) { this.uploaded.add(o); continue; }
        for (const m of mats) {
          try { r.renderBufferDirect(this.g.camera, null, geo, m, o, null); } catch { /* the real draw reports it */ }
        }
        this.uploaded.add(o);
        if (!this.hotMat.has(mats[0]) && this.ready(mats[0])) this.hotMat.add(mats[0]);
      }
    } catch { /* target rejected; the real draw uploads instead */ }
    finally {
      this.warming = false;
      try { r.setRenderTarget(prev); } catch { /* restore best-effort */ }
    }
  }
  /**
   * A material with no finalized program is not drawn yet. The pump compiles and uploads it
   * before the next frame. After a couple of frames, draw anyway so a variant we cannot
   * match does not leave a hole in the world.
   */
  private deferDraw(m: Mat, o: O): boolean {
    if (this.ready(m)) { this.hotMat.add(m); return false; }
    let rec = this.deferRec.get(m);
    if (!rec) this.deferRec.set(m, (rec = { frame: this.frameN, n: 1 }));
    else if (rec.frame !== this.frameN) { rec.frame = this.frameN; rec.n++; }
    if (rec.n > 2) return false;
    this.note(o);
    return true;
  }
  private pump(max: number) {
    const r = this.g.renderer as unknown as R;
    if (!r.compile || !this.pend.length) return;
    const objs: O[] = [];
    const scene = this.g.scene as unknown as O;
    while (this.pend.length && objs.length < max) {
      const o = this.pend.shift()!;
      if (!o.parent && o !== scene) continue;
      objs.push(o);
    }
    if (!objs.length) return;
    // One compile walks the scene lights once for the whole batch. Per-object compiles were
    // a full scene walk each, and the shadow variant needs a second pass with fog off.
    this.compileObjects(objs, r);
    for (const m of this.warmShadowBatch(objs, r)) if (!this.ready(m)) this.queue(m);
    for (const o of objs) for (const m of matsOf(o)) if (!this.ready(m)) this.queue(m);
  }
  private compileObjects(list: O[], r: R) {
    if (!r.compile || !list.length) return;
    const root = { traverse: (cb: (o: O) => void) => { for (const x of list) cb(x); }, traverseVisible: () => {} };
    try { r.compile(root, this.g.camera, this.g.scene); this.stats.compiles++; this.stats.reps += list.length; } catch { /* program failed; the real draw will report it */ }
  }
  private compileObject(o: O, r: R) {
    if (!r.compile) return;
    const reps = [o];
    const root = { traverse: (cb: (o: O) => void) => { for (const x of reps) cb(x); }, traverseVisible: () => {} };
    try { r.compile(root, this.g.camera, this.g.scene); this.stats.compiles++; this.stats.reps++; } catch { /* program failed; the real draw will report it */ }
  }
  private queue(m: Mat) {
    if (!m || this.queued.has(m)) return;
    this.queued.add(m); this.syncQ.push(m);
  }
  /**
   * Finalize every program a material has acquired, not only the one compiled last.
   * A shared material draws with several variants (batched, instanced, shadow); leaving
   * any of them cold is a multi-hundred-millisecond frame the first time it is used.
   * Runs outside the animation callback. A couple of non-blocking polls, then finalize
   * anyway: some drivers only finish the link inside getProgramInfoLog.
   */
  private sync(max: number) {
    if (!this.syncQ.length && !this.holds.length) { this.flush(); return; }
    const again: Mat[] = [];
    const q = this.syncQ;
    this.syncQ = [];
    let n = 0;
    for (const m of q) {
      this.queued.delete(m);
      const progs = this.programsOf(m);
      if (!progs.length) continue;
      let later = false;
      for (const prog of progs) {
        if (this.synced.has(prog)) continue;
        if (n >= max) { later = true; break; }
        let done = true;
        try { done = prog.isReady(); } catch { done = false; }
        if (!done && (this.syncTries.get(prog) || 0) < 2) { this.syncTries.set(prog, (this.syncTries.get(prog) || 0) + 1); later = true; continue; }
        try { prog.getUniforms(); } catch { /* broken program; don't retry every pump */ }
        this.synced.add(prog); this.stats.synced++; n++;
      }
      if (later) again.push(m);
    }
    for (const m of again) this.queue(m);
    this.flush();
  }
  private programsOf(m: Mat): Prog[] {
    const props = (this.g.renderer as unknown as { properties?: { get(m: object): { currentProgram?: Prog; programs?: Map<string, Prog> } } }).properties;
    if (!props) return [];
    try {
      const mp = props.get(m);
      if (mp.programs && mp.programs.size) return [...mp.programs.values()];
      return mp.currentProgram ? [mp.currentProgram] : [];
    } catch { return []; }
  }
  /** True once every acquired program has been finalized. A material that has not been compiled yet is not ready. */
  private ready(m: Mat) {
    const ps = this.programsOf(m);
    if (!ps.length) return false;
    for (const p of ps) if (!this.synced.has(p)) return false;
    return true;
  }
  private flush() {
    if (!this.holds.length) return;
    const keep: typeof this.holds = [];
    for (const h of this.holds) {
      let wait = false;
      for (const m of h.mats) if (!this.ready(m)) wait = true;
      if (wait && ++h.tries < 45) { keep.push(h); continue; }
      try { h.fn(); } catch { /* mesh already gone */ }
    }
    this.holds = keep;
  }
  /**
   * Compile the depth program the shadow pass will actually draw. three copies map / alphaTest
   * onto its depth material, flips the side, renders into a target (no tone mapping, working
   * color space) and passes an empty scene (no fog). Matching that here puts the program in the
   * shared cache; getUniforms then runs in the pump, not on the first shadow draw.
   * Instanced morph casters are skipped: a depth compile without their morph texture caches a
   * broken program and console.errors, which fails the phone soak.
   */
  /**
   * Shadow-compile a batch of casters with one light-gather. compile() walks the whole
   * scene for lights, so doing that per caster dominated the pump on a streaming frame.
   * Array materials keep the single-object path (one material swapped at a time).
   */
  private warmShadowBatch(list: O[], r: R): Mat[] {
    const out: Mat[] = [];
    const plan: { o: O; prev: O["material"]; depth: Mat }[] = [];
    for (const o of list) {
      if (!o.castShadow || !o.isMesh || !o.geometry || !r.compile) continue;
      const morph = o.geometry.morphAttributes;
      if (o.isInstancedMesh && ((o as { morphTexture?: unknown }).morphTexture || morph?.position || morph?.normal || morph?.color)) continue;
      if (Array.isArray(o.material) && !(o as { customDepthMaterial?: Mat }).customDepthMaterial) {
        for (const m of this.warmShadow(o, r)) out.push(m);
        continue;
      }
      const custom = (o as { customDepthMaterial?: Mat }).customDepthMaterial;
      const sources = custom ? [custom] : matsOf(o);
      for (const m of sources) {
        if (!m || m.visible === false) continue;
        const depth = custom ? m : this.depthMaterial(m);
        plan.push({ o, prev: o.material, depth });
        o.material = depth as O["material"];
        out.push(depth);
      }
    }
    if (!plan.length) return out;
    const uniq: O[] = [];
    const seen = new Set<O>();
    for (const p of plan) if (!seen.has(p.o)) { seen.add(p.o); uniq.push(p.o); }
    const host = this.shadowHost;
    host.traverse = ((cb: (obj: O) => void) => { for (const o of uniq) cb(o); }) as Scene["traverse"];
    host.traverseVisible = (() => {}) as Scene["traverseVisible"];
    const scene = this.g.scene as { fog: unknown };
    const renderer = this.g.renderer as unknown as { getRenderTarget: () => unknown };
    const prevGet = renderer.getRenderTarget;
    const prevFog = scene.fog;
    scene.fog = null;
    renderer.getRenderTarget = () => this.shadowDummy;
    try { r.compile!(host, this.g.camera, this.g.scene); this.stats.depth += plan.length; }
    catch { /* the real draw reports a genuinely broken material */ }
    finally {
      for (const p of plan) p.o.material = p.prev;
      scene.fog = prevFog;
      renderer.getRenderTarget = prevGet;
    }
    return out;
  }
  private warmShadow(o: O, r: R): Mat[] {
    if (!o.castShadow || !o.isMesh || !o.geometry || !r.compile) return [];
    const morph = o.geometry.morphAttributes;
    if (o.isInstancedMesh && ((o as { morphTexture?: unknown }).morphTexture || morph?.position || morph?.normal || morph?.color)) return [];
    const custom = (o as { customDepthMaterial?: Mat }).customDepthMaterial;
    const sources = custom ? [custom] : matsOf(o);
    const out: Mat[] = [];
    const scene = this.g.scene as { fog: unknown };
    const renderer = this.g.renderer as unknown as { getRenderTarget: () => unknown };
    const prevGet = renderer.getRenderTarget;
    const prevFog = scene.fog;
    const host = this.shadowHost;
    host.traverse = ((cb: (obj: O) => void) => { cb(o); }) as Scene["traverse"];
    host.traverseVisible = (() => {}) as Scene["traverseVisible"];
    scene.fog = null;
    renderer.getRenderTarget = () => this.shadowDummy;
    try {
      for (const m of sources) {
        if (!m || m.visible === false) continue;
        const depth = custom ? m : this.depthMaterial(m);
        const prev = o.material;
        o.material = depth;
        try { r.compile!(host, this.g.camera, this.g.scene); this.stats.depth++; } catch { /* the real draw reports a genuinely broken material */ }
        o.material = prev;
        out.push(depth);
        if (!this.ready(depth)) this.queue(depth);
      }
    } finally {
      scene.fog = prevFog;
      renderer.getRenderTarget = prevGet;
    }
    return out;
  }
  private depthMaterial(m: Mat): Mat {
    const side = shadowSideOf(m);
    const map = (m as { map?: { channel?: number } | null }).map || null;
    const alphaMap = (m as { alphaMap?: { channel?: number } | null }).alphaMap || null;
    const src = m as unknown as { displacementMap?: Tex | null; displacementScale?: number; displacementBias?: number; clipShadows?: boolean; clippingPlanes?: unknown; clipIntersection?: boolean };
    const disp = !!(src.displacementMap && src.displacementScale);
    const clip = !!(src.clipShadows && src.clippingPlanes);
    const key = [side, map ? 1 : 0, map?.channel || 0, alphaMap ? 1 : 0, alphaMap?.channel || 0, m.alphaToCoverage ? 1 : 0, (m.alphaTest || 0) > 0 ? 1 : 0, disp ? 1 : 0, clip ? 1 : 0, m.wireframe ? 1 : 0].join("|");
    let d = this.depthMats.get(key);
    if (!d) {
      d = new MeshDepthMaterial();
      d.side = side as MeshDepthMaterial["side"];
      d.wireframe = !!m.wireframe;
      d.map = map as MeshDepthMaterial["map"];
      d.alphaMap = alphaMap as MeshDepthMaterial["alphaMap"];
      d.alphaTest = m.alphaToCoverage ? 0.5 : (m.alphaTest || 0);
      if (disp) { d.displacementMap = src.displacementMap as MeshDepthMaterial["displacementMap"]; d.displacementScale = src.displacementScale || 1; d.displacementBias = src.displacementBias || 0; }
      if (clip) { d.clipShadows = true; d.clippingPlanes = src.clippingPlanes as MeshDepthMaterial["clippingPlanes"]; d.clipIntersection = !!src.clipIntersection; }
      this.depthMats.set(key, d);
    }
    return d as unknown as Mat;
  }
}
type Prog = { isReady: () => boolean; getUniforms: () => unknown };
function shadowSideOf(m: Mat) {
  const custom = (m as { shadowSide?: number | null }).shadowSide;
  if (custom !== null && custom !== undefined) return custom;
  const side = m.side || 0;
  return side === 2 ? 2 : side === 1 ? 0 : 1;
}
function matsOf(o: { material?: Mat | Mat[] }) {
  if (!o.material) return [];
  return Array.isArray(o.material) ? o.material.filter(Boolean) : [o.material];
}
function sig(m: Mat, f: string, lights: string) {
  let d = "";
  const def = m.defines;
  if (def) for (const k in def) d += k + def[k];
  let c = "";
  try { c = m.customProgramCacheKey ? m.customProgramCacheKey() : ""; } catch { c = ""; }
  return m.type + ":" + (m.side || 0) + (m.transparent ? "T" : "") + ((m.alphaTest || 0) > 0 ? "A" : "") + (m.alphaToCoverage ? "C" : "") +
    (m.vertexColors ? "V" : "") + (m.flatShading ? "F" : "") + (m.wireframe ? "W" : "") + (m.fog === false ? "f" : "") + (m.toneMapped === false ? "t" : "") +
    texBits(m) + ":" + f + ":" + d + ":" + c + ":" + lights;
}
function texBits(m: Mat) {
  const o = m as unknown as Record<string, Tex | null | undefined>;
  let s = "";
  for (let i = 0; i < TEX.length; i++) s += o[TEX[i]] ? "1" : "0";
  return s;
}
