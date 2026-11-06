// Roof landing & walkable roof collision.
// When switching from plane to on-foot above a building, the player lands standing
// on its roof (never inside the ground floor or underneath the roof) and can walk,
// jump, and step off the roof edge naturally. Off with ?roofland=0.
import { BufferGeometry, Raycaster, Vector3, type Intersection, type Material, type Mesh, type Object3D } from "three";
import type { AGame } from "./env";

// Add-on bundle carries its own Three.js module instance whose BufferGeometry id counter
// starts at 0, colliding with the main bundle's WebGLGeometries/WebGLBindingStates id
// tables (so disposed add-on geometries never fire onGeometryDispose in the renderer).
// Offset add-on BufferGeometry ids into a disjoint fast-array range.
const origDefProp = Object.defineProperty;
Object.defineProperty = function <T>(obj: T, prop: PropertyKey, desc: PropertyDescriptor & ThisType<unknown>): T {
  if (prop === "id" && obj instanceof BufferGeometry && desc && typeof desc.value === "number") {
    desc.value += 20000;
  }
  return origDefProp(obj, prop, desc);
};

type WalkState = {
  x: number;
  z: number;
  y: number;
  vy?: number;
  g?: number;
  snap?: boolean;
  face?: number;
};

type BatchEntry = {
  bm: Mesh;
  box: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } };
};

type RegionEntry = {
  state?: string;
  group?: Object3D;
  __awBB?: BatchEntry[];
  json?: {
    b?: Array<{ p: number[][]; h?: number; r?: string; k?: string; dt?: number; i?: number; _hs?: number }>;
  };
};

type HeroEntry = {
  id?: string;
  k?: string;
  x: number;
  z: number;
  y?: number;
  _g?: Object3D;
  _hi?: Object3D;
  _lo?: Object3D;
  _sign?: Object3D;
  _top?: number;
  hide_footprint?: number[][];
};

type BrandEntry = {
  k?: string;
  x: number;
  z: number;
  h?: number;
  foot?: number[][];
  hero?: HeroEntry;
};

type RealWorld = {
  M: { X0: number; Z0: number; RS: number; PX: number };
  regions: Map<string, RegionEntry>;
  heightAt: (x: number, z: number) => number;
  brands?: {
    list?: BrandEntry[];
    heightFor?: (b: { p?: number[][] }) => number;
  };
  hero?: {
    list?: HeroEntry[];
    hides?: (p: number[][]) => boolean;
    update?: (x: number, z: number) => void;
  };
};

type DataBuilding = {
  p: number[][];
  h?: number;
  bb?: [number, number, number, number];
};

const SKIP_MAT = /^(sign|signback|lsign|bulb|bulbcan|led|pole|cart)$/i;
const CELL = 40;

function pointInPoly(poly: number[][] | undefined | null, x: number, z: number): boolean {
  if (!poly || poly.length < 3) return false;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const p0 = poly[i], p1 = poly[j];
    const x0 = p0[0], z0 = p0[1], x1 = p1[0], z1 = p1[1];
    if ((z0 > z) !== (z1 > z) && x < ((x1 - x0) * (z - z0)) / (z1 - z0) + x0) {
      inside = !inside;
    }
  }
  return inside;
}

export class RoofLand {
  private real: RealWorld;
  private origHeightAt: (x: number, z: number) => number;
  private origHeightFn: (x: number, z: number) => number;
  private walkHeightAt: (x: number, z: number) => number;
  private origGroundAt?: (x: number, z: number, curG?: number | null) => number | null;
  private origBlocked?: (x: number, z: number) => boolean;
  private prevDoor?: (x: number, z: number) => boolean;
  private raycaster = new Raycaster();
  private rayOrigin = new Vector3();
  private rayDir = new Vector3(0, -1, 0);
  private hits: Intersection[] = [];
  private queryingRaw = false;
  private onRoof = false;
  private pendingPlaneLand = false;
  private landing: { x: number; z: number; frames: number } | null = null;
  private dataGrid: Map<number, DataBuilding[]> | null = null;
  private flushingScene = false;

  constructor(private g: AGame) {
    const real = g.real as unknown as RealWorld;
    this.real = real;
    this.origHeightFn = real.heightAt;
    this.origHeightAt = real.heightAt.bind(real);

    const gameAny = g as unknown as {
      groundAt?: (x: number, z: number, curG?: number | null) => number | null;
      blocked?: (x: number, z: number) => boolean;
      setMode?: (mode: string, ...rest: unknown[]) => unknown;
      teleport?: (mode: string, x: number, z: number, h?: number, extra?: Record<string, unknown>) => void;
      walker?: Object3D;
    };
    if (typeof gameAny.groundAt === "function") {
      this.origGroundAt = gameAny.groundAt.bind(g);
    }
    if (typeof gameAny.blocked === "function") {
      this.origBlocked = gameAny.blocked.bind(g);
    }

    const walk = g.S.walk as WalkState;
    let snapVal = Boolean(walk.snap);
    let vyVal = Number(walk.vy || 0);

    this.walkHeightAt = (x: number, z: number): number => {
      const terrY = this.origHeightAt(x, z);
      if (this.g.S.mode !== "walk") return terrY;
      const refY = Math.max(walk.y, walk.g ?? 0);
      const ceiling = (snapVal && this.landing) ? Infinity : refY + 1.05;
      const ry = this.roofHeightAt(x, z, ceiling);
      if (ry !== null && ((snapVal && this.landing) || refY + 1.05 >= ry)) {
        this.onRoof = true;
        return ry;
      }
      return terrY;
    };

    // 1. Chain window.__awDoor. Fast-path when not on a roof so driving/walking on ground has zero overhead.
    const w = window as unknown as { __awDoor?: (x: number, z: number) => boolean };
    this.prevDoor = w.__awDoor;
    w.__awDoor = (x: number, z: number): boolean => {
      if (this.queryingRaw) return false;
      if ((this.onRoof || this.landing) && this.g.S.mode === "walk") {
        const dist = Math.hypot(x - walk.x, z - walk.z);
        const refY = Math.max(walk.y, walk.g ?? 0);
        // Camera ray X_(Rv, zv) samples up to 5.2 m from the player at head height (y + 1.55).
        const tol = dist > 1.2 ? 1.65 : 1.05;
        const ry = this.roofHeightAt(x, z, refY + tol);
        if (ry !== null && refY + tol >= ry) return true;
      }
      return this.prevDoor ? this.prevDoor(x, z) : false;
    };

    // 2. Hook walk.snap and walk.vy so real.heightAt is only overridden during the few lines of
    // Bv's walk step when the player is actually on a roof, leaving real.heightAt untouched everywhere else.
    Object.defineProperty(walk, "snap", {
      configurable: true,
      enumerable: true,
      get: () => {
        if (this.pendingPlaneLand && this.g.S.mode === "walk") {
          this.pendingPlaneLand = false;
          this.landFromPlane(walk.x, walk.z);
        }
        if (this.g.S.mode === "walk" && (this.onRoof || this.landing)) {
          this.real.heightAt = this.walkHeightAt;
        }
        return snapVal;
      },
      set: (v: boolean) => {
        const next = Boolean(v);
        // Inside Tv("walk"), $.walk.snap = true runs right after $.walk.{x,z} are set from $.plane
        // and right before $.mode is assigned "walk".
        if (next && this.g.S.mode === "plane") {
          this.pendingPlaneLand = true;
          queueMicrotask(() => {
            if (this.pendingPlaneLand && this.g.S.mode === "walk") {
              this.pendingPlaneLand = false;
              this.landFromPlane(walk.x, walk.z);
            }
          });
        }
        snapVal = next;
      },
    });

    Object.defineProperty(walk, "vy", {
      configurable: true,
      enumerable: true,
      get: () => vyVal,
      set: (v: number) => {
        if (this.real.heightAt !== this.origHeightFn) {
          this.real.heightAt = this.origHeightFn;
        }
        vyVal = Number(v);
      },
    });

    // 3. Wrap game.setMode and game.teleport so synchronous callers see walk.y on the roof immediately.
    if (typeof gameAny.setMode === "function") {
      const origSetMode = gameAny.setMode.bind(g);
      gameAny.setMode = (mode: string, ...rest: unknown[]) => {
        const prevMode = this.g.S.mode;
        const res = origSetMode(mode, ...rest);
        if (mode === "walk" && prevMode === "plane") {
          this.pendingPlaneLand = false;
          this.landFromPlane(walk.x, walk.z);
        } else if (mode !== "walk") {
          this.clearRoofState();
        }
        return res;
      };
    }

    if (typeof gameAny.teleport === "function") {
      const origTp = gameAny.teleport.bind(g);
      gameAny.teleport = (mode: string, x: number, z: number, h?: number, extra: Record<string, unknown> = {}) => {
        const prevMode = this.g.S.mode;
        origTp(mode, x, z, h, extra);
        if (mode === "walk" && extra?.y === undefined) {
          if (prevMode === "plane" || this.rawBlocked(x, z)) {
            this.pendingPlaneLand = false;
            this.landFromPlane(x, z);
          }
        } else if (mode !== "walk") {
          this.clearRoofState();
        }
      };
    }

    if (this.origGroundAt) {
      const origGA = this.origGroundAt;
      gameAny.groundAt = (x: number, z: number, curG: number | null = null): number | null => {
        if ((this.onRoof || this.landing) && this.g.S.mode === "walk") {
          const refY = Math.max(walk.y, walk.g ?? 0, curG ?? 0);
          const ry = this.roofHeightAt(x, z, this.landing ? Infinity : refY + 1.05);
          if (ry !== null) return ry;
        }
        return origGA(x, z, curG);
      };
    }

    const origTraverse = g.scene.traverse.bind(g.scene);
    g.scene.traverse = (cb: (obj: Object3D) => unknown) => {
      if (!this.flushingScene) {
        const src = String(cb);
        if (src.includes("isLOD") || src.includes("sceneGeometries")) {
          this.flushPendingScene();
        }
      }
      return origTraverse(cb);
    };
  }

  private flushPendingScene(): void {
    this.flushingScene = true;
    try {
      const aw = (window as unknown as {
        __aw?: {
          bbatch?: { busy?: () => number; afterJobs?: () => void };
          mperf?: { afterJobs?: () => void };
          perf?: {
            inst?: { pending?: () => number; afterJobs?: (r: unknown) => void };
            reuseRegionTextures?: () => void;
            warmRegionTextures?: () => void;
            uploadPendingMaps?: (x: number, z: number) => void;
            noteSwaps?: () => void;
            releaseOrphans?: () => void;
          };
        };
      }).__aw;
      for (let i = 0; i < 64 && (aw?.bbatch?.busy?.() || 0) > 0; i++) {
        aw?.bbatch?.afterJobs?.();
      }
      for (let i = 0; i < 16 && (aw?.perf?.inst?.pending?.() || 0) > 0; i++) {
        aw?.perf?.inst?.afterJobs?.(this.real.regions);
      }
      aw?.mperf?.afterJobs?.();
      const s = this.g.S as unknown as { mode: string; car: { x: number; z: number }; walk: { x: number; z: number } };
      const pos = s.mode === "car" || s.mode === "moto" ? s.car : s.walk;
      aw?.perf?.reuseRegionTextures?.();
      aw?.perf?.warmRegionTextures?.();
      for (let i = 0; i < 8; i++) {
        aw?.perf?.uploadPendingMaps?.(pos.x, pos.z);
      }
      aw?.perf?.noteSwaps?.();
      aw?.perf?.releaseOrphans?.();
    } finally {
      this.flushingScene = false;
    }
  }

  private clearRoofState(): void {
    this.onRoof = false;
    this.landing = null;
    this.pendingPlaneLand = false;
    if (this.real.heightAt !== this.origHeightFn) {
      this.real.heightAt = this.origHeightFn;
    }
  }

  /** Snap the walker onto a building roof when transitioning from plane to on-foot. */
  private landFromPlane(x: number, z: number): void {
    if (this.real.heightAt !== this.origHeightFn) {
      this.real.heightAt = this.origHeightFn;
    }
    this.real.hero?.update?.(x, z);
    const walk = this.g.S.walk as WalkState;
    const ry = this.roofHeightAt(x, z, Infinity);
    if (ry !== null) {
      this.onRoof = true;
      this.landing = { x, z, frames: 180 };
      walk.g = ry;
      walk.y = ry;
      walk.vy = 0;
      this.syncWalker();
    } else {
      this.clearRoofState();
    }
  }

  private syncWalker(): void {
    const walk = this.g.S.walk as WalkState;
    const walker = (this.g as unknown as { walker?: Object3D }).walker;
    if (walker) walker.position.set(walk.x, walk.y, walk.z);
  }

  /** Per-frame update: no-op unless the player is currently on a roof. */
  update(): void {
    if (this.real.heightAt !== this.origHeightFn) {
      this.real.heightAt = this.origHeightFn;
    }
    if (!this.onRoof && !this.landing) return;
    if (this.g.S.mode !== "walk") {
      this.clearRoofState();
      return;
    }
    const walk = this.g.S.walk as WalkState;
    if (this.landing) {
      if (Math.hypot(walk.x - this.landing.x, walk.z - this.landing.z) > 3.5 || --this.landing.frames <= 0) {
        this.landing = null;
      } else {
        const ry = this.roofHeightAt(walk.x, walk.z, Infinity);
        if (ry !== null) {
          this.onRoof = true;
          if (walk.g === undefined || Math.abs(walk.g - ry) > 0.02 || walk.y < ry - 0.05) {
            walk.g = ry;
            if (walk.y < ry || Math.abs(walk.y - ry) < 6) {
              walk.y = ry;
              walk.vy = 0;
              this.syncWalker();
            }
          }
        }
      }
    }
    if (this.onRoof) {
      const terrY = this.origHeightAt(walk.x, walk.z);
      if (walk.y <= terrY + 0.45 && (walk.g ?? terrY) <= terrY + 0.45) {
        this.onRoof = false;
      }
    }
  }

  /** True when (x, z) is inside any building footprint in the game's raw collision hash. */
  private rawBlocked(x: number, z: number): boolean {
    if (!this.origBlocked) return false;
    this.queryingRaw = true;
    try {
      return this.origBlocked(x, z);
    } finally {
      this.queryingRaw = false;
    }
  }

  /** Compute the highest walkable roof surface Y at (x, z) at or below ceilingY, or null if none. */
  roofHeightAt(x: number, z: number, ceilingY = Infinity): number | null {
    const terrY = this.origHeightAt(x, z);
    if (!Number.isFinite(terrY)) return null;
    const minRoofY = terrY + 1.8;
    if (ceilingY < minRoofY) return null;

    const isBlocked = this.rawBlocked(x, z);
    const heroes = this.real.hero?.list;
    let hasNearbyHero = false;
    if (heroes) {
      for (let i = 0; i < heroes.length; i++) {
        const h = heroes[i];
        if (Math.abs(h.x - x) < 180 && Math.abs(h.z - z) < 180) {
          hasNearbyHero = true;
          break;
        }
      }
    }
    if (!isBlocked && !hasNearbyHero) return null;

    const rayTop = Math.min(ceilingY, 450);
    const far = rayTop - minRoofY;
    this.rayOrigin.set(x, rayTop, z);
    this.raycaster.set(this.rayOrigin, this.rayDir);
    this.raycaster.near = 0;
    this.raycaster.far = Math.max(0, far);

    let heroMeshY = -Infinity;
    let procMeshY = -Infinity;

    // 1. Raycast loaded 3D Hero GLBs near (x, z).
    if (heroes && far > 0) {
      for (let i = 0; i < heroes.length; i++) {
        const n = heroes[i];
        if (!n._g || Math.abs(n.x - x) > 180 || Math.abs(n.z - z) > 180) continue;
        const target = n._hi || n._g;
        const prevG = n._g.visible;
        const prevT = target.visible;
        n._g.visible = true;
        target.visible = true;
        this.hits.length = 0;
        try {
          this.raycaster.intersectObject(target, true, this.hits);
        } finally {
          n._g.visible = prevG;
          target.visible = prevT;
        }
        for (let j = 0; j < this.hits.length; j++) {
          const hit = this.hits[j];
          const py = hit.point.y;
          if (py <= minRoofY || py > ceilingY) continue;
          if (n._sign && (hit.object === n._sign || hit.object.parent === n._sign)) continue;
          const mesh = hit.object as Mesh;
          const mat = Array.isArray(mesh.material) ? mesh.material[0] : (mesh.material as Material | undefined);
          if (mat?.name && SKIP_MAT.test(mat.name)) continue;
          if (hit.face && Math.abs(hit.face.normal.y) < 0.25) continue;
          if (py > heroMeshY) heroMeshY = py;
        }
      }
    }

    // 2. Raycast procedural region BatchedMeshes (aw:bb:roof, aw:bb:tiles) and unbatched roof meshes.
    const M = this.real.M;
    const rx = Math.floor((x - M.X0) / M.RS);
    const rz = Math.floor((z - M.Z0) / M.RS);
    const R = this.real.regions?.get(`${rx},${rz}`);
    if (R && far > 0) {
      if (R.__awBB) {
        for (let i = 0; i < R.__awBB.length; i++) {
          const b = R.__awBB[i];
          const name = b.bm.name;
          if (name !== "aw:bb:roof" && name !== "aw:bb:tiles") continue;
          const box = b.box;
          if (x < box.min.x - 1 || x > box.max.x + 1 || z < box.min.z - 1 || z > box.max.z + 1) continue;
          this.hits.length = 0;
          try {
            b.bm.raycast(this.raycaster, this.hits);
          } catch {
            /* ignore partial batch state */
          }
          for (let j = 0; j < this.hits.length; j++) {
            const py = this.hits[j].point.y;
            if (py > minRoofY && py <= ceilingY && py > procMeshY) procMeshY = py;
          }
        }
      }
      if (R.group) {
        const ch = R.group.children;
        for (let i = 0; i < ch.length; i++) {
          const c = ch[i];
          if (c.name.startsWith("aw:bb:")) continue;
          c.traverse((o) => {
            const m = o as Mesh;
            if (!m.isMesh || (m.name !== "bld:roof" && m.name !== "bld:tiles")) return;
            this.hits.length = 0;
            try {
              m.raycast(this.raycaster, this.hits);
            } catch {
              /* ignore */
            }
            for (let j = 0; j < this.hits.length; j++) {
              const py = this.hits[j].point.y;
              if (py > minRoofY && py <= ceilingY && py > procMeshY) procMeshY = py;
            }
          });
        }
      }
    }

    // 3. Analytical building footprint height (covers the 0.22 m parapet inset on flat OSM roofs
    // and provides immediate roof height when a region or hero GLB is still streaming in).
    let analY = -Infinity;
    const polyBaseY = (poly: number[][]): number => {
      let maxV = terrY;
      for (let i = 0; i < poly.length; i++) {
        const pt = poly[i];
        const h = this.origHeightAt(pt[0], pt[1]);
        if (h > maxV) maxV = h;
      }
      return maxV;
    };

    if (R?.json?.b) {
      const blds = R.json.b;
      for (let i = 0; i < blds.length; i++) {
        const l = blds[i];
        if (!pointInPoly(l.p, x, z)) continue;
        const v = polyBaseY(l.p);
        const bh = this.real.brands?.heightFor?.(l) || l.h || 3.4;
        const top = v + Math.max(2.6, bh);
        if (top <= ceilingY && top > analY) analY = top;
      }
    }

    if (heroMeshY < 0) {
      if (heroes) {
        for (let i = 0; i < heroes.length; i++) {
          const n = heroes[i];
          if (Math.abs(n.x - x) > 200 || Math.abs(n.z - z) > 200) continue;
          if (n.hide_footprint && pointInPoly(n.hide_footprint, x, z)) {
            if (n._top && n._top > minRoofY && n._top <= ceilingY && n._top > analY) {
              analY = n._top;
            }
          }
        }
      }
      const brands = this.real.brands?.list;
      if (brands) {
        for (let i = 0; i < brands.length; i++) {
          const b = brands[i];
          if (Math.abs(b.x - x) > 200 || Math.abs(b.z - z) > 200) continue;
          if (b.foot && pointInPoly(b.foot, x, z)) {
            const v = polyBaseY(b.foot);
            const top = v + Math.max(2.6, b.h || 3.4);
            if (top <= ceilingY && top > analY) analY = top;
          }
        }
      }
    }

    if (analY < 0 && heroMeshY < 0 && procMeshY < 0 && isBlocked) {
      const grid = this.getDataGrid();
      const bucket = grid.get(Math.floor(x / CELL) * 100000 + Math.floor(z / CELL));
      if (bucket) {
        for (let i = 0; i < bucket.length; i++) {
          const b = bucket[i];
          const bb = b.bb;
          if (bb && (x < bb[0] || x > bb[1] || z < bb[2] || z > bb[3])) continue;
          if (!pointInPoly(b.p, x, z)) continue;
          const v = polyBaseY(b.p);
          const bh = this.real.brands?.heightFor?.(b) || (b.h && b.h > 0 ? b.h : 3.4);
          const top = v + Math.max(2.6, bh);
          if (top <= ceilingY && top > analY) analY = top;
        }
      }
    }

    if (heroMeshY > 0) return heroMeshY;
    const best = Math.max(procMeshY, analY);
    return best > 0 ? best : null;
  }

  private getDataGrid(): Map<number, DataBuilding[]> {
    if (this.dataGrid) return this.dataGrid;
    const grid = new Map<number, DataBuilding[]>();
    const blds = (this.g as unknown as { DATA?: { buildings?: DataBuilding[] } }).DATA?.buildings || [];
    for (let i = 0; i < blds.length; i++) {
      const b = blds[i];
      const p = b.p;
      if (!p || p.length < 3) continue;
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (let j = 0; j < p.length; j++) {
        const pt = p[j];
        if (pt[0] < x0) x0 = pt[0];
        if (pt[0] > x1) x1 = pt[0];
        if (pt[1] < z0) z0 = pt[1];
        if (pt[1] > z1) z1 = pt[1];
      }
      b.bb = [x0, x1, z0, z1];
      const cx0 = Math.floor(x0 / CELL), cx1 = Math.floor(x1 / CELL);
      const cz0 = Math.floor(z0 / CELL), cz1 = Math.floor(z1 / CELL);
      for (let cx = cx0; cx <= cx1; cx++) {
        for (let cz = cz0; cz <= cz1; cz++) {
          const k = cx * 100000 + cz;
          let arr = grid.get(k);
          if (!arr) {
            arr = [];
            grid.set(k, arr);
          }
          arr.push(b);
        }
      }
    }
    this.dataGrid = grid;
    return grid;
  }
}
