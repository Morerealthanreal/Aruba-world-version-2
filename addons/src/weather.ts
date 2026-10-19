// Light, cheap weather on top of the day/night sky (daynight.ts + sky.ts). Off with ?weather=0.
// Aruba is dry and windy: mostly clear trade-wind cumulus, with a couple of passing cloudier
// spells a day, and on about one game day in four a short shower (30..55 real seconds at the default
// 24-minute day) that rolls in on the ENE trade wind.
//  - clouds: modulates the dome's existing cloud-cover threshold (no new pass); showers darken the
//    cloud bases;
//  - light: sun / sky light and fog dim a little under cloud and rain (multiplied after DayNight
//    has written them each frame, so nothing accumulates);
//  - rain: ONE LineSegments draw call of wind-slanted streaks (1000 HIGH / 480 LOW) that follow
//    the camera in the vertex shader. It is hidden (0 draws) whenever it is not raining.
// Schedule is a deterministic function of game day + clock, so a given date always plays the same.
//   ?rain=1 force a shower now   ?cover=0.4..0.7 fixed cloud threshold (lower = cloudier)
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, LineSegments, ShaderMaterial, Vector3 } from "three";
import type { AGame } from "./env";
import { params } from "./env";
import type { DayNight } from "./daynight";
import { solar } from "./day";
import { uTime } from "./uniforms";

const hash = (a: number, b: number) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const bell = (x: number, c: number, w: number) => { const d = (x - c) / w; return Math.abs(d) >= 1 ? 0 : 0.5 + 0.5 * Math.cos(d * Math.PI); };
const RAIN_GREY = new Color(0x5d6670);

export class Weather {
  stats = { cover: 0.58, rain: 0, day: 0, showerToday: -1 };
  private days: number; private lastT = -1;
  private rainMesh: LineSegments; private rainU = { uRain: { value: 0 }, uCam: { value: new Vector3() } };
  private forceRain = params.get("rain") === "1";
  private fixedCover = params.get("cover") !== null && isFinite(+params.get("cover")!) ? +params.get("cover")! : null;

  constructor(private g: AGame, private dn: DayNight) {
    const d = solar.date ? Date.parse(solar.date) / 864e5 : 0;
    this.days = Math.floor(d) % 10000;
    const low = g.real?.q?.name === "low", n = low ? 480 : 1000, R = 34, H = 26;
    const pos: number[] = [], seed: number[] = [];
    for (let i = 0; i < n; i++) {
      const x = (hash(i, 1) * 2 - 1) * R, z = (hash(i, 2) * 2 - 1) * R, ph = hash(i, 3) * H, len = 0.7 + hash(i, 4) * 0.6;
      pos.push(x, ph, z, x, ph, z); seed.push(0, len, len, len);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("seed", new Float32BufferAttribute(seed, 2)); // (isTop, length)
    const mat = new ShaderMaterial({
      uniforms: { ...this.rainU, uTime },
      transparent: true, depthWrite: false, blending: AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute vec2 seed; uniform vec3 uCam; uniform float uTime; varying float vA;
        void main() {
          // fall at 9 m/s, slanted WSW by the trade wind; wrap in a 26 m column around the camera
          float y = mod(position.y - uTime * 9.0, 26.0) - 9.0;
          vec3 p = vec3(position.x + uCam.x, uCam.y + y, position.z + uCam.z);
          p += seed.x * vec3(-0.92 * 0.35, 1.0, 0.38 * 0.35) * seed.y;
          vA = 1.0 - smoothstep(10.0, 34.0, length(p.xz - uCam.xz));
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uRain; varying float vA;
        void main() { gl_FragColor = vec4(vec3(0.62, 0.68, 0.76) * 0.6 * uRain * vA, 1.0); }`,
    });
    this.rainMesh = new LineSegments(geo, mat);
    this.rainMesh.frustumCulled = false; this.rainMesh.visible = false; this.rainMesh.name = "aw:rain"; this.rainMesh.renderOrder = 5;
    g.scene.add(this.rainMesh);
  }

  /** Call right after DayNight.apply(t). */
  update(t: number) {
    if (this.lastT >= 0 && t < this.lastT - 0.5) this.days++;
    this.lastT = t;
    const k = this.days, h = t * 24;
    // two passing cloudier spells a day, otherwise the usual scattered trade-wind cumulus
    let spell = 0;
    for (let i = 0; i < 2; i++) spell = Math.max(spell, bell(h, 7 + hash(k, 10 + i) * 12 + i * 3, 1.0 + hash(k, 20 + i)) * (0.5 + 0.5 * hash(k, 30 + i)));
    // a short shower on ~1 game day in 4, daytime or evening
    let rain = 0;
    this.stats.showerToday = -1;
    if (hash(k, 7) < 0.27) {
      const c = 9 + hash(k, 8) * 12, w = (0.5 + hash(k, 9) * 0.4) / 2;
      this.stats.showerToday = +c.toFixed(2);
      rain = Math.min(1, bell(h, c, w) * 1.6);
      spell = Math.max(spell, bell(h, c, w * 3.5));
    }
    if (this.forceRain) { rain = 1; spell = 1; }
    const cover = this.fixedCover ?? (0.62 + 0.03 * Math.sin(h * 0.9 + k) - 0.16 * spell - 0.1 * rain);
    this.stats.cover = cover; this.stats.rain = rain; this.stats.day = k;

    const u = this.dn.sky.u, sky = this.g.real!.sky;
    u.uCover.value = cover;
    const shade = spell * 0.25 + rain * 0.35;
    if (shade > 0.001) {
      u.uCShade.value.lerp(RAIN_GREY, rain * 0.5).multiplyScalar(1 - 0.3 * shade);
      u.uCLit.value.multiplyScalar(1 - 0.35 * shade);
      // grey the blue sky toward an overcast shower sky
      u.uZen.value.lerp(RAIN_GREY, rain * 0.6).multiplyScalar(1 - 0.25 * rain);
      u.uHorS.value.lerp(RAIN_GREY, rain * 0.5); u.uHorA.value.lerp(RAIN_GREY, rain * 0.5);
      sky.sun.intensity *= 1 - 0.5 * shade;
      this.g.scene.environmentIntensity *= 1 - 0.25 * shade;
      sky.fog.color.lerp(RAIN_GREY, rain * 0.25);
    }
    this.rainU.uRain.value = rain;
    this.rainMesh.visible = rain > 0.01;
    if (this.rainMesh.visible) this.rainU.uCam.value.copy(this.g.camera.position);
  }
}
