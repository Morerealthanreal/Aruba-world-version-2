// Round 7: split A's two heavy region jobs into time-boxed slices.
// - roads: A builds a whole 1 km region's road mesh in one call (~100 ms headless, ~30 ms phone).
//   roads.build() treats each road independently (the junction list only feeds a distance test),
//   so we feed it a few roads at a time and parent the pieces under one roadMesh group; the
//   junction plates go in a last slice. roadGrid is built per slice and merged.
// - building cells: a 125 m cell can hold 40+ footprints; build them in batches.
// A slice keeps going while it is under budget, then re-queues itself at the head of A's queue
// so the region's later jobs (streets, marks, finalize) still run after it, in order.
// - streets (parked cars, street furniture, walls/fences/hedges, signs; ~90 ms avg, 300 ms max
//   headless in one call): each stage reads only its own list, so it is run on a region view that
//   holds just that list. Parked cars go in contiguous runs (A's de-overlap grid is cumulative and
//   order-preserving; the extra InstancedMeshes are folded into tileInst pools).
// Bundle hooks: window.__awRoadJob / __awBldJob / __awStreetJob (fall back to A's own job). Off: ?split=0
type O = { traverse(f: (o: O) => void): void; add(o: O): void; children: O[]; name: string; isMesh?: boolean; material?: { name?: string; type: string } };
type St = { cars: unknown[]; walls: unknown[]; signs: unknown[]; pools?: unknown[] };
type R = { json: { roads: Array<{ p: number[][] }>; junc: unknown[] }; group: O; roadMesh?: O; roadGrid?: Map<number, unknown[]>; st?: St };
type A = {
  queue: Array<{ R: R; f: () => void }>; roads: { build(j: unknown, t: unknown): O }; buildings: { build(j: { b: unknown[] }): O };
  roadGrid(m: O): Map<number, unknown[]>; junctionsNear(r: R): unknown;
  streets: { build(r: R): O }; marks: { pools(j: unknown): O };
};

const now = () => performance.now();
export class SplitJobs {
  stats = { roadSlices: 0, bldSlices: 0, streetSlices: 0, maxSlice: 0, msPerM: 0, msPerB: 0 };
  constructor(private budget = 4) {
    const w = window as unknown as Record<string, unknown>;
    w.__awRoadJob = (a: A, r: R) => this.roadJob(a, r);
    w.__awBldJob = (a: A, r: R, list: unknown[]) => this.bldJob(a, r, list);
    w.__awStreetJob = (a: A, r: R) => this.streetJob(a, r);
  }
  private streetJob(A: A, R: R) {
    const st = R.st, view = (s: Partial<St>, json: R["json"] | null) =>
      Object.assign(Object.create(R) as R, { st: { cars: [], walls: [], signs: [], ...s }, json });
    const stages: Array<() => void> = [];
    if (st) {
      const cars = st.cars || [], n = Math.max(1, Math.round(this.budget * 12));
      for (let i = 0; i < cars.length; i += n) { const part = cars.slice(i, i + n); stages.push(() => R.group.add(A.streets.build(view({ cars: part }, null)))); }
      stages.push(() => R.group.add(A.streets.build(view({}, R.json))));
      stages.push(() => R.group.add(A.streets.build(view({ walls: st.walls || [] }, null))));
      stages.push(() => R.group.add(A.streets.build(view({ signs: st.signs || [] }, null))));
      if (st.pools && st.pools.length) stages.push(() => R.group.add(A.marks.pools({ pools: st.pools })));
    }
    let i = 0;
    const f = () => {
      const t0 = now();
      while (i < stages.length) {
        stages[i++]();
        if (now() - t0 > this.budget * 0.6) break;
      }
      this.stats.streetSlices++; this.note(now() - t0);
      if (i < stages.length) A.queue.unshift({ R, f });
    };
    return f;
  }
  private note(ms: number) { if (ms > this.stats.maxSlice) this.stats.maxSlice = ms; }
  private roadJob(A: A, R: R) {
    const roads = R.json.roads, len = roads.map((r) => { let s = 0; for (let i = 1; i < r.p.length; i++) s += Math.hypot(r.p[i][0] - r.p[i - 1][0], r.p[i][1] - r.p[i - 1][1]); return s + 20; });
    let i = 0, junc: unknown = null, grid: Map<number, unknown[]> | null = null, done = false;
    const merge = (g: O) => { const m = A.roadGrid(g); for (const [k, v] of m) { const a = grid!.get(k); if (a) a.push(...v); else grid!.set(k, v); } };
    const f = () => {
      const t0 = now();
      if (!junc) { junc = A.junctionsNear(R); grid = new Map(); }
      while (!done) {
        // batch sized by the learned cost per metre of road
        const target = Math.max(60, (this.budget * 0.8) / (this.stats.msPerM || 0.004));
        let j = i, L = 0;
        while (j < roads.length && (j === i || L + len[j] < target)) L += len[j++];
        const tb = now();
        const isLast = j >= roads.length && i >= roads.length; // junction plate slice
        const g = isLast ? A.roads.build({ roads: [], junc: R.json.junc }, junc) : A.roads.build({ roads: roads.slice(i, j), junc: [] }, junc);
        g.traverse((o) => { o.name = o.name || (isLast ? "plate" : "road"); });
        if (!R.roadMesh) { R.roadMesh = g; R.group.add(g); merge(g); }
        else { R.roadMesh.add(g); merge(g); }
        if (!isLast && L > 0) { const k = (now() - tb) / L; this.stats.msPerM = this.stats.msPerM ? this.stats.msPerM * 0.8 + k * 0.2 : k; }
        if (isLast) done = true; else i = j;
        if (now() - t0 > this.budget * 0.6) break;
      }
      R.roadGrid = grid!; // partial grid is fine: roadHeightAt falls back to null
      this.stats.roadSlices++; this.note(now() - t0);
      if (!done) A.queue.unshift({ R, f });
    };
    return f;
  }
  private bldJob(A: A, R: R, list: unknown[]) {
    let i = 0;
    const f = () => {
      const t0 = now();
      while (i < list.length) {
        const n = Math.max(1, Math.round((this.budget * 0.8) / (this.stats.msPerB || 0.5)));
        const part = list.slice(i, i + n), tb = now();
        const g = A.buildings.build({ b: part });
        g.traverse((e) => { if (e.isMesh) e.name = "bld:" + (e.material!.name || e.material!.type); });
        R.group.add(g);
        const k = (now() - tb) / part.length; this.stats.msPerB = this.stats.msPerB ? this.stats.msPerB * 0.8 + k * 0.2 : k;
        i += part.length;
        if (now() - t0 > this.budget * 0.6) break;
      }
      this.stats.bldSlices++; this.note(now() - t0);
      if (i < list.length) A.queue.unshift({ R, f });
    };
    return f;
  }
}
