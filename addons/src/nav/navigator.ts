import { RoadGraph, type RoadPolyline } from "./graph.ts";
import { MinHeap } from "./heap.ts";

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

export class Navigator {
  readonly graph: RoadGraph;
  private heap: MinHeap<number>;
  private cameFrom: Int32Array;
  private gScore: Float64Array;
  private route: number[] = [];
  private nextTurn = 0;
  private destId = -1;
  private fullMapOpen = false;
  private fullCanvas: HTMLCanvasElement | null = null;

  constructor(roads: RoadPolyline[]) {
    this.graph = new RoadGraph(roads);
    const n = this.graph.nodes.length;
    this.heap = new MinHeap(n);
    this.cameFrom = new Int32Array(n);
    this.gScore = new Float64Array(n);
  }

  /** Call every frame with player world position and heading (radians). */
  private px = 0;
  private pz = 0;
  private heading = 0;

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
      if (!onRoute) this.setDestinationNode(this.destId, start);

      // Advance next turn
      while (this.nextTurn < this.route.length - 1) {
        const n = this.graph.nodes[this.route[this.nextTurn]];
        if ((n.x - px) ** 2 + (n.z - pz) ** 2 < 25 * 25) this.nextTurn++;
        else break;
      }
    }
    this.drawTurnHUD(px, pz);
  }

  setDestination(wx: number, wz: number): void {
    const start = this.graph.nearest(this.px, this.pz); // route from the player's last known position
    this.setDestinationNode(this.graph.nearest(wx, wz), start);
  }

  private setDestinationNode(goal: number, start: number): void {
    this.destId = goal;
    this.route = this.graph.findPath(start, goal, this.heap, this.cameFrom, this.gScore);
    this.nextTurn = 1;
  }

  openFullMap(playerX: number, playerZ: number): void {
    if (this.fullMapOpen) return;
    this.fullMapOpen = true;
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 640;
    c.style.cssText = "position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:30;background:#123;border:2px solid #fff;";
    document.body.appendChild(c);
    this.fullCanvas = c;
    const ctx = c.getContext("2d")!;
    // simple full view
    ctx.strokeStyle = "#aaa";
    for (const n of this.graph.nodes) {
      for (const e of n.edges) {
        if (e.to < n.id) continue;
        const m = this.graph.nodes[e.to];
        ctx.beginPath();
        ctx.moveTo(n.x * 0.15 + 320, n.z * 0.15 + 320);
        ctx.lineTo(m.x * 0.15 + 320, m.z * 0.15 + 320);
        ctx.stroke();
      }
    }
    c.addEventListener("click", (ev) => {
      const rect = c.getBoundingClientRect();
      const x = ((ev.clientX - rect.left) / rect.width - 0.5) * (640 / 0.15);
      const z = ((ev.clientY - rect.top) / rect.height - 0.5) * (640 / 0.15);
      this.setDestinationNode(this.graph.nearest(x, z), this.graph.nearest(playerX, playerZ));
      this.closeFullMap();
    });
  }

  closeFullMap(): void {
    if (this.fullCanvas) {
      this.fullCanvas.remove();
      this.fullCanvas = null;
    }
    this.fullMapOpen = false;
  }

  private drawTurnHUD(px: number, pz: number): void {
    // Minimal overlay text — reused DOM element created once
    let el = document.getElementById("aw-nav-turn");
    if (!el) {
      el = document.createElement("div");
      el.id = "aw-nav-turn";
      el.style.cssText = "position:fixed;left:50%;transform:translateX(-50%);bottom:72px;color:#fff;font:700 15px system-ui,sans-serif;background:rgba(10,14,18,.72);padding:6px 12px;border-radius:8px;z-index:20;pointer-events:none;";
      document.body.appendChild(el);
    }
    if (this.route.length < 2 || this.nextTurn >= this.route.length) {
      el.textContent = "";
      return;
    }
    const cur = this.graph.nodes[this.route[this.nextTurn - 1]];
    const nxt = this.graph.nodes[this.route[this.nextTurn]];
    const dist = Math.hypot(nxt.x - px, nxt.z - pz);
    const arrow = turnArrow(this.heading, nxt.x - cur.x, nxt.z - cur.z);
    el.textContent = `${arrow} ${Math.round(dist)} m${nxt.name ? " · " + nxt.name : ""}`;
  }

  /** Long-press (~500 ms, within ~10 px) the game minimap to set an A* destination. A plain tap passes through to the game. */
  bindMinimap(canvas: HTMLCanvasElement, pixelsPerMetre: () => number): void {
    const HOLD_MS = 500, SLOP_PX = 10;
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
      this.setDestination(world.x, world.z);
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
    canvas.addEventListener("pointerup", (ev) => { if (ev.pointerId === pid) cancel(); }, true);
    canvas.addEventListener("pointercancel", cancel, true);
    canvas.addEventListener("pointerleave", cancel, true);
    canvas.addEventListener("click", (ev) => {
      if (!swallow) return;
      swallow = false;
      ev.preventDefault(); ev.stopPropagation();
    }, true);
  }

  /** FIX 4 hook: called from the game's minimap draw pass, ctx centred on (cx,cz) and rotated; ppm = canvas px per metre. */
  drawRoute(ctx: CanvasRenderingContext2D, cx: number, cz: number, ppm: number, u: number, h: number): void {
    if (this.route.length < 2) return;
    const N = this.graph.nodes;
    ctx.save();
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(10,14,18,.6)"; ctx.lineWidth = 7 * u;
    ctx.beginPath();
    for (let i = this.nextTurn - 1; i < this.route.length; i++) { const n = N[this.route[Math.max(0, i)]]; const x = (n.x - cx) * ppm, y = (n.z - cz) * ppm; if (i === this.nextTurn - 1) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke(); ctx.strokeStyle = "#ffcc33"; ctx.lineWidth = 4 * u; ctx.stroke();
    if (ppm / u > 0.25) { // street names when zoomed in (walk range)
      ctx.font = `700 ${Math.round(9 * u)}px system-ui,sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      let last = "";
      for (let i = this.nextTurn; i < this.route.length; i++) {
        const n = N[this.route[i]]; if (!n.name || n.name === last) continue; last = n.name;
        const x = (n.x - cx) * ppm, y = (n.z - cz) * ppm; if (x * x + y * y > (60 * u) ** 2) continue;
        ctx.save(); ctx.translate(x, y); ctx.rotate(-h); ctx.lineWidth = 3 * u; ctx.strokeStyle = "rgba(10,14,18,.85)"; ctx.strokeText(n.name, 0, -8 * u); ctx.fillStyle = "#fff"; ctx.fillText(n.name, 0, -8 * u); ctx.restore();
      }
    }
    ctx.restore();
  }

  dispose(): void {
    this.closeFullMap();
    const el = document.getElementById("aw-nav-turn");
    if (el) el.remove();
  }
}
