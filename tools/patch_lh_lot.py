#!/usr/bin/env python3
"""California Lighthouse lot: mostly open sand with a handful of cars (Mapillary 2022 pano lh2_0),
not the ~100-car generated lot. Keeps 6 spread-out cars inside the lot box. Idempotent."""
import json
F='/workspace/aruba-world-merged/game/data/real/st_1_1.json'
d=json.load(open(F))
box=lambda c: abs(c[0]+8880)<90 and abs(c[1]+10350)<90
lot=[c for c in d['cars'] if box(c)]
if len(lot)<=6: print('lh lot already',len(lot)); raise SystemExit
keep=[]
for c in sorted(lot,key=lambda c:(c[0],c[1])):
    if all((c[0]-k[0])**2+(c[1]-k[1])**2>22**2 for k in keep): keep.append(c)
keep=keep[:6]
d['cars']=[c for c in d['cars'] if not box(c)]+keep
json.dump(d,open(F,'w'),separators=(',',':'))
print('lh lot cars',len(lot),'->',len(keep))
