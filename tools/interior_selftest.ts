// Door-volume checks for Pastechi House. No browser, no WebGL.
import { isOpen, worldFrame } from "../addons/src/interiors/volume";
import { PASTECHI_OBS, PASTECHI_POLY, PASTECHI_X, PASTECHI_Z, pastechiLocal } from "../addons/src/interiors/pastechi";
import { MCD_DOOR_AT, MCD_DOOR_HALF, MCD_OBS, MCD_POLY, MCD_X, MCD_Z, mcdLocal } from "../addons/src/interiors/mcdonalds";
import { SBX_DOOR_AT, SBX_DOOR_HALF, SBX_OBS, SBX_POLY, SBX_X, SBX_Z, sbxLocal } from "../addons/src/interiors/starbucks";
import { PB_DOOR_HALF, PB_OBS, PB_POLY, PB_X, PB_Z, pbLocal } from "../addons/src/interiors/plaza";
import { HR_DOOR_HALF, HR_OBS, HR_POLY, HR_X, HR_Z, hrLocal } from "../addons/src/interiors/hardrock";
import { RD_DOOR_HALF, RD_OBS, RD_POLY, RD_X, RD_Z, rdLocal } from "../addons/src/interiors/radisson";
import { HT_DOOR_HALF, HT_OBS, HT_POLY, HT_X, HT_Z, htLocal } from "../addons/src/interiors/hilton";
import { HY_DOOR_HALF, HY_OBS, HY_POLY, HY_X, HY_Z, hyLocal } from "../addons/src/interiors/hyatt";
import { MR_DOOR_HALF, MR_OBS, MR_POLY, MR_X, MR_Z, mrLocal } from "../addons/src/interiors/marriott";
import { SF_DOOR_HALF, SF_OBS, SF_POLY, SF_X, SF_Z, sfLocal } from "../addons/src/interiors/senorfrogs";
import { MB_DOOR_HALF, MB_OBS, MB_POLY, MB_X, MB_Z, mbLocal } from "../addons/src/interiors/moomba";

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

const pb = worldFrame(pbLocal, PB_X, PB_Z, 0);
pb.poly = PB_POLY;
const pbWall = 0.4;
function pAt(a: number, d: number) {
  const x = pb.mx + pb.ux * a + pb.nx * d;
  const z = pb.mz + pb.uz * a + pb.nz * d;
  return isOpen(pb, PB_OBS, x, z, PB_DOOR_HALF, pbWall);
}
const pbCases: [string, number, number, boolean][] = [
  ["pb door", 0, 0.3, true],
  ["pb sidewalk", 0, -0.9, true],
  ["pb vestibule", 0, 4, true],
  ["pb aisle", 0, 16, true],
  ["pb shop", 4.4, 15.2, false],
  ["pb cinema", 0, 20, false],
  ["pb bench", 2.5, 14.2, false],
  ["pb outside", 0, -3, false],
  ["pb jamb", 3.8, 0.2, false],
];
for (const [name, a, d, want] of pbCases) {
  const got = pAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.5; d <= 18; d += 0.5) {
  if (!pAt(0, d)) {
    console.log("FAIL pb aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(pb, PB_OBS, -7941, -6044, PB_DOOR_HALF, pbWall)) console.log("ok pb neighbour stays shut");
else { console.log("FAIL pb neighbour opened"); bad++; }
if (!bad) console.log("pb aisle clear");

const hr = worldFrame(hrLocal, HR_X, HR_Z, 0);
hr.poly = HR_POLY;
function hAt(a: number, d: number) {
  const x = hr.mx + hr.ux * a + hr.nx * d;
  const z = hr.mz + hr.uz * a + hr.nz * d;
  return isOpen(hr, HR_OBS, x, z, HR_DOOR_HALF, mWall);
}
const hrCases: [string, number, number, boolean][] = [
  ["hr door", 0, 0.3, true],
  ["hr sidewalk", 0, -0.8, true],
  ["hr aisle", 0, 4.5, true],
  ["hr bar", 3.4, 2.9, false],
  ["hr stool", 3.35, 1.75, false],
  ["hr table", -4.2, 3.8, false],
  ["hr outside", 0, -3, false],
  ["hr jamb", 2.1, 0.15, false],
];
for (const [name, a, d, want] of hrCases) {
  const got = hAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.4; d <= 6.5; d += 0.25) {
  if (!hAt(0, d)) {
    console.log("FAIL hr aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(hr, HR_OBS, -7957.6, -5466.6, HR_DOOR_HALF, mWall)) console.log("ok hr neighbour stays shut");
else { console.log("FAIL hr neighbour opened"); bad++; }
if (!bad) console.log("hr aisle clear");

const rd = worldFrame(rdLocal, RD_X, RD_Z, 0);
rd.poly = RD_POLY;
function rAt(a: number, d: number) {
  const x = rd.mx + rd.ux * a + rd.nx * d;
  const z = rd.mz + rd.uz * a + rd.nz * d;
  return isOpen(rd, RD_OBS, x, z, RD_DOOR_HALF, mWall);
}
const rdCases: [string, number, number, boolean][] = [
  ["rd door", 0, 0.3, true],
  ["rd sidewalk", 0, -0.9, true],
  ["rd aisle", 0, 6, true],
  ["rd desk", 0, 9.2, false],
  ["rd clover", 6.8, 3.2, false],
  ["rd chair", -6.2, 4.8, false],
  ["rd table", -3.5, 5.85, false],
  ["rd outside", 0, -3, false],
  ["rd jamb", 3.8, 0.15, false],
  ["rd past lobby", 0, 20, false],
  ["rd side wall", 11, 4, false],
];
for (const [name, a, d, want] of rdCases) {
  const got = rAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.4; d <= 8; d += 0.25) {
  if (!rAt(0, d)) {
    console.log("FAIL rd aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(rd, RD_OBS, -7828.8, -6088.1, RD_DOOR_HALF, mWall)) console.log("ok rd neighbour stays shut");
else { console.log("FAIL rd neighbour opened"); bad++; }
if (!bad) console.log("rd aisle clear");

const ht = worldFrame(htLocal, HT_X, HT_Z, 0);
ht.poly = HT_POLY;
function htAt(a: number, d: number) {
  const x = ht.mx + ht.ux * a + ht.nx * d;
  const z = ht.mz + ht.uz * a + ht.nz * d;
  return isOpen(ht, HT_OBS, x, z, HT_DOOR_HALF, mWall);
}
const htCases: [string, number, number, boolean][] = [
  ["ht door", 0, 0.3, true],
  ["ht sidewalk", 0, -0.9, true],
  ["ht aisle", 0, 5, true],
  ["ht desk", 0, 8, false],
  ["ht chair", -4.2, 4.2, false],
  ["ht outside", 0, -3, false],
  ["ht jamb", 3.4, 0.15, false],
  ["ht past lobby", 0, 14, false],
  ["ht side", 6.2, 4, false],
];
for (const [name, a, d, want] of htCases) {
  const got = htAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.4; d <= 6.8; d += 0.25) {
  if (!htAt(0, d)) {
    console.log("FAIL ht aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(ht, HT_OBS, -8241.7, -5300.3, HT_DOOR_HALF, mWall)) console.log("ok ht drive stays shut");
else { console.log("FAIL ht drive opened"); bad++; }
if (!bad) console.log("ht aisle clear");
console.log("ht door", ht.mx.toFixed(2), ht.mz.toFixed(2), "n", ht.nx.toFixed(3), ht.nz.toFixed(3));

const hy = worldFrame(hyLocal, HY_X, HY_Z, 0);
hy.poly = HY_POLY;
function yAt(a: number, d: number) {
  const x = hy.mx + hy.ux * a + hy.nx * d;
  const z = hy.mz + hy.uz * a + hy.nz * d;
  return isOpen(hy, HY_OBS, x, z, HY_DOOR_HALF, mWall);
}
const hyCases: [string, number, number, boolean][] = [
  ["hy door", 0, 0.3, true],
  ["hy sidewalk", 0, -0.9, true],
  ["hy aisle", 0, 5, true],
  ["hy desk", 0, 8, false],
  ["hy chair", -5.5, 4.35, false],
  ["hy outside", 0, -3, false],
  ["hy jamb", 3.2, 0.15, false],
  ["hy past lobby", 0, 16, false],
  ["hy side", 9.5, 4, false],
];
for (const [name, a, d, want] of hyCases) {
  const got = yAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.4; d <= 6.8; d += 0.25) {
  if (!yAt(0, d)) {
    console.log("FAIL hy aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(hy, HY_OBS, -8117, -5730, HY_DOOR_HALF, mWall)) console.log("ok hy neighbour stays shut");
else { console.log("FAIL hy neighbour opened"); bad++; }
if (!bad) console.log("hy aisle clear");

const mr = worldFrame(mrLocal, MR_X, MR_Z, 0);
mr.poly = MR_POLY;
function mrAt(a: number, d: number) {
  const x = mr.mx + mr.ux * a + mr.nx * d;
  const z = mr.mz + mr.uz * a + mr.nz * d;
  return isOpen(mr, MR_OBS, x, z, MR_DOOR_HALF, mWall);
}
const mrCases: [string, number, number, boolean][] = [
  ["mr door", 0, 0.3, true],
  ["mr sidewalk", 0, -0.9, true],
  ["mr aisle", 0, 5, true],
  ["mr desk", 0, 8, false],
  ["mr chair", -4.4, 4.3, false],
  ["mr outside", 0, -3, false],
  ["mr jamb", 3.5, 0.15, false],
  ["mr past lobby", 0, 14, false],
  ["mr side", 6.6, 4, false],
];
for (const [name, a, d, want] of mrCases) {
  const got = mrAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.4; d <= 6.8; d += 0.25) {
  if (!mrAt(0, d)) {
    console.log("FAIL mr aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(mr, MR_OBS, -8051.9, -6782, MR_DOOR_HALF, mWall)) console.log("ok mr drive stays shut");
else { console.log("FAIL mr drive opened"); bad++; }
if (!bad) console.log("mr aisle clear");
console.log("mr door", mr.mx.toFixed(2), mr.mz.toFixed(2), "n", mr.nx.toFixed(3), mr.nz.toFixed(3));

const sf = worldFrame(sfLocal, SF_X, SF_Z, 0);
sf.poly = SF_POLY;
function sfAt(a: number, d: number) {
  const x = sf.mx + sf.ux * a + sf.nx * d;
  const z = sf.mz + sf.uz * a + sf.nz * d;
  return isOpen(sf, SF_OBS, x, z, SF_DOOR_HALF, mWall);
}
const sfCases: [string, number, number, boolean][] = [
  ["sf door", 0, 0.3, true],
  ["sf sidewalk", 0, -0.9, true],
  ["sf aisle", 0, 3.5, true],
  ["sf bar", 0, 6.4, false],
  ["sf chair", -3.6, 3.4, false],
  ["sf outside", 0, -3, false],
  ["sf jamb", 2.6, 0.15, false],
  ["sf past", 0, 12, false],
  ["sf side", 6.2, 3, false],
];
for (const [name, a, d, want] of sfCases) {
  const got = sfAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.4; d <= 5.2; d += 0.25) {
  if (!sfAt(0, d)) {
    console.log("FAIL sf aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(sf, SF_OBS, -8199.7, -5312.2, SF_DOOR_HALF, mWall)) console.log("ok sf road stays shut");
else { console.log("FAIL sf road opened"); bad++; }
if (!bad) console.log("sf aisle clear");
console.log("sf door", sf.mx.toFixed(2), sf.mz.toFixed(2), "n", sf.nx.toFixed(3), sf.nz.toFixed(3));

const mb = worldFrame(mbLocal, MB_X, MB_Z, 0);
mb.poly = MB_POLY;
function mbAt(a: number, d: number) {
  const x = mb.mx + mb.ux * a + mb.nx * d;
  const z = mb.mz + mb.uz * a + mb.nz * d;
  return isOpen(mb, MB_OBS, x, z, MB_DOOR_HALF, mWall);
}
const mbCases: [string, number, number, boolean][] = [
  ["mb door", 8, 0.3, true],
  ["mb sidewalk", 8, -0.9, true],
  ["mb aisle", 8, 3.2, true],
  ["mb bar", 8, 5.8, false],
  ["mb chair", 6.6, 3.0, false],
  ["mb stool", 6.21, 4.95, false],
  ["mb table", 7.45, 3.2, false],
  ["mb outside", 8, -3, false],
  ["mb jamb", 9.7, 0.15, false],
  ["mb past", 8, 10, false],
  ["mb side", 10.2, 3, false],
];
for (const [name, a, d, want] of mbCases) {
  const got = mbAt(a, d);
  if (got !== want) {
    console.log("FAIL", name, "along", a, "in", d, "got", got);
    bad++;
  } else console.log("ok", name);
}
for (let d = -0.4; d <= 4.8; d += 0.25) {
  if (!mbAt(8, d)) {
    console.log("FAIL mb aisle blocked", d);
    bad++;
    break;
  }
}
if (!isOpen(mb, MB_OBS, -8104.0, -6377.4, MB_DOOR_HALF, mWall)) console.log("ok mb road stays shut");
else { console.log("FAIL mb road opened"); bad++; }
if (!bad) console.log("mb aisle clear");
console.log("mb door", mb.mx.toFixed(2), mb.mz.toFixed(2), "n", mb.nx.toFixed(3), mb.nz.toFixed(3));
process.exit(bad ? 1 : 0);
