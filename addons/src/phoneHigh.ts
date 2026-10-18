// Phone HIGH (Galaxy S24+ class): a middle profile between perfFixes' phone profile and LOW.
// Measured at 412x915 @2.625 (perfFixes' 1.5 DPR), Oranjestad spawn: phone HIGH drew
// ~703-740 draws / 1.83M tris / 46-48k scene objects a frame vs LOW's 458 / 0.63M / 6.3k.
// The biggest costs were building-batch walls (377k tris), trees (184k), parked cars (157k),
// building kit (114k), trim (106k) and a 612k-tri shadow pass. Visibility ranges are live-read
// by A (and by bldBatch / vegetation each update), so this only re-tunes numbers, after
// perfFixes and before anything has streamed far. It stays clearly above LOW: 2048 shadows
// with HIGH's soft radius, bloom/grade, 2x MSAA, 1.6x LOW's tree range and 2x its streets.
// Touch devices on HIGH only (same detection as perfFixes, ?perfmobile=1 forces it).
// "Desktop Quality" (q.id desktop) is untouched. Off with ?phonehigh=0.
import type { AGame } from "./env";
import { params } from "./env";

type Q = Record<string, unknown> & { name: string; id?: string };
type Sun = { shadow: { camera: { left: number; right: number; top: number; bottom: number; updateProjectionMatrix(): void } } };

// LOW: radius 900, bldR 550, roadR 380, kitR 50, parkR 110, contactR 150, detailR 180,
//      veg3d 110, shrubR 160, impR 800, lod [250, 600], shadowR 45
// perfFixes phone HIGH: radius/bldR 1400, roadR 900, kitR 100, parkR 250, contactR 300, detailR 500,
//      A's HIGH veg3d 260, shrubR 380, impR 1900, lod [380, 1000], shadowR 85
export const PHONE_HIGH = {
  radius: 1100, bldR: 1100, roadR: 650, kitR: 70, parkR: 160, contactR: 200, detailR: 300,
  veg3d: 175, shrubR: 240, impR: 1300, lod: [300, 760], shadowR: 62,
};

export class PhoneHigh {
  on = false;
  stats = { on: false, changes: "" };
  constructor(g: AGame) {
    const real = g.real as unknown as { q?: Q; sky?: { sun?: Sun } } | null;
    const q = real?.q;
    if (!q || q.name !== "high" || q.id === "desktop") return;
    const pm = params.get("perfmobile");
    const touch = pm === "1" ? true : pm === "0" ? false : matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (!touch) return;
    const before = Object.fromEntries(Object.keys(PHONE_HIGH).map((k) => [k, q[k]]));
    Object.assign(q, PHONE_HIGH, { lod: PHONE_HIGH.lod.slice() });
    // A sizes the sun's ortho shadow box once from shadowR; its update() snaps with the live value
    const cam = real?.sky?.sun?.shadow.camera;
    if (cam) { const r = PHONE_HIGH.shadowR; Object.assign(cam, { left: -r, right: r, top: r, bottom: -r }); cam.updateProjectionMatrix(); }
    this.on = this.stats.on = true;
    this.stats.changes = Object.keys(PHONE_HIGH).map((k) => `${k} ${JSON.stringify(before[k])}->${JSON.stringify((PHONE_HIGH as Record<string, unknown>)[k])}`).join(", ");
  }
}
