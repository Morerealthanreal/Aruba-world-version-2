import * as THREE from "three";
import type { WebGLRenderer } from "three";

const pending = new Map<string, Promise<THREE.Texture>>();
const ready = new Map<string, THREE.Texture>();

/** Canonical key so preload and mural JSON paths share one cache entry. */
export function muralAtlasKey(path: string): string {
  const norm = path.replace(/\\/g, "/").replace(/^\.\//, "");
  return "./" + norm;
}

/** One GPU texture per atlas path. Murals share the same JPEG across reloads. */
export function loadMuralAtlas(path: string, renderer: WebGLRenderer): Promise<THREE.Texture> {
  const key = muralAtlasKey(path);
  const hit = ready.get(key);
  if (hit) return Promise.resolve(hit);
  let job = pending.get(key);
  if (!job) {
    job = new THREE.TextureLoader().loadAsync(key).then((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      bakeMuralAtlas(tex, renderer);
      ready.set(key, tex);
      pending.delete(key);
      return tex;
    });
    pending.set(key, job);
  }
  return job;
}

/** Upload once and sync renderer state so mobile pre-upload does not count again. */
export function bakeMuralAtlas(tex: THREE.Texture, renderer: WebGLRenderer): void {
  if (tex.userData.awBaked) return;
  const r = renderer as unknown as {
    initTexture?: (t: THREE.Texture) => void;
    properties?: { get(t: THREE.Texture): { __version?: number } };
  };
  const img = tex.image as { complete?: boolean } | null | undefined;
  if (!img || img.complete === false) return;
  try {
    r.initTexture?.(tex);
  } catch {
    return;
  }
  try {
    const props = r.properties?.get(tex);
    if (props) props.__version = tex.version;
  } catch {
    /* disposed */
  }
  tex.userData.awBaked = true;
}
