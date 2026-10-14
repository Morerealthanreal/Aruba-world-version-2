#!/usr/bin/env python3
"""GV camera-cycle hook (idempotent): chase-cam distance/pitch scaled by window.__awCamD/__awCamP (addons/src/camCycle.ts)."""
P='/workspace/aruba-world-merged/game/assets/index-D_YJh5Nn.js'
s=open(P).read()
if '__awCamD' in s: print('already'); raise SystemExit
a="let _=a.camH+$.lookYaw,v=.2+$.lookPitch,y=((o?5.4:8.5)+Math.abs(a.s)*(o?.05:.06))*(o_.aspect<.8?1.4:1);"
b="let _=a.camH+$.lookYaw,v=.2+$.lookPitch+(window.__awCamP||0),y=((o?5.4:8.5)+Math.abs(a.s)*(o?.05:.06))*(o_.aspect<.8?1.4:1)*(window.__awCamD||1);"
assert s.count(a)==1; open(P,'w').write(s.replace(a,b)); print('patched')
