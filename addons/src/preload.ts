// Stream regions ahead of travel: shift the streaming centre ~5 s along the camera's ground velocity
// (capped 220 m) so chunks load before you reach them instead of hitching on arrival. Hook: tools/patch_mobile.py
import type { AGame } from "./env";
export class Preload {
  private px = NaN; private pz = NaN; private vx = 0; private vz = 0;
  constructor(private g: AGame) {}
  frame(dt: number) {
    const c = (this.g as unknown as { camera: { position: { x: number; z: number } } }).camera.position;
    if (dt > 0 && dt < 0.5 && Number.isFinite(this.px)) {
      const k = Math.min(1, dt * 1.5);
      this.vx += ((c.x - this.px) / dt - this.vx) * k; this.vz += ((c.z - this.pz) / dt - this.vz) * k;
    }
    this.px = c.x; this.pz = c.z;
    let ax = this.vx * 5, az = this.vz * 5; const L = Math.hypot(ax, az);
    if (L > 220) { ax *= 220 / L; az *= 220 / L; }
    (window as unknown as { __awAhead: number[] }).__awAhead = L < 15 ? [0, 0] : [ax, az];
  }
}
