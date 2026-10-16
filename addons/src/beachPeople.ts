// Beach people on Eagle Beach and Manchebo only. Same four-part instanced
// rig as the street crowds (head, torso, two legs, two arms): a handful of
// draws, no skinned meshes. Sunbathers occupy some of the sand chairs the
// pool heroes already place. Swimmers stand in the shallows. Every person
// wears a shirt and shorts — fully clothed or a modest swim shirt, never
// bare skin on the torso or the hips. Off with ?beach=0.
import {
  BoxGeometry, Color, DynamicDrawUsage, Group, InstancedMesh, Matrix4,
  MeshLambertMaterial, Quaternion, SphereGeometry, Vector3,
} from "three";
import type { AGame } from "./env";

type Kind = "sit" | "lounge" | "wade";
type Person = {
  x: number; z: number; yaw: number; kind: Kind;
  skin: number; top: number; bottom: number; phase: number;
};

const SKINS = [0x6f3f2b, 0x92583b, 0xb97954, 0xd59a72, 0xedc29e];
// Shirt and rash-guard colours. None of these are a skin tone.
const TOPS = [0x1f4e79, 0xf4f1ea, 0x1a8a8a, 0xd4654a, 0x2f7d4a, 0x3d6ea8];
const BOTTOMS = [0x1c2838, 0x22262c, 0xc2b280, 0xe8e4dc, 0x334c69];
const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);

// Sand chairs from the Eagle / Manchebo pool heroes (groups of two or three
// just in from the tide line). One chair in each group stays empty.
// Swimmers are on the shallow shelf a few metres further seaward, where the
// seabed is about knee to thigh depth. Yaw faces the hotels, inland.
const PEOPLE: ReadonlyArray<Omit<Person, "phase">> = [
  // Amsterdam Manor sand, Eagle Beach. Clothed, sitting.
  { x: -9257.4, z: -3848.0, yaw: -1.57, kind: "sit", skin: SKINS[0], top: TOPS[1], bottom: BOTTOMS[0] },
  { x: -9270.7, z: -3844.0, yaw: 1.57, kind: "wade", skin: SKINS[2], top: TOPS[2], bottom: BOTTOMS[3] },
  // Open Eagle Beach, north of the fofoti, two waders in the shallows.
  { x: -9278.0, z: -4040.0, yaw: 1.57, kind: "wade", skin: SKINS[1], top: TOPS[5], bottom: BOTTOMS[4] },
  { x: -9316.0, z: -3700.0, yaw: 1.57, kind: "wade", skin: SKINS[3], top: TOPS[2], bottom: BOTTOMS[0] },
  // Costa Linda. One reclined in a swim shirt, one sitting clothed, one wader.
  { x: -10094.8, z: -2594.6, yaw: -1.98, kind: "lounge", skin: SKINS[4], top: TOPS[2], bottom: BOTTOMS[3] },
  { x: -10094.6, z: -2589.4, yaw: -1.98, kind: "sit", skin: SKINS[1], top: TOPS[0], bottom: BOTTOMS[2] },
  { x: -10108.0, z: -2596.0, yaw: 1.16, kind: "wade", skin: SKINS[2], top: TOPS[5], bottom: BOTTOMS[4] },
  // Bucuti & Tara.
  { x: -10169.8, z: -2438.0, yaw: -1.98, kind: "lounge", skin: SKINS[0], top: TOPS[3], bottom: BOTTOMS[3] },
  { x: -10179.0, z: -2442.0, yaw: 1.16, kind: "wade", skin: SKINS[4], top: TOPS[2], bottom: BOTTOMS[0] },
  // Manchebo.
  { x: -10194.6, z: -2306.0, yaw: -1.98, kind: "sit", skin: SKINS[3], top: TOPS[4], bottom: BOTTOMS[0] },
  { x: -10194.8, z: -2303.4, yaw: -1.98, kind: "lounge", skin: SKINS[2], top: TOPS[5], bottom: BOTTOMS[3] },
  { x: -10204.0, z: -2310.0, yaw: 1.16, kind: "wade", skin: SKINS[1], top: TOPS[2], bottom: BOTTOMS[4] },
];

export class BeachPeople {
  stats = { pooled: 0, visible: 0, draws: 0, triangles: 0 };
  private people: Person[];
  private group = new Group();
  private head: InstancedMesh;
  private torso: InstancedMesh;
  private legs: InstancedMesh;
  private arms: InstancedMesh;
  private meshes: InstancedMesh[];
  private root = new Matrix4();
  private local = new Matrix4();
  private world = new Matrix4();
  private pos = new Vector3();
  private scale = new Vector3();
  private quat = new Quaternion();
  private qYaw = new Quaternion();
  private qPitch = new Quaternion();
  private tint = new Color();
  private lod2: number;
  private cap: number;
  private hidden = true;

  constructor(private g: AGame) {
    const tier = g.real!.q.name;
    this.cap = tier === "low" ? 6 : tier === "med" ? 10 : 14;
    const lod = tier === "low" ? 140 : 180;
    this.lod2 = lod * lod;
    this.people = PEOPLE.map((p, i) => ({ ...p, phase: (i * 2.399963) % (Math.PI * 2) }));
    this.stats.pooled = this.people.length;

    this.group.name = "aw:beachPeople";
    const skin = new MeshLambertMaterial({ color: 0xffffff });
    const cloth = new MeshLambertMaterial({ color: 0xffffff });
    const pants = new MeshLambertMaterial({ color: 0xffffff });
    this.head = this.mesh(new SphereGeometry(1, 6, 4), skin, this.cap, "heads");
    this.torso = this.mesh(new BoxGeometry(1, 1, 1), cloth, this.cap, "torsos");
    this.legs = this.mesh(new BoxGeometry(1, 1, 1), pants, this.cap * 2, "legs");
    this.arms = this.mesh(new BoxGeometry(1, 1, 1), skin, this.cap * 2, "arms");
    this.meshes = [this.head, this.torso, this.legs, this.arms];
    this.group.add(this.head, this.torso, this.legs, this.arms);
    g.scene.add(this.group);
  }

  private mesh(geo: BoxGeometry | SphereGeometry, mat: MeshLambertMaterial, count: number, name: string) {
    const mesh = new InstancedMesh(geo, mat, count);
    mesh.name = `aw:beachPeople:${name}`;
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false;
    mesh.castShadow = this.g.real!.q.name !== "low";
    mesh.count = 0;
    return mesh;
  }

  private height(x: number, z: number) {
    const real = this.g.real as unknown as { heightAt?: (x: number, z: number) => number };
    const h = real.heightAt ? real.heightAt(x, z) : 0;
    return h;
  }

  private put(mesh: InstancedMesh, index: number, x: number, y: number, z: number,
    rx: number, sx: number, sy: number, sz: number) {
    this.pos.set(x, y, z);
    this.quat.setFromAxisAngle(X_AXIS, rx);
    this.scale.set(sx, sy, sz);
    this.local.compose(this.pos, this.quat, this.scale);
    this.world.multiplyMatrices(this.root, this.local);
    mesh.setMatrixAt(index, this.world);
  }

  private draw(p: Person, index: number, time: number) {
    const h = this.height(p.x, p.z);
    const wade = p.kind === "wade";
    if (wade) {
      const bob = Math.sin(time * 1.5 + p.phase) * 0.035;
      this.root.makeRotationY(p.yaw);
      // The rig's feet sit about 0.33 above the origin, same as the street crowds.
      this.root.setPosition(p.x, h + 0.02 + bob, p.z);
    } else {
      // Pitch back onto the chair: sit is upright, lounge is reclined.
      // Both rest on the cushion. Sit is propped up; lounge is nearly flat.
      const pitch = p.kind === "sit" ? -1.02 : -1.18;
      this.qPitch.setFromAxisAngle(X_AXIS, pitch);
      this.qYaw.setFromAxisAngle(Y_AXIS, p.yaw);
      this.root.makeRotationFromQuaternion(this.qYaw.multiply(this.qPitch));
      this.root.setPosition(p.x, h + (p.kind === "sit" ? 0.22 : 0.28), p.z);
    }
    const sway = wade ? Math.sin(time * 1.2 + p.phase) * 0.28 : 0;
    this.put(this.head, index, 0, 1.77, 0, 0, 0.18, 0.2, 0.18);
    this.put(this.torso, index, 0, 1.29, 0, 0, 0.36, 0.56, 0.24);
    this.put(this.legs, index * 2, -0.1, 0.62, 0, 0, 0.13, 0.66, 0.15);
    this.put(this.legs, index * 2 + 1, 0.1, 0.62, 0, 0, 0.13, 0.66, 0.15);
    // Arms down, covered by the shirt sleeve at the shoulder. Waders paddle a little.
    this.put(this.arms, index * 2, -0.3, 1.2, 0, wade ? -0.35 + sway : 0.25, 0.09, 0.5, 0.1);
    this.put(this.arms, index * 2 + 1, 0.3, 1.2, 0, wade ? -0.35 - sway : 0.15, 0.09, 0.5, 0.1);
    this.head.setColorAt(index, this.tint.setHex(p.skin));
    this.torso.setColorAt(index, this.tint.setHex(p.top));
    this.legs.setColorAt(index * 2, this.tint.setHex(p.bottom));
    this.legs.setColorAt(index * 2 + 1, this.tint);
    this.arms.setColorAt(index * 2, this.tint.setHex(p.skin));
    this.arms.setColorAt(index * 2 + 1, this.tint);
  }

  update(_dt: number, time: number) {
    const cam = this.g.camera.position;
    const near: { p: Person; d: number }[] = [];
    for (const p of this.people) {
      const dx = p.x - cam.x, dz = p.z - cam.z;
      const d = dx * dx + dz * dz;
      if (d < this.lod2) near.push({ p, d });
    }
    if (!near.length) {
      if (!this.hidden) {
        for (const mesh of this.meshes) {
          mesh.count = 0;
          mesh.visible = false;
        }
        this.hidden = true;
        this.stats.visible = 0;
        this.stats.draws = 0;
        this.stats.triangles = 0;
      }
      return;
    }
    this.hidden = false;
    near.sort((a, b) => a.d - b.d);
    const show = near.slice(0, this.cap);
    for (let i = 0; i < show.length; i++) this.draw(show[i].p, i, time);
    const n = show.length;
    this.head.count = n;
    this.torso.count = n;
    this.legs.count = n * 2;
    this.arms.count = n * 2;
    for (const mesh of this.meshes) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.visible = mesh.count > 0;
    }
    this.stats.visible = n;
    this.stats.draws = 4;
    this.stats.triangles = n * 96;
  }
}
