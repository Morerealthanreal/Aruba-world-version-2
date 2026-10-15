// Sea + beaches pass: Aruba's coast instead of one turquoise everywhere. Shader text only (A's water
// and terrain materials), no new meshes, passes, lights or textures, no per-frame work. Off with ?sea=0;
// ?seaq=low|high forces the LOW or MED/HIGH water path.
//  - coast exposure awW: 0 on the sheltered leeward side (Eagle / Palm Beach, Oranjestad, Baby Beach)
//    .. 1 on the trade-wind north/east coast, from which side of the island's NW-SE axis
//    (California -> Seroe Colorado lighthouse) a point lies. One dot + smoothstep per fragment.
//  - water: pale aqua over white sand -> turquoise -> azure -> deep navy by depth; the windward shelf
//    reads deeper sooner. Breaking-wave foam lines run along the depth contours (parallel to the beach)
//    and travel shoreward, a lapping swash edge, an ENE trade-wind swell in the normals. Windward gets
//    bigger swash, a wider surf zone, choppier normals and (MED/HIGH) whitecaps.
//  - LOW pays no more than A's water did: the foam breakup reuses the ripple normal-map sample
//    instead of A's 12-hash fbm, which covers the swell and exposure maths.
//  - sand: less saturated, brighter coral sand (white Eagle/Palm Beach), a little golden/coarser on the
//    windward coast; seabed loses red light with depth (aqua over sand, darker reef windward). The
//    terrain layer loop is folded (one reciprocal, one pass) so LOW's terrain does not get dearer either.
import type { Material, Mesh, Object3D } from "three";
import type { AGame } from "./env";
import { params } from "./env";
import { chainPatch } from "./nightLights";

type Factory = { material: (...a: unknown[]) => Material };
type Real = {
  q: { name: string };
  terrain?: Factory;
  water?: Factory;
  regions: Map<string, { mat?: Material; wmat?: Material }>;
  ovMat?: Material;
  group: Object3D;
};

// island axis (California Lighthouse -> Seroe Colorado Lighthouse) and its NE normal, in A's world metres
const EXPOSURE = "smoothstep(-500.0, 1200.0, dot(%P% - vec2(-8840.0, -10365.0), vec2(0.7373, -0.6756)))";

const WATER = `
  // aw sea: awW 0 leeward (Eagle/Palm Beach) .. 1 windward north coast
  vec2 awP = vWP.xz;
  float awW = ${EXPOSURE.replace("%P%", "awP")};
  vec3 awN1 = texture(wn, awP / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;
  vec3 awN3 = texture(wn, awP / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;
  // lapping swash: gentle on the leeward beaches, a bigger surge on the windward coast
  float swash = mix(0.06, 0.2, awW) * sin(uTime * mix(0.7, 0.95, awW) + rwN(awP * 0.05) * 6.0);
  float dd = depth + swash;
  if (dd < 0.0) discard;
  float awD = depth * mix(1.0, 2.5, awW);
#ifdef AW_SEA_HQ
  // MED/HIGH: the composer grade is softer than LOW's vivid tonemap, so the same water needs richer tones
  vec3 wc = mix(vec3(0.03, 0.42, 0.46), vec3(0.0, 0.32, 0.46), smoothstep(0.3, 2.5, awD));   // aqua over sand -> turquoise
  wc = mix(wc, vec3(0.0, 0.12, 0.32), smoothstep(2.5, 7.0, awD));                             // azure
  wc = mix(wc, vec3(0.0, 0.028, 0.13), smoothstep(6.0, 18.0, awD));                           // deep navy
#else
  vec3 wc = mix(vec3(0.07, 0.27, 0.27), vec3(0.0, 0.22, 0.30), smoothstep(0.3, 2.5, awD));
  wc = mix(wc, vec3(0.0, 0.10, 0.25), smoothstep(2.5, 7.0, awD));
  wc = mix(wc, vec3(0.0, 0.025, 0.11), smoothstep(6.0, 18.0, awD));
#endif
  float a = 1.0 - exp(-dd * mix(0.4, 0.62, awW));
  a = clamp(a, 0.0, 1.0) * smoothstep(0.0, 0.05, dd);
#ifdef AW_SEA_HQ
  float fn = rwFbm(awP * 0.4 + vec2(uTime * 0.12, 0.0));
#else
  float fn = 0.5 + (awN1.x - awN1.y) * 0.17 + awN3.x * 0.22;   // ~ same spread as A's fbm (mean .5, sd ~.12)
#endif
  // breaking waves: crests follow the depth contours and travel shoreward; a small shore break on the
  // leeward beaches, a wide surf zone on the windward coast
  float awSurf = smoothstep(mix(0.3, 2.8, awW), 0.0, dd);
  float awCr = 0.5 + 0.5 * sin(dd * mix(14.0, 5.0, awW) + uTime * mix(1.1, 1.5, awW) + fn * 3.0);
  float band = awSurf * smoothstep(mix(0.72, 0.55, awW), 1.0, awCr);
  float awEdge = smoothstep(mix(0.05, 0.12, awW), 0.0, dd);
  float foam = clamp((band * 1.4 + awEdge) * smoothstep(mix(0.42, 0.25, awW), mix(0.7, 0.6, awW), fn), 0.0, 1.0) * (1.0 - smoothstep(150.0, 600.0, camD));
#ifdef AW_SEA_HQ
  float awCap = smoothstep(0.74, 0.9, rwN(awP * 0.045 + vec2(-uTime * 0.05, uTime * 0.02))) * smoothstep(0.45, 0.75, fn);
  foam = max(foam, awW * awCap * smoothstep(2.0, 6.0, depth) * 0.75 * (1.0 - smoothstep(250.0, 1400.0, camD)));
#endif
  wc = mix(wc, vec3(0.92), foam);
  a = max(a, foam * 0.95);
  // trade-wind swell from the ENE plus a cross swell (normal tilt only: the sea is one quad per region)
  float awS1 = dot(awP, vec2(-0.93, 0.37)) * 0.11 - uTime * 1.0 + awN3.x * 2.5;   // crests warped by the 120 m ripple sample
  float awS2 = dot(awP, vec2(-0.55, 0.83)) * 0.2 - uTime * 1.35 + awN3.y * 2.5;
  vec2 awSwell = -(vec2(-0.93, 0.37) * cos(awS1) * mix(0.05, 0.14, awW) + vec2(-0.55, 0.83) * cos(awS2) * mix(0.025, 0.06, awW))
    * smoothstep(0.4, 4.0, depth) * (1.0 - smoothstep(200.0, 2500.0, camD) * 0.8);
  // A flattens far normals and calms the shallows, so both mirrored the white horizon haze: damp that
  // sheen over distant deep water, and over the shallows so the sand shows through
  float awSpec = (1.0 - 0.45 * smoothstep(150.0, 1500.0, camD) * smoothstep(4.0, 14.0, awD)) * mix(0.65, 1.0, smoothstep(0.5, 4.0, depth));`;

function patchWater(m: Material, hq: boolean) {
  chainPatch(m, "sea-v1", (s) => {
    const f = s.fragmentShader;
    const i0 = f.indexOf("  // shoreline wash"), endTok = "a = max(a, foam * 0.95);", i1 = f.indexOf(endTok);
    const n1 = "vec3 n1 = texture(wn, p / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;";
    const n3 = "vec3 n3 = texture(wn, p / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;";
    const nw = "vec3 nW = normalize(vec3(g.x, 1.0, g.y));";
    const rf = "float roughnessFactor = mix(0.04, 0.65, foam) + smoothstep(300.0, 4000.0, camD) * 0.08;";
    const sp = "totalSpecular * smoothstep(0.0, 0.15, dd)";
    if (i0 < 0 || i1 < i0 || ![n1, n3, nw, rf, sp].every((t) => f.includes(t))) return; // A changed: keep A's water
    s.fragmentShader = ((hq ? "#define AW_SEA_HQ\n" : "") + f.slice(0, i0) + WATER + f.slice(i1 + endTok.length))
      .replace(n1, "vec3 n1 = awN1;")
      .replace(n3, "vec3 n3 = awN3;")
      .replace(nw, "g = g * mix(1.0, 1.45, awW) + awSwell; " + nw)
      .replace(rf, rf.replace(";", " + 0.05 * awW;"))
      .replace(sp, sp + " * awSpec");
  });
}

function patchTerrain(m: Material) {
  chainPatch(m, "sand-v1", (s) => {
    const f = s.fragmentShader;
    const sat = "const float SAT[8] = float[8](0.55, 0.8, 0.6, 0.9, 0.85, 0.6, 0.5, 0.6);";
    const gain = "const float GAIN[8] = float[8](1.12, 1.0, 1.95, 1.0, 0.8, 1.25, 1.15, 1.15);";
    const loop = "  for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) rwLayer(i, wi, P, tc, tn, tar); }\n" +
      "  float wsum = 0.0; for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) wsum += wi; }";
    const bed = "tc = mix(tc, tc * vec3(0.78, 0.9, 0.88), smoothstep(-0.5, -3.0, vWP.y));";
    const ao = "reflectedLight.indirectSpecular *= tAO;";
    if (![sat, gain, loop, bed, ao].every((t) => f.includes(t))) return;
    s.fragmentShader = f
      .replace(sat, "const float SAT[8] = float[8](0.55, 0.8, 0.5, 0.9, 0.85, 0.6, 0.5, 0.6);")
      .replace(gain, "const float GAIN[8] = float[8](1.12, 1.0, 2.5, 1.0, 0.8, 1.25, 1.15, 1.15);")
      .replace(loop, "  float awIT = 1.0 / max(tot, 1e-4), wsum = 0.0;\n" +
        "  for (int i = 0; i < 8; i++) { float wi = w[i] * awIT; if (wi > 0.02) { rwLayer(i, wi, P, tc, tn, tar); wsum += wi; } }")
      .replace(bed, `float awW = ${EXPOSURE.replace("%P%", "P")}, awSub = smoothstep(-0.2, -2.5, vWP.y);
  tc *= mix(vec3(1.0), vec3(0.96, 0.9, 0.8), awW * w[2] * awIT * (1.0 - awSub));   // windward: coarser, golden coral sand
  tc *= exp(min(vWP.y, 0.0) * vec3(0.9, 0.16, 0.11)) * (1.0 - 0.3 * awW * awSub);   // seabed: red absorbed on the way down and up, darker reef windward
  // A's wet-sand gloss (roughness .28) also covered the seabed, which then mirrored the sky up through
  // the water (the white band off every beach): matte and no sky reflection below the waterline
  float awDry = smoothstep(-0.5, 0.05, vWP.y); tRough = mix(1.0, tRough, awDry);`)
      .replace(ao, "reflectedLight.indirectSpecular *= tAO * awDry;");
  });
}

export class Sea {
  stats = { water: 0, terrain: 0, hq: false };
  constructor(g: AGame) {
    const real = g.real as unknown as Real;
    const sq = params.get("seaq");
    const hq = sq ? sq !== "low" : real.q.name !== "low";
    this.stats.hq = hq;
    const water = (m: Material | undefined) => { if (m && !m.userData["aw:sea-v1"]) { patchWater(m, hq); this.stats.water++; } };
    const terr = (m: Material | undefined) => { if (m && !m.userData["aw:sand-v1"]) { patchTerrain(m); this.stats.terrain++; } };
    const wrap = (fac: Factory | undefined, fn: (m: Material) => void) => {
      if (!fac || typeof fac.material !== "function") return;
      const orig = fac.material.bind(fac);
      fac.material = (...a: unknown[]) => { const m = orig(...a); fn(m); return m; };
    };
    wrap(real.water, water);
    wrap(real.terrain, terr);
    // materials A made before the add-ons loaded: overview terrain + sea plane, regions already streamed in
    terr(real.ovMat);
    for (const o of real.group.children) {
      const m = (o as Mesh).material as Material | undefined;
      if ((o as Mesh).isMesh && m && !Array.isArray(m) && /\|water/.test(m.customProgramCacheKey ? m.customProgramCacheKey() : "")) water(m);
    }
    for (const r of real.regions.values()) { terr(r.mat); water(r.wmat); }
  }
}
