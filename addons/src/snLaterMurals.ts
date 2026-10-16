import * as THREE from "three";
import type { AGame } from "./env";
import { loadMuralAtlas, muralAtlasKey } from "./muralAtlas";

// Later San Nicolas Art Fair murals. One shared JPEG, separate from the first set.
type Mural = {
  id: string;
  p0: [number, number];
  p1: [number, number];
  center: [number, number];
  height: number;
  bld_h: number;
  uv: [number, number, number, number];
  base?: "ground" | "mid";
  lift?: number;
  holes?: [number, number, number, number][];
};

type Doc = {
  atlas: string;
  hide_heroes: { id: string; x: number; z: number }[];
  murals: Mural[];
};

export class SnLaterMurals {
  mesh?: THREE.Mesh;
  private doc?: Doc;
  private ys: number[] = [];
  private grounded = false;
  private k = 0;
  private hidden: THREE.Object3D[] = [];
  private heroScan = true;
  private readonly tmp = new THREE.Vector3();

  constructor(private g: AGame) {
    void this.load().catch((e) => console.warn("[aw] sn later murals", e));
  }

  private async load() {
    const res = await fetch("./data/sn_later_murals.json");
    if (!res.ok) throw new Error("sn_later_murals.json " + res.status);
    const doc = (await res.json()) as Doc;
    const tex = await loadMuralAtlas(muralAtlasKey(doc.atlas), this.g.renderer);
    const mat = new THREE.MeshLambertMaterial({
      map: tex,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    });
    const mesh = new THREE.Mesh(this.geometry(doc.murals, null), mat);
    mesh.name = "aw:sn-later-murals";
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.visible = false;
    mesh.renderOrder = 2;
    this.doc = doc;
    this.mesh = mesh;
    this.g.scene.add(mesh);
    this.tryGround();
  }

  private subtract(rects: number[][], hole: [number, number, number, number]) {
    const [hx0, hy0, hx1, hy1] = hole;
    const out: number[][] = [];
    for (const [x0, y0, x1, y1] of rects) {
      if (x1 <= hx0 || x0 >= hx1 || y1 <= hy0 || y0 >= hy1) {
        out.push([x0, y0, x1, y1]);
        continue;
      }
      const top = Math.max(y0, hy0);
      const bot = Math.min(y1, hy1);
      if (y0 < hy0) out.push([x0, y0, x1, hy0]);
      if (y1 > hy1) out.push([x0, hy1, x1, y1]);
      if (x0 < hx0) out.push([x0, top, hx0, bot]);
      if (x1 > hx1) out.push([hx1, top, x1, bot]);
    }
    return out.filter((r) => r[2] - r[0] > 0.02 && r[3] - r[1] > 0.02);
  }

  private geometry(murals: Mural[], ys: number[] | null) {
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    murals.forEach((m, i) => {
      const ground = ys ? ys[i] : 0;
      const y = m.base === "ground"
        ? ground + (m.lift ?? 0.05)
        : ground + Math.max(0.06, (m.bld_h - m.height) * 0.5);
      const [x0, z0] = m.p0;
      const [x1, z1] = m.p1;
      const h = m.height;
      const span = Math.hypot(x1 - x0, z1 - z0) || 1;
      let rects = [[0, 0, span, h]];
      for (const hole of m.holes || []) rects = this.subtract(rects, hole);
      const [u0, v0, u1, v1] = m.uv;
      for (const [lx0, ly0, lx1, ly1] of rects) {
        const f0 = lx0 / span;
        const f1 = lx1 / span;
        const g0 = ly0 / h;
        const g1 = ly1 / h;
        const base = pos.length / 3;
        pos.push(
          x0 + (x1 - x0) * f0, y + ly0, z0 + (z1 - z0) * f0,
          x0 + (x1 - x0) * f1, y + ly0, z0 + (z1 - z0) * f1,
          x0 + (x1 - x0) * f1, y + ly1, z0 + (z1 - z0) * f1,
          x0 + (x1 - x0) * f0, y + ly1, z0 + (z1 - z0) * f0,
        );
        uv.push(
          u0 + (u1 - u0) * f0, v0 + (v1 - v0) * g0,
          u0 + (u1 - u0) * f1, v0 + (v1 - v0) * g0,
          u0 + (u1 - u0) * f1, v0 + (v1 - v0) * g1,
          u0 + (u1 - u0) * f0, v0 + (v1 - v0) * g1,
        );
        idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    return geo;
  }

  private hAt(x: number, z: number) {
    const real = this.g.real as unknown as { heightAt?: (x: number, z: number) => number };
    const y = real.heightAt?.(x, z);
    return typeof y === "number" ? y : NaN;
  }

  private tryGround() {
    const doc = this.doc;
    const mesh = this.mesh;
    if (!doc || !mesh) return;
    const ys: number[] = [];
    for (const m of doc.murals) {
      const y = this.hAt(m.center[0], m.center[1]);
      if (!Number.isFinite(y)) return;
      ys.push(y);
    }
    if (this.grounded && ys.every((y, i) => Math.abs(y - this.ys[i]) < 0.05)) return;
    const geo = this.geometry(doc.murals, ys);
    mesh.geometry.dispose();
    mesh.geometry = geo;
    mesh.visible = true;
    this.ys = ys;
    this.grounded = true;
  }

  private collectHeroes() {
    const doc = this.doc;
    if (!doc || !this.heroScan) return;
    const group = this.g.scene.getObjectByName("hero");
    if (!group) return;
    const found = new Set(this.hidden);
    for (const child of group.children) {
      if (found.has(child)) continue;
      child.getWorldPosition(this.tmp);
      for (const h of doc.hide_heroes) {
        if (Math.hypot(this.tmp.x - h.x, this.tmp.z - h.z) < 2.5) {
          this.hidden.push(child);
          found.add(child);
          break;
        }
      }
    }
    if (this.hidden.length >= doc.hide_heroes.length) this.heroScan = false;
  }

  update() {
    if (!this.mesh) return;
    if ((++this.k & 31) === 0 || !this.grounded) this.tryGround();
    if ((this.k & 31) === 0) this.collectHeroes();
    for (const o of this.hidden) o.visible = false;
  }
}
