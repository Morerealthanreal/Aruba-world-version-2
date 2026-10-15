#!/usr/bin/env python3
"""Noord yard palms -> core veg palms (instanced game palm.glb + impostors) in data/real/r_*.json veg.p.
Source list: landmarks/yard_palms.json [x,z,scale,rot] (noord_street.py; n1.mp4 00:30-02:40 yard palms). Idempotent: removes previous
entries with a scale ending in the marker digit (scale rounded to 3 dp, last digit 7) before re-adding."""
import json,glob,os,math
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/data/real/')
M=json.load(open(D+'manifest.json')); X0,Z0,RS=M['X0'],M['Z0'],M['RS']
SRC={'p':'/workspace/landmarks/yard_palms.json','d':'/workspace/landmarks/noord_divis.json'}  # r242: + roadside divi thickets (noord_divis.py)
by={}
for kind,fn in SRC.items():
  for x,z,s,r in json.load(open(fn)): by.setdefault(('r_%d_%d.json'%((x-X0)//RS,(z-Z0)//RS),kind),[]).append([x,z,round(math.floor(s*100)/100+0.007,3),r])
mark=lambda s: abs(round(s*1000)%10-7)==0 and abs(s*1000-round(s*1000))<1e-6
n=0
for f in glob.glob(D+'r_*.json'):
  d=json.load(open(f)); ch=False
  for kind in SRC:
    v=d['veg'].get(kind,[]); old=len(v); v=[q for q in v if not (len(str(q[2]).split('.')[-1])==3 and str(q[2]).endswith('7'))]
    add=by.get((os.path.basename(f),kind),[])
    if add or len(v)!=old: d['veg'][kind]=v+add; n+=len(add); ch=True
  if ch: json.dump(d,open(f,'w'))
print('yard palms + divis',n)
