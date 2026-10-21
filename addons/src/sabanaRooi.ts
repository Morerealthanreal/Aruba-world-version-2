// Sabana Basora rooi gorge: the dry stream valley east of Sabana Basora, inland of Pos Chikito, accuracy pass.
// Off with ?rooi=0.
// A draws the valley as open tan ground with a few round shrubs and cacti. Satellite imagery and published
// descriptions of Aruba's rooi (seasonal dry streams) show a closed grey-green dry thorn forest on both
// slopes, a darker green ribbon of taller trees along the stream bed, a pale gravel bed, and pale pitted
// limestone ledges along the west bank where OSM maps the cliff.
// Geometry is OSM (stream 487870229 and its run on down 854944101, side stream 854944101, cliffs 487870230,
// 487870231 and 799353400) plus A's road and building data, rebuilt in code; imagery was looked at only.
// 3 draw calls: one vertex-coloured ground tint draped on A's terrain, one InstancedMesh of thicket and tree
// crowns, and one merged props mesh (limestone ledges, stream-bed stones, kadushi). Built once when the
// height regions have streamed in; per frame only a night colour lerp. Stays inside x 1590-2000,
// z 5080-6340: east of the Sabana Basora houses, north of the Pos Chikito road and the Mangel Halto band.
import {
  BufferGeometry, Color, CylinderGeometry, DoubleSide, Euler, Float32BufferAttribute, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// game metres (x east, z south). RIVER: OSM 487870229 then 854944101 down to z 6340 (simplified 2.5 m).
// TRIB: the side stream (854944101) from the east. CLIFF*: OSM natural=cliff. ROADS: A's road segments near the
// valley [ax, az, bx, bz, keep-clear radius]. BLD: A's building footprints near it, as bboxes padded 3 m.
const RIVER: P[] = [[2132.7,4882.6],[2103.4,4881.1],[2092.8,4894.8],[2078.5,4974.8],[2055.6,5039.5],[1999.2,5145.3],[1939.8,5221.1],[1923.6,5251.3],[1874.9,5287.6],[1830.4,5342.3],[1803.8,5382.4],[1795.5,5413.8],[1784.6,5435.0],[1766.3,5458.3],[1765.3,5479.5],[1743.0,5523.9],[1743.1,5552.5],[1764.2,5593.1],[1793.9,5628.9],[1811.3,5659.2],[1811.5,5682.0],[1805.7,5697.8],[1759.2,5747.3],[1755.2,5768.1],[1756.6,5787.8],[1798.6,5851.5],[1803.9,5878.3],[1770.6,5987.1],[1765.5,6036.2],[1757.2,6055.4],[1772.1,6075.9],[1771.3,6089.4],[1731.7,6166.7],[1740.7,6193.9],[1733.2,6215.4],[1740.6,6213.5],[1660.1,6251.5],[1634.5,6267.7],[1619.7,6268.7],[1609.5,6276.2],[1602.2,6286.8],[1601.2,6313.9],[1589.8,6338.7]];
const TRIB: P[] = [[2164.3,6019.7],[2133.1,6028.5],[2070.7,6065.9],[2039.7,6064.3],[1982.8,6073.1],[1946.5,6089.0],[1825.4,6158.2],[1799.0,6184.2],[1740.6,6213.5]];
const CLIFF: P[] = [[1598.4,6118.5],[1629.1,6137.9],[1692.2,6154.4],[1704.2,6145.7],[1723.7,6120.7],[1732.3,6074.4],[1740.4,6053.4],[1735.1,6014.1],[1725.4,5974.6],[1725.2,5944.2],[1740.0,5885.3],[1735.8,5851.8],[1715.3,5801.5],[1707.0,5750.7],[1732.7,5681.2],[1732.7,5665.6],[1740.8,5645.3],[1740.8,5632.0],[1748.4,5610.0],[1742.6,5587.4],[1722.2,5564.3],[1712.2,5531.3],[1708.7,5500.0],[1711.2,5478.8],[1717.0,5456.3],[1731.0,5437.1],[1773.2,5411.2],[1779.6,5398.4],[1774.7,5381.0],[1774.7,5359.0],[1782.3,5341.0],[1809.1,5302.8],[1844.0,5276.9],[1856.3,5276.3],[1866.8,5259.4],[1868.0,5234.5],[1877.3,5212.5],[1927.5,5151.7],[1918.7,5142.4],[1898.3,5133.8],[1882.6,5121.6],[1870.9,5106.5],[1861.0,5085.7],[1852.3,5078.2],[1851.1,5067.2],[1856.3,5046.3],[1866.8,5037.1],[1882.6,5031.9]];
const CLIFF2: P[] = [[1785.1,6341.7],[1780.0,6323.6],[1765.8,6299.4],[1766.8,6270.2],[1773.9,6250.0],[1792.2,6231.9],[1804.3,6213.7],[1829.7,6210.7],[1855.1,6211.7],[1859.2,6200.6]];
const CLIFF3: P[] = [[1847.0,5411.1],[1825.5,5438.3],[1818.5,5454.5],[1817.3,5477.1],[1824.3,5495.0],[1837.7,5500.2],[1848.8,5492.1],[1857.5,5507.8],[1870.9,5518.2],[1907.7,5530.9]];
const ROADS: number[][] = [[2045.7,6062.1,2049.4,6064.9,5.0],[2049.4,6064.9,2053.3,6068.0,5.0],[2053.3,6068.0,2058.4,6072.1,5.0],[2058.4,6072.1,2068.6,6078.7,5.0],[2068.6,6078.7,2074.2,6081.2,5.0],[2074.2,6081.2,2081.4,6083.6,5.0],[2081.4,6083.6,2089.8,6085.5,5.0],[2089.8,6085.5,2097.6,6086.5,5.0],[2097.6,6086.5,2101.8,6086.6,5.0],[2101.8,6086.6,2107.0,6086.6,5.0],[2107.0,6086.6,2112.7,6086.1,5.0],[2112.7,6086.1,2131.5,6082.4,5.0],[2131.5,6082.4,2166.9,6076.3,5.0],[2166.9,6076.3,2200.0,6071.2,5.0],[2053.3,6068.0,2050.1,6069.6,3.8],[2050.1,6069.6,2047.3,6070.2,3.8],[2047.3,6070.2,2044.7,6070.5,3.8],[2044.7,6070.5,2040.9,6070.1,3.8],[2040.9,6070.1,2037.3,6069.6,3.8],[2037.3,6069.6,2032.7,6068.8,3.8],[2032.7,6068.8,2028.7,6068.9,3.8],[2028.7,6068.9,2024.7,6069.6,3.8],[2024.7,6069.6,2018.2,6072.3,3.8],[2018.2,6072.3,2014.1,6073.7,3.8],[2014.1,6073.7,2007.2,6075.1,3.8],[2007.2,6075.1,2002.2,6076.5,3.8],[2002.2,6076.5,1995.4,6078.3,3.8],[1995.4,6078.3,1983.5,6081.3,3.8],[1983.5,6081.3,1976.8,6081.9,3.8],[1976.8,6081.9,1967.2,6082.0,3.8],[1967.2,6082.0,1961.4,6082.2,3.8],[1961.4,6082.2,1955.9,6083.1,3.8],[1955.9,6083.1,1947.2,6085.4,3.8],[1947.2,6085.4,1929.1,6091.2,3.8],[1929.1,6091.2,1920.8,6094.4,3.8],[1920.8,6094.4,1912.5,6098.4,3.8],[1912.5,6098.4,1898.0,6106.1,3.8],[2045.7,6062.1,2039.3,6054.8,4.0],[2039.3,6054.8,2037.5,6051.9,4.0],[2037.5,6051.9,2036.2,6048.0,4.0],[2036.2,6048.0,2035.8,6044.5,4.0],[2035.8,6044.5,2036.2,6039.8,4.0]];
const BLD: number[][] = [[2010.8,6033.1,2028.0,6050.1],[2018.3,6023.1,2041.5,6044.7],[2032.2,6019.9,2046.6,6034.5],[2049.6,6010.3,2063.6,6023.5]];
const X_W = 1590, X_E = 2000, Z_N = 5080, Z_S = 6340;
const HALF = 150; // half width of the forested valley floor and slopes kept in the pass

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
const smooth = (a: number, b: number, v: number) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
function lineDist(x: number, z: number, p: P[]) {
  let m = 1e9; for (let i = 1; i < p.length; i++) m = Math.min(m, segDist(x, z, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1])); return m;
}
/** smooth value noise, 0..1, cell size s */
function vnoise(x: number, z: number, s: number) {
  const fx = x / s, fz = z / s, ix = Math.floor(fx), iz = Math.floor(fz), tx = fx - ix, tz = fz - iz;
  const u = tx * tx * (3 - 2 * tx), v = tz * tz * (3 - 2 * tz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const dRiver = (x: number, z: number) => lineDist(x, z, RIVER);
const dTrib = (x: number, z: number) => (x > X_E + 10 ? 1e9 : lineDist(x, z, TRIB));
const dCliff = (x: number, z: number) => Math.min(lineDist(x, z, CLIFF), lineDist(x, z, CLIFF2), lineDist(x, z, CLIFF3));
/** 0..1: how much of the forested valley this point is in */
function zone(x: number, z: number) {
  const box = smooth(X_W, X_W + 30, x) * (1 - smooth(X_E - 30, X_E, x)) * smooth(Z_N, Z_N + 40, z) * (1 - smooth(Z_S - 40, Z_S, z));
  if (box <= 0) return 0;
  const edge = HALF + (vnoise(x + 977, z - 431, 45) - 0.5) * 70; // ragged forest edge, not a ribbon
  return box * Math.max(1 - smooth(edge - 45, edge, dRiver(x, z)), 1 - smooth(22, 40, dTrib(x, z)));
}
function clear(x: number, z: number, pad = 0) {
  for (const [ax, az, bx, bz, r] of ROADS) if (segDist(x, z, ax, az, bx, bz) < r + pad) return false;
  for (const [x0, z0, x1, z1] of BLD) if (x > x0 - pad && x < x1 + pad && z > z0 - pad && z < z1 + pad) return false;
  return true;
}
/** Colour every vertex of a geometry and drop uvs, so differently built parts can be merged. */
function paint(g: BufferGeometry, hex: number, jitter = 0, seed = 0) {
  const geo = g.index ? g.toNonIndexed() : g; if (geo !== g) g.dispose();
  geo.deleteAttribute("uv");
  const c = new Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3);
  const k = 1 + (hash(seed, 3.7) - 0.5) * jitter;
  for (let i = 0; i < n; i++) { a[i * 3] = c.r * k; a[i * 3 + 1] = c.g * k; a[i * 3 + 2] = c.b * k; }
  geo.setAttribute("color", new Float32BufferAttribute(a, 3));
  return geo;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class SabanaRooi {
  stats = { built: false, tintQuads: 0, crowns: 0, rocks: 0, kadushi: 0, ms: 0 };
  private timer = 0;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const ready = new Set<string>();
    for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
    const keys = new Set<string>();
    for (let x = X_W; x <= X_E; x += 100) for (let z = Z_N; z <= Z_S; z += 100) {
      if (zone(x, z) > 0 || dRiver(x, z) < HALF + 60) keys.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
    }
    if (![...keys].every((k) => ready.has(k))) return;
    window.clearInterval(this.timer);
    const t0 = performance.now();
    const low = this.g.real?.q?.name === "low";
    const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    this.g.scene.add(this.tint(h, low), this.crowns(h, low), this.props(h, low));
    this.stats.built = true;
    this.stats.ms = Math.round(performance.now() - t0);
  }

  /** Ground tint: grey-green thorn forest with pale bare patches, a dark green ribbon by the stream, pale gravel bed and limestone. */
  private tint(h: (x: number, z: number) => number, low: boolean): Mesh {
    const S = low ? 8 : 5;
    const x0 = Math.floor(X_W / S) * S, z0 = Math.floor(Z_N / S) * S;
    const nx = Math.ceil((X_E - x0) / S) + 1, nz = Math.ceil((Z_S - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const forC = [new Color(0x474d31), new Color(0x55583b), new Color(0x3e452b)], bareC = new Color(0x9d937a);
    const ripC = new Color(0x2f4421), bedC = new Color(0xbfb49c), limeC = new Color(0xb3aa94), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, y = h(x, z), w = zone(x, z);
      const dr = Math.min(dRiver(x, z), dTrib(x, z)), dc = dCliff(x, z);
      const n1 = vnoise(x, z, 22), n2 = vnoise(x + 311, z - 97, 7);
      c.copy(forC[0]).lerp(forC[1], n1).lerp(forC[2], smooth(0.55, 0.9, n2));
      c.lerp(bareC, smooth(0.62, 0.8, vnoise(x - 53, z + 211, 30)) * 0.75); // open bare patches between the thickets
      c.lerp(ripC, 1 - smooth(10, 24, dr)); // taller, greener trees along the stream
      c.lerp(limeC, (1 - smooth(4, 11, dc)) * (0.6 + 0.4 * n2)); // pale limestone ledges along the cliff line
      c.lerp(bedC, (1 - smooth(2, 4, dr)) * 0.7); // pale gravel stream bed, mostly under the stream trees
      c.multiplyScalar(0.95 + hash(x * 0.37, z * 0.41) * 0.08);
      pos.push(x, y + 0.12, z); col.push(c.r, c.g, c.b, 0.9 * w);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (zone(cx, cz) <= 0 && zone(cx - S, cz - S) <= 0 && zone(cx + S, cz + S) <= 0) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.tintQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const m = new Mesh(geo, mat); m.name = "aw:rooi:tint";
    const dim = new Color(0x2c3448);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.setHex(0xffffff).lerp(dim, k); mat.opacity = 1 - 0.6 * k; };
    m.renderOrder = 1; m.castShadow = false; m.receiveShadow = true;
    return m;
  }

  /** Thicket crowns on the slopes and taller tree crowns along the stream. */
  private crowns(h: (x: number, z: number) => number, low: boolean): InstancedMesh {
    const spots: number[][] = []; // x, z, y, kind (0 thicket, 1 stream tree)
    const step = low ? 9 : 5.5;
    for (let x = X_W; x <= X_E; x += step) for (let z = Z_N; z <= Z_S; z += step) {
      const px = x + (hash(x, z) - 0.5) * step * 0.9, pz = z + (hash(z, x) - 0.5) * step * 0.9;
      const w = zone(px, pz); if (w <= 0.05) continue;
      const dr = Math.min(dRiver(px, pz), dTrib(px, pz));
      if (dr < 3.5 || dCliff(px, pz) < 4) continue; // keep the gravel bed and the ledge faces open
      const rip = dr < 20, bare = vnoise(px - 53, pz + 211, 30) > 0.68;
      const p = w * (rip ? 0.8 : bare ? 0.15 : 0.62);
      if (hash(px * 0.7, pz * 1.3) > p || !clear(px, pz, 2)) continue;
      spots.push([px, pz, h(px, pz), rip ? 1 : 0]);
    }
    const im = new InstancedMesh(new IcosahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), spots.length);
    im.name = "aw:rooi:crowns"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const dryT = [0x505c35, 0x5d633d, 0x4a5432, 0x666c44, 0x605c3c, 0x56603a], ripT = [0x34502a, 0x3d5a2a, 0x2e4822, 0x44602e];
    spots.forEach(([x, z, y, kind], i) => {
      const r = kind ? 2.6 + hash(x * 3, z) * 2.2 : 1.4 + hash(x * 3, z) * 1.6;
      const ht = kind ? r * 0.55 : r * 0.6;
      const lift = kind ? 1.6 + hash(z * 3, x) * 1.6 : ht * 0.55; // stream trees carry their crowns up on trunks hidden in the thicket
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * (1 + hash(z, 4) * 0.35), ht, r); p.set(x, y + lift, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      const t = kind ? ripT : dryT; im.setColorAt(i, c.setHex(t[Math.floor(hash(x * 2, z * 2) * t.length) % t.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.crowns = spots.length;
    return im;
  }

  /** Limestone ledges along the OSM cliff lines, pale stones in the stream bed, kadushi on the open slopes. */
  private props(h: (x: number, z: number) => number, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const rock = (x: number, z: number, sx: number, sy: number, sz: number, hex: number, seed: number, rot?: number, sink = 0.35) => {
      const g = new IcosahedronGeometry(1, 0);
      const pa = g.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < pa.count; i++) { const j = 0.75 + 0.5 * hash(seed + i * 1.37, i); pa.setXYZ(i, pa.getX(i) * j, pa.getY(i) * j, pa.getZ(i) * j); }
      g.computeVertexNormals(); g.scale(sx, sy, sz); g.rotateY(rot ?? hash(seed, 9) * 6.28); g.translate(x, h(x, z) + sy * sink, z);
      parts.push(paint(g, hex, 0.25, seed)); this.stats.rocks++;
    };
    // pitted limestone ledges: pale grey blocks along the cliff lines, in broken runs where the thicket closes over
    const lime = [0xbdb5a0, 0xa9a08a, 0xc9c2b0, 0x968d78, 0xb3aa92];
    for (const line of [CLIFF, CLIFF2, CLIFF3]) for (let i = 1; i < line.length; i++) {
      const [ax, az] = line[i - 1], [bx, bz] = line[i], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(len / (low ? 5 : 3.5)));
      const ang = Math.atan2(bz - az, bx - ax);
      for (let k = 0; k < n; k++) {
        const t = (k + hash(ax + k, az)) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        if (zone(x, z) < 0.3 || vnoise(x, z, 40) < 0.22 || !clear(x, z)) continue;
        const L = 2.2 + hash(z, x) * 2.2;
        rock(x, z, L, 1.4 + hash(x * 2, z) * 2.2, 1.1 + hash(z * 2, x) * 1.0, lime[k % lime.length], x + z, -ang + (hash(k, i) - 0.5) * 0.4, 0.2);
      }
    }
    // stream bed: pale rounded stones and cobble bars along the dry channel
    const bed = [0xd6ccb6, 0xc4b9a1, 0xb2a78f, 0xe0d7c4];
    const bedLen = RIVER.length;
    for (let i = 1; i < bedLen; i++) {
      const [ax, az] = RIVER[i - 1], [bx, bz] = RIVER[i], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(len / (low ? 9 : 6)));
      for (let k = 0; k < n; k++) {
        const t = (k + hash(ax + k, az + 1)) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        if (zone(x, z) < 0.3 || !clear(x, z)) continue;
        const o = (hash(x, z) - 0.5) * 3.5, ox = -(bz - az) / len * o, oz = (bx - ax) / len * o;
        const r = 0.35 + hash(z, x) * 0.7;
        rock(x + ox, z + oz, r * 1.3, r * 0.6, r, bed[k % bed.length], x * 1.3 + z);
      }
    }
    // kadushi: clumps of columnar cactus standing out of the thicket on the drier slopes
    const want = low ? 30 : 50;
    for (let i = 0; i < 600 && this.stats.kadushi < want; i++) {
      const x = X_W + hash(i, 61) * (X_E - X_W), z = Z_N + hash(i, 62) * (Z_S - Z_N);
      const w = zone(x, z); if (w < 0.5) continue;
      if (Math.min(dRiver(x, z), dTrib(x, z)) < 25 || dCliff(x, z) < 6 || !clear(x, z, 3)) continue;
      const y = h(x, z), stems = 3 + Math.floor(hash(i, 64) * 5);
      for (let k = 0; k < stems; k++) {
        const H = 2.2 + hash(i, k + 30) * 3.2, ox = (hash(i, k + 40) - 0.5) * 1.6, oz = (hash(i, k + 50) - 0.5) * 1.6;
        const g = new CylinderGeometry(0.16, 0.2, H, 6, 1); g.translate(x + ox, y + H / 2 - 0.1, z + oz); parts.push(paint(g, 0x4c7438, 0.2, i * 7 + k));
      }
      this.stats.kadushi++;
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:rooi:props"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x55607a);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }
}
