// Door-volume checks for Pastechi House. No browser, no WebGL.
import { isOpen, worldFrame } from "../addons/src/interiors/volume";
import { PASTECHI_OBS, PASTECHI_POLY, PASTECHI_X, PASTECHI_Z, pastechiLocal } from "../addons/src/interiors/pastechi";
import { MCD_DOOR_AT, MCD_DOOR_HALF, MCD_OBS, MCD_POLY, MCD_X, MCD_Z, mcdLocal } from "../addons/src/interiors/mcdonalds";
import { SBX_DOOR_AT, SBX_DOOR_HALF, SBX_OBS, SBX_POLY, SBX_X, SBX_Z, sbxLocal } from "../addons/src/interiors/starbucks";

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

const mcd = worldFrame(mcdLocal, MCD_X, MCD_Z, 0);
mcd.poly = MCD_POLY;
const mWall = 0.34;
function mAt(a: number, d: number) {
  const x = mcd.mx + mcd.ux * a + mcd.nx * d;
  const z = mcd.mz + mcd.uz * a + mcd.nz * d;
  return isOpen(mcd, MCD_OBS, x, z, MCD_DOOR_HALF, mWall);
}
const mcdCases: [string, number, number, boolean][] = [
  ["mcd door", MCD_DOOR_AT, 0.2, true],
  ["mcd sidewalk", MCD_DOOR_AT, -0.9, true],
  ["mcd aisle", MCD_DOOR_AT, 8, true],
  ["mcd camera", MCD_DOOR_AT, 12.2, true],
  ["mcd side aisle", -6.2, 6, true],
  ["mcd counter", 0.4, 3.6, false],
  ["mcd kiosk", -4.1, 2.2, false],
  ["mcd table", -7.3, 5.6, false],
  ["mcd kitchen", 0, 14, false],
  ["mcd west wall", 8.6, 4, false],
  ["mcd east wall", -8.7, 4, false],
  ["mcd outside", MCD_DOOR_AT, -3, false],
  ["mcd jamb", -7.9, 0.05, false],
];
for (const [name, a, d, want] of mcdCases) {
  const got = mAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (const line of [MCD_DOOR_AT, -6.2]) {
  for (let d = -0.5; d <= 12.4; d += 0.25) {
    if (!mAt(line, d)) {
      console.log("FAIL mcd aisle blocked", line, "inward", d);
      bad++;
      break;
    }
  }
}
if (!isOpen(mcd, MCD_OBS, -8005.9, -5486.8, MCD_DOOR_HALF, mWall)) console.log("ok mcd neighbour stays shut");
else { console.log("FAIL neighbour opened"); bad++; }
if (!bad) console.log("mcd aisle clear", MCD_DOOR_AT);

const sbx = worldFrame(sbxLocal, SBX_X, SBX_Z, 0);
sbx.poly = SBX_POLY;
function sAt(a: number, d: number) {
  const x = sbx.mx + sbx.ux * a + sbx.nx * d;
  const z = sbx.mz + sbx.uz * a + sbx.nz * d;
  return isOpen(sbx, SBX_OBS, x, z, SBX_DOOR_HALF, mWall);
}
const sbxCases: [string, number, number, boolean][] = [
  ["sbx door", SBX_DOOR_AT, 0.2, true],
  ["sbx sidewalk", SBX_DOOR_AT, -0.9, true],
  ["sbx aisle", SBX_DOOR_AT, 8, true],
  ["sbx bar", 6, 3.1, false],
  ["sbx case", 3.8, 1.9, false],
  ["sbx table", -7.5, 5.3, false],
  ["sbx back", 0, 13.1, false],
  ["sbx outside", SBX_DOOR_AT, -3, false],
  ["sbx jamb", 2.5, 0.05, false],
];
for (const [name, a, d, want] of sbxCases) {
  const got = sAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.5; d <= 12; d += 0.25) {
  if (!sAt(SBX_DOOR_AT, d)) {
    console.log("FAIL sbx aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(sbx, SBX_OBS, -8069.9, -5971.2, SBX_DOOR_HALF, mWall)) console.log("ok sbx neighbour stays shut");
else { console.log("FAIL sbx neighbour opened"); bad++; }
if (!bad) console.log("sbx aisle clear", SBX_DOOR_AT);
process.exit(bad ? 1 : 0);
