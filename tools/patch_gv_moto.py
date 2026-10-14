#!/usr/bin/env python3
"""Gangstar-Vegas-style bike/car handling patch for A's minified bundle (idempotent).
Spec: /workspace/landmarks/gv/motorcycle_spec.md"""
import sys,re
P='/workspace/aruba-world-merged/game/assets/index-D_YJh5Nn.js'
s=open(P).read()
DONE='__awDrift' in s
R=[
 # punchier bike launch below 72 km/h
 ("o&&s>0&&(a.s+=Math.min(1,s)*6*e)","o&&s>0&&(a.s+=Math.min(1,s)*(a.s<20?10:6)*e)"),
 # brake + steer at speed = drift (slide keeps more speed than straight braking)
 ("c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),30*e))","c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),(Math.abs(t)>.35&&Math.abs(a.s)>11?8:30)*e))"),
 # quicker, still smoothed steering on the bike
 ("(o?Math.abs(t)>.05?3.2:6:9)","(o?Math.abs(t)>.05?6.5:8:9)"),
 # drift state + sharper turn rate at speed
 (";let u=a.st*((o?1.35:2)/(1+Math.abs(a.s)*(o?.1:.06)))",
  ";a.drift=(a.drift||0)+((c&&Math.abs(a.st)>.35&&Math.abs(a.s)>11?1:0)-(a.drift||0))*Math.min(1,e*(c?5:2.5));window.__awDrift=a.drift;let u=a.st*((o?1.8:2)/(1+Math.abs(a.s)*(o?.065:.06)))*(1+a.drift*.75)"),
 # visual slip angle while drifting (car body)
 ("$_.rotation.set(a.pitch,a.h,a.roll,`YXZ`)","$_.rotation.set(a.pitch,a.h-a.drift*a.st*.4*Math.sign(a.s||1),a.roll,`YXZ`)"),
 # deeper, faster bike lean (GV ~40 deg)
 ("Math.max(-.45,Math.min(.45,-Math.atan(Math.abs(a.s)*u/9.8)*.8))","Math.max(-.72,Math.min(.72,-Math.atan(Math.abs(a.s)*u/9.8)*1.05))"),
 ("a.lean=(a.lean||0)+(t-(a.lean||0))*Math.min(1,3.5*e)","a.lean=(a.lean||0)+(t-(a.lean||0))*Math.min(1,6*e)"),
 ("ev.rotation.set(a.pitch,a.h,0,`YXZ`)","ev.rotation.set(a.pitch,a.h-a.drift*a.st*.35*Math.sign(a.s||1),0,`YXZ`)"),
 # tighter, lower chase cam on the bike, follows heading faster
 ("a.camH=(a.camH??a.h)+t*Math.min(1,e*(o?3:6))","a.camH=(a.camH??a.h)+t*Math.min(1,e*(o?4.5:6))"),
 ("((o?6.2:8.5)+Math.abs(a.s)*.06)","((o?5.4:8.5)+Math.abs(a.s)*(o?.05:.06))"),
]
for a,b in ([] if DONE else R):
  n=s.count(a)
  if n!=1: sys.exit(f'pattern count {n}: {a[:60]}')
  s=s.replace(a,b)
if not DONE: open(P,'w').write(s); print('patched',len(R))
# plane TURBO (applied separately so it is idempotent too)
s=open(P).read()
if '__awTurbo' not in s:
  a="let d=a.thr*120;a.s+=(d-a.s)*.9*e"
  assert s.count(a)==1
  open(P,'w').write(s.replace(a,"let d=a.thr*120*(window.__awTurbo?2:1);a.s+=(d-a.s)*(window.__awTurbo?.6:.9)*e"))
