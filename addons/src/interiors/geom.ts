// Small indexed geometry builder. Normals are explicit unit vectors; a quad whose
// winding disagrees with the requested normal is flipped. Degenerate quads are skipped.
import { BufferGeometry, Float32BufferAttribute, Uint16BufferAttribute } from "three";

type V3 = [number, number, number];

export class Builder {
  private p: number[] = [];
  private n: number[] = [];
  private c: number[] = [];
  private u: number[] = [];
  private ix: number[] = [];
  hasUv = false;

  quad(pts: [V3, V3, V3, V3], normal: V3, color: V3, uv?: [[number, number], [number, number], [number, number], [number, number]]) {
    const e1x = pts[1][0] - pts[0][0], e1y = pts[1][1] - pts[0][1], e1z = pts[1][2] - pts[0][2];
    const e2x = pts[2][0] - pts[0][0], e2y = pts[2][1] - pts[0][1], e2z = pts[2][2] - pts[0][2];
    const cx = e1y * e2z - e1z * e2y, cy = e1z * e2x - e1x * e2z, cz = e1x * e2y - e1y * e2x;
    const cl = cx * cx + cy * cy + cz * cz;
    if (!(cl > 1e-10)) return;
    const nl = Math.hypot(normal[0], normal[1], normal[2]) || 1;
    const nx = normal[0] / nl, ny = normal[1] / nl, nz = normal[2] / nl;
    const flip = cx * nx + cy * ny + cz * nz < 0;
    const base = this.p.length / 3;
    for (let k = 0; k < 4; k++) {
      const q = pts[k];
      this.p.push(q[0], q[1], q[2]);
      this.n.push(nx, ny, nz);
      this.c.push(color[0], color[1], color[2]);
      if (uv) { this.hasUv = true; const t = uv[k]; this.u.push(t[0], t[1]); }
    }
    if (!flip) this.ix.push(base, base + 1, base + 2, base, base + 2, base + 3);
    else this.ix.push(base, base + 3, base + 2, base, base + 2, base + 1);
  }

  geometry(): BufferGeometry {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(this.p, 3));
    g.setAttribute("normal", new Float32BufferAttribute(this.n, 3));
    g.setAttribute("color", new Float32BufferAttribute(this.c, 3));
    if (this.hasUv) g.setAttribute("uv", new Float32BufferAttribute(this.u, 2));
    g.setIndex(new Uint16BufferAttribute(this.ix, 1));
    g.computeBoundingSphere();
    sanitizeNormals(g);
    return g;
  }

  get tris() { return this.ix.length / 3; }
}

export function sanitizeNormals(g: BufferGeometry) {
  const a = g.getAttribute("normal");
  if (!a) return;
  const d = a.array as Float32Array;
  for (let i = 0; i < d.length; i += 3) {
    const x = d[i], y = d[i + 1], z = d[i + 2];
    if (!Number.isFinite(x + y + z) || x * x + y * y + z * z < 1e-8) {
      d[i] = 0; d[i + 1] = 1; d[i + 2] = 0;
    }
  }
}

export type Frame = {
  mx: number; mz: number;
  ux: number; uz: number;
  nx: number; nz: number;
};

export function pt(f: Frame, a: number, d: number, y: number): V3 {
  return [f.mx + f.ux * a + f.nx * d, y, f.mz + f.uz * a + f.nz * d];
}

/** Axis-aligned box in the shop frame (along, inward, up). Outward faces only. */
export function box(b: Builder, f: Frame, a0: number, a1: number, d0: number, d1: number, y0: number, y1: number, color: V3) {
  if (!(a1 > a0 + 1e-4 && d1 > d0 + 1e-4 && y1 > y0 + 1e-4)) return;
  const p000 = pt(f, a0, d0, y0), p100 = pt(f, a1, d0, y0), p110 = pt(f, a1, d1, y0), p010 = pt(f, a0, d1, y0);
  const p001 = pt(f, a0, d0, y1), p101 = pt(f, a1, d0, y1), p111 = pt(f, a1, d1, y1), p011 = pt(f, a0, d1, y1);
  const U: V3 = [f.ux, 0, f.uz], nU: V3 = [-f.ux, 0, -f.uz];
  const N: V3 = [f.nx, 0, f.nz], nN: V3 = [-f.nx, 0, -f.nz];
  b.quad([p001, p101, p111, p011], [0, 1, 0], color);
  b.quad([p000, p100, p110, p010], [0, -1, 0], color);
  b.quad([p010, p011, p111, p110], N, color);
  b.quad([p000, p100, p101, p001], nN, color);
  b.quad([p100, p110, p111, p101], U, color);
  b.quad([p000, p001, p011, p010], nU, color);
}
