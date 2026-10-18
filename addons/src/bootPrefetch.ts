// Boot prefetch (off with ?prefetch=0). A's boot fetches in a chain: aruba.json, then a ~1.2 s parse,
// then the region manifest and overview, then ~1.3 s more main-thread work before it asks for the
// ~17 MB of shared terrain / building / tree textures. The network idles during those gaps. The add-on
// bundle loads in parallel with A's at t~0, so it asks for those textures right away at low fetch
// priority (A's own critical requests keep precedence). When A requests them they come from the HTTP
// cache (Surge: max-age=0 + ETag, so a 304 revalidation instead of the full body). Only plain URLs
// that every boot loads regardless of spawn point are listed (no versioned or spawn-dependent files).
// Skipped with Save-Data.
import { params } from "./env";

const TEX = [
  "asphalt", "pavers", "curb", "plaster", "rooftile", "concrete", "palmbark", "bark", "gravel", "rock", "stone",
  "dirt", "sand", "grass", "drygrass", "coral",
];
export const bootPrefetch = { started: 0, done: 0, failed: 0 };

(() => {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (params.get("prefetch") === "0" || params.get("addons") === "0" || nav.connection?.saveData) return;
  const urls: string[] = [];
  for (const t of TEX) urls.push(`./textures/${t}_c.jpg`, `./textures/${t}_n.jpg`, `./textures/${t}_r.jpg`);
  urls.push("./textures/waternormal.png", "./textures/palmfrond_c.png", "./textures/palmfrond_n.jpg", "./textures/canopy_c.png",
    "./textures/shrub_c.png", "./models/bkit.glb", "./models/car.glb");
  const q = params.get("q");
  if (q === "low" || q === "med") urls.push("./textures/sky_1k.hdr");
  for (const u of urls) {
    bootPrefetch.started++;
    fetch(u, { priority: "low", credentials: "same-origin" } as RequestInit)
      .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
      .then(() => { bootPrefetch.done++; }, () => { bootPrefetch.failed++; });
  }
})();
