// Glue between the SuperGrok Boat and A's game. Off unless ?boat=1.
// Walk to any beach and a small motorboat is moored just offshore; press E (or tap the prompt) to take it,
// W/S throttle, A/D rudder, E again near the shore to step off. While aboard the on-foot player rides along
// hidden (S.walk follows the boat). The hull floats on the ocean add-on's CPU waveHeight(x, z, t) when the
// SuperGrok ocean (?ocean=1) is loaded, else on a small sum-of-sines swell. While aboard, the Boat's chase
// camera (behind and above the hull) is applied just before each render: A re-places its camera every
// frame, so the scene's onBeforeRender is the one point where the chase pose sticks. No per-frame allocation.
import { Vector3, type Object3D } from "three";
import type { AGame } from "../env";
import { Boat } from "./Boat";
import type { BoatInput, WaveHeightFn } from "./types";
import { fallbackSwell, oceanWave } from "./waves";

type WalkState = { x: number; z: number; y: number; vy: number; g: number; face: number; snap?: boolean };
type Shared = { mode: string; walk: WalkState; camYaw: number; lookYaw: number; dragging?: boolean };
type Game = AGame & {
  walker?: Object3D;
  held?: Record<string, boolean>;
  joy?: { x: number; y: number };
  onLand?: (x: number, z: number) => boolean;
  blocked?: (x: number, z: number) => boolean;
};

const SEA = 0;
/** Moored boats sit in water at least this deep (hull grounds above -0.35). */
const MOOR_DEPTH = 0.6;
/** How far from the boat the player can board it (A's walkable mask stops well short of the waterline). */
const BOARD_RADIUS = 30;
/** How far from the boat dry land may be to step ashore. */
const ASHORE_RADIUS = 30;

export class BoatHook {
  readonly boat: Boat;
  private readonly g: Game;
  private readonly keys = new Set<string>();
  private readonly input: BoatInput = { throttle: 0, steer: 0, interact: false };
  private readonly playerPos = new Vector3();
  private readonly hAt: (x: number, z: number) => number;
  private readonly hull: (x: number, z: number) => number;
  private readonly wave: WaveHeightFn;
  private readonly prompt: HTMLDivElement;
  private placed = false;
  private searchT = 0;
  private interactQueued = false;
  private hint = "";
  private hintT = 0;
  private readonly spot = { x: 0, z: 0 };

  constructor(g: AGame) {
    this.g = g as Game;
    const real = g.real as unknown as { heightAt: (x: number, z: number) => number };
    this.hAt = (x, z) => real.heightAt(x, z);
    // the hull treats A's collision footprints (piers, the offshore limit) like land
    this.hull = (x, z) => (this.isBlocked(x, z) ? 10 : real.heightAt(x, z));
    this.wave = (x, z, t) => {
      const oc = (window.__aw as { ocean?: { waveHeight?: (x: number, z: number, t: number) => number } } | undefined)?.ocean;
      return SEA + oceanWave(oc, fallbackSwell)(x, z, t);
    };
    const q = (g.real as unknown as { q: { name: string } }).q.name;
    this.boat = new Boat({ quality: q === "low" ? "low" : q === "high" ? "high" : "medium", seaLevel: SEA, fxParent: g.scene });
    this.boat.group.visible = false;
    this.boat.group.name = "aw-boat";
    g.scene.add(this.boat.group);

    addEventListener("keydown", (e) => {
      this.keys.add(e.code);
      if (e.code === "KeyE" && !e.repeat && !(e.target instanceof HTMLInputElement)) this.interactQueued = true;
    });
    addEventListener("keyup", (e) => { this.keys.delete(e.code); });
    addEventListener("blur", () => { this.keys.clear(); });

    const el = document.createElement("div");
    el.id = "awBoatPrompt";
    el.style.cssText = "position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 96px);transform:translateX(-50%);z-index:30;" +
      "display:none;padding:8px 14px;border-radius:12px;background:#000000b0;color:#fff;font:700 14px system-ui,sans-serif;cursor:pointer;user-select:none";
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); this.interactQueued = true; });
    document.body.appendChild(el);
    this.prompt = el;

    // chase camera, applied after A has placed its camera and before the frame is drawn
    const scene = g.scene, prev = scene.onBeforeRender;
    scene.onBeforeRender = (...args: Parameters<typeof prev>) => {
      prev.apply(scene, args);
      const camera = args[2];
      if (camera !== this.g.camera || !this.boat.isOccupied) return;
      const S = this.g.S as unknown as Shared;
      if (S.dragging || (window as { __freeCam?: unknown }).__freeCam) return; // let the player look around
      const now = performance.now();
      const dt = this.camT ? Math.min(0.1, (now - this.camT) / 1000) : 0.016;
      this.camT = now;
      if (this.boat.updateChaseCamera(camera, dt)) camera.updateMatrixWorld();
    };
  }

  private camT = 0;

  frame(dtRaw: number): void {
    const dt = Math.min(dtRaw, 0.1);
    const S = this.g.S as unknown as Shared;
    const a = S.walk;
    const boat = this.boat;
    let interact = this.interactQueued;
    this.interactQueued = false;

    if (boat.isOccupied && S.mode !== "walk") this.leave(null); // switched to car/moto/plane from the boat

    if (!boat.isOccupied) {
      if (S.mode === "walk") {
        this.searchT -= dt;
        const far = !this.placed || Math.hypot(boat.position.x - a.x, boat.position.z - a.z) > 250;
        if (far && this.searchT <= 0) {
          this.searchT = 0.5;
          if (this.findWater(a.x, a.z)) {
            boat.place(this.spot.x, this.spot.z, Math.atan2(this.spot.x - a.x, this.spot.z - a.z));
            boat.group.visible = true;
            this.placed = true;
          }
        }
      }
      const near = this.placed && S.mode === "walk" && Math.hypot(boat.position.x - a.x, boat.position.z - a.z) < BOARD_RADIUS;
      if (near && interact) {
        this.board();
        interact = false; // one press boards; don't step straight back ashore below
      }
    }

    // drive
    const inp = this.input;
    if (boat.isOccupied) {
      const k = this.keys, held = this.g.held || {}, joy = this.g.joy || { x: 0, y: 0 };
      const kb = (c: string) => (k.has(c) ? 1 : 0);
      inp.throttle = Math.max(-1, Math.min(1, -joy.y + kb("KeyW") + kb("ArrowUp") - kb("KeyS") - kb("ArrowDown") + (held.gas ? 1 : 0) - (held.brake ? 1 : 0)));
      inp.steer = Math.max(-1, Math.min(1, joy.x + kb("KeyD") + kb("ArrowRight") - kb("KeyA") - kb("ArrowLeft") + (held.right ? 1 : 0) - (held.left ? 1 : 0)));
    } else {
      inp.throttle = 0;
      inp.steer = 0;
    }
    inp.interact = false; // enter/exit is edge-triggered here; the Boat's own toggle fires every held frame
    this.playerPos.set(a.x, a.y, a.z);
    boat.setPlayerPosition(this.playerPos);
    if (this.placed) boat.update(dt, inp, this.wave, this.hull);

    if (boat.isOccupied) {
      // ride along: A's walk camera chases S.walk, the walker itself stays hidden
      const p = boat.position;
      a.x = p.x; a.z = p.z;
      a.y = p.y + 0.35; a.g = a.y; a.vy = 0;
      if (!S.dragging) {
        let d = boat.yaw + Math.PI - S.camYaw;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        S.camYaw += d * Math.min(1, dt * 2.5);
      }
      if (interact) this.goAshore();
    }

    // prompt
    this.hintT -= dt;
    let text = "";
    if (this.hintT > 0) text = this.hint;
    else if (boat.isOccupied) text = "E: step ashore · W/S throttle · A/D rudder";
    else if (this.placed && S.mode === "walk" && Math.hypot(boat.position.x - a.x, boat.position.z - a.z) < BOARD_RADIUS) text = "⛵ E: take the boat";
    if (this.prompt.textContent !== text) this.prompt.textContent = text;
    const show = text ? "block" : "none";
    if (this.prompt.style.display !== show) this.prompt.style.display = show;
  }

  private board(): void {
    this.boat.enter();
    const w = this.g.walker;
    if (w) w.visible = false;
  }

  private goAshore(): void {
    const p = this.boat.position;
    if (!this.findLand(p.x, p.z)) {
      this.hint = "Get closer to a beach to step ashore";
      this.hintT = 2;
      return;
    }
    this.leave(this.spot);
  }

  private leave(at: { x: number; z: number } | null): void {
    this.boat.exit();
    const w = this.g.walker;
    if (w) w.visible = true;
    if (at) {
      const a = (this.g.S as unknown as Shared).walk;
      a.x = at.x; a.z = at.z; a.vy = 0; a.snap = true;
      const h = this.hAt(at.x, at.z);
      a.y = h; a.g = h;
    }
  }

  /** Nearest mooring spot (deep enough, not under a pier) within 26 m of a point on the coast. */
  private findWater(x: number, z: number): boolean {
    for (let r = 4; r <= 26; r += 2) {
      for (let i = 0; i < 16; i++) {
        const t = (i / 16) * Math.PI * 2;
        const px = x + Math.cos(t) * r, pz = z + Math.sin(t) * r;
        if (SEA - this.hAt(px, pz) >= MOOR_DEPTH && !this.isBlocked(px, pz)) {
          this.spot.x = px; this.spot.z = pz;
          return true;
        }
      }
    }
    return false;
  }

  /** Nearest walkable dry ground (inside A's mask, not in a building) within reach of the boat. */
  private findLand(x: number, z: number): boolean {
    const onLand = this.g.onLand;
    for (let r = 2; r <= ASHORE_RADIUS; r += 2) {
      for (let i = 0; i < 16; i++) {
        const t = (i / 16) * Math.PI * 2;
        const px = x + Math.cos(t) * r, pz = z + Math.sin(t) * r;
        if ((typeof onLand !== "function" || onLand(px, pz)) && this.hAt(px, pz) > SEA + 0.05 && !this.isBlocked(px, pz)) {
          this.spot.x = px; this.spot.z = pz;
          return true;
        }
      }
    }
    return false;
  }

  private isBlocked(x: number, z: number): boolean {
    return typeof this.g.blocked === "function" ? this.g.blocked(x, z) : false;
  }
}
