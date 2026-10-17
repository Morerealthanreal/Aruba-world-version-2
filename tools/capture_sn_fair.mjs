// Street shots for the second San Nicolas batch. Not part of the game.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const murals = JSON.parse(fs.readFileSync("game/data/sn_fair_murals.json", "utf8")).murals;
const outDir = "/tmp/sn-fair";
fs.mkdirSync(outDir, { recursive: true });

const shots = [
  { id: "nymph", dist: 6.2, fov: 62 },
  { id: "nina", dist: 5.6, fov: 68 },
  { id: "cards", dist: 6.6, fov: 64 },
  { id: "bao", dist: 6.2, fov: 68 },
  { id: "bobby", dist: 6.0, fov: 62 },
  { id: "busca", dist: 5.4, fov: 66 },
  { id: "blue", dist: 6.2, fov: 72 },
  { id: "stay", dist: 6.4, fov: 66 },
];

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(180000);
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1");
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForFunction(() => window.__aw && window.__aw.snfair && window.__aw.snfair.mesh, null, { timeout: 60000 });

async function go(x, z, h) {
  await page.evaluate(({ x, z, h }) => window.game.teleport("car", x, z, h), { x, z, h });
}

await go(6450, 9350, 0);
await page.waitForTimeout(8000);
await go(6280, 9280, 0);
await page.waitForTimeout(5000);

const byId = Object.fromEntries(murals.map((m) => [m.id, m]));

for (const shot of shots) {
  const m = byId[shot.id];
  const [ox, oz] = m.normal;
  const [cx, cz] = m.center;
  const hdg = Math.atan2(ox, oz);
  await go(cx + ox * 16, cz + oz * 16, hdg);
  await page.waitForTimeout(4500);
  const result = await page.evaluate(({ m, dist, fov }) => {
    const g = window.game;
    const mesh = window.__aw.snfair.mesh;
    const [ox, oz] = m.normal;
    const [cx, cz] = m.center;
    const camX = cx + ox * dist;
    const camZ = cz + oz * dist;
    const wy = g.real.heightAt(cx, cz);
    const gy = g.real.heightAt(camX, camZ);
    if (typeof wy !== "number" || typeof gy !== "number") return { err: "height" };
    const bottom = typeof m.y0 === "number" ? wy + m.y0 : wy + (m.lift || 0.08);
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
    return { url, visible: mesh.visible, lookY, camX, camZ };
  }, { m, dist: shot.dist, fov: shot.fov });
  if (result.err) {
    console.log(shot.id, result.err);
    continue;
  }
  const buf = Buffer.from(result.url.split(",")[1], "base64");
  fs.writeFileSync(`${outDir}/${shot.id}.jpg`, buf);
  console.log(shot.id, "visible", result.visible, "bytes", buf.length);
}

await browser.close();
