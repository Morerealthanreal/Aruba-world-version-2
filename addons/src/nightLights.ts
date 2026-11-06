// Night lighting for A, after B's rules (README §2-3):
//  - lit windows: emissive only on window glass, times uNight (B: facade shader);
//  - glowing street-lamp bulbs (B: bulbMat.emissiveIntensity = 0.4 + night*7.5);
//  - one car/moto headlight SpotLight at night on every tier (B: decay 1, high
//    intensity, so the lane is readable on LOW phones with no point lights);
//  - warm PointLight pools on HIGH only (B: townLights.ts) — here they snap to
//    the nearest real street lamps instead of fixed offsets around the player.
// Lights are created once at start and kept visible with intensity 0 by day, so
// dusk does not trigger a shader recompile (B noted the hitch when a light toggles).
import { Color, Matrix4, Object3D, PointLight, SpotLight, Vector3, type Material, type InstancedMesh } from "three";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type Shader = { uniforms: Record<string, { value: unknown }>; vertexShader: string; fragmentShader: string };
type PatchableMat = Material & {
  onBeforeCompile: (s: Shader, r: unknown) => void;
  customProgramCacheKey: () => string;
  userData: Record<string, unknown>;
};

/** Chain an onBeforeCompile patch onto a material A already patched (same idea as A's own `km`). */
export function chainPatch(mat: Material, key: string, fn: (s: Shader) => void) {
  const m = mat as PatchableMat;
  if (m.userData["aw:" + key]) return;
  m.userData["aw:" + key] = true;
  const prev = m.onBeforeCompile;
  const prevKey = m.customProgramCacheKey ? m.customProgramCacheKey.bind(m) : () => "";
  m.onBeforeCompile = (s, r) => {
    if (prev) prev.call(m, s, r);
    fn(s);
  };
  m.customProgramCacheKey = () => prevKey() + "|aw-" + key;
  m.needsUpdate = true;
}

function patchWindows(wall: Material) {
  chainPatch(wall, "winglow-v1", (s) => {
    if (!s.fragmentShader.includes("float gMask = glass;")) return;
    s.uniforms.uAwNight = uNight;
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uAwNight;")
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    float awB = floor(u / 3.6), awF = floor(v / max(fh, 0.5));
    float awR = rwH(vec2(awB * 3.1 + seed * 11.0, awF * 7.3 + 0.37));
    float awLit = step(0.6, awR); // ~40% of windows lit (r202: 50%)
    vec3 awWarm = mix(vec3(1.0, 0.6, 0.28), vec3(1.0, 0.86, 0.62), rwH(vec2(awR, seed + 0.5)));
    totalEmissiveRadiance += awWarm * gMask * awLit * smoothstep(0.3, 0.8, uAwNight) * (0.35 + 0.25 * awR); // owner: city too bright (r202 0.9, before 2.4)
  }`,
      );
  });
}

/** Hero GLB facades have windows painted into the texture (dark blue-grey glass). Light them at night. */
/** Bugaloe's folded pier. Other heroes share a material named body, so this name stays unique. */
function patchPierNight(mat: Material) {
  chainPatch(mat, "piernight-v1", (s) => {
    if (!s.fragmentShader.includes("#include <color_fragment>")) return;
    s.uniforms.uAwNight = uNight;
    if (!s.fragmentShader.includes("uniform float uAwNight")) {
      s.fragmentShader = s.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uAwNight;");
    }
    s.fragmentShader = s.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
  diffuseColor.rgb *= mix(1.0, 0.14, smoothstep(0.35, 0.85, uAwNight));`,
    );
  });
}

function patchHeroWindows(mat: Material) {
  chainPatch(mat, "herowin-v2", (s) => {
    if (!s.fragmentShader.includes("#include <emissivemap_fragment>")) return;
    s.uniforms.uAwNight = uNight;
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uAwNight;")
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    vec3 awC = diffuseColor.rgb;
    float awL = dot(awC, vec3(0.299, 0.587, 0.114));
    float awW = step(awC.r + 0.03, awC.b) * (1.0 - smoothstep(0.12, 0.3, awL));
    #ifdef USE_MAP
    vec2 awCell = floor(vMapUv + 0.001); // u per bay, v per storey -> one cell per window
    awW *= step(0.25, fract(sin(dot(awCell, vec2(12.9898, 78.233))) * 43758.5453));
    #endif
    totalEmissiveRadiance += vec3(1.0, 0.72, 0.42) * awW * smoothstep(0.3, 0.8, uAwNight) * 0.32; // r202 0.55, before 1.2
  }`,
      );
  });
}

type StdMat = Material & { emissive: Color; emissiveIntensity: number; color: Color };
const BULB = new Color(0xffc985);
const fwd = new Vector3();

export class NightLights {
  g: AGame;
  head: SpotLight;
  headTarget: Object3D;
  pools: PointLight[] = [];
  private bulbMats = new Set<StdMat>();
  private bulbBase = new Map<StdMat, { e: Color; i: number }>();
  private lampMeshes = new Set<InstancedMesh>();
  private scanT = 0;
  // hero GLB signs (material names signglow / neon* / bulb*): ramp emissive with night
  private heroGlow = new Map<StdMat, number>();
  /** Bugaloe lanterns: off in daylight, hot gold after dusk. A day floor washed the eave out to a cream wall. */
  private lampGold = new Set<StdMat>();
  private heroN = -1;
  private bump: Material[] = []; // three sometimes skips the first version bump on already-compiled hero mats; bump again next frame
  private poolT = 0;

  constructor(g: AGame) {
    this.g = g;
    const real = g.real!;
    if (real.buildings?.wall) patchWindows(real.buildings.wall);

    // headlight (B: 0xfff1c8, distance 58, angle .95, penumbra .6, decay 1, 90*night)
    this.head = new SpotLight(0xfff1c8, 0, 58, 0.95, 0.6, 1);
    this.head.castShadow = false;
    this.head.name = "aw:headlight";
    this.headTarget = new Object3D();
    this.head.target = this.headTarget;
    g.scene.add(this.head, this.headTarget);

    const tier = real.q?.name ?? "med";
    const n = tier === "high" ? 4 : 0; // B: lightPools 4 on HIGH only
    for (let i = 0; i < n; i++) {
      const l = new PointLight(0xffb15e, 0, 28, 2);
      l.castShadow = false;
      l.name = "aw:lampPool";
      this.pools.push(l);
      g.scene.add(l);
    }
  }

  private waterDone = new WeakSet<Material>();
  private waterSeen = new WeakSet<object>();
  private waterTopN = -1;
  private patchWaterMat(m: PatchableMat) {
    if (!m || Array.isArray(m) || this.waterDone.has(m)) return;
    this.waterDone.add(m);
    const key = m.customProgramCacheKey ? m.customProgramCacheKey() : "";
    if (!/\|water/.test(key)) return;
    chainPatch(m, "waternight-v1", (sh) => {
      if (!sh.fragmentShader.includes("diffuseColor = vec4(wc, a);")) return;
      sh.uniforms.uAwNight = uNight;
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform float uAwNight;")
        .replace("diffuseColor = vec4(wc, a);", "wc *= mix(1.0, 0.22, uAwNight); wc = mix(wc, wc * vec3(0.55, 0.75, 1.1), uAwNight * 0.5);\n  diffuseColor = vec4(wc, a);");
    });
  }
  /** A's sea shader colours the water itself (turquoise) and barely responds to the moon, so it glowed at night.
   *  Perf: no whole-scene walk. A's water lives on region.wmat (+ region pools) and on the island-wide sea plane
   *  directly under A's "realistic" group, so only walk each region once when it finishes building. */
  private patchWater() {
    const real = this.g.real as unknown as { group: Object3D; regions: Map<string, { state: string; group?: Object3D; wmat?: Material }> };
    if (real.group.children.length !== this.waterTopN) {
      this.waterTopN = real.group.children.length;
      for (const o of real.group.children) {
        const m = (o as InstancedMesh).material as PatchableMat;
        if ((o as InstancedMesh).isMesh) this.patchWaterMat(m);
      }
    }
    for (const r of real.regions.values()) {
      if (r.wmat) this.patchWaterMat(r.wmat as PatchableMat);
      if (r.state !== "built" || !r.group || this.waterSeen.has(r.group)) continue;
      this.waterSeen.add(r.group);
      r.group.traverse((o) => {
        if ((o as InstancedMesh).isMesh) this.patchWaterMat((o as InstancedMesh).material as PatchableMat);
      });
    }
  }

  private waterT = 0;
  private scan() {
    // cheap now (new regions only), so every scan
    this.waterT++;
    this.patchWater();
    // A's street-lamp bulbs: props.glb "slamp" light part, emissive 0x55534c.
    this.g.real!.veg.group.traverse((o) => {
      const m = (o as InstancedMesh).material as StdMat;
      if (!(o as InstancedMesh).isMesh || !m || Array.isArray(m) || !m.emissive) return;
      if (m.emissive.getHex() === 0x55534c || this.bulbMats.has(m)) {
        if (!this.bulbMats.has(m)) {
          this.bulbMats.add(m);
          this.bulbBase.set(m, { e: m.emissive.clone(), i: m.emissiveIntensity });
        }
        if ((o as InstancedMesh).isInstancedMesh) this.lampMeshes.add(o as InstancedMesh);
      }
    });
    for (const im of this.lampMeshes) if (!im.parent) this.lampMeshes.delete(im);
    this.scanHero();
  }

  private scanHero() {
    const hg = (this.g.real as unknown as { hero?: { group?: Object3D } }).hero?.group;
    if (!hg) return;
    let n = 0;
    hg.traverse(() => n++);
    if (n === this.heroN) return;
    this.heroN = n;
    hg.traverse((o) => {
      const mm = (o as InstancedMesh).material as StdMat | StdMat[];
      if (!(o as InstancedMesh).isMesh || !mm) return;
      for (const m of Array.isArray(mm) ? mm : [mm]) {
        if (!m || !m.emissive || this.heroGlow.has(m) || this.lampGold.has(m)) continue;
        const nm = m.name || "";
        if (nm === "piernight") { patchPierNight(m); continue; }
        if (nm === "lampgold") { this.lampGold.add(m); m.emissive.setRGB(1, 0.58, 0.1); continue; }
        if (/^l?(signglow|neon|bulb)/i.test(nm)) this.heroGlow.set(m, m.emissiveIntensity || 1);
        else if (nm === "sign") this.heroGlow.set(m, -(m.emissiveIntensity || 1)); // plain signs: gentler ramp
        else if (/^(facade|ground)(_\d+)?$/.test(nm)) { patchHeroWindows(m); this.bump.push(m); }
        else if (nm === "glass") { m.emissive.setHex(0xffc985); m.emissiveIntensity = 0; this.heroGlow.set(m, 0); } // hero windows: warm glow at night
      }
    });
  }

  /** A's car physics: x -= sin(h) * s, z -= cos(h) * s (same convention as B: nose is -Z). */
  private carForward(out: Vector3): boolean {
    const h = this.g.S.car.h;
    out.set(-Math.sin(h), 0, -Math.cos(h));
    return true;
  }

  update(dt: number) {
    const g = this.g;
    const night = uNight.value;
    this.scanT -= dt;
    if (this.scanT <= 0) {
      this.scanT = 2;
      this.scan();
    }
    // bulbs
    const k = Math.max(0, Math.min(1, (night - 0.25) / 0.4));
    for (const m of this.bulbMats) {
      const b = this.bulbBase.get(m)!;
      m.emissive.copy(b.e).lerp(BULB, k);
      m.emissiveIntensity = b.i + k * 2; // r202 3.5, before 7.5
    }
    if (this.bump.length) { for (const m of this.bump) m.needsUpdate = true; this.bump.length = 0; }
    // hero signs: dim by day (reads as paint), bright at night
    for (const m of this.heroGlow.keys()) { const i0 = this.heroGlow.get(m)!; m.emissiveIntensity = i0 > 0 ? i0 * (0.45 + k * 0.95) : i0 < 0 ? -i0 * (1 + k * 0.55) : k * 0.16; } // r202 1.8 / 1.2 / 0.3
    for (const m of this.lampGold) m.emissiveIntensity = k * 1.15;

    // headlight: car/moto only, night > .35 (B)
    const S = g.S;
    const drive = (S.mode === "car" || S.mode === "moto") && night > 0.35;
    const f = fwd;
    if (drive && this.carForward(f)) {
      const c = S.car;
      const y = (c.y || 0) + (S.mode === "moto" ? 0.72 : 0.62);
      this.head.position.set(c.x + f.x * 2.2, y, c.z + f.z * 2.2);
      this.headTarget.position.set(c.x + f.x * 24, (c.y || 0) + 0.2, c.z + f.z * 24);
      this.headTarget.updateMatrixWorld();
      this.head.intensity = 14 * night; // r268: glare off buildings/cars ~-75% (Justin 2026-10-15), was 54 (r252), 90
    } else {
      this.head.intensity = 0;
    }
    // perf: an intensity-0 light still costs every lit fragment (three counts visible lights, not bright ones).
    // Toggle on night only (rare -> one shader recompile at dusk/dawn), not on mode switches.
    this.head.visible = night > 0.35;

    // HIGH: snap warm pools to the nearest real lamps
    if (this.pools.length) {
      this.poolT -= dt;
      if (this.poolT <= 0) {
        this.poolT = 0.5;
        const cam = g.camera.position;
        const best: Array<{ d: number; p: Vector3 }> = [];
        const m = new Matrix4();
        for (const im of this.lampMeshes) {
          const wm = im.matrixWorld;
          for (let i = 0; i < im.count; i++) {
            im.getMatrixAt(i, m);
            const p = new Vector3().setFromMatrixPosition(m).applyMatrix4(wm);
            const d = (p.x - cam.x) ** 2 + (p.z - cam.z) ** 2;
            if (d > 90 * 90) continue;
            best.push({ d, p });
          }
        }
        best.sort((a, b) => a.d - b.d);
        this.pools.forEach((l, i) => {
          const b = best[i];
          if (b) l.position.set(b.p.x, b.p.y + 6.5, b.p.z);
          l.userData.has = !!b;
        });
      }
      for (const l of this.pools) { l.intensity = l.userData.has ? night * 12 : 0; l.visible = night > 0.3; } // was 19.5
    }
  }
}
