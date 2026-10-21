import { expect, test } from "@playwright/test";

test.describe("Plane flight model", () => {
  test("takeoff, aerodynamic lift, drag, stall dynamics, landing, and mode switching", async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    const q = testInfo.project.name || "low";

    // Bypass software rasterizer during physics integration verification
    await page.addInitScript(() => {
      window.__noRender = true;
    });

    await page.goto(`/?q=${q}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => window.game?.ready && window.__aw?.fly,
      undefined,
      { timeout: 120_000 },
    );
    await expect(page.locator("#loading")).toBeHidden();

    const report = await page.evaluate(async () => {
      const game = window.game;
      const plane = game.S.plane;
      const fly = window.__aw.fly;
      const awFly = window.__awFly;

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

      // 1. Takeoff from Queen Beatrix Airport Runway 11/29
      // Switch to plane while at Queen Beatrix Airport: spawns ready on runway 11/29
      game.teleport("car", -4928, 2055, 1.33);
      game.setMode("plane");
      await stepFrames(10);

      const spawnOnGround = awFly.gnd(plane);
      const spawnSpeed = plane.s;
      const spawnY = plane.y;
      const initialAlt = plane.y - (plane.g || 0);

      // Start takeoff roll: full throttle
      plane.thr = 1.0;
      await stepFrames(40);
      const midRollSpeed = plane.s;
      const midRollGnd = awFly.gnd(plane);
      const midRollPitch = plane.p;

      // Accelerate down the runway to rotate speed (VR = 38 m/s) and pull up on stick
      await stepFrames(140);
      game.held.up = true;
      await stepFrames(45);
      game.held.up = false;

      const postRotateSpeed = plane.s;
      const postRotateGnd = awFly.gnd(plane);
      const postRotateY = plane.y;
      const climbRate = postRotateY - spawnY;
      const postRotatePitch = plane.p;

      // 2. Aerodynamic Cruise & Energy Exchange (Climb vs Dive)
      // Level cruise at 65% throttle at 300m altitude
      plane.x = -5000;
      plane.z = 1000;
      plane.y = 300;
      plane.s = 65;
      plane.thr = 0.65;
      plane.p = 0.02;
      plane.r = 0;
      plane.stalled = false;
      await stepFrames(40);
      const cruiseSpeed = plane.s;

      // Climb trades forward speed for altitude (kinetic to potential energy)
      plane.p = 0.22;
      const y0Climb = plane.y;
      const s0Climb = plane.s;
      await stepFrames(30);
      const climbDeltaY = plane.y - y0Climb;
      const climbDeltaS = plane.s - s0Climb;

      // Dive trades altitude for forward speed (potential to kinetic energy)
      plane.p = -0.22;
      const y0Dive = plane.y;
      const s0Dive = plane.s;
      await stepFrames(30);
      const diveDeltaY = plane.y - y0Dive;
      const diveDeltaS = plane.s - s0Dive;

      // 3. Aerodynamic Stall & Recovery Dynamics
      // Cut throttle to idle in level flight to bleed airspeed into stall
      plane.y = 400;
      plane.s = 32;
      plane.thr = 0.0;
      plane.p = 0.05;
      plane.stalled = false;

      // Step frames until speed drops below stall threshold (V_STALL = 28 m/s)
      await stepFrames(40);
      const stalledStatus = plane.stalled;
      const stallSpeed = plane.s;
      const stallPitch = plane.p;

      // While stalled, measure sink rate
      const y0StallSink = plane.y;
      await stepFrames(20);
      const stallSinkRate = (plane.y - y0StallSink) / (20 / 30); // m/s

      // Stall Recovery: apply full throttle and let nose drop to recover airflow
      plane.thr = 1.0;
      await stepFrames(50);
      const recoveredStatus = plane.stalled;
      const recoveredSpeed = plane.s;

      // 4. Landing Approach & Runway Rollout at Queen Beatrix
      // Position plane on flare for runway 11/29 at 35 m/s, throttle 0.2, 3.2m AGL
      plane.x = -4500;
      plane.z = 2150;
      plane.h = 1.33;
      plane.g = game.groundAt ? (game.groundAt(-4500, 2150) || 5) : 5;
      plane.y = plane.g + 3.2;
      plane.s = 35;
      plane.thr = 0.2;
      plane.p = -0.02;
      plane.stalled = false;

      // Descend through landing cushion and touchdown onto runway
      await stepFrames(50);
      const flareY = plane.y;
      const onRunway = awFly.gnd(plane);

      // Rollout with wheel brakes applied
      plane.thr = 0.0;
      game.held.down = true; // dive key applies wheel brakes on ground
      const s0Brake = plane.s;
      await stepFrames(30);
      const sEndBrake = plane.s;
      game.held.down = false;

      // 5. Smooth Mode Switching
      // Switch from Plane to Car: should snap to nearest road
      game.setMode("car");
      await stepFrames(10);
      const carMode = game.S.mode;
      const car = game.S.car;
      const carOnGround = car.y > 0 && Math.abs(car.y - (game.groundAt ? game.groundAt(car.x, car.z) : car.y)) < 4.0;

      // Switch to Plane above Renaissance Mall roof: (-7551, 23)
      game.teleport("plane", -7551, 23, 0);
      plane.y = 80;
      plane.s = 60;
      plane.thr = 0.65;
      await stepFrames(10);

      // Switch from Plane to Walk above roof: roof landing must keep working
      game.setMode("walk");
      await stepFrames(15);
      const walk = game.S.walk;
      const walkMode = game.S.mode;
      const walkY = walk.y;

      // Cleanup
      delete window.__stepN;
      window.__noRender = previousNoRender;

      return {
        spawnOnGround,
        spawnSpeed,
        initialAlt,
        midRollSpeed,
        midRollGnd,
        midRollPitch,
        postRotateSpeed,
        postRotateGnd,
        climbRate,
        postRotatePitch,
        cruiseSpeed,
        climbDeltaY,
        climbDeltaS,
        diveDeltaY,
        diveDeltaS,
        stalledStatus,
        stallSpeed,
        stallPitch,
        stallSinkRate,
        recoveredStatus,
        recoveredSpeed,
        onRunway,
        s0Brake,
        sEndBrake,
        carMode,
        carOnGround,
        walkMode,
        walkY,
      };
    });

    // 1. Takeoff from Queen Beatrix Airport Runway
    expect(report.spawnOnGround).toBe(true);
    expect(report.spawnSpeed).toBeLessThan(1.0);
    expect(report.initialAlt).toBeLessThan(4.0); // sitting on wheels at ground level
    expect(report.midRollSpeed).toBeGreaterThan(8.0); // accelerating along runway
    expect(report.midRollGnd).toBe(true); // still on ground before rotate
    expect(report.midRollPitch).toBeLessThanOrEqual(0.05); // nose held flat on runway
    expect(report.postRotateSpeed).toBeGreaterThan(35.0); // reached rotate speed
    expect(report.postRotateGnd).toBe(false); // airborne after rotation
    expect(report.climbRate).toBeGreaterThan(5.0); // positive altitude gain
    expect(report.postRotatePitch).toBeGreaterThan(0.05); // nose pitched up into climb

    // 2. Aerodynamic Energy Exchange
    expect(report.cruiseSpeed).toBeGreaterThan(50.0);
    expect(report.climbDeltaY).toBeGreaterThan(5.0); // gained altitude while climbing
    expect(report.climbDeltaS).toBeLessThan(0); // lost airspeed while climbing
    expect(report.diveDeltaY).toBeLessThan(-5.0); // lost altitude while diving
    expect(report.diveDeltaS).toBeGreaterThan(0); // gained airspeed while diving

    // 3. Stall & Recovery Dynamics
    expect(report.stalledStatus).toBe(true); // stall triggered below stall speed
    expect(report.stallSpeed).toBeLessThan(30.0);
    expect(report.stallPitch).toBeLessThan(0); // aerodynamic nose-down pitch moment
    expect(report.stallSinkRate).toBeLessThan(-5.0); // rapid sink rate while stalled
    expect(report.recoveredStatus).toBe(false); // recovered once throttle applied
    expect(report.recoveredSpeed).toBeGreaterThan(32.0); // restored attached airflow

    // 4. Landing & Wheel Braking
    expect(report.onRunway).toBe(true); // settled safely on runway surface
    expect(report.sEndBrake).toBeLessThan(report.s0Brake * 0.75); // wheel brakes decelerated rollout

    // 5. Smooth Mode Switching
    expect(report.carMode).toBe("car");
    expect(report.carOnGround).toBe(true); // car spawned stably on road/ground
    expect(report.walkMode).toBe("walk");
    expect(report.walkY).toBeGreaterThan(8.0); // landed standing on Renaissance Mall roof
  });
});
