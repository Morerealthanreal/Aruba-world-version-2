// Headless smoke test for the SuperGrok helicopter (?heli=1): boots the game, walks to open ground,
// boards with H, climbs with Space, flies forward with W, descends with Shift, lands and climbs out.
// Fails on any console.error / page error. Writes in-flight screenshots.
// usage: (serve game/ on PORT first, e.g. python3 -m http.server 8781 --bind 127.0.0.1 --directory game)
//        PORT=8781 node tools/heli_smoke.mjs low|med|high [outDir]
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const q = process.argv[2] || "low";
const outDir = process.argv[3] || "/tmp/heli-smoke";
const port = process.env.PORT || "8777";
await mkdir(outDir, { recursive: true });
const errors = [];
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const [vw, vh] = (process.env.VIEW || "1280x720").split("x").map(Number);
const page = await browser.newPage({ viewport: { width: vw, height: vh } });
// sim seconds the helicopter has integrated (frames are slow and dt is clamped under SwiftShader)
const simT = () => page.evaluate(() => window.__aw.heli.heli.time);
const waitSim = async (sec, maxWallMs = 300000) => { const t = await simT(); const end = Date.now() + maxWallMs; while ((await simT()) - t < sec && Date.now() < end) await page.waitForTimeout(500); };
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("console.error: " + m.text()); });
const log = (s) => console.log(`[${q}] ${s}`);
const stats = () => page.evaluate(() => ({ ...window.__aw.heli.stats, mode: window.game.S.mode, placed: window.__aw.heli.placed,
  hx: window.__aw.heli.heli.position.x, hz: window.__aw.heli.heli.position.z, prompt: document.getElementById("awHeliPrompt")?.textContent }));
const shot = async (name) => {
  const url = await page.evaluate(() => { const { renderer, scene, camera } = window.game; renderer.render(scene, camera); return renderer.domElement.toDataURL("image/png"); });
  await writeFile(`${outDir}/${q}-${name}.png`, Buffer.from(url.slice(url.indexOf(",") + 1), "base64"));
};
let ok = true;
const expect = (name, cond, info) => { log(`${cond ? "ok  " : "FAIL"} ${name} ${info ?? ""}`); if (!cond) ok = false; };

try {
  await page.goto(`http://127.0.0.1:${port}/?q=${q}&heli=1`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game?.ready && window.__aw && window.__aw.version, undefined, { timeout: 180000 });
  await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });
  expect("heli hook loaded", await page.evaluate(() => !!window.__aw.heli));
  // open ground: try a few spots until the hook finds a flat pad near the walker
  const spots = [[12.5167, -69.9958], [12.535, -70.02], [12.5681, -70.0336], [12.5186, -70.0358]];
  let placed = false;
  for (const [lat, lon] of spots) {
    await page.evaluate(([la, lo]) => { const g = window.game; const t = g.fromLL(la, lo); const r = g.nearestRoad(t.x, t.z); g.teleport("walk", r.x, r.z, r.h); }, [lat, lon]);
    await page.waitForFunction(() => window.__aw.heli.placed, undefined, { timeout: 25000 }).catch(() => {});
    const s = await stats();
    if (!s.placed) log(`no pad near ${lat},${lon}: fps ~${Math.round(await page.evaluate(() => window.__fps))}, mode=${s.mode}`);
    if (s.placed) { placed = true; log(`parked near ${lat},${lon} at x=${s.hx.toFixed(1)} z=${s.hz.toFixed(1)}`); break; }
  }
  expect("heli parked on open flat ground", placed);
  if (!placed) throw new Error("no pad");
  // walk up to it (place the walker beside the cabin) and board
  await page.evaluate(() => { const h = window.__aw.heli.heli.position, w = window.game.S.walk; w.x = h.x + 4; w.z = h.z; w.snap = true; });
  await page.waitForTimeout(1500);
  log(`prompt beside heli: "${(await stats()).prompt}"`);
  await shot("parked");
  await page.keyboard.press("h");
  await page.waitForFunction(() => window.__aw.heli.stats.occupied, undefined, { timeout: 30000 }).catch(() => {});
  let s = await stats();
  expect("boarded with H", s.occupied, `prompt="${s.prompt}"`);
  const y0 = s.y;
  await waitSim(2);
  await shot("onpad");
  const t0 = await page.evaluate(() => performance.now());
  // SwiftShader runs at a few fps and the add-on clamps dt to 0.1 s, so wait on sim state, not wall time
  await page.keyboard.down("Space");
  for (let i = 0; i < 90; i++) { await page.waitForTimeout(1000); if ((await stats()).agl > 15) break; }
  await page.keyboard.up("Space");
  log(`climb to 15 m AGL took ${((await page.evaluate(() => performance.now()) - t0) / 1000).toFixed(1)} s wall, fps ~${Math.round(await page.evaluate(() => window.__fps))}`);
  s = await stats();
  expect("Space climbs", s.agl > 6 && !s.onGround, `AGL ${s.agl.toFixed(1)} m (gained ${(s.y - y0).toFixed(1)} m), vy ${s.vy.toFixed(2)}`);
  await waitSim(4);
  const hold = await stats();
  expect("neutral holds altitude", Math.abs(hold.vy) < 1.5, `vy ${hold.vy.toFixed(2)} m/s, AGL ${hold.agl.toFixed(1)}`);
  await shot("hover");
  const p0 = await page.evaluate(() => ({ ...window.__aw.heli.heli.position }));
  await page.keyboard.down("w");
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(1000); const p = await page.evaluate(() => ({ ...window.__aw.heli.heli.position })); if (Math.hypot(p.x - p0.x, p.z - p0.z) > 30) break; }
  await page.keyboard.up("w");
  const p1 = await page.evaluate(() => ({ ...window.__aw.heli.heli.position, wx: window.game.S.walk.x, wz: window.game.S.walk.z }));
  const moved = Math.hypot(p1.x - p0.x, p1.z - p0.z);
  expect("W flies forward and the walker rides along", moved > 5 && Math.hypot(p1.wx - p1.x, p1.wz - p1.z) < 2, `${moved.toFixed(1)} m`);
  await shot("forward");
  await page.keyboard.down("Shift");
  for (let i = 0; i < 120; i++) { await page.waitForTimeout(1000); if ((await stats()).onGround) break; }
  await page.keyboard.up("Shift");
  s = await stats();
  expect("Shift descends and lands", s.onGround, `AGL ${s.agl.toFixed(2)}`);
  await page.waitForTimeout(500);
  await page.keyboard.press("h");
  await page.waitForFunction(() => !window.__aw.heli.stats.occupied, undefined, { timeout: 30000 }).catch(() => {});
  s = await stats();
  expect("H climbs out on the ground", !s.occupied && s.mode === "walk", `walker visible=${await page.evaluate(() => window.game.walker?.visible)}`);
  const info = await page.evaluate(() => window.game.renderer.info.render);
  log(`renderer.info: calls=${info.calls} triangles=${info.triangles}`);
} catch (e) {
  ok = false;
  log("ERROR " + e.message);
}
expect("no console/page errors", errors.length === 0, errors.slice(0, 5).join(" | "));
await browser.close();
process.exit(ok ? 0 : 1);
