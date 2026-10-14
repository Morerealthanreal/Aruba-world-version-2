#!/usr/bin/env python3
"""Re-runnable: set roof type of Noord buildings to match Google aerial imagery.
tools/noord_roof_changes.json maps building id 'i' -> 'flat'|'hipped' (from landmarks/noord/roofclass.py).
Original value kept in 'r0' so the patch is idempotent and reversible (--revert)."""
import json,glob,sys,os
here=os.path.dirname(os.path.abspath(__file__)); D=os.path.join(here,'..','game','data','real')
ch={int(k):v for k,v in json.load(open(os.path.join(here,'noord_roof_changes.json'))).items()}
rev='--revert' in sys.argv; n=0
for f in sorted(glob.glob(os.path.join(D,'r_*_*.json'))):
  j=json.load(open(f)); mod=False
  for b in j.get('b',[]):
    i=b.get('i')
    if rev:
      if 'r0' in b: b['r']=b.pop('r0'); mod=True; n+=1
    elif i in ch and b.get('r')!=ch[i]:
      b.setdefault('r0',b.get('r')); b['r']=ch[i]; mod=True; n+=1
  if mod: json.dump(j,open(f,'w'),separators=(',',':'),ensure_ascii=False)
print('changed',n)
