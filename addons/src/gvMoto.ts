// Gangstar-Vegas-style drive feel (spec: /workspace/landmarks/gv/motorcycle_spec.md):
// skid marks while drifting/hard braking (one instanced draw call), FOV widening with
// speed, GV pedal-style GAS/BRAKE buttons. Physics tweaks live in tools/patch_gv_moto.py.
import * as THREE from "three";
import type { AGame } from "./env";

const N = 360;
export class GvMoto {
  private g: AGame;
  private marks: THREE.InstancedMesh;
  private i = 0;
  private lx = 0; private lz = 0;
  private baseFov = 0;
  private m = new THREE.Matrix4(); private q = new THREE.Quaternion();
  private p = new THREE.Vector3(); private sc = new THREE.Vector3(1, 1, 1);
  private up = new THREE.Vector3(0, 1, 0);
  private mode = "";
  constructor(g: AGame) {
    this.g = g;
    const geo = new THREE.PlaneGeometry(0.28, 1.0).rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    this.marks = new THREE.InstancedMesh(geo, mat, N);
    this.marks.count = 0; this.marks.frustumCulled = false; this.marks.renderOrder = 1;
    g.scene.add(this.marks);
    const st = document.createElement("style");
    st.textContent = `
body.drive #actions .grp.on{grid-template-columns:auto auto!important;align-items:end}
body.drive #actions .grp[data-for=car] button[data-act=gas],body.drive #actions .grp[data-for=moto] button[data-act=gas]{width:calc(var(--db)*.95)!important;height:calc(var(--db)*1.55)!important;border-radius:18px!important;background:repeating-linear-gradient(0deg,#ffffff30 0 6px,#0000 6px 14px),#28aa50b0!important;order:2}
body.drive #actions .grp[data-for=car] button[data-act=brake],body.drive #actions .grp[data-for=moto] button[data-act=brake]{width:calc(var(--db)*1.15)!important;height:calc(var(--db)*.85)!important;border-radius:16px!important;background:repeating-linear-gradient(90deg,#ffffff26 0 6px,#0000 6px 14px),#c83228a8!important;order:1}
body.drive #actions button.held{background:#ffd23f!important}
#steerbtns button{box-shadow:0 0 0 2px #0003 inset}`;
    document.head.appendChild(st);
  }
  update(dt: number) {
    const g = this.g, S = g.S as unknown as { mode: string; car: { x: number; z: number; y: number; h: number; s: number } };
    const drive = S.mode === "car" || S.mode === "moto";
    if (S.mode !== this.mode) { this.mode = S.mode; document.body.classList.toggle("awmoto", S.mode === "moto"); }
    const cam = g.camera;
    if (!this.baseFov) this.baseFov = cam.fov;
    const a = S.car, sp = drive ? Math.abs(a.s || 0) : 0;
    const tf = this.baseFov + Math.min(14, Math.max(0, sp - 8) * 0.3);
    if (Math.abs(cam.fov - tf) > 0.05) { cam.fov += (tf - cam.fov) * Math.min(1, dt * 3); cam.updateProjectionMatrix(); }
    if (!drive) return;
    const held = (g as unknown as { held: Record<string, boolean> }).held || {};
    const drift = (window as unknown as { __awDrift?: number }).__awDrift || 0;
    const skid = drift > 0.35 || ((held.brake) && sp > 14);
    const dx = a.x - this.lx, dz = a.z - this.lz, d2 = dx * dx + dz * dz;
    if (!skid || d2 > 25) { this.lx = a.x; this.lz = a.z; return; }
    if (d2 < 0.7 * 0.7) return;
    const yaw = Math.atan2(dx, dz);
    this.q.setFromAxisAngle(this.up, yaw);
    this.sc.set(1, 1, Math.sqrt(d2));
    const sn = Math.sin(a.h), cs = Math.cos(a.h);
    const moto = S.mode === "moto", back = moto ? 0.75 : 1.3;
    const sides = moto ? [0] : [-0.78, 0.78];
    for (const o of sides) {
      // midpoint between last and current, at the rear wheel(s); forward is (-sin h, -cos h)
      this.p.set((a.x + this.lx) / 2 + sn * back + cs * o, a.y + 0.04, (a.z + this.lz) / 2 + cs * back - sn * o);
      this.m.compose(this.p, this.q, this.sc);
      this.marks.setMatrixAt(this.i, this.m);
      this.i = (this.i + 1) % N;
      this.marks.count = Math.min(N, this.marks.count + 1);
    }
    this.marks.instanceMatrix.needsUpdate = true;
    this.lx = a.x; this.lz = a.z;
  }
}
