#!/usr/bin/env python3
"""Drop core yard-wall segments replaced by hero walls. Idempotent.
Botica Santa Anna (b 4193): west/front segments replaced by the r266 pink/teal hero wall."""
import json
DROP={'st_3_6.json':[(4193,(-6880.86,-4889.49)),(4193,(-6883.66,-4874.02))]}
for f,keys in DROP.items():
    F='/workspace/aruba-world-merged/game/data/real/'+f; d=json.load(open(F)); n=len(d['walls'])
    d['walls']=[w for w in d['walls'] if not any(w.get('b')==b and abs(w['p'][0][0]-p[0])<0.05 and abs(w['p'][0][1]-p[1])<0.05 for b,p in keys)]
    if len(d['walls'])!=n: json.dump(d,open(F,'w'),separators=(',',':'))
    print('drop walls',f,n,'->',len(d['walls']))
