// Renaissance Mall, Havenstraat center bay. Explicit cameras.
// usage: node tools/rn_cam.mjs before|after
import { chromium } from "@playwright/test";
import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

function log(s) {
  appendFileSync("/tmp/rn-cam-progress.txt", s + "\n");
  console.log(s);
}

const label = process.argv[2] || "before";
const outDir = "/tmp/rn-shots";
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => log("PAGEERROR " + e.message));
log("goto " + label);
await page.goto("http://127.0.0.1:8777/?q=med&t=11&freeze=1&addons=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });
log("ready");

const door = { x: -7384.3, z: 22.35 };
const O = { x: 0.6135, z: -0.7897 };
const I = { x: -0.6135, z: 0.7897 };
const U = { x: 0.7897, z: 0.6135 };

await page.evaluate(({ x, z }) => {
  window.game.S.snapCam = 240;
  window.game.teleport("walk", x, z, Math.atan2(-0.6135, 0.7897));
}, { x: door.x + O.x * 10, z: door.z + O.z * 10 });

let ready = false;
for (let i = 0; i < 45; i++) {
  const st = await page.evaluate(() => {
    const hero = window.game.real.hero.list.find((n) => n.k === "renmall");
    const hi = !!(hero && hero._hi && hero._hi.visible);
    const lo = !!(hero && hero._lo && hero._lo.visible);
    let sign = 0;
    if (hero && hero._g) hero._g.traverse((o) => {
      const mats = o.material ? [].concat(o.material) : [];
      for (const m of mats) {
        const img = (m.map && m.map.image) || (m.emissiveMap && m.emissiveMap.image);
        if (m.name === "sign" && img) sign = img.width || sign;
      }
    });
    const M = window.game.real.M;
    const w = window.game.S.walk;
    const rx = Math.floor((w.x - M.X0) / M.RS);
    const rz = Math.floor((w.z - M.Z0) / M.RS);
    let region = "";
    for (const r of window.game.real.regions.values()) if (r.rx === rx && r.rz === rz) region = r.state;
    return { hi, lo, sign, region, rx, rz, has: !!hero };
  });
  log("wait " + i + " " + JSON.stringify(st));
  if (st.hi && st.sign > 8 && st.region === "built") { ready = true; break; }
  await page.waitForTimeout(4000);
}
if (!ready) {
  log("HERO NOT READY");
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(1500);

const heights = await page.evaluate((door) => {
  const h = (x, z) => +window.game.real.heightAt(x, z).toFixed(3);
  return {
    door: h(door.x, door.z),
    out8: h(door.x + 0.6135 * 8, door.z + -0.7897 * 8),
    in4: h(door.x + -0.6135 * 4, door.z + 0.7897 * 4),
    cent: h(-7394.59, 73.48),
  };
}, door);
log("heights " + JSON.stringify(heights));

async function shot(name, place) {
  const url = await page.evaluate((place) => {
    const g = window.game;
    if (place.px != null) {
      g.S.paused = false;
      g.teleport("walk", place.px, place.pz, place.pyaw || 0);
      g.S.snapCam = 2;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const y = g.real.heightAt(place.cx, place.cz) || 0;
        const ly = g.real.heightAt(place.lx, place.lz) || y;
        g.camera.position.set(place.cx, y + place.cy, place.cz);
        g.camera.lookAt(place.lx, ly + place.ly, place.lz);
        g.S.paused = true;
        g.renderer.render(g.scene, g.camera);
        const w = g.S.walk;
        resolve(JSON.stringify({
          png: g.renderer.domElement.toDataURL("image/png"),
          walk: { x: +w.x.toFixed(2), z: +w.z.toFixed(2), y: +w.y.toFixed(2) },
          version: window.__aw && window.__aw.version,
        }));
      }, place.px != null ? 900 : 80);
    });
  }, place);
  const info = JSON.parse(url);
  const png = Buffer.from(info.png.slice(info.png.indexOf(",") + 1), "base64");
  await writeFile(`${outDir}/${label}-${name}.png`, png);
  log("saved " + name + " " + png.byteLength + " " + JSON.stringify(info.walk) + " " + info.version);
}

await shot("street", {
  px: door.x + O.x * 9, pz: door.z + O.z * 9, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 20, cz: door.z + O.z * 20, cy: 2.6,
  lx: door.x + I.x * 2, lz: door.z + I.z * 2, ly: 5.4,
});
await shot("inside", {
  px: door.x + I.x * 3.4, pz: door.z + I.z * 3.4, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 7, cz: door.z + O.z * 7, cy: 1.5,
  lx: door.x + I.x * 7, lz: door.z + I.z * 7, ly: 1.45,
});
await shot("hall", {
  cx: door.x + I.x * 3.2 + U.x * -2.2, cz: door.z + I.z * 3.2 + U.z * -2.2, cy: 1.4,
  lx: door.x + I.x * 11.5, lz: door.z + I.z * 11.5, ly: 1.45,
});
if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "renmall");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const samples = [
      ["aisle", 0, 4],
      ["pier", -3.8, 10.6],
      ["hot", 3.8, 10.6],
      ["aloe", 0, 12.2],
      ["out", 0, -4],
      ["jamb", 2.9, 0.15],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "renmall");
    const walk = window.game.S.walk;
    const ix = w.mx + w.nx * 3.4;
    const iz = w.mz + w.nz * 3.4;
    return {
      version: window.__aw.version,
      interior: st,
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      walk: { x: +walk.x.toFixed(2), z: +walk.z.toFixed(2) },
      samples,
    };
  });
  log("probe " + JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const pier = probe.samples && probe.samples.find((s) => s.name === "pier");
  const aloe = probe.samples && probe.samples.find((s) => s.name === "aloe");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const jamb = probe.samples && probe.samples.find((s) => s.name === "jamb");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.5 && aisle && aisle.open && !aisle.blocked
    && pier && !pier.open && pier.blocked
    && aloe && !aloe.open && aloe.blocked
    && out && !out.open && jamb && !jamb.open;
  if (!ok) {
    log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
