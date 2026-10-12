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
  stats = { jobs: 0, maxMs: 0, ticks: 0 };
  private ch = new MessageChannel();
  private pending = false;
  constructor(private g: AGame, private budget: number) {
    (window as unknown as { __awJobB?: number }).__awJobB = -1;
    this.ch.port1.onmessage = () => this.run();
  }
  /** call once per animation frame */
  frame() {
    const A = this.g.real as unknown as A;
    if (this.pending || !A.queue.length) return;
    this.pending = true;
    this.ch.port2.postMessage(0);
  }
  private run() {
    this.pending = false;
    const A = this.g.real as unknown as A, t0 = performance.now();
    // long backlog (teleport / boot trim): allow a little more per tick
    const b = A.queue.length > 120 ? this.budget * 1.5 : this.budget;
    while (A.queue.length && performance.now() - t0 < b) {
      const e = A.queue.shift()!;
      if (A.regions.get(e.R.rx + "," + e.R.rz) === e.R) { try { e.f(); } catch (err) { console.error("[aw-jobs]", err); } }
      this.stats.jobs++;
    }
    const ms = performance.now() - t0;
    this.stats.ticks++; if (ms > this.stats.maxMs) this.stats.maxMs = ms;
  }
}
