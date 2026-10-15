import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const STOP_MS = Number(process.env.SOAK_STOP_MS || 7_000);
const MEASURE_CYCLES = Number(process.env.SOAK_MEASURE_CYCLES || 3);
const HEAP_GROWTH_LIMIT = Number(process.env.SOAK_HEAP_GROWTH_MB || 24) * 1024 * 1024;
const GEOMETRY_GROWTH_LIMIT = Number(process.env.SOAK_GEOMETRY_GROWTH || 12);
const TEXTURE_GROWTH_LIMIT = Number(process.env.SOAK_TEXTURE_GROWTH || 4);

// A full-island loop forces streamed regions to unload and then rebuild when the
// route repeats. The first loop warms caches; the following loops must stay flat.
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
    return { x: road.x, z: road.z };
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
  return Math.hypot(finish.x - start.x, finish.z - start.z);
}

async function sampleResources(page, cdp, cycle, stop) {
  await cdp.send("HeapProfiler.collectGarbage");
  return page.evaluate(
    ({ cycle: sampleCycle, stop: sampleStop }) => {
      const game = window.game;
      const memory = game.renderer.info.memory;
      return {
        cycle: sampleCycle,
        stop: sampleStop,
        time: performance.now(),
        heap: performance.memory?.usedJSHeapSize ?? null,
        geometries: memory.geometries,
        textures: memory.textures,
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
  test.setTimeout(6 * 60 * 1000);

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
    for (let cycle = 0; cycle <= MEASURE_CYCLES; cycle++) {
      for (let leg = 0; leg < ROUTE.length; leg++) {
        const stop = ROUTE[leg];
        distances.push(await driveLeg(page, stop, leg));
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
      JSON.stringify({ route: ROUTE, stopMs: STOP_MS, samples }, null, 2),
    );
  }

  expect(
    Math.max(...distances),
    "Automatic controls did not move the car",
  ).toBeGreaterThan(0.1);
  expect(samples.every((sample) => Number.isFinite(sample.heap))).toBe(true);

  const first = 1;
  const last = MEASURE_CYCLES;
  const heapGrowth =
    cycleMedian(samples, last, "heap") - cycleMedian(samples, first, "heap");
  const geometryGrowth =
    cycleMedian(samples, last, "geometries") -
    cycleMedian(samples, first, "geometries");
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
    "renderer.info.memory.geometries kept growing",
  ).toBeLessThanOrEqual(GEOMETRY_GROWTH_LIMIT);
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
