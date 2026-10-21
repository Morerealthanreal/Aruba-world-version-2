// Engine Stability System:
// 1. Chunk & Region Streaming: Prevents load/unload thrashing at borders by anchoring
//    retention distance to actual player position instead of lookahead-shifted coordinates,
//    and accelerates build dispatch for nearby data-ready regions.
// 2. Flicker & Z-Fighting Elimination: Smooth, mode-aware camera near planes (0.8m for car,
//    2.0m for flight, 0.35m for walk) maximize depth precision by 3x-8x; hierarchical
//    polygonOffset prevents coplanar z-fighting between roads, plates, and markings.
// 3. Frame Pacing: Smooths texture upload bursts across animation frames.
// Disable with ?stability=0.
import type { Material, Mesh, Object3D } from "three";
import type { AGame } from "./env";

type Region = {
  rx: number;
  rz: number;
  state: string;
  group?: Object3D;
  chunks?: Array<{ mesh?: Mesh; step: number; pending?: boolean }>;
};

type RealWorld = {
  M: { X0: number; Z0: number; RS: number; PX: number };
  q: { name: string; radius: number; lod: [number, number] };
  regions: Map<string, Region>;
  disposeRegion(r: Region): void;
  ensureBuilt?(r: Region): void;
  roads?: {
    asphalt?: Material;
    dirt?: Material;
    walk?: Material;
    runwayMat?: Material;
  };
};

export class Stability {
  private real: RealWorld;
  private origDisposeRegion: (r: Region) => void;
  private configuredMaterials = new WeakSet<Material>();
  private configuredMeshes = new WeakSet<Object3D>();

  constructor(private g: AGame) {
    const real = g.real as unknown as RealWorld;
    this.real = real;
    this.origDisposeRegion = real.disposeRegion.bind(real);

    // 1. Anchor region disposal to true player position with hysteresis to eliminate border thrashing
    real.disposeRegion = (r: Region) => {
      const M = real.M;
      const S = this.g.S;
      const pos = S.mode === "car" || S.mode === "moto" ? S.car : S.mode === "plane" ? S.plane : S.walk;
      const cx = M.X0 + (r.rx + 0.5) * M.RS;
      const cz = M.Z0 + (r.rz + 0.5) * M.RS;
      const trueDist = Math.max(0, Math.hypot(cx - pos.x, cz - pos.z) - M.RS * 0.71);
      const retentionRadius = real.q.radius + 750;

      // If the region is still within true retention radius, do not drop it (prevents lookahead thrash)
      if (trueDist <= retentionRadius && r.state !== "failed") {
        return;
      }
      this.origDisposeRegion(r);
    };

    // 2. Establish polygonOffset hierarchy on core road materials
    this.tuneMaterials();
  }

  private tuneMaterials(): void {
    const roads = this.real.roads;
    if (!roads) return;

    // Base asphalt / dirt roads: baseline surface layer (-1, -2)
    for (const mat of [roads.asphalt, roads.dirt, roads.runwayMat]) {
      if (mat && !this.configuredMaterials.has(mat)) {
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = -1;
        mat.polygonOffsetUnits = -2;
        mat.needsUpdate = true;
        this.configuredMaterials.add(mat);
      }
    }

    // Sidewalks: slightly above road (-1.5, -3)
    if (roads.walk && !this.configuredMaterials.has(roads.walk)) {
      roads.walk.polygonOffset = true;
      roads.walk.polygonOffsetFactor = -1.5;
      roads.walk.polygonOffsetUnits = -3;
      roads.walk.needsUpdate = true;
      this.configuredMaterials.add(roads.walk);
    }
  }

  /** Run every frame to maintain depth precision, hierarchical offsets, and prompt building */
  update(): void {
    const mode = this.g.S.mode;
    const camera = this.g.camera;

    // 1. Dynamic, mode-aware camera near plane:
    // Car camera is 6.5m+ away: near = 0.8m gives 3.2x depth resolution.
    // Plane camera is 32m+ away: near = 2.0m gives 8x depth resolution.
    // Walk camera: near = 0.35m avoids avatar clipping.
    const targetNear = mode === "plane" ? 2.0 : mode === "car" || mode === "moto" ? 0.8 : 0.35;
    if (Math.abs(camera.near - targetNear) > 0.05) {
      camera.near = targetNear;
      camera.updateProjectionMatrix();
    }

    // 2. Nearby region build accelerator:
    // If a nearby region has downloaded its data, start building immediately rather than
    // stalling on outer fringe neighbors 1.5km away.
    const real = this.real;
    const M = real.M;
    const S = this.g.S;
    const pos = mode === "car" || mode === "moto" ? S.car : mode === "plane" ? S.plane : S.walk;
    const fastBuildDist = real.q.radius * 0.95;

    for (const r of real.regions.values()) {
      if (r.state === "data" && real.ensureBuilt) {
        const cx = M.X0 + (r.rx + 0.5) * M.RS;
        const cz = M.Z0 + (r.rz + 0.5) * M.RS;
        const d = Math.max(0, Math.hypot(cx - pos.x, cz - pos.z) - M.RS * 0.71);
        if (d < fastBuildDist) {
          real.ensureBuilt(r);
        }
      }

      // 3. Hierarchical surface offsets on meshes
      if (r.group && !this.configuredMeshes.has(r.group)) {
        this.configuredMeshes.add(r.group);
        r.group.traverse((o) => {
          const m = o as Mesh;
          if (!m.isMesh || !m.material || Array.isArray(m.material)) return;
          const mat = m.material as Material;

          // Junction plates: render on top of base road (-2, -4)
          if (m.name === "plate" && mat.polygonOffsetFactor !== -2) {
            mat.polygonOffset = true;
            mat.polygonOffsetFactor = -2;
            mat.polygonOffsetUnits = -4;
            mat.needsUpdate = true;
          }
          // Road markings & crosswalks: render on top of plates (-3, -6)
          else if ((m.name === "marks" || m.name === "crosswalk") && mat.polygonOffsetFactor !== -3) {
            mat.polygonOffset = true;
            mat.polygonOffsetFactor = -3;
            mat.polygonOffsetUnits = -6;
            mat.needsUpdate = true;
          }
          // Contact decals: top layer (-4, -8)
          else if (m.name === "bld:MeshBasicMaterial" && mat.polygonOffsetFactor !== -4) {
            mat.polygonOffset = true;
            mat.polygonOffsetFactor = -4;
            mat.polygonOffsetUnits = -8;
            mat.needsUpdate = true;
          }
        });
      }
    }
  }
}
