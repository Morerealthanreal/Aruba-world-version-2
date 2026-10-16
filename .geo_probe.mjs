import { chromium } from "@playwright/test";

const ROUTE = [
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
  { name: "noord", lat: 12.5681, lon: -70.0336 },
  { name: "california", lat: 12.6132, lon: -70.0514 },
  { name: "hooiberg", lat: 12.5167, lon: -69.9958 },
  { name: "san-nicolas", lat: 12.4362, lon: -69.9105 },
  { name: "baby-beach", lat: 12.4173, lon: -69.8818 },
];
const STOP_MS = Number(process.env.SOAK_STOP_MS || 2000);
const SETTLE_MS = Number(process.env.SOAK_SETTLE_MS || 800);

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox", "--enable-precise-memory-info"],
});
const page = await browser.newPage({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  hasTouch: true,
  isMobile: true,
});
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8777/?q=low&emerg=force&crash=force&crashx=10", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game?.ready && window.__aw, undefined, { timeout: 120000 });
await page.locator("#loading").waitFor({ state: "hidden" });
await page.locator('#modes button[data-mode="car"]').click({ force: true });

await page.evaluate(() => {
  const game = window.game;
  const tracked = new Map();
  window.__geoTrack = tracked;
  const patched = new Set();
  const note = (geo) => {
    if (!geo || !geo.isBufferGeometry || tracked.has(geo)) return;
    tracked.set(geo, {
      geo,
      uuid: geo.uuid,
      disposed: false,
      name: "",
      parent: "",
      born: performance.now(),
      ctor: geo.constructor?.name || "",
    });
  };
  const patchChain = (obj) => {
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto !== Object.prototype) {
      if (!patched.has(proto) && Object.prototype.hasOwnProperty.call(proto, "addEventListener")) {
        patched.add(proto);
        const origAdd = proto.addEventListener;
        proto.addEventListener = function (type, fn, opts) {
          if (type === "dispose") note(this);
          return origAdd.call(this, type, fn, opts);
        };
      }
      if (!proto.__awDisp && Object.prototype.hasOwnProperty.call(proto, "dispose") && typeof proto.dispose === "function") {
        proto.__awDisp = true;
        const origDisp = proto.dispose;
        proto.dispose = function () {
      const rec = tracked.get(this);
      if (rec) rec.disposed = true;
          return origDisp.call(this);
        };
      }
      proto = Object.getPrototypeOf(proto);
    }
  };
  game.scene.traverse((o) => { if (o.geometry) patchChain(o.geometry); });
  window.__geoPatched = patched.size;
  window.__labelGeos = () => {
    const seen = new Set();
    game.scene.traverse((o) => {
      const g = o.geometry;
      if (!g || !g.isBufferGeometry) return;
      seen.add(g);
      g.userData.lastName = o.name || o.type;
      g.userData.lastParent = o.parent?.name || o.parent?.type || "";
      const rec = tracked.get(g);
      if (rec) {
        rec.name = g.userData.lastName;
        rec.parent = g.userData.lastParent;
        rec.verts = g.attributes?.position?.count || rec.verts;
      }
    });
    for (const rec of tracked.values()) rec.inScene = seen.has(rec.geo);
  };
});

async function driveLeg(stop, leg) {
  await page.evaluate(({ lat, lon }) => {
    const game = window.game;
    const point = game.fromLL(lat, lon);
    const road = game.nearestRoad(point.x, point.z);
    game.teleport("car", road.x, road.z, road.h);
  }, stop);
  await page.keyboard.down("w");
  const steer = leg % 2 ? "a" : "d";
  await page.keyboard.down(steer);
  await page.waitForTimeout(Math.min(450, STOP_MS));
  await page.keyboard.up(steer);
  await page.waitForTimeout(Math.max(0, STOP_MS - 450));
  await page.keyboard.up("w");
  await page.waitForTimeout(SETTLE_MS);
  await page.evaluate(() => window.__labelGeos());
}

async function counts() {
  return page.evaluate(() => {
    const game = window.game;
    const scene = new Set();
    game.scene.traverse((o) => { if (o.geometry) scene.add(o.geometry.uuid); });
    return { geo: game.renderer.info.memory.geometries, scene: scene.size, tex: game.renderer.info.memory.textures, tracked: window.__geoTrack.size, patched: window.__geoPatched };
  });
}

const snaps = [];
let seen = [];
for (let cycle = 0; cycle < 5; cycle++) {
  for (let leg = 0; leg < ROUTE.length; leg++) await driveLeg(ROUTE[leg], leg);
  const c = await counts();
  snaps.push(c);
  const brief = await page.evaluate((seen) => {
    const groups = new Map();
    let fresh = 0;
    for (const rec of window.__geoTrack.values()) {
      if (seen.includes(rec.uuid)) continue;
      fresh++;
      const key = `${rec.parent || "-"}/${rec.name || "?"} ${rec.disposed ? "disposed" : rec.inScene ? "live" : "orphan"}`;
      groups.set(key, (groups.get(key) || 0) + 1);
    }
    const top = [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18);
    const uuids = [];
    for (const rec of window.__geoTrack.values()) uuids.push(rec.uuid);
    return { fresh, top, uuids };
  }, seen);
  seen = brief.uuids;
  console.log("cycle", cycle, JSON.stringify(c), "newGeos", brief.fresh);
  console.log(brief.top.map(([k, n]) => `${n}\t${k}`).join("\n"));
}

const report = await page.evaluate(() => {
  window.__labelGeos();
  const groups = new Map();
  let leaked = 0, live = 0, disposed = 0, unlabeled = 0;
  for (const rec of window.__geoTrack.values()) {
    if (rec.disposed) { disposed++; continue; }
    if (rec.inScene) { live++; continue; }
    leaked++;
    if (!rec.name) unlabeled++;
    const g = rec.geo;
    const attrsObj = g && g.attributes ? g.attributes : {};
    const verts = attrsObj.position?.count || 0;
    const attrs = Object.keys(attrsObj).sort().join(",");
    const key = `${rec.parent} / ${rec.name || "?"} v=${verts} [${attrs}] idx=${g && g.index ? g.index.count : 0}`;
    groups.set(key, (groups.get(key) || 0) + 1);
  }
  const top = [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
  const samples = [];
  for (const rec of window.__geoTrack.values()) {
    if (rec.disposed || rec.inScene || samples.length >= 8) continue;
    const g = rec.geo;
    samples.push({
      name: rec.name,
      parent: rec.parent,
      ctor: rec.ctor,
      verts: g && g.attributes && g.attributes.position ? g.attributes.position.count : 0,
      attrs: g && g.attributes ? Object.keys(g.attributes) : [],
      index: g && g.index ? g.index.count : 0,
      drawRange: g.drawRange,
    });
  }
  return { leaked, live, disposed, unlabeled, tracked: window.__geoTrack.size, top, samples };
});
console.log("REPORT", JSON.stringify(report, null, 2));
console.log("SNAPS", JSON.stringify(snaps));
await browser.close();
