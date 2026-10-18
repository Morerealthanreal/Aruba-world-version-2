// Glue between the SuperGrok SwimController and A's on-foot player. Off unless ?swim=1.
// A's walker only moves inside its land mask, so the sea edge is a wall. This lets the player wade out
// past it, swim (controller-driven, face-down stroke layered on the mocap idle), and walk back out on any
// beach. It hooks walker.animate, which A calls mid-update after placing the walker and before the camera
// follows it, so the swim pose and position land in the same frame. No per-frame allocation.
// A re-places the walker from its own controller (S.walk) every frame, so the swim controller moves a
// PlayerController mirrored from S.walk and the result is written back to S.walk, never to the mesh alone.
// Below the surface the camera gets an underwater tint (A sets its own near plane every frame).
import { AnimationMixer, Vector3, type Object3D, type SkinnedMesh } from "three";
import type { AGame } from "../env";
import { SwimController } from "./SwimController";
import type { PlayerController, SwimInput } from "./types";

type WalkState = { x: number; z: number; y: number; vy: number; g: number; face: number };
type Shared = { mode: string; walk: WalkState; camYaw: number; lookYaw: number; runToggle?: boolean };
type Walker = Object3D & { animate?: (speed: number, dt: number) => void };
type Game = AGame & {
  walker?: Walker;
  held?: Record<string, boolean>;
  joy?: { x: number; y: number };
  onLand?: (x: number, z: number) => boolean;
  blocked?: (x: number, z: number) => boolean;
};

const SEA = 0;
/** Body offset back along the facing while swimming so the horizontal body centres on the player point. */
const SWIM_BACK = 0.85;

export class SwimHook {
  ctrl: SwimController | null = null;
  private readonly g: Game;
  private readonly keys = new Set<string>();
  /** Mirror of A's walk controller (S.walk) handed to the SwimController. */
  private readonly proxy: PlayerController = { position: new Vector3(), velocity: new Vector3() };
  private readonly input: SwimInput = { forward: 0, strafe: 0, sprint: false, jump: false, lookYaw: undefined };
  private walker: Walker | null = null;
  private lastX = NaN;
  private lastZ = NaN;
  private speed = 0;
  private active = false;
  private readonly hAt: (x: number, z: number) => number;

  constructor(g: AGame) {
    this.g = g as Game;
    const real = g.real as unknown as { heightAt: (x: number, z: number) => number };
    this.hAt = (x, z) => real.heightAt(x, z);
    addEventListener("keydown", (e) => { this.keys.add(e.code); });
    addEventListener("keyup", (e) => { this.keys.delete(e.code); });
    addEventListener("blur", () => { this.keys.clear(); });
  }

  /** Main-loop tick: wait for the mocap walker, then hook it; undo the pose when leaving walk mode. */
  frame(): void {
    const w = this.g.walker;
    if (!this.ctrl && w && w.userData.awLoco === "on" && typeof w.animate === "function") this.hook(w);
    if (this.walker && this.active && (this.g.S as unknown as Shared).mode !== "walk") this.reset();
    // waterline camera: tint while the camera is under the surface (only while in the sea, so a low camera
    // over below-sea-level land never turns blue)
    if (this.ctrl) {
      if (this.active) this.ctrl.updateCamera(this.g.camera, false);
      else this.ctrl.clearCamera();
    }
  }

  private hook(w: Walker): void {
    let skinned: SkinnedMesh | null = null;
    w.traverse((o) => { if (!skinned && (o as SkinnedMesh).isSkinnedMesh) skinned = o as SkinnedMesh; });
    if (!skinned) return;
    const mesh: SkinnedMesh = skinned;
    const q = (this.g.real as unknown as { q: { name: string } }).q.name;
    // The loco mixer is private to locomotion.ts and keeps running underneath; the controller only stores it.
    this.ctrl = new SwimController(mesh, new AnimationMixer(mesh), {
      quality: q === "low" ? "low" : q === "high" ? "high" : "medium",
      seaLevel: SEA,
      footOffset: 0.05,
      body: this.proxy,
      rig: w,
      fxParent: this.g.scene,
    });
    this.walker = w;
    const orig = w.animate!;
    w.animate = (speed: number, dt: number) => {
      // swim: let the mixer hold the idle so the stroke layers on a calm pose; wading: real (slower) pace
      orig.call(w, this.active ? (this.ctrl && this.ctrl.swimming ? 0 : this.speed) : speed, dt);
      this.step(dt);
    };
    console.info("[aw-swim] hooked the on-foot player", mesh.skeleton.bones.length, "bones");
  }

  private reset(): void {
    const w = this.walker;
    if (w) w.rotation.x = 0;
    this.active = false;
    this.lastX = NaN;
  }

  private step(dtRaw: number): void {
    const ctrl = this.ctrl, w = this.walker;
    if (!ctrl || !w) return;
    const S = this.g.S as unknown as Shared;
    if (S.mode !== "walk") { if (this.active) this.reset(); return; }
    const dt = Math.min(dtRaw, 0.1);
    const a = S.walk;

    // movement intent, the same way A reads it (keys + touch joystick), turned into a world direction
    const k = this.keys, held = this.g.held || {}, joy = this.g.joy || { x: 0, y: 0 };
    const kb = (c: string) => (k.has(c) ? 1 : 0);
    const ix = Math.max(-1, Math.min(1, joy.x + kb("KeyD") + kb("ArrowRight") - kb("KeyA") - kb("ArrowLeft") + (held.right ? 1 : 0) - (held.left ? 1 : 0)));
    const iy = Math.max(-1, Math.min(1, -joy.y + kb("KeyW") + kb("ArrowUp") - kb("KeyS") - kb("ArrowDown")));
    const run = !!(S.runToggle || held.run || k.has("ShiftLeft") || k.has("ShiftRight"));
    const s = S.camYaw + S.lookYaw;
    let p = -Math.sin(s) * iy + Math.cos(s) * ix;
    let m = -Math.cos(s) * iy - Math.sin(s) * ix;
    const mag = Math.hypot(p, m);
    if (mag > 0.05) { p /= mag; m /= mag; }

    const here = this.hAt(a.x, a.z);
    const depthHere = SEA - here;
    const gameMoved = Number.isFinite(this.lastX) && (Math.abs(a.x - this.lastX) > 1e-5 || Math.abs(a.z - this.lastZ) > 1e-5);
    const inSea = depthHere > 0.08 || ctrl.inWater;

    if (!inSea) {
      // dry land: A is in charge. Its walkable mask is a coarse grid that stops short of the waterline,
      // so when A refused a step toward the sea (target outside the mask), take that step here.
      if (this.active) this.reset();
      if (!gameMoved && mag > 0.05) {
        if (this.walkTo(a, p, m, run, dt, true)) {
          a.g = this.hAt(a.x, a.z);
          if (a.y < a.g) a.y = a.g;
        }
      }
      this.lastX = a.x; this.lastZ = a.z;
      this.speed = 0;
      return;
    }
    this.active = true;

    if (!ctrl.swimming) {
      // wading: A refuses steps outside its mask, so walk them here; where A did move us (shallows still
      // inside the mask), slow its step down instead.
      const mult = ctrl.getWadingSpeedMultiplier(depthHere);
      if (gameMoved) {
        a.x = this.lastX + (a.x - this.lastX) * mult;
        a.z = this.lastZ + (a.z - this.lastZ) * mult;
      } else if (mag > 0.05) this.walkTo(a, p, m, run, dt);
      const ground = this.hAt(a.x, a.z);
      a.g = ground;
      if (a.y < ground) a.y = ground;
    }

    // the controller decides wade vs swim from the water column, floats and strokes the body
    this.proxy.position.set(a.x, a.y, a.z);
    const inp = this.input;
    inp.forward = mag > 0.05 ? Math.min(1, mag) : 0;
    inp.strafe = 0;
    inp.sprint = run;
    inp.jump = k.has("Space") || !!held.jump;
    inp.lookYaw = mag > 0.05 ? Math.atan2(p, m) : undefined;
    w.rotation.x = 0; // the controller re-pitches it while swimming
    ctrl.update(dt, inp, this.hAt);

    if (ctrl.swimming) {
      const pp = this.proxy.position;
      if (this.isBlocked(pp.x, pp.z)) pp.set(a.x, pp.y, a.z); // piers, hotels on stilts
      a.x = pp.x; a.z = pp.z;
      a.y = pp.y; a.g = pp.y; a.vy = 0;
    } else if (!ctrl.inWater) {
      w.rotation.x = 0;
    }

    const dx = a.x - (Number.isFinite(this.lastX) ? this.lastX : a.x), dz = a.z - (Number.isFinite(this.lastZ) ? this.lastZ : a.z);
    this.speed += (Math.hypot(dx, dz) / Math.max(dt, 1e-3) - this.speed) * Math.min(1, dt * 6);
    this.lastX = a.x; this.lastZ = a.z;

    // place the walker for this frame (A already set it from S.walk before calling animate)
    const back = ctrl.swimming ? SWIM_BACK : 0;
    // walker faces local -Z, so "back" is +Z rotated by its yaw
    w.position.set(a.x + Math.sin(w.rotation.y) * back, a.y, a.z + Math.cos(w.rotation.y) * back);
  }

  /** One step in the input direction at wading pace (A blocked it at its land-mask edge). */
  private walkTo(a: WalkState, p: number, m: number, run: boolean, dt: number, offMaskOnly = false): boolean {
    const ctrl = this.ctrl!;
    const v = run ? 3.4 : 1.6;
    const nx = a.x + p * v * dt, nz = a.z + m * v * dt;
    // on dry land only take the steps A's walkable mask refuses (A walks the rest itself)
    if (offMaskOnly && this.onLand(nx, nz)) return false;
    if (this.isBlocked(nx, nz)) return false;
    const nh = this.hAt(nx, nz);
    if (nh - Math.max(a.g, this.hAt(a.x, a.z)) > 1) return false; // same step limit as A
    const mult = ctrl.getWadingSpeedMultiplier(SEA - nh);
    a.x += (nx - a.x) * mult;
    a.z += (nz - a.z) * mult;
    return true;
  }

  private onLand(x: number, z: number): boolean {
    return typeof this.g.onLand === "function" ? this.g.onLand(x, z) : true;
  }

  private isBlocked(x: number, z: number): boolean {
    return typeof this.g.blocked === "function" ? this.g.blocked(x, z) : false;
  }
}
