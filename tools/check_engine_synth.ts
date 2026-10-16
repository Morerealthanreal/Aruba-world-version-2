// Offline check for the player-engine drivetrain and rendered cycles.
// Run: node --experimental-strip-types tools/check_engine_synth.ts
import {
  CAR_DRIVE, MOTO_DRIVE, advanceDrive, cycleLength, renderEngineCycle,
  type DriveState,
} from "../addons/src/engineSynth.ts";

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL", msg);
    process.exitCode = 1;
  }
}

function simulate(spec: typeof CAR_DRIVE, throttle: number, seconds: number, accel: number, cap: number) {
  const d: DriveState = { gear: 0, rpm: spec.idle, shift: 0 };
  let speed = 0;
  let prevRpm = spec.idle;
  let shifts = 0;
  let minDrop = 0;
  const dt = 1 / 60;
  for (let t = 0; t < seconds; t += dt) {
    if (throttle > 0) speed = Math.min(cap, speed + accel * dt);
    else speed = Math.max(0, speed - 12 * dt);
    const before = d.rpm;
    const shifted = advanceDrive(d, speed, throttle, dt, spec, t);
    if (shifted === 1) {
      shifts += 1;
      const drop = d.rpm - before;
      if (drop < minDrop) minDrop = drop;
    }
    prevRpm = d.rpm;
  }
  return { speed, gear: d.gear, rpm: d.rpm, shifts, minDrop, prevRpm };
}

const pull = simulate(CAR_DRIVE, 1, 6, 14, 48);
console.log("car pull", pull);
assert(pull.shifts >= 3, "car should upshift several times in a full-throttle pull");
assert(pull.minDrop < -400, "an upshift should drop rpm (gear-change feel)");
assert(pull.rpm > CAR_DRIVE.idle + 400, "rpm stays above idle while pulling");
assert(pull.rpm <= CAR_DRIVE.red + 1, "rpm stays at or under redline");

const idle = simulate(CAR_DRIVE, 0, 2, 0, 48);
assert(idle.gear === 0 && Math.abs(idle.rpm - CAR_DRIVE.idle) < 80, "stopped car settles to a smooth idle");

const launch = { gear: 0, rpm: CAR_DRIVE.idle, shift: 0 };
advanceDrive(launch, 0.1, 1, 0.2, CAR_DRIVE, 1);
console.log("car launch rpm", launch.rpm);
assert(launch.rpm > CAR_DRIVE.idle + 600, "opening the throttle at a standstill revs the engine");

const bike = simulate(MOTO_DRIVE, 1, 6, 16, 55);
console.log("moto pull", bike);
assert(bike.shifts >= 3, "sportbike should upshift through its gearbox");
assert(bike.rpm > MOTO_DRIVE.idle + 500, "sportbike rpm climbs off idle");
assert(bike.rpm <= MOTO_DRIVE.red + 1, "sportbike rpm stays under redline");

function waveStats(kind: "car" | "moto", bright: boolean) {
  const n = cycleLength(48000, kind);
  const out = new Float32Array(n);
  renderEngineCycle(48000, kind, bright, out);
  let peak = 0, sum = 0, deriv = 0, seam = 0;
  for (let i = 0; i < n; i++) {
    const a = out[i] < 0 ? -out[i] : out[i];
    if (a > peak) peak = a;
    sum += out[i] * out[i];
    if (i) {
      const d = out[i] - out[i - 1];
      deriv += d * d;
    }
  }
  seam = Math.abs(out[0] - out[n - 1]);
  return { peak, rms: Math.sqrt(sum / n), deriv: Math.sqrt(deriv / n), seam, n };
}

for (const kind of ["car", "moto"] as const) {
  const body = waveStats(kind, false);
  const edge = waveStats(kind, true);
  console.log(kind, "body", body, "edge", edge);
  assert(body.peak <= 0.58 && edge.peak <= 0.58, kind + " cycle stays well below full scale");
  assert(body.peak > 0.4 && edge.peak > 0.4, kind + " cycle is not silent");
  assert(body.seam < 0.08 && edge.seam < 0.08, kind + " loop seam is small");
  assert(edge.deriv > body.deriv, kind + " throttle layer is brighter than the idle body");
}

if (process.exitCode) console.error("engine synth check failed");
else console.log("engine synth check ok");
