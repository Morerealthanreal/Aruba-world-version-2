// Plane flight model: aerodynamic lift, drag, stall dynamics, throttle authority,
// Queen Beatrix Airport runway takeoff & landing, and smooth mode switching.
// Hooks into window.__awFly called from the game loop:
//  - gnd: ground contact detection from terrain elevation
//  - ctl: pitch, bank, and stall recovery dynamics with speed-dependent control authority
//  - gs: speed-dependent nose-wheel ground steering
//  - acc: engine thrust, parasitic drag, induced drag, and runway wheel brakes
//  - vy: wing lift, stall sink, low-speed lift deficit, and ground effect landing cushion
//  - cam: smoothed chase camera with dynamic distance and elevation
//  - spawn: Queen Beatrix Airport runway 11/29 spawn
// ?fly=0 restores A's flight model.
import * as THREE from "three";
import type { AGame } from "./env";

export type PlaneState = {
  x: number;
  y: number;
  z: number;
  h: number;
  p: number;
  r: number;
  s: number;
  thr: number;
  g: number;
  q?: number;
  stalled?: boolean;
  stallWarn?: number;
};

type Real = { heightAt: (x: number, z: number) => number };

const VR = 38.0; // Rotate speed on takeoff roll, m/s (137 km/h)
const V_AUTO = 54.0; // Hands-off rotation on takeoff roll when throttle > 50%
const V_STALL = 28.0; // Aerodynamic stall speed, m/s (100 km/h)
const V_STALL_RECOVER = 34.0; // Airflow reattachment recovery speed, m/s (122 km/h)
const ALPHA_CRIT = 0.32; // Critical stall angle of attack (~18.3 degrees)

const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
const curve = (v: number, k: number) => Math.sign(v) * Math.pow(Math.abs(v), k);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const agl = (a: PlaneState) => a.y - ((a.g || 0) + 2);

export class Fly {
  private g: AGame;
  private ch = 0;
  private cp = 0;
  private cd = 26;
  private camOn = false;
  private lx = 0;
  private lz = 0;
  private res = { h: 0, p: 0, d: 26 };
  private gear: THREE.Group;
  private gearK = 0;
  private plane: THREE.Object3D | null = null;
  private spawned: { x: number; z: number } | null = null;
  private prevMode = "";
  private lastStallToast = 0;

  constructor(g: AGame) {
    this.g = g;
    this.gear = this.buildGear();
    (window as unknown as { __awFly: unknown }).__awFly = {
      gnd: (a: PlaneState) => this.isGrounded(a),
      ctl: (a: PlaneState, c: number, t: number, e: number, s: boolean) => this.ctl(a, c, t, e, s),
      gs: (a: PlaneState) => this.groundSteer(a),
      acc: (a: PlaneState, d: number, e: number, s: boolean, c: number) => this.acc(a, d, e, s, c),
      vy: (a: PlaneState, h: number, _e: number, s: boolean) => this.vy(a, h, s),
      cam: (a: PlaneState, e: number, snap: number) => this.cam(a, e, snap),
      spawn: (a: PlaneState, prev: string) => this.spawn(a, prev),
    };
  }

  /** Ground contact test against terrain elevation */
  private isGrounded(a: PlaneState): boolean {
    return a.y <= (a.g || 0) + 2.05;
  }

  /** Speed-dependent nose-wheel ground steering authority */
  private groundSteer(a: PlaneState): number {
    return 0.65 / (1 + Math.abs(a.s) / 14);
  }

  /** Pitch and roll flight control with dynamic pressure authority and stall dynamics */
  private ctl(a: PlaneState, c: number, t: number, e: number, s: boolean): void {
    // Current flight path climb rate and angle of attack
    const vyEst = Math.sin(a.p) * a.s;
    const flightPathAngle = Math.atan2(vyEst, Math.max(1.0, Math.abs(a.s)));
    const alpha = a.p - flightPathAngle;

    // Detect aerodynamic stall when airborne
    if (!s) {
      if (!a.stalled && (a.s < V_STALL || (a.s < 38 && a.p > 0.32) || (alpha > ALPHA_CRIT && a.s < 50))) {
        a.stalled = true;
        this.notifyStall();
      } else if (a.stalled && a.s >= V_STALL_RECOVER && a.p < 0.12) {
        a.stalled = false;
      }
    } else {
      a.stalled = false;
    }

    if (a.stalled) {
      // Natural aerodynamic stall recovery moment:
      // Weight of engine pulls nose down towards -0.20 rad (-11.5 deg)
      const targetStallPitch = -0.20;
      a.p += (targetStallPitch - a.p) * Math.min(1, e * 3.2);

      // Up-elevator authority is severely reduced due to wing airflow separation
      const qT = curve(Math.min(0.08, c), 1.5) * 0.35;
      a.q = (a.q || 0) + (qT - (a.q || 0)) * Math.min(1, e * 7);
      a.p += a.q * e;
    } else {
      // Normal elevator response scaling with dynamic pressure
      const ctlAuth = clamp(a.s / 36, 0.25, 1.0);
      const qT = curve(c, 1.5) * 1.15 * ctlAuth;
      a.q = (a.q || 0) + (qT - (a.q || 0)) * Math.min(1, e * 7);
      a.p += a.q * e;

      const hands = Math.abs(c) < 0.08;
      if (hands) {
        // Hands-off trim: gentle climbout on takeoff with throttle up, gentle descent if throttle low, or level cruise
        const z = agl(a);
        const lv = s ? 0 : a.thr > 0.5 ? (z < 90 ? 0.10 : z < 140 ? 0.10 * (140 - z) / 50 : 0.0) : z < 25 ? -0.035 : -0.01;
        a.p += (lv - a.p) * (1 - 0.4 ** e);
      }
    }

    if (s) {
      // On the runway before rotate speed (VR), nose is clamped down on front wheel
      if (Math.abs(c) < 0.08 && a.s > V_AUTO && a.thr > 0.5) {
        a.p += (0.13 - a.p) * Math.min(1, e * 1.5);
      }
      const pmax = a.s < VR ? 0.02 : 0.22;
      if (a.p > pmax) a.p += (pmax - a.p) * Math.min(1, e * 3);
      if (a.p < 0) {
        a.p = 0;
        a.q = Math.max(0, a.q || 0);
      }
    }

    // Aileron roll banking
    const bank = s ? 0 : -curve(t, 1.4) * 0.85;
    a.r += (bank - a.r) * Math.min(1, e * (s ? 6 : 3.2));
  }

  /** Engine thrust, parasitic drag, induced drag, and runway wheel braking */
  private acc(a: PlaneState, d: number, e: number, s: boolean, c: number): number {
    const turbo = !!(window as unknown as { __awTurbo?: boolean }).__awTurbo;
    const brake = s && c < -0.3;

    let tgt = brake ? 0 : d;

    if (s) {
      // On the ground: throttle back to taxi speed or apply wheel brakes
      if (a.thr < 0.5) tgt *= (a.thr / 0.5) ** 2;
    } else {
      // In flight: target airspeed scales with throttle [0, 115] m/s, reduced by climb angle
      tgt = a.thr * (turbo ? 155.0 : 115.0);
      tgt *= Math.max(0.2, 1.0 - Math.sin(Math.max(0, a.p)) * 1.5);
    }

    const k = (tgt - a.s) * 0.88;

    // Acceleration limits
    const up = s ? (turbo ? 14 : 7.8) : turbo ? 32 : 16.5;

    // Deceleration: induced drag increases with climb pitch and stall
    let dn = s ? (brake ? 14.0 : 5.0) : 7.5;
    if (!s) {
      // Induced drag from pitch angle
      dn += Math.max(0, a.p) * 20.0;
      if (a.stalled) dn += 8.0;
    }

    return clamp(k, -dn, up) * e;
  }

  /** Aerodynamic lift, stall sink, low-speed lift deficit, and ground effect landing cushion */
  private vy(a: PlaneState, h: number, s: boolean): number {
    if (s) return 0;

    if (a.stalled) {
      // Wing lift collapsed: rapid aerodynamic stall sink rate
      return Math.min(h - 7.5, -12.5);
    }

    // Low-speed lift deficit: below 38 m/s, lift diminishes towards stall
    if (a.s < 38.0) {
      const liftRatio = clamp((a.s - V_STALL) / 10.0, 0, 1);
      h -= (1.0 - liftRatio) * 4.5;
    }

    // Low throttle descent glide
    if (a.thr < 0.35) {
      h -= ((0.35 - a.thr) / 0.35) * 3.8;
    }

    if (h >= 0) return h;

    // Ground effect landing cushion: arrests descent rate near runway surface for smooth touchdown
    const z = Math.max(0, agl(a));
    if (z > 40) return h;
    return Math.max(h, -(0.8 + z * 0.45 + z * z * 0.025));
  }

  /** Chase camera tracking */
  private cam(a: PlaneState, e: number, snap: number) {
    const portrait = this.g.camera.aspect < 0.8;
    const td = (portrait ? 20 : 26) + Math.min(a.s, 160) * 0.055 + ((window as unknown as { __awTurboLvl?: number }).__awTurboLvl || 0) * 3;
    const jump = Math.hypot(a.x - this.lx, a.z - this.lz) > 300;
    this.lx = a.x;
    this.lz = a.z;
    if (!this.camOn || snap || jump) {
      this.ch = a.h;
      this.cp = a.p;
      this.cd = td;
      this.camOn = true;
    }
    this.ch += wrap(a.h - this.ch) * Math.min(1, e * 3);
    this.cp += (a.p - this.cp) * Math.min(1, e * 3);
    this.cd += (td - this.cd) * Math.min(1, e * 1.5);
    this.res.h = this.ch;
    this.res.p = this.cp;
    this.res.d = this.cd;
    return this.res;
  }

  /** Main runway at Queen Beatrix Airport (longest polyline in runway database) */
  private runway() {
    const rws = ((this.g as unknown as { DATA?: { runways?: number[][][] } }).DATA?.runways) || [];
    let best: number[][] | null = null;
    let bl = 0;
    for (const r of rws) {
      const l = Math.hypot(r[r.length - 1][0] - r[0][0], r[r.length - 1][1] - r[0][1]);
      if (l > bl) {
        bl = l;
        best = r;
      }
    }
    return best && bl > 1500 ? { A: best[0], B: best[best.length - 1], L: bl } : null;
  }

  /** Spawn on Queen Beatrix Airport runway 11/29 or airborne */
  private spawn(a: PlaneState, prev: string): void {
    if (prev === "plane") return;
    const rw = this.runway();
    if (!rw) return;

    const dx = (rw.B[0] - rw.A[0]) / rw.L;
    const dz = (rw.B[1] - rw.A[1]) / rw.L;
    const px = a.x - rw.A[0];
    const pz = a.z - rw.A[1];
    const along = px * dx + pz * dz;
    const side = Math.abs(px * dz - pz * dx);

    // If within airport vicinity (600m along, 450m side), spawn on runway
    if (side <= 450 && along >= -600 && along <= rw.L + 600) {
      const fromA = along < rw.L / 2;
      const k = fromA ? 90 : rw.L - 90;
      const sg = fromA ? 1 : -1;
      a.x = rw.A[0] + dx * k;
      a.z = rw.A[1] + dz * k;
      a.h = Math.atan2(-dx * sg, -dz * sg);
      const real = this.g.real as unknown as Real | null;
      a.g = real ? Math.max(0, real.heightAt(a.x, a.z)) : 0;
      a.y = a.g + 2;
      a.p = 0;
      a.r = 0;
      a.s = 0;
      a.thr = 0;
      a.q = 0;
      a.stalled = false;
      this.spawned = { x: a.x, z: a.z };
      this.camOn = false;

      const t = document.getElementById("toast");
      if (t) {
        t.textContent = `Runway ${fromA ? "29" : "11"}, Queen Beatrix · hold THR+ to take off · DIVE brakes`;
        t.classList.add("on");
        setTimeout(() => t.classList.remove("on"), 4500);
      }
    }
  }

  /** Show toast alert when plane stalls */
  private notifyStall(): void {
    const now = performance.now();
    if (now - this.lastStallToast < 4000) return;
    this.lastStallToast = now;
    const t = document.getElementById("toast");
    if (t) {
      t.textContent = "⚠️ STALL — PITCH DOWN / ADD THROTTLE";
      t.classList.add("on");
      setTimeout(() => t.classList.remove("on"), 2500);
    }
  }

  /** Construct 3-wheel landing gear geometry and materials */
  private buildGear(): THREE.Group {
    const grp = new THREE.Group();
    grp.name = "aw-gear";
    const strutM = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.6, roughness: 0.4 });
    const tyreM = new THREE.MeshStandardMaterial({ color: 0x1b1b1d, roughness: 0.9 });
    const strut = new THREE.CylinderGeometry(0.07, 0.07, 1, 6).translate(0, -0.5, 0);
    const tyre = new THREE.CylinderGeometry(0.26, 0.26, 0.22, 12).rotateZ(Math.PI / 2);
    for (const [x, z, top] of [
      [0, -3.3, -0.45],
      [-1.15, 0.4, -0.55],
      [1.15, 0.4, -0.55],
    ] as const) {
      const leg = new THREE.Group();
      leg.position.set(x, top, z);
      const len = top + 1.74;
      const st = new THREE.Mesh(strut, strutM);
      st.scale.y = len;
      leg.add(st);
      const w = new THREE.Mesh(tyre, tyreM);
      w.position.y = -len;
      leg.add(w);
      grp.add(leg);
    }
    grp.visible = false;
    return grp;
  }

  private findPlane(): THREE.Object3D | null {
    if (this.plane && this.plane.parent) return this.plane;
    const p = this.g.S.plane;
    for (const o of this.g.scene.children) {
      if (
        (o as THREE.Group).isGroup &&
        o !== this.g.car &&
        o.children.length >= 5 &&
        Math.abs(o.position.x - p.x) < 0.01 &&
        Math.abs(o.position.z - p.z) < 0.01 &&
        Math.abs(o.position.y - p.y) < 0.01
      ) {
        return (this.plane = o);
      }
    }
    return null;
  }

  /** The bundle's plane Group (tv); null until the first plane frame. */
  get planeObj() {
    return this.findPlane();
  }

  /** Frame tick: handles mode transitions, landing gear extension, and safe mode switching */
  update(dt: number) {
    const S = this.g.S as unknown as { mode: string; plane: PlaneState; car: { x: number; z: number; y: number; h: number; snap?: boolean } };
    if (S.mode !== this.prevMode) {
      const from = this.prevMode;
      this.prevMode = S.mode;

      if (from === "plane" && S.mode === "car") {
        // Smooth switching from plane to car: snap car safely to nearest road
        const car = S.car;
        if (this.g.nearestRoad) {
          const road = this.g.nearestRoad(car.x, car.z);
          if (road) {
            car.x = road.x;
            car.z = road.z;
            car.h = road.h;
            car.snap = true;
          }
        }
      }

      if (S.mode !== "plane") this.camOn = false;
    }

    if (S.mode !== "plane") return;
    const a = S.plane;

    if (this.spawned) {
      if (Math.hypot(a.x - this.spawned.x, a.z - this.spawned.z) > 20) {
        const real = this.g.real as unknown as Real | null;
        a.y = Math.max((real ? real.heightAt(a.x, a.z) : 0) + 200, 250);
        a.s = 65;
        a.thr = 0.65;
        a.p = 0.05;
      }
      this.spawned = null;
    }

    const pl = this.findPlane();
    if (!pl) return;
    if (this.gear.parent !== pl) pl.add(this.gear);

    // Deploy landing gear when low (below 60 m AGL), retract when climbing out
    const down = agl(a) < (this.gearK > 0.5 ? 70 : 55);
    this.gearK = clamp(this.gearK + (down ? dt : -dt) / 1.6, 0, 1);
    this.gear.visible = this.gearK > 0.01;
    this.gear.scale.setScalar(this.gearK);
    this.gear.position.y = (1 - this.gearK) * 0.4;
  }
}
