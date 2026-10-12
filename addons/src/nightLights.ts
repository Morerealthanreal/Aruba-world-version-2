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
    float awLit = step(0.36, awR);
    vec3 awWarm = mix(vec3(1.0, 0.6, 0.28), vec3(1.0, 0.86, 0.62), rwH(vec2(awR, seed + 0.5)));
    totalEmissiveRadiance += awWarm * gMask * awLit * smoothstep(0.25, 0.7, uAwNight) * 2.4;
  }`,
      );
  });
}

type StdMat = Material & { emissive: Color; emissiveIntensity: number; color: Color };

export class NightLights {
  g: AGame;
  head: SpotLight;
  headTarget: Object3D;
  pools: PointLight[] = [];
  private bulbMats = new Set<StdMat>();
  private bulbBase = new Map<StdMat, { e: Color; i: number }>();
  private lampMeshes = new Set<InstancedMesh>();
  private scanT = 0;
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
  /** A's sea shader colours the water itself (turquoise) and barely responds to the moon, so it glowed at night. */
  private patchWater() {
    this.g.scene.traverse((o) => {
      const m = (o as InstancedMesh).material as PatchableMat;
      if (!(o as InstancedMesh).isMesh || !m || Array.isArray(m) || this.waterDone.has(m)) return;
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
    });
  }

  private waterT = 0;
  private scan() {
    // full-scene walk is ~50k objects: only every 3rd scan (6 s), new regions bring new water materials
    if (this.waterT++ % 3 === 0) this.patchWater();
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
      m.emissive.copy(b.e).lerp(new Color(0xffc985), k);
      m.emissiveIntensity = b.i + k * 7.5;
    }

    // headlight: car/moto only, night > .35 (B)
    const S = g.S;
    const drive = (S.mode === "car" || S.mode === "moto") && night > 0.35;
    const f = new Vector3();
    if (drive && this.carForward(f)) {
      const c = S.car;
      const y = (c.y || 0) + (S.mode === "moto" ? 0.72 : 0.62);
      this.head.position.set(c.x + f.x * 2.2, y, c.z + f.z * 2.2);
      this.headTarget.position.set(c.x + f.x * 24, (c.y || 0) + 0.2, c.z + f.z * 24);
      this.headTarget.updateMatrixWorld();
      this.head.intensity = 90 * night;
    } else {
      this.head.intensity = 0;
    }

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
      for (const l of this.pools) l.intensity = l.userData.has ? night * 6.5 * 3 : 0;
    }
  }
}
