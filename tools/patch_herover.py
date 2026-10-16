#!/usr/bin/env python3
"""Cache-bust landmark (hero) GLB loads: ./models/hero/<id>.glb?v=HV. HV is the ONE constant to bump on any landmark change;
landmarks/install.sh rewrites it automatically (timestamp) and re-runs this patch. Idempotent."""
import re,glob,os
HV='h202610162900'
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/'); f=D+'assets/'+re.search(r'index-[A-Za-z0-9_-]+\.js',open(D+'index.html').read()).group(0); s=open(f).read()
pat=r'dm\.loadAsync\(`\./`\+n\.glb\.replace\(/\^\\\.\?\\//,``\)(\+`\?v=\w+`)?\)'
s2,n=re.subn(pat,'dm.loadAsync(`./`+n.glb.replace(/^\\.?\\//,``)+`?v=%s`)'%HV,s,count=1)
assert n==1,'hero load site not found'
open(f,'w').write(s2); print('herover',HV)
# landmark loader: enable Draco (decoder already shipped in ./draco/ for the kit loader) so compressed hero GLBs (nd_st_*) load. Idempotent.
s=open(f).read()
if 'dm=new Nf().setDRACOLoader' not in s:
  assert s.count('var dm=new Nf,')==1; s=s.replace('var dm=new Nf,','var dm=new Nf().setDRACOLoader(new Vp().setDecoderPath(`./draco/`)),'); open(f,'w').write(s); print('herover: draco on')
