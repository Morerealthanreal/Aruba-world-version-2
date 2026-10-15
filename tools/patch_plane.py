#!/usr/bin/env python3
"""Plane flight-feel + TURBO JET hooks for A's minified bundle (idempotent).
Every hook falls back to A's original maths when the add-on object is absent, so ?fly=0 / ?addons=0 fly exactly as before.
  window.__awFly  (addons/src/fly.ts)   gnd/ctl/gs/acc/vy/cam/spawn: ground contact, smoothed pitch+bank, ground steering,
                                         capped acceleration, landing cushion, smoothed chase cam, runway spawn at Queen Beatrix
  window.__awTurboK / __awTurboV (addons/src/turbo.ts)  TURBO throttle factor and hard top speed (m/s)
Run after tools/patch_gv_moto.py (which adds the first __awTurbo hook); also works on a bundle without it."""
import os, sys
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'game', 'assets', 'index-D_YJh5Nn.js')
s = open(P).read()
if '__awFly' in s: print('already'); raise SystemExit
OLD_T = "let d=a.thr*120;a.s+=(d-a.s)*.9*e"
if '__awTurbo' not in s:
  assert s.count(OLD_T) == 1
  s = s.replace(OLD_T, "let d=a.thr*120*(window.__awTurbo?1.2963:1);a.s+=(d-a.s)*(window.__awTurbo?.6:.9)*e")
F = "window.__awFly"
R = [
 # ground contact from terrain height (A tested absolute y<=2.01, never true on the raised runway), smoothed pitch + bank
 ("s=a.y<=2.01,c=Math.max(-1,Math.min(1,o));a.p+=c*1.7*e,Math.abs(c)<.08&&(a.p*=.2**e),a.p=Math.max(-.95,Math.min(.95,a.p));let l=-t*1.05;if(a.r+=(l-a.r)*Math.min(1,9*e),$.ap)",
  f"s={F}?{F}.gnd(a):a.y<=2.01,c=Math.max(-1,Math.min(1,o));{F}?{F}.ctl(a,c,t,e,s):(a.p+=c*1.7*e,Math.abs(c)<.08&&(a.p*=.2**e)),a.p=Math.max(-.95,Math.min(.95,a.p));let l=-t*1.05;if({F}||(a.r+=(l-a.r)*Math.min(1,9*e)),$.ap)"),
 # speed-dependent ground steering; TURBO factor + hard cap; capped acceleration (smooth takeoff roll / rollout)
 ("a.h+=(a.r*1.35*Math.min(1,a.s/40)+u*.5+(s?-t*.6:0))*e;let d=a.thr*120*(window.__awTurbo?1.2963:1);a.s+=(d-a.s)*(window.__awTurbo?.6:.9)*e-Math.sin(a.p)*9.8*e",
  f"a.h+=(a.r*1.35*Math.min(1,a.s/40)+u*.5+(s?-t*({F}?{F}.gs(a):.6):0))*e;let d=Math.min(a.thr*120*(window.__awTurbo?window.__awTurboK||1.2963:1),window.__awTurbo&&window.__awTurboV||1e9);a.s+=({F}?{F}.acc(a,d,e,s,c):(d-a.s)*(window.__awTurbo?.6:.9)*e)-Math.sin(a.p)*9.8*e"),
 # landing cushion: sink rate limited near the ground
 ("if(a.s<32&&(h-=(32-a.s)*.6),a.x+=p*e", f"if(a.s<32&&(h-=(32-a.s)*.6),{F}&&(h={F}.vy(a,h,e,s)),a.x+=p*e"),
 # chase cam: smoothed yaw/pitch/distance, offset glued to the plane (no speed-dependent lag jitter)
 ("let g=a.h+$.lookYaw,_=.18+$.lookPitch-a.p*.4;Rv.set(a.x,a.y+2,a.z),zv.set(a.x+Math.sin(g)*32*Math.cos(_),a.y+2+Math.sin(_)*32,a.z+Math.cos(g)*32*Math.cos(_)),o_.position.lerp(zv,$.snapCam?1:1-2e-5**e),o_.lookAt(Rv)",
  f"let awC={F}&&{F}.cam(a,e,$.snapCam),g=(awC?awC.h:a.h)+$.lookYaw,_=.18+$.lookPitch-(awC?awC.p:a.p)*.4,awD=awC?awC.d:32;Rv.set(a.x,a.y+2,a.z),zv.set(a.x+Math.sin(g)*awD*Math.cos(_),a.y+2+Math.sin(_)*awD,a.z+Math.cos(g)*awD*Math.cos(_)),awC?o_.position.copy(zv):o_.position.lerp(zv,$.snapCam?1:1-2e-5**e),o_.lookAt(Rv)"),
 # switching to the plane near Queen Beatrix starts on the runway instead of 250 m up
 ("e===`plane`&&Object.assign($.plane,{x:n.x,z:n.z,y:Math.max(n.y+200,250),h:r,p:.05,r:0,s:65,thr:.65}),",
  f"e===`plane`&&Object.assign($.plane,{{x:n.x,z:n.z,y:Math.max(n.y+200,250),h:r,p:.05,r:0,s:65,thr:.65}}),e===`plane`&&{F}&&{F}.spawn($.plane,$.mode),"),
]
for a, b in R:
  n = s.count(a)
  if n != 1: sys.exit(f'pattern count {n}: {a[:70]}')
  s = s.replace(a, b)
open(P, 'w').write(s); print('patched', len(R))
