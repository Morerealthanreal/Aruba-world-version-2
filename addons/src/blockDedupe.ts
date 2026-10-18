// Streaming memory (task 3): A's region build hands every building footprint to
// `real.onBuildings`, which copies it into a global 40 m collision hash (`__blocked`).
// Nothing ever removes them, so each time a region streams back in, all of its
// footprints are added again: the hash and the JS heap grow every lap (~2.5 MB per
// island loop on LOW) and `__blocked` checks get slower over a session.
// Keep the first copy of each footprint (collision of an unloaded region still works,
// as before) and skip repeats. Off with ?blockdedupe=0.
import type { AGame } from "./env";
import { params } from "./env";

type Footprint = { p?: number[][] };
type Real = { onBuildings?: (list: Footprint[]) => void };

export function attachBlockDedupe(g: AGame) {
  if (params.get("blockdedupe") === "0") return null;
  const real = g.real as unknown as Real | null;
  const orig = real && real.onBuildings;
  if (!real || typeof orig !== "function") return null;
  const seen = new Set<string>();
  const stats = { added: 0, skipped: 0 };
  const key = (p: number[][]) => {
    const a = p[0], b = p[p.length >> 1], c = p[p.length - 1];
    return `${p.length}|${a[0].toFixed(2)},${a[1].toFixed(2)}|${b[0].toFixed(2)},${b[1].toFixed(2)}|${c[0].toFixed(2)},${c[1].toFixed(2)}`;
  };
  real.onBuildings = (list: Footprint[]) => {
    const fresh: Footprint[] = [];
    for (const t of list) {
      if (!t || !t.p || t.p.length < 3) continue;
      const k = key(t.p);
      if (seen.has(k)) { stats.skipped++; continue; }
      seen.add(k); fresh.push(t); stats.added++;
    }
    if (fresh.length) orig.call(real, fresh);
  };
  return stats;
}
