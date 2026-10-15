// Phone frame-cost trims (r186), off with ?mperf=0:
//  - sun shadow map re-renders every 2nd frame (static world; only cars/peds move) like HIGH's hiPerf
//  - shader warm-up: materials of regions streamed in ahead/off-screen are compiled (parallel,
//    non-blocking where KHR_parallel_shader_compile exists) before they first come into view,
//    instead of stalling the frame they appear in.
//    Incremental (default, ?warmup=full for the old way): every 0.5 s only objects not seen before
//    are checked and one per program-relevant signature is compiled against the scene's lights;
//    compileAsync(scene) walked all ~5k objects (getParameters each, ~65 ms on the main thread).
//  - texture pre-upload (opt-in ?preup=1): the textures of those new objects are uploaded ~2 per frame
//    (renderer.initTexture) so the first frame that draws them does not also pay the upload. Off by
//    default: it also uploads textures of objects that never get drawn (headless drive: 2.4x upload time).
import type { Object3D } from "three";
import type { AGame } from "./env";
type R = {
  shadowMap: { autoUpdate: boolean; needsUpdate: boolean };
  compileAsync?: (s: unknown, c: unknown, t?: unknown) => Promise<unknown>;
};
type Tex = { isTexture?: boolean; isCubeTexture?: boolean; version: number; image: unknown };
const TEX = ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap", "alphaMap", "bumpMap", "lightMap", "specularMap", "clearcoatNormalMap"];
type O = Object3D & {
  isMesh?: boolean; isPoints?: boolean; isLine?: boolean; isSprite?: boolean; isLight?: boolean;
  isInstancedMesh?: boolean; isBatchedMesh?: boolean; isSkinnedMesh?: boolean; instanceColor?: unknown; _colorsTexture?: unknown;
  material?: { id: number; version: number } | { id: number; version: number }[];
  geometry?: { attributes: Record<string, unknown>; morphAttributes: Record<string, unknown[]> };
};
export class MobilePerf {
  on: boolean; private n = 0; private t = 1; private busy = false;
  private seen = new WeakSet<object>(); private keys = new Set<string>(); private lightKey = "";
  private seenTex = new WeakSet<object>(); private texQ: Tex[] = []; private pend: O[] = [];
  stats = { compiles: 0, objs: 0, reps: 0, uploads: 0 };
  constructor(private g: AGame, mobile: boolean, private incremental = true, private preUpload = false) { this.on = mobile; }
  frame(dt: number) {
    if (!this.on) return;
    const r = this.g.renderer as unknown as R;
    r.shadowMap.autoUpdate = false;
    if ((this.n++ & 1) === 0) r.shadowMap.needsUpdate = true;
    if (this.texQ.length) this.upload();
    if (((this.t -= dt) > 0 && !this.pend.length) || this.busy || !r.compileAsync) return;
    if (!this.incremental) {
      this.t = 4; this.busy = true;
      r.compileAsync(this.g.scene, this.g.camera).then(() => { this.stats.compiles++; }, () => {}).finally(() => { this.busy = false; });
      return;
    }
    // a new region can bring 10+ new programs; building them is main-thread work, so at most 4 per batch
    if (!this.pend.length) { this.t = 0.5; this.pend = this.scan(); }
    const reps = this.pend.splice(0, 4).filter((o) => o.parent);
    if (!reps.length) return;
    this.busy = true; this.stats.reps += reps.length;
    const root = { traverse: (cb: (o: O) => void) => { for (const o of reps) cb(o); }, traverseVisible: () => {} };
    r.compileAsync(root, this.g.camera, this.g.scene).then(() => { this.stats.compiles++; }, () => {}).finally(() => { this.busy = false; });
  }
  // upload textures of newly streamed objects before they are first drawn, ~2 per frame
  private upload() {
    const r = this.g.renderer as unknown as { initTexture(t: Tex): void; properties: { get(t: Tex): { __version?: number } } };
    const t0 = performance.now();
    for (let n = 0; n < 2 && this.texQ.length && performance.now() - t0 < 3; ) {
      const t = this.texQ.shift()!, img = t.image as { complete?: boolean } | null | undefined;
      if (t.version === 0 || !img || img.complete === false) { if (this.texQ.length) this.texQ.push(t); else this.seenTex.delete(t); break; }
      if (r.properties.get(t).__version === t.version) continue;
      r.initTexture(t); n++; this.stats.uploads++;
    }
  }
  private scan(): O[] {
    const reps: O[] = []; let lk = "";
    const visit = (o: O) => {
      if (!o.visible) return;
      if (o.isLight) lk += o.type + (o.castShadow ? "s" : "") + ",";
      for (const c of o.children) visit(c as O);
    };
    visit(this.g.scene as unknown as O);
    if (lk !== this.lightKey) { this.lightKey = lk; this.keys.clear(); this.seen = new WeakSet(); }
    this.g.scene.traverse((ob) => {
      const o = ob as O;
      if (this.seen.has(o) || !(o.isMesh || o.isPoints || o.isLine || o.isSprite) || !o.material) return;
      this.seen.add(o); this.stats.objs++;
      const geo = o.geometry, at = geo ? geo.attributes : {}, mats = Array.isArray(o.material) ? o.material : [o.material];
      const f = (o.isInstancedMesh ? (o.instanceColor ? "I" : "i") : "") + (o.isBatchedMesh ? (o._colorsTexture ? "B" : "b") : "") +
        (o.isSkinnedMesh ? "s" : "") + (o.receiveShadow ? "r" : "") + (at.color ? "c" : "") + (at.tangent ? "t" : "") +
        (at.uv1 ? "1" : "") + (at.uv2 ? "2" : "") + (geo && Object.keys(geo.morphAttributes).length ? "m" : "") + o.type;
      let add = false;
      if (this.preUpload) for (const m of mats) for (const k of TEX) { const t = (m as unknown as Record<string, Tex | null>)[k]; if (t && t.isTexture && !t.isCubeTexture && !this.seenTex.has(t)) { this.seenTex.add(t); this.texQ.push(t); } }
      for (const m of mats) {
        const k = m.id + ":" + m.version + ":" + f;
        if (!this.keys.has(k)) { this.keys.add(k); add = true; }
      }
      if (add) reps.push(o);
    });
    return reps;
  }
}
