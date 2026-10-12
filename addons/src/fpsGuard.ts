// Auto FPS guard (neither A nor B had one; B relied on low tier defaults).
// Watches real frame times and steps quality down — cheapest-to-lose first —
// until the frame rate holds, then slowly steps back up when there is headroom.
//   level 0  A's tier as configured
//   1..4     render scale 0.9 / 0.8 / 0.7 / 0.6 of the tier's pixel ratio
//   5        shadows refresh at ~8 Hz instead of every frame (no recompile)
//   6        post-processing off (A's own window.__noPost switch)
// Off with ?fpsguard=0. Target fps with ?fps=30|45|50|55 (default 50; 30 on LOW).
import type { AGame } from "./env";
import { params } from "./env";

const SCALES = [1, 0.9, 0.8, 0.7, 0.6];
const MAX_LEVEL = 6;

export class FpsGuard {
  g: AGame;
  enabled: boolean;
  target: number;
  level = 0;
  maxLevel = MAX_LEVEL;
  fps = 60;
  private basePR: number;
  private acc = 0;
  private frames = 0;
  private lowFor = 0;
  private highFor = 0;
  private holdUp = 0;
  private warm = 4; // ignore the first seconds (shader compile, tile streaming)
  private shadowTick = 0;
  private stalls = 0;
  private upAt = -1e9; private bounces = 0; private floorUntil = 0; private t = 0;
  private listeners: Array<() => void> = [];

  constructor(g: AGame) {
    this.g = g;
    this.basePR = g.renderer.getPixelRatio();
    this.enabled = params.get("fpsguard") !== "0" && localStorage.getItem("aw_fpsguard") !== "0";
    const tier = g.real?.q?.name;
    const qf = +(params.get("fps") || 0);
    const desk = !(matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    const big = tier === "high"; // HIGH and Desktop Quality (desktop shares name "high")
    // laptops/desktops on HIGH/Desktop: dynamic resolution only (levels 1-4 = 90..60% render scale),
    // aimed at a steady 60 Hz; never lazy shadows / post off there (those read as popping, not smoothness)
    this.target = qf > 10 ? qf : tier === "low" ? 30 : desk && big ? 57 : 50;
    this.maxLevel = desk && big ? 4 : MAX_LEVEL;
    document.addEventListener("visibilitychange", () => { this.warm = 2; this.acc = 0; this.frames = 0; });
  }

  onChange(f: () => void) { this.listeners.push(f); }

  setEnabled(on: boolean) {
    this.enabled = on;
    try { localStorage.setItem("aw_fpsguard", on ? "1" : "0"); } catch { /* ignore */ }
    if (!on) this.setLevel(0);
    this.listeners.forEach((f) => f());
  }

  private setLevel(l: number) {
    l = Math.max(0, Math.min(this.maxLevel, l));
    if (l === this.level) return;
    const g = this.g;
    const scale = SCALES[Math.min(l, SCALES.length - 1)];
    const cap = (window as unknown as { __awPRCap?: number }).__awPRCap || Infinity;
    const pr = Math.max(0.5, Math.min(this.basePR, cap) * scale);
    if (Math.abs(g.renderer.getPixelRatio() - pr) > 1e-3) {
      g.renderer.setPixelRatio(pr);
      window.dispatchEvent(new Event("resize")); // A's resize handler resizes the renderer + composer
    }
    g.renderer.shadowMap.autoUpdate = l < 5;
    if (l < 5) g.renderer.shadowMap.needsUpdate = true;
    window.__noPost = l >= 6;
    this.level = l;
    this.listeners.forEach((f) => f());
  }

  /** Call once per animation frame with the real frame delta (seconds). */
  frame(dt: number) {
    const r = this.g.renderer;
    if (this.level >= 5 && ++this.shadowTick % 7 === 0) r.shadowMap.needsUpdate = true;
    if (!this.enabled || document.hidden) return;
    this.t += Math.min(dt, 1);
    // one long frame = tab switch / load stall (ignore); several in a row = the device is just that slow
    if (dt > 1.5 && ++this.stalls < 3) { this.warm = Math.max(this.warm, 1); return; }
    if (dt <= 1.5) this.stalls = 0;
    if (this.warm > 0) { this.warm -= Math.max(0, dt); return; }
    this.acc += dt;
    this.frames++;
    if (this.acc < 0.5) return;
    this.fps = this.frames / this.acc;
    const span = this.acc;
    this.acc = 0;
    this.frames = 0;
    this.holdUp = Math.max(0, this.holdUp - span);
    if (this.fps < this.target - 2) { this.lowFor += span; this.highFor = 0; }
    else if (this.fps > Math.min(this.target + 8, 58)) { this.highFor += span; this.lowFor = 0; }
    else { this.lowFor = 0; this.highFor = 0; }
    if (this.lowFor >= 1.5 && this.level < this.maxLevel) {
      // anti-flap: dropping again soon after stepping up means the higher level does not hold;
      // every resize reallocates the composer targets (a hitch), so stop probing for 10 min
      if (this.t - this.upAt < 25 && ++this.bounces >= 2) this.floorUntil = this.t + 600;
      this.setLevel(this.level + 1);
      this.lowFor = 0;
      this.warm = 1; // let the new setting settle
      this.holdUp = 15;
    } else if (this.highFor >= 6 && this.level > 0 && this.holdUp <= 0 && this.t > this.floorUntil) {
      this.setLevel(this.level - 1);
      this.upAt = this.t;
      this.highFor = 0;
      this.warm = 1;
      this.holdUp = 8;
    }
  }

  describe(): string {
    if (!this.enabled) return "off";
    const s = SCALES[Math.min(this.level, SCALES.length - 1)];
    const extra = this.level >= 6 ? " · post off" : this.level >= 5 ? " · lazy shadows" : "";
    return `${Math.round(this.fps)} fps · target ${this.target} · scale ${Math.round(s * 100)}%${extra}`;
  }
}
