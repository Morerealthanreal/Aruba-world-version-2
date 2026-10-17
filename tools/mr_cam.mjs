// Aruba Marriott, the face under the signs. Explicit cameras.
// usage: node tools/mr_cam.mjs before|after [outDir]
import { chromium } from "@playwright/test";
import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "before";
const outDir = process.argv[3] || "/tmp/mr-shots";
const prog = "/tmp/mr-shot-progress.txt";
const log = (s) => { appendFileSync(prog, s + "\n"); console.log(s); };
await mkdir(outDir, { recursive: true });
appendFileSync(prog, "\n--- " + label + " " + new Date().toISOString() + " ---\n");
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => log("PAGEERROR " + e.message));
page.on("console", (m) => { if (m.type() === "error") log("CONSOLE " + m.text()); });
await page.goto("http://127.0.0.1:8777/?q=med&t=11&freeze=1&addons=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });

const door = { x: -8051.9, z: -6773.95 };
const O = { x: -0.0337, z: -0.9994 };
const I = { x: 0.0337, z: 0.9994 };
const U = { x: -0.9994, z: 0.0337 };

await page.evaluate(({ x, z }) => {
  window.game.S.snapCam = 240;
  window.game.teleport("walk", x, z, Math.atan2(0.0337, 0.9994), { snap: true });
}, { x: door.x + O.x * 12, z: door.z + O.z * 12 });
await page.waitForFunction(() => {
  const hero = window.game.real.hero.list.find((n) => n.k === "marriott");
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
  const M = window.game.real.M;
  const w = window.game.S.walk;
  const rx = Math.floor((w.x - M.X0) / M.RS);
  const rz = Math.floor((w.z - M.Z0) / M.RS);
  for (const r of window.game.real.regions.values()) if (r.rx === rx && r.rz === rz && r.state === "built") return true;
  return false;
}, null, { timeout: 180000 });
await page.waitForTimeout(2000);

const heights = await page.evaluate((door) => {
  const h = (x, z) => +window.game.real.heightAt(x, z).toFixed(3);
  return {
    door: h(door.x, door.z),
    out8: h(door.x + -0.0337 * 8, door.z + -0.9994 * 8),
    in4: h(door.x + 0.0337 * 4, door.z + 0.9994 * 4),
    cent: h(-8000.03, -6711.14),
  };
}, door);
log("heights " + JSON.stringify(heights));

async function shot(name, place) {
  const url = await page.evaluate((place) => {
    const g = window.game;
    if (place.px != null) {
      g.S.paused = false;
      g.teleport("walk", place.px, place.pz, place.pyaw || 0, { snap: true });
      g.S.snapCam = 2;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const w0 = g.S.walk;
        const feet = g.real.heightAt(w0.x, w0.z);
        if (Number.isFinite(feet) && w0.y - feet > 1.2) {
          w0.g = feet;
          w0.y = feet;
          w0.vy = 0;
        }
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
  cx: door.x + O.x * 22, cz: door.z + O.z * 22, cy: 2.6,
  lx: door.x, lz: door.z, ly: 8,
});
await shot("inside", {
  px: door.x + I.x * 4.5, pz: door.z + I.z * 4.5, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 9, cz: door.z + O.z * 9, cy: 1.7,
  lx: door.x + I.x * 2, lz: door.z + I.z * 2, ly: 3.2,
});
await shot("desk", {
  cx: door.x + I.x * 5.2 + U.x * -1.1, cz: door.z + I.z * 5.2 + U.z * -1.1, cy: 1.5,
  lx: door.x + I.x * 9.2, lz: door.z + I.z * 9.2, ly: 1.7,
});

if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "marriott");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 5],
      ["desk", 0, 8],
      ["chair", -4.4, 4.3],
      ["out", doorAt, -3],
      ["jamb", doorAt + 3.5, 0.15],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "marriott");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 4.5;
    const iz = w.mz + w.uz * doorAt + w.nz * 4.5;
    return {
      version: window.__aw.version,
      interior: st,
      door: { x: +w.mx.toFixed(2), z: +w.mz.toFixed(2), nx: +w.nx.toFixed(4), nz: +w.nz.toFixed(4) },
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      samples,
    };
  });
  log("probe " + JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const desk = probe.samples && probe.samples.find((s) => s.name === "desk");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.25 && aisle && aisle.open && !aisle.blocked
    && desk && !desk.open && desk.blocked && out && !out.open;
  if (!ok) {
    log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
