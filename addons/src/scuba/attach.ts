// Scuba. Off unless ?scuba=1. Press C at the water's edge to drop under.
// Buoyancy and an air gauge, blue fog, a caustic sheet on the surface, and a
// pooled school of reef fish (fewer on Low). H again... C climbs out near the surface.
import { AdditiveBlending, CanvasTexture, DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, RepeatWrapping, type FogExp2 } from "three";
import type { AGame } from "../env";
import { createSchool, stepSchool, type School } from "./boids";
import { AIR_SECONDS, createDive, stepDive, SWIM_SPEED, type DiveState } from "./dive";
import { fishCount, ReefFish } from "./fish";

type Walk = { x: number; z: number; y: number; vy: number; g: number };

export class ScubaHook {
  private readonly g: AGame;
  private readonly keys = new Set<string>();
  private readonly school: School;
  private readonly fish: ReefFish;
  private readonly caustic: Mesh;
  private readonly gauge: HTMLDivElement;
  private readonly dive: DiveState = createDive(-2);
  private diving = false;
  private queued = false;
  private fogColor = 0;
  private fogDensity = 0;
  private fogSaved = false;

  constructor(g: AGame) {
    this.g = g;
    this.dive.diving = false;
    const q = g.real?.q?.name ?? "medium";
    this.school = createSchool(fishCount(q), 0, -3.2, 0, 12);
    this.fish = new ReefFish(this.school);
    this.fish.mesh.visible = false;
    g.scene.add(this.fish.mesh);

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = "#9fe7ff";
      ctx.lineWidth = 2;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        for (let x = 0; x <= 128; x += 8) {
          const y = 14 + i * 12 + Math.sin(x * 0.08 + i) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    const tex = new CanvasTexture(canvas);
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    const mat = new MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.45, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
    this.caustic = new Mesh(new PlaneGeometry(36, 36), mat);
    this.caustic.rotation.x = -Math.PI / 2;
    this.caustic.visible = false;
    this.caustic.position.y = -0.15;
    g.scene.add(this.caustic);

    const el = document.createElement("div");
    el.id = "awScuba";
    el.style.cssText = "display:none;position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom) + 120px);transform:translateX(-50%);" +
      "z-index:30;padding:8px 14px;border-radius:12px;background:#042c3acc;color:#d7f6ff;font:700 14px system-ui,sans-serif;text-align:center";
    document.body.appendChild(el);
    this.gauge = el;

    addEventListener("keydown", (e) => {
      if (e.target instanceof HTMLInputElement) return;
      this.keys.add(e.code);
      if (e.code === "KeyC" && !e.repeat) this.queued = true;
    });
    addEventListener("keyup", (e) => { this.keys.delete(e.code); });
    addEventListener("blur", () => this.keys.clear());
    this.gauge.addEventListener("pointerdown", (e) => { e.preventDefault(); this.queued = true; });

    // The game snaps the walker back onto the terrain every frame. Put the camera
    // under the surface after that, so the dive is what gets drawn.
    const scene = g.scene;
    const prev = scene.onBeforeRender;
    scene.onBeforeRender = (...args: Parameters<typeof prev>) => {
      prev.apply(scene, args);
      if (!this.diving || args[2] !== g.camera) return;
      g.camera.position.y = this.dive.y + 0.35;
    };
  }

  get isDiving(): boolean { return this.diving; }

  frame(dtRaw: number): void {
    const dt = Math.min(dtRaw, 0.1);
    if (dt <= 0) return;
    const walk = (this.g.S as unknown as { walk: Walk; camYaw: number; mode: string }).walk;
    const mode = (this.g.S as unknown as { mode: string }).mode;
    const press = this.queued;
    this.queued = false;
    if (!this.diving) {
      if (press && mode === "walk" && this.nearWater(walk.x, walk.z)) this.enter(walk);
      else if (this.gauge.style.display !== "none" && !this.diving) {
        this.gauge.style.display = "none";
      }
      return;
    }
    if (mode !== "walk") { this.exit(walk); return; }

    const held = (this.g as AGame & { held?: Record<string, boolean> }).held || {};
    const joy = (this.g as AGame & { joy?: { x: number; y: number } }).joy || { x: 0, y: 0 };
    const k = this.keys;
    const up = k.has("Space") || held.gas ? 1 : 0;
    const down = k.has("ShiftLeft") || k.has("ShiftRight") ? 1 : 0;
    stepDive(this.dive, dt, up, down);
    const yaw = (this.g.S as unknown as { camYaw: number }).camYaw || this.g.camera.rotation.y;
    const forward = (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) - (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0) - joy.y;
    const strafe = (k.has("KeyD") ? 1 : 0) - (k.has("KeyA") ? 1 : 0) + joy.x;
    const f = Math.max(-1, Math.min(1, forward));
    const r = Math.max(-1, Math.min(1, strafe));
    walk.x += (-Math.sin(yaw) * f + Math.cos(yaw) * r) * SWIM_SPEED * dt;
    walk.z += (-Math.cos(yaw) * f - Math.sin(yaw) * r) * SWIM_SPEED * dt;
    walk.y = this.dive.y;
    walk.g = this.dive.y;
    walk.vy = 0;

    stepSchool(this.school, dt);
    this.fish.update();
    this.caustic.position.x = walk.x;
    this.caustic.position.z = walk.z;
    const mat = this.caustic.material as MeshBasicMaterial;
    if (mat.map) mat.map.offset.y = (mat.map.offset.y + dt * 0.05) % 1;

    if (press && this.dive.y > -1.4) this.exit(walk);
    const depth = Math.max(0, -this.dive.y);
    const text = `Scuba · air ${Math.ceil(this.dive.air)}s · ${depth.toFixed(1)} m · C surface`;
    if (this.gauge.textContent !== text) this.gauge.textContent = text;
  }

  private nearWater(x: number, z: number): boolean {
    const real = this.g.real as unknown as { heightAt?: (x: number, z: number) => number } | null;
    const h = real?.heightAt?.(x, z);
    return typeof h === "number" && h < 0.45;
  }

  private enter(walk: Walk): void {
    this.diving = true;
    this.dive.diving = true;
    this.dive.y = Math.min(-1.6, walk.y - 1.6);
    this.dive.vy = 0;
    this.dive.air = AIR_SECONDS;
    walk.y = this.dive.y;
    walk.vy = 0;
    const ahead = (this.g.S as unknown as { camYaw: number }).camYaw || 0;
    this.school.ax = walk.x - Math.sin(ahead) * 6;
    this.school.ay = -1.8;
    this.school.az = walk.z - Math.cos(ahead) * 6;
    for (let i = 0; i < this.school.n; i++) {
      const a = (i / this.school.n) * Math.PI * 2;
      this.school.x[i] = this.school.ax + Math.cos(a) * 3.5;
      this.school.y[i] = -1.5 - (i % 4) * 0.28;
      this.school.z[i] = this.school.az + Math.sin(a) * 3.5;
    }
    this.fish.mesh.visible = true;
    this.caustic.visible = true;
    this.gauge.style.display = "block";
    const walker = (this.g as AGame & { walker?: { visible: boolean } }).walker;
    if (walker) walker.visible = false;
    const fog = this.g.scene.fog as FogExp2 | null;
    if (fog && typeof fog.density === "number") {
      this.fogColor = fog.color.getHex();
      this.fogDensity = fog.density;
      this.fogSaved = true;
      fog.color.set(0x0b6a86);
      fog.density = Math.max(fog.density, 0.04);
    }
  }

  private exit(walk: Walk): void {
    this.diving = false;
    this.dive.diving = false;
    walk.y = 0.2;
    walk.vy = 0;
    this.fish.mesh.visible = false;
    this.caustic.visible = false;
    this.gauge.style.display = "none";
    const walker = (this.g as AGame & { walker?: { visible: boolean } }).walker;
    if (walker) walker.visible = true;
    const fog = this.g.scene.fog as FogExp2 | null;
    if (this.fogSaved && fog) {
      fog.color.setHex(this.fogColor);
      fog.density = this.fogDensity;
      this.fogSaved = false;
    }
  }
}
