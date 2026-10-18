// Driving-feel probe (car / moto). Serve game/ on 8777 first. node tools/perf/drive_feel.mjs <label> [low|high] [extra query] [car|moto]
// Fixed 1/30 s sim steps (A's __stepN + inpage.js virtual rAF). Logs hold-brake (Space) reverse, then 900 frames of full gas:
// ride height (car.y - heightAt), camera jerk in the car frame and in world space above 80 km/h, and a final screenshot.
import { chromium } from "playwright";
import fs from "fs";
const [label, q = "low", extra = "", vehicle = "car"] = process.argv.slice(2);
const browser = await chromium.launch({ args: ["--use-angle=swiftshader","--enable-unsafe-swiftshader","--disable-gpu-sandbox"] });
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const errs = []; page.on("console", m => m.type()==="error" && errs.push(m.text())); page.on("pageerror", e => errs.push(String(e)));
await page.goto(`http://127.0.0.1:8777/?q=${q}&t=12&fpsguard=0${extra ? "&" + extra : ""}`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game?.ready && window.__aw, undefined, { timeout: 180000 });
await page.evaluate(fs.readFileSync(new URL("./inpage.js", import.meta.url), "utf8"));
await page.evaluate((veh) => { window.__M.useVirtual = true; const g = window.game; g.setMode && g.setMode("car");
  const p = g.fromLL(12.5040, -70.0110), r = g.nearestRoad(p.x, p.z); g.teleport("car", r.x, r.z, r.h); if (veh === "moto") g.setMode("moto"); window.__stepN = 1e9; }, vehicle);
await page.waitForTimeout(8000); // settle (streaming)
const keys = Object.keys(await page.evaluate(() => window.game.S.car));
// --- reverse: hold brake from stop
await page.evaluate(() => { const c = window.game.S.car; c.s = 0; });
const rev = [];
await page.keyboard.down("Space");
for (let i = 0; i < 12; i++) { await page.waitForTimeout(400); rev.push(await page.evaluate(() => +window.game.S.car.s.toFixed(2))); }
await page.keyboard.up("Space");
await page.waitForTimeout(1500);
// --- highway: re-teleport, hold gas, log every frame
await page.evaluate(() => { const g = window.game, c = g.S.car; const p = g.fromLL(12.5040, -70.0110), r = g.nearestRoad(p.x, p.z); g.teleport("car", r.x, r.z, r.h); if (g.S.mode !== "car" && g.S.mode !== "moto") g.setMode("car");
  const A = g.real, cam = g.camera, log = window.__log = [];
  const f = () => { const c = g.S.car; log.push([c.x, c.y, c.z, c.h, c.s, A.heightAt(c.x, c.z), cam.position.x, cam.position.y, cam.position.z, cam.quaternion.x, cam.quaternion.y, cam.quaternion.z, cam.quaternion.w, g.nearestRoad(c.x, c.z)?.d ?? -1]); if (log.length < 900) requestAnimationFrame(f); };
  requestAnimationFrame(f); });
await page.keyboard.down("w");
await page.waitForFunction(() => window.__log.length >= 900, undefined, { timeout: 900000, polling: 2000 });
await page.keyboard.up("w");
const log = await page.evaluate(() => window.__log);
const shot = await page.evaluate(() => { const { renderer, scene, camera } = window.game; const p = window.__awPost; if (p?.composer && p.on !== false) p.composer.render(); else renderer.render(scene, camera); return renderer.domElement.toDataURL("image/jpeg", 0.85); });
fs.writeFileSync(`${label}.jpg`, Buffer.from(shot.slice(shot.indexOf(",") + 1), "base64"));
// --- analysis: camera in car frame, jerk
const rel = log.map(r => { const dx = r[6] - r[0], dz = r[8] - r[2], c = Math.cos(r[3]), s = Math.sin(r[3]); return [dx * c - dz * s, r[7] - r[1], dx * s + dz * c]; });
const d3 = (a, i, k) => a[i + 3][k] - 3 * a[i + 2][k] + 3 * a[i + 1][k] - a[i][k];
let jerk = [], hi = []; for (let i = 0; i + 3 < rel.length; i++) { const v = Math.hypot(d3(rel, i, 0), d3(rel, i, 1), d3(rel, i, 2)); jerk.push(v); if (Math.abs(log[i][4]) * 3.6 > 80) hi.push(v); }
const rms = a => a.length ? Math.sqrt(a.reduce((x, y) => x + y * y, 0) / a.length) : null;
// camera world-position jerk (absolute), at > 80 km/h
let wj = []; for (let i = 0; i + 3 < log.length; i++) if (Math.abs(log[i][4]) * 3.6 > 80) { const v = Math.hypot(...[6,7,8].map(k => log[i+3][k] - 3*log[i+2][k] + 3*log[i+1][k] - log[i][k])); wj.push(v); }
const gap = log.map(r => r[1] - r[5]);
const spd = log.map(r => r[4] * 3.6);
const out = { label, q, vehicle, keys, rev, maxKmh: Math.max(...spd), framesOver80: hi.length, camRelJerkRms_all: rms(jerk), camRelJerkRms_hi: rms(hi), camWorldJerkRms_hi: rms(wj), camRelJerkMax_hi: hi.length ? Math.max(...hi) : null,
  rideHeight: { min: Math.min(...gap), max: Math.max(...gap), mean: gap.reduce((a, b) => a + b, 0) / gap.length }, distLat: log.map(r=>r[13]).filter(x=>x>=0).reduce((a,b)=>Math.max(a,b),0), errs };
fs.writeFileSync(`${label}.json`, JSON.stringify({ ...out, log }, null, 0));
console.log(JSON.stringify(out));
await browser.close();
