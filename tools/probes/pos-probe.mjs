import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// Diagnostic only. From the repo root:
//   node tools/probes/pos-probe.mjs
// Confirms teleport sticks at Paseo Herencia and heroes within 200 m load.
const root = fileURLToPath(new URL("../..", import.meta.url));
const port = 8796;
const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", "game"], { cwd: root, stdio: "ignore" });
const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(60000);
try {
  await page.goto(`http://127.0.0.1:${port}/?q=high&addons=1`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game?.ready && window.game.real?.heightAt);
  const x = -8021.62, z = -6014.94;
  const snap = await page.evaluate(({ x, z }) => {
    const g = window.game;
    const keys = Object.keys(g);
    g.teleport("walk", x, z, 0);
    const y = g.real.heightAt(x, z) || 2;
    window.__freeCam = [x + 30, y + 18, z + 50, x, y + 4, z];
    const w = g.S?.walk;
    return { keys, walk: w && { x: w.x, z: w.z, y: w.y }, hero: !!g.real.hero, n: g.real.hero?.list?.length || 0 };
  }, { x, z });
  console.log("snap", JSON.stringify(snap));
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(2000);
    const row = await page.evaluate(({ x, z }) => {
      const g = window.game;
      const w = g.S?.walk;
      const near = (g.real.hero?.list || []).filter((n) => n._g && Math.hypot(n.x - x, n.z - z) < 200);
      const cam = g.camera.position;
      return { walk: w && [Math.round(w.x), Math.round(w.z)], cam: [Math.round(cam.x), Math.round(cam.z)], near: near.length, sample: near.slice(0, 8).map((n) => n.k || n.id) };
    }, { x, z, i });
    console.log(JSON.stringify(row));
  }
} finally {
  await browser.close();
  server.kill();
}
