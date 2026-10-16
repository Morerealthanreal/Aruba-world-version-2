#!/usr/bin/env python3
"""Keep the loading-screen intro music script in game/index.html (idempotent; run by landmarks/install.sh).
Inserts <script src="./intro/intro-music.js?v=IV"> right after the viewport/title head block, before the main bundle."""
import os,re
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/'); f=D+'index.html'; s=open(f).read()
IV='i3'
tag='<script src="./intro/intro-music.js?v=%s"></script>'%IV
s2=re.sub(r'\s*<script src="\./intro/intro-music\.js[^"]*"></script>','',s)
s2=s2.replace('</title>','</title>\n  '+tag,1)
if s2!=s: open(f,'w').write(s2)
print('intro patched', tag in s2, os.path.exists(D+'intro/intro-music.js'), os.path.exists(D+'audio/music/track1.mp3'))
