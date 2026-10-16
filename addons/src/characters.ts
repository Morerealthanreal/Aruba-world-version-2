import {
  BufferGeometry, Color, Float32BufferAttribute, LinearFilter, LinearMipmapLinearFilter,
  Matrix4, Mesh, MeshBasicMaterial, MeshStandardMaterial, SkinnedMesh, SRGBColorSpace, Texture, TextureLoader,
  Vector3, Vector4,
  type BufferAttribute, type InterleavedBufferAttribute, type Object3D,
  type WebGLRenderer,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { repairCharacterGeometry } from "./pedestrianRepair";

type Shader = {
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
  fragmentShader: string;
};

export type CharacterPalette = {
  skin: number; hair: number; top: number; bottom: number; dress: number;
};

export type CharacterPaint = {
  time: { value: number };
  phase: { value: number };
  skin: { value: Color };
  hair: { value: Color };
  top: { value: Color };
  bottom: { value: Color };
  dress: { value: Color };
  portrait: { value: number };
  headInv: { value: Matrix4 };
};

export type CharacterMetrics = { draws: number; triangles: number };
export type PreparedCharacterSource = { gl: GLTF; metrics: CharacterMetrics };

export const CHARACTER_PALETTES: readonly CharacterPalette[] = [
  { skin: 0xfff4e8, hair: 0x5b2f1d, top: 0xd96f56, bottom: 0x31546b, dress: 0xc65d53 },
  { skin: 0xe7b894, hair: 0x2b1b18, top: 0xf0b34f, bottom: 0x3f5d48, dress: 0xde8c42 },
  { skin: 0xc98b68, hair: 0x1d1716, top: 0x6c94a8, bottom: 0x453a58, dress: 0x7b527f },
  { skin: 0x9f674e, hair: 0x3c2117, top: 0x4f8c77, bottom: 0x443b36, dress: 0x4f718d },
  { skin: 0x7b4c3a, hair: 0x171313, top: 0xb8564c, bottom: 0x2f414f, dress: 0x9f3f4c },
  { skin: 0xd9a37d, hair: 0x805029, top: 0xe1c587, bottom: 0x5d566d, dress: 0x527f78 },
];

let loader: GLTFLoader | null = null;
const sourceCache = new Map<string, Promise<PreparedCharacterSource>>();
// Shared across every painted character. Afternoon fallback until the live sun is copied in.
const sunDir = new Vector3(0.2, 0.78, 0.55).normalize();
const _portraitInv = new Matrix4();

// Bottom-up crop of each painting onto the portrait card (chin at v=0, forehead at v=1).
const FACE_CROP = [
  new Vector4(0.16, 0.08, 0.68, 0.84),
  new Vector4(0.28, 0.12, 0.44, 0.76),
  new Vector4(0.30, 0.18, 0.40, 0.64),
];
// 7×9 quads. Three cards is a few hundred triangles, only while those people are close.
export const FACE_CARD_TRIS = 7 * 9 * 2;
const FACE_FILES = ["face-maya.jpg", "face-dress.jpg", "face-sam.jpg"];

function createFaceTexture(): Texture {
  const face = new Texture();
  face.colorSpace = SRGBColorSpace;
  face.magFilter = LinearFilter;
  face.minFilter = LinearFilter;
  return face;
}

const faceTextures = [createFaceTexture(), createFaceTexture(), createFaceTexture()];
let faceLoad: Promise<void> | null = null;

export function loadFacePortraits(): Promise<void> {
  if (faceLoad) return faceLoad;
  const loader = new TextureLoader();
  faceLoad = Promise.all(FACE_FILES.map((file, index) => loader.loadAsync(`./models/faces/${file}`).then((loaded) => {
    const face = faceTextures[index];
    face.image = loaded.image;
    face.colorSpace = SRGBColorSpace;
    face.flipY = true;
    face.magFilter = LinearFilter;
    face.minFilter = LinearMipmapLinearFilter;
    face.generateMipmaps = true;
    face.anisotropy = 4;
    face.needsUpdate = true;
  }).catch((error) => {
    console.warn("[aw-characters] face portrait", file, error);
  }))).then(() => undefined);
  return faceLoad;
}

export function findCharacterFace(root: Object3D): { mesh: SkinnedMesh | null; head: Object3D | null } {
  let mesh: SkinnedMesh | null = null;
  let head: Object3D | null = null;
  root.traverse((object) => {
    const skinned = object as SkinnedMesh;
    if (skinned.isSkinnedMesh) mesh = skinned;
    const bone = object as Object3D & { isBone?: boolean };
    if (!head && bone.isBone && object.name === "head") head = object;
  });
  return { mesh, head };
}

/** Portrait on/off. The card follows the head bone; the rig shader only clears hair over the face. */
export function setCharacterPortrait(
  paints: CharacterPaint[],
  enabled: boolean,
  mesh: SkinnedMesh | null,
  head: Object3D | null,
) {
  const on = enabled && !!mesh && !!head;
  if (on && mesh && head) {
    mesh.updateWorldMatrix(true, false);
    head.updateWorldMatrix(true, false);
    _portraitInv.copy(head.matrixWorld).invert().multiply(mesh.matrixWorld);
  }
  for (const paint of paints) {
    paint.portrait.value = on ? 1 : 0;
    if (on) paint.headInv.value.copy(_portraitInv);
  }
  if (!head) return;
  for (const child of head.children) {
    if (child.name === "aw:face-portrait") child.visible = on;
  }
}

let faceCardGeo: BufferGeometry | null = null;
const faceCardMaterials: MeshBasicMaterial[] = [];

function faceCardGeometry(): BufferGeometry {
  if (faceCardGeo) return faceCardGeo;
  const cols = 7;
  const rows = 9;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let j = 0; j <= rows; j++) {
    const v = j / rows;
    for (let i = 0; i <= cols; i++) {
      const u = i / cols;
      const x = (u - 0.5) * 0.140;
      const y = -0.078 + v * 0.214;
      const nx = x / 0.082;
      const ny = (y - 0.016) / 0.108;
      const bulge = Math.sqrt(Math.max(0.22, 1 - nx * nx * 0.55 - ny * ny * 0.16));
      positions.push(x, y, 0.05 + 0.112 * bulge);
      uvs.push(u, v);
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i;
      const stride = cols + 1;
      indices.push(a, a + 1, a + stride, a + 1, a + stride + 1, a + stride);
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  faceCardGeo = geo;
  return geo;
}

function faceCardMaterial(kind: number): MeshBasicMaterial {
  const existing = faceCardMaterials[kind];
  if (existing) return existing;
  const crop = FACE_CROP[kind];
  const material = new MeshBasicMaterial({
    map: faceTextures[kind],
    toneMapped: true,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uAwCrop = { value: crop };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec4 uAwCrop;`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
vec2 awC = vMapUv - vec2(0.5, 0.46);
if ((awC.x * awC.x) / 0.21 + (awC.y * awC.y) / 0.27 > 1.0) discard;
diffuseColor = vec4(texture2D(map, uAwCrop.xy + vMapUv * uAwCrop.zw).rgb, 1.0);`,
      );
  };
  material.customProgramCacheKey = () => "aw-face-card-v1";
  faceCardMaterials[kind] = material;
  return material;
}

export function attachFacePortrait(head: Object3D, faceKind: number): Mesh {
  const kind = ((faceKind % 3) + 3) % 3;
  const card = new Mesh(faceCardGeometry(), faceCardMaterial(kind));
  card.name = "aw:face-portrait";
  card.frustumCulled = false;
  card.renderOrder = 2;
  card.visible = false;
  head.add(card);
  return card;
}

export function characterLoader(renderer: WebGLRenderer): GLTFLoader {
  if (loader) return loader;
  const ktx = new KTX2Loader()
    .setTranscoderPath("./basis/")
    .setWorkerLimit(2)
    .detectSupport(renderer);
  loader = new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .setKTX2Loader(ktx);
  return loader;
}

export function loadCharacterSource(
  renderer: WebGLRenderer,
  file: string,
): Promise<PreparedCharacterSource> {
  let source = sourceCache.get(file);
  if (!source) {
    source = characterLoader(renderer).loadAsync(`./models/${file}`).then((gl) => ({
      gl,
      metrics: prepareCharacterSource(gl),
    }));
    sourceCache.set(file, source);
  }
  return source;
}

function triangles(mesh: Mesh) {
  const geometry = mesh.geometry;
  return (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3;
}

function asFloat(
  attribute: BufferAttribute | InterleavedBufferAttribute,
): Float32BufferAttribute {
  const values = new Float32Array(attribute.count * attribute.itemSize);
  for (let i = 0; i < attribute.count; i++) {
    const offset = i * attribute.itemSize;
    values[offset] = attribute.getX(i);
    if (attribute.itemSize > 1) values[offset + 1] = attribute.getY(i);
    if (attribute.itemSize > 2) values[offset + 2] = attribute.getZ(i);
    if (attribute.itemSize > 3) values[offset + 3] = attribute.getW(i);
  }
  return new Float32BufferAttribute(values, attribute.itemSize);
}

function geometryInBindSpace(mesh: SkinnedMesh, target: SkinnedMesh) {
  const geometry = mesh.geometry.clone();
  // KHR_mesh_quantization stores each source part in its own normalized object
  // space. Convert only transformed attributes to float before rebasing so
  // values outside [-1, 1] are not clamped by normalized integer setters.
  geometry.setAttribute("position", asFloat(geometry.getAttribute("position")));
  geometry.setAttribute("normal", asFloat(geometry.getAttribute("normal")));
  const tangent = geometry.getAttribute("tangent");
  if (tangent) geometry.setAttribute("tangent", asFloat(tangent));

  // glTF's inverse bind matrices differ by a constant object-space transform
  // for each part. Rebase every part to the target skin before merging.
  const transform = new Matrix4()
    .copy(target.skeleton.boneInverses[0])
    .invert()
    .multiply(mesh.skeleton.boneInverses[0]);
  geometry.applyMatrix4(transform);
  return geometry;
}

/**
 * All source primitives use one atlas material and one skeleton. Merge once
 * before cloning so every crowd rig shares the resulting geometry and texture.
 */
export function prepareCharacterSource(gl: GLTF): CharacterMetrics {
  const skins: SkinnedMesh[] = [];
  gl.scene.traverse((object) => {
    const mesh = object as SkinnedMesh;
    if (mesh.isSkinnedMesh) skins.push(mesh);
  });
  if (!skins.length) throw new Error("Character source has no skinned mesh");
  if (skins.length > 1) {
    const target = skins.find((mesh) => mesh.name === "base") || skins[0];
    const geometry = mergeGeometries(
      skins.map((mesh) => geometryInBindSpace(mesh, target)),
      false,
    );
    if (!geometry) throw new Error("Character source geometry could not be merged");
    geometry.clearGroups();
    const parent = target.parent || gl.scene;
    const sourceMaterial = Array.isArray(target.material) ? target.material[0] : target.material;
    const merged = new SkinnedMesh(geometry, sourceMaterial);
    merged.name = "aw:character:shared-skin";
    merged.bindMode = target.bindMode;
    merged.bind(target.skeleton, target.bindMatrix);
    merged.position.copy(target.position);
    merged.quaternion.copy(target.quaternion);
    merged.scale.copy(target.scale);
    for (const mesh of skins) mesh.parent?.remove(mesh);
    parent.add(merged);
  }

  gl.scene.updateMatrixWorld(true);
  gl.scene.traverse((object) => {
    const skinned = object as SkinnedMesh;
    if (skinned.isSkinnedMesh) repairCharacterGeometry(skinned);
  });

  let draws = 0;
  let triangleCount = 0;
  gl.scene.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    draws++;
    triangleCount += triangles(mesh);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
  });
  return { draws, triangles: triangleCount };
}

function tileCondition(tiles: unknown, variable: string) {
  if (!Array.isArray(tiles) || !tiles.length) return "false";
  return tiles.map((tile) => `abs(${variable} - ${Number(tile).toFixed(1)}) < 0.25`).join(" || ");
}

function paintMaterial(source: MeshStandardMaterial, palette: CharacterPalette, phase: number) {
  const material = source.clone();
  const metadata = source.userData.awPainterly as {
    grid?: number;
    tiles?: Record<string, number[]>;
  } | undefined;
  const grid = metadata?.grid || 4;
  const tiles = metadata?.tiles || {};
  const uniforms: CharacterPaint = {
    time: { value: 0 },
    phase: { value: phase },
    skin: { value: new Color(palette.skin) },
    hair: { value: new Color(palette.hair).multiplyScalar(1.05) },
    top: { value: new Color(palette.top).multiplyScalar(1.35) },
    bottom: { value: new Color(palette.bottom).multiplyScalar(1.3) },
    dress: { value: new Color(palette.dress).multiplyScalar(1.35) },
    portrait: { value: 0 },
    headInv: { value: new Matrix4() },
  };
  material.roughness = 0.72;
  material.metalness = 0;
  material.alphaTest = Math.max(material.alphaTest, 0.24);
  material.userData.awPaint = uniforms;
  const hairVertex = tileCondition(tiles.hair, "awVertexTile");
  const dressVertex = tileCondition(tiles.dress, "awVertexTile");
  const skinFragment = tileCondition(tiles.skin, "awTile");
  const hairFragment = tileCondition(tiles.hair, "awTile");
  const detailFragment = tileCondition(tiles.detail, "awTile");
  const topFragment = tileCondition(tiles.top, "awTile");
  const bottomFragment = tileCondition(tiles.bottom, "awTile");
  const dressFragment = tileCondition(tiles.dress, "awTile");

  material.onBeforeCompile = (shader) => {
    const s = shader as unknown as Shader;
    s.uniforms.uAwPedTime = uniforms.time;
    s.uniforms.uAwPedPhase = uniforms.phase;
    s.uniforms.uAwPedSkin = uniforms.skin;
    s.uniforms.uAwPedHair = uniforms.hair;
    s.uniforms.uAwPedTop = uniforms.top;
    s.uniforms.uAwPedBottom = uniforms.bottom;
    s.uniforms.uAwPedDress = uniforms.dress;
    s.uniforms.uAwSunDir = { value: sunDir };
    s.uniforms.uAwHeadInv = uniforms.headInv;
    s.uniforms.uAwPortrait = uniforms.portrait;
    s.vertexShader = s.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uAwPedTime;
uniform float uAwPedPhase;
uniform vec3 uAwSunDir;
uniform mat4 uAwHeadInv;
varying vec3 vAwHead;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
float awVertexTile = floor(uv.x * ${grid.toFixed(1)}) + ${grid.toFixed(1)} * floor(uv.y * ${grid.toFixed(1)});
if (${hairVertex}) {
  float awHairAlong = fract(uv.y * ${grid.toFixed(1)});
  float awHairFlex = smoothstep(0.12, 0.92, awHairAlong);
  transformed.x += sin(uAwPedTime * 1.45 + uAwPedPhase + uv.y * 48.0) * 0.016 * awHairFlex;
  transformed.z += cos(uAwPedTime * 1.05 + uAwPedPhase * 0.8) * 0.007 * awHairFlex;
}
if (${dressVertex}) {
  float awDressAlong = fract(uv.y * ${grid.toFixed(1)});
  float awDressFlex = smoothstep(0.18, 0.88, awDressAlong);
  transformed.x += sin(uAwPedTime * 1.25 + uAwPedPhase + position.y * 9.0) * 0.02 * awDressFlex;
  transformed.z += cos(uAwPedTime * 0.85 + uAwPedPhase) * 0.008 * awDressFlex;
}`,
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
vAwHead = (uAwHeadInv * vec4(transformed, 1.0)).xyz;`,
      );
    s.fragmentShader = s.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 uAwPedSkin;
uniform vec3 uAwPedHair;
uniform vec3 uAwPedTop;
uniform vec3 uAwPedBottom;
uniform vec3 uAwPedDress;
uniform vec3 uAwSunDir;
uniform float uAwPortrait;
varying vec3 vAwHead;`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
float awTile = floor(vMapUv.x * ${grid.toFixed(1)}) + ${grid.toFixed(1)} * floor(vMapUv.y * ${grid.toFixed(1)});
float awFace = 0.0;
if (uAwPortrait > 0.5) {
  vec2 awP = vAwHead.xy - vec2(0.0, 0.012);
  float awOval = (awP.x * awP.x) / 0.003844 + (awP.y * awP.y) / 0.007744;
  awFace = smoothstep(0.015, 0.06, vAwHead.z) * (1.0 - smoothstep(0.78, 1.2, awOval));
  float awCut = (awP.x * awP.x) / 0.0036 + (awP.y * awP.y) / 0.0196;
  if (awCut < 1.0 && vAwHead.z > -0.04 && vAwHead.y > -0.082) discard;
}
if (${skinFragment}) {
  diffuseColor.rgb = mix(diffuseColor.rgb * uAwPedSkin, uAwPedSkin, 0.16);
  if (awFace > 0.15) {
    diffuseColor.rgb = mix(diffuseColor.rgb, uAwPedSkin, 0.78);
    diffuseColor.a = 1.0;
  }
} else if (${hairFragment}) {
  diffuseColor.rgb = mix(diffuseColor.rgb, uAwPedHair, 0.84);
  diffuseColor.a = 1.0;
} else if (${topFragment}) diffuseColor.rgb *= uAwPedTop;
else if (${bottomFragment}) diffuseColor.rgb *= uAwPedBottom;
else if (${dressFragment}) diffuseColor.rgb *= uAwPedDress;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
vec3 awN = normalize(normal);
vec3 awSun = normalize(uAwSunDir);
float awNdL = dot(awN, awSun);
float awWrap = clamp(awNdL * 0.5 + 0.55, 0.0, 1.0);
float awRim = pow(1.0 - clamp(dot(awN, normalize(vViewPosition)), 0.0, 1.0), 2.05);
float awBack = clamp(-awNdL, 0.0, 1.0);
vec3 awGold = vec3(1.0, 0.58, 0.22);
float awGrade = mix(0.78 + 0.28 * awWrap, 0.98 + 0.06 * awWrap, clamp(awFace, 0.0, 1.0));
diffuseColor.rgb *= vec3(1.05, 0.98, 0.9) * awGrade;
float awRimAmt = mix(0.16 + 0.95 * awBack, 0.05 + 0.12 * awBack, clamp(awFace, 0.0, 1.0));
totalEmissiveRadiance += awGold * awRim * awRimAmt;
if (${hairFragment} && awFace < 0.25) totalEmissiveRadiance += awGold * awRim * 0.28;`,
      );
  };
  const shaderVariant = [
    grid, hairVertex, dressVertex, skinFragment, hairFragment, detailFragment,
    topFragment, bottomFragment, dressFragment,
  ].join("|");
  material.customProgramCacheKey = () => `aw-painterly-character-v6:${shaderVariant}`;
  material.needsUpdate = true;
  return { material, uniforms };
}

export function styleCharacter(
  root: Object3D,
  palette: CharacterPalette,
  phase: number,
  faceKind = 0,
  withPortrait = false,
): CharacterPaint[] {
  const paints: CharacterPaint[] = [];
  root.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    const source = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as MeshStandardMaterial;
    const { material, uniforms } = paintMaterial(source, palette, phase);
    mesh.material = material;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    paints.push(uniforms);
  });
  if (withPortrait) {
    const face = findCharacterFace(root);
    if (face.head && !face.head.children.some((child) => child.name === "aw:face-portrait")) {
      attachFacePortrait(face.head, faceKind);
    }
  }
  return paints;
}

export function updateCharacterPaint(
  paints: CharacterPaint[],
  time: number,
  sun?: { x: number; y: number; z: number },
) {
  if (sun) sunDir.set(sun.x, sun.y, sun.z);
  if (sunDir.lengthSq() < 1e-4) sunDir.set(0.2, 0.78, 0.55);
  else sunDir.normalize();
  for (const paint of paints) paint.time.value = time;
}
