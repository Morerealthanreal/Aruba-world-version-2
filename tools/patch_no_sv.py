#!/usr/bin/env python3
"""r268 (Justin 2026-10-15): remove the camera (Street View / old-engine) button next to the quality selector and
the URL routes into that blocky view (?ground=old|sv, ?sv, ?hybrid, ?osm) -> always the real engine. Idempotent."""
import re
F=re.search(r'index-[A-Za-z0-9_-]+\.js',open('/workspace/aruba-world-merged/game/index.html').read()).group(0)
P='/workspace/aruba-world-merged/game/assets/'+F; s=open(P).read(); n=0
m=re.search(r"t\(`📷`,`Street View mode[^`]*`,\(\)=>\{[^{}]*\}\),",s)
if m: s=s.replace(m.group(0),'',1); n+=1
m=re.search(r"Og=\(Dg\.get\(`ground`\)\|\|\(Dg\.has\(`hybrid`\)\|\|Dg\.has\(`osm`\)\|\|Dg\.has\(`sv`\)\?`old`:`real`\)\)===`real`",s)
if m: s=s.replace(m.group(0),'Og=!0',1); n+=1
open(P,'w').write(s); print('no-sv patched',n)
