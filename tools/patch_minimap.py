#!/usr/bin/env python3
"""Minimap hook (idempotent): A's per-frame minimap draw V_(x,z,heading,range) goes through window.__awMiniMap when set
(addons/src/minimap.ts), which also receives A's island map canvas {c,k}, the map bounds m_, the brand list and the map data.
Without the add-on (?addons=0, ?minimap=0) A's own V_ still draws."""
from pathlib import Path
P=Path(__file__).resolve().parents[1]/'game/assets/index-D_YJh5Nn.js'
s=P.read_text(); n=0
if '__awMiniMap' not in s:
  a="%(window.__awMMDiv||1)||V_(n.x,n.z,($.mode===`car`||$.mode===`moto`?$.car.h:$.mode===`plane`?$.plane.h:$.camYaw)+$.lookYaw,r)"
  assert s.count(a)==1, s.count(a)
  b="%(window.__awMMDiv||1)||(window.__awMiniMap||V_)(n.x,n.z,($.mode===`car`||$.mode===`moto`?$.car.h:$.mode===`plane`?$.plane.h:$.camYaw)+$.lookYaw,r,__,m_,hv(),p_)"
  s=s.replace(a,b); n+=1
P.write_text(s); print('patched',n)
