import { params } from "./env";

/** Legacy sn_mural_atlas panels re-painted on OSM in newer SAC batches (skip when batch is on). */
const RELOCATED: Record<string, string[]> = {
  snsacside: ["lionfish", "mujer_azul"],
  snsacclassics: ["pelican", "turtles", "alice"],
  snsacbatch7: ["flamingos", "iguana", "prikichi", "night_watcher", "melting_pot"],
  snsacbatch8: ["boss", "nothing_to_declare"],
};

export function muralsRelocatedToSacBatches(): Set<string> {
  const skip = new Set<string>();
  for (const [key, ids] of Object.entries(RELOCATED)) {
    if (params.get(key) === "0") continue;
    for (const id of ids) skip.add(id);
  }
  return skip;
}
