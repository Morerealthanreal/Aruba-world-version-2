// Frame-cost trims (r186). Off with ?mperf=0.
//  - Phone only: sun shadow map re-renders every 2nd frame (static world; cars/peds move), same as HIGH's hiPerf.
//  - Every device: shader warm-up, including the shadow-map depth variants. Materials are compiled
//    from a signature (not material.id — instances share programs). KHR_parallel_shader_compile plus
//    compileAsync links them off the main thread; getUniforms runs only once the driver reports the
//    program ready, and only a couple per turn. ?warmup=full restores the old whole-scene compileAsync.
//  - Textures of those new meshes upload via initTexture, one per idle slice, so a streaming frame
//    does not upload the whole queue. Default on; ?preup=0 disables. Only textures of meshes we warm.
//  - A hero's materials compile once the model is in the scene and the player is within 3 km
//    (one 1 km region before the 2 km show distance). The model stays hidden until 2 km, same as before.
import { MeshDepthMaterial, Scene } from "three";
import type { Object3D } from "three";
import type { AGame } from "./env";
type R = {
  shadowMap: { autoUpdate: boolean; needsUpdate: boolean };
  compile?: (s: unknown, c: unknown, t?: unknown) => unknown;
  compileAsync?: (s: unknown, c: unknown, t?: unknown) => Promise<unknown>;
  debug?: { checkShaderErrors: boolean };
};
type Tex = { isTexture?: boolean; isCubeTexture?: boolean; version: number; image: unknown; __awGone?: number };
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
  private stack: O[] = []; private onStack = new WeakSet<object>(); private childN = new WeakMap<object, number>(); private lc = 0;
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
  private holds: { fn: () => void; mats: Mat[]; tries: number; wait?: O }[] = [];
  private heroSeen = new WeakSet<object>();
  private idleArmed = false;
  /** True when the context can link shaders without blocking the caller. */
  private parallel = false;
  /** Large first uploads. The mesh stays undrawn until the slices land, so one bufferData is not a freeze. */
  private bufJobs = new Map<WebGLBuffer, { target: number; data: ArrayBufferView; offset: number }>();
  private stepBuf: (budget?: number) => void = () => {};
  constructor(private g: AGame, mobile: boolean, private incremental = true, private preUpload = true) {
    this.on = mobile;
    try { this.parallel = !!(g.renderer.getContext() as WebGL2RenderingContext).getExtension("KHR_parallel_shader_compile"); } catch { /* software GL without the extension still compiles, just inline */ }
    this.hookBuffers();
    const A = g.real as unknown as { update?: (...a: number[]) => unknown } | null;
    if (A && A.update) {
      const orig = A.update.bind(A);
      A.update = (...a: number[]) => { this.beforeRender(); return orig(...a); };
    }
  }
  /** Phone shadow cadence only. Walking and compiling here was a steady tax on every streaming frame. */
  beforeRender() {
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
    // A short slice. The pump comes back next frame; finishing the whole queue here was the freeze.
    while (this.stack.length && performance.now() - t0 < 4) this.walk(2);
    this.warmHeroes();
    if (this.pend.length && performance.now() - t0 < 8) this.pump(4);
    this.sync(2);
    if (this.preUpload && this.texQ.length) this.upload(1, 5);
    this.stepBuf(4);
    this.armIdle();
  }
  /**
   * Heroes show at 2 km. Their GLB is requested from 3 km (one region further out) and compiled
   * while the group is still invisible, so the first visit does not link those programs on the draw.
   */
  private warmHeroes() {
    const list = (this.g.real as unknown as { hero?: { list?: { x: number; z: number; _g?: O }[] } } | null)?.hero?.list;
    if (!list) return;
    const s = this.g.S;
    const p = s.mode === "plane" ? s.plane : s.mode === "walk" ? s.walk : s.car;
    for (const n of list) {
      const g = n._g;
      if (!g || this.heroSeen.has(g)) continue;
      if (Math.hypot(n.x - p.x, n.z - p.z) > 3000) continue;
      this.heroSeen.add(g);
      this.prime(g);
    }
  }
  /** One initTexture while the browser is idle, and another slice of any large buffer. */
  private armIdle() {
    if (this.idleArmed) return;
    if (!this.bufJobs.size && (!this.preUpload || !this.texQ.length)) return;
    const ric = window.requestIdleCallback;
    if (!ric) return;
    this.idleArmed = true;
    ric((d) => {
      this.idleArmed = false;
      const budget = Math.max(1, Math.min(5, d.timeRemaining() || 1));
      if (this.preUpload) this.upload(1, budget);
      this.stepBuf(budget);
      if (this.bufJobs.size || (this.preUpload && this.texQ.length)) this.armIdle();
    }, { timeout: 32 });
  }
  /** Programs still waiting to be finalized. The pump keeps going until this is 0 so the next frame does not draw them cold. */
  shaderPending() { return this.syncQ.length + this.holds.length + this.pend.length; }
  /** Scene walk or a texture upload still queued. Incomplete images are not included, so a loading texture cannot spin the pump. */
  backlog() {
    if (this.stack.length) return 1;
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
    const mats = matsOf(obj);
    if (onReady) this.holds.push({ fn: onReady, mats, tries: 0, wait: obj });
    // Turbo plumes are primed before they join the scene. Everything else is compiled
    // with the next pump slice so this call does not link programs inline.
    if (!obj.parent) {
      const r = this.g.renderer as unknown as R;
      this.compileObjects([obj], r);
      for (const m of this.warmShadow(obj, r)) if (!this.ready(m)) this.queue(m);
      for (const m of mats) if (m && !this.ready(m)) this.queue(m);
      return;
    }
    this.pend.push(obj);
  }
  pending() { return this.pend.length + this.stack.length + this.inflight + this.syncQ.length + this.holds.length + this.bufJobs.size + (this.busy ? 1 : 0) + this.backlog(); }
  /**
   * A first upload bigger than 128 KB is allocated empty and filled 16 KB at a time.
   * Draws that use that buffer are skipped until the slices finish, then the mesh appears whole.
   * A second update of the same buffer (dynamic data) uploads in full so it cannot stay sliced forever.
   * At most two buffers are in flight; anything further uploads the way three always did.
   */
  private hookBuffers() {
    const gl = this.g.renderer.getContext() as WebGL2RenderingContext;
    const CHUNK = 16 * 1024, BIG = 128 * 1024;
    const jobs = this.bufJobs;
    const origData = gl.bufferData.bind(gl);
    const origSub = gl.bufferSubData.bind(gl);
    const origDelete = gl.deleteBuffer.bind(gl);
    const origBind = gl.bindBuffer.bind(gl);
    const origVAO = gl.bindVertexArray.bind(gl);
    const vaoBufs = new WeakMap<object, Set<WebGLBuffer>>();
    const defaultBufs = new Set<WebGLBuffer>();
    let curSet = defaultBufs;
    let boundA = gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer | null;
    let boundE = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING) as WebGLBuffer | null;
    const note = (buf: WebGLBuffer | null) => { if (buf) curSet.add(buf); };
    gl.bindBuffer = ((target: number, buf: WebGLBuffer | null) => {
      if (target === gl.ARRAY_BUFFER) boundA = buf;
      else if (target === gl.ELEMENT_ARRAY_BUFFER) { boundE = buf; note(buf); }
      return origBind(target, buf);
    }) as typeof gl.bindBuffer;
    gl.bindVertexArray = ((vao: WebGLVertexArrayObject | null) => {
      origVAO(vao);
      if (vao) { let s = vaoBufs.get(vao); if (!s) { s = new Set(); vaoBufs.set(vao, s); } curSet = s; }
      else curSet = defaultBufs;
      boundE = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING) as WebGLBuffer | null;
      note(boundE);
    }) as typeof gl.bindVertexArray;
    const origAttrib = gl.vertexAttribPointer.bind(gl);
    gl.vertexAttribPointer = ((...a: Parameters<WebGL2RenderingContext["vertexAttribPointer"]>) => { note(boundA); return origAttrib(...a); }) as typeof gl.vertexAttribPointer;
    const origAttribI = gl.vertexAttribIPointer.bind(gl);
    gl.vertexAttribIPointer = ((...a: Parameters<WebGL2RenderingContext["vertexAttribIPointer"]>) => { note(boundA); return origAttribI(...a); }) as typeof gl.vertexAttribIPointer;
    const bindingOf = (target: number) => target === gl.ARRAY_BUFFER ? gl.ARRAY_BUFFER_BINDING : target === gl.ELEMENT_ARRAY_BUFFER ? gl.ELEMENT_ARRAY_BUFFER_BINDING : 0;
    const bound = (target: number) => { const b = bindingOf(target); return b ? gl.getParameter(b) as WebGLBuffer | null : null; };
    // origBind, not gl.bindBuffer: slicing must not attach the buffer to whatever VAO is current.
    const bind = (target: number, buf: WebGLBuffer | null) => {
      if (target === gl.ARRAY_BUFFER) boundA = buf;
      else if (target === gl.ELEMENT_ARRAY_BUFFER) boundE = buf;
      origBind(target, buf);
    };
    this.stepBuf = (budget = 4) => {
      if (!jobs.size) return;
      const t0 = performance.now();
      const prevA = boundA, prevE = boundE;
      for (const [buf, job] of jobs) {
        if (performance.now() - t0 > budget) break;
        const data = job.data, el = (data as { BYTES_PER_ELEMENT?: number }).BYTES_PER_ELEMENT || 1;
        const left = data.byteLength - job.offset;
        if (left <= 0) { jobs.delete(buf); continue; }
        const count = Math.max(1, Math.floor(Math.min(CHUNK, left) / el));
        const start = (job.offset / el) | 0;
        bind(job.target, buf);
        origSub(job.target, job.offset, data, start, count);
        job.offset += count * el;
        if (job.offset >= data.byteLength) jobs.delete(buf);
      }
      if (boundA !== prevA) bind(gl.ARRAY_BUFFER, prevA);
      if (boundE !== prevE) bind(gl.ELEMENT_ARRAY_BUFFER, prevE);
    };
    gl.bufferData = ((target: number, data: ArrayBufferView | number, usage: number) => {
      if (typeof data === "number" || !data || jobs.size >= 2 || data.byteLength <= BIG) return origData(target, data as never, usage);
      const buf = bound(target);
      if (!buf) return origData(target, data as never, usage);
      origData(target, data.byteLength, usage);
      jobs.set(buf, { target, data, offset: 0 });
      this.stepBuf(4);
    }) as typeof gl.bufferData;
    gl.bufferSubData = ((target: number, offset: number, data: ArrayBufferView, srcOffset?: number, length?: number) => {
      if (srcOffset !== undefined || !data) return origSub(target, offset, data, srcOffset as number, length as number);
      const buf = bound(target);
      if (buf && jobs.has(buf)) { jobs.delete(buf); return origSub(target, offset, data); }
      if (offset === 0 && data.byteLength > BIG && jobs.size < 2 && buf) {
        jobs.set(buf, { target, data, offset: 0 });
        this.stepBuf(4);
        return;
      }
      return origSub(target, offset, data);
    }) as typeof gl.bufferSubData;
    gl.deleteBuffer = ((buf: WebGLBuffer | null) => { if (buf) jobs.delete(buf); return origDelete(buf); }) as typeof gl.deleteBuffer;
    const blocked = () => {
      if (!jobs.size) return false;
      for (const buf of jobs.keys()) if (curSet.has(buf) || buf === boundA || buf === boundE) return true;
      return false;
    };
    const skip = (fn: (...a: never[]) => unknown) => function (this: unknown, ...a: never[]) {
      if (blocked()) return;
      return fn.apply(gl, a);
    };
    for (const name of ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced"] as const) {
      const fn = gl[name];
      if (typeof fn === "function") (gl as unknown as Record<string, unknown>)[name] = skip(fn.bind(gl) as (...a: never[]) => unknown);
    }
    const ext = gl.getExtension("WEBGL_multi_draw") as { multiDrawArraysWEBGL?: (...a: never[]) => unknown; multiDrawElementsWEBGL?: (...a: never[]) => unknown } | null;
    if (ext) for (const name of ["multiDrawArraysWEBGL", "multiDrawElementsWEBGL"] as const) {
      const fn = ext[name];
      if (typeof fn === "function") ext[name] = skip(fn.bind(ext) as (...a: never[]) => unknown);
    }
  }
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
      // A region unload disposes its street-sign atlas. initTexture would allocate it again.
      if (t.__awGone) continue;
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
        if (!first) { this.keys.clear(); this.depthMats.clear(); this.seen = new WeakSet(); this.childN = new WeakMap(); this.stack.length = 0; this.onStack = new WeakSet(); }
      }
    }
    this.enqueue(this.g.scene as unknown as O);
    const regs = (this.g.real as unknown as { regions?: Map<string, Reg> } | null)?.regions;
    if (regs) for (const R of regs.values()) this.enqueue(R.group as O | undefined);
  }
  /** One queue entry per node. A detached node is dropped so an unloaded region is not kept alive by the walk. */
  private enqueue(o: O | undefined | null) {
    const scene = this.g.scene as unknown as O;
    if (!o || this.onStack.has(o)) return;
    if (o !== scene && !o.parent) return;
    if (this.childN.get(o) === o.children.length) return;
    this.onStack.add(o);
    this.stack.push(o);
  }
  private walk(budget: number) {
    const t0 = performance.now();
    const scene = this.g.scene as unknown as O;
    let n = 0;
    while (this.stack.length && n < 800 && performance.now() - t0 < budget) {
      const o = this.stack.pop()!;
      this.onStack.delete(o);
      if (o !== scene && !o.parent) continue;
      const ch = o.children, cn = ch.length;
      if (this.childN.get(o) === cn) { n++; continue; } // unchanged node; a new child flips the count and re-walks siblings
      this.childN.set(o, cn);
      for (let i = 0; i < cn; i++) this.enqueue(ch[i] as O);
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
    // prime() may hand us a hero group. compile() only sees what traverse visits.
    const flat: O[] = [];
    walkDrawables(objs, (o) => flat.push(o));
    const depth = this.warmShadowBatch(flat, r);
    const finish = () => {
      for (const m of depth) if (!this.ready(m)) this.queue(m);
      for (const o of flat) for (const m of matsOf(o)) if (!this.ready(m)) this.queue(m);
      for (const h of this.holds) if (h.wait && flat.includes(h.wait)) for (const m of depth) if (!h.mats.includes(m)) h.mats.push(m);
    };
    // compileAsync polls COMPLETION_STATUS_KHR and resolves when the link is done.
    // Calling it (not compile + an immediate getUniforms) keeps this turn off the driver wait.
    if (this.parallel && r.compileAsync) {
      const root = { traverse: (cb: (o: O) => void) => { for (const x of flat) cb(x); }, traverseVisible: () => {} };
      this.inflight++;
      r.compileAsync(root, this.g.camera, this.g.scene).then(finish, () => {}).finally(() => { this.inflight--; });
    } else {
      this.compileObjects(flat, r);
      finish();
    }
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
   * Runs outside the animation callback. With KHR_parallel_shader_compile, getUniforms
   * waits on the driver, so it runs only after isReady(). A program that never reports
   * ready is finalized after a few dozen polls so the pump cannot spin forever.
   */
  private sync(max: number) {
    if (!this.syncQ.length && !this.holds.length) { this.flush(); return; }
    const t0 = performance.now();
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
        if (n >= max || performance.now() - t0 > 8) { later = true; break; }
        let done = true;
        try { done = prog.isReady(); } catch { done = false; }
        if (!done && (this.syncTries.get(prog) || 0) < 30) { this.syncTries.set(prog, (this.syncTries.get(prog) || 0) + 1); later = true; continue; }
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
function walkDrawables(list: O[], cb: (o: O) => void) {
  const stack = list.slice();
  while (stack.length) {
    const o = stack.pop()!;
    if (o.isMesh || o.isPoints || o.isLine || o.isSprite) cb(o);
    for (let i = 0; i < o.children.length; i++) stack.push(o.children[i] as O);
  }
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
