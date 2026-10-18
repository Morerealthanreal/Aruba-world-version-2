// Numeric self-test for the flight model. No browser, no GPU.
// Run: node --experimental-strip-types flight/selftest.ts
import { Plane } from "../src/flight/Plane.ts";
import type { FlightInput } from "../src/flight/types.ts";

const flat = () => 0;
const DT = 1 / 60;
const DEG = 180 / Math.PI;
const G = 9.81;

function input(partial: Partial<FlightInput>): FlightInput {
  return { throttle: 0, elevator: 0, aileron: 0, rudder: 0, gear: false, ...partial };
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

let failed = 0;
function check(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
  if (!ok) failed++;
}

// Takeoff roll at full throttle. Rolling resistance stays well under thrust.
{
  const plane = new Plane();
  const startZ = plane.position.z;
  let liftoff = 0;
  let airborne = false;
  for (let t = 0; t < 50 && !airborne; t += DT) {
    const rotate = plane.speed > 32;
    plane.update(DT, input({ throttle: 1, elevator: rotate ? 0.85 : 0 }), flat);
    if (!plane.isOnGround && plane.position.y > 1.4 && plane.speed > 26) {
      airborne = true;
      liftoff = plane.position.z - startZ;
    }
  }
  check("takeoff roll under 900 m", airborne && liftoff > 40 && liftoff < 900, `${airborne ? liftoff.toFixed(0) : "never"} m at ${plane.speed.toFixed(1)} m/s`);
}

// Hold 10° of pitch. The plane should settle into a climb, not a sink.
{
  const plane = new Plane();
  plane.prime(50, 400);
  const samples: { pitch: number; vy: number; y: number; speed: number; bank: number }[] = [];
  let prevY = plane.position.y;
  for (let t = 0; t < 22; t += DT) {
    const elevator = clamp((10 / DEG - plane.pitch) * 3.2, -1, 1);
    const aileron = clamp(-plane.bank * 2.2, -1, 1);
    plane.update(DT, input({ throttle: 1, elevator, aileron }), flat);
    const vy = (plane.position.y - prevY) / DT;
    prevY = plane.position.y;
    if (t > 14) samples.push({ pitch: plane.pitch * DEG, vy, y: plane.position.y, speed: plane.speed, bank: plane.bank * DEG });
  }
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const pitch = mean(samples.map((s) => s.pitch));
  const vy = mean(samples.map((s) => s.vy));
  const speed = mean(samples.map((s) => s.speed));
  const bank = mean(samples.map((s) => Math.abs(s.bank)));
  const climb = samples[samples.length - 1].y - samples[0].y;
  check("steady climb holds about 10 deg pitch", pitch > 8 && pitch < 12.5, `${pitch.toFixed(1)} deg`);
  check("steady climb gains altitude", vy > 3 && climb > 20, `${vy.toFixed(1)} m/s, ${climb.toFixed(0)} m over the sample`);
  check("climb stays above stall and wings level", speed > 32 && bank < 6, `${speed.toFixed(1)} m/s, bank ${bank.toFixed(1)} deg`);
}

// 30° bank. The horizontal path should curve with the tilted lift.
{
  const plane = new Plane();
  plane.prime(50, 500);
  const pts: { x: number; z: number; v: number; bank: number }[] = [];
  let prevY = plane.position.y;
  for (let t = 0; t < 28; t += DT) {
    const bankTarget = 30 / DEG;
    const aileron = clamp((bankTarget - plane.bank) * 2.4, -1, 1);
    const elevator = clamp((4 / DEG - plane.pitch) * 2.4 + (500 - plane.position.y) * 0.004, -1, 1);
    plane.update(DT, input({ throttle: 0.85, elevator, aileron }), flat);
    prevY = plane.position.y;
    if (t > 12) pts.push({ x: plane.position.x, z: plane.position.z, v: plane.speed, bank: plane.bank });
  }
  let path = 0;
  let heading0 = 0;
  let heading1 = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dz = pts[i].z - pts[i - 1].z;
    path += Math.hypot(dx, dz);
    const h = Math.atan2(dx, dz);
    if (i === 1) heading0 = h;
    heading1 = h;
  }
  const turned = Math.abs(Math.atan2(Math.sin(heading1 - heading0), Math.cos(heading1 - heading0)));
  const meanV = pts.reduce((a, p) => a + p.v, 0) / pts.length;
  const meanBank = pts.reduce((a, p) => a + p.bank, 0) / pts.length;
  const radius = turned > 0.05 ? path / turned : Infinity;
  const expect = (meanV * meanV) / (G * Math.tan(Math.abs(meanBank)));
  const ratio = radius / expect;
  check("bank holds near 30 deg", meanBank * DEG > 25 && meanBank * DEG < 36, `${(meanBank * DEG).toFixed(1)} deg`);
  check("turn radius matches 30 deg of bank", Number.isFinite(radius) && ratio > 0.55 && ratio < 1.6, `${radius.toFixed(0)} m vs ${expect.toFixed(0)} m (${ratio.toFixed(2)}x) at ${meanV.toFixed(0)} m/s`);
  check("gear mesh is built and shown", plane.gearVisible && plane.gearGroup.children.length === 3, `${plane.gearGroup.children.length} legs, visible ${plane.gearVisible}`);
}

console.log(failed === 0 ? "\nALL PASS" : `\n${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
