#!/usr/bin/env python3
"""Allocation-free hot paths in the core bundle (point-in-polygon `fm`, hero `hides`, `__blocked` M_,
brands region key). Destructuring in these loops allocated ~8 MB/frame of iterators while driving.
Results are bit-identical; originals stay in the bundle and are used with ?corefix=0. Idempotent."""
import os
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../game/assets/index-D_YJh5Nn.js')
s=open(P).read()

def rep(a,b):
  global s
  assert s.count(a)==1,(s.count(a),a[:80]); s=s.replace(a,b)

if 'awCF=' not in s:
  rep("var dm=new Nf,fm=",
      "var awCF=new URLSearchParams(location.search).get(`corefix`)!==`0`,awPC=new WeakMap,"
      "awFm=(e,t,n)=>{let r=!1;for(let i=0,a=e.length-1;i<e.length;a=i++){let I=e[i],A=e[a],o=I[0],s=I[1],c=A[0],l=A[1];s>n!=l>n&&t<(c-o)*(n-s)/(l-s)+o&&(r=!r)}return r},"
      "awPoly=e=>{let z0=1/0,z1=-1/0,x=0,z=0;for(let i=0;i<e.length;i++){let p=e[i];x+=p[0],z+=p[1],p[1]<z0&&(z0=p[1]),p[1]>z1&&(z1=p[1])}return{z0,z1,cx:x/e.length,cz:z/e.length}},"
      "dm=new Nf,fm=")
  # point-in-polygon can only toggle when z0<=n<z1, so the z-range test is an exact early-out
  rep("hides(e){for(let[t,n]of this.pts)",
      "hides(e){if(!awCF)return this.hides0(e);let z0=1/0,z1=-1/0,sx=0,sz=0,L=e.length;for(let i=0;i<L;i++){let p=e[i];sx+=p[0],sz+=p[1],p[1]<z0&&(z0=p[1]),p[1]>z1&&(z1=p[1])}"
      "for(let P=this.pts,i=0;i<P.length;i++){let p=P[i],t=p[0],n=p[1];if(n>=z0&&n<z1&&awFm(e,t,n))return!0}"
      "if(this.polys.length){let t=sx/L,n=sz/L;for(let P=this.polys,i=0;i<P.length;i++){let r=P[i],c=awPC.get(r);c||awPC.set(r,c=awPoly(r));"
      "if(n>=c.z0&&n<c.z1&&awFm(r,t,n))return!0;if(c.cz>=z0&&c.cz<z1&&awFm(e,c.cx,c.cz))return!0}}return!1}"
      "hides0(e){for(let[t,n]of this.pts)")
  rep("function M_(e,t){",
      "function M_(e,t){if(!awCF)return M_0(e,t);let n=A_.get(Math.floor(e/k_)*1e5+Math.floor(t/k_));if(!n)return!1;"
      "for(let j=0;j<n.length;j++){let r=n[j],B=r.bb;if(e<B[0]||e>B[1]||t<B[2]||t>B[3])continue;let s=!1;"
      "for(let k=0,i=r.length-1;k<r.length;i=k++){let P=r[k],Q=r[i],a=P[0],o=P[1],c=Q[0],l=Q[1];o>t!=l>t&&e<(c-a)*(t-o)/(l-o)+a&&(s=!s)}if(s)return!0}return!1}"
      "function M_0(e,t){")
  rep("if(!n._g&&r<900){let e=this.w.M,t=Math.floor((n.x-e.X0)/e.RS)+`,`+Math.floor((n.z-e.Z0)/e.RS),",
      "if(!n._g&&r<900){let e=this.w.M,t=awCF&&n.__awRK||(n.__awRK=Math.floor((n.x-e.X0)/e.RS)+`,`+Math.floor((n.z-e.Z0)/e.RS)),")
open(P,'w').write(s); print('ok')
