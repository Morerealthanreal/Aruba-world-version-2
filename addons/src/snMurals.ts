import * as THREE from "three";
import { MURAL_SKIP } from "./muralSkip";
import type { AGame } from "./env";
import { loadMuralAtlas, muralAtlasKey, releaseMuralAtlas } from "./muralAtlas";

// San Nicolas Art Fair murals as one shared atlas on the real OSM walls.
// The JPEG is an original painting. Public photos were reference only.
type Mural = {
  id: string;
  p0: [number, number];
  p1: [number, number];
  center: [number, number];
  height: number;
  bld_h: number;
  uv: [number, number, number, number];
  normal?: [number, number];
  wall_len?: number;
  /** "ground" sits the paint on the street. Omitted murals stay centered on the wall. */
  base?: "ground" | "mid";
  lift?: number;
  /** Rectangles cut out of the quad, in metres along p0→p1 and up from the bottom. */
  holes?: [number, number, number, number][];
};

type Doc = {
  atlas: string;
  hide_heroes: { id: string; x: number; z: number }[];
  murals: Mural[];
};

const UNLOAD_M = 3200;
const RELOAD_M = 2800;

export class SnMurals {
  mesh?: THREE.Mesh;
  private doc?: Doc;
  private atlas?: THREE.Texture;
  private atlasPath?: string;
  private ys: number[] = [];
  private grounded = false;
  private loadOnce?: Promise<void>;
  private k = 0;
  private hidden: THREE.Object3D[] = [];
  private heroScan = true;
  private unloaded = false;
  private wasNear = false;
  private readonly tmp = new THREE.Vector3();

  constructor(private g: AGame) {
    this.loadOnce = this.load().catch((e) => console.warn("[aw] sn murals", e));
  }

  private async load() {
    const res = await fetch("./data/sn_murals.json");
    if (!res.ok) throw new Error("sn_murals.json " + res.status);
    const doc = (await res.json()) as Doc;
    doc.murals = doc.murals.filter((m) => !MURAL_SKIP.has(m.id));
    if (!doc.murals.length) return;
    const atlasPath = muralAtlasKey(doc.atlas);
    const tex = await loadMuralAtlas(atlasPath, this.g.renderer);
    this.atlas = tex;
    this.atlasPath = atlasPath;
    this.unloaded = false;
    const mat = new THREE.MeshLambertMaterial({
      map: tex,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    });
    if (!this.mesh) {
      const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
      mesh.name = "aw:sn-murals";
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 2;
      this.g.scene.add(mesh);
      this.mesh = mesh;
    } else {
      this.mesh.material = mat;
    }
    this.doc = doc;
    this.mesh.visible = false;
    this.grounded = false;
    this.tryGround();
  }

  private unloadAtlas() {
    if (!this.atlasPath || this.unloaded) return;
    releaseMuralAtlas(this.atlasPath);
    this.atlas = undefined;
    this.unloaded = true;
    this.grounded = false;
    if (this.mesh) this.mesh.visible = false;
  }

  private nearestDist() {
    const walk = this.g.S?.walk;
    if (!walk || !this.doc) return Infinity;
    let d = Infinity;
    for (const m of this.doc.murals) {
      d = Math.min(d, Math.hypot(walk.x - m.center[0], walk.z - m.center[1]));
    }
    return d;
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

  private buildBuffers(murals: Mural[], ys: number[] | null) {
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
      const nx = m.normal?.[0] ?? 0;
      const nz = m.normal?.[1] ?? 0;
      const inset = 0.02;
      const ox = -nx * inset;
      const oz = -nz * inset;
      for (const [lx0, ly0, lx1, ly1] of rects) {
        const f0 = lx0 / span;
        const f1 = lx1 / span;
        const g0 = ly0 / h;
        const g1 = ly1 / h;
        const base = pos.length / 3;
        pos.push(
          x0 + (x1 - x0) * f0 + ox, y + ly0, z0 + (z1 - z0) * f0 + oz,
          x0 + (x1 - x0) * f1 + ox, y + ly0, z0 + (z1 - z0) * f1 + oz,
          x0 + (x1 - x0) * f1 + ox, y + ly1, z0 + (z1 - z0) * f1 + oz,
          x0 + (x1 - x0) * f0 + ox, y + ly1, z0 + (z1 - z0) * f0 + oz,
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
    return { pos, uv, idx };
  }

  private applyGeo(mesh: THREE.Mesh, pos: number[], idx: number[], uv?: number[]) {
    const geo = mesh.geometry;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute | undefined;
    const uvAttr = geo.getAttribute("uv") as THREE.BufferAttribute | undefined;
    const index = geo.getIndex();
    const needUv = uv !== undefined;
    if (
      posAttr &&
      (!needUv || uvAttr) &&
      index &&
      posAttr.count === pos.length / 3 &&
      (!needUv || (uvAttr && uvAttr.count === uv!.length / 2)) &&
      index.count === idx.length
    ) {
      posAttr.array.set(pos);
      posAttr.needsUpdate = true;
      if (needUv && uvAttr && uv) {
        uvAttr.array.set(uv);
        uvAttr.needsUpdate = true;
      }
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
      return;
    }
    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (needUv && uv) next.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    next.setIndex(idx);
    next.computeVertexNormals();
    next.computeBoundingSphere();
    geo.dispose();
    mesh.geometry = next;
  }

  private applyGround(mesh: THREE.Mesh, murals: Mural[], ys: number[]) {
    const { pos, uv, idx } = this.buildBuffers(murals, ys);
    this.applyGeo(mesh, pos, idx, uv);
  }

  private hAt(x: number, z: number) {
    const real = this.g.real as unknown as { heightAt?: (x: number, z: number) => number };
    const y = real.heightAt?.(x, z);
    return typeof y === "number" ? y : NaN;
  }

  private tryGround() {
    const doc = this.doc;
    const mesh = this.mesh;
    if (!doc || !mesh || this.unloaded) return;
    const ys: number[] = [];
    for (const m of doc.murals) {
      const y = this.hAt(m.center[0], m.center[1]);
      if (!Number.isFinite(y)) return;
      ys.push(y);
    }
    if (this.grounded && ys.every((y, i) => Math.abs(y - this.ys[i]) < 0.05)) return;
    this.applyGround(mesh, doc.murals, ys);
    mesh.visible = true;
    this.ys = ys;
    this.grounded = true;
  }

  private suppressSkyDecoys() {
    const owlX = 6376.26;
    const owlZ = 9392.15;
    const markHidden = (o: THREE.Object3D) => {
      o.visible = false;
      if (!this.hidden.includes(o)) this.hidden.push(o);
    };
    this.g.scene.traverse((o) => {
      let p: THREE.Object3D | null = o;
      while (p) {
        const nm = p.name || "";
        if (nm.includes("sn_owl")) {
          markHidden(o);
          return;
        }
        p = p.parent;
      }
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        this.tmp.set(0, 0, 0);
        m.getWorldPosition(this.tmp);
        const nearKorps = Math.hypot(this.tmp.x - 6369.8, this.tmp.z - 9310.35) < 90;
        const nearOwl = Math.hypot(this.tmp.x - owlX, this.tmp.z - owlZ) < 45;
        const r = m.geometry?.boundingSphere?.radius ?? 0;
        if (this.tmp.y > 9 && r < 12 && (nearKorps || nearOwl) && !nm.includes("sn-mural") && !nm.includes("palm")) {
          markHidden(o);
        }
      }
    });
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
        const hideR = 2.5;
        if (Math.hypot(this.tmp.x - h.x, this.tmp.z - h.z) < hideR) {
          this.hidden.push(child);
          found.add(child);
          break;
        }
      }
    }
    if (this.hidden.length >= doc.hide_heroes.length) this.heroScan = false;
  }

  update() {
    if ((this.k & 63) === 0 && this.doc) {
      const d = this.nearestDist();
      if (d < RELOAD_M) this.wasNear = true;
      if (this.wasNear && d > UNLOAD_M && !this.unloaded) this.unloadAtlas();
      else if (d < RELOAD_M && this.unloaded) void this.load();
    }
    if (!this.mesh) return;
    if ((++this.k & 31) === 0 || !this.grounded) this.tryGround();
    if ((this.k & 31) === 0) this.collectHeroes();
    this.suppressSkyDecoys();
    for (const o of this.hidden) o.visible = false;
  }
}
