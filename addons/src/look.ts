// Look pass (round 2): zero-cost art tweaks on top of A's photoreal look. Only uniforms and
// material constants change: no new passes, lights or textures, so phone fps is unaffected.
// Off with ?look=0.
//  - grade (MED/HIGH composer): a touch more vibrance for the Caribbean palette, less
//    brown lift in the shadows, slightly stronger vignette; bloom a hair softer by day.
//  - softer shadow edges (PCF radius up one step per tier; same sample count).
//  - asphalt a little darker/cooler so lane markings and crossings read better against
//    the sand; palm fronds / canopy / shrubs nudged from olive toward tropical green.
import { Color, Vector3 } from "three";
import type { AGame } from "./env";

type Post = { grade?: { uniforms: Record<string, { value: unknown }> }; bloom?: { strength: number; threshold: number } };
type ColMat = { color: Color; needsUpdate?: boolean };

export class Look {
  private postDone = false;
  constructor(private g: AGame) {
    const real = g.real as unknown as {
      q: { name: string };
      sky: { sun: { shadow: { radius: number } } };
      roads: { asphalt?: ColMat; walk?: ColMat };
      veg: Record<string, ColMat | undefined>;
    };
    const sh = real.sky.sun.shadow;
    sh.radius = real.q.name === "high" ? 6 : real.q.name === "med" ? 4.5 : 3.5;
    if (real.roads.asphalt?.color?.isColor) real.roads.asphalt.color.set(0xe4e8ee);
    const green = new Color(0.94, 1.06, 0.9);
    for (const k of ["mFrond", "mCanopy", "mShrub"]) { const m = real.veg[k]; if (m && m.color && m.color.isColor) m.color.multiply(green); }
  }

  /** A builds its composer lazily; call per frame until it exists. */
  update(night: number) {
    const p = (window as unknown as { __awPost?: Post }).__awPost;
    if (!p || !p.grade) return;
    const u = p.grade.uniforms;
    if (!this.postDone) {
      this.postDone = true;
      u.uVib.value = 0.68;
      u.uContrast.value = 1.12;
      u.uVig.value = 0.14;
      (u.uLift.value as Vector3).set(0.008, 0.007, 0.002);
    }
    if (p.bloom) { p.bloom.strength = 0.16 + 0.04 * night; p.bloom.threshold = 1.05 + 0.25 * night; } // r202: was 0.18+0.1*night, thr 1.05 (night facades blew out on phones)
  }
}
