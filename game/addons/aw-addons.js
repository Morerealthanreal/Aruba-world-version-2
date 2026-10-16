var Mf=Object.defineProperty;var Ef=(h,e,t)=>e in h?Mf(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t;var A=(h,e,t)=>Ef(h,typeof e!="symbol"?e+"":e,t);function Kl(){return new Promise(h=>{let e=()=>{let t=window.game;t&&t.ready&&t.real&&t.real.sky&&t.real.sky.sun?h(t):setTimeout(e,250)};e()})}var U=new URLSearchParams(location.search);var Xl="aw_clock";function Sf(){let h={t:.4166666666666667,frozen:!1,len:24};try{let n=JSON.parse(localStorage.getItem(Xl)||"null");n&&isFinite(n.t)&&(h={t:n.t,frozen:!!n.frozen,len:isFinite(n.len)&&n.len>0?n.len:24})}catch{}let e=U.get("t");e!==null&&isFinite(+e)&&(h.t=(+e%24+24)%24/24);let t=U.get("daylen");return t!==null&&+t>0&&(h.len=+t),U.get("freeze")==="1"&&(h.frozen=!0),h}var ks=class{constructor(){A(this,"t");A(this,"frozen");A(this,"len");A(this,"lastSave",0);A(this,"listeners",[]);let e=Sf();this.t=e.t,this.frozen=e.frozen,this.len=e.len}step(e){this.frozen||(this.t=(this.t+e/(this.len*60))%1),performance.now()-this.lastSave>5e3&&this.save()}setHour(e){this.t=(e%24+24)%24/24,this.save(),this.listeners.forEach(t=>t())}setFrozen(e){this.frozen=e,this.save(),this.listeners.forEach(t=>t())}onChange(e){this.listeners.push(e)}save(){this.lastSave=performance.now();try{localStorage.setItem(Xl,JSON.stringify({t:+this.t.toFixed(5),frozen:this.frozen,len:this.len}))}catch{}}};var Oh=1;var Gh=3,fs=0,kr=1,We=2,Zo=0,Qh=1,Un=2;var $o=5;var zh=100;var ec=201;var Hh=204,Or=205;var Fo=0,Lo=1,Po=2,_r=3,No=4,Uo=5,ko=6,Oo=7,Gr=0,Vh=1,Wh=2;var tc=1,nc=2,ic=3,sc=4,rc=5,ac=6,oc=7,Go="attached",qh="detached",cc=300,lc=301,hc=302;var Kh=306,Qt=1e3,kt=1001,qi=1002,mt=1003,ps=1004;var uc=1005;var Pe=1006,dc=1007;var bt=1008;var ee=1009;var Qr=1012;var Xh=1014,rt=1015,jt=1016;var zr=35902,Hr=35899;var ms=1022,Le=1023;var pn=1028,Jh=1029,kn=1030;var Vr=33776,As=33777;var gs=33779,fc=35840;var bs=35842,Wr=35843,pc=36196,qr=37492,Kr=37496,mc=37488,Ac=37489,gc=37490,bc=37491,bi=37808;var _s=37812;var xs=36492;var _c=36495,xc=36283,vc=36284,yc=36285,wc=36286,jh=2200,Xr=2201,Yh=2202,Sn=2300,Cn=2301,Ar=2302,Qo=2303,Mn=2400,En=2401,Ki=2402,Jr=2500,Zh=2501,Mc=0,vs=1,_i=2,$h=3200;var Ec=0;var xi="",re="srgb",He="srgb-linear",xr="linear",Hi="srgb";var gr=7680;var eu=519;var Sc=35044,$e=35048;var Ot=2e3,Xi=2001;function Cf(h){for(let e=h.length-1;e>=0;--e)if(h[e]>=65535)return!0;return!1}function If(h){return ArrayBuffer.isView(h)&&!(h instanceof DataView)}function vr(h){return document.createElementNS("http://www.w3.org/1999/xhtml",h)}var Jl={},hi=null;function zo(...h){let e="THREE."+h.shift();hi?hi("log",e,...h):console.log(e,...h)}function tu(h){let e=h[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=h[1];t&&t.isStackTrace?h[0]+=" "+t.getLocation():h[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return h}function ue(...h){h=tu(h);let e="THREE."+h.shift();if(hi)hi("warn",e,...h);else{let t=h[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...h)}}function Ae(...h){h=tu(h);let e="THREE."+h.shift();if(hi)hi("error",e,...h);else{let t=h[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...h)}}function ci(...h){let e=h.join(" ");e in Jl||(Jl[e]=!0,ue(...h))}var Tf={[Fo]:Lo,[Po]:ko,[No]:Oo,[_r]:Uo,[Lo]:Fo,[ko]:Po,[Oo]:No,[Uo]:_r},zt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}},Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],jl=1234567,Vi=Math.PI/180,ui=180/Math.PI;function pt(){let h=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[h&255]+Ne[h>>8&255]+Ne[h>>16&255]+Ne[h>>24&255]+"-"+Ne[e&255]+Ne[e>>8&255]+"-"+Ne[e>>16&15|64]+Ne[e>>24&255]+"-"+Ne[t&63|128]+Ne[t>>8&255]+"-"+Ne[t>>16&255]+Ne[t>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function te(h,e,t){return Math.max(e,Math.min(t,h))}function Cc(h,e){return(h%e+e)%e}function Rf(h,e,t,n,i){return n+(h-e)*(i-n)/(t-e)}function Bf(h,e,t){return h!==e?(t-h)/(e-h):0}function Wi(h,e,t){return(1-t)*h+t*e}function Df(h,e,t,n){return Wi(h,e,1-Math.exp(-t*n))}function Ff(h,e=1){return e-Math.abs(Cc(h,e*2)-e)}function Lf(h,e,t){return h<=e?0:h>=t?1:(h=(h-e)/(t-e),h*h*(3-2*h))}function Pf(h,e,t){return h<=e?0:h>=t?1:(h=(h-e)/(t-e),h*h*h*(h*(h*6-15)+10))}function Nf(h,e){return h+Math.floor(Math.random()*(e-h+1))}function Uf(h,e){return h+Math.random()*(e-h)}function kf(h){return h*(.5-Math.random())}function Of(h){h!==void 0&&(jl=h);let e=jl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Gf(h){return h*Vi}function Qf(h){return h*ui}function zf(h){return h>0&&Number.isInteger(h)&&2**Math.round(Math.log2(h))===h}function Hf(h){return Math.pow(2,Math.ceil(Math.log(h)/Math.LN2))}function Vf(h){return Math.pow(2,Math.floor(Math.log(h)/Math.LN2))}function Wf(h,e,t,n,i){let s=Math.cos,r=Math.sin,a=s(t/2),o=r(t/2),c=s((e+n)/2),l=r((e+n)/2),u=s((e-n)/2),d=r((e-n)/2),f=s((n-e)/2),p=r((n-e)/2);switch(i){case"XYX":h.set(a*l,o*u,o*d,a*c);break;case"YZY":h.set(o*d,a*l,o*u,a*c);break;case"ZXZ":h.set(o*u,o*d,a*l,a*c);break;case"XZX":h.set(a*l,o*p,o*f,a*c);break;case"YXY":h.set(o*f,a*l,o*p,a*c);break;case"ZYZ":h.set(o*p,o*f,a*l,a*c);break;default:ue("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ft(h,e){switch(e.constructor){case Float32Array:return h;case Uint32Array:return h/4294967295;case Uint16Array:return h/65535;case Uint8Array:case Uint8ClampedArray:return h/255;case Int32Array:return Math.max(h/2147483647,-1);case Int16Array:return Math.max(h/32767,-1);case Int8Array:return Math.max(h/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function he(h,e){switch(e.constructor){case Float32Array:return h;case Uint32Array:return Math.round(h*4294967295);case Uint16Array:return Math.round(h*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(h*255);case Int32Array:return Math.round(h*2147483647);case Int16Array:return Math.round(h*32767);case Int8Array:return Math.round(h*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Ic={DEG2RAD:Vi,RAD2DEG:ui,generateUUID:pt,clamp:te,euclideanModulo:Cc,mapLinear:Rf,inverseLerp:Bf,lerp:Wi,damp:Df,pingpong:Ff,smoothstep:Lf,smootherstep:Pf,randInt:Nf,randFloat:Uf,randFloatSpread:kf,seededRandom:Of,degToRad:Gf,radToDeg:Qf,isPowerOfTwo:zf,ceilPowerOfTwo:Hf,floorPowerOfTwo:Vf,setQuaternionFromProperEuler:Wf,normalize:he,denormalize:ft},Dc=class Dc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=te(this.x,e.x,t.x),this.y=te(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=te(this.x,e,t),this.y=te(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(te(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Dc.prototype.isVector2=!0;var J=Dc,ae=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,a){let o=n[i+0],c=n[i+1],l=n[i+2],u=n[i+3],d=s[r+0],f=s[r+1],p=s[r+2],m=s[r+3];if(u!==m||o!==d||c!==f||l!==p){let g=o*d+c*f+l*p+u*m;g<0&&(d=-d,f=-f,p=-p,m=-m,g=-g);let b=1-a;if(g<.9995){let _=Math.acos(g),v=Math.sin(_);b=Math.sin(b*_)/v,a=Math.sin(a*_)/v,o=o*b+d*a,c=c*b+f*a,l=l*b+p*a,u=u*b+m*a}else{o=o*b+d*a,c=c*b+f*a,l=l*b+p*a,u=u*b+m*a;let _=1/Math.sqrt(o*o+c*c+l*l+u*u);o*=_,c*=_,l*=_,u*=_}}e[t]=o,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,r){let a=n[i],o=n[i+1],c=n[i+2],l=n[i+3],u=s[r],d=s[r+1],f=s[r+2],p=s[r+3];return e[t]=a*p+l*u+o*f-c*d,e[t+1]=o*p+l*d+c*u-a*f,e[t+2]=c*p+l*f+a*d-o*u,e[t+3]=l*p-a*u-o*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,r=e._order,a=Math.cos,o=Math.sin,c=a(n/2),l=a(i/2),u=a(s/2),d=o(n/2),f=o(i/2),p=o(s/2);switch(r){case"XYZ":this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case"YXZ":this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case"ZXY":this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case"ZYX":this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case"YZX":this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case"XZY":this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:ue("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],c=t[2],l=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(l-o)*f,this._y=(s-c)*f,this._z=(r-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(l-o)/f,this._x=.25*f,this._y=(i+r)/f,this._z=(s+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(s-c)/f,this._x=(i+r)/f,this._y=.25*f,this._z=(o+l)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(r-i)/f,this._x=(s+c)/f,this._y=(o+l)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(te(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,a=t._x,o=t._y,c=t._z,l=t._w;return this._x=n*l+r*a+i*c-s*o,this._y=i*l+r*o+s*a-n*c,this._z=s*l+r*c+n*o-i*a,this._w=r*l-n*a-i*o-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,a=this.dot(e);a<0&&(n=-n,i=-i,s=-s,r=-r,a=-a);let o=1-t;if(a<.9995){let c=Math.acos(a),l=Math.sin(c);o=Math.sin(o*c)/l,t=Math.sin(t*c)/l,this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this._onChangeCallback()}else this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Fc=class Fc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Yl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Yl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,r=e.y,a=e.z,o=e.w,c=2*(r*i-a*n),l=2*(a*t-s*i),u=2*(s*n-r*t);return this.x=t+o*c+r*u-a*l,this.y=n+o*l+a*c-s*u,this.z=i+o*u+s*l-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=te(this.x,e.x,t.x),this.y=te(this.y,e.y,t.y),this.z=te(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=te(this.x,e,t),this.y=te(this.y,e,t),this.z=te(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,r=t.x,a=t.y,o=t.z;return this.x=i*o-s*a,this.y=s*r-n*o,this.z=n*a-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ro.copy(this).projectOnVector(e),this.sub(ro)}reflect(e){return this.sub(ro.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(te(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Fc.prototype.isVector3=!0;var C=Fc,ro=new C,Yl=new ae,Lc=class Lc{constructor(e,t,n,i,s,r,a,o,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,a,o,c)}set(e,t,n,i,s,r,a,o,c){let l=this.elements;return l[0]=e,l[1]=i,l[2]=a,l[3]=t,l[4]=s,l[5]=o,l[6]=n,l[7]=r,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[3],o=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=i[0],g=i[3],b=i[6],_=i[1],v=i[4],x=i[7],y=i[2],w=i[5],E=i[8];return s[0]=r*m+a*_+o*y,s[3]=r*g+a*v+o*w,s[6]=r*b+a*x+o*E,s[1]=c*m+l*_+u*y,s[4]=c*g+l*v+u*w,s[7]=c*b+l*x+u*E,s[2]=d*m+f*_+p*y,s[5]=d*g+f*v+p*w,s[8]=d*b+f*x+p*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],c=e[7],l=e[8];return t*r*l-t*a*c-n*s*l+n*a*o+i*s*c-i*r*o}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],c=e[7],l=e[8],u=l*r-a*c,d=a*o-l*s,f=c*s-r*o,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(i*c-l*n)*m,e[2]=(a*n-i*r)*m,e[3]=d*m,e[4]=(l*t-i*o)*m,e[5]=(i*s-a*t)*m,e[6]=f*m,e[7]=(n*o-c*t)*m,e[8]=(r*t-n*s)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,a){let o=Math.cos(s),c=Math.sin(s);return this.set(n*o,n*c,-n*(o*r+c*a)+r+e,-i*c,i*o,-i*(-c*r+o*a)+a+t,0,0,1),this}scale(e,t){return ci("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ao.makeScale(e,t)),this}rotate(e){return ci("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ao.makeRotation(-e)),this}translate(e,t){return ci("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ao.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Lc.prototype.isMatrix3=!0;var Y=Lc,ao=new Y,Zl=new Y().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$l=new Y().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function qf(){let h={enabled:!0,workingColorSpace:He,spaces:{},convert:function(i,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===Hi&&(i.r=Gt(i.r),i.g=Gt(i.g),i.b=Gt(i.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Hi&&(i.r=li(i.r),i.g=li(i.g),i.b=li(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===xi?xr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,r){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return ci("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),h.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return ci("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),h.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return h.define({[He]:{primaries:e,whitePoint:n,transfer:xr,toXYZ:Zl,fromXYZ:$l,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:re},outputColorSpaceConfig:{drawingBufferColorSpace:re}},[re]:{primaries:e,whitePoint:n,transfer:Hi,toXYZ:Zl,fromXYZ:$l,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:re}}}),h}var De=qf();function Gt(h){return h<.04045?h*.0773993808:Math.pow(h*.9478672986+.0521327014,2.4)}function li(h){return h<.0031308?h*12.92:1.055*Math.pow(h,.41666)-.055}var qn,yr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{qn===void 0&&(qn=vr("canvas")),qn.width=e.width,qn.height=e.height;let i=qn.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=qn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=vr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Gt(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gt(t[n]/255)*255):t[n]=Gt(t[n]);return{data:t,width:e.width,height:e.height}}else return ue("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Kf=0,wr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=pt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,a=i.length;r<a;r++)i[r].isDataTexture?s.push(oo(i[r].image)):s.push(oo(i[r]))}else s=oo(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function oo(h){return typeof HTMLImageElement<"u"&&h instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&h instanceof ImageBitmap?yr.getDataURL(h):h.data?{data:Array.from(h.data),width:h.width,height:h.height,type:h.data.constructor.name}:(ue("Texture: Unable to serialize Texture."),{})}var Xf=0,co=new C,Oe=class h extends zt{constructor(e=h.DEFAULT_IMAGE,t=h.DEFAULT_MAPPING,n=kt,i=kt,s=Pe,r=bt,a=Le,o=ee,c=h.DEFAULT_ANISOTROPY,l=xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=pt(),this.name="",this.source=new wr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=o,this.offset=new J(0,0),this.repeat=new J(1,1),this.center=new J(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Y,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(co).x}get height(){return this.source.getSize(co).y}get depth(){return this.source.getSize(co).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){ue(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){ue(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qt:e.x=e.x-Math.floor(e.x);break;case kt:e.x=e.x<0?0:1;break;case qi:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qt:e.y=e.y-Math.floor(e.y);break;case kt:e.y=e.y<0?0:1;break;case qi:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Oe.DEFAULT_IMAGE=null;Oe.DEFAULT_MAPPING=cc;Oe.DEFAULT_ANISOTROPY=1;var Pc=class Pc{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,o=e.elements,c=o[0],l=o[4],u=o[8],d=o[1],f=o[5],p=o[9],m=o[2],g=o[6],b=o[10];if(Math.abs(l-d)<.01&&Math.abs(u-m)<.01&&Math.abs(p-g)<.01){if(Math.abs(l+d)<.1&&Math.abs(u+m)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+b-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(c+1)/2,x=(f+1)/2,y=(b+1)/2,w=(l+d)/4,E=(u+m)/4,M=(p+g)/4;return v>x&&v>y?v<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(v),i=w/n,s=E/n):x>y?x<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(x),n=w/i,s=M/i):y<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(y),n=E/s,i=M/s),this.set(n,i,s,t),this}let _=Math.sqrt((g-p)*(g-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(g-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+b-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=te(this.x,e.x,t.x),this.y=te(this.y,e.y,t.y),this.z=te(this.z,e.z,t.z),this.w=te(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=te(this.x,e,t),this.y=te(this.y,e,t),this.z=te(this.z,e,t),this.w=te(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Pc.prototype.isVector4=!0;var Se=Pc;var Ji=class extends Oe{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=mt,this.minFilter=mt,this.wrapR=kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Ur=class Ur{constructor(e,t,n,i,s,r,a,o,c,l,u,d,f,p,m,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,a,o,c,l,u,d,f,p,m,g)}set(e,t,n,i,s,r,a,o,c,l,u,d,f,p,m,g){let b=this.elements;return b[0]=e,b[4]=t,b[8]=n,b[12]=i,b[1]=s,b[5]=r,b[9]=a,b[13]=o,b[2]=c,b[6]=l,b[10]=u,b[14]=d,b[3]=f,b[7]=p,b[11]=m,b[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ur().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Kn.setFromMatrixColumn(e,0).length(),s=1/Kn.setFromMatrixColumn(e,1).length(),r=1/Kn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,r=Math.cos(n),a=Math.sin(n),o=Math.cos(i),c=Math.sin(i),l=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=r*l,f=r*u,p=a*l,m=a*u;t[0]=o*l,t[4]=-o*u,t[8]=c,t[1]=f+p*c,t[5]=d-m*c,t[9]=-a*o,t[2]=m-d*c,t[6]=p+f*c,t[10]=r*o}else if(e.order==="YXZ"){let d=o*l,f=o*u,p=c*l,m=c*u;t[0]=d+m*a,t[4]=p*a-f,t[8]=r*c,t[1]=r*u,t[5]=r*l,t[9]=-a,t[2]=f*a-p,t[6]=m+d*a,t[10]=r*o}else if(e.order==="ZXY"){let d=o*l,f=o*u,p=c*l,m=c*u;t[0]=d-m*a,t[4]=-r*u,t[8]=p+f*a,t[1]=f+p*a,t[5]=r*l,t[9]=m-d*a,t[2]=-r*c,t[6]=a,t[10]=r*o}else if(e.order==="ZYX"){let d=r*l,f=r*u,p=a*l,m=a*u;t[0]=o*l,t[4]=p*c-f,t[8]=d*c+m,t[1]=o*u,t[5]=m*c+d,t[9]=f*c-p,t[2]=-c,t[6]=a*o,t[10]=r*o}else if(e.order==="YZX"){let d=r*o,f=r*c,p=a*o,m=a*c;t[0]=o*l,t[4]=m-d*u,t[8]=p*u+f,t[1]=u,t[5]=r*l,t[9]=-a*l,t[2]=-c*l,t[6]=f*u+p,t[10]=d-m*u}else if(e.order==="XZY"){let d=r*o,f=r*c,p=a*o,m=a*c;t[0]=o*l,t[4]=-u,t[8]=c*l,t[1]=d*u+m,t[5]=r*l,t[9]=f*u-p,t[2]=p*u-f,t[6]=a*l,t[10]=m*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Jf,e,jf)}lookAt(e,t,n){let i=this.elements;return tt.subVectors(e,t),tt.lengthSq()===0&&(tt.z=1),tt.normalize(),tn.crossVectors(n,tt),tn.lengthSq()===0&&(Math.abs(n.z)===1?tt.x+=1e-4:tt.z+=1e-4,tt.normalize(),tn.crossVectors(n,tt)),tn.normalize(),Os.crossVectors(tt,tn),i[0]=tn.x,i[4]=Os.x,i[8]=tt.x,i[1]=tn.y,i[5]=Os.y,i[9]=tt.y,i[2]=tn.z,i[6]=Os.z,i[10]=tt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[4],o=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],g=n[10],b=n[14],_=n[3],v=n[7],x=n[11],y=n[15],w=i[0],E=i[4],M=i[8],S=i[12],T=i[1],I=i[5],R=i[9],B=i[13],F=i[2],L=i[6],N=i[10],z=i[14],G=i[3],V=i[7],W=i[11],O=i[15];return s[0]=r*w+a*T+o*F+c*G,s[4]=r*E+a*I+o*L+c*V,s[8]=r*M+a*R+o*N+c*W,s[12]=r*S+a*B+o*z+c*O,s[1]=l*w+u*T+d*F+f*G,s[5]=l*E+u*I+d*L+f*V,s[9]=l*M+u*R+d*N+f*W,s[13]=l*S+u*B+d*z+f*O,s[2]=p*w+m*T+g*F+b*G,s[6]=p*E+m*I+g*L+b*V,s[10]=p*M+m*R+g*N+b*W,s[14]=p*S+m*B+g*z+b*O,s[3]=_*w+v*T+x*F+y*G,s[7]=_*E+v*I+x*L+y*V,s[11]=_*M+v*R+x*N+y*W,s[15]=_*S+v*B+x*z+y*O,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],a=e[5],o=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],g=e[11],b=e[15],_=o*f-c*d,v=a*f-c*u,x=a*d-o*u,y=r*f-c*l,w=r*d-o*l,E=r*u-a*l;return t*(m*_-g*v+b*x)-n*(p*_-g*y+b*w)+i*(p*v-m*y+b*E)-s*(p*x-m*w+g*E)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],a=e[9],o=e[2],c=e[6],l=e[10];return t*(r*l-a*c)-n*(s*l-a*o)+i*(s*c-r*o)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],g=e[14],b=e[15],_=t*a-n*r,v=t*o-i*r,x=t*c-s*r,y=n*o-i*a,w=n*c-s*a,E=i*c-s*o,M=l*m-u*p,S=l*g-d*p,T=l*b-f*p,I=u*g-d*m,R=u*b-f*m,B=d*b-f*g,F=_*B-v*R+x*I+y*T-w*S+E*M;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let L=1/F;return e[0]=(a*B-o*R+c*I)*L,e[1]=(i*R-n*B-s*I)*L,e[2]=(m*E-g*w+b*y)*L,e[3]=(d*w-u*E-f*y)*L,e[4]=(o*T-r*B-c*S)*L,e[5]=(t*B-i*T+s*S)*L,e[6]=(g*x-p*E-b*v)*L,e[7]=(l*E-d*x+f*v)*L,e[8]=(r*R-a*T+c*M)*L,e[9]=(n*T-t*R-s*M)*L,e[10]=(p*w-m*x+b*_)*L,e[11]=(u*x-l*w-f*_)*L,e[12]=(a*S-r*I-o*M)*L,e[13]=(t*I-n*S+i*M)*L,e[14]=(m*v-p*y-g*_)*L,e[15]=(l*y-u*v+d*_)*L,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,r=e.x,a=e.y,o=e.z,c=s*r,l=s*a;return this.set(c*r+n,c*a-i*o,c*o+i*a,0,c*a+i*o,l*a+n,l*o-i*r,0,c*o-i*a,l*o+i*r,s*o*o+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,r=t._y,a=t._z,o=t._w,c=s+s,l=r+r,u=a+a,d=s*c,f=s*l,p=s*u,m=r*l,g=r*u,b=a*u,_=o*c,v=o*l,x=o*u,y=n.x,w=n.y,E=n.z;return i[0]=(1-(m+b))*y,i[1]=(f+x)*y,i[2]=(p-v)*y,i[3]=0,i[4]=(f-x)*w,i[5]=(1-(d+b))*w,i[6]=(g+_)*w,i[7]=0,i[8]=(p+v)*E,i[9]=(g-_)*E,i[10]=(1-(d+m))*E,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=Kn.set(i[0],i[1],i[2]).length(),a=Kn.set(i[4],i[5],i[6]).length(),o=Kn.set(i[8],i[9],i[10]).length();s<0&&(r=-r),ht.copy(this);let c=1/r,l=1/a,u=1/o;return ht.elements[0]*=c,ht.elements[1]*=c,ht.elements[2]*=c,ht.elements[4]*=l,ht.elements[5]*=l,ht.elements[6]*=l,ht.elements[8]*=u,ht.elements[9]*=u,ht.elements[10]*=u,t.setFromRotationMatrix(ht),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,r,a=Ot,o=!1){let c=this.elements,l=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),p,m;if(o)p=s/(r-s),m=r*s/(r-s);else if(a===Ot)p=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(a===Xi)p=-r/(r-s),m=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,r,a=Ot,o=!1){let c=this.elements,l=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),p,m;if(o)p=1/(r-s),m=r/(r-s);else if(a===Ot)p=-2/(r-s),m=-(r+s)/(r-s);else if(a===Xi)p=-1/(r-s),m=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Ur.prototype.isMatrix4=!0;var P=Ur,Kn=new C,ht=new P,Jf=new C(0,0,0),jf=new C(1,1,1),tn=new C,Os=new C,tt=new C,eh=new P,th=new ae,Mt=class h{constructor(e=0,t=0,n=0,i=h.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],a=i[8],o=i[1],c=i[5],l=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-te(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(o,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(te(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(o,s));break;case"ZYX":this._y=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(o,s)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-te(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-l,f),this._y=0);break;default:ue("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return eh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(eh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return th.setFromEuler(this),this.setFromQuaternion(th,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Mt.DEFAULT_ORDER="XYZ";var ji=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Yf=0,nh=new C,Xn=new ae,Bt=new P,Gs=new C,Bi=new C,Zf=new C,$f=new ae,ih=new C(1,0,0),sh=new C(0,1,0),rh=new C(0,0,1),ah={type:"added"},ep={type:"removed"},Jn={type:"childadded",child:null},lo={type:"childremoved",child:null},ge=class h extends zt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yf++}),this.uuid=pt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=h.DEFAULT_UP.clone();let e=new C,t=new Mt,n=new ae,i=new C(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new P},normalMatrix:{value:new Y}}),this.matrix=new P,this.matrixWorld=new P,this.matrixAutoUpdate=h.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=h.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ji,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xn.setFromAxisAngle(e,t),this.quaternion.multiply(Xn),this}rotateOnWorldAxis(e,t){return Xn.setFromAxisAngle(e,t),this.quaternion.premultiply(Xn),this}rotateX(e){return this.rotateOnAxis(ih,e)}rotateY(e){return this.rotateOnAxis(sh,e)}rotateZ(e){return this.rotateOnAxis(rh,e)}translateOnAxis(e,t){return nh.copy(e).applyQuaternion(this.quaternion),this.position.add(nh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ih,e)}translateY(e){return this.translateOnAxis(sh,e)}translateZ(e){return this.translateOnAxis(rh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Gs.copy(e):Gs.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Bi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bt.lookAt(Bi,Gs,this.up):Bt.lookAt(Gs,Bi,this.up),this.quaternion.setFromRotationMatrix(Bt),i&&(Bt.extractRotation(i.matrixWorld),Xn.setFromRotationMatrix(Bt),this.quaternion.premultiply(Xn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ae("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ah),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null):Ae("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ep),lo.child=e,this.dispatchEvent(lo),lo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ah),Jn.child=e,this.dispatchEvent(Jn),Jn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bi,e,Zf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bi,$f,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let o=a.shapes;if(Array.isArray(o))for(let c=0,l=o.length;c<l;c++){let u=o[c];s(e.shapes,u)}else s(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let o=0,c=this.material.length;o<c;o++)a.push(s(e.materials,this.material[o]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let o=this.animations[a];i.animations.push(s(e.animations,o))}}if(t){let a=r(e.geometries),o=r(e.materials),c=r(e.textures),l=r(e.images),u=r(e.shapes),d=r(e.skeletons),f=r(e.animations),p=r(e.nodes);a.length>0&&(n.geometries=a),o.length>0&&(n.materials=o),c.length>0&&(n.textures=c),l.length>0&&(n.images=l),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function r(a){let o=[];for(let c in a){let l=a[c];delete l.metadata,o.push(l)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};ge.DEFAULT_UP=new C(0,1,0);ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ce=class extends ge{constructor(){super(),this.isGroup=!0,this.type="Group"}};var nu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},nn={h:0,s:0,l:0},Qs={h:0,s:0,l:0};function ho(h,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?h+(e-h)*6*t:t<1/2?e:t<2/3?h+(e-h)*6*(2/3-t):h}var D=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=re){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,De.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=De.workingColorSpace){return this.r=e,this.g=t,this.b=n,De.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=De.workingColorSpace){if(e=Cc(e,1),t=te(t,0,1),n=te(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=ho(r,s,e+1/3),this.g=ho(r,s,e),this.b=ho(r,s,e-1/3)}return De.colorSpaceToWorking(this,i),this}setStyle(e,t=re){function n(s){s!==void 0&&parseFloat(s)<1&&ue("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:ue("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(s,16),t);ue("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=re){let n=nu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ue("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gt(e.r),this.g=Gt(e.g),this.b=Gt(e.b),this}copyLinearToSRGB(e){return this.r=li(e.r),this.g=li(e.g),this.b=li(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=re){return De.workingToColorSpace(Ue.copy(this),e),Math.round(te(Ue.r*255,0,255))*65536+Math.round(te(Ue.g*255,0,255))*256+Math.round(te(Ue.b*255,0,255))}getHexString(e=re){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=De.workingColorSpace){De.workingToColorSpace(Ue.copy(this),t);let n=Ue.r,i=Ue.g,s=Ue.b,r=Math.max(n,i,s),a=Math.min(n,i,s),o,c,l=(a+r)/2;if(a===r)o=0,c=0;else{let u=r-a;switch(c=l<=.5?u/(r+a):u/(2-r-a),r){case n:o=(i-s)/u+(i<s?6:0);break;case i:o=(s-n)/u+2;break;case s:o=(n-i)/u+4;break}o/=6}return e.h=o,e.s=c,e.l=l,e}getRGB(e,t=De.workingColorSpace){return De.workingToColorSpace(Ue.copy(this),t),e.r=Ue.r,e.g=Ue.g,e.b=Ue.b,e}getStyle(e=re){De.workingToColorSpace(Ue.copy(this),e);let t=Ue.r,n=Ue.g,i=Ue.b;return e!==re?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(nn),this.setHSL(nn.h+e,nn.s+t,nn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(nn),e.getHSL(Qs);let n=Wi(nn.h,Qs.h,t),i=Wi(nn.s,Qs.s,t),s=Wi(nn.l,Qs.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ue=new D;D.NAMES=nu;var ut=new C,Dt=new C,uo=new C,Ft=new C,jn=new C,Yn=new C,oh=new C,fo=new C,po=new C,mo=new C,Ao=new Se,go=new Se,bo=new Se,Ut=class h{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),ut.subVectors(e,t),i.cross(ut);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){ut.subVectors(i,t),Dt.subVectors(n,t),uo.subVectors(e,t);let r=ut.dot(ut),a=ut.dot(Dt),o=ut.dot(uo),c=Dt.dot(Dt),l=Dt.dot(uo),u=r*c-a*a;if(u===0)return s.set(0,0,0),null;let d=1/u,f=(c*o-a*l)*d,p=(r*l-a*o)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Ft)===null?!1:Ft.x>=0&&Ft.y>=0&&Ft.x+Ft.y<=1}static getInterpolation(e,t,n,i,s,r,a,o){return this.getBarycoord(e,t,n,i,Ft)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(s,Ft.x),o.addScaledVector(r,Ft.y),o.addScaledVector(a,Ft.z),o)}static getInterpolatedAttribute(e,t,n,i,s,r){return Ao.setScalar(0),go.setScalar(0),bo.setScalar(0),Ao.fromBufferAttribute(e,t),go.fromBufferAttribute(e,n),bo.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Ao,s.x),r.addScaledVector(go,s.y),r.addScaledVector(bo,s.z),r}static isFrontFacing(e,t,n,i){return ut.subVectors(n,t),Dt.subVectors(e,t),ut.cross(Dt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ut.subVectors(this.c,this.b),Dt.subVectors(this.a,this.b),ut.cross(Dt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return h.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return h.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return h.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return h.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return h.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,a;jn.subVectors(i,n),Yn.subVectors(s,n),fo.subVectors(e,n);let o=jn.dot(fo),c=Yn.dot(fo);if(o<=0&&c<=0)return t.copy(n);po.subVectors(e,i);let l=jn.dot(po),u=Yn.dot(po);if(l>=0&&u<=l)return t.copy(i);let d=o*u-l*c;if(d<=0&&o>=0&&l<=0)return r=o/(o-l),t.copy(n).addScaledVector(jn,r);mo.subVectors(e,s);let f=jn.dot(mo),p=Yn.dot(mo);if(p>=0&&f<=p)return t.copy(s);let m=f*c-o*p;if(m<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(Yn,a);let g=l*p-f*u;if(g<=0&&u-l>=0&&f-p>=0)return oh.subVectors(s,i),a=(u-l)/(u-l+(f-p)),t.copy(i).addScaledVector(oh,a);let b=1/(g+m+d);return r=m*b,a=d*b,t.copy(n).addScaledVector(jn,r).addScaledVector(Yn,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ye=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(dt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(dt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=dt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,a=s.count;r<a;r++)e.isMesh===!0?e.getVertexPosition(r,dt):dt.fromBufferAttribute(s,r),dt.applyMatrix4(e.matrixWorld),this.expandByPoint(dt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zs.copy(n.boundingBox)),zs.applyMatrix4(e.matrixWorld),this.union(zs)}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dt),dt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Di),Hs.subVectors(this.max,Di),Zn.subVectors(e.a,Di),$n.subVectors(e.b,Di),ei.subVectors(e.c,Di),sn.subVectors($n,Zn),rn.subVectors(ei,$n),bn.subVectors(Zn,ei);let t=[0,-sn.z,sn.y,0,-rn.z,rn.y,0,-bn.z,bn.y,sn.z,0,-sn.x,rn.z,0,-rn.x,bn.z,0,-bn.x,-sn.y,sn.x,0,-rn.y,rn.x,0,-bn.y,bn.x,0];return!_o(t,Zn,$n,ei,Hs)||(t=[1,0,0,0,1,0,0,0,1],!_o(t,Zn,$n,ei,Hs))?!1:(Vs.crossVectors(sn,rn),t=[Vs.x,Vs.y,Vs.z],_o(t,Zn,$n,ei,Hs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Lt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Lt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Lt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Lt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Lt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Lt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Lt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Lt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Lt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Lt=[new C,new C,new C,new C,new C,new C,new C,new C],dt=new C,zs=new ye,Zn=new C,$n=new C,ei=new C,sn=new C,rn=new C,bn=new C,Di=new C,Hs=new C,Vs=new C,_n=new C;function _o(h,e,t,n,i){for(let s=0,r=h.length-3;s<=r;s+=3){_n.fromArray(h,s);let a=i.x*Math.abs(_n.x)+i.y*Math.abs(_n.y)+i.z*Math.abs(_n.z),o=e.dot(_n),c=t.dot(_n),l=n.dot(_n);if(Math.max(-Math.max(o,c,l),Math.min(o,c,l))>a)return!1}return!0}var Me=new C,Ws=new J,tp=0,H=class extends zt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:tp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sc,this.updateRanges=[],this.gpuType=rt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ws.fromBufferAttribute(this,t),Ws.applyMatrix3(e),this.setXY(t,Ws.x,Ws.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Me.fromBufferAttribute(this,t),Me.applyMatrix3(e),this.setXYZ(t,Me.x,Me.y,Me.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Me.fromBufferAttribute(this,t),Me.applyMatrix4(e),this.setXYZ(t,Me.x,Me.y,Me.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Me.fromBufferAttribute(this,t),Me.applyNormalMatrix(e),this.setXYZ(t,Me.x,Me.y,Me.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Me.fromBufferAttribute(this,t),Me.transformDirection(e),this.setXYZ(t,Me.x,Me.y,Me.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ft(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=he(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ft(t,this.array)),t}setX(e,t){return this.normalized&&(t=he(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ft(t,this.array)),t}setY(e,t){return this.normalized&&(t=he(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ft(t,this.array)),t}setZ(e,t){return this.normalized&&(t=he(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ft(t,this.array)),t}setW(e,t){return this.normalized&&(t=he(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=he(t,this.array),n=he(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=he(t,this.array),n=he(n,this.array),i=he(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=he(t,this.array),n=he(n,this.array),i=he(i,this.array),s=he(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Mr=class extends H{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Er=class extends H{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var j=class extends H{constructor(e,t,n){super(new Float32Array(e),t,n)}},np=new ye,Fi=new C,xo=new C,be=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):np.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Fi.subVectors(e,this.center);let t=Fi.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Fi,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Fi.copy(e.center).add(xo)),this.expandByPoint(Fi.copy(e.center).sub(xo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ip=0,st=new P,vo=new ge,ti=new C,nt=new ye,Li=new ye,Be=new C,K=class h extends zt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=pt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cf(e)?Er:Mr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Y().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return st.makeRotationFromQuaternion(e),this.applyMatrix4(st),this}rotateX(e){return st.makeRotationX(e),this.applyMatrix4(st),this}rotateY(e){return st.makeRotationY(e),this.applyMatrix4(st),this}rotateZ(e){return st.makeRotationZ(e),this.applyMatrix4(st),this}translate(e,t,n){return st.makeTranslation(e,t,n),this.applyMatrix4(st),this}scale(e,t,n){return st.makeScale(e,t,n),this.applyMatrix4(st),this}lookAt(e){return vo.lookAt(e),vo.updateMatrix(),this.applyMatrix4(vo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ti).negate(),this.translate(ti.x,ti.y,ti.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new j(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&ue("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ye);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ae("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];nt.setFromBufferAttribute(s),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,nt.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,nt.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(nt.min),this.boundingBox.expandByPoint(nt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ae('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new be);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ae("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let n=this.boundingSphere.center;if(nt.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let a=t[s];Li.setFromBufferAttribute(a),this.morphTargetsRelative?(Be.addVectors(nt.min,Li.min),nt.expandByPoint(Be),Be.addVectors(nt.max,Li.max),nt.expandByPoint(Be)):(nt.expandByPoint(Li.min),nt.expandByPoint(Li.max))}nt.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)Be.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Be));if(t)for(let s=0,r=t.length;s<r;s++){let a=t[s],o=this.morphTargetsRelative;for(let c=0,l=a.count;c<l;c++)Be.fromBufferAttribute(a,c),o&&(ti.fromBufferAttribute(e,c),Be.add(ti)),i=Math.max(i,n.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ae('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ae("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new H(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let a=[],o=[];for(let M=0;M<n.count;M++)a[M]=new C,o[M]=new C;let c=new C,l=new C,u=new C,d=new J,f=new J,p=new J,m=new C,g=new C;function b(M,S,T){c.fromBufferAttribute(n,M),l.fromBufferAttribute(n,S),u.fromBufferAttribute(n,T),d.fromBufferAttribute(s,M),f.fromBufferAttribute(s,S),p.fromBufferAttribute(s,T),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(I),g.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(I),a[M].add(m),a[S].add(m),a[T].add(m),o[M].add(g),o[S].add(g),o[T].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let M=0,S=_.length;M<S;++M){let T=_[M],I=T.start,R=T.count;for(let B=I,F=I+R;B<F;B+=3)b(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let v=new C,x=new C,y=new C,w=new C;function E(M){y.fromBufferAttribute(i,M),w.copy(y);let S=a[M];v.copy(S),v.sub(y.multiplyScalar(y.dot(S))).normalize(),x.crossVectors(w,S);let I=x.dot(o[M])<0?-1:1;r.setXYZW(M,v.x,v.y,v.z,I)}for(let M=0,S=_.length;M<S;++M){let T=_[M],I=T.start,R=T.count;for(let B=I,F=I+R;B<F;B+=3)E(e.getX(B+0)),E(e.getX(B+1)),E(e.getX(B+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new H(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new C,s=new C,r=new C,a=new C,o=new C,c=new C,l=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),m=e.getX(d+1),g=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,g),l.subVectors(r,s),u.subVectors(i,s),l.cross(u),a.fromBufferAttribute(n,p),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,g),a.add(l),o.add(l),c.add(l),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),l.subVectors(r,s),u.subVectors(i,s),l.cross(u),n.setXYZ(d+0,l.x,l.y,l.z),n.setXYZ(d+1,l.x,l.y,l.z),n.setXYZ(d+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Be.fromBufferAttribute(e,t),Be.normalize(),e.setXYZ(t,Be.x,Be.y,Be.z)}toNonIndexed(){function e(a,o){let c=a.array,l=a.itemSize,u=a.normalized,d=new c.constructor(o.length*l),f=0,p=0;for(let m=0,g=o.length;m<g;m++){a.isInterleavedBufferAttribute?f=o[m]*a.data.stride+a.offset:f=o[m]*l;for(let b=0;b<l;b++)d[p++]=c[f++]}return new H(d,l,u)}if(this.index===null)return ue("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new h,n=this.index.array,i=this.attributes;for(let a in i){let o=i[a],c=e(o,n);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let o=[],c=s[a];for(let l=0,u=c.length;l<u;l++){let d=c[l],f=e(d,n);o.push(f)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let a=0,o=r.length;a<o;a++){let c=r[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let c in o)o[c]!==void 0&&(e[c]=o[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let o in n){let c=n[o];e.data.attributes[o]=c.toJSON(e.data)}let i={},s=!1;for(let o in this.morphAttributes){let c=this.morphAttributes[o],l=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];l.push(f.toJSON(e.data))}l.length>0&&(i[o]=l,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let l=i[c];this.setAttribute(c,l.clone(t))}let s=e.morphAttributes;for(let c in s){let l=[],u=s[c];for(let d=0,f=u.length;d<f;d++)l.push(u[d].clone(t));this.morphAttributes[c]=l}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let c=0,l=r.length;c<l;c++){let u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},In=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Sc,this.updateRanges=[],this.version=0,this.uuid=pt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},ze=new C,cn=class h{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)ze.fromBufferAttribute(this,t),ze.applyMatrix4(e),this.setXYZ(t,ze.x,ze.y,ze.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ze.fromBufferAttribute(this,t),ze.applyNormalMatrix(e),this.setXYZ(t,ze.x,ze.y,ze.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ze.fromBufferAttribute(this,t),ze.transformDirection(e),this.setXYZ(t,ze.x,ze.y,ze.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ft(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=he(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=he(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=he(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=he(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=he(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ft(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ft(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ft(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ft(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=he(t,this.array),n=he(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=he(t,this.array),n=he(n,this.array),i=he(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=he(t,this.array),n=he(n,this.array),i=he(i,this.array),s=he(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){zo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new H(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new h(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){zo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},yo=new C,sp=new C,rp=new Y,yt=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=yo.subVectors(n,t).cross(sp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(yo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||rp.getNormalMatrix(e),i=this.coplanarPoint(yo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},ap=0,Ve=class extends zt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ap++}),this.uuid=pt(),this.name="",this.type="Material",this.blending=Qh,this.side=fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Hh,this.blendDst=Or,this.blendEquation=zh,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new D(0,0,0),this.blendAlpha=0,this.depthFunc=_r,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=eu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gr,this.stencilZFail=gr,this.stencilZPass=gr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){ue(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){ue(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let r=[];for(let a in s){let o=s[a];delete o.metadata,r.push(o)}return r}if(t){let s=i(e.textures),r=i(e.images);s.length>0&&(n.textures=s),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new D().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new yt().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new J().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new J().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},di=class extends Ve{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new D(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ni,Pi=new C,ii=new C,si=new C,ri=new J,Ni=new J,iu=new P,qs=new C,Ui=new C,Ks=new C,ch=new J,wo=new J,lh=new J,Yi=class extends ge{constructor(e=new di){if(super(),this.isSprite=!0,this.type="Sprite",ni===void 0){ni=new K;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new In(t,5);ni.setIndex([0,1,2,0,2,3]),ni.setAttribute("position",new cn(n,3,0,!1)),ni.setAttribute("uv",new cn(n,2,3,!1))}this.geometry=ni,this.material=e,this.center=new J(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Ae('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ii.setFromMatrixScale(this.matrixWorld),iu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),si.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ii.multiplyScalar(-si.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let r=this.center;Xs(qs.set(-.5,-.5,0),si,r,ii,i,s),Xs(Ui.set(.5,-.5,0),si,r,ii,i,s),Xs(Ks.set(.5,.5,0),si,r,ii,i,s),ch.set(0,0),wo.set(1,0),lh.set(1,1);let a=e.ray.intersectTriangle(qs,Ui,Ks,!1,Pi);if(a===null&&(Xs(Ui.set(-.5,.5,0),si,r,ii,i,s),wo.set(0,1),a=e.ray.intersectTriangle(qs,Ks,Ui,!1,Pi),a===null))return;let o=e.ray.origin.distanceTo(Pi);o<e.near||o>e.far||t.push({distance:o,point:Pi.clone(),uv:Ut.getInterpolation(Pi,qs,Ui,Ks,ch,wo,lh,new J),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function Xs(h,e,t,n,i,s){ri.subVectors(h,t).addScalar(.5).multiply(n),i!==void 0?(Ni.x=s*ri.x-i*ri.y,Ni.y=i*ri.x+s*ri.y):Ni.copy(ri),h.copy(e),h.x+=Ni.x,h.y+=Ni.y,h.applyMatrix4(iu)}var Js=new C,hh=new C,Zi=class extends ge{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let n=0,i=t.length;n<i;n++){let s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);let i=this.levels,s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){let i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){Js.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(Js);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){Js.setFromMatrixPosition(e.matrixWorld),hh.setFromMatrixPosition(this.matrixWorld);let n=Js.distanceTo(hh)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let r=t[i].distance;if(t[i].object.visible&&(r-=r*t[i].hysteresis),n>=r)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let r=n[i];t.object.levels.push({object:r.object.uuid,distance:r.distance,hysteresis:r.hysteresis})}return t}},Pt=new C,Mo=new C,js=new C,Ys=new C,ln=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Pt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pt.copy(this.origin).addScaledVector(this.direction,t),Pt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Mo.copy(e).add(t).multiplyScalar(.5),js.copy(t).sub(e).normalize(),Ys.copy(this.origin).sub(Mo);let s=e.distanceTo(t)*.5,r=-this.direction.dot(js),a=Ys.dot(this.direction),o=-Ys.dot(js),c=Ys.lengthSq(),l=Math.abs(1-r*r),u,d,f,p;if(l>0)if(u=r*o-a,d=r*a-o,p=s*l,u>=0)if(d>=-p)if(d<=p){let m=1/l;u*=m,d*=m,f=u*(u+r*d+2*a)+d*(r*u+d+2*o)+c}else d=s,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*o)+c;else d=-s,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*o)+c;else d<=-p?(u=Math.max(0,-(-r*s+a)),d=u>0?-s:Math.min(Math.max(-s,-o),s),f=-u*u+d*(d+2*o)+c):d<=p?(u=0,d=Math.min(Math.max(-s,-o),s),f=d*(d+2*o)+c):(u=Math.max(0,-(r*s+a)),d=u>0?s:Math.min(Math.max(-s,-o),s),f=-u*u+d*(d+2*o)+c);else d=r>0?-s:s,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*o)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Mo).addScaledVector(js,d),f}intersectSphere(e,t){if(e.radius<0)return null;Pt.subVectors(e.center,this.origin);let n=Pt.dot(this.direction),i=Pt.dot(Pt)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),a=n-r,o=n+r;return o<0?null:a<0?this.at(o,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,r,a,o,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),l>=0?(s=(e.min.y-d.y)*l,r=(e.max.y-d.y)*l):(s=(e.max.y-d.y)*l,r=(e.min.y-d.y)*l),n>r||s>i||((s>n||isNaN(n))&&(n=s),(r<i||isNaN(i))&&(i=r),u>=0?(a=(e.min.z-d.z)*u,o=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,o=(e.min.z-d.z)*u),n>o||a>i)||((a>n||n!==n)&&(n=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Pt)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,a=this.direction,o=a.x,c=a.y,l=a.z,u=e.x-r.x,d=e.y-r.y,f=e.z-r.z,p=t.x-r.x,m=t.y-r.y,g=t.z-r.z,b=n.x-r.x,_=n.y-r.y,v=n.z-r.z,x=Math.abs(o),y=Math.abs(c),w=Math.abs(l),E,M,S,T,I,R,B,F,L,N,z,G;if(x>=y&&x>=w?(S=o,R=u,L=p,G=b,o>=0?(E=c,M=l,T=d,I=f,B=m,F=g,N=_,z=v):(E=l,M=c,T=f,I=d,B=g,F=m,N=v,z=_)):y>=w?(S=c,R=d,L=m,G=_,c>=0?(E=l,M=o,T=f,I=u,B=g,F=p,N=v,z=b):(E=o,M=l,T=u,I=f,B=p,F=g,N=b,z=v)):(S=l,R=f,L=g,G=v,l>=0?(E=o,M=c,T=u,I=d,B=p,F=m,N=b,z=_):(E=c,M=o,T=d,I=u,B=m,F=p,N=_,z=b)),S===0)return null;let V=E/S,W=M/S,O=1/S,Q=T-V*R,$=I-W*R,se=B-V*L,Fe=F-W*L,pe=N-V*G,xt=z-W*G,_e=pe*Fe-xt*se,ve=Q*xt-$*pe,xe=se*$-Fe*Q;if(i){if(_e<0||ve<0||xe<0)return null}else if((_e<0||ve<0||xe<0)&&(_e>0||ve>0||xe>0))return null;let X=_e+ve+xe;if(X===0)return null;let de=O*(_e*R+ve*L+xe*G);return(X>0?de<0:de>0)?null:this.at(de/X,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ce=class extends Ve{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new D(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mt,this.combine=Gr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},uh=new P,xn=new ln,Zs=new be,dh=new C,$s=new C,er=new C,tr=new C,Eo=new C,nr=new C,fh=new C,ir=new C,q=class extends ge{constructor(e=new K,t=new Ce){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){nr.set(0,0,0);for(let o=0,c=s.length;o<c;o++){let l=a[o],u=s[o];l!==0&&(Eo.fromBufferAttribute(u,e),r?nr.addScaledVector(Eo,l):nr.addScaledVector(Eo.sub(t),l))}t.add(nr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Zs.copy(n.boundingSphere),Zs.applyMatrix4(s),xn.copy(e.ray).recast(e.near),!(Zs.containsPoint(xn.origin)===!1&&(xn.intersectSphere(Zs,dh)===null||xn.origin.distanceToSquared(dh)>(e.far-e.near)**2))&&(uh.copy(s).invert(),xn.copy(e.ray).applyMatrix4(uh),!(n.boundingBox!==null&&xn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,xn)))}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,a=s.index,o=s.attributes.position,c=s.attributes.uv,l=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],_=Math.max(g.start,f.start),v=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let x=_,y=v;x<y;x+=3){let w=a.getX(x),E=a.getX(x+1),M=a.getX(x+2);i=sr(this,b,e,n,c,l,u,w,E,M),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(a.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let _=a.getX(g),v=a.getX(g+1),x=a.getX(g+2);i=sr(this,r,e,n,c,l,u,_,v,x),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],_=Math.max(g.start,f.start),v=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let x=_,y=v;x<y;x+=3){let w=x,E=x+1,M=x+2;i=sr(this,b,e,n,c,l,u,w,E,M),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(o.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let _=g,v=g+1,x=g+2;i=sr(this,r,e,n,c,l,u,_,v,x),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function op(h,e,t,n,i,s,r,a){let o;if(e.side===kr?o=n.intersectTriangle(r,s,i,!0,a):o=n.intersectTriangle(i,s,r,e.side===fs,a),o===null)return null;ir.copy(a),ir.applyMatrix4(h.matrixWorld);let c=t.ray.origin.distanceTo(ir);return c<t.near||c>t.far?null:{distance:c,point:ir.clone(),object:h}}function sr(h,e,t,n,i,s,r,a,o,c){h.getVertexPosition(a,$s),h.getVertexPosition(o,er),h.getVertexPosition(c,tr);let l=op(h,e,t,n,$s,er,tr,fh);if(l){let u=new C;Ut.getBarycoord(fh,$s,er,tr,u),i&&(l.uv=Ut.getInterpolatedAttribute(i,a,o,c,u,new J)),s&&(l.uv1=Ut.getInterpolatedAttribute(s,a,o,c,u,new J)),r&&(l.normal=Ut.getInterpolatedAttribute(r,a,o,c,u,new C),l.normal.dot(n.direction)>0&&l.normal.multiplyScalar(-1));let d={a,b:o,c,normal:new C,materialIndex:0};Ut.getNormal($s,er,tr,d.normal),l.face=d,l.barycoord=u}return l}var ki=new Se,ph=new Se,mh=new Se,cp=new Se,Ah=new P,rr=new C,So=new be,gh=new P,Co=new ln,fi=class extends q{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Go,this.bindMatrix=new P,this.bindMatrixInverse=new P,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new ye),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,rr),this.boundingBox.expandByPoint(rr)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new be),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,rr),this.boundingSphere.expandByPoint(rr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),So.copy(this.boundingSphere),So.applyMatrix4(i),e.ray.intersectsSphere(So)!==!1&&(gh.copy(i).invert(),Co.copy(e.ray).applyMatrix4(gh),!(this.boundingBox!==null&&Co.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Co)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Se,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Go?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===qh?this.bindMatrixInverse.copy(this.bindMatrix).invert():ue("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;ph.fromBufferAttribute(i.attributes.skinIndex,e),mh.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(ki.copy(t),t.set(0,0,0,0)):(ki.set(...t,1),t.set(0,0,0)),ki.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=mh.getComponent(s);if(r!==0){let a=ph.getComponent(s);Ah.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(cp.copy(ki).applyMatrix4(Ah),r)}}return t.isVector4&&(t.w=ki.w),t.applyMatrix4(this.bindMatrixInverse)}},pi=class extends ge{constructor(){super(),this.isBone=!0,this.type="Bone"}},Je=class extends Oe{constructor(e=null,t=1,n=1,i,s,r,a,o,c=mt,l=mt,u,d){super(null,r,a,o,c,l,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},bh=new P,lp=new P,$i=class h{constructor(e=[],t=[]){this.uuid=pt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){ue("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new P)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new P;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let a=e[s]?e[s].matrixWorld:lp;bh.multiplyMatrices(a,t[s]),bh.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new h(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Je(t,e,e,Le,rt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=t[s];r===void 0&&(ue("Skeleton: No bone found with UUID:",s),r=new pi),this.bones.push(r),this.boneInverses.push(new P().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let r=t[i];e.bones.push(r.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},Ge=class extends H{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ai=new P,_h=new P,ar=[],xh=new ye,hp=new P,Oi=new q,Gi=new be,me=class extends q{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ge(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,hp)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new ye),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ai),xh.copy(e.boundingBox).applyMatrix4(ai),this.boundingBox.union(xh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new be),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ai),Gi.copy(e.boundingSphere).applyMatrix4(ai),this.boundingSphere.union(Gi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[r+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Oi.geometry=this.geometry,Oi.material=this.material,Oi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gi.copy(this.boundingSphere),Gi.applyMatrix4(n),e.ray.intersectsSphere(Gi)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,ai),_h.multiplyMatrices(n,ai),Oi.matrixWorld=_h,Oi.raycast(e,ar);for(let r=0,a=ar.length;r<a;r++){let o=ar[r];o.instanceId=s,o.object=this,t.push(o)}ar.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ge(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Je(new Float32Array(i*this.count),i,this.count,pn,rt));let s=this.morphTexture.source.data.data,r=0;for(let c=0;c<n.length;c++)r+=n[c];let a=this.geometry.morphTargetsRelative?1:1-r,o=i*e;return s[o]=a,s.set(n,o+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},vn=new be,up=new J(.5,.5),or=new C,Ht=class{constructor(e=new yt,t=new yt,n=new yt,i=new yt,s=new yt,r=new yt){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ot,n=!1){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],l=s[4],u=s[5],d=s[6],f=s[7],p=s[8],m=s[9],g=s[10],b=s[11],_=s[12],v=s[13],x=s[14],y=s[15];if(i[0].setComponents(c-r,f-l,b-p,y-_).normalize(),i[1].setComponents(c+r,f+l,b+p,y+_).normalize(),i[2].setComponents(c+a,f+u,b+m,y+v).normalize(),i[3].setComponents(c-a,f-u,b-m,y-v).normalize(),n)i[4].setComponents(o,d,g,x).normalize(),i[5].setComponents(c-o,f-d,b-g,y-x).normalize();else if(i[4].setComponents(c-o,f-d,b-g,y-x).normalize(),t===Ot)i[5].setComponents(c+o,f+d,b+g,y+x).normalize();else if(t===Xi)i[5].setComponents(o,d,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),vn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),vn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(vn)}intersectsSprite(e){vn.center.set(0,0,0);let t=up.distanceTo(e.center);return vn.radius=.7071067811865476+t,vn.applyMatrix4(e.matrixWorld),this.intersectsSphere(vn)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(or.x=i.normal.x>0?e.max.x:e.min.x,or.y=i.normal.y>0?e.max.y:e.min.y,or.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(or)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},vh=new P,Sr=class h{constructor(){this.coordinateSystem=Ot,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){let s=t[i];vh.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),n[i]===void 0&&(n[i]=new Ht),n[i].setFromProjectionMatrix(vh,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new Ht),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new h().copy(this)}};function Io(h,e){return h-e}function dp(h,e){return h.z-e.z}function fp(h,e){return e.z-h.z}var Ho=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,r=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let a=s[this.index];r.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}},Xe=new P,pp=new D(1,1,1),mp=new Ht,Ap=new Sr,cr=new ye,yn=new be,Qi=new C,yh=new C,gp=new C,To=new Ho,ke=new q,lr=[];function bp(h,e,t=0){let n=e.itemSize;if(h.isInterleavedBufferAttribute||h.array.constructor!==e.array.constructor){let i=h.count;for(let s=0;s<i;s++)for(let r=0;r<n;r++)e.setComponent(s+t,r,h.getComponent(s,r))}else e.array.set(h.array,t*n);e.needsUpdate=!0}function wn(h,e){if(h.constructor!==e.constructor){let t=Math.min(h.length,e.length);for(let n=0;n<t;n++)e[n]=h[n]}else{let t=Math.min(h.length,e.length);e.set(new h.constructor(h.buffer,0,t))}}var Tn=class extends q{constructor(e,t,n=t*2,i){super(new K,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),n=new Je(t,e,e,Le,rt);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),n=new Je(t,e,e,Jh,Xh);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),n=new Je(t,e,e,Le,rt);n.colorSpace=De.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in e.attributes){let r=e.getAttribute(s),{array:a,itemSize:o,normalized:c}=r,l=new a.constructor(n*o),u=new H(l,o,c);t.setAttribute(s,u)}if(e.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new H(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ye);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,Xe),this.getBoundingBoxAt(s,cr).applyMatrix4(Xe),e.union(cr)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new be);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,Xe),this.getBoundingSphereAt(s,yn).applyMatrix4(Xe),e.union(yn)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Io),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let s=this._matricesTexture;Xe.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;let r=this._colorsTexture;return r&&(pp.toArray(r.image.data,i*4),r.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let r=e.getIndex();if(r!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?r.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let o;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Io),o=this._availableGeometryIds.shift(),s[o]=i):(o=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(o,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,o}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),r=t.getIndex(),a=this._geometryInfo[e];if(i&&r.count>a.reservedIndexCount||t.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let o=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=t.getAttribute("position").count;for(let l in n.attributes){let u=t.getAttribute(l),d=n.getAttribute(l);bp(u,d,o);let f=u.itemSize;for(let p=u.count,m=c;p<m;p++){let g=o+p;for(let b=0;b<f;b++)d.setComponent(g,b,0)}d.needsUpdate=!0,d.addUpdateRange(o*f,c*f)}if(i){let l=a.indexStart,u=a.reservedIndexCount;a.indexCount=t.getIndex().count;for(let d=0;d<r.count;d++)s.setX(l+d,o+r.getX(d));for(let d=r.count,f=u;d<f;d++)s.setX(l+d,o);s.needsUpdate=!0,s.addUpdateRange(l,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,t.boundingBox!==null&&(a.boundingBox=t.boundingBox.clone()),a.boundingSphere=null,t.boundingSphere!==null&&(a.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,i=n.map((r,a)=>a).sort((r,a)=>n[r].vertexStart-n[a].vertexStart),s=this.geometry;for(let r=0,a=n.length;r<a;r++){let o=i[r],c=n[o];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==t){let{indexStart:l,vertexStart:u,reservedIndexCount:d}=c,f=s.index,p=f.array,m=e-u;for(let g=l;g<l+d;g++)p[g]=p[g]+m;f.array.copyWithin(t,l,l+d),f.addUpdateRange(t,d),f.needsUpdate=!0,c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){let{vertexStart:l,reservedVertexCount:u}=c,d=s.attributes;for(let f in d){let p=d[f],{array:m,itemSize:g}=p;m.copyWithin(e*g,l*g,(l+u)*g),p.addUpdateRange(e*g,u*g),p.needsUpdate=!0}c.vertexStart=e}e+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){let s=new ye,r=n.index,a=n.attributes.position;for(let o=i.start,c=i.start+i.count;o<c;o++){let l=o;r&&(l=r.getX(l)),s.expandByPoint(Qi.fromBufferAttribute(a,l))}i.boundingBox=s}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){let s=new be;this.getBoundingBoxAt(e,cr),cr.getCenter(s.center);let r=n.index,a=n.attributes.position,o=0;for(let c=i.start,l=i.start+i.count;c<l;c++){let u=c;r&&(u=r.getX(u)),Qi.fromBufferAttribute(a,u),o=Math.max(o,s.center.distanceToSquared(Qi))}s.radius=Math.sqrt(o),i.boundingSphere=s}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this._visibilityChanged=!0,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(Io);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let i=new Int32Array(e),s=new Int32Array(e);wn(this._multiDrawCounts,i),wn(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=e;let r=this._indirectTexture,a=this._matricesTexture,o=this._colorsTexture;r.dispose(),this._initIndirectTexture(),wn(r.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),wn(a.image.data,this._matricesTexture.image.data),o&&(o.dispose(),this._initColorsTexture(),wn(o.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(o=>o.indexStart+o.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let s=this.geometry;s.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new K,this._initializeGeometry(s));let r=this.geometry;s.index&&wn(s.index.array,r.index.array);for(let a in s.attributes)wn(s.attributes[a].array,r.attributes[a].array)}raycast(e,t){let n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,r=this.geometry;ke.material=this.material,ke.geometry.index=r.index,ke.geometry.attributes=r.attributes,ke.geometry.boundingBox===null&&(ke.geometry.boundingBox=new ye),ke.geometry.boundingSphere===null&&(ke.geometry.boundingSphere=new be);for(let a=0,o=n.length;a<o;a++){if(!n[a].visible||!n[a].active)continue;let c=n[a].geometryIndex,l=i[c];ke.geometry.setDrawRange(l.start,l.count),this.getMatrixAt(a,ke.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,ke.geometry.boundingBox),this.getBoundingSphereAt(c,ke.geometry.boundingSphere),ke.raycast(e,lr);for(let u=0,d=lr.length;u<d;u++){let f=lr[u];f.object=this,f.batchId=a,t.push(f)}lr.length=0}ke.material=null,ke.geometry.index=null,ke.geometry.attributes={},ke.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._multiDrawBytesPerElement=e._multiDrawBytesPerElement,this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let r=i.getIndex(),a=r===null?1:r.array.BYTES_PER_ELEMENT,o=1;s.wireframe&&(o=2,a=i.attributes.position.count>65535?4:2);let c=this._instanceInfo,l=this._multiDrawStarts,u=this._multiDrawCounts,d=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,m=p.image.data,g=n.isArrayCamera?Ap:mp;f&&(n.isArrayCamera?g.setFromArrayCamera(n):(Xe.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),g.setFromProjectionMatrix(Xe,n.coordinateSystem,n.reversedDepth)));let b=0;if(this.sortObjects){Xe.copy(this.matrixWorld).invert(),Qi.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Xe),yh.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Xe);for(let x=0,y=c.length;x<y;x++)if(c[x].visible&&c[x].active){let w=c[x].geometryIndex;this.getMatrixAt(x,Xe),this.getBoundingSphereAt(w,yn).applyMatrix4(Xe);let E=!1;if(f&&(E=!g.intersectsSphere(yn)),!E){let M=d[w],S=gp.subVectors(yn.center,Qi).dot(yh);To.push(M.start,M.count,S,x)}}let _=To.list,v=this.customSort;v===null?_.sort(s.transparent?fp:dp):v.call(this,_,n);for(let x=0,y=_.length;x<y;x++){let w=_[x];l[b]=w.start*a*o,u[b]=w.count*o,m[b]=w.index,b++}To.reset()}else for(let _=0,v=c.length;_<v;_++)if(c[_].visible&&c[_].active){let x=c[_].geometryIndex,y=!1;if(f&&(this.getMatrixAt(_,Xe),this.getBoundingSphereAt(x,yn).applyMatrix4(Xe),y=!g.intersectsSphere(yn)),!y){let w=d[x];l[b]=w.start*a*o,u[b]=w.count*o,m[b]=_,b++}}p.needsUpdate=!0,this._multiDrawCount=b,this._multiDrawBytesPerElement=a,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,r){this.onBeforeRender(e,null,i,s,r)}},mi=class extends Ve{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new D(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Cr=new C,Ir=new C,wh=new P,zi=new ln,hr=new be,Ro=new C,Mh=new C,Rn=class extends ge{constructor(e=new K,t=new mi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Cr.fromBufferAttribute(t,i-1),Ir.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Cr.distanceTo(Ir);e.setAttribute("lineDistance",new j(n,1))}else ue("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),hr.copy(n.boundingSphere),hr.applyMatrix4(i),hr.radius+=s,e.ray.intersectsSphere(hr)===!1)return;wh.copy(i).invert(),zi.copy(e.ray).applyMatrix4(wh);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,c=this.isLineSegments?2:1,l=n.index,d=n.attributes.position;if(l!==null){let f=Math.max(0,r.start),p=Math.min(l.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=l.getX(m),_=l.getX(m+1),v=ur(this,e,zi,o,b,_,m);v&&t.push(v)}if(this.isLineLoop){let m=l.getX(p-1),g=l.getX(f),b=ur(this,e,zi,o,m,g,p-1);b&&t.push(b)}}else{let f=Math.max(0,r.start),p=Math.min(d.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=ur(this,e,zi,o,m,m+1,m);b&&t.push(b)}if(this.isLineLoop){let m=ur(this,e,zi,o,p-1,f,p-1);m&&t.push(m)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function ur(h,e,t,n,i,s,r){let a=h.geometry.attributes.position;if(Cr.fromBufferAttribute(a,i),Ir.fromBufferAttribute(a,s),t.distanceSqToSegment(Cr,Ir,Ro,Mh)>n)return;Ro.applyMatrix4(h.matrixWorld);let c=e.ray.origin.distanceTo(Ro);if(!(c<e.near||c>e.far))return{distance:c,point:Mh.clone().applyMatrix4(h.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:h}}var Eh=new C,Sh=new C,es=class extends Rn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)Eh.fromBufferAttribute(t,i),Sh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Eh.distanceTo(Sh);e.setAttribute("lineDistance",new j(n,1))}else ue("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ts=class extends Rn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},hn=class extends Ve{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new D(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ch=new P,Vo=new ln,dr=new be,fr=new C,At=class extends ge{constructor(e=new K,t=new hn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(i),dr.radius+=s,e.ray.intersectsSphere(dr)===!1)return;Ch.copy(i).invert(),Vo.copy(e.ray).applyMatrix4(Ch);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,r.start),f=Math.min(c.count,r.start+r.count);for(let p=d,m=f;p<m;p++){let g=c.getX(p);fr.fromBufferAttribute(u,g),Ih(fr,g,o,i,e,t,this)}}else{let d=Math.max(0,r.start),f=Math.min(u.count,r.start+r.count);for(let p=d,m=f;p<m;p++)fr.fromBufferAttribute(u,p),Ih(fr,p,o,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Ih(h,e,t,n,i,s,r){let a=Vo.distanceSqToPoint(h);if(a<t){let o=new C;Vo.closestPointToPoint(h,o),o.applyMatrix4(n);let c=i.ray.origin.distanceTo(o);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:o,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}var un=class extends Oe{constructor(e,t,n,i,s,r,a,o,c,l,u,d){super(null,r,a,o,c,l,i,s,u,d),this.isCompressedTexture=!0,this.image={width:t,height:n},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}},ns=class extends un{constructor(e,t,n,i,s,r){super(e,t,n,s,r),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=kt,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},is=class extends un{constructor(e,t,n){super(void 0,e[0].width,e[0].height,t,n,lc),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}};var it=class extends Oe{constructor(e,t,n,i,s,r,a,o,c){super(e,t,n,i,s,r,a,o,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var le=class h extends K{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let a=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let o=[],c=[],l=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,r,s,0),p("z","y","x",1,-1,n,t,-e,r,s,1),p("x","z","y",1,1,e,n,t,i,r,2),p("x","z","y",1,-1,e,n,-t,i,r,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new j(c,3)),this.setAttribute("normal",new j(l,3)),this.setAttribute("uv",new j(u,2));function p(m,g,b,_,v,x,y,w,E,M,S){let T=x/E,I=y/M,R=x/2,B=y/2,F=w/2,L=E+1,N=M+1,z=0,G=0,V=new C;for(let W=0;W<N;W++){let O=W*I-B;for(let Q=0;Q<L;Q++){let $=Q*T-R;V[m]=$*_,V[g]=O*v,V[b]=F,c.push(V.x,V.y,V.z),V[m]=0,V[g]=0,V[b]=w>0?1:-1,l.push(V.x,V.y,V.z),u.push(Q/E),u.push(1-W/M),z+=1}}for(let W=0;W<M;W++)for(let O=0;O<E;O++){let Q=d+O+L*W,$=d+O+L*(W+1),se=d+(O+1)+L*(W+1),Fe=d+(O+1)+L*W;o.push(Q,$,Fe),o.push($,se,Fe),G+=6}a.addGroup(f,G,S),f+=G,d+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Ie=class h extends K{constructor(e=1,t=1,n=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o};let c=this;i=Math.floor(i),s=Math.floor(s);let l=[],u=[],d=[],f=[],p=0,m=[],g=n/2,b=0;_(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute("position",new j(u,3)),this.setAttribute("normal",new j(d,3)),this.setAttribute("uv",new j(f,2));function _(){let x=new C,y=new C,w=0,E=(t-e)/n;for(let M=0;M<=s;M++){let S=[],T=M/s,I=T*(t-e)+e;for(let R=0;R<=i;R++){let B=R/i,F=B*o+a,L=Math.sin(F),N=Math.cos(F);y.x=I*L,y.y=-T*n+g,y.z=I*N,u.push(y.x,y.y,y.z),x.set(L,E,N).normalize(),d.push(x.x,x.y,x.z),f.push(B,1-T),S.push(p++)}m.push(S)}for(let M=0;M<i;M++)for(let S=0;S<s;S++){let T=m[S][M],I=m[S+1][M],R=m[S+1][M+1],B=m[S][M+1];(e>0||S!==0)&&(l.push(T,I,B),w+=3),(t>0||S!==s-1)&&(l.push(I,R,B),w+=3)}c.addGroup(b,w,0),b+=w}function v(x){let y=p,w=new J,E=new C,M=0,S=x===!0?e:t,T=x===!0?1:-1;for(let R=1;R<=i;R++)u.push(0,g*T,0),d.push(0,T,0),f.push(.5,.5),p++;let I=p;for(let R=0;R<=i;R++){let F=R/i*o+a,L=Math.cos(F),N=Math.sin(F);E.x=S*N,E.y=g*T,E.z=S*L,u.push(E.x,E.y,E.z),d.push(0,T,0),w.x=L*.5+.5,w.y=N*.5*T+.5,f.push(w.x,w.y),p++}for(let R=0;R<i;R++){let B=y+R,F=I+R;x===!0?l.push(F,F+1,B):l.push(F+1,F,B),M+=3}c.addGroup(b,M,x===!0?1:2),b+=M}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var ss=class h extends K{constructor(e=[new J(0,-.5),new J(.5,0),new J(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=te(i,0,Math.PI*2);let s=[],r=[],a=[],o=[],c=[],l=1/t,u=new C,d=new J,f=new C,p=new C,m=new C,g=0,b=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:g=e[_+1].x-e[_].x,b=e[_+1].y-e[_].y,f.x=b*1,f.y=-g,f.z=b*0,m.copy(f),f.normalize(),o.push(f.x,f.y,f.z);break;case e.length-1:o.push(m.x,m.y,m.z);break;default:g=e[_+1].x-e[_].x,b=e[_+1].y-e[_].y,f.x=b*1,f.y=-g,f.z=b*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),o.push(f.x,f.y,f.z),m.copy(p)}for(let _=0;_<=t;_++){let v=n+_*l*i,x=Math.sin(v),y=Math.cos(v);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*x,u.y=e[w].y,u.z=e[w].x*y,r.push(u.x,u.y,u.z),d.x=_/t,d.y=w/(e.length-1),a.push(d.x,d.y);let E=o[3*w+0]*x,M=o[3*w+1],S=o[3*w+0]*y;c.push(E,M,S)}}for(let _=0;_<t;_++)for(let v=0;v<e.length-1;v++){let x=v+_*e.length,y=x,w=x+e.length,E=x+e.length+1,M=x+1;s.push(y,w,M),s.push(E,M,w)}this.setIndex(s),this.setAttribute("position",new j(r,3)),this.setAttribute("uv",new j(a,2)),this.setAttribute("normal",new j(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.points,e.segments,e.phiStart,e.phiLength)}};var Vt=class h extends K{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,a=Math.floor(n),o=Math.floor(i),c=a+1,l=o+1,u=e/a,d=t/o,f=[],p=[],m=[],g=[];for(let b=0;b<l;b++){let _=b*d-r;for(let v=0;v<c;v++){let x=v*u-s;p.push(x,-_,0),m.push(0,0,1),g.push(v/a),g.push(1-b/o)}}for(let b=0;b<o;b++)for(let _=0;_<a;_++){let v=_+c*b,x=_+c*(b+1),y=_+1+c*(b+1),w=_+1+c*b;f.push(v,x,w),f.push(x,y,w)}this.setIndex(f),this.setAttribute("position",new j(p,3)),this.setAttribute("normal",new j(m,3)),this.setAttribute("uv",new j(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.width,e.height,e.widthSegments,e.heightSegments)}};var je=class h extends K{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:r,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let o=Math.min(r+a,Math.PI),c=0,l=[],u=new C,d=new C,f=[],p=[],m=[],g=[];for(let b=0;b<=n;b++){let _=[],v=b/n,x=r+v*a,y=e*Math.cos(x),w=Math.sqrt(e*e-y*y),E=0;b===0&&r===0?E=.5/t:b===n&&o===Math.PI&&(E=-.5/t);for(let M=0;M<=t;M++){let S=M/t,T=i+S*s;u.x=-w*Math.cos(T),u.y=y,u.z=w*Math.sin(T),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),g.push(S+E,1-v),_.push(c++)}l.push(_)}for(let b=0;b<n;b++)for(let _=0;_<t;_++){let v=l[b][_+1],x=l[b][_],y=l[b+1][_],w=l[b+1][_+1];(b!==0||r>0)&&f.push(v,x,w),(b!==n-1||o<Math.PI)&&f.push(x,y,w)}this.setIndex(f),this.setAttribute("position",new j(p,3)),this.setAttribute("normal",new j(m,3)),this.setAttribute("uv",new j(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function Tc(h){let e={};for(let t in h){e[t]={};for(let n in h[t]){let i=h[t][n];if(Th(i))i.isRenderTargetTexture?(ue("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Th(i[0])){let s=[];for(let r=0,a=i.length;r<a;r++)s[r]=i[r].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function qe(h){let e={};for(let t=0;t<h.length;t++){let n=Tc(h[t]);for(let i in n)e[i]=n[i]}return e}function Th(h){return h&&(h.isColor||h.isMatrix3||h.isMatrix4||h.isVector2||h.isVector3||h.isVector4||h.isTexture||h.isQuaternion)}function _p(h){let e=[];for(let t=0;t<h.length;t++)e.push(h[t].clone());return e}var xp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,gt=class extends Ve{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xp,this.fragmentShader=vp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Tc(e.uniforms),this.uniformsGroups=_p(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;r&&r.isTexture?t.uniforms[i]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[i]={type:"m4",value:r.toArray()}:t.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new D().setHex(i.value);break;case"v2":this.uniforms[n].value=new J().fromArray(i.value);break;case"v3":this.uniforms[n].value=new C().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Se().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Y().fromArray(i.value);break;case"m4":this.uniforms[n].value=new P().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}};var Ee=class extends Ve{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new D(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new D(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ec,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ye=class extends Ee{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new J(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return te(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new D(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new D(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new D(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var oe=class extends Ve{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new D(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new D(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ec,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mt,this.combine=Gr,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},rs=class extends Ve{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$h,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}};function on(h,e){return!h||h.constructor===e?h:typeof e.BYTES_PER_ELEMENT=="number"?new e(h):Array.prototype.slice.call(h)}function br(h){return h!==void 0&&h.inTangents!==void 0&&h.outTangents!==void 0}function yp(h){function e(i,s){return h[i]-h[s]}let t=h.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Rh(h,e,t){let n=h.length,i=new h.constructor(n);for(let s=0,r=0;r!==n;++s){let a=t[s]*e;for(let o=0;o!==e;++o)i[r++]=h[a+o]}return i}function wp(h,e,t,n){let i=1,s=h[0];for(;s!==void 0&&s[n]===void 0;)s=h[i++];if(s===void 0)return;let r=s[n];if(r!==void 0)if(Array.isArray(r))do r=s[n],r!==void 0&&(e.push(s.time),t.push(...r)),s=h[i++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[n],r!==void 0&&(e.push(s.time),r.toArray(t,t.length)),s=h[i++];while(s!==void 0);else do r=s[n],r!==void 0&&(e.push(s.time),t.push(r)),s=h[i++];while(s!==void 0)}var Et=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let r;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break t}r=t.length;break n}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=t[--n-1],e>=s)break t}r=n,n=0;break n}break e}for(;n<r;){let a=n+r>>>1;e<t[a]?r=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Tr=class extends Et{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Mn,endingEnd:Mn}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,a=i[s],o=i[r];if(a===void 0)switch(this.getSettings_().endingStart){case En:s=e,a=2*t-n;break;case Ki:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(o===void 0)switch(this.getSettings_().endingEnd){case En:r=e,o=2*n-t;break;case Ki:r=1,o=n+i[1]-i[0];break;default:r=e-1,o=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(o-n),this._offsetPrev=s*l,this._offsetNext=r*l}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,c=o-a,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),m=p*p,g=m*p,b=-d*g+2*d*m-d*p,_=(1+d)*g+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*g+(1.5+f)*m+.5*p,x=f*g-f*m;for(let y=0;y!==a;++y)s[y]=b*r[l+y]+_*r[c+y]+v*r[o+y]+x*r[u+y];return s}},as=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,c=o-a,l=(n-t)/(i-t),u=1-l;for(let d=0;d!==a;++d)s[d]=r[c+d]*u+r[o+d]*l;return s}},Rr=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Br=class extends Et{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,c=o-a,l=this.inTangents,u=this.outTangents;if(!l||!u){let p=(n-t)/(i-t),m=1-p;for(let g=0;g!==a;++g)s[g]=r[c+g]*m+r[o+g]*p;return s}let d=a*2,f=e-1;for(let p=0;p!==a;++p){let m=r[c+p],g=r[o+p],b=f*d+p*2,_=u[b],v=u[b+1],x=e*d+p*2,y=l[x],w=l[x+1],E=Ep(n,t,_,y,i);s[p]=su(E,m,v,w,g)}return s}};function su(h,e,t,n,i){let s=1-h;return s*s*s*e+3*s*s*h*t+3*s*h*h*n+h*h*h*i}function Mp(h,e,t,n,i){let s=1-h;return 3*s*s*(t-e)+6*s*h*(n-t)+3*h*h*(i-n)}function Ep(h,e,t,n,i){let s=(h-e)/(i-e);for(let r=0;r<8;r++){let a=su(s,e,t,n,i)-h;if(Math.abs(a)<1e-10)break;let o=Mp(s,e,t,n,i);if(Math.abs(o)<1e-10)break;s=Math.max(0,Math.min(1,s-a/o))}return s}var Ze=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=on(t,this.TimeBufferType),this.values=on(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:on(e.times,Array),values:on(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),br(e.settings)&&(n.settings={inTangents:on(e.settings.inTangents,Array),outTangents:on(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Rr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new as(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Tr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Br(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Sn:t=this.InterpolantFactoryMethodDiscrete;break;case Cn:t=this.InterpolantFactoryMethodLinear;break;case Ar:t=this.InterpolantFactoryMethodSmooth;break;case Qo:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ue("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Sn;case this.InterpolantFactoryMethodLinear:return Cn;case this.InterpolantFactoryMethodSmooth:return Ar;case this.InterpolantFactoryMethodBezier:return Qo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;br(this.settings)&&(Bh(this.settings.inTangents,e),Bh(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;for(;s!==i&&n[s]<e;)++s;for(;r!==-1&&n[r]>t;)--r;if(++r,s!==0||r!==i){s>=r&&(r=Math.max(r,1),s=r-1);let a=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*a,r*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ae("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(Ae("KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let a=0;a!==s;a++){let o=n[a];if(typeof o=="number"&&isNaN(o)){Ae("KeyframeTrack: Time is not a valid number.",this,a,o),e=!1;break}if(r!==null&&r>o){Ae("KeyframeTrack: Out of order keys.",this,a,o,r),e=!1;break}r=o}if(i!==void 0&&If(i))for(let a=0,o=i.length;a!==o;++a){let c=i[a];if(isNaN(c)){Ae("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ar,s=e.length-1,r=1;for(let a=1;a<s;++a){let o=!1,c=e[a],l=e[a+1];if(c!==l&&(a!==1||c!==e[0]))if(i)o=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let m=t[u+p];if(m!==t[d+p]||m!==t[f+p]){o=!0;break}}}if(o){if(a!==r){e[r]=e[a];let u=a*n,d=r*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++r}}if(s>0){e[r]=e[s];for(let a=s*n,o=r*n,c=0;c!==n;++c)t[o+c]=t[a+c];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,br(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Bh(h,e){for(let t=0,n=h.length;t!==n;t+=2)h[t]*=e}Ze.prototype.ValueTypeName="";Ze.prototype.TimeBufferType=Float32Array;Ze.prototype.ValueBufferType=Float32Array;Ze.prototype.DefaultInterpolation=Cn;var Wt=class extends Ze{constructor(e,t,n){super(e,t,n)}};Wt.prototype.ValueTypeName="bool";Wt.prototype.ValueBufferType=Array;Wt.prototype.DefaultInterpolation=Sn;Wt.prototype.InterpolantFactoryMethodLinear=void 0;Wt.prototype.InterpolantFactoryMethodSmooth=void 0;var os=class extends Ze{constructor(e,t,n,i){super(e,t,n,i)}};os.prototype.ValueTypeName="color";var qt=class extends Ze{constructor(e,t,n,i){super(e,t,n,i)}};qt.prototype.ValueTypeName="number";var Dr=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=(n-t)/(i-t),c=e*a;for(let l=c+a;c!==l;c+=4)ae.slerpFlat(s,0,r,c-a,r,c,o);return s}},Kt=class extends Ze{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Dr(this.times,this.values,this.getValueSize(),e)}};Kt.prototype.ValueTypeName="quaternion";Kt.prototype.InterpolantFactoryMethodSmooth=void 0;var Xt=class extends Ze{constructor(e,t,n){super(e,t,n)}};Xt.prototype.ValueTypeName="string";Xt.prototype.ValueBufferType=Array;Xt.prototype.DefaultInterpolation=Sn;Xt.prototype.InterpolantFactoryMethodLinear=void 0;Xt.prototype.InterpolantFactoryMethodSmooth=void 0;var dn=class extends Ze{constructor(e,t,n,i){super(e,t,n,i)}};dn.prototype.ValueTypeName="vector";var Bn=class{constructor(e="",t=-1,n=[],i=Jr){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=pt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,a=n.length;r!==a;++r)t.push(Cp(n[r]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)t.push(Ze.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,r=[];for(let a=0;a<s;a++){let o=[],c=[];o.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);let l=yp(o);o=Rh(o,1,l),c=Rh(c,1,l),!i&&o[0]===0&&(o.push(s),c.push(c[0])),r.push(new qt(".morphTargetInfluences["+t[a].name+"]",o,c).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,o=e.length;a<o;a++){let c=e[a],l=c.name.match(s);if(l&&l.length>1){let u=l[1],d=i[u];d||(i[u]=d=[]),d.push(c)}}let r=[];for(let a in i)r.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return r}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Sp(h){switch(h.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return qt;case"vector":case"vector2":case"vector3":case"vector4":return dn;case"color":return os;case"quaternion":return Kt;case"bool":case"boolean":return Wt;case"string":return Xt}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+h)}function Cp(h){if(h.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Sp(h.type);if(h.times===void 0){let n=[],i=[];wp(h.keys,n,i,"value"),h.times=n,h.values=i}let t;return e.parse!==void 0?t=e.parse(h):t=new e(h.name,h.times,h.values,h.interpolation),br(h.settings)&&(t.settings={inTangents:on(h.settings.inTangents,Float32Array),outTangents:on(h.settings.outTangents,Float32Array)}),t}var wt={enabled:!1,files:{},add:function(h,e){this.enabled!==!1&&(Dh(h)||(this.files[h]=e))},get:function(h){if(this.enabled!==!1&&!Dh(h))return this.files[h]},remove:function(h){delete this.files[h]},clear:function(){this.files={}}};function Dh(h){try{let e=h.slice(h.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Fr=class{constructor(e,t,n){let i=this,s=!1,r=0,a=0,o,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(l){a++,s===!1&&i.onStart!==void 0&&i.onStart(l,r,a),s=!0},this.itemEnd=function(l){r++,i.onProgress!==void 0&&i.onProgress(l,r,a),r===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(l){i.onError!==void 0&&i.onError(l)},this.resolveURL=function(l){return l=l.normalize("NFC"),o?o(l):l},this.setURLModifier=function(l){return o=l,this},this.addHandler=function(l,u){return c.push(l,u),this},this.removeHandler=function(l){let u=c.indexOf(l);return u!==-1&&c.splice(u,2),this},this.getHandler=function(l){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(l))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},ru=new Fr,at=class{constructor(e){this.manager=e!==void 0?e:ru,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};at.DEFAULT_MATERIAL_NAME="__DEFAULT";var Nt={},Wo=class extends Error{constructor(e,t){super(e),this.response=t}},St=class extends at{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=wt.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(Nt[e]!==void 0){Nt[e].push({onLoad:t,onProgress:n,onError:i});return}Nt[e]=[],Nt[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,o=this.responseType;fetch(r).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&ue("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let l=Nt[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,m=0,g=new ReadableStream({start(b){_();function _(){u.read().then(({done:v,value:x})=>{if(v)b.close();else{m+=x.byteLength;let y=new ProgressEvent("progress",{lengthComputable:p,loaded:m,total:f});for(let w=0,E=l.length;w<E;w++){let M=l[w];M.onProgress&&M.onProgress(y)}b.enqueue(x),_()}},v=>{b.error(v)})}}});return new Response(g)}else throw new Wo(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(o){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(l=>new DOMParser().parseFromString(l,a));case"json":return c.json();default:if(a==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{wt.add(`file:${e}`,c);let l=Nt[e];delete Nt[e];for(let u=0,d=l.length;u<d;u++){let f=l[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let l=Nt[e];if(l===void 0)throw this.manager.itemError(e),c;delete Nt[e];for(let u=0,d=l.length;u<d;u++){let f=l[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var oi=new WeakMap,Lr=class extends at{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=wt.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);else{let u=oi.get(r);u===void 0&&(u=[],oi.set(r,u)),u.push({onLoad:t,onError:i})}return r}let a=vr("img");function o(){l(),t&&t(this);let u=oi.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}oi.delete(this),s.manager.itemEnd(e)}function c(u){l(),i&&i(u),wt.remove(`image:${e}`);let d=oi.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(u)}oi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function l(){a.removeEventListener("load",o,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",o,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),wt.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}};var fn=class extends at{constructor(e){super(e)}load(e,t,n,i){let s=new Oe,r=new Lr(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},Dn=class extends ge{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new D(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var Bo=new P,Fh=new C,Lh=new C,Ai=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new J(512,512),this.mapType=ee,this.map=null,this.mapPass=null,this.matrix=new P,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ht,this._frameExtents=new J(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Fh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fh),Lh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Lh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Bo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Bo,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,a=i?i.w/s.y:1,o=i?i.x/s.x:0,c=i?i.y/s.y:0;e.coordinateSystem===Xi||e.reversedDepth?t.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(Bo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},pr=new C,mr=new ae,vt=new C,cs=class extends ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new P,this.projectionMatrix=new P,this.projectionMatrixInverse=new P,this.coordinateSystem=Ot,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(pr,mr,vt),vt.x===1&&vt.y===1&&vt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(pr,mr,vt.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(pr,mr,vt),vt.x===1&&vt.y===1&&vt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(pr,mr,vt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},an=new C,Ph=new J,Nh=new J,Fn=class extends cs{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ui*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Vi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ui*2*Math.atan(Math.tan(Vi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){an.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(an.x,an.y).multiplyScalar(-e/an.z),an.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(an.x,an.y).multiplyScalar(-e/an.z)}getViewSize(e,t){return this.getViewBounds(e,Ph,Nh),t.subVectors(Nh,Ph)}setViewOffset(e,t,n,i,s,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Vi*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let o=r.fullWidth,c=r.fullHeight;s+=r.offsetX*i/o,t-=r.offsetY*n/c,i*=r.width/o,n*=r.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},qo=class extends Ai{constructor(){super(new Fn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=ui*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Ln=class extends Dn{constructor(e,t,n=0,i=Math.PI/3,s=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new qo}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Ko=class extends Ai{constructor(){super(new Fn(90,1,.5,500)),this.isPointLightShadow=!0}},Pn=class extends Dn{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ko}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},gi=class extends cs{constructor(e=-1,t=1,n=1,i=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,l=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,r=s+c*this.view.width,a-=l*this.view.offsetY,o=a-l*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Xo=class extends Ai{constructor(){super(new gi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ls=class extends Dn{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.shadow=new Xo}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},hs=class extends Dn{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Jt=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var Do=new WeakMap,us=class extends at{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ue("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ue("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=wt.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then(c=>{Do.has(r)===!0?(i&&i(Do.get(r)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return wt.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),Do.set(o,c),wt.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});wt.add(`image-bitmap:${e}`,o),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Pr=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,r;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,r=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,r=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,r=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=r,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,r=this.cumulativeWeight;if(r===0){for(let a=0;a!==i;++a)n[s+a]=n[a];r=t}else{r+=t;let a=t/r;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=r}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,r=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let o=t*this._origIndex;this._mixBufferRegion(n,i,o,1-s,t)}r>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let o=t,c=t+t;o!==c;++o)if(n[o]!==n[o+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,r=i;s!==r;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let r=0;r!==s;++r)e[t+r]=e[n+r]}_slerp(e,t,n,i){ae.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let r=this._workIndex*s;ae.multiplyQuaternionsFlat(e,r,e,t,e,n),ae.slerpFlat(e,t,e,t,e,r,i)}_lerp(e,t,n,i,s){let r=1-i;for(let a=0;a!==s;++a){let o=t+a;e[o]=e[o]*r+e[n+a]*i}}_lerpAdditive(e,t,n,i,s){for(let r=0;r!==s;++r){let a=t+r;e[a]=e[a]+e[n+r]*i}}},Rc="\\[\\]\\.:\\/",Ip=new RegExp("["+Rc+"]","g"),Bc="[^"+Rc+"]",Tp="[^"+Rc.replace("\\.","")+"]",Rp=/((?:WC+[\/:])*)/.source.replace("WC",Bc),Bp=/(WCOD+)?/.source.replace("WCOD",Tp),Dp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Bc),Fp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Bc),Lp=new RegExp("^"+Rp+Bp+Dp+Fp+"$"),Pp=["material","materials","bones","map"],Jo=class{constructor(e,t,n){let i=n||fe.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},fe=class h{constructor(e,t,n){this.path=t,this.parsedPath=n||h.parseTrackName(t),this.node=h.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new h.Composite(e,t,n):new h(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Ip,"")}static parseTrackName(e){let t=Lp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);Pp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let a=s[r];if(a.name===t||a.uuid===t)return a;let o=n(a.children);if(o)return o}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=h.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ue("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ae("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ae("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ae("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let l=0;l<e.length;l++)if(e[l].name===c){c=l;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ae("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ae("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ae("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ae("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let r=e[i];if(r===void 0){let c=t.nodeName;Ae("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ae("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ae("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}o=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(o=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(o=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fe.Composite=Jo;fe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};fe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};fe.prototype.GetterByBindingType=[fe.prototype._getValue_direct,fe.prototype._getValue_array,fe.prototype._getValue_arrayElement,fe.prototype._getValue_toArray];fe.prototype.SetterByBindingTypeAndVersioning=[[fe.prototype._setValue_direct,fe.prototype._setValue_direct_setNeedsUpdate,fe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_array,fe.prototype._setValue_array_setNeedsUpdate,fe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_arrayElement,fe.prototype._setValue_arrayElement_setNeedsUpdate,fe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_fromArray,fe.prototype._setValue_fromArray_setNeedsUpdate,fe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Nr=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,r=s.length,a=new Array(r),o={endingStart:Mn,endingEnd:Mn};for(let c=0;c!==r;++c){let l=s[c].createInterpolant(null);a[c]=l,l.settings=o}this._interpolantSettings=o,this._interpolants=a,this._propertyBindings=new Array(r),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Xr,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,r=s/i,a=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,r,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,r=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let o=a.parameterPositions,c=a.sampleValues;return o[0]=s,o[1]=s+n,c[0]=e/r,c[1]=t/r,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let o=(e-s)*n;o<0||n===0?t=0:(this._startTime=null,t=n*o)}t*=this._updateTimeScale(e);let r=this._updateTime(t),a=this._updateWeight(e);if(a>0){let o=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Zh:for(let l=0,u=o.length;l!==u;++l)o[l].evaluate(r),c[l].accumulateAdditive(a);break;case Jr:default:for(let l=0,u=o.length;l!==u;++l)o[l].evaluate(r),c[l].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,r=n===Yh;if(e===0)return s===-1?i:r&&(s&1)===1?t-i:i;if(n===jh){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,r)):this._setEndings(this.repetitions===0,!0,r)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,s+=Math.abs(a);let o=this.repetitions-s;if(o<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(o===1){let c=e<0;this._setEndings(c,!c,r)}else this._setEndings(!1,!1,r);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this._loopCount=s,this.time=i;if(r&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=En,i.endingEnd=En):(e?i.endingStart=this.zeroSlopeAtStart?En:Mn:i.endingStart=Ki,t?i.endingEnd=this.zeroSlopeAtEnd?En:Mn:i.endingEnd=Ki)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,r=this._weightInterpolant;r===null&&(r=i._lendControlInterpolant(),this._weightInterpolant=r);let a=r.parameterPositions,o=r.sampleValues;return a[0]=s,o[0]=t,a[1]=s+e,o[1]=n,this}},Np=new Float32Array(1),Nn=class extends zt{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,r=e._propertyBindings,a=e._interpolants,o=n.uuid,c=this._bindingsByRootAndName,l=c[o];l===void 0&&(l={},c[o]=l);for(let u=0;u!==s;++u){let d=i[u],f=d.name,p=l[f];if(p!==void 0)++p.referenceCount,r[u]=p;else{if(p=r[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,o,f));continue}let m=t&&t._propertyBindings[u].binding.parsedPath;p=new Pr(fe.create(n,f,m),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,o,f),r[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,r=s[t];if(r===void 0)r={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=r;else{let a=r.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),r.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,r=this._actionsByClip,a=r[s],o=a.knownActions,c=o[o.length-1],l=e._byClipCacheIndex;c._byClipCacheIndex=l,o[l]=c,o.pop(),e._byClipCacheIndex=null;let u=a.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],o.length===0&&delete r[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,r=i[t];r===void 0&&(r={},i[t]=r),r[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,r=this._bindingsByRootAndName,a=r[i],o=t[t.length-1],c=e._cacheIndex;o._cacheIndex=c,t[c]=o,t.pop(),delete a[s],Object.keys(a).length===0&&delete r[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new as(new Float32Array(2),new Float32Array(2),1,Np),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,r=typeof e=="string"?Bn.findByName(i,e):e,a=r!==null?r.uuid:e,o=this._actionsByClip[a],c=null;if(n===void 0&&(r!==null?n=r.blendMode:n=Jr),o!==void 0){let u=o.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;c=o.knownActions[0],r===null&&(r=c._clip)}if(r===null)return null;let l=new Nr(this,r,t,n);return this._bindAction(l,c),this._addInactiveAction(l,a,s),l}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?Bn.findByName(n,e):e,r=s?s.uuid:e,a=this._actionsByClip[r];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),r=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,r);let a=this._bindings,o=this._nActiveBindings;for(let c=0;c!==o;++c)a[c].apply(r);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let r=s.knownActions;for(let a=0,o=r.length;a!==o;++a){let c=r[a];this._deactivateAction(c);let l=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=l,t[l]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let r in n){let a=n[r].actionByRoot,o=a[t];o!==void 0&&(this._deactivateAction(o),this._removeInactiveAction(o))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let r in s){let a=s[r];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Uh=new P,ds=class{constructor(e,t,n=0,i=1/0){this.ray=new ln(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new ji,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ae("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Uh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Uh),this}intersectObject(e,t=!0,n=[]){return jo(e,this,n,t),n.sort(kh),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)jo(e[i],this,n,t);return n.sort(kh),n}};function kh(h,e){return h.distance-e.distance}function jo(h,e,t,n){let i=!0;if(h.layers.test(e.layers)&&h.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=h.children;for(let r=0,a=s.length;r<a;r++)jo(s[r],e,t,!0)}}var Nc=class Nc{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};Nc.prototype.isMatrix2=!0;var Yo=Nc;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ue("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");var Up=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kp=`#ifdef USE_ALPHAHASH
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
#endif`,Op=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hp=`#ifdef USE_AOMAP
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
#endif`,Vp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wp=`#ifdef USE_BATCHING
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
#endif`,qp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Kp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,jp=`#ifdef USE_IRIDESCENCE
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
#endif`,Yp=`#ifdef USE_BUMPMAP
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
#endif`,Zp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,em=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,im=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,sm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,rm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,am=`#define PI 3.141592653589793
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
} // validated`,om=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,cm=`vec3 transformedNormal = objectNormal;
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
#endif`,lm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,um=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fm="gl_FragColor = linearToOutputTexel( gl_FragColor );",pm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mm=`#ifdef USE_ENVMAP
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
#endif`,Am=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gm=`#ifdef USE_ENVMAP
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
#endif`,bm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_m=`#ifdef USE_ENVMAP
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
#endif`,xm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ym=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,wm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Mm=`#ifdef USE_GRADIENTMAP
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
}`,Em=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Sm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Cm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Im=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Tm=`#ifdef USE_ENVMAP
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
#endif`,Rm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Dm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Lm=`PhysicalMaterial material;
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
#endif`,Pm=`uniform sampler2D dfgLUT;
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
}`,Nm=`
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
#endif`,Um=`#if defined( RE_IndirectDiffuse )
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
#endif`,km=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Om=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Gm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Qm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Vm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Km=`#if defined( USE_POINTS_UV )
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
#endif`,Xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Jm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ym=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$m=`#ifdef USE_MORPHTARGETS
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
#endif`,eA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,nA=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,iA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,aA=`#ifdef USE_NORMALMAP
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
#endif`,oA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,hA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,uA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dA=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,fA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,AA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_A=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,xA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,vA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,yA=`float getShadowMask() {
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
}`,wA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,MA=`#ifdef USE_SKINNING
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
#endif`,EA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,SA=`#ifdef USE_SKINNING
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
#endif`,CA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,IA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,TA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,RA=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,BA=`#ifdef USE_TRANSMISSION
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
#endif`,DA=`#ifdef USE_TRANSMISSION
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
#endif`,FA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,LA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,PA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,NA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,UA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,kA=`uniform sampler2D t2D;
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
}`,OA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,GA=`#ifdef ENVMAP_TYPE_CUBE
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
}`,QA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HA=`#include <common>
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
}`,VA=`#if DEPTH_PACKING == 3200
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
}`,WA=`#define DISTANCE
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
}`,qA=`#define DISTANCE
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
}`,KA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,XA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,JA=`uniform float scale;
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
}`,jA=`uniform vec3 diffuse;
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
}`,YA=`#include <common>
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
}`,ZA=`uniform vec3 diffuse;
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
}`,$A=`#define LAMBERT
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
}`,eg=`#define LAMBERT
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
}`,tg=`#define MATCAP
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
}`,ng=`#define MATCAP
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
}`,ig=`#define NORMAL
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
}`,sg=`#define NORMAL
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
}`,rg=`#define PHONG
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
}`,ag=`#define PHONG
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
}`,og=`#define STANDARD
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
}`,cg=`#define STANDARD
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
}`,lg=`#define TOON
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
}`,hg=`#define TOON
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
}`,ug=`uniform float size;
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
}`,dg=`uniform vec3 diffuse;
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
}`,fg=`#include <common>
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
}`,pg=`uniform vec3 color;
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
}`,mg=`uniform float rotation;
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
}`,Ag=`uniform vec3 diffuse;
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
}`,ie={alphahash_fragment:Up,alphahash_pars_fragment:kp,alphamap_fragment:Op,alphamap_pars_fragment:Gp,alphatest_fragment:Qp,alphatest_pars_fragment:zp,aomap_fragment:Hp,aomap_pars_fragment:Vp,batching_pars_vertex:Wp,batching_vertex:qp,begin_vertex:Kp,beginnormal_vertex:Xp,bsdfs:Jp,iridescence_fragment:jp,bumpmap_pars_fragment:Yp,clipping_planes_fragment:Zp,clipping_planes_pars_fragment:$p,clipping_planes_pars_vertex:em,clipping_planes_vertex:tm,color_fragment:nm,color_pars_fragment:im,color_pars_vertex:sm,color_vertex:rm,common:am,cube_uv_reflection_fragment:om,defaultnormal_vertex:cm,displacementmap_pars_vertex:lm,displacementmap_vertex:hm,emissivemap_fragment:um,emissivemap_pars_fragment:dm,colorspace_fragment:fm,colorspace_pars_fragment:pm,envmap_fragment:mm,envmap_common_pars_fragment:Am,envmap_pars_fragment:gm,envmap_pars_vertex:bm,envmap_physical_pars_fragment:Tm,envmap_vertex:_m,fog_vertex:xm,fog_pars_vertex:vm,fog_fragment:ym,fog_pars_fragment:wm,gradientmap_pars_fragment:Mm,lightmap_pars_fragment:Em,lights_lambert_fragment:Sm,lights_lambert_pars_fragment:Cm,lights_pars_begin:Im,lights_toon_fragment:Rm,lights_toon_pars_fragment:Bm,lights_phong_fragment:Dm,lights_phong_pars_fragment:Fm,lights_physical_fragment:Lm,lights_physical_pars_fragment:Pm,lights_fragment_begin:Nm,lights_fragment_maps:Um,lights_fragment_end:km,lightprobes_pars_fragment:Om,logdepthbuf_fragment:Gm,logdepthbuf_pars_fragment:Qm,logdepthbuf_pars_vertex:zm,logdepthbuf_vertex:Hm,map_fragment:Vm,map_pars_fragment:Wm,map_particle_fragment:qm,map_particle_pars_fragment:Km,metalnessmap_fragment:Xm,metalnessmap_pars_fragment:Jm,morphinstance_vertex:jm,morphcolor_vertex:Ym,morphnormal_vertex:Zm,morphtarget_pars_vertex:$m,morphtarget_vertex:eA,normal_fragment_begin:tA,normal_fragment_maps:nA,normal_pars_fragment:iA,normal_pars_vertex:sA,normal_vertex:rA,normalmap_pars_fragment:aA,clearcoat_normal_fragment_begin:oA,clearcoat_normal_fragment_maps:cA,clearcoat_pars_fragment:lA,iridescence_pars_fragment:hA,opaque_fragment:uA,packing:dA,premultiplied_alpha_fragment:fA,project_vertex:pA,dithering_fragment:mA,dithering_pars_fragment:AA,roughnessmap_fragment:gA,roughnessmap_pars_fragment:bA,shadowmap_pars_fragment:_A,shadowmap_pars_vertex:xA,shadowmap_vertex:vA,shadowmask_pars_fragment:yA,skinbase_vertex:wA,skinning_pars_vertex:MA,skinning_vertex:EA,skinnormal_vertex:SA,specularmap_fragment:CA,specularmap_pars_fragment:IA,tonemapping_fragment:TA,tonemapping_pars_fragment:RA,transmission_fragment:BA,transmission_pars_fragment:DA,uv_pars_fragment:FA,uv_pars_vertex:LA,uv_vertex:PA,worldpos_vertex:NA,background_vert:UA,background_frag:kA,backgroundCube_vert:OA,backgroundCube_frag:GA,cube_vert:QA,cube_frag:zA,depth_vert:HA,depth_frag:VA,distance_vert:WA,distance_frag:qA,equirect_vert:KA,equirect_frag:XA,linedashed_vert:JA,linedashed_frag:jA,meshbasic_vert:YA,meshbasic_frag:ZA,meshlambert_vert:$A,meshlambert_frag:eg,meshmatcap_vert:tg,meshmatcap_frag:ng,meshnormal_vert:ig,meshnormal_frag:sg,meshphong_vert:rg,meshphong_frag:ag,meshphysical_vert:og,meshphysical_frag:cg,meshtoon_vert:lg,meshtoon_frag:hg,points_vert:ug,points_frag:dg,shadow_vert:fg,shadow_frag:pg,sprite_vert:mg,sprite_frag:Ag},k={common:{diffuse:{value:new D(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Y},alphaMap:{value:null},alphaMapTransform:{value:new Y},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Y}},envmap:{envMap:{value:null},envMapRotation:{value:new Y},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Y}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Y}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Y},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Y},normalScale:{value:new J(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Y},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Y}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Y}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Y}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new D(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new D(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Y},alphaTest:{value:0},uvTransform:{value:new Y}},sprite:{diffuse:{value:new D(16777215)},opacity:{value:1},center:{value:new J(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Y},alphaMap:{value:null},alphaMapTransform:{value:new Y},alphaTest:{value:0}}},au={basic:{uniforms:qe([k.common,k.specularmap,k.envmap,k.aomap,k.lightmap,k.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:qe([k.common,k.specularmap,k.envmap,k.aomap,k.lightmap,k.emissivemap,k.bumpmap,k.normalmap,k.displacementmap,k.fog,k.lights,{emissive:{value:new D(0)},envMapIntensity:{value:1}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:qe([k.common,k.specularmap,k.envmap,k.aomap,k.lightmap,k.emissivemap,k.bumpmap,k.normalmap,k.displacementmap,k.fog,k.lights,{emissive:{value:new D(0)},specular:{value:new D(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:qe([k.common,k.envmap,k.aomap,k.lightmap,k.emissivemap,k.bumpmap,k.normalmap,k.displacementmap,k.roughnessmap,k.metalnessmap,k.fog,k.lights,{emissive:{value:new D(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:qe([k.common,k.aomap,k.lightmap,k.emissivemap,k.bumpmap,k.normalmap,k.displacementmap,k.gradientmap,k.fog,k.lights,{emissive:{value:new D(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:qe([k.common,k.bumpmap,k.normalmap,k.displacementmap,k.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:qe([k.points,k.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:qe([k.common,k.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:qe([k.common,k.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:qe([k.common,k.bumpmap,k.normalmap,k.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:qe([k.sprite,k.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new Y},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Y}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distance:{uniforms:qe([k.common,k.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distance_vert,fragmentShader:ie.distance_frag},shadow:{uniforms:qe([k.lights,k.fog,{color:{value:new D(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};au.physical={uniforms:qe([au.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Y},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Y},clearcoatNormalScale:{value:new J(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Y},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Y},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Y},sheen:{value:0},sheenColor:{value:new D(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Y},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Y},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Y},transmissionSamplerSize:{value:new J},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Y},attenuationDistance:{value:0},attenuationColor:{value:new D(0)},specularColor:{value:new D(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Y},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Y},anisotropyVector:{value:new J},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Y}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};var gg=new Y;gg.set(-1,0,0,0,1,0,0,0,1);var zy={[tc]:"LINEAR_TONE_MAPPING",[nc]:"REINHARD_TONE_MAPPING",[ic]:"CINEON_TONE_MAPPING",[sc]:"ACES_FILMIC_TONE_MAPPING",[ac]:"AGX_TONE_MAPPING",[oc]:"NEUTRAL_TONE_MAPPING",[rc]:"CUSTOM_TONE_MAPPING"};var Hy=new Float32Array(16),Vy=new Float32Array(9),Wy=new Float32Array(4);var qy={[tc]:"Linear",[nc]:"Reinhard",[ic]:"Cineon",[sc]:"ACESFilmic",[ac]:"AgX",[oc]:"Neutral",[rc]:"Custom"};var Ky={[Oh]:"SHADOWMAP_TYPE_PCF",[Gh]:"SHADOWMAP_TYPE_VSM"};var Xy={[lc]:"ENVMAP_TYPE_CUBE",[hc]:"ENVMAP_TYPE_CUBE",[Kh]:"ENVMAP_TYPE_CUBE_UV"};var Jy={[hc]:"ENVMAP_MODE_REFRACTION"};var jy={[Gr]:"ENVMAP_BLENDING_MULTIPLY",[Vh]:"ENVMAP_BLENDING_MIX",[Wh]:"ENVMAP_BLENDING_ADD"};var bg=new Y;bg.set(-1,0,0,0,1,0,0,0,1);var Yy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);var Uc=Math.PI/180,ou=12.5*Uc,cu=0,_g=12.5/24,ot=(h,e,t)=>{let n=Math.max(0,Math.min(1,(t-h)/(e-h)));return n*n*(3-2*n)};var xg=[[-18,.006,.011,.034],[-12,.008,.016,.05],[-8,.013,.028,.085],[-5,.022,.05,.14],[-2,.04,.085,.22],[0,.055,.12,.29],[3,.065,.15,.37],[7,.07,.165,.43],[15,.075,.18,.46],[30,.074,.18,.48],[90,.07,.175,.49]],vg=[[-18,.03,.042,.085],[-12,.045,.05,.095],[-8,.14,.085,.1],[-5,.42,.19,.1],[-2,.78,.34,.12],[0,.95,.46,.18],[3,.98,.6,.32],[7,.82,.66,.5],[15,.6,.64,.7],[30,.5,.58,.7],[90,.46,.55,.69]],yg=[[-18,.03,.042,.085],[-12,.04,.05,.1],[-8,.06,.075,.15],[-5,.11,.12,.21],[-2,.2,.18,.27],[0,.29,.27,.34],[3,.35,.37,.46],[7,.37,.43,.54],[15,.4,.49,.63],[30,.4,.5,.65],[90,.42,.52,.67]],wg=[[-12,0,0,0],[-8,.08,.035,.02],[-5,.25,.1,.035],[-2,.42,.18,.05],[0,.55,.26,.07],[3,.55,.32,.12],[7,.45,.33,.18],[15,.34,.3,.24],[30,.28,.27,.24],[90,.26,.26,.24]],Mg=[[-10,0,0,0],[-6,.05,.03,.05],[-3,.13,.065,.09],[0,.11,.055,.07],[4,.03,.015,.015],[8,0,0,0]],Eg=[[-18,.03,.036,.06],[-12,.04,.045,.075],[-8,.1,.075,.11],[-5,.38,.2,.21],[-2,.82,.38,.24],[0,1,.52,.3],[3,1.02,.7,.46],[7,1,.84,.68],[15,1,.97,.92],[30,1,1,.99],[90,1,1,1]],Sg=[[-18,.012,.018,.042],[-12,.016,.024,.055],[-8,.03,.036,.075],[-5,.06,.055,.1],[-2,.11,.085,.13],[0,.18,.14,.19],[3,.27,.23,.28],[7,.36,.35,.41],[15,.42,.46,.55],[30,.46,.5,.6],[90,.48,.52,.62]],Cg=[[-1.2,0,0,0],[0,2.4,.7,.2],[3,5,2.4,.9],[8,8,5.6,3.4],[20,12,11,9.2],[90,14,13.4,12.4]],Ig=[[-2,1,.36,.14],[0,1,.45,.2],[3,1,.58,.32],[8,1,.72,.48],[15,1,.81,.6],[25,1,.86,.68],[40,1,.9,.74]];function Yt(h,e,t){if(e<=h[0][0])return t.setRGB(h[0][1],h[0][2],h[0][3]);for(let i=1;i<h.length;i++){let s=h[i];if(e<=s[0]){let r=h[i-1],a=(e-r[0])/(s[0]-r[0]);return t.setRGB(r[1]+(s[1]-r[1])*a,r[2]+(s[2]-r[2])*a,r[3]+(s[3]-r[3])*a)}}let n=h[h.length-1];return t.setRGB(n[1],n[2],n[3])}function kc(){return{t:0,elev:0,elevDeg:0,east:0,north:0,up:1,day:1,night:0,stars:0,sunK:1,moonK:0,skyK:1,dusk:0,zenith:new D,horSun:new D,horAnti:new D,glow:new D,belt:new D,cloudLit:new D,cloudShade:new D,disc:new D,light:new D,fog:new D}}function lu(h,e=kc()){let t=(h%1+1)%1,n=(t-_g)*Math.PI*2,i=Math.cos(cu),s=Math.sin(cu),r=Math.cos(ou),a=Math.sin(ou);e.east=-i*Math.sin(n),e.north=r*s-a*i*Math.cos(n),e.up=a*s+r*i*Math.cos(n),e.elev=e.up;let o=e.elevDeg=Math.asin(Math.max(-1,Math.min(1,e.up)))/Uc;e.t=t,e.day=ot(-9,4,o),e.night=1-e.day,e.stars=1-ot(-14,-6,o);let c=1/(Math.max(0,Math.sin(Math.max(o,0)*Uc))+.50572*Math.pow(Math.max(o,0)+6.07995,-1.6364));return e.sunK=Math.exp(-.11*(c-1))*ot(-1.5,4,o),e.moonK=1-ot(-12,-3,o),e.skyK=ot(-10,12,o),e.dusk=ot(-10,-1,o)*(1-ot(4,16,o)),Yt(xg,o,e.zenith),Yt(vg,o,e.horSun),Yt(yg,o,e.horAnti),Yt(wg,o,e.glow),Yt(Mg,o,e.belt),Yt(Eg,o,e.cloudLit),Yt(Sg,o,e.cloudShade),Yt(Cg,o,e.disc),Yt(Ig,o,e.light),e.fog.copy(e.horAnti).lerp(e.horSun,.3),e}var Te={value:0},On={value:0},jr={value:0};function Tg(h=256){let e=49734321,t=()=>(e=e*1664525+1013904223>>>0,e/4294967296),n=c=>{let l=new Float32Array(c*c);for(let u=0;u<l.length;u++)l[u]=t();return l},i=c=>{let l=c.map(n),u=new Float32Array(h*h),d=1e9,f=-1e9;for(let p=0;p<h;p++)for(let m=0;m<h;m++){let g=0,b=.5,_=0;for(let v=0;v<c.length;v++){let x=c[v],y=l[v],w=m/h*x,E=p/h*x,M=Math.floor(w),S=Math.floor(E),T=w-M,I=E-S;T=T*T*(3-2*T),I=I*I*(3-2*I);let R=M%x,B=S%x,F=(M+1)%x,L=(S+1)%x,N=y[B*x+R],z=y[B*x+F],G=y[L*x+R],V=y[L*x+F];g+=b*((N+(z-N)*T)*(1-I)+(G+(V-G)*T)*I),_+=b,b*=.5}g/=_,u[p*h+m]=g,g<d&&(d=g),g>f&&(f=g)}for(let p=0;p<u.length;p++)u[p]=(u[p]-d)/(f-d);return u},s=i([5,10,20,40,80]),r=i([16,32,64,128]),a=new Uint8Array(h*h*4);for(let c=0;c<h*h;c++)a[c*4]=s[c]*255,a[c*4+1]=r[c]*255,a[c*4+2]=0,a[c*4+3]=255;let o=new Je(a,h,h,Le,ee);return o.wrapS=o.wrapT=Qt,o.magFilter=Pe,o.minFilter=bt,o.generateMipmaps=!0,o.needsUpdate=!0,o}function hu(){let h={uSun:{value:new C(0,1,0)},uMoon:{value:new C(0,1,0)},uSunXZ:{value:new J(1,0)},uCam:{value:new C},uZen:{value:new D},uHorS:{value:new D},uHorA:{value:new D},uGlow:{value:new D},uBelt:{value:new D},uDisc:{value:new D},uCLit:{value:new D},uCShade:{value:new D},uFog:{value:new D},uWind:{value:new Se},uCover:{value:.58},uCloudAmt:{value:1},uMoonI:{value:0}},e=new gt({uniforms:{...h,uNight:Te,uStars:jr,uTime:On,uNoise:{value:Tg()}},side:kr,depthWrite:!1,transparent:!0,blending:Zo,fog:!1,vertexShader:`
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
      }`}),t=new q(new je(1,32,16),e);return t.frustumCulled=!1,t.renderOrder=-1e3,t.name="aw:sky",t.matrixAutoUpdate=!0,{mesh:t,u:h}}var Rg=new D(14017279),Bg=new D(2770032),Dg=new D(11569752),Fg=new D(9348300),Lg=new D(16764836),Pg=new D(10334430),Ng=new D(3820134),uu=24,Ug=new D,Yr=h=>h-Math.floor(h);function Oc(h,e){if(h.y>=e)return h;let t=Math.hypot(h.x,h.z)||1,n=Math.sqrt(1-e*e)/t;return h.set(h.x*n,e,h.z*n)}var Zr=class{constructor(e,t=!0){A(this,"g");A(this,"sky");A(this,"ambient");A(this,"sample",kc());A(this,"sunW",new C(0,1,0));A(this,"moonW",new C(0,1,0));A(this,"base");A(this,"ax",{ex:1,ez:0,nx:0,nz:-1});A(this,"wind",{x:0,z:0,qx:0,qz:0});A(this,"low");A(this,"disc");A(this,"clouds",[]);this.g=e;let n=e.real.sky,i=n.sunDir.clone().normalize();this.base={theta:n.theta,envAng0:Math.atan2(-i.z,i.x),sunColor:n.sun.color.clone(),sunI:n.sun.intensity,bounceSky:n.bounce.color.clone(),bounceGround:n.bounce.groundColor.clone(),bounceI:n.bounce.intensity,fog:n.fog.color.clone(),exposure:e.renderer.toneMappingExposure};let s=e.fromLL;if(s){let c=s(12.52,-70),l=s(12.52,-69.99),u=s(12.53,-70),d=Math.hypot(l.x-c.x,l.z-c.z)||1,f=Math.hypot(u.x-c.x,u.z-c.z)||1;this.ax={ex:(l.x-c.x)/d,ez:(l.z-c.z)/d,nx:(u.x-c.x)/f,nz:(u.z-c.z)/f}}let r=this.ax,a=-(.924*r.ex+.383*r.nx)*uu,o=-(.924*r.ez+.383*r.nz)*uu;this.wind={x:a/6e3,z:o/6e3,qx:(.8*a+.6*o)/2300,qz:(-.6*a+.8*o)/2300},this.low=e.real.q?.name==="low",this.disc=t?1:0,this.ambient=new hs(9348300,0),this.ambient.name="aw:nightAmbient",e.scene.add(this.ambient),this.sky=hu(),e.scene.add(this.sky.mesh);for(let c of e.scene.children){let l=c;l.isSprite&&l.material&&l.position.y>25&&l.scale.x>60&&this.clouds.push({m:l.material,c:l.material.color.clone(),o:l.material.opacity})}}apply(e){let t=this.g,n=t.real.sky,i=lu(e,this.sample),s=this.base,r=this.ax,a=this.low,o=i.night,c=i.elevDeg;Te.value=o,jr.value=i.stars;let l=this.sunW.set(i.east*r.ex+i.north*r.nx,i.up,i.east*r.ez+i.north*r.nz).normalize(),u=Oc(this.moonW.copy(l).negate(),.62),d=c>-2,f=n.sunDir;d?Oc(f.copy(l),.07):Oc(f.copy(u),.78);let p=s.theta+Math.atan2(-f.z,f.x)-s.envAng0;t.scene.environmentRotation.set(0,p,0),t.scene.backgroundRotation.set(0,p,0),t.scene.background&&(t.scene.background=null);let m=ot(.42,.75,o);d?(n.sun.color.copy(i.light).lerp(s.sunColor,ot(30,45,c)),n.sun.intensity=s.sunI*i.sunK):(n.sun.color.copy(Rg),n.sun.intensity=s.sunI*(.32+.16*m)*i.moonK*(a?1.1:1)),n.bounce.color.copy(s.bounceSky).lerp(Bg,o),n.bounce.groundColor.copy(s.bounceGround).lerp(Dg,o),n.bounce.intensity=s.bounceI+((.55+.35*m)*(a?.72:1)-s.bounceI)*o;let g=i.dusk*(1-i.moonK);this.ambient.color.copy(Lg).lerp(Pg,1-ot(-6,2,c)).lerp(Fg,i.moonK),this.ambient.intensity=.32*g*(a?.75:1)+(.55+.45*m)*(a?.5:1)*i.moonK;let b=a?.12:.22;t.scene.environmentIntensity=b+(1-b)*i.skyK,t.renderer.toneMappingExposure=s.exposure*(1+(a?.02:.14)*o)*(1+.1*i.dusk),n.fog.color.copy(i.fog).lerp(s.fog,.45*ot(12,30,c));let _=t.camera,v=this.sky.u;this.sky.mesh.position.copy(_.position),this.sky.mesh.scale.setScalar(_.far*.9),v.uSun.value.copy(l);let x=Math.hypot(l.x,l.z);x>1e-4&&v.uSunXZ.value.set(l.x/x,l.z/x),v.uMoon.value.copy(u),v.uMoonI.value=i.moonK,v.uCam.value.copy(_.position),v.uZen.value.copy(i.zenith),v.uHorS.value.copy(i.horSun),v.uHorA.value.copy(i.horAnti),v.uGlow.value.copy(i.glow),v.uBelt.value.copy(i.belt),v.uDisc.value.copy(i.disc).multiplyScalar(this.disc),v.uCLit.value.copy(i.cloudLit),v.uCShade.value.copy(i.cloudShade),v.uFog.value.copy(n.fog.color);let y=On.value,w=this.wind;v.uWind.value.set(Yr(w.x*y),Yr(w.z*y),Yr(w.qx*y),Yr(w.qz*y)),v.uCloudAmt.value=1-.35*o;for(let E of this.clouds)E.m.color.copy(E.c).lerp(Ug.copy(Ng),o),E.m.opacity=E.o*(1-.6*o)}};function vi(h,e,t){let n=h;if(n.userData["aw:"+e])return;n.userData["aw:"+e]=!0;let i=n.onBeforeCompile,s=n.customProgramCacheKey?n.customProgramCacheKey.bind(n):()=>"";n.onBeforeCompile=(r,a)=>{i&&i.call(n,r,a),t(r)},n.customProgramCacheKey=()=>s()+"|aw-"+e,n.needsUpdate=!0}function kg(h){vi(h,"winglow-v1",e=>{e.fragmentShader.includes("float gMask = glass;")&&(e.uniforms.uAwNight=Te,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    float awB = floor(u / 3.6), awF = floor(v / max(fh, 0.5));
    float awR = rwH(vec2(awB * 3.1 + seed * 11.0, awF * 7.3 + 0.37));
    float awLit = step(0.6, awR); // ~40% of windows lit (r202: 50%)
    vec3 awWarm = mix(vec3(1.0, 0.6, 0.28), vec3(1.0, 0.86, 0.62), rwH(vec2(awR, seed + 0.5)));
    totalEmissiveRadiance += awWarm * gMask * awLit * smoothstep(0.3, 0.8, uAwNight) * (0.35 + 0.25 * awR); // owner: city too bright (r202 0.9, before 2.4)
  }`))})}function Og(h){vi(h,"herowin-v2",e=>{e.fragmentShader.includes("#include <emissivemap_fragment>")&&(e.uniforms.uAwNight=Te,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
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
  }`))})}var Gg=new D(16763269),Qg=new C,$r=class{constructor(e){A(this,"g");A(this,"head");A(this,"headTarget");A(this,"pools",[]);A(this,"bulbMats",new Set);A(this,"bulbBase",new Map);A(this,"lampMeshes",new Set);A(this,"scanT",0);A(this,"heroGlow",new Map);A(this,"heroN",-1);A(this,"bump",[]);A(this,"poolT",0);A(this,"waterDone",new WeakSet);A(this,"waterSeen",new WeakSet);A(this,"waterTopN",-1);A(this,"waterT",0);this.g=e;let t=e.real;t.buildings?.wall&&kg(t.buildings.wall),this.head=new Ln(16773576,0,58,.95,.6,1),this.head.castShadow=!1,this.head.name="aw:headlight",this.headTarget=new ge,this.head.target=this.headTarget,e.scene.add(this.head,this.headTarget);let i=(t.q?.name??"med")==="high"?4:0;for(let s=0;s<i;s++){let r=new Pn(16757086,0,28,2);r.castShadow=!1,r.name="aw:lampPool",this.pools.push(r),e.scene.add(r)}}patchWaterMat(e){if(!e||Array.isArray(e)||this.waterDone.has(e))return;this.waterDone.add(e);let t=e.customProgramCacheKey?e.customProgramCacheKey():"";/\|water/.test(t)&&vi(e,"waternight-v1",n=>{n.fragmentShader.includes("diffuseColor = vec4(wc, a);")&&(n.uniforms.uAwNight=Te,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("diffuseColor = vec4(wc, a);",`wc *= mix(1.0, 0.22, uAwNight); wc = mix(wc, wc * vec3(0.55, 0.75, 1.1), uAwNight * 0.5);
  diffuseColor = vec4(wc, a);`))})}patchWater(){let e=this.g.real;if(e.group.children.length!==this.waterTopN){this.waterTopN=e.group.children.length;for(let t of e.group.children){let n=t.material;t.isMesh&&this.patchWaterMat(n)}}for(let t of e.regions.values())t.wmat&&this.patchWaterMat(t.wmat),!(t.state!=="built"||!t.group||this.waterSeen.has(t.group))&&(this.waterSeen.add(t.group),t.group.traverse(n=>{n.isMesh&&this.patchWaterMat(n.material)}))}scan(){this.waterT++,this.patchWater(),this.g.real.veg.group.traverse(e=>{let t=e.material;!e.isMesh||!t||Array.isArray(t)||!t.emissive||(t.emissive.getHex()===5591884||this.bulbMats.has(t))&&(this.bulbMats.has(t)||(this.bulbMats.add(t),this.bulbBase.set(t,{e:t.emissive.clone(),i:t.emissiveIntensity})),e.isInstancedMesh&&this.lampMeshes.add(e))});for(let e of this.lampMeshes)e.parent||this.lampMeshes.delete(e);this.scanHero()}scanHero(){let e=this.g.real.hero?.group;if(!e)return;let t=0;e.traverse(()=>t++),t!==this.heroN&&(this.heroN=t,e.traverse(n=>{let i=n.material;if(!(!n.isMesh||!i))for(let s of Array.isArray(i)?i:[i]){if(!s||!s.emissive||this.heroGlow.has(s))continue;let r=s.name||"";/^l?(signglow|neon|bulb)/i.test(r)?this.heroGlow.set(s,s.emissiveIntensity||1):r==="sign"?this.heroGlow.set(s,-(s.emissiveIntensity||1)):/^(facade|ground)(_\d+)?$/.test(r)?(Og(s),this.bump.push(s)):r==="glass"&&(s.emissive.setHex(16763269),s.emissiveIntensity=0,this.heroGlow.set(s,0))}}))}carForward(e){let t=this.g.S.car.h;return e.set(-Math.sin(t),0,-Math.cos(t)),!0}update(e){let t=this.g,n=Te.value;this.scanT-=e,this.scanT<=0&&(this.scanT=2,this.scan());let i=Math.max(0,Math.min(1,(n-.25)/.4));for(let o of this.bulbMats){let c=this.bulbBase.get(o);o.emissive.copy(c.e).lerp(Gg,i),o.emissiveIntensity=c.i+i*2}if(this.bump.length){for(let o of this.bump)o.needsUpdate=!0;this.bump.length=0}for(let o of this.heroGlow.keys()){let c=this.heroGlow.get(o);o.emissiveIntensity=c>0?c*(.45+i*.95):c<0?-c*(1+i*.55):i*.16}let s=t.S,r=(s.mode==="car"||s.mode==="moto")&&n>.35,a=Qg;if(r&&this.carForward(a)){let o=s.car,c=(o.y||0)+(s.mode==="moto"?.72:.62);this.head.position.set(o.x+a.x*2.2,c,o.z+a.z*2.2),this.headTarget.position.set(o.x+a.x*24,(o.y||0)+.2,o.z+a.z*24),this.headTarget.updateMatrixWorld(),this.head.intensity=14*n}else this.head.intensity=0;if(this.head.visible=n>.35,this.pools.length){if(this.poolT-=e,this.poolT<=0){this.poolT=.5;let o=t.camera.position,c=[],l=new P;for(let u of this.lampMeshes){let d=u.matrixWorld;for(let f=0;f<u.count;f++){u.getMatrixAt(f,l);let p=new C().setFromMatrixPosition(l).applyMatrix4(d),m=(p.x-o.x)**2+(p.z-o.z)**2;m>8100||c.push({d:m,p})}}c.sort((u,d)=>u.d-d.d),this.pools.forEach((u,d)=>{let f=c[d];f&&u.position.set(f.p.x,f.p.y+6.5,f.p.z),u.userData.has=!!f})}for(let o of this.pools)o.intensity=o.userData.has?n*12:0,o.visible=n>.3}}};var ea=[1,.9,.8,.7,.6],du=[1,.85,.75,.75,.75],fu=6,ta=class{constructor(e){A(this,"g");A(this,"enabled");A(this,"target");A(this,"level",0);A(this,"maxLevel",fu);A(this,"fps",60);A(this,"basePR");A(this,"acc",0);A(this,"frames",0);A(this,"lowFor",0);A(this,"highFor",0);A(this,"holdUp",0);A(this,"warm",4);A(this,"shadowTick",0);A(this,"stalls",0);A(this,"upAt",-1e9);A(this,"bounces",0);A(this,"floorUntil",0);A(this,"t",0);A(this,"phone",!1);A(this,"listeners",[]);this.g=e,this.basePR=e.renderer.getPixelRatio(),this.enabled=U.get("fpsguard")!=="0"&&localStorage.getItem("aw_fpsguard")!=="0";let t=e.real?.q?.name,n=+(U.get("fps")||0),i=!(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window),s=t==="high";this.target=n>10?n:t==="low"?i?30:50:i&&s?57:50,this.maxLevel=i&&s?4:i?fu:5,this.phone=!i,document.addEventListener("visibilitychange",()=>{this.warm=2,this.acc=0,this.frames=0})}onChange(e){this.listeners.push(e)}setEnabled(e){this.enabled=e;try{localStorage.setItem("aw_fpsguard",e?"1":"0")}catch{}e||this.setLevel(0),this.listeners.forEach(t=>t())}setLevel(e){if(e=Math.max(0,Math.min(this.maxLevel,e)),e===this.level)return;let t=this.g,n=(this.phone?du:ea)[Math.min(e,ea.length-1)],i=window.__awPRCap||1/0,s=Math.max(.5,Math.min(this.basePR,i)*n);Math.abs(t.renderer.getPixelRatio()-s)>.001&&(t.renderer.setPixelRatio(s),window.dispatchEvent(new Event("resize")),window.__awPost?window.__awPost.render():t.renderer.render(t.scene,t.camera)),t.renderer.shadowMap.autoUpdate=e<5,e<5&&(t.renderer.shadowMap.needsUpdate=!0),window.__noPost=e>=6,this.level=e,this.listeners.forEach(r=>r())}frame(e){let t=this.g.renderer;if(this.level>=5&&++this.shadowTick%7===0&&(t.shadowMap.needsUpdate=!0),!this.enabled||document.hidden)return;if(this.t+=Math.min(e,1),e>1.5&&++this.stalls<3){this.warm=Math.max(this.warm,1);return}if(e<=1.5&&(this.stalls=0),this.warm>0){this.warm-=Math.max(0,e);return}if(this.acc+=e,this.frames++,this.acc<.5)return;this.fps=this.frames/this.acc;let n=this.acc;this.acc=0,this.frames=0,this.holdUp=Math.max(0,this.holdUp-n),this.fps<this.target-2?(this.lowFor+=n,this.highFor=0):this.fps>Math.min(this.target+8,58)?(this.highFor+=n,this.lowFor=0):(this.lowFor=0,this.highFor=0);let i=window.__awAhead,s=!!i&&Math.hypot(i[0],i[1])>25;this.lowFor>=(this.phone?3:1.5)&&this.level<this.maxLevel?(this.t-this.upAt<25&&++this.bounces>=2&&(this.floorUntil=this.t+600),this.setLevel(this.level+1),this.lowFor=0,this.warm=1,this.holdUp=15):this.highFor>=6&&this.level>0&&!(this.phone&&s)&&this.holdUp<=0&&this.t>this.floorUntil&&(this.setLevel(this.level-1),this.upAt=this.t,this.highFor=0,this.warm=1,this.holdUp=8)}describe(){if(!this.enabled)return"off";let e=(this.phone?du:ea)[Math.min(this.level,ea.length-1)],t=this.level>=6?" \xB7 post off":this.level>=5?" \xB7 lazy shadows":"";return`${Math.round(this.fps)} fps \xB7 target ${this.target} \xB7 scale ${Math.round(e*100)}%${t}`}};var na=class{constructor(e){A(this,"g",e);A(this,"px",NaN);A(this,"pz",NaN);A(this,"vx",0);A(this,"vz",0)}frame(e){let t=this.g.camera.position;if(e>0&&e<.5&&Number.isFinite(this.px)){let o=Math.min(1,e*1.5);this.vx+=((t.x-this.px)/e-this.vx)*o,this.vz+=((t.z-this.pz)/e-this.vz)*o}this.px=t.x,this.pz=t.z;let n=this.vx*5,i=this.vz*5,s=Math.hypot(n,i);s>220&&(n*=220/s,i*=220/s);let r=window,a=r.__awAhead||(r.__awAhead=[0,0]);s<15?(a[0]=0,a[1]=0):(a[0]=n,a[1]=i)}};var Gc=["map","normalMap","roughnessMap","metalnessMap","emissiveMap","aoMap","alphaMap","bumpMap","lightMap","specularMap","clearcoatNormalMap"],ia=class{constructor(e,t,n=!0,i=!0){A(this,"g",e);A(this,"incremental",n);A(this,"preUpload",i);A(this,"on");A(this,"n",0);A(this,"t",.2);A(this,"busy",!1);A(this,"seen",new WeakSet);A(this,"keys",new Set);A(this,"lightKey","");A(this,"seenTex",new WeakSet);A(this,"texQ",[]);A(this,"pend",[]);A(this,"inflight",0);A(this,"stack",[]);A(this,"childN",new WeakMap);A(this,"lc",0);A(this,"depthMat",new rs);A(this,"depthMesh",new q);A(this,"empty",new K);A(this,"depthKeys",new Set);A(this,"stats",{compiles:0,objs:0,reps:0,uploads:0,depth:0,synced:0});A(this,"synced",new WeakSet);A(this,"syncQ",[]);A(this,"queued",new WeakSet);A(this,"syncTries",new WeakMap);A(this,"holds",[]);this.on=t;let s=e.real;if(s&&s.update){let r=s.update.bind(s);s.update=(...a)=>(this.beforeRender(),r(...a))}}beforeRender(){if(this.on){let e=this.g.renderer;e.shadowMap.autoUpdate=!1,(this.n++&1)===0&&(e.shadowMap.needsUpdate=!0)}this.incremental&&(this.drainTextures(),this.seed(),this.walk(.7),this.pump(2))}frame(e){if(!this.incremental){this.busy||this.full(e);return}this.pend.length&&this.pump(1)}afterJobs(){this.incremental&&(this.seed(),this.walk(1.2),this.pump(2),this.sync(8),this.drainTextures())}prime(e,t){if(!this.incremental){t?.();return}let n=this.g.renderer;n.compile&&this.compileObject(e,n),e.castShadow&&e.isMesh&&e.geometry&&this.warmDepth(e,n);let i=pu(e);e.castShadow&&i.push(this.depthMat);let s=[];for(let r of i)r&&!this.ready(r)&&s.push(r);for(let r of s)this.queue(r);if(!s.length){t?.();return}t&&this.holds.push({fn:t,mats:s,tries:0})}pending(){return this.pend.length+this.stack.length+this.inflight+this.syncQ.length+this.holds.length+(this.busy?1:0)}full(e){if((this.t-=e)>0)return;let t=this.g.renderer;t.compileAsync&&(this.t=4,this.busy=!0,t.compileAsync(this.g.scene,this.g.camera).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.busy=!1}))}drainTextures(){if(!this.preUpload||!this.texQ.length)return;let e=this.texQ.length>12;this.upload(e?8:1,e?8:2)}upload(e,t=2){let n=this.g.renderer,i=performance.now(),s=0;for(;this.texQ.length&&s<e&&performance.now()-i<t;){let r=this.texQ.shift(),a=r.image;if(!r.__awDead){if(r.version===0||!a||a.complete===!1){this.texQ.push(r);break}if(n.properties.get(r).__version!==r.version){try{n.initTexture(r)}catch{}s++,this.stats.uploads++}}}}seed(){if(this.lc++%45===0){let n="",i=s=>{s.isLight&&(n+=s.type+(s.castShadow?"s":"")+",");for(let r=0;r<s.children.length;r++)i(s.children[r])};if(i(this.g.scene),n!==this.lightKey){let s=this.lightKey==="";this.lightKey=n,s||(this.keys.clear(),this.depthKeys.clear(),this.seen=new WeakSet,this.childN=new WeakMap,this.stack.length=0)}}let e=n=>{!n||this.childN.get(n)===n.children.length||this.stack.push(n)};e(this.g.scene);let t=this.g.real?.regions;if(t)for(let n of t.values())e(n.group)}walk(e){let t=performance.now(),n=0;for(;this.stack.length&&n<800&&performance.now()-t<e;){let i=this.stack.pop(),s=i.children,r=s.length;if(this.childN.get(i)===r){n++;continue}this.childN.set(i,r);for(let a=0;a<r;a++)this.stack.push(s[a]);this.consider(i),n++}}inHero(e){let t=e.userData;if(t.awHero)return t.awHero===1;let n=!1;for(let i=e;i;i=i.parent)if(i.name==="hero"){n=!0;break}return t.awHero=n?1:2,n}consider(e){if(this.seen.has(e)||!(e.isMesh||e.isPoints||e.isLine||e.isSprite)||!e.material)return;this.seen.add(e),this.stats.objs++;let t=e.geometry,n=t?t.attributes:{},i=Array.isArray(e.material)?e.material:[e.material],s=(e.isInstancedMesh?e.instanceColor?"I":"i":"")+(e.isBatchedMesh?e._colorsTexture?"B":"b":"")+(e.isSkinnedMesh?"s":"")+(e.receiveShadow?"r":"")+(e.castShadow?"S":"")+(n.color?"c":"")+(n.tangent?"t":"")+(n.uv?"u":"")+(n.uv1?"1":"")+(n.uv2?"2":"")+(t&&Object.keys(t.morphAttributes).length?"m":"")+e.type,r=!1;for(let a of i){if(!a||a.visible===!1)continue;let o=zg(a,s,this.lightKey);if(this.keys.has(o)||(this.keys.add(o),r=!0),this.preUpload&&(e.visible||this.inHero(e)))for(let c of Gc){let l=a[c];if(l&&l.isTexture&&!l.isCubeTexture&&!this.seenTex.has(l)){this.seenTex.add(l);let u=l;u.addEventListener?.("dispose",()=>{u.__awDead=1}),this.texQ.push(l)}}}r&&this.pend.push(e)}pump(e){let t=this.g.renderer;if(!t.compile||!this.pend.length)return;let n=performance.now(),i=0;for(;this.pend.length&&i<e&&performance.now()-n<2;){let s=this.pend.shift();if(!s.parent&&s!==this.g.scene)continue;let r=[s],a={traverse:o=>{for(let c of r)o(c)},traverseVisible:()=>{}};this.compileObject(s,t),s.castShadow&&s.isMesh&&s.geometry&&this.warmDepth(s,t);for(let o of pu(s))this.ready(o)||this.queue(o);i++}}compileObject(e,t){if(!t.compile)return;let n=[e],i={traverse:s=>{for(let r of n)s(r)},traverseVisible:()=>{}};try{t.compile(i,this.g.camera,this.g.scene),this.stats.compiles++,this.stats.reps++}catch{}}queue(e){!e||this.queued.has(e)||(this.queued.add(e),this.syncQ.push(e))}sync(e){let t=this.g.renderer.properties;if(!t||!this.syncQ.length&&!this.holds.length){this.flush(t);return}let n=performance.now(),i=[],s=this.syncQ;this.syncQ=[];let r=0;for(let a of s){if(this.queued.delete(a),r>=2||performance.now()-n>e){i.push(a);continue}let o;try{o=t.get(a).currentProgram}catch{continue}if(!o||this.synced.has(o))continue;let c=!0;try{c=o.isReady()}catch{c=!1}if(!c&&(this.syncTries.get(a)||0)<8){this.syncTries.set(a,(this.syncTries.get(a)||0)+1),i.push(a);continue}try{o.getUniforms()}catch{}this.synced.add(o),this.stats.synced++,r++}for(let a of i)this.queue(a);this.flush(t)}ready(e){let t=this.g.renderer.properties;if(!t)return!0;try{let n=t.get(e).currentProgram;return!n||this.synced.has(n)}catch{return!0}}flush(e){if(!this.holds.length)return;let t=[];for(let n of this.holds){let i=!1;if(e)for(let s of n.mats)try{let r=e.get(s).currentProgram;r&&!this.synced.has(r)&&(i=!0)}catch{}if(i&&++n.tries<45){t.push(n);continue}try{n.fn()}catch{}}this.holds=t}warmDepth(e,t){let n=e.geometry?.morphAttributes;if(e.isSkinnedMesh||e.isInstancedMesh||e.morphTexture||n&&(n.position||n.normal||n.color))return;let i=(e.isBatchedMesh?"B":"")+(e.isInstancedMesh?"I":"")+(e.isSkinnedMesh?"s":"");if(this.depthKeys.has(i))return;this.depthKeys.add(i);let s=this.depthMesh;s.geometry=e.geometry,s.material=this.depthMat,s.castShadow=!0,s.visible=!0,s.frustumCulled=!1,s.isBatchedMesh=!!e.isBatchedMesh,s.isInstancedMesh=!!e.isInstancedMesh,s.isSkinnedMesh=!!e.isSkinnedMesh;try{t.compile(s,this.g.camera,this.g.scene),this.stats.depth++}catch{}this.ready(this.depthMat)||this.queue(this.depthMat),s.isBatchedMesh=!1,s.isInstancedMesh=!1,s.isSkinnedMesh=!1,s.geometry=this.empty}};function pu(h){return h.material?Array.isArray(h.material)?h.material.filter(Boolean):[h.material]:[]}function zg(h,e,t){let n="",i=h.defines;if(i)for(let r in i)n+=r+i[r];let s="";try{s=h.customProgramCacheKey?h.customProgramCacheKey():""}catch{s=""}return h.type+":"+(h.side||0)+(h.transparent?"T":"")+((h.alphaTest||0)>0?"A":"")+(h.alphaToCoverage?"C":"")+(h.vertexColors?"V":"")+(h.flatShading?"F":"")+(h.wireframe?"W":"")+(h.fog===!1?"f":"")+(h.toneMapped===!1?"t":"")+Hg(h)+":"+e+":"+n+":"+s+":"+t}function Hg(h){let e=h,t="";for(let n=0;n<Gc.length;n++)t+=e[Gc[n]]?"1":"0";return t}function Vg(h,e){let t=e&&e.length===h.length*10?e:new Float64Array(h.length*10);for(let n=0,i=0;n<h.length;n++,i+=10){let s=h[n],r=s.position,a=s.quaternion,o=s.scale;t[i]=r.x,t[i+1]=r.y,t[i+2]=r.z,t[i+3]=a.x,t[i+4]=a.y,t[i+5]=a.z,t[i+6]=a.w,t[i+7]=o.x,t[i+8]=o.y,t[i+9]=o.z}return t}function Qc(h,e,t){let n=h.position,i=h.quaternion,s=h.scale;return e[t]===n.x&&e[t+1]===n.y&&e[t+2]===n.z&&e[t+3]===i.x&&e[t+4]===i.y&&e[t+5]===i.z&&e[t+6]===i.w&&e[t+7]===s.x&&e[t+8]===s.y&&e[t+9]===s.z}function Wg(h,e){for(let t=0;t<16;t++)if(h[t]!==e[t])return!1;return!0}function Au(h,e){e.push(h);let t=h.children;for(let n=0;n<t.length;n++)Au(t[n],e);return e}function mu(h,e){let t=h.o;for(let n=0;n<h.depth&&t;n++)t=t.parent;return t===e}var zc=h=>Object.getPrototypeOf(h);function qg(h){let e=this.__awFz;if(e&&e.frozen){if(!this.matrixWorldNeedsUpdate){if(!h)return;let t=this.parent;if(t&&Wg(t.matrixWorld.elements,e.pm)&&Qc(this,e.snap,0))return}sa(e),e.fthaw=!0}zc(this).updateMatrixWorld.call(this,h)}function Kg(h){for(let e=h.target;e;e=e.parent)if(e.__awFz&&e.__awFz.frozen){sa(e.__awFz);return}}function sa(h){h.frozen&&(h.frozen=!1,h.t=-1,zc(h.o).updateMatrixWorld.call(h.o,!1))}var ra=class{constructor(e){A(this,"g",e);A(this,"stats",{frozen:0,frozenNodes:0,thaws:0,splits:0,roots:0});A(this,"roots",[]);A(this,"parents",[]);A(this,"tracked",new WeakSet);A(this,"hooked",new WeakSet);A(this,"clock",0);A(this,"scanT",0);A(this,"ci",0);A(this,"ck",0);A(this,"oi",0)}top(){return(this.g.real||{}).group||null}track(e,t){this.tracked.has(e)||(this.tracked.add(e),this.roots.push({o:e,depth:t,nodes:[],snap:new Float64Array(0),pm:new Float64Array(16),t:-1,frozen:!1,dead:!1,fthaw:!1}))}frame(e){let t=this.top();if(!t)return;if(this.clock+=e,(this.scanT-=e)<=0){this.scanT=1;for(let c of t.children)this.track(c,1);let s=0;for(let c of this.parents){if(!mu(c,t)){this.tracked.delete(c.o);continue}this.parents[s++]=c;for(let l of c.o.children)this.track(l,c.depth+1)}this.parents.length=s;let r=0,a=0,o=0;for(let c of this.roots)mu(c,t)||(sa(c),c.dead=!0,this.tracked.delete(c.o)),!c.dead&&(this.roots[r++]=c,c.frozen&&(a++,o+=c.nodes.length));this.roots.length=r,this.stats.roots=r,this.stats.frozen=a,this.stats.frozenNodes=o}let n=this.roots.length;if(!n)return;for(let s=0,r=400;s<n&&r>0;s++){let a=this.roots[this.oi=(this.oi+1)%n];if(a.fthaw&&(a.fthaw=!1,this.stats.thaws++),a.frozen||a.dead||a.t>=0&&this.clock-a.t<2)continue;let o=Au(a.o,[]),c=a.snap,l=a.nodes;r-=o.length;let u=a.t<0||l.length!==o.length;for(let d=0;d<o.length&&!u;d++)(o[d]!==l[d]||!Qc(o[d],c,d*10))&&(u=!0);if(u&&a.t>=0&&a.depth<4&&a.o.children.length){a.dead=!0,this.stats.splits++,this.parents.push(a);for(let d of a.o.children)this.track(d,a.depth+1);continue}if(u){a.nodes=o,a.snap=Vg(o,c),a.t=this.clock;continue}this.freeze(a)}let i=600;for(let s=0;i>0&&s<n;s++){let r=this.roots[this.ci%n];if(!r.frozen){this.ci++,this.ck=0;continue}let a=r.nodes,o=r.snap,c=!1,l=this.ck;for(;l<a.length&&i>0;l++,i--){let u=a[l];if(l>0&&u.matrixWorldNeedsUpdate||!Qc(u,o,l*10)){c=!0;break}}if(c&&(sa(r),this.stats.thaws++),c||l>=a.length)this.ci++,this.ck=0;else{this.ck=l;break}}}freeze(e){if(!e.o.parent)return;zc(e.o).updateMatrixWorld.call(e.o,!1);let t=e.o.parent.matrixWorld.elements;for(let n=0;n<16;n++)e.pm[n]=t[n];for(let n of e.nodes)this.hooked.has(n)||(this.hooked.add(n),n.addEventListener("childadded",Kg));Object.prototype.hasOwnProperty.call(e.o,"updateMatrixWorld")||(e.o.updateMatrixWorld=qg),e.o.__awFz=e,e.frozen=!0}};function _t(h,e=!1){let t=h[0].index!==null,n=new Set(Object.keys(h[0].attributes)),i=new Set(Object.keys(h[0].morphAttributes)),s={},r={},a=h[0].morphTargetsRelative,o=new K,c=0;for(let l=0;l<h.length;++l){let u=h[l],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+l+". The geometry must have either an index or a position attribute"),null;o.addGroup(c,f,l),c+=f}}if(t){let l=0,u=[];for(let d=0;d<h.length;++d){let f=h[d].index;for(let p=0;p<f.count;++p)u.push(f.getX(p)+l);l+=h[d].attributes.position.count}o.setIndex(u)}for(let l in s){let u=gu(s[l]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" attribute."),null;o.setAttribute(l,u)}for(let l in r){let u=r[l][0].length;if(u!==0){o.morphAttributes=o.morphAttributes||{},o.morphAttributes[l]=[];for(let d=0;d<u;++d){let f=[];for(let m=0;m<r[l].length;++m)f.push(r[l][m][d]);let p=gu(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+l+" morphAttribute."),null;o.morphAttributes[l].push(p)}}}return o}function gu(h){let e,t,n,i=-1,s=0;for(let c=0;c<h.length;++c){let l=h[c];if(e===void 0&&(e=l.array.constructor),e!==l.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=l.itemSize),t!==l.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=l.normalized),n!==l.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=l.gpuType),i!==l.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=l.count*t}let r=new e(s),a=new H(r,t,n),o=0;for(let c=0;c<h.length;++c){let l=h[c];if(l.isInterleavedBufferAttribute){let u=o/t;for(let d=0,f=l.count;d<f;d++)for(let p=0;p<t;p++){let m=l.getComponent(d,p);a.setComponent(d+u,p,m)}}else r.set(l.array,o);o+=l.count*t}return i!==void 0&&(a.gpuType=i),a}function Hc(h,e){if(e===Mc)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),h;if(e===_i||e===vs){let t=h.getIndex();if(t===null){let s=[],r=h.getAttribute("position");if(r!==void 0){for(let a=0;a<r.count;a++)s.push(a);h.setIndex(s),t=h.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),h}let n=t.count-2,i=[];if(e===_i)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),h.setIndex(i),h.clearGroups(),h}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),h}var aa=class{constructor(e){A(this,"g",e);A(this,"stats",{regions:0,before:0,after:0,ms:0});A(this,"n",0);A(this,"todo",[])}frame(){if(++this.n%3)return;let e=this.todo.shift();if(e){let n=performance.now();this.mergeList(e.root,e.list),this.stats.ms=Math.max(this.stats.ms,performance.now()-n);return}let t=this.g.real;for(let n of t.regions.values())if(!(n.__awBM||n.state!=="built"||!n.group)&&!t.queue.some(i=>i.R===n)){n.__awBM=!0,this.collect(n.group);return}}collect(e){let t=new Map;e.traverse(n=>{let i=n;if(!i.isMesh||i.isInstancedMesh||!i.name.startsWith("bld:")||i.name==="bld:kit"||Array.isArray(i.material))return;let s=i,r=!0;for(;s&&s!==e;)s.matrix.equals(Xg)||(r=!1),s=s.parent;if(!r)return;let a=i.geometry;if(Object.keys(a.morphAttributes).length||a.groups.length)return;let o=i.name+"|"+i.material.uuid+"|"+Object.keys(a.attributes).sort().join(",")+"|"+(a.index?1:0)+"|"+(i.castShadow?1:0)+(i.receiveShadow?1:0)+"|"+i.renderOrder;(t.get(o)||t.set(o,[]).get(o)).push(i)});for(let n of t.values())this.stats.before+=n.length,n.length<2?this.stats.after++:this.todo.push({root:e,list:n});this.stats.regions++}mergeList(e,t){if(!t[0].parent)return;let n=_t(t.map(r=>r.geometry));if(!n){this.stats.after+=t.length;return}n.computeBoundingSphere(),n.computeBoundingBox();let i=t[0],s=new q(n,i.material);s.name=i.name,s.castShadow=i.castShadow,s.receiveShadow=i.receiveShadow,s.renderOrder=i.renderOrder,s.frustumCulled=i.frustumCulled;for(let r of t)r.removeFromParent(),r.geometry.dispose();e.add(s),this.stats.after++}},Xg=new P;var Jg=new P,bu=new P,_u=new Ht,ws=new C,oa=new C,xu=0,vu=1,yu=2,Vc=32;function Wc(h,e,t,n){let i=this.userData.awb;bu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),_u.setFromProjectionMatrix(bu,t.coordinateSystem,t.reversedDepth);let s=_u.planes,r=n.index?n.index.array.BYTES_PER_ELEMENT:1,a=this._multiDrawStarts,o=this._multiDrawCounts,c=this._geometryInfo,l=0;e:for(let u=0;u<i.nVis;u++){let d=i.vis[u],f=i.cx[d],p=i.cy[d],m=i.cz[d],g=-i.r[d];for(let _=0;_<6;_++){let v=s[_],x=v.normal;if(x.x*f+x.y*p+x.z*m+v.constant<g)continue e}let b=c[d];a[l]=b.start*r,o[l]=b.count,l++}this.userData.awInd||(this._indirectTexture.needsUpdate=!0,this.userData.awInd=1),this._multiDrawCount=l,this._multiDrawBytesPerElement=r,this._visibilityChanged=!1}var ca=class{constructor(e,t,n=1/0){A(this,"g",e);A(this,"budget",t);A(this,"shellR",n);A(this,"stats",{regions:0,batches:0,cells:0,visCells:0,maxSlice:0,failed:0,concealed:0});A(this,"live",new Set);A(this,"taken",new WeakSet);A(this,"focus",null);A(this,"fx",NaN);A(this,"fz",NaN);let i=e.real,s=i.update.bind(i);i.update=(...r)=>{this.ingest();let a=s(...r);if(i.cullT===0){let o=window.__awAhead;this.fx=r[0]+(o?o[0]:0),this.fz=r[2]+(o?o[1]:0),this.cullAll()}return a}}pending(){let e=0;for(let t of this.g.real.regions.values())!t.__awSeal&&t.group&&e++;return e}frame(){this.sweep()}touch(e){e?.group&&(e.__awHot=(e.__awHot||0)+1,e.__awWait=0,e.__awConfirm=!1,e.__awHideStack=[e.group],this.conceal(e))}afterJobs(){let e=new Set;for(let n of this.g.real.regions.values())n.__awHot&&(this.conceal(n),e.add(n));if(!e.size)return;this.focus=e;let t=this.budget;this.budget=8,this.ingest(),this.budget=t,this.focus=null}sweep(){if(this.live.size){for(let e of[...this.live])if(!e.group||!e.group.parent){for(let t of e.__awBB||[])t.bm.dispose();e.__awBB=void 0,e.__awOpen=void 0,e.__awStack=void 0,this.live.delete(e)}}}ingest(){this.sweep();let e=this.g.real,t=performance.now();for(let i of e.regions.values()){if(this.focus&&!this.focus.has(i)||i.__awSeal||!i.group||!i.group.parent)continue;if(i.state==="failed"){i.__awSeal=!0;continue}let s=i.group.children,r=i.__awNC||0;if(s.length>r){let c=i.__awStack||(i.__awStack=[]),l=!1;for(let u=r;u<s.length;u++){let d=s[u];d.name.startsWith("aw:bb:")||(c.push(d),l=!0)}l&&(i.__awConfirm=!1,i.__awWait=0)}if(s.length!==r&&(i.__awNC=s.length),(!i.__awStack||!i.__awStack.length)&&(i.__awWait||0)>0&&i.state!=="built"){i.__awWait=(i.__awWait||1)-1;continue}let a=i.__awStack||(i.__awStack=[i.group]),o=0;for(;a.length&&performance.now()-t<this.budget&&o++<6e3;){let c=a.pop(),l=c.children;for(let u=l.length-1;u>=0;u--)a.push(l[u]);this.tryAdd(i,c)}if(a.length||(i.state==="built"?i.__awConfirm?(i.__awSeal=!0,i.__awStack=void 0,i.__awOpen=void 0,i.__awHot=0,this.stats.regions++):(i.__awConfirm=!0,i.__awStack=[i.group]):(i.__awStack=void 0,i.__awWait=0,i.__awHideStack||(i.__awHot=0)),performance.now()-t>=this.budget))break}let n=performance.now()-t;n>this.stats.maxSlice&&(this.stats.maxSlice=n)}tryAdd(e,t){let n=t;if(!n.isMesh||n.isInstancedMesh||!n.name||!n.name.startsWith("bld:")||n.name==="bld:kit"||Array.isArray(n.material)||this.taken.has(n))return;let i=e.group;for(let l=n;l&&l!==i;l=l.parent)if(!l.matrix.equals(Jg)){this.release(n);return}let s=n.geometry;if(!s||!s.attributes.position||!s.attributes.position.count||Object.keys(s.morphAttributes).length||s.groups.length){this.release(n);return}let r=this.keyOf(n,s),a=s.attributes.position.count,o=s.index?s.index.count:0,c=e.__awOpen?.get(r);if((!c||c.n>=c.cap||c.usedV+a>c.maxV||c.usedI+o>c.maxI)&&(c=this.newBatch(e,n,s,r)||void 0),!c||!this.addGeo(c,s)){c&&c.n===0&&(c.bm.dispose(),e.__awOpen?.get(r)===c&&e.__awOpen.delete(r)),this.stats.failed<3&&console.warn("[aw-bb] skip",n.name,"v",a,"i",o),this.release(n),this.stats.failed++;return}c.usedV+=a,c.usedI+=o,this.place(e,c,n,s)}addGeo(e,t){try{return e.bm.addInstance(e.bm.addGeometry(t)),!0}catch(n){return this.stats.failed<3&&console.warn("[aw-bb]",n),!1}}keyOf(e,t){let n="",i=t.attributes;for(let s in i)n+=s+i[s].itemSize+(i[s].normalized?"n":"");return e.name+"|"+e.material.uuid+"|"+n+"|"+(t.index?1:0)+"|"+(e.castShadow?1:0)+(e.receiveShadow?1:0)+"|"+e.renderOrder+"|"+e.frustumCulled+e.visible}newBatch(e,t,n,i){let s=n.attributes.position.count,r=n.index?n.index.count:0,a=s*Vc<=65535&&r*Vc<=262144?Vc:1,o=s*a,c=r*a,l;try{l=new Tn(a,Math.max(1,o),c,t.material)}catch(f){return this.stats.failed<3&&console.warn("[aw-bb]",f),null}l.name="aw:bb:"+t.name.slice(4),l.castShadow=t.castShadow,l.receiveShadow=t.receiveShadow,l.renderOrder=t.renderOrder,l.sortObjects=!1,l.perObjectFrustumCulled=!0,l.matrixAutoUpdate=!1;let u=t.name==="bld:MeshBasicMaterial"?yu:t.name==="bld:trim"?vu:xu,d={bm:l,kind:u,n:0,cap:a,cx:new Float32Array(a),cy:new Float32Array(a),cz:new Float32Array(a),r:new Float32Array(a),vis:new Uint16Array(a),nVis:0,maxV:o,maxI:c,usedV:0,usedI:0,sx:0,sz:0,sr:1/0,box:new ye,listed:!1};return l.userData.awb=d,l.onBeforeRender=Wc,e.__awOpen||(e.__awOpen=new Map),e.__awOpen.set(i,d),d}place(e,t,n,i){let s=t.n;i.boundingSphere||i.computeBoundingSphere();let r=i.boundingSphere;if(t.cx[s]=r.center.x,t.cy[s]=r.center.y,t.cz[s]=r.center.z,t.r[s]=r.radius,i.boundingBox||i.computeBoundingBox(),t.box.union(i.boundingBox),t.box.getCenter(ws),t.box.getSize(oa),t.sx=ws.x,t.sz=ws.z,t.sr=.5*Math.hypot(oa.x,oa.y,oa.z),t.bm.boundingSphere?(t.bm.boundingSphere.center.copy(ws),t.bm.boundingSphere.radius=t.sr):t.bm.boundingSphere=new be(ws.clone(),t.sr),t.n=s+1,t.listed||(t.listed=!0,e.__awBB||(e.__awBB=[]),e.__awBB.push(t),this.stats.batches++),!t.bm.parent){t.bm.layers.disable(0);let a=window.__aw?.mperf;if(a)try{a.prime(t.bm,()=>t.bm.layers.enable(0))}catch{t.bm.layers.enable(0)}else t.bm.layers.enable(0);e.group.add(t.bm)}this.live.add(e),this.stats.cells++,this.taken.add(n),n.removeFromParent(),i.dispose(),e.__awNC=e.group.children.length,this.cull(t)}release(e){this.taken.add(e),e.userData.__awHid&&(e.visible=!0,e.userData.__awHid=0)}conceal(e){let t=e.__awHideStack;if(!t||!t.length){e.__awHideStack=void 0;return}let n=performance.now(),i=0;for(;t.length&&i<8e3&&performance.now()-n<3;){let s=t.pop(),r=s.children;for(let o=r.length-1;o>=0;o--)t.push(r[o]);let a=s;i++,!(!a.isMesh||a.isInstancedMesh||this.taken.has(a)||!a.visible)&&(!a.name||!a.name.startsWith("bld:")||a.name==="bld:kit"||(a.visible=!1,a.userData.__awHid=1,this.stats.concealed++))}t.length||(e.__awHideStack=void 0)}cullAll(){let e=0;for(let t of this.live)for(let n of t.__awBB||[])this.cull(n),e+=n.nVis;this.stats.visCells=e}cull(e){let t=this.g.real.q,n=()=>{for(let r=0;r<e.n;r++)e.vis[r]=r;e.nVis=e.n,e.bm.visible=e.n>0};if(!Number.isFinite(this.fx))return n();if(e.kind===xu&&!Number.isFinite(this.shellR)){Math.hypot(e.sx-this.fx,e.sz-this.fz)-e.sr<t.bldR?n():(e.nVis=0,e.bm.visible=!1);return}let i=e.kind===yu?t.contactR:e.kind===vu?t.detailR:this.shellR,s=0;for(let r=0;r<e.n;r++)Math.hypot(e.cx[r]-this.fx,e.cz[r]-this.fz)-e.r[r]<i&&(e.vis[s++]=r);e.nVis=s,e.bm.visible=s>0}};var la=class{constructor(e){A(this,"stats",{sb:0,drawn:0,blocks:0});A(this,"sbs",[]);let t=e.ovBlocks;if(!t||!t.length)return;let n=t[0].userData.rect[2]-t[0].userData.rect[0]||1,i=t[0].userData.rect[3]-t[0].userData.rect[1]||1,s=Math.min(...t.map(c=>c.userData.rect[0])),r=Math.min(...t.map(c=>c.userData.rect[1])),a=new Map;for(let c of t){let l=Math.floor((c.userData.rect[0]-s+1)/(n*4))+","+Math.floor((c.userData.rect[1]-r+1)/(i*4));(a.get(l)||a.set(l,[]).get(l)).push(c)}for(let c of a.values()){if(c.length<2)continue;let l=new q(c[0].geometry,c[0].material);l.name="ovTerrain:sb",l.receiveShadow=!1,l.matrixAutoUpdate=!1,l.visible=!1,e.group.add(l),this.sbs.push({kids:c,mesh:l,key:"",cache:new Map})}this.stats.sb=this.sbs.length,this.stats.blocks=t.length;let o=e.update.bind(e);e.update=(...c)=>{let l=o(...c);return this.apply(),l}}apply(){let e=0;for(let t of this.sbs){let n="",i=0;for(let r of t.kids)r.visible?(n+=r.userData.lods.indexOf(r.geometry),i++):n+="h";if(i<2){t.mesh.visible=!1;continue}let s=t.cache.get(n);if(s===void 0){if(s=_t(t.kids.filter(r=>r.visible).map(r=>r.geometry))||null,s&&s.computeBoundingSphere(),s){t.mesh.geometry=s;for(let[r,a]of t.cache)t.cache.delete(r),a&&a!==s&&a.dispose()}t.cache.set(n,s)}else t.cache.delete(n),t.cache.set(n,s);if(!s){t.mesh.visible=!1;continue}t.mesh.geometry=s,t.mesh.visible=!0;for(let r of t.kids)r.visible=!1;e++}this.stats.drawn=e}};var ha=class{constructor(e){A(this,"real",e);A(this,"stats",{merged:0,chunks:0});A(this,"n",0);A(this,"live",new Set);let t=e.update.bind(e);e.update=(...n)=>{let i=t(...n);return this.apply(),i}}apply(){let e=(++this.n&7)===0,t=0,n=0,i=1;for(let s of this.real.regions.values()){let r=s.chunks,a=s.__awTM,o=!!r&&r.length>1&&!!s.group;if(o){for(let l of r)if(!l.mesh||l.step!==16||l.pending){o=!1;break}}if(!o){if(a&&(a.mesh.removeFromParent(),a.mesh.geometry.dispose(),s.__awTM=void 0,r))for(let l of r)l.mesh&&(l.mesh.visible=!0);continue}let c="";for(let l of r)c+=l.mesh.geometry.id+",";if(!a||a.key!==c){if(!e||i<=0){if(a){for(let u of r)u.mesh.visible=!0;a.mesh.visible=!1}continue}i--;let l=_t(r.map(u=>u.mesh.geometry));if(!l)continue;if(l.computeBoundingSphere(),a)a.mesh.geometry.dispose(),a.mesh.geometry=l,a.key=c;else{let u=new q(l,r[0].mesh.material);u.name="terrain16:m",u.receiveShadow=!0,u.matrixAutoUpdate=!1,s.group.add(u),s.__awTM={key:c,mesh:u},this.live.add(s)}}s.__awTM.mesh.visible=!0;for(let l of r)l.mesh.visible=!1;t++,n+=r.length}if(e)for(let s of this.live){let r=s.__awTM,a=!1;for(let o of this.real.regions.values())if(o===s){a=!0;break}(!a||!r)&&(r&&(r.mesh.removeFromParent(),r.mesh.geometry.dispose(),s.__awTM=void 0),this.live.delete(s))}this.stats.merged=t,this.stats.chunks=n}};var qc={value:500};function wu(h,e=1.6){return new gt({uniforms:{uI:h,uNight:Te,uScale:qc,uMinPx:{value:e}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:Un,fog:!1,toneMapped:!1})}function ua(h,e,t=!1){return new gt({uniforms:{uI:e,uC:{value:new D(h)}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:Un,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,fog:!1,toneMapped:!1})}var Mu=-2.4,Eu=8.87,Su=new P,jg=new ae,Yg=new C(15,1,15),Cu=new C,da=class{constructor(e){A(this,"g");A(this,"points");A(this,"pools");A(this,"dotI",{value:0});A(this,"poolI",{value:0});A(this,"lists",[]);A(this,"bulbs",new Float32Array(0));A(this,"nBulbs",0);A(this,"t",0);A(this,"nPools");this.g=e;let t=new K;t.setAttribute("position",new H(new Float32Array(3),3)),this.points=new At(t,wu(this.dotI)),this.points.frustumCulled=!1,this.points.name="aw:lampGlow",this.points.renderOrder=5;let n=e.real?.q?.name??"med";this.nPools=n==="low"?14:n==="med"?24:32;let i=new Vt(1,1).rotateX(-Math.PI/2);this.pools=new me(i,ua(16758886,this.poolI),this.nPools),this.pools.frustumCulled=!1,this.pools.count=0,this.pools.name="aw:lampPools",e.scene.add(this.points,this.pools)}rebuild(){let t=this.g.real.veg.lists?.l;if(!t||t.length===this.lists.length&&t.every((c,l)=>c===this.lists[l]))return;this.lists=t.slice();let n=0;for(let c of t)n+=c.length;let i=new Float32Array(n*3),s=new Float32Array(n*3),r=new Float32Array(n),a=0;for(let c of t)for(let[l,u,d,f,p]of c){let m=Math.cos(p),g=Math.sin(p);i[a*3]=l+Mu*m*f,i[a*3+1]=u+Eu*f-.12,i[a*3+2]=d-Mu*g*f,s[a*3]=1,s[a*3+1]=.74,s[a*3+2]=.42,r[a]=1.9,a++}let o=new K;o.setAttribute("position",new H(i,3)),o.setAttribute("color",new H(s,3)),o.setAttribute("size",new H(r,1)),this.points.geometry.dispose(),this.points.geometry=o,this.bulbs=i,this.nBulbs=n}update(e){let t=Te.value,n=Math.max(0,Math.min(1,(t-.3)/.45));if(this.dotI.value=.95*n,this.poolI.value=.34*n,this.points.visible=this.pools.visible=n>.001,this.t-=e,this.t>0)return;this.t=.5,this.rebuild();let i=this.g.camera;if(qc.value=this.g.renderer.domElement.height/2/Math.tan(i.fov*Math.PI/180/2),!this.points.visible)return;let s=i.position.x,r=i.position.z,a=[],o=this.bulbs;for(let l=0;l<this.nBulbs;l++){let u=o[l*3]-s,d=o[l*3+2]-r,f=u*u+d*d;f<25600&&a.push([f,l])}a.sort((l,u)=>l[0]-u[0]);let c=Math.min(this.nPools,a.length);for(let l=0;l<c;l++){let u=a[l][1],d=o[u*3],f=o[u*3+2],p=this.g.real&&this.g.real.heightAt,m=p?p(d,f):o[u*3+1]-Eu;Cu.set(d,m+.3,f),Su.compose(Cu,jg,Yg),this.pools.setMatrixAt(l,Su)}this.pools.count=c,this.pools.instanceMatrix.needsUpdate=!0}};var fa=[16052712,2106667,12106945,9377825,1526392,14145746,5003845,11823922,7038077,14927177,7554357,4093819],Zg=new D(16773590),$g=new D(16719888),e0=h=>!!h.rb,pa=class{constructor(e){A(this,"g",e);A(this,"stats",{pooled:0,visible:0,yielding:0,avoiding:0,batches:0,beamDraws:0,quality:""});A(this,"amb",null);A(this,"states",[]);A(this,"batches",[]);A(this,"stateByCar",new WeakMap);A(this,"matrix",new P);A(this,"zero",new P().makeScale(0,0,0));A(this,"paint",new D);A(this,"beamI",{value:0});A(this,"beamMat",ua(16773328,this.beamI,!0));A(this,"beams",null)}start(){let e=this.g.real.amb;if(!e?.kit?.car?.[0])return!1;this.amb=e;let t=this.g.real.q.name,n=t==="low"?5:t==="med"?10:15,i=t==="low"?[0,1,2]:t==="med"?[0,1,2,4]:[0,1,2,3,4];for(this.stats.quality=t;e.cars.length<n;){let r=e.cars.length,a=i[r%i.length],o=this.paint.setHex(fa[(r*5+3)%fa.length]),c=e.carMesh(a,o);c.visible=!1,e.group.add(c),e.cars.push({g:c,v:a,rd:null,L:0,dir:1,s:0,sp:0})}e.nCar=n;for(let r=0;r<5;r++)this.batches.push({cars:[],parts:[]});for(let r=0;r<e.cars.length;r++){let a=e.cars[r],o=Math.max(0,Math.min(4,a.v|0)),c=e.kit.car[0][o].paint,l=new D(fa[r%fa.length]);for(let d of a.g.children){let f=d,p=f.material;if(f.isMesh&&f.geometry===c&&p.color){l=p.color.clone();break}}let u={car:a,base:a.g.children.slice(),color:l,batchIndex:this.batches[o].cars.length,rd:null,cruise:11,yieldPhase:0,yieldTime:0,yieldsAtEnd:!1};this.batches[o].cars.push(u),this.states.push(u),this.stateByCar.set(a,u);for(let d of u.base)d.visible=!1}for(let r=0;r<5;r++)this.makeBatch(r,e.kit.car[0][r]);let s=new Vt(4.4,16).rotateX(-Math.PI/2).rotateY(Math.PI).translate(0,.11,10);return this.beams=new me(s,this.beamMat,n),this.beams.name="aw:traffic:beams",this.beams.frustumCulled=!1,this.beams.instanceMatrix.setUsage($e),this.beams.count=0,e.group.add(this.beams),this.stats.pooled=this.states.length,!0}makeBatch(e,t){let n=this.amb,i=this.batches[e],s=i.cars.length;if(s)for(let r of Object.keys(t)){let a=n.mats[r];if(!a)continue;let o=a.clone();r==="paint"&&o.color&&o.color.setHex(16777215);let c=new me(t[r],o,s);if(c.name=`aw:traffic:${e}:${r}`,c.frustumCulled=!1,c.castShadow=this.g.real.q.name!=="low"&&r==="paint",c.instanceMatrix.setUsage($e),r==="paint"){for(let l=0;l<s;l++)c.setColorAt(l,i.cars[l].color);c.instanceColor&&(c.instanceColor.needsUpdate=!0)}i.parts.push({mesh:c,mat:o,name:r}),n.group.add(c),this.stats.batches++}}routeChanged(e){let t=e.car;if(e.rd=t.rd,e.cruise=t.v===4?9:11+(e.batchIndex*7+t.v*3)%4,e.yieldPhase=0,e.yieldTime=0,e.yieldsAtEnd=!1,!t.rd||t.rd.rb)return;let n=t.rd.p,i=t.dir>0?n[n.length-1]:n[0];e.yieldsAtEnd=this.amb.pick(i[0],i[1],e0,18).length>0}applyAI(e){let t=this.amb,n=this.g.S.mode,i=n==="walk"?this.g.S.walk:this.g.S.car,s=n!=="plane",r=0,a=0;for(let o=0;o<t.cars.length;o++){let c=t.cars[o],l=this.stateByCar.get(c);if(!l||(c.rd!==l.rd&&this.routeChanged(l),!c.rd))continue;let u=l.cruise;if(c.rd.rb&&(u=Math.min(u,6.5)),l.yieldsAtEnd&&l.yieldPhase<2){let f=c.dir>0?c.L-c.s:c.s;f<22&&(u=Math.min(u,Math.max(0,(f-4.5)*.75))),f<6&&l.yieldPhase===0&&(l.yieldPhase=1,l.yieldTime=.7+(l.batchIndex*13+c.v*5)%8*.1),l.yieldPhase===1&&(u=0,c.sp<.7&&(l.yieldTime-=e)<=0&&(l.yieldPhase=2)),r++}if(s){let f=c.g.position.x-i.x,p=c.g.position.z-i.z,m=f*f+p*p;m<324&&(u=Math.min(u,Math.max(0,(Math.sqrt(m)-5)*.8)),a++)}for(let f=0;f<t.cars.length;f++){if(o===f)continue;let p=t.cars[f];if(p.rd!==c.rd||p.dir!==c.dir)continue;let m=c.dir*(p.s-c.s);m>0&&m<20&&(u=Math.min(u,Math.max(0,(m-5)*.85)))}let d=u-c.sp;c.sp+=Math.max(-8*e,Math.min(2.4*e,d)),c.sp<.001&&(c.sp=.001)}this.stats.yielding=r,this.stats.avoiding=a}isSpecial(e){let t=!1;for(let n of e.car.g.children){if(n.name.startsWith("aw:ev"))return 2;(n.name==="aw:ebar"||n.name==="aw:estripe")&&n.visible&&(t=!0)}return t?1:0}renderInstances(){let e=0,t=0,n=Math.max(0,Math.min(1,(Te.value-.3)/.4));this.beamI.value=.42*n;for(let i of this.batches){for(let s of i.cars){let r=s.car,a=this.isSpecial(s);for(let c of s.base)c.visible=a===1&&r.g.visible;let o=!!r.rd&&r.g.visible&&a===0;o?(this.matrix.compose(r.g.position,r.g.quaternion,r.g.scale),e++):this.matrix.copy(this.zero);for(let c of i.parts)c.mesh.setMatrixAt(s.batchIndex,this.matrix);o&&n>.001&&this.beams&&this.beams.setMatrixAt(t++,this.matrix)}for(let s of i.parts)s.mesh.instanceMatrix.needsUpdate=!0,s.name==="light"&&s.mat.emissive?(s.mat.emissive.copy(Zg),s.mat.emissiveIntensity=1+n*5):s.name==="tail"&&s.mat.emissive&&(s.mat.emissive.copy($g),s.mat.emissiveIntensity=1+n*3)}this.beams&&(this.beams.count=t,this.beams.visible=t>0,t&&(this.beams.instanceMatrix.needsUpdate=!0)),this.stats.visible=e,this.stats.beamDraws=t?1:0}update(e){if(!this.amb&&!this.start())return;let t=Math.min(.1,e);this.applyAI(t),this.renderInstances()}};var Iu=[15293275,4034507,15845451,5089640,15303603,15174469,7560626],Tu=[2503749,5588277,14275783,3361897,3224376],Ru=[7290667,9590843,12155220,13998706,15581854],t0=new C(1,0,0),ma=class{constructor(e){A(this,"g",e);A(this,"stats",{pooled:0,visible:0,draws:0,triangles:0,corridors:0});A(this,"amb",null);A(this,"walkers",[]);A(this,"routes",[]);A(this,"group",new ce);A(this,"head");A(this,"torso");A(this,"legs");A(this,"arms");A(this,"meshes");A(this,"root",new P);A(this,"local",new P);A(this,"world",new P);A(this,"pos",new C);A(this,"scale",new C);A(this,"quat",new ae);A(this,"tint",new D);A(this,"scanIn",0);A(this,"lod2");let t=e.real.q.name,n=t==="low"?18:t==="med"?32:48,i=t==="low"?190:250;this.lod2=i*i,this.group.name="aw:pedestrians";let s=new oe({color:16777215}),r=new oe({color:16777215}),a=new oe({color:16777215});this.head=this.mesh(new je(1,6,4),s,n,"heads"),this.torso=this.mesh(new le(1,1,1),r,n,"torsos"),this.legs=this.mesh(new le(1,1,1),a,n*2,"legs"),this.arms=this.mesh(new le(1,1,1),s,n*2,"arms"),this.meshes=[this.head,this.torso,this.legs,this.arms],this.group.add(this.head,this.torso,this.legs,this.arms),e.scene.add(this.group);for(let o=0;o<n;o++)this.walkers.push({road:null,length:0,s:0,dir:o&1?1:-1,side:o&2?1:-1,speed:1.05+o%6*.09,phase:o*2.399963%(Math.PI*2),x:0,y:0,z:0,yaw:0,skin:Ru[o*3%Ru.length],top:Iu[o*5%Iu.length],bottom:Tu[o*7%Tu.length]});this.stats.pooled=n}mesh(e,t,n,i){let s=new me(e,t,n);return s.name=`aw:pedestrians:${i}`,s.instanceMatrix.setUsage($e),s.frustumCulled=!1,s.castShadow=this.g.real.q.name!=="low",s.count=0,s}roadLength(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}inCorridor(e){let t=e.n==="Caya G.F. Betico Croes",n=e.n==="J.E. Irausquin Boulevard";if(!t&&!n)return!1;for(let i=0;i<e.p.length;i++){let s=e.p[i][0],r=e.p[i][1];if(t&&s>-7550&&s<-6450&&Math.abs(r)<350)return!0;let a=s+8220,o=r+5750;if(n&&a*a+o*o<1450*1450)return!0}return!1}scanRoutes(){let e=this.amb;this.routes=[];let t=new Set;for(let n of e.w.regions.values()){let i=n.json?.roads;if(i)for(let s of i){let r=`${s.n}:${s.id}`;s.u||s.p.length<2||t.has(r)||!this.inCorridor(s)||(t.add(r),this.routes.push(s))}}if(this.stats.corridors=this.routes.length,!!this.routes.length)for(let n=0;n<this.walkers.length;n++){let i=this.walkers[n];if(i.road&&this.routes.includes(i.road))continue;let s=this.routes[n%this.routes.length];i.road=s,i.length=this.roadLength(s),i.s=i.length*(n*.61803398875%1*.9+.05),i.side=(n&1?1:-1)*(s.w*.5+1.45)}}sample(e){let t=e.road;if(!t)return!1;let n=0;for(let i=1;i<t.p.length;i++){let s=t.p[i-1][0],r=t.p[i-1][1],a=t.p[i][0]-s,o=t.p[i][1]-r,c=Math.hypot(a,o)||1;if(n+c>=e.s||i===t.p.length-1){let l=Math.max(0,Math.min(1,(e.s-n)/c)),u=a/c,d=o/c;return e.x=s+a*l-d*e.side,e.z=r+o*l+u*e.side,e.y=this.amb.w.surfaceAt(e.x,e.z)+.02,e.yaw=e.dir>0?Math.atan2(u,d):Math.atan2(-u,-d),!0}n+=c}return!1}put(e,t,n,i,s,r,a,o,c){this.pos.set(n,i,s),this.quat.setFromAxisAngle(t0,r),this.scale.set(a,o,c),this.local.compose(this.pos,this.quat,this.scale),this.world.multiplyMatrices(this.root,this.local),e.setMatrixAt(t,this.world)}drawWalker(e,t,n){let i=Math.sin(n*7.2+e.phase),s=Math.abs(i)*.025;this.root.makeRotationY(e.yaw),this.root.setPosition(e.x,e.y+s,e.z),this.put(this.head,t,0,1.77,0,0,.18,.2,.18),this.put(this.torso,t,0,1.29,0,0,.34,.52,.22),this.put(this.legs,t*2,-.14,.64,i*.08,i*.45,.11,.62,.13),this.put(this.legs,t*2+1,.14,.64,-i*.08,-i*.45,.11,.62,.13),this.put(this.arms,t*2,-.43,1.26,0,-i*.5,.08,.48,.09),this.put(this.arms,t*2+1,.43,1.26,0,i*.5,.08,.48,.09),this.head.setColorAt(t,this.tint.setHex(e.skin)),this.torso.setColorAt(t,this.tint.setHex(e.top)),this.legs.setColorAt(t*2,this.tint.setHex(e.bottom)),this.legs.setColorAt(t*2+1,this.tint),this.arms.setColorAt(t*2,this.tint.setHex(e.skin)),this.arms.setColorAt(t*2+1,this.tint)}update(e,t){if(!this.amb){let s=this.g.real.amb;if(!s)return;this.amb=s,this.scanRoutes()}for(;this.amb.peds.length;){let s=this.amb.peds.pop();s.g.visible=!1,s.g.parent?.remove(s.g)}(this.scanIn-=e)<=0&&(this.scanIn=2,this.scanRoutes());let n=this.g.camera.position,i=0;for(let s of this.walkers){if(!s.road||s.length<=0||(s.s+=s.dir*s.speed*e,s.s>=s.length?(s.s=s.length,s.dir=-1):s.s<=0&&(s.s=0,s.dir=1),!this.sample(s)))continue;let r=s.x-n.x,a=s.z-n.z;r*r+a*a>this.lod2||this.drawWalker(s,i++,t)}this.head.count=i,this.torso.count=i,this.legs.count=i*2,this.arms.count=i*2;for(let s of this.meshes)s.count&&(s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0)),s.visible=s.count>0;this.stats.visible=i,this.stats.draws=i?4:0,this.stats.triangles=i*96}};function Aa(h){let e=new Map,t=new Map,n=h.clone();return Bu(h,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,r=e.get(i),a=r.skeleton.bones;s.skeleton=r.skeleton.clone(),s.bindMatrix.copy(r.bindMatrix),s.skeleton.bones=a.map(function(o){return t.get(o)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Bu(h,e,t){t(h,e);for(let n=0;n<h.children.length;n++)Bu(h.children[n],e.children[n],t)}var An=class extends at{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new $c(t)}),this.register(function(t){return new el(t)}),this.register(function(t){return new ll(t)}),this.register(function(t){return new hl(t)}),this.register(function(t){return new ul(t)}),this.register(function(t){return new nl(t)}),this.register(function(t){return new il(t)}),this.register(function(t){return new sl(t)}),this.register(function(t){return new rl(t)}),this.register(function(t){return new Zc(t)}),this.register(function(t){return new al(t)}),this.register(function(t){return new tl(t)}),this.register(function(t){return new cl(t)}),this.register(function(t){return new ol(t)}),this.register(function(t){return new jc(t)}),this.register(function(t){return new ga(t,ne.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new ga(t,ne.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new dl(t)})}load(e,t,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let c=Jt.extractUrlBase(e);r=Jt.resolveURL(c,this.path)}else r=Jt.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},o=new St(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(c){try{s.parse(c,r,function(l){t(l),s.manager.itemEnd(e)},a)}catch(l){a(l)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,r={},a={},o=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(o.decode(new Uint8Array(e,0,4))===Nu){try{r[ne.KHR_BINARY_GLTF]=new fl(e)}catch(u){i&&i(u);return}s=JSON.parse(r[ne.KHR_BINARY_GLTF].content)}else s=JSON.parse(o.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new xl(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let l=0;l<this.pluginCallbacks.length;l++){let u=this.pluginCallbacks[l](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,r[u.name]=!0}if(s.extensionsUsed)for(let l=0;l<s.extensionsUsed.length;++l){let u=s.extensionsUsed[l],d=s.extensionsRequired||[];switch(u){case ne.KHR_MATERIALS_UNLIT:r[u]=new Yc;break;case ne.KHR_DRACO_MESH_COMPRESSION:r[u]=new pl(s,this.dracoLoader);break;case ne.KHR_TEXTURE_TRANSFORM:r[u]=new ml;break;case ne.KHR_MESH_QUANTIZATION:r[u]=new Al;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(r),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function n0(){let h={};return{get:function(e){return h[e]},add:function(e,t){h[e]=t},remove:function(e){delete h[e]},removeAll:function(){h={}}}}function we(h,e,t){let n=h.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var ne={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},jc=class{constructor(e){this.parser=e,this.name=ne.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,o=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,l=new D(16777215);o.color!==void 0&&l.setRGB(o.color[0],o.color[1],o.color[2],He);let u=o.range!==void 0?o.range:0;switch(o.type){case"directional":c=new ls(l),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Pn(l),c.distance=u;break;case"spot":c=new Ln(l),c.distance=u,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,c.angle=o.spot.outerConeAngle,c.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}return c.position.set(0,0,0),Ct(c,o),o.intensity!==void 0&&(c.intensity=o.intensity),c.name=t.createUniqueName(o.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(o){return n._getNodeRef(t.cache,a,o)})}},Yc=class{constructor(){this.name=ne.KHR_MATERIALS_UNLIT}getMaterialType(){return Ce}extendParams(e,t,n){let i=[];e.color=new D(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],He),e.opacity=r[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,re))}return Promise.all(i)}},Zc=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},$c=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new J(s,s)}return Promise.all(i)}},el=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_DISPERSION}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},tl=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},nl=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_SHEEN}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new D(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],He)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,re)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},il=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},sl=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_VOLUME}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new D().setRGB(s[0],s[1],s[2],He),Promise.all(i)}},rl=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_IOR}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},al=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_SPECULAR}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new D().setRGB(s[0],s[1],s[2],He),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,re)),Promise.all(i)}},ol=class{constructor(e){this.parser=e,this.name=ne.EXT_MATERIALS_BUMP}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},cl=class{constructor(e){this.parser=e,this.name=ne.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return we(this.parser,e,this.name)!==null?Ye:null}extendMaterialParams(e,t){let n=we(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},ll=class{constructor(e){this.parser=e,this.name=ne.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,r)}},hl=class{constructor(e){this.parser=e,this.name=ne.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(o=c)}return n.loadTextureImage(e,r.source,o)}},ul=class{constructor(e){this.parser=e,this.name=ne.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(o=c)}return n.loadTextureImage(e,r.source,o)}},ga=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){let o=i.byteOffset||0,c=i.byteLength||0,l=i.count,u=i.byteStride,d=new Uint8Array(a,o,c);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(l,u,d,i.mode,i.filter).then(function(f){return f.buffer}):r.ready.then(function(){let f=new ArrayBuffer(l*u);return r.decodeGltfBuffer(new Uint8Array(f),l,u,d,i.mode,i.filter),f})})}else return null}},dl=class{constructor(e){this.name=ne.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==ct.TRIANGLES&&c.mode!==ct.TRIANGLE_STRIP&&c.mode!==ct.TRIANGLE_FAN&&c.mode!==void 0)return null;let r=n.extensions[this.name].attributes,a=[],o={};for(let c in r)a.push(this.parser.getDependency("accessor",r[c]).then(l=>(o[c]=l,o[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let l=c.pop(),u=l.isGroup?l.children:[l],d=c[0].count,f=[];for(let p of u){let m=new P,g=new C,b=new ae,_=new C(1,1,1),v=new me(p.geometry,p.material,d);for(let y=0;y<d;y++)o.TRANSLATION&&g.fromBufferAttribute(o.TRANSLATION,y),o.ROTATION&&b.fromBufferAttribute(o.ROTATION,y),o.SCALE&&_.fromBufferAttribute(o.SCALE,y),v.setMatrixAt(y,m.compose(g,b,_));let x=null;for(let y in o)if(y==="_COLOR_0"){let w=o[y];v.instanceColor=new Ge(w.array,w.itemSize,w.normalized)}else if(y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"){if(x===null){let E=v.geometry;x=new K,x.name=E.name;for(let M in E.attributes)x.setAttribute(M,E.attributes[M]);for(let M in E.morphAttributes)x.morphAttributes[M]=E.morphAttributes[M];E.index!==null&&x.setIndex(E.index),x.morphTargetsRelative=E.morphTargetsRelative;for(let M of E.groups)x.addGroup(M.start,M.count,M.materialIndex);E.boundingBox!==null&&(x.boundingBox=E.boundingBox.clone()),E.boundingSphere!==null&&(x.boundingSphere=E.boundingSphere.clone()),x.drawRange.start=E.drawRange.start,x.drawRange.count=E.drawRange.count,x.userData=Object.assign({},E.userData),v.geometry=x}let w=o[y];x.setAttribute(y,new Ge(w.array,w.itemSize,w.normalized))}ge.prototype.copy.call(v,p),this.parser.assignFinalMaterial(v),f.push(v)}return l.isGroup?(l.clear(),l.add(...f),l):f[0]}))}},Nu="glTF",Ms=12,Du={JSON:1313821514,BIN:5130562},fl=class{constructor(e){this.name=ne.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ms),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Nu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Ms,s=new DataView(e,Ms),r=0;for(;r<i;){let a=s.getUint32(r,!0);r+=4;let o=s.getUint32(r,!0);if(r+=4,o===Du.JSON){let c=new Uint8Array(e,Ms+r,a);this.content=n.decode(c)}else if(o===Du.BIN){let c=Ms+r;this.body=e.slice(c,c+a)}r+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},pl=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ne.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,a={},o={},c={};for(let l in r){let u=bl[l]||l.toLowerCase();a[u]=r[l]}for(let l in e.attributes){let u=bl[l]||l.toLowerCase();if(r[l]!==void 0){let d=n.accessors[e.attributes[l]],f=yi[d.componentType];c[u]=f.name,o[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(l){return new Promise(function(u,d){i.decodeDracoFile(l,function(f){for(let p in f.attributes){let m=f.attributes[p],g=o[p];g!==void 0&&(m.normalized=g)}u(f)},a,c,He,d)})})}},ml=class{constructor(){this.name=ne.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Al=class{constructor(){this.name=ne.KHR_MESH_QUANTIZATION}},ba=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)t[r]=n[s+r];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=a*2,c=a*3,l=i-t,u=(n-t)/l,d=u*u,f=d*u,p=e*c,m=p-c,g=-2*f+3*d,b=f-d,_=1-g,v=b-d+u;for(let x=0;x!==a;x++){let y=r[m+x+a],w=r[m+x+o]*l,E=r[p+x+a],M=r[p+x]*l;s[x]=_*y+v*w+g*E+b*M}return s}},i0=new ae,gl=class extends ba{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return i0.fromArray(s).normalize().toArray(s),s}},ct={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},yi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Fu={9728:mt,9729:Pe,9984:ps,9985:dc,9986:uc,9987:bt},Lu={33071:kt,33648:qi,10497:Qt},Kc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},bl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},mn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},s0={CUBICSPLINE:void 0,LINEAR:Cn,STEP:Sn},Xc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function r0(h){return h.DefaultMaterial===void 0&&(h.DefaultMaterial=new Ee({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:fs})),h.DefaultMaterial}function Gn(h,e,t){for(let n in t.extensions)h[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ct(h,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(h.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function a0(h,e,t){let n=!1,i=!1,s=!1;for(let c=0,l=e.length;c<l;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(h);let r=[],a=[],o=[];for(let c=0,l=e.length;c<l;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):h.attributes.position;r.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):h.attributes.normal;a.push(d)}if(s){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):h.attributes.color;o.push(d)}}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o)]).then(function(c){let l=c[0],u=c[1],d=c[2];return n&&(h.morphAttributes.position=l),i&&(h.morphAttributes.normal=u),s&&(h.morphAttributes.color=d),h.morphTargetsRelative=!0,h})}function o0(h,e){if(h.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)h.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(h.morphTargetInfluences.length===t.length){h.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)h.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function c0(h){let e,t=h.extensions&&h.extensions[ne.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Jc(t.attributes):e=h.indices+":"+Jc(h.attributes)+":"+h.mode,h.targets!==void 0)for(let n=0,i=h.targets.length;n<i;n++)e+=":"+Jc(h.targets[n]);return e}function Jc(h){let e="",t=Object.keys(h).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+h[t[n]]+";";return e}function _l(h){switch(h){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function l0(h){return h.search(/\.jpe?g($|\?)/i)>0||h.search(/^data\:image\/jpeg/)===0?"image/jpeg":h.search(/\.webp($|\?)/i)>0||h.search(/^data\:image\/webp/)===0?"image/webp":h.search(/\.ktx2($|\?)/i)>0||h.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var h0=new P,xl=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new n0,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let o=a.match(/Version\/(\d+)/);i=n&&o?parseInt(o[1],10):-1,s=a.indexOf("Firefox")>-1,r=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&r<98?this.textureLoader=new fn(this.options.manager):this.textureLoader=new us(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new St(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let a={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return Gn(s,a,i),Ct(a,i),Promise.all(n._invokeAll(function(o){return o.afterRoot&&o.afterRoot(a)})).then(function(){for(let o of a.scenes)o.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i].joints;for(let a=0,o=r.length;a<o;a++)e[r[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(r,a)=>{let o=this.associations.get(r);o!=null&&this.associations.set(a,o);for(let[c,l]of r.children.entries())s(l,a.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ne.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(Jt.resolveURL(t.uri,i.path),s,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=Kc[i.type],a=yi[i.componentType],o=i.normalized===!0,c=new a(i.count*r);return Promise.resolve(new H(c,r,o))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(r){let a=r[0],o=Kc[i.type],c=yi[i.componentType],l=c.BYTES_PER_ELEMENT,u=l*o,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,m,g;if(f&&f!==u){let b=Math.floor(d/f),_="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+b+":"+i.count,v=t.cache.get(_);v||(m=new c(a,b*f,i.count*f/l),v=new In(m,f/l),t.cache.add(_,v)),g=new cn(v,o,d%f/l,p)}else a===null?m=new c(i.count*o):m=new c(a,d,i.count*o),g=new H(m,o,p);if(i.sparse!==void 0){let b=Kc.SCALAR,_=yi[i.sparse.indices.componentType],v=i.sparse.indices.byteOffset||0,x=i.sparse.values.byteOffset||0,y=new _(r[1],v,i.sparse.count*b),w=new c(r[2],x,i.sparse.count*o);a!==null&&(g=new H(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let E=0,M=y.length;E<M;E++){let S=y[E];if(g.setX(S,w[E*o]),o>=2&&g.setY(S,w[E*o+1]),o>=3&&g.setZ(S,w[E*o+2]),o>=4&&g.setW(S,w[E*o+3]),o>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,r=t.images[s],a=this.textureLoader;if(r.uri){let o=n.manager.getHandler(r.uri);o!==null&&(a=o)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){let i=this,s=this.json,r=s.textures[e],a=s.images[t],o=(a.uri||a.bufferView)+":"+r.sampler;if(this.textureCache[o])return this.textureCache[o];let c=this.loadImageSource(t,n).then(function(l){l.flipY=!1,l.name=r.name||a.name||"",l.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(l.name=a.uri);let d=(s.samplers||{})[r.sampler]||{};return l.magFilter=Fu[d.magFilter]||Pe,l.minFilter=Fu[d.minFilter]||bt,l.wrapS=Lu[d.wrapS]||Qt,l.wrapT=Lu[d.wrapT]||Qt,l.generateMipmaps=!l.isCompressedTexture&&l.minFilter!==mt&&l.minFilter!==Pe,i.associations.set(l,{textures:e}),l}).catch(function(){return null});return this.textureCache[o]=c,c}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let r=i.images[e],a=self.URL||self.webkitURL,o=r.uri||"",c=!1;if(r.bufferView!==void 0)o=n.getDependency("bufferView",r.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:r.mimeType});return o=a.createObjectURL(d),o});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let l=Promise.resolve(o).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(m){let g=new Oe(m);g.needsUpdate=!0,d(g)}),t.load(Jt.resolveURL(u,s.path),p,void 0,f)})}).then(function(u){return c===!0&&a.revokeObjectURL(o),Ct(u,r),u.userData.mimeType=r.mimeType||l0(r.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),u});return this.sourceCache[e]=l,l}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),s.extensions[ne.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[ne.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let o=s.associations.get(r);r=s.extensions[ne.KHR_TEXTURE_TRANSFORM].extendTexture(r,a),s.associations.set(r,o)}}return i!==void 0&&(r.colorSpace=i),e[t]=r,r})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,o=this.cache.get(a);o||(o=new hn,Ve.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,o.sizeAttenuation=!1,this.cache.add(a,o)),n=o}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,o=this.cache.get(a);o||(o=new mi,Ve.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,this.cache.add(a,o)),n=o}if(i||s||r){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),r&&(a+="flat-shading:");let o=this.cache.get(a);o||(o=n.clone(),s&&(o.vertexColors=!0),r&&(o.flatShading=!0),i&&(o.normalScale&&(o.normalScale.y*=-1),o.clearcoatNormalScale&&(o.clearcoatNormalScale.y*=-1)),this.cache.add(a,o),this.associations.set(o,this.associations.get(n))),n=o}e.material=n}getMaterialType(){return Ee}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],r,a={},o=s.extensions||{},c=[];if(o[ne.KHR_MATERIALS_UNLIT]){let u=i[ne.KHR_MATERIALS_UNLIT];r=u.getMaterialType(),c.push(u.extendParams(a,s,t))}else{let u=s.pbrMetallicRoughness||{};if(a.color=new D(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],He),a.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",u.baseColorTexture,re)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=We);let l=s.alphaMode||Xc.OPAQUE;if(l===Xc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,l===Xc.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&r!==Ce&&(c.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new J(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;a.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&r!==Ce&&(c.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&r!==Ce){let u=s.emissiveFactor;a.emissive=new D().setRGB(u[0],u[1],u[2],He)}return s.emissiveTexture!==void 0&&r!==Ce&&c.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,re)),Promise.all(c).then(function(){let u=new r(a);return s.name&&(u.name=s.name),Ct(u,s),t.associations.set(u,{materials:e}),s.extensions&&Gn(i,u,s),u})}createUniqueName(e){let t=fe.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[ne.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(o){return Pu(o,a,t)})}let r=[];for(let a=0,o=e.length;a<o;a++){let c=e[a],l=c0(c),u=i[l];if(u)r.push(u.promise);else{let d;c.extensions&&c.extensions[ne.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Pu(new K,c,t),c.mode===ct.TRIANGLE_STRIP?d=d.then(f=>Hc(f,vs)):c.mode===ct.TRIANGLE_FAN&&(d=d.then(f=>Hc(f,_i))),i[l]={primitive:c,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,a=[];for(let o=0,c=r.length;o<c;o++){let l=r[o].material===void 0?r0(this.cache):this.getDependency("material",r[o].material);a.push(l)}return a.push(t.loadGeometries(r)),Promise.all(a).then(async function(o){let c=o.slice(0,o.length-1),l=o[o.length-1],u=[];for(let f=0,p=l.length;f<p;f++){let m=l[f],g=r[f],b,_=c[f];if(g.mode===ct.TRIANGLES||g.mode===ct.TRIANGLE_STRIP||g.mode===ct.TRIANGLE_FAN||g.mode===void 0){let v=s.isSkinnedMesh===!0,x=m.hasAttribute("skinIndex")&&m.hasAttribute("skinWeight");v&&x===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),b=v&&x?new fi(m,_):new q(m,_),b.isSkinnedMesh===!0&&b.normalizeSkinWeights()}else if(g.mode===ct.LINES)b=new es(m,_);else if(g.mode===ct.LINE_STRIP)b=new Rn(m,_);else if(g.mode===ct.LINE_LOOP)b=new ts(m,_);else if(g.mode===ct.POINTS)b=new At(m,_);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(b.geometry.morphAttributes).length>0&&o0(b,s),b.name=t.createUniqueName(s.name||"mesh_"+e),Ct(b,s),g.extensions&&Gn(i,b,g),t.assignFinalMaterial(b),u.push(b)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&Gn(i,u[0],s),u[0];let d=new ce;s.extensions&&Gn(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Fn(Ic.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new gi(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ct(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),r=i,a=[],o=[];for(let c=0,l=r.length;c<l;c++){let u=r[c];if(u){a.push(u);let d=new P;s!==null&&d.fromArray(s.array,c*16),o.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new $i(a,o)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,r=[],a=[],o=[],c=[],l=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],p=i.samplers[f.sampler],m=f.target,g=m.node,b=i.parameters!==void 0?i.parameters[p.input]:p.input,_=i.parameters!==void 0?i.parameters[p.output]:p.output;m.node!==void 0&&(r.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",b)),o.push(this.getDependency("accessor",_)),c.push(p),l.push(m))}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l)]).then(function(u){let d=u[0],f=u[1],p=u[2],m=u[3],g=u[4],b=[];for(let v=0,x=d.length;v<x;v++){let y=d[v],w=f[v],E=p[v],M=m[v],S=g[v];if(y===void 0)continue;y.updateMatrix&&y.updateMatrix();let T=n._createAnimationTracks(y,w,E,M,S);if(T)for(let I=0;I<T.length;I++)b.push(T[I])}let _=new Bn(s,void 0,b);return Ct(_,i),_})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&r.traverse(function(a){if(a.isMesh)for(let o=0,c=i.weights.length;o<c;o++)a.morphTargetInfluences[o]=i.weights[o]}),r})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),r=[],a=i.children||[];for(let c=0,l=a.length;c<l;c++)r.push(n.getDependency("node",a[c]));let o=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),o]).then(function(c){let l=c[0],u=c[1],d=c[2];d!==null&&l.traverse(function(f){f.isSkinnedMesh&&f.bind(d,h0)});for(let f=0,p=u.length;f<p;f++)l.add(u[f]);if(l.userData.pivot!==void 0&&u.length>0){let f=l.userData.pivot,p=u[0];l.pivot=new C().fromArray(f),l.position.x-=f[0],l.position.y-=f[1],l.position.z-=f[2],p.position.set(0,0,0),delete l.userData.pivot}return l})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],r=s.name?i.createUniqueName(s.name):"",a=[],o=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return o&&a.push(o),s.camera!==void 0&&a.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let l;if(s.isBone===!0?l=new pi:c.length>1?l=new ce:c.length===1?l=c[0]:l=new ge,l!==c[0])for(let u=0,d=c.length;u<d;u++)l.add(c[u]);if(s.name&&(l.userData.name=s.name,l.name=r),Ct(l,s),s.extensions&&Gn(n,l,s),s.matrix!==void 0){let u=new P;u.fromArray(s.matrix),l.applyMatrix4(u)}else s.translation!==void 0&&l.position.fromArray(s.translation),s.rotation!==void 0&&l.quaternion.fromArray(s.rotation),s.scale!==void 0&&l.scale.fromArray(s.scale);if(!i.associations.has(l))i.associations.set(l,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let u=i.associations.get(l);i.associations.set(l,{...u})}return i.associations.get(l).nodes=e,l}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new ce;n.name&&(s.name=i.createUniqueName(n.name)),Ct(s,n),n.extensions&&Gn(t,s,n);let r=n.nodes||[],a=[];for(let o=0,c=r.length;o<c;o++)a.push(i.getDependency("node",r[o]));return Promise.all(a).then(function(o){for(let l=0,u=o.length;l<u;l++){let d=o[l];d.parent!==null?s.add(Aa(d)):s.add(d)}let c=l=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof Ve||d instanceof Oe)&&u.set(d,f);return l.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){let r=[],a=e.name?e.name:e.uuid,o=[];function c(f){f.morphTargetInfluences&&o.push(f.name?f.name:f.uuid)}mn[s.path]===mn.weights?(c(e),e.isGroup&&e.children.forEach(c)):o.push(a);let l;switch(mn[s.path]){case mn.weights:l=qt;break;case mn.rotation:l=Kt;break;case mn.translation:case mn.scale:l=dn;break;default:n.itemSize===1?l=qt:l=dn;break}let u=i.interpolation!==void 0?s0[i.interpolation]:Cn,d=this._getArrayFromAccessor(n);for(let f=0,p=o.length;f<p;f++){let m=new l(o[f]+"."+mn[s.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),r.push(m)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=_l(t.constructor),i=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Kt?gl:ba;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function u0(h,e,t){let n=e.attributes,i=new ye;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],o=a.min,c=a.max;if(o!==void 0&&c!==void 0){if(i.set(new C(o[0],o[1],o[2]),new C(c[0],c[1],c[2])),a.normalized){let l=_l(yi[a.componentType]);i.min.multiplyScalar(l),i.max.multiplyScalar(l)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let a=new C,o=new C;for(let c=0,l=s.length;c<l;c++){let u=s[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(o.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),o.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),o.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let m=_l(yi[d.componentType]);o.multiplyScalar(m)}a.max(o)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}h.boundingBox=i;let r=new be;i.getCenter(r.center),r.radius=i.min.distanceTo(i.max)/2,h.boundingSphere=r}function Pu(h,e,t){let n=e.attributes,i=[];function s(r,a){return t.getDependency("accessor",r).then(function(o){h.setAttribute(a,o)})}for(let r in n){let a=bl[r]||r.toLowerCase();a in h.attributes||i.push(s(n[r],a))}if(e.indices!==void 0&&!h.index){let r=t.getDependency("accessor",e.indices).then(function(a){h.setIndex(a)});i.push(r)}return De.workingColorSpace!==He&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${De.workingColorSpace}" not supported.`),Ct(h,e),u0(h,e,t),Promise.all(i).then(function(){return e.targets!==void 0?a0(h,e.targets,t):h})}var _a=class{constructor(e=4){this.pool=e,this.queue=[],this.workers=[],this.workersResolve=[],this.workerStatus=0,this.workerCreator=null}_initWorker(e){if(!this.workers[e]){let t=this.workerCreator();t.addEventListener("message",this._onMessage.bind(this,e)),this.workers[e]=t}}_getIdleWorker(){for(let e=0;e<this.pool;e++)if(!(this.workerStatus&1<<e))return e;return-1}_onMessage(e,t){let n=this.workersResolve[e];if(n&&n(t),this.queue.length){let{resolve:i,msg:s,transfer:r}=this.queue.shift();this.workersResolve[e]=i,this.workers[e].postMessage(s,r)}else this.workerStatus^=1<<e}setWorkerCreator(e){this.workerCreator=e}setWorkerLimit(e){this.pool=e}postMessage(e,t){return new Promise(n=>{let i=this._getIdleWorker();i!==-1?(this._initWorker(i),this.workerStatus|=1<<i,this.workersResolve[i]=n,this.workers[i].postMessage(e,t)):this.queue.push({resolve:n,msg:e,transfer:t})})}dispose(){this.workers.forEach(e=>e.terminate()),this.workersResolve.length=0,this.workers.length=0,this.queue.length=0,this.workerStatus=0}};var Qn=class{constructor(e,t,n,i){this._dataView=void 0,this._littleEndian=void 0,this._offset=void 0,this._dataView=new DataView(e.buffer,e.byteOffset+t,n),this._littleEndian=i,this._offset=0}_nextUint8(){let e=this._dataView.getUint8(this._offset);return this._offset+=1,e}_nextUint16(){let e=this._dataView.getUint16(this._offset,this._littleEndian);return this._offset+=2,e}_nextUint32(){let e=this._dataView.getUint32(this._offset,this._littleEndian);return this._offset+=4,e}_nextUint64(){let e=this._dataView.getUint32(this._offset,this._littleEndian)+4294967296*this._dataView.getUint32(this._offset+4,this._littleEndian);return this._offset+=8,e}_nextInt32(){let e=this._dataView.getInt32(this._offset,this._littleEndian);return this._offset+=4,e}_nextUint8Array(e){let t=new Uint8Array(this._dataView.buffer,this._dataView.byteOffset+this._offset,e);return this._offset+=e,t}_skip(e){return this._offset+=e,this}_scan(e,t=0){let n=this._offset,i=0;for(;this._dataView.getUint8(this._offset)!==t&&i<e;)i++,this._offset++;return i<e&&this._offset++,new Uint8Array(this._dataView.buffer,this._dataView.byteOffset+n,i)}},dM=new Uint8Array([0]),Ke=[171,75,84,88,32,50,48,187,13,10,26,10];function Uu(h){return new TextDecoder().decode(h)}function ku(h){let e=new Uint8Array(h.buffer,h.byteOffset,Ke.length);if(e[0]!==Ke[0]||e[1]!==Ke[1]||e[2]!==Ke[2]||e[3]!==Ke[3]||e[4]!==Ke[4]||e[5]!==Ke[5]||e[6]!==Ke[6]||e[7]!==Ke[7]||e[8]!==Ke[8]||e[9]!==Ke[9]||e[10]!==Ke[10]||e[11]!==Ke[11])throw new Error("Missing KTX 2.0 identifier.");let t={vkFormat:0,typeSize:1,pixelWidth:0,pixelHeight:0,pixelDepth:0,layerCount:0,faceCount:1,levelCount:0,supercompressionScheme:0,levels:[],dataFormatDescriptor:[{vendorId:0,descriptorType:0,versionNumber:2,colorModel:0,colorPrimaries:1,transferFunction:2,flags:0,texelBlockDimension:[0,0,0,0],bytesPlane:[0,0,0,0,0,0,0,0],samples:[]}],keyValue:{},globalData:null},n=17*Uint32Array.BYTES_PER_ELEMENT,i=new Qn(h,Ke.length,n,!0);t.vkFormat=i._nextUint32(),t.typeSize=i._nextUint32(),t.pixelWidth=i._nextUint32(),t.pixelHeight=i._nextUint32(),t.pixelDepth=i._nextUint32(),t.layerCount=i._nextUint32(),t.faceCount=i._nextUint32(),t.levelCount=i._nextUint32(),t.supercompressionScheme=i._nextUint32();let s=i._nextUint32(),r=i._nextUint32(),a=i._nextUint32(),o=i._nextUint32(),c=i._nextUint64(),l=i._nextUint64(),u=3*Math.max(t.levelCount,1)*8,d=new Qn(h,Ke.length+n,u,!0);for(let O=0,Q=Math.max(t.levelCount,1);O<Q;O++)t.levels.push({levelData:new Uint8Array(h.buffer,h.byteOffset+d._nextUint64(),d._nextUint64()),uncompressedByteLength:d._nextUint64()});let f=new Qn(h,s,r,!0);f._skip(4);let p=f._nextUint16(),m=f._nextUint16(),g=f._nextUint16(),b=f._nextUint16(),_={vendorId:p,descriptorType:m,versionNumber:g,colorModel:f._nextUint8(),colorPrimaries:f._nextUint8(),transferFunction:f._nextUint8(),flags:f._nextUint8(),texelBlockDimension:[f._nextUint8(),f._nextUint8(),f._nextUint8(),f._nextUint8()],bytesPlane:[f._nextUint8(),f._nextUint8(),f._nextUint8(),f._nextUint8(),f._nextUint8(),f._nextUint8(),f._nextUint8(),f._nextUint8()],samples:[]},v=(b/4-6)/4;for(let O=0;O<v;O++){let Q={bitOffset:f._nextUint16(),bitLength:f._nextUint8(),channelType:f._nextUint8(),samplePosition:[f._nextUint8(),f._nextUint8(),f._nextUint8(),f._nextUint8()],sampleLower:Number.NEGATIVE_INFINITY,sampleUpper:Number.POSITIVE_INFINITY};64&Q.channelType?(Q.sampleLower=f._nextInt32(),Q.sampleUpper=f._nextInt32()):(Q.sampleLower=f._nextUint32(),Q.sampleUpper=f._nextUint32()),_.samples[O]=Q}t.dataFormatDescriptor.length=0,t.dataFormatDescriptor.push(_);let x=new Qn(h,a,o,!0);for(;x._offset<o;){let O=x._nextUint32(),Q=x._scan(O),$=Uu(Q);if(t.keyValue[$]=x._nextUint8Array(O-Q.byteLength-1),$.match(/^ktx/i)){let se=Uu(t.keyValue[$]);t.keyValue[$]=se.substring(0,se.lastIndexOf("\0"))}x._skip(O%4?4-O%4:0)}if(l<=0)return t;let y=new Qn(h,c,l,!0),w=y._nextUint16(),E=y._nextUint16(),M=y._nextUint32(),S=y._nextUint32(),T=y._nextUint32(),I=y._nextUint32(),R=[];for(let O=0,Q=Math.max(t.levelCount,1);O<Q;O++)R.push({imageFlags:y._nextUint32(),rgbSliceByteOffset:y._nextUint32(),rgbSliceByteLength:y._nextUint32(),alphaSliceByteOffset:y._nextUint32(),alphaSliceByteLength:y._nextUint32()});let B=c+y._offset,F=B+M,L=F+S,N=L+T,z=new Uint8Array(h.buffer,h.byteOffset+B,M),G=new Uint8Array(h.buffer,h.byteOffset+F,S),V=new Uint8Array(h.buffer,h.byteOffset+L,T),W=new Uint8Array(h.buffer,h.byteOffset+N,I);return t.globalData={endpointCount:w,selectorCount:E,imageDescs:R,endpointsData:z,selectorsData:G,tablesData:V,extendedData:W},t}var vl,Zt,wl,yl={env:{emscripten_notify_memory_growth:function(h){wl=new Uint8Array(Zt.exports.memory.buffer)}}},xa=class{init(){return vl||(vl=typeof fetch<"u"?fetch("data:application/wasm;base64,"+Ou).then(e=>e.arrayBuffer()).then(e=>WebAssembly.instantiate(e,yl)).then(this._init):WebAssembly.instantiate(Buffer.from(Ou,"base64"),yl).then(this._init),vl)}_init(e){Zt=e.instance,yl.env.emscripten_notify_memory_growth(0)}decode(e,t=0){if(!Zt)throw new Error("ZSTDDecoder: Await .init() before decoding.");let n=e.byteLength,i=Zt.exports.malloc(n);wl.set(e,i),t=t||Number(Zt.exports.ZSTD_findDecompressedSize(i,n));let s=Zt.exports.malloc(t),r=Zt.exports.ZSTD_decompress(s,t,i,n),a=wl.slice(s,s+r);return Zt.exports.free(i),Zt.exports.free(s),a}},Ou="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IAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQh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ASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigC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C0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdB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IAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY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wOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEE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";var Gu="display-p3",Qu="display-p3-linear";var AM={...De.spaces[re],outputColorSpaceConfig:{drawingBufferColorSpace:re,toneMappingMode:"extended"}};var b0=new URL("../libs/basis/basis_transcoder.wasm",import.meta.url).toString(),_0=new URL("../libs/basis/basis_transcoder.js",import.meta.url).toString(),Ml=new WeakMap,El=0,Sl,$t=class h extends at{constructor(e){super(e),this.transcoderPath="",this.transcoderBinary=null,this.transcoderPending=null,this.workerPool=new _a,this.workerSourceURL="",this.workerConfig=null,typeof MSC_TRANSCODER<"u"&&console.warn('THREE.KTX2Loader: Please update to latest "basis_transcoder". "msc_basis_transcoder" is no longer supported in three.js r125+.')}setTranscoderPath(e){return this.transcoderPath=e,this}setWorkerLimit(e){return this.workerPool.setWorkerLimit(e),this}async detectSupportAsync(e){return console.warn('KTX2Loader: "detectSupportAsync()" has been deprecated. Use "detectSupport()" and "await renderer.init();" when creating the renderer.'),await e.init(),this.detectSupport(e)}detectSupport(e){return e.isWebGPURenderer===!0?this.workerConfig={astcSupported:e.hasFeature("texture-compression-astc"),astcHDRSupported:!1,etc1Supported:e.hasFeature("texture-compression-etc1"),etc2Supported:e.hasFeature("texture-compression-etc2"),dxtSupported:e.hasFeature("texture-compression-s3tc"),bptcSupported:e.hasFeature("texture-compression-bc"),pvrtcSupported:e.hasFeature("texture-compression-pvrtc")}:(this.workerConfig={astcSupported:e.extensions.has("WEBGL_compressed_texture_astc"),astcHDRSupported:e.extensions.has("WEBGL_compressed_texture_astc")&&e.extensions.get("WEBGL_compressed_texture_astc").getSupportedProfiles().includes("hdr"),etc1Supported:e.extensions.has("WEBGL_compressed_texture_etc1"),etc2Supported:e.extensions.has("WEBGL_compressed_texture_etc"),dxtSupported:e.extensions.has("WEBGL_compressed_texture_s3tc"),bptcSupported:e.extensions.has("EXT_texture_compression_bptc"),pvrtcSupported:e.extensions.has("WEBGL_compressed_texture_pvrtc")||e.extensions.has("WEBKIT_WEBGL_compressed_texture_pvrtc")},typeof navigator<"u"&&typeof navigator.platform<"u"&&typeof navigator.userAgent<"u"&&navigator.platform.indexOf("Linux")>=0&&navigator.userAgent.indexOf("Android")<0&&this.workerConfig.astcSupported&&this.workerConfig.etc2Supported&&this.workerConfig.bptcSupported&&this.workerConfig.dxtSupported&&(this.workerConfig.astcSupported=!1,this.workerConfig.etc1Supported=!1,this.workerConfig.etc2Supported=!1)),this}init(){if(!this.transcoderPending){let e=new St(this.manager);e.setWithCredentials(this.withCredentials);let t=new St(this.manager);t.setWithCredentials(this.withCredentials),t.setResponseType("arraybuffer");let n,i;this.transcoderPath===""?(n=e.loadAsync(_0),i=t.loadAsync(b0)):(e.setPath(this.transcoderPath),n=e.loadAsync("basis_transcoder.js"),t.setPath(this.transcoderPath),i=t.loadAsync("basis_transcoder.wasm")),this.transcoderPending=Promise.all([n,i]).then(([s,r])=>{let a=h.BasisWorker.toString(),o=["/* constants */","let _EngineFormat = "+JSON.stringify(h.EngineFormat),"let _EngineType = "+JSON.stringify(h.EngineType),"let _TranscoderFormat = "+JSON.stringify(h.TranscoderFormat),"let _BasisFormat = "+JSON.stringify(h.BasisFormat),"/* basis_transcoder.js */",s,"/* worker */",a.substring(a.indexOf("{")+1,a.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([o])),this.transcoderBinary=r,this.workerPool.setWorkerCreator(()=>{let c=new Worker(this.workerSourceURL),l=this.transcoderBinary.slice(0);return c.postMessage({type:"init",config:this.workerConfig,transcoderBinary:l},[l]),c})}),El>0&&console.warn("THREE.KTX2Loader: Multiple active KTX2 loaders may cause performance issues. Use a single KTX2Loader instance, or call .dispose() on old instances."),El++}return this.transcoderPending}load(e,t,n,i){if(this.workerConfig===null)throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");let s=new St(this.manager);s.setPath(this.path),s.setCrossOrigin(this.crossOrigin),s.setWithCredentials(this.withCredentials),s.setRequestHeader(this.requestHeader),s.setResponseType("arraybuffer"),s.load(e,r=>{this.parse(r,t,i)},n,i)}parse(e,t,n){if(this.workerConfig===null)throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");if(Ml.has(e))return Ml.get(e).promise.then(t).catch(n);this._createTexture(e).then(i=>t?t(i):null).catch(n)}_createTextureFrom(e,t){let{type:n,error:i,data:{faces:s,width:r,height:a,format:o,type:c,dfdFlags:l}}=e;if(n==="error")return Promise.reject(i);let u;if(t.faceCount===6)u=new is(s,o,c);else{let d=s[0].mipmaps;u=t.layerCount>1?new ns(d,r,a,t.layerCount,o,c):new un(d,r,a,o,c)}return u.minFilter=s[0].mipmaps.length===1?Pe:bt,u.magFilter=Pe,u.generateMipmaps=!1,u.needsUpdate=!0,u.colorSpace=Bd(t),u.premultiplyAlpha=!!(l&1),u}async _createTexture(e,t={}){let n=ku(new Uint8Array(e)),i=n.vkFormat===1000066e3&&n.dataFormatDescriptor[0].colorModel===167;if(!(n.vkFormat===0||i&&!this.workerConfig.astcHDRSupported))return y0(n);let r=t,a=this.init().then(()=>this.workerPool.postMessage({type:"transcode",buffer:e,taskConfig:r},[e])).then(o=>this._createTextureFrom(o.data,n));return Ml.set(e,{promise:a}),a}dispose(){this.workerPool.dispose(),this.workerSourceURL&&URL.revokeObjectURL(this.workerSourceURL),El--}};$t.BasisFormat={ETC1S:0,UASTC:1,UASTC_HDR:2};$t.TranscoderFormat={ETC1:0,ETC2:1,BC1:2,BC3:3,BC4:4,BC5:5,BC7_M6_OPAQUE_ONLY:6,BC7_M5:7,PVRTC1_4_RGB:8,PVRTC1_4_RGBA:9,ASTC_4x4:10,ATC_RGB:11,ATC_RGBA_INTERPOLATED_ALPHA:12,RGBA32:13,RGB565:14,BGR565:15,RGBA4444:16,BC6H:22,RGB_HALF:24,RGBA_HALF:25};$t.EngineFormat={RGBAFormat:Le,RGBA_ASTC_4x4_Format:bi,RGB_BPTC_UNSIGNED_Format:_c,RGBA_BPTC_Format:xs,RGBA_ETC2_EAC_Format:Kr,RGBA_PVRTC_4BPPV1_Format:bs,RGBA_S3TC_DXT5_Format:gs,RGB_ETC1_Format:pc,RGB_ETC2_Format:qr,RGB_PVRTC_4BPPV1_Format:fc,RGBA_S3TC_DXT1_Format:As};$t.EngineType={UnsignedByteType:ee,HalfFloatType:jt,FloatType:rt};$t.BasisWorker=function(){let h,e,t,n=_EngineFormat,i=_EngineType,s=_TranscoderFormat,r=_BasisFormat;self.addEventListener("message",function(p){let m=p.data;switch(m.type){case"init":h=m.config,a(m.transcoderBinary);break;case"transcode":e.then(()=>{try{let{faces:g,buffers:b,width:_,height:v,hasAlpha:x,format:y,type:w,dfdFlags:E}=o(m.buffer);self.postMessage({type:"transcode",id:m.id,data:{faces:g,width:_,height:v,hasAlpha:x,format:y,type:w,dfdFlags:E}},b)}catch(g){console.error(g),self.postMessage({type:"error",id:m.id,error:g.message})}});break}});function a(p){e=new Promise(m=>{t={wasmBinary:p,onRuntimeInitialized:m},BASIS(t)}).then(()=>{t.initializeBasis(),t.KTX2File===void 0&&console.warn("THREE.KTX2Loader: Please update Basis Universal transcoder.")})}function o(p){let m=new t.KTX2File(new Uint8Array(p));function g(){m.close(),m.delete()}if(!m.isValid())throw g(),new Error("THREE.KTX2Loader:	Invalid or unsupported .ktx2 file");let b;if(m.isUASTC())b=r.UASTC;else if(m.isETC1S())b=r.ETC1S;else if(m.isHDR())b=r.UASTC_HDR;else throw new Error("THREE.KTX2Loader: Unknown Basis encoding");let _=m.getWidth(),v=m.getHeight(),x=m.getLayers()||1,y=m.getLevels(),w=m.getFaces(),E=m.getHasAlpha(),M=m.getDFDFlags(),{transcoderFormat:S,engineFormat:T,engineType:I}=u(b,_,v,E);if(!_||!v||!y)throw g(),new Error("THREE.KTX2Loader:	Invalid texture");if(!m.startTranscoding())throw g(),new Error("THREE.KTX2Loader: .startTranscoding failed");let R=[],B=[];for(let F=0;F<w;F++){let L=[];for(let N=0;N<y;N++){let z=[],G,V;for(let O=0;O<x;O++){let Q=m.getImageLevelInfo(N,O,F);F===0&&N===0&&O===0&&(Q.origWidth%4!==0||Q.origHeight%4!==0)&&console.warn("THREE.KTX2Loader: ETC1S and UASTC textures should use multiple-of-four dimensions."),y>1?(G=Q.origWidth,V=Q.origHeight):(G=Q.width,V=Q.height);let $=new Uint8Array(m.getImageTranscodedSizeInBytes(N,O,0,S)),se=m.transcodeImage($,N,O,F,S,0,-1,-1);if(I===i.HalfFloatType&&($=new Uint16Array($.buffer,$.byteOffset,$.byteLength/Uint16Array.BYTES_PER_ELEMENT)),!se)throw g(),new Error("THREE.KTX2Loader: .transcodeImage failed.");z.push($)}let W=f(z);L.push({data:W,width:G,height:V}),B.push(W.buffer)}R.push({mipmaps:L,width:_,height:v,format:T,type:I})}return g(),{faces:R,buffers:B,width:_,height:v,hasAlpha:E,dfdFlags:M,format:T,type:I}}let c=[{if:"astcSupported",basisFormat:[r.UASTC],transcoderFormat:[s.ASTC_4x4,s.ASTC_4x4],engineFormat:[n.RGBA_ASTC_4x4_Format,n.RGBA_ASTC_4x4_Format],engineType:[i.UnsignedByteType],priorityETC1S:1/0,priorityUASTC:1,needsPowerOfTwo:!1},{if:"bptcSupported",basisFormat:[r.ETC1S,r.UASTC],transcoderFormat:[s.BC7_M5,s.BC7_M5],engineFormat:[n.RGBA_BPTC_Format,n.RGBA_BPTC_Format],engineType:[i.UnsignedByteType],priorityETC1S:3,priorityUASTC:2,needsPowerOfTwo:!1},{if:"dxtSupported",basisFormat:[r.ETC1S,r.UASTC],transcoderFormat:[s.BC1,s.BC3],engineFormat:[n.RGBA_S3TC_DXT1_Format,n.RGBA_S3TC_DXT5_Format],engineType:[i.UnsignedByteType],priorityETC1S:4,priorityUASTC:5,needsPowerOfTwo:!1},{if:"etc2Supported",basisFormat:[r.ETC1S,r.UASTC],transcoderFormat:[s.ETC1,s.ETC2],engineFormat:[n.RGB_ETC2_Format,n.RGBA_ETC2_EAC_Format],engineType:[i.UnsignedByteType],priorityETC1S:1,priorityUASTC:3,needsPowerOfTwo:!1},{if:"etc1Supported",basisFormat:[r.ETC1S,r.UASTC],transcoderFormat:[s.ETC1],engineFormat:[n.RGB_ETC1_Format],engineType:[i.UnsignedByteType],priorityETC1S:2,priorityUASTC:4,needsPowerOfTwo:!1},{if:"pvrtcSupported",basisFormat:[r.ETC1S,r.UASTC],transcoderFormat:[s.PVRTC1_4_RGB,s.PVRTC1_4_RGBA],engineFormat:[n.RGB_PVRTC_4BPPV1_Format,n.RGBA_PVRTC_4BPPV1_Format],engineType:[i.UnsignedByteType],priorityETC1S:5,priorityUASTC:6,needsPowerOfTwo:!0},{if:"bptcSupported",basisFormat:[r.UASTC_HDR],transcoderFormat:[s.BC6H],engineFormat:[n.RGB_BPTC_UNSIGNED_Format],engineType:[i.HalfFloatType],priorityHDR:1,needsPowerOfTwo:!1},{basisFormat:[r.ETC1S,r.UASTC],transcoderFormat:[s.RGBA32,s.RGBA32],engineFormat:[n.RGBAFormat,n.RGBAFormat],engineType:[i.UnsignedByteType,i.UnsignedByteType],priorityETC1S:100,priorityUASTC:100,needsPowerOfTwo:!1},{basisFormat:[r.UASTC_HDR],transcoderFormat:[s.RGBA_HALF],engineFormat:[n.RGBAFormat],engineType:[i.HalfFloatType],priorityHDR:100,needsPowerOfTwo:!1}],l={[r.ETC1S]:c.filter(p=>p.basisFormat.includes(r.ETC1S)).sort((p,m)=>p.priorityETC1S-m.priorityETC1S),[r.UASTC]:c.filter(p=>p.basisFormat.includes(r.UASTC)).sort((p,m)=>p.priorityUASTC-m.priorityUASTC),[r.UASTC_HDR]:c.filter(p=>p.basisFormat.includes(r.UASTC_HDR)).sort((p,m)=>p.priorityHDR-m.priorityHDR)};function u(p,m,g,b){let _=l[p];for(let v=0;v<_.length;v++){let x=_[v];if(x.if&&!h[x.if]||!x.basisFormat.includes(p)||b&&x.transcoderFormat.length<2||x.needsPowerOfTwo&&!(d(m)&&d(g)))continue;let y=x.transcoderFormat[b?1:0],w=x.engineFormat[b?1:0],E=x.engineType[0];return{transcoderFormat:y,engineFormat:w,engineType:E}}throw new Error("THREE.KTX2Loader: Failed to identify transcoding target.")}function d(p){return p<=2?!0:(p&p-1)===0&&p!==0}function f(p){if(p.length===1)return p[0];let m=0;for(let _=0;_<p.length;_++){let v=p[_];m+=v.byteLength}let g=new Uint8Array(m),b=0;for(let _=0;_<p.length;_++){let v=p[_];g.set(v,b),b+=v.byteLength}return g}};var x0=new Set([Le,ms,kn,pn]),v0=new Set([91]),Cl={109:Le,103:kn,100:pn,97:Le,83:kn,76:pn,91:Le,43:Le,37:Le,22:kn,16:kn,15:pn,9:pn,123:ms,122:ms,152:Kr,148:qr,153:mc,154:Ac,155:gc,156:bc,1000066e3:bi,158:bi,157:bi,1000066004:_s,166:_s,165:_s,134:As,133:As,132:Vr,131:Vr,138:gs,137:gs,140:vc,139:xc,142:wc,141:yc,146:xs,145:xs,1000054005:bs,1000054001:bs,1000054004:Wr,1000054e3:Wr},zn={109:rt,103:rt,100:rt,97:jt,83:jt,76:jt,91:Qr,43:ee,37:ee,22:ee,16:ee,15:ee,9:ee,123:zr,122:Hr,152:ee,148:ee,153:ee,154:ee,155:ee,156:ee,1000066e3:jt,158:ee,157:ee,1000066004:jt,166:ee,165:ee,134:ee,133:ee,132:ee,131:ee,138:ee,137:ee,140:ee,139:ee,142:ee,141:ee,146:ee,145:ee,1000054005:ee,1000054001:ee,1000054004:ee,1000054e3:ee};async function y0(h){let{vkFormat:e}=h;if(Cl[e]===void 0)throw new Error("THREE.KTX2Loader: Unsupported vkFormat: "+e);zn[e]===void 0&&console.warn('THREE.KTX2Loader: Missing ".type" for vkFormat: '+e);let t;h.supercompressionScheme===2&&(Sl||(Sl=new Promise(async r=>{let a=new xa;await a.init(),r(a)})),t=await Sl);let n=[];for(let r=0;r<h.levels.length;r++){let a=Math.max(1,h.pixelWidth>>r),o=Math.max(1,h.pixelHeight>>r),c=h.pixelDepth?Math.max(1,h.pixelDepth>>r):0,l=h.levels[r],u;if(h.supercompressionScheme===0)u=l.levelData;else if(h.supercompressionScheme===2)u=t.decode(l.levelData,l.uncompressedByteLength);else throw new Error("THREE.KTX2Loader: Unsupported supercompressionScheme.");let d;zn[e]===rt?d=new Float32Array(u.buffer,u.byteOffset,u.byteLength/Float32Array.BYTES_PER_ELEMENT):zn[e]===jt||zn[e]===Qr?d=new Uint16Array(u.buffer,u.byteOffset,u.byteLength/Uint16Array.BYTES_PER_ELEMENT):zn[e]===zr||zn[e]===Hr?d=new Uint32Array(u.buffer,u.byteOffset,u.byteLength/Uint32Array.BYTES_PER_ELEMENT):d=u,n.push({data:d,width:a,height:o,depth:c})}let i=h.levelCount===0||n.length>1,s;if(x0.has(Cl[e]))s=h.pixelDepth===0?new Je(n[0].data,h.pixelWidth,h.pixelHeight):new Ji(n[0].data,h.pixelWidth,h.pixelHeight,h.pixelDepth),s.minFilter=i?ps:mt,s.magFilter=mt,s.generateMipmaps=h.levelCount===0,s.normalized=v0.has(e);else{if(h.pixelDepth>0)throw new Error("THREE.KTX2Loader: Unsupported pixelDepth.");s=new un(n,h.pixelWidth,h.pixelHeight),s.minFilter=i?bt:Pe,s.magFilter=Pe}return s.mipmaps=n,s.type=zn[e],s.format=Cl[e],s.colorSpace=Bd(h),s.needsUpdate=!0,Promise.resolve(s)}function Bd(h){let e=h.dataFormatDescriptor[0];return e.colorPrimaries===1?e.transferFunction===2?re:He:e.colorPrimaries===10?e.transferFunction===2?Gu:Qu:e.colorPrimaries===0?xi:(console.warn(`THREE.KTX2Loader: Unsupported color primaries, "${e.colorPrimaries}"`),xi)}var Dd=(function(){var h="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuixkbeeeddddillviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WboY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbrl79IV9Rbwq:VZkdbk:XYi5ud9:du8Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaicefhxcj;abad9Uc;WFbGcjdadca0EhmaialfgPar9Rgoadfhsavaoadz:jjjjbgzceVhHcbhOdndninaeaO9nmeaPax9RaD6mdamaeaO9RaOamfgoae6EgAcsfglc9WGhCabaOad2fhXaAcethQaxaDfhiaOaeaoaeao6E9RhLalcl4cifcd4hKazcj;cbfaAfhYcbh8AazcjdfhEaHh3incbh5dnawTmbaxa8Acd4fRbbh5kcbh8Eazcj;cbfhqinaih8Fdndndndna5a8Ecet4ciGgoc9:fPdebdkaPa8F9RaA6mrazcj;cbfa8EaA2fa8FaAz:jjjjb8Aa8FaAfhixdkazcj;cbfa8EaA2fcbaAz:kjjjb8Aa8FhixekaPa8F9RaK6mva8FaKfhidnaCTmbaPai9RcK6mbaocdtc:q:G:cjbfcj:G:cjbawEhaczhrcbhlinargoc9Wfghaqfhrdndndndndndnaaa8Fahco4fRbbalcoG4ciGcdtfydbPDbedvivvvlvkar9cb83bwar9cb83bbxlkarcbaiRbdai8Xbb9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbaqaofgrcGfcbaicdfa8J9c8N1:NfghRbbag9cjjjjjw:dg8J9qE86bbarcVfcbaha8J9c8M1:NfghRbbag9cjjjjjl:dg8J9qE86bbarc7fcbaha8J9c8L1:NfghRbbag9cjjjjjd:dg8J9qE86bbarctfcbaha8J9c8K1:NfghRbbag9cjjjjje:dg8J9qE86bbarc91fcbaha8J9c8J1:NfghRbbag9cjjjj;ab:dg8J9qE86bbarc4fcbaha8J9cg1:NfghRbbag9cjjjja:dg8J9qE86bbarc93fcbaha8J9ch1:NfghRbbag9cjjjjz:dgg9qE86bbarc94fcbahag9ca1:NfghRbbai8Xbe9c:c:qj:bw9:9c:q;c1:I1e:d9c:b:c:e1z9:gg9cjjjjjz:dg8J9qE86bbarc95fcbaha8J9c8N1:NfgiRbbag9cjjjjjw:dg8J9qE86bbarc96fcbaia8J9c8M1:NfgiRbbag9cjjjjjl:dg8J9qE86bbarc97fcbaia8J9c8L1:NfgiRbbag9cjjjjjd:dg8J9qE86bbarc98fcbaia8J9c8K1:NfgiRbbag9cjjjjje:dg8J9qE86bbarc99fcbaia8J9c8J1:NfgiRbbag9cjjjj;ab:dg8J9qE86bbarc9:fcbaia8J9cg1:NfgiRbbag9cjjjja:dg8J9qE86bbarcufcbaia8J9ch1:NfgiRbbag9cjjjjz:dgg9qE86bbaiag9ca1:NfhixikaraiRblaiRbbghco4g8Ka8KciSg8KE86bbaqaofgrcGfaiclfa8Kfg8KRbbahcl4ciGg8La8LciSg8LE86bbarcVfa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc7fa8Ka8Lfg8KRbbahciGghahciSghE86bbarctfa8Kahfg8KRbbaiRbeghco4g8La8LciSg8LE86bbarc91fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc4fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc93fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc94fa8Kahfg8KRbbaiRbdghco4g8La8LciSg8LE86bbarc95fa8Ka8Lfg8KRbbahcl4ciGg8La8LciSg8LE86bbarc96fa8Ka8Lfg8KRbbahcd4ciGg8La8LciSg8LE86bbarc97fa8Ka8Lfg8KRbbahciGghahciSghE86bbarc98fa8KahfghRbbaiRbigico4g8Ka8KciSg8KE86bbarc99faha8KfghRbbaicl4ciGg8Ka8KciSg8KE86bbarc9:faha8KfghRbbaicd4ciGg8Ka8KciSg8KE86bbarcufaha8KfgrRbbaiciGgiaiciSgiE86bbaraifhixdkaraiRbwaiRbbghcl4g8Ka8KcsSg8KE86bbaqaofgrcGfaicwfa8Kfg8KRbbahcsGghahcsSghE86bbarcVfa8KahfghRbbaiRbeg8Kcl4g8La8LcsSg8LE86bbarc7faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarctfaha8KfghRbbaiRbdg8Kcl4g8La8LcsSg8LE86bbarc91faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc4faha8KfghRbbaiRbig8Kcl4g8La8LcsSg8LE86bbarc93faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc94faha8KfghRbbaiRblg8Kcl4g8La8LcsSg8LE86bbarc95faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc96faha8KfghRbbaiRbvg8Kcl4g8La8LcsSg8LE86bbarc97faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc98faha8KfghRbbaiRbog8Kcl4g8La8LcsSg8LE86bbarc99faha8LfghRbba8KcsGg8Ka8KcsSg8KE86bbarc9:faha8KfghRbbaiRbrgicl4g8Ka8KcsSg8KE86bbarcufaha8KfgrRbbaicsGgiaicsSgiE86bbaraifhixekarai8Pbw83bwarai8Pbb83bbaiczfhikdnaoaC9pmbalcdfhlaoczfhraPai9RcL0mekkaoaC6moaimexokaCmva8FTmvkaqaAfhqa8Ecefg8Ecl9hmbkdndndndnawTmbasa8Acd4fRbbgociGPlbedrbkaATmdaza8Afh8Fazcj;cbfhhcbh8EaEhaina8FRbbhraahocbhlinaoahalfRbbgqce4cbaqceG9R7arfgr86bbaoadfhoaAalcefgl9hmbkaacefhaa8Fcefh8FahaAfhha8Ecefg8Ecl9hmbxikkaATmeaza8Afhaazcj;cbfhhcbhoceh8EaYh8FinaEaofhlaa8Vbbhrcbhoinala8FaofRbbcwtahaofRbbgqVc;:FiGce4cbaqceG9R7arfgr87bbaladfhlaLaocefgofmbka8FaQfh8FcdhoaacdfhaahaQfhha8EceGhlcbh8EalmbxdkkaATmbaocl4h8Eaza8AfRbbhqcwhoa3hlinalRbbaotaqVhqalcefhlaocwfgoca9hmbkcbhhaEh8FaYhainazcj;cbfahfRbbhrcwhoaahlinalRbbaotarVhralaAfhlaocwfgoca9hmbkara8E94aq7hqcbhoa8Fhlinalaqao486bbalcefhlaocwfgoca9hmbka8Fadfh8FaacefhaahcefghaA9hmbkkaEclfhEa3clfh3a8Aclfg8Aad6mbkaXazcjdfaAad2z:jjjjb8AazazcjdfaAcufad2fadz:jjjjb8AaAaOfhOaihxaimbkc9:hoxdkcbc99aPax9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaok:ysezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:kjjjb8Aav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk:4ioiue99dud99dud99dnaeTmbcbhiabhlindndnal8Uebgv:YgoJ:ji:1Salcof8UebgrciVgw:Y:vgDNJbbbZJbbb:;avcu9kEMgq:lJbbb9p9DTmbaq:Ohkxekcjjjj94hkkalclf8Uebhvalcdf8UebhxalarcefciGcetfak87ebdndnax:YgqaDNJbbbZJbbb:;axcu9kEMgm:lJbbb9p9DTmbam:Ohxxekcjjjj94hxkabaiarciGgkfcd7cetfax87ebdndnav:YgmaDNJbbbZJbbb:;avcu9kEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkalarcufciGcetfav87ebdndnawaw2:ZgPaPMaoaoN:taqaqN:tamamN:tgoJbbbbaoJbbbb9GE:raDNJbbbZMgD:lJbbb9p9DTmbaD:Ohrxekcjjjj94hrkalakcetfar87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk:Tvirud99eudndnadcl9hmbaeTmeindndnabRbbgiabcefgl8Sbbgvabcdfgo8Sbbgrf9R:YJbbuJabcifgwRbbgdce4adVgDcd4aDVgDcl4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax86bbdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao86bbdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai86bbdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad86bbabclfhbaecufgembxdkkaeTmbindndnab8Vebgiabcdfgl8Uebgvabclfgo8Uebgrf9R:YJbFu9habcofgw8Vebgdce4adVgDcd4aDVgDcl4aDVgDcw4aDVgD:Z:vgqNJbbbZMgk:lJbbb9p9DTmbak:Ohxxekcjjjj94hxkaoax87ebdndnaraif:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohoxekcjjjj94hokalao87ebdndnavaifar9R:YaqNJbbbZMgk:lJbbb9p9DTmbak:Ohixekcjjjj94hikabai87ebdndnaDadcetGadceGV:ZaqNJbbbZMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkawad87ebabcwfhbaecufgembkkk9teiucbcbyd:K:G:cjbgeabcifc98GfgbBd:K:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkk83dbcj:Gdk8Kbbbbdbbblbbbwbbbbbbbebbbdbbblbbbwbbbbc:K:Gdkl8W:qbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuixkbbebeeddddilve9Weeeviebeoweuecj:Gdkr;Neqo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949WbwY9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVJ9V29VVbDl79IV9Rbqq:W9Dklbzik94evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaeai86b:q:W:cjbaecitab8Piw83i:q:G:cjbaecefgecjd9hmbkk:JBl8Aud97dur978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnalTmbcuhoaiRbbgrc;WeGc:Ge9hmbarcsGgwce0mbc9:hoalcufadcd4cbawEgDadfgrcKcaawEgqaraq0Egk6mbaialfgxar9RhodnadTgmmbavaoad;8qbbkaicefhPcj;abad9Uc;WFbGcjdadca0EhsdndndnadTmbaoadfhzcbhHinaeaH9nmdaxaP9RaD6miabaHad2fhOaPaDfhAasaeaH9RaHasfae6EgCcsfgocl4cifcd4hXavcj;cbfaoc9WGgQcetfhLavcj;cbfaQci2fhKavcj;cbfaQfhYcbh8Aaoc;ab6hEincbh3dnawTmbaPa8Acd4fRbbh3kcbh5avcj;cbfh8Eindndndndna3a5cet4ciGgoc9:fPdebdkaxaA9RaQ6mwdnaQTmbavcj;cbfa5aQ2faAaQ;8qbbkaAaCfhAxdkaQTmeavcj;cbfa5aQ2fcbaQ;8kbxekaxaA9RaX6moaoclVcbawEhraAaXfhocbhidnaEmbaxao9Rc;Gb6mbcbhlina8EalfhidndndndndndnaAalco4fRbbgqciGarfPDbedibledibkaipxbbbbbbbbbbbbbbbbpklbxlkaiaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiaopbbbpklbaoczfhoxekaiaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcd4ciGarfPDbedibledibkaiczfpxbbbbbbbbbbbbbbbbpklbxlkaiczfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaiczfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaiczfaopbbbpklbaoczfhoxekaiczfaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqcl4ciGarfPDbedibledibkaicafpxbbbbbbbbbbbbbbbbpklbxlkaicafaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaoclffagRb:q:W:cjbfhoxikaicafaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbahaocwffagRb:q:W:cjbfhoxdkaicafaopbbbpklbaoczfhoxekaicafaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbahaocdffagRb:q:W:cjbfhokdndndndndndnaqco4arfPDbedibledibkaic8Wfpxbbbbbbbbbbbbbbbbpklbxlkaic8Wfaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaoclffaqRb:q:W:cjbfhoxikaic8Wfaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Ngicitpbi:q:G:cjbaiRb:q:W:cjbgipsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Ngqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spklbaiaocwffaqRb:q:W:cjbfhoxdkaic8Wfaopbbbpklbaoczfhoxekaic8WfaopbbdaoRbbgicitpbi:q:G:cjbaiRb:q:W:cjbgipsaoRbegqcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpklbaiaocdffaqRb:q:W:cjbfhokalc;abfhialcjefaQ0meaihlaxao9Rc;Fb0mbkkdnaiaQ9pmbaici4hlinaxao9RcK6mwa8EaifhqdndndndndndnaAaico4fRbbalcoG4ciGarfPDbedibledibkaqpxbbbbbbbbbbbbbbbbpkbbxlkaqaopbblaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLg8Fcdp:mea8FpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogapxiiiiiiiiiiiiiiiip8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaoclffagRb:q:W:cjbfhoxikaqaopbbwaopbbbg8Fclp:mea8FpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogapxssssssssssssssssp8Jg8Fp5b9cjF;8;4;W;G;ab9:9cU1:Nghcitpbi:q:G:cjbahRb:q:W:cjbghpsa8Fp5e9cjF;8;4;W;G;ab9:9cU1:Nggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPaaa8Fp9spkbbahaocwffagRb:q:W:cjbfhoxdkaqaopbbbpkbbaoczfhoxekaqaopbbdaoRbbghcitpbi:q:G:cjbahRb:q:W:cjbghpsaoRbeggcitpbi:q:G:cjbp9UpmbedilvorzHOACXQLpPpkbbahaocdffagRb:q:W:cjbfhokalcdfhlaiczfgiaQ6mbkkaohAaoTmoka8EaQfh8Ea5cefg5cl9hmbkdndndndnawTmbaza8Acd4fRbbglciGPlbedwbkaQTmdavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep9Ta8Fpxeeeeeeeeeeeeeeeegap9op9Hp9rg8Fa8Jp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ug8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp9Ug8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep9Ta8Faap9op9Hp9rg8Fp9Ugap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp9Ugap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp9Ugap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp9Ug8Jp9AbbbaladfhlaoczfgoaQ6mbxikkaQTmeavcjdfa8Afhlava8Afpbdbh8Jcbhoinalavcj;cbfaofpblbg8KaYaofpblbg8LpmbzeHdOiAlCvXoQrLg8MaLaofpblbg8NaKaofpblbgypmbzeHdOiAlCvXoQrLg8PpmbezHdiOAlvCXorQLg8Fcep:nea8Fpxebebebebebebebebgap9op:bep9rg8Fa8Jp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ma8PpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwKDYq8AkEx3m5P8Es8Fg8Ka8NaypmwKDYq8AkEx3m5P8Es8Fg8LpmbezHdiOAlvCXorQLg8Fcep:nea8Faap9op:bep9rg8Fp:oeg8Jp9Abbbaladfgla8Ja8Fa8Fpmlvorlvorlvorlvorp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmwDqkwDqkwDqkwDqkp:oeg8Jp9Abbbaladfgla8Ja8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9Abbbaladfgla8Ja8Ka8LpmwDKYqk8AExm35Ps8E8Fg8Fcep:nea8Faap9op:bep9rg8Fp:oegap9Abbbaladfglaaa8Fa8Fpmlvorlvorlvorlvorp:oegap9Abbbaladfglaaa8Fa8FpmwDqkwDqkwDqkwDqkp:oegap9Abbbaladfglaaa8Fa8FpmxmPsxmPsxmPsxmPsp:oeg8Jp9AbbbaladfhlaoczfgoaQ6mbxdkkaQTmbcbhocbalcl4gl9Rc8FGhiavcjdfa8Afhrava8Afpbdbhainaravcj;cbfaofpblbg8JaYaofpblbg8KpmbzeHdOiAlCvXoQrLg8LaLaofpblbg8MaKaofpblbg8NpmbzeHdOiAlCvXoQrLgypmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Faap9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8LaypmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwKDYq8AkEx3m5P8Es8Fg8Ja8Ma8NpmwKDYq8AkEx3m5P8Es8Fg8KpmbezHdiOAlvCXorQLg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9Abbbaradfgraaa8Ja8KpmwDKYqk8AExm35Ps8E8Fg8Faip:Rea8Falp:Tep9qg8Fp9rgap9Abbbaradfgraaa8Fa8Fpmlvorlvorlvorlvorp9rgap9Abbbaradfgraaa8Fa8FpmwDqkwDqkwDqkwDqkp9rgap9Abbbaradfgraaa8Fa8FpmxmPsxmPsxmPsxmPsp9rgap9AbbbaradfhraoczfgoaQ6mbkka8Aclfg8Aad6mbkdnaCad2goTmbaOavcjdfao;8qbbkdnammbavavcjdfaCcufad2fad;8qbbkaCaHfhHc9:hoaAhPaAmbxlkkaeTmbaDalfhrcbhocuhlinaralaD9RglfaD6mdasaeao9Raoasfae6Eaofgoae6mbkaial9RhPkcbc99axaP9RakSEhoxekc9:hokavcj;kbf8Kjjjjbaokwbz:bjjjbkNsezu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnalaeci9UgrcHf6mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbav9cu83iUav9cu83i8Wav9cu83iyav9cu83iaav9cu83iKav9cu83izav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhldnaeTmbcmcsaDceSEhkcbhxcbhmcbhrcbhicbhoindnalaq9nmbc9:hoxikdndnawRbbgDc;Ve0mbavc;abfaoaDcu7gPcl4fcsGcitfgsydlhzasydbhHdndnaDcsGgsak9pmbavaiaPfcsGcdtfydbaxasEhDaxasTgOfhxxekdndnascsSmbcehOasc987asamffcefhDxekalcefhDal8SbbgscFeGhPdndnascu9mmbaDhlxekalcvfhlaPcFbGhPcrhsdninaD8SbbgOcFbGastaPVhPaOcu9kmeaDcefhDascrfgsc8J9hmbxdkkaDcefhlkcehOaPce4cbaPceG9R7amfhDkaDhmkavc;abfaocitfgsaDBdbasazBdlavaicdtfaDBdbavc;abfaocefcsGcitfgsaHBdbasaDBdlaocdfhoaOaifhidnadcd9hmbabarcetfgsaH87ebasclfaD87ebascdfaz87ebxdkabarcdtfgsaHBdbascwfaDBdbasclfazBdbxekdnaDcpe0mbavaiaqaDcsGfRbbgscl4gP9RcsGcdtfydbaxcefgOaPEhDavaias9RcsGcdtfydbaOaPTgzfgOascsGgPEhsaPThPdndnadcd9hmbabarcetfgHax87ebaHclfas87ebaHcdfaD87ebxekabarcdtfgHaxBdbaHcwfasBdbaHclfaDBdbkavaicdtfaxBdbavc;abfaocitfgHaDBdbaHaxBdlavaicefgicsGcdtfaDBdbavc;abfaocefcsGcitfgHasBdbaHaDBdlavaiazfgicsGcdtfasBdbavc;abfaocdfcsGcitfgDaxBdbaDasBdlaocifhoaiaPfhiaOaPfhxxekaxcbalRbbgsEgHaDc;:eSgDfhOascsGhAdndnascl4gCmbaOcefhzxekaOhzavaiaC9RcsGcdtfydbhOkdndnaAmbazcefhxxekazhxavaias9RcsGcdtfydbhzkdndnaDTmbalcefhDxekalcdfhDal8SbegPcFeGhsdnaPcu9kmbalcofhHascFbGhscrhldninaD8SbbgPcFbGaltasVhsaPcu9kmeaDcefhDalcrfglc8J9hmbkaHhDxekaDcefhDkasce4cbasceG9R7amfgmhHkdndnaCcsSmbaDhsxekaDcefhsaD8SbbglcFeGhPdnalcu9kmbaDcvfhOaPcFbGhPcrhldninas8SbbgDcFbGaltaPVhPaDcu9kmeascefhsalcrfglc8J9hmbkaOhsxekascefhskaPce4cbaPceG9R7amfgmhOkdndnaAcsSmbashlxekascefhlas8SbbgDcFeGhPdnaDcu9kmbascvfhzaPcFbGhPcrhDdninal8SbbgscFbGaDtaPVhPascu9kmealcefhlaDcrfgDc8J9hmbkazhlxekalcefhlkaPce4cbaPceG9R7amfgmhzkdndnadcd9hmbabarcetfgDaH87ebaDclfaz87ebaDcdfaO87ebxekabarcdtfgDaHBdbaDcwfazBdbaDclfaOBdbkavc;abfaocitfgDaOBdbaDaHBdlavaicdtfaHBdbavc;abfaocefcsGcitfgDazBdbaDaOBdlavaicefgicsGcdtfaOBdbavc;abfaocdfcsGcitfgDaHBdbaDazBdlavaiaCTaCcsSVfgicsGcdtfazBdbaiaATaAcsSVfhiaocifhokawcefhwaocsGhoaicsGhiarcifgrae6mbkkcbc99alaqSEhokavc;aef8Kjjjjbaok:clevu8Jjjjjbcz9Rhvdnalaecvf9pmbc9:skdnaiRbbc;:eGc;qeSmbcuskav9cb83iwaicefhoaialfc98fhrdnaeTmbdnadcdSmbcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcdtfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgiBdbalaiBdbawcefgwae9hmbxdkkcbhwindnaoar6mbc9:skaocefhlao8SbbgicFeGhddndnaicu9mmbalhoxekaocvfhoadcFbGhdcrhidninal8SbbgDcFbGaitadVhdaDcu9kmealcefhlaicrfgic8J9hmbxdkkalcefhokabawcetfadc8Etc8F91adcd47avcwfadceGcdtVglydbfgi87ebalaiBdbawcefgwae9hmbkkcbc99aoarSEk;Toio97eue97aec98Ghedndnadcl9hmbaeTmecbhdinababpbbbgicKp:RecKp:Sep;6eglaicwp:RecKp:Sep;6ealp;Geaiczp:RecKp:Sep;6egvp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgwp9op9rp;Keglpxbb;:9cbb;:9cbb;:9cbb;:9calalp;Meaoaop;Meavaravawp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFbbbFbbbFbbbFbbbp9oaipxbbbFbbbFbbbFbbbFp9op9qalavp;Mearp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaoavp;Mearp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgDaDpbbbgipxbbbbbbFFbbbbbbFFgwp9oabpbbbgoaipmbediwDqkzHOAKY8AEgvczp:Reczp:Sep;6eglaoaipmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eavczp:Sep;6egvp;Gealp;Gep;Kep;Legipxbbbbbbbbbbbbbbbbp:2egralpxbbbjbbbjbbbjbbbjgqp9op9rp;Keglpxb;:FSb;:FSb;:FSb;:FSalalp;Meaiaip;Meavaravaqp9op9rp;Keglalp;Mep;Kep;Kep;Jep;Negvp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbp9oaiavp;Mearp;Keczp:Rep9qgialavp;Mearp;KepxFFbbFFbbFFbbFFbbp9oglpmwDKYqk8AExm35Ps8E8Fp9qpkbbabaoawp9oaialpmbezHdiOAlvCXorQLp9qpkbbabcafhbadclfgdae6mbkkk;2ileue97euo97dnaec98GgiTmbcbheinabcKfpx:ji:1S:ji:1S:ji:1S:ji:1SabpbbbglabczfgvpbbbgopmlvorxmPsCXQL358E8Fgrczp:Segwpxibbbibbbibbbibbbp9qp;6egDp;NegqaDaDp;MegDaDp;KealaopmbediwDqkzHOAKY8AEgDczp:Reczp:Sep;6eglalp;MeaDczp:Sep;6egoaop;Mearczp:Reczp:Sep;6egrarp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jep;Mepxbbn0bbn0bbn0bbn0gDp;KepxFFbbFFbbFFbbFFbbgkp9oaqaop;MeaDp;Keczp:Rep9qgoaqalp;MeaDp;Keakp9oaqarp;MeaDp;Keczp:Rep9qgDpmwDKYqk8AExm35Ps8E8Fglp5eawclp:RegqpEi:T:j83ibavalp5baqpEd:T:j83ibabcwfaoaDpmbezHdiOAlvCXorQLgDp5eaqpEe:T:j83ibabaDp5baqpEb:T:j83ibabcafhbaeclfgeai6mbkkkuee97dnadcd4ae2c98GgeTmbcbhdinababpbbbgicwp:Recwp:Sep;6eaicep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbabczfhbadclfgdae6mbkkk:Sodw97euaec98Ghedndnadcl9hmbaeTmecbhdinabpxbbuJbbuJbbuJbbuJabpbbbgicKp:TeglaicYp:Tep9qgvcdp:Teavp9qgvclp:Teavp9qgop;6ep;Negvaicwp:RecKp:SegraipxFbbbFbbbFbbbFbbbgwp9ogDp:Uep;6ep;Mepxbbn0bbn0bbn0bbn0gqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9oavaDarp:Xeaiczp:RecKp:Segip:Uep;6ep;Meaqp;Keawp9op9qavaDaraip:Uep:Xep;6ep;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qavaoalcep:Rep9oalpxebbbebbbebbbebbbp9op9qp;6ep;Meaqp;KecKp:Rep9qpkbbabczfhbadclfgdae6mbxdkkaeTmbcbhdinabczfgkpxbFu9hbFu9hbFu9hbFu9habpbbbglakpbbbgrpmlvorxmPsCXQL358E8Fgvczp:TegqavcHp:Tep9qgicdp:Teaip9qgiclp:Teaip9qgicwp:Teaip9qgop;6ep;NegialarpmbediwDqkzHOAKY8AEgDpxFFbbFFbbFFbbFFbbglp9ograDczp:Segwp:Ueavczp:Reczp:SegDp:Xep;6ep;Mepxbbn0bbn0bbn0bbn0gvp;Kealp9oaiarawaDp:Uep:Xep;6ep;Meavp;Keczp:Rep9qgwaiaoaqcep:Rep9oaqpxebbbebbbebbbebbbp9op9qp;6ep;Meavp;Keczp:ReaiaDarp:Uep;6ep;Meavp;Kealp9op9qgipmwDKYqk8AExm35Ps8E8FpkbbabawaipmbezHdiOAlvCXorQLpkbbabcafhbadclfgdae6mbkkk9teiucbcbydj:G:cjbgeabcifc98GfgbBdj:G:cjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkxebcj:Gdklz:zbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var i=WebAssembly.validate(t)?a(e):a(h),s,r=WebAssembly.instantiate(i,{}).then(function(b){s=b.instance,s.exports.__wasm_call_ctors()});function a(b){for(var _=new Uint8Array(b.length),v=0;v<b.length;++v){var x=b.charCodeAt(v);_[v]=x>96?x-97:x>64?x-39:x+4}for(var y=0,v=0;v<b.length;++v)_[y++]=_[v]<60?n[_[v]]:(_[v]-60)*64+_[++v];return _.buffer.slice(0,y)}function o(b,_,v,x,y,w,E){var M=b.exports.sbrk,S=x+3&-4,T=M(S*y),I=M(w.length),R=new Uint8Array(b.exports.memory.buffer);R.set(w,I);var B=_(T,x,y,I,w.length);if(B==0&&E&&E(T,S,y),v.set(R.subarray(T,T+x*y)),M(T-M(0)),B!=0)throw new Error("Malformed buffer data: "+B)}var c={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp",COLOR:"meshopt_decodeFilterColor"},l={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],d=0;function f(b){var _={object:new Worker(b),pending:0,requests:{}};return _.object.onmessage=function(v){var x=v.data;_.pending-=x.count,_.requests[x.id][x.action](x.value),delete _.requests[x.id]},_}function p(b){for(var _="self.ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(i)+"]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = "+g.name+";"+o.toString()+g.toString(),v=new Blob([_],{type:"text/javascript"}),x=URL.createObjectURL(v),y=u.length;y<b;++y)u[y]=f(x);for(var y=b;y<u.length;++y)u[y].object.postMessage({});u.length=b,URL.revokeObjectURL(x)}function m(b,_,v,x,y){for(var w=u[0],E=1;E<u.length;++E)u[E].pending<w.pending&&(w=u[E]);return new Promise(function(M,S){var T=new Uint8Array(v),I=++d;w.pending+=b,w.requests[I]={resolve:M,reject:S},w.object.postMessage({id:I,count:b,size:_,source:T,mode:x,filter:y},[T.buffer])})}function g(b){var _=b.data;self.ready.then(function(v){if(!_.id)return self.close();try{var x=new Uint8Array(_.count*_.size);o(v,v.exports[_.mode],x,_.count,_.size,_.source,v.exports[_.filter]),self.postMessage({id:_.id,count:_.count,action:"resolve",value:x},[x.buffer])}catch(y){self.postMessage({id:_.id,count:_.count,action:"reject",value:y})}})}return{ready:r,supported:!0,useWorkers:function(b){p(b)},decodeVertexBuffer:function(b,_,v,x,y){o(s,s.exports.meshopt_decodeVertexBuffer,b,_,v,x,s.exports[c[y]])},decodeIndexBuffer:function(b,_,v,x){o(s,s.exports.meshopt_decodeIndexBuffer,b,_,v,x)},decodeIndexSequence:function(b,_,v,x){o(s,s.exports.meshopt_decodeIndexSequence,b,_,v,x)},decodeGltfBuffer:function(b,_,v,x,y,w){o(s,s.exports[l[y]],b,_,v,x,s.exports[c[w]])},decodeGltfBufferAsync:function(b,_,v,x,y){return u.length>0?m(b,_,v,l[x],c[y]):r.then(function(){var w=new Uint8Array(b*_);return o(s,s.exports[l[x]],w,b,_,v,s.exports[c[y]]),w})}}})();var va=null;var RM=new C(.2,.78,.55).normalize(),BM=new P,DM=[new Se(.16,.08,.68,.84),new Se(.28,.12,.44,.76),new Se(.3,.18,.4,.64)];function Rl(){let h=new Oe;return h.colorSpace=re,h.magFilter=Pe,h.minFilter=Pe,h}var FM=[Rl(),Rl(),Rl()];function Fd(h){if(va)return va;let e=new $t().setTranscoderPath("./basis/").setWorkerLimit(2).detectSupport(h);return va=new An().setMeshoptDecoder(Dd).setKTX2Loader(e),va}var Bl=null;function Ld(h,e){let t=h.userData.speed;return typeof t=="number"&&t>.2?t:e}function w0(h){return Bl||(Bl=Fd(h).loadAsync("./models/locomotion.glb").then(e=>{let t=r=>{let a=e.animations.find(o=>o.name===r);if(!a)throw new Error(`locomotion clip ${r} missing`);return a},n=t("Idle"),i=t("Walk"),s=t("Run");return{idle:n,walk:i,run:s,walkMs:Ld(i,1.05),runMs:Ld(s,5.6)}})),Bl}function M0(h,e,t=0){let n=new Nn(h),i=n.clipAction(e.idle),s=n.clipAction(e.walk),r=n.clipAction(e.run),a=(t%1+1)%1;for(let o of[i,s,r])o.setLoop(Xr,1/0),o.enabled=!0,o.play(),o.setEffectiveWeight(0);return i.setEffectiveWeight(1),i.time=a*e.idle.duration,s.time=a*e.walk.duration,r.time=a*e.run.duration,{mixer:n,idle:i,walk:s,run:r,walkMs:e.walkMs,runMs:e.runMs,weights:{idle:1,walk:0,run:0}}}function E0(h,e,t,n=1){let i=Math.max(0,e)/Math.max(.5,n),{walkMs:s,runMs:r}=h,a=0,o=0,c=0;if(i<.18)a=1;else if(i<s){let g=(i-.18)/(s-.18);a=1-g,o=g}else if(i<r){let g=(i-s)/Math.max(.001,r-s);o=1-g,c=g}else c=1;let l=1-Math.exp(-Math.max(0,t)*8),u=h.weights;u.idle+=(a-u.idle)*l,u.walk+=(o-u.walk)*l,u.run+=(c-u.run)*l;let d=u.idle+u.walk+u.run||1;u.idle/=d,u.walk/=d,u.run/=d;let f=h.walk.getClip().duration||1,p=h.run.getClip().duration||1;u.walk>.2&&u.run>.2&&(u.run>=u.walk?h.walk.time=h.run.time/p*f:h.run.time=h.walk.time/f*p);let m=(g,b)=>b>.02?Math.max(.7,Math.min(1.75,i/g)):1;h.idle.setEffectiveWeight(u.idle),h.walk.setEffectiveWeight(u.walk),h.run.setEffectiveWeight(u.run),h.idle.timeScale=1,h.walk.timeScale=m(s,u.walk),h.run.timeScale=m(r,u.run),t>0&&h.mixer.update(t)}function Pd(h){let e=h,t=r=>{if(r.userData.awLoco)return r.userData.awLoco==="on"||r.userData.awLoco==="pending";let a=!1;return r.traverse(o=>{o.name==="thigh_l"&&(a=!0)}),!a||typeof r.animate!="function"?!1:(r.userData.awLoco="pending",w0(h.renderer).then(o=>{let c=r.children[0]??r,l=M0(c,o,0);r.animate=(u,d)=>{E0(l,u,d,Math.abs(r.scale.x)||1)},r.userData.awLoco="on"}).catch(o=>{console.warn("[aw-loco] player",o),delete r.userData.awLoco}),!0)},n=()=>{let r=e.walker;return!!r&&t(r)};if(n())return;let i=0,s=setInterval(()=>{(n()||++i>40)&&clearInterval(s)},250)}var ya={up:[10,18,27,37,48],down:[0,7,14,22,31],idle:820,red:6400,launch:2e3},wa={up:[11,20,30,39,48,55],down:[0,8,16,25,34,43],idle:1400,red:12400,launch:3400};function Ma(h){return h==="car"?32:50}function Dl(h,e){return Math.max(8,Math.floor(h*2/Ma(e)))}function Fl(h,e,t,n,i,s){let r=e<0?-e:e,a=h.gear,o=0,c=i.up.length-1;a<c&&r>i.up[a]?(a+=1,o=1):a>0&&r<i.down[a]&&(a-=1,o=-1),h.gear=a;let l=i.down[a],d=i.up[a]-l||1,f=(r-l)/d;f<0?f=0:f>1&&(f=1);let p=i.idle+f*(i.red-i.idle);if(p+=t*(1-f*.65)*(i.red-i.idle)*.2,r<.8){let b=Math.sin(s*3.1)*12+Math.sin(s*5.4)*7;p=i.idle+t*i.launch+(t<.12?b:0)}f>.96&&t>.75&&(p-=Math.abs(Math.sin(s*46))*(i.red*.018)),p>i.red&&(p=i.red),p<i.idle*.92&&(p=i.idle*.92),o===1?h.rpm*=.68:o===-1&&(h.rpm=Math.min(i.red,h.rpm*1.18+180)),h.shift=o!==0?.16:h.shift>n?h.shift-n:0;let m=h.shift>0?15:t>.4?8.5:3.4,g=n>0?1-Math.exp(-m*n):0;return h.rpm+=(p-h.rpm)*g,o}function S0(h){return h%=1,h<0?h+1:h}function wi(h,e,t){let n=S0(h-e);n>.5&&(n=1-n);let i=t*.2;return n<i?i>0?n/i:1:Math.exp(-(n-i)/t)}function C0(h,e){let t=e?.032:.068,n=wi(h,0,t),i=wi(h,.5,t*1.08),s=h*Math.PI*2,r=e?1:0,a=Math.sin(s)*.2+Math.sin(s*2)*.3+Math.sin(s*3)*(.05+r*.12)+Math.sin(s*4)*(.045+r*.1)+Math.sin(s*5)*r*.06+Math.sin(s*6)*r*.04;return Math.tanh(((n+i*.9)*(e?.82:.68)+a)*1.12)}function I0(h,e){let t=e?.02:.038,n=wi(h,.02,t),i=wi(h,.16,t*.92),s=wi(h,.56,t*1.15)*.7,r=wi(h,.71,t)*.58,a=h*Math.PI*2,o=e?1:0,c=Math.sin(a)*.14+Math.sin(a*2)*.2+Math.sin(a*3+.45)*(.06+o*.12)+Math.sin(a*4.5)*(.025+o*.08)+Math.sin(a*6)*o*.05+Math.sin(a*8)*o*.028;return Math.tanh(((n+i+s+r)*(e?.78:.64)+c)*1.2)}function Nd(h,e,t,n){let i=n.length,s=t?e==="car"?2500:3e3:e==="car"?820:980,r=1-Math.exp(-2*Math.PI*s/h),a=0,o=0,c=0,l=0,u=0;for(let f=0;f<2;f++)for(let p=0;p<i;p++){let m=p/i*2%1,g=e==="car"?C0(m,t):I0(m,t);if(a+=(g-a)*r,o+=(a-o)*r,c+=(o-c)*r,l+=(c-l)*r,f===1){n[p]=l;let b=l<0?-l:l;b>u&&(u=b)}}let d=u>1e-5?.56/u:0;for(let f=0;f<i;f++)n[f]*=d}var T0=.5,Ud=180,Ea=class{constructor(e){A(this,"g",e);A(this,"stats",{started:!1,muted:!1,mode:"car",trafficVoices:0,nodes:0,gear:0,rpm:0,throttle:0,police:0,ambulance:0,impacts:0,turbo:0,level:0});A(this,"audio",null);A(this,"muted",!1);A(this,"quick");A(this,"setting",null);A(this,"keyFwd",!1);A(this,"keyBrk",!1);A(this,"prevT",0);A(this,"prevWall",0);A(this,"arm",.4);A(this,"masterLin",0);A(this,"carDrive",{gear:0,rpm:ya.idle,shift:0});A(this,"motoDrive",{gear:0,rpm:wa.idle,shift:0});A(this,"carThr",0);A(this,"motoThr",0);A(this,"overrun",0);A(this,"prevPhase",-1);A(this,"turboWas",!1);A(this,"turboLin",0);A(this,"policeLin",0);A(this,"ambLin",0);A(this,"crashRoot",null);A(this,"heardMode","");A(this,"policeD",-1);A(this,"policeX",0);A(this,"policeZ",0);A(this,"ambD",-1);A(this,"ambX",0);A(this,"ambZ",0);A(this,"speed",0);A(this,"wx",0);A(this,"wz",0);try{this.muted=localStorage.getItem("aw_muted")==="1"}catch{}this.stats.muted=this.muted,this.quick=document.createElement("button"),this.quick.id="awmutebtn",this.quick.type="button",this.quick.setAttribute("aria-label","Mute game audio");let t=document.createElement("style");t.textContent="#awmutebtn{position:fixed;z-index:50;left:12px;top:calc(96px + env(safe-area-inset-top));width:42px;height:42px;border:2px solid #ffffff73;border-radius:50%;background:#0009;color:#fff;font:20px system-ui;display:grid;place-items:center;padding:0}",document.head.appendChild(t),this.quick.onclick=i=>{i.stopPropagation(),this.toggle()},document.body.appendChild(this.quick),this.syncButtons(),this.mountSetting(0),this.mountCredit(0);let n=()=>{this.muted||this.start()};addEventListener("pointerdown",n,!0),addEventListener("keydown",i=>this.onKey(i,!0)),addEventListener("keyup",i=>this.onKey(i,!1)),addEventListener("blur",()=>{this.keyFwd=!1,this.keyBrk=!1})}onKey(e,t){if(e.target instanceof HTMLInputElement)return;let n=e.code==="KeyW"||e.code==="ArrowUp",i=e.code==="Space"||e.code==="KeyS"||e.code==="ArrowDown";n&&(this.keyFwd=t),i&&(this.keyBrk=t),t&&!this.muted&&this.start()}throttle(){let e=this.g.held,t=this.g.joy;if(e?.brake||this.keyBrk)return 0;let n=e?.gas||this.keyFwd?1:0,i=t?.y||0,s=i<0?i<-1?1:-i:0;return s>n?s:n}write(e,t,n,i){return Math.abs(t-n)<i?t:(e.value=n,n)}approach(e,t,n,i){return n<=0?e:e+(t-e)*(1-Math.exp(-i*n))}noiseBuffer(e){let t=Math.floor(e.sampleRate*2),n=e.createBuffer(1,t,e.sampleRate),i=n.getChannelData(0),s=305419896;for(let r=0;r<t;r++)s=Math.imul(s,1664525)+1013904223|0,i[r]=((s>>>8)/8388607-1)*.7;return n}cycleBuffer(e,t,n,i){let s=Dl(e.sampleRate,t),r=e.createBuffer(1,s,e.sampleRate);return Nd(e.sampleRate,t,n,i.subarray(0,s)),r.getChannelData(0).set(i.subarray(0,s)),r}loop(e,t){let n=e.createBufferSource();return n.buffer=t,n.loop=!0,n.start(),n}tone(e,t,n){let i=e.createOscillator(),s=e.createGain();return i.type=t,i.frequency.value=n,s.gain.value=0,i.connect(s),i.start(),{osc:i,gain:s,hz:n,amp:0}}tap(e,t,n,i){let s=e.createBiquadFilter(),r=e.createGain();return s.type=n,s.frequency.value=i,s.Q.value=.7,r.gain.value=0,t.connect(s),s.connect(r),{filter:s,gain:r,f:i,amp:0}}voice(e,t,n,i,s){let r=this.loop(e,this.cycleBuffer(e,n,!1,i)),a=this.loop(e,this.cycleBuffer(e,n,!0,i)),o=e.createOscillator();o.type="sine",o.frequency.value=40,o.start();let c=e.createGain(),l=e.createGain(),u=e.createGain(),d=e.createBiquadFilter(),f=e.createGain();c.gain.value=.7,l.gain.value=0,u.gain.value=0,f.gain.value=0,d.type="lowpass",d.frequency.value=500,d.Q.value=.45,r.connect(c).connect(d),a.connect(l).connect(d),d.connect(s).connect(f),o.connect(u).connect(f);let p=this.tap(e,t,"bandpass",240);p.gain.connect(f);let m=(Ma(n)>0,1);return r.playbackRate.value=m,a.playbackRate.value=m,{body:r,edge:a,sub:o,bodyGain:c,edgeGain:l,subGain:u,noiseFilter:p.filter,noiseGain:p.gain,filter:d,out:f,rate:m,bg:.7,eg:0,sg:0,ng:0,nf:240,ff:500,og:0,hz:40,level:0}}shape(e){let t=e.createWaveShaper(),n=new Float32Array(256),i=1.25,s=Math.tanh(i);for(let r=0;r<256;r++){let a=r/255*2-1;n[r]=Math.tanh(a*i)/s}return t.curve=n,t.oversample="none",t}start(){if(this.audio){this.audio.ctx.resume();return}try{let e=new AudioContext,t=e.createGain(),n=e.createDynamicsCompressor();n.threshold.value=-16,n.knee.value=18,n.ratio.value=3.5,n.attack.value=.012,n.release.value=.28,t.gain.value=0,t.connect(n).connect(e.destination);let i=this.loop(e,this.noiseBuffer(e)),s=new Float32Array(Dl(e.sampleRate,"car")),r=this.voice(e,i,"car",s,this.shape(e)),a=this.voice(e,i,"moto",s,this.shape(e));r.out.connect(t),a.out.connect(t);let o=e.createBiquadFilter();o.type="lowpass",o.frequency.value=160;let c=e.createGain();c.gain.value=0,i.connect(o).connect(c).connect(t);let l=e.createBiquadFilter();l.type="lowpass",l.frequency.value=640,l.Q.value=.5;let u=e.createGain();u.gain.value=0;let d=e.createGain();d.gain.value=0;let f=this.tone(e,"sine",78);i.connect(l).connect(u).connect(d),f.gain.connect(d),d.connect(t);let p=this.tap(e,i,"lowpass",180);p.filter.Q.value=.4,p.gain.connect(t);let m=this.tap(e,i,"bandpass",1100);m.filter.Q.value=.8,m.gain.connect(t);let g=this.tone(e,"sine",38),b=this.tone(e,"sine",55);g.gain.connect(t),b.gain.connect(t);let _=e.createBiquadFilter();_.type="bandpass",_.frequency.value=300,_.Q.value=.65;let v=e.createGain();v.gain.value=0,i.connect(_).connect(v).connect(t);let x=e.createStereoPanner(),y=e.createGain();y.gain.value=0;let w=e.createBiquadFilter();w.type="lowpass",w.frequency.value=1700,w.Q.value=.5;let E=this.tone(e,"sine",700),M=this.tone(e,"sine",1050);E.gain.connect(w),M.gain.connect(w),w.connect(x).connect(y).connect(t);let S=e.createStereoPanner(),T=e.createGain();T.gain.value=0;let I=e.createBiquadFilter();I.type="lowpass",I.frequency.value=1600,I.Q.value=.5;let R=this.tone(e,"sine",680),B=this.tone(e,"sine",940);R.gain.connect(I),B.gain.connect(I),I.connect(S).connect(T).connect(t);let F=e.createOscillator();F.type="sine",F.frequency.value=80;let L=e.createGain();L.gain.value=0,F.connect(L).connect(t),F.start();let N=this.tap(e,i,"lowpass",420);N.filter.Q.value=.4,N.gain.connect(t);let z=this.tap(e,i,"bandpass",1500);z.filter.Q.value=.6,z.gain.connect(t);let G=this.tap(e,i,"bandpass",1600);G.gain.connect(t),this.audio={ctx:e,master:t,noise:i,car:r,moto:a,clunk:c,planeFilter:l,planeNoise:u,planeTone:f,planeOut:d,roar:p,crackle:m,sub:g,sub2:b,whooshFilter:_,whoosh:v,police:E,police2:M,policePan:x,policeOut:y,amb:R,amb2:B,ambPan:S,ambOut:T,thump:F,thumpGain:L,crunch:N,metal:z,skid:G},this.stats.started=!0,this.stats.nodes=48,this.stats.trafficVoices=0,e.resume()}catch(e){console.warn("[aw-audio] WebAudio unavailable",e)}}toggle(){this.muted=!this.muted,this.stats.muted=this.muted;try{localStorage.setItem("aw_muted",this.muted?"1":"0")}catch{}this.muted||this.start(),this.syncButtons()}syncButtons(){this.quick.textContent=this.muted?"\u{1F507}":"\u{1F50A}",this.quick.title=this.muted?"Unmute audio":"Mute audio",this.setting&&(this.setting.textContent=this.muted?"Sound: OFF":"Sound: ON")}mountSetting(e){let t=document.getElementById("awtime");if(!t){e<60&&setTimeout(()=>this.mountSetting(e+1),500);return}let n=document.createElement("div");n.className="lbl",n.textContent="World audio";let i=document.createElement("div");i.className="row";let s=document.createElement("button");s.type="button",s.onclick=()=>this.toggle(),i.appendChild(s),t.append(n,i),this.setting=s,this.syncButtons()}mountCredit(e){let t=document.querySelector("#credits ul");if(!t){e<40&&setTimeout(()=>this.mountCredit(e+1),500);return}if(t.querySelector(".aw-audio"))return;let n=document.createElement("li");n.className="aw-audio",n.innerHTML='Engines, sirens, crash impact and turbo: original procedural synthesis (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 1.0</a>, no third-party samples)',t.appendChild(n)}clunkAt(e){let t=this.audio;if(!t)return;let n=t.clunk.gain;n.cancelScheduledValues(e),n.setValueAtTime(1e-4,e),n.exponentialRampToValueAtTime(.04,e+.01),n.exponentialRampToValueAtTime(1e-4,e+.07)}boom(e,t){let n=this.audio;if(!n)return;let i=t>420?0:1-t/420,s=i*i;if(s<.05)return;let r=n.thump.frequency,a=n.thumpGain.gain;r.cancelScheduledValues(e),r.setValueAtTime(130,e),r.exponentialRampToValueAtTime(34,e+.34),a.cancelScheduledValues(e),a.setValueAtTime(1e-4,e),a.exponentialRampToValueAtTime(.15*s,e+.016),a.exponentialRampToValueAtTime(1e-4,e+.48);let o=n.crunch.gain.gain;o.cancelScheduledValues(e),o.setValueAtTime(1e-4,e),o.exponentialRampToValueAtTime(.08*s,e+.012),o.exponentialRampToValueAtTime(1e-4,e+.4);let c=n.metal.gain.gain;c.cancelScheduledValues(e),c.setValueAtTime(1e-4,e),c.exponentialRampToValueAtTime(.03*s,e+.008),c.exponentialRampToValueAtTime(1e-4,e+.13),this.stats.impacts+=1}whoosh(e){let t=this.audio;if(!t)return;let n=t.whooshFilter.frequency,i=t.whoosh.gain;n.cancelScheduledValues(e),n.setValueAtTime(150,e),n.exponentialRampToValueAtTime(1700,e+.38),n.exponentialRampToValueAtTime(380,e+.85),i.cancelScheduledValues(e),i.setValueAtTime(1e-4,e),i.exponentialRampToValueAtTime(.05,e+.07),i.exponentialRampToValueAtTime(1e-4,e+.9)}silence(e,t){e.level=this.approach(e.level,0,t,10),e.og=this.write(e.out.gain,e.og,e.level,.003),e.eg=this.write(e.edgeGain.gain,e.eg,this.approach(e.eg,0,t,8),.005),e.ng=this.write(e.noiseGain.gain,e.ng,this.approach(e.ng,0,t,8),.003)}snap(e,t,n){for(let i=0;i<8;i++)Fl(e,this.speed,0,.08,t,n);e.shift=0}engine(e,t,n,i,s,r,a){let o=Fl(n,this.speed,s,a,i,r);this.arm<=0&&o===1&&this.clunkAt(r);let c=n.rpm/60/Ma(e);n.rpm<i.idle*1.25&&s<.15&&(c*=1+.012*Math.sin(r*2.6)+.007*Math.sin(r*5.2)),c<.1?c=.1:c>6&&(c=6),Math.abs(t.rate-c)>=.004&&(t.body.playbackRate.value=c,t.edge.playbackRate.value=c,t.rate=c);let l=(n.rpm-i.idle)/(i.red-i.idle),u=l<0?0:l>1?1:l,d=e==="moto"?2300:1850,f=(e==="moto"?480:400)+u*(e==="moto"?1100:800)+s*(e==="moto"?700:550);f>d&&(f=d),t.ff=this.write(t.filter.frequency,t.ff,f,8);let p=n.rpm/30;t.hz=this.write(t.sub.frequency,t.hz,p<28?28:p,.6),t.bg=this.write(t.bodyGain.gain,t.bg,.62,.01),t.eg=this.write(t.edgeGain.gain,t.eg,s*.42+u*s*.16,.008),t.sg=this.write(t.subGain.gain,t.sg,.05+u*.04+s*.02,.004);let m=.008+s*.02+u*.006;if(e==="moto"&&this.overrun>0){let _=Math.sin(r*53)*Math.sin(r*19);m+=(_>0?_*_*_*_:0)*.03*(this.overrun>.25?1:this.overrun*4)}t.ng=this.write(t.noiseGain.gain,t.ng,m,.002),t.nf=this.write(t.noiseFilter.frequency,t.nf,160+u*640+s*380,12);let g=.15+s*.07+u*.035;n.shift>.1&&(g*=.74);let b=e==="moto"?.24:.26;return g>b&&(g=b),t.level=this.approach(t.level,g,a,9),t.og=this.write(t.out.gain,t.og,t.level,.003),t.level}responders(e,t,n,i,s,r){if(this.policeD=-1,this.ambD=-1,n&&i>=1){let a=this.g.real?.amb,o=a?.group?.children;if(o){let c=this.crashRoot;if(!c||c.parent==null){c=null;for(let u=0;u<o.length;u++)o[u].name==="aw:crash"&&(c=o[u]);this.crashRoot=c}if(c){let u=c.children;for(let d=0;d<u.length;d++){let f=u[d].name;if(f==="aw:ev:everest"||f==="aw:ev:isuzu"){this.place(u[d]),this.policeX=this.wx,this.policeZ=this.wz,this.policeD=Math.hypot(this.policeX-e,this.policeZ-t);break}}}if(this.policeD<0){let u=window.__aw?.emerg?.ext;u&&(this.policeD=u.d,this.policeX=e,this.policeZ=t)}let l=a?.cars;if(l){let u=1e9,d=Math.hypot(s-e,r-t)<420;for(let f=0;f<l.length;f++){let p=l[f];if(!p.g.visible)continue;let m=p.g.children,g=!1;for(let y=0;y<m.length;y++){let w=m[y].name;if(w==="aw:ev:ambY"||w==="aw:ev:ambP"){g=!0;break}}if(!g)continue;this.place(p.g);let b=this.wx,_=this.wz,v=Math.hypot(b-s,_-r),x=Math.hypot(b-e,_-t);v>260&&!(d&&x<130)||x<u&&(u=x,this.ambX=b,this.ambZ=_,this.ambD=x)}}}}else this.crashRoot=null}place(e){let t=0,n=0,i=e;for(;i;)t+=i.position.x,n+=i.position.z,i=i.parent;this.wx=t,this.wz=n}atten(e){if(e<0||e>Ud)return 0;let t=1-e/Ud;return t*t*.04}update(){let e=this.audio;if(!e)return;let t=e.ctx.currentTime,n=performance.now()*.001,i=this.prevT>0?t-this.prevT:0,s=this.prevWall>0?n-this.prevWall:.016;this.prevT=t,this.prevWall=n;let r=i>s?i:s;if(r>0||(r=.016),r>.05&&(r=.05),r<0)return;this.arm>0&&(this.arm=this.arm>r?this.arm-r:0);let a=this.g.S,o=a.mode;this.stats.mode=o,this.speed=Math.abs(a.car.s||0);let c=o==="car"||o==="moto"?this.throttle():0,l=c>(o==="moto"?this.motoThr:this.carThr);o==="moto"?this.motoThr=this.approach(this.motoThr,c,r,l?14:5):o==="car"&&(this.carThr=this.approach(this.carThr,c,r,l?12:4.5)),o==="moto"&&this.motoThr<.08&&this.motoDrive.rpm>5600?this.overrun=.38:this.overrun=this.overrun>r?this.overrun-r:0,o!==this.heardMode&&(this.heardMode=o,o==="car"?this.snap(this.carDrive,ya,t):o==="moto"&&this.snap(this.motoDrive,wa,t));let u=o==="car"?this.engine("car",e.car,this.carDrive,ya,this.carThr,t,r):(this.silence(e.car,r),0),d=o==="moto"?this.engine("moto",e.moto,this.motoDrive,wa,this.motoThr,t,r):(this.silence(e.moto,r),0),f=o==="moto"?this.motoDrive:this.carDrive,p=o==="moto"?this.motoThr:this.carThr;this.stats.gear=o==="car"||o==="moto"?f.gear+1:0,this.stats.rpm=o==="car"||o==="moto"?f.rpm:0,this.stats.throttle=o==="car"||o==="moto"?p:0,this.stats.level=o==="moto"?d:o==="car"?u:0;let g=!!(this.g.held?.brake||this.keyBrk),b=Math.abs(a.car.drift||0),v=(o==="moto"?b:o==="car"&&g?Math.min(1,this.speed/20):0)*(o==="moto"?.035:.025);e.skid.amp=this.write(e.skid.gain.gain,e.skid.amp,v,.002);let x=Math.abs(a.plane.s||0),y=a.plane.thr||0,w=o==="plane",E=window,M=!!(E.__awTurbo&&w),S=w?E.__awTurboLvl||(M?1:0):0;this.turboLin=this.approach(this.turboLin,S,r,M?6:3),this.turboLin<.004&&!M&&(this.turboLin=0),M&&!this.turboWas&&this.whoosh(t),this.turboWas=M,this.stats.turbo=this.turboLin;let T=1-this.turboLin*.72,I=w?(.045+y*.03)*(T<.28?.28:T):0;e.planeOut.gain.value=I,e.planeNoise.gain.value=w?.55:0,e.planeFilter.frequency.value=520+y*700,e.planeTone.hz=this.write(e.planeTone.osc.frequency,e.planeTone.hz,72+y*46+x*.15,.5),e.planeTone.amp=this.write(e.planeTone.gain.gain,e.planeTone.amp,w?.22:0,.01);let R=this.turboLin;e.roar.amp=this.write(e.roar.gain.gain,e.roar.amp,R*.055,.002),e.roar.f=this.write(e.roar.filter.frequency,e.roar.f,150+R*160,4),e.sub.hz=this.write(e.sub.osc.frequency,e.sub.hz,32+R*18,.3),e.sub2.hz=this.write(e.sub2.osc.frequency,e.sub2.hz,47+R*12,.3),e.sub.amp=this.write(e.sub.gain.gain,e.sub.amp,R*.034,.002),e.sub2.amp=this.write(e.sub2.gain.gain,e.sub2.amp,R*.016,.001);let B=Math.sin(t*37)*Math.sin(t*17.5),F=B>0?B*B:0;e.crackle.amp=this.write(e.crackle.gain.gain,e.crackle.amp,R*(.006+F*.016),.001);let N=window.__aw?.crash?.stats,z=N?.phase??0,G=this.g.camera.position;if(this.prevPhase===0&&z>=1){let O=(N?.x||G.x)-G.x,Q=(N?.z||G.z)-G.z;this.boom(t,Math.hypot(O,Q))}this.prevPhase=z,this.responders(G.x,G.z,!!N?.active,z,N?.x||0,N?.z||0);let V=this.policeD>=0&&this.ambD>=0?.82:1;if(this.policeLin=this.approach(this.policeLin,this.atten(this.policeD)*V,r,5),this.ambLin=this.approach(this.ambLin,this.atten(this.ambD)*V,r,5),e.policeOut.gain.value=this.policeLin,e.ambOut.gain.value=this.ambLin,this.stats.police=this.policeLin,this.stats.ambulance=this.ambLin,this.policeLin>.004&&this.policeD>=0){let O=.5+.5*Math.sin(t*1.55),Q=560+640*O*O*(3-2*O);e.police.hz=this.write(e.police.osc.frequency,e.police.hz,Q,1),e.police2.hz=this.write(e.police2.osc.frequency,e.police2.hz,Q*1.5,1),e.police.amp=this.write(e.police.gain.gain,e.police.amp,.72,.02),e.police2.amp=this.write(e.police2.gain.gain,e.police2.amp,.22,.02);let $=(this.policeX-G.x)/70;e.policePan.pan.value=$<-.75?-.75:$>.75?.75:$}if(this.ambLin>.004&&this.ambD>=0){let O=.5+.5*Math.sin(t*7.4);e.amb.hz=this.write(e.amb.osc.frequency,e.amb.hz,660,1),e.amb2.hz=this.write(e.amb2.osc.frequency,e.amb2.hz,960,1),e.amb.amp=this.write(e.amb.gain.gain,e.amb.amp,.3+.7*(1-O),.02),e.amb2.amp=this.write(e.amb2.gain.gain,e.amb2.amp,.3+.7*O,.02);let Q=(this.ambX-G.x)/70;e.ambPan.pan.value=Q<-.75?-.75:Q>.75?.75:Q}let W=this.muted||document.hidden?0:T0;this.masterLin=this.approach(this.masterLin,W,r>0?r:.016,8),Math.abs(e.master.gain.value-this.masterLin)>.002&&(e.master.gain.value=this.masterLin)}};var R0=[["Sunrise",6.75],["Noon",12.5],["Sunset",18.25],["Night",21.5]];function kd(h,e){let t=document.createElement("style");t.textContent=`
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
      <div class="row">${R0.map(([u,d])=>`<button data-h="${d}">${u}</button>`).join("")}</div>
      <div class="row"><button id="awfreeze"></button></div>
      <div class="lbl">Auto FPS guard</div>
      <div class="row"><button id="awguard"></button></div><div id="awfps"></div>`;let a=document.getElementById("streset");s.insertBefore(r,a),r.querySelectorAll("[data-h]").forEach(u=>u.addEventListener("click",()=>h.setHour(+u.dataset.h)));let o=r.querySelector("#awfreeze"),c=r.querySelector("#awguard");o.addEventListener("click",()=>h.setFrozen(!h.frozen)),c.addEventListener("click",()=>e.setEnabled(!e.enabled));let l=()=>{o.textContent=h.frozen?"\u25B6 Resume clock":"\u23F8 Freeze clock",c.textContent=e.enabled?"On (tap to turn off)":"Off (tap to turn on)"};h.onChange(l),e.onChange(l),l()};return i(),()=>{let s=document.getElementById("awfps");s&&(s.textContent=e.describe())}}var Mi=class{constructor(e,t,n,i){A(this,"geo",e);A(this,"mat",t);A(this,"o",n);A(this,"parent",i);A(this,"im",null);A(this,"cap",0);A(this,"srcs",new Set);A(this,"matR",{start:0,count:0});A(this,"colR",{start:0,count:0})}get size(){return this.srcs.size}add(e){this.srcs.add(e);let t=0;for(let n of this.srcs)t+=n.n;t>this.cap&&this.grow(t)}remove(e){this.srcs.delete(e)}grow(e){let t=256;for(;t<e;)t*=2;let n=this.im,i=new me(this.geo,this.mat,0);i.instanceMatrix=new Ge(new Float32Array(t*16),16),i.name=this.o.name,i.castShadow=this.o.castShadow,i.receiveShadow=this.o.receiveShadow,i.frustumCulled=!1,i.matrixAutoUpdate=!1,i.count=0,i.visible=!1,this.o.colored&&(i.instanceColor=new Ge(new Float32Array(t*3),3)),n&&(i.count=n.count,i.visible=n.visible,i.instanceMatrix.array.set(n.instanceMatrix.array.subarray(0,n.count*16)),n.instanceColor&&i.instanceColor&&i.instanceColor.array.set(n.instanceColor.array.subarray(0,n.count*3)),n.removeFromParent(),n.dispose()),this.parent.add(i),this.im=i,this.cap=t}fill(e,t,n,i){let s=this.im;if(!s)return 0;let r=n<0?-1:n*n,a=i*i,o=s.instanceMatrix.array,c=s.instanceColor?s.instanceColor.array:null,l=0;for(let u of this.srcs){let d=Math.max(u.box[0]-e,0,e-u.box[2]),f=Math.max(u.box[1]-t,0,t-u.box[3]);if(d*d+f*f>=a)continue;let p=u.mats,m=u.cols;for(let g=0;g<u.n;g++){let b=u.cx[g]-e,_=u.cz[g]-t,v=b*b+_*_;if(v>=a||v<r)continue;let x=g*16,y=l*16;for(let w=0;w<16;w++)o[y+w]=p[x+w];c&&m&&(c[l*3]=m[g*3],c[l*3+1]=m[g*3+1],c[l*3+2]=m[g*3+2]),l++}}return s.count=l,s.visible=l>0,l>0&&(Es(s.instanceMatrix,this.matR,l*16),s.instanceColor&&Es(s.instanceColor,this.colR,l*3)),l}dispose(){this.im&&(this.im.removeFromParent(),this.im.dispose(),this.im=null),this.cap=0}};function Es(h,e,t){e.start=0,e.count=t;let n=h.updateRanges;(n.length===0||n[0]!==e)&&(n.length=0,n.push(e)),h.needsUpdate=!0}var Od=new Set(["bld:kit","parked","parkedHi","props"]),Sa=class{constructor(e,t=null){A(this,"q",e);A(this,"poolParent",t);A(this,"folded",0);A(this,"buckets",0);A(this,"lastX",1e9);A(this,"lastZ",1e9);A(this,"dirty",new Set);A(this,"pools",new Map);A(this,"dirtyPools",new Set);A(this,"open",new Set);A(this,"job",null);A(this,"live",new Set)}touch(e){!e?.group||e.__awFoldDone||(this.open.add(e),e.__awFold=(e.__awFold||0)+1,e.__awHideStack=[e.group],this.conceal(e))}afterJobs(e){let t=performance.now(),n=0;for(;performance.now()-t<8&&n++<6;){let i=this.job?.r;if(i&&(i.__awFoldDone||!i.group?.parent)&&(this.job=null,i=void 0),!i){for(let r of e.values())if(!(r.__awFoldDone||!r.group?.parent)&&(r.__awFold||r.__awHideStack)){i=r;break}}if(!i)break;this.conceal(i);let s=i.__awFold||0;if(this.fold(i,Math.max(.5,8-(performance.now()-t))),this.job?.r===i||(i.__awFold||0)===s&&!i.__awHideStack)break}}fold(e,t=1e9){if(e.__awFoldDone||!e.group)return!1;let n=this.job,i=e.__awFold||0;(!n||n.r!==e)&&(n=this.job={r:e,stack:[e.group],groups:new Map,seen:new Set,lists:null,i:0,out:e.__awInst||[]});let s=performance.now();if(!n.lists){if(!this.gather(n,s,t))return!1;n.lists=[...n.groups.values()].filter(r=>r.length>=2)}for(;n.i<n.lists.length&&(this.foldList(e,n.lists[n.i++],n.out),!(performance.now()-s>t)););return n.i<n.lists.length||(this.job=null,e.__awInst=n.out,this.poolParent||this.dirty.add(e),this.live.add(e),(e.__awFold||0)!==i||e.__awHideStack)||(this.release(e),e.__awFold=0,this.open.delete(e),e.state!=="built")?!1:(e.__awFoldDone=!0,!0)}conceal(e){let t=e.__awHideStack;if(!t||!t.length||!e.group){e.__awHideStack=void 0;return}let n=e.__awHid||(e.__awHid=[]),i=performance.now(),s=0;for(;t.length&&s<8e3&&performance.now()-i<3;){let r=t.pop(),a=r.children;for(let c=a.length-1;c>=0;c--)t.push(a[c]);let o=r;s++,o.isInstancedMesh&&Od.has(o.name)&&o.visible&&o.count!==0&&(o.visible=!1,n.push(o))}t.length||(e.__awHideStack=void 0)}release(e){let t=e.__awHid;if(t){for(let n of t)n.parent&&(n.visible=!0);t.length=0}}gather(e,t,n){let i=e.stack;for(let s=1;i.length;s++){let r=i.pop(),a=r.children;for(let c=a.length-1;c>=0;c--)i.push(a[c]);let o=r;if(o.isInstancedMesh&&Od.has(o.name)&&!Array.isArray(o.material)&&o.count!==0){let c=o.parent;c&&!e.seen.has(c)&&(c.updateWorldMatrix(!0,!1),e.seen.add(c)),o.updateWorldMatrix(!1,!1);let l=o.name+"|"+o.geometry.uuid+"|"+o.material.uuid+"|"+o.castShadow+"|"+o.receiveShadow+"|"+(o.instanceColor?1:0),u=e.groups.get(l);u||e.groups.set(l,u=[]),u.push(o)}if((s&127)===0&&performance.now()-t>n)return!1}return!0}foldList(e,t,n){let i=new P,s=new P;{if(t.some(_=>!_.parent))return;let r=0;for(let _ of t)r+=_.count;let a=new Float32Array(r*16),o=new Float32Array(r),c=new Float32Array(r),l=t[0].instanceColor?new Float32Array(r*3):null,u=0;for(let _ of t)for(let v=0;v<_.count;v++,u++)if(s.fromArray(_.instanceMatrix.array,v*16),i.multiplyMatrices(_.matrixWorld,s),i.toArray(a,u*16),o[u]=a[u*16+12],c[u]=a[u*16+14],l&&_.instanceColor)for(let x=0;x<3;x++)l[u*3+x]=_.instanceColor.array[v*3+x];let d=t[0],f=1e9,p=-1e9,m=1e9,g=-1e9;for(let _=0;_<r;_++)f=Math.min(f,o[_]),p=Math.max(p,o[_]),m=Math.min(m,c[_]),g=Math.max(g,c[_]);if(this.poolParent){let _=d.name+"|"+d.geometry.uuid+"|"+d.material.uuid+"|"+d.castShadow+"|"+d.receiveShadow+"|"+(l?1:0),v=this.pools.get(_);v||this.pools.set(_,v=new Mi(d.geometry,d.material,{name:"aw:inst:"+d.name,castShadow:d.castShadow,receiveShadow:d.receiveShadow,colored:!!l},this.poolParent));let x={kind:d.name,im:null,pool:v,mats:a,cols:l,cx:o,cz:c,n:r,box:[f,m,p,g]};v.add(x),this.dirtyPools.add(v),v.im&&Qd(v.im);for(let y of t)Gd(y),this.folded++;n.push(x),this.buckets++;return}let b=new me(d.geometry,d.material,r);b.name="aw:inst:"+d.name,b.castShadow=d.castShadow,b.receiveShadow=d.receiveShadow,b.frustumCulled=!1,b.matrixAutoUpdate=!1,b.count=0,b.visible=!1,l&&(b.instanceColor=new Ge(new Float32Array(r*3),3)),Qd(b),e.group.add(b);for(let _ of t)Gd(_),this.folded++;n.push({kind:d.name,im:b,mats:a,cols:l,cx:o,cz:c,n:r,box:[f,m,p,g]}),this.buckets++}}range(e){let t=this.q,n=t.contactR||220,i=t.parkHi||35;return e==="bld:kit"?[-1,t.kitR||0]:e==="parked"?[i,t.parkR||n]:e==="parkedHi"?[-1,i]:[-1,(t.detailR||150)*.5]}cull(e,t,n){for(let i of e.__awInst||[]){if(!i.im)continue;let[s,r]=this.range(i.kind),a=s<0?-1:s*s,o=(r+3)*(r+3),c=Math.max(i.box[0]-t,0,t-i.box[2]),l=Math.max(i.box[1]-n,0,n-i.box[3]);if(c*c+l*l>=o){i.im.count&&(i.im.count=0,i.im.visible=!1);continue}let u=i.im.instanceMatrix.array,d=i.im.instanceColor?i.im.instanceColor.array:null,f=0;for(let p=0;p<i.n;p++){let m=i.cx[p]-t,g=i.cz[p]-n,b=m*m+g*g;if(b>=o||b<a)continue;let _=p*16,v=f*16;for(let x=0;x<16;x++)u[v+x]=i.mats[_+x];d&&i.cols&&(d[f*3]=i.cols[p*3],d[f*3+1]=i.cols[p*3+1],d[f*3+2]=i.cols[p*3+2]),f++}if(i.im.count=f,i.im.visible=f>0,f>0){let p=i;Es(i.im.instanceMatrix,p._mr||(p._mr={start:0,count:0}),f*16),i.im.instanceColor&&Es(i.im.instanceColor,p._cr||(p._cr={start:0,count:0}),f*3)}}}pending(){return this.open.size+(this.job?1:0)}update(e,t,n){this.job&&(!this.job.r.group||!this.job.r.group.parent)&&(this.live.add(this.job.r),this.job.r.__awInst=this.job.out,this.job=null);let i=this.job?this.job.r:void 0;if(i&&(i.__awFoldDone||!i.group?.parent)&&(this.job=null,i=void 0),!i){for(let r of e.values())if(!(r.__awFoldDone||!r.group?.parent)&&(r.state==="built"||r.__awFold||r.__awHideStack)){i=r;break}}i&&this.fold(i,3);for(let r of this.live)if(!r.group||!r.group.parent){for(let a of r.__awInst||[])a.im&&a.im.dispose(),a.pool&&(a.pool.remove(a),this.dirtyPools.add(a.pool));this.live.delete(r),this.dirty.delete(r)}if((t-this.lastX)**2+(n-this.lastZ)**2>16){this.lastX=t,this.lastZ=n;for(let r of this.live)this.dirty.add(r);for(let r of this.pools.values())this.dirtyPools.add(r)}for(let[r,a]of this.pools)if(this.dirtyPools.has(a)){let[o,c]=this.range(r.slice(0,r.indexOf("|")));a.fill(this.lastX,this.lastZ,o,c+3)}this.dirtyPools.clear();for(let r of this.dirty)this.cull(r,this.lastX,this.lastZ);this.dirty.clear()}};function Gd(h){h.parent?.remove(h),h.dispose()}function Qd(h){let e=window.__aw?.mperf;if(e)try{e.prime(h)}catch{}}var Ca=class{constructor(e){A(this,"g");A(this,"real");A(this,"mobile");A(this,"stats");A(this,"carSeen",new WeakSet);A(this,"t",0);A(this,"heroCap");A(this,"inst",null);A(this,"postDone",!1);A(this,"regionChanged",(e,t)=>{for(let n=t;n<e.children.length;n++)e.children[n].traverse(i=>{i.name==="bld:kit"&&i.castShadow&&(i.castShadow=!1,this.stats.kitNoShadow++)})});A(this,"trimPending",!1);A(this,"carDone",new WeakSet);A(this,"pedsDone",!1);this.g=e,this.real=e.real;let t=U.get("perfmobile"),n=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window;this.mobile=t==="1"?!0:t==="0"?!1:n,this.stats={instFolded:0,instBuckets:0,carMeshes:"",peds:"",glassFixed:0,frozen:0,merged:0,mergedFrom:0,kitNoShadow:0,heroHidden:0,mobile:this.mobile,changes:[]};let i=this.real.q.name;this.heroCap=i==="low"?700:i==="med"?1e3:this.mobile?1400:this.real.q.id==="desktop"?5e3:2e3,window.__awMMDiv=3,this.tierProfile(),U.get("inst")!=="0"&&(this.inst=new Sa(this.real.q,U.get("ipool")!=="0"?this.real.group:null)),this.hookUpdate(),this.hookHero(),this.fixGlass()}tierProfile(){let e=this.real.q,t=this.g.renderer,n=this.stats.changes;if(this.mobile){if(e.name==="high"){let i=Math.min(window.devicePixelRatio||1,1.5);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 2->"+i));let s=this.real.sky.sun.shadow;s.mapSize.x>2048&&(s.mapSize.set(2048,2048),s.map?.dispose(),s.map=null,n.push("shadow 4096->2048")),Object.assign(e,{radius:1400,bldR:1400,roadR:900,kitR:100,parkR:250,contactR:300,detailR:500}),n.push("radius 2000->1400, bldR 1400, roadR 900, kitR 100, parkR 250, detailR 500"),this.trimPending=!0}else if(e.name==="med"){let i=Math.min(window.devicePixelRatio||1,1.35);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 1.5->"+i))}}}fixPost(){if(this.postDone)return;let e=window.__awPost;if(!e)return;this.postDone=!0,this.mobile&&e.ao&&(e.ao.enabled=!1,this.stats.changes.push("GTAO off"));let t=e.composer;if(this.mobile&&t)for(let n of[t.renderTarget1,t.renderTarget2])n&&n.samples>2&&(n.samples=2,n.dispose(),this.stats.changes.push("MSAA 4->2"))}fixGlass(){if(this.real.q.id==="desktop"&&!this.mobile)return;let e=[],t=this.g.car;t&&e.push(t);for(let n of this.g.scene.children)n.name!=="realistic"&&e.push(n);for(let n of e)this.carSeen.has(n)||(this.carSeen.add(n),n.traverse(i=>{let s=i.material;!s||Array.isArray(s)||!(s.transmission&&s.transmission>0)||(s.transmission=0,s.transparent=!0,s.color?.set(790807),s.opacity=.72,s.depthWrite=!1,s.roughness!==void 0&&(s.roughness=Math.min(s.roughness,.08)),s.needsUpdate=!0,this.stats.glassFixed++)}))}freeze(e,t){let n=e.userData;if(n.awFrozen)return;n.awFrozen=!0,n.awN=-1;let i=Object.getPrototypeOf(e).updateMatrixWorld;e.updateMatrixWorld=function(s){let r=this.userData;(s||this.matrixWorldNeedsUpdate||r.awN!==this.children.length)&&(r.awN!==this.children.length&&t&&t(this,r.awN>this.children.length?0:Math.max(0,r.awN)),r.awN=this.children.length,i.call(this,!0))},this.stats.frozen++}merge(e,t){let n=e.userData,i=0;if(e.traverse(()=>i++),n.awMergedN===i)return;e.updateMatrixWorld(!0);let s=new P().copy(e.matrixWorld).invert(),r=new Map,a=new Set;e.traverse(l=>{let u=l;if(!u.isMesh||u.isInstancedMesh||u.isSkinnedMesh||!u.geometry||!u.material||!u.visible||u.name.startsWith("aw:")||u.morphTargetInfluences||u.matrixWorld.determinant()<0)return;let d=u.parent,f=!0;for(;d&&d!==e;)f=f&&d.visible&&!(t&&t(d)),d=d.parent;if(!f||t&&t(u))return;let p=u.geometry,m=Object.keys(p.attributes).sort().join(","),g=[];if(Array.isArray(u.material)){if(!p.index||!p.groups.length)return;for(let b of p.groups){let _=u.material[b.materialIndex??0];_&&g.push({m:u,mat:_,start:b.start,count:b.count})}}else g.push({m:u,mat:u.material,start:0,count:1/0});for(let b of g){let _=[b.mat.uuid,m,p.index?1:0,u.castShadow,u.receiveShadow,u.renderOrder].join("|"),v=r.get(_);v||r.set(_,v=[]),v.push(b)}});let o=new P,c=new Map;for(let l of r.values())for(let u of l)c.set(u.m,(c.get(u.m)??!0)&&l.length>=2);for(let l of r.values()){let u=l.filter(g=>c.get(g.m));if(u.length<2)continue;let d=[];for(let g of u){let b=g.m.geometry,_=b.clone();_.morphAttributes={},_.clearGroups(),b.index&&g.count!==1/0&&_.setIndex(Array.from(b.index.array.slice(g.start,g.start+g.count))),o.multiplyMatrices(s,g.m.matrixWorld),_.applyMatrix4(o),d.push(_)}let f=_t(d,!1);if(d.forEach(g=>g.dispose()),!f){u.forEach(g=>c.set(g.m,!1));continue}f.computeBoundingSphere();let p=u[0].m,m=new q(f,u[0].mat);m.name="aw:merged",m.castShadow=p.castShadow,m.receiveShadow=p.receiveShadow,m.renderOrder=p.renderOrder,m.matrixAutoUpdate=!1,e.add(m);for(let g of u)a.add(g.m);this.stats.merged++,this.stats.mergedFrom+=u.length}for(let l of a)if(c.get(l))if(l.children.length){let u=l.geometry;l.geometry=new K,u.dispose(),l.castShadow=!1}else l.parent?.remove(l),l.geometry.dispose();i=0,e.traverse(()=>i++),n.awMergedN=i,e.updateMatrixWorld(!0)}mergeAll(){let e=[this.real.mon?.group,this.real.brands?.group];for(let t of e)if(t)for(let n of t.children)this.merge(n)}hookHero(){let e=this.real.hero;if(!e)return;let t=e.update.bind(e),n=this.heroCap;e.update=(i,s)=>{t(i,s);let r=0;for(let a of e.list)!a._g||!a._g.visible||Math.hypot(a.x-i,a.z-s)>n&&(a._g.visible=!1,a._sign&&(a._sign.visible=!1),r++);this.stats.heroHidden=r}}trim(e,t){this.trimPending=!1;let n=this.real,i=n.M,s=n.q.radius+300,r=0;for(let a of[...n.regions.values()]){if(a.state==="loading")continue;let o=i.X0+(a.rx+.5)*i.RS,c=i.Z0+(a.rz+.5)*i.RS;Math.hypot(o-e,c-t)-i.RS*.71>s&&(n.disposeRegion(a),r++)}r&&this.stats.changes.push("dropped "+r+" far regions")}hookUpdate(){let e=this.real,t=e.update.bind(e);e.update=(...n)=>{t(...n),this.trimPending&&this.trim(n[0],n[2]);for(let i of e.regions.values())i.group&&this.freeze(i.group,this.regionChanged);this.inst&&(this.inst.update(e.regions,n[0],n[2]),this.stats.instFolded=this.inst.folded,this.stats.instBuckets=this.inst.buckets),this.fixPost()};for(let n of[e.mon?.group,e.brands?.group,e.hero?.group])n&&this.freeze(n)}fixCar(){let e=this.g.car;if(!e||this.carDone.has(e))return;this.carDone.add(e);let t=0,n=0;e.traverse(r=>{r.isMesh&&t++}),e.updateMatrixWorld(!0);let i=e.matrixWorld.clone();e.matrixWorld.identity(),e.children.forEach(r=>r.updateMatrixWorld(!0)),this.merge(e,r=>/^Wheel(Front|Rear)(L|R)$/.test(r.name));let s=e.wheels||[];for(let r of s)this.merge(r.o);e.matrixWorld.copy(i),e.updateMatrixWorld(!0),e.traverse(r=>{r.isMesh&&n++}),this.stats.carMeshes=t+" -> "+n}fixPeds(){if(this.pedsDone||!this.mobile)return;let e=this.real.amb;if(!e)return;this.pedsDone=!0;let t=this.real.q.name,n=t==="high"?5:t==="med"?4:2,i=e.peds.length;for(let s of e.peds.splice(n))s.g.visible=!1,s.g.parent?.remove(s.g);for(let s of e.peds)s.g.traverse(r=>{r.castShadow=!1});this.stats.peds=i+" -> "+e.peds.length+" (no shadows)"}update(e){this.t-=e,!(this.t>0)&&(this.t=1,this.fixGlass(),this.fixCar(),this.fixPeds(),this.mergeAll())}};var Ia=class{constructor(e){A(this,"g",e);A(this,"postDone",!1);let t=e.real,n=t.sky.sun.shadow;n.radius=t.q.name==="high"?6:t.q.name==="med"?4.5:3.5,t.roads.asphalt?.color?.isColor&&t.roads.asphalt.color.set(15001838);let i=new D(.94,1.06,.9);for(let s of["mFrond","mCanopy","mShrub"]){let r=t.veg[s];r&&r.color&&r.color.isColor&&r.color.multiply(i)}}update(e){let t=window.__awPost;if(!t||!t.grade)return;let n=t.grade.uniforms;this.postDone||(this.postDone=!0,n.uVib.value=.68,n.uContrast.value=1.12,n.uVig.value=.14,n.uLift.value.set(.008,.007,.002)),t.bloom&&(t.bloom.strength=.16+.04*e,t.bloom.threshold=1.05+.25*e)}};function zd(h){let e=h*2654435761>>>0||1;return()=>(e=e*1664525+1013904223>>>0)/4294967296}function B0(){let h=[],e=[],t=[],n=[];for(let s=0;s<3;s++){let r=s*Math.PI/3,a=Math.cos(r)*.5,o=Math.sin(r)*.5,c=h.length/3;h.push(-a,0,-o,a,0,o,a,1,o,-a,1,-o),e.push(0,0,1,0,1,1,0,1);for(let l=0;l<4;l++)t.push(0,1,0);n.push(c,c+1,c+2,c,c+2,c+3)}let i=new K;return i.setAttribute("position",new j(h,3)),i.setAttribute("normal",new j(t,3)),i.setAttribute("uv",new j(e,2)),i.setIndex(n),i}function D0(){let h=[],e=[];for(let n=0;n<10;n++){let i=n/10*Math.PI*2+n%2*.3,s=.55+n%3*.15,r=.55+n%4*.08,a=Math.cos(i),o=Math.sin(i),c=-o*.05,l=a*.05,u=[a*Math.sin(s)*r,Math.cos(s)*r,o*Math.sin(s)*r];h.push(c,0,l,-c,0,-l,u[0],u[1],u[2]),h.push(-c,0,-l,c,0,l,u[0],u[1],u[2]);for(let d=0;d<6;d++)e.push(a*.5,.8,o*.5)}let t=new K;return t.setAttribute("position",new j(h,3)),t.setAttribute("normal",new j(e,3)),t}function Ll(h){let t=document.createElement("canvas");t.width=t.height=256;let n=t.getContext("2d"),i=zd(h==="boug"?7:11);if(h==="scrub"){n.lineCap="round";for(let o=0;o<60;o++){let c=256*(.35+i()*.3),l=-Math.PI/2+(i()-.5)*2.2,u=256*(.25+i()*.6);n.strokeStyle=`rgb(${80+i()*30},${70+i()*25},${55+i()*20})`,n.lineWidth=1.5+i()*2,n.beginPath(),n.moveTo(c,256),n.lineTo(c+Math.cos(l)*u,256+Math.sin(l)*u),n.stroke()}for(let o=0;o<700;o++){let c=i(),l=.15+Math.pow(i(),.8)*.8,u=256*(.5+(c-.5)*(.5+.5*l)),d=256*(1-l*.95),f=85+i()*50;n.fillStyle=`rgb(${f*.78+i()*20},${f},${f*.55})`,n.beginPath(),n.ellipse(u,d,2.5+i()*3,1.6+i()*2,i()*Math.PI,0,Math.PI*2),n.fill()}let a=new it(t);return a.colorSpace=re,a.anisotropy=2,a}let s=h==="boug"?520:260;for(let a=0;a<s;a++){let o=i(),c=Math.pow(i(),.7),l=h==="grape"?.62*Math.sqrt(Math.max(0,1-Math.pow(c*1.05-.45,2)*3.2)):.35+.65*(1-c*.6),u=256*(.5+(o-.5)*l),d=256*(1-c*.95),f=70+i()*70;n.fillStyle=h==="boug"?`rgb(${30+i()*30},${f},${25+i()*25})`:i()<.12?`rgb(${150+i()*40},${90+i()*30},40)`:`rgb(${90+i()*40},${f+60},${45+i()*25})`,n.beginPath();let p=h==="boug"?5+i()*6:9+i()*9;n.ellipse(u,d,p,p*(h==="boug"?.6:.85),i()*Math.PI,0,Math.PI*2),n.fill()}if(h==="boug")for(let a=0;a<260;a++){let o=i(),c=.25+Math.pow(i(),.6)*.72,l=256*(.5+(o-.5)*(.3+.6*(1-c*.5))),u=256*(1-c*.95),d=i()<.8?318+i()*20:20+i()*15;n.fillStyle=`hsl(${d},${75+i()*20}%,${45+i()*15}%)`,n.beginPath(),n.arc(l,u,3+i()*5,0,Math.PI*2),n.fill()}let r=new it(t);return r.colorSpace=re,r.anisotropy=2,r}var Ta=class{constructor(e,t,n=!1){A(this,"g",e);A(this,"stats",{skipped:0,regions:0,boug:0,aloe:0,grape:0,scrub:0,ac:0,awn:0,drawn:0});A(this,"card",B0());A(this,"aloe",D0());A(this,"mBoug");A(this,"mGrape");A(this,"mAloe");A(this,"mScrub");A(this,"mAC",new Ee({color:15329249,roughness:.55,metalness:.15}));A(this,"mAwn",new Ee({color:16777215,roughness:.8,metalness:0}));A(this,"acGeo",(()=>{let e=new le(.85,.55,.42);return e.clearGroups(),e.translate(0,0,.21),e})());A(this,"awnGeo",(()=>{let e=new le(1,.06,1);return e.clearGroups(),e.translate(0,0,.5),e})());A(this,"live",new Set);A(this,"gen",null);A(this,"genR",null);A(this,"budget",2);A(this,"lastX",1e9);A(this,"lastZ",1e9);A(this,"mul");A(this,"pools",null);A(this,"vegIdx",null);A(this,"vegSig","");A(this,"hb",null);A(this,"hbN",-1);n&&(this.pools=new Map);let i=e.real.q.name;this.mul=(i==="low"?.6:i==="med"?.85:e.real.q.id==="desktop"?1.4:1)*(t?.8:1);let s=o=>new Ee({map:o,alphaTest:.45,side:We,roughness:.85,metalness:0});this.mBoug=s(Ll("boug")),this.mGrape=s(Ll("grape")),this.mScrub=s(Ll("scrub")),this.mAloe=new Ee({color:new D(7311194),roughness:.6,metalness:0,side:We});let r=e.real,a=r.update.bind(r);r.update=(...o)=>{a(...o),this.update(r.regions,o[0],o[2])}}heightAt(e,t){return this.g.real.heightAt(e,t)}bucket(e,t,n,i,s,r,a){let o=i.length/16;if(!o)return null;if(this.pools){let _=new Float32Array(i),v=new Float32Array(o),x=new Float32Array(o),y=1e9,w=-1e9,E=1e9,M=-1e9;for(let I=0;I<o;I++)v[I]=_[I*16+12],x[I]=_[I*16+14],y=Math.min(y,v[I]),w=Math.max(w,v[I]),E=Math.min(E,x[I]),M=Math.max(M,x[I]);let S=this.pools.get(r);S||this.pools.set(r,S={pool:new Mi(t,n,{name:"aw:flora:"+r,castShadow:!1,receiveShadow:!0,colored:!!a},this.g.real.group),range:s*Math.sqrt(this.mul)});let T={im:null,pool:S.pool,cols:a?new Float32Array(a):void 0,mats:_,cx:v,cz:x,n:o,range:S.range,box:[y,E,w,M]};return S.pool.add(T),T}let c=new me(t,n,o);c.name="aw:flora:"+r,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!0,c.matrixAutoUpdate=!1,c.count=0,c.visible=!1;let l=new Float32Array(i),u=new Float32Array(o),d=new Float32Array(o),f=1e9,p=-1e9,m=1e9,g=-1e9;for(let _=0;_<o;_++)u[_]=l[_*16+12],d[_]=l[_*16+14],f=Math.min(f,u[_]),p=Math.max(p,u[_]),m=Math.min(m,d[_]),g=Math.max(g,d[_]);let b;return a&&(b=new Float32Array(a),c.instanceColor=new Ge(new Float32Array(o*3),3)),e.group.add(c),{im:c,cols:b,mats:l,cx:u,cz:d,n:o,range:s*Math.sqrt(this.mul),box:[f,m,p,g]}}*build(e){let t=0,n=this.g.real.veg,i=zd(e.rx*7919+e.rz*104729+13),s=new P,r=new ae,a=new C,o=new C,c=new C(0,1,0),l=(M,S,T,I,R,B,F=.05)=>{r.setFromAxisAngle(c,B),o.set(S,this.heightAt(S,T)-F,T),a.set(I,R,I),s.compose(o,r,a);for(let L of s.elements)M.push(L)},u=[],d=[],f=[];for(let M of e.json?.b||[]){if((++t&31)===0&&(yield),!M.p||M.p.length<3||this.hidden(M))continue;let S=M.k==="house"||M.k==="res"||M.k==="apt";if(i()>(S?.38:.08)*this.mul)continue;let T=0,I=0;for(let[Fe,pe]of M.p)T+=Fe,I+=pe;T/=M.p.length,I/=M.p.length;let R=Math.floor(i()*M.p.length),[B,F]=M.p[R],[L,N]=M.p[(R+1)%M.p.length],z=L-B,G=N-F,V=Math.hypot(z,G);if(V<2.5)continue;let W=-G/V,O=z/V,Q=(B+L)/2,$=(F+N)/2;(Q-T)*W+($-I)*O<0&&(W=-W,O=-O);let se=1+Math.floor(i()*3);for(let Fe=0;Fe<se;Fe++){let pe=.2+i()*.6,xt=B+z*pe+W*.8,_e=F+G*pe+O*.8;l(u,xt,_e,1.5+i()*1.2,1.4+i()*1.4,i()*6.28)}}for(let[M,,S]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((M-this.M().X0)/this.M().RS)!==e.rx||Math.floor((S-this.M().Z0)/this.M().RS)!==e.rz||i()>.5*this.mul)continue;let T=1+Math.floor(i()*4);for(let I=0;I<T;I++){let R=i()*6.28,B=1.5+i()*4,F=.7+i()*.8;l(d,M+Math.cos(R)*B,S+Math.sin(R)*B,F,F*(.8+i()*.5),i()*6.28,.02)}}for(let[M,S,T]of this.vegFor(e,"p")){if((++t&255)===0&&(yield),S>3.5||Math.floor((M-this.M().X0)/this.M().RS)!==e.rx||Math.floor((T-this.M().Z0)/this.M().RS)!==e.rz||i()>.45*this.mul)continue;let I=i()*6.28,R=3+i()*5;l(f,M+Math.cos(I)*R,T+Math.sin(I)*R,2.4+i()*1.8,1.6+i()*1.4,i()*6.28)}let p=[],m=[],g=[],b=[2062988,14241584,15905076,3050327,8011421,15231634,2841027,16052712],_=new D,v=new ae,x=new C(1,0,0),y=(M,S,T,I,R,B,F,L,N=0)=>{r.setFromAxisAngle(c,R),N&&r.multiply(v.setFromAxisAngle(x,N)),o.set(S,I,T),a.set(B,F,L),s.compose(o,r,a);for(let z of s.elements)M.push(z)};for(let M of e.json?.b||[]){if((++t&31)===0&&(yield),!M.p||M.p.length<3||this.hidden(M))continue;let S=M.k==="com"||M.k==="shop"||M.k==="retail",T=M.k==="house"||M.k==="res"||M.k==="apt";if(!S&&!T)continue;let I=0,R=0;for(let[L,N]of M.p)I+=L,R+=N;I/=M.p.length,R/=M.p.length;let B=M.h||4,F=Math.min(M.p.length,6);for(let L=0;L<F;L++){let[N,z]=M.p[L],[G,V]=M.p[(L+1)%M.p.length],W=G-N,O=V-z,Q=Math.hypot(W,O);if(Q<3)continue;let $=-O/Q,se=W/Q,Fe=(N+G)/2,pe=(z+V)/2;(Fe-I)*$+(pe-R)*se<0&&($=-$,se=-se);let xt=Math.atan2($,se);if(i()<(S?.45:.28)*this.mul){let _e=.15+i()*.7,ve=N+W*_e+$*.03,xe=z+O*_e+se*.03,X=this.heightAt(ve,xe),de=B>6&&i()<.5?3+Math.floor(i()*Math.max(1,(B-4)/3))*3:0;y(p,ve,xe,X+Math.min(B-.8,2.3+de),xt,1,1,1)}if(S&&Q>4&&i()<.5*this.mul){let _e=Math.min(Q*.8,3+i()*6),ve=.5,xe=N+W*ve+$*.02,X=z+O*ve+se*.02;y(m,xe,X,this.heightAt(xe,X)+Math.min(B-.4,2.9),xt,_e,1,1.1+i()*.5,.32),_.setHex(b[Math.floor(i()*b.length)]).convertSRGBToLinear(),g.push(_.r,_.g,_.b)}}}let w=[];for(let[M,,S]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((M-this.M().X0)/this.M().RS)!==e.rx||Math.floor((S-this.M().Z0)/this.M().RS)!==e.rz||i()>.7*this.mul)continue;let T=1+Math.floor(i()*3);for(let I=0;I<T;I++){let R=i()*6.28,B=2+i()*7;l(w,M+Math.cos(R)*B,S+Math.sin(R)*B,1.8+i()*2.2,1.1+i()*1.4,i()*6.28)}}this.stats.scrub+=w.length/16,this.stats.ac+=p.length/16,this.stats.awn+=m.length/16;let E=[];for(let M of[this.bucket(e,this.card,this.mBoug,u,180,"boug"),this.bucket(e,this.aloe,this.mAloe,d,110,"aloe"),this.bucket(e,this.card,this.mGrape,f,220,"grape"),this.bucket(e,this.card,this.mScrub,w,320,"scrub"),this.bucket(e,this.acGeo,this.mAC,p,140,"ac"),this.bucket(e,this.awnGeo,this.mAwn,m,260,"awn",g)])M&&E.push(M);this.stats.boug+=u.length/16,this.stats.aloe+=d.length/16,this.stats.grape+=f.length/16,this.stats.regions++,e.__awFlora=E,this.live.add(e)}hidden(e){let t=this.g.real,n=0,i=0;for(let[s,r]of e.p)n+=s,i+=r;n/=e.p.length,i/=e.p.length;for(let s of this.heroBoxes())if(n>s[0]&&n<s[2]&&i>s[1]&&i<s[3])return this.stats.skipped++,!0;try{if(t.mon&&t.mon.excluded&&t.mon.excluded(n,i,e))return this.stats.skipped++,!0;if(t.hero&&(t.hero.pts.length||t.hero.polys.length)&&this.nearHero(n,i)&&t.hero.hides(e.p))return this.stats.skipped++,!0}catch{}return!1}vegFor(e,t){let n=this.g.real.veg.lists,i=(n.k||[]).length+":"+(n.p||[]).length+":"+(n.k||[]).reduce((r,a)=>r+a.length,0)+":"+(n.p||[]).reduce((r,a)=>r+a.length,0);if(!this.vegIdx||i!==this.vegSig){this.vegSig=i,this.vegIdx=new Map;let r=this.M();for(let a of["k","p"])for(let o of n[a]||[])for(let c of o){let l=Math.floor((c[0]-r.X0)/r.RS)+","+Math.floor((c[2]-r.Z0)/r.RS),u=this.vegIdx.get(l);u||this.vegIdx.set(l,u={k:[],p:[]}),u[a].push(c)}}let s=this.vegIdx.get(e.rx+","+e.rz);return s?s[t]:[]}heroBoxes(){let e=this.g.real.hero,t=e&&e.list||[];if(this.hb&&this.hbN===t.length)return this.hb;this.hb=[],this.hbN=t.length;for(let n of t){let i=n.foot||(Array.isArray(n.hero?.hide_footprint)?n.hero.hide_footprint:null);if(i&&i.length>2){let s=1e9,r=1e9,a=-1e9,o=-1e9;for(let[c,l]of i)s=Math.min(s,c),a=Math.max(a,c),r=Math.min(r,l),o=Math.max(o,l);this.hb.push([s-6,r-6,a+6,o+6])}else Number.isFinite(n.x)&&this.hb.push([n.x-30,n.z-30,n.x+30,n.z+30])}return this.hb}nearHero(e,t){for(let n of this.heroBoxes())if(e>n[0]-60&&e<n[2]+60&&t>n[1]-60&&t<n[3]+60)return!0;return!1}M(){return this.g.real.M}cull(e,t,n){for(let i of e.__awFlora||[]){if(!i.im)continue;let s=i.range*i.range,r=Math.max(i.box[0]-t,0,t-i.box[2]),a=Math.max(i.box[1]-n,0,n-i.box[3]);if(r*r+a*a>=s){i.im.count=0,i.im.visible=!1;continue}let o=i.im.instanceMatrix.array,c=0;for(let l=0;l<i.n;l++){let u=i.cx[l]-t,d=i.cz[l]-n;if(u*u+d*d<s){let f=l*16,p=c*16;for(let m=0;m<16;m++)o[p+m]=i.mats[f+m];if(i.cols){let m=i.im.instanceColor.array;m[c*3]=i.cols[l*3],m[c*3+1]=i.cols[l*3+1],m[c*3+2]=i.cols[l*3+2]}c++}}i.im.count=c,i.im.visible=c>0,c&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,c*16),i.im.instanceMatrix.needsUpdate=!0,i.cols&&(i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){let i=performance.now();if(!this.gen){for(let r of e.values())if(!r.__awFlora&&r.state==="built"&&r.group&&r.json){this.gen=this.build(r),this.genR=r;break}}for(;this.gen&&performance.now()-i<this.budget;){if(this.genR&&this.genR.state!=="built"){this.gen=null;break}this.gen.next().done&&(this.gen=null,this.lastX=1e9)}for(let r of this.live)if(!r.group||!r.group.parent){for(let a of r.__awFlora||[])a.im&&a.im.dispose(),a.pool&&a.pool.remove(a);this.live.delete(r),this.lastX=1e9}if((t-this.lastX)**2+(n-this.lastZ)**2<36)return;this.lastX=t,this.lastZ=n;let s=0;if(this.pools){for(let r of this.pools.values())s+=r.pool.fill(t,n,-1,r.range);this.stats.drawn=s;return}for(let r of this.live){this.cull(r,t,n);for(let a of r.__awFlora||[])s+=a.im?a.im.count:0}this.stats.drawn=s}};var Ra=class{constructor(e,t){A(this,"g",e);A(this,"budget",t);A(this,"stats",{jobs:0,maxMs:0,ticks:0,maxJob:0});A(this,"ord",new WeakMap);A(this,"cost",[]);A(this,"ch",new MessageChannel);A(this,"pending",!1);window.__awJobB=-1,this.ch.port1.onmessage=()=>this.run()}frame(){let e=this.g.real;this.pending||!e.queue.length&&!this.followUp()||(this.pending=!0,this.ch.port2.postMessage(0))}run(){this.pending=!1;let e=this.g.real,t=performance.now(),n=e.queue.length>120?this.budget*1.5:this.budget,i=0;for(;e.queue.length&&performance.now()-t<n;){let a=e.queue[0],o=this.ord.get(a.R)??0,c=this.cost[o]||0;if(i>0&&performance.now()-t+c>n)break;e.queue.shift(),this.ord.set(a.R,o+1);let l=performance.now();if(e.regions.get(a.R.rx+","+a.R.rz)===a.R){try{a.f()}catch(f){console.error("[aw-jobs]",f)}let d=window.__aw;d?.bbatch?.touch?.(a.R),d?.perf?.inst?.touch?.(a.R)}let u=performance.now()-l;this.cost[o]=this.cost[o]?this.cost[o]*.7+u*.3:u,u>this.stats.maxJob&&(this.stats.maxJob=u),this.stats.jobs++,i++}let s=performance.now()-t;this.stats.ticks++,s>this.stats.maxMs&&(this.stats.maxMs=s);let r=window.__aw;r?.bbatch?.afterJobs?.(),r?.perf?.inst?.afterJobs?.(e.regions),r?.mperf?.afterJobs?.()}followUp(){let e=window.__aw;return e?(e.mperf?.pending?.()||0)>0||(e.perf?.inst?.pending?.()||0)>0:!1}};var F0=[13617856,12433840,11975099,14078664],L0=[10508348,11232326,9720122,11693646],P0=[14271098,14199472,9616823,14605264,14069376,11453338,10926543,13605516],Ba=class{constructor(e,t,n=!0){A(this,"g",e);A(this,"walls",t);A(this,"useBatch",n);A(this,"mesh",null);A(this,"stats",{buildings:0,tris:0,masked:0,ms:0});A(this,"mask",new Uint8Array(1024*4));A(this,"tex",new Je(this.mask,32,32,Le,ee));A(this,"t",0);A(this,"batch",null);this.tex.needsUpdate=!0,this.load().catch(i=>console.warn("[aw-far] disabled:",i))}async load(){let e=await fetch("./data/far/massing.bin");if(!e.ok)return;let t=await e.arrayBuffer(),n=new DataView(t);if(n.getUint32(0,!0)!==826693441)return;let i=performance.now(),s=n.getUint32(4,!0);if(t.byteLength<8+s*14){console.warn("[aw-far] massing.bin truncated",t.byteLength,s);return}let r=this.g.real,a=(M,S,T)=>this.walls&&(M>=7||S*T*4>350),o=0,c=0;for(let M=0;M<s;M++){let S=8+M*14,T=n.getInt16(S+4,!0)/20,I=n.getInt16(S+6,!0)/20,R=n.getUint8(S+8)/4,B=n.getUint8(S+9)/4;o+=4,c+=6,a(B,R,Math.hypot(T,I))&&(o+=16,c+=24)}let l=new Float32Array(o*3),u=new Float32Array(o*3),d=new Uint8Array(o*4),f=new Float32Array(o),p=new Uint32Array(c),m=0,g=0,b=new D,_=new D(13219740).convertSRGBToLinear(),v=(M,S,T,I,R,B,F)=>(l[m*3]=M,l[m*3+1]=S,l[m*3+2]=T,u[m*3]=I,u[m*3+1]=R,u[m*3+2]=B,d[m*4]=b.r*255,d[m*4+1]=b.g*255,d[m*4+2]=b.b*255,d[m*4+3]=255,f[m]=F,m++);for(let M=0;M<s;M++){let S=8+M*14,T=n.getInt16(S,!0)/2,I=n.getInt16(S+2,!0)/2,R=n.getInt16(S+4,!0)/20,B=n.getInt16(S+6,!0)/20,F=n.getUint8(S+8)/4,L=n.getUint8(S+9)/4,N=n.getUint8(S+10),z=n.getUint8(S+11),G=n.getUint16(S+12,!0),V=Math.hypot(R,B)||1,W=-B/V*F,O=R/V*F,Q=r.heightAt(T,I)-.5,$=Q+.5+L,se=[[T-R-W,I-B-O],[T+R-W,I+B-O],[T+R+W,I+B+O],[T-R+W,I-B+O]],Fe=N>>4;b.setHex(Fe?L0[z&3]:F0[z&3]).convertSRGBToLinear().lerp(_,.35);let pe=se.map(([_e,ve])=>v(_e,$,ve,0,1,0,G));if((se[1][0]-se[0][0])*(se[2][1]-se[0][1])-(se[1][1]-se[0][1])*(se[2][0]-se[0][0])<0?(p[g++]=pe[0],p[g++]=pe[1],p[g++]=pe[2],p[g++]=pe[0],p[g++]=pe[2],p[g++]=pe[3]):(p[g++]=pe[0],p[g++]=pe[2],p[g++]=pe[1],p[g++]=pe[0],p[g++]=pe[3],p[g++]=pe[2]),a(L,F,V)){b.setHex(P0[z>>2&7]).convertSRGBToLinear().lerp(_,.4).multiplyScalar(.85);for(let _e=0;_e<4;_e++){let[ve,xe]=se[_e],[X,de]=se[_e+1&3],Tt=de-xe,Rt=-(X-ve),Vl=Math.hypot(Tt,Rt)||1;Tt/=Vl,Rt/=Vl,((ve+X)/2-T)*Tt+((xe+de)/2-I)*Rt<0&&(Tt=-Tt,Rt=-Rt);let Wl=v(ve,Q,xe,Tt,0,Rt,G),yf=v(X,Q,de,Tt,0,Rt,G),ql=v(X,$,de,Tt,0,Rt,G),wf=v(ve,$,xe,Tt,0,Rt,G);p[g++]=Wl,p[g++]=yf,p[g++]=ql,p[g++]=Wl,p[g++]=ql,p[g++]=wf}}}if(this.useBatch){this.buildBatch(l,u,d,f,p,o,c),this.stats.buildings=s,this.stats.ms=Math.round(performance.now()-i),this.t=0;return}let x=new K;x.setAttribute("position",new H(l,3)),x.setAttribute("normal",new H(u,3)),x.setAttribute("color",new H(d,4,!0)),x.setAttribute("aReg",new H(f,1)),x.setIndex(new H(p,1));let y=new oe({vertexColors:!0,side:2}),w=this.tex;y.onBeforeCompile=M=>{M.uniforms.uMask={value:w},M.vertexShader=M.vertexShader.replace("#include <common>",`#include <common>
attribute float aReg; uniform sampler2D uMask;`).replace("#include <project_vertex>",`#include <project_vertex>
  { float rx = floor(aReg / 32.0), rz = aReg - rx * 32.0;
    if (texture2D(uMask, (vec2(rx, rz) + 0.5) / 32.0).r > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }`)},y.customProgramCacheKey=()=>"awFarCity";let E=new q(x,y);E.name="aw:farCity",E.frustumCulled=!1,E.castShadow=!1,E.receiveShadow=!1,E.matrixAutoUpdate=!1,this.g.scene.add(E),this.mesh=E,this.stats.buildings=s,this.stats.tris=c/3,this.stats.ms=Math.round(performance.now()-i),this.t=0}buildBatch(e,t,n,i,s,r,a){let c=new Uint32Array(1025),l=new Uint32Array(1025);for(let S=0;S<r;S++)c[i[S]+1]++;for(let S=0;S<a;S+=3)l[i[s[S]]+1]+=3;for(let S=0;S<1024;S++)c[S+1]+=c[S],l[S+1]+=l[S];let u=new Uint32Array(r),d=c.slice(0,1024),f=l.slice(0,1024),p=new Float32Array(r*3),m=new Float32Array(r*3),g=new Uint8Array(r*4),b=new Uint32Array(a);for(let S=0;S<r;S++){let T=i[S],I=d[T]++;u[S]=I-c[T],p[I*3]=e[S*3],p[I*3+1]=e[S*3+1],p[I*3+2]=e[S*3+2],m[I*3]=t[S*3],m[I*3+1]=t[S*3+1],m[I*3+2]=t[S*3+2],g[I*4]=n[S*4],g[I*4+1]=n[S*4+1],g[I*4+2]=n[S*4+2],g[I*4+3]=n[S*4+3]}for(let S=0;S<a;S+=3){let T=i[s[S]],I=f[T];f[T]+=3,b[I]=u[s[S]],b[I+1]=u[s[S+1]],b[I+2]=u[s[S+2]]}let _=[];for(let S=0;S<1024;S++)l[S+1]>l[S]&&_.push(S);let v=new oe({vertexColors:!0,side:2});v.customProgramCacheKey=()=>"awFarCityB";let x=new Tn(_.length,r,a,v),y=_.length,w={cx:new Float32Array(y),cy:new Float32Array(y),cz:new Float32Array(y),r:new Float32Array(y),vis:new Uint16Array(y),nVis:0,reg:new Uint16Array(y),n:y},E=new be,M=new be;_.forEach((S,T)=>{let I=c[S],R=c[S+1],B=new K;B.setAttribute("position",new H(p.subarray(I*3,R*3),3)),B.setAttribute("normal",new H(m.subarray(I*3,R*3),3)),B.setAttribute("color",new H(g.subarray(I*4,R*4),4,!0)),B.setIndex(new H(b.subarray(l[S],l[S+1]),1)),B.computeBoundingSphere(),x.addInstance(x.addGeometry(B));let F=B.boundingSphere;w.cx[T]=F.center.x,w.cy[T]=F.center.y,w.cz[T]=F.center.z,w.r[T]=F.radius,w.reg[T]=S,T?E.union(M.copy(F)):E.copy(F)}),x.boundingSphere=E,x.name="aw:farCity",x.sortObjects=!1,x.perObjectFrustumCulled=!0,x.castShadow=!1,x.receiveShadow=!1,x.matrixAutoUpdate=!1,x.userData.awb=w,x.onBeforeRender=Wc,this.g.scene.add(x),this.batch=w,this.mesh=x,this.stats.tris=a/3}update(e){let n=this.g.camera.position.y,i=Math.max(0,Math.min(1,(n-25)/140)),s=window;if(s.__awFar=12e3+1e4*i,s.__awFogK=1-.55*i,!this.mesh||(this.t-=e,this.t>0))return;this.t=.25;let r=this.g.real.regions;this.mask.fill(0);let a=0;for(let c of r.values()){if(c.state!=="built")continue;let l=c.rx,u=c.rz;l<0||u<0||l>31||u>31||(this.mask[(u*32+l)*4]=255,a++)}this.stats.masked=a;let o=this.batch;if(o){let c=0;for(let l=0;l<o.n;l++){let u=o.reg[l],d=Math.floor(u/32),f=u-d*32;this.mask[(f*32+d)*4]||(o.vis[c++]=l)}o.nVis=c;return}this.tex.needsUpdate=!0}};var Ss={desktop:"high",high:"med",med:"low"},Da=class{constructor(e,t){A(this,"g",e);A(this,"stats",{lost:0,prCap:0});let n=e.renderer.domElement;n.addEventListener("webglcontextlost",i=>this.lost(i),!1),n.addEventListener("webglcontextrestored",()=>location.reload(),!1),t||(this.cap(),addEventListener("resize",()=>this.cap()))}tier(){let e=this.g.real.q;return e.id||e.name}cap(){let e=this.tier();if(e!=="high"&&e!=="desktop")return;let t=this.g.renderer,n=e==="desktop"?8e6:24e5,i=innerWidth*innerHeight,s=Math.min(devicePixelRatio||1,e==="desktop"?3:2),r=Math.max(1,Math.min(s,Math.sqrt(n/Math.max(1,i))));window.__awPRCap=r,t.getPixelRatio()>r+.01&&(t.setPixelRatio(r),this.stats.prCap=+r.toFixed(2),dispatchEvent(new Event("resize")))}lost(e){e.preventDefault(),this.stats.lost++;let t=this.tier(),n="aw_ctxlost_"+t,i=0;try{i=+(sessionStorage.getItem(n)||0)+1,sessionStorage.setItem(n,String(i))}catch{}if(i>=2&&Ss[t])try{localStorage.setItem("aw_q",Ss[t])}catch{}let s=document.createElement("div");s.textContent=i>=2&&Ss[t]?`Graphics reset - switching to ${Ss[t].toUpperCase()}\u2026`:"Graphics reset - reloading\u2026",s.style.cssText="position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:99999;background:#000c;color:#fff;padding:14px 18px;border-radius:12px;font:600 15px system-ui",document.body.appendChild(s),setTimeout(()=>{let r=new URL(location.href);i>=2&&Ss[t]&&r.searchParams.delete("q"),location.href=r.toString()},2500)}};var Fa=class{constructor(e){A(this,"g",e);A(this,"c",document.createElement("canvas"));A(this,"x");A(this,"buf",new Float32Array(300));A(this,"i",0);A(this,"n",0);A(this,"t",0);A(this,"txt","");this.c.width=300,this.c.height=96,this.c.style.cssText="position:fixed;left:8px;bottom:8px;z-index:9999;pointer-events:none;background:#000a;border-radius:6px;width:300px;height:96px",document.body.appendChild(this.c),this.x=this.c.getContext("2d")}frame(e){if(this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n=Math.min(this.n+1,this.buf.length),this.t+=e,this.t>500){this.t=0;let r=Array.from(this.buf.subarray(0,this.n)).sort((c,l)=>c-l),a=c=>r[Math.min(r.length-1,Math.floor(c*r.length))],o=this.g.renderer;this.txt=`p50 ${a(.5).toFixed(1)}  p95 ${a(.95).toFixed(1)}  p99 ${a(.99).toFixed(1)}  max ${r[r.length-1].toFixed(0)} ms \xB7 pr ${o.getPixelRatio().toFixed(2)}`}let t=this.x,n=300,i=96,s=70/50;t.clearRect(0,0,n,i);for(let r=0;r<this.n;r++){let a=this.buf[(this.i-this.n+r+this.buf.length)%this.buf.length];t.fillStyle=a<17.5?"#3c3":a<34?"#ec3":"#e33";let o=Math.min(70,a*s);t.fillRect(r,i-o,1,o)}t.fillStyle="#fff8",t.fillRect(0,i-16.7*s,n,1),t.fillRect(0,i-33.3*s,n,1),t.fillStyle="#fff",t.font="11px monospace",t.fillText(this.txt,4,12)}};var Hd={head:1.3,thigh_l:.9,thigh_r:.9,upperarm_l:.9,upperarm_r:.9,spine_01:.95},Vd=[16734815,4171775,16765503,6213994,16748497,16751421,10185727],La=class{constructor(e,t){A(this,"g",e);A(this,"stats",{kids:0,families:0,visible:0});A(this,"gl",[]);A(this,"pool",[]);A(this,"group",new ce);A(this,"cap");A(this,"shadows");A(this,"v",new C);let n=e.real.q.name;this.cap=n==="low"?3:n==="med"?8:14,this.shadows=!t,this.group.name="aw:kids",e.scene.add(this.group);let i=new An;Promise.all(["ped_maya","ped_sam"].map(s=>i.loadAsync(`./models/${s}.glb`))).then(s=>{this.gl=s,console.info("[aw-kids] models",s.map(r=>r.animations.map(a=>a.name).join("|")))}).catch(s=>console.warn("[aw-kids]",s))}make(e){if(!this.gl.length)return null;let t=this.gl[e%this.gl.length],n=Aa(t.scene);n.rotation.y=Math.PI;let i=new ce;i.add(n),i.scale.setScalar(.6+e%3*.04);let s=new D(Vd[e%Vd.length]),r=[];n.traverse(u=>{let d=u;if((d.isMesh||d.isSkinnedMesh)&&(d.castShadow=this.shadows,d.frustumCulled=!1,/accessory|held/i.test(d.name)&&(d.visible=!1),d.material)){let f=d.material.clone();/top/i.test(f.name||"")&&f.color&&f.color.copy(s),u.material=f}Hd[u.name]&&r.push([u,Hd[u.name]])});let a=new Nn(n),o=u=>t.animations.find(d=>d.name===u)||t.animations[0],c=a.clipAction(o("Walk_Brisk")),l=a.clipAction(o("Jog"));return c.play(),l.play(),l.setEffectiveWeight(0),c.time=Math.random()*c.getClip().duration,i.visible=!1,this.group.add(i),this.stats.kids++,{root:i,inner:n,mixer:a,walk:c,jog:l,bones:r,ped:null,slot:0}}update(e){let t=this.g.real.amb;if(!t||!this.gl.length)return;let n=this.g.camera.position,i=this.g.real;for(let o of t.peds)if(o.pedFlip=1,o.rd!==o.__rd){o.__rd=o.rd;for(let c of this.pool)c.ped===o&&(c.ped=null,c.root.visible=!1);if(o.__fam=0,o.rd&&Math.random()<.4){let c=Math.random();o.__fam=c<.06?3:c<.5?2:1;for(let l=0;l<o.__fam;l++){let u=this.pool.find(d=>!d.ped);if(!u&&this.pool.length<this.cap){let d=this.make(this.pool.length);d&&(this.pool.push(d),u=d)}if(!u)break;u.ped=o,u.slot=l}}}let s=0,r=0,a=new Set;for(let o of this.pool){let c=o.ped;if(!c||!c.rd||!c.g.visible){o.root.visible=!1;continue}let l=c.g.position;if(n.distanceToSquared(l)>19600){o.root.visible=!1;continue}a.has(c)||(a.add(c),r++);let u=c.g.rotation.y,d=-Math.sin(u),f=-Math.cos(u),p=o.slot===1?-1:1,m=o.slot===2?0:.75*p,g=o.slot===2?.9:.15,b=l.x+f*m-d*g,_=l.z-d*m-f*g;o.root.position.set(b,i.surfaceAt(b,_)+.02,_),o.root.rotation.y=u,o.root.visible=!0,s++;let v=c.sp||1.3,x=o.root.scale.x,y=v/(1.8*x),w=y>1.45?1:0;if(o.walk.setEffectiveWeight(1-w),o.jog.setEffectiveWeight(w),o.walk.timeScale=Math.min(1.6,y),o.jog.timeScale=Math.min(1.3,v/(3.2*x)),o.applied)for(let[E,M]of o.bones)E.scale.divideScalar(M);o.mixer.update(e),o.applied=!0;for(let[E,M]of o.bones)E.scale.multiplyScalar(M)}this.stats.visible=s,this.stats.families=r}};var Re=()=>performance.now();function N0(h){if(!h.length)return null;let e=new Map;for(let i of h){let s=i.geometry.attributes.position.array,r=i.material.uuid+"|"+Math.floor((s[0]+s[3]+s[6])/3/80)+","+Math.floor((s[2]+s[5]+s[8])/3/80),a=e.get(r);a||e.set(r,a=[]),a.push(i)}let t=h[0].parent.constructor,n=new t;for(let i of e.values()){let s=i[0],r=Object.keys(s.geometry.attributes),a=i.every(o=>!o.geometry.index&&Object.keys(o.geometry.attributes).join()===r.join());if(i.length>1&&a){let o=new s.geometry.constructor;for(let c of r){let l=0;for(let p of i)l+=p.geometry.attributes[c].array.length;let u=new Float32Array(l),d=s.geometry.attributes[c],f=0;for(let p of i)u.set(p.geometry.attributes[c].array,f),f+=p.geometry.attributes[c].array.length;o.setAttribute(c,new d.constructor(u,d.itemSize,d.normalized))}o.computeBoundingSphere();for(let c of i)c.geometry.dispose();s.geometry=o,n.add(s)}else for(let o of i)n.add(o)}return n}var Pa=class{constructor(e=4){A(this,"budget",e);A(this,"stats",{roadSlices:0,bldSlices:0,streetSlices:0,maxSlice:0,msPerM:0,msPerB:0,msPerW:0,stageMax:{}});let t=window;t.__awRoadJob=(n,i)=>this.roadJob(n,i),t.__awBldJob=(n,i,s)=>this.bldJob(n,i,s),t.__awStreetJob=(n,i)=>this.streetJob(n,i)}streetJob(e,t){let n=t.st,i=(c,l)=>Object.assign(Object.create(t),{st:{cars:[],walls:[],signs:[],...c},json:l}),s=[],r=[];if(n){let c=n.cars||[],l=Math.max(1,Math.round(this.budget*12));for(let p=0;p<c.length;p+=l){let m=c.slice(p,p+l);s.push(()=>t.group.add(e.streets.build(i({cars:m},null)))),r.push("cars")}s.push(()=>t.group.add(e.streets.build(i({},t.json)))),r.push("furniture");let u=n.walls||[],d=[],f=0;s.push(()=>{let p=Re();for(;f<u.length;){let m=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerW||1))),g=Re(),b=u.slice(f,f+m);e.streets.build(i({walls:b},null)).traverse(v=>{v.isMesh&&d.push(v)});let _=(Re()-g)/b.length;if(this.stats.msPerW=this.stats.msPerW?this.stats.msPerW*.8+_*.2:_,f+=b.length,Re()-p>this.budget*.6)return!1}return!0}),r.push("walls"),s.push(()=>{let p=N0(d);p&&t.group.add(p)}),r.push("wallsMerge"),s.push(()=>t.group.add(e.streets.build(i({signs:n.signs||[]},null)))),r.push("signs"),n.pools&&n.pools.length&&(s.push(()=>t.group.add(e.marks.pools({pools:n.pools}))),r.push("pools"))}let a=0,o=()=>{let c=Re();for(;a<s.length;){let l=Re(),u=s[a]()!==!1,d=Re()-l,f=r[a];if(u&&a++,d>(this.stats.stageMax[f]||0)&&(this.stats.stageMax[f]=+d.toFixed(1)),Re()-c>this.budget*.6)break}this.stats.streetSlices++,this.note(Re()-c),a<s.length&&e.queue.unshift({R:t,f:o})};return o}note(e){e>this.stats.maxSlice&&(this.stats.maxSlice=e)}roadJob(e,t){let n=t.json.roads,i=n.map(u=>{let d=0;for(let f=1;f<u.p.length;f++)d+=Math.hypot(u.p[f][0]-u.p[f-1][0],u.p[f][1]-u.p[f-1][1]);return d+20}),s=0,r=null,a=null,o=!1,c=u=>{let d=e.roadGrid(u);for(let[f,p]of d){let m=a.get(f);m?m.push(...p):a.set(f,p)}},l=()=>{let u=Re();for(r||(r=e.junctionsNear(t),a=new Map);!o;){let d=Math.max(60,this.budget*.8/(this.stats.msPerM||.004)),f=s,p=0;for(;f<n.length&&(f===s||p+i[f]<d);)p+=i[f++];let m=Re(),g=f>=n.length&&s>=n.length,b=g?e.roads.build({roads:[],junc:t.json.junc},r):e.roads.build({roads:n.slice(s,f),junc:[]},r);if(b.traverse(_=>{_.name=_.name||(g?"plate":"road")}),t.roadMesh?(t.roadMesh.add(b),c(b)):(t.roadMesh=b,t.group.add(b),c(b)),!g&&p>0){let _=(Re()-m)/p;this.stats.msPerM=this.stats.msPerM?this.stats.msPerM*.8+_*.2:_}if(g?o=!0:s=f,Re()-u>this.budget*.6)break}t.roadGrid=a,this.stats.roadSlices++,this.note(Re()-u),o||e.queue.unshift({R:t,f:l})};return l}bldJob(e,t,n){let i=0,s=()=>{let r=Re();for(;i<n.length;){let a=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerB||.5))),o=n.slice(i,i+a),c=Re(),l=e.buildings.build({b:o});l.traverse(d=>{d.isMesh&&(d.name="bld:"+(d.material.name||d.material.type))}),t.group.add(l);let u=(Re()-c)/o.length;if(this.stats.msPerB=this.stats.msPerB?this.stats.msPerB*.8+u*.2:u,i+=o.length,Re()-r>this.budget*.6)break}this.stats.bldSlices++,this.note(Re()-r),i<n.length&&e.queue.unshift({R:t,f:s})};return s}};var Na=class{constructor(e){A(this,"g",e);A(this,"on",!1);A(this,"n",0);A(this,"stats",{aoHalf:!1,shadowEvery:1,a2c:0});A(this,"a2c",new WeakSet);A(this,"stack",[]);let t=e.real?.q;if(!t||t.name!=="high")return;this.on=!0,window.__awAoT=5e3;let n=window.__awPost;if(n&&n.ao){let i=n.ao,s=i.setSize.bind(i);i.setSize=(r,a)=>s(Math.max(1,Math.ceil(r/2)),Math.max(1,Math.ceil(a/2))),i.updateGtaoMaterial({samples:8}),i.updatePdMaterial({samples:8}),n.resize(),this.stats.aoHalf=!0}this.stats.shadowEvery=2}coverage(){this.stack.length||this.stack.push(this.g.scene);let e=performance.now(),t=0;for(;this.stack.length&&t<300&&performance.now()-e<.6;){let n=this.stack.pop(),i=n.children;for(let r=0;r<i.length;r++)this.stack.push(i[r]);let s=n.material;if(!s){t++;continue}for(let r of Array.isArray(s)?s:[s])if(!this.a2c.has(r)&&(this.a2c.add(r),r.alphaTest>0&&!r.transparent&&!r.alphaToCoverage)){r.alphaToCoverage=!0,r.needsUpdate=!0,this.stats.a2c++;return}t++}}frame(){if(!this.on)return;this.stats.aoHalf&&this.coverage();let e=this.g.renderer.shadowMap;e.autoUpdate=!1,(this.n++&1)===0&&(e.needsUpdate=!0)}};var Ua=class{constructor(e){A(this,"on",!1);A(this,"stats",{water:!1,veg3d:0});let t=e.real;if(!t||!t.q||t.q.name!=="high")return;this.on=!0;let n=t.water?.nrm;n&&U.get("hlwater")!=="0"&&(n.anisotropy=16,n.needsUpdate=!0,this.stats.water=!0),U.get("hlveg")!=="0"&&(t.q.veg3d=340),this.stats.veg3d=t.q.veg3d}};var Wd=new Map,ka=new Map,Ei=new le(1,1,1);function lt(h,e,t=.5,n=.1){let i=ka.get(h);return i||(i=new Ee({color:e,roughness:t,metalness:n}),ka.set(h,i)),i}function It(h,e,t=512,n=128,i=.42,s=.1){let r=ka.get(h);if(r)return r;let a=Wd.get(h);if(!a){let o=document.createElement("canvas");o.width=t,o.height=n;let c=o.getContext("2d");e(c,t,n),a=new it(o),a.colorSpace=re,a.flipY=!1,a.anisotropy=4,Wd.set(h,a)}return r=new Ee({map:a,roughness:i,metalness:s}),ka.set(h,r),r}function et(h,e,t,n,i,s,r="bold",a="left",o="Arial, Helvetica, sans-serif"){h.font=`${r} ${i}px ${o}`,h.fillStyle=s,h.textAlign=a,h.textBaseline="middle",h.fillText(e,t,n)}function U0(h,e,t,n){h.save(),h.translate(e,t),h.scale(n,n),h.beginPath(),h.moveTo(-18,-30),h.lineTo(18,-30),h.lineTo(18,8),h.quadraticCurveTo(0,32,-18,8),h.closePath(),h.fillStyle="#1d4fb3",h.fill(),h.lineWidth=3,h.strokeStyle="#0d2a66",h.stroke(),h.fillStyle="#e9eef6",h.fillRect(-11,-22,22,22),h.fillStyle="#2e8b3a",h.beginPath(),h.ellipse(-14,10,6,13,.5,0,6.3),h.ellipse(14,10,6,13,-.5,0,6.3),h.fill(),h.fillStyle="#9aa3ad",h.fillRect(-2,-26,4,40),h.fillStyle="#1d4fb3",h.fillRect(-14,22,28,6),h.restore()}function qd(h,e){return(t,n,i)=>{t.fillStyle="#f4f5f7",t.fillRect(0,0,n,i);let s=r=>(e?r:1-r)*n;t.fillStyle="#1747b8",t.fillRect(0,i*.3,n,i*.17),t.fillStyle="#f2c81e",t.fillRect(0,i*.5,n,i*.035),t.fillRect(0,i*.555,n,i*.02),U0(t,s(.36),i*.42,1.05),et(t,"POLIS",s(.62),i*.385,38,"#ffffff","bold","center"),et(t,"Servicio, Integridad, Seguridad.",s(.47),i*.7,19,"#c8202a","bold","center"),et(t,String(h),s(.13),i*.18,30,"#111","bold","center"),et(t,"\u260E100",s(.8),i*.18,24,"#1747b8","bold","center"),et(t,String(h),s(.93),i*.42,34,"#111","bold","center"),t.strokeStyle="#1747b8",t.lineWidth=7;for(let r=0;r<2;r++)t.beginPath(),t.moveTo(s(.84+r*.035),i*.47),t.lineTo(s(.87+r*.035),i*.3),t.stroke()}}function Kd(h){return(e,t,n)=>{e.fillStyle="#f4f5f7",e.fillRect(0,0,t,n);let i=s=>(h?s:1-s)*t;e.fillStyle="#1f3b73",e.fillRect(0,n*.6,t,n*.05),et(e,"ForenSys",i(.45),n*.36,44,"#1f3b73","bold","center"),et(e,"ARUBA \xB7 Accident Registration",i(.45),n*.52,16,"#1f3b73","bold","center")}}function Xd(h,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;if(t.fillStyle=h?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),h)t.strokeStyle="#ffffff",t.lineWidth=16,t.beginPath(),t.moveTo(s(.05),i*.62),t.bezierCurveTo(s(.35),i*.85,s(.55),i*.15,s(.95),i*.45),t.stroke(),t.strokeStyle="#8f6fb8",t.lineWidth=5,t.beginPath(),t.moveTo(s(.05),i*.66),t.bezierCurveTo(s(.35),i*.9,s(.55),i*.2,s(.95),i*.5),t.stroke(),t.fillStyle="#ffffff",t.fillRect(s(.42)-46,i*.22,92,30),et(t,"InSan",s(.42),i*.22+15,24,"#2b6cc4","bold","center");else{t.fillStyle="#1f3a9c",t.fillRect(0,i*.5,n,i*.09),t.fillStyle="#e8ef1c",t.fillRect(s(.42)-n*.36,i*.5,n*.72,i*.09),et(t,"AMBULANCE",s(.42),i*.545,30,"#1f3a9c","bold","center"),t.fillStyle="#1f3a9c",t.beginPath();let r=s(.06),a=s(0);t.moveTo(r,i*.5),t.lineTo(a,i*.5),t.lineTo(a,i*.59),t.fill()}}}function Jd(h,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;t.fillStyle=h?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),h?(t.fillStyle="#ffffff",t.fillRect(0,i*.3,n,i*.05)):(t.fillStyle="#1f3a9c",t.fillRect(0,i*.3,n,i*.12)),et(t,"911",s(.55),i*.62,44,h?"#ffffff":"#c8202a","bold","center"),h||et(t,"PA SALBA BO BIDA",s(.55),i*.8,13,"#c8202a","bold","center")}}function Pl(h,e,t,n,i,s,r){return It(h,a=>{a.fillStyle=e,a.fillRect(0,0,s,r),et(a,t,s/2,r/2,i,n,"bold","center")},s,r)}function k0(h){return It("evPlate"+h,(e,t,n)=>{e.fillStyle="#f4f2ea",e.fillRect(0,0,t,n),e.strokeStyle="#1d3f8a",e.lineWidth=4,e.strokeRect(3,3,t-6,n-6),et(e,"ARUBA",t/2,13,12,"#1d3f8a","bold","center"),et(e,`A-${1e4+h*37}`,t/2,40,34,"#1d3f8a","bold","center")},256,64,.4,0)}var Cs=null,jd=null;function Is(){return jd||(jd=new An().loadAsync("./models/ev.glb?v=e1").then(h=>{let e=[];h.scene.traverse(t=>{var s;let n=/^ev(\d)_(?:L(\d)_([a-z]+)|(bar|mk))$/.exec(t.name);if(!n)return;let i=e[s=+n[1]]||(e[s]={lods:[new Map,new Map],bar:{p:new C,w:1}});n[3]&&t.isMesh?i.lods[+n[2]].set(n[3],t.geometry):n[4]==="bar"?i.bar={p:t.position.clone(),w:t.scale.x}:n[4]==="mk"&&(i.mk=t.position.clone())}),Cs=e}).catch(h=>{console.warn("[aw-ev] models/ev.glb",h)}))}var Ts=()=>!!Cs,O0={everest:0,forensys:0,isuzu:1,ambY:2,ambP:2},G0=45;function Q0(h,e){let t=h==="ambY"||h==="ambP",n=h==="ambP",i=h==="forensys",s=t?n?"#f29ac4":"#e8ef1c":"#f4f5f7",r=lt("evPaint"+s,s,.42,.1),a={paint:r,glass:lt("evGlass","#121a21",.08,.6),dark:lt("evDark","#1c1d20",.8,.05),chrome:lt("evChrome","#d6d9dc",.18,.95),light:lt("evLight","#eef2f5",.15,.3),tail:lt("evTail","#a3151a",.3,.1),plate:k0(e)};return t?(a.livr=It("abR"+h,Xd(n,!0),512,264),a.livl=It("abL"+h,Xd(n,!1),512,264),a.cabr=It("acR"+h,Jd(n,!0),256,192),a.cabl=It("acL"+h,Jd(n,!1),256,192),a.rear=Pl("aback"+h,s,n?"InSan  911":"AMBULANCE",n?"#ffffff":"#1f3a9c",40,512,122)):i?(a.livr=It("fsR",Kd(!0),768,128),a.livl=It("fsL",Kd(!1),768,128),a.hood=a.rear=r):(a.livr=It(`pR${e}`,qd(e,!0),768,128),a.livl=It(`pL${e}`,qd(e,!1),768,128),a.hood=Pl("hoodPolis","#f4f5f7","POLIS","#1747b8",64,256,128),a.rear=Pl(`rear${e}`,"#f4f5f7",`\u260E100   ${e}`,"#1747b8",44,512,76)),a}function Zd(h){let e=lt("evLight","#eef2f5",.15,.3),t=lt("evTail","#a3151a",.3,.1);e.emissive.setRGB(1,.95,.85).multiplyScalar(h*.6),t.emissive.setRGB(1,.12,.06).multiplyScalar(h),t.emissiveIntensity=1+2*h}var z0=(()=>{let h=new je(.5,12,6),e=h.attributes.position,t=n=>Math.sign(n)*Math.abs(2*n)**.3/2;for(let n=0;n<e.count;n++)e.setXYZ(n,t(e.getX(n)),t(e.getY(n)),t(e.getZ(n)));return h})(),Yd=(h,e,t,n,i,s,r,a)=>{let o=new q(z0,new Ce({color:e,toneMapped:!1}));return o.scale.set(s,r,a),o.position.set(t,n,i),o.name="aw:ebar",h.add(o),o};function Rs(h,e=45){let t=new ce;t.name="aw:ev:"+h;let n=h==="ambY"||h==="ambP",s={g:t,bar:[],colors:h==="forensys"?[16752640,16752640]:n?[16715784,16777215]:[16715784,1720575]},r=()=>{let a=Cs&&Cs[O0[h]];if(!a)return;let o=Q0(h,e),c=new Zi;c.name="aw:evlod",a.lods.forEach((d,f)=>{let p=new ce;for(let[m,g]of d){let b=o[m];if(!b)continue;let _=new q(g,b);_.castShadow=f===0,_.matrixAutoUpdate=!1,p.add(_)}c.addLevel(p,f?G0:0),p.visible=f===0}),t.add(c);let{p:l,w:u}=a.bar;for(let d of[-1,1])s.bar.push(Yd(t,2105380,d*u*.25,l.y+.05,l.z,u*.48,.1,.26));if(n&&a.mk)for(let d of[-1,1])s.bar.push(Yd(t,5246992,d*a.mk.x,a.mk.y,a.mk.z,.22,.14,.05))};return Cs?r():Is().then(r),s}var H0=new je(.12,10,8);function Bs(h,e,t=!1){let n=new ce;n.name="aw:npc";let i=lt("skin"+(Math.random()*3|0),["#8a5a3a","#b07a52","#d2a07a"][Math.random()*3|0],.7,0),s=lt("shirt"+h,h,.8,0),r=lt("pants"+e,e,.8,0),a=new q(Ei,r);a.scale.set(.14,.82,.16),a.position.set(-.09,.41,0),a.geometry=Ei;let o=a.clone();o.position.x=.09,n.add(a,o);let c=new q(Ei,s);c.scale.set(.4,.6,.22),c.position.set(0,1.12,0),n.add(c);let l=new q(H0,i);l.position.set(0,1.56,0),n.add(l);let u=p=>{let m=new ce;m.position.set(p*.25,1.38,0);let g=new q(Ei,s);return g.scale.set(.1,.62,.11),g.position.y=-.31,m.add(g),n.add(m),m},d=u(-1),f=u(1);if(t){let p=new q(Ei,lt("tablet","#202326",.3,.2));p.scale.set(.24,.32,.02),p.position.set(0,-.6,.12),f.add(p);let m=new q(Ei,new Ce({color:9422591,toneMapped:!1}));m.scale.set(.2,.27,.005),m.position.set(0,-.6,.135),f.add(m),f.rotation.x=-.9}return{g:n,armL:d,armR:f,legL:a,legR:o,t:Math.random()*10}}function Si(h,e,t,n=!1){if(h.t+=e,t==="walk"){let i=Math.sin(h.t*7)*.5;h.legL.rotation.x=i,h.legR.rotation.x=-i,h.armL.rotation.x=-i*.8,n||(h.armR.rotation.x=i*.8)}else if(h.legL.rotation.x=h.legR.rotation.x=0,t==="talk"){let i=Math.sin(h.t*2.3),s=Math.sin(h.t*3.1+1);h.armL.rotation.x=-.6-.5*Math.max(0,i),h.armL.rotation.z=-.25*s,n||(h.armR.rotation.x=-.4-.6*Math.max(0,s),h.armR.rotation.z=.3*i)}else h.armL.rotation.x=0,n||(h.armR.rotation.x=0);n&&(h.armR.rotation.x=t==="talk"?-.9-.4*Math.max(0,Math.sin(h.t*.7)):-.9)}function Ci(h,e,t,n){let i=(e+t)*2.5%1,s=Math.floor(i*8);h.bar.forEach((r,a)=>{let o=r.material,c=a%2===0,l=n&&(c?s<4&&(s&1)===0:s>=4&&(s&1)===0);o.color.setHex(l?c?h.colors[0]:h.colors[1]:2105380),l&&o.color.multiplyScalar(3)})}function Oa(h){h.traverse(e=>{let t=e;t.isMesh&&t.material&&t.material.isMeshBasicMaterial&&t.material.dispose()})}var $d=new le(1,1,1),Ga=new D(1,.06,.04),V0=new D(.1,.25,1),W0=new D(1,1,1),Ds=new D(.12,.12,.14),Nl={police:{body:"#f4f5f7",stripe:"#1747b8",a:Ga,b:V0},amb:{body:"#f6f6f2",stripe:"#d0121b",a:Ga,b:W0},fire:{body:"#b5141c",stripe:"#f3f3f3",a:Ga,b:Ga}};function q0(h,e,t,n){let i=h.children.filter(m=>m.isMesh&&m.material===e);if(!i.length)return null;h.updateMatrixWorld(!0);let s=h.matrixWorld.clone().invert(),r=new ds,a=new C,o=new C,c=24,l=t.min.z+(t.max.z-t.min.z)*.07,u=t.max.z-(t.max.z-t.min.z)*.07,d=(m,g,b)=>{a.set(m*(t.max.x+1),g,b).applyMatrix4(h.matrixWorld),o.set(-m,0,0).transformDirection(h.matrixWorld),r.set(a,o);let _=r.intersectObjects(i,!1)[0];if(!_)return null;let v=_.point.applyMatrix4(s);return v.x+=m*.012,v},f=[];for(let m of[-1,1]){let g=null;for(let b=0;b<=c;b++){let _=l+(u-l)*b/c,v=d(m,n-.08,_),x=d(m,n+.08,_),y=v&&x?[v,x]:null;if(g&&y){let[w,E]=m>0?[y,g]:[g,y];f.push(w[0].x,w[0].y,w[0].z,E[0].x,E[0].y,E[0].z,E[1].x,E[1].y,E[1].z,w[0].x,w[0].y,w[0].z,E[1].x,E[1].y,E[1].z,w[1].x,w[1].y,w[1].z)}g=y}}if(!f.length)return null;let p=new K;return p.setAttribute("position",new j(f,3)),p}var Qa=class{constructor(e){A(this,"g",e);A(this,"stats",{police:0,amb:0,fire:0,active:0,rolls:0});A(this,"st",new Map);A(this,"force",U.get("emerg")==="force");A(this,"time",0);A(this,"night",-1);A(this,"ext",null);Is()}pickRole(){if(this.stats.rolls++,!this.force&&Math.random()>=.1)return null;let e=Math.random()*10;return e<6?"police":e<9?"amb":"fire"}setup(e,t){let n=this.g.real.amb?.mats||{},i=new Set(Object.values(n)),s=new ye;for(let f of e.g.children){let p=f;if(!p.isMesh||p.name.startsWith("aw:"))continue;p.geometry.computeBoundingBox(),s.union(p.geometry.boundingBox);let m=p.material;!t.paint&&!Array.isArray(m)&&!i.has(m)&&!m.userData?.pid&&m.color&&(t.paint=m)}t.box=s,t.paint&&(t.base={c:t.paint.color.clone(),r:t.paint.roughness,m:t.paint.metalness,cc:t.paint.clearcoat});let r=s.max.x-s.min.x,a=s.max.z-s.min.z,o=s.max.y,c=s.min.z+a*.55;t.bar=[-1,1].map(f=>{let p=new q($d,new Ce({color:Ds,toneMapped:!1}));return p.scale.set(r*.3,.12,.28),p.position.set(f*r*.16,o+.06,c),p.name="aw:ebar",p.visible=!1,e.g.add(p),p});let l=s.min.y+(o-s.min.y)*.42,u=t.paint?q0(e.g,t.paint,s,l):null,d=new q(u||$d,new Ce({color:16777215}));u||(d.scale.set(r+.03,.16,a*.86),d.position.set(0,l,(s.min.z+s.max.z)/2)),d.name="aw:estripe",d.visible=!1,e.g.add(d),t.stripe=d}useModel(e,t,n){t.orig||(t.orig=e.g.children.filter(a=>!a.name.startsWith("aw:"))),t.model&&(e.g.remove(t.model.g),Oa(t.model.g),t.model=void 0);let i=(n==="police"||n==="amb")&&Ts();for(let a of t.orig)a.visible=!i;if(!i)return;let s=n==="police"?Math.random()<.6?"everest":"isuzu":Math.random()<.5?"ambY":"ambP",r=Rs(s,[45,50,67,38,71][Math.random()*5|0]);e.g.add(r.g),t.model=r,t.mkind=s}apply(e,t,n){if(t.role&&this.stats[t.role]--,t.role=n,n&&this.stats[n]++,this.useModel(e,t,n),t.model){if(t.bar)for(let s of t.bar)s.visible=!1;t.stripe&&(t.stripe.visible=!1),t.on=Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10;return}n&&!t.bar&&this.setup(e,t);let i=t.paint;if(i&&t.base&&(n?(i.color.set(Nl[n].body),i.roughness=.45,i.metalness=.1):(i.color.copy(t.base.c),i.roughness=t.base.r,i.metalness=t.base.m)),t.bar)for(let s of t.bar)s.visible=!!n;t.stripe&&(t.stripe.visible=!!n,n&&t.stripe.material.color.set(Nl[n].stripe)),t.on=!!n&&Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10}update(e){this.time+=e;let t=Math.round(Math.max(0,Math.min(1,(Te.value-.3)/.4))*50)/50;t!==this.night&&(this.night=t,Zd(t));let i=this.g.real?.amb?.cars;if(!i)return;let s=0;for(let r of i){let a=this.st.get(r.g);if(a||(a={role:null,rd:null,on:!1,t:0,ph:0},this.st.set(r.g,a)),r.rd&&r.rd!==a.rd?(a.rd=r.rd,this.apply(r,a,this.pickRole())):(a.role==="police"||a.role==="amb")&&!a.model&&Ts()&&this.apply(r,a,a.role),a.role&&a.model){(a.t-=e)<=0&&(a.on=!a.on,a.t=a.on?15+Math.random()*25:10+Math.random()*25),Ci(a.model,this.time,a.ph,a.on&&r.g.visible),a.on&&r.g.visible&&s++;continue}if(!a.role||!a.bar)continue;(a.t-=e)<=0&&(a.on=!a.on,a.t=a.on?15+Math.random()*25:10+Math.random()*25);let o=Nl[a.role],[c,l]=a.bar,u=c.material,d=l.material;if(a.on&&r.g.visible){s++;let f=(this.time+a.ph)*2.5%1,p=Math.floor(f*8),m=p<4&&(p&1)===0,g=p>=4&&(p&1)===0;u.color.copy(m?o.a:Ds).multiplyScalar(m?3:1),d.color.copy(g?o.b:Ds).multiplyScalar(g?3:1)}else u.color.copy(Ds),d.color.copy(Ds)}this.stats.active=s}};var za=class{constructor(e,t){A(this,"g",e);A(this,"emerg",t);A(this,"force",U.get("crash")==="force");A(this,"tx",Math.min(10,Math.max(1,+(U.get("crashx")||1))));A(this,"next",this.force?4:60);A(this,"time",0);A(this,"sc",null);A(this,"stats",{scenes:0,active:!1,phase:0,x:0,z:0,police:!1,fs:!1,talk:0,fx:0,fz:0});Is();let n=U.get("evshow");if(n){let i=()=>{this.amb()?this.showroom(n):setTimeout(i,1e3)};setTimeout(i,3e3)}}amb(){return this.g.real.amb||null}pt(e,t,n,i){let s=e.p,r=0;for(let a=1;a<s.length;a++){let o=s[a][0]-s[a-1][0],c=s[a][1]-s[a-1][1],l=Math.hypot(o,c)||1;if(r+l>=t||a===s.length-1){let u=Math.max(0,Math.min(1,(t-r)/l)),d=o/l,f=c/l;return{x:s[a-1][0]+o*u-f*n,z:s[a-1][1]+c*u+d*n,yaw:i>0?Math.atan2(d,f):Math.atan2(-d,-f)}}r+=l}return{x:s[0][0],z:s[0][1],yaw:0}}len(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}put(e,t,n=0){let i=this.amb();e.position.set(t.x,i.w.surfaceAt(t.x,t.z)+.02,t.z),e.rotation.set(0,t.yaw+n,0)}start(){let e=this.amb();if(!e||e.cars.length<3)return!1;let t=this.g.camera.position,n=e.cars.filter(i=>i.rd&&i.v!==4&&i.g.visible&&!i.g.children.some(s=>s.name.startsWith("aw:ev"))&&i.L>100&&!i.rd.ow&&i.rd.w>=6).map(i=>({c:i,d:Math.hypot(i.g.position.x-t.x,i.g.position.z-t.z)})).filter(i=>i.d>50&&i.d<260).sort((i,s)=>i.d-s.d);for(let{c:i}of n){let s=i.s+i.dir*50;if(s<15||s>i.L-15||(i.dir>0?i.s:i.L-i.s)<40)continue;let a=e.cars.filter(l=>l!==i&&l.v!==4&&!l.g.children.some(u=>u.name.startsWith("aw:ev"))).sort((l,u)=>Math.hypot(u.g.position.x-t.x,u.g.position.z-t.z)-Math.hypot(l.g.position.x-t.x,l.g.position.z-t.z))[0];if(!a)return!1;for(let l of[i,a])e.cars.splice(e.cars.indexOf(l),1);let o=i.dir*Math.min(2.2,i.rd.w/4);a.rd=i.rd,a.g.visible=!0;let c=new ce;return c.name="aw:crash",e.group.add(c),this.sc={rd:i.rd,dirA:i.dir,lat:o,sA:i.s,sB:s,impact:0,A:i,B:a,phase:0,age:0,tCrash:0,root:c,drivers:[],talk:0},this.stats.scenes++,this.stats.active=!0,!0}return!1}clear(){let e=this.sc,t=this.amb();e.root.parent?.remove(e.root),Oa(e.root);for(let n of[e.A,e.B])n.rd=null,n.g.visible=!1,n.g.rotation.set(0,n.g.rotation.y,0),t&&t.cars.push(n);this.emerg&&(this.emerg.ext=null),this.sc=null,this.stats.active=!1,this.stats.phase=0}mover(e,t,n,i){let s=Rs(e,[45,50,67][Math.random()*3|0]);return this.sc.root.add(s.g),{m:s,s:t,target:n,lat:i,sp:e==="forensys"?11:15,arrived:!1}}drive(e,t){let n=this.sc,i=n.dirA;if(!e.arrived){let r=(e.target-e.s)*i,a=Math.min(e.sp,Math.max(1.2,r*.8));e.s+=i*a*t,r<.3&&(e.arrived=!0)}let s=e.arrived?e.lat:n.lat+(e.lat-n.lat)*Math.max(0,1-Math.abs(e.target-e.s)/25);this.put(e.m.g,this.pt(n.rd,e.s,s,i))}update(e){e*=this.tx,this.time+=e;let t=this.sc;if(!t){(this.next-=e)<=0&&(this.next=this.force?6:60,(this.g.S&&this.g.S.mode||"walk")!=="plane"&&Ts()&&(this.force||Math.random()<.2)&&this.start());return}t.age+=e,this.stats.phase=t.phase,this.stats.police=!!t.police?.arrived,this.stats.fs=!!t.fs?.arrived,this.stats.talk=Math.round(t.talk),t.fs&&(this.stats.fx=t.fs.m.g.position.x,this.stats.fz=t.fs.m.g.position.z);let n=this.g.camera.position,i=this.pt(t.rd,(t.sA+t.sB)/2,t.lat,t.dirA);if(t.age>260||Math.hypot(i.x-n.x,i.z-n.z)>700){this.clear();return}this.stats.x=i.x,this.stats.z=i.z;let s=t.dirA;if(t.phase===0){let a=9*e;t.sA+=s*a,t.sB-=s*a;let o=(t.sB-t.sA)*s,c=Math.max(0,Math.min(1,1-(o-5)/40));this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s)),this.put(t.B.g,this.pt(t.rd,t.sB,-t.lat+2*t.lat*c,-s)),o<=4.6&&(t.phase=1,t.tCrash=t.age,this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s),.28),this.put(t.B.g,this.pt(t.rd,t.sB,t.lat*.75,-s),-.5),t.A.g.rotation.z=.02);return}let r=t.age-t.tCrash;if(r>3&&t.drivers.length===0)for(let[a,o]of[t.sA-s*1.5,t.sB+s*1.5].entries()){let c=Bs(["#2f6fb5","#c8452f","#3f8a4a","#e8c547"][Math.random()*4|0],["#2a2d33","#5a4a3a","#3b4f6b"][Math.random()*3|0]),l=this.pt(t.rd,o,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(c.g,l,a?Math.PI*.5:-Math.PI*.5),t.root.add(c.g),t.drivers.push(c)}for(let a of t.drivers)Si(a,e,"talk");if(r>8&&!t.police&&(t.police=this.mover(Math.random()<.6?"everest":"isuzu",s>0?0:t.rd.p.length&&this.len(t.rd),t.sA-s*Math.min(13,(s>0?t.sA:this.len(t.rd)-t.sA)-2),t.lat+Math.sign(t.lat||1)*.9)),t.police&&(this.drive(t.police,e),Ci(t.police.m,this.time,0,!0),this.emerg)){let a=t.police.m.g.position;this.emerg.ext={d:Math.hypot(a.x-n.x,a.z-n.z),ph:0}}if(t.police?.arrived&&!t.fs&&(t.fs=this.mover("forensys",s>0?0:this.len(t.rd),t.sA-s*Math.min(24,(s>0?t.sA:this.len(t.rd)-t.sA)-1),t.lat+Math.sign(t.lat||1)*.9)),t.fs&&(this.drive(t.fs,e),Ci(t.fs.m,this.time,1.3,!t.fs.arrived)),t.fs?.arrived&&!t.staff){t.staff=Bs("#1f3b73","#2a2d33",!0);let a=this.pt(t.rd,t.sA-s*22,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(t.staff.g,a),t.root.add(t.staff.g),t.staffPos={x:a.x,z:a.z}}if(t.staff&&t.staffPos){let a=this.pt(t.rd,(t.sA+t.sB)/2,t.lat+Math.sign(t.lat||1)*3.4,s),o=a.x-t.staffPos.x,c=a.z-t.staffPos.z,l=Math.hypot(o,c);if(l>.4){let u=Math.min(l,1.3*e);t.staffPos.x+=o/l*u,t.staffPos.z+=c/l*u,this.put(t.staff.g,{x:t.staffPos.x,z:t.staffPos.z,yaw:Math.atan2(o,c)}),Si(t.staff,e,"walk",!0)}else{t.talk+=e,Si(t.staff,e,"talk",!0);let u=t.staff.g.position;t.staff.g.rotation.y=Math.atan2(i.x-u.x,i.z-u.z);for(let d of t.drivers)d.g.rotation.y=Math.atan2(u.x-d.g.position.x,u.z-d.g.position.z)}}}showroom(e){let t=this.amb(),[n,i]=e.split(",").map(Number);if(!t||!isFinite(n))return;let s=new ce;s.name="aw:evshow",t.group.add(s),["everest","isuzu","ambY","ambP","forensys"].forEach((o,c)=>{let l=Rs(o,45),u=n+(c-2)*11;l.g.position.set(u,t.w.surfaceAt(u,i)+.02,i),l.g.rotation.y=Math.PI/2,s.add(l.g),setInterval(()=>Ci(l,performance.now()/1e3,c,!0),50)});let r=Bs("#1f3b73","#2a2d33",!0);r.g.position.set(n+28,t.w.surfaceAt(n+28,i+4),i+4),s.add(r.g);let a=Bs("#c8452f","#3b4f6b");a.g.position.set(n+29,t.w.surfaceAt(n+29,i+4),i+4),a.g.rotation.y=-Math.PI/2,s.add(a.g),setInterval(()=>{Si(r,.05,"talk",!0),Si(a,.05,"talk")},50)}};var Ul=420,Fs=56,Ha=class{constructor(e){A(this,"g");A(this,"marks");A(this,"smoke");A(this,"smokePos",new Float32Array(Fs*3));A(this,"smokeLife",new Float32Array(Fs));A(this,"smokeVel",new Float32Array(Fs*3));A(this,"i",0);A(this,"puff",0);A(this,"smokeClock",0);A(this,"lx",0);A(this,"lz",0);A(this,"tracking",!1);A(this,"lastSpeed",0);A(this,"baseFov",0);A(this,"m",new P);A(this,"q",new ae);A(this,"p",new C);A(this,"sc",new C(1,1,1));A(this,"up",new C(0,1,0));A(this,"mode","");A(this,"nearLod",[]);A(this,"farLod",[]);A(this,"lodBound",!1);A(this,"lodFar",!1);this.g=e;let t=new Vt(.28,1).rotateX(-Math.PI/2),n=new Ce({color:1053978,transparent:!0,opacity:.56,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2});this.marks=new me(t,n,Ul),this.marks.name="aw:vehicle-skids",this.marks.count=0,this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.instanceMatrix.setUsage($e),e.scene.add(this.marks),this.smokePos.fill(-1e4);let i=new K;i.setAttribute("position",new H(this.smokePos,3).setUsage($e));let s=document.createElement("canvas");s.width=s.height=64;let r=s.getContext("2d"),a=r.createRadialGradient(32,32,2,32,32,30);a.addColorStop(0,"rgba(220,225,228,.72)"),a.addColorStop(.42,"rgba(150,158,164,.34)"),a.addColorStop(1,"rgba(90,98,104,0)"),r.fillStyle=a,r.fillRect(0,0,64,64),this.smoke=new At(i,new hn({map:new it(s),color:12962251,size:.46,transparent:!0,opacity:.25,depthWrite:!1,sizeAttenuation:!0})),this.smoke.name="aw:moto-smoke",this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,e.scene.add(this.smoke);let o=document.createElement("style");o.textContent=`
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
}`,document.head.appendChild(o);let c=window;c.__awMotoEnabled=!0,c.__awMotoCam=(l,u,d,f)=>this.camera(l,u,d,f)}camera(e,t,n,i){let s=window;if(!i){s.__awMotoBump=Math.max(0,(s.__awMotoBump||0)-n*5);return}let r=Math.abs(t.s||0),a=performance.now()*.001,o=Math.max(0,Math.min(1,(r-25)/30)),c=Math.max(0,s.__awMotoBump||0),l=o*.025+c*.2,u=Math.sin(a*23)*l;e.x+=Math.cos(t.h)*u,e.z-=Math.sin(t.h)*u,e.y+=Math.sin(a*31)*l*.65+c*.08-.5,s.__awMotoBump=Math.max(0,c-n*4.5)}spawnSmoke(e){let t=this.puff,n=t*3,i=Math.sin(e.h),s=Math.cos(e.h);this.smokePos[n]=e.x+i*.78+(Math.random()-.5)*.22,this.smokePos[n+1]=e.y+.24+Math.random()*.12,this.smokePos[n+2]=e.z+s*.78+(Math.random()-.5)*.22,this.smokeVel[n]=(Math.random()-.5)*.3,this.smokeVel[n+1]=.38+Math.random()*.22,this.smokeVel[n+2]=(Math.random()-.5)*.3,this.smokeLife[t]=.72+Math.random()*.35,this.puff=(t+1)%Fs}updateSmoke(e){for(let t=0;t<Fs;t++){if(this.smokeLife[t]<=0)continue;let n=t*3;if(this.smokeLife[t]-=e,this.smokeLife[t]<=0){this.smokePos[n+1]=-1e4;continue}this.smokePos[n]+=this.smokeVel[n]*e,this.smokePos[n+1]+=this.smokeVel[n+1]*e,this.smokePos[n+2]+=this.smokeVel[n+2]*e,this.smokeVel[n]*=Math.pow(.2,e),this.smokeVel[n+2]*=Math.pow(.2,e)}this.smoke.geometry.getAttribute("position").needsUpdate=!0}updateLod(){if(!this.lodBound){let r=[],a=[];if(this.g.scene.traverse(o=>{o.name==="sport_bike"||o.name==="sport_rider"?r.push(o):(o.name==="sport_bike_far"||o.name==="sport_rider_far")&&a.push(o)}),!r.length||!a.length)return;this.nearLod=r,this.farLod=a,this.lodBound=!0;for(let o of a)o.visible=!1,o.castShadow=!1}let e=this.g.S;if(e.mode!=="moto")return;let t=this.g.camera.position,n=e.car,i=Math.hypot(t.x-n.x,t.y-(n.y||0),t.z-n.z),s=this.lodFar?i>14:i>18;if(s!==this.lodFar){this.lodFar=s;for(let r of this.nearLod)r.visible=!s;for(let r of this.farLod)r.visible=s}}update(e){this.updateLod();let t=this.g,n=t.S,i=n.mode==="car"||n.mode==="moto",s=n.mode==="moto";n.mode!==this.mode&&(this.mode=n.mode,document.body.classList.toggle("awmoto",s),this.tracking=!1,this.lastSpeed=0);let r=t.camera;this.baseFov||(this.baseFov=r.fov);let a=n.car,o=i?Math.abs(a.s||0):0,c=s?this.baseFov+Math.min(6,Math.max(0,o-10)*.14):n.mode==="car"?this.baseFov+Math.min(14,Math.max(0,o-8)*.3):this.baseFov;if(Math.abs(r.fov-c)>.05&&(r.fov+=(c-r.fov)*Math.min(1,e*3),r.updateProjectionMatrix()),this.updateSmoke(e),!i)return;let l=t.held||{},u=window.__awDrift||0,d=Math.max(0,(this.lastSpeed-o)/Math.max(.001,e)),f=s?u>.22||(l.brake||d>14)&&o>9:(l.brake||d>16)&&o>14;if(this.lastSpeed=o,s&&f&&o>8)for(this.smokeClock+=e*(u>.5?1.6:1);this.smokeClock>.08;)this.smokeClock-=.08,this.spawnSmoke(a);else this.smokeClock=0;let p=a.x-this.lx,m=a.z-this.lz,g=p*p+m*m;if(!this.tracking||!f||g>25){this.lx=a.x,this.lz=a.z,this.tracking=!0;return}if(g<.7*.7)return;let b=Math.atan2(p,m);this.q.setFromAxisAngle(this.up,b),this.sc.set(1,1,Math.sqrt(g));let _=Math.sin(a.h),v=Math.cos(a.h),x=s?.75:1.3,y=s?[0]:[-.78,.78];for(let w of y)this.p.set((a.x+this.lx)/2+_*x+v*w,a.y+.04,(a.z+this.lz)/2+v*x-_*w),this.m.compose(this.p,this.q,this.sc),this.marks.setMatrixAt(this.i,this.m),this.i=(this.i+1)%Ul,this.marks.count=Math.min(Ul,this.marks.count+1);this.marks.instanceMatrix.needsUpdate=!0,this.lx=a.x,this.lz=a.z}};var kl=560/3.6,Hn=40,ef=5.05,K0=7,tf=4.6,nf=7.5,Ol=.56,X0=`
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  vL = position.z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,J0=`
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
}`,j0=`
attribute float aLife; attribute float aSeed; varying float vLife; uniform float uScale;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uScale * (0.35 + aLife * 0.9) * (0.7 + aSeed * 0.6) / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`,Y0=`
varying float vLife; uniform float uI;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.0;
  if (r > 1.0 || vLife >= 1.0) discard;
  vec3 col = vLife < 0.25 ? mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.72, 0.32), vLife * 4.0)
                          : mix(vec3(1.0, 0.72, 0.32), vec3(0.85, 0.22, 0.04), (vLife - 0.25) / 0.75);
  float a = (1.0 - r) * pow(1.0 - vLife, 1.6) * uI;
  gl_FragColor = vec4(col * 1.6, a);
}`;function Z0(){let h=document.createElement("canvas");h.width=h.height=64;let e=h.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(225,238,255,1)"),t.addColorStop(.25,"rgba(150,190,255,0.6)"),t.addColorStop(.55,"rgba(255,140,40,0.3)"),t.addColorStop(1,"rgba(255,90,10,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);let n=new it(h);return n.colorSpace=re,n}function $0(){let h=[];for(let e=0;e<=14;e++){let t=e/14;h.push(new J(Math.max(.001,(1-t**1.25)*(1+.28*Math.sin(t*Math.PI))),t))}return new ss(h,18).rotateX(Math.PI/2)}var Va=class{constructor(e){A(this,"g");A(this,"on",!1);A(this,"btn");A(this,"fx",new ce);A(this,"plane",null);A(this,"t",0);A(this,"lvl",0);A(this,"pressOn",!1);A(this,"pressT",0);A(this,"core");A(this,"outer");A(this,"glow");A(this,"parts");A(this,"pos",new Float32Array(Hn*3));A(this,"vel",new Float32Array(Hn*3));A(this,"life",new Float32Array(Hn).fill(1));A(this,"ttl",new Float32Array(Hn).fill(.2));A(this,"emit",0);A(this,"zoomed",!1);this.g=e;let t=document.createElement("button");this.btn=t,t.innerHTML="TURBO JET<small>tap \xB7 hold</small>",t.className="awturbo",t.title="Turbo jet (T): tap to latch, hold for a burst",t.addEventListener("pointerdown",c=>{c.preventDefault(),c.stopPropagation();try{t.setPointerCapture(c.pointerId)}catch{}this.press(c.timeStamp)});let n=c=>{c.preventDefault(),this.release(c.timeStamp)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),t.addEventListener("contextmenu",c=>c.preventDefault()),document.querySelector('#actions .grp[data-for="plane"]')?.appendChild(t);let i=document.createElement("style");i.textContent=`#actions button.awturbo{grid-column:span 2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;letter-spacing:.06em;background:linear-gradient(180deg,#3a5f9ab8,#1c2c4ab8);border-color:#9fc4ffcc;-webkit-user-select:none;user-select:none}
#actions button.awturbo small{font-size:10px;font-weight:600;opacity:.75;letter-spacing:.02em}
#actions button.awturbo.lit{background:radial-gradient(circle at 50% 120%,#fff6 0,#0000 60%),linear-gradient(180deg,#ffb347,#ff6a1a);color:#1a1a1a;border-color:#fff;box-shadow:0 0 16px #ff8c1acc,0 0 4px #bfe0ff inset}`,document.head.appendChild(i),window.addEventListener("keydown",c=>{c.code==="KeyT"&&!c.repeat&&e.S.mode==="plane"&&!(c.target instanceof HTMLInputElement)&&this.press(c.timeStamp)}),window.addEventListener("keyup",c=>{c.code==="KeyT"&&this.release(c.timeStamp)}),window.addEventListener("blur",c=>this.release(c.timeStamp));let s=document.getElementById("keyhelp");s&&!/turbo/i.test(s.textContent||"")&&(s.textContent+=" \xB7 T turbo jet (plane)"),this.core=this.plume(10273535,4223231,1,.5,1),this.core.scale.set(.3,.3,tf),this.outer=this.plume(16760426,16734738,0,.6,1.7),this.outer.scale.set(Ol,Ol,nf),this.glow=new Yi(new di({map:Z0(),color:13820671,blending:Un,depthWrite:!1,transparent:!0,fog:!1,toneMapped:!1})),this.glow.position.z=.15,this.glow.scale.setScalar(3),this.glow.renderOrder=6;let r=new K;r.setAttribute("position",new H(this.pos,3).setUsage($e)),r.setAttribute("aLife",new H(this.life,1).setUsage($e)),r.setAttribute("aSeed",new H(Float32Array.from({length:Hn},()=>Math.random()),1)),this.parts=new At(r,new gt({vertexShader:j0,fragmentShader:Y0,uniforms:{uI:{value:0},uScale:{value:300}},transparent:!0,depthWrite:!1,blending:Un})),this.parts.frustumCulled=!1,this.parts.renderOrder=5;let a=new q(new Ie(.5,.36,.6,16,1,!0).rotateX(Math.PI/2),new Ee({color:3816514,metalness:.8,roughness:.35,side:We}));a.position.z=ef-.3;let o=new ce;o.position.z=ef,o.add(this.core,this.outer,this.glow,this.parts),this.fx.name="aw-turbo",this.fx.add(a,o),o.name="aw-turbo-flame"}plume(e,t,n,i,s){let r=new gt({vertexShader:X0,fragmentShader:J0,transparent:!0,depthWrite:!1,side:We,blending:$o,blendSrc:ec,blendDst:Or,uniforms:{uT:{value:0},uI:{value:0},uCore:{value:n},uOcc:{value:i},uGain:{value:s},uC0:{value:new D(e)},uC1:{value:new D(t)}}}),a=new q($0(),r);return a.renderOrder=n?5:4,a.frustumCulled=!1,a}press(e){this.g.S.mode==="plane"&&(this.on?(this.set(!1),this.pressOn=!1):(this.set(!0),this.pressOn=!0,this.pressT=e))}release(e){this.pressOn&&e-this.pressT>350&&this.set(!1),this.pressOn=!1}set(e){this.on=e,this.btn.classList.toggle("lit",e)}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}update(e){let t=this.g.S.mode==="plane";!t&&this.on&&(this.set(!1),this.pressOn=!1);let n=window;if(n.__awTurbo=this.on&&t,n.__awTurboK=2,n.__awTurboV=kl,this.lvl+=((this.on&&t?1:0)-this.lvl)*Math.min(1,e*(this.on?7:4)),this.lvl<.003&&!this.on&&(this.lvl=0),n.__awTurboLvl=this.lvl,this.on&&t){let l=this.g.S.plane;l.s>kl&&(l.s=kl)}this.fov(t);let i=t?this.findPlane():null;i&&this.fx.parent!==i&&i.add(this.fx),this.fx.visible=!!i;let s=this.fx.children[1];if(s.visible=this.lvl>0,!i||!s.visible)return;this.t+=e;let r=this.t,a=this.lvl,o=1+Math.sin(r*61)*.07+Math.sin(r*37+1.1)*.06+(Math.random()-.5)*.08;for(let l of[this.core,this.outer]){let u=l.material.uniforms;u.uT.value=r,u.uI.value=a}this.core.scale.z=tf*(.45+.55*a)*o,this.outer.scale.z=nf*(.4+.6*a)*(2-o);let c=1+(Math.random()-.5)*.06;this.outer.scale.x=this.outer.scale.y=Ol*c,this.glow.material.opacity=(.5+Math.random()*.2)*a,this.glow.scale.setScalar(3*(.8+.2*o)),this.particles(e,a)}particles(e,t){let n=this.pos,i=this.vel,s=this.life;this.emit+=e*Hn/.2*t;for(let o=0;o<Hn;o++){if(s[o]>=1){if(this.emit<1)continue;this.emit-=1;let c=Math.random()*.22,l=Math.random()*6.283;n[o*3]=Math.cos(l)*c,n[o*3+1]=Math.sin(l)*c,n[o*3+2]=Math.random()*.4,i[o*3]=(Math.random()-.5)*3.5,i[o*3+1]=(Math.random()-.5)*3.5,i[o*3+2]=28+Math.random()*18,s[o]=0,this.ttl[o]=.14+Math.random()*.16;continue}s[o]=Math.min(1,s[o]+e/this.ttl[o]),n[o*3]+=i[o*3]*e,n[o*3+1]+=i[o*3+1]*e,n[o*3+2]+=i[o*3+2]*e}this.emit=Math.min(this.emit,4);let r=this.parts.geometry;r.attributes.position.needsUpdate=!0,r.attributes.aLife.needsUpdate=!0;let a=this.parts.material;a.uniforms.uI.value=t,a.uniforms.uScale.value=this.g.renderer.domElement.height*.27}fov(e){let t=this.g.camera;if(!e&&!this.zoomed)return;let n=t.fov*Math.PI/360,i=K0*(e?this.lvl:0)*Math.PI/360,s=i>1e-4?Math.tan(n)/Math.tan(n+i):1;Math.abs(t.zoom-s)>1e-4&&(t.zoom=s,t.updateProjectionMatrix()),this.zoomed=s!==1}};var eb=42,tb=56,nb=40,ib=h=>Math.atan2(Math.sin(h),Math.cos(h)),sf=(h,e)=>Math.sign(h)*Math.pow(Math.abs(h),e),rf=(h,e,t)=>Math.max(e,Math.min(t,h)),Gl=h=>h.y-((h.g||0)+2),Wa=class{constructor(e){A(this,"g");A(this,"ch",0);A(this,"cp",0);A(this,"cd",26);A(this,"camOn",!1);A(this,"lx",0);A(this,"lz",0);A(this,"res",{h:0,p:0,d:26});A(this,"gear");A(this,"gearK",0);A(this,"plane",null);A(this,"spawned",null);A(this,"mode","");this.g=e,this.gear=this.buildGear(),window.__awFly={gnd:t=>t.y<=(t.g||0)+2.05,ctl:(t,n,i,s,r)=>this.ctl(t,n,i,s,r),gs:t=>.6/(1+Math.abs(t.s)/15),acc:(t,n,i,s,r)=>this.acc(t,n,i,s,r),vy:(t,n,i,s)=>this.vy(t,n,s),cam:(t,n,i)=>this.cam(t,n,i),spawn:(t,n)=>this.spawn(t,n)}}ctl(e,t,n,i,s){let r=sf(t,1.5)*1.15;e.q=(e.q||0)+(r-(e.q||0))*Math.min(1,i*7),e.p+=e.q*i;let a=Math.abs(t)<.08;if(a){let c=Gl(e),l=s?0:e.thr>.5?c<90?.1:c<140?.1*(140-c)/50:0:c<25?-.035:0;e.p+=(l-e.p)*(1-.4**i)}if(s){a&&e.s>tb&&e.thr>.5&&(e.p+=(.13-e.p)*Math.min(1,i*1.5));let c=e.s<eb?.02:.2;e.p>c&&(e.p+=(c-e.p)*Math.min(1,i*3)),e.p<0&&(e.p=0,e.q=Math.max(0,e.q))}let o=s?0:-sf(n,1.4)*.85;e.r+=(o-e.r)*Math.min(1,i*(s?6:3.2))}acc(e,t,n,i,s){let r=!!window.__awTurbo,a=i&&s<-.3,o=a?0:t;i&&e.thr<.5&&(o*=(e.thr/.5)**2),i||(o=Math.max(o,nb));let c=(o-e.s)*.9,l=i?r?14:7.5:r?32:16;return rf(c,-(i?a?10:5:12),l)*n}vy(e,t,n){if(!n&&e.thr<.35&&(t-=(.35-e.thr)/.35*4.5),t>=0)return t;let i=Math.max(0,Gl(e));return i>45?t:Math.max(t,-(1.2+i*.5+i*i*.03))}cam(e,t,n){let s=(this.g.camera.aspect<.8?20:26)+Math.min(e.s,160)*.055+(window.__awTurboLvl||0)*3,r=Math.hypot(e.x-this.lx,e.z-this.lz)>300;return this.lx=e.x,this.lz=e.z,(!this.camOn||n||r)&&(this.ch=e.h,this.cp=e.p,this.cd=s,this.camOn=!0),this.ch+=ib(e.h-this.ch)*Math.min(1,t*3),this.cp+=(e.p-this.cp)*Math.min(1,t*3),this.cd+=(s-this.cd)*Math.min(1,t*1.5),this.res.h=this.ch,this.res.p=this.cp,this.res.d=this.cd,this.res}runway(){let e=this.g.DATA?.runways||[],t=null,n=0;for(let i of e){let s=Math.hypot(i[i.length-1][0]-i[0][0],i[i.length-1][1]-i[0][1]);s>n&&(n=s,t=i)}return t&&n>1500?{A:t[0],B:t[t.length-1],L:n}:null}spawn(e,t){if(t==="plane")return;let n=this.runway();if(!n)return;let i=(n.B[0]-n.A[0])/n.L,s=(n.B[1]-n.A[1])/n.L,r=e.x-n.A[0],a=e.z-n.A[1],o=r*i+a*s;if(Math.abs(r*s-a*i)>450||o<-600||o>n.L+600)return;let l=o<n.L/2,u=l?90:n.L-90,d=l?1:-1;e.x=n.A[0]+i*u,e.z=n.A[1]+s*u,e.h=Math.atan2(-i*d,-s*d);let f=this.g.real;e.g=f?Math.max(0,f.heightAt(e.x,e.z)):0,e.y=e.g+2,e.p=0,e.r=0,e.s=0,e.thr=0,e.q=0,this.spawned={x:e.x,z:e.z},this.camOn=!1;let p=document.getElementById("toast");p&&(p.textContent=`Runway ${l?"29":"11"}, Queen Beatrix \xB7 hold THR+ to take off \xB7 DIVE brakes`,p.classList.add("on"),setTimeout(()=>p.classList.remove("on"),4500))}buildGear(){let e=new ce;e.name="aw-gear";let t=new Ee({color:12106948,metalness:.6,roughness:.4}),n=new Ee({color:1776413,roughness:.9}),i=new Ie(.07,.07,1,6).translate(0,-.5,0),s=new Ie(.26,.26,.22,12).rotateZ(Math.PI/2);for(let[r,a,o]of[[0,-3.3,-.45],[-1.15,.4,-.55],[1.15,.4,-.55]]){let c=new ce;c.position.set(r,o,a);let l=o+1.74,u=new q(i,t);u.scale.y=l,c.add(u);let d=new q(s,n);d.position.y=-l,c.add(d),e.add(c)}return e.visible=!1,e}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}get planeObj(){return this.findPlane()}update(e){let t=this.g.S;if(t.mode!==this.mode&&(this.mode=t.mode,t.mode!=="plane"&&(this.camOn=!1)),t.mode!=="plane")return;let n=t.plane;if(this.spawned){if(Math.hypot(n.x-this.spawned.x,n.z-this.spawned.z)>20){let r=this.g.real;n.y=Math.max((r?r.heightAt(n.x,n.z):0)+200,250),n.s=65,n.thr=.65,n.p=.05}this.spawned=null}let i=this.findPlane();if(!i)return;this.gear.parent!==i&&i.add(this.gear);let s=Gl(n)<(this.gearK>.5?70:55);this.gearK=rf(this.gearK+(s?e:-e)/1.6,0,1),this.gear.visible=this.gearK>.01,this.gear.scale.setScalar(this.gearK),this.gear.position.y=(1-this.gearK)*.4}};var Ii=[4380,4538,4696,4848,4999,5150,5308,5466,5629,5789],Ls=8542,qa=80,af=44,Ka=class{constructor(e){A(this,"g",e);A(this,"hAt");A(this,"k",0);A(this,"ang",[]);A(this,"ys",[]);A(this,"static");A(this,"rot");A(this,"m",new P);A(this,"q",new ae);A(this,"e",new Mt);A(this,"p",new C);A(this,"s",new C(1,1,1));let t=e.real;this.hAt=(a,o)=>t.heightAt(a,o);let n=new oe({color:15659250}),i=new le(.5,af,2);i.translate(0,af/2+1,0);let s=[new je(1.5,8,6)];for(let a=0;a<3;a++)s.push(i.clone().rotateX(a*2.0944));let r=_t(s.map(a=>a.toNonIndexed()));this.rot=new me(r,n,Ii.length),this.rot.frustumCulled=!1,this.rot.name="aw:windfarm:rotors",this.rot.castShadow=!1,this.rebuild(),e.scene.add(this.rot)}rebuild(){let e=[];Ii.forEach((n,i)=>{let s=this.hAt(Ls,n)-.5;this.ys[i]=Number.isFinite(s)?s:this.ys[i]||0;let r=new Ie(1.4,2.1,qa,10,1,!0).toNonIndexed();r.translate(Ls,this.ys[i]+qa/2,n);let a=new le(10,3.6,3.6).toNonIndexed();a.translate(Ls-1.5,this.ys[i]+qa+.3,n),e.push(r,a),this.ang[i]===void 0&&(this.ang[i]=i*.7)});let t=_t(e);t.computeBoundingSphere(),this.static?(this.static.geometry.dispose(),this.static.geometry=t):(this.static=new q(t,this.rot.material),this.static.name="aw:windfarm",this.g.scene.add(this.static))}update(e){if((++this.k&255)===0){let t=!1;for(let n=0;n<Ii.length;n++){let i=this.hAt(Ls,Ii[n])-.5;Number.isFinite(i)&&Math.abs(i-this.ys[n])>.05&&(t=!0)}t&&this.rebuild()}for(let t=0;t<Ii.length;t++)this.ang[t]-=e*.9,this.e.set(this.ang[t],0,0),this.q.setFromEuler(this.e),this.p.set(Ls+4.2,this.ys[t]+qa+1.3,Ii[t]),this.m.compose(this.p,this.q,this.s),this.rot.setMatrixAt(t,this.m);this.rot.instanceMatrix.needsUpdate=!0}};var of=3200,Qe=8,Z={fairway:4164664,green:8832594,tee:3115576,bunker:16052452,path:12039080,water:1995652,deck:14996927,wall:15986660,roof:12075820,glass:2373190,cloth:16250094},cf=[16250868,13781835,3108798,15913306,16250868],Xa=[1845056,3814444,1845056,2371652,2765124],Ti=[13998706,12155220,15581854,9261888,12878940];function sb(h,e,t,n){h.onBeforeCompile=i=>{i.vertexShader=`varying vec3 vTdsW;
`+i.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
	vTdsW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),i.fragmentShader=`varying vec3 vTdsW;
`+i.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
      float s = fract(vTdsW.x * ${e.toFixed(4)} + vTdsW.z * ${(e*.37).toFixed(4)});
      diffuseColor.rgb *= s < 0.5 ? ${n.toFixed(3)} : 1.0;`)},h.customProgramCacheKey=()=>t}function Ri(h,e,t,n){let i=new oe({color:h});return i.polygonOffset=!0,i.polygonOffsetFactor=-2,i.polygonOffsetUnits=-4,e&&t&&n&&sb(i,t,e,n),i}function Ja(h,e,t){let n=!1;for(let i=0,s=h.length-1;i<h.length;s=i++){let r=h[i][1],a=h[s][1];r>t!=a>t&&e<(h[s][0]-h[i][0])*(t-r)/(a-r)+h[i][0]&&(n=!n)}return n}function Vn(h,e,t){if(!Ja(h.o,e,t))return!1;let n=h.h||[];for(let i=0;i<n.length;i++)if(Ja(n[i],e,t))return!1;return!0}function Ql(h){let e=1/0,t=-1/0,n=1/0,i=-1/0;for(let s=0;s<h.length;s++){let r=h[s][0],a=h[s][1];r<e&&(e=r),r>t&&(t=r),a<n&&(n=a),a>i&&(i=a)}return{x0:e,x1:t,z0:n,z1:i}}function en(h){let e=0,t=0,n=Math.max(1,h.length-(h.length>1&&h[0][0]===h[h.length-1][0]?1:0));for(let i=0;i<n;i++)e+=h[i][0],t+=h[i][1];return[e/n,t/n]}function Ps(h){let e=h.slice();return e.length>1&&Math.hypot(e[0][0]-e[e.length-1][0],e[0][1]-e[e.length-1][1])<.2&&e.pop(),e}function lf(h){let e=0;for(let t=0;t<h.length;t++){let n=(t+1)%h.length;e+=h[t][0]*h[n][1]-h[n][0]*h[t][1]}return e*.5}function rb(h){let e=Ps(h).map(s=>[s[0],s[1]]);e.sort((s,r)=>s[0]-r[0]||s[1]-r[1]);let t=(s,r,a)=>(r[0]-s[0])*(a[1]-s[1])-(r[1]-s[1])*(a[0]-s[0]),n=[];for(let s of e){for(;n.length>=2&&t(n[n.length-2],n[n.length-1],s)<=0;)n.pop();n.push(s)}let i=[];for(let s=e.length-1;s>=0;s--){let r=e[s];for(;i.length>=2&&t(i[i.length-2],i[i.length-1],r)<=0;)i.pop();i.push(r)}return i.pop(),n.pop(),n.concat(i)}function ab(h){return[(h>>16)/255,(h>>8&255)/255,(h&255)/255]}var ja=class{constructor(e){A(this,"g",e);A(this,"world");A(this,"hAt");A(this,"group",new ce);A(this,"data",null);A(this,"low");A(this,"sheets",[]);A(this,"mask",new Set);A(this,"mats");A(this,"poles");A(this,"flags");A(this,"palms");A(this,"cacti");A(this,"rocks");A(this,"cartBody");A(this,"cartRoof");A(this,"cartWheel");A(this,"gHead");A(this,"gTorso");A(this,"gLegs");A(this,"gArms");A(this,"gClub");A(this,"spots",[]);A(this,"spotN",0);A(this,"flagAt",[]);A(this,"flagN",0);A(this,"routes",[]);A(this,"carts",[]);A(this,"golfers",[]);A(this,"clubMesh",null);A(this,"clubPos",null);A(this,"clubCol",null);A(this,"clubIdx",null);A(this,"clubX",0);A(this,"clubZ",0);A(this,"clubDone",!1);A(this,"propKey","");A(this,"actorsOn",!1);A(this,"warm",0);A(this,"t",0);A(this,"last",0);A(this,"m",new P);A(this,"q",new ae);A(this,"leanQ",new ae);A(this,"v",new C);A(this,"up",new C(0,1,0));A(this,"axisX",new C(1,0,0));A(this,"west",new C(0,0,1));A(this,"scale",new C);let t=e.real;this.world=t,this.hAt=(i,s)=>t.heightAt(i,s),this.low=e.real?.q.name==="low",this.group.name="aw:tds",e.scene.add(this.group),this.mats={fairway:Ri(Z.fairway,"tds-fair",.09,.86),green:Ri(Z.green,"tds-green",.22,.9),tee:Ri(Z.tee),bunker:Ri(Z.bunker),path:Ri(Z.path),water:Ri(Z.water),club:new oe({color:16777215,vertexColors:!0,side:We}),palm:new oe({color:16777215,vertexColors:!0}),cactus:new oe({color:16777215,vertexColors:!0}),rock:new oe({color:16777215,vertexColors:!0}),pole:new oe({color:15263456}),flag:new oe({color:16777215}),cart:new oe({color:16052714}),roof:new oe({color:2762532}),tire:new oe({color:1710618}),skin:new oe({color:16777215}),shirt:new oe({color:16777215}),shorts:new oe({color:16777215}),clubShaft:new oe({color:2236962})},this.mats.path.side=We;let n=i=>(i.instanceMatrix.setUsage($e),i);this.poles=this.blank(this.poleGeo(),this.mats.pole,24),this.flags=this.blank(this.flagGeo(),this.mats.flag,24),this.palms=this.blank(this.palmGeo(),this.mats.palm,40),this.cacti=this.blank(this.cactusGeo(),this.mats.cactus,48),this.rocks=this.blank(this.rockGeo(),this.mats.rock,32),this.cartBody=n(this.blank(this.cartBodyGeo(),this.mats.cart,4)),this.cartRoof=n(this.blank(this.cartRoofGeo(),this.mats.roof,4)),this.cartWheel=n(this.blank(this.wheelGeo(),this.mats.tire,16)),this.gHead=n(this.blank(new je(.16,6,5).translate(0,1.62,0),this.mats.skin,5)),this.gTorso=n(this.blank(new le(.4,.46,.22).translate(0,1.22,0),this.mats.shirt,5)),this.gLegs=n(this.blank(new le(.14,.5,.16),this.mats.shorts,10)),this.gArms=n(this.blank(new le(.09,.4,.09),this.mats.skin,10)),this.gClub=n(this.blank(this.clubGeo(),this.mats.clubShaft,5)),this.installVeg(),this.load()}pending(){if(!this.data)return 1;let e=0;for(let t of this.sheets)for(let n of t.jobs)n.at<n.ids.length&&this.hasKey(n.key)&&e++;return!this.clubDone&&this.hasH(this.clubX,this.clubZ)&&e++,e}frame(){let e=performance.now(),t=this.last?Math.min(.05,(e-this.last)/1e3):0;if(this.last=e,this.t+=t,!this.data)return;this.pump(),this.fillClub(),this.placeStatic();let n=this.g.camera.position,i=this.data.anchor[0],s=this.data.anchor[1],r=(n.x-i)**2+(n.z-s)**2<of*of;if(this.warm>0?(this.warm--,this.group.visible=!0,this.group.traverse(o=>{o.frustumCulled=!1}),this.warm===0&&this.group.traverse(o=>{let c=o;c.isMesh&&(c.frustumCulled=!c.isInstancedMesh)})):this.group.visible!==r&&(this.group.visible=r),!r){this.actorsOn&&this.hideActors();return}this.animate(t,n.x,n.y,n.z);let a=(n.x*.02|0)+","+(n.z*.02|0)+","+(n.y>480?1:0);a!==this.propKey&&(this.propKey=a,this.cullProps(n.x,n.y,n.z))}installVeg(){let e=window,t=e.__awVegHit,n=this.mask;e.__awVegHit=(i,s,r)=>n.has(Math.floor(i/Qe)+","+Math.floor(s/Qe))?!0:t?t(i,s,r):!1}async load(){try{let o=await fetch("./data/real/tds_golf.json",{cache:"force-cache"});if(!o.ok)return;this.data=await o.json()}catch{return}let e=this.data,t=this.low?.38:.16,n=this.low?.5:.28,i=this.low?.44:.22,s=this.low?16:4,r=this.low?12:4,a=this.low?8:3;this.addSheet("fairway",this.mats.fairway,e.fairways,s,()=>t,!1),this.addSheet("green",this.mats.green,e.greens,r,()=>n,!1),this.addSheet("tee",this.mats.tee,e.tees,this.low?14:4,()=>i,!1),this.addSheet("bunker",this.mats.bunker,e.bunkers,a,(o,c,l)=>this.bowl(o,c,l),!1),this.addSheet("water",this.mats.water,e.water,this.low?12:6,()=>0,!0),this.addPaths(),this.prepClub(),this.scatter(),this.buildRoutes(),this.fillMask(),this.hideClubFootprints(),this.world.vegDirty=!0,this.bakeGpu()}addSheet(e,t,n,i,s,r){let a=this.raster(n,i,s,r);a.nq&&this.sheets.push(this.sheet(e,t,a.corn,a.nq,a.jobs,r,r?n:null,a.polyOf))}raster(e,t,n,i){let s=[],r=[],a=[];for(let o=0;o<e.length;o++){let c=e[o],l=Ql(c.o),u=Math.floor(l.x0/t)*t,d=Math.ceil(l.x1/t)*t,f=Math.floor(l.z0/t)*t,p=Math.ceil(l.z1/t)*t;for(let m=u;m<d;m+=t)for(let g=f;g<p;g+=t){if(!Vn(c,m+t*.5,g+t*.5))continue;let b=[[m,g],[m,g+t],[m+t,g],[m+t,g+t]];for(let[_,v]of b)s.push(_,v,i?0:n(c,_,v));r.push(this.regKey(m+t*.5,g+t*.5)),a.push(o)}}return{corn:Float32Array.from(s),nq:r.length,jobs:this.jobsOf(r),polyOf:i?Uint16Array.from(a):null}}addPaths(){let e=this.data,t=[],n=[],i=1.35,s=this.low?.42:.34,r=this.low?6:4;for(let o of e.paths){let c=[];for(let l=1;l<o.length;l++){let u=o[l-1][0],d=o[l-1][1],f=o[l][0],p=o[l][1],m=Math.hypot(f-u,p-d),g=Math.max(1,Math.ceil(m/r));for(let b=0;b<g;b++)c.push([u+(f-u)*b/g,d+(p-d)*b/g])}o.length&&c.push(o[o.length-1]);for(let l=1;l<c.length;l++){let u=c[l-1],d=c[l],f=d[0]-u[0],p=d[1]-u[1],m=Math.hypot(f,p)||1,g=-p/m*i,b=f/m*i,_=[[u[0]-g,u[1]-b],[d[0]-g,d[1]-b],[u[0]+g,u[1]+b],[d[0]+g,d[1]+b]];for(let[v,x]of _)t.push(v,x,s);n.push(this.regKey((u[0]+d[0])*.5,(u[1]+d[1])*.5))}}let a=n.length;a&&this.sheets.push(this.sheet("path",this.mats.path,Float32Array.from(t),a,this.jobsOf(n),!1,null,null))}jobsOf(e){let t=new Map;for(let i=0;i<e.length;i++){let s=e[i],r=t.get(s);r||t.set(s,r=[]),r.push(i)}let n=[];for(let[i,s]of t)n.push({key:i,ids:s,at:0});return n}sheet(e,t,n,i,s,r,a,o){let c=this.data.anchor[0],l=this.data.anchor[1],u=3+i*4,d=3+i*6,f=new Float32Array(u*3),p=new Float32Array(u*3),m=new Uint32Array(d);for(let _=0;_<u;_++)f[_*3]=c,f[_*3+1]=-40,f[_*3+2]=l,p[_*3+1]=1;m[0]=0,m[1]=1,m[2]=2,f[3]=c+.4,f[6]=c,f[8]=l+.4;let g=new K;g.setAttribute("position",new H(f,3)),g.setAttribute("normal",new H(p,3)),g.setIndex(new H(m,1)),g.setDrawRange(0,3),g.computeBoundingSphere();let b=new q(g,t);return b.name="aw:tds:"+e,b.receiveShadow=!0,b.castShadow=!1,b.matrixAutoUpdate=!1,b.frustumCulled=!1,this.group.add(b),{mesh:b,corn:n,nq:i,jobs:s,water:r,polys:a,waterY:new Map,polyOf:o,pos:f,nor:p,idx:m,vUsed:3,iUsed:3,upV:0,upI:0,dirty:!1,done:s.length===0}}bakeGpu(){let e=[this.poles,this.flags,this.palms,this.cacti,this.rocks,this.cartBody,this.cartRoof,this.cartWheel,this.gHead,this.gTorso,this.gLegs,this.gArms,this.gClub],t=e.map(s=>s.count),n=this.data.anchor[0],i=this.data.anchor[1];for(let s of e)s.count===0&&(this.setInst(s,0,n,-80,i,0,1),s.count=1,s.instanceMatrix.needsUpdate=!0),s.frustumCulled=!1;this.group.visible=!0,this.group.traverse(s=>{s.frustumCulled=!1});try{this.g.renderer.render(this.group,this.g.camera)}catch{}e.forEach((s,r)=>{s.count=t[r]}),this.group.traverse(s=>{let r=s;r.isMesh&&(r.frustumCulled=!r.isInstancedMesh)}),this.group.visible=!1}pump(){let e=this.low?900:450;for(let t of this.sheets){if(t.done)continue;let n=!1;for(let i of t.jobs)if(!(i.at>=i.ids.length)){if(!this.hasKey(i.key)){n=!0;continue}for(;i.at<i.ids.length&&e>0;)this.emit(t,i.ids[i.at++]),e--;if(i.at<i.ids.length&&(n=!0),e<=0)break}if(n||(t.done=!0),t.dirty&&this.upload(t),e<=0)return}}emit(e,t){let n=t*12,i=e.vUsed,s=e.water?this.waterLevel(e,e.polyOf[t]):0;for(let a=0;a<4;a++){let o=e.corn[n+a*3],c=e.corn[n+a*3+1],l=e.corn[n+a*3+2],u=e.water?s:this.hAt(o,c)+l,d=(i+a)*3;if(e.pos[d]=o,e.pos[d+1]=Number.isFinite(u)?u:0,e.pos[d+2]=c,e.water)e.nor[d]=0,e.nor[d+1]=1,e.nor[d+2]=0;else{let p=this.hAt(o+4,c)-this.hAt(o-4,c),m=this.hAt(o,c+4)-this.hAt(o,c-4),g=Math.hypot(p,8,m)||1;e.nor[d]=-p/g,e.nor[d+1]=8/g,e.nor[d+2]=-m/g}}let r=e.iUsed;e.idx[r]=i,e.idx[r+1]=i+1,e.idx[r+2]=i+2,e.idx[r+3]=i+2,e.idx[r+4]=i+1,e.idx[r+5]=i+3,e.vUsed+=4,e.iUsed+=6,e.dirty=!0}waterLevel(e,t){let n=e.waterY.get(t);if(n!==void 0)return n;let i=e.polys[t],s=Ql(i.o),r=[];for(let o=s.x0;o<=s.x1;o+=8)for(let c=s.z0;c<=s.z1;c+=8){let l=this.hAt(o,c);Number.isFinite(l)&&r.push(l)}r.sort((o,c)=>o-c);let a=(r[Math.floor(r.length*.25)]??0)+.1;return e.waterY.set(t,a),a}upload(e){let t=e.mesh.geometry,n=t.getAttribute("position"),i=t.getAttribute("normal"),s=t.getIndex();n.clearUpdateRanges(),i.clearUpdateRanges(),s.clearUpdateRanges(),n.addUpdateRange(e.upV*3,(e.vUsed-e.upV)*3),i.addUpdateRange(e.upV*3,(e.vUsed-e.upV)*3),s.addUpdateRange(e.upI,e.iUsed-e.upI),n.needsUpdate=!0,i.needsUpdate=!0,s.needsUpdate=!0,t.setDrawRange(0,e.iUsed),t.computeBoundingSphere(),e.upV=e.vUsed,e.upI=e.iUsed,e.dirty=!1,this.warm===0&&(e.mesh.frustumCulled=!0)}bowl(e,t,n){let i=en(e.o),s=4;for(let c of e.o)s=Math.max(s,Math.hypot(c[0]-i[0],c[1]-i[1]));let r=Math.min(1,Math.hypot(t-i[0],n-i[1])/s),a=this.low?.3:.22,o=this.low?.52:.42;return a+r*r*(o-a)}prepClub(){let e=this.data;if(!e.club.length){this.clubDone=!0;return}let t=en(e.club[0]);this.clubX=t[0],this.clubZ=t[1];let n=9e3,i=27e3,s=new Float32Array(n*3),r=new Float32Array(n*3),a=new Uint32Array(i),o=e.anchor[0],c=e.anchor[1];for(let d=0;d<3;d++)s[d*3]=o+(d===1?.4:0),s[d*3+1]=-40,s[d*3+2]=c+(d===2?.4:0),r[d*3]=r[d*3+1]=r[d*3+2]=1;a[0]=0,a[1]=1,a[2]=2;let l=new K;l.setAttribute("position",new H(s,3)),l.setAttribute("color",new H(r,3)),l.setIndex(new H(a,1)),l.setDrawRange(0,3),l.computeBoundingSphere();let u=new q(l,this.mats.club);u.name="aw:tds:club",u.castShadow=!this.low,u.receiveShadow=!0,u.matrixAutoUpdate=!1,u.frustumCulled=!1,this.group.add(u),this.clubMesh=u,this.clubPos=s,this.clubCol=r,this.clubIdx=a}fillClub(){if(this.clubDone||!this.clubMesh||!this.hasH(this.clubX,this.clubZ))return;let e={pos:[],col:[],idx:[]},t=this.data;for(let o of t.club)this.extrude(e,o,o===t.club[0]?5.4:3.6);if(this.tower(e,t.club[0]),t.pool.length>3&&this.pool(e,t.pool),e.pos.length/3+3>this.clubPos.length/3){this.clubDone=!0;return}for(let o=0;o<e.pos.length;o++)this.clubPos[9+o]=e.pos[o];for(let o=0;o<e.col.length;o++)this.clubCol[9+o]=e.col[o];for(let o=0;o<e.idx.length;o++)this.clubIdx[3+o]=e.idx[o]+3;let i=this.clubMesh.geometry,s=i.getAttribute("position"),r=i.getAttribute("color"),a=i.getIndex();s.needsUpdate=!0,r.needsUpdate=!0,a.needsUpdate=!0,i.setDrawRange(0,3+e.idx.length),i.computeVertexNormals(),i.computeBoundingSphere(),this.clubDone=!0}v3(e,t,n,i,s){e.pos.push(t,n,i);let[r,a,o]=ab(s);return e.col.push(r,a,o),e.pos.length/3-1}extrude(e,t,n){let i=Ps(t);if(i.length<3)return;let s=i.map(([p,m])=>this.hAt(p,m)).filter(p=>Number.isFinite(p));if(!s.length)return;let r=Math.min(...s)-.25,a=Math.max(...s)+n,o=en(i),c=a+(n>4?2.1:1.1),l=lf(i)>0;for(let p=0;p<i.length;p++){let m=i[p],g=i[(p+1)%i.length],b=this.v3(e,m[0],r,m[1],Z.wall),_=this.v3(e,g[0],r,g[1],Z.wall),v=this.v3(e,g[0],a,g[1],Z.wall),x=this.v3(e,m[0],a,m[1],Z.wall);e.idx.push(b,_,v,b,v,x);let y=Math.hypot(g[0]-m[0],g[1]-m[1]);if(y<3.2)continue;let w=(g[0]-m[0])/y,E=(g[1]-m[1])/y,M=l?E:-E,S=l?-w:w,T=this.v3(e,m[0]+M*.22,a-.55,m[1]+S*.22,Z.roof),I=this.v3(e,g[0]+M*.22,a-.55,g[1]+S*.22,Z.roof),R=this.v3(e,g[0]+M*.22,a+.08,g[1]+S*.22,Z.roof),B=this.v3(e,m[0]+M*.22,a+.08,m[1]+S*.22,Z.roof);e.idx.push(T,I,R,T,R,B);let F=Math.max(1,Math.floor(y/4.6)),L=Math.min(1.35,y/(F+.6)*.42);for(let N=0;N<F;N++){let z=(N+.5)/F,G=m[0]+(g[0]-m[0])*z,V=m[1]+(g[1]-m[1])*z,W=a-2.35,O=n>4?1.45:1.15,Q=[this.v3(e,G-w*L+M*.16,W,V-E*L+S*.16,Z.glass),this.v3(e,G+w*L+M*.16,W,V+E*L+S*.16,Z.glass),this.v3(e,G+w*L+M*.16,W+O,V+E*L+S*.16,Z.glass),this.v3(e,G-w*L+M*.16,W+O,V-E*L+S*.16,Z.glass)];e.idx.push(Q[0],Q[1],Q[2],Q[0],Q[2],Q[3])}}let u=rb(i),d=this.v3(e,o[0],c,o[1],Z.roof),f=[];for(let p of u){let m=p[0]-o[0],g=p[1]-o[1],b=Math.hypot(m,g)||1;f.push(this.v3(e,p[0]+m/b*.8,a+.06,p[1]+g/b*.8,Z.roof))}for(let p=0;p<f.length;p++)e.idx.push(d,f[p],f[(p+1)%f.length])}tower(e,t){let n=Ps(t);if(n.length<3)return;let i=en(n),s=n[0];for(let x of n)x[0]<s[0]&&(s=x);let r=s[0]*.35+i[0]*.65,a=s[1]*.35+i[1]*.65,o=this.hAt(r,a);if(!Number.isFinite(o))return;let c=o-.2,l=o+11.2,u=6.4,d=u/2,f=c,p=l,m=[[r-d,a-d],[r+d,a-d],[r+d,a+d],[r-d,a+d]];for(let x=0;x<4;x++){let y=m[x],w=m[(x+1)%4],E=this.v3(e,y[0],f,y[1],Z.wall),M=this.v3(e,w[0],f,w[1],Z.wall),S=this.v3(e,w[0],p,w[1],Z.wall),T=this.v3(e,y[0],p,y[1],Z.wall);e.idx.push(E,M,S,E,S,T)}let g=this.v3(e,r,p+2.6,a,Z.roof),b=d+.45,_=[[r-b,a-b],[r+b,a-b],[r+b,a+b],[r-b,a+b]].map(([x,y])=>this.v3(e,x,p,y,Z.roof));for(let x=0;x<4;x++)e.idx.push(g,_[x],_[(x+1)%4]);let v=[[r-d-.05,a,0,1],[r,a-d-.05,1,0]];for(let[x,y,w,E]of v){let S=p-3.4,T=p-.9,I=[this.v3(e,x-w*.55,S,y-E*.55,Z.glass),this.v3(e,x+w*.55,S,y+E*.55,Z.glass),this.v3(e,x+w*.55,T,y+E*.55,Z.glass),this.v3(e,x-w*.55,T,y-E*.55,Z.glass)];e.idx.push(I[0],I[1],I[2],I[0],I[2],I[3])}}pool(e,t){let n=Ps(t),i=n.map(([d,f])=>this.hAt(d,f)).filter(d=>Number.isFinite(d));if(!i.length)return;let s=Math.min(...i)+.14,r=Math.min(...i)+.22,a=lf(n)>0?1:-1,o=[],c=n.length;for(let d=0;d<c;d++){let f=n[(d+c-1)%c],p=n[d],m=n[(d+1)%c],g=p[0]-f[0],b=p[1]-f[1],_=m[0]-p[0],v=m[1]-p[1],x=Math.hypot(g,b)||1,y=Math.hypot(_,v)||1,w=b/x+v/y,E=-g/x+-v/y,M=Math.hypot(w,E)||1;w=w/M*4.6*a,E=E/M*4.6*a,o.push([p[0]+w,p[1]+E])}let l=(d,f,p)=>{let m=en(d),g=this.v3(e,m[0],f,m[1],p);for(let b=0;b<d.length;b++){let _=d[b],v=d[(b+1)%d.length];e.idx.push(g,this.v3(e,_[0],f,_[1],p),this.v3(e,v[0],f,v[1],p))}};for(let d=0;d<c;d++){let f=n[d],p=n[(d+1)%c],m=o[d],g=o[(d+1)%c],b=[this.v3(e,f[0],r,f[1],Z.deck),this.v3(e,p[0],r,p[1],Z.deck),this.v3(e,g[0],r,g[1],Z.deck),this.v3(e,m[0],r,m[1],Z.deck)];e.idx.push(b[0],b[1],b[2],b[0],b[2],b[3])}l(n,s,Z.water);let u=Math.max(1,Math.floor(c/8));for(let d=0,f=0;d<c&&f<8;d+=u,f++){let p=n[d][0]*.42+o[d][0]*.58,m=n[d][1]*.42+o[d][1]*.58,g=r+.2,b=.35,_=.9,v=.09,x=this.v3(e,p-b,g,m-_,Z.cloth),y=this.v3(e,p+b,g,m-_,Z.cloth),w=this.v3(e,p+b,g+v,m+_,Z.cloth),E=this.v3(e,p-b,g+v,m+_,Z.cloth);e.idx.push(x,y,w,x,w,E)}for(let d of[0,Math.floor(c/2)]){let f=o[d][0],p=o[d][1],m=n[d][0],g=n[d][1],b=f-m,_=p-g,v=Math.hypot(b,_)||1;b/=v,_/=v;let x=m*.35+f*.65,y=g*.35+p*.65,w=-_,E=b,M=1.35,S=1.05,T=r+2.2,I=[[-M,-S],[M,-S],[M,S],[-M,S]];for(let[F,L]of I){let N=x+w*F+b*L,z=y+E*F+_*L,G=[this.v3(e,N-.05,r,z-.05,Z.wall),this.v3(e,N+.05,r,z-.05,Z.wall),this.v3(e,N+.05,T,z+.05,Z.wall),this.v3(e,N-.05,T,z+.05,Z.wall)];e.idx.push(G[0],G[1],G[2],G[0],G[2],G[3])}let R=T+.04,B=I.map(([F,L])=>this.v3(e,x+w*F*1.15+b*L*1.15,R,y+E*F*1.15+_*L*1.15,Z.cloth));e.idx.push(B[0],B[1],B[2],B[0],B[2],B[3])}}scatter(){let e=this.data,t=(s,r,a,o,c,l=0)=>{if(a!=="palm"&&this.onTurf(s,r))return;this.spots.push({x:s,z:r,sc:o,yaw:c,kind:a,lean:l});let u=Math.floor(s/Qe)+","+Math.floor(r/Qe);this.mask.add(u)};for(let s of e.palms){let r=1.9+Math.abs(Math.sin(s[0]*.17+s[1]))*.7;t(s[0],s[1],"palm",r,s[0]*.3,-.2)}if(e.club.length){let s=en(e.club[0]);for(let r=0;r<12;r++){let a=r/12*Math.PI*2+.35,o=36+r%3*5,c=s[0]+Math.cos(a)*o,l=s[1]+Math.sin(a)*o*.82;e.club.some(u=>Ja(u,c,l))||e.pool.length>3&&Ja(e.pool,c,l)||t(c,l,"palm",2.05+r%4*.15,c*.2,-.18-r%4*.04)}}let n=0,i=0;for(let s of e.fairways){let r=Ps(s.o),a=en(s.o);for(let o=0;o<r.length&&n<42;o+=4){let c=r[o],l=c[0]-a[0],u=c[1]-a[1],d=Math.hypot(l,u)||1;l/=d,u/=d;let f=16+o*13%18,p=c[0]+l*f,m=c[1]+u*f;o%12===0&&i<28?(t(p,m,"rock",.7+o%5*.18,o*.4),i++):(t(p,m,"cactus",.85+o%4*.22,o*.7),n++)}}}onTurf(e,t){let n=this.data;for(let i of n.fairways)if(Vn(i,e,t))return!0;for(let i of n.greens)if(Vn(i,e,t))return!0;for(let i of n.tees)if(Vn(i,e,t))return!0;for(let i of n.bunkers)if(Vn(i,e,t))return!0;for(let i of n.water)if(Vn(i,e,t))return!0;return!1}buildRoutes(){let e=this.data,t=[];for(let i of e.paths){if(i.length<2)continue;let s=[i[0][0]],r=[i[0][1]],a=[0],o=0;for(let c=1;c<i.length;c++)o+=Math.hypot(i[c][0]-i[c-1][0],i[c][1]-i[c-1][1]),s.push(i[c][0]),r.push(i[c][1]),a.push(o);o>80&&t.push({x:Float32Array.from(s),z:Float32Array.from(r),cum:Float32Array.from(a),len:o})}t.sort((i,s)=>s.len-i.len),this.routes=t.slice(0,4),this.carts=this.routes.map((i,s)=>({route:s,dist:(s+.5)/this.routes.length*i.len,speed:4.2+s*.35}));let n=e.tees.slice(0,3).map(i=>en(i.o));this.golfers=n.map((i,s)=>({walk:!1,route:0,dist:0,speed:0,x:i[0],z:i[1],yaw:.6*s,phase:s}));for(let i=0;i<Math.min(2,this.routes.length);i++)this.golfers.push({walk:!0,route:i,dist:this.routes[i].len*(.2+i*.3),speed:1.25,x:0,z:0,yaw:0,phase:i+1.7})}placeStatic(){let e=this.data;for(;this.flagN<e.flags.length;){let r=e.flags[this.flagN];if(!this.hasH(r[0],r[1]))break;let a=this.hAt(r[0],r[1])+.28;this.setInst(this.poles,this.flagN,r[0],a,r[1],0,1),this.setInst(this.flags,this.flagN,r[0],a,r[1],0,1),this.flags.setColorAt(this.flagN,new D([13773611,15913530,2781147,16250871,14711343][this.flagN%5])),this.flagAt.push([r[0],r[1]]),this.flagN++}this.flagN&&(this.poles.count=this.flagN,this.flags.count=this.flagN,this.poles.instanceMatrix.needsUpdate=!0,this.flags.instanceMatrix.needsUpdate=!0,this.flags.instanceColor&&(this.flags.instanceColor.needsUpdate=!0));let t=!1;for(;this.spotN<this.spots.length;){let r=this.spots[this.spotN];if(!this.hasH(r.x,r.z))break;let a=this.kindSlot(this.spotN),o=this.hAt(r.x,r.z);r.kind==="palm"&&a<40?this.setInst(this.palms,a,r.x,o,r.z,r.yaw,r.sc,r.lean):r.kind==="cactus"&&a<48?this.setInst(this.cacti,a,r.x,o,r.z,r.yaw,r.sc):r.kind==="rock"&&a<32&&this.setInst(this.rocks,a,r.x,o,r.z,r.yaw,r.sc),this.spotN++,t=!0}if(!t)return;let n=0,i=0,s=0;for(let r=0;r<this.spotN;r++){let a=this.spots[r];a.kind==="palm"?n++:a.kind==="cactus"?i++:s++}this.palms.count=n,this.cacti.count=i,this.rocks.count=s,this.palms.instanceMatrix.needsUpdate=!0,this.cacti.instanceMatrix.needsUpdate=!0,this.rocks.instanceMatrix.needsUpdate=!0,this.cacti.instanceColor&&(this.cacti.instanceColor.needsUpdate=!0),this.rocks.instanceColor&&(this.rocks.instanceColor.needsUpdate=!0)}cullProps(e,t,n){for(let o=0;o<this.flagN;o++){let c=this.flagAt[o],l=(e-c[0])**2+(n-c[1])**2<49e4&&t<420?1:0;this.setInst(this.poles,o,c[0],this.hAt(c[0],c[1])+.28,c[1],0,l),this.setInst(this.flags,o,c[0],this.hAt(c[0],c[1])+.28,c[1],0,l)}this.flagN&&(this.poles.instanceMatrix.needsUpdate=!0,this.flags.instanceMatrix.needsUpdate=!0);let s=0,r=0,a=0;for(let o=0;o<this.spotN;o++){let c=this.spots[o],l=(e-c.x)**2+(n-c.z)**2<(c.kind==="palm"?800:650)**2&&t<480?c.sc:0,u=c.kind==="palm"?this.palms:c.kind==="cactus"?this.cacti:this.rocks,d=c.kind==="palm"?s++:c.kind==="cactus"?r++:a++;this.setInst(u,d,c.x,this.hAt(c.x,c.z),c.z,c.yaw,l,c.lean)}s&&(this.palms.instanceMatrix.needsUpdate=!0),r&&(this.cacti.instanceMatrix.needsUpdate=!0),a&&(this.rocks.instanceMatrix.needsUpdate=!0)}hideActors(){this.actorsOn=!1;for(let e of[this.cartBody,this.cartRoof,this.cartWheel,this.gHead,this.gTorso,this.gLegs,this.gArms,this.gClub])e.count=0}animate(e,t,n,i){let s=(o,c)=>(t-o)**2+(i-c)**2<562500&&n<420,r=0;for(let o of this.carts){let c=this.routes[o.route];if(!c)continue;o.dist=(o.dist+o.speed*e)%c.len;let l=this.sample(c,o.dist);if(!this.hasH(l.x,l.z)||!s(l.x,l.z))continue;let u=this.hAt(l.x,l.z);this.setInst(this.cartBody,r,l.x,u,l.z,l.yaw,1),this.setInst(this.cartRoof,r,l.x,u,l.z,l.yaw,1);let d=[[.74,.32,.78],[-.74,.32,.78],[.74,.32,-.78],[-.74,.32,-.78]];this.q.setFromAxisAngle(this.up,l.yaw);for(let f=0;f<4;f++)this.v.set(d[f][0],d[f][1],d[f][2]).applyQuaternion(this.q),this.setInst(this.cartWheel,r*4+f,l.x+this.v.x,u+this.v.y,l.z+this.v.z,l.yaw,1);r++}this.cartBody.count=r,this.cartRoof.count=r,this.cartWheel.count=r*4,this.cartBody.instanceMatrix.needsUpdate=!0,this.cartRoof.instanceMatrix.needsUpdate=!0,this.cartWheel.instanceMatrix.needsUpdate=!0;let a=0;for(let o of this.golfers){let c=o.x,l=o.z,u=o.yaw;if(o.walk){let m=this.routes[o.route];o.dist=(o.dist+o.speed*e)%m.len;let g=this.sample(m,o.dist),b=1.8;c=g.x+Math.cos(g.yaw)*b,l=g.z-Math.sin(g.yaw)*b,u=g.yaw}if(!this.hasH(c,l)||!s(c,l))continue;let d=o.walk?Math.sin(this.t*7+o.phase)*.04:Math.sin(this.t*1.5+o.phase)*.015,f=this.hAt(c,l)+d,p=Math.sin(this.t*(o.walk?7:1.2)+o.phase)*(o.walk?.45:.12);this.setInst(this.gHead,a,c,f,l,u,1),this.setInst(this.gTorso,a,c,f,l,u,1),this.setInst(this.gClub,a,c,f,l,u,1),this.gHead.setColorAt(a,new D(Ti[a%Ti.length])),this.gTorso.setColorAt(a,new D(cf[a%cf.length])),this.poseLimb(this.gLegs,a*2,c,f+.72,l,u,-.12,p),this.poseLimb(this.gLegs,a*2+1,c,f+.72,l,u,.12,-p),this.poseLimb(this.gArms,a*2,c,f+1.28,l,u,-.24,-p*.85),this.poseLimb(this.gArms,a*2+1,c,f+1.28,l,u,.24,p*.85),this.gLegs.setColorAt(a*2,new D(Xa[a%Xa.length])),this.gLegs.setColorAt(a*2+1,new D(Xa[a%Xa.length])),this.gArms.setColorAt(a*2,new D(Ti[a%Ti.length])),this.gArms.setColorAt(a*2+1,new D(Ti[a%Ti.length])),a++}this.gHead.count=a,this.gTorso.count=a,this.gClub.count=a,this.gLegs.count=a*2,this.gArms.count=a*2;for(let o of[this.gHead,this.gTorso,this.gLegs,this.gArms,this.gClub])o.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0);this.actorsOn=!0}poseLimb(e,t,n,i,s,r,a,o){this.q.setFromAxisAngle(this.up,r),this.leanQ.setFromAxisAngle(this.axisX,o),this.q.multiply(this.leanQ),this.scale.set(1,1,1),this.m.compose(this.v.set(n+Math.cos(r)*a,i,s-Math.sin(r)*a),this.q,this.scale),e.setMatrixAt(t,this.m)}kindSlot(e){let t=this.spots[e].kind,n=0;for(let i=0;i<e;i++)this.spots[i].kind===t&&n++;return n}sample(e,t){let n=(t%e.len+e.len)%e.len,i=1;for(;i<e.cum.length-1&&e.cum[i]<n;)i++;let s=e.cum[i-1],r=e.cum[i],a=r>s?(n-s)/(r-s):0,o=e.x[i-1]+(e.x[i]-e.x[i-1])*a,c=e.z[i-1]+(e.z[i]-e.z[i-1])*a,l=Math.atan2(e.x[i]-e.x[i-1],e.z[i]-e.z[i-1]);return{x:o,z:c,yaw:l}}fillMask(){let e=this.data,t=n=>{let i=Ql(n.o);for(let s=Math.floor(i.x0/Qe)*Qe;s<=i.x1;s+=Qe)for(let r=Math.floor(i.z0/Qe)*Qe;r<=i.z1;r+=Qe)Vn(n,s+Qe/2,r+Qe/2)&&this.mask.add(Math.floor(s/Qe)+","+Math.floor(r/Qe))};e.fairways.forEach(t),e.greens.forEach(t),e.tees.forEach(t),e.bunkers.forEach(t),e.water.forEach(t);for(let n of e.club)t({o:n});e.pool.length&&t({o:e.pool});for(let n of e.paths)for(let i=1;i<n.length;i++){let s=n[i-1][0],r=n[i-1][1],a=n[i][0],o=n[i][1],c=Math.hypot(a-s,o-r),l=Math.max(1,Math.ceil(c/4));for(let u=0;u<=l;u++){let d=s+(a-s)*u/l,f=r+(o-r)*u/l;this.mask.add(Math.floor(d/Qe)+","+Math.floor(f/Qe))}}}hideClubFootprints(){let e=this.world.hero;if(!(!e||!this.data))for(let t of this.data.club)e.polys.push(t),e.pts.push(en(t))}hasH(e,t){return this.hasKey(this.regKey(e,t))}hasKey(e){let t=this.world.regions.get(e);return!!(t&&t.H)}regKey(e,t){let n=this.world.M;return Math.floor((e-n.X0)/n.RS)+","+Math.floor((t-n.Z0)/n.RS)}setInst(e,t,n,i,s,r,a,o=0){this.v.set(n,i,s),this.q.setFromAxisAngle(this.up,r),o&&(this.leanQ.setFromAxisAngle(this.west,-o),this.q.premultiply(this.leanQ)),this.scale.set(a,a,a),this.m.compose(this.v,this.q,this.scale),e.setMatrixAt(t,this.m)}blank(e,t,n){let i=new me(e,t,n);return i.count=0,i.frustumCulled=!1,i.castShadow=!1,i.receiveShadow=!0,i.name="aw:tds:inst",this.group.add(i),i}poleGeo(){let e=new Ie(.035,.045,2.5,5);return e.translate(0,1.25,0),e}flagGeo(){let e=[0,2.5,0,-1.15,2.18,0,-.95,2.58,.03,0,2.5,0,-.95,2.58,-.03,-1.15,2.18,0],t=new K;return t.setAttribute("position",new j(e,3)),t.computeVertexNormals(),t}palmGeo(){let e=[],t=new Ie(.16,.28,5.4,5);t.translate(0,2.7,0),this.paint(t,7031340),e.push(t);for(let n=0;n<6;n++){let i=n/6*Math.PI*2,s=new le(.22,.05,2.3);s.translate(0,0,1.05),s.rotateX(.7),s.rotateY(i),s.translate(0,5.2,0),this.paint(s,n%2?2198074:1533484),e.push(s)}return this.mergeParts(e)}cactusGeo(){let e=[],t=new Ie(.18,.22,2.3,5);t.translate(0,1.15,0),this.paint(t,2914868),e.push(t);for(let n of[-1,1]){let i=new Ie(.1,.12,.7,4);i.translate(0,.35,0),i.rotateZ(n*1.15),i.translate(n*.42,1.35,0),this.paint(i,3443260),e.push(i)}return this.mergeParts(e)}rockGeo(){let e=new le(1.1,.55,.85);e.translate(0,.22,0);let t=e.attributes.position;for(let n=0;n<t.count;n++){let i=t.getY(n);t.setX(n,t.getX(n)*(.75+i)),t.setZ(n,t.getZ(n)*(.7+i*.8))}return this.paint(e,11773076),e.computeVertexNormals(),e}cartBodyGeo(){let e=new le(1.2,.38,2.2);e.translate(0,.58,0);let t=new le(1.05,.42,.55);return t.translate(0,.88,-.55),this.mergePos([e,t])}cartRoofGeo(){let e=new le(1.32,.07,1.9);e.translate(0,1.32,-.02);let t=[e];for(let[n,i]of[[.52,.7],[-.52,.7],[.52,-.72],[-.52,-.72]]){let s=new le(.06,.62,.06);s.translate(n,.98,i),t.push(s)}return this.mergePos(t)}wheelGeo(){let e=new Ie(.32,.32,.18,8);return e.rotateZ(Math.PI/2),e}clubGeo(){let e=new le(.035,.85,.035);return e.translate(0,.42,0),e.rotateX(.9),e.translate(.28,.95,.12),e}mergePos(e){let t=[],n=[];for(let s of e){let r=s.attributes.position.array,a=s.attributes.normal.array;for(let o=0;o<r.length;o++)t.push(r[o]),n.push(a[o]);s.dispose()}let i=new K;return i.setAttribute("position",new j(t,3)),i.setAttribute("normal",new j(n,3)),i}mergeParts(e){let t=[],n=[],i=[];for(let r of e){let a=r.attributes.position.array,o=r.attributes.color.array,c=r.attributes.normal.array;for(let l=0;l<a.length;l++)t.push(a[l]),i.push(c[l]);for(let l=0;l<o.length;l++)n.push(o[l]);r.dispose()}let s=new K;return s.setAttribute("position",new j(t,3)),s.setAttribute("normal",new j(i,3)),s.setAttribute("color",new j(n,3)),s}paint(e,t){let n=new D(t),i=e.attributes.position.count,s=new Float32Array(i*3);for(let r=0;r<i;r++)s[r*3]=n.r,s[r*3+1]=n.g,s[r*3+2]=n.b;e.setAttribute("color",new j(s,3))}};var Ya=class{constructor(e){A(this,"g",e);A(this,"mesh");A(this,"doc");A(this,"ys",[]);A(this,"grounded",!1);A(this,"k",0);A(this,"hidden",[]);A(this,"heroScan",!0);A(this,"tmp",new C);this.load().catch(t=>console.warn("[aw] sn murals",t))}async load(){let e=await fetch("./data/sn_murals.json");if(!e.ok)throw new Error("sn_murals.json "+e.status);let t=await e.json(),n=await new fn().loadAsync("./"+t.atlas);n.colorSpace=re,n.anisotropy=Math.min(4,this.g.renderer.capabilities.getMaxAnisotropy()),n.generateMipmaps=!0;let i=new oe({map:n,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),s=new q(this.geometry(t.murals,null),i);s.name="aw:sn-murals",s.frustumCulled=!1,s.castShadow=!1,s.receiveShadow=!1,s.visible=!1,s.renderOrder=2,this.doc=t,this.mesh=s,this.g.scene.add(s),this.tryGround()}subtract(e,t){let[n,i,s,r]=t,a=[];for(let[o,c,l,u]of e){if(l<=n||o>=s||u<=i||c>=r){a.push([o,c,l,u]);continue}let d=Math.max(c,i),f=Math.min(u,r);c<i&&a.push([o,c,l,i]),u>r&&a.push([o,r,l,u]),o<n&&a.push([o,d,n,f]),l>s&&a.push([s,d,l,f])}return a.filter(o=>o[2]-o[0]>.02&&o[3]-o[1]>.02)}geometry(e,t){let n=[],i=[],s=[];e.forEach((a,o)=>{let c=t?t[o]:0,l=a.base==="ground"?c+(a.lift??.05):c+Math.max(.06,(a.bld_h-a.height)*.5),[u,d]=a.p0,[f,p]=a.p1,m=a.height,g=Math.hypot(f-u,p-d)||1,b=[[0,0,g,m]];for(let w of a.holes||[])b=this.subtract(b,w);let[_,v,x,y]=a.uv;for(let[w,E,M,S]of b){let T=w/g,I=M/g,R=E/m,B=S/m,F=n.length/3;n.push(u+(f-u)*T,l+E,d+(p-d)*T,u+(f-u)*I,l+E,d+(p-d)*I,u+(f-u)*I,l+S,d+(p-d)*I,u+(f-u)*T,l+S,d+(p-d)*T),i.push(_+(x-_)*T,v+(y-v)*R,_+(x-_)*I,v+(y-v)*R,_+(x-_)*I,v+(y-v)*B,_+(x-_)*T,v+(y-v)*B),s.push(F,F+1,F+2,F,F+2,F+3)}});let r=new K;return r.setAttribute("position",new j(n,3)),r.setAttribute("uv",new j(i,2)),r.setIndex(s),r.computeVertexNormals(),r.computeBoundingSphere(),r}hAt(e,t){let i=this.g.real.heightAt?.(e,t);return typeof i=="number"?i:NaN}tryGround(){let e=this.doc,t=this.mesh;if(!e||!t)return;let n=[];for(let s of e.murals){let r=this.hAt(s.center[0],s.center[1]);if(!Number.isFinite(r))return;n.push(r)}if(this.grounded&&n.every((s,r)=>Math.abs(s-this.ys[r])<.05))return;let i=this.geometry(e.murals,n);t.geometry.dispose(),t.geometry=i,t.visible=!0,this.ys=n,this.grounded=!0}collectHeroes(){let e=this.doc;if(!e||!this.heroScan)return;let t=this.g.scene.getObjectByName("hero");if(!t)return;let n=new Set(this.hidden);for(let i of t.children)if(!n.has(i)){i.getWorldPosition(this.tmp);for(let s of e.hide_heroes)if(Math.hypot(this.tmp.x-s.x,this.tmp.z-s.z)<2.5){this.hidden.push(i),n.add(i);break}}this.hidden.length>=e.hide_heroes.length&&(this.heroScan=!1)}update(){if(this.mesh){((++this.k&31)===0||!this.grounded)&&this.tryGround(),(this.k&31)===0&&this.collectHeroes();for(let e of this.hidden)e.visible=!1}}};var hf=3200,Za=8,Wn=15986660,ob=15128516,Ns=12075820,cb=10238502,uf=12035214,gn=2373190,lb=14012614,hb=9341828;function df(h){return[(h>>16)/255,(h>>8&255)/255,(h&255)/255]}function zl(h){let e=h.slice();return e.length>1&&Math.hypot(e[0][0]-e[e.length-1][0],e[0][1]-e[e.length-1][1])<.2&&e.pop(),e}function ub(h){let e=0;for(let t=0;t<h.length;t++){let n=(t+1)%h.length;e+=h[t][0]*h[n][1]-h[n][0]*h[t][1]}return e*.5}function ff(h){let e=zl(h),t=0,n=0;for(let i of e)t+=i[0],n+=i[1];return[t/e.length,n/e.length]}function db(h){let e=zl(h).map(s=>[s[0],s[1]]);e.sort((s,r)=>s[0]-r[0]||s[1]-r[1]);let t=(s,r,a)=>(r[0]-s[0])*(a[1]-s[1])-(r[1]-s[1])*(a[0]-s[0]),n=[];for(let s of e){for(;n.length>=2&&t(n[n.length-2],n[n.length-1],s)<=0;)n.pop();n.push(s)}let i=[];for(let s=e.length-1;s>=0;s--){let r=e[s];for(;i.length>=2&&t(i[i.length-2],i[i.length-1],r)<=0;)i.pop();i.push(r)}return i.pop(),n.pop(),n.concat(i)}var $a=class{constructor(e){A(this,"g",e);A(this,"world");A(this,"hAt");A(this,"group",new ce);A(this,"data",null);A(this,"low");A(this,"mask",new Set);A(this,"villaMesh",null);A(this,"pos");A(this,"col");A(this,"nor");A(this,"idx");A(this,"vUsed",0);A(this,"iUsed",0);A(this,"upV",0);A(this,"upI",0);A(this,"vMax",0);A(this,"iMax",0);A(this,"jobs",[]);A(this,"gateDone",!1);A(this,"plantsDone",!1);A(this,"roadMesh",null);A(this,"roadCorn",null);A(this,"roadJobs",[]);A(this,"rPos");A(this,"rNor");A(this,"rIdx");A(this,"rv",0);A(this,"ri",0);A(this,"rUpV",0);A(this,"rUpI",0);A(this,"palms");A(this,"cacti");A(this,"m",new P);A(this,"q",new ae);A(this,"leanQ",new ae);A(this,"v",new C);A(this,"up",new C(0,1,0));A(this,"west",new C(0,0,1));A(this,"scale",new C);let t=e.real;this.world=t,this.hAt=(i,s)=>t.heightAt(i,s),this.low=e.real?.q.name==="low",this.group.name="aw:tds-resort",this.group.visible=!1,e.scene.add(this.group);let n=new oe({color:16777215,vertexColors:!0});this.palms=this.blank(this.palmGeo(),n,8),this.cacti=this.blank(this.cactusGeo(),n,8),this.installVeg(),this.load()}pending(){if(!this.data)return 1;let e=0;for(let t of this.jobs)t.at<t.ids.length&&this.hasKey(t.key)&&e++;return!this.gateDone&&this.hasH(this.data.gate.x,this.data.gate.z)&&e++,e}frame(){if(!this.data)return;this.pumpVillas(),this.fillGate(),this.placePlants();let e=this.g.camera.position,t=this.data.anchor[0],n=this.data.anchor[1],i=(e.x-t)**2+(e.z-n)**2<hf*hf;this.group.visible!==i&&(this.group.visible=i)}installVeg(){let e=window,t=e.__awVegHit,n=this.mask;e.__awVegHit=(i,s,r)=>n.has(Math.floor(i/Za)+","+Math.floor(s/Za))?!0:t?t(i,s,r):!1}async load(){try{let e=await fetch("./data/real/tds_resort.json",{cache:"force-cache"});if(!e.ok)return;this.data=await e.json()}catch{return}this.prepVillas(),this.hideFootprints(),this.fillMask(),this.world.vegDirty=!0,this.bakeGpu()}prepVillas(){let e=this.data;this.vMax=e.villas.length*84+1400,this.iMax=e.villas.length*140+2800,this.pos=new Float32Array(this.vMax*3),this.col=new Float32Array(this.vMax*3),this.nor=new Float32Array(this.vMax*3),this.idx=new Uint32Array(this.iMax);let t=e.anchor[0],n=e.anchor[1];this.put(t,-40,n,Wn,0,1,0),this.put(t+.4,-40,n,Wn,0,1,0),this.put(t,-40,n+.4,Wn,0,1,0),this.idx[0]=0,this.idx[1]=1,this.idx[2]=2,this.iUsed=3;let i=new Map;e.villas.forEach((a,o)=>{let c=this.regKey(a.h[0],a.h[1]),l=i.get(c);l?l.push(o):i.set(c,[o])});for(let[a,o]of i)this.jobs.push({key:a,ids:o,at:0});let s=new K;s.setAttribute("position",new H(this.pos,3)),s.setAttribute("color",new H(this.col,3)),s.setAttribute("normal",new H(this.nor,3)),s.setIndex(new H(this.idx,1)),s.setDrawRange(0,3),s.computeBoundingSphere();let r=new q(s,new oe({color:16777215,vertexColors:!0,side:We}));r.name="aw:tds:villas",r.frustumCulled=!1,r.matrixAutoUpdate=!1,r.castShadow=!this.low,r.receiveShadow=!0,this.group.add(r),this.villaMesh=r}prepRoads(){let e=[],t=[];for(let d of this.data.roads){let f=this.samples(d.p,7),p=d.w*.5;for(let m=1;m<f.length;m++){let g=f[m-1][0],b=f[m-1][1],_=f[m][0],v=f[m][1],x=Math.hypot(_-g,v-b)||1,y=-(v-b)/x*p,w=(_-g)/x*p;e.push(g+y,b+w,g-y,b-w,_+y,v+w,_-y,v-w),t.push(e.length/8-1)}}let i=t.length;this.roadCorn=new Float32Array(Math.max(1,i)*8),i&&this.roadCorn.set(e);let s=new Map;for(let d=0;d<i;d++){let f=d*8,p=this.regKey((e[f]+e[f+4])/2,(e[f+1]+e[f+5])/2),m=s.get(p);m?m.push(d):s.set(p,[d])}for(let[d,f]of s)this.roadJobs.push({key:d,ids:f,at:0});let r=Math.max(4,i*4+4);this.rPos=new Float32Array(r*3),this.rNor=new Float32Array(r*3),this.rIdx=new Uint32Array(Math.max(6,i*6+6));let a=this.data.anchor[0],o=this.data.anchor[1];this.rPos[0]=a,this.rPos[1]=-40,this.rPos[2]=o,this.rPos[3]=a+.4,this.rPos[4]=-40,this.rPos[5]=o,this.rPos[6]=a,this.rPos[7]=-40,this.rPos[8]=o+.4,this.rNor[1]=1,this.rNor[4]=1,this.rNor[7]=1,this.rIdx[0]=0,this.rIdx[1]=1,this.rIdx[2]=2,this.rv=3,this.ri=3;let c=new K;c.setAttribute("position",new H(this.rPos,3)),c.setAttribute("normal",new H(this.rNor,3)),c.setIndex(new H(this.rIdx,1)),c.setDrawRange(0,3),c.computeBoundingSphere();let l=new oe({color:hb,side:We});l.polygonOffset=!0,l.polygonOffsetFactor=-2,l.polygonOffsetUnits=-4;let u=new q(c,l);u.name="aw:tds:roads",u.frustumCulled=!1,u.matrixAutoUpdate=!1,u.receiveShadow=!0,this.group.add(u),this.roadMesh=u}samples(e,t){let n=[[e[0][0],e[0][1]]],i=0;for(let a=1;a<e.length;a++){let o=e[a-1][0],c=e[a-1][1],l=e[a][0],u=e[a][1],d=Math.hypot(l-o,u-c);if(d<.05)continue;let f=0;for(;i+(1-f)*d>=t;){let p=t-i;f+=p/d,n.push([o+(l-o)*f,c+(u-c)*f]),i=0}i+=(1-f)*d}let s=e[e.length-1],r=n[n.length-1];return Math.hypot(s[0]-r[0],s[1]-r[1])>2&&n.push([s[0],s[1]]),n}pumpVillas(){let e=this.low?4:10,t=e;for(let n of this.jobs)if(!(n.at>=n.ids.length||!this.hasKey(n.key))){for(;n.at<n.ids.length&&t>0;)this.emitVilla(n.ids[n.at++]),t--;if(t<=0)break}t<e&&this.uploadVillas()}emitVilla(e){let t=this.data.villas[e],n=zl(t.p);if(n.length<3)return;let i=n.length*12+16;if(this.vUsed+i>=this.vMax||this.iUsed+n.length*18+12>=this.iMax)return;let s=n.map(([y,w])=>this.hAt(y,w));if(s.some(y=>!Number.isFinite(y)))return;let r=Math.min(...s)-.2,a=t.s>1?6.05:3.15,o=Math.max(...s)+a,c=ff(n),l=o+(t.s>1?1.65:1.25),u=e%3===0?ob:Wn,d=e%5===0?cb:Ns,f=ub(n)>0,p=0,m=0;for(let y=0;y<n.length;y++){let w=n[y],E=n[(y+1)%n.length],M=E[0]-w[0],S=E[1]-w[1],T=Math.hypot(M,S)||1;T>m&&(m=T,p=y);let I=(f?S:-S)/T,R=(f?-M:M)/T,B=this.put(w[0],r,w[1],u,I,0,R),F=this.put(E[0],r,E[1],u,I,0,R),L=this.put(E[0],o,E[1],u,I,0,R),N=this.put(w[0],o,w[1],u,I,0,R);this.quad(B,N,L,F);let z=this.put(w[0]+I*.16,o-.02,w[1]+R*.16,d,I,0,R),G=this.put(E[0]+I*.16,o-.02,E[1]+R*.16,d,I,0,R),V=this.put(E[0]+I*.16,o+.24,E[1]+R*.16,d,I,0,R),W=this.put(w[0]+I*.16,o+.24,w[1]+R*.16,d,I,0,R);this.quad(z,W,V,G)}let g=n[p],b=n[(p+1)%n.length];if(m>3.5){let y=(b[0]-g[0])/m,w=(b[1]-g[1])/m,E=f?w:-w,M=f?-y:y,S=(g[0]+b[0])/2,T=(g[1]+b[1])/2,I=Math.min(1.15,m*.22),R=o-(t.s>1?3.3:1.7),B=t.s>1?1.35:1.05,F=[this.put(S-y*I+E*.14,R,T-w*I+M*.14,gn,E,0,M),this.put(S+y*I+E*.14,R,T+w*I+M*.14,gn,E,0,M),this.put(S+y*I+E*.14,R+B,T+w*I+M*.14,gn,E,0,M),this.put(S-y*I+E*.14,R+B,T-w*I+M*.14,gn,E,0,M)];this.quad(F[0],F[1],F[2],F[3])}let _=db(n),v=this.put(c[0],l,c[1],d,0,1,0),x=[];for(let y of _){let w=y[0]-c[0],E=y[1]-c[1],M=Math.hypot(w,E)||1;x.push(this.put(y[0]+w/M*.55,o+.05,y[1]+E/M*.55,d,0,1,0))}for(let y=0;y<x.length;y++)this.tri(v,x[y],x[(y+1)%x.length])}fillGate(){if(this.gateDone||!this.data)return;let e=this.data.gate;if(!this.hasH(e.x,e.z))return;if(this.vUsed+700>=this.vMax||this.iUsed+1400>=this.iMax){this.gateDone=!0;return}let t=(s,r)=>{let[a,o]=this.loc(s,r);return this.hAt(a,o)},n=(s,r)=>{for(let a=s;a<r-.2;a+=4.4){let o=a,c=Math.min(a+3.55,r);this.localBox(o,-.28,c,.28,0,1.45,Wn),this.localBox(o-.05,-.38,o+.62,.38,0,1.85,uf)}this.localBox(r-.58,-.32,r+.05,.32,0,1.62,uf)};n(-18,-2.7),n(2.7,18),this.localBox(3.4,2.3,6.3,4.9,0,2.7,Wn),this.hip(3.4,2.3,6.3,4.9,2.7,1.15);let i=t(4.85,2.3);if(Number.isFinite(i)){let[s,r]=this.loc(4.85,2.15);this.quad(this.put(s-.45,i+1.15,r,gn,-e.sx,0,-e.sz),this.put(s+.45,i+1.15,r,gn,-e.sx,0,-e.sz),this.put(s+.45,i+2.15,r,gn,-e.sx,0,-e.sz),this.put(s-.45,i+2.15,r,gn,-e.sx,0,-e.sz))}this.localBox(-9.2,-3.55,-2.4,-2.85,0,1.72,Wn),this.disc(-5.8,-3.55,1.05,.58);for(let s=0;s<4;s++){let r=-14+s*7;this.groundQuad(r,-4.2,r+7,-.55,lb,.1)}this.gateDone=!0,this.uploadVillas()}hip(e,t,n,i,s,r){let a=this.ground((e+n)/2,(t+i)/2);if(!Number.isFinite(a))return;let o=a+s,[c,l]=this.loc((e+n)/2,(t+i)/2),u=this.put(c,o+r,l,Ns,0,1,0),d=[[e,t],[n,t],[n,i],[e,i]].map(([f,p])=>{let[m,g]=this.loc(f,p);return this.put(m,o,g,Ns,0,1,0)});for(let f=0;f<4;f++)this.tri(u,d[f],d[(f+1)%4])}disc(e,t,n,i){let s=this.ground(e,t);if(!Number.isFinite(s))return;let r=this.data.gate,[a,o]=this.loc(e,t),c=s+n,l=this.put(a,c,o,Ns,-r.sx,0,-r.sz),u=[];for(let d=0;d<8;d++){let f=d/8*Math.PI*2,p=Math.cos(f)*i,m=Math.sin(f)*i,[g,b]=this.loc(e+p,t);u.push(this.put(g-r.sx*.06,c+m,b-r.sz*.06,Ns,-r.sx,0,-r.sz))}for(let d=0;d<8;d++)this.tri(l,u[d],u[(d+1)%8])}localBox(e,t,n,i,s,r,a){let o=this.ground((e+n)/2,(t+i)/2);if(!Number.isFinite(o))return;let c=o+s,l=o+r,d=[[e,t],[n,t],[n,i],[e,i]].map(([p,m])=>this.loc(p,m)),f=ff(d);for(let p=0;p<4;p++){let m=d[p],g=d[(p+1)%4],b=g[0]-m[0],_=g[1]-m[1],v=Math.hypot(b,_)||1,x=_/v,y=-b/v,w=(m[0]+g[0])/2,E=(m[1]+g[1])/2;(w-f[0])*x+(E-f[1])*y<0&&(x=-x,y=-y);let M=this.put(m[0],c,m[1],a,x,0,y),S=this.put(g[0],c,g[1],a,x,0,y),T=this.put(g[0],l,g[1],a,x,0,y),I=this.put(m[0],l,m[1],a,x,0,y);this.quad(M,S,T,I)}}groundQuad(e,t,n,i,s,r){let a=this.ground((e+n)/2,(t+i)/2),o=(Number.isFinite(a)?a:0)+r,l=[[e,t],[n,t],[e,i],[n,i]].map(([u,d])=>{let[f,p]=this.loc(u,d);return[f,o,p]}).map(([u,d,f])=>this.put(u,d,f,s,0,1,0));this.quad(l[0],l[1],l[3],l[2])}ground(e,t){let[n,i]=this.loc(e,t);return this.hAt(n,i)}loc(e,t){let n=this.data.gate;return[n.x+n.ax*e+n.sx*t,n.z+n.az*e+n.sz*t]}pumpRoads(){if(!this.roadCorn)return;let e=this.low?40:90,t=e;for(let n of this.roadJobs)if(!(n.at>=n.ids.length||!this.hasKey(n.key))){for(;n.at<n.ids.length&&t>0;)this.emitRoad(n.ids[n.at++]),t--;if(t<=0)break}t<e&&this.uploadRoads()}emitRoad(e){let t=e*8,n=this.roadCorn,i=.16,s=this.rv;for(let a=0;a<4;a++){let o=n[t+a*2],c=n[t+a*2+1],l=this.hAt(o,c),u=(s+a)*3;this.rPos[u]=o,this.rPos[u+1]=Number.isFinite(l)?l+i:0,this.rPos[u+2]=c;let d=4,f=this.hAt(o+d,c)-this.hAt(o-d,c),p=this.hAt(o,c+d)-this.hAt(o,c-d),m=Math.hypot(f,8,p)||1;this.rNor[u]=-f/m,this.rNor[u+1]=8/m,this.rNor[u+2]=-p/m}let r=this.ri;this.rIdx[r]=s,this.rIdx[r+1]=s+1,this.rIdx[r+2]=s+2,this.rIdx[r+3]=s+2,this.rIdx[r+4]=s+1,this.rIdx[r+5]=s+3,this.rv+=4,this.ri+=6}placePlants(){if(this.plantsDone||!this.data)return;let e=this.data.gate;if(!this.hasH(e.x,e.z))return;let t=0,n=0;for(let i of this.data.plants){let s=this.hAt(i.x,i.z);Number.isFinite(s)&&(i.k==="palm"&&t<8?this.setInst(this.palms,t++,i.x,s,i.z,i.yaw,i.s,-.22):i.k==="cactus"&&n<8&&this.setInst(this.cacti,n++,i.x,s,i.z,i.yaw,i.s,0))}this.palms.count=t,this.cacti.count=n,this.palms.instanceMatrix.needsUpdate=!0,this.cacti.instanceMatrix.needsUpdate=!0,this.plantsDone=!0}uploadVillas(){let e=this.villaMesh;if(!e)return;let t=e.geometry,n=t.getAttribute("position"),i=t.getAttribute("color"),s=t.getAttribute("normal"),r=t.getIndex();n.clearUpdateRanges(),i.clearUpdateRanges(),s.clearUpdateRanges(),r.clearUpdateRanges(),n.addUpdateRange(this.upV*3,(this.vUsed-this.upV)*3),i.addUpdateRange(this.upV*3,(this.vUsed-this.upV)*3),s.addUpdateRange(this.upV*3,(this.vUsed-this.upV)*3),r.addUpdateRange(this.upI,this.iUsed-this.upI),n.needsUpdate=!0,i.needsUpdate=!0,s.needsUpdate=!0,r.needsUpdate=!0,t.setDrawRange(0,this.iUsed),t.computeBoundingSphere(),this.upV=this.vUsed,this.upI=this.iUsed}uploadRoads(){let e=this.roadMesh;if(!e)return;let t=e.geometry,n=t.getAttribute("position"),i=t.getAttribute("normal"),s=t.getIndex();n.clearUpdateRanges(),i.clearUpdateRanges(),s.clearUpdateRanges(),n.addUpdateRange(this.rUpV*3,(this.rv-this.rUpV)*3),i.addUpdateRange(this.rUpV*3,(this.rv-this.rUpV)*3),s.addUpdateRange(this.rUpI,this.ri-this.rUpI),n.needsUpdate=!0,i.needsUpdate=!0,s.needsUpdate=!0,t.setDrawRange(0,this.ri),t.computeBoundingSphere(),this.rUpV=this.rv,this.rUpI=this.ri}put(e,t,n,i,s,r,a){let o=this.vUsed++,c=o*3;this.pos[c]=e,this.pos[c+1]=t,this.pos[c+2]=n;let[l,u,d]=df(i);return this.col[c]=l,this.col[c+1]=u,this.col[c+2]=d,this.nor[c]=s,this.nor[c+1]=r,this.nor[c+2]=a,o}tri(e,t,n){this.idx[this.iUsed++]=e,this.idx[this.iUsed++]=t,this.idx[this.iUsed++]=n}quad(e,t,n,i){this.tri(e,t,n),this.tri(e,n,i)}hideFootprints(){let e=this.world.hero;if(!(!e||!this.data))for(let t of this.data.villas){e.pts.push(t.h);let n=t.p[0][0]===t.p[t.p.length-1][0]&&t.p[0][1]===t.p[t.p.length-1][1]?t.p:t.p.concat([t.p[0]]);e.polys.push(n)}}fillMask(){let e=(n,i)=>this.mask.add(Math.floor(n/Za)+","+Math.floor(i/Za));for(let n of this.data.villas)for(let i of n.p)e(i[0],i[1]);for(let n of this.data.roads)for(let i of n.p)e(i[0],i[1]);for(let n of this.data.plants)e(n.x,n.z);let t=this.data.gate;for(let n=-18;n<=18;n+=6)for(let i=-4;i<=6;i+=4){let[s,r]=this.loc(n,i);e(s,r)}}hasH(e,t){return this.hasKey(this.regKey(e,t))}hasKey(e){let t=this.world.regions.get(e);return!!(t&&t.H)}regKey(e,t){let n=this.world.M;return Math.floor((e-n.X0)/n.RS)+","+Math.floor((t-n.Z0)/n.RS)}setInst(e,t,n,i,s,r,a,o){this.v.set(n,i,s),this.q.setFromAxisAngle(this.up,r),o&&(this.leanQ.setFromAxisAngle(this.west,-o),this.q.premultiply(this.leanQ)),this.scale.set(a,a,a),this.m.compose(this.v,this.q,this.scale),e.setMatrixAt(t,this.m)}blank(e,t,n){let i=new me(e,t,n);return i.count=0,i.frustumCulled=!1,i.castShadow=!1,i.receiveShadow=!0,i.name="aw:tds:resort-inst",this.group.add(i),i}paint(e,t){let n=df(t),i=new Float32Array(e.attributes.position.count*3);for(let s=0;s<e.attributes.position.count;s++)i[s*3]=n[0],i[s*3+1]=n[1],i[s*3+2]=n[2];e.setAttribute("color",new j(i,3))}palmGeo(){let e=[],t=new Ie(.16,.26,5.2,5);t.translate(0,2.6,0),this.paint(t,7031340),e.push(t);for(let n=0;n<6;n++){let i=n/6*Math.PI*2,s=new le(.18,.05,2.2);s.translate(0,0,1),s.rotateX(.65),s.rotateY(i),s.translate(0,5.05,0),this.paint(s,n%2?2198074:1533484),e.push(s)}return this.merge(e)}cactusGeo(){let e=new Ie(.16,.2,2.4,5);return e.translate(0,1.2,0),this.paint(e,3111482),e.computeVertexNormals(),e}merge(e){let t=[],n=[],i=[];for(let r of e){r.computeVertexNormals();let a=r.attributes.position.array,o=r.attributes.color.array,c=r.attributes.normal.array;for(let l=0;l<a.length;l++)t.push(a[l]),n.push(o[l]),i.push(c[l]);r.dispose()}let s=new K;return s.setAttribute("position",new j(t,3)),s.setAttribute("color",new j(n,3)),s.setAttribute("normal",new j(i,3)),s}bakeGpu(){let e=[this.palms,this.cacti],t=e.map(s=>s.count),n=this.data.anchor[0],i=this.data.anchor[1];for(let s of e)s.count===0&&(this.setInst(s,0,n,-80,i,0,1,0),s.count=1,s.instanceMatrix.needsUpdate=!0),s.frustumCulled=!1;this.group.visible=!0,this.group.traverse(s=>{s.frustumCulled=!1});try{this.g.renderer.render(this.group,this.g.camera)}catch{}e.forEach((s,r)=>{s.count=t[r]}),this.group.traverse(s=>{let r=s;r.isMesh&&(r.frustumCulled=!r.isInstancedMesh)}),this.group.visible=!1}};var eo=[{n:"NEAR",d:1,p:0},{n:"FAR",d:1.75,p:.14},{n:"LOW",d:.72,p:-.13}],to=class{constructor(){A(this,"i",0);A(this,"btn");A(this,"tip");A(this,"cd",1);A(this,"cp",0);this.btn=document.createElement("button"),this.btn.textContent="\u{1F3A5}",this.btn.title="Camera (C)",this.btn.className="aw-cam",this.btn.setAttribute("aria-label","Cycle chase camera"),this.btn.style.display="none",this.btn.addEventListener("click",t=>{t.preventDefault(),this.next()}),document.body.appendChild(this.btn),this.tip=document.createElement("div"),this.tip.className="aw-camtip",document.body.appendChild(this.tip);let e=document.createElement("style");e.textContent=".aw-cam{position:fixed;right:12px;top:170px;z-index:40;width:44px;height:44px;border-radius:12px;border:0;font:20px system-ui;background:#1e2a3ab0;color:#fff}.aw-camtip{position:fixed;right:62px;top:180px;z-index:40;font:800 12px system-ui;color:#fff;text-shadow:0 1px 3px #000;opacity:0;transition:opacity .4s;pointer-events:none}",document.head.appendChild(e),addEventListener("keydown",t=>{t.code==="KeyC"&&!(t.target instanceof HTMLInputElement)&&this.next()})}next(){this.i=(this.i+1)%eo.length,this.tip.textContent="CAM "+eo[this.i].n,this.tip.style.opacity="1",setTimeout(()=>this.tip.style.opacity="0",1200)}frame(e,t){let n=e==="car"||e==="moto";this.btn.style.display=n?"block":"none";let i=n?eo[this.i]:eo[0],s=Math.min(1,t*4);this.cd+=(i.d-this.cd)*s,this.cp+=(i.p-this.cp)*s;let r=window;r.__awCamD=this.cd,r.__awCamP=this.cp}};var Us=["off","1","2","3","4","5"],fb={off:"RADIO OFF",1:"Track 1",2:"Track 2",3:"Track 3",4:"Track 4",5:"Track 5"},pb=h=>`./audio/music/track${h}.mp3`,mb=.32,no=class{constructor(e){A(this,"g",e);A(this,"el");A(this,"nm");A(this,"a",null);A(this,"st","1");A(this,"shown",!1);A(this,"want",!1);A(this,"t",0);try{localStorage.removeItem("aw_radio");let o=localStorage.getItem("aw_radio2");o&&Us.includes(o)&&(this.st=o)}catch{}let t=document.createElement("style");t.textContent=`#awRadio{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 96px);transform:translate(-50%);z-index:30;display:none;align-items:center;gap:6px;
      background:#0b1220cc;border:2px solid #ffffff40;border-radius:14px;padding:4px 6px;color:#fff;font:700 13px system-ui,sans-serif;user-select:none;touch-action:none;box-shadow:0 4px 14px #0006}
      #awRadio.on{display:flex}body.touch #awRadio{top:auto;bottom:calc(env(safe-area-inset-bottom) + 172px)}body.touch #awRadio[data-mode=plane]{bottom:auto;top:calc(env(safe-area-inset-top) + var(--aw-radio-top,132px));left:12px;transform:none}#awRadio button{background:#ffffff1a;border:0;color:#fff;border-radius:9px;width:30px;height:30px;font-size:15px;font-weight:900}
      #awRadio .nm{min-width:110px;text-align:center;line-height:1.1}#awRadio .nm small{display:block;font-size:9px;letter-spacing:.18em;opacity:.65}
      #awRadio .nm b{display:block;font-size:14px;color:#ffd23f}#awRadio.off .nm b{color:#aab}`,document.head.appendChild(t),this.el=document.createElement("div"),this.el.id="awRadio";let n=document.createElement("button");n.textContent="\u25C0",n.setAttribute("aria-label","Previous station");let i=document.createElement("button");i.textContent="\u25B6",i.setAttribute("aria-label","Next station"),this.nm=document.createElement("div"),this.nm.className="nm",this.el.append(n,this.nm,i),document.body.appendChild(this.el);let s=o=>o.stopPropagation();for(let o of["pointerdown","touchstart","mousedown"])this.el.addEventListener(o,s);n.addEventListener("click",o=>{o.stopPropagation(),this.step(-1)}),i.addEventListener("click",o=>{o.stopPropagation(),this.step(1)});let r=-1;this.el.addEventListener("pointerdown",o=>{(o.target===this.el||this.nm.contains(o.target))&&(r=o.clientX,this.el.setPointerCapture(o.pointerId))}),this.el.addEventListener("pointerup",o=>{if(r<0)return;let c=o.clientX-r;r=-1,Math.abs(c)>25&&this.step(c<0?1:-1)}),this.el.addEventListener("pointercancel",()=>{r=-1}),addEventListener("keydown",o=>{!this.shown||o.target?.tagName==="INPUT"||(o.key===","?this.step(-1):o.key==="."&&this.step(1))});let a=()=>{this.want&&this.a&&this.a.paused&&this.a.play().catch(()=>{})};addEventListener("pointerdown",a,!0),addEventListener("keydown",a,!0),this.paint()}muted(){try{return localStorage.getItem("aw_muted")==="1"}catch{return!1}}step(e){let t=Us.indexOf(this.st);this.st=Us[(t+e+Us.length)%Us.length];try{localStorage.setItem("aw_radio2",this.st)}catch{}this.paint(),this.sync(!0)}paint(){this.nm.innerHTML=`<small>RADIO</small><b>${fb[this.st]}</b>`,this.el.classList.toggle("off",this.st==="off")}sync(e=!1){if(this.want=this.shown&&this.st!=="off"&&!this.muted(),!this.want){this.a&&!this.a.paused&&this.a.pause();return}let t=pb(this.st);this.a||(this.a=new Audio,this.a.loop=!0,this.a.preload="auto",this.a.volume=mb,window.__awRadio=this.a),(e||!this.a.src.endsWith(t.slice(1)))&&(this.a.src=t);let n=window.__awIntro;n&&!n.paused&&n.pause(),this.a.paused&&this.a.play().catch(()=>{})}update(){let t=this.g.S.mode;if(this.el.dataset.mode!==t&&(this.el.dataset.mode=t,t==="plane")){let n=document.getElementById("hud");if(n){let i=n.getBoundingClientRect();i.bottom>0&&this.el.style.setProperty("--aw-radio-top",Math.round(i.bottom+8)+"px")}}this.shown!==!0?(this.shown=!0,this.el.classList.toggle("on",!0),this.sync()):(this.t=(this.t+1)%30)===0&&this.sync()}};var pf="smoothstep(-500.0, 1200.0, dot(%P% - vec2(-8840.0, -10365.0), vec2(0.7373, -0.6756)))",Ab=`
  // aw sea: awW 0 leeward (Eagle/Palm Beach) .. 1 windward north coast
  vec2 awP = vWP.xz;
  float awW = ${pf.replace("%P%","awP")};
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
  float awSpec = (1.0 - 0.45 * smoothstep(150.0, 1500.0, camD) * smoothstep(4.0, 14.0, awD)) * mix(0.65, 1.0, smoothstep(0.5, 4.0, depth));`;function gb(h,e){vi(h,"sea-v1",t=>{let n=t.fragmentShader,i=n.indexOf("  // shoreline wash"),s="a = max(a, foam * 0.95);",r=n.indexOf(s),a="vec3 n1 = texture(wn, p / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;",o="vec3 n3 = texture(wn, p / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;",c="vec3 nW = normalize(vec3(g.x, 1.0, g.y));",l="float roughnessFactor = mix(0.04, 0.65, foam) + smoothstep(300.0, 4000.0, camD) * 0.08;",u="totalSpecular * smoothstep(0.0, 0.15, dd)";i<0||r<i||![a,o,c,l,u].every(d=>n.includes(d))||(t.fragmentShader=((e?`#define AW_SEA_HQ
`:"")+n.slice(0,i)+Ab+n.slice(r+s.length)).replace(a,"vec3 n1 = awN1;").replace(o,"vec3 n3 = awN3;").replace(c,"g = g * mix(1.0, 1.45, awW) + awSwell; "+c).replace(l,l.replace(";"," + 0.05 * awW;")).replace(u,u+" * awSpec"))})}function bb(h){vi(h,"sand-v1",e=>{let t=e.fragmentShader,n="const float SAT[8] = float[8](0.55, 0.8, 0.6, 0.9, 0.85, 0.6, 0.5, 0.6);",i="const float GAIN[8] = float[8](1.12, 1.0, 1.95, 1.0, 0.8, 1.25, 1.15, 1.15);",s=`  for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) rwLayer(i, wi, P, tc, tn, tar); }
  float wsum = 0.0; for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) wsum += wi; }`,r="tc = mix(tc, tc * vec3(0.78, 0.9, 0.88), smoothstep(-0.5, -3.0, vWP.y));",a="reflectedLight.indirectSpecular *= tAO;";[n,i,s,r,a].every(o=>t.includes(o))&&(e.fragmentShader=t.replace(n,"const float SAT[8] = float[8](0.55, 0.8, 0.5, 0.9, 0.85, 0.6, 0.5, 0.6);").replace(i,"const float GAIN[8] = float[8](1.12, 1.0, 2.5, 1.0, 0.8, 1.25, 1.15, 1.15);").replace(s,`  float awIT = 1.0 / max(tot, 1e-4), wsum = 0.0;
  for (int i = 0; i < 8; i++) { float wi = w[i] * awIT; if (wi > 0.02) { rwLayer(i, wi, P, tc, tn, tar); wsum += wi; } }`).replace(r,`float awW = ${pf.replace("%P%","P")}, awSub = smoothstep(-0.2, -2.5, vWP.y);
  tc *= mix(vec3(1.0), vec3(0.96, 0.9, 0.8), awW * w[2] * awIT * (1.0 - awSub));   // windward: coarser, golden coral sand
  tc *= exp(min(vWP.y, 0.0) * vec3(0.9, 0.16, 0.11)) * (1.0 - 0.3 * awW * awSub);   // seabed: red absorbed on the way down and up, darker reef windward
  // A's wet-sand gloss (roughness .28) also covered the seabed, which then mirrored the sky up through
  // the water (the white band off every beach): matte and no sky reflection below the waterline
  float awDry = smoothstep(-0.5, 0.05, vWP.y); tRough = mix(1.0, tRough, awDry);`).replace(a,"reflectedLight.indirectSpecular *= tAO * awDry;"))})}var io=class{constructor(e){A(this,"stats",{water:0,terrain:0,hq:!1});let t=e.real,n=U.get("seaq"),i=n?n!=="low":t.q.name!=="low";this.stats.hq=i;let s=o=>{o&&!o.userData["aw:sea-v1"]&&(gb(o,i),this.stats.water++)},r=o=>{o&&!o.userData["aw:sand-v1"]&&(bb(o),this.stats.terrain++)},a=(o,c)=>{if(!o||typeof o.material!="function")return;let l=o.material.bind(o);o.material=(...u)=>{let d=l(...u);return c(d),d}};a(t.water,s),a(t.terrain,r),r(t.ovMat);for(let o of t.group.children){let c=o.material;o.isMesh&&c&&!Array.isArray(c)&&/\|water/.test(c.customProgramCacheKey?c.customProgramCacheKey():"")&&s(c)}for(let o of t.regions.values())r(o.mat),s(o.wmat)}};var _b=`
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
}`;function mf(){let h=document.createElement("style");h.id="aw-hud",h.textContent=_b,document.head.appendChild(h)}var Hl="#1d5683",Af="#47524c",gf="#4c6444",bf="#262c31",xb="#1b2126",_f=["#aeb5b8","#c3c8ca","#eef0f0","#ffd34d","#ffd34d"],xf=[1.1,1.4,2.1,2.7,3.2],vb=[.45,.55,.9,1.3,1.6],yb=new Set(["store","mall","hotel","gas","attraction"]),wb=new Set(["mall","hotel","gas","attraction"]),so=class{constructor(e){A(this,"g",e);A(this,"stats",{tiles:0,tileMs:0,jobMaxMs:0,world:!1,labels:0,size:0});A(this,"canvas",document.getElementById("minimap"));A(this,"ctx",null);A(this,"css",0);A(this,"tile",document.createElement("canvas"));A(this,"tcx",0);A(this,"tcz",0);A(this,"tppm",0);A(this,"tileOk",!1);A(this,"tileQueued",!1);A(this,"want",{ppm:0,cssPerM:0});A(this,"world",document.createElement("canvas"));A(this,"wk",0);A(this,"wb",null);A(this,"data",null);A(this,"grid",null);A(this,"parkGrid",null);A(this,"stamp",null);A(this,"parkStamp",null);A(this,"gen",0);A(this,"jobs",[]);A(this,"idleOn",!1);A(this,"range",0);A(this,"placed",[]);A(this,"pick",[]);A(this,"rim",null);A(this,"rimW",0);this.tile.width=this.tile.height=1024,this.canvas&&(this.ctx=this.canvas.getContext("2d"),document.body.classList.add("awmm"),this.resize(),addEventListener("resize",()=>this.resize()),addEventListener("orientationchange",()=>setTimeout(()=>this.resize(),250)),window.__awMiniMap=(t,n,i,s,r,a,o,c)=>this.draw(t,n,i,s,r,a,o,c))}resize(){let e=this.canvas,t=e.parentElement;this.css=t.clientWidth||120;let n=Math.max(96,Math.min(300,Math.round(this.css*Math.min(3,devicePixelRatio||1))));e.width!==n&&(e.width=e.height=n,this.tileOk=!1),this.stats.size=n}idle(e,t=!1){t?this.jobs.unshift(e):this.jobs.push(e),this.kick()}kick(){if(this.idleOn||!this.jobs.length)return;this.idleOn=!0;let e=n=>{this.idleOn=!1;do{let i=performance.now();this.jobs.shift()(),this.stats.jobMaxMs=Math.max(this.stats.jobMaxMs,Math.round((performance.now()-i)*10)/10)}while(this.jobs.length&&n&&n.timeRemaining()>4);this.kick()},t=window.requestIdleCallback;t?t(e,{timeout:250}):setTimeout(e,16)}start(e,t){this.data=e,this.wb=t,this.idle(()=>{this.grid||this.index(e)});let n=Math.max(t.maxX-t.minX,t.maxZ-t.minZ),i=this.wk=1024/n,s=this.world;s.width=s.height=1024;let r=s.getContext("2d"),a=l=>(l-t.minX)*i,o=l=>(l-t.minZ)*i,c=l=>l.forEach(([u,d],f)=>f?r.lineTo(a(u),o(d)):r.moveTo(a(u),o(d)));this.idle(()=>{r.fillStyle=Hl,r.fillRect(0,0,1024,1024),r.fillStyle=Af,r.beginPath();for(let l of e.land)c(l.outer),r.closePath();r.fill(),r.fillStyle=gf,r.beginPath();for(let l of e.parks)c(l),r.closePath();r.fill(),r.lineCap=r.lineJoin="round",r.strokeStyle=bf,r.lineWidth=45*i,r.beginPath();for(let l of e.runways)c(l);r.stroke()});for(let l=0;l<=4;l++)this.idle(()=>{r.strokeStyle=_f[l],r.lineWidth=vb[l],r.beginPath();for(let u of e.roads)u.c===l&&c(u.p);r.stroke(),l===4&&(this.stats.world=!0)})}key(e,t){return e*65536+t}index(e){let t=new Map,n=new Map,i=(s,r,a)=>{let o=1/0,c=-1/0,l=1/0,u=-1/0;for(let[d,f]of r)d<o&&(o=d),d>c&&(c=d),f<l&&(l=f),f>u&&(u=f);for(let d=Math.floor(o/500);d<=Math.floor(c/500);d++)for(let f=Math.floor(l/500);f<=Math.floor(u/500);f++){let p=this.key(d,f),m=s.get(p);m||s.set(p,m=[]),m.push(a)}};e.roads.forEach((s,r)=>i(t,s.p,r)),e.parks.forEach((s,r)=>i(n,s,r)),this.grid=t,this.parkGrid=n,this.stamp=new Uint32Array(e.roads.length),this.parkStamp=new Uint32Array(e.parks.length)}query(e,t,n,i,s,r,a){a.length=0;for(let o=Math.floor(n/500);o<=Math.floor(s/500);o++)for(let c=Math.floor(i/500);c<=Math.floor(r/500);c++){let l=e.get(this.key(o,c));if(l)for(let u of l)t[u]!==this.gen&&(t[u]=this.gen,a.push(u))}return a}queueTile(e,t){if(this.want.ppm=e,this.want.cssPerM=t,this.tileQueued)return;this.tileQueued=!0;let n=()=>{if(!this.grid){this.index(this.data),this.idle(n,!0);return}this.tileQueued=!1;let i=this.g.S,s=i.mode==="walk"?i.walk:i.car;this.renderTile(s.x,s.z,this.want.ppm,this.want.cssPerM)};this.idle(n,!0)}renderTile(e,t,n,i){let s=performance.now(),r=this.data,a=this.tile.getContext("2d"),o=1024/2/n,c=e-o,l=e+o,u=t-o,d=t+o,f=x=>(x-e)*n+1024/2,p=x=>(x-t)*n+1024/2,m=x=>x.forEach(([y,w],E)=>E?a.lineTo(f(y),p(w)):a.moveTo(f(y),p(w)));a.fillStyle=Hl,a.fillRect(0,0,1024,1024),a.fillStyle=Af,a.beginPath();for(let x of r.land)m(x.outer),a.closePath();a.fill();let g=[];this.gen++,a.fillStyle=gf,a.beginPath();for(let x of this.query(this.parkGrid,this.parkStamp,c,u,l,d,g))m(r.parks[x]),a.closePath();a.fill(),a.lineCap=a.lineJoin="round",a.strokeStyle=bf,a.lineWidth=45*n,a.beginPath();for(let x of r.runways)m(x);a.stroke(),this.gen++;let b=this.query(this.grid,this.stamp,c,u,l,d,g),_=n/i,v=(x,y,w)=>{a.strokeStyle=w,a.lineWidth=y,a.beginPath();for(let E of b){let M=r.roads[E];M.c===x&&m(M.p)}a.stroke()};for(let x=2;x<=4;x++)v(x,(xf[x]+1.2)*_,xb);for(let x=0;x<=4;x++)v(x,xf[x]*_,_f[x]);this.tcx=e,this.tcz=t,this.tppm=n,this.tileOk=!0,this.stats.tiles++,this.stats.tileMs=Math.round((performance.now()-s)*10)/10}draw(e,t,n,i,s,r,a,o){let c=this.ctx;if(!c)return;this.data||this.start(o,r);let l=this.g.S,u=l.mode,f=u==="car"||u==="moto"?900+Math.min(45,Math.abs(l.car.s||0))*13:u==="walk"?480:i;this.range=!this.range||u==="plane"?f:this.range+(f-this.range)*.12;let p=this.range,m=this.canvas.width,g=m/this.css,b=m/p;c.save(),c.fillStyle=Hl,c.fillRect(0,0,m,m),c.translate(m/2,m/2),c.rotate(n);let _=!1;if(p<=2e3){let v=p<700?.75:.36,x=1024/2/v-p*.5-Math.max(Math.abs(e-this.tcx),Math.abs(t-this.tcz));_=this.tileOk&&this.tppm===v&&x>20,(!_||x<300)&&this.queueTile(v,b/g)}if(_){let v=p*this.tppm;c.drawImage(this.tile,(e-this.tcx)*this.tppm+1024/2-v/2,(t-this.tcz)*this.tppm+1024/2-v/2,v,v,-m/2,-m/2,m,m)}else{let v=this.stats.world,x=v?this.world:s.c,y=v?this.wk:s.k,w=p*y;c.drawImage(x,(e-r.minX)*y-w/2,(t-r.minZ)*y-w/2,w,w,-m/2,-m/2,m,m)}this.pois(c,e,t,n,b,g,m,a,p<=2e3),c.restore(),this.chrome(c,m,n,g)}pois(e,t,n,i,s,r,a,o,c){let l=a/2-4*r,u=l*l,d=this.pick;d.length=0,e.lineWidth=1.2*r,e.strokeStyle="#fff";for(let _ of o){let v=(_.x-t)*s,x=(_.z-n)*s,y=v*v+x*x;y>u||_.k.startsWith("m_")||(c&&wb.has(_.cat)&&(e.fillStyle=_.bg==="#ffffff"||_.bg==="#f4f1e6"?_.fg:_.bg,e.beginPath(),e.arc(v,x,2.4*r,0,6.2832),e.fill(),e.stroke()),yb.has(_.cat)&&_.sign&&d.push({b:_,d:_.cat==="store"?y:y*.3,x:v,y:x}))}d.sort((_,v)=>_.d-v.d);let f=this.placed;f.length=0,e.font=`800 ${Math.round(9.5*r)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.lineJoin="round";let p=Math.sin(i),m=Math.cos(i),g=0,b=0;for(let _ of d){if(g>=3||b>24)break;let v=_.x*m-_.y*p,x=_.x*p+_.y*m-9*r;if(Math.abs(v)<18*r&&Math.abs(x)<19*r)continue;b++;let y=_.b.sign.length>14?_.b.sign.slice(0,13)+"\u2026":_.b.sign,w=e.measureText(y).width+8*r,E=15*r;if(Math.hypot(Math.abs(v)+w/2,Math.abs(x)+E/2)>a/2-2*r)continue;let M=!1;for(let S=0;S<f.length;S+=4)if(Math.abs(v-f[S])*2<w+f[S+2]&&Math.abs(x-f[S+1])*2<E+f[S+3]){M=!0;break}M||Math.abs(v)<w/2+10*r&&Math.abs(x)<E/2+11*r||(f.push(v,x,w,E),e.save(),e.rotate(-i),e.lineWidth=3.2*r,e.strokeStyle="rgba(10,14,18,.85)",e.strokeText(y,v,x),e.fillStyle="#fff",e.fillText(y,v,x),e.restore(),g++)}this.stats.labels=g}chrome(e,t,n,i){let s=t/2;(!this.rim||this.rimW!==t)&&(this.rim=e.createRadialGradient(s,s,s*.72,s,s,s),this.rimW=t,this.rim.addColorStop(0,"rgba(0,0,0,0)"),this.rim.addColorStop(1,"rgba(0,0,0,.38)")),e.fillStyle=this.rim,e.fillRect(0,0,t,t),e.save(),e.translate(s,s),e.beginPath(),e.moveTo(0,-9*i),e.lineTo(7*i,7*i),e.lineTo(0,3.2*i),e.lineTo(-7*i,7*i),e.closePath(),e.lineJoin="round",e.lineWidth=3*i,e.strokeStyle="#11161b",e.stroke(),e.fillStyle="#fff",e.fill();let r=s-9*i,a=Math.sin(n)*r,o=-Math.cos(n)*r;e.beginPath(),e.arc(a,o,7.5*i,0,6.2832),e.fillStyle="#11161bdd",e.fill(),e.lineWidth=1.4*i,e.strokeStyle="#ffd23f",e.stroke(),e.font=`900 ${Math.round(9*i)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffd23f",e.fillText("N",a,o+.5*i),e.restore()}};var vf=U.get("addons")!=="0"&&U.get("gvmoto")!=="0"&&U.get("gv")!=="0";window.__awMotoEnabled=vf;async function Mb(){if(U.get("addons")==="0")return;U.get("hud")!=="0"&&mf();let h=await Kl(),e=U.get("perf")!=="0"?new Ca(h):null,t=U.get("look")!=="0"?new Ia(h):null,n=U.get("sea")!=="0"?new io(h):null,i=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,s=U.get("flora")!=="0"?new Ta(h,e?e.mobile:i,U.get("ipool")!=="0"):null,r=U.get("jobs")!=="0"?new Ra(h,(e?e.mobile:i)?5:8):null,a=new Da(h,e?e.mobile:i),o=U.get("far")!=="0"?new Ba(h,h.real.q.name!=="low",U.get("farbatch")!=="0"):null,c=U.get("split")!=="0"?new Pa((e?e.mobile:i)?3:4):null,l=U.get("hiperf")!=="0"?new Na(h):null,u=U.get("hilook")==="1"?new Ua(h):null,d=U.get("life")!=="0",f=d&&U.get("peds")!=="0"?new ma(h):null;U.get("loco")!=="0"&&Pd(h);let p=!f&&U.get("kids")!=="0"?new La(h,e?e.mobile:i):null,m=U.get("debug")==="1"?new Fa(h):null,g=new ks,b=U.get("daynight")!=="0",_=b?new Zr(h,U.get("sun")!=="0"):null,v=b?new $r(h):null,x=b?new da(h):null,y=d&&U.get("traffic")!=="0"?new pa(h):null,w=U.get("audio")!=="0"?new Ea(h):null,E=U.get("radio")!=="0"&&U.get("audio")!=="0"?new no(h):null,M=U.get("emerg")!=="0"?new Qa(h):null,S=U.get("crash")!=="0"?new za(h,M):null,T=vf?new Ha(h):null,I=U.get("fly")!=="0"?new Wa(h):null,R=U.get("turbo")!=="0"?new Va(h):null,B=U.get("wind")!=="0"?new Ka(h):null,F=U.get("golf")!=="0"?new ja(h):null,L=F&&U.get("resort")!=="0"?new $a(h):null,N=U.get("snmurals")!=="0"?new Ya(h):null,z=U.get("camcycle")!=="0"?new to:null,G=U.get("minimap")!=="0"?new so(h):null;{let xe=()=>{let X=document.querySelector("#credits ul");if(!X)return!1;if(!X.querySelector(".aw-msb")){let de=document.createElement("li");de.className="aw-msb",de.innerHTML='Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)',X.appendChild(de)}if(!X.querySelector(".aw-mly")){let de=document.createElement("li");de.className="aw-mly",de.innerHTML='Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>',X.appendChild(de)}if(!X.querySelector(".aw-loco")){let de=document.createElement("li");de.className="aw-loco",de.innerHTML='On-foot walk and run: <a href="https://quaternius.com/packs/universalanimationlibrary.html" target="_blank" rel="noopener">Quaternius Universal Animation Library</a> (CC0)',X.appendChild(de)}if(!X.querySelector(".aw-tds")){let de=document.createElement("li");de.className="aw-tds",de.innerHTML='Tierra del Sol gate: <a href="https://commons.wikimedia.org/wiki/File:GCV_Aruba_way_to_arribe_to_the_villas_-_panoramio.jpg" target="_blank" rel="noopener">Kallistoaua</a>, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>',X.appendChild(de)}return!0};if(!xe()){let X=0,de=setInterval(()=>{(xe()||++X>30)&&clearInterval(de)},1e3)}}let V=new ta(h);U.get("progcache")==="0"&&(window.__awProg=0);let W=U.get("mperf")!=="0"?new ia(h,e?e.mobile:i,U.get("warmup")!=="full",U.get("preup")!=="0"):null,O=U.get("ovmerge")!=="0"&&h.real?new la(h.real):null,Q=U.get("tmerge")!=="0"&&h.real?new ha(h.real):null,$=U.get("bbatch")!=="0"&&U.get("bmerge")!=="0"?new ca(h,(e?e.mobile:i)?2:3,+(U.get("bbshell")||1/0)):null,se=!$&&U.get("bmerge")!=="0"?new aa(h):null,Fe=U.get("preload")!=="0"?new na(h):null,pe=U.get("mwfreeze")!=="0"?new ra(h):null,xt=kd(g,V);window.__aw={clock:g,dn:_,lights:v,lamps:x,traffic:y,peds:f,audio:w,guard:V,perf:e,look:t,flora:s,jobs:r,far:o,ctxg:a,kids:p,split:c,hip:l,hil:u,emerg:M,crash:S,gv:T,fly:I,turbo:R,wind:B,golf:F,resort:L,sn:N,bmerge:se,mperf:W,ovm:O,tmerge:Q,sea:n,minimap:G,bbatch:$,mwf:pe,version:"0.12.0"};let _e=performance.now(),ve=xe=>{let X=Math.max(0,Math.min(2,(xe-_e)/1e3));_e=xe,On.value+=X,g.step(Math.min(X,.1)),_&&_.apply(g.t),v&&v.update(X),x&&x.update(X),y&&y.update(X),f&&f.update(Math.min(X,.1),On.value),w&&w.update(),E&&E.update(),M&&M.update(Math.min(X,.1)),S&&S.update(Math.min(X,.1)),T&&T.update(Math.min(X,.1)),I&&I.update(Math.min(X,.1)),R&&R.update(Math.min(X,.1)),B&&B.update(Math.min(X,.1)),F&&F.frame(),N&&N.update(),L&&L.frame(),z&&z.frame(h.S.mode,Math.min(X,.1)),e&&e.update(X),t&&t.update(Te.value),r&&r.frame(),l&&l.frame(),o&&o.update(X),p&&p.update(Math.min(X,.1)),m&&m.frame(X*1e3),V.frame(X),Fe&&Fe.frame(X),W&&W.frame(X),se&&se.frame(),$&&$.frame(),pe&&pe.frame(Math.min(X,.1)),xt(),requestAnimationFrame(ve)};requestAnimationFrame(ve),console.info("[aw-addons] day/night + night lights + fps guard active",h.real?.q?.name)}Mb().catch(h=>console.error("[aw-addons] failed",h));
