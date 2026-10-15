#!/usr/bin/env python3
"""GV camera-cycle hook (idempotent): chase-cam distance/pitch scaled by window.__awCamD/__awCamP (addons/src/camCycle.ts)."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]/'game/assets/index-D_YJh5Nn.js'
s=P.read_text(); n=0
if '__awCamP' not in s:
  a="v=.2+$.lookPitch"; assert s.count(a)==1, s.count(a)
  s=s.replace(a,a+"+(window.__awCamP||0)"); n+=1
if '__awCamD' not in s:
  variants=[
    "((o?6.2:8.5)+Math.abs(a.s)*.06)*(o_.aspect<.8?1.4:1)",
    "((o?5.4:8.5)+Math.abs(a.s)*(o?.05:.06))*(o_.aspect<.8?1.4:1)",
  ]
  hits=[a for a in variants if s.count(a)==1]
  assert len(hits)==1, [s.count(a) for a in variants]
  s=s.replace(hits[0],hits[0]+"*(window.__awCamD||1)"); n+=1
P.write_text(s); print('patched',n)
