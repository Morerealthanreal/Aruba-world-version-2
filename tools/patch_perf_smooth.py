#!/usr/bin/env python3
"""Smooth-drive hot paths in the core bundle. Idempotent.

- Ct reuses the last getParameters/getProgramCacheKey result while the material version, lights,
  fog, environment, render target and geometry feature bits are unchanged (?progcache=0 disables).
- heightAt/roadHeightAt keep the last region instead of allocating a key string per sample.
  disposeRegion drops that reference so a streamed-out region can be collected.
- Car suspension median is an unrolled insertion sort (same 5 samples, same clamp).
- Terrain LOD downgrades wait 15% past the threshold; upgrades stay immediate.
- The dispose-distance scan no longer copies regions.values() every frame.
- GTAO's alpha-mesh hide list is walked in 1.2 ms slices instead of a full scene traverse.
- disposeRegion frees the street-sign canvas atlas (one per streamed region). The mesh is
  named signs; shared pole/fence/hedge materials are left alone. __awGone stops a later
  initTexture from allocating the same atlas again.
"""
import os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../game/assets/index-D_YJh5Nn.js')
s = open(P).read()

def rep(a, b, tag):
    global s
    n = s.count(a)
    if n != 1:
        raise SystemExit(f'{tag}: expected 1 occurrence, found {n}: {a[:70]}')
    s = s.replace(a, b)

if 'r.awK!==void 0' not in s:
    rep(
        "function Ct(e,t,n){t.isScene!==!0&&(t=ke);let r=z.get(e),i=A.state.lights,a=A.state.shadowsArray,o=i.state.version,s=Ve.getParameters(e,i.state,a,t,n,A.state.lightProbeGridArray),c=Ve.getProgramCacheKey(s),l=r.programs;",
        "function Ct(e,t,n){t.isScene!==!0&&(t=ke);let r=z.get(e),i=A.state.lights,a=A.state.shadowsArray,o=i.state.version,"
        "g=n.geometry,at=g.attributes,mo=g.morphAttributes,mc=mo.position||mo.normal||mo.color,rt=F.getRenderTarget(),"
        "env=(e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial)?t.environment:null,"
        "sig=(at.color?1:0)|(at.tangent?2:0)|(at.uv?4:0)|(at.uv1?8:0)|(at.uv2?16:0)|(at.normal?32:0)|(at.skinIndex?64:0)|"
        "(mo.position?128:0)|(mo.normal?256:0)|(mo.color?512:0)|(n.isInstancedMesh?1024:0)|(n.isBatchedMesh?2048:0)|"
        "(n.isSkinnedMesh?4096:0)|(n.receiveShadow?8192:0)|(n.instanceColor?16384:0)|(n._colorsTexture?32768:0)|(n.morphTexture?65536:0),s,c;"
        "if(window.__awProg!==0&&r.awK!==void 0&&r.awV===e.version&&r.awL===o&&r.awF===t.fog&&r.awFx===(t.fog&&t.fog.isFogExp2?1:0)&&"
        "r.awE===env&&r.awEv===(env?env.version:0)&&r.awCs===F.outputColorSpace&&r.awTm===F.toneMapping&&r.awS===sig&&"
        "r.awMc===(mc?mc.length:0)&&r.awRt===(rt?rt.isXRRenderTarget===!0?2:1:0)&&r.awSh===a.length&&r.awCl===Ge.numPlanes&&"
        "r.awCi===Ge.numIntersection&&r.awSm===F.shadowMap.enabled&&r.awSt===F.shadowMap.type&&r.awPg===A.state.lightProbeGridArray.length)"
        "s=r.awP,c=r.awK;else{s=Ve.getParameters(e,i.state,a,t,n,A.state.lightProbeGridArray);c=Ve.getProgramCacheKey(s);"
        "if(window.__awProg!==0){r.awP=s;r.awK=c;r.awV=e.version;r.awL=o;r.awF=t.fog;r.awFx=t.fog&&t.fog.isFogExp2?1:0;"
        "r.awE=env;r.awEv=env?env.version:0;r.awCs=F.outputColorSpace;r.awTm=F.toneMapping;r.awS=sig;r.awMc=mc?mc.length:0;"
        "r.awRt=rt?rt.isXRRenderTarget===!0?2:1:0;r.awSh=a.length;r.awCl=Ge.numPlanes;r.awCi=Ge.numIntersection;"
        "r.awSm=F.shadowMap.enabled;r.awSt=F.shadowMap.type;r.awPg=A.state.lightProbeGridArray.length}}let l=r.programs;",
        "Ct")

if 'this._ax===r&&this._az===i' not in s:
    rep(
        "heightAt(e,t){let n=this.M,r=Math.floor((e-n.X0)/n.RS),i=Math.floor((t-n.Z0)/n.RS),a=this.regions.get(r+`,`+i);if(a&&a.H){",
        "heightAt(e,t){let n=this.M,r=Math.floor((e-n.X0)/n.RS),i=Math.floor((t-n.Z0)/n.RS),a;"
        "if(this._ax===r&&this._az===i)a=this._ar;else this._ax=r,this._az=i,a=this._ar=this.regions.get(r+`,`+i);if(a&&a.H){",
        "heightAt")

if 'this._ax===rx' not in s:
    rep(
        "roadHeightAt(e,t){let n=this.M,r=this.regions.get(Math.floor((e-n.X0)/n.RS)+`,`+Math.floor((t-n.Z0)/n.RS));if(!r||!r.roadGrid)return null;",
        "roadHeightAt(e,t){let n=this.M,rx=Math.floor((e-n.X0)/n.RS),rz=Math.floor((t-n.Z0)/n.RS),r;"
        "if(this._ax===rx&&this._az===rz)r=this._ar;else this._ax=rx,this._az=rz,r=this._ar=this.regions.get(rx+`,`+rz);if(!r||!r.roadGrid)return null;",
        "roadHeightAt")

if 'this._ar===e&&(this._ax=1e9' not in s:
    rep(
        "this.regions.delete(e.rx+`,`+e.rz),this.queue=this.queue.filter(t=>t.R!==e),this.vegDirty=!0",
        "this.regions.delete(e.rx+`,`+e.rz),this._ar===e&&(this._ax=1e9,this._ar=null),this.queue=this.queue.filter(t=>t.R!==e),this.vegDirty=!0",
        "disposeRegion")

if 'P0=l,P1=W0' not in s:
    rep(
        "d=[c(s,-.82),c(s,i),c(-1.45,-.82),c(-1.45,i)],f=[l,...d].sort((e,t)=>e-t)[2],p=At.clamp,[m,h,g,_]=d.map(e=>p(Number.isFinite(e)?e:f,f-.3,f+.3)),v=(m+h+g+_)/4",
        "W0=c(s,-.82),W1=c(s,i),W2=c(-1.45,-.82),W3=c(-1.45,i),P0=l,P1=W0,P2=W1,P3=W2,P4=W3,q0=0,"
        "f=(P1<P0&&(q0=P0,P0=P1,P1=q0),P2<P1&&(q0=P1,P1=P2,P2=q0,P1<P0&&(q0=P0,P0=P1,P1=q0)),"
        "P3<P2&&(q0=P2,P2=P3,P3=q0,P2<P1&&(q0=P1,P1=P2,P2=q0,P1<P0&&(q0=P0,P0=P1,P1=q0))),"
        "P4<P3&&(q0=P3,P3=P4,P4=q0,P3<P2&&(q0=P2,P2=P3,P3=q0,P2<P1&&(q0=P1,P1=P2,P2=q0,P1<P0&&(q0=P0,P0=P1,P1=q0)))),P2),"
        "p=At.clamp,m=p(Number.isFinite(W0)?W0:f,f-.3,f+.3),h=p(Number.isFinite(W1)?W1:f,f-.3,f+.3),"
        "g=p(Number.isFinite(W2)?W2:f,f-.3,f+.3),_=p(Number.isFinite(W3)?W3:f,f-.3,f+.3),v=(m+h+g+_)/4",
        "median")

if 'd*1.15' not in s:
    rep(
        "a=i<d?4:i<f?8:16;if(a!==r.step&&!r.pending)",
        "a=i<d?4:i<f?8:16;if(r.step===4&&a>4&&i<d*1.15)a=4;else if(r.step===8&&a>8&&i<f*1.15)a=8;if(a!==r.step&&!r.pending)",
        "lod")

if 'for(let t of[...this.regions.values()])' in s:
    rep(
        "for(let t of[...this.regions.values()]){",
        "for(let t of this.regions.values()){",
        "regionsSpread")

# A hero that replaces a landmark used to detach the sign mesh and leave its geometry
# registered on the GPU. dispose() drops it. The canvas is released below; shared
# post, base, and canopy materials are not.
if "o.geometry&&o.geometry.dispose()" not in s:
    rep(
        "r.hero=t,r._g&&(e.group.remove(r._g),r._g=null)",
        "r.hero=t,r._g&&(e.group.remove(r._g),r._g.traverse(o=>{o.geometry&&o.geometry.dispose()}),r._g=null)",
        "heroSignInit")
    rep(
        "a._g&&=(i.group.remove(a._g),null)",
        "a._g&&=(i.group.remove(a._g),a._g.traverse(o=>{o.geometry&&o.geometry.dispose()}),null)",
        "heroSignUpdate")

# Geometry-only dispose left the landmark canvas uploaded. The brand list then
# built a replacement sign at the hero's height, so the measured lap counted
# the old texture and the new one. Release the canvas once. Shared post, base,
# and canopy materials are skipped. __awGone stops a second face of the same
# board from disposing that texture again.
SIGN_TEX = (
    "o.material&&[].concat(o.material).forEach(t=>{"
    "if(t===POST||t===BASE||t===GAS)return;let x=t.map;"
    "if(x&&x.dispose&&!x.__awGone){x.__awGone=1;t.emissiveMap===x&&(t.emissiveMap=null);x.dispose();x.image=null;t.map=null}})"
)
def sign_tex(shared):
    return SIGN_TEX.replace("POST", shared[0]).replace("BASE", shared[1]).replace("GAS", shared[2])
OLD_UPDATE = "a._g&&=(i.group.remove(a._g),a._g.traverse(o=>{o.geometry&&o.geometry.dispose()}),null)"
NEW_UPDATE = (
    "a._g&&=(i.group.remove(a._g),a._g.traverse(o=>{(o.geometry&&o.geometry.dispose(),"
    + sign_tex(("i.post", "i.base", "i.gasW"))
    + ")}),a._tex=null,null)"
)
OLD_INIT = "r._g&&(e.group.remove(r._g),r._g.traverse(o=>{o.geometry&&o.geometry.dispose()}),r._g=null)"
NEW_INIT = (
    "r._g&&(e.group.remove(r._g),r._g.traverse(o=>{(o.geometry&&o.geometry.dispose(),"
    + sign_tex(("e.post", "e.base", "e.gasW"))
    + ")}),r._tex=null,r._g=null)"
)
if OLD_UPDATE in s:
    rep(OLD_UPDATE, NEW_UPDATE, "heroSignTexUpdate")
if OLD_INIT in s:
    rep(OLD_INIT, NEW_INIT, "heroSignTexInit")

if 'x.__awGone' not in s:
    rep(
        "disposeRegion(e){e.group&&(this.group.remove(e.group),e.group.traverse(e=>{e.geometry&&e.geometry.dispose()}));for(let t of e.chunks||[])t.mesh&&t.mesh.geometry.dispose();e.hf?.dispose(),e.splat?.dispose(),e.mat?.dispose(),e.wmat?.dispose(),",
        "disposeRegion(e){e.group&&(this.group.remove(e.group),e.group.traverse(t=>{t.geometry&&t.geometry.dispose();"
        "if(t.name===`signs`&&t.material&&!Array.isArray(t.material)){let m=t.material,x=m.map;"
        "if(x&&!x.__awGone)x.__awGone=1,x.dispose();"
        "if(m.emissiveMap&&m.emissiveMap!==x&&!m.emissiveMap.__awGone)m.emissiveMap.__awGone=1,m.emissiveMap.dispose();"
        "m.map=null,m.emissiveMap=null}}));"
        "if(e.signTex&&!e.signTex.__awGone)e.signTex.__awGone=1,e.signTex.dispose();e.signTex=null;"
        "for(let t of e.chunks||[])t.mesh&&t.mesh.geometry.dispose();e.hf?.dispose(),e.splat?.dispose(),e.mat?.dispose(),e.wmat?.dispose(),",
        "signAtlas")

if 'e.__awQ' not in s:
    rep(
        "e.render=(...e)=>{performance.now()-s>(window.__awAoT||1e3)&&(s=performance.now(),a=[],t.traverse(e=>{let t=e.material;e.isMesh&&t&&!Array.isArray(t)&&(t.alphaTest>0||t.transparent)&&a.push(e)}));let n=a.map(e=>e.visible);a.forEach(e=>e.visible=!1),r(...e),a.forEach((e,t)=>e.visible=n[t])}",
        "e.render=(...i)=>{let o=performance.now();if(!e.__awQ)e.__awQ=[],e.__awS=new Set;"
        "if(o-s>(window.__awAoT||1e3)||e.__awQ.length){if(!e.__awQ.length){s=o;e.__awQ.push(t);e.__awSeen=new Set}"
        "let q=e.__awQ,seen=e.__awSeen,t0=o;while(q.length&&performance.now()-t0<1.2){let o=q.pop();if(!o)continue;"
        "let m=o.material;if(o.isMesh&&m&&!Array.isArray(m)&&(m.alphaTest>0||m.transparent)){seen.add(o);e.__awS.has(o)||(e.__awS.add(o),a.push(o))}"
        "let c=o.children;for(let k=0;k<c.length;k++)q.push(c[k])}if(!q.length){for(let k=a.length-1;k>=0;k--)seen.has(a[k])||(e.__awS.delete(a[k]),a.splice(k,1));e.__awSeen=null}}"
        "for(let k=0;k<a.length;k++){let m=a[k];m.__awV=m.visible;m.visible=!1}r(...i);for(let k=0;k<a.length;k++)a[k].visible=a[k].__awV}",
        "gtao")

open(P, 'w').write(s)
print('ok', os.path.basename(P), len(s))
