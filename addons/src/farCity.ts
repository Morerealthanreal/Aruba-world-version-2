// Island-scale HLOD for buildings (eagle's-eye view from Hooiberg etc.).
// A streams full-detail regions within ~1-2 km; beyond that there were no buildings at all,
// so towns popped in/out. This layer draws every OSM building on the island as a cheap
// massing block (oriented box: roof quad, walls only for larger buildings) in ONE draw call.
// A 32x32 region mask (vertex-texture lookup) collapses the blocks of every region A has
// built in full detail, so near the player you only ever see A's real buildings.
// Data: data/far/massing.bin (tools/bake_far.py). Lambert, fog, no shadows. Off with ?far=0.
// Also raises camera far / thins fog with camera altitude so the whole island reads from high points.
import { BufferAttribute, BufferGeometry, Color, DataTexture, Mesh, MeshLambertMaterial, RGBAFormat, UnsignedByteType, type Object3D } from "three";
import type { AGame } from "./env";

type Reg = { state: string; group?: { visible: boolean } };
const ROOF_FLAT = [0xcfcac0, 0xbdb9b0, 0xb6b9bb, 0xd6d2c8];
const ROOF_TILE = [0xa0583c, 0xab6446, 0x94513a, 0xb26e4e];
const WALLS = [0xd9c27a, 0xd8aab0, 0x92bdb7, 0xdedbd0, 0xd6ae80, 0xaec39a, 0xa6b9cf, 0xcf9a8c];

export class FarCity {
  mesh: Mesh | null = null;
  stats = { buildings: 0, tris: 0, masked: 0, ms: 0 };
  private mask = new Uint8Array(32 * 32 * 4);
  private tex = new DataTexture(this.mask, 32, 32, RGBAFormat, UnsignedByteType);
  private t = 0;
  constructor(private g: AGame, private walls: boolean) {
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
    const P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), C = new Uint8Array(nv * 3), R = new Float32Array(nv), I = new Uint32Array(ni);
    let v = 0, k = 0;
    const col = new Color();
    const put = (x: number, y: number, z: number, nx: number, ny: number, nz: number, reg: number) => {
      P[v * 3] = x; P[v * 3 + 1] = y; P[v * 3 + 2] = z; N[v * 3] = nx; N[v * 3 + 1] = ny; N[v * 3 + 2] = nz;
      C[v * 3] = col.r * 255; C[v * 3 + 1] = col.g * 255; C[v * 3 + 2] = col.b * 255; R[v] = reg; return v++;
    };
    for (let i = 0; i < n; i++) {
      const o = 8 + i * 14;
      const cx = dv.getInt16(o, true) / 2, cz = dv.getInt16(o + 2, true) / 2, hx = dv.getInt16(o + 4, true) / 20, hz = dv.getInt16(o + 6, true) / 20;
      const w1 = dv.getUint8(o + 8) / 4, h = dv.getUint8(o + 9) / 4, kr = dv.getUint8(o + 10), seed = dv.getUint8(o + 11), reg = dv.getUint16(o + 12, true);
      const L = Math.hypot(hx, hz) || 1, px = (-hz / L) * w1, pz = (hx / L) * w1;
      const y0 = A.heightAt(cx, cz) - 0.5, y1 = y0 + 0.5 + h;
      const cs = [[cx - hx - px, cz - hz - pz], [cx + hx - px, cz + hz - pz], [cx + hx + px, cz + hz + pz], [cx - hx + px, cz - hz + pz]];
      const roof = kr >> 4;
      col.setHex(roof ? ROOF_TILE[seed & 3] : ROOF_FLAT[seed & 3]).convertSRGBToLinear();
      const a = cs.map(([x, z]) => put(x, y1, z, 0, 1, 0, reg));
      // winding: make the roof face up regardless of corner order
      const cross = (cs[1][0] - cs[0][0]) * (cs[2][1] - cs[0][1]) - (cs[1][1] - cs[0][1]) * (cs[2][0] - cs[0][0]);
      if (cross < 0) { I[k++] = a[0]; I[k++] = a[1]; I[k++] = a[2]; I[k++] = a[0]; I[k++] = a[2]; I[k++] = a[3]; }
      else { I[k++] = a[0]; I[k++] = a[2]; I[k++] = a[1]; I[k++] = a[0]; I[k++] = a[3]; I[k++] = a[2]; }
      if (big(h, w1, L)) {
        col.setHex(WALLS[(seed >> 2) & 7]).convertSRGBToLinear();
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
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(P, 3));
    geo.setAttribute("normal", new BufferAttribute(N, 3));
    geo.setAttribute("color", new BufferAttribute(C, 3, true));
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
    for (const [key, r] of regs) {
      if (r.state !== "built") continue;
      const [rx, rz] = key.split(",").map(Number);
      if (rx < 0 || rz < 0 || rx > 31 || rz > 31) continue;
      this.mask[(rz * 32 + rx) * 4] = 255; m++;
    }
    this.stats.masked = m;
    this.tex.needsUpdate = true;
  }
}
