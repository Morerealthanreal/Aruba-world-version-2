// Radisson Blu lobby, north face under the tower. Explicit cameras.
// usage: node tools/rd_cam.mjs before|after
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "before";
const outDir = "/tmp/rd-shots";
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1&addons=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });

const door = { x: -7834.1, z: -6118.7 };
const O = { x: -0.0958, z: 0.9954 };
const I = { x: 0.0959, z: -0.9954 };
const U = { x: 0.9954, z: 0.0959 };

await page.evaluate(({ x, z }) => {
  window.game.teleport("walk", x, z, Math.atan2(0.0959, -0.9954));
}, { x: door.x + O.x * 6, z: door.z + O.z * 6 });
await page.waitForFunction(() => {
  const hero = window.game.real.hero.list.find((n) => n.k === "radisson");
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

const heights = await page.evaluate((door) => {
  const h = (x, z) => +window.game.real.heightAt(x, z).toFixed(3);
  return {
    door: h(door.x, door.z),
    out6: h(door.x + -0.0958 * 6, door.z + 0.9954 * 6),
    in4: h(door.x + 0.0959 * 4, door.z + -0.9954 * 4),
    cent: h(-7830.95, -6156.4),
  };
}, door);
console.log("heights", JSON.stringify(heights));

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
  cx: door.x + O.x * 11, cz: door.z + O.z * 11, cy: 1.7,
  lx: door.x + I.x * 1.5, lz: door.z + I.z * 1.5, ly: 2.6,
});
await shot("inside", {
  px: door.x + I.x * 5, pz: door.z + I.z * 5, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 4, cz: door.z + O.z * 4, cy: 1.6,
  lx: door.x + I.x * 4, lz: door.z + I.z * 4, ly: 1.6,
});
await shot("desk", {
  cx: door.x + I.x * 6.4 + U.x * -0.6, cz: door.z + I.z * 6.4 + U.z * -0.6, cy: 1.45,
  lx: door.x + I.x * 11.1, lz: door.z + I.z * 11.1, ly: 1.7,
});

if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "radisson");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 5],
      ["desk", 0, 9.2],
      ["clover", 6.8, 3.2],
      ["out", doorAt, -3],
      ["jamb", doorAt + 3.8, 0.15],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "radisson");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 5;
    const iz = w.mz + w.uz * doorAt + w.nz * 5;
    return {
      version: window.__aw.version,
      interior: st,
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      samples,
    };
  });
  console.log("probe", JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const desk = probe.samples && probe.samples.find((s) => s.name === "desk");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.25 && aisle && aisle.open && !aisle.blocked
    && desk && !desk.open && desk.blocked && out && !out.open;
  if (!ok) {
    console.log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
