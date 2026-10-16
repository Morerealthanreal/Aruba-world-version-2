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
  test.setTimeout(8 * 60 * 1000);
  const errors = installRuntimeErrorCapture(page);

  // emerg=force turns every traffic car into an emergency model, and crash
  // selection skips those, so a crash never starts. Leave traffic mixed.
  await page.goto("/?q=low&crash=force&crashx=10", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game?.ready && window.__aw?.audio, undefined, { timeout: 120_000 });
  await expect(page.locator("#loading")).toBeHidden();
  // The car button is already in the document. SwiftShader can sit in a long
  // frame right after load, and a 15s click expires before that frame returns.
  page.setDefaultTimeout(90_000);
  await page.locator('#modes button[data-mode="car"]').click({ force: true });
  await page.locator("#c").click({ force: true });

  await page.waitForFunction(() => window.__aw.audio.stats.started, undefined, { timeout: 15_000 });
  const armed = await page.evaluate(() => ({
    voices: window.__aw.audio.stats.trafficVoices,
    nodes: window.__aw.audio.stats.nodes,
  }));
  expect(armed.voices).toBe(0);
  expect(armed.nodes).toBeGreaterThan(0);

  // The scripted crash can start on a road whose midpoint is outside the
  // impact's audible range. Park the listener on that midpoint while the
  // cars are still approaching. On LOW there are only three traffic cars,
  // so this first scene is the only one worth hearing; leaving it (>700 m)
  // means a second scene often never starts.
  await page.evaluate(() => {
    const park = () => {
      const crash = window.__aw.crash.stats;
      if (crash.active && crash.phase === 0 && (crash.x || crash.z)) {
        window.game.teleport("car", crash.x, crash.z, 0);
        window.game.S.snapCam = 30;
        window.__freeCam = [crash.x, 14, crash.z, crash.x, 14, crash.z + 4];
      }
      window.__awCrashWatch = requestAnimationFrame(park);
    };
    park();
  });
  try {
    await page.waitForFunction(() => window.__aw.audio.stats.impacts >= 1, undefined, { timeout: 90_000 });
  } catch (error) {
    const snap = await page.evaluate(() => {
      const cam = window.game.camera.position;
      const crash = window.__aw.crash.stats;
      return {
        audio: window.__aw.audio.stats,
        crash,
        hear: Math.hypot(crash.x - cam.x, crash.z - cam.z),
      };
    });
    throw new Error(`${error.message} ${JSON.stringify(snap)}`);
  }
  await page.waitForFunction(() => window.__aw.crash.stats.active, undefined, { timeout: 15_000 });
  await page.evaluate(() => {
    const stats = window.__aw.crash.stats;
    delete window.__freeCam;
    window.game.teleport("car", stats.x, stats.z, 0);
    window.game.S.snapCam = 8;
  });
  // Police and the forensics van are scripted, and sim time is capped at 50ms
  // per frame. A slow SwiftShader frame makes their arrival take longer on
  // the wall clock; the vehicles themselves are unchanged.
  await page.waitForFunction(() => window.__aw.audio.stats.police > 0.008, undefined, { timeout: 90_000 });
  await page.waitForFunction(() => window.__aw.crash.stats.fs, undefined, { timeout: 150_000 });

  const atScene = await page.evaluate(() => ({
    audio: window.__aw.audio.stats,
    crash: window.__aw.crash.stats,
  }));
  expect(atScene.audio.trafficVoices).toBe(0);
  expect(atScene.audio.police).toBeGreaterThan(0);
  expect(atScene.audio.police).toBeLessThan(0.05);
  expect(atScene.crash.fs).toBe(true);

  // A car parked on a vertex or against a facade bounces (speed *= -0.25)
  // and never reaches the 10 m/s upshift. Aim down the longest clear
  // on-land corridor around the loaded road, then hold the throttle.
  const launch = await page.evaluate(() => {
    const game = window.game;
    const here = game.S.car;
    const road = game.nearestRoad(here.x, here.z);
    let best = { clear: -1, x: road.x, z: road.z, h: road.h };
    const open = (x, z) => game.onLand(x, z) && !game.blocked(x, z);
    for (let ring = 0; ring <= 18; ring += 3) {
      const steps = ring === 0 ? 1 : 12;
      for (let s = 0; s < steps; s++) {
        const ang = (s / steps) * Math.PI * 2;
        const x = road.x + Math.sin(ang) * ring;
        const z = road.z + Math.cos(ang) * ring;
        if (!open(x, z)) continue;
        for (let k = 0; k < 24; k++) {
          const h = road.h + (k * Math.PI) / 12;
          let clear = 0;
          for (let d = 2; d <= 36; d += 2) {
            const px = x - Math.sin(h) * d;
            const pz = z - Math.cos(h) * d;
            if (!open(px, pz)) break;
            clear = d;
          }
          if (clear > best.clear) best = { clear, x, z, h };
          if (clear >= 24) {
            game.teleport("car", best.x, best.z, best.h);
            game.S.car.s = 0;
            return best;
          }
        }
      }
    }
    game.teleport("car", best.x, best.z, best.h);
    game.S.car.s = 0;
    return best;
  });
  await page.keyboard.down("w");
  try {
    await page.waitForFunction(() => {
      const stats = window.__aw.audio.stats;
      return stats.throttle > 0.8 && stats.rpm > 2500 && stats.level > 0.02 && stats.level <= 0.26;
    }, undefined, { timeout: 60_000 });
  } catch (error) {
    const snap = await page.evaluate(() => window.__aw.audio.stats);
    throw new Error(`${error.message} ${JSON.stringify(snap)}`);
  }
  // SwiftShader often never reaches the 10 m/s upshift before the next hitch.
  // Hold the published car speed above that threshold for a few frames so the
  // live gearbox (not just the offline synth check) has to change gear.
  await page.evaluate(() => {
    const audio = window.__aw.audio;
    const orig = audio.update.bind(audio);
    audio.update = function () {
      const car = window.game.S.car;
      if (Math.abs(car.s || 0) < 18) car.s = 18;
      return orig();
    };
    window.__awRestoreAudio = () => { audio.update = orig; };
  });
  try {
    await page.waitForFunction(() => window.__aw.audio.stats.gear >= 2, undefined, { timeout: 10_000 });
  } catch {
    // Reported by the gear assertion below.
  }
  const driven = await page.evaluate((from) => {
    const car = window.game.S.car;
    return {
      ...window.__aw.audio.stats,
      speed: Math.abs(car.s || 0),
      moved: Math.hypot(car.x - from.x, car.z - from.z),
      clear: from.clear,
    };
  }, launch);
  await page.evaluate(() => window.__awRestoreAudio && window.__awRestoreAudio());
  await page.keyboard.up("w");
  expect(driven.trafficVoices).toBe(0);
  expect(driven.mode).toBe("car");
  expect(driven.rpm, JSON.stringify(driven)).toBeGreaterThan(1800);
  expect(driven.gear, JSON.stringify(driven)).toBeGreaterThanOrEqual(2);
  expect(driven.level).toBeGreaterThan(0.02);
  expect(driven.level).toBeLessThanOrEqual(0.26);

  await page.locator('#modes button[data-mode="moto"]').click({ force: true });
  await page.evaluate(() => { if (window.game.S.mode !== "moto") window.game.setMode("moto"); });
  await page.waitForFunction(() => window.__aw.audio.stats.mode === "moto", undefined, { timeout: 10_000 });
  await page.keyboard.down("w");
  try {
    await page.waitForFunction(() => {
      const stats = window.__aw.audio.stats;
      return stats.mode === "moto" && stats.rpm > 2000 && stats.level > 0.02 && stats.level <= 0.24;
    }, undefined, { timeout: 30_000 });
  } catch (error) {
    const snap = await page.evaluate(() => window.__aw.audio.stats);
    throw new Error(`${error.message} ${JSON.stringify(snap)}`);
  }
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
    game.S.snapCam = 8;
  });
  await page.waitForFunction(() => window.__aw.audio.stats.mode === "plane", undefined, { timeout: 10_000 });
  await page.keyboard.down("t");
  await page.waitForFunction(() => window.__aw.audio.stats.turbo > 0.35, undefined, { timeout: 20_000 });
  const roaring = await page.evaluate(() => window.__aw.audio.stats.turbo);
  expect(roaring).toBeLessThanOrEqual(1);
  await page.waitForTimeout(700);
  await page.keyboard.up("t");
  // A hold past 350 ms is momentary. A shorter timestamp gap latches on, and
  // one more press switches that off. The roar then follows the turbo level down.
  const latched = await page.evaluate(() => !!document.querySelector("button.awturbo")?.classList.contains("lit"));
  if (latched) await page.keyboard.press("t");
  try {
    await page.waitForFunction(() => window.__aw.audio.stats.turbo < 0.12, undefined, { timeout: 45_000 });
  } catch (error) {
    const snap = await page.evaluate(() => ({
      turbo: window.__awTurbo,
      lvl: window.__awTurboLvl,
      stats: window.__aw.audio.stats,
      lit: !!document.querySelector("button.awturbo")?.classList.contains("lit"),
    }));
    throw new Error(`${error.message} ${JSON.stringify(snap)}`);
  }

  expect(errors, errors.join("\n\n")).toEqual([]);
});
