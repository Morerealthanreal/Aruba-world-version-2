// Explicit cameras for Starbucks. The chase camera sits inside the hotel to the south.
// usage: node tools/sbux_cam.mjs before|after
import { chromium } from "@playwright/test";
import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "before";
const outDir = process.argv[3] || "/tmp/sbux-shots";
const prog = "/tmp/sbux-shot-progress.txt";
const log = (s) => { appendFileSync(prog, s + "\n"); console.log(s); };
await mkdir(outDir, { recursive: true });
appendFileSync(prog, `\n--- ${label} ${new Date().toISOString()} ---\n`);

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => log("PAGEERROR " + e.message));
page.on("console", (m) => { if (m.type() === "error") log("CONSOLE " + m.text()); });
await page.goto("http://127.0.0.1:8777/?q=med&t=11&freeze=1&addons=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });

const door = { x: -8063.65, z: -5927.85 };
const O = { x: 0.0545, z: -0.9985 };
const I = { x: -0.0545, z: 0.9985 };
const U = { x: 0.9985, z: 0.0543 };
await page.evaluate(({ x, z }) => {
  window.game.teleport("walk", x, z, Math.atan2(0.0545, -0.9985));
  window.game.S.snapCam = 4;
}, { x: door.x + O.x * 4.2, z: door.z + O.z * 4.2 });
log("teleported, waiting for hero sign and region");
await page.waitForFunction(() => {
  const hero = window.game.real.hero.list.find((n) => n.k === "starbucks2");
  if (!(hero && hero._g && hero._hi && hero._hi.visible)) return false;
  let signReady = false;
  hero._g.traverse((o) => {
    const mats = o.material ? [].concat(o.material) : [];
    for (const m of mats) {
      const img = (m.map && m.map.image) || (m.emissiveMap && m.emissiveMap.image);
      if (m.name === "sign" && img && img.width > 8) signReady = true;
    }
  });
  if (!signReady) return false;
  for (const r of window.game.real.regions.values()) if (r.rx === 2 && r.rz === 5 && r.state === "built") return true;
  return false;
}, null, { timeout: 180000 });
await page.waitForTimeout(2500);
log("hero ready");

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
        g.camera.position.set(place.cx, y + place.cy, place.cz);
        g.camera.lookAt(place.lx, y + place.ly, place.lz);
        g.S.paused = true;
        g.renderer.render(g.scene, g.camera);
        const w = g.S.walk;
        resolve(JSON.stringify({
          png: g.renderer.domElement.toDataURL("image/png"),
          walk: { x: +w.x.toFixed(2), z: +w.z.toFixed(2) },
          version: window.__aw && window.__aw.version,
        }));
      }, place.px != null ? 800 : 50);
    });
  }, place);
  const info = JSON.parse(url);
  const png = Buffer.from(info.png.slice(info.png.indexOf(",") + 1), "base64");
  if (png.byteLength < 1000) throw new Error("empty " + name);
  await writeFile(`${outDir}/${label}-${name}.png`, png);
  log("saved " + name + " " + png.byteLength + " " + JSON.stringify(info.walk) + " " + info.version);
}

await shot("street", {
  cx: door.x + O.x * 7.2, cz: door.z + O.z * 7.2, cy: 1.6,
  lx: door.x + I.x * 2, lz: door.z + I.z * 2, ly: 1.7,
});
await shot("inside", {
  px: door.x + I.x * 6, pz: door.z + I.z * 6, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 6, cz: door.z + O.z * 6, cy: 1.6,
  lx: door.x + I.x * 1, lz: door.z + I.z * 1, ly: 1.5,
});
await shot("inside-cam", {
  cx: door.x + I.x * 8, cz: door.z + I.z * 8, cy: 1.6,
  lx: door.x + O.x * 2, lz: door.z + O.z * 2, ly: 1.4,
});
await shot("cafe", {
  cx: door.x + U.x * -2.2 + I.x * 6.2, cz: door.z + U.z * -2.2 + I.z * 6.2, cy: 1.55,
  lx: door.x + U.x * 8 + I.x * 3.2, lz: door.z + U.z * 8 + I.z * 3.2, ly: 1.25,
});

if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "starbucks2");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt != null ? w.doorAt : 0;
    const samples = [
      ["aisle", doorAt, 6],
      ["bar", 6, 3.1],
      ["case", 3.9, 1.9],
      ["table", -7.5, 5.3],
      ["out", doorAt, -3],
      ["jamb", doorAt + 2.5, 0.05],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "starbucks2");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 6;
    const iz = w.mz + w.uz * doorAt + w.nz * 6;
    return {
      version: window.__aw.version,
      interior: st,
      walk: { x: +walk.x.toFixed(2), z: +walk.z.toFixed(2) },
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
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
log("wrote " + outDir + " " + label);
