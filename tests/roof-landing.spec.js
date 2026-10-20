import { expect, test } from "@playwright/test";

// Known buildings across Oranjestad and Palm Beach covering:
// - Hero GLB landmarks (Renaissance Mall)
// - Buildings with walk-in ground-floor Interiors (The Pastechi House, Radisson Blu)
// - Procedural OSM buildings with pitched and flat roofs (Cosecha Building, Church Of God)
const KNOWN_BUILDINGS = [
  {
    name: "Renaissance Mall",
    x: -7394.59,
    z: 73.48,
    minHeightAboveGround: 6.0,
    walkSteps: 12,
  },
  {
    name: "Cosecha Building",
    x: -7256.0,
    z: 97.7,
    minHeightAboveGround: 6.0,
    walkSteps: 10,
  },
  {
    name: "The Pastechi House",
    x: -7087.55,
    z: 24.62,
    minHeightAboveGround: 3.0,
    walkSteps: 8,
  },
  {
    name: "Church Of God",
    x: -6899.6,
    z: 150.6,
    minHeightAboveGround: 6.0,
    walkSteps: 10,
  },
  {
    name: "Radisson Blu Aruba",
    x: -7830.95,
    z: -6156.4,
    minHeightAboveGround: 25.0,
    walkSteps: 10,
  },
];

test("switching from plane to on-foot above buildings lands on walkable roofs", async ({
  page,
}, testInfo) => {
  test.setTimeout(4 * 60 * 1000);
  const quality = testInfo.project.name;
  const errors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    errors.push(`uncaught exception: ${err.stack || err.message}`);
  });

  // Skip software-rasterizing full frames during physics verification so HIGH on
  // SwiftShader does not spend its timeout inside post-processing shader compiles.
  await page.addInitScript(() => {
    window.__noRender = true;
  });

  await page.goto(`/?q=${quality}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.game?.ready && window.__aw?.roofland,
    undefined,
    { timeout: 120_000 },
  );
  await expect(page.locator("#loading")).toBeHidden();

  for (const bld of KNOWN_BUILDINGS) {
    await test.step(`land and walk on roof of ${bld.name}`, async () => {
      const result = await page.evaluate(async (target) => {
        const game = window.game;
        const rl = window.__aw.roofland;
        const prevNoRender = window.__noRender;
        window.__noRender = true;

        const stepFrames = (n) =>
          new Promise((resolve) => {
            window.__stepN = n;
            const tick = () => {
              if (window.__stepN === 0) resolve();
              else requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });

        try {
          // 1. Position plane directly above the building.
          game.teleport("plane", target.x, target.z, 0, {
            y: 180,
            p: 0,
            r: 0,
            s: 45,
            thr: 0.5,
          });
          // Re-pin exact (x, z) right before switching to on-foot.
          game.S.plane.x = target.x;
          game.S.plane.z = target.z;
          game.S.plane.y = 180;

          // 2. Switch from plane to on-foot (walk).
          game.setMode("walk");

          // Let physics step several frames to ensure gravity & collision settle on the roof.
          await stepFrames(15);

          const walkAfterLand = {
            x: game.S.walk.x,
            y: game.S.walk.y,
            z: game.S.walk.z,
            g: game.S.walk.g,
            walkerY: game.walker ? game.walker.position.y : null,
          };

          // Measure raw terrain elevation underneath the building (with inWalkStep=false).
          const terrainY = game.real.heightAt(target.x, target.z);
          const expectedRoofY = rl.roofHeightAt(target.x, target.z, Infinity);

          // 3. Walk across the roof to verify solid, walkable collision (not falling through or shoved off).
          game.joy.y = -1;
          await stepFrames(target.walkSteps);
          game.joy.y = 0;

          const walkAfterStep = {
            x: game.S.walk.x,
            y: game.S.walk.y,
            z: game.S.walk.z,
            g: game.S.walk.g,
          };

          return {
            mode: game.S.mode,
            terrainY,
            expectedRoofY,
            walkAfterLand,
            walkAfterStep,
            shoveDistOnLand: Math.hypot(
              walkAfterLand.x - target.x,
              walkAfterLand.z - target.z,
            ),
            travelDistOnRoof: Math.hypot(
              walkAfterStep.x - walkAfterLand.x,
              walkAfterStep.z - walkAfterLand.z,
            ),
          };
        } finally {
          game.joy.y = 0;
          window.__stepN = undefined;
          window.__noRender = prevNoRender;
        }
      }, bld);

      expect(result.mode).toBe("walk");
      expect(result.expectedRoofY).not.toBeNull();

      // Player must not be shoved horizontally off the building when landing.
      expect(
        result.shoveDistOnLand,
        `${bld.name}: player was shoved off the roof footprint on landing`,
      ).toBeLessThan(0.5);

      // Player Y must sit on the roof, well above ground/interior floor, never inside or underneath.
      expect(
        result.walkAfterLand.y,
        `${bld.name}: player landed too low (y=${result.walkAfterLand.y}, terrain=${result.terrainY})`,
      ).toBeGreaterThanOrEqual(result.terrainY + bld.minHeightAboveGround);
      expect(
        Math.abs(result.walkAfterLand.y - result.expectedRoofY),
        `${bld.name}: player Y (${result.walkAfterLand.y}) did not match roof Y (${result.expectedRoofY})`,
      ).toBeLessThan(0.6);
      if (result.walkAfterLand.walkerY !== null) {
        expect(
          Math.abs(result.walkAfterLand.walkerY - result.walkAfterLand.y),
        ).toBeLessThan(0.1);
      }

      // Walking on the roof must move horizontally while staying supported on the roof.
      expect(
        result.travelDistOnRoof,
        `${bld.name}: player could not walk across the roof`,
      ).toBeGreaterThan(0.2);
      expect(
        result.walkAfterStep.y,
        `${bld.name}: player fell through the roof while walking (y=${result.walkAfterStep.y}, terrain=${result.terrainY})`,
      ).toBeGreaterThanOrEqual(result.terrainY + bld.minHeightAboveGround - 0.5);
    });
  }

  expect(
    errors,
    `The roof landing test emitted browser errors:\n${errors.join("\n\n")}`,
  ).toEqual([]);
});
