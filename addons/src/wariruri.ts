// Wariruri (windward north coast, the bay ~1 km north-west of the Bushiribana ruins) accuracy pass. Off with
// ?wariruri=0. A draws the bay as its generic tan ground meeting an even turquoise shore band with a thin foam
// line, so the small sand pocket, its limestone arch and the rocky windward shore don't read at all.
// The references show a ~60 x 60 m cove of coarse pale sand with coral rubble, set in a low shore of dark,
// pitted fossil-reef limestone (ironshore) that drops straight into deep blue water. The swell breaks across the
// cove in two or three lines (the island's surf spot), the whitewater runs along the north side of the bay, and
// on the east side there is only a narrow spray line under the rock lip. At the cove's east corner the sea has
// cut a short tunnel through the rock, the "Small Natural Bridge": a wide low arch (opening ~11 m across,
// ~3.5 m high) with a sand floor, orange-brown underside and grey weathered deck. Behind the beach is a flat of
// pale sand with low green mats and scrub, and an ATA beach sign stands where the track reaches the sand.
// Geometry is OSM (coastline 1109093687, Wariruri Beach 461642877, sand 461642878, Small Natural Bridge node
// 6859250985) and A's region roads, rebuilt in code. Surf widths were read off Sentinel-2 imagery; photos are
// reference only. 5 draw calls: one water tint sheet, one surf mesh, one sand sheet, one merged rock mesh (shore
// lip, boulders, arch, sign), one InstancedMesh of vegetation. Built once in 4 steps on 1.5 s ticks after the
// height regions under the bay have streamed in; per frame only a colour/opacity lerp. Hidden past 2.8 km.
import {
  BoxGeometry, BufferGeometry, Color, DoubleSide, Euler, Float32BufferAttribute, Group, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// game metres (x east, z south). COAST: OSM coastline from the bay's east end (x -1298) west to the cove and
// north to the bay's north point; on a north-up map the water is on its right. BEACH / FLAT: the OSM beach and sand rings.
// ROADS (ax, az, bx, bz, clearance): A's region roads (the north-coast track behind the beach).
const COAST: P[] = [[-1298.2,-4206.3],[-1308.3,-4204.3],[-1321.7,-4198.2],[-1348.0,-4179.7],[-1365.0,-4161.1],[-1369.3,-4151.0],[-1372.4,-4135.1],[-1378.0,-4132.0],[-1381.0,-4132.5],[-1385.6,-4139.4],[-1392.7,-4145.2],[-1415.6,-4149.9],[-1428.9,-4147.4],[-1439.1,-4143.1],[-1454.2,-4142.4],[-1462.8,-4139.6],[-1469.6,-4134.2],[-1474.0,-4133.0],[-1481.0,-4135.1],[-1500.7,-4132.9],[-1508.4,-4136.2],[-1525.1,-4148.8],[-1553.7,-4152.2],[-1571.3,-4156.4],[-1577.4,-4159.4],[-1586.7,-4168.0],[-1606.3,-4170.4],[-1611.6,-4169.9],[-1613.5,-4166.8],[-1636.0,-4174.9],[-1646.1,-4182.8],[-1662.3,-4201.7],[-1706.4,-4226.3],[-1717.8,-4239.0],[-1724.0,-4240.9],[-1734.4,-4240.8],[-1757.8,-4246.0],[-1769.9,-4260.2],[-1784.1,-4263.9],[-1794.5,-4269.6],[-1800.2,-4279.3],[-1807.3,-4284.9],[-1832.1,-4285.9],[-1842.1,-4283.3],[-1854.0,-4273.7],[-1863.0,-4275.8],[-1871.6,-4280.1],[-1874.3,-4287.5],[-1872.5,-4299.9],[-1863.7,-4310.0],[-1865.6,-4313.3],[-1873.0,-4311.3],[-1885.2,-4305.1],[-1888.9,-4298.3],[-1890.8,-4297.5],[-1906.2,-4298.2],[-1926.5,-4311.5],[-1933.2,-4308.2],[-1943.9,-4315.0],[-1979.2,-4345.7],[-1978.0,-4349.2],[-1982.9,-4372.4],[-1982.5,-4388.4],[-1985.4,-4404.0],[-1984.0,-4416.0],[-1989.2,-4427.9],[-1987.7,-4433.1],[-1990.2,-4436.0],[-1990.6,-4446.0],[-1998.4,-4457.6],[-1997.4,-4460.2],[-2001.2,-4467.9],[-2006.4,-4475.0],[-2009.1,-4476.1],[-2010.2,-4480.5],[-2008.2,-4481.5],[-2008.5,-4483.3]];
const BEACH: P[] = [[-1992.0,-4349.4],[-1940.1,-4312.4],[-1948.9,-4307.7],[-1954.8,-4293.2],[-1945.5,-4287.7],[-1940.5,-4286.3],[-1936.7,-4281.1],[-1944.3,-4257.6],[-1958.9,-4274.7],[-1995.0,-4295.0],[-2017.7,-4316.1],[-2009.0,-4318.1],[-1996.2,-4334.3],[-1996.8,-4342.7]];
const FLAT: P[] = [[-2017.7,-4316.1],[-2009.0,-4318.1],[-1996.2,-4334.3],[-2004.9,-4391.9],[-2017.7,-4389.6],[-2031.7,-4376.0],[-2065.5,-4409.3],[-2073.7,-4409.6],[-2088.9,-4397.7],[-2102.9,-4380.6],[-2113.9,-4371.1],[-2123.8,-4371.1],[-2128.5,-4368.8],[-2137.8,-4367.3],[-2144.8,-4359.5],[-2142.5,-4349.4],[-2132.0,-4350.5],[-2139.0,-4345.6],[-2136.1,-4336.6],[-2125.0,-4344.4],[-2124.4,-4339.2],[-2135.9,-4336.2],[-2127.9,-4322.7],[-2120.9,-4332.9],[-2120.9,-4325.3],[-2125.0,-4317.8],[-2114.8,-4308.8],[-2100.8,-4301.0],[-2085.7,-4287.4],[-2075.2,-4280.8],[-2061.2,-4275.9],[-2031.7,-4269.5],[-2016.3,-4250.7],[-1966.2,-4223.2],[-1959.7,-4232.7],[-1952.7,-4237.4],[-1944.3,-4257.6],[-1958.9,-4274.7],[-1995.0,-4295.0]];
const ROADS: number[][] = [[-2125.97,-4438.16,-2115.97,-4405.37,6.0],[-2115.97,-4405.37,-2109.74,-4386.46,6.0],[-2109.74,-4386.46,-2108.51,-4381.02,6.0],[-2108.51,-4381.02,-2107.29,-4374.0,6.0],[-2107.29,-4374.0,-2106.62,-4367.07,6.0],[-2106.62,-4367.07,-2106.54,-4359.39,6.0],[-2106.54,-4359.39,-2108.98,-4330.45,6.0],[-2108.98,-4330.45,-2109.46,-4326.8,6.0],[-2109.46,-4326.8,-2109.12,-4323.01,6.0],[-2109.12,-4323.01,-2108.42,-4319.03,6.0],[-2108.42,-4319.03,-2107.29,-4315.56,6.0],[-2107.29,-4315.56,-2104.55,-4310.97,6.0],[-2104.55,-4310.97,-2100.68,-4306.57,6.0],[-2100.68,-4306.57,-2094.08,-4300.02,6.0],[-2094.08,-4300.02,-2083.89,-4291.39,6.0],[-2083.89,-4291.39,-2073.51,-4284.46,6.0],[-2073.51,-4284.46,-2068.89,-4282.1,6.0],[-2068.89,-4282.1,-2065.54,-4280.4,6.0],[-2065.54,-4280.4,-2050.27,-4275.8,6.0],[-2050.27,-4275.8,-2042.63,-4273.64,6.0],[-2042.63,-4273.64,-2037.34,-4272.15,6.0],[-2037.34,-4272.15,-2032.71,-4270.09,6.0],[-2032.71,-4270.09,-2031.66,-4269.54,6.0],[-2031.66,-4269.54,-2030.29,-4268.82,6.0],[-2030.29,-4268.82,-2027.53,-4267.37,6.0],[-2027.53,-4267.37,-2024.23,-4264.57,6.0],[-2024.23,-4264.57,-2016.77,-4256.32,6.0],[-2016.77,-4256.32,-2012.44,-4251.92,6.0],[-2012.44,-4251.92,-2007.06,-4247.99,6.0],[-2007.06,-4247.99,-1971.68,-4230.19,6.0],[-1971.68,-4230.19,-1965.56,-4227.1,6.0],[-1965.56,-4227.1,-1963.59,-4226.04,6.0],[-1963.59,-4226.04,-1958.57,-4223.36,6.0],[-1958.57,-4223.36,-1950.46,-4218.11,6.0],[-1950.46,-4218.11,-1944.7,-4213.33,6.0],[-1944.7,-4213.33,-1930.37,-4201.16,6.0],[-1930.37,-4201.16,-1926.6,-4198.17,6.0],[-2030.29,-4268.82,-2025.36,-4269.15,4.8],[-2025.36,-4269.15,-2022.05,-4269.24,4.8],[-2022.05,-4269.24,-2017.82,-4269.62,4.8],[-2017.82,-4269.62,-2014.51,-4270.37,4.8],[-2014.51,-4270.37,-2012.51,-4270.86,4.8],[-2012.51,-4270.86,-2010.64,-4271.31,4.8],[-2010.64,-4271.31,-2006.11,-4271.77,4.8],[-2006.11,-4271.77,-2002.72,-4271.59,4.8],[-2002.72,-4271.59,-1997.06,-4270.65,4.8],[-1997.06,-4270.65,-1990.93,-4268.68,4.8],[-1990.93,-4268.68,-1984.89,-4265.87,4.8],[-1984.89,-4265.87,-1978.38,-4262.22,4.8],[-1978.38,-4262.22,-1974.04,-4258.56,4.8],[-1974.04,-4258.56,-1969.99,-4253.89,4.8],[-1969.99,-4253.89,-1966.22,-4249.2,4.8],[-1966.22,-4249.2,-1964.33,-4245.83,4.8],[-1964.33,-4245.83,-1963.2,-4242.08,4.8],[-1963.2,-4242.08,-1962.82,-4237.77,4.8],[-1962.82,-4237.77,-1962.82,-4236.9,4.8],[-1962.82,-4236.9,-1962.82,-4232.16,4.8],[-1962.82,-4232.16,-1963.59,-4226.04,4.8],[-2116.76,-4433.62,-2112.24,-4432.11,4.8],[-2112.24,-4432.11,-2106.76,-4431.36,4.8],[-2106.76,-4431.36,-2099.97,-4430.24,4.8],[-2099.97,-4430.24,-2092.81,-4429.12,4.8],[-2092.81,-4429.12,-2084.88,-4426.68,4.8],[-2084.88,-4426.68,-2078.47,-4423.5,4.8],[-2078.47,-4423.5,-2069.23,-4416.95,4.8],[-2069.23,-4416.95,-2060.93,-4408.32,4.8],[-2060.93,-4408.32,-2048.47,-4392.97,4.8],[-2048.47,-4392.97,-2034.32,-4373.29,4.8],[-2034.32,-4373.29,-2028.66,-4365.25,4.8],[-2028.66,-4365.25,-2022.43,-4357.56,4.8],[-2022.43,-4357.56,-2017.15,-4350.26,4.8],[-2017.15,-4350.26,-2015.46,-4345.58,4.8],[-2015.46,-4345.58,-2013.95,-4339.58,4.8],[-2013.95,-4339.58,-2013.57,-4332.65,4.8],[-2013.57,-4332.65,-2013.95,-4322.91,4.8],[-2013.95,-4322.91,-2013.75,-4318.05,4.8],[-2013.75,-4318.05,-2012.62,-4312.98,4.8],[-2012.62,-4312.98,-2010.36,-4307.74,4.8],[-2010.36,-4307.74,-2007.72,-4299.31,4.8],[-2007.72,-4299.31,-2006.21,-4290.7,4.8],[-2006.21,-4290.7,-2006.77,-4284.32,4.8],[-2006.77,-4284.32,-2009.8,-4278.14,4.8],[-2009.8,-4278.14,-2012.51,-4270.86,4.8],[-1398.52,-4085.49,-1391.26,-4089.7,6.0],[-1391.26,-4089.7,-1384.75,-4094.29,6.0],[-1384.75,-4094.29,-1381.11,-4097.29,6.0],[-1381.11,-4097.29,-1379.19,-4098.88,6.0],[-1379.19,-4098.88,-1375.41,-4103.19,6.0],[-1375.41,-4103.19,-1371.64,-4108.34,6.0],[-1371.64,-4108.34,-1368.33,-4114.33,6.0],[-1368.33,-4114.33,-1357.87,-4142.62,6.0],[-1357.87,-4142.62,-1355.89,-4146.37,6.0],[-1355.89,-4146.37,-1352.87,-4150.77,6.0],[-1352.87,-4150.77,-1349.47,-4153.76,6.0],[-1349.47,-4153.76,-1345.23,-4156.58,6.0],[-1345.23,-4156.58,-1341.26,-4158.55,6.0],[-1341.26,-4158.55,-1336.36,-4159.85,6.0],[-1336.36,-4159.85,-1330.32,-4160.33,6.0],[-1330.32,-4160.33,-1326.36,-4160.23,6.0],[-1326.36,-4160.23,-1321.17,-4159.48,6.0],[-1321.17,-4159.48,-1317.21,-4158.07,6.0],[-1317.21,-4158.07,-1298.15,-4149.36,6.0],[-1672.46,-4135.6,-1664.35,-4143.84,4.8],[-1664.35,-4143.84,-1657.18,-4150.03,4.8],[-1657.18,-4150.03,-1650.39,-4153.95,4.8],[-1650.39,-4153.95,-1640.88,-4158.53,4.8],[-1690.38,-4165.0,-1673.21,-4164.44,4.8],[-1673.21,-4164.44,-1653.6,-4162.2,4.8],[-1653.6,-4162.2,-1640.88,-4158.53,4.8],[-1640.88,-4158.53,-1625.67,-4154.14,4.8],[-1625.67,-4154.14,-1606.24,-4147.39,4.8],[-1606.24,-4147.39,-1586.99,-4141.78,4.8],[-1586.99,-4141.78,-1573.22,-4135.22,4.8],[-1573.22,-4135.22,-1561.72,-4129.42,4.8],[-1561.72,-4129.42,-1548.33,-4123.04,4.8],[-1548.33,-4123.04,-1537.57,-4118.93,4.8],[-1537.57,-4118.93,-1529.45,-4117.05,4.8],[-1529.45,-4117.05,-1520.78,-4117.05,4.8],[-1520.78,-4117.05,-1508.71,-4118.74,4.8],[-1508.71,-4118.74,-1496.63,-4121.17,4.8],[-1496.63,-4121.17,-1474.74,-4124.36,4.8],[-1474.74,-4124.36,-1454.37,-4124.17,4.8],[-1454.37,-4124.17,-1436.63,-4120.99,4.8],[-1436.63,-4120.99,-1420.97,-4115.92,4.8],[-1420.97,-4115.92,-1403.62,-4109.37,4.8],[-1403.62,-4109.37,-1392.11,-4104.13,4.8],[-1392.11,-4104.13,-1381.11,-4097.29,4.8]];
const BRIDGE: P = [-1932.3, -4296.8]; // OSM node 6859250985
// the arch: centre, unit axis toward the sea, and the across direction (east). It sits in the rock notch the OSM
// beach ring leaves out at the cove's east corner, with its sand floor on A's low ground (~1.2 m).
const ARCH = { x: BRIDGE[0] - 8.7, z: BRIDGE[1] - 2.2, ax: 0.25, az: -0.968, t0: -7, t1: 8, wo: 12, wi: 5.5, top: 6, open: 3.4 };
const ROCK_E = COAST.slice(0, 59); // east shore to the cove's east corner
const ROCK_N = COAST.slice(59 + 1); // north shore from the cove's west end to the bay's north point
const BEACH_W: P[] = [COAST[58], COAST[59]]; // the beach waterline
const SIGN = { x: -1968, z: -4264, fx: -0.59, fz: 0.81 }; // ATA beach sign at the end of the track, facing it
const WATER_Y = 0.05;
const MIDX = -1700, MIDZ = -4300, SHOW = 2800;
const X0 = -2070, X1 = -1265, Z0 = -4535, Z1 = -4110; // the water sheet's box

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
const smooth = (a: number, b: number, v: number) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
function pip(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const a = p[i], b = p[j];
    if ((a[1] > z) !== (b[1] > z) && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  const ex = x - ax - t * dx, ez = z - az - t * dz;
  return Math.sqrt(ex * ex + ez * ez);
}
function lineDist(x: number, z: number, p: P[], closed = false) {
  let m = 1e9;
  for (let i = 1; i < p.length; i++) m = Math.min(m, segDist(x, z, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1]));
  if (closed && p.length > 2) m = Math.min(m, segDist(x, z, p[p.length - 1][0], p[p.length - 1][1], p[0][0], p[0][1]));
  return m;
}
function bbox(pts: P[], pad: number) {
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (const [x, z] of pts) { x0 = Math.min(x0, x - pad); x1 = Math.max(x1, x + pad); z0 = Math.min(z0, z - pad); z1 = Math.max(z1, z + pad); }
  return { x0, x1, z0, z1 };
}
/** Points every `step` metres along a polyline. */
function resample(L: P[], step: number) {
  const out: P[] = [];
  for (let i = 1; i < L.length; i++) {
    const [ax, az] = L[i - 1], [bx, bz] = L[i], n = Math.max(1, Math.round(Math.hypot(bx - ax, bz - az) / step));
    for (let k = i > 1 ? 1 : 0; k <= n; k++) out.push([ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n]);
  }
  return out;
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
const archDist = (x: number, z: number) => Math.hypot(x - ARCH.x, z - ARCH.z);
/** Distance past the nearest road's clearance (negative on the road), capped at 8 m. */
function roadGap(x: number, z: number) {
  let m = 8;
  for (const [ax, az, bx, bz, r] of ROADS) {
    if (x < Math.min(ax, bx) - r - m || x > Math.max(ax, bx) + r + m || z < Math.min(az, bz) - r - m || z > Math.max(az, bz) + r + m) continue;
    m = Math.min(m, segDist(x, z, ax, az, bx, bz) - r);
  }
  return m;
}
const clear = (x: number, z: number) => roadGap(x, z) >= 0;

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown; vegCache?: unknown }>; M: { X0: number; Z0: number; RS: number }; vegDirty?: boolean };
type H = (x: number, z: number) => number;

export class Wariruri {
  stats = { built: false, seaQuads: 0, surfQuads: 0, sandQuads: 0, rockQuads: 0, rocks: 0, archTris: 0, clumps: 0, vegSkipped: 0, ms: 0, part: {} as Record<string, number> };
  private timer = 0;
  private step = 0;
  private group = new Group();
  constructor(private g: AGame) {
    this.group.name = "aw:wariruri";
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** A asks this hook for every palm, divi, kadushi, shrub and rock it places: keep them off the beach and the arch. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if (x > -2025 && x < -1920 && z > -4355 && z < -4250 && (archDist(x, z) < 15 || pip(BEACH, x, z))) { this.stats.vegSkipped++; return true; }
      return prev ? prev(x, z, n) : false;
    };
    const W = this.g.real as unknown as World;
    if (W?.regions) {
      let hit = false;
      for (const r of W.regions.values()) if (r.rx === 8 && r.rz === 7 && r.vegCache) { r.vegCache = undefined; hit = true; }
      if (hit) W.vegDirty = true;
    }
  }

  private timed<T>(k: string, f: () => T): T { const t = performance.now(); const r = f(); this.stats.part[k] = Math.round(performance.now() - t); return r; }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    if (this.step >= 4) { // built: hide everything when the camera is far away
      const c = this.g.camera.position, show = Math.hypot(c.x - MIDX, c.z - MIDZ) < SHOW;
      if (this.group.visible !== show) this.group.visible = show;
      return;
    }
    if (this.step === 0) {
      const ready = new Set<string>();
      for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
      for (const [x, z] of [[-2150, Z0], [X1, Z0], [-2150, Z1], [X1, Z1]]) if (!ready.has(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`)) return;
    }
    const t0 = performance.now();
    const low = this.g.real?.q?.name === "low";
    const h: H = (x, z) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    // one part per tick, so the one-off build cost is spread out
    if (this.step === 0) { this.group.add(this.timed("sea", () => this.sea(low)), this.timed("surf", () => this.surf(h, low))); this.g.scene.add(this.group); }
    else if (this.step === 1) this.group.add(this.timed("sand", () => this.sand(h, low)));
    else if (this.step === 2) this.group.add(this.timed("rocks", () => this.rocks(h, low)));
    else { this.group.add(this.timed("veg", () => this.veg(h, low))); this.stats.built = true; window.clearInterval(this.timer); this.timer = window.setInterval(() => this.tick(), 1000); }
    this.step++;
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Water tint: the pale-bottomed sand pocket off the beach, dark rock shelf under the windward lip, deep blue-teal
   * across the rest of the bay where A has its even turquoise band, fading out past the bay's mouth. */
  private sea(low: boolean): Mesh {
    const S = low ? 8 : 6, FADE = 45;
    const x0 = Math.floor(X0 / S) * S, z0 = Math.floor(Z0 / S) * S;
    const nx = Math.ceil((X1 - x0) / S) + 1, nz = Math.ceil((Z1 - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const M0 = COAST[COAST.length - 1], M1 = COAST[0]; // the bay's mouth
    const deep = new Color(0x15587c), shelf = new Color(0x22657a), weed = new Color(0x2f5550), mid = new Color(0x3db0b2),
      near = new Color(0x86d8cb), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S;
      const inBay = pip(COAST, x, z), dM = segDist(x, z, M0[0], M0[1], M1[0], M1[1]);
      const dB = lineDist(x, z, BEACH_W), dR = Math.min(lineDist(x, z, ROCK_E), lineDist(x, z, ROCK_N));
      // the sand pocket: aqua over the sand bottom in front of the beach, paling right at the sand
      const pocket = 1 - smooth(15, 75, dB);
      c.copy(deep).lerp(mid, pocket * 0.8).lerp(near, (1 - smooth(3, 26, dB)) * 0.55);
      // the rock shelf under the lip: dark, with weed and rock patches
      const sh = (1 - smooth(3, 24, dR)) * (1 - pocket);
      const n = Math.sin(x * 0.11 + Math.sin(z * 0.07) * 2.3) * Math.sin(z * 0.09 + Math.sin(x * 0.05) * 1.9);
      c.lerp(shelf, sh * 0.8).lerp(weed, sh * Math.max(0, n) * 0.6);
      // deep blue close in under the rock (A has a wide turquoise band here); A's own deep sea further out
      let a = 0.26 + 0.24 * (1 - smooth(20, 70, dR)) * (1 - pocket) + 0.22 * pocket + 0.08 * sh;
      a *= 0.55 + 0.45 * smooth(1, 6, Math.min(dB, dR)); // A's shore foam shows through at the waterline
      if (!inBay) a *= 1 - smooth(0, FADE, dM);
      a *= smooth(X0, X0 + 30, x) * (1 - smooth(X1 - 40, X1, x)) * smooth(Z0, Z0 + 30, z); // soft box edges
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, Math.max(0, a));
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (!pip(COAST, cx, cz) && segDist(cx, cz, M0[0], M0[1], M1[0], M1[1]) > FADE) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.seaQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(geo, mat); m.name = "aw:wariruri:sea";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = 1 - 0.55 * k; };
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false; // after A's water (renderOrder 2)
    return m;
  }

  /** Breakers: two or three broken lines across the cove, wide whitewater along the north side, a thin spray line
   * under the rock lip on the east side. Each line is a 4-vertex strip: seaward lip, crest, whitewater, trailing wash. */
  private surf(h: H, low: boolean): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const Y = WATER_Y + 0.3;
    const strip = (pts: P[], nrm: P[], w: (s: number, i: number) => number, amp: (s: number, i: number) => number, seed: number) => {
      let prev = -1, s0 = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x, z] = pts[i], [nx, nz] = nrm[i];
        if (i) s0 += Math.hypot(x - pts[i - 1][0], z - pts[i - 1][1]);
        // only over open water; the whitewater is cut short where it would run up onto A's ground
        if (h(x, z) > -0.15) { prev = -1; continue; }
        let ww = w(s0, i);
        for (let k = 0; k < 3 && h(x - nx * ww, z - nz * ww) > 0.3; k++) ww *= 0.6;
        const sec = Math.sin(s0 * 0.07 + seed + Math.sin(s0 * 0.023 + seed) * 2.7) * 0.5 + 0.5;
        const a = amp(s0, i) * (0.45 + 0.55 * smooth(0.2, 0.7, sec)) * (0.8 + 0.2 * hash(i + seed * 13, 2));
        const hc = 1.8 * a * (0.8 + 0.4 * hash(s0, seed));
        const base = pos.length / 3;
        pos.push(x + nx * 4, Y, z + nz * 4, x, Y + hc, z, x - nx * ww * 0.4, Y + hc * 0.25, z - nz * ww * 0.4, x - nx * ww, Y, z - nz * ww);
        const wash = 0.45 + 0.5 * hash(Math.floor(s0 / 6) + seed, 11);
        col.push(1, 1, 1, a * 0.3, 1, 1, 1, a, 1, 1, 1, a * wash, 1, 1, 1, a * wash * 0.15);
        if (prev >= 0) { for (let r = 0; r < 3; r++) idx.push(prev + r, base + r, prev + r + 1, prev + r + 1, base + r, base + r + 1); this.stats.surfQuads += 3; }
        prev = base;
      }
    };
    const step = low ? 4 : 3;
    // along the rocky shore: (-dz, dx) of the line direction points out to sea
    const shore = (L: P[], off: (s: number) => number, w: (s: number) => number, amp: (s: number) => number, seed: number) => {
      const pts = resample(L, step), nrm: P[] = [], out: P[] = [];
      let s = 0;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 2)], b = pts[Math.min(pts.length - 1, i + 2)], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
        if (i) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        const nx = -dz / l, nz = dx / l, o = off(s) + Math.sin(s * 0.09 + seed) * 1.2;
        nrm.push([nx, nz]); out.push([pts[i][0] + nx * o, pts[i][1] + nz * o]);
      }
      let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      strip(out, nrm, (s0) => w(s0), (s0) => amp(s0) * smooth(0, 25, s0) * (1 - smooth(tot - 25, tot, s0)), seed);
    };
    // east side: a narrow spray line under the lip, brighter on the points
    shore(ROCK_E, () => 3.5, (s) => 5 + 3 * (0.5 + 0.5 * Math.sin(s * 0.05)), () => 0.85, 1.3);
    // north side: the whitewater runs wide from the cove up to the bay's north point
    shore(ROCK_N, (s) => 8 + 6 * smooth(20, 90, s), (s) => 12 + 9 * smooth(10, 80, s), () => 0.95, 4.1);
    // the beach break: arcs around a point behind the beach, two or three lines with gaps (left and right peaks)
    const [bx0, bz0] = BEACH_W[0], [bx1, bz1] = BEACH_W[1];
    const mx = (bx0 + bx1) / 2, mz = (bz0 + bz1) / 2, ux = (bx1 - bx0), uz = (bz1 - bz0), ul = Math.hypot(ux, uz);
    let snx = uz / ul, snz = -ux / ul; if (h(mx + snx * 20, mz + snz * 20) > h(mx - snx * 20, mz - snz * 20)) { snx = -snx; snz = -snz; }
    const cx = mx - snx * 28, cz = mz - snz * 28, a0 = Math.atan2(snz, snx);
    [[14, 1.0, 14], [30, 0.95, 17], [52, 0.8, 20]].forEach(([r0, amp, ww], li) => {
      const R = 28 + r0, n = Math.ceil((R * 2.4) / step), pts: P[] = [], nrm: P[] = [];
      for (let k = 0; k <= n; k++) {
        const t = a0 - 1.2 + (2.4 * k) / n, rr = R + Math.sin(t * 5 + li) * 2.5;
        pts.push([cx + Math.cos(t) * rr, cz + Math.sin(t) * rr]); nrm.push([Math.cos(t), Math.sin(t)]);
      }
      strip(pts, nrm, () => ww, (s) => amp * smooth(0, 12, s) * (1 - smooth(R * 2.4 - 12, R * 2.4, s)), 7.7 + li * 3.1);
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:wariruri:surf";
    const day = new Color(0xf6fcff), night = new Color(0x2a3a4c);
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value); mat.opacity = 0.8 + 0.2 * Math.sin(uTime.value * 0.9 + 0.4); };
    m.renderOrder = 4; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  /** Coarse pale beach sand with rubble specks (and under the arch), the sand flat behind it with green mats. */
  private sand(h: H, low: boolean): Mesh {
    const S = low ? 4 : 3;
    const tunnel = (x: number, z: number) => {
      const dx = x - ARCH.x, dz = z - ARCH.z, t = dx * ARCH.ax + dz * ARCH.az, u = dx * -ARCH.az + dz * ARCH.ax;
      return t > ARCH.t0 - 2 && t < ARCH.t1 && Math.abs(u) < ARCH.wi + 1;
    };
    const inU = (x: number, z: number) => pip(BEACH, x, z) || pip(FLAT, x, z) || tunnel(x, z);
    let { x0, x1, z0, z1 } = bbox([...BEACH, ...FLAT], S);
    x0 = Math.floor(x0 / S) * S; z0 = Math.floor(z0 / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 2, nz = Math.ceil((z1 - z0) / S) + 2;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const beachC = new Color(0xddd0b5), wetC = new Color(0xb8ab92), pebC = new Color(0x948d80), coralC = new Color(0xf3eee2),
      flatC = new Color(0xdcd0b6), matC = new Color(0x7f9550), dirtC = new Color(0xcdb898), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, y = h(x, z);
      const onBeach = pip(BEACH, x, z) || tunnel(x, z);
      if (onBeach) {
        c.copy(beachC).lerp(wetC, 1 - smooth(0.2, 1.0, y));
        const sp = hash(x * 0.9, z * 1.3);
        if (sp > 0.82) c.lerp(pebC, 0.5); else if (sp < 0.08) c.lerp(coralC, 0.6); // pebbles and coral rubble
      } else {
        c.copy(flatC);
        const n = Math.sin(x * 0.13 + Math.sin(z * 0.09) * 2.1) * Math.sin(z * 0.11 + Math.sin(x * 0.07) * 1.6);
        c.lerp(matC, Math.max(0, n - 0.2) * 0.9); // green mats on the flat
        c.lerp(dirtC, Math.max(0, -n - 0.5) * 0.6);
      }
      c.multiplyScalar(0.96 + hash(x * 0.37, z * 0.41) * 0.06);
      // fade in from the outline of the beach + flat + tunnel floor (sampled, so the shared beach/flat edge has no seam)
      let inside = inU(x, z) ? 2 : 0;
      for (let q = 0; q < 8; q++) for (const rr of [3, 6.5]) if (inU(x + Math.cos(q * 0.785 + rr) * rr, z + Math.sin(q * 0.785 + rr) * rr)) inside++;
      const edge = smooth(9, 18, inside); // 0 on the outline, so the cut cells don't show an edge
      const a = edge * (onBeach ? 0.82 : 0.6) * smooth(-0.1, 0.25, y) * smooth(0.5, 3.5, roadGap(x, z));
      pos.push(x, y + 0.1, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (!inU(cx, cz)) continue;
      if (roadGap(cx, cz) < 1.5 || h(cx, cz) < -0.3) continue; // A draws the track (a north-coast add-on may lay a dirt ribbon on it); the sand fades out short of it
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.sandQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const m = new Mesh(geo, mat); m.name = "aw:wariruri:sand";
    const dim = new Color(0x2c3448); // A's ground goes dark at night: keep the pale sand from glowing
    m.onBeforeRender = () => { const k = uNight.value; mat.color.setHex(0xffffff).lerp(dim, k); mat.opacity = 1 - 0.7 * k; };
    m.renderOrder = 1; m.castShadow = false; m.receiveShadow = true;
    return m;
  }

  /** The ironshore lip along the rocky shore, fallen blocks at its foot, the Small Natural Bridge and the beach sign. */
  private rocks(h: H, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const step = low ? 4 : 3;
    const rockC = new Color(0x6c675f), pitC = new Color(0x46433e), capC = new Color(0x7f7a70), wetC = new Color(0x4b4842), c = new Color();
    const blocks = [0x5f5b54, 0x6f6a61, 0x4f4c47, 0x7b766c];
    const rock = (x: number, z: number, sx: number, sy: number, sz: number, hex: number, seed: number) => {
      const g = new IcosahedronGeometry(1, 0);
      const pa = g.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < pa.count; i++) { const j = 0.7 + 0.6 * hash(seed + i * 1.37, i); pa.setXYZ(i, pa.getX(i) * j, pa.getY(i) * j, pa.getZ(i) * j); }
      g.rotateY(hash(seed, 9) * 6.28); g.scale(sx, sy, sz); g.translate(x, Math.max(-0.4, h(x, z)) + sy * 0.25, z);
      parts.push(paint(g, hex, 0.3, seed)); this.stats.rocks++;
    };
    // the lip: rows from the foot in the water up the face to the lip, then a cap a few metres inland
    for (const [li, L] of [ROCK_E, ROCK_N].entries()) {
      const pts = resample(L, step);
      let tot = 0; for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      let prev = -1, s = 0;
      pts.forEach(([x, z], i) => {
        if (i) s += Math.hypot(x - pts[i - 1][0], z - pts[i - 1][1]);
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1;
        const ux = dz / l, uz = -dx / l; // inland
        if (archDist(x, z) < 13 || !clear(x + ux * 5, z + uz * 5)) { prev = -1; return; } // the arch is its own rock; keep off the track
        const hs = Math.min(h(x - ux * 3, z - uz * 3), -0.3), hi = h(x + ux * 6, z + uz * 6), h0 = h(x, z);
        const ends = smooth(0, 14, s) * smooth(0, 14, tot - s);
        // a low pitted lip (1-2.6 m over the water) that rises with A's ground where the shore is already a cliff
        const lip = 1 + 1.6 * (0.5 + 0.5 * Math.sin(s * 0.13 + li * 2)) * (0.7 + 0.3 * hash(x, z));
        const top = (Math.max(hi + 0.35, h0 + 0.4, lip) + (hash(x * 0.7, z * 1.9) - 0.5) * 0.9) * (0.3 + 0.7 * ends); // jagged
        const base = pos.length / 3;
        // foot, wet band, face, undercut, lip, a pitted top a few metres in, and a back edge sunk into A's ground
        const rows = [[-1.6, hs - 0.6], [-0.6, Math.max(hs, -0.2) + 0.25], [-0.25, top * 0.45], [0.15, top * 0.8], [0.05, top],
          [3.2, Math.max(h(x + ux * 3.2, z + uz * 3.2) + 0.15, top - 0.5 + (hash(z, x * 1.3) - 0.5) * 0.6)], [6.5, h(x + ux * 6.5, z + uz * 6.5) - 0.35]];
        rows.forEach(([o, y], r) => {
          const jo = r > 1 && r < 6 ? (hash(x * 1.7 + r, z) - 0.5) * 0.6 : 0;
          pos.push(x + ux * (o + jo), y, z + uz * (o + jo));
          const pit = 0.5 + 0.5 * Math.sin(i * 1.1 + Math.sin(i * 0.37 + r) * 2.5 + r * 1.7);
          c.copy(r >= 5 ? capC : r < 2 ? wetC : rockC);
          if (r >= 2 && r < 6) c.lerp(pitC, Math.max(0, pit - 0.4) * 1.1 + (r === 3 ? 0.2 : 0));
          c.multiplyScalar(0.9 + hash(z + r, x) * 0.16);
          col.push(c.r, c.g, c.b);
        });
        if (prev >= 0) { for (let r = 0; r < 6; r++) idx.push(prev + r, prev + r + 1, base + r, prev + r + 1, base + r + 1, base + r); this.stats.rockQuads += 6; }
        prev = base;
        // blocks and boulders at the foot, half in the surf
        if (hash(x * 0.31, z * 0.29) < (low ? 0.22 : 0.34)) {
          const d = 0.8 + hash(z, x * 2) * 3, rr = 0.5 + hash(x * 3, z) * 1.1;
          rock(x - ux * d, z - uz * d, rr, rr * (0.5 + hash(x, z * 3) * 0.4), rr * (0.7 + hash(z * 2, x) * 0.4), blocks[i % blocks.length], x + z);
        }
      });
    }
    const face = new BufferGeometry();
    face.setAttribute("position", new Float32BufferAttribute(pos, 3));
    face.setAttribute("color", new Float32BufferAttribute(col, 3));
    face.setIndex(idx);
    parts.push(face.toNonIndexed()); face.dispose();
    parts.push(this.arch(h, low));
    parts.push(...this.sign(h));
    // a few loose blocks on the beach by the arch (refs: rocks in the wash at the tunnel mouth)
    for (let k = 0; k < (low ? 5 : 8); k++) {
      const t = ARCH.t1 - 1 + hash(k, 1) * 5, u = (hash(k, 2) - 0.5) * 16;
      rock(ARCH.x + ARCH.ax * t - ARCH.az * u, ARCH.z + ARCH.az * t + ARCH.ax * u, 0.5 + hash(k, 3) * 0.6, 0.45, 0.6, blocks[k % 4], k * 7.1);
    }
    for (const p of parts) if (!p.attributes.normal) p.computeVertexNormals();
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide, flatShading: true });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:wariruri:rocks"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x55607a);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }

  /** The Small Natural Bridge: a rock block with a low wide arch through it, extruded along the tunnel axis.
   * Outer skin grey and weathered on the deck, the underside orange-brown, dark and wet near the sand. */
  private arch(h: H, low: boolean): BufferGeometry {
    const N = low ? 14 : 18, K = low ? 6 : 8;
    const { x: ox, z: oz, ax, az, t0, t1, wo, wi, top, open } = ARCH;
    const px = -az, pz = ax; // across (east)
    const base = h(ox, oz);
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const deckC = new Color(0x57544e), sideC = new Color(0x69645b), underC = new Color(0x8c6446), wetC = new Color(0x4a4540),
      capC = new Color(0x6f6a60), pitC = new Color(0x3f3c38), c = new Color();
    const outer: number[][] = [], inner: number[][] = [];
    for (let k = 0; k <= K; k++) {
      const t = t0 + ((t1 - t0) * k) / K;
      const tk = top * (0.92 + 0.14 * Math.sin(k * 1.9 + 0.5)) * (k === K ? 0.85 : 1); // lumpy deck, lower on the sea side
      const o: number[] = [], n: number[] = [];
      for (let i = 0; i <= N; i++) {
        const th = Math.PI * (1 - i / N), cs = Math.cos(th), sn = Math.sin(th);
        const j1 = i > 0 && i < N ? (hash(i * 3.1 + k, k * 7.3) - 0.5) : 0, j2 = i > 0 && i < N ? (hash(k * 5.7, i * 1.3) - 0.5) : 0;
        // outer: a boxy rounded block; inner: a low arch with a flattened crown
        const uo = wo * Math.sign(cs) * Math.pow(Math.abs(cs), 0.55) + j1 * 1.6;
        let vo = -1.2 + (tk + 1.2) * Math.pow(sn, 0.28) + j2 * 1.3;
        const ui = wi * Math.sign(cs) * Math.pow(Math.abs(cs), 0.8) + j1 * 0.8, vi = -1.2 + (open + 1.2) * Math.pow(sn, 0.6) + j2 * 0.5;
        const wx = ox + ax * t + px * uo, wz = oz + az * t + pz * uo;
        vo = Math.max(vo, Math.min(tk, h(wx, wz) - base + 0.3)); // never sink into A's knoll
        o.push(pos.length / 3); pos.push(wx, base + vo, wz);
        c.copy(vo > tk * 0.75 ? deckC : sideC).lerp(pitC, Math.max(0, hash(wz, wx) - 0.6) * 1.6).multiplyScalar(0.9 + hash(wx, wz) * 0.18); col.push(c.r, c.g, c.b);
        const ix = ox + ax * t + px * ui, iz = oz + az * t + pz * ui;
        n.push(pos.length / 3); pos.push(ix, base + vi, iz);
        c.copy(underC).lerp(sideC, 1 - smooth(0.8, 2.6, vi)).lerp(wetC, 1 - smooth(-0.2, 1.0, vi)).multiplyScalar(0.85 + hash(ix, iz) * 0.25); col.push(c.r, c.g, c.b);
      }
      outer.push(o); inner.push(n);
    }
    for (let k = 0; k < K; k++) for (let i = 0; i < N; i++) {
      const [a, b, d, e] = [outer[k][i], outer[k][i + 1], outer[k + 1][i], outer[k + 1][i + 1]];
      idx.push(a, d, b, b, d, e);
      const [f, g2, m, q] = [inner[k][i], inner[k][i + 1], inner[k + 1][i], inner[k + 1][i + 1]];
      idx.push(f, g2, m, g2, q, m);
    }
    // the two faces (beach side and sea side): the band between the outer block and the opening
    for (const k of [0, K]) for (let i = 0; i < N; i++) {
      const [a, b, f, g2] = [outer[k][i], outer[k][i + 1], inner[k][i], inner[k][i + 1]];
      for (const v of [a, b]) { const p = v * 3; c.setRGB(col[p], col[p + 1], col[p + 2]).lerp(capC, 0.4); col[p] = c.r; col[p + 1] = c.g; col[p + 2] = c.b; }
      idx.push(a, f, b, b, f, g2);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 3));
    geo.setIndex(idx);
    const out = geo.toNonIndexed(); geo.dispose();
    this.stats.archTris = out.attributes.position.count / 3;
    return out;
  }

  /** The ATA beach sign: two posts, a teal header board and white and yellow notice panels (no text). */
  private sign(h: H): BufferGeometry[] {
    const { x, z, fx, fz } = SIGN, y = h(x, z), rot = Math.atan2(fx, fz);
    const out: BufferGeometry[] = [];
    const add = (w: number, ht: number, d: number, ox: number, oy: number, oz: number, hex: number) => {
      const g = new BoxGeometry(w, ht, d); g.translate(ox, oy, oz); g.rotateY(rot); g.translate(x, y, z); out.push(paint(g, hex));
    };
    add(0.12, 3.1, 0.12, -1.05, 1.5, -0.08, 0x5a4632); add(0.12, 3.1, 0.12, 1.05, 1.5, -0.08, 0x5a4632);
    add(2.5, 0.85, 0.05, 0, 2.75, 0, 0x1d8a8e); // teal header
    add(2.4, 0.42, 0.04, 0, 2.08, 0, 0xeeeeea); add(2.4, 0.42, 0.04, 0, 1.6, 0, 0xeeeeea); add(2.4, 0.42, 0.04, 0, 1.12, 0, 0xeeeeea);
    add(2.4, 0.16, 0.04, 0, 0.8, 0, 0x1d8a8e); add(2.4, 0.4, 0.04, 0, 0.5, 0, 0xe6c23a);
    return out;
  }

  /** Low scrub on the sand flat, a few sea grape clumps at its edge (the green mats are in the sand sheet). */
  private veg(h: H, low: boolean): InstancedMesh {
    const spots: number[][] = []; // x, z, y, kind (0 scrub, 1 sea grape)
    const step = low ? 7 : 5;
    const { x0, x1, z0, z1 } = bbox(FLAT, 0);
    for (let z = z0; z <= z1; z += step) for (let x = x0; x <= x1; x += step) {
      const px = x + (hash(x, z) - 0.5) * step * 0.9, pz = z + (hash(z, x) - 0.5) * step * 0.9;
      if (!pip(FLAT, px, pz) || !clear(px, pz)) continue;
      const r = hash(px * 0.7, pz * 1.1), dE = lineDist(px, pz, FLAT, true);
      let kind = -1;
      if (r < 0.12) kind = 0; else if (r < 0.17 && dE < 12) kind = 1;
      if (kind < 0) continue;
      const y = h(px, pz); if (y < 0.4) continue;
      spots.push([px, pz, y, kind]);
    }
    const im = new InstancedMesh(new IcosahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), Math.max(1, spots.length));
    im.count = spots.length;
    im.name = "aw:wariruri:veg"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const seaT = [0x2f5a22, 0x3a6528, 0x44702e], scrubT = [0x4f5a36, 0x5a6340, 0x4a5534];
    spots.forEach(([x, z, y, kind], i) => {
      const r = kind === 1 ? 1.4 + hash(x * 3, z) * 1.2 : 0.6 + hash(x * 3, z) * 0.6;
      const ht = kind === 1 ? r * 0.6 : r * 0.5;
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * (1 + hash(z, 4) * 0.4), ht, r); p.set(x, y + ht * 0.6, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      const t = kind === 1 ? seaT : scrubT; im.setColorAt(i, c.setHex(t[Math.floor(hash(x * 2, z * 2) * t.length) % t.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.clumps = spots.length;
    return im;
  }
}
