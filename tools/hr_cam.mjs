// Hard Rock Cafe Palm Beach, north front under the sign. Explicit cameras.
// usage: node tools/hr_cam.mjs before|after
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "before";
const outDir = "/tmp/hr-shots";
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1&addons=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });

const door = { x: -8050.9, z: -5466.53 };
const O = { x: -0.1713, z: 0.9852 };
const I = { x: 0.1713, z: -0.9852 };
const U = { x: 0.9852, z: 0.1713 };

await page.evaluate(({ x, z }) => {
  window.game.teleport("walk", x, z, Math.atan2(-0.1713, 0.9852));
}, { x: door.x + O.x * 4.5, z: door.z + O.z * 4.5 });
await page.waitForFunction(() => {
  const hero = window.game.real.hero.list.find((n) => n.k === "hardrock_pb");
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
  console.log("saved", name, png.byteLength, JSON.stringify(info.walk), info.version);
}

await shot("street", {
  cx: door.x + O.x * 8, cz: door.z + O.z * 8, cy: 1.7,
  lx: door.x + I.x * 1.2, lz: door.z + I.z * 1.2, ly: 2.4,
});
await shot("inside", {
  px: door.x + I.x * 4.5, pz: door.z + I.z * 4.5, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 5.5, cz: door.z + O.z * 5.5, cy: 1.6,
  lx: door.x + I.x * 3, lz: door.z + I.z * 3, ly: 1.5,
});
await shot("bar", {
  cx: door.x + I.x * 3.2 + U.x * -1.2, cz: door.z + I.z * 3.2 + U.z * -1.2, cy: 1.5,
  lx: door.x + I.x * 3.4 + U.x * 3.6, lz: door.z + I.z * 3.4 + U.z * 3.6, ly: 1.3,
});

if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "hardrock_pb");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 4.5],
      ["bar", 3.4, 2.9],
      ["table", -4.2, 3.8],
      ["out", doorAt, -3],
      ["jamb", doorAt + 2.1, 0.15],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "hardrock_pb");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 4.5;
    const iz = w.mz + w.uz * doorAt + w.nz * 4.5;
    return {
      version: window.__aw.version,
      interior: st,
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      samples,
    };
  });
  console.log("probe", JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const bar = probe.samples && probe.samples.find((s) => s.name === "bar");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.25 && aisle && aisle.open && !aisle.blocked
    && bar && !bar.open && bar.blocked && out && !out.open;
  if (!ok) {
    console.log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
