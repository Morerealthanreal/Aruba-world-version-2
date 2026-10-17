// Street shots for the later San Nicolas batch. Not part of the game.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const murals = JSON.parse(fs.readFileSync("game/data/sn_later_murals.json", "utf8")).murals;
const outDir = "/tmp/sn-later";
fs.mkdirSync(outDir, { recursive: true });

const shots = [
  { id: "roots", dist: 7.2, fov: 58 },
  { id: "lode", dist: 6.4, fov: 48 },
  { id: "defender", dist: 7.6, fov: 56 },
  { id: "grace", dist: 10.0, fov: 52 },
];

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(180000);
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1");
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForFunction(() => window.__aw && window.__aw.snlater && window.__aw.snlater.mesh, null, { timeout: 90000 });

async function go(x, z, h) {
  await page.evaluate(({ x, z, h }) => window.game.teleport("car", x, z, h), { x, z, h });
}

await go(6450, 9350, 0);
await page.waitForTimeout(8000);

const byId = Object.fromEntries(murals.map((m) => [m.id, m]));

for (const shot of shots) {
  const m = byId[shot.id];
  const [ox, oz] = m.normal;
  const [cx, cz] = m.center;
  const hdg = Math.atan2(ox, oz);
  await go(cx + ox * 18, cz + oz * 18, hdg);
  await page.waitForTimeout(6000);
  const result = await page.evaluate(({ m, dist, fov }) => {
    const g = window.game;
    const mesh = window.__aw.snlater.mesh;
    const [ox, oz] = m.normal;
    const [cx, cz] = m.center;
    const camX = cx + ox * dist;
    const camZ = cz + oz * dist;
    const wy = g.real.heightAt(cx, cz);
    const gy = g.real.heightAt(camX, camZ);
    if (typeof wy !== "number" || typeof gy !== "number") return { err: "height", wy, gy };
    const bottom = wy + (m.lift || 0.08);
    const lookY = bottom + m.height * 0.48;
    const cam = g.camera;
    if (cam.parent) {
      cam.parent.remove(cam);
      g.scene.add(cam);
    }
    cam.fov = fov;
    cam.near = 0.25;
    cam.updateProjectionMatrix();
    cam.position.set(camX, gy + 1.58, camZ);
    cam.lookAt(cx, lookY, cz);
    cam.updateMatrixWorld(true);
    g.renderer.render(g.scene, cam);
    const url = g.renderer.domElement.toDataURL("image/jpeg", 0.86);
    return { url, visible: mesh.visible, lookY, camX, camZ, wy };
  }, { m, dist: shot.dist, fov: shot.fov });
  if (result.err) {
    console.log(shot.id, result.err, result.wy, result.gy);
    continue;
  }
  const buf = Buffer.from(result.url.split(",")[1], "base64");
  fs.writeFileSync(`${outDir}/${shot.id}.jpg`, buf);
  console.log(shot.id, "visible", result.visible, "bytes", buf.length, "cam", result.camX.toFixed(1), result.camZ.toFixed(1));
}

await browser.close();
