// Plane-only TURBO: toggle button in the plane control group; raises the plane's
// top speed to a hard cap of 560 km/h (155.6 m/s) (bundle reads window.__awTurbo) and shows flickering additive exhaust cones.
import * as THREE from "three";
import type { AGame } from "./env";

export const TURBO_MAX = 560 / 3.6; // Justin: TURBO top speed 560 km/h
export class Turbo {
  private g: AGame; private on = false; private btn: HTMLButtonElement;
  private fx: THREE.Group; private plane: THREE.Object3D | null = null; private t = 0;
  private cones: THREE.Mesh[] = []; private off = new THREE.Vector3();
  constructor(g: AGame) {
    this.g = g;
    const b = document.createElement("button"); this.btn = b;
    b.textContent = "TURBO"; b.className = "awturbo";
    b.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); this.set(!this.on); });
    document.querySelector('#actions .grp[data-for="plane"]')?.appendChild(b);
    const st = document.createElement("style");
    st.textContent = `#actions button.awturbo{background:#e0641ab3;grid-column:span 2}#actions button.awturbo.on,#actions button.awturbo.on.held{background:#ff9d1e;color:#222;box-shadow:0 0 14px #ff8c1a}`;
    document.head.appendChild(st);
    window.addEventListener("keydown", (e) => { if (e.code === "KeyT" && g.S.mode === "plane") this.set(!this.on); });
    this.fx = new THREE.Group(); this.fx.visible = false;
    const outer = new THREE.MeshBasicMaterial({ color: 0xff5a10, transparent: true, opacity: 0.85, depthWrite: false, fog: false });
    const inner = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.95, depthWrite: false, fog: false });
    const geo = new THREE.ConeGeometry(1, 1, 10, 1, true).translate(0, 0.5, 0).rotateX(Math.PI / 2); // tip points +Z (backwards)
    for (const [m, r] of [[outer, 0.38], [inner, 0.2]] as const) {
      const c = new THREE.Mesh(geo, m); c.scale.set(r, r, 1); c.renderOrder = 3; this.fx.add(c); this.cones.push(c);
    }
  }
  private set(v: boolean) { this.on = v; this.btn.classList.toggle("on", v); }
  private findPlane(): THREE.Object3D | null {
    const p = this.g.S.plane; let best: THREE.Object3D | null = null;
    for (const o of this.g.scene.children) if (o.visible && o.position.distanceToSquared(new THREE.Vector3(p.x, p.y, p.z)) < 0.01 && o !== this.g.car) best = o;
    return best;
  }
  update(dt: number) {
    const flying = this.g.S.mode === "plane";
    if (!flying && this.on) this.set(false);
    (window as unknown as { __awTurbo?: boolean }).__awTurbo = this.on && flying;
    if (!this.fx.parent) this.g.scene.add(this.fx);
    if (this.on && flying) {
      const P = this.g.S.plane as unknown as { x: number; y: number; z: number; h: number; p: number; r: number };
      this.fx.rotation.set(P.p, P.h, P.r, "YXZ");
      this.off.set(0, 0.25, 3.6).applyEuler(this.fx.rotation);
      this.fx.position.set(P.x + this.off.x, P.y + this.off.y, P.z + this.off.z);
      this.fx.scale.setScalar(1.5);
      const PS = this.g.S.plane as unknown as { s: number }; if (PS.s > TURBO_MAX) PS.s = TURBO_MAX;
    }
    this.fx.visible = this.on && flying;
    if (this.fx.visible) {
      this.t += dt;
      const f = 1 + Math.sin(this.t * 53) * 0.12 + Math.sin(this.t * 31) * 0.1;
      this.cones[0].scale.z = 4.5 * f; this.cones[1].scale.z = 2.8 * (2 - f);
    }
  }
}
