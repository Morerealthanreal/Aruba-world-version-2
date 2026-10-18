// Driving feel (task 4): chase-camera smoothing and held-Space reverse, car + motorcycle.
// A's chase camera (bundle) builds the target from the car pose, calls window.__awMotoCam
// (gvMoto), then X_ pulls the target in to the first building footprint on the car->camera
// line in 10 % steps, lerps the camera there and looks at the car. Above ~80 km/h past
// buildings that pull-in toggles frame to frame, and the camera's height follows every
// terrain bump. This runs right before the frame's scene render (after A set the camera):
//  - distance: pulling in stays instant (never sees through a wall), easing back out is
//    rate-limited, so an on/off occlusion no longer pumps the camera
//  - height (car only; gvMoto's deliberate bike shake is kept): camera y and the look-at
//    height are low-passed
// Held Space at a standstill reverses like the touch BRAKE (A reverses on KeyS / BRAKE only).
// Off with ?chasecam=0 (camera) and ?spacerev=0 (reverse).
import type { AGame } from "./env";
import { params } from "./env";

type Car = { x: number; y: number; z: number; s: number };
type CamWindow = Window & { __awMotoCam?: (t: { x: number; y: number; z: number }, car: Car, dt: number, moto: boolean) => void };
type V3 = { x: number; y: number; z: number; set(x: number, y: number, z: number): unknown };
type Cam = { position: V3; lookAt(x: number, y: number, z: number): void };

export class ChaseCam {
  stats = { frames: 0, eased: 0, spaceRev: 0 };
  private dt = 1 / 60; private moto = false; private tick = 0; private applied = -1;
  private live = false; private d = 0; private y = 0; private ty = 0; private px = 0; private pz = 0;
  private spaceDown = false; private synthS = false;

  constructor(private g: AGame) {
    const w = window as CamWindow;
    if (params.get("chasecam") !== "0") {
      const prev = w.__awMotoCam;
      w.__awMotoCam = (t, car, dt, moto) => { if (prev) prev(t, car, dt, moto); this.dt = dt; this.moto = moto; this.tick++; };
      const R = g.renderer as unknown as { render(s: unknown, c: unknown): void };
      const render = R.render.bind(R);
      R.render = (scene: unknown, cam: unknown) => {
        if (scene === g.scene && cam === g.camera && this.tick !== this.applied) { this.applied = this.tick; this.filter(); }
        render(scene, cam);
      };
    }
    if (params.get("spacerev") !== "0") this.spaceReverse();
  }

  private filter() {
    const S = this.g.S as unknown as { mode: string; car: Car; snapCam?: number };
    if ((S.mode !== "car" && S.mode !== "moto") || S.snapCam) { this.live = false; return; }
    const a = S.car, cam = this.g.camera as unknown as Cam, p = cam.position;
    const dt = Math.min(0.1, Math.max(0, this.dt));
    const tx = a.x, ty = a.y + 1.5, tz = a.z;
    let vx = p.x - tx, vy = p.y - ty, vz = p.z - tz;
    const dist = Math.hypot(vx, vy, vz);
    if (!(dist > 0.5)) { this.live = false; return; }
    // teleport / respawn / mode switch: start over from A's camera
    if (!this.live || Math.hypot(p.x - this.px, p.z - this.pz) > 40) {
      this.live = true; this.d = dist; this.y = p.y; this.ty = ty; this.px = p.x; this.pz = p.z; return;
    }
    this.stats.frames++;
    // distance: in = instant, out = eased (A's lerp already moved it ~19 % toward the target)
    if (dist < this.d) this.d = dist;
    else { const k = 1 - Math.exp(-dt * 6); if (dist - this.d > 0.05) this.stats.eased++; this.d += (dist - this.d) * k; }
    const f = this.d / dist; vx *= f; vy *= f; vz *= f;
    let ny = ty + vy, ly = ty;
    if (!this.moto) {
      // height: extra low-pass on A's per-frame camera y and on the look-at height
      this.y += (ny - this.y) * (1 - Math.exp(-dt * 14));
      this.ty += (ty - this.ty) * (1 - Math.exp(-dt * 10));
      ny = this.y; ly = this.ty;
    } else { this.y = ny; this.ty = ty; }
    p.set(tx + vx, ny, tz + vz);
    this.px = p.x; this.pz = p.z;
    cam.lookAt(tx, ly, tz);
  }

  /** A reverses while KeyS / ArrowDown / touch BRAKE is held below 0.6 m/s; Space only brakes. */
  private spaceReverse() {
    const S = this.g.S as unknown as { mode: string; car: Car };
    const press = (down: boolean) => {
      if (down === this.synthS) return;
      this.synthS = down;
      dispatchEvent(new KeyboardEvent(down ? "keydown" : "keyup", { code: "KeyS", key: "s" }));
    };
    addEventListener("keydown", (e) => { if (e.code === "Space" && !(e.target instanceof HTMLInputElement)) this.spaceDown = true; });
    addEventListener("keyup", (e) => { if (e.code === "Space") { this.spaceDown = false; press(false); } });
    addEventListener("blur", () => { this.spaceDown = false; this.synthS = false; });
    const loop = () => {
      const drive = S.mode === "car" || S.mode === "moto";
      if (this.spaceDown && drive && S.car.s < 0.6 && !this.synthS) { press(true); this.stats.spaceRev++; }
      else if (this.synthS && (!this.spaceDown || !drive)) press(false);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
