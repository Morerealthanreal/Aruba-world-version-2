import {
  Color, Mesh, MeshStandardMaterial, SkinnedMesh, type Material, type Object3D,
  type WebGLRenderer,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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
};

export type CharacterMetrics = { draws: number; triangles: number };

export const CHARACTER_PALETTES: readonly CharacterPalette[] = [
  { skin: 0xfff4e8, hair: 0x5b2f1d, top: 0xd96f56, bottom: 0x31546b, dress: 0xc65d53 },
  { skin: 0xe7b894, hair: 0x2b1b18, top: 0xf0b34f, bottom: 0x3f5d48, dress: 0xde8c42 },
  { skin: 0xc98b68, hair: 0x1d1716, top: 0x6c94a8, bottom: 0x453a58, dress: 0x7b527f },
  { skin: 0x9f674e, hair: 0x3c2117, top: 0x4f8c77, bottom: 0x443b36, dress: 0x4f718d },
  { skin: 0x7b4c3a, hair: 0x171313, top: 0xb8564c, bottom: 0x2f414f, dress: 0x9f3f4c },
  { skin: 0xd9a37d, hair: 0x805029, top: 0xe1c587, bottom: 0x5d566d, dress: 0x527f78 },
];

let loader: GLTFLoader | null = null;

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

function triangles(mesh: Mesh) {
  const geometry = mesh.geometry;
  return (geometry.index ? geometry.index.count : geometry.attributes.position.count) / 3;
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
    const geometry = mergeGeometries(skins.map((mesh) => mesh.geometry), false);
    if (!geometry) throw new Error("Character source geometry could not be merged");
    geometry.clearGroups();
    const first = skins[0];
    const parent = first.parent || gl.scene;
    const sourceMaterial = Array.isArray(first.material) ? first.material[0] : first.material;
    const merged = new SkinnedMesh(geometry, sourceMaterial);
    merged.name = "aw:character:shared-skin";
    merged.bindMode = first.bindMode;
    merged.bind(first.skeleton, first.bindMatrix);
    merged.position.copy(first.position);
    merged.quaternion.copy(first.quaternion);
    merged.scale.copy(first.scale);
    for (const mesh of skins) mesh.parent?.remove(mesh);
    parent.add(merged);
  }

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
    hair: { value: new Color(palette.hair).multiplyScalar(1.5) },
    top: { value: new Color(palette.top).multiplyScalar(1.35) },
    bottom: { value: new Color(palette.bottom).multiplyScalar(1.3) },
    dress: { value: new Color(palette.dress).multiplyScalar(1.35) },
  };
  material.roughness = 0.72;
  material.metalness = 0;
  material.alphaTest = Math.max(material.alphaTest, 0.24);
  material.userData.awPaint = uniforms;
  const hairVertex = tileCondition(tiles.hair, "awVertexTile");
  const dressVertex = tileCondition(tiles.dress, "awVertexTile");
  const skinFragment = tileCondition(tiles.skin, "awTile");
  const hairFragment = tileCondition(tiles.hair, "awTile");
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
    s.vertexShader = s.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
uniform float uAwPedTime;
uniform float uAwPedPhase;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
float awVertexTile = floor(uv.x * ${grid.toFixed(1)}) + ${grid.toFixed(1)} * floor(uv.y * ${grid.toFixed(1)});
if (${hairVertex}) {
  float awHairFlex = 1.0 - smoothstep(1.05, 1.55, position.y);
  transformed.x += sin(uAwPedTime * 1.65 + uAwPedPhase + position.y * 7.0) * 0.015 * awHairFlex;
}
if (${dressVertex}) {
  float awDressFlex = 1.0 - smoothstep(0.2, 1.02, position.y);
  transformed.x += sin(uAwPedTime * 1.35 + uAwPedPhase + position.y * 5.0) * 0.024 * awDressFlex;
}`,
      );
    s.fragmentShader = s.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 uAwPedSkin;
uniform vec3 uAwPedHair;
uniform vec3 uAwPedTop;
uniform vec3 uAwPedBottom;
uniform vec3 uAwPedDress;`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
float awTile = floor(vMapUv.x * ${grid.toFixed(1)}) + ${grid.toFixed(1)} * floor(vMapUv.y * ${grid.toFixed(1)});
if (${skinFragment}) diffuseColor.rgb *= uAwPedSkin;
else if (${hairFragment}) diffuseColor.rgb *= uAwPedHair;
else if (${topFragment}) diffuseColor.rgb *= uAwPedTop;
else if (${bottomFragment}) diffuseColor.rgb *= uAwPedBottom;
else if (${dressFragment}) diffuseColor.rgb *= uAwPedDress;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
float awGoldenRim = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 3.0);
totalEmissiveRadiance += vec3(1.0, 0.42, 0.12) * awGoldenRim * 0.13;`,
      );
  };
  const shaderVariant = [
    grid, hairVertex, dressVertex, skinFragment, hairFragment,
    topFragment, bottomFragment, dressFragment,
  ].join("|");
  material.customProgramCacheKey = () => `aw-painterly-character-v3:${shaderVariant}`;
  material.needsUpdate = true;
  return { material, uniforms };
}

export function styleCharacter(
  root: Object3D,
  palette: CharacterPalette,
  phase: number,
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
  return paints;
}

export function updateCharacterPaint(paints: CharacterPaint[], time: number) {
  for (const paint of paints) paint.time.value = time;
}
