// Drives the game's plane state (S.plane) with the SuperGrok flight model (FIX 3) in ./Plane.
// Experimental: only with ?flight=sg. Runs after the game's own plane step and overwrites
// position, heading, pitch, bank and speed, so the game keeps drawing the plane and its chase camera.
// Keys: Shift/Ctrl throttle up/down (held), R/F pitch rate up/down, Left/Right bank, G gear.
// The model's nose is +Z; the game's plane nose is -Z, so heading is offset by PI.
import type { AGame } from "../env";
import * as THREE from "three";
import { Plane } from "./Plane";
import type { FlightInput } from "./types";

type APlane = { x: number; y: number; z: number; h: number; p: number; r: number; s: number; thr: number; g: number };
type Real = { heightAt: (x: number, z: number) => number };

export class SgFlight {
  private g: AGame;
  private plane: Plane;
  private keys = new Set<string>();
  private input: FlightInput = { throttle: 0, elevator: 0, aileron: 0, rudder: 0, gear: false };
  private gearLatch = false;
  private active = false;
  private thr = 0;
  private ground: (x: number, z: number) => number;
  stats = { onGround: true, speed: 0, throttle: 0, y: 0, pitch: 0, bank: 0, gearVisible: true };

  private mounted = false;

  constructor(g: AGame) {
    this.g = g;
    this.plane = new Plane({});
    const real = g.real as unknown as Real | null;
    this.ground = (x, z) => (real ? Math.max(0, real.heightAt(x, z)) : 0);
    addEventListener("keydown", (e) => this.keys.add(e.code));
    addEventListener("keyup", (e) => this.keys.delete(e.code));
  }

  private findPlane(a: APlane): THREE.Object3D | null {
    for (const o of this.g.scene.children) {
      if ((o as THREE.Group).isGroup && o !== this.g.car && o.children.length >= 5
        && Math.abs(o.position.x - a.x) < 2 && Math.abs(o.position.z - a.z) < 2 && Math.abs(o.position.y - a.y) < 4) return o;
    }
    return null;
  }

  private mountGear(a: APlane) {
    const pl = this.findPlane(a);
    if (!pl) return;
    const old = pl.getObjectByName("aw-gear");
    if (old) old.visible = false;
    if (this.plane.gearGroup.parent !== pl) pl.add(this.plane.gearGroup);
    this.mounted = true;
  }

  update(dt: number) {
    const S = this.g.S as unknown as { mode: string; plane: APlane };
    if (S.mode !== "plane") { this.active = false; return; }
    const a = S.plane;
    const grp = this.plane.group;
    if (!this.active) {
      this.active = true;
      this.plane.adopt(a.x, a.y, a.z, a.h, a.s, a.y > (a.g || 0) + 8);
      this.thr = a.thr || 0;
    }
    this.mountGear(a);
    const k = this.keys;
    const up = k.has("ShiftLeft") || k.has("ShiftRight"), dn = k.has("ControlLeft") || k.has("ControlRight");
    this.thr = Math.min(1, Math.max(0, this.thr + ((up ? 1 : 0) - (dn ? 1 : 0)) * dt * 0.8));
    this.input.throttle = this.thr;
    this.input.elevator = (k.has("KeyR") ? 1 : 0) - (k.has("KeyF") ? 1 : 0);
    this.input.aileron = (k.has("ArrowRight") ? 1 : 0) - (k.has("ArrowLeft") ? 1 : 0);
    const gk = k.has("KeyG");
    this.input.gear = gk && !this.gearLatch;
    this.gearLatch = gk;
    this.plane.update(dt, this.input, this.ground);
    a.x = grp.position.x; a.y = grp.position.y; a.z = grp.position.z;
    a.h = this.plane.heading; a.p = this.plane.pitch; a.r = this.plane.bank;
    a.s = this.plane.speed; a.thr = this.thr;
    const st = this.stats;
    st.onGround = this.plane.isOnGround; st.speed = a.s; st.throttle = this.thr; st.y = a.y;
    st.pitch = a.p; st.bank = a.r; st.gearVisible = this.plane.gearGroup.visible;
  }
}
