// Round 8: make HIGH smooth on laptop GPUs (M1 Pro: LOW smooth, HIGH glitchy).
// HIGH-only costs vs LOW: 4x MSAA half-float composer at up to 2x DPR, a GTAO pass (12+12
// samples at full res plus its own normal/depth scene pass), bloom, a 4096 PCF shadow map
// re-rendered every frame, and a scene traverse every second to hide alpha meshes from AO.
// Here (HIGH only):
//  - GTAO runs at half resolution with 8+8 samples (the AO is a soft term; upsampled it reads the same)
//  - the AO alpha-mesh list is refreshed every 5 s instead of every 1 s (bundle hook __awAoT)
//  - the sun's shadow map re-renders every 2nd frame (static world; only cars/peds move)
// The pixel budget itself lives in contextGuard. Off with ?hiperf=0.
// Round 10 (laptop HIGH, e.g. 2021 M1 Pro): phones already get perfFixes' phone profile, but a
// non-touch HIGH kept A's full 2 km stream with 900 m building detail, 450 m parked cars and
// 200 m kits: ~3100 draws / 5.4M triangles a frame against LOW's ~600 / 0.8M. Laptop HIGH now
// uses ranges between the phone profile and A's (still well past LOW's 550-900 m), and drops
// the regions streamed at 2 km during boot. "Desktop Quality" (q.id desktop) keeps A's numbers.
// Off with ?hidesk=0. GTAO also reads the main pass depth instead of re-rendering the scene
// (?aodepth=0 restores its own normal/depth pass).
import type { AGame } from "./env";
import { params } from "./env";

// A reads these every update (live), so changing them needs no reload.
const LAPTOP = { radius: 1600, bldR: 1600, roadR: 1100, kitR: 140, parkR: 320, contactR: 340, detailR: 640 };
type Q = { name: string; id?: string } & Record<string, unknown>;
type Region = { state: string; rx: number; rz: number };
type Real = { q: Q; regions: Map<unknown, Region>; disposeRegion(r: Region): void; M: { X0: number; Z0: number; RS: number } };

type Tex = { constructor: new (w: number, h: number) => Tex };
type RT = { width: number; height: number; depthTexture: Tex | null; dispose(): void };
type Uni = { uniforms: { tDepth: { value: unknown } } };
type Pass = {
  setSize(w: number, h: number): void; updateGtaoMaterial(p: object): void; updatePdMaterial(p: object): void;
  setGBuffer(d?: Tex, n?: Tex): void; depthTexture: Tex; gtaoMaterial: Uni; pdMaterial: Uni;
  render(r: unknown, w: unknown, read: RT, ...x: unknown[]): void;
};
type M = { alphaTest: number; transparent: boolean; alphaToCoverage: boolean; needsUpdate: boolean };
type N = { material?: M | M[]; children: N[] };
export class HiPerf {
  on = false; private n = 0;
  stats = { aoHalf: false, shadowEvery: 1, a2c: 0, laptop: false, dropped: 0, aoDepth: false };
  private trimPending = false;
  constructor(private g: AGame) {
    const q = (g.real as unknown as { q?: Q } | null)?.q;
    if (!q || q.name !== "high") return;
    this.on = true;
    const pm = params.get("perfmobile");
    const touch = pm === "1" ? true : pm === "0" ? false : matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (!touch && q.id !== "desktop" && params.get("hidesk") !== "0") {
      for (const [k, v] of Object.entries(LAPTOP)) if (typeof q[k] === "number" && (q[k] as number) > v) q[k] = v;
      this.stats.laptop = true;
      this.trimPending = true;
    }
    const post = (window as unknown as { __awPost?: { ao?: Pass; resize(): void; composer?: { renderTarget1?: RT; renderTarget2?: RT } } }).__awPost;
    // phones run HIGH with GTAO off (perfFixes), so the extra depth resolve would buy them nothing
    if (!touch && post && post.ao && post.composer && params.get("aodepth") !== "0") this.aoFromMainDepth(post.ao, post.composer);
    (window as unknown as { __awAoT: number }).__awAoT = 5e3;
    if (post && post.ao) {
      const ao = post.ao, set = ao.setSize.bind(ao);
      ao.setSize = (w, h) => set(Math.max(1, Math.ceil(w / 2)), Math.max(1, Math.ceil(h / 2)));
      ao.updateGtaoMaterial({ samples: 8 });
      ao.updatePdMaterial({ samples: 8 });
      post.resize();
      this.stats.aoHalf = true;
    }
    this.stats.shadowEvery = 2;
  }
  /** GTAO re-rendered the whole scene a second time (override normal material) just to get depth
   *  and normals: ~1190 draws / 1.8M triangles a frame on laptop HIGH, half of all draws. The
   *  composer's own render targets now carry a depth texture (the MSAA resolve fills it), GTAO reads
   *  that depth and rebuilds normals from it (three's NORMAL_VECTOR_TYPE 0 path). Off with ?aodepth=0. */
  private aoFromMainDepth(ao: Pass, comp: { renderTarget1?: RT; renderTarget2?: RT }) {
    const rts = [comp.renderTarget1, comp.renderTarget2];
    if (!rts[0] || !rts[1] || !ao.depthTexture || typeof ao.setGBuffer !== "function") return;
    // A's own three DepthTexture class (the add-on bundle carries a second three copy)
    const DT = ao.depthTexture.constructor;
    for (const rt of rts as RT[]) if (!rt.depthTexture) { rt.depthTexture = new DT(rt.width, rt.height); rt.dispose(); }
    ao.setGBuffer(rts[0].depthTexture!);
    const render = ao.render.bind(ao);
    ao.render = (r, w, read, ...x) => {
      const d = read && read.depthTexture;
      if (d) { ao.gtaoMaterial.uniforms.tDepth.value = d; ao.pdMaterial.uniforms.tDepth.value = d; }
      render(r, w, read, ...x);
    };
    this.stats.aoDepth = true;
  }
  private a2c = new WeakSet<object>(); private stack: N[] = [];
  // foliage/props use alpha-tested cutouts: at ~1.3x DPR their edges stair-step and shimmer.
  // HIGH already renders into a 4x MSAA target, so alpha-to-coverage turns those edges into
  // 4-level coverage for free. One material flips per frame (each flip recompiles); the walk
  // resumes, so a newly streamed cutout is picked up without a full-scene hitch.
  private coverage() {
    if (!this.stack.length) this.stack.push(this.g.scene as unknown as N);
    const t0 = performance.now();
    let n = 0;
    while (this.stack.length && n < 300 && performance.now() - t0 < 0.6) {
      const o = this.stack.pop()!;
      const ch = o.children; for (let i = 0; i < ch.length; i++) this.stack.push(ch[i]);
      const ms = o.material; if (!ms) { n++; continue; }
      for (const m of Array.isArray(ms) ? ms : [ms]) {
        if (this.a2c.has(m)) continue; this.a2c.add(m);
        if (m.alphaTest > 0 && !m.transparent && !m.alphaToCoverage) {
          m.alphaToCoverage = true; m.needsUpdate = true; this.stats.a2c++;
          return; // one recompile this frame; the walk resumes next frame
        }
      }
      n++;
    }
  }
  /** Regions streamed at A's 2 km during boot; A's 700 m hysteresis would keep them all session. */
  private trim() {
    this.trimPending = false;
    const A = this.g.real as unknown as Real, M = A.M, c = (this.g as unknown as { camera: { position: { x: number; z: number } } }).camera.position;
    const R = (A.q.radius as number) + 300;
    for (const r of [...A.regions.values()]) {
      if (r.state === "loading") continue;
      const cx = M.X0 + (r.rx + 0.5) * M.RS, cz = M.Z0 + (r.rz + 0.5) * M.RS;
      if (Math.hypot(cx - c.x, cz - c.z) - M.RS * 0.71 > R) { A.disposeRegion(r); this.stats.dropped++; }
    }
  }
  frame() {
    if (!this.on) return;
    if (this.trimPending) this.trim();
    if (this.stats.aoHalf) this.coverage();
    const sm = this.g.renderer.shadowMap as unknown as { autoUpdate: boolean; needsUpdate: boolean };
    sm.autoUpdate = false;
    if ((this.n++ & 1) === 0) sm.needsUpdate = true;
  }
}
