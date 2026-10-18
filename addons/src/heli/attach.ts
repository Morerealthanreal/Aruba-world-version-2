// Glue between the SuperGrok Helicopter (TASK 11) and A's game. Off unless ?heli=1.
// On foot, a small helicopter is parked on the nearest open, flat patch of dry ground (re-parked near you
// whenever you walk more than 300 m away from it). Walk up and press H (or tap the prompt) to climb in.
// Controls: Space climb, Shift or Z descend, nothing held = hold altitude; W/S cyclic forward/back,
// A/D cyclic left/right, Q/E (or Left/Right arrows) tail-rotor yaw, X (held) cuts the engine (autorotation),
// H on the ground to climb out. Phone: gas = climb, brake = descend, joystick = cyclic, left/right buttons = yaw.
// The collective is an altitude-hold loop around the model's own collective: neutral feeds the hover collective
// (corrected for ground effect and rotor speed) plus a vertical-speed term, so the raw SuperGrok physics run
// untouched underneath. While aboard, the on-foot player rides along hidden (S.walk follows the heli) and the
// Helicopter's chase camera is applied in the scene's onBeforeRender (A re-places its camera every frame).
// No per-frame allocation.
import { Vector3, type Object3D } from "three";
import type { AGame } from "../env";
import { Helicopter, MASS, MAX_LIFT, GROUND_EFFECT_HEIGHT, REST_HEIGHT } from "./Helicopter";
import type { HeliInput, TerrainHeightFn } from "./types";

type WalkState = { x: number; z: number; y: number; vy: number; g: number; face: number; snap?: boolean };
type Shared = { mode: string; walk: WalkState; camYaw: number; dragging?: boolean };
type Game = AGame & {
  walker?: Object3D;
  held?: Record<string, boolean>;
  joy?: { x: number; y: number };
  onLand?: (x: number, z: number) => boolean;
  blocked?: (x: number, z: number) => boolean;
};

const SEA = 0;
/** How close (m) the player has to be to climb in. */
const BOARD_RADIUS = 9;
/** Re-park the heli near the player once they are this far (m) from it. */
const REPARK_DIST = 300;
/** Climb / descent rates (m/s) the altitude-hold loop aims for. */
const CLIMB = 6;
const DESCEND = -3.5;
/** Collective per m/s of vertical-speed error. */
const VS_GAIN = 0.1;

export class HeliHook {
  readonly heli: Helicopter;
  private readonly g: Game;
  private readonly keys = new Set<string>();
  private readonly input: HeliInput = { collective: 0, cyclicPitch: 0, cyclicRoll: 0, yaw: 0, engine: true };
  private readonly hAt: (x: number, z: number) => number;
  private readonly terrain: TerrainHeightFn;
  private readonly prompt: HTMLDivElement;
  private readonly camPos = new Vector3();
  private placed = false;
  private searchT = 0;
  private interactQueued = false;
  private hint = "";
  private hintT = 0;
  private camT = 0;
  private readonly spot = { x: 0, z: 0, y: 0 };
  /** Exposed for tests / debugging (window.__aw.heli.stats). */
  readonly stats = { occupied: false, y: 0, agl: 0, vy: 0, onGround: true, collective: 0 };

  constructor(g: AGame) {
    this.g = g as Game;
    const real = g.real as unknown as { heightAt: (x: number, z: number) => number };
    this.hAt = (x, z) => real.heightAt(x, z);
    this.terrain = (x, z) => Math.max(SEA, real.heightAt(x, z)); // the sea surface is a floor too
    const q = (g.real as unknown as { q: { name: string } }).q.name;
    this.heli = new Helicopter({ quality: q === "low" ? "low" : q === "high" ? "high" : "medium", fxParent: g.scene });
    this.heli.group.visible = false;
    this.heli.group.name = "aw-heli";
    g.scene.add(this.heli.group);

    addEventListener("keydown", (e) => {
      if (e.target instanceof HTMLInputElement) return;
      this.keys.add(e.code);
      if (e.code === "KeyH" && !e.repeat) this.interactQueued = true;
      // keep Space from scrolling / the walker from jumping while flying
      if (this.heli.isOccupied && e.code === "Space") e.preventDefault();
    });
    addEventListener("keyup", (e) => { this.keys.delete(e.code); });
    addEventListener("blur", () => { this.keys.clear(); });

    const el = document.createElement("div");
    el.id = "awHeliPrompt";
    el.style.cssText = "position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 136px);transform:translateX(-50%);z-index:30;" +
      "display:none;padding:8px 14px;border-radius:12px;background:#000000b0;color:#fff;font:700 14px system-ui,sans-serif;cursor:pointer;user-select:none;text-align:center";
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); this.interactQueued = true; });
    document.body.appendChild(el);
    this.prompt = el;

    // chase camera, applied after A has placed its camera and before the frame is drawn. The Helicopter's
    // camera lerps from the camera's current position, so feed it our own smoothed position each frame.
    const scene = g.scene, prev = scene.onBeforeRender;
    scene.onBeforeRender = (...args: Parameters<typeof prev>) => {
      prev.apply(scene, args);
      const camera = args[2];
      if (camera !== this.g.camera || !this.heli.isOccupied) return;
      const S = this.g.S as unknown as Shared;
      if (S.dragging || (window as { __freeCam?: unknown }).__freeCam) { this.camPos.copy(camera.position); return; }
      const now = performance.now();
      const dt = this.camT ? Math.min(0.1, (now - this.camT) / 1000) : 0.016;
      this.camT = now;
      camera.position.copy(this.camPos);
      this.heli.updateChaseCamera(camera, dt);
      this.camPos.copy(camera.position);
      camera.updateMatrixWorld();
    };
  }

  frame(dtRaw: number): void {
    const dt = Math.min(dtRaw, 0.1);
    if (dt <= 0) return;
    const S = this.g.S as unknown as Shared;
    const a = S.walk;
    const heli = this.heli;
    let interact = this.interactQueued;
    this.interactQueued = false;

    if (heli.isOccupied && S.mode !== "walk") this.leave(false); // switched to car/moto/plane mid-flight

    if (!heli.isOccupied) {
      if (S.mode === "walk") {
        this.searchT -= dt;
        const far = !this.placed || Math.hypot(heli.position.x - a.x, heli.position.z - a.z) > REPARK_DIST;
        if (far && this.searchT <= 0) {
          this.searchT = 0.5;
          if (this.findPad(a.x, a.z)) this.park();
        }
      }
      if (this.placed && S.mode === "walk" && interact && this.near(a)) {
        this.board();
        interact = false; // one press boards; don't climb straight back out below
      }
    }

    const inp = this.input;
    if (heli.isOccupied) {
      const k = this.keys, held = this.g.held || {}, joy = this.g.joy || { x: 0, y: 0 };
      const kb = (c: string) => (k.has(c) ? 1 : 0);
      const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));
      const up = kb("Space") || held.gas ? 1 : 0;
      const down = kb("ShiftLeft") || kb("ShiftRight") || kb("KeyZ") || held.brake ? 1 : 0;
      inp.cyclicPitch = clamp1(joy.y + kb("KeyS") + kb("ArrowDown") - kb("KeyW") - kb("ArrowUp"));
      inp.cyclicRoll = clamp1(joy.x + kb("KeyD") - kb("KeyA"));
      inp.yaw = clamp1(kb("KeyE") + kb("ArrowRight") - kb("KeyQ") - kb("ArrowLeft") + (held.right ? 1 : 0) - (held.left ? 1 : 0));
      inp.engine = !k.has("KeyX");
      // altitude hold: hover collective for this height/rotor speed + a vertical-speed correction
      const agl = heli.heightAboveGround;
      const ge = agl < GROUND_EFFECT_HEIGHT && agl > 0.5 ? 1 + (1 - agl / GROUND_EFFECT_HEIGHT) * 0.45 : 1;
      const hover = (MASS * 9.81) / (MAX_LIFT * Math.max(0.3, heli.rotorSpeed) * ge);
      const target = up ? CLIMB : down ? DESCEND : 0;
      if (heli.isOnGround && !up) inp.collective = 0; // parked: rotor idling, stays down
      else inp.collective = Math.max(0, Math.min(1, hover + VS_GAIN * (target - heli.verticalSpeed)));
    } else {
      inp.collective = 0; inp.cyclicPitch = 0; inp.cyclicRoll = 0; inp.yaw = 0; inp.engine = false;
    }
    if (this.placed) heli.update(dt, inp, this.terrain);

    if (heli.isOccupied) {
      // ride along: the walker stays hidden at the heli so A streams the world around it
      const p = heli.position;
      a.x = p.x; a.z = p.z;
      a.y = p.y; a.g = a.y; a.vy = 0;
      if (!S.dragging) {
        let d = heli.group.rotation.y + Math.PI - S.camYaw;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        S.camYaw += d * Math.min(1, dt * 2.5);
      }
      if (interact) {
        if (heli.isOnGround && heli.heightAboveGround < REST_HEIGHT + 0.3) this.leave(true);
        else { this.hint = "Land first (hold Shift or Z to descend)"; this.hintT = 2; }
      }
    }

    const st = this.stats;
    st.occupied = heli.isOccupied; st.y = heli.position.y; st.agl = heli.heightAboveGround;
    st.vy = heli.verticalSpeed; st.onGround = heli.isOnGround; st.collective = inp.collective;

    this.hintT -= dt;
    let text = "";
    if (this.hintT > 0) text = this.hint;
    else if (heli.isOccupied) text = heli.isOnGround
      ? "H: climb out · Space: take off"
      : "Space up · Shift/Z down · W/S/A/D cyclic · Q/E yaw · X engine";
    else if (this.placed && S.mode === "walk" && this.near(a)) text = "🚁 H: fly the helicopter";
    if (this.prompt.textContent !== text) this.prompt.textContent = text;
    const show = text ? "block" : "none";
    if (this.prompt.style.display !== show) this.prompt.style.display = show;
  }

  private near(a: WalkState): boolean {
    const p = this.heli.position;
    return Math.hypot(p.x - a.x, p.z - a.z) < BOARD_RADIUS;
  }

  private park(): void {
    const grp = this.heli.group;
    grp.position.set(this.spot.x, this.spot.y + REST_HEIGHT, this.spot.z);
    grp.rotation.set(0, Math.random() * Math.PI * 2, 0);
    grp.visible = true;
    this.placed = true;
  }

  private board(): void {
    this.heli.enter();
    const w = this.g.walker;
    if (w) w.visible = false;
    this.camPos.copy(this.g.camera.position);
    this.camT = 0;
  }

  /** Climb out beside the cabin (onGround) or, on a mode switch, just let go (the heli settles on its own). */
  private leave(beside: boolean): void {
    this.heli.exit();
    const w = this.g.walker;
    if (w) w.visible = true;
    if (beside) {
      const a = (this.g.S as unknown as Shared).walk;
      const p = this.heli.position, h = this.heli.group.rotation.y;
      // pilot's door is on the right (-X in the heli frame)
      const x = p.x - Math.cos(h) * 2.2, z = p.z + Math.sin(h) * 2.2;
      a.x = x; a.z = z; a.vy = 0; a.snap = true;
      const gy = this.hAt(x, z);
      a.y = gy; a.g = gy;
    }
  }

  /** Nearest open, flat, dry spot (inside A's walkable mask, nothing built within 5 m) 10-40 m from a point. */
  private findPad(x: number, z: number): boolean {
    for (let r = 10; r <= 40; r += 3) {
      for (let i = 0; i < 16; i++) {
        const t = (i / 16) * Math.PI * 2;
        const px = x + Math.cos(t) * r, pz = z + Math.sin(t) * r;
        if (this.padOk(px, pz)) {
          this.spot.x = px; this.spot.z = pz; this.spot.y = this.hAt(px, pz);
          return true;
        }
      }
    }
    return false;
  }

  private padOk(x: number, z: number): boolean {
    const onLand = this.g.onLand, blocked = this.g.blocked;
    const h0 = this.hAt(x, z);
    if (!(h0 > SEA + 0.3)) return false;
    if (typeof onLand === "function" && !onLand(x, z)) return false;
    if (typeof blocked === "function" && blocked(x, z)) return false;
    for (let i = 0; i < 8; i++) {
      const t = (i / 8) * Math.PI * 2;
      const px = x + Math.cos(t) * 5, pz = z + Math.sin(t) * 5;
      if (Math.abs(this.hAt(px, pz) - h0) > 0.6) return false;
      if (typeof blocked === "function" && blocked(px, pz)) return false;
    }
    return true;
  }
}
