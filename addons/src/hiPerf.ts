// Round 8: make HIGH smooth on laptop GPUs (M1 Pro: LOW smooth, HIGH glitchy).
// HIGH-only costs vs LOW: 4x MSAA half-float composer at up to 2x DPR, a GTAO pass (12+12
// samples at full res plus its own normal/depth scene pass), bloom, a 4096 PCF shadow map
// re-rendered every frame, and a scene traverse every second to hide alpha meshes from AO.
// Here (HIGH only):
//  - GTAO runs at half resolution with 8+8 samples (the AO is a soft term; upsampled it reads the same)
//  - the AO alpha-mesh list is refreshed every 5 s instead of every 1 s (bundle hook __awAoT)
//  - the sun's shadow map re-renders every 2nd frame (static world; only cars/peds move)
// The pixel budget itself lives in contextGuard. Off with ?hiperf=0.
import type { AGame } from "./env";

type Pass = { setSize(w: number, h: number): void; updateGtaoMaterial(p: object): void; updatePdMaterial(p: object): void };
export class HiPerf {
  on = false; private n = 0;
  stats = { aoHalf: false, shadowEvery: 1 };
  constructor(private g: AGame) {
    const q = (g.real as unknown as { q?: { name: string } } | null)?.q;
    if (!q || q.name !== "high") return;
    this.on = true;
    (window as unknown as { __awAoT: number }).__awAoT = 5e3;
    const post = (window as unknown as { __awPost?: { ao?: Pass; resize(): void } }).__awPost;
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
  frame() {
    if (!this.on) return;
    const sm = this.g.renderer.shadowMap as unknown as { autoUpdate: boolean; needsUpdate: boolean };
    sm.autoUpdate = false;
    if ((this.n++ & 1) === 0) sm.needsUpdate = true;
  }
}
