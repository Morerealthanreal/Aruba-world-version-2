// Oil-paint light for beach people. This shader does not recolor clothes or skin.
// Albedo stays in the vertex colors. The program only paints the light: warm
// golden bands, cool shade, brush ridges, and a low rim.
import { Color, MeshStandardMaterial, Vector3, type WebGLProgramParametersWithUniforms } from "three";

const SUN = new Vector3(0.15, 0.22, 0.96);

const OIL = /* glsl */ `
vec3 awN = normalize(normal);
vec3 awSunV = normalize(mat3(viewMatrix) * uAwSun);
float awNdL = dot(awN, awSunV);
float awWrap = clamp(awNdL * 0.72 + 0.42, 0.0, 1.0);
float awWobble = sin(vAwObj.y * 46.0 + vAwObj.x * 15.0) * 0.055;
awWobble += sin(vAwObj.z * 22.0 - vAwObj.y * 13.0) * 0.03;
float awBand = 0.0;
awBand += smoothstep(0.16, 0.20, awWrap + awWobble);
awBand += smoothstep(0.38, 0.42, awWrap + awWobble);
awBand += smoothstep(0.60, 0.64, awWrap + awWobble);
awBand += smoothstep(0.80, 0.84, awWrap + awWobble);
awBand *= 0.25;
float awLight = mix(0.42, 1.05, awBand);
float awStreak = sin(vAwObj.y * 17.0 + vAwObj.x * 6.5);
awLight *= 0.93 + 0.12 * (0.5 + 0.5 * awStreak);
vec3 awTint = mix(vec3(0.86, 0.90, 1.04), vec3(1.05, 0.98, 0.90), awBand);
vec3 awCol = diffuseColor.rgb * awLight * awTint;
float awRim = pow(1.0 - clamp(dot(awN, normalize(vViewPosition)), 0.0, 1.0), 2.2);
awCol += vec3(1.0, 0.78, 0.55) * awRim * 0.16 * awBand;
gl_FragColor.rgb = awCol;
`;

let material: MeshStandardMaterial | null = null;

/** One shared program. Outfit colors live on the meshes, not in this shader. */
export function oilMaterial(): MeshStandardMaterial {
  if (material) return material;
  const mat = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0,
    vertexColors: true,
  });
  mat.name = "aw:oil-light";
  mat.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uAwSun = { value: SUN };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vAwObj;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvAwObj = transformed;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 uAwSun;\nvarying vec3 vAwObj;")
      .replace("#include <opaque_fragment>", `#include <opaque_fragment>\n${OIL}`);
  };
  mat.customProgramCacheKey = () => "aw-oil-light-v3";
  material = mat;
  return mat;
}

/** Live sun direction (world space, toward the sun). The beach shot uses golden hour. */
export function setOilSun(x: number, y: number, z: number) {
  if (x * x + y * y + z * z < 1e-6) return;
  SUN.set(x, y, z).normalize();
}

export const OIL_SUN = SUN;

// Kept so a future skin pass can sample the same warm key without a second light.
export const OIL_WARM = new Color(0xffb15a);
