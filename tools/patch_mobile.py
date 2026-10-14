#!/usr/bin/env python3
"""Mobile pass (idempotent): (1) LOW preset dpr 1 -> 2 (still capped by device DPR; addons/src/fpsGuard.ts
scales it down adaptively to hold ~50 fps), the grain on phones was 1x render on a ~2.6x screen with no MSAA;
(2) region streaming centre shifted ahead of travel by window.__awAhead (addons/src/preload.ts)."""
P='/workspace/aruba-world-merged/game/assets/index-D_YJh5Nn.js'
s=open(P).read(); n=0
a="low:{name:`low`,dpr:1,"; b="low:{name:`low`,dpr:2,"
if a in s: assert s.count(a)==1; s=s.replace(a,b); n+=1
a="update(e,t,n,r,i=7){let a=this.M,o=this.q.radius"
b="update(e,t,n,r,i=7){window.__awAhead&&(e+=window.__awAhead[0],n+=window.__awAhead[1]);let a=this.M,o=this.q.radius"
if '__awAhead' not in s: assert s.count(a)==1; s=s.replace(a,b); n+=1
open(P,'w').write(s); print('patched',n)
