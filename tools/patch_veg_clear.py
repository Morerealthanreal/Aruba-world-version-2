#!/usr/bin/env python3
"""Clear core vegetation inside listed circles (x,z,r) e.g. paved roundabout islands. Idempotent; edit CLEAR and re-run."""
import re
P='/workspace/aruba-world-merged/game/assets/index-D_YJh5Nn.js'
CLEAR=[[-2723,-659,9],[-6596,-2863,13],[8629,9624,85],[8793,9624,85],[8629,9754,85],[8793,9754,85]]  # Piedra Plat island; Wei Ming island; Sunrise Solar Park blocks
s=open(P).read()
a="for(let[i,a,o,s]of e[n]||[])r[n].push("
b="for(let[i,a,o,s]of e[n]||[])if(!(window.__awVegClear||[]).some(c=>(i-c[0])**2+(a-c[1])**2<c[2]*c[2]))r[n].push("
if '__awVegClear||' not in s:
  assert s.count(a)==1; s=s.replace(a,b)
s=re.sub(r'^window\.__awVegClear=.*?;\n','',s)
s='window.__awVegClear='+str(CLEAR).replace(' ','')+';\n'+s
open(P,'w').write(s); print('ok')
