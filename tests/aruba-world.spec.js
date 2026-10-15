import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const MODE_DURATION_MS = 30_000;
const SCREENSHOT_DIR = path.join(
  process.cwd(),
  "tests",
  "artifacts",
  "screenshots",
);

const SPOTS = [
  { name: "noord", lat: 12.5681, lon: -70.0336 },
  { name: "palm-beach", lat: 12.5704, lon: -70.045 },
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
  { name: "hooiberg", lat: 12.5167, lon: -69.9958 },
];

const MODES = [
  { id: "car", label: "CAR", minimumTravel: 5 },
  { id: "moto", label: "MOTORBIKE", minimumTravel: 5 },
  { id: "walk", label: "ON FOOT", minimumTravel: 10 },
  { id: "plane", label: "PLANE", minimumTravel: 250 },
];

function installRuntimeErrorCapture(page) {
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console.error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    errors.push(`uncaught exception: ${error.stack || error.message}`);
  });

  return errors;
}

function assertNoRuntimeErrors(errors) {
  expect(
    errors,
    `The game emitted browser errors:\n${errors.join("\n\n")}`,
  ).toEqual([]);
}

async function readPosition(page, mode) {
  return page.evaluate((activeMode) => {
    const state = window.game.S;
    const entity =
      activeMode === "walk"
        ? state.walk
        : activeMode === "plane"
          ? state.plane
          : state.car;
    return { x: entity.x, y: entity.y || 0, z: entity.z };
  }, mode);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

async function exerciseMode(page, mode) {
  await page.locator(`#modes button[data-mode="${mode.id}"]`).click();
  await expect(page.locator("#hudmode")).toContainText(mode.label);
  await expect
    .poll(() => page.evaluate(() => window.game.S.mode))
    .toBe(mode.id);

  const start = await readPosition(page, mode.id);
  const samples = [start];
  const finishAt = Date.now() + MODE_DURATION_MS;
  const heldKeys = mode.id === "plane" ? ["Shift"] : ["w"];

  if (mode.id === "walk") heldKeys.push("Shift");
  for (const key of heldKeys) await page.keyboard.down(key);

  let pulse = 0;
  try {
    while (Date.now() < finishAt) {
      const steer = pulse++ % 2 === 0 ? "a" : "d";
      if (mode.id !== "walk") await page.keyboard.down(steer);
      if (mode.id === "plane") await page.keyboard.down("w");

      const pulseDuration = Math.max(
        0,
        Math.min(600, finishAt - Date.now()),
      );
      if (pulseDuration > 0) await page.waitForTimeout(pulseDuration);

      if (mode.id !== "walk") await page.keyboard.up(steer);
      if (mode.id === "plane") await page.keyboard.up("w");

      const remainder = Math.min(4_400, finishAt - Date.now());
      if (remainder > 0) await page.waitForTimeout(remainder);
      samples.push(await readPosition(page, mode.id));
    }
  } finally {
    for (const key of ["w", "a", "d", "Shift"]) {
      await page.keyboard.up(key);
    }
  }

  const maximumTravel = Math.max(
    ...samples.map((position) => distance(start, position)),
  );
  expect(
    maximumTravel,
    `${mode.label} did not move while its controls were exercised`,
  ).toBeGreaterThan(mode.minimumTravel);
}

async function captureFixedSpot(page, quality, spot) {
  const location = await page.evaluate(({ lat, lon }) => {
    const game = window.game;
    const target = game.fromLL(lat, lon);
    const road = game.nearestRoad(target.x, target.z);
    game.teleport("car", road.x, road.z, road.h);
    return { x: road.x, z: road.z };
  }, spot);

  expect(Number.isFinite(location.x) && Number.isFinite(location.z)).toBe(true);
  await expect(page.locator("#hudmode")).toContainText("CAR");
  await page.waitForTimeout(4_000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${quality}-${spot.name}.png`),
    fullPage: true,
  });
}

test("runs every travel mode and captures fixed locations", async ({
  page,
}, testInfo) => {
  const quality = testInfo.project.name;
  const runtimeErrors = installRuntimeErrorCapture(page);

  await mkdir(SCREENSHOT_DIR, { recursive: true });
  await page.goto(`/?q=${quality}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.game?.ready && window.__aw,
    undefined,
    { timeout: 120_000 },
  );
  await expect(page.locator("#loading")).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => window.game.real.q.name))
    .toBe(quality);
  assertNoRuntimeErrors(runtimeErrors);

  for (const mode of MODES) {
    await test.step(`exercise ${mode.label} for 30 seconds`, async () => {
      await exerciseMode(page, mode);
      assertNoRuntimeErrors(runtimeErrors);
    });
  }

  for (const spot of SPOTS) {
    await test.step(`capture ${spot.name}`, async () => {
      await captureFixedSpot(page, quality, spot);
      assertNoRuntimeErrors(runtimeErrors);
    });
  }

  assertNoRuntimeErrors(runtimeErrors);
});
