// Numeric checks for scuba buoyancy, air, and the reef-fish school. No browser.
// Run: node --experimental-strip-types addons/scuba/selftest.ts
import { createDive, stepDive, AIR_SECONDS } from "../src/scuba/dive.ts";
import { createSchool, stepSchool } from "../src/scuba/boids.ts";

let failed = 0;
const check = (name: string, ok: boolean, info: string) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${info}`);
  if (!ok) failed++;
};

{
  const s = createDive(-6);
  const y0 = s.y;
  for (let t = 0; t < 4; t += 1 / 30) stepDive(s, 1 / 30, 0, 0);
  check("buoyancy rises from depth", s.y > y0 + 1, `y ${y0.toFixed(2)} -> ${s.y.toFixed(2)}`);
  check("air was used underwater", s.air < AIR_SECONDS - 2, `air ${s.air.toFixed(1)} s`);
  check("air never goes negative", s.air >= 0, `${s.air}`);
}
{
  const s = createDive(-8);
  s.air = 0;
  for (let t = 0; t < 3; t += 1 / 30) stepDive(s, 1 / 30, 0, 0);
  check("empty tank sinks", s.y < -8 && s.air === 0, `y=${s.y.toFixed(2)} air=${s.air.toFixed(2)}`);
}
{
  const s = createDive(-0.1);
  s.air = 20;
  for (let t = 0; t < 2; t += 1 / 30) stepDive(s, 1 / 30, 0, 0);
  check("surface refills air", s.air > 20 && s.y > -0.3, `y=${s.y.toFixed(2)} air=${s.air.toFixed(1)}`);
}
{
  const s = createDive(-4);
  for (let t = 0; t < 2; t += 1 / 30) stepDive(s, 1 / 30, 1, 0);
  const climbed = s.y;
  const s2 = createDive(-4);
  for (let t = 0; t < 2; t += 1 / 30) stepDive(s2, 1 / 30, 0, 1);
  check("up climbs and down sinks", climbed > -4 && s2.y < climbed, `up ${climbed.toFixed(2)} down ${s2.y.toFixed(2)}`);
}
{
  const school = createSchool(16, 0, -4, 0, 12);
  const sameX = school.x;
  let minY = -100;
  let far = 0;
  let speed = 0;
  for (let t = 0; t < 8; t += 1 / 30) stepSchool(school, 1 / 30);
  for (let i = 0; i < school.n; i++) {
    minY = Math.max(minY, school.y[i]);
    far = Math.max(far, Math.hypot(school.x[i], school.y[i] + 4, school.z[i]));
    speed += Math.hypot(school.vx[i], school.vy[i], school.vz[i]);
  }
  check("school stays pooled (same arrays)", school.x === sameX, "");
  check("fish stay under the surface", minY <= -0.6, `highest y=${minY.toFixed(2)}`);
  check("fish stay on the reef", far <= 12.01, `farthest ${far.toFixed(2)} m`);
  check("fish keep swimming", speed / school.n > 0.2, `mean speed ${(speed / school.n).toFixed(2)}`);
}

console.log(failed ? `${failed} check(s) failed` : "all scuba checks passed");
if (failed) process.exit(1);
