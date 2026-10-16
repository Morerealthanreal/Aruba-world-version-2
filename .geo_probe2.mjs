import { chromium } from "@playwright/test";

const ROUTE = [
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
  { name: "noord", lat: 12.5681, lon: -70.0336 },
  { name: "california", lat: 12.6132, lon: -70.0514 },
  { name: "hooiberg", lat: 12.5167, lon: -69.9958 },
  { name: "san-nicolas", lat: 12.4362, lon: -69.9105 },
  { name: "baby-beach", lat: 12.4173, lon: -69.8818 },
];
const STOP_MS = Number(process.env.SOAK_STOP_MS || 7000);

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
  const geos = new Map();
  const texs = new Map();
  window.__geoTrack = geos;
  window.__texTrack = texs;
  const patched = new Set();
  const noteGeo = (geo) => {
    if (!geo || !geo.isBufferGeometry || geos.has(geo)) return;
    geos.set(geo, { geo, uuid: geo.uuid, disposed: false, name: "", parent: "", born: performance.now() });
  };
  const noteTex = (tex) => {
    if (!tex || !tex.isTexture || texs.has(tex)) return;
    const img = tex.image;
    texs.set(tex, {
      tex,
      uuid: tex.uuid,
      disposed: false,
      name: tex.name || "",
      w: img?.width || 0,
      h: img?.height || 0,
      ctor: tex.constructor?.name || "",
      born: performance.now(),
    });
  };
  const patchChain = (obj, kind) => {
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto !== Object.prototype) {
      if (!patched.has(proto) && Object.prototype.hasOwnProperty.call(proto, "addEventListener")) {
        patched.add(proto);
        const origAdd = proto.addEventListener;
        proto.addEventListener = function (type, fn, opts) {
          if (type === "dispose") {
            if (this.isBufferGeometry) noteGeo(this);
            else if (this.isTexture) noteTex(this);
          }
          return origAdd.call(this, type, fn, opts);
        };
      }
      if (!proto.__awDisp && Object.prototype.hasOwnProperty.call(proto, "dispose") && typeof proto.dispose === "function") {
        proto.__awDisp = true;
        const origDisp = proto.dispose;
        proto.dispose = function () {
          const rec = (this.isBufferGeometry ? geos : texs).get(this);
          if (rec) rec.disposed = true;
          return origDisp.call(this);
        };
      }
      proto = Object.getPrototypeOf(proto);
    }
  };
  game.scene.traverse((o) => {
    if (o.geometry) patchChain(o.geometry, "g");
    const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
    for (const m of mats) {
      if (!m) continue;
      for (const k of Object.keys(m)) {
        const v = m[k];
        if (v && v.isTexture) patchChain(v, "t");
      }
    }
  });
  const stamp = () => {
    game.scene.traverse((o) => {
      const g = o.geometry;
      if (g && g.isBufferGeometry) {
        g.userData.lastName = o.name || o.type;
        g.userData.lastParent = o.parent?.name || o.parent?.type || "";
      }
    });
  };
  setInterval(stamp, 500);
  window.__label = () => {
    const seenG = new Set();
    const seenT = new Set();
    const users = new Map();
    game.scene.traverse((o) => {
      const g = o.geometry;
      if (g && g.isBufferGeometry) {
        seenG.add(g);
        const rec = geos.get(g);
        if (rec) {
          rec.name = o.name || o.type;
          rec.parent = o.parent?.name || o.parent?.type || "";
          rec.inScene = true;
        }
      }
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of mats) {
        if (!m) continue;
        for (const k of Object.keys(m)) {
          const v = m[k];
          if (v && v.isTexture) {
            seenT.add(v);
            const rec = texs.get(v);
            if (rec && !rec.user) rec.user = `${o.name || o.type}.${k}`;
          }
        }
      }
    });
    for (const rec of geos.values()) rec.inScene = seenG.has(rec.geo);
    for (const rec of texs.values()) rec.inScene = seenT.has(rec.tex);
  };
});

async function driveLeg(stop, leg) {
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
  const distance = await page.evaluate(({ x, z }) => {
    const car = window.game.S.car;
    return Math.hypot(car.x - x, car.z - z);
  }, start);
  await page.evaluate(({ x, z, h }) => window.game.teleport("car", x, z, h), start);
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.__label());
  return distance;
}

let seenG = [];
let seenT = [];
for (let cycle = 0; cycle < 5; cycle++) {
  const dists = [];
  for (let leg = 0; leg < ROUTE.length; leg++) dists.push(Math.round(await driveLeg(ROUTE[leg], leg)));
  const brief = await page.evaluate(({ seenG, seenT }) => {
    const game = window.game;
    const gGroups = new Map();
    const tGroups = new Map();
    let gFresh = 0;
    let tFresh = 0;
    const orphanNow = new Map();
    let orphanN = 0;
    let liveN = 0;
    for (const rec of window.__geoTrack.values()) {
      if (rec.disposed) continue;
      if (rec.inScene) { liveN++; continue; }
      orphanN++;
      const key = `${rec.geo.userData.lastParent || rec.parent || "-"}/${rec.geo.userData.lastName || rec.name || "?"}`;
      orphanNow.set(key, (orphanNow.get(key) || 0) + 1);
    }
    for (const rec of window.__geoTrack.values()) {
      if (seenG.includes(rec.uuid)) continue;
      gFresh++;
      const state = rec.disposed ? "disposed" : rec.inScene ? "live" : "orphan";
      const key = `${state}\t${rec.geo.userData.lastParent || rec.parent || "-"}/${rec.geo.userData.lastName || rec.name || "?"}`;
      gGroups.set(key, (gGroups.get(key) || 0) + 1);
    }
    for (const rec of window.__texTrack.values()) {
      if (seenT.includes(rec.uuid)) continue;
      tFresh++;
      const key = `${rec.disposed ? "disposed" : rec.inScene ? "live" : "orphan"}\t${rec.ctor} ${rec.w}x${rec.h} ${rec.name || rec.user || "?"}`;
      tGroups.set(key, (tGroups.get(key) || 0) + 1);
    }
    const liveNew = new Map();
    for (const [k, n] of gGroups) if (k.startsWith("live")) liveNew.set(k, n);
    const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
    const sceneN = new Set();
    game.scene.traverse((o) => { if (o.geometry) sceneN.add(o.geometry.uuid); });
    return {
      geo: game.renderer.info.memory.geometries,
      scene: sceneN.size,
      orphanN,
      liveN,
      orphanTop: [...orphanNow.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      tex: game.renderer.info.memory.textures,
      gFresh,
      tFresh,
      gTop: top(liveNew),
      tTop: top(tGroups),
      gUuids: [...window.__geoTrack.values()].map((r) => r.uuid),
      tUuids: [...window.__texTrack.values()].map((r) => r.uuid),
    };
  }, { seenG, seenT });
  seenG = brief.gUuids;
  seenT = brief.tUuids;
  console.log(`\nCYCLE ${cycle} geo ${brief.geo} scene ${brief.scene} orphan ${brief.orphanN} liveTracked ${brief.liveN} tex ${brief.tex} newG ${brief.gFresh} newT ${brief.tFresh} dist ${dists.join(",")}`);
  console.log("ORPHANS", brief.orphanTop.map(([k, n]) => `${n} ${k}`).join(" | "));
  const liveNew = brief.gTop.filter(([k]) => k.startsWith("live"));
  console.log("NEW LIVE", liveNew.map(([k, n]) => `${n} ${k}`).join(" | ") || "(none)");
}

await browser.close();
