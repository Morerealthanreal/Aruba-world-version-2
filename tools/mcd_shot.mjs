// Street and on-foot shots for McDonald's Palm Beach.
// usage: node tools/mcd_shot.mjs before|after [outDir]
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] || "shot";
const outDir = process.argv[3] || "/tmp/mcd-shots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text()); });

await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1&addons=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 120000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 120000 });

let door = { x: -7960.55, z: -5450.35 };
let outward = { x: -0.17638138142255366, z: 0.9843219027774764 };
let inward = { x: 0.17638138142255366, z: -0.9843219027774764 };
let along = { x: -0.9843219027774764, z: -0.17638138142255366 };
const live = await page.evaluate(() => {
  const inn = window.__aw && window.__aw.interiors;
  const p = inn && inn.places && inn.places.find((n) => n.id === "mcd1");
  const w = p && p.world;
  if (!w) return null;
  const doorAt = w.doorAt || 0;
  return {
    door: { x: w.mx + w.ux * doorAt, z: w.mz + w.uz * doorAt },
    outward: { x: -w.nx, z: -w.nz },
    inward: { x: w.nx, z: w.nz },
    along: { x: w.ux, z: w.uz },
  };
});
if (live) {
  door = live.door; outward = live.outward; inward = live.inward; along = live.along;
  console.log("live", JSON.stringify(live));
}

async function grab(name) {
  const dataUrl = await page.evaluate(() => {
    const { renderer, scene, camera } = window.game;
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL("image/png");
  });
  const png = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  if (png.byteLength < 1000) throw new Error("empty " + name);
  await writeFile(`${outDir}/${label}-${name}.png`, png);
  console.log("saved", name, png.byteLength);
}
async function settle(tag) {
  await page.waitForFunction(() => {
    const h = window.game.real && window.game.real.hero;
    const e = h && h.list && h.list.find((n) => n.k === "mcd1");
    return !!(e && e._g);
  }, null, { timeout: 90000 });
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const w = window.game.S.walk;
    const inn = window.__aw && window.__aw.interiors;
    const st = inn ? inn.stats().find((s) => s.id === "mcd1") : null;
    return { x: +w.x.toFixed(2), z: +w.z.toFixed(2), y: +w.y.toFixed(2), blocked: window.game.blocked(w.x, w.z), interior: st };
  });
  console.log(tag, JSON.stringify(info));
  return info;
}
async function stand(x, z, yaw) {
  await page.evaluate(({ x, z, yaw }) => {
    const g = window.game;
    g.teleport("walk", x, z, yaw);
    g.S.lookYaw = 0; g.S.lookPitch = -0.04; g.S.snapCam = 4;
    g.S.walk.snap = true; g.S.walk.face = yaw;
  }, { x, z, yaw });
  await page.waitForTimeout(500);
}
const yawOf = (dx, dz) => Math.atan2(dx, dz);

const street = {
  x: door.x + outward.x * 7 + along.x * 2.2,
  z: door.z + outward.z * 7 + along.z * 2.2,
};
await stand(street.x, street.z, yawOf(outward.x, outward.z));
await settle("street");
await grab("street");

const inside = { x: door.x + inward.x * 8, z: door.z + inward.z * 8 };
const insideYaw = yawOf(inward.x, inward.z);
await stand(inside.x, inside.z, insideYaw);
const insideInfo = await settle("inside");
await grab("inside");

await page.evaluate(({ x, z, yaw, hy }) => {
  const g = window.game;
  const y = (g.real.heightAt(x, z) || hy || 0) + 1.55;
  const ox = Math.sin(yaw) * 4.2, oz = Math.cos(yaw) * 4.2;
  g.camera.position.set(x + ox, y + 0.35, z + oz);
  g.camera.lookAt(x, y - 0.15, z);
  g.S.paused = true;
}, { x: inside.x, z: inside.z, yaw: insideYaw, hy: insideInfo.y });
await page.waitForTimeout(300);
await grab("inside-cam");

if (label === "after") {
  const shoved = Math.hypot(insideInfo.x - inside.x, insideInfo.z - inside.z);
  const built = insideInfo.interior && insideInfo.interior.built && insideInfo.interior.visible;
  const probe = await page.evaluate(() => {
    const inn = window.__aw && window.__aw.interiors;
    const p = inn && inn.places.find((n) => n.id === "mcd1");
    const w = p && p.world;
    if (!w) return null;
    const doorAt = w.doorAt || 0;
    const samples = [
      ["aisle", doorAt, 8],
      ["walk", -6.2, 4],
      ["counter", 0.4, 3.6],
      ["out", doorAt, -3],
    ].map(([name, a, d]) => {
      const x = w.mx + w.ux * a + w.nx * d;
      const z = w.mz + w.uz * a + w.nz * d;
      return { name, blocked: window.game.blocked(x, z), open: window.__awDoor(x, z) };
    });
    return { version: window.__aw.version, samples };
  });
  console.log("probe", JSON.stringify(probe));
  const aisle = probe && probe.samples.find((s) => s.name === "aisle");
  const counter = probe && probe.samples.find((s) => s.name === "counter");
  if (shoved > 1 || !built || !aisle || aisle.blocked || !counter || !counter.blocked) {
    console.log("AFTER CHECK FAIL", shoved, JSON.stringify(insideInfo));
    await browser.close();
    process.exit(1);
  }
}
await browser.close();
console.log("wrote", outDir, label);
