#!/usr/bin/env python3
"""Noord look (requested 2026-10-15, vs n1.mp4 00:30-02:40): idempotent bundle patch, Noord box x -7900..-6000, z -7000..-1400,
soft 300 m edge blend.
 1. house wall colours: Noord palette (~2/3 beige/cream, 1/3 pastels) chosen with probability = edge weight
 2. terrain: tone sand toward greyer brown dirt (desaturate + darken warm), scaled by edge weight, not on wet sand"""
import glob,os
f=glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/assets/index-*.js'))[0]; s=open(f).read()
if '/*awnoordlook*/' in s: print('noord look: already'); raise SystemExit
a='Jm={house:Gm(['
assert s.count(a)==1
s=s.replace(a,'Jm={/*awnoordlook*/noord:Gm([`#f3ead7`,`#f6eedd`,`#efe2ca`,`#f7f2e8`,`#edddc1`,`#f5ead2`,`#f1ebde`,`#e7d8bd`,`#f6efe1`,`#efe6d4`,`#f6dec5`,`#e3ebd9`,`#e0e8ec`,`#f7e3b9`,`#f6d9d0`]),house:Gm([')
a='j=this.w.brands&&this.w.brands.wallFor(l)||A[Math.floor(jm(l.i,2)*A.length)]'
assert s.count(a)==1
s=s.replace(a,'j=this.w.brands&&this.w.brands.wallFor(l)||(A===Jm.house&&jm(l.i,7)<Math.min(1,Math.max(0,Math.min(l.p[0][0]+7900,-6000-l.p[0][0],-1400-l.p[0][1],l.p[0][1]+7000)/300))?Jm.noord[Math.floor(jm(l.i,2)*Jm.noord.length)]:A[Math.floor(jm(l.i,2)*A.length)])')
a='  float tAO = mix(1.0, tar.x, 0.8);\n  diffuseColor.rgb *= tc;'
assert s.count(a)==1
s=s.replace(a,'  float tAO = mix(1.0, tar.x, 0.8);\n  { float nw = clamp(min(min(vWP.x + 7900.0, -6000.0 - vWP.x), min(-1400.0 - vWP.z, vWP.z + 7000.0)) / 300.0, 0.0, 1.0); float lum = dot(tc, vec3(0.3, 0.55, 0.15)); tc = mix(tc, vec3(lum) * vec3(1.04, 0.96, 0.86) * 0.92, 0.6 * nw * (1.0 - wet)); }\n  diffuseColor.rgb *= tc;')
open(f,'w').write(s); print('noord look patched')
