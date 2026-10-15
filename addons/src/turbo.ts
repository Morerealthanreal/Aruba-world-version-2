// Plane-only TURBO JET. Button in the plane control group (hidden for walk/car/moto) and key T:
// a quick tap latches it on/off, pressing longer than 0.35 s makes it momentary (off on release).
// While on, the plane's target speed doubles (thr 65% ~280 km/h -> 560 km/h) with a hard cap of 560 km/h
// (bundle reads window.__awTurbo / __awTurboK / __awTurboV, tools/patch_plane.py).
// Rocket exhaust from a small nozzle on the tail, SpaceX style: blue-white core with shock diamonds, orange edge,
// flicker, additive blending, 40 point sprites + one glow sprite (3 draw calls, no lights, no shadows).
// Camera FOV push via camera.zoom (gvMoto.ts owns camera.fov). A has no engine audio, so there is no pitch-up.
// ?turbo=0 disables.
import * as THREE from "three";
import type { AGame } from "./env";

export const TURBO_MAX = 560 / 3.6;
const NP = 40;
const NOZZLE_Z = 5.05; // nozzle exit, plane local space (fuselage tail at z = 4.5, nose towards -z)
const FOV_PUSH = 7; // degrees at full turbo
const CORE_L = 4.6, OUTER_L = 7.5, OUTER_R = 0.56; // metres; the plane is ~11 m long

const plumeVS = `
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  vL = position.z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const plumeFS = `
uniform float uT, uI, uCore, uOcc, uGain; uniform vec3 uC0, uC1;
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  float f = abs(dot(normalize(vN), normalize(vV)));
  float L = vL;
  float n = 0.78 + 0.22 * sin(L * 23.0 - uT * 95.0) * sin(L * 9.0 - uT * 47.0 + 1.3);
  float dia = mix(1.0, 0.55 + 0.9 * pow(abs(cos(L * 15.7 - 0.6)), 8.0) * (1.0 - smoothstep(0.1, 0.85, L)), uCore);
  vec3 col = mix(uC1, uC0, smoothstep(0.15, 0.9, f) * (1.0 - L * (1.0 - uCore) * 0.6));
  float a = pow(f, mix(0.9, 1.6, uCore)) * pow(1.0 - L, mix(1.3, 2.2, uCore)) * smoothstep(0.0, 0.06, L + 0.02) * n * uI;
  a *= mix(0.12 + 0.88 * smoothstep(0.0, 0.38, L), 1.0, uCore);
  gl_FragColor = vec4(col * a * dia * uGain, min(1.0, a * uOcc));
}`;
const partVS = `
attribute float aLife; attribute float aSeed; varying float vLife; uniform float uScale;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uScale * (0.35 + aLife * 0.9) * (0.7 + aSeed * 0.6) / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const partFS = `
varying float vLife; uniform float uI;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.0;
  if (r > 1.0 || vLife >= 1.0) discard;
  vec3 col = vLife < 0.25 ? mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.72, 0.32), vLife * 4.0)
                          : mix(vec3(1.0, 0.72, 0.32), vec3(0.85, 0.22, 0.04), (vLife - 0.25) / 0.75);
  float a = (1.0 - r) * pow(1.0 - vLife, 1.6) * uI;
  gl_FragColor = vec4(col * 1.6, a);
}`;

function glowTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const x = c.getContext("2d")!; const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(225,238,255,1)"); gr.addColorStop(0.25, "rgba(150,190,255,0.6)");
  gr.addColorStop(0.55, "rgba(255,140,40,0.3)"); gr.addColorStop(1, "rgba(255,90,10,0)");
  x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** Plume profile: unit radius at the nozzle, slight bulge, tapering to a point at z = 1. */
function plumeGeometry() {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 14; i++) { const z = i / 14; pts.push(new THREE.Vector2(Math.max(0.001, (1 - z ** 1.25) * (1 + 0.28 * Math.sin(z * Math.PI))), z)); }
  return new THREE.LatheGeometry(pts, 18).rotateX(Math.PI / 2);
}

export class Turbo {
  private g: AGame; private on = false; private btn: HTMLButtonElement;
  private fx = new THREE.Group(); private plane: THREE.Object3D | null = null; private t = 0; private lvl = 0;
  private pressOn = false; private pressT = 0;
  private core: THREE.Mesh; private outer: THREE.Mesh; private glow: THREE.Sprite; private parts: THREE.Points;
  private pos = new Float32Array(NP * 3); private vel = new Float32Array(NP * 3);
  private life = new Float32Array(NP).fill(1); private ttl = new Float32Array(NP).fill(0.2); private emit = 0;
  private zoomed = false;
  constructor(g: AGame) {
    this.g = g;
    const b = document.createElement("button"); this.btn = b;
    b.innerHTML = "TURBO JET<small>tap · hold</small>"; b.className = "awturbo"; b.title = "Turbo jet (T): tap to latch, hold for a burst";
    b.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); try { b.setPointerCapture(e.pointerId); } catch { /* old browsers */ } this.press(e.timeStamp); });
    const up = (e: Event) => { e.preventDefault(); this.release(e.timeStamp); };
    b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up);
    b.addEventListener("contextmenu", (e) => e.preventDefault());
    document.querySelector('#actions .grp[data-for="plane"]')?.appendChild(b);
    const st = document.createElement("style");
    st.textContent = `#actions button.awturbo{grid-column:span 2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;letter-spacing:.06em;background:linear-gradient(180deg,#3a5f9ab8,#1c2c4ab8);border-color:#9fc4ffcc;-webkit-user-select:none;user-select:none}
#actions button.awturbo small{font-size:10px;font-weight:600;opacity:.75;letter-spacing:.02em}
#actions button.awturbo.lit{background:radial-gradient(circle at 50% 120%,#fff6 0,#0000 60%),linear-gradient(180deg,#ffb347,#ff6a1a);color:#1a1a1a;border-color:#fff;box-shadow:0 0 16px #ff8c1acc,0 0 4px #bfe0ff inset}`;
    document.head.appendChild(st);
    window.addEventListener("keydown", (e) => { if (e.code === "KeyT" && !e.repeat && g.S.mode === "plane" && !(e.target instanceof HTMLInputElement)) this.press(e.timeStamp); });
    window.addEventListener("keyup", (e) => { if (e.code === "KeyT") this.release(e.timeStamp); });
    window.addEventListener("blur", (e) => this.release(e.timeStamp));
    const kh = document.getElementById("keyhelp"); if (kh && !/turbo/i.test(kh.textContent || "")) kh.textContent += " · T turbo jet (plane)";
    this.core = this.plume(0x9cc2ff, 0x4070ff, 1, 0.5, 1.0); this.core.scale.set(0.3, 0.3, CORE_L);
    this.outer = this.plume(0xffbe6a, 0xff5a12, 0, 0.6, 1.7); this.outer.scale.set(OUTER_R, OUTER_R, OUTER_L);
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0xd2e2ff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false, toneMapped: false }));
    this.glow.position.z = 0.15; this.glow.scale.setScalar(3); this.glow.renderOrder = 6;
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    pg.setAttribute("aLife", new THREE.BufferAttribute(this.life, 1).setUsage(THREE.DynamicDrawUsage));
    pg.setAttribute("aSeed", new THREE.BufferAttribute(Float32Array.from({ length: NP }, () => Math.random()), 1));
    this.parts = new THREE.Points(pg, new THREE.ShaderMaterial({ vertexShader: partVS, fragmentShader: partFS, uniforms: { uI: { value: 0 }, uScale: { value: 300 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.parts.frustumCulled = false; this.parts.renderOrder = 5;
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.36, 0.6, 16, 1, true).rotateX(Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x3a3c42, metalness: 0.8, roughness: 0.35, side: THREE.DoubleSide }));
    nozzle.position.z = NOZZLE_Z - 0.3;
    const flame = new THREE.Group(); flame.position.z = NOZZLE_Z; flame.add(this.core, this.outer, this.glow, this.parts);
    this.fx.name = "aw-turbo"; this.fx.add(nozzle, flame); flame.name = "aw-turbo-flame";
  }
  private plume(c0: number, c1: number, core: number, occ: number, gain: number) {
    const m = new THREE.ShaderMaterial({
      vertexShader: plumeVS, fragmentShader: plumeFS, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      // premultiplied "over" with partial occlusion: the orange edge stays visible against a bright sky
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      uniforms: { uT: { value: 0 }, uI: { value: 0 }, uCore: { value: core }, uOcc: { value: occ }, uGain: { value: gain }, uC0: { value: new THREE.Color(c0) }, uC1: { value: new THREE.Color(c1) } },
    });
    const mesh = new THREE.Mesh(plumeGeometry(), m); mesh.renderOrder = core ? 5 : 4; mesh.frustumCulled = false;
    return mesh;
  }
  /** Times are event timeStamps, so a slow frame between pointerdown and pointerup does not turn a tap into a hold. */
  private press(ts: number) {
    if (this.g.S.mode !== "plane") return;
    if (this.on) { this.set(false); this.pressOn = false; }
    else { this.set(true); this.pressOn = true; this.pressT = ts; }
  }
  private release(ts: number) {
    if (this.pressOn && ts - this.pressT > 350) this.set(false);
    this.pressOn = false;
  }
  private set(v: boolean) { this.on = v; this.btn.classList.toggle("lit", v); }
  private findPlane(): THREE.Object3D | null {
    if (this.plane && this.plane.parent) return this.plane;
    const p = this.g.S.plane;
    for (const o of this.g.scene.children)
      if ((o as THREE.Group).isGroup && o !== this.g.car && o.children.length >= 5 && Math.abs(o.position.x - p.x) < 0.01 && Math.abs(o.position.z - p.z) < 0.01 && Math.abs(o.position.y - p.y) < 0.01) return (this.plane = o);
    return null;
  }
  update(dt: number) {
    const flying = this.g.S.mode === "plane";
    if (!flying && this.on) { this.set(false); this.pressOn = false; }
    const w = window as unknown as { __awTurbo?: boolean; __awTurboK?: number; __awTurboV?: number; __awTurboLvl?: number };
    w.__awTurbo = this.on && flying; w.__awTurboK = 2; w.__awTurboV = TURBO_MAX;
    this.lvl += ((this.on && flying ? 1 : 0) - this.lvl) * Math.min(1, dt * (this.on ? 7 : 4));
    if (this.lvl < 0.003 && !this.on) this.lvl = 0;
    w.__awTurboLvl = this.lvl;
    if (this.on && flying) { const PS = this.g.S.plane as unknown as { s: number }; if (PS.s > TURBO_MAX) PS.s = TURBO_MAX; }
    this.fov(flying);
    const pl = flying ? this.findPlane() : null;
    if (pl && this.fx.parent !== pl) pl.add(this.fx);
    this.fx.visible = !!pl;
    const flame = this.fx.children[1];
    flame.visible = this.lvl > 0;
    if (!pl || !flame.visible) return;
    this.t += dt;
    const t = this.t, I = this.lvl;
    const f = 1 + Math.sin(t * 61) * 0.07 + Math.sin(t * 37 + 1.1) * 0.06 + (Math.random() - 0.5) * 0.08;
    for (const m of [this.core, this.outer]) { const u = (m.material as THREE.ShaderMaterial).uniforms; u.uT.value = t; u.uI.value = I; }
    this.core.scale.z = CORE_L * (0.45 + 0.55 * I) * f;
    this.outer.scale.z = OUTER_L * (0.4 + 0.6 * I) * (2 - f);
    const wob = 1 + (Math.random() - 0.5) * 0.06;
    this.outer.scale.x = this.outer.scale.y = OUTER_R * wob;
    (this.glow.material as THREE.SpriteMaterial).opacity = (0.5 + Math.random() * 0.2) * I;
    this.glow.scale.setScalar(3 * (0.8 + 0.2 * f));
    this.particles(dt, I);
  }
  private particles(dt: number, I: number) {
    const P = this.pos, V = this.vel, L = this.life;
    this.emit += dt * NP / 0.2 * I;
    for (let i = 0; i < NP; i++) {
      if (L[i] >= 1) {
        if (this.emit < 1) continue;
        this.emit -= 1;
        const r = Math.random() * 0.22, a = Math.random() * 6.283;
        P[i * 3] = Math.cos(a) * r; P[i * 3 + 1] = Math.sin(a) * r; P[i * 3 + 2] = Math.random() * 0.4;
        V[i * 3] = (Math.random() - 0.5) * 3.5; V[i * 3 + 1] = (Math.random() - 0.5) * 3.5; V[i * 3 + 2] = 28 + Math.random() * 18;
        L[i] = 0; this.ttl[i] = 0.14 + Math.random() * 0.16;
        continue;
      }
      L[i] = Math.min(1, L[i] + dt / this.ttl[i]);
      P[i * 3] += V[i * 3] * dt; P[i * 3 + 1] += V[i * 3 + 1] * dt; P[i * 3 + 2] += V[i * 3 + 2] * dt;
    }
    this.emit = Math.min(this.emit, 4);
    const geo = this.parts.geometry;
    geo.attributes.position.needsUpdate = true; geo.attributes.aLife.needsUpdate = true;
    const m = this.parts.material as THREE.ShaderMaterial;
    m.uniforms.uI.value = I;
    m.uniforms.uScale.value = this.g.renderer.domElement.height * 0.27;
  }
  /** FOV push through camera.zoom (< 1 widens): composes with gvMoto's speed FOV instead of fighting it. */
  private fov(flying: boolean) {
    const cam = this.g.camera;
    if (!flying && !this.zoomed) return;
    const base = cam.fov * Math.PI / 360, push = FOV_PUSH * (flying ? this.lvl : 0) * Math.PI / 360;
    const z = push > 1e-4 ? Math.tan(base) / Math.tan(base + push) : 1;
    if (Math.abs(cam.zoom - z) > 1e-4) { cam.zoom = z; cam.updateProjectionMatrix(); }
    this.zoomed = z !== 1;
  }
}
