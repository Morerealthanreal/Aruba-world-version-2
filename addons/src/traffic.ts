// Night lights for A's ambient traffic (real.amb.cars: 3 LOW / 6 MED / 9 HIGH),
// with no real lights on any tier:
//  - the car kit's own "light"/"tail" parts become emissive (per-traffic clones, so
//    parked cars sharing the kit stay dark);
//  - 2 white + 2 red glow dots per car (one Points draw per car);
//  - one additive beam decal on the road ahead.
// A's traffic model: nose is local +Z (rotation.y = atan2(dirX, dirZ)).
import { BufferAttribute, BufferGeometry, Box3, Mesh, PlaneGeometry, Points, type Material, type Object3D, Color } from "three";
import type { AGame } from "./env";
import { decalMaterial, glowPointsMaterial } from "./glow";
import { uNight } from "./uniforms";

type StdMat = Material & { emissive: Color; emissiveIntensity: number; clone(): StdMat };
type Amb = { cars: Array<{ g: Object3D }> };

export class TrafficLights {
  g: AGame;
  private done = new WeakSet<Object3D>();
  private dotI = { value: 0 };
  private beamI = { value: 0 };
  private light?: StdMat;
  private tail?: StdMat;
  private base?: { l: Color; t: Color };
  private dotMat = glowPointsMaterial(this.dotI, 1.2);
  private beamMat = decalMaterial(0xfff0d0, this.beamI, true);
  private extras: Object3D[] = [];
  private t = 0;

  constructor(g: AGame) {
    this.g = g;
  }

  private attach(car: Object3D) {
    const st = this.g.real as unknown as { streets?: { cmat?: Record<string, StdMat> } };
    const cm = st.streets?.cmat;
    if (!cm) return;
    if (!this.light && cm.light && cm.tail) {
      this.light = cm.light.clone();
      this.tail = cm.tail.clone();
      this.base = { l: this.light.emissive.clone(), t: this.tail.emissive.clone() };
    }
    const box = new Box3();
    let lightBox: Box3 | null = null, tailBox: Box3 | null = null;
    for (const ch of car.children) {
      const m = ch as Mesh;
      if (!m.isMesh) continue;
      m.geometry.computeBoundingBox();
      box.union(m.geometry.boundingBox!);
      if (m.material === cm.light && this.light) { m.material = this.light; lightBox = m.geometry.boundingBox!.clone(); }
      else if (m.material === cm.tail && this.tail) { m.material = this.tail; tailBox = m.geometry.boundingBox!.clone(); }
    }
    if (box.isEmpty()) return;
    const hx = (box.max.x - box.min.x) / 2 - 0.22;
    const fy = lightBox ? Math.min(lightBox.max.y - 0.12, box.min.y + 0.75) : box.min.y + 0.65;
    const ty = tailBox ? (tailBox.min.y + tailBox.max.y) / 2 : box.min.y + 0.8;
    const fz = box.max.z + 0.04, tz = box.min.z - 0.04;
    const pos = new Float32Array([-hx, fy, fz, hx, fy, fz, -hx, ty, tz, hx, ty, tz]);
    const col = new Float32Array([0.6, 0.57, 0.51, 0.6, 0.57, 0.51, // r252: headlight dots x0.6
      1, 0.08, 0.04, 1, 0.08, 0.04]);
    const size = new Float32Array([0.55, 0.55, 0.38, 0.38]);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setAttribute("size", new BufferAttribute(size, 1));
    const dots = new Points(geo, this.dotMat);
    dots.frustumCulled = false;
    dots.name = "aw:carDots";
    const len = 16, wid = (hx + 0.22) * 2 + 2.2;
    const beam = new Mesh(new PlaneGeometry(wid, len).rotateX(-Math.PI / 2).rotateY(Math.PI).translate(0, 0.12, fz + len / 2 - 0.3), this.beamMat);
    // plane uv.y runs 0 (near) .. 1 (far) after the flips above
    beam.frustumCulled = false;
    beam.name = "aw:carBeam";
    car.add(dots, beam);
    this.extras.push(dots, beam);
    this.done.add(car);
  }

  update(dt: number) {
    const night = uNight.value;
    const k = Math.max(0, Math.min(1, (night - 0.3) / 0.4));
    this.dotI.value = 2.2 * k; // r252: tail dots share this; headlight dots dimmed via vertex colour
    this.beamI.value = 0.27 * k; // r252: x0.6, was .45
    for (const e of this.extras) e.visible = k > 0.001;
    if (this.light && this.tail && this.base) {
      this.light.emissive.copy(this.base.l).lerp(new Color(0xfff2d8), k);
      this.light.emissiveIntensity = (1 + k * 5) * (1 - 0.4 * k); // r252: night headlight emissive x0.6
      this.tail.emissive.copy(this.base.t).lerp(new Color(0xff2010), k);
      this.tail.emissiveIntensity = 1 + k * 3;
    }
    this.t -= dt;
    if (this.t > 0) return;
    this.t = 1;
    const amb = (this.g.real as unknown as { amb?: Amb }).amb;
    if (!amb) return;
    for (const c of amb.cars) if (!this.done.has(c.g)) this.attach(c.g);
  }
}
