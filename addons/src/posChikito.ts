// Pos Chikito's two neighbourhood football fields. Off with ?poschi=0.
// A tints both OSM pitches a flat yellow and scatters palms, divi-divi, kadushi and shrubs across them.
// Satellite references show two open fields with nothing standing on them:
//  - the Pos Chikito field (OSM leisure=pitch 93789708) in the houses north of the Ina Oduber-Croes road:
//    packed light-brown dirt with worn chalk lines (halfway line and penalty boxes) and a goal at each end
//  - the Sabana Basora / Pos Chikito field by Rotonde Tromp (pitch 94175102, lit, with the dirt running
//    path round it, OSM leisure=track 725195153): dry, patchy grass with a goal at each end
// Rebuilt in code from OSM geometry; images are reference only. 2 draw calls: one terrain-following sheet
// for both fields with a small canvas atlas painted in code (surface, lines, path), and one merged mesh of
// white goal frames. Veg on the fields is skipped through A's __awVegHit hook. Built once the regions
// under the fields have heights, with no per-frame work. Low gets a 512 px atlas and coarser sheets.
import {
  BoxGeometry, BufferGeometry, CanvasTexture, Color, Float32BufferAttribute, LinearMipmapLinearFilter, Mesh,
  MeshLambertMaterial, SRGBColorSpace,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
type Field = {
  name: string;
  c: P[]; // 4 corners, game metres; c0-c1 and c2-c3 are the goal (short) ends
  pad: number; // sheet margin beyond the pitch outline, m
  clear: P[]; // veg-free area (OSM pitch or track outline)
  paint: (x: CanvasRenderingContext2D, L: number, W: number, lw: number, pad: number) => void;
  goalInset: number;
};

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };

// worn patches: soft ellipses in field metres, deterministic
function blotches(x: CanvasRenderingContext2D, L: number, W: number, n: number, cols: string[], seed: number, rMin: number, rMax: number) {
  for (let i = 0; i < n; i++) {
    const a = hash(seed + i, 1.7), b = hash(seed - i, 3.1), r = rMin + hash(i, seed) * (rMax - rMin);
    x.fillStyle = cols[i % cols.length];
    x.beginPath(); x.ellipse((a - 0.5) * L, (b - 0.5) * W, r, r * (0.5 + hash(seed, i) * 0.6), hash(i * 3, seed) * 3.14, 0, 6.283); x.fill();
  }
}

// FIFA-style markings, inset from the outline (worn chalk on dirt)
function lines(x: CanvasRenderingContext2D, L: number, W: number, lw: number, inset: number, col: string) {
  const l = L / 2 - inset, w = W / 2 - inset;
  x.save(); x.beginPath(); x.rect(-l - lw, -w - lw, 2 * (l + lw), 2 * (w + lw)); x.clip(); // corner arcs stay inside
  x.strokeStyle = col; x.fillStyle = col; x.lineWidth = lw;
  x.strokeRect(-l, -w, 2 * l, 2 * w);
  x.beginPath(); x.moveTo(0, -w); x.lineTo(0, w); x.stroke();
  x.beginPath(); x.arc(0, 0, 9.15, 0, 6.283); x.stroke();
  x.beginPath(); x.arc(0, 0, 0.3, 0, 6.283); x.fill();
  for (const s of [-1, 1]) {
    const g = s * l;
    x.strokeRect(Math.min(g, g - s * 16.5), -20.16, 16.5, 40.32);
    x.strokeRect(Math.min(g, g - s * 5.5), -9.16, 5.5, 18.32);
    x.beginPath(); x.arc(g - s * 11, 0, 0.25, 0, 6.283); x.fill();
    x.beginPath(); x.arc(g - s * 11, 0, 9.15, s > 0 ? Math.PI - 0.93 : -0.93, s > 0 ? Math.PI + 0.93 : 0.93); x.stroke();
    for (const t of [-1, 1]) { x.beginPath(); x.arc(g, t * w, 1, 0, 6.283); x.stroke(); }
  }
  x.restore();
}

const FIELDS: Field[] = [
  {
    // OSM way 93789708 (leisure=pitch, sport=soccer); the 2 m bevel at the east corner is squared off
    name: "Pos Chikito",
    c: [[1169.7, 6404.3], [1223.5, 6442.5], [1165.5, 6527.5], [1110.8, 6491.7]],
    pad: 1.5,
    clear: [[1169.7, 6404.3], [1221.4, 6437.8], [1224.7, 6440.8], [1222.6, 6444.1], [1165.5, 6527.5], [1110.8, 6491.7]],
    goalInset: 3,
    paint(x, L, W, lw, pad) {
      x.fillStyle = "#977f76"; x.fillRect(-L / 2 - pad, -W / 2 - pad, L + 2 * pad, W + 2 * pad); // margin blends into A's ground
      x.fillStyle = "#927c66"; x.fillRect(-L / 2, -W / 2, L, W);
      blotches(x, L, W, 140, ["rgba(118,96,74,0.20)", "rgba(170,148,120,0.20)", "rgba(110,94,72,0.16)"], 11, 1.5, 5);
      // bare, darker goalmouths and centre where play wears the dirt
      x.fillStyle = "rgba(100,80,60,0.35)";
      for (const s of [-1, 0, 1]) { x.beginPath(); x.ellipse(s * (L / 2 - 8), 0, s ? 7 : 9, s ? 9 : 7, 0, 0, 6.283); x.fill(); }
      lines(x, L, W, lw, 3, "rgba(230,225,212,0.7)");
    },
  },
  {
    // OSM way 94175102 (leisure=pitch, lit=yes) inside the running path, way 725195153 (leisure=track)
    name: "Sabana Basora",
    c: [[539.8, 5848.6], [512.2, 5905.1], [601.1, 5950.2], [629.7, 5891.9]],
    pad: 5,
    clear: [[633.6, 5894.3], [633.5, 5891.2], [632.4, 5888.4], [542.4, 5843.5], [538.9, 5843.5], [535.8, 5844.3], [506.7, 5904.8], [506.8, 5907.5], [508.1, 5910.0], [599.4, 5954.3], [601.7, 5954.3], [604.0, 5953.7]],
    goalInset: 2.5,
    paint(x, L, W, lw, pad) {
      x.fillStyle = "#977f76"; x.fillRect(-L / 2 - pad, -W / 2 - pad, L + 2 * pad, W + 2 * pad);
      // dirt running path just outside the pitch (the OSM track sits about 4 m out)
      x.strokeStyle = "#a8957f"; x.lineWidth = 2.4;
      x.strokeRect(-L / 2 - 3.6, -W / 2 - 3.6, L + 7.2, W + 7.2);
      x.fillStyle = "#867a5c"; x.fillRect(-L / 2, -W / 2, L, W); // dry grass
      blotches(x, L, W, 110, ["rgba(112,112,72,0.35)", "rgba(160,140,110,0.40)", "rgba(98,98,62,0.28)", "rgba(150,130,100,0.30)"], 47, 2, 10);
      x.fillStyle = "rgba(150,128,100,0.55)";
      for (const s of [-1, 1]) { x.beginPath(); x.ellipse(s * (L / 2 - 6), 0, 6, 8, 0, 0, 6.283); x.fill(); }
    },
  },
];

function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i], [xj, zj] = p[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
// distance to an outline, for a small veg-free margin round the fields
function edgeDist(p: P[], x: number, z: number) {
  let d = 1e9;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [ax, az] = p[j], [bx, bz] = p[i], dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
    const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
    d = Math.min(d, Math.hypot(x - ax - t * dx, z - az - t * dz));
  }
  return d;
}

type Frame = { cx: number; cz: number; ux: number; uz: number; vx: number; vz: number; L: number; W: number };
function frame(c: P[]): Frame {
  const cx = (c[0][0] + c[1][0] + c[2][0] + c[3][0]) / 4, cz = (c[0][1] + c[1][1] + c[2][1] + c[3][1]) / 4;
  let ux = c[2][0] - c[1][0] + c[3][0] - c[0][0], uz = c[2][1] - c[1][1] + c[3][1] - c[0][1];
  const n = Math.hypot(ux, uz); ux /= n; uz /= n;
  const L = (Math.hypot(c[2][0] - c[1][0], c[2][1] - c[1][1]) + Math.hypot(c[3][0] - c[0][0], c[3][1] - c[0][1])) / 2;
  const W = (Math.hypot(c[1][0] - c[0][0], c[1][1] - c[0][1]) + Math.hypot(c[3][0] - c[2][0], c[3][1] - c[2][1])) / 2;
  return { cx, cz, ux, uz, vx: -uz, vz: ux, L, W };
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class PosChikito {
  stats = { built: false, tris: 0, goals: 0, cleared: 0, ms: 0 };
  sheet: Mesh | null = null; goals: Mesh | null = null;
  private timer = 0;
  private frames = FIELDS.map((f) => frame(f.c));
  constructor(private g: AGame) {
    this.installVeg();
    this.timer = window.setInterval(() => this.tryBuild(), 1500);
  }

  /** A asks this hook for every palm (p), divi (d), kadushi (k), shrub (s) and rock (r) it places. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    const boxes = FIELDS.map((f) => {
      const xs = f.clear.map((p) => p[0]), zs = f.clear.map((p) => p[1]);
      return [Math.min(...xs) - 3, Math.max(...xs) + 3, Math.min(...zs) - 3, Math.max(...zs) + 3];
    });
    w.__awVegHit = (x, z, n) => {
      for (let i = 0; i < FIELDS.length; i++) {
        const b = boxes[i];
        if (x < b[0] || x > b[1] || z < b[2] || z > b[3]) continue;
        if (inside(FIELDS[i].clear, x, z) || edgeDist(FIELDS[i].clear, x, z) < 1.5) { this.stats.cleared++; return true; }
      }
      return prev ? prev(x, z, n) : false;
    };
  }

  private tryBuild() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const need = new Set<string>();
    for (const f of FIELDS) for (const [x, z] of f.clear) need.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
    let ok = 0;
    for (const r of W.regions.values()) if (r.H && need.has(`${r.rx},${r.rz}`)) ok++;
    if (ok < need.size) return;
    window.clearInterval(this.timer);
    const low = (this.g.real as unknown as { q?: { name?: string } })?.q?.name === "low";
    const t0 = performance.now();
    this.sheet = this.buildSheet(W, low);
    this.goals = this.buildGoals(W);
    this.g.scene.add(this.sheet, this.goals);
    this.stats.built = true; this.stats.ms = Math.round(performance.now() - t0);
  }

  private buildSheet(W: World, low: boolean): Mesh {
    const S = low ? 512 : 1024, half = S / 2, gap = 4;
    const cv = document.createElement("canvas"); cv.width = S; cv.height = S;
    const x = cv.getContext("2d")!;
    x.fillStyle = "#977f76"; x.fillRect(0, 0, S, S);
    const pos: number[] = [], uv: number[] = [], nrm: number[] = [], idx: number[] = [];
    FIELDS.forEach((f, i) => {
      const F = this.frames[i], hl = F.L / 2 + f.pad, hw = F.W / 2 + f.pad;
      // paint this field into its half of the atlas, in field metres (long axis along canvas x)
      const y0 = i * half + gap, hpx = half - 2 * gap, sx = S / (2 * hl), sy = hpx / (2 * hw);
      x.save(); x.beginPath(); x.rect(0, y0, S, hpx); x.clip();
      x.translate(S / 2, y0 + hpx / 2); x.scale(sx, sy);
      f.paint(x, F.L, F.W, Math.max(0.12, 1.4 / Math.min(sx, sy)), f.pad);
      x.restore();
      // terrain-following grid over the field and its margin
      const step = low ? 6 : 3, nu = Math.ceil((2 * hl) / step), nv = Math.ceil((2 * hw) / step), base = pos.length / 3;
      for (let b = 0; b <= nv; b++) for (let a = 0; a <= nu; a++) {
        const s = -hl + (2 * hl * a) / nu, t = -hw + (2 * hw * b) / nv;
        const px = F.cx + F.ux * s + F.vx * t, pz = F.cz + F.uz * s + F.vz * t, h = W.heightAt(px, pz);
        pos.push(px, (Number.isFinite(h) ? h : 0) + 0.14, pz);
        uv.push(a / nu, (y0 + (b / nv) * hpx) / S); nrm.push(0, 1, 0);
      }
      for (let b = 0; b < nv; b++) for (let a = 0; a < nu; a++) {
        const k = base + b * (nu + 1) + a;
        idx.push(k, k + nu + 1, k + 1, k + 1, k + nu + 1, k + nu + 2);
      }
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
    geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
    // upward winding regardless of the frame's handedness
    const p = pos, i0 = idx[0] * 3, i1 = idx[1] * 3, i2 = idx[2] * 3;
    const cr = (p[i1] - p[i0]) * (p[i2 + 2] - p[i0 + 2]) - (p[i1 + 2] - p[i0 + 2]) * (p[i2] - p[i0]);
    if (cr > 0) for (let k = 0; k < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
    geo.setIndex(idx); geo.computeBoundingSphere();
    const tex = new CanvasTexture(cv); tex.flipY = false; tex.colorSpace = SRGBColorSpace;
    tex.minFilter = LinearMipmapLinearFilter; tex.anisotropy = low ? 1 : 4;
    const mat = new MeshLambertMaterial({ map: tex, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const night = new Color(0x2a3550), white = new Color(0xffffff);
    const m = new Mesh(geo, mat); m.name = "aw:poschi:fields"; m.receiveShadow = !low;
    m.onBeforeRender = () => { mat.color.copy(white).lerp(night, uNight.value * 0.6); };
    this.stats.tris = idx.length / 3;
    return m;
  }

  /** Full-size goals (7.32 x 2.44 m) on each goal line: posts, crossbar, ground frame and back stays. */
  private buildGoals(W: World): Mesh {
    const parts: BufferGeometry[] = [];
    const add = (w: number, h: number, d: number, lx: number, ly: number, lz: number, F: Frame, gx: number, gz: number, gy: number, back: number, tilt = 0) => {
      const b = new BoxGeometry(w, h, d);
      if (tilt) b.rotateX(tilt);
      b.translate(lx, ly, lz);
      // local x along the goal line, local z away from the pitch
      const yaw = Math.atan2(F.ux * back, F.uz * back);
      b.rotateY(yaw); b.translate(gx, gy, gz);
      parts.push(b);
    };
    FIELDS.forEach((f, i) => {
      const F = this.frames[i];
      for (const s of [-1, 1]) {
        const off = s * (F.L / 2 - f.goalInset), gx = F.cx + F.ux * off, gz = F.cz + F.uz * off;
        const h = W.heightAt(gx, gz), gy = Number.isFinite(h) ? h : 0, bw = 0.12, D = 1.6;
        add(bw, 2.44, bw, -3.66, 1.22, 0, F, gx, gz, gy, s);
        add(bw, 2.44, bw, 3.66, 1.22, 0, F, gx, gz, gy, s);
        add(7.44, bw, bw, 0, 2.44, 0, F, gx, gz, gy, s);
        add(7.44, 0.06, 0.06, 0, 0.05, D, F, gx, gz, gy, s);
        for (const e of [-3.66, 3.66]) {
          add(0.06, 0.06, D, e, 0.05, D / 2, F, gx, gz, gy, s);
          add(0.06, 0.06, Math.hypot(D, 2.44), e, 1.22, D / 2, F, gx, gz, gy, s, Math.atan2(2.44, D));
        }
        this.stats.goals++;
      }
    });
    const geo = mergeGeometries(parts.map((b) => b.toNonIndexed()));
    parts.forEach((b) => b.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ color: 0xf2f2ee });
    const day = new Color(0xf2f2ee), night = new Color(0x3a4458);
    const m = new Mesh(geo, mat); m.name = "aw:poschi:goals"; m.castShadow = false;
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value * 0.7); };
    return m;
  }
}

