#!/usr/bin/env node
// Rebuild game/models/moto.glb as a phone-cheap, two-mesh sport/street bike.
// Run after `npm ci` in addons/: node tools/generate_moto.mjs
import * as THREE from "../addons/node_modules/three/build/three.module.js";
import { mergeGeometries } from "../addons/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import { GLTFExporter } from "../addons/node_modules/three/examples/jsm/exporters/GLTFExporter.js";
import { writeFile } from "node:fs/promises";

// GLTFExporter uses FileReader in browsers. Keep the generator dependency-free in Node.
if (!globalThis.FileReader) {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((result) => {
        this.result = result;
        this.onloadend?.();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buffer) => {
        this.result = `data:${blob.type};base64,${Buffer.from(buffer).toString("base64")}`;
        this.onloadend?.();
      });
    }
  };
}

const physical = (name, options) => {
  const material = new THREE.MeshPhysicalMaterial(options);
  material.name = name;
  return material;
};
const standard = (name, options) => {
  const material = new THREE.MeshStandardMaterial(options);
  material.name = name;
  return material;
};

const bikeMaterials = [
  physical("Aruba cobalt paint", { color: 0x1769aa, metalness: 0.55, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.1 }),
  physical("Sunset accent", { color: 0xf05a28, metalness: 0.35, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.13 }),
  standard("Satin frame", { color: 0x151a20, metalness: 0.72, roughness: 0.34 }),
  standard("Tyres", { color: 0x111315, metalness: 0.02, roughness: 0.92 }),
  standard("Machined alloy", { color: 0xb9c2ca, metalness: 0.92, roughness: 0.2 }),
  standard("Engine", { color: 0x353b42, metalness: 0.78, roughness: 0.38 }),
  standard("Seat and grips", { color: 0x17191d, metalness: 0.02, roughness: 0.82 }),
  standard("Chain", { color: 0xa97c36, metalness: 0.82, roughness: 0.32 }),
  standard("Headlight", { color: 0xf8fbff, emissive: 0xeef6ff, emissiveIntensity: 2.5, metalness: 0.08, roughness: 0.12 }),
  standard("Taillight", { color: 0xe81935, emissive: 0xff001c, emissiveIntensity: 1.35, metalness: 0.05, roughness: 0.2 }),
  physical("Windscreen", { color: 0x142c42, metalness: 0.25, roughness: 0.08, transmission: 0.2, transparent: true, opacity: 0.72 }),
];
const riderMaterials = [
  standard("Rider jacket", { color: 0x172b3d, metalness: 0.08, roughness: 0.74 }),
  standard("Rider jeans", { color: 0x214b73, metalness: 0.02, roughness: 0.88 }),
  standard("Rider boots and gloves", { color: 0x111318, metalness: 0.12, roughness: 0.72 }),
  standard("Rider skin", { color: 0x9b654a, metalness: 0, roughness: 0.76 }),
  physical("Rider helmet", { color: 0xf2f4f7, metalness: 0.2, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 }),
  physical("Helmet visor", { color: 0x07131f, metalness: 0.7, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04 }),
];

const bikeParts = bikeMaterials.map(() => []);
const riderParts = riderMaterials.map(() => []);
const v = (x, y, z) => new THREE.Vector3(x, y, z);

function add(parts, material, geometry, position = v(0, 0, 0), rotation = v(0, 0, 0), scale = v(1, 1, 1)) {
  geometry = geometry.clone();
  const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z));
  geometry.applyMatrix4(new THREE.Matrix4().compose(position, quaternion, scale));
  parts[material].push(geometry);
}

function tube(parts, material, start, end, radius, radialSegments = 8) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), delta.normalize());
  geometry.applyMatrix4(new THREE.Matrix4().compose(start.clone().add(end).multiplyScalar(0.5), quaternion, v(1, 1, 1)));
  parts[material].push(geometry);
}

function taperedTube(parts, material, start, end, radiusA, radiusB, radialSegments = 8) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  const geometry = new THREE.CylinderGeometry(radiusB, radiusA, length, radialSegments, 1, false);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), delta.normalize());
  geometry.applyMatrix4(new THREE.Matrix4().compose(start.clone().add(end).multiplyScalar(0.5), quaternion, v(1, 1, 1)));
  parts[material].push(geometry);
}

function capsule(parts, material, start, end, radius, radialSegments = 8) {
  const delta = end.clone().sub(start);
  const length = delta.length();
  const geometry = new THREE.CapsuleGeometry(radius, Math.max(0.01, length - radius * 2), 4, radialSegments);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), delta.normalize());
  geometry.applyMatrix4(new THREE.Matrix4().compose(start.clone().add(end).multiplyScalar(0.5), quaternion, v(1, 1, 1)));
  parts[material].push(geometry);
}

function ellipsoid(parts, material, position, scale, widthSegments = 14, heightSegments = 9) {
  add(parts, material, new THREE.SphereGeometry(1, widthSegments, heightSegments), position, v(0, 0, 0), scale);
}

// Wheels: rounded tyres, machined rims, brake discs, hubs and six-spoke alloys.
for (const z of [-0.76, 0.76]) {
  add(bikeParts, 3, new THREE.TorusGeometry(0.305, 0.075, 8, 20), v(0, 0.385, z), v(0, Math.PI / 2, 0));
  add(bikeParts, 4, new THREE.TorusGeometry(0.225, 0.026, 6, 16), v(0, 0.385, z), v(0, Math.PI / 2, 0));
  add(bikeParts, 4, new THREE.CylinderGeometry(0.105, 0.105, 0.035, 16), v(0.115, 0.385, z), v(0, 0, Math.PI / 2));
  add(bikeParts, 2, new THREE.CylinderGeometry(0.055, 0.055, 0.28, 12), v(0, 0.385, z), v(0, 0, Math.PI / 2));
  for (let i = 0; i < 6; i++) {
    add(bikeParts, 4, new THREE.BoxGeometry(0.035, 0.035, 0.4), v(0, 0.385, z), v((i * Math.PI) / 3, 0, 0));
  }
}

// Chassis, swingarm, forks and suspension.
tube(bikeParts, 2, v(-0.2, 0.5, 0.69), v(-0.18, 0.72, 0.04), 0.042);
tube(bikeParts, 2, v(0.2, 0.5, 0.69), v(0.18, 0.72, 0.04), 0.042);
tube(bikeParts, 2, v(-0.18, 0.72, 0.04), v(-0.2, 0.91, -0.36), 0.048);
tube(bikeParts, 2, v(0.18, 0.72, 0.04), v(0.2, 0.91, -0.36), 0.048);
tube(bikeParts, 2, v(-0.19, 0.74, 0.07), v(0.19, 0.74, 0.07), 0.04);
tube(bikeParts, 4, v(-0.18, 0.42, -0.76), v(-0.16, 1.12, -0.38), 0.035);
tube(bikeParts, 4, v(0.18, 0.42, -0.76), v(0.16, 1.12, -0.38), 0.035);
tube(bikeParts, 2, v(-0.2, 1.1, -0.38), v(0.2, 1.1, -0.38), 0.045);
tube(bikeParts, 4, v(0, 0.48, 0.64), v(0, 0.86, 0.17), 0.04);
for (let i = 0; i < 5; i++) {
  add(bikeParts, 1, new THREE.TorusGeometry(0.072, 0.012, 5, 10), v(0, 0.59 + i * 0.055, 0.45 - i * 0.067), v(Math.PI / 3, 0, 0));
}

// Engine block and exposed mechanical detail.
ellipsoid(bikeParts, 5, v(0, 0.64, -0.01), v(0.28, 0.3, 0.32), 12, 8);
add(bikeParts, 5, new THREE.CylinderGeometry(0.17, 0.2, 0.42, 10), v(0, 0.69, -0.18), v(0, 0, Math.PI / 2));
for (let y = 0.53; y <= 0.76; y += 0.055) {
  add(bikeParts, 4, new THREE.BoxGeometry(0.48, 0.018, 0.24), v(0, y, -0.1));
}
add(bikeParts, 2, new THREE.CylinderGeometry(0.1, 0.1, 0.45, 12), v(0, 0.51, 0.02), v(0, 0, Math.PI / 2));

// Curved tank, side fairings, nose, belly pan, seat and raised tail.
ellipsoid(bikeParts, 0, v(0, 1.01, -0.04), v(0.33, 0.29, 0.4), 16, 10);
ellipsoid(bikeParts, 0, v(0, 0.88, -0.38), v(0.35, 0.3, 0.34), 14, 9);
ellipsoid(bikeParts, 1, v(0, 0.69, -0.32), v(0.32, 0.22, 0.42), 12, 8);
ellipsoid(bikeParts, 0, v(0, 1.02, -0.52), v(0.3, 0.28, 0.27), 14, 9);
ellipsoid(bikeParts, 10, v(0, 1.23, -0.47), v(0.23, 0.2, 0.14), 12, 8);
add(bikeParts, 6, new THREE.CapsuleGeometry(0.17, 0.34, 5, 10), v(0, 1.06, 0.37), v(Math.PI / 2, 0, 0), v(1.25, 0.52, 1));
ellipsoid(bikeParts, 0, v(0, 1.03, 0.59), v(0.26, 0.17, 0.32), 12, 8);
ellipsoid(bikeParts, 1, v(0, 1.04, 0.73), v(0.2, 0.11, 0.25), 12, 8);

// Exhaust, chain drive, foot pegs and controls.
tube(bikeParts, 4, v(0.31, 0.56, -0.12), v(0.33, 0.53, 0.66), 0.055, 10);
add(bikeParts, 4, new THREE.CylinderGeometry(0.095, 0.075, 0.54, 12), v(0.34, 0.57, 0.56), v(Math.PI / 2, 0, 0));
add(bikeParts, 2, new THREE.CylinderGeometry(0.078, 0.078, 0.57, 12), v(0.34, 0.57, 0.56), v(Math.PI / 2, 0, 0));
add(bikeParts, 7, new THREE.BoxGeometry(0.025, 0.025, 0.68), v(-0.28, 0.42, 0.4), v(-0.1, 0, 0));
add(bikeParts, 7, new THREE.TorusGeometry(0.11, 0.016, 5, 14), v(-0.28, 0.43, 0.72), v(0, Math.PI / 2, 0));
add(bikeParts, 7, new THREE.TorusGeometry(0.09, 0.016, 5, 14), v(-0.28, 0.48, 0.08), v(0, Math.PI / 2, 0));
tube(bikeParts, 2, v(-0.36, 0.72, 0.12), v(0.36, 0.72, 0.12), 0.025);

// Handlebar, grips, mirrors, headlight and tail/brake light.
tube(bikeParts, 2, v(-0.34, 1.18, -0.46), v(0.34, 1.18, -0.46), 0.026);
tube(bikeParts, 6, v(-0.46, 1.18, -0.46), v(-0.31, 1.18, -0.46), 0.042);
tube(bikeParts, 6, v(0.31, 1.18, -0.46), v(0.46, 1.18, -0.46), 0.042);
tube(bikeParts, 4, v(-0.28, 1.2, -0.46), v(-0.43, 1.39, -0.42), 0.015, 6);
tube(bikeParts, 4, v(0.28, 1.2, -0.46), v(0.43, 1.39, -0.42), 0.015, 6);
ellipsoid(bikeParts, 2, v(-0.46, 1.41, -0.42), v(0.12, 0.065, 0.045), 10, 6);
ellipsoid(bikeParts, 2, v(0.46, 1.41, -0.42), v(0.12, 0.065, 0.045), 10, 6);
ellipsoid(bikeParts, 8, v(0, 1.02, -0.77), v(0.18, 0.12, 0.055), 12, 8);
ellipsoid(bikeParts, 9, v(0, 1.08, 0.83), v(0.12, 0.048, 0.03), 10, 6);

// Sport rider: hips planted on the seat, torso tucked toward tank, elbows bent,
// knees hugging the fairing and feet resting on the pegs.
capsule(riderParts, 0, v(0, 1.2, 0.3), v(0, 1.57, -0.16), 0.2, 10);
ellipsoid(riderParts, 0, v(0, 1.42, 0.01), v(0.27, 0.34, 0.22), 12, 8);
ellipsoid(riderParts, 4, v(0, 1.75, -0.29), v(0.19, 0.22, 0.2), 14, 9);
ellipsoid(riderParts, 5, v(0, 1.76, -0.46), v(0.15, 0.105, 0.035), 12, 7);

for (const side of [-1, 1]) {
  const shoulder = v(side * 0.23, 1.54, -0.13);
  const elbow = v(side * 0.33, 1.36, -0.34);
  const hand = v(side * 0.38, 1.2, -0.46);
  capsule(riderParts, 0, shoulder, elbow, 0.072, 8);
  capsule(riderParts, 0, elbow, hand, 0.062, 8);
  ellipsoid(riderParts, 2, hand, v(0.075, 0.065, 0.09), 8, 6);

  const hip = v(side * 0.15, 1.21, 0.29);
  const knee = v(side * 0.3, 0.88, -0.2);
  const boot = v(side * 0.31, 0.69, 0.12);
  capsule(riderParts, 1, hip, knee, 0.105, 8);
  capsule(riderParts, 1, knee, boot, 0.088, 8);
  add(riderParts, 2, new THREE.CapsuleGeometry(0.07, 0.15, 4, 8), boot, v(Math.PI / 2, 0, 0), v(1, 1, 1.25));
}

function mergedMesh(parts, materials, name) {
  const usedMaterials = [];
  const byMaterial = [];
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i].length) continue;
    // All materials are procedural/PBR with no textures; UVs only waste GLB and
    // vertex-upload bytes on phones.
    for (const geometry of parts[i]) geometry.deleteAttribute("uv");
    byMaterial.push(mergeGeometries(parts[i], false));
    usedMaterials.push(materials[i]);
  }
  const geometry = mergeGeometries(byMaterial, true);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, usedMaterials);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

const root = new THREE.Group();
root.name = "ArubaSportMoto";
const bike = mergedMesh(bikeParts, bikeMaterials, "sport_bike");
const rider = mergedMesh(riderParts, riderMaterials, "sport_rider");
root.add(bike, rider);

const exporter = new GLTFExporter();
const result = await exporter.parseAsync(root, {
  binary: true,
  onlyVisible: true,
  trs: false,
  maxTextureSize: 256,
});
const output = new URL("../game/models/moto.glb", import.meta.url);
await writeFile(output, Buffer.from(result));

const triangles = [bike, rider].reduce((sum, mesh) =>
  sum + (mesh.geometry.index ? mesh.geometry.index.count / 3 : mesh.geometry.attributes.position.count / 3), 0);
console.log(`wrote ${output.pathname}: 2 meshes, ${Math.round(triangles)} triangles, ${Buffer.byteLength(result)} bytes`);
