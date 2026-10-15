// Day/night cycle for A's scene, driven by the solar model in day.ts.
//  - sky: the procedural dome (sky.ts) is the backdrop all day; A's HDR stays loaded as the
//    image-based light only, rotated so its bright side follows the sun's bearing;
//  - sun: real bearing/elevation, colour and strength from air mass (deep orange and weak at
//    the horizon, A's own white-gold above ~40 deg); the key light is floored at 4 deg so
//    shadows never stretch across the whole shadow map;
//  - dusk: the sun light fades out before it hands over to the moon (both are ~0 at the
//    switch, so shadows do not jump); a sky-coloured fill carries the blue hour;
//  - night keeps B's "bright night" rules (README §3): moon light forced HIGH (y >= 0.78) so
//    streets never go black on phones, blue hemi / warm ground, cool ambient, exposure up.
// Everything is a continuous function of sun elevation and nothing allocates per frame.
import { AmbientLight, Color, Vector3 } from "three";
import type { AGame } from "./env";
import { makeSample, sampleDay, smooth, type DaySample } from "./day";
import { makeSky, type Sky } from "./sky";
import { uNight, uStars, uTime } from "./uniforms";

const MOON = new Color(0xd5e2ff);
const NIGHT_HEMI_SKY = new Color(0x2a4470);
const NIGHT_HEMI_GROUND = new Color(0xb08a58);
const NIGHT_AMB = new Color(0x8ea4cc);
const DUSK_WARM = new Color(0xffcfa4);
const DUSK_BLUE = new Color(0x9db0de);
const CLOUD_NIGHT = new Color(0x3a4a66);
// trade wind from the ENE: clouds drift WSW at 24 m/s of cloud-deck travel (6000 / 2300 m noise tiles)
const WIND = 24;

const tmpC = new Color();
const fract = (x: number) => x - Math.floor(x);

/** Set v's elevation to at least minY (keeping its bearing). */
function liftTo(v: Vector3, minY: number) {
  if (v.y >= minY) return v;
  const hl = Math.hypot(v.x, v.z) || 1, k = Math.sqrt(1 - minY * minY) / hl;
  return v.set(v.x * k, minY, v.z * k);
}

export class DayNight {
  g: AGame;
  sky: Sky;
  ambient: AmbientLight;
  sample: DaySample = makeSample();
  /** true sun direction (may be below the horizon) */
  sunW = new Vector3(0, 1, 0);
  moonW = new Vector3(0, 1, 0);
  // A's original daytime values
  private base: {
    theta: number; envAng0: number; sunColor: Color; sunI: number; bounceSky: Color; bounceGround: Color; bounceI: number;
    fog: Color; exposure: number;
  };
  /** world vectors of local east / north */
  private ax = { ex: 1, ez: 0, nx: 0, nz: -1 };
  private wind = { x: 0, z: 0, qx: 0, qz: 0 };
  private low: boolean;
  private disc: number;
  private clouds: Array<{ m: { color: Color; opacity: number }; c: Color; o: number }> = [];

  constructor(g: AGame, sunDisc = true) {
    this.g = g;
    const sky = g.real!.sky;
    const sd = sky.sunDir.clone().normalize();
    this.base = {
      theta: sky.theta, envAng0: Math.atan2(-sd.z, sd.x), sunColor: sky.sun.color.clone(), sunI: sky.sun.intensity,
      bounceSky: sky.bounce.color.clone(), bounceGround: sky.bounce.groundColor.clone(), bounceI: sky.bounce.intensity,
      fog: sky.fog.color.clone(), exposure: g.renderer.toneMappingExposure,
    };
    const fromLL = (g as unknown as { fromLL?: (lat: number, lon: number) => { x: number; z: number } }).fromLL;
    if (fromLL) {
      const o = fromLL(12.52, -70.0), e = fromLL(12.52, -69.99), n = fromLL(12.53, -70.0);
      const el = Math.hypot(e.x - o.x, e.z - o.z) || 1, nl = Math.hypot(n.x - o.x, n.z - o.z) || 1;
      this.ax = { ex: (e.x - o.x) / el, ez: (e.z - o.z) / el, nx: (n.x - o.x) / nl, nz: (n.z - o.z) / nl };
    }
    const a = this.ax;
    const wx = -(0.924 * a.ex + 0.383 * a.nx) * WIND, wz = -(0.924 * a.ez + 0.383 * a.nz) * WIND;
    this.wind = { x: wx / 6000, z: wz / 6000, qx: (0.8 * wx + 0.6 * wz) / 2300, qz: (-0.6 * wx + 0.8 * wz) / 2300 };
    this.low = g.real!.q?.name === "low";
    this.disc = sunDisc ? 1 : 0;
    this.ambient = new AmbientLight(0x8ea4cc, 0);
    this.ambient.name = "aw:nightAmbient";
    g.scene.add(this.ambient);
    this.sky = makeSky();
    g.scene.add(this.sky.mesh);
    // older A builds had cloud sprites high above the island
    for (const o of g.scene.children) {
      const sp = o as unknown as { isSprite?: boolean; material: { color: Color; opacity: number }; position: Vector3; scale: Vector3 };
      if (sp.isSprite && sp.material && sp.position.y > 25 && sp.scale.x > 60)
        this.clouds.push({ m: sp.material, c: sp.material.color.clone(), o: sp.material.opacity });
    }
  }

  apply(t: number) {
    const g = this.g;
    const sky = g.real!.sky;
    const s = sampleDay(t, this.sample);
    const b = this.base, a = this.ax, low = this.low;
    const night = s.night, e = s.elevDeg;
    uNight.value = night;
    uStars.value = s.stars;

    // --- sun / moon directions in world space
    const sun = this.sunW.set(s.east * a.ex + s.north * a.nx, s.up, s.east * a.ez + s.north * a.nz).normalize();
    const moon = liftTo(this.moonW.copy(sun).negate(), 0.62);
    const useSun = e > -2;
    const dir = sky.sunDir;
    if (useSun) liftTo(dir.copy(sun), 0.07);
    else liftTo(dir.copy(moon), 0.78);
    const rot = b.theta + Math.atan2(-dir.z, dir.x) - b.envAng0;
    g.scene.environmentRotation.set(0, rot, 0);
    g.scene.backgroundRotation.set(0, rot, 0);
    // A re-attaches its HDR backdrop when its sky is (re)applied; the dome replaces it
    if (g.scene.background) g.scene.background = null;

    // --- key light
    const k = smooth(0.42, 0.75, night);
    if (useSun) {
      sky.sun.color.copy(s.light).lerp(b.sunColor, smooth(30, 45, e));
      sky.sun.intensity = b.sunI * s.sunK;
    } else {
      sky.sun.color.copy(MOON);
      sky.sun.intensity = b.sunI * (0.32 + 0.16 * k) * s.moonK * (low ? 1.1 : 1);
    }
    // --- fill: A's hemi by day -> blue sky / warm ground at night (LOW has no grade pass: a notch less)
    sky.bounce.color.copy(b.bounceSky).lerp(NIGHT_HEMI_SKY, night);
    sky.bounce.groundColor.copy(b.bounceGround).lerp(NIGHT_HEMI_GROUND, night);
    sky.bounce.intensity = b.bounceI + ((0.55 + 0.35 * k) * (low ? 0.72 : 1) - b.bounceI) * night;
    const twi = s.dusk * (1 - s.moonK);
    this.ambient.color.copy(DUSK_WARM).lerp(DUSK_BLUE, 1 - smooth(-6, 2, e)).lerp(NIGHT_AMB, s.moonK);
    this.ambient.intensity = 0.32 * twi * (low ? 0.75 : 1) + (0.55 + 0.45 * k) * (low ? 0.5 : 1) * s.moonK;
    const envNight = low ? 0.12 : 0.22;
    g.scene.environmentIntensity = envNight + (1 - envNight) * s.skyK;
    // eye adaptation: open up a little through golden/blue hour, B's bright-night lift after
    g.renderer.toneMappingExposure = b.exposure * (1 + (low ? 0.02 : 0.14) * night) * (1 + 0.1 * s.dusk);

    // --- fog melts far terrain into the horizon; by day stay close to A's measured HDR horizon
    sky.fog.color.copy(s.fog).lerp(b.fog, 0.45 * smooth(12, 30, e));

    // --- dome
    const cam = g.camera;
    const u = this.sky.u;
    this.sky.mesh.position.copy(cam.position);
    this.sky.mesh.scale.setScalar(cam.far * 0.9);
    u.uSun.value.copy(sun);
    const hl = Math.hypot(sun.x, sun.z);
    if (hl > 1e-4) u.uSunXZ.value.set(sun.x / hl, sun.z / hl);
    u.uMoon.value.copy(moon);
    u.uMoonI.value = s.moonK;
    u.uCam.value.copy(cam.position);
    u.uZen.value.copy(s.zenith);
    u.uHorS.value.copy(s.horSun);
    u.uHorA.value.copy(s.horAnti);
    u.uGlow.value.copy(s.glow);
    u.uBelt.value.copy(s.belt);
    u.uDisc.value.copy(s.disc).multiplyScalar(this.disc);
    u.uCLit.value.copy(s.cloudLit);
    u.uCShade.value.copy(s.cloudShade);
    u.uFog.value.copy(sky.fog.color);
    const tw = uTime.value, wd = this.wind;
    u.uWind.value.set(fract(wd.x * tw), fract(wd.z * tw), fract(wd.qx * tw), fract(wd.qz * tw));
    u.uCloudAmt.value = 1 - 0.35 * night;

    for (const c of this.clouds) {
      c.m.color.copy(c.c).lerp(tmpC.copy(CLOUD_NIGHT), night);
      c.m.opacity = c.o * (1 - 0.6 * night);
    }
  }
}
