// Spaans Lagoen (Spanish Lagoon), the mangrove inlet between Balashi and Pos Chikito. Off with ?spaans=0.
// A's terrain is dry sand along the whole inlet: the OSM water area (way 98064356, ~99,000 m2) is not
// drawn, and neither are the mangroves that line it. Satellite and drone references show a narrow
// dark teal channel. It runs from the sea, under the Balashi road bridge and the Route 1 bridges, then
// winds north-east inside a dense, dark green mangrove ribbon to open ponds at its head.
// Rebuilt in code from OSM geometry; images are reference only. 2 draw calls (one water sheet and one
// InstancedMesh of mangrove canopy clumps), built once when the area's terrain has streamed in,
// with no per-frame work. Low gets fewer clumps. This stays clear of the Balashi gold-mill ruins and
// Frenchman's Pass road (other open PRs) and of the mouth's quays.
import {
  BufferGeometry, Color, Float32BufferAttribute, IcosahedronGeometry, InstancedMesh, Matrix4, Mesh,
  MeshLambertMaterial, Quaternion, ShapeUtils, Vector2, Vector3, Euler,
} from "three";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// OSM way 98064356 "Spaans Lagoen" (natural=water), game metres, simplified to 1.2 m
const WATER: P[] = [[-599.1,5104.8],[-619.5,5087.6],[-645.8,5111.1],[-652.0,5112.5],[-656.2,5119.7],[-664.6,5127.5],[-664.2,5130.4],[-671.7,5142.9],[-675.8,5148.0],[-694.5,5161.9],[-701.2,5174.2],[-713.8,5180.2],[-725.2,5190.4],[-730.9,5202.2],[-737.9,5209.7],[-744.5,5224.7],[-751.1,5254.8],[-750.4,5267.8],[-753.5,5273.0],[-753.1,5280.4],[-755.9,5289.7],[-753.2,5296.0],[-756.7,5307.5],[-755.6,5321.5],[-762.0,5322.4],[-758.8,5328.9],[-758.8,5339.1],[-754.3,5348.5],[-751.8,5368.6],[-754.7,5369.8],[-753.3,5376.0],[-748.9,5383.8],[-742.6,5403.4],[-741.9,5414.7],[-739.0,5420.8],[-739.6,5426.7],[-737.5,5431.6],[-741.2,5441.6],[-741.7,5448.5],[-732.3,5466.1],[-733.7,5472.3],[-731.8,5495.9],[-736.1,5511.7],[-732.1,5524.2],[-732.0,5538.1],[-733.5,5541.7],[-662.0,5589.3],[-603.5,5653.7],[-606.0,5646.0],[-613.2,5637.5],[-614.2,5632.8],[-609.7,5618.1],[-609.7,5612.2],[-613.8,5602.0],[-601.7,5507.9],[-601.1,5482.7],[-605.0,5472.7],[-601.2,5453.1],[-615.2,5416.3],[-614.9,5384.8],[-619.9,5368.1],[-615.7,5335.6],[-617.0,5321.9],[-613.6,5317.3],[-620.6,5300.0],[-627.3,5289.7],[-629.3,5273.3],[-628.3,5261.8],[-620.8,5252.2],[-619.6,5246.2],[-608.9,5230.9],[-597.6,5207.9],[-577.6,5179.3],[-567.2,5153.7],[-558.4,5146.4],[-555.1,5146.0],[-555.6,5136.2],[-552.9,5132.3],[-535.3,5133.9],[-524.8,5141.3],[-516.1,5135.2],[-496.0,5092.4],[-487.3,5080.0],[-470.8,5063.7],[-464.3,5052.3],[-465.2,5023.1],[-460.0,5013.0],[-446.0,4998.9],[-439.8,4995.7],[-422.2,4995.7],[-407.0,5005.1],[-402.1,5005.1],[-387.3,4988.9],[-354.7,4968.5],[-339.3,4948.9],[-331.6,4943.2],[-319.7,4923.1],[-314.0,4902.4],[-311.4,4873.3],[-306.0,4858.5],[-308.5,4852.9],[-303.1,4832.8],[-305.3,4812.7],[-299.5,4781.7],[-299.0,4769.8],[-285.2,4738.2],[-282.3,4717.1],[-272.5,4707.6],[-273.5,4697.7],[-266.9,4689.3],[-263.2,4687.4],[-256.4,4675.4],[-247.0,4671.1],[-244.2,4664.1],[-238.7,4657.8],[-230.1,4658.0],[-226.4,4644.8],[-216.9,4642.7],[-213.0,4632.1],[-204.6,4625.7],[-191.4,4622.8],[-176.0,4597.0],[-184.1,4577.1],[-181.6,4564.9],[-190.4,4538.7],[-201.0,4526.4],[-202.3,4521.9],[-199.9,4503.8],[-204.5,4489.5],[-203.4,4482.9],[-192.8,4464.0],[-180.1,4455.1],[-166.2,4437.5],[-156.6,4434.7],[-149.2,4427.7],[-140.9,4426.4],[-131.3,4427.7],[-126.6,4422.7],[-125.0,4416.5],[-131.8,4410.3],[-155.9,4403.7],[-162.8,4405.2],[-175.2,4412.5],[-191.1,4418.6],[-199.7,4416.5],[-209.2,4410.6],[-226.5,4410.6],[-250.3,4418.4],[-267.0,4415.8],[-267.2,4421.7],[-265.3,4424.3],[-256.5,4427.6],[-244.7,4441.9],[-241.9,4450.2],[-242.1,4462.5],[-239.7,4470.2],[-226.6,4499.2],[-214.2,4516.8],[-215.1,4528.3],[-210.1,4533.8],[-209.3,4540.1],[-223.6,4557.3],[-214.9,4564.0],[-205.5,4580.7],[-210.2,4595.6],[-236.8,4620.0],[-243.3,4623.1],[-255.6,4620.2],[-263.5,4626.7],[-270.1,4654.6],[-281.4,4665.5],[-284.8,4678.5],[-299.2,4696.4],[-306.3,4701.9],[-306.2,4713.7],[-309.5,4718.8],[-315.7,4739.3],[-319.1,4743.1],[-328.6,4744.7],[-332.6,4749.1],[-331.1,4755.6],[-321.6,4770.5],[-324.4,4780.2],[-322.1,4793.2],[-327.8,4804.8],[-351.1,4818.1],[-357.8,4857.5],[-356.6,4873.6],[-345.9,4888.0],[-348.3,4902.6],[-367.2,4930.9],[-394.9,4955.4],[-414.0,4965.5],[-435.8,4967.5],[-450.6,4983.4],[-458.3,4987.5],[-477.7,5005.3],[-484.8,5006.2],[-488.5,5004.0],[-492.4,5004.8],[-503.2,5002.3],[-509.6,5005.0],[-514.6,5004.0],[-535.2,5018.1],[-552.4,5032.6],[-573.1,5045.8],[-579.2,5057.7],[-596.7,5066.4],[-599.8,5082.0],[-588.2,5093.8],[-599.1,5104.8]];
// OSM road/bridge segments (x1,z1,x2,z2) that cross or skirt the inlet: Route 1 bridges, Balashi road
const ROADS: number[][] = [[-478.7,4984.5,-442.6,5022.9],[-480.7,4934.9,-462.1,4954.6],[-454.5,4947.3,-472.3,4927.7],[-381.8,5025.9,-390.7,5016.9],[-390.7,5016.9,-451.9,4950.1],[-451.9,4950.1,-454.5,4947.3],[-462.1,4954.6,-398.7,5022.9],[-476.6,4979.9,-469.1,4987.9],[-469.1,4987.9,-438.2,5019.3],[-505.8,4948.7,-476.6,4979.9]];
function roadDist(x: number, z: number) {
  let m = 1e9;
  for (const [ax, az, bx, bz] of ROADS) {
    const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
    const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
    m = Math.min(m, Math.hypot(x - ax - t * dx, z - az - t * dz));
  }
  return m;
}
const MANGROVE_SOUTH_Z = 5005; // no mangroves south of the Balashi road bridge (open mouth, quays, boats)
function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i], [xj, zj] = p[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class SpaansLagoen {
  stats = { built: false, tris: 0, clumps: 0, ms: 0 };
  water: Mesh | null = null; trees: InstancedMesh | null = null;
  private timer = 0;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tryBuild(), 1500);
  }

  /** Build once every region the inlet touches has its height tile (heights are then final). */
  private tryBuild() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const need = new Set<string>();
    for (const [x, z] of WATER) need.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
    let ok = 0;
    for (const r of W.regions.values()) if (r.H && need.has(`${r.rx},${r.rz}`)) ok++;
    if (ok < need.size) return;
    window.clearInterval(this.timer);
    const low = (this.g.real as unknown as { q?: { name?: string } })?.q?.name === "low";
    const t0 = performance.now();
    this.water = this.buildWater(W);
    this.trees = this.buildMangroves(W, low);
    this.g.scene.add(this.water, this.trees);
    this.stats.built = true; this.stats.ms = Math.round(performance.now() - t0);
  }

  private buildWater(W: World): Mesh {
    const contour = WATER.map(([x, z]) => new Vector2(x, z));
    const tri = ShapeUtils.triangulateShape(contour, []);
    // split every triangle into 4 twice so the sheet follows the coarse terrain across the channel
    let tris: number[][][] = tri.map((t) => t.map((i) => WATER[i]));
    for (let pass = 0; pass < 2; pass++) {
      const next: number[][][] = [];
      for (const [a, b, c] of tris) {
        const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2], ca = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
        next.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
      }
      tris = next;
    }
    const pos: number[] = [], col: number[] = [], nrm: number[] = [];
    const deep = new Color(0x0f4f4c), shallow = new Color(0x1d6a5f), c = new Color();
    for (const t of tris) for (const [x, z] of t) {
      // terrain under the inlet is coarse SRTM: sit just above it (and never below sea level)
      const h = W.heightAt(x, z), y = Math.max(0.05, (Number.isFinite(h) ? h : 0) + 0.35);
      c.copy(deep).lerp(shallow, 0.4 + 0.2 * hash(Math.round(x / 15), Math.round(z / 15)));
      pos.push(x, y, z); col.push(c.r, c.g, c.b); nrm.push(0, 1, 0);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 3));
    geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
    geo.computeBoundingSphere();
    // upward winding regardless of contour order
    const p = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < p.length; i += 9) {
      const cr = (p[i + 3] - p[i]) * (p[i + 8] - p[i + 2]) - (p[i + 5] - p[i + 2]) * (p[i + 6] - p[i]);
      if (cr > 0) for (let k = 0; k < 3; k++) { const t = p[i + 3 + k]; p[i + 3 + k] = p[i + 6 + k]; p[i + 6 + k] = t; }
    }
    const mat = new MeshLambertMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const base = new Color(0xffffff), night = new Color(0x2a3550);
    const m = new Mesh(geo, mat); m.name = "aw:spaans:water"; m.receiveShadow = false;
    m.onBeforeRender = () => { mat.color.copy(base).lerp(night, uNight.value * 0.6); };
    this.stats.tris = p.length / 9;
    return m;
  }

  private buildMangroves(W: World, low: boolean): InstancedMesh {
    const spots: number[][] = [];
    const step = low ? 6.5 : 4.5;
    // the ribbon is 30-60 m deep along the middle reach: four staggered rows on the land side
    const ROWS = low ? [2, 9, 17] : [2, 7, 13, 20];
    // two staggered rows hugging each bank, just outside the water edge (mangroves grow in the water margin)
    const n = WATER.length;
    for (let i = 0; i < n; i++) {
      const a = WATER[i], b = WATER[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 0.01) continue;
      const nx = (b[1] - a[1]) / L, nz = -(b[0] - a[0]) / L;
      for (let s = 0; s < L; s += step) {
        const t = s / L, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
        if (z > MANGROVE_SOUTH_Z) continue;
        for (const row of ROWS) {
          const off = row + hash(x, z + row) * 3;
          for (const sg of [1, -1]) { // whichever side is land, the other is water: keep both, the water side is the fringe
            const px = x + nx * off * sg, pz = z + nz * off * sg;
            if (row > 3 && inside(WATER, px, pz)) continue; // only a thin fringe stands in the water
            if (roadDist(px, pz) < 10) continue; // keep bridges / roads clear
            spots.push([px, pz, 3 + hash(px, pz) * 2]);
          }
        }
      }
    }
    const geo = new IcosahedronGeometry(1, low ? 0 : 1);
    const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const im = new InstancedMesh(geo, mat, spots.length); im.name = "aw:spaans:mangroves"; im.castShadow = false; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tones = [0x1b4a22, 0x22552a, 0x2c5e27, 0x1e4626, 0x355f2c]; // glossy dark mangrove greens
    spots.forEach(([x, z, r], i) => {
      const h = W.heightAt(x, z), y = Math.max(0, Number.isFinite(h) ? h : 0);
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * 1.25, r * 0.85, r * 1.25); p.set(x, y + r * 0.85 + 0.4, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tones[Math.floor(hash(x * 2, z * 2) * tones.length) % tones.length]));
    });
    const dim = new Color(0x4a5a70);
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere(); this.stats.clumps = spots.length;
    return im;
  }
}
