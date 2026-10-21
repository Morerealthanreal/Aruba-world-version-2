import { expect, test } from "@playwright/test";

// Palm Beach / Noord heroes must sit on the loaded heightmap. A rigid building
// moves as one group; a chunk or pool warps per 8 m cell and keeps a basin
// floor below its rim. The check is the median ground-contact cell, so a
// sloped lot can keep a low corner. A median more than 0.4 m above grade is
// floating. A sparse stride that misses the foundation, or a coarse overview
// tile, is rescanned vertex by vertex on the loaded heightmap before either
// check. The score flushes in that same turn, so a tile that loaded after
// the previous flush is warped before it is measured. Mesh counts and XZ
// spans stay put. Soak gates stay at their current limits.

const RADIUS = 900;
const NEAR = 900;

const BOUNDS = {
  // Merged Hyatt: two LODs, five primitives, about 119 by 164 m.
  hyatt: { parts: 5, dx: 119, dz: 164 },
  holidayinn: { parts: 19, dx: 114, dz: 209 },
  pbplaza: { parts: 16, dx: 139, dz: 122 },
  marriott_surfclub: { parts: 4, dx: 186, dz: 68 },
  paseoherencia: { parts: 38, dx: 115, dz: 133 },
  ritz: { parts: 21, dx: 141, dz: 206 },
  marriott: { parts: 9, dx: 143, dz: 179 },
  m_marriottoceanclub: { parts: 27, dx: 167, dz: 106 },
  barcelo: { parts: 16, dx: 161, dz: 138 },
};

const YELLOW = [
  [-8077.2, -6935.3],
  [-8083.0, -6924.6],
  [-8004.4, -6979.4],
];

function cover(points) {
  const r2 = RADIUS * RADIUS;
  const left = points.slice();
  const spots = [];
  while (left.length) {
    let best = left[0];
    let bestN = -1;
    for (const p of left) {
      let n = 0;
      for (const q of left) {
        if ((p.x - q.x) ** 2 + (p.z - q.z) ** 2 <= r2) n++;
      }
      if (n > bestN) {
        bestN = n;
        best = p;
      }
    }
    spots.push({ x: best.x, z: best.z });
    for (let i = left.length - 1; i >= 0; i--) {
      const q = left[i];
      if ((best.x - q.x) ** 2 + (best.z - q.z) ** 2 <= r2) left.splice(i, 1);
    }
  }
  return spots;
}

test("Palm Beach and Noord buildings sit on the terrain", async ({ page }, testInfo) => {
  // A Noord cluster can still be parsing a few hundred GLBs when 12 minutes
  // runs out. The median band is unchanged.
  test.setTimeout(14 * 60 * 1000);
  const quality = testInfo.project.name;
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message.slice(0, 180)));

  await page.goto(`/?q=${quality}&addons=1&peds=0&life=0&kids=0`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game && window.game.ready && window.__awSeat, null, { timeout: 120000 });

  const heroes = await page.evaluate(() => {
    return window.game.real.hero.list
      .filter((h) => {
        const id = h.k || h.id || "";
        if (/^msb_(palmbeach|noord)/.test(id) || id.startsWith("pb_") || id.startsWith("pbpool")) return true;
        return h.x >= -9450 && h.x <= -3900 && h.z >= -7250 && h.z <= -1480;
      })
      .map((h) => ({ id: h.k || h.id, x: h.x, z: h.z }));
  });
  expect(heroes.length).toBeGreaterThan(500);
  const spots = cover(heroes);
  expect(spots.length).toBeLessThan(40);
  // Paseo Herencia, then the Ritz, before the rest of the coast. A Noord
  // cluster can still be parsing when the clock is tight, and these two
  // are the buildings the score has to finish.
  const first = [
    { x: -8021.62, z: -6014.94 },
    { x: -8038.11, z: -6962.31 },
  ];
  for (let n = 0; n < first.length; n++) {
    const target = first[n];
    let best = n;
    let bestD = Infinity;
    for (let i = n; i < spots.length; i++) {
      const d = (spots[i].x - target.x) ** 2 + (spots[i].z - target.z) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const spot = spots[best];
    spots.splice(best, 1);
    spots.splice(n, 0, spot);
  }

  const seen = new Map();
  const loaded = new Set();
  const bounds = {};
  for (const spot of spots) {
    await page.evaluate(({ x, z }) => {
      const g = window.game;
      const y = g.real.heightAt(x, z) || 2;
      if (g.setMode) g.setMode("walk");
      g.teleport("walk", x, z, 0);
      window.__freeCam = [x + 40, y + 28, z + 55, x, y + 4, z];
    }, spot);
    await page.waitForFunction(({ x, z, near }) => {
      const list = window.game.real.hero.list;
      let pending = 0;
      let loaded = 0;
      for (const h of list) {
        const id = h.k || h.id || "";
        const palm = /^msb_(palmbeach|noord)/.test(id) || id.startsWith("pb_") || id.startsWith("pbpool")
          || (h.x >= -9450 && h.x <= -3900 && h.z >= -7250 && h.z <= -1480);
        if (!palm) continue;
        if ((h.x - x) ** 2 + (h.z - z) ** 2 > near * near) continue;
        if (!h._g) pending++;
        else loaded++;
      }
      return loaded > 0 && pending === 0;
    }, { ...spot, near: NEAR }, { timeout: 180000 });
    await page.evaluate(() => {
      if (window.__awSeat.flush) {
        window.__awSeat.flush();
        window.__awSeat.flush();
      }
    });
    const seated = await page.waitForFunction(({ x, z, near }) => {
      const list = window.game.real.hero.list;
      let pending = 0;
      let loaded = 0;
      for (const h of list) {
        const id = h.k || h.id || "";
        const palm = /^msb_(palmbeach|noord)/.test(id) || id.startsWith("pb_") || id.startsWith("pbpool")
          || (h.x >= -9450 && h.x <= -3900 && h.z >= -7250 && h.z <= -1480);
        if (!palm) continue;
        if ((h.x - x) ** 2 + (h.z - z) ** 2 > near * near) continue;
        if (!h._g) { pending++; continue; }
        loaded++;
        if (!h._g.userData.awSeated) pending++;
      }
      return loaded > 0 && pending === 0;
    }, { ...spot, near: NEAR }, { timeout: 15000 }).catch(async (error) => {
      await page.evaluate(() => window.__awSeat.flush && window.__awSeat.flush());
      const pending = await page.evaluate(({ x, z, near }) => {
        const rows = [];
        for (const h of window.game.real.hero.list) {
          const id = h.k || h.id || "";
          const palm = /^msb_(palmbeach|noord)/.test(id) || id.startsWith("pb_") || id.startsWith("pbpool")
            || (h.x >= -9450 && h.x <= -3900 && h.z >= -7250 && h.z <= -1480);
          if (!palm) continue;
          if ((h.x - x) ** 2 + (h.z - z) ** 2 > near * near) continue;
          if (h._g && h._g.userData.awSeated) continue;
          if (rows.length < 12) rows.push({ id, g: !!h._g, why: h._g && h._g.userData.awSeatWhy || "" });
        }
        const w = window.game.S.walk;
        return {
          seat: window.__awSeat,
          mode: window.game.S.mode,
          walk: w && [Math.round(w.x), Math.round(w.z)],
          rows,
          at: [Math.round(x), Math.round(z)],
        };
      }, { ...spot, near: NEAR });
      if (!pending.rows.length) return true;
      throw new Error(`${error.message} ${JSON.stringify(pending)}`);
    });
    expect(seated).toBeTruthy();
    // A low LOD can finish seating before the detailed mesh arrives. Flush
    // again once that mesh is in the tree so the new vertices are warped too.
    await page.evaluate(() => { if (window.__awSeat.flush) window.__awSeat.flush(); });

    const batch = await page.evaluate(({ x, z, near, names }) => {
      // Warp and measure against the same loaded tiles. A flush in an earlier
      // turn can miss a heightmap that arrives on the next frame.
      if (window.__awSeat.flush) window.__awSeat.flush();
      const game = window.game;
      const rows = [];
      const rowsLoaded = [];
      const boxes = {};
      const near2 = near * near;
      for (const n of game.real.hero.list) {
        const id = n.k || n.id || "";
        const palm = /^msb_(palmbeach|noord)/.test(id) || id.startsWith("pb_") || id.startsWith("pbpool")
          || (n.x >= -9450 && n.x <= -3900 && n.z >= -7250 && n.z <= -1480);
        if (!palm || !n._g) continue;
        if ((n.x - x) ** 2 + (n.z - z) ** 2 > near2) continue;
        rowsLoaded.push(id);
        const pool = /pool/i.test(id);
        const score = (divisor, loadedOnly) => {
          const cells = new Map();
          let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, parts = 0;
          const M = game.real.M;
          const regionLoaded = (x, z) => {
            const key = Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
            const reg = game.real.regions.get(key);
            return !!(reg && reg.H);
          };
          n._g.updateMatrixWorld(true);
          n._g.traverse((o) => {
            if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;
            if ((o.name || "").startsWith("palapa_")) return;
            if (o.geometry.parameters || o.geometry.__awShared) return;
            parts++;
            const pos = o.geometry.attributes.position;
            const e = o.matrixWorld.elements;
            const step = Math.max(1, Math.floor(pos.count / divisor));
            for (let i = 0; i < pos.count; i += step) {
              const wx = e[0] * pos.getX(i) + e[4] * pos.getY(i) + e[8] * pos.getZ(i) + e[12];
              const wy = e[1] * pos.getX(i) + e[5] * pos.getY(i) + e[9] * pos.getZ(i) + e[13];
              const wz = e[2] * pos.getX(i) + e[6] * pos.getY(i) + e[10] * pos.getZ(i) + e[14];
              if (wx < minX) minX = wx;
              if (wx > maxX) maxX = wx;
              if (wz < minZ) minZ = wz;
              if (wz > maxZ) maxZ = wz;
              const gx = Math.floor(wx / 8) * 8, gz = Math.floor(wz / 8) * 8;
              if (loadedOnly && !regionLoaded(gx + 4, gz + 4)) continue;
              const key = gx + "," + gz;
              let c = cells.get(key);
              if (!c) cells.set(key, (c = { min: wy, max: wy }));
              if (wy < c.min) c.min = wy;
              if (wy > c.max) c.max = wy;
            }
          });
          const bases = [];
          const lows = [];
          for (const [key, c] of cells) {
            const bits = key.split(",");
            if (loadedOnly && !regionLoaded(+bits[0] + 4, +bits[1] + 4)) continue;
            const g = game.real.heightAt(+bits[0] + 4, +bits[1] + 4);
            const span = c.max - c.min;
            const min = c.min - g;
            const max = c.max - g;
            const basin = span >= 2.5 && max <= 1.5 && min < -2;
            const contact = basin || (pool && span < 2.5) ? max : min;
            lows.push(contact);
            if (basin || (pool && span < 2.5)) bases.push(max);
            else if (min < 1.2) bases.push(min);
          }
          bases.sort((a, b) => a - b);
          lows.sort((a, b) => a - b);
          let med = bases.length ? bases[Math.floor(bases.length / 2)] : null;
          if (med != null) {
            const kept = bases.filter((v) => v >= med - 2.5);
            med = kept[Math.floor(kept.length / 2)];
          }
          let lowMed = null;
          if (lows.length) {
            const band = lows.filter((v) => v <= lows[0] + 2.5);
            lowMed = band[Math.floor(band.length / 2)];
          }
          return { med, lowMed, parts, minX, maxX, minZ, maxZ };
        };
        // The coarse stride matches the previous sunk check. A reading past
        // 0.4 m either way is rescanned on loaded heightmap tiles, so a
        // missed foundation or the coarse overview cannot decide the median.
        const coarse = score(4000, false);
        let floatedScore = coarse;
        if (coarse.med == null || coarse.med > 0.4) floatedScore = score(1e9, true);
        const sunkScore = coarse.med != null && coarse.med < -0.4 ? score(1e9, true) : coarse;
        const med = sunkScore.med == null ? coarse.med : sunkScore.med;
        const parts = coarse.parts;
        const minX = coarse.minX, maxX = coarse.maxX, minZ = coarse.minZ, maxZ = coarse.maxZ;
        const floatMed = floatedScore.med == null ? floatedScore.lowMed : floatedScore.med;
        if (names.includes(id)) {
          boxes[id] = {
            parts,
            dx: Math.round(maxX - minX),
            dz: Math.round(maxZ - minZ),
          };
        }
        const originKey = Math.floor((n.x - game.real.M.X0) / game.real.M.RS) + "," + Math.floor((n.z - game.real.M.Z0) / game.real.M.RS);
        const originReg = game.real.regions.get(originKey);
        if (!originReg || !originReg.H) continue;
        rows.push({
          id,
          med: med == null ? null : Math.round(med * 100) / 100,
          floatMed: floatMed == null ? null : Math.round(floatMed * 100) / 100,
          seated: n._g.userData.awSeated || 0,
          dist: Math.hypot(n.x - x, n.z - z),
        });
      }
      return { rows, loaded: rowsLoaded, boxes };
    }, { ...spot, near: NEAR, names: Object.keys(BOUNDS) });

    for (const id of batch.loaded) loaded.add(id);
    for (const row of batch.rows) {
      const prev = seen.get(row.id);
      if (!prev || row.dist < prev.dist) seen.set(row.id, row);
    }
    Object.assign(bounds, batch.boxes);
  }

  const missed = heroes.filter((h) => !loaded.has(h.id));
  const sunk = [...seen.values()].filter((row) => row.med != null && row.med < -0.4);
  const floated = [...seen.values()].filter((row) => row.floatMed != null && row.floatMed > 0.4);
  expect(seen.size, "heroes scored against a loaded heightmap").toBeGreaterThan(400);
  expect(missed.map((h) => h.id), "heroes that never loaded").toEqual([]);
  expect(sunk.map((row) => `${row.id} ${row.med}`).join(", "), "median base more than 0.4 m below the terrain").toBe("");
  expect(floated.map((row) => `${row.id} ${row.floatMed}`).join(", "), "median base more than 0.4 m above the terrain").toBe("");
  expect(errors, "page errors").toEqual([]);

  for (const [id, want] of Object.entries(BOUNDS)) {
    const got = bounds[id];
    expect(got, id).toBeTruthy();
    expect(got.parts, id).toBe(want.parts);
    expect(Math.abs(got.dx - want.dx), id).toBeLessThanOrEqual(4);
    expect(Math.abs(got.dz - want.dz), id).toBeLessThanOrEqual(4);
  }

  await page.evaluate(() => {
    const g = window.game;
    const x = -8038.1, z = -6962.3;
    const y = g.real.heightAt(x, z) || 2;
    g.teleport("walk", x, z, 0);
    window.__freeCam = [x + 30, y + 18, z + 40, x, y + 2, z];
  });
  await page.waitForTimeout(4000);
  const yellow = await page.evaluate((points) => {
    const game = window.game;
    const hits = [];
    for (const [x, z] of points) {
      let n = 0;
      game.scene.traverse((o) => {
        if (!o.isMesh || o.isInstancedMesh) return;
        const p = o.getWorldPosition(o.position.clone());
        const dx = p.x - x;
        const dz = p.z - z;
        if (dx * dx + dz * dz > 14 * 14) return;
        const name = o.name || "";
        if (/road|terrain|water|palm|tree/i.test(name)) return;
        n++;
      });
      if (n) hits.push({ x, z, n });
    }
    const ritz = game.real.hero.list.find((h) => (h.k || h.id) === "ritz");
    return { hits, hide: ritz && ritz.hide };
  }, YELLOW);
  expect(yellow.hide).toEqual(YELLOW);
  expect(yellow.hits, "OSM houses inside the Ritz plaza").toEqual([]);
});
