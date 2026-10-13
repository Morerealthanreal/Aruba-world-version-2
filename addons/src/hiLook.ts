// Round 9: HIGH-only visual upgrades on the confirmed-smooth M1 Pro baseline. LOW/MED untouched.
// OPT-IN with ?hilook=1 (default off since 21:30 Oct 12: HIGH lag report); single items ?hlwater=0, ?hlveg=0.
//  - water normal map anisotropy 4 -> 16 (sharp ripples at grazing angles, ~free)
//  - 3D tree radius (veg3d) 260 -> 340 m: real palms/kadushi instead of impostors further down the road
import type { AGame } from "./env";
import { params } from "./env";

export class HiLook {
  on = false; stats = { water: false, veg3d: 0 };
  constructor(g: AGame) {
    const A = g.real as unknown as { q?: { name: string; veg3d: number }; water?: { nrm?: { anisotropy: number; needsUpdate: boolean } } } | null;
    if (!A || !A.q || A.q.name !== "high") return;
    this.on = true;
    const n = A.water?.nrm;
    if (n && params.get("hlwater") !== "0") { n.anisotropy = 16; n.needsUpdate = true; this.stats.water = true; }
    if (params.get("hlveg") !== "0") A.q.veg3d = 340;
    this.stats.veg3d = A.q.veg3d;
  }
}
