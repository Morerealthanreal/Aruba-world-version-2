#!/usr/bin/env python3
"""Road-level look (requested 2026-10-15, n2.mp4 Noord compare). Idempotent bundle patch:
 1. residential streets (cls<2): no dashed centre line, no zebra crossings (Noord: unmarked asphalt)
 2. kerb faces: painted bands (black/white or red/white, per ~150 m cell) or plain grey concrete
 3. Noord (x -7900..-6000, z < -1400): grey concrete sidewalks instead of warm pavers"""
import glob,os
f=glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/assets/index-*.js'))[0]; s=open(f).read()
if '/*awstreets*/' in s: print('streets: already'); raise SystemExit
R=[('if (sw > 0.5 && jd > 1.2 && jd < 4.6) zeb','if (sw > 0.5 && cls >= 2.0 && jd > 1.2 && jd < 4.6) zeb'),
   ('if (ow < 0.5 && cls >= 1.0) { float dash','if (ow < 0.5 && cls >= 2.0) { float dash'),
   ('diffuseColor.rgb *= vec3(1.3, 1.17, 1.0) * (0.88 + 0.22 * rwFbm(vWP2.xz * 0.15));`)}),Am(this.walk),',
    'diffuseColor.rgb *= vec3(1.3, 1.17, 1.0) * (0.88 + 0.22 * rwFbm(vWP2.xz * 0.15));\n if (vWP2.x > -7900.0 && vWP2.x < -6000.0 && vWP2.z < -1400.0) { float gl = dot(diffuseColor.rgb, vec3(0.3, 0.55, 0.15)); diffuseColor.rgb = vec3(gl) * vec3(1.02, 1.0, 0.96) * 1.05; }`)}),Am(this.walk),'),
   ('this.curb=new Z({map:e.curb.c,normalMap:e.curb.n,roughness:.9,metalness:0,color:15262940}),Am(this.curb)',
    'this.curb=new Z({map:e.curb.c,normalMap:e.curb.n,roughness:.9,metalness:0,color:15262940}),/*awstreets*/km(this.curb,`curbpaint`,e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\nvarying vec3 vWP3;`).replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>\nvWP3 = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\nvarying vec3 vWP3;`).replace(`#include <map_fragment>`,`#include <map_fragment>\n { vec2 cc = floor(vWP3.xz / 150.0); float hc = fract(sin(dot(cc, vec2(12.9898, 78.233))) * 43758.5453); float bd = step(0.5, fract(vMapUv.x * 0.75));\n   if (hc < 0.3) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.07), bd * 0.9); else if (hc < 0.5) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.62, 0.1, 0.09), bd * 0.9); else diffuseColor.rgb *= vec3(0.86, 0.86, 0.85); }`)}),Am(this.curb)')]
for a,b in R:
  assert s.count(a)==1,a[:50]; s=s.replace(a,b)
open(f,'w').write(s); print('streets patched')
