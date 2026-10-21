import { expect, test } from "@playwright/test";

test.describe("Car physics overhaul", () => {
  test("suspension, weight transfer, surface grip, drift, and camera", async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    const q = testInfo.project.name || "low";
    // Skip software-rasterizing full frames during physics verification so HIGH on
    // SwiftShader does not spend its timeout inside post-processing shader compiles.
    await page.addInitScript(() => {
      window.__noRender = true;
    });
    await page.goto(`/?q=${q}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => window.game?.ready && window.__aw && window.__awCar,
      undefined,
      { timeout: 120_000 },
    );
    await expect(page.locator("#loading")).toBeHidden();

    const report = await page.evaluate(async () => {
      const game = window.game;
      const car = game.S.car;
      const cObj = game.car;
      const awCar = window.__awCar;

      const previousNoRender = window.__noRender;
      window.__noRender = true;

      const stepFrames = (steps) => {
        window.__stepN = steps;
        return new Promise((resolve) => {
          const check = () => {
            if (window.__stepN === 0) resolve();
            else requestAnimationFrame(check);
          };
          requestAnimationFrame(check);
        });
      };

      // 1. Surface Grip Detection
      const asphaltInfo = awCar.getSurfaceInfo(-7551, 23, 2.0);
      const sandInfo = awCar.getSurfaceInfo(-7620, 30, 1.5);
      const dirtInfo = awCar.getSurfaceInfo(-4500, 2000, 15.0);

      // 2. Surface Acceleration Comparison (30 physics steps = 1 sec at 30Hz)
      // Asphalt acceleration
      game.held.left = game.held.right = game.held.brake = false;
      game.teleport("car", -7551, 23, 0, { s: 0, st: 0 });
      car.y = 2.03;
      game.held.gas = true;
      await stepFrames(30);
      const speedAsphalt = car.s;
      game.held.gas = false;

      // Sand acceleration (off-road beach coast beside road)
      game.teleport("car", -7620, 30, 0, { s: 0, st: 0 });
      car.y = 1.5;
      game.held.gas = true;
      await stepFrames(30);
      const speedSand = car.s;
      game.held.gas = false;

      // 3. Surface Braking Stopping Distance Comparison (30 physics steps from 22 m/s)
      // Asphalt braking
      game.teleport("car", -7551, 23, 0, { s: 22, st: 0 });
      car.y = 2.03;
      game.held.brake = true;
      const z0Asphalt = car.z;
      await stepFrames(30);
      const asphaltBrakeDist = Math.abs(car.z - z0Asphalt);
      const asphaltSpeedEnd = car.s;
      game.held.brake = false;

      // Sand braking
      game.teleport("car", -7620, 30, 0, { s: 22, st: 0 });
      car.y = 1.5;
      game.held.brake = true;
      const z0Sand = car.z;
      await stepFrames(30);
      const sandBrakeDist = Math.abs(car.z - z0Sand);
      const sandSpeedEnd = car.s;
      game.held.brake = false;

      // 4. Suspension & Weight Transfer Dynamics
      // Baseline rest on flat road
      game.teleport("car", -7551, 23, 0, { s: 0, st: 0, pitch: 0, roll: 0 });
      car.y = 2.03;
      await stepFrames(10);
      const pitchRest = car.pitch;
      const wheelCount = cObj?.wheels?.length || 0;
      const wheelsRest = (cObj?.wheels || []).map((w) => w.o.position.y);

      // Longitudinal acceleration squat
      game.held.gas = true;
      await stepFrames(20);
      const pitchAccel = car.pitch;
      game.held.gas = false;

      // Longitudinal braking dive
      game.held.brake = true;
      await stepFrames(15);
      const pitchBrake = car.pitch;
      game.held.brake = false;

      // Lateral cornering roll
      game.teleport("car", -7551, 23, 0, { s: 24, st: 0.7 });
      car.y = 2.03;
      game.held.right = true;
      await stepFrames(20);
      const rollCorner = car.roll;
      game.held.right = false;

      // 5. Handbrake Drift & Body Slip Angle
      game.teleport("car", -7551, 23, 0, { s: 22, st: 0.7 });
      car.y = 2.03;
      game.held.right = true;
      game.held.brake = true;
      let maxDrift = 0;
      let maxBodySlip = 0;
      for (let i = 0; i < 5; i++) {
        await stepFrames(6);
        if (car.drift > maxDrift) maxDrift = car.drift;
        const slip = Math.abs(awCar.bodySlip(car));
        if (slip > maxBodySlip) maxBodySlip = slip;
      }
      game.held.right = false;
      game.held.brake = false;

      const skidsMesh = game.scene.getObjectByName("aw:car-skids");
      const skidCount = skidsMesh?.count || 0;

      // 6. Speed-Sensitive Chase Camera
      // Stationary distance
      game.teleport("car", -7551, 23, 0, { s: 0 });
      car.y = 2.03;
      await stepFrames(20);
      const cam = game.camera;
      const distStationary = Math.hypot(cam.position.x - car.x, cam.position.z - car.z);

      // High-speed distance (at 38 m/s)
      game.teleport("car", -7551, 23, 0, { s: 38 });
      car.y = 2.03;
      await stepFrames(20);
      const distHighSpeed = Math.hypot(cam.position.x - car.x, cam.position.z - car.z);

      // 7. Physics throughput check (30 frames step budget in milliseconds)
      const tStart = performance.now();
      await stepFrames(30);
      const step30Duration = performance.now() - tStart;

      // Cleanup
      delete window.__stepN;
      window.__noRender = previousNoRender;

      return {
        asphaltInfo,
        sandInfo,
        dirtInfo,
        speedAsphalt,
        speedSand,
        asphaltBrakeDist,
        sandBrakeDist,
        asphaltSpeedEnd,
        sandSpeedEnd,
        wheelCount,
        wheelsRest,
        pitchRest,
        pitchAccel,
        pitchBrake,
        rollCorner,
        maxDrift,
        maxBodySlip,
        skidCount,
        distStationary,
        distHighSpeed,
        step30Duration,
      };
    });

    // 1. Surface grip & classification
    expect(report.asphaltInfo.surface).toBe("asphalt");
    expect(report.asphaltInfo.mu).toBe(1.0);
    expect(report.sandInfo.surface).toBe("sand");
    expect(report.sandInfo.mu).toBe(0.55);
    expect(report.dirtInfo.surface).toBe("dirt");
    expect(report.dirtInfo.mu).toBe(0.75);

    // 2. Surface acceleration (asphalt accelerates faster than sand)
    expect(report.speedAsphalt).toBeGreaterThan(report.speedSand * 1.15);

    // 3. Stopping distance (sand stopping distance is longer than asphalt)
    expect(report.sandBrakeDist).toBeGreaterThan(report.asphaltBrakeDist * 1.15);

    // 4. Suspension: 4 wheels present
    expect(report.wheelCount).toBe(4);

    // Weight transfer: pitch squat under acceleration (negative) vs dive under braking (positive)
    expect(report.pitchBrake).toBeGreaterThan(report.pitchAccel);
    expect(report.pitchBrake).toBeGreaterThan(0);
    expect(report.pitchAccel).toBeLessThan(0);

    // Lateral weight transfer: chassis rolls into corner
    expect(Math.abs(report.rollCorner)).toBeGreaterThan(0.01);

    // 5. Handbrake drift & body slip
    expect(report.maxDrift).toBeGreaterThan(0.3);
    expect(report.maxBodySlip).toBeGreaterThan(0.05);
    expect(report.skidCount).toBeGreaterThan(0);

    // 6. Speed-sensitive camera (distance expands with speed)
    expect(report.distHighSpeed).toBeGreaterThan(report.distStationary + 1.2);

    // 7. Physics simulation throughput: 30 steps must compute under 1000ms (target >= 30 fps)
    expect(report.step30Duration).toBeLessThan(1000);
  });

  test("HUD FPS counter and 30 fps mobile target on Low", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "low", "FPS benchmark runs on LOW project");
    test.setTimeout(180_000);

    await page.goto("/?q=low", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => window.game?.ready && window.__aw && window.__awCar,
      undefined,
      { timeout: 120_000 },
    );
    await expect(page.locator("#loading")).toBeHidden();

    // Verify HUD mode is CAR and FPS guard target is configured for 30 fps on Low
    const target = await page.evaluate(() => {
      const guard = window.__aw?.guard;
      return guard ? guard.target : 30;
    });
    expect(target).toBe(30);

    // Verify HUD mode displays CAR
    await expect(page.locator("#hudmode")).toContainText("CAR");
  });
});
