// Phone frame-cost trims (r186), off with ?mperf=0:
//  - sun shadow map re-renders every 2nd frame (static world; only cars/peds move) like HIGH's hiPerf
//  - shader warm-up: renderer.compileAsync(scene) every 4 s, so materials of regions streamed in
//    ahead/off-screen are compiled (parallel, non-blocking where KHR_parallel_shader_compile exists)
//    before they first come into view, instead of stalling the frame they appear in.
import type { AGame } from "./env";
type R = { shadowMap: { autoUpdate: boolean; needsUpdate: boolean }; compileAsync?: (s: unknown, c: unknown) => Promise<unknown> };
export class MobilePerf {
  on: boolean; private n = 0; private t = 1; private busy = false;
  stats = { compiles: 0 };
  constructor(private g: AGame, mobile: boolean) { this.on = mobile; }
  frame(dt: number) {
    if (!this.on) return;
    const r = this.g.renderer as unknown as R;
    r.shadowMap.autoUpdate = false;
    if ((this.n++ & 1) === 0) r.shadowMap.needsUpdate = true;
    if ((this.t -= dt) <= 0 && !this.busy && r.compileAsync) {
      this.t = 4; this.busy = true;
      r.compileAsync(this.g.scene, this.g.camera).then(() => { this.stats.compiles++; }, () => {}).finally(() => { this.busy = false; });
    }
  }
}
