#!/usr/bin/env python3
"""Bundle hook window.__awStreetJob(world, region) for the per-region streets job (parked cars, street
furniture, walls, signs), so the add-on can run its stages as separate time-sliced jobs.
Falls back to A's own job when the hook is absent. Idempotent."""
import os
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/assets/index-D_YJh5Nn.js')
s=open(P).read()
a="t.push(()=>{e.group.add(this.streets.build(e)),e.st&&e.st.pools&&e.st.pools.length&&e.group.add(this.marks.pools({pools:e.st.pools}))})"
b="t.push(window.__awStreetJob?window.__awStreetJob(this,e):()=>{e.group.add(this.streets.build(e)),e.st&&e.st.pools&&e.st.pools.length&&e.group.add(this.marks.pools({pools:e.st.pools}))})"
if '__awStreetJob' not in s:
  assert s.count(a)==1; s=s.replace(a,b)
open(P,'w').write(s); print('ok')
