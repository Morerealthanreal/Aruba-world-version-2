// Plane flight feel for phones. Installs window.__awFly, read by the hooks from tools/patch_plane.py:
//  - smoothed pitch (rate inertia, soft stick curve, gentle auto-level) and gentle banking (rate-limited, max ~49 deg)
//  - ground contact from terrain height, speed-dependent nose-wheel steering, rotate at 150 km/h (hands-off at 200 km/h
//    with throttle up), capped takeoff/rollout acceleration, DIVE on the ground = wheel brakes
//  - landing cushion: sink rate limited near the ground; hands-off with throttle under 50% settles onto the runway;
//    hands-off with throttle up climbs out to ~140 m after takeoff; landing gear below ~60 m AGL
//  - chase cam: yaw/pitch/distance smoothed, glued to the plane (no lag jitter at high speed), closer on portrait phones
//  - switching to the plane at Queen Beatrix Airport starts on runway 11/29 instead of 250 m up
// ?fly=0 restores A's flight model.
import * as THREE from "three";
import type { AGame } from "./env";

type Plane = { x: number; y: number; z: number; h: number; p: number; r: number; s: number; thr: number; g: number; q?: number };
type Real = { heightAt: (x: number, z: number) => number };

const VR = 42; // rotate speed, m/s (151 km/h)
const V_AUTO = 56; // hands-off rotation on the takeoff roll (200 km/h) when throttle is above half
const V_GLIDE = 40; // airborne speed floor at low throttle (144 km/h), above A's 32 m/s stall sink
const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
const curve = (v: number, k: number) => Math.sign(v) * Math.pow(Math.abs(v), k);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const agl = (a: Plane) => a.y - ((a.g || 0) + 2);

export class Fly {
  private g: AGame;
  private ch = 0; private cp = 0; private cd = 26; private camOn = false; private lx = 0; private lz = 0;
  private res = { h: 0, p: 0, d: 26 };
  private gear: THREE.Group; private gearK = 0; private plane: THREE.Object3D | null = null;
  private spawned: { x: number; z: number } | null = null;
  private mode = "";
  constructor(g: AGame) {
    this.g = g;
    this.gear = this.buildGear();
    (window as unknown as { __awFly: unknown }).__awFly = {
      gnd: (a: Plane) => a.y <= (a.g || 0) + 2.05,
      ctl: (a: Plane, c: number, t: number, e: number, s: boolean) => this.ctl(a, c, t, e, s),
      gs: (a: Plane) => 0.6 / (1 + Math.abs(a.s) / 15),
      acc: (a: Plane, d: number, e: number, s: boolean, c: number) => this.acc(a, d, e, s, c),
      vy: (a: Plane, h: number, _e: number, s: boolean) => this.vy(a, h, s),
      cam: (a: Plane, e: number, snap: number) => this.cam(a, e, snap),
      spawn: (a: Plane, prev: string) => this.spawn(a, prev),
    };
  }

  private ctl(a: Plane, c: number, t: number, e: number, s: boolean) {
    const qT = curve(c, 1.5) * 1.15;
    a.q = (a.q || 0) + (qT - (a.q || 0)) * Math.min(1, e * 7);
    a.p += a.q * e;
    const hands = Math.abs(c) < 0.08;
    if (hands) {
      // hands-off: level out, but climb out gently after takeoff (throttle up) or settle onto the ground (throttle back)
      const z = agl(a), lv = s ? 0 : a.thr > 0.5 ? (z < 90 ? 0.1 : z < 140 ? 0.1 * (140 - z) / 50 : 0) : z < 25 ? -0.035 : 0;
      a.p += (lv - a.p) * (1 - 0.4 ** e);
    }
    if (s) {
      if (hands && a.s > V_AUTO && a.thr > 0.5) a.p += (0.13 - a.p) * Math.min(1, e * 1.5);
      const pmax = a.s < VR ? 0.02 : 0.2;
      if (a.p > pmax) a.p += (pmax - a.p) * Math.min(1, e * 3);
      if (a.p < 0) { a.p = 0; a.q = Math.max(0, a.q); }
    }
    const bank = s ? 0 : -curve(t, 1.4) * 0.85;
    a.r += (bank - a.r) * Math.min(1, e * (s ? 6 : 3.2));
  }

  private acc(a: Plane, d: number, e: number, s: boolean, c: number) {
    const turbo = !!(window as unknown as { __awTurbo?: boolean }).__awTurbo;
    const brake = s && c < -0.3;
    let tgt = brake ? 0 : d;
    if (s && a.thr < 0.5) tgt *= (a.thr / 0.5) ** 2; // throttle back after touchdown: slow to taxi speed
    if (!s) tgt = Math.max(tgt, V_GLIDE);
    const k = (tgt - a.s) * 0.9;
    const up = s ? (turbo ? 14 : 7.5) : turbo ? 32 : 16;
    const dn = s ? (brake ? 10 : 5) : 12;
    return clamp(k, -dn, up) * e;
  }

  private vy(a: Plane, h: number, s: boolean) {
    if (!s && a.thr < 0.35) h -= ((0.35 - a.thr) / 0.35) * 4.5; // low throttle: glide down instead of losing all speed
    if (h >= 0) return h;
    const z = Math.max(0, agl(a));
    if (z > 45) return h;
    return Math.max(h, -(1.2 + z * 0.5 + z * z * 0.03));
  }

  private cam(a: Plane, e: number, snap: number) {
    const portrait = this.g.camera.aspect < 0.8;
    const td = (portrait ? 20 : 26) + Math.min(a.s, 160) * 0.055 + ((window as unknown as { __awTurboLvl?: number }).__awTurboLvl || 0) * 3;
    const jump = Math.hypot(a.x - this.lx, a.z - this.lz) > 300;
    this.lx = a.x; this.lz = a.z;
    if (!this.camOn || snap || jump) { this.ch = a.h; this.cp = a.p; this.cd = td; this.camOn = true; }
    this.ch += wrap(a.h - this.ch) * Math.min(1, e * 3);
    this.cp += (a.p - this.cp) * Math.min(1, e * 3);
    this.cd += (td - this.cd) * Math.min(1, e * 1.5);
    this.res.h = this.ch; this.res.p = this.cp; this.res.d = this.cd;
    return this.res;
  }

  /** Main runway = longest polyline in A's runway data; true when (x,z) is on or beside it. */
  private runway() {
    const rws = ((this.g as unknown as { DATA?: { runways?: number[][][] } }).DATA?.runways) || [];
    let best: number[][] | null = null, bl = 0;
    for (const r of rws) { const l = Math.hypot(r[r.length - 1][0] - r[0][0], r[r.length - 1][1] - r[0][1]); if (l > bl) { bl = l; best = r; } }
    return best && bl > 1500 ? { A: best[0], B: best[best.length - 1], L: bl } : null;
  }

  private spawn(a: Plane, prev: string) {
    if (prev === "plane") return;
    const rw = this.runway(); if (!rw) return;
    const dx = (rw.B[0] - rw.A[0]) / rw.L, dz = (rw.B[1] - rw.A[1]) / rw.L;
    const px = a.x - rw.A[0], pz = a.z - rw.A[1];
    const along = px * dx + pz * dz, side = Math.abs(px * dz - pz * dx);
    if (side > 450 || along < -600 || along > rw.L + 600) return;
    const fromA = along < rw.L / 2, k = fromA ? 90 : rw.L - 90, sg = fromA ? 1 : -1;
    a.x = rw.A[0] + dx * k; a.z = rw.A[1] + dz * k;
    a.h = Math.atan2(-dx * sg, -dz * sg);
    const real = this.g.real as unknown as Real | null;
    a.g = real ? Math.max(0, real.heightAt(a.x, a.z)) : 0;
    a.y = a.g + 2; a.p = 0; a.r = 0; a.s = 0; a.thr = 0; a.q = 0;
    this.spawned = { x: a.x, z: a.z };
    this.camOn = false;
    const t = document.getElementById("toast");
    if (t) {
      t.textContent = `Runway ${fromA ? "29" : "11"}, Queen Beatrix · hold THR+ to take off · DIVE brakes`;
      t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 4500);
    }
  }

  private buildGear() {
    const grp = new THREE.Group(); grp.name = "aw-gear";
    const strutM = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.6, roughness: 0.4 });
    const tyreM = new THREE.MeshStandardMaterial({ color: 0x1b1b1d, roughness: 0.9 });
    const strut = new THREE.CylinderGeometry(0.07, 0.07, 1, 6).translate(0, -0.5, 0);
    const tyre = new THREE.CylinderGeometry(0.26, 0.26, 0.22, 12).rotateZ(Math.PI / 2);
    for (const [x, z, top] of [[0, -3.3, -0.45], [-1.15, 0.4, -0.55], [1.15, 0.4, -0.55]] as const) {
      const leg = new THREE.Group(); leg.position.set(x, top, z);
      // wheel bottoms sit at y = -2, where A clamps the plane above the ground (a.y = ground + 2)
      const len = top + 1.74;
      const st = new THREE.Mesh(strut, strutM); st.scale.y = len; leg.add(st);
      const w = new THREE.Mesh(tyre, tyreM); w.position.y = -len; leg.add(w);
      grp.add(leg);
    }
    grp.visible = false;
    return grp;
  }

  private findPlane(): THREE.Object3D | null {
    if (this.plane && this.plane.parent) return this.plane;
    const p = this.g.S.plane;
    for (const o of this.g.scene.children)
      if ((o as THREE.Group).isGroup && o !== this.g.car && o.children.length >= 5 && Math.abs(o.position.x - p.x) < 0.01 && Math.abs(o.position.z - p.z) < 0.01 && Math.abs(o.position.y - p.y) < 0.01) return (this.plane = o);
    return null;
  }

  /** The bundle's plane Group (tv); null until the first plane frame. */
  get planeObj() { return this.findPlane(); }

  update(dt: number) {
    const S = this.g.S as unknown as { mode: string; plane: Plane };
    if (S.mode !== this.mode) { this.mode = S.mode; if (S.mode !== "plane") this.camOn = false; }
    if (S.mode !== "plane") return;
    const a = S.plane;
    if (this.spawned) {
      // A's teleport() calls setMode first and then moves the plane: undo the runway start if it was moved away
      if (Math.hypot(a.x - this.spawned.x, a.z - this.spawned.z) > 20) {
        const real = this.g.real as unknown as Real | null;
        a.y = Math.max((real ? real.heightAt(a.x, a.z) : 0) + 200, 250); a.s = 65; a.thr = 0.65; a.p = 0.05;
      }
      this.spawned = null;
    }
    const pl = this.findPlane();
    if (!pl) return;
    if (this.gear.parent !== pl) pl.add(this.gear);
    const down = agl(a) < (this.gearK > 0.5 ? 70 : 55);
    this.gearK = clamp(this.gearK + (down ? dt : -dt) / 1.6, 0, 1);
    this.gear.visible = this.gearK > 0.01;
    this.gear.scale.setScalar(this.gearK);
    this.gear.position.y = (1 - this.gearK) * 0.4;
  }
}
