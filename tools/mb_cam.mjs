// Moomba Beach, the long face under the teal sign. Explicit cameras.
// usage: node tools/mb_cam.mjs before|after
import { chromium } from "@playwright/test";
import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

function log(s) {
  appendFileSync("/tmp/mb-cam-progress.txt", s + "\n");
  console.log(s);
}

const label = process.argv[2] || "before";
const outDir = "/tmp/mb-shots";
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

const door = { x: -8112.88, z: -6328.23 };
const O = { x: 0.9722, z: 0.2343 };
const I = { x: -0.9722, z: -0.2343 };
const U = { x: -0.2343, z: 0.9722 };

await page.evaluate(({ x, z }) => {
  window.game.S.snapCam = 240;
  window.game.teleport("walk", x, z, Math.atan2(-0.9722, -0.2343));
}, { x: door.x + O.x * 8, z: door.z + O.z * 8 });

let ready = false;
for (let i = 0; i < 45; i++) {
  const st = await page.evaluate(() => {
    const hero = window.game.real.hero.list.find((n) => n.k === "moomba");
    const hi = !!(hero && hero._hi && hero._hi.visible);
    const lo = !!(hero && hero._lo && hero._lo.visible);
    let sign = 0;
    if (hero && hero._g) hero._g.traverse((o) => {
      const mats = o.material ? [].concat(o.material) : [];
      for (const m of mats) {
        const img = m.map && m.map.image;
        if (m.name === "sign" && img) sign = img.width || 0;
      }
    });
    const M = window.game.real.M;
    const w = window.game.S.walk;
    const rx = Math.floor((w.x - M.X0) / M.RS);
    const rz = Math.floor((w.z - M.Z0) / M.RS);
    let region = "";
    for (const r of window.game.real.regions.values()) if (r.rx === rx && r.rz === rz) region = r.state;
    return { hi, lo, sign, region, rx, rz };
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
    out6: h(door.x + 0.9722 * 6, door.z + 0.2343 * 6),
    in4: h(door.x + -0.9722 * 4, door.z + -0.2343 * 4),
    cent: h(-8122.03, -6342.63),
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
  px: door.x + O.x * 7 + U.x * 1.5, pz: door.z + O.z * 7 + U.z * 1.5, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 13 + U.x * 2, cz: door.z + O.z * 13 + U.z * 2, cy: 1.8,
  lx: door.x + U.x * -3, lz: door.z + U.z * -3, ly: 1.8,
});
await shot("inside", {
  px: door.x + I.x * 2.6, pz: door.z + I.z * 2.6, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 5.5, cz: door.z + O.z * 5.5, cy: 1.2,
  lx: door.x + I.x * 1.4, lz: door.z + I.z * 1.4, ly: 1.05,
});
await shot("bar", {
  cx: door.x + I.x * 2.8 + U.x * -1.6, cz: door.z + I.z * 2.8 + U.z * -1.6, cy: 1.35,
  lx: door.x + I.x * 6.7, lz: door.z + I.z * 6.7, ly: 1.65,
});

if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "moomba");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 3.2],
      ["bar", 8, 5.8],
      ["chair", 6.6, 3.0],
      ["out", doorAt, -3],
      ["jamb", doorAt + 1.7, 0.15],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "moomba");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 2.8;
    const iz = w.mz + w.uz * doorAt + w.nz * 2.8;
    return {
      version: window.__aw.version,
      interior: st,
      door: { x: +w.mx.toFixed(2), z: +w.mz.toFixed(2), nx: +w.nx.toFixed(4), nz: +w.nz.toFixed(4) },
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      walk: { x: +walk.x.toFixed(2), z: +walk.z.toFixed(2) },
      target: { x: +ix.toFixed(2), z: +iz.toFixed(2) },
      samples,
    };
  });
  log("probe " + JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const bar = probe.samples && probe.samples.find((s) => s.name === "bar");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.25 && aisle && aisle.open && !aisle.blocked
    && bar && !bar.open && bar.blocked && out && !out.open;
  if (!ok) {
    log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
