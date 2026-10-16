import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";

// Same corner, same speed, stock handling then fan suction.
const SPEED = 22;
const CORNER_STEPS = 36; // 1.2 s at the game's fixed 30 Hz step
const STRAIGHT_STEPS = 24;

const SEEDS = [
  [12.5014, -70.012],
  [12.535, -70.02],
  [12.55, -70.04],
  [12.509, -69.968],
  [12.57, -70.03],
  [12.48, -69.95],
  [12.52, -70.03],
  [12.6, -70.05],
];

function radiusOf(chord, heading) {
  const s = Math.sin(heading / 2);
  return s < 1e-3 ? Infinity : chord / (2 * s);
}

test("fan suction takes the same corner harder without flipping", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "low", "The corner comparison runs on LOW only");
  test.setTimeout(4 * 60 * 1000);

  await page.goto("/?q=low", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.game?.ready && window.__aw && window.__awFan === true,
    undefined,
    { timeout: 120_000 },
  );
  await expect(page.locator("#loading")).toBeHidden();

  const report = await page.evaluate(
    async ({ speed, cornerSteps, straightSteps, seeds }) => {
      const game = window.game;
      const wrap = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

      const freeze = () => {
        window.__stepN = 0;
      };

      const settle = () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });

      async function run(mode, fan, pose, steps, steer) {
        freeze();
        await settle();
        window.__awFan = fan;
        game.held.left = false;
        game.held.right = false;
        game.held.gas = false;
        game.held.brake = false;
        game.teleport("car", pose.x, pose.z, pose.h, {
          s: speed,
          st: steer,
          snap: true,
        });
        if (mode === "moto") game.setMode("moto");
        const car = game.S.car;
        const ground = game.groundAt(pose.x, pose.z);
        car.s = speed;
        car.st = steer;
        car.drift = 0;
        car.roll = 0;
        car.pitch = 0;
        car.lean = 0;
        if (Number.isFinite(ground)) car.y = ground;
        game.held.right = steer > 0;
        const h0 = car.h;
        const x0 = car.x;
        const z0 = car.z;
        const y0 = car.y;
        let minS = speed;
        let maxRoll = 0;
        let maxPitch = 0;
        let maxLean = 0;
        let maxRise = 0;
        window.__stepN = steps;
        await new Promise((resolve) => {
          const watch = () => {
            const current = game.S.car;
            minS = Math.min(minS, current.s);
            maxRoll = Math.max(maxRoll, Math.abs(current.roll || 0));
            maxPitch = Math.max(maxPitch, Math.abs(current.pitch || 0));
            maxLean = Math.max(maxLean, Math.abs(current.lean || 0));
            maxRise = Math.max(maxRise, (current.y || 0) - y0);
            current.s = speed;
            current.st = steer;
            if (window.__stepN === 0) resolve();
            else requestAnimationFrame(watch);
          };
          requestAnimationFrame(watch);
        });
        game.held.right = false;
        const current = game.S.car;
        const heading = Math.abs(wrap(current.h - h0));
        const chord = Math.hypot(current.x - x0, current.z - z0);
        return {
          heading,
          chord,
          minS,
          maxRoll,
          maxPitch,
          maxLean,
          maxRise,
          endY: current.y,
        };
      }

      freeze();
      const rows = [];
      const rejected = [];
      for (const mode of ["car", "moto"]) {
        let chosen = null;
        for (const [lat, lon] of seeds) {
          const point = game.fromLL(lat, lon);
          const road = game.nearestRoad(point.x, point.z);
          if (!road) continue;
          for (let turn = 0; turn < 4 && !chosen; turn++) {
            const pose = {
              x: road.x,
              z: road.z,
              h: road.h + turn * (Math.PI / 2),
            };
            const stock = await run(mode, false, pose, cornerSteps, 1);
            const fan = await run(mode, true, pose, cornerSteps, 1);
            const clear = stock.minS > speed * 0.45 && fan.minS > speed * 0.45;
            if (!clear) {
              rejected.push({ mode, lat, lon, turn, stockMin: stock.minS, fanMin: fan.minS });
              continue;
            }
            const straightStock = await run(mode, false, pose, straightSteps, 0);
            const straightFan = await run(mode, true, pose, straightSteps, 0);
            chosen = {
              mode,
              lat,
              lon,
              heading: road.h + turn * (Math.PI / 2),
              speed,
              stock,
              fan,
              straightStock,
              straightFan,
            };
          }
          if (chosen) break;
        }
        if (!chosen) {
          return { error: `no clear corner for ${mode}`, rejected };
        }
        rows.push(chosen);
      }
      freeze();
      window.__awFan = true;
      game.held.right = false;
      return { rows };
    },
    {
      speed: SPEED,
      cornerSteps: CORNER_STEPS,
      straightSteps: STRAIGHT_STEPS,
      seeds: SEEDS,
    },
  );

  expect(report.error, JSON.stringify(report.rejected || report, null, 2)).toBeUndefined();

  const summary = report.rows.map((row) => {
    const stockRadius = radiusOf(row.stock.chord, row.stock.heading);
    const fanRadius = radiusOf(row.fan.chord, row.fan.heading);
    return {
      mode: row.mode,
      lat: row.lat,
      lon: row.lon,
      speed: row.speed,
      stockHeading: row.stock.heading,
      fanHeading: row.fan.heading,
      stockRadius,
      fanRadius,
      stockRoll: row.stock.maxRoll,
      fanRoll: row.fan.maxRoll,
      stockPitch: row.stock.maxPitch,
      fanPitch: row.fan.maxPitch,
      stockRise: row.straightStock.maxRise,
      fanRise: row.straightFan.maxRise,
      stockLean: row.stock.maxLean,
      fanLean: row.fan.maxLean,
    };
  });
  console.log(`fan corner comparison @ ${SPEED} m/s\n${JSON.stringify(summary, null, 2)}`);
  await writeFile(
    testInfo.outputPath("fan-corner.json"),
    JSON.stringify(summary, null, 2),
  );

  for (const row of summary) {
    expect(row.fanHeading, `${row.mode} fan heading`).toBeGreaterThan(row.stockHeading * 1.7);
    expect(row.fanRadius, `${row.mode} fan radius`).toBeLessThan(row.stockRadius * 0.7);
    expect(row.fanRoll, `${row.mode} fan roll`).toBeLessThan(0.2);
    expect(row.fanPitch, `${row.mode} fan pitch`).toBeLessThan(0.35);
    expect(row.fanRise, `${row.mode} rise over the straight`).toBeLessThan(row.stockRise + 0.35);
    if (row.mode === "moto") {
      expect(row.fanLean, "motorcycle lean").toBeLessThanOrEqual(row.stockLean + 0.12);
    }
  }
});
