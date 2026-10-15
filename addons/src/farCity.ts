// Island-scale HLOD for buildings (eagle's-eye view from Hooiberg etc.).
// A streams full-detail regions within ~1-2 km; beyond that there were no buildings at all,
// so towns popped in/out. This layer draws every OSM building on the island as a cheap
// massing block (oriented box: roof quad, walls only for larger buildings) in ONE draw call.
// A 32x32 region mask (vertex-texture lookup) collapses the blocks of every region A has
// built in full detail, so near the player you only ever see A's real buildings.
// Data: data/far/massing.bin (tools/bake_far.py). Lambert, fog, no shadows. Off with ?far=0.
// Also raises camera far / thins fog with camera altitude so the whole island reads from high points.
import { BatchedMesh, BufferAttribute, BufferGeometry, Color, DataTexture, Mesh, MeshLambertMaterial, RGBAFormat, Sphere, UnsignedByteType, type Object3D } from "three";
import type { AGame } from "./env";
import { multiDrawCull, type CullSet } from "./bldBatch";

type Reg = { state: string; rx: number; rz: number; group?: { visible: boolean } };
const ROOF_FLAT = [0xcfcac0, 0xbdb9b0, 0xb6b9bb, 0xd6d2c8];
const ROOF_TILE = [0xa0583c, 0xab6446, 0x94513a, 0xb26e4e];
const WALLS = [0xd9c27a, 0xd8aab0, 0x92bdb7, 0xdedbd0, 0xd6ae80, 0xaec39a, 0xa6b9cf, 0xcf9a8c];

export class FarCity {
  mesh: Mesh | null = null;
  stats = { buildings: 0, tris: 0, masked: 0, ms: 0 };
  private mask = new Uint8Array(32 * 32 * 4);
  private tex = new DataTexture(this.mask, 32, 32, RGBAFormat, UnsignedByteType);
  private t = 0;
  // r192 (?farbatch=0 to disable): one BatchedMesh instance per 1 km region instead of one island-wide mesh,
  // so each pass only draws regions inside the camera frustum (far plane included) that A has not built in
  // full detail; the vertex-shader mask is replaced by leaving built regions out of the draw list. Same pixels.
  private batch: (CullSet & { reg: Uint16Array; n: number }) | null = null;
  constructor(private g: AGame, private walls: boolean, private useBatch = true) {
    this.tex.needsUpdate = true;
    this.load().catch((e) => console.warn("[aw-far] disabled:", e));
  }

  private async load() {
    const res = await fetch("./data/far/massing.bin");
    if (!res.ok) return;
    const buf = await res.arrayBuffer(), dv = new DataView(buf);
    if (dv.getUint32(0, true) !== 0x31465741) return; // 'AWF1'
    const t0 = performance.now();
    const n = dv.getUint32(4, true);
    if (buf.byteLength < 8 + n * 14) { console.warn("[aw-far] massing.bin truncated", buf.byteLength, n); return; }
    const A = this.g.real as unknown as { heightAt(x: number, z: number): number };
    // count verts: roof 4; walls (if big) 16
    const big = (h: number, w1: number, L: number) => this.walls && (h >= 7 || w1 * L * 4 > 350);
    let nv = 0, ni = 0;
    for (let i = 0; i < n; i++) {
      const o = 8 + i * 14, hx = dv.getInt16(o + 4, true) / 20, hz = dv.getInt16(o + 6, true) / 20, w1 = dv.getUint8(o + 8) / 4, h = dv.getUint8(o + 9) / 4;
      nv += 4; ni += 6; if (big(h, w1, Math.hypot(hx, hz))) { nv += 16; ni += 24; }
    }
    const P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), C = new Uint8Array(nv * 4), R = new Float32Array(nv), I = new Uint32Array(ni);
    let v = 0, k = 0;
    const col = new Color(), sand = new Color(0xc9b79c).convertSRGBToLinear();
    const put = (x: number, y: number, z: number, nx: number, ny: number, nz: number, reg: number) => {
      P[v * 3] = x; P[v * 3 + 1] = y; P[v * 3 + 2] = z; N[v * 3] = nx; N[v * 3 + 1] = ny; N[v * 3 + 2] = nz;
      C[v * 4] = col.r * 255; C[v * 4 + 1] = col.g * 255; C[v * 4 + 2] = col.b * 255; C[v * 4 + 3] = 255; R[v] = reg; return v++;
    };
    for (let i = 0; i < n; i++) {
      const o = 8 + i * 14;
      const cx = dv.getInt16(o, true) / 2, cz = dv.getInt16(o + 2, true) / 2, hx = dv.getInt16(o + 4, true) / 20, hz = dv.getInt16(o + 6, true) / 20;
      const w1 = dv.getUint8(o + 8) / 4, h = dv.getUint8(o + 9) / 4, kr = dv.getUint8(o + 10), seed = dv.getUint8(o + 11), reg = dv.getUint16(o + 12, true);
      const L = Math.hypot(hx, hz) || 1, px = (-hz / L) * w1, pz = (hx / L) * w1;
      const y0 = A.heightAt(cx, cz) - 0.5, y1 = y0 + 0.5 + h;
      const cs = [[cx - hx - px, cz - hz - pz], [cx + hx - px, cz + hz - pz], [cx + hx + px, cz + hz + pz], [cx - hx + px, cz - hz + pz]];
      const roof = kr >> 4;
      col.setHex(roof ? ROOF_TILE[seed & 3] : ROOF_FLAT[seed & 3]).convertSRGBToLinear().lerp(sand, 0.35);
      const a = cs.map(([x, z]) => put(x, y1, z, 0, 1, 0, reg));
      // winding: make the roof face up regardless of corner order
      const cross = (cs[1][0] - cs[0][0]) * (cs[2][1] - cs[0][1]) - (cs[1][1] - cs[0][1]) * (cs[2][0] - cs[0][0]);
      if (cross < 0) { I[k++] = a[0]; I[k++] = a[1]; I[k++] = a[2]; I[k++] = a[0]; I[k++] = a[2]; I[k++] = a[3]; }
      else { I[k++] = a[0]; I[k++] = a[2]; I[k++] = a[1]; I[k++] = a[0]; I[k++] = a[3]; I[k++] = a[2]; }
      if (big(h, w1, L)) {
        col.setHex(WALLS[(seed >> 2) & 7]).convertSRGBToLinear().lerp(sand, 0.4).multiplyScalar(0.85);
        for (let e = 0; e < 4; e++) {
          const [ax, az] = cs[e], [bx, bz] = cs[(e + 1) & 3];
          let nx = bz - az, nz = -(bx - ax); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
          if (((ax + bx) / 2 - cx) * nx + ((az + bz) / 2 - cz) * nz < 0) { nx = -nx; nz = -nz; }
          const q0 = put(ax, y0, az, nx, 0, nz, reg), q1 = put(bx, y0, bz, nx, 0, nz, reg), q2 = put(bx, y1, bz, nx, 0, nz, reg), q3 = put(ax, y1, az, nx, 0, nz, reg);
          // two-sided via material side, so winding does not matter
          I[k++] = q0; I[k++] = q1; I[k++] = q2; I[k++] = q0; I[k++] = q2; I[k++] = q3;
        }
      }
    }
    if (this.useBatch) { this.buildBatch(P, N, C, R, I, nv, ni); this.stats.buildings = n; this.stats.ms = Math.round(performance.now() - t0); this.t = 0; return; }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(P, 3));
    geo.setAttribute("normal", new BufferAttribute(N, 3));
    geo.setAttribute("color", new BufferAttribute(C, 4, true));
    geo.setAttribute("aReg", new BufferAttribute(R, 1));
    geo.setIndex(new BufferAttribute(I, 1));
    const mat = new MeshLambertMaterial({ vertexColors: true, side: 2 });
    const tex = this.tex;
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uMask = { value: tex };
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float aReg; uniform sampler2D uMask;")
        .replace("#include <project_vertex>", "#include <project_vertex>\n  { float rx = floor(aReg / 32.0), rz = aReg - rx * 32.0;\n    if (texture2D(uMask, (vec2(rx, rz) + 0.5) / 32.0).r > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }");
    };
    mat.customProgramCacheKey = () => "awFarCity";
    const mesh = new Mesh(geo, mat);
    mesh.name = "aw:farCity";
    mesh.frustumCulled = false; mesh.castShadow = false; mesh.receiveShadow = false; mesh.matrixAutoUpdate = false;
    (this.g.scene as unknown as { add(o: Object3D): void }).add(mesh as unknown as Object3D);
    this.mesh = mesh;
    this.stats.buildings = n; this.stats.tris = ni / 3; this.stats.ms = Math.round(performance.now() - t0);
    this.t = 0;
  }

  private buildBatch(P: Float32Array, N: Float32Array, C: Uint8Array, R: Float32Array, I: Uint32Array, nv: number, ni: number) {
    // regroup vertices + triangles by region (a building's vertices all carry its region id)
    const NR = 1024, vc = new Uint32Array(NR + 1), tc = new Uint32Array(NR + 1);
    for (let v = 0; v < nv; v++) vc[R[v] + 1]++;
    for (let k = 0; k < ni; k += 3) tc[R[I[k]] + 1] += 3;
    for (let r = 0; r < NR; r++) { vc[r + 1] += vc[r]; tc[r + 1] += tc[r]; }
    const remap = new Uint32Array(nv), vfill = vc.slice(0, NR), tfill = tc.slice(0, NR);
    const P2 = new Float32Array(nv * 3), N2 = new Float32Array(nv * 3), C2 = new Uint8Array(nv * 4), I2 = new Uint32Array(ni);
    for (let v = 0; v < nv; v++) {
      const r = R[v], d = vfill[r]++; remap[v] = d - vc[r];
      P2[d * 3] = P[v * 3]; P2[d * 3 + 1] = P[v * 3 + 1]; P2[d * 3 + 2] = P[v * 3 + 2];
      N2[d * 3] = N[v * 3]; N2[d * 3 + 1] = N[v * 3 + 1]; N2[d * 3 + 2] = N[v * 3 + 2];
      C2[d * 4] = C[v * 4]; C2[d * 4 + 1] = C[v * 4 + 1]; C2[d * 4 + 2] = C[v * 4 + 2]; C2[d * 4 + 3] = C[v * 4 + 3];
    }
    for (let k = 0; k < ni; k += 3) { const r = R[I[k]], d = tfill[r]; tfill[r] += 3; I2[d] = remap[I[k]]; I2[d + 1] = remap[I[k + 1]]; I2[d + 2] = remap[I[k + 2]]; }
    const regs: number[] = []; for (let r = 0; r < NR; r++) if (tc[r + 1] > tc[r]) regs.push(r);
    const mat = new MeshLambertMaterial({ vertexColors: true, side: 2 });
    mat.customProgramCacheKey = () => "awFarCityB";
    const bm = new BatchedMesh(regs.length, nv, ni, mat) as BatchedMesh & { userData: { awb?: CullSet } };
    const n = regs.length, cs: CullSet & { reg: Uint16Array; n: number } = { cx: new Float32Array(n), cy: new Float32Array(n), cz: new Float32Array(n), r: new Float32Array(n), vis: new Uint16Array(n), nVis: 0, reg: new Uint16Array(n), n };
    const all = new Sphere(), s = new Sphere();
    regs.forEach((r, i) => {
      const v0 = vc[r], v1 = vc[r + 1], geo = new BufferGeometry();
      geo.setAttribute("position", new BufferAttribute(P2.subarray(v0 * 3, v1 * 3), 3));
      geo.setAttribute("normal", new BufferAttribute(N2.subarray(v0 * 3, v1 * 3), 3));
      geo.setAttribute("color", new BufferAttribute(C2.subarray(v0 * 4, v1 * 4), 4, true));
      geo.setIndex(new BufferAttribute(I2.subarray(tc[r], tc[r + 1]), 1));
      geo.computeBoundingSphere();
      bm.addInstance(bm.addGeometry(geo));
      const bs = geo.boundingSphere!; cs.cx[i] = bs.center.x; cs.cy[i] = bs.center.y; cs.cz[i] = bs.center.z; cs.r[i] = bs.radius; cs.reg[i] = r;
      if (i) all.union(s.copy(bs)); else all.copy(bs);
    });
    bm.boundingSphere = all;
    bm.name = "aw:farCity";
    bm.sortObjects = false; bm.perObjectFrustumCulled = true;
    bm.castShadow = false; bm.receiveShadow = false; bm.matrixAutoUpdate = false;
    bm.userData.awb = cs;
    bm.onBeforeRender = multiDrawCull as unknown as BatchedMesh["onBeforeRender"];
    (this.g.scene as unknown as { add(o: Object3D): void }).add(bm as unknown as Object3D);
    this.batch = cs; this.mesh = bm as unknown as Mesh;
    this.stats.tris = ni / 3;
  }

  update(dt: number) {
    const cam = this.g.camera as unknown as { position: { y: number } };
    // altitude-aware view distance / haze (sea level ~0, Hooiberg summit ~165 m)
    const y = cam.position.y, k = Math.max(0, Math.min(1, (y - 25) / 140));
    const w = window as unknown as { __awFar?: number; __awFogK?: number };
    w.__awFar = 12e3 + 10e3 * k;
    w.__awFogK = 1 - 0.55 * k;
    if (!this.mesh) return;
    this.t -= dt; if (this.t > 0) return; this.t = 0.25;
    const regs = (this.g.real as unknown as { regions: Map<string, Reg> }).regions;
    this.mask.fill(0); let m = 0;
    for (const r of regs.values()) {
      if (r.state !== "built") continue;
      const rx = r.rx, rz = r.rz;
      if (rx < 0 || rz < 0 || rx > 31 || rz > 31) continue;
      this.mask[(rz * 32 + rx) * 4] = 255; m++;
    }
    this.stats.masked = m;
    const b = this.batch;
    if (b) { let c = 0; for (let i = 0; i < b.n; i++) { const r = b.reg[i], rx = Math.floor(r / 32), rz = r - rx * 32; if (!this.mask[(rz * 32 + rx) * 4]) b.vis[c++] = i; } b.nVis = c; return; }
    this.tex.needsUpdate = true;
  }
}
