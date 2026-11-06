// Numeric self-test for road routing. No browser.
// Run: node --experimental-strip-types nav/selftest.ts
import { RoadGraph } from "../src/nav/graph.ts";
import { MinHeap } from "../src/nav/heap.ts";
import { minimapToWorld, turnArrow } from "../src/nav/navigator.ts";

let failed = 0;
function check(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
  if (!ok) failed++;
}

const roads = [
  { name: "L.G. Smith", points: [[0, 0], [100, 0], [100, 80]] as [number, number][] },
  { name: "Havenstraat", points: [[100, 0], [200, 0]] as [number, number][] },
];
const graph = new RoadGraph(roads);
const heap = new MinHeap<number>(graph.nodes.length);
const came = new Int32Array(graph.nodes.length);
const gScore = new Float64Array(graph.nodes.length);

{
  const start = graph.nearest(2, 1);
  const goal = graph.nearest(101, 78);
  const path = graph.findPath(start, goal, heap, came, gScore);
  const pts = path.map((id) => graph.nodes[id]);
  let length = 0;
  for (let i = 1; i < pts.length; i++) length += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
  const viaCorner = pts.some((p) => Math.hypot(p.x - 100, p.z) < 1);
  check("A* follows the roads through the corner", path.length >= 3 && viaCorner, `${path.length} nodes, corner ${viaCorner}`);
  check("route length is the road distance", Math.abs(length - 180) < 1, `${length.toFixed(1)} m`);
  check("route names the street it turns onto", pts[pts.length - 1].name === "L.G. Smith", pts[pts.length - 1].name);
}

{
  const near = graph.nearest(198, 2);
  const node = graph.nodes[near];
  check("nearest stays on the local cell", Math.hypot(node.x - 200, node.z) < 5, `(${node.x}, ${node.z})`);
}

{
  check("facing north, a road ahead is straight", turnArrow(0, 0, -10) === "↑", turnArrow(0, 0, -10));
  check("facing north, a road to the east is right", turnArrow(0, 10, 0) === "→", turnArrow(0, 10, 0));
  check("facing north, a road to the west is left", turnArrow(0, -10, 0) === "←", turnArrow(0, -10, 0));
}

{
  const ahead = minimapToWorld(0, 0, 0, 0, -120, 2);
  const right = minimapToWorld(0, 0, 0, 80, 0, 2);
  check("a tap above the player is north", Math.abs(ahead.x) < 1e-6 && Math.abs(ahead.z + 60) < 1e-6, `${ahead.x}, ${ahead.z}`);
  check("a tap to the right is east", Math.abs(right.x - 40) < 1e-6 && Math.abs(right.z) < 1e-6, `${right.x}, ${right.z}`);
}

if (failed) {
  console.log(`\n${failed} FAILED`);
  process.exit(1);
}
console.log("\nALL PASS");
