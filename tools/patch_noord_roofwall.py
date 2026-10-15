#!/usr/bin/env python3
"""Noord roofs + yard walls (requested 2026-10-15 8:34, vs n1.mp4): idempotent bundle patch, same Noord box/soft edge as patch_noord_look.
 1. core yard walls (walls k='y'): white/cream instead of house-colour/yellow, with probability = edge weight
 2. hipped roofs: muted terracotta tint (darker red-brown, as n1) and lower pitch 18-24 deg instead of 22-30, prob = edge weight
Roof shapes (flat/hipped) already come from aerial imagery via patch_noord_roofs.py."""
import glob,os
f=glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/assets/index-*.js'))[0]; s=open(f).read()
if '/*awnoordrw*/' in s: print('noord roofwall: already'); raise SystemExit
NW=lambda x,z:f'Math.min(1,Math.max(0,Math.min({x}+7900,-6000-{x},-1400-{z},{z}+7000)/300))'
a='Jm={/*awnoordlook*/noord:'
assert s.count(a)==1
s=s.replace(a,'Jm={/*awnoordrw*/nroof:[[.74,.86,.92],[.7,.8,.86],[.78,.9,.95],[.68,.76,.84],[.74,.84,.9]].map(e=>new K(...e)),nyard:Gm([`#f7f5ef`,`#f4efe3`,`#efe6d2`,`#f8f6f1`,`#ebe2cc`]),noord:')
a='else o=yh[jm(t.length+t[0][0],3)*6|0];'
assert s.count(a)==1
s=s.replace(a,a+'if(e.k===`y`&&jm(e.b??e.c,9)<'+NW('t[0][0]','t[0][1]')+')o=Jm.nyard[Math.floor(jm(e.b??e.c,11)*Jm.nyard.length)];')
a='y=d*Math.tan((22+jm(l.i,5)*8)*Math.PI/180)'
assert s.count(a)==1
s=s.replace(a,'_nr=jm(l.i,8)<'+NW('l.p[0][0]','l.p[0][1]')+',y=d*Math.tan((_nr?18+jm(l.i,5)*6:22+jm(l.i,5)*8)*Math.PI/180)')
a='k=Xm[Math.floor(jm(l.i,6)*Xm.length)]'
assert s.count(a)==1
s=s.replace(a,'k=_nr?Jm.nroof[Math.floor(jm(l.i,6)*Jm.nroof.length)]:Xm[Math.floor(jm(l.i,6)*Xm.length)]')
open(f,'w').write(s); print('noord roofwall patched')
