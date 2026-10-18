// Dam Tanki Leendert, the rain-water reservoir that gives Tanki Leendert its name. Off with ?tanki=0.
// A draws the whole spot as dry sand: the OSM pond (way 25591508, ~7,900 m2) is not drawn, because A only
// renders sea level, and neither is the dense green thicket (wood 633751432) that rings the pond and runs
// up its gully to the north-east. Satellite references show a dark green-brown pond just north-east of the
// Watty Vos / Kamerlingh Onnesstraat roundabout, closed in by dark kibrahacha / mesquite canopy.
// Rebuilt in code from OSM geometry; images are reference only. 2 draw calls (one water sheet and one
// InstancedMesh of canopy clumps), built once the area's terrain has streamed in, with no per-frame work.
// Low gets fewer, lower-poly clumps. Roads and A's buildings in the wood are kept clear.
import {
  BufferGeometry, Color, Euler, Float32BufferAttribute, IcosahedronGeometry, InstancedMesh, Matrix4, Mesh,
  MeshLambertMaterial, Quaternion, ShapeUtils, Vector2, Vector3,
} from "three";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// OSM way 25591508 "Dam Tanki Leendert" (natural=water), game metres, simplified to 0.6 m
const WATER: P[] = [[-5742.4,-1631.7],[-5749.9,-1632.2],[-5756.3,-1635.5],[-5763.3,-1635.4],[-5769.6,-1639.0],[-5780.7,-1635.7],[-5786.3,-1635.1],[-5790.7,-1636.2],[-5793.8,-1638.9],[-5805.1,-1654.8],[-5807.0,-1660.3],[-5806.2,-1666.1],[-5803.6,-1670.8],[-5796.6,-1677.7],[-5776.2,-1690.6],[-5761.1,-1702.4],[-5735.1,-1715.2],[-5721.6,-1719.7],[-5696.5,-1737.7],[-5691.9,-1743.2],[-5690.2,-1746.7],[-5687.9,-1758.3],[-5681.7,-1758.6],[-5681.4,-1755.9],[-5676.4,-1751.6],[-5666.6,-1748.5],[-5658.5,-1747.4],[-5651.0,-1744.1],[-5647.8,-1741.5],[-5646.7,-1739.4],[-5650.2,-1728.1],[-5653.1,-1724.0],[-5660.7,-1721.9],[-5664.1,-1715.3],[-5674.4,-1708.7],[-5685.7,-1704.1],[-5689.3,-1701.1],[-5722.8,-1662.5],[-5735.1,-1645.9],[-5739.7,-1635.0]];
// OSM way 633751432 (natural=wood): the thicket round the pond and up its gully, simplified to 0.8 m
const WOOD: P[] = [[-5839.1,-1636.2],[-5836.8,-1628.1],[-5830.4,-1622.6],[-5820.7,-1622.3],[-5812.6,-1625.2],[-5804.7,-1637.9],[-5804.1,-1645.2],[-5810.2,-1650.7],[-5812.0,-1658.2],[-5809.9,-1665.7],[-5805.3,-1672.7],[-5748.5,-1709.2],[-5721.6,-1719.7],[-5711.3,-1726.5],[-5696.5,-1737.7],[-5691.9,-1743.2],[-5689.4,-1753.5],[-5681.7,-1758.6],[-5679.3,-1753.8],[-5671.8,-1749.8],[-5658.5,-1747.4],[-5651.0,-1744.1],[-5646.7,-1739.4],[-5650.2,-1728.1],[-5653.1,-1724.0],[-5660.7,-1721.9],[-5664.1,-1715.3],[-5674.4,-1708.7],[-5685.7,-1704.1],[-5689.3,-1701.1],[-5722.8,-1662.5],[-5731.5,-1661.7],[-5754.0,-1632.4],[-5758.1,-1624.9],[-5756.9,-1618.3],[-5752.8,-1615.4],[-5748.2,-1615.4],[-5684.6,-1690.6],[-5657.8,-1714.4],[-5647.3,-1721.9],[-5633.6,-1725.6],[-5630.7,-1729.7],[-5631.0,-1742.7],[-5634.5,-1750.8],[-5639.4,-1753.1],[-5664.2,-1756.9],[-5669.7,-1760.9],[-5668.3,-1768.2],[-5663.6,-1780.0],[-5654.9,-1793.9],[-5611.1,-1845.7],[-5592.5,-1842.3],[-5575.3,-1842.9],[-5568.6,-1851.0],[-5529.2,-1866.0],[-5532.2,-1855.3],[-5524.6,-1838.8],[-5525.5,-1835.6],[-5533.0,-1839.1],[-5538.6,-1839.4],[-5541.5,-1833.3],[-5537.1,-1821.4],[-5532.7,-1813.6],[-5509.4,-1828.4],[-5512.1,-1862.8],[-5502.1,-1863.4],[-5491.4,-1866.6],[-5487.6,-1869.5],[-5484.7,-1863.1],[-5469.5,-1855.3],[-5467.2,-1844.9],[-5447.6,-1834.2],[-5446.8,-1841.7],[-5449.7,-1853.6],[-5464.8,-1884.2],[-5477.7,-1899.9],[-5482.3,-1910.0],[-5488.1,-1910.6],[-5490.5,-1904.2],[-5489.6,-1889.2],[-5495.4,-1888.3],[-5512.9,-1879.6],[-5526.0,-1879.0],[-5545.0,-1874.4],[-5554.6,-1876.1],[-5561.9,-1872.4],[-5575.0,-1869.5],[-5582.0,-1865.1],[-5593.1,-1865.1],[-5599.8,-1866.9],[-5601.8,-1869.2],[-5591.6,-1890.9],[-5592.2,-1897.8],[-5596.6,-1905.9],[-5612.2,-1923.0],[-5621.4,-1910.9],[-5610.0,-1890.3],[-5611.7,-1881.1],[-5609.7,-1870.7],[-5628.3,-1845.1],[-5682.5,-1791.8],[-5695.1,-1783.4],[-5736.7,-1798.8],[-5743.5,-1791.9],[-5745.8,-1785.2],[-5739.4,-1784.1],[-5733.3,-1787.4],[-5709.5,-1777.1],[-5697.7,-1774.8],[-5702.2,-1765.7],[-5707.1,-1739.5],[-5719.6,-1736.3],[-5718.1,-1730.6],[-5725.4,-1727.1],[-5732.7,-1726.8],[-5751.9,-1730.0],[-5765.3,-1724.8],[-5774.1,-1719.6],[-5779.3,-1711.2],[-5786.9,-1702.8],[-5798.9,-1696.7],[-5807.6,-1696.7],[-5818.7,-1693.5],[-5823.1,-1687.4],[-5823.6,-1679.6],[-5835.0,-1675.3],[-5835.9,-1657.6]];
// A road segments near the wood (x1,z1,x2,z2,width), from the region data
const ROADS: number[][] = [[-5864.4,-1677.0,-5824.2,-1717.2,7.6],[-5824.2,-1717.2,-5802.2,-1740.0,7.6],[-5831.7,-1765.3,-5824.2,-1717.2,6.0],[-5800.0,-1635.9,-5800.8,-1641.2,6.0],[-5800.8,-1641.2,-5802.4,-1654.9,6.0],[-5802.4,-1654.9,-5800.0,-1660.7,6.0],[-5744.1,-1800.0,-5684.0,-1861.7,7.6],[-5684.0,-1861.7,-5643.9,-1902.8,7.6],[-5643.9,-1902.8,-5622.7,-1924.6,7.6],[-5622.7,-1924.6,-5560.1,-1988.7,7.6],[-5444.4,-1841.3,-5320.3,-1843.6,6.0],[-5475.6,-1906.0,-5448.8,-1919.9,6.0],[-5491.4,-1944.5,-5487.5,-1932.2,6.0],[-5487.5,-1932.2,-5481.7,-1918.0,6.0],[-5481.7,-1918.0,-5475.6,-1906.0,6.0],[-5475.6,-1906.0,-5471.7,-1899.2,6.0],[-5471.7,-1899.2,-5461.3,-1884.3,6.0],[-5461.3,-1884.3,-5452.1,-1867.2,6.0],[-5452.1,-1867.2,-5447.9,-1855.3,6.0],[-5447.9,-1855.3,-5444.4,-1841.3,6.0],[-5444.4,-1841.3,-5437.0,-1800.0,6.0],[-5643.9,-1902.8,-5659.4,-1917.6,6.0],[-5800.0,-1742.3,-5760.9,-1782.8,7.6],[-5760.9,-1782.8,-5744.1,-1800.0,7.6],[-5768.3,-1800.0,-5767.9,-1794.3,6.0],[-5767.9,-1794.3,-5767.6,-1789.7,6.0],[-5767.6,-1789.7,-5766.4,-1786.7,6.0],[-5766.4,-1786.7,-5760.9,-1782.8,6.0],[-5597.8,-1724.0,-5625.5,-1720.3,6.0],[-5625.5,-1720.3,-5636.4,-1718.4,6.0],[-5636.4,-1718.4,-5648.0,-1714.0,6.0],[-5648.0,-1714.0,-5658.1,-1708.2,6.0],[-5658.1,-1708.2,-5667.1,-1701.1,6.0],[-5667.1,-1701.1,-5676.9,-1692.0,6.0],[-5676.9,-1692.0,-5694.9,-1672.6,6.0],[-5694.9,-1672.6,-5737.5,-1618.6,6.0],[-5737.5,-1618.6,-5742.1,-1614.2,6.0],[-5742.1,-1614.2,-5746.9,-1610.6,6.0],[-5746.9,-1610.6,-5751.9,-1607.8,6.0],[-5751.9,-1607.8,-5757.9,-1606.2,6.0],[-5757.9,-1606.2,-5791.4,-1606.0,6.0],[-5694.9,-1672.6,-5670.3,-1648.4,6.0],[-5595.8,-1793.1,-5612.5,-1753.2,3.6],[-5612.5,-1753.2,-5625.4,-1728.8,3.6],[-5625.4,-1728.8,-5625.5,-1720.3,3.6],[-5791.4,-1606.0,-5793.4,-1618.1,6.0],[-5793.4,-1618.1,-5799.0,-1629.2,6.0],[-5799.0,-1629.2,-5800.0,-1635.9,6.0],[-5800.0,-1660.7,-5798.6,-1663.9,6.0],[-5798.6,-1663.9,-5790.1,-1668.5,6.0]];
// A building footprints that overlap the wood, as bboxes padded by 3 m
const BLDG: number[][] = [[-5847.5,-1655.4,-5831.4,-1639.4],[-5846.2,-1694.3,-5827.3,-1675.5],[-5467.5,-1918.9,-5435.8,-1886.7],[-5606.0,-1937.3,-5569.6,-1900.9],[-5674.9,-1864.1,-5639.3,-1814.6],[-5694.4,-1839.9,-5661.6,-1812.0],[-5705.7,-1824.3,-5670.4,-1792.6],[-5774.1,-1714.7,-5757.8,-1698.4],[-5728.6,-1740.1,-5716.4,-1727.2],[-5793.0,-1717.9,-5781.0,-1704.6],[-5810.6,-1726.7,-5787.8,-1700.6]];

function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i], [xj, zj] = p[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function roadClear(x: number, z: number) {
  for (const [ax, az, bx, bz, w] of ROADS) {
    const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
    const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
    if (Math.hypot(x - ax - t * dx, z - az - t * dz) < w / 2 + 3) return false;
  }
  return true;
}
const inBldg = (x: number, z: number) => BLDG.some(([x0, z0, x1, z1]) => x > x0 && x < x1 && z > z0 && z < z1);
const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class TankiLeendert {
  stats = { built: false, tris: 0, clumps: 0, ms: 0 };
  water: Mesh | null = null; trees: InstancedMesh | null = null;
  private timer = 0;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tryBuild(), 1500);
  }

  /** Build once every region the pond and wood touch has its height tile (heights are then final). */
  private tryBuild() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const need = new Set<string>();
    for (const [x, z] of [...WATER, ...WOOD]) need.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
    let ok = 0;
    for (const r of W.regions.values()) if (r.H && need.has(`${r.rx},${r.rz}`)) ok++;
    if (ok < need.size) return;
    window.clearInterval(this.timer);
    const low = (this.g.real as unknown as { q?: { name?: string } })?.q?.name === "low";
    const t0 = performance.now();
    this.water = this.buildWater(W);
    this.trees = this.buildThicket(W, low);
    this.g.scene.add(this.water, this.trees);
    this.stats.built = true; this.stats.ms = Math.round(performance.now() - t0);
  }

  private buildWater(W: World): Mesh {
    const contour = WATER.map(([x, z]) => new Vector2(x, z));
    let tris: number[][][] = ShapeUtils.triangulateShape(contour, []).map((t) => t.map((i) => WATER[i]));
    // split every triangle into 4 twice so the sheet follows A's coarse terrain along the gully
    for (let pass = 0; pass < 2; pass++) {
      const next: number[][][] = [];
      for (const [a, b, c] of tris) {
        const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2], ca = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
        next.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
      }
      tris = next;
    }
    const pos: number[] = [], col: number[] = [], nrm: number[] = [];
    // murky green-brown rain-water pond, a touch lighter toward the shallow north-east end
    const deep = new Color(0x2c4a3a), shallow = new Color(0x55603f), c = new Color();
    for (const t of tris) for (const [x, z] of t) {
      const h = W.heightAt(x, z), y = (Number.isFinite(h) ? h : 0) + 0.3;
      c.copy(deep).lerp(shallow, Math.min(1, Math.max(0, (x + 5790) / 140)) * 0.45 + 0.15 * hash(Math.round(x / 8), Math.round(z / 8)));
      pos.push(x, y, z); col.push(c.r, c.g, c.b); nrm.push(0, 1, 0);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 3));
    geo.setAttribute("normal", new Float32BufferAttribute(nrm, 3));
    // upward winding regardless of contour order
    const p = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < p.length; i += 9) {
      const cr = (p[i + 3] - p[i]) * (p[i + 8] - p[i + 2]) - (p[i + 5] - p[i + 2]) * (p[i + 6] - p[i]);
      if (cr > 0) for (let k = 0; k < 3; k++) { const t = p[i + 3 + k]; p[i + 3 + k] = p[i + 6 + k]; p[i + 6 + k] = t; }
    }
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const base = new Color(0xffffff), night = new Color(0x2a3550);
    const m = new Mesh(geo, mat); m.name = "aw:tanki:pond"; m.receiveShadow = false;
    m.onBeforeRender = () => { mat.color.copy(base).lerp(night, uNight.value * 0.6); };
    this.stats.tris = p.length / 9;
    return m;
  }

  private buildThicket(W: World, low: boolean): InstancedMesh {
    const spots: number[][] = [];
    const ok = (x: number, z: number) => roadClear(x, z) && !inBldg(x, z);
    // jittered grid across the wood, minus the open water
    const step = low ? 5.5 : 4;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of WOOD) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    for (let z = z0; z <= z1; z += step) for (let x = x0; x <= x1; x += step) {
      const px = x + (hash(x, z) - 0.5) * step * 0.8, pz = z + (hash(z, x) - 0.5) * step * 0.8;
      if (!inside(WOOD, px, pz) || inside(WATER, px, pz) || !ok(px, pz)) continue;
      spots.push([px, pz, 2.2 + hash(px, pz) * 1.8]);
    }
    // a ring of canopy right on the bank, so the pond reads closed in by green
    const n = WATER.length, ring = low ? 5 : 3.5;
    for (let i = 0; i < n; i++) {
      const a = WATER[i], b = WATER[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 0.01) continue;
      const nx = (b[1] - a[1]) / L, nz = -(b[0] - a[0]) / L;
      for (let s = 0; s < L; s += ring) {
        const x = a[0] + (b[0] - a[0]) * (s / L), z = a[1] + (b[1] - a[1]) * (s / L), off = 2 + hash(x, z) * 1.5;
        for (const sg of [1, -1]) {
          const px = x + nx * off * sg, pz = z + nz * off * sg;
          if (inside(WATER, px, pz) || !ok(px, pz)) continue; // keep the bank side only
          spots.push([px, pz, 2 + hash(pz, px) * 1.4]);
        }
      }
    }
    const geo = new IcosahedronGeometry(1, low ? 0 : 1);
    const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const im = new InstancedMesh(geo, mat, spots.length); im.name = "aw:tanki:thicket"; im.castShadow = false; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tones = [0x324d21, 0x3c5825, 0x46612a, 0x2d4623, 0x4f672d]; // dry-season kibrahacha / mesquite olive greens
    spots.forEach(([x, z, r], i) => {
      const h = W.heightAt(x, z), y = Number.isFinite(h) ? h : 0;
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      // wide, flat-topped crowns standing on short trunks of shade
      s.set(r * 1.3, r * 0.8, r * 1.3); p.set(x, y + r * 0.8 + 0.6, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tones[Math.floor(hash(x * 2, z * 2) * tones.length) % tones.length]));
    });
    const dim = new Color(0x4a5a70);
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere(); this.stats.clumps = spots.length;
    return im;
  }
}
