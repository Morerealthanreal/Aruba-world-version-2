// De Palm Island (Palm Island Key, off Balashi) and its mainland ferry dock. Off with ?depalm=0.
// A draws the island as a bare tan sand strip with a handful of houses and twelve palms, and paints the whole
// lagoon between it and the coast the same bright turquoise. There is no pier on either side of the crossing.
// Public references describe a low, flat coral cay run as a day resort by De Palm Tours. It has palms, thatched
// palapas over the beach chairs, a kids' water park and body-drop slides, a buffet restaurant and bar
// pavilion, and snorkelling on the reef along the seaward side. Two ferries shuttle about every 15 minutes
// on a ~5 minute crossing from Port De Palm at Balashi, next to the WEB plant, where there's free parking and
// a ticket office. Sentinel-2 shows a pale reef flat fringing the key (wide on the seaward south-west side,
// narrow on the lagoon side) and darker, deeper water across the crossing. A paler reef band, OSM reef
// 1223768400, runs through the middle of the crossing.
// Geometry is OSM, rebuilt in code: the key's coast as A draws it (coastline 6279617), ferry route 352778304,
// island piers 352783893 / 657526398 / 512700436, breakwaters 726045692-3, beaches 1017328548 / 352783894,
// water park 640478318, pool 512700431, mangrove 1127740831, wood 1127740832, the island building footprints
// (only kept clear, A still draws them), and the mainland coastline 352778247 at the ferry terminal node
// 2682381431. Photos are reference only. Boat and canopy colours are generic.
// 2 draw calls: one vertex-coloured lagoon sheet (deep water, the reef band and the ferries' lane through it,
// the key's fringing flat) and one merged props mesh (piers, quay, ferries, canopy, palms, palapas, chairs, water park,
// slide tower, breakwater rock, mangrove). Built once, in 2 small steps, after the height regions under the
// island and the dock have streamed in. Per frame only a colour/opacity lerp. Hidden beyond 2.8 km.
// Stays off Barcadera (x < -2550), the Balashi gold mill inland, Spaans Lagoen and the Mangel Halto coast.
import {
  BoxGeometry, BufferGeometry, CatmullRomCurve3, Color, ConeGeometry, CylinderGeometry, ExtrudeGeometry,
  Float32BufferAttribute, Group, IcosahedronGeometry, Mesh, MeshLambertMaterial, Shape, ShapeUtils, TubeGeometry,
  Vector2, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// A's coast for the key's developed south-east end (land ring 2 = OSM coastline 6279617, cut at x -1860)
const COAST: P[] = [[-1484,5689],[-1492,5698],[-1533,5659],[-1563,5659],[-1562,5638],[-1550,5637],[-1566,5617],[-1581,5620],[-1622,5582],[-1621,5563],[-1640,5567],[-1655,5560],[-1631,5562],[-1643,5521],[-1659,5520],[-1667,5543],[-1685,5526],[-1656,5515],[-1665,5493],[-1684,5481],[-1699,5509],[-1700,5496],[-1682,5469],[-1683,5457],[-1734,5435],[-1752,5414],[-1846,5345],[-1803,5325],[-1781,5331],[-1779,5341],[-1711,5390],[-1697,5431],[-1671,5444],[-1650,5476],[-1621,5496],[-1602,5473],[-1596,5477],[-1600,5485],[-1576,5500],[-1548,5553],[-1520,5579],[-1522,5604],[-1485,5661]];
const REEF: P[] = [[-1215.6,5607.7],[-1025.2,5590.0],[-1027.2,5576.4],[-1164.9,5490.8],[-1130.4,5418.2],[-1179.1,5301.3],[-1522.1,5057.3],[-1920.0,4898.1],[-1950.0,4896.8],[-1993.9,4910.0],[-2007.0,4939.6],[-2011.7,4986.3],[-1997.2,5015.0],[-1788.1,5168.2],[-1613.5,5254.9],[-1497.8,5388.0],[-1412.5,5440.4]];
const ROUTE: P[] = [[-1511.2,5572.4],[-1224.6,5410.5],[-950.2,5277.5]];
const PIER_F: P[] = [[-1511.2,5572.4],[-1491.1,5589.7],[-1492.8,5592.0],[-1511.7,5575.1],[-1525.6,5587.1],[-1527.1,5585.1],[-1513.5,5573.6],[-1517.6,5569.4],[-1515.8,5567.6]];
const PIER_SE: P[] = [[-1508.8,5633.1],[-1454.4,5642.7],[-1453.1,5634.7],[-1449.3,5635.5],[-1451.0,5646.3],[-1472.7,5642.4],[-1473.9,5647.8],[-1479.5,5654.0],[-1481.6,5652.1],[-1476.6,5646.8],[-1475.6,5641.8],[-1506.2,5635.7]];
const PIER_NW: P[] = [[-1630.5,5487.9],[-1611.4,5466.6],[-1614.9,5463.5],[-1617.3,5466.1],[-1615.5,5467.7],[-1632.2,5486.3]];
const BW: P[][] = [
  [[-1656.3,5515.3],[-1655.0,5516.2],[-1667.7,5527.8],[-1667.3,5533.7],[-1663.0,5540.0],[-1667.2,5542.7],[-1671.4,5532.2],[-1674.1,5529.9],[-1685.1,5526.3],[-1683.7,5521.9],[-1671.4,5525.1],[-1668.4,5524.8],[-1666.0,5523.7]],
  [[-1684.3,5481.1],[-1687.0,5477.0],[-1699.3,5492.8],[-1700.5,5495.5],[-1701.0,5502.0],[-1698.1,5509.4],[-1697.1,5508.7],[-1697.9,5501.8],[-1697.2,5498.2],[-1690.7,5488.0]],
];
const BEACHES: P[][] = [
  [[-1611.7,5578.0],[-1604.5,5571.8],[-1597.3,5577.0],[-1593.9,5576.6],[-1572.6,5600.3],[-1569.7,5614.4],[-1574.7,5615.6],[-1578.4,5612.1],[-1583.7,5616.1],[-1613.2,5585.1],[-1610.8,5582.1]],
  [[-1684.3,5481.1],[-1676.6,5473.1],[-1667.4,5478.6],[-1650.9,5502.8],[-1642.8,5509.8],[-1636.8,5517.6],[-1628.2,5521.4],[-1620.9,5533.2],[-1616.6,5548.7],[-1618.3,5557.2],[-1631.3,5562.2],[-1630.4,5551.1],[-1631.9,5542.0],[-1638.0,5527.6],[-1647.0,5517.5],[-1656.3,5515.3],[-1657.4,5506.6],[-1667.3,5490.1],[-1677.9,5482.8]],
];
const PARK: P[] = [[-1612.7,5507.3],[-1608.8,5501.7],[-1602.9,5500.5],[-1591.2,5511.7],[-1590.8,5516.0],[-1577.3,5527.8],[-1581.9,5533.7],[-1601.6,5519.3],[-1611.1,5514.0],[-1608.5,5510.2]];
const POOL: P[] = [[-1553.9,5558.1],[-1565.9,5562.4],[-1568.5,5566.9],[-1568.4,5570.9],[-1566.0,5575.9],[-1562.4,5579.3],[-1560.3,5585.3],[-1555.8,5586.7],[-1546.0,5584.0],[-1542.9,5580.8],[-1542.3,5577.1],[-1547.4,5560.6]];
const MANG: P[] = [[-1489.0,5679.6],[-1485.7,5687.3],[-1488.9,5695.5],[-1499.3,5695.4],[-1505.5,5686.5],[-1502.4,5678.5]];
const WOOD: P[] = [[-1604.9,5522.3],[-1612.9,5517.1],[-1623.2,5527.0],[-1613.5,5549.1],[-1607.6,5547.1],[-1610.9,5542.3],[-1605.2,5537.5],[-1612.2,5527.6]];
const BLD: P[][] = [
  [[-1606.8,5523.9],[-1611.3,5527.6],[-1606.8,5533.0],[-1605.5,5531.9],[-1601.8,5536.2],[-1609.7,5542.8],[-1604.8,5548.5],[-1619.7,5561.0],[-1613.1,5568.8],[-1597.1,5555.4],[-1594.1,5559.0],[-1584.2,5550.7],[-1581.8,5553.6],[-1576.9,5549.5],[-1580.4,5545.3],[-1582.9,5547.4],[-1588.8,5540.5],[-1587.7,5539.6],[-1594.1,5532.0],[-1592.2,5530.3],[-1596.3,5525.5],[-1601.7,5530.0]],
  [[-1639.8,5483.3],[-1643.9,5488.3],[-1641.4,5490.3],[-1645.6,5495.5],[-1636.7,5502.8],[-1632.1,5497.2],[-1635.1,5494.8],[-1631.3,5490.2]],
  [[-1544.8,5607.1],[-1545.0,5618.6],[-1531.6,5619.5],[-1530.5,5608.4]],
  [[-1626.5,5500.6],[-1639.4,5508.5],[-1634.4,5516.5],[-1621.5,5508.6]],
  [[-1577.0,5564.9],[-1584.4,5571.6],[-1572.3,5585.1],[-1565.0,5577.9]],
  [[-1560.6,5638.4],[-1553.8,5639.0],[-1554.2,5642.7],[-1542.5,5643.6],[-1543.6,5660.0],[-1561.7,5657.8]],
  [[-1515.0,5629.9],[-1527.9,5636.9],[-1523.3,5645.3],[-1528.0,5647.9],[-1523.9,5655.4],[-1530.0,5658.6],[-1525.1,5667.5],[-1516.5,5662.8],[-1510.9,5673.2],[-1506.7,5670.9],[-1505.3,5673.3],[-1496.6,5668.6],[-1498.0,5665.9],[-1488.9,5661.0],[-1493.8,5652.1],[-1496.2,5653.4],[-1505.6,5636.1],[-1510.2,5638.6]],
  [[-1547.8,5585.6],[-1567.6,5601.1],[-1560.3,5610.3],[-1540.5,5594.8]],
  [[-1617.9,5571.6],[-1624.4,5576.9],[-1619.5,5582.5],[-1612.9,5577.1]],
  [[-1554.9,5617.9],[-1549.4,5613.7],[-1540.6,5624.9],[-1546.1,5629.1]],
];
// mainland coastline 352778247 at the terminal (land on the left): the little quay the ferries lie alongside
const QUAY: P[] = [[-933.3,5262.3],[-938.7,5267.2],[-948.4,5270.7],[-944.4,5281.8],[-933.9,5285.2]];
const GANG: P[] = [[-946.2,5278.3],[-932.7,5281.6]]; // OSM footway 352783901 from the berth to the ticket office side
// lagoon sheet bounds, the key's axis (toward the south-east tip) and its seaward (south-west) normal
const SX0 = -1795, SX1 = -860, SZ0 = 5150, SZ1 = 5760;
const AXX = 0.661, AXZ = 0.751, SWX = -0.751, SWZ = 0.661, CX = -1590, CZ = 5560;
const MIDX = -1250, MIDZ = 5450, SHOW = 2800;
const WATER_Y = 0.05, FO = 1.6; // quay face this far seaward of OSM's line (covers A's sandy slope)

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
/** Smooth value noise, about one blob per s metres. */
function vnoise(x: number, z: number, s: number, seed = 0) {
  const fx = x / s, fz = z / s, ix = Math.floor(fx), iz = Math.floor(fz), tx = fx - ix, tz = fz - iz;
  const u = tx * tx * (3 - 2 * tx), v = tz * tz * (3 - 2 * tz);
  const a = hash(ix + seed, iz), b = hash(ix + 1 + seed, iz), c = hash(ix + seed, iz + 1), d = hash(ix + 1 + seed, iz + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const smooth = (a: number, b: number, v: number) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
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
function lineDist(x: number, z: number, p: P[], closed = false) {
  let m = 1e9; const n = p.length;
  for (let i = 1; i < n + (closed ? 1 : 0); i++) { const a = p[i - 1], b = p[i % n]; m = Math.min(m, segDist(x, z, a[0], a[1], b[0], b[1])); }
  return m;
}
const nearAny = (x: number, z: number, polys: P[][], r: number) => polys.some((p) => inside(p, x, z) || lineDist(x, z, p, true) < r);
/** Colour every vertex of a geometry and drop uvs, so differently built parts can be merged. */
function paint(g: BufferGeometry, hex: number, jitter = 0, seed = 0, shade = 0) {
  const geo = g.index ? g.toNonIndexed() : g; if (geo !== g) g.dispose();
  geo.deleteAttribute("uv");
  const c = new Color(hex), pos = geo.attributes.position, n = pos.count, a = new Float32Array(n * 3);
  const k = 1 + (hash(seed, 3.7) - 0.5) * jitter;
  let y0 = 1e9, y1 = -1e9;
  if (shade) for (let i = 0; i < n; i++) { const y = pos.getY(i); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  for (let i = 0; i < n; i++) {
    const f = shade ? k * (1 - shade + shade * (pos.getY(i) - y0) / Math.max(0.01, y1 - y0)) : k;
    a[i * 3] = c.r * f; a[i * 3 + 1] = c.g * f; a[i * 3 + 2] = c.b * f;
  }
  geo.setAttribute("color", new Float32BufferAttribute(a, 3));
  return geo;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown; vegCache?: unknown }>; M: { X0: number; Z0: number; RS: number }; vegDirty?: boolean };
type H = (x: number, z: number) => number;

export class DePalm {
  stats = { built: false, seaQuads: 0, palms: 0, palapas: 0, rocks: 0, propTris: 0, vegSkipped: 0, ms: 0 };
  private timer = 0;
  private step = 0;
  private group = new Group();
  constructor(private g: AGame) {
    this.group.name = "aw:depalm";
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** A asks this hook for every palm (p), divi (d), kadushi (k), shrub (s) and rock (r) it places. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      // the water park, the pool deck and the piers are paved; A's scrub and cacti don't belong there
      if (x > -1720 && x < -1440 && z > 5440 && z < 5700 && n !== "p" && (nearAny(x, z, [PARK, POOL], 2.5) || nearAny(x, z, [PIER_F, PIER_SE, PIER_NW], 2))) { this.stats.vegSkipped++; return true; }
      return prev ? prev(x, z, n) : false;
    };
    const W = this.g.real as unknown as World;
    if (W?.regions) {
      let hit = false;
      for (const r of W.regions.values()) if (r.rx === 9 && r.rz === 17 && r.vegCache) { r.vegCache = undefined; hit = true; }
      if (hit) W.vegDirty = true;
    }
  }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    if (this.step >= 2) { // built: hide everything when the camera is far away
      const c = this.g.camera.position, show = Math.hypot(c.x - MIDX, c.z - MIDZ) < SHOW;
      if (this.group.visible !== show) this.group.visible = show;
      return;
    }
    const t0 = performance.now();
    const low = this.g.real?.q?.name === "low";
    if (this.step === 0) {
      const ready = new Set<string>();
      for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
      for (const [x, z] of [[SX0, SZ0], [SX1, SZ0], [SX0, SZ1], [SX1, SZ1]]) if (!ready.has(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`)) return;
    }
    const h: H = (x, z) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    if (this.step === 0) { this.group.add(this.sea(h, low)); this.g.scene.add(this.group); }
    else { this.group.add(this.props(h, low)); this.stats.built = true; window.clearInterval(this.timer); this.timer = window.setInterval(() => this.tick(), 1000); }
    this.step++;
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Lagoon tint: deep teal across the crossing, the pale reef band with the ferries' lane, and the key's reef flat. */
  private sea(h: H, low: boolean): Mesh {
    const S = low ? 10 : 7;
    const nx = Math.ceil((SX1 - SX0) / S) + 1, nz = Math.ceil((SZ1 - SZ0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1), mask = new Float32Array(nx * nz).fill(-1);
    const deep = new Color(0x0f5872), deep2 = new Color(0x11667e), reef = new Color(0x2f9c9a), grass = new Color(0x2a6f62),
      flat = new Color(0x5cc7c0), sand = new Color(0xa9e2d4), c = new Color(), t = new Color();
    const maskAt = (x: number, z: number) => {
      const dC = lineDist(x, z, COAST, true), dR = lineDist(x, z, ROUTE);
      let m = Math.max(1 - smooth(220, 640, dC), 1 - smooth(140, 420, dR));
      m *= smooth(SX0, SX0 + 220, x) * (1 - smooth(SZ1 - 110, SZ1, z)) * smooth(SZ0, SZ0 + 60, z) * (1 - smooth(SX1 - 40, SX1, x));
      m *= 1 - smooth(5330, 5400, z) * smooth(-1070, -1010, x); // keep off the Mangel Halto / Pos Chikito shore
      return m;
    };
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = SX0 + i * S, z = SZ0 + j * S, hh = h(x, z);
      const dC = lineDist(x, z, COAST, true), side = (x - CX) * SWX + (z - CZ) * SWZ, along = (x - CX) * AXX + (z - CZ) * AXZ;
      // deep water, faintly mottled
      c.copy(deep).lerp(deep2, vnoise(x, z, 60));
      // the reef band through the middle of the crossing, with darker seagrass / coral-head patches
      const inR = inside(REEF, x, z), dR = lineDist(x, z, REEF, true), rb = smooth(-18, 22, inR ? dR : -dR);
      t.copy(reef).lerp(grass, smooth(0.45, 0.85, vnoise(x, z, 38, 3)) * 0.5);
      c.lerp(t, rb * 0.9);
      // the ferries' lane across it stays a little deeper
      c.lerp(deep2, (1 - smooth(7, 20, lineDist(x, z, ROUTE))) * rb * 0.55);
      // the key's fringing reef flat: wide on the seaward side, narrow on the lagoon side
      const fw = 18 + 52 * smooth(-25, 45, side);
      const f = 1 - smooth(fw * 0.7, fw * 1.15, dC);
      t.copy(flat).lerp(grass, smooth(0.5, 0.9, vnoise(x, z, 21, 7)) * 0.35);
      c.lerp(t, f);
      c.lerp(sand, (1 - smooth(3, Math.max(8, fw * 0.45), dC)) * 0.85);
      // any shore (key or mainland): pale sand under very shallow water
      c.lerp(sand, smooth(-1.6, -0.25, hh) * 0.6);
      // the seaward flat's outer edge, where it drops off, reads a touch lighter in sections
      const sec = Math.sin(along * 0.07 + Math.sin(along * 0.021) * 2.3) * 0.5 + 0.5;
      const lip = (1 - smooth(2, 12, Math.abs(dC - fw))) * smooth(15, 45, side) * smooth(0.4, 0.9, sec);
      c.lerp(flat, lip * 0.35);
      let a = 0.5 + 0.28 * f;
      const m = maskAt(x, z); mask[k] = m;
      a *= m * (1 - smooth(-0.35, 0.08, hh));
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = SX0 + (i + 0.5) * S, cz = SZ0 + (j + 0.5) * S;
      if (h(cx, cz) > 0.3 || maskAt(cx, cz) < 0.01) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.seaQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(geo, mat); m.name = "aw:depalm:sea";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = (1 - 0.55 * k) * (0.94 + 0.06 * Math.sin(uTime.value * 0.5)); };
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false; // after A's water (renderOrder 2)
    return m;
  }

  /** Piers, the mainland quay and canopy, both ferries, and the island's palms, palapas, water park and rock. */
  private props(h: H, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const add = (g: BufferGeometry, hex: number, jitter = 0, seed = 0, shade = 0) => { parts.push(paint(g, hex, jitter, seed, shade)); };
    const box = (x: number, y: number, z: number, sx: number, sy: number, sz: number, yaw: number, hex: number, shade = 0) => {
      const g = new BoxGeometry(sx, sy, sz); g.translate(0, sy / 2, 0); g.rotateY(yaw); g.translate(x, y, z); add(g, hex, 0.06, x + z, shade);
    };
    const cyl = (x: number, y: number, z: number, r: number, hh: number, hex: number, seg = 6) => {
      const g = new CylinderGeometry(r, r, hh, seg, 1); g.translate(x, y + hh / 2, z); add(g, hex, 0.08, x * 1.3 + z);
    };
    // ---- deck slab from an OSM pier polygon, on piles
    const deck = (poly: P[], top: number, th: number, hex: number, pileStep: number) => {
      const v2 = poly.map(([x, z]) => new Vector2(x, z)), tris = ShapeUtils.triangulateShape(v2, []);
      const pos: number[] = [];
      const tri = (a: number[], b: number[], c: number[]) => {
        const up = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]) > 0; // faces +y?
        if (up) pos.push(...a, ...b, ...c); else pos.push(...a, ...c, ...b);
      };
      for (const [i, j, k] of tris) tri([poly[i][0], top, poly[i][1]], [poly[j][0], top, poly[j][1]], [poly[k][0], top, poly[k][1]]);
      for (let i = 0; i < poly.length; i++) { // edge band, both windings (concave outlines)
        const [ax, az] = poly[i], [bx, bz] = poly[(i + 1) % poly.length], y0 = top - th;
        pos.push(ax, top, az, bx, top, bz, ax, y0, az, bx, top, bz, bx, y0, bz, ax, y0, az);
        pos.push(ax, top, az, ax, y0, az, bx, top, bz, bx, top, bz, ax, y0, az, bx, y0, bz);
        const len = Math.hypot(bx - ax, bz - az), n = Math.floor(len / pileStep);
        for (let s = 0; s <= n; s++) { const t = n ? s / n : 0, px = ax + (bx - ax) * t, pz = az + (bz - az) * t; if (h(px, pz) < 0.1) cyl(px, Math.min(h(px, pz), 0) - 0.3, pz, 0.17, top - th - Math.min(h(px, pz), 0) + 0.3, 0x6b6157, 5); }
      }
      const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      add(g, hex, 0.05, poly[0][0]);
    };
    deck(PIER_F, 1.15, 0.45, 0xb9b3a6, low ? 6 : 4); // ferry landing: light concrete
    deck(PIER_SE, 1.0, 0.3, 0x9b8669, low ? 5 : 3.5); // timber jetties
    deck(PIER_NW, 1.0, 0.3, 0x9b8669, low ? 5 : 3.5);
    // bollards and a railing on the ferry landing's outer face
    {
      const [ax, az] = PIER_F[0], [bx, bz] = PIER_F[1], len = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / len, uz = (bz - az) / len;
      for (let s = 2; s < len; s += 7) box(ax + ux * s + uz * 0.4, 1.15, az + uz * s - ux * 0.4, 0.4, 0.5, 0.4, 0, 0x2d2d2d);
    }
    // ---- mainland quay: concrete deck and face along OSM's coastline, set FO seaward over A's slope
    {
      const pos: number[] = [], cols: number[] = [], cope = new Color(0xbdb9ae), conc = new Color(0x9f9b91), face = new Color(0x8f8b81), wet = new Color(0x4d5551);
      const S: { x: number; z: number; mx: number; mz: number }[] = [];
      for (let i = 0; i + 1 < QUAY.length; i++) {
        const [ax, az] = QUAY[i], [bx, bz] = QUAY[i + 1], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 1.5));
        const mx = -(bz - az) / len, mz = (bx - ax) / len; // seaward normal (-dz, dx) for this chain direction
        for (let k = i > 0 ? 1 : 0; k <= n; k++) {
          let nx = mx, nz = mz;
          if (k === n && i + 2 < QUAY.length) { const [cx, cz] = QUAY[i + 2], l2 = Math.hypot(cx - bx, cz - bz), qx = -(cz - bz) / l2, qz = (cx - bx) / l2, d = 1 + mx * qx + mz * qz; nx = (mx + qx) / d; nz = (mz + qz) / d; }
          S.push({ x: ax + (bx - ax) * k / n, z: az + (bz - az) * k / n, mx: nx, mz: nz });
        }
      }
      let top = 1.0; for (const s of S) for (let w = -8; w <= 0; w += 2) top = Math.max(top, h(s.x + s.mx * w, s.z + s.mz * w) + 0.2);
      top = Math.min(top, 2.6);
      const rows = [FO, FO - 0.5, 0, -3, -6, -9];
      const vtx = (x: number, y: number, z: number, cc: Color) => { pos.push(x, y, z); cols.push(cc.r, cc.g, cc.b); };
      const up = (a: number[], b: number[], c: number[], cc: Color) => { // emit the triangle facing +y
        const f = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]) > 0;
        for (const q of f ? [a, b, c] : [a, c, b]) vtx(q[0], q[1], q[2], cc);
      };
      for (let i = 0; i + 1 < S.length; i++) {
        const A = S[i], B = S[i + 1];
        const yAt = (s: typeof A, w: number) => { const x = s.x + s.mx * w, z = s.z + s.mz * w, gr = h(x, z) + 0.1, r = smooth(-2, -9, w); return Math.max(gr, top * (1 - r) + gr * r); };
        for (let r = 0; r + 1 < rows.length; r++) {
          const w0 = rows[r], w1 = rows[r + 1], cc = r === 0 ? cope : conc;
          const p = [[A.x + A.mx * w0, yAt(A, w0), A.z + A.mz * w0], [B.x + B.mx * w0, yAt(B, w0), B.z + B.mz * w0], [A.x + A.mx * w1, yAt(A, w1), A.z + A.mz * w1], [B.x + B.mx * w1, yAt(B, w1), B.z + B.mz * w1]];
          up(p[0], p[1], p[2], cc); up(p[1], p[3], p[2], cc);
        }
        // vertical face, a wet band at the waterline
        const ax = A.x + A.mx * FO, az = A.z + A.mz * FO, bx = B.x + B.mx * FO, bz = B.z + B.mz * FO, ya = yAt(A, FO), yb = yAt(B, FO);
        for (const [y0a, y1a, y0b, y1b, cc] of [[0.35, ya, 0.35, yb, face], [-1.4, 0.35, -1.4, 0.35, wet]] as [number, number, number, number, Color][]) {
          vtx(ax, y1a, az, cc); vtx(bx, y1b, bz, cc); vtx(ax, y0a, az, cc); vtx(bx, y1b, bz, cc); vtx(bx, y0b, bz, cc); vtx(ax, y0a, az, cc);
          vtx(ax, y1a, az, cc); vtx(ax, y0a, az, cc); vtx(bx, y1b, bz, cc); vtx(bx, y1b, bz, cc); vtx(ax, y0a, az, cc); vtx(bx, y0b, bz, cc); // both sides
        }
        if (i % 2 === 0) { const fx = (ax + bx) / 2 + A.mx * 0.15, fz = (az + bz) / 2 + A.mz * 0.15; box(fx, -0.2, fz, 0.35, Math.max(0.6, (ya + yb) / 2), 0.35, 0, 0x1e1e1e); } // fenders
      }
      const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.setAttribute("color", new Float32BufferAttribute(cols, 3)); g.computeVertexNormals();
      parts.push(g);
      for (const k of [3, Math.floor(S.length / 2), S.length - 4]) { const s = S[Math.max(0, Math.min(S.length - 1, k))]; cyl(s.x + s.mx * (FO - 0.6), top, s.z + s.mz * (FO - 0.6), 0.22, 0.55, 0x2b2b2b, 6); }
      // shade canopy over the gangway from the berth to the ticket side (OSM footway), benches under it
      const [gx0, gz0] = GANG[0], [gx1, gz1] = GANG[1], gl = Math.hypot(gx1 - gx0, gz1 - gz0), ux = (gx1 - gx0) / gl, uz = (gz1 - gz0) / gl, yaw = Math.atan2(-uz, ux);
      const mx = (gx0 + gx1) / 2, mz = (gz0 + gz1) / 2, y0 = Math.max(top, h(mx, mz) + 0.1);
      for (const s of [-gl / 2 + 1, 0, gl / 2 - 1]) for (const w of [-2.3, 2.3]) cyl(mx + ux * s - uz * w, y0, mz + uz * s + ux * w, 0.1, 3.1, 0xe9e9e4, 6);
      box(mx, y0 + 3.1, mz, gl + 1, 0.14, 5.4, yaw, 0xf1f0ea);
      box(mx, y0 + 2.95, mz, gl + 1.1, 0.18, 0.2, yaw, 0x1f6aa8); // fascia trim
      for (const s of [-gl / 4, gl / 4]) box(mx + ux * s - uz * 1.6, y0, mz + uz * s + ux * 1.6, 3, 0.45, 0.5, yaw, 0x7d6a55);
    }
    // ---- the two ferries, one at each landing (white hull, blue stripe, open passenger deck under a canopy)
    const ferry = (x: number, z: number, yaw: number) => {
      const L = 16, B = 4.8, sh = new Shape();
      sh.moveTo(-L / 2, -B / 2); sh.lineTo(L / 2 - 3.5, -B / 2); sh.quadraticCurveTo(L / 2 - 0.6, -B / 2 + 0.6, L / 2, 0); sh.quadraticCurveTo(L / 2 - 0.6, B / 2 - 0.6, L / 2 - 3.5, B / 2); sh.lineTo(-L / 2, B / 2); sh.lineTo(-L / 2, -B / 2);
      const parts0: BufferGeometry[] = [];
      const hull = new ExtrudeGeometry(sh, { depth: 1.7, bevelEnabled: false, curveSegments: 3 }); hull.rotateX(-Math.PI / 2); hull.translate(0, -0.6, 0); parts0.push(paint(hull, 0xf3f3ef));
      const stripe = new ExtrudeGeometry(sh, { depth: 0.28, bevelEnabled: false, curveSegments: 3 }); stripe.scale(1.012, 1.03, 1); stripe.rotateX(-Math.PI / 2); stripe.translate(0, 0.45, 0); parts0.push(paint(stripe, 0x1f64a8));
      const b = (px: number, py: number, pz: number, sx: number, sy: number, sz: number, hex: number) => { const g = new BoxGeometry(sx, sy, sz); g.translate(px, py + sy / 2, pz); parts0.push(paint(g, hex, 0.04, px)); };
      b(-0.8, 1.1, 0, L - 5, 0.12, B - 0.5, 0xc9c6bd); // deck
      for (const px of [-L / 2 + 0.6, -2.5, 2.4]) for (const pz of [-B / 2 + 0.35, B / 2 - 0.35]) b(px, 1.2, pz, 0.1, 2.2, 0.1, 0xe6e6e2); // canopy posts
      b(-1.2, 3.4, 0, L - 5.4, 0.14, B - 0.2, 0x2a78bc); // canopy
      b(4.0, 1.2, 0, 1.8, 1.9, 2.6, 0xf3f3ef); b(4.05, 2.15, 0, 1.84, 0.55, 2.64, 0x24323d); // wheelhouse and its windows
      for (const pz of [-B / 2 + 0.25, B / 2 - 0.25]) b(-1.5, 1.95, pz, L - 6.5, 0.06, 0.06, 0xdedbd2); // rails
      for (let i = 0; i < 5; i++) b(-5.5 + i * 1.6, 1.22, 0, 0.5, 0.42, B - 1.4, 0x3b6f8f); // bench rows
      const g = mergeGeometries(parts0)!; parts0.forEach((p) => p.dispose());
      g.rotateY(yaw); g.translate(x, 0, z); parts.push(g);
    };
    { // island: alongside the landing's outer arm; mainland: alongside the quay face at the terminal node
      const [ax, az] = PIER_F[0], [bx, bz] = PIER_F[1], l = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / l, uz = (bz - az) / l;
      ferry((ax + bx) / 2 + uz * 3.4, (az + bz) / 2 - ux * 3.4, Math.atan2(-uz, ux));
      const [cx, cz] = QUAY[2], [dx, dz] = QUAY[3], l2 = Math.hypot(dx - cx, dz - cz), vx = (dx - cx) / l2, vz = (dz - cz) / l2;
      ferry((cx + dx) / 2 - vz * (FO + 2.7), (cz + dz) / 2 + vx * (FO + 2.7), Math.atan2(-vz, vx));
    }
    // ---- island planting and shade
    const taken: P[] = [];
    const free = (x: number, z: number, r: number) => taken.every(([tx, tz, tr]) => Math.hypot(x - tx, z - tz) > r + tr);
    const onKey = (x: number, z: number) => x > -1720 && inside(COAST, x, z) && h(x, z) > 0.15;
    const clear = (x: number, z: number, r: number) => !nearAny(x, z, BLD, r) && !nearAny(x, z, [POOL, PARK], r + 1) && !nearAny(x, z, [PIER_F, PIER_SE, PIER_NW], r);
    // palapas: thatched shades over pairs of loungers, on the OSM beaches and along the seaward shore
    const palapa = (x: number, z: number, s: number) => {
      const y = h(x, z), yaw = hash(x, z) * 6.283;
      cyl(x, y, z, 0.09, 2.5, 0x7a6248, 5);
      const c1 = new ConeGeometry(1.95, 1.05, low ? 7 : 9, 1); c1.translate(x, y + 2.75, z); add(c1, 0x9c8358, 0.14, s, 0.45);
      const c2 = new ConeGeometry(1.25, 0.6, low ? 6 : 8, 1); c2.translate(x, y + 3.35, z); add(c2, 0x8a734c, 0.1, s + 1, 0.4);
      for (const o of [-0.55, 0.55]) box(x + Math.cos(yaw) * o, y, z - Math.sin(yaw) * o, 0.62, 0.32, 1.85, yaw, 0xeeeeea);
      taken.push([x, z, 2.2]); this.stats.palapas++;
    };
    const pStep = low ? 8.5 : 7;
    for (const bp of BEACHES) {
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const [x, z] of bp) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
      for (let x = x0; x <= x1; x += pStep) for (let z = z0; z <= z1; z += pStep) {
        const px = x + (hash(x, z) - 0.5) * 2.5, pz = z + (hash(z, x) - 0.5) * 2.5;
        if (inside(bp, px, pz) && h(px, pz) > 0.1 && clear(px, pz, 2.2) && free(px, pz, 2.2)) palapa(px, pz, px + pz);
      }
    }
    for (let i = 0; i < COAST.length; i++) { // seaward (south-west) shore of the developed end
      const [ax, az] = COAST[i], [bx, bz] = COAST[(i + 1) % COAST.length], len = Math.hypot(bx - ax, bz - az);
      for (let s = 3; s < len - 3; s += pStep + 1) {
        const t = s / len, x0 = ax + (bx - ax) * t, z0 = az + (bz - az) * t;
        if ((x0 - CX) * SWX + (z0 - CZ) * SWZ < 20 || x0 < -1690 || x0 > -1495) continue;
        const nx = -SWX, nz = -SWZ, x = x0 + nx * 7, z = z0 + nz * 7;
        if (onKey(x, z) && clear(x, z, 2.4) && free(x, z, 2.4)) palapa(x, z, x * 0.7 + z);
      }
    }
    // coconut palms: curved trunks, drooping crowns; denser near the shore and around the pavilions
    const palm = (x: number, z: number, s: number) => {
      const y = h(x, z), hh = 6.5 + hash(s, 1) * 5, lean = 0.6 + hash(s, 2) * 1.6, dir = hash(s, 3) * 6.283, lx = Math.cos(dir) * lean, lz = Math.sin(dir) * lean;
      const tr = new CylinderGeometry(0.17, 0.26, hh, 5, 3, true); tr.translate(0, hh / 2, 0);
      const pa = tr.attributes.position as Float32BufferAttribute;
      for (let v = 0; v < pa.count; v++) { const f = (pa.getY(v) / hh) ** 2; pa.setX(v, pa.getX(v) + lx * f); pa.setZ(v, pa.getZ(v) + lz * f); }
      tr.translate(x, y, z); add(tr, 0x8b7b63, 0.12, s, 0.25);
      const n = low ? 6 : 8;
      for (let k = 0; k < n; k++) {
        const fr = new BoxGeometry(3.4, 0.05, 0.75); fr.translate(1.6, 0, 0); fr.rotateZ(-0.3 - hash(s, k) * 0.35); fr.rotateY((k / n) * 6.283 + hash(k, s));
        fr.translate(x + lx, y + hh, z + lz); add(fr, k % 2 ? 0x4c7a2f : 0x5d8a36, 0.18, s + k);
      }
      taken.push([x, z, 1.6]); this.stats.palms++;
    };
    const maxPalms = low ? 60 : 95;
    for (let x = -1716; x < -1480 && this.stats.palms < maxPalms; x += 5.5) for (let z = 5440; z < 5700 && this.stats.palms < maxPalms; z += 5.5) {
      const px = x + (hash(x, z) - 0.5) * 4, pz = z + (hash(z + 1, x) - 0.5) * 4;
      if (!onKey(px, pz)) continue;
      const nearShore = lineDist(px, pz, COAST, true) < 14, nearB = nearAny(px, pz, BLD, 7);
      if (hash(px * 0.37, pz * 0.71) > (nearShore ? 0.55 : nearB ? 0.45 : 0.18)) continue;
      if (clear(px, pz, 1.4) && free(px, pz, 1.6)) palm(px, pz, px * 1.7 + pz);
    }
    // sea grape / buttonwood stand (OSM wood) and the mangrove at the south-east tip
    for (const [poly, hex, r0, lift] of [[WOOD, 0x46682f, 1.7, 1.3], [MANG, 0x2f4d2b, 1.9, 0.7]] as [P[], number, number, number][]) {
      for (let k = 0; k < (low ? 9 : 14); k++) {
        const [ax, az] = poly[k % poly.length], [bx, bz] = poly[(k * 3 + 2) % poly.length], t = hash(k, ax), x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        if (!inside(poly, x, z) && lineDist(x, z, poly, true) > 1.5) continue;
        const g = new IcosahedronGeometry(1, 0); const r = r0 * (0.8 + hash(x, k) * 0.5); g.scale(r * 1.2, r * 0.75, r); g.translate(x, Math.max(h(x, z), 0) + lift, z);
        add(g, hex, 0.2, x + k, 0.35);
      }
    }
    // breakwaters: rubble mounds on the OSM outlines, at A's waterline
    const stone = [0x9c9385, 0x8b8378, 0xa8a092, 0x7c756c];
    for (const poly of BW) {
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const [x, z] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
      const st = low ? 2.3 : 1.7;
      for (let x = x0; x <= x1; x += st) for (let z = z0; z <= z1; z += st) {
        const px = x + (hash(x, z) - 0.5) * st, pz = z + (hash(z, x) - 0.5) * st;
        if (!inside(poly, px, pz) && lineDist(px, pz, poly, true) > 0.8) continue;
        const g = new IcosahedronGeometry(1, 0), r = 0.6 + hash(px, pz) * 0.55, pa = g.attributes.position as Float32BufferAttribute;
        for (let v = 0; v < pa.count; v++) { const j = 0.78 + 0.44 * hash(px + v * 1.37, pz + v * 0.71); pa.setXYZ(v, pa.getX(v) * j, pa.getY(v) * j, pa.getZ(v) * j); }
        g.computeVertexNormals(); g.scale(r * 1.3, r * 0.8, r); g.rotateY(hash(pz, px) * 3); g.translate(px, Math.max(h(px, pz), -0.9) + r * 0.45, pz);
        add(g, stone[Math.floor(hash(px, 2) * stone.length) % stone.length], 0.2, px); this.stats.rocks++;
      }
    }
    // kids' water park: aqua splash pad on the OSM outline, a play structure with small slides and a bucket
    {
      const v2 = PARK.map(([x, z]) => new Vector2(x, z)), tris = ShapeUtils.triangulateShape(v2, []), pos: number[] = [];
      const py = (x: number, z: number) => h(x, z) + 0.07;
      for (const [i, j, k] of tris) {
        const a = [PARK[i][0], py(PARK[i][0], PARK[i][1]), PARK[i][1]], b = [PARK[j][0], py(PARK[j][0], PARK[j][1]), PARK[j][1]], c = [PARK[k][0], py(PARK[k][0], PARK[k][1]), PARK[k][1]];
        const up = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]) > 0; if (up) pos.push(...a, ...b, ...c); else pos.push(...a, ...c, ...b);
      }
      const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); add(g, 0x55c3dc);
      const px = -1594, pz = 5517, y = h(px, pz), yaw = 0.7;
      for (const [ox, oz] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5], [-2.5, 0], [2.5, 0]]) cyl(px + ox, y, pz + oz, 0.16, 4.6, 0xf2c12e, 6);
      box(px, y + 2.2, pz, 5.6, 0.25, 5.6, yaw, 0xd9452e); box(px, y + 4.6, pz, 6.2, 0.2, 6.2, yaw, 0x2f8fd0);
      const roof = new ConeGeometry(3.2, 1.6, 4, 1); roof.rotateY(Math.PI / 4 + yaw); roof.translate(px, y + 5.6, pz); add(roof, 0xe8742c, 0.05, 1);
      const bucket = new CylinderGeometry(0.9, 0.6, 1.0, 8, 1); bucket.translate(px, y + 6.6, pz); add(bucket, 0x2fa05a);
      for (const s of [-1, 1]) { const sl = new BoxGeometry(1.0, 0.18, 5.2); sl.rotateX(s * 0.42); sl.translate(px + s * 1.4, y + 1.2, pz + s * 4.6); add(sl, s > 0 ? 0x3aa0e0 : 0x8c48c0); }
      for (const [ox, oz] of [[6, 3], [-4, 7], [8, -2]]) { const m = new ConeGeometry(1.1, 0.5, 8, 1); m.rotateX(Math.PI); m.translate(px + ox, y + 2.0, pz + oz); add(m, 0xf26b9a); cyl(px + ox, y, pz + oz, 0.1, 1.8, 0xf26b9a, 5); }
    }
    // body-drop slide tower: stair tower and three twisting tubes down to the splash lanes
    {
      const tx = -1604, tz = 5508, y = h(tx, tz), top = 12.5;
      for (const [ox, oz] of [[-1.6, -1.6], [1.6, -1.6], [-1.6, 1.6], [1.6, 1.6]]) cyl(tx + ox, y, tz + oz, 0.2, top + 2.4, 0xd8d8d2, 6);
      for (let k = 1; k <= 4; k++) box(tx, y + (k * top) / 4 - 0.15, tz, 3.6, 0.3, 3.6, 0, 0xc9c5ba);
      box(tx, y + top + 2.4, tz, 4.2, 0.25, 4.2, 0, 0x2f8fd0);
      const cols = [0xe8742c, 0x2a7fd0, 0xf2c12e];
      for (let k = 0; k < 3; k++) {
        const pts: Vector3[] = [], a0 = k * 2.1, turns = 1.5 + k * 0.25, R = 3.4 + k * 0.7;
        for (let i = 0; i <= 24; i++) {
          const t = i / 24, a = a0 + t * turns * 6.283, r = 1.8 + (R - 1.8) * Math.min(1, t * 3);
          pts.push(new Vector3(tx + Math.cos(a) * r, y + top - t * (top - 0.9) - (k === 2 ? 0 : 0.6), tz + Math.sin(a) * r));
        }
        const tube = new TubeGeometry(new CatmullRomCurve3(pts), low ? 30 : 48, 0.55, low ? 6 : 8, false);
        add(tube, cols[k], 0.05, k);
      }
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere(); this.stats.propTris = geo.attributes.position.count / 3;
    const mat = new MeshLambertMaterial({ vertexColors: true });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:depalm:props"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x4a5568);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }
}
