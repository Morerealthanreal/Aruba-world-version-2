// Door-volume checks for Pastechi House. No browser, no WebGL.
import { isOpen, worldFrame } from "../addons/src/interiors/volume";
import { PASTECHI_OBS, PASTECHI_POLY, PASTECHI_X, PASTECHI_Z, pastechiLocal } from "../addons/src/interiors/pastechi";

const world = worldFrame(pastechiLocal, PASTECHI_X, PASTECHI_Z, 0);
world.poly = PASTECHI_POLY;
const doorHalf = 2.35;
const wall = 0.34;
const doorAt = world.doorAt ?? 0;

function at(a: number, d: number) {
  const x = world.mx + world.ux * a + world.nx * d;
  const z = world.mz + world.uz * a + world.nz * d;
  return isOpen(world, PASTECHI_OBS, x, z, doorHalf, wall);
}

const cases: [string, number, number, boolean][] = [
  ["door", doorAt, 0.2, true],
  ["sidewalk", doorAt, -0.9, true],
  ["aisle", doorAt, 8.2, true],
  ["camera", doorAt, 13.4, true],
  ["counter", -2.2, 3.4, false],
  ["display", -1.4, 2.5, false],
  ["front table", 2.35, 1.65, false],
  ["side wall", 4.0, 3, false],
  ["pier", -3.6, 0.05, false],
  ["kitchen", -2, 15, false],
  ["too far out", doorAt, -3, false],
  ["east of building", 6.2, 4, false],
];

let bad = 0;
for (const [name, a, d, want] of cases) {
  const got = at(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -1; d <= 12.2; d += 0.25) {
  if (!at(doorAt, d)) {
    console.log("FAIL aisle blocked at inward", d);
    bad++;
    break;
  }
}
if (!bad) console.log("aisle clear", doorAt);
process.exit(bad ? 1 : 0);
