#!/usr/bin/env python3
"""Bike wheelie hook (idempotent): after the bike body transform is set, call window.__awWh(ev,a,dt)
so the addon (addons/src/wheelie.ts) can pitch the bike nose-up about the rear axle."""
P='/workspace/aruba-world-merged/game/assets/index-D_YJh5Nn.js'
s=open(P).read()
a="ev.rotation.set(a.pitch,a.h-a.drift*a.st*.35*Math.sign(a.s||1),0,`YXZ`)"
if '__awWh' not in s:
  assert s.count(a)==1, s.count(a)
  s=s.replace(a,a+",window.__awWh&&window.__awWh(ev,a,e)"); open(P,'w').write(s); print('patched')
else: print('already')
