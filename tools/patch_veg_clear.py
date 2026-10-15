#!/usr/bin/env python3
"""Clear core vegetation inside listed circles (x,z,r) e.g. paved roundabout islands, plus (r199) inside ML-footprint houses (grid-hashed circles from landmarks/msb/<area>_add.json). Idempotent; edit CLEAR/AREAS and re-run."""
import re,json,math
P='/workspace/aruba-world-merged/game/assets/index-D_YJh5Nn.js'
CLEAR=[[-2723,-659,9],[-6596,-2863,13],[8629,9624,85],[8793,9624,85],[8629,9754,85],[8793,9754,85],[-7345,-5362,32],[-6518,-5811,30],[-6234,1242,31],[-6630.5,-1925.3,17],[-5857,733,30],[-5857,785,30],[-5700,1182,45],[-5655,1182,40],[6625,9030,45],[6690,9040,50],[6740,9050,40]]  # Piedra Plat island; Wei Ming island; Sunrise Solar Park blocks; Noord complex
AREAS=['noord','palmbeach','oranjestad','sannicolas']
H=[]
for a in AREAS:
  for b in json.load(open(f'/workspace/landmarks/msb/{a}_add.json')):
    xs=[p[0] for p in b['p']]; zs=[p[1] for p in b['p']]; r=0.5*math.hypot(max(xs)-min(xs),max(zs)-min(zs))+1.0
    H+= [round(b['c'][0],1),round(b['c'][1],1),round(min(r,25),1)]
s=open(P).read()
a0="for(let[i,a,o,s]of e[n]||[])if(!(window.__awVegClear||[]).some(c=>(i-c[0])**2+(a-c[1])**2<c[2]*c[2]))r[n].push("
a="for(let[i,a,o,s]of e[n]||[])r[n].push("
b0="for(let[i,a,o,s]of e[n]||[])if(!(window.__awVegHit&&window.__awVegHit(i,a)))r[n].push("
b="for(let[i,a,o,s]of e[n]||[])if(!(window.__awVegHit&&window.__awVegHit(i,a,n)))r[n].push("
if b0 in s: s=s.replace(b0,b)
if a0 in s: s=s.replace(a0,b)
elif b not in s: assert s.count(a)==1; s=s.replace(a,b)
s=re.sub(r'^window\.__aw(?:Veg[A-Za-z]*|Beach)=.*?;\n','',s,flags=re.M)
s=re.sub(r'^\(function\(\)\{/\*awveg\*/.*?\n','',s,flags=re.M)
pre='window.__awVegClear='+json.dumps(CLEAR).replace(' ','')+';\n'
pre+='window.__awVegH='+json.dumps(H).replace(' ','')+';\n'
BEACH=json.load(open('/workspace/landmarks/beach_clear.json'))  # r218: open sand, drop shrubs(s)/cacti(k) only
pre+='window.__awBeach='+json.dumps(BEACH).replace(' ','')+';\n'
pre+='(function(){/*awveg*/var G={},S=50,H=window.__awVegH,C=window.__awVegClear;function add(x,z,r){for(var gx=Math.floor((x-r)/S);gx<=Math.floor((x+r)/S);gx++)for(var gz=Math.floor((z-r)/S);gz<=Math.floor((z+r)/S);gz++)(G[gx+"_"+gz]=G[gx+"_"+gz]||[]).push(x,z,r)}for(var k=0;k<H.length;k+=3)add(H[k],H[k+1],H[k+2]);var B=[];for(var c of C)if(c[2]>S)B.push(c);else add(c[0],c[1],c[2]);function pip(P,x,z){var c=false;for(var i=0,j=P.length-1;i<P.length;j=i++){var a=P[i],b=P[j];if((a[1]>z)!=(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c}return c}var BB=(window.__awBeach||[]).map(function(P){var xs=P.map(function(p){return p[0]}),zs=P.map(function(p){return p[1]});return [Math.min.apply(0,xs),Math.max.apply(0,xs),Math.min.apply(0,zs),Math.max.apply(0,zs),P]});window.__awVegHit=function(x,z,n){if(n==="k"||n==="s"){for(var q of BB)if(x>q[0]&&x<q[1]&&z>q[2]&&z<q[3]&&pip(q[4],x,z))return true}var L=G[Math.floor(x/S)+"_"+Math.floor(z/S)];if(L)for(var k=0;k<L.length;k+=3){var dx=x-L[k],dz=z-L[k+1];if(dx*dx+dz*dz<L[k+2]*L[k+2])return true}for(var c of B)if((x-c[0])**2+(z-c[1])**2<c[2]*c[2])return true;return false}})();\n'
s=pre+s
open(P,'w').write(s); print('ok',len(H)//3)
