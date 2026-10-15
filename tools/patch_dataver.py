#!/usr/bin/env python3
"""Cache-bust map data JSON loads (data/real/{r_*,st_*,manifest,graph,landmarks}.json?v=DV). DV is set by landmarks/install.sh
from a hash of game/data/real/*.json (changes only when map data changes). Idempotent."""
import re,glob,os
DV='d3a32b7b078'
f=glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/assets/index-*.js'))[0]; s=open(f).read()
pats=[r'(\$\{t\}r_\$\{n\}\.json)(\?v=\w+)?`',r'(\$\{t\}st_\$\{n\}\.json)(\?v=\w+)?`',r'(\./data/real/manifest\.json)(\?v=\w+)?`',r'(\./data/real/graph\.json)(\?v=\w+)?`',r'(\./data/real/landmarks\.json)(\?v=\w+)?`']
for p in pats:
  s,n=re.subn(p,lambda m:m.group(1)+'?v='+DV+'`',s); assert n>=1,p
open(f,'w').write(s); print('dataver',DV)
