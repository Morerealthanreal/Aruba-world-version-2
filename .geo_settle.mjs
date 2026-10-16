import { chromium } from "@playwright/test";

const ROUTE = [
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
  { name: "noord", lat: 12.5681, lon: -70.0336 },
  { name: "california", lat: 12.6132, lon: -70.0514 },
];

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox", "--enable-precise-memory-info"],
});
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.625, hasTouch: true, isMobile: true });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8777/?q=low&emerg=force&crash=force&crashx=10", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game?.ready && window.__aw, undefined, { timeout: 120000 });
await page.locator("#loading").waitFor({ state: "hidden" });
await page.locator('#modes button[data-mode="car"]').click({ force: true });

async function teleport(stop) {
  await page.evaluate(({ lat, lon }) => {
    const game = window.game;
    const point = game.fromLL(lat, lon);
    const road = game.nearestRoad(point.x, point.z);
    game.teleport("car", road.x, road.z, road.h);
  }, stop);
}

for (let cycle = 0; cycle < 2; cycle++) {
  for (const stop of ROUTE) {
    await teleport(stop);
    const series = [];
    for (let s = 0; s < 12; s++) {
      await page.waitForTimeout(1000);
      const n = await page.evaluate(() => {
        const game = window.game;
        const q = game.real.queue?.length ?? null;
        return { g: game.renderer.info.memory.geometries, t: game.renderer.info.memory.textures, q, reg: game.real.regions?.size ?? null };
      });
      series.push(n);
    }
    console.log(`c${cycle} ${stop.name}`, series.map((n) => `${n.g}/${n.t} q${n.q} r${n.reg}`).join(" "));
  }
}
await browser.close();
