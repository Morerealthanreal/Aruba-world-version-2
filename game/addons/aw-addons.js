var ah=Object.defineProperty;var oh=(h,e,t)=>e in h?ah(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t;var g=(h,e,t)=>oh(h,typeof e!="symbol"?e+"":e,t);function Jo(){return new Promise(h=>{let e=()=>{let t=window.game;t&&t.ready&&t.real&&t.real.sky&&t.real.sky.sun?h(t):setTimeout(e,250)};e()})}var O=new URLSearchParams(location.search);var $o="aw_clock";function lh(){let h={t:.4166666666666667,frozen:!1,len:24};try{let n=JSON.parse(localStorage.getItem($o)||"null");n&&isFinite(n.t)&&(h={t:n.t,frozen:!!n.frozen,len:isFinite(n.len)&&n.len>0?n.len:24})}catch{}let e=O.get("t");e!==null&&isFinite(+e)&&(h.t=(+e%24+24)%24/24);let t=O.get("daylen");return t!==null&&+t>0&&(h.len=+t),O.get("freeze")==="1"&&(h.frozen=!0),h}var Xi=class{constructor(){g(this,"t");g(this,"frozen");g(this,"len");g(this,"lastSave",0);g(this,"listeners",[]);let e=lh();this.t=e.t,this.frozen=e.frozen,this.len=e.len}step(e){this.frozen||(this.t=(this.t+e/(this.len*60))%1),performance.now()-this.lastSave>5e3&&this.save()}setHour(e){this.t=(e%24+24)%24/24,this.save(),this.listeners.forEach(t=>t())}setFrozen(e){this.frozen=e,this.save(),this.listeners.forEach(t=>t())}onChange(e){this.listeners.push(e)}save(){this.lastSave=performance.now();try{localStorage.setItem($o,JSON.stringify({t:+this.t.toFixed(5),frozen:this.frozen,len:this.len}))}catch{}}};var Gl=1;var Hl=3,Ni=0,Vs=1,Nt=2,Pa=0,Vl=1,dn=2;var La=5;var Wl=100;var Na=201;var Xl=204,Ws=205;var da=0,fa=1,pa=2,As=3,ma=4,ga=5,xa=6,va=7,Xs=0,ql=1,Yl=2;var Da=1,Ua=2,Fa=3,Oa=4,Ba=5,ka=6,za=7,_a="attached",Kl="detached",Ga=300,Zl=301,Ha=302;var jl=306,wt=1e3,Qt=1001,fi=1002,On=1003,Va=1004;var Wa=1005;var Dt=1006,Xa=1007;var fn=1008;var pn=1009;var qs=1015;var mn=1023;var Jl=1028;var $l=2200,Ql=2201,ec=2202,nn=2300,sn=2301,ys=2302,ba=2303,en=2400,tn=2401,pi=2402,Ys=2500,tc=2501,qa=0,Di=1,qn=2;var Ya=0;var Ka="",le="srgb",Be="srgb-linear",ya="linear",Ms="srgb";var Ss=7680;var nc=519;var Za=35044,We=35048;var Vt=2e3,mi=2001;function ch(h){for(let e=h.length-1;e>=0;--e)if(h[e]>=65535)return!0;return!1}function hh(h){return ArrayBuffer.isView(h)&&!(h instanceof DataView)}function Ts(h){return document.createElementNS("http://www.w3.org/1999/xhtml",h)}var Qo={},Bn=null;function Ma(...h){let e="THREE."+h.shift();Bn?Bn("log",e,...h):console.log(e,...h)}function ic(h){let e=h[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=h[1];t&&t.isStackTrace?h[0]+=" "+t.getLocation():h[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return h}function ie(...h){h=ic(h);let e="THREE."+h.shift();if(Bn)Bn("warn",e,...h);else{let t=h[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...h)}}function oe(...h){h=ic(h);let e="THREE."+h.shift();if(Bn)Bn("error",e,...h);else{let t=h[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...h)}}function Un(...h){let e=h.join(" ");e in Qo||(Qo[e]=!0,ie(...h))}var uh={[da]:fa,[pa]:xa,[ma]:va,[As]:ga,[fa]:da,[xa]:pa,[va]:ma,[ga]:As},At=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}},Se=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],el=1234567,ui=Math.PI/180,kn=180/Math.PI;function $e(){let h=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Se[h&255]+Se[h>>8&255]+Se[h>>16&255]+Se[h>>24&255]+"-"+Se[e&255]+Se[e>>8&255]+"-"+Se[e>>16&15|64]+Se[e>>24&255]+"-"+Se[t&63|128]+Se[t>>8&255]+"-"+Se[t>>16&255]+Se[t>>24&255]+Se[n&255]+Se[n>>8&255]+Se[n>>16&255]+Se[n>>24&255]).toLowerCase()}function X(h,e,t){return Math.max(e,Math.min(t,h))}function ja(h,e){return(h%e+e)%e}function dh(h,e,t,n,i){return n+(h-e)*(i-n)/(t-e)}function fh(h,e,t){return h!==e?(t-h)/(e-h):0}function di(h,e,t){return(1-t)*h+t*e}function ph(h,e,t,n){return di(h,e,1-Math.exp(-t*n))}function mh(h,e=1){return e-Math.abs(ja(h,e*2)-e)}function gh(h,e,t){return h<=e?0:h>=t?1:(h=(h-e)/(t-e),h*h*(3-2*h))}function xh(h,e,t){return h<=e?0:h>=t?1:(h=(h-e)/(t-e),h*h*h*(h*(h*6-15)+10))}function vh(h,e){return h+Math.floor(Math.random()*(e-h+1))}function _h(h,e){return h+Math.random()*(e-h)}function bh(h){return h*(.5-Math.random())}function yh(h){h!==void 0&&(el=h);let e=el+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Mh(h){return h*ui}function Sh(h){return h*kn}function wh(h){return h>0&&Number.isInteger(h)&&2**Math.round(Math.log2(h))===h}function Ah(h){return Math.pow(2,Math.ceil(Math.log(h)/Math.LN2))}function Th(h){return Math.pow(2,Math.floor(Math.log(h)/Math.LN2))}function Eh(h,e,t,n,i){let s=Math.cos,r=Math.sin,a=s(t/2),o=r(t/2),l=s((e+n)/2),c=r((e+n)/2),u=s((e-n)/2),d=r((e-n)/2),f=s((n-e)/2),p=r((n-e)/2);switch(i){case"XYX":h.set(a*c,o*u,o*d,a*l);break;case"YZY":h.set(o*d,a*c,o*u,a*l);break;case"ZXZ":h.set(o*u,o*d,a*c,a*l);break;case"XZX":h.set(a*c,o*p,o*f,a*l);break;case"YXY":h.set(o*f,a*c,o*p,a*l);break;case"ZYZ":h.set(o*p,o*f,a*c,a*l);break;default:ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Je(h,e){switch(e.constructor){case Float32Array:return h;case Uint32Array:return h/4294967295;case Uint16Array:return h/65535;case Uint8Array:case Uint8ClampedArray:return h/255;case Int32Array:return Math.max(h/2147483647,-1);case Int16Array:return Math.max(h/32767,-1);case Int8Array:return Math.max(h/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ne(h,e){switch(e.constructor){case Float32Array:return h;case Uint32Array:return Math.round(h*4294967295);case Uint16Array:return Math.round(h*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(h*255);case Int32Array:return Math.round(h*2147483647);case Int16Array:return Math.round(h*32767);case Int8Array:return Math.round(h*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Ja={DEG2RAD:ui,RAD2DEG:kn,generateUUID:$e,clamp:X,euclideanModulo:ja,mapLinear:dh,inverseLerp:fh,lerp:di,damp:ph,pingpong:mh,smoothstep:gh,smootherstep:xh,randInt:vh,randFloat:_h,randFloatSpread:bh,seededRandom:yh,degToRad:Mh,radToDeg:Sh,isPowerOfTwo:wh,ceilPowerOfTwo:Ah,floorPowerOfTwo:Th,setQuaternionFromProperEuler:Eh,normalize:ne,denormalize:Je},to=class to{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=X(this.x,e.x,t.x),this.y=X(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=X(this.x,e,t),this.y=X(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(X(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(X(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};to.prototype.isVector2=!0;var B=to,re=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,a){let o=n[i+0],l=n[i+1],c=n[i+2],u=n[i+3],d=s[r+0],f=s[r+1],p=s[r+2],m=s[r+3];if(u!==m||o!==d||l!==f||c!==p){let x=o*d+l*f+c*p+u*m;x<0&&(d=-d,f=-f,p=-p,m=-m,x=-x);let v=1-a;if(x<.9995){let _=Math.acos(x),b=Math.sin(_);v=Math.sin(v*_)/b,a=Math.sin(a*_)/b,o=o*v+d*a,l=l*v+f*a,c=c*v+p*a,u=u*v+m*a}else{o=o*v+d*a,l=l*v+f*a,c=c*v+p*a,u=u*v+m*a;let _=1/Math.sqrt(o*o+l*l+c*c+u*u);o*=_,l*=_,c*=_,u*=_}}e[t]=o,e[t+1]=l,e[t+2]=c,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,s,r){let a=n[i],o=n[i+1],l=n[i+2],c=n[i+3],u=s[r],d=s[r+1],f=s[r+2],p=s[r+3];return e[t]=a*p+c*u+o*f-l*d,e[t+1]=o*p+c*d+l*u-a*f,e[t+2]=l*p+c*f+a*d-o*u,e[t+3]=c*p-a*u-o*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,r=e._order,a=Math.cos,o=Math.sin,l=a(n/2),c=a(i/2),u=a(s/2),d=o(n/2),f=o(i/2),p=o(s/2);switch(r){case"XYZ":this._x=d*c*u+l*f*p,this._y=l*f*u-d*c*p,this._z=l*c*p+d*f*u,this._w=l*c*u-d*f*p;break;case"YXZ":this._x=d*c*u+l*f*p,this._y=l*f*u-d*c*p,this._z=l*c*p-d*f*u,this._w=l*c*u+d*f*p;break;case"ZXY":this._x=d*c*u-l*f*p,this._y=l*f*u+d*c*p,this._z=l*c*p+d*f*u,this._w=l*c*u-d*f*p;break;case"ZYX":this._x=d*c*u-l*f*p,this._y=l*f*u+d*c*p,this._z=l*c*p-d*f*u,this._w=l*c*u+d*f*p;break;case"YZX":this._x=d*c*u+l*f*p,this._y=l*f*u+d*c*p,this._z=l*c*p-d*f*u,this._w=l*c*u-d*f*p;break;case"XZY":this._x=d*c*u-l*f*p,this._y=l*f*u-d*c*p,this._z=l*c*p+d*f*u,this._w=l*c*u+d*f*p;break;default:ie("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(c-o)*f,this._y=(s-l)*f,this._z=(r-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(c-o)/f,this._x=.25*f,this._y=(i+r)/f,this._z=(s+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(s-l)/f,this._x=(i+r)/f,this._y=.25*f,this._z=(o+c)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(r-i)/f,this._x=(s+l)/f,this._y=(o+c)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(X(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,a=t._x,o=t._y,l=t._z,c=t._w;return this._x=n*c+r*a+i*l-s*o,this._y=i*c+r*o+s*a-n*l,this._z=s*c+r*l+n*o-i*a,this._w=r*c-n*a-i*o-s*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,a=this.dot(e);a<0&&(n=-n,i=-i,s=-s,r=-r,a=-a);let o=1-t;if(a<.9995){let l=Math.acos(a),c=Math.sin(l);o=Math.sin(o*l)/c,t=Math.sin(t*l)/c,this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this._onChangeCallback()}else this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},no=class no{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(tl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(tl.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,r=e.y,a=e.z,o=e.w,l=2*(r*i-a*n),c=2*(a*t-s*i),u=2*(s*n-r*t);return this.x=t+o*l+r*u-a*c,this.y=n+o*c+a*l-s*u,this.z=i+o*u+s*c-r*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=X(this.x,e.x,t.x),this.y=X(this.y,e.y,t.y),this.z=X(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=X(this.x,e,t),this.y=X(this.y,e,t),this.z=X(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(X(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,r=t.x,a=t.y,o=t.z;return this.x=i*o-s*a,this.y=s*r-n*o,this.z=n*a-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Gr.copy(this).projectOnVector(e),this.sub(Gr)}reflect(e){return this.sub(Gr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(X(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};no.prototype.isVector3=!0;var M=no,Gr=new M,tl=new re,io=class io{constructor(e,t,n,i,s,r,a,o,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,a,o,l)}set(e,t,n,i,s,r,a,o,l){let c=this.elements;return c[0]=e,c[1]=i,c[2]=a,c[3]=t,c[4]=s,c[5]=o,c[6]=n,c[7]=r,c[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[3],o=n[6],l=n[1],c=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=i[0],x=i[3],v=i[6],_=i[1],b=i[4],y=i[7],w=i[2],T=i[5],A=i[8];return s[0]=r*m+a*_+o*w,s[3]=r*x+a*b+o*T,s[6]=r*v+a*y+o*A,s[1]=l*m+c*_+u*w,s[4]=l*x+c*b+u*T,s[7]=l*v+c*y+u*A,s[2]=d*m+f*_+p*w,s[5]=d*x+f*b+p*T,s[8]=d*v+f*y+p*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8];return t*r*c-t*a*l-n*s*c+n*a*o+i*s*l-i*r*o}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=c*r-a*l,d=a*o-c*s,f=l*s-r*o,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(i*l-c*n)*m,e[2]=(a*n-i*r)*m,e[3]=d*m,e[4]=(c*t-i*o)*m,e[5]=(i*s-a*t)*m,e[6]=f*m,e[7]=(n*o-l*t)*m,e[8]=(r*t-n*s)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,a){let o=Math.cos(s),l=Math.sin(s);return this.set(n*o,n*l,-n*(o*r+l*a)+r+e,-i*l,i*o,-i*(-l*r+o*a)+a+t,0,0,1),this}scale(e,t){return Un("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Hr.makeScale(e,t)),this}rotate(e){return Un("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Hr.makeRotation(-e)),this}translate(e,t){return Un("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Hr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};io.prototype.isMatrix3=!0;var z=io,Hr=new z,nl=new z().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),il=new z().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Rh(){let h={enabled:!0,workingColorSpace:Be,spaces:{},convert:function(i,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===Ms&&(i.r=St(i.r),i.g=St(i.g),i.b=St(i.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Ms&&(i.r=Fn(i.r),i.g=Fn(i.g),i.b=Fn(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ka?ya:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,r){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Un("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),h.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Un("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),h.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return h.define({[Be]:{primaries:e,whitePoint:n,transfer:ya,toXYZ:nl,fromXYZ:il,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:le},outputColorSpaceConfig:{drawingBufferColorSpace:le}},[le]:{primaries:e,whitePoint:n,transfer:Ms,toXYZ:nl,fromXYZ:il,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:le}}}),h}var Te=Rh();function St(h){return h<.04045?h*.0773993808:Math.pow(h*.9478672986+.0521327014,2.4)}function Fn(h){return h<.0031308?h*12.92:1.055*Math.pow(h,.41666)-.055}var _n,Es=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_n===void 0&&(_n=Ts("canvas")),_n.width=e.width,_n.height=e.height;let i=_n.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=_n}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Ts("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=St(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(St(t[n]/255)*255):t[n]=St(t[n]);return{data:t,width:e.width,height:e.height}}else return ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ch=0,Rs=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ch++}),this.uuid=$e(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,a=i.length;r<a;r++)i[r].isDataTexture?s.push(Vr(i[r].image)):s.push(Vr(i[r]))}else s=Vr(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function Vr(h){return typeof HTMLImageElement<"u"&&h instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&h instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&h instanceof ImageBitmap?Es.getDataURL(h):h.data?{data:Array.from(h.data),width:h.width,height:h.height,type:h.data.constructor.name}:(ie("Texture: Unable to serialize Texture."),{})}var Ih=0,Wr=new M,He=class h extends At{constructor(e=h.DEFAULT_IMAGE,t=h.DEFAULT_MAPPING,n=Qt,i=Qt,s=Dt,r=fn,a=mn,o=pn,l=h.DEFAULT_ANISOTROPY,c=Ka){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=$e(),this.name="",this.source=new Rs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=o,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new z,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Wr).x}get height(){return this.source.getSize(Wr).y}get depth(){return this.source.getSize(Wr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){ie(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ga)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case wt:e.x=e.x-Math.floor(e.x);break;case Qt:e.x=e.x<0?0:1;break;case fi:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case wt:e.y=e.y-Math.floor(e.y);break;case Qt:e.y=e.y<0?0:1;break;case fi:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};He.DEFAULT_IMAGE=null;He.DEFAULT_MAPPING=Ga;He.DEFAULT_ANISOTROPY=1;var so=class so{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,o=e.elements,l=o[0],c=o[4],u=o[8],d=o[1],f=o[5],p=o[9],m=o[2],x=o[6],v=o[10];if(Math.abs(c-d)<.01&&Math.abs(u-m)<.01&&Math.abs(p-x)<.01){if(Math.abs(c+d)<.1&&Math.abs(u+m)<.1&&Math.abs(p+x)<.1&&Math.abs(l+f+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(l+1)/2,y=(f+1)/2,w=(v+1)/2,T=(c+d)/4,A=(u+m)/4,S=(p+x)/4;return b>y&&b>w?b<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(b),i=T/n,s=A/n):y>w?y<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(y),n=T/i,s=S/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=A/s,i=S/s),this.set(n,i,s,t),this}let _=Math.sqrt((x-p)*(x-p)+(u-m)*(u-m)+(d-c)*(d-c));return Math.abs(_)<.001&&(_=1),this.x=(x-p)/_,this.y=(u-m)/_,this.z=(d-c)/_,this.w=Math.acos((l+f+v-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=X(this.x,e.x,t.x),this.y=X(this.y,e.y,t.y),this.z=X(this.z,e.z,t.z),this.w=X(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=X(this.x,e,t),this.y=X(this.y,e,t),this.z=X(this.z,e,t),this.w=X(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(X(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};so.prototype.isVector4=!0;var Ee=so;var Hs=class Hs{constructor(e,t,n,i,s,r,a,o,l,c,u,d,f,p,m,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,a,o,l,c,u,d,f,p,m,x)}set(e,t,n,i,s,r,a,o,l,c,u,d,f,p,m,x){let v=this.elements;return v[0]=e,v[4]=t,v[8]=n,v[12]=i,v[1]=s,v[5]=r,v[9]=a,v[13]=o,v[2]=l,v[6]=c,v[10]=u,v[14]=d,v[3]=f,v[7]=p,v[11]=m,v[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Hs().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/bn.setFromMatrixColumn(e,0).length(),s=1/bn.setFromMatrixColumn(e,1).length(),r=1/bn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,r=Math.cos(n),a=Math.sin(n),o=Math.cos(i),l=Math.sin(i),c=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){let d=r*c,f=r*u,p=a*c,m=a*u;t[0]=o*c,t[4]=-o*u,t[8]=l,t[1]=f+p*l,t[5]=d-m*l,t[9]=-a*o,t[2]=m-d*l,t[6]=p+f*l,t[10]=r*o}else if(e.order==="YXZ"){let d=o*c,f=o*u,p=l*c,m=l*u;t[0]=d+m*a,t[4]=p*a-f,t[8]=r*l,t[1]=r*u,t[5]=r*c,t[9]=-a,t[2]=f*a-p,t[6]=m+d*a,t[10]=r*o}else if(e.order==="ZXY"){let d=o*c,f=o*u,p=l*c,m=l*u;t[0]=d-m*a,t[4]=-r*u,t[8]=p+f*a,t[1]=f+p*a,t[5]=r*c,t[9]=m-d*a,t[2]=-r*l,t[6]=a,t[10]=r*o}else if(e.order==="ZYX"){let d=r*c,f=r*u,p=a*c,m=a*u;t[0]=o*c,t[4]=p*l-f,t[8]=d*l+m,t[1]=o*u,t[5]=m*l+d,t[9]=f*l-p,t[2]=-l,t[6]=a*o,t[10]=r*o}else if(e.order==="YZX"){let d=r*o,f=r*l,p=a*o,m=a*l;t[0]=o*c,t[4]=m-d*u,t[8]=p*u+f,t[1]=u,t[5]=r*c,t[9]=-a*c,t[2]=-l*c,t[6]=f*u+p,t[10]=d-m*u}else if(e.order==="XZY"){let d=r*o,f=r*l,p=a*o,m=a*l;t[0]=o*c,t[4]=-u,t[8]=l*c,t[1]=d*u+m,t[5]=r*c,t[9]=f*u-p,t[2]=p*u-f,t[6]=a*c,t[10]=m*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ph,e,Lh)}lookAt(e,t,n){let i=this.elements;return Fe.subVectors(e,t),Fe.lengthSq()===0&&(Fe.z=1),Fe.normalize(),Ot.crossVectors(n,Fe),Ot.lengthSq()===0&&(Math.abs(n.z)===1?Fe.x+=1e-4:Fe.z+=1e-4,Fe.normalize(),Ot.crossVectors(n,Fe)),Ot.normalize(),qi.crossVectors(Fe,Ot),i[0]=Ot.x,i[4]=qi.x,i[8]=Fe.x,i[1]=Ot.y,i[5]=qi.y,i[9]=Fe.y,i[2]=Ot.z,i[6]=qi.z,i[10]=Fe.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[4],o=n[8],l=n[12],c=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],x=n[10],v=n[14],_=n[3],b=n[7],y=n[11],w=n[15],T=i[0],A=i[4],S=i[8],E=i[12],C=i[1],I=i[5],P=i[9],L=i[13],F=i[2],D=i[6],G=i[10],K=i[14],j=i[3],V=i[7],W=i[11],$=i[15];return s[0]=r*T+a*C+o*F+l*j,s[4]=r*A+a*I+o*D+l*V,s[8]=r*S+a*P+o*G+l*W,s[12]=r*E+a*L+o*K+l*$,s[1]=c*T+u*C+d*F+f*j,s[5]=c*A+u*I+d*D+f*V,s[9]=c*S+u*P+d*G+f*W,s[13]=c*E+u*L+d*K+f*$,s[2]=p*T+m*C+x*F+v*j,s[6]=p*A+m*I+x*D+v*V,s[10]=p*S+m*P+x*G+v*W,s[14]=p*E+m*L+x*K+v*$,s[3]=_*T+b*C+y*F+w*j,s[7]=_*A+b*I+y*D+w*V,s[11]=_*S+b*P+y*G+w*W,s[15]=_*E+b*L+y*K+w*$,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],a=e[5],o=e[9],l=e[13],c=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],x=e[11],v=e[15],_=o*f-l*d,b=a*f-l*u,y=a*d-o*u,w=r*f-l*c,T=r*d-o*c,A=r*u-a*c;return t*(m*_-x*b+v*y)-n*(p*_-x*w+v*T)+i*(p*b-m*w+v*A)-s*(p*y-m*T+x*A)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],a=e[9],o=e[2],l=e[6],c=e[10];return t*(r*c-a*l)-n*(s*c-a*o)+i*(s*l-r*o)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],c=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],x=e[14],v=e[15],_=t*a-n*r,b=t*o-i*r,y=t*l-s*r,w=n*o-i*a,T=n*l-s*a,A=i*l-s*o,S=c*m-u*p,E=c*x-d*p,C=c*v-f*p,I=u*x-d*m,P=u*v-f*m,L=d*v-f*x,F=_*L-b*P+y*I+w*C-T*E+A*S;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/F;return e[0]=(a*L-o*P+l*I)*D,e[1]=(i*P-n*L-s*I)*D,e[2]=(m*A-x*T+v*w)*D,e[3]=(d*T-u*A-f*w)*D,e[4]=(o*C-r*L-l*E)*D,e[5]=(t*L-i*C+s*E)*D,e[6]=(x*y-p*A-v*b)*D,e[7]=(c*A-d*y+f*b)*D,e[8]=(r*P-a*C+l*S)*D,e[9]=(n*C-t*P-s*S)*D,e[10]=(p*T-m*y+v*_)*D,e[11]=(u*y-c*T-f*_)*D,e[12]=(a*E-r*I-o*S)*D,e[13]=(t*I-n*E+i*S)*D,e[14]=(m*b-p*w-x*_)*D,e[15]=(c*w-u*b+d*_)*D,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,r=e.x,a=e.y,o=e.z,l=s*r,c=s*a;return this.set(l*r+n,l*a-i*o,l*o+i*a,0,l*a+i*o,c*a+n,c*o-i*r,0,l*o-i*a,c*o+i*r,s*o*o+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,r=t._y,a=t._z,o=t._w,l=s+s,c=r+r,u=a+a,d=s*l,f=s*c,p=s*u,m=r*c,x=r*u,v=a*u,_=o*l,b=o*c,y=o*u,w=n.x,T=n.y,A=n.z;return i[0]=(1-(m+v))*w,i[1]=(f+y)*w,i[2]=(p-b)*w,i[3]=0,i[4]=(f-y)*T,i[5]=(1-(d+v))*T,i[6]=(x+_)*T,i[7]=0,i[8]=(p+b)*A,i[9]=(x-_)*A,i[10]=(1-(d+m))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=bn.set(i[0],i[1],i[2]).length(),a=bn.set(i[4],i[5],i[6]).length(),o=bn.set(i[8],i[9],i[10]).length();s<0&&(r=-r),Ke.copy(this);let l=1/r,c=1/a,u=1/o;return Ke.elements[0]*=l,Ke.elements[1]*=l,Ke.elements[2]*=l,Ke.elements[4]*=c,Ke.elements[5]*=c,Ke.elements[6]*=c,Ke.elements[8]*=u,Ke.elements[9]*=u,Ke.elements[10]*=u,t.setFromRotationMatrix(Ke),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,r,a=Vt,o=!1){let l=this.elements,c=2*s/(t-e),u=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),p,m;if(o)p=s/(r-s),m=r*s/(r-s);else if(a===Vt)p=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(a===mi)p=-r/(r-s),m=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,r,a=Vt,o=!1){let l=this.elements,c=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),p,m;if(o)p=1/(r-s),m=r/(r-s);else if(a===Vt)p=-2/(r-s),m=-(r+s)/(r-s);else if(a===mi)p=-1/(r-s),m=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Hs.prototype.isMatrix4=!0;var U=Hs,bn=new M,Ke=new U,Ph=new M(0,0,0),Lh=new M(1,1,1),Ot=new M,qi=new M,Fe=new M,sl=new U,rl=new re,ot=class h{constructor(e=0,t=0,n=0,i=h.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],a=i[8],o=i[1],l=i[5],c=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(X(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-X(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(o,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(X(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(o,s));break;case"ZYX":this._y=Math.asin(-X(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(o,s)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(X(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-c,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-X(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-c,f),this._y=0);break;default:ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return sl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(sl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return rl.setFromEuler(this),this.setFromQuaternion(rl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ot.DEFAULT_ORDER="XYZ";var gi=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Nh=0,al=new M,yn=new re,gt=new U,Yi=new M,ei=new M,Dh=new M,Uh=new re,ol=new M(1,0,0),ll=new M(0,1,0),cl=new M(0,0,1),hl={type:"added"},Fh={type:"removed"},Mn={type:"childadded",child:null},Xr={type:"childremoved",child:null},ce=class h extends At{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Nh++}),this.uuid=$e(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=h.DEFAULT_UP.clone();let e=new M,t=new ot,n=new re,i=new M(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new U},normalMatrix:{value:new z}}),this.matrix=new U,this.matrixWorld=new U,this.matrixAutoUpdate=h.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=h.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gi,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yn.setFromAxisAngle(e,t),this.quaternion.multiply(yn),this}rotateOnWorldAxis(e,t){return yn.setFromAxisAngle(e,t),this.quaternion.premultiply(yn),this}rotateX(e){return this.rotateOnAxis(ol,e)}rotateY(e){return this.rotateOnAxis(ll,e)}rotateZ(e){return this.rotateOnAxis(cl,e)}translateOnAxis(e,t){return al.copy(e).applyQuaternion(this.quaternion),this.position.add(al.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ol,e)}translateY(e){return this.translateOnAxis(ll,e)}translateZ(e){return this.translateOnAxis(cl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Yi.copy(e):Yi.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),ei.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gt.lookAt(ei,Yi,this.up):gt.lookAt(Yi,ei,this.up),this.quaternion.setFromRotationMatrix(gt),i&&(gt.extractRotation(i.matrixWorld),yn.setFromRotationMatrix(gt),this.quaternion.premultiply(yn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(oe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(hl),Mn.child=e,this.dispatchEvent(Mn),Mn.child=null):oe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Fh),Xr.child=e,this.dispatchEvent(Xr),Xr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gt.multiply(e.parent.matrixWorld)),e.applyMatrix4(gt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(hl),Mn.child=e,this.dispatchEvent(Mn),Mn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ei,e,Dh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ei,Uh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let o=a.shapes;if(Array.isArray(o))for(let l=0,c=o.length;l<c;l++){let u=o[l];s(e.shapes,u)}else s(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let o=0,l=this.material.length;o<l;o++)a.push(s(e.materials,this.material[o]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let o=this.animations[a];i.animations.push(s(e.animations,o))}}if(t){let a=r(e.geometries),o=r(e.materials),l=r(e.textures),c=r(e.images),u=r(e.shapes),d=r(e.skeletons),f=r(e.animations),p=r(e.nodes);a.length>0&&(n.geometries=a),o.length>0&&(n.materials=o),l.length>0&&(n.textures=l),c.length>0&&(n.images=c),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function r(a){let o=[];for(let l in a){let c=a[l];delete c.metadata,o.push(c)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};ce.DEFAULT_UP=new M(0,1,0);ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ae=class extends ce{constructor(){super(),this.isGroup=!0,this.type="Group"}};var sc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bt={h:0,s:0,l:0},Ki={h:0,s:0,l:0};function qr(h,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?h+(e-h)*6*t:t<1/2?e:t<2/3?h+(e-h)*6*(2/3-t):h}var R=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=le){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Te.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Te.workingColorSpace){return this.r=e,this.g=t,this.b=n,Te.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Te.workingColorSpace){if(e=ja(e,1),t=X(t,0,1),n=X(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=qr(r,s,e+1/3),this.g=qr(r,s,e),this.b=qr(r,s,e-1/3)}return Te.colorSpaceToWorking(this,i),this}setStyle(e,t=le){function n(s){s!==void 0&&parseFloat(s)<1&&ie("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:ie("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(s,16),t);ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=le){let n=sc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=St(e.r),this.g=St(e.g),this.b=St(e.b),this}copyLinearToSRGB(e){return this.r=Fn(e.r),this.g=Fn(e.g),this.b=Fn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=le){return Te.workingToColorSpace(we.copy(this),e),Math.round(X(we.r*255,0,255))*65536+Math.round(X(we.g*255,0,255))*256+Math.round(X(we.b*255,0,255))}getHexString(e=le){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Te.workingColorSpace){Te.workingToColorSpace(we.copy(this),t);let n=we.r,i=we.g,s=we.b,r=Math.max(n,i,s),a=Math.min(n,i,s),o,l,c=(a+r)/2;if(a===r)o=0,l=0;else{let u=r-a;switch(l=c<=.5?u/(r+a):u/(2-r-a),r){case n:o=(i-s)/u+(i<s?6:0);break;case i:o=(s-n)/u+2;break;case s:o=(n-i)/u+4;break}o/=6}return e.h=o,e.s=l,e.l=c,e}getRGB(e,t=Te.workingColorSpace){return Te.workingToColorSpace(we.copy(this),t),e.r=we.r,e.g=we.g,e.b=we.b,e}getStyle(e=le){Te.workingToColorSpace(we.copy(this),e);let t=we.r,n=we.g,i=we.b;return e!==le?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Bt),this.setHSL(Bt.h+e,Bt.s+t,Bt.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Bt),e.getHSL(Ki);let n=di(Bt.h,Ki.h,t),i=di(Bt.s,Ki.s,t),s=di(Bt.l,Ki.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},we=new R;R.NAMES=sc;var Ze=new M,xt=new M,Yr=new M,vt=new M,Sn=new M,wn=new M,ul=new M,Kr=new M,Zr=new M,jr=new M,Jr=new Ee,$r=new Ee,Qr=new Ee,Mt=class h{constructor(e=new M,t=new M,n=new M){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Ze.subVectors(e,t),i.cross(Ze);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Ze.subVectors(i,t),xt.subVectors(n,t),Yr.subVectors(e,t);let r=Ze.dot(Ze),a=Ze.dot(xt),o=Ze.dot(Yr),l=xt.dot(xt),c=xt.dot(Yr),u=r*l-a*a;if(u===0)return s.set(0,0,0),null;let d=1/u,f=(l*o-a*c)*d,p=(r*c-a*o)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,vt)===null?!1:vt.x>=0&&vt.y>=0&&vt.x+vt.y<=1}static getInterpolation(e,t,n,i,s,r,a,o){return this.getBarycoord(e,t,n,i,vt)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(s,vt.x),o.addScaledVector(r,vt.y),o.addScaledVector(a,vt.z),o)}static getInterpolatedAttribute(e,t,n,i,s,r){return Jr.setScalar(0),$r.setScalar(0),Qr.setScalar(0),Jr.fromBufferAttribute(e,t),$r.fromBufferAttribute(e,n),Qr.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Jr,s.x),r.addScaledVector($r,s.y),r.addScaledVector(Qr,s.z),r}static isFrontFacing(e,t,n,i){return Ze.subVectors(n,t),xt.subVectors(e,t),Ze.cross(xt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ze.subVectors(this.c,this.b),xt.subVectors(this.a,this.b),Ze.cross(xt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return h.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return h.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return h.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return h.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return h.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,a;Sn.subVectors(i,n),wn.subVectors(s,n),Kr.subVectors(e,n);let o=Sn.dot(Kr),l=wn.dot(Kr);if(o<=0&&l<=0)return t.copy(n);Zr.subVectors(e,i);let c=Sn.dot(Zr),u=wn.dot(Zr);if(c>=0&&u<=c)return t.copy(i);let d=o*u-c*l;if(d<=0&&o>=0&&c<=0)return r=o/(o-c),t.copy(n).addScaledVector(Sn,r);jr.subVectors(e,s);let f=Sn.dot(jr),p=wn.dot(jr);if(p>=0&&f<=p)return t.copy(s);let m=f*l-o*p;if(m<=0&&l>=0&&p<=0)return a=l/(l-p),t.copy(n).addScaledVector(wn,a);let x=c*p-f*u;if(x<=0&&u-c>=0&&f-p>=0)return ul.subVectors(s,i),a=(u-c)/(u-c+(f-p)),t.copy(i).addScaledVector(ul,a);let v=1/(x+m+d);return r=m*v,a=d*v,t.copy(n).addScaledVector(Sn,r).addScaledVector(wn,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Re=class{constructor(e=new M(1/0,1/0,1/0),t=new M(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(je.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(je.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=je.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,a=s.count;r<a;r++)e.isMesh===!0?e.getVertexPosition(r,je):je.fromBufferAttribute(s,r),je.applyMatrix4(e.matrixWorld),this.expandByPoint(je);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Zi.copy(n.boundingBox)),Zi.applyMatrix4(e.matrixWorld),this.union(Zi)}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,je),je.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ti),ji.subVectors(this.max,ti),An.subVectors(e.a,ti),Tn.subVectors(e.b,ti),En.subVectors(e.c,ti),kt.subVectors(Tn,An),zt.subVectors(En,Tn),Zt.subVectors(An,En);let t=[0,-kt.z,kt.y,0,-zt.z,zt.y,0,-Zt.z,Zt.y,kt.z,0,-kt.x,zt.z,0,-zt.x,Zt.z,0,-Zt.x,-kt.y,kt.x,0,-zt.y,zt.x,0,-Zt.y,Zt.x,0];return!ea(t,An,Tn,En,ji)||(t=[1,0,0,0,1,0,0,0,1],!ea(t,An,Tn,En,ji))?!1:(Ji.crossVectors(kt,zt),t=[Ji.x,Ji.y,Ji.z],ea(t,An,Tn,En,ji))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,je).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(je).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_t[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_t[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_t[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_t[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_t[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_t[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_t[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_t[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_t),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},_t=[new M,new M,new M,new M,new M,new M,new M,new M],je=new M,Zi=new Re,An=new M,Tn=new M,En=new M,kt=new M,zt=new M,Zt=new M,ti=new M,ji=new M,Ji=new M,jt=new M;function ea(h,e,t,n,i){for(let s=0,r=h.length-3;s<=r;s+=3){jt.fromArray(h,s);let a=i.x*Math.abs(jt.x)+i.y*Math.abs(jt.y)+i.z*Math.abs(jt.z),o=e.dot(jt),l=t.dot(jt),c=n.dot(jt);if(Math.max(-Math.max(o,l,c),Math.min(o,l,c))>a)return!1}return!0}var fe=new M,$i=new B,Oh=0,Z=class extends At{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Oh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Za,this.updateRanges=[],this.gpuType=qs,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)$i.fromBufferAttribute(this,t),$i.applyMatrix3(e),this.setXY(t,$i.x,$i.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)fe.fromBufferAttribute(this,t),fe.applyMatrix3(e),this.setXYZ(t,fe.x,fe.y,fe.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)fe.fromBufferAttribute(this,t),fe.applyMatrix4(e),this.setXYZ(t,fe.x,fe.y,fe.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)fe.fromBufferAttribute(this,t),fe.applyNormalMatrix(e),this.setXYZ(t,fe.x,fe.y,fe.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)fe.fromBufferAttribute(this,t),fe.transformDirection(e),this.setXYZ(t,fe.x,fe.y,fe.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Je(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ne(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Je(t,this.array)),t}setX(e,t){return this.normalized&&(t=ne(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Je(t,this.array)),t}setY(e,t){return this.normalized&&(t=ne(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Je(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ne(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Je(t,this.array)),t}setW(e,t){return this.normalized&&(t=ne(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ne(t,this.array),n=ne(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ne(t,this.array),n=ne(n,this.array),i=ne(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=ne(t,this.array),n=ne(n,this.array),i=ne(i,this.array),s=ne(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Cs=class extends Z{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Is=class extends Z{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var te=class extends Z{constructor(e,t,n){super(new Float32Array(e),t,n)}},Bh=new Re,ni=new M,ta=new M,Ie=class{constructor(e=new M,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Bh.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ni.subVectors(e,this.center);let t=ni.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ni,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ta.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ni.copy(e.center).add(ta)),this.expandByPoint(ni.copy(e.center).sub(ta))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},kh=0,Ge=new U,na=new ce,Rn=new M,Oe=new Re,ii=new Re,_e=new M,J=class h extends At{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:kh++}),this.uuid=$e(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ch(e)?Is:Cs)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new z().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ge.makeRotationFromQuaternion(e),this.applyMatrix4(Ge),this}rotateX(e){return Ge.makeRotationX(e),this.applyMatrix4(Ge),this}rotateY(e){return Ge.makeRotationY(e),this.applyMatrix4(Ge),this}rotateZ(e){return Ge.makeRotationZ(e),this.applyMatrix4(Ge),this}translate(e,t,n){return Ge.makeTranslation(e,t,n),this.applyMatrix4(Ge),this}scale(e,t,n){return Ge.makeScale(e,t,n),this.applyMatrix4(Ge),this}lookAt(e){return na.lookAt(e),na.updateMatrix(),this.applyMatrix4(na.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Rn).negate(),this.translate(Rn.x,Rn.y,Rn.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new te(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Re);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){oe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];Oe.setFromBufferAttribute(s),this.morphTargetsRelative?(_e.addVectors(this.boundingBox.min,Oe.min),this.boundingBox.expandByPoint(_e),_e.addVectors(this.boundingBox.max,Oe.max),this.boundingBox.expandByPoint(_e)):(this.boundingBox.expandByPoint(Oe.min),this.boundingBox.expandByPoint(Oe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&oe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ie);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){oe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new M,1/0);return}if(e){let n=this.boundingSphere.center;if(Oe.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let a=t[s];ii.setFromBufferAttribute(a),this.morphTargetsRelative?(_e.addVectors(Oe.min,ii.min),Oe.expandByPoint(_e),_e.addVectors(Oe.max,ii.max),Oe.expandByPoint(_e)):(Oe.expandByPoint(ii.min),Oe.expandByPoint(ii.max))}Oe.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)_e.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(_e));if(t)for(let s=0,r=t.length;s<r;s++){let a=t[s],o=this.morphTargetsRelative;for(let l=0,c=a.count;l<c;l++)_e.fromBufferAttribute(a,l),o&&(Rn.fromBufferAttribute(e,l),_e.add(Rn)),i=Math.max(i,n.distanceToSquared(_e))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&oe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){oe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new Z(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let a=[],o=[];for(let S=0;S<n.count;S++)a[S]=new M,o[S]=new M;let l=new M,c=new M,u=new M,d=new B,f=new B,p=new B,m=new M,x=new M;function v(S,E,C){l.fromBufferAttribute(n,S),c.fromBufferAttribute(n,E),u.fromBufferAttribute(n,C),d.fromBufferAttribute(s,S),f.fromBufferAttribute(s,E),p.fromBufferAttribute(s,C),c.sub(l),u.sub(l),f.sub(d),p.sub(d);let I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(m.copy(c).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(I),x.copy(u).multiplyScalar(f.x).addScaledVector(c,-p.x).multiplyScalar(I),a[S].add(m),a[E].add(m),a[C].add(m),o[S].add(x),o[E].add(x),o[C].add(x))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let S=0,E=_.length;S<E;++S){let C=_[S],I=C.start,P=C.count;for(let L=I,F=I+P;L<F;L+=3)v(e.getX(L+0),e.getX(L+1),e.getX(L+2))}let b=new M,y=new M,w=new M,T=new M;function A(S){w.fromBufferAttribute(i,S),T.copy(w);let E=a[S];b.copy(E),b.sub(w.multiplyScalar(w.dot(E))).normalize(),y.crossVectors(T,E);let I=y.dot(o[S])<0?-1:1;r.setXYZW(S,b.x,b.y,b.z,I)}for(let S=0,E=_.length;S<E;++S){let C=_[S],I=C.start,P=C.count;for(let L=I,F=I+P;L<F;L+=3)A(e.getX(L+0)),A(e.getX(L+1)),A(e.getX(L+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Z(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new M,s=new M,r=new M,a=new M,o=new M,l=new M,c=new M,u=new M;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),m=e.getX(d+1),x=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),c.subVectors(r,s),u.subVectors(i,s),c.cross(u),a.fromBufferAttribute(n,p),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),a.add(c),o.add(c),l.add(c),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),c.subVectors(r,s),u.subVectors(i,s),c.cross(u),n.setXYZ(d+0,c.x,c.y,c.z),n.setXYZ(d+1,c.x,c.y,c.z),n.setXYZ(d+2,c.x,c.y,c.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)_e.fromBufferAttribute(e,t),_e.normalize(),e.setXYZ(t,_e.x,_e.y,_e.z)}toNonIndexed(){function e(a,o){let l=a.array,c=a.itemSize,u=a.normalized,d=new l.constructor(o.length*c),f=0,p=0;for(let m=0,x=o.length;m<x;m++){a.isInterleavedBufferAttribute?f=o[m]*a.data.stride+a.offset:f=o[m]*c;for(let v=0;v<c;v++)d[p++]=l[f++]}return new Z(d,c,u)}if(this.index===null)return ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new h,n=this.index.array,i=this.attributes;for(let a in i){let o=i[a],l=e(o,n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let o=[],l=s[a];for(let c=0,u=l.length;c<u;c++){let d=l[c],f=e(d,n);o.push(f)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let a=0,o=r.length;a<o;a++){let l=r[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let l in o)o[l]!==void 0&&(e[l]=o[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let o in n){let l=n[o];e.data.attributes[o]=l.toJSON(e.data)}let i={},s=!1;for(let o in this.morphAttributes){let l=this.morphAttributes[o],c=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];c.push(f.toJSON(e.data))}c.length>0&&(i[o]=c,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let l in i){let c=i[l];this.setAttribute(l,c.clone(t))}let s=e.morphAttributes;for(let l in s){let c=[],u=s[l];for(let d=0,f=u.length;d<f;d++)c.push(u[d].clone(t));this.morphAttributes[l]=c}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let l=0,c=r.length;l<c;l++){let u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},rn=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Za,this.updateRanges=[],this.version=0,this.uuid=$e()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$e()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$e()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Ae=new M,Wt=class h{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ae.fromBufferAttribute(this,t),Ae.applyMatrix4(e),this.setXYZ(t,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ae.fromBufferAttribute(this,t),Ae.applyNormalMatrix(e),this.setXYZ(t,Ae.x,Ae.y,Ae.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ae.fromBufferAttribute(this,t),Ae.transformDirection(e),this.setXYZ(t,Ae.x,Ae.y,Ae.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Je(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ne(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ne(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ne(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ne(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ne(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Je(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Je(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Je(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Je(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ne(t,this.array),n=ne(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ne(t,this.array),n=ne(n,this.array),i=ne(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ne(t,this.array),n=ne(n,this.array),i=ne(i,this.array),s=ne(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Ma("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new Z(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new h(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ma("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ia=new M,zh=new M,Gh=new z,rt=class{constructor(e=new M(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=ia.subVectors(n,t).cross(zh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(ia),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Gh.getNormalMatrix(e),i=this.coplanarPoint(ia).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Hh=0,Pe=class extends At{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Hh++}),this.uuid=$e(),this.name="",this.type="Material",this.blending=Vl,this.side=Ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xl,this.blendDst=Ws,this.blendEquation=Wl,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new R(0,0,0),this.blendAlpha=0,this.depthFunc=As,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ss,this.stencilZFail=Ss,this.stencilZPass=Ss,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){ie(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let r=[];for(let a in s){let o=s[a];delete o.metadata,r.push(o)}return r}if(t){let s=i(e.textures),r=i(e.images);s.length>0&&(n.textures=s),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new R().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new rt().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new B().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},zn=class extends Pe{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new R(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Cn,si=new M,In=new M,Pn=new M,Ln=new B,ri=new B,rc=new U,Qi=new M,ai=new M,es=new M,dl=new B,sa=new B,fl=new B,xi=class extends ce{constructor(e=new zn){if(super(),this.isSprite=!0,this.type="Sprite",Cn===void 0){Cn=new J;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new rn(t,5);Cn.setIndex([0,1,2,0,2,3]),Cn.setAttribute("position",new Wt(n,3,0,!1)),Cn.setAttribute("uv",new Wt(n,2,3,!1))}this.geometry=Cn,this.material=e,this.center=new B(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&oe('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),In.setFromMatrixScale(this.matrixWorld),rc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Pn.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&In.multiplyScalar(-Pn.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let r=this.center;ts(Qi.set(-.5,-.5,0),Pn,r,In,i,s),ts(ai.set(.5,-.5,0),Pn,r,In,i,s),ts(es.set(.5,.5,0),Pn,r,In,i,s),dl.set(0,0),sa.set(1,0),fl.set(1,1);let a=e.ray.intersectTriangle(Qi,ai,es,!1,si);if(a===null&&(ts(ai.set(-.5,.5,0),Pn,r,In,i,s),sa.set(0,1),a=e.ray.intersectTriangle(Qi,es,ai,!1,si),a===null))return;let o=e.ray.origin.distanceTo(si);o<e.near||o>e.far||t.push({distance:o,point:si.clone(),uv:Mt.getInterpolation(si,Qi,ai,es,dl,sa,fl,new B),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function ts(h,e,t,n,i,s){Ln.subVectors(h,t).addScalar(.5).multiply(n),i!==void 0?(ri.x=s*Ln.x-i*Ln.y,ri.y=i*Ln.x+s*Ln.y):ri.copy(Ln),h.copy(e),h.x+=ri.x,h.y+=ri.y,h.applyMatrix4(rc)}var ns=new M,pl=new M,vi=class extends ce{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let n=0,i=t.length;n<i;n++){let s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);let i=this.levels,s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){let i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){ns.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(ns);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){ns.setFromMatrixPosition(e.matrixWorld),pl.setFromMatrixPosition(this.matrixWorld);let n=ns.distanceTo(pl)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let r=t[i].distance;if(t[i].object.visible&&(r-=r*t[i].hysteresis),n>=r)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let r=n[i];t.object.levels.push({object:r.object.uuid,distance:r.distance,hysteresis:r.hysteresis})}return t}},bt=new M,ra=new M,is=new M,ss=new M,Xt=class{constructor(e=new M,t=new M(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=bt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bt.copy(this.origin).addScaledVector(this.direction,t),bt.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ra.copy(e).add(t).multiplyScalar(.5),is.copy(t).sub(e).normalize(),ss.copy(this.origin).sub(ra);let s=e.distanceTo(t)*.5,r=-this.direction.dot(is),a=ss.dot(this.direction),o=-ss.dot(is),l=ss.lengthSq(),c=Math.abs(1-r*r),u,d,f,p;if(c>0)if(u=r*o-a,d=r*a-o,p=s*c,u>=0)if(d>=-p)if(d<=p){let m=1/c;u*=m,d*=m,f=u*(u+r*d+2*a)+d*(r*u+d+2*o)+l}else d=s,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*o)+l;else d=-s,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*o)+l;else d<=-p?(u=Math.max(0,-(-r*s+a)),d=u>0?-s:Math.min(Math.max(-s,-o),s),f=-u*u+d*(d+2*o)+l):d<=p?(u=0,d=Math.min(Math.max(-s,-o),s),f=d*(d+2*o)+l):(u=Math.max(0,-(r*s+a)),d=u>0?s:Math.min(Math.max(-s,-o),s),f=-u*u+d*(d+2*o)+l);else d=r>0?-s:s,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*o)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ra).addScaledVector(is,d),f}intersectSphere(e,t){if(e.radius<0)return null;bt.subVectors(e.center,this.origin);let n=bt.dot(this.direction),i=bt.dot(bt)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),a=n-r,o=n+r;return o<0?null:a<0?this.at(o,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,r,a,o,l=1/this.direction.x,c=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l),c>=0?(s=(e.min.y-d.y)*c,r=(e.max.y-d.y)*c):(s=(e.max.y-d.y)*c,r=(e.min.y-d.y)*c),n>r||s>i||((s>n||isNaN(n))&&(n=s),(r<i||isNaN(i))&&(i=r),u>=0?(a=(e.min.z-d.z)*u,o=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,o=(e.min.z-d.z)*u),n>o||a>i)||((a>n||n!==n)&&(n=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,bt)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,a=this.direction,o=a.x,l=a.y,c=a.z,u=e.x-r.x,d=e.y-r.y,f=e.z-r.z,p=t.x-r.x,m=t.y-r.y,x=t.z-r.z,v=n.x-r.x,_=n.y-r.y,b=n.z-r.z,y=Math.abs(o),w=Math.abs(l),T=Math.abs(c),A,S,E,C,I,P,L,F,D,G,K,j;if(y>=w&&y>=T?(E=o,P=u,D=p,j=v,o>=0?(A=l,S=c,C=d,I=f,L=m,F=x,G=_,K=b):(A=c,S=l,C=f,I=d,L=x,F=m,G=b,K=_)):w>=T?(E=l,P=d,D=m,j=_,l>=0?(A=c,S=o,C=f,I=u,L=x,F=p,G=b,K=v):(A=o,S=c,C=u,I=f,L=p,F=x,G=v,K=b)):(E=c,P=f,D=x,j=b,c>=0?(A=o,S=l,C=u,I=d,L=p,F=m,G=v,K=_):(A=l,S=o,C=d,I=u,L=m,F=p,G=_,K=v)),E===0)return null;let V=A/E,W=S/E,$=1/E,he=C-V*P,ue=I-W*P,ee=L-V*D,k=F-W*D,Q=G-V*j,Ft=K-W*j,ge=Q*k-Ft*ee,ve=he*Ft-ue*Q,Me=ee*ue-k*he;if(i){if(ge<0||ve<0||Me<0)return null}else if((ge<0||ve<0||Me<0)&&(ge>0||ve>0||Me>0))return null;let Ue=ge+ve+Me;if(Ue===0)return null;let it=$*(ge*P+ve*D+Me*j);return(Ue>0?it<0:it>0)?null:this.at(it/Ue,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},be=class extends Pe{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new R(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ot,this.combine=Xs,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ml=new U,Jt=new Xt,rs=new Ie,gl=new M,as=new M,os=new M,ls=new M,aa=new M,cs=new M,xl=new M,hs=new M,H=class extends ce{constructor(e=new J,t=new be){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){cs.set(0,0,0);for(let o=0,l=s.length;o<l;o++){let c=a[o],u=s[o];c!==0&&(aa.fromBufferAttribute(u,e),r?cs.addScaledVector(aa,c):cs.addScaledVector(aa.sub(t),c))}t.add(cs)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),rs.copy(n.boundingSphere),rs.applyMatrix4(s),Jt.copy(e.ray).recast(e.near),!(rs.containsPoint(Jt.origin)===!1&&(Jt.intersectSphere(rs,gl)===null||Jt.origin.distanceToSquared(gl)>(e.far-e.near)**2))&&(ml.copy(s).invert(),Jt.copy(e.ray).applyMatrix4(ml),!(n.boundingBox!==null&&Jt.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Jt)))}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,a=s.index,o=s.attributes.position,l=s.attributes.uv,c=s.attributes.uv1,u=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let x=d[p],v=r[x.materialIndex],_=Math.max(x.start,f.start),b=Math.min(a.count,Math.min(x.start+x.count,f.start+f.count));for(let y=_,w=b;y<w;y+=3){let T=a.getX(y),A=a.getX(y+1),S=a.getX(y+2);i=us(this,v,e,n,l,c,u,T,A,S),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=x.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(a.count,f.start+f.count);for(let x=p,v=m;x<v;x+=3){let _=a.getX(x),b=a.getX(x+1),y=a.getX(x+2);i=us(this,r,e,n,l,c,u,_,b,y),i&&(i.faceIndex=Math.floor(x/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let x=d[p],v=r[x.materialIndex],_=Math.max(x.start,f.start),b=Math.min(o.count,Math.min(x.start+x.count,f.start+f.count));for(let y=_,w=b;y<w;y+=3){let T=y,A=y+1,S=y+2;i=us(this,v,e,n,l,c,u,T,A,S),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=x.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(o.count,f.start+f.count);for(let x=p,v=m;x<v;x+=3){let _=x,b=x+1,y=x+2;i=us(this,r,e,n,l,c,u,_,b,y),i&&(i.faceIndex=Math.floor(x/3),t.push(i))}}}};function Vh(h,e,t,n,i,s,r,a){let o;if(e.side===Vs?o=n.intersectTriangle(r,s,i,!0,a):o=n.intersectTriangle(i,s,r,e.side===Ni,a),o===null)return null;hs.copy(a),hs.applyMatrix4(h.matrixWorld);let l=t.ray.origin.distanceTo(hs);return l<t.near||l>t.far?null:{distance:l,point:hs.clone(),object:h}}function us(h,e,t,n,i,s,r,a,o,l){h.getVertexPosition(a,as),h.getVertexPosition(o,os),h.getVertexPosition(l,ls);let c=Vh(h,e,t,n,as,os,ls,xl);if(c){let u=new M;Mt.getBarycoord(xl,as,os,ls,u),i&&(c.uv=Mt.getInterpolatedAttribute(i,a,o,l,u,new B)),s&&(c.uv1=Mt.getInterpolatedAttribute(s,a,o,l,u,new B)),r&&(c.normal=Mt.getInterpolatedAttribute(r,a,o,l,u,new M),c.normal.dot(n.direction)>0&&c.normal.multiplyScalar(-1));let d={a,b:o,c:l,normal:new M,materialIndex:0};Mt.getNormal(as,os,ls,d.normal),c.face=d,c.barycoord=u}return c}var oi=new Ee,vl=new Ee,_l=new Ee,Wh=new Ee,bl=new U,ds=new M,oa=new Ie,yl=new U,la=new Xt,_i=class extends H{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=_a,this.bindMatrix=new U,this.bindMatrixInverse=new U,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Re),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ds),this.boundingBox.expandByPoint(ds)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ie),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ds),this.boundingSphere.expandByPoint(ds)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),oa.copy(this.boundingSphere),oa.applyMatrix4(i),e.ray.intersectsSphere(oa)!==!1&&(yl.copy(i).invert(),la.copy(e.ray).applyMatrix4(yl),!(this.boundingBox!==null&&la.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,la)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ee,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===_a?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Kl?this.bindMatrixInverse.copy(this.bindMatrix).invert():ie("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;vl.fromBufferAttribute(i.attributes.skinIndex,e),_l.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(oi.copy(t),t.set(0,0,0,0)):(oi.set(...t,1),t.set(0,0,0)),oi.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=_l.getComponent(s);if(r!==0){let a=vl.getComponent(s);bl.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Wh.copy(oi).applyMatrix4(bl),r)}}return t.isVector4&&(t.w=oi.w),t.applyMatrix4(this.bindMatrixInverse)}},Gn=class extends ce{constructor(){super(),this.isBone=!0,this.type="Bone"}},Tt=class extends He{constructor(e=null,t=1,n=1,i,s,r,a,o,l=On,c=On,u,d){super(null,r,a,o,l,c,i,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ml=new U,Xh=new U,bi=class h{constructor(e=[],t=[]){this.uuid=$e(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){ie("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new U)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new U;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let a=e[s]?e[s].matrixWorld:Xh;Ml.multiplyMatrices(a,t[s]),Ml.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new h(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Tt(t,e,e,mn,qs);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=t[s];r===void 0&&(ie("Skeleton: No bone found with UUID:",s),r=new Gn),this.bones.push(r),this.boneInverses.push(new U().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let r=t[i];e.bones.push(r.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},ke=class extends Z{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Nn=new U,Sl=new U,fs=[],wl=new Re,qh=new U,li=new H,ci=new Ie,pe=class extends H{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ke(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,qh)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Re),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Nn),wl.copy(e.boundingBox).applyMatrix4(Nn),this.boundingBox.union(wl)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ie),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Nn),ci.copy(e.boundingSphere).applyMatrix4(Nn),this.boundingSphere.union(ci)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[r+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(li.geometry=this.geometry,li.material=this.material,li.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ci.copy(this.boundingSphere),ci.applyMatrix4(n),e.ray.intersectsSphere(ci)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Nn),Sl.multiplyMatrices(n,Nn),li.matrixWorld=Sl,li.raycast(e,fs);for(let r=0,a=fs.length;r<a;r++){let o=fs[r];o.instanceId=s,o.object=this,t.push(o)}fs.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ke(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Tt(new Float32Array(i*this.count),i,this.count,Jl,qs));let s=this.morphTexture.source.data.data,r=0;for(let l=0;l<n.length;l++)r+=n[l];let a=this.geometry.morphTargetsRelative?1:1-r,o=i*e;return s[o]=a,s.set(n,o+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},$t=new Ie,Yh=new B(.5,.5),ps=new M,Ps=class{constructor(e=new rt,t=new rt,n=new rt,i=new rt,s=new rt,r=new rt){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Vt,n=!1){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],d=s[6],f=s[7],p=s[8],m=s[9],x=s[10],v=s[11],_=s[12],b=s[13],y=s[14],w=s[15];if(i[0].setComponents(l-r,f-c,v-p,w-_).normalize(),i[1].setComponents(l+r,f+c,v+p,w+_).normalize(),i[2].setComponents(l+a,f+u,v+m,w+b).normalize(),i[3].setComponents(l-a,f-u,v-m,w-b).normalize(),n)i[4].setComponents(o,d,x,y).normalize(),i[5].setComponents(l-o,f-d,v-x,w-y).normalize();else if(i[4].setComponents(l-o,f-d,v-x,w-y).normalize(),t===Vt)i[5].setComponents(l+o,f+d,v+x,w+y).normalize();else if(t===mi)i[5].setComponents(o,d,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$t.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$t.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($t)}intersectsSprite(e){$t.center.set(0,0,0);let t=Yh.distanceTo(e.center);return $t.radius=.7071067811865476+t,$t.applyMatrix4(e.matrixWorld),this.intersectsSphere($t)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(ps.x=i.normal.x>0?e.max.x:e.min.x,ps.y=i.normal.y>0?e.max.y:e.min.y,ps.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ps)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Hn=class extends Pe{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new R(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ls=new M,Ns=new M,Al=new U,hi=new Xt,ms=new Ie,ca=new M,Tl=new M,an=class extends ce{constructor(e=new J,t=new Hn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Ls.fromBufferAttribute(t,i-1),Ns.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ls.distanceTo(Ns);e.setAttribute("lineDistance",new te(n,1))}else ie("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ms.copy(n.boundingSphere),ms.applyMatrix4(i),ms.radius+=s,e.ray.intersectsSphere(ms)===!1)return;Al.copy(i).invert(),hi.copy(e.ray).applyMatrix4(Al);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=this.isLineSegments?2:1,c=n.index,d=n.attributes.position;if(c!==null){let f=Math.max(0,r.start),p=Math.min(c.count,r.start+r.count);for(let m=f,x=p-1;m<x;m+=l){let v=c.getX(m),_=c.getX(m+1),b=gs(this,e,hi,o,v,_,m);b&&t.push(b)}if(this.isLineLoop){let m=c.getX(p-1),x=c.getX(f),v=gs(this,e,hi,o,m,x,p-1);v&&t.push(v)}}else{let f=Math.max(0,r.start),p=Math.min(d.count,r.start+r.count);for(let m=f,x=p-1;m<x;m+=l){let v=gs(this,e,hi,o,m,m+1,m);v&&t.push(v)}if(this.isLineLoop){let m=gs(this,e,hi,o,p-1,f,p-1);m&&t.push(m)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function gs(h,e,t,n,i,s,r){let a=h.geometry.attributes.position;if(Ls.fromBufferAttribute(a,i),Ns.fromBufferAttribute(a,s),t.distanceSqToSegment(Ls,Ns,ca,Tl)>n)return;ca.applyMatrix4(h.matrixWorld);let l=e.ray.origin.distanceTo(ca);if(!(l<e.near||l>e.far))return{distance:l,point:Tl.clone().applyMatrix4(h.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:h}}var El=new M,Rl=new M,yi=class extends an{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)El.fromBufferAttribute(t,i),Rl.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+El.distanceTo(Rl);e.setAttribute("lineDistance",new te(n,1))}else ie("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Mi=class extends an{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},qt=class extends Pe{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new R(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Cl=new U,Sa=new Xt,xs=new Ie,vs=new M,Qe=class extends ce{constructor(e=new J,t=new qt){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),xs.copy(n.boundingSphere),xs.applyMatrix4(i),xs.radius+=s,e.ray.intersectsSphere(xs)===!1)return;Cl.copy(i).invert(),Sa.copy(e.ray).applyMatrix4(Cl);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,r.start),f=Math.min(l.count,r.start+r.count);for(let p=d,m=f;p<m;p++){let x=l.getX(p);vs.fromBufferAttribute(u,x),Il(vs,x,o,i,e,t,this)}}else{let d=Math.max(0,r.start),f=Math.min(u.count,r.start+r.count);for(let p=d,m=f;p<m;p++)vs.fromBufferAttribute(u,p),Il(vs,p,o,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Il(h,e,t,n,i,s,r){let a=Sa.distanceSqToPoint(h);if(a<t){let o=new M;Sa.closestPointToPoint(h,o),o.applyMatrix4(n);let l=i.ray.origin.distanceTo(o);if(l<i.near||l>i.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:o,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}var ze=class extends He{constructor(e,t,n,i,s,r,a,o,l){super(e,t,n,i,s,r,a,o,l),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ye=class h extends J{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let a=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let o=[],l=[],c=[],u=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,r,s,0),p("z","y","x",1,-1,n,t,-e,r,s,1),p("x","z","y",1,1,e,n,t,i,r,2),p("x","z","y",1,-1,e,n,-t,i,r,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new te(l,3)),this.setAttribute("normal",new te(c,3)),this.setAttribute("uv",new te(u,2));function p(m,x,v,_,b,y,w,T,A,S,E){let C=y/A,I=w/S,P=y/2,L=w/2,F=T/2,D=A+1,G=S+1,K=0,j=0,V=new M;for(let W=0;W<G;W++){let $=W*I-L;for(let he=0;he<D;he++){let ue=he*C-P;V[m]=ue*_,V[x]=$*b,V[v]=F,l.push(V.x,V.y,V.z),V[m]=0,V[x]=0,V[v]=T>0?1:-1,c.push(V.x,V.y,V.z),u.push(he/A),u.push(1-W/S),K+=1}}for(let W=0;W<S;W++)for(let $=0;$<A;$++){let he=d+$+D*W,ue=d+$+D*(W+1),ee=d+($+1)+D*(W+1),k=d+($+1)+D*W;o.push(he,ue,k),o.push(ue,ee,k),j+=6}a.addGroup(f,j,E),f+=j,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var lt=class h extends J{constructor(e=1,t=1,n=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o};let l=this;i=Math.floor(i),s=Math.floor(s);let c=[],u=[],d=[],f=[],p=0,m=[],x=n/2,v=0;_(),r===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(c),this.setAttribute("position",new te(u,3)),this.setAttribute("normal",new te(d,3)),this.setAttribute("uv",new te(f,2));function _(){let y=new M,w=new M,T=0,A=(t-e)/n;for(let S=0;S<=s;S++){let E=[],C=S/s,I=C*(t-e)+e;for(let P=0;P<=i;P++){let L=P/i,F=L*o+a,D=Math.sin(F),G=Math.cos(F);w.x=I*D,w.y=-C*n+x,w.z=I*G,u.push(w.x,w.y,w.z),y.set(D,A,G).normalize(),d.push(y.x,y.y,y.z),f.push(L,1-C),E.push(p++)}m.push(E)}for(let S=0;S<i;S++)for(let E=0;E<s;E++){let C=m[E][S],I=m[E+1][S],P=m[E+1][S+1],L=m[E][S+1];(e>0||E!==0)&&(c.push(C,I,L),T+=3),(t>0||E!==s-1)&&(c.push(I,P,L),T+=3)}l.addGroup(v,T,0),v+=T}function b(y){let w=p,T=new B,A=new M,S=0,E=y===!0?e:t,C=y===!0?1:-1;for(let P=1;P<=i;P++)u.push(0,x*C,0),d.push(0,C,0),f.push(.5,.5),p++;let I=p;for(let P=0;P<=i;P++){let F=P/i*o+a,D=Math.cos(F),G=Math.sin(F);A.x=E*G,A.y=x*C,A.z=E*D,u.push(A.x,A.y,A.z),d.push(0,C,0),T.x=D*.5+.5,T.y=G*.5*C+.5,f.push(T.x,T.y),p++}for(let P=0;P<i;P++){let L=w+P,F=I+P;y===!0?c.push(F,F+1,L):c.push(F+1,F,L),S+=3}l.addGroup(v,S,y===!0?1:2),v+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Si=class h extends J{constructor(e=[new B(0,-.5),new B(.5,0),new B(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=X(i,0,Math.PI*2);let s=[],r=[],a=[],o=[],l=[],c=1/t,u=new M,d=new B,f=new M,p=new M,m=new M,x=0,v=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:x=e[_+1].x-e[_].x,v=e[_+1].y-e[_].y,f.x=v*1,f.y=-x,f.z=v*0,m.copy(f),f.normalize(),o.push(f.x,f.y,f.z);break;case e.length-1:o.push(m.x,m.y,m.z);break;default:x=e[_+1].x-e[_].x,v=e[_+1].y-e[_].y,f.x=v*1,f.y=-x,f.z=v*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),o.push(f.x,f.y,f.z),m.copy(p)}for(let _=0;_<=t;_++){let b=n+_*c*i,y=Math.sin(b),w=Math.cos(b);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*y,u.y=e[T].y,u.z=e[T].x*w,r.push(u.x,u.y,u.z),d.x=_/t,d.y=T/(e.length-1),a.push(d.x,d.y);let A=o[3*T+0]*y,S=o[3*T+1],E=o[3*T+0]*w;l.push(A,S,E)}}for(let _=0;_<t;_++)for(let b=0;b<e.length-1;b++){let y=b+_*e.length,w=y,T=y+e.length,A=y+e.length+1,S=y+1;s.push(w,T,S),s.push(A,S,T)}this.setIndex(s),this.setAttribute("position",new te(r,3)),this.setAttribute("uv",new te(a,2)),this.setAttribute("normal",new te(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.points,e.segments,e.phiStart,e.phiLength)}};var Et=class h extends J{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,a=Math.floor(n),o=Math.floor(i),l=a+1,c=o+1,u=e/a,d=t/o,f=[],p=[],m=[],x=[];for(let v=0;v<c;v++){let _=v*d-r;for(let b=0;b<l;b++){let y=b*u-s;p.push(y,-_,0),m.push(0,0,1),x.push(b/a),x.push(1-v/o)}}for(let v=0;v<o;v++)for(let _=0;_<a;_++){let b=_+l*v,y=_+l*(v+1),w=_+1+l*(v+1),T=_+1+l*v;f.push(b,y,T),f.push(y,w,T)}this.setIndex(f),this.setAttribute("position",new te(p,3)),this.setAttribute("normal",new te(m,3)),this.setAttribute("uv",new te(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.width,e.height,e.widthSegments,e.heightSegments)}};var Ve=class h extends J{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:r,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let o=Math.min(r+a,Math.PI),l=0,c=[],u=new M,d=new M,f=[],p=[],m=[],x=[];for(let v=0;v<=n;v++){let _=[],b=v/n,y=r+b*a,w=e*Math.cos(y),T=Math.sqrt(e*e-w*w),A=0;v===0&&r===0?A=.5/t:v===n&&o===Math.PI&&(A=-.5/t);for(let S=0;S<=t;S++){let E=S/t,C=i+E*s;u.x=-T*Math.cos(C),u.y=w,u.z=T*Math.sin(C),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),x.push(E+A,1-b),_.push(l++)}c.push(_)}for(let v=0;v<n;v++)for(let _=0;_<t;_++){let b=c[v][_+1],y=c[v][_],w=c[v+1][_],T=c[v+1][_+1];(v!==0||r>0)&&f.push(b,y,T),(v!==n-1||o<Math.PI)&&f.push(y,w,T)}this.setIndex(f),this.setAttribute("position",new te(p,3)),this.setAttribute("normal",new te(m,3)),this.setAttribute("uv",new te(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new h(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function $a(h){let e={};for(let t in h){e[t]={};for(let n in h[t]){let i=h[t][n];if(Pl(i))i.isRenderTargetTexture?(ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Pl(i[0])){let s=[];for(let r=0,a=i.length;r<a;r++)s[r]=i[r].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Ce(h){let e={};for(let t=0;t<h.length;t++){let n=$a(h[t]);for(let i in n)e[i]=n[i]}return e}function Pl(h){return h&&(h.isColor||h.isMatrix3||h.isMatrix4||h.isVector2||h.isVector3||h.isVector4||h.isTexture||h.isQuaternion)}function Kh(h){let e=[];for(let t=0;t<h.length;t++)e.push(h[t].clone());return e}var Zh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,et=class extends Pe{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zh,this.fragmentShader=jh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$a(e.uniforms),this.uniformsGroups=Kh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;r&&r.isTexture?t.uniforms[i]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[i]={type:"m4",value:r.toArray()}:t.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new R().setHex(i.value);break;case"v2":this.uniforms[n].value=new B().fromArray(i.value);break;case"v3":this.uniforms[n].value=new M().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ee().fromArray(i.value);break;case"m3":this.uniforms[n].value=new z().fromArray(i.value);break;case"m4":this.uniforms[n].value=new U().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}};var me=class extends Pe{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new R(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new R(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ya,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ot,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Le=class extends me{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new B(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return X(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new R(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new R(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new R(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var tt=class extends Pe{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new R(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new R(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ya,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ot,this.combine=Xs,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function Ht(h,e){return!h||h.constructor===e?h:typeof e.BYTES_PER_ELEMENT=="number"?new e(h):Array.prototype.slice.call(h)}function ws(h){return h!==void 0&&h.inTangents!==void 0&&h.outTangents!==void 0}function Jh(h){function e(i,s){return h[i]-h[s]}let t=h.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Ll(h,e,t){let n=h.length,i=new h.constructor(n);for(let s=0,r=0;r!==n;++s){let a=t[s]*e;for(let o=0;o!==e;++o)i[r++]=h[a+o]}return i}function $h(h,e,t,n){let i=1,s=h[0];for(;s!==void 0&&s[n]===void 0;)s=h[i++];if(s===void 0)return;let r=s[n];if(r!==void 0)if(Array.isArray(r))do r=s[n],r!==void 0&&(e.push(s.time),t.push(...r)),s=h[i++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[n],r!==void 0&&(e.push(s.time),r.toArray(t,t.length)),s=h[i++];while(s!==void 0);else do r=s[n],r!==void 0&&(e.push(s.time),t.push(r)),s=h[i++];while(s!==void 0)}var ct=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let r;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break t}r=t.length;break n}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=t[--n-1],e>=s)break t}r=n,n=0;break n}break e}for(;n<r;){let a=n+r>>>1;e<t[a]?r=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ds=class extends ct{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:en,endingEnd:en}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,a=i[s],o=i[r];if(a===void 0)switch(this.getSettings_().endingStart){case tn:s=e,a=2*t-n;break;case pi:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(o===void 0)switch(this.getSettings_().endingEnd){case tn:r=e,o=2*n-t;break;case pi:r=1,o=n+i[1]-i[0];break;default:r=e-1,o=t}let l=(n-t)*.5,c=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(o-n),this._offsetPrev=s*c,this._offsetNext=r*c}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),m=p*p,x=m*p,v=-d*x+2*d*m-d*p,_=(1+d)*x+(-1.5-2*d)*m+(-.5+d)*p+1,b=(-1-f)*x+(1.5+f)*m+.5*p,y=f*x-f*m;for(let w=0;w!==a;++w)s[w]=v*r[c+w]+_*r[l+w]+b*r[o+w]+y*r[u+w];return s}},wi=class extends ct{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=(n-t)/(i-t),u=1-c;for(let d=0;d!==a;++d)s[d]=r[l+d]*u+r[o+d]*c;return s}},Us=class extends ct{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Fs=class extends ct{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,c=this.inTangents,u=this.outTangents;if(!c||!u){let p=(n-t)/(i-t),m=1-p;for(let x=0;x!==a;++x)s[x]=r[l+x]*m+r[o+x]*p;return s}let d=a*2,f=e-1;for(let p=0;p!==a;++p){let m=r[l+p],x=r[o+p],v=f*d+p*2,_=u[v],b=u[v+1],y=e*d+p*2,w=c[y],T=c[y+1],A=eu(n,t,_,w,i);s[p]=ac(A,m,b,T,x)}return s}};function ac(h,e,t,n,i){let s=1-h;return s*s*s*e+3*s*s*h*t+3*s*h*h*n+h*h*h*i}function Qh(h,e,t,n,i){let s=1-h;return 3*s*s*(t-e)+6*s*h*(n-t)+3*h*h*(i-n)}function eu(h,e,t,n,i){let s=(h-e)/(i-e);for(let r=0;r<8;r++){let a=ac(s,e,t,n,i)-h;if(Math.abs(a)<1e-10)break;let o=Qh(s,e,t,n,i);if(Math.abs(o)<1e-10)break;s=Math.max(0,Math.min(1,s-a/o))}return s}var Ne=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ht(t,this.TimeBufferType),this.values=Ht(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ht(e.times,Array),values:Ht(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),ws(e.settings)&&(n.settings={inTangents:Ht(e.settings.inTangents,Array),outTangents:Ht(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Us(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new wi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ds(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Fs(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case nn:t=this.InterpolantFactoryMethodDiscrete;break;case sn:t=this.InterpolantFactoryMethodLinear;break;case ys:t=this.InterpolantFactoryMethodSmooth;break;case ba:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ie("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return nn;case this.InterpolantFactoryMethodLinear:return sn;case this.InterpolantFactoryMethodSmooth:return ys;case this.InterpolantFactoryMethodBezier:return ba}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;ws(this.settings)&&(Nl(this.settings.inTangents,e),Nl(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;for(;s!==i&&n[s]<e;)++s;for(;r!==-1&&n[r]>t;)--r;if(++r,s!==0||r!==i){s>=r&&(r=Math.max(r,1),s=r-1);let a=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*a,r*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(oe("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(oe("KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let a=0;a!==s;a++){let o=n[a];if(typeof o=="number"&&isNaN(o)){oe("KeyframeTrack: Time is not a valid number.",this,a,o),e=!1;break}if(r!==null&&r>o){oe("KeyframeTrack: Out of order keys.",this,a,o,r),e=!1;break}r=o}if(i!==void 0&&hh(i))for(let a=0,o=i.length;a!==o;++a){let l=i[a];if(isNaN(l)){oe("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ys,s=e.length-1,r=1;for(let a=1;a<s;++a){let o=!1,l=e[a],c=e[a+1];if(l!==c&&(a!==1||l!==e[0]))if(i)o=!0;else{let u=a*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){let m=t[u+p];if(m!==t[d+p]||m!==t[f+p]){o=!0;break}}}if(o){if(a!==r){e[r]=e[a];let u=a*n,d=r*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++r}}if(s>0){e[r]=e[s];for(let a=s*n,o=r*n,l=0;l!==n;++l)t[o+l]=t[a+l];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,ws(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Nl(h,e){for(let t=0,n=h.length;t!==n;t+=2)h[t]*=e}Ne.prototype.ValueTypeName="";Ne.prototype.TimeBufferType=Float32Array;Ne.prototype.ValueBufferType=Float32Array;Ne.prototype.DefaultInterpolation=sn;var Rt=class extends Ne{constructor(e,t,n){super(e,t,n)}};Rt.prototype.ValueTypeName="bool";Rt.prototype.ValueBufferType=Array;Rt.prototype.DefaultInterpolation=nn;Rt.prototype.InterpolantFactoryMethodLinear=void 0;Rt.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends Ne{constructor(e,t,n,i){super(e,t,n,i)}};Ai.prototype.ValueTypeName="color";var Ct=class extends Ne{constructor(e,t,n,i){super(e,t,n,i)}};Ct.prototype.ValueTypeName="number";var Os=class extends ct{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=(n-t)/(i-t),l=e*a;for(let c=l+a;l!==c;l+=4)re.slerpFlat(s,0,r,l-a,r,l,o);return s}},It=class extends Ne{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Os(this.times,this.values,this.getValueSize(),e)}};It.prototype.ValueTypeName="quaternion";It.prototype.InterpolantFactoryMethodSmooth=void 0;var Pt=class extends Ne{constructor(e,t,n){super(e,t,n)}};Pt.prototype.ValueTypeName="string";Pt.prototype.ValueBufferType=Array;Pt.prototype.DefaultInterpolation=nn;Pt.prototype.InterpolantFactoryMethodLinear=void 0;Pt.prototype.InterpolantFactoryMethodSmooth=void 0;var Yt=class extends Ne{constructor(e,t,n,i){super(e,t,n,i)}};Yt.prototype.ValueTypeName="vector";var on=class{constructor(e="",t=-1,n=[],i=Ys){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=$e(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,a=n.length;r!==a;++r)t.push(nu(n[r]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)t.push(Ne.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,r=[];for(let a=0;a<s;a++){let o=[],l=[];o.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);let c=Jh(o);o=Ll(o,1,c),l=Ll(l,1,c),!i&&o[0]===0&&(o.push(s),l.push(l[0])),r.push(new Ct(".morphTargetInfluences["+t[a].name+"]",o,l).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,o=e.length;a<o;a++){let l=e[a],c=l.name.match(s);if(c&&c.length>1){let u=c[1],d=i[u];d||(i[u]=d=[]),d.push(l)}}let r=[];for(let a in i)r.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return r}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function tu(h){switch(h.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ct;case"vector":case"vector2":case"vector3":case"vector4":return Yt;case"color":return Ai;case"quaternion":return It;case"bool":case"boolean":return Rt;case"string":return Pt}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+h)}function nu(h){if(h.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=tu(h.type);if(h.times===void 0){let n=[],i=[];$h(h.keys,n,i,"value"),h.times=n,h.values=i}let t;return e.parse!==void 0?t=e.parse(h):t=new e(h.name,h.times,h.values,h.interpolation),ws(h.settings)&&(t.settings={inTangents:Ht(h.settings.inTangents,Float32Array),outTangents:Ht(h.settings.outTangents,Float32Array)}),t}var at={enabled:!1,files:{},add:function(h,e){this.enabled!==!1&&(Dl(h)||(this.files[h]=e))},get:function(h){if(this.enabled!==!1&&!Dl(h))return this.files[h]},remove:function(h){delete this.files[h]},clear:function(){this.files={}}};function Dl(h){try{let e=h.slice(h.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Bs=class{constructor(e,t,n){let i=this,s=!1,r=0,a=0,o,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(c){a++,s===!1&&i.onStart!==void 0&&i.onStart(c,r,a),s=!0},this.itemEnd=function(c){r++,i.onProgress!==void 0&&i.onProgress(c,r,a),r===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(c){i.onError!==void 0&&i.onError(c)},this.resolveURL=function(c){return c=c.normalize("NFC"),o?o(c):c},this.setURLModifier=function(c){return o=c,this},this.addHandler=function(c,u){return l.push(c,u),this},this.removeHandler=function(c){let u=l.indexOf(c);return u!==-1&&l.splice(u,2),this},this.getHandler=function(c){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],p=l[u+1];if(f.global&&(f.lastIndex=0),f.test(c))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},oc=new Bs,ht=class{constructor(e){this.manager=e!==void 0?e:oc,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ht.DEFAULT_MATERIAL_NAME="__DEFAULT";var yt={},wa=class extends Error{constructor(e,t){super(e),this.response=t}},Vn=class extends ht{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=at.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(yt[e]!==void 0){yt[e].push({onLoad:t,onProgress:n,onError:i});return}yt[e]=[],yt[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,o=this.responseType;fetch(r).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&ie("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let c=yt[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,m=0,x=new ReadableStream({start(v){_();function _(){u.read().then(({done:b,value:y})=>{if(b)v.close();else{m+=y.byteLength;let w=new ProgressEvent("progress",{lengthComputable:p,loaded:m,total:f});for(let T=0,A=c.length;T<A;T++){let S=c[T];S.onProgress&&S.onProgress(w)}v.enqueue(y),_()}},b=>{v.error(b)})}}});return new Response(x)}else throw new wa(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(o){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(c=>new DOMParser().parseFromString(c,a));case"json":return l.json();default:if(a==="")return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(p=>f.decode(p))}}}).then(l=>{at.add(`file:${e}`,l);let c=yt[e];delete yt[e];for(let u=0,d=c.length;u<d;u++){let f=c[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{let c=yt[e];if(c===void 0)throw this.manager.itemError(e),l;delete yt[e];for(let u=0,d=c.length;u<d;u++){let f=c[u];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Dn=new WeakMap,ks=class extends ht{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=at.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);else{let u=Dn.get(r);u===void 0&&(u=[],Dn.set(r,u)),u.push({onLoad:t,onError:i})}return r}let a=Ts("img");function o(){c(),t&&t(this);let u=Dn.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Dn.delete(this),s.manager.itemEnd(e)}function l(u){c(),i&&i(u),at.remove(`image:${e}`);let d=Dn.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(u)}Dn.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function c(){a.removeEventListener("load",o,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",o,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),at.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}};var Ti=class extends ht{constructor(e){super(e)}load(e,t,n,i){let s=new He,r=new ks(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},ln=class extends ce{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new R(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var ha=new U,Ul=new M,Fl=new M,Wn=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new U,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ps,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ul.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ul),Fl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fl),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){ha.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(ha,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,a=i?i.w/s.y:1,o=i?i.x/s.x:0,l=i?i.y/s.y:0;e.coordinateSystem===mi||e.reversedDepth?t.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):t.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),t.multiply(ha)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},_s=new M,bs=new re,st=new M,Ei=class extends ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new U,this.projectionMatrix=new U,this.projectionMatrixInverse=new U,this.coordinateSystem=Vt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(_s,bs,st),st.x===1&&st.y===1&&st.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_s,bs,st.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(_s,bs,st),st.x===1&&st.y===1&&st.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_s,bs,st.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Gt=new M,Ol=new B,Bl=new B,cn=class extends Ei{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=kn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ui*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return kn*2*Math.atan(Math.tan(ui*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Gt.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Gt.x,Gt.y).multiplyScalar(-e/Gt.z),Gt.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Gt.x,Gt.y).multiplyScalar(-e/Gt.z)}getViewSize(e,t){return this.getViewBounds(e,Ol,Bl),t.subVectors(Bl,Ol)}setViewOffset(e,t,n,i,s,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ui*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let o=r.fullWidth,l=r.fullHeight;s+=r.offsetX*i/o,t-=r.offsetY*n/l,i*=r.width/o,n*=r.height/l}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Aa=class extends Wn{constructor(){super(new cn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=kn*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},hn=class extends ln{constructor(e,t,n=0,i=Math.PI/3,s=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.target=new ce,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new Aa}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Ta=class extends Wn{constructor(){super(new cn(90,1,.5,500)),this.isPointLightShadow=!0}},un=class extends ln{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ta}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Xn=class extends Ei{constructor(e=-1,t=1,n=1,i=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,c=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,r=s+l*this.view.width,a-=c*this.view.offsetY,o=a-c*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ea=class extends Wn{constructor(){super(new Xn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ri=class extends ln{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.target=new ce,this.shadow=new Ea}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ci=class extends ln{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Lt=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var ua=new WeakMap,Ii=class extends ht{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ie("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ie("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=at.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then(l=>{ua.has(r)===!0?(i&&i(ua.get(r)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(l),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(l){return at.add(`image-bitmap:${e}`,l),t&&t(l),s.manager.itemEnd(e),l}).catch(function(l){i&&i(l),ua.set(o,l),at.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});at.add(`image-bitmap:${e}`,o),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var zs=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,r;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,r=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,r=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,r=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=r,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,r=this.cumulativeWeight;if(r===0){for(let a=0;a!==i;++a)n[s+a]=n[a];r=t}else{r+=t;let a=t/r;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=r}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,r=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let o=t*this._origIndex;this._mixBufferRegion(n,i,o,1-s,t)}r>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let o=t,l=t+t;o!==l;++o)if(n[o]!==n[o+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,r=i;s!==r;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let r=0;r!==s;++r)e[t+r]=e[n+r]}_slerp(e,t,n,i){re.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let r=this._workIndex*s;re.multiplyQuaternionsFlat(e,r,e,t,e,n),re.slerpFlat(e,t,e,t,e,r,i)}_lerp(e,t,n,i,s){let r=1-i;for(let a=0;a!==s;++a){let o=t+a;e[o]=e[o]*r+e[n+a]*i}}_lerpAdditive(e,t,n,i,s){for(let r=0;r!==s;++r){let a=t+r;e[a]=e[a]+e[n+r]*i}}},Qa="\\[\\]\\.:\\/",iu=new RegExp("["+Qa+"]","g"),eo="[^"+Qa+"]",su="[^"+Qa.replace("\\.","")+"]",ru=/((?:WC+[\/:])*)/.source.replace("WC",eo),au=/(WCOD+)?/.source.replace("WCOD",su),ou=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",eo),lu=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",eo),cu=new RegExp("^"+ru+au+ou+lu+"$"),hu=["material","materials","bones","map"],Ra=class{constructor(e,t,n){let i=n||se.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},se=class h{constructor(e,t,n){this.path=t,this.parsedPath=n||h.parseTrackName(t),this.node=h.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new h.Composite(e,t,n):new h(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(iu,"")}static parseTrackName(e){let t=cu.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);hu.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let a=s[r];if(a.name===t||a.uuid===t)return a;let o=n(a.children);if(o)return o}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=h.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){oe("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){oe("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let c=0;c<e.length;c++)if(e[c].name===l){l=c;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){oe("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){oe("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){oe("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){oe("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let r=e[i];if(r===void 0){let l=t.nodeName;oe("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){oe("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}o=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(o=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(o=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};se.Composite=Ra;se.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};se.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};se.prototype.GetterByBindingType=[se.prototype._getValue_direct,se.prototype._getValue_array,se.prototype._getValue_arrayElement,se.prototype._getValue_toArray];se.prototype.SetterByBindingTypeAndVersioning=[[se.prototype._setValue_direct,se.prototype._setValue_direct_setNeedsUpdate,se.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[se.prototype._setValue_array,se.prototype._setValue_array_setNeedsUpdate,se.prototype._setValue_array_setMatrixWorldNeedsUpdate],[se.prototype._setValue_arrayElement,se.prototype._setValue_arrayElement_setNeedsUpdate,se.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[se.prototype._setValue_fromArray,se.prototype._setValue_fromArray_setNeedsUpdate,se.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Gs=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,r=s.length,a=new Array(r),o={endingStart:en,endingEnd:en};for(let l=0;l!==r;++l){let c=s[l].createInterpolant(null);a[l]=c,c.settings=o}this._interpolantSettings=o,this._interpolants=a,this._propertyBindings=new Array(r),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Ql,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,r=s/i,a=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,r,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,r=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let o=a.parameterPositions,l=a.sampleValues;return o[0]=s,o[1]=s+n,l[0]=e/r,l[1]=t/r,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let o=(e-s)*n;o<0||n===0?t=0:(this._startTime=null,t=n*o)}t*=this._updateTimeScale(e);let r=this._updateTime(t),a=this._updateWeight(e);if(a>0){let o=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case tc:for(let c=0,u=o.length;c!==u;++c)o[c].evaluate(r),l[c].accumulateAdditive(a);break;case Ys:default:for(let c=0,u=o.length;c!==u;++c)o[c].evaluate(r),l[c].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,r=n===ec;if(e===0)return s===-1?i:r&&(s&1)===1?t-i:i;if(n===$l){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,r)):this._setEndings(this.repetitions===0,!0,r)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,s+=Math.abs(a);let o=this.repetitions-s;if(o<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(o===1){let l=e<0;this._setEndings(l,!l,r)}else this._setEndings(!1,!1,r);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this._loopCount=s,this.time=i;if(r&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=tn,i.endingEnd=tn):(e?i.endingStart=this.zeroSlopeAtStart?tn:en:i.endingStart=pi,t?i.endingEnd=this.zeroSlopeAtEnd?tn:en:i.endingEnd=pi)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,r=this._weightInterpolant;r===null&&(r=i._lendControlInterpolant(),this._weightInterpolant=r);let a=r.parameterPositions,o=r.sampleValues;return a[0]=s,o[0]=t,a[1]=s+e,o[1]=n,this}},uu=new Float32Array(1),Pi=class extends At{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,r=e._propertyBindings,a=e._interpolants,o=n.uuid,l=this._bindingsByRootAndName,c=l[o];c===void 0&&(c={},l[o]=c);for(let u=0;u!==s;++u){let d=i[u],f=d.name,p=c[f];if(p!==void 0)++p.referenceCount,r[u]=p;else{if(p=r[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,o,f));continue}let m=t&&t._propertyBindings[u].binding.parsedPath;p=new zs(se.create(n,f,m),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,o,f),r[u]=p}a[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,r=s[t];if(r===void 0)r={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=r;else{let a=r.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),r.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,r=this._actionsByClip,a=r[s],o=a.knownActions,l=o[o.length-1],c=e._byClipCacheIndex;l._byClipCacheIndex=c,o[c]=l,o.pop(),e._byClipCacheIndex=null;let u=a.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],o.length===0&&delete r[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,r=i[t];r===void 0&&(r={},i[t]=r),r[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,r=this._bindingsByRootAndName,a=r[i],o=t[t.length-1],l=e._cacheIndex;o._cacheIndex=l,t[l]=o,t.pop(),delete a[s],Object.keys(a).length===0&&delete r[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new wi(new Float32Array(2),new Float32Array(2),1,uu),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,r=typeof e=="string"?on.findByName(i,e):e,a=r!==null?r.uuid:e,o=this._actionsByClip[a],l=null;if(n===void 0&&(r!==null?n=r.blendMode:n=Ys),o!==void 0){let u=o.actionByRoot[s];if(u!==void 0&&u.blendMode===n)return u;l=o.knownActions[0],r===null&&(r=l._clip)}if(r===null)return null;let c=new Gs(this,r,t,n);return this._bindAction(c,l),this._addInactiveAction(c,a,s),c}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?on.findByName(n,e):e,r=s?s.uuid:e,a=this._actionsByClip[r];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),r=this._accuIndex^=1;for(let l=0;l!==n;++l)t[l]._update(i,e,s,r);let a=this._bindings,o=this._nActiveBindings;for(let l=0;l!==o;++l)a[l].apply(r);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let r=s.knownActions;for(let a=0,o=r.length;a!==o;++a){let l=r[a];this._deactivateAction(l);let c=l._cacheIndex,u=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,u._cacheIndex=c,t[c]=u,t.pop(),this._removeInactiveBindingsForAction(l)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let r in n){let a=n[r].actionByRoot,o=a[t];o!==void 0&&(this._deactivateAction(o),this._removeInactiveAction(o))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let r in s){let a=s[r];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var kl=new U,Li=class{constructor(e,t,n=0,i=1/0){this.ray=new Xt(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new gi,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):oe("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return kl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(kl),this}intersectObject(e,t=!0,n=[]){return Ca(e,this,n,t),n.sort(zl),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)Ca(e[i],this,n,t);return n.sort(zl),n}};function zl(h,e){return h.distance-e.distance}function Ca(h,e,t,n){let i=!0;if(h.layers.test(e.layers)&&h.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=h.children;for(let r=0,a=s.length;r<a;r++)Ca(s[r],e,t,!0)}}var ro=class ro{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};ro.prototype.isMatrix2=!0;var Ia=ro;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");var du=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fu=`#ifdef USE_ALPHAHASH
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
#endif`,pu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,xu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vu=`#ifdef USE_AOMAP
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
#endif`,_u=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,bu=`#ifdef USE_BATCHING
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
#endif`,yu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Mu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Su=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wu=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Au=`#ifdef USE_IRIDESCENCE
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
#endif`,Tu=`#ifdef USE_BUMPMAP
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
#endif`,Eu=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ru=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Iu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Lu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Nu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Du=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Uu=`#define PI 3.141592653589793
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
} // validated`,Fu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ou=`vec3 transformedNormal = objectNormal;
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
#endif`,Bu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ku=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wu=`#ifdef USE_ENVMAP
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
#endif`,Xu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,qu=`#ifdef USE_ENVMAP
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
#endif`,Yu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ku=`#ifdef USE_ENVMAP
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
#endif`,Zu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ju=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ju=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$u=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qu=`#ifdef USE_GRADIENTMAP
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
}`,ed=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,td=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,nd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,id=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,sd=`#ifdef USE_ENVMAP
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
#endif`,rd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ad=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,od=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ld=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cd=`PhysicalMaterial material;
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
#endif`,hd=`uniform sampler2D dfgLUT;
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
}`,ud=`
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
#endif`,dd=`#if defined( RE_IndirectDiffuse )
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
#endif`,fd=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pd=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,md=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_d=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,bd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,yd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Md=`#if defined( USE_POINTS_UV )
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
#endif`,Sd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,wd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ad=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Td=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ed=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rd=`#ifdef USE_MORPHTARGETS
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
#endif`,Cd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Id=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Pd=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ld=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Ud=`#ifdef USE_NORMALMAP
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
#endif`,Fd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Od=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,kd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gd=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Hd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Yd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Kd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Zd=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Jd=`float getShadowMask() {
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
}`,$d=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qd=`#ifdef USE_SKINNING
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
#endif`,ef=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tf=`#ifdef USE_SKINNING
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
#endif`,nf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,af=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,of=`#ifdef USE_TRANSMISSION
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
#endif`,lf=`#ifdef USE_TRANSMISSION
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
#endif`,cf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,uf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,df=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ff=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pf=`uniform sampler2D t2D;
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
}`,mf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,xf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_f=`#include <common>
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
}`,bf=`#if DEPTH_PACKING == 3200
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
}`,yf=`#define DISTANCE
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
}`,Mf=`#define DISTANCE
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
}`,Sf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Af=`uniform float scale;
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
}`,Tf=`uniform vec3 diffuse;
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
}`,Ef=`#include <common>
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
}`,Rf=`uniform vec3 diffuse;
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
}`,Cf=`#define LAMBERT
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
}`,If=`#define LAMBERT
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
}`,Pf=`#define MATCAP
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
}`,Lf=`#define MATCAP
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
}`,Nf=`#define NORMAL
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
}`,Df=`#define NORMAL
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
}`,Uf=`#define PHONG
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
}`,Ff=`#define PHONG
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
}`,Of=`#define STANDARD
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
}`,Bf=`#define STANDARD
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
}`,kf=`#define TOON
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
}`,zf=`#define TOON
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
}`,Gf=`uniform float size;
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
}`,Hf=`uniform vec3 diffuse;
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
}`,Vf=`#include <common>
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
}`,Wf=`uniform vec3 color;
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
}`,Xf=`uniform float rotation;
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
}`,qf=`uniform vec3 diffuse;
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
}`,Y={alphahash_fragment:du,alphahash_pars_fragment:fu,alphamap_fragment:pu,alphamap_pars_fragment:mu,alphatest_fragment:gu,alphatest_pars_fragment:xu,aomap_fragment:vu,aomap_pars_fragment:_u,batching_pars_vertex:bu,batching_vertex:yu,begin_vertex:Mu,beginnormal_vertex:Su,bsdfs:wu,iridescence_fragment:Au,bumpmap_pars_fragment:Tu,clipping_planes_fragment:Eu,clipping_planes_pars_fragment:Ru,clipping_planes_pars_vertex:Cu,clipping_planes_vertex:Iu,color_fragment:Pu,color_pars_fragment:Lu,color_pars_vertex:Nu,color_vertex:Du,common:Uu,cube_uv_reflection_fragment:Fu,defaultnormal_vertex:Ou,displacementmap_pars_vertex:Bu,displacementmap_vertex:ku,emissivemap_fragment:zu,emissivemap_pars_fragment:Gu,colorspace_fragment:Hu,colorspace_pars_fragment:Vu,envmap_fragment:Wu,envmap_common_pars_fragment:Xu,envmap_pars_fragment:qu,envmap_pars_vertex:Yu,envmap_physical_pars_fragment:sd,envmap_vertex:Ku,fog_vertex:Zu,fog_pars_vertex:ju,fog_fragment:Ju,fog_pars_fragment:$u,gradientmap_pars_fragment:Qu,lightmap_pars_fragment:ed,lights_lambert_fragment:td,lights_lambert_pars_fragment:nd,lights_pars_begin:id,lights_toon_fragment:rd,lights_toon_pars_fragment:ad,lights_phong_fragment:od,lights_phong_pars_fragment:ld,lights_physical_fragment:cd,lights_physical_pars_fragment:hd,lights_fragment_begin:ud,lights_fragment_maps:dd,lights_fragment_end:fd,lightprobes_pars_fragment:pd,logdepthbuf_fragment:md,logdepthbuf_pars_fragment:gd,logdepthbuf_pars_vertex:xd,logdepthbuf_vertex:vd,map_fragment:_d,map_pars_fragment:bd,map_particle_fragment:yd,map_particle_pars_fragment:Md,metalnessmap_fragment:Sd,metalnessmap_pars_fragment:wd,morphinstance_vertex:Ad,morphcolor_vertex:Td,morphnormal_vertex:Ed,morphtarget_pars_vertex:Rd,morphtarget_vertex:Cd,normal_fragment_begin:Id,normal_fragment_maps:Pd,normal_pars_fragment:Ld,normal_pars_vertex:Nd,normal_vertex:Dd,normalmap_pars_fragment:Ud,clearcoat_normal_fragment_begin:Fd,clearcoat_normal_fragment_maps:Od,clearcoat_pars_fragment:Bd,iridescence_pars_fragment:kd,opaque_fragment:zd,packing:Gd,premultiplied_alpha_fragment:Hd,project_vertex:Vd,dithering_fragment:Wd,dithering_pars_fragment:Xd,roughnessmap_fragment:qd,roughnessmap_pars_fragment:Yd,shadowmap_pars_fragment:Kd,shadowmap_pars_vertex:Zd,shadowmap_vertex:jd,shadowmask_pars_fragment:Jd,skinbase_vertex:$d,skinning_pars_vertex:Qd,skinning_vertex:ef,skinnormal_vertex:tf,specularmap_fragment:nf,specularmap_pars_fragment:sf,tonemapping_fragment:rf,tonemapping_pars_fragment:af,transmission_fragment:of,transmission_pars_fragment:lf,uv_pars_fragment:cf,uv_pars_vertex:hf,uv_vertex:uf,worldpos_vertex:df,background_vert:ff,background_frag:pf,backgroundCube_vert:mf,backgroundCube_frag:gf,cube_vert:xf,cube_frag:vf,depth_vert:_f,depth_frag:bf,distance_vert:yf,distance_frag:Mf,equirect_vert:Sf,equirect_frag:wf,linedashed_vert:Af,linedashed_frag:Tf,meshbasic_vert:Ef,meshbasic_frag:Rf,meshlambert_vert:Cf,meshlambert_frag:If,meshmatcap_vert:Pf,meshmatcap_frag:Lf,meshnormal_vert:Nf,meshnormal_frag:Df,meshphong_vert:Uf,meshphong_frag:Ff,meshphysical_vert:Of,meshphysical_frag:Bf,meshtoon_vert:kf,meshtoon_frag:zf,points_vert:Gf,points_frag:Hf,shadow_vert:Vf,shadow_frag:Wf,sprite_vert:Xf,sprite_frag:qf},N={common:{diffuse:{value:new R(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new z},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new z}},envmap:{envMap:{value:null},envMapRotation:{value:new z},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new z}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new z}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new z},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new z},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new z},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new z}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new z}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new z}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new R(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new M},probesMax:{value:new M},probesResolution:{value:new M}},points:{diffuse:{value:new R(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0},uvTransform:{value:new z}},sprite:{diffuse:{value:new R(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new z},alphaMap:{value:null},alphaMapTransform:{value:new z},alphaTest:{value:0}}},lc={basic:{uniforms:Ce([N.common,N.specularmap,N.envmap,N.aomap,N.lightmap,N.fog]),vertexShader:Y.meshbasic_vert,fragmentShader:Y.meshbasic_frag},lambert:{uniforms:Ce([N.common,N.specularmap,N.envmap,N.aomap,N.lightmap,N.emissivemap,N.bumpmap,N.normalmap,N.displacementmap,N.fog,N.lights,{emissive:{value:new R(0)},envMapIntensity:{value:1}}]),vertexShader:Y.meshlambert_vert,fragmentShader:Y.meshlambert_frag},phong:{uniforms:Ce([N.common,N.specularmap,N.envmap,N.aomap,N.lightmap,N.emissivemap,N.bumpmap,N.normalmap,N.displacementmap,N.fog,N.lights,{emissive:{value:new R(0)},specular:{value:new R(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Y.meshphong_vert,fragmentShader:Y.meshphong_frag},standard:{uniforms:Ce([N.common,N.envmap,N.aomap,N.lightmap,N.emissivemap,N.bumpmap,N.normalmap,N.displacementmap,N.roughnessmap,N.metalnessmap,N.fog,N.lights,{emissive:{value:new R(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag},toon:{uniforms:Ce([N.common,N.aomap,N.lightmap,N.emissivemap,N.bumpmap,N.normalmap,N.displacementmap,N.gradientmap,N.fog,N.lights,{emissive:{value:new R(0)}}]),vertexShader:Y.meshtoon_vert,fragmentShader:Y.meshtoon_frag},matcap:{uniforms:Ce([N.common,N.bumpmap,N.normalmap,N.displacementmap,N.fog,{matcap:{value:null}}]),vertexShader:Y.meshmatcap_vert,fragmentShader:Y.meshmatcap_frag},points:{uniforms:Ce([N.points,N.fog]),vertexShader:Y.points_vert,fragmentShader:Y.points_frag},dashed:{uniforms:Ce([N.common,N.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Y.linedashed_vert,fragmentShader:Y.linedashed_frag},depth:{uniforms:Ce([N.common,N.displacementmap]),vertexShader:Y.depth_vert,fragmentShader:Y.depth_frag},normal:{uniforms:Ce([N.common,N.bumpmap,N.normalmap,N.displacementmap,{opacity:{value:1}}]),vertexShader:Y.meshnormal_vert,fragmentShader:Y.meshnormal_frag},sprite:{uniforms:Ce([N.sprite,N.fog]),vertexShader:Y.sprite_vert,fragmentShader:Y.sprite_frag},background:{uniforms:{uvTransform:{value:new z},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Y.background_vert,fragmentShader:Y.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new z}},vertexShader:Y.backgroundCube_vert,fragmentShader:Y.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Y.cube_vert,fragmentShader:Y.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Y.equirect_vert,fragmentShader:Y.equirect_frag},distance:{uniforms:Ce([N.common,N.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Y.distance_vert,fragmentShader:Y.distance_frag},shadow:{uniforms:Ce([N.lights,N.fog,{color:{value:new R(0)},opacity:{value:1}}]),vertexShader:Y.shadow_vert,fragmentShader:Y.shadow_frag}};lc.physical={uniforms:Ce([lc.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new z},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new z},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new z},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new z},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new z},sheen:{value:0},sheenColor:{value:new R(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new z},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new z},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new z},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new z},attenuationDistance:{value:0},attenuationColor:{value:new R(0)},specularColor:{value:new R(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new z},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new z},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new z}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag};var Yf=new z;Yf.set(-1,0,0,0,1,0,0,0,1);var v_={[Da]:"LINEAR_TONE_MAPPING",[Ua]:"REINHARD_TONE_MAPPING",[Fa]:"CINEON_TONE_MAPPING",[Oa]:"ACES_FILMIC_TONE_MAPPING",[ka]:"AGX_TONE_MAPPING",[za]:"NEUTRAL_TONE_MAPPING",[Ba]:"CUSTOM_TONE_MAPPING"};var __=new Float32Array(16),b_=new Float32Array(9),y_=new Float32Array(4);var M_={[Da]:"Linear",[Ua]:"Reinhard",[Fa]:"Cineon",[Oa]:"ACESFilmic",[ka]:"AgX",[za]:"Neutral",[Ba]:"Custom"};var S_={[Gl]:"SHADOWMAP_TYPE_PCF",[Hl]:"SHADOWMAP_TYPE_VSM"};var w_={[Zl]:"ENVMAP_TYPE_CUBE",[Ha]:"ENVMAP_TYPE_CUBE",[jl]:"ENVMAP_TYPE_CUBE_UV"};var A_={[Ha]:"ENVMAP_MODE_REFRACTION"};var T_={[Xs]:"ENVMAP_BLENDING_MULTIPLY",[ql]:"ENVMAP_BLENDING_MIX",[Yl]:"ENVMAP_BLENDING_ADD"};var Kf=new z;Kf.set(-1,0,0,0,1,0,0,0,1);var E_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);var ao=Math.PI/180,cc=12.5*ao,hc=0,Zf=12.5/24,Xe=(h,e,t)=>{let n=Math.max(0,Math.min(1,(t-h)/(e-h)));return n*n*(3-2*n)};var jf=[[-18,.006,.011,.034],[-12,.008,.016,.05],[-8,.013,.028,.085],[-5,.022,.05,.14],[-2,.04,.085,.22],[0,.055,.12,.29],[3,.065,.15,.37],[7,.07,.165,.43],[15,.075,.18,.46],[30,.074,.18,.48],[90,.07,.175,.49]],Jf=[[-18,.03,.042,.085],[-12,.045,.05,.095],[-8,.14,.085,.1],[-5,.42,.19,.1],[-2,.78,.34,.12],[0,.95,.46,.18],[3,.98,.6,.32],[7,.82,.66,.5],[15,.6,.64,.7],[30,.5,.58,.7],[90,.46,.55,.69]],$f=[[-18,.03,.042,.085],[-12,.04,.05,.1],[-8,.06,.075,.15],[-5,.11,.12,.21],[-2,.2,.18,.27],[0,.29,.27,.34],[3,.35,.37,.46],[7,.37,.43,.54],[15,.4,.49,.63],[30,.4,.5,.65],[90,.42,.52,.67]],Qf=[[-12,0,0,0],[-8,.08,.035,.02],[-5,.25,.1,.035],[-2,.42,.18,.05],[0,.55,.26,.07],[3,.55,.32,.12],[7,.45,.33,.18],[15,.34,.3,.24],[30,.28,.27,.24],[90,.26,.26,.24]],ep=[[-10,0,0,0],[-6,.05,.03,.05],[-3,.13,.065,.09],[0,.11,.055,.07],[4,.03,.015,.015],[8,0,0,0]],tp=[[-18,.03,.036,.06],[-12,.04,.045,.075],[-8,.1,.075,.11],[-5,.38,.2,.21],[-2,.82,.38,.24],[0,1,.52,.3],[3,1.02,.7,.46],[7,1,.84,.68],[15,1,.97,.92],[30,1,1,.99],[90,1,1,1]],np=[[-18,.012,.018,.042],[-12,.016,.024,.055],[-8,.03,.036,.075],[-5,.06,.055,.1],[-2,.11,.085,.13],[0,.18,.14,.19],[3,.27,.23,.28],[7,.36,.35,.41],[15,.42,.46,.55],[30,.46,.5,.6],[90,.48,.52,.62]],ip=[[-1.2,0,0,0],[0,2.4,.7,.2],[3,5,2.4,.9],[8,8,5.6,3.4],[20,12,11,9.2],[90,14,13.4,12.4]],sp=[[-2,1,.36,.14],[0,1,.45,.2],[3,1,.58,.32],[8,1,.72,.48],[15,1,.81,.6],[25,1,.86,.68],[40,1,.9,.74]];function Ut(h,e,t){if(e<=h[0][0])return t.setRGB(h[0][1],h[0][2],h[0][3]);for(let i=1;i<h.length;i++){let s=h[i];if(e<=s[0]){let r=h[i-1],a=(e-r[0])/(s[0]-r[0]);return t.setRGB(r[1]+(s[1]-r[1])*a,r[2]+(s[2]-r[2])*a,r[3]+(s[3]-r[3])*a)}}let n=h[h.length-1];return t.setRGB(n[1],n[2],n[3])}function oo(){return{t:0,elev:0,elevDeg:0,east:0,north:0,up:1,day:1,night:0,stars:0,sunK:1,moonK:0,skyK:1,dusk:0,zenith:new R,horSun:new R,horAnti:new R,glow:new R,belt:new R,cloudLit:new R,cloudShade:new R,disc:new R,light:new R,fog:new R}}function uc(h,e=oo()){let t=(h%1+1)%1,n=(t-Zf)*Math.PI*2,i=Math.cos(hc),s=Math.sin(hc),r=Math.cos(cc),a=Math.sin(cc);e.east=-i*Math.sin(n),e.north=r*s-a*i*Math.cos(n),e.up=a*s+r*i*Math.cos(n),e.elev=e.up;let o=e.elevDeg=Math.asin(Math.max(-1,Math.min(1,e.up)))/ao;e.t=t,e.day=Xe(-9,4,o),e.night=1-e.day,e.stars=1-Xe(-14,-6,o);let l=1/(Math.max(0,Math.sin(Math.max(o,0)*ao))+.50572*Math.pow(Math.max(o,0)+6.07995,-1.6364));return e.sunK=Math.exp(-.11*(l-1))*Xe(-1.5,4,o),e.moonK=1-Xe(-12,-3,o),e.skyK=Xe(-10,12,o),e.dusk=Xe(-10,-1,o)*(1-Xe(4,16,o)),Ut(jf,o,e.zenith),Ut(Jf,o,e.horSun),Ut($f,o,e.horAnti),Ut(Qf,o,e.glow),Ut(ep,o,e.belt),Ut(tp,o,e.cloudLit),Ut(np,o,e.cloudShade),Ut(ip,o,e.disc),Ut(sp,o,e.light),e.fog.copy(e.horAnti).lerp(e.horSun,.3),e}var xe={value:0},gn={value:0},Zs={value:0};function rp(h=256){let e=49734321,t=()=>(e=e*1664525+1013904223>>>0,e/4294967296),n=l=>{let c=new Float32Array(l*l);for(let u=0;u<c.length;u++)c[u]=t();return c},i=l=>{let c=l.map(n),u=new Float32Array(h*h),d=1e9,f=-1e9;for(let p=0;p<h;p++)for(let m=0;m<h;m++){let x=0,v=.5,_=0;for(let b=0;b<l.length;b++){let y=l[b],w=c[b],T=m/h*y,A=p/h*y,S=Math.floor(T),E=Math.floor(A),C=T-S,I=A-E;C=C*C*(3-2*C),I=I*I*(3-2*I);let P=S%y,L=E%y,F=(S+1)%y,D=(E+1)%y,G=w[L*y+P],K=w[L*y+F],j=w[D*y+P],V=w[D*y+F];x+=v*((G+(K-G)*C)*(1-I)+(j+(V-j)*C)*I),_+=v,v*=.5}x/=_,u[p*h+m]=x,x<d&&(d=x),x>f&&(f=x)}for(let p=0;p<u.length;p++)u[p]=(u[p]-d)/(f-d);return u},s=i([5,10,20,40,80]),r=i([16,32,64,128]),a=new Uint8Array(h*h*4);for(let l=0;l<h*h;l++)a[l*4]=s[l]*255,a[l*4+1]=r[l]*255,a[l*4+2]=0,a[l*4+3]=255;let o=new Tt(a,h,h,mn,pn);return o.wrapS=o.wrapT=wt,o.magFilter=Dt,o.minFilter=fn,o.generateMipmaps=!0,o.needsUpdate=!0,o}function dc(){let h={uSun:{value:new M(0,1,0)},uMoon:{value:new M(0,1,0)},uSunXZ:{value:new B(1,0)},uCam:{value:new M},uZen:{value:new R},uHorS:{value:new R},uHorA:{value:new R},uGlow:{value:new R},uBelt:{value:new R},uDisc:{value:new R},uCLit:{value:new R},uCShade:{value:new R},uFog:{value:new R},uWind:{value:new Ee},uCover:{value:.58},uCloudAmt:{value:1},uMoonI:{value:0}},e=new et({uniforms:{...h,uNight:xe,uStars:Zs,uTime:gn,uNoise:{value:rp()}},side:Vs,depthWrite:!1,transparent:!0,blending:Pa,fog:!1,vertexShader:`
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
      }`}),t=new H(new Ve(1,32,16),e);return t.frustumCulled=!1,t.renderOrder=-1e3,t.name="aw:sky",t.matrixAutoUpdate=!0,{mesh:t,u:h}}var ap=new R(14017279),op=new R(2770032),lp=new R(11569752),cp=new R(9348300),hp=new R(16764836),up=new R(10334430),dp=new R(3820134),fc=24,fp=new R,js=h=>h-Math.floor(h);function lo(h,e){if(h.y>=e)return h;let t=Math.hypot(h.x,h.z)||1,n=Math.sqrt(1-e*e)/t;return h.set(h.x*n,e,h.z*n)}var Js=class{constructor(e,t=!0){g(this,"g");g(this,"sky");g(this,"ambient");g(this,"sample",oo());g(this,"sunW",new M(0,1,0));g(this,"moonW",new M(0,1,0));g(this,"base");g(this,"ax",{ex:1,ez:0,nx:0,nz:-1});g(this,"wind",{x:0,z:0,qx:0,qz:0});g(this,"low");g(this,"disc");g(this,"clouds",[]);this.g=e;let n=e.real.sky,i=n.sunDir.clone().normalize();this.base={theta:n.theta,envAng0:Math.atan2(-i.z,i.x),sunColor:n.sun.color.clone(),sunI:n.sun.intensity,bounceSky:n.bounce.color.clone(),bounceGround:n.bounce.groundColor.clone(),bounceI:n.bounce.intensity,fog:n.fog.color.clone(),exposure:e.renderer.toneMappingExposure};let s=e.fromLL;if(s){let l=s(12.52,-70),c=s(12.52,-69.99),u=s(12.53,-70),d=Math.hypot(c.x-l.x,c.z-l.z)||1,f=Math.hypot(u.x-l.x,u.z-l.z)||1;this.ax={ex:(c.x-l.x)/d,ez:(c.z-l.z)/d,nx:(u.x-l.x)/f,nz:(u.z-l.z)/f}}let r=this.ax,a=-(.924*r.ex+.383*r.nx)*fc,o=-(.924*r.ez+.383*r.nz)*fc;this.wind={x:a/6e3,z:o/6e3,qx:(.8*a+.6*o)/2300,qz:(-.6*a+.8*o)/2300},this.low=e.real.q?.name==="low",this.disc=t?1:0,this.ambient=new Ci(9348300,0),this.ambient.name="aw:nightAmbient",e.scene.add(this.ambient),this.sky=dc(),e.scene.add(this.sky.mesh);for(let l of e.scene.children){let c=l;c.isSprite&&c.material&&c.position.y>25&&c.scale.x>60&&this.clouds.push({m:c.material,c:c.material.color.clone(),o:c.material.opacity})}}apply(e){let t=this.g,n=t.real.sky,i=uc(e,this.sample),s=this.base,r=this.ax,a=this.low,o=i.night,l=i.elevDeg;xe.value=o,Zs.value=i.stars;let c=this.sunW.set(i.east*r.ex+i.north*r.nx,i.up,i.east*r.ez+i.north*r.nz).normalize(),u=lo(this.moonW.copy(c).negate(),.62),d=l>-2,f=n.sunDir;d?lo(f.copy(c),.07):lo(f.copy(u),.78);let p=s.theta+Math.atan2(-f.z,f.x)-s.envAng0;t.scene.environmentRotation.set(0,p,0),t.scene.backgroundRotation.set(0,p,0),t.scene.background&&(t.scene.background=null);let m=Xe(.42,.75,o);d?(n.sun.color.copy(i.light).lerp(s.sunColor,Xe(30,45,l)),n.sun.intensity=s.sunI*i.sunK):(n.sun.color.copy(ap),n.sun.intensity=s.sunI*(.32+.16*m)*i.moonK*(a?1.1:1)),n.bounce.color.copy(s.bounceSky).lerp(op,o),n.bounce.groundColor.copy(s.bounceGround).lerp(lp,o),n.bounce.intensity=s.bounceI+((.55+.35*m)*(a?.72:1)-s.bounceI)*o;let x=i.dusk*(1-i.moonK);this.ambient.color.copy(hp).lerp(up,1-Xe(-6,2,l)).lerp(cp,i.moonK),this.ambient.intensity=.32*x*(a?.75:1)+(.55+.45*m)*(a?.5:1)*i.moonK;let v=a?.12:.22;t.scene.environmentIntensity=v+(1-v)*i.skyK,t.renderer.toneMappingExposure=s.exposure*(1+(a?.02:.14)*o)*(1+.1*i.dusk),n.fog.color.copy(i.fog).lerp(s.fog,.45*Xe(12,30,l));let _=t.camera,b=this.sky.u;this.sky.mesh.position.copy(_.position),this.sky.mesh.scale.setScalar(_.far*.9),b.uSun.value.copy(c);let y=Math.hypot(c.x,c.z);y>1e-4&&b.uSunXZ.value.set(c.x/y,c.z/y),b.uMoon.value.copy(u),b.uMoonI.value=i.moonK,b.uCam.value.copy(_.position),b.uZen.value.copy(i.zenith),b.uHorS.value.copy(i.horSun),b.uHorA.value.copy(i.horAnti),b.uGlow.value.copy(i.glow),b.uBelt.value.copy(i.belt),b.uDisc.value.copy(i.disc).multiplyScalar(this.disc),b.uCLit.value.copy(i.cloudLit),b.uCShade.value.copy(i.cloudShade),b.uFog.value.copy(n.fog.color);let w=gn.value,T=this.wind;b.uWind.value.set(js(T.x*w),js(T.z*w),js(T.qx*w),js(T.qz*w)),b.uCloudAmt.value=1-.35*o;for(let A of this.clouds)A.m.color.copy(A.c).lerp(fp.copy(dp),o),A.m.opacity=A.o*(1-.6*o)}};function Yn(h,e,t){let n=h;if(n.userData["aw:"+e])return;n.userData["aw:"+e]=!0;let i=n.onBeforeCompile,s=n.customProgramCacheKey?n.customProgramCacheKey.bind(n):()=>"";n.onBeforeCompile=(r,a)=>{i&&i.call(n,r,a),t(r)},n.customProgramCacheKey=()=>s()+"|aw-"+e,n.needsUpdate=!0}function pp(h){Yn(h,"winglow-v1",e=>{e.fragmentShader.includes("float gMask = glass;")&&(e.uniforms.uAwNight=xe,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    float awB = floor(u / 3.6), awF = floor(v / max(fh, 0.5));
    float awR = rwH(vec2(awB * 3.1 + seed * 11.0, awF * 7.3 + 0.37));
    float awLit = step(0.6, awR); // ~40% of windows lit (r202: 50%)
    vec3 awWarm = mix(vec3(1.0, 0.6, 0.28), vec3(1.0, 0.86, 0.62), rwH(vec2(awR, seed + 0.5)));
    totalEmissiveRadiance += awWarm * gMask * awLit * smoothstep(0.3, 0.8, uAwNight) * (0.35 + 0.25 * awR); // owner: city too bright (r202 0.9, before 2.4)
  }`))})}function mp(h){Yn(h,"herowin-v2",e=>{e.fragmentShader.includes("#include <emissivemap_fragment>")&&(e.uniforms.uAwNight=xe,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
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
  }`))})}var gp=new R(16763269),xp=new M,$s=class{constructor(e){g(this,"g");g(this,"head");g(this,"headTarget");g(this,"pools",[]);g(this,"bulbMats",new Set);g(this,"bulbBase",new Map);g(this,"lampMeshes",new Set);g(this,"scanT",0);g(this,"heroGlow",new Map);g(this,"heroN",-1);g(this,"bump",[]);g(this,"poolT",0);g(this,"waterDone",new WeakSet);g(this,"waterSeen",new WeakSet);g(this,"waterTopN",-1);g(this,"waterT",0);this.g=e;let t=e.real;t.buildings?.wall&&pp(t.buildings.wall),this.head=new hn(16773576,0,58,.95,.6,1),this.head.castShadow=!1,this.head.name="aw:headlight",this.headTarget=new ce,this.head.target=this.headTarget,e.scene.add(this.head,this.headTarget);let i=(t.q?.name??"med")==="high"?4:0;for(let s=0;s<i;s++){let r=new un(16757086,0,28,2);r.castShadow=!1,r.name="aw:lampPool",this.pools.push(r),e.scene.add(r)}}patchWaterMat(e){if(!e||Array.isArray(e)||this.waterDone.has(e))return;this.waterDone.add(e);let t=e.customProgramCacheKey?e.customProgramCacheKey():"";/\|water/.test(t)&&Yn(e,"waternight-v1",n=>{n.fragmentShader.includes("diffuseColor = vec4(wc, a);")&&(n.uniforms.uAwNight=xe,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("diffuseColor = vec4(wc, a);",`wc *= mix(1.0, 0.22, uAwNight); wc = mix(wc, wc * vec3(0.55, 0.75, 1.1), uAwNight * 0.5);
  diffuseColor = vec4(wc, a);`))})}patchWater(){let e=this.g.real;if(e.group.children.length!==this.waterTopN){this.waterTopN=e.group.children.length;for(let t of e.group.children){let n=t.material;t.isMesh&&this.patchWaterMat(n)}}for(let t of e.regions.values())t.wmat&&this.patchWaterMat(t.wmat),!(t.state!=="built"||!t.group||this.waterSeen.has(t.group))&&(this.waterSeen.add(t.group),t.group.traverse(n=>{n.isMesh&&this.patchWaterMat(n.material)}))}scan(){this.waterT++,this.patchWater(),this.g.real.veg.group.traverse(e=>{let t=e.material;!e.isMesh||!t||Array.isArray(t)||!t.emissive||(t.emissive.getHex()===5591884||this.bulbMats.has(t))&&(this.bulbMats.has(t)||(this.bulbMats.add(t),this.bulbBase.set(t,{e:t.emissive.clone(),i:t.emissiveIntensity})),e.isInstancedMesh&&this.lampMeshes.add(e))});for(let e of this.lampMeshes)e.parent||this.lampMeshes.delete(e);this.scanHero()}scanHero(){let e=this.g.real.hero?.group;if(!e)return;let t=0;e.traverse(()=>t++),t!==this.heroN&&(this.heroN=t,e.traverse(n=>{let i=n.material;if(!(!n.isMesh||!i))for(let s of Array.isArray(i)?i:[i]){if(!s||!s.emissive||this.heroGlow.has(s))continue;let r=s.name||"";/^l?(signglow|neon|bulb)/i.test(r)?this.heroGlow.set(s,s.emissiveIntensity||1):r==="sign"?this.heroGlow.set(s,-(s.emissiveIntensity||1)):/^(facade|ground)(_\d+)?$/.test(r)?(mp(s),this.bump.push(s)):r==="glass"&&(s.emissive.setHex(16763269),s.emissiveIntensity=0,this.heroGlow.set(s,0))}}))}carForward(e){let t=this.g.S.car.h;return e.set(-Math.sin(t),0,-Math.cos(t)),!0}update(e){let t=this.g,n=xe.value;this.scanT-=e,this.scanT<=0&&(this.scanT=2,this.scan());let i=Math.max(0,Math.min(1,(n-.25)/.4));for(let o of this.bulbMats){let l=this.bulbBase.get(o);o.emissive.copy(l.e).lerp(gp,i),o.emissiveIntensity=l.i+i*2}if(this.bump.length){for(let o of this.bump)o.needsUpdate=!0;this.bump.length=0}for(let o of this.heroGlow.keys()){let l=this.heroGlow.get(o);o.emissiveIntensity=l>0?l*(.45+i*.95):l<0?-l*(1+i*.55):i*.16}let s=t.S,r=(s.mode==="car"||s.mode==="moto")&&n>.35,a=xp;if(r&&this.carForward(a)){let o=s.car,l=(o.y||0)+(s.mode==="moto"?.72:.62);this.head.position.set(o.x+a.x*2.2,l,o.z+a.z*2.2),this.headTarget.position.set(o.x+a.x*24,(o.y||0)+.2,o.z+a.z*24),this.headTarget.updateMatrixWorld(),this.head.intensity=54*n}else this.head.intensity=0;if(this.head.visible=n>.35,this.pools.length){if(this.poolT-=e,this.poolT<=0){this.poolT=.5;let o=t.camera.position,l=[],c=new U;for(let u of this.lampMeshes){let d=u.matrixWorld;for(let f=0;f<u.count;f++){u.getMatrixAt(f,c);let p=new M().setFromMatrixPosition(c).applyMatrix4(d),m=(p.x-o.x)**2+(p.z-o.z)**2;m>8100||l.push({d:m,p})}}l.sort((u,d)=>u.d-d.d),this.pools.forEach((u,d)=>{let f=l[d];f&&u.position.set(f.p.x,f.p.y+6.5,f.p.z),u.userData.has=!!f})}for(let o of this.pools)o.intensity=o.userData.has?n*12:0,o.visible=n>.3}}};var Qs=[1,.9,.8,.7,.6],pc=[1,.85,.75,.75,.75],mc=6,er=class{constructor(e){g(this,"g");g(this,"enabled");g(this,"target");g(this,"level",0);g(this,"maxLevel",mc);g(this,"fps",60);g(this,"basePR");g(this,"acc",0);g(this,"frames",0);g(this,"lowFor",0);g(this,"highFor",0);g(this,"holdUp",0);g(this,"warm",4);g(this,"shadowTick",0);g(this,"stalls",0);g(this,"upAt",-1e9);g(this,"bounces",0);g(this,"floorUntil",0);g(this,"t",0);g(this,"phone",!1);g(this,"listeners",[]);this.g=e,this.basePR=e.renderer.getPixelRatio(),this.enabled=O.get("fpsguard")!=="0"&&localStorage.getItem("aw_fpsguard")!=="0";let t=e.real?.q?.name,n=+(O.get("fps")||0),i=!(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window),s=t==="high";this.target=n>10?n:t==="low"?i?30:50:i&&s?57:50,this.maxLevel=i&&s?4:i?mc:5,this.phone=!i,document.addEventListener("visibilitychange",()=>{this.warm=2,this.acc=0,this.frames=0})}onChange(e){this.listeners.push(e)}setEnabled(e){this.enabled=e;try{localStorage.setItem("aw_fpsguard",e?"1":"0")}catch{}e||this.setLevel(0),this.listeners.forEach(t=>t())}setLevel(e){if(e=Math.max(0,Math.min(this.maxLevel,e)),e===this.level)return;let t=this.g,n=(this.phone?pc:Qs)[Math.min(e,Qs.length-1)],i=window.__awPRCap||1/0,s=Math.max(.5,Math.min(this.basePR,i)*n);Math.abs(t.renderer.getPixelRatio()-s)>.001&&(t.renderer.setPixelRatio(s),window.dispatchEvent(new Event("resize"))),t.renderer.shadowMap.autoUpdate=e<5,e<5&&(t.renderer.shadowMap.needsUpdate=!0),window.__noPost=e>=6,this.level=e,this.listeners.forEach(r=>r())}frame(e){let t=this.g.renderer;if(this.level>=5&&++this.shadowTick%7===0&&(t.shadowMap.needsUpdate=!0),!this.enabled||document.hidden)return;if(this.t+=Math.min(e,1),e>1.5&&++this.stalls<3){this.warm=Math.max(this.warm,1);return}if(e<=1.5&&(this.stalls=0),this.warm>0){this.warm-=Math.max(0,e);return}if(this.acc+=e,this.frames++,this.acc<.5)return;this.fps=this.frames/this.acc;let n=this.acc;this.acc=0,this.frames=0,this.holdUp=Math.max(0,this.holdUp-n),this.fps<this.target-2?(this.lowFor+=n,this.highFor=0):this.fps>Math.min(this.target+8,58)?(this.highFor+=n,this.lowFor=0):(this.lowFor=0,this.highFor=0);let i=window.__awAhead,s=!!i&&Math.hypot(i[0],i[1])>25;this.lowFor>=(this.phone?3:1.5)&&this.level<this.maxLevel?(this.t-this.upAt<25&&++this.bounces>=2&&(this.floorUntil=this.t+600),this.setLevel(this.level+1),this.lowFor=0,this.warm=1,this.holdUp=15):this.highFor>=6&&this.level>0&&!(this.phone&&s)&&this.holdUp<=0&&this.t>this.floorUntil&&(this.setLevel(this.level-1),this.upAt=this.t,this.highFor=0,this.warm=1,this.holdUp=8)}describe(){if(!this.enabled)return"off";let e=(this.phone?pc:Qs)[Math.min(this.level,Qs.length-1)],t=this.level>=6?" \xB7 post off":this.level>=5?" \xB7 lazy shadows":"";return`${Math.round(this.fps)} fps \xB7 target ${this.target} \xB7 scale ${Math.round(e*100)}%${t}`}};var tr=class{constructor(e){g(this,"g",e);g(this,"px",NaN);g(this,"pz",NaN);g(this,"vx",0);g(this,"vz",0)}frame(e){let t=this.g.camera.position;if(e>0&&e<.5&&Number.isFinite(this.px)){let o=Math.min(1,e*1.5);this.vx+=((t.x-this.px)/e-this.vx)*o,this.vz+=((t.z-this.pz)/e-this.vz)*o}this.px=t.x,this.pz=t.z;let n=this.vx*5,i=this.vz*5,s=Math.hypot(n,i);s>220&&(n*=220/s,i*=220/s);let r=window,a=r.__awAhead||(r.__awAhead=[0,0]);s<15?(a[0]=0,a[1]=0):(a[0]=n,a[1]=i)}};var nr=class{constructor(e,t){g(this,"g",e);g(this,"on");g(this,"n",0);g(this,"t",1);g(this,"busy",!1);g(this,"stats",{compiles:0});this.on=t}frame(e){if(!this.on)return;let t=this.g.renderer;t.shadowMap.autoUpdate=!1,(this.n++&1)===0&&(t.shadowMap.needsUpdate=!0),(this.t-=e)<=0&&!this.busy&&t.compileAsync&&(this.t=4,this.busy=!0,t.compileAsync(this.g.scene,this.g.camera).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.busy=!1}))}};function nt(h,e=!1){let t=h[0].index!==null,n=new Set(Object.keys(h[0].attributes)),i=new Set(Object.keys(h[0].morphAttributes)),s={},r={},a=h[0].morphTargetsRelative,o=new J,l=0;for(let c=0;c<h.length;++c){let u=h[c],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". The geometry must have either an index or a position attribute"),null;o.addGroup(l,f,c),l+=f}}if(t){let c=0,u=[];for(let d=0;d<h.length;++d){let f=h[d].index;for(let p=0;p<f.count;++p)u.push(f.getX(p)+c);c+=h[d].attributes.position.count}o.setIndex(u)}for(let c in s){let u=gc(s[c]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" attribute."),null;o.setAttribute(c,u)}for(let c in r){let u=r[c][0].length;if(u!==0){o.morphAttributes=o.morphAttributes||{},o.morphAttributes[c]=[];for(let d=0;d<u;++d){let f=[];for(let m=0;m<r[c].length;++m)f.push(r[c][m][d]);let p=gc(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" morphAttribute."),null;o.morphAttributes[c].push(p)}}}return o}function gc(h){let e,t,n,i=-1,s=0;for(let l=0;l<h.length;++l){let c=h[l];if(e===void 0&&(e=c.array.constructor),e!==c.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=c.itemSize),t!==c.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=c.normalized),n!==c.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=c.gpuType),i!==c.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=c.count*t}let r=new e(s),a=new Z(r,t,n),o=0;for(let l=0;l<h.length;++l){let c=h[l];if(c.isInterleavedBufferAttribute){let u=o/t;for(let d=0,f=c.count;d<f;d++)for(let p=0;p<t;p++){let m=c.getComponent(d,p);a.setComponent(d+u,p,m)}}else r.set(c.array,o);o+=c.count*t}return i!==void 0&&(a.gpuType=i),a}function co(h,e){if(e===qa)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),h;if(e===qn||e===Di){let t=h.getIndex();if(t===null){let s=[],r=h.getAttribute("position");if(r!==void 0){for(let a=0;a<r.count;a++)s.push(a);h.setIndex(s),t=h.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),h}let n=t.count-2,i=[];if(e===qn)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),h.setIndex(i),h.clearGroups(),h}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),h}var ir=class{constructor(e){g(this,"g",e);g(this,"stats",{regions:0,before:0,after:0,ms:0});g(this,"n",0);g(this,"todo",[])}frame(){if(++this.n%3)return;let e=this.todo.shift();if(e){let n=performance.now();this.mergeList(e.root,e.list),this.stats.ms=Math.max(this.stats.ms,performance.now()-n);return}let t=this.g.real;for(let n of t.regions.values())if(!(n.__awBM||n.state!=="built"||!n.group)&&!t.queue.some(i=>i.R===n)){n.__awBM=!0,this.collect(n.group);return}}collect(e){let t=new Map;e.traverse(n=>{let i=n;if(!i.isMesh||i.isInstancedMesh||!i.name.startsWith("bld:")||i.name==="bld:kit"||Array.isArray(i.material))return;let s=i,r=!0;for(;s&&s!==e;)s.matrix.equals(vp)||(r=!1),s=s.parent;if(!r)return;let a=i.geometry;if(Object.keys(a.morphAttributes).length||a.groups.length)return;let o=i.name+"|"+i.material.uuid+"|"+Object.keys(a.attributes).sort().join(",")+"|"+(a.index?1:0)+"|"+(i.castShadow?1:0)+(i.receiveShadow?1:0)+"|"+i.renderOrder;(t.get(o)||t.set(o,[]).get(o)).push(i)});for(let n of t.values())this.stats.before+=n.length,n.length<2?this.stats.after++:this.todo.push({root:e,list:n});this.stats.regions++}mergeList(e,t){if(!t[0].parent)return;let n=nt(t.map(r=>r.geometry));if(!n){this.stats.after+=t.length;return}n.computeBoundingSphere(),n.computeBoundingBox();let i=t[0],s=new H(n,i.material);s.name=i.name,s.castShadow=i.castShadow,s.receiveShadow=i.receiveShadow,s.renderOrder=i.renderOrder,s.frustumCulled=i.frustumCulled;for(let r of t)r.removeFromParent(),r.geometry.dispose();e.add(s),this.stats.after++}},vp=new U;var sr=class{constructor(e){g(this,"stats",{sb:0,drawn:0,blocks:0});g(this,"sbs",[]);let t=e.ovBlocks;if(!t||!t.length)return;let n=t[0].userData.rect[2]-t[0].userData.rect[0]||1,i=t[0].userData.rect[3]-t[0].userData.rect[1]||1,s=Math.min(...t.map(l=>l.userData.rect[0])),r=Math.min(...t.map(l=>l.userData.rect[1])),a=new Map;for(let l of t){let c=Math.floor((l.userData.rect[0]-s+1)/(n*4))+","+Math.floor((l.userData.rect[1]-r+1)/(i*4));(a.get(c)||a.set(c,[]).get(c)).push(l)}for(let l of a.values()){if(l.length<2)continue;let c=new H(l[0].geometry,l[0].material);c.name="ovTerrain:sb",c.receiveShadow=!1,c.matrixAutoUpdate=!1,c.visible=!1,e.group.add(c),this.sbs.push({kids:l,mesh:c,key:"",cache:new Map})}this.stats.sb=this.sbs.length,this.stats.blocks=t.length;let o=e.update.bind(e);e.update=(...l)=>{let c=o(...l);return this.apply(),c}}apply(){let e=0;for(let t of this.sbs){let n="",i=0;for(let r of t.kids)r.visible?(n+=r.userData.lods.indexOf(r.geometry),i++):n+="h";if(i<2){t.mesh.visible=!1;continue}let s=t.cache.get(n);if(s===void 0){if(s=nt(t.kids.filter(r=>r.visible).map(r=>r.geometry))||null,s&&s.computeBoundingSphere(),t.cache.size>=4){let[r,a]=t.cache.entries().next().value;t.cache.delete(r),a&&a!==s&&a.dispose()}t.cache.set(n,s)}else t.cache.delete(n),t.cache.set(n,s);if(!s){t.mesh.visible=!1;continue}t.mesh.geometry=s,t.mesh.visible=!0;for(let r of t.kids)r.visible=!1;e++}this.stats.drawn=e}};var rr=class{constructor(e){g(this,"real",e);g(this,"stats",{merged:0,chunks:0});g(this,"n",0);g(this,"live",new Set);let t=e.update.bind(e);e.update=(...n)=>{let i=t(...n);return this.apply(),i}}apply(){let e=(++this.n&7)===0,t=0,n=0,i=1;for(let s of this.real.regions.values()){let r=s.chunks,a=s.__awTM,o=!!r&&r.length>1&&!!s.group;if(o){for(let c of r)if(!c.mesh||c.step!==16||c.pending){o=!1;break}}if(!o){if(a&&(a.mesh.removeFromParent(),a.mesh.geometry.dispose(),s.__awTM=void 0,r))for(let c of r)c.mesh&&(c.mesh.visible=!0);continue}let l="";for(let c of r)l+=c.mesh.geometry.id+",";if(!a||a.key!==l){if(!e||i<=0){if(a){for(let u of r)u.mesh.visible=!0;a.mesh.visible=!1}continue}i--;let c=nt(r.map(u=>u.mesh.geometry));if(!c)continue;if(c.computeBoundingSphere(),a)a.mesh.geometry.dispose(),a.mesh.geometry=c,a.key=l;else{let u=new H(c,r[0].mesh.material);u.name="terrain16:m",u.receiveShadow=!0,u.matrixAutoUpdate=!1,s.group.add(u),s.__awTM={key:l,mesh:u},this.live.add(s)}}s.__awTM.mesh.visible=!0;for(let c of r)c.mesh.visible=!1;t++,n+=r.length}if(e)for(let s of this.live){let r=s.__awTM,a=!1;for(let o of this.real.regions.values())if(o===s){a=!0;break}(!a||!r)&&(r&&(r.mesh.removeFromParent(),r.mesh.geometry.dispose(),s.__awTM=void 0),this.live.delete(s))}this.stats.merged=t,this.stats.chunks=n}};var ho={value:500};function xc(h,e=1.6){return new et({uniforms:{uI:h,uNight:xe,uScale:ho,uMinPx:{value:e}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:dn,fog:!1,toneMapped:!1})}function ar(h,e,t=!1){return new et({uniforms:{uI:e,uC:{value:new R(h)}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:dn,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,fog:!1,toneMapped:!1})}var vc=-2.4,_c=8.87,bc=new U,_p=new re,bp=new M(15,1,15),yc=new M,or=class{constructor(e){g(this,"g");g(this,"points");g(this,"pools");g(this,"dotI",{value:0});g(this,"poolI",{value:0});g(this,"lists",[]);g(this,"bulbs",new Float32Array(0));g(this,"nBulbs",0);g(this,"t",0);g(this,"nPools");this.g=e;let t=new J;t.setAttribute("position",new Z(new Float32Array(3),3)),this.points=new Qe(t,xc(this.dotI)),this.points.frustumCulled=!1,this.points.name="aw:lampGlow",this.points.renderOrder=5;let n=e.real?.q?.name??"med";this.nPools=n==="low"?14:n==="med"?24:32;let i=new Et(1,1).rotateX(-Math.PI/2);this.pools=new pe(i,ar(16758886,this.poolI),this.nPools),this.pools.frustumCulled=!1,this.pools.count=0,this.pools.name="aw:lampPools",e.scene.add(this.points,this.pools)}rebuild(){let t=this.g.real.veg.lists?.l;if(!t||t.length===this.lists.length&&t.every((l,c)=>l===this.lists[c]))return;this.lists=t.slice();let n=0;for(let l of t)n+=l.length;let i=new Float32Array(n*3),s=new Float32Array(n*3),r=new Float32Array(n),a=0;for(let l of t)for(let[c,u,d,f,p]of l){let m=Math.cos(p),x=Math.sin(p);i[a*3]=c+vc*m*f,i[a*3+1]=u+_c*f-.12,i[a*3+2]=d-vc*x*f,s[a*3]=1,s[a*3+1]=.74,s[a*3+2]=.42,r[a]=1.9,a++}let o=new J;o.setAttribute("position",new Z(i,3)),o.setAttribute("color",new Z(s,3)),o.setAttribute("size",new Z(r,1)),this.points.geometry.dispose(),this.points.geometry=o,this.bulbs=i,this.nBulbs=n}update(e){let t=xe.value,n=Math.max(0,Math.min(1,(t-.3)/.45));if(this.dotI.value=.95*n,this.poolI.value=.34*n,this.points.visible=this.pools.visible=n>.001,this.t-=e,this.t>0)return;this.t=.5,this.rebuild();let i=this.g.camera;if(ho.value=this.g.renderer.domElement.height/2/Math.tan(i.fov*Math.PI/180/2),!this.points.visible)return;let s=i.position.x,r=i.position.z,a=[],o=this.bulbs;for(let c=0;c<this.nBulbs;c++){let u=o[c*3]-s,d=o[c*3+2]-r,f=u*u+d*d;f<25600&&a.push([f,c])}a.sort((c,u)=>c[0]-u[0]);let l=Math.min(this.nPools,a.length);for(let c=0;c<l;c++){let u=a[c][1],d=o[u*3],f=o[u*3+2],p=this.g.real&&this.g.real.heightAt,m=p?p(d,f):o[u*3+1]-_c;yc.set(d,m+.3,f),bc.compose(yc,_p,bp),this.pools.setMatrixAt(c,bc)}this.pools.count=l,this.pools.instanceMatrix.needsUpdate=!0}};var lr=[16052712,2106667,12106945,9377825,1526392,14145746,5003845,11823922,7038077,14927177,7554357,4093819],yp=new R(16773590),Mp=new R(16719888),Sp=h=>!!h.rb,cr=class{constructor(e){g(this,"g",e);g(this,"stats",{pooled:0,visible:0,yielding:0,avoiding:0,batches:0,beamDraws:0,quality:""});g(this,"amb",null);g(this,"states",[]);g(this,"batches",[]);g(this,"stateByCar",new WeakMap);g(this,"matrix",new U);g(this,"zero",new U().makeScale(0,0,0));g(this,"paint",new R);g(this,"beamI",{value:0});g(this,"beamMat",ar(16773328,this.beamI,!0));g(this,"beams",null)}start(){let e=this.g.real.amb;if(!e?.kit?.car?.[0])return!1;this.amb=e;let t=this.g.real.q.name,n=t==="low"?5:t==="med"?10:15,i=t==="low"?[0,1,2]:t==="med"?[0,1,2,4]:[0,1,2,3,4];for(this.stats.quality=t;e.cars.length<n;){let r=e.cars.length,a=i[r%i.length],o=this.paint.setHex(lr[(r*5+3)%lr.length]),l=e.carMesh(a,o);l.visible=!1,e.group.add(l),e.cars.push({g:l,v:a,rd:null,L:0,dir:1,s:0,sp:0})}e.nCar=n;for(let r=0;r<5;r++)this.batches.push({cars:[],parts:[]});for(let r=0;r<e.cars.length;r++){let a=e.cars[r],o=Math.max(0,Math.min(4,a.v|0)),l=e.kit.car[0][o].paint,c=new R(lr[r%lr.length]);for(let d of a.g.children){let f=d,p=f.material;if(f.isMesh&&f.geometry===l&&p.color){c=p.color.clone();break}}let u={car:a,base:a.g.children.slice(),color:c,batchIndex:this.batches[o].cars.length,rd:null,cruise:11,yieldPhase:0,yieldTime:0,yieldsAtEnd:!1};this.batches[o].cars.push(u),this.states.push(u),this.stateByCar.set(a,u);for(let d of u.base)d.visible=!1}for(let r=0;r<5;r++)this.makeBatch(r,e.kit.car[0][r]);let s=new Et(4.4,16).rotateX(-Math.PI/2).rotateY(Math.PI).translate(0,.11,10);return this.beams=new pe(s,this.beamMat,n),this.beams.name="aw:traffic:beams",this.beams.frustumCulled=!1,this.beams.instanceMatrix.setUsage(We),this.beams.count=0,e.group.add(this.beams),this.stats.pooled=this.states.length,!0}makeBatch(e,t){let n=this.amb,i=this.batches[e],s=i.cars.length;if(s)for(let r of Object.keys(t)){let a=n.mats[r];if(!a)continue;let o=a.clone();r==="paint"&&o.color&&o.color.setHex(16777215);let l=new pe(t[r],o,s);if(l.name=`aw:traffic:${e}:${r}`,l.frustumCulled=!1,l.castShadow=this.g.real.q.name!=="low"&&r==="paint",l.instanceMatrix.setUsage(We),r==="paint"){for(let c=0;c<s;c++)l.setColorAt(c,i.cars[c].color);l.instanceColor&&(l.instanceColor.needsUpdate=!0)}i.parts.push({mesh:l,mat:o,name:r}),n.group.add(l),this.stats.batches++}}routeChanged(e){let t=e.car;if(e.rd=t.rd,e.cruise=t.v===4?9:11+(e.batchIndex*7+t.v*3)%4,e.yieldPhase=0,e.yieldTime=0,e.yieldsAtEnd=!1,!t.rd||t.rd.rb)return;let n=t.rd.p,i=t.dir>0?n[n.length-1]:n[0];e.yieldsAtEnd=this.amb.pick(i[0],i[1],Sp,18).length>0}applyAI(e){let t=this.amb,n=this.g.S.mode,i=n==="walk"?this.g.S.walk:this.g.S.car,s=n!=="plane",r=0,a=0;for(let o=0;o<t.cars.length;o++){let l=t.cars[o],c=this.stateByCar.get(l);if(!c||(l.rd!==c.rd&&this.routeChanged(c),!l.rd))continue;let u=c.cruise;if(l.rd.rb&&(u=Math.min(u,6.5)),c.yieldsAtEnd&&c.yieldPhase<2){let f=l.dir>0?l.L-l.s:l.s;f<22&&(u=Math.min(u,Math.max(0,(f-4.5)*.75))),f<6&&c.yieldPhase===0&&(c.yieldPhase=1,c.yieldTime=.7+(c.batchIndex*13+l.v*5)%8*.1),c.yieldPhase===1&&(u=0,l.sp<.7&&(c.yieldTime-=e)<=0&&(c.yieldPhase=2)),r++}if(s){let f=l.g.position.x-i.x,p=l.g.position.z-i.z,m=f*f+p*p;m<324&&(u=Math.min(u,Math.max(0,(Math.sqrt(m)-5)*.8)),a++)}for(let f=0;f<t.cars.length;f++){if(o===f)continue;let p=t.cars[f];if(p.rd!==l.rd||p.dir!==l.dir)continue;let m=l.dir*(p.s-l.s);m>0&&m<20&&(u=Math.min(u,Math.max(0,(m-5)*.85)))}let d=u-l.sp;l.sp+=Math.max(-8*e,Math.min(2.4*e,d)),l.sp<.001&&(l.sp=.001)}this.stats.yielding=r,this.stats.avoiding=a}isSpecial(e){let t=!1;for(let n of e.car.g.children){if(n.name.startsWith("aw:ev"))return 2;(n.name==="aw:ebar"||n.name==="aw:estripe")&&n.visible&&(t=!0)}return t?1:0}renderInstances(){let e=0,t=0,n=Math.max(0,Math.min(1,(xe.value-.3)/.4));this.beamI.value=.42*n;for(let i of this.batches){for(let s of i.cars){let r=s.car,a=this.isSpecial(s);for(let l of s.base)l.visible=a===1&&r.g.visible;let o=!!r.rd&&r.g.visible&&a===0;o?(this.matrix.compose(r.g.position,r.g.quaternion,r.g.scale),e++):this.matrix.copy(this.zero);for(let l of i.parts)l.mesh.setMatrixAt(s.batchIndex,this.matrix);o&&n>.001&&this.beams&&this.beams.setMatrixAt(t++,this.matrix)}for(let s of i.parts)s.mesh.instanceMatrix.needsUpdate=!0,s.name==="light"&&s.mat.emissive?(s.mat.emissive.copy(yp),s.mat.emissiveIntensity=1+n*5):s.name==="tail"&&s.mat.emissive&&(s.mat.emissive.copy(Mp),s.mat.emissiveIntensity=1+n*3)}this.beams&&(this.beams.count=t,this.beams.visible=t>0,t&&(this.beams.instanceMatrix.needsUpdate=!0)),this.stats.visible=e,this.stats.beamDraws=t?1:0}update(e){if(!this.amb&&!this.start())return;let t=Math.min(.1,e);this.applyAI(t),this.renderInstances()}};var Mc=[15293275,4034507,15845451,5089640,15303603,15174469,7560626],Sc=[2503749,5588277,14275783,3361897,3224376],wc=[7290667,9590843,12155220,13998706,15581854],wp=new M(1,0,0),hr=class{constructor(e){g(this,"g",e);g(this,"stats",{pooled:0,visible:0,draws:0,triangles:0,corridors:0});g(this,"amb",null);g(this,"walkers",[]);g(this,"routes",[]);g(this,"group",new ae);g(this,"head");g(this,"torso");g(this,"legs");g(this,"arms");g(this,"meshes");g(this,"root",new U);g(this,"local",new U);g(this,"world",new U);g(this,"pos",new M);g(this,"scale",new M);g(this,"quat",new re);g(this,"tint",new R);g(this,"scanIn",0);g(this,"lod2");let t=e.real.q.name,n=t==="low"?18:t==="med"?32:48,i=t==="low"?190:250;this.lod2=i*i,this.group.name="aw:pedestrians";let s=new tt({color:16777215}),r=new tt({color:16777215}),a=new tt({color:16777215});this.head=this.mesh(new Ve(1,6,4),s,n,"heads"),this.torso=this.mesh(new ye(1,1,1),r,n,"torsos"),this.legs=this.mesh(new ye(1,1,1),a,n*2,"legs"),this.arms=this.mesh(new ye(1,1,1),s,n*2,"arms"),this.meshes=[this.head,this.torso,this.legs,this.arms],this.group.add(this.head,this.torso,this.legs,this.arms),e.scene.add(this.group);for(let o=0;o<n;o++)this.walkers.push({road:null,length:0,s:0,dir:o&1?1:-1,side:o&2?1:-1,speed:1.05+o%6*.09,phase:o*2.399963%(Math.PI*2),x:0,y:0,z:0,yaw:0,skin:wc[o*3%wc.length],top:Mc[o*5%Mc.length],bottom:Sc[o*7%Sc.length]});this.stats.pooled=n}mesh(e,t,n,i){let s=new pe(e,t,n);return s.name=`aw:pedestrians:${i}`,s.instanceMatrix.setUsage(We),s.frustumCulled=!1,s.castShadow=this.g.real.q.name!=="low",s.count=0,s}roadLength(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}inCorridor(e){let t=e.n==="Caya G.F. Betico Croes",n=e.n==="J.E. Irausquin Boulevard";if(!t&&!n)return!1;for(let i=0;i<e.p.length;i++){let s=e.p[i][0],r=e.p[i][1];if(t&&s>-7550&&s<-6450&&Math.abs(r)<350)return!0;let a=s+8220,o=r+5750;if(n&&a*a+o*o<1450*1450)return!0}return!1}scanRoutes(){let e=this.amb;this.routes=[];let t=new Set;for(let n of e.w.regions.values()){let i=n.json?.roads;if(i)for(let s of i){let r=`${s.n}:${s.id}`;s.u||s.p.length<2||t.has(r)||!this.inCorridor(s)||(t.add(r),this.routes.push(s))}}if(this.stats.corridors=this.routes.length,!!this.routes.length)for(let n=0;n<this.walkers.length;n++){let i=this.walkers[n];if(i.road&&this.routes.includes(i.road))continue;let s=this.routes[n%this.routes.length];i.road=s,i.length=this.roadLength(s),i.s=i.length*(n*.61803398875%1*.9+.05),i.side=(n&1?1:-1)*(s.w*.5+1.45)}}sample(e){let t=e.road;if(!t)return!1;let n=0;for(let i=1;i<t.p.length;i++){let s=t.p[i-1][0],r=t.p[i-1][1],a=t.p[i][0]-s,o=t.p[i][1]-r,l=Math.hypot(a,o)||1;if(n+l>=e.s||i===t.p.length-1){let c=Math.max(0,Math.min(1,(e.s-n)/l)),u=a/l,d=o/l;return e.x=s+a*c-d*e.side,e.z=r+o*c+u*e.side,e.y=this.amb.w.surfaceAt(e.x,e.z)+.02,e.yaw=e.dir>0?Math.atan2(u,d):Math.atan2(-u,-d),!0}n+=l}return!1}put(e,t,n,i,s,r,a,o,l){this.pos.set(n,i,s),this.quat.setFromAxisAngle(wp,r),this.scale.set(a,o,l),this.local.compose(this.pos,this.quat,this.scale),this.world.multiplyMatrices(this.root,this.local),e.setMatrixAt(t,this.world)}drawWalker(e,t,n){let i=Math.sin(n*7.2+e.phase),s=Math.abs(i)*.025;this.root.makeRotationY(e.yaw),this.root.setPosition(e.x,e.y+s,e.z),this.put(this.head,t,0,1.77,0,0,.18,.2,.18),this.put(this.torso,t,0,1.29,0,0,.34,.52,.22),this.put(this.legs,t*2,-.14,.64,i*.08,i*.45,.11,.62,.13),this.put(this.legs,t*2+1,.14,.64,-i*.08,-i*.45,.11,.62,.13),this.put(this.arms,t*2,-.43,1.26,0,-i*.5,.08,.48,.09),this.put(this.arms,t*2+1,.43,1.26,0,i*.5,.08,.48,.09),this.head.setColorAt(t,this.tint.setHex(e.skin)),this.torso.setColorAt(t,this.tint.setHex(e.top)),this.legs.setColorAt(t*2,this.tint.setHex(e.bottom)),this.legs.setColorAt(t*2+1,this.tint),this.arms.setColorAt(t*2,this.tint.setHex(e.skin)),this.arms.setColorAt(t*2+1,this.tint)}update(e,t){if(!this.amb){let s=this.g.real.amb;if(!s)return;this.amb=s,this.scanRoutes()}for(;this.amb.peds.length;){let s=this.amb.peds.pop();s.g.visible=!1,s.g.parent?.remove(s.g)}(this.scanIn-=e)<=0&&(this.scanIn=2,this.scanRoutes());let n=this.g.camera.position,i=0;for(let s of this.walkers){if(!s.road||s.length<=0||(s.s+=s.dir*s.speed*e,s.s>=s.length?(s.s=s.length,s.dir=-1):s.s<=0&&(s.s=0,s.dir=1),!this.sample(s)))continue;let r=s.x-n.x,a=s.z-n.z;r*r+a*a>this.lod2||this.drawWalker(s,i++,t)}this.head.count=i,this.torso.count=i,this.legs.count=i*2,this.arms.count=i*2;for(let s of this.meshes)s.count&&(s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0)),s.visible=s.count>0;this.stats.visible=i,this.stats.draws=i?4:0,this.stats.triangles=i*96}};var ur=class{constructor(e){g(this,"g",e);g(this,"stats",{started:!1,muted:!1,mode:"car",trafficVoices:0});g(this,"audio",null);g(this,"muted",!1);g(this,"quick");g(this,"setting",null);try{this.muted=localStorage.getItem("aw_muted")==="1"}catch{}this.stats.muted=this.muted,this.quick=document.createElement("button"),this.quick.id="awmutebtn",this.quick.type="button",this.quick.setAttribute("aria-label","Mute game audio");let t=document.createElement("style");t.textContent="#awmutebtn{position:fixed;z-index:50;left:12px;top:calc(96px + env(safe-area-inset-top));width:42px;height:42px;border:2px solid #ffffff73;border-radius:50%;background:#0009;color:#fff;font:20px system-ui;display:grid;place-items:center;padding:0}",document.head.appendChild(t),this.quick.onclick=n=>{n.stopPropagation(),this.toggle()},document.body.appendChild(this.quick),this.syncButtons(),this.mountSetting(0),addEventListener("pointerdown",()=>{this.muted||this.start()},{once:!0})}makeEngine(e,t,n,i){let s=e.createOscillator(),r=e.createOscillator(),a=e.createGain(),o=e.createBiquadFilter();return s.type=t,r.type=t==="sawtooth"?"triangle":"square",r.detune.value=t==="sawtooth"?7:-5,a.gain.value=0,o.type="lowpass",o.frequency.value=i,s.connect(o),r.connect(o),o.connect(a),s.start(),r.start(),s.frequency.value=60,r.frequency.value=60*n,{a:s,b:r,gain:a,filter:o}}noise(e,t,n,i){let s=Math.floor(e.sampleRate*t),r=e.createBuffer(1,s,e.sampleRate),a=r.getChannelData(0),o=305419896;for(let d=0;d<s;d++)o=Math.imul(o,1664525)+1013904223|0,a[d]=((o>>>8)/8388607-1)*.75;let l=e.createBufferSource();l.buffer=r,l.loop=!0;let c=e.createBiquadFilter();c.type=n,c.frequency.value=i;let u=e.createGain();return u.gain.value=0,l.connect(c).connect(u),l.start(),{source:l,gain:u}}start(){if(this.audio){this.audio.ctx.resume();return}try{let e=new AudioContext,t=e.createGain(),n=e.createDynamicsCompressor();t.gain.value=this.muted?0:.68,t.connect(n).connect(e.destination);let i=this.makeEngine(e,"sawtooth",2.02,620),s=this.makeEngine(e,"square",1.51,1500),r=this.makeEngine(e,"sawtooth",1.01,440);i.gain.connect(t),s.gain.connect(t),r.gain.connect(t);let a=this.g.real.q.name==="low"?5:this.g.real.q.name==="med"?10:15,o=[];for(let p=0;p<a;p++){let m=e.createOscillator(),x=e.createGain(),v=e.createStereoPanner();m.type="sawtooth",m.frequency.value=65,x.gain.value=0,m.connect(x).connect(v).connect(t),m.start(),o.push({osc:m,gain:x,pan:v})}let l=this.noise(e,.7,"bandpass",1750),c=this.noise(e,2.3,"lowpass",720),u=this.noise(e,1.7,"bandpass",1050);l.gain.connect(t),c.gain.connect(t),u.gain.connect(t);let d=e.createOscillator(),f=e.createGain();d.frequency.value=.12,f.gain.value=.009,d.connect(f).connect(c.gain.gain),d.start(),this.audio={ctx:e,master:t,car:i,moto:s,plane:r,traffic:o,skid:l,waves:c,city:u},this.stats.started=!0,this.stats.trafficVoices=a,e.resume()}catch(e){console.warn("[aw-audio] WebAudio unavailable",e)}}toggle(){this.muted=!this.muted,this.stats.muted=this.muted;try{localStorage.setItem("aw_muted",this.muted?"1":"0")}catch{}if(this.muted||this.start(),this.audio){let{ctx:e,master:t}=this.audio;t.gain.setTargetAtTime(this.muted?0:.68,e.currentTime,.035)}this.syncButtons()}syncButtons(){this.quick.textContent=this.muted?"\u{1F507}":"\u{1F50A}",this.quick.title=this.muted?"Unmute audio":"Mute audio",this.setting&&(this.setting.textContent=this.muted?"Sound: OFF":"Sound: ON")}mountSetting(e){let t=document.getElementById("awtime");if(!t){e<60&&setTimeout(()=>this.mountSetting(e+1),500);return}let n=document.createElement("div");n.className="lbl",n.textContent="World audio";let i=document.createElement("div");i.className="row";let s=document.createElement("button");s.type="button",s.onclick=()=>this.toggle(),i.appendChild(s),t.append(n,i),this.setting=s,this.syncButtons()}engine(e,t,n,i){e.a.frequency.setTargetAtTime(t,i,.045),e.b.frequency.setTargetAtTime(t*2.01,i,.045),e.gain.gain.setTargetAtTime(n,i,.055)}update(){let e=this.audio;if(!e)return;let{ctx:t}=e,n=t.currentTime,i=this.g.S,s=i.mode;this.stats.mode=s;let r=Math.abs(i.car.s||0),a=Math.abs(i.plane.s||0);this.engine(e.car,52+r*4.8,s==="car"?.055+Math.min(.055,r*.003):0,n),this.engine(e.moto,92+r*10.5,s==="moto"?.045+Math.min(.065,r*.0035):0,n),this.engine(e.plane,42+a*.72,s==="plane"?.07+(i.plane.thr||0)*.065:0,n);let o=s==="car"?Math.min(.11,Math.abs(i.car.drift||0)*.13):0;e.skid.gain.gain.setTargetAtTime(o,n,.025);let l=s==="walk"?i.walk:s==="plane"?i.plane:i.car,c=this.g.real.amb;for(let m=0;m<e.traffic.length;m++){let x=e.traffic[m],v=c?.cars[m],_=0;if(v?.rd){let b=v.g.position.x-l.x,y=v.g.position.z-l.z,w=Math.hypot(b,y);w<100&&(_=.022*(1-w/100)**2),x.pan.pan.setTargetAtTime(Math.max(-.8,Math.min(.8,b/55)),n,.08),x.osc.frequency.setTargetAtTime(48+Math.abs(v.sp)*3.5,n,.07)}x.gain.gain.setTargetAtTime(_,n,.08)}let u=Math.hypot(l.x+8220,l.z+5750),d=Math.hypot(l.x+7150,l.z),f=Math.max(0,1-u/1900),p=Math.max(Math.max(0,1-d/1900),f*.45);e.waves.gain.gain.setTargetAtTime(.012+f*.026,n,.8),e.city.gain.gain.setTargetAtTime(p*.018,n,.8),e.master.gain.setTargetAtTime(this.muted||document.hidden?0:.68,n,.05)}};var Ap=[["Sunrise",6.75],["Noon",12.5],["Sunset",18.25],["Night",21.5]];function Ac(h,e){let t=document.createElement("style");t.textContent=`
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
      <div class="row">${Ap.map(([u,d])=>`<button data-h="${d}">${u}</button>`).join("")}</div>
      <div class="row"><button id="awfreeze"></button></div>
      <div class="lbl">Auto FPS guard</div>
      <div class="row"><button id="awguard"></button></div><div id="awfps"></div>`;let a=document.getElementById("streset");s.insertBefore(r,a),r.querySelectorAll("[data-h]").forEach(u=>u.addEventListener("click",()=>h.setHour(+u.dataset.h)));let o=r.querySelector("#awfreeze"),l=r.querySelector("#awguard");o.addEventListener("click",()=>h.setFrozen(!h.frozen)),l.addEventListener("click",()=>e.setEnabled(!e.enabled));let c=()=>{o.textContent=h.frozen?"\u25B6 Resume clock":"\u23F8 Freeze clock",l.textContent=e.enabled?"On (tap to turn off)":"Off (tap to turn on)"};h.onChange(c),e.onChange(c),c()};return i(),()=>{let s=document.getElementById("awfps");s&&(s.textContent=e.describe())}}var Tp=new Set(["bld:kit","parked","parkedHi","props"]),dr=class{constructor(e){g(this,"q",e);g(this,"folded",0);g(this,"buckets",0);g(this,"lastX",1e9);g(this,"lastZ",1e9);g(this,"dirty",new Set);g(this,"live",new Set)}fold(e){if(e.__awInst||e.state!=="built"||!e.group)return!1;let t=new Map;e.group.updateMatrixWorld(!0),e.group.traverse(r=>{let a=r;if(!a.isInstancedMesh||!Tp.has(a.name)||Array.isArray(a.material)||a.count===0)return;let o=a.name+"|"+a.geometry.uuid+"|"+a.material.uuid+"|"+a.castShadow+"|"+a.receiveShadow+"|"+(a.instanceColor?1:0),l=t.get(o);l||t.set(o,l=[]),l.push(a)});let n=[],i=new U,s=new U;for(let r of t.values()){if(r.length<2)continue;let a=0;for(let b of r)a+=b.count;let o=new Float32Array(a*16),l=new Float32Array(a),c=new Float32Array(a),u=r[0].instanceColor?new Float32Array(a*3):null,d=0;for(let b of r)for(let y=0;y<b.count;y++,d++)if(s.fromArray(b.instanceMatrix.array,y*16),i.multiplyMatrices(b.matrixWorld,s),i.toArray(o,d*16),l[d]=o[d*16+12],c[d]=o[d*16+14],u&&b.instanceColor)for(let w=0;w<3;w++)u[d*3+w]=b.instanceColor.array[y*3+w];let f=r[0],p=new pe(f.geometry,f.material,a);p.name="aw:inst:"+f.name,p.castShadow=f.castShadow,p.receiveShadow=f.receiveShadow,p.frustumCulled=!1,p.matrixAutoUpdate=!1,p.count=0,p.visible=!1,u&&(p.instanceColor=new ke(new Float32Array(a*3),3)),e.group.add(p);for(let b of r)b.parent?.remove(b),this.folded++;let m=1e9,x=-1e9,v=1e9,_=-1e9;for(let b=0;b<a;b++)m=Math.min(m,l[b]),x=Math.max(x,l[b]),v=Math.min(v,c[b]),_=Math.max(_,c[b]);n.push({kind:f.name,im:p,mats:o,cols:u,cx:l,cz:c,n:a,box:[m,v,x,_]}),this.buckets++}return e.__awInst=n,this.dirty.add(e),n.length>0}range(e){let t=this.q,n=t.contactR||220,i=t.parkHi||35;return e==="bld:kit"?[-1,t.kitR||0]:e==="parked"?[i,t.parkR||n]:e==="parkedHi"?[-1,i]:[-1,(t.detailR||150)*.5]}cull(e,t,n){for(let i of e.__awInst||[]){let[s,r]=this.range(i.kind),a=s<0?-1:s*s,o=(r+3)*(r+3),l=Math.max(i.box[0]-t,0,t-i.box[2]),c=Math.max(i.box[1]-n,0,n-i.box[3]);if(l*l+c*c>=o){i.im.count&&(i.im.count=0,i.im.visible=!1);continue}let u=i.im.instanceMatrix.array,d=i.im.instanceColor?i.im.instanceColor.array:null,f=0;for(let p=0;p<i.n;p++){let m=i.cx[p]-t,x=i.cz[p]-n,v=m*m+x*x;v>=o||v<a||(u.set(i.mats.subarray(p*16,p*16+16),f*16),d&&i.cols&&(d[f*3]=i.cols[p*3],d[f*3+1]=i.cols[p*3+1],d[f*3+2]=i.cols[p*3+2]),f++)}i.im.count=f,i.im.visible=f>0,f>0&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,f*16),i.im.instanceMatrix.needsUpdate=!0,i.im.instanceColor&&(i.im.instanceColor.clearUpdateRanges(),i.im.instanceColor.addUpdateRange(0,f*3),i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){for(let s of e.values())if(!s.__awInst&&s.state==="built"){(this.fold(s)||s.__awInst)&&this.live.add(s);break}if(this.live.size>e.size){let s=new Set(e.values());for(let r of this.live)if(!s.has(r)){for(let a of r.__awInst||[])a.im.dispose();this.live.delete(r),this.dirty.delete(r)}}if((t-this.lastX)**2+(n-this.lastZ)**2>16){this.lastX=t,this.lastZ=n;for(let s of this.live)this.dirty.add(s)}for(let s of this.dirty)this.cull(s,this.lastX,this.lastZ);this.dirty.clear()}};var fr=class{constructor(e){g(this,"g");g(this,"real");g(this,"mobile");g(this,"stats");g(this,"carSeen",new WeakSet);g(this,"t",0);g(this,"heroCap");g(this,"inst",null);g(this,"postDone",!1);g(this,"regionChanged",(e,t)=>{for(let n=t;n<e.children.length;n++)e.children[n].traverse(i=>{i.name==="bld:kit"&&i.castShadow&&(i.castShadow=!1,this.stats.kitNoShadow++)})});g(this,"trimPending",!1);g(this,"carDone",new WeakSet);g(this,"pedsDone",!1);this.g=e,this.real=e.real;let t=O.get("perfmobile"),n=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window;this.mobile=t==="1"?!0:t==="0"?!1:n,this.stats={instFolded:0,instBuckets:0,carMeshes:"",peds:"",glassFixed:0,frozen:0,merged:0,mergedFrom:0,kitNoShadow:0,heroHidden:0,mobile:this.mobile,changes:[]};let i=this.real.q.name;this.heroCap=i==="low"?700:i==="med"?1e3:this.mobile?1400:this.real.q.id==="desktop"?5e3:2e3,window.__awMMDiv=3,this.tierProfile(),O.get("inst")!=="0"&&(this.inst=new dr(this.real.q)),this.hookUpdate(),this.hookHero(),this.fixGlass()}tierProfile(){let e=this.real.q,t=this.g.renderer,n=this.stats.changes;if(this.mobile){if(e.name==="high"){let i=Math.min(window.devicePixelRatio||1,1.5);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 2->"+i));let s=this.real.sky.sun.shadow;s.mapSize.x>2048&&(s.mapSize.set(2048,2048),s.map?.dispose(),s.map=null,n.push("shadow 4096->2048")),Object.assign(e,{radius:1400,bldR:1400,roadR:900,kitR:100,parkR:250,contactR:300,detailR:500}),n.push("radius 2000->1400, bldR 1400, roadR 900, kitR 100, parkR 250, detailR 500"),this.trimPending=!0}else if(e.name==="med"){let i=Math.min(window.devicePixelRatio||1,1.35);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 1.5->"+i))}}}fixPost(){if(this.postDone)return;let e=window.__awPost;if(!e)return;this.postDone=!0,this.mobile&&e.ao&&(e.ao.enabled=!1,this.stats.changes.push("GTAO off"));let t=e.composer;if(this.mobile&&t)for(let n of[t.renderTarget1,t.renderTarget2])n&&n.samples>2&&(n.samples=2,n.dispose(),this.stats.changes.push("MSAA 4->2"))}fixGlass(){if(this.real.q.id==="desktop"&&!this.mobile)return;let e=[],t=this.g.car;t&&e.push(t);for(let n of this.g.scene.children)n.name!=="realistic"&&e.push(n);for(let n of e)this.carSeen.has(n)||(this.carSeen.add(n),n.traverse(i=>{let s=i.material;!s||Array.isArray(s)||!(s.transmission&&s.transmission>0)||(s.transmission=0,s.transparent=!0,s.color?.set(790807),s.opacity=.72,s.depthWrite=!1,s.roughness!==void 0&&(s.roughness=Math.min(s.roughness,.08)),s.needsUpdate=!0,this.stats.glassFixed++)}))}freeze(e,t){let n=e.userData;if(n.awFrozen)return;n.awFrozen=!0,n.awN=-1;let i=Object.getPrototypeOf(e).updateMatrixWorld;e.updateMatrixWorld=function(s){let r=this.userData;(s||this.matrixWorldNeedsUpdate||r.awN!==this.children.length)&&(r.awN!==this.children.length&&t&&t(this,r.awN>this.children.length?0:Math.max(0,r.awN)),r.awN=this.children.length,i.call(this,!0))},this.stats.frozen++}merge(e,t){let n=e.userData,i=0;if(e.traverse(()=>i++),n.awMergedN===i)return;e.updateMatrixWorld(!0);let s=new U().copy(e.matrixWorld).invert(),r=new Map,a=new Set;e.traverse(c=>{let u=c;if(!u.isMesh||u.isInstancedMesh||u.isSkinnedMesh||!u.geometry||!u.material||!u.visible||u.name.startsWith("aw:")||u.morphTargetInfluences||u.matrixWorld.determinant()<0)return;let d=u.parent,f=!0;for(;d&&d!==e;)f=f&&d.visible&&!(t&&t(d)),d=d.parent;if(!f||t&&t(u))return;let p=u.geometry,m=Object.keys(p.attributes).sort().join(","),x=[];if(Array.isArray(u.material)){if(!p.index||!p.groups.length)return;for(let v of p.groups){let _=u.material[v.materialIndex??0];_&&x.push({m:u,mat:_,start:v.start,count:v.count})}}else x.push({m:u,mat:u.material,start:0,count:1/0});for(let v of x){let _=[v.mat.uuid,m,p.index?1:0,u.castShadow,u.receiveShadow,u.renderOrder].join("|"),b=r.get(_);b||r.set(_,b=[]),b.push(v)}});let o=new U,l=new Map;for(let c of r.values())for(let u of c)l.set(u.m,(l.get(u.m)??!0)&&c.length>=2);for(let c of r.values()){let u=c.filter(x=>l.get(x.m));if(u.length<2)continue;let d=[];for(let x of u){let v=x.m.geometry,_=v.clone();_.morphAttributes={},_.clearGroups(),v.index&&x.count!==1/0&&_.setIndex(Array.from(v.index.array.slice(x.start,x.start+x.count))),o.multiplyMatrices(s,x.m.matrixWorld),_.applyMatrix4(o),d.push(_)}let f=nt(d,!1);if(d.forEach(x=>x.dispose()),!f){u.forEach(x=>l.set(x.m,!1));continue}f.computeBoundingSphere();let p=u[0].m,m=new H(f,u[0].mat);m.name="aw:merged",m.castShadow=p.castShadow,m.receiveShadow=p.receiveShadow,m.renderOrder=p.renderOrder,m.matrixAutoUpdate=!1,e.add(m);for(let x of u)a.add(x.m);this.stats.merged++,this.stats.mergedFrom+=u.length}for(let c of a)if(l.get(c))if(c.children.length){let u=c.geometry;c.geometry=new J,u.dispose(),c.castShadow=!1}else c.parent?.remove(c),c.geometry.dispose();i=0,e.traverse(()=>i++),n.awMergedN=i,e.updateMatrixWorld(!0)}mergeAll(){let e=[this.real.mon?.group,this.real.brands?.group];for(let t of e)if(t)for(let n of t.children)this.merge(n)}hookHero(){let e=this.real.hero;if(!e)return;let t=e.update.bind(e),n=this.heroCap;e.update=(i,s)=>{t(i,s);let r=0;for(let a of e.list)!a._g||!a._g.visible||Math.hypot(a.x-i,a.z-s)>n&&(a._g.visible=!1,a._sign&&(a._sign.visible=!1),r++);this.stats.heroHidden=r}}trim(e,t){this.trimPending=!1;let n=this.real,i=n.M,s=n.q.radius+300,r=0;for(let a of[...n.regions.values()]){if(a.state==="loading")continue;let o=i.X0+(a.rx+.5)*i.RS,l=i.Z0+(a.rz+.5)*i.RS;Math.hypot(o-e,l-t)-i.RS*.71>s&&(n.disposeRegion(a),r++)}r&&this.stats.changes.push("dropped "+r+" far regions")}hookUpdate(){let e=this.real,t=e.update.bind(e);e.update=(...n)=>{t(...n),this.trimPending&&this.trim(n[0],n[2]);for(let i of e.regions.values())i.group&&this.freeze(i.group,this.regionChanged);this.inst&&(this.inst.update(e.regions,n[0],n[2]),this.stats.instFolded=this.inst.folded,this.stats.instBuckets=this.inst.buckets),this.fixPost()};for(let n of[e.mon?.group,e.brands?.group,e.hero?.group])n&&this.freeze(n)}fixCar(){let e=this.g.car;if(!e||this.carDone.has(e))return;this.carDone.add(e);let t=0,n=0;e.traverse(r=>{r.isMesh&&t++}),e.updateMatrixWorld(!0);let i=e.matrixWorld.clone();e.matrixWorld.identity(),e.children.forEach(r=>r.updateMatrixWorld(!0)),this.merge(e,r=>/^Wheel(Front|Rear)(L|R)$/.test(r.name));let s=e.wheels||[];for(let r of s)this.merge(r.o);e.matrixWorld.copy(i),e.updateMatrixWorld(!0),e.traverse(r=>{r.isMesh&&n++}),this.stats.carMeshes=t+" -> "+n}fixPeds(){if(this.pedsDone||!this.mobile)return;let e=this.real.amb;if(!e)return;this.pedsDone=!0;let t=this.real.q.name,n=t==="high"?5:t==="med"?4:2,i=e.peds.length;for(let s of e.peds.splice(n))s.g.visible=!1,s.g.parent?.remove(s.g);for(let s of e.peds)s.g.traverse(r=>{r.castShadow=!1});this.stats.peds=i+" -> "+e.peds.length+" (no shadows)"}update(e){this.t-=e,!(this.t>0)&&(this.t=1,this.fixGlass(),this.fixCar(),this.fixPeds(),this.mergeAll())}};var pr=class{constructor(e){g(this,"g",e);g(this,"postDone",!1);let t=e.real,n=t.sky.sun.shadow;n.radius=t.q.name==="high"?6:t.q.name==="med"?4.5:3.5,t.roads.asphalt?.color?.isColor&&t.roads.asphalt.color.set(15001838);let i=new R(.94,1.06,.9);for(let s of["mFrond","mCanopy","mShrub"]){let r=t.veg[s];r&&r.color&&r.color.isColor&&r.color.multiply(i)}}update(e){let t=window.__awPost;if(!t||!t.grade)return;let n=t.grade.uniforms;this.postDone||(this.postDone=!0,n.uVib.value=.68,n.uContrast.value=1.12,n.uVig.value=.14,n.uLift.value.set(.008,.007,.002)),t.bloom&&(t.bloom.strength=.16+.04*e,t.bloom.threshold=1.05+.25*e)}};function Tc(h){let e=h*2654435761>>>0||1;return()=>(e=e*1664525+1013904223>>>0)/4294967296}function Ep(){let h=[],e=[],t=[],n=[];for(let s=0;s<3;s++){let r=s*Math.PI/3,a=Math.cos(r)*.5,o=Math.sin(r)*.5,l=h.length/3;h.push(-a,0,-o,a,0,o,a,1,o,-a,1,-o),e.push(0,0,1,0,1,1,0,1);for(let c=0;c<4;c++)t.push(0,1,0);n.push(l,l+1,l+2,l,l+2,l+3)}let i=new J;return i.setAttribute("position",new te(h,3)),i.setAttribute("normal",new te(t,3)),i.setAttribute("uv",new te(e,2)),i.setIndex(n),i}function Rp(){let h=[],e=[];for(let n=0;n<10;n++){let i=n/10*Math.PI*2+n%2*.3,s=.55+n%3*.15,r=.55+n%4*.08,a=Math.cos(i),o=Math.sin(i),l=-o*.05,c=a*.05,u=[a*Math.sin(s)*r,Math.cos(s)*r,o*Math.sin(s)*r];h.push(l,0,c,-l,0,-c,u[0],u[1],u[2]),h.push(-l,0,-c,l,0,c,u[0],u[1],u[2]);for(let d=0;d<6;d++)e.push(a*.5,.8,o*.5)}let t=new J;return t.setAttribute("position",new te(h,3)),t.setAttribute("normal",new te(e,3)),t}function uo(h){let t=document.createElement("canvas");t.width=t.height=256;let n=t.getContext("2d"),i=Tc(h==="boug"?7:11);if(h==="scrub"){n.lineCap="round";for(let o=0;o<60;o++){let l=256*(.35+i()*.3),c=-Math.PI/2+(i()-.5)*2.2,u=256*(.25+i()*.6);n.strokeStyle=`rgb(${80+i()*30},${70+i()*25},${55+i()*20})`,n.lineWidth=1.5+i()*2,n.beginPath(),n.moveTo(l,256),n.lineTo(l+Math.cos(c)*u,256+Math.sin(c)*u),n.stroke()}for(let o=0;o<700;o++){let l=i(),c=.15+Math.pow(i(),.8)*.8,u=256*(.5+(l-.5)*(.5+.5*c)),d=256*(1-c*.95),f=85+i()*50;n.fillStyle=`rgb(${f*.78+i()*20},${f},${f*.55})`,n.beginPath(),n.ellipse(u,d,2.5+i()*3,1.6+i()*2,i()*Math.PI,0,Math.PI*2),n.fill()}let a=new ze(t);return a.colorSpace=le,a.anisotropy=2,a}let s=h==="boug"?520:260;for(let a=0;a<s;a++){let o=i(),l=Math.pow(i(),.7),c=h==="grape"?.62*Math.sqrt(Math.max(0,1-Math.pow(l*1.05-.45,2)*3.2)):.35+.65*(1-l*.6),u=256*(.5+(o-.5)*c),d=256*(1-l*.95),f=70+i()*70;n.fillStyle=h==="boug"?`rgb(${30+i()*30},${f},${25+i()*25})`:i()<.12?`rgb(${150+i()*40},${90+i()*30},40)`:`rgb(${90+i()*40},${f+60},${45+i()*25})`,n.beginPath();let p=h==="boug"?5+i()*6:9+i()*9;n.ellipse(u,d,p,p*(h==="boug"?.6:.85),i()*Math.PI,0,Math.PI*2),n.fill()}if(h==="boug")for(let a=0;a<260;a++){let o=i(),l=.25+Math.pow(i(),.6)*.72,c=256*(.5+(o-.5)*(.3+.6*(1-l*.5))),u=256*(1-l*.95),d=i()<.8?318+i()*20:20+i()*15;n.fillStyle=`hsl(${d},${75+i()*20}%,${45+i()*15}%)`,n.beginPath(),n.arc(c,u,3+i()*5,0,Math.PI*2),n.fill()}let r=new ze(t);return r.colorSpace=le,r.anisotropy=2,r}var mr=class{constructor(e,t){g(this,"g",e);g(this,"stats",{skipped:0,regions:0,boug:0,aloe:0,grape:0,scrub:0,ac:0,awn:0,drawn:0});g(this,"card",Ep());g(this,"aloe",Rp());g(this,"mBoug");g(this,"mGrape");g(this,"mAloe");g(this,"mScrub");g(this,"mAC",new me({color:15329249,roughness:.55,metalness:.15}));g(this,"mAwn",new me({color:16777215,roughness:.8,metalness:0}));g(this,"acGeo",(()=>{let e=new ye(.85,.55,.42);return e.clearGroups(),e.translate(0,0,.21),e})());g(this,"awnGeo",(()=>{let e=new ye(1,.06,1);return e.clearGroups(),e.translate(0,0,.5),e})());g(this,"live",new Set);g(this,"gen",null);g(this,"genR",null);g(this,"budget",2);g(this,"lastX",1e9);g(this,"lastZ",1e9);g(this,"mul");g(this,"vegIdx",null);g(this,"vegSig","");g(this,"hb",null);g(this,"hbN",-1);let n=e.real.q.name;this.mul=(n==="low"?.6:n==="med"?.85:e.real.q.id==="desktop"?1.4:1)*(t?.8:1);let i=a=>new me({map:a,alphaTest:.45,side:Nt,roughness:.85,metalness:0});this.mBoug=i(uo("boug")),this.mGrape=i(uo("grape")),this.mScrub=i(uo("scrub")),this.mAloe=new me({color:new R(7311194),roughness:.6,metalness:0,side:Nt});let s=e.real,r=s.update.bind(s);s.update=(...a)=>{r(...a),this.update(s.regions,a[0],a[2])}}heightAt(e,t){return this.g.real.heightAt(e,t)}bucket(e,t,n,i,s,r,a){let o=i.length/16;if(!o)return null;let l=new pe(t,n,o);l.name="aw:flora:"+r,l.frustumCulled=!1,l.castShadow=!1,l.receiveShadow=!0,l.matrixAutoUpdate=!1,l.count=0,l.visible=!1;let c=new Float32Array(i),u=new Float32Array(o),d=new Float32Array(o),f=1e9,p=-1e9,m=1e9,x=-1e9;for(let _=0;_<o;_++)u[_]=c[_*16+12],d[_]=c[_*16+14],f=Math.min(f,u[_]),p=Math.max(p,u[_]),m=Math.min(m,d[_]),x=Math.max(x,d[_]);let v;return a&&(v=new Float32Array(a),l.instanceColor=new ke(new Float32Array(o*3),3)),e.group.add(l),{im:l,cols:v,mats:c,cx:u,cz:d,n:o,range:s*Math.sqrt(this.mul),box:[f,m,p,x]}}*build(e){let t=0,n=this.g.real.veg,i=Tc(e.rx*7919+e.rz*104729+13),s=new U,r=new re,a=new M,o=new M,l=new M(0,1,0),c=(S,E,C,I,P,L,F=.05)=>{r.setFromAxisAngle(l,L),o.set(E,this.heightAt(E,C)-F,C),a.set(I,P,I),s.compose(o,r,a);for(let D of s.elements)S.push(D)},u=[],d=[],f=[];for(let S of e.json?.b||[]){if((++t&31)===0&&(yield),!S.p||S.p.length<3||this.hidden(S))continue;let E=S.k==="house"||S.k==="res"||S.k==="apt";if(i()>(E?.38:.08)*this.mul)continue;let C=0,I=0;for(let[k,Q]of S.p)C+=k,I+=Q;C/=S.p.length,I/=S.p.length;let P=Math.floor(i()*S.p.length),[L,F]=S.p[P],[D,G]=S.p[(P+1)%S.p.length],K=D-L,j=G-F,V=Math.hypot(K,j);if(V<2.5)continue;let W=-j/V,$=K/V,he=(L+D)/2,ue=(F+G)/2;(he-C)*W+(ue-I)*$<0&&(W=-W,$=-$);let ee=1+Math.floor(i()*3);for(let k=0;k<ee;k++){let Q=.2+i()*.6,Ft=L+K*Q+W*.8,ge=F+j*Q+$*.8;c(u,Ft,ge,1.5+i()*1.2,1.4+i()*1.4,i()*6.28)}}for(let[S,,E]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((S-this.M().X0)/this.M().RS)!==e.rx||Math.floor((E-this.M().Z0)/this.M().RS)!==e.rz||i()>.5*this.mul)continue;let C=1+Math.floor(i()*4);for(let I=0;I<C;I++){let P=i()*6.28,L=1.5+i()*4,F=.7+i()*.8;c(d,S+Math.cos(P)*L,E+Math.sin(P)*L,F,F*(.8+i()*.5),i()*6.28,.02)}}for(let[S,E,C]of this.vegFor(e,"p")){if((++t&255)===0&&(yield),E>3.5||Math.floor((S-this.M().X0)/this.M().RS)!==e.rx||Math.floor((C-this.M().Z0)/this.M().RS)!==e.rz||i()>.45*this.mul)continue;let I=i()*6.28,P=3+i()*5;c(f,S+Math.cos(I)*P,C+Math.sin(I)*P,2.4+i()*1.8,1.6+i()*1.4,i()*6.28)}let p=[],m=[],x=[],v=[2062988,14241584,15905076,3050327,8011421,15231634,2841027,16052712],_=new R,b=new re,y=new M(1,0,0),w=(S,E,C,I,P,L,F,D,G=0)=>{r.setFromAxisAngle(l,P),G&&r.multiply(b.setFromAxisAngle(y,G)),o.set(E,I,C),a.set(L,F,D),s.compose(o,r,a);for(let K of s.elements)S.push(K)};for(let S of e.json?.b||[]){if((++t&31)===0&&(yield),!S.p||S.p.length<3||this.hidden(S))continue;let E=S.k==="com"||S.k==="shop"||S.k==="retail",C=S.k==="house"||S.k==="res"||S.k==="apt";if(!E&&!C)continue;let I=0,P=0;for(let[D,G]of S.p)I+=D,P+=G;I/=S.p.length,P/=S.p.length;let L=S.h||4,F=Math.min(S.p.length,6);for(let D=0;D<F;D++){let[G,K]=S.p[D],[j,V]=S.p[(D+1)%S.p.length],W=j-G,$=V-K,he=Math.hypot(W,$);if(he<3)continue;let ue=-$/he,ee=W/he,k=(G+j)/2,Q=(K+V)/2;(k-I)*ue+(Q-P)*ee<0&&(ue=-ue,ee=-ee);let Ft=Math.atan2(ue,ee);if(i()<(E?.45:.28)*this.mul){let ge=.15+i()*.7,ve=G+W*ge+ue*.03,Me=K+$*ge+ee*.03,Ue=this.heightAt(ve,Me),it=L>6&&i()<.5?3+Math.floor(i()*Math.max(1,(L-4)/3))*3:0;w(p,ve,Me,Ue+Math.min(L-.8,2.3+it),Ft,1,1,1)}if(E&&he>4&&i()<.5*this.mul){let ge=Math.min(he*.8,3+i()*6),ve=.5,Me=G+W*ve+ue*.02,Ue=K+$*ve+ee*.02;w(m,Me,Ue,this.heightAt(Me,Ue)+Math.min(L-.4,2.9),Ft,ge,1,1.1+i()*.5,.32),_.setHex(v[Math.floor(i()*v.length)]).convertSRGBToLinear(),x.push(_.r,_.g,_.b)}}}let T=[];for(let[S,,E]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((S-this.M().X0)/this.M().RS)!==e.rx||Math.floor((E-this.M().Z0)/this.M().RS)!==e.rz||i()>.7*this.mul)continue;let C=1+Math.floor(i()*3);for(let I=0;I<C;I++){let P=i()*6.28,L=2+i()*7;c(T,S+Math.cos(P)*L,E+Math.sin(P)*L,1.8+i()*2.2,1.1+i()*1.4,i()*6.28)}}this.stats.scrub+=T.length/16,this.stats.ac+=p.length/16,this.stats.awn+=m.length/16;let A=[];for(let S of[this.bucket(e,this.card,this.mBoug,u,180,"boug"),this.bucket(e,this.aloe,this.mAloe,d,110,"aloe"),this.bucket(e,this.card,this.mGrape,f,220,"grape"),this.bucket(e,this.card,this.mScrub,T,320,"scrub"),this.bucket(e,this.acGeo,this.mAC,p,140,"ac"),this.bucket(e,this.awnGeo,this.mAwn,m,260,"awn",x)])S&&A.push(S);this.stats.boug+=u.length/16,this.stats.aloe+=d.length/16,this.stats.grape+=f.length/16,this.stats.regions++,e.__awFlora=A,this.live.add(e)}hidden(e){let t=this.g.real,n=0,i=0;for(let[s,r]of e.p)n+=s,i+=r;n/=e.p.length,i/=e.p.length;for(let s of this.heroBoxes())if(n>s[0]&&n<s[2]&&i>s[1]&&i<s[3])return this.stats.skipped++,!0;try{if(t.mon&&t.mon.excluded&&t.mon.excluded(n,i,e))return this.stats.skipped++,!0;if(t.hero&&(t.hero.pts.length||t.hero.polys.length)&&this.nearHero(n,i)&&t.hero.hides(e.p))return this.stats.skipped++,!0}catch{}return!1}vegFor(e,t){let n=this.g.real.veg.lists,i=(n.k||[]).length+":"+(n.p||[]).length+":"+(n.k||[]).reduce((r,a)=>r+a.length,0)+":"+(n.p||[]).reduce((r,a)=>r+a.length,0);if(!this.vegIdx||i!==this.vegSig){this.vegSig=i,this.vegIdx=new Map;let r=this.M();for(let a of["k","p"])for(let o of n[a]||[])for(let l of o){let c=Math.floor((l[0]-r.X0)/r.RS)+","+Math.floor((l[2]-r.Z0)/r.RS),u=this.vegIdx.get(c);u||this.vegIdx.set(c,u={k:[],p:[]}),u[a].push(l)}}let s=this.vegIdx.get(e.rx+","+e.rz);return s?s[t]:[]}heroBoxes(){let e=this.g.real.hero,t=e&&e.list||[];if(this.hb&&this.hbN===t.length)return this.hb;this.hb=[],this.hbN=t.length;for(let n of t){let i=n.foot||(Array.isArray(n.hero?.hide_footprint)?n.hero.hide_footprint:null);if(i&&i.length>2){let s=1e9,r=1e9,a=-1e9,o=-1e9;for(let[l,c]of i)s=Math.min(s,l),a=Math.max(a,l),r=Math.min(r,c),o=Math.max(o,c);this.hb.push([s-6,r-6,a+6,o+6])}else Number.isFinite(n.x)&&this.hb.push([n.x-30,n.z-30,n.x+30,n.z+30])}return this.hb}nearHero(e,t){for(let n of this.heroBoxes())if(e>n[0]-60&&e<n[2]+60&&t>n[1]-60&&t<n[3]+60)return!0;return!1}M(){return this.g.real.M}cull(e,t,n){for(let i of e.__awFlora||[]){let s=i.range*i.range,r=Math.max(i.box[0]-t,0,t-i.box[2]),a=Math.max(i.box[1]-n,0,n-i.box[3]);if(r*r+a*a>=s){i.im.count=0,i.im.visible=!1;continue}let o=i.im.instanceMatrix.array,l=0;for(let c=0;c<i.n;c++){let u=i.cx[c]-t,d=i.cz[c]-n;u*u+d*d<s&&(o.set(i.mats.subarray(c*16,c*16+16),l*16),i.cols&&i.im.instanceColor.array.set(i.cols.subarray(c*3,c*3+3),l*3),l++)}i.im.count=l,i.im.visible=l>0,l&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,l*16),i.im.instanceMatrix.needsUpdate=!0,i.cols&&(i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){let i=performance.now();if(!this.gen){for(let r of e.values())if(!r.__awFlora&&r.state==="built"&&r.group&&r.json){this.gen=this.build(r),this.genR=r;break}}for(;this.gen&&performance.now()-i<this.budget;){if(this.genR&&this.genR.state!=="built"){this.gen=null;break}this.gen.next().done&&(this.gen=null,this.lastX=1e9)}if(this.live.size>e.size){let r=new Set(e.values());for(let a of this.live)if(!r.has(a)){for(let o of a.__awFlora||[])o.im.dispose();this.live.delete(a)}}if((t-this.lastX)**2+(n-this.lastZ)**2<36)return;this.lastX=t,this.lastZ=n;let s=0;for(let r of this.live){this.cull(r,t,n);for(let a of r.__awFlora||[])s+=a.im.count}this.stats.drawn=s}};var gr=class{constructor(e,t){g(this,"g",e);g(this,"budget",t);g(this,"stats",{jobs:0,maxMs:0,ticks:0,maxJob:0});g(this,"ord",new WeakMap);g(this,"cost",[]);g(this,"ch",new MessageChannel);g(this,"pending",!1);window.__awJobB=-1,this.ch.port1.onmessage=()=>this.run()}frame(){let e=this.g.real;this.pending||!e.queue.length||(this.pending=!0,this.ch.port2.postMessage(0))}run(){this.pending=!1;let e=this.g.real,t=performance.now(),n=e.queue.length>120?this.budget*1.5:this.budget,i=0;for(;e.queue.length&&performance.now()-t<n;){let r=e.queue[0],a=this.ord.get(r.R)??0,o=this.cost[a]||0;if(i>0&&performance.now()-t+o>n)break;e.queue.shift(),this.ord.set(r.R,a+1);let l=performance.now();if(e.regions.get(r.R.rx+","+r.R.rz)===r.R)try{r.f()}catch(u){console.error("[aw-jobs]",u)}let c=performance.now()-l;this.cost[a]=this.cost[a]?this.cost[a]*.7+c*.3:c,c>this.stats.maxJob&&(this.stats.maxJob=c),this.stats.jobs++,i++}let s=performance.now()-t;this.stats.ticks++,s>this.stats.maxMs&&(this.stats.maxMs=s)}};var Cp=[13617856,12433840,11975099,14078664],Ip=[10508348,11232326,9720122,11693646],Pp=[14271098,14199472,9616823,14605264,14069376,11453338,10926543,13605516],xr=class{constructor(e,t){g(this,"g",e);g(this,"walls",t);g(this,"mesh",null);g(this,"stats",{buildings:0,tris:0,masked:0,ms:0});g(this,"mask",new Uint8Array(1024*4));g(this,"tex",new Tt(this.mask,32,32,mn,pn));g(this,"t",0);this.tex.needsUpdate=!0,this.load().catch(n=>console.warn("[aw-far] disabled:",n))}async load(){let e=await fetch("./data/far/massing.bin");if(!e.ok)return;let t=await e.arrayBuffer(),n=new DataView(t);if(n.getUint32(0,!0)!==826693441)return;let i=performance.now(),s=n.getUint32(4,!0);if(t.byteLength<8+s*14){console.warn("[aw-far] massing.bin truncated",t.byteLength,s);return}let r=this.g.real,a=(S,E,C)=>this.walls&&(S>=7||E*C*4>350),o=0,l=0;for(let S=0;S<s;S++){let E=8+S*14,C=n.getInt16(E+4,!0)/20,I=n.getInt16(E+6,!0)/20,P=n.getUint8(E+8)/4,L=n.getUint8(E+9)/4;o+=4,l+=6,a(L,P,Math.hypot(C,I))&&(o+=16,l+=24)}let c=new Float32Array(o*3),u=new Float32Array(o*3),d=new Uint8Array(o*4),f=new Float32Array(o),p=new Uint32Array(l),m=0,x=0,v=new R,_=new R(13219740).convertSRGBToLinear(),b=(S,E,C,I,P,L,F)=>(c[m*3]=S,c[m*3+1]=E,c[m*3+2]=C,u[m*3]=I,u[m*3+1]=P,u[m*3+2]=L,d[m*4]=v.r*255,d[m*4+1]=v.g*255,d[m*4+2]=v.b*255,d[m*4+3]=255,f[m]=F,m++);for(let S=0;S<s;S++){let E=8+S*14,C=n.getInt16(E,!0)/2,I=n.getInt16(E+2,!0)/2,P=n.getInt16(E+4,!0)/20,L=n.getInt16(E+6,!0)/20,F=n.getUint8(E+8)/4,D=n.getUint8(E+9)/4,G=n.getUint8(E+10),K=n.getUint8(E+11),j=n.getUint16(E+12,!0),V=Math.hypot(P,L)||1,W=-L/V*F,$=P/V*F,he=r.heightAt(C,I)-.5,ue=he+.5+D,ee=[[C-P-W,I-L-$],[C+P-W,I+L-$],[C+P+W,I+L+$],[C-P+W,I-L+$]],k=G>>4;v.setHex(k?Ip[K&3]:Cp[K&3]).convertSRGBToLinear().lerp(_,.35);let Q=ee.map(([ge,ve])=>b(ge,ue,ve,0,1,0,j));if((ee[1][0]-ee[0][0])*(ee[2][1]-ee[0][1])-(ee[1][1]-ee[0][1])*(ee[2][0]-ee[0][0])<0?(p[x++]=Q[0],p[x++]=Q[1],p[x++]=Q[2],p[x++]=Q[0],p[x++]=Q[2],p[x++]=Q[3]):(p[x++]=Q[0],p[x++]=Q[2],p[x++]=Q[1],p[x++]=Q[0],p[x++]=Q[3],p[x++]=Q[2]),a(D,F,V)){v.setHex(Pp[K>>2&7]).convertSRGBToLinear().lerp(_,.4).multiplyScalar(.85);for(let ge=0;ge<4;ge++){let[ve,Me]=ee[ge],[Ue,it]=ee[ge+1&3],pt=it-Me,mt=-(Ue-ve),Ko=Math.hypot(pt,mt)||1;pt/=Ko,mt/=Ko,((ve+Ue)/2-C)*pt+((Me+it)/2-I)*mt<0&&(pt=-pt,mt=-mt);let Zo=b(ve,he,Me,pt,0,mt,j),sh=b(Ue,he,it,pt,0,mt,j),jo=b(Ue,ue,it,pt,0,mt,j),rh=b(ve,ue,Me,pt,0,mt,j);p[x++]=Zo,p[x++]=sh,p[x++]=jo,p[x++]=Zo,p[x++]=jo,p[x++]=rh}}}let y=new J;y.setAttribute("position",new Z(c,3)),y.setAttribute("normal",new Z(u,3)),y.setAttribute("color",new Z(d,4,!0)),y.setAttribute("aReg",new Z(f,1)),y.setIndex(new Z(p,1));let w=new tt({vertexColors:!0,side:2}),T=this.tex;w.onBeforeCompile=S=>{S.uniforms.uMask={value:T},S.vertexShader=S.vertexShader.replace("#include <common>",`#include <common>
attribute float aReg; uniform sampler2D uMask;`).replace("#include <project_vertex>",`#include <project_vertex>
  { float rx = floor(aReg / 32.0), rz = aReg - rx * 32.0;
    if (texture2D(uMask, (vec2(rx, rz) + 0.5) / 32.0).r > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }`)},w.customProgramCacheKey=()=>"awFarCity";let A=new H(y,w);A.name="aw:farCity",A.frustumCulled=!1,A.castShadow=!1,A.receiveShadow=!1,A.matrixAutoUpdate=!1,this.g.scene.add(A),this.mesh=A,this.stats.buildings=s,this.stats.tris=l/3,this.stats.ms=Math.round(performance.now()-i),this.t=0}update(e){let n=this.g.camera.position.y,i=Math.max(0,Math.min(1,(n-25)/140)),s=window;if(s.__awFar=12e3+1e4*i,s.__awFogK=1-.55*i,!this.mesh||(this.t-=e,this.t>0))return;this.t=.25;let r=this.g.real.regions;this.mask.fill(0);let a=0;for(let[o,l]of r){if(l.state!=="built")continue;let[c,u]=o.split(",").map(Number);c<0||u<0||c>31||u>31||(this.mask[(u*32+c)*4]=255,a++)}this.stats.masked=a,this.tex.needsUpdate=!0}};var Ui={desktop:"high",high:"med",med:"low"},vr=class{constructor(e,t){g(this,"g",e);g(this,"stats",{lost:0,prCap:0});let n=e.renderer.domElement;n.addEventListener("webglcontextlost",i=>this.lost(i),!1),n.addEventListener("webglcontextrestored",()=>location.reload(),!1),t||(this.cap(),addEventListener("resize",()=>this.cap()))}tier(){let e=this.g.real.q;return e.id||e.name}cap(){let e=this.tier();if(e!=="high"&&e!=="desktop")return;let t=this.g.renderer,n=e==="desktop"?8e6:24e5,i=innerWidth*innerHeight,s=Math.min(devicePixelRatio||1,e==="desktop"?3:2),r=Math.max(1,Math.min(s,Math.sqrt(n/Math.max(1,i))));window.__awPRCap=r,t.getPixelRatio()>r+.01&&(t.setPixelRatio(r),this.stats.prCap=+r.toFixed(2),dispatchEvent(new Event("resize")))}lost(e){e.preventDefault(),this.stats.lost++;let t=this.tier(),n="aw_ctxlost_"+t,i=0;try{i=+(sessionStorage.getItem(n)||0)+1,sessionStorage.setItem(n,String(i))}catch{}if(i>=2&&Ui[t])try{localStorage.setItem("aw_q",Ui[t])}catch{}let s=document.createElement("div");s.textContent=i>=2&&Ui[t]?`Graphics reset - switching to ${Ui[t].toUpperCase()}\u2026`:"Graphics reset - reloading\u2026",s.style.cssText="position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:99999;background:#000c;color:#fff;padding:14px 18px;border-radius:12px;font:600 15px system-ui",document.body.appendChild(s),setTimeout(()=>{let r=new URL(location.href);i>=2&&Ui[t]&&r.searchParams.delete("q"),location.href=r.toString()},2500)}};var _r=class{constructor(e){g(this,"g",e);g(this,"c",document.createElement("canvas"));g(this,"x");g(this,"buf",new Float32Array(300));g(this,"i",0);g(this,"n",0);g(this,"t",0);g(this,"txt","");this.c.width=300,this.c.height=96,this.c.style.cssText="position:fixed;left:8px;bottom:8px;z-index:9999;pointer-events:none;background:#000a;border-radius:6px;width:300px;height:96px",document.body.appendChild(this.c),this.x=this.c.getContext("2d")}frame(e){if(this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n=Math.min(this.n+1,this.buf.length),this.t+=e,this.t>500){this.t=0;let r=Array.from(this.buf.subarray(0,this.n)).sort((l,c)=>l-c),a=l=>r[Math.min(r.length-1,Math.floor(l*r.length))],o=this.g.renderer;this.txt=`p50 ${a(.5).toFixed(1)}  p95 ${a(.95).toFixed(1)}  p99 ${a(.99).toFixed(1)}  max ${r[r.length-1].toFixed(0)} ms \xB7 pr ${o.getPixelRatio().toFixed(2)}`}let t=this.x,n=300,i=96,s=70/50;t.clearRect(0,0,n,i);for(let r=0;r<this.n;r++){let a=this.buf[(this.i-this.n+r+this.buf.length)%this.buf.length];t.fillStyle=a<17.5?"#3c3":a<34?"#ec3":"#e33";let o=Math.min(70,a*s);t.fillRect(r,i-o,1,o)}t.fillStyle="#fff8",t.fillRect(0,i-16.7*s,n,1),t.fillRect(0,i-33.3*s,n,1),t.fillStyle="#fff",t.font="11px monospace",t.fillText(this.txt,4,12)}};function br(h){let e=new Map,t=new Map,n=h.clone();return Ec(h,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,r=e.get(i),a=r.skeleton.bones;s.skeleton=r.skeleton.clone(),s.bindMatrix.copy(r.bindMatrix),s.skeleton.bones=a.map(function(o){return t.get(o)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Ec(h,e,t){t(h,e);for(let n=0;n<h.children.length;n++)Ec(h.children[n],e.children[n],t)}var Zn=class extends ht{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new _o(t)}),this.register(function(t){return new bo(t)}),this.register(function(t){return new Co(t)}),this.register(function(t){return new Io(t)}),this.register(function(t){return new Po(t)}),this.register(function(t){return new Mo(t)}),this.register(function(t){return new So(t)}),this.register(function(t){return new wo(t)}),this.register(function(t){return new Ao(t)}),this.register(function(t){return new vo(t)}),this.register(function(t){return new To(t)}),this.register(function(t){return new yo(t)}),this.register(function(t){return new Ro(t)}),this.register(function(t){return new Eo(t)}),this.register(function(t){return new go(t)}),this.register(function(t){return new yr(t,q.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new yr(t,q.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Lo(t)})}load(e,t,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let l=Lt.extractUrlBase(e);r=Lt.resolveURL(l,this.path)}else r=Lt.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){i?i(l):console.error(l),s.manager.itemError(e),s.manager.itemEnd(e)},o=new Vn(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){try{s.parse(l,r,function(c){t(c),s.manager.itemEnd(e)},a)}catch(c){a(c)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,r={},a={},o=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(o.decode(new Uint8Array(e,0,4))===Lc){try{r[q.KHR_BINARY_GLTF]=new No(e)}catch(u){i&&i(u);return}s=JSON.parse(r[q.KHR_BINARY_GLTF].content)}else s=JSON.parse(o.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new zo(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let c=0;c<this.pluginCallbacks.length;c++){let u=this.pluginCallbacks[c](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,r[u.name]=!0}if(s.extensionsUsed)for(let c=0;c<s.extensionsUsed.length;++c){let u=s.extensionsUsed[c],d=s.extensionsRequired||[];switch(u){case q.KHR_MATERIALS_UNLIT:r[u]=new xo;break;case q.KHR_DRACO_MESH_COMPRESSION:r[u]=new Do(s,this.dracoLoader);break;case q.KHR_TEXTURE_TRANSFORM:r[u]=new Uo;break;case q.KHR_MESH_QUANTIZATION:r[u]=new Fo;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(r),l.setPlugins(a),l.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function Lp(){let h={};return{get:function(e){return h[e]},add:function(e,t){h[e]=t},remove:function(e){delete h[e]},removeAll:function(){h={}}}}function de(h,e,t){let n=h.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var q={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},go=class{constructor(e){this.parser=e,this.name=q.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,o=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],l,c=new R(16777215);o.color!==void 0&&c.setRGB(o.color[0],o.color[1],o.color[2],Be);let u=o.range!==void 0?o.range:0;switch(o.type){case"directional":l=new Ri(c),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new un(c),l.distance=u;break;case"spot":l=new hn(c),l.distance=u,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,l.angle=o.spot.outerConeAngle,l.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}return l.position.set(0,0,0),ut(l,o),o.intensity!==void 0&&(l.intensity=o.intensity),l.name=t.createUniqueName(o.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(o){return n._getNodeRef(t.cache,a,o)})}},xo=class{constructor(){this.name=q.KHR_MATERIALS_UNLIT}getMaterialType(){return be}extendParams(e,t,n){let i=[];e.color=new R(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],Be),e.opacity=r[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,le))}return Promise.all(i)}},vo=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},_o=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new B(s,s)}return Promise.all(i)}},bo=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_DISPERSION}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},yo=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},Mo=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_SHEEN}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new R(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],Be)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,le)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},So=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},wo=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_VOLUME}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new R().setRGB(s[0],s[1],s[2],Be),Promise.all(i)}},Ao=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_IOR}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},To=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_SPECULAR}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new R().setRGB(s[0],s[1],s[2],Be),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,le)),Promise.all(i)}},Eo=class{constructor(e){this.parser=e,this.name=q.EXT_MATERIALS_BUMP}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},Ro=class{constructor(e){this.parser=e,this.name=q.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return de(this.parser,e,this.name)!==null?Le:null}extendMaterialParams(e,t){let n=de(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Co=class{constructor(e){this.parser=e,this.name=q.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,r)}},Io=class{constructor(e){this.parser=e,this.name=q.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(o=l)}return n.loadTextureImage(e,r.source,o)}},Po=class{constructor(e){this.parser=e,this.name=q.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(o=l)}return n.loadTextureImage(e,r.source,o)}},yr=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){let o=i.byteOffset||0,l=i.byteLength||0,c=i.count,u=i.byteStride,d=new Uint8Array(a,o,l);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(c,u,d,i.mode,i.filter).then(function(f){return f.buffer}):r.ready.then(function(){let f=new ArrayBuffer(c*u);return r.decodeGltfBuffer(new Uint8Array(f),c,u,d,i.mode,i.filter),f})})}else return null}},Lo=class{constructor(e){this.name=q.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let l of i.primitives)if(l.mode!==qe.TRIANGLES&&l.mode!==qe.TRIANGLE_STRIP&&l.mode!==qe.TRIANGLE_FAN&&l.mode!==void 0)return null;let r=n.extensions[this.name].attributes,a=[],o={};for(let l in r)a.push(this.parser.getDependency("accessor",r[l]).then(c=>(o[l]=c,o[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{let c=l.pop(),u=c.isGroup?c.children:[c],d=l[0].count,f=[];for(let p of u){let m=new U,x=new M,v=new re,_=new M(1,1,1),b=new pe(p.geometry,p.material,d);for(let w=0;w<d;w++)o.TRANSLATION&&x.fromBufferAttribute(o.TRANSLATION,w),o.ROTATION&&v.fromBufferAttribute(o.ROTATION,w),o.SCALE&&_.fromBufferAttribute(o.SCALE,w),b.setMatrixAt(w,m.compose(x,v,_));let y=null;for(let w in o)if(w==="_COLOR_0"){let T=o[w];b.instanceColor=new ke(T.array,T.itemSize,T.normalized)}else if(w!=="TRANSLATION"&&w!=="ROTATION"&&w!=="SCALE"){if(y===null){let A=b.geometry;y=new J,y.name=A.name;for(let S in A.attributes)y.setAttribute(S,A.attributes[S]);for(let S in A.morphAttributes)y.morphAttributes[S]=A.morphAttributes[S];A.index!==null&&y.setIndex(A.index),y.morphTargetsRelative=A.morphTargetsRelative;for(let S of A.groups)y.addGroup(S.start,S.count,S.materialIndex);A.boundingBox!==null&&(y.boundingBox=A.boundingBox.clone()),A.boundingSphere!==null&&(y.boundingSphere=A.boundingSphere.clone()),y.drawRange.start=A.drawRange.start,y.drawRange.count=A.drawRange.count,y.userData=Object.assign({},A.userData),b.geometry=y}let T=o[w];y.setAttribute(w,new ke(T.array,T.itemSize,T.normalized))}ce.prototype.copy.call(b,p),this.parser.assignFinalMaterial(b),f.push(b)}return c.isGroup?(c.clear(),c.add(...f),c):f[0]}))}},Lc="glTF",Fi=12,Rc={JSON:1313821514,BIN:5130562},No=class{constructor(e){this.name=q.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Fi),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Lc)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Fi,s=new DataView(e,Fi),r=0;for(;r<i;){let a=s.getUint32(r,!0);r+=4;let o=s.getUint32(r,!0);if(r+=4,o===Rc.JSON){let l=new Uint8Array(e,Fi+r,a);this.content=n.decode(l)}else if(o===Rc.BIN){let l=Fi+r;this.body=e.slice(l,l+a)}r+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Do=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=q.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,a={},o={},l={};for(let c in r){let u=Bo[c]||c.toLowerCase();a[u]=r[c]}for(let c in e.attributes){let u=Bo[c]||c.toLowerCase();if(r[c]!==void 0){let d=n.accessors[e.attributes[c]],f=Kn[d.componentType];l[u]=f.name,o[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(c){return new Promise(function(u,d){i.decodeDracoFile(c,function(f){for(let p in f.attributes){let m=f.attributes[p],x=o[p];x!==void 0&&(m.normalized=x)}u(f)},a,l,Be,d)})})}},Uo=class{constructor(){this.name=q.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Fo=class{constructor(){this.name=q.KHR_MESH_QUANTIZATION}},Mr=class extends ct{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)t[r]=n[s+r];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=a*2,l=a*3,c=i-t,u=(n-t)/c,d=u*u,f=d*u,p=e*l,m=p-l,x=-2*f+3*d,v=f-d,_=1-x,b=v-d+u;for(let y=0;y!==a;y++){let w=r[m+y+a],T=r[m+y+o]*c,A=r[p+y+a],S=r[p+y]*c;s[y]=_*w+b*T+x*A+v*S}return s}},Np=new re,Oo=class extends Mr{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return Np.fromArray(s).normalize().toArray(s),s}},qe={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Kn={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Cc={9728:On,9729:Dt,9984:Va,9985:Xa,9986:Wa,9987:fn},Ic={33071:Qt,33648:fi,10497:wt},fo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Bo={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Kt={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Dp={CUBICSPLINE:void 0,LINEAR:sn,STEP:nn},po={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Up(h){return h.DefaultMaterial===void 0&&(h.DefaultMaterial=new me({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ni})),h.DefaultMaterial}function xn(h,e,t){for(let n in t.extensions)h[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function ut(h,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(h.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Fp(h,e,t){let n=!1,i=!1,s=!1;for(let l=0,c=e.length;l<c;l++){let u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(h);let r=[],a=[],o=[];for(let l=0,c=e.length;l<c;l++){let u=e[l];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):h.attributes.position;r.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):h.attributes.normal;a.push(d)}if(s){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):h.attributes.color;o.push(d)}}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o)]).then(function(l){let c=l[0],u=l[1],d=l[2];return n&&(h.morphAttributes.position=c),i&&(h.morphAttributes.normal=u),s&&(h.morphAttributes.color=d),h.morphTargetsRelative=!0,h})}function Op(h,e){if(h.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)h.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(h.morphTargetInfluences.length===t.length){h.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)h.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Bp(h){let e,t=h.extensions&&h.extensions[q.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+mo(t.attributes):e=h.indices+":"+mo(h.attributes)+":"+h.mode,h.targets!==void 0)for(let n=0,i=h.targets.length;n<i;n++)e+=":"+mo(h.targets[n]);return e}function mo(h){let e="",t=Object.keys(h).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+h[t[n]]+";";return e}function ko(h){switch(h){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function kp(h){return h.search(/\.jpe?g($|\?)/i)>0||h.search(/^data\:image\/jpeg/)===0?"image/jpeg":h.search(/\.webp($|\?)/i)>0||h.search(/^data\:image\/webp/)===0?"image/webp":h.search(/\.ktx2($|\?)/i)>0||h.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var zp=new U,zo=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Lp,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let o=a.match(/Version\/(\d+)/);i=n&&o?parseInt(o[1],10):-1,s=a.indexOf("Firefox")>-1,r=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&r<98?this.textureLoader=new Ti(this.options.manager):this.textureLoader=new Ii(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Vn(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let a={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return xn(s,a,i),ut(a,i),Promise.all(n._invokeAll(function(o){return o.afterRoot&&o.afterRoot(a)})).then(function(){for(let o of a.scenes)o.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i].joints;for(let a=0,o=r.length;a<o;a++)e[r[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(r,a)=>{let o=this.associations.get(r);o!=null&&this.associations.set(a,o);for(let[l,c]of r.children.entries())s(c,a.children[l])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[q.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(Lt.resolveURL(t.uri,i.path),s,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=fo[i.type],a=Kn[i.componentType],o=i.normalized===!0,l=new a(i.count*r);return Promise.resolve(new Z(l,r,o))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(r){let a=r[0],o=fo[i.type],l=Kn[i.componentType],c=l.BYTES_PER_ELEMENT,u=c*o,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,m,x;if(f&&f!==u){let v=Math.floor(d/f),_="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+v+":"+i.count,b=t.cache.get(_);b||(m=new l(a,v*f,i.count*f/c),b=new rn(m,f/c),t.cache.add(_,b)),x=new Wt(b,o,d%f/c,p)}else a===null?m=new l(i.count*o):m=new l(a,d,i.count*o),x=new Z(m,o,p);if(i.sparse!==void 0){let v=fo.SCALAR,_=Kn[i.sparse.indices.componentType],b=i.sparse.indices.byteOffset||0,y=i.sparse.values.byteOffset||0,w=new _(r[1],b,i.sparse.count*v),T=new l(r[2],y,i.sparse.count*o);a!==null&&(x=new Z(x.array.slice(),x.itemSize,x.normalized)),x.normalized=!1;for(let A=0,S=w.length;A<S;A++){let E=w[A];if(x.setX(E,T[A*o]),o>=2&&x.setY(E,T[A*o+1]),o>=3&&x.setZ(E,T[A*o+2]),o>=4&&x.setW(E,T[A*o+3]),o>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}x.normalized=p}return x})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,r=t.images[s],a=this.textureLoader;if(r.uri){let o=n.manager.getHandler(r.uri);o!==null&&(a=o)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){let i=this,s=this.json,r=s.textures[e],a=s.images[t],o=(a.uri||a.bufferView)+":"+r.sampler;if(this.textureCache[o])return this.textureCache[o];let l=this.loadImageSource(t,n).then(function(c){c.flipY=!1,c.name=r.name||a.name||"",c.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(c.name=a.uri);let d=(s.samplers||{})[r.sampler]||{};return c.magFilter=Cc[d.magFilter]||Dt,c.minFilter=Cc[d.minFilter]||fn,c.wrapS=Ic[d.wrapS]||wt,c.wrapT=Ic[d.wrapT]||wt,c.generateMipmaps=!c.isCompressedTexture&&c.minFilter!==On&&c.minFilter!==Dt,i.associations.set(c,{textures:e}),c}).catch(function(){return null});return this.textureCache[o]=l,l}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let r=i.images[e],a=self.URL||self.webkitURL,o=r.uri||"",l=!1;if(r.bufferView!==void 0)o=n.getDependency("bufferView",r.bufferView).then(function(u){l=!0;let d=new Blob([u],{type:r.mimeType});return o=a.createObjectURL(d),o});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let c=Promise.resolve(o).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(m){let x=new He(m);x.needsUpdate=!0,d(x)}),t.load(Lt.resolveURL(u,s.path),p,void 0,f)})}).then(function(u){return l===!0&&a.revokeObjectURL(o),ut(u,r),u.userData.mimeType=r.mimeType||kp(r.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),u});return this.sourceCache[e]=c,c}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),s.extensions[q.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[q.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let o=s.associations.get(r);r=s.extensions[q.KHR_TEXTURE_TRANSFORM].extendTexture(r,a),s.associations.set(r,o)}}return i!==void 0&&(r.colorSpace=i),e[t]=r,r})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,o=this.cache.get(a);o||(o=new qt,Pe.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,o.sizeAttenuation=!1,this.cache.add(a,o)),n=o}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,o=this.cache.get(a);o||(o=new Hn,Pe.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,this.cache.add(a,o)),n=o}if(i||s||r){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),r&&(a+="flat-shading:");let o=this.cache.get(a);o||(o=n.clone(),s&&(o.vertexColors=!0),r&&(o.flatShading=!0),i&&(o.normalScale&&(o.normalScale.y*=-1),o.clearcoatNormalScale&&(o.clearcoatNormalScale.y*=-1)),this.cache.add(a,o),this.associations.set(o,this.associations.get(n))),n=o}e.material=n}getMaterialType(){return me}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],r,a={},o=s.extensions||{},l=[];if(o[q.KHR_MATERIALS_UNLIT]){let u=i[q.KHR_MATERIALS_UNLIT];r=u.getMaterialType(),l.push(u.extendParams(a,s,t))}else{let u=s.pbrMetallicRoughness||{};if(a.color=new R(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Be),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",u.baseColorTexture,le)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=Nt);let c=s.alphaMode||po.OPAQUE;if(c===po.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,c===po.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&r!==be&&(l.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new B(1,1),s.normalTexture.scale!==void 0)){let u=s.normalTexture.scale;a.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&r!==be&&(l.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&r!==be){let u=s.emissiveFactor;a.emissive=new R().setRGB(u[0],u[1],u[2],Be)}return s.emissiveTexture!==void 0&&r!==be&&l.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,le)),Promise.all(l).then(function(){let u=new r(a);return s.name&&(u.name=s.name),ut(u,s),t.associations.set(u,{materials:e}),s.extensions&&xn(i,u,s),u})}createUniqueName(e){let t=se.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[q.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(o){return Pc(o,a,t)})}let r=[];for(let a=0,o=e.length;a<o;a++){let l=e[a],c=Bp(l),u=i[c];if(u)r.push(u.promise);else{let d;l.extensions&&l.extensions[q.KHR_DRACO_MESH_COMPRESSION]?d=s(l):d=Pc(new J,l,t),l.mode===qe.TRIANGLE_STRIP?d=d.then(f=>co(f,Di)):l.mode===qe.TRIANGLE_FAN&&(d=d.then(f=>co(f,qn))),i[c]={primitive:l,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,a=[];for(let o=0,l=r.length;o<l;o++){let c=r[o].material===void 0?Up(this.cache):this.getDependency("material",r[o].material);a.push(c)}return a.push(t.loadGeometries(r)),Promise.all(a).then(async function(o){let l=o.slice(0,o.length-1),c=o[o.length-1],u=[];for(let f=0,p=c.length;f<p;f++){let m=c[f],x=r[f],v,_=l[f];if(x.mode===qe.TRIANGLES||x.mode===qe.TRIANGLE_STRIP||x.mode===qe.TRIANGLE_FAN||x.mode===void 0){let b=s.isSkinnedMesh===!0,y=m.hasAttribute("skinIndex")&&m.hasAttribute("skinWeight");b&&y===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),v=b&&y?new _i(m,_):new H(m,_),v.isSkinnedMesh===!0&&v.normalizeSkinWeights()}else if(x.mode===qe.LINES)v=new yi(m,_);else if(x.mode===qe.LINE_STRIP)v=new an(m,_);else if(x.mode===qe.LINE_LOOP)v=new Mi(m,_);else if(x.mode===qe.POINTS)v=new Qe(m,_);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+x.mode);Object.keys(v.geometry.morphAttributes).length>0&&Op(v,s),v.name=t.createUniqueName(s.name||"mesh_"+e),ut(v,s),x.extensions&&xn(i,v,x),t.assignFinalMaterial(v),u.push(v)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return s.extensions&&xn(i,u[0],s),u[0];let d=new ae;s.extensions&&xn(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new cn(Ja.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Xn(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ut(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),r=i,a=[],o=[];for(let l=0,c=r.length;l<c;l++){let u=r[l];if(u){a.push(u);let d=new U;s!==null&&d.fromArray(s.array,l*16),o.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new bi(a,o)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,r=[],a=[],o=[],l=[],c=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],p=i.samplers[f.sampler],m=f.target,x=m.node,v=i.parameters!==void 0?i.parameters[p.input]:p.input,_=i.parameters!==void 0?i.parameters[p.output]:p.output;m.node!==void 0&&(r.push(this.getDependency("node",x)),a.push(this.getDependency("accessor",v)),o.push(this.getDependency("accessor",_)),l.push(p),c.push(m))}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c)]).then(function(u){let d=u[0],f=u[1],p=u[2],m=u[3],x=u[4],v=[];for(let b=0,y=d.length;b<y;b++){let w=d[b],T=f[b],A=p[b],S=m[b],E=x[b];if(w===void 0)continue;w.updateMatrix&&w.updateMatrix();let C=n._createAnimationTracks(w,T,A,S,E);if(C)for(let I=0;I<C.length;I++)v.push(C[I])}let _=new on(s,void 0,v);return ut(_,i),_})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&r.traverse(function(a){if(a.isMesh)for(let o=0,l=i.weights.length;o<l;o++)a.morphTargetInfluences[o]=i.weights[o]}),r})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),r=[],a=i.children||[];for(let l=0,c=a.length;l<c;l++)r.push(n.getDependency("node",a[l]));let o=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),o]).then(function(l){let c=l[0],u=l[1],d=l[2];d!==null&&c.traverse(function(f){f.isSkinnedMesh&&f.bind(d,zp)});for(let f=0,p=u.length;f<p;f++)c.add(u[f]);if(c.userData.pivot!==void 0&&u.length>0){let f=c.userData.pivot,p=u[0];c.pivot=new M().fromArray(f),c.position.x-=f[0],c.position.y-=f[1],c.position.z-=f[2],p.position.set(0,0,0),delete c.userData.pivot}return c})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],r=s.name?i.createUniqueName(s.name):"",a=[],o=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return o&&a.push(o),s.camera!==void 0&&a.push(i.getDependency("camera",s.camera).then(function(l){return i._getNodeRef(i.cameraCache,s.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let c;if(s.isBone===!0?c=new Gn:l.length>1?c=new ae:l.length===1?c=l[0]:c=new ce,c!==l[0])for(let u=0,d=l.length;u<d;u++)c.add(l[u]);if(s.name&&(c.userData.name=s.name,c.name=r),ut(c,s),s.extensions&&xn(n,c,s),s.matrix!==void 0){let u=new U;u.fromArray(s.matrix),c.applyMatrix4(u)}else s.translation!==void 0&&c.position.fromArray(s.translation),s.rotation!==void 0&&c.quaternion.fromArray(s.rotation),s.scale!==void 0&&c.scale.fromArray(s.scale);if(!i.associations.has(c))i.associations.set(c,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let u=i.associations.get(c);i.associations.set(c,{...u})}return i.associations.get(c).nodes=e,c}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new ae;n.name&&(s.name=i.createUniqueName(n.name)),ut(s,n),n.extensions&&xn(t,s,n);let r=n.nodes||[],a=[];for(let o=0,l=r.length;o<l;o++)a.push(i.getDependency("node",r[o]));return Promise.all(a).then(function(o){for(let c=0,u=o.length;c<u;c++){let d=o[c];d.parent!==null?s.add(br(d)):s.add(d)}let l=c=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof Pe||d instanceof He)&&u.set(d,f);return c.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(s),s})}_createAnimationTracks(e,t,n,i,s){let r=[],a=e.name?e.name:e.uuid,o=[];function l(f){f.morphTargetInfluences&&o.push(f.name?f.name:f.uuid)}Kt[s.path]===Kt.weights?(l(e),e.isGroup&&e.children.forEach(l)):o.push(a);let c;switch(Kt[s.path]){case Kt.weights:c=Ct;break;case Kt.rotation:c=It;break;case Kt.translation:case Kt.scale:c=Yt;break;default:n.itemSize===1?c=Ct:c=Yt;break}let u=i.interpolation!==void 0?Dp[i.interpolation]:sn,d=this._getArrayFromAccessor(n);for(let f=0,p=o.length;f<p;f++){let m=new c(o[f]+"."+Kt[s.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),r.push(m)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ko(t.constructor),i=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof It?Oo:Mr;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Gp(h,e,t){let n=e.attributes,i=new Re;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],o=a.min,l=a.max;if(o!==void 0&&l!==void 0){if(i.set(new M(o[0],o[1],o[2]),new M(l[0],l[1],l[2])),a.normalized){let c=ko(Kn[a.componentType]);i.min.multiplyScalar(c),i.max.multiplyScalar(c)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let a=new M,o=new M;for(let l=0,c=s.length;l<c;l++){let u=s[l];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(o.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),o.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),o.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let m=ko(Kn[d.componentType]);o.multiplyScalar(m)}a.max(o)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}h.boundingBox=i;let r=new Ie;i.getCenter(r.center),r.radius=i.min.distanceTo(i.max)/2,h.boundingSphere=r}function Pc(h,e,t){let n=e.attributes,i=[];function s(r,a){return t.getDependency("accessor",r).then(function(o){h.setAttribute(a,o)})}for(let r in n){let a=Bo[r]||r.toLowerCase();a in h.attributes||i.push(s(n[r],a))}if(e.indices!==void 0&&!h.index){let r=t.getDependency("accessor",e.indices).then(function(a){h.setIndex(a)});i.push(r)}return Te.workingColorSpace!==Be&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Te.workingColorSpace}" not supported.`),ut(h,e),Gp(h,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Fp(h,e.targets,t):h})}var Nc={head:1.3,thigh_l:.9,thigh_r:.9,upperarm_l:.9,upperarm_r:.9,spine_01:.95},Dc=[16734815,4171775,16765503,6213994,16748497,16751421,10185727],Sr=class{constructor(e,t){g(this,"g",e);g(this,"stats",{kids:0,families:0,visible:0});g(this,"gl",[]);g(this,"pool",[]);g(this,"group",new ae);g(this,"cap");g(this,"shadows");g(this,"v",new M);let n=e.real.q.name;this.cap=n==="low"?3:n==="med"?8:14,this.shadows=!t,this.group.name="aw:kids",e.scene.add(this.group);let i=new Zn;Promise.all(["ped_maya","ped_sam"].map(s=>i.loadAsync(`./models/${s}.glb`))).then(s=>{this.gl=s,console.info("[aw-kids] models",s.map(r=>r.animations.map(a=>a.name).join("|")))}).catch(s=>console.warn("[aw-kids]",s))}make(e){if(!this.gl.length)return null;let t=this.gl[e%this.gl.length],n=br(t.scene);n.rotation.y=Math.PI;let i=new ae;i.add(n),i.scale.setScalar(.6+e%3*.04);let s=new R(Dc[e%Dc.length]),r=[];n.traverse(u=>{let d=u;if((d.isMesh||d.isSkinnedMesh)&&(d.castShadow=this.shadows,d.frustumCulled=!1,/accessory|held/i.test(d.name)&&(d.visible=!1),d.material)){let f=d.material.clone();/top/i.test(f.name||"")&&f.color&&f.color.copy(s),u.material=f}Nc[u.name]&&r.push([u,Nc[u.name]])});let a=new Pi(n),o=u=>t.animations.find(d=>d.name===u)||t.animations[0],l=a.clipAction(o("Walk_Brisk")),c=a.clipAction(o("Jog"));return l.play(),c.play(),c.setEffectiveWeight(0),l.time=Math.random()*l.getClip().duration,i.visible=!1,this.group.add(i),this.stats.kids++,{root:i,inner:n,mixer:a,walk:l,jog:c,bones:r,ped:null,slot:0}}update(e){let t=this.g.real.amb;if(!t||!this.gl.length)return;let n=this.g.camera.position,i=this.g.real;for(let o of t.peds)if(o.pedFlip=1,o.rd!==o.__rd){o.__rd=o.rd;for(let l of this.pool)l.ped===o&&(l.ped=null,l.root.visible=!1);if(o.__fam=0,o.rd&&Math.random()<.4){let l=Math.random();o.__fam=l<.06?3:l<.5?2:1;for(let c=0;c<o.__fam;c++){let u=this.pool.find(d=>!d.ped);if(!u&&this.pool.length<this.cap){let d=this.make(this.pool.length);d&&(this.pool.push(d),u=d)}if(!u)break;u.ped=o,u.slot=c}}}let s=0,r=0,a=new Set;for(let o of this.pool){let l=o.ped;if(!l||!l.rd||!l.g.visible){o.root.visible=!1;continue}let c=l.g.position;if(n.distanceToSquared(c)>19600){o.root.visible=!1;continue}a.has(l)||(a.add(l),r++);let u=l.g.rotation.y,d=-Math.sin(u),f=-Math.cos(u),p=o.slot===1?-1:1,m=o.slot===2?0:.75*p,x=o.slot===2?.9:.15,v=c.x+f*m-d*x,_=c.z-d*m-f*x;o.root.position.set(v,i.surfaceAt(v,_)+.02,_),o.root.rotation.y=u,o.root.visible=!0,s++;let b=l.sp||1.3,y=o.root.scale.x,w=b/(1.8*y),T=w>1.45?1:0;if(o.walk.setEffectiveWeight(1-T),o.jog.setEffectiveWeight(T),o.walk.timeScale=Math.min(1.6,w),o.jog.timeScale=Math.min(1.3,b/(3.2*y)),o.applied)for(let[A,S]of o.bones)A.scale.divideScalar(S);o.mixer.update(e),o.applied=!0;for(let[A,S]of o.bones)A.scale.multiplyScalar(S)}this.stats.visible=s,this.stats.families=r}};var dt=()=>performance.now(),wr=class{constructor(e=4){g(this,"budget",e);g(this,"stats",{roadSlices:0,bldSlices:0,maxSlice:0,msPerM:0,msPerB:0});let t=window;t.__awRoadJob=(n,i)=>this.roadJob(n,i),t.__awBldJob=(n,i,s)=>this.bldJob(n,i,s)}note(e){e>this.stats.maxSlice&&(this.stats.maxSlice=e)}roadJob(e,t){let n=t.json.roads,i=n.map(u=>{let d=0;for(let f=1;f<u.p.length;f++)d+=Math.hypot(u.p[f][0]-u.p[f-1][0],u.p[f][1]-u.p[f-1][1]);return d+20}),s=0,r=null,a=null,o=!1,l=u=>{let d=e.roadGrid(u);for(let[f,p]of d){let m=a.get(f);m?m.push(...p):a.set(f,p)}},c=()=>{let u=dt();for(r||(r=e.junctionsNear(t),a=new Map);!o;){let d=Math.max(60,this.budget*.8/(this.stats.msPerM||.004)),f=s,p=0;for(;f<n.length&&(f===s||p+i[f]<d);)p+=i[f++];let m=dt(),x=f>=n.length&&s>=n.length,v=x?e.roads.build({roads:[],junc:t.json.junc},r):e.roads.build({roads:n.slice(s,f),junc:[]},r);if(v.traverse(_=>{_.name=_.name||(x?"plate":"road")}),t.roadMesh?(t.roadMesh.add(v),l(v)):(t.roadMesh=v,t.group.add(v),l(v)),!x&&p>0){let _=(dt()-m)/p;this.stats.msPerM=this.stats.msPerM?this.stats.msPerM*.8+_*.2:_}if(x?o=!0:s=f,dt()-u>this.budget*.6)break}t.roadGrid=a,this.stats.roadSlices++,this.note(dt()-u),o||e.queue.unshift({R:t,f:c})};return c}bldJob(e,t,n){let i=0,s=()=>{let r=dt();for(;i<n.length;){let a=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerB||.5))),o=n.slice(i,i+a),l=dt(),c=e.buildings.build({b:o});c.traverse(d=>{d.isMesh&&(d.name="bld:"+(d.material.name||d.material.type))}),t.group.add(c);let u=(dt()-l)/o.length;if(this.stats.msPerB=this.stats.msPerB?this.stats.msPerB*.8+u*.2:u,i+=o.length,dt()-r>this.budget*.6)break}this.stats.bldSlices++,this.note(dt()-r),i<n.length&&e.queue.unshift({R:t,f:s})};return s}};var Ar=class{constructor(e){g(this,"g",e);g(this,"on",!1);g(this,"n",0);g(this,"stats",{aoHalf:!1,shadowEvery:1,a2c:0});g(this,"a2c",new WeakSet);g(this,"scanT",0);let t=e.real?.q;if(!t||t.name!=="high")return;this.on=!0,window.__awAoT=5e3;let n=window.__awPost;if(n&&n.ao){let i=n.ao,s=i.setSize.bind(i);i.setSize=(r,a)=>s(Math.max(1,Math.ceil(r/2)),Math.max(1,Math.ceil(a/2))),i.updateGtaoMaterial({samples:8}),i.updatePdMaterial({samples:8}),n.resize(),this.stats.aoHalf=!0}this.stats.shadowEvery=2}coverage(){this.g.scene.traverse(e=>{let t=e.material;if(t)for(let n of Array.isArray(t)?t:[t])this.a2c.has(n)||(this.a2c.add(n),n.alphaTest>0&&!n.transparent&&!n.alphaToCoverage&&(n.alphaToCoverage=!0,n.needsUpdate=!0,this.stats.a2c++))})}frame(){if(!this.on)return;this.stats.aoHalf&&(this.scanT-=1/60)<=0&&(this.scanT=3,this.coverage());let e=this.g.renderer.shadowMap;e.autoUpdate=!1,(this.n++&1)===0&&(e.needsUpdate=!0)}};var Tr=class{constructor(e){g(this,"on",!1);g(this,"stats",{water:!1,veg3d:0});let t=e.real;if(!t||!t.q||t.q.name!=="high")return;this.on=!0;let n=t.water?.nrm;n&&O.get("hlwater")!=="0"&&(n.anisotropy=16,n.needsUpdate=!0,this.stats.water=!0),O.get("hlveg")!=="0"&&(t.q.veg3d=340),this.stats.veg3d=t.q.veg3d}};var Uc=new Map,Er=new Map,jn=new ye(1,1,1);function Ye(h,e,t=.5,n=.1){let i=Er.get(h);return i||(i=new me({color:e,roughness:t,metalness:n}),Er.set(h,i)),i}function ft(h,e,t=512,n=128,i=.42,s=.1){let r=Er.get(h);if(r)return r;let a=Uc.get(h);if(!a){let o=document.createElement("canvas");o.width=t,o.height=n;let l=o.getContext("2d");e(l,t,n),a=new ze(o),a.colorSpace=le,a.flipY=!1,a.anisotropy=4,Uc.set(h,a)}return r=new me({map:a,roughness:i,metalness:s}),Er.set(h,r),r}function De(h,e,t,n,i,s,r="bold",a="left",o="Arial, Helvetica, sans-serif"){h.font=`${r} ${i}px ${o}`,h.fillStyle=s,h.textAlign=a,h.textBaseline="middle",h.fillText(e,t,n)}function Hp(h,e,t,n){h.save(),h.translate(e,t),h.scale(n,n),h.beginPath(),h.moveTo(-18,-30),h.lineTo(18,-30),h.lineTo(18,8),h.quadraticCurveTo(0,32,-18,8),h.closePath(),h.fillStyle="#1d4fb3",h.fill(),h.lineWidth=3,h.strokeStyle="#0d2a66",h.stroke(),h.fillStyle="#e9eef6",h.fillRect(-11,-22,22,22),h.fillStyle="#2e8b3a",h.beginPath(),h.ellipse(-14,10,6,13,.5,0,6.3),h.ellipse(14,10,6,13,-.5,0,6.3),h.fill(),h.fillStyle="#9aa3ad",h.fillRect(-2,-26,4,40),h.fillStyle="#1d4fb3",h.fillRect(-14,22,28,6),h.restore()}function Fc(h,e){return(t,n,i)=>{t.fillStyle="#f4f5f7",t.fillRect(0,0,n,i);let s=r=>(e?r:1-r)*n;t.fillStyle="#1747b8",t.fillRect(0,i*.3,n,i*.17),t.fillStyle="#f2c81e",t.fillRect(0,i*.5,n,i*.035),t.fillRect(0,i*.555,n,i*.02),Hp(t,s(.36),i*.42,1.05),De(t,"POLIS",s(.62),i*.385,38,"#ffffff","bold","center"),De(t,"Servicio, Integridad, Seguridad.",s(.47),i*.7,19,"#c8202a","bold","center"),De(t,String(h),s(.13),i*.18,30,"#111","bold","center"),De(t,"\u260E100",s(.8),i*.18,24,"#1747b8","bold","center"),De(t,String(h),s(.93),i*.42,34,"#111","bold","center"),t.strokeStyle="#1747b8",t.lineWidth=7;for(let r=0;r<2;r++)t.beginPath(),t.moveTo(s(.84+r*.035),i*.47),t.lineTo(s(.87+r*.035),i*.3),t.stroke()}}function Oc(h){return(e,t,n)=>{e.fillStyle="#f4f5f7",e.fillRect(0,0,t,n);let i=s=>(h?s:1-s)*t;e.fillStyle="#1f3b73",e.fillRect(0,n*.6,t,n*.05),De(e,"ForenSys",i(.45),n*.36,44,"#1f3b73","bold","center"),De(e,"ARUBA \xB7 Accident Registration",i(.45),n*.52,16,"#1f3b73","bold","center")}}function Bc(h,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;if(t.fillStyle=h?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),h)t.strokeStyle="#ffffff",t.lineWidth=16,t.beginPath(),t.moveTo(s(.05),i*.62),t.bezierCurveTo(s(.35),i*.85,s(.55),i*.15,s(.95),i*.45),t.stroke(),t.strokeStyle="#8f6fb8",t.lineWidth=5,t.beginPath(),t.moveTo(s(.05),i*.66),t.bezierCurveTo(s(.35),i*.9,s(.55),i*.2,s(.95),i*.5),t.stroke(),t.fillStyle="#ffffff",t.fillRect(s(.42)-46,i*.22,92,30),De(t,"InSan",s(.42),i*.22+15,24,"#2b6cc4","bold","center");else{t.fillStyle="#1f3a9c",t.fillRect(0,i*.5,n,i*.09),t.fillStyle="#e8ef1c",t.fillRect(s(.42)-n*.36,i*.5,n*.72,i*.09),De(t,"AMBULANCE",s(.42),i*.545,30,"#1f3a9c","bold","center"),t.fillStyle="#1f3a9c",t.beginPath();let r=s(.06),a=s(0);t.moveTo(r,i*.5),t.lineTo(a,i*.5),t.lineTo(a,i*.59),t.fill()}}}function kc(h,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;t.fillStyle=h?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),h?(t.fillStyle="#ffffff",t.fillRect(0,i*.3,n,i*.05)):(t.fillStyle="#1f3a9c",t.fillRect(0,i*.3,n,i*.12)),De(t,"911",s(.55),i*.62,44,h?"#ffffff":"#c8202a","bold","center"),h||De(t,"PA SALBA BO BIDA",s(.55),i*.8,13,"#c8202a","bold","center")}}function Go(h,e,t,n,i,s,r){return ft(h,a=>{a.fillStyle=e,a.fillRect(0,0,s,r),De(a,t,s/2,r/2,i,n,"bold","center")},s,r)}function Vp(h){return ft("evPlate"+h,(e,t,n)=>{e.fillStyle="#f4f2ea",e.fillRect(0,0,t,n),e.strokeStyle="#1d3f8a",e.lineWidth=4,e.strokeRect(3,3,t-6,n-6),De(e,"ARUBA",t/2,13,12,"#1d3f8a","bold","center"),De(e,`A-${1e4+h*37}`,t/2,40,34,"#1d3f8a","bold","center")},256,64,.4,0)}var Oi=null,zc=null;function Bi(){return zc||(zc=new Zn().loadAsync("./models/ev.glb?v=e1").then(h=>{let e=[];h.scene.traverse(t=>{var s;let n=/^ev(\d)_(?:L(\d)_([a-z]+)|(bar|mk))$/.exec(t.name);if(!n)return;let i=e[s=+n[1]]||(e[s]={lods:[new Map,new Map],bar:{p:new M,w:1}});n[3]&&t.isMesh?i.lods[+n[2]].set(n[3],t.geometry):n[4]==="bar"?i.bar={p:t.position.clone(),w:t.scale.x}:n[4]==="mk"&&(i.mk=t.position.clone())}),Oi=e}).catch(h=>{console.warn("[aw-ev] models/ev.glb",h)}))}var ki=()=>!!Oi,Wp={everest:0,forensys:0,isuzu:1,ambY:2,ambP:2},Xp=45;function qp(h,e){let t=h==="ambY"||h==="ambP",n=h==="ambP",i=h==="forensys",s=t?n?"#f29ac4":"#e8ef1c":"#f4f5f7",r=Ye("evPaint"+s,s,.42,.1),a={paint:r,glass:Ye("evGlass","#121a21",.08,.6),dark:Ye("evDark","#1c1d20",.8,.05),chrome:Ye("evChrome","#d6d9dc",.18,.95),light:Ye("evLight","#eef2f5",.15,.3),tail:Ye("evTail","#a3151a",.3,.1),plate:Vp(e)};return t?(a.livr=ft("abR"+h,Bc(n,!0),512,264),a.livl=ft("abL"+h,Bc(n,!1),512,264),a.cabr=ft("acR"+h,kc(n,!0),256,192),a.cabl=ft("acL"+h,kc(n,!1),256,192),a.rear=Go("aback"+h,s,n?"InSan  911":"AMBULANCE",n?"#ffffff":"#1f3a9c",40,512,122)):i?(a.livr=ft("fsR",Oc(!0),768,128),a.livl=ft("fsL",Oc(!1),768,128),a.hood=a.rear=r):(a.livr=ft(`pR${e}`,Fc(e,!0),768,128),a.livl=ft(`pL${e}`,Fc(e,!1),768,128),a.hood=Go("hoodPolis","#f4f5f7","POLIS","#1747b8",64,256,128),a.rear=Go(`rear${e}`,"#f4f5f7",`\u260E100   ${e}`,"#1747b8",44,512,76)),a}function Hc(h){let e=Ye("evLight","#eef2f5",.15,.3),t=Ye("evTail","#a3151a",.3,.1);e.emissive.setRGB(1,.95,.85).multiplyScalar(h*.6),t.emissive.setRGB(1,.12,.06).multiplyScalar(h),t.emissiveIntensity=1+2*h}var Yp=(()=>{let h=new Ve(.5,12,6),e=h.attributes.position,t=n=>Math.sign(n)*Math.abs(2*n)**.3/2;for(let n=0;n<e.count;n++)e.setXYZ(n,t(e.getX(n)),t(e.getY(n)),t(e.getZ(n)));return h})(),Gc=(h,e,t,n,i,s,r,a)=>{let o=new H(Yp,new be({color:e,toneMapped:!1}));return o.scale.set(s,r,a),o.position.set(t,n,i),o.name="aw:ebar",h.add(o),o};function zi(h,e=45){let t=new ae;t.name="aw:ev:"+h;let n=h==="ambY"||h==="ambP",s={g:t,bar:[],colors:h==="forensys"?[16752640,16752640]:n?[16715784,16777215]:[16715784,1720575]},r=()=>{let a=Oi&&Oi[Wp[h]];if(!a)return;let o=qp(h,e),l=new vi;l.name="aw:evlod",a.lods.forEach((d,f)=>{let p=new ae;for(let[m,x]of d){let v=o[m];if(!v)continue;let _=new H(x,v);_.castShadow=f===0,_.matrixAutoUpdate=!1,p.add(_)}l.addLevel(p,f?Xp:0),p.visible=f===0}),t.add(l);let{p:c,w:u}=a.bar;for(let d of[-1,1])s.bar.push(Gc(t,2105380,d*u*.25,c.y+.05,c.z,u*.48,.1,.26));if(n&&a.mk)for(let d of[-1,1])s.bar.push(Gc(t,5246992,d*a.mk.x,a.mk.y,a.mk.z,.22,.14,.05))};return Oi?r():Bi().then(r),s}var Kp=new Ve(.12,10,8);function Gi(h,e,t=!1){let n=new ae;n.name="aw:npc";let i=Ye("skin"+(Math.random()*3|0),["#8a5a3a","#b07a52","#d2a07a"][Math.random()*3|0],.7,0),s=Ye("shirt"+h,h,.8,0),r=Ye("pants"+e,e,.8,0),a=new H(jn,r);a.scale.set(.14,.82,.16),a.position.set(-.09,.41,0),a.geometry=jn;let o=a.clone();o.position.x=.09,n.add(a,o);let l=new H(jn,s);l.scale.set(.4,.6,.22),l.position.set(0,1.12,0),n.add(l);let c=new H(Kp,i);c.position.set(0,1.56,0),n.add(c);let u=p=>{let m=new ae;m.position.set(p*.25,1.38,0);let x=new H(jn,s);return x.scale.set(.1,.62,.11),x.position.y=-.31,m.add(x),n.add(m),m},d=u(-1),f=u(1);if(t){let p=new H(jn,Ye("tablet","#202326",.3,.2));p.scale.set(.24,.32,.02),p.position.set(0,-.6,.12),f.add(p);let m=new H(jn,new be({color:9422591,toneMapped:!1}));m.scale.set(.2,.27,.005),m.position.set(0,-.6,.135),f.add(m),f.rotation.x=-.9}return{g:n,armL:d,armR:f,legL:a,legR:o,t:Math.random()*10}}function Jn(h,e,t,n=!1){if(h.t+=e,t==="walk"){let i=Math.sin(h.t*7)*.5;h.legL.rotation.x=i,h.legR.rotation.x=-i,h.armL.rotation.x=-i*.8,n||(h.armR.rotation.x=i*.8)}else if(h.legL.rotation.x=h.legR.rotation.x=0,t==="talk"){let i=Math.sin(h.t*2.3),s=Math.sin(h.t*3.1+1);h.armL.rotation.x=-.6-.5*Math.max(0,i),h.armL.rotation.z=-.25*s,n||(h.armR.rotation.x=-.4-.6*Math.max(0,s),h.armR.rotation.z=.3*i)}else h.armL.rotation.x=0,n||(h.armR.rotation.x=0);n&&(h.armR.rotation.x=t==="talk"?-.9-.4*Math.max(0,Math.sin(h.t*.7)):-.9)}function $n(h,e,t,n){let i=(e+t)*2.5%1,s=Math.floor(i*8);h.bar.forEach((r,a)=>{let o=r.material,l=a%2===0,c=n&&(l?s<4&&(s&1)===0:s>=4&&(s&1)===0);o.color.setHex(c?l?h.colors[0]:h.colors[1]:2105380),c&&o.color.multiplyScalar(3)})}function Rr(h){h.traverse(e=>{let t=e;t.isMesh&&t.material&&t.material.isMeshBasicMaterial&&t.material.dispose()})}var Vc=new ye(1,1,1),Cr=new R(1,.06,.04),Zp=new R(.1,.25,1),jp=new R(1,1,1),Hi=new R(.12,.12,.14),Ho={police:{body:"#f4f5f7",stripe:"#1747b8",a:Cr,b:Zp},amb:{body:"#f6f6f2",stripe:"#d0121b",a:Cr,b:jp},fire:{body:"#b5141c",stripe:"#f3f3f3",a:Cr,b:Cr}};function Jp(h,e,t,n){let i=h.children.filter(m=>m.isMesh&&m.material===e);if(!i.length)return null;h.updateMatrixWorld(!0);let s=h.matrixWorld.clone().invert(),r=new Li,a=new M,o=new M,l=24,c=t.min.z+(t.max.z-t.min.z)*.07,u=t.max.z-(t.max.z-t.min.z)*.07,d=(m,x,v)=>{a.set(m*(t.max.x+1),x,v).applyMatrix4(h.matrixWorld),o.set(-m,0,0).transformDirection(h.matrixWorld),r.set(a,o);let _=r.intersectObjects(i,!1)[0];if(!_)return null;let b=_.point.applyMatrix4(s);return b.x+=m*.012,b},f=[];for(let m of[-1,1]){let x=null;for(let v=0;v<=l;v++){let _=c+(u-c)*v/l,b=d(m,n-.08,_),y=d(m,n+.08,_),w=b&&y?[b,y]:null;if(x&&w){let[T,A]=m>0?[w,x]:[x,w];f.push(T[0].x,T[0].y,T[0].z,A[0].x,A[0].y,A[0].z,A[1].x,A[1].y,A[1].z,T[0].x,T[0].y,T[0].z,A[1].x,A[1].y,A[1].z,T[1].x,T[1].y,T[1].z)}x=w}}if(!f.length)return null;let p=new J;return p.setAttribute("position",new te(f,3)),p}var Ir=class{constructor(e){g(this,"g",e);g(this,"stats",{police:0,amb:0,fire:0,active:0,rolls:0});g(this,"st",new Map);g(this,"force",O.get("emerg")==="force");g(this,"audio",null);g(this,"siren",!1);g(this,"time",0);g(this,"night",-1);g(this,"ext",null);Bi();try{this.siren=localStorage.getItem("aw_siren")==="1"}catch{}this.mountToggle(0)}pickRole(){if(this.stats.rolls++,!this.force&&Math.random()>=.1)return null;let e=Math.random()*10;return e<6?"police":e<9?"amb":"fire"}setup(e,t){let n=this.g.real.amb?.mats||{},i=new Set(Object.values(n)),s=new Re;for(let f of e.g.children){let p=f;if(!p.isMesh||p.name.startsWith("aw:"))continue;p.geometry.computeBoundingBox(),s.union(p.geometry.boundingBox);let m=p.material;!t.paint&&!Array.isArray(m)&&!i.has(m)&&!m.userData?.pid&&m.color&&(t.paint=m)}t.box=s,t.paint&&(t.base={c:t.paint.color.clone(),r:t.paint.roughness,m:t.paint.metalness,cc:t.paint.clearcoat});let r=s.max.x-s.min.x,a=s.max.z-s.min.z,o=s.max.y,l=s.min.z+a*.55;t.bar=[-1,1].map(f=>{let p=new H(Vc,new be({color:Hi,toneMapped:!1}));return p.scale.set(r*.3,.12,.28),p.position.set(f*r*.16,o+.06,l),p.name="aw:ebar",p.visible=!1,e.g.add(p),p});let c=s.min.y+(o-s.min.y)*.42,u=t.paint?Jp(e.g,t.paint,s,c):null,d=new H(u||Vc,new be({color:16777215}));u||(d.scale.set(r+.03,.16,a*.86),d.position.set(0,c,(s.min.z+s.max.z)/2)),d.name="aw:estripe",d.visible=!1,e.g.add(d),t.stripe=d}useModel(e,t,n){t.orig||(t.orig=e.g.children.filter(a=>!a.name.startsWith("aw:"))),t.model&&(e.g.remove(t.model.g),Rr(t.model.g),t.model=void 0);let i=(n==="police"||n==="amb")&&ki();for(let a of t.orig)a.visible=!i;if(!i)return;let s=n==="police"?Math.random()<.6?"everest":"isuzu":Math.random()<.5?"ambY":"ambP",r=zi(s,[45,50,67,38,71][Math.random()*5|0]);e.g.add(r.g),t.model=r,t.mkind=s}apply(e,t,n){if(t.role&&this.stats[t.role]--,t.role=n,n&&this.stats[n]++,this.useModel(e,t,n),t.model){if(t.bar)for(let s of t.bar)s.visible=!1;t.stripe&&(t.stripe.visible=!1),t.on=Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10;return}n&&!t.bar&&this.setup(e,t);let i=t.paint;if(i&&t.base&&(n?(i.color.set(Ho[n].body),i.roughness=.45,i.metalness=.1):(i.color.copy(t.base.c),i.roughness=t.base.r,i.metalness=t.base.m)),t.bar)for(let s of t.bar)s.visible=!!n;t.stripe&&(t.stripe.visible=!!n,n&&t.stripe.material.color.set(Ho[n].stripe)),t.on=!!n&&Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10}update(e){this.time+=e;let t=Math.round(Math.max(0,Math.min(1,(xe.value-.3)/.4))*50)/50;t!==this.night&&(this.night=t,Hc(t));let i=this.g.real?.amb?.cars;if(!i)return;let s=this.g.camera.position,r=null,a=0;for(let o of i){let l=this.st.get(o.g);if(l||(l={role:null,rd:null,on:!1,t:0,ph:0},this.st.set(o.g,l)),o.rd&&o.rd!==l.rd?(l.rd=o.rd,this.apply(o,l,this.pickRole())):(l.role==="police"||l.role==="amb")&&!l.model&&ki()&&this.apply(o,l,l.role),l.role&&l.model){if((l.t-=e)<=0&&(l.on=!l.on,l.t=l.on?15+Math.random()*25:10+Math.random()*25),$n(l.model,this.time,l.ph,l.on&&o.g.visible),l.on&&o.g.visible){a++;let m=o.g.position.distanceTo(s);m<160&&(!r||m<r.d)&&(r={d:m,s:l})}continue}if(!l.role||!l.bar)continue;(l.t-=e)<=0&&(l.on=!l.on,l.t=l.on?15+Math.random()*25:10+Math.random()*25);let c=Ho[l.role],[u,d]=l.bar,f=u.material,p=d.material;if(l.on&&o.g.visible){a++;let m=(this.time+l.ph)*2.5%1,x=Math.floor(m*8),v=x<4&&(x&1)===0,_=x>=4&&(x&1)===0;f.color.copy(v?c.a:Hi).multiplyScalar(v?3:1),p.color.copy(_?c.b:Hi).multiplyScalar(_?3:1);let b=o.g.position.distanceTo(s);b<160&&(!r||b<r.d)&&(r={d:b,s:l})}else f.color.copy(Hi),p.color.copy(Hi)}this.stats.active=a,this.sound(r)}sound(e){let t=e;if(this.ext&&(!t||this.ext.d<t.d)&&(t={d:this.ext.d,s:{role:"police",rd:null,on:!0,t:0,ph:this.ext.ph}}),!this.siren||!this.audio){this.audio&&(this.audio.gain.gain.value=0);return}let{ctx:n,osc:i,gain:s}=this.audio,r=n.currentTime;if(!t||document.hidden){s.gain.setTargetAtTime(0,r,.1);return}let a=t.s.role,o=(this.time+t.s.ph)%4,l=a==="police"?650+800*(o<2?o/2:(4-o)/2):this.time*1.4%1<.5?960:770;i.frequency.setTargetAtTime(l,r,.02),s.gain.setTargetAtTime(.07*Math.max(0,1-t.d/160)**1.5,r,.08)}startAudio(){if(this.audio){this.audio.ctx.resume();return}try{let e=new AudioContext,t=e.createOscillator(),n=e.createGain();t.type="sawtooth",n.gain.value=0;let i=e.createBiquadFilter();i.type="lowpass",i.frequency.value=2200,t.connect(i).connect(n).connect(e.destination),t.start(),this.audio={ctx:e,osc:t,gain:n}}catch{this.audio=null}}mountToggle(e){let t=document.getElementById("awtime");if(!t){e<60&&setTimeout(()=>this.mountToggle(e+1),500);return}let n=document.createElement("div");n.className="lbl",n.textContent="Siren sound";let i=document.createElement("div");i.className="row";let s=document.createElement("button");s.id="awsiren";let r=()=>{s.textContent=this.siren?"Sirens: ON":"Sirens: OFF"};r(),s.onclick=()=>{this.siren=!this.siren,r();try{localStorage.setItem("aw_siren",this.siren?"1":"0")}catch{}this.siren?this.startAudio():this.audio&&this.audio.ctx.suspend()},i.appendChild(s),t.append(n,i),this.siren&&addEventListener("pointerdown",()=>this.startAudio(),{once:!0})}};var Pr=class{constructor(e,t){g(this,"g",e);g(this,"emerg",t);g(this,"force",O.get("crash")==="force");g(this,"tx",Math.min(10,Math.max(1,+(O.get("crashx")||1))));g(this,"next",this.force?4:60);g(this,"time",0);g(this,"sc",null);g(this,"stats",{scenes:0,active:!1,phase:0,x:0,z:0,police:!1,fs:!1,talk:0,fx:0,fz:0});Bi();let n=O.get("evshow");if(n){let i=()=>{this.amb()?this.showroom(n):setTimeout(i,1e3)};setTimeout(i,3e3)}}amb(){return this.g.real.amb||null}pt(e,t,n,i){let s=e.p,r=0;for(let a=1;a<s.length;a++){let o=s[a][0]-s[a-1][0],l=s[a][1]-s[a-1][1],c=Math.hypot(o,l)||1;if(r+c>=t||a===s.length-1){let u=Math.max(0,Math.min(1,(t-r)/c)),d=o/c,f=l/c;return{x:s[a-1][0]+o*u-f*n,z:s[a-1][1]+l*u+d*n,yaw:i>0?Math.atan2(d,f):Math.atan2(-d,-f)}}r+=c}return{x:s[0][0],z:s[0][1],yaw:0}}len(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}put(e,t,n=0){let i=this.amb();e.position.set(t.x,i.w.surfaceAt(t.x,t.z)+.02,t.z),e.rotation.set(0,t.yaw+n,0)}start(){let e=this.amb();if(!e||e.cars.length<3)return!1;let t=this.g.camera.position,n=e.cars.filter(i=>i.rd&&i.v!==4&&i.g.visible&&!i.g.children.some(s=>s.name.startsWith("aw:ev"))&&i.L>100&&!i.rd.ow&&i.rd.w>=6).map(i=>({c:i,d:Math.hypot(i.g.position.x-t.x,i.g.position.z-t.z)})).filter(i=>i.d>50&&i.d<260).sort((i,s)=>i.d-s.d);for(let{c:i}of n){let s=i.s+i.dir*50;if(s<15||s>i.L-15||(i.dir>0?i.s:i.L-i.s)<40)continue;let a=e.cars.filter(c=>c!==i&&c.v!==4&&!c.g.children.some(u=>u.name.startsWith("aw:ev"))).sort((c,u)=>Math.hypot(u.g.position.x-t.x,u.g.position.z-t.z)-Math.hypot(c.g.position.x-t.x,c.g.position.z-t.z))[0];if(!a)return!1;for(let c of[i,a])e.cars.splice(e.cars.indexOf(c),1);let o=i.dir*Math.min(2.2,i.rd.w/4);a.rd=i.rd,a.g.visible=!0;let l=new ae;return l.name="aw:crash",e.group.add(l),this.sc={rd:i.rd,dirA:i.dir,lat:o,sA:i.s,sB:s,impact:0,A:i,B:a,phase:0,age:0,tCrash:0,root:l,drivers:[],talk:0},this.stats.scenes++,this.stats.active=!0,!0}return!1}clear(){let e=this.sc,t=this.amb();e.root.parent?.remove(e.root),Rr(e.root);for(let n of[e.A,e.B])n.rd=null,n.g.visible=!1,n.g.rotation.set(0,n.g.rotation.y,0),t&&t.cars.push(n);this.emerg&&(this.emerg.ext=null),this.sc=null,this.stats.active=!1,this.stats.phase=0}mover(e,t,n,i){let s=zi(e,[45,50,67][Math.random()*3|0]);return this.sc.root.add(s.g),{m:s,s:t,target:n,lat:i,sp:e==="forensys"?11:15,arrived:!1}}drive(e,t){let n=this.sc,i=n.dirA;if(!e.arrived){let r=(e.target-e.s)*i,a=Math.min(e.sp,Math.max(1.2,r*.8));e.s+=i*a*t,r<.3&&(e.arrived=!0)}let s=e.arrived?e.lat:n.lat+(e.lat-n.lat)*Math.max(0,1-Math.abs(e.target-e.s)/25);this.put(e.m.g,this.pt(n.rd,e.s,s,i))}update(e){e*=this.tx,this.time+=e;let t=this.sc;if(!t){(this.next-=e)<=0&&(this.next=this.force?6:60,(this.g.S&&this.g.S.mode||"walk")!=="plane"&&ki()&&(this.force||Math.random()<.2)&&this.start());return}t.age+=e,this.stats.phase=t.phase,this.stats.police=!!t.police?.arrived,this.stats.fs=!!t.fs?.arrived,this.stats.talk=Math.round(t.talk),t.fs&&(this.stats.fx=t.fs.m.g.position.x,this.stats.fz=t.fs.m.g.position.z);let n=this.g.camera.position,i=this.pt(t.rd,(t.sA+t.sB)/2,t.lat,t.dirA);if(t.age>260||Math.hypot(i.x-n.x,i.z-n.z)>700){this.clear();return}this.stats.x=i.x,this.stats.z=i.z;let s=t.dirA;if(t.phase===0){let a=9*e;t.sA+=s*a,t.sB-=s*a;let o=(t.sB-t.sA)*s,l=Math.max(0,Math.min(1,1-(o-5)/40));this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s)),this.put(t.B.g,this.pt(t.rd,t.sB,-t.lat+2*t.lat*l,-s)),o<=4.6&&(t.phase=1,t.tCrash=t.age,this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s),.28),this.put(t.B.g,this.pt(t.rd,t.sB,t.lat*.75,-s),-.5),t.A.g.rotation.z=.02);return}let r=t.age-t.tCrash;if(r>3&&t.drivers.length===0)for(let[a,o]of[t.sA-s*1.5,t.sB+s*1.5].entries()){let l=Gi(["#2f6fb5","#c8452f","#3f8a4a","#e8c547"][Math.random()*4|0],["#2a2d33","#5a4a3a","#3b4f6b"][Math.random()*3|0]),c=this.pt(t.rd,o,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(l.g,c,a?Math.PI*.5:-Math.PI*.5),t.root.add(l.g),t.drivers.push(l)}for(let a of t.drivers)Jn(a,e,"talk");if(r>8&&!t.police&&(t.police=this.mover(Math.random()<.6?"everest":"isuzu",s>0?0:t.rd.p.length&&this.len(t.rd),t.sA-s*Math.min(13,(s>0?t.sA:this.len(t.rd)-t.sA)-2),t.lat+Math.sign(t.lat||1)*.9)),t.police&&(this.drive(t.police,e),$n(t.police.m,this.time,0,!0),this.emerg)){let a=t.police.m.g.position;this.emerg.ext={d:Math.hypot(a.x-n.x,a.z-n.z),ph:0}}if(t.police?.arrived&&!t.fs&&(t.fs=this.mover("forensys",s>0?0:this.len(t.rd),t.sA-s*Math.min(24,(s>0?t.sA:this.len(t.rd)-t.sA)-1),t.lat+Math.sign(t.lat||1)*.9)),t.fs&&(this.drive(t.fs,e),$n(t.fs.m,this.time,1.3,!t.fs.arrived)),t.fs?.arrived&&!t.staff){t.staff=Gi("#1f3b73","#2a2d33",!0);let a=this.pt(t.rd,t.sA-s*22,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(t.staff.g,a),t.root.add(t.staff.g),t.staffPos={x:a.x,z:a.z}}if(t.staff&&t.staffPos){let a=this.pt(t.rd,(t.sA+t.sB)/2,t.lat+Math.sign(t.lat||1)*3.4,s),o=a.x-t.staffPos.x,l=a.z-t.staffPos.z,c=Math.hypot(o,l);if(c>.4){let u=Math.min(c,1.3*e);t.staffPos.x+=o/c*u,t.staffPos.z+=l/c*u,this.put(t.staff.g,{x:t.staffPos.x,z:t.staffPos.z,yaw:Math.atan2(o,l)}),Jn(t.staff,e,"walk",!0)}else{t.talk+=e,Jn(t.staff,e,"talk",!0);let u=t.staff.g.position;t.staff.g.rotation.y=Math.atan2(i.x-u.x,i.z-u.z);for(let d of t.drivers)d.g.rotation.y=Math.atan2(u.x-d.g.position.x,u.z-d.g.position.z)}}}showroom(e){let t=this.amb(),[n,i]=e.split(",").map(Number);if(!t||!isFinite(n))return;let s=new ae;s.name="aw:evshow",t.group.add(s),["everest","isuzu","ambY","ambP","forensys"].forEach((o,l)=>{let c=zi(o,45),u=n+(l-2)*11;c.g.position.set(u,t.w.surfaceAt(u,i)+.02,i),c.g.rotation.y=Math.PI/2,s.add(c.g),setInterval(()=>$n(c,performance.now()/1e3,l,!0),50)});let r=Gi("#1f3b73","#2a2d33",!0);r.g.position.set(n+28,t.w.surfaceAt(n+28,i+4),i+4),s.add(r.g);let a=Gi("#c8452f","#3b4f6b");a.g.position.set(n+29,t.w.surfaceAt(n+29,i+4),i+4),a.g.rotation.y=-Math.PI/2,s.add(a.g),setInterval(()=>{Jn(r,.05,"talk",!0),Jn(a,.05,"talk")},50)}};var Vo=420,Vi=56,Lr=class{constructor(e){g(this,"g");g(this,"marks");g(this,"smoke");g(this,"smokePos",new Float32Array(Vi*3));g(this,"smokeLife",new Float32Array(Vi));g(this,"smokeVel",new Float32Array(Vi*3));g(this,"i",0);g(this,"puff",0);g(this,"smokeClock",0);g(this,"lx",0);g(this,"lz",0);g(this,"tracking",!1);g(this,"lastSpeed",0);g(this,"baseFov",0);g(this,"m",new U);g(this,"q",new re);g(this,"p",new M);g(this,"sc",new M(1,1,1));g(this,"up",new M(0,1,0));g(this,"mode","");this.g=e;let t=new Et(.28,1).rotateX(-Math.PI/2),n=new be({color:1053978,transparent:!0,opacity:.56,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2});this.marks=new pe(t,n,Vo),this.marks.name="aw:vehicle-skids",this.marks.count=0,this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.instanceMatrix.setUsage(We),e.scene.add(this.marks),this.smokePos.fill(-1e4);let i=new J;i.setAttribute("position",new Z(this.smokePos,3).setUsage(We));let s=document.createElement("canvas");s.width=s.height=64;let r=s.getContext("2d"),a=r.createRadialGradient(32,32,2,32,32,30);a.addColorStop(0,"rgba(220,225,228,.72)"),a.addColorStop(.42,"rgba(150,158,164,.34)"),a.addColorStop(1,"rgba(90,98,104,0)"),r.fillStyle=a,r.fillRect(0,0,64,64),this.smoke=new Qe(i,new qt({map:new ze(s),color:12962251,size:.46,transparent:!0,opacity:.25,depthWrite:!1,sizeAttenuation:!0})),this.smoke.name="aw:moto-smoke",this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,e.scene.add(this.smoke);let o=document.createElement("style");o.textContent=`
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
}`,document.head.appendChild(o);let l=window;l.__awMotoEnabled=!0,l.__awMotoCam=(c,u,d,f)=>this.camera(c,u,d,f)}camera(e,t,n,i){let s=window;if(!i){s.__awMotoBump=Math.max(0,(s.__awMotoBump||0)-n*5);return}let r=Math.abs(t.s||0),a=performance.now()*.001,o=Math.max(0,Math.min(1,(r-25)/30)),l=Math.max(0,s.__awMotoBump||0),c=o*.025+l*.2,u=Math.sin(a*23)*c;e.x+=Math.cos(t.h)*u,e.z-=Math.sin(t.h)*u,e.y+=Math.sin(a*31)*c*.65+l*.08-.5,s.__awMotoBump=Math.max(0,l-n*4.5)}spawnSmoke(e){let t=this.puff,n=t*3,i=Math.sin(e.h),s=Math.cos(e.h);this.smokePos[n]=e.x+i*.78+(Math.random()-.5)*.22,this.smokePos[n+1]=e.y+.24+Math.random()*.12,this.smokePos[n+2]=e.z+s*.78+(Math.random()-.5)*.22,this.smokeVel[n]=(Math.random()-.5)*.3,this.smokeVel[n+1]=.38+Math.random()*.22,this.smokeVel[n+2]=(Math.random()-.5)*.3,this.smokeLife[t]=.72+Math.random()*.35,this.puff=(t+1)%Vi}updateSmoke(e){for(let t=0;t<Vi;t++){if(this.smokeLife[t]<=0)continue;let n=t*3;if(this.smokeLife[t]-=e,this.smokeLife[t]<=0){this.smokePos[n+1]=-1e4;continue}this.smokePos[n]+=this.smokeVel[n]*e,this.smokePos[n+1]+=this.smokeVel[n+1]*e,this.smokePos[n+2]+=this.smokeVel[n+2]*e,this.smokeVel[n]*=Math.pow(.2,e),this.smokeVel[n+2]*=Math.pow(.2,e)}this.smoke.geometry.getAttribute("position").needsUpdate=!0}update(e){let t=this.g,n=t.S,i=n.mode==="car"||n.mode==="moto",s=n.mode==="moto";n.mode!==this.mode&&(this.mode=n.mode,document.body.classList.toggle("awmoto",s),this.tracking=!1,this.lastSpeed=0);let r=t.camera;this.baseFov||(this.baseFov=r.fov);let a=n.car,o=i?Math.abs(a.s||0):0,l=s?this.baseFov+Math.min(6,Math.max(0,o-10)*.14):n.mode==="car"?this.baseFov+Math.min(14,Math.max(0,o-8)*.3):this.baseFov;if(Math.abs(r.fov-l)>.05&&(r.fov+=(l-r.fov)*Math.min(1,e*3),r.updateProjectionMatrix()),this.updateSmoke(e),!i)return;let c=t.held||{},u=window.__awDrift||0,d=Math.max(0,(this.lastSpeed-o)/Math.max(.001,e)),f=s?u>.22||(c.brake||d>14)&&o>9:(c.brake||d>16)&&o>14;if(this.lastSpeed=o,s&&f&&o>8)for(this.smokeClock+=e*(u>.5?1.6:1);this.smokeClock>.08;)this.smokeClock-=.08,this.spawnSmoke(a);else this.smokeClock=0;let p=a.x-this.lx,m=a.z-this.lz,x=p*p+m*m;if(!this.tracking||!f||x>25){this.lx=a.x,this.lz=a.z,this.tracking=!0;return}if(x<.7*.7)return;let v=Math.atan2(p,m);this.q.setFromAxisAngle(this.up,v),this.sc.set(1,1,Math.sqrt(x));let _=Math.sin(a.h),b=Math.cos(a.h),y=s?.75:1.3,w=s?[0]:[-.78,.78];for(let T of w)this.p.set((a.x+this.lx)/2+_*y+b*T,a.y+.04,(a.z+this.lz)/2+b*y-_*T),this.m.compose(this.p,this.q,this.sc),this.marks.setMatrixAt(this.i,this.m),this.i=(this.i+1)%Vo,this.marks.count=Math.min(Vo,this.marks.count+1);this.marks.instanceMatrix.needsUpdate=!0,this.lx=a.x,this.lz=a.z}};var Wo=560/3.6,vn=40,Wc=5.05,$p=7,Xc=4.6,qc=7.5,Xo=.56,Qp=`
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  vL = position.z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,em=`
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
}`,tm=`
attribute float aLife; attribute float aSeed; varying float vLife; uniform float uScale;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uScale * (0.35 + aLife * 0.9) * (0.7 + aSeed * 0.6) / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`,nm=`
varying float vLife; uniform float uI;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.0;
  if (r > 1.0 || vLife >= 1.0) discard;
  vec3 col = vLife < 0.25 ? mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.72, 0.32), vLife * 4.0)
                          : mix(vec3(1.0, 0.72, 0.32), vec3(0.85, 0.22, 0.04), (vLife - 0.25) / 0.75);
  float a = (1.0 - r) * pow(1.0 - vLife, 1.6) * uI;
  gl_FragColor = vec4(col * 1.6, a);
}`;function im(){let h=document.createElement("canvas");h.width=h.height=64;let e=h.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(225,238,255,1)"),t.addColorStop(.25,"rgba(150,190,255,0.6)"),t.addColorStop(.55,"rgba(255,140,40,0.3)"),t.addColorStop(1,"rgba(255,90,10,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);let n=new ze(h);return n.colorSpace=le,n}function sm(){let h=[];for(let e=0;e<=14;e++){let t=e/14;h.push(new B(Math.max(.001,(1-t**1.25)*(1+.28*Math.sin(t*Math.PI))),t))}return new Si(h,18).rotateX(Math.PI/2)}var Nr=class{constructor(e){g(this,"g");g(this,"on",!1);g(this,"btn");g(this,"fx",new ae);g(this,"plane",null);g(this,"t",0);g(this,"lvl",0);g(this,"pressOn",!1);g(this,"pressT",0);g(this,"core");g(this,"outer");g(this,"glow");g(this,"parts");g(this,"pos",new Float32Array(vn*3));g(this,"vel",new Float32Array(vn*3));g(this,"life",new Float32Array(vn).fill(1));g(this,"ttl",new Float32Array(vn).fill(.2));g(this,"emit",0);g(this,"zoomed",!1);this.g=e;let t=document.createElement("button");this.btn=t,t.innerHTML="TURBO JET<small>tap \xB7 hold</small>",t.className="awturbo",t.title="Turbo jet (T): tap to latch, hold for a burst",t.addEventListener("pointerdown",l=>{l.preventDefault(),l.stopPropagation();try{t.setPointerCapture(l.pointerId)}catch{}this.press(l.timeStamp)});let n=l=>{l.preventDefault(),this.release(l.timeStamp)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),t.addEventListener("contextmenu",l=>l.preventDefault()),document.querySelector('#actions .grp[data-for="plane"]')?.appendChild(t);let i=document.createElement("style");i.textContent=`#actions button.awturbo{grid-column:span 2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;letter-spacing:.06em;background:linear-gradient(180deg,#3a5f9ab8,#1c2c4ab8);border-color:#9fc4ffcc;-webkit-user-select:none;user-select:none}
#actions button.awturbo small{font-size:10px;font-weight:600;opacity:.75;letter-spacing:.02em}
#actions button.awturbo.lit{background:radial-gradient(circle at 50% 120%,#fff6 0,#0000 60%),linear-gradient(180deg,#ffb347,#ff6a1a);color:#1a1a1a;border-color:#fff;box-shadow:0 0 16px #ff8c1acc,0 0 4px #bfe0ff inset}`,document.head.appendChild(i),window.addEventListener("keydown",l=>{l.code==="KeyT"&&!l.repeat&&e.S.mode==="plane"&&!(l.target instanceof HTMLInputElement)&&this.press(l.timeStamp)}),window.addEventListener("keyup",l=>{l.code==="KeyT"&&this.release(l.timeStamp)}),window.addEventListener("blur",l=>this.release(l.timeStamp));let s=document.getElementById("keyhelp");s&&!/turbo/i.test(s.textContent||"")&&(s.textContent+=" \xB7 T turbo jet (plane)"),this.core=this.plume(10273535,4223231,1,.5,1),this.core.scale.set(.3,.3,Xc),this.outer=this.plume(16760426,16734738,0,.6,1.7),this.outer.scale.set(Xo,Xo,qc),this.glow=new xi(new zn({map:im(),color:13820671,blending:dn,depthWrite:!1,transparent:!0,fog:!1,toneMapped:!1})),this.glow.position.z=.15,this.glow.scale.setScalar(3),this.glow.renderOrder=6;let r=new J;r.setAttribute("position",new Z(this.pos,3).setUsage(We)),r.setAttribute("aLife",new Z(this.life,1).setUsage(We)),r.setAttribute("aSeed",new Z(Float32Array.from({length:vn},()=>Math.random()),1)),this.parts=new Qe(r,new et({vertexShader:tm,fragmentShader:nm,uniforms:{uI:{value:0},uScale:{value:300}},transparent:!0,depthWrite:!1,blending:dn})),this.parts.frustumCulled=!1,this.parts.renderOrder=5;let a=new H(new lt(.5,.36,.6,16,1,!0).rotateX(Math.PI/2),new me({color:3816514,metalness:.8,roughness:.35,side:Nt}));a.position.z=Wc-.3;let o=new ae;o.position.z=Wc,o.add(this.core,this.outer,this.glow,this.parts),this.fx.name="aw-turbo",this.fx.add(a,o),o.name="aw-turbo-flame"}plume(e,t,n,i,s){let r=new et({vertexShader:Qp,fragmentShader:em,transparent:!0,depthWrite:!1,side:Nt,blending:La,blendSrc:Na,blendDst:Ws,uniforms:{uT:{value:0},uI:{value:0},uCore:{value:n},uOcc:{value:i},uGain:{value:s},uC0:{value:new R(e)},uC1:{value:new R(t)}}}),a=new H(sm(),r);return a.renderOrder=n?5:4,a.frustumCulled=!1,a}press(e){this.g.S.mode==="plane"&&(this.on?(this.set(!1),this.pressOn=!1):(this.set(!0),this.pressOn=!0,this.pressT=e))}release(e){this.pressOn&&e-this.pressT>350&&this.set(!1),this.pressOn=!1}set(e){this.on=e,this.btn.classList.toggle("lit",e)}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}update(e){let t=this.g.S.mode==="plane";!t&&this.on&&(this.set(!1),this.pressOn=!1);let n=window;if(n.__awTurbo=this.on&&t,n.__awTurboK=2,n.__awTurboV=Wo,this.lvl+=((this.on&&t?1:0)-this.lvl)*Math.min(1,e*(this.on?7:4)),this.lvl<.003&&!this.on&&(this.lvl=0),n.__awTurboLvl=this.lvl,this.on&&t){let c=this.g.S.plane;c.s>Wo&&(c.s=Wo)}this.fov(t);let i=t?this.findPlane():null;i&&this.fx.parent!==i&&i.add(this.fx),this.fx.visible=!!i;let s=this.fx.children[1];if(s.visible=this.lvl>0,!i||!s.visible)return;this.t+=e;let r=this.t,a=this.lvl,o=1+Math.sin(r*61)*.07+Math.sin(r*37+1.1)*.06+(Math.random()-.5)*.08;for(let c of[this.core,this.outer]){let u=c.material.uniforms;u.uT.value=r,u.uI.value=a}this.core.scale.z=Xc*(.45+.55*a)*o,this.outer.scale.z=qc*(.4+.6*a)*(2-o);let l=1+(Math.random()-.5)*.06;this.outer.scale.x=this.outer.scale.y=Xo*l,this.glow.material.opacity=(.5+Math.random()*.2)*a,this.glow.scale.setScalar(3*(.8+.2*o)),this.particles(e,a)}particles(e,t){let n=this.pos,i=this.vel,s=this.life;this.emit+=e*vn/.2*t;for(let o=0;o<vn;o++){if(s[o]>=1){if(this.emit<1)continue;this.emit-=1;let l=Math.random()*.22,c=Math.random()*6.283;n[o*3]=Math.cos(c)*l,n[o*3+1]=Math.sin(c)*l,n[o*3+2]=Math.random()*.4,i[o*3]=(Math.random()-.5)*3.5,i[o*3+1]=(Math.random()-.5)*3.5,i[o*3+2]=28+Math.random()*18,s[o]=0,this.ttl[o]=.14+Math.random()*.16;continue}s[o]=Math.min(1,s[o]+e/this.ttl[o]),n[o*3]+=i[o*3]*e,n[o*3+1]+=i[o*3+1]*e,n[o*3+2]+=i[o*3+2]*e}this.emit=Math.min(this.emit,4);let r=this.parts.geometry;r.attributes.position.needsUpdate=!0,r.attributes.aLife.needsUpdate=!0;let a=this.parts.material;a.uniforms.uI.value=t,a.uniforms.uScale.value=this.g.renderer.domElement.height*.27}fov(e){let t=this.g.camera;if(!e&&!this.zoomed)return;let n=t.fov*Math.PI/360,i=$p*(e?this.lvl:0)*Math.PI/360,s=i>1e-4?Math.tan(n)/Math.tan(n+i):1;Math.abs(t.zoom-s)>1e-4&&(t.zoom=s,t.updateProjectionMatrix()),this.zoomed=s!==1}};var rm=42,am=56,om=40,lm=h=>Math.atan2(Math.sin(h),Math.cos(h)),Yc=(h,e)=>Math.sign(h)*Math.pow(Math.abs(h),e),Kc=(h,e,t)=>Math.max(e,Math.min(t,h)),qo=h=>h.y-((h.g||0)+2),Dr=class{constructor(e){g(this,"g");g(this,"ch",0);g(this,"cp",0);g(this,"cd",26);g(this,"camOn",!1);g(this,"lx",0);g(this,"lz",0);g(this,"res",{h:0,p:0,d:26});g(this,"gear");g(this,"gearK",0);g(this,"plane",null);g(this,"spawned",null);g(this,"mode","");this.g=e,this.gear=this.buildGear(),window.__awFly={gnd:t=>t.y<=(t.g||0)+2.05,ctl:(t,n,i,s,r)=>this.ctl(t,n,i,s,r),gs:t=>.6/(1+Math.abs(t.s)/15),acc:(t,n,i,s,r)=>this.acc(t,n,i,s,r),vy:(t,n,i,s)=>this.vy(t,n,s),cam:(t,n,i)=>this.cam(t,n,i),spawn:(t,n)=>this.spawn(t,n)}}ctl(e,t,n,i,s){let r=Yc(t,1.5)*1.15;e.q=(e.q||0)+(r-(e.q||0))*Math.min(1,i*7),e.p+=e.q*i;let a=Math.abs(t)<.08;if(a){let l=qo(e),c=s?0:e.thr>.5?l<90?.1:l<140?.1*(140-l)/50:0:l<25?-.035:0;e.p+=(c-e.p)*(1-.4**i)}if(s){a&&e.s>am&&e.thr>.5&&(e.p+=(.13-e.p)*Math.min(1,i*1.5));let l=e.s<rm?.02:.2;e.p>l&&(e.p+=(l-e.p)*Math.min(1,i*3)),e.p<0&&(e.p=0,e.q=Math.max(0,e.q))}let o=s?0:-Yc(n,1.4)*.85;e.r+=(o-e.r)*Math.min(1,i*(s?6:3.2))}acc(e,t,n,i,s){let r=!!window.__awTurbo,a=i&&s<-.3,o=a?0:t;i&&e.thr<.5&&(o*=(e.thr/.5)**2),i||(o=Math.max(o,om));let l=(o-e.s)*.9,c=i?r?14:7.5:r?32:16;return Kc(l,-(i?a?10:5:12),c)*n}vy(e,t,n){if(!n&&e.thr<.35&&(t-=(.35-e.thr)/.35*4.5),t>=0)return t;let i=Math.max(0,qo(e));return i>45?t:Math.max(t,-(1.2+i*.5+i*i*.03))}cam(e,t,n){let s=(this.g.camera.aspect<.8?20:26)+Math.min(e.s,160)*.055+(window.__awTurboLvl||0)*3,r=Math.hypot(e.x-this.lx,e.z-this.lz)>300;return this.lx=e.x,this.lz=e.z,(!this.camOn||n||r)&&(this.ch=e.h,this.cp=e.p,this.cd=s,this.camOn=!0),this.ch+=lm(e.h-this.ch)*Math.min(1,t*3),this.cp+=(e.p-this.cp)*Math.min(1,t*3),this.cd+=(s-this.cd)*Math.min(1,t*1.5),this.res.h=this.ch,this.res.p=this.cp,this.res.d=this.cd,this.res}runway(){let e=this.g.DATA?.runways||[],t=null,n=0;for(let i of e){let s=Math.hypot(i[i.length-1][0]-i[0][0],i[i.length-1][1]-i[0][1]);s>n&&(n=s,t=i)}return t&&n>1500?{A:t[0],B:t[t.length-1],L:n}:null}spawn(e,t){if(t==="plane")return;let n=this.runway();if(!n)return;let i=(n.B[0]-n.A[0])/n.L,s=(n.B[1]-n.A[1])/n.L,r=e.x-n.A[0],a=e.z-n.A[1],o=r*i+a*s;if(Math.abs(r*s-a*i)>450||o<-600||o>n.L+600)return;let c=o<n.L/2,u=c?90:n.L-90,d=c?1:-1;e.x=n.A[0]+i*u,e.z=n.A[1]+s*u,e.h=Math.atan2(-i*d,-s*d);let f=this.g.real;e.g=f?Math.max(0,f.heightAt(e.x,e.z)):0,e.y=e.g+2,e.p=0,e.r=0,e.s=0,e.thr=0,e.q=0,this.spawned={x:e.x,z:e.z},this.camOn=!1;let p=document.getElementById("toast");p&&(p.textContent=`Runway ${c?"29":"11"}, Queen Beatrix \xB7 hold THR+ to take off \xB7 DIVE brakes`,p.classList.add("on"),setTimeout(()=>p.classList.remove("on"),4500))}buildGear(){let e=new ae;e.name="aw-gear";let t=new me({color:12106948,metalness:.6,roughness:.4}),n=new me({color:1776413,roughness:.9}),i=new lt(.07,.07,1,6).translate(0,-.5,0),s=new lt(.26,.26,.22,12).rotateZ(Math.PI/2);for(let[r,a,o]of[[0,-3.3,-.45],[-1.15,.4,-.55],[1.15,.4,-.55]]){let l=new ae;l.position.set(r,o,a);let c=o+1.74,u=new H(i,t);u.scale.y=c,l.add(u);let d=new H(s,n);d.position.y=-c,l.add(d),e.add(l)}return e.visible=!1,e}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}get planeObj(){return this.findPlane()}update(e){let t=this.g.S;if(t.mode!==this.mode&&(this.mode=t.mode,t.mode!=="plane"&&(this.camOn=!1)),t.mode!=="plane")return;let n=t.plane;if(this.spawned){if(Math.hypot(n.x-this.spawned.x,n.z-this.spawned.z)>20){let r=this.g.real;n.y=Math.max((r?r.heightAt(n.x,n.z):0)+200,250),n.s=65,n.thr=.65,n.p=.05}this.spawned=null}let i=this.findPlane();if(!i)return;this.gear.parent!==i&&i.add(this.gear);let s=qo(n)<(this.gearK>.5?70:55);this.gearK=Kc(this.gearK+(s?e:-e)/1.6,0,1),this.gear.visible=this.gearK>.01,this.gear.scale.setScalar(this.gearK),this.gear.position.y=(1-this.gearK)*.4}};var Qn=[4380,4538,4696,4848,4999,5150,5308,5466,5629,5789],Wi=8542,Ur=80,Zc=44,Fr=class{constructor(e){g(this,"g",e);g(this,"hAt");g(this,"k",0);g(this,"ang",[]);g(this,"ys",[]);g(this,"static");g(this,"rot");g(this,"m",new U);g(this,"q",new re);g(this,"e",new ot);g(this,"p",new M);g(this,"s",new M(1,1,1));let t=e.real;this.hAt=(a,o)=>t.heightAt(a,o);let n=new tt({color:15659250}),i=new ye(.5,Zc,2);i.translate(0,Zc/2+1,0);let s=[new Ve(1.5,8,6)];for(let a=0;a<3;a++)s.push(i.clone().rotateX(a*2.0944));let r=nt(s.map(a=>a.toNonIndexed()));this.rot=new pe(r,n,Qn.length),this.rot.frustumCulled=!1,this.rot.name="aw:windfarm:rotors",this.rot.castShadow=!1,this.rebuild(),e.scene.add(this.rot)}rebuild(){let e=[];Qn.forEach((n,i)=>{let s=this.hAt(Wi,n)-.5;this.ys[i]=Number.isFinite(s)?s:this.ys[i]||0;let r=new lt(1.4,2.1,Ur,10,1,!0).toNonIndexed();r.translate(Wi,this.ys[i]+Ur/2,n);let a=new ye(10,3.6,3.6).toNonIndexed();a.translate(Wi-1.5,this.ys[i]+Ur+.3,n),e.push(r,a),this.ang[i]===void 0&&(this.ang[i]=i*.7)});let t=nt(e);t.computeBoundingSphere(),this.static?(this.static.geometry.dispose(),this.static.geometry=t):(this.static=new H(t,this.rot.material),this.static.name="aw:windfarm",this.g.scene.add(this.static))}update(e){if((++this.k&255)===0){let t=!1;for(let n=0;n<Qn.length;n++){let i=this.hAt(Wi,Qn[n])-.5;Number.isFinite(i)&&Math.abs(i-this.ys[n])>.05&&(t=!0)}t&&this.rebuild()}for(let t=0;t<Qn.length;t++)this.ang[t]-=e*.9,this.e.set(this.ang[t],0,0),this.q.setFromEuler(this.e),this.p.set(Wi+4.2,this.ys[t]+Ur+1.3,Qn[t]),this.m.compose(this.p,this.q,this.s),this.rot.setMatrixAt(t,this.m);this.rot.instanceMatrix.needsUpdate=!0}};var Or=[{n:"NEAR",d:1,p:0},{n:"FAR",d:1.75,p:.14},{n:"LOW",d:.72,p:-.13}],Br=class{constructor(){g(this,"i",0);g(this,"btn");g(this,"tip");g(this,"cd",1);g(this,"cp",0);this.btn=document.createElement("button"),this.btn.textContent="\u{1F3A5}",this.btn.title="Camera (C)",this.btn.className="aw-cam",this.btn.setAttribute("aria-label","Cycle chase camera"),this.btn.style.display="none",this.btn.addEventListener("click",t=>{t.preventDefault(),this.next()}),document.body.appendChild(this.btn),this.tip=document.createElement("div"),this.tip.className="aw-camtip",document.body.appendChild(this.tip);let e=document.createElement("style");e.textContent=".aw-cam{position:fixed;right:12px;top:170px;z-index:40;width:44px;height:44px;border-radius:12px;border:0;font:20px system-ui;background:#1e2a3ab0;color:#fff}.aw-camtip{position:fixed;right:62px;top:180px;z-index:40;font:800 12px system-ui;color:#fff;text-shadow:0 1px 3px #000;opacity:0;transition:opacity .4s;pointer-events:none}",document.head.appendChild(e),addEventListener("keydown",t=>{t.code==="KeyC"&&!(t.target instanceof HTMLInputElement)&&this.next()})}next(){this.i=(this.i+1)%Or.length,this.tip.textContent="CAM "+Or[this.i].n,this.tip.style.opacity="1",setTimeout(()=>this.tip.style.opacity="0",1200)}frame(e,t){let n=e==="car"||e==="moto";this.btn.style.display=n?"block":"none";let i=n?Or[this.i]:Or[0],s=Math.min(1,t*4);this.cd+=(i.d-this.cd)*s,this.cp+=(i.p-this.cp)*s;let r=window;r.__awCamD=this.cd,r.__awCamP=this.cp}};var jc="smoothstep(-500.0, 1200.0, dot(%P% - vec2(-8840.0, -10365.0), vec2(0.7373, -0.6756)))",cm=`
  // aw sea: awW 0 leeward (Eagle/Palm Beach) .. 1 windward north coast
  vec2 awP = vWP.xz;
  float awW = ${jc.replace("%P%","awP")};
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
  float awSpec = (1.0 - 0.45 * smoothstep(150.0, 1500.0, camD) * smoothstep(4.0, 14.0, awD)) * mix(0.65, 1.0, smoothstep(0.5, 4.0, depth));`;function hm(h,e){Yn(h,"sea-v1",t=>{let n=t.fragmentShader,i=n.indexOf("  // shoreline wash"),s="a = max(a, foam * 0.95);",r=n.indexOf(s),a="vec3 n1 = texture(wn, p / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;",o="vec3 n3 = texture(wn, p / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;",l="vec3 nW = normalize(vec3(g.x, 1.0, g.y));",c="float roughnessFactor = mix(0.04, 0.65, foam) + smoothstep(300.0, 4000.0, camD) * 0.08;",u="totalSpecular * smoothstep(0.0, 0.15, dd)";i<0||r<i||![a,o,l,c,u].every(d=>n.includes(d))||(t.fragmentShader=((e?`#define AW_SEA_HQ
`:"")+n.slice(0,i)+cm+n.slice(r+s.length)).replace(a,"vec3 n1 = awN1;").replace(o,"vec3 n3 = awN3;").replace(l,"g = g * mix(1.0, 1.45, awW) + awSwell; "+l).replace(c,c.replace(";"," + 0.05 * awW;")).replace(u,u+" * awSpec"))})}function um(h){Yn(h,"sand-v1",e=>{let t=e.fragmentShader,n="const float SAT[8] = float[8](0.55, 0.8, 0.6, 0.9, 0.85, 0.6, 0.5, 0.6);",i="const float GAIN[8] = float[8](1.12, 1.0, 1.95, 1.0, 0.8, 1.25, 1.15, 1.15);",s=`  for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) rwLayer(i, wi, P, tc, tn, tar); }
  float wsum = 0.0; for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) wsum += wi; }`,r="tc = mix(tc, tc * vec3(0.78, 0.9, 0.88), smoothstep(-0.5, -3.0, vWP.y));",a="reflectedLight.indirectSpecular *= tAO;";[n,i,s,r,a].every(o=>t.includes(o))&&(e.fragmentShader=t.replace(n,"const float SAT[8] = float[8](0.55, 0.8, 0.5, 0.9, 0.85, 0.6, 0.5, 0.6);").replace(i,"const float GAIN[8] = float[8](1.12, 1.0, 2.5, 1.0, 0.8, 1.25, 1.15, 1.15);").replace(s,`  float awIT = 1.0 / max(tot, 1e-4), wsum = 0.0;
  for (int i = 0; i < 8; i++) { float wi = w[i] * awIT; if (wi > 0.02) { rwLayer(i, wi, P, tc, tn, tar); wsum += wi; } }`).replace(r,`float awW = ${jc.replace("%P%","P")}, awSub = smoothstep(-0.2, -2.5, vWP.y);
  tc *= mix(vec3(1.0), vec3(0.96, 0.9, 0.8), awW * w[2] * awIT * (1.0 - awSub));   // windward: coarser, golden coral sand
  tc *= exp(min(vWP.y, 0.0) * vec3(0.9, 0.16, 0.11)) * (1.0 - 0.3 * awW * awSub);   // seabed: red absorbed on the way down and up, darker reef windward
  // A's wet-sand gloss (roughness .28) also covered the seabed, which then mirrored the sky up through
  // the water (the white band off every beach): matte and no sky reflection below the waterline
  float awDry = smoothstep(-0.5, 0.05, vWP.y); tRough = mix(1.0, tRough, awDry);`).replace(a,"reflectedLight.indirectSpecular *= tAO * awDry;"))})}var kr=class{constructor(e){g(this,"stats",{water:0,terrain:0,hq:!1});let t=e.real,n=O.get("seaq"),i=n?n!=="low":t.q.name!=="low";this.stats.hq=i;let s=o=>{o&&!o.userData["aw:sea-v1"]&&(hm(o,i),this.stats.water++)},r=o=>{o&&!o.userData["aw:sand-v1"]&&(um(o),this.stats.terrain++)},a=(o,l)=>{if(!o||typeof o.material!="function")return;let c=o.material.bind(o);o.material=(...u)=>{let d=c(...u);return l(d),d}};a(t.water,s),a(t.terrain,r),r(t.ovMat);for(let o of t.group.children){let l=o.material;o.isMesh&&l&&!Array.isArray(l)&&/\|water/.test(l.customProgramCacheKey?l.customProgramCacheKey():"")&&s(l)}for(let o of t.regions.values())r(o.mat),s(o.wmat)}};var dm=`
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
}`;function Jc(){let h=document.createElement("style");h.id="aw-hud",h.textContent=dm,document.head.appendChild(h)}var Yo="#1d5683",$c="#47524c",Qc="#4c6444",eh="#262c31",fm="#1b2126",th=["#aeb5b8","#c3c8ca","#eef0f0","#ffd34d","#ffd34d"],nh=[1.1,1.4,2.1,2.7,3.2],pm=[.45,.55,.9,1.3,1.6],mm=new Set(["store","mall","hotel","gas","attraction"]),gm=new Set(["mall","hotel","gas","attraction"]),zr=class{constructor(e){g(this,"g",e);g(this,"stats",{tiles:0,tileMs:0,jobMaxMs:0,world:!1,labels:0,size:0});g(this,"canvas",document.getElementById("minimap"));g(this,"ctx",null);g(this,"css",0);g(this,"tile",document.createElement("canvas"));g(this,"tcx",0);g(this,"tcz",0);g(this,"tppm",0);g(this,"tileOk",!1);g(this,"tileQueued",!1);g(this,"want",{ppm:0,cssPerM:0});g(this,"world",document.createElement("canvas"));g(this,"wk",0);g(this,"wb",null);g(this,"data",null);g(this,"grid",null);g(this,"parkGrid",null);g(this,"stamp",null);g(this,"parkStamp",null);g(this,"gen",0);g(this,"jobs",[]);g(this,"idleOn",!1);g(this,"range",0);g(this,"placed",[]);g(this,"pick",[]);g(this,"rim",null);g(this,"rimW",0);this.tile.width=this.tile.height=1024,this.canvas&&(this.ctx=this.canvas.getContext("2d"),document.body.classList.add("awmm"),this.resize(),addEventListener("resize",()=>this.resize()),addEventListener("orientationchange",()=>setTimeout(()=>this.resize(),250)),window.__awMiniMap=(t,n,i,s,r,a,o,l)=>this.draw(t,n,i,s,r,a,o,l))}resize(){let e=this.canvas,t=e.parentElement;this.css=t.clientWidth||120;let n=Math.max(96,Math.min(300,Math.round(this.css*Math.min(3,devicePixelRatio||1))));e.width!==n&&(e.width=e.height=n,this.tileOk=!1),this.stats.size=n}idle(e,t=!1){t?this.jobs.unshift(e):this.jobs.push(e),this.kick()}kick(){if(this.idleOn||!this.jobs.length)return;this.idleOn=!0;let e=n=>{this.idleOn=!1;do{let i=performance.now();this.jobs.shift()(),this.stats.jobMaxMs=Math.max(this.stats.jobMaxMs,Math.round((performance.now()-i)*10)/10)}while(this.jobs.length&&n&&n.timeRemaining()>4);this.kick()},t=window.requestIdleCallback;t?t(e,{timeout:250}):setTimeout(e,16)}start(e,t){this.data=e,this.wb=t,this.idle(()=>{this.grid||this.index(e)});let n=Math.max(t.maxX-t.minX,t.maxZ-t.minZ),i=this.wk=1024/n,s=this.world;s.width=s.height=1024;let r=s.getContext("2d"),a=c=>(c-t.minX)*i,o=c=>(c-t.minZ)*i,l=c=>c.forEach(([u,d],f)=>f?r.lineTo(a(u),o(d)):r.moveTo(a(u),o(d)));this.idle(()=>{r.fillStyle=Yo,r.fillRect(0,0,1024,1024),r.fillStyle=$c,r.beginPath();for(let c of e.land)l(c.outer),r.closePath();r.fill(),r.fillStyle=Qc,r.beginPath();for(let c of e.parks)l(c),r.closePath();r.fill(),r.lineCap=r.lineJoin="round",r.strokeStyle=eh,r.lineWidth=45*i,r.beginPath();for(let c of e.runways)l(c);r.stroke()});for(let c=0;c<=4;c++)this.idle(()=>{r.strokeStyle=th[c],r.lineWidth=pm[c],r.beginPath();for(let u of e.roads)u.c===c&&l(u.p);r.stroke(),c===4&&(this.stats.world=!0)})}key(e,t){return e*65536+t}index(e){let t=new Map,n=new Map,i=(s,r,a)=>{let o=1/0,l=-1/0,c=1/0,u=-1/0;for(let[d,f]of r)d<o&&(o=d),d>l&&(l=d),f<c&&(c=f),f>u&&(u=f);for(let d=Math.floor(o/500);d<=Math.floor(l/500);d++)for(let f=Math.floor(c/500);f<=Math.floor(u/500);f++){let p=this.key(d,f),m=s.get(p);m||s.set(p,m=[]),m.push(a)}};e.roads.forEach((s,r)=>i(t,s.p,r)),e.parks.forEach((s,r)=>i(n,s,r)),this.grid=t,this.parkGrid=n,this.stamp=new Uint32Array(e.roads.length),this.parkStamp=new Uint32Array(e.parks.length)}query(e,t,n,i,s,r,a){a.length=0;for(let o=Math.floor(n/500);o<=Math.floor(s/500);o++)for(let l=Math.floor(i/500);l<=Math.floor(r/500);l++){let c=e.get(this.key(o,l));if(c)for(let u of c)t[u]!==this.gen&&(t[u]=this.gen,a.push(u))}return a}queueTile(e,t){if(this.want.ppm=e,this.want.cssPerM=t,this.tileQueued)return;this.tileQueued=!0;let n=()=>{if(!this.grid){this.index(this.data),this.idle(n,!0);return}this.tileQueued=!1;let i=this.g.S,s=i.mode==="walk"?i.walk:i.car;this.renderTile(s.x,s.z,this.want.ppm,this.want.cssPerM)};this.idle(n,!0)}renderTile(e,t,n,i){let s=performance.now(),r=this.data,a=this.tile.getContext("2d"),o=1024/2/n,l=e-o,c=e+o,u=t-o,d=t+o,f=y=>(y-e)*n+1024/2,p=y=>(y-t)*n+1024/2,m=y=>y.forEach(([w,T],A)=>A?a.lineTo(f(w),p(T)):a.moveTo(f(w),p(T)));a.fillStyle=Yo,a.fillRect(0,0,1024,1024),a.fillStyle=$c,a.beginPath();for(let y of r.land)m(y.outer),a.closePath();a.fill();let x=[];this.gen++,a.fillStyle=Qc,a.beginPath();for(let y of this.query(this.parkGrid,this.parkStamp,l,u,c,d,x))m(r.parks[y]),a.closePath();a.fill(),a.lineCap=a.lineJoin="round",a.strokeStyle=eh,a.lineWidth=45*n,a.beginPath();for(let y of r.runways)m(y);a.stroke(),this.gen++;let v=this.query(this.grid,this.stamp,l,u,c,d,x),_=n/i,b=(y,w,T)=>{a.strokeStyle=T,a.lineWidth=w,a.beginPath();for(let A of v){let S=r.roads[A];S.c===y&&m(S.p)}a.stroke()};for(let y=2;y<=4;y++)b(y,(nh[y]+1.2)*_,fm);for(let y=0;y<=4;y++)b(y,nh[y]*_,th[y]);this.tcx=e,this.tcz=t,this.tppm=n,this.tileOk=!0,this.stats.tiles++,this.stats.tileMs=Math.round((performance.now()-s)*10)/10}draw(e,t,n,i,s,r,a,o){let l=this.ctx;if(!l)return;this.data||this.start(o,r);let c=this.g.S,u=c.mode,f=u==="car"||u==="moto"?900+Math.min(45,Math.abs(c.car.s||0))*13:u==="walk"?480:i;this.range=!this.range||u==="plane"?f:this.range+(f-this.range)*.12;let p=this.range,m=this.canvas.width,x=m/this.css,v=m/p;l.save(),l.fillStyle=Yo,l.fillRect(0,0,m,m),l.translate(m/2,m/2),l.rotate(n);let _=!1;if(p<=2e3){let b=p<700?.75:.36,y=1024/2/b-p*.5-Math.max(Math.abs(e-this.tcx),Math.abs(t-this.tcz));_=this.tileOk&&this.tppm===b&&y>20,(!_||y<300)&&this.queueTile(b,v/x)}if(_){let b=p*this.tppm;l.drawImage(this.tile,(e-this.tcx)*this.tppm+1024/2-b/2,(t-this.tcz)*this.tppm+1024/2-b/2,b,b,-m/2,-m/2,m,m)}else{let b=this.stats.world,y=b?this.world:s.c,w=b?this.wk:s.k,T=p*w;l.drawImage(y,(e-r.minX)*w-T/2,(t-r.minZ)*w-T/2,T,T,-m/2,-m/2,m,m)}this.pois(l,e,t,n,v,x,m,a,p<=2e3),l.restore(),this.chrome(l,m,n,x)}pois(e,t,n,i,s,r,a,o,l){let c=a/2-4*r,u=c*c,d=this.pick;d.length=0,e.lineWidth=1.2*r,e.strokeStyle="#fff";for(let _ of o){let b=(_.x-t)*s,y=(_.z-n)*s,w=b*b+y*y;w>u||_.k.startsWith("m_")||(l&&gm.has(_.cat)&&(e.fillStyle=_.bg==="#ffffff"||_.bg==="#f4f1e6"?_.fg:_.bg,e.beginPath(),e.arc(b,y,2.4*r,0,6.2832),e.fill(),e.stroke()),mm.has(_.cat)&&_.sign&&d.push({b:_,d:_.cat==="store"?w:w*.3,x:b,y}))}d.sort((_,b)=>_.d-b.d);let f=this.placed;f.length=0,e.font=`800 ${Math.round(9.5*r)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.lineJoin="round";let p=Math.sin(i),m=Math.cos(i),x=0,v=0;for(let _ of d){if(x>=3||v>24)break;let b=_.x*m-_.y*p,y=_.x*p+_.y*m-9*r;if(Math.abs(b)<18*r&&Math.abs(y)<19*r)continue;v++;let w=_.b.sign.length>14?_.b.sign.slice(0,13)+"\u2026":_.b.sign,T=e.measureText(w).width+8*r,A=15*r;if(Math.hypot(Math.abs(b)+T/2,Math.abs(y)+A/2)>a/2-2*r)continue;let S=!1;for(let E=0;E<f.length;E+=4)if(Math.abs(b-f[E])*2<T+f[E+2]&&Math.abs(y-f[E+1])*2<A+f[E+3]){S=!0;break}S||Math.abs(b)<T/2+10*r&&Math.abs(y)<A/2+11*r||(f.push(b,y,T,A),e.save(),e.rotate(-i),e.lineWidth=3.2*r,e.strokeStyle="rgba(10,14,18,.85)",e.strokeText(w,b,y),e.fillStyle="#fff",e.fillText(w,b,y),e.restore(),x++)}this.stats.labels=x}chrome(e,t,n,i){let s=t/2;(!this.rim||this.rimW!==t)&&(this.rim=e.createRadialGradient(s,s,s*.72,s,s,s),this.rimW=t,this.rim.addColorStop(0,"rgba(0,0,0,0)"),this.rim.addColorStop(1,"rgba(0,0,0,.38)")),e.fillStyle=this.rim,e.fillRect(0,0,t,t),e.save(),e.translate(s,s),e.beginPath(),e.moveTo(0,-9*i),e.lineTo(7*i,7*i),e.lineTo(0,3.2*i),e.lineTo(-7*i,7*i),e.closePath(),e.lineJoin="round",e.lineWidth=3*i,e.strokeStyle="#11161b",e.stroke(),e.fillStyle="#fff",e.fill();let r=s-9*i,a=Math.sin(n)*r,o=-Math.cos(n)*r;e.beginPath(),e.arc(a,o,7.5*i,0,6.2832),e.fillStyle="#11161bdd",e.fill(),e.lineWidth=1.4*i,e.strokeStyle="#ffd23f",e.stroke(),e.font=`900 ${Math.round(9*i)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffd23f",e.fillText("N",a,o+.5*i),e.restore()}};var ih=O.get("addons")!=="0"&&O.get("gvmoto")!=="0"&&O.get("gv")!=="0";window.__awMotoEnabled=ih;async function xm(){if(O.get("addons")==="0")return;O.get("hud")!=="0"&&Jc();let h=await Jo(),e=O.get("perf")!=="0"?new fr(h):null,t=O.get("look")!=="0"?new pr(h):null,n=O.get("sea")!=="0"?new kr(h):null,i=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,s=O.get("flora")!=="0"?new mr(h,e?e.mobile:i):null,r=O.get("jobs")!=="0"?new gr(h,(e?e.mobile:i)?5:8):null,a=new vr(h,e?e.mobile:i),o=O.get("far")!=="0"?new xr(h,h.real.q.name!=="low"):null,l=O.get("split")!=="0"?new wr((e?e.mobile:i)?3:4):null,c=O.get("hiperf")!=="0"?new Ar(h):null,u=O.get("hilook")==="1"?new Tr(h):null,d=O.get("life")!=="0",f=d&&O.get("peds")!=="0"?new hr(h):null,p=!f&&O.get("kids")!=="0"?new Sr(h,e?e.mobile:i):null,m=O.get("debug")==="1"?new _r(h):null,x=new Xi,v=O.get("daynight")!=="0",_=v?new Js(h,O.get("sun")!=="0"):null,b=v?new $s(h):null,y=v?new or(h):null,w=d&&O.get("traffic")!=="0"?new cr(h):null,T=O.get("audio")!=="0"?new ur(h):null,A=O.get("emerg")!=="0"?new Ir(h):null,S=O.get("crash")!=="0"?new Pr(h,A):null,E=ih?new Lr(h):null,C=O.get("fly")!=="0"?new Dr(h):null,I=O.get("turbo")!=="0"?new Nr(h):null,P=O.get("wind")!=="0"?new Fr(h):null,L=O.get("camcycle")!=="0"?new Br:null,F=O.get("minimap")!=="0"?new zr(h):null;{let ee=()=>{let k=document.querySelector("#credits ul");if(!k)return!1;if(!k.querySelector(".aw-msb")){let Q=document.createElement("li");Q.className="aw-msb",Q.innerHTML='Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)',k.appendChild(Q)}if(!k.querySelector(".aw-mly")){let Q=document.createElement("li");Q.className="aw-mly",Q.innerHTML='Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>',k.appendChild(Q)}return!0};if(!ee()){let k=0,Q=setInterval(()=>{(ee()||++k>30)&&clearInterval(Q)},1e3)}}let D=new er(h),G=O.get("mperf")!=="0"?new nr(h,e?e.mobile:i):null,K=O.get("ovmerge")!=="0"&&h.real?new sr(h.real):null,j=O.get("tmerge")!=="0"&&h.real?new rr(h.real):null,V=O.get("bmerge")!=="0"?new ir(h):null,W=O.get("preload")!=="0"?new tr(h):null,$=Ac(x,D);window.__aw={clock:x,dn:_,lights:b,lamps:y,traffic:w,peds:f,audio:T,guard:D,perf:e,look:t,flora:s,jobs:r,far:o,ctxg:a,kids:p,split:l,hip:c,hil:u,emerg:A,crash:S,gv:E,fly:C,turbo:I,bmerge:V,mperf:G,ovm:K,tmerge:j,sea:n,minimap:F,version:"0.12.0"};let he=performance.now(),ue=ee=>{let k=Math.max(0,Math.min(2,(ee-he)/1e3));he=ee,gn.value+=k,x.step(Math.min(k,.1)),_&&_.apply(x.t),b&&b.update(k),y&&y.update(k),w&&w.update(k),f&&f.update(Math.min(k,.1),gn.value),T&&T.update(),A&&A.update(Math.min(k,.1)),S&&S.update(Math.min(k,.1)),E&&E.update(Math.min(k,.1)),C&&C.update(Math.min(k,.1)),I&&I.update(Math.min(k,.1)),P&&P.update(Math.min(k,.1)),L&&L.frame(h.S.mode,Math.min(k,.1)),e&&e.update(k),t&&t.update(xe.value),r&&r.frame(),c&&c.frame(),o&&o.update(k),p&&p.update(Math.min(k,.1)),m&&m.frame(k*1e3),D.frame(k),W&&W.frame(k),G&&G.frame(k),V&&V.frame(),$(),requestAnimationFrame(ue)};requestAnimationFrame(ue),console.info("[aw-addons] day/night + night lights + fps guard active",h.real?.q?.name)}xm().catch(h=>console.error("[aw-addons] failed",h));
