// Arcade motorcycle feel: speed-sensitive lean, brake+steer drift, skid/smoke feedback,
// a responsive chase camera and phone-first controls. Physics hooks live in
// tools/patch_gv_moto.py. Disable the complete handling pass with ?gvmoto=0.
import * as THREE from "three";
import type { AGame } from "./env";

const MARKS = 420;
const PUFFS = 56;
type CarState = { x: number; z: number; y: number; h: number; s: number };
type MotoWindow = Window & {
  __awDrift?: number;
  __awMotoEnabled?: boolean;
  __awMotoBump?: number;
  __awMotoCam?: (target: THREE.Vector3, car: CarState, dt: number, moto: boolean) => void;
};

export class GvMoto {
  private g: AGame;
  private marks: THREE.InstancedMesh;
  private smoke: THREE.Points;
  private smokePos = new Float32Array(PUFFS * 3);
  private smokeLife = new Float32Array(PUFFS);
  private smokeVel = new Float32Array(PUFFS * 3);
  private i = 0;
  private puff = 0;
  private smokeClock = 0;
  private lx = 0; private lz = 0;
  private tracking = false;
  private lastSpeed = 0;
  private baseFov = 0;
  private m = new THREE.Matrix4(); private q = new THREE.Quaternion();
  private p = new THREE.Vector3(); private sc = new THREE.Vector3(1, 1, 1);
  private up = new THREE.Vector3(0, 1, 0);
  private mode = "";
  constructor(g: AGame) {
    this.g = g;
    const geo = new THREE.PlaneGeometry(0.28, 1.0).rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0x10151a, transparent: true, opacity: 0.56, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    this.marks = new THREE.InstancedMesh(geo, mat, MARKS);
    this.marks.name = "aw:vehicle-skids";
    this.marks.count = 0; this.marks.frustumCulled = false; this.marks.renderOrder = 1;
    this.marks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    g.scene.add(this.marks);
    this.smokePos.fill(-10000);
    const smokeGeo = new THREE.BufferGeometry();
    smokeGeo.setAttribute("position", new THREE.BufferAttribute(this.smokePos, 3).setUsage(THREE.DynamicDrawUsage));
    const puff = document.createElement("canvas"); puff.width = puff.height = 64;
    const ctx = puff.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, "rgba(220,225,228,.72)"); grad.addColorStop(0.42, "rgba(150,158,164,.34)"); grad.addColorStop(1, "rgba(90,98,104,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64);
    this.smoke = new THREE.Points(smokeGeo, new THREE.PointsMaterial({
      map: new THREE.CanvasTexture(puff), color: 0xc5c9cb, size: 0.46,
      transparent: true, opacity: 0.25, depthWrite: false, sizeAttenuation: true,
    }));
    this.smoke.name = "aw:moto-smoke";
    this.smoke.frustumCulled = false; this.smoke.renderOrder = 2; g.scene.add(this.smoke);
    const st = document.createElement("style");
    st.textContent = `
body.touch.awmoto{--moto-btn:clamp(76px,20.4vw,88px)}
body.touch.awmoto #steerbtns{left:calc(14px + env(safe-area-inset-left));bottom:calc(24px + env(safe-area-inset-bottom));gap:12px}
body.touch.awmoto #steerbtns button{width:var(--moto-btn);height:var(--moto-btn);border-width:3px;background:#121b2bb8;box-shadow:0 4px 14px #0007,0 0 0 2px #0004 inset;font-size:0}
body.touch.awmoto #steerbtns button:before{font-size:calc(var(--moto-btn)*.43);line-height:1}
body.touch.awmoto #steerbtns button[data-act=left]:before{content:"◀"}
body.touch.awmoto #steerbtns button[data-act=right]:before{content:"▶"}
body.touch.awmoto #actions{right:calc(14px + env(safe-area-inset-right));bottom:calc(22px + env(safe-area-inset-bottom));width:calc(var(--moto-btn)*1.9);height:calc(var(--moto-btn)*1.72)}
body.touch.awmoto #actions .grp[data-for=moto].on{display:block!important;position:relative;width:100%;height:100%}
body.touch.awmoto #actions .grp[data-for=moto] button{position:absolute!important;min-width:0!important;touch-action:none;border:3px solid #ffffffdf;box-shadow:0 4px 14px #0007,0 0 0 2px #0003 inset;font-size:13px!important;letter-spacing:.04em}
body.touch.awmoto #actions .grp[data-for=moto] button[data-act=gas]{right:0;bottom:0;width:calc(var(--moto-btn)*.98)!important;height:calc(var(--moto-btn)*1.38)!important;border-radius:24px!important;background:repeating-linear-gradient(0deg,#ffffff24 0 6px,#0000 6px 14px),#218b47dc!important}
body.touch.awmoto #actions .grp[data-for=moto] button[data-act=brake]{left:0;top:0;width:calc(var(--moto-btn)*.86)!important;height:calc(var(--moto-btn)*.86)!important;border-radius:20px!important;background:repeating-linear-gradient(90deg,#ffffff20 0 6px,#0000 6px 14px),#b82c2bdc!important}
body.touch.awmoto #actions .grp[data-for=moto] button.held,body.touch.awmoto #steerbtns button.held{background:#ffd23f!important;color:#20242a!important;transform:scale(.96)}
body.touch.drive:not(.awmoto) #actions .grp[data-for=car].on{grid-template-columns:auto auto!important;align-items:end}
body.touch.drive:not(.awmoto) #actions .grp[data-for=car] button[data-act=gas]{width:calc(var(--db)*.95)!important;height:calc(var(--db)*1.55)!important;border-radius:18px!important;background:repeating-linear-gradient(0deg,#ffffff30 0 6px,#0000 6px 14px),#28aa50b0!important;order:2}
body.touch.drive:not(.awmoto) #actions .grp[data-for=car] button[data-act=brake]{width:calc(var(--db)*1.15)!important;height:calc(var(--db)*.85)!important;border-radius:16px!important;background:repeating-linear-gradient(90deg,#ffffff26 0 6px,#0000 6px 14px),#c83228a8!important;order:1}
@media (orientation:landscape) and (pointer:coarse){
 body.touch.awmoto{--moto-btn:clamp(68px,11.5vw,82px)}
}`;
    document.head.appendChild(st);
    const w = window as MotoWindow;
    w.__awMotoEnabled = true;
    w.__awMotoCam = (target, car, dt, moto) => this.camera(target, car, dt, moto);
  }

  private camera(target: THREE.Vector3, a: CarState, dt: number, moto: boolean) {
    const w = window as MotoWindow;
    if (!moto) { w.__awMotoBump = Math.max(0, (w.__awMotoBump || 0) - dt * 5); return; }
    const sp = Math.abs(a.s || 0), now = performance.now() * 0.001;
    const road = Math.max(0, Math.min(1, (sp - 25) / 30));
    const bump = Math.max(0, w.__awMotoBump || 0);
    const shake = road * 0.025 + bump * 0.2;
    const lateral = Math.sin(now * 23) * shake;
    target.x += Math.cos(a.h) * lateral;
    target.z -= Math.sin(a.h) * lateral;
    target.y += Math.sin(now * 31) * shake * 0.65 + bump * 0.08 - 0.5;
    w.__awMotoBump = Math.max(0, bump - dt * 4.5);
  }

  private spawnSmoke(a: CarState) {
    const j = this.puff, k = j * 3, sn = Math.sin(a.h), cs = Math.cos(a.h);
    this.smokePos[k] = a.x + sn * 0.78 + (Math.random() - 0.5) * 0.22;
    this.smokePos[k + 1] = a.y + 0.24 + Math.random() * 0.12;
    this.smokePos[k + 2] = a.z + cs * 0.78 + (Math.random() - 0.5) * 0.22;
    this.smokeVel[k] = (Math.random() - 0.5) * 0.3;
    this.smokeVel[k + 1] = 0.38 + Math.random() * 0.22;
    this.smokeVel[k + 2] = (Math.random() - 0.5) * 0.3;
    this.smokeLife[j] = 0.72 + Math.random() * 0.35;
    this.puff = (j + 1) % PUFFS;
  }

  private updateSmoke(dt: number) {
    for (let j = 0; j < PUFFS; j++) {
      if (this.smokeLife[j] <= 0) continue;
      const k = j * 3;
      this.smokeLife[j] -= dt;
      if (this.smokeLife[j] <= 0) { this.smokePos[k + 1] = -10000; continue; }
      this.smokePos[k] += this.smokeVel[k] * dt;
      this.smokePos[k + 1] += this.smokeVel[k + 1] * dt;
      this.smokePos[k + 2] += this.smokeVel[k + 2] * dt;
      this.smokeVel[k] *= Math.pow(0.2, dt);
      this.smokeVel[k + 2] *= Math.pow(0.2, dt);
    }
    (this.smoke.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  }

  update(dt: number) {
    const g = this.g, S = g.S as unknown as { mode: string; car: CarState };
    const drive = S.mode === "car" || S.mode === "moto";
    const moto = S.mode === "moto";
    if (S.mode !== this.mode) {
      this.mode = S.mode; document.body.classList.toggle("awmoto", moto);
      this.tracking = false; this.lastSpeed = 0;
    }
    const cam = g.camera;
    if (!this.baseFov) this.baseFov = cam.fov;
    const a = S.car, sp = drive ? Math.abs(a.s || 0) : 0;
    const tf = moto
      ? this.baseFov + Math.min(6, Math.max(0, sp - 10) * 0.14)
      : S.mode === "car"
        ? this.baseFov + Math.min(14, Math.max(0, sp - 8) * 0.3)
        : this.baseFov;
    if (Math.abs(cam.fov - tf) > 0.05) { cam.fov += (tf - cam.fov) * Math.min(1, dt * 3); cam.updateProjectionMatrix(); }
    this.updateSmoke(dt);
    if (!drive) return;
    const held = (g as unknown as { held: Record<string, boolean> }).held || {};
    const drift = (window as MotoWindow).__awDrift || 0;
    const decel = Math.max(0, (this.lastSpeed - sp) / Math.max(0.001, dt));
    const skid = moto
      ? drift > 0.22 || ((held.brake || decel > 14) && sp > 9)
      : (held.brake || decel > 16) && sp > 14;
    this.lastSpeed = sp;
    if (moto && skid && sp > 8) {
      this.smokeClock += dt * (drift > 0.5 ? 1.6 : 1);
      while (this.smokeClock > 0.08) { this.smokeClock -= 0.08; this.spawnSmoke(a); }
    } else this.smokeClock = 0;
    const dx = a.x - this.lx, dz = a.z - this.lz, d2 = dx * dx + dz * dz;
    if (!this.tracking || !skid || d2 > 25) { this.lx = a.x; this.lz = a.z; this.tracking = true; return; }
    if (d2 < 0.7 * 0.7) return;
    const yaw = Math.atan2(dx, dz);
    this.q.setFromAxisAngle(this.up, yaw);
    this.sc.set(1, 1, Math.sqrt(d2));
    const sn = Math.sin(a.h), cs = Math.cos(a.h);
    const back = moto ? 0.75 : 1.3;
    const sides = moto ? [0] : [-0.78, 0.78];
    for (const side of sides) {
      // Midpoint between previous/current position, under each rear tyre.
      this.p.set((a.x + this.lx) / 2 + sn * back + cs * side, a.y + 0.04, (a.z + this.lz) / 2 + cs * back - sn * side);
      this.m.compose(this.p, this.q, this.sc);
      this.marks.setMatrixAt(this.i, this.m);
      this.i = (this.i + 1) % MARKS;
      this.marks.count = Math.min(MARKS, this.marks.count + 1);
    }
    this.marks.instanceMatrix.needsUpdate = true;
    this.lx = a.x; this.lz = a.z;
  }
}
