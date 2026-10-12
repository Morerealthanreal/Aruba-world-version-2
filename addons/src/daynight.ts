// Day/night cycle for A's scene, driven by B's day model (day.ts) and B's
// "bright night" lighting rules (README §3):
//  - at night the light vector is forced HIGH (sunY 0.78) so ground NdotL is
//    not ~0 and streets never go black on phones;
//  - a cool moon directional + blue hemi sky / warm ground + cool ambient;
//  - exposure nudged up at night instead of crushing contrast.
// By day the scene is left exactly as A built it (HDR sky, sun 3.2, exposure .95);
// only the sun's elevation/azimuth and color move through the day. The HDR
// background/environment are rotated together with the light so the baked sun
// in A's sky stays on the same bearing as the shadow-casting light.
import { AmbientLight, Color, Vector3 } from "three";
import type { AGame } from "./env";
import { sampleDay, smooth, type DaySample } from "./day";
import { makeSky, type Sky } from "./sky";
import { uNight } from "./uniforms";

const Y = new Vector3(0, 1, 0);
const tmpC = new Color();

export class DayNight {
  g: AGame;
  sky: Sky;
  ambient: AmbientLight;
  sample!: DaySample;
  // A's original daytime values
  private base: {
    sunDir: Vector3; theta: number; sunColor: Color; sunI: number; bounceSky: Color; bounceGround: Color; bounceI: number;
    fog: Color; exposure: number; elev0: number; az0: number; sign: number;
  };
  private clouds: Array<{ m: { color: Color; opacity: number }; c: Color; o: number }> = [];

  constructor(g: AGame) {
    this.g = g;
    const sky = g.real!.sky;
    const sd = sky.sunDir.clone().normalize();
    const elev0 = Math.asin(Math.max(-1, Math.min(1, sd.y)));
    const az0 = Math.atan2(sd.z, sd.x);
    // Which way round is "morning = east (+x)"? Test both signs once.
    const probe = (s: number) => sd.clone().applyAxisAngle(Y, s * 1.2).x;
    const sign = probe(1) > probe(-1) ? 1 : -1;
    this.base = {
      sunDir: sd, theta: sky.theta, sunColor: sky.sun.color.clone(), sunI: sky.sun.intensity,
      bounceSky: sky.bounce.color.clone(), bounceGround: sky.bounce.groundColor.clone(), bounceI: sky.bounce.intensity,
      fog: sky.fog.color.clone(), exposure: g.renderer.toneMappingExposure, elev0, az0, sign,
    };
    this.ambient = new AmbientLight(0x8ea4cc, 0);
    this.ambient.name = "aw:nightAmbient";
    g.scene.add(this.ambient);
    this.sky = makeSky();
    g.scene.add(this.sky.mesh);
    // A's clouds are top-level sprites high above the island.
    for (const o of g.scene.children) {
      const sp = o as unknown as { isSprite?: boolean; material: { color: Color; opacity: number }; position: Vector3; scale: Vector3 };
      if (sp.isSprite && sp.material && sp.position.y > 25 && sp.scale.x > 60)
        this.clouds.push({ m: sp.material, c: sp.material.color.clone(), o: sp.material.opacity });
    }
  }

  apply(t: number) {
    const g = this.g;
    const sky = g.real!.sky;
    const s = (this.sample = sampleDay(t));
    const b = this.base;
    const night = s.night;
    uNight.value = night;

    // --- sun path: sweep the bearing across the sky through the day, keep A's noon elevation as the max
    const p = ((s.t - 0.25 - 0.5 / 24) / 0.5) * 2 - 1; // -1 sunrise .. 0 noon .. +1 sunset (outside = night)
    const sweep = Math.max(-1.25, Math.min(1.25, p)) * 1.15 * b.sign; // radians around Y
    const isNightLight = night > 0.42;
    const dir = new Vector3();
    if (!isNightLight) {
      const e = Math.min(Math.asin(Math.max(0.07, s.elev)), b.elev0);
      dir.set(Math.cos(b.az0) * Math.cos(e), Math.sin(e), Math.sin(b.az0) * Math.cos(e)).applyAxisAngle(Y, sweep);
    } else {
      // moon: high light vector (B: sunY forced to 0.78) on A's bearing, opposite side of the sun
      dir.set(-Math.cos(b.az0) * 0.62, 0.78, -Math.sin(b.az0) * 0.62).normalize();
    }
    sky.sunDir.copy(dir);
    const rot = b.theta + (isNightLight ? 0 : sweep);
    g.scene.backgroundRotation.set(0, rot, 0);
    g.scene.environmentRotation.set(0, rot, 0);

    // --- light colors / intensities
    if (isNightLight) {
      const k = smooth(0.42, 0.75, night);
      sky.sun.color.setHex(0xd5e2ff);
      sky.sun.intensity = b.sunI * (0.32 + 0.16 * k);
      sky.bounce.color.setHex(0x2a4470);
      sky.bounce.groundColor.setHex(0xb08a58);
      sky.bounce.intensity = 0.55 + 0.35 * k;
      this.ambient.color.setHex(0x8ea4cc);
      this.ambient.intensity = 0.55 + 0.45 * k;
    } else {
      const warm = s.sunset;
      tmpC.setRGB(1, 0.55, 0.3);
      sky.sun.color.copy(b.sunColor).lerp(tmpC, Math.min(1, warm * 1.1));
      sky.sun.intensity = b.sunI * (0.18 + 0.82 * s.day);
      sky.bounce.color.copy(b.bounceSky).lerp(tmpC.setHex(0x2a4470), night);
      sky.bounce.groundColor.copy(b.bounceGround);
      sky.bounce.intensity = b.bounceI;
      this.ambient.color.setHex(0xffd2a8);
      this.ambient.intensity = 0.25 * night;
    }
    // HDR background + IBL fade out toward night (dome takes over)
    g.scene.environmentIntensity = 0.22 + 0.78 * s.day;
    g.scene.backgroundIntensity = Math.max(0.02, s.day);
    g.renderer.toneMappingExposure = b.exposure * (1 + 0.14 * night);

    // --- overlay sky dome (B's gradient + stars + moon) fades in for dusk/night
    const cam = g.camera;
    this.sky.mesh.position.copy(cam.position);
    this.sky.mesh.scale.setScalar(cam.far * 0.9);
    this.sky.opacity.value = Math.min(1, Math.max(0, night * 1.25 + s.sunset * 0.35));
    this.sky.mesh.visible = this.sky.opacity.value > 0.002;
    const realSun = new Vector3(Math.cos(b.az0), s.elev, Math.sin(b.az0)).applyAxisAngle(Y, sweep).normalize();
    this.sky.sun.copy(realSun);
    this.sky.zenith.set(...s.zenith);
    this.sky.horizon.set(...s.horizon);

    // --- fog follows the horizon so far buildings melt into the right sky colour
    tmpC.setRGB(s.horizon[0], s.horizon[1], s.horizon[2]);
    sky.fog.color.copy(b.fog).lerp(tmpC, Math.min(1, night * 1.2 + s.sunset * 0.6));

    // --- clouds dim at night (B: 0x243044, opacity .22)
    for (const c of this.clouds) {
      c.m.color.copy(c.c).lerp(tmpC.setHex(0x3a4a66), night);
      c.m.opacity = c.o * (1 - 0.6 * night);
    }
  }
}
