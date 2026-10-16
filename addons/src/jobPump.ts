// Round 3: move A's tile-build job queue off the frame. A runs queued region jobs inside
// its render-loop update (5/8 ms budget). We set that in-frame budget to "none" (bundle
// patch reads window.__awJobB) and drain the same queue, same order and same staleness
// check, from a MessageChannel task posted after each animation frame. The task lands
// after the frame's JS, while the GPU is drawing, so a GPU-bound phone builds tiles in
// slack time instead of stretching frames. Off with ?jobs=0.
import type { AGame } from "./env";

type Job = { R: { rx: number; rz: number }; f: () => void };
type A = { queue: Job[]; regions: Map<string, unknown> };

export class JobPump {
  stats = { jobs: 0, maxMs: 0, ticks: 0, maxJob: 0 };
  private ord = new WeakMap<object, number>();
  private cost: number[] = [];
  private ch = new MessageChannel();
  private pending = false;
  constructor(private g: AGame, private budget: number) {
    (window as unknown as { __awJobB?: number }).__awJobB = -1;
    this.ch.port1.onmessage = () => this.run();
  }
  /** call once per animation frame */
  frame() {
    const A = this.g.real as unknown as A;
    // shader finalization and a half-finished fold have to run even after the tile queue drains,
    // still outside the animation callback
    if (this.pending || (!A.queue.length && !this.followUp())) return;
    this.pending = true;
    this.ch.port2.postMessage(0);
  }
  private run() {
    this.pending = false;
    const A = this.g.real as unknown as A, t0 = performance.now();
    // long backlog (teleport / boot trim): allow a little more per tick
    const b = A.queue.length > 120 ? this.budget * 1.5 : this.budget;
    let ran = 0;
    while (A.queue.length && performance.now() - t0 < b) {
      const e = A.queue[0];
      // A's region jobs come in a fixed order (terrain, roads, buildings, veg, ...); learn each
      // slot's cost and never start a job that would blow this tick's budget unless it is the
      // first one -> at most one heavy job per frame instead of a heavy job stacked on others.
      const slot = this.ord.get(e.R) ?? 0;
      const est = this.cost[slot] || 0;
      if (ran > 0 && performance.now() - t0 + est > b) break;
      A.queue.shift();
      this.ord.set(e.R, slot + 1);
      const tj = performance.now();
      if (A.regions.get(e.R.rx + "," + e.R.rz) === e.R) {
        try { e.f(); } catch (err) { console.error("[aw-jobs]", err); }
        // hide the meshes this job just added; afterJobs copies them before the next paint
        const aw = (window as unknown as { __aw?: Aw }).__aw;
        aw?.bbatch?.touch?.(e.R);
        aw?.perf?.inst?.touch?.(e.R);
      }
      const dtj = performance.now() - tj;
      this.cost[slot] = this.cost[slot] ? this.cost[slot] * 0.7 + dtj * 0.3 : dtj;
      if (dtj > this.stats.maxJob) this.stats.maxJob = dtj;
      this.stats.jobs++; ran++;
    }
    const ms = performance.now() - t0;
    this.stats.ticks++; if (ms > this.stats.maxMs) this.stats.maxMs = ms;
    const aw = (window as unknown as { __aw?: Aw }).__aw;
    // copy concealed cells / kits into batches before the next paint, then finalize programs
    // Stay in this turn until new shader programs are finalized. The next animation frame
    // would otherwise draw them cold (getProgramInfoLog inside the frame, hundreds of ms).
    let pass = 0;
    do {
      aw?.bbatch?.afterJobs?.();
      aw?.perf?.inst?.afterJobs?.(A.regions);
      aw?.mperf?.afterJobs?.();
      // Stay in this turn until new programs are finalized and the textures the walk just
      // found are uploaded. The next animation frame would otherwise draw them cold.
    } while (++pass < 8 && ((aw?.mperf?.shaderPending?.() || 0) > 0 || (aw?.mperf?.backlog?.() || 0) > 0));
  }
  private followUp() {
    const aw = (window as unknown as { __aw?: Aw }).__aw;
    if (!aw) return false;
    if ((aw.mperf?.pending?.() || 0) > 0) return true;
    if ((aw.perf?.inst?.pending?.() || 0) > 0) return true;
    if ((aw.bbatch?.busy?.() || 0) > 0) return true;
    return false;
  }
}
type Aw = {
  mperf?: { afterJobs?: () => void; pending?: () => number; shaderPending?: () => number; backlog?: () => number };
  bbatch?: { touch?: (r: object) => void; afterJobs?: () => void; busy?: () => number };
  perf?: { inst?: { touch?: (r: object) => void; afterJobs?: (regions: Map<string, unknown>) => void; pending?: () => number } };
};
