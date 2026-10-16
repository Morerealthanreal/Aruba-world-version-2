// Street-level and on-foot interior shots for one walk-in place.
// usage: node tools/interior_shot.mjs before|after
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const label = process.argv[2] || "shot";
const outDir = process.argv[3] || "/tmp/interior-shots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});

const url = "http://127.0.0.1:8777/?q=high&t=11&freeze=1&addons=1";
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 120000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 120000 });

// Fallback matches the hero's south wall (sign centred). After the addon
// loads, the live frame replaces this so the shot stands in the real opening.
let door = { x: -7087.55 + 0.94, z: 24.62 - 8.625 };
let outward = { x: 0, z: -1 };
let inward = { x: 0, z: 1 };
let along = { x: 1, z: 0 };
const live = await page.evaluate(() => {
  const inn = window.__aw && window.__aw.interiors;
  const w = inn && inn.places && inn.places[0] && inn.places[0].world;
  if (!w) return null;
  const doorAt = w.doorAt || 0;
  return {
    door: { x: w.mx + w.ux * doorAt, z: w.mz + w.uz * doorAt },
    outward: { x: -w.nx, z: -w.nz },
    inward: { x: w.nx, z: w.nz },
    along: { x: w.ux, z: w.uz },
    doorAt,
  };
});
if (live) {
  door = live.door; outward = live.outward; inward = live.inward; along = live.along;
  console.log("live frame", JSON.stringify(live));
}

async function grab(name) {
  const dataUrl = await page.evaluate(() => {
    const { renderer, scene, camera } = window.game;
    renderer.render(scene, camera);
    return renderer.domElement.toDataURL("image/png");
  });
  const png = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  if (png.byteLength < 1000) throw new Error("empty screenshot " + name);
  const { writeFile } = await import("node:fs/promises");
  await writeFile(`${outDir}/${label}-${name}.png`, png);
  console.log("saved", name, png.byteLength);
}

async function settle(tag) {
  await page.waitForFunction(() => {
    const h = window.game.real && window.game.real.hero;
    if (!h || !h.list) return false;
    const e = h.list.find((n) => n.k === "pastechihouse" || n.id === "pastechihouse");
    return !!(e && e._g);
  }, null, { timeout: 90000 });
  // let the region, hero and (after the patch) interior finish
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const S = window.game.S;
    const w = S.walk;
    const hero = window.game.real.hero.list.find((n) => n.k === "pastechihouse");
    const inn = window.__aw && window.__aw.interiors;
    return {
      mode: S.mode,
      x: +w.x.toFixed(2),
      z: +w.z.toFixed(2),
      y: +w.y.toFixed(2),
      blocked: window.game.blocked(w.x, w.z),
      hero: !!hero._g,
      interior: inn ? inn.stats() : null,
    };
  });
  console.log(tag, JSON.stringify(info));
  return info;
}

async function stand(x, z, yaw) {
  await page.evaluate(({ x, z, yaw }) => {
    const g = window.game;
    g.teleport("walk", x, z, yaw);
    g.S.lookYaw = 0;
    g.S.lookPitch = -0.04;
    g.S.snapCam = 4;
    g.S.walk.snap = true;
    g.S.walk.face = yaw;
  }, { x, z, yaw });
  await page.waitForTimeout(600);
}

function yawOf(dx, dz) {
  // camera offset = (sin(yaw), cos(yaw)); player faces away from the camera
  return Math.atan2(dx, dz);
}

// Street: player just south of the open front, slightly aside so the counter reads.
const street = {
  x: door.x + outward.x * 4.2 + along.x * 1.15,
  z: door.z + outward.z * 4.2 + along.z * 1.15,
};
const streetYaw = yawOf(outward.x, outward.z);
await stand(street.x, street.z, streetYaw);
await settle("street");
await grab("street");

// Inside: deep in the seating room, camera behind the player looking toward the counter.
const inside = {
  x: door.x + inward.x * 8.6,
  z: door.z + inward.z * 8.6,
};
const insideYaw = yawOf(inward.x, inward.z);
await stand(inside.x, inside.z, insideYaw);
const insideInfo = await settle("inside-try");
await grab("inside");

// If collision shoved the walker back out, also freeze the camera in the room
// so the before shot shows the empty shell (and the after shot shows furniture).
await page.evaluate(({ x, z, yaw, hyHint }) => {
  const g = window.game;
  const y = (g.real.heightAt(x, z) || hyHint || 0) + 1.55;
  const cam = g.camera;
  const ox = Math.sin(yaw) * 4.2, oz = Math.cos(yaw) * 4.2;
  cam.position.set(x + ox, y + 0.35, z + oz);
  cam.lookAt(x, y - 0.15, z);
  g.S.paused = true;
}, { x: inside.x, z: inside.z, yaw: insideYaw, hyHint: insideInfo.y });
await page.waitForTimeout(400);
await grab("inside-cam");

const probe = await page.evaluate(({ door, inward, along }) => {
  const g = window.game;
  const inn = window.__aw && window.__aw.interiors;
  const samples = [];
  for (const d of [-0.8, 0.3, 3.4, 8.6, 13.6]) {
    const x = door.x + inward.x * d;
    const z = door.z + inward.z * d;
    samples.push({ d, blocked: g.blocked(x, z), open: inn ? inn.open(x, z) : null });
  }
  const counter = { x: door.x + along.x * -3.1 + inward.x * 3.4, z: door.z + along.z * -3.1 + inward.z * 3.4 };
  samples.push({ d: "counter", blocked: g.blocked(counter.x, counter.z), open: inn ? inn.open(counter.x, counter.z) : null });
  return { version: window.__aw && window.__aw.version, samples };
}, { door, inward, along });
console.log("probe", JSON.stringify(probe));

if (label === "after") {
  const dx = insideInfo.x - inside.x, dz = insideInfo.z - inside.z;
  const shoved = Math.hypot(dx, dz);
  const built = insideInfo.interior && insideInfo.interior[0] && insideInfo.interior[0].built && insideInfo.interior[0].visible;
  const aisle = probe.samples.filter((s) => typeof s.d === "number").every((s) => s.blocked === false);
  if (shoved > 0.8 || !built || !aisle) {
    console.log("AFTER CHECK FAIL", JSON.stringify({ shoved, built, aisle }));
    await browser.close();
    process.exit(1);
  }
}

await browser.close();
console.log("wrote", outDir, label);
