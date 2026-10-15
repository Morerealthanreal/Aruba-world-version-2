#!/usr/bin/env python3
"""r253: kerbed sidewalks (core sw=1) on J.E. Irausquin Blvd along the Palm Beach / Eagle Beach hotel strip (real road has
sidewalks both sides; data had sw=0 -> bare sand to the asphalt edge). Idempotent, edits data/real/r_*.json."""
import json,glob,os
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/data/real/')
N=('J.E. Irausquin Boulevard',)
n=0
for f in glob.glob(D+'r_*.json'):
  d=json.load(open(f)); ch=False
  for r in d['roads']:
    if r.get('n') in N and not r.get('u') and not r.get('sw') and all(-9600<x<-7300 and -7000<z<-3000 for x,z in r['p']):
      r['sw']=1; ch=True; n+=1
  if ch: json.dump(d,open(f,'w'))
print('pb sidewalks',n)
