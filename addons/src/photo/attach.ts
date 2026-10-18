// Photo mode. Off unless ?photo=1. P pauses the sim (via the callback index passes in),
// hides the HUD, and flies the camera. Exposure, a focus/aperture pair, and a filter
// are live. Enter saves a PNG. Pointer drag looks around, so it works on touch.
import type { AGame } from "../env";
import { FILTERS, PhotoRig } from "./rig";

type PauseFn = (paused: boolean) => void;

const KEEP = new Set(["c", "loading", "awPhoto"]);

const FILTER_CSS: Record<(typeof FILTERS)[number], string> = {
  none: "",
  vivid: "saturate(1.4) contrast(1.08)",
  mono: "grayscale(1) contrast(1.12)",
  warm: "sepia(0.4) saturate(1.25) contrast(1.04)",
  cool: "saturate(0.9) hue-rotate(18deg) contrast(1.04)",
};

export class PhotoHook {
  readonly rig = new PhotoRig();
  private readonly g: AGame;
  private readonly setPaused: PauseFn;
  private readonly keys = new Set<string>();
  private readonly panel: HTMLDivElement;
  private active = false;
  private lookX = 0;
  private lookY = 0;
  private dragging = false;
  private savedExposure = 1;
  private savedFilter = "";
  private readonly hidden: HTMLElement[] = [];

  constructor(g: AGame, setPaused: PauseFn) {
    this.g = g;
    this.setPaused = setPaused;
    addEventListener("keydown", (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      this.keys.add(e.code);
      if (e.code === "KeyP" && !e.repeat) this.toggle();
      if (!this.active) return;
      if (e.code === "Enter") this.savePng();
      if (e.code === "BracketRight") this.rig.setExposure(this.rig.exposure + 0.1);
      if (e.code === "BracketLeft") this.rig.setExposure(this.rig.exposure - 0.1);
      if (e.code === "Period") this.rig.setFocus(this.rig.focus + 1);
      if (e.code === "Comma") this.rig.setFocus(this.rig.focus - 1);
      if (e.code === "KeyF" && !e.repeat) this.rig.cycleFilter(1);
      e.preventDefault();
    });
    addEventListener("keyup", (e) => { this.keys.delete(e.code); });
    addEventListener("blur", () => { this.keys.clear(); this.dragging = false; });
    addEventListener("pointerdown", (e) => { if (this.active) { this.dragging = true; this.lookX = e.clientX; this.lookY = e.clientY; } });
    addEventListener("pointerup", () => { this.dragging = false; });
    addEventListener("pointermove", (e) => {
      if (!this.active || !this.dragging) return;
      const dx = e.clientX - this.lookX;
      const dy = e.clientY - this.lookY;
      this.lookX = e.clientX;
      this.lookY = e.clientY;
      this.rig.move(0, 0, 0, -dx * 0.005, -dy * 0.004, 1);
    });

    const el = document.createElement("div");
    el.id = "awPhoto";
    el.style.cssText = "display:none;position:fixed;left:12px;bottom:12px;z-index:40;padding:10px 12px;border-radius:12px;" +
      "background:#000000c0;color:#fff;font:600 13px system-ui,sans-serif;line-height:1.45;max-width:280px;white-space:pre-wrap";
    const save = document.createElement("button");
    save.textContent = "Save PNG";
    save.style.cssText = "margin-top:6px;padding:6px 10px;border:0;border-radius:8px;background:#fff;color:#111;font:700 13px system-ui";
    save.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); this.savePng(); });
    el.appendChild(document.createElement("div"));
    el.appendChild(save);
    document.body.appendChild(el);
    this.panel = el;

    const scene = g.scene;
    const prev = scene.onBeforeRender;
    scene.onBeforeRender = (...args: Parameters<typeof prev>) => {
      prev.apply(scene, args);
      if (!this.active || args[2] !== g.camera) return;
      const cam = g.camera;
      cam.position.set(this.rig.x, this.rig.y, this.rig.z);
      cam.rotation.order = "YXZ";
      cam.rotation.set(-this.rig.pitch, this.rig.yaw, 0);
      cam.updateMatrixWorld();
      // Applied here so a game pass that resets exposure earlier in the frame cannot win.
      g.renderer.toneMappingExposure = this.rig.exposure;
      g.renderer.domElement.style.filter = FILTER_CSS[FILTERS[this.rig.filter]];
    };
  }

  get isActive(): boolean { return this.active; }

  toggle(): void {
    this.active ? this.exit() : this.enter();
  }

  private enter(): void {
    const cam = this.g.camera;
    this.rig.x = cam.position.x;
    this.rig.y = cam.position.y;
    this.rig.z = cam.position.z;
    const e = cam.matrixWorld.elements;
    this.rig.yaw = Math.atan2(e[8], e[10]);
    this.rig.pitch = Math.asin(Math.max(-1, Math.min(1, -e[9])));
    this.savedExposure = this.g.renderer.toneMappingExposure;
    this.rig.exposure = this.savedExposure || 1;
    const canvas = this.g.renderer.domElement;
    this.savedFilter = canvas.style.filter;
    this.active = true;
    this.setPaused(true);
    for (const node of Array.from(document.body.children)) {
      if (!(node instanceof HTMLElement)) continue;
      if (KEEP.has(node.id) || node === this.panel || node.tagName === "SCRIPT" || node.tagName === "CANVAS") continue;
      this.hidden.push(node);
      node.dataset.awPhotoDisplay = node.style.display;
      node.style.display = "none";
    }
    const walker = (this.g as AGame & { walker?: { visible: boolean } }).walker;
    if (walker) walker.visible = false;
    this.panel.style.display = "block";
  }

  private exit(): void {
    this.active = false;
    this.setPaused(false);
    this.g.renderer.toneMappingExposure = this.savedExposure;
    this.g.renderer.domElement.style.filter = this.savedFilter;
    for (const node of this.hidden) {
      node.style.display = node.dataset.awPhotoDisplay || "";
      delete node.dataset.awPhotoDisplay;
    }
    this.hidden.length = 0;
    const walker = (this.g as AGame & { walker?: { visible: boolean } }).walker;
    if (walker) walker.visible = true;
    this.panel.style.display = "none";
  }

  frame(dt: number): void {
    if (!this.active) return;
    const k = this.keys;
    const down = (c: string) => (k.has(c) ? 1 : 0);
    const joy = (this.g as AGame & { joy?: { x: number; y: number } }).joy;
    const forward = down("KeyW") + down("ArrowUp") - down("KeyS") - down("ArrowDown") - (joy?.y || 0);
    const strafe = down("KeyD") + down("ArrowRight") - down("KeyA") - down("ArrowLeft") + (joy?.x || 0);
    // F cycles the filter on keydown. C descends, R/E/Space rise, Q drops.
    const rise = down("KeyR") + down("KeyE") + down("Space") - down("KeyQ") - down("KeyC");
    this.rig.move(Math.max(-1, Math.min(1, forward)), Math.max(-1, Math.min(1, strafe)), Math.max(-1, Math.min(1, rise)), 0, 0, dt);
    this.g.renderer.toneMappingExposure = this.rig.exposure;
    const name = FILTERS[this.rig.filter];
    this.g.renderer.domElement.style.filter = FILTER_CSS[name];
    const label = this.panel.firstChild as HTMLDivElement;
    const text = `Photo · P closes\nexposure ${this.rig.exposure.toFixed(2)} · focus ${this.rig.focus.toFixed(0)} m · ${name}`;
    if (label.textContent !== text) label.textContent = text;
    const walk = (this.g.S as unknown as { walk: { x: number; z: number; y: number; vy?: number } }).walk;
    walk.x = this.rig.x;
    walk.z = this.rig.z;
    walk.y = this.rig.y;
    if (walk.vy !== undefined) walk.vy = 0;
  }

  private savePng(): void {
    if (!this.active) return;
    const canvas = this.g.renderer.domElement;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "aruba-photo.png";
    a.click();
  }
}
