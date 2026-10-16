import { expect, test } from "@playwright/test";

function installRuntimeErrorCapture(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    errors.push(`uncaught exception: ${error.stack || error.message}`);
  });
  return errors;
}

test("player engines, silent traffic, crash sirens and turbo", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "low", "audio behavior does not depend on quality");
  test.setTimeout(3 * 60 * 1000);
  const errors = installRuntimeErrorCapture(page);

  await page.goto("/?q=low&crash=force&crashx=10&emerg=force", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game?.ready && window.__aw?.audio, undefined, { timeout: 120_000 });
  await expect(page.locator("#loading")).toBeHidden();
  await page.locator('#modes button[data-mode="car"]').click({ force: true });
  await page.locator("#c").click({ force: true });

  await page.waitForFunction(() => window.__aw.audio.stats.started, undefined, { timeout: 15_000 });
  const armed = await page.evaluate(() => ({
    voices: window.__aw.audio.stats.trafficVoices,
    nodes: window.__aw.audio.stats.nodes,
  }));
  expect(armed.voices).toBe(0);
  expect(armed.nodes).toBeGreaterThan(0);

  await page.evaluate(() => {
    const game = window.game;
    const target = game.fromLL(12.535, -70.02);
    const road = game.nearestRoad(target.x, target.z);
    game.teleport("car", road.x, road.z, road.h);
  });
  await page.keyboard.down("w");
  await page.waitForTimeout(4000);
  await page.keyboard.up("w");

  const driven = await page.evaluate(() => ({
    ...window.__aw.audio.stats,
    speed: Math.abs(window.game.S.car.s || 0),
  }));
  expect(driven.trafficVoices).toBe(0);
  expect(driven.mode).toBe("car");
  expect(driven.rpm, JSON.stringify(driven)).toBeGreaterThan(1800);
  expect(driven.gear, JSON.stringify(driven)).toBeGreaterThanOrEqual(2);
  expect(driven.level).toBeGreaterThan(0.02);
  expect(driven.level).toBeLessThanOrEqual(0.26);

  await page.waitForFunction(() => window.__aw.audio.stats.impacts >= 1, undefined, { timeout: 40_000 });
  await page.waitForFunction(() => window.__aw.crash.stats.active, undefined, { timeout: 20_000 });
  await page.evaluate(() => {
    const stats = window.__aw.crash.stats;
    window.game.teleport("car", stats.x, stats.z, 0);
  });
  await page.waitForFunction(() => window.__aw.audio.stats.police > 0.008, undefined, { timeout: 45_000 });
  await page.waitForFunction(() => window.__aw.crash.stats.fs, undefined, { timeout: 90_000 });

  const atScene = await page.evaluate(() => ({
    audio: window.__aw.audio.stats,
    crash: window.__aw.crash.stats,
  }));
  expect(atScene.audio.trafficVoices).toBe(0);
  expect(atScene.audio.police).toBeGreaterThan(0);
  expect(atScene.audio.police).toBeLessThan(0.05);
  expect(atScene.crash.fs).toBe(true);
  expect(atScene.audio.level).toBeLessThanOrEqual(0.26);

  await page.locator('#modes button[data-mode="moto"]').click({ force: true });
  await page.keyboard.down("w");
  await page.waitForTimeout(1800);
  const bike = await page.evaluate(() => window.__aw.audio.stats);
  await page.keyboard.up("w");
  expect(bike.mode).toBe("moto");
  expect(bike.rpm).toBeGreaterThan(2000);
  expect(bike.level).toBeGreaterThan(0.02);
  expect(bike.level).toBeLessThanOrEqual(0.24);
  expect(bike.trafficVoices).toBe(0);

  await page.locator('#modes button[data-mode="plane"]').click({ force: true });
  await page.evaluate(() => {
    const game = window.game;
    const here = game.S.car;
    game.teleport("plane", here.x, 80, here.z, { y: 80, p: 0.02, r: 0, s: 40, thr: 0.7 });
  });
  await page.keyboard.down("t");
  await page.waitForFunction(() => window.__aw.audio.stats.turbo > 0.35, undefined, { timeout: 8_000 });
  const roaring = await page.evaluate(() => window.__aw.audio.stats.turbo);
  expect(roaring).toBeLessThanOrEqual(1);
  await page.waitForTimeout(700);
  await page.keyboard.up("t");
  await page.waitForFunction(() => window.__aw.audio.stats.turbo < 0.12, undefined, { timeout: 8_000 });

  expect(errors, errors.join("\n\n")).toEqual([]);
});
