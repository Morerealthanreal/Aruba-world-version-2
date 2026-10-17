// Super Food Plaza, Bubali main entrance. Explicit cameras.
// usage: node tools/su_cam.mjs before|after [outDir]
import { chromium } from "@playwright/test";
import { appendFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "before";
const outDir = process.argv[3] || "/tmp/su-shots";
const prog = "/tmp/su-cam.txt";
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
log("ready " + await page.evaluate(() => window.__aw && window.__aw.version));

const door = { x: -8801.75, z: -3545.95 };
const O = { x: -0.9546, z: -0.2978 };
const I = { x: 0.9546, z: 0.2978 };
const U = { x: -0.2978, z: 0.9546 };

await page.evaluate(({ x, z }) => {
  window.game.teleport("walk", x, z, Math.atan2(0.9546, 0.2978), { snap: true });
}, { x: door.x + O.x * 14, z: door.z + O.z * 14 });

let ready = false;
for (let i = 0; i < 40; i++) {
  const st = await page.evaluate(() => {
    const hero = window.game.real.hero.list.find((n) => n.k === "superfood");
    const hi = !!(hero && hero._hi && hero._hi.visible);
    let sign = 0;
    if (hero && hero._g) hero._g.traverse((o) => {
      const mats = o.material ? [].concat(o.material) : [];
      for (const m of mats) {
        const img = (m.map && m.map.image) || (m.emissiveMap && m.emissiveMap.image);
        if ((m.name === "sign" || m.name === "facade" || m.name === "ground") && img) sign = Math.max(sign, img.width || 0);
      }
    });
    const M = window.game.real.M;
    const w = window.game.S.walk;
    const rx = Math.floor((w.x - M.X0) / M.RS);
    const rz = Math.floor((w.z - M.Z0) / M.RS);
    let region = "";
    for (const r of window.game.real.regions.values()) if (r.rx === rx && r.rz === rz) region = r.state;
    const dist = hero ? Math.hypot(hero.x - w.x, hero.z - w.z) : 999;
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.stats && inn.stats().find((s) => s.id === "superfood");
    return { hi, sign, region, dist: +dist.toFixed(1), has: !!hero, interior: p || null, version: window.__aw && window.__aw.version };
  });
  log("wait " + i + " " + JSON.stringify(st));
  const near = st.region === "built" && st.dist < 80 && st.sign > 8;
  if ((st.hi || near) && st.sign > 8 && st.region === "built") { ready = true; break; }
  await page.waitForTimeout(4000);
}
if (!ready) {
  log("HERO NOT READY");
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(1500);

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
        if (Number.isFinite(feet) && Math.abs(w0.y - feet) > 0.35) { w0.g = feet; w0.y = feet; w0.vy = 0; }
        if (g.walker && g.walker.position) g.walker.position.set(w0.x, w0.y, w0.z);
        const y = g.real.heightAt(place.cx, place.cz) || 0;
        const ly = g.real.heightAt(place.lx, place.lz) || y;
        g.camera.position.set(place.cx, y + place.cy, place.cz);
        g.camera.lookAt(place.lx, ly + place.ly, place.lz);
        g.S.paused = true;
        const hero = g.real.hero.list.find((n) => n.k === "superfood");
        if (hero && hero._g) { hero._g.visible = true; if (hero._hi) hero._hi.visible = true; if (hero._lo) hero._lo.visible = false; }
        g.renderer.render(g.scene, g.camera);
        const w = g.S.walk;
        resolve(JSON.stringify({
          png: g.renderer.domElement.toDataURL("image/png"),
          walk: { x: +w.x.toFixed(2), z: +w.z.toFixed(2), y: +w.y.toFixed(2) },
          version: window.__aw && window.__aw.version,
        }));
      }, place.px != null ? 900 : 120);
    });
  }, place);
  const info = JSON.parse(url);
  const png = Buffer.from(info.png.slice(info.png.indexOf(",") + 1), "base64");
  await writeFile(`${outDir}/${label}-${name}.png`, png);
  log("saved " + name + " " + png.byteLength + " " + JSON.stringify(info.walk) + " " + info.version);
}

await shot("street", {
  px: door.x + O.x * 10, pz: door.z + O.z * 10, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 24, cz: door.z + O.z * 24, cy: 2.6,
  lx: door.x + I.x * 2, lz: door.z + I.z * 2, ly: 4.2,
});
await shot("inside", {
  px: door.x + I.x * 3.4, pz: door.z + I.z * 3.4, pyaw: Math.atan2(I.x, I.z),
  cx: door.x + O.x * 7 + U.x * 4, cz: door.z + O.z * 7 + U.z * 4, cy: 1.55,
  lx: door.x + I.x * 6, lz: door.z + I.z * 6, ly: 1.45,
});
await shot("hall", {
  cx: door.x + I.x * 3.2 + U.x * -2.2, cz: door.z + I.z * 3.2 + U.z * -2.2, cy: 1.45,
  lx: door.x + I.x * 10, lz: door.z + I.z * 10, ly: 1.35,
});

if (label === "after") {
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "superfood");
    const w = p && p.world;
    if (!w) return { version: window.__aw && window.__aw.version, missing: true };
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 3.6],
      ["jacks", doorAt - 4.6, 9.4],
      ["bliss", doorAt + 4.6, 9.4],
      ["back", doorAt, 11.4],
      ["cart", doorAt - 5.9, 3.4],
      ["out", doorAt, -4],
      ["jamb", doorAt + 2.8, 0.12],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    const st = inn.stats().find((s) => s.id === "superfood");
    const walk = window.game.S.walk;
    const ix = w.mx + w.ux * doorAt + w.nx * 3.4;
    const iz = w.mz + w.uz * doorAt + w.nz * 3.4;
    return {
      version: window.__aw.version,
      interior: st,
      shove: +Math.hypot(walk.x - ix, walk.z - iz).toFixed(2),
      samples,
    };
  });
  log("probe " + JSON.stringify(probe));
  const aisle = probe.samples && probe.samples.find((s) => s.name === "aisle");
  const jacks = probe.samples && probe.samples.find((s) => s.name === "jacks");
  const back = probe.samples && probe.samples.find((s) => s.name === "back");
  const out = probe.samples && probe.samples.find((s) => s.name === "out");
  const jamb = probe.samples && probe.samples.find((s) => s.name === "jamb");
  const ok = probe.interior && probe.interior.built && probe.interior.visible
    && probe.shove < 1.5 && aisle && aisle.open && !aisle.blocked
    && jacks && !jacks.open && jacks.blocked
    && back && !back.open
    && out && !out.open && jamb && !jamb.open;
  if (!ok) {
    log("AFTER CHECK FAIL");
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
log("done");
