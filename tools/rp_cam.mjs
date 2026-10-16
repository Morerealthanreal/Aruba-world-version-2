// Royal Plaza Mall, Havenstraat front. Explicit cameras.
// usage: node tools/rp_cam.mjs before|after
import { chromium } from "@playwright/test";
import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

function log(s) {
  appendFileSync("/tmp/rp-cam-progress.txt", s + "\n");
  console.log(s);
}

const label = process.argv[2] || "before";
const outDir = "/tmp/rp-shots";
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

const door = { x: -7545.39, z: -63.2 };
const O = { x: 0.3639, z: -0.9314 };
const I = { x: -0.3639, z: 0.9314 };
const U = { x: 0.9314, z: 0.3639 };

await page.evaluate(({ x, z }) => {
  window.game.S.snapCam = 240;
  window.game.teleport("walk", x, z, Math.atan2(-0.3639, 0.9314));
}, { x: door.x + O.x * 12, z: door.z + O.z * 12 });

let ready = false;
for (let i = 0; i < 45; i++) {
  const st = await page.evaluate(() => {
    const hero = window.game.real.hero.list.find((n) => n.k === "royalplaza");
    const hi = !!(hero && hero._hi && hero._hi.visible);
    const lo = !!(hero && hero._lo && hero._lo.visible);
    let sign = 0;
    if (hero && hero._g) hero._g.traverse((o) => {
      const mats = o.material ? [].concat(o.material) : [];
      for (const m of mats) {
        const img = (m.map && m.map.image) || (m.emissiveMap && m.emissiveMap.image);
        if ((m.name === "signglow" || m.name === "white" || m.name === "facade") && img) sign = Math.max(sign, img.width || 0);
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
    out8: h(door.x + 0.3639 * 8, door.z + -0.9314 * 8),
    in4: h(door.x + -0.3639 * 4, door.z + 0.9314 * 4),
    cent: h(-7560.24, -42.34),
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
  px: door.x + O.x * 12, pz: door.z + O.z * 12, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 28, cz: door.z + O.z * 28, cy: 3.2,
  lx: door.x + I.x * 2, lz: door.z + I.z * 2, ly: 8,
});
await shot("inside", {
  px: door.x + I.x * 3.2, pz: door.z + I.z * 3.2, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 6, cz: door.z + O.z * 6, cy: 1.45,
  lx: door.x + I.x * 6, lz: door.z + I.z * 6, ly: 1.35,
});
await shot("hall", {
  cx: door.x + I.x * 3.0 + U.x * -2.1, cz: door.z + I.z * 3.0 + U.z * -2.1, cy: 1.4,
  lx: door.x + I.x * 10, lz: door.z + I.z * 10, ly: 1.4,
});
if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "royalplaza");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 3.5],
      ["west", doorAt - 3.2, 9.2],
      ["east", doorAt + 3.2, 9.2],
      ["back", doorAt, 11.2],
      ["out", doorAt, -4],
      ["jamb", doorAt + 1.7, 0.12],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "royalplaza");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 3.2;
    const iz = w.mz + w.uz * doorAt + w.nz * 3.2;
    return {
      version: window.__aw.version,
      interior: st,
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      walk: { x: +walk.x.toFixed(2), z: +walk.z.toFixed(2) },
      door: { x: +(w.mx + w.ux * doorAt).toFixed(2), z: +(w.mz + w.uz * doorAt).toFixed(2) },
      samples,
    };
  });
  log("probe " + JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const west = probe.samples && probe.samples.find((s) => s.name === "west");
  const back = probe.samples && probe.samples.find((s) => s.name === "back");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const jamb = probe.samples && probe.samples.find((s) => s.name === "jamb");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.5 && aisle && aisle.open && !aisle.blocked
    && west && !west.open && west.blocked
    && back && !back.open && back.blocked
    && out && !out.open && jamb && !jamb.open;
  if (!ok) {
    log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
