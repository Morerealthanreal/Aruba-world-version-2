// Phone frame-cost trims (r186), off with ?mperf=0:
//  - sun shadow map re-renders every 2nd frame (static world; only cars/peds move) like HIGH's hiPerf
//  - shader warm-up: materials of regions streamed in ahead/off-screen are compiled (parallel,
//    non-blocking where KHR_parallel_shader_compile exists) before they first come into view,
//    instead of stalling the frame they appear in.
//    Incremental (default, ?warmup=full for the old way): every 0.5 s only objects not seen before
//    are checked and one per program-relevant signature is compiled against the scene's lights;
//    compileAsync(scene) walked all ~5k objects (getParameters each, ~65 ms on the main thread).
import type { Object3D } from "three";
import type { AGame } from "./env";
type R = {
  shadowMap: { autoUpdate: boolean; needsUpdate: boolean };
  compileAsync?: (s: unknown, c: unknown, t?: unknown) => Promise<unknown>;
};
type O = Object3D & {
  isMesh?: boolean; isPoints?: boolean; isLine?: boolean; isSprite?: boolean; isLight?: boolean;
  isInstancedMesh?: boolean; isBatchedMesh?: boolean; isSkinnedMesh?: boolean; instanceColor?: unknown; _colorsTexture?: unknown;
  material?: { id: number; version: number } | { id: number; version: number }[];
  geometry?: { attributes: Record<string, unknown>; morphAttributes: Record<string, unknown[]> };
};
export class MobilePerf {
  on: boolean; private n = 0; private t = 1; private busy = false;
  private seen = new WeakSet<object>(); private keys = new Set<string>(); private lightKey = "";
  stats = { compiles: 0, objs: 0, reps: 0 };
  constructor(private g: AGame, mobile: boolean, private incremental = true) { this.on = mobile; }
  frame(dt: number) {
    if (!this.on) return;
    const r = this.g.renderer as unknown as R;
    r.shadowMap.autoUpdate = false;
    if ((this.n++ & 1) === 0) r.shadowMap.needsUpdate = true;
    if ((this.t -= dt) > 0 || this.busy || !r.compileAsync) return;
    if (!this.incremental) {
      this.t = 4; this.busy = true;
      r.compileAsync(this.g.scene, this.g.camera).then(() => { this.stats.compiles++; }, () => {}).finally(() => { this.busy = false; });
      return;
    }
    this.t = 0.5;
    const reps = this.scan();
    if (!reps.length) return;
    this.busy = true; this.stats.reps += reps.length;
    const root = { traverse: (cb: (o: O) => void) => { for (const o of reps) cb(o); }, traverseVisible: () => {} };
    r.compileAsync(root, this.g.camera, this.g.scene).then(() => { this.stats.compiles++; }, () => {}).finally(() => { this.busy = false; });
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
      for (const m of mats) {
        const k = m.id + ":" + m.version + ":" + f;
        if (!this.keys.has(k)) { this.keys.add(k); add = true; }
      }
      if (add) reps.push(o);
    });
    return reps;
  }
}
