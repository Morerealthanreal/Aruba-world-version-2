// Numeric self-test for the save blob. No browser.
// Run: node --experimental-strip-types save/selftest.ts
import { decodeSave, encodeSave } from "../src/save/codec.ts";
import type { SaveState } from "../src/save/types.ts";

let failed = 0;
function check(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
  if (!ok) failed++;
}

const state: SaveState = {
  version: 1,
  position: { x: -7600.5, y: 7.25, z: -300.5 },
  vehicle: "car",
  timeOfDay: 0.625,
  quality: "low",
  volume: 0.4,
  invertY: true,
};

{
  const back = decodeSave(encodeSave(state));
  check("round trip keeps position, vehicle and time", !!back
    && back!.position.x === state.position.x
    && back!.position.y === state.position.y
    && back!.position.z === state.position.z
    && back!.vehicle === "car"
    && back!.timeOfDay === 0.625
    && back!.quality === "low"
    && back!.volume === 0.4
    && back!.invertY === true, JSON.stringify(back));
}

check("a newer schema is ignored", decodeSave(encodeSave({ ...state, version: 2 })) === null, "not null");
check("a blob without a position is ignored", decodeSave('{"version":1,"vehicle":"walk","timeOfDay":0.2}') === null, "not null");
check("volume is clamped", decodeSave(encodeSave({ ...state, volume: 4 }))!.volume === 1, "uncamped");

if (failed) {
  console.log(`\n${failed} FAILED`);
  process.exit(1);
}
console.log("\nALL PASS");
