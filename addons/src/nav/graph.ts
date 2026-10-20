import { MinHeap } from "./heap";

export type RoadPolyline = {
  name: string;
  points: Array<[number, number]>; // [x, z]
};

export type GraphNode = {
  id: number;
  x: number;
  z: number;
  name: string;
  edges: { to: number; dist: number }[];
};

export class RoadGraph {
  nodes: GraphNode[] = [];
  private spatial: Map<string, number> = new Map();
  private readonly buckets: Map<string, number[]> = new Map();
  private readonly cell = 40;

  constructor(roads: RoadPolyline[]) {
    const key = (x: number, z: number) => `${Math.round(x / 2)}:${Math.round(z / 2)}`;
    const getOrCreate = (x: number, z: number, name: string): number => {
      const k = key(x, z);
      let id = this.spatial.get(k);
      if (id === undefined) {
        id = this.nodes.length;
        this.nodes.push({ id, x, z, name, edges: [] });
        this.spatial.set(k, id);
      }
      return id;
    };

    for (const road of roads) {
      if (road.points.length < 2) continue;
      let prev = getOrCreate(road.points[0][0], road.points[0][1], road.name);
      for (let i = 1; i < road.points.length; i++) {
        const cur = getOrCreate(road.points[i][0], road.points[i][1], road.name);
        const a = this.nodes[prev];
        const b = this.nodes[cur];
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const d = Math.hypot(dx, dz);
        if (d > 0.5) {
          a.edges.push({ to: cur, dist: d });
          b.edges.push({ to: prev, dist: d });
        }
        prev = cur;
      }
    }
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const k = `${Math.floor(n.x / this.cell)}:${Math.floor(n.z / this.cell)}`;
      let bucket = this.buckets.get(k);
      if (!bucket) this.buckets.set(k, bucket = []);
      bucket.push(i);
    }
  }

  nearest(x: number, z: number): number {
    if (!this.nodes.length) return 0;
    const cx = Math.floor(x / this.cell);
    const cz = Math.floor(z / this.cell);
    let best = 0;
    let bestD = Infinity;
    const consider = (ids: number[] | undefined) => {
      if (!ids) return;
      for (let i = 0; i < ids.length; i++) {
        const n = this.nodes[ids[i]];
        const d = (n.x - x) * (n.x - x) + (n.z - z) * (n.z - z);
        if (d < bestD) { bestD = d; best = n.id; }
      }
    };
    for (let ring = 0; ring <= 12; ring++) {
      for (let ix = cx - ring; ix <= cx + ring; ix++) {
        for (let iz = cz - ring; iz <= cz + ring; iz++) {
          if (ring > 0 && Math.abs(ix - cx) !== ring && Math.abs(iz - cz) !== ring) continue;
          consider(this.buckets.get(`${ix}:${iz}`));
        }
      }
      const minX = (cx - ring) * this.cell, maxX = (cx + ring + 1) * this.cell;
      const minZ = (cz - ring) * this.cell, maxZ = (cz + ring + 1) * this.cell;
      const margin = Math.min(x - minX, maxX - x, z - minZ, maxZ - z);
      if (bestD <= margin * margin) break;
    }
    if (bestD < Infinity) return best;
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const d = (n.x - x) * (n.x - x) + (n.z - z) * (n.z - z);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  /** A* — reuses the heap. Returns node id path or empty. */
  findPath(startId: number, goalId: number, heap: MinHeap<number>, cameFrom: Int32Array, gScore: Float64Array): number[] {
    const n = this.nodes.length;
    heap.clear();
    cameFrom.fill(-1);
    gScore.fill(Infinity);
    gScore[startId] = 0;
    heap.push(startId, 0);

    const goal = this.nodes[goalId];
    while (heap.length > 0) {
      const cur = heap.pop()!;
      if (cur === goalId) break;
      const node = this.nodes[cur];
      for (let e = 0; e < node.edges.length; e++) {
        const edge = node.edges[e];
        const tent = gScore[cur] + edge.dist;
        if (tent < gScore[edge.to]) {
          cameFrom[edge.to] = cur;
          gScore[edge.to] = tent;
          const h = Math.hypot(this.nodes[edge.to].x - goal.x, this.nodes[edge.to].z - goal.z);
          heap.push(edge.to, tent + h);
        }
      }
    }

    const path: number[] = [];
    let c = goalId;
    if (cameFrom[c] === -1 && c !== startId) return path;
    while (c !== -1) {
      path.push(c);
      c = cameFrom[c];
    }
    path.reverse();
    return path;
  }
}
