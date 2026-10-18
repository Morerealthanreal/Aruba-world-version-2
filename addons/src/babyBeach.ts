// Baby Beach (Seroe Colorado) accuracy pass. Off with ?babybeach=0.
// A builds the bay from the OSM coastline, but the terrain leaves the lagoon about 3 m deep, the same
// turquoise as the open sea, and the rock islet that closes the south side of the lagoon (with the
// low rock ledge running east from it) sits about 2.7 m under water. So the lagoon read as open sea.
// Satellite and drone references show a shallow, very pale aqua lagoon over white sand with darker
// sea-grass streaks, closed by a brown rock breakwater/islet. The only opening is the deep channel at
// the south-west, between the western sand spit and the islet.
// The geometry is OSM (coastline ways 98105159, 1108792165 + 43469853 for the islet, reef 1060035567),
// rebuilt in code. Images are reference only and nothing is textured from them.
// Cost is 2 draw calls (one vertex-coloured lagoon sheet and one InstancedMesh of boulders) built
// once at load, with no per-frame work and no lights. Low gets fewer boulders.
import {
  BufferGeometry, Color, DynamicDrawUsage, Float32BufferAttribute, IcosahedronGeometry, InstancedMesh,
  Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3, Euler,
} from "three";
import type { AGame } from "./env";

type P = number[];
// lagoon shore, west spit tip -> round the bay -> east point (OSM 98105159, simplified to 1 m)
const SHORE: P[] = [[9560,11935],[9561,11928],[9558,11919],[9551,11919],[9540,11922],[9532,11922],[9528,11919],[9523,11919],[9509,11929],[9505,11928],[9502,11925],[9498,11917],[9494,11915],[9486,11895],[9480,11867],[9465,11842],[9453,11833],[9447,11824],[9443,11807],[9444,11800],[9454,11780],[9467,11763],[9487,11742],[9514,11722],[9547,11704],[9558,11702],[9596,11687],[9623,11686],[9634,11688],[9668,11702],[9684,11702],[9703,11695],[9716,11693],[9738,11695],[9751,11698],[9779,11714],[9799,11734],[9821,11767],[9848,11822],[9849,11835],[9847,11855],[9842,11869],[9839,11874],[9829,11882]];
// rock islet ring: north (lagoon) side east -> west, then the south side back east
const ISLET: P[] = [[9786,11890],[9780,11886],[9770,11884],[9762,11883],[9740,11893],[9718,11898],[9714,11895],[9708,11894],[9704,11898],[9698,11907],[9693,11914],[9690,11923],[9695,11927],[9704,11926],[9706,11924],[9707,11920],[9710,11917],[9721,11912],[9730,11903],[9733,11902],[9736,11902],[9736,11910],[9740,11911],[9744,11910],[9746,11908],[9756,11906],[9757,11904],[9766,11905],[9768,11902],[9772,11904],[9789,11902],[9790,11898],[9790,11894],[9786,11890]];
// north edge of the rock ledge east of the islet (OSM reef 1060035567)
const LEDGE: P[] = [[9792,11927],[9817,11921],[9840,11918],[9856,11914],[9876,11917],[9901,11917],[9923,11914],[9942,11912],[9988,11910],[10003,11909]];
const LAGOON: P[] = [...SHORE, ...ISLET.slice(0, 10)]; // closing edge (last -> first) is the channel
const MOUTH = [LAGOON[LAGOON.length - 1], LAGOON[0]];
const WATER_Y = 0.05;

function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i], [xj, zj] = p[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function segDist(x: number, z: number, a: P, b: P) {
  const dx = b[0] - a[0], dz = b[1] - a[1], l = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / l));
  return Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz);
}
function lineDist(p: P[], x: number, z: number) { let d = 1e9; for (let i = 1; i < p.length; i++) d = Math.min(d, segDist(x, z, p[i - 1], p[i])); return d; }
const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };

export class BabyBeach {
  stats = { lagoonQuads: 0, boulders: 0 };
  lagoon: Mesh; rocks: InstancedMesh;
  constructor(private g: AGame) {
    const low = (g.real as unknown as { q?: { name?: string } })?.q?.name === "low";
    this.lagoon = this.buildLagoon();
    this.rocks = this.buildRocks(low);
    g.scene.add(this.lagoon, this.rocks);
  }

  private buildLagoon(): Mesh {
    const S = 4, xs = LAGOON.map((p) => p[0]), zs = LAGOON.map((p) => p[1]);
    const x0 = Math.floor(Math.min(...xs) / S) * S, x1 = Math.max(...xs), z0 = Math.floor(Math.min(...zs) / S) * S, z1 = Math.max(...zs);
    const nx = Math.ceil((x1 - x0) / S) + 1, nz = Math.ceil((z1 - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const shoreC = new Color(0xc8fff2), midC = new Color(0x58e6d8), grassC = new Color(0x1f9e98), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S;
      const dShore = Math.min(lineDist(SHORE, x, z), lineDist(ISLET, x, z)), dMouth = segDist(x, z, MOUTH[0], MOUTH[1]);
      c.copy(shoreC).lerp(midC, Math.min(1, dShore / 45));
      // sea-grass / coral streaks: soft bands running roughly WSW-ENE across the middle of the lagoon
      const band = Math.sin(x * 0.045 + z * 0.11 + Math.sin(x * 0.013) * 2.0) * 0.5 + 0.5;
      const g = Math.max(0, band - 0.6) * 1.6 * Math.min(1, Math.max(0, dShore - 25) / 30) * (0.7 + 0.3 * hash(x, z));
      c.lerp(grassC, Math.min(0.5, g));
      // opaque enough to read pale over the deep terrain; fades out into the channel to the open sea
      const a = Math.min(0.82, 0.62 + 0.2 * Math.max(0, 1 - dShore / 30)) * Math.min(1, Math.max(0, (dMouth - 6) / 40));
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (!inside(LAGOON, cx, cz)) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.lagoonQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(geo, mat); m.name = "aw:babybeach:lagoon"; m.renderOrder = 2; m.receiveShadow = false; m.castShadow = false;
    return m;
  }

  private buildRocks(low: boolean): InstancedMesh {
    const spots: number[][] = []; // x, z, top, size
    const xs = ISLET.map((p) => p[0]), zs = ISLET.map((p) => p[1]), step = low ? 3.4 : 2.5;
    for (let x = Math.min(...xs); x <= Math.max(...xs); x += step) for (let z = Math.min(...zs); z <= Math.max(...zs); z += step) {
      const jx = x + (hash(x, z) - 0.5) * step * 0.8, jz = z + (hash(z, x) - 0.5) * step * 0.8;
      if (!inside(ISLET, jx, jz)) continue;
      const edge = lineDist(ISLET, jx, jz);
      spots.push([jx, jz, 0.35 + Math.min(1, edge / 6) * 0.9 + hash(jx, 3) * 0.4, 1.3 + hash(jx, jz) * 1.2]);
    }
    for (let i = 1; i < LEDGE.length; i++) { // low ledge: boulders just breaking the surface
      const a = LEDGE[i - 1], b = LEDGE[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L / (low ? 4.5 : 3));
      for (let k = 0; k < n; k++) { const t = (k + hash(i, k)) / n, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t + (hash(k, i) - 0.5) * 3;
        spots.push([x, z, 0.1 + hash(x, z) * 0.45, 1.0 + hash(z, x) * 1.0]); }
    }
    const geo = new IcosahedronGeometry(1, 0);
    const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const im = new InstancedMesh(geo, mat, spots.length); im.name = "aw:babybeach:rocks"; im.castShadow = false; im.receiveShadow = !low;
    im.instanceMatrix.setUsage(DynamicDrawUsage);
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tones = [0xa8906f, 0x8c7b66, 0xbfae92, 0x76695c]; // weathered limestone / ironstone browns
    spots.forEach(([x, z, top, size], i) => {
      const ry = 1.7; // reach down toward the ~-2.7 m bed so no gap shows through the clear water
      e.set(hash(x, 1) * 6.28, hash(z, 2) * 6.28, hash(x, z) * 6.28); q.setFromEuler(e);
      s.set(size * (0.8 + hash(z, 5) * 0.5), ry, size * (0.8 + hash(x, 6) * 0.5));
      p.set(x, top - ry, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tones[Math.floor(hash(x * 3, z * 3) * tones.length) % tones.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere(); this.stats.boulders = spots.length;
    return im;
  }
}
