// Runtime clothing repair for the painterly pedestrians. The dress file stores
// the skirt as a pelvis-only cone and has no leg mesh, and Maya's long hair is
// a stack of flat cards. Both are rebuilt on the merged skin so every clone
// shares the result. The walk clip itself is unchanged — the player uses it.
import {
  BufferGeometry, Float32BufferAttribute, Matrix4, Mesh, Uint16BufferAttribute, Vector3,
  type Material, type SkinnedMesh,
} from "three";

type Tiles = { grid?: number; tiles?: Record<string, number[]> };

const _v = new Vector3();
const _local = new Vector3();
const _boneSkin = new Matrix4();
const _boneSkinInv = new Matrix4();
const _meshInv = new Matrix4();

function tileOf(u: number, v: number, grid: number) {
  return Math.floor(u * grid) + grid * Math.floor(v * grid);
}

/**
 * Hair volume parented to the head bone, in that bone's local space
 * (+Y up the skull, +Z out of the face). The shell covers the scalp and
 * falls from the occiput. It stays off the face, so it cannot sit on the
 * shoulders or cross in front of the nose.
 */
function parentHairToHead(
  headBone: SkinnedMesh["skeleton"]["bones"][number],
  material: Material | Material[],
  hairTile: number,
  grid: number,
) {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const sides = 9;
  const a0 = Math.PI * 0.78;
  const a1 = Math.PI * 2.22;
  const rings = 10;
  const centerAt = (t: number) => {
    const y = 0.145 - t * 0.52;
    const settle = Math.sin(Math.min(t, 0.4) / 0.4 * Math.PI * 0.5);
    const z = 0.01 - settle * 0.07 - Math.max(0, t - 0.4) * 0.05;
    const radius = t < 0.36 ? 0.09 - t * 0.015 : Math.max(0.03, 0.084 - (t - 0.36) * 0.08);
    return { y, z, radius };
  };
  const push = (x: number, y: number, z: number, along: number, around: number) => {
    const id = positions.length / 3;
    positions.push(x, y, z);
    const tex = tileUV(hairTile, grid, around, along);
    uvs.push(tex[0], tex[1]);
    return id;
  };
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const c = centerAt(t);
    for (let s = 0; s < sides; s++) {
      const u = s / (sides - 1);
      const ang = a0 + u * (a1 - a0);
      push(Math.cos(ang) * c.radius * 1.02, c.y, c.z + Math.sin(ang) * c.radius, t, u);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let s = 0; s < sides - 1; s++) {
      const a = i * sides + s;
      const b = a + 1;
      const c = a + sides;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const crown = centerAt(0);
  const cap = push(0, crown.y + 0.025, crown.z - 0.01, 0, 0.5);
  for (let s = 0; s < sides - 1; s++) indices.push(cap, s + 1, s);

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const hair = new Mesh(geo, material);
  hair.name = "aw:hair";
  hair.frustumCulled = false;
  hair.castShadow = false;
  hair.receiveShadow = true;
  const previous = headBone.children.find((child) => child.name === "aw:hair");
  if (previous) headBone.remove(previous);
  headBone.add(hair);
}

function tileUV(tile: number, grid: number, around: number, along: number): [number, number] {
  const tx = ((tile % grid) + grid) % grid;
  const ty = Math.floor(tile / grid);
  const margin = 0.18;
  const span = 1 - margin * 2;
  return [(tx + margin + around * span) / grid, (ty + margin + along * span) / grid];
}

type Acc = { pos: number[]; uv: number[]; skin: number[]; weight: number[]; index: number[] };

/**
 * Short opaque skirt with the legs visible, and a solid hair volume.
 * Runs once per source mesh, in bind pose.
 */
export function repairCharacterGeometry(mesh: SkinnedMesh) {
  if (mesh.userData.awRepaired) return;
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const meta = (material as { userData?: { awPainterly?: Tiles } }).userData?.awPainterly;
  const tiles = meta?.tiles;
  if (!tiles) return;
  const grid = meta.grid || 4;
  const hairTiles = new Set(tiles.hair || []);
  const dressTiles = new Set(tiles.dress || []);
  if (!hairTiles.size && !dressTiles.size) return;
  const skinTile = tiles.skin?.[0] ?? 5;
  const dressTile = tiles.dress?.[0] ?? 6;
  const hairTile = tiles.hair?.[tiles.hair.length - 1] ?? 7;

  const geometry = mesh.geometry;
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const skinIndex = geometry.getAttribute("skinIndex");
  const skinWeight = geometry.getAttribute("skinWeight");
  const indexAttr = geometry.getIndex();
  if (!position || !uv || !skinIndex || !skinWeight || !indexAttr) return;

  let top = mesh as SkinnedMesh | { parent: SkinnedMesh["parent"] };
  while (top.parent) top = top.parent as typeof top;
  (top as SkinnedMesh).updateMatrixWorld(true);

  const names = new Map(mesh.skeleton.bones.map((bone, i) => [bone.name, i]));
  const pelvis = names.get("pelvis");
  const head = names.get("head");
  if (pelvis === undefined || head === undefined) return;

  _meshInv.copy(mesh.matrixWorld).invert();
  _boneSkin.multiplyMatrices(mesh.skeleton.bones[pelvis].matrixWorld, mesh.skeleton.boneInverses[pelvis]);
  _boneSkinInv.copy(_boneSkin).invert();

  // visual = meshWorld * bindInverse * boneSkin * bind * local
  const toLocal = (world: Vector3, out: Vector3) => out.copy(world)
    .applyMatrix4(_meshInv)
    .applyMatrix4(mesh.bindMatrix)
    .applyMatrix4(_boneSkinInv)
    .applyMatrix4(mesh.bindMatrixInverse);
  const toWorldY = (vertex: number) => {
    _v.set(position.getX(vertex), position.getY(vertex), position.getZ(vertex));
    _v.applyMatrix4(mesh.bindMatrix).applyMatrix4(_boneSkin).applyMatrix4(mesh.bindMatrixInverse).applyMatrix4(mesh.matrixWorld);
    return _v.y;
  };

  let probe = -1;
  for (let i = 0; i < position.count && probe < 0; i++) {
    for (let k = 0; k < 4; k++) {
      const joint = Math.round(skinIndex.getComponent(i, k));
      if (joint === head && skinWeight.getComponent(i, k) > 0.8) probe = i;
    }
  }
  if (probe < 0) return;
  const probeY = toWorldY(probe);
  if (probeY < 0.8 || probeY > 2.2) {
    console.warn("[aw-characters] skip clothing repair, head probe", probeY.toFixed(2));
    return;
  }

  const bonePos = (name: string) => {
    const id = names.get(name);
    if (id === undefined) return null;
    return new Vector3().setFromMatrixPosition(mesh.skeleton.bones[id].matrixWorld);
  };
  const pelvisP = bonePos("pelvis");
  const headP = bonePos("head");
  const thighL = bonePos("thigh_l");
  const thighR = bonePos("thigh_r");
  const calfL = bonePos("calf_l");
  const calfR = bonePos("calf_r");
  const footL = bonePos("foot_l");
  const footR = bonePos("foot_r");
  if (!pelvisP || !headP || !thighL || !thighR || !calfL || !calfR || !footL || !footR) return;

  let hairMin = Infinity;
  let hairMax = -Infinity;
  let hairTris = 0;
  let dressTris = 0;
  const triCount = indexAttr.count / 3;
  const dropHair = new Set<number>();
  const dropDress = new Set<number>();
  const dropSliver = new Set<number>();
  for (let t = 0; t < triCount; t++) {
    const a = indexAttr.getX(t * 3);
    const tile = tileOf(uv.getX(a), uv.getY(a), grid);
    // Eyebrow and eyelash cards sit just proud of the face and read as a
    // thin sliver from the side. The portrait card carries those features.
    if (tile === 0 || tile === 1) dropSliver.add(t);
    if (dressTiles.has(tile)) {
      dressTris++;
      dropDress.add(t);
    } else if (hairTiles.has(tile)) {
      hairTris++;
      for (let k = 0; k < 3; k++) {
        const y = toWorldY(indexAttr.getX(t * 3 + k));
        hairMin = Math.min(hairMin, y);
        hairMax = Math.max(hairMax, y);
      }
      dropHair.add(t);
    }
  }
  const longHair = hairTris > 20 && hairMax - hairMin > 0.5;
  if (!dressTris && !longHair) return;

  const pos: number[] = [];
  const uvs: number[] = [];
  const skins: number[] = [];
  const weights: number[] = [];
  const indices: number[] = [];
  const remap = new Map<number, number>();
  const take = (old: number) => {
    const found = remap.get(old);
    if (found !== undefined) return found;
    const id = pos.length / 3;
    remap.set(old, id);
    pos.push(position.getX(old), position.getY(old), position.getZ(old));
    uvs.push(uv.getX(old), uv.getY(old));
    skins.push(
      Math.round(skinIndex.getX(old)), Math.round(skinIndex.getY(old)),
      Math.round(skinIndex.getZ(old)), Math.round(skinIndex.getW(old)),
    );
    weights.push(skinWeight.getX(old), skinWeight.getY(old), skinWeight.getZ(old), skinWeight.getW(old));
    return id;
  };
  for (let t = 0; t < triCount; t++) {
    if (dropDress.has(t) || dropSliver.has(t)) continue;
    if (longHair && dropHair.has(t)) continue;
    indices.push(take(indexAttr.getX(t * 3)), take(indexAttr.getY(t * 3)), take(indexAttr.getZ(t * 3)));
  }

  const acc: Acc = { pos: [], uv: [], skin: [], weight: [], index: [] };
  const push = (world: Vector3, along: number, around: number, tile: number, joints: number[], w: number[]) => {
    const id = acc.pos.length / 3;
    toLocal(world, _local);
    acc.pos.push(_local.x, _local.y, _local.z);
    const tex = tileUV(tile, grid, around, along);
    acc.uv.push(tex[0], tex[1]);
    const ww = [w[0] || 0, w[1] || 0, w[2] || 0, w[3] || 0];
    const sum = ww[0] + ww[1] + ww[2] + ww[3] || 1;
    acc.skin.push(joints[0] || 0, joints[1] || 0, joints[2] || 0, joints[3] || 0);
    acc.weight.push(ww[0] / sum, ww[1] / sum, ww[2] / sum, ww[3] / sum);
    return id;
  };

  const addTube = (
    centers: Vector3[],
    radii: number[],
    sides: number,
    tile: number,
    jointsAt: (t: number) => number[],
    weightsAt: (t: number) => number[],
  ) => {
    const base = acc.pos.length / 3;
    for (let i = 0; i < centers.length; i++) {
      const t = centers.length === 1 ? 0 : i / (centers.length - 1);
      const center = centers[i];
      const radius = radii[i];
      for (let s = 0; s < sides; s++) {
        const ang = (s / sides) * Math.PI * 2;
        // Hair uses a deeper cross-section; limbs and the default stay round.
        const depth = tile === hairTile ? radius * 1.35 : radius;
        const width = tile === hairTile ? radius * 1.15 : radius;
        _v.set(center.x + Math.cos(ang) * width, center.y, center.z + Math.sin(ang) * depth);
        push(_v, t, s / sides, tile, jointsAt(t), weightsAt(t));
      }
    }
    for (let i = 0; i < centers.length - 1; i++) {
      for (let s = 0; s < sides; s++) {
        const s2 = (s + 1) % sides;
        const a = base + i * sides + s;
        const b = base + i * sides + s2;
        const c = base + (i + 1) * sides + s;
        const d = base + (i + 1) * sides + s2;
        acc.index.push(a, b, c, b, d, c);
      }
    }
    const cap = (ring: number, inward: boolean) => {
      const t = ring === 0 ? 0 : 1;
      const id = push(centers[ring], t, 0.5, tile, jointsAt(t), weightsAt(t));
      const row = base + ring * sides;
      for (let s = 0; s < sides; s++) {
        const s2 = (s + 1) % sides;
        if (inward) acc.index.push(id, row + s2, row + s);
        else acc.index.push(id, row + s, row + s2);
      }
    };
    cap(0, true);
    cap(centers.length - 1, false);
  };

  if (dressTris) {
    const thighLI = names.get("thigh_l")!;
    const thighRI = names.get("thigh_r")!;
    const calfLI = names.get("calf_l")!;
    const calfRI = names.get("calf_r")!;
    const waistY = pelvisP.y + 0.16;
    const hemY = (calfL.y + calfR.y) * 0.5 + 0.08;
    const cols = 14;
    const rows = 4;
    const skirtBase = acc.pos.length / 3;
    const stride = cols + 1;
    for (let j = 0; j <= rows; j++) {
      const t = j / rows;
      const y = waistY + (hemY - waistY) * t;
      const rx = 0.16 + t * 0.05;
      const rz = 0.13 + t * 0.035;
      for (let i = 0; i <= cols; i++) {
        const ang = (i / cols) * Math.PI * 2;
        const x = Math.sin(ang) * rx;
        _v.set(pelvisP.x + x, y, pelvisP.z + Math.cos(ang) * rz);
        const thigh = x >= 0 ? thighLI : thighRI;
        const follow = Math.abs(x) < 0.05 ? 0 : t * t * 0.7;
        push(_v, t, i / cols, dressTile, [pelvis, thigh, 0, 0], [1 - follow, follow, 0, 0]);
      }
    }
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = skirtBase + j * stride + i;
        acc.index.push(a, a + 1, a + stride, a + 1, a + stride + 1, a + stride);
      }
    }
    // Pelvis-locked panel, so a step cannot open the skirt over the hips.
    const y0 = waistY;
    const y1 = hemY;
    const corners = [
      [-0.075, y0, 0.045], [0.075, y0, 0.045], [0.085, y1, 0.05], [-0.085, y1, 0.05],
      [-0.075, y0, -0.045], [0.075, y0, -0.045], [0.085, y1, -0.05], [-0.085, y1, -0.05],
    ];
    const p0 = acc.pos.length / 3;
    for (const [x, y, z] of corners) {
      _v.set(pelvisP.x + x, y, pelvisP.z + z);
      push(_v, y === y0 ? 0 : 1, 0.5, dressTile, [pelvis, 0, 0, 0], [1, 0, 0, 0]);
    }
    const quad = (a: number, b: number, c: number, d: number) => {
      acc.index.push(p0 + a, p0 + b, p0 + c, p0 + a, p0 + c, p0 + d);
    };
    quad(0, 1, 2, 3);
    quad(5, 4, 7, 6);
    quad(4, 0, 3, 7);
    quad(1, 5, 6, 2);
    quad(4, 5, 1, 0);
    quad(3, 2, 6, 7);

    const bulb = (center: Vector3, radius: number, bone: number) => {
      const up = center.clone();
      up.y += radius * 0.45;
      const down = center.clone();
      down.y -= radius * 0.45;
      addTube(
        [up, center.clone(), down],
        [radius * 0.82, radius, radius * 0.82],
        8, skinTile,
        () => [bone, 0, 0, 0],
        () => [1, 0, 0, 0],
      );
    };
    const leg = (hip: Vector3, knee: Vector3, foot: Vector3, thighI: number, calfI: number, footI: number) => {
      const belowHip = hip.clone().lerp(knee, 0.02);
      const overKnee = knee.clone().lerp(foot, 0.22);
      const intoShoe = foot.clone().lerp(knee, -0.35);
      addTube(
        [belowHip, knee.clone().lerp(hip, 0.35), overKnee],
        [0.078, 0.064, 0.058],
        8, skinTile,
        () => [thighI, 0, 0, 0],
        () => [1, 0, 0, 0],
      );
      addTube(
        [knee.clone().lerp(hip, 0.2), knee.clone().lerp(foot, 0.5), intoShoe],
        [0.06, 0.05, 0.048],
        8, skinTile,
        () => [calfI, 0, 0, 0],
        () => [1, 0, 0, 0],
      );
      bulb(knee, 0.062, thighI);
      bulb(foot, 0.05, footI);
    };
    leg(thighL, calfL, footL, thighLI, calfLI, names.get("foot_l")!);
    leg(thighR, calfR, footR, thighRI, calfRI, names.get("foot_r")!);
  }

  // The skull mesh never reaches the back of the neck, so the head reads as
  // floating. A short neck, weighted to the neck bone, closes that gap.
  const neckI = names.get("neck_01");
  const neckP = bonePos("neck_01");
  if (neckI !== undefined && neckP) {
    const axis = headP.clone().sub(neckP);
    const length = axis.length() || 0.1;
    const up = axis.multiplyScalar(1 / length);
    const rings = 5;
    const centers: Vector3[] = [];
    const radii: number[] = [];
    for (let i = 0; i <= rings; i++) {
      const t = i / rings;
      centers.push(neckP.clone().addScaledVector(up, length * (0.02 + t * 0.9)));
      radii.push(0.046 + t * 0.008);
    }
    addTube(
      centers, radii, 10, skinTile,
      () => [neckI, head, 0, 0],
      (t) => [1 - t * 0.8, t * 0.8, 0, 0],
    );
  }

  if (longHair) parentHairToHead(mesh.skeleton.bones[head], mesh.material, hairTile, grid);

  const offset = pos.length / 3;
  for (const value of acc.pos) pos.push(value);
  for (const value of acc.uv) uvs.push(value);
  for (const value of acc.skin) skins.push(value);
  for (const value of acc.weight) weights.push(value);
  for (const id of acc.index) indices.push(id + offset);

  const next = new BufferGeometry();
  next.setAttribute("position", new Float32BufferAttribute(pos, 3));
  next.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  next.setAttribute("skinIndex", new Uint16BufferAttribute(skins, 4));
  next.setAttribute("skinWeight", new Float32BufferAttribute(weights, 4));
  next.setIndex(indices);
  next.computeVertexNormals();
  geometry.dispose();
  mesh.geometry = next;
  mesh.userData.awRepaired = true;
  console.info(
    "[aw-characters] clothing",
    mesh.name || "skin",
    dressTris ? "skirt+legs" : "no-skirt",
    longHair ? "head-hair" : "hair-kept",
    "tris", Math.round(indices.length / 3),
  );
}
