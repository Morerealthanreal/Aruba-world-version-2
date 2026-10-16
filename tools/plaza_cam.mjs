// Palm Beach Plaza main entrance (east rotunda). Explicit cameras.
// The chase camera falls in the parking rows; these stay in the drive aisle.
// usage: node tools/plaza_cam.mjs before|after
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "before";
const outDir = "/tmp/plaza-shots";
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1&addons=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });

const door = { x: -7851.78, z: -6000.99 };
const O = { x: 0.995, z: 0.0995 };
const I = { x: -0.995, z: -0.0995 };
const U = { x: -0.0995, z: 0.995 };

await page.evaluate(({ x, z }) => {
  window.game.teleport("walk", x, z, Math.atan2(0.995, 0.0995));
}, { x: door.x + O.x * 8, z: door.z + O.z * 8 });
await page.waitForFunction(() => {
  const hero = window.game.real.hero.list.find((n) => n.k === "pbplaza");
  if (!(hero && hero._g && hero._hi && hero._hi.visible)) return false;
  let signReady = false;
  hero._g.traverse((o) => {
    const mats = o.material ? [].concat(o.material) : [];
    for (const m of mats) {
      const img = m.map && m.map.image;
      if (m.name === "sign" && img && img.width > 8) signReady = true;
    }
  });
  if (!signReady) return false;
  const M = window.game.real.M;
  const w = window.game.S.walk;
  const rx = Math.floor((w.x - M.X0) / M.RS);
  const rz = Math.floor((w.z - M.Z0) / M.RS);
  for (const r of window.game.real.regions.values()) if (r.rx === rx && r.rz === rz && r.state === "built") return true;
  return false;
}, null, { timeout: 180000 });
await page.waitForTimeout(2000);

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
        g.camera.lookAt(place.lx, (g.real.heightAt(place.lx, place.lz) || y) + place.ly, place.lz);
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
  console.log("saved", name, png.byteLength, JSON.stringify(info.walk), info.version);
}

await shot("street", {
  cx: door.x + O.x * 18, cz: door.z + O.z * 18, cy: 2.2,
  lx: door.x + I.x * 1, lz: door.z + I.z * 1, ly: 4.2,
});
await shot("inside", {
  px: door.x + I.x * 16, pz: door.z + I.z * 16, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 10, cz: door.z + O.z * 10, cy: 1.7,
  lx: door.x + I.x * 8, lz: door.z + I.z * 8, ly: 1.6,
});
await shot("lobby", {
  cx: door.x + I.x * 12.5 + U.x * -1.6, cz: door.z + I.z * 12.5 + U.z * -1.6, cy: 1.45,
  lx: door.x + I.x * 15.4 + U.x * 4.4, lz: door.z + I.z * 15.4 + U.z * 4.4, ly: 1.35,
});

if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "pbplaza");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 16],
      ["vestibule", doorAt, 4],
      ["shop", 4.4, 15.2],
      ["bench", 2.5, 14.2],
      ["out", doorAt, -3],
      ["jamb", doorAt + 3.8, 0.2],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "pbplaza");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 16;
    const iz = w.mz + w.uz * doorAt + w.nz * 16;
    return {
      version: window.__aw.version,
      interior: st,
      walk: { x: +walk.x.toFixed(2), z: +walk.z.toFixed(2) },
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      samples,
    };
  });
  console.log("probe", JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const shop = probe.samples && probe.samples.find((s) => s.name === "shop");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.5 && aisle && aisle.open && !aisle.blocked
    && shop && !shop.open && out && !out.open;
  if (!ok) {
    console.log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
