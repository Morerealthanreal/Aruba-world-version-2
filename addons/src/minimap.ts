// GV-style minimap, drawn through the bundle hook window.__awMiniMap (tools/patch_minimap.py) instead of A's V_:
//  - crisp roads: a cached local tile (roads stroked at minimap scale from A's map data, grid-indexed) re-rendered
//    only when the player nears its edge or the zoom bucket changes; every draw is still ONE drawImage, like A's
//  - plane mode (5+ km ranges) and the moment before a local tile exists use a 1024 px whole-island map in the
//    same palette; both maps are built in idle-time slices, never inside a frame
//  - dark GV palette, thick main roads with casing, white heading arrow, N badge on the rim
//  - POI dots only for malls/hotels/fuel/attractions, at most 3 de-overlapped labels (A labelled every shop in view)
//  - car/moto zoom follows speed (tighter than A's fixed 1.6 km so streets read on a ~120 px circle)
// ?minimap=0 restores A's minimap.
import type { AGame } from "./env";

type MapTex = { c: HTMLCanvasElement; k: number };
type Bounds = { minX: number; maxX: number; minZ: number; maxZ: number };
type Brand = { x: number; z: number; bg: string; fg: string; cat: string; k: string; sign: string };
type Pts = Array<[number, number]>;
type Road = { c: number; p: Pts };
export type MapPOI = { n: string; k: string; p: [number, number] };
export type MapData = { land: Array<{ outer: Pts }>; shallow?: Pts[]; parks: Pts[]; roads: Road[]; runways: Pts[]; pois?: MapPOI[] };
type MiniWindow = Window & {
  __awMiniMap?: (x: number, z: number, h: number, r: number, tex: MapTex, b: Bounds, brands: Brand[], data: MapData) => void;
  requestIdleCallback?: (cb: (d: { timeRemaining(): number }) => void, o?: { timeout: number }) => number;
};
type Player = { mode: string; car: { x: number; z: number; s?: number }; walk: { x: number; z: number } };

const CELL = 500;
const TILE = 1024;
const WORLD = 1024;
const SEA = "#1d5683", SHALLOW = "#257a9e", LAND = "#47524c", PARK = "#4c6444", RUNWAY = "#262c31", CASING = "#1b2126";
const ROAD_COL = ["#aeb5b8", "#c3c8ca", "#eef0f0", "#ffd34d", "#ffd34d"];
/** Road widths per OSM class in minimap CSS px (exaggerated like GV: a 6 m street would be sub-pixel at true scale). */
const ROAD_W = [1.1, 1.4, 2.1, 2.7, 3.2];
/** Whole-island map road widths in its own pixels (~0.04 px/m). */
const WORLD_W = [0.45, 0.55, 0.9, 1.3, 1.6];
const LABEL_CATS = new Set(["store", "mall", "hotel", "gas", "attraction"]);
const DOT_CATS = new Set(["mall", "hotel", "gas", "attraction"]);

export class MiniMap {
  stats = { tiles: 0, tileMs: 0, jobMaxMs: 0, world: false, labels: 0, size: 0 };
  private canvas = document.getElementById("minimap") as HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null = null;
  private css = 0;
  private tile = document.createElement("canvas");
  private tcx = 0; private tcz = 0; private tppm = 0; private tileOk = false; private tileQueued = false;
  private want = { ppm: 0, cssPerM: 0 };
  private world = document.createElement("canvas");
  private wk = 0; private wb: Bounds | null = null;
  private data: MapData | null = null;
  private grid: Map<number, number[]> | null = null;
  private parkGrid: Map<number, number[]> | null = null;
  private stamp: Uint32Array | null = null; private parkStamp: Uint32Array | null = null; private gen = 0;
  private jobs: Array<() => void> = []; private idleOn = false;
  private range = 0;
  private placed: number[] = [];
  private pick: Array<{ b: Brand; d: number; x: number; y: number }> = [];
  private rim: CanvasGradient | null = null; private rimW = 0;

  constructor(private g: AGame) {
    this.tile.width = this.tile.height = TILE;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    document.body.classList.add("awmm");
    this.resize();
    addEventListener("resize", () => this.resize());
    addEventListener("orientationchange", () => setTimeout(() => this.resize(), 250));
    (window as MiniWindow).__awMiniMap = (x, z, h, r, tex, b, brands, data) => this.draw(x, z, h, r, tex, b, brands, data);
  }

  /** Backing store follows the displayed size (capped at A's 300 px so the per-draw fill cost never grows). */
  private resize() {
    const c = this.canvas!, wrap = c.parentElement!;
    this.css = wrap.clientWidth || 120;
    const px = Math.max(96, Math.min(300, Math.round(this.css * Math.min(3, devicePixelRatio || 1))));
    if (c.width !== px) { c.width = c.height = px; this.tileOk = false; }
    this.stats.size = px;
  }

  // ---------- idle-time work ----------
  private idle(job: () => void, first = false) {
    if (first) this.jobs.unshift(job); else this.jobs.push(job);
    this.kick();
  }

  private kick() {
    if (this.idleOn || !this.jobs.length) return;
    this.idleOn = true;
    const run = (d?: { timeRemaining(): number }) => {
      this.idleOn = false;
      do {
        const t0 = performance.now();
        this.jobs.shift()!();
        this.stats.jobMaxMs = Math.max(this.stats.jobMaxMs, Math.round((performance.now() - t0) * 10) / 10);
      } while (this.jobs.length && d && d.timeRemaining() > 4);
      this.kick();
    };
    const ric = (window as MiniWindow).requestIdleCallback;
    if (ric) ric(run, { timeout: 250 }); else setTimeout(run, 16);
  }

  private start(data: MapData, b: Bounds) {
    this.data = data; this.wb = b;
    this.idle(() => { if (!this.grid) this.index(data); });
    const n = Math.max(b.maxX - b.minX, b.maxZ - b.minZ), k = (this.wk = WORLD / n);
    const w = this.world; w.width = w.height = WORLD;
    const c = w.getContext("2d")!;
    const X = (x: number) => (x - b.minX) * k, Z = (z: number) => (z - b.minZ) * k;
    const poly = (pts: Pts) => pts.forEach(([x, z], i) => (i ? c.lineTo(X(x), Z(z)) : c.moveTo(X(x), Z(z))));
    this.idle(() => {
      c.fillStyle = SEA; c.fillRect(0, 0, WORLD, WORLD);
      if (data.shallow) {
        c.fillStyle = SHALLOW; c.beginPath(); for (const s of data.shallow) { poly(s); c.closePath(); } c.fill();
      }
      c.fillStyle = LAND; c.beginPath(); for (const l of data.land) { poly(l.outer); c.closePath(); } c.fill();
      c.fillStyle = PARK; c.beginPath(); for (const p of data.parks) { poly(p); c.closePath(); } c.fill();
      c.lineCap = c.lineJoin = "round";
      c.strokeStyle = RUNWAY; c.lineWidth = 45 * k; c.beginPath(); for (const r of data.runways) poly(r); c.stroke();
    });
    for (let cls = 0; cls <= 4; cls++) this.idle(() => {
      c.strokeStyle = ROAD_COL[cls]; c.lineWidth = WORLD_W[cls]; c.beginPath();
      for (const r of data.roads) if (r.c === cls) poly(r.p);
      c.stroke();
      if (cls === 4) this.stats.world = true;
    });
  }

  private key(cx: number, cz: number) { return cx * 65536 + cz; }

  private index(data: MapData) {
    const grid = new Map<number, number[]>(), parks = new Map<number, number[]>();
    const add = (m: Map<number, number[]>, pts: Pts, i: number) => {
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (const [x, z] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (z < z0) z0 = z; if (z > z1) z1 = z; }
      for (let cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx++)
        for (let cz = Math.floor(z0 / CELL); cz <= Math.floor(z1 / CELL); cz++) {
          const k = this.key(cx, cz); let a = m.get(k); if (!a) m.set(k, (a = [])); a.push(i);
        }
    };
    data.roads.forEach((r, i) => add(grid, r.p, i));
    data.parks.forEach((p, i) => add(parks, p, i));
    this.grid = grid; this.parkGrid = parks;
    this.stamp = new Uint32Array(data.roads.length); this.parkStamp = new Uint32Array(data.parks.length);
  }

  private query(m: Map<number, number[]>, stamp: Uint32Array, x0: number, z0: number, x1: number, z1: number, out: number[]) {
    out.length = 0;
    for (let cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx++)
      for (let cz = Math.floor(z0 / CELL); cz <= Math.floor(z1 / CELL); cz++) {
        const a = m.get(this.key(cx, cz)); if (!a) continue;
        for (const i of a) if (stamp[i] !== this.gen) { stamp[i] = this.gen; out.push(i); }
      }
    return out;
  }

  /** Re-centres the local tile on wherever the player is when the idle slot comes up. */
  private queueTile(ppm: number, cssPerM: number) {
    this.want.ppm = ppm; this.want.cssPerM = cssPerM;
    if (this.tileQueued) return;
    this.tileQueued = true;
    const job = () => {
      if (!this.grid) { this.index(this.data!); this.idle(job, true); return; }
      this.tileQueued = false;
      const S = this.g.S as unknown as Player, p = S.mode === "walk" ? S.walk : S.car;
      this.renderTile(p.x, p.z, this.want.ppm, this.want.cssPerM);
    };
    this.idle(job, true);
  }

  private renderTile(cx: number, cz: number, ppm: number, cssPerM: number) {
    const t0 = performance.now(), data = this.data!;
    const c = this.tile.getContext("2d")!, half = TILE / 2 / ppm;
    const x0 = cx - half, x1 = cx + half, z0 = cz - half, z1 = cz + half;
    const X = (x: number) => (x - cx) * ppm + TILE / 2, Z = (z: number) => (z - cz) * ppm + TILE / 2;
    const poly = (pts: Pts) => pts.forEach(([x, z], i) => (i ? c.lineTo(X(x), Z(z)) : c.moveTo(X(x), Z(z))));
    c.fillStyle = SEA; c.fillRect(0, 0, TILE, TILE);
    if (data.shallow) {
      c.fillStyle = SHALLOW; c.beginPath();
      for (const s of data.shallow) { poly(s); c.closePath(); }
      c.fill();
    }
    c.fillStyle = LAND; c.beginPath();
    for (const l of data.land) { poly(l.outer); c.closePath(); }
    c.fill();
    const ids: number[] = [];
    this.gen++;
    c.fillStyle = PARK; c.beginPath();
    for (const i of this.query(this.parkGrid!, this.parkStamp!, x0, z0, x1, z1, ids)) { poly(data.parks[i]); c.closePath(); }
    c.fill();
    c.lineCap = c.lineJoin = "round";
    c.strokeStyle = RUNWAY; c.lineWidth = 45 * ppm; c.beginPath();
    for (const r of data.runways) poly(r);
    c.stroke();
    this.gen++;
    const roads = this.query(this.grid!, this.stamp!, x0, z0, x1, z1, ids);
    const k = ppm / cssPerM; // tile px per minimap CSS px
    const pass = (cls: number, w: number, col: string) => {
      c.strokeStyle = col; c.lineWidth = w; c.beginPath();
      for (const i of roads) { const r = data.roads[i]; if (r.c === cls) poly(r.p); }
      c.stroke();
    };
    for (let cls = 2; cls <= 4; cls++) pass(cls, (ROAD_W[cls] + 1.2) * k, CASING);
    for (let cls = 0; cls <= 4; cls++) pass(cls, ROAD_W[cls] * k, ROAD_COL[cls]);
    this.tcx = cx; this.tcz = cz; this.tppm = ppm; this.tileOk = true;
    this.stats.tiles++; this.stats.tileMs = Math.round((performance.now() - t0) * 10) / 10;
  }

  // ---------- per-draw ----------
  private draw(x: number, z: number, h: number, aRange: number, tex: MapTex, b: Bounds, brands: Brand[], data: MapData) {
    const ctx = this.ctx; if (!ctx) return;
    if (!this.data) this.start(data, b);
    const S = this.g.S as unknown as Player;
    const mode = S.mode, drive = mode === "car" || mode === "moto";
    const target = drive ? 900 + Math.min(45, Math.abs(S.car.s || 0)) * 13 : mode === "walk" ? 480 : aRange;
    this.range = !this.range || mode === "plane" ? target : this.range + (target - this.range) * 0.12;
    const range = this.range, W = this.canvas!.width, pxPerCss = W / this.css;
    const ppmCanvas = W / range;
    ctx.save();
    ctx.fillStyle = SEA; ctx.fillRect(0, 0, W, W);
    ctx.translate(W / 2, W / 2); ctx.rotate(h);
    let covered = false;
    if (range <= 2000) {
      // tile resolution ~1.25x the minimap's, in two zoom buckets (walk vs drive)
      const ppm = range < 700 ? 0.75 : 0.36;
      // the wrap is round, so a range-wide square (rotated) already covers everything visible
      const room = TILE / 2 / ppm - range * 0.5 - Math.max(Math.abs(x - this.tcx), Math.abs(z - this.tcz));
      covered = this.tileOk && this.tppm === ppm && room > 20;
      if (!covered || room < 300) this.queueTile(ppm, ppmCanvas / pxPerCss);
    }
    if (covered) {
      const s = range * this.tppm;
      ctx.drawImage(this.tile, (x - this.tcx) * this.tppm + TILE / 2 - s / 2, (z - this.tcz) * this.tppm + TILE / 2 - s / 2, s, s, -W / 2, -W / 2, W, W);
    } else {
      const own = this.stats.world, src = own ? this.world : tex.c, a = own ? this.wk : tex.k, o = range * a;
      ctx.drawImage(src, (x - b.minX) * a - o / 2, (z - b.minZ) * a - o / 2, o, o, -W / 2, -W / 2, W, W);
    }
    this.pois(ctx, x, z, h, ppmCanvas, pxPerCss, W, brands, range <= 2000);
    const nav = (window as unknown as { __aw?: { nav?: { destination?: { x: number; z: number; name?: string } | null } } }).__aw?.nav;
    if (nav && nav.destination) {
      const dest = nav.destination;
      const dx = (dest.x - x) * ppmCanvas, dy = (dest.z - z) * ppmCanvas;
      const inView = dx * dx + dy * dy <= (W / 2 - 8 * pxPerCss) ** 2;
      if (inView) {
        ctx.save();
        ctx.translate(dx, dy);
        ctx.fillStyle = "#ff4757";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.8 * pxPerCss;
        ctx.beginPath();
        ctx.arc(0, -6 * pxPerCss, 4.5 * pxPerCss, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-3.5 * pxPerCss, -3 * pxPerCss);
        ctx.lineTo(0, 3 * pxPerCss);
        ctx.lineTo(3.5 * pxPerCss, -3 * pxPerCss);
        ctx.fill();
        ctx.restore();
      } else {
        const rimAngle = Math.atan2(dy, dx);
        const rimR = W / 2 - 12 * pxPerCss;
        const rx = Math.cos(rimAngle) * rimR, ry = Math.sin(rimAngle) * rimR;
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(rimAngle + Math.PI / 2);
        ctx.fillStyle = "#ff4757";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5 * pxPerCss;
        ctx.beginPath();
        ctx.moveTo(0, -7 * pxPerCss);
        ctx.lineTo(5 * pxPerCss, 5 * pxPerCss);
        ctx.lineTo(0, 2 * pxPerCss);
        ctx.lineTo(-5 * pxPerCss, 5 * pxPerCss);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
    this.chrome(ctx, W, h, pxPerCss);
  }

  private pois(ctx: CanvasRenderingContext2D, x: number, z: number, h: number, ppm: number, u: number, W: number, brands: Brand[], dots: boolean) {
    const R = W / 2 - 4 * u, R2 = R * R, pick = this.pick;
    pick.length = 0;
    ctx.lineWidth = 1.2 * u; ctx.strokeStyle = "#fff";
    for (const p of brands) {
      const px = (p.x - x) * ppm, py = (p.z - z) * ppm, d = px * px + py * py;
      if (d > R2 || p.k.startsWith("m_")) continue;
      if (dots && DOT_CATS.has(p.cat)) {
        ctx.fillStyle = p.bg === "#ffffff" || p.bg === "#f4f1e6" ? p.fg : p.bg;
        ctx.beginPath(); ctx.arc(px, py, 2.4 * u, 0, 6.2832); ctx.fill(); ctx.stroke();
      }
      // landmarks people navigate by (malls, hotels, fuel) win over the nearest boutique
      if (LABEL_CATS.has(p.cat) && p.sign) pick.push({ b: p, d: p.cat === "store" ? d : d * 0.3, x: px, y: py });
    }
    if (this.data && this.data.pois) {
      for (const p of this.data.pois) {
        const px = (p.p[0] - x) * ppm, py = (p.p[1] - z) * ppm, d = px * px + py * py;
        if (d > R2) continue;
        const isBeach = p.k === "beach" || p.n.toLowerCase().includes("beach");
        const isTown = p.k === "town";
        const isLandmark = p.k === "attraction" || p.k === "lighthouse" || p.k === "viewpoint" || p.k === "peak";
        if (dots) {
          if (isBeach) {
            ctx.fillStyle = "#ffd34d"; // warm golden beach sand
            ctx.beginPath(); ctx.arc(px, py, 2.8 * u, 0, 6.2832); ctx.fill(); ctx.stroke();
          } else if (isTown) {
            ctx.fillStyle = "#48dbfb"; // town
            ctx.beginPath(); ctx.arc(px, py, 3.2 * u, 0, 6.2832); ctx.fill(); ctx.stroke();
          } else if (isLandmark) {
            ctx.fillStyle = "#ff9f43"; // landmark
            ctx.beginPath(); ctx.arc(px, py, 2.6 * u, 0, 6.2832); ctx.fill(); ctx.stroke();
          }
        }
        if (isBeach || isTown || isLandmark) {
          const fakeBrand: Brand = {
            x: p.p[0],
            z: p.p[1],
            bg: isBeach ? "#ffd34d" : isTown ? "#48dbfb" : "#ff9f43",
            fg: "#ffffff",
            cat: p.k,
            k: "poi_" + p.n,
            sign: p.n
          };
          pick.push({ b: fakeBrand, d: isTown ? d * 0.1 : isBeach ? d * 0.2 : d * 0.4, x: px, y: py });
        }
      }
    }
    pick.sort((a, b) => a.d - b.d);
    const placed = this.placed; placed.length = 0;
    ctx.font = `800 ${Math.round(9.5 * u)}px system-ui,sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    const sn = Math.sin(h), cs = Math.cos(h);
    let n = 0, tries = 0;
    for (const q of pick) {
      if (n >= 3 || tries > 24) break;
      // label box in screen space (map is rotated by h around the centre)
      const sx = q.x * cs - q.y * sn, sy = q.x * sn + q.y * cs - 9 * u;
      if (Math.abs(sx) < 18 * u && Math.abs(sy) < 19 * u) continue;
      tries++;
      const txt = q.b.sign.length > 14 ? q.b.sign.slice(0, 13) + "…" : q.b.sign;
      const w = ctx.measureText(txt).width + 8 * u, hh = 15 * u;
      if (Math.hypot(Math.abs(sx) + w / 2, Math.abs(sy) + hh / 2) > W / 2 - 2 * u) continue;
      let hit = false;
      for (let i = 0; i < placed.length; i += 4) if (Math.abs(sx - placed[i]) * 2 < w + placed[i + 2] && Math.abs(sy - placed[i + 1]) * 2 < hh + placed[i + 3]) { hit = true; break; }
      // keep the heading arrow clear
      if (hit || (Math.abs(sx) < w / 2 + 10 * u && Math.abs(sy) < hh / 2 + 11 * u)) continue;
      placed.push(sx, sy, w, hh);
      ctx.save(); ctx.rotate(-h);
      ctx.lineWidth = 3.2 * u; ctx.strokeStyle = "rgba(10,14,18,.85)"; ctx.strokeText(txt, sx, sy);
      ctx.fillStyle = "#fff"; ctx.fillText(txt, sx, sy);
      ctx.restore();
      n++;
    }
    this.stats.labels = n;
  }

  private chrome(ctx: CanvasRenderingContext2D, W: number, h: number, u: number) {
    const c = W / 2;
    if (!this.rim || this.rimW !== W) {
      this.rim = ctx.createRadialGradient(c, c, c * 0.72, c, c, c); this.rimW = W;
      this.rim.addColorStop(0, "rgba(0,0,0,0)"); this.rim.addColorStop(1, "rgba(0,0,0,.38)");
    }
    ctx.fillStyle = this.rim; ctx.fillRect(0, 0, W, W);
    ctx.save(); ctx.translate(c, c);
    ctx.beginPath(); ctx.moveTo(0, -9 * u); ctx.lineTo(7 * u, 7 * u); ctx.lineTo(0, 3.2 * u); ctx.lineTo(-7 * u, 7 * u); ctx.closePath();
    ctx.lineJoin = "round"; ctx.lineWidth = 3 * u; ctx.strokeStyle = "#11161b"; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.fill();
    // north badge rides the rim (map rotates by h, so north sits at angle -h from straight up)
    const nr = c - 9 * u, nx = Math.sin(h) * nr, ny = -Math.cos(h) * nr;
    ctx.beginPath(); ctx.arc(nx, ny, 7.5 * u, 0, 6.2832); ctx.fillStyle = "#11161bdd"; ctx.fill();
    ctx.lineWidth = 1.4 * u; ctx.strokeStyle = "#ffd23f"; ctx.stroke();
    ctx.font = `900 ${Math.round(9 * u)}px system-ui,sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffd23f"; ctx.fillText("N", nx, ny + 0.5 * u);
    ctx.restore();
  }
}
