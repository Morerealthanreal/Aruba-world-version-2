#!/usr/bin/env python3
"""Bike wheelie hook (idempotent): after the bike body transform is set, call window.__awWh(ev,a,dt)
so the addon (addons/src/wheelie.ts) can pitch the bike nose-up about the rear axle."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]/'game/assets/index-D_YJh5Nn.js'
s=P.read_text()
if '__awWh' not in s:
  variants=[
    "ev.rotation.set(a.pitch,a.h,0,`YXZ`)",
    "ev.rotation.set(a.pitch,a.h-a.drift*a.st*.35*Math.sign(a.s||1),0,`YXZ`)",
    "ev.rotation.set(a.pitch,a.h-(window.__awMotoEnabled?a.drift*a.st*.3*Math.sign(a.s||1):0),0,`YXZ`)",
  ]
  hits=[a for a in variants if s.count(a)==1]
  assert len(hits)==1, [s.count(a) for a in variants]
  a=hits[0]; P.write_text(s.replace(a,a+",window.__awWh&&window.__awWh(ev,a,e)")); print('patched')
else: print('already')
