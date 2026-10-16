// Frame-cost trims (r186). Off with ?mperf=0.
//  - Phone only: sun shadow map re-renders every 2nd frame (static world; cars/peds move), same as HIGH's hiPerf.
//  - Every device: shader warm-up. Materials are compiled from a signature (not material.id — instances
//    share programs), at most two per frame, starting the frame a mesh is streamed in and again at the
//    end of the tile-job pump so the GPU links before the next draw. ?warmup=full restores the old
//    whole-scene compileAsync.
//  - Textures of those new meshes upload one per frame (renderer.initTexture) so the first draw is not
//    also the upload. Default on; ?preup=0 disables. Only textures of meshes we actually warm.
import { BufferGeometry, Mesh, MeshDepthMaterial } from "three";
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
  private depthMat = new MeshDepthMaterial(); private depthMesh = new Mesh(); private empty = new BufferGeometry();
  private depthKeys = new Set<string>();
  stats = { compiles: 0, objs: 0, reps: 0, uploads: 0, depth: 0, synced: 0 };
  private synced = new WeakSet<object>();
  private syncQ: Mat[] = [];
  private queued = new WeakSet<object>();
  private syncTries = new WeakMap<object, number>();
  private holds: { fn: () => void; mats: Mat[]; tries: number; wait?: O }[] = [];
  /** Meshes compiled outside the animation callback (hero GLBs). beforeRender does not drain this. */
  private later: O[] = [];
  constructor(private g: AGame, mobile: boolean, private incremental = true, private preUpload = true) {
    this.on = mobile;
    const A = g.real as unknown as { update?: (...a: number[]) => unknown; hero?: { group?: O } } | null;
    if (A && A.update) {
      const orig = A.update.bind(A);
      A.update = (...a: number[]) => { this.beforeRender(); return orig(...a); };
    }
    this.hookHero(A?.hero?.group);
  }
  /**
   * Palm Beach and Oranjestad heroes arrive as a GLB full of new materials. Compiling
   * them on the frame they are added is the first-visit hitch. Keep the meshes off the
   * camera until the job pump has compiled them, between frames.
   */
  private hookHero(group?: O) {
    if (!group || !this.incremental || !group.add) return;
    const add = group.add.bind(group);
    group.add = ((...objs: O[]) => {
      for (const obj of objs) this.deferHero(obj);
      return add(...objs);
    }) as O["add"];
  }
  private deferHero(obj: O) {
    const meshes: O[] = [];
    obj.traverse((o) => { const m = o as O; if (m.isMesh) meshes.push(m); });
    if (!meshes.length) return;
    let left = meshes.length;
    const show = () => { if (--left > 0) return; for (const m of meshes) m.layers.enable(0); };
    for (const m of meshes) {
      m.layers.disable(0);
      this.later.push(m);
      this.holds.push({ fn: show, mats: matsOf(m), tries: 0, wait: m });
    }
  }
  /** Shadow cadence, a slice of the warm-up walk, and at most two compiles. Runs at the start of A's update, before the render. */
  beforeRender() {
    if (this.on) {
      const r = this.g.renderer as unknown as R;
      r.shadowMap.autoUpdate = false;
      if ((this.n++ & 1) === 0) r.shadowMap.needsUpdate = true;
    }
    if (!this.incremental) return;
    if (this.preUpload && this.texQ.length) this.upload(1);
    this.seed();
    this.walk(0.7);
    this.pump(2);
  }
  frame(dt: number) {
    if (!this.incremental) {
      if (!this.busy) this.full(dt);
      return;
    }
    // the update hook covers the render; this catches a frame where A didn't update
    if (this.pend.length) this.pump(1);
  }
  /** Called at the end of the tile-job pump, after new meshes exist and before the next frame. */
  afterJobs() {
    if (!this.incremental) return;
    if (this.later.length) { this.pend.push(...this.later); this.later.length = 0; }
    this.seed();
    this.walk(1.2);
    this.pump(2);
    // getUniforms (the first-draw stall) runs here, outside the animation callback
    this.sync(8);
    if (this.preUpload && this.texQ.length) this.upload(1);
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
    if (obj.castShadow && obj.isMesh && obj.geometry) this.warmDepth(obj, r);
    const mats = matsOf(obj);
    if (obj.castShadow) mats.push(this.depthMat as unknown as Mat);
    const pending: Mat[] = [];
    for (const m of mats) if (m && !this.ready(m)) pending.push(m);
    for (const m of pending) this.queue(m);
    if (!pending.length) { onReady?.(); return; }
    if (onReady) this.holds.push({ fn: onReady, mats: pending, tries: 0 });
  }
  pending() { return this.pend.length + this.later.length + this.stack.length + this.inflight + this.syncQ.length + this.holds.length + (this.busy ? 1 : 0); }
  private full(dt: number) {
    if ((this.t -= dt) > 0) return;
    const r = this.g.renderer as unknown as R;
    if (!r.compileAsync) return;
    this.t = 4; this.busy = true;
    r.compileAsync(this.g.scene, this.g.camera).then(() => { this.stats.compiles++; }, () => {}).finally(() => { this.busy = false; });
  }
  private upload(max: number) {
    const r = this.g.renderer as unknown as { initTexture(t: Tex): void; properties: { get(t: Tex): { __version?: number } } };
    const t0 = performance.now();
    let n = 0;
    const defer: Tex[] = [];
    let guard = 0;
    while (this.texQ.length && n < max && guard++ < 24 && performance.now() - t0 < 2) {
      const t = this.texQ.shift()!, img = t.image as { complete?: boolean } | null | undefined;
      if (t.__awGone) continue;
      // Not ready yet: keep it, but let a later texture in this slice upload.
      if (t.version === 0 || !img || img.complete === false) { defer.push(t); continue; }
      if (r.properties.get(t).__version === t.version) continue;
      try { r.initTexture(t); } catch { defer.push(t); continue; }
      n++; this.stats.uploads++;
    }
    if (defer.length) this.texQ.push(...defer);
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
        if (!first) { this.keys.clear(); this.depthKeys.clear(); this.seen = new WeakSet(); this.childN = new WeakMap(); this.stack.length = 0; this.onStack = new WeakSet(); }
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
      if (this.preUpload && o.visible) for (const slot of TEX) {
        const t = (m as unknown as Record<string, Tex | null>)[slot];
        if (t && t.isTexture && !t.isCubeTexture && !this.seenTex.has(t)) { this.seenTex.add(t); this.texQ.push(t); }
      }
    }
    if (add) this.pend.push(o);
  }
  private pump(max: number) {
    const r = this.g.renderer as unknown as R;
    if (!r.compile || !this.pend.length) return;
    const t0 = performance.now();
    let n = 0;
    while (this.pend.length && n < max && performance.now() - t0 < 2) {
      const o = this.pend.shift()!;
      if (!o.parent && o !== (this.g.scene as unknown as O)) continue;
      const reps = [o];
      const root = { traverse: (cb: (o: O) => void) => { for (const x of reps) cb(x); }, traverseVisible: () => {} };
      this.compileObject(o, r);
      (o as O & { __awCompiled?: number }).__awCompiled = 1;
      if (o.castShadow && o.isMesh && o.geometry) this.warmDepth(o, r);
      for (const m of matsOf(o)) if (!this.ready(m)) this.queue(m);
      n++;
    }
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
  /** Finalize programs whose link has finished. Skips any that are still compiling — getUniforms would block. */
  private sync(budget: number) {
    const props = (this.g.renderer as unknown as { properties?: { get(m: object): { currentProgram?: Prog } } }).properties;
    if (!props || (!this.syncQ.length && !this.holds.length)) { this.flush(props); return; }
    const t0 = performance.now();
    const again: Mat[] = [];
    const q = this.syncQ;
    this.syncQ = [];
    let n = 0;
    for (const m of q) {
      this.queued.delete(m);
      if (n >= 2 || performance.now() - t0 > budget) { again.push(m); continue; }
      let prog: Prog | undefined;
      try { prog = props.get(m).currentProgram; } catch { continue; }
      if (!prog || this.synced.has(prog)) continue;
      let done = true;
      try { done = prog.isReady(); } catch { done = false; }
      // A few non-blocking polls, then finalize here anyway. Some drivers only finish the
      // link inside getProgramInfoLog, and that has to happen outside the animation callback.
      if (!done && (this.syncTries.get(m) || 0) < 8) { this.syncTries.set(m, (this.syncTries.get(m) || 0) + 1); again.push(m); continue; }
      try { prog.getUniforms(); } catch { /* broken program; don't retry every pump */ }
      this.synced.add(prog); this.stats.synced++; n++;
    }
    for (const m of again) this.queue(m);
    this.flush(props);
  }
  private ready(m: Mat) {
    const props = (this.g.renderer as unknown as { properties?: { get(m: object): { currentProgram?: Prog } } }).properties;
    if (!props) return true;
    try {
      const p = props.get(m).currentProgram;
      return !p || this.synced.has(p);
    } catch { return true; }
  }
  private flush(props?: { get(m: object): { currentProgram?: Prog } }) {
    if (!this.holds.length) return;
    const keep: typeof this.holds = [];
    for (const h of this.holds) {
      if (h.wait && !(h.wait as O & { __awCompiled?: number }).__awCompiled) {
        if (++h.tries < 90) keep.push(h); else try { h.fn(); } catch { /* mesh already gone */ }
        continue;
      }
      let wait = false;
      if (props) for (const m of h.mats) {
        try {
          const p = props.get(m).currentProgram;
          if (p && !this.synced.has(p)) wait = true;
        } catch { /* disposed */ }
      }
      if (wait && ++h.tries < 45) { keep.push(h); continue; }
      try { h.fn(); } catch { /* mesh already gone */ }
    }
    this.holds = keep;
  }
  // Shadow passes use one shared MeshDepthMaterial (alpha-tested materials clone it). Compiling the
  // shared variant here starts that link with the game's program cache; a mismatch only adds an unused program.
  private warmDepth(o: O, r: R) {
    const morph = o.geometry?.morphAttributes;
    // Instanced / skinned / morph casters need MORPHTARGETS_COUNT and bone setup this dummy
    // does not have. Compiling them caches a broken depth program and console.errors on first use.
    if (o.isSkinnedMesh || o.isInstancedMesh || (o as { morphTexture?: unknown }).morphTexture) return;
    if (morph && (morph.position || morph.normal || morph.color)) return;
    const k = (o.isBatchedMesh ? "B" : "") + (o.isInstancedMesh ? "I" : "") + (o.isSkinnedMesh ? "s" : "");
    if (this.depthKeys.has(k)) return;
    this.depthKeys.add(k);
    const mesh = this.depthMesh as unknown as O & { isBatchedMesh?: boolean; isInstancedMesh?: boolean; isSkinnedMesh?: boolean };
    mesh.geometry = o.geometry as BufferGeometry;
    mesh.material = this.depthMat as unknown as Mat;
    mesh.castShadow = true; mesh.visible = true; mesh.frustumCulled = false;
    mesh.isBatchedMesh = !!o.isBatchedMesh; mesh.isInstancedMesh = !!o.isInstancedMesh; mesh.isSkinnedMesh = !!o.isSkinnedMesh;
    try { r.compile!(mesh, this.g.camera, this.g.scene); this.stats.depth++; } catch { /* depth variant is best-effort */ }
    if (!this.ready(this.depthMat as unknown as Mat)) this.queue(this.depthMat as unknown as Mat);
    mesh.isBatchedMesh = false; mesh.isInstancedMesh = false; mesh.isSkinnedMesh = false;
    mesh.geometry = this.empty;
  }
}
type Prog = { isReady: () => boolean; getUniforms: () => unknown };
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
