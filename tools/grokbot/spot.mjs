// Headless spot check: console errors, camera shots, fps sample.
// usage: node tools/grokbot/spot.mjs <spec.json> <port> <label> <outDir> [q=high]
import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const [specPath, port, label, outDir, q = "high"] = process.argv.slice(2);
const spec = JSON.parse(await readFile(specPath, "utf8"));
await mkdir(outDir, { recursive: true });
const errors = [];
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => errors.push("PAGEERROR " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE " + m.text()); });
await page.goto(`http://127.0.0.1:${port}/?q=${q}&t=${spec.t || 10}&freeze=1&addons=1`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 240000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 240000 });
const tp = spec.teleport;
await page.evaluate((tp) => window.game.teleport("walk", tp.x, tp.z, tp.yaw || 0), tp);
await page.waitForFunction((ids) => {
  const g = window.game, M = g.real.M, w = g.S.walk;
  const rx = Math.floor((w.x - M.X0) / M.RS), rz = Math.floor((w.z - M.Z0) / M.RS);
  let built = false;
  for (const r of g.real.regions.values()) if (r.rx === rx && r.rz === rz && r.state === "built") built = true;
  if (!built) return false;
  for (const id of ids) {
    const h = g.real.hero.list.find((n) => n.k === id);
    if (!(h && h._g)) return false;
  }
  return true;
}, spec.wait || [], { timeout: 240000 }).catch(() => errors.push("TIMEOUT waiting for region/heroes"));
await page.waitForTimeout(4000);

const bench = [];
for (const s of spec.shots) {
  const data = await page.evaluate((p) => new Promise((res) => {
    const g = window.game;
    g.S.paused = false;
    setTimeout(() => {
      const y = g.real.heightAt(p.cx, p.cz) || 0;
      const ly = g.real.heightAt(p.lx, p.lz) || y;
      g.camera.position.set(p.cx, y + p.cy, p.cz);
      g.camera.lookAt(p.lx, ly + p.ly, p.lz);
      g.S.paused = true;
      g.renderer.render(g.scene, g.camera);
      const png = g.renderer.domElement.toDataURL("image/png");
      // fixed-camera bench: draw calls, triangles and CPU+GPU ms per frame
      const R = g.renderer, ar = R.info.autoReset; R.info.autoReset = false; R.info.reset();
      R.render(g.scene, g.camera);
      const calls = R.info.render.calls, tris = R.info.render.triangles; R.info.autoReset = ar;
      const gl = R.getContext(); const t0 = performance.now();
      for (let i = 0; i < 8; i++) R.render(g.scene, g.camera);
      gl.finish();
      res({ png, calls, tris, ms: +((performance.now() - t0) / 8).toFixed(1) });
    }, 600);
  }), s);
  await writeFile(`${outDir}/${label}-${s.name}.png`, Buffer.from(data.png.slice(data.png.indexOf(",") + 1), "base64"));
  bench.push({ shot: s.name, calls: data.calls, tris: data.tris, ms: data.ms });
}
// fps: unpaused, standing at the teleport spot, camera driven by the game
const fps = await page.evaluate((sec) => new Promise((res) => {
  const g = window.game; g.S.paused = false;
  let n = 0; const t0 = performance.now(); const dts = []; let last = t0;
  function f(t) { n++; dts.push(t - last); last = t; if (t - t0 < sec * 1000) requestAnimationFrame(f); else {
    dts.sort((a, b) => a - b);
    res({ fps: +(n / ((t - t0) / 1000)).toFixed(2), p95ms: +dts[Math.floor(dts.length * 0.95)].toFixed(1),
      calls: g.renderer.info.render.calls, tris: g.renderer.info.render.triangles });
  } }
  requestAnimationFrame(f);
}), spec.fpsSeconds || 20);
const hero = await page.evaluate((ids) => ids.map((id) => {
  const h = window.game.real.hero.list.find((n) => n.k === id);
  return { id, loaded: !!(h && h._g), hi: !!(h && h._hi && h._hi.visible) };
}), spec.wait || []);
const out = { label, port, q, errors, bench, fps, hero };
await writeFile(`${outDir}/${label}-report.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
await browser.close();
