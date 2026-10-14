// GV-style camera-cycle button for car/bike: Near chase -> Far chase -> Low cinematic. Key C or the camera button.
// Drives the bundle hook window.__awCamD/__awCamP (tools/patch_camcycle.py). ?camcycle=0 disables.
const MODES = [{ n: "NEAR", d: 1, p: 0 }, { n: "FAR", d: 1.75, p: 0.14 }, { n: "LOW", d: 0.72, p: -0.13 }];
export class CamCycle {
  i = 0; btn: HTMLButtonElement; tip: HTMLDivElement; cd = 1; cp = 0;
  constructor() {
    this.btn = document.createElement("button");
    this.btn.textContent = "🎥"; this.btn.title = "Camera (C)";
    this.btn.style.cssText = "position:fixed;right:12px;top:170px;z-index:40;display:none;width:44px;height:44px;border-radius:12px;border:0;font:20px system-ui;background:#1e2a3ab0;color:#fff";
    this.btn.addEventListener("click", (e) => { e.preventDefault(); this.next(); });
    document.body.appendChild(this.btn);
    this.tip = document.createElement("div");
    this.tip.style.cssText = "position:fixed;right:62px;top:180px;z-index:40;font:800 12px system-ui;color:#fff;text-shadow:0 1px 3px #000;opacity:0;transition:opacity .4s;pointer-events:none";
    document.body.appendChild(this.tip);
    addEventListener("keydown", (e) => { if (e.code === "KeyC" && !(e.target instanceof HTMLInputElement)) this.next(); });
  }
  next() { this.i = (this.i + 1) % MODES.length; this.tip.textContent = "CAM " + MODES[this.i].n; this.tip.style.opacity = "1"; setTimeout(() => (this.tip.style.opacity = "0"), 1200); }
  frame(mode: string, dt: number) {
    const drive = mode === "car" || mode === "moto";
    this.btn.style.display = drive ? "block" : "none";
    const m = drive ? MODES[this.i] : MODES[0], k = Math.min(1, dt * 4);
    this.cd += (m.d - this.cd) * k; this.cp += (m.p - this.cp) * k;
    const w = window as unknown as { __awCamD: number; __awCamP: number };
    w.__awCamD = this.cd; w.__awCamP = this.cp;
  }
}
