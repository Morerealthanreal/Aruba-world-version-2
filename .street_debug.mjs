import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on("pageerror", (err) => console.log("pageerror", err.message));
page.on("console", (msg) => {
  const t = msg.text();
  if (/moto|glb|error|fail|GLTF|sport/i.test(t)) console.log("console", msg.type(), t.slice(0, 300));
});
page.on("response", (res) => {
  const u = res.url();
  if (u.includes("moto") || u.includes("addon") || u.includes("index-D")) console.log("res", res.status(), u.slice(0, 160));
});
await page.goto("http://127.0.0.1:8780/?t=12.5&freeze=1&q=high", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForFunction(() => window.game?.ready && window.__aw, null, { timeout: 180000 });
const info = await page.evaluate(() => {
  const g = window.game;
  const t = g.fromLL(12.5186, -70.0358);
  const r = g.nearestRoad(t.x, t.z);
  g.teleport("car", r.x, r.z, r.h);
  g.setMode("moto");
  return { mode: g.mode, hasCar: !!g.S?.car, keys: Object.keys(g).slice(0, 40) };
});
console.log("info", info);
await page.waitForTimeout(12000);
const names = await page.evaluate(() => {
  const hits = [];
  let n = 0;
  window.game.scene.traverse((o) => {
    n++;
    if (/sport|moto|rider|bike|wheel/i.test(o.name)) hits.push(o.name);
  });
  return { n, hits: hits.slice(0, 40), mode: window.game.mode };
});
console.log(JSON.stringify(names));
await browser.close();
