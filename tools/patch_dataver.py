#!/usr/bin/env python3
"""Cache-bust map data loads (data/real/{r_*,st_*,manifest,graph,landmarks}.json and terrain h_/s_/ov_h/ov_s.png ?v=DV). DV is set by landmarks/install.sh
from a hash of game/data/real/*.json + *.png (changes only when map data changes). Idempotent."""
import re,glob,os
DV='d9c7336c6a3'
f=glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/assets/index-*.js'))[0]; s=open(f).read()
pats=[r'(\$\{t\}r_\$\{n\}\.json)(\?v=\w+)?`',r'(\$\{t\}st_\$\{n\}\.json)(\?v=\w+)?`',r'(\./data/real/manifest\.json)(\?v=\w+)?`',r'(\./data/real/graph\.json)(\?v=\w+)?`',r'(\./data/real/landmarks\.json)(\?v=\w+)?`',r'(\$\{t\}h_\$\{n\}\.png)(\?v=\w+)?`',r'(\$\{t\}s_\$\{n\}\.png)(\?v=\w+)?`',r'(\./data/real/ov_h\.png)(\?v=\w+)?`',r'(\./data/real/ov_s\.png)(\?v=\w+)?`']
for p in pats:
  s,n=re.subn(p,lambda m:m.group(1)+'?v='+DV+'`',s); assert n>=1,p
open(f,'w').write(s); print('dataver',DV)
