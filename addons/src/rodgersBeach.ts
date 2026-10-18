// Rodgers Beach (Seroe Colorado, south-east tip) accuracy pass. Off with ?rodgers=0.
// A draws Rodgers Bay as one even turquoise over a 3-11 m deep bed, with no reef at the mouth, and the
// strip behind the sand as open sand with a few tufts. Satellite and photo references show a calm
// sandy bay: very pale aqua shallows along the beach, clear turquoise with darker coral/sea-grass
// patches further out, a reef flat across the mouth with a line of breakers, low sea-grape and scrub
// behind the sand, and a few thatched palapas on the beach. The refinery backdrop is the existing
// refinery_sky hero and the palapas/boats by the road are the existing rodgers_beach hero; neither is touched.
// Geometry is OSM (coastline 54041321, beach 305490212, scrub 628169522, and the seaward edge of the
// "Rodgers Lagoon" water 1226192735 for the reef line) rebuilt in code; photos are reference only.
// 4 draw calls: one vertex-coloured bay sheet, one foam ribbon, one InstancedMesh of scrub clumps and one
// merged palapa mesh. Built once when the height regions have streamed in, no per-frame work beyond a
// colour/opacity lerp when drawn. Stays west of the Baby Beach lagoon (x < 9440) and off the pier/Esso Club.
import {
  BufferGeometry, Color, ConeGeometry, CylinderGeometry, DoubleSide, Euler, Float32BufferAttribute, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// game metres. COAST: OSM coastline 54041321 from the refinery shore down to the south pier (1.5 m simplified).
// REEF: seaward edge of OSM natural=water "Rodgers Lagoon" 1226192735, the mapped reef line across the bay mouth.
// BEACH / SCRUB: OSM 305490212 / 628169522. ROADS (ax, az, bx, bz, clearance) and BLD (padded bboxes) are A's region data.
const COAST: P[] = [[8538.0,10754.5],[8549.9,10768.6],[8550.0,10773.6],[8544.5,10782.2],[8547.4,10786.4],[8550.6,10787.3],[8560.3,10779.7],[8573.3,10785.8],[8619.0,10794.3],[8640.1,10806.8],[8662.7,10829.7],[8666.2,10836.8],[8684.7,10847.9],[8694.7,10851.5],[8702.3,10850.9],[8712.8,10854.7],[8757.5,10861.4],[8769.7,10866.3],[8775.7,10873.7],[8778.5,10881.6],[8790.4,10888.1],[8805.2,10918.8],[8812.6,10925.1],[8830.8,10933.6],[8827.8,10942.9],[8833.9,10947.7],[8840.1,10942.5],[8874.8,10935.5],[8928.2,10949.7],[8945.2,10951.8],[8957.3,10964.7],[8980.9,10981.7],[8996.3,10999.4],[9006.8,11016.7],[9012.5,11033.1],[9035.4,11058.2],[9045.6,11059.6],[9055.0,11066.2],[9057.3,11070.9],[9067.1,11074.3],[9078.5,11085.0],[9090.1,11089.9],[9100.5,11101.8],[9108.9,11106.6],[9112.2,11115.8],[9118.7,11121.6],[9130.6,11122.4],[9142.8,11129.9],[9167.4,11166.9],[9223.0,11229.5],[9249.5,11254.6],[9252.7,11264.8],[9251.5,11274.8],[9253.9,11297.5],[9278.1,11316.6],[9285.2,11325.0],[9318.3,11375.2],[9346.7,11450.7],[9348.5,11467.8],[9332.9,11541.7],[9326.0,11555.2],[9314.6,11559.8],[9294.1,11621.1]];
const REEF: P[] = [[8345.8,11211.5],[8584.7,11205.7],[9120.8,11500.9],[9173.2,11636.0]];
const BEACH: P[] = [[9149.4,11140.7],[9145.7,11134.6],[9156.7,11139.0],[9177.9,11150.3],[9200.2,11155.8],[9341.5,11323.9],[9359.0,11437.9],[9343.2,11443.3],[9333.4,11411.2],[9318.3,11375.2],[9300.1,11349.2],[9294.8,11338.9],[9285.2,11325.0],[9278.1,11316.6],[9253.9,11297.5],[9251.5,11274.8],[9252.7,11264.8],[9249.5,11254.6],[9244.5,11248.4],[9223.0,11229.5],[9213.4,11216.9],[9183.0,11184.7],[9178.8,11178.4],[9167.4,11166.9],[9156.8,11152.9],[9149.4,11140.7]];
const SCRUB: P[] = [[9221.6,11138.5],[9207.3,11158.0],[9320.6,11285.8],[9344.0,11316.9],[9367.1,11475.6],[9358.7,11509.4],[9344.6,11548.0],[9341.5,11565.5],[9346.8,11580.0],[9392.8,11624.3],[9389.4,11628.6],[9389.4,11631.8],[9391.4,11635.9],[9395.5,11636.7],[9461.2,11574.9],[9462.5,11571.3],[9459.9,11506.0],[9459.9,11431.3],[9457.6,11424.2],[9437.6,11398.9],[9329.1,11226.7],[9300.1,11193.6],[9221.6,11138.5]];
const ROADS: number[][] = [[9328.3,11061.8,9385.8,11138.3,4.5],[9385.8,11138.3,9401.1,11152.9,4.5],[9401.1,11152.9,9419.8,11166.7,4.5],[9419.8,11166.7,9449.0,11182.3,4.5],[9449.0,11182.3,9465.9,11191.9,4.5],[9465.9,11191.9,9476.4,11200.0,4.5],[9256.9,11150.3,9230.0,11130.7,4.5],[9236.8,11200.0,9229.0,11191.4,4.5],[9265.8,11125.1,9261.0,11127.4,3.6],[9261.0,11127.4,9255.5,11128.8,3.6],[9255.5,11128.8,9250.5,11130.0,3.6],[9250.5,11130.0,9245.4,11131.3,3.6],[9245.4,11131.3,9240.6,11131.5,3.6],[9240.6,11131.5,9235.5,11131.1,3.6],[9235.5,11131.1,9230.0,11130.7,3.6],[9276.2,11165.7,9269.8,11143.9,3.6],[9269.8,11143.9,9269.2,11134.8,3.6],[9269.2,11134.8,9268.7,11127.5,3.6],[9268.7,11127.5,9268.6,11118.8,3.6],[9256.9,11150.3,9276.2,11165.7,5.3],[9230.0,11130.7,9213.5,11118.4,4.5],[9268.6,11118.8,9265.8,11125.1,3.6],[9265.8,11125.1,9263.6,11133.0,3.6],[9263.6,11133.0,9260.5,11143.0,3.6],[9260.5,11143.0,9256.9,11150.3,3.6],[9276.2,11165.7,9309.3,11192.1,5.3],[9309.3,11192.1,9317.7,11200.0,5.3],[9476.4,11200.0,9482.4,11204.7,4.5],[9331.9,11213.2,9338.9,11228.2,5.3],[9338.9,11228.2,9345.3,11243.6,5.3],[9345.3,11243.6,9352.7,11265.9,5.3],[9352.7,11265.9,9373.9,11316.6,5.3],[9373.9,11316.6,9379.6,11328.8,5.3],[9379.6,11328.8,9392.8,11349.9,5.3],[9392.8,11349.9,9430.6,11386.3,5.3],[9430.6,11386.3,9453.6,11409.7,5.3],[9453.6,11409.7,9461.8,11419.7,5.3],[9461.8,11419.7,9465.1,11428.2,5.3],[9465.1,11428.2,9467.5,11439.8,5.3],[9467.5,11439.8,9467.5,11467.2,5.3],[9467.5,11467.2,9466.0,11540.1,5.3],[9466.0,11540.1,9465.6,11577.7,5.3],[9394.6,11647.5,9407.6,11662.0,4.0],[9331.9,11213.2,9355.1,11220.1,4.5],[9355.1,11220.1,9376.2,11230.1,4.5],[9376.2,11230.1,9406.0,11247.5,4.5],[9406.0,11247.5,9438.4,11265.9,4.5],[9438.4,11265.9,9493.1,11299.1,4.5],[9394.6,11647.5,9382.4,11634.5,4.5],[9382.4,11634.5,9331.3,11580.3,4.5],[9331.3,11580.3,9351.9,11513.3,4.5],[9351.9,11513.3,9356.5,11489.1,4.5],[9356.5,11489.1,9359.2,11470.6,4.5],[9359.2,11470.6,9360.0,11452.4,4.5],[9360.0,11452.4,9359.3,11438.1,4.5],[9359.3,11438.1,9358.7,11424.1,4.5],[9358.7,11424.1,9353.2,11386.7,4.5],[9353.2,11386.7,9347.5,11356.8,4.5],[9347.5,11356.8,9344.2,11339.1,4.5],[9344.2,11339.1,9341.8,11324.4,4.5],[9341.8,11324.4,9336.8,11314.3,4.5],[9336.8,11314.3,9332.8,11308.1,4.5],[9332.8,11308.1,9327.1,11300.8,4.5],[9327.1,11300.8,9299.7,11269.9,4.5],[9299.7,11269.9,9236.8,11200.0,4.5],[9346.6,11635.1,9343.7,11637.5,3.5],[9343.7,11637.5,9341.2,11641.2,3.5],[9341.2,11641.2,9338.0,11648.0,3.5],[9338.0,11648.0,9335.4,11657.4,3.5],[9296.9,11645.0,9303.5,11655.2,3.5],[9469.9,11686.5,9467.2,11619.2,5.1],[9467.2,11619.2,9465.6,11577.7,5.1],[9503.5,11548.8,9466.0,11540.1,5.3],[9465.6,11577.7,9394.6,11647.5,4.0],[9249.3,11677.1,9296.9,11645.0,4.5],[9296.9,11645.0,9303.4,11635.4,4.5],[9303.4,11635.4,9310.6,11623.7,4.5],[9310.6,11623.7,9318.3,11604.9,4.5],[9318.3,11604.9,9324.0,11595.6,4.5],[9324.0,11595.6,9331.3,11580.3,4.5],[9346.6,11635.1,9351.1,11634.7,3.5],[9351.1,11634.7,9356.8,11636.0,3.5],[9356.8,11636.0,9361.1,11638.9,3.5],[9361.1,11638.9,9365.3,11641.6,3.5],[9365.3,11641.6,9368.6,11642.5,3.5],[9368.6,11642.5,9372.3,11641.8,3.5],[9372.3,11641.8,9374.8,11640.6,3.5],[9374.8,11640.6,9382.4,11634.5,3.5],[9318.3,11604.9,9340.1,11626.8,3.5],[9340.1,11626.8,9344.4,11632.1,3.5],[9344.4,11632.1,9346.6,11635.1,3.5],[9317.7,11200.0,9331.9,11213.2,5.3],[9467.2,11619.2,9482.6,11619.7,3.5]];
const BLD: number[][] = [[9317.7,11162.7,9338.7,11183.1],[9351.9,11185.2,9366.5,11200.0],[9325.8,11175.3,9353.2,11200.9],[9326.1,11102.0,9354.6,11130.2],[9401.2,11127.1,9422.9,11148.0],[9445.4,11155.2,9473.6,11182.8],[9442.0,11151.1,9455.4,11164.2],[9386.1,11113.4,9399.3,11126.0],[9438.9,11137.9,9460.7,11158.5],[9427.8,11144.0,9448.9,11163.8],[9475.4,11174.7,9504.0,11201.0],[9454.1,11148.2,9474.8,11165.3],[9395.5,11115.7,9417.5,11136.2],[9325.9,11118.3,9343.4,11136.4],[9286.1,11159.2,9298.0,11171.5],[9314.2,11174.3,9328.5,11189.2],[9342.0,11644.4,9466.3,11752.0],[9264.4,11644.8,9281.1,11661.6],[9272.7,11273.9,9294.2,11295.4],[9416.7,11263.2,9431.9,11277.5],[9415.8,11276.4,9425.3,11286.3],[9392.8,11249.2,9407.9,11264.5],[9377.0,11255.2,9400.5,11282.3],[9365.6,11236.7,9379.1,11249.4],[9374.2,11242.2,9383.8,11251.7],[9353.9,11237.2,9374.0,11260.9],[9404.5,11270.5,9423.6,11290.5],[9470.3,11317.4,9484.0,11332.4],[9441.7,11277.1,9458.7,11294.0],[9417.2,11289.4,9429.4,11300.3],[9419.0,11283.6,9440.3,11306.2],[9411.3,11265.8,9421.7,11275.7],[9446.4,11295.8,9473.5,11319.4],[9456.7,11315.1,9469.1,11330.1],[9477.7,11314.6,9499.7,11336.3],[9466.5,11294.6,9484.6,11312.3],[9402.6,11281.1,9417.0,11293.8],[9427.8,11284.4,9451.7,11311.5],[9411.8,11224.3,9422.5,11236.6],[9475.4,11264.1,9497.2,11285.4],[9451.5,11248.8,9470.8,11268.6],[9444.2,11238.4,9455.6,11250.1],[9367.9,11203.2,9383.2,11219.2],[9381.0,11203.8,9390.6,11212.4],[9400.5,11215.9,9414.1,11228.6],[9474.4,11258.8,9483.9,11267.5],[9364.3,11193.3,9377.5,11208.1],[9461.7,11253.7,9473.5,11266.0],[9469.5,11261.8,9483.4,11278.4],[9410.0,11233.4,9422.3,11246.1],[9425.7,11230.8,9447.4,11256.3],[9401.4,11220.0,9420.7,11239.9],[9464.1,11254.4,9477.3,11268.4],[9353.2,11191.4,9372.2,11211.4],[9428.0,11230.3,9437.2,11239.9],[9450.9,11246.4,9463.0,11258.6],[9376.3,11206.8,9398.3,11228.0],[9429.8,11225.3,9439.7,11235.1],[9477.2,11255.9,9487.2,11266.2],[9300.6,11202.0,9310.5,11212.0],[9319.5,11328.7,9328.5,11339.5],[9325.9,11341.3,9334.6,11350.4],[9330.6,11351.0,9339.3,11360.5],[9304.5,11311.9,9313.9,11321.8],[9294.3,11303.0,9306.7,11315.5]];
// OSM lagoon west corner, closing the bay back to the start of the coast
const WEST: P[] = [[8493.4, 10837.2]];
const BAY: P[] = [...COAST, ...REEF.slice().reverse(), ...WEST];
const KEEP_CLEAR: number[][] = [[9358, 11473, 9482, 11562]]; // rodgers_beach hero (palapas + boats), padded
// five palapas along the middle of the sand, where photos show them (one every ~40 m)
const PALAPA_Z = [11228, 11262, 11300, 11338, 11376];
const WATER_Y = 0.05;

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
function lineDist(x: number, z: number, p: P[]) {
  let m = 1e9; for (let i = 1; i < p.length; i++) m = Math.min(m, segDist(x, z, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1])); return m;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class RodgersBeach {
  stats = { built: false, bayQuads: 0, foamQuads: 0, clumps: 0, palapas: 0, ms: 0 };
  private timer = 0;
  private sheetDone = false;
  private landDone = false;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  private key(W: World, x: number, z: number) { return `${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`; }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const t0 = performance.now();
    const low = (this.g.real as unknown as { q?: { name?: string } })?.q?.name === "low";
    if (!this.sheetDone) { this.g.scene.add(this.bay(low), this.foam(low)); this.sheetDone = true; } // flat, needs no heights
    if (!this.landDone) {
      const ready = new Set<string>();
      for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
      const keys = new Set<string>();
      for (const [x, z] of SCRUB) keys.add(this.key(W, x, z));
      for (const [x, z] of BEACH) keys.add(this.key(W, x, z));
      if ([...keys].every((k) => ready.has(k))) {
        const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
        this.g.scene.add(this.scrub(h, low), this.palapas(h));
        this.landDone = true;
      }
    }
    if (this.landDone) { window.clearInterval(this.timer); this.stats.built = true; }
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Shallow-water colour sheet over the bay, plus the reef flat just outside the reef line. */
  private bay(low: boolean): Mesh {
    const S = low ? 8 : 6;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of BAY) { x0 = Math.min(x0, x - 50); x1 = Math.max(x1, x + 50); z0 = Math.min(z0, z - 50); z1 = Math.max(z1, z + 50); }
    x0 = Math.floor(x0 / S) * S; z0 = Math.floor(z0 / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 1, nz = Math.ceil((z1 - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const shoreC = new Color(0xd2fff4), midC = new Color(0x4fd8d0), patchC = new Color(0x1d7f86), flatC = new Color(0x7fe3d2), coralC = new Color(0x6f7f5e), c = new Color();
    const OUT = 60; // reef flat reaches this far seaward of the mapped line
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S;
      const dShore = lineDist(x, z, COAST), dReef = lineDist(x, z, REEF), dWest = segDist(x, z, REEF[0][0], REEF[0][1], WEST[0][0], WEST[0][1]);
      const inBay = inside(BAY, x, z);
      // sandy shallows fade to clear turquoise ~60 m out; darker coral / sea-grass patches in the outer bay
      c.copy(shoreC).lerp(midC, Math.min(1, dShore / 60));
      const n = Math.sin(x * 0.031 + Math.sin(z * 0.023) * 2.2) * Math.sin(z * 0.037 + Math.sin(x * 0.017) * 1.7);
      const patch = Math.max(0, n - 0.25) * 2.2 * Math.min(1, Math.max(0, dShore - 70) / 60) * (0.75 + 0.25 * hash(x, z));
      c.lerp(patchC, Math.min(0.6, patch));
      // reef flat: paler, with brown-green coral heads, on both sides of the reef line
      const rf = Math.max(0, 1 - dReef / (inBay ? 45 : OUT));
      if (rf > 0) { c.lerp(flatC, rf * 0.7); if (hash(x * 1.7, z * 1.3) > 0.55) c.lerp(coralC, rf * 0.45); }
      let a = Math.min(0.8, 0.55 + 0.25 * Math.max(0, 1 - dShore / 35));
      if (!inBay) a *= Math.max(0, 1 - dReef / OUT); // fade out into the open sea
      a *= Math.min(1, dWest / 60); // open side toward the refinery shore: blend into A's water
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (cx > 9440) continue; // never reach the Baby Beach lagoon
      if (!inside(BAY, cx, cz) && lineDist(cx, cz, REEF) > OUT) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.bayQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(geo, mat); m.name = "aw:rodgers:bay";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = 1 - 0.55 * k; };
    // after A's water (renderOrder 2): the sheet's sort point is the bay centre, so water tiles nearer the
    // camera would otherwise be drawn over it
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  /** Broken white breaker line just seaward of the reef line: one ribbon, dashed by vertex alpha. */
  private foam(low: boolean): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const step = 3;
    for (let i = 1; i < REEF.length; i++) {
      const [ax, az] = REEF[i - 1], [bx, bz] = REEF[i], L = Math.hypot(bx - ax, bz - az);
      const ux = (bx - ax) / L, uz = (bz - az) / L, nx = -uz, nz = ux; // seaward normal (bay is on the left)
      const n = Math.ceil(L / step);
      for (let k = 0; k <= n; k++) {
        const t = (k / n) * L, w = 4 + hash(i * 31 + k, 7) * 5, off = 6 + Math.sin(t * 0.05 + i) * 3;
        const x = ax + ux * t + nx * off, z = az + uz * t + nz * off;
        // dashes: breakers come and go along the reef, never one solid band
        const s = Math.sin(t * 0.07 + Math.sin(t * 0.019 + i) * 3.5 + i * 2.1) * 0.5 + 0.5, a = Math.min(1, Math.max(0, s - 0.2) * 1.6) * (0.55 + 0.45 * hash(k, i));
        const base = pos.length / 3;
        pos.push(x - nx * w * 0.3, WATER_Y + 0.08, z - nz * w * 0.3, x + nx * w, WATER_Y + 0.08, z + nz * w);
        col.push(1, 1, 1, a * 0.95, 1, 1, 1, a * 0.35);
        if (k > 0) { idx.push(base - 2, base - 1, base, base - 1, base + 1, base); this.stats.foamQuads++; } // CCW from above
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:rodgers:reef";
    const day = new Color(0xf4fbff), night = new Color(0x2a3a4c);
    // slow swell: the whole line brightens and fades a little (one lerp when drawn)
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value); mat.opacity = 0.75 + 0.25 * Math.sin(uTime.value * 0.8); };
    m.renderOrder = 4; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  private clear(x: number, z: number) {
    if (inside(BEACH, x, z)) return false;
    for (const [ax, az, bx, bz, r] of ROADS) if (segDist(x, z, ax, az, bx, bz) < r) return false;
    for (const [x0, z0, x1, z1] of BLD) if (x > x0 && x < x1 && z > z0 && z < z1) return false;
    for (const [x0, z0, x1, z1] of KEEP_CLEAR) if (x > x0 && x < x1 && z > z0 && z < z1) return false;
    return true;
  }

  /** Low sea-grape and scrub behind the sand: one InstancedMesh of flat-shaded clumps. */
  private scrub(h: (x: number, z: number) => number, low: boolean): InstancedMesh {
    const spots: number[][] = [], step = low ? 6 : 4.5;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of SCRUB) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    for (let x = x0; x <= x1; x += step) for (let z = z0; z <= z1; z += step) {
      const px = x + (hash(x, z) - 0.5) * step * 0.9, pz = z + (hash(z, x) - 0.5) * step * 0.9;
      if (!inside(SCRUB, px, pz) || !this.clear(px, pz)) continue;
      const y = h(px, pz); if (y < 0.15) continue; // dry land only
      // sea grape (rounder, brighter) right behind the sand; grey-green scrub further back
      const sea = lineDist(px, pz, BEACH) < 14;
      spots.push([px, pz, y, sea ? 1 : 0]);
    }
    const im = new InstancedMesh(new IcosahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), spots.length);
    im.name = "aw:rodgers:scrub"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const seaT = [0x3f6f2a, 0x4a7d31, 0x557f36, 0x386528], scrubT = [0x5b6b3c, 0x67744a, 0x4f5f35, 0x76784e, 0x6a6a44];
    spots.forEach(([x, z, y, sea], i) => {
      const r = sea ? 1.6 + hash(x * 3, z) * 1.4 : 0.9 + hash(x * 3, z) * 1.2, ht = sea ? r * 0.7 : r * 0.55;
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * (1 + hash(z, 4) * 0.4), ht, r); p.set(x, y + ht * 0.7, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      const t = sea ? seaT : scrubT; im.setColorAt(i, c.setHex(t[Math.floor(hash(x * 2, z * 2) * t.length) % t.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.clumps = spots.length;
    return im;
  }

  /** A few thatched palapas on the sand: pole + thatch cone, vertex-coloured and merged into one mesh. */
  private palapas(h: (x: number, z: number) => number): Mesh {
    const parts: BufferGeometry[] = [];
    const paint = (g: BufferGeometry, hex: number) => {
      const c = new Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
      g.setAttribute("color", new Float32BufferAttribute(a, 3)); return g;
    };
    for (const z of PALAPA_Z) {
      // the sand at this z: from the water line (A's height crosses 0) to the back of the OSM beach
      let xs: number[] = [];
      for (let i = 0, j = BEACH.length - 1; i < BEACH.length; j = i++) {
        const [xi, zi] = BEACH[i], [xj, zj] = BEACH[j];
        if ((zi > z) !== (zj > z)) xs.push(xi + ((z - zi) * (xj - xi)) / (zj - zi));
      }
      if (xs.length < 2) continue;
      xs = xs.sort((a, b) => a - b);
      let x = xs[xs.length - 1] - 6; // a few metres in front of the scrub
      for (let k = 0; k < 6 && h(x, z) < 0.4; k++) x += 1.5;
      if (h(x, z) < 0.2) continue;
      const y = h(x, z), tilt = (hash(x, z) - 0.5) * 0.06;
      const pole = new CylinderGeometry(0.09, 0.11, 2.6, 6).toNonIndexed(); pole.translate(x, y + 1.3, z);
      const roof = new ConeGeometry(1.9 + hash(z, 1) * 0.3, 1.15, 9, 1, true).toNonIndexed(); roof.rotateZ(tilt); roof.translate(x, y + 2.75, z);
      const fringe = new CylinderGeometry(1.95, 2.05, 0.25, 9, 1, true).toNonIndexed(); fringe.translate(x, y + 2.15, z);
      parts.push(paint(pole, 0x7a5a3a), paint(roof, 0xb59a62), paint(fringe, 0x9c8150));
      this.stats.palapas++;
    }
    const geo = parts.length ? mergeGeometries(parts)! : new BufferGeometry(); parts.forEach((p) => p.dispose());
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:rodgers:palapas"; mesh.castShadow = true; mesh.receiveShadow = true;
    return mesh;
  }
}
