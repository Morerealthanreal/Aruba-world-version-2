import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const STOP_MS = Number(process.env.SOAK_STOP_MS || 7_000);
const SETTLE_MS = Number(process.env.SOAK_SETTLE_MS || 2_000);
const WARMUP_CYCLES = Number(process.env.SOAK_WARMUP_CYCLES || 3);
const MEASURE_CYCLES = Number(process.env.SOAK_MEASURE_CYCLES || 2);
const TOTAL_CYCLES = WARMUP_CYCLES + MEASURE_CYCLES;
const HEAP_GROWTH_LIMIT = Number(process.env.SOAK_HEAP_GROWTH_MB || 24) * 1024 * 1024;
const GEOMETRY_GROWTH_LIMIT = Number(process.env.SOAK_GEOMETRY_GROWTH || 12);
const TEXTURE_GROWTH_LIMIT = Number(process.env.SOAK_TEXTURE_GROWTH || 4);
const SCENE_GEOMETRY_GROWTH_LIMIT = Number(
  process.env.SOAK_SCENE_GEOMETRY_GROWTH || 100,
);
const SCENE_OBJECT_GROWTH_LIMIT = Number(
  process.env.SOAK_SCENE_OBJECT_GROWTH || 300,
);

// A full-island loop forces streamed regions to unload and then rebuild when the
// route repeats. Three loops let asynchronous model/texture loads settle; measured
// loops after that must stay flat.
const ROUTE = [
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
  { name: "noord", lat: 12.5681, lon: -70.0336 },
  { name: "california", lat: 12.6132, lon: -70.0514 },
  { name: "hooiberg", lat: 12.5167, lon: -69.9958 },
  { name: "san-nicolas", lat: 12.4362, lon: -69.9105 },
  { name: "baby-beach", lat: 12.4173, lon: -69.8818 },
];

test.use({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  hasTouch: true,
  isMobile: true,
});

function captureRuntimeFailures(page) {
  const failures = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      failures.push(`console.error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    failures.push(`uncaught exception: ${error.stack || error.message}`);
  });
  page.on("crash", () => failures.push("page crashed"));
  page.on("close", () => failures.push("page closed unexpectedly"));
  return failures;
}

async function installListenerProbe(page) {
  await page.addInitScript(() => {
    const originalAdd = EventTarget.prototype.addEventListener;
    const originalRemove = EventTarget.prototype.removeEventListener;
    const targets = new WeakMap();
    let active = 0;

    const finalized = new FinalizationRegistry((token) => {
      active -= token.active;
      token.active = 0;
    });
    const captureOf = (options) =>
      typeof options === "boolean" ? options : Boolean(options?.capture);

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (!listener || options?.signal?.aborted) {
        return originalAdd.call(this, type, listener, options);
      }
      const capture = captureOf(options);
      let meta = targets.get(this);
      if (!meta) {
        meta = { records: [], token: { active: 0 } };
        targets.set(this, meta);
        finalized.register(this, meta.token);
      }
      if (
        meta.records.some(
          (record) =>
            record.type === type &&
            record.listener === listener &&
            record.capture === capture,
        )
      ) {
        return;
      }

      const record = { type, listener, capture, wrapped: null, active: true };
      const removeRecord = () => {
        if (!record.active) return;
        record.active = false;
        const index = meta.records.indexOf(record);
        if (index >= 0) meta.records.splice(index, 1);
        meta.token.active--;
        active--;
      };
      record.wrapped = function (event) {
        if (options?.once) removeRecord();
        if (typeof listener === "function") return listener.call(this, event);
        return listener.handleEvent(event);
      };
      meta.records.push(record);
      meta.token.active++;
      active++;
      if (options?.signal) {
        originalAdd.call(options.signal, "abort", removeRecord, { once: true });
      }
      const nativeOptions =
        typeof options === "object" && options
          ? { ...options, once: false }
          : options;
      return originalAdd.call(this, type, record.wrapped, nativeOptions);
    };

    EventTarget.prototype.removeEventListener = function (
      type,
      listener,
      options,
    ) {
      const capture = captureOf(options);
      const meta = targets.get(this);
      const record = meta?.records.find(
        (candidate) =>
          candidate.type === type &&
          candidate.listener === listener &&
          candidate.capture === capture,
      );
      if (!record) return originalRemove.call(this, type, listener, options);
      record.active = false;
      meta.records.splice(meta.records.indexOf(record), 1);
      meta.token.active--;
      active--;
      return originalRemove.call(this, type, record.wrapped, options);
    };

    Object.defineProperty(window, "__awListenerProbe", {
      value: { count: () => active },
      configurable: false,
      writable: false,
    });
  });
}

async function driveLeg(page, stop, leg) {
  const start = await page.evaluate(({ lat, lon }) => {
    const game = window.game;
    const point = game.fromLL(lat, lon);
    const road = game.nearestRoad(point.x, point.z);
    game.teleport("car", road.x, road.z, road.h);
    return { x: road.x, z: road.z, h: road.h };
  }, stop);

  await page.keyboard.down("w");
  const steer = leg % 2 ? "a" : "d";
  await page.keyboard.down(steer);
  await page.waitForTimeout(Math.min(450, STOP_MS));
  await page.keyboard.up(steer);
  await page.waitForTimeout(Math.max(0, STOP_MS - 450));
  await page.keyboard.up("w");

  const finish = await page.evaluate(() => ({
    x: window.game.S.car.x,
    z: window.game.S.car.z,
  }));
  await page.evaluate(
    ({ x, z, h }) => window.game.teleport("car", x, z, h),
    start,
  );
  return Math.hypot(finish.x - start.x, finish.z - start.z);
}

// Renderer.info only counts geometries that have been drawn. Terrain chunks swap in a
// new geometry while the previous copy was never drawn, so the GPU count climbs even
// though the live scene does not. Upload just those chunk meshes, through proxies, so
// a later dispose releases the buffer. Rendering the live scene here kept uploading
// instanced and batched meshes and left their textures in the count.
async function uploadSceneGeometries(page) {
  await page.evaluate(() => {
    const game = window.game;
    let blank = null;
    const meshes = [];
    game.scene.traverse((object) => {
      if (!object.isMesh || object.isInstancedMesh || object.isBatchedMesh || object.isSkinnedMesh) return;
      if (!object.geometry || !/^terrain|^ovTerrain/.test(object.name || "")) return;
      if (!blank && object.material && !Array.isArray(object.material) && object.material.clone) {
        blank = object.material.clone();
        for (const key of [
          "map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap",
          "aoMap", "alphaMap", "bumpMap", "lightMap", "envMap", "specularMap",
        ]) blank[key] = null;
      }
      meshes.push(object);
    });
    const seen = (window.__awUploadedGeos ||= new WeakSet());
    const fresh = meshes.filter((mesh) => mesh.geometry && !seen.has(mesh.geometry));
    if (!blank || !fresh.length) return;
    const scratch = new game.scene.constructor();
    const proxies = [];
    for (const mesh of fresh) {
      seen.add(mesh.geometry);
      const proxy = new mesh.constructor(mesh.geometry, blank);
      proxy.frustumCulled = false;
      proxy.matrixAutoUpdate = false;
      proxy.matrix.copy(mesh.matrixWorld);
      scratch.add(proxy);
      proxy.updateMatrixWorld(true);
      proxies.push(proxy);
    }
    const sceneBefore = game.scene.onBeforeRender;
    const sceneAfter = game.scene.onAfterRender;
    const nop = () => {};
    try {
      game.scene.onBeforeRender = nop;
      game.scene.onAfterRender = nop;
      game.renderer.render(scratch, game.camera);
    } finally {
      game.scene.onBeforeRender = sceneBefore;
      game.scene.onAfterRender = sceneAfter;
      for (const proxy of proxies) {
        proxy.geometry = null;
        proxy.material = null;
        scratch.remove(proxy);
      }
      blank.dispose();
    }
  });
}

async function sampleResources(page, cdp, cycle, stop) {
  await cdp.send("HeapProfiler.collectGarbage");
  return page.evaluate(
    ({ cycle: sampleCycle, stop: sampleStop }) => {
      const game = window.game;
      const memory = game.renderer.info.memory;
      const sceneGeometries = new Set();
      let sceneObjects = 0;
      game.scene.traverse((object) => {
        sceneObjects++;
        if (object.geometry) sceneGeometries.add(object.geometry.uuid);
      });
      return {
        cycle: sampleCycle,
        stop: sampleStop,
        time: performance.now(),
        heap: performance.memory?.usedJSHeapSize ?? null,
        geometries: memory.geometries,
        textures: memory.textures,
        sceneGeometries: sceneGeometries.size,
        sceneObjects,
        listeners: window.__awListenerProbe.count(),
        regions: game.real.regions?.size ?? null,
        contextLost: game.renderer.getContext().isContextLost(),
      };
    },
    { cycle, stop },
  );
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function cycleMedian(samples, cycle, key) {
  return median(
    samples
      .filter((sample) => sample.cycle === cycle)
      .map((sample) => sample[key]),
  );
}

test("long phone drive keeps runtime resources flat", async ({
  page,
  context,
}, testInfo) => {
  test.skip(testInfo.project.name !== "low", "The phone soak runs on LOW only");
  test.setTimeout(10 * 60 * 1000);

  const failures = captureRuntimeFailures(page);
  await installListenerProbe(page);
  const cdp = await context.newCDPSession(page);
  await cdp.send("HeapProfiler.enable");

  // Force the existing test-only emergency/crash modes so repeated route
  // changes also exercise transient scene teardown during this short soak.
  await page.goto("/?q=low&emerg=force&crash=force&crashx=10", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(
    () => window.game?.ready && window.__aw,
    undefined,
    { timeout: 120_000 },
  );
  await expect(page.locator("#loading")).toBeHidden();
  await page.locator('#modes button[data-mode="car"]').click({ force: true });

  const samples = [];
  const distances = [];
  try {
    for (let cycle = 0; cycle < TOTAL_CYCLES; cycle++) {
      for (let leg = 0; leg < ROUTE.length; leg++) {
        const stop = ROUTE[leg];
        distances.push(await driveLeg(page, stop, leg));
        await page.waitForTimeout(SETTLE_MS);
        await uploadSceneGeometries(page);
        const sample = await sampleResources(page, cdp, cycle, stop.name);
        samples.push(sample);
        expect(sample.contextLost, "WebGL context was lost").toBe(false);
        expect(
          failures,
          `Runtime failures during the soak:\n${failures.join("\n\n")}`,
        ).toEqual([]);
      }
    }
  } finally {
    for (const key of ["w", "a", "d"]) await page.keyboard.up(key);
    await writeFile(
      testInfo.outputPath("soak-metrics.json"),
      JSON.stringify(
        {
          route: ROUTE,
          stopMs: STOP_MS,
          settleMs: SETTLE_MS,
          warmupCycles: WARMUP_CYCLES,
          measureCycles: MEASURE_CYCLES,
          samples,
        },
        null,
        2,
      ),
    );
  }

  expect(
    Math.max(...distances),
    "Automatic controls did not move the car",
  ).toBeGreaterThan(0.1);
  expect(samples.every((sample) => Number.isFinite(sample.heap))).toBe(true);

  const first = WARMUP_CYCLES;
  const last = TOTAL_CYCLES - 1;
  const heapGrowth =
    cycleMedian(samples, last, "heap") - cycleMedian(samples, first, "heap");
  const geometryGrowth =
    cycleMedian(samples, last, "geometries") -
    cycleMedian(samples, first, "geometries");
  const sceneGeometryGrowth =
    cycleMedian(samples, last, "sceneGeometries") -
    cycleMedian(samples, first, "sceneGeometries");
  const sceneObjectGrowth =
    cycleMedian(samples, last, "sceneObjects") -
    cycleMedian(samples, first, "sceneObjects");
  const textureGrowth =
    cycleMedian(samples, last, "textures") -
    cycleMedian(samples, first, "textures");
  const firstListeners = Math.max(
    ...samples
      .filter((sample) => sample.cycle === first)
      .map((sample) => sample.listeners),
  );
  const lastListeners = Math.max(
    ...samples
      .filter((sample) => sample.cycle === last)
      .map((sample) => sample.listeners),
  );

  expect(heapGrowth, "Forced-GC JS heap kept growing").toBeLessThanOrEqual(
    HEAP_GROWTH_LIMIT,
  );
  expect(
    geometryGrowth,
    "Renderer geometries grew faster than live scene geometries",
  ).toBeLessThanOrEqual(
    Math.max(0, sceneGeometryGrowth) + GEOMETRY_GROWTH_LIMIT,
  );
  expect(
    sceneGeometryGrowth,
    "Live scene geometries kept growing",
  ).toBeLessThanOrEqual(SCENE_GEOMETRY_GROWTH_LIMIT);
  expect(
    sceneObjectGrowth,
    "Live scene objects kept growing",
  ).toBeLessThanOrEqual(SCENE_OBJECT_GROWTH_LIMIT);
  expect(
    textureGrowth,
    "renderer.info.memory.textures kept growing",
  ).toBeLessThanOrEqual(TEXTURE_GROWTH_LIMIT);
  expect(lastListeners, "Event listener count kept growing").toBeLessThanOrEqual(
    firstListeners,
  );
  expect(
    failures,
    `Runtime failures during the soak:\n${failures.join("\n\n")}`,
  ).toEqual([]);
});
