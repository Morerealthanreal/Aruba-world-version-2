// Round 3 sky: sun disc + halo billboard (1 draw, additive, no new pass) and a wider
// golden-hour window (warmer key light + warm haze for ~1.5 h around sunrise/sunset).
// Off with ?sun=0.
import { AdditiveBlending, CanvasTexture, Color, Sprite, SpriteMaterial, Vector3 } from "three";
import type { AGame } from "./env";

const tmp = new Color();
const gold = new Color(1, 0.62, 0.32);
const haze = new Color(0.98, 0.74, 0.55);
const v = new Vector3();

function discTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const x = c.getContext("2d")!;
  const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.07, "rgba(255,252,240,1)");
  gr.addColorStop(0.1, "rgba(255,236,200,.55)");
  gr.addColorStop(0.3, "rgba(255,200,140,.16)");
  gr.addColorStop(1, "rgba(255,180,120,0)");
  x.fillStyle = gr;
  x.fillRect(0, 0, 128, 128);
  const t = new CanvasTexture(c);
  t.generateMipmaps = true;
  return t;
}

export class Sun {
  sprite: Sprite;
  private mat: SpriteMaterial;
  constructor(private g: AGame) {
    this.mat = new SpriteMaterial({ map: discTex(), blending: AdditiveBlending, depthWrite: false, fog: false, toneMapped: false, transparent: true });
    this.sprite = new Sprite(this.mat);
    this.sprite.name = "aw:sun";
    this.sprite.renderOrder = -900;
    this.sprite.frustumCulled = false;
    (g.scene as unknown as { add(o: unknown): void }).add(this.sprite);
  }
  /** call after DayNight.apply. elev = sin elevation of the real sun, day 0..1 */
  update(elev: number, day: number) {
    const real = this.g.real as unknown as { sky: { sunDir: Vector3; sun: { color: Color; intensity: number }; fog: { color: Color } } };
    const sky = real.sky;
    const cam = this.g.camera as unknown as { position: Vector3; far: number };
    // golden hour: strongest at elev ~0.05, fades by 0.4
    const gh = Math.max(0, Math.min(1, (0.42 - elev) / 0.3)) * Math.max(0, Math.min(1, elev / 0.04 + 1)) * day;
    if (gh > 0) {
      sky.sun.color.lerp(gold, 0.6 * gh);
      sky.fog.color.lerp(haze, 0.4 * gh);
    }
    const d = Math.min(cam.far * 0.85, 4000);
    v.copy(sky.sunDir).normalize();
    this.sprite.position.copy(cam.position).addScaledVector(v, d);
    this.sprite.scale.setScalar(d * (0.16 + 0.08 * gh));
    tmp.setRGB(1, 0.97, 0.9).lerp(gold, gh * 0.8);
    this.mat.color.copy(tmp).multiplyScalar(0.9 * day);
    this.sprite.visible = day > 0.05;
  }
}
