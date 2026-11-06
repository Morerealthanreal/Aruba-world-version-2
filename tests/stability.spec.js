import { expect, test } from "@playwright/test";
import {
  installFrameProbe,
  startRun,
  finishRun,
  DRIVE_WAYPOINTS,
  FLIGHT_WAYPOINTS,
} from "./helpers/stability.js";

test.describe("engine stability and streaming", () => {
  test("drive along fixed route without frame spikes or disappearing objects", async ({
    page,
  }, testInfo) => {
    test.setTimeout(5 * 60 * 1000);

    const failures = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        failures.push(`console.error: ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      failures.push(`uncaught exception: ${err.stack || err.message}`);
    });

    await installFrameProbe(page);

    const quality = testInfo.project.name || "low";
    await page.goto(`/?q=${quality}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => window.game?.ready && window.__aw?.stability,
      undefined,
      { timeout: 180_000 },
    );

    // Wait for initial load and settle
    await page.waitForTimeout(4000);

    // Drive a fixed route through Oranjestad, Eagle Beach, Palm Beach, Noord, California
    const runInfo = await startRun(page, {
      mode: "car",
      waypoints: DRIVE_WAYPOINTS,
      speed: 25,
    });
    expect(runInfo.points, "Route has waypoints").toBeGreaterThan(5);

    // Run for up to 45 seconds along the route
    const summary = await finishRun(page, 45_000);

    // 1. Verify player moved along the route
    expect(summary.distance, "Car traveled along the route").toBeGreaterThan(10);

    // 2. Verify no runtime crashes or console errors
    expect(failures, `Console or runtime errors:\n${failures.join("\n")}`).toEqual([]);

    // 3. Verify no objects/regions disappeared within player view distance after being built
    expect(
      summary.visibleLoss,
      `Built regions prematurely unloaded within player radius: ${JSON.stringify(summary.visibleLoss)}`,
    ).toEqual([]);

    // 4. Verify no late pop-in into unbuilt regions
    expect(
      summary.lateEnter,
      `Player entered unbuilt regions: ${JSON.stringify(summary.lateEnter)}`,
    ).toEqual([]);

    // 5. Verify camera near plane was maintained for depth precision
    const cameraNear = await page.evaluate(() => window.game.camera.near);
    expect(cameraNear, "Camera near plane tuned for vehicle depth precision").toBeGreaterThanOrEqual(0.7);
  });

  test("flight loop maintains streaming and depth precision", async ({
    page,
  }, testInfo) => {
    test.setTimeout(5 * 60 * 1000);

    const failures = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        failures.push(`console.error: ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      failures.push(`uncaught exception: ${err.stack || err.message}`);
    });

    await installFrameProbe(page);

    const quality = testInfo.project.name || "low";
    await page.goto(`/?q=${quality}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => window.game?.ready && window.__aw?.stability,
      undefined,
      { timeout: 180_000 },
    );

    await page.waitForTimeout(4000);

    // Fly at 80 m/s at 160m altitude
    const runInfo = await startRun(page, {
      mode: "plane",
      waypoints: FLIGHT_WAYPOINTS.slice(0, 4),
      speed: 80,
      alt: 160,
    });
    expect(runInfo.points, "Flight route points").toBeGreaterThan(2);

    const summary = await finishRun(page, 35_000);

    expect(summary.distance, "Plane traveled along route").toBeGreaterThan(10);
    expect(failures, `Console or runtime errors:\n${failures.join("\n")}`).toEqual([]);
    expect(
      summary.visibleLoss,
      `Built regions prematurely unloaded during flight: ${JSON.stringify(summary.visibleLoss)}`,
    ).toEqual([]);

    const planeNear = await page.evaluate(() => window.game.camera.near);
    expect(planeNear, "Plane near plane tuned for aerial depth precision").toBeGreaterThanOrEqual(1.8);
  });
});
