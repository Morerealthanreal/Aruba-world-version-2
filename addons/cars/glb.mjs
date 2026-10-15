// Minimal glTF 2.0 binary writer (one indexed triangle mesh per node, no materials: A assigns its
// own by node name), so the car generator runs in plain Node.

/**
 * nodes: [{ name, prims: [{ pos: Float32Array, nrm: Float32Array, uv?: Float32Array, idx: Uint16Array|Uint32Array }] }]
 * root: indices of scene root nodes
 */
export function writeGLB({ nodes, root }) {
  const chunks = [], views = [], accessors = [];
  let off = 0;
  const view = (buf, target) => {
    const pad = (4 - (off % 4)) % 4;
    if (pad) { chunks.push(Buffer.alloc(pad)); off += pad; }
    const b = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
    chunks.push(b);
    views.push({ buffer: 0, byteOffset: off, byteLength: b.length, ...(target ? { target } : {}) });
    off += b.length;
    return views.length - 1;
  };
  const acc = (arr, type, ctype, target, minmax) => {
    const n = { VEC3: 3, VEC2: 2, SCALAR: 1 }[type];
    const a = { bufferView: view(arr, target), componentType: ctype, count: arr.length / n, type };
    if (minmax) {
      const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < arr.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], arr[i + k]); mx[k] = Math.max(mx[k], arr[i + k]); }
      a.min = mn; a.max = mx;
    }
    accessors.push(a);
    return accessors.length - 1;
  };
  const meshes = [], gnodes = [];
  for (const n of nodes) {
    const g = { name: n.name };
    if (n.prims && n.prims.length) {
      const prims = n.prims.map((p) => {
        const attributes = { POSITION: acc(p.pos, "VEC3", 5126, 34962, true), NORMAL: acc(p.nrm, "VEC3", 5126, 34962) };
        if (p.uv) attributes.TEXCOORD_0 = acc(p.uv, "VEC2", 5126, 34962);
        const prim = { attributes, indices: acc(p.idx, "SCALAR", p.idx instanceof Uint32Array ? 5125 : 5123, 34963), mode: 4 };
        return prim;
      });
      meshes.push({ name: n.name, primitives: prims });
      g.mesh = meshes.length - 1;
    }
    gnodes.push(g);
  }
  const json = { asset: { version: "2.0", generator: "aruba-world cars/build.mjs" }, scene: 0, scenes: [{ nodes: root }], nodes: gnodes, meshes, accessors, bufferViews: views, buffers: [] };
  const pad = (4 - (off % 4)) % 4;
  if (pad) chunks.push(Buffer.alloc(pad));
  const bin = Buffer.concat(chunks);
  json.buffers.push({ byteLength: bin.length });
  let js = Buffer.from(JSON.stringify(json));
  js = Buffer.concat([js, Buffer.alloc((4 - (js.length % 4)) % 4, 0x20)]);
  const head = Buffer.alloc(12);
  head.writeUInt32LE(0x46546c67, 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + js.length + 8 + bin.length, 8);
  const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; };
  return Buffer.concat([head, ch(js.length, 0x4e4f534a), js, ch(bin.length, 0x004e4942), bin]);
}
