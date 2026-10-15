// Emergency vehicles in A's ambient traffic (real.amb.cars: 3 LOW / 6 MED / 9 HIGH cars).
// Each time a traffic car respawns on a new road it has a 10% chance to become an emergency
// vehicle: police 6 : ambulance 3 : fire 1. Police and ambulances swap in an evModels vehicle
// (models/ev.glb, ~11 draws, LOD beyond 45 m; until it has loaded they use the repaint below).
// Fire repaints the kit car: 3 small meshes (light bar halves + livery stripe), MeshBasicMaterial.
// No new lights, no new passes.
//  - police (KPA Aruba): white body, blue side stripe, red/blue bar
//  - ambulance: white body, red stripe, red/white bar; fire: red body, white stripe, red bar
// Bars switch on for random stretches (15-40 s on, 10-35 s off) and flash (bloom on MED/HIGH).
// Siren (WebAudio, nearest active vehicle within 160 m) is OFF by default: A has no audio, so it is
// opt-in from Settings ("Siren sound", stored aw_siren=1). ?emerg=0 disables everything,
// ?emerg=force makes every car an emergency vehicle (screenshots/tests).
import { Box3, BoxGeometry, BufferGeometry, Color, Float32BufferAttribute, Mesh, MeshBasicMaterial, Raycaster, Vector3, type Material, type Object3D } from "three";
import type { AGame } from "./env";
import { params } from "./env";
import { buildEv, evNight, evReady, flashBar, loadEv, type EvModel } from "./evModels";
import { uNight } from "./uniforms";

type Role = "police" | "amb" | "fire";
type Car = { g: Object3D; v: number; rd: unknown; s?: number };
type PaintMat = Material & { color: Color; roughness: number; metalness: number; clearcoat?: number; userData: Record<string, unknown> };
type St = { role: Role | null; rd: unknown; paint?: PaintMat; base?: { c: Color; r: number; m: number; cc?: number };
  box?: Box3; bar?: Mesh[]; stripe?: Mesh; on: boolean; t: number; ph: number; model?: EvModel; mkind?: string; orig?: Object3D[] };

const BAR = new BoxGeometry(1, 1, 1);
const RED = new Color(1, 0.06, 0.04), BLUE = new Color(0.1, 0.25, 1), WHITE = new Color(1, 1, 1), DIM = new Color(0.12, 0.12, 0.14);
const LIVERY: Record<Role, { body: string; stripe: string; a: Color; b: Color }> = {
  police: { body: "#f4f5f7", stripe: "#1747b8", a: RED, b: BLUE },
  amb: { body: "#f6f6f2", stripe: "#d0121b", a: RED, b: WHITE },
  fire: { body: "#b5141c", stripe: "#f3f3f3", a: RED, b: RED },
};

/** livery stripe (0.16 m tall at height ys) projected onto the car's painted sides, broken at the wheel arches */
function stripeGeo(car: Object3D, paint: Material, box: Box3, ys: number): BufferGeometry | null {
  const body = car.children.filter((ch) => (ch as Mesh).isMesh && (ch as Mesh).material === paint);
  if (!body.length) return null;
  car.updateMatrixWorld(true);
  const inv = car.matrixWorld.clone().invert(), ray = new Raycaster(), o = new Vector3(), d = new Vector3();
  const N = 24, z0 = box.min.z + (box.max.z - box.min.z) * 0.07, z1 = box.max.z - (box.max.z - box.min.z) * 0.07;
  const at = (side: number, y: number, z: number): Vector3 | null => {
    o.set(side * (box.max.x + 1), y, z).applyMatrix4(car.matrixWorld);
    d.set(-side, 0, 0).transformDirection(car.matrixWorld);
    ray.set(o, d);
    const h = ray.intersectObjects(body, false)[0];
    if (!h) return null;
    const p = h.point.applyMatrix4(inv);
    p.x += side * 0.012;
    return p;
  };
  const pos: number[] = [];
  for (const side of [-1, 1]) {
    let prev: [Vector3, Vector3] | null = null;
    for (let i = 0; i <= N; i++) {
      const z = z0 + ((z1 - z0) * i) / N, lo = at(side, ys - 0.08, z), hi = at(side, ys + 0.08, z);
      const cur: [Vector3, Vector3] | null = lo && hi ? [lo, hi] : null;
      if (prev && cur) {
        const [a, b] = side > 0 ? [cur, prev] : [prev, cur];
        pos.push(a[0].x, a[0].y, a[0].z, b[0].x, b[0].y, b[0].z, b[1].x, b[1].y, b[1].z, a[0].x, a[0].y, a[0].z, b[1].x, b[1].y, b[1].z, a[1].x, a[1].y, a[1].z);
      }
      prev = cur;
    }
  }
  if (!pos.length) return null;
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  return g;
}

export class Emergency {
  stats = { police: 0, amb: 0, fire: 0, active: 0, rolls: 0 };
  private st = new Map<Object3D, St>();
  private force = params.get("emerg") === "force";
  private audio: { ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null = null;
  private siren = false;
  private time = 0;
  private night = -1;

  constructor(private g: AGame) {
    void loadEv();
    try { this.siren = localStorage.getItem("aw_siren") === "1"; } catch { /* private mode */ }
    this.mountToggle(0);
  }

  private pickRole(): Role | null {
    this.stats.rolls++;
    if (!this.force && Math.random() >= 0.1) return null;
    const r = Math.random() * 10;
    return r < 6 ? "police" : r < 9 ? "amb" : "fire";
  }

  private setup(c: Car, s: St) {
    const mats = (this.g.real as unknown as { amb?: { mats?: Record<string, Material> } }).amb?.mats || {};
    const shared = new Set(Object.values(mats));
    const box = new Box3();
    for (const ch of c.g.children) {
      const m = ch as Mesh; if (!m.isMesh || m.name.startsWith("aw:")) continue;
      m.geometry.computeBoundingBox(); box.union(m.geometry.boundingBox!);
      const mat = m.material as PaintMat;
      if (!s.paint && !Array.isArray(mat) && !shared.has(mat) && !mat.userData?.pid && mat.color) s.paint = mat;
    }
    s.box = box;
    if (s.paint) s.base = { c: s.paint.color.clone(), r: s.paint.roughness, m: s.paint.metalness, cc: s.paint.clearcoat };
    const sx = box.max.x - box.min.x, sz = box.max.z - box.min.z, top = box.max.y;
    const cz = box.min.z + sz * 0.55;
    s.bar = [-1, 1].map((side) => {
      const b = new Mesh(BAR, new MeshBasicMaterial({ color: DIM, toneMapped: false }));
      b.scale.set(sx * 0.3, 0.12, 0.28); b.position.set(side * sx * 0.16, top + 0.06, cz);
      b.name = "aw:ebar"; b.visible = false; c.g.add(b); return b;
    });
    const ys = box.min.y + (top - box.min.y) * 0.42;
    const hug = s.paint ? stripeGeo(c.g, s.paint, box, ys) : null;
    const st = new Mesh(hug || BAR, new MeshBasicMaterial({ color: 0xffffff }));
    if (!hug) { st.scale.set(sx + 0.03, 0.16, sz * 0.86); st.position.set(0, ys, (box.min.z + box.max.z) / 2); }
    st.name = "aw:estripe"; st.visible = false; c.g.add(st); s.stripe = st;
  }

  private useModel(c: Car, s: St, role: Role | null) {
    if (!s.orig) s.orig = c.g.children.filter((ch) => !ch.name.startsWith("aw:"));
    if (s.model) { c.g.remove(s.model.g); s.model = undefined; }
    const want = (role === "police" || role === "amb") && evReady();
    for (const o of s.orig) o.visible = !want;
    if (!want) return;
    const kind = role === "police" ? (Math.random() < 0.6 ? "everest" : "isuzu") : (Math.random() < 0.5 ? "ambY" : "ambP");
    const m = buildEv(kind, [45, 50, 67, 38, 71][(Math.random() * 5) | 0]);
    c.g.add(m.g); s.model = m; s.mkind = kind;
  }

  private apply(c: Car, s: St, role: Role | null) {
    if (s.role) this.stats[s.role]--;
    s.role = role;
    if (role) this.stats[role]++;
    this.useModel(c, s, role);
    if (s.model) { if (s.bar) for (const b of s.bar) b.visible = false; if (s.stripe) s.stripe.visible = false; s.on = Math.random() < 0.6; s.t = 5 + Math.random() * 25; s.ph = Math.random() * 10; return; }
    if (role && !s.bar) this.setup(c, s);
    const p = s.paint;
    if (p && s.base) {
      if (role) { p.color.set(LIVERY[role].body); p.roughness = 0.45; p.metalness = 0.1; }
      else { p.color.copy(s.base.c); p.roughness = s.base.r; p.metalness = s.base.m; }
    }
    if (s.bar) for (const b of s.bar) b.visible = !!role;
    if (s.stripe) { s.stripe.visible = !!role; if (role) (s.stripe.material as MeshBasicMaterial).color.set(LIVERY[role].stripe); }
    s.on = !!role && Math.random() < 0.6; s.t = 5 + Math.random() * 25; s.ph = Math.random() * 10;
  }

  update(dt: number) {
    this.time += dt;
    const k = Math.round(Math.max(0, Math.min(1, (uNight.value - 0.3) / 0.4)) * 50) / 50;
    if (k !== this.night) { this.night = k; evNight(k); }
    const A = this.g.real as unknown as { amb?: { cars: Car[] } } | null;
    const cars = A?.amb?.cars; if (!cars) return;
    const cam = this.g.camera.position;
    let near: { d: number; s: St } | null = null; let active = 0;
    for (const c of cars) {
      let s = this.st.get(c.g);
      if (!s) { s = { role: null, rd: null, on: false, t: 0, ph: 0 }; this.st.set(c.g, s); }
      if (c.rd && c.rd !== s.rd) { s.rd = c.rd; this.apply(c, s, this.pickRole()); }
      else if ((s.role === "police" || s.role === "amb") && !s.model && evReady()) this.apply(c, s, s.role); // rolled before ev.glb loaded
      if (s.role && s.model) { if ((s.t -= dt) <= 0) { s.on = !s.on; s.t = s.on ? 15 + Math.random() * 25 : 10 + Math.random() * 25; } flashBar(s.model, this.time, s.ph, s.on && c.g.visible); if (s.on && c.g.visible) { active++; const d = c.g.position.distanceTo(cam); if (d < 160 && (!near || d < near.d)) near = { d, s }; } continue; }
      if (!s.role || !s.bar) continue;
      if ((s.t -= dt) <= 0) { s.on = !s.on; s.t = s.on ? 15 + Math.random() * 25 : 10 + Math.random() * 25; }
      const L = LIVERY[s.role];
      const [l, r] = s.bar as [Mesh, Mesh];
      const lm = l.material as MeshBasicMaterial, rm = r.material as MeshBasicMaterial;
      if (s.on && c.g.visible) {
        active++;
        // quad-flash pattern: left 2 blinks, right 2 blinks, ~2.5 cycles/s
        const f = ((this.time + s.ph) * 2.5) % 1, k = Math.floor(f * 8);
        const leftOn = k < 4 && (k & 1) === 0, rightOn = k >= 4 && (k & 1) === 0;
        lm.color.copy(leftOn ? L.a : DIM).multiplyScalar(leftOn ? 3 : 1);
        rm.color.copy(rightOn ? L.b : DIM).multiplyScalar(rightOn ? 3 : 1);
        const d = c.g.position.distanceTo(cam);
        if (d < 160 && (!near || d < near.d)) near = { d, s };
      } else { lm.color.copy(DIM); rm.color.copy(DIM); }
    }
    this.stats.active = active;
    this.sound(near);
  }

  ext: { d: number; ph: number } | null = null;
  private sound(near0: { d: number; s: St } | null) {
    let near = near0;
    if (this.ext && (!near || this.ext.d < near.d)) near = { d: this.ext.d, s: { role: "police", rd: null, on: true, t: 0, ph: this.ext.ph } };
    if (!this.siren || !this.audio) { if (this.audio) this.audio.gain.gain.value = 0; return; }
    const { ctx, osc, gain } = this.audio, t = ctx.currentTime;
    if (!near || document.hidden) { gain.gain.setTargetAtTime(0, t, 0.1); return; }
    const role = near.s.role!;
    // police: wail sweep 650-1450 Hz over 4 s; ambulance/fire: hi-lo 960/770 Hz
    const ph = (this.time + near.s.ph) % 4;
    const f = role === "police" ? 650 + 800 * (ph < 2 ? ph / 2 : (4 - ph) / 2) : ((this.time * 1.4) % 1 < 0.5 ? 960 : 770);
    osc.frequency.setTargetAtTime(f, t, 0.02);
    gain.gain.setTargetAtTime(0.07 * Math.max(0, 1 - near.d / 160) ** 1.5, t, 0.08);
  }

  private startAudio() {
    if (this.audio) { void this.audio.ctx.resume(); return; }
    try {
      const ctx = new AudioContext(), osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sawtooth"; gain.gain.value = 0;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200;
      osc.connect(lp).connect(gain).connect(ctx.destination); osc.start();
      this.audio = { ctx, osc, gain };
    } catch { this.audio = null; }
  }

  private mountToggle(tries: number) {
    const box = document.getElementById("awtime");
    if (!box) { if (tries < 60) setTimeout(() => this.mountToggle(tries + 1), 500); return; }
    const lbl = document.createElement("div"); lbl.className = "lbl"; lbl.textContent = "Siren sound";
    const row = document.createElement("div"); row.className = "row";
    const b = document.createElement("button"); b.id = "awsiren";
    const label = () => { b.textContent = this.siren ? "Sirens: ON" : "Sirens: OFF"; };
    label();
    b.onclick = () => {
      this.siren = !this.siren; label();
      try { localStorage.setItem("aw_siren", this.siren ? "1" : "0"); } catch { /* ignore */ }
      if (this.siren) this.startAudio(); else if (this.audio) void this.audio.ctx.suspend();
    };
    row.appendChild(b); box.append(lbl, row);
    // a stored ON needs a user gesture before audio can start
    if (this.siren) addEventListener("pointerdown", () => this.startAudio(), { once: true });
  }
}
