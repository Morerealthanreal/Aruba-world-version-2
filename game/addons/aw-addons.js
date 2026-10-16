var Om=Object.defineProperty;var Fm=(l,e,t)=>e in l?Om(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var x=(l,e,t)=>Fm(l,typeof e!="symbol"?e+"":e,t);function ah(){return new Promise(l=>{let e=()=>{let t=window.game;t&&t.ready&&t.real&&t.real.sky&&t.real.sky.sun?l(t):setTimeout(e,250)};e()})}var H=new URLSearchParams(location.search);var lh="aw_clock";function Um(){let l={t:.4166666666666667,frozen:!1,len:24};try{let n=JSON.parse(localStorage.getItem(lh)||"null");n&&isFinite(n.t)&&(l={t:n.t,frozen:!!n.frozen,len:isFinite(n.len)&&n.len>0?n.len:24})}catch{}let e=H.get("t");e!==null&&isFinite(+e)&&(l.t=(+e%24+24)%24/24);let t=H.get("daylen");return t!==null&&+t>0&&(l.len=+t),H.get("freeze")==="1"&&(l.frozen=!0),l}var hr=class{constructor(){x(this,"t");x(this,"frozen");x(this,"len");x(this,"lastSave",0);x(this,"listeners",[]);let e=Um();this.t=e.t,this.frozen=e.frozen,this.len=e.len}step(e){this.frozen||(this.t=(this.t+e/(this.len*60))%1),performance.now()-this.lastSave>5e3&&this.save()}setHour(e){this.t=(e%24+24)%24/24,this.save(),this.listeners.forEach(t=>t())}setFrozen(e){this.frozen=e,this.save(),this.listeners.forEach(t=>t())}onChange(e){this.listeners.push(e)}save(){this.lastSave=performance.now();try{localStorage.setItem(lh,JSON.stringify({t:+this.t.toFixed(5),frozen:this.frozen,len:this.len}))}catch{}}};var Qh=1;var ed=3,Bs=0,uo=1,K=2,kl=0,td=1,ei=2;var Gl=5;var nd=100;var Hl=201;var id=204,ho=205;var _l=0,yl=1,Ml=2,Yr=3,wl=4,Sl=5,Al=6,Tl=7,fo=0,sd=1,rd=2;var Vl=1,Wl=2,Xl=3,ql=4,Yl=5,Zl=6,Kl=7,El="attached",od="detached",jl=300,ad=301,Jl=302;var ld=306,Wt=1e3,kn=1001,vs=1002,Li=1003,$l=1004;var Ql=1005;var en=1006,ec=1007;var ti=1008;var ni=1009;var cd=1014,Di=1015;var Xt=1023;var ud=1028,hd=1029;var dd=2200,fd=2201,pd=2202,Vn=2300,Wn=2301,Vr=2302,Rl=2303,Gn=2400,Hn=2401,_s=2402,po=2500,md=2501,tc=0,zs=1,Vi=2;var nc=0;var ic="",Z="srgb",ot="srgb-linear",Cl="linear",Wr="srgb";var Xr=7680;var gd=519;var sc=35044,ht=35048;var Ht=2e3,ys=2001;function Bm(l){for(let e=l.length-1;e>=0;--e)if(l[e]>=65535)return!0;return!1}function zm(l){return ArrayBuffer.isView(l)&&!(l instanceof DataView)}function Zr(l){return document.createElementNS("http://www.w3.org/1999/xhtml",l)}var ch={},Ni=null;function Pl(...l){let e="THREE."+l.shift();Ni?Ni("log",e,...l):console.log(e,...l)}function xd(l){let e=l[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=l[1];t&&t.isStackTrace?l[0]+=" "+t.getLocation():l[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return l}function _e(...l){l=xd(l);let e="THREE."+l.shift();if(Ni)Ni("warn",e,...l);else{let t=l[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...l)}}function Ee(...l){l=xd(l);let e="THREE."+l.shift();if(Ni)Ni("error",e,...l);else{let t=l[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...l)}}function Pi(...l){let e=l.join(" ");e in ch||(ch[e]=!0,_e(...l))}var km={[_l]:yl,[Ml]:Al,[wl]:Tl,[Yr]:Sl,[yl]:_l,[Al]:Ml,[Tl]:wl,[Sl]:Yr},qt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}},Ve=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],uh=1234567,xs=Math.PI/180,Oi=180/Math.PI;function vt(){let l=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ve[l&255]+Ve[l>>8&255]+Ve[l>>16&255]+Ve[l>>24&255]+"-"+Ve[e&255]+Ve[e>>8&255]+"-"+Ve[e>>16&15|64]+Ve[e>>24&255]+"-"+Ve[t&63|128]+Ve[t>>8&255]+"-"+Ve[t>>16&255]+Ve[t>>24&255]+Ve[n&255]+Ve[n>>8&255]+Ve[n>>16&255]+Ve[n>>24&255]).toLowerCase()}function ae(l,e,t){return Math.max(e,Math.min(t,l))}function rc(l,e){return(l%e+e)%e}function Gm(l,e,t,n,i){return n+(l-e)*(i-n)/(t-e)}function Hm(l,e,t){return l!==e?(t-l)/(e-l):0}function bs(l,e,t){return(1-t)*l+t*e}function Vm(l,e,t,n){return bs(l,e,1-Math.exp(-t*n))}function Wm(l,e=1){return e-Math.abs(rc(l,e*2)-e)}function Xm(l,e,t){return l<=e?0:l>=t?1:(l=(l-e)/(t-e),l*l*(3-2*l))}function qm(l,e,t){return l<=e?0:l>=t?1:(l=(l-e)/(t-e),l*l*l*(l*(l*6-15)+10))}function Ym(l,e){return l+Math.floor(Math.random()*(e-l+1))}function Zm(l,e){return l+Math.random()*(e-l)}function Km(l){return l*(.5-Math.random())}function jm(l){l!==void 0&&(uh=l);let e=uh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Jm(l){return l*xs}function $m(l){return l*Oi}function Qm(l){return l>0&&Number.isInteger(l)&&2**Math.round(Math.log2(l))===l}function e0(l){return Math.pow(2,Math.ceil(Math.log(l)/Math.LN2))}function t0(l){return Math.pow(2,Math.floor(Math.log(l)/Math.LN2))}function n0(l,e,t,n,i){let s=Math.cos,r=Math.sin,o=s(t/2),a=r(t/2),c=s((e+n)/2),u=r((e+n)/2),h=s((e-n)/2),d=r((e-n)/2),f=s((n-e)/2),p=r((n-e)/2);switch(i){case"XYX":l.set(o*u,a*h,a*d,o*c);break;case"YZY":l.set(a*d,o*u,a*h,o*c);break;case"ZXZ":l.set(a*h,a*d,o*u,o*c);break;case"XZX":l.set(o*u,a*p,a*f,o*c);break;case"YXY":l.set(a*f,o*u,a*p,o*c);break;case"ZYZ":l.set(a*p,a*f,o*u,o*c);break;default:_e("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function bt(l,e){switch(e.constructor){case Float32Array:return l;case Uint32Array:return l/4294967295;case Uint16Array:return l/65535;case Uint8Array:case Uint8ClampedArray:return l/255;case Int32Array:return Math.max(l/2147483647,-1);case Int16Array:return Math.max(l/32767,-1);case Int8Array:return Math.max(l/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ve(l,e){switch(e.constructor){case Float32Array:return l;case Uint32Array:return Math.round(l*4294967295);case Uint16Array:return Math.round(l*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(l*255);case Int32Array:return Math.round(l*2147483647);case Int16Array:return Math.round(l*32767);case Int8Array:return Math.round(l*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var oc={DEG2RAD:xs,RAD2DEG:Oi,generateUUID:vt,clamp:ae,euclideanModulo:rc,mapLinear:Gm,inverseLerp:Hm,lerp:bs,damp:Vm,pingpong:Wm,smoothstep:Xm,smootherstep:qm,randInt:Ym,randFloat:Zm,randFloatSpread:Km,seededRandom:jm,degToRad:Jm,radToDeg:$m,isPowerOfTwo:Qm,ceilPowerOfTwo:e0,floorPowerOfTwo:t0,setQuaternionFromProperEuler:n0,normalize:ve,denormalize:bt},uc=class uc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ae(this.x,e.x,t.x),this.y=ae(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ae(this.x,e,t),this.y=ae(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ae(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};uc.prototype.isVector2=!0;var U=uc,Y=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,o){let a=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3],d=s[r+0],f=s[r+1],p=s[r+2],m=s[r+3];if(h!==m||a!==d||c!==f||u!==p){let g=a*d+c*f+u*p+h*m;g<0&&(d=-d,f=-f,p=-p,m=-m,g=-g);let b=1-o;if(g<.9995){let v=Math.acos(g),M=Math.sin(v);b=Math.sin(b*v)/M,o=Math.sin(o*v)/M,a=a*b+d*o,c=c*b+f*o,u=u*b+p*o,h=h*b+m*o}else{a=a*b+d*o,c=c*b+f*o,u=u*b+p*o,h=h*b+m*o;let v=1/Math.sqrt(a*a+c*c+u*u+h*h);a*=v,c*=v,u*=v,h*=v}}e[t]=a,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,r){let o=n[i],a=n[i+1],c=n[i+2],u=n[i+3],h=s[r],d=s[r+1],f=s[r+2],p=s[r+3];return e[t]=o*p+u*h+a*f-c*d,e[t+1]=a*p+u*d+c*h-o*f,e[t+2]=c*p+u*f+o*d-a*h,e[t+3]=u*p-o*h-a*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,r=e._order,o=Math.cos,a=Math.sin,c=o(n/2),u=o(i/2),h=o(s/2),d=a(n/2),f=a(i/2),p=a(s/2);switch(r){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:_e("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],c=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-a)*f,this._y=(s-c)*f,this._z=(r-i)*f}else if(n>o&&n>h){let f=2*Math.sqrt(1+n-o-h);this._w=(u-a)/f,this._x=.25*f,this._y=(i+r)/f,this._z=(s+c)/f}else if(o>h){let f=2*Math.sqrt(1+o-n-h);this._w=(s-c)/f,this._x=(i+r)/f,this._y=.25*f,this._z=(a+u)/f}else{let f=2*Math.sqrt(1+h-n-o);this._w=(r-i)/f,this._x=(s+c)/f,this._y=(a+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ae(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,o=t._x,a=t._y,c=t._z,u=t._w;return this._x=n*u+r*o+i*c-s*a,this._y=i*u+r*a+s*o-n*c,this._z=s*u+r*c+n*a-i*o,this._w=r*u-n*o-i*a-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,r=-r,o=-o);let a=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);a=Math.sin(a*c)/u,t=Math.sin(t*c)/u,this._x=this._x*a+n*t,this._y=this._y*a+i*t,this._z=this._z*a+s*t,this._w=this._w*a+r*t,this._onChangeCallback()}else this._x=this._x*a+n*t,this._y=this._y*a+i*t,this._z=this._z*a+s*t,this._w=this._w*a+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},hc=class hc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(hh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(hh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,r=e.y,o=e.z,a=e.w,c=2*(r*i-o*n),u=2*(o*t-s*i),h=2*(s*n-r*t);return this.x=t+a*c+r*h-o*u,this.y=n+a*u+o*c-s*h,this.z=i+a*h+s*u-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ae(this.x,e.x,t.x),this.y=ae(this.y,e.y,t.y),this.z=ae(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ae(this.x,e,t),this.y=ae(this.y,e,t),this.z=ae(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,r=t.x,o=t.y,a=t.z;return this.x=i*a-s*o,this.y=s*r-n*a,this.z=n*o-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ya.copy(this).projectOnVector(e),this.sub(Ya)}reflect(e){return this.sub(Ya.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ae(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};hc.prototype.isVector3=!0;var w=hc,Ya=new w,hh=new Y,dc=class dc{constructor(e,t,n,i,s,r,o,a,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,o,a,c)}set(e,t,n,i,s,r,o,a,c){let u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=s,u[5]=a,u[6]=n,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],o=n[3],a=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],m=i[0],g=i[3],b=i[6],v=i[1],M=i[4],_=i[7],A=i[2],E=i[5],C=i[8];return s[0]=r*m+o*v+a*A,s[3]=r*g+o*M+a*E,s[6]=r*b+o*_+a*C,s[1]=c*m+u*v+h*A,s[4]=c*g+u*M+h*E,s[7]=c*b+u*_+h*C,s[2]=d*m+f*v+p*A,s[5]=d*g+f*M+p*E,s[8]=d*b+f*_+p*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],a=e[6],c=e[7],u=e[8];return t*r*u-t*o*c-n*s*u+n*o*a+i*s*c-i*r*a}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],a=e[6],c=e[7],u=e[8],h=u*r-o*c,d=o*a-u*s,f=c*s-r*a,p=t*h+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=h*m,e[1]=(i*c-u*n)*m,e[2]=(o*n-i*r)*m,e[3]=d*m,e[4]=(u*t-i*a)*m,e[5]=(i*s-o*t)*m,e[6]=f*m,e[7]=(n*a-c*t)*m,e[8]=(r*t-n*s)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,o){let a=Math.cos(s),c=Math.sin(s);return this.set(n*a,n*c,-n*(a*r+c*o)+r+e,-i*c,i*a,-i*(-c*r+a*o)+o+t,0,0,1),this}scale(e,t){return Pi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Za.makeScale(e,t)),this}rotate(e){return Pi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Za.makeRotation(-e)),this}translate(e,t){return Pi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Za.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};dc.prototype.isMatrix3=!0;var te=dc,Za=new te,dh=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fh=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function i0(){let l={enabled:!0,workingColorSpace:ot,spaces:{},convert:function(i,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===Wr&&(i.r=Vt(i.r),i.g=Vt(i.g),i.b=Vt(i.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Wr&&(i.r=Ii(i.r),i.g=Ii(i.g),i.b=Ii(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ic?Cl:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,r){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Pi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),l.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Pi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),l.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return l.define({[ot]:{primaries:e,whitePoint:n,transfer:Cl,toXYZ:dh,fromXYZ:fh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Z},outputColorSpaceConfig:{drawingBufferColorSpace:Z}},[Z]:{primaries:e,whitePoint:n,transfer:Wr,toXYZ:dh,fromXYZ:fh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Z}}}),l}var qe=i0();function Vt(l){return l<.04045?l*.0773993808:Math.pow(l*.9478672986+.0521327014,2.4)}function Ii(l){return l<.0031308?l*12.92:1.055*Math.pow(l,.41666)-.055}var pi,Kr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{pi===void 0&&(pi=Zr("canvas")),pi.width=e.width,pi.height=e.height;let i=pi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=pi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Zr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Vt(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Vt(t[n]/255)*255):t[n]=Vt(t[n]);return{data:t,width:e.width,height:e.height}}else return _e("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},s0=0,jr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:s0++}),this.uuid=vt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,o=i.length;r<o;r++)i[r].isDataTexture?s.push(Ka(i[r].image)):s.push(Ka(i[r]))}else s=Ka(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function Ka(l){return typeof HTMLImageElement<"u"&&l instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&l instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&l instanceof ImageBitmap?Kr.getDataURL(l):l.data?{data:Array.from(l.data),width:l.width,height:l.height,type:l.data.constructor.name}:(_e("Texture: Unable to serialize Texture."),{})}var r0=0,ja=new w,ct=class l extends qt{constructor(e=l.DEFAULT_IMAGE,t=l.DEFAULT_MAPPING,n=kn,i=kn,s=en,r=ti,o=Xt,a=ni,c=l.DEFAULT_ANISOTROPY,u=ic){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:r0++}),this.uuid=vt(),this.name="",this.source=new jr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=a,this.offset=new U(0,0),this.repeat=new U(1,1),this.center=new U(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(ja).x}get height(){return this.source.getSize(ja).y}get depth(){return this.source.getSize(ja).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){_e(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){_e(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==jl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wt:e.x=e.x-Math.floor(e.x);break;case kn:e.x=e.x<0?0:1;break;case vs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wt:e.y=e.y-Math.floor(e.y);break;case kn:e.y=e.y<0?0:1;break;case vs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ct.DEFAULT_IMAGE=null;ct.DEFAULT_MAPPING=jl;ct.DEFAULT_ANISOTROPY=1;var fc=class fc{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,a=e.elements,c=a[0],u=a[4],h=a[8],d=a[1],f=a[5],p=a[9],m=a[2],g=a[6],b=a[10];if(Math.abs(u-d)<.01&&Math.abs(h-m)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+m)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+b-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(c+1)/2,_=(f+1)/2,A=(b+1)/2,E=(u+d)/4,C=(h+m)/4,T=(p+g)/4;return M>_&&M>A?M<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(M),i=E/n,s=C/n):_>A?_<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(_),n=E/i,s=T/i):A<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(A),n=C/s,i=T/s),this.set(n,i,s,t),this}let v=Math.sqrt((g-p)*(g-p)+(h-m)*(h-m)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(g-p)/v,this.y=(h-m)/v,this.z=(d-u)/v,this.w=Math.acos((c+f+b-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ae(this.x,e.x,t.x),this.y=ae(this.y,e.y,t.y),this.z=ae(this.z,e.z,t.z),this.w=ae(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ae(this.x,e,t),this.y=ae(this.y,e,t),this.z=ae(this.z,e,t),this.w=ae(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ae(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};fc.prototype.isVector4=!0;var Ke=fc;var co=class co{constructor(e,t,n,i,s,r,o,a,c,u,h,d,f,p,m,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,o,a,c,u,h,d,f,p,m,g)}set(e,t,n,i,s,r,o,a,c,u,h,d,f,p,m,g){let b=this.elements;return b[0]=e,b[4]=t,b[8]=n,b[12]=i,b[1]=s,b[5]=r,b[9]=o,b[13]=a,b[2]=c,b[6]=u,b[10]=h,b[14]=d,b[3]=f,b[7]=p,b[11]=m,b[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new co().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/mi.setFromMatrixColumn(e,0).length(),s=1/mi.setFromMatrixColumn(e,1).length(),r=1/mi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,r=Math.cos(n),o=Math.sin(n),a=Math.cos(i),c=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=r*u,f=r*h,p=o*u,m=o*h;t[0]=a*u,t[4]=-a*h,t[8]=c,t[1]=f+p*c,t[5]=d-m*c,t[9]=-o*a,t[2]=m-d*c,t[6]=p+f*c,t[10]=r*a}else if(e.order==="YXZ"){let d=a*u,f=a*h,p=c*u,m=c*h;t[0]=d+m*o,t[4]=p*o-f,t[8]=r*c,t[1]=r*h,t[5]=r*u,t[9]=-o,t[2]=f*o-p,t[6]=m+d*o,t[10]=r*a}else if(e.order==="ZXY"){let d=a*u,f=a*h,p=c*u,m=c*h;t[0]=d-m*o,t[4]=-r*h,t[8]=p+f*o,t[1]=f+p*o,t[5]=r*u,t[9]=m-d*o,t[2]=-r*c,t[6]=o,t[10]=r*a}else if(e.order==="ZYX"){let d=r*u,f=r*h,p=o*u,m=o*h;t[0]=a*u,t[4]=p*c-f,t[8]=d*c+m,t[1]=a*h,t[5]=m*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*a,t[10]=r*a}else if(e.order==="YZX"){let d=r*a,f=r*c,p=o*a,m=o*c;t[0]=a*u,t[4]=m-d*h,t[8]=p*h+f,t[1]=h,t[5]=r*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+p,t[10]=d-m*h}else if(e.order==="XZY"){let d=r*a,f=r*c,p=o*a,m=o*c;t[0]=a*u,t[4]=-h,t[8]=c*u,t[1]=d*h+m,t[5]=r*u,t[9]=f*h-p,t[2]=p*h-f,t[6]=o*u,t[10]=m*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(o0,e,a0)}lookAt(e,t,n){let i=this.elements;return st.subVectors(e,t),st.lengthSq()===0&&(st.z=1),st.normalize(),on.crossVectors(n,st),on.lengthSq()===0&&(Math.abs(n.z)===1?st.x+=1e-4:st.z+=1e-4,st.normalize(),on.crossVectors(n,st)),on.normalize(),dr.crossVectors(st,on),i[0]=on.x,i[4]=dr.x,i[8]=st.x,i[1]=on.y,i[5]=dr.y,i[9]=st.y,i[2]=on.z,i[6]=dr.z,i[10]=st.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],o=n[4],a=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],m=n[6],g=n[10],b=n[14],v=n[3],M=n[7],_=n[11],A=n[15],E=i[0],C=i[4],T=i[8],R=i[12],I=i[1],P=i[5],D=i[9],N=i[13],F=i[2],z=i[6],W=i[10],J=i[14],j=i[3],ee=i[7],Q=i[11],se=i[15];return s[0]=r*E+o*I+a*F+c*j,s[4]=r*C+o*P+a*z+c*ee,s[8]=r*T+o*D+a*W+c*Q,s[12]=r*R+o*N+a*J+c*se,s[1]=u*E+h*I+d*F+f*j,s[5]=u*C+h*P+d*z+f*ee,s[9]=u*T+h*D+d*W+f*Q,s[13]=u*R+h*N+d*J+f*se,s[2]=p*E+m*I+g*F+b*j,s[6]=p*C+m*P+g*z+b*ee,s[10]=p*T+m*D+g*W+b*Q,s[14]=p*R+m*N+g*J+b*se,s[3]=v*E+M*I+_*F+A*j,s[7]=v*C+M*P+_*z+A*ee,s[11]=v*T+M*D+_*W+A*Q,s[15]=v*R+M*N+_*J+A*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],o=e[5],a=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],p=e[3],m=e[7],g=e[11],b=e[15],v=a*f-c*d,M=o*f-c*h,_=o*d-a*h,A=r*f-c*u,E=r*d-a*u,C=r*h-o*u;return t*(m*v-g*M+b*_)-n*(p*v-g*A+b*E)+i*(p*M-m*A+b*C)-s*(p*_-m*E+g*C)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],o=e[9],a=e[2],c=e[6],u=e[10];return t*(r*u-o*c)-n*(s*u-o*a)+i*(s*c-r*a)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],a=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],p=e[12],m=e[13],g=e[14],b=e[15],v=t*o-n*r,M=t*a-i*r,_=t*c-s*r,A=n*a-i*o,E=n*c-s*o,C=i*c-s*a,T=u*m-h*p,R=u*g-d*p,I=u*b-f*p,P=h*g-d*m,D=h*b-f*m,N=d*b-f*g,F=v*N-M*D+_*P+A*I-E*R+C*T;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/F;return e[0]=(o*N-a*D+c*P)*z,e[1]=(i*D-n*N-s*P)*z,e[2]=(m*C-g*E+b*A)*z,e[3]=(d*E-h*C-f*A)*z,e[4]=(a*I-r*N-c*R)*z,e[5]=(t*N-i*I+s*R)*z,e[6]=(g*_-p*C-b*M)*z,e[7]=(u*C-d*_+f*M)*z,e[8]=(r*D-o*I+c*T)*z,e[9]=(n*I-t*D-s*T)*z,e[10]=(p*E-m*_+b*v)*z,e[11]=(h*_-u*E-f*v)*z,e[12]=(o*R-r*P-a*T)*z,e[13]=(t*P-n*R+i*T)*z,e[14]=(m*M-p*A-g*v)*z,e[15]=(u*A-h*M+d*v)*z,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,r=e.x,o=e.y,a=e.z,c=s*r,u=s*o;return this.set(c*r+n,c*o-i*a,c*a+i*o,0,c*o+i*a,u*o+n,u*a-i*r,0,c*a-i*o,u*a+i*r,s*a*a+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,r=t._y,o=t._z,a=t._w,c=s+s,u=r+r,h=o+o,d=s*c,f=s*u,p=s*h,m=r*u,g=r*h,b=o*h,v=a*c,M=a*u,_=a*h,A=n.x,E=n.y,C=n.z;return i[0]=(1-(m+b))*A,i[1]=(f+_)*A,i[2]=(p-M)*A,i[3]=0,i[4]=(f-_)*E,i[5]=(1-(d+b))*E,i[6]=(g+v)*E,i[7]=0,i[8]=(p+M)*C,i[9]=(g-v)*C,i[10]=(1-(d+m))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=mi.set(i[0],i[1],i[2]).length(),o=mi.set(i[4],i[5],i[6]).length(),a=mi.set(i[8],i[9],i[10]).length();s<0&&(r=-r),mt.copy(this);let c=1/r,u=1/o,h=1/a;return mt.elements[0]*=c,mt.elements[1]*=c,mt.elements[2]*=c,mt.elements[4]*=u,mt.elements[5]*=u,mt.elements[6]*=u,mt.elements[8]*=h,mt.elements[9]*=h,mt.elements[10]*=h,t.setFromRotationMatrix(mt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,r,o=Ht,a=!1){let c=this.elements,u=2*s/(t-e),h=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),p,m;if(a)p=s/(r-s),m=r*s/(r-s);else if(o===Ht)p=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(o===ys)p=-r/(r-s),m=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,r,o=Ht,a=!1){let c=this.elements,u=2/(t-e),h=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),p,m;if(a)p=1/(r-s),m=r/(r-s);else if(o===Ht)p=-2/(r-s),m=-(r+s)/(r-s);else if(o===ys)p=-1/(r-s),m=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};co.prototype.isMatrix4=!0;var O=co,mi=new w,mt=new O,o0=new w(0,0,0),a0=new w(1,1,1),on=new w,dr=new w,st=new w,ph=new O,mh=new Y,Et=class l{constructor(e=0,t=0,n=0,i=l.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],o=i[8],a=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(ae(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ae(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(a,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ae(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(a,s));break;case"ZYX":this._y=Math.asin(-ae(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(a,s)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(ae(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-ae(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:_e("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ph.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ph,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return mh.setFromEuler(this),this.setFromQuaternion(mh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Et.DEFAULT_ORDER="XYZ";var Ms=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},l0=0,gh=new w,gi=new Y,Ot=new O,fr=new w,rs=new w,c0=new w,u0=new Y,xh=new w(1,0,0),bh=new w(0,1,0),vh=new w(0,0,1),_h={type:"added"},h0={type:"removed"},xi={type:"childadded",child:null},Ja={type:"childremoved",child:null},Re=class l extends qt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:l0++}),this.uuid=vt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=l.DEFAULT_UP.clone();let e=new w,t=new Et,n=new Y,i=new w(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new O},normalMatrix:{value:new te}}),this.matrix=new O,this.matrixWorld=new O,this.matrixAutoUpdate=l.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=l.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ms,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.multiply(gi),this}rotateOnWorldAxis(e,t){return gi.setFromAxisAngle(e,t),this.quaternion.premultiply(gi),this}rotateX(e){return this.rotateOnAxis(xh,e)}rotateY(e){return this.rotateOnAxis(bh,e)}rotateZ(e){return this.rotateOnAxis(vh,e)}translateOnAxis(e,t){return gh.copy(e).applyQuaternion(this.quaternion),this.position.add(gh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(xh,e)}translateY(e){return this.translateOnAxis(bh,e)}translateZ(e){return this.translateOnAxis(vh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ot.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fr.copy(e):fr.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ot.lookAt(rs,fr,this.up):Ot.lookAt(fr,rs,this.up),this.quaternion.setFromRotationMatrix(Ot),i&&(Ot.extractRotation(i.matrixWorld),gi.setFromRotationMatrix(Ot),this.quaternion.premultiply(gi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ee("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_h),xi.child=e,this.dispatchEvent(xi),xi.child=null):Ee("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(h0),Ja.child=e,this.dispatchEvent(Ja),Ja.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ot.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ot.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ot),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_h),xi.child=e,this.dispatchEvent(xi),xi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,e,c0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,u0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,a){return o[a.uuid]===void 0&&(o[a.uuid]=a.toJSON(e)),a.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let a=o.shapes;if(Array.isArray(a))for(let c=0,u=a.length;c<u;c++){let h=a[c];s(e.shapes,h)}else s(e.shapes,a)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let a=0,c=this.material.length;a<c;a++)o.push(s(e.materials,this.material[a]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let a=this.animations[o];i.animations.push(s(e.animations,a))}}if(t){let o=r(e.geometries),a=r(e.materials),c=r(e.textures),u=r(e.images),h=r(e.shapes),d=r(e.skeletons),f=r(e.animations),p=r(e.nodes);o.length>0&&(n.geometries=o),a.length>0&&(n.materials=a),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function r(o){let a=[];for(let c in o){let u=o[c];delete u.metadata,a.push(u)}return a}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Re.DEFAULT_UP=new w(0,1,0);Re.DEFAULT_MATRIX_AUTO_UPDATE=!0;Re.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Me=class extends Re{constructor(){super(),this.isGroup=!0,this.type="Group"}};var bd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},an={h:0,s:0,l:0},pr={h:0,s:0,l:0};function $a(l,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?l+(e-l)*6*t:t<1/2?e:t<2/3?l+(e-l)*6*(2/3-t):l}var L=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Z){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,qe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=qe.workingColorSpace){if(e=rc(e,1),t=ae(t,0,1),n=ae(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=$a(r,s,e+1/3),this.g=$a(r,s,e),this.b=$a(r,s,e-1/3)}return qe.colorSpaceToWorking(this,i),this}setStyle(e,t=Z){function n(s){s!==void 0&&parseFloat(s)<1&&_e("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],o=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:_e("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(s,16),t);_e("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Z){let n=bd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):_e("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vt(e.r),this.g=Vt(e.g),this.b=Vt(e.b),this}copyLinearToSRGB(e){return this.r=Ii(e.r),this.g=Ii(e.g),this.b=Ii(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Z){return qe.workingToColorSpace(We.copy(this),e),Math.round(ae(We.r*255,0,255))*65536+Math.round(ae(We.g*255,0,255))*256+Math.round(ae(We.b*255,0,255))}getHexString(e=Z){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.workingToColorSpace(We.copy(this),t);let n=We.r,i=We.g,s=We.b,r=Math.max(n,i,s),o=Math.min(n,i,s),a,c,u=(o+r)/2;if(o===r)a=0,c=0;else{let h=r-o;switch(c=u<=.5?h/(r+o):h/(2-r-o),r){case n:a=(i-s)/h+(i<s?6:0);break;case i:a=(s-n)/h+2;break;case s:a=(n-i)/h+4;break}a/=6}return e.h=a,e.s=c,e.l=u,e}getRGB(e,t=qe.workingColorSpace){return qe.workingToColorSpace(We.copy(this),t),e.r=We.r,e.g=We.g,e.b=We.b,e}getStyle(e=Z){qe.workingToColorSpace(We.copy(this),e);let t=We.r,n=We.g,i=We.b;return e!==Z?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(an),this.setHSL(an.h+e,an.s+t,an.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(an),e.getHSL(pr);let n=bs(an.h,pr.h,t),i=bs(an.s,pr.s,t),s=bs(an.l,pr.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},We=new L;L.NAMES=bd;var gt=new w,Ft=new w,Qa=new w,Ut=new w,bi=new w,vi=new w,yh=new w,el=new w,tl=new w,nl=new w,il=new Ke,sl=new Ke,rl=new Ke,Gt=class l{constructor(e=new w,t=new w,n=new w){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),gt.subVectors(e,t),i.cross(gt);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){gt.subVectors(i,t),Ft.subVectors(n,t),Qa.subVectors(e,t);let r=gt.dot(gt),o=gt.dot(Ft),a=gt.dot(Qa),c=Ft.dot(Ft),u=Ft.dot(Qa),h=r*c-o*o;if(h===0)return s.set(0,0,0),null;let d=1/h,f=(c*a-o*u)*d,p=(r*u-o*a)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Ut)===null?!1:Ut.x>=0&&Ut.y>=0&&Ut.x+Ut.y<=1}static getInterpolation(e,t,n,i,s,r,o,a){return this.getBarycoord(e,t,n,i,Ut)===null?(a.x=0,a.y=0,"z"in a&&(a.z=0),"w"in a&&(a.w=0),null):(a.setScalar(0),a.addScaledVector(s,Ut.x),a.addScaledVector(r,Ut.y),a.addScaledVector(o,Ut.z),a)}static getInterpolatedAttribute(e,t,n,i,s,r){return il.setScalar(0),sl.setScalar(0),rl.setScalar(0),il.fromBufferAttribute(e,t),sl.fromBufferAttribute(e,n),rl.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(il,s.x),r.addScaledVector(sl,s.y),r.addScaledVector(rl,s.z),r}static isFrontFacing(e,t,n,i){return gt.subVectors(n,t),Ft.subVectors(e,t),gt.cross(Ft).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gt.subVectors(this.c,this.b),Ft.subVectors(this.a,this.b),gt.cross(Ft).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return l.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return l.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return l.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return l.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return l.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,o;bi.subVectors(i,n),vi.subVectors(s,n),el.subVectors(e,n);let a=bi.dot(el),c=vi.dot(el);if(a<=0&&c<=0)return t.copy(n);tl.subVectors(e,i);let u=bi.dot(tl),h=vi.dot(tl);if(u>=0&&h<=u)return t.copy(i);let d=a*h-u*c;if(d<=0&&a>=0&&u<=0)return r=a/(a-u),t.copy(n).addScaledVector(bi,r);nl.subVectors(e,s);let f=bi.dot(nl),p=vi.dot(nl);if(p>=0&&f<=p)return t.copy(s);let m=f*c-a*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(vi,o);let g=u*p-f*h;if(g<=0&&h-u>=0&&f-p>=0)return yh.subVectors(s,i),o=(h-u)/(h-u+(f-p)),t.copy(i).addScaledVector(yh,o);let b=1/(g+m+d);return r=m*b,o=d*b,t.copy(n).addScaledVector(bi,r).addScaledVector(vi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ie=class{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(xt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(xt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=xt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=s.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,xt):xt.fromBufferAttribute(s,r),xt.applyMatrix4(e.matrixWorld),this.expandByPoint(xt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),mr.copy(n.boundingBox)),mr.applyMatrix4(e.matrixWorld),this.union(mr)}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,xt),xt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(os),gr.subVectors(this.max,os),_i.subVectors(e.a,os),yi.subVectors(e.b,os),Mi.subVectors(e.c,os),ln.subVectors(yi,_i),cn.subVectors(Mi,yi),Nn.subVectors(_i,Mi);let t=[0,-ln.z,ln.y,0,-cn.z,cn.y,0,-Nn.z,Nn.y,ln.z,0,-ln.x,cn.z,0,-cn.x,Nn.z,0,-Nn.x,-ln.y,ln.x,0,-cn.y,cn.x,0,-Nn.y,Nn.x,0];return!ol(t,_i,yi,Mi,gr)||(t=[1,0,0,0,1,0,0,0,1],!ol(t,_i,yi,Mi,gr))?!1:(xr.crossVectors(ln,cn),t=[xr.x,xr.y,xr.z],ol(t,_i,yi,Mi,gr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,xt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(xt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Bt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Bt=[new w,new w,new w,new w,new w,new w,new w,new w],xt=new w,mr=new Ie,_i=new w,yi=new w,Mi=new w,ln=new w,cn=new w,Nn=new w,os=new w,gr=new w,xr=new w,On=new w;function ol(l,e,t,n,i){for(let s=0,r=l.length-3;s<=r;s+=3){On.fromArray(l,s);let o=i.x*Math.abs(On.x)+i.y*Math.abs(On.y)+i.z*Math.abs(On.z),a=e.dot(On),c=t.dot(On),u=n.dot(On);if(Math.max(-Math.max(a,c,u),Math.min(a,c,u))>o)return!1}return!0}var Oe=new w,br=new U,d0=0,oe=class extends qt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:d0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=sc,this.updateRanges=[],this.gpuType=Di,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)br.fromBufferAttribute(this,t),br.applyMatrix3(e),this.setXY(t,br.x,br.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Oe.fromBufferAttribute(this,t),Oe.applyMatrix3(e),this.setXYZ(t,Oe.x,Oe.y,Oe.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Oe.fromBufferAttribute(this,t),Oe.applyMatrix4(e),this.setXYZ(t,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Oe.fromBufferAttribute(this,t),Oe.applyNormalMatrix(e),this.setXYZ(t,Oe.x,Oe.y,Oe.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Oe.fromBufferAttribute(this,t),Oe.transformDirection(e),this.setXYZ(t,Oe.x,Oe.y,Oe.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=bt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ve(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=bt(t,this.array)),t}setX(e,t){return this.normalized&&(t=ve(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=bt(t,this.array)),t}setY(e,t){return this.normalized&&(t=ve(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=bt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ve(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=bt(t,this.array)),t}setW(e,t){return this.normalized&&(t=ve(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ve(t,this.array),n=ve(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ve(t,this.array),n=ve(n,this.array),i=ve(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=ve(t,this.array),n=ve(n,this.array),i=ve(i,this.array),s=ve(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Fi=class extends oe{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Jr=class extends oe{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var de=class extends oe{constructor(e,t,n){super(new Float32Array(e),t,n)}},f0=new Ie,as=new w,al=new w,X=class{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):f0.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;as.subVectors(e,this.center);let t=as.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(as,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(al.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(as.copy(e.center).add(al)),this.expandByPoint(as.copy(e.center).sub(al))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},p0=0,at=new O,ll=new Re,wi=new w,rt=new Ie,ls=new Ie,ke=new w,le=class l extends qt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:p0++}),this.uuid=vt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bm(e)?Jr:Fi)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new te().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return at.makeRotationFromQuaternion(e),this.applyMatrix4(at),this}rotateX(e){return at.makeRotationX(e),this.applyMatrix4(at),this}rotateY(e){return at.makeRotationY(e),this.applyMatrix4(at),this}rotateZ(e){return at.makeRotationZ(e),this.applyMatrix4(at),this}translate(e,t,n){return at.makeTranslation(e,t,n),this.applyMatrix4(at),this}scale(e,t,n){return at.makeScale(e,t,n),this.applyMatrix4(at),this}lookAt(e){return ll.lookAt(e),ll.updateMatrix(),this.applyMatrix4(ll.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new de(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&_e("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ie);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ee("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];rt.setFromBufferAttribute(s),this.morphTargetsRelative?(ke.addVectors(this.boundingBox.min,rt.min),this.boundingBox.expandByPoint(ke),ke.addVectors(this.boundingBox.max,rt.max),this.boundingBox.expandByPoint(ke)):(this.boundingBox.expandByPoint(rt.min),this.boundingBox.expandByPoint(rt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ee('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new X);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ee("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(e){let n=this.boundingSphere.center;if(rt.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let o=t[s];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(ke.addVectors(rt.min,ls.min),rt.expandByPoint(ke),ke.addVectors(rt.max,ls.max),rt.expandByPoint(ke)):(rt.expandByPoint(ls.min),rt.expandByPoint(ls.max))}rt.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)ke.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(ke));if(t)for(let s=0,r=t.length;s<r;s++){let o=t[s],a=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ke.fromBufferAttribute(o,c),a&&(wi.fromBufferAttribute(e,c),ke.add(wi)),i=Math.max(i,n.distanceToSquared(ke))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ee('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ee("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new oe(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let o=[],a=[];for(let T=0;T<n.count;T++)o[T]=new w,a[T]=new w;let c=new w,u=new w,h=new w,d=new U,f=new U,p=new U,m=new w,g=new w;function b(T,R,I){c.fromBufferAttribute(n,T),u.fromBufferAttribute(n,R),h.fromBufferAttribute(n,I),d.fromBufferAttribute(s,T),f.fromBufferAttribute(s,R),p.fromBufferAttribute(s,I),u.sub(c),h.sub(c),f.sub(d),p.sub(d);let P=1/(f.x*p.y-p.x*f.y);isFinite(P)&&(m.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(P),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(P),o[T].add(m),o[R].add(m),o[I].add(m),a[T].add(g),a[R].add(g),a[I].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let T=0,R=v.length;T<R;++T){let I=v[T],P=I.start,D=I.count;for(let N=P,F=P+D;N<F;N+=3)b(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let M=new w,_=new w,A=new w,E=new w;function C(T){A.fromBufferAttribute(i,T),E.copy(A);let R=o[T];M.copy(R),M.sub(A.multiplyScalar(A.dot(R))).normalize(),_.crossVectors(E,R);let P=_.dot(a[T])<0?-1:1;r.setXYZW(T,M.x,M.y,M.z,P)}for(let T=0,R=v.length;T<R;++T){let I=v[T],P=I.start,D=I.count;for(let N=P,F=P+D;N<F;N+=3)C(e.getX(N+0)),C(e.getX(N+1)),C(e.getX(N+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new oe(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new w,s=new w,r=new w,o=new w,a=new w,c=new w,u=new w,h=new w;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),m=e.getX(d+1),g=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,g),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),o.fromBufferAttribute(n,p),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,g),o.add(u),a.add(u),c.add(u),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ke.fromBufferAttribute(e,t),ke.normalize(),e.setXYZ(t,ke.x,ke.y,ke.z)}toNonIndexed(){function e(o,a){let c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(a.length*u),f=0,p=0;for(let m=0,g=a.length;m<g;m++){o.isInterleavedBufferAttribute?f=a[m]*o.data.stride+o.offset:f=a[m]*u;for(let b=0;b<u;b++)d[p++]=c[f++]}return new oe(d,u,h)}if(this.index===null)return _e("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new l,n=this.index.array,i=this.attributes;for(let o in i){let a=i[o],c=e(a,n);t.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let a=[],c=s[o];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);a.push(f)}t.morphAttributes[o]=a}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,a=r.length;o<a;o++){let c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let a=this.parameters;for(let c in a)a[c]!==void 0&&(e[c]=a[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let a in n){let c=n[a];e.data.attributes[a]=c.toJSON(e.data)}let i={},s=!1;for(let a in this.morphAttributes){let c=this.morphAttributes[a],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(i[a]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let u=i[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let c=0,u=r.length;c<u;c++){let h=r[c];this.addGroup(h.start,h.count,h.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let a=e.boundingSphere;return a!==null&&(this.boundingSphere=a.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xn=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=sc,this.updateRanges=[],this.version=0,this.uuid=vt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=vt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Ze=new w,dn=class l{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ze.fromBufferAttribute(this,t),Ze.applyMatrix4(e),this.setXYZ(t,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ze.fromBufferAttribute(this,t),Ze.applyNormalMatrix(e),this.setXYZ(t,Ze.x,Ze.y,Ze.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ze.fromBufferAttribute(this,t),Ze.transformDirection(e),this.setXYZ(t,Ze.x,Ze.y,Ze.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=bt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ve(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ve(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ve(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ve(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ve(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=bt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=bt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=bt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=bt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ve(t,this.array),n=ve(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ve(t,this.array),n=ve(n,this.array),i=ve(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ve(t,this.array),n=ve(n,this.array),i=ve(i,this.array),s=ve(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Pl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new oe(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new l(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Pl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},cl=new w,m0=new w,g0=new te,At=class{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=cl.subVectors(n,t).cross(m0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(cl),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||g0.getNormalMatrix(e),i=this.coplanarPoint(cl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},x0=0,Qe=class extends qt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:x0++}),this.uuid=vt(),this.name="",this.type="Material",this.blending=td,this.side=Bs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=id,this.blendDst=ho,this.blendEquation=nd,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new L(0,0,0),this.blendAlpha=0,this.depthFunc=Yr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xr,this.stencilZFail=Xr,this.stencilZPass=Xr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){_e(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){_e(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let r=[];for(let o in s){let a=s[o];delete a.metadata,r.push(a)}return r}if(t){let s=i(e.textures),r=i(e.images);s.length>0&&(n.textures=s),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new L().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new At().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new U().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new U().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ui=class extends Qe{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new L(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Si,cs=new w,Ai=new w,Ti=new w,Ei=new U,us=new U,vd=new O,vr=new w,hs=new w,_r=new w,Mh=new U,ul=new U,wh=new U,ws=class extends Re{constructor(e=new Ui){if(super(),this.isSprite=!0,this.type="Sprite",Si===void 0){Si=new le;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Xn(t,5);Si.setIndex([0,1,2,0,2,3]),Si.setAttribute("position",new dn(n,3,0,!1)),Si.setAttribute("uv",new dn(n,2,3,!1))}this.geometry=Si,this.material=e,this.center=new U(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ee('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ai.setFromMatrixScale(this.matrixWorld),vd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ti.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ai.multiplyScalar(-Ti.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let r=this.center;yr(vr.set(-.5,-.5,0),Ti,r,Ai,i,s),yr(hs.set(.5,-.5,0),Ti,r,Ai,i,s),yr(_r.set(.5,.5,0),Ti,r,Ai,i,s),Mh.set(0,0),ul.set(1,0),wh.set(1,1);let o=e.ray.intersectTriangle(vr,hs,_r,!1,cs);if(o===null&&(yr(hs.set(-.5,.5,0),Ti,r,Ai,i,s),ul.set(0,1),o=e.ray.intersectTriangle(vr,_r,hs,!1,cs),o===null))return;let a=e.ray.origin.distanceTo(cs);a<e.near||a>e.far||t.push({distance:a,point:cs.clone(),uv:Gt.getInterpolation(cs,vr,hs,_r,Mh,ul,wh,new U),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function yr(l,e,t,n,i,s){Ei.subVectors(l,t).addScalar(.5).multiply(n),i!==void 0?(us.x=s*Ei.x-i*Ei.y,us.y=i*Ei.x+s*Ei.y):us.copy(Ei),l.copy(e),l.x+=us.x,l.y+=us.y,l.applyMatrix4(vd)}var Mr=new w,Sh=new w,Ss=class extends Re{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let n=0,i=t.length;n<i;n++){let s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);let i=this.levels,s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){let i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){Mr.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(Mr);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){Mr.setFromMatrixPosition(e.matrixWorld),Sh.setFromMatrixPosition(this.matrixWorld);let n=Mr.distanceTo(Sh)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let r=t[i].distance;if(t[i].object.visible&&(r-=r*t[i].hysteresis),n>=r)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let r=n[i];t.object.levels.push({object:r.object.uuid,distance:r.distance,hysteresis:r.hysteresis})}return t}},zt=new w,hl=new w,wr=new w,Sr=new w,fn=class{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,zt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=zt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(zt.copy(this.origin).addScaledVector(this.direction,t),zt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){hl.copy(e).add(t).multiplyScalar(.5),wr.copy(t).sub(e).normalize(),Sr.copy(this.origin).sub(hl);let s=e.distanceTo(t)*.5,r=-this.direction.dot(wr),o=Sr.dot(this.direction),a=-Sr.dot(wr),c=Sr.lengthSq(),u=Math.abs(1-r*r),h,d,f,p;if(u>0)if(h=r*a-o,d=r*o-a,p=s*u,h>=0)if(d>=-p)if(d<=p){let m=1/u;h*=m,d*=m,f=h*(h+r*d+2*o)+d*(r*h+d+2*a)+c}else d=s,h=Math.max(0,-(r*d+o)),f=-h*h+d*(d+2*a)+c;else d=-s,h=Math.max(0,-(r*d+o)),f=-h*h+d*(d+2*a)+c;else d<=-p?(h=Math.max(0,-(-r*s+o)),d=h>0?-s:Math.min(Math.max(-s,-a),s),f=-h*h+d*(d+2*a)+c):d<=p?(h=0,d=Math.min(Math.max(-s,-a),s),f=d*(d+2*a)+c):(h=Math.max(0,-(r*s+o)),d=h>0?s:Math.min(Math.max(-s,-a),s),f=-h*h+d*(d+2*a)+c);else d=r>0?-s:s,h=Math.max(0,-(r*d+o)),f=-h*h+d*(d+2*a)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(hl).addScaledVector(wr,d),f}intersectSphere(e,t){if(e.radius<0)return null;zt.subVectors(e.center,this.origin);let n=zt.dot(this.direction),i=zt.dot(zt)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),o=n-r,a=n+r;return a<0?null:o<0?this.at(a,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,r,o,a,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,r=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,r=(e.min.y-d.y)*u),n>r||s>i||((s>n||isNaN(n))&&(n=s),(r<i||isNaN(i))&&(i=r),h>=0?(o=(e.min.z-d.z)*h,a=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,a=(e.min.z-d.z)*h),n>a||o>i)||((o>n||n!==n)&&(n=o),(a<i||i!==i)&&(i=a),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,zt)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,o=this.direction,a=o.x,c=o.y,u=o.z,h=e.x-r.x,d=e.y-r.y,f=e.z-r.z,p=t.x-r.x,m=t.y-r.y,g=t.z-r.z,b=n.x-r.x,v=n.y-r.y,M=n.z-r.z,_=Math.abs(a),A=Math.abs(c),E=Math.abs(u),C,T,R,I,P,D,N,F,z,W,J,j;if(_>=A&&_>=E?(R=a,D=h,z=p,j=b,a>=0?(C=c,T=u,I=d,P=f,N=m,F=g,W=v,J=M):(C=u,T=c,I=f,P=d,N=g,F=m,W=M,J=v)):A>=E?(R=c,D=d,z=m,j=v,c>=0?(C=u,T=a,I=f,P=h,N=g,F=p,W=M,J=b):(C=a,T=u,I=h,P=f,N=p,F=g,W=b,J=M)):(R=u,D=f,z=g,j=M,u>=0?(C=a,T=c,I=h,P=d,N=p,F=m,W=b,J=v):(C=c,T=a,I=d,P=h,N=m,F=p,W=v,J=b)),R===0)return null;let ee=C/R,Q=T/R,se=1/R,me=I-ee*D,we=P-Q*D,pe=N-ee*z,ze=F-Q*z,fe=W-ee*j,Ne=J-Q*j,be=fe*ze-Ne*pe,$=me*Ne-we*fe,Se=pe*we-ze*me;if(i){if(be<0||$<0||Se<0)return null}else if((be<0||$<0||Se<0)&&(be>0||$>0||Se>0))return null;let it=be+$+Se;if(it===0)return null;let wt=se*(be*D+$*z+Se*j);return(it>0?wt<0:wt>0)?null:this.at(wt/it,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},k=class extends Qe{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new L(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Et,this.combine=fo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ah=new O,Fn=new fn,Ar=new X,Th=new w,Tr=new w,Er=new w,Rr=new w,dl=new w,Cr=new w,Eh=new w,Pr=new w,B=class extends Re{constructor(e=new le,t=new k){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(s&&o){Cr.set(0,0,0);for(let a=0,c=s.length;a<c;a++){let u=o[a],h=s[a];u!==0&&(dl.fromBufferAttribute(h,e),r?Cr.addScaledVector(dl,u):Cr.addScaledVector(dl.sub(t),u))}t.add(Cr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ar.copy(n.boundingSphere),Ar.applyMatrix4(s),Fn.copy(e.ray).recast(e.near),!(Ar.containsPoint(Fn.origin)===!1&&(Fn.intersectSphere(Ar,Th)===null||Fn.origin.distanceToSquared(Th)>(e.far-e.near)**2))&&(Ah.copy(s).invert(),Fn.copy(e.ray).applyMatrix4(Ah),!(n.boundingBox!==null&&Fn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Fn)))}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,o=s.index,a=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],v=Math.max(g.start,f.start),M=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,A=M;_<A;_+=3){let E=o.getX(_),C=o.getX(_+1),T=o.getX(_+2);i=Ir(this,b,e,n,c,u,h,E,C,T),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(o.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let v=o.getX(g),M=o.getX(g+1),_=o.getX(g+2);i=Ir(this,r,e,n,c,u,h,v,M,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(a!==void 0)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],v=Math.max(g.start,f.start),M=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,A=M;_<A;_+=3){let E=_,C=_+1,T=_+2;i=Ir(this,b,e,n,c,u,h,E,C,T),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(a.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let v=g,M=g+1,_=g+2;i=Ir(this,r,e,n,c,u,h,v,M,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function b0(l,e,t,n,i,s,r,o){let a;if(e.side===uo?a=n.intersectTriangle(r,s,i,!0,o):a=n.intersectTriangle(i,s,r,e.side===Bs,o),a===null)return null;Pr.copy(o),Pr.applyMatrix4(l.matrixWorld);let c=t.ray.origin.distanceTo(Pr);return c<t.near||c>t.far?null:{distance:c,point:Pr.clone(),object:l}}function Ir(l,e,t,n,i,s,r,o,a,c){l.getVertexPosition(o,Tr),l.getVertexPosition(a,Er),l.getVertexPosition(c,Rr);let u=b0(l,e,t,n,Tr,Er,Rr,Eh);if(u){let h=new w;Gt.getBarycoord(Eh,Tr,Er,Rr,h),i&&(u.uv=Gt.getInterpolatedAttribute(i,o,a,c,h,new U)),s&&(u.uv1=Gt.getInterpolatedAttribute(s,o,a,c,h,new U)),r&&(u.normal=Gt.getInterpolatedAttribute(r,o,a,c,h,new w),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:a,c,normal:new w,materialIndex:0};Gt.getNormal(Tr,Er,Rr,d.normal),u.face=d,u.barycoord=h}return u}var ds=new Ke,Rh=new Ke,Ch=new Ke,v0=new Ke,Ph=new O,Lr=new w,fl=new X,Ih=new O,pl=new fn,As=class extends B{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=El,this.bindMatrix=new O,this.bindMatrixInverse=new O,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ie),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingBox.expandByPoint(Lr)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new X),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Lr),this.boundingSphere.expandByPoint(Lr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fl.copy(this.boundingSphere),fl.applyMatrix4(i),e.ray.intersectsSphere(fl)!==!1&&(Ih.copy(i).invert(),pl.copy(e.ray).applyMatrix4(Ih),!(this.boundingBox!==null&&pl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,pl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ke,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===El?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===od?this.bindMatrixInverse.copy(this.bindMatrix).invert():_e("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;Rh.fromBufferAttribute(i.attributes.skinIndex,e),Ch.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(ds.copy(t),t.set(0,0,0,0)):(ds.set(...t,1),t.set(0,0,0)),ds.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=Ch.getComponent(s);if(r!==0){let o=Rh.getComponent(s);Ph.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(v0.copy(ds).applyMatrix4(Ph),r)}}return t.isVector4&&(t.w=ds.w),t.applyMatrix4(this.bindMatrixInverse)}},Bi=class extends Re{constructor(){super(),this.isBone=!0,this.type="Bone"}},lt=class extends ct{constructor(e=null,t=1,n=1,i,s,r,o,a,c=Li,u=Li,h,d){super(null,r,o,a,c,u,i,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Lh=new O,_0=new O,Ts=class l{constructor(e=[],t=[]){this.uuid=vt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){_e("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new O)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new O;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let o=e[s]?e[s].matrixWorld:_0;Lh.multiplyMatrices(o,t[s]),Lh.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new l(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new lt(t,e,e,Xt,Di);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=t[s];r===void 0&&(_e("Skeleton: No bone found with UUID:",s),r=new Bi),this.bones.push(r),this.boneInverses.push(new O().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let r=t[i];e.bones.push(r.uuid);let o=n[i];e.boneInverses.push(o.toArray())}return e}},Ye=class extends oe{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ri=new O,Dh=new O,Dr=[],Nh=new Ie,y0=new O,fs=new B,ps=new X,q=class extends B{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ye(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,y0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ie),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ri),Nh.copy(e.boundingBox).applyMatrix4(Ri),this.boundingBox.union(Nh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new X),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ri),ps.copy(e.boundingSphere).applyMatrix4(Ri),this.boundingSphere.union(ps)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[r+o]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(fs.geometry=this.geometry,fs.material=this.material,fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ps.copy(this.boundingSphere),ps.applyMatrix4(n),e.ray.intersectsSphere(ps)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Ri),Dh.multiplyMatrices(n,Ri),fs.matrixWorld=Dh,fs.raycast(e,Dr);for(let r=0,o=Dr.length;r<o;r++){let a=Dr[r];a.instanceId=s,a.object=this,t.push(a)}Dr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ye(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new lt(new Float32Array(i*this.count),i,this.count,ud,Di));let s=this.morphTexture.source.data.data,r=0;for(let c=0;c<n.length;c++)r+=n[c];let o=this.geometry.morphTargetsRelative?1:1-r,a=i*e;return s[a]=o,s.set(n,a+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Un=new X,M0=new U(.5,.5),Nr=new w,Yt=class{constructor(e=new At,t=new At,n=new At,i=new At,s=new At,r=new At){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ht,n=!1){let i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],p=s[8],m=s[9],g=s[10],b=s[11],v=s[12],M=s[13],_=s[14],A=s[15];if(i[0].setComponents(c-r,f-u,b-p,A-v).normalize(),i[1].setComponents(c+r,f+u,b+p,A+v).normalize(),i[2].setComponents(c+o,f+h,b+m,A+M).normalize(),i[3].setComponents(c-o,f-h,b-m,A-M).normalize(),n)i[4].setComponents(a,d,g,_).normalize(),i[5].setComponents(c-a,f-d,b-g,A-_).normalize();else if(i[4].setComponents(c-a,f-d,b-g,A-_).normalize(),t===Ht)i[5].setComponents(c+a,f+d,b+g,A+_).normalize();else if(t===ys)i[5].setComponents(a,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Un.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Un.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Un)}intersectsSprite(e){Un.center.set(0,0,0);let t=M0.distanceTo(e.center);return Un.radius=.7071067811865476+t,Un.applyMatrix4(e.matrixWorld),this.intersectsSphere(Un)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Nr.x=i.normal.x>0?e.max.x:e.min.x,Nr.y=i.normal.y>0?e.max.y:e.min.y,Nr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Nr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Oh=new O,$r=class l{constructor(){this.coordinateSystem=Ht,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){let s=t[i];Oh.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),n[i]===void 0&&(n[i]=new Yt),n[i].setFromProjectionMatrix(Oh,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new Yt),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new l().copy(this)}};function ml(l,e){return l-e}function w0(l,e){return l.z-e.z}function S0(l,e){return e.z-l.z}var Il=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,r=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];r.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}},$e=new O,A0=new L(1,1,1),T0=new Yt,E0=new $r,Or=new Ie,Bn=new X,ms=new w,Fh=new w,R0=new w,gl=new Il,Xe=new B,Fr=[];function C0(l,e,t=0){let n=e.itemSize;if(l.isInterleavedBufferAttribute||l.array.constructor!==e.array.constructor){let i=l.count;for(let s=0;s<i;s++)for(let r=0;r<n;r++)e.setComponent(s+t,r,l.getComponent(s,r))}else e.array.set(l.array,t*n);e.needsUpdate=!0}function zn(l,e){if(l.constructor!==e.constructor){let t=Math.min(l.length,e.length);for(let n=0;n<t;n++)e[n]=l[n]}else{let t=Math.min(l.length,e.length);e.set(new l.constructor(l.buffer,0,t))}}var qn=class extends B{constructor(e,t,n=t*2,i){super(new le,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),n=new lt(t,e,e,Xt,Di);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),n=new lt(t,e,e,hd,cd);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),n=new lt(t,e,e,Xt,Di);n.colorSpace=qe.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in e.attributes){let r=e.getAttribute(s),{array:o,itemSize:a,normalized:c}=r,u=new o.constructor(n*a),h=new oe(u,a,c);t.setAttribute(s,h)}if(e.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new oe(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ie);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,$e),this.getBoundingBoxAt(s,Or).applyMatrix4($e),e.union(Or)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new X);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,$e),this.getBoundingSphereAt(s,Bn).applyMatrix4($e),e.union(Bn)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(ml),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let s=this._matricesTexture;$e.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;let r=this._colorsTexture;return r&&(A0.toArray(r.image.data,i*4),r.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let r=e.getIndex();if(r!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?r.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let a;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(ml),a=this._availableGeometryIds.shift(),s[a]=i):(a=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(a,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,a}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),r=t.getIndex(),o=this._geometryInfo[e];if(i&&r.count>o.reservedIndexCount||t.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let a=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=t.getAttribute("position").count;for(let u in n.attributes){let h=t.getAttribute(u),d=n.getAttribute(u);C0(h,d,a);let f=h.itemSize;for(let p=h.count,m=c;p<m;p++){let g=a+p;for(let b=0;b<f;b++)d.setComponent(g,b,0)}d.needsUpdate=!0,d.addUpdateRange(a*f,c*f)}if(i){let u=o.indexStart,h=o.reservedIndexCount;o.indexCount=t.getIndex().count;for(let d=0;d<r.count;d++)s.setX(u+d,a+r.getX(d));for(let d=r.count,f=h;d<f;d++)s.setX(u+d,a);s.needsUpdate=!0,s.addUpdateRange(u,o.reservedIndexCount)}return o.start=i?o.indexStart:o.vertexStart,o.count=i?o.indexCount:o.vertexCount,o.boundingBox=null,t.boundingBox!==null&&(o.boundingBox=t.boundingBox.clone()),o.boundingSphere=null,t.boundingSphere!==null&&(o.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,i=n.map((r,o)=>o).sort((r,o)=>n[r].vertexStart-n[o].vertexStart),s=this.geometry;for(let r=0,o=n.length;r<o;r++){let a=i[r],c=n[a];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==t){let{indexStart:u,vertexStart:h,reservedIndexCount:d}=c,f=s.index,p=f.array,m=e-h;for(let g=u;g<u+d;g++)p[g]=p[g]+m;f.array.copyWithin(t,u,u+d),f.addUpdateRange(t,d),f.needsUpdate=!0,c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){let{vertexStart:u,reservedVertexCount:h}=c,d=s.attributes;for(let f in d){let p=d[f],{array:m,itemSize:g}=p;m.copyWithin(e*g,u*g,(u+h)*g),p.addUpdateRange(e*g,h*g),p.needsUpdate=!0}c.vertexStart=e}e+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){let s=new Ie,r=n.index,o=n.attributes.position;for(let a=i.start,c=i.start+i.count;a<c;a++){let u=a;r&&(u=r.getX(u)),s.expandByPoint(ms.fromBufferAttribute(o,u))}i.boundingBox=s}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){let s=new X;this.getBoundingBoxAt(e,Or),Or.getCenter(s.center);let r=n.index,o=n.attributes.position,a=0;for(let c=i.start,u=i.start+i.count;c<u;c++){let h=c;r&&(h=r.getX(h)),ms.fromBufferAttribute(o,h),a=Math.max(a,s.center.distanceToSquared(ms))}s.radius=Math.sqrt(a),i.boundingSphere=s}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this._visibilityChanged=!0,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(ml);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let i=new Int32Array(e),s=new Int32Array(e);zn(this._multiDrawCounts,i),zn(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=e;let r=this._indirectTexture,o=this._matricesTexture,a=this._colorsTexture;r.dispose(),this._initIndirectTexture(),zn(r.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),zn(o.image.data,this._matricesTexture.image.data),a&&(a.dispose(),this._initColorsTexture(),zn(a.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...n.map(o=>o.vertexStart+o.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(a=>a.indexStart+a.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let s=this.geometry;s.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new le,this._initializeGeometry(s));let r=this.geometry;s.index&&zn(s.index.array,r.index.array);for(let o in s.attributes)zn(s.attributes[o].array,r.attributes[o].array)}raycast(e,t){let n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,r=this.geometry;Xe.material=this.material,Xe.geometry.index=r.index,Xe.geometry.attributes=r.attributes,Xe.geometry.boundingBox===null&&(Xe.geometry.boundingBox=new Ie),Xe.geometry.boundingSphere===null&&(Xe.geometry.boundingSphere=new X);for(let o=0,a=n.length;o<a;o++){if(!n[o].visible||!n[o].active)continue;let c=n[o].geometryIndex,u=i[c];Xe.geometry.setDrawRange(u.start,u.count),this.getMatrixAt(o,Xe.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,Xe.geometry.boundingBox),this.getBoundingSphereAt(c,Xe.geometry.boundingSphere),Xe.raycast(e,Fr);for(let h=0,d=Fr.length;h<d;h++){let f=Fr[h];f.object=this,f.batchId=o,t.push(f)}Fr.length=0}Xe.material=null,Xe.geometry.index=null,Xe.geometry.attributes={},Xe.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._multiDrawBytesPerElement=e._multiDrawBytesPerElement,this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let r=i.getIndex(),o=r===null?1:r.array.BYTES_PER_ELEMENT,a=1;s.wireframe&&(a=2,o=i.attributes.position.count>65535?4:2);let c=this._instanceInfo,u=this._multiDrawStarts,h=this._multiDrawCounts,d=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,m=p.image.data,g=n.isArrayCamera?E0:T0;f&&(n.isArrayCamera?g.setFromArrayCamera(n):($e.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),g.setFromProjectionMatrix($e,n.coordinateSystem,n.reversedDepth)));let b=0;if(this.sortObjects){$e.copy(this.matrixWorld).invert(),ms.setFromMatrixPosition(n.matrixWorld).applyMatrix4($e),Fh.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection($e);for(let _=0,A=c.length;_<A;_++)if(c[_].visible&&c[_].active){let E=c[_].geometryIndex;this.getMatrixAt(_,$e),this.getBoundingSphereAt(E,Bn).applyMatrix4($e);let C=!1;if(f&&(C=!g.intersectsSphere(Bn)),!C){let T=d[E],R=R0.subVectors(Bn.center,ms).dot(Fh);gl.push(T.start,T.count,R,_)}}let v=gl.list,M=this.customSort;M===null?v.sort(s.transparent?S0:w0):M.call(this,v,n);for(let _=0,A=v.length;_<A;_++){let E=v[_];u[b]=E.start*o*a,h[b]=E.count*a,m[b]=E.index,b++}gl.reset()}else for(let v=0,M=c.length;v<M;v++)if(c[v].visible&&c[v].active){let _=c[v].geometryIndex,A=!1;if(f&&(this.getMatrixAt(v,$e),this.getBoundingSphereAt(_,Bn).applyMatrix4($e),A=!g.intersectsSphere(Bn)),!A){let E=d[_];u[b]=E.start*o*a,h[b]=E.count*a,m[b]=v,b++}}p.needsUpdate=!0,this._multiDrawCount=b,this._multiDrawBytesPerElement=o,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,r){this.onBeforeRender(e,null,i,s,r)}},zi=class extends Qe{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new L(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Qr=new w,eo=new w,Uh=new O,gs=new fn,Ur=new X,xl=new w,Bh=new w,Yn=class extends Re{constructor(e=new le,t=new zi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Qr.fromBufferAttribute(t,i-1),eo.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Qr.distanceTo(eo);e.setAttribute("lineDistance",new de(n,1))}else _e("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ur.copy(n.boundingSphere),Ur.applyMatrix4(i),Ur.radius+=s,e.ray.intersectsSphere(Ur)===!1)return;Uh.copy(i).invert(),gs.copy(e.ray).applyMatrix4(Uh);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),a=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let f=Math.max(0,r.start),p=Math.min(u.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=u.getX(m),v=u.getX(m+1),M=Br(this,e,gs,a,b,v,m);M&&t.push(M)}if(this.isLineLoop){let m=u.getX(p-1),g=u.getX(f),b=Br(this,e,gs,a,m,g,p-1);b&&t.push(b)}}else{let f=Math.max(0,r.start),p=Math.min(d.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=Br(this,e,gs,a,m,m+1,m);b&&t.push(b)}if(this.isLineLoop){let m=Br(this,e,gs,a,p-1,f,p-1);m&&t.push(m)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Br(l,e,t,n,i,s,r){let o=l.geometry.attributes.position;if(Qr.fromBufferAttribute(o,i),eo.fromBufferAttribute(o,s),t.distanceSqToSegment(Qr,eo,xl,Bh)>n)return;xl.applyMatrix4(l.matrixWorld);let c=e.ray.origin.distanceTo(xl);if(!(c<e.near||c>e.far))return{distance:c,point:Bh.clone().applyMatrix4(l.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:l}}var zh=new w,kh=new w,Es=class extends Yn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)zh.fromBufferAttribute(t,i),kh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+zh.distanceTo(kh);e.setAttribute("lineDistance",new de(n,1))}else _e("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Rs=class extends Yn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},pn=class extends Qe{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new L(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Gh=new O,Ll=new fn,zr=new X,kr=new w,_t=class extends Re{constructor(e=new le,t=new pn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zr.copy(n.boundingSphere),zr.applyMatrix4(i),zr.radius+=s,e.ray.intersectsSphere(zr)===!1)return;Gh.copy(i).invert(),Ll.copy(e.ray).applyMatrix4(Gh);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),a=o*o,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,r.start),f=Math.min(c.count,r.start+r.count);for(let p=d,m=f;p<m;p++){let g=c.getX(p);kr.fromBufferAttribute(h,g),Hh(kr,g,a,i,e,t,this)}}else{let d=Math.max(0,r.start),f=Math.min(h.count,r.start+r.count);for(let p=d,m=f;p<m;p++)kr.fromBufferAttribute(h,p),Hh(kr,p,a,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Hh(l,e,t,n,i,s,r){let o=Ll.distanceSqToPoint(l);if(o<t){let a=new w;Ll.closestPointToPoint(l,a),a.applyMatrix4(n);let c=i.ray.origin.distanceTo(a);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:a,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}var re=class extends ct{constructor(e,t,n,i,s,r,o,a,c){super(e,t,n,i,s,r,o,a,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var He=class l extends le{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let o=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let a=[],c=[],u=[],h=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,r,s,0),p("z","y","x",1,-1,n,t,-e,r,s,1),p("x","z","y",1,1,e,n,t,i,r,2),p("x","z","y",1,-1,e,n,-t,i,r,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(a),this.setAttribute("position",new de(c,3)),this.setAttribute("normal",new de(u,3)),this.setAttribute("uv",new de(h,2));function p(m,g,b,v,M,_,A,E,C,T,R){let I=_/C,P=A/T,D=_/2,N=A/2,F=E/2,z=C+1,W=T+1,J=0,j=0,ee=new w;for(let Q=0;Q<W;Q++){let se=Q*P-N;for(let me=0;me<z;me++){let we=me*I-D;ee[m]=we*v,ee[g]=se*M,ee[b]=F,c.push(ee.x,ee.y,ee.z),ee[m]=0,ee[g]=0,ee[b]=E>0?1:-1,u.push(ee.x,ee.y,ee.z),h.push(me/C),h.push(1-Q/T),J+=1}}for(let Q=0;Q<T;Q++)for(let se=0;se<C;se++){let me=d+se+z*Q,we=d+se+z*(Q+1),pe=d+(se+1)+z*(Q+1),ze=d+(se+1)+z*Q;a.push(me,we,ze),a.push(we,pe,ze),j+=6}o.addGroup(f,j,R),f+=j,d+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Rt=class l extends le{constructor(e=1,t=1,n=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a};let c=this;i=Math.floor(i),s=Math.floor(s);let u=[],h=[],d=[],f=[],p=0,m=[],g=n/2,b=0;v(),r===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new de(h,3)),this.setAttribute("normal",new de(d,3)),this.setAttribute("uv",new de(f,2));function v(){let _=new w,A=new w,E=0,C=(t-e)/n;for(let T=0;T<=s;T++){let R=[],I=T/s,P=I*(t-e)+e;for(let D=0;D<=i;D++){let N=D/i,F=N*a+o,z=Math.sin(F),W=Math.cos(F);A.x=P*z,A.y=-I*n+g,A.z=P*W,h.push(A.x,A.y,A.z),_.set(z,C,W).normalize(),d.push(_.x,_.y,_.z),f.push(N,1-I),R.push(p++)}m.push(R)}for(let T=0;T<i;T++)for(let R=0;R<s;R++){let I=m[R][T],P=m[R+1][T],D=m[R+1][T+1],N=m[R][T+1];(e>0||R!==0)&&(u.push(I,P,N),E+=3),(t>0||R!==s-1)&&(u.push(P,D,N),E+=3)}c.addGroup(b,E,0),b+=E}function M(_){let A=p,E=new U,C=new w,T=0,R=_===!0?e:t,I=_===!0?1:-1;for(let D=1;D<=i;D++)h.push(0,g*I,0),d.push(0,I,0),f.push(.5,.5),p++;let P=p;for(let D=0;D<=i;D++){let F=D/i*a+o,z=Math.cos(F),W=Math.sin(F);C.x=R*W,C.y=g*I,C.z=R*z,h.push(C.x,C.y,C.z),d.push(0,I,0),E.x=z*.5+.5,E.y=W*.5*I+.5,f.push(E.x,E.y),p++}for(let D=0;D<i;D++){let N=A+D,F=P+D;_===!0?u.push(F,F+1,N):u.push(F+1,F,N),T+=3}c.addGroup(b,T,_===!0?1:2),b+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Cs=class l extends le{constructor(e=[new U(0,-.5),new U(.5,0),new U(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=ae(i,0,Math.PI*2);let s=[],r=[],o=[],a=[],c=[],u=1/t,h=new w,d=new U,f=new w,p=new w,m=new w,g=0,b=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,b=e[v+1].y-e[v].y,f.x=b*1,f.y=-g,f.z=b*0,m.copy(f),f.normalize(),a.push(f.x,f.y,f.z);break;case e.length-1:a.push(m.x,m.y,m.z);break;default:g=e[v+1].x-e[v].x,b=e[v+1].y-e[v].y,f.x=b*1,f.y=-g,f.z=b*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),a.push(f.x,f.y,f.z),m.copy(p)}for(let v=0;v<=t;v++){let M=n+v*u*i,_=Math.sin(M),A=Math.cos(M);for(let E=0;E<=e.length-1;E++){h.x=e[E].x*_,h.y=e[E].y,h.z=e[E].x*A,r.push(h.x,h.y,h.z),d.x=v/t,d.y=E/(e.length-1),o.push(d.x,d.y);let C=a[3*E+0]*_,T=a[3*E+1],R=a[3*E+0]*A;c.push(C,T,R)}}for(let v=0;v<t;v++)for(let M=0;M<e.length-1;M++){let _=M+v*e.length,A=_,E=_+e.length,C=_+e.length+1,T=_+1;s.push(A,E,T),s.push(C,T,E)}this.setIndex(s),this.setAttribute("position",new de(r,3)),this.setAttribute("uv",new de(o,2)),this.setAttribute("normal",new de(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.points,e.segments,e.phiStart,e.phiLength)}};var Zt=class l extends le{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,o=Math.floor(n),a=Math.floor(i),c=o+1,u=a+1,h=e/o,d=t/a,f=[],p=[],m=[],g=[];for(let b=0;b<u;b++){let v=b*d-r;for(let M=0;M<c;M++){let _=M*h-s;p.push(_,-v,0),m.push(0,0,1),g.push(M/o),g.push(1-b/a)}}for(let b=0;b<a;b++)for(let v=0;v<o;v++){let M=v+c*b,_=v+c*(b+1),A=v+1+c*(b+1),E=v+1+c*b;f.push(M,_,E),f.push(_,A,E)}this.setIndex(f),this.setAttribute("position",new de(p,3)),this.setAttribute("normal",new de(m,3)),this.setAttribute("uv",new de(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.width,e.height,e.widthSegments,e.heightSegments)}};var Ge=class l extends le{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let a=Math.min(r+o,Math.PI),c=0,u=[],h=new w,d=new w,f=[],p=[],m=[],g=[];for(let b=0;b<=n;b++){let v=[],M=b/n,_=r+M*o,A=e*Math.cos(_),E=Math.sqrt(e*e-A*A),C=0;b===0&&r===0?C=.5/t:b===n&&a===Math.PI&&(C=-.5/t);for(let T=0;T<=t;T++){let R=T/t,I=i+R*s;h.x=-E*Math.cos(I),h.y=A,h.z=E*Math.sin(I),p.push(h.x,h.y,h.z),d.copy(h).normalize(),m.push(d.x,d.y,d.z),g.push(R+C,1-M),v.push(c++)}u.push(v)}for(let b=0;b<n;b++)for(let v=0;v<t;v++){let M=u[b][v+1],_=u[b][v],A=u[b+1][v],E=u[b+1][v+1];(b!==0||r>0)&&f.push(M,_,E),(b!==n-1||a<Math.PI)&&f.push(_,A,E)}this.setIndex(f),this.setAttribute("position",new de(p,3)),this.setAttribute("normal",new de(m,3)),this.setAttribute("uv",new de(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function ac(l){let e={};for(let t in l){e[t]={};for(let n in l[t]){let i=l[t][n];if(Vh(i))i.isRenderTargetTexture?(_e("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Vh(i[0])){let s=[];for(let r=0,o=i.length;r<o;r++)s[r]=i[r].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function je(l){let e={};for(let t=0;t<l.length;t++){let n=ac(l[t]);for(let i in n)e[i]=n[i]}return e}function Vh(l){return l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)}function P0(l){let e=[];for(let t=0;t<l.length;t++)e.push(l[t].clone());return e}var I0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,L0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,yt=class extends Qe{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=I0,this.fragmentShader=L0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ac(e.uniforms),this.uniformsGroups=P0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;r&&r.isTexture?t.uniforms[i]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[i]={type:"m4",value:r.toArray()}:t.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new L().setHex(i.value);break;case"v2":this.uniforms[n].value=new U().fromArray(i.value);break;case"v3":this.uniforms[n].value=new w().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ke().fromArray(i.value);break;case"m3":this.uniforms[n].value=new te().fromArray(i.value);break;case"m4":this.uniforms[n].value=new O().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}};var Fe=class extends Qe{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new L(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new L(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nc,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Et,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},et=class extends Fe{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new U(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ae(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new L(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new L(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new L(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ut=class extends Qe{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new L(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new L(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=nc,this.normalScale=new U(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Et,this.combine=fo,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function hn(l,e){return!l||l.constructor===e?l:typeof e.BYTES_PER_ELEMENT=="number"?new e(l):Array.prototype.slice.call(l)}function qr(l){return l!==void 0&&l.inTangents!==void 0&&l.outTangents!==void 0}function D0(l){function e(i,s){return l[i]-l[s]}let t=l.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Wh(l,e,t){let n=l.length,i=new l.constructor(n);for(let s=0,r=0;r!==n;++s){let o=t[s]*e;for(let a=0;a!==e;++a)i[r++]=l[o+a]}return i}function N0(l,e,t,n){let i=1,s=l[0];for(;s!==void 0&&s[n]===void 0;)s=l[i++];if(s===void 0)return;let r=s[n];if(r!==void 0)if(Array.isArray(r))do r=s[n],r!==void 0&&(e.push(s.time),t.push(...r)),s=l[i++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[n],r!==void 0&&(e.push(s.time),r.toArray(t,t.length)),s=l[i++];while(s!==void 0);else do r=s[n],r!==void 0&&(e.push(s.time),t.push(r)),s=l[i++];while(s!==void 0)}var Ct=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let r;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break t}r=t.length;break n}if(!(e>=s)){let o=t[1];e<o&&(n=2,s=o);for(let a=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(i=s,s=t[--n-1],e>=s)break t}r=n,n=0;break n}break e}for(;n<r;){let o=n+r>>>1;e<t[o]?r=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},to=class extends Ct{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Gn,endingEnd:Gn}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,o=i[s],a=i[r];if(o===void 0)switch(this.getSettings_().endingStart){case Hn:s=e,o=2*t-n;break;case _s:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(a===void 0)switch(this.getSettings_().endingEnd){case Hn:r=e,a=2*n-t;break;case _s:r=1,a=n+i[1]-i[0];break;default:r=e-1,a=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(a-n),this._offsetPrev=s*u,this._offsetNext=r*u}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=e*o,c=a-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),m=p*p,g=m*p,b=-d*g+2*d*m-d*p,v=(1+d)*g+(-1.5-2*d)*m+(-.5+d)*p+1,M=(-1-f)*g+(1.5+f)*m+.5*p,_=f*g-f*m;for(let A=0;A!==o;++A)s[A]=b*r[u+A]+v*r[c+A]+M*r[a+A]+_*r[h+A];return s}},Ps=class extends Ct{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=e*o,c=a-o,u=(n-t)/(i-t),h=1-u;for(let d=0;d!==o;++d)s[d]=r[c+d]*h+r[a+d]*u;return s}},no=class extends Ct{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},io=class extends Ct{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=e*o,c=a-o,u=this.inTangents,h=this.outTangents;if(!u||!h){let p=(n-t)/(i-t),m=1-p;for(let g=0;g!==o;++g)s[g]=r[c+g]*m+r[a+g]*p;return s}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let m=r[c+p],g=r[a+p],b=f*d+p*2,v=h[b],M=h[b+1],_=e*d+p*2,A=u[_],E=u[_+1],C=F0(n,t,v,A,i);s[p]=_d(C,m,M,E,g)}return s}};function _d(l,e,t,n,i){let s=1-l;return s*s*s*e+3*s*s*l*t+3*s*l*l*n+l*l*l*i}function O0(l,e,t,n,i){let s=1-l;return 3*s*s*(t-e)+6*s*l*(n-t)+3*l*l*(i-n)}function F0(l,e,t,n,i){let s=(l-e)/(i-e);for(let r=0;r<8;r++){let o=_d(s,e,t,n,i)-l;if(Math.abs(o)<1e-10)break;let a=O0(s,e,t,n,i);if(Math.abs(a)<1e-10)break;s=Math.max(0,Math.min(1,s-o/a))}return s}var tt=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=hn(t,this.TimeBufferType),this.values=hn(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:hn(e.times,Array),values:hn(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),qr(e.settings)&&(n.settings={inTangents:hn(e.settings.inTangents,Array),outTangents:hn(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new no(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ps(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new to(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new io(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Vn:t=this.InterpolantFactoryMethodDiscrete;break;case Wn:t=this.InterpolantFactoryMethodLinear;break;case Vr:t=this.InterpolantFactoryMethodSmooth;break;case Rl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return _e("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vn;case this.InterpolantFactoryMethodLinear:return Wn;case this.InterpolantFactoryMethodSmooth:return Vr;case this.InterpolantFactoryMethodBezier:return Rl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;qr(this.settings)&&(Xh(this.settings.inTangents,e),Xh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;for(;s!==i&&n[s]<e;)++s;for(;r!==-1&&n[r]>t;)--r;if(++r,s!==0||r!==i){s>=r&&(r=Math.max(r,1),s=r-1);let o=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*o,r*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ee("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(Ee("KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let o=0;o!==s;o++){let a=n[o];if(typeof a=="number"&&isNaN(a)){Ee("KeyframeTrack: Time is not a valid number.",this,o,a),e=!1;break}if(r!==null&&r>a){Ee("KeyframeTrack: Out of order keys.",this,o,a,r),e=!1;break}r=a}if(i!==void 0&&zm(i))for(let o=0,a=i.length;o!==a;++o){let c=i[o];if(isNaN(c)){Ee("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Vr,s=e.length-1,r=1;for(let o=1;o<s;++o){let a=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(i)a=!0;else{let h=o*n,d=h-n,f=h+n;for(let p=0;p!==n;++p){let m=t[h+p];if(m!==t[d+p]||m!==t[f+p]){a=!0;break}}}if(a){if(o!==r){e[r]=e[o];let h=o*n,d=r*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++r}}if(s>0){e[r]=e[s];for(let o=s*n,a=r*n,c=0;c!==n;++c)t[a+c]=t[o+c];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,qr(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Xh(l,e){for(let t=0,n=l.length;t!==n;t+=2)l[t]*=e}tt.prototype.ValueTypeName="";tt.prototype.TimeBufferType=Float32Array;tt.prototype.ValueBufferType=Float32Array;tt.prototype.DefaultInterpolation=Wn;var Kt=class extends tt{constructor(e,t,n){super(e,t,n)}};Kt.prototype.ValueTypeName="bool";Kt.prototype.ValueBufferType=Array;Kt.prototype.DefaultInterpolation=Vn;Kt.prototype.InterpolantFactoryMethodLinear=void 0;Kt.prototype.InterpolantFactoryMethodSmooth=void 0;var Is=class extends tt{constructor(e,t,n,i){super(e,t,n,i)}};Is.prototype.ValueTypeName="color";var jt=class extends tt{constructor(e,t,n,i){super(e,t,n,i)}};jt.prototype.ValueTypeName="number";var so=class extends Ct{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=(n-t)/(i-t),c=e*o;for(let u=c+o;c!==u;c+=4)Y.slerpFlat(s,0,r,c-o,r,c,a);return s}},Jt=class extends tt{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new so(this.times,this.values,this.getValueSize(),e)}};Jt.prototype.ValueTypeName="quaternion";Jt.prototype.InterpolantFactoryMethodSmooth=void 0;var $t=class extends tt{constructor(e,t,n){super(e,t,n)}};$t.prototype.ValueTypeName="string";$t.prototype.ValueBufferType=Array;$t.prototype.DefaultInterpolation=Vn;$t.prototype.InterpolantFactoryMethodLinear=void 0;$t.prototype.InterpolantFactoryMethodSmooth=void 0;var mn=class extends tt{constructor(e,t,n,i){super(e,t,n,i)}};mn.prototype.ValueTypeName="vector";var Zn=class{constructor(e="",t=-1,n=[],i=po){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=vt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,o=n.length;r!==o;++r)t.push(B0(n[r]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)t.push(tt.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,r=[];for(let o=0;o<s;o++){let a=[],c=[];a.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);let u=D0(a);a=Wh(a,1,u),c=Wh(c,1,u),!i&&a[0]===0&&(a.push(s),c.push(c[0])),r.push(new jt(".morphTargetInfluences["+t[o].name+"]",a,c).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,a=e.length;o<a;o++){let c=e[o],u=c.name.match(s);if(u&&u.length>1){let h=u[1],d=i[h];d||(i[h]=d=[]),d.push(c)}}let r=[];for(let o in i)r.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return r}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function U0(l){switch(l.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return jt;case"vector":case"vector2":case"vector3":case"vector4":return mn;case"color":return Is;case"quaternion":return Jt;case"bool":case"boolean":return Kt;case"string":return $t}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+l)}function B0(l){if(l.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=U0(l.type);if(l.times===void 0){let n=[],i=[];N0(l.keys,n,i,"value"),l.times=n,l.values=i}let t;return e.parse!==void 0?t=e.parse(l):t=new e(l.name,l.times,l.values,l.interpolation),qr(l.settings)&&(t.settings={inTangents:hn(l.settings.inTangents,Float32Array),outTangents:hn(l.settings.outTangents,Float32Array)}),t}var Tt={enabled:!1,files:{},add:function(l,e){this.enabled!==!1&&(qh(l)||(this.files[l]=e))},get:function(l){if(this.enabled!==!1&&!qh(l))return this.files[l]},remove:function(l){delete this.files[l]},clear:function(){this.files={}}};function qh(l){try{let e=l.slice(l.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var ro=class{constructor(e,t,n){let i=this,s=!1,r=0,o=0,a,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,s===!1&&i.onStart!==void 0&&i.onStart(u,r,o),s=!0},this.itemEnd=function(u){r++,i.onProgress!==void 0&&i.onProgress(u,r,o),r===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),a?a(u):u},this.setURLModifier=function(u){return a=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],p=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},yd=new ro,Pt=class{constructor(e){this.manager=e!==void 0?e:yd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Pt.DEFAULT_MATERIAL_NAME="__DEFAULT";var kt={},Dl=class extends Error{constructor(e,t){super(e),this.response=t}},ki=class extends Pt{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=Tt.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(kt[e]!==void 0){kt[e].push({onLoad:t,onProgress:n,onError:i});return}kt[e]=[],kt[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,a=this.responseType;fetch(r).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&_e("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=kt[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,m=0,g=new ReadableStream({start(b){v();function v(){h.read().then(({done:M,value:_})=>{if(M)b.close();else{m+=_.byteLength;let A=new ProgressEvent("progress",{lengthComputable:p,loaded:m,total:f});for(let E=0,C=u.length;E<C;E++){let T=u[E];T.onProgress&&T.onProgress(A)}b.enqueue(_),v()}},M=>{b.error(M)})}}});return new Response(g)}else throw new Dl(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(a){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{Tt.add(`file:${e}`,c);let u=kt[e];delete kt[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=kt[e];if(u===void 0)throw this.manager.itemError(e),c;delete kt[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Ci=new WeakMap,oo=class extends Pt{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=Tt.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);else{let h=Ci.get(r);h===void 0&&(h=[],Ci.set(r,h)),h.push({onLoad:t,onError:i})}return r}let o=Zr("img");function a(){u(),t&&t(this);let h=Ci.get(this)||[];for(let d=0;d<h.length;d++){let f=h[d];f.onLoad&&f.onLoad(this)}Ci.delete(this),s.manager.itemEnd(e)}function c(h){u(),i&&i(h),Tt.remove(`image:${e}`);let d=Ci.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(h)}Ci.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",a,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",a,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Tt.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}};var Ls=class extends Pt{constructor(e){super(e)}load(e,t,n,i){let s=new ct,r=new oo(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},Kn=class extends Re{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new L(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var bl=new O,Yh=new w,Zh=new w,Gi=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new U(512,512),this.mapType=ni,this.map=null,this.mapPass=null,this.matrix=new O,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yt,this._frameExtents=new U(1,1),this._viewportCount=1,this._viewports=[new Ke(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Yh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yh),Zh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Zh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){bl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(bl,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,o=i?i.w/s.y:1,a=i?i.x/s.x:0,c=i?i.y/s.y:0;e.coordinateSystem===ys||e.reversedDepth?t.set(.5*r,0,0,.5*r+a,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*r,0,0,.5*r+a,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(bl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Gr=new w,Hr=new Y,St=new w,Ds=class extends Re{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new O,this.projectionMatrix=new O,this.projectionMatrixInverse=new O,this.coordinateSystem=Ht,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Gr,Hr,St),St.x===1&&St.y===1&&St.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gr,Hr,St.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Gr,Hr,St),St.x===1&&St.y===1&&St.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Gr,Hr,St.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},un=new w,Kh=new U,jh=new U,jn=class extends Ds{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Oi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(xs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Oi*2*Math.atan(Math.tan(xs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(un.x,un.y).multiplyScalar(-e/un.z),un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(un.x,un.y).multiplyScalar(-e/un.z)}getViewSize(e,t){return this.getViewBounds(e,Kh,jh),t.subVectors(jh,Kh)}setViewOffset(e,t,n,i,s,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(xs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let a=r.fullWidth,c=r.fullHeight;s+=r.offsetX*i/a,t-=r.offsetY*n/c,i*=r.width/a,n*=r.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Nl=class extends Gi{constructor(){super(new jn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Oi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Jn=class extends Kn{constructor(e,t,n=0,i=Math.PI/3,s=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new Nl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Ol=class extends Gi{constructor(){super(new jn(90,1,.5,500)),this.isPointLightShadow=!0}},$n=class extends Kn{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ol}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Hi=class extends Ds{constructor(e=-1,t=1,n=1,i=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,o=i+t,a=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,r=s+c*this.view.width,o-=u*this.view.offsetY,a=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,r,o,a,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Fl=class extends Gi{constructor(){super(new Hi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ns=class extends Kn{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Re.DEFAULT_UP),this.updateMatrix(),this.target=new Re,this.shadow=new Fl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Os=class extends Kn{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Qt=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var vl=new WeakMap,Fs=class extends Pt{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&_e("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&_e("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=Tt.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then(c=>{vl.has(r)===!0?(i&&i(vl.get(r)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let a=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return Tt.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),vl.set(a,c),Tt.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});Tt.add(`image-bitmap:${e}`,a),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var ao=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,r;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,r=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,r=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,r=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=r,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,r=this.cumulativeWeight;if(r===0){for(let o=0;o!==i;++o)n[s+o]=n[o];r=t}else{r+=t;let o=t/r;this._mixBufferRegion(n,s,0,o,i)}this.cumulativeWeight=r}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,r=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let a=t*this._origIndex;this._mixBufferRegion(n,i,a,1-s,t)}r>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let a=t,c=t+t;a!==c;++a)if(n[a]!==n[a+t]){o.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,r=i;s!==r;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let r=0;r!==s;++r)e[t+r]=e[n+r]}_slerp(e,t,n,i){Y.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let r=this._workIndex*s;Y.multiplyQuaternionsFlat(e,r,e,t,e,n),Y.slerpFlat(e,t,e,t,e,r,i)}_lerp(e,t,n,i,s){let r=1-i;for(let o=0;o!==s;++o){let a=t+o;e[a]=e[a]*r+e[n+o]*i}}_lerpAdditive(e,t,n,i,s){for(let r=0;r!==s;++r){let o=t+r;e[o]=e[o]+e[n+r]*i}}},lc="\\[\\]\\.:\\/",z0=new RegExp("["+lc+"]","g"),cc="[^"+lc+"]",k0="[^"+lc.replace("\\.","")+"]",G0=/((?:WC+[\/:])*)/.source.replace("WC",cc),H0=/(WCOD+)?/.source.replace("WCOD",k0),V0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",cc),W0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",cc),X0=new RegExp("^"+G0+H0+V0+W0+"$"),q0=["material","materials","bones","map"],Ul=class{constructor(e,t,n){let i=n||ye.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ye=class l{constructor(e,t,n){this.path=t,this.parsedPath=n||l.parseTrackName(t),this.node=l.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new l.Composite(e,t,n):new l(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(z0,"")}static parseTrackName(e){let t=X0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);q0.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let o=s[r];if(o.name===t||o.uuid===t)return o;let a=n(o.children);if(a)return a}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=l.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){_e("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ee("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ee("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ee("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ee("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ee("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ee("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ee("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let r=e[i];if(r===void 0){let c=t.nodeName;Ee("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let a=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ee("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ee("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}a=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(a=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(a=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=i;this.getValue=this.GetterByBindingType[a],this.setValue=this.SetterByBindingTypeAndVersioning[a][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ye.Composite=Ul;ye.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ye.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ye.prototype.GetterByBindingType=[ye.prototype._getValue_direct,ye.prototype._getValue_array,ye.prototype._getValue_arrayElement,ye.prototype._getValue_toArray];ye.prototype.SetterByBindingTypeAndVersioning=[[ye.prototype._setValue_direct,ye.prototype._setValue_direct_setNeedsUpdate,ye.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_array,ye.prototype._setValue_array_setNeedsUpdate,ye.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_arrayElement,ye.prototype._setValue_arrayElement_setNeedsUpdate,ye.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ye.prototype._setValue_fromArray,ye.prototype._setValue_fromArray_setNeedsUpdate,ye.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var lo=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,r=s.length,o=new Array(r),a={endingStart:Gn,endingEnd:Gn};for(let c=0;c!==r;++c){let u=s[c].createInterpolant(null);o[c]=u,u.settings=a}this._interpolantSettings=a,this._interpolants=o,this._propertyBindings=new Array(r),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=fd,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,r=s/i,o=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,r,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,r=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);let a=o.parameterPositions,c=o.sampleValues;return a[0]=s,a[1]=s+n,c[0]=e/r,c[1]=t/r,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let a=(e-s)*n;a<0||n===0?t=0:(this._startTime=null,t=n*a)}t*=this._updateTimeScale(e);let r=this._updateTime(t),o=this._updateWeight(e);if(o>0){let a=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case md:for(let u=0,h=a.length;u!==h;++u)a[u].evaluate(r),c[u].accumulateAdditive(o);break;case po:default:for(let u=0,h=a.length;u!==h;++u)a[u].evaluate(r),c[u].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,r=n===pd;if(e===0)return s===-1?i:r&&(s&1)===1?t-i:i;if(n===dd){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,r)):this._setEndings(this.repetitions===0,!0,r)),i>=t||i<0){let o=Math.floor(i/t);i-=t*o,s+=Math.abs(o);let a=this.repetitions-s;if(a<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(a===1){let c=e<0;this._setEndings(c,!c,r)}else this._setEndings(!1,!1,r);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=s,this.time=i;if(r&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=Hn,i.endingEnd=Hn):(e?i.endingStart=this.zeroSlopeAtStart?Hn:Gn:i.endingStart=_s,t?i.endingEnd=this.zeroSlopeAtEnd?Hn:Gn:i.endingEnd=_s)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,r=this._weightInterpolant;r===null&&(r=i._lendControlInterpolant(),this._weightInterpolant=r);let o=r.parameterPositions,a=r.sampleValues;return o[0]=s,a[0]=t,o[1]=s+e,a[1]=n,this}},Y0=new Float32Array(1),Us=class extends qt{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,r=e._propertyBindings,o=e._interpolants,a=n.uuid,c=this._bindingsByRootAndName,u=c[a];u===void 0&&(u={},c[a]=u);for(let h=0;h!==s;++h){let d=i[h],f=d.name,p=u[f];if(p!==void 0)++p.referenceCount,r[h]=p;else{if(p=r[h],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,a,f));continue}let m=t&&t._propertyBindings[h].binding.parsedPath;p=new ao(ye.create(n,f,m),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,a,f),r[h]=p}o[h].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,r=s[t];if(r===void 0)r={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=r;else{let o=r.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),r.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,r=this._actionsByClip,o=r[s],a=o.knownActions,c=a[a.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,a[u]=c,a.pop(),e._byClipCacheIndex=null;let h=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete h[d],a.length===0&&delete r[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,r=i[t];r===void 0&&(r={},i[t]=r),r[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,r=this._bindingsByRootAndName,o=r[i],a=t[t.length-1],c=e._cacheIndex;a._cacheIndex=c,t[c]=a,t.pop(),delete o[s],Object.keys(o).length===0&&delete r[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new Ps(new Float32Array(2),new Float32Array(2),1,Y0),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,r=typeof e=="string"?Zn.findByName(i,e):e,o=r!==null?r.uuid:e,a=this._actionsByClip[o],c=null;if(n===void 0&&(r!==null?n=r.blendMode:n=po),a!==void 0){let h=a.actionByRoot[s];if(h!==void 0&&h.blendMode===n)return h;c=a.knownActions[0],r===null&&(r=c._clip)}if(r===null)return null;let u=new lo(this,r,t,n);return this._bindAction(u,c),this._addInactiveAction(u,o,s),u}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?Zn.findByName(n,e):e,r=s?s.uuid:e,o=this._actionsByClip[r];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),r=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,r);let o=this._bindings,a=this._nActiveBindings;for(let c=0;c!==a;++c)o[c].apply(r);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let r=s.knownActions;for(let o=0,a=r.length;o!==a;++o){let c=r[o];this._deactivateAction(c);let u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let r in n){let o=n[r].actionByRoot,a=o[t];a!==void 0&&(this._deactivateAction(a),this._removeInactiveAction(a))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let r in s){let o=s[r];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Jh=new O,Qn=class{constructor(e,t,n=0,i=1/0){this.ray=new fn(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ms,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ee("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Jh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Jh),this}intersectObject(e,t=!0,n=[]){return Bl(e,this,n,t),n.sort($h),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)Bl(e[i],this,n,t);return n.sort($h),n}};function $h(l,e){return l.distance-e.distance}function Bl(l,e,t,n){let i=!0;if(l.layers.test(e.layers)&&l.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=l.children;for(let r=0,o=s.length;r<o;r++)Bl(s[r],e,t,!0)}}var pc=class pc{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};pc.prototype.isMatrix2=!0;var zl=pc;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?_e("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");var Z0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,K0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,j0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,J0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Q0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,eg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,tg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ng=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ig=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,sg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,og=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ag=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ug=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,dg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,pg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,mg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,gg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,xg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,bg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,vg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,_g=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Mg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ag=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Eg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Rg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Cg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ig=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Dg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ng=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Og=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Fg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ug=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Bg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,kg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Gg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Vg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,qg=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Yg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Zg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Kg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Jg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$g=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ex=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,tx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,nx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ix=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,sx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ox=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ax=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ux=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,fx=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,px=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,xx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,bx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_x=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,yx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Sx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ax=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Tx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ex=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Rx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Px=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Ix=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Dx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Nx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ox=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Fx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ux=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hx=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Vx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Wx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Yx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Zx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$x=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,tb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,nb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ib=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,sb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rb=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ob=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ab=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,cb=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ub=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,db=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,fb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,mb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,gb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,vb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_b=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ab=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Tb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Eb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,he={alphahash_fragment:Z0,alphahash_pars_fragment:K0,alphamap_fragment:j0,alphamap_pars_fragment:J0,alphatest_fragment:$0,alphatest_pars_fragment:Q0,aomap_fragment:eg,aomap_pars_fragment:tg,batching_pars_vertex:ng,batching_vertex:ig,begin_vertex:sg,beginnormal_vertex:rg,bsdfs:og,iridescence_fragment:ag,bumpmap_pars_fragment:lg,clipping_planes_fragment:cg,clipping_planes_pars_fragment:ug,clipping_planes_pars_vertex:hg,clipping_planes_vertex:dg,color_fragment:fg,color_pars_fragment:pg,color_pars_vertex:mg,color_vertex:gg,common:xg,cube_uv_reflection_fragment:bg,defaultnormal_vertex:vg,displacementmap_pars_vertex:_g,displacementmap_vertex:yg,emissivemap_fragment:Mg,emissivemap_pars_fragment:wg,colorspace_fragment:Sg,colorspace_pars_fragment:Ag,envmap_fragment:Tg,envmap_common_pars_fragment:Eg,envmap_pars_fragment:Rg,envmap_pars_vertex:Cg,envmap_physical_pars_fragment:kg,envmap_vertex:Pg,fog_vertex:Ig,fog_pars_vertex:Lg,fog_fragment:Dg,fog_pars_fragment:Ng,gradientmap_pars_fragment:Og,lightmap_pars_fragment:Fg,lights_lambert_fragment:Ug,lights_lambert_pars_fragment:Bg,lights_pars_begin:zg,lights_toon_fragment:Gg,lights_toon_pars_fragment:Hg,lights_phong_fragment:Vg,lights_phong_pars_fragment:Wg,lights_physical_fragment:Xg,lights_physical_pars_fragment:qg,lights_fragment_begin:Yg,lights_fragment_maps:Zg,lights_fragment_end:Kg,lightprobes_pars_fragment:jg,logdepthbuf_fragment:Jg,logdepthbuf_pars_fragment:$g,logdepthbuf_pars_vertex:Qg,logdepthbuf_vertex:ex,map_fragment:tx,map_pars_fragment:nx,map_particle_fragment:ix,map_particle_pars_fragment:sx,metalnessmap_fragment:rx,metalnessmap_pars_fragment:ox,morphinstance_vertex:ax,morphcolor_vertex:lx,morphnormal_vertex:cx,morphtarget_pars_vertex:ux,morphtarget_vertex:hx,normal_fragment_begin:dx,normal_fragment_maps:fx,normal_pars_fragment:px,normal_pars_vertex:mx,normal_vertex:gx,normalmap_pars_fragment:xx,clearcoat_normal_fragment_begin:bx,clearcoat_normal_fragment_maps:vx,clearcoat_pars_fragment:_x,iridescence_pars_fragment:yx,opaque_fragment:Mx,packing:wx,premultiplied_alpha_fragment:Sx,project_vertex:Ax,dithering_fragment:Tx,dithering_pars_fragment:Ex,roughnessmap_fragment:Rx,roughnessmap_pars_fragment:Cx,shadowmap_pars_fragment:Px,shadowmap_pars_vertex:Ix,shadowmap_vertex:Lx,shadowmask_pars_fragment:Dx,skinbase_vertex:Nx,skinning_pars_vertex:Ox,skinning_vertex:Fx,skinnormal_vertex:Ux,specularmap_fragment:Bx,specularmap_pars_fragment:zx,tonemapping_fragment:kx,tonemapping_pars_fragment:Gx,transmission_fragment:Hx,transmission_pars_fragment:Vx,uv_pars_fragment:Wx,uv_pars_vertex:Xx,uv_vertex:qx,worldpos_vertex:Yx,background_vert:Zx,background_frag:Kx,backgroundCube_vert:jx,backgroundCube_frag:Jx,cube_vert:$x,cube_frag:Qx,depth_vert:eb,depth_frag:tb,distance_vert:nb,distance_frag:ib,equirect_vert:sb,equirect_frag:rb,linedashed_vert:ob,linedashed_frag:ab,meshbasic_vert:lb,meshbasic_frag:cb,meshlambert_vert:ub,meshlambert_frag:hb,meshmatcap_vert:db,meshmatcap_frag:fb,meshnormal_vert:pb,meshnormal_frag:mb,meshphong_vert:gb,meshphong_frag:xb,meshphysical_vert:bb,meshphysical_frag:vb,meshtoon_vert:_b,meshtoon_frag:yb,points_vert:Mb,points_frag:wb,shadow_vert:Sb,shadow_frag:Ab,sprite_vert:Tb,sprite_frag:Eb},G={common:{diffuse:{value:new L(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new U(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new L(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new w},probesMax:{value:new w},probesResolution:{value:new w}},points:{diffuse:{value:new L(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new L(16777215)},opacity:{value:1},center:{value:new U(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},Md={basic:{uniforms:je([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.fog]),vertexShader:he.meshbasic_vert,fragmentShader:he.meshbasic_frag},lambert:{uniforms:je([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new L(0)},envMapIntensity:{value:1}}]),vertexShader:he.meshlambert_vert,fragmentShader:he.meshlambert_frag},phong:{uniforms:je([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new L(0)},specular:{value:new L(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:he.meshphong_vert,fragmentShader:he.meshphong_frag},standard:{uniforms:je([G.common,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.roughnessmap,G.metalnessmap,G.fog,G.lights,{emissive:{value:new L(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag},toon:{uniforms:je([G.common,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.gradientmap,G.fog,G.lights,{emissive:{value:new L(0)}}]),vertexShader:he.meshtoon_vert,fragmentShader:he.meshtoon_frag},matcap:{uniforms:je([G.common,G.bumpmap,G.normalmap,G.displacementmap,G.fog,{matcap:{value:null}}]),vertexShader:he.meshmatcap_vert,fragmentShader:he.meshmatcap_frag},points:{uniforms:je([G.points,G.fog]),vertexShader:he.points_vert,fragmentShader:he.points_frag},dashed:{uniforms:je([G.common,G.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:he.linedashed_vert,fragmentShader:he.linedashed_frag},depth:{uniforms:je([G.common,G.displacementmap]),vertexShader:he.depth_vert,fragmentShader:he.depth_frag},normal:{uniforms:je([G.common,G.bumpmap,G.normalmap,G.displacementmap,{opacity:{value:1}}]),vertexShader:he.meshnormal_vert,fragmentShader:he.meshnormal_frag},sprite:{uniforms:je([G.sprite,G.fog]),vertexShader:he.sprite_vert,fragmentShader:he.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:he.background_vert,fragmentShader:he.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:he.backgroundCube_vert,fragmentShader:he.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:he.cube_vert,fragmentShader:he.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:he.equirect_vert,fragmentShader:he.equirect_frag},distance:{uniforms:je([G.common,G.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:he.distance_vert,fragmentShader:he.distance_frag},shadow:{uniforms:je([G.lights,G.fog,{color:{value:new L(0)},opacity:{value:1}}]),vertexShader:he.shadow_vert,fragmentShader:he.shadow_frag}};Md.physical={uniforms:je([Md.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new U(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new L(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new U},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new L(0)},specularColor:{value:new L(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new U},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:he.meshphysical_vert,fragmentShader:he.meshphysical_frag};var Rb=new te;Rb.set(-1,0,0,0,1,0,0,0,1);var tT={[Vl]:"LINEAR_TONE_MAPPING",[Wl]:"REINHARD_TONE_MAPPING",[Xl]:"CINEON_TONE_MAPPING",[ql]:"ACES_FILMIC_TONE_MAPPING",[Zl]:"AGX_TONE_MAPPING",[Kl]:"NEUTRAL_TONE_MAPPING",[Yl]:"CUSTOM_TONE_MAPPING"};var nT=new Float32Array(16),iT=new Float32Array(9),sT=new Float32Array(4);var rT={[Vl]:"Linear",[Wl]:"Reinhard",[Xl]:"Cineon",[ql]:"ACESFilmic",[Zl]:"AgX",[Kl]:"Neutral",[Yl]:"Custom"};var oT={[Qh]:"SHADOWMAP_TYPE_PCF",[ed]:"SHADOWMAP_TYPE_VSM"};var aT={[ad]:"ENVMAP_TYPE_CUBE",[Jl]:"ENVMAP_TYPE_CUBE",[ld]:"ENVMAP_TYPE_CUBE_UV"};var lT={[Jl]:"ENVMAP_MODE_REFRACTION"};var cT={[fo]:"ENVMAP_BLENDING_MULTIPLY",[sd]:"ENVMAP_BLENDING_MIX",[rd]:"ENVMAP_BLENDING_ADD"};var Cb=new te;Cb.set(-1,0,0,0,1,0,0,0,1);var uT=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);var mc=Math.PI/180,wd=12.5*mc,Sd=0,Pb=12.5/24,dt=(l,e,t)=>{let n=Math.max(0,Math.min(1,(t-l)/(e-l)));return n*n*(3-2*n)};var Ib=[[-18,.006,.011,.034],[-12,.008,.016,.05],[-8,.013,.028,.085],[-5,.022,.05,.14],[-2,.04,.085,.22],[0,.055,.12,.29],[3,.065,.15,.37],[7,.07,.165,.43],[15,.075,.18,.46],[30,.074,.18,.48],[90,.07,.175,.49]],Lb=[[-18,.03,.042,.085],[-12,.045,.05,.095],[-8,.14,.085,.1],[-5,.42,.19,.1],[-2,.78,.34,.12],[0,.95,.46,.18],[3,.98,.6,.32],[7,.82,.66,.5],[15,.6,.64,.7],[30,.5,.58,.7],[90,.46,.55,.69]],Db=[[-18,.03,.042,.085],[-12,.04,.05,.1],[-8,.06,.075,.15],[-5,.11,.12,.21],[-2,.2,.18,.27],[0,.29,.27,.34],[3,.35,.37,.46],[7,.37,.43,.54],[15,.4,.49,.63],[30,.4,.5,.65],[90,.42,.52,.67]],Nb=[[-12,0,0,0],[-8,.08,.035,.02],[-5,.25,.1,.035],[-2,.42,.18,.05],[0,.55,.26,.07],[3,.55,.32,.12],[7,.45,.33,.18],[15,.34,.3,.24],[30,.28,.27,.24],[90,.26,.26,.24]],Ob=[[-10,0,0,0],[-6,.05,.03,.05],[-3,.13,.065,.09],[0,.11,.055,.07],[4,.03,.015,.015],[8,0,0,0]],Fb=[[-18,.03,.036,.06],[-12,.04,.045,.075],[-8,.1,.075,.11],[-5,.38,.2,.21],[-2,.82,.38,.24],[0,1,.52,.3],[3,1.02,.7,.46],[7,1,.84,.68],[15,1,.97,.92],[30,1,1,.99],[90,1,1,1]],Ub=[[-18,.012,.018,.042],[-12,.016,.024,.055],[-8,.03,.036,.075],[-5,.06,.055,.1],[-2,.11,.085,.13],[0,.18,.14,.19],[3,.27,.23,.28],[7,.36,.35,.41],[15,.42,.46,.55],[30,.46,.5,.6],[90,.48,.52,.62]],Bb=[[-1.2,0,0,0],[0,2.4,.7,.2],[3,5,2.4,.9],[8,8,5.6,3.4],[20,12,11,9.2],[90,14,13.4,12.4]],zb=[[-2,1,.36,.14],[0,1,.45,.2],[3,1,.58,.32],[8,1,.72,.48],[15,1,.81,.6],[25,1,.86,.68],[40,1,.9,.74]];function tn(l,e,t){if(e<=l[0][0])return t.setRGB(l[0][1],l[0][2],l[0][3]);for(let i=1;i<l.length;i++){let s=l[i];if(e<=s[0]){let r=l[i-1],o=(e-r[0])/(s[0]-r[0]);return t.setRGB(r[1]+(s[1]-r[1])*o,r[2]+(s[2]-r[2])*o,r[3]+(s[3]-r[3])*o)}}let n=l[l.length-1];return t.setRGB(n[1],n[2],n[3])}function gc(){return{t:0,elev:0,elevDeg:0,east:0,north:0,up:1,day:1,night:0,stars:0,sunK:1,moonK:0,skyK:1,dusk:0,zenith:new L,horSun:new L,horAnti:new L,glow:new L,belt:new L,cloudLit:new L,cloudShade:new L,disc:new L,light:new L,fog:new L}}function Ad(l,e=gc()){let t=(l%1+1)%1,n=(t-Pb)*Math.PI*2,i=Math.cos(Sd),s=Math.sin(Sd),r=Math.cos(wd),o=Math.sin(wd);e.east=-i*Math.sin(n),e.north=r*s-o*i*Math.cos(n),e.up=o*s+r*i*Math.cos(n),e.elev=e.up;let a=e.elevDeg=Math.asin(Math.max(-1,Math.min(1,e.up)))/mc;e.t=t,e.day=dt(-9,4,a),e.night=1-e.day,e.stars=1-dt(-14,-6,a);let c=1/(Math.max(0,Math.sin(Math.max(a,0)*mc))+.50572*Math.pow(Math.max(a,0)+6.07995,-1.6364));return e.sunK=Math.exp(-.11*(c-1))*dt(-1.5,4,a),e.moonK=1-dt(-12,-3,a),e.skyK=dt(-10,12,a),e.dusk=dt(-10,-1,a)*(1-dt(4,16,a)),tn(Ib,a,e.zenith),tn(Lb,a,e.horSun),tn(Db,a,e.horAnti),tn(Nb,a,e.glow),tn(Ob,a,e.belt),tn(Fb,a,e.cloudLit),tn(Ub,a,e.cloudShade),tn(Bb,a,e.disc),tn(zb,a,e.light),e.fog.copy(e.horAnti).lerp(e.horSun,.3),e}var Ue={value:0},ii={value:0},go={value:0};function kb(l=256){let e=49734321,t=()=>(e=e*1664525+1013904223>>>0,e/4294967296),n=c=>{let u=new Float32Array(c*c);for(let h=0;h<u.length;h++)u[h]=t();return u},i=c=>{let u=c.map(n),h=new Float32Array(l*l),d=1e9,f=-1e9;for(let p=0;p<l;p++)for(let m=0;m<l;m++){let g=0,b=.5,v=0;for(let M=0;M<c.length;M++){let _=c[M],A=u[M],E=m/l*_,C=p/l*_,T=Math.floor(E),R=Math.floor(C),I=E-T,P=C-R;I=I*I*(3-2*I),P=P*P*(3-2*P);let D=T%_,N=R%_,F=(T+1)%_,z=(R+1)%_,W=A[N*_+D],J=A[N*_+F],j=A[z*_+D],ee=A[z*_+F];g+=b*((W+(J-W)*I)*(1-P)+(j+(ee-j)*I)*P),v+=b,b*=.5}g/=v,h[p*l+m]=g,g<d&&(d=g),g>f&&(f=g)}for(let p=0;p<h.length;p++)h[p]=(h[p]-d)/(f-d);return h},s=i([5,10,20,40,80]),r=i([16,32,64,128]),o=new Uint8Array(l*l*4);for(let c=0;c<l*l;c++)o[c*4]=s[c]*255,o[c*4+1]=r[c]*255,o[c*4+2]=0,o[c*4+3]=255;let a=new lt(o,l,l,Xt,ni);return a.wrapS=a.wrapT=Wt,a.magFilter=en,a.minFilter=ti,a.generateMipmaps=!0,a.needsUpdate=!0,a}function Td(){let l={uSun:{value:new w(0,1,0)},uMoon:{value:new w(0,1,0)},uSunXZ:{value:new U(1,0)},uCam:{value:new w},uZen:{value:new L},uHorS:{value:new L},uHorA:{value:new L},uGlow:{value:new L},uBelt:{value:new L},uDisc:{value:new L},uCLit:{value:new L},uCShade:{value:new L},uFog:{value:new L},uWind:{value:new Ke},uCover:{value:.58},uCloudAmt:{value:1},uMoonI:{value:0}},e=new yt({uniforms:{...l,uNight:Ue,uStars:go,uTime:ii,uNoise:{value:kb()}},side:uo,depthWrite:!1,transparent:!0,blending:kl,fog:!1,vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,fragmentShader:`
      varying vec3 vDir;
      uniform vec3 uSun, uMoon, uCam, uZen, uHorS, uHorA, uGlow, uBelt, uDisc, uCLit, uCShade, uFog;
      uniform vec2 uSunXZ;
      uniform vec4 uWind;
      uniform float uNight, uStars, uTime, uCover, uCloudAmt, uMoonI;
      uniform sampler2D uNoise;
      const float SUN_R = 6.0e-5;   // 1 - cos(0.63 deg)
      const float MOON_R = 4.6e-5;
      const float CLOUD_H = 1400.0;
      void main() {
        vec3 dir = normalize(vDir);
        float y = dir.y, h = max(y, 0.0);
        vec2 dxz = dir.xz / max(length(dir.xz), 1e-4);
        float az = dot(dxz, uSunXZ) * 0.5 + 0.5;
        float mu = dot(dir, uSun), m = max(mu, 0.0);
        float m2 = m * m, m4 = m2 * m2, m8 = m4 * m4, m32 = m8 * m8 * m8 * m8;

        // gradient: horizon band thins upward; sun-side horizon warm at dusk, anti-sun side cool
        vec3 hor = mix(uHorA, uHorS, az * az);
        float g = 1.0 - h;
        vec3 col = mix(uZen, hor, g * g * (0.45 + 0.55 * g));
        float anti = (1.0 - az) * (1.0 - az);
        col += uBelt * anti * smoothstep(0.0, 0.05, h) * (1.0 - smoothstep(0.07, 0.3, h));
        col += uGlow * (m2 * 0.1 + m8 * 0.4 + m32 * 0.85);

        // night: moon (soft maria from the noise) and stars
        float md = 1.0 - dot(dir, uMoon);
        float moon = 1.0 - smoothstep(MOON_R * 0.7, MOON_R, md);
        float maria = texture2D(uNoise, (dir.xz - uMoon.xz) * 95.0).g;
        col += vec3(0.85, 0.88, 0.95) * moon * (0.75 + 0.35 * maria) * uMoonI * 1.6;
        float mg = max(1.0 - md, 0.0), mg2 = mg * mg, mg8 = mg2 * mg2; mg8 *= mg8;
        col += vec3(0.05, 0.07, 0.13) * (mg8 * mg8 * 0.6 + mg2 * mg2 * 0.12) * uMoonI;
        vec3 cell = floor(dir * 300.0);
        float hsh = fract(sin(dot(cell, vec3(12.9, 78.2, 45.1))) * 43758.5);
        float star = step(0.9925, hsh) * pow(fract(hsh * 17.0), 5.0);
        star *= 0.7 + 0.3 * sin(uTime * (1.5 + fract(hsh * 31.0) * 3.0) + hsh * 80.0);
        col += vec3(0.85, 0.9, 1.0) * star * uStars * smoothstep(0.04, 0.3, h) * 1.4;

        // sun disc with limb darkening, clipped by the sea horizon
        float d = 1.0 - mu;
        float disc = (1.0 - smoothstep(SUN_R * 0.8, SUN_R, d)) * (1.0 - 0.4 * clamp(d / SUN_R, 0.0, 1.0));
        vec3 sun = uDisc * disc * smoothstep(-0.006, 0.004, y);

        // clouds: deck at CLOUD_H drifting with the trade wind. The +0.15 bends the deck down like the
        // earth's curvature (distant cumulus stay puffy instead of streaking). The detail layer is
        // rotated and non-integer scaled so the 6 km tile does not repeat; no branch so LOD stays defined.
        float dist = (CLOUD_H - min(uCam.y, CLOUD_H - 50.0)) / (max(y, 0.0) + 0.15);
        vec2 w = uCam.xz + dir.xz * dist;
        vec2 p = w * (1.0 / 6000.0) + uWind.xy;
        vec2 q = mat2(0.8, -0.6, 0.6, 0.8) * w * (1.0 / 2300.0) + uWind.zw;
        float n2 = texture2D(uNoise, q).g;
        float ero = (1.0 - n2) * 0.26;
        float n = texture2D(uNoise, p).r - ero;
        float ns = texture2D(uNoise, p + uSunXZ * 0.02).r - ero;
        float dens = smoothstep(uCover, uCover + 0.16, n);
        float lit = clamp(0.5 + (n - ns) * 8.0, 0.0, 1.0);
        lit *= (1.0 - 0.55 * smoothstep(uCover + 0.06, uCover + 0.3, n)) * (0.78 + 0.32 * n2);   // shaded bases, cauliflower tops
        lit = mix(lit, 1.0, m8 * 0.6);
        vec3 cc = mix(uCShade, uCLit, lit);
        cc += uGlow * (m8 * 1.1 + m32 * 1.5) * (1.0 - 0.5 * dens);   // silver lining toward the sun
        cc = mix(cc, hor, (1.0 - smoothstep(0.03, 0.32, y)) * 0.6);   // aerial perspective
        dens *= smoothstep(0.0, 0.09, y) * uCloudAmt * step(uCam.y, CLOUD_H - 60.0);

        col = mix(col + sun, cc, dens);
        col = mix(uFog, col, smoothstep(-0.03, 0.004, y));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),t=new B(new Ge(1,32,16),e);return t.frustumCulled=!1,t.renderOrder=-1e3,t.name="aw:sky",t.matrixAutoUpdate=!0,{mesh:t,u:l}}var Gb=new L(14017279),Hb=new L(2770032),Vb=new L(11569752),Wb=new L(9348300),Xb=new L(16764836),qb=new L(10334430),Yb=new L(3820134),Ed=24,Zb=new L,xo=l=>l-Math.floor(l);function xc(l,e){if(l.y>=e)return l;let t=Math.hypot(l.x,l.z)||1,n=Math.sqrt(1-e*e)/t;return l.set(l.x*n,e,l.z*n)}var bo=class{constructor(e,t=!0){x(this,"g");x(this,"sky");x(this,"ambient");x(this,"sample",gc());x(this,"sunW",new w(0,1,0));x(this,"moonW",new w(0,1,0));x(this,"base");x(this,"ax",{ex:1,ez:0,nx:0,nz:-1});x(this,"wind",{x:0,z:0,qx:0,qz:0});x(this,"low");x(this,"disc");x(this,"clouds",[]);this.g=e;let n=e.real.sky,i=n.sunDir.clone().normalize();this.base={theta:n.theta,envAng0:Math.atan2(-i.z,i.x),sunColor:n.sun.color.clone(),sunI:n.sun.intensity,bounceSky:n.bounce.color.clone(),bounceGround:n.bounce.groundColor.clone(),bounceI:n.bounce.intensity,fog:n.fog.color.clone(),exposure:e.renderer.toneMappingExposure};let s=e.fromLL;if(s){let c=s(12.52,-70),u=s(12.52,-69.99),h=s(12.53,-70),d=Math.hypot(u.x-c.x,u.z-c.z)||1,f=Math.hypot(h.x-c.x,h.z-c.z)||1;this.ax={ex:(u.x-c.x)/d,ez:(u.z-c.z)/d,nx:(h.x-c.x)/f,nz:(h.z-c.z)/f}}let r=this.ax,o=-(.924*r.ex+.383*r.nx)*Ed,a=-(.924*r.ez+.383*r.nz)*Ed;this.wind={x:o/6e3,z:a/6e3,qx:(.8*o+.6*a)/2300,qz:(-.6*o+.8*a)/2300},this.low=e.real.q?.name==="low",this.disc=t?1:0,this.ambient=new Os(9348300,0),this.ambient.name="aw:nightAmbient",e.scene.add(this.ambient),this.sky=Td(),e.scene.add(this.sky.mesh);for(let c of e.scene.children){let u=c;u.isSprite&&u.material&&u.position.y>25&&u.scale.x>60&&this.clouds.push({m:u.material,c:u.material.color.clone(),o:u.material.opacity})}}apply(e){let t=this.g,n=t.real.sky,i=Ad(e,this.sample),s=this.base,r=this.ax,o=this.low,a=i.night,c=i.elevDeg;Ue.value=a,go.value=i.stars;let u=this.sunW.set(i.east*r.ex+i.north*r.nx,i.up,i.east*r.ez+i.north*r.nz).normalize(),h=xc(this.moonW.copy(u).negate(),.62),d=c>-2,f=n.sunDir;d?xc(f.copy(u),.07):xc(f.copy(h),.78);let p=s.theta+Math.atan2(-f.z,f.x)-s.envAng0;t.scene.environmentRotation.set(0,p,0),t.scene.backgroundRotation.set(0,p,0),t.scene.background&&(t.scene.background=null);let m=dt(.42,.75,a);d?(n.sun.color.copy(i.light).lerp(s.sunColor,dt(30,45,c)),n.sun.intensity=s.sunI*i.sunK):(n.sun.color.copy(Gb),n.sun.intensity=s.sunI*(.32+.16*m)*i.moonK*(o?1.1:1)),n.bounce.color.copy(s.bounceSky).lerp(Hb,a),n.bounce.groundColor.copy(s.bounceGround).lerp(Vb,a),n.bounce.intensity=s.bounceI+((.55+.35*m)*(o?.72:1)-s.bounceI)*a;let g=i.dusk*(1-i.moonK);this.ambient.color.copy(Xb).lerp(qb,1-dt(-6,2,c)).lerp(Wb,i.moonK),this.ambient.intensity=.32*g*(o?.75:1)+(.55+.45*m)*(o?.5:1)*i.moonK;let b=o?.12:.22;t.scene.environmentIntensity=b+(1-b)*i.skyK,t.renderer.toneMappingExposure=s.exposure*(1+(o?.02:.14)*a)*(1+.1*i.dusk),n.fog.color.copy(i.fog).lerp(s.fog,.45*dt(12,30,c));let v=t.camera,M=this.sky.u;this.sky.mesh.position.copy(v.position),this.sky.mesh.scale.setScalar(v.far*.9),M.uSun.value.copy(u);let _=Math.hypot(u.x,u.z);_>1e-4&&M.uSunXZ.value.set(u.x/_,u.z/_),M.uMoon.value.copy(h),M.uMoonI.value=i.moonK,M.uCam.value.copy(v.position),M.uZen.value.copy(i.zenith),M.uHorS.value.copy(i.horSun),M.uHorA.value.copy(i.horAnti),M.uGlow.value.copy(i.glow),M.uBelt.value.copy(i.belt),M.uDisc.value.copy(i.disc).multiplyScalar(this.disc),M.uCLit.value.copy(i.cloudLit),M.uCShade.value.copy(i.cloudShade),M.uFog.value.copy(n.fog.color);let A=ii.value,E=this.wind;M.uWind.value.set(xo(E.x*A),xo(E.z*A),xo(E.qx*A),xo(E.qz*A)),M.uCloudAmt.value=1-.35*a;for(let C of this.clouds)C.m.color.copy(C.c).lerp(Zb.copy(Yb),a),C.m.opacity=C.o*(1-.6*a)}};function gn(l,e,t){let n=l;if(n.userData["aw:"+e])return;n.userData["aw:"+e]=!0;let i=n.onBeforeCompile,s=n.customProgramCacheKey?n.customProgramCacheKey.bind(n):()=>"";n.onBeforeCompile=(r,o)=>{i&&i.call(n,r,o),t(r)},n.customProgramCacheKey=()=>s()+"|aw-"+e,n.needsUpdate=!0}function Kb(l){gn(l,"winglow-v1",e=>{e.fragmentShader.includes("float gMask = glass;")&&(e.uniforms.uAwNight=Ue,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    float awB = floor(u / 3.6), awF = floor(v / max(fh, 0.5));
    float awR = rwH(vec2(awB * 3.1 + seed * 11.0, awF * 7.3 + 0.37));
    float awLit = step(0.6, awR); // ~40% of windows lit (r202: 50%)
    vec3 awWarm = mix(vec3(1.0, 0.6, 0.28), vec3(1.0, 0.86, 0.62), rwH(vec2(awR, seed + 0.5)));
    totalEmissiveRadiance += awWarm * gMask * awLit * smoothstep(0.3, 0.8, uAwNight) * (0.35 + 0.25 * awR); // owner: city too bright (r202 0.9, before 2.4)
  }`))})}function jb(l){gn(l,"herowin-v2",e=>{e.fragmentShader.includes("#include <emissivemap_fragment>")&&(e.uniforms.uAwNight=Ue,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    vec3 awC = diffuseColor.rgb;
    float awL = dot(awC, vec3(0.299, 0.587, 0.114));
    float awW = step(awC.r + 0.03, awC.b) * (1.0 - smoothstep(0.12, 0.3, awL));
    #ifdef USE_MAP
    vec2 awCell = floor(vMapUv + 0.001); // u per bay, v per storey -> one cell per window
    awW *= step(0.25, fract(sin(dot(awCell, vec2(12.9898, 78.233))) * 43758.5453));
    #endif
    totalEmissiveRadiance += vec3(1.0, 0.72, 0.42) * awW * smoothstep(0.3, 0.8, uAwNight) * 0.32; // r202 0.55, before 1.2
  }`))})}var Jb=new L(16763269),$b=new w,vo=class{constructor(e){x(this,"g");x(this,"head");x(this,"headTarget");x(this,"pools",[]);x(this,"bulbMats",new Set);x(this,"bulbBase",new Map);x(this,"lampMeshes",new Set);x(this,"scanT",0);x(this,"heroGlow",new Map);x(this,"heroN",-1);x(this,"bump",[]);x(this,"poolT",0);x(this,"waterDone",new WeakSet);x(this,"waterSeen",new WeakSet);x(this,"waterTopN",-1);x(this,"waterT",0);this.g=e;let t=e.real;t.buildings?.wall&&Kb(t.buildings.wall),this.head=new Jn(16773576,0,58,.95,.6,1),this.head.castShadow=!1,this.head.name="aw:headlight",this.headTarget=new Re,this.head.target=this.headTarget,e.scene.add(this.head,this.headTarget);let i=(t.q?.name??"med")==="high"?4:0;for(let s=0;s<i;s++){let r=new $n(16757086,0,28,2);r.castShadow=!1,r.name="aw:lampPool",this.pools.push(r),e.scene.add(r)}}patchWaterMat(e){if(!e||Array.isArray(e)||this.waterDone.has(e))return;this.waterDone.add(e);let t=e.customProgramCacheKey?e.customProgramCacheKey():"";/\|water/.test(t)&&gn(e,"waternight-v1",n=>{n.fragmentShader.includes("diffuseColor = vec4(wc, a);")&&(n.uniforms.uAwNight=Ue,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("diffuseColor = vec4(wc, a);",`wc *= mix(1.0, 0.22, uAwNight); wc = mix(wc, wc * vec3(0.55, 0.75, 1.1), uAwNight * 0.5);
  diffuseColor = vec4(wc, a);`))})}patchWater(){let e=this.g.real;if(e.group.children.length!==this.waterTopN){this.waterTopN=e.group.children.length;for(let t of e.group.children){let n=t.material;t.isMesh&&this.patchWaterMat(n)}}for(let t of e.regions.values())t.wmat&&this.patchWaterMat(t.wmat),!(t.state!=="built"||!t.group||this.waterSeen.has(t.group))&&(this.waterSeen.add(t.group),t.group.traverse(n=>{n.isMesh&&this.patchWaterMat(n.material)}))}scan(){this.waterT++,this.patchWater(),this.g.real.veg.group.traverse(e=>{let t=e.material;!e.isMesh||!t||Array.isArray(t)||!t.emissive||(t.emissive.getHex()===5591884||this.bulbMats.has(t))&&(this.bulbMats.has(t)||(this.bulbMats.add(t),this.bulbBase.set(t,{e:t.emissive.clone(),i:t.emissiveIntensity})),e.isInstancedMesh&&this.lampMeshes.add(e))});for(let e of this.lampMeshes)e.parent||this.lampMeshes.delete(e);this.scanHero()}scanHero(){let e=this.g.real.hero?.group;if(!e)return;let t=0;e.traverse(()=>t++),t!==this.heroN&&(this.heroN=t,e.traverse(n=>{let i=n.material;if(!(!n.isMesh||!i))for(let s of Array.isArray(i)?i:[i]){if(!s||!s.emissive||this.heroGlow.has(s))continue;let r=s.name||"";/^l?(signglow|neon|bulb)/i.test(r)?this.heroGlow.set(s,s.emissiveIntensity||1):r==="sign"?this.heroGlow.set(s,-(s.emissiveIntensity||1)):/^(facade|ground)(_\d+)?$/.test(r)?(jb(s),this.bump.push(s)):r==="glass"&&(s.emissive.setHex(16763269),s.emissiveIntensity=0,this.heroGlow.set(s,0))}}))}carForward(e){let t=this.g.S.car.h;return e.set(-Math.sin(t),0,-Math.cos(t)),!0}update(e){let t=this.g,n=Ue.value;this.scanT-=e,this.scanT<=0&&(this.scanT=2,this.scan());let i=Math.max(0,Math.min(1,(n-.25)/.4));for(let a of this.bulbMats){let c=this.bulbBase.get(a);a.emissive.copy(c.e).lerp(Jb,i),a.emissiveIntensity=c.i+i*2}if(this.bump.length){for(let a of this.bump)a.needsUpdate=!0;this.bump.length=0}for(let a of this.heroGlow.keys()){let c=this.heroGlow.get(a);a.emissiveIntensity=c>0?c*(.45+i*.95):c<0?-c*(1+i*.55):i*.16}let s=t.S,r=(s.mode==="car"||s.mode==="moto")&&n>.35,o=$b;if(r&&this.carForward(o)){let a=s.car,c=(a.y||0)+(s.mode==="moto"?.72:.62);this.head.position.set(a.x+o.x*2.2,c,a.z+o.z*2.2),this.headTarget.position.set(a.x+o.x*24,(a.y||0)+.2,a.z+o.z*24),this.headTarget.updateMatrixWorld(),this.head.intensity=14*n}else this.head.intensity=0;if(this.head.visible=n>.35,this.pools.length){if(this.poolT-=e,this.poolT<=0){this.poolT=.5;let a=t.camera.position,c=[],u=new O;for(let h of this.lampMeshes){let d=h.matrixWorld;for(let f=0;f<h.count;f++){h.getMatrixAt(f,u);let p=new w().setFromMatrixPosition(u).applyMatrix4(d),m=(p.x-a.x)**2+(p.z-a.z)**2;m>8100||c.push({d:m,p})}}c.sort((h,d)=>h.d-d.d),this.pools.forEach((h,d)=>{let f=c[d];f&&h.position.set(f.p.x,f.p.y+6.5,f.p.z),h.userData.has=!!f})}for(let a of this.pools)a.intensity=a.userData.has?n*12:0,a.visible=n>.3}}};var _o=[1,.9,.8,.7,.6],Rd=[1,.85,.75,.75,.75],Cd=6,yo=class{constructor(e){x(this,"g");x(this,"enabled");x(this,"target");x(this,"level",0);x(this,"maxLevel",Cd);x(this,"fps",60);x(this,"basePR");x(this,"acc",0);x(this,"frames",0);x(this,"lowFor",0);x(this,"highFor",0);x(this,"holdUp",0);x(this,"warm",4);x(this,"shadowTick",0);x(this,"stalls",0);x(this,"upAt",-1e9);x(this,"bounces",0);x(this,"floorUntil",0);x(this,"t",0);x(this,"phone",!1);x(this,"listeners",[]);this.g=e,this.basePR=e.renderer.getPixelRatio(),this.enabled=H.get("fpsguard")!=="0"&&localStorage.getItem("aw_fpsguard")!=="0";let t=e.real?.q?.name,n=+(H.get("fps")||0),i=!(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window),s=t==="high";this.target=n>10?n:t==="low"?i?30:50:i&&s?57:50,this.maxLevel=i&&s?4:i?Cd:5,this.phone=!i,document.addEventListener("visibilitychange",()=>{this.warm=2,this.acc=0,this.frames=0})}onChange(e){this.listeners.push(e)}setEnabled(e){this.enabled=e;try{localStorage.setItem("aw_fpsguard",e?"1":"0")}catch{}e||this.setLevel(0),this.listeners.forEach(t=>t())}setLevel(e){if(e=Math.max(0,Math.min(this.maxLevel,e)),e===this.level)return;let t=this.g,n=(this.phone?Rd:_o)[Math.min(e,_o.length-1)],i=window.__awPRCap||1/0,s=Math.max(.5,Math.min(this.basePR,i)*n);Math.abs(t.renderer.getPixelRatio()-s)>.001&&(t.renderer.setPixelRatio(s),window.dispatchEvent(new Event("resize")),window.__awPost?window.__awPost.render():t.renderer.render(t.scene,t.camera)),t.renderer.shadowMap.autoUpdate=e<5,e<5&&(t.renderer.shadowMap.needsUpdate=!0),window.__noPost=e>=6,this.level=e,this.listeners.forEach(r=>r())}frame(e){let t=this.g.renderer;if(this.level>=5&&++this.shadowTick%7===0&&(t.shadowMap.needsUpdate=!0),!this.enabled||document.hidden)return;if(this.t+=Math.min(e,1),e>1.5&&++this.stalls<3){this.warm=Math.max(this.warm,1);return}if(e<=1.5&&(this.stalls=0),this.warm>0){this.warm-=Math.max(0,e);return}if(this.acc+=e,this.frames++,this.acc<.5)return;this.fps=this.frames/this.acc;let n=this.acc;this.acc=0,this.frames=0,this.holdUp=Math.max(0,this.holdUp-n),this.fps<this.target-2?(this.lowFor+=n,this.highFor=0):this.fps>Math.min(this.target+8,58)?(this.highFor+=n,this.lowFor=0):(this.lowFor=0,this.highFor=0);let i=window.__awAhead,s=!!i&&Math.hypot(i[0],i[1])>25;this.lowFor>=(this.phone?3:1.5)&&this.level<this.maxLevel?(this.t-this.upAt<25&&++this.bounces>=2&&(this.floorUntil=this.t+600),this.setLevel(this.level+1),this.lowFor=0,this.warm=1,this.holdUp=15):this.highFor>=6&&this.level>0&&!(this.phone&&s)&&this.holdUp<=0&&this.t>this.floorUntil&&(this.setLevel(this.level-1),this.upAt=this.t,this.highFor=0,this.warm=1,this.holdUp=8)}describe(){if(!this.enabled)return"off";let e=(this.phone?Rd:_o)[Math.min(this.level,_o.length-1)],t=this.level>=6?" \xB7 post off":this.level>=5?" \xB7 lazy shadows":"";return`${Math.round(this.fps)} fps \xB7 target ${this.target} \xB7 scale ${Math.round(e*100)}%${t}`}};var Mo=class{constructor(e){x(this,"g",e);x(this,"px",NaN);x(this,"pz",NaN);x(this,"vx",0);x(this,"vz",0)}frame(e){let t=this.g.camera.position;if(e>0&&e<.5&&Number.isFinite(this.px)){let a=Math.min(1,e*1.5);this.vx+=((t.x-this.px)/e-this.vx)*a,this.vz+=((t.z-this.pz)/e-this.vz)*a}this.px=t.x,this.pz=t.z;let n=this.vx*5,i=this.vz*5,s=Math.hypot(n,i);s>220&&(n*=220/s,i*=220/s);let r=window,o=r.__awAhead||(r.__awAhead=[0,0]);s<15?(o[0]=0,o[1]=0):(o[0]=n,o[1]=i)}};var Qb=["map","normalMap","roughnessMap","metalnessMap","emissiveMap","aoMap","alphaMap","bumpMap","lightMap","specularMap","clearcoatNormalMap"],wo=class{constructor(e,t,n=!0,i=!1){x(this,"g",e);x(this,"incremental",n);x(this,"preUpload",i);x(this,"on");x(this,"n",0);x(this,"t",1);x(this,"busy",!1);x(this,"seen",new WeakSet);x(this,"keys",new Set);x(this,"lightKey","");x(this,"seenTex",new WeakSet);x(this,"texQ",[]);x(this,"pend",[]);x(this,"inflight",0);x(this,"stats",{compiles:0,objs:0,reps:0,uploads:0});this.on=t}frame(e){if(!this.on)return;let t=this.g.renderer;if(t.shadowMap.autoUpdate=!1,(this.n++&1)===0&&(t.shadowMap.needsUpdate=!0),this.texQ.length&&this.upload(),(this.t-=e)>0&&!this.pend.length||!t.compileAsync)return;if(!this.incremental){if(this.busy)return;this.t=4,this.busy=!0,t.compileAsync(this.g.scene,this.g.camera).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.busy=!1});return}this.pend.length||(this.t=.5,this.pend=this.scan());let n=this.pend.splice(0,4).filter(s=>s.parent);if(!n.length)return;this.inflight++,this.stats.reps+=n.length;let i={traverse:s=>{for(let r of n)s(r)},traverseVisible:()=>{}};t.compileAsync(i,this.g.camera,this.g.scene).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.inflight--})}pending(){return this.pend.length+this.inflight}upload(){let e=this.g.renderer,t=performance.now();for(let n=0;n<2&&this.texQ.length&&performance.now()-t<3;){let i=this.texQ.shift(),s=i.image;if(i.version===0||!s||s.complete===!1){this.texQ.length?this.texQ.push(i):this.seenTex.delete(i);break}e.properties.get(i).__version!==i.version&&(e.initTexture(i),n++,this.stats.uploads++)}}scan(){let e=[],t="",n=i=>{if(i.visible){i.isLight&&(t+=i.type+(i.castShadow?"s":"")+",");for(let s of i.children)n(s)}};return n(this.g.scene),t!==this.lightKey&&(this.lightKey=t,this.keys.clear(),this.seen=new WeakSet),this.g.scene.traverse(i=>{let s=i;if(this.seen.has(s)||!(s.isMesh||s.isPoints||s.isLine||s.isSprite)||!s.material)return;this.seen.add(s),this.stats.objs++;let r=s.geometry,o=r?r.attributes:{},a=Array.isArray(s.material)?s.material:[s.material],c=(s.isInstancedMesh?s.instanceColor?"I":"i":"")+(s.isBatchedMesh?s._colorsTexture?"B":"b":"")+(s.isSkinnedMesh?"s":"")+(s.receiveShadow?"r":"")+(o.color?"c":"")+(o.tangent?"t":"")+(o.uv1?"1":"")+(o.uv2?"2":"")+(r&&Object.keys(r.morphAttributes).length?"m":"")+s.type,u=!1;if(this.preUpload)for(let h of a)for(let d of Qb){let f=h[d];f&&f.isTexture&&!f.isCubeTexture&&!this.seenTex.has(f)&&(this.seenTex.add(f),this.texQ.push(f))}for(let h of a){let d=h.id+":"+h.version+":"+c;this.keys.has(d)||(this.keys.add(d),u=!0)}u&&e.push(s)}),e}};function ev(l,e){let t=e&&e.length===l.length*10?e:new Float64Array(l.length*10);for(let n=0,i=0;n<l.length;n++,i+=10){let s=l[n],r=s.position,o=s.quaternion,a=s.scale;t[i]=r.x,t[i+1]=r.y,t[i+2]=r.z,t[i+3]=o.x,t[i+4]=o.y,t[i+5]=o.z,t[i+6]=o.w,t[i+7]=a.x,t[i+8]=a.y,t[i+9]=a.z}return t}function bc(l,e,t){let n=l.position,i=l.quaternion,s=l.scale;return e[t]===n.x&&e[t+1]===n.y&&e[t+2]===n.z&&e[t+3]===i.x&&e[t+4]===i.y&&e[t+5]===i.z&&e[t+6]===i.w&&e[t+7]===s.x&&e[t+8]===s.y&&e[t+9]===s.z}function tv(l,e){for(let t=0;t<16;t++)if(l[t]!==e[t])return!1;return!0}function Id(l,e){e.push(l);let t=l.children;for(let n=0;n<t.length;n++)Id(t[n],e);return e}function Pd(l,e){let t=l.o;for(let n=0;n<l.depth&&t;n++)t=t.parent;return t===e}var vc=l=>Object.getPrototypeOf(l);function nv(l){let e=this.__awFz;if(e&&e.frozen){if(!this.matrixWorldNeedsUpdate){if(!l)return;let t=this.parent;if(t&&tv(t.matrixWorld.elements,e.pm)&&bc(this,e.snap,0))return}So(e),e.fthaw=!0}vc(this).updateMatrixWorld.call(this,l)}function iv(l){for(let e=l.target;e;e=e.parent)if(e.__awFz&&e.__awFz.frozen){So(e.__awFz);return}}function So(l){l.frozen&&(l.frozen=!1,l.t=-1,vc(l.o).updateMatrixWorld.call(l.o,!1))}var Ao=class{constructor(e){x(this,"g",e);x(this,"stats",{frozen:0,frozenNodes:0,thaws:0,splits:0,roots:0});x(this,"roots",[]);x(this,"parents",[]);x(this,"tracked",new WeakSet);x(this,"hooked",new WeakSet);x(this,"clock",0);x(this,"scanT",0);x(this,"ci",0);x(this,"ck",0);x(this,"oi",0)}top(){return(this.g.real||{}).group||null}track(e,t){this.tracked.has(e)||(this.tracked.add(e),this.roots.push({o:e,depth:t,nodes:[],snap:new Float64Array(0),pm:new Float64Array(16),t:-1,frozen:!1,dead:!1,fthaw:!1}))}frame(e){let t=this.top();if(!t)return;if(this.clock+=e,(this.scanT-=e)<=0){this.scanT=1;for(let c of t.children)this.track(c,1);let s=0;for(let c of this.parents){if(!Pd(c,t)){this.tracked.delete(c.o);continue}this.parents[s++]=c;for(let u of c.o.children)this.track(u,c.depth+1)}this.parents.length=s;let r=0,o=0,a=0;for(let c of this.roots)Pd(c,t)||(So(c),c.dead=!0,this.tracked.delete(c.o)),!c.dead&&(this.roots[r++]=c,c.frozen&&(o++,a+=c.nodes.length));this.roots.length=r,this.stats.roots=r,this.stats.frozen=o,this.stats.frozenNodes=a}let n=this.roots.length;if(!n)return;for(let s=0,r=400;s<n&&r>0;s++){let o=this.roots[this.oi=(this.oi+1)%n];if(o.fthaw&&(o.fthaw=!1,this.stats.thaws++),o.frozen||o.dead||o.t>=0&&this.clock-o.t<2)continue;let a=Id(o.o,[]),c=o.snap,u=o.nodes;r-=a.length;let h=o.t<0||u.length!==a.length;for(let d=0;d<a.length&&!h;d++)(a[d]!==u[d]||!bc(a[d],c,d*10))&&(h=!0);if(h&&o.t>=0&&o.depth<4&&o.o.children.length){o.dead=!0,this.stats.splits++,this.parents.push(o);for(let d of o.o.children)this.track(d,o.depth+1);continue}if(h){o.nodes=a,o.snap=ev(a,c),o.t=this.clock;continue}this.freeze(o)}let i=600;for(let s=0;i>0&&s<n;s++){let r=this.roots[this.ci%n];if(!r.frozen){this.ci++,this.ck=0;continue}let o=r.nodes,a=r.snap,c=!1,u=this.ck;for(;u<o.length&&i>0;u++,i--){let h=o[u];if(u>0&&h.matrixWorldNeedsUpdate||!bc(h,a,u*10)){c=!0;break}}if(c&&(So(r),this.stats.thaws++),c||u>=o.length)this.ci++,this.ck=0;else{this.ck=u;break}}}freeze(e){if(!e.o.parent)return;vc(e.o).updateMatrixWorld.call(e.o,!1);let t=e.o.parent.matrixWorld.elements;for(let n=0;n<16;n++)e.pm[n]=t[n];for(let n of e.nodes)this.hooked.has(n)||(this.hooked.add(n),n.addEventListener("childadded",iv));Object.prototype.hasOwnProperty.call(e.o,"updateMatrixWorld")||(e.o.updateMatrixWorld=nv),e.o.__awFz=e,e.frozen=!0}};function Mt(l,e=!1){let t=l[0].index!==null,n=new Set(Object.keys(l[0].attributes)),i=new Set(Object.keys(l[0].morphAttributes)),s={},r={},o=l[0].morphTargetsRelative,a=new le,c=0;for(let u=0;u<l.length;++u){let h=l[u],d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in h.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;a.addGroup(c,f,u),c+=f}}if(t){let u=0,h=[];for(let d=0;d<l.length;++d){let f=l[d].index;for(let p=0;p<f.count;++p)h.push(f.getX(p)+u);u+=l[d].attributes.position.count}a.setIndex(h)}for(let u in s){let h=Ld(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;a.setAttribute(u,h)}for(let u in r){let h=r[u][0].length;if(h!==0){a.morphAttributes=a.morphAttributes||{},a.morphAttributes[u]=[];for(let d=0;d<h;++d){let f=[];for(let m=0;m<r[u].length;++m)f.push(r[u][m][d]);let p=Ld(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;a.morphAttributes[u].push(p)}}}return a}function Ld(l){let e,t,n,i=-1,s=0;for(let c=0;c<l.length;++c){let u=l[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}let r=new e(s),o=new oe(r,t,n),a=0;for(let c=0;c<l.length;++c){let u=l[c];if(u.isInterleavedBufferAttribute){let h=a/t;for(let d=0,f=u.count;d<f;d++)for(let p=0;p<t;p++){let m=u.getComponent(d,p);o.setComponent(d+h,p,m)}}else r.set(u.array,a);a+=u.count*t}return i!==void 0&&(o.gpuType=i),o}function _c(l,e){if(e===tc)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),l;if(e===Vi||e===zs){let t=l.getIndex();if(t===null){let s=[],r=l.getAttribute("position");if(r!==void 0){for(let o=0;o<r.count;o++)s.push(o);l.setIndex(s),t=l.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),l}let n=t.count-2,i=[];if(e===Vi)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),l.setIndex(i),l.clearGroups(),l}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),l}var To=class{constructor(e){x(this,"g",e);x(this,"stats",{regions:0,before:0,after:0,ms:0});x(this,"n",0);x(this,"todo",[])}frame(){if(++this.n%3)return;let e=this.todo.shift();if(e){let n=performance.now();this.mergeList(e.root,e.list),this.stats.ms=Math.max(this.stats.ms,performance.now()-n);return}let t=this.g.real;for(let n of t.regions.values())if(!(n.__awBM||n.state!=="built"||!n.group)&&!t.queue.some(i=>i.R===n)){n.__awBM=!0,this.collect(n.group);return}}collect(e){let t=new Map;e.traverse(n=>{let i=n;if(!i.isMesh||i.isInstancedMesh||!i.name.startsWith("bld:")||i.name==="bld:kit"||Array.isArray(i.material))return;let s=i,r=!0;for(;s&&s!==e;)s.matrix.equals(sv)||(r=!1),s=s.parent;if(!r)return;let o=i.geometry;if(Object.keys(o.morphAttributes).length||o.groups.length)return;let a=i.name+"|"+i.material.uuid+"|"+Object.keys(o.attributes).sort().join(",")+"|"+(o.index?1:0)+"|"+(i.castShadow?1:0)+(i.receiveShadow?1:0)+"|"+i.renderOrder;(t.get(a)||t.set(a,[]).get(a)).push(i)});for(let n of t.values())this.stats.before+=n.length,n.length<2?this.stats.after++:this.todo.push({root:e,list:n});this.stats.regions++}mergeList(e,t){if(!t[0].parent)return;let n=Mt(t.map(r=>r.geometry));if(!n){this.stats.after+=t.length;return}n.computeBoundingSphere(),n.computeBoundingBox();let i=t[0],s=new B(n,i.material);s.name=i.name,s.castShadow=i.castShadow,s.receiveShadow=i.receiveShadow,s.renderOrder=i.renderOrder,s.frustumCulled=i.frustumCulled;for(let r of t)r.removeFromParent(),r.geometry.dispose();e.add(s),this.stats.after++}},sv=new O;var rv=new O,Dd=new O,Nd=new Yt,nn=new w,Od=0,Fd=1,Ud=2;function yc(l,e,t,n){let i=this.userData.awb;Dd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Nd.setFromProjectionMatrix(Dd,t.coordinateSystem,t.reversedDepth);let s=Nd.planes,r=n.index?n.index.array.BYTES_PER_ELEMENT:1,o=this._multiDrawStarts,a=this._multiDrawCounts,c=this._geometryInfo,u=0;e:for(let h=0;h<i.nVis;h++){let d=i.vis[h],f=i.cx[d],p=i.cy[d],m=i.cz[d],g=-i.r[d];for(let v=0;v<6;v++){let M=s[v],_=M.normal;if(_.x*f+_.y*p+_.z*m+M.constant<g)continue e}let b=c[d];o[u]=b.start*r,a[u]=b.count,u++}this.userData.awInd||(this._indirectTexture.needsUpdate=!0,this.userData.awInd=1),this._multiDrawCount=u,this._multiDrawBytesPerElement=r,this._visibilityChanged=!1}var Eo=class{constructor(e,t,n=1/0){x(this,"g",e);x(this,"budget",t);x(this,"shellR",n);x(this,"stats",{regions:0,batches:0,cells:0,visCells:0,maxSlice:0,failed:0});x(this,"jobs",[]);x(this,"live",new Set);x(this,"fx",NaN);x(this,"fz",NaN);let i=e.real,s=i.update.bind(i);i.update=(...r)=>{let o=s(...r);if(i.cullT===0){let a=window.__awAhead;this.fx=r[0]+(a?a[0]:0),this.fz=r[2]+(a?a[1]:0),this.cullAll()}return o}}pending(){let e=this.jobs.length;for(let t of this.g.real.regions.values())!t.__awBB&&t.state==="built"&&t.group&&e++;return e}frame(){let e=this.g.real,t=performance.now();if(this.live.size){let i=0;for(let s of this.live)(!s.group||!s.group.parent)&&i++;if(i){for(let s of[...this.live])if(!s.group||!s.group.parent){for(let r of s.__awBB||[])r.bm.dispose();this.live.delete(s)}}}if(!this.jobs.length){for(let i of e.regions.values())if(!i.__awBB&&i.state==="built"&&i.group){this.collect(i);break}}for(;this.jobs.length&&performance.now()-t<this.budget;){let i=this.jobs[0];if(!i.list[0].parent||!i.R.group||!i.R.group.parent){this.jobs.shift(),i.b.bm.dispose();continue}let s=i.b.bm;if(i.i<i.list.length){let u=i.list[i.i].geometry;try{s.addInstance(s.addGeometry(u))}catch(h){console.warn("[aw-bb]",h),this.stats.failed++,this.jobs.shift(),s.dispose();continue}u.boundingBox||u.computeBoundingBox(),i.box.union(u.boundingBox),i.i++;continue}let r=i.list[i.k].geometry.attributes.position,o=r.array,a=r.data?-1:r.itemSize;i.box.getCenter(nn);let c=i.r2;if(a>0)for(let u=0;u<o.length;u+=a){let h=o[u]-nn.x,d=o[u+1]-nn.y,f=o[u+2]-nn.z,p=h*h+d*d+f*f;p>c&&(c=p)}else for(let u=0;u<r.count;u++){let h=r.getX(u)-nn.x,d=r.getY(u)-nn.y,f=r.getZ(u)-nn.z,p=h*h+d*d+f*f;p>c&&(c=p)}i.r2=c,++i.k===i.list.length&&(i.b.sx=nn.x,i.b.sz=nn.z,i.b.sr=Math.sqrt(c),this.jobs.shift(),this.swap(i))}let n=performance.now()-t;n>this.stats.maxSlice&&(this.stats.maxSlice=n)}collect(e){let t=e.group,n=new Map;t.traverse(i=>{let s=i;if(!s.isMesh||s.isInstancedMesh||!s.name.startsWith("bld:")||s.name==="bld:kit"||Array.isArray(s.material))return;let r=s;for(;r&&r!==t;){if(!r.matrix.equals(rv))return;r=r.parent}let o=s.geometry;if(Object.keys(o.morphAttributes).length||o.groups.length||!o.attributes.position.count)return;o.boundingSphere||o.computeBoundingSphere();let a=s.name+"|"+s.material.uuid+"|"+Object.keys(o.attributes).sort().map(c=>c+o.attributes[c].array.constructor.name+o.attributes[c].itemSize+(o.attributes[c].normalized?"n":"")).join(",")+"|"+(o.index?1:0)+"|"+(s.castShadow?1:0)+(s.receiveShadow?1:0)+"|"+s.renderOrder+"|"+s.frustumCulled+s.visible;(n.get(a)||n.set(a,[]).get(a)).push(s)}),e.__awBB=[];for(let i of n.values()){if(i.length<2||i.length>65535)continue;let s=0,r=0;for(let f of i){let p=f.geometry;s+=p.attributes.position.count,r+=p.index?p.index.count:0}let o=i[0],a=i.length,c=new qn(a,s,r,o.material);c.name="aw:bb:"+o.name.slice(4),c.castShadow=o.castShadow,c.receiveShadow=o.receiveShadow,c.renderOrder=o.renderOrder,c.sortObjects=!1,c.perObjectFrustumCulled=!0,c.matrixAutoUpdate=!1;let u={bm:c,kind:o.name==="bld:MeshBasicMaterial"?Ud:o.name==="bld:trim"?Fd:Od,n:a,cx:new Float32Array(a),cy:new Float32Array(a),cz:new Float32Array(a),r:new Float32Array(a),vis:new Uint16Array(a),nVis:0,sx:0,sz:0,sr:1/0},h=new X,d=new X;i.forEach((f,p)=>{let m=f.geometry.boundingSphere;u.cx[p]=m.center.x,u.cy[p]=m.center.y,u.cz[p]=m.center.z,u.r[p]=m.radius,p?h.union(d.copy(m)):h.copy(m)}),c.boundingSphere=h,c.userData.awb=u,c.onBeforeRender=yc,this.jobs.push({R:e,list:i,i:0,b:u,box:new Ie,k:0,r2:0})}this.stats.regions++}swap(e){let{R:t,list:n,b:i}=e;t.group.add(i.bm);for(let s of n)s.removeFromParent(),s.geometry.dispose();t.__awBB.push(i),this.live.add(t),this.stats.batches++,this.stats.cells+=i.n,this.cull(i)}cullAll(){let e=0;for(let t of this.live)for(let n of t.__awBB||[])this.cull(n),e+=n.nVis;this.stats.visCells=e}cull(e){let t=this.g.real.q,n=()=>{for(let r=0;r<e.n;r++)e.vis[r]=r;e.nVis=e.n,e.bm.visible=e.n>0};if(!Number.isFinite(this.fx))return n();if(e.kind===Od&&!Number.isFinite(this.shellR)){Math.hypot(e.sx-this.fx,e.sz-this.fz)-e.sr<t.bldR?n():(e.nVis=0,e.bm.visible=!1);return}let i=e.kind===Ud?t.contactR:e.kind===Fd?t.detailR:this.shellR,s=0;for(let r=0;r<e.n;r++)Math.hypot(e.cx[r]-this.fx,e.cz[r]-this.fz)-e.r[r]<i&&(e.vis[s++]=r);e.nVis=s,e.bm.visible=s>0}};var Ro=class{constructor(e){x(this,"stats",{sb:0,drawn:0,blocks:0});x(this,"sbs",[]);let t=e.ovBlocks;if(!t||!t.length)return;let n=t[0].userData.rect[2]-t[0].userData.rect[0]||1,i=t[0].userData.rect[3]-t[0].userData.rect[1]||1,s=Math.min(...t.map(c=>c.userData.rect[0])),r=Math.min(...t.map(c=>c.userData.rect[1])),o=new Map;for(let c of t){let u=Math.floor((c.userData.rect[0]-s+1)/(n*4))+","+Math.floor((c.userData.rect[1]-r+1)/(i*4));(o.get(u)||o.set(u,[]).get(u)).push(c)}for(let c of o.values()){if(c.length<2)continue;let u=new B(c[0].geometry,c[0].material);u.name="ovTerrain:sb",u.receiveShadow=!1,u.matrixAutoUpdate=!1,u.visible=!1,e.group.add(u),this.sbs.push({kids:c,mesh:u,key:"",cache:new Map})}this.stats.sb=this.sbs.length,this.stats.blocks=t.length;let a=e.update.bind(e);e.update=(...c)=>{let u=a(...c);return this.apply(),u}}apply(){let e=0;for(let t of this.sbs){let n="",i=0;for(let r of t.kids)r.visible?(n+=r.userData.lods.indexOf(r.geometry),i++):n+="h";if(i<2){t.mesh.visible=!1;continue}let s=t.cache.get(n);if(s===void 0){if(s=Mt(t.kids.filter(r=>r.visible).map(r=>r.geometry))||null,s&&s.computeBoundingSphere(),t.cache.size>=4){let[r,o]=t.cache.entries().next().value;t.cache.delete(r),o&&o!==s&&o.dispose()}t.cache.set(n,s)}else t.cache.delete(n),t.cache.set(n,s);if(!s){t.mesh.visible=!1;continue}t.mesh.geometry=s,t.mesh.visible=!0;for(let r of t.kids)r.visible=!1;e++}this.stats.drawn=e}};var Co=class{constructor(e){x(this,"real",e);x(this,"stats",{merged:0,chunks:0});x(this,"n",0);x(this,"live",new Set);let t=e.update.bind(e);e.update=(...n)=>{let i=t(...n);return this.apply(),i}}apply(){let e=(++this.n&7)===0,t=0,n=0,i=1;for(let s of this.real.regions.values()){let r=s.chunks,o=s.__awTM,a=!!r&&r.length>1&&!!s.group;if(a){for(let u of r)if(!u.mesh||u.step!==16||u.pending){a=!1;break}}if(!a){if(o&&(o.mesh.removeFromParent(),o.mesh.geometry.dispose(),s.__awTM=void 0,r))for(let u of r)u.mesh&&(u.mesh.visible=!0);continue}let c="";for(let u of r)c+=u.mesh.geometry.id+",";if(!o||o.key!==c){if(!e||i<=0){if(o){for(let h of r)h.mesh.visible=!0;o.mesh.visible=!1}continue}i--;let u=Mt(r.map(h=>h.mesh.geometry));if(!u)continue;if(u.computeBoundingSphere(),o)o.mesh.geometry.dispose(),o.mesh.geometry=u,o.key=c;else{let h=new B(u,r[0].mesh.material);h.name="terrain16:m",h.receiveShadow=!0,h.matrixAutoUpdate=!1,s.group.add(h),s.__awTM={key:c,mesh:h},this.live.add(s)}}s.__awTM.mesh.visible=!0;for(let u of r)u.mesh.visible=!1;t++,n+=r.length}if(e)for(let s of this.live){let r=s.__awTM,o=!1;for(let a of this.real.regions.values())if(a===s){o=!0;break}(!o||!r)&&(r&&(r.mesh.removeFromParent(),r.mesh.geometry.dispose(),s.__awTM=void 0),this.live.delete(s))}this.stats.merged=t,this.stats.chunks=n}};var Mc={value:500};function Bd(l,e=1.6){return new yt({uniforms:{uI:l,uNight:Ue,uScale:Mc,uMinPx:{value:e}},vertexShader:`
      attribute float size; attribute vec3 color; varying vec3 vC; varying float vFar;
      uniform float uScale, uMinPx;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float px = size * uScale / max(0.1, -mv.z);
        vFar = smoothstep(uMinPx * 4.0, uMinPx, px);           // tiny = far: keep a dot, dim the halo
        gl_PointSize = clamp(px, uMinPx, 140.0);
        vC = color;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      varying vec3 vC; varying float vFar; uniform float uI;
      void main() {
        vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q);
        if (r2 > 1.0) discard;
        float core = exp(-r2 * 18.0), halo = exp(-r2 * 3.5) * 0.35 * (1.0 - vFar);
        float a = (core + halo) * uI;
        gl_FragColor = vec4(vC * a, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:ei,fog:!1,toneMapped:!1})}function Po(l,e,t=!1){return new yt({uniforms:{uI:e,uC:{value:new L(l)}},vertexShader:`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 p = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          p = instanceMatrix * p;
        #endif
        gl_Position = projectionMatrix * modelViewMatrix * p;
      }`,fragmentShader:t?`
      varying vec2 vUv; uniform float uI; uniform vec3 uC;
      void main() {
        // v: 0 at the bumper .. 1 far end; u across. Two merged lobes fading with distance.
        float x = (vUv.x - 0.5) * 2.0, d = vUv.y;
        float w = 0.35 + d * 0.65;
        float lobe = exp(-pow(x / w, 2.0) * 2.2);
        float a = lobe * smoothstep(0.0, 0.12, d) * pow(1.0 - d, 1.6) * uI;
        gl_FragColor = vec4(uC * a, 1.0);
      }`:`
      varying vec2 vUv; uniform float uI; uniform vec3 uC;
      void main() {
        float r2 = dot(vUv * 2.0 - 1.0, vUv * 2.0 - 1.0);
        float a = exp(-r2 * 3.2) * (1.0 - smoothstep(0.7, 1.0, r2)) * uI;
        gl_FragColor = vec4(uC * a, 1.0);
      }`,transparent:!0,depthWrite:!1,blending:ei,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,fog:!1,toneMapped:!1})}var zd=-2.4,kd=8.87,Gd=new O,ov=new Y,av=new w(15,1,15),Hd=new w,Io=class{constructor(e){x(this,"g");x(this,"points");x(this,"pools");x(this,"dotI",{value:0});x(this,"poolI",{value:0});x(this,"lists",[]);x(this,"bulbs",new Float32Array(0));x(this,"nBulbs",0);x(this,"t",0);x(this,"nPools");this.g=e;let t=new le;t.setAttribute("position",new oe(new Float32Array(3),3)),this.points=new _t(t,Bd(this.dotI)),this.points.frustumCulled=!1,this.points.name="aw:lampGlow",this.points.renderOrder=5;let n=e.real?.q?.name??"med";this.nPools=n==="low"?14:n==="med"?24:32;let i=new Zt(1,1).rotateX(-Math.PI/2);this.pools=new q(i,Po(16758886,this.poolI),this.nPools),this.pools.frustumCulled=!1,this.pools.count=0,this.pools.name="aw:lampPools",e.scene.add(this.points,this.pools)}rebuild(){let t=this.g.real.veg.lists?.l;if(!t||t.length===this.lists.length&&t.every((c,u)=>c===this.lists[u]))return;this.lists=t.slice();let n=0;for(let c of t)n+=c.length;let i=new Float32Array(n*3),s=new Float32Array(n*3),r=new Float32Array(n),o=0;for(let c of t)for(let[u,h,d,f,p]of c){let m=Math.cos(p),g=Math.sin(p);i[o*3]=u+zd*m*f,i[o*3+1]=h+kd*f-.12,i[o*3+2]=d-zd*g*f,s[o*3]=1,s[o*3+1]=.74,s[o*3+2]=.42,r[o]=1.9,o++}let a=new le;a.setAttribute("position",new oe(i,3)),a.setAttribute("color",new oe(s,3)),a.setAttribute("size",new oe(r,1)),this.points.geometry.dispose(),this.points.geometry=a,this.bulbs=i,this.nBulbs=n}update(e){let t=Ue.value,n=Math.max(0,Math.min(1,(t-.3)/.45));if(this.dotI.value=.95*n,this.poolI.value=.34*n,this.points.visible=this.pools.visible=n>.001,this.t-=e,this.t>0)return;this.t=.5,this.rebuild();let i=this.g.camera;if(Mc.value=this.g.renderer.domElement.height/2/Math.tan(i.fov*Math.PI/180/2),!this.points.visible)return;let s=i.position.x,r=i.position.z,o=[],a=this.bulbs;for(let u=0;u<this.nBulbs;u++){let h=a[u*3]-s,d=a[u*3+2]-r,f=h*h+d*d;f<25600&&o.push([f,u])}o.sort((u,h)=>u[0]-h[0]);let c=Math.min(this.nPools,o.length);for(let u=0;u<c;u++){let h=o[u][1],d=a[h*3],f=a[h*3+2],p=this.g.real&&this.g.real.heightAt,m=p?p(d,f):a[h*3+1]-kd;Hd.set(d,m+.3,f),Gd.compose(Hd,ov,av),this.pools.setMatrixAt(u,Gd)}this.pools.count=c,this.pools.instanceMatrix.needsUpdate=!0}};var Lo=[16052712,2106667,12106945,9377825,1526392,14145746,5003845,11823922,7038077,14927177,7554357,4093819],lv=new L(16773590),cv=new L(16719888),uv=l=>!!l.rb,Do=class{constructor(e){x(this,"g",e);x(this,"stats",{pooled:0,visible:0,yielding:0,avoiding:0,batches:0,beamDraws:0,quality:""});x(this,"amb",null);x(this,"states",[]);x(this,"batches",[]);x(this,"stateByCar",new WeakMap);x(this,"matrix",new O);x(this,"zero",new O().makeScale(0,0,0));x(this,"paint",new L);x(this,"beamI",{value:0});x(this,"beamMat",Po(16773328,this.beamI,!0));x(this,"beams",null)}start(){let e=this.g.real.amb;if(!e?.kit?.car?.[0])return!1;this.amb=e;let t=this.g.real.q.name,n=t==="low"?5:t==="med"?10:15,i=t==="low"?[0,1,2]:t==="med"?[0,1,2,4]:[0,1,2,3,4];for(this.stats.quality=t;e.cars.length<n;){let r=e.cars.length,o=i[r%i.length],a=this.paint.setHex(Lo[(r*5+3)%Lo.length]),c=e.carMesh(o,a);c.visible=!1,e.group.add(c),e.cars.push({g:c,v:o,rd:null,L:0,dir:1,s:0,sp:0})}e.nCar=n;for(let r=0;r<5;r++)this.batches.push({cars:[],parts:[]});for(let r=0;r<e.cars.length;r++){let o=e.cars[r],a=Math.max(0,Math.min(4,o.v|0)),c=e.kit.car[0][a].paint,u=new L(Lo[r%Lo.length]);for(let d of o.g.children){let f=d,p=f.material;if(f.isMesh&&f.geometry===c&&p.color){u=p.color.clone();break}}let h={car:o,base:o.g.children.slice(),color:u,batchIndex:this.batches[a].cars.length,rd:null,cruise:11,yieldPhase:0,yieldTime:0,yieldsAtEnd:!1};this.batches[a].cars.push(h),this.states.push(h),this.stateByCar.set(o,h);for(let d of h.base)d.visible=!1}for(let r=0;r<5;r++)this.makeBatch(r,e.kit.car[0][r]);let s=new Zt(4.4,16).rotateX(-Math.PI/2).rotateY(Math.PI).translate(0,.11,10);return this.beams=new q(s,this.beamMat,n),this.beams.name="aw:traffic:beams",this.beams.frustumCulled=!1,this.beams.instanceMatrix.setUsage(ht),this.beams.count=0,e.group.add(this.beams),this.stats.pooled=this.states.length,!0}makeBatch(e,t){let n=this.amb,i=this.batches[e],s=i.cars.length;if(s)for(let r of Object.keys(t)){let o=n.mats[r];if(!o)continue;let a=o.clone();r==="paint"&&a.color&&a.color.setHex(16777215);let c=new q(t[r],a,s);if(c.name=`aw:traffic:${e}:${r}`,c.frustumCulled=!1,c.castShadow=this.g.real.q.name!=="low"&&r==="paint",c.instanceMatrix.setUsage(ht),r==="paint"){for(let u=0;u<s;u++)c.setColorAt(u,i.cars[u].color);c.instanceColor&&(c.instanceColor.needsUpdate=!0)}i.parts.push({mesh:c,mat:a,name:r}),n.group.add(c),this.stats.batches++}}routeChanged(e){let t=e.car;if(e.rd=t.rd,e.cruise=t.v===4?9:11+(e.batchIndex*7+t.v*3)%4,e.yieldPhase=0,e.yieldTime=0,e.yieldsAtEnd=!1,!t.rd||t.rd.rb)return;let n=t.rd.p,i=t.dir>0?n[n.length-1]:n[0];e.yieldsAtEnd=this.amb.pick(i[0],i[1],uv,18).length>0}applyAI(e){let t=this.amb,n=this.g.S.mode,i=n==="walk"?this.g.S.walk:this.g.S.car,s=n!=="plane",r=0,o=0;for(let a=0;a<t.cars.length;a++){let c=t.cars[a],u=this.stateByCar.get(c);if(!u||(c.rd!==u.rd&&this.routeChanged(u),!c.rd))continue;let h=u.cruise;if(c.rd.rb&&(h=Math.min(h,6.5)),u.yieldsAtEnd&&u.yieldPhase<2){let f=c.dir>0?c.L-c.s:c.s;f<22&&(h=Math.min(h,Math.max(0,(f-4.5)*.75))),f<6&&u.yieldPhase===0&&(u.yieldPhase=1,u.yieldTime=.7+(u.batchIndex*13+c.v*5)%8*.1),u.yieldPhase===1&&(h=0,c.sp<.7&&(u.yieldTime-=e)<=0&&(u.yieldPhase=2)),r++}if(s){let f=c.g.position.x-i.x,p=c.g.position.z-i.z,m=f*f+p*p;m<324&&(h=Math.min(h,Math.max(0,(Math.sqrt(m)-5)*.8)),o++)}for(let f=0;f<t.cars.length;f++){if(a===f)continue;let p=t.cars[f];if(p.rd!==c.rd||p.dir!==c.dir)continue;let m=c.dir*(p.s-c.s);m>0&&m<20&&(h=Math.min(h,Math.max(0,(m-5)*.85)))}let d=h-c.sp;c.sp+=Math.max(-8*e,Math.min(2.4*e,d)),c.sp<.001&&(c.sp=.001)}this.stats.yielding=r,this.stats.avoiding=o}isSpecial(e){let t=!1;for(let n of e.car.g.children){if(n.name.startsWith("aw:ev"))return 2;(n.name==="aw:ebar"||n.name==="aw:estripe")&&n.visible&&(t=!0)}return t?1:0}renderInstances(){let e=0,t=0,n=Math.max(0,Math.min(1,(Ue.value-.3)/.4));this.beamI.value=.42*n;for(let i of this.batches){for(let s of i.cars){let r=s.car,o=this.isSpecial(s);for(let c of s.base)c.visible=o===1&&r.g.visible;let a=!!r.rd&&r.g.visible&&o===0;a?(this.matrix.compose(r.g.position,r.g.quaternion,r.g.scale),e++):this.matrix.copy(this.zero);for(let c of i.parts)c.mesh.setMatrixAt(s.batchIndex,this.matrix);a&&n>.001&&this.beams&&this.beams.setMatrixAt(t++,this.matrix)}for(let s of i.parts)s.mesh.instanceMatrix.needsUpdate=!0,s.name==="light"&&s.mat.emissive?(s.mat.emissive.copy(lv),s.mat.emissiveIntensity=1+n*5):s.name==="tail"&&s.mat.emissive&&(s.mat.emissive.copy(cv),s.mat.emissiveIntensity=1+n*3)}this.beams&&(this.beams.count=t,this.beams.visible=t>0,t&&(this.beams.instanceMatrix.needsUpdate=!0)),this.stats.visible=e,this.stats.beamDraws=t?1:0}update(e){if(!this.amb&&!this.start())return;let t=Math.min(.1,e);this.applyAI(t),this.renderInstances()}};var Vd=[15293275,4034507,15845451,5089640,15303603,15174469,7560626],Wd=[2503749,5588277,14275783,3361897,3224376],Xd=[7290667,9590843,12155220,13998706,15581854],hv=new w(1,0,0),No=class{constructor(e){x(this,"g",e);x(this,"stats",{pooled:0,visible:0,draws:0,triangles:0,corridors:0});x(this,"amb",null);x(this,"walkers",[]);x(this,"routes",[]);x(this,"group",new Me);x(this,"head");x(this,"torso");x(this,"legs");x(this,"arms");x(this,"meshes");x(this,"root",new O);x(this,"local",new O);x(this,"world",new O);x(this,"pos",new w);x(this,"scale",new w);x(this,"quat",new Y);x(this,"tint",new L);x(this,"scanIn",0);x(this,"lod2");let t=e.real.q.name,n=t==="low"?18:t==="med"?32:48,i=t==="low"?190:250;this.lod2=i*i,this.group.name="aw:pedestrians";let s=new ut({color:16777215}),r=new ut({color:16777215}),o=new ut({color:16777215});this.head=this.mesh(new Ge(1,6,4),s,n,"heads"),this.torso=this.mesh(new He(1,1,1),r,n,"torsos"),this.legs=this.mesh(new He(1,1,1),o,n*2,"legs"),this.arms=this.mesh(new He(1,1,1),s,n*2,"arms"),this.meshes=[this.head,this.torso,this.legs,this.arms],this.group.add(this.head,this.torso,this.legs,this.arms),e.scene.add(this.group);for(let a=0;a<n;a++)this.walkers.push({road:null,length:0,s:0,dir:a&1?1:-1,side:a&2?1:-1,speed:1.05+a%6*.09,phase:a*2.399963%(Math.PI*2),x:0,y:0,z:0,yaw:0,skin:Xd[a*3%Xd.length],top:Vd[a*5%Vd.length],bottom:Wd[a*7%Wd.length]});this.stats.pooled=n}mesh(e,t,n,i){let s=new q(e,t,n);return s.name=`aw:pedestrians:${i}`,s.instanceMatrix.setUsage(ht),s.frustumCulled=!1,s.castShadow=this.g.real.q.name!=="low",s.count=0,s}roadLength(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}inCorridor(e){let t=e.n==="Caya G.F. Betico Croes",n=e.n==="J.E. Irausquin Boulevard";if(!t&&!n)return!1;for(let i=0;i<e.p.length;i++){let s=e.p[i][0],r=e.p[i][1];if(t&&s>-7550&&s<-6450&&Math.abs(r)<350)return!0;let o=s+8220,a=r+5750;if(n&&o*o+a*a<1450*1450)return!0}return!1}scanRoutes(){let e=this.amb;this.routes=[];let t=new Set;for(let n of e.w.regions.values()){let i=n.json?.roads;if(i)for(let s of i){let r=`${s.n}:${s.id}`;s.u||s.p.length<2||t.has(r)||!this.inCorridor(s)||(t.add(r),this.routes.push(s))}}if(this.stats.corridors=this.routes.length,!!this.routes.length)for(let n=0;n<this.walkers.length;n++){let i=this.walkers[n];if(i.road&&this.routes.includes(i.road))continue;let s=this.routes[n%this.routes.length];i.road=s,i.length=this.roadLength(s),i.s=i.length*(n*.61803398875%1*.9+.05),i.side=(n&1?1:-1)*(s.w*.5+1.45)}}sample(e){let t=e.road;if(!t)return!1;let n=0;for(let i=1;i<t.p.length;i++){let s=t.p[i-1][0],r=t.p[i-1][1],o=t.p[i][0]-s,a=t.p[i][1]-r,c=Math.hypot(o,a)||1;if(n+c>=e.s||i===t.p.length-1){let u=Math.max(0,Math.min(1,(e.s-n)/c)),h=o/c,d=a/c;return e.x=s+o*u-d*e.side,e.z=r+a*u+h*e.side,e.y=this.amb.w.surfaceAt(e.x,e.z)+.02,e.yaw=e.dir>0?Math.atan2(h,d):Math.atan2(-h,-d),!0}n+=c}return!1}put(e,t,n,i,s,r,o,a,c){this.pos.set(n,i,s),this.quat.setFromAxisAngle(hv,r),this.scale.set(o,a,c),this.local.compose(this.pos,this.quat,this.scale),this.world.multiplyMatrices(this.root,this.local),e.setMatrixAt(t,this.world)}drawWalker(e,t,n){let i=Math.sin(n*7.2+e.phase),s=Math.abs(i)*.025;this.root.makeRotationY(e.yaw),this.root.setPosition(e.x,e.y+s,e.z),this.put(this.head,t,0,1.77,0,0,.18,.2,.18),this.put(this.torso,t,0,1.29,0,0,.34,.52,.22),this.put(this.legs,t*2,-.14,.64,i*.08,i*.45,.11,.62,.13),this.put(this.legs,t*2+1,.14,.64,-i*.08,-i*.45,.11,.62,.13),this.put(this.arms,t*2,-.43,1.26,0,-i*.5,.08,.48,.09),this.put(this.arms,t*2+1,.43,1.26,0,i*.5,.08,.48,.09),this.head.setColorAt(t,this.tint.setHex(e.skin)),this.torso.setColorAt(t,this.tint.setHex(e.top)),this.legs.setColorAt(t*2,this.tint.setHex(e.bottom)),this.legs.setColorAt(t*2+1,this.tint),this.arms.setColorAt(t*2,this.tint.setHex(e.skin)),this.arms.setColorAt(t*2+1,this.tint)}update(e,t){if(!this.amb){let s=this.g.real.amb;if(!s)return;this.amb=s,this.scanRoutes()}for(;this.amb.peds.length;){let s=this.amb.peds.pop();s.g.visible=!1,s.g.parent?.remove(s.g)}(this.scanIn-=e)<=0&&(this.scanIn=2,this.scanRoutes());let n=this.g.camera.position,i=0;for(let s of this.walkers){if(!s.road||s.length<=0||(s.s+=s.dir*s.speed*e,s.s>=s.length?(s.s=s.length,s.dir=-1):s.s<=0&&(s.s=0,s.dir=1),!this.sample(s)))continue;let r=s.x-n.x,o=s.z-n.z;r*r+o*o>this.lod2||this.drawWalker(s,i++,t)}this.head.count=i,this.torso.count=i,this.legs.count=i*2,this.arms.count=i*2;for(let s of this.meshes)s.count&&(s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0)),s.visible=s.count>0;this.stats.visible=i,this.stats.draws=i?4:0,this.stats.triangles=i*96}};var Oo={up:[10,18,27,37,48],down:[0,7,14,22,31],idle:820,red:6400,launch:2e3},Fo={up:[11,20,30,39,48,55],down:[0,8,16,25,34,43],idle:1400,red:12400,launch:3400};function Uo(l){return l==="car"?32:50}function wc(l,e){return Math.max(8,Math.floor(l*2/Uo(e)))}function Sc(l,e,t,n,i,s){let r=e<0?-e:e,o=l.gear,a=0,c=i.up.length-1;o<c&&r>i.up[o]?(o+=1,a=1):o>0&&r<i.down[o]&&(o-=1,a=-1),l.gear=o;let u=i.down[o],d=i.up[o]-u||1,f=(r-u)/d;f<0?f=0:f>1&&(f=1);let p=i.idle+f*(i.red-i.idle);if(p+=t*(1-f*.65)*(i.red-i.idle)*.2,r<.8){let b=Math.sin(s*3.1)*12+Math.sin(s*5.4)*7;p=i.idle+t*i.launch+(t<.12?b:0)}f>.96&&t>.75&&(p-=Math.abs(Math.sin(s*46))*(i.red*.018)),p>i.red&&(p=i.red),p<i.idle*.92&&(p=i.idle*.92),a===1?l.rpm*=.68:a===-1&&(l.rpm=Math.min(i.red,l.rpm*1.18+180)),l.shift=a!==0?.16:l.shift>n?l.shift-n:0;let m=l.shift>0?15:t>.4?8.5:3.4,g=n>0?1-Math.exp(-m*n):0;return l.rpm+=(p-l.rpm)*g,a}function dv(l){return l%=1,l<0?l+1:l}function Wi(l,e,t){let n=dv(l-e);n>.5&&(n=1-n);let i=t*.2;return n<i?i>0?n/i:1:Math.exp(-(n-i)/t)}function fv(l,e){let t=e?.032:.068,n=Wi(l,0,t),i=Wi(l,.5,t*1.08),s=l*Math.PI*2,r=e?1:0,o=Math.sin(s)*.2+Math.sin(s*2)*.3+Math.sin(s*3)*(.05+r*.12)+Math.sin(s*4)*(.045+r*.1)+Math.sin(s*5)*r*.06+Math.sin(s*6)*r*.04;return Math.tanh(((n+i*.9)*(e?.82:.68)+o)*1.12)}function pv(l,e){let t=e?.02:.038,n=Wi(l,.02,t),i=Wi(l,.16,t*.92),s=Wi(l,.56,t*1.15)*.7,r=Wi(l,.71,t)*.58,o=l*Math.PI*2,a=e?1:0,c=Math.sin(o)*.14+Math.sin(o*2)*.2+Math.sin(o*3+.45)*(.06+a*.12)+Math.sin(o*4.5)*(.025+a*.08)+Math.sin(o*6)*a*.05+Math.sin(o*8)*a*.028;return Math.tanh(((n+i+s+r)*(e?.78:.64)+c)*1.2)}function qd(l,e,t,n){let i=n.length,s=t?e==="car"?2500:3e3:e==="car"?820:980,r=1-Math.exp(-2*Math.PI*s/l),o=0,a=0,c=0,u=0,h=0;for(let f=0;f<2;f++)for(let p=0;p<i;p++){let m=p/i*2%1,g=e==="car"?fv(m,t):pv(m,t);if(o+=(g-o)*r,a+=(o-a)*r,c+=(a-c)*r,u+=(c-u)*r,f===1){n[p]=u;let b=u<0?-u:u;b>h&&(h=b)}}let d=h>1e-5?.56/h:0;for(let f=0;f<i;f++)n[f]*=d}var mv=.5,Yd=180,Bo=class{constructor(e){x(this,"g",e);x(this,"stats",{started:!1,muted:!1,mode:"car",trafficVoices:0,nodes:0,gear:0,rpm:0,throttle:0,police:0,ambulance:0,impacts:0,turbo:0,level:0});x(this,"audio",null);x(this,"muted",!1);x(this,"quick");x(this,"setting",null);x(this,"keyFwd",!1);x(this,"keyBrk",!1);x(this,"prevT",0);x(this,"prevWall",0);x(this,"arm",.4);x(this,"masterLin",0);x(this,"carDrive",{gear:0,rpm:Oo.idle,shift:0});x(this,"motoDrive",{gear:0,rpm:Fo.idle,shift:0});x(this,"carThr",0);x(this,"motoThr",0);x(this,"overrun",0);x(this,"prevPhase",-1);x(this,"turboWas",!1);x(this,"turboLin",0);x(this,"policeLin",0);x(this,"ambLin",0);x(this,"crashRoot",null);x(this,"waveBase",.012);x(this,"heardMode","");x(this,"policeD",-1);x(this,"policeX",0);x(this,"policeZ",0);x(this,"ambD",-1);x(this,"ambX",0);x(this,"ambZ",0);x(this,"speed",0);x(this,"wx",0);x(this,"wz",0);try{this.muted=localStorage.getItem("aw_muted")==="1"}catch{}this.stats.muted=this.muted,this.quick=document.createElement("button"),this.quick.id="awmutebtn",this.quick.type="button",this.quick.setAttribute("aria-label","Mute game audio");let t=document.createElement("style");t.textContent="#awmutebtn{position:fixed;z-index:50;left:12px;top:calc(96px + env(safe-area-inset-top));width:42px;height:42px;border:2px solid #ffffff73;border-radius:50%;background:#0009;color:#fff;font:20px system-ui;display:grid;place-items:center;padding:0}",document.head.appendChild(t),this.quick.onclick=n=>{n.stopPropagation(),this.toggle()},document.body.appendChild(this.quick),this.syncButtons(),this.mountSetting(0),this.mountCredit(0),addEventListener("pointerdown",()=>{this.muted||this.start()},{once:!0}),addEventListener("keydown",n=>this.onKey(n,!0)),addEventListener("keyup",n=>this.onKey(n,!1)),addEventListener("blur",()=>{this.keyFwd=!1,this.keyBrk=!1})}onKey(e,t){if(e.target instanceof HTMLInputElement)return;let n=e.code==="KeyW"||e.code==="ArrowUp",i=e.code==="Space"||e.code==="KeyS"||e.code==="ArrowDown";n&&(this.keyFwd=t),i&&(this.keyBrk=t),t&&!this.muted&&this.start()}throttle(){let e=this.g.held,t=this.g.joy;if(e?.brake||this.keyBrk)return 0;let n=e?.gas||this.keyFwd?1:0,i=t?.y||0,s=i<0?i<-1?1:-i:0;return s>n?s:n}write(e,t,n,i){return Math.abs(t-n)<i?t:(e.value=n,n)}approach(e,t,n,i){return n<=0?e:e+(t-e)*(1-Math.exp(-i*n))}noiseBuffer(e){let t=Math.floor(e.sampleRate*2),n=e.createBuffer(1,t,e.sampleRate),i=n.getChannelData(0),s=305419896;for(let r=0;r<t;r++)s=Math.imul(s,1664525)+1013904223|0,i[r]=((s>>>8)/8388607-1)*.7;return n}cycleBuffer(e,t,n,i){let s=wc(e.sampleRate,t),r=e.createBuffer(1,s,e.sampleRate);return qd(e.sampleRate,t,n,i.subarray(0,s)),r.getChannelData(0).set(i.subarray(0,s)),r}loop(e,t){let n=e.createBufferSource();return n.buffer=t,n.loop=!0,n.start(),n}tone(e,t,n){let i=e.createOscillator(),s=e.createGain();return i.type=t,i.frequency.value=n,s.gain.value=0,i.connect(s),i.start(),{osc:i,gain:s,hz:n,amp:0}}tap(e,t,n,i){let s=e.createBiquadFilter(),r=e.createGain();return s.type=n,s.frequency.value=i,s.Q.value=.7,r.gain.value=0,t.connect(s),s.connect(r),{filter:s,gain:r,f:i,amp:0}}voice(e,t,n,i,s){let r=this.loop(e,this.cycleBuffer(e,n,!1,i)),o=this.loop(e,this.cycleBuffer(e,n,!0,i)),a=e.createOscillator();a.type="sine",a.frequency.value=40,a.start();let c=e.createGain(),u=e.createGain(),h=e.createGain(),d=e.createBiquadFilter(),f=e.createGain();c.gain.value=.7,u.gain.value=0,h.gain.value=0,f.gain.value=0,d.type="lowpass",d.frequency.value=500,d.Q.value=.45,r.connect(c).connect(d),o.connect(u).connect(d),d.connect(s).connect(f),a.connect(h).connect(f);let p=this.tap(e,t,"bandpass",240);p.gain.connect(f);let m=(Uo(n)>0,1);return r.playbackRate.value=m,o.playbackRate.value=m,{body:r,edge:o,sub:a,bodyGain:c,edgeGain:u,subGain:h,noiseFilter:p.filter,noiseGain:p.gain,filter:d,out:f,rate:m,bg:.7,eg:0,sg:0,ng:0,nf:240,ff:500,og:0,hz:40,level:0}}shape(e){let t=e.createWaveShaper(),n=new Float32Array(256),i=1.25,s=Math.tanh(i);for(let r=0;r<256;r++){let o=r/255*2-1;n[r]=Math.tanh(o*i)/s}return t.curve=n,t.oversample="none",t}start(){if(this.audio){this.audio.ctx.resume();return}try{let e=new AudioContext,t=e.createGain(),n=e.createDynamicsCompressor();n.threshold.value=-16,n.knee.value=18,n.ratio.value=3.5,n.attack.value=.012,n.release.value=.28,t.gain.value=0,t.connect(n).connect(e.destination);let i=this.loop(e,this.noiseBuffer(e)),s=new Float32Array(wc(e.sampleRate,"car")),r=this.voice(e,i,"car",s,this.shape(e)),o=this.voice(e,i,"moto",s,this.shape(e));r.out.connect(t),o.out.connect(t);let a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=160;let c=e.createGain();c.gain.value=0,i.connect(a).connect(c).connect(t);let u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=640,u.Q.value=.5;let h=e.createGain();h.gain.value=0;let d=e.createGain();d.gain.value=0;let f=this.tone(e,"sine",78);i.connect(u).connect(h).connect(d),f.gain.connect(d),d.connect(t);let p=this.tap(e,i,"lowpass",180);p.filter.Q.value=.4,p.gain.connect(t);let m=this.tap(e,i,"bandpass",1100);m.filter.Q.value=.8,m.gain.connect(t);let g=this.tone(e,"sine",38),b=this.tone(e,"sine",55);g.gain.connect(t),b.gain.connect(t);let v=e.createBiquadFilter();v.type="bandpass",v.frequency.value=300,v.Q.value=.65;let M=e.createGain();M.gain.value=0,i.connect(v).connect(M).connect(t);let _=e.createStereoPanner(),A=e.createGain();A.gain.value=0;let E=e.createBiquadFilter();E.type="lowpass",E.frequency.value=1700,E.Q.value=.5;let C=this.tone(e,"sine",700),T=this.tone(e,"sine",1050);C.gain.connect(E),T.gain.connect(E),E.connect(_).connect(A).connect(t);let R=e.createStereoPanner(),I=e.createGain();I.gain.value=0;let P=e.createBiquadFilter();P.type="lowpass",P.frequency.value=1600,P.Q.value=.5;let D=this.tone(e,"sine",680),N=this.tone(e,"sine",940);D.gain.connect(P),N.gain.connect(P),P.connect(R).connect(I).connect(t);let F=e.createOscillator();F.type="sine",F.frequency.value=80;let z=e.createGain();z.gain.value=0,F.connect(z).connect(t),F.start();let W=this.tap(e,i,"lowpass",420);W.filter.Q.value=.4,W.gain.connect(t);let J=this.tap(e,i,"bandpass",1500);J.filter.Q.value=.6,J.gain.connect(t);let j=this.tap(e,i,"bandpass",1600);j.gain.connect(t);let ee=this.tap(e,i,"lowpass",680);ee.gain.connect(t);let Q=this.tap(e,i,"bandpass",1e3);Q.gain.connect(t);let se=e.createOscillator(),me=e.createGain();se.frequency.value=.12,me.gain.value=.004,se.connect(me).connect(ee.gain.gain),se.start(),this.audio={ctx:e,master:t,noise:i,car:r,moto:o,clunk:c,planeFilter:u,planeNoise:h,planeTone:f,planeOut:d,roar:p,crackle:m,sub:g,sub2:b,whooshFilter:v,whoosh:M,police:C,police2:T,policePan:_,policeOut:A,amb:D,amb2:N,ambPan:R,ambOut:I,thump:F,thumpGain:z,crunch:W,metal:J,skid:j,waves:ee,city:Q},this.stats.started=!0,this.stats.nodes=48,this.stats.trafficVoices=0,e.resume()}catch(e){console.warn("[aw-audio] WebAudio unavailable",e)}}toggle(){this.muted=!this.muted,this.stats.muted=this.muted;try{localStorage.setItem("aw_muted",this.muted?"1":"0")}catch{}this.muted||this.start(),this.syncButtons()}syncButtons(){this.quick.textContent=this.muted?"\u{1F507}":"\u{1F50A}",this.quick.title=this.muted?"Unmute audio":"Mute audio",this.setting&&(this.setting.textContent=this.muted?"Sound: OFF":"Sound: ON")}mountSetting(e){let t=document.getElementById("awtime");if(!t){e<60&&setTimeout(()=>this.mountSetting(e+1),500);return}let n=document.createElement("div");n.className="lbl",n.textContent="World audio";let i=document.createElement("div");i.className="row";let s=document.createElement("button");s.type="button",s.onclick=()=>this.toggle(),i.appendChild(s),t.append(n,i),this.setting=s,this.syncButtons()}mountCredit(e){let t=document.querySelector("#credits ul");if(!t){e<40&&setTimeout(()=>this.mountCredit(e+1),500);return}if(t.querySelector(".aw-audio"))return;let n=document.createElement("li");n.className="aw-audio",n.innerHTML='Engines, sirens, crash impact and turbo: original procedural synthesis (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 1.0</a>, no third-party samples)',t.appendChild(n)}clunkAt(e){let t=this.audio;if(!t)return;let n=t.clunk.gain;n.cancelScheduledValues(e),n.setValueAtTime(1e-4,e),n.exponentialRampToValueAtTime(.04,e+.01),n.exponentialRampToValueAtTime(1e-4,e+.07)}boom(e,t){let n=this.audio;if(!n)return;let i=t>420?0:1-t/420,s=i*i;if(s<.05)return;let r=n.thump.frequency,o=n.thumpGain.gain;r.cancelScheduledValues(e),r.setValueAtTime(130,e),r.exponentialRampToValueAtTime(34,e+.34),o.cancelScheduledValues(e),o.setValueAtTime(1e-4,e),o.exponentialRampToValueAtTime(.15*s,e+.016),o.exponentialRampToValueAtTime(1e-4,e+.48);let a=n.crunch.gain.gain;a.cancelScheduledValues(e),a.setValueAtTime(1e-4,e),a.exponentialRampToValueAtTime(.08*s,e+.012),a.exponentialRampToValueAtTime(1e-4,e+.4);let c=n.metal.gain.gain;c.cancelScheduledValues(e),c.setValueAtTime(1e-4,e),c.exponentialRampToValueAtTime(.03*s,e+.008),c.exponentialRampToValueAtTime(1e-4,e+.13),this.stats.impacts+=1}whoosh(e){let t=this.audio;if(!t)return;let n=t.whooshFilter.frequency,i=t.whoosh.gain;n.cancelScheduledValues(e),n.setValueAtTime(150,e),n.exponentialRampToValueAtTime(1700,e+.38),n.exponentialRampToValueAtTime(380,e+.85),i.cancelScheduledValues(e),i.setValueAtTime(1e-4,e),i.exponentialRampToValueAtTime(.05,e+.07),i.exponentialRampToValueAtTime(1e-4,e+.9)}silence(e,t){e.level=this.approach(e.level,0,t,10),e.og=this.write(e.out.gain,e.og,e.level,.003),e.eg=this.write(e.edgeGain.gain,e.eg,this.approach(e.eg,0,t,8),.005),e.ng=this.write(e.noiseGain.gain,e.ng,this.approach(e.ng,0,t,8),.003)}snap(e,t,n){for(let i=0;i<8;i++)Sc(e,this.speed,0,.08,t,n);e.shift=0}engine(e,t,n,i,s,r,o){let a=Sc(n,this.speed,s,o,i,r);this.arm<=0&&a===1&&this.clunkAt(r);let c=n.rpm/60/Uo(e);n.rpm<i.idle*1.25&&s<.15&&(c*=1+.012*Math.sin(r*2.6)+.007*Math.sin(r*5.2)),c<.1?c=.1:c>6&&(c=6),Math.abs(t.rate-c)>=.004&&(t.body.playbackRate.value=c,t.edge.playbackRate.value=c,t.rate=c);let u=(n.rpm-i.idle)/(i.red-i.idle),h=u<0?0:u>1?1:u,d=e==="moto"?2300:1850,f=(e==="moto"?480:400)+h*(e==="moto"?1100:800)+s*(e==="moto"?700:550);f>d&&(f=d),t.ff=this.write(t.filter.frequency,t.ff,f,8);let p=n.rpm/30;t.hz=this.write(t.sub.frequency,t.hz,p<28?28:p,.6),t.bg=this.write(t.bodyGain.gain,t.bg,.62,.01),t.eg=this.write(t.edgeGain.gain,t.eg,s*.42+h*s*.16,.008),t.sg=this.write(t.subGain.gain,t.sg,.05+h*.04+s*.02,.004);let m=.008+s*.02+h*.006;if(e==="moto"&&this.overrun>0){let v=Math.sin(r*53)*Math.sin(r*19);m+=(v>0?v*v*v*v:0)*.03*(this.overrun>.25?1:this.overrun*4)}t.ng=this.write(t.noiseGain.gain,t.ng,m,.002),t.nf=this.write(t.noiseFilter.frequency,t.nf,160+h*640+s*380,12);let g=.15+s*.07+h*.035;n.shift>.1&&(g*=.74);let b=e==="moto"?.24:.26;return g>b&&(g=b),t.level=this.approach(t.level,g,o,9),t.og=this.write(t.out.gain,t.og,t.level,.003),t.level}responders(e,t,n,i,s,r){if(this.policeD=-1,this.ambD=-1,n&&i>=1){let o=this.g.real?.amb,a=o?.group?.children;if(a){let c=this.crashRoot;if(!c||c.parent==null){c=null;for(let h=0;h<a.length;h++)a[h].name==="aw:crash"&&(c=a[h]);this.crashRoot=c}if(c){let h=c.children;for(let d=0;d<h.length;d++){let f=h[d].name;if(f==="aw:ev:everest"||f==="aw:ev:isuzu"){this.place(h[d]),this.policeX=this.wx,this.policeZ=this.wz,this.policeD=Math.hypot(this.policeX-e,this.policeZ-t);break}}}if(this.policeD<0){let h=window.__aw?.emerg?.ext;h&&(this.policeD=h.d,this.policeX=e,this.policeZ=t)}let u=o?.cars;if(u){let h=1e9,d=Math.hypot(s-e,r-t)<420;for(let f=0;f<u.length;f++){let p=u[f];if(!p.g.visible)continue;let m=p.g.children,g=!1;for(let A=0;A<m.length;A++){let E=m[A].name;if(E==="aw:ev:ambY"||E==="aw:ev:ambP"){g=!0;break}}if(!g)continue;this.place(p.g);let b=this.wx,v=this.wz,M=Math.hypot(b-s,v-r),_=Math.hypot(b-e,v-t);M>260&&!(d&&_<130)||_<h&&(h=_,this.ambX=b,this.ambZ=v,this.ambD=_)}}}}else this.crashRoot=null}place(e){let t=0,n=0,i=e;for(;i;)t+=i.position.x,n+=i.position.z,i=i.parent;this.wx=t,this.wz=n}atten(e){if(e<0||e>Yd)return 0;let t=1-e/Yd;return t*t*.04}update(){let e=this.audio;if(!e)return;let t=e.ctx.currentTime,n=performance.now()*.001,i=this.prevT>0?t-this.prevT:0,s=this.prevWall>0?n-this.prevWall:.016;this.prevT=t,this.prevWall=n;let r=i>s?i:s;if(r>0||(r=.016),r>.05&&(r=.05),r<0)return;this.arm>0&&(this.arm=this.arm>r?this.arm-r:0);let o=this.g.S,a=o.mode;this.stats.mode=a,this.speed=Math.abs(o.car.s||0);let c=a==="car"||a==="moto"?this.throttle():0,u=c>(a==="moto"?this.motoThr:this.carThr);a==="moto"?this.motoThr=this.approach(this.motoThr,c,r,u?14:5):a==="car"&&(this.carThr=this.approach(this.carThr,c,r,u?12:4.5)),a==="moto"&&this.motoThr<.08&&this.motoDrive.rpm>5600?this.overrun=.38:this.overrun=this.overrun>r?this.overrun-r:0,a!==this.heardMode&&(this.heardMode=a,a==="car"?this.snap(this.carDrive,Oo,t):a==="moto"&&this.snap(this.motoDrive,Fo,t));let h=a==="car"?this.engine("car",e.car,this.carDrive,Oo,this.carThr,t,r):(this.silence(e.car,r),0),d=a==="moto"?this.engine("moto",e.moto,this.motoDrive,Fo,this.motoThr,t,r):(this.silence(e.moto,r),0),f=a==="moto"?this.motoDrive:this.carDrive,p=a==="moto"?this.motoThr:this.carThr;this.stats.gear=a==="car"||a==="moto"?f.gear+1:0,this.stats.rpm=a==="car"||a==="moto"?f.rpm:0,this.stats.throttle=a==="car"||a==="moto"?p:0,this.stats.level=a==="moto"?d:a==="car"?h:0;let g=!!(this.g.held?.brake||this.keyBrk),b=Math.abs(o.car.drift||0),M=(a==="moto"?b:a==="car"&&g?Math.min(1,this.speed/20):0)*(a==="moto"?.035:.025);e.skid.amp=this.write(e.skid.gain.gain,e.skid.amp,M,.002);let _=Math.abs(o.plane.s||0),A=o.plane.thr||0,E=a==="plane",C=window,T=!!(C.__awTurbo&&E),R=E?C.__awTurboLvl||(T?1:0):0;this.turboLin=this.approach(this.turboLin,R,r,T?6:3),this.turboLin<.004&&!T&&(this.turboLin=0),T&&!this.turboWas&&this.whoosh(t),this.turboWas=T,this.stats.turbo=this.turboLin;let I=1-this.turboLin*.72,P=E?(.045+A*.03)*(I<.28?.28:I):0;e.planeOut.gain.value=P,e.planeNoise.gain.value=E?.55:0,e.planeFilter.frequency.value=520+A*700,e.planeTone.hz=this.write(e.planeTone.osc.frequency,e.planeTone.hz,72+A*46+_*.15,.5),e.planeTone.amp=this.write(e.planeTone.gain.gain,e.planeTone.amp,E?.22:0,.01);let D=this.turboLin;e.roar.amp=this.write(e.roar.gain.gain,e.roar.amp,D*.055,.002),e.roar.f=this.write(e.roar.filter.frequency,e.roar.f,150+D*160,4),e.sub.hz=this.write(e.sub.osc.frequency,e.sub.hz,32+D*18,.3),e.sub2.hz=this.write(e.sub2.osc.frequency,e.sub2.hz,47+D*12,.3),e.sub.amp=this.write(e.sub.gain.gain,e.sub.amp,D*.034,.002),e.sub2.amp=this.write(e.sub2.gain.gain,e.sub2.amp,D*.016,.001);let N=Math.sin(t*37)*Math.sin(t*17.5),F=N>0?N*N:0;e.crackle.amp=this.write(e.crackle.gain.gain,e.crackle.amp,D*(.006+F*.016),.001);let W=window.__aw?.crash?.stats,J=W?.phase??0,j=this.g.camera.position;if(this.prevPhase===0&&J>=1){let fe=(W?.x||j.x)-j.x,Ne=(W?.z||j.z)-j.z;this.boom(t,Math.hypot(fe,Ne))}this.prevPhase=J,this.responders(j.x,j.z,!!W?.active,J,W?.x||0,W?.z||0);let ee=this.policeD>=0&&this.ambD>=0?.82:1;if(this.policeLin=this.approach(this.policeLin,this.atten(this.policeD)*ee,r,5),this.ambLin=this.approach(this.ambLin,this.atten(this.ambD)*ee,r,5),e.policeOut.gain.value=this.policeLin,e.ambOut.gain.value=this.ambLin,this.stats.police=this.policeLin,this.stats.ambulance=this.ambLin,this.policeLin>.004&&this.policeD>=0){let fe=.5+.5*Math.sin(t*1.55),Ne=560+640*fe*fe*(3-2*fe);e.police.hz=this.write(e.police.osc.frequency,e.police.hz,Ne,1),e.police2.hz=this.write(e.police2.osc.frequency,e.police2.hz,Ne*1.5,1),e.police.amp=this.write(e.police.gain.gain,e.police.amp,.72,.02),e.police2.amp=this.write(e.police2.gain.gain,e.police2.amp,.22,.02);let be=(this.policeX-j.x)/70;e.policePan.pan.value=be<-.75?-.75:be>.75?.75:be}if(this.ambLin>.004&&this.ambD>=0){let fe=.5+.5*Math.sin(t*7.4);e.amb.hz=this.write(e.amb.osc.frequency,e.amb.hz,660,1),e.amb2.hz=this.write(e.amb2.osc.frequency,e.amb2.hz,960,1),e.amb.amp=this.write(e.amb.gain.gain,e.amb.amp,.3+.7*(1-fe),.02),e.amb2.amp=this.write(e.amb2.gain.gain,e.amb2.amp,.3+.7*fe,.02);let Ne=(this.ambX-j.x)/70;e.ambPan.pan.value=Ne<-.75?-.75:Ne>.75?.75:Ne}let Q=a==="walk"?o.walk:a==="plane"?o.plane:o.car,se=Math.hypot(Q.x+8220,Q.z+5750),me=Math.hypot(Q.x+7150,Q.z),we=Math.max(0,1-se/1900),pe=Math.max(Math.max(0,1-me/1900),we*.45);this.waveBase=this.approach(this.waveBase,.012+we*.022,r,1.2),e.waves.amp=this.write(e.waves.gain.gain,e.waves.amp,this.waveBase,.001),e.city.amp=this.write(e.city.gain.gain,e.city.amp,pe*.016,.001);let ze=this.muted||document.hidden?0:mv;this.masterLin=this.approach(this.masterLin,ze,r>0?r:.016,8),Math.abs(e.master.gain.value-this.masterLin)>.002&&(e.master.gain.value=this.masterLin)}};var gv=[["Sunrise",6.75],["Noon",12.5],["Sunset",18.25],["Night",21.5]];function Zd(l,e){let t=document.createElement("style");t.textContent=`
  /* A's live build ships no CSS for its Settings sheet (it renders unstyled behind the canvas); style it like #credits */
  #settings{z-index:40;color:#fff;position:fixed;left:50%;top:calc(100px + env(safe-area-inset-top));transform:translate(-50%);
    width:min(92vw,360px);max-height:calc(100vh - 130px);overflow:auto;padding:14px 16px;border-radius:16px;background:#000000c4;
    font:14px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px #0006}
  #settings.hidden{display:none}
  #settings h3{margin:0 0 8px}
  #settings .lbl{opacity:.75;font-size:12px;margin:8px 0 4px;text-transform:uppercase;letter-spacing:.04em}
  #settings .tabs{display:flex;gap:6px}
  #settings button{color:#fff;background:#ffffff1f;border:2px solid #ffffff59;border-radius:12px;min-height:34px;padding:0 10px;font-weight:700;font-size:13px}
  #settings .tabs button{flex:1}
  #settings .tabs button.on{background:#ffd27a;color:#222;border-color:#ffd27a}
  #settings .hint{opacity:.7;font-size:12px;margin:6px 0}
  #settings #streset,#settings #stclose{margin:10px 6px 0 0}
  #awtime{margin-top:10px}
  #awtime .tabs button.on{outline:2px solid #ffd27a}
  #awtime .row{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
  #awtime .row button{flex:1 1 auto}
  #awfps{font-size:12px;opacity:.8;margin-top:4px}`,document.head.appendChild(t);let n=0,i=()=>{let s=document.getElementById("settings");if(!s){n++<40&&setTimeout(i,250);return}let r=document.createElement("div");r.id="awtime",r.innerHTML=`<div class="lbl">Time of day</div>
      <div class="row">${gv.map(([h,d])=>`<button data-h="${d}">${h}</button>`).join("")}</div>
      <div class="row"><button id="awfreeze"></button></div>
      <div class="lbl">Auto FPS guard</div>
      <div class="row"><button id="awguard"></button></div><div id="awfps"></div>`;let o=document.getElementById("streset");s.insertBefore(r,o),r.querySelectorAll("[data-h]").forEach(h=>h.addEventListener("click",()=>l.setHour(+h.dataset.h)));let a=r.querySelector("#awfreeze"),c=r.querySelector("#awguard");a.addEventListener("click",()=>l.setFrozen(!l.frozen)),c.addEventListener("click",()=>e.setEnabled(!e.enabled));let u=()=>{a.textContent=l.frozen?"\u25B6 Resume clock":"\u23F8 Freeze clock",c.textContent=e.enabled?"On (tap to turn off)":"Off (tap to turn on)"};l.onChange(u),e.onChange(u),u()};return i(),()=>{let s=document.getElementById("awfps");s&&(s.textContent=e.describe())}}var Xi=class{constructor(e,t,n,i){x(this,"geo",e);x(this,"mat",t);x(this,"o",n);x(this,"parent",i);x(this,"im",null);x(this,"cap",0);x(this,"srcs",new Set)}get size(){return this.srcs.size}add(e){this.srcs.add(e);let t=0;for(let n of this.srcs)t+=n.n;t>this.cap&&this.grow(t)}remove(e){this.srcs.delete(e)}grow(e){let t=256;for(;t<e;)t*=2;let n=this.im,i=new q(this.geo,this.mat,0);i.instanceMatrix=new Ye(new Float32Array(t*16),16),i.name=this.o.name,i.castShadow=this.o.castShadow,i.receiveShadow=this.o.receiveShadow,i.frustumCulled=!1,i.matrixAutoUpdate=!1,i.count=0,i.visible=!1,this.o.colored&&(i.instanceColor=new Ye(new Float32Array(t*3),3)),n&&(i.count=n.count,i.visible=n.visible,i.instanceMatrix.array.set(n.instanceMatrix.array.subarray(0,n.count*16)),n.instanceColor&&i.instanceColor&&i.instanceColor.array.set(n.instanceColor.array.subarray(0,n.count*3)),n.removeFromParent(),n.dispose()),this.parent.add(i),this.im=i,this.cap=t}fill(e,t,n,i){let s=this.im;if(!s)return 0;let r=n<0?-1:n*n,o=i*i,a=s.instanceMatrix.array,c=s.instanceColor?s.instanceColor.array:null,u=0;for(let h of this.srcs){let d=Math.max(h.box[0]-e,0,e-h.box[2]),f=Math.max(h.box[1]-t,0,t-h.box[3]);if(d*d+f*f>=o)continue;let p=h.mats,m=h.cols;for(let g=0;g<h.n;g++){let b=h.cx[g]-e,v=h.cz[g]-t,M=b*b+v*v;if(M>=o||M<r)continue;let _=g*16,A=u*16;for(let E=0;E<16;E++)a[A+E]=p[_+E];c&&m&&(c[u*3]=m[g*3],c[u*3+1]=m[g*3+1],c[u*3+2]=m[g*3+2]),u++}}return s.count=u,s.visible=u>0,u>0&&(s.instanceMatrix.clearUpdateRanges(),s.instanceMatrix.addUpdateRange(0,u*16),s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.clearUpdateRanges(),s.instanceColor.addUpdateRange(0,u*3),s.instanceColor.needsUpdate=!0)),u}dispose(){this.im&&(this.im.removeFromParent(),this.im.dispose(),this.im=null),this.cap=0}};var xv=new Set(["bld:kit","parked","parkedHi","props"]),zo=class{constructor(e,t=null){x(this,"q",e);x(this,"poolParent",t);x(this,"folded",0);x(this,"buckets",0);x(this,"lastX",1e9);x(this,"lastZ",1e9);x(this,"dirty",new Set);x(this,"pools",new Map);x(this,"dirtyPools",new Set);x(this,"job",null);x(this,"live",new Set)}fold(e,t=1e9){if(e.__awInst||e.state!=="built"||!e.group)return!1;let n=this.job;(!n||n.r!==e)&&(n=this.job={r:e,stack:[e.group],groups:new Map,seen:new Set,lists:null,i:0,out:[]});let i=performance.now();if(!n.lists){if(!this.gather(n,i,t))return!1;n.lists=[...n.groups.values()].filter(s=>s.length>=2)}for(;n.i<n.lists.length&&(this.foldList(e,n.lists[n.i++],n.out),!(performance.now()-i>t)););return n.i<n.lists.length?!1:(this.job=null,e.__awInst=n.out,this.poolParent||this.dirty.add(e),!0)}gather(e,t,n){let i=e.stack;for(let s=1;i.length;s++){let r=i.pop(),o=r.children;for(let c=o.length-1;c>=0;c--)i.push(o[c]);let a=r;if(a.isInstancedMesh&&xv.has(a.name)&&!Array.isArray(a.material)&&a.count!==0){let c=a.parent;c&&!e.seen.has(c)&&(c.updateWorldMatrix(!0,!1),e.seen.add(c)),a.updateWorldMatrix(!1,!1);let u=a.name+"|"+a.geometry.uuid+"|"+a.material.uuid+"|"+a.castShadow+"|"+a.receiveShadow+"|"+(a.instanceColor?1:0),h=e.groups.get(u);h||e.groups.set(u,h=[]),h.push(a)}if((s&127)===0&&performance.now()-t>n)return!1}return!0}foldList(e,t,n){let i=new O,s=new O;{if(t.some(v=>!v.parent))return;let r=0;for(let v of t)r+=v.count;let o=new Float32Array(r*16),a=new Float32Array(r),c=new Float32Array(r),u=t[0].instanceColor?new Float32Array(r*3):null,h=0;for(let v of t)for(let M=0;M<v.count;M++,h++)if(s.fromArray(v.instanceMatrix.array,M*16),i.multiplyMatrices(v.matrixWorld,s),i.toArray(o,h*16),a[h]=o[h*16+12],c[h]=o[h*16+14],u&&v.instanceColor)for(let _=0;_<3;_++)u[h*3+_]=v.instanceColor.array[M*3+_];let d=t[0],f=1e9,p=-1e9,m=1e9,g=-1e9;for(let v=0;v<r;v++)f=Math.min(f,a[v]),p=Math.max(p,a[v]),m=Math.min(m,c[v]),g=Math.max(g,c[v]);if(this.poolParent){let v=d.name+"|"+d.geometry.uuid+"|"+d.material.uuid+"|"+d.castShadow+"|"+d.receiveShadow+"|"+(u?1:0),M=this.pools.get(v);M||this.pools.set(v,M=new Xi(d.geometry,d.material,{name:"aw:inst:"+d.name,castShadow:d.castShadow,receiveShadow:d.receiveShadow,colored:!!u},this.poolParent));let _={kind:d.name,im:null,pool:M,mats:o,cols:u,cx:a,cz:c,n:r,box:[f,m,p,g]};M.add(_),this.dirtyPools.add(M);for(let A of t)A.parent?.remove(A),this.folded++;n.push(_),this.buckets++;return}let b=new q(d.geometry,d.material,r);b.name="aw:inst:"+d.name,b.castShadow=d.castShadow,b.receiveShadow=d.receiveShadow,b.frustumCulled=!1,b.matrixAutoUpdate=!1,b.count=0,b.visible=!1,u&&(b.instanceColor=new Ye(new Float32Array(r*3),3)),e.group.add(b);for(let v of t)v.parent?.remove(v),this.folded++;n.push({kind:d.name,im:b,mats:o,cols:u,cx:a,cz:c,n:r,box:[f,m,p,g]}),this.buckets++}}range(e){let t=this.q,n=t.contactR||220,i=t.parkHi||35;return e==="bld:kit"?[-1,t.kitR||0]:e==="parked"?[i,t.parkR||n]:e==="parkedHi"?[-1,i]:[-1,(t.detailR||150)*.5]}cull(e,t,n){for(let i of e.__awInst||[]){if(!i.im)continue;let[s,r]=this.range(i.kind),o=s<0?-1:s*s,a=(r+3)*(r+3),c=Math.max(i.box[0]-t,0,t-i.box[2]),u=Math.max(i.box[1]-n,0,n-i.box[3]);if(c*c+u*u>=a){i.im.count&&(i.im.count=0,i.im.visible=!1);continue}let h=i.im.instanceMatrix.array,d=i.im.instanceColor?i.im.instanceColor.array:null,f=0;for(let p=0;p<i.n;p++){let m=i.cx[p]-t,g=i.cz[p]-n,b=m*m+g*g;if(b>=a||b<o)continue;let v=p*16,M=f*16;for(let _=0;_<16;_++)h[M+_]=i.mats[v+_];d&&i.cols&&(d[f*3]=i.cols[p*3],d[f*3+1]=i.cols[p*3+1],d[f*3+2]=i.cols[p*3+2]),f++}i.im.count=f,i.im.visible=f>0,f>0&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,f*16),i.im.instanceMatrix.needsUpdate=!0,i.im.instanceColor&&(i.im.instanceColor.clearUpdateRanges(),i.im.instanceColor.addUpdateRange(0,f*3),i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){this.job&&(!this.job.r.group||!this.job.r.group.parent)&&(this.live.add(this.job.r),this.job.r.__awInst=this.job.out,this.job=null);let i=this.job?this.job.r:[...e.values()].find(r=>!r.__awInst&&r.state==="built");i&&this.fold(i,3)&&this.live.add(i);for(let r of this.live)if(!r.group||!r.group.parent){for(let o of r.__awInst||[])o.im&&o.im.dispose(),o.pool&&(o.pool.remove(o),this.dirtyPools.add(o.pool));this.live.delete(r),this.dirty.delete(r)}if((t-this.lastX)**2+(n-this.lastZ)**2>16){this.lastX=t,this.lastZ=n;for(let r of this.live)this.dirty.add(r);for(let r of this.pools.values())this.dirtyPools.add(r)}for(let[r,o]of this.pools)if(this.dirtyPools.has(o)){let[a,c]=this.range(r.slice(0,r.indexOf("|")));o.fill(this.lastX,this.lastZ,a,c+3)}this.dirtyPools.clear();for(let r of this.dirty)this.cull(r,this.lastX,this.lastZ);this.dirty.clear()}};var ko=class{constructor(e){x(this,"g");x(this,"real");x(this,"mobile");x(this,"stats");x(this,"carSeen",new WeakSet);x(this,"t",0);x(this,"heroCap");x(this,"inst",null);x(this,"postDone",!1);x(this,"regionChanged",(e,t)=>{for(let n=t;n<e.children.length;n++)e.children[n].traverse(i=>{i.name==="bld:kit"&&i.castShadow&&(i.castShadow=!1,this.stats.kitNoShadow++)})});x(this,"trimPending",!1);x(this,"carDone",new WeakSet);x(this,"pedsDone",!1);this.g=e,this.real=e.real;let t=H.get("perfmobile"),n=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window;this.mobile=t==="1"?!0:t==="0"?!1:n,this.stats={instFolded:0,instBuckets:0,carMeshes:"",peds:"",glassFixed:0,frozen:0,merged:0,mergedFrom:0,kitNoShadow:0,heroHidden:0,mobile:this.mobile,changes:[]};let i=this.real.q.name;this.heroCap=i==="low"?700:i==="med"?1e3:this.mobile?1400:this.real.q.id==="desktop"?5e3:2e3,window.__awMMDiv=3,this.tierProfile(),H.get("inst")!=="0"&&(this.inst=new zo(this.real.q,H.get("ipool")!=="0"?this.real.group:null)),this.hookUpdate(),this.hookHero(),this.fixGlass()}tierProfile(){let e=this.real.q,t=this.g.renderer,n=this.stats.changes;if(this.mobile){if(e.name==="high"){let i=Math.min(window.devicePixelRatio||1,1.5);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 2->"+i));let s=this.real.sky.sun.shadow;s.mapSize.x>2048&&(s.mapSize.set(2048,2048),s.map?.dispose(),s.map=null,n.push("shadow 4096->2048")),Object.assign(e,{radius:1400,bldR:1400,roadR:900,kitR:100,parkR:250,contactR:300,detailR:500}),n.push("radius 2000->1400, bldR 1400, roadR 900, kitR 100, parkR 250, detailR 500"),this.trimPending=!0}else if(e.name==="med"){let i=Math.min(window.devicePixelRatio||1,1.35);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 1.5->"+i))}}}fixPost(){if(this.postDone)return;let e=window.__awPost;if(!e)return;this.postDone=!0,this.mobile&&e.ao&&(e.ao.enabled=!1,this.stats.changes.push("GTAO off"));let t=e.composer;if(this.mobile&&t)for(let n of[t.renderTarget1,t.renderTarget2])n&&n.samples>2&&(n.samples=2,n.dispose(),this.stats.changes.push("MSAA 4->2"))}fixGlass(){if(this.real.q.id==="desktop"&&!this.mobile)return;let e=[],t=this.g.car;t&&e.push(t);for(let n of this.g.scene.children)n.name!=="realistic"&&e.push(n);for(let n of e)this.carSeen.has(n)||(this.carSeen.add(n),n.traverse(i=>{let s=i.material;!s||Array.isArray(s)||!(s.transmission&&s.transmission>0)||(s.transmission=0,s.transparent=!0,s.color?.set(790807),s.opacity=.72,s.depthWrite=!1,s.roughness!==void 0&&(s.roughness=Math.min(s.roughness,.08)),s.needsUpdate=!0,this.stats.glassFixed++)}))}freeze(e,t){let n=e.userData;if(n.awFrozen)return;n.awFrozen=!0,n.awN=-1;let i=Object.getPrototypeOf(e).updateMatrixWorld;e.updateMatrixWorld=function(s){let r=this.userData;(s||this.matrixWorldNeedsUpdate||r.awN!==this.children.length)&&(r.awN!==this.children.length&&t&&t(this,r.awN>this.children.length?0:Math.max(0,r.awN)),r.awN=this.children.length,i.call(this,!0))},this.stats.frozen++}merge(e,t){let n=e.userData,i=0;if(e.traverse(()=>i++),n.awMergedN===i)return;e.updateMatrixWorld(!0);let s=new O().copy(e.matrixWorld).invert(),r=new Map,o=new Set;e.traverse(u=>{let h=u;if(!h.isMesh||h.isInstancedMesh||h.isSkinnedMesh||!h.geometry||!h.material||!h.visible||h.name.startsWith("aw:")||h.morphTargetInfluences||h.matrixWorld.determinant()<0)return;let d=h.parent,f=!0;for(;d&&d!==e;)f=f&&d.visible&&!(t&&t(d)),d=d.parent;if(!f||t&&t(h))return;let p=h.geometry,m=Object.keys(p.attributes).sort().join(","),g=[];if(Array.isArray(h.material)){if(!p.index||!p.groups.length)return;for(let b of p.groups){let v=h.material[b.materialIndex??0];v&&g.push({m:h,mat:v,start:b.start,count:b.count})}}else g.push({m:h,mat:h.material,start:0,count:1/0});for(let b of g){let v=[b.mat.uuid,m,p.index?1:0,h.castShadow,h.receiveShadow,h.renderOrder].join("|"),M=r.get(v);M||r.set(v,M=[]),M.push(b)}});let a=new O,c=new Map;for(let u of r.values())for(let h of u)c.set(h.m,(c.get(h.m)??!0)&&u.length>=2);for(let u of r.values()){let h=u.filter(g=>c.get(g.m));if(h.length<2)continue;let d=[];for(let g of h){let b=g.m.geometry,v=b.clone();v.morphAttributes={},v.clearGroups(),b.index&&g.count!==1/0&&v.setIndex(Array.from(b.index.array.slice(g.start,g.start+g.count))),a.multiplyMatrices(s,g.m.matrixWorld),v.applyMatrix4(a),d.push(v)}let f=Mt(d,!1);if(d.forEach(g=>g.dispose()),!f){h.forEach(g=>c.set(g.m,!1));continue}f.computeBoundingSphere();let p=h[0].m,m=new B(f,h[0].mat);m.name="aw:merged",m.castShadow=p.castShadow,m.receiveShadow=p.receiveShadow,m.renderOrder=p.renderOrder,m.matrixAutoUpdate=!1,e.add(m);for(let g of h)o.add(g.m);this.stats.merged++,this.stats.mergedFrom+=h.length}for(let u of o)if(c.get(u))if(u.children.length){let h=u.geometry;u.geometry=new le,h.dispose(),u.castShadow=!1}else u.parent?.remove(u),u.geometry.dispose();i=0,e.traverse(()=>i++),n.awMergedN=i,e.updateMatrixWorld(!0)}mergeAll(){let e=[this.real.mon?.group,this.real.brands?.group];for(let t of e)if(t)for(let n of t.children)this.merge(n)}hookHero(){let e=this.real.hero;if(!e)return;let t=e.update.bind(e),n=this.heroCap;e.update=(i,s)=>{t(i,s);let r=0;for(let o of e.list)!o._g||!o._g.visible||Math.hypot(o.x-i,o.z-s)>n&&(o._g.visible=!1,o._sign&&(o._sign.visible=!1),r++);this.stats.heroHidden=r}}trim(e,t){this.trimPending=!1;let n=this.real,i=n.M,s=n.q.radius+300,r=0;for(let o of[...n.regions.values()]){if(o.state==="loading")continue;let a=i.X0+(o.rx+.5)*i.RS,c=i.Z0+(o.rz+.5)*i.RS;Math.hypot(a-e,c-t)-i.RS*.71>s&&(n.disposeRegion(o),r++)}r&&this.stats.changes.push("dropped "+r+" far regions")}hookUpdate(){let e=this.real,t=e.update.bind(e);e.update=(...n)=>{t(...n),this.trimPending&&this.trim(n[0],n[2]);for(let i of e.regions.values())i.group&&this.freeze(i.group,this.regionChanged);this.inst&&(this.inst.update(e.regions,n[0],n[2]),this.stats.instFolded=this.inst.folded,this.stats.instBuckets=this.inst.buckets),this.fixPost()};for(let n of[e.mon?.group,e.brands?.group,e.hero?.group])n&&this.freeze(n)}fixCar(){let e=this.g.car;if(!e||this.carDone.has(e))return;this.carDone.add(e);let t=0,n=0;e.traverse(r=>{r.isMesh&&t++}),e.updateMatrixWorld(!0);let i=e.matrixWorld.clone();e.matrixWorld.identity(),e.children.forEach(r=>r.updateMatrixWorld(!0)),this.merge(e,r=>/^Wheel(Front|Rear)(L|R)$/.test(r.name));let s=e.wheels||[];for(let r of s)this.merge(r.o);e.matrixWorld.copy(i),e.updateMatrixWorld(!0),e.traverse(r=>{r.isMesh&&n++}),this.stats.carMeshes=t+" -> "+n}fixPeds(){if(this.pedsDone||!this.mobile)return;let e=this.real.amb;if(!e)return;this.pedsDone=!0;let t=this.real.q.name,n=t==="high"?5:t==="med"?4:2,i=e.peds.length;for(let s of e.peds.splice(n))s.g.visible=!1,s.g.parent?.remove(s.g);for(let s of e.peds)s.g.traverse(r=>{r.castShadow=!1});this.stats.peds=i+" -> "+e.peds.length+" (no shadows)"}update(e){this.t-=e,!(this.t>0)&&(this.t=1,this.fixGlass(),this.fixCar(),this.fixPeds(),this.mergeAll())}};var Go=class{constructor(e){x(this,"g",e);x(this,"postDone",!1);let t=e.real,n=t.sky.sun.shadow;n.radius=t.q.name==="high"?6:t.q.name==="med"?4.5:3.5,t.roads.asphalt?.color?.isColor&&t.roads.asphalt.color.set(15001838);let i=new L(.94,1.06,.9);for(let s of["mFrond","mCanopy","mShrub"]){let r=t.veg[s];r&&r.color&&r.color.isColor&&r.color.multiply(i)}}update(e){let t=window.__awPost;if(!t||!t.grade)return;let n=t.grade.uniforms;this.postDone||(this.postDone=!0,n.uVib.value=.68,n.uContrast.value=1.12,n.uVig.value=.14,n.uLift.value.set(.008,.007,.002)),t.bloom&&(t.bloom.strength=.16+.04*e,t.bloom.threshold=1.05+.25*e)}};function Kd(l){let e=l*2654435761>>>0||1;return()=>(e=e*1664525+1013904223>>>0)/4294967296}function bv(){let l=[],e=[],t=[],n=[];for(let s=0;s<3;s++){let r=s*Math.PI/3,o=Math.cos(r)*.5,a=Math.sin(r)*.5,c=l.length/3;l.push(-o,0,-a,o,0,a,o,1,a,-o,1,-a),e.push(0,0,1,0,1,1,0,1);for(let u=0;u<4;u++)t.push(0,1,0);n.push(c,c+1,c+2,c,c+2,c+3)}let i=new le;return i.setAttribute("position",new de(l,3)),i.setAttribute("normal",new de(t,3)),i.setAttribute("uv",new de(e,2)),i.setIndex(n),i}function vv(){let l=[],e=[];for(let n=0;n<10;n++){let i=n/10*Math.PI*2+n%2*.3,s=.55+n%3*.15,r=.55+n%4*.08,o=Math.cos(i),a=Math.sin(i),c=-a*.05,u=o*.05,h=[o*Math.sin(s)*r,Math.cos(s)*r,a*Math.sin(s)*r];l.push(c,0,u,-c,0,-u,h[0],h[1],h[2]),l.push(-c,0,-u,c,0,u,h[0],h[1],h[2]);for(let d=0;d<6;d++)e.push(o*.5,.8,a*.5)}let t=new le;return t.setAttribute("position",new de(l,3)),t.setAttribute("normal",new de(e,3)),t}function Ac(l){let t=document.createElement("canvas");t.width=t.height=256;let n=t.getContext("2d"),i=Kd(l==="boug"?7:11);if(l==="scrub"){n.lineCap="round";for(let a=0;a<60;a++){let c=256*(.35+i()*.3),u=-Math.PI/2+(i()-.5)*2.2,h=256*(.25+i()*.6);n.strokeStyle=`rgb(${80+i()*30},${70+i()*25},${55+i()*20})`,n.lineWidth=1.5+i()*2,n.beginPath(),n.moveTo(c,256),n.lineTo(c+Math.cos(u)*h,256+Math.sin(u)*h),n.stroke()}for(let a=0;a<700;a++){let c=i(),u=.15+Math.pow(i(),.8)*.8,h=256*(.5+(c-.5)*(.5+.5*u)),d=256*(1-u*.95),f=85+i()*50;n.fillStyle=`rgb(${f*.78+i()*20},${f},${f*.55})`,n.beginPath(),n.ellipse(h,d,2.5+i()*3,1.6+i()*2,i()*Math.PI,0,Math.PI*2),n.fill()}let o=new re(t);return o.colorSpace=Z,o.anisotropy=2,o}let s=l==="boug"?520:260;for(let o=0;o<s;o++){let a=i(),c=Math.pow(i(),.7),u=l==="grape"?.62*Math.sqrt(Math.max(0,1-Math.pow(c*1.05-.45,2)*3.2)):.35+.65*(1-c*.6),h=256*(.5+(a-.5)*u),d=256*(1-c*.95),f=70+i()*70;n.fillStyle=l==="boug"?`rgb(${30+i()*30},${f},${25+i()*25})`:i()<.12?`rgb(${150+i()*40},${90+i()*30},40)`:`rgb(${90+i()*40},${f+60},${45+i()*25})`,n.beginPath();let p=l==="boug"?5+i()*6:9+i()*9;n.ellipse(h,d,p,p*(l==="boug"?.6:.85),i()*Math.PI,0,Math.PI*2),n.fill()}if(l==="boug")for(let o=0;o<260;o++){let a=i(),c=.25+Math.pow(i(),.6)*.72,u=256*(.5+(a-.5)*(.3+.6*(1-c*.5))),h=256*(1-c*.95),d=i()<.8?318+i()*20:20+i()*15;n.fillStyle=`hsl(${d},${75+i()*20}%,${45+i()*15}%)`,n.beginPath(),n.arc(u,h,3+i()*5,0,Math.PI*2),n.fill()}let r=new re(t);return r.colorSpace=Z,r.anisotropy=2,r}var Ho=class{constructor(e,t,n=!1){x(this,"g",e);x(this,"stats",{skipped:0,regions:0,boug:0,aloe:0,grape:0,scrub:0,ac:0,awn:0,drawn:0});x(this,"card",bv());x(this,"aloe",vv());x(this,"mBoug");x(this,"mGrape");x(this,"mAloe");x(this,"mScrub");x(this,"mAC",new Fe({color:15329249,roughness:.55,metalness:.15}));x(this,"mAwn",new Fe({color:16777215,roughness:.8,metalness:0}));x(this,"acGeo",(()=>{let e=new He(.85,.55,.42);return e.clearGroups(),e.translate(0,0,.21),e})());x(this,"awnGeo",(()=>{let e=new He(1,.06,1);return e.clearGroups(),e.translate(0,0,.5),e})());x(this,"live",new Set);x(this,"gen",null);x(this,"genR",null);x(this,"budget",2);x(this,"lastX",1e9);x(this,"lastZ",1e9);x(this,"mul");x(this,"pools",null);x(this,"vegIdx",null);x(this,"vegSig","");x(this,"hb",null);x(this,"hbN",-1);n&&(this.pools=new Map);let i=e.real.q.name;this.mul=(i==="low"?.6:i==="med"?.85:e.real.q.id==="desktop"?1.4:1)*(t?.8:1);let s=a=>new Fe({map:a,alphaTest:.45,side:K,roughness:.85,metalness:0});this.mBoug=s(Ac("boug")),this.mGrape=s(Ac("grape")),this.mScrub=s(Ac("scrub")),this.mAloe=new Fe({color:new L(7311194),roughness:.6,metalness:0,side:K});let r=e.real,o=r.update.bind(r);r.update=(...a)=>{o(...a),this.update(r.regions,a[0],a[2])}}heightAt(e,t){return this.g.real.heightAt(e,t)}bucket(e,t,n,i,s,r,o){let a=i.length/16;if(!a)return null;if(this.pools){let v=new Float32Array(i),M=new Float32Array(a),_=new Float32Array(a),A=1e9,E=-1e9,C=1e9,T=-1e9;for(let P=0;P<a;P++)M[P]=v[P*16+12],_[P]=v[P*16+14],A=Math.min(A,M[P]),E=Math.max(E,M[P]),C=Math.min(C,_[P]),T=Math.max(T,_[P]);let R=this.pools.get(r);R||this.pools.set(r,R={pool:new Xi(t,n,{name:"aw:flora:"+r,castShadow:!1,receiveShadow:!0,colored:!!o},this.g.real.group),range:s*Math.sqrt(this.mul)});let I={im:null,pool:R.pool,cols:o?new Float32Array(o):void 0,mats:v,cx:M,cz:_,n:a,range:R.range,box:[A,C,E,T]};return R.pool.add(I),I}let c=new q(t,n,a);c.name="aw:flora:"+r,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!0,c.matrixAutoUpdate=!1,c.count=0,c.visible=!1;let u=new Float32Array(i),h=new Float32Array(a),d=new Float32Array(a),f=1e9,p=-1e9,m=1e9,g=-1e9;for(let v=0;v<a;v++)h[v]=u[v*16+12],d[v]=u[v*16+14],f=Math.min(f,h[v]),p=Math.max(p,h[v]),m=Math.min(m,d[v]),g=Math.max(g,d[v]);let b;return o&&(b=new Float32Array(o),c.instanceColor=new Ye(new Float32Array(a*3),3)),e.group.add(c),{im:c,cols:b,mats:u,cx:h,cz:d,n:a,range:s*Math.sqrt(this.mul),box:[f,m,p,g]}}*build(e){let t=0,n=this.g.real.veg,i=Kd(e.rx*7919+e.rz*104729+13),s=new O,r=new Y,o=new w,a=new w,c=new w(0,1,0),u=(T,R,I,P,D,N,F=.05)=>{r.setFromAxisAngle(c,N),a.set(R,this.heightAt(R,I)-F,I),o.set(P,D,P),s.compose(a,r,o);for(let z of s.elements)T.push(z)},h=[],d=[],f=[];for(let T of e.json?.b||[]){if((++t&31)===0&&(yield),!T.p||T.p.length<3||this.hidden(T))continue;let R=T.k==="house"||T.k==="res"||T.k==="apt";if(i()>(R?.38:.08)*this.mul)continue;let I=0,P=0;for(let[ze,fe]of T.p)I+=ze,P+=fe;I/=T.p.length,P/=T.p.length;let D=Math.floor(i()*T.p.length),[N,F]=T.p[D],[z,W]=T.p[(D+1)%T.p.length],J=z-N,j=W-F,ee=Math.hypot(J,j);if(ee<2.5)continue;let Q=-j/ee,se=J/ee,me=(N+z)/2,we=(F+W)/2;(me-I)*Q+(we-P)*se<0&&(Q=-Q,se=-se);let pe=1+Math.floor(i()*3);for(let ze=0;ze<pe;ze++){let fe=.2+i()*.6,Ne=N+J*fe+Q*.8,be=F+j*fe+se*.8;u(h,Ne,be,1.5+i()*1.2,1.4+i()*1.4,i()*6.28)}}for(let[T,,R]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((T-this.M().X0)/this.M().RS)!==e.rx||Math.floor((R-this.M().Z0)/this.M().RS)!==e.rz||i()>.5*this.mul)continue;let I=1+Math.floor(i()*4);for(let P=0;P<I;P++){let D=i()*6.28,N=1.5+i()*4,F=.7+i()*.8;u(d,T+Math.cos(D)*N,R+Math.sin(D)*N,F,F*(.8+i()*.5),i()*6.28,.02)}}for(let[T,R,I]of this.vegFor(e,"p")){if((++t&255)===0&&(yield),R>3.5||Math.floor((T-this.M().X0)/this.M().RS)!==e.rx||Math.floor((I-this.M().Z0)/this.M().RS)!==e.rz||i()>.45*this.mul)continue;let P=i()*6.28,D=3+i()*5;u(f,T+Math.cos(P)*D,I+Math.sin(P)*D,2.4+i()*1.8,1.6+i()*1.4,i()*6.28)}let p=[],m=[],g=[],b=[2062988,14241584,15905076,3050327,8011421,15231634,2841027,16052712],v=new L,M=new Y,_=new w(1,0,0),A=(T,R,I,P,D,N,F,z,W=0)=>{r.setFromAxisAngle(c,D),W&&r.multiply(M.setFromAxisAngle(_,W)),a.set(R,P,I),o.set(N,F,z),s.compose(a,r,o);for(let J of s.elements)T.push(J)};for(let T of e.json?.b||[]){if((++t&31)===0&&(yield),!T.p||T.p.length<3||this.hidden(T))continue;let R=T.k==="com"||T.k==="shop"||T.k==="retail",I=T.k==="house"||T.k==="res"||T.k==="apt";if(!R&&!I)continue;let P=0,D=0;for(let[z,W]of T.p)P+=z,D+=W;P/=T.p.length,D/=T.p.length;let N=T.h||4,F=Math.min(T.p.length,6);for(let z=0;z<F;z++){let[W,J]=T.p[z],[j,ee]=T.p[(z+1)%T.p.length],Q=j-W,se=ee-J,me=Math.hypot(Q,se);if(me<3)continue;let we=-se/me,pe=Q/me,ze=(W+j)/2,fe=(J+ee)/2;(ze-P)*we+(fe-D)*pe<0&&(we=-we,pe=-pe);let Ne=Math.atan2(we,pe);if(i()<(R?.45:.28)*this.mul){let be=.15+i()*.7,$=W+Q*be+we*.03,Se=J+se*be+pe*.03,it=this.heightAt($,Se),wt=N>6&&i()<.5?3+Math.floor(i()*Math.max(1,(N-4)/3))*3:0;A(p,$,Se,it+Math.min(N-.8,2.3+wt),Ne,1,1,1)}if(R&&me>4&&i()<.5*this.mul){let be=Math.min(me*.8,3+i()*6),$=.5,Se=W+Q*$+we*.02,it=J+se*$+pe*.02;A(m,Se,it,this.heightAt(Se,it)+Math.min(N-.4,2.9),Ne,be,1,1.1+i()*.5,.32),v.setHex(b[Math.floor(i()*b.length)]).convertSRGBToLinear(),g.push(v.r,v.g,v.b)}}}let E=[];for(let[T,,R]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((T-this.M().X0)/this.M().RS)!==e.rx||Math.floor((R-this.M().Z0)/this.M().RS)!==e.rz||i()>.7*this.mul)continue;let I=1+Math.floor(i()*3);for(let P=0;P<I;P++){let D=i()*6.28,N=2+i()*7;u(E,T+Math.cos(D)*N,R+Math.sin(D)*N,1.8+i()*2.2,1.1+i()*1.4,i()*6.28)}}this.stats.scrub+=E.length/16,this.stats.ac+=p.length/16,this.stats.awn+=m.length/16;let C=[];for(let T of[this.bucket(e,this.card,this.mBoug,h,180,"boug"),this.bucket(e,this.aloe,this.mAloe,d,110,"aloe"),this.bucket(e,this.card,this.mGrape,f,220,"grape"),this.bucket(e,this.card,this.mScrub,E,320,"scrub"),this.bucket(e,this.acGeo,this.mAC,p,140,"ac"),this.bucket(e,this.awnGeo,this.mAwn,m,260,"awn",g)])T&&C.push(T);this.stats.boug+=h.length/16,this.stats.aloe+=d.length/16,this.stats.grape+=f.length/16,this.stats.regions++,e.__awFlora=C,this.live.add(e)}hidden(e){let t=this.g.real,n=0,i=0;for(let[s,r]of e.p)n+=s,i+=r;n/=e.p.length,i/=e.p.length;for(let s of this.heroBoxes())if(n>s[0]&&n<s[2]&&i>s[1]&&i<s[3])return this.stats.skipped++,!0;try{if(t.mon&&t.mon.excluded&&t.mon.excluded(n,i,e))return this.stats.skipped++,!0;if(t.hero&&(t.hero.pts.length||t.hero.polys.length)&&this.nearHero(n,i)&&t.hero.hides(e.p))return this.stats.skipped++,!0}catch{}return!1}vegFor(e,t){let n=this.g.real.veg.lists,i=(n.k||[]).length+":"+(n.p||[]).length+":"+(n.k||[]).reduce((r,o)=>r+o.length,0)+":"+(n.p||[]).reduce((r,o)=>r+o.length,0);if(!this.vegIdx||i!==this.vegSig){this.vegSig=i,this.vegIdx=new Map;let r=this.M();for(let o of["k","p"])for(let a of n[o]||[])for(let c of a){let u=Math.floor((c[0]-r.X0)/r.RS)+","+Math.floor((c[2]-r.Z0)/r.RS),h=this.vegIdx.get(u);h||this.vegIdx.set(u,h={k:[],p:[]}),h[o].push(c)}}let s=this.vegIdx.get(e.rx+","+e.rz);return s?s[t]:[]}heroBoxes(){let e=this.g.real.hero,t=e&&e.list||[];if(this.hb&&this.hbN===t.length)return this.hb;this.hb=[],this.hbN=t.length;for(let n of t){let i=n.foot||(Array.isArray(n.hero?.hide_footprint)?n.hero.hide_footprint:null);if(i&&i.length>2){let s=1e9,r=1e9,o=-1e9,a=-1e9;for(let[c,u]of i)s=Math.min(s,c),o=Math.max(o,c),r=Math.min(r,u),a=Math.max(a,u);this.hb.push([s-6,r-6,o+6,a+6])}else Number.isFinite(n.x)&&this.hb.push([n.x-30,n.z-30,n.x+30,n.z+30])}return this.hb}nearHero(e,t){for(let n of this.heroBoxes())if(e>n[0]-60&&e<n[2]+60&&t>n[1]-60&&t<n[3]+60)return!0;return!1}M(){return this.g.real.M}cull(e,t,n){for(let i of e.__awFlora||[]){if(!i.im)continue;let s=i.range*i.range,r=Math.max(i.box[0]-t,0,t-i.box[2]),o=Math.max(i.box[1]-n,0,n-i.box[3]);if(r*r+o*o>=s){i.im.count=0,i.im.visible=!1;continue}let a=i.im.instanceMatrix.array,c=0;for(let u=0;u<i.n;u++){let h=i.cx[u]-t,d=i.cz[u]-n;if(h*h+d*d<s){let f=u*16,p=c*16;for(let m=0;m<16;m++)a[p+m]=i.mats[f+m];if(i.cols){let m=i.im.instanceColor.array;m[c*3]=i.cols[u*3],m[c*3+1]=i.cols[u*3+1],m[c*3+2]=i.cols[u*3+2]}c++}}i.im.count=c,i.im.visible=c>0,c&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,c*16),i.im.instanceMatrix.needsUpdate=!0,i.cols&&(i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){let i=performance.now();if(!this.gen){for(let r of e.values())if(!r.__awFlora&&r.state==="built"&&r.group&&r.json){this.gen=this.build(r),this.genR=r;break}}for(;this.gen&&performance.now()-i<this.budget;){if(this.genR&&this.genR.state!=="built"){this.gen=null;break}this.gen.next().done&&(this.gen=null,this.lastX=1e9)}for(let r of this.live)if(!r.group||!r.group.parent){for(let o of r.__awFlora||[])o.im&&o.im.dispose(),o.pool&&o.pool.remove(o);this.live.delete(r),this.lastX=1e9}if((t-this.lastX)**2+(n-this.lastZ)**2<36)return;this.lastX=t,this.lastZ=n;let s=0;if(this.pools){for(let r of this.pools.values())s+=r.pool.fill(t,n,-1,r.range);this.stats.drawn=s;return}for(let r of this.live){this.cull(r,t,n);for(let o of r.__awFlora||[])s+=o.im?o.im.count:0}this.stats.drawn=s}};var Vo=class{constructor(e,t){x(this,"g",e);x(this,"budget",t);x(this,"stats",{jobs:0,maxMs:0,ticks:0,maxJob:0});x(this,"ord",new WeakMap);x(this,"cost",[]);x(this,"ch",new MessageChannel);x(this,"pending",!1);window.__awJobB=-1,this.ch.port1.onmessage=()=>this.run()}frame(){let e=this.g.real;this.pending||!e.queue.length||(this.pending=!0,this.ch.port2.postMessage(0))}run(){this.pending=!1;let e=this.g.real,t=performance.now(),n=e.queue.length>120?this.budget*1.5:this.budget,i=0;for(;e.queue.length&&performance.now()-t<n;){let r=e.queue[0],o=this.ord.get(r.R)??0,a=this.cost[o]||0;if(i>0&&performance.now()-t+a>n)break;e.queue.shift(),this.ord.set(r.R,o+1);let c=performance.now();if(e.regions.get(r.R.rx+","+r.R.rz)===r.R)try{r.f()}catch(h){console.error("[aw-jobs]",h)}let u=performance.now()-c;this.cost[o]=this.cost[o]?this.cost[o]*.7+u*.3:u,u>this.stats.maxJob&&(this.stats.maxJob=u),this.stats.jobs++,i++}let s=performance.now()-t;this.stats.ticks++,s>this.stats.maxMs&&(this.stats.maxMs=s)}};var _v=[13617856,12433840,11975099,14078664],yv=[10508348,11232326,9720122,11693646],Mv=[14271098,14199472,9616823,14605264,14069376,11453338,10926543,13605516],Wo=class{constructor(e,t,n=!0){x(this,"g",e);x(this,"walls",t);x(this,"useBatch",n);x(this,"mesh",null);x(this,"stats",{buildings:0,tris:0,masked:0,ms:0});x(this,"mask",new Uint8Array(1024*4));x(this,"tex",new lt(this.mask,32,32,Xt,ni));x(this,"t",0);x(this,"batch",null);this.tex.needsUpdate=!0,this.load().catch(i=>console.warn("[aw-far] disabled:",i))}async load(){let e=await fetch("./data/far/massing.bin");if(!e.ok)return;let t=await e.arrayBuffer(),n=new DataView(t);if(n.getUint32(0,!0)!==826693441)return;let i=performance.now(),s=n.getUint32(4,!0);if(t.byteLength<8+s*14){console.warn("[aw-far] massing.bin truncated",t.byteLength,s);return}let r=this.g.real,o=(T,R,I)=>this.walls&&(T>=7||R*I*4>350),a=0,c=0;for(let T=0;T<s;T++){let R=8+T*14,I=n.getInt16(R+4,!0)/20,P=n.getInt16(R+6,!0)/20,D=n.getUint8(R+8)/4,N=n.getUint8(R+9)/4;a+=4,c+=6,o(N,D,Math.hypot(I,P))&&(a+=16,c+=24)}let u=new Float32Array(a*3),h=new Float32Array(a*3),d=new Uint8Array(a*4),f=new Float32Array(a),p=new Uint32Array(c),m=0,g=0,b=new L,v=new L(13219740).convertSRGBToLinear(),M=(T,R,I,P,D,N,F)=>(u[m*3]=T,u[m*3+1]=R,u[m*3+2]=I,h[m*3]=P,h[m*3+1]=D,h[m*3+2]=N,d[m*4]=b.r*255,d[m*4+1]=b.g*255,d[m*4+2]=b.b*255,d[m*4+3]=255,f[m]=F,m++);for(let T=0;T<s;T++){let R=8+T*14,I=n.getInt16(R,!0)/2,P=n.getInt16(R+2,!0)/2,D=n.getInt16(R+4,!0)/20,N=n.getInt16(R+6,!0)/20,F=n.getUint8(R+8)/4,z=n.getUint8(R+9)/4,W=n.getUint8(R+10),J=n.getUint8(R+11),j=n.getUint16(R+12,!0),ee=Math.hypot(D,N)||1,Q=-N/ee*F,se=D/ee*F,me=r.heightAt(I,P)-.5,we=me+.5+z,pe=[[I-D-Q,P-N-se],[I+D-Q,P+N-se],[I+D+Q,P+N+se],[I-D+Q,P-N+se]],ze=W>>4;b.setHex(ze?yv[J&3]:_v[J&3]).convertSRGBToLinear().lerp(v,.35);let fe=pe.map(([be,$])=>M(be,we,$,0,1,0,j));if((pe[1][0]-pe[0][0])*(pe[2][1]-pe[0][1])-(pe[1][1]-pe[0][1])*(pe[2][0]-pe[0][0])<0?(p[g++]=fe[0],p[g++]=fe[1],p[g++]=fe[2],p[g++]=fe[0],p[g++]=fe[2],p[g++]=fe[3]):(p[g++]=fe[0],p[g++]=fe[2],p[g++]=fe[1],p[g++]=fe[0],p[g++]=fe[3],p[g++]=fe[2]),o(z,F,ee)){b.setHex(Mv[J>>2&7]).convertSRGBToLinear().lerp(v,.4).multiplyScalar(.85);for(let be=0;be<4;be++){let[$,Se]=pe[be],[it,wt]=pe[be+1&3],Dt=wt-Se,Nt=-(it-$),sh=Math.hypot(Dt,Nt)||1;Dt/=sh,Nt/=sh,(($+it)/2-I)*Dt+((Se+wt)/2-P)*Nt<0&&(Dt=-Dt,Nt=-Nt);let rh=M($,me,Se,Dt,0,Nt,j),Dm=M(it,me,wt,Dt,0,Nt,j),oh=M(it,we,wt,Dt,0,Nt,j),Nm=M($,we,Se,Dt,0,Nt,j);p[g++]=rh,p[g++]=Dm,p[g++]=oh,p[g++]=rh,p[g++]=oh,p[g++]=Nm}}}if(this.useBatch){this.buildBatch(u,h,d,f,p,a,c),this.stats.buildings=s,this.stats.ms=Math.round(performance.now()-i),this.t=0;return}let _=new le;_.setAttribute("position",new oe(u,3)),_.setAttribute("normal",new oe(h,3)),_.setAttribute("color",new oe(d,4,!0)),_.setAttribute("aReg",new oe(f,1)),_.setIndex(new oe(p,1));let A=new ut({vertexColors:!0,side:2}),E=this.tex;A.onBeforeCompile=T=>{T.uniforms.uMask={value:E},T.vertexShader=T.vertexShader.replace("#include <common>",`#include <common>
attribute float aReg; uniform sampler2D uMask;`).replace("#include <project_vertex>",`#include <project_vertex>
  { float rx = floor(aReg / 32.0), rz = aReg - rx * 32.0;
    if (texture2D(uMask, (vec2(rx, rz) + 0.5) / 32.0).r > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }`)},A.customProgramCacheKey=()=>"awFarCity";let C=new B(_,A);C.name="aw:farCity",C.frustumCulled=!1,C.castShadow=!1,C.receiveShadow=!1,C.matrixAutoUpdate=!1,this.g.scene.add(C),this.mesh=C,this.stats.buildings=s,this.stats.tris=c/3,this.stats.ms=Math.round(performance.now()-i),this.t=0}buildBatch(e,t,n,i,s,r,o){let c=new Uint32Array(1025),u=new Uint32Array(1025);for(let R=0;R<r;R++)c[i[R]+1]++;for(let R=0;R<o;R+=3)u[i[s[R]]+1]+=3;for(let R=0;R<1024;R++)c[R+1]+=c[R],u[R+1]+=u[R];let h=new Uint32Array(r),d=c.slice(0,1024),f=u.slice(0,1024),p=new Float32Array(r*3),m=new Float32Array(r*3),g=new Uint8Array(r*4),b=new Uint32Array(o);for(let R=0;R<r;R++){let I=i[R],P=d[I]++;h[R]=P-c[I],p[P*3]=e[R*3],p[P*3+1]=e[R*3+1],p[P*3+2]=e[R*3+2],m[P*3]=t[R*3],m[P*3+1]=t[R*3+1],m[P*3+2]=t[R*3+2],g[P*4]=n[R*4],g[P*4+1]=n[R*4+1],g[P*4+2]=n[R*4+2],g[P*4+3]=n[R*4+3]}for(let R=0;R<o;R+=3){let I=i[s[R]],P=f[I];f[I]+=3,b[P]=h[s[R]],b[P+1]=h[s[R+1]],b[P+2]=h[s[R+2]]}let v=[];for(let R=0;R<1024;R++)u[R+1]>u[R]&&v.push(R);let M=new ut({vertexColors:!0,side:2});M.customProgramCacheKey=()=>"awFarCityB";let _=new qn(v.length,r,o,M),A=v.length,E={cx:new Float32Array(A),cy:new Float32Array(A),cz:new Float32Array(A),r:new Float32Array(A),vis:new Uint16Array(A),nVis:0,reg:new Uint16Array(A),n:A},C=new X,T=new X;v.forEach((R,I)=>{let P=c[R],D=c[R+1],N=new le;N.setAttribute("position",new oe(p.subarray(P*3,D*3),3)),N.setAttribute("normal",new oe(m.subarray(P*3,D*3),3)),N.setAttribute("color",new oe(g.subarray(P*4,D*4),4,!0)),N.setIndex(new oe(b.subarray(u[R],u[R+1]),1)),N.computeBoundingSphere(),_.addInstance(_.addGeometry(N));let F=N.boundingSphere;E.cx[I]=F.center.x,E.cy[I]=F.center.y,E.cz[I]=F.center.z,E.r[I]=F.radius,E.reg[I]=R,I?C.union(T.copy(F)):C.copy(F)}),_.boundingSphere=C,_.name="aw:farCity",_.sortObjects=!1,_.perObjectFrustumCulled=!0,_.castShadow=!1,_.receiveShadow=!1,_.matrixAutoUpdate=!1,_.userData.awb=E,_.onBeforeRender=yc,this.g.scene.add(_),this.batch=E,this.mesh=_,this.stats.tris=o/3}update(e){let n=this.g.camera.position.y,i=Math.max(0,Math.min(1,(n-25)/140)),s=window;if(s.__awFar=12e3+1e4*i,s.__awFogK=1-.55*i,!this.mesh||(this.t-=e,this.t>0))return;this.t=.25;let r=this.g.real.regions;this.mask.fill(0);let o=0;for(let c of r.values()){if(c.state!=="built")continue;let u=c.rx,h=c.rz;u<0||h<0||u>31||h>31||(this.mask[(h*32+u)*4]=255,o++)}this.stats.masked=o;let a=this.batch;if(a){let c=0;for(let u=0;u<a.n;u++){let h=a.reg[u],d=Math.floor(h/32),f=h-d*32;this.mask[(f*32+d)*4]||(a.vis[c++]=u)}a.nVis=c;return}this.tex.needsUpdate=!0}};var ks={desktop:"high",high:"med",med:"low"},Xo=class{constructor(e,t){x(this,"g",e);x(this,"stats",{lost:0,prCap:0});let n=e.renderer.domElement;n.addEventListener("webglcontextlost",i=>this.lost(i),!1),n.addEventListener("webglcontextrestored",()=>location.reload(),!1),t||(this.cap(),addEventListener("resize",()=>this.cap()))}tier(){let e=this.g.real.q;return e.id||e.name}cap(){let e=this.tier();if(e!=="high"&&e!=="desktop")return;let t=this.g.renderer,n=e==="desktop"?8e6:24e5,i=innerWidth*innerHeight,s=Math.min(devicePixelRatio||1,e==="desktop"?3:2),r=Math.max(1,Math.min(s,Math.sqrt(n/Math.max(1,i))));window.__awPRCap=r,t.getPixelRatio()>r+.01&&(t.setPixelRatio(r),this.stats.prCap=+r.toFixed(2),dispatchEvent(new Event("resize")))}lost(e){e.preventDefault(),this.stats.lost++;let t=this.tier(),n="aw_ctxlost_"+t,i=0;try{i=+(sessionStorage.getItem(n)||0)+1,sessionStorage.setItem(n,String(i))}catch{}if(i>=2&&ks[t])try{localStorage.setItem("aw_q",ks[t])}catch{}let s=document.createElement("div");s.textContent=i>=2&&ks[t]?`Graphics reset - switching to ${ks[t].toUpperCase()}\u2026`:"Graphics reset - reloading\u2026",s.style.cssText="position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:99999;background:#000c;color:#fff;padding:14px 18px;border-radius:12px;font:600 15px system-ui",document.body.appendChild(s),setTimeout(()=>{let r=new URL(location.href);i>=2&&ks[t]&&r.searchParams.delete("q"),location.href=r.toString()},2500)}};var qo=class{constructor(e){x(this,"g",e);x(this,"c",document.createElement("canvas"));x(this,"x");x(this,"buf",new Float32Array(300));x(this,"i",0);x(this,"n",0);x(this,"t",0);x(this,"txt","");this.c.width=300,this.c.height=96,this.c.style.cssText="position:fixed;left:8px;bottom:8px;z-index:9999;pointer-events:none;background:#000a;border-radius:6px;width:300px;height:96px",document.body.appendChild(this.c),this.x=this.c.getContext("2d")}frame(e){if(this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n=Math.min(this.n+1,this.buf.length),this.t+=e,this.t>500){this.t=0;let r=Array.from(this.buf.subarray(0,this.n)).sort((c,u)=>c-u),o=c=>r[Math.min(r.length-1,Math.floor(c*r.length))],a=this.g.renderer;this.txt=`p50 ${o(.5).toFixed(1)}  p95 ${o(.95).toFixed(1)}  p99 ${o(.99).toFixed(1)}  max ${r[r.length-1].toFixed(0)} ms \xB7 pr ${a.getPixelRatio().toFixed(2)}`}let t=this.x,n=300,i=96,s=70/50;t.clearRect(0,0,n,i);for(let r=0;r<this.n;r++){let o=this.buf[(this.i-this.n+r+this.buf.length)%this.buf.length];t.fillStyle=o<17.5?"#3c3":o<34?"#ec3":"#e33";let a=Math.min(70,o*s);t.fillRect(r,i-a,1,a)}t.fillStyle="#fff8",t.fillRect(0,i-16.7*s,n,1),t.fillRect(0,i-33.3*s,n,1),t.fillStyle="#fff",t.font="11px monospace",t.fillText(this.txt,4,12)}};function Yo(l){let e=new Map,t=new Map,n=l.clone();return jd(l,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,r=e.get(i),o=r.skeleton.bones;s.skeleton=r.skeleton.clone(),s.bindMatrix.copy(r.bindMatrix),s.skeleton.bones=o.map(function(a){return t.get(a)}),s.bind(s.skeleton,s.bindMatrix)}),n}function jd(l,e,t){t(l,e);for(let n=0;n<l.children.length;n++)jd(l.children[n],e.children[n],t)}var Yi=class extends Pt{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Lc(t)}),this.register(function(t){return new Dc(t)}),this.register(function(t){return new Hc(t)}),this.register(function(t){return new Vc(t)}),this.register(function(t){return new Wc(t)}),this.register(function(t){return new Oc(t)}),this.register(function(t){return new Fc(t)}),this.register(function(t){return new Uc(t)}),this.register(function(t){return new Bc(t)}),this.register(function(t){return new Ic(t)}),this.register(function(t){return new zc(t)}),this.register(function(t){return new Nc(t)}),this.register(function(t){return new Gc(t)}),this.register(function(t){return new kc(t)}),this.register(function(t){return new Cc(t)}),this.register(function(t){return new Zo(t,ce.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Zo(t,ce.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Xc(t)})}load(e,t,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let c=Qt.extractUrlBase(e);r=Qt.resolveURL(c,this.path)}else r=Qt.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},a=new ki(this.manager);a.setPath(this.path),a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(c){try{s.parse(c,r,function(u){t(u),s.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,r={},o={},a=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(a.decode(new Uint8Array(e,0,4))===tf){try{r[ce.KHR_BINARY_GLTF]=new qc(e)}catch(h){i&&i(h);return}s=JSON.parse(r[ce.KHR_BINARY_GLTF].content)}else s=JSON.parse(a.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Qc(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,r[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){let h=s.extensionsUsed[u],d=s.extensionsRequired||[];switch(h){case ce.KHR_MATERIALS_UNLIT:r[h]=new Pc;break;case ce.KHR_DRACO_MESH_COMPRESSION:r[h]=new Yc(s,this.dracoLoader);break;case ce.KHR_TEXTURE_TRANSFORM:r[h]=new Zc;break;case ce.KHR_MESH_QUANTIZATION:r[h]=new Kc;break;default:d.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(r),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function wv(){let l={};return{get:function(e){return l[e]},add:function(e,t){l[e]=t},remove:function(e){delete l[e]},removeAll:function(){l={}}}}function Le(l,e,t){let n=l.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var ce={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Cc=class{constructor(e){this.parser=e,this.name=ce.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,a=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,u=new L(16777215);a.color!==void 0&&u.setRGB(a.color[0],a.color[1],a.color[2],ot);let h=a.range!==void 0?a.range:0;switch(a.type){case"directional":c=new Ns(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new $n(u),c.distance=h;break;case"spot":c=new Jn(u),c.distance=h,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle!==void 0?a.spot.innerConeAngle:0,a.spot.outerConeAngle=a.spot.outerConeAngle!==void 0?a.spot.outerConeAngle:Math.PI/4,c.angle=a.spot.outerConeAngle,c.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+a.type)}return c.position.set(0,0,0),It(c,a),a.intensity!==void 0&&(c.intensity=a.intensity),c.name=t.createUniqueName(a.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(a){return n._getNodeRef(t.cache,o,a)})}},Pc=class{constructor(){this.name=ce.KHR_MATERIALS_UNLIT}getMaterialType(){return k}extendParams(e,t,n){let i=[];e.color=new L(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],ot),e.opacity=r[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,Z))}return Promise.all(i)}},Ic=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Lc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new U(s,s)}return Promise.all(i)}},Dc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Nc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},Oc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_SHEEN}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new L(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],ot)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Z)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},Fc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},Uc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_VOLUME}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new L().setRGB(s[0],s[1],s[2],ot),Promise.all(i)}},Bc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_IOR}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},zc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new L().setRGB(s[0],s[1],s[2],ot),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Z)),Promise.all(i)}},kc=class{constructor(e){this.parser=e,this.name=ce.EXT_MATERIALS_BUMP}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},Gc=class{constructor(e){this.parser=e,this.name=ce.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Le(this.parser,e,this.name)!==null?et:null}extendMaterialParams(e,t){let n=Le(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Hc=class{constructor(e){this.parser=e,this.name=ce.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,r)}},Vc=class{constructor(e){this.parser=e,this.name=ce.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],o=i.images[r.source],a=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(a=c)}return n.loadTextureImage(e,r.source,a)}},Wc=class{constructor(e){this.parser=e,this.name=ce.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],o=i.images[r.source],a=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(a=c)}return n.loadTextureImage(e,r.source,a)}},Zo=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){let a=i.byteOffset||0,c=i.byteLength||0,u=i.count,h=i.byteStride,d=new Uint8Array(o,a,c);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(u,h,d,i.mode,i.filter).then(function(f){return f.buffer}):r.ready.then(function(){let f=new ArrayBuffer(u*h);return r.decodeGltfBuffer(new Uint8Array(f),u,h,d,i.mode,i.filter),f})})}else return null}},Xc=class{constructor(e){this.name=ce.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==ft.TRIANGLES&&c.mode!==ft.TRIANGLE_STRIP&&c.mode!==ft.TRIANGLE_FAN&&c.mode!==void 0)return null;let r=n.extensions[this.name].attributes,o=[],a={};for(let c in r)o.push(this.parser.getDependency("accessor",r[c]).then(u=>(a[c]=u,a[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(let p of h){let m=new O,g=new w,b=new Y,v=new w(1,1,1),M=new q(p.geometry,p.material,d);for(let A=0;A<d;A++)a.TRANSLATION&&g.fromBufferAttribute(a.TRANSLATION,A),a.ROTATION&&b.fromBufferAttribute(a.ROTATION,A),a.SCALE&&v.fromBufferAttribute(a.SCALE,A),M.setMatrixAt(A,m.compose(g,b,v));let _=null;for(let A in a)if(A==="_COLOR_0"){let E=a[A];M.instanceColor=new Ye(E.array,E.itemSize,E.normalized)}else if(A!=="TRANSLATION"&&A!=="ROTATION"&&A!=="SCALE"){if(_===null){let C=M.geometry;_=new le,_.name=C.name;for(let T in C.attributes)_.setAttribute(T,C.attributes[T]);for(let T in C.morphAttributes)_.morphAttributes[T]=C.morphAttributes[T];C.index!==null&&_.setIndex(C.index),_.morphTargetsRelative=C.morphTargetsRelative;for(let T of C.groups)_.addGroup(T.start,T.count,T.materialIndex);C.boundingBox!==null&&(_.boundingBox=C.boundingBox.clone()),C.boundingSphere!==null&&(_.boundingSphere=C.boundingSphere.clone()),_.drawRange.start=C.drawRange.start,_.drawRange.count=C.drawRange.count,_.userData=Object.assign({},C.userData),M.geometry=_}let E=a[A];_.setAttribute(A,new Ye(E.array,E.itemSize,E.normalized))}Re.prototype.copy.call(M,p),this.parser.assignFinalMaterial(M),f.push(M)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},tf="glTF",Gs=12,Jd={JSON:1313821514,BIN:5130562},qc=class{constructor(e){this.name=ce.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Gs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==tf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Gs,s=new DataView(e,Gs),r=0;for(;r<i;){let o=s.getUint32(r,!0);r+=4;let a=s.getUint32(r,!0);if(r+=4,a===Jd.JSON){let c=new Uint8Array(e,Gs+r,o);this.content=n.decode(c)}else if(a===Jd.BIN){let c=Gs+r;this.body=e.slice(c,c+o)}r+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Yc=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ce.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,o={},a={},c={};for(let u in r){let h=Jc[u]||u.toLowerCase();o[h]=r[u]}for(let u in e.attributes){let h=Jc[u]||u.toLowerCase();if(r[u]!==void 0){let d=n.accessors[e.attributes[u]],f=qi[d.componentType];c[h]=f.name,a[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,d){i.decodeDracoFile(u,function(f){for(let p in f.attributes){let m=f.attributes[p],g=a[p];g!==void 0&&(m.normalized=g)}h(f)},o,c,ot,d)})})}},Zc=class{constructor(){this.name=ce.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Kc=class{constructor(){this.name=ce.KHR_MESH_QUANTIZATION}},Ko=class extends Ct{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)t[r]=n[s+r];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=o*2,c=o*3,u=i-t,h=(n-t)/u,d=h*h,f=d*h,p=e*c,m=p-c,g=-2*f+3*d,b=f-d,v=1-g,M=b-d+h;for(let _=0;_!==o;_++){let A=r[m+_+o],E=r[m+_+a]*u,C=r[p+_+o],T=r[p+_]*u;s[_]=v*A+M*E+g*C+b*T}return s}},Sv=new Y,jc=class extends Ko{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return Sv.fromArray(s).normalize().toArray(s),s}},ft={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},qi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},$d={9728:Li,9729:en,9984:$l,9985:ec,9986:Ql,9987:ti},Qd={33071:kn,33648:vs,10497:Wt},Tc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Jc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},xn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Av={CUBICSPLINE:void 0,LINEAR:Wn,STEP:Vn},Ec={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Tv(l){return l.DefaultMaterial===void 0&&(l.DefaultMaterial=new Fe({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Bs})),l.DefaultMaterial}function si(l,e,t){for(let n in t.extensions)l[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function It(l,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(l.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ev(l,e,t){let n=!1,i=!1,s=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(l);let r=[],o=[],a=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(n){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):l.attributes.position;r.push(d)}if(i){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):l.attributes.normal;o.push(d)}if(s){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):l.attributes.color;a.push(d)}}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(a)]).then(function(c){let u=c[0],h=c[1],d=c[2];return n&&(l.morphAttributes.position=u),i&&(l.morphAttributes.normal=h),s&&(l.morphAttributes.color=d),l.morphTargetsRelative=!0,l})}function Rv(l,e){if(l.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)l.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(l.morphTargetInfluences.length===t.length){l.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)l.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Cv(l){let e,t=l.extensions&&l.extensions[ce.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Rc(t.attributes):e=l.indices+":"+Rc(l.attributes)+":"+l.mode,l.targets!==void 0)for(let n=0,i=l.targets.length;n<i;n++)e+=":"+Rc(l.targets[n]);return e}function Rc(l){let e="",t=Object.keys(l).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+l[t[n]]+";";return e}function $c(l){switch(l){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Pv(l){return l.search(/\.jpe?g($|\?)/i)>0||l.search(/^data\:image\/jpeg/)===0?"image/jpeg":l.search(/\.webp($|\?)/i)>0||l.search(/^data\:image\/webp/)===0?"image/webp":l.search(/\.ktx2($|\?)/i)>0||l.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Iv=new O,Qc=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new wv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let a=o.match(/Version\/(\d+)/);i=n&&a?parseInt(a[1],10):-1,s=o.indexOf("Firefox")>-1,r=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&r<98?this.textureLoader=new Ls(this.options.manager):this.textureLoader=new Fs(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new ki(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let o={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return si(s,o,i),It(o,i),Promise.all(n._invokeAll(function(a){return a.afterRoot&&a.afterRoot(o)})).then(function(){for(let a of o.scenes)a.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i].joints;for(let o=0,a=r.length;o<a;o++)e[r[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(r,o)=>{let a=this.associations.get(r);a!=null&&this.associations.set(o,a);for(let[c,u]of r.children.entries())s(u,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ce.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(Qt.resolveURL(t.uri,i.path),s,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=Tc[i.type],o=qi[i.componentType],a=i.normalized===!0,c=new o(i.count*r);return Promise.resolve(new oe(c,r,a))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(r){let o=r[0],a=Tc[i.type],c=qi[i.componentType],u=c.BYTES_PER_ELEMENT,h=u*a,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,m,g;if(f&&f!==h){let b=Math.floor(d/f),v="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+b+":"+i.count,M=t.cache.get(v);M||(m=new c(o,b*f,i.count*f/u),M=new Xn(m,f/u),t.cache.add(v,M)),g=new dn(M,a,d%f/u,p)}else o===null?m=new c(i.count*a):m=new c(o,d,i.count*a),g=new oe(m,a,p);if(i.sparse!==void 0){let b=Tc.SCALAR,v=qi[i.sparse.indices.componentType],M=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,A=new v(r[1],M,i.sparse.count*b),E=new c(r[2],_,i.sparse.count*a);o!==null&&(g=new oe(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let C=0,T=A.length;C<T;C++){let R=A[C];if(g.setX(R,E[C*a]),a>=2&&g.setY(R,E[C*a+1]),a>=3&&g.setZ(R,E[C*a+2]),a>=4&&g.setW(R,E[C*a+3]),a>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,r=t.images[s],o=this.textureLoader;if(r.uri){let a=n.manager.getHandler(r.uri);a!==null&&(o=a)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){let i=this,s=this.json,r=s.textures[e],o=s.images[t],a=(o.uri||o.bufferView)+":"+r.sampler;if(this.textureCache[a])return this.textureCache[a];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=r.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);let d=(s.samplers||{})[r.sampler]||{};return u.magFilter=$d[d.magFilter]||en,u.minFilter=$d[d.minFilter]||ti,u.wrapS=Qd[d.wrapS]||Wt,u.wrapT=Qd[d.wrapT]||Wt,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Li&&u.minFilter!==en,i.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[a]=c,c}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let r=i.images[e],o=self.URL||self.webkitURL,a=r.uri||"",c=!1;if(r.bufferView!==void 0)a=n.getDependency("bufferView",r.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:r.mimeType});return a=o.createObjectURL(d),a});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(a).then(function(h){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(m){let g=new ct(m);g.needsUpdate=!0,d(g)}),t.load(Qt.resolveURL(h,s.path),p,void 0,f)})}).then(function(h){return c===!0&&o.revokeObjectURL(a),It(h,r),h.userData.mimeType=r.mimeType||Pv(r.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",a),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),s.extensions[ce.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[ce.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let a=s.associations.get(r);r=s.extensions[ce.KHR_TEXTURE_TRANSFORM].extendTexture(r,o),s.associations.set(r,a)}}return i!==void 0&&(r.colorSpace=i),e[t]=r,r})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,a=this.cache.get(o);a||(a=new pn,Qe.prototype.copy.call(a,n),a.color.copy(n.color),a.map=n.map,a.sizeAttenuation=!1,this.cache.add(o,a)),n=a}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,a=this.cache.get(o);a||(a=new zi,Qe.prototype.copy.call(a,n),a.color.copy(n.color),a.map=n.map,this.cache.add(o,a)),n=a}if(i||s||r){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),r&&(o+="flat-shading:");let a=this.cache.get(o);a||(a=n.clone(),s&&(a.vertexColors=!0),r&&(a.flatShading=!0),i&&(a.normalScale&&(a.normalScale.y*=-1),a.clearcoatNormalScale&&(a.clearcoatNormalScale.y*=-1)),this.cache.add(o,a),this.associations.set(a,this.associations.get(n))),n=a}e.material=n}getMaterialType(){return Fe}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],r,o={},a=s.extensions||{},c=[];if(a[ce.KHR_MATERIALS_UNLIT]){let h=i[ce.KHR_MATERIALS_UNLIT];r=h.getMaterialType(),c.push(h.extendParams(o,s,t))}else{let h=s.pbrMetallicRoughness||{};if(o.color=new L(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],ot),o.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,Z)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=K);let u=s.alphaMode||Ec.OPAQUE;if(u===Ec.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===Ec.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&r!==k&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new U(1,1),s.normalTexture.scale!==void 0)){let h=s.normalTexture.scale;o.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&r!==k&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&r!==k){let h=s.emissiveFactor;o.emissive=new L().setRGB(h[0],h[1],h[2],ot)}return s.emissiveTexture!==void 0&&r!==k&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,Z)),Promise.all(c).then(function(){let h=new r(o);return s.name&&(h.name=s.name),It(h,s),t.associations.set(h,{materials:e}),s.extensions&&si(i,h,s),h})}createUniqueName(e){let t=ye.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[ce.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(a){return ef(a,o,t)})}let r=[];for(let o=0,a=e.length;o<a;o++){let c=e[o],u=Cv(c),h=i[u];if(h)r.push(h.promise);else{let d;c.extensions&&c.extensions[ce.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=ef(new le,c,t),c.mode===ft.TRIANGLE_STRIP?d=d.then(f=>_c(f,zs)):c.mode===ft.TRIANGLE_FAN&&(d=d.then(f=>_c(f,Vi))),i[u]={primitive:c,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,o=[];for(let a=0,c=r.length;a<c;a++){let u=r[a].material===void 0?Tv(this.cache):this.getDependency("material",r[a].material);o.push(u)}return o.push(t.loadGeometries(r)),Promise.all(o).then(async function(a){let c=a.slice(0,a.length-1),u=a[a.length-1],h=[];for(let f=0,p=u.length;f<p;f++){let m=u[f],g=r[f],b,v=c[f];if(g.mode===ft.TRIANGLES||g.mode===ft.TRIANGLE_STRIP||g.mode===ft.TRIANGLE_FAN||g.mode===void 0){let M=s.isSkinnedMesh===!0,_=m.hasAttribute("skinIndex")&&m.hasAttribute("skinWeight");M&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),b=M&&_?new As(m,v):new B(m,v),b.isSkinnedMesh===!0&&b.normalizeSkinWeights()}else if(g.mode===ft.LINES)b=new Es(m,v);else if(g.mode===ft.LINE_STRIP)b=new Yn(m,v);else if(g.mode===ft.LINE_LOOP)b=new Rs(m,v);else if(g.mode===ft.POINTS)b=new _t(m,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(b.geometry.morphAttributes).length>0&&Rv(b,s),b.name=t.createUniqueName(s.name||"mesh_"+e),It(b,s),g.extensions&&si(i,b,g),t.assignFinalMaterial(b),h.push(b)}for(let f=0,p=h.length;f<p;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return s.extensions&&si(i,h[0],s),h[0];let d=new Me;s.extensions&&si(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=h.length;f<p;f++)d.add(h[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new jn(oc.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Hi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),It(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),r=i,o=[],a=[];for(let c=0,u=r.length;c<u;c++){let h=r[c];if(h){o.push(h);let d=new O;s!==null&&d.fromArray(s.array,c*16),a.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ts(o,a)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,r=[],o=[],a=[],c=[],u=[];for(let h=0,d=i.channels.length;h<d;h++){let f=i.channels[h],p=i.samplers[f.sampler],m=f.target,g=m.node,b=i.parameters!==void 0?i.parameters[p.input]:p.input,v=i.parameters!==void 0?i.parameters[p.output]:p.output;m.node!==void 0&&(r.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",b)),a.push(this.getDependency("accessor",v)),c.push(p),u.push(m))}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],f=h[1],p=h[2],m=h[3],g=h[4],b=[];for(let M=0,_=d.length;M<_;M++){let A=d[M],E=f[M],C=p[M],T=m[M],R=g[M];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();let I=n._createAnimationTracks(A,E,C,T,R);if(I)for(let P=0;P<I.length;P++)b.push(I[P])}let v=new Zn(s,void 0,b);return It(v,i),v})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&r.traverse(function(o){if(o.isMesh)for(let a=0,c=i.weights.length;a<c;a++)o.morphTargetInfluences[a]=i.weights[a]}),r})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),r=[],o=i.children||[];for(let c=0,u=o.length;c<u;c++)r.push(n.getDependency("node",o[c]));let a=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),a]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Iv)});for(let f=0,p=h.length;f<p;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){let f=u.userData.pivot,p=h[0];u.pivot=new w().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],p.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],r=s.name?i.createUniqueName(s.name):"",o=[],a=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return a&&o.push(a),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(s.isBone===!0?u=new Bi:c.length>1?u=new Me:c.length===1?u=c[0]:u=new Re,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=r),It(u,s),s.extensions&&si(n,u,s),s.matrix!==void 0){let h=new O;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);if(!i.associations.has(u))i.associations.set(u,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let h=i.associations.get(u);i.associations.set(u,{...h})}return i.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new Me;n.name&&(s.name=i.createUniqueName(n.name)),It(s,n),n.extensions&&si(t,s,n);let r=n.nodes||[],o=[];for(let a=0,c=r.length;a<c;a++)o.push(i.getDependency("node",r[a]));return Promise.all(o).then(function(a){for(let u=0,h=a.length;u<h;u++){let d=a[u];d.parent!==null?s.add(Yo(d)):s.add(d)}let c=u=>{let h=new Map;for(let[d,f]of i.associations)(d instanceof Qe||d instanceof ct)&&h.set(d,f);return u.traverse(d=>{let f=i.associations.get(d);f!=null&&h.set(d,f)}),h};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){let r=[],o=e.name?e.name:e.uuid,a=[];function c(f){f.morphTargetInfluences&&a.push(f.name?f.name:f.uuid)}xn[s.path]===xn.weights?(c(e),e.isGroup&&e.children.forEach(c)):a.push(o);let u;switch(xn[s.path]){case xn.weights:u=jt;break;case xn.rotation:u=Jt;break;case xn.translation:case xn.scale:u=mn;break;default:n.itemSize===1?u=jt:u=mn;break}let h=i.interpolation!==void 0?Av[i.interpolation]:Wn,d=this._getArrayFromAccessor(n);for(let f=0,p=a.length;f<p;f++){let m=new u(a[f]+"."+xn[s.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),r.push(m)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=$c(t.constructor),i=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Jt?jc:Ko;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Lv(l,e,t){let n=e.attributes,i=new Ie;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],a=o.min,c=o.max;if(a!==void 0&&c!==void 0){if(i.set(new w(a[0],a[1],a[2]),new w(c[0],c[1],c[2])),o.normalized){let u=$c(qi[o.componentType]);i.min.multiplyScalar(u),i.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let o=new w,a=new w;for(let c=0,u=s.length;c<u;c++){let h=s[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(a.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),a.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),a.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let m=$c(qi[d.componentType]);a.multiplyScalar(m)}o.max(a)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}l.boundingBox=i;let r=new X;i.getCenter(r.center),r.radius=i.min.distanceTo(i.max)/2,l.boundingSphere=r}function ef(l,e,t){let n=e.attributes,i=[];function s(r,o){return t.getDependency("accessor",r).then(function(a){l.setAttribute(o,a)})}for(let r in n){let o=Jc[r]||r.toLowerCase();o in l.attributes||i.push(s(n[r],o))}if(e.indices!==void 0&&!l.index){let r=t.getDependency("accessor",e.indices).then(function(o){l.setIndex(o)});i.push(r)}return qe.workingColorSpace!==ot&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${qe.workingColorSpace}" not supported.`),It(l,e),Lv(l,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Ev(l,e.targets,t):l})}var nf={head:1.3,thigh_l:.9,thigh_r:.9,upperarm_l:.9,upperarm_r:.9,spine_01:.95},sf=[16734815,4171775,16765503,6213994,16748497,16751421,10185727],jo=class{constructor(e,t){x(this,"g",e);x(this,"stats",{kids:0,families:0,visible:0});x(this,"gl",[]);x(this,"pool",[]);x(this,"group",new Me);x(this,"cap");x(this,"shadows");x(this,"v",new w);let n=e.real.q.name;this.cap=n==="low"?3:n==="med"?8:14,this.shadows=!t,this.group.name="aw:kids",e.scene.add(this.group);let i=new Yi;Promise.all(["ped_maya","ped_sam"].map(s=>i.loadAsync(`./models/${s}.glb`))).then(s=>{this.gl=s,console.info("[aw-kids] models",s.map(r=>r.animations.map(o=>o.name).join("|")))}).catch(s=>console.warn("[aw-kids]",s))}make(e){if(!this.gl.length)return null;let t=this.gl[e%this.gl.length],n=Yo(t.scene);n.rotation.y=Math.PI;let i=new Me;i.add(n),i.scale.setScalar(.6+e%3*.04);let s=new L(sf[e%sf.length]),r=[];n.traverse(h=>{let d=h;if((d.isMesh||d.isSkinnedMesh)&&(d.castShadow=this.shadows,d.frustumCulled=!1,/accessory|held/i.test(d.name)&&(d.visible=!1),d.material)){let f=d.material.clone();/top/i.test(f.name||"")&&f.color&&f.color.copy(s),h.material=f}nf[h.name]&&r.push([h,nf[h.name]])});let o=new Us(n),a=h=>t.animations.find(d=>d.name===h)||t.animations[0],c=o.clipAction(a("Walk_Brisk")),u=o.clipAction(a("Jog"));return c.play(),u.play(),u.setEffectiveWeight(0),c.time=Math.random()*c.getClip().duration,i.visible=!1,this.group.add(i),this.stats.kids++,{root:i,inner:n,mixer:o,walk:c,jog:u,bones:r,ped:null,slot:0}}update(e){let t=this.g.real.amb;if(!t||!this.gl.length)return;let n=this.g.camera.position,i=this.g.real;for(let a of t.peds)if(a.pedFlip=1,a.rd!==a.__rd){a.__rd=a.rd;for(let c of this.pool)c.ped===a&&(c.ped=null,c.root.visible=!1);if(a.__fam=0,a.rd&&Math.random()<.4){let c=Math.random();a.__fam=c<.06?3:c<.5?2:1;for(let u=0;u<a.__fam;u++){let h=this.pool.find(d=>!d.ped);if(!h&&this.pool.length<this.cap){let d=this.make(this.pool.length);d&&(this.pool.push(d),h=d)}if(!h)break;h.ped=a,h.slot=u}}}let s=0,r=0,o=new Set;for(let a of this.pool){let c=a.ped;if(!c||!c.rd||!c.g.visible){a.root.visible=!1;continue}let u=c.g.position;if(n.distanceToSquared(u)>19600){a.root.visible=!1;continue}o.has(c)||(o.add(c),r++);let h=c.g.rotation.y,d=-Math.sin(h),f=-Math.cos(h),p=a.slot===1?-1:1,m=a.slot===2?0:.75*p,g=a.slot===2?.9:.15,b=u.x+f*m-d*g,v=u.z-d*m-f*g;a.root.position.set(b,i.surfaceAt(b,v)+.02,v),a.root.rotation.y=h,a.root.visible=!0,s++;let M=c.sp||1.3,_=a.root.scale.x,A=M/(1.8*_),E=A>1.45?1:0;if(a.walk.setEffectiveWeight(1-E),a.jog.setEffectiveWeight(E),a.walk.timeScale=Math.min(1.6,A),a.jog.timeScale=Math.min(1.3,M/(3.2*_)),a.applied)for(let[C,T]of a.bones)C.scale.divideScalar(T);a.mixer.update(e),a.applied=!0;for(let[C,T]of a.bones)C.scale.multiplyScalar(T)}this.stats.visible=s,this.stats.families=r}};var Be=()=>performance.now();function Dv(l){if(!l.length)return null;let e=new Map;for(let i of l){let s=i.geometry.attributes.position.array,r=i.material.uuid+"|"+Math.floor((s[0]+s[3]+s[6])/3/80)+","+Math.floor((s[2]+s[5]+s[8])/3/80),o=e.get(r);o||e.set(r,o=[]),o.push(i)}let t=l[0].parent.constructor,n=new t;for(let i of e.values()){let s=i[0],r=Object.keys(s.geometry.attributes),o=i.every(a=>!a.geometry.index&&Object.keys(a.geometry.attributes).join()===r.join());if(i.length>1&&o){let a=new s.geometry.constructor;for(let c of r){let u=0;for(let p of i)u+=p.geometry.attributes[c].array.length;let h=new Float32Array(u),d=s.geometry.attributes[c],f=0;for(let p of i)h.set(p.geometry.attributes[c].array,f),f+=p.geometry.attributes[c].array.length;a.setAttribute(c,new d.constructor(h,d.itemSize,d.normalized))}a.computeBoundingSphere();for(let c of i)c.geometry.dispose();s.geometry=a,n.add(s)}else for(let a of i)n.add(a)}return n}var Jo=class{constructor(e=4){x(this,"budget",e);x(this,"stats",{roadSlices:0,bldSlices:0,streetSlices:0,maxSlice:0,msPerM:0,msPerB:0,msPerW:0,stageMax:{}});let t=window;t.__awRoadJob=(n,i)=>this.roadJob(n,i),t.__awBldJob=(n,i,s)=>this.bldJob(n,i,s),t.__awStreetJob=(n,i)=>this.streetJob(n,i)}streetJob(e,t){let n=t.st,i=(c,u)=>Object.assign(Object.create(t),{st:{cars:[],walls:[],signs:[],...c},json:u}),s=[],r=[];if(n){let c=n.cars||[],u=Math.max(1,Math.round(this.budget*12));for(let p=0;p<c.length;p+=u){let m=c.slice(p,p+u);s.push(()=>t.group.add(e.streets.build(i({cars:m},null)))),r.push("cars")}s.push(()=>t.group.add(e.streets.build(i({},t.json)))),r.push("furniture");let h=n.walls||[],d=[],f=0;s.push(()=>{let p=Be();for(;f<h.length;){let m=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerW||1))),g=Be(),b=h.slice(f,f+m);e.streets.build(i({walls:b},null)).traverse(M=>{M.isMesh&&d.push(M)});let v=(Be()-g)/b.length;if(this.stats.msPerW=this.stats.msPerW?this.stats.msPerW*.8+v*.2:v,f+=b.length,Be()-p>this.budget*.6)return!1}return!0}),r.push("walls"),s.push(()=>{let p=Dv(d);p&&t.group.add(p)}),r.push("wallsMerge"),s.push(()=>t.group.add(e.streets.build(i({signs:n.signs||[]},null)))),r.push("signs"),n.pools&&n.pools.length&&(s.push(()=>t.group.add(e.marks.pools({pools:n.pools}))),r.push("pools"))}let o=0,a=()=>{let c=Be();for(;o<s.length;){let u=Be(),h=s[o]()!==!1,d=Be()-u,f=r[o];if(h&&o++,d>(this.stats.stageMax[f]||0)&&(this.stats.stageMax[f]=+d.toFixed(1)),Be()-c>this.budget*.6)break}this.stats.streetSlices++,this.note(Be()-c),o<s.length&&e.queue.unshift({R:t,f:a})};return a}note(e){e>this.stats.maxSlice&&(this.stats.maxSlice=e)}roadJob(e,t){let n=t.json.roads,i=n.map(h=>{let d=0;for(let f=1;f<h.p.length;f++)d+=Math.hypot(h.p[f][0]-h.p[f-1][0],h.p[f][1]-h.p[f-1][1]);return d+20}),s=0,r=null,o=null,a=!1,c=h=>{let d=e.roadGrid(h);for(let[f,p]of d){let m=o.get(f);m?m.push(...p):o.set(f,p)}},u=()=>{let h=Be();for(r||(r=e.junctionsNear(t),o=new Map);!a;){let d=Math.max(60,this.budget*.8/(this.stats.msPerM||.004)),f=s,p=0;for(;f<n.length&&(f===s||p+i[f]<d);)p+=i[f++];let m=Be(),g=f>=n.length&&s>=n.length,b=g?e.roads.build({roads:[],junc:t.json.junc},r):e.roads.build({roads:n.slice(s,f),junc:[]},r);if(b.traverse(v=>{v.name=v.name||(g?"plate":"road")}),t.roadMesh?(t.roadMesh.add(b),c(b)):(t.roadMesh=b,t.group.add(b),c(b)),!g&&p>0){let v=(Be()-m)/p;this.stats.msPerM=this.stats.msPerM?this.stats.msPerM*.8+v*.2:v}if(g?a=!0:s=f,Be()-h>this.budget*.6)break}t.roadGrid=o,this.stats.roadSlices++,this.note(Be()-h),a||e.queue.unshift({R:t,f:u})};return u}bldJob(e,t,n){let i=0,s=()=>{let r=Be();for(;i<n.length;){let o=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerB||.5))),a=n.slice(i,i+o),c=Be(),u=e.buildings.build({b:a});u.traverse(d=>{d.isMesh&&(d.name="bld:"+(d.material.name||d.material.type))}),t.group.add(u);let h=(Be()-c)/a.length;if(this.stats.msPerB=this.stats.msPerB?this.stats.msPerB*.8+h*.2:h,i+=a.length,Be()-r>this.budget*.6)break}this.stats.bldSlices++,this.note(Be()-r),i<n.length&&e.queue.unshift({R:t,f:s})};return s}};var $o=class{constructor(e){x(this,"g",e);x(this,"on",!1);x(this,"n",0);x(this,"stats",{aoHalf:!1,shadowEvery:1,a2c:0});x(this,"a2c",new WeakSet);x(this,"scanT",0);let t=e.real?.q;if(!t||t.name!=="high")return;this.on=!0,window.__awAoT=5e3;let n=window.__awPost;if(n&&n.ao){let i=n.ao,s=i.setSize.bind(i);i.setSize=(r,o)=>s(Math.max(1,Math.ceil(r/2)),Math.max(1,Math.ceil(o/2))),i.updateGtaoMaterial({samples:8}),i.updatePdMaterial({samples:8}),n.resize(),this.stats.aoHalf=!0}this.stats.shadowEvery=2}coverage(){this.g.scene.traverse(e=>{let t=e.material;if(t)for(let n of Array.isArray(t)?t:[t])this.a2c.has(n)||(this.a2c.add(n),n.alphaTest>0&&!n.transparent&&!n.alphaToCoverage&&(n.alphaToCoverage=!0,n.needsUpdate=!0,this.stats.a2c++))})}frame(){if(!this.on)return;this.stats.aoHalf&&(this.scanT-=1/60)<=0&&(this.scanT=3,this.coverage());let e=this.g.renderer.shadowMap;e.autoUpdate=!1,(this.n++&1)===0&&(e.needsUpdate=!0)}};var Qo=class{constructor(e){x(this,"on",!1);x(this,"stats",{water:!1,veg3d:0});let t=e.real;if(!t||!t.q||t.q.name!=="high")return;this.on=!0;let n=t.water?.nrm;n&&H.get("hlwater")!=="0"&&(n.anisotropy=16,n.needsUpdate=!0,this.stats.water=!0),H.get("hlveg")!=="0"&&(t.q.veg3d=340),this.stats.veg3d=t.q.veg3d}};var rf=new Map,ea=new Map,Zi=new He(1,1,1);function pt(l,e,t=.5,n=.1){let i=ea.get(l);return i||(i=new Fe({color:e,roughness:t,metalness:n}),ea.set(l,i)),i}function Lt(l,e,t=512,n=128,i=.42,s=.1){let r=ea.get(l);if(r)return r;let o=rf.get(l);if(!o){let a=document.createElement("canvas");a.width=t,a.height=n;let c=a.getContext("2d");e(c,t,n),o=new re(a),o.colorSpace=Z,o.flipY=!1,o.anisotropy=4,rf.set(l,o)}return r=new Fe({map:o,roughness:i,metalness:s}),ea.set(l,r),r}function nt(l,e,t,n,i,s,r="bold",o="left",a="Arial, Helvetica, sans-serif"){l.font=`${r} ${i}px ${a}`,l.fillStyle=s,l.textAlign=o,l.textBaseline="middle",l.fillText(e,t,n)}function Nv(l,e,t,n){l.save(),l.translate(e,t),l.scale(n,n),l.beginPath(),l.moveTo(-18,-30),l.lineTo(18,-30),l.lineTo(18,8),l.quadraticCurveTo(0,32,-18,8),l.closePath(),l.fillStyle="#1d4fb3",l.fill(),l.lineWidth=3,l.strokeStyle="#0d2a66",l.stroke(),l.fillStyle="#e9eef6",l.fillRect(-11,-22,22,22),l.fillStyle="#2e8b3a",l.beginPath(),l.ellipse(-14,10,6,13,.5,0,6.3),l.ellipse(14,10,6,13,-.5,0,6.3),l.fill(),l.fillStyle="#9aa3ad",l.fillRect(-2,-26,4,40),l.fillStyle="#1d4fb3",l.fillRect(-14,22,28,6),l.restore()}function of(l,e){return(t,n,i)=>{t.fillStyle="#f4f5f7",t.fillRect(0,0,n,i);let s=r=>(e?r:1-r)*n;t.fillStyle="#1747b8",t.fillRect(0,i*.3,n,i*.17),t.fillStyle="#f2c81e",t.fillRect(0,i*.5,n,i*.035),t.fillRect(0,i*.555,n,i*.02),Nv(t,s(.36),i*.42,1.05),nt(t,"POLIS",s(.62),i*.385,38,"#ffffff","bold","center"),nt(t,"Servicio, Integridad, Seguridad.",s(.47),i*.7,19,"#c8202a","bold","center"),nt(t,String(l),s(.13),i*.18,30,"#111","bold","center"),nt(t,"\u260E100",s(.8),i*.18,24,"#1747b8","bold","center"),nt(t,String(l),s(.93),i*.42,34,"#111","bold","center"),t.strokeStyle="#1747b8",t.lineWidth=7;for(let r=0;r<2;r++)t.beginPath(),t.moveTo(s(.84+r*.035),i*.47),t.lineTo(s(.87+r*.035),i*.3),t.stroke()}}function af(l){return(e,t,n)=>{e.fillStyle="#f4f5f7",e.fillRect(0,0,t,n);let i=s=>(l?s:1-s)*t;e.fillStyle="#1f3b73",e.fillRect(0,n*.6,t,n*.05),nt(e,"ForenSys",i(.45),n*.36,44,"#1f3b73","bold","center"),nt(e,"ARUBA \xB7 Accident Registration",i(.45),n*.52,16,"#1f3b73","bold","center")}}function lf(l,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;if(t.fillStyle=l?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),l)t.strokeStyle="#ffffff",t.lineWidth=16,t.beginPath(),t.moveTo(s(.05),i*.62),t.bezierCurveTo(s(.35),i*.85,s(.55),i*.15,s(.95),i*.45),t.stroke(),t.strokeStyle="#8f6fb8",t.lineWidth=5,t.beginPath(),t.moveTo(s(.05),i*.66),t.bezierCurveTo(s(.35),i*.9,s(.55),i*.2,s(.95),i*.5),t.stroke(),t.fillStyle="#ffffff",t.fillRect(s(.42)-46,i*.22,92,30),nt(t,"InSan",s(.42),i*.22+15,24,"#2b6cc4","bold","center");else{t.fillStyle="#1f3a9c",t.fillRect(0,i*.5,n,i*.09),t.fillStyle="#e8ef1c",t.fillRect(s(.42)-n*.36,i*.5,n*.72,i*.09),nt(t,"AMBULANCE",s(.42),i*.545,30,"#1f3a9c","bold","center"),t.fillStyle="#1f3a9c",t.beginPath();let r=s(.06),o=s(0);t.moveTo(r,i*.5),t.lineTo(o,i*.5),t.lineTo(o,i*.59),t.fill()}}}function cf(l,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;t.fillStyle=l?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),l?(t.fillStyle="#ffffff",t.fillRect(0,i*.3,n,i*.05)):(t.fillStyle="#1f3a9c",t.fillRect(0,i*.3,n,i*.12)),nt(t,"911",s(.55),i*.62,44,l?"#ffffff":"#c8202a","bold","center"),l||nt(t,"PA SALBA BO BIDA",s(.55),i*.8,13,"#c8202a","bold","center")}}function eu(l,e,t,n,i,s,r){return Lt(l,o=>{o.fillStyle=e,o.fillRect(0,0,s,r),nt(o,t,s/2,r/2,i,n,"bold","center")},s,r)}function Ov(l){return Lt("evPlate"+l,(e,t,n)=>{e.fillStyle="#f4f2ea",e.fillRect(0,0,t,n),e.strokeStyle="#1d3f8a",e.lineWidth=4,e.strokeRect(3,3,t-6,n-6),nt(e,"ARUBA",t/2,13,12,"#1d3f8a","bold","center"),nt(e,`A-${1e4+l*37}`,t/2,40,34,"#1d3f8a","bold","center")},256,64,.4,0)}var Hs=null,uf=null;function Vs(){return uf||(uf=new Yi().loadAsync("./models/ev.glb?v=e1").then(l=>{let e=[];l.scene.traverse(t=>{var s;let n=/^ev(\d)_(?:L(\d)_([a-z]+)|(bar|mk))$/.exec(t.name);if(!n)return;let i=e[s=+n[1]]||(e[s]={lods:[new Map,new Map],bar:{p:new w,w:1}});n[3]&&t.isMesh?i.lods[+n[2]].set(n[3],t.geometry):n[4]==="bar"?i.bar={p:t.position.clone(),w:t.scale.x}:n[4]==="mk"&&(i.mk=t.position.clone())}),Hs=e}).catch(l=>{console.warn("[aw-ev] models/ev.glb",l)}))}var Ws=()=>!!Hs,Fv={everest:0,forensys:0,isuzu:1,ambY:2,ambP:2},Uv=45;function Bv(l,e){let t=l==="ambY"||l==="ambP",n=l==="ambP",i=l==="forensys",s=t?n?"#f29ac4":"#e8ef1c":"#f4f5f7",r=pt("evPaint"+s,s,.42,.1),o={paint:r,glass:pt("evGlass","#121a21",.08,.6),dark:pt("evDark","#1c1d20",.8,.05),chrome:pt("evChrome","#d6d9dc",.18,.95),light:pt("evLight","#eef2f5",.15,.3),tail:pt("evTail","#a3151a",.3,.1),plate:Ov(e)};return t?(o.livr=Lt("abR"+l,lf(n,!0),512,264),o.livl=Lt("abL"+l,lf(n,!1),512,264),o.cabr=Lt("acR"+l,cf(n,!0),256,192),o.cabl=Lt("acL"+l,cf(n,!1),256,192),o.rear=eu("aback"+l,s,n?"InSan  911":"AMBULANCE",n?"#ffffff":"#1f3a9c",40,512,122)):i?(o.livr=Lt("fsR",af(!0),768,128),o.livl=Lt("fsL",af(!1),768,128),o.hood=o.rear=r):(o.livr=Lt(`pR${e}`,of(e,!0),768,128),o.livl=Lt(`pL${e}`,of(e,!1),768,128),o.hood=eu("hoodPolis","#f4f5f7","POLIS","#1747b8",64,256,128),o.rear=eu(`rear${e}`,"#f4f5f7",`\u260E100   ${e}`,"#1747b8",44,512,76)),o}function df(l){let e=pt("evLight","#eef2f5",.15,.3),t=pt("evTail","#a3151a",.3,.1);e.emissive.setRGB(1,.95,.85).multiplyScalar(l*.6),t.emissive.setRGB(1,.12,.06).multiplyScalar(l),t.emissiveIntensity=1+2*l}var zv=(()=>{let l=new Ge(.5,12,6),e=l.attributes.position,t=n=>Math.sign(n)*Math.abs(2*n)**.3/2;for(let n=0;n<e.count;n++)e.setXYZ(n,t(e.getX(n)),t(e.getY(n)),t(e.getZ(n)));return l})(),hf=(l,e,t,n,i,s,r,o)=>{let a=new B(zv,new k({color:e,toneMapped:!1}));return a.scale.set(s,r,o),a.position.set(t,n,i),a.name="aw:ebar",l.add(a),a};function Xs(l,e=45){let t=new Me;t.name="aw:ev:"+l;let n=l==="ambY"||l==="ambP",s={g:t,bar:[],colors:l==="forensys"?[16752640,16752640]:n?[16715784,16777215]:[16715784,1720575]},r=()=>{let o=Hs&&Hs[Fv[l]];if(!o)return;let a=Bv(l,e),c=new Ss;c.name="aw:evlod",o.lods.forEach((d,f)=>{let p=new Me;for(let[m,g]of d){let b=a[m];if(!b)continue;let v=new B(g,b);v.castShadow=f===0,v.matrixAutoUpdate=!1,p.add(v)}c.addLevel(p,f?Uv:0),p.visible=f===0}),t.add(c);let{p:u,w:h}=o.bar;for(let d of[-1,1])s.bar.push(hf(t,2105380,d*h*.25,u.y+.05,u.z,h*.48,.1,.26));if(n&&o.mk)for(let d of[-1,1])s.bar.push(hf(t,5246992,d*o.mk.x,o.mk.y,o.mk.z,.22,.14,.05))};return Hs?r():Vs().then(r),s}var kv=new Ge(.12,10,8);function qs(l,e,t=!1){let n=new Me;n.name="aw:npc";let i=pt("skin"+(Math.random()*3|0),["#8a5a3a","#b07a52","#d2a07a"][Math.random()*3|0],.7,0),s=pt("shirt"+l,l,.8,0),r=pt("pants"+e,e,.8,0),o=new B(Zi,r);o.scale.set(.14,.82,.16),o.position.set(-.09,.41,0),o.geometry=Zi;let a=o.clone();a.position.x=.09,n.add(o,a);let c=new B(Zi,s);c.scale.set(.4,.6,.22),c.position.set(0,1.12,0),n.add(c);let u=new B(kv,i);u.position.set(0,1.56,0),n.add(u);let h=p=>{let m=new Me;m.position.set(p*.25,1.38,0);let g=new B(Zi,s);return g.scale.set(.1,.62,.11),g.position.y=-.31,m.add(g),n.add(m),m},d=h(-1),f=h(1);if(t){let p=new B(Zi,pt("tablet","#202326",.3,.2));p.scale.set(.24,.32,.02),p.position.set(0,-.6,.12),f.add(p);let m=new B(Zi,new k({color:9422591,toneMapped:!1}));m.scale.set(.2,.27,.005),m.position.set(0,-.6,.135),f.add(m),f.rotation.x=-.9}return{g:n,armL:d,armR:f,legL:o,legR:a,t:Math.random()*10}}function Ki(l,e,t,n=!1){if(l.t+=e,t==="walk"){let i=Math.sin(l.t*7)*.5;l.legL.rotation.x=i,l.legR.rotation.x=-i,l.armL.rotation.x=-i*.8,n||(l.armR.rotation.x=i*.8)}else if(l.legL.rotation.x=l.legR.rotation.x=0,t==="talk"){let i=Math.sin(l.t*2.3),s=Math.sin(l.t*3.1+1);l.armL.rotation.x=-.6-.5*Math.max(0,i),l.armL.rotation.z=-.25*s,n||(l.armR.rotation.x=-.4-.6*Math.max(0,s),l.armR.rotation.z=.3*i)}else l.armL.rotation.x=0,n||(l.armR.rotation.x=0);n&&(l.armR.rotation.x=t==="talk"?-.9-.4*Math.max(0,Math.sin(l.t*.7)):-.9)}function ji(l,e,t,n){let i=(e+t)*2.5%1,s=Math.floor(i*8);l.bar.forEach((r,o)=>{let a=r.material,c=o%2===0,u=n&&(c?s<4&&(s&1)===0:s>=4&&(s&1)===0);a.color.setHex(u?c?l.colors[0]:l.colors[1]:2105380),u&&a.color.multiplyScalar(3)})}function ta(l){l.traverse(e=>{let t=e;t.isMesh&&t.material&&t.material.isMeshBasicMaterial&&t.material.dispose()})}var ff=new He(1,1,1),na=new L(1,.06,.04),Gv=new L(.1,.25,1),Hv=new L(1,1,1),Ys=new L(.12,.12,.14),tu={police:{body:"#f4f5f7",stripe:"#1747b8",a:na,b:Gv},amb:{body:"#f6f6f2",stripe:"#d0121b",a:na,b:Hv},fire:{body:"#b5141c",stripe:"#f3f3f3",a:na,b:na}};function Vv(l,e,t,n){let i=l.children.filter(m=>m.isMesh&&m.material===e);if(!i.length)return null;l.updateMatrixWorld(!0);let s=l.matrixWorld.clone().invert(),r=new Qn,o=new w,a=new w,c=24,u=t.min.z+(t.max.z-t.min.z)*.07,h=t.max.z-(t.max.z-t.min.z)*.07,d=(m,g,b)=>{o.set(m*(t.max.x+1),g,b).applyMatrix4(l.matrixWorld),a.set(-m,0,0).transformDirection(l.matrixWorld),r.set(o,a);let v=r.intersectObjects(i,!1)[0];if(!v)return null;let M=v.point.applyMatrix4(s);return M.x+=m*.012,M},f=[];for(let m of[-1,1]){let g=null;for(let b=0;b<=c;b++){let v=u+(h-u)*b/c,M=d(m,n-.08,v),_=d(m,n+.08,v),A=M&&_?[M,_]:null;if(g&&A){let[E,C]=m>0?[A,g]:[g,A];f.push(E[0].x,E[0].y,E[0].z,C[0].x,C[0].y,C[0].z,C[1].x,C[1].y,C[1].z,E[0].x,E[0].y,E[0].z,C[1].x,C[1].y,C[1].z,E[1].x,E[1].y,E[1].z)}g=A}}if(!f.length)return null;let p=new le;return p.setAttribute("position",new de(f,3)),p}var ia=class{constructor(e){x(this,"g",e);x(this,"stats",{police:0,amb:0,fire:0,active:0,rolls:0});x(this,"st",new Map);x(this,"force",H.get("emerg")==="force");x(this,"time",0);x(this,"night",-1);x(this,"ext",null);Vs()}pickRole(){if(this.stats.rolls++,!this.force&&Math.random()>=.1)return null;let e=Math.random()*10;return e<6?"police":e<9?"amb":"fire"}setup(e,t){let n=this.g.real.amb?.mats||{},i=new Set(Object.values(n)),s=new Ie;for(let f of e.g.children){let p=f;if(!p.isMesh||p.name.startsWith("aw:"))continue;p.geometry.computeBoundingBox(),s.union(p.geometry.boundingBox);let m=p.material;!t.paint&&!Array.isArray(m)&&!i.has(m)&&!m.userData?.pid&&m.color&&(t.paint=m)}t.box=s,t.paint&&(t.base={c:t.paint.color.clone(),r:t.paint.roughness,m:t.paint.metalness,cc:t.paint.clearcoat});let r=s.max.x-s.min.x,o=s.max.z-s.min.z,a=s.max.y,c=s.min.z+o*.55;t.bar=[-1,1].map(f=>{let p=new B(ff,new k({color:Ys,toneMapped:!1}));return p.scale.set(r*.3,.12,.28),p.position.set(f*r*.16,a+.06,c),p.name="aw:ebar",p.visible=!1,e.g.add(p),p});let u=s.min.y+(a-s.min.y)*.42,h=t.paint?Vv(e.g,t.paint,s,u):null,d=new B(h||ff,new k({color:16777215}));h||(d.scale.set(r+.03,.16,o*.86),d.position.set(0,u,(s.min.z+s.max.z)/2)),d.name="aw:estripe",d.visible=!1,e.g.add(d),t.stripe=d}useModel(e,t,n){t.orig||(t.orig=e.g.children.filter(o=>!o.name.startsWith("aw:"))),t.model&&(e.g.remove(t.model.g),ta(t.model.g),t.model=void 0);let i=(n==="police"||n==="amb")&&Ws();for(let o of t.orig)o.visible=!i;if(!i)return;let s=n==="police"?Math.random()<.6?"everest":"isuzu":Math.random()<.5?"ambY":"ambP",r=Xs(s,[45,50,67,38,71][Math.random()*5|0]);e.g.add(r.g),t.model=r,t.mkind=s}apply(e,t,n){if(t.role&&this.stats[t.role]--,t.role=n,n&&this.stats[n]++,this.useModel(e,t,n),t.model){if(t.bar)for(let s of t.bar)s.visible=!1;t.stripe&&(t.stripe.visible=!1),t.on=Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10;return}n&&!t.bar&&this.setup(e,t);let i=t.paint;if(i&&t.base&&(n?(i.color.set(tu[n].body),i.roughness=.45,i.metalness=.1):(i.color.copy(t.base.c),i.roughness=t.base.r,i.metalness=t.base.m)),t.bar)for(let s of t.bar)s.visible=!!n;t.stripe&&(t.stripe.visible=!!n,n&&t.stripe.material.color.set(tu[n].stripe)),t.on=!!n&&Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10}update(e){this.time+=e;let t=Math.round(Math.max(0,Math.min(1,(Ue.value-.3)/.4))*50)/50;t!==this.night&&(this.night=t,df(t));let i=this.g.real?.amb?.cars;if(!i)return;let s=0;for(let r of i){let o=this.st.get(r.g);if(o||(o={role:null,rd:null,on:!1,t:0,ph:0},this.st.set(r.g,o)),r.rd&&r.rd!==o.rd?(o.rd=r.rd,this.apply(r,o,this.pickRole())):(o.role==="police"||o.role==="amb")&&!o.model&&Ws()&&this.apply(r,o,o.role),o.role&&o.model){(o.t-=e)<=0&&(o.on=!o.on,o.t=o.on?15+Math.random()*25:10+Math.random()*25),ji(o.model,this.time,o.ph,o.on&&r.g.visible),o.on&&r.g.visible&&s++;continue}if(!o.role||!o.bar)continue;(o.t-=e)<=0&&(o.on=!o.on,o.t=o.on?15+Math.random()*25:10+Math.random()*25);let a=tu[o.role],[c,u]=o.bar,h=c.material,d=u.material;if(o.on&&r.g.visible){s++;let f=(this.time+o.ph)*2.5%1,p=Math.floor(f*8),m=p<4&&(p&1)===0,g=p>=4&&(p&1)===0;h.color.copy(m?a.a:Ys).multiplyScalar(m?3:1),d.color.copy(g?a.b:Ys).multiplyScalar(g?3:1)}else h.color.copy(Ys),d.color.copy(Ys)}this.stats.active=s}};var sa=class{constructor(e,t){x(this,"g",e);x(this,"emerg",t);x(this,"force",H.get("crash")==="force");x(this,"tx",Math.min(10,Math.max(1,+(H.get("crashx")||1))));x(this,"next",this.force?4:60);x(this,"time",0);x(this,"sc",null);x(this,"stats",{scenes:0,active:!1,phase:0,x:0,z:0,police:!1,fs:!1,talk:0,fx:0,fz:0});Vs();let n=H.get("evshow");if(n){let i=()=>{this.amb()?this.showroom(n):setTimeout(i,1e3)};setTimeout(i,3e3)}}amb(){return this.g.real.amb||null}pt(e,t,n,i){let s=e.p,r=0;for(let o=1;o<s.length;o++){let a=s[o][0]-s[o-1][0],c=s[o][1]-s[o-1][1],u=Math.hypot(a,c)||1;if(r+u>=t||o===s.length-1){let h=Math.max(0,Math.min(1,(t-r)/u)),d=a/u,f=c/u;return{x:s[o-1][0]+a*h-f*n,z:s[o-1][1]+c*h+d*n,yaw:i>0?Math.atan2(d,f):Math.atan2(-d,-f)}}r+=u}return{x:s[0][0],z:s[0][1],yaw:0}}len(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}put(e,t,n=0){let i=this.amb();e.position.set(t.x,i.w.surfaceAt(t.x,t.z)+.02,t.z),e.rotation.set(0,t.yaw+n,0)}start(){let e=this.amb();if(!e||e.cars.length<3)return!1;let t=this.g.camera.position,n=e.cars.filter(i=>i.rd&&i.v!==4&&i.g.visible&&!i.g.children.some(s=>s.name.startsWith("aw:ev"))&&i.L>100&&!i.rd.ow&&i.rd.w>=6).map(i=>({c:i,d:Math.hypot(i.g.position.x-t.x,i.g.position.z-t.z)})).filter(i=>i.d>50&&i.d<260).sort((i,s)=>i.d-s.d);for(let{c:i}of n){let s=i.s+i.dir*50;if(s<15||s>i.L-15||(i.dir>0?i.s:i.L-i.s)<40)continue;let o=e.cars.filter(u=>u!==i&&u.v!==4&&!u.g.children.some(h=>h.name.startsWith("aw:ev"))).sort((u,h)=>Math.hypot(h.g.position.x-t.x,h.g.position.z-t.z)-Math.hypot(u.g.position.x-t.x,u.g.position.z-t.z))[0];if(!o)return!1;for(let u of[i,o])e.cars.splice(e.cars.indexOf(u),1);let a=i.dir*Math.min(2.2,i.rd.w/4);o.rd=i.rd,o.g.visible=!0;let c=new Me;return c.name="aw:crash",e.group.add(c),this.sc={rd:i.rd,dirA:i.dir,lat:a,sA:i.s,sB:s,impact:0,A:i,B:o,phase:0,age:0,tCrash:0,root:c,drivers:[],talk:0},this.stats.scenes++,this.stats.active=!0,!0}return!1}clear(){let e=this.sc,t=this.amb();e.root.parent?.remove(e.root),ta(e.root);for(let n of[e.A,e.B])n.rd=null,n.g.visible=!1,n.g.rotation.set(0,n.g.rotation.y,0),t&&t.cars.push(n);this.emerg&&(this.emerg.ext=null),this.sc=null,this.stats.active=!1,this.stats.phase=0}mover(e,t,n,i){let s=Xs(e,[45,50,67][Math.random()*3|0]);return this.sc.root.add(s.g),{m:s,s:t,target:n,lat:i,sp:e==="forensys"?11:15,arrived:!1}}drive(e,t){let n=this.sc,i=n.dirA;if(!e.arrived){let r=(e.target-e.s)*i,o=Math.min(e.sp,Math.max(1.2,r*.8));e.s+=i*o*t,r<.3&&(e.arrived=!0)}let s=e.arrived?e.lat:n.lat+(e.lat-n.lat)*Math.max(0,1-Math.abs(e.target-e.s)/25);this.put(e.m.g,this.pt(n.rd,e.s,s,i))}update(e){e*=this.tx,this.time+=e;let t=this.sc;if(!t){(this.next-=e)<=0&&(this.next=this.force?6:60,(this.g.S&&this.g.S.mode||"walk")!=="plane"&&Ws()&&(this.force||Math.random()<.2)&&this.start());return}t.age+=e,this.stats.phase=t.phase,this.stats.police=!!t.police?.arrived,this.stats.fs=!!t.fs?.arrived,this.stats.talk=Math.round(t.talk),t.fs&&(this.stats.fx=t.fs.m.g.position.x,this.stats.fz=t.fs.m.g.position.z);let n=this.g.camera.position,i=this.pt(t.rd,(t.sA+t.sB)/2,t.lat,t.dirA);if(t.age>260||Math.hypot(i.x-n.x,i.z-n.z)>700){this.clear();return}this.stats.x=i.x,this.stats.z=i.z;let s=t.dirA;if(t.phase===0){let o=9*e;t.sA+=s*o,t.sB-=s*o;let a=(t.sB-t.sA)*s,c=Math.max(0,Math.min(1,1-(a-5)/40));this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s)),this.put(t.B.g,this.pt(t.rd,t.sB,-t.lat+2*t.lat*c,-s)),a<=4.6&&(t.phase=1,t.tCrash=t.age,this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s),.28),this.put(t.B.g,this.pt(t.rd,t.sB,t.lat*.75,-s),-.5),t.A.g.rotation.z=.02);return}let r=t.age-t.tCrash;if(r>3&&t.drivers.length===0)for(let[o,a]of[t.sA-s*1.5,t.sB+s*1.5].entries()){let c=qs(["#2f6fb5","#c8452f","#3f8a4a","#e8c547"][Math.random()*4|0],["#2a2d33","#5a4a3a","#3b4f6b"][Math.random()*3|0]),u=this.pt(t.rd,a,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(c.g,u,o?Math.PI*.5:-Math.PI*.5),t.root.add(c.g),t.drivers.push(c)}for(let o of t.drivers)Ki(o,e,"talk");if(r>8&&!t.police&&(t.police=this.mover(Math.random()<.6?"everest":"isuzu",s>0?0:t.rd.p.length&&this.len(t.rd),t.sA-s*Math.min(13,(s>0?t.sA:this.len(t.rd)-t.sA)-2),t.lat+Math.sign(t.lat||1)*.9)),t.police&&(this.drive(t.police,e),ji(t.police.m,this.time,0,!0),this.emerg)){let o=t.police.m.g.position;this.emerg.ext={d:Math.hypot(o.x-n.x,o.z-n.z),ph:0}}if(t.police?.arrived&&!t.fs&&(t.fs=this.mover("forensys",s>0?0:this.len(t.rd),t.sA-s*Math.min(24,(s>0?t.sA:this.len(t.rd)-t.sA)-1),t.lat+Math.sign(t.lat||1)*.9)),t.fs&&(this.drive(t.fs,e),ji(t.fs.m,this.time,1.3,!t.fs.arrived)),t.fs?.arrived&&!t.staff){t.staff=qs("#1f3b73","#2a2d33",!0);let o=this.pt(t.rd,t.sA-s*22,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(t.staff.g,o),t.root.add(t.staff.g),t.staffPos={x:o.x,z:o.z}}if(t.staff&&t.staffPos){let o=this.pt(t.rd,(t.sA+t.sB)/2,t.lat+Math.sign(t.lat||1)*3.4,s),a=o.x-t.staffPos.x,c=o.z-t.staffPos.z,u=Math.hypot(a,c);if(u>.4){let h=Math.min(u,1.3*e);t.staffPos.x+=a/u*h,t.staffPos.z+=c/u*h,this.put(t.staff.g,{x:t.staffPos.x,z:t.staffPos.z,yaw:Math.atan2(a,c)}),Ki(t.staff,e,"walk",!0)}else{t.talk+=e,Ki(t.staff,e,"talk",!0);let h=t.staff.g.position;t.staff.g.rotation.y=Math.atan2(i.x-h.x,i.z-h.z);for(let d of t.drivers)d.g.rotation.y=Math.atan2(h.x-d.g.position.x,h.z-d.g.position.z)}}}showroom(e){let t=this.amb(),[n,i]=e.split(",").map(Number);if(!t||!isFinite(n))return;let s=new Me;s.name="aw:evshow",t.group.add(s),["everest","isuzu","ambY","ambP","forensys"].forEach((a,c)=>{let u=Xs(a,45),h=n+(c-2)*11;u.g.position.set(h,t.w.surfaceAt(h,i)+.02,i),u.g.rotation.y=Math.PI/2,s.add(u.g),setInterval(()=>ji(u,performance.now()/1e3,c,!0),50)});let r=qs("#1f3b73","#2a2d33",!0);r.g.position.set(n+28,t.w.surfaceAt(n+28,i+4),i+4),s.add(r.g);let o=qs("#c8452f","#3b4f6b");o.g.position.set(n+29,t.w.surfaceAt(n+29,i+4),i+4),o.g.rotation.y=-Math.PI/2,s.add(o.g),setInterval(()=>{Ki(r,.05,"talk",!0),Ki(o,.05,"talk")},50)}};var nu=420,Zs=56,ra=class{constructor(e){x(this,"g");x(this,"marks");x(this,"smoke");x(this,"smokePos",new Float32Array(Zs*3));x(this,"smokeLife",new Float32Array(Zs));x(this,"smokeVel",new Float32Array(Zs*3));x(this,"i",0);x(this,"puff",0);x(this,"smokeClock",0);x(this,"lx",0);x(this,"lz",0);x(this,"tracking",!1);x(this,"lastSpeed",0);x(this,"baseFov",0);x(this,"m",new O);x(this,"q",new Y);x(this,"p",new w);x(this,"sc",new w(1,1,1));x(this,"up",new w(0,1,0));x(this,"mode","");this.g=e;let t=new Zt(.28,1).rotateX(-Math.PI/2),n=new k({color:1053978,transparent:!0,opacity:.56,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2});this.marks=new q(t,n,nu),this.marks.name="aw:vehicle-skids",this.marks.count=0,this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.instanceMatrix.setUsage(ht),e.scene.add(this.marks),this.smokePos.fill(-1e4);let i=new le;i.setAttribute("position",new oe(this.smokePos,3).setUsage(ht));let s=document.createElement("canvas");s.width=s.height=64;let r=s.getContext("2d"),o=r.createRadialGradient(32,32,2,32,32,30);o.addColorStop(0,"rgba(220,225,228,.72)"),o.addColorStop(.42,"rgba(150,158,164,.34)"),o.addColorStop(1,"rgba(90,98,104,0)"),r.fillStyle=o,r.fillRect(0,0,64,64),this.smoke=new _t(i,new pn({map:new re(s),color:12962251,size:.46,transparent:!0,opacity:.25,depthWrite:!1,sizeAttenuation:!0})),this.smoke.name="aw:moto-smoke",this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,e.scene.add(this.smoke);let a=document.createElement("style");a.textContent=`
body.touch.awmoto{--moto-btn:clamp(76px,20.4vw,88px)}
body.touch.awmoto #steerbtns{left:calc(14px + env(safe-area-inset-left));bottom:calc(24px + env(safe-area-inset-bottom));gap:12px}
body.touch.awmoto #steerbtns button{width:var(--moto-btn);height:var(--moto-btn);border-width:3px;background:#121b2bb8;box-shadow:0 4px 14px #0007,0 0 0 2px #0004 inset;font-size:0}
body.touch.awmoto #steerbtns button:before{font-size:calc(var(--moto-btn)*.43);line-height:1}
body.touch.awmoto #steerbtns button[data-act=left]:before{content:"\u25C0"}
body.touch.awmoto #steerbtns button[data-act=right]:before{content:"\u25B6"}
body.touch.awmoto #actions{right:calc(14px + env(safe-area-inset-right));bottom:calc(22px + env(safe-area-inset-bottom));width:calc(var(--moto-btn)*1.9);height:calc(var(--moto-btn)*1.72)}
body.touch.awmoto #actions .grp[data-for=moto].on{display:block!important;position:relative;width:100%;height:100%}
body.touch.awmoto #actions .grp[data-for=moto] button{position:absolute!important;min-width:0!important;touch-action:none;border:3px solid #ffffffdf;box-shadow:0 4px 14px #0007,0 0 0 2px #0003 inset;font-size:13px!important;letter-spacing:.04em}
body.touch.awmoto #actions .grp[data-for=moto] button[data-act=gas]{right:0;bottom:0;width:calc(var(--moto-btn)*.98)!important;height:calc(var(--moto-btn)*1.38)!important;border-radius:24px!important;background:repeating-linear-gradient(0deg,#ffffff24 0 6px,#0000 6px 14px),#218b47dc!important}
body.touch.awmoto #actions .grp[data-for=moto] button[data-act=brake]{left:0;top:0;width:calc(var(--moto-btn)*.86)!important;height:calc(var(--moto-btn)*.86)!important;border-radius:20px!important;background:repeating-linear-gradient(90deg,#ffffff20 0 6px,#0000 6px 14px),#b82c2bdc!important}
body.touch.awmoto #actions .grp[data-for=moto] button.held,body.touch.awmoto #steerbtns button.held{background:#ffd23f!important;color:#20242a!important;transform:scale(.96)}
body.touch.drive:not(.awmoto) #actions .grp[data-for=car].on{grid-template-columns:auto auto!important;align-items:end}
body.touch.drive:not(.awmoto) #actions .grp[data-for=car] button[data-act=gas]{width:calc(var(--db)*.95)!important;height:calc(var(--db)*1.55)!important;border-radius:18px!important;background:repeating-linear-gradient(0deg,#ffffff30 0 6px,#0000 6px 14px),#28aa50b0!important;order:2}
body.touch.drive:not(.awmoto) #actions .grp[data-for=car] button[data-act=brake]{width:calc(var(--db)*1.15)!important;height:calc(var(--db)*.85)!important;border-radius:16px!important;background:repeating-linear-gradient(90deg,#ffffff26 0 6px,#0000 6px 14px),#c83228a8!important;order:1}
@media (orientation:landscape) and (pointer:coarse){
 body.touch.awmoto{--moto-btn:clamp(68px,11.5vw,82px)}
}`,document.head.appendChild(a);let c=window;c.__awMotoEnabled=!0,c.__awMotoCam=(u,h,d,f)=>this.camera(u,h,d,f)}camera(e,t,n,i){let s=window;if(!i){s.__awMotoBump=Math.max(0,(s.__awMotoBump||0)-n*5);return}let r=Math.abs(t.s||0),o=performance.now()*.001,a=Math.max(0,Math.min(1,(r-25)/30)),c=Math.max(0,s.__awMotoBump||0),u=a*.025+c*.2,h=Math.sin(o*23)*u;e.x+=Math.cos(t.h)*h,e.z-=Math.sin(t.h)*h,e.y+=Math.sin(o*31)*u*.65+c*.08-.5,s.__awMotoBump=Math.max(0,c-n*4.5)}spawnSmoke(e){let t=this.puff,n=t*3,i=Math.sin(e.h),s=Math.cos(e.h);this.smokePos[n]=e.x+i*.78+(Math.random()-.5)*.22,this.smokePos[n+1]=e.y+.24+Math.random()*.12,this.smokePos[n+2]=e.z+s*.78+(Math.random()-.5)*.22,this.smokeVel[n]=(Math.random()-.5)*.3,this.smokeVel[n+1]=.38+Math.random()*.22,this.smokeVel[n+2]=(Math.random()-.5)*.3,this.smokeLife[t]=.72+Math.random()*.35,this.puff=(t+1)%Zs}updateSmoke(e){for(let t=0;t<Zs;t++){if(this.smokeLife[t]<=0)continue;let n=t*3;if(this.smokeLife[t]-=e,this.smokeLife[t]<=0){this.smokePos[n+1]=-1e4;continue}this.smokePos[n]+=this.smokeVel[n]*e,this.smokePos[n+1]+=this.smokeVel[n+1]*e,this.smokePos[n+2]+=this.smokeVel[n+2]*e,this.smokeVel[n]*=Math.pow(.2,e),this.smokeVel[n+2]*=Math.pow(.2,e)}this.smoke.geometry.getAttribute("position").needsUpdate=!0}update(e){let t=this.g,n=t.S,i=n.mode==="car"||n.mode==="moto",s=n.mode==="moto";n.mode!==this.mode&&(this.mode=n.mode,document.body.classList.toggle("awmoto",s),this.tracking=!1,this.lastSpeed=0);let r=t.camera;this.baseFov||(this.baseFov=r.fov);let o=n.car,a=i?Math.abs(o.s||0):0,c=s?this.baseFov+Math.min(6,Math.max(0,a-10)*.14):n.mode==="car"?this.baseFov+Math.min(14,Math.max(0,a-8)*.3):this.baseFov;if(Math.abs(r.fov-c)>.05&&(r.fov+=(c-r.fov)*Math.min(1,e*3),r.updateProjectionMatrix()),this.updateSmoke(e),!i)return;let u=t.held||{},h=window.__awDrift||0,d=Math.max(0,(this.lastSpeed-a)/Math.max(.001,e)),f=s?h>.22||(u.brake||d>14)&&a>9:(u.brake||d>16)&&a>14;if(this.lastSpeed=a,s&&f&&a>8)for(this.smokeClock+=e*(h>.5?1.6:1);this.smokeClock>.08;)this.smokeClock-=.08,this.spawnSmoke(o);else this.smokeClock=0;let p=o.x-this.lx,m=o.z-this.lz,g=p*p+m*m;if(!this.tracking||!f||g>25){this.lx=o.x,this.lz=o.z,this.tracking=!0;return}if(g<.7*.7)return;let b=Math.atan2(p,m);this.q.setFromAxisAngle(this.up,b),this.sc.set(1,1,Math.sqrt(g));let v=Math.sin(o.h),M=Math.cos(o.h),_=s?.75:1.3,A=s?[0]:[-.78,.78];for(let E of A)this.p.set((o.x+this.lx)/2+v*_+M*E,o.y+.04,(o.z+this.lz)/2+M*_-v*E),this.m.compose(this.p,this.q,this.sc),this.marks.setMatrixAt(this.i,this.m),this.i=(this.i+1)%nu,this.marks.count=Math.min(nu,this.marks.count+1);this.marks.instanceMatrix.needsUpdate=!0,this.lx=o.x,this.lz=o.z}};var iu=560/3.6,ri=40,pf=5.05,Wv=7,mf=4.6,gf=7.5,su=.56,Xv=`
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  vL = position.z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,qv=`
uniform float uT, uI, uCore, uOcc, uGain; uniform vec3 uC0, uC1;
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  float f = abs(dot(normalize(vN), normalize(vV)));
  float L = vL;
  float n = 0.78 + 0.22 * sin(L * 23.0 - uT * 95.0) * sin(L * 9.0 - uT * 47.0 + 1.3);
  float dia = mix(1.0, 0.55 + 0.9 * pow(abs(cos(L * 15.7 - 0.6)), 8.0) * (1.0 - smoothstep(0.1, 0.85, L)), uCore);
  vec3 col = mix(uC1, uC0, smoothstep(0.15, 0.9, f) * (1.0 - L * (1.0 - uCore) * 0.6));
  float a = pow(f, mix(0.9, 1.6, uCore)) * pow(1.0 - L, mix(1.3, 2.2, uCore)) * smoothstep(0.0, 0.06, L + 0.02) * n * uI;
  a *= mix(0.12 + 0.88 * smoothstep(0.0, 0.38, L), 1.0, uCore);
  gl_FragColor = vec4(col * a * dia * uGain, min(1.0, a * uOcc));
}`,Yv=`
attribute float aLife; attribute float aSeed; varying float vLife; uniform float uScale;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uScale * (0.35 + aLife * 0.9) * (0.7 + aSeed * 0.6) / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`,Zv=`
varying float vLife; uniform float uI;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.0;
  if (r > 1.0 || vLife >= 1.0) discard;
  vec3 col = vLife < 0.25 ? mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.72, 0.32), vLife * 4.0)
                          : mix(vec3(1.0, 0.72, 0.32), vec3(0.85, 0.22, 0.04), (vLife - 0.25) / 0.75);
  float a = (1.0 - r) * pow(1.0 - vLife, 1.6) * uI;
  gl_FragColor = vec4(col * 1.6, a);
}`;function Kv(){let l=document.createElement("canvas");l.width=l.height=64;let e=l.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(225,238,255,1)"),t.addColorStop(.25,"rgba(150,190,255,0.6)"),t.addColorStop(.55,"rgba(255,140,40,0.3)"),t.addColorStop(1,"rgba(255,90,10,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);let n=new re(l);return n.colorSpace=Z,n}function jv(){let l=[];for(let e=0;e<=14;e++){let t=e/14;l.push(new U(Math.max(.001,(1-t**1.25)*(1+.28*Math.sin(t*Math.PI))),t))}return new Cs(l,18).rotateX(Math.PI/2)}var oa=class{constructor(e){x(this,"g");x(this,"on",!1);x(this,"btn");x(this,"fx",new Me);x(this,"plane",null);x(this,"t",0);x(this,"lvl",0);x(this,"pressOn",!1);x(this,"pressT",0);x(this,"core");x(this,"outer");x(this,"glow");x(this,"parts");x(this,"pos",new Float32Array(ri*3));x(this,"vel",new Float32Array(ri*3));x(this,"life",new Float32Array(ri).fill(1));x(this,"ttl",new Float32Array(ri).fill(.2));x(this,"emit",0);x(this,"zoomed",!1);this.g=e;let t=document.createElement("button");this.btn=t,t.innerHTML="TURBO JET<small>tap \xB7 hold</small>",t.className="awturbo",t.title="Turbo jet (T): tap to latch, hold for a burst",t.addEventListener("pointerdown",c=>{c.preventDefault(),c.stopPropagation();try{t.setPointerCapture(c.pointerId)}catch{}this.press(c.timeStamp)});let n=c=>{c.preventDefault(),this.release(c.timeStamp)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),t.addEventListener("contextmenu",c=>c.preventDefault()),document.querySelector('#actions .grp[data-for="plane"]')?.appendChild(t);let i=document.createElement("style");i.textContent=`#actions button.awturbo{grid-column:span 2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;letter-spacing:.06em;background:linear-gradient(180deg,#3a5f9ab8,#1c2c4ab8);border-color:#9fc4ffcc;-webkit-user-select:none;user-select:none}
#actions button.awturbo small{font-size:10px;font-weight:600;opacity:.75;letter-spacing:.02em}
#actions button.awturbo.lit{background:radial-gradient(circle at 50% 120%,#fff6 0,#0000 60%),linear-gradient(180deg,#ffb347,#ff6a1a);color:#1a1a1a;border-color:#fff;box-shadow:0 0 16px #ff8c1acc,0 0 4px #bfe0ff inset}`,document.head.appendChild(i),window.addEventListener("keydown",c=>{c.code==="KeyT"&&!c.repeat&&e.S.mode==="plane"&&!(c.target instanceof HTMLInputElement)&&this.press(c.timeStamp)}),window.addEventListener("keyup",c=>{c.code==="KeyT"&&this.release(c.timeStamp)}),window.addEventListener("blur",c=>this.release(c.timeStamp));let s=document.getElementById("keyhelp");s&&!/turbo/i.test(s.textContent||"")&&(s.textContent+=" \xB7 T turbo jet (plane)"),this.core=this.plume(10273535,4223231,1,.5,1),this.core.scale.set(.3,.3,mf),this.outer=this.plume(16760426,16734738,0,.6,1.7),this.outer.scale.set(su,su,gf),this.glow=new ws(new Ui({map:Kv(),color:13820671,blending:ei,depthWrite:!1,transparent:!0,fog:!1,toneMapped:!1})),this.glow.position.z=.15,this.glow.scale.setScalar(3),this.glow.renderOrder=6;let r=new le;r.setAttribute("position",new oe(this.pos,3).setUsage(ht)),r.setAttribute("aLife",new oe(this.life,1).setUsage(ht)),r.setAttribute("aSeed",new oe(Float32Array.from({length:ri},()=>Math.random()),1)),this.parts=new _t(r,new yt({vertexShader:Yv,fragmentShader:Zv,uniforms:{uI:{value:0},uScale:{value:300}},transparent:!0,depthWrite:!1,blending:ei})),this.parts.frustumCulled=!1,this.parts.renderOrder=5;let o=new B(new Rt(.5,.36,.6,16,1,!0).rotateX(Math.PI/2),new Fe({color:3816514,metalness:.8,roughness:.35,side:K}));o.position.z=pf-.3;let a=new Me;a.position.z=pf,a.add(this.core,this.outer,this.glow,this.parts),this.fx.name="aw-turbo",this.fx.add(o,a),a.name="aw-turbo-flame"}plume(e,t,n,i,s){let r=new yt({vertexShader:Xv,fragmentShader:qv,transparent:!0,depthWrite:!1,side:K,blending:Gl,blendSrc:Hl,blendDst:ho,uniforms:{uT:{value:0},uI:{value:0},uCore:{value:n},uOcc:{value:i},uGain:{value:s},uC0:{value:new L(e)},uC1:{value:new L(t)}}}),o=new B(jv(),r);return o.renderOrder=n?5:4,o.frustumCulled=!1,o}press(e){this.g.S.mode==="plane"&&(this.on?(this.set(!1),this.pressOn=!1):(this.set(!0),this.pressOn=!0,this.pressT=e))}release(e){this.pressOn&&e-this.pressT>350&&this.set(!1),this.pressOn=!1}set(e){this.on=e,this.btn.classList.toggle("lit",e)}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}update(e){let t=this.g.S.mode==="plane";!t&&this.on&&(this.set(!1),this.pressOn=!1);let n=window;if(n.__awTurbo=this.on&&t,n.__awTurboK=2,n.__awTurboV=iu,this.lvl+=((this.on&&t?1:0)-this.lvl)*Math.min(1,e*(this.on?7:4)),this.lvl<.003&&!this.on&&(this.lvl=0),n.__awTurboLvl=this.lvl,this.on&&t){let u=this.g.S.plane;u.s>iu&&(u.s=iu)}this.fov(t);let i=t?this.findPlane():null;i&&this.fx.parent!==i&&i.add(this.fx),this.fx.visible=!!i;let s=this.fx.children[1];if(s.visible=this.lvl>0,!i||!s.visible)return;this.t+=e;let r=this.t,o=this.lvl,a=1+Math.sin(r*61)*.07+Math.sin(r*37+1.1)*.06+(Math.random()-.5)*.08;for(let u of[this.core,this.outer]){let h=u.material.uniforms;h.uT.value=r,h.uI.value=o}this.core.scale.z=mf*(.45+.55*o)*a,this.outer.scale.z=gf*(.4+.6*o)*(2-a);let c=1+(Math.random()-.5)*.06;this.outer.scale.x=this.outer.scale.y=su*c,this.glow.material.opacity=(.5+Math.random()*.2)*o,this.glow.scale.setScalar(3*(.8+.2*a)),this.particles(e,o)}particles(e,t){let n=this.pos,i=this.vel,s=this.life;this.emit+=e*ri/.2*t;for(let a=0;a<ri;a++){if(s[a]>=1){if(this.emit<1)continue;this.emit-=1;let c=Math.random()*.22,u=Math.random()*6.283;n[a*3]=Math.cos(u)*c,n[a*3+1]=Math.sin(u)*c,n[a*3+2]=Math.random()*.4,i[a*3]=(Math.random()-.5)*3.5,i[a*3+1]=(Math.random()-.5)*3.5,i[a*3+2]=28+Math.random()*18,s[a]=0,this.ttl[a]=.14+Math.random()*.16;continue}s[a]=Math.min(1,s[a]+e/this.ttl[a]),n[a*3]+=i[a*3]*e,n[a*3+1]+=i[a*3+1]*e,n[a*3+2]+=i[a*3+2]*e}this.emit=Math.min(this.emit,4);let r=this.parts.geometry;r.attributes.position.needsUpdate=!0,r.attributes.aLife.needsUpdate=!0;let o=this.parts.material;o.uniforms.uI.value=t,o.uniforms.uScale.value=this.g.renderer.domElement.height*.27}fov(e){let t=this.g.camera;if(!e&&!this.zoomed)return;let n=t.fov*Math.PI/360,i=Wv*(e?this.lvl:0)*Math.PI/360,s=i>1e-4?Math.tan(n)/Math.tan(n+i):1;Math.abs(t.zoom-s)>1e-4&&(t.zoom=s,t.updateProjectionMatrix()),this.zoomed=s!==1}};var Jv=42,$v=56,Qv=40,e1=l=>Math.atan2(Math.sin(l),Math.cos(l)),xf=(l,e)=>Math.sign(l)*Math.pow(Math.abs(l),e),bf=(l,e,t)=>Math.max(e,Math.min(t,l)),ru=l=>l.y-((l.g||0)+2),aa=class{constructor(e){x(this,"g");x(this,"ch",0);x(this,"cp",0);x(this,"cd",26);x(this,"camOn",!1);x(this,"lx",0);x(this,"lz",0);x(this,"res",{h:0,p:0,d:26});x(this,"gear");x(this,"gearK",0);x(this,"plane",null);x(this,"spawned",null);x(this,"mode","");this.g=e,this.gear=this.buildGear(),window.__awFly={gnd:t=>t.y<=(t.g||0)+2.05,ctl:(t,n,i,s,r)=>this.ctl(t,n,i,s,r),gs:t=>.6/(1+Math.abs(t.s)/15),acc:(t,n,i,s,r)=>this.acc(t,n,i,s,r),vy:(t,n,i,s)=>this.vy(t,n,s),cam:(t,n,i)=>this.cam(t,n,i),spawn:(t,n)=>this.spawn(t,n)}}ctl(e,t,n,i,s){let r=xf(t,1.5)*1.15;e.q=(e.q||0)+(r-(e.q||0))*Math.min(1,i*7),e.p+=e.q*i;let o=Math.abs(t)<.08;if(o){let c=ru(e),u=s?0:e.thr>.5?c<90?.1:c<140?.1*(140-c)/50:0:c<25?-.035:0;e.p+=(u-e.p)*(1-.4**i)}if(s){o&&e.s>$v&&e.thr>.5&&(e.p+=(.13-e.p)*Math.min(1,i*1.5));let c=e.s<Jv?.02:.2;e.p>c&&(e.p+=(c-e.p)*Math.min(1,i*3)),e.p<0&&(e.p=0,e.q=Math.max(0,e.q))}let a=s?0:-xf(n,1.4)*.85;e.r+=(a-e.r)*Math.min(1,i*(s?6:3.2))}acc(e,t,n,i,s){let r=!!window.__awTurbo,o=i&&s<-.3,a=o?0:t;i&&e.thr<.5&&(a*=(e.thr/.5)**2),i||(a=Math.max(a,Qv));let c=(a-e.s)*.9,u=i?r?14:7.5:r?32:16;return bf(c,-(i?o?10:5:12),u)*n}vy(e,t,n){if(!n&&e.thr<.35&&(t-=(.35-e.thr)/.35*4.5),t>=0)return t;let i=Math.max(0,ru(e));return i>45?t:Math.max(t,-(1.2+i*.5+i*i*.03))}cam(e,t,n){let s=(this.g.camera.aspect<.8?20:26)+Math.min(e.s,160)*.055+(window.__awTurboLvl||0)*3,r=Math.hypot(e.x-this.lx,e.z-this.lz)>300;return this.lx=e.x,this.lz=e.z,(!this.camOn||n||r)&&(this.ch=e.h,this.cp=e.p,this.cd=s,this.camOn=!0),this.ch+=e1(e.h-this.ch)*Math.min(1,t*3),this.cp+=(e.p-this.cp)*Math.min(1,t*3),this.cd+=(s-this.cd)*Math.min(1,t*1.5),this.res.h=this.ch,this.res.p=this.cp,this.res.d=this.cd,this.res}runway(){let e=this.g.DATA?.runways||[],t=null,n=0;for(let i of e){let s=Math.hypot(i[i.length-1][0]-i[0][0],i[i.length-1][1]-i[0][1]);s>n&&(n=s,t=i)}return t&&n>1500?{A:t[0],B:t[t.length-1],L:n}:null}spawn(e,t){if(t==="plane")return;let n=this.runway();if(!n)return;let i=(n.B[0]-n.A[0])/n.L,s=(n.B[1]-n.A[1])/n.L,r=e.x-n.A[0],o=e.z-n.A[1],a=r*i+o*s;if(Math.abs(r*s-o*i)>450||a<-600||a>n.L+600)return;let u=a<n.L/2,h=u?90:n.L-90,d=u?1:-1;e.x=n.A[0]+i*h,e.z=n.A[1]+s*h,e.h=Math.atan2(-i*d,-s*d);let f=this.g.real;e.g=f?Math.max(0,f.heightAt(e.x,e.z)):0,e.y=e.g+2,e.p=0,e.r=0,e.s=0,e.thr=0,e.q=0,this.spawned={x:e.x,z:e.z},this.camOn=!1;let p=document.getElementById("toast");p&&(p.textContent=`Runway ${u?"29":"11"}, Queen Beatrix \xB7 hold THR+ to take off \xB7 DIVE brakes`,p.classList.add("on"),setTimeout(()=>p.classList.remove("on"),4500))}buildGear(){let e=new Me;e.name="aw-gear";let t=new Fe({color:12106948,metalness:.6,roughness:.4}),n=new Fe({color:1776413,roughness:.9}),i=new Rt(.07,.07,1,6).translate(0,-.5,0),s=new Rt(.26,.26,.22,12).rotateZ(Math.PI/2);for(let[r,o,a]of[[0,-3.3,-.45],[-1.15,.4,-.55],[1.15,.4,-.55]]){let c=new Me;c.position.set(r,a,o);let u=a+1.74,h=new B(i,t);h.scale.y=u,c.add(h);let d=new B(s,n);d.position.y=-u,c.add(d),e.add(c)}return e.visible=!1,e}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}get planeObj(){return this.findPlane()}update(e){let t=this.g.S;if(t.mode!==this.mode&&(this.mode=t.mode,t.mode!=="plane"&&(this.camOn=!1)),t.mode!=="plane")return;let n=t.plane;if(this.spawned){if(Math.hypot(n.x-this.spawned.x,n.z-this.spawned.z)>20){let r=this.g.real;n.y=Math.max((r?r.heightAt(n.x,n.z):0)+200,250),n.s=65,n.thr=.65,n.p=.05}this.spawned=null}let i=this.findPlane();if(!i)return;this.gear.parent!==i&&i.add(this.gear);let s=ru(n)<(this.gearK>.5?70:55);this.gearK=bf(this.gearK+(s?e:-e)/1.6,0,1),this.gear.visible=this.gearK>.01,this.gear.scale.setScalar(this.gearK),this.gear.position.y=(1-this.gearK)*.4}};var Ji=[4380,4538,4696,4848,4999,5150,5308,5466,5629,5789],Ks=8542,la=80,vf=44,ca=class{constructor(e){x(this,"g",e);x(this,"hAt");x(this,"k",0);x(this,"ang",[]);x(this,"ys",[]);x(this,"static");x(this,"rot");x(this,"m",new O);x(this,"q",new Y);x(this,"e",new Et);x(this,"p",new w);x(this,"s",new w(1,1,1));let t=e.real;this.hAt=(o,a)=>t.heightAt(o,a);let n=new ut({color:15659250}),i=new He(.5,vf,2);i.translate(0,vf/2+1,0);let s=[new Ge(1.5,8,6)];for(let o=0;o<3;o++)s.push(i.clone().rotateX(o*2.0944));let r=Mt(s.map(o=>o.toNonIndexed()));this.rot=new q(r,n,Ji.length),this.rot.frustumCulled=!1,this.rot.name="aw:windfarm:rotors",this.rot.castShadow=!1,this.rebuild(),e.scene.add(this.rot)}rebuild(){let e=[];Ji.forEach((n,i)=>{let s=this.hAt(Ks,n)-.5;this.ys[i]=Number.isFinite(s)?s:this.ys[i]||0;let r=new Rt(1.4,2.1,la,10,1,!0).toNonIndexed();r.translate(Ks,this.ys[i]+la/2,n);let o=new He(10,3.6,3.6).toNonIndexed();o.translate(Ks-1.5,this.ys[i]+la+.3,n),e.push(r,o),this.ang[i]===void 0&&(this.ang[i]=i*.7)});let t=Mt(e);t.computeBoundingSphere(),this.static?(this.static.geometry.dispose(),this.static.geometry=t):(this.static=new B(t,this.rot.material),this.static.name="aw:windfarm",this.g.scene.add(this.static))}update(e){if((++this.k&255)===0){let t=!1;for(let n=0;n<Ji.length;n++){let i=this.hAt(Ks,Ji[n])-.5;Number.isFinite(i)&&Math.abs(i-this.ys[n])>.05&&(t=!0)}t&&this.rebuild()}for(let t=0;t<Ji.length;t++)this.ang[t]-=e*.9,this.e.set(this.ang[t],0,0),this.q.setFromEuler(this.e),this.p.set(Ks+4.2,this.ys[t]+la+1.3,Ji[t]),this.m.compose(this.p,this.q,this.s),this.rot.setMatrixAt(t,this.m);this.rot.instanceMatrix.needsUpdate=!0}};var ua=[{n:"NEAR",d:1,p:0},{n:"FAR",d:1.75,p:.14},{n:"LOW",d:.72,p:-.13}],ha=class{constructor(){x(this,"i",0);x(this,"btn");x(this,"tip");x(this,"cd",1);x(this,"cp",0);this.btn=document.createElement("button"),this.btn.textContent="\u{1F3A5}",this.btn.title="Camera (C)",this.btn.className="aw-cam",this.btn.setAttribute("aria-label","Cycle chase camera"),this.btn.style.display="none",this.btn.addEventListener("click",t=>{t.preventDefault(),this.next()}),document.body.appendChild(this.btn),this.tip=document.createElement("div"),this.tip.className="aw-camtip",document.body.appendChild(this.tip);let e=document.createElement("style");e.textContent=".aw-cam{position:fixed;right:12px;top:170px;z-index:40;width:44px;height:44px;border-radius:12px;border:0;font:20px system-ui;background:#1e2a3ab0;color:#fff}.aw-camtip{position:fixed;right:62px;top:180px;z-index:40;font:800 12px system-ui;color:#fff;text-shadow:0 1px 3px #000;opacity:0;transition:opacity .4s;pointer-events:none}",document.head.appendChild(e),addEventListener("keydown",t=>{t.code==="KeyC"&&!(t.target instanceof HTMLInputElement)&&this.next()})}next(){this.i=(this.i+1)%ua.length,this.tip.textContent="CAM "+ua[this.i].n,this.tip.style.opacity="1",setTimeout(()=>this.tip.style.opacity="0",1200)}frame(e,t){let n=e==="car"||e==="moto";this.btn.style.display=n?"block":"none";let i=n?ua[this.i]:ua[0],s=Math.min(1,t*4);this.cd+=(i.d-this.cd)*s,this.cp+=(i.p-this.cp)*s;let r=window;r.__awCamD=this.cd,r.__awCamP=this.cp}};var js=["off","1","2","3","4","5"],t1={off:"RADIO OFF",1:"Track 1",2:"Track 2",3:"Track 3",4:"Track 4",5:"Track 5"},n1=l=>`./audio/music/track${l}.mp3`,i1=.32,da=class{constructor(e){x(this,"g",e);x(this,"el");x(this,"nm");x(this,"a",null);x(this,"st","1");x(this,"shown",!1);x(this,"want",!1);x(this,"t",0);try{localStorage.removeItem("aw_radio");let a=localStorage.getItem("aw_radio2");a&&js.includes(a)&&(this.st=a)}catch{}let t=document.createElement("style");t.textContent=`#awRadio{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 96px);transform:translate(-50%);z-index:30;display:none;align-items:center;gap:6px;
      background:#0b1220cc;border:2px solid #ffffff40;border-radius:14px;padding:4px 6px;color:#fff;font:700 13px system-ui,sans-serif;user-select:none;touch-action:none;box-shadow:0 4px 14px #0006}
      #awRadio.on{display:flex}body.touch #awRadio{top:auto;bottom:calc(env(safe-area-inset-bottom) + 172px)}body.touch #awRadio[data-mode=plane]{bottom:auto;top:calc(env(safe-area-inset-top) + var(--aw-radio-top,132px));left:12px;transform:none}#awRadio button{background:#ffffff1a;border:0;color:#fff;border-radius:9px;width:30px;height:30px;font-size:15px;font-weight:900}
      #awRadio .nm{min-width:110px;text-align:center;line-height:1.1}#awRadio .nm small{display:block;font-size:9px;letter-spacing:.18em;opacity:.65}
      #awRadio .nm b{display:block;font-size:14px;color:#ffd23f}#awRadio.off .nm b{color:#aab}`,document.head.appendChild(t),this.el=document.createElement("div"),this.el.id="awRadio";let n=document.createElement("button");n.textContent="\u25C0",n.setAttribute("aria-label","Previous station");let i=document.createElement("button");i.textContent="\u25B6",i.setAttribute("aria-label","Next station"),this.nm=document.createElement("div"),this.nm.className="nm",this.el.append(n,this.nm,i),document.body.appendChild(this.el);let s=a=>a.stopPropagation();for(let a of["pointerdown","touchstart","mousedown"])this.el.addEventListener(a,s);n.addEventListener("click",a=>{a.stopPropagation(),this.step(-1)}),i.addEventListener("click",a=>{a.stopPropagation(),this.step(1)});let r=-1;this.el.addEventListener("pointerdown",a=>{(a.target===this.el||this.nm.contains(a.target))&&(r=a.clientX,this.el.setPointerCapture(a.pointerId))}),this.el.addEventListener("pointerup",a=>{if(r<0)return;let c=a.clientX-r;r=-1,Math.abs(c)>25&&this.step(c<0?1:-1)}),this.el.addEventListener("pointercancel",()=>{r=-1}),addEventListener("keydown",a=>{!this.shown||a.target?.tagName==="INPUT"||(a.key===","?this.step(-1):a.key==="."&&this.step(1))});let o=()=>{this.want&&this.a&&this.a.paused&&this.a.play().catch(()=>{})};addEventListener("pointerdown",o,!0),addEventListener("keydown",o,!0),this.paint()}muted(){try{return localStorage.getItem("aw_muted")==="1"}catch{return!1}}step(e){let t=js.indexOf(this.st);this.st=js[(t+e+js.length)%js.length];try{localStorage.setItem("aw_radio2",this.st)}catch{}this.paint(),this.sync(!0)}paint(){this.nm.innerHTML=`<small>RADIO</small><b>${t1[this.st]}</b>`,this.el.classList.toggle("off",this.st==="off")}sync(e=!1){if(this.want=this.shown&&this.st!=="off"&&!this.muted(),!this.want){this.a&&!this.a.paused&&this.a.pause();return}let t=n1(this.st);this.a||(this.a=new Audio,this.a.loop=!0,this.a.preload="auto",this.a.volume=i1,window.__awRadio=this.a),(e||!this.a.src.endsWith(t.slice(1)))&&(this.a.src=t);let n=window.__awIntro;n&&!n.paused&&n.pause(),this.a.paused&&this.a.play().catch(()=>{})}update(){let t=this.g.S.mode;if(this.el.dataset.mode!==t&&(this.el.dataset.mode=t,t==="plane")){let n=document.getElementById("hud");if(n){let i=n.getBoundingClientRect();i.bottom>0&&this.el.style.setProperty("--aw-radio-top",Math.round(i.bottom+8)+"px")}}this.shown!==!0?(this.shown=!0,this.el.classList.toggle("on",!0),this.sync()):(this.t=(this.t+1)%30)===0&&this.sync()}};var _f="smoothstep(-500.0, 1200.0, dot(%P% - vec2(-8840.0, -10365.0), vec2(0.7373, -0.6756)))",s1=`
  // aw sea: awW 0 leeward (Eagle/Palm Beach) .. 1 windward north coast
  vec2 awP = vWP.xz;
  float awW = ${_f.replace("%P%","awP")};
  vec3 awN1 = texture(wn, awP / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;
  vec3 awN3 = texture(wn, awP / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;
  // lapping swash: gentle on the leeward beaches, a bigger surge on the windward coast
  float swash = mix(0.06, 0.2, awW) * sin(uTime * mix(0.7, 0.95, awW) + rwN(awP * 0.05) * 6.0);
  float dd = depth + swash;
  if (dd < 0.0) discard;
  float awD = depth * mix(1.0, 2.5, awW);
#ifdef AW_SEA_HQ
  // MED/HIGH: the composer grade is softer than LOW's vivid tonemap, so the same water needs richer tones
  vec3 wc = mix(vec3(0.03, 0.42, 0.46), vec3(0.0, 0.32, 0.46), smoothstep(0.3, 2.5, awD));   // aqua over sand -> turquoise
  wc = mix(wc, vec3(0.0, 0.12, 0.32), smoothstep(2.5, 7.0, awD));                             // azure
  wc = mix(wc, vec3(0.0, 0.028, 0.13), smoothstep(6.0, 18.0, awD));                           // deep navy
#else
  vec3 wc = mix(vec3(0.07, 0.27, 0.27), vec3(0.0, 0.22, 0.30), smoothstep(0.3, 2.5, awD));
  wc = mix(wc, vec3(0.0, 0.10, 0.25), smoothstep(2.5, 7.0, awD));
  wc = mix(wc, vec3(0.0, 0.025, 0.11), smoothstep(6.0, 18.0, awD));
#endif
  float a = 1.0 - exp(-dd * mix(0.4, 0.62, awW));
  a = clamp(a, 0.0, 1.0) * smoothstep(0.0, 0.05, dd);
#ifdef AW_SEA_HQ
  float fn = rwFbm(awP * 0.4 + vec2(uTime * 0.12, 0.0));
#else
  float fn = 0.5 + (awN1.x - awN1.y) * 0.17 + awN3.x * 0.22;   // ~ same spread as A's fbm (mean .5, sd ~.12)
#endif
  // breaking waves: crests follow the depth contours and travel shoreward; a small shore break on the
  // leeward beaches, a wide surf zone on the windward coast
  float awSurf = smoothstep(mix(0.3, 2.8, awW), 0.0, dd);
  float awCr = 0.5 + 0.5 * sin(dd * mix(14.0, 5.0, awW) + uTime * mix(1.1, 1.5, awW) + fn * 3.0);
  float band = awSurf * smoothstep(mix(0.72, 0.55, awW), 1.0, awCr);
  float awEdge = smoothstep(mix(0.05, 0.12, awW), 0.0, dd);
  float foam = clamp((band * 1.4 + awEdge) * smoothstep(mix(0.42, 0.25, awW), mix(0.7, 0.6, awW), fn), 0.0, 1.0) * (1.0 - smoothstep(150.0, 600.0, camD));
#ifdef AW_SEA_HQ
  float awCap = smoothstep(0.74, 0.9, rwN(awP * 0.045 + vec2(-uTime * 0.05, uTime * 0.02))) * smoothstep(0.45, 0.75, fn);
  foam = max(foam, awW * awCap * smoothstep(2.0, 6.0, depth) * 0.75 * (1.0 - smoothstep(250.0, 1400.0, camD)));
#endif
  wc = mix(wc, vec3(0.92), foam);
  a = max(a, foam * 0.95);
  // trade-wind swell from the ENE plus a cross swell (normal tilt only: the sea is one quad per region)
  float awS1 = dot(awP, vec2(-0.93, 0.37)) * 0.11 - uTime * 1.0 + awN3.x * 2.5;   // crests warped by the 120 m ripple sample
  float awS2 = dot(awP, vec2(-0.55, 0.83)) * 0.2 - uTime * 1.35 + awN3.y * 2.5;
  vec2 awSwell = -(vec2(-0.93, 0.37) * cos(awS1) * mix(0.05, 0.14, awW) + vec2(-0.55, 0.83) * cos(awS2) * mix(0.025, 0.06, awW))
    * smoothstep(0.4, 4.0, depth) * (1.0 - smoothstep(200.0, 2500.0, camD) * 0.8);
  // A flattens far normals and calms the shallows, so both mirrored the white horizon haze: damp that
  // sheen over distant deep water, and over the shallows so the sand shows through
  float awSpec = (1.0 - 0.45 * smoothstep(150.0, 1500.0, camD) * smoothstep(4.0, 14.0, awD)) * mix(0.65, 1.0, smoothstep(0.5, 4.0, depth));`;function r1(l,e){gn(l,"sea-v1",t=>{let n=t.fragmentShader,i=n.indexOf("  // shoreline wash"),s="a = max(a, foam * 0.95);",r=n.indexOf(s),o="vec3 n1 = texture(wn, p / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;",a="vec3 n3 = texture(wn, p / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;",c="vec3 nW = normalize(vec3(g.x, 1.0, g.y));",u="float roughnessFactor = mix(0.04, 0.65, foam) + smoothstep(300.0, 4000.0, camD) * 0.08;",h="totalSpecular * smoothstep(0.0, 0.15, dd)";i<0||r<i||![o,a,c,u,h].every(d=>n.includes(d))||(t.fragmentShader=((e?`#define AW_SEA_HQ
`:"")+n.slice(0,i)+s1+n.slice(r+s.length)).replace(o,"vec3 n1 = awN1;").replace(a,"vec3 n3 = awN3;").replace(c,"g = g * mix(1.0, 1.45, awW) + awSwell; "+c).replace(u,u.replace(";"," + 0.05 * awW;")).replace(h,h+" * awSpec"))})}function o1(l){gn(l,"sand-v1",e=>{let t=e.fragmentShader,n="const float SAT[8] = float[8](0.55, 0.8, 0.6, 0.9, 0.85, 0.6, 0.5, 0.6);",i="const float GAIN[8] = float[8](1.12, 1.0, 1.95, 1.0, 0.8, 1.25, 1.15, 1.15);",s=`  for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) rwLayer(i, wi, P, tc, tn, tar); }
  float wsum = 0.0; for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) wsum += wi; }`,r="tc = mix(tc, tc * vec3(0.78, 0.9, 0.88), smoothstep(-0.5, -3.0, vWP.y));",o="reflectedLight.indirectSpecular *= tAO;";[n,i,s,r,o].every(a=>t.includes(a))&&(e.fragmentShader=t.replace(n,"const float SAT[8] = float[8](0.55, 0.8, 0.5, 0.9, 0.85, 0.6, 0.5, 0.6);").replace(i,"const float GAIN[8] = float[8](1.12, 1.0, 2.5, 1.0, 0.8, 1.25, 1.15, 1.15);").replace(s,`  float awIT = 1.0 / max(tot, 1e-4), wsum = 0.0;
  for (int i = 0; i < 8; i++) { float wi = w[i] * awIT; if (wi > 0.02) { rwLayer(i, wi, P, tc, tn, tar); wsum += wi; } }`).replace(r,`float awW = ${_f.replace("%P%","P")}, awSub = smoothstep(-0.2, -2.5, vWP.y);
  tc *= mix(vec3(1.0), vec3(0.96, 0.9, 0.8), awW * w[2] * awIT * (1.0 - awSub));   // windward: coarser, golden coral sand
  tc *= exp(min(vWP.y, 0.0) * vec3(0.9, 0.16, 0.11)) * (1.0 - 0.3 * awW * awSub);   // seabed: red absorbed on the way down and up, darker reef windward
  // A's wet-sand gloss (roughness .28) also covered the seabed, which then mirrored the sky up through
  // the water (the white band off every beach): matte and no sky reflection below the waterline
  float awDry = smoothstep(-0.5, 0.05, vWP.y); tRough = mix(1.0, tRough, awDry);`).replace(o,"reflectedLight.indirectSpecular *= tAO * awDry;"))})}var fa=class{constructor(e){x(this,"stats",{water:0,terrain:0,hq:!1});let t=e.real,n=H.get("seaq"),i=n?n!=="low":t.q.name!=="low";this.stats.hq=i;let s=a=>{a&&!a.userData["aw:sea-v1"]&&(r1(a,i),this.stats.water++)},r=a=>{a&&!a.userData["aw:sand-v1"]&&(o1(a),this.stats.terrain++)},o=(a,c)=>{if(!a||typeof a.material!="function")return;let u=a.material.bind(a);a.material=(...h)=>{let d=u(...h);return c(d),d}};o(t.water,s),o(t.terrain,r),r(t.ovMat);for(let a of t.group.children){let c=a.material;a.isMesh&&c&&!Array.isArray(c)&&/\|water/.test(c.customProgramCacheKey?c.customProgramCacheKey():"")&&s(c)}for(let a of t.regions.values())r(a.mat),s(a.wmat)}};var a1=`
body.touch{
  --aw-t:calc(env(safe-area-inset-top,0px) + 8px);
  --aw-r:calc(env(safe-area-inset-right,0px) + 8px);
  --aw-l:calc(env(safe-area-inset-left,0px) + 8px);
  --aw-b:env(safe-area-inset-bottom,0px);
  --aw-mm:clamp(112px,31vw,136px);
  --aw-bw:46px;
  --aw-bh:44px;
  --aw-gap:6px;
  --aw-panel:linear-gradient(180deg,#1c2738e0,#0b111ae0);
  --aw-edge:#ffffffa6;
  --aw-shadow:0 3px 10px #0006;
}
@media (orientation:landscape){body.touch{--aw-mm:clamp(96px,27vh,124px)}}
body.touch button{-webkit-touch-callout:none}

body.touch #modes{top:var(--aw-t);left:var(--aw-l);transform:none;gap:var(--aw-gap)}
body.touch #modes button{width:var(--aw-bw);height:var(--aw-bh);border-radius:12px;font-size:21px;background:var(--aw-panel);border:2px solid var(--aw-edge);box-shadow:var(--aw-shadow)}
body.touch #modes button span{display:none}
body.touch #modes button.on{border-color:#fff;box-shadow:0 0 0 2px #ffd23f99,var(--aw-shadow)}
body.touch #realbar{top:calc(var(--aw-t) + var(--aw-bh) + var(--aw-gap));left:var(--aw-l);transform:none;gap:var(--aw-gap)}
body.touch #realbar button{height:var(--aw-bh);min-width:var(--aw-bh);padding:0 12px;border-radius:12px;font-size:14px;letter-spacing:.05em;background:var(--aw-panel);border:2px solid var(--aw-edge);box-shadow:var(--aw-shadow)}

body.touch #hud{top:calc(var(--aw-t) + 2 * var(--aw-bh) + 2 * var(--aw-gap) + 2px);left:var(--aw-l);
  max-width:calc(100vw - var(--aw-l) - var(--aw-r) - var(--aw-mm) - 12px);padding:5px 11px 6px;border-radius:12px;
  background:var(--aw-panel);border:1.5px solid #ffffff40;box-shadow:var(--aw-shadow);font-size:11px;line-height:1.25}
body.touch #hudmode{font-size:11px;font-weight:900;letter-spacing:.14em}
body.touch #hudstats{font-size:11px;font-weight:700;white-space:nowrap;opacity:.92}
body.touch #hudspeed{font-size:24px;font-weight:900;font-variant-numeric:tabular-nums;letter-spacing:-.02em;text-shadow:0 2px 0 #0007}
body.touch #hudplace{max-width:100%;font-size:11px;font-weight:600}
body.touch #hudfps{font-size:9px}

body.touch #minimapwrap{top:var(--aw-t);right:var(--aw-r);width:var(--aw-mm);height:var(--aw-mm);border:3px solid #ffffffeb;box-shadow:0 0 0 2px #0007,0 4px 14px #0007}
body.awmm #minimapwrap{background:#1d5683}
body.awmm #mmN{display:none}
body.touch #awmutebtn{top:calc(var(--aw-t) + var(--aw-mm) + 8px);right:var(--aw-r);left:auto;width:44px;height:44px;border:2px solid var(--aw-edge);background:var(--aw-panel);box-shadow:var(--aw-shadow)}
body.touch .aw-cam{top:calc(var(--aw-t) + var(--aw-mm) + 8px);right:calc(var(--aw-r) + 52px);width:44px;height:44px;border:2px solid var(--aw-edge);background:var(--aw-panel);box-shadow:var(--aw-shadow)}
body.touch .aw-camtip{top:calc(var(--aw-t) + var(--aw-mm) + 58px);right:var(--aw-r)}

body.touch #toast{top:calc(var(--aw-t) + 2 * var(--aw-bh) + 2 * var(--aw-gap) + 96px);transform:translate(-50%);max-width:calc(100vw - var(--aw-l) - var(--aw-r) - 16px);font-size:14px;padding:10px 14px}

body.touch #attrib{right:calc(env(safe-area-inset-right,0px) + 4px);bottom:calc(var(--aw-b) + 2px);max-width:calc(100vw - var(--aw-l) - var(--aw-r));font-size:9px}
body.touch #joybase{left:calc(var(--aw-l) + 18px);bottom:calc(var(--aw-b) + 34px)}
body.touch.drive #steerbtns{left:var(--aw-l);bottom:calc(var(--aw-b) + 20px)}
body.touch #actions{right:var(--aw-r);bottom:calc(var(--aw-b) + 24px)}
body.touch #actions .grp:not([data-for=car]):not([data-for=moto]) button{background:var(--aw-panel);border-color:var(--aw-edge);box-shadow:var(--aw-shadow);letter-spacing:.04em}
body.touch #actions .grp[data-for=walk] button.on,body.touch #actions button.held{color:#20242a!important;background:#ffd23f!important}
body.touch #actions .grp[data-for=plane].on{grid-template-columns:76px 76px;grid-template-areas:"tu up" "td dn" "tb tb";gap:8px}
body.touch #actions .grp[data-for=plane] button{min-width:0;height:54px}
body.touch #actions .grp[data-for=plane] [data-act=thrup]{grid-area:tu}
body.touch #actions .grp[data-for=plane] [data-act=thrdown]{grid-area:td}
body.touch #actions .grp[data-for=plane] [data-act=up]{grid-area:up}
body.touch #actions .grp[data-for=plane] [data-act=down]{grid-area:dn}
body.touch #actions .grp[data-for=plane] button.awturbo{grid-area:tb}

body.touch #settings{top:calc(var(--aw-t) + 4px);max-height:calc(100dvh - var(--aw-t) - var(--aw-b) - 16px)}
body.touch #settings button{min-height:44px}
body.touch #bmtop{top:calc(var(--aw-t) + 2px);left:var(--aw-l);right:var(--aw-r)}
body.touch #bmtop button,body.touch #bmbar button{min-height:44px;min-width:44px}
body.touch #bmbar{left:var(--aw-l);right:var(--aw-r);bottom:calc(var(--aw-b) + 12px)}
body.touch #bmres{left:var(--aw-l);right:calc(var(--aw-r) + 62px);top:calc(var(--aw-t) + 56px)}

@media (orientation:landscape) and (max-height:540px){
  body.touch #hud{top:var(--aw-t);max-width:calc(50vw - 2 * var(--aw-bw) - 1.5 * var(--aw-gap) - var(--aw-l) - 10px)}
  body.touch #modes,body.touch #realbar{left:50%;transform:translate(-50%)}
  body.touch #toast{top:calc(var(--aw-t) + 2 * var(--aw-bh) + 2 * var(--aw-gap) + 4px);max-width:calc(100vw - 2 * (var(--aw-mm) + var(--aw-r) + 16px))}
  body.touch #actions .grp[data-for=plane].on{grid-template-columns:72px 72px 72px;grid-template-areas:"tu up tb" "td dn tb"}
  body.touch #actions .grp[data-for=plane] button{height:52px}
  body.touch #actions .grp[data-for=plane] button.awturbo{height:auto}
}`;function yf(){let l=document.createElement("style");l.id="aw-hud",l.textContent=a1,document.head.appendChild(l)}var ou="#1d5683",Mf="#47524c",wf="#4c6444",Sf="#262c31",l1="#1b2126",Af=["#aeb5b8","#c3c8ca","#eef0f0","#ffd34d","#ffd34d"],Tf=[1.1,1.4,2.1,2.7,3.2],c1=[.45,.55,.9,1.3,1.6],u1=new Set(["store","mall","hotel","gas","attraction"]),h1=new Set(["mall","hotel","gas","attraction"]),pa=class{constructor(e){x(this,"g",e);x(this,"stats",{tiles:0,tileMs:0,jobMaxMs:0,world:!1,labels:0,size:0});x(this,"canvas",document.getElementById("minimap"));x(this,"ctx",null);x(this,"css",0);x(this,"tile",document.createElement("canvas"));x(this,"tcx",0);x(this,"tcz",0);x(this,"tppm",0);x(this,"tileOk",!1);x(this,"tileQueued",!1);x(this,"want",{ppm:0,cssPerM:0});x(this,"world",document.createElement("canvas"));x(this,"wk",0);x(this,"wb",null);x(this,"data",null);x(this,"grid",null);x(this,"parkGrid",null);x(this,"stamp",null);x(this,"parkStamp",null);x(this,"gen",0);x(this,"jobs",[]);x(this,"idleOn",!1);x(this,"range",0);x(this,"placed",[]);x(this,"pick",[]);x(this,"rim",null);x(this,"rimW",0);this.tile.width=this.tile.height=1024,this.canvas&&(this.ctx=this.canvas.getContext("2d"),document.body.classList.add("awmm"),this.resize(),addEventListener("resize",()=>this.resize()),addEventListener("orientationchange",()=>setTimeout(()=>this.resize(),250)),window.__awMiniMap=(t,n,i,s,r,o,a,c)=>this.draw(t,n,i,s,r,o,a,c))}resize(){let e=this.canvas,t=e.parentElement;this.css=t.clientWidth||120;let n=Math.max(96,Math.min(300,Math.round(this.css*Math.min(3,devicePixelRatio||1))));e.width!==n&&(e.width=e.height=n,this.tileOk=!1),this.stats.size=n}idle(e,t=!1){t?this.jobs.unshift(e):this.jobs.push(e),this.kick()}kick(){if(this.idleOn||!this.jobs.length)return;this.idleOn=!0;let e=n=>{this.idleOn=!1;do{let i=performance.now();this.jobs.shift()(),this.stats.jobMaxMs=Math.max(this.stats.jobMaxMs,Math.round((performance.now()-i)*10)/10)}while(this.jobs.length&&n&&n.timeRemaining()>4);this.kick()},t=window.requestIdleCallback;t?t(e,{timeout:250}):setTimeout(e,16)}start(e,t){this.data=e,this.wb=t,this.idle(()=>{this.grid||this.index(e)});let n=Math.max(t.maxX-t.minX,t.maxZ-t.minZ),i=this.wk=1024/n,s=this.world;s.width=s.height=1024;let r=s.getContext("2d"),o=u=>(u-t.minX)*i,a=u=>(u-t.minZ)*i,c=u=>u.forEach(([h,d],f)=>f?r.lineTo(o(h),a(d)):r.moveTo(o(h),a(d)));this.idle(()=>{r.fillStyle=ou,r.fillRect(0,0,1024,1024),r.fillStyle=Mf,r.beginPath();for(let u of e.land)c(u.outer),r.closePath();r.fill(),r.fillStyle=wf,r.beginPath();for(let u of e.parks)c(u),r.closePath();r.fill(),r.lineCap=r.lineJoin="round",r.strokeStyle=Sf,r.lineWidth=45*i,r.beginPath();for(let u of e.runways)c(u);r.stroke()});for(let u=0;u<=4;u++)this.idle(()=>{r.strokeStyle=Af[u],r.lineWidth=c1[u],r.beginPath();for(let h of e.roads)h.c===u&&c(h.p);r.stroke(),u===4&&(this.stats.world=!0)})}key(e,t){return e*65536+t}index(e){let t=new Map,n=new Map,i=(s,r,o)=>{let a=1/0,c=-1/0,u=1/0,h=-1/0;for(let[d,f]of r)d<a&&(a=d),d>c&&(c=d),f<u&&(u=f),f>h&&(h=f);for(let d=Math.floor(a/500);d<=Math.floor(c/500);d++)for(let f=Math.floor(u/500);f<=Math.floor(h/500);f++){let p=this.key(d,f),m=s.get(p);m||s.set(p,m=[]),m.push(o)}};e.roads.forEach((s,r)=>i(t,s.p,r)),e.parks.forEach((s,r)=>i(n,s,r)),this.grid=t,this.parkGrid=n,this.stamp=new Uint32Array(e.roads.length),this.parkStamp=new Uint32Array(e.parks.length)}query(e,t,n,i,s,r,o){o.length=0;for(let a=Math.floor(n/500);a<=Math.floor(s/500);a++)for(let c=Math.floor(i/500);c<=Math.floor(r/500);c++){let u=e.get(this.key(a,c));if(u)for(let h of u)t[h]!==this.gen&&(t[h]=this.gen,o.push(h))}return o}queueTile(e,t){if(this.want.ppm=e,this.want.cssPerM=t,this.tileQueued)return;this.tileQueued=!0;let n=()=>{if(!this.grid){this.index(this.data),this.idle(n,!0);return}this.tileQueued=!1;let i=this.g.S,s=i.mode==="walk"?i.walk:i.car;this.renderTile(s.x,s.z,this.want.ppm,this.want.cssPerM)};this.idle(n,!0)}renderTile(e,t,n,i){let s=performance.now(),r=this.data,o=this.tile.getContext("2d"),a=1024/2/n,c=e-a,u=e+a,h=t-a,d=t+a,f=_=>(_-e)*n+1024/2,p=_=>(_-t)*n+1024/2,m=_=>_.forEach(([A,E],C)=>C?o.lineTo(f(A),p(E)):o.moveTo(f(A),p(E)));o.fillStyle=ou,o.fillRect(0,0,1024,1024),o.fillStyle=Mf,o.beginPath();for(let _ of r.land)m(_.outer),o.closePath();o.fill();let g=[];this.gen++,o.fillStyle=wf,o.beginPath();for(let _ of this.query(this.parkGrid,this.parkStamp,c,h,u,d,g))m(r.parks[_]),o.closePath();o.fill(),o.lineCap=o.lineJoin="round",o.strokeStyle=Sf,o.lineWidth=45*n,o.beginPath();for(let _ of r.runways)m(_);o.stroke(),this.gen++;let b=this.query(this.grid,this.stamp,c,h,u,d,g),v=n/i,M=(_,A,E)=>{o.strokeStyle=E,o.lineWidth=A,o.beginPath();for(let C of b){let T=r.roads[C];T.c===_&&m(T.p)}o.stroke()};for(let _=2;_<=4;_++)M(_,(Tf[_]+1.2)*v,l1);for(let _=0;_<=4;_++)M(_,Tf[_]*v,Af[_]);this.tcx=e,this.tcz=t,this.tppm=n,this.tileOk=!0,this.stats.tiles++,this.stats.tileMs=Math.round((performance.now()-s)*10)/10}draw(e,t,n,i,s,r,o,a){let c=this.ctx;if(!c)return;this.data||this.start(a,r);let u=this.g.S,h=u.mode,f=h==="car"||h==="moto"?900+Math.min(45,Math.abs(u.car.s||0))*13:h==="walk"?480:i;this.range=!this.range||h==="plane"?f:this.range+(f-this.range)*.12;let p=this.range,m=this.canvas.width,g=m/this.css,b=m/p;c.save(),c.fillStyle=ou,c.fillRect(0,0,m,m),c.translate(m/2,m/2),c.rotate(n);let v=!1;if(p<=2e3){let M=p<700?.75:.36,_=1024/2/M-p*.5-Math.max(Math.abs(e-this.tcx),Math.abs(t-this.tcz));v=this.tileOk&&this.tppm===M&&_>20,(!v||_<300)&&this.queueTile(M,b/g)}if(v){let M=p*this.tppm;c.drawImage(this.tile,(e-this.tcx)*this.tppm+1024/2-M/2,(t-this.tcz)*this.tppm+1024/2-M/2,M,M,-m/2,-m/2,m,m)}else{let M=this.stats.world,_=M?this.world:s.c,A=M?this.wk:s.k,E=p*A;c.drawImage(_,(e-r.minX)*A-E/2,(t-r.minZ)*A-E/2,E,E,-m/2,-m/2,m,m)}this.pois(c,e,t,n,b,g,m,o,p<=2e3),c.restore(),this.chrome(c,m,n,g)}pois(e,t,n,i,s,r,o,a,c){let u=o/2-4*r,h=u*u,d=this.pick;d.length=0,e.lineWidth=1.2*r,e.strokeStyle="#fff";for(let v of a){let M=(v.x-t)*s,_=(v.z-n)*s,A=M*M+_*_;A>h||v.k.startsWith("m_")||(c&&h1.has(v.cat)&&(e.fillStyle=v.bg==="#ffffff"||v.bg==="#f4f1e6"?v.fg:v.bg,e.beginPath(),e.arc(M,_,2.4*r,0,6.2832),e.fill(),e.stroke()),u1.has(v.cat)&&v.sign&&d.push({b:v,d:v.cat==="store"?A:A*.3,x:M,y:_}))}d.sort((v,M)=>v.d-M.d);let f=this.placed;f.length=0,e.font=`800 ${Math.round(9.5*r)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.lineJoin="round";let p=Math.sin(i),m=Math.cos(i),g=0,b=0;for(let v of d){if(g>=3||b>24)break;let M=v.x*m-v.y*p,_=v.x*p+v.y*m-9*r;if(Math.abs(M)<18*r&&Math.abs(_)<19*r)continue;b++;let A=v.b.sign.length>14?v.b.sign.slice(0,13)+"\u2026":v.b.sign,E=e.measureText(A).width+8*r,C=15*r;if(Math.hypot(Math.abs(M)+E/2,Math.abs(_)+C/2)>o/2-2*r)continue;let T=!1;for(let R=0;R<f.length;R+=4)if(Math.abs(M-f[R])*2<E+f[R+2]&&Math.abs(_-f[R+1])*2<C+f[R+3]){T=!0;break}T||Math.abs(M)<E/2+10*r&&Math.abs(_)<C/2+11*r||(f.push(M,_,E,C),e.save(),e.rotate(-i),e.lineWidth=3.2*r,e.strokeStyle="rgba(10,14,18,.85)",e.strokeText(A,M,_),e.fillStyle="#fff",e.fillText(A,M,_),e.restore(),g++)}this.stats.labels=g}chrome(e,t,n,i){let s=t/2;(!this.rim||this.rimW!==t)&&(this.rim=e.createRadialGradient(s,s,s*.72,s,s,s),this.rimW=t,this.rim.addColorStop(0,"rgba(0,0,0,0)"),this.rim.addColorStop(1,"rgba(0,0,0,.38)")),e.fillStyle=this.rim,e.fillRect(0,0,t,t),e.save(),e.translate(s,s),e.beginPath(),e.moveTo(0,-9*i),e.lineTo(7*i,7*i),e.lineTo(0,3.2*i),e.lineTo(-7*i,7*i),e.closePath(),e.lineJoin="round",e.lineWidth=3*i,e.strokeStyle="#11161b",e.stroke(),e.fillStyle="#fff",e.fill();let r=s-9*i,o=Math.sin(n)*r,a=-Math.cos(n)*r;e.beginPath(),e.arc(o,a,7.5*i,0,6.2832),e.fillStyle="#11161bdd",e.fill(),e.lineWidth=1.4*i,e.strokeStyle="#ffd23f",e.stroke(),e.font=`900 ${Math.round(9*i)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffd23f",e.fillText("N",o,a+.5*i),e.restore()}};function Ae(l,e,t){let n=l[e],i=l[t],s=i[0]-n[0],r=i[1]-n[1],o=Math.hypot(s,r)||1,a=s/o,c=r/o,u=-c,h=a,d=(n[0]+i[0])*.5,f=(n[1]+i[1])*.5,p=0,m=0;for(let A of l)p+=A[0],m+=A[1];p/=l.length,m/=l.length,(p-d)*u+(m-f)*h<0&&(u=-u,h=-h);let g=0,b=1/0,v=-1/0,M=1/0,_=-1/0;for(let A of l)g=Math.max(g,(A[0]-d)*u+(A[1]-f)*h),b=Math.min(b,A[0]),v=Math.max(v,A[0]),M=Math.min(M,A[1]),_=Math.max(_,A[1]);return b-=1.6,v+=1.6,M-=1.6,_+=1.6,{mx:d,mz:f,ux:a,uz:c,nx:u,nz:h,halfW:o*.5,depth:g,minX:b,maxX:v,minZ:M,maxZ:_}}function Je(l,e,t,n){let i=Math.cos(n),s=Math.sin(n),r=(f,p)=>e+i*f+s*p,o=(f,p)=>t-s*f+i*p,a=[[l.mx+l.ux*l.halfW,l.mz+l.uz*l.halfW],[l.mx-l.ux*l.halfW,l.mz-l.uz*l.halfW],[l.mx+l.nx*l.depth,l.mz+l.nz*l.depth],[l.mx+l.nx*l.depth+l.ux*l.halfW,l.mz+l.nz*l.depth+l.uz*l.halfW],[l.mx+l.nx*l.depth-l.ux*l.halfW,l.mz+l.nz*l.depth-l.uz*l.halfW],[l.mx-l.nx*1.4,l.mz-l.nz*1.4]],c=1/0,u=-1/0,h=1/0,d=-1/0;for(let f of a){let p=r(f[0],f[1]),m=o(f[0],f[1]);c=Math.min(c,p),u=Math.max(u,p),h=Math.min(h,m),d=Math.max(d,m)}return{mx:r(l.mx,l.mz),mz:o(l.mx,l.mz),ux:i*l.ux+s*l.uz,uz:-s*l.ux+i*l.uz,nx:i*l.nx+s*l.nz,nz:-s*l.nx+i*l.nz,halfW:l.halfW,depth:l.depth,minX:c-.5,maxX:u+.5,minZ:h-.5,maxZ:d+.5,doorAt:l.doorAt,mouthOut:l.mouthOut,mouthIn:l.mouthIn}}function d1(l,e,t){let n=!1;for(let i=0,s=l.length-1;i<l.length;s=i++){let r=l[i][0],o=l[i][1],a=l[s][0],c=l[s][1],u=c-o;o>t==c>t||u===0||e<(a-r)*(t-o)/u+r&&(n=!n)}return n}function Ef(l,e,t,n,i,s){if(t<l.minX||t>l.maxX||n<l.minZ||n>l.maxZ)return!1;let r=t-l.mx,o=n-l.mz,a=r*l.ux+o*l.uz,c=r*l.nx+o*l.nz,u=l.doorAt??0,h=l.mouthOut??-1.25,d=l.mouthIn??1.8,f=Math.abs(a-u)<i-.06&&c>h&&c<d,p=Math.abs(a)<l.halfW-s&&c>s&&c<l.depth-s&&(!l.poly||d1(l.poly,t,n));if(!f&&!p)return!1;for(let m=0;m<e.length;m++){let g=e[m];if(a>g.a0&&a<g.a1&&c>g.d0&&c<g.d1)return!1}return!0}var V=class{constructor(){x(this,"p",[]);x(this,"n",[]);x(this,"c",[]);x(this,"u",[]);x(this,"ix",[]);x(this,"hasUv",!1)}quad(e,t,n,i){let s=e[1][0]-e[0][0],r=e[1][1]-e[0][1],o=e[1][2]-e[0][2],a=e[2][0]-e[0][0],c=e[2][1]-e[0][1],u=e[2][2]-e[0][2],h=r*u-o*c,d=o*a-s*u,f=s*c-r*a;if(!(h*h+d*d+f*f>1e-10))return;let m=Math.hypot(t[0],t[1],t[2])||1,g=t[0]/m,b=t[1]/m,v=t[2]/m,M=h*g+d*b+f*v<0,_=this.p.length/3;for(let A=0;A<4;A++){let E=e[A];if(this.p.push(E[0],E[1],E[2]),this.n.push(g,b,v),this.c.push(n[0],n[1],n[2]),i){this.hasUv=!0;let C=i[A];this.u.push(C[0],C[1])}}M?this.ix.push(_,_+3,_+2,_,_+2,_+1):this.ix.push(_,_+1,_+2,_,_+2,_+3)}geometry(){let e=new le;return e.setAttribute("position",new de(this.p,3)),e.setAttribute("normal",new de(this.n,3)),e.setAttribute("color",new de(this.c,3)),this.hasUv&&e.setAttribute("uv",new de(this.u,2)),e.setIndex(new Fi(this.ix,1)),e.computeBoundingSphere(),f1(e),e}get tris(){return this.ix.length/3}};function f1(l){let e=l.getAttribute("normal");if(!e)return;let t=e.array;for(let n=0;n<t.length;n+=3){let i=t[n],s=t[n+1],r=t[n+2];(!Number.isFinite(i+s+r)||i*i+s*s+r*r<1e-8)&&(t[n]=0,t[n+1]=1,t[n+2]=0)}}function y(l,e,t,n){return[l.mx+l.ux*e+l.nx*t,n,l.mz+l.uz*e+l.nz*t]}function S(l,e,t,n,i,s,r,o,a){if(!(n>t+1e-4&&s>i+1e-4&&o>r+1e-4))return;let c=y(e,t,i,r),u=y(e,n,i,r),h=y(e,n,s,r),d=y(e,t,s,r),f=y(e,t,i,o),p=y(e,n,i,o),m=y(e,n,s,o),g=y(e,t,s,o),b=[e.ux,0,e.uz],v=[-e.ux,0,-e.uz],M=[e.nx,0,e.nz],_=[-e.nx,0,-e.nz];l.quad([f,p,m,g],[0,1,0],a),l.quad([c,u,h,d],[0,-1,0],a),l.quad([d,g,m,h],M,a),l.quad([c,u,p,f],_,a),l.quad([u,h,m,p],b,a),l.quad([c,f,g,d],v,a)}var cu=-7087.55,uu=24.62,Lf=[[-7092.6,32.4],[-7084.3,33.3],[-7082.5,16.8],[-7090.8,16]],p1=[[-5.05,7.775],[3.25,8.675],[5.05,-7.826],[-3.25,-8.625]],$i=Ae(p1,2,3);$i.doorAt=0;var ma=[.82,.1,.11],Rf=[.62,.06,.07],bn=[.96,.93,.86],m1=[.94,.88,.76],Cf=[.84,.74,.58],Pf=[.02,.4,.2],g1=[.48,.28,.14],x1=[.95,.93,.88],au=[.68,.7,.72],b1=[.86,.58,.16],Df=[{a0:-3.6,a1:-.35,d0:2.6,d1:4.05},{a0:-2.4,a1:-.6,d0:2.05,d1:2.75},{a0:1.85,a1:2.85,d0:1.15,d1:2.15},{a0:-2.9,a1:-1.9,d0:4.9,d1:5.9},{a0:1.3,a1:2.3,d0:5.7,d1:6.7},{a0:-2.7,a1:-1.7,d0:8.7,d1:9.7},{a0:1.05,a1:2.05,d0:9.5,d1:10.5},{a0:-2.2,a1:-1.2,d0:11.9,d1:12.9},{a0:-3.5,a1:-.45,d0:14.3,d1:15.9}],Js={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function v1(){let l=new V;S(l,Js,-.19,.19,-.17,.17,.42,.47,ma),S(l,Js,-.19,.19,-.2,-.145,.47,.9,Rf);for(let[e,t]of[[-.15,-.13],[.15,-.13],[-.15,.13],[.15,.13]])S(l,Js,e-.018,e+.018,t-.018,t+.018,.02,.42,Rf);return l.geometry()}function _1(){let l=new V;return S(l,Js,-.3,.3,-.3,.3,.7,.75,ma),S(l,Js,-.05,.05,-.05,.05,.04,.7,[.9,.9,.88]),l.geometry()}function y1(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f6f1e4",e.fillRect(0,0,512,512),e.fillStyle="#06733a",e.fillRect(0,0,512,86),e.fillStyle="#ffffff",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("PASTECHI HOUSE",256,46),[["Cheese","2.50"],["Ham & Cheese","3.00"],["Beef","3.00"],["Chicken","3.00"],["Tuna","3.00"],["Keri Keri","3.50"],["Lobster","5.00"],["Croquette","2.00"],["Bitterbal","2.00"],["Dedito","2.50"],["Smoothie","4.00"],["Iced Coffee","3.50"]].forEach((i,s)=>{let r=118+s*28;e.fillStyle=s%2?"#efe6d4":"#f6f1e4",e.fillRect(18,r-18,476,28),e.fillStyle="#2a2118",e.font="600 22px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],484,r)}),e.fillStyle="#06733a",e.font="700 18px Arial, sans-serif",e.textAlign="center",e.fillText("spicy garlic sauce  \xB7  take away or sit in",256,484),e.fillStyle="#e0a030",e.beginPath(),e.arc(256,452,16,Math.PI,0),e.quadraticCurveTo(256,468,240,452),e.fill();let n=new re(l);return n.colorSpace=Z,n.anisotropy=4,n}function If(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,t-r,a,i),y(e,t+r,a,i),y(e,t+r,a,s),y(e,t-r,a,s)],c,[1,1,1],u)};o(n,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(n+.02,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var Nf=new w(0,1,0),ga=new Y,xa=new w,M1=new w(1,1,1),Of=new O;function lu(l,e,t,n,i,s){let r=y(t,n,i,0);xa.set(r[0],0,r[2]),ga.setFromAxisAngle(Nf,Math.atan2(s[0],s[1])),l.setMatrixAt(e,Of.compose(xa,ga,M1))}function Ff(l,e){let t=new V,n=$i.halfW,i=$i.depth,s=.34,r=.9;for(let F=-n+s;F<n-s-.05;F+=r)for(let z=.2;z<i-s-.05;z+=r){let W=Math.min(F+r-.03,n-s),J=Math.min(z+r-.03,i-s),j=(Math.round(F/r)+Math.round(z/r)&1)===0;t.quad([y(e,F,z,.04),y(e,W,z,.04),y(e,W,J,.04),y(e,F,J,.04)],[0,1,0],j?m1:Cf)}t.quad([y(e,-2.25,-.5,.03),y(e,2.25,-.5,.03),y(e,2.25,.16,.03),y(e,-2.25,.16,.03)],[0,1,0],Cf),t.quad([y(e,-n+.28,.5,3.42),y(e,n-.28,.5,3.42),y(e,n-.28,i-.35,3.42),y(e,-n+.28,i-.35,3.42)],[0,-1,0],[.93,.92,.88]);for(let F of[2.2,8.2])t.quad([y(e,-1.1,F,3.48),y(e,1.1,F,3.48),y(e,1.1,F+.55,3.48),y(e,-1.1,F+.55,3.48)],[0,-1,0],[1,.95,.78]);let o=.12,a=-2.4,c=2.4;S(t,e,-n+.18,-n+.18+o,.4,i-.25,.05,3.52,bn),S(t,e,n-.18-o,n-.18,.4,i-.25,.05,3.52,bn),S(t,e,-n+.25,n-.25,i-.3,i-.3+o,.05,3.52,bn),S(t,e,-n+.2,a,.2,.2+o,.02,2.22,bn),S(t,e,c,n-.2,.2,.2+o,.02,2.22,bn),S(t,e,a,c,.2,.2+o,2.08,2.26,bn),S(t,e,-n+.22,a,.22,.32,.02,.14,ma),S(t,e,c,n-.22,.22,.32,.02,.14,ma),S(t,e,a,c,.18,.3,2.1,2.24,Pf),S(t,e,-3.45,-.45,2.75,3.9,.04,1,g1),S(t,e,-3.5,-.4,2.7,3.95,1,1.06,x1),S(t,e,-3.4,-.5,2.7,2.82,.48,.98,Pf),S(t,e,-2.25,-.7,2.15,2.7,1.06,1.14,au),S(t,e,-2.15,-.8,2.22,2.62,1.14,1.18,b1),S(t,e,-3.4,-.55,14.4,15.75,.04,.92,au),S(t,e,-2.6,-1.2,14.55,15.4,.92,.98,[.2,.18,.16]),S(t,e,-2.45,-1.35,14.7,15.2,.98,1.06,[1,.42,.08]),S(t,e,-.08,.08,7.9,8.06,3.15,3.42,au),S(t,e,-.85,.85,7.94,8.02,3.28,3.34,bn),S(t,e,-.04,.04,7.15,8.8,3.28,3.34,bn);let u=t.geometry(),h=new k({vertexColors:!0,side:K}),d=new B(u,h);d.name="aw:pastechi:shell",d.castShadow=!1,d.receiveShadow=!1,l.add(d);let f=y1();if(f){let F=new V;If(F,e,-1.9,3.92,1.4,2.65,1.05),If(F,e,.4,i-.2,1.35,2.6,1.05);let z=new B(F.geometry(),new k({map:f,side:K}));z.name="aw:pastechi:menu",z.castShadow=!1,z.receiveShadow=!1,l.add(z)}let p=new V,m=[.75,.9,.95],g=1.18,b=1.48,v=-2.2,M=-.75,_=2.18,A=2.66;p.quad([y(e,v,_,b),y(e,M,_,b),y(e,M,A,b),y(e,v,A,b)],[0,1,0],m),p.quad([y(e,v,A,g),y(e,v,A,b),y(e,v,_,b),y(e,v,_,g)],[-e.ux,0,-e.uz],m),p.quad([y(e,M,_,g),y(e,M,_,b),y(e,M,A,b),y(e,M,A,g)],[e.ux,0,e.uz],m),p.quad([y(e,v,A,g),y(e,M,A,g),y(e,M,A,b),y(e,v,A,b)],[e.nx,0,e.nz],m);let E=new k({color:12051698,transparent:!0,opacity:.28,depthWrite:!1,side:K}),C=new B(p.geometry(),E);C.name="aw:pastechi:glass",C.renderOrder=2,C.castShadow=!1,C.receiveShadow=!1,l.add(C);let T=new q(v1(),new k({vertexColors:!0}),12);T.name="aw:pastechi:chairs",T.castShadow=!1,T.receiveShadow=!1,T.frustumCulled=!1;let R=new q(_1(),new k({vertexColors:!0}),6);R.name="aw:pastechi:tables",R.castShadow=!1,R.receiveShadow=!1,R.frustumCulled=!1;let I=[[2.35,1.65],[-2.4,5.4],[1.8,6.2],[-2.2,9.2],[1.55,10],[-1.7,12.4]];I.forEach(([F,z],W)=>{lu(R,W,e,F,z,[0,1]);let J=[e.nx,e.nz],j=[-e.nx,-e.nz];lu(T,W*2,e,F,z-.58,J),lu(T,W*2+1,e,F,z+.58,j)}),T.count=I.length*2,R.count=I.length,T.instanceMatrix.needsUpdate=!0,R.instanceMatrix.needsUpdate=!0,T.boundingSphere=new X(new w(0,1,0),22),R.boundingSphere=new X(new w(0,1,0),22),l.add(T,R);let P=new q(new Ge(.09,6,4),new k({color:14721072}),8);P.name="aw:pastechi:pastry",P.castShadow=!1,P.receiveShadow=!1,P.frustumCulled=!1;let D=new w(1.35,.45,.95),N=0;for(let F of[-1.95,-1.6,-1.25,-.9])for(let z of[2.3,2.52]){let W=y(e,F,z,1.28);xa.set(W[0],W[1],W[2]),ga.setFromAxisAngle(Nf,F*.4),P.setMatrixAt(N++,Of.compose(xa,ga,D))}P.count=N,P.instanceMatrix.needsUpdate=!0,P.boundingSphere=new X(new w(0,1,0),22),l.add(P)}var mu=-7957.65,gu=-5466.6,zf=[[-7969.2,-5451.9],[-7951.9,-5448.8],[-7946.1,-5481.3],[-7963.4,-5484.4]],w1=[[-11.55,14.7],[5.75,17.8],[11.55,-14.7],[-5.75,-17.8]],oi=Ae(w1,1,0),fu=-5.5,va=2.15,kf=2.9;oi.doorAt=fu;oi.depth=16;var ba=[.86,.05,.04],Uf=[.62,.04,.03],hu=[1,.74,.05],Gf=[.78,.78,.76],Hf=[.62,.62,.6],Qi=[.93,.91,.86],S1=[.45,.28,.14],Vf=[{a0:-2.5,a1:4.7,d0:3.05,d1:4.45},{a0:-4.4,a1:-3.8,d0:1.9,d1:2.6},{a0:-7.55,a1:-6.95,d0:1.9,d1:2.6},{a0:-7.9,a1:-6.7,d0:4.9,d1:6.35},{a0:-4.3,a1:-3.1,d0:6.05,d1:7.55},{a0:-7.75,a1:-6.65,d0:8.65,d1:10.2},{a0:.85,a1:1.95,d0:5.05,d1:6.55},{a0:3.2,a1:4.4,d0:8.45,d1:9.95},{a0:-3.2,a1:3.4,d0:13.25,d1:15.05}],$s={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function A1(){let l=new V;S(l,$s,-.2,.2,-.18,.18,.42,.48,ba),S(l,$s,-.2,.2,-.2,-.14,.48,.92,Uf);for(let[e,t]of[[-.16,-.14],[.16,-.14],[-.16,.14],[.16,.14]])S(l,$s,e-.02,e+.02,t-.02,t+.02,.02,.42,Uf);return l.geometry()}function T1(){let l=new V;return S(l,$s,-.42,.42,-.42,.42,.7,.76,Gf),S(l,$s,-.06,.06,-.06,.06,.04,.7,Hf),l.geometry()}function E1(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4f1ea",e.fillRect(0,0,512,512),e.fillStyle="#db0007",e.fillRect(0,0,512,78),e.fillStyle="#ffbc0d",e.beginPath(),e.arc(70,118,28,Math.PI,0),e.arc(108,118,28,Math.PI,0),e.fill(),e.fillStyle="#ffffff",e.font="700 36px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("McDONALD'S",300,40),[["Big Mac","8.50"],["Cheeseburger","3.50"],["Quarter Pounder","7.50"],["McNuggets","6.00"],["Fries","3.00"],["McFlurry","4.50"],["Coca-Cola","2.50"],["Coffee","2.50"]].forEach((i,s)=>{let r=130+s*40;e.fillStyle=s%2?"#fff6d8":"#f4f1ea",e.fillRect(16,r-22,480,40),e.fillStyle="#2a2118",e.font="600 26px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],480,r)}),e.fillStyle="#db0007",e.font="700 20px Arial, sans-serif",e.textAlign="center",e.fillText("i'm lovin' it",256,480);let n=new re(l);return n.colorSpace=Z,n}function Bf(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,t-r,a,i),y(e,t+r,a,i),y(e,t+r,a,s),y(e,t-r,a,s)],c,[1,1,1],u)};o(n,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(n+.03,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var R1=new w(0,1,0),pu=new Y,_a=new w,C1=new w(1,1,1),Wf=new O;function du(l,e,t,n,i,s){let r=y(t,n,i,0);_a.set(r[0],0,r[2]),pu.setFromAxisAngle(R1,Math.atan2(s[0],s[1])),l.setMatrixAt(e,Wf.compose(_a,pu,C1))}function Xf(l,e){let t=new V,n=oi.halfW,i=oi.depth,s=fu-va,r=fu+va;t.quad([y(e,-n+.35,.2,.02),y(e,n-.35,.2,.02),y(e,n-.35,i-.35,.02),y(e,-n+.35,i-.35,.02)],[0,1,0],[.7,.7,.68]);let o=1.3;for(let g=-n+.5;g<n-.6;g+=o)for(let b=.25;b<i-.5;b+=o){let v=Math.min(g+o-.04,n-.45),M=Math.min(b+o-.04,i-.4),_=(Math.round(g/o)+Math.round(b/o)&1)===0;t.quad([y(e,g,b,.04),y(e,v,b,.04),y(e,v,M,.04),y(e,g,M,.04)],[0,1,0],_?Gf:Hf)}t.quad([y(e,-n+.4,.25,3.15),y(e,n-.4,.25,3.15),y(e,n-.4,i-.4,3.15),y(e,-n+.4,i-.4,3.15)],[0,-1,0],[.9,.9,.88]);let a=.12;S(t,e,-n+.22,-n+.22+a,.35,i-.3,.04,3.2,Qi),S(t,e,n-.22-a,n-.22,.35,i-.3,.04,3.2,Qi),S(t,e,-n+.3,n-.3,i-.32,i-.2,.04,3.2,Qi),S(t,e,-n+.25,s,.16,.16+a,.02,2.9,Qi),S(t,e,r,n-.25,.16,.16+a,.02,2.9,Qi),S(t,e,s,r,.18,.18+a,2.62,2.88,hu),S(t,e,s+.04,s+.18,.2,.48,.02,2.75,ba),S(t,e,r-.18,r-.04,.2,.48,.02,2.75,ba),S(t,e,-n+.3,n-.3,.2,.42,2.92,3.18,Qi),S(t,e,-2.4,4.6,3.15,4.35,.04,1.05,S1),S(t,e,-2.5,4.7,3.08,4.42,1.05,1.12,[.95,.95,.93]),S(t,e,-2.35,4.55,3.08,3.22,.42,1.02,ba),S(t,e,-1.6,1.6,3.04,3.18,1.12,1.22,hu),S(t,e,-4.35,-3.85,1.95,2.5,.04,1.35,[.16,.16,.17]),S(t,e,-4.28,-3.92,1.9,2.02,.7,1.22,[.05,.05,.06]),S(t,e,-7.5,-7,1.95,2.5,.04,1.35,[.16,.16,.17]),S(t,e,-7.43,-7.07,1.9,2.02,.7,1.22,[.05,.05,.06]),S(t,e,-3,3.2,13.4,14.9,.04,1,[.22,.22,.24]),S(t,e,-1.2,1,13.55,14.6,1,1.08,hu);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:mcd:shell",l.add(c);let u=E1();if(u){let g=new V;Bf(g,e,-2.15,2.55,1.35,2.75,.7),Bf(g,e,1,4.5,1.45,2.9,1.55);let b=new B(g.geometry(),new k({map:u,side:K}));b.name="aw:mcd:menu",l.add(b)}let h=new q(A1(),new k({vertexColors:!0}),10),d=new q(T1(),new k({vertexColors:!0}),5);h.name="aw:mcd:chairs",d.name="aw:mcd:tables",h.frustumCulled=!1,d.frustumCulled=!1;let f=[[-7.3,5.6],[-3.7,6.8],[-7.2,9.4],[1.4,5.8],[3.8,9.2]];f.forEach(([g,b],v)=>{du(d,v,e,g,b,[0,1]),du(h,v*2,e,g,b-.7,[e.nx,e.nz]),du(h,v*2+1,e,g,b+.7,[-e.nx,-e.nz])}),h.count=f.length*2,d.count=f.length,h.instanceMatrix.needsUpdate=!0,d.instanceMatrix.needsUpdate=!0,h.boundingSphere=new X(new w(0,1,0),24),d.boundingSphere=new X(new w(0,1,0),24),l.add(h,d);let p=new q(new Ge(.08,5,4),new k({color:16759821}),4);p.name="aw:mcd:bags",p.frustumCulled=!1;let m=new w(.7,1.1,.7);[-1.4,-.3,.8,1.9].forEach((g,b)=>{let v=y(e,g,3.7,1.22);_a.set(v[0],v[1],v[2]),p.setMatrixAt(b,Wf.compose(_a,pu.identity(),m))}),p.count=4,p.instanceMatrix.needsUpdate=!0,p.boundingSphere=new X(new w(0,1,0),20),l.add(p)}var _u=-8064.4,yu=-5917.18,qf=[[-8085.1,-5908.6],[-8045.2,-5904.4],[-8042.6,-5926.7],[-8084.7,-5929]],P1=[[-20.7,8.57],[19.2,12.77],[21.8,-9.53],[-20.3,-11.82]],ai=Ae(P1,3,2),bu=0,Ma=2.2,wa=2.85;ai.doorAt=bu;ai.depth=14;var ya=[0,.44,.29],er=[.12,.22,.2],Yf=[.62,.4,.2],Sa=[.4,.24,.12],Qs=[.95,.92,.86],I1=[.94,.92,.88],L1=[.55,.62,.58],D1=[.97,.96,.94],Zf=[{a0:3.3,a1:11.3,d0:2.3,d1:4},{a0:3.15,a1:4.7,d0:1.5,d1:2.4},{a0:-8.1,a1:-6.9,d0:4.7,d1:5.9},{a0:-4.9,a1:-3.5,d0:7.4,d1:8.6},{a0:-8.6,a1:-7.4,d0:9.9,d1:11.1},{a0:5.9,a1:7.1,d0:6,d1:7.2},{a0:2,a1:3.2,d0:8.5,d1:9.7},{a0:-3.4,a1:-2.2,d0:10.9,d1:12.1},{a0:-4.2,a1:8.2,d0:12.5,d1:13.8}],tr={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function N1(){let l=new V;S(l,tr,-.2,.2,-.18,.18,.44,.5,er),S(l,tr,-.2,.2,-.2,-.14,.5,.92,ya);for(let[e,t]of[[-.16,-.14],[.16,-.14],[-.16,.14],[.16,.14]])S(l,tr,e-.02,e+.02,t-.02,t+.02,.02,.44,Sa);return l.geometry()}function O1(){let l=new V;return S(l,tr,-.42,.42,-.42,.42,.72,.78,Yf),S(l,tr,-.06,.06,-.06,.06,.05,.72,Sa),l.geometry()}function F1(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f3efe6",e.fillRect(0,0,512,512),e.fillStyle="#00704a",e.fillRect(0,0,512,86),e.fillStyle="#ffffff",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("STARBUCKS",256,34),e.font="600 18px Arial, sans-serif",e.fillText("Paseo Herencia",256,66),[["Pike Place","4.25"],["Caffe Latte","5.50"],["Cappuccino","5.25"],["Americano","4.50"],["Caramel Macchiato","6.25"],["Caffe Mocha","5.95"],["Frappuccino","6.50"],["Iced Tea","4.25"]].forEach((i,s)=>{let r=128+s*42;e.fillStyle=s%2?"#e7f2ec":"#f3efe6",e.fillRect(16,r-22,480,42),e.fillStyle="#1e3932",e.font="600 24px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],476,r)});let n=new re(l);return n.colorSpace=Z,n}function U1(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,a,n-r,i),y(e,a,n+r,i),y(e,a,n+r,s),y(e,a,n-r,s)],c,[1,1,1],u)};o(t,[-e.ux,0,-e.uz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.03,[e.ux,0,e.uz],[[0,0],[1,0],[1,1],[0,1]])}var B1=new w(0,1,0),vu=new Y,Aa=new w,z1=new w(1,1,1),Kf=new O;function xu(l,e,t,n,i,s){let r=y(t,n,i,0);Aa.set(r[0],0,r[2]),vu.setFromAxisAngle(B1,Math.atan2(s[0],s[1])),l.setMatrixAt(e,Kf.compose(Aa,vu,z1))}function jf(l,e){let t=new V,n=ai.halfW,i=ai.depth,s=bu-Ma,r=bu+Ma,o=.12;t.quad([y(e,-n+.4,.02,.02),y(e,n-.4,.02,.02),y(e,n-.4,i-.3,.02),y(e,-n+.4,i-.3,.02)],[0,1,0],[.72,.69,.64]);let a=1.6;for(let g=-n+.6;g<n-.7;g+=a)for(let b=.06;b<i-.45;b+=a){let v=Math.min(g+a-.05,n-.5),M=Math.min(b+a-.05,i-.35),_=(Math.round(g/a)+Math.round(b/a)&1)===0;t.quad([y(e,g,b,.07),y(e,v,b,.07),y(e,v,M,.07),y(e,g,M,.07)],[0,1,0],_?I1:L1)}t.quad([y(e,-n+.45,.3,3.15),y(e,n-.45,.3,3.15),y(e,n-.45,i-.35,3.15),y(e,-n+.45,i-.35,3.15)],[0,-1,0],[.93,.9,.84]),S(t,e,-n+.28,-n+.28+o,.4,i-.25,.04,3.15,Qs),S(t,e,n-.28-o,n-.28,.4,i-.25,.04,3.15,Qs),S(t,e,-n+.35,n-.35,i-.28,i-.16,.04,3.15,er),S(t,e,-n+.3,s,.16,.16+o,.02,wa,Qs),S(t,e,r,n-.3,.16,.16+o,.02,wa,Qs),S(t,e,s,r,.18,.18+o,2.52,2.8,ya),S(t,e,s+.04,s+.16,.18,.42,.02,2.7,er),S(t,e,r-.16,r-.04,.18,.42,.02,2.7,er),S(t,e,-n+.35,n-.35,.2,.4,2.88,3.16,Qs),S(t,e,3.4,11.2,2.45,3.9,.04,1.05,Yf),S(t,e,3.35,11.25,2.4,3.95,1.05,1.12,Sa),S(t,e,3.4,11.2,2.4,2.55,.2,1.05,ya),S(t,e,3.2,4.6,1.55,2.35,.7,1.15,D1),S(t,e,3.25,4.55,1.6,2.3,.15,.7,Sa),S(t,e,-4,8,12.7,13.6,.04,1,er),S(t,e,-1,2.2,12.85,13.4,1,1.08,ya);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:sbux:shell",l.add(c);let u=F1();if(u){let g=new V;U1(g,e,3.15,3.15,1.45,2.95,1.15);let b=new B(g.geometry(),new k({map:u,side:K}));b.name="aw:sbux:menu",l.add(b)}let h=[[-7.5,5.3],[-4.2,8],[-8,10.5],[6.5,6.6],[2.6,9.1],[-2.8,11.5]],d=new q(N1(),new k({vertexColors:!0}),h.length*2),f=new q(O1(),new k({vertexColors:!0}),h.length);d.name="aw:sbux:chairs",f.name="aw:sbux:tables",d.frustumCulled=!1,f.frustumCulled=!1,h.forEach(([g,b],v)=>{xu(f,v,e,g,b,[1,0]),xu(d,v*2,e,g-.75,b,[e.ux,e.uz]),xu(d,v*2+1,e,g+.75,b,[-e.ux,-e.uz])}),d.count=h.length*2,f.count=h.length,d.instanceMatrix.needsUpdate=!0,f.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new w(0,1,0),28),f.boundingSphere=new X(new w(0,1,0),28),l.add(d,f);let p=new q(new Ge(.07,6,4),new k({color:16052714}),4);p.name="aw:sbux:cups",p.frustumCulled=!1;let m=new w(.85,1.15,.85);[4.2,6.1,8,9.6].forEach((g,b)=>{let v=y(e,g,3.15,1.2);Aa.set(v[0],v[1],v[2]),p.setMatrixAt(b,Kf.compose(Aa,vu.identity(),m))}),p.count=4,p.instanceMatrix.needsUpdate=!0,p.boundingSphere=new X(new w(0,1,0),22),l.add(p)}var wu=-7891.58,Su=-5983.49,tp=[[-7971.5,-5946.6],[-7932.6,-5941.9],[-7933.2,-5937],[-7928.7,-5936.4],[-7928.1,-5941.4],[-7870.6,-5935.2],[-7871.9,-5933.5],[-7871.4,-5931.2],[-7869.7,-5930.2],[-7867.6,-5930.6],[-7866.8,-5931.4],[-7866.5,-5933.6],[-7867.9,-5935.3],[-7869.9,-5935.6],[-7866.5,-5970.7],[-7885.8,-5972.7],[-7884.4,-5986.3],[-7865.1,-5984.4],[-7861.6,-6019.9],[-7860.2,-6019.4],[-7858.2,-6019.9],[-7857,-6021.7],[-7857.4,-6023.7],[-7859.3,-6025],[-7861.4,-6024.6],[-7862.6,-6022.9],[-7862.3,-6020.7],[-7919.6,-6026.3],[-7919.1,-6032.4],[-7923,-6032.8],[-7923.2,-6030.6],[-7926.2,-6030.9],[-7926.5,-6027.1],[-7961.6,-6030.5]],ir={mx:39.8,mz:-17.5,ux:-.0995,uz:.995,nx:-.995,nz:-.0995,halfW:6.2,depth:22,minX:-20,maxX:55,minZ:-45,maxZ:10,doorAt:0,mouthIn:13.2},Ta=3.3,Ea=4.65,Jf=[.05,.28,.72],k1=[.03,.16,.42],nr=[.95,.93,.9],G1=[.93,.93,.9],H1=[.72,.78,.82],$f=[.84,.58,.4],V1=[.72,.08,.12],W1=[.95,.78,.12],X1=[.45,.3,.16],np=[{a0:3.15,a1:5.85,d0:14.1,d1:16.5},{a0:-5.85,a1:-3.15,d0:14.1,d1:16.5},{a0:-2.3,a1:2.3,d0:19.1,d1:21.3},{a0:2.05,a1:3.15,d0:13.5,d1:14.85},{a0:-3.15,a1:-2.05,d0:13.5,d1:14.85}],Mu={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function q1(){let l=new V;S(l,Mu,-.55,.55,-.22,.22,.42,.5,X1),S(l,Mu,-.55,.55,-.24,-.16,.5,.92,k1);for(let[e,t]of[[-.46,-.16],[.46,-.16],[-.46,.16],[.46,.16]])S(l,Mu,e-.03,e+.03,t-.03,t+.03,.04,.42,[.25,.27,.3]);return l.geometry()}function Y1(l,e,t,n){let i=document.createElement("canvas");i.width=512,i.height=256;let s=i.getContext("2d");if(!s)return null;s.fillStyle=t,s.fillRect(0,0,512,256),s.fillStyle=n,s.font="700 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(l,256,e?100:128),e&&(s.font="600 28px Arial, sans-serif",s.fillText(e,256,168));let r=new re(i);return r.colorSpace=Z,r}function Z1(l,e,t,n,i,s,r,o){let a=[e.nx*o,0,e.nz*o],c=o<0?[[1,0],[0,0],[0,1],[1,1]]:[[0,0],[1,0],[1,1],[0,1]];l.quad([y(e,t,i,s),y(e,n,i,s),y(e,n,i,r),y(e,t,i,r)],a,[1,1,1],c)}var K1=new w(0,1,0),Qf=new Y,ep=new w,j1=new w(1,1,1),J1=new O;function ip(l,e){let t=new V,n=ir.halfW,i=ir.depth,s=-Ta,r=Ta;t.quad([y(e,-n+.3,.15,.02),y(e,n-.3,.15,.02),y(e,n-.3,i-.25,.02),y(e,-n+.3,i-.25,.02)],[0,1,0],[.8,.8,.78]);let o=1.8;for(let d=-n+.45;d<n-.5;d+=o)for(let f=.2;f<i-.35;f+=o){let p=Math.min(d+o-.06,n-.4),m=Math.min(f+o-.06,i-.3),g=(Math.round(d/o)+Math.round(f/o)&1)===0;t.quad([y(e,d,f,.06),y(e,p,f,.06),y(e,p,m,.06),y(e,d,m,.06)],[0,1,0],g?G1:H1)}t.quad([y(e,-n+.35,.4,4.35),y(e,n-.35,.4,4.35),y(e,n-.35,i-.3,4.35),y(e,-n+.35,i-.3,4.35)],[0,-1,0],[.96,.96,.94]),S(t,e,s,r,.25,1.3,4.15,4.4,Jf),S(t,e,-n+.2,-n+.38,.4,i-.3,.04,4.3,nr),S(t,e,n-.38,n-.2,.4,i-.3,.04,4.3,nr),S(t,e,-n+.3,n-.3,i-.35,i-.18,.04,4.3,nr),S(t,e,-n+.3,s,.12,.32,.02,Ea,$f),S(t,e,r,n-.3,.12,.32,.02,Ea,$f),S(t,e,3.2,5.8,14.2,16.4,.05,1.05,nr),S(t,e,3.2,5.8,14.15,14.4,1.05,2.55,Jf),S(t,e,3.25,5.75,14.1,14.28,2.55,2.72,W1),S(t,e,-5.8,-3.2,14.2,16.4,.05,1.05,nr),S(t,e,-5.8,-3.2,14.15,14.4,1.05,2.45,[.15,.18,.45]),S(t,e,-2.2,2.2,19.2,21.2,.05,1.1,[.12,.12,.14]),S(t,e,-2.8,2.8,19.05,19.3,1.1,2.7,V1);let a=new B(t.geometry(),new k({vertexColors:!0,side:K}));a.name="aw:plaza:shell",l.add(a),[["SKECHERS","","#0a2a6b","#ffe14a",3.25,5.75,14.12,1.2,2.45],["NIEL'S","FASHION","#101433","#ffffff",-5.75,-3.25,14.12,1.15,2.35],["CARIBBEAN","CINEMAS","#b00018","#ffffff",-2.1,2.1,19.02,1.25,2.55],["PALM BEACH","PLAZA","#08306b","#ffffff",-1.8,1.8,6.4,2.85,4.05]].forEach((d,f)=>{let p=Y1(d[0],d[1],d[2],d[3]);if(!p)return;let m=new V;Z1(m,e,d[4],d[5],d[6],d[7],d[8],-1);let g=new B(m.geometry(),new k({map:p,side:K}));g.name="aw:plaza:sign"+f,l.add(g)});let u=[[2.6,14.15],[-2.6,14.15]],h=new q(q1(),new k({vertexColors:!0}),u.length);h.name="aw:plaza:benches",h.frustumCulled=!1,u.forEach(([d,f],p)=>{let m=y(e,d,f,0);ep.set(m[0],0,m[2]),Qf.setFromAxisAngle(K1,Math.atan2(e.ux,e.uz)),h.setMatrixAt(p,J1.compose(ep,Qf,j1))}),h.count=u.length,h.instanceMatrix.needsUpdate=!0,h.boundingSphere=new X(new w(0,1,0),24),l.add(h)}var Tu=-8050.1,Eu=-5471.13,rp=[[-8057.4,-5467.6],[-8044.4,-5465.4],[-8042.8,-5474.7],[-8055.8,-5476.8]],$1=[[-7.3,3.47],[5.7,5.73],[7.3,-3.57],[-5.7,-5.67]],li=Ae($1,0,1),Ia=1.65,La=3.4;li.doorAt=0;li.depth=7.6;var yn=[.07,.07,.08],sr=[.74,.05,.07],sp=[.93,.74,.1],Au=[.45,.28,.13],Ru=[.28,.16,.08],Q1=[.14,.14,.15],e_=[.22,.2,.18],t_=[.93,.9,.84],op=[{a0:1.55,a1:5.15,d0:2.15,d1:3.55},{a0:1.85,a1:2.45,d0:1.45,d1:2.05},{a0:3.05,a1:3.65,d0:1.45,d1:2.05},{a0:4.25,a1:4.85,d0:1.45,d1:2.05},{a0:-4.85,a1:-3.55,d0:3.15,d1:4.45},{a0:-4.7,a1:-3.4,d0:5.45,d1:6.75}],Mn={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function n_(){let l=new V;return S(l,Mn,-.16,.16,-.16,.16,.62,.72,yn),S(l,Mn,-.04,.04,-.04,.04,.08,.62,[.55,.55,.58]),S(l,Mn,-.14,.14,-.14,.14,.02,.08,yn),l.geometry()}function i_(){let l=new V;return S(l,Mn,-.42,.42,-.42,.42,.7,.76,Au),S(l,Mn,-.05,.05,-.05,.05,.05,.7,Ru),l.geometry()}function s_(){let l=new V;S(l,Mn,-.18,.18,-.18,.18,.42,.48,yn),S(l,Mn,-.18,.18,-.18,-.12,.48,.9,sr);for(let[e,t]of[[-.14,-.14],[.14,-.14],[-.14,.14],[.14,.14]])S(l,Mn,e-.02,e+.02,t-.02,t+.02,.04,.42,Ru);return l.geometry()}function r_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#141416",e.fillRect(0,0,512,512),e.fillStyle="#c8102e",e.fillRect(0,0,512,92),e.fillStyle="#f5d76e",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HARD ROCK",256,36),e.font="600 20px Arial, sans-serif",e.fillStyle="#ffffff",e.fillText("CAFE  \xB7  PALM BEACH",256,70),[["Legendary Burger","16"],["BBQ Ribs","22"],["Chicken Wings","14"],["Grilled Chicken","17"],["Caesar Salad","13"],["Fries","6"]].forEach((i,s)=>{let r=140+s*56;e.fillStyle=s%2?"#1c1c20":"#141416",e.fillRect(18,r-26,476,52),e.fillStyle="#f4efe4",e.font="600 26px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],36,r),e.fillStyle="#f5d76e",e.textAlign="right",e.fillText(i[1],472,r)});let n=new re(l);return n.colorSpace=Z,n}function o_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,a,n-r,i),y(e,a,n+r,i),y(e,a,n+r,s),y(e,a,n-r,s)],c,[1,1,1],u)};o(t,[-e.ux,0,-e.uz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.03,[e.ux,0,e.uz],[[1,0],[0,0],[0,1],[1,1]])}var Ra=new w(0,1,0),vn=new Y,_n=new w,Ca=new w(1,1,1),Pa=new O;function ap(l,e){let t=new V,n=li.halfW,i=li.depth,s=-Ia,r=Ia,o=.1;t.quad([y(e,-n+.3,.15,.02),y(e,n-.3,.15,.02),y(e,n-.3,i-.25,.02),y(e,-n+.3,i-.25,.02)],[0,1,0],[.1,.1,.11]);let a=1.35;for(let g=-n+.4;g<n-.45;g+=a)for(let b=.2;b<i-.35;b+=a){let v=Math.min(g+a-.05,n-.35),M=Math.min(b+a-.05,i-.28),_=(Math.round(g/a)+Math.round(b/a)&1)===0;t.quad([y(e,g,b,.05),y(e,v,b,.05),y(e,v,M,.05),y(e,g,M,.05)],[0,1,0],_?Q1:e_)}t.quad([y(e,-n+.35,.3,3.55),y(e,n-.35,.3,3.55),y(e,n-.35,i-.3,3.55),y(e,-n+.35,i-.3,3.55)],[0,-1,0],[.1,.1,.11]),S(t,e,-n+.18,-n+.18+o,.3,i-.2,.04,3.5,yn),S(t,e,n-.18-o,n-.18,.3,i-.2,.04,3.5,yn),S(t,e,-n+.25,n-.25,i-.28,i-.16,.04,3.5,yn),S(t,e,-n+.25,s,.12,.12+o,.02,La,yn),S(t,e,r,n-.25,.12,.12+o,.02,La,yn),S(t,e,s,r,.14,.14+o,3.05,3.32,sr),S(t,e,s,r,.16,.16+o,2.92,3.04,sp),S(t,e,1.6,5.1,2.2,3.5,.04,1.05,Au),S(t,e,1.55,5.15,2.15,3.55,1.05,1.12,Ru),S(t,e,1.6,5.1,2.15,2.32,.15,1.05,sr),S(t,e,1.55,1.72,2.2,3.5,.15,1.05,sr),S(t,e,1.6,5.1,2.15,2.28,1.02,1.08,sp),S(t,e,-.55,.55,i-.42,i-.22,1.15,1.85,sr),S(t,e,-.08,.08,i-.4,i-.24,1.85,2.85,Au),S(t,e,-.16,.16,i-.4,i-.24,2.85,3.1,t_);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:hr:shell",l.add(c);let u=r_();if(u){let g=new V;o_(g,e,1.52,2.85,1.25,2.85,.85);let b=new B(g.geometry(),new k({map:u,side:K}));b.name="aw:hr:menu",l.add(b)}let h=[[2.15,1.75],[3.35,1.75],[4.55,1.75]],d=new q(n_(),new k({vertexColors:!0}),h.length);d.name="aw:hr:stools",d.frustumCulled=!1,h.forEach(([g,b],v)=>{let M=y(e,g,b,0);_n.set(M[0],0,M[2]),vn.setFromAxisAngle(Ra,Math.atan2(-e.ux,-e.uz)),d.setMatrixAt(v,Pa.compose(_n,vn,Ca))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new w(0,1,0),16),l.add(d);let f=[[-4.2,3.8],[-4.05,6.1]],p=new q(s_(),new k({vertexColors:!0}),f.length*2),m=new q(i_(),new k({vertexColors:!0}),f.length);p.name="aw:hr:chairs",m.name="aw:hr:tables",p.frustumCulled=!1,m.frustumCulled=!1,f.forEach(([g,b],v)=>{let M=y(e,g,b,0);_n.set(M[0],0,M[2]),vn.setFromAxisAngle(Ra,0),m.setMatrixAt(v,Pa.compose(_n,vn,Ca));let _=y(e,g-.7,b,0);_n.set(_[0],0,_[2]),vn.setFromAxisAngle(Ra,Math.atan2(e.ux,e.uz)),p.setMatrixAt(v*2,Pa.compose(_n,vn,Ca));let A=y(e,g+.7,b,0);_n.set(A[0],0,A[2]),vn.setFromAxisAngle(Ra,Math.atan2(-e.ux,-e.uz)),p.setMatrixAt(v*2+1,Pa.compose(_n,vn,Ca))}),p.count=f.length*2,m.count=f.length,p.instanceMatrix.needsUpdate=!0,m.instanceMatrix.needsUpdate=!0,p.boundingSphere=new X(new w(0,1,0),16),m.boundingSphere=new X(new w(0,1,0),16),l.add(p,m)}var Nu=-7830.95,Ou=-6156.4,up=[[-7847.6,-6120],[-7820.6,-6117.4],[-7814.2,-6193.2],[-7841.4,-6195]],a_=[[-16.65,36.4],[10.35,39],[16.75,-36.8],[-10.45,-38.6]],wn=Ae(a_,0,1),Da=3.35,rr=4.15;wn.doorAt=0;wn.depth=13.6;wn.halfW=9.4;var es=[.94,.94,.95],Cu=[.06,.2,.46],l_=[.16,.4,.68],hp=[.91,.88,.82],c_=[.74,.82,.86],Du=[.52,.36,.2],or=[.32,.2,.1],lp=[.2,.46,.26],u_=[.14,.34,.6],ue=1.42,dp=[{a0:-3.4,a1:3.4,d0:8.5,d1:10.5},{a0:5.15,a1:8.7,d0:2.25,d1:4.15},{a0:-7.15,a1:-5.35,d0:4.15,d1:5.55},{a0:-6.9,a1:-5.1,d0:6.55,d1:7.95},{a0:-4.3,a1:-2.7,d0:5.2,d1:6.5}],is={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function h_(){let l=new V;return S(l,is,-.28,.28,-.28,.28,.4,.48,u_),S(l,is,-.28,.28,-.28,-.16,.48,.86,hp),S(l,is,-.26,-.2,-.26,.26,.2,.52,or),S(l,is,.2,.26,-.26,.26,.2,.52,or),l.geometry()}function d_(){let l=new V;return S(l,is,-.36,.36,-.36,.36,.4,.46,Du),S(l,is,-.05,.05,-.05,.05,.05,.4,or),l.geometry()}function cp(l){let e=document.createElement("canvas");e.width=512,e.height=512;let t=e.getContext("2d");if(!t)return null;l==="desk"?(t.fillStyle="#0d2748",t.fillRect(0,0,512,512),t.fillStyle="#ffffff",t.font="700 54px Arial, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("RADISSON",256,150),t.fillStyle="#8ec8f0",t.font="700 48px Arial, sans-serif",t.fillText("BLU",256,214),t.fillStyle="#d5e4f2",t.font="600 26px Arial, sans-serif",["Reception","The Clover","Pool  \xB7  Beach"].forEach((s,r)=>t.fillText(s,256,310+r*48))):(t.fillStyle="#1c2418",t.fillRect(0,0,512,512),t.fillStyle="#2f6b3a",t.fillRect(0,0,512,96),t.fillStyle="#f4efe4",t.font="700 40px Arial, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("THE CLOVER",256,40),t.font="600 18px Arial, sans-serif",t.fillText("COFFEE  \xB7  TEA",256,74),[["House Coffee","4"],["Espresso","3"],["Iced Tea","4"],["Fruit Bowl","8"],["Avocado Toast","11"]].forEach((s,r)=>{let o=150+r*64;t.fillStyle=r%2?"#243024":"#1c2418",t.fillRect(16,o-28,480,56),t.fillStyle="#f4efe4",t.font="600 26px Arial, sans-serif",t.textAlign="left",t.fillText(s[0],36,o),t.fillStyle="#d4e37a",t.textAlign="right",t.fillText(s[1],468,o)}));let n=new re(e);return n.colorSpace=Z,n}function f_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}function p_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,a,n-r,i),y(e,a,n+r,i),y(e,a,n+r,s),y(e,a,n-r,s)],c,[1,1,1],u)};o(t,[-e.ux,0,-e.uz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.03,[e.ux,0,e.uz],[[1,0],[0,0],[0,1],[1,1]])}var Pu=new w(0,1,0),ts=new Y,ns=new w,Iu=new w(1,1,1),Lu=new O;function fp(l,e){let t=new V,n=wn.halfW,i=wn.depth,s=-Da,r=Da,o=.12;t.quad([y(e,-n+.25,.12,ue),y(e,n-.25,.12,ue),y(e,n-.25,i-.2,ue),y(e,-n+.25,i-.2,ue)],[0,1,0],[.86,.84,.8]);let a=1.6;for(let g=-n+.35;g<n-.4;g+=a)for(let b=.18;b<i-.3;b+=a){let v=Math.min(g+a-.06,n-.3),M=Math.min(b+a-.06,i-.24),_=(Math.round(g/a)+Math.round(b/a)&1)===0;t.quad([y(e,g,b,ue+.03),y(e,v,b,ue+.03),y(e,v,M,ue+.03),y(e,g,M,ue+.03)],[0,1,0],_?hp:c_)}t.quad([y(e,-n+.3,.25,4.02),y(e,n-.3,.25,4.02),y(e,n-.3,i-.25,4.02),y(e,-n+.3,i-.25,4.02)],[0,-1,0],es),S(t,e,-n+.4,n-.4,.4,i-.35,3.88,4,Cu),S(t,e,-n+.15,-n+.15+o,.2,i-.15,ue,3.98,es),S(t,e,n-.15-o,n-.15,.2,i-.15,ue,3.98,es),S(t,e,-n+.2,n-.2,i-.22,i-.1,ue,3.98,es),S(t,e,-n+.2,s,.1,.1+o,ue,rr,es),S(t,e,r,n-.2,.1,.1+o,ue,rr,es),S(t,e,s,r,.12,.12+o,3.78,rr+.02,Cu),S(t,e,-3.2,3.2,8.6,10.3,ue,ue+1.05,Du),S(t,e,-3.3,3.3,8.55,10.4,ue+1.05,ue+1.12,or),S(t,e,-3.2,3.2,8.5,8.7,ue+.08,ue+1.05,Cu),S(t,e,-3.2,3.2,8.52,8.66,ue+.92,ue+1,l_),S(t,e,5.2,8.6,2.3,4.05,ue,ue+1.02,Du),S(t,e,5.15,8.65,2.25,4.1,ue+1.02,ue+1.1,or),S(t,e,5.2,5.38,2.35,4,ue+.1,ue+1.02,lp),S(t,e,7.6,8.4,2.45,3.15,ue+1.1,ue+1.7,lp),S(t,e,6.3,7.2,2.4,3,ue+1.1,ue+1.52,[.55,.62,.32]);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:rd:shell",l.add(c);let u=cp("desk");if(u){let g=new V;f_(g,e,11.15,-2.5,2.5,ue+1.15,ue+2.45);let b=new B(g.geometry(),new k({map:u,side:K}));b.name="aw:rd:desk",l.add(b)}let h=cp("clover");if(h){let g=new V;p_(g,e,5.12,3.15,ue+1.15,ue+2.35,.7);let b=new B(g.geometry(),new k({map:h,side:K}));b.name="aw:rd:clover",l.add(b)}let d=[[-6.25,4.85],[-6,7.25]],f=new q(h_(),new k({vertexColors:!0}),d.length*2),p=new q(d_(),new k({vertexColors:!0}),1);f.name="aw:rd:chairs",p.name="aw:rd:tables",f.frustumCulled=!1,p.frustumCulled=!1,d.forEach(([g,b],v)=>{let M=y(e,g-.55,b,0);ns.set(M[0],ue,M[2]),ts.setFromAxisAngle(Pu,Math.atan2(e.nx,e.nz)),f.setMatrixAt(v*2,Lu.compose(ns,ts,Iu));let _=y(e,g+.55,b,0);ns.set(_[0],ue,_[2]),ts.setFromAxisAngle(Pu,Math.atan2(-e.nx,-e.nz)),f.setMatrixAt(v*2+1,Lu.compose(ns,ts,Iu))});let m=y(e,-3.5,5.85,0);ns.set(m[0],ue,m[2]),ts.setFromAxisAngle(Pu,0),p.setMatrixAt(0,Lu.compose(ns,ts,Iu)),f.count=d.length*2,p.count=1,f.instanceMatrix.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0,f.boundingSphere=new X(new w(0,1,0),20),p.boundingSphere=new X(new w(0,1,0),20),l.add(f,p)}var Uu=-8208.36,Bu=-5722.87,yp=[[-8279.3,-5764.7],[-8277.7,-5764.3],[-8279.3,-5758.7],[-8196.9,-5735.5],[-8213.1,-5679],[-8239.9,-5686.5],[-8241.1,-5682.5],[-8242.9,-5683.1],[-8245.7,-5673.4],[-8243.8,-5672.9],[-8245.1,-5668.4],[-8201.5,-5656.6],[-8200.1,-5661.4],[-8196.7,-5660.5],[-8193.3,-5672.4],[-8196.7,-5673.4],[-8190.7,-5694.2],[-8184.5,-5692.5],[-8181.4,-5703],[-8188,-5704.8],[-8183.8,-5719.4],[-8163.2,-5713.6],[-8164,-5710.8],[-8154.6,-5708.1],[-8151.9,-5717.5],[-8156.1,-5718.7],[-8147.5,-5748.7],[-8156,-5751.1],[-8148.3,-5777.8],[-8170,-5784],[-8169.7,-5784.9],[-8176.2,-5786.7],[-8176.8,-5784.3],[-8182.3,-5785.8],[-8190,-5758.9],[-8258.7,-5778.3],[-8258.4,-5779.4],[-8268.2,-5782.2],[-8269.1,-5779.1],[-8274.8,-5780.7]],pp=-.9613,mp=-.2755,m_=[[52.26,4.17],[60.86,-25.84],[60.86+pp*14,-25.84+mp*14],[52.26+pp*14,4.17+mp*14]],Sn=Ae(m_,0,1),Na=2.7,ar=4.05;Sn.doorAt=0;Sn.depth=11.5;Sn.halfW=8.2;var ci=[.93,.88,.78],gp=[.82,.74,.62],Fu=[.72,.34,.2],g_=[.48,.3,.16],x_=[.3,.18,.09],xp=[.18,.4,.24],b_=[.96,.94,.9],Te=.08,Mp=[{a0:-3.3,a1:3.3,d0:7.15,d1:9.05},{a0:-6.4,a1:-4.6,d0:3.6,d1:5.1},{a0:4.5,a1:6.3,d0:3.8,d1:5.3}],bp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function v_(){let l=new V;return S(l,bp,-.26,.26,-.26,.26,.4,.48,Fu),S(l,bp,-.26,.26,-.26,-.16,.48,.84,ci),l.geometry()}function __(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f3eadc",e.fillRect(0,0,512,512),e.fillStyle="#8c3b22",e.fillRect(0,0,512,168),e.fillStyle="#fff8ee",e.font="700 58px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HYATT",256,58),e.font="600 32px Arial, sans-serif",e.fillText("REGENCY ARUBA",256,118),e.fillStyle="#3a2a1c",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,240+i*64));let t=new re(l);return t.colorSpace=Z,t}function y_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var M_=new w(0,1,0),vp=new Y,_p=new w,w_=new w(1,1,1),S_=new O;function wp(l,e){let t=new V,n=Sn.halfW,i=Sn.depth,s=-Na,r=Na,o=.12;t.quad([y(e,-n+.25,.12,Te),y(e,n-.25,.12,Te),y(e,n-.25,i-.2,Te),y(e,-n+.25,i-.2,Te)],[0,1,0],gp);let a=1.7;for(let f=-n+.35;f<n-.4;f+=a)for(let p=.16;p<i-.28;p+=a){let m=Math.min(f+a-.07,n-.3),g=Math.min(p+a-.07,i-.22),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([y(e,f,p,Te+.03),y(e,m,p,Te+.03),y(e,m,g,Te+.03),y(e,f,g,Te+.03)],[0,1,0],b?ci:gp)}t.quad([y(e,-n+.3,.25,3.95),y(e,n-.3,.25,3.95),y(e,n-.3,i-.25,3.95),y(e,-n+.3,i-.25,3.95)],[0,-1,0],b_),S(t,e,-n+.15,-n+.15+o,.2,i-.15,Te,3.9,ci),S(t,e,n-.15-o,n-.15,.2,i-.15,Te,3.9,ci),S(t,e,-n+.2,n-.2,i-.22,i-.1,Te,3.9,ci),S(t,e,-n+.2,s,.1,.1+o,Te,ar,ci),S(t,e,r,n-.2,.1,.1+o,Te,ar,ci),S(t,e,s,r,.12,.12+o,3.7,ar+.02,Fu),S(t,e,-3.15,3.15,7.25,8.95,Te,Te+1.05,g_),S(t,e,-3.25,3.25,7.2,9,Te+1.05,Te+1.12,x_),S(t,e,-3.1,3.1,7.15,7.35,Te+.1,Te+1.05,Fu),S(t,e,-5.6,-4.8,3.4,4.2,Te,Te+.9,xp),S(t,e,4.7,5.6,3.5,4.3,Te,Te+.9,xp);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:hy:shell",l.add(c);let u=__();if(u){let f=new V;y_(f,e,9.6,-2.4,2.4,Te+1.2,Te+2.7);let p=new B(f.geometry(),new k({map:u,side:K}));p.name="aw:hy:board",l.add(p)}let h=[[-5.5,4.35],[5.4,4.55]],d=new q(v_(),new k({vertexColors:!0}),h.length);d.name="aw:hy:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=y(e,f,p,0);_p.set(g[0],Te,g[2]),vp.setFromAxisAngle(M_,Math.atan2(e.ux,e.uz)+(m?Math.PI:0)),d.setMatrixAt(m,S_.compose(_p,vp,w_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new w(0,1,0),18),l.add(d)}var ku=-8295.39,Gu=-5327.6,Ip=[[-8333,-5404.5],[-8327.4,-5389.2],[-8323.1,-5390.9],[-8316,-5372.2],[-8324.5,-5369.4],[-8321,-5360.3],[-8324.5,-5358.8],[-8329.4,-5354.3],[-8330.8,-5351.3],[-8332.4,-5344.6],[-8331.5,-5338.6],[-8324.8,-5318],[-8326.7,-5316.1],[-8328.3,-5312.6],[-8329.1,-5308.6],[-8329,-5305],[-8321.7,-5285.8],[-8319.3,-5282.2],[-8313.9,-5279.4],[-8319.1,-5266.5],[-8315.4,-5264.4],[-8323.5,-5248.6],[-8314.9,-5244],[-8307.9,-5260.4],[-8305.4,-5259.6],[-8300.7,-5270.3],[-8303.1,-5271.7],[-8297.3,-5284],[-8298.4,-5287.7],[-8282.3,-5293.9],[-8272.1,-5270.5],[-8246.6,-5280.9],[-8250.7,-5288.9],[-8246.3,-5290.9],[-8251.7,-5303.4],[-8255.4,-5302.1],[-8270.8,-5335.7],[-8273.5,-5330.5],[-8277.7,-5332.9],[-8273.6,-5340.9],[-8269.2,-5339.2],[-8265.7,-5347.7],[-8281,-5353.2],[-8275.3,-5367.4],[-8270,-5354.3],[-8262.4,-5357],[-8272.9,-5386.7],[-8266.7,-5389.7],[-8270.3,-5398.5],[-8280.4,-5394.3],[-8285.8,-5405.6],[-8287.9,-5404.9],[-8295.5,-5388.1]],Sp=-.918,Ap=.3966,A_=[[49.08,36.7],[43.68,24.2],[43.68+Sp*14,24.2+Ap*14],[49.08+Sp*14,36.7+Ap*14]],Tn=Ae(A_,0,1),Oa=2.8,lr=4.15;Tn.doorAt=0;Tn.depth=10.2;Tn.halfW=5.5;var An=[.96,.95,.92],T_=[.93,.9,.83],Tp=[.84,.8,.72],zu=[.07,.16,.36],E_=[.12,.45,.52],R_=[.72,.58,.28],Ep=[.16,.4,.26],ge=.08,Lp=[{a0:-2.85,a1:2.85,d0:7.1,d1:9.05},{a0:-4.85,a1:-3.35,d0:3.55,d1:5.05},{a0:3.25,a1:4.75,d0:3.55,d1:5.05}],Rp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function C_(){let l=new V;return S(l,Rp,-.28,.28,-.28,.28,.38,.46,E_),S(l,Rp,-.28,.28,-.28,-.16,.46,.86,An),l.geometry()}function P_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4f1ea",e.fillRect(0,0,512,512),e.fillStyle="#12295c",e.fillRect(0,0,512,176),e.fillStyle="#f7f4ee",e.font="700 64px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HILTON",256,58),e.font="600 28px Arial, sans-serif",e.fillText("ARUBA CARIBBEAN",256,124),e.fillStyle="#1a2744",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,248+i*64));let t=new re(l);return t.colorSpace=Z,t}function I_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var L_=new w(0,1,0),Cp=new Y,Pp=new w,D_=new w(1,1,1),N_=new O;function Dp(l,e){let t=new V,n=Tn.halfW,i=Tn.depth,s=-Oa,r=Oa,o=.12;t.quad([y(e,-n+.25,.12,ge),y(e,n-.25,.12,ge),y(e,n-.25,i-.2,ge),y(e,-n+.25,i-.2,ge)],[0,1,0],Tp);let a=1.65;for(let f=-n+.3;f<n-.35;f+=a)for(let p=.16;p<i-.28;p+=a){let m=Math.min(f+a-.06,n-.28),g=Math.min(p+a-.06,i-.22),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([y(e,f,p,ge+.03),y(e,m,p,ge+.03),y(e,m,g,ge+.03),y(e,f,g,ge+.03)],[0,1,0],b?T_:Tp)}t.quad([y(e,-.7,.3,ge+.045),y(e,.7,.3,ge+.045),y(e,.7,6.7,ge+.045),y(e,-.7,6.7,ge+.045)],[0,1,0],zu),t.quad([y(e,-n+.3,.25,3.95),y(e,n-.3,.25,3.95),y(e,n-.3,i-.25,3.95),y(e,-n+.3,i-.25,3.95)],[0,-1,0],An),S(t,e,-n+.15,-n+.15+o,.2,i-.15,ge,3.9,An),S(t,e,n-.15-o,n-.15,.2,i-.15,ge,3.9,An),S(t,e,-n+.2,n-.2,i-.22,i-.1,ge,3.9,An),S(t,e,-n+.2,s,.1,.1+o,ge,lr,An),S(t,e,r,n-.2,.1,.1+o,ge,lr,An),S(t,e,s,r,.12,.12+o,3.72,lr+.02,zu),S(t,e,-2.7,2.7,7.2,8.95,ge,ge+1.05,An),S(t,e,-2.8,2.8,7.15,9,ge+1.05,ge+1.14,zu),S(t,e,-2.65,2.65,7.15,7.28,ge+.15,ge+1.05,R_),S(t,e,-4.9,-4.05,3.5,4.3,ge,ge+.85,Ep),S(t,e,3.95,4.8,3.5,4.3,ge,ge+.85,Ep);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:ht:shell",l.add(c);let u=P_();if(u){let f=new V;I_(f,e,9.55,-2.2,2.2,ge+1.25,ge+2.75);let p=new B(f.geometry(),new k({map:u,side:K}));p.name="aw:ht:board",l.add(p)}let h=[[-4.1,4.25],[4,4.25]],d=new q(C_(),new k({vertexColors:!0}),h.length);d.name="aw:ht:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=y(e,f,p,0);Pp.set(g[0],ge,g[2]),Cp.setFromAxisAngle(L_,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,N_.compose(Pp,Cp,D_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new w(0,1,0),16),l.add(d)}var Hu=-8000.03,Vu=-6711.14,Gp=[[-8059.3,-6773.7],[-8057.7,-6751.8],[-8055.9,-6750.9],[-8047.3,-6751.1],[-8045.1,-6753],[-8041.2,-6750.6],[-8039.6,-6753.5],[-8036.2,-6751.3],[-8034.9,-6753.5],[-8031.2,-6750.9],[-8029.4,-6753.7],[-8025.7,-6752.1],[-8024,-6754.3],[-8020.4,-6752.2],[-8018.9,-6755],[-8015.4,-6752.9],[-8013.6,-6755],[-8010.4,-6753.3],[-8008.2,-6755.5],[-8005.4,-6753.4],[-8003.1,-6756.2],[-7999.5,-6754.2],[-7998,-6756.1],[-7994.9,-6754.7],[-7993.6,-6755.7],[-7991.4,-6759.5],[-7984.5,-6756.9],[-7979.5,-6693.7],[-7985.4,-6689.9],[-7988.5,-6694.1],[-7992.1,-6691.4],[-7993.7,-6693.8],[-7997.4,-6691],[-7999,-6693.2],[-8003,-6690.6],[-8004.4,-6692.7],[-8008,-6690],[-8009.5,-6692.3],[-8013.2,-6689.5],[-8014.9,-6691.9],[-8018.4,-6689.3],[-8020.2,-6691.5],[-8023.8,-6688.7],[-8025.4,-6691.2],[-8028.9,-6688.4],[-8031.4,-6691.8],[-8034.8,-6689.2],[-8035.5,-6690],[-8039.4,-6687.5],[-8040.3,-6688.6],[-8043.7,-6688.5],[-8044.2,-6690.4],[-8050.6,-6689.9],[-8050.7,-6688.4],[-8052.5,-6687.7],[-8050.6,-6666.4],[-8048.1,-6664.3],[-8042.2,-6664.8],[-8041.2,-6666.4],[-8037.5,-6667],[-8034.7,-6665.4],[-8032.6,-6667.5],[-8029.3,-6665.9],[-8027.2,-6667.9],[-8024,-6666.2],[-8021.8,-6668.4],[-8018.7,-6666.7],[-8016.6,-6669],[-8013.8,-6667.2],[-8011.5,-6669.5],[-8008.2,-6667.4],[-8006.5,-6669.5],[-8003,-6667.6],[-8001.4,-6670],[-7997.8,-6668.4],[-7995.8,-6670.5],[-7992.3,-6668.6],[-7990.3,-6671.1],[-7986.9,-6669.5],[-7984.9,-6671.9],[-7981.7,-6669.7],[-7980,-6672.1],[-7977.7,-6671.6],[-7976.9,-6671.1],[-7976.9,-6669.9],[-7975.6,-6669.5],[-7974.7,-6660.1],[-7982,-6659.5],[-7980.8,-6644.5],[-7941.1,-6647.9],[-7941.1,-6641.9],[-7929.2,-6643.2],[-7929.9,-6655.3],[-7918.2,-6656.1],[-7918.4,-6659.6],[-7933.9,-6668.8],[-7934.8,-6676.4],[-7925.7,-6684.9],[-7926.3,-6689.1],[-7916.4,-6698.3],[-7918.3,-6717.1],[-7940.6,-6733.6],[-7938.2,-6748.8],[-7947.6,-6766.3],[-7960.3,-6759.7],[-7970.2,-6758.9],[-7987,-6779.9],[-8044.5,-6774.2]],Np=.0337,Op=.9994,O_=[[-44.46,-63.06],[-59.27,-62.56],[-59.27+Np*14,-62.56+Op*14],[-44.46+Np*14,-63.06+Op*14]],Rn=Ae(O_,0,1),Ua=2.9,Hp=4.15;Rn.doorAt=0;Rn.depth=10.4;Rn.halfW=6;var En=[.94,.9,.82],Fp=[.82,.74,.62],Fa=[.48,.12,.16],F_=[.42,.26,.14],U_=[.28,.16,.08],Up=[.16,.38,.22],B_=[.96,.94,.9],xe=.08,Vp=[{a0:-3.2,a1:3.2,d0:7.15,d1:9.15},{a0:-5.15,a1:-3.55,d0:3.6,d1:5.15},{a0:3.45,a1:5.05,d0:3.6,d1:5.15}],Bp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function z_(){let l=new V;return S(l,Bp,-.28,.28,-.28,.28,.38,.46,Fa),S(l,Bp,-.28,.28,-.28,-.16,.46,.86,En),l.geometry()}function k_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f6f0e6",e.fillRect(0,0,512,512),e.fillStyle="#7a1e2e",e.fillRect(0,0,512,176),e.fillStyle="#fff8f2",e.font="700 54px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("MARRIOTT",256,58),e.font="600 30px Arial, sans-serif",e.fillText("STELLARIS CASINO",256,122),e.fillStyle="#3a241c",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,248+i*64));let t=new re(l);return t.colorSpace=Z,t}function G_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var H_=new w(0,1,0),zp=new Y,kp=new w,V_=new w(1,1,1),W_=new O;function Wp(l,e){let t=new V,n=Rn.halfW,i=Rn.depth,s=-Ua,r=Ua,o=.12;t.quad([y(e,-n+.25,.12,xe),y(e,n-.25,.12,xe),y(e,n-.25,i-.2,xe),y(e,-n+.25,i-.2,xe)],[0,1,0],Fp);let a=1.7;for(let f=-n+.32;f<n-.36;f+=a)for(let p=.18;p<i-.3;p+=a){let m=Math.min(f+a-.06,n-.28),g=Math.min(p+a-.06,i-.22),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([y(e,f,p,xe+.03),y(e,m,p,xe+.03),y(e,m,g,xe+.03),y(e,f,g,xe+.03)],[0,1,0],b?En:Fp)}t.quad([y(e,-.75,.3,xe+.045),y(e,.75,.3,xe+.045),y(e,.75,6.8,xe+.045),y(e,-.75,6.8,xe+.045)],[0,1,0],Fa),t.quad([y(e,-n+.28,.22,5.5),y(e,n-.28,.22,5.5),y(e,n-.28,i-.22,5.5),y(e,-n+.28,i-.22,5.5)],[0,-1,0],B_),S(t,e,-n+.15,-n+.15+o,.2,i-.15,xe,5.45,En),S(t,e,n-.15-o,n-.15,.2,i-.15,xe,5.45,En),S(t,e,-n+.2,n-.2,i-.22,i-.1,xe,5.45,En),S(t,e,-n+.2,s,.1,.1+o,xe,5.45,En),S(t,e,r,n-.2,.1,.1+o,xe,5.45,En),S(t,e,s,r,.12,.12+o,3.85,4.05,Fa),S(t,e,s,r,.1,.1+o,4.05,5.45,En),S(t,e,-3.05,3.05,7.25,9,xe,xe+1.05,F_),S(t,e,-3.15,3.15,7.2,9.1,xe+1.05,xe+1.14,Fa),S(t,e,-2.95,2.95,7.15,7.32,xe+.2,xe+1.05,U_),S(t,e,-5.2,-4.3,3.5,4.35,xe,xe+.85,Up),S(t,e,4.2,5.1,3.5,4.35,xe,xe+.85,Up);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:mr:shell",l.add(c);let u=k_();if(u){let f=new V;G_(f,e,9.7,-2.5,2.5,xe+1.25,xe+2.8);let p=new B(f.geometry(),new k({map:u,side:K}));p.name="aw:mr:board",l.add(p)}let h=[[-4.35,4.35],[4.25,4.35]],d=new q(z_(),new k({vertexColors:!0}),h.length);d.name="aw:mr:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=y(e,f,p,0);kp.set(g[0],xe,g[2]),zp.setFromAxisAngle(H_,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,W_.compose(kp,zp,V_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new w(0,1,0),18),l.add(d)}var Wu=-8172.13,Xu=-5301.78,jp=[[-8190.1,-5299.2],[-8165.7,-5290.6],[-8162.5,-5299.5],[-8165.9,-5300.6],[-8163.8,-5306.7],[-8184.8,-5314.1]],Xp=.9422,qp=.3351,X_=[[-17.97,2.58],[-12.67,-12.32],[-12.67+Xp*12,-12.32+qp*12],[-17.97+Xp*12,2.58+qp*12]],Pn=Ae(X_,0,1),Ba=2.05,cr=2.75;Pn.doorAt=0;Pn.depth=8.2;Pn.halfW=5.2;var Cn=[.95,.78,.12],q_=[.86,.66,.08],ui=[.12,.52,.24];var Y_=[.45,.28,.14],Z_=[.96,.95,.9],Ce=.52,Jp=[{a0:-2.6,a1:2.6,d0:5.55,d1:7.35},{a0:-4.3,a1:-2.9,d0:2.7,d1:4.15},{a0:2.8,a1:4.2,d0:2.7,d1:4.15}],Yp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function K_(){let l=new V;return S(l,Yp,-.24,.24,-.24,.24,.4,.48,Cn),S(l,Yp,-.24,.24,-.24,-.14,.48,.86,ui),l.geometry()}function j_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#fff6d8",e.fillRect(0,0,512,512),e.fillStyle="#1a8a3a",e.fillRect(0,0,512,168),e.fillStyle="#fffdf4",e.font="700 46px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("SE\xD1OR FROG'S",256,62),e.font="600 26px Arial, sans-serif",e.fillText("PALM BEACH",256,122),e.fillStyle="#1c3a18",e.font="600 32px Arial, sans-serif",["Margarita","Nachos","Fajitas"].forEach((n,i)=>e.fillText(n,256,246+i*68));let t=new re(l);return t.colorSpace=Z,t}function J_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var $_=new w(0,1,0),Zp=new Y,Kp=new w,Q_=new w(1,1,1),ey=new O;function $p(l,e){let t=new V,n=Pn.halfW,i=Pn.depth,s=-Ba,r=Ba,o=.12;t.quad([y(e,-n+.2,.1,Ce),y(e,n-.2,.1,Ce),y(e,n-.2,i-.18,Ce),y(e,-n+.2,i-.18,Ce)],[0,1,0],q_);let a=1.35;for(let f=-n+.28;f<n-.3;f+=a)for(let p=.16;p<i-.26;p+=a){let m=Math.min(f+a-.06,n-.24),g=Math.min(p+a-.06,i-.2),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([y(e,f,p,Ce+.03),y(e,m,p,Ce+.03),y(e,m,g,Ce+.03),y(e,f,g,Ce+.03)],[0,1,0],b?Cn:ui)}t.quad([y(e,-n+.22,.18,2.7),y(e,n-.22,.18,2.7),y(e,n-.22,i-.18,2.7),y(e,-n+.22,i-.18,2.7)],[0,-1,0],Z_),S(t,e,-n+.12,-n+.12+o,.16,i-.12,Ce,2.68,Cn),S(t,e,n-.12-o,n-.12,.16,i-.12,Ce,2.68,Cn),S(t,e,-n+.16,n-.16,i-.2,i-.08,Ce,2.68,Cn),S(t,e,-n+.16,s,.08,.08+o,Ce,cr,Cn),S(t,e,r,n-.16,.08,.08+o,Ce,cr,Cn),S(t,e,s,r,.1,.1+o,2.42,cr,ui),S(t,e,-n+.12,-n+.12+o,.16,i-.12,2.2,2.42,ui),S(t,e,n-.12-o,n-.12,.16,i-.12,2.2,2.42,ui),S(t,e,-n+.16,n-.16,i-.2,i-.08,2.2,2.42,ui),S(t,e,-2.4,2.4,5.7,7.2,Ce,Ce+1.05,Y_),S(t,e,-2.5,2.5,5.6,7.3,Ce+1.05,Ce+1.14,ui),S(t,e,-2.3,2.3,5.55,5.75,Ce+.15,Ce+1.05,Cn);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:sf:shell",l.add(c);let u=j_();if(u){let f=new V;J_(f,e,7.55,-2.1,2.1,Ce+1.05,Ce+2.15);let p=new B(f.geometry(),new k({map:u,side:K}));p.name="aw:sf:board",l.add(p)}let h=[[-3.6,3.4],[3.5,3.4]],d=new q(K_(),new k({vertexColors:!0}),h.length);d.name="aw:sf:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=y(e,f,p,0);Kp.set(g[0],Ce,g[2]),Zp.setFromAxisAngle($_,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,ey.compose(Kp,Zp,Q_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new w(0,1,0),14),l.add(d)}var qu=-8122.03,Yu=-6342.63,rm=[[-8137.2,-6343.4],[-8137.2,-6339.1],[-8135.8,-6335.8],[-8131.3,-6332.8],[-8131.4,-6329],[-8113.5,-6325.6],[-8108.5,-6346.4],[-8104,-6348.9],[-8105.7,-6351.9],[-8113.1,-6348],[-8113.1,-6346],[-8116.1,-6346.4],[-8119.4,-6343.1],[-8122.1,-6344.5],[-8125,-6347.8],[-8128.8,-6349.1],[-8132.3,-6348.7],[-8135.4,-6346.4]],Qp=-.9722,em=-.2343,ty=[[13.53,-3.77],[8.52,17.02],[8.52+Qp*12,17.02+em*12],[13.53+Qp*12,-3.77+em*12]],sn=Ae(ty,0,1),ka=1.45,ur=1.65;sn.doorAt=8;sn.depth=7.2;sn.halfW=9.5;var za=[.05,.42,.48];var tm=[.9,.82,.66],In=[.96,.95,.92],ny=[.45,.28,.14],Pe=.06,om=[{a0:6.5,a1:9.4,d0:5.1,d1:6.65},{a0:6.2,a1:7.2,d0:2.4,d1:3.7},{a0:8.8,a1:9.6,d0:2.4,d1:3.7}],nm={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function iy(){let l=new V;return S(l,nm,-.24,.24,-.24,.24,.4,.48,In),S(l,nm,-.24,.24,-.24,-.14,.48,.86,za),l.geometry()}function sy(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4efe4",e.fillRect(0,0,512,512),e.fillStyle="#0d6b7a",e.fillRect(0,0,512,176),e.fillStyle="#f7fffe",e.font="700 48px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("MOOMBA BEACH",256,68),e.font="600 26px Arial, sans-serif",e.fillText("PALM BEACH",256,128),e.fillStyle="#16343a",e.font="600 32px Arial, sans-serif",["Burger","Fish","Cocktail"].forEach((n,i)=>e.fillText(n,256,250+i*68));let t=new re(l);return t.colorSpace=Z,t}function ry(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var oy=new w(0,1,0),im=new Y,sm=new w,ay=new w(1,1,1),ly=new O;function am(l,e){let t=new V,n=sn.halfW,i=sn.depth,s=sn.doorAt??0,r=s-ka,o=s+ka,a=.12;t.quad([y(e,-n+.2,.1,Pe),y(e,n-.2,.1,Pe),y(e,n-.2,i-.18,Pe),y(e,-n+.2,i-.18,Pe)],[0,1,0],tm);let c=1.3;for(let p=-n+.28;p<n-.3;p+=c)for(let m=.16;m<i-.26;m+=c){let g=Math.min(p+c-.06,n-.24),b=Math.min(m+c-.06,i-.2),v=(Math.round(p/c)+Math.round(m/c)&1)===0;t.quad([y(e,p,m,Pe+.03),y(e,g,m,Pe+.03),y(e,g,b,Pe+.03),y(e,p,b,Pe+.03)],[0,1,0],v?tm:za)}t.quad([y(e,-n+.22,.18,1.58),y(e,n-.22,.18,1.58),y(e,n-.22,i-.18,1.58),y(e,-n+.22,i-.18,1.58)],[0,-1,0],In),S(t,e,-n+.12,-n+.12+a,.16,i-.12,Pe,1.55,In),S(t,e,n-.12-a,n-.12,.16,i-.12,Pe,1.55,In),S(t,e,-n+.16,n-.16,i-.2,i-.08,Pe,1.55,In),S(t,e,-n+.16,r,.08,.08+a,Pe,ur,In),S(t,e,o,n-.16,.08,.08+a,Pe,ur,In),S(t,e,r,o,.1,.1+a,1.38,ur,za),S(t,e,6.6,9.3,5.25,6.5,Pe,Pe+1.02,ny),S(t,e,6.5,9.4,5.15,6.6,Pe+1.02,Pe+1.12,za),S(t,e,6.7,9.2,5.1,5.3,Pe+.15,Pe+1.02,In);let u=new B(t.geometry(),new k({vertexColors:!0,side:K}));u.name="aw:mb:shell",l.add(u);let h=sy();if(h){let p=new V;ry(p,e,6.75,6.7,9.3,Pe+.55,Pe+1.42);let m=new B(p.geometry(),new k({map:h,side:K}));m.name="aw:mb:board",l.add(m)}let d=[[6.6,3],[9.2,3]],f=new q(iy(),new k({vertexColors:!0}),d.length);f.name="aw:mb:chairs",f.frustumCulled=!1,d.forEach(([p,m],g)=>{let b=y(e,p,m,0);sm.set(b[0],Pe,b[2]),im.setFromAxisAngle(oy,Math.atan2(e.nx,e.nz)),f.setMatrixAt(g,ly.compose(sm,im,ay))}),f.count=d.length,f.instanceMatrix.needsUpdate=!0,f.boundingSphere=new X(new w(0,1,0),16),l.add(f)}var Ku=-8168.34,ju=-5382.19,mm=[[-8174.15,-5373.8],[-8168.57,-5372.03],[-8162.67,-5390.63],[-8168.25,-5392.4]],lm=.953,cm=.303,cy=[[-5.81,8.39],[.09,-10.21],[.09+lm*10,-10.21+cm*10],[-5.81+lm*10,8.39+cm*10]],Ln=Ae(cy,0,1),gm=2.4,xm=2.7;Ln.doorAt=0;Ln.depth=7.2;Ln.halfW=6.2;var um=[.12,.42,.22],uy=[.08,.28,.14],Zu=[.95,.94,.9],bm=[.7,.12,.14],hm=[.42,.26,.12],De=.12,vm=[{a0:-1.5,a1:1.5,d0:5.3,d1:6.7},{a0:-4.2,a1:-2.6,d0:2.4,d1:3.8},{a0:2.4,a1:4,d0:2.4,d1:3.8},{a0:-1.1,a1:1.1,d0:3.3,d1:4.5}],dm={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function hy(){let l=new V;return S(l,dm,-.22,.22,-.22,.22,.4,.46,bm),S(l,dm,-.22,.22,-.22,-.14,.46,.82,Zu),l.geometry()}function dy(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f7f3ea",e.fillRect(0,0,512,512),e.fillStyle="#1c6b38",e.fillRect(0,0,512,168),e.fillStyle="#fffdf6",e.font="700 52px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("GIANNI'S",256,62),e.font="600 26px Arial, sans-serif",e.fillText("RISTORANTE",256,122),e.fillStyle="#7a1c22",e.fillRect(0,168,512,10),e.fillStyle="#1c3a18",e.font="600 32px Arial, sans-serif",["Pasta","Pizza","Tiramisu"].forEach((n,i)=>e.fillText(n,256,250+i*68));let t=new re(l);return t.colorSpace=Z,t}function fy(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var py=new w(0,1,0),fm=new Y,pm=new w,my=new w(1,1,1),gy=new O;function _m(l,e){let t=new V,n=Ln.halfW,i=Ln.depth;t.quad([y(e,-n+.3,.15,De),y(e,n-.3,.15,De),y(e,n-.3,i-.2,De),y(e,-n+.3,i-.2,De)],[0,1,0],uy);let s=1.35;for(let h=-n+.4;h<n-.35;h+=s)for(let d=.25;d<i-.3;d+=s){let f=Math.min(h+s-.08,n-.32),p=Math.min(d+s-.08,i-.22),m=(Math.round(h/s)+Math.round(d/s)&1)===0;t.quad([y(e,h,d,De+.02),y(e,f,d,De+.02),y(e,f,p,De+.02),y(e,h,p,De+.02)],[0,1,0],m?Zu:um)}let r=[[-3.4,3.1],[3.2,3.1],[0,3.9]];for(let[h,d]of r)S(t,e,h-.55,h+.55,d-.4,d+.4,De,De+.74,hm),S(t,e,h-.62,h+.62,d-.46,d+.46,De+.74,De+.82,Zu);S(t,e,-1.4,1.4,5.4,6.55,De,De+1.05,hm),S(t,e,-1.5,1.5,5.3,6.65,De+1.05,De+1.14,um),S(t,e,-1.35,1.35,5.25,5.45,De+.2,De+1.05,bm);let o=new B(t.geometry(),new k({vertexColors:!0,side:K}));o.name="aw:gn:shell",l.add(o);let a=dy();if(a){let h=new V;fy(h,e,6.8,-1.3,1.3,De+1.15,De+2.35);let d=new B(h.geometry(),new k({map:a,side:K}));d.name="aw:gn:board",l.add(d)}let c=[[-4.2,3.1],[-2.6,3.1],[2.4,3.1],[4,3.1],[-.9,3.2],[.9,3.2]],u=new q(hy(),new k({vertexColors:!0}),c.length);u.name="aw:gn:chairs",u.frustumCulled=!1,c.forEach(([h,d],f)=>{let p=y(e,h,d,0);pm.set(p[0],De,p[2]),fm.setFromAxisAngle(py,Math.atan2(e.nx,e.nz)+(f%2?Math.PI:0)),u.setMatrixAt(f,gy.compose(pm,fm,my))}),u.count=c.length,u.instanceMatrix.needsUpdate=!0,u.boundingSphere=new X(new w(0,1,0),16),l.add(u)}var eh=-7394.59,th=73.48,wm=[[-7455.2,74],[-7445.5,81.5],[-7448.2,84.9],[-7443.9,88.2],[-7441.1,84.6],[-7416.9,103.3],[-7418.3,105.1],[-7409.5,111.9],[-7406,107.4],[-7392.2,118],[-7383.1,107.9],[-7378.1,112.9],[-7349.3,74.9],[-7354.7,70.9],[-7349,63.4],[-7343.6,67.5],[-7340.6,63.5],[-7359,48.5],[-7354.5,42.7],[-7364.4,35],[-7365.7,36.8],[-7402.9,7.9],[-7423.4,37],[-7425.1,35.7]],xy=[[-8.31,-65.58],[28.89,-36.68],[28.89+-.6135*16,-36.68+.7897*16],[-8.31+-.6135*16,-65.58+.7897*16]],Dn=Ae(xy,0,1),Ga=2.55,Ha=3.4;Dn.doorAt=0;Dn.depth=13.6;Dn.halfW=6.4;var hi=[.94,.9,.82],Ju=[.86,.8,.7],ss=[.62,.26,.14],by=[.91,.87,.78],vy=[.76,.6,.46],_y=[.82,.08,.1],yy=[.08,.16,.42],My=[.08,.52,.22],$u=[.72,.56,.22],wy=[.4,.26,.14],ne=.06,Sm=[{a0:-5.5,a1:-2.4,d0:9.5,d1:12.4},{a0:2.4,a1:5.5,d0:9.5,d1:12.4},{a0:-1.8,a1:1.8,d0:11.5,d1:13.35},{a0:-2.9,a1:-1.7,d0:4.4,d1:5.5},{a0:1.7,a1:2.9,d0:4.4,d1:5.5}],Qu={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Sy(){let l=new V;S(l,Qu,-.7,.7,-.22,.22,.42,.5,wy),S(l,Qu,-.7,.7,-.24,-.16,.5,.88,ss);for(let[e,t]of[[-.58,-.16],[.58,-.16],[-.58,.16],[.58,.16]])S(l,Qu,e-.03,e+.03,t-.03,t+.03,.04,.42,[.28,.22,.16]);return l.geometry()}function Ay(l,e,t,n,i,s){let r=document.createElement("canvas");r.width=512,r.height=512;let o=r.getContext("2d");if(!o)return null;o.fillStyle=n,o.fillRect(0,0,512,512),o.fillStyle=i,o.fillRect(0,0,512,e?196:150),o.fillStyle="#fffdf8",o.font="700 58px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText(l,256,e?72:75),e&&(o.font="600 36px Arial, sans-serif",o.fillText(e,256,140)),o.fillStyle=s,o.font="600 40px Arial, sans-serif",t.forEach((c,u)=>o.fillText(c,256,280+u*70));let a=new re(r);return a.colorSpace=Z,a}function Ty(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var Ey=new w(0,1,0),ym=new Y,Mm=new w,Ry=new w(1,1,1),Cy=new O;function Am(l,e){let t=new V,n=Dn.halfW,i=Dn.depth,s=-Ga,r=Ga;t.quad([y(e,-n+.25,.2,ne),y(e,n-.25,.2,ne),y(e,n-.25,i-.2,ne),y(e,-n+.25,i-.2,ne)],[0,1,0],Ju);let o=1.7;for(let d=-n+.35;d<n-.4;d+=o)for(let f=.3;f<i-.3;f+=o){let p=Math.min(d+o-.08,n-.32),m=Math.min(f+o-.08,i-.25),g=(Math.round(d/o)+Math.round(f/o)&1)===0;t.quad([y(e,d,f,ne+.02),y(e,p,f,ne+.02),y(e,p,m,ne+.02),y(e,d,m,ne+.02)],[0,1,0],g?by:vy)}t.quad([y(e,-.7,.4,ne+.04),y(e,.7,.4,ne+.04),y(e,.7,i-.5,ne+.04),y(e,-.7,i-.5,ne+.04)],[0,1,0],ss),t.quad([y(e,-n+.3,.45,3.28),y(e,n-.3,.45,3.28),y(e,n-.3,i-.25,3.28),y(e,-n+.3,i-.25,3.28)],[0,-1,0],hi),S(t,e,s,r,.2,1.1,3.18,3.36,ss),S(t,e,-n+.15,-n+.38,.35,i-.25,ne,3.26,hi),S(t,e,n-.38,n-.15,.35,i-.25,ne,3.26,hi),S(t,e,-n+.3,n-.3,i-.38,i-.18,ne,3.26,hi),S(t,e,-n+.25,s,.12,.34,ne,Ha,Ju),S(t,e,r,n-.25,.12,.34,ne,Ha,Ju),S(t,e,-n+.15,-n+.42,.35,i-.25,2.55,2.78,ss),S(t,e,n-.42,n-.15,.35,i-.25,2.55,2.78,ss),S(t,e,-n+.3,n-.3,i-.42,i-.16,2.55,2.78,ss),S(t,e,-5.4,-2.5,9.6,12.2,ne,ne+1.05,hi),S(t,e,-5.45,-2.45,9.5,9.72,ne+1.05,ne+2.35,yy),S(t,e,-5.3,-2.6,9.48,9.64,ne+1.05,ne+1.16,$u),S(t,e,2.5,5.4,9.6,12.2,ne,ne+1.05,hi),S(t,e,2.45,5.45,9.5,9.72,ne+1.05,ne+2.35,_y),S(t,e,2.6,5.3,9.48,9.64,ne+1.05,ne+1.16,$u),S(t,e,-1.7,1.7,11.7,13.15,ne,ne+1.05,hi),S(t,e,-1.85,1.85,11.55,11.82,ne+1.05,ne+2.45,My),S(t,e,-1.6,1.6,11.5,11.68,ne+1.05,ne+1.16,$u);let a=new B(t.geometry(),new k({vertexColors:!0,side:K}));a.name="aw:renmall:shell",l.add(a),[["PIER MARKET","",[],"#102050","#102050","#ffffff",-5.2,-2.7,9.42,ne+1.2,ne+2.2],["HOT LOOK","",[],"#d01218","#d01218","#ffffff",2.7,5.2,9.42,ne+1.2,ne+2.2],["ARUBA ALOE","",[],"#0e7a32","#0e7a32","#ffffff",-1.55,1.55,11.48,ne+1.2,ne+2.3],["RENAISSANCE","MALL",[],"#f6f0e4","#8a3a18","#3a2414",-1.6,1.6,2.35,2.35,3.15]].forEach((d,f)=>{let p=Ay(d[0],d[1],d[2],d[3],d[4],d[5]);if(!p)return;let m=new V;Ty(m,e,d[8],d[6],d[7],d[9],d[10]);let g=new B(m.geometry(),new k({map:p,side:K}));g.name="aw:renmall:sign"+f,l.add(g)});let u=[[-2.3,4.9],[2.3,4.9]],h=new q(Sy(),new k({vertexColors:!0}),u.length);h.name="aw:renmall:benches",h.frustumCulled=!1,u.forEach(([d,f],p)=>{let m=y(e,d,f,0);Mm.set(m[0],ne,m[2]),ym.setFromAxisAngle(Ey,Math.atan2(e.ux,e.uz)),h.setMatrixAt(p,Cy.compose(Mm,ym,Ry))}),h.count=u.length,h.instanceMatrix.needsUpdate=!0,h.boundingSphere=new X(new w(0,1,0),18),l.add(h)}var nh=-7560.24,ih=-42.34,Cm=[[-7616.2,-37.6],[-7599.9,-25.5],[-7577.2,-56.4],[-7568.2,-57.1],[-7542.7,-38.7],[-7542.6,-31.1],[-7563.1,-3],[-7545.9,9.3],[-7534.4,-6.7],[-7512,-40.6],[-7511.3,-44.8],[-7511.8,-48.2],[-7513.9,-50.9],[-7519.4,-53.7],[-7567,-72.2],[-7573.8,-74.3],[-7584.6,-72],[-7591.5,-66.6],[-7601.6,-55.6]],Py=[[-13.56,-31.96],[46.34,-8.56],[46.34+-.3639*16,-8.56+.9314*16],[-13.56+-.3639*16,-31.96+.9314*16]],rn=Ae(Py,0,1),Wa=1.35,Xa=2.95;rn.doorAt=-1.65;rn.depth=12.4;rn.halfW=7.4;var Va=[.9,.28,.5];var di=[.96,.94,.9],Iy=[.94,.9,.86],Ly=[.84,.62,.7],fi=[.78,.62,.26],Dy=[.78,.1,.16],Ny=[.12,.32,.72],Oy=[.93,.74,.16],Fy=[.42,.28,.14],ie=.05,Pm=[{a0:-6.5,a1:-3.7,d0:8.6,d1:11.4},{a0:.4,a1:3.4,d0:8.6,d1:11.4},{a0:-3.1,a1:-.2,d0:11,d1:12.15},{a0:-4.3,a1:-3.1,d0:4,d1:5.1},{a0:.5,a1:1.7,d0:4,d1:5.1}],Tm={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Uy(){let l=new V;return S(l,Tm,-.65,.65,-.2,.2,.42,.5,Fy),S(l,Tm,-.65,.65,-.22,-.14,.5,.86,Va),l.geometry()}function By(l,e,t,n){let i=document.createElement("canvas");i.width=512,i.height=512;let s=i.getContext("2d");if(!s)return null;s.fillStyle=t,s.fillRect(0,0,512,512),s.fillStyle=n,s.fillRect(0,0,512,e?210:512),s.fillStyle="#fffdf8",s.font="700 58px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(l,256,e?78:256),e&&(s.font="600 40px Arial, sans-serif",s.fillText(e,256,150));let r=new re(i);return r.colorSpace=Z,r}function zy(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([y(e,n,a,s),y(e,i,a,s),y(e,i,a,r),y(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var ky=new w(0,1,0),Em=new Y,Rm=new w,Gy=new w(1,1,1),Hy=new O;function Im(l,e){let t=new V,n=rn.halfW,i=rn.depth,s=rn.doorAt??0,r=s-Wa,o=s+Wa;t.quad([y(e,-n+.25,.18,ie),y(e,n-.25,.18,ie),y(e,n-.25,i-.2,ie),y(e,-n+.25,i-.2,ie)],[0,1,0],[.9,.82,.84]);let a=1.65;for(let f=-n+.35;f<n-.4;f+=a)for(let p=.28;p<i-.3;p+=a){let m=Math.min(f+a-.08,n-.3),g=Math.min(p+a-.08,i-.24),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([y(e,f,p,ie+.02),y(e,m,p,ie+.02),y(e,m,g,ie+.02),y(e,f,g,ie+.02)],[0,1,0],b?Iy:Ly)}t.quad([y(e,s-.55,.35,ie+.04),y(e,s+.55,.35,ie+.04),y(e,s+.55,i-.45,ie+.04),y(e,s-.55,i-.45,ie+.04)],[0,1,0],Va),t.quad([y(e,-n+.3,.4,2.82),y(e,n-.3,.4,2.82),y(e,n-.3,i-.22,2.82),y(e,-n+.3,i-.22,2.82)],[0,-1,0],di),S(t,e,r,o,.18,.9,2.7,2.9,fi),S(t,e,-n+.12,-n+.36,.3,i-.22,ie,2.8,di),S(t,e,n-.36,n-.12,.3,i-.22,ie,2.8,di),S(t,e,-n+.28,n-.28,i-.36,i-.16,ie,2.8,di),S(t,e,-n+.2,r,.1,.32,ie,Xa,Va),S(t,e,o,n-.2,.1,.32,ie,Xa,Va),S(t,e,-n+.12,-n+.4,.3,i-.22,2.15,2.38,fi),S(t,e,n-.4,n-.12,.3,i-.22,2.15,2.38,fi),S(t,e,-n+.28,n-.28,i-.4,i-.14,2.15,2.38,fi),S(t,e,-6.4,-3.8,8.7,11.3,ie,ie+1.02,di),S(t,e,-6.45,-3.75,8.55,8.82,ie+1.02,ie+2.2,Dy),S(t,e,-6.25,-3.95,8.52,8.68,ie+1.02,ie+1.14,fi),S(t,e,.5,3.3,8.7,11.3,ie,ie+1.02,di),S(t,e,.45,3.35,8.55,8.82,ie+1.02,ie+2.2,Ny),S(t,e,.65,3.15,8.52,8.68,ie+1.02,ie+1.14,fi),S(t,e,-3,-.3,11.15,12.05,ie,ie+1.02,di),S(t,e,-3.1,-.2,11,11.28,ie+1.02,ie+2.25,Oy),S(t,e,-2.85,-.45,10.96,11.12,ie+1.02,ie+1.14,fi);let c=new B(t.geometry(),new k({vertexColors:!0,side:K}));c.name="aw:royal:shell",l.add(c),[["GIFTS","","#c4121a","#c4121a",-6.2,-4,8.48,ie+1.15,ie+2.05],["JEWELS","","#163880","#163880",.7,3.1,8.48,ie+1.15,ie+2.05],["CAFE","","#e0b020","#a87810",-2.85,-.45,10.92,ie+1.15,ie+2.1],["ROYAL","PLAZA","#f4e4ea","#c2185b",s-1.35,s+1.35,2.15,2.05,2.75]].forEach((f,p)=>{let m=By(f[0],f[1],f[2],f[3]);if(!m)return;let g=new V;zy(g,e,f[6],f[4],f[5],f[7],f[8]);let b=new B(g.geometry(),new k({map:m,side:K}));b.name="aw:royal:sign"+p,l.add(b)});let h=[[s-2.4,4.5],[s+2.4,4.5]],d=new q(Uy(),new k({vertexColors:!0}),h.length);d.name="aw:royal:benches",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=y(e,f,p,0);Rm.set(g[0],ie,g[2]),Em.setFromAxisAngle(ky,Math.atan2(e.ux,e.uz)),d.setMatrixAt(m,Hy.compose(Rm,Em,Gy))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new w(0,1,0),16),l.add(d)}function Vy(){let l=Je($i,cu,uu,0);l.poly=Lf;let e=l.doorAt??0;return{id:"pastechihouse",x:cu,z:uu,rot:0,local:$i,world:l,doorHalf:2.35,doorTop:2.32,doorSide:.55,wall:.34,obs:Df,cut:["ground","lwall"],show:72,hide:96,build:Ff,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Wy(){let l=Je(oi,mu,gu,0);l.poly=zf;let e=l.doorAt??0;return{id:"mcd1",x:mu,z:gu,rot:0,local:oi,world:l,doorHalf:va,doorTop:kf,doorSide:.55,wall:.34,obs:Vf,cut:["ground","lwall"],show:90,hide:120,build:Xf,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Xy(){let l=Je(ai,_u,yu,0);l.poly=qf;let e=l.doorAt??0;return{id:"starbucks2",x:_u,z:yu,rot:0,local:ai,world:l,doorHalf:Ma,doorTop:wa,doorSide:.55,wall:.34,obs:Zf,cut:["ground","lwall"],show:90,hide:120,build:jf,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function qy(){let l=Je(ir,wu,Su,0);l.poly=tp;let e=l.doorAt??0;return{id:"pbplaza",x:wu,z:Su,rot:0,local:ir,world:l,doorHalf:Ta,doorTop:Ea,doorSide:1.25,wall:.4,obs:np,cut:["glass","rot","ground","lwall"],show:110,hide:140,build:ip,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Yy(){let l=Je(li,Tu,Eu,0);l.poly=rp;let e=l.doorAt??0;return{id:"hardrock_pb",x:Tu,z:Eu,rot:0,local:li,world:l,doorHalf:Ia,doorTop:La,doorSide:.55,wall:.34,obs:op,cut:["ground","lwall"],show:80,hide:110,build:ap,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Zy(){let l=Je(wn,Nu,Ou,0);l.poly=up;let e=l.doorAt??0;return{id:"radisson",x:Nu,z:Ou,rot:0,local:wn,world:l,doorHalf:Da,doorTop:rr,doorSide:.55,wall:.34,obs:dp,cut:["ground","lwall"],show:100,hide:130,build:fp,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Ky(){let l=Je(Sn,Uu,Bu,0);l.poly=yp;let e=l.doorAt??0;return{id:"hyatt",x:Uu,z:Bu,rot:0,local:Sn,world:l,doorHalf:Na,doorTop:ar,doorSide:.55,wall:.34,obs:Mp,cut:["ground","lwall"],show:110,hide:140,build:wp,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function jy(){let l=Je(Tn,ku,Gu,0);l.poly=Ip;let e=l.doorAt??0;return{id:"hilton",x:ku,z:Gu,rot:0,local:Tn,world:l,doorHalf:Oa,doorTop:lr,doorSide:.55,wall:.34,obs:Lp,cut:["ground","lwall"],show:120,hide:155,build:Dp,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Jy(){let l=Je(Rn,Hu,Vu,0);l.poly=Gp;let e=l.doorAt??0;return{id:"marriott",x:Hu,z:Vu,rot:0,local:Rn,world:l,doorHalf:Ua,doorTop:Hp,doorSide:.55,wall:.34,obs:Vp,cut:[],show:150,hide:185,floorAt:{x:-8051.89,z:-6773.95},build:Wp,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function $y(){let l=Je(Pn,Wu,Xu,0);l.poly=jp;let e=l.doorAt??0;return{id:"senorfrogs",x:Wu,z:Xu,rot:0,local:Pn,world:l,doorHalf:Ba,doorTop:cr,doorSide:.55,wall:.34,obs:Jp,cut:["ground","lwall"],show:60,hide:85,build:$p,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Qy(){let l=Je(sn,qu,Yu,0);l.poly=rm;let e=l.doorAt??0;return{id:"moomba",x:qu,z:Yu,rot:0,local:sn,world:l,doorHalf:ka,doorTop:ur,doorSide:.55,wall:.34,obs:om,cut:["ground","lwall"],show:70,hide:95,floorAt:{x:-8112.88,z:-6328.23},build:am,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function eM(){let l=Je(Ln,Ku,ju,0);l.poly=mm;let e=l.doorAt??0;return{id:"giannis",x:Ku,z:ju,rot:0,local:Ln,world:l,doorHalf:gm,doorTop:xm,doorSide:.55,wall:.34,obs:vm,cut:[],show:80,hide:110,floorAt:{x:-8171.2,z:-5383.1},build:_m,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function tM(){let l=Je(Dn,eh,th,0);l.poly=wm;let e=l.doorAt??0;return{id:"renmall",x:eh,z:th,rot:0,local:Dn,world:l,doorHalf:Ga,doorTop:Ha,doorSide:.55,wall:.34,obs:Sm,cut:["glass","mullion","ground"],show:120,hide:155,build:Am,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function nM(){let l=Je(rn,nh,ih,0);l.poly=Cm;let e=l.doorAt??0;return{id:"royalplaza",x:nh,z:ih,rot:0,local:rn,world:l,doorHalf:Wa,doorTop:Xa,doorSide:2.8,wall:.34,obs:Pm,cut:["ground"],shell:!0,show:100,hide:130,floorAt:{x:-7545.39,z:-63.2},build:Im,group:null,floorY:0,doorOn:{value:0},uU:{value:new U(l.ux,l.uz)},uN:{value:new U(l.nx,l.nz)},uM:{value:new U(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}var iM=`
  if (awDoorOn > 0.5) {
    float awAlong = dot(vAwW.xz - awDoorM, awDoorU);
    float awSide = dot(vAwW.xz - awDoorM, awDoorN);
    if (abs(awSide) < awDoorSide && abs(awAlong) < awDoorHalf && vAwW.y > awDoorY - 0.15 && vAwW.y < awDoorY + awDoorTop) discard;
  }`,qa=class{constructor(e){x(this,"g",e);x(this,"places");x(this,"rebake",new Map);x(this,"shellRay",new Qn);x(this,"shellFrom",new w);x(this,"shellDir",new w);this.places=[Vy(),Wy(),Xy(),qy(),Yy(),Zy(),Ky(),jy(),Jy(),$y(),Qy(),eM(),tM(),nM()];let t=window;t.__awDoor=(n,i)=>this.open(n,i)}open(e,t){let n=this.places;for(let i=0;i<n.length;i++){let s=n[i];if(Ef(s.world,s.obs,e,t,s.doorHalf,s.wall))return!0}return!1}stats(){return this.places.map(e=>({id:e.id,built:!!e.group,visible:!!e.group?.visible,patched:e.patched,door:e.doorOn.value,y:+e.floorY.toFixed(2)}))}update(){if(this.rebake.size)for(let[i,s]of this.rebake)i.needsUpdate=!0,s<=1?this.rebake.delete(i):this.rebake.set(i,s-1);let e=this.g.S,t=e.mode==="walk"?e.walk:e.mode==="plane"?e.plane:e.car,n=this.places;for(let i=0;i<n.length;i++){let s=n[i],r=Math.hypot(t.x-s.x,t.z-s.z);if(!s.group)r<s.show+20&&this.ensure(s);else{let o=s.group.visible?r<s.hide:r<s.show;s.group.visible!==o&&(s.group.visible=o);let a=o?1:0;s.doorOn.value!==a&&(s.doorOn.value=a),!s.patched&&r<s.show+40&&this.patchHero(s),s.shell&&!s.shellDone&&r<s.show+40&&this.patchShell(s),this.settleFloor(s)}}}settleFloor(e){if(!e.group)return;let t=e.floorAt?.x??e.x,n=e.floorAt?.z??e.z,i=this.g.real.heightAt?.(t,n);!Number.isFinite(i)||Math.abs(i-e.floorY)<.35||(e.group.position.y=i,e.group.updateMatrixWorld(!0),e.floorY=i,e.uY.value=i)}ensure(e){let t=e.floorAt?.x??e.x,n=e.floorAt?.z??e.z,i=this.g.real.heightAt?.(t,n);if(!Number.isFinite(i))return;let s=new Me;s.name="aw:interior:"+e.id,s.position.set(e.x,i,e.z),s.rotation.y=e.rot,e.build(s,e.local),s.traverse(r=>{let o=r;o.isMesh&&(o.castShadow=!1,o.receiveShadow=!1,o.matrixAutoUpdate=!1,o.updateMatrix())}),s.updateMatrixWorld(!0),this.g.scene.add(s),e.group=s,e.floorY=i,e.uY.value=i,e.group.visible=!0,e.doorOn.value=1,this.patchHero(e)}patchHero(e){let n=this.g.real.hero?.list?.find(s=>s.k===e.id||s.id===e.id);if(!n?._g)return;let i=0;n._g.traverse(s=>{let r=s;if(!r.isMesh||!r.material)return;let o=Array.isArray(r.material)?r.material:[r.material];for(let a of o)e.cut.indexOf(a.name||"")<0||this.patchMat(a,e,"door-"+(a.name||""))&&i++}),(e.cut.length===0||i>0)&&(e.patched=!0)}patchShell(e){if(e.shellTick=(e.shellTick??0)+1,(e.shellTick??0)%15!==0)return;let t=this.g.real.mon?.group;if(!t)return;if(t.updateMatrixWorld(!0),e.shellTries=(e.shellTries??0)+1,(e.shellTries??0)>40){e.shellDone=!0;return}let n=e.uU.value,i=e.uN.value,s=e.uM.value;this.shellDir.set(i.x,0,i.y);let r=e.uY.value,o=[];t.traverse(u=>{let h=u;if(!h.isMesh||!h.geometry)return;let d=h.geometry;d.boundingSphere||d.computeBoundingSphere();let f=d.boundingSphere;if(!f)return;let p=h.matrixWorld.elements,m=p[0]*f.center.x+p[4]*f.center.y+p[8]*f.center.z+p[12],g=p[2]*f.center.x+p[6]*f.center.y+p[10]*f.center.z+p[14];Math.hypot(m-s.x,g-s.y)-f.radius>4||o.push(h)});let a=0,c=0;for(let u=-2;u<=2;u++){let h=u*e.doorHalf*.46;for(let d=0;d<4;d++){let f=.4+d*Math.max(.4,(e.doorTop-.7)/3);this.shellFrom.set(s.x+n.x*h-i.x*1.4,r+f,s.y+n.y*h-i.y*1.4),this.shellRay.set(this.shellFrom,this.shellDir),this.shellRay.far=1.4+e.doorSide+.5;let p=o.length?this.shellRay.intersectObjects(o,!1):[];for(let m=0;m<p.length;m++){let g=p[m],b=(g.point.x-s.x)*n.x+(g.point.z-s.y)*n.y,v=(g.point.x-s.x)*i.x+(g.point.z-s.y)*i.y;if(Math.abs(b)>e.doorHalf+.08||v<-1.15||v>e.doorSide+.08||g.point.y<r-.2||g.point.y>r+e.doorTop+.05)continue;let M=g.object;if(!M.isMesh||!M.material)continue;let _=Array.isArray(M.material)?M.material:[M.material];for(let A=0;A<_.length;A++)this.patchMat(_[A],e,"door-shell-"+e.id)&&a++;c++}}}c>0&&a===0?e.shellQuiet=(e.shellQuiet??0)+1:e.shellQuiet=0,(e.shellQuiet??0)>=4&&(e.shellDone=!0)}patchMat(e,t,n){if(e.userData["aw:"+n])return!1;let i=t.doorOn,s=t.uU,r=t.uN,o=t.uM,a=t.uY,c={value:t.doorHalf},u={value:t.doorTop},h={value:t.doorSide};this.rebake.set(e,4),e.needsUpdate=!0,gn(e,n,d=>{d.vertexShader.includes("#include <begin_vertex>")&&d.fragmentShader.includes("#include <clipping_planes_fragment>")&&(d.uniforms.awDoorOn=i,d.uniforms.awDoorU=s,d.uniforms.awDoorN=r,d.uniforms.awDoorM=o,d.uniforms.awDoorY=a,d.uniforms.awDoorHalf=c,d.uniforms.awDoorTop=u,d.uniforms.awDoorSide=h,d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vAwW;`).replace("#include <begin_vertex>",`#include <begin_vertex>
  vAwW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
uniform float awDoorOn;
uniform vec2 awDoorU;
uniform vec2 awDoorN;
uniform vec2 awDoorM;
uniform float awDoorY;
uniform float awDoorHalf;
uniform float awDoorTop;
uniform float awDoorSide;
varying vec3 vAwW;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
`+iM))})}};var Lm=H.get("addons")!=="0"&&H.get("gvmoto")!=="0"&&H.get("gv")!=="0";window.__awMotoEnabled=Lm;async function sM(){if(H.get("addons")==="0")return;H.get("hud")!=="0"&&yf();let l=await ah(),e=H.get("perf")!=="0"?new ko(l):null,t=H.get("look")!=="0"?new Go(l):null,n=H.get("sea")!=="0"?new fa(l):null,i=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,s=H.get("flora")!=="0"?new Ho(l,e?e.mobile:i,H.get("ipool")!=="0"):null,r=H.get("jobs")!=="0"?new Vo(l,(e?e.mobile:i)?5:8):null,o=new Xo(l,e?e.mobile:i),a=H.get("far")!=="0"?new Wo(l,l.real.q.name!=="low",H.get("farbatch")!=="0"):null,c=H.get("split")!=="0"?new Jo((e?e.mobile:i)?3:4):null,u=H.get("hiperf")!=="0"?new $o(l):null,h=H.get("hilook")==="1"?new Qo(l):null,d=H.get("life")!=="0",f=d&&H.get("peds")!=="0"?new No(l):null,p=!f&&H.get("kids")!=="0"?new jo(l,e?e.mobile:i):null,m=H.get("debug")==="1"?new qo(l):null,g=new hr,b=H.get("daynight")!=="0",v=b?new bo(l,H.get("sun")!=="0"):null,M=b?new vo(l):null,_=b?new Io(l):null,A=d&&H.get("traffic")!=="0"?new Do(l):null,E=H.get("audio")!=="0"?new Bo(l):null,C=H.get("radio")!=="0"&&H.get("audio")!=="0"?new da(l):null,T=H.get("emerg")!=="0"?new ia(l):null,R=H.get("crash")!=="0"?new sa(l,T):null,I=Lm?new ra(l):null,P=H.get("fly")!=="0"?new aa(l):null,D=H.get("turbo")!=="0"?new oa(l):null,N=H.get("wind")!=="0"?new ca(l):null,F=H.get("camcycle")!=="0"?new ha:null,z=H.get("minimap")!=="0"?new pa(l):null,W=H.get("interiors")!=="0"?new qa(l):null;{let be=()=>{let $=document.querySelector("#credits ul");if(!$)return!1;if(!$.querySelector(".aw-msb")){let Se=document.createElement("li");Se.className="aw-msb",Se.innerHTML='Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)',$.appendChild(Se)}if(!$.querySelector(".aw-mly")){let Se=document.createElement("li");Se.className="aw-mly",Se.innerHTML='Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>',$.appendChild(Se)}return!0};if(!be()){let $=0,Se=setInterval(()=>{(be()||++$>30)&&clearInterval(Se)},1e3)}}let J=new yo(l),j=H.get("mperf")!=="0"?new wo(l,e?e.mobile:i,H.get("warmup")!=="full",H.get("preup")==="1"):null,ee=H.get("ovmerge")!=="0"&&l.real?new Ro(l.real):null,Q=H.get("tmerge")!=="0"&&l.real?new Co(l.real):null,se=H.get("bbatch")!=="0"&&H.get("bmerge")!=="0"?new Eo(l,(e?e.mobile:i)?2:3,+(H.get("bbshell")||1/0)):null,me=!se&&H.get("bmerge")!=="0"?new To(l):null,we=H.get("preload")!=="0"?new Mo(l):null,pe=H.get("mwfreeze")!=="0"?new Ao(l):null,ze=Zd(g,J);window.__aw={clock:g,dn:v,lights:M,lamps:_,traffic:A,peds:f,audio:E,guard:J,perf:e,look:t,flora:s,jobs:r,far:a,ctxg:o,kids:p,split:c,hip:u,hil:h,emerg:T,crash:R,gv:I,fly:P,turbo:D,bmerge:me,mperf:j,ovm:ee,tmerge:Q,sea:n,minimap:z,bbatch:se,mwf:pe,interiors:W,version:"0.26.1"};let fe=performance.now(),Ne=be=>{let $=Math.max(0,Math.min(2,(be-fe)/1e3));fe=be,ii.value+=$,g.step(Math.min($,.1)),v&&v.apply(g.t),M&&M.update($),_&&_.update($),A&&A.update($),f&&f.update(Math.min($,.1),ii.value),E&&E.update(),C&&C.update(),T&&T.update(Math.min($,.1)),R&&R.update(Math.min($,.1)),I&&I.update(Math.min($,.1)),P&&P.update(Math.min($,.1)),D&&D.update(Math.min($,.1)),N&&N.update(Math.min($,.1)),F&&F.frame(l.S.mode,Math.min($,.1)),e&&e.update($),t&&t.update(Ue.value),r&&r.frame(),u&&u.frame(),a&&a.update($),p&&p.update(Math.min($,.1)),m&&m.frame($*1e3),J.frame($),we&&we.frame($),j&&j.frame($),me&&me.frame(),se&&se.frame(),pe&&pe.frame(Math.min($,.1)),W&&W.update(),ze(),requestAnimationFrame(Ne)};requestAnimationFrame(Ne),console.info("[aw-addons] day/night + night lights + fps guard active",l.real?.q?.name)}sM().catch(l=>console.error("[aw-addons] failed",l));
