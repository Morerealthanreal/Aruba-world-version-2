import { RoadGraph, type RoadPolyline } from "./graph";
import { MinHeap } from "./heap";
import type { MapData, MapPOI } from "../minimap";
import type { AGame } from "../env";

/** Arrow relative to the way the player is facing. Heading 0 looks toward -Z. Positive is a right turn. */
export function turnArrow(heading: number, dx: number, dz: number): "↑" | "→" | "←" {
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) return "↑";
  const fx = -Math.sin(heading), fz = -Math.cos(heading);
  const rx = Math.cos(heading), rz = -Math.sin(heading);
  const ang = Math.atan2((dx * rx + dz * rz) / len, (dx * fx + dz * fz) / len);
  if (Math.abs(ang) < 0.4) return "↑";
  return ang > 0 ? "→" : "←";
}

/** Inverse of the minimap's translate-then-rotate(h). sx, sy are canvas pixels from the centre. */
export function minimapToWorld(px: number, pz: number, heading: number, sx: number, sy: number, ppm: number): { x: number; z: number } {
  const c = Math.cos(heading), s = Math.sin(heading);
  const x = sx * c + sy * s;
  const y = -sx * s + sy * c;
  return { x: px + x / ppm, z: pz + y / ppm };
}

type BigMapInstance = {
  el: HTMLElement;
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cx: number;
  cz: number;
  s: number;
  dpr: number;
  data: MapData;
  places: () => Array<{ x: number; z: number; name: string; sign: string; cat: string; pylon?: [number, number] }>;
  player: () => { x: number; z: number; h: number };
  dest: { x: number; z: number; name?: string } | null;
  route: { pts?: Array<[number, number]>; len?: number } | null;
  dirty: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  draw(): void;
  W(x: number, z: number): [number, number];
  pick(dest: { x: number; z: number; name: string }): void;
  ui(): void;
  __awEnhanced?: boolean;
};

export class Navigator {
  readonly graph: RoadGraph;
  private heap: MinHeap<number>;
  private cameFrom: Int32Array;
  private gScore: Float64Array;
  route: number[] = [];
  nextTurn = 0;
  destId = -1;
  destination: { x: number; z: number; name?: string } | null = null;
  fullMapOpen = false;
  private mapData: MapData | null = null;
  private g: AGame | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  // Cached player position and heading
  px = 0;
  pz = 0;
  heading = 0;

  constructor(roads: RoadPolyline[], mapData?: MapData, g?: AGame) {
    this.graph = new RoadGraph(roads);
    const n = this.graph.nodes.length;
    this.heap = new MinHeap(n);
    this.cameFrom = new Int32Array(n);
    this.gScore = new Float64Array(n);
    if (mapData) this.mapData = mapData;
    if (g) this.g = g;

    this.initIntegrations();
  }

  private initIntegrations(): void {
    // 1. Wire window.__fsd for game and bigmap routing
    (window as unknown as { __fsd?: unknown }).__fsd = {
      plan: (dest: { x: number; z: number; name?: string }) => this.planRoute(dest),
      go: (dest: { x: number; z: number; name?: string }) => { this.setDestination(dest.x, dest.z, dest.name); },
      cancel: () => { this.clearDestination(); }
    };

    // 3. Category colors for beaches and named places on big map
    const win = window as unknown as { Tf?: Record<string, string> };
    if (!win.Tf) win.Tf = {};
    Object.assign(win.Tf, {
      beach: "#ffd34d",
      town: "#48dbfb",
      attraction: "#ff9f43",
      lighthouse: "#ff4757",
      viewpoint: "#1dd1a1",
      peak: "#10ac84"
    });

    // 4. Keyboard shortcuts: Escape closes full map
    this.keyHandler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toUpperCase();
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Escape") {
        const bm = this.getBigMap();
        if (this.fullMapOpen || (bm && !bm.el.classList.contains("hidden"))) {
          this.closeFullMap();
        }
      }
    };
    window.addEventListener("keydown", this.keyHandler);
  }

  private getPoiPlaces(): Array<{ x: number; z: number; name: string; sign: string; cat: string; pylon?: [number, number] }> {
    const pois = this.mapData?.pois || this.g?.DATA?.pois || [];
    return pois.map((poi) => ({
      k: "poi_" + poi.n.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name: poi.n,
      sign: poi.n,
      cat: poi.k,
      x: poi.p[0],
      z: poi.p[1],
      pylon: poi.p
    }));
  }

  update(now: number, px: number, pz: number, heading: number): void {
    this.px = px;
    this.pz = pz;
    this.heading = heading;

    if (this.destId >= 0 && this.route.length > 1) {
      const start = this.graph.nearest(px, pz);
      // Re-route if player is far from route
      let onRoute = false;
      for (let i = 0; i < this.route.length; i++) {
        const n = this.graph.nodes[this.route[i]];
        if ((n.x - px) ** 2 + (n.z - pz) ** 2 < 80 * 80) {
          onRoute = true;
          break;
        }
      }
      if (!onRoute) {
        this.route = this.graph.findPath(start, this.destId, this.heap, this.cameFrom, this.gScore);
        this.nextTurn = 1;
      }

      // Advance next turn
      while (this.nextTurn < this.route.length - 1) {
        const n = this.graph.nodes[this.route[this.nextTurn]];
        if ((n.x - px) ** 2 + (n.z - pz) ** 2 < 25 * 25) this.nextTurn++;
        else break;
      }
    }
    this.drawTurnHUD(px, pz);
  }

  /** Calculate A* route to destination, update GPS navigation state, and return path points + total length */
  planRoute(dest: { x: number; z: number; name?: string }): { pts: Array<[number, number]>; len: number } | null {
    if (!this.graph.nodes.length) return null;
    const start = this.graph.nearest(this.px, this.pz);
    const goal = this.graph.nearest(dest.x, dest.z);
    const route = this.graph.findPath(start, goal, this.heap, this.cameFrom, this.gScore);
    if (!route.length) return null;

    const pts: Array<[number, number]> = route.map((id) => [this.graph.nodes[id].x, this.graph.nodes[id].z]);
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    }

    this.destId = goal;
    this.destination = { x: dest.x, z: dest.z, name: dest.name || "Waypoint" };
    this.route = route;
    this.nextTurn = 1;
    this.drawTurnHUD(this.px, this.pz);

    return { pts, len };
  }

  setDestination(wx: number, wz: number, name?: string): { pts: Array<[number, number]>; len: number } | null {
    return this.planRoute({ x: wx, z: wz, name: name || "Waypoint" });
  }

  clearDestination(): void {
    this.destId = -1;
    this.destination = null;
    this.route = [];
    this.nextTurn = 0;
    this.drawTurnHUD(this.px, this.pz);

    const bm = this.getBigMap();
    if (bm) {
      bm.dest = null;
      bm.route = null;
      bm.ui();
      bm.dirty = true;
    }
  }

  getBigMap(): BigMapInstance | null {
    const win = window as unknown as { __bigMap?: () => BigMapInstance | null };
    let bm = win.__bigMap ? win.__bigMap() : null;
    if (!bm) {
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyM" }));
      bm = win.__bigMap ? win.__bigMap() : null;
      if (bm && !this.fullMapOpen) {
        bm.close();
      }
    }
    if (bm) this.enhanceBigMap(bm);
    return bm;
  }

  private enhanceBigMap(bm: BigMapInstance): void {
    if (bm.__awEnhanced) return;
    bm.__awEnhanced = true;

    const poiPlaces = this.getPoiPlaces();
    const origPlaces = bm.places.bind(bm);
    bm.places = () => {
      const base = origPlaces();
      return [...base, ...poiPlaces];
    };

    const data = this.mapData || this.g?.DATA || bm.data;

    // Enhance big map draw method to include shallow coastal water and beach lagoons
    const origDraw = bm.draw.bind(bm);
    bm.draw = function () {
      origDraw();
      // If shallow coastal water is available, draw before land or highlight beaches
      if (data?.shallow && data.shallow.length && bm.ctx) {
        const ctx = bm.ctx;
        ctx.save();
        ctx.setTransform(bm.dpr, 0, 0, bm.dpr, 0, 0);
        ctx.fillStyle = "rgba(42, 112, 155, 0.4)";
        for (const s of data.shallow) {
          ctx.beginPath();
          s.forEach(([x, z], idx) => {
            const [ix, iy] = bm.W(x, z);
            if (idx === 0) ctx.moveTo(ix, iy);
            else ctx.lineTo(ix, iy);
          });
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    };
  }

  openFullMap(playerX?: number, playerZ?: number): void {
    if (playerX !== undefined && playerZ !== undefined) {
      this.px = playerX;
      this.pz = playerZ;
    }
    const bm = this.getBigMap();
    if (bm) {
      bm.open();
      this.fullMapOpen = true;
      return;
    }
    const bigmapEl = document.getElementById("bigmap");
    if (bigmapEl) {
      bigmapEl.classList.remove("hidden");
      this.fullMapOpen = true;
    }
  }

  closeFullMap(): void {
    const bm = this.getBigMap();
    if (bm) {
      bm.close();
      this.fullMapOpen = false;
      return;
    }
    const bigmapEl = document.getElementById("bigmap");
    if (bigmapEl) {
      bigmapEl.classList.add("hidden");
      this.fullMapOpen = false;
    }
  }

  toggleFullMap(): void {
    if (this.fullMapOpen) {
      this.closeFullMap();
    } else {
      this.openFullMap();
    }
  }

  private drawTurnHUD(px: number, pz: number): void {
    let el = document.getElementById("aw-nav-turn");
    if (!el) {
      el = document.createElement("div");
      el.id = "aw-nav-turn";
      el.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:72px;color:#fff;font:700 15px system-ui,sans-serif;background:rgba(10,14,18,.75);padding:6px 14px;border-radius:10px;border:1px solid rgba(0,210,211,0.5);box-shadow:0 4px 12px rgba(0,0,0,0.4);z-index:20;pointer-events:none;transition:opacity 0.2s;";
      document.body.appendChild(el);
    }
    if (this.route.length < 2 || this.nextTurn >= this.route.length) {
      el.textContent = "";
      el.style.display = "none";
      return;
    }
    el.style.display = "block";
    const cur = this.graph.nodes[this.route[this.nextTurn - 1]];
    const nxt = this.graph.nodes[this.route[this.nextTurn]];
    const dist = Math.hypot(nxt.x - px, nxt.z - pz);
    const arrow = turnArrow(this.heading, nxt.x - cur.x, nxt.z - cur.z);
    const destName = this.destination?.name ? ` · To ${this.destination.name}` : "";
    el.textContent = `${arrow} ${Math.round(dist)} m${nxt.name ? " · " + nxt.name : ""}${destName}`;
  }

  /** Click or long-press on minimap sets destination; tapping near destination clears it. */
  bindMinimap(canvas: HTMLCanvasElement, pixelsPerMetre: () => number): void {
    const HOLD_MS = 350, SLOP_PX = 10;
    let timer = 0, sx0 = 0, sy0 = 0, pid = -1, swallow = false;
    const cancel = () => { if (timer) { clearTimeout(timer); timer = 0; } pid = -1; };
    const pick = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const sx = ((clientX - rect.left) / rect.width - 0.5) * canvas.width;
      const sy = ((clientY - rect.top) / rect.height - 0.5) * canvas.height;
      const ppm = pixelsPerMetre();
      if (!(ppm > 0)) return;
      const world = minimapToWorld(this.px, this.pz, this.heading, sx, sy, ppm);

      // If clicking near existing destination (within 40m), clear it
      if (this.destination && Math.hypot(world.x - this.destination.x, world.z - this.destination.z) < 40) {
        this.clearDestination();
      } else {
        this.setDestination(world.x, world.z);
      }
      this.update(performance.now(), this.px, this.pz, this.heading);
    };

    canvas.addEventListener("pointerdown", (ev) => {
      cancel(); swallow = false;
      pid = ev.pointerId; sx0 = ev.clientX; sy0 = ev.clientY;
      timer = window.setTimeout(() => { timer = 0; swallow = true; pick(sx0, sy0); }, HOLD_MS);
    }, true);
    canvas.addEventListener("pointermove", (ev) => {
      if (ev.pointerId === pid && timer && Math.hypot(ev.clientX - sx0, ev.clientY - sy0) > SLOP_PX) cancel();
    }, true);
    canvas.addEventListener("pointerup", (ev) => {
      if (ev.pointerId === pid) {
        if (timer) {
          // Plain click/tap without drag
          cancel();
          pick(ev.clientX, ev.clientY);
        }
        cancel();
      }
    }, true);
    canvas.addEventListener("pointercancel", cancel, true);
    canvas.addEventListener("pointerleave", cancel, true);
    canvas.addEventListener("click", (ev) => {
      if (!swallow) return;
      swallow = false;
      ev.preventDefault(); ev.stopPropagation();
    }, true);
  }

  /** Render GPS route polyline on minimap */
  drawRoute(ctx: CanvasRenderingContext2D, cx: number, cz: number, ppm: number, u: number, h: number): void {
    if (this.route.length < 2) return;
    const N = this.graph.nodes;
    ctx.save();
    ctx.lineJoin = "round"; ctx.lineCap = "round";

    // 1. Outer dark casing
    ctx.strokeStyle = "rgba(10, 18, 26, 0.85)"; ctx.lineWidth = 7 * u;
    ctx.beginPath();
    for (let i = this.nextTurn - 1; i < this.route.length; i++) {
      const n = N[this.route[Math.max(0, i)]];
      const x = (n.x - cx) * ppm, y = (n.z - cz) * ppm;
      if (i === this.nextTurn - 1) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 2. Inner glowing cyan GPS route line
    ctx.strokeStyle = "#00d2d3"; ctx.lineWidth = 4 * u; ctx.stroke();

    // 3. Street names when zoomed in (walk range)
    if (ppm / u > 0.25) {
      ctx.font = `700 ${Math.round(9 * u)}px system-ui,sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      let last = "";
      for (let i = this.nextTurn; i < this.route.length; i++) {
        const n = N[this.route[i]];
        if (!n.name || n.name === last) continue;
        last = n.name;
        const x = (n.x - cx) * ppm, y = (n.z - cz) * ppm;
        if (x * x + y * y > (60 * u) ** 2) continue;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-h);
        ctx.lineWidth = 3 * u;
        ctx.strokeStyle = "rgba(10,14,18,.85)";
        ctx.strokeText(n.name, 0, -8 * u);
        ctx.fillStyle = "#fff";
        ctx.fillText(n.name, 0, -8 * u);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  dispose(): void {
    this.closeFullMap();
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
    const el = document.getElementById("aw-nav-turn");
    if (el) el.remove();
  }
}
