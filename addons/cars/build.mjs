// Builds game/models/cars.glb (traffic + parked-car kit, 5 variants x 2 LODs) and
// game/models/ev.glb (police / ForenSys / ambulance for evModels.ts, see ev.mjs).
// Run: npm run cars   (from addons/; CAR_STATS=1 prints per-stage triangle counts)
//
// Kit contract (A's loader, regex /^([a-z]+)(\d+)_L(\d)_([a-z]+)/): one mesh per
// car{variant}_L{lod}_{material}, no node transforms, nose +Z, origin at ground centre.
// Materials are A's street kit set (paint, chrome, glass, plate, dark, light, tail); L0 uses all 7,
// L1 drops chrome, so instanced draw calls per lot are unchanged. Traffic (3/6/9 cars) uses L0;
// parked lots use L0 within parkHi and L1 out to parkR.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LOD, buildCar, toGeom, prim } from "./car.mjs";
import { KIT } from "./specs.mjs";
import { buildEvGLB } from "./ev.mjs";
import { writeGLB } from "./glb.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, "../../game/models");

function buildKit() {
  const nodes = [], stats = [];
  const ORDER = ["paint", "chrome", "glass", "dark", "light", "tail", "plate"];
  for (const lod of [0, 1]) KIT.forEach((sp, v) => {
    const { P } = buildCar(sp, LOD[lod]);
    let tris = 0;
    for (const k of ORDER) {
      const part = P.m[k];
      if (!part || !part.i.length) continue;
      if (lod === 1 && k === "chrome") throw new Error("L1 must not use chrome");
      const g = toGeom(part);
      nodes.push({ name: `car${v}_L${lod}_${k}`, prims: [prim(g)] });
      tris += part.tris;
    }
    stats.push(`car${v} L${lod} (${sp.name}): ${tris} tris, ${Object.keys(P.m).length} materials`);
  });
  const glb = writeGLB({ nodes, root: nodes.map((_, i) => i) });
  fs.writeFileSync(path.join(OUT, "cars.glb"), glb);
  return { size: glb.length, stats };
}

function buildEv() {
  const { nodes, stats } = buildEvGLB(LOD);
  const glb = writeGLB({ nodes, root: nodes.map((_, i) => i) });
  fs.writeFileSync(path.join(OUT, "ev.glb"), glb);
  return { size: glb.length, stats };
}

const kit = buildKit();
console.log(`cars.glb ${(kit.size / 1024).toFixed(0)} KB\n  ` + kit.stats.join("\n  "));
const ev = buildEv();
console.log(`ev.glb ${(ev.size / 1024).toFixed(0)} KB\n  ` + ev.stats.join("\n  "));
