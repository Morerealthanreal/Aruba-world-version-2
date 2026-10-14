// Bike wheelie stunt: hold V (or the WHEELIE button) on the motorbike above ~10 km/h.
// The bike pitches nose-up about the rear axle (pivot math, no glb change) via the bundle hook
// window.__awWh (tools/patch_wheelie.py). Holding it 1.5 s shows a "SINGLE WHEEL" stunt toast.
const BACK = 0.75, MAX = 0.62;
export class Wheelie {
  held = false; th = 0; t = 0; shown = false; toast: HTMLDivElement; btn: HTMLButtonElement;
  constructor() {
    addEventListener("keydown", (e) => { if (e.code === "KeyV") this.held = true; });
    addEventListener("keyup", (e) => { if (e.code === "KeyV") this.held = false; });
    this.toast = document.createElement("div");
    this.toast.style.cssText = "position:fixed;left:50%;top:22%;transform:translateX(-50%);font:900 28px system-ui;color:#ffd23f;text-shadow:0 2px 6px #000;pointer-events:none;opacity:0;transition:opacity .3s;z-index:50";
    document.body.appendChild(this.toast);
    this.btn = document.createElement("button");
    this.btn.textContent = "WHEELIE";
    this.btn.className = "aw-wheelie";
    this.btn.setAttribute("aria-label", "Hold for wheelie");
    this.btn.style.cssText = "position:fixed;right:12px;bottom:46%;z-index:40;display:none;padding:10px 12px;border-radius:14px;border:0;font:800 13px system-ui;background:#1e2a3ab0;color:#fff";
    const on = (v: boolean) => (e: Event) => { e.preventDefault(); this.held = v; };
    this.btn.addEventListener("pointerdown", (e) => { this.btn.setPointerCapture(e.pointerId); on(true)(e); });
    this.btn.addEventListener("pointerup", on(false));
    this.btn.addEventListener("pointercancel", on(false));
    this.btn.addEventListener("lostpointercapture", on(false));
    document.body.appendChild(this.btn);
    (window as unknown as { __awWh: unknown }).__awWh = (ev: { rotation: { x: number }; position: { x: number; y: number; z: number } }, a: { s: number; h: number }, dt: number) => this.apply(ev, a, dt);
  }
  apply(ev: { rotation: { x: number }; position: { x: number; y: number; z: number } }, a: { s: number; h: number }, dt: number) {
    const fast = Math.abs(a.s || 0) > 3;
    const target = this.held && fast ? MAX * (0.9 + 0.1 * Math.sin(performance.now() / 180)) : 0;
    this.th += (target - this.th) * Math.min(1, dt * (target > this.th ? 3.5 : 6));
    if (this.th < 0.002) { this.th = 0; this.t = 0; this.shown = false; return; }
    const th = this.th, up = BACK * Math.sin(th), back = BACK * (1 - Math.cos(th));
    ev.rotation.x += th;
    ev.position.x += back * Math.sin(a.h); ev.position.z += back * Math.cos(a.h); ev.position.y += up;
    if (th > MAX * 0.7) { this.t += dt; if (this.t > 1.5 && !this.shown) { this.shown = true; this.toast.textContent = "SINGLE WHEEL  +2,500"; this.toast.style.opacity = "1"; setTimeout(() => (this.toast.style.opacity = "0"), 1800); } }
  }
  frame(mode: string) { this.btn.style.display = mode === "moto" ? "block" : "none"; if (mode !== "moto") this.held = false; }
}
