// Comandeurs Bay Key (Commandeursbaai, Savaneta) accuracy pass. Off with ?savkey=0.
// A draws the barrier key off Savaneta as a bare tan sand strip in one even turquoise sea, with nothing
// growing on it and no surf on the reef. Satellite imagery and photos show a low coral-rubble key with
// dark mangrove and scrub clumps along it, a pale reef flat just seaward of it, a broken line of white
// breakers along its whole outer edge and across the gap to the east key, and the water dropping to dark
// blue beyond the reef. The calm lagoon inside the key, the Savaneta waterfront, its piers and the marine
// base are left alone (other PRs own them); nothing here reaches north of the key's lagoon shore.
// Geometry is OSM (islets 97566695 / 97566879, small islet 97566747) rebuilt in code, vegetation cells traced
// from imagery; photos are reference only. 3 draw calls: one vertex-coloured reef sheet, one foam ribbon and
// one InstancedMesh of mangrove clumps. Built once when the key's height regions have streamed in, no per-frame
// work beyond a colour/opacity lerp when drawn.
import {
  BufferGeometry, Color, Euler, Float32BufferAttribute, IcosahedronGeometry, InstancedMesh, Matrix4, Mesh,
  MeshBasicMaterial, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// game metres
const KEY: P[][] = [ // OSM natural=coastline place=islet 97566695 (main key) and 97566879 (east key), 1 m simplified
  [[2502.4,8397.5],[2501.4,8403.9],[2504.0,8407.9],[2515.5,8413.9],[2531.7,8426.2],[2550.2,8434.0],[2588.3,8463.7],[2611.8,8477.4],[2662.9,8501.4],[2682.6,8507.4],[2711.2,8527.7],[2717.5,8535.5],[2741.2,8549.8],[2818.1,8578.4],[2896.9,8600.6],[2944.7,8624.9],[2963.9,8636.5],[2974.6,8650.9],[2982.3,8656.3],[3012.2,8666.1],[3023.3,8682.3],[3034.0,8690.4],[3083.2,8721.6],[3130.7,8747.0],[3141.0,8749.2],[3148.4,8753.4],[3160.9,8766.3],[3174.3,8771.2],[3228.2,8779.9],[3251.7,8789.5],[3280.8,8798.4],[3337.1,8820.8],[3376.9,8829.7],[3396.1,8836.2],[3410.9,8838.0],[3425.9,8838.1],[3428.5,8836.6],[3428.0,8833.9],[3362.6,8815.4],[3352.4,8816.6],[3342.7,8813.9],[3275.7,8783.4],[3264.7,8780.7],[3247.1,8770.6],[3228.9,8772.4],[3219.7,8769.2],[3209.9,8759.4],[3178.2,8737.3],[3167.9,8726.9],[3160.9,8712.1],[3155.6,8708.7],[3126.0,8705.0],[3098.6,8708.8],[3088.4,8700.7],[3072.8,8694.0],[3060.4,8681.0],[3051.1,8679.3],[3037.4,8673.6],[3034.4,8667.1],[3020.1,8655.2],[3017.1,8649.9],[3005.8,8638.8],[2999.9,8618.7],[3001.4,8613.7],[2998.2,8612.1],[2994.9,8615.0],[2989.2,8613.0],[2982.1,8607.8],[2974.1,8595.3],[2968.8,8592.5],[2961.4,8592.2],[2954.0,8581.2],[2948.2,8578.4],[2943.5,8578.1],[2917.0,8597.4],[2909.6,8597.4],[2902.8,8594.4],[2898.2,8588.5],[2871.0,8574.1],[2862.7,8572.6],[2857.4,8574.7],[2851.9,8574.7],[2843.5,8571.1],[2821.7,8567.5],[2757.2,8536.9],[2727.4,8526.2],[2701.7,8502.8],[2671.0,8485.4],[2643.6,8460.3],[2633.4,8453.6],[2629.5,8455.5],[2628.5,8457.7],[2620.7,8458.0],[2620.2,8460.8],[2628.3,8463.9],[2639.6,8477.2],[2636.9,8479.7],[2626.4,8477.2],[2590.3,8440.7],[2579.0,8430.9],[2570.2,8425.9],[2563.0,8418.7],[2555.6,8406.3],[2539.8,8401.5],[2513.8,8390.2],[2510.8,8390.3]],
  [[3517.8,8853.0],[3728.1,8929.1],[3736.9,8939.5],[3755.8,8954.2],[3794.7,8967.1],[3843.4,8988.0],[3865.3,8990.9],[3870.2,8989.3],[3894.6,8996.5],[3903.8,8997.8],[3908.6,8997.7],[3918.6,8990.6],[3918.9,8982.6],[3886.3,8970.4],[3866.7,8966.4],[3853.0,8957.2],[3835.2,8953.9],[3790.7,8940.9],[3743.7,8920.1],[3701.7,8911.9],[3683.8,8904.7],[3668.4,8901.1],[3659.8,8895.5],[3626.4,8883.8],[3618.5,8875.7],[3606.3,8870.9],[3596.0,8870.6],[3538.0,8851.1]],
];
// seaward shore of both keys (2 m simplified), joined across the gap, plus the reef run from the small islet
// (OSM 97566747) to the west tip of the key, where imagery shows the same break line
const REEF: P[] = [[2318.0,8331.0],[2372.0,8350.0],[2440.0,8372.0],[2502.4,8397.5],[2504.0,8407.9],[2531.7,8426.2],[2550.2,8434.0],[2588.3,8463.7],[2662.9,8501.4],[2682.6,8507.4],[2711.2,8527.7],[2717.5,8535.5],[2741.2,8549.8],[2818.1,8578.4],[2896.9,8600.6],[2944.7,8624.9],[2963.9,8636.5],[2982.3,8656.3],[3012.2,8666.1],[3023.3,8682.3],[3034.0,8690.4],[3083.2,8721.6],[3130.7,8747.0],[3148.4,8753.4],[3160.9,8766.3],[3174.3,8771.2],[3228.2,8779.9],[3337.1,8820.8],[3396.1,8836.2],[3428.5,8836.6],[3517.8,8853.0],[3728.1,8929.1],[3755.8,8954.2],[3843.4,8988.0],[3870.2,8989.3],[3903.8,8997.8],[3918.6,8990.6]];
// vegetated 5 m cells on the keys (x = 2500 + 5i, z = 8380 + 5j), traced from Esri World Imagery z18: the dark
// mangrove and scrub clumps that stand on the coral-rubble key. Takes in OSM landuse=grass 97431535 / 97431558.
const VEG = [0,3,0,4,1,2,1,3,1,4,2,3,2,4,3,3,3,4,3,5,4,4,4,5,4,6,5,5,5,6,6,6,7,6,7,7,10,8,10,9,11,9,11,10,12,10,12,11,13,10,13,11,14,11,14,12,16,15,25,16,26,16,26,17,27,16,30,20,30,21,31,20,31,21,31,22,32,21,36,23,40,26,40,27,44,30,44,31,45,30,45,31,46,30,46,31,46,32,47,30,47,31,47,32,47,33,48,31,48,32,48,33,49,32,49,33,50,32,50,33,50,34,51,31,51,32,51,33,78,41,79,42,81,43,82,43,82,44,83,43,84,43,85,42,85,43,86,41,86,42,86,43,86,45,87,40,87,41,87,42,87,44,87,45,88,40,88,41,88,42,88,43,88,44,88,45,89,40,89,41,89,42,89,43,89,44,89,45,89,46,89,47,90,40,90,41,90,42,90,43,90,44,90,45,90,46,90,47,90,48,91,41,91,42,91,43,91,44,91,45,91,46,91,47,91,48,92,42,92,43,92,44,92,45,92,46,92,47,92,48,93,42,93,43,93,44,93,45,93,46,93,47,93,48,93,49,94,43,94,44,94,45,94,46,94,47,94,48,94,49,95,44,95,45,95,46,95,47,95,48,95,49,95,50,96,46,96,47,96,48,96,49,96,50,97,46,97,47,97,48,100,50,100,52,101,52,101,54,101,55,102,54,102,55,102,56,103,55,103,56,103,57,103,58,104,55,104,56,104,57,104,58,104,59,105,56,105,57,105,58,105,59,105,60,106,57,106,58,106,59,106,60,106,61,107,60,107,61,108,59,108,60,108,61,111,61,111,62,111,63,112,61,112,62,112,63,112,65,114,66,115,67,119,66,120,66,120,67,121,65,121,66,121,67,121,68,121,70,122,65,122,66,122,67,122,68,122,69,122,70,123,65,123,66,123,67,123,68,123,69,123,70,124,65,124,66,124,67,124,68,124,69,124,70,125,65,125,66,125,67,125,68,125,69,125,70,126,65,126,66,126,67,126,68,126,69,126,70,127,65,127,66,127,67,127,68,127,69,127,70,127,71,128,65,128,66,128,67,128,68,128,69,128,70,128,71,128,72,129,65,129,66,129,67,129,68,129,69,129,70,129,71,129,72,129,74,130,66,130,67,130,68,130,69,130,70,130,71,130,72,130,73,130,74,131,66,131,67,131,68,131,69,131,70,131,71,131,72,131,73,131,74,131,75,132,67,132,69,132,70,132,71,132,72,132,73,132,74,132,75,132,76,133,69,133,71,133,72,133,73,133,74,133,75,133,76,134,70,134,71,134,72,134,73,134,74,134,75,134,76,135,71,135,72,135,73,135,74,136,72,136,73,136,74,136,76,137,73,139,74,139,75,139,76,139,77,140,77,140,78,141,78,142,78,143,79,163,85,163,86,164,85,165,85,165,86,166,86,169,87,170,87,217,99,223,100,224,100,243,107,244,107,244,108,245,108,246,108,246,109,246,110,247,108,247,109,247,110,248,108,248,109,248,110,249,109,249,110,249,111,250,110,250,111,250,112,251,110,251,111,251,112,251,114,252,110,252,111,252,112,252,113,253,111,253,112,253,113,254,112,254,113,254,114,255,112,255,113,255,114,256,112,256,113,256,114,257,112,257,113,257,114,257,115,257,116,258,112,258,113,258,114,258,115,258,116,259,113,259,114,259,115,259,116,259,117,260,114,260,115,260,116,260,117,261,114,261,115,261,116,261,117,261,118,262,114,262,115,262,116,262,117,262,118,263,114,263,115,263,116,263,117,263,118,264,115,264,116,264,117,264,118,264,119,265,115,265,116,265,117,265,118,265,119,266,115,266,116,266,117,266,118,266,119,267,115,267,116,267,117,267,118,267,119,268,115,268,116,268,117,268,118,268,119,269,115,269,118,269,119,270,117,270,118,270,119,270,120,271,117,271,118,271,119,271,120,272,117,272,118,272,119,272,120,273,118,273,119,273,120,273,121,274,118,274,119,274,120,274,121,275,118,275,119,275,120,275,121,276,118,276,119,276,120,276,121,277,119,277,120,277,121,277,122,278,120,278,121,278,122,279,120,279,121,279,122,280,119,280,120,280,121,281,120,282,120,283,120];
const BLD: number[][] = [[2983, 8628, 3002, 8649], [3044, 8677, 3060, 8691], [2633, 8455, 2654, 8477]]; // A's buildings on the key (huts and the pier shed), padded 3 m
const WATER_Y = 0.05;
const FLAT = 28; // reef flat width seaward of the break line
const DEEP = 150; // dark drop-off tint fades out this far seaward

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i], [xj, zj] = p[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
/** Distance to the reef line, signed: + on the sea side (right of the W->E line), - on the lagoon side. */
function reefSide(x: number, z: number) {
  let m = 1e9, side = 1;
  for (let i = 1; i < REEF.length; i++) {
    const [ax, az] = REEF[i - 1], [bx, bz] = REEF[i], d = segDist(x, z, ax, az, bx, bz);
    if (d < m) { m = d; side = (bx - ax) * (z - az) - (bz - az) * (x - ax) > 0 ? 1 : -1; }
  }
  return m * side;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class SavanetaKey {
  stats = { built: false, reefQuads: 0, foamQuads: 0, clumps: 0, ms: 0 };
  private timer = 0;
  private seaDone = false;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  private key(W: World, x: number, z: number) { return `${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`; }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const t0 = performance.now();
    const low = (this.g.real as unknown as { q?: { name?: string } })?.q?.name === "low";
    if (!this.seaDone) { this.g.scene.add(this.reef(low), this.foam()); this.seaDone = true; } // flat, needs no heights
    const ready = new Set<string>();
    for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
    const keys = new Set<string>();
    for (const k of KEY) for (const [x, z] of k) keys.add(this.key(W, x, z));
    if ([...keys].every((k) => ready.has(k))) {
      const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
      this.g.scene.add(this.mangroves(h, low));
      window.clearInterval(this.timer); this.stats.built = true;
    }
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Pale reef flat seaward of the break line, then the darker drop-off fading back into A's sea. */
  private reef(low: boolean): Mesh {
    const S = low ? 8 : 6;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of REEF) { x0 = Math.min(x0, x - DEEP); x1 = Math.max(x1, x + DEEP); z0 = Math.min(z0, z - DEEP); z1 = Math.max(z1, z + DEEP); }
    x0 = Math.floor(x0 / S) * S; z0 = Math.floor(z0 / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 1, nz = Math.ceil((z1 - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const flatC = new Color(0x74ccb8), coralC = new Color(0x76845a), deepC = new Color(0x1c5d86), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, d = reefSide(x, z);
      let a: number;
      if (d < FLAT) { // reef flat: paler, with brown-green coral heads; fades out quickly on the lagoon side
        const t = Math.max(0, d) / FLAT;
        c.copy(flatC).lerp(deepC, t * t * 0.5); if (hash(x * 1.7, z * 1.3) > 0.6) c.lerp(coralC, 0.4 * (1 - t));
        a = d < 0 ? Math.max(0, 0.6 * (1 + d / 10)) : 0.6 - 0.1 * t;
      } else { // drop-off: dark blue right past the flat, back to A's colour by DEEP
        const t = (d - FLAT) / (DEEP - FLAT);
        c.copy(deepC); a = 0.5 * Math.max(0, 1 - t) * (0.85 + 0.15 * hash(x, z));
      }
      a *= this.alongEnds(x, z); // open ends: blend into A's water past both ends of the line
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S, d = reefSide(cx, cz);
      if (d < -10 || d > DEEP) continue;
      if (KEY.some((k) => inside(k, cx, cz))) continue; // never over the key itself
      const a = vert(i, j), b = vert(i + 1, j), e = vert(i, j + 1), f = vert(i + 1, j + 1);
      idx.push(a, e, b, b, e, f); this.stats.reefQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(geo, mat); m.name = "aw:savkey:reef";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = 1 - 0.55 * k; };
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false; // after A's water (renderOrder 2)
    return m;
  }

  /** 0..1 fade past the two ends of the reef line, measured along the line direction. */
  private alongEnds(x: number, z: number) {
    const [wx, wz] = REEF[0], [ex, ez] = REEF[REEF.length - 1], L = Math.hypot(ex - wx, ez - wz);
    const ux = (ex - wx) / L, uz = (ez - wz) / L, t = (x - wx) * ux + (z - wz) * uz;
    const out = t < 0 ? -t : t > L ? t - L : 0;
    return Math.max(0, 1 - out / 60);
  }

  /** Broken white breaker line just seaward of the key: one ribbon, dashed by vertex alpha. */
  private foam(): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const step = 3;
    let run = 0;
    for (let i = 1; i < REEF.length; i++) {
      const [ax, az] = REEF[i - 1], [bx, bz] = REEF[i], L = Math.hypot(bx - ax, bz - az);
      if (L < 0.5) continue;
      const ux = (bx - ax) / L, uz = (bz - az) / L, nx = -uz, nz = ux; // seaward normal (lagoon is on the left)
      const n = Math.max(1, Math.ceil(L / step));
      for (let k = 0; k <= n; k++) {
        const t = (k / n) * L, s0 = run + t, w = 4.5 + hash(i * 31 + k, 7) * 4, off = 9 + Math.sin(s0 * 0.04) * 3;
        const x = ax + ux * t + nx * off, z = az + uz * t + nz * off;
        // dashes: breakers come and go along the reef, never one solid band
        const s = Math.sin(s0 * 0.07 + Math.sin(s0 * 0.019) * 3.5) * 0.5 + 0.5, a = Math.min(1, Math.max(0, s - 0.1) * 2) * (0.7 + 0.3 * hash(k, i));
        const base = pos.length / 3;
        pos.push(x - nx * w * 0.3, WATER_Y + 0.08, z - nz * w * 0.3, x + nx * w, WATER_Y + 0.08, z + nz * w);
        col.push(1, 1, 1, a, 1, 1, 1, a * 0.4);
        if (k > 0) { idx.push(base - 2, base - 1, base, base - 1, base + 1, base); this.stats.foamQuads++; } // CCW from above
      }
      run += L;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:savkey:surf";
    const day = new Color(0xf4fbff), night = new Color(0x2a3a4c);
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value); mat.opacity = 0.85 + 0.15 * Math.sin(uTime.value * 0.8); };
    m.renderOrder = 4; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  /** Mangrove and scrub clumps on the traced cells: one InstancedMesh of flat-shaded blobs. */
  private mangroves(h: (x: number, z: number) => number, low: boolean): InstancedMesh {
    const spots: number[][] = [];
    for (let i = 0; i < VEG.length; i += 2) {
      const cx = 2500 + VEG[i] * 5 + 2.5, cz = 8380 + VEG[i + 1] * 5 + 2.5;
      const x = cx + (hash(cx, cz) - 0.5) * 3, z = cz + (hash(cz, cx) - 0.5) * 3;
      if (BLD.some(([x0, z0, x1, z1]) => x > x0 && x < x1 && z > z0 && z < z1)) continue;
      spots.push([x, z]);
    }
    const im = new InstancedMesh(new IcosahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), spots.length);
    im.name = "aw:savkey:mangroves"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tones = [0x1b4a22, 0x22552a, 0x2c5e27, 0x1e4626, 0x355f2c, 0x45603a];
    spots.forEach(([x, z], i) => {
      const r = 2.6 + hash(x * 3, z) * 1.4, ht = r * (0.55 + hash(z, x * 2) * 0.25), y = Math.max(0, h(x, z));
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * 1.15, ht, r); p.set(x, y + ht * 0.7 + 0.2, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tones[Math.floor(hash(x * 2, z * 2) * tones.length) % tones.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.clumps = spots.length;
    return im;
  }
}
