var sm=Object.defineProperty;var rm=(l,e,t)=>e in l?sm(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var x=(l,e,t)=>rm(l,typeof e!="symbol"?e+"":e,t);function Gu(){return new Promise(l=>{let e=()=>{let t=window.game;t&&t.ready&&t.real&&t.real.sky&&t.real.sky.sun?l(t):setTimeout(e,250)};e()})}var H=new URLSearchParams(location.search);var Hu="aw_clock";function om(){let l={t:.4166666666666667,frozen:!1,len:24};try{let n=JSON.parse(localStorage.getItem(Hu)||"null");n&&isFinite(n.t)&&(l={t:n.t,frozen:!!n.frozen,len:isFinite(n.len)&&n.len>0?n.len:24})}catch{}let e=H.get("t");e!==null&&isFinite(+e)&&(l.t=(+e%24+24)%24/24);let t=H.get("daylen");return t!==null&&+t>0&&(l.len=+t),H.get("freeze")==="1"&&(l.frozen=!0),l}var ir=class{constructor(){x(this,"t");x(this,"frozen");x(this,"len");x(this,"lastSave",0);x(this,"listeners",[]);let e=om();this.t=e.t,this.frozen=e.frozen,this.len=e.len}step(e){this.frozen||(this.t=(this.t+e/(this.len*60))%1),performance.now()-this.lastSave>5e3&&this.save()}setHour(e){this.t=(e%24+24)%24/24,this.save(),this.listeners.forEach(t=>t())}setFrozen(e){this.frozen=e,this.save(),this.listeners.forEach(t=>t())}onChange(e){this.listeners.push(e)}save(){this.lastSave=performance.now();try{localStorage.setItem(Hu,JSON.stringify({t:+this.t.toFixed(5),frozen:this.frozen,len:this.len}))}catch{}}};var Dh=1;var Nh=3,Is=0,no=1,$=2,El=0,Oh=1,Kn=2;var Rl=5;var Fh=100;var Cl=201;var Uh=204,io=205;var al=0,ll=1,cl=2,kr=3,ul=4,hl=5,dl=6,fl=7,so=0,Bh=1,kh=2;var Il=1,Pl=2,Ll=3,Dl=4,Nl=5,Ol=6,Fl=7,pl="attached",zh="detached",Ul=300,Gh=301,Bl=302;var Hh=306,Ht=1e3,Fn=1001,us=1002,Si=1003,kl=1004;var zl=1005;var $t=1006,Gl=1007;var jn=1008;var Jn=1009;var Vh=1014,Ai=1015;var Vt=1023;var Wh=1028,Xh=1029;var qh=2200,Yh=2201,Zh=2202,kn=2300,zn=2301,Or=2302,ml=2303,Un=2400,Bn=2401,hs=2402,ro=2500,Kh=2501,Hl=0,Ps=1,Oi=2;var Vl=0;var Wl="",j="srgb",it="srgb-linear",gl="linear",Fr="srgb";var Ur=7680;var jh=519;var Xl=35044,ct=35048;var zt=2e3,ds=2001;function am(l){for(let e=l.length-1;e>=0;--e)if(l[e]>=65535)return!0;return!1}function lm(l){return ArrayBuffer.isView(l)&&!(l instanceof DataView)}function zr(l){return document.createElementNS("http://www.w3.org/1999/xhtml",l)}var Vu={},Ti=null;function xl(...l){let e="THREE."+l.shift();Ti?Ti("log",e,...l):console.log(e,...l)}function Jh(l){let e=l[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=l[1];t&&t.isStackTrace?l[0]+=" "+t.getLocation():l[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return l}function be(...l){l=Jh(l);let e="THREE."+l.shift();if(Ti)Ti("warn",e,...l);else{let t=l[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...l)}}function Se(...l){l=Jh(l);let e="THREE."+l.shift();if(Ti)Ti("error",e,...l);else{let t=l[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...l)}}function Mi(...l){let e=l.join(" ");e in Vu||(Vu[e]=!0,be(...l))}var cm={[al]:ll,[cl]:dl,[ul]:fl,[kr]:hl,[ll]:al,[dl]:cl,[fl]:ul,[hl]:kr},Wt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}},Ge=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Wu=1234567,ls=Math.PI/180,Ei=180/Math.PI;function xt(){let l=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ge[l&255]+Ge[l>>8&255]+Ge[l>>16&255]+Ge[l>>24&255]+"-"+Ge[e&255]+Ge[e>>8&255]+"-"+Ge[e>>16&15|64]+Ge[e>>24&255]+"-"+Ge[t&63|128]+Ge[t>>8&255]+"-"+Ge[t>>16&255]+Ge[t>>24&255]+Ge[n&255]+Ge[n>>8&255]+Ge[n>>16&255]+Ge[n>>24&255]).toLowerCase()}function se(l,e,t){return Math.max(e,Math.min(t,l))}function ql(l,e){return(l%e+e)%e}function um(l,e,t,n,i){return n+(l-e)*(i-n)/(t-e)}function hm(l,e,t){return l!==e?(t-l)/(e-l):0}function cs(l,e,t){return(1-t)*l+t*e}function dm(l,e,t,n){return cs(l,e,1-Math.exp(-t*n))}function fm(l,e=1){return e-Math.abs(ql(l,e*2)-e)}function pm(l,e,t){return l<=e?0:l>=t?1:(l=(l-e)/(t-e),l*l*(3-2*l))}function mm(l,e,t){return l<=e?0:l>=t?1:(l=(l-e)/(t-e),l*l*l*(l*(l*6-15)+10))}function gm(l,e){return l+Math.floor(Math.random()*(e-l+1))}function xm(l,e){return l+Math.random()*(e-l)}function bm(l){return l*(.5-Math.random())}function vm(l){l!==void 0&&(Wu=l);let e=Wu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function _m(l){return l*ls}function ym(l){return l*Ei}function Mm(l){return l>0&&Number.isInteger(l)&&2**Math.round(Math.log2(l))===l}function wm(l){return Math.pow(2,Math.ceil(Math.log(l)/Math.LN2))}function Sm(l){return Math.pow(2,Math.floor(Math.log(l)/Math.LN2))}function Am(l,e,t,n,i){let s=Math.cos,r=Math.sin,o=s(t/2),a=r(t/2),c=s((e+n)/2),u=r((e+n)/2),h=s((e-n)/2),d=r((e-n)/2),f=s((n-e)/2),p=r((n-e)/2);switch(i){case"XYX":l.set(o*u,a*h,a*d,o*c);break;case"YZY":l.set(a*d,o*u,a*h,o*c);break;case"ZXZ":l.set(a*h,a*d,o*u,o*c);break;case"XZX":l.set(o*u,a*p,a*f,o*c);break;case"YXY":l.set(a*f,o*u,a*p,o*c);break;case"ZYZ":l.set(a*p,a*f,o*u,o*c);break;default:be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function gt(l,e){switch(e.constructor){case Float32Array:return l;case Uint32Array:return l/4294967295;case Uint16Array:return l/65535;case Uint8Array:case Uint8ClampedArray:return l/255;case Int32Array:return Math.max(l/2147483647,-1);case Int16Array:return Math.max(l/32767,-1);case Int8Array:return Math.max(l/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function xe(l,e){switch(e.constructor){case Float32Array:return l;case Uint32Array:return Math.round(l*4294967295);case Uint16Array:return Math.round(l*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(l*255);case Int32Array:return Math.round(l*2147483647);case Int16Array:return Math.round(l*32767);case Int8Array:return Math.round(l*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Yl={DEG2RAD:ls,RAD2DEG:Ei,generateUUID:xt,clamp:se,euclideanModulo:ql,mapLinear:um,inverseLerp:hm,lerp:cs,damp:dm,pingpong:fm,smoothstep:pm,smootherstep:mm,randInt:gm,randFloat:xm,randFloatSpread:bm,seededRandom:vm,degToRad:_m,radToDeg:ym,isPowerOfTwo:Mm,ceilPowerOfTwo:wm,floorPowerOfTwo:Sm,setQuaternionFromProperEuler:Am,normalize:xe,denormalize:gt},Jl=class Jl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=se(this.x,e.x,t.x),this.y=se(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=se(this.x,e,t),this.y=se(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(se(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Jl.prototype.isVector2=!0;var B=Jl,Z=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,o){let a=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3],d=s[r+0],f=s[r+1],p=s[r+2],m=s[r+3];if(h!==m||a!==d||c!==f||u!==p){let g=a*d+c*f+u*p+h*m;g<0&&(d=-d,f=-f,p=-p,m=-m,g=-g);let b=1-o;if(g<.9995){let v=Math.acos(g),y=Math.sin(v);b=Math.sin(b*v)/y,o=Math.sin(o*v)/y,a=a*b+d*o,c=c*b+f*o,u=u*b+p*o,h=h*b+m*o}else{a=a*b+d*o,c=c*b+f*o,u=u*b+p*o,h=h*b+m*o;let v=1/Math.sqrt(a*a+c*c+u*u+h*h);a*=v,c*=v,u*=v,h*=v}}e[t]=a,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,r){let o=n[i],a=n[i+1],c=n[i+2],u=n[i+3],h=s[r],d=s[r+1],f=s[r+2],p=s[r+3];return e[t]=o*p+u*h+a*f-c*d,e[t+1]=a*p+u*d+c*h-o*f,e[t+2]=c*p+u*f+o*d-a*h,e[t+3]=u*p-o*h-a*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,r=e._order,o=Math.cos,a=Math.sin,c=o(n/2),u=o(i/2),h=o(s/2),d=a(n/2),f=a(i/2),p=a(s/2);switch(r){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:be("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],c=t[2],u=t[6],h=t[10],d=n+o+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-a)*f,this._y=(s-c)*f,this._z=(r-i)*f}else if(n>o&&n>h){let f=2*Math.sqrt(1+n-o-h);this._w=(u-a)/f,this._x=.25*f,this._y=(i+r)/f,this._z=(s+c)/f}else if(o>h){let f=2*Math.sqrt(1+o-n-h);this._w=(s-c)/f,this._x=(i+r)/f,this._y=.25*f,this._z=(a+u)/f}else{let f=2*Math.sqrt(1+h-n-o);this._w=(r-i)/f,this._x=(s+c)/f,this._y=(a+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(se(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,o=t._x,a=t._y,c=t._z,u=t._w;return this._x=n*u+r*o+i*c-s*a,this._y=i*u+r*a+s*o-n*c,this._z=s*u+r*c+n*a-i*o,this._w=r*u-n*o-i*a-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,s=-s,r=-r,o=-o);let a=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);a=Math.sin(a*c)/u,t=Math.sin(t*c)/u,this._x=this._x*a+n*t,this._y=this._y*a+i*t,this._z=this._z*a+s*t,this._w=this._w*a+r*t,this._onChangeCallback()}else this._x=this._x*a+n*t,this._y=this._y*a+i*t,this._z=this._z*a+s*t,this._w=this._w*a+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},$l=class $l{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Xu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Xu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,r=e.y,o=e.z,a=e.w,c=2*(r*i-o*n),u=2*(o*t-s*i),h=2*(s*n-r*t);return this.x=t+a*c+r*h-o*u,this.y=n+a*u+o*c-s*h,this.z=i+a*h+s*u-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=se(this.x,e.x,t.x),this.y=se(this.y,e.y,t.y),this.z=se(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=se(this.x,e,t),this.y=se(this.y,e,t),this.z=se(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,r=t.x,o=t.y,a=t.z;return this.x=i*a-s*o,this.y=s*r-n*a,this.z=n*o-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Na.copy(this).projectOnVector(e),this.sub(Na)}reflect(e){return this.sub(Na.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(se(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};$l.prototype.isVector3=!0;var M=$l,Na=new M,Xu=new Z,Ql=class Ql{constructor(e,t,n,i,s,r,o,a,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,o,a,c)}set(e,t,n,i,s,r,o,a,c){let u=this.elements;return u[0]=e,u[1]=i,u[2]=o,u[3]=t,u[4]=s,u[5]=a,u[6]=n,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],o=n[3],a=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],m=i[0],g=i[3],b=i[6],v=i[1],y=i[4],_=i[7],S=i[2],E=i[5],C=i[8];return s[0]=r*m+o*v+a*S,s[3]=r*g+o*y+a*E,s[6]=r*b+o*_+a*C,s[1]=c*m+u*v+h*S,s[4]=c*g+u*y+h*E,s[7]=c*b+u*_+h*C,s[2]=d*m+f*v+p*S,s[5]=d*g+f*y+p*E,s[8]=d*b+f*_+p*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],a=e[6],c=e[7],u=e[8];return t*r*u-t*o*c-n*s*u+n*o*a+i*s*c-i*r*a}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],a=e[6],c=e[7],u=e[8],h=u*r-o*c,d=o*a-u*s,f=c*s-r*a,p=t*h+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=h*m,e[1]=(i*c-u*n)*m,e[2]=(o*n-i*r)*m,e[3]=d*m,e[4]=(u*t-i*a)*m,e[5]=(i*s-o*t)*m,e[6]=f*m,e[7]=(n*a-c*t)*m,e[8]=(r*t-n*s)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,o){let a=Math.cos(s),c=Math.sin(s);return this.set(n*a,n*c,-n*(a*r+c*o)+r+e,-i*c,i*a,-i*(-c*r+a*o)+o+t,0,0,1),this}scale(e,t){return Mi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Oa.makeScale(e,t)),this}rotate(e){return Mi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Oa.makeRotation(-e)),this}translate(e,t){return Mi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Oa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Ql.prototype.isMatrix3=!0;var te=Ql,Oa=new te,qu=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yu=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tm(){let l={enabled:!0,workingColorSpace:it,spaces:{},convert:function(i,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===Fr&&(i.r=Gt(i.r),i.g=Gt(i.g),i.b=Gt(i.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Fr&&(i.r=wi(i.r),i.g=wi(i.g),i.b=wi(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Wl?gl:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,r){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Mi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),l.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Mi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),l.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return l.define({[it]:{primaries:e,whitePoint:n,transfer:gl,toXYZ:qu,fromXYZ:Yu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:j},outputColorSpaceConfig:{drawingBufferColorSpace:j}},[j]:{primaries:e,whitePoint:n,transfer:Fr,toXYZ:qu,fromXYZ:Yu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:j}}}),l}var We=Tm();function Gt(l){return l<.04045?l*.0773993808:Math.pow(l*.9478672986+.0521327014,2.4)}function wi(l){return l<.0031308?l*12.92:1.055*Math.pow(l,.41666)-.055}var oi,Gr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{oi===void 0&&(oi=zr("canvas")),oi.width=e.width,oi.height=e.height;let i=oi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=oi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=zr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Gt(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gt(t[n]/255)*255):t[n]=Gt(t[n]);return{data:t,width:e.width,height:e.height}}else return be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Em=0,Hr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=xt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,o=i.length;r<o;r++)i[r].isDataTexture?s.push(Fa(i[r].image)):s.push(Fa(i[r]))}else s=Fa(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function Fa(l){return typeof HTMLImageElement<"u"&&l instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&l instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&l instanceof ImageBitmap?Gr.getDataURL(l):l.data?{data:Array.from(l.data),width:l.width,height:l.height,type:l.data.constructor.name}:(be("Texture: Unable to serialize Texture."),{})}var Rm=0,Ua=new M,at=class l extends Wt{constructor(e=l.DEFAULT_IMAGE,t=l.DEFAULT_MAPPING,n=Fn,i=Fn,s=$t,r=jn,o=Vt,a=Jn,c=l.DEFAULT_ANISOTROPY,u=Wl){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=xt(),this.name="",this.source=new Hr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=a,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ua).x}get height(){return this.source.getSize(Ua).y}get depth(){return this.source.getSize(Ua).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){be(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ul)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ht:e.x=e.x-Math.floor(e.x);break;case Fn:e.x=e.x<0?0:1;break;case us:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ht:e.y=e.y-Math.floor(e.y);break;case Fn:e.y=e.y<0?0:1;break;case us:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};at.DEFAULT_IMAGE=null;at.DEFAULT_MAPPING=Ul;at.DEFAULT_ANISOTROPY=1;var ec=class ec{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,a=e.elements,c=a[0],u=a[4],h=a[8],d=a[1],f=a[5],p=a[9],m=a[2],g=a[6],b=a[10];if(Math.abs(u-d)<.01&&Math.abs(h-m)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+m)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+b-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,_=(f+1)/2,S=(b+1)/2,E=(u+d)/4,C=(h+m)/4,T=(p+g)/4;return y>_&&y>S?y<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(y),i=E/n,s=C/n):_>S?_<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(_),n=E/i,s=T/i):S<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(S),n=C/s,i=T/s),this.set(n,i,s,t),this}let v=Math.sqrt((g-p)*(g-p)+(h-m)*(h-m)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(g-p)/v,this.y=(h-m)/v,this.z=(d-u)/v,this.w=Math.acos((c+f+b-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=se(this.x,e.x,t.x),this.y=se(this.y,e.y,t.y),this.z=se(this.z,e.z,t.z),this.w=se(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=se(this.x,e,t),this.y=se(this.y,e,t),this.z=se(this.z,e,t),this.w=se(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ec.prototype.isVector4=!0;var Ye=ec;var to=class to{constructor(e,t,n,i,s,r,o,a,c,u,h,d,f,p,m,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,o,a,c,u,h,d,f,p,m,g)}set(e,t,n,i,s,r,o,a,c,u,h,d,f,p,m,g){let b=this.elements;return b[0]=e,b[4]=t,b[8]=n,b[12]=i,b[1]=s,b[5]=r,b[9]=o,b[13]=a,b[2]=c,b[6]=u,b[10]=h,b[14]=d,b[3]=f,b[7]=p,b[11]=m,b[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new to().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/ai.setFromMatrixColumn(e,0).length(),s=1/ai.setFromMatrixColumn(e,1).length(),r=1/ai.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,r=Math.cos(n),o=Math.sin(n),a=Math.cos(i),c=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=r*u,f=r*h,p=o*u,m=o*h;t[0]=a*u,t[4]=-a*h,t[8]=c,t[1]=f+p*c,t[5]=d-m*c,t[9]=-o*a,t[2]=m-d*c,t[6]=p+f*c,t[10]=r*a}else if(e.order==="YXZ"){let d=a*u,f=a*h,p=c*u,m=c*h;t[0]=d+m*o,t[4]=p*o-f,t[8]=r*c,t[1]=r*h,t[5]=r*u,t[9]=-o,t[2]=f*o-p,t[6]=m+d*o,t[10]=r*a}else if(e.order==="ZXY"){let d=a*u,f=a*h,p=c*u,m=c*h;t[0]=d-m*o,t[4]=-r*h,t[8]=p+f*o,t[1]=f+p*o,t[5]=r*u,t[9]=m-d*o,t[2]=-r*c,t[6]=o,t[10]=r*a}else if(e.order==="ZYX"){let d=r*u,f=r*h,p=o*u,m=o*h;t[0]=a*u,t[4]=p*c-f,t[8]=d*c+m,t[1]=a*h,t[5]=m*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*a,t[10]=r*a}else if(e.order==="YZX"){let d=r*a,f=r*c,p=o*a,m=o*c;t[0]=a*u,t[4]=m-d*h,t[8]=p*h+f,t[1]=h,t[5]=r*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+p,t[10]=d-m*h}else if(e.order==="XZY"){let d=r*a,f=r*c,p=o*a,m=o*c;t[0]=a*u,t[4]=-h,t[8]=c*u,t[1]=d*h+m,t[5]=r*u,t[9]=f*h-p,t[2]=p*h-f,t[6]=o*u,t[10]=m*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Cm,e,Im)}lookAt(e,t,n){let i=this.elements;return tt.subVectors(e,t),tt.lengthSq()===0&&(tt.z=1),tt.normalize(),nn.crossVectors(n,tt),nn.lengthSq()===0&&(Math.abs(n.z)===1?tt.x+=1e-4:tt.z+=1e-4,tt.normalize(),nn.crossVectors(n,tt)),nn.normalize(),sr.crossVectors(tt,nn),i[0]=nn.x,i[4]=sr.x,i[8]=tt.x,i[1]=nn.y,i[5]=sr.y,i[9]=tt.y,i[2]=nn.z,i[6]=sr.z,i[10]=tt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],o=n[4],a=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],m=n[6],g=n[10],b=n[14],v=n[3],y=n[7],_=n[11],S=n[15],E=i[0],C=i[4],T=i[8],R=i[12],P=i[1],I=i[5],D=i[9],N=i[13],O=i[2],U=i[6],V=i[10],K=i[14],Y=i[3],ee=i[7],Q=i[11],ne=i[15];return s[0]=r*E+o*P+a*O+c*Y,s[4]=r*C+o*I+a*U+c*ee,s[8]=r*T+o*D+a*V+c*Q,s[12]=r*R+o*N+a*K+c*ne,s[1]=u*E+h*P+d*O+f*Y,s[5]=u*C+h*I+d*U+f*ee,s[9]=u*T+h*D+d*V+f*Q,s[13]=u*R+h*N+d*K+f*ne,s[2]=p*E+m*P+g*O+b*Y,s[6]=p*C+m*I+g*U+b*ee,s[10]=p*T+m*D+g*V+b*Q,s[14]=p*R+m*N+g*K+b*ne,s[3]=v*E+y*P+_*O+S*Y,s[7]=v*C+y*I+_*U+S*ee,s[11]=v*T+y*D+_*V+S*Q,s[15]=v*R+y*N+_*K+S*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],o=e[5],a=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],p=e[3],m=e[7],g=e[11],b=e[15],v=a*f-c*d,y=o*f-c*h,_=o*d-a*h,S=r*f-c*u,E=r*d-a*u,C=r*h-o*u;return t*(m*v-g*y+b*_)-n*(p*v-g*S+b*E)+i*(p*y-m*S+b*C)-s*(p*_-m*E+g*C)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],o=e[9],a=e[2],c=e[6],u=e[10];return t*(r*u-o*c)-n*(s*u-o*a)+i*(s*c-r*a)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],o=e[5],a=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],p=e[12],m=e[13],g=e[14],b=e[15],v=t*o-n*r,y=t*a-i*r,_=t*c-s*r,S=n*a-i*o,E=n*c-s*o,C=i*c-s*a,T=u*m-h*p,R=u*g-d*p,P=u*b-f*p,I=h*g-d*m,D=h*b-f*m,N=d*b-f*g,O=v*N-y*D+_*I+S*P-E*R+C*T;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/O;return e[0]=(o*N-a*D+c*I)*U,e[1]=(i*D-n*N-s*I)*U,e[2]=(m*C-g*E+b*S)*U,e[3]=(d*E-h*C-f*S)*U,e[4]=(a*P-r*N-c*R)*U,e[5]=(t*N-i*P+s*R)*U,e[6]=(g*_-p*C-b*y)*U,e[7]=(u*C-d*_+f*y)*U,e[8]=(r*D-o*P+c*T)*U,e[9]=(n*P-t*D-s*T)*U,e[10]=(p*E-m*_+b*v)*U,e[11]=(h*_-u*E-f*v)*U,e[12]=(o*R-r*I-a*T)*U,e[13]=(t*I-n*R+i*T)*U,e[14]=(m*y-p*S-g*v)*U,e[15]=(u*S-h*y+d*v)*U,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,r=e.x,o=e.y,a=e.z,c=s*r,u=s*o;return this.set(c*r+n,c*o-i*a,c*a+i*o,0,c*o+i*a,u*o+n,u*a-i*r,0,c*a-i*o,u*a+i*r,s*a*a+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,r=t._y,o=t._z,a=t._w,c=s+s,u=r+r,h=o+o,d=s*c,f=s*u,p=s*h,m=r*u,g=r*h,b=o*h,v=a*c,y=a*u,_=a*h,S=n.x,E=n.y,C=n.z;return i[0]=(1-(m+b))*S,i[1]=(f+_)*S,i[2]=(p-y)*S,i[3]=0,i[4]=(f-_)*E,i[5]=(1-(d+b))*E,i[6]=(g+v)*E,i[7]=0,i[8]=(p+y)*C,i[9]=(g-v)*C,i[10]=(1-(d+m))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=ai.set(i[0],i[1],i[2]).length(),o=ai.set(i[4],i[5],i[6]).length(),a=ai.set(i[8],i[9],i[10]).length();s<0&&(r=-r),ft.copy(this);let c=1/r,u=1/o,h=1/a;return ft.elements[0]*=c,ft.elements[1]*=c,ft.elements[2]*=c,ft.elements[4]*=u,ft.elements[5]*=u,ft.elements[6]*=u,ft.elements[8]*=h,ft.elements[9]*=h,ft.elements[10]*=h,t.setFromRotationMatrix(ft),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,i,s,r,o=zt,a=!1){let c=this.elements,u=2*s/(t-e),h=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),p,m;if(a)p=s/(r-s),m=r*s/(r-s);else if(o===zt)p=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(o===ds)p=-r/(r-s),m=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,r,o=zt,a=!1){let c=this.elements,u=2/(t-e),h=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),p,m;if(a)p=1/(r-s),m=r/(r-s);else if(o===zt)p=-2/(r-s),m=-(r+s)/(r-s);else if(o===ds)p=-1/(r-s),m=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};to.prototype.isMatrix4=!0;var F=to,ai=new M,ft=new F,Cm=new M(0,0,0),Im=new M(1,1,1),nn=new M,sr=new M,tt=new M,Zu=new F,Ku=new Z,At=class l{constructor(e=0,t=0,n=0,i=l.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],o=i[8],a=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-se(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(a,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(se(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(a,s));break;case"ZYX":this._y=Math.asin(-se(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(a,s)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-se(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Zu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ku.setFromEuler(this),this.setFromQuaternion(Ku,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};At.DEFAULT_ORDER="XYZ";var fs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Pm=0,ju=new M,li=new Z,Dt=new F,rr=new M,ji=new M,Lm=new M,Dm=new Z,Ju=new M(1,0,0),$u=new M(0,1,0),Qu=new M(0,0,1),eh={type:"added"},Nm={type:"removed"},ci={type:"childadded",child:null},Ba={type:"childremoved",child:null},Ae=class l extends Wt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pm++}),this.uuid=xt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=l.DEFAULT_UP.clone();let e=new M,t=new At,n=new Z,i=new M(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new F},normalMatrix:{value:new te}}),this.matrix=new F,this.matrixWorld=new F,this.matrixAutoUpdate=l.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=l.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new fs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return li.setFromAxisAngle(e,t),this.quaternion.multiply(li),this}rotateOnWorldAxis(e,t){return li.setFromAxisAngle(e,t),this.quaternion.premultiply(li),this}rotateX(e){return this.rotateOnAxis(Ju,e)}rotateY(e){return this.rotateOnAxis($u,e)}rotateZ(e){return this.rotateOnAxis(Qu,e)}translateOnAxis(e,t){return ju.copy(e).applyQuaternion(this.quaternion),this.position.add(ju.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ju,e)}translateY(e){return this.translateOnAxis($u,e)}translateZ(e){return this.translateOnAxis(Qu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?rr.copy(e):rr.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dt.lookAt(ji,rr,this.up):Dt.lookAt(rr,ji,this.up),this.quaternion.setFromRotationMatrix(Dt),i&&(Dt.extractRotation(i.matrixWorld),li.setFromRotationMatrix(Dt),this.quaternion.premultiply(li.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Se("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(eh),ci.child=e,this.dispatchEvent(ci),ci.child=null):Se("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Nm),Ba.child=e,this.dispatchEvent(Ba),Ba.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(eh),ci.child=e,this.dispatchEvent(ci),ci.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,e,Lm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ji,Dm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,a){return o[a.uuid]===void 0&&(o[a.uuid]=a.toJSON(e)),a.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let a=o.shapes;if(Array.isArray(a))for(let c=0,u=a.length;c<u;c++){let h=a[c];s(e.shapes,h)}else s(e.shapes,a)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let a=0,c=this.material.length;a<c;a++)o.push(s(e.materials,this.material[a]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let a=this.animations[o];i.animations.push(s(e.animations,a))}}if(t){let o=r(e.geometries),a=r(e.materials),c=r(e.textures),u=r(e.images),h=r(e.shapes),d=r(e.skeletons),f=r(e.animations),p=r(e.nodes);o.length>0&&(n.geometries=o),a.length>0&&(n.materials=a),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function r(o){let a=[];for(let c in o){let u=o[c];delete u.metadata,a.push(u)}return a}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ae.DEFAULT_UP=new M(0,1,0);Ae.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var _e=class extends Ae{constructor(){super(),this.isGroup=!0,this.type="Group"}};var $h={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},sn={h:0,s:0,l:0},or={h:0,s:0,l:0};function ka(l,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?l+(e-l)*6*t:t<1/2?e:t<2/3?l+(e-l)*6*(2/3-t):l}var L=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=j){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,We.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=We.workingColorSpace){return this.r=e,this.g=t,this.b=n,We.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=We.workingColorSpace){if(e=ql(e,1),t=se(t,0,1),n=se(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=ka(r,s,e+1/3),this.g=ka(r,s,e),this.b=ka(r,s,e-1/3)}return We.colorSpaceToWorking(this,i),this}setStyle(e,t=j){function n(s){s!==void 0&&parseFloat(s)<1&&be("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],o=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:be("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(s,16),t);be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=j){let n=$h[e.toLowerCase()];return n!==void 0?this.setHex(n,t):be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gt(e.r),this.g=Gt(e.g),this.b=Gt(e.b),this}copyLinearToSRGB(e){return this.r=wi(e.r),this.g=wi(e.g),this.b=wi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=j){return We.workingToColorSpace(He.copy(this),e),Math.round(se(He.r*255,0,255))*65536+Math.round(se(He.g*255,0,255))*256+Math.round(se(He.b*255,0,255))}getHexString(e=j){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=We.workingColorSpace){We.workingToColorSpace(He.copy(this),t);let n=He.r,i=He.g,s=He.b,r=Math.max(n,i,s),o=Math.min(n,i,s),a,c,u=(o+r)/2;if(o===r)a=0,c=0;else{let h=r-o;switch(c=u<=.5?h/(r+o):h/(2-r-o),r){case n:a=(i-s)/h+(i<s?6:0);break;case i:a=(s-n)/h+2;break;case s:a=(n-i)/h+4;break}a/=6}return e.h=a,e.s=c,e.l=u,e}getRGB(e,t=We.workingColorSpace){return We.workingToColorSpace(He.copy(this),t),e.r=He.r,e.g=He.g,e.b=He.b,e}getStyle(e=j){We.workingToColorSpace(He.copy(this),e);let t=He.r,n=He.g,i=He.b;return e!==j?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(sn),this.setHSL(sn.h+e,sn.s+t,sn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(sn),e.getHSL(or);let n=cs(sn.h,or.h,t),i=cs(sn.s,or.s,t),s=cs(sn.l,or.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},He=new L;L.NAMES=$h;var pt=new M,Nt=new M,za=new M,Ot=new M,ui=new M,hi=new M,th=new M,Ga=new M,Ha=new M,Va=new M,Wa=new Ye,Xa=new Ye,qa=new Ye,kt=class l{constructor(e=new M,t=new M,n=new M){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),pt.subVectors(e,t),i.cross(pt);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){pt.subVectors(i,t),Nt.subVectors(n,t),za.subVectors(e,t);let r=pt.dot(pt),o=pt.dot(Nt),a=pt.dot(za),c=Nt.dot(Nt),u=Nt.dot(za),h=r*c-o*o;if(h===0)return s.set(0,0,0),null;let d=1/h,f=(c*a-o*u)*d,p=(r*u-o*a)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Ot)===null?!1:Ot.x>=0&&Ot.y>=0&&Ot.x+Ot.y<=1}static getInterpolation(e,t,n,i,s,r,o,a){return this.getBarycoord(e,t,n,i,Ot)===null?(a.x=0,a.y=0,"z"in a&&(a.z=0),"w"in a&&(a.w=0),null):(a.setScalar(0),a.addScaledVector(s,Ot.x),a.addScaledVector(r,Ot.y),a.addScaledVector(o,Ot.z),a)}static getInterpolatedAttribute(e,t,n,i,s,r){return Wa.setScalar(0),Xa.setScalar(0),qa.setScalar(0),Wa.fromBufferAttribute(e,t),Xa.fromBufferAttribute(e,n),qa.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Wa,s.x),r.addScaledVector(Xa,s.y),r.addScaledVector(qa,s.z),r}static isFrontFacing(e,t,n,i){return pt.subVectors(n,t),Nt.subVectors(e,t),pt.cross(Nt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pt.subVectors(this.c,this.b),Nt.subVectors(this.a,this.b),pt.cross(Nt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return l.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return l.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return l.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return l.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return l.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,o;ui.subVectors(i,n),hi.subVectors(s,n),Ga.subVectors(e,n);let a=ui.dot(Ga),c=hi.dot(Ga);if(a<=0&&c<=0)return t.copy(n);Ha.subVectors(e,i);let u=ui.dot(Ha),h=hi.dot(Ha);if(u>=0&&h<=u)return t.copy(i);let d=a*h-u*c;if(d<=0&&a>=0&&u<=0)return r=a/(a-u),t.copy(n).addScaledVector(ui,r);Va.subVectors(e,s);let f=ui.dot(Va),p=hi.dot(Va);if(p>=0&&f<=p)return t.copy(s);let m=f*c-a*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(hi,o);let g=u*p-f*h;if(g<=0&&h-u>=0&&f-p>=0)return th.subVectors(s,i),o=(h-u)/(h-u+(f-p)),t.copy(i).addScaledVector(th,o);let b=1/(g+m+d);return r=m*b,o=d*b,t.copy(n).addScaledVector(ui,r).addScaledVector(hi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ce=class{constructor(e=new M(1/0,1/0,1/0),t=new M(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(mt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(mt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=mt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=s.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,mt):mt.fromBufferAttribute(s,r),mt.applyMatrix4(e.matrixWorld),this.expandByPoint(mt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ar.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ar.copy(n.boundingBox)),ar.applyMatrix4(e.matrixWorld),this.union(ar)}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mt),mt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ji),lr.subVectors(this.max,Ji),di.subVectors(e.a,Ji),fi.subVectors(e.b,Ji),pi.subVectors(e.c,Ji),rn.subVectors(fi,di),on.subVectors(pi,fi),In.subVectors(di,pi);let t=[0,-rn.z,rn.y,0,-on.z,on.y,0,-In.z,In.y,rn.z,0,-rn.x,on.z,0,-on.x,In.z,0,-In.x,-rn.y,rn.x,0,-on.y,on.x,0,-In.y,In.x,0];return!Ya(t,di,fi,pi,lr)||(t=[1,0,0,0,1,0,0,0,1],!Ya(t,di,fi,pi,lr))?!1:(cr.crossVectors(rn,on),t=[cr.x,cr.y,cr.z],Ya(t,di,fi,pi,lr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ft[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ft[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ft[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ft[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ft[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ft[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ft[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ft[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ft),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ft=[new M,new M,new M,new M,new M,new M,new M,new M],mt=new M,ar=new Ce,di=new M,fi=new M,pi=new M,rn=new M,on=new M,In=new M,Ji=new M,lr=new M,cr=new M,Pn=new M;function Ya(l,e,t,n,i){for(let s=0,r=l.length-3;s<=r;s+=3){Pn.fromArray(l,s);let o=i.x*Math.abs(Pn.x)+i.y*Math.abs(Pn.y)+i.z*Math.abs(Pn.z),a=e.dot(Pn),c=t.dot(Pn),u=n.dot(Pn);if(Math.max(-Math.max(a,c,u),Math.min(a,c,u))>o)return!1}return!0}var De=new M,ur=new B,Om=0,ie=class extends Wt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Om++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Xl,this.updateRanges=[],this.gpuType=Ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ur.fromBufferAttribute(this,t),ur.applyMatrix3(e),this.setXY(t,ur.x,ur.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)De.fromBufferAttribute(this,t),De.applyMatrix3(e),this.setXYZ(t,De.x,De.y,De.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)De.fromBufferAttribute(this,t),De.applyMatrix4(e),this.setXYZ(t,De.x,De.y,De.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)De.fromBufferAttribute(this,t),De.applyNormalMatrix(e),this.setXYZ(t,De.x,De.y,De.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)De.fromBufferAttribute(this,t),De.transformDirection(e),this.setXYZ(t,De.x,De.y,De.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=gt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gt(t,this.array)),t}setX(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gt(t,this.array)),t}setY(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gt(t,this.array)),t}setW(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array),s=xe(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Ri=class extends ie{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Vr=class extends ie{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ue=class extends ie{constructor(e,t,n){super(new Float32Array(e),t,n)}},Fm=new Ce,$i=new M,Za=new M,X=class{constructor(e=new M,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Fm.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$i.subVectors(e,this.center);let t=$i.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector($i,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Za.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($i.copy(e.center).add(Za)),this.expandByPoint($i.copy(e.center).sub(Za))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Um=0,rt=new F,Ka=new Ae,mi=new M,nt=new Ce,Qi=new Ce,Be=new M,re=class l extends Wt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Um++}),this.uuid=xt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(am(e)?Vr:Ri)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new te().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return rt.makeRotationFromQuaternion(e),this.applyMatrix4(rt),this}rotateX(e){return rt.makeRotationX(e),this.applyMatrix4(rt),this}rotateY(e){return rt.makeRotationY(e),this.applyMatrix4(rt),this}rotateZ(e){return rt.makeRotationZ(e),this.applyMatrix4(rt),this}translate(e,t,n){return rt.makeTranslation(e,t,n),this.applyMatrix4(rt),this}scale(e,t,n){return rt.makeScale(e,t,n),this.applyMatrix4(rt),this}lookAt(e){return Ka.lookAt(e),Ka.updateMatrix(),this.applyMatrix4(Ka.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(mi).negate(),this.translate(mi.x,mi.y,mi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ue(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ce);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Se("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];nt.setFromBufferAttribute(s),this.morphTargetsRelative?(Be.addVectors(this.boundingBox.min,nt.min),this.boundingBox.expandByPoint(Be),Be.addVectors(this.boundingBox.max,nt.max),this.boundingBox.expandByPoint(Be)):(this.boundingBox.expandByPoint(nt.min),this.boundingBox.expandByPoint(nt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Se('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new X);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Se("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new M,1/0);return}if(e){let n=this.boundingSphere.center;if(nt.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let o=t[s];Qi.setFromBufferAttribute(o),this.morphTargetsRelative?(Be.addVectors(nt.min,Qi.min),nt.expandByPoint(Be),Be.addVectors(nt.max,Qi.max),nt.expandByPoint(Be)):(nt.expandByPoint(Qi.min),nt.expandByPoint(Qi.max))}nt.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)Be.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Be));if(t)for(let s=0,r=t.length;s<r;s++){let o=t[s],a=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Be.fromBufferAttribute(o,c),a&&(mi.fromBufferAttribute(e,c),Be.add(mi)),i=Math.max(i,n.distanceToSquared(Be))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Se('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Se("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new ie(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let o=[],a=[];for(let T=0;T<n.count;T++)o[T]=new M,a[T]=new M;let c=new M,u=new M,h=new M,d=new B,f=new B,p=new B,m=new M,g=new M;function b(T,R,P){c.fromBufferAttribute(n,T),u.fromBufferAttribute(n,R),h.fromBufferAttribute(n,P),d.fromBufferAttribute(s,T),f.fromBufferAttribute(s,R),p.fromBufferAttribute(s,P),u.sub(c),h.sub(c),f.sub(d),p.sub(d);let I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(m.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(I),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(I),o[T].add(m),o[R].add(m),o[P].add(m),a[T].add(g),a[R].add(g),a[P].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let T=0,R=v.length;T<R;++T){let P=v[T],I=P.start,D=P.count;for(let N=I,O=I+D;N<O;N+=3)b(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let y=new M,_=new M,S=new M,E=new M;function C(T){S.fromBufferAttribute(i,T),E.copy(S);let R=o[T];y.copy(R),y.sub(S.multiplyScalar(S.dot(R))).normalize(),_.crossVectors(E,R);let I=_.dot(a[T])<0?-1:1;r.setXYZW(T,y.x,y.y,y.z,I)}for(let T=0,R=v.length;T<R;++T){let P=v[T],I=P.start,D=P.count;for(let N=I,O=I+D;N<O;N+=3)C(e.getX(N+0)),C(e.getX(N+1)),C(e.getX(N+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ie(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new M,s=new M,r=new M,o=new M,a=new M,c=new M,u=new M,h=new M;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),m=e.getX(d+1),g=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,g),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),o.fromBufferAttribute(n,p),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,g),o.add(u),a.add(u),c.add(u),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Be.fromBufferAttribute(e,t),Be.normalize(),e.setXYZ(t,Be.x,Be.y,Be.z)}toNonIndexed(){function e(o,a){let c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(a.length*u),f=0,p=0;for(let m=0,g=a.length;m<g;m++){o.isInterleavedBufferAttribute?f=a[m]*o.data.stride+o.offset:f=a[m]*u;for(let b=0;b<u;b++)d[p++]=c[f++]}return new ie(d,u,h)}if(this.index===null)return be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new l,n=this.index.array,i=this.attributes;for(let o in i){let a=i[o],c=e(a,n);t.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let a=[],c=s[o];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);a.push(f)}t.morphAttributes[o]=a}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,a=r.length;o<a;o++){let c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let a=this.parameters;for(let c in a)a[c]!==void 0&&(e[c]=a[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let a in n){let c=n[a];e.data.attributes[a]=c.toJSON(e.data)}let i={},s=!1;for(let a in this.morphAttributes){let c=this.morphAttributes[a],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(i[a]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let u=i[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let c=0,u=r.length;c<u;c++){let h=r[c];this.addGroup(h.start,h.count,h.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let a=e.boundingSphere;return a!==null&&(this.boundingSphere=a.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gn=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Xl,this.updateRanges=[],this.version=0,this.uuid=xt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=xt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},qe=new M,cn=class l{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)qe.fromBufferAttribute(this,t),qe.applyMatrix4(e),this.setXYZ(t,qe.x,qe.y,qe.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qe.fromBufferAttribute(this,t),qe.applyNormalMatrix(e),this.setXYZ(t,qe.x,qe.y,qe.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qe.fromBufferAttribute(this,t),qe.transformDirection(e),this.setXYZ(t,qe.x,qe.y,qe.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=gt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xe(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=gt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=gt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=gt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=gt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array),s=xe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){xl("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new ie(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new l(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){xl("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ja=new M,Bm=new M,km=new te,wt=class{constructor(e=new M(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=ja.subVectors(n,t).cross(Bm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(ja),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||km.getNormalMatrix(e),i=this.coplanarPoint(ja).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},zm=0,je=class extends Wt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zm++}),this.uuid=xt(),this.name="",this.type="Material",this.blending=Oh,this.side=Is,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uh,this.blendDst=io,this.blendEquation=Fh,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new L(0,0,0),this.blendAlpha=0,this.depthFunc=kr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ur,this.stencilZFail=Ur,this.stencilZPass=Ur,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){be(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let r=[];for(let o in s){let a=s[o];delete a.metadata,r.push(a)}return r}if(t){let s=i(e.textures),r=i(e.images);s.length>0&&(n.textures=s),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new L().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new wt().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new B().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ci=class extends je{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new L(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},gi,es=new M,xi=new M,bi=new M,vi=new B,ts=new B,Qh=new F,hr=new M,ns=new M,dr=new M,nh=new B,Ja=new B,ih=new B,ps=class extends Ae{constructor(e=new Ci){if(super(),this.isSprite=!0,this.type="Sprite",gi===void 0){gi=new re;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Gn(t,5);gi.setIndex([0,1,2,0,2,3]),gi.setAttribute("position",new cn(n,3,0,!1)),gi.setAttribute("uv",new cn(n,2,3,!1))}this.geometry=gi,this.material=e,this.center=new B(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Se('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),xi.setFromMatrixScale(this.matrixWorld),Qh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),bi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&xi.multiplyScalar(-bi.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let r=this.center;fr(hr.set(-.5,-.5,0),bi,r,xi,i,s),fr(ns.set(.5,-.5,0),bi,r,xi,i,s),fr(dr.set(.5,.5,0),bi,r,xi,i,s),nh.set(0,0),Ja.set(1,0),ih.set(1,1);let o=e.ray.intersectTriangle(hr,ns,dr,!1,es);if(o===null&&(fr(ns.set(-.5,.5,0),bi,r,xi,i,s),Ja.set(0,1),o=e.ray.intersectTriangle(hr,dr,ns,!1,es),o===null))return;let a=e.ray.origin.distanceTo(es);a<e.near||a>e.far||t.push({distance:a,point:es.clone(),uv:kt.getInterpolation(es,hr,ns,dr,nh,Ja,ih,new B),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function fr(l,e,t,n,i,s){vi.subVectors(l,t).addScalar(.5).multiply(n),i!==void 0?(ts.x=s*vi.x-i*vi.y,ts.y=i*vi.x+s*vi.y):ts.copy(vi),l.copy(e),l.x+=ts.x,l.y+=ts.y,l.applyMatrix4(Qh)}var pr=new M,sh=new M,ms=class extends Ae{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let n=0,i=t.length;n<i;n++){let s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);let i=this.levels,s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){let i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){pr.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(pr);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){pr.setFromMatrixPosition(e.matrixWorld),sh.setFromMatrixPosition(this.matrixWorld);let n=pr.distanceTo(sh)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let r=t[i].distance;if(t[i].object.visible&&(r-=r*t[i].hysteresis),n>=r)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let r=n[i];t.object.levels.push({object:r.object.uuid,distance:r.distance,hysteresis:r.hysteresis})}return t}},Ut=new M,$a=new M,mr=new M,gr=new M,un=class{constructor(e=new M,t=new M(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ut)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ut.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ut.copy(this.origin).addScaledVector(this.direction,t),Ut.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){$a.copy(e).add(t).multiplyScalar(.5),mr.copy(t).sub(e).normalize(),gr.copy(this.origin).sub($a);let s=e.distanceTo(t)*.5,r=-this.direction.dot(mr),o=gr.dot(this.direction),a=-gr.dot(mr),c=gr.lengthSq(),u=Math.abs(1-r*r),h,d,f,p;if(u>0)if(h=r*a-o,d=r*o-a,p=s*u,h>=0)if(d>=-p)if(d<=p){let m=1/u;h*=m,d*=m,f=h*(h+r*d+2*o)+d*(r*h+d+2*a)+c}else d=s,h=Math.max(0,-(r*d+o)),f=-h*h+d*(d+2*a)+c;else d=-s,h=Math.max(0,-(r*d+o)),f=-h*h+d*(d+2*a)+c;else d<=-p?(h=Math.max(0,-(-r*s+o)),d=h>0?-s:Math.min(Math.max(-s,-a),s),f=-h*h+d*(d+2*a)+c):d<=p?(h=0,d=Math.min(Math.max(-s,-a),s),f=d*(d+2*a)+c):(h=Math.max(0,-(r*s+o)),d=h>0?s:Math.min(Math.max(-s,-a),s),f=-h*h+d*(d+2*a)+c);else d=r>0?-s:s,h=Math.max(0,-(r*d+o)),f=-h*h+d*(d+2*a)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy($a).addScaledVector(mr,d),f}intersectSphere(e,t){if(e.radius<0)return null;Ut.subVectors(e.center,this.origin);let n=Ut.dot(this.direction),i=Ut.dot(Ut)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),o=n-r,a=n+r;return a<0?null:o<0?this.at(a,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,r,o,a,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,r=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,r=(e.min.y-d.y)*u),n>r||s>i||((s>n||isNaN(n))&&(n=s),(r<i||isNaN(i))&&(i=r),h>=0?(o=(e.min.z-d.z)*h,a=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,a=(e.min.z-d.z)*h),n>a||o>i)||((o>n||n!==n)&&(n=o),(a<i||i!==i)&&(i=a),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Ut)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,o=this.direction,a=o.x,c=o.y,u=o.z,h=e.x-r.x,d=e.y-r.y,f=e.z-r.z,p=t.x-r.x,m=t.y-r.y,g=t.z-r.z,b=n.x-r.x,v=n.y-r.y,y=n.z-r.z,_=Math.abs(a),S=Math.abs(c),E=Math.abs(u),C,T,R,P,I,D,N,O,U,V,K,Y;if(_>=S&&_>=E?(R=a,D=h,U=p,Y=b,a>=0?(C=c,T=u,P=d,I=f,N=m,O=g,V=v,K=y):(C=u,T=c,P=f,I=d,N=g,O=m,V=y,K=v)):S>=E?(R=c,D=d,U=m,Y=v,c>=0?(C=u,T=a,P=f,I=h,N=g,O=p,V=y,K=b):(C=a,T=u,P=h,I=f,N=p,O=g,V=b,K=y)):(R=u,D=f,U=g,Y=y,u>=0?(C=a,T=c,P=h,I=d,N=p,O=m,V=b,K=v):(C=c,T=a,P=d,I=h,N=m,O=p,V=v,K=b)),R===0)return null;let ee=C/R,Q=T/R,ne=1/R,fe=P-ee*D,ye=I-Q*D,de=N-ee*U,Ue=O-Q*U,he=V-ee*Y,Le=K-Q*Y,ge=he*Ue-Le*de,J=fe*Le-ye*he,Me=de*ye-Ue*fe;if(i){if(ge<0||J<0||Me<0)return null}else if((ge<0||J<0||Me<0)&&(ge>0||J>0||Me>0))return null;let et=ge+J+Me;if(et===0)return null;let yt=ne*(ge*D+J*U+Me*Y);return(et>0?yt<0:yt>0)?null:this.at(yt/et,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},z=class extends je{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new L(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new At,this.combine=so,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},rh=new F,Ln=new un,xr=new X,oh=new M,br=new M,vr=new M,_r=new M,Qa=new M,yr=new M,ah=new M,Mr=new M,k=class extends Ae{constructor(e=new re,t=new z){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let o=this.morphTargetInfluences;if(s&&o){yr.set(0,0,0);for(let a=0,c=s.length;a<c;a++){let u=o[a],h=s[a];u!==0&&(Qa.fromBufferAttribute(h,e),r?yr.addScaledVector(Qa,u):yr.addScaledVector(Qa.sub(t),u))}t.add(yr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xr.copy(n.boundingSphere),xr.applyMatrix4(s),Ln.copy(e.ray).recast(e.near),!(xr.containsPoint(Ln.origin)===!1&&(Ln.intersectSphere(xr,oh)===null||Ln.origin.distanceToSquared(oh)>(e.far-e.near)**2))&&(rh.copy(s).invert(),Ln.copy(e.ray).applyMatrix4(rh),!(n.boundingBox!==null&&Ln.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ln)))}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,o=s.index,a=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],v=Math.max(g.start,f.start),y=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,S=y;_<S;_+=3){let E=o.getX(_),C=o.getX(_+1),T=o.getX(_+2);i=wr(this,b,e,n,c,u,h,E,C,T),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(o.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let v=o.getX(g),y=o.getX(g+1),_=o.getX(g+2);i=wr(this,r,e,n,c,u,h,v,y,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(a!==void 0)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],v=Math.max(g.start,f.start),y=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,S=y;_<S;_+=3){let E=_,C=_+1,T=_+2;i=wr(this,b,e,n,c,u,h,E,C,T),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(a.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let v=g,y=g+1,_=g+2;i=wr(this,r,e,n,c,u,h,v,y,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function Gm(l,e,t,n,i,s,r,o){let a;if(e.side===no?a=n.intersectTriangle(r,s,i,!0,o):a=n.intersectTriangle(i,s,r,e.side===Is,o),a===null)return null;Mr.copy(o),Mr.applyMatrix4(l.matrixWorld);let c=t.ray.origin.distanceTo(Mr);return c<t.near||c>t.far?null:{distance:c,point:Mr.clone(),object:l}}function wr(l,e,t,n,i,s,r,o,a,c){l.getVertexPosition(o,br),l.getVertexPosition(a,vr),l.getVertexPosition(c,_r);let u=Gm(l,e,t,n,br,vr,_r,ah);if(u){let h=new M;kt.getBarycoord(ah,br,vr,_r,h),i&&(u.uv=kt.getInterpolatedAttribute(i,o,a,c,h,new B)),s&&(u.uv1=kt.getInterpolatedAttribute(s,o,a,c,h,new B)),r&&(u.normal=kt.getInterpolatedAttribute(r,o,a,c,h,new M),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a:o,b:a,c,normal:new M,materialIndex:0};kt.getNormal(br,vr,_r,d.normal),u.face=d,u.barycoord=h}return u}var is=new Ye,lh=new Ye,ch=new Ye,Hm=new Ye,uh=new F,Sr=new M,el=new X,hh=new F,tl=new un,gs=class extends k{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=pl,this.bindMatrix=new F,this.bindMatrixInverse=new F,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ce),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Sr),this.boundingBox.expandByPoint(Sr)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new X),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Sr),this.boundingSphere.expandByPoint(Sr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),el.copy(this.boundingSphere),el.applyMatrix4(i),e.ray.intersectsSphere(el)!==!1&&(hh.copy(i).invert(),tl.copy(e.ray).applyMatrix4(hh),!(this.boundingBox!==null&&tl.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,tl)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Ye,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===pl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===zh?this.bindMatrixInverse.copy(this.bindMatrix).invert():be("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;lh.fromBufferAttribute(i.attributes.skinIndex,e),ch.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(is.copy(t),t.set(0,0,0,0)):(is.set(...t,1),t.set(0,0,0)),is.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=ch.getComponent(s);if(r!==0){let o=lh.getComponent(s);uh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Hm.copy(is).applyMatrix4(uh),r)}}return t.isVector4&&(t.w=is.w),t.applyMatrix4(this.bindMatrixInverse)}},Ii=class extends Ae{constructor(){super(),this.isBone=!0,this.type="Bone"}},ot=class extends at{constructor(e=null,t=1,n=1,i,s,r,o,a,c=Si,u=Si,h,d){super(null,r,o,a,c,u,i,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},dh=new F,Vm=new F,xs=class l{constructor(e=[],t=[]){this.uuid=xt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){be("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new F)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new F;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let o=e[s]?e[s].matrixWorld:Vm;dh.multiplyMatrices(o,t[s]),dh.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new l(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ot(t,e,e,Vt,Ai);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=t[s];r===void 0&&(be("Skeleton: No bone found with UUID:",s),r=new Ii),this.bones.push(r),this.boneInverses.push(new F().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let r=t[i];e.bones.push(r.uuid);let o=n[i];e.boneInverses.push(o.toArray())}return e}},Xe=class extends ie{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},_i=new F,fh=new F,Ar=[],ph=new Ce,Wm=new F,ss=new k,rs=new X,q=class extends k{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Xe(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Wm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ce),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,_i),ph.copy(e.boundingBox).applyMatrix4(_i),this.boundingBox.union(ph)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new X),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,_i),rs.copy(e.boundingSphere).applyMatrix4(_i),this.boundingSphere.union(rs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[r+o]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(ss.geometry=this.geometry,ss.material=this.material,ss.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rs.copy(this.boundingSphere),rs.applyMatrix4(n),e.ray.intersectsSphere(rs)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,_i),fh.multiplyMatrices(n,_i),ss.matrixWorld=fh,ss.raycast(e,Ar);for(let r=0,o=Ar.length;r<o;r++){let a=Ar[r];a.instanceId=s,a.object=this,t.push(a)}Ar.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Xe(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ot(new Float32Array(i*this.count),i,this.count,Wh,Ai));let s=this.morphTexture.source.data.data,r=0;for(let c=0;c<n.length;c++)r+=n[c];let o=this.geometry.morphTargetsRelative?1:1-r,a=i*e;return s[a]=o,s.set(n,a+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Dn=new X,Xm=new B(.5,.5),Tr=new M,Xt=class{constructor(e=new wt,t=new wt,n=new wt,i=new wt,s=new wt,r=new wt){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zt,n=!1){let i=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],p=s[8],m=s[9],g=s[10],b=s[11],v=s[12],y=s[13],_=s[14],S=s[15];if(i[0].setComponents(c-r,f-u,b-p,S-v).normalize(),i[1].setComponents(c+r,f+u,b+p,S+v).normalize(),i[2].setComponents(c+o,f+h,b+m,S+y).normalize(),i[3].setComponents(c-o,f-h,b-m,S-y).normalize(),n)i[4].setComponents(a,d,g,_).normalize(),i[5].setComponents(c-a,f-d,b-g,S-_).normalize();else if(i[4].setComponents(c-a,f-d,b-g,S-_).normalize(),t===zt)i[5].setComponents(c+a,f+d,b+g,S+_).normalize();else if(t===ds)i[5].setComponents(a,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Dn)}intersectsSprite(e){Dn.center.set(0,0,0);let t=Xm.distanceTo(e.center);return Dn.radius=.7071067811865476+t,Dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Dn)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Tr.x=i.normal.x>0?e.max.x:e.min.x,Tr.y=i.normal.y>0?e.max.y:e.min.y,Tr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Tr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},mh=new F,Wr=class l{constructor(){this.coordinateSystem=zt,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){let s=t[i];mh.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),n[i]===void 0&&(n[i]=new Xt),n[i].setFromProjectionMatrix(mh,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new Xt),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new l().copy(this)}};function nl(l,e){return l-e}function qm(l,e){return l.z-e.z}function Ym(l,e){return e.z-l.z}var bl=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,r=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];r.push(o),this.index++,o.start=e,o.count=t,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}},Ke=new F,Zm=new L(1,1,1),Km=new Xt,jm=new Wr,Er=new Ce,Nn=new X,os=new M,gh=new M,Jm=new M,il=new bl,Ve=new k,Rr=[];function $m(l,e,t=0){let n=e.itemSize;if(l.isInterleavedBufferAttribute||l.array.constructor!==e.array.constructor){let i=l.count;for(let s=0;s<i;s++)for(let r=0;r<n;r++)e.setComponent(s+t,r,l.getComponent(s,r))}else e.array.set(l.array,t*n);e.needsUpdate=!0}function On(l,e){if(l.constructor!==e.constructor){let t=Math.min(l.length,e.length);for(let n=0;n<t;n++)e[n]=l[n]}else{let t=Math.min(l.length,e.length);e.set(new l.constructor(l.buffer,0,t))}}var Hn=class extends k{constructor(e,t,n=t*2,i){super(new re,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),n=new ot(t,e,e,Vt,Ai);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),n=new ot(t,e,e,Xh,Vh);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),n=new ot(t,e,e,Vt,Ai);n.colorSpace=We.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in e.attributes){let r=e.getAttribute(s),{array:o,itemSize:a,normalized:c}=r,u=new o.constructor(n*a),h=new ie(u,a,c);t.setAttribute(s,h)}if(e.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new ie(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ce);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,Ke),this.getBoundingBoxAt(s,Er).applyMatrix4(Ke),e.union(Er)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new X);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,Ke),this.getBoundingSphereAt(s,Nn).applyMatrix4(Ke),e.union(Nn)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(nl),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let s=this._matricesTexture;Ke.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;let r=this._colorsTexture;return r&&(Zm.toArray(r.image.data,i*4),r.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let r=e.getIndex();if(r!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?r.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let a;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(nl),a=this._availableGeometryIds.shift(),s[a]=i):(a=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(a,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,a}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),r=t.getIndex(),o=this._geometryInfo[e];if(i&&r.count>o.reservedIndexCount||t.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let a=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=t.getAttribute("position").count;for(let u in n.attributes){let h=t.getAttribute(u),d=n.getAttribute(u);$m(h,d,a);let f=h.itemSize;for(let p=h.count,m=c;p<m;p++){let g=a+p;for(let b=0;b<f;b++)d.setComponent(g,b,0)}d.needsUpdate=!0,d.addUpdateRange(a*f,c*f)}if(i){let u=o.indexStart,h=o.reservedIndexCount;o.indexCount=t.getIndex().count;for(let d=0;d<r.count;d++)s.setX(u+d,a+r.getX(d));for(let d=r.count,f=h;d<f;d++)s.setX(u+d,a);s.needsUpdate=!0,s.addUpdateRange(u,o.reservedIndexCount)}return o.start=i?o.indexStart:o.vertexStart,o.count=i?o.indexCount:o.vertexCount,o.boundingBox=null,t.boundingBox!==null&&(o.boundingBox=t.boundingBox.clone()),o.boundingSphere=null,t.boundingSphere!==null&&(o.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,i=n.map((r,o)=>o).sort((r,o)=>n[r].vertexStart-n[o].vertexStart),s=this.geometry;for(let r=0,o=n.length;r<o;r++){let a=i[r],c=n[a];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==t){let{indexStart:u,vertexStart:h,reservedIndexCount:d}=c,f=s.index,p=f.array,m=e-h;for(let g=u;g<u+d;g++)p[g]=p[g]+m;f.array.copyWithin(t,u,u+d),f.addUpdateRange(t,d),f.needsUpdate=!0,c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){let{vertexStart:u,reservedVertexCount:h}=c,d=s.attributes;for(let f in d){let p=d[f],{array:m,itemSize:g}=p;m.copyWithin(e*g,u*g,(u+h)*g),p.addUpdateRange(e*g,h*g),p.needsUpdate=!0}c.vertexStart=e}e+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){let s=new Ce,r=n.index,o=n.attributes.position;for(let a=i.start,c=i.start+i.count;a<c;a++){let u=a;r&&(u=r.getX(u)),s.expandByPoint(os.fromBufferAttribute(o,u))}i.boundingBox=s}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){let s=new X;this.getBoundingBoxAt(e,Er),Er.getCenter(s.center);let r=n.index,o=n.attributes.position,a=0;for(let c=i.start,u=i.start+i.count;c<u;c++){let h=c;r&&(h=r.getX(h)),os.fromBufferAttribute(o,h),a=Math.max(a,s.center.distanceToSquared(os))}s.radius=Math.sqrt(a),i.boundingSphere=s}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this._visibilityChanged=!0,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(nl);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let i=new Int32Array(e),s=new Int32Array(e);On(this._multiDrawCounts,i),On(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=e;let r=this._indirectTexture,o=this._matricesTexture,a=this._colorsTexture;r.dispose(),this._initIndirectTexture(),On(r.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),On(o.image.data,this._matricesTexture.image.data),a&&(a.dispose(),this._initColorsTexture(),On(a.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...n.map(o=>o.vertexStart+o.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(a=>a.indexStart+a.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let s=this.geometry;s.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new re,this._initializeGeometry(s));let r=this.geometry;s.index&&On(s.index.array,r.index.array);for(let o in s.attributes)On(s.attributes[o].array,r.attributes[o].array)}raycast(e,t){let n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,r=this.geometry;Ve.material=this.material,Ve.geometry.index=r.index,Ve.geometry.attributes=r.attributes,Ve.geometry.boundingBox===null&&(Ve.geometry.boundingBox=new Ce),Ve.geometry.boundingSphere===null&&(Ve.geometry.boundingSphere=new X);for(let o=0,a=n.length;o<a;o++){if(!n[o].visible||!n[o].active)continue;let c=n[o].geometryIndex,u=i[c];Ve.geometry.setDrawRange(u.start,u.count),this.getMatrixAt(o,Ve.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,Ve.geometry.boundingBox),this.getBoundingSphereAt(c,Ve.geometry.boundingSphere),Ve.raycast(e,Rr);for(let h=0,d=Rr.length;h<d;h++){let f=Rr[h];f.object=this,f.batchId=o,t.push(f)}Rr.length=0}Ve.material=null,Ve.geometry.index=null,Ve.geometry.attributes={},Ve.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._multiDrawBytesPerElement=e._multiDrawBytesPerElement,this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let r=i.getIndex(),o=r===null?1:r.array.BYTES_PER_ELEMENT,a=1;s.wireframe&&(a=2,o=i.attributes.position.count>65535?4:2);let c=this._instanceInfo,u=this._multiDrawStarts,h=this._multiDrawCounts,d=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,m=p.image.data,g=n.isArrayCamera?jm:Km;f&&(n.isArrayCamera?g.setFromArrayCamera(n):(Ke.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),g.setFromProjectionMatrix(Ke,n.coordinateSystem,n.reversedDepth)));let b=0;if(this.sortObjects){Ke.copy(this.matrixWorld).invert(),os.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Ke),gh.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Ke);for(let _=0,S=c.length;_<S;_++)if(c[_].visible&&c[_].active){let E=c[_].geometryIndex;this.getMatrixAt(_,Ke),this.getBoundingSphereAt(E,Nn).applyMatrix4(Ke);let C=!1;if(f&&(C=!g.intersectsSphere(Nn)),!C){let T=d[E],R=Jm.subVectors(Nn.center,os).dot(gh);il.push(T.start,T.count,R,_)}}let v=il.list,y=this.customSort;y===null?v.sort(s.transparent?Ym:qm):y.call(this,v,n);for(let _=0,S=v.length;_<S;_++){let E=v[_];u[b]=E.start*o*a,h[b]=E.count*a,m[b]=E.index,b++}il.reset()}else for(let v=0,y=c.length;v<y;v++)if(c[v].visible&&c[v].active){let _=c[v].geometryIndex,S=!1;if(f&&(this.getMatrixAt(v,Ke),this.getBoundingSphereAt(_,Nn).applyMatrix4(Ke),S=!g.intersectsSphere(Nn)),!S){let E=d[_];u[b]=E.start*o*a,h[b]=E.count*a,m[b]=v,b++}}p.needsUpdate=!0,this._multiDrawCount=b,this._multiDrawBytesPerElement=o,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,r){this.onBeforeRender(e,null,i,s,r)}},Pi=class extends je{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new L(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Xr=new M,qr=new M,xh=new F,as=new un,Cr=new X,sl=new M,bh=new M,Vn=class extends Ae{constructor(e=new re,t=new Pi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Xr.fromBufferAttribute(t,i-1),qr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Xr.distanceTo(qr);e.setAttribute("lineDistance",new ue(n,1))}else be("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere),Cr.applyMatrix4(i),Cr.radius+=s,e.ray.intersectsSphere(Cr)===!1)return;xh.copy(i).invert(),as.copy(e.ray).applyMatrix4(xh);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),a=o*o,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let f=Math.max(0,r.start),p=Math.min(u.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=u.getX(m),v=u.getX(m+1),y=Ir(this,e,as,a,b,v,m);y&&t.push(y)}if(this.isLineLoop){let m=u.getX(p-1),g=u.getX(f),b=Ir(this,e,as,a,m,g,p-1);b&&t.push(b)}}else{let f=Math.max(0,r.start),p=Math.min(d.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=Ir(this,e,as,a,m,m+1,m);b&&t.push(b)}if(this.isLineLoop){let m=Ir(this,e,as,a,p-1,f,p-1);m&&t.push(m)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Ir(l,e,t,n,i,s,r){let o=l.geometry.attributes.position;if(Xr.fromBufferAttribute(o,i),qr.fromBufferAttribute(o,s),t.distanceSqToSegment(Xr,qr,sl,bh)>n)return;sl.applyMatrix4(l.matrixWorld);let c=e.ray.origin.distanceTo(sl);if(!(c<e.near||c>e.far))return{distance:c,point:bh.clone().applyMatrix4(l.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:l}}var vh=new M,_h=new M,bs=class extends Vn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)vh.fromBufferAttribute(t,i),_h.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+vh.distanceTo(_h);e.setAttribute("lineDistance",new ue(n,1))}else be("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},vs=class extends Vn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},hn=class extends je{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new L(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},yh=new F,vl=new un,Pr=new X,Lr=new M,bt=class extends Ae{constructor(e=new re,t=new hn){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pr.copy(n.boundingSphere),Pr.applyMatrix4(i),Pr.radius+=s,e.ray.intersectsSphere(Pr)===!1)return;yh.copy(i).invert(),vl.copy(e.ray).applyMatrix4(yh);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),a=o*o,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,r.start),f=Math.min(c.count,r.start+r.count);for(let p=d,m=f;p<m;p++){let g=c.getX(p);Lr.fromBufferAttribute(h,g),Mh(Lr,g,a,i,e,t,this)}}else{let d=Math.max(0,r.start),f=Math.min(h.count,r.start+r.count);for(let p=d,m=f;p<m;p++)Lr.fromBufferAttribute(h,p),Mh(Lr,p,a,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Mh(l,e,t,n,i,s,r){let o=vl.distanceSqToPoint(l);if(o<t){let a=new M;vl.closestPointToPoint(l,a),a.applyMatrix4(n);let c=i.ray.origin.distanceTo(a);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:a,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}var le=class extends at{constructor(e,t,n,i,s,r,o,a,c){super(e,t,n,i,s,r,o,a,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ze=class l extends re{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let o=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let a=[],c=[],u=[],h=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,r,s,0),p("z","y","x",1,-1,n,t,-e,r,s,1),p("x","z","y",1,1,e,n,t,i,r,2),p("x","z","y",1,-1,e,n,-t,i,r,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(a),this.setAttribute("position",new ue(c,3)),this.setAttribute("normal",new ue(u,3)),this.setAttribute("uv",new ue(h,2));function p(m,g,b,v,y,_,S,E,C,T,R){let P=_/C,I=S/T,D=_/2,N=S/2,O=E/2,U=C+1,V=T+1,K=0,Y=0,ee=new M;for(let Q=0;Q<V;Q++){let ne=Q*I-N;for(let fe=0;fe<U;fe++){let ye=fe*P-D;ee[m]=ye*v,ee[g]=ne*y,ee[b]=O,c.push(ee.x,ee.y,ee.z),ee[m]=0,ee[g]=0,ee[b]=E>0?1:-1,u.push(ee.x,ee.y,ee.z),h.push(fe/C),h.push(1-Q/T),K+=1}}for(let Q=0;Q<T;Q++)for(let ne=0;ne<C;ne++){let fe=d+ne+U*Q,ye=d+ne+U*(Q+1),de=d+(ne+1)+U*(Q+1),Ue=d+(ne+1)+U*Q;a.push(fe,ye,Ue),a.push(ye,de,Ue),Y+=6}o.addGroup(f,Y,R),f+=Y,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Tt=class l extends re{constructor(e=1,t=1,n=1,i=32,s=1,r=!1,o=0,a=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a};let c=this;i=Math.floor(i),s=Math.floor(s);let u=[],h=[],d=[],f=[],p=0,m=[],g=n/2,b=0;v(),r===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(u),this.setAttribute("position",new ue(h,3)),this.setAttribute("normal",new ue(d,3)),this.setAttribute("uv",new ue(f,2));function v(){let _=new M,S=new M,E=0,C=(t-e)/n;for(let T=0;T<=s;T++){let R=[],P=T/s,I=P*(t-e)+e;for(let D=0;D<=i;D++){let N=D/i,O=N*a+o,U=Math.sin(O),V=Math.cos(O);S.x=I*U,S.y=-P*n+g,S.z=I*V,h.push(S.x,S.y,S.z),_.set(U,C,V).normalize(),d.push(_.x,_.y,_.z),f.push(N,1-P),R.push(p++)}m.push(R)}for(let T=0;T<i;T++)for(let R=0;R<s;R++){let P=m[R][T],I=m[R+1][T],D=m[R+1][T+1],N=m[R][T+1];(e>0||R!==0)&&(u.push(P,I,N),E+=3),(t>0||R!==s-1)&&(u.push(I,D,N),E+=3)}c.addGroup(b,E,0),b+=E}function y(_){let S=p,E=new B,C=new M,T=0,R=_===!0?e:t,P=_===!0?1:-1;for(let D=1;D<=i;D++)h.push(0,g*P,0),d.push(0,P,0),f.push(.5,.5),p++;let I=p;for(let D=0;D<=i;D++){let O=D/i*a+o,U=Math.cos(O),V=Math.sin(O);C.x=R*V,C.y=g*P,C.z=R*U,h.push(C.x,C.y,C.z),d.push(0,P,0),E.x=U*.5+.5,E.y=V*.5*P+.5,f.push(E.x,E.y),p++}for(let D=0;D<i;D++){let N=S+D,O=I+D;_===!0?u.push(O,O+1,N):u.push(O+1,O,N),T+=3}c.addGroup(b,T,_===!0?1:2),b+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var _s=class l extends re{constructor(e=[new B(0,-.5),new B(.5,0),new B(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=se(i,0,Math.PI*2);let s=[],r=[],o=[],a=[],c=[],u=1/t,h=new M,d=new B,f=new M,p=new M,m=new M,g=0,b=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,b=e[v+1].y-e[v].y,f.x=b*1,f.y=-g,f.z=b*0,m.copy(f),f.normalize(),a.push(f.x,f.y,f.z);break;case e.length-1:a.push(m.x,m.y,m.z);break;default:g=e[v+1].x-e[v].x,b=e[v+1].y-e[v].y,f.x=b*1,f.y=-g,f.z=b*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),a.push(f.x,f.y,f.z),m.copy(p)}for(let v=0;v<=t;v++){let y=n+v*u*i,_=Math.sin(y),S=Math.cos(y);for(let E=0;E<=e.length-1;E++){h.x=e[E].x*_,h.y=e[E].y,h.z=e[E].x*S,r.push(h.x,h.y,h.z),d.x=v/t,d.y=E/(e.length-1),o.push(d.x,d.y);let C=a[3*E+0]*_,T=a[3*E+1],R=a[3*E+0]*S;c.push(C,T,R)}}for(let v=0;v<t;v++)for(let y=0;y<e.length-1;y++){let _=y+v*e.length,S=_,E=_+e.length,C=_+e.length+1,T=_+1;s.push(S,E,T),s.push(C,T,E)}this.setIndex(s),this.setAttribute("position",new ue(r,3)),this.setAttribute("uv",new ue(o,2)),this.setAttribute("normal",new ue(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.points,e.segments,e.phiStart,e.phiLength)}};var qt=class l extends re{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,o=Math.floor(n),a=Math.floor(i),c=o+1,u=a+1,h=e/o,d=t/a,f=[],p=[],m=[],g=[];for(let b=0;b<u;b++){let v=b*d-r;for(let y=0;y<c;y++){let _=y*h-s;p.push(_,-v,0),m.push(0,0,1),g.push(y/o),g.push(1-b/a)}}for(let b=0;b<a;b++)for(let v=0;v<o;v++){let y=v+c*b,_=v+c*(b+1),S=v+1+c*(b+1),E=v+1+c*b;f.push(y,_,E),f.push(_,S,E)}this.setIndex(f),this.setAttribute("position",new ue(p,3)),this.setAttribute("normal",new ue(m,3)),this.setAttribute("uv",new ue(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.width,e.height,e.widthSegments,e.heightSegments)}};var ke=class l extends re{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let a=Math.min(r+o,Math.PI),c=0,u=[],h=new M,d=new M,f=[],p=[],m=[],g=[];for(let b=0;b<=n;b++){let v=[],y=b/n,_=r+y*o,S=e*Math.cos(_),E=Math.sqrt(e*e-S*S),C=0;b===0&&r===0?C=.5/t:b===n&&a===Math.PI&&(C=-.5/t);for(let T=0;T<=t;T++){let R=T/t,P=i+R*s;h.x=-E*Math.cos(P),h.y=S,h.z=E*Math.sin(P),p.push(h.x,h.y,h.z),d.copy(h).normalize(),m.push(d.x,d.y,d.z),g.push(R+C,1-y),v.push(c++)}u.push(v)}for(let b=0;b<n;b++)for(let v=0;v<t;v++){let y=u[b][v+1],_=u[b][v],S=u[b+1][v],E=u[b+1][v+1];(b!==0||r>0)&&f.push(y,_,E),(b!==n-1||a<Math.PI)&&f.push(_,S,E)}this.setIndex(f),this.setAttribute("position",new ue(p,3)),this.setAttribute("normal",new ue(m,3)),this.setAttribute("uv",new ue(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function Zl(l){let e={};for(let t in l){e[t]={};for(let n in l[t]){let i=l[t][n];if(wh(i))i.isRenderTargetTexture?(be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(wh(i[0])){let s=[];for(let r=0,o=i.length;r<o;r++)s[r]=i[r].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Ze(l){let e={};for(let t=0;t<l.length;t++){let n=Zl(l[t]);for(let i in n)e[i]=n[i]}return e}function wh(l){return l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)}function Qm(l){let e=[];for(let t=0;t<l.length;t++)e.push(l[t].clone());return e}var e0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,t0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,vt=class extends je{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=e0,this.fragmentShader=t0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zl(e.uniforms),this.uniformsGroups=Qm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;r&&r.isTexture?t.uniforms[i]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[i]={type:"m4",value:r.toArray()}:t.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new L().setHex(i.value);break;case"v2":this.uniforms[n].value=new B().fromArray(i.value);break;case"v3":this.uniforms[n].value=new M().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ye().fromArray(i.value);break;case"m3":this.uniforms[n].value=new te().fromArray(i.value);break;case"m4":this.uniforms[n].value=new F().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}};var Ne=class extends je{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new L(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new L(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vl,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new At,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Je=class extends Ne{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new B(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return se(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new L(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new L(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new L(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var lt=class extends je{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new L(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new L(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vl,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new At,this.combine=so,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function ln(l,e){return!l||l.constructor===e?l:typeof e.BYTES_PER_ELEMENT=="number"?new e(l):Array.prototype.slice.call(l)}function Br(l){return l!==void 0&&l.inTangents!==void 0&&l.outTangents!==void 0}function n0(l){function e(i,s){return l[i]-l[s]}let t=l.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Sh(l,e,t){let n=l.length,i=new l.constructor(n);for(let s=0,r=0;r!==n;++s){let o=t[s]*e;for(let a=0;a!==e;++a)i[r++]=l[o+a]}return i}function i0(l,e,t,n){let i=1,s=l[0];for(;s!==void 0&&s[n]===void 0;)s=l[i++];if(s===void 0)return;let r=s[n];if(r!==void 0)if(Array.isArray(r))do r=s[n],r!==void 0&&(e.push(s.time),t.push(...r)),s=l[i++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[n],r!==void 0&&(e.push(s.time),r.toArray(t,t.length)),s=l[i++];while(s!==void 0);else do r=s[n],r!==void 0&&(e.push(s.time),t.push(r)),s=l[i++];while(s!==void 0)}var Et=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let r;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break t}r=t.length;break n}if(!(e>=s)){let o=t[1];e<o&&(n=2,s=o);for(let a=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(i=s,s=t[--n-1],e>=s)break t}r=n,n=0;break n}break e}for(;n<r;){let o=n+r>>>1;e<t[o]?r=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Yr=class extends Et{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Un,endingEnd:Un}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,o=i[s],a=i[r];if(o===void 0)switch(this.getSettings_().endingStart){case Bn:s=e,o=2*t-n;break;case hs:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(a===void 0)switch(this.getSettings_().endingEnd){case Bn:r=e,a=2*n-t;break;case hs:r=1,a=n+i[1]-i[0];break;default:r=e-1,a=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(a-n),this._offsetPrev=s*u,this._offsetNext=r*u}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=e*o,c=a-o,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),m=p*p,g=m*p,b=-d*g+2*d*m-d*p,v=(1+d)*g+(-1.5-2*d)*m+(-.5+d)*p+1,y=(-1-f)*g+(1.5+f)*m+.5*p,_=f*g-f*m;for(let S=0;S!==o;++S)s[S]=b*r[u+S]+v*r[c+S]+y*r[a+S]+_*r[h+S];return s}},ys=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=e*o,c=a-o,u=(n-t)/(i-t),h=1-u;for(let d=0;d!==o;++d)s[d]=r[c+d]*h+r[a+d]*u;return s}},Zr=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Kr=class extends Et{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=e*o,c=a-o,u=this.inTangents,h=this.outTangents;if(!u||!h){let p=(n-t)/(i-t),m=1-p;for(let g=0;g!==o;++g)s[g]=r[c+g]*m+r[a+g]*p;return s}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let m=r[c+p],g=r[a+p],b=f*d+p*2,v=h[b],y=h[b+1],_=e*d+p*2,S=u[_],E=u[_+1],C=r0(n,t,v,S,i);s[p]=ed(C,m,y,E,g)}return s}};function ed(l,e,t,n,i){let s=1-l;return s*s*s*e+3*s*s*l*t+3*s*l*l*n+l*l*l*i}function s0(l,e,t,n,i){let s=1-l;return 3*s*s*(t-e)+6*s*l*(n-t)+3*l*l*(i-n)}function r0(l,e,t,n,i){let s=(l-e)/(i-e);for(let r=0;r<8;r++){let o=ed(s,e,t,n,i)-l;if(Math.abs(o)<1e-10)break;let a=s0(s,e,t,n,i);if(Math.abs(a)<1e-10)break;s=Math.max(0,Math.min(1,s-o/a))}return s}var $e=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ln(t,this.TimeBufferType),this.values=ln(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ln(e.times,Array),values:ln(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Br(e.settings)&&(n.settings={inTangents:ln(e.settings.inTangents,Array),outTangents:ln(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Zr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ys(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Yr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Kr(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case kn:t=this.InterpolantFactoryMethodDiscrete;break;case zn:t=this.InterpolantFactoryMethodLinear;break;case Or:t=this.InterpolantFactoryMethodSmooth;break;case ml:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return be("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return kn;case this.InterpolantFactoryMethodLinear:return zn;case this.InterpolantFactoryMethodSmooth:return Or;case this.InterpolantFactoryMethodBezier:return ml}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Br(this.settings)&&(Ah(this.settings.inTangents,e),Ah(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;for(;s!==i&&n[s]<e;)++s;for(;r!==-1&&n[r]>t;)--r;if(++r,s!==0||r!==i){s>=r&&(r=Math.max(r,1),s=r-1);let o=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*o,r*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Se("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(Se("KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let o=0;o!==s;o++){let a=n[o];if(typeof a=="number"&&isNaN(a)){Se("KeyframeTrack: Time is not a valid number.",this,o,a),e=!1;break}if(r!==null&&r>a){Se("KeyframeTrack: Out of order keys.",this,o,a,r),e=!1;break}r=a}if(i!==void 0&&lm(i))for(let o=0,a=i.length;o!==a;++o){let c=i[o];if(isNaN(c)){Se("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Or,s=e.length-1,r=1;for(let o=1;o<s;++o){let a=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(i)a=!0;else{let h=o*n,d=h-n,f=h+n;for(let p=0;p!==n;++p){let m=t[h+p];if(m!==t[d+p]||m!==t[f+p]){a=!0;break}}}if(a){if(o!==r){e[r]=e[o];let h=o*n,d=r*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++r}}if(s>0){e[r]=e[s];for(let o=s*n,a=r*n,c=0;c!==n;++c)t[a+c]=t[o+c];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Br(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Ah(l,e){for(let t=0,n=l.length;t!==n;t+=2)l[t]*=e}$e.prototype.ValueTypeName="";$e.prototype.TimeBufferType=Float32Array;$e.prototype.ValueBufferType=Float32Array;$e.prototype.DefaultInterpolation=zn;var Yt=class extends $e{constructor(e,t,n){super(e,t,n)}};Yt.prototype.ValueTypeName="bool";Yt.prototype.ValueBufferType=Array;Yt.prototype.DefaultInterpolation=kn;Yt.prototype.InterpolantFactoryMethodLinear=void 0;Yt.prototype.InterpolantFactoryMethodSmooth=void 0;var Ms=class extends $e{constructor(e,t,n,i){super(e,t,n,i)}};Ms.prototype.ValueTypeName="color";var Zt=class extends $e{constructor(e,t,n,i){super(e,t,n,i)}};Zt.prototype.ValueTypeName="number";var jr=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=(n-t)/(i-t),c=e*o;for(let u=c+o;c!==u;c+=4)Z.slerpFlat(s,0,r,c-o,r,c,a);return s}},Kt=class extends $e{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new jr(this.times,this.values,this.getValueSize(),e)}};Kt.prototype.ValueTypeName="quaternion";Kt.prototype.InterpolantFactoryMethodSmooth=void 0;var jt=class extends $e{constructor(e,t,n){super(e,t,n)}};jt.prototype.ValueTypeName="string";jt.prototype.ValueBufferType=Array;jt.prototype.DefaultInterpolation=kn;jt.prototype.InterpolantFactoryMethodLinear=void 0;jt.prototype.InterpolantFactoryMethodSmooth=void 0;var dn=class extends $e{constructor(e,t,n,i){super(e,t,n,i)}};dn.prototype.ValueTypeName="vector";var Wn=class{constructor(e="",t=-1,n=[],i=ro){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=xt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,o=n.length;r!==o;++r)t.push(a0(n[r]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)t.push($e.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,r=[];for(let o=0;o<s;o++){let a=[],c=[];a.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);let u=n0(a);a=Sh(a,1,u),c=Sh(c,1,u),!i&&a[0]===0&&(a.push(s),c.push(c[0])),r.push(new Zt(".morphTargetInfluences["+t[o].name+"]",a,c).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,a=e.length;o<a;o++){let c=e[o],u=c.name.match(s);if(u&&u.length>1){let h=u[1],d=i[h];d||(i[h]=d=[]),d.push(c)}}let r=[];for(let o in i)r.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return r}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function o0(l){switch(l.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Zt;case"vector":case"vector2":case"vector3":case"vector4":return dn;case"color":return Ms;case"quaternion":return Kt;case"bool":case"boolean":return Yt;case"string":return jt}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+l)}function a0(l){if(l.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=o0(l.type);if(l.times===void 0){let n=[],i=[];i0(l.keys,n,i,"value"),l.times=n,l.values=i}let t;return e.parse!==void 0?t=e.parse(l):t=new e(l.name,l.times,l.values,l.interpolation),Br(l.settings)&&(t.settings={inTangents:ln(l.settings.inTangents,Float32Array),outTangents:ln(l.settings.outTangents,Float32Array)}),t}var St={enabled:!1,files:{},add:function(l,e){this.enabled!==!1&&(Th(l)||(this.files[l]=e))},get:function(l){if(this.enabled!==!1&&!Th(l))return this.files[l]},remove:function(l){delete this.files[l]},clear:function(){this.files={}}};function Th(l){try{let e=l.slice(l.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Jr=class{constructor(e,t,n){let i=this,s=!1,r=0,o=0,a,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,s===!1&&i.onStart!==void 0&&i.onStart(u,r,o),s=!0},this.itemEnd=function(u){r++,i.onProgress!==void 0&&i.onProgress(u,r,o),r===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),a?a(u):u},this.setURLModifier=function(u){return a=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],p=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},td=new Jr,Rt=class{constructor(e){this.manager=e!==void 0?e:td,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Rt.DEFAULT_MATERIAL_NAME="__DEFAULT";var Bt={},_l=class extends Error{constructor(e,t){super(e),this.response=t}},Li=class extends Rt{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=St.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(Bt[e]!==void 0){Bt[e].push({onLoad:t,onProgress:n,onError:i});return}Bt[e]=[],Bt[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,a=this.responseType;fetch(r).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&be("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Bt[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,m=0,g=new ReadableStream({start(b){v();function v(){h.read().then(({done:y,value:_})=>{if(y)b.close();else{m+=_.byteLength;let S=new ProgressEvent("progress",{lengthComputable:p,loaded:m,total:f});for(let E=0,C=u.length;E<C;E++){let T=u[E];T.onProgress&&T.onProgress(S)}b.enqueue(_),v()}},y=>{b.error(y)})}}});return new Response(g)}else throw new _l(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(a){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,o));case"json":return c.json();default:if(o==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{St.add(`file:${e}`,c);let u=Bt[e];delete Bt[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=Bt[e];if(u===void 0)throw this.manager.itemError(e),c;delete Bt[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var yi=new WeakMap,$r=class extends Rt{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=St.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);else{let h=yi.get(r);h===void 0&&(h=[],yi.set(r,h)),h.push({onLoad:t,onError:i})}return r}let o=zr("img");function a(){u(),t&&t(this);let h=yi.get(this)||[];for(let d=0;d<h.length;d++){let f=h[d];f.onLoad&&f.onLoad(this)}yi.delete(this),s.manager.itemEnd(e)}function c(h){u(),i&&i(h),St.remove(`image:${e}`);let d=yi.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(h)}yi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",a,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",a,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),St.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}};var ws=class extends Rt{constructor(e){super(e)}load(e,t,n,i){let s=new at,r=new $r(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},Xn=class extends Ae{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new L(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var rl=new F,Eh=new M,Rh=new M,Di=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.mapType=Jn,this.map=null,this.mapPass=null,this.matrix=new F,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xt,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new Ye(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Eh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Eh),Rh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Rh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){rl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(rl,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,o=i?i.w/s.y:1,a=i?i.x/s.x:0,c=i?i.y/s.y:0;e.coordinateSystem===ds||e.reversedDepth?t.set(.5*r,0,0,.5*r+a,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*r,0,0,.5*r+a,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(rl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Dr=new M,Nr=new Z,Mt=new M,Ss=class extends Ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new F,this.projectionMatrix=new F,this.projectionMatrixInverse=new F,this.coordinateSystem=zt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Dr,Nr,Mt),Mt.x===1&&Mt.y===1&&Mt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Dr,Nr,Mt.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Dr,Nr,Mt),Mt.x===1&&Mt.y===1&&Mt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Dr,Nr,Mt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},an=new M,Ch=new B,Ih=new B,qn=class extends Ss{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ei*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ls*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ei*2*Math.atan(Math.tan(ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){an.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(an.x,an.y).multiplyScalar(-e/an.z),an.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(an.x,an.y).multiplyScalar(-e/an.z)}getViewSize(e,t){return this.getViewBounds(e,Ch,Ih),t.subVectors(Ih,Ch)}setViewOffset(e,t,n,i,s,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ls*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let a=r.fullWidth,c=r.fullHeight;s+=r.offsetX*i/a,t-=r.offsetY*n/c,i*=r.width/a,n*=r.height/c}let o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},yl=class extends Di{constructor(){super(new qn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ei*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Yn=class extends Xn{constructor(e,t,n=0,i=Math.PI/3,s=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new yl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Ml=class extends Di{constructor(){super(new qn(90,1,.5,500)),this.isPointLightShadow=!0}},Zn=class extends Xn{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ml}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ni=class extends Ss{constructor(e=-1,t=1,n=1,i=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,o=i+t,a=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,r=s+c*this.view.width,o-=u*this.view.offsetY,a=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,r,o,a,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},wl=class extends Di{constructor(){super(new Ni(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},As=class extends Xn{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.shadow=new wl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ts=class extends Xn{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Jt=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var ol=new WeakMap,Es=class extends Rt{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&be("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&be("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=St.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then(c=>{ol.has(r)===!0?(i&&i(ol.get(r)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let a=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return St.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),ol.set(a,c),St.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});St.add(`image-bitmap:${e}`,a),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Qr=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,r;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,r=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,r=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,r=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=r,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,r=this.cumulativeWeight;if(r===0){for(let o=0;o!==i;++o)n[s+o]=n[o];r=t}else{r+=t;let o=t/r;this._mixBufferRegion(n,s,0,o,i)}this.cumulativeWeight=r}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,r=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let a=t*this._origIndex;this._mixBufferRegion(n,i,a,1-s,t)}r>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let a=t,c=t+t;a!==c;++a)if(n[a]!==n[a+t]){o.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,r=i;s!==r;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let r=0;r!==s;++r)e[t+r]=e[n+r]}_slerp(e,t,n,i){Z.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let r=this._workIndex*s;Z.multiplyQuaternionsFlat(e,r,e,t,e,n),Z.slerpFlat(e,t,e,t,e,r,i)}_lerp(e,t,n,i,s){let r=1-i;for(let o=0;o!==s;++o){let a=t+o;e[a]=e[a]*r+e[n+o]*i}}_lerpAdditive(e,t,n,i,s){for(let r=0;r!==s;++r){let o=t+r;e[o]=e[o]+e[n+r]*i}}},Kl="\\[\\]\\.:\\/",l0=new RegExp("["+Kl+"]","g"),jl="[^"+Kl+"]",c0="[^"+Kl.replace("\\.","")+"]",u0=/((?:WC+[\/:])*)/.source.replace("WC",jl),h0=/(WCOD+)?/.source.replace("WCOD",c0),d0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",jl),f0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",jl),p0=new RegExp("^"+u0+h0+d0+f0+"$"),m0=["material","materials","bones","map"],Sl=class{constructor(e,t,n){let i=n||ve.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ve=class l{constructor(e,t,n){this.path=t,this.parsedPath=n||l.parseTrackName(t),this.node=l.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new l.Composite(e,t,n):new l(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(l0,"")}static parseTrackName(e){let t=p0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);m0.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let o=s[r];if(o.name===t||o.uuid===t)return o;let a=n(o.children);if(a)return a}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=l.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){be("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Se("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Se("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Se("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Se("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Se("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let r=e[i];if(r===void 0){let c=t.nodeName;Se("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let a=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}a=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(a=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(a=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=i;this.getValue=this.GetterByBindingType[a],this.setValue=this.SetterByBindingTypeAndVersioning[a][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ve.Composite=Sl;ve.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ve.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ve.prototype.GetterByBindingType=[ve.prototype._getValue_direct,ve.prototype._getValue_array,ve.prototype._getValue_arrayElement,ve.prototype._getValue_toArray];ve.prototype.SetterByBindingTypeAndVersioning=[[ve.prototype._setValue_direct,ve.prototype._setValue_direct_setNeedsUpdate,ve.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_array,ve.prototype._setValue_array_setNeedsUpdate,ve.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_arrayElement,ve.prototype._setValue_arrayElement_setNeedsUpdate,ve.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_fromArray,ve.prototype._setValue_fromArray_setNeedsUpdate,ve.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var eo=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,r=s.length,o=new Array(r),a={endingStart:Un,endingEnd:Un};for(let c=0;c!==r;++c){let u=s[c].createInterpolant(null);o[c]=u,u.settings=a}this._interpolantSettings=a,this._interpolants=o,this._propertyBindings=new Array(r),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Yh,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,r=s/i,o=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,r,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,r=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);let a=o.parameterPositions,c=o.sampleValues;return a[0]=s,a[1]=s+n,c[0]=e/r,c[1]=t/r,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let a=(e-s)*n;a<0||n===0?t=0:(this._startTime=null,t=n*a)}t*=this._updateTimeScale(e);let r=this._updateTime(t),o=this._updateWeight(e);if(o>0){let a=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Kh:for(let u=0,h=a.length;u!==h;++u)a[u].evaluate(r),c[u].accumulateAdditive(o);break;case ro:default:for(let u=0,h=a.length;u!==h;++u)a[u].evaluate(r),c[u].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,r=n===Zh;if(e===0)return s===-1?i:r&&(s&1)===1?t-i:i;if(n===qh){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,r)):this._setEndings(this.repetitions===0,!0,r)),i>=t||i<0){let o=Math.floor(i/t);i-=t*o,s+=Math.abs(o);let a=this.repetitions-s;if(a<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(a===1){let c=e<0;this._setEndings(c,!c,r)}else this._setEndings(!1,!1,r);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=s,this.time=i;if(r&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=Bn,i.endingEnd=Bn):(e?i.endingStart=this.zeroSlopeAtStart?Bn:Un:i.endingStart=hs,t?i.endingEnd=this.zeroSlopeAtEnd?Bn:Un:i.endingEnd=hs)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,r=this._weightInterpolant;r===null&&(r=i._lendControlInterpolant(),this._weightInterpolant=r);let o=r.parameterPositions,a=r.sampleValues;return o[0]=s,a[0]=t,o[1]=s+e,a[1]=n,this}},g0=new Float32Array(1),Rs=class extends Wt{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,r=e._propertyBindings,o=e._interpolants,a=n.uuid,c=this._bindingsByRootAndName,u=c[a];u===void 0&&(u={},c[a]=u);for(let h=0;h!==s;++h){let d=i[h],f=d.name,p=u[f];if(p!==void 0)++p.referenceCount,r[h]=p;else{if(p=r[h],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,a,f));continue}let m=t&&t._propertyBindings[h].binding.parsedPath;p=new Qr(ve.create(n,f,m),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,a,f),r[h]=p}o[h].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,r=s[t];if(r===void 0)r={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=r;else{let o=r.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),r.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,r=this._actionsByClip,o=r[s],a=o.knownActions,c=a[a.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,a[u]=c,a.pop(),e._byClipCacheIndex=null;let h=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete h[d],a.length===0&&delete r[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,r=i[t];r===void 0&&(r={},i[t]=r),r[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,r=this._bindingsByRootAndName,o=r[i],a=t[t.length-1],c=e._cacheIndex;a._cacheIndex=c,t[c]=a,t.pop(),delete o[s],Object.keys(o).length===0&&delete r[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new ys(new Float32Array(2),new Float32Array(2),1,g0),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,r=typeof e=="string"?Wn.findByName(i,e):e,o=r!==null?r.uuid:e,a=this._actionsByClip[o],c=null;if(n===void 0&&(r!==null?n=r.blendMode:n=ro),a!==void 0){let h=a.actionByRoot[s];if(h!==void 0&&h.blendMode===n)return h;c=a.knownActions[0],r===null&&(r=c._clip)}if(r===null)return null;let u=new eo(this,r,t,n);return this._bindAction(u,c),this._addInactiveAction(u,o,s),u}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?Wn.findByName(n,e):e,r=s?s.uuid:e,o=this._actionsByClip[r];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),r=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,r);let o=this._bindings,a=this._nActiveBindings;for(let c=0;c!==a;++c)o[c].apply(r);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let r=s.knownActions;for(let o=0,a=r.length;o!==a;++o){let c=r[o];this._deactivateAction(c);let u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let r in n){let o=n[r].actionByRoot,a=o[t];a!==void 0&&(this._deactivateAction(a),this._removeInactiveAction(a))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let r in s){let o=s[r];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Ph=new F,Cs=class{constructor(e,t,n=0,i=1/0){this.ray=new un(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new fs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Se("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ph.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ph),this}intersectObject(e,t=!0,n=[]){return Al(e,this,n,t),n.sort(Lh),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)Al(e[i],this,n,t);return n.sort(Lh),n}};function Lh(l,e){return l.distance-e.distance}function Al(l,e,t,n){let i=!0;if(l.layers.test(e.layers)&&l.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=l.children;for(let r=0,o=s.length;r<o;r++)Al(s[r],e,t,!0)}}var tc=class tc{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};tc.prototype.isMatrix2=!0;var Tl=tc;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");var x0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,b0=`#ifdef USE_ALPHAHASH
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
#endif`,v0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,y0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,M0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,w0=`#ifdef USE_AOMAP
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
#endif`,S0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,A0=`#ifdef USE_BATCHING
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
#endif`,T0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,E0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,R0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,C0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,I0=`#ifdef USE_IRIDESCENCE
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
#endif`,P0=`#ifdef USE_BUMPMAP
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
#endif`,L0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,D0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,N0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,O0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,F0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,U0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,B0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,k0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,z0=`#define PI 3.141592653589793
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
} // validated`,G0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,H0=`vec3 transformedNormal = objectNormal;
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
#endif`,V0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,W0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,X0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,q0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Y0="gl_FragColor = linearToOutputTexel( gl_FragColor );",Z0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,K0=`#ifdef USE_ENVMAP
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
#endif`,j0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,J0=`#ifdef USE_ENVMAP
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
#endif`,$0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Q0=`#ifdef USE_ENVMAP
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
#endif`,eg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,tg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ng=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ig=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sg=`#ifdef USE_GRADIENTMAP
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
}`,rg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,og=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ag=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,cg=`#ifdef USE_ENVMAP
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
#endif`,ug=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,hg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,pg=`PhysicalMaterial material;
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
#endif`,mg=`uniform sampler2D dfgLUT;
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
}`,gg=`
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
#endif`,xg=`#if defined( RE_IndirectDiffuse )
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
#endif`,bg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,_g=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ag=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Tg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Eg=`#if defined( USE_POINTS_UV )
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
#endif`,Rg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ig=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dg=`#ifdef USE_MORPHTARGETS
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
#endif`,Ng=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Og=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Fg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ug=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,zg=`#ifdef USE_NORMALMAP
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
#endif`,Gg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Vg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Wg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Yg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Jg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$g=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Qg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ex=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,nx=`float getShadowMask() {
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
}`,ix=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,sx=`#ifdef USE_SKINNING
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
#endif`,rx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ox=`#ifdef USE_SKINNING
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
#endif`,ax=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ux=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,hx=`#ifdef USE_TRANSMISSION
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
#endif`,dx=`#ifdef USE_TRANSMISSION
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
#endif`,fx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,px=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,xx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bx=`uniform sampler2D t2D;
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
}`,vx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_x=`#ifdef ENVMAP_TYPE_CUBE
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
}`,yx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wx=`#include <common>
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
}`,Sx=`#if DEPTH_PACKING == 3200
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
}`,Ax=`#define DISTANCE
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
}`,Tx=`#define DISTANCE
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
}`,Ex=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cx=`uniform float scale;
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
}`,Ix=`uniform vec3 diffuse;
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
}`,Px=`#include <common>
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
}`,Lx=`uniform vec3 diffuse;
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
}`,Dx=`#define LAMBERT
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
}`,Nx=`#define LAMBERT
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
}`,Ox=`#define MATCAP
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
}`,Fx=`#define MATCAP
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
}`,Ux=`#define NORMAL
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
}`,Bx=`#define NORMAL
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
}`,kx=`#define PHONG
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
}`,zx=`#define PHONG
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
}`,Gx=`#define STANDARD
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
}`,Hx=`#define STANDARD
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
}`,Vx=`#define TOON
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
}`,Wx=`#define TOON
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
}`,Xx=`uniform float size;
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
}`,qx=`uniform vec3 diffuse;
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
}`,Yx=`#include <common>
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
}`,Zx=`uniform vec3 color;
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
}`,Kx=`uniform float rotation;
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
}`,jx=`uniform vec3 diffuse;
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
}`,ce={alphahash_fragment:x0,alphahash_pars_fragment:b0,alphamap_fragment:v0,alphamap_pars_fragment:_0,alphatest_fragment:y0,alphatest_pars_fragment:M0,aomap_fragment:w0,aomap_pars_fragment:S0,batching_pars_vertex:A0,batching_vertex:T0,begin_vertex:E0,beginnormal_vertex:R0,bsdfs:C0,iridescence_fragment:I0,bumpmap_pars_fragment:P0,clipping_planes_fragment:L0,clipping_planes_pars_fragment:D0,clipping_planes_pars_vertex:N0,clipping_planes_vertex:O0,color_fragment:F0,color_pars_fragment:U0,color_pars_vertex:B0,color_vertex:k0,common:z0,cube_uv_reflection_fragment:G0,defaultnormal_vertex:H0,displacementmap_pars_vertex:V0,displacementmap_vertex:W0,emissivemap_fragment:X0,emissivemap_pars_fragment:q0,colorspace_fragment:Y0,colorspace_pars_fragment:Z0,envmap_fragment:K0,envmap_common_pars_fragment:j0,envmap_pars_fragment:J0,envmap_pars_vertex:$0,envmap_physical_pars_fragment:cg,envmap_vertex:Q0,fog_vertex:eg,fog_pars_vertex:tg,fog_fragment:ng,fog_pars_fragment:ig,gradientmap_pars_fragment:sg,lightmap_pars_fragment:rg,lights_lambert_fragment:og,lights_lambert_pars_fragment:ag,lights_pars_begin:lg,lights_toon_fragment:ug,lights_toon_pars_fragment:hg,lights_phong_fragment:dg,lights_phong_pars_fragment:fg,lights_physical_fragment:pg,lights_physical_pars_fragment:mg,lights_fragment_begin:gg,lights_fragment_maps:xg,lights_fragment_end:bg,lightprobes_pars_fragment:vg,logdepthbuf_fragment:_g,logdepthbuf_pars_fragment:yg,logdepthbuf_pars_vertex:Mg,logdepthbuf_vertex:wg,map_fragment:Sg,map_pars_fragment:Ag,map_particle_fragment:Tg,map_particle_pars_fragment:Eg,metalnessmap_fragment:Rg,metalnessmap_pars_fragment:Cg,morphinstance_vertex:Ig,morphcolor_vertex:Pg,morphnormal_vertex:Lg,morphtarget_pars_vertex:Dg,morphtarget_vertex:Ng,normal_fragment_begin:Og,normal_fragment_maps:Fg,normal_pars_fragment:Ug,normal_pars_vertex:Bg,normal_vertex:kg,normalmap_pars_fragment:zg,clearcoat_normal_fragment_begin:Gg,clearcoat_normal_fragment_maps:Hg,clearcoat_pars_fragment:Vg,iridescence_pars_fragment:Wg,opaque_fragment:Xg,packing:qg,premultiplied_alpha_fragment:Yg,project_vertex:Zg,dithering_fragment:Kg,dithering_pars_fragment:jg,roughnessmap_fragment:Jg,roughnessmap_pars_fragment:$g,shadowmap_pars_fragment:Qg,shadowmap_pars_vertex:ex,shadowmap_vertex:tx,shadowmask_pars_fragment:nx,skinbase_vertex:ix,skinning_pars_vertex:sx,skinning_vertex:rx,skinnormal_vertex:ox,specularmap_fragment:ax,specularmap_pars_fragment:lx,tonemapping_fragment:cx,tonemapping_pars_fragment:ux,transmission_fragment:hx,transmission_pars_fragment:dx,uv_pars_fragment:fx,uv_pars_vertex:px,uv_vertex:mx,worldpos_vertex:gx,background_vert:xx,background_frag:bx,backgroundCube_vert:vx,backgroundCube_frag:_x,cube_vert:yx,cube_frag:Mx,depth_vert:wx,depth_frag:Sx,distance_vert:Ax,distance_frag:Tx,equirect_vert:Ex,equirect_frag:Rx,linedashed_vert:Cx,linedashed_frag:Ix,meshbasic_vert:Px,meshbasic_frag:Lx,meshlambert_vert:Dx,meshlambert_frag:Nx,meshmatcap_vert:Ox,meshmatcap_frag:Fx,meshnormal_vert:Ux,meshnormal_frag:Bx,meshphong_vert:kx,meshphong_frag:zx,meshphysical_vert:Gx,meshphysical_frag:Hx,meshtoon_vert:Vx,meshtoon_frag:Wx,points_vert:Xx,points_frag:qx,shadow_vert:Yx,shadow_frag:Zx,sprite_vert:Kx,sprite_frag:jx},G={common:{diffuse:{value:new L(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new L(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new M},probesMax:{value:new M},probesResolution:{value:new M}},points:{diffuse:{value:new L(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new L(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},nd={basic:{uniforms:Ze([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.fog]),vertexShader:ce.meshbasic_vert,fragmentShader:ce.meshbasic_frag},lambert:{uniforms:Ze([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new L(0)},envMapIntensity:{value:1}}]),vertexShader:ce.meshlambert_vert,fragmentShader:ce.meshlambert_frag},phong:{uniforms:Ze([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new L(0)},specular:{value:new L(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ce.meshphong_vert,fragmentShader:ce.meshphong_frag},standard:{uniforms:Ze([G.common,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.roughnessmap,G.metalnessmap,G.fog,G.lights,{emissive:{value:new L(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag},toon:{uniforms:Ze([G.common,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.gradientmap,G.fog,G.lights,{emissive:{value:new L(0)}}]),vertexShader:ce.meshtoon_vert,fragmentShader:ce.meshtoon_frag},matcap:{uniforms:Ze([G.common,G.bumpmap,G.normalmap,G.displacementmap,G.fog,{matcap:{value:null}}]),vertexShader:ce.meshmatcap_vert,fragmentShader:ce.meshmatcap_frag},points:{uniforms:Ze([G.points,G.fog]),vertexShader:ce.points_vert,fragmentShader:ce.points_frag},dashed:{uniforms:Ze([G.common,G.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ce.linedashed_vert,fragmentShader:ce.linedashed_frag},depth:{uniforms:Ze([G.common,G.displacementmap]),vertexShader:ce.depth_vert,fragmentShader:ce.depth_frag},normal:{uniforms:Ze([G.common,G.bumpmap,G.normalmap,G.displacementmap,{opacity:{value:1}}]),vertexShader:ce.meshnormal_vert,fragmentShader:ce.meshnormal_frag},sprite:{uniforms:Ze([G.sprite,G.fog]),vertexShader:ce.sprite_vert,fragmentShader:ce.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ce.background_vert,fragmentShader:ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:ce.backgroundCube_vert,fragmentShader:ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ce.cube_vert,fragmentShader:ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ce.equirect_vert,fragmentShader:ce.equirect_frag},distance:{uniforms:Ze([G.common,G.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ce.distance_vert,fragmentShader:ce.distance_frag},shadow:{uniforms:Ze([G.lights,G.fog,{color:{value:new L(0)},opacity:{value:1}}]),vertexShader:ce.shadow_vert,fragmentShader:ce.shadow_frag}};nd.physical={uniforms:Ze([nd.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new L(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new L(0)},specularColor:{value:new L(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:ce.meshphysical_vert,fragmentShader:ce.meshphysical_frag};var Jx=new te;Jx.set(-1,0,0,0,1,0,0,0,1);var j2={[Il]:"LINEAR_TONE_MAPPING",[Pl]:"REINHARD_TONE_MAPPING",[Ll]:"CINEON_TONE_MAPPING",[Dl]:"ACES_FILMIC_TONE_MAPPING",[Ol]:"AGX_TONE_MAPPING",[Fl]:"NEUTRAL_TONE_MAPPING",[Nl]:"CUSTOM_TONE_MAPPING"};var J2=new Float32Array(16),$2=new Float32Array(9),Q2=new Float32Array(4);var eA={[Il]:"Linear",[Pl]:"Reinhard",[Ll]:"Cineon",[Dl]:"ACESFilmic",[Ol]:"AgX",[Fl]:"Neutral",[Nl]:"Custom"};var tA={[Dh]:"SHADOWMAP_TYPE_PCF",[Nh]:"SHADOWMAP_TYPE_VSM"};var nA={[Gh]:"ENVMAP_TYPE_CUBE",[Bl]:"ENVMAP_TYPE_CUBE",[Hh]:"ENVMAP_TYPE_CUBE_UV"};var iA={[Bl]:"ENVMAP_MODE_REFRACTION"};var sA={[so]:"ENVMAP_BLENDING_MULTIPLY",[Bh]:"ENVMAP_BLENDING_MIX",[kh]:"ENVMAP_BLENDING_ADD"};var $x=new te;$x.set(-1,0,0,0,1,0,0,0,1);var rA=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);var nc=Math.PI/180,id=12.5*nc,sd=0,Qx=12.5/24,ut=(l,e,t)=>{let n=Math.max(0,Math.min(1,(t-l)/(e-l)));return n*n*(3-2*n)};var eb=[[-18,.006,.011,.034],[-12,.008,.016,.05],[-8,.013,.028,.085],[-5,.022,.05,.14],[-2,.04,.085,.22],[0,.055,.12,.29],[3,.065,.15,.37],[7,.07,.165,.43],[15,.075,.18,.46],[30,.074,.18,.48],[90,.07,.175,.49]],tb=[[-18,.03,.042,.085],[-12,.045,.05,.095],[-8,.14,.085,.1],[-5,.42,.19,.1],[-2,.78,.34,.12],[0,.95,.46,.18],[3,.98,.6,.32],[7,.82,.66,.5],[15,.6,.64,.7],[30,.5,.58,.7],[90,.46,.55,.69]],nb=[[-18,.03,.042,.085],[-12,.04,.05,.1],[-8,.06,.075,.15],[-5,.11,.12,.21],[-2,.2,.18,.27],[0,.29,.27,.34],[3,.35,.37,.46],[7,.37,.43,.54],[15,.4,.49,.63],[30,.4,.5,.65],[90,.42,.52,.67]],ib=[[-12,0,0,0],[-8,.08,.035,.02],[-5,.25,.1,.035],[-2,.42,.18,.05],[0,.55,.26,.07],[3,.55,.32,.12],[7,.45,.33,.18],[15,.34,.3,.24],[30,.28,.27,.24],[90,.26,.26,.24]],sb=[[-10,0,0,0],[-6,.05,.03,.05],[-3,.13,.065,.09],[0,.11,.055,.07],[4,.03,.015,.015],[8,0,0,0]],rb=[[-18,.03,.036,.06],[-12,.04,.045,.075],[-8,.1,.075,.11],[-5,.38,.2,.21],[-2,.82,.38,.24],[0,1,.52,.3],[3,1.02,.7,.46],[7,1,.84,.68],[15,1,.97,.92],[30,1,1,.99],[90,1,1,1]],ob=[[-18,.012,.018,.042],[-12,.016,.024,.055],[-8,.03,.036,.075],[-5,.06,.055,.1],[-2,.11,.085,.13],[0,.18,.14,.19],[3,.27,.23,.28],[7,.36,.35,.41],[15,.42,.46,.55],[30,.46,.5,.6],[90,.48,.52,.62]],ab=[[-1.2,0,0,0],[0,2.4,.7,.2],[3,5,2.4,.9],[8,8,5.6,3.4],[20,12,11,9.2],[90,14,13.4,12.4]],lb=[[-2,1,.36,.14],[0,1,.45,.2],[3,1,.58,.32],[8,1,.72,.48],[15,1,.81,.6],[25,1,.86,.68],[40,1,.9,.74]];function Qt(l,e,t){if(e<=l[0][0])return t.setRGB(l[0][1],l[0][2],l[0][3]);for(let i=1;i<l.length;i++){let s=l[i];if(e<=s[0]){let r=l[i-1],o=(e-r[0])/(s[0]-r[0]);return t.setRGB(r[1]+(s[1]-r[1])*o,r[2]+(s[2]-r[2])*o,r[3]+(s[3]-r[3])*o)}}let n=l[l.length-1];return t.setRGB(n[1],n[2],n[3])}function ic(){return{t:0,elev:0,elevDeg:0,east:0,north:0,up:1,day:1,night:0,stars:0,sunK:1,moonK:0,skyK:1,dusk:0,zenith:new L,horSun:new L,horAnti:new L,glow:new L,belt:new L,cloudLit:new L,cloudShade:new L,disc:new L,light:new L,fog:new L}}function rd(l,e=ic()){let t=(l%1+1)%1,n=(t-Qx)*Math.PI*2,i=Math.cos(sd),s=Math.sin(sd),r=Math.cos(id),o=Math.sin(id);e.east=-i*Math.sin(n),e.north=r*s-o*i*Math.cos(n),e.up=o*s+r*i*Math.cos(n),e.elev=e.up;let a=e.elevDeg=Math.asin(Math.max(-1,Math.min(1,e.up)))/nc;e.t=t,e.day=ut(-9,4,a),e.night=1-e.day,e.stars=1-ut(-14,-6,a);let c=1/(Math.max(0,Math.sin(Math.max(a,0)*nc))+.50572*Math.pow(Math.max(a,0)+6.07995,-1.6364));return e.sunK=Math.exp(-.11*(c-1))*ut(-1.5,4,a),e.moonK=1-ut(-12,-3,a),e.skyK=ut(-10,12,a),e.dusk=ut(-10,-1,a)*(1-ut(4,16,a)),Qt(eb,a,e.zenith),Qt(tb,a,e.horSun),Qt(nb,a,e.horAnti),Qt(ib,a,e.glow),Qt(sb,a,e.belt),Qt(rb,a,e.cloudLit),Qt(ob,a,e.cloudShade),Qt(ab,a,e.disc),Qt(lb,a,e.light),e.fog.copy(e.horAnti).lerp(e.horSun,.3),e}var Oe={value:0},$n={value:0},ao={value:0};function cb(l=256){let e=49734321,t=()=>(e=e*1664525+1013904223>>>0,e/4294967296),n=c=>{let u=new Float32Array(c*c);for(let h=0;h<u.length;h++)u[h]=t();return u},i=c=>{let u=c.map(n),h=new Float32Array(l*l),d=1e9,f=-1e9;for(let p=0;p<l;p++)for(let m=0;m<l;m++){let g=0,b=.5,v=0;for(let y=0;y<c.length;y++){let _=c[y],S=u[y],E=m/l*_,C=p/l*_,T=Math.floor(E),R=Math.floor(C),P=E-T,I=C-R;P=P*P*(3-2*P),I=I*I*(3-2*I);let D=T%_,N=R%_,O=(T+1)%_,U=(R+1)%_,V=S[N*_+D],K=S[N*_+O],Y=S[U*_+D],ee=S[U*_+O];g+=b*((V+(K-V)*P)*(1-I)+(Y+(ee-Y)*P)*I),v+=b,b*=.5}g/=v,h[p*l+m]=g,g<d&&(d=g),g>f&&(f=g)}for(let p=0;p<h.length;p++)h[p]=(h[p]-d)/(f-d);return h},s=i([5,10,20,40,80]),r=i([16,32,64,128]),o=new Uint8Array(l*l*4);for(let c=0;c<l*l;c++)o[c*4]=s[c]*255,o[c*4+1]=r[c]*255,o[c*4+2]=0,o[c*4+3]=255;let a=new ot(o,l,l,Vt,Jn);return a.wrapS=a.wrapT=Ht,a.magFilter=$t,a.minFilter=jn,a.generateMipmaps=!0,a.needsUpdate=!0,a}function od(){let l={uSun:{value:new M(0,1,0)},uMoon:{value:new M(0,1,0)},uSunXZ:{value:new B(1,0)},uCam:{value:new M},uZen:{value:new L},uHorS:{value:new L},uHorA:{value:new L},uGlow:{value:new L},uBelt:{value:new L},uDisc:{value:new L},uCLit:{value:new L},uCShade:{value:new L},uFog:{value:new L},uWind:{value:new Ye},uCover:{value:.58},uCloudAmt:{value:1},uMoonI:{value:0}},e=new vt({uniforms:{...l,uNight:Oe,uStars:ao,uTime:$n,uNoise:{value:cb()}},side:no,depthWrite:!1,transparent:!0,blending:El,fog:!1,vertexShader:`
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
      }`}),t=new k(new ke(1,32,16),e);return t.frustumCulled=!1,t.renderOrder=-1e3,t.name="aw:sky",t.matrixAutoUpdate=!0,{mesh:t,u:l}}var ub=new L(14017279),hb=new L(2770032),db=new L(11569752),fb=new L(9348300),pb=new L(16764836),mb=new L(10334430),gb=new L(3820134),ad=24,xb=new L,lo=l=>l-Math.floor(l);function sc(l,e){if(l.y>=e)return l;let t=Math.hypot(l.x,l.z)||1,n=Math.sqrt(1-e*e)/t;return l.set(l.x*n,e,l.z*n)}var co=class{constructor(e,t=!0){x(this,"g");x(this,"sky");x(this,"ambient");x(this,"sample",ic());x(this,"sunW",new M(0,1,0));x(this,"moonW",new M(0,1,0));x(this,"base");x(this,"ax",{ex:1,ez:0,nx:0,nz:-1});x(this,"wind",{x:0,z:0,qx:0,qz:0});x(this,"low");x(this,"disc");x(this,"clouds",[]);this.g=e;let n=e.real.sky,i=n.sunDir.clone().normalize();this.base={theta:n.theta,envAng0:Math.atan2(-i.z,i.x),sunColor:n.sun.color.clone(),sunI:n.sun.intensity,bounceSky:n.bounce.color.clone(),bounceGround:n.bounce.groundColor.clone(),bounceI:n.bounce.intensity,fog:n.fog.color.clone(),exposure:e.renderer.toneMappingExposure};let s=e.fromLL;if(s){let c=s(12.52,-70),u=s(12.52,-69.99),h=s(12.53,-70),d=Math.hypot(u.x-c.x,u.z-c.z)||1,f=Math.hypot(h.x-c.x,h.z-c.z)||1;this.ax={ex:(u.x-c.x)/d,ez:(u.z-c.z)/d,nx:(h.x-c.x)/f,nz:(h.z-c.z)/f}}let r=this.ax,o=-(.924*r.ex+.383*r.nx)*ad,a=-(.924*r.ez+.383*r.nz)*ad;this.wind={x:o/6e3,z:a/6e3,qx:(.8*o+.6*a)/2300,qz:(-.6*o+.8*a)/2300},this.low=e.real.q?.name==="low",this.disc=t?1:0,this.ambient=new Ts(9348300,0),this.ambient.name="aw:nightAmbient",e.scene.add(this.ambient),this.sky=od(),e.scene.add(this.sky.mesh);for(let c of e.scene.children){let u=c;u.isSprite&&u.material&&u.position.y>25&&u.scale.x>60&&this.clouds.push({m:u.material,c:u.material.color.clone(),o:u.material.opacity})}}apply(e){let t=this.g,n=t.real.sky,i=rd(e,this.sample),s=this.base,r=this.ax,o=this.low,a=i.night,c=i.elevDeg;Oe.value=a,ao.value=i.stars;let u=this.sunW.set(i.east*r.ex+i.north*r.nx,i.up,i.east*r.ez+i.north*r.nz).normalize(),h=sc(this.moonW.copy(u).negate(),.62),d=c>-2,f=n.sunDir;d?sc(f.copy(u),.07):sc(f.copy(h),.78);let p=s.theta+Math.atan2(-f.z,f.x)-s.envAng0;t.scene.environmentRotation.set(0,p,0),t.scene.backgroundRotation.set(0,p,0),t.scene.background&&(t.scene.background=null);let m=ut(.42,.75,a);d?(n.sun.color.copy(i.light).lerp(s.sunColor,ut(30,45,c)),n.sun.intensity=s.sunI*i.sunK):(n.sun.color.copy(ub),n.sun.intensity=s.sunI*(.32+.16*m)*i.moonK*(o?1.1:1)),n.bounce.color.copy(s.bounceSky).lerp(hb,a),n.bounce.groundColor.copy(s.bounceGround).lerp(db,a),n.bounce.intensity=s.bounceI+((.55+.35*m)*(o?.72:1)-s.bounceI)*a;let g=i.dusk*(1-i.moonK);this.ambient.color.copy(pb).lerp(mb,1-ut(-6,2,c)).lerp(fb,i.moonK),this.ambient.intensity=.32*g*(o?.75:1)+(.55+.45*m)*(o?.5:1)*i.moonK;let b=o?.12:.22;t.scene.environmentIntensity=b+(1-b)*i.skyK,t.renderer.toneMappingExposure=s.exposure*(1+(o?.02:.14)*a)*(1+.1*i.dusk),n.fog.color.copy(i.fog).lerp(s.fog,.45*ut(12,30,c));let v=t.camera,y=this.sky.u;this.sky.mesh.position.copy(v.position),this.sky.mesh.scale.setScalar(v.far*.9),y.uSun.value.copy(u);let _=Math.hypot(u.x,u.z);_>1e-4&&y.uSunXZ.value.set(u.x/_,u.z/_),y.uMoon.value.copy(h),y.uMoonI.value=i.moonK,y.uCam.value.copy(v.position),y.uZen.value.copy(i.zenith),y.uHorS.value.copy(i.horSun),y.uHorA.value.copy(i.horAnti),y.uGlow.value.copy(i.glow),y.uBelt.value.copy(i.belt),y.uDisc.value.copy(i.disc).multiplyScalar(this.disc),y.uCLit.value.copy(i.cloudLit),y.uCShade.value.copy(i.cloudShade),y.uFog.value.copy(n.fog.color);let S=$n.value,E=this.wind;y.uWind.value.set(lo(E.x*S),lo(E.z*S),lo(E.qx*S),lo(E.qz*S)),y.uCloudAmt.value=1-.35*a;for(let C of this.clouds)C.m.color.copy(C.c).lerp(xb.copy(gb),a),C.m.opacity=C.o*(1-.6*a)}};function fn(l,e,t){let n=l;if(n.userData["aw:"+e])return;n.userData["aw:"+e]=!0;let i=n.onBeforeCompile,s=n.customProgramCacheKey?n.customProgramCacheKey.bind(n):()=>"";n.onBeforeCompile=(r,o)=>{i&&i.call(n,r,o),t(r)},n.customProgramCacheKey=()=>s()+"|aw-"+e,n.needsUpdate=!0}function bb(l){fn(l,"winglow-v1",e=>{e.fragmentShader.includes("float gMask = glass;")&&(e.uniforms.uAwNight=Oe,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    float awB = floor(u / 3.6), awF = floor(v / max(fh, 0.5));
    float awR = rwH(vec2(awB * 3.1 + seed * 11.0, awF * 7.3 + 0.37));
    float awLit = step(0.6, awR); // ~40% of windows lit (r202: 50%)
    vec3 awWarm = mix(vec3(1.0, 0.6, 0.28), vec3(1.0, 0.86, 0.62), rwH(vec2(awR, seed + 0.5)));
    totalEmissiveRadiance += awWarm * gMask * awLit * smoothstep(0.3, 0.8, uAwNight) * (0.35 + 0.25 * awR); // owner: city too bright (r202 0.9, before 2.4)
  }`))})}function vb(l){fn(l,"herowin-v2",e=>{e.fragmentShader.includes("#include <emissivemap_fragment>")&&(e.uniforms.uAwNight=Oe,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
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
  }`))})}var _b=new L(16763269),yb=new M,uo=class{constructor(e){x(this,"g");x(this,"head");x(this,"headTarget");x(this,"pools",[]);x(this,"bulbMats",new Set);x(this,"bulbBase",new Map);x(this,"lampMeshes",new Set);x(this,"scanT",0);x(this,"heroGlow",new Map);x(this,"heroN",-1);x(this,"bump",[]);x(this,"poolT",0);x(this,"waterDone",new WeakSet);x(this,"waterSeen",new WeakSet);x(this,"waterTopN",-1);x(this,"waterT",0);this.g=e;let t=e.real;t.buildings?.wall&&bb(t.buildings.wall),this.head=new Yn(16773576,0,58,.95,.6,1),this.head.castShadow=!1,this.head.name="aw:headlight",this.headTarget=new Ae,this.head.target=this.headTarget,e.scene.add(this.head,this.headTarget);let i=(t.q?.name??"med")==="high"?4:0;for(let s=0;s<i;s++){let r=new Zn(16757086,0,28,2);r.castShadow=!1,r.name="aw:lampPool",this.pools.push(r),e.scene.add(r)}}patchWaterMat(e){if(!e||Array.isArray(e)||this.waterDone.has(e))return;this.waterDone.add(e);let t=e.customProgramCacheKey?e.customProgramCacheKey():"";/\|water/.test(t)&&fn(e,"waternight-v1",n=>{n.fragmentShader.includes("diffuseColor = vec4(wc, a);")&&(n.uniforms.uAwNight=Oe,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("diffuseColor = vec4(wc, a);",`wc *= mix(1.0, 0.22, uAwNight); wc = mix(wc, wc * vec3(0.55, 0.75, 1.1), uAwNight * 0.5);
  diffuseColor = vec4(wc, a);`))})}patchWater(){let e=this.g.real;if(e.group.children.length!==this.waterTopN){this.waterTopN=e.group.children.length;for(let t of e.group.children){let n=t.material;t.isMesh&&this.patchWaterMat(n)}}for(let t of e.regions.values())t.wmat&&this.patchWaterMat(t.wmat),!(t.state!=="built"||!t.group||this.waterSeen.has(t.group))&&(this.waterSeen.add(t.group),t.group.traverse(n=>{n.isMesh&&this.patchWaterMat(n.material)}))}scan(){this.waterT++,this.patchWater(),this.g.real.veg.group.traverse(e=>{let t=e.material;!e.isMesh||!t||Array.isArray(t)||!t.emissive||(t.emissive.getHex()===5591884||this.bulbMats.has(t))&&(this.bulbMats.has(t)||(this.bulbMats.add(t),this.bulbBase.set(t,{e:t.emissive.clone(),i:t.emissiveIntensity})),e.isInstancedMesh&&this.lampMeshes.add(e))});for(let e of this.lampMeshes)e.parent||this.lampMeshes.delete(e);this.scanHero()}scanHero(){let e=this.g.real.hero?.group;if(!e)return;let t=0;e.traverse(()=>t++),t!==this.heroN&&(this.heroN=t,e.traverse(n=>{let i=n.material;if(!(!n.isMesh||!i))for(let s of Array.isArray(i)?i:[i]){if(!s||!s.emissive||this.heroGlow.has(s))continue;let r=s.name||"";/^l?(signglow|neon|bulb)/i.test(r)?this.heroGlow.set(s,s.emissiveIntensity||1):r==="sign"?this.heroGlow.set(s,-(s.emissiveIntensity||1)):/^(facade|ground)(_\d+)?$/.test(r)?(vb(s),this.bump.push(s)):r==="glass"&&(s.emissive.setHex(16763269),s.emissiveIntensity=0,this.heroGlow.set(s,0))}}))}carForward(e){let t=this.g.S.car.h;return e.set(-Math.sin(t),0,-Math.cos(t)),!0}update(e){let t=this.g,n=Oe.value;this.scanT-=e,this.scanT<=0&&(this.scanT=2,this.scan());let i=Math.max(0,Math.min(1,(n-.25)/.4));for(let a of this.bulbMats){let c=this.bulbBase.get(a);a.emissive.copy(c.e).lerp(_b,i),a.emissiveIntensity=c.i+i*2}if(this.bump.length){for(let a of this.bump)a.needsUpdate=!0;this.bump.length=0}for(let a of this.heroGlow.keys()){let c=this.heroGlow.get(a);a.emissiveIntensity=c>0?c*(.45+i*.95):c<0?-c*(1+i*.55):i*.16}let s=t.S,r=(s.mode==="car"||s.mode==="moto")&&n>.35,o=yb;if(r&&this.carForward(o)){let a=s.car,c=(a.y||0)+(s.mode==="moto"?.72:.62);this.head.position.set(a.x+o.x*2.2,c,a.z+o.z*2.2),this.headTarget.position.set(a.x+o.x*24,(a.y||0)+.2,a.z+o.z*24),this.headTarget.updateMatrixWorld(),this.head.intensity=14*n}else this.head.intensity=0;if(this.head.visible=n>.35,this.pools.length){if(this.poolT-=e,this.poolT<=0){this.poolT=.5;let a=t.camera.position,c=[],u=new F;for(let h of this.lampMeshes){let d=h.matrixWorld;for(let f=0;f<h.count;f++){h.getMatrixAt(f,u);let p=new M().setFromMatrixPosition(u).applyMatrix4(d),m=(p.x-a.x)**2+(p.z-a.z)**2;m>8100||c.push({d:m,p})}}c.sort((h,d)=>h.d-d.d),this.pools.forEach((h,d)=>{let f=c[d];f&&h.position.set(f.p.x,f.p.y+6.5,f.p.z),h.userData.has=!!f})}for(let a of this.pools)a.intensity=a.userData.has?n*12:0,a.visible=n>.3}}};var ho=[1,.9,.8,.7,.6],ld=[1,.85,.75,.75,.75],cd=6,fo=class{constructor(e){x(this,"g");x(this,"enabled");x(this,"target");x(this,"level",0);x(this,"maxLevel",cd);x(this,"fps",60);x(this,"basePR");x(this,"acc",0);x(this,"frames",0);x(this,"lowFor",0);x(this,"highFor",0);x(this,"holdUp",0);x(this,"warm",4);x(this,"shadowTick",0);x(this,"stalls",0);x(this,"upAt",-1e9);x(this,"bounces",0);x(this,"floorUntil",0);x(this,"t",0);x(this,"phone",!1);x(this,"listeners",[]);this.g=e,this.basePR=e.renderer.getPixelRatio(),this.enabled=H.get("fpsguard")!=="0"&&localStorage.getItem("aw_fpsguard")!=="0";let t=e.real?.q?.name,n=+(H.get("fps")||0),i=!(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window),s=t==="high";this.target=n>10?n:t==="low"?i?30:50:i&&s?57:50,this.maxLevel=i&&s?4:i?cd:5,this.phone=!i,document.addEventListener("visibilitychange",()=>{this.warm=2,this.acc=0,this.frames=0})}onChange(e){this.listeners.push(e)}setEnabled(e){this.enabled=e;try{localStorage.setItem("aw_fpsguard",e?"1":"0")}catch{}e||this.setLevel(0),this.listeners.forEach(t=>t())}setLevel(e){if(e=Math.max(0,Math.min(this.maxLevel,e)),e===this.level)return;let t=this.g,n=(this.phone?ld:ho)[Math.min(e,ho.length-1)],i=window.__awPRCap||1/0,s=Math.max(.5,Math.min(this.basePR,i)*n);Math.abs(t.renderer.getPixelRatio()-s)>.001&&(t.renderer.setPixelRatio(s),window.dispatchEvent(new Event("resize")),window.__awPost?window.__awPost.render():t.renderer.render(t.scene,t.camera)),t.renderer.shadowMap.autoUpdate=e<5,e<5&&(t.renderer.shadowMap.needsUpdate=!0),window.__noPost=e>=6,this.level=e,this.listeners.forEach(r=>r())}frame(e){let t=this.g.renderer;if(this.level>=5&&++this.shadowTick%7===0&&(t.shadowMap.needsUpdate=!0),!this.enabled||document.hidden)return;if(this.t+=Math.min(e,1),e>1.5&&++this.stalls<3){this.warm=Math.max(this.warm,1);return}if(e<=1.5&&(this.stalls=0),this.warm>0){this.warm-=Math.max(0,e);return}if(this.acc+=e,this.frames++,this.acc<.5)return;this.fps=this.frames/this.acc;let n=this.acc;this.acc=0,this.frames=0,this.holdUp=Math.max(0,this.holdUp-n),this.fps<this.target-2?(this.lowFor+=n,this.highFor=0):this.fps>Math.min(this.target+8,58)?(this.highFor+=n,this.lowFor=0):(this.lowFor=0,this.highFor=0);let i=window.__awAhead,s=!!i&&Math.hypot(i[0],i[1])>25;this.lowFor>=(this.phone?3:1.5)&&this.level<this.maxLevel?(this.t-this.upAt<25&&++this.bounces>=2&&(this.floorUntil=this.t+600),this.setLevel(this.level+1),this.lowFor=0,this.warm=1,this.holdUp=15):this.highFor>=6&&this.level>0&&!(this.phone&&s)&&this.holdUp<=0&&this.t>this.floorUntil&&(this.setLevel(this.level-1),this.upAt=this.t,this.highFor=0,this.warm=1,this.holdUp=8)}describe(){if(!this.enabled)return"off";let e=(this.phone?ld:ho)[Math.min(this.level,ho.length-1)],t=this.level>=6?" \xB7 post off":this.level>=5?" \xB7 lazy shadows":"";return`${Math.round(this.fps)} fps \xB7 target ${this.target} \xB7 scale ${Math.round(e*100)}%${t}`}};var po=class{constructor(e){x(this,"g",e);x(this,"px",NaN);x(this,"pz",NaN);x(this,"vx",0);x(this,"vz",0)}frame(e){let t=this.g.camera.position;if(e>0&&e<.5&&Number.isFinite(this.px)){let a=Math.min(1,e*1.5);this.vx+=((t.x-this.px)/e-this.vx)*a,this.vz+=((t.z-this.pz)/e-this.vz)*a}this.px=t.x,this.pz=t.z;let n=this.vx*5,i=this.vz*5,s=Math.hypot(n,i);s>220&&(n*=220/s,i*=220/s);let r=window,o=r.__awAhead||(r.__awAhead=[0,0]);s<15?(o[0]=0,o[1]=0):(o[0]=n,o[1]=i)}};var Mb=["map","normalMap","roughnessMap","metalnessMap","emissiveMap","aoMap","alphaMap","bumpMap","lightMap","specularMap","clearcoatNormalMap"],mo=class{constructor(e,t,n=!0,i=!1){x(this,"g",e);x(this,"incremental",n);x(this,"preUpload",i);x(this,"on");x(this,"n",0);x(this,"t",1);x(this,"busy",!1);x(this,"seen",new WeakSet);x(this,"keys",new Set);x(this,"lightKey","");x(this,"seenTex",new WeakSet);x(this,"texQ",[]);x(this,"pend",[]);x(this,"inflight",0);x(this,"stats",{compiles:0,objs:0,reps:0,uploads:0});this.on=t}frame(e){if(!this.on)return;let t=this.g.renderer;if(t.shadowMap.autoUpdate=!1,(this.n++&1)===0&&(t.shadowMap.needsUpdate=!0),this.texQ.length&&this.upload(),(this.t-=e)>0&&!this.pend.length||!t.compileAsync)return;if(!this.incremental){if(this.busy)return;this.t=4,this.busy=!0,t.compileAsync(this.g.scene,this.g.camera).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.busy=!1});return}this.pend.length||(this.t=.5,this.pend=this.scan());let n=this.pend.splice(0,4).filter(s=>s.parent);if(!n.length)return;this.inflight++,this.stats.reps+=n.length;let i={traverse:s=>{for(let r of n)s(r)},traverseVisible:()=>{}};t.compileAsync(i,this.g.camera,this.g.scene).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.inflight--})}pending(){return this.pend.length+this.inflight}upload(){let e=this.g.renderer,t=performance.now();for(let n=0;n<2&&this.texQ.length&&performance.now()-t<3;){let i=this.texQ.shift(),s=i.image;if(i.version===0||!s||s.complete===!1){this.texQ.length?this.texQ.push(i):this.seenTex.delete(i);break}e.properties.get(i).__version!==i.version&&(e.initTexture(i),n++,this.stats.uploads++)}}scan(){let e=[],t="",n=i=>{if(i.visible){i.isLight&&(t+=i.type+(i.castShadow?"s":"")+",");for(let s of i.children)n(s)}};return n(this.g.scene),t!==this.lightKey&&(this.lightKey=t,this.keys.clear(),this.seen=new WeakSet),this.g.scene.traverse(i=>{let s=i;if(this.seen.has(s)||!(s.isMesh||s.isPoints||s.isLine||s.isSprite)||!s.material)return;this.seen.add(s),this.stats.objs++;let r=s.geometry,o=r?r.attributes:{},a=Array.isArray(s.material)?s.material:[s.material],c=(s.isInstancedMesh?s.instanceColor?"I":"i":"")+(s.isBatchedMesh?s._colorsTexture?"B":"b":"")+(s.isSkinnedMesh?"s":"")+(s.receiveShadow?"r":"")+(o.color?"c":"")+(o.tangent?"t":"")+(o.uv1?"1":"")+(o.uv2?"2":"")+(r&&Object.keys(r.morphAttributes).length?"m":"")+s.type,u=!1;if(this.preUpload)for(let h of a)for(let d of Mb){let f=h[d];f&&f.isTexture&&!f.isCubeTexture&&!this.seenTex.has(f)&&(this.seenTex.add(f),this.texQ.push(f))}for(let h of a){let d=h.id+":"+h.version+":"+c;this.keys.has(d)||(this.keys.add(d),u=!0)}u&&e.push(s)}),e}};function wb(l,e){let t=e&&e.length===l.length*10?e:new Float64Array(l.length*10);for(let n=0,i=0;n<l.length;n++,i+=10){let s=l[n],r=s.position,o=s.quaternion,a=s.scale;t[i]=r.x,t[i+1]=r.y,t[i+2]=r.z,t[i+3]=o.x,t[i+4]=o.y,t[i+5]=o.z,t[i+6]=o.w,t[i+7]=a.x,t[i+8]=a.y,t[i+9]=a.z}return t}function rc(l,e,t){let n=l.position,i=l.quaternion,s=l.scale;return e[t]===n.x&&e[t+1]===n.y&&e[t+2]===n.z&&e[t+3]===i.x&&e[t+4]===i.y&&e[t+5]===i.z&&e[t+6]===i.w&&e[t+7]===s.x&&e[t+8]===s.y&&e[t+9]===s.z}function Sb(l,e){for(let t=0;t<16;t++)if(l[t]!==e[t])return!1;return!0}function hd(l,e){e.push(l);let t=l.children;for(let n=0;n<t.length;n++)hd(t[n],e);return e}function ud(l,e){let t=l.o;for(let n=0;n<l.depth&&t;n++)t=t.parent;return t===e}var oc=l=>Object.getPrototypeOf(l);function Ab(l){let e=this.__awFz;if(e&&e.frozen){if(!this.matrixWorldNeedsUpdate){if(!l)return;let t=this.parent;if(t&&Sb(t.matrixWorld.elements,e.pm)&&rc(this,e.snap,0))return}go(e),e.fthaw=!0}oc(this).updateMatrixWorld.call(this,l)}function Tb(l){for(let e=l.target;e;e=e.parent)if(e.__awFz&&e.__awFz.frozen){go(e.__awFz);return}}function go(l){l.frozen&&(l.frozen=!1,l.t=-1,oc(l.o).updateMatrixWorld.call(l.o,!1))}var xo=class{constructor(e){x(this,"g",e);x(this,"stats",{frozen:0,frozenNodes:0,thaws:0,splits:0,roots:0});x(this,"roots",[]);x(this,"parents",[]);x(this,"tracked",new WeakSet);x(this,"hooked",new WeakSet);x(this,"clock",0);x(this,"scanT",0);x(this,"ci",0);x(this,"ck",0);x(this,"oi",0)}top(){return(this.g.real||{}).group||null}track(e,t){this.tracked.has(e)||(this.tracked.add(e),this.roots.push({o:e,depth:t,nodes:[],snap:new Float64Array(0),pm:new Float64Array(16),t:-1,frozen:!1,dead:!1,fthaw:!1}))}frame(e){let t=this.top();if(!t)return;if(this.clock+=e,(this.scanT-=e)<=0){this.scanT=1;for(let c of t.children)this.track(c,1);let s=0;for(let c of this.parents){if(!ud(c,t)){this.tracked.delete(c.o);continue}this.parents[s++]=c;for(let u of c.o.children)this.track(u,c.depth+1)}this.parents.length=s;let r=0,o=0,a=0;for(let c of this.roots)ud(c,t)||(go(c),c.dead=!0,this.tracked.delete(c.o)),!c.dead&&(this.roots[r++]=c,c.frozen&&(o++,a+=c.nodes.length));this.roots.length=r,this.stats.roots=r,this.stats.frozen=o,this.stats.frozenNodes=a}let n=this.roots.length;if(!n)return;for(let s=0,r=400;s<n&&r>0;s++){let o=this.roots[this.oi=(this.oi+1)%n];if(o.fthaw&&(o.fthaw=!1,this.stats.thaws++),o.frozen||o.dead||o.t>=0&&this.clock-o.t<2)continue;let a=hd(o.o,[]),c=o.snap,u=o.nodes;r-=a.length;let h=o.t<0||u.length!==a.length;for(let d=0;d<a.length&&!h;d++)(a[d]!==u[d]||!rc(a[d],c,d*10))&&(h=!0);if(h&&o.t>=0&&o.depth<4&&o.o.children.length){o.dead=!0,this.stats.splits++,this.parents.push(o);for(let d of o.o.children)this.track(d,o.depth+1);continue}if(h){o.nodes=a,o.snap=wb(a,c),o.t=this.clock;continue}this.freeze(o)}let i=600;for(let s=0;i>0&&s<n;s++){let r=this.roots[this.ci%n];if(!r.frozen){this.ci++,this.ck=0;continue}let o=r.nodes,a=r.snap,c=!1,u=this.ck;for(;u<o.length&&i>0;u++,i--){let h=o[u];if(u>0&&h.matrixWorldNeedsUpdate||!rc(h,a,u*10)){c=!0;break}}if(c&&(go(r),this.stats.thaws++),c||u>=o.length)this.ci++,this.ck=0;else{this.ck=u;break}}}freeze(e){if(!e.o.parent)return;oc(e.o).updateMatrixWorld.call(e.o,!1);let t=e.o.parent.matrixWorld.elements;for(let n=0;n<16;n++)e.pm[n]=t[n];for(let n of e.nodes)this.hooked.has(n)||(this.hooked.add(n),n.addEventListener("childadded",Tb));Object.prototype.hasOwnProperty.call(e.o,"updateMatrixWorld")||(e.o.updateMatrixWorld=Ab),e.o.__awFz=e,e.frozen=!0}};function _t(l,e=!1){let t=l[0].index!==null,n=new Set(Object.keys(l[0].attributes)),i=new Set(Object.keys(l[0].morphAttributes)),s={},r={},o=l[0].morphTargetsRelative,a=new re,c=0;for(let u=0;u<l.length;++u){let h=l[u],d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in h.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;a.addGroup(c,f,u),c+=f}}if(t){let u=0,h=[];for(let d=0;d<l.length;++d){let f=l[d].index;for(let p=0;p<f.count;++p)h.push(f.getX(p)+u);u+=l[d].attributes.position.count}a.setIndex(h)}for(let u in s){let h=dd(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;a.setAttribute(u,h)}for(let u in r){let h=r[u][0].length;if(h!==0){a.morphAttributes=a.morphAttributes||{},a.morphAttributes[u]=[];for(let d=0;d<h;++d){let f=[];for(let m=0;m<r[u].length;++m)f.push(r[u][m][d]);let p=dd(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;a.morphAttributes[u].push(p)}}}return a}function dd(l){let e,t,n,i=-1,s=0;for(let c=0;c<l.length;++c){let u=l[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}let r=new e(s),o=new ie(r,t,n),a=0;for(let c=0;c<l.length;++c){let u=l[c];if(u.isInterleavedBufferAttribute){let h=a/t;for(let d=0,f=u.count;d<f;d++)for(let p=0;p<t;p++){let m=u.getComponent(d,p);o.setComponent(d+h,p,m)}}else r.set(u.array,a);a+=u.count*t}return i!==void 0&&(o.gpuType=i),o}function ac(l,e){if(e===Hl)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),l;if(e===Oi||e===Ps){let t=l.getIndex();if(t===null){let s=[],r=l.getAttribute("position");if(r!==void 0){for(let o=0;o<r.count;o++)s.push(o);l.setIndex(s),t=l.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),l}let n=t.count-2,i=[];if(e===Oi)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),l.setIndex(i),l.clearGroups(),l}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),l}var bo=class{constructor(e){x(this,"g",e);x(this,"stats",{regions:0,before:0,after:0,ms:0});x(this,"n",0);x(this,"todo",[])}frame(){if(++this.n%3)return;let e=this.todo.shift();if(e){let n=performance.now();this.mergeList(e.root,e.list),this.stats.ms=Math.max(this.stats.ms,performance.now()-n);return}let t=this.g.real;for(let n of t.regions.values())if(!(n.__awBM||n.state!=="built"||!n.group)&&!t.queue.some(i=>i.R===n)){n.__awBM=!0,this.collect(n.group);return}}collect(e){let t=new Map;e.traverse(n=>{let i=n;if(!i.isMesh||i.isInstancedMesh||!i.name.startsWith("bld:")||i.name==="bld:kit"||Array.isArray(i.material))return;let s=i,r=!0;for(;s&&s!==e;)s.matrix.equals(Eb)||(r=!1),s=s.parent;if(!r)return;let o=i.geometry;if(Object.keys(o.morphAttributes).length||o.groups.length)return;let a=i.name+"|"+i.material.uuid+"|"+Object.keys(o.attributes).sort().join(",")+"|"+(o.index?1:0)+"|"+(i.castShadow?1:0)+(i.receiveShadow?1:0)+"|"+i.renderOrder;(t.get(a)||t.set(a,[]).get(a)).push(i)});for(let n of t.values())this.stats.before+=n.length,n.length<2?this.stats.after++:this.todo.push({root:e,list:n});this.stats.regions++}mergeList(e,t){if(!t[0].parent)return;let n=_t(t.map(r=>r.geometry));if(!n){this.stats.after+=t.length;return}n.computeBoundingSphere(),n.computeBoundingBox();let i=t[0],s=new k(n,i.material);s.name=i.name,s.castShadow=i.castShadow,s.receiveShadow=i.receiveShadow,s.renderOrder=i.renderOrder,s.frustumCulled=i.frustumCulled;for(let r of t)r.removeFromParent(),r.geometry.dispose();e.add(s),this.stats.after++}},Eb=new F;var Rb=new F,fd=new F,pd=new Xt,en=new M,md=0,gd=1,xd=2;function lc(l,e,t,n){let i=this.userData.awb;fd.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),pd.setFromProjectionMatrix(fd,t.coordinateSystem,t.reversedDepth);let s=pd.planes,r=n.index?n.index.array.BYTES_PER_ELEMENT:1,o=this._multiDrawStarts,a=this._multiDrawCounts,c=this._geometryInfo,u=0;e:for(let h=0;h<i.nVis;h++){let d=i.vis[h],f=i.cx[d],p=i.cy[d],m=i.cz[d],g=-i.r[d];for(let v=0;v<6;v++){let y=s[v],_=y.normal;if(_.x*f+_.y*p+_.z*m+y.constant<g)continue e}let b=c[d];o[u]=b.start*r,a[u]=b.count,u++}this.userData.awInd||(this._indirectTexture.needsUpdate=!0,this.userData.awInd=1),this._multiDrawCount=u,this._multiDrawBytesPerElement=r,this._visibilityChanged=!1}var vo=class{constructor(e,t,n=1/0){x(this,"g",e);x(this,"budget",t);x(this,"shellR",n);x(this,"stats",{regions:0,batches:0,cells:0,visCells:0,maxSlice:0,failed:0});x(this,"jobs",[]);x(this,"live",new Set);x(this,"fx",NaN);x(this,"fz",NaN);let i=e.real,s=i.update.bind(i);i.update=(...r)=>{let o=s(...r);if(i.cullT===0){let a=window.__awAhead;this.fx=r[0]+(a?a[0]:0),this.fz=r[2]+(a?a[1]:0),this.cullAll()}return o}}pending(){let e=this.jobs.length;for(let t of this.g.real.regions.values())!t.__awBB&&t.state==="built"&&t.group&&e++;return e}frame(){let e=this.g.real,t=performance.now();if(this.live.size){let i=0;for(let s of this.live)(!s.group||!s.group.parent)&&i++;if(i){for(let s of[...this.live])if(!s.group||!s.group.parent){for(let r of s.__awBB||[])r.bm.dispose();this.live.delete(s)}}}if(!this.jobs.length){for(let i of e.regions.values())if(!i.__awBB&&i.state==="built"&&i.group){this.collect(i);break}}for(;this.jobs.length&&performance.now()-t<this.budget;){let i=this.jobs[0];if(!i.list[0].parent||!i.R.group||!i.R.group.parent){this.jobs.shift(),i.b.bm.dispose();continue}let s=i.b.bm;if(i.i<i.list.length){let u=i.list[i.i].geometry;try{s.addInstance(s.addGeometry(u))}catch(h){console.warn("[aw-bb]",h),this.stats.failed++,this.jobs.shift(),s.dispose();continue}u.boundingBox||u.computeBoundingBox(),i.box.union(u.boundingBox),i.i++;continue}let r=i.list[i.k].geometry.attributes.position,o=r.array,a=r.data?-1:r.itemSize;i.box.getCenter(en);let c=i.r2;if(a>0)for(let u=0;u<o.length;u+=a){let h=o[u]-en.x,d=o[u+1]-en.y,f=o[u+2]-en.z,p=h*h+d*d+f*f;p>c&&(c=p)}else for(let u=0;u<r.count;u++){let h=r.getX(u)-en.x,d=r.getY(u)-en.y,f=r.getZ(u)-en.z,p=h*h+d*d+f*f;p>c&&(c=p)}i.r2=c,++i.k===i.list.length&&(i.b.sx=en.x,i.b.sz=en.z,i.b.sr=Math.sqrt(c),this.jobs.shift(),this.swap(i))}let n=performance.now()-t;n>this.stats.maxSlice&&(this.stats.maxSlice=n)}collect(e){let t=e.group,n=new Map;t.traverse(i=>{let s=i;if(!s.isMesh||s.isInstancedMesh||!s.name.startsWith("bld:")||s.name==="bld:kit"||Array.isArray(s.material))return;let r=s;for(;r&&r!==t;){if(!r.matrix.equals(Rb))return;r=r.parent}let o=s.geometry;if(Object.keys(o.morphAttributes).length||o.groups.length||!o.attributes.position.count)return;o.boundingSphere||o.computeBoundingSphere();let a=s.name+"|"+s.material.uuid+"|"+Object.keys(o.attributes).sort().map(c=>c+o.attributes[c].array.constructor.name+o.attributes[c].itemSize+(o.attributes[c].normalized?"n":"")).join(",")+"|"+(o.index?1:0)+"|"+(s.castShadow?1:0)+(s.receiveShadow?1:0)+"|"+s.renderOrder+"|"+s.frustumCulled+s.visible;(n.get(a)||n.set(a,[]).get(a)).push(s)}),e.__awBB=[];for(let i of n.values()){if(i.length<2||i.length>65535)continue;let s=0,r=0;for(let f of i){let p=f.geometry;s+=p.attributes.position.count,r+=p.index?p.index.count:0}let o=i[0],a=i.length,c=new Hn(a,s,r,o.material);c.name="aw:bb:"+o.name.slice(4),c.castShadow=o.castShadow,c.receiveShadow=o.receiveShadow,c.renderOrder=o.renderOrder,c.sortObjects=!1,c.perObjectFrustumCulled=!0,c.matrixAutoUpdate=!1;let u={bm:c,kind:o.name==="bld:MeshBasicMaterial"?xd:o.name==="bld:trim"?gd:md,n:a,cx:new Float32Array(a),cy:new Float32Array(a),cz:new Float32Array(a),r:new Float32Array(a),vis:new Uint16Array(a),nVis:0,sx:0,sz:0,sr:1/0},h=new X,d=new X;i.forEach((f,p)=>{let m=f.geometry.boundingSphere;u.cx[p]=m.center.x,u.cy[p]=m.center.y,u.cz[p]=m.center.z,u.r[p]=m.radius,p?h.union(d.copy(m)):h.copy(m)}),c.boundingSphere=h,c.userData.awb=u,c.onBeforeRender=lc,this.jobs.push({R:e,list:i,i:0,b:u,box:new Ce,k:0,r2:0})}this.stats.regions++}swap(e){let{R:t,list:n,b:i}=e;t.group.add(i.bm);for(let s of n)s.removeFromParent(),s.geometry.dispose();t.__awBB.push(i),this.live.add(t),this.stats.batches++,this.stats.cells+=i.n,this.cull(i)}cullAll(){let e=0;for(let t of this.live)for(let n of t.__awBB||[])this.cull(n),e+=n.nVis;this.stats.visCells=e}cull(e){let t=this.g.real.q,n=()=>{for(let r=0;r<e.n;r++)e.vis[r]=r;e.nVis=e.n,e.bm.visible=e.n>0};if(!Number.isFinite(this.fx))return n();if(e.kind===md&&!Number.isFinite(this.shellR)){Math.hypot(e.sx-this.fx,e.sz-this.fz)-e.sr<t.bldR?n():(e.nVis=0,e.bm.visible=!1);return}let i=e.kind===xd?t.contactR:e.kind===gd?t.detailR:this.shellR,s=0;for(let r=0;r<e.n;r++)Math.hypot(e.cx[r]-this.fx,e.cz[r]-this.fz)-e.r[r]<i&&(e.vis[s++]=r);e.nVis=s,e.bm.visible=s>0}};var _o=class{constructor(e){x(this,"stats",{sb:0,drawn:0,blocks:0});x(this,"sbs",[]);let t=e.ovBlocks;if(!t||!t.length)return;let n=t[0].userData.rect[2]-t[0].userData.rect[0]||1,i=t[0].userData.rect[3]-t[0].userData.rect[1]||1,s=Math.min(...t.map(c=>c.userData.rect[0])),r=Math.min(...t.map(c=>c.userData.rect[1])),o=new Map;for(let c of t){let u=Math.floor((c.userData.rect[0]-s+1)/(n*4))+","+Math.floor((c.userData.rect[1]-r+1)/(i*4));(o.get(u)||o.set(u,[]).get(u)).push(c)}for(let c of o.values()){if(c.length<2)continue;let u=new k(c[0].geometry,c[0].material);u.name="ovTerrain:sb",u.receiveShadow=!1,u.matrixAutoUpdate=!1,u.visible=!1,e.group.add(u),this.sbs.push({kids:c,mesh:u,key:"",cache:new Map})}this.stats.sb=this.sbs.length,this.stats.blocks=t.length;let a=e.update.bind(e);e.update=(...c)=>{let u=a(...c);return this.apply(),u}}apply(){let e=0;for(let t of this.sbs){let n="",i=0;for(let r of t.kids)r.visible?(n+=r.userData.lods.indexOf(r.geometry),i++):n+="h";if(i<2){t.mesh.visible=!1;continue}let s=t.cache.get(n);if(s===void 0){if(s=_t(t.kids.filter(r=>r.visible).map(r=>r.geometry))||null,s&&s.computeBoundingSphere(),t.cache.size>=4){let[r,o]=t.cache.entries().next().value;t.cache.delete(r),o&&o!==s&&o.dispose()}t.cache.set(n,s)}else t.cache.delete(n),t.cache.set(n,s);if(!s){t.mesh.visible=!1;continue}t.mesh.geometry=s,t.mesh.visible=!0;for(let r of t.kids)r.visible=!1;e++}this.stats.drawn=e}};var yo=class{constructor(e){x(this,"real",e);x(this,"stats",{merged:0,chunks:0});x(this,"n",0);x(this,"live",new Set);let t=e.update.bind(e);e.update=(...n)=>{let i=t(...n);return this.apply(),i}}apply(){let e=(++this.n&7)===0,t=0,n=0,i=1;for(let s of this.real.regions.values()){let r=s.chunks,o=s.__awTM,a=!!r&&r.length>1&&!!s.group;if(a){for(let u of r)if(!u.mesh||u.step!==16||u.pending){a=!1;break}}if(!a){if(o&&(o.mesh.removeFromParent(),o.mesh.geometry.dispose(),s.__awTM=void 0,r))for(let u of r)u.mesh&&(u.mesh.visible=!0);continue}let c="";for(let u of r)c+=u.mesh.geometry.id+",";if(!o||o.key!==c){if(!e||i<=0){if(o){for(let h of r)h.mesh.visible=!0;o.mesh.visible=!1}continue}i--;let u=_t(r.map(h=>h.mesh.geometry));if(!u)continue;if(u.computeBoundingSphere(),o)o.mesh.geometry.dispose(),o.mesh.geometry=u,o.key=c;else{let h=new k(u,r[0].mesh.material);h.name="terrain16:m",h.receiveShadow=!0,h.matrixAutoUpdate=!1,s.group.add(h),s.__awTM={key:c,mesh:h},this.live.add(s)}}s.__awTM.mesh.visible=!0;for(let u of r)u.mesh.visible=!1;t++,n+=r.length}if(e)for(let s of this.live){let r=s.__awTM,o=!1;for(let a of this.real.regions.values())if(a===s){o=!0;break}(!o||!r)&&(r&&(r.mesh.removeFromParent(),r.mesh.geometry.dispose(),s.__awTM=void 0),this.live.delete(s))}this.stats.merged=t,this.stats.chunks=n}};var cc={value:500};function bd(l,e=1.6){return new vt({uniforms:{uI:l,uNight:Oe,uScale:cc,uMinPx:{value:e}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:Kn,fog:!1,toneMapped:!1})}function Mo(l,e,t=!1){return new vt({uniforms:{uI:e,uC:{value:new L(l)}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:Kn,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,fog:!1,toneMapped:!1})}var vd=-2.4,_d=8.87,yd=new F,Cb=new Z,Ib=new M(15,1,15),Md=new M,wo=class{constructor(e){x(this,"g");x(this,"points");x(this,"pools");x(this,"dotI",{value:0});x(this,"poolI",{value:0});x(this,"lists",[]);x(this,"bulbs",new Float32Array(0));x(this,"nBulbs",0);x(this,"t",0);x(this,"nPools");this.g=e;let t=new re;t.setAttribute("position",new ie(new Float32Array(3),3)),this.points=new bt(t,bd(this.dotI)),this.points.frustumCulled=!1,this.points.name="aw:lampGlow",this.points.renderOrder=5;let n=e.real?.q?.name??"med";this.nPools=n==="low"?14:n==="med"?24:32;let i=new qt(1,1).rotateX(-Math.PI/2);this.pools=new q(i,Mo(16758886,this.poolI),this.nPools),this.pools.frustumCulled=!1,this.pools.count=0,this.pools.name="aw:lampPools",e.scene.add(this.points,this.pools)}rebuild(){let t=this.g.real.veg.lists?.l;if(!t||t.length===this.lists.length&&t.every((c,u)=>c===this.lists[u]))return;this.lists=t.slice();let n=0;for(let c of t)n+=c.length;let i=new Float32Array(n*3),s=new Float32Array(n*3),r=new Float32Array(n),o=0;for(let c of t)for(let[u,h,d,f,p]of c){let m=Math.cos(p),g=Math.sin(p);i[o*3]=u+vd*m*f,i[o*3+1]=h+_d*f-.12,i[o*3+2]=d-vd*g*f,s[o*3]=1,s[o*3+1]=.74,s[o*3+2]=.42,r[o]=1.9,o++}let a=new re;a.setAttribute("position",new ie(i,3)),a.setAttribute("color",new ie(s,3)),a.setAttribute("size",new ie(r,1)),this.points.geometry.dispose(),this.points.geometry=a,this.bulbs=i,this.nBulbs=n}update(e){let t=Oe.value,n=Math.max(0,Math.min(1,(t-.3)/.45));if(this.dotI.value=.95*n,this.poolI.value=.34*n,this.points.visible=this.pools.visible=n>.001,this.t-=e,this.t>0)return;this.t=.5,this.rebuild();let i=this.g.camera;if(cc.value=this.g.renderer.domElement.height/2/Math.tan(i.fov*Math.PI/180/2),!this.points.visible)return;let s=i.position.x,r=i.position.z,o=[],a=this.bulbs;for(let u=0;u<this.nBulbs;u++){let h=a[u*3]-s,d=a[u*3+2]-r,f=h*h+d*d;f<25600&&o.push([f,u])}o.sort((u,h)=>u[0]-h[0]);let c=Math.min(this.nPools,o.length);for(let u=0;u<c;u++){let h=o[u][1],d=a[h*3],f=a[h*3+2],p=this.g.real&&this.g.real.heightAt,m=p?p(d,f):a[h*3+1]-_d;Md.set(d,m+.3,f),yd.compose(Md,Cb,Ib),this.pools.setMatrixAt(u,yd)}this.pools.count=c,this.pools.instanceMatrix.needsUpdate=!0}};var So=[16052712,2106667,12106945,9377825,1526392,14145746,5003845,11823922,7038077,14927177,7554357,4093819],Pb=new L(16773590),Lb=new L(16719888),Db=l=>!!l.rb,Ao=class{constructor(e){x(this,"g",e);x(this,"stats",{pooled:0,visible:0,yielding:0,avoiding:0,batches:0,beamDraws:0,quality:""});x(this,"amb",null);x(this,"states",[]);x(this,"batches",[]);x(this,"stateByCar",new WeakMap);x(this,"matrix",new F);x(this,"zero",new F().makeScale(0,0,0));x(this,"paint",new L);x(this,"beamI",{value:0});x(this,"beamMat",Mo(16773328,this.beamI,!0));x(this,"beams",null)}start(){let e=this.g.real.amb;if(!e?.kit?.car?.[0])return!1;this.amb=e;let t=this.g.real.q.name,n=t==="low"?5:t==="med"?10:15,i=t==="low"?[0,1,2]:t==="med"?[0,1,2,4]:[0,1,2,3,4];for(this.stats.quality=t;e.cars.length<n;){let r=e.cars.length,o=i[r%i.length],a=this.paint.setHex(So[(r*5+3)%So.length]),c=e.carMesh(o,a);c.visible=!1,e.group.add(c),e.cars.push({g:c,v:o,rd:null,L:0,dir:1,s:0,sp:0})}e.nCar=n;for(let r=0;r<5;r++)this.batches.push({cars:[],parts:[]});for(let r=0;r<e.cars.length;r++){let o=e.cars[r],a=Math.max(0,Math.min(4,o.v|0)),c=e.kit.car[0][a].paint,u=new L(So[r%So.length]);for(let d of o.g.children){let f=d,p=f.material;if(f.isMesh&&f.geometry===c&&p.color){u=p.color.clone();break}}let h={car:o,base:o.g.children.slice(),color:u,batchIndex:this.batches[a].cars.length,rd:null,cruise:11,yieldPhase:0,yieldTime:0,yieldsAtEnd:!1};this.batches[a].cars.push(h),this.states.push(h),this.stateByCar.set(o,h);for(let d of h.base)d.visible=!1}for(let r=0;r<5;r++)this.makeBatch(r,e.kit.car[0][r]);let s=new qt(4.4,16).rotateX(-Math.PI/2).rotateY(Math.PI).translate(0,.11,10);return this.beams=new q(s,this.beamMat,n),this.beams.name="aw:traffic:beams",this.beams.frustumCulled=!1,this.beams.instanceMatrix.setUsage(ct),this.beams.count=0,e.group.add(this.beams),this.stats.pooled=this.states.length,!0}makeBatch(e,t){let n=this.amb,i=this.batches[e],s=i.cars.length;if(s)for(let r of Object.keys(t)){let o=n.mats[r];if(!o)continue;let a=o.clone();r==="paint"&&a.color&&a.color.setHex(16777215);let c=new q(t[r],a,s);if(c.name=`aw:traffic:${e}:${r}`,c.frustumCulled=!1,c.castShadow=this.g.real.q.name!=="low"&&r==="paint",c.instanceMatrix.setUsage(ct),r==="paint"){for(let u=0;u<s;u++)c.setColorAt(u,i.cars[u].color);c.instanceColor&&(c.instanceColor.needsUpdate=!0)}i.parts.push({mesh:c,mat:a,name:r}),n.group.add(c),this.stats.batches++}}routeChanged(e){let t=e.car;if(e.rd=t.rd,e.cruise=t.v===4?9:11+(e.batchIndex*7+t.v*3)%4,e.yieldPhase=0,e.yieldTime=0,e.yieldsAtEnd=!1,!t.rd||t.rd.rb)return;let n=t.rd.p,i=t.dir>0?n[n.length-1]:n[0];e.yieldsAtEnd=this.amb.pick(i[0],i[1],Db,18).length>0}applyAI(e){let t=this.amb,n=this.g.S.mode,i=n==="walk"?this.g.S.walk:this.g.S.car,s=n!=="plane",r=0,o=0;for(let a=0;a<t.cars.length;a++){let c=t.cars[a],u=this.stateByCar.get(c);if(!u||(c.rd!==u.rd&&this.routeChanged(u),!c.rd))continue;let h=u.cruise;if(c.rd.rb&&(h=Math.min(h,6.5)),u.yieldsAtEnd&&u.yieldPhase<2){let f=c.dir>0?c.L-c.s:c.s;f<22&&(h=Math.min(h,Math.max(0,(f-4.5)*.75))),f<6&&u.yieldPhase===0&&(u.yieldPhase=1,u.yieldTime=.7+(u.batchIndex*13+c.v*5)%8*.1),u.yieldPhase===1&&(h=0,c.sp<.7&&(u.yieldTime-=e)<=0&&(u.yieldPhase=2)),r++}if(s){let f=c.g.position.x-i.x,p=c.g.position.z-i.z,m=f*f+p*p;m<324&&(h=Math.min(h,Math.max(0,(Math.sqrt(m)-5)*.8)),o++)}for(let f=0;f<t.cars.length;f++){if(a===f)continue;let p=t.cars[f];if(p.rd!==c.rd||p.dir!==c.dir)continue;let m=c.dir*(p.s-c.s);m>0&&m<20&&(h=Math.min(h,Math.max(0,(m-5)*.85)))}let d=h-c.sp;c.sp+=Math.max(-8*e,Math.min(2.4*e,d)),c.sp<.001&&(c.sp=.001)}this.stats.yielding=r,this.stats.avoiding=o}isSpecial(e){let t=!1;for(let n of e.car.g.children){if(n.name.startsWith("aw:ev"))return 2;(n.name==="aw:ebar"||n.name==="aw:estripe")&&n.visible&&(t=!0)}return t?1:0}renderInstances(){let e=0,t=0,n=Math.max(0,Math.min(1,(Oe.value-.3)/.4));this.beamI.value=.42*n;for(let i of this.batches){for(let s of i.cars){let r=s.car,o=this.isSpecial(s);for(let c of s.base)c.visible=o===1&&r.g.visible;let a=!!r.rd&&r.g.visible&&o===0;a?(this.matrix.compose(r.g.position,r.g.quaternion,r.g.scale),e++):this.matrix.copy(this.zero);for(let c of i.parts)c.mesh.setMatrixAt(s.batchIndex,this.matrix);a&&n>.001&&this.beams&&this.beams.setMatrixAt(t++,this.matrix)}for(let s of i.parts)s.mesh.instanceMatrix.needsUpdate=!0,s.name==="light"&&s.mat.emissive?(s.mat.emissive.copy(Pb),s.mat.emissiveIntensity=1+n*5):s.name==="tail"&&s.mat.emissive&&(s.mat.emissive.copy(Lb),s.mat.emissiveIntensity=1+n*3)}this.beams&&(this.beams.count=t,this.beams.visible=t>0,t&&(this.beams.instanceMatrix.needsUpdate=!0)),this.stats.visible=e,this.stats.beamDraws=t?1:0}update(e){if(!this.amb&&!this.start())return;let t=Math.min(.1,e);this.applyAI(t),this.renderInstances()}};var wd=[15293275,4034507,15845451,5089640,15303603,15174469,7560626],Sd=[2503749,5588277,14275783,3361897,3224376],Ad=[7290667,9590843,12155220,13998706,15581854],Nb=new M(1,0,0),To=class{constructor(e){x(this,"g",e);x(this,"stats",{pooled:0,visible:0,draws:0,triangles:0,corridors:0});x(this,"amb",null);x(this,"walkers",[]);x(this,"routes",[]);x(this,"group",new _e);x(this,"head");x(this,"torso");x(this,"legs");x(this,"arms");x(this,"meshes");x(this,"root",new F);x(this,"local",new F);x(this,"world",new F);x(this,"pos",new M);x(this,"scale",new M);x(this,"quat",new Z);x(this,"tint",new L);x(this,"scanIn",0);x(this,"lod2");let t=e.real.q.name,n=t==="low"?18:t==="med"?32:48,i=t==="low"?190:250;this.lod2=i*i,this.group.name="aw:pedestrians";let s=new lt({color:16777215}),r=new lt({color:16777215}),o=new lt({color:16777215});this.head=this.mesh(new ke(1,6,4),s,n,"heads"),this.torso=this.mesh(new ze(1,1,1),r,n,"torsos"),this.legs=this.mesh(new ze(1,1,1),o,n*2,"legs"),this.arms=this.mesh(new ze(1,1,1),s,n*2,"arms"),this.meshes=[this.head,this.torso,this.legs,this.arms],this.group.add(this.head,this.torso,this.legs,this.arms),e.scene.add(this.group);for(let a=0;a<n;a++)this.walkers.push({road:null,length:0,s:0,dir:a&1?1:-1,side:a&2?1:-1,speed:1.05+a%6*.09,phase:a*2.399963%(Math.PI*2),x:0,y:0,z:0,yaw:0,skin:Ad[a*3%Ad.length],top:wd[a*5%wd.length],bottom:Sd[a*7%Sd.length]});this.stats.pooled=n}mesh(e,t,n,i){let s=new q(e,t,n);return s.name=`aw:pedestrians:${i}`,s.instanceMatrix.setUsage(ct),s.frustumCulled=!1,s.castShadow=this.g.real.q.name!=="low",s.count=0,s}roadLength(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}inCorridor(e){let t=e.n==="Caya G.F. Betico Croes",n=e.n==="J.E. Irausquin Boulevard";if(!t&&!n)return!1;for(let i=0;i<e.p.length;i++){let s=e.p[i][0],r=e.p[i][1];if(t&&s>-7550&&s<-6450&&Math.abs(r)<350)return!0;let o=s+8220,a=r+5750;if(n&&o*o+a*a<1450*1450)return!0}return!1}scanRoutes(){let e=this.amb;this.routes=[];let t=new Set;for(let n of e.w.regions.values()){let i=n.json?.roads;if(i)for(let s of i){let r=`${s.n}:${s.id}`;s.u||s.p.length<2||t.has(r)||!this.inCorridor(s)||(t.add(r),this.routes.push(s))}}if(this.stats.corridors=this.routes.length,!!this.routes.length)for(let n=0;n<this.walkers.length;n++){let i=this.walkers[n];if(i.road&&this.routes.includes(i.road))continue;let s=this.routes[n%this.routes.length];i.road=s,i.length=this.roadLength(s),i.s=i.length*(n*.61803398875%1*.9+.05),i.side=(n&1?1:-1)*(s.w*.5+1.45)}}sample(e){let t=e.road;if(!t)return!1;let n=0;for(let i=1;i<t.p.length;i++){let s=t.p[i-1][0],r=t.p[i-1][1],o=t.p[i][0]-s,a=t.p[i][1]-r,c=Math.hypot(o,a)||1;if(n+c>=e.s||i===t.p.length-1){let u=Math.max(0,Math.min(1,(e.s-n)/c)),h=o/c,d=a/c;return e.x=s+o*u-d*e.side,e.z=r+a*u+h*e.side,e.y=this.amb.w.surfaceAt(e.x,e.z)+.02,e.yaw=e.dir>0?Math.atan2(h,d):Math.atan2(-h,-d),!0}n+=c}return!1}put(e,t,n,i,s,r,o,a,c){this.pos.set(n,i,s),this.quat.setFromAxisAngle(Nb,r),this.scale.set(o,a,c),this.local.compose(this.pos,this.quat,this.scale),this.world.multiplyMatrices(this.root,this.local),e.setMatrixAt(t,this.world)}drawWalker(e,t,n){let i=Math.sin(n*7.2+e.phase),s=Math.abs(i)*.025;this.root.makeRotationY(e.yaw),this.root.setPosition(e.x,e.y+s,e.z),this.put(this.head,t,0,1.77,0,0,.18,.2,.18),this.put(this.torso,t,0,1.29,0,0,.34,.52,.22),this.put(this.legs,t*2,-.14,.64,i*.08,i*.45,.11,.62,.13),this.put(this.legs,t*2+1,.14,.64,-i*.08,-i*.45,.11,.62,.13),this.put(this.arms,t*2,-.43,1.26,0,-i*.5,.08,.48,.09),this.put(this.arms,t*2+1,.43,1.26,0,i*.5,.08,.48,.09),this.head.setColorAt(t,this.tint.setHex(e.skin)),this.torso.setColorAt(t,this.tint.setHex(e.top)),this.legs.setColorAt(t*2,this.tint.setHex(e.bottom)),this.legs.setColorAt(t*2+1,this.tint),this.arms.setColorAt(t*2,this.tint.setHex(e.skin)),this.arms.setColorAt(t*2+1,this.tint)}update(e,t){if(!this.amb){let s=this.g.real.amb;if(!s)return;this.amb=s,this.scanRoutes()}for(;this.amb.peds.length;){let s=this.amb.peds.pop();s.g.visible=!1,s.g.parent?.remove(s.g)}(this.scanIn-=e)<=0&&(this.scanIn=2,this.scanRoutes());let n=this.g.camera.position,i=0;for(let s of this.walkers){if(!s.road||s.length<=0||(s.s+=s.dir*s.speed*e,s.s>=s.length?(s.s=s.length,s.dir=-1):s.s<=0&&(s.s=0,s.dir=1),!this.sample(s)))continue;let r=s.x-n.x,o=s.z-n.z;r*r+o*o>this.lod2||this.drawWalker(s,i++,t)}this.head.count=i,this.torso.count=i,this.legs.count=i*2,this.arms.count=i*2;for(let s of this.meshes)s.count&&(s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0)),s.visible=s.count>0;this.stats.visible=i,this.stats.draws=i?4:0,this.stats.triangles=i*96}};var Eo={up:[10,18,27,37,48],down:[0,7,14,22,31],idle:820,red:6400,launch:2e3},Ro={up:[11,20,30,39,48,55],down:[0,8,16,25,34,43],idle:1400,red:12400,launch:3400};function Co(l){return l==="car"?32:50}function uc(l,e){return Math.max(8,Math.floor(l*2/Co(e)))}function hc(l,e,t,n,i,s){let r=e<0?-e:e,o=l.gear,a=0,c=i.up.length-1;o<c&&r>i.up[o]?(o+=1,a=1):o>0&&r<i.down[o]&&(o-=1,a=-1),l.gear=o;let u=i.down[o],d=i.up[o]-u||1,f=(r-u)/d;f<0?f=0:f>1&&(f=1);let p=i.idle+f*(i.red-i.idle);if(p+=t*(1-f*.65)*(i.red-i.idle)*.2,r<.8){let b=Math.sin(s*3.1)*12+Math.sin(s*5.4)*7;p=i.idle+t*i.launch+(t<.12?b:0)}f>.96&&t>.75&&(p-=Math.abs(Math.sin(s*46))*(i.red*.018)),p>i.red&&(p=i.red),p<i.idle*.92&&(p=i.idle*.92),a===1?l.rpm*=.68:a===-1&&(l.rpm=Math.min(i.red,l.rpm*1.18+180)),l.shift=a!==0?.16:l.shift>n?l.shift-n:0;let m=l.shift>0?15:t>.4?8.5:3.4,g=n>0?1-Math.exp(-m*n):0;return l.rpm+=(p-l.rpm)*g,a}function Ob(l){return l%=1,l<0?l+1:l}function Fi(l,e,t){let n=Ob(l-e);n>.5&&(n=1-n);let i=t*.2;return n<i?i>0?n/i:1:Math.exp(-(n-i)/t)}function Fb(l,e){let t=e?.032:.068,n=Fi(l,0,t),i=Fi(l,.5,t*1.08),s=l*Math.PI*2,r=e?1:0,o=Math.sin(s)*.2+Math.sin(s*2)*.3+Math.sin(s*3)*(.05+r*.12)+Math.sin(s*4)*(.045+r*.1)+Math.sin(s*5)*r*.06+Math.sin(s*6)*r*.04;return Math.tanh(((n+i*.9)*(e?.82:.68)+o)*1.12)}function Ub(l,e){let t=e?.02:.038,n=Fi(l,.02,t),i=Fi(l,.16,t*.92),s=Fi(l,.56,t*1.15)*.7,r=Fi(l,.71,t)*.58,o=l*Math.PI*2,a=e?1:0,c=Math.sin(o)*.14+Math.sin(o*2)*.2+Math.sin(o*3+.45)*(.06+a*.12)+Math.sin(o*4.5)*(.025+a*.08)+Math.sin(o*6)*a*.05+Math.sin(o*8)*a*.028;return Math.tanh(((n+i+s+r)*(e?.78:.64)+c)*1.2)}function Td(l,e,t,n){let i=n.length,s=t?e==="car"?2500:3e3:e==="car"?820:980,r=1-Math.exp(-2*Math.PI*s/l),o=0,a=0,c=0,u=0,h=0;for(let f=0;f<2;f++)for(let p=0;p<i;p++){let m=p/i*2%1,g=e==="car"?Fb(m,t):Ub(m,t);if(o+=(g-o)*r,a+=(o-a)*r,c+=(a-c)*r,u+=(c-u)*r,f===1){n[p]=u;let b=u<0?-u:u;b>h&&(h=b)}}let d=h>1e-5?.56/h:0;for(let f=0;f<i;f++)n[f]*=d}var Bb=.5,Ed=180,Io=class{constructor(e){x(this,"g",e);x(this,"stats",{started:!1,muted:!1,mode:"car",trafficVoices:0,nodes:0,gear:0,rpm:0,throttle:0,police:0,ambulance:0,impacts:0,turbo:0,level:0});x(this,"audio",null);x(this,"muted",!1);x(this,"quick");x(this,"setting",null);x(this,"keyFwd",!1);x(this,"keyBrk",!1);x(this,"prevT",0);x(this,"prevWall",0);x(this,"arm",.4);x(this,"masterLin",0);x(this,"carDrive",{gear:0,rpm:Eo.idle,shift:0});x(this,"motoDrive",{gear:0,rpm:Ro.idle,shift:0});x(this,"carThr",0);x(this,"motoThr",0);x(this,"overrun",0);x(this,"prevPhase",-1);x(this,"turboWas",!1);x(this,"turboLin",0);x(this,"policeLin",0);x(this,"ambLin",0);x(this,"crashRoot",null);x(this,"waveBase",.012);x(this,"heardMode","");x(this,"policeD",-1);x(this,"policeX",0);x(this,"policeZ",0);x(this,"ambD",-1);x(this,"ambX",0);x(this,"ambZ",0);x(this,"speed",0);x(this,"wx",0);x(this,"wz",0);try{this.muted=localStorage.getItem("aw_muted")==="1"}catch{}this.stats.muted=this.muted,this.quick=document.createElement("button"),this.quick.id="awmutebtn",this.quick.type="button",this.quick.setAttribute("aria-label","Mute game audio");let t=document.createElement("style");t.textContent="#awmutebtn{position:fixed;z-index:50;left:12px;top:calc(96px + env(safe-area-inset-top));width:42px;height:42px;border:2px solid #ffffff73;border-radius:50%;background:#0009;color:#fff;font:20px system-ui;display:grid;place-items:center;padding:0}",document.head.appendChild(t),this.quick.onclick=n=>{n.stopPropagation(),this.toggle()},document.body.appendChild(this.quick),this.syncButtons(),this.mountSetting(0),this.mountCredit(0),addEventListener("pointerdown",()=>{this.muted||this.start()},{once:!0}),addEventListener("keydown",n=>this.onKey(n,!0)),addEventListener("keyup",n=>this.onKey(n,!1)),addEventListener("blur",()=>{this.keyFwd=!1,this.keyBrk=!1})}onKey(e,t){if(e.target instanceof HTMLInputElement)return;let n=e.code==="KeyW"||e.code==="ArrowUp",i=e.code==="Space"||e.code==="KeyS"||e.code==="ArrowDown";n&&(this.keyFwd=t),i&&(this.keyBrk=t),t&&!this.muted&&this.start()}throttle(){let e=this.g.held,t=this.g.joy;if(e?.brake||this.keyBrk)return 0;let n=e?.gas||this.keyFwd?1:0,i=t?.y||0,s=i<0?i<-1?1:-i:0;return s>n?s:n}write(e,t,n,i){return Math.abs(t-n)<i?t:(e.value=n,n)}approach(e,t,n,i){return n<=0?e:e+(t-e)*(1-Math.exp(-i*n))}noiseBuffer(e){let t=Math.floor(e.sampleRate*2),n=e.createBuffer(1,t,e.sampleRate),i=n.getChannelData(0),s=305419896;for(let r=0;r<t;r++)s=Math.imul(s,1664525)+1013904223|0,i[r]=((s>>>8)/8388607-1)*.7;return n}cycleBuffer(e,t,n,i){let s=uc(e.sampleRate,t),r=e.createBuffer(1,s,e.sampleRate);return Td(e.sampleRate,t,n,i.subarray(0,s)),r.getChannelData(0).set(i.subarray(0,s)),r}loop(e,t){let n=e.createBufferSource();return n.buffer=t,n.loop=!0,n.start(),n}tone(e,t,n){let i=e.createOscillator(),s=e.createGain();return i.type=t,i.frequency.value=n,s.gain.value=0,i.connect(s),i.start(),{osc:i,gain:s,hz:n,amp:0}}tap(e,t,n,i){let s=e.createBiquadFilter(),r=e.createGain();return s.type=n,s.frequency.value=i,s.Q.value=.7,r.gain.value=0,t.connect(s),s.connect(r),{filter:s,gain:r,f:i,amp:0}}voice(e,t,n,i,s){let r=this.loop(e,this.cycleBuffer(e,n,!1,i)),o=this.loop(e,this.cycleBuffer(e,n,!0,i)),a=e.createOscillator();a.type="sine",a.frequency.value=40,a.start();let c=e.createGain(),u=e.createGain(),h=e.createGain(),d=e.createBiquadFilter(),f=e.createGain();c.gain.value=.7,u.gain.value=0,h.gain.value=0,f.gain.value=0,d.type="lowpass",d.frequency.value=500,d.Q.value=.45,r.connect(c).connect(d),o.connect(u).connect(d),d.connect(s).connect(f),a.connect(h).connect(f);let p=this.tap(e,t,"bandpass",240);p.gain.connect(f);let m=(Co(n)>0,1);return r.playbackRate.value=m,o.playbackRate.value=m,{body:r,edge:o,sub:a,bodyGain:c,edgeGain:u,subGain:h,noiseFilter:p.filter,noiseGain:p.gain,filter:d,out:f,rate:m,bg:.7,eg:0,sg:0,ng:0,nf:240,ff:500,og:0,hz:40,level:0}}shape(e){let t=e.createWaveShaper(),n=new Float32Array(256),i=1.25,s=Math.tanh(i);for(let r=0;r<256;r++){let o=r/255*2-1;n[r]=Math.tanh(o*i)/s}return t.curve=n,t.oversample="none",t}start(){if(this.audio){this.audio.ctx.resume();return}try{let e=new AudioContext,t=e.createGain(),n=e.createDynamicsCompressor();n.threshold.value=-16,n.knee.value=18,n.ratio.value=3.5,n.attack.value=.012,n.release.value=.28,t.gain.value=0,t.connect(n).connect(e.destination);let i=this.loop(e,this.noiseBuffer(e)),s=new Float32Array(uc(e.sampleRate,"car")),r=this.voice(e,i,"car",s,this.shape(e)),o=this.voice(e,i,"moto",s,this.shape(e));r.out.connect(t),o.out.connect(t);let a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=160;let c=e.createGain();c.gain.value=0,i.connect(a).connect(c).connect(t);let u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=640,u.Q.value=.5;let h=e.createGain();h.gain.value=0;let d=e.createGain();d.gain.value=0;let f=this.tone(e,"sine",78);i.connect(u).connect(h).connect(d),f.gain.connect(d),d.connect(t);let p=this.tap(e,i,"lowpass",180);p.filter.Q.value=.4,p.gain.connect(t);let m=this.tap(e,i,"bandpass",1100);m.filter.Q.value=.8,m.gain.connect(t);let g=this.tone(e,"sine",38),b=this.tone(e,"sine",55);g.gain.connect(t),b.gain.connect(t);let v=e.createBiquadFilter();v.type="bandpass",v.frequency.value=300,v.Q.value=.65;let y=e.createGain();y.gain.value=0,i.connect(v).connect(y).connect(t);let _=e.createStereoPanner(),S=e.createGain();S.gain.value=0;let E=e.createBiquadFilter();E.type="lowpass",E.frequency.value=1700,E.Q.value=.5;let C=this.tone(e,"sine",700),T=this.tone(e,"sine",1050);C.gain.connect(E),T.gain.connect(E),E.connect(_).connect(S).connect(t);let R=e.createStereoPanner(),P=e.createGain();P.gain.value=0;let I=e.createBiquadFilter();I.type="lowpass",I.frequency.value=1600,I.Q.value=.5;let D=this.tone(e,"sine",680),N=this.tone(e,"sine",940);D.gain.connect(I),N.gain.connect(I),I.connect(R).connect(P).connect(t);let O=e.createOscillator();O.type="sine",O.frequency.value=80;let U=e.createGain();U.gain.value=0,O.connect(U).connect(t),O.start();let V=this.tap(e,i,"lowpass",420);V.filter.Q.value=.4,V.gain.connect(t);let K=this.tap(e,i,"bandpass",1500);K.filter.Q.value=.6,K.gain.connect(t);let Y=this.tap(e,i,"bandpass",1600);Y.gain.connect(t);let ee=this.tap(e,i,"lowpass",680);ee.gain.connect(t);let Q=this.tap(e,i,"bandpass",1e3);Q.gain.connect(t);let ne=e.createOscillator(),fe=e.createGain();ne.frequency.value=.12,fe.gain.value=.004,ne.connect(fe).connect(ee.gain.gain),ne.start(),this.audio={ctx:e,master:t,noise:i,car:r,moto:o,clunk:c,planeFilter:u,planeNoise:h,planeTone:f,planeOut:d,roar:p,crackle:m,sub:g,sub2:b,whooshFilter:v,whoosh:y,police:C,police2:T,policePan:_,policeOut:S,amb:D,amb2:N,ambPan:R,ambOut:P,thump:O,thumpGain:U,crunch:V,metal:K,skid:Y,waves:ee,city:Q},this.stats.started=!0,this.stats.nodes=48,this.stats.trafficVoices=0,e.resume()}catch(e){console.warn("[aw-audio] WebAudio unavailable",e)}}toggle(){this.muted=!this.muted,this.stats.muted=this.muted;try{localStorage.setItem("aw_muted",this.muted?"1":"0")}catch{}this.muted||this.start(),this.syncButtons()}syncButtons(){this.quick.textContent=this.muted?"\u{1F507}":"\u{1F50A}",this.quick.title=this.muted?"Unmute audio":"Mute audio",this.setting&&(this.setting.textContent=this.muted?"Sound: OFF":"Sound: ON")}mountSetting(e){let t=document.getElementById("awtime");if(!t){e<60&&setTimeout(()=>this.mountSetting(e+1),500);return}let n=document.createElement("div");n.className="lbl",n.textContent="World audio";let i=document.createElement("div");i.className="row";let s=document.createElement("button");s.type="button",s.onclick=()=>this.toggle(),i.appendChild(s),t.append(n,i),this.setting=s,this.syncButtons()}mountCredit(e){let t=document.querySelector("#credits ul");if(!t){e<40&&setTimeout(()=>this.mountCredit(e+1),500);return}if(t.querySelector(".aw-audio"))return;let n=document.createElement("li");n.className="aw-audio",n.innerHTML='Engines, sirens, crash impact and turbo: original procedural synthesis (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 1.0</a>, no third-party samples)',t.appendChild(n)}clunkAt(e){let t=this.audio;if(!t)return;let n=t.clunk.gain;n.cancelScheduledValues(e),n.setValueAtTime(1e-4,e),n.exponentialRampToValueAtTime(.04,e+.01),n.exponentialRampToValueAtTime(1e-4,e+.07)}boom(e,t){let n=this.audio;if(!n)return;let i=t>420?0:1-t/420,s=i*i;if(s<.05)return;let r=n.thump.frequency,o=n.thumpGain.gain;r.cancelScheduledValues(e),r.setValueAtTime(130,e),r.exponentialRampToValueAtTime(34,e+.34),o.cancelScheduledValues(e),o.setValueAtTime(1e-4,e),o.exponentialRampToValueAtTime(.15*s,e+.016),o.exponentialRampToValueAtTime(1e-4,e+.48);let a=n.crunch.gain.gain;a.cancelScheduledValues(e),a.setValueAtTime(1e-4,e),a.exponentialRampToValueAtTime(.08*s,e+.012),a.exponentialRampToValueAtTime(1e-4,e+.4);let c=n.metal.gain.gain;c.cancelScheduledValues(e),c.setValueAtTime(1e-4,e),c.exponentialRampToValueAtTime(.03*s,e+.008),c.exponentialRampToValueAtTime(1e-4,e+.13),this.stats.impacts+=1}whoosh(e){let t=this.audio;if(!t)return;let n=t.whooshFilter.frequency,i=t.whoosh.gain;n.cancelScheduledValues(e),n.setValueAtTime(150,e),n.exponentialRampToValueAtTime(1700,e+.38),n.exponentialRampToValueAtTime(380,e+.85),i.cancelScheduledValues(e),i.setValueAtTime(1e-4,e),i.exponentialRampToValueAtTime(.05,e+.07),i.exponentialRampToValueAtTime(1e-4,e+.9)}silence(e,t){e.level=this.approach(e.level,0,t,10),e.og=this.write(e.out.gain,e.og,e.level,.003),e.eg=this.write(e.edgeGain.gain,e.eg,this.approach(e.eg,0,t,8),.005),e.ng=this.write(e.noiseGain.gain,e.ng,this.approach(e.ng,0,t,8),.003)}snap(e,t,n){for(let i=0;i<8;i++)hc(e,this.speed,0,.08,t,n);e.shift=0}engine(e,t,n,i,s,r,o){let a=hc(n,this.speed,s,o,i,r);this.arm<=0&&a===1&&this.clunkAt(r);let c=n.rpm/60/Co(e);n.rpm<i.idle*1.25&&s<.15&&(c*=1+.012*Math.sin(r*2.6)+.007*Math.sin(r*5.2)),c<.1?c=.1:c>6&&(c=6),Math.abs(t.rate-c)>=.004&&(t.body.playbackRate.value=c,t.edge.playbackRate.value=c,t.rate=c);let u=(n.rpm-i.idle)/(i.red-i.idle),h=u<0?0:u>1?1:u,d=e==="moto"?2300:1850,f=(e==="moto"?480:400)+h*(e==="moto"?1100:800)+s*(e==="moto"?700:550);f>d&&(f=d),t.ff=this.write(t.filter.frequency,t.ff,f,8);let p=n.rpm/30;t.hz=this.write(t.sub.frequency,t.hz,p<28?28:p,.6),t.bg=this.write(t.bodyGain.gain,t.bg,.62,.01),t.eg=this.write(t.edgeGain.gain,t.eg,s*.42+h*s*.16,.008),t.sg=this.write(t.subGain.gain,t.sg,.05+h*.04+s*.02,.004);let m=.008+s*.02+h*.006;if(e==="moto"&&this.overrun>0){let v=Math.sin(r*53)*Math.sin(r*19);m+=(v>0?v*v*v*v:0)*.03*(this.overrun>.25?1:this.overrun*4)}t.ng=this.write(t.noiseGain.gain,t.ng,m,.002),t.nf=this.write(t.noiseFilter.frequency,t.nf,160+h*640+s*380,12);let g=.15+s*.07+h*.035;n.shift>.1&&(g*=.74);let b=e==="moto"?.24:.26;return g>b&&(g=b),t.level=this.approach(t.level,g,o,9),t.og=this.write(t.out.gain,t.og,t.level,.003),t.level}responders(e,t,n,i,s,r){if(this.policeD=-1,this.ambD=-1,n&&i>=1){let o=this.g.real?.amb,a=o?.group?.children;if(a){let c=this.crashRoot;if(!c||c.parent==null){c=null;for(let h=0;h<a.length;h++)a[h].name==="aw:crash"&&(c=a[h]);this.crashRoot=c}if(c){let h=c.children;for(let d=0;d<h.length;d++){let f=h[d].name;if(f==="aw:ev:everest"||f==="aw:ev:isuzu"){this.place(h[d]),this.policeX=this.wx,this.policeZ=this.wz,this.policeD=Math.hypot(this.policeX-e,this.policeZ-t);break}}}if(this.policeD<0){let h=window.__aw?.emerg?.ext;h&&(this.policeD=h.d,this.policeX=e,this.policeZ=t)}let u=o?.cars;if(u){let h=1e9,d=Math.hypot(s-e,r-t)<420;for(let f=0;f<u.length;f++){let p=u[f];if(!p.g.visible)continue;let m=p.g.children,g=!1;for(let S=0;S<m.length;S++){let E=m[S].name;if(E==="aw:ev:ambY"||E==="aw:ev:ambP"){g=!0;break}}if(!g)continue;this.place(p.g);let b=this.wx,v=this.wz,y=Math.hypot(b-s,v-r),_=Math.hypot(b-e,v-t);y>260&&!(d&&_<130)||_<h&&(h=_,this.ambX=b,this.ambZ=v,this.ambD=_)}}}}else this.crashRoot=null}place(e){let t=0,n=0,i=e;for(;i;)t+=i.position.x,n+=i.position.z,i=i.parent;this.wx=t,this.wz=n}atten(e){if(e<0||e>Ed)return 0;let t=1-e/Ed;return t*t*.04}update(){let e=this.audio;if(!e)return;let t=e.ctx.currentTime,n=performance.now()*.001,i=this.prevT>0?t-this.prevT:0,s=this.prevWall>0?n-this.prevWall:.016;this.prevT=t,this.prevWall=n;let r=i>s?i:s;if(r>0||(r=.016),r>.05&&(r=.05),r<0)return;this.arm>0&&(this.arm=this.arm>r?this.arm-r:0);let o=this.g.S,a=o.mode;this.stats.mode=a,this.speed=Math.abs(o.car.s||0);let c=a==="car"||a==="moto"?this.throttle():0,u=c>(a==="moto"?this.motoThr:this.carThr);a==="moto"?this.motoThr=this.approach(this.motoThr,c,r,u?14:5):a==="car"&&(this.carThr=this.approach(this.carThr,c,r,u?12:4.5)),a==="moto"&&this.motoThr<.08&&this.motoDrive.rpm>5600?this.overrun=.38:this.overrun=this.overrun>r?this.overrun-r:0,a!==this.heardMode&&(this.heardMode=a,a==="car"?this.snap(this.carDrive,Eo,t):a==="moto"&&this.snap(this.motoDrive,Ro,t));let h=a==="car"?this.engine("car",e.car,this.carDrive,Eo,this.carThr,t,r):(this.silence(e.car,r),0),d=a==="moto"?this.engine("moto",e.moto,this.motoDrive,Ro,this.motoThr,t,r):(this.silence(e.moto,r),0),f=a==="moto"?this.motoDrive:this.carDrive,p=a==="moto"?this.motoThr:this.carThr;this.stats.gear=a==="car"||a==="moto"?f.gear+1:0,this.stats.rpm=a==="car"||a==="moto"?f.rpm:0,this.stats.throttle=a==="car"||a==="moto"?p:0,this.stats.level=a==="moto"?d:a==="car"?h:0;let g=!!(this.g.held?.brake||this.keyBrk),b=Math.abs(o.car.drift||0),y=(a==="moto"?b:a==="car"&&g?Math.min(1,this.speed/20):0)*(a==="moto"?.035:.025);e.skid.amp=this.write(e.skid.gain.gain,e.skid.amp,y,.002);let _=Math.abs(o.plane.s||0),S=o.plane.thr||0,E=a==="plane",C=window,T=!!(C.__awTurbo&&E),R=E?C.__awTurboLvl||(T?1:0):0;this.turboLin=this.approach(this.turboLin,R,r,T?6:3),this.turboLin<.004&&!T&&(this.turboLin=0),T&&!this.turboWas&&this.whoosh(t),this.turboWas=T,this.stats.turbo=this.turboLin;let P=1-this.turboLin*.72,I=E?(.045+S*.03)*(P<.28?.28:P):0;e.planeOut.gain.value=I,e.planeNoise.gain.value=E?.55:0,e.planeFilter.frequency.value=520+S*700,e.planeTone.hz=this.write(e.planeTone.osc.frequency,e.planeTone.hz,72+S*46+_*.15,.5),e.planeTone.amp=this.write(e.planeTone.gain.gain,e.planeTone.amp,E?.22:0,.01);let D=this.turboLin;e.roar.amp=this.write(e.roar.gain.gain,e.roar.amp,D*.055,.002),e.roar.f=this.write(e.roar.filter.frequency,e.roar.f,150+D*160,4),e.sub.hz=this.write(e.sub.osc.frequency,e.sub.hz,32+D*18,.3),e.sub2.hz=this.write(e.sub2.osc.frequency,e.sub2.hz,47+D*12,.3),e.sub.amp=this.write(e.sub.gain.gain,e.sub.amp,D*.034,.002),e.sub2.amp=this.write(e.sub2.gain.gain,e.sub2.amp,D*.016,.001);let N=Math.sin(t*37)*Math.sin(t*17.5),O=N>0?N*N:0;e.crackle.amp=this.write(e.crackle.gain.gain,e.crackle.amp,D*(.006+O*.016),.001);let V=window.__aw?.crash?.stats,K=V?.phase??0,Y=this.g.camera.position;if(this.prevPhase===0&&K>=1){let he=(V?.x||Y.x)-Y.x,Le=(V?.z||Y.z)-Y.z;this.boom(t,Math.hypot(he,Le))}this.prevPhase=K,this.responders(Y.x,Y.z,!!V?.active,K,V?.x||0,V?.z||0);let ee=this.policeD>=0&&this.ambD>=0?.82:1;if(this.policeLin=this.approach(this.policeLin,this.atten(this.policeD)*ee,r,5),this.ambLin=this.approach(this.ambLin,this.atten(this.ambD)*ee,r,5),e.policeOut.gain.value=this.policeLin,e.ambOut.gain.value=this.ambLin,this.stats.police=this.policeLin,this.stats.ambulance=this.ambLin,this.policeLin>.004&&this.policeD>=0){let he=.5+.5*Math.sin(t*1.55),Le=560+640*he*he*(3-2*he);e.police.hz=this.write(e.police.osc.frequency,e.police.hz,Le,1),e.police2.hz=this.write(e.police2.osc.frequency,e.police2.hz,Le*1.5,1),e.police.amp=this.write(e.police.gain.gain,e.police.amp,.72,.02),e.police2.amp=this.write(e.police2.gain.gain,e.police2.amp,.22,.02);let ge=(this.policeX-Y.x)/70;e.policePan.pan.value=ge<-.75?-.75:ge>.75?.75:ge}if(this.ambLin>.004&&this.ambD>=0){let he=.5+.5*Math.sin(t*7.4);e.amb.hz=this.write(e.amb.osc.frequency,e.amb.hz,660,1),e.amb2.hz=this.write(e.amb2.osc.frequency,e.amb2.hz,960,1),e.amb.amp=this.write(e.amb.gain.gain,e.amb.amp,.3+.7*(1-he),.02),e.amb2.amp=this.write(e.amb2.gain.gain,e.amb2.amp,.3+.7*he,.02);let Le=(this.ambX-Y.x)/70;e.ambPan.pan.value=Le<-.75?-.75:Le>.75?.75:Le}let Q=a==="walk"?o.walk:a==="plane"?o.plane:o.car,ne=Math.hypot(Q.x+8220,Q.z+5750),fe=Math.hypot(Q.x+7150,Q.z),ye=Math.max(0,1-ne/1900),de=Math.max(Math.max(0,1-fe/1900),ye*.45);this.waveBase=this.approach(this.waveBase,.012+ye*.022,r,1.2),e.waves.amp=this.write(e.waves.gain.gain,e.waves.amp,this.waveBase,.001),e.city.amp=this.write(e.city.gain.gain,e.city.amp,de*.016,.001);let Ue=this.muted||document.hidden?0:Bb;this.masterLin=this.approach(this.masterLin,Ue,r>0?r:.016,8),Math.abs(e.master.gain.value-this.masterLin)>.002&&(e.master.gain.value=this.masterLin)}};var kb=[["Sunrise",6.75],["Noon",12.5],["Sunset",18.25],["Night",21.5]];function Rd(l,e){let t=document.createElement("style");t.textContent=`
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
      <div class="row">${kb.map(([h,d])=>`<button data-h="${d}">${h}</button>`).join("")}</div>
      <div class="row"><button id="awfreeze"></button></div>
      <div class="lbl">Auto FPS guard</div>
      <div class="row"><button id="awguard"></button></div><div id="awfps"></div>`;let o=document.getElementById("streset");s.insertBefore(r,o),r.querySelectorAll("[data-h]").forEach(h=>h.addEventListener("click",()=>l.setHour(+h.dataset.h)));let a=r.querySelector("#awfreeze"),c=r.querySelector("#awguard");a.addEventListener("click",()=>l.setFrozen(!l.frozen)),c.addEventListener("click",()=>e.setEnabled(!e.enabled));let u=()=>{a.textContent=l.frozen?"\u25B6 Resume clock":"\u23F8 Freeze clock",c.textContent=e.enabled?"On (tap to turn off)":"Off (tap to turn on)"};l.onChange(u),e.onChange(u),u()};return i(),()=>{let s=document.getElementById("awfps");s&&(s.textContent=e.describe())}}var Ui=class{constructor(e,t,n,i){x(this,"geo",e);x(this,"mat",t);x(this,"o",n);x(this,"parent",i);x(this,"im",null);x(this,"cap",0);x(this,"srcs",new Set)}get size(){return this.srcs.size}add(e){this.srcs.add(e);let t=0;for(let n of this.srcs)t+=n.n;t>this.cap&&this.grow(t)}remove(e){this.srcs.delete(e)}grow(e){let t=256;for(;t<e;)t*=2;let n=this.im,i=new q(this.geo,this.mat,0);i.instanceMatrix=new Xe(new Float32Array(t*16),16),i.name=this.o.name,i.castShadow=this.o.castShadow,i.receiveShadow=this.o.receiveShadow,i.frustumCulled=!1,i.matrixAutoUpdate=!1,i.count=0,i.visible=!1,this.o.colored&&(i.instanceColor=new Xe(new Float32Array(t*3),3)),n&&(i.count=n.count,i.visible=n.visible,i.instanceMatrix.array.set(n.instanceMatrix.array.subarray(0,n.count*16)),n.instanceColor&&i.instanceColor&&i.instanceColor.array.set(n.instanceColor.array.subarray(0,n.count*3)),n.removeFromParent(),n.dispose()),this.parent.add(i),this.im=i,this.cap=t}fill(e,t,n,i){let s=this.im;if(!s)return 0;let r=n<0?-1:n*n,o=i*i,a=s.instanceMatrix.array,c=s.instanceColor?s.instanceColor.array:null,u=0;for(let h of this.srcs){let d=Math.max(h.box[0]-e,0,e-h.box[2]),f=Math.max(h.box[1]-t,0,t-h.box[3]);if(d*d+f*f>=o)continue;let p=h.mats,m=h.cols;for(let g=0;g<h.n;g++){let b=h.cx[g]-e,v=h.cz[g]-t,y=b*b+v*v;if(y>=o||y<r)continue;let _=g*16,S=u*16;for(let E=0;E<16;E++)a[S+E]=p[_+E];c&&m&&(c[u*3]=m[g*3],c[u*3+1]=m[g*3+1],c[u*3+2]=m[g*3+2]),u++}}return s.count=u,s.visible=u>0,u>0&&(s.instanceMatrix.clearUpdateRanges(),s.instanceMatrix.addUpdateRange(0,u*16),s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.clearUpdateRanges(),s.instanceColor.addUpdateRange(0,u*3),s.instanceColor.needsUpdate=!0)),u}dispose(){this.im&&(this.im.removeFromParent(),this.im.dispose(),this.im=null),this.cap=0}};var zb=new Set(["bld:kit","parked","parkedHi","props"]),Po=class{constructor(e,t=null){x(this,"q",e);x(this,"poolParent",t);x(this,"folded",0);x(this,"buckets",0);x(this,"lastX",1e9);x(this,"lastZ",1e9);x(this,"dirty",new Set);x(this,"pools",new Map);x(this,"dirtyPools",new Set);x(this,"job",null);x(this,"live",new Set)}fold(e,t=1e9){if(e.__awInst||e.state!=="built"||!e.group)return!1;let n=this.job;(!n||n.r!==e)&&(n=this.job={r:e,stack:[e.group],groups:new Map,seen:new Set,lists:null,i:0,out:[]});let i=performance.now();if(!n.lists){if(!this.gather(n,i,t))return!1;n.lists=[...n.groups.values()].filter(s=>s.length>=2)}for(;n.i<n.lists.length&&(this.foldList(e,n.lists[n.i++],n.out),!(performance.now()-i>t)););return n.i<n.lists.length?!1:(this.job=null,e.__awInst=n.out,this.poolParent||this.dirty.add(e),!0)}gather(e,t,n){let i=e.stack;for(let s=1;i.length;s++){let r=i.pop(),o=r.children;for(let c=o.length-1;c>=0;c--)i.push(o[c]);let a=r;if(a.isInstancedMesh&&zb.has(a.name)&&!Array.isArray(a.material)&&a.count!==0){let c=a.parent;c&&!e.seen.has(c)&&(c.updateWorldMatrix(!0,!1),e.seen.add(c)),a.updateWorldMatrix(!1,!1);let u=a.name+"|"+a.geometry.uuid+"|"+a.material.uuid+"|"+a.castShadow+"|"+a.receiveShadow+"|"+(a.instanceColor?1:0),h=e.groups.get(u);h||e.groups.set(u,h=[]),h.push(a)}if((s&127)===0&&performance.now()-t>n)return!1}return!0}foldList(e,t,n){let i=new F,s=new F;{if(t.some(v=>!v.parent))return;let r=0;for(let v of t)r+=v.count;let o=new Float32Array(r*16),a=new Float32Array(r),c=new Float32Array(r),u=t[0].instanceColor?new Float32Array(r*3):null,h=0;for(let v of t)for(let y=0;y<v.count;y++,h++)if(s.fromArray(v.instanceMatrix.array,y*16),i.multiplyMatrices(v.matrixWorld,s),i.toArray(o,h*16),a[h]=o[h*16+12],c[h]=o[h*16+14],u&&v.instanceColor)for(let _=0;_<3;_++)u[h*3+_]=v.instanceColor.array[y*3+_];let d=t[0],f=1e9,p=-1e9,m=1e9,g=-1e9;for(let v=0;v<r;v++)f=Math.min(f,a[v]),p=Math.max(p,a[v]),m=Math.min(m,c[v]),g=Math.max(g,c[v]);if(this.poolParent){let v=d.name+"|"+d.geometry.uuid+"|"+d.material.uuid+"|"+d.castShadow+"|"+d.receiveShadow+"|"+(u?1:0),y=this.pools.get(v);y||this.pools.set(v,y=new Ui(d.geometry,d.material,{name:"aw:inst:"+d.name,castShadow:d.castShadow,receiveShadow:d.receiveShadow,colored:!!u},this.poolParent));let _={kind:d.name,im:null,pool:y,mats:o,cols:u,cx:a,cz:c,n:r,box:[f,m,p,g]};y.add(_),this.dirtyPools.add(y);for(let S of t)S.parent?.remove(S),this.folded++;n.push(_),this.buckets++;return}let b=new q(d.geometry,d.material,r);b.name="aw:inst:"+d.name,b.castShadow=d.castShadow,b.receiveShadow=d.receiveShadow,b.frustumCulled=!1,b.matrixAutoUpdate=!1,b.count=0,b.visible=!1,u&&(b.instanceColor=new Xe(new Float32Array(r*3),3)),e.group.add(b);for(let v of t)v.parent?.remove(v),this.folded++;n.push({kind:d.name,im:b,mats:o,cols:u,cx:a,cz:c,n:r,box:[f,m,p,g]}),this.buckets++}}range(e){let t=this.q,n=t.contactR||220,i=t.parkHi||35;return e==="bld:kit"?[-1,t.kitR||0]:e==="parked"?[i,t.parkR||n]:e==="parkedHi"?[-1,i]:[-1,(t.detailR||150)*.5]}cull(e,t,n){for(let i of e.__awInst||[]){if(!i.im)continue;let[s,r]=this.range(i.kind),o=s<0?-1:s*s,a=(r+3)*(r+3),c=Math.max(i.box[0]-t,0,t-i.box[2]),u=Math.max(i.box[1]-n,0,n-i.box[3]);if(c*c+u*u>=a){i.im.count&&(i.im.count=0,i.im.visible=!1);continue}let h=i.im.instanceMatrix.array,d=i.im.instanceColor?i.im.instanceColor.array:null,f=0;for(let p=0;p<i.n;p++){let m=i.cx[p]-t,g=i.cz[p]-n,b=m*m+g*g;if(b>=a||b<o)continue;let v=p*16,y=f*16;for(let _=0;_<16;_++)h[y+_]=i.mats[v+_];d&&i.cols&&(d[f*3]=i.cols[p*3],d[f*3+1]=i.cols[p*3+1],d[f*3+2]=i.cols[p*3+2]),f++}i.im.count=f,i.im.visible=f>0,f>0&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,f*16),i.im.instanceMatrix.needsUpdate=!0,i.im.instanceColor&&(i.im.instanceColor.clearUpdateRanges(),i.im.instanceColor.addUpdateRange(0,f*3),i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){this.job&&(!this.job.r.group||!this.job.r.group.parent)&&(this.live.add(this.job.r),this.job.r.__awInst=this.job.out,this.job=null);let i=this.job?this.job.r:[...e.values()].find(r=>!r.__awInst&&r.state==="built");i&&this.fold(i,3)&&this.live.add(i);for(let r of this.live)if(!r.group||!r.group.parent){for(let o of r.__awInst||[])o.im&&o.im.dispose(),o.pool&&(o.pool.remove(o),this.dirtyPools.add(o.pool));this.live.delete(r),this.dirty.delete(r)}if((t-this.lastX)**2+(n-this.lastZ)**2>16){this.lastX=t,this.lastZ=n;for(let r of this.live)this.dirty.add(r);for(let r of this.pools.values())this.dirtyPools.add(r)}for(let[r,o]of this.pools)if(this.dirtyPools.has(o)){let[a,c]=this.range(r.slice(0,r.indexOf("|")));o.fill(this.lastX,this.lastZ,a,c+3)}this.dirtyPools.clear();for(let r of this.dirty)this.cull(r,this.lastX,this.lastZ);this.dirty.clear()}};var Lo=class{constructor(e){x(this,"g");x(this,"real");x(this,"mobile");x(this,"stats");x(this,"carSeen",new WeakSet);x(this,"t",0);x(this,"heroCap");x(this,"inst",null);x(this,"postDone",!1);x(this,"regionChanged",(e,t)=>{for(let n=t;n<e.children.length;n++)e.children[n].traverse(i=>{i.name==="bld:kit"&&i.castShadow&&(i.castShadow=!1,this.stats.kitNoShadow++)})});x(this,"trimPending",!1);x(this,"carDone",new WeakSet);x(this,"pedsDone",!1);this.g=e,this.real=e.real;let t=H.get("perfmobile"),n=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window;this.mobile=t==="1"?!0:t==="0"?!1:n,this.stats={instFolded:0,instBuckets:0,carMeshes:"",peds:"",glassFixed:0,frozen:0,merged:0,mergedFrom:0,kitNoShadow:0,heroHidden:0,mobile:this.mobile,changes:[]};let i=this.real.q.name;this.heroCap=i==="low"?700:i==="med"?1e3:this.mobile?1400:this.real.q.id==="desktop"?5e3:2e3,window.__awMMDiv=3,this.tierProfile(),H.get("inst")!=="0"&&(this.inst=new Po(this.real.q,H.get("ipool")!=="0"?this.real.group:null)),this.hookUpdate(),this.hookHero(),this.fixGlass()}tierProfile(){let e=this.real.q,t=this.g.renderer,n=this.stats.changes;if(this.mobile){if(e.name==="high"){let i=Math.min(window.devicePixelRatio||1,1.5);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 2->"+i));let s=this.real.sky.sun.shadow;s.mapSize.x>2048&&(s.mapSize.set(2048,2048),s.map?.dispose(),s.map=null,n.push("shadow 4096->2048")),Object.assign(e,{radius:1400,bldR:1400,roadR:900,kitR:100,parkR:250,contactR:300,detailR:500}),n.push("radius 2000->1400, bldR 1400, roadR 900, kitR 100, parkR 250, detailR 500"),this.trimPending=!0}else if(e.name==="med"){let i=Math.min(window.devicePixelRatio||1,1.35);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 1.5->"+i))}}}fixPost(){if(this.postDone)return;let e=window.__awPost;if(!e)return;this.postDone=!0,this.mobile&&e.ao&&(e.ao.enabled=!1,this.stats.changes.push("GTAO off"));let t=e.composer;if(this.mobile&&t)for(let n of[t.renderTarget1,t.renderTarget2])n&&n.samples>2&&(n.samples=2,n.dispose(),this.stats.changes.push("MSAA 4->2"))}fixGlass(){if(this.real.q.id==="desktop"&&!this.mobile)return;let e=[],t=this.g.car;t&&e.push(t);for(let n of this.g.scene.children)n.name!=="realistic"&&e.push(n);for(let n of e)this.carSeen.has(n)||(this.carSeen.add(n),n.traverse(i=>{let s=i.material;!s||Array.isArray(s)||!(s.transmission&&s.transmission>0)||(s.transmission=0,s.transparent=!0,s.color?.set(790807),s.opacity=.72,s.depthWrite=!1,s.roughness!==void 0&&(s.roughness=Math.min(s.roughness,.08)),s.needsUpdate=!0,this.stats.glassFixed++)}))}freeze(e,t){let n=e.userData;if(n.awFrozen)return;n.awFrozen=!0,n.awN=-1;let i=Object.getPrototypeOf(e).updateMatrixWorld;e.updateMatrixWorld=function(s){let r=this.userData;(s||this.matrixWorldNeedsUpdate||r.awN!==this.children.length)&&(r.awN!==this.children.length&&t&&t(this,r.awN>this.children.length?0:Math.max(0,r.awN)),r.awN=this.children.length,i.call(this,!0))},this.stats.frozen++}merge(e,t){let n=e.userData,i=0;if(e.traverse(()=>i++),n.awMergedN===i)return;e.updateMatrixWorld(!0);let s=new F().copy(e.matrixWorld).invert(),r=new Map,o=new Set;e.traverse(u=>{let h=u;if(!h.isMesh||h.isInstancedMesh||h.isSkinnedMesh||!h.geometry||!h.material||!h.visible||h.name.startsWith("aw:")||h.morphTargetInfluences||h.matrixWorld.determinant()<0)return;let d=h.parent,f=!0;for(;d&&d!==e;)f=f&&d.visible&&!(t&&t(d)),d=d.parent;if(!f||t&&t(h))return;let p=h.geometry,m=Object.keys(p.attributes).sort().join(","),g=[];if(Array.isArray(h.material)){if(!p.index||!p.groups.length)return;for(let b of p.groups){let v=h.material[b.materialIndex??0];v&&g.push({m:h,mat:v,start:b.start,count:b.count})}}else g.push({m:h,mat:h.material,start:0,count:1/0});for(let b of g){let v=[b.mat.uuid,m,p.index?1:0,h.castShadow,h.receiveShadow,h.renderOrder].join("|"),y=r.get(v);y||r.set(v,y=[]),y.push(b)}});let a=new F,c=new Map;for(let u of r.values())for(let h of u)c.set(h.m,(c.get(h.m)??!0)&&u.length>=2);for(let u of r.values()){let h=u.filter(g=>c.get(g.m));if(h.length<2)continue;let d=[];for(let g of h){let b=g.m.geometry,v=b.clone();v.morphAttributes={},v.clearGroups(),b.index&&g.count!==1/0&&v.setIndex(Array.from(b.index.array.slice(g.start,g.start+g.count))),a.multiplyMatrices(s,g.m.matrixWorld),v.applyMatrix4(a),d.push(v)}let f=_t(d,!1);if(d.forEach(g=>g.dispose()),!f){h.forEach(g=>c.set(g.m,!1));continue}f.computeBoundingSphere();let p=h[0].m,m=new k(f,h[0].mat);m.name="aw:merged",m.castShadow=p.castShadow,m.receiveShadow=p.receiveShadow,m.renderOrder=p.renderOrder,m.matrixAutoUpdate=!1,e.add(m);for(let g of h)o.add(g.m);this.stats.merged++,this.stats.mergedFrom+=h.length}for(let u of o)if(c.get(u))if(u.children.length){let h=u.geometry;u.geometry=new re,h.dispose(),u.castShadow=!1}else u.parent?.remove(u),u.geometry.dispose();i=0,e.traverse(()=>i++),n.awMergedN=i,e.updateMatrixWorld(!0)}mergeAll(){let e=[this.real.mon?.group,this.real.brands?.group];for(let t of e)if(t)for(let n of t.children)this.merge(n)}hookHero(){let e=this.real.hero;if(!e)return;let t=e.update.bind(e),n=this.heroCap;e.update=(i,s)=>{t(i,s);let r=0;for(let o of e.list)!o._g||!o._g.visible||Math.hypot(o.x-i,o.z-s)>n&&(o._g.visible=!1,o._sign&&(o._sign.visible=!1),r++);this.stats.heroHidden=r}}trim(e,t){this.trimPending=!1;let n=this.real,i=n.M,s=n.q.radius+300,r=0;for(let o of[...n.regions.values()]){if(o.state==="loading")continue;let a=i.X0+(o.rx+.5)*i.RS,c=i.Z0+(o.rz+.5)*i.RS;Math.hypot(a-e,c-t)-i.RS*.71>s&&(n.disposeRegion(o),r++)}r&&this.stats.changes.push("dropped "+r+" far regions")}hookUpdate(){let e=this.real,t=e.update.bind(e);e.update=(...n)=>{t(...n),this.trimPending&&this.trim(n[0],n[2]);for(let i of e.regions.values())i.group&&this.freeze(i.group,this.regionChanged);this.inst&&(this.inst.update(e.regions,n[0],n[2]),this.stats.instFolded=this.inst.folded,this.stats.instBuckets=this.inst.buckets),this.fixPost()};for(let n of[e.mon?.group,e.brands?.group,e.hero?.group])n&&this.freeze(n)}fixCar(){let e=this.g.car;if(!e||this.carDone.has(e))return;this.carDone.add(e);let t=0,n=0;e.traverse(r=>{r.isMesh&&t++}),e.updateMatrixWorld(!0);let i=e.matrixWorld.clone();e.matrixWorld.identity(),e.children.forEach(r=>r.updateMatrixWorld(!0)),this.merge(e,r=>/^Wheel(Front|Rear)(L|R)$/.test(r.name));let s=e.wheels||[];for(let r of s)this.merge(r.o);e.matrixWorld.copy(i),e.updateMatrixWorld(!0),e.traverse(r=>{r.isMesh&&n++}),this.stats.carMeshes=t+" -> "+n}fixPeds(){if(this.pedsDone||!this.mobile)return;let e=this.real.amb;if(!e)return;this.pedsDone=!0;let t=this.real.q.name,n=t==="high"?5:t==="med"?4:2,i=e.peds.length;for(let s of e.peds.splice(n))s.g.visible=!1,s.g.parent?.remove(s.g);for(let s of e.peds)s.g.traverse(r=>{r.castShadow=!1});this.stats.peds=i+" -> "+e.peds.length+" (no shadows)"}update(e){this.t-=e,!(this.t>0)&&(this.t=1,this.fixGlass(),this.fixCar(),this.fixPeds(),this.mergeAll())}};var Do=class{constructor(e){x(this,"g",e);x(this,"postDone",!1);let t=e.real,n=t.sky.sun.shadow;n.radius=t.q.name==="high"?6:t.q.name==="med"?4.5:3.5,t.roads.asphalt?.color?.isColor&&t.roads.asphalt.color.set(15001838);let i=new L(.94,1.06,.9);for(let s of["mFrond","mCanopy","mShrub"]){let r=t.veg[s];r&&r.color&&r.color.isColor&&r.color.multiply(i)}}update(e){let t=window.__awPost;if(!t||!t.grade)return;let n=t.grade.uniforms;this.postDone||(this.postDone=!0,n.uVib.value=.68,n.uContrast.value=1.12,n.uVig.value=.14,n.uLift.value.set(.008,.007,.002)),t.bloom&&(t.bloom.strength=.16+.04*e,t.bloom.threshold=1.05+.25*e)}};function Cd(l){let e=l*2654435761>>>0||1;return()=>(e=e*1664525+1013904223>>>0)/4294967296}function Gb(){let l=[],e=[],t=[],n=[];for(let s=0;s<3;s++){let r=s*Math.PI/3,o=Math.cos(r)*.5,a=Math.sin(r)*.5,c=l.length/3;l.push(-o,0,-a,o,0,a,o,1,a,-o,1,-a),e.push(0,0,1,0,1,1,0,1);for(let u=0;u<4;u++)t.push(0,1,0);n.push(c,c+1,c+2,c,c+2,c+3)}let i=new re;return i.setAttribute("position",new ue(l,3)),i.setAttribute("normal",new ue(t,3)),i.setAttribute("uv",new ue(e,2)),i.setIndex(n),i}function Hb(){let l=[],e=[];for(let n=0;n<10;n++){let i=n/10*Math.PI*2+n%2*.3,s=.55+n%3*.15,r=.55+n%4*.08,o=Math.cos(i),a=Math.sin(i),c=-a*.05,u=o*.05,h=[o*Math.sin(s)*r,Math.cos(s)*r,a*Math.sin(s)*r];l.push(c,0,u,-c,0,-u,h[0],h[1],h[2]),l.push(-c,0,-u,c,0,u,h[0],h[1],h[2]);for(let d=0;d<6;d++)e.push(o*.5,.8,a*.5)}let t=new re;return t.setAttribute("position",new ue(l,3)),t.setAttribute("normal",new ue(e,3)),t}function dc(l){let t=document.createElement("canvas");t.width=t.height=256;let n=t.getContext("2d"),i=Cd(l==="boug"?7:11);if(l==="scrub"){n.lineCap="round";for(let a=0;a<60;a++){let c=256*(.35+i()*.3),u=-Math.PI/2+(i()-.5)*2.2,h=256*(.25+i()*.6);n.strokeStyle=`rgb(${80+i()*30},${70+i()*25},${55+i()*20})`,n.lineWidth=1.5+i()*2,n.beginPath(),n.moveTo(c,256),n.lineTo(c+Math.cos(u)*h,256+Math.sin(u)*h),n.stroke()}for(let a=0;a<700;a++){let c=i(),u=.15+Math.pow(i(),.8)*.8,h=256*(.5+(c-.5)*(.5+.5*u)),d=256*(1-u*.95),f=85+i()*50;n.fillStyle=`rgb(${f*.78+i()*20},${f},${f*.55})`,n.beginPath(),n.ellipse(h,d,2.5+i()*3,1.6+i()*2,i()*Math.PI,0,Math.PI*2),n.fill()}let o=new le(t);return o.colorSpace=j,o.anisotropy=2,o}let s=l==="boug"?520:260;for(let o=0;o<s;o++){let a=i(),c=Math.pow(i(),.7),u=l==="grape"?.62*Math.sqrt(Math.max(0,1-Math.pow(c*1.05-.45,2)*3.2)):.35+.65*(1-c*.6),h=256*(.5+(a-.5)*u),d=256*(1-c*.95),f=70+i()*70;n.fillStyle=l==="boug"?`rgb(${30+i()*30},${f},${25+i()*25})`:i()<.12?`rgb(${150+i()*40},${90+i()*30},40)`:`rgb(${90+i()*40},${f+60},${45+i()*25})`,n.beginPath();let p=l==="boug"?5+i()*6:9+i()*9;n.ellipse(h,d,p,p*(l==="boug"?.6:.85),i()*Math.PI,0,Math.PI*2),n.fill()}if(l==="boug")for(let o=0;o<260;o++){let a=i(),c=.25+Math.pow(i(),.6)*.72,u=256*(.5+(a-.5)*(.3+.6*(1-c*.5))),h=256*(1-c*.95),d=i()<.8?318+i()*20:20+i()*15;n.fillStyle=`hsl(${d},${75+i()*20}%,${45+i()*15}%)`,n.beginPath(),n.arc(u,h,3+i()*5,0,Math.PI*2),n.fill()}let r=new le(t);return r.colorSpace=j,r.anisotropy=2,r}var No=class{constructor(e,t,n=!1){x(this,"g",e);x(this,"stats",{skipped:0,regions:0,boug:0,aloe:0,grape:0,scrub:0,ac:0,awn:0,drawn:0});x(this,"card",Gb());x(this,"aloe",Hb());x(this,"mBoug");x(this,"mGrape");x(this,"mAloe");x(this,"mScrub");x(this,"mAC",new Ne({color:15329249,roughness:.55,metalness:.15}));x(this,"mAwn",new Ne({color:16777215,roughness:.8,metalness:0}));x(this,"acGeo",(()=>{let e=new ze(.85,.55,.42);return e.clearGroups(),e.translate(0,0,.21),e})());x(this,"awnGeo",(()=>{let e=new ze(1,.06,1);return e.clearGroups(),e.translate(0,0,.5),e})());x(this,"live",new Set);x(this,"gen",null);x(this,"genR",null);x(this,"budget",2);x(this,"lastX",1e9);x(this,"lastZ",1e9);x(this,"mul");x(this,"pools",null);x(this,"vegIdx",null);x(this,"vegSig","");x(this,"hb",null);x(this,"hbN",-1);n&&(this.pools=new Map);let i=e.real.q.name;this.mul=(i==="low"?.6:i==="med"?.85:e.real.q.id==="desktop"?1.4:1)*(t?.8:1);let s=a=>new Ne({map:a,alphaTest:.45,side:$,roughness:.85,metalness:0});this.mBoug=s(dc("boug")),this.mGrape=s(dc("grape")),this.mScrub=s(dc("scrub")),this.mAloe=new Ne({color:new L(7311194),roughness:.6,metalness:0,side:$});let r=e.real,o=r.update.bind(r);r.update=(...a)=>{o(...a),this.update(r.regions,a[0],a[2])}}heightAt(e,t){return this.g.real.heightAt(e,t)}bucket(e,t,n,i,s,r,o){let a=i.length/16;if(!a)return null;if(this.pools){let v=new Float32Array(i),y=new Float32Array(a),_=new Float32Array(a),S=1e9,E=-1e9,C=1e9,T=-1e9;for(let I=0;I<a;I++)y[I]=v[I*16+12],_[I]=v[I*16+14],S=Math.min(S,y[I]),E=Math.max(E,y[I]),C=Math.min(C,_[I]),T=Math.max(T,_[I]);let R=this.pools.get(r);R||this.pools.set(r,R={pool:new Ui(t,n,{name:"aw:flora:"+r,castShadow:!1,receiveShadow:!0,colored:!!o},this.g.real.group),range:s*Math.sqrt(this.mul)});let P={im:null,pool:R.pool,cols:o?new Float32Array(o):void 0,mats:v,cx:y,cz:_,n:a,range:R.range,box:[S,C,E,T]};return R.pool.add(P),P}let c=new q(t,n,a);c.name="aw:flora:"+r,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!0,c.matrixAutoUpdate=!1,c.count=0,c.visible=!1;let u=new Float32Array(i),h=new Float32Array(a),d=new Float32Array(a),f=1e9,p=-1e9,m=1e9,g=-1e9;for(let v=0;v<a;v++)h[v]=u[v*16+12],d[v]=u[v*16+14],f=Math.min(f,h[v]),p=Math.max(p,h[v]),m=Math.min(m,d[v]),g=Math.max(g,d[v]);let b;return o&&(b=new Float32Array(o),c.instanceColor=new Xe(new Float32Array(a*3),3)),e.group.add(c),{im:c,cols:b,mats:u,cx:h,cz:d,n:a,range:s*Math.sqrt(this.mul),box:[f,m,p,g]}}*build(e){let t=0,n=this.g.real.veg,i=Cd(e.rx*7919+e.rz*104729+13),s=new F,r=new Z,o=new M,a=new M,c=new M(0,1,0),u=(T,R,P,I,D,N,O=.05)=>{r.setFromAxisAngle(c,N),a.set(R,this.heightAt(R,P)-O,P),o.set(I,D,I),s.compose(a,r,o);for(let U of s.elements)T.push(U)},h=[],d=[],f=[];for(let T of e.json?.b||[]){if((++t&31)===0&&(yield),!T.p||T.p.length<3||this.hidden(T))continue;let R=T.k==="house"||T.k==="res"||T.k==="apt";if(i()>(R?.38:.08)*this.mul)continue;let P=0,I=0;for(let[Ue,he]of T.p)P+=Ue,I+=he;P/=T.p.length,I/=T.p.length;let D=Math.floor(i()*T.p.length),[N,O]=T.p[D],[U,V]=T.p[(D+1)%T.p.length],K=U-N,Y=V-O,ee=Math.hypot(K,Y);if(ee<2.5)continue;let Q=-Y/ee,ne=K/ee,fe=(N+U)/2,ye=(O+V)/2;(fe-P)*Q+(ye-I)*ne<0&&(Q=-Q,ne=-ne);let de=1+Math.floor(i()*3);for(let Ue=0;Ue<de;Ue++){let he=.2+i()*.6,Le=N+K*he+Q*.8,ge=O+Y*he+ne*.8;u(h,Le,ge,1.5+i()*1.2,1.4+i()*1.4,i()*6.28)}}for(let[T,,R]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((T-this.M().X0)/this.M().RS)!==e.rx||Math.floor((R-this.M().Z0)/this.M().RS)!==e.rz||i()>.5*this.mul)continue;let P=1+Math.floor(i()*4);for(let I=0;I<P;I++){let D=i()*6.28,N=1.5+i()*4,O=.7+i()*.8;u(d,T+Math.cos(D)*N,R+Math.sin(D)*N,O,O*(.8+i()*.5),i()*6.28,.02)}}for(let[T,R,P]of this.vegFor(e,"p")){if((++t&255)===0&&(yield),R>3.5||Math.floor((T-this.M().X0)/this.M().RS)!==e.rx||Math.floor((P-this.M().Z0)/this.M().RS)!==e.rz||i()>.45*this.mul)continue;let I=i()*6.28,D=3+i()*5;u(f,T+Math.cos(I)*D,P+Math.sin(I)*D,2.4+i()*1.8,1.6+i()*1.4,i()*6.28)}let p=[],m=[],g=[],b=[2062988,14241584,15905076,3050327,8011421,15231634,2841027,16052712],v=new L,y=new Z,_=new M(1,0,0),S=(T,R,P,I,D,N,O,U,V=0)=>{r.setFromAxisAngle(c,D),V&&r.multiply(y.setFromAxisAngle(_,V)),a.set(R,I,P),o.set(N,O,U),s.compose(a,r,o);for(let K of s.elements)T.push(K)};for(let T of e.json?.b||[]){if((++t&31)===0&&(yield),!T.p||T.p.length<3||this.hidden(T))continue;let R=T.k==="com"||T.k==="shop"||T.k==="retail",P=T.k==="house"||T.k==="res"||T.k==="apt";if(!R&&!P)continue;let I=0,D=0;for(let[U,V]of T.p)I+=U,D+=V;I/=T.p.length,D/=T.p.length;let N=T.h||4,O=Math.min(T.p.length,6);for(let U=0;U<O;U++){let[V,K]=T.p[U],[Y,ee]=T.p[(U+1)%T.p.length],Q=Y-V,ne=ee-K,fe=Math.hypot(Q,ne);if(fe<3)continue;let ye=-ne/fe,de=Q/fe,Ue=(V+Y)/2,he=(K+ee)/2;(Ue-I)*ye+(he-D)*de<0&&(ye=-ye,de=-de);let Le=Math.atan2(ye,de);if(i()<(R?.45:.28)*this.mul){let ge=.15+i()*.7,J=V+Q*ge+ye*.03,Me=K+ne*ge+de*.03,et=this.heightAt(J,Me),yt=N>6&&i()<.5?3+Math.floor(i()*Math.max(1,(N-4)/3))*3:0;S(p,J,Me,et+Math.min(N-.8,2.3+yt),Le,1,1,1)}if(R&&fe>4&&i()<.5*this.mul){let ge=Math.min(fe*.8,3+i()*6),J=.5,Me=V+Q*J+ye*.02,et=K+ne*J+de*.02;S(m,Me,et,this.heightAt(Me,et)+Math.min(N-.4,2.9),Le,ge,1,1.1+i()*.5,.32),v.setHex(b[Math.floor(i()*b.length)]).convertSRGBToLinear(),g.push(v.r,v.g,v.b)}}}let E=[];for(let[T,,R]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((T-this.M().X0)/this.M().RS)!==e.rx||Math.floor((R-this.M().Z0)/this.M().RS)!==e.rz||i()>.7*this.mul)continue;let P=1+Math.floor(i()*3);for(let I=0;I<P;I++){let D=i()*6.28,N=2+i()*7;u(E,T+Math.cos(D)*N,R+Math.sin(D)*N,1.8+i()*2.2,1.1+i()*1.4,i()*6.28)}}this.stats.scrub+=E.length/16,this.stats.ac+=p.length/16,this.stats.awn+=m.length/16;let C=[];for(let T of[this.bucket(e,this.card,this.mBoug,h,180,"boug"),this.bucket(e,this.aloe,this.mAloe,d,110,"aloe"),this.bucket(e,this.card,this.mGrape,f,220,"grape"),this.bucket(e,this.card,this.mScrub,E,320,"scrub"),this.bucket(e,this.acGeo,this.mAC,p,140,"ac"),this.bucket(e,this.awnGeo,this.mAwn,m,260,"awn",g)])T&&C.push(T);this.stats.boug+=h.length/16,this.stats.aloe+=d.length/16,this.stats.grape+=f.length/16,this.stats.regions++,e.__awFlora=C,this.live.add(e)}hidden(e){let t=this.g.real,n=0,i=0;for(let[s,r]of e.p)n+=s,i+=r;n/=e.p.length,i/=e.p.length;for(let s of this.heroBoxes())if(n>s[0]&&n<s[2]&&i>s[1]&&i<s[3])return this.stats.skipped++,!0;try{if(t.mon&&t.mon.excluded&&t.mon.excluded(n,i,e))return this.stats.skipped++,!0;if(t.hero&&(t.hero.pts.length||t.hero.polys.length)&&this.nearHero(n,i)&&t.hero.hides(e.p))return this.stats.skipped++,!0}catch{}return!1}vegFor(e,t){let n=this.g.real.veg.lists,i=(n.k||[]).length+":"+(n.p||[]).length+":"+(n.k||[]).reduce((r,o)=>r+o.length,0)+":"+(n.p||[]).reduce((r,o)=>r+o.length,0);if(!this.vegIdx||i!==this.vegSig){this.vegSig=i,this.vegIdx=new Map;let r=this.M();for(let o of["k","p"])for(let a of n[o]||[])for(let c of a){let u=Math.floor((c[0]-r.X0)/r.RS)+","+Math.floor((c[2]-r.Z0)/r.RS),h=this.vegIdx.get(u);h||this.vegIdx.set(u,h={k:[],p:[]}),h[o].push(c)}}let s=this.vegIdx.get(e.rx+","+e.rz);return s?s[t]:[]}heroBoxes(){let e=this.g.real.hero,t=e&&e.list||[];if(this.hb&&this.hbN===t.length)return this.hb;this.hb=[],this.hbN=t.length;for(let n of t){let i=n.foot||(Array.isArray(n.hero?.hide_footprint)?n.hero.hide_footprint:null);if(i&&i.length>2){let s=1e9,r=1e9,o=-1e9,a=-1e9;for(let[c,u]of i)s=Math.min(s,c),o=Math.max(o,c),r=Math.min(r,u),a=Math.max(a,u);this.hb.push([s-6,r-6,o+6,a+6])}else Number.isFinite(n.x)&&this.hb.push([n.x-30,n.z-30,n.x+30,n.z+30])}return this.hb}nearHero(e,t){for(let n of this.heroBoxes())if(e>n[0]-60&&e<n[2]+60&&t>n[1]-60&&t<n[3]+60)return!0;return!1}M(){return this.g.real.M}cull(e,t,n){for(let i of e.__awFlora||[]){if(!i.im)continue;let s=i.range*i.range,r=Math.max(i.box[0]-t,0,t-i.box[2]),o=Math.max(i.box[1]-n,0,n-i.box[3]);if(r*r+o*o>=s){i.im.count=0,i.im.visible=!1;continue}let a=i.im.instanceMatrix.array,c=0;for(let u=0;u<i.n;u++){let h=i.cx[u]-t,d=i.cz[u]-n;if(h*h+d*d<s){let f=u*16,p=c*16;for(let m=0;m<16;m++)a[p+m]=i.mats[f+m];if(i.cols){let m=i.im.instanceColor.array;m[c*3]=i.cols[u*3],m[c*3+1]=i.cols[u*3+1],m[c*3+2]=i.cols[u*3+2]}c++}}i.im.count=c,i.im.visible=c>0,c&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,c*16),i.im.instanceMatrix.needsUpdate=!0,i.cols&&(i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){let i=performance.now();if(!this.gen){for(let r of e.values())if(!r.__awFlora&&r.state==="built"&&r.group&&r.json){this.gen=this.build(r),this.genR=r;break}}for(;this.gen&&performance.now()-i<this.budget;){if(this.genR&&this.genR.state!=="built"){this.gen=null;break}this.gen.next().done&&(this.gen=null,this.lastX=1e9)}for(let r of this.live)if(!r.group||!r.group.parent){for(let o of r.__awFlora||[])o.im&&o.im.dispose(),o.pool&&o.pool.remove(o);this.live.delete(r),this.lastX=1e9}if((t-this.lastX)**2+(n-this.lastZ)**2<36)return;this.lastX=t,this.lastZ=n;let s=0;if(this.pools){for(let r of this.pools.values())s+=r.pool.fill(t,n,-1,r.range);this.stats.drawn=s;return}for(let r of this.live){this.cull(r,t,n);for(let o of r.__awFlora||[])s+=o.im?o.im.count:0}this.stats.drawn=s}};var Oo=class{constructor(e,t){x(this,"g",e);x(this,"budget",t);x(this,"stats",{jobs:0,maxMs:0,ticks:0,maxJob:0});x(this,"ord",new WeakMap);x(this,"cost",[]);x(this,"ch",new MessageChannel);x(this,"pending",!1);window.__awJobB=-1,this.ch.port1.onmessage=()=>this.run()}frame(){let e=this.g.real;this.pending||!e.queue.length||(this.pending=!0,this.ch.port2.postMessage(0))}run(){this.pending=!1;let e=this.g.real,t=performance.now(),n=e.queue.length>120?this.budget*1.5:this.budget,i=0;for(;e.queue.length&&performance.now()-t<n;){let r=e.queue[0],o=this.ord.get(r.R)??0,a=this.cost[o]||0;if(i>0&&performance.now()-t+a>n)break;e.queue.shift(),this.ord.set(r.R,o+1);let c=performance.now();if(e.regions.get(r.R.rx+","+r.R.rz)===r.R)try{r.f()}catch(h){console.error("[aw-jobs]",h)}let u=performance.now()-c;this.cost[o]=this.cost[o]?this.cost[o]*.7+u*.3:u,u>this.stats.maxJob&&(this.stats.maxJob=u),this.stats.jobs++,i++}let s=performance.now()-t;this.stats.ticks++,s>this.stats.maxMs&&(this.stats.maxMs=s)}};var Vb=[13617856,12433840,11975099,14078664],Wb=[10508348,11232326,9720122,11693646],Xb=[14271098,14199472,9616823,14605264,14069376,11453338,10926543,13605516],Fo=class{constructor(e,t,n=!0){x(this,"g",e);x(this,"walls",t);x(this,"useBatch",n);x(this,"mesh",null);x(this,"stats",{buildings:0,tris:0,masked:0,ms:0});x(this,"mask",new Uint8Array(1024*4));x(this,"tex",new ot(this.mask,32,32,Vt,Jn));x(this,"t",0);x(this,"batch",null);this.tex.needsUpdate=!0,this.load().catch(i=>console.warn("[aw-far] disabled:",i))}async load(){let e=await fetch("./data/far/massing.bin");if(!e.ok)return;let t=await e.arrayBuffer(),n=new DataView(t);if(n.getUint32(0,!0)!==826693441)return;let i=performance.now(),s=n.getUint32(4,!0);if(t.byteLength<8+s*14){console.warn("[aw-far] massing.bin truncated",t.byteLength,s);return}let r=this.g.real,o=(T,R,P)=>this.walls&&(T>=7||R*P*4>350),a=0,c=0;for(let T=0;T<s;T++){let R=8+T*14,P=n.getInt16(R+4,!0)/20,I=n.getInt16(R+6,!0)/20,D=n.getUint8(R+8)/4,N=n.getUint8(R+9)/4;a+=4,c+=6,o(N,D,Math.hypot(P,I))&&(a+=16,c+=24)}let u=new Float32Array(a*3),h=new Float32Array(a*3),d=new Uint8Array(a*4),f=new Float32Array(a),p=new Uint32Array(c),m=0,g=0,b=new L,v=new L(13219740).convertSRGBToLinear(),y=(T,R,P,I,D,N,O)=>(u[m*3]=T,u[m*3+1]=R,u[m*3+2]=P,h[m*3]=I,h[m*3+1]=D,h[m*3+2]=N,d[m*4]=b.r*255,d[m*4+1]=b.g*255,d[m*4+2]=b.b*255,d[m*4+3]=255,f[m]=O,m++);for(let T=0;T<s;T++){let R=8+T*14,P=n.getInt16(R,!0)/2,I=n.getInt16(R+2,!0)/2,D=n.getInt16(R+4,!0)/20,N=n.getInt16(R+6,!0)/20,O=n.getUint8(R+8)/4,U=n.getUint8(R+9)/4,V=n.getUint8(R+10),K=n.getUint8(R+11),Y=n.getUint16(R+12,!0),ee=Math.hypot(D,N)||1,Q=-N/ee*O,ne=D/ee*O,fe=r.heightAt(P,I)-.5,ye=fe+.5+U,de=[[P-D-Q,I-N-ne],[P+D-Q,I+N-ne],[P+D+Q,I+N+ne],[P-D+Q,I-N+ne]],Ue=V>>4;b.setHex(Ue?Wb[K&3]:Vb[K&3]).convertSRGBToLinear().lerp(v,.35);let he=de.map(([ge,J])=>y(ge,ye,J,0,1,0,Y));if((de[1][0]-de[0][0])*(de[2][1]-de[0][1])-(de[1][1]-de[0][1])*(de[2][0]-de[0][0])<0?(p[g++]=he[0],p[g++]=he[1],p[g++]=he[2],p[g++]=he[0],p[g++]=he[2],p[g++]=he[3]):(p[g++]=he[0],p[g++]=he[2],p[g++]=he[1],p[g++]=he[0],p[g++]=he[3],p[g++]=he[2]),o(U,O,ee)){b.setHex(Xb[K>>2&7]).convertSRGBToLinear().lerp(v,.4).multiplyScalar(.85);for(let ge=0;ge<4;ge++){let[J,Me]=de[ge],[et,yt]=de[ge+1&3],Pt=yt-Me,Lt=-(et-J),Bu=Math.hypot(Pt,Lt)||1;Pt/=Bu,Lt/=Bu,((J+et)/2-P)*Pt+((Me+yt)/2-I)*Lt<0&&(Pt=-Pt,Lt=-Lt);let ku=y(J,fe,Me,Pt,0,Lt,Y),nm=y(et,fe,yt,Pt,0,Lt,Y),zu=y(et,ye,yt,Pt,0,Lt,Y),im=y(J,ye,Me,Pt,0,Lt,Y);p[g++]=ku,p[g++]=nm,p[g++]=zu,p[g++]=ku,p[g++]=zu,p[g++]=im}}}if(this.useBatch){this.buildBatch(u,h,d,f,p,a,c),this.stats.buildings=s,this.stats.ms=Math.round(performance.now()-i),this.t=0;return}let _=new re;_.setAttribute("position",new ie(u,3)),_.setAttribute("normal",new ie(h,3)),_.setAttribute("color",new ie(d,4,!0)),_.setAttribute("aReg",new ie(f,1)),_.setIndex(new ie(p,1));let S=new lt({vertexColors:!0,side:2}),E=this.tex;S.onBeforeCompile=T=>{T.uniforms.uMask={value:E},T.vertexShader=T.vertexShader.replace("#include <common>",`#include <common>
attribute float aReg; uniform sampler2D uMask;`).replace("#include <project_vertex>",`#include <project_vertex>
  { float rx = floor(aReg / 32.0), rz = aReg - rx * 32.0;
    if (texture2D(uMask, (vec2(rx, rz) + 0.5) / 32.0).r > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }`)},S.customProgramCacheKey=()=>"awFarCity";let C=new k(_,S);C.name="aw:farCity",C.frustumCulled=!1,C.castShadow=!1,C.receiveShadow=!1,C.matrixAutoUpdate=!1,this.g.scene.add(C),this.mesh=C,this.stats.buildings=s,this.stats.tris=c/3,this.stats.ms=Math.round(performance.now()-i),this.t=0}buildBatch(e,t,n,i,s,r,o){let c=new Uint32Array(1025),u=new Uint32Array(1025);for(let R=0;R<r;R++)c[i[R]+1]++;for(let R=0;R<o;R+=3)u[i[s[R]]+1]+=3;for(let R=0;R<1024;R++)c[R+1]+=c[R],u[R+1]+=u[R];let h=new Uint32Array(r),d=c.slice(0,1024),f=u.slice(0,1024),p=new Float32Array(r*3),m=new Float32Array(r*3),g=new Uint8Array(r*4),b=new Uint32Array(o);for(let R=0;R<r;R++){let P=i[R],I=d[P]++;h[R]=I-c[P],p[I*3]=e[R*3],p[I*3+1]=e[R*3+1],p[I*3+2]=e[R*3+2],m[I*3]=t[R*3],m[I*3+1]=t[R*3+1],m[I*3+2]=t[R*3+2],g[I*4]=n[R*4],g[I*4+1]=n[R*4+1],g[I*4+2]=n[R*4+2],g[I*4+3]=n[R*4+3]}for(let R=0;R<o;R+=3){let P=i[s[R]],I=f[P];f[P]+=3,b[I]=h[s[R]],b[I+1]=h[s[R+1]],b[I+2]=h[s[R+2]]}let v=[];for(let R=0;R<1024;R++)u[R+1]>u[R]&&v.push(R);let y=new lt({vertexColors:!0,side:2});y.customProgramCacheKey=()=>"awFarCityB";let _=new Hn(v.length,r,o,y),S=v.length,E={cx:new Float32Array(S),cy:new Float32Array(S),cz:new Float32Array(S),r:new Float32Array(S),vis:new Uint16Array(S),nVis:0,reg:new Uint16Array(S),n:S},C=new X,T=new X;v.forEach((R,P)=>{let I=c[R],D=c[R+1],N=new re;N.setAttribute("position",new ie(p.subarray(I*3,D*3),3)),N.setAttribute("normal",new ie(m.subarray(I*3,D*3),3)),N.setAttribute("color",new ie(g.subarray(I*4,D*4),4,!0)),N.setIndex(new ie(b.subarray(u[R],u[R+1]),1)),N.computeBoundingSphere(),_.addInstance(_.addGeometry(N));let O=N.boundingSphere;E.cx[P]=O.center.x,E.cy[P]=O.center.y,E.cz[P]=O.center.z,E.r[P]=O.radius,E.reg[P]=R,P?C.union(T.copy(O)):C.copy(O)}),_.boundingSphere=C,_.name="aw:farCity",_.sortObjects=!1,_.perObjectFrustumCulled=!0,_.castShadow=!1,_.receiveShadow=!1,_.matrixAutoUpdate=!1,_.userData.awb=E,_.onBeforeRender=lc,this.g.scene.add(_),this.batch=E,this.mesh=_,this.stats.tris=o/3}update(e){let n=this.g.camera.position.y,i=Math.max(0,Math.min(1,(n-25)/140)),s=window;if(s.__awFar=12e3+1e4*i,s.__awFogK=1-.55*i,!this.mesh||(this.t-=e,this.t>0))return;this.t=.25;let r=this.g.real.regions;this.mask.fill(0);let o=0;for(let c of r.values()){if(c.state!=="built")continue;let u=c.rx,h=c.rz;u<0||h<0||u>31||h>31||(this.mask[(h*32+u)*4]=255,o++)}this.stats.masked=o;let a=this.batch;if(a){let c=0;for(let u=0;u<a.n;u++){let h=a.reg[u],d=Math.floor(h/32),f=h-d*32;this.mask[(f*32+d)*4]||(a.vis[c++]=u)}a.nVis=c;return}this.tex.needsUpdate=!0}};var Ls={desktop:"high",high:"med",med:"low"},Uo=class{constructor(e,t){x(this,"g",e);x(this,"stats",{lost:0,prCap:0});let n=e.renderer.domElement;n.addEventListener("webglcontextlost",i=>this.lost(i),!1),n.addEventListener("webglcontextrestored",()=>location.reload(),!1),t||(this.cap(),addEventListener("resize",()=>this.cap()))}tier(){let e=this.g.real.q;return e.id||e.name}cap(){let e=this.tier();if(e!=="high"&&e!=="desktop")return;let t=this.g.renderer,n=e==="desktop"?8e6:24e5,i=innerWidth*innerHeight,s=Math.min(devicePixelRatio||1,e==="desktop"?3:2),r=Math.max(1,Math.min(s,Math.sqrt(n/Math.max(1,i))));window.__awPRCap=r,t.getPixelRatio()>r+.01&&(t.setPixelRatio(r),this.stats.prCap=+r.toFixed(2),dispatchEvent(new Event("resize")))}lost(e){e.preventDefault(),this.stats.lost++;let t=this.tier(),n="aw_ctxlost_"+t,i=0;try{i=+(sessionStorage.getItem(n)||0)+1,sessionStorage.setItem(n,String(i))}catch{}if(i>=2&&Ls[t])try{localStorage.setItem("aw_q",Ls[t])}catch{}let s=document.createElement("div");s.textContent=i>=2&&Ls[t]?`Graphics reset - switching to ${Ls[t].toUpperCase()}\u2026`:"Graphics reset - reloading\u2026",s.style.cssText="position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:99999;background:#000c;color:#fff;padding:14px 18px;border-radius:12px;font:600 15px system-ui",document.body.appendChild(s),setTimeout(()=>{let r=new URL(location.href);i>=2&&Ls[t]&&r.searchParams.delete("q"),location.href=r.toString()},2500)}};var Bo=class{constructor(e){x(this,"g",e);x(this,"c",document.createElement("canvas"));x(this,"x");x(this,"buf",new Float32Array(300));x(this,"i",0);x(this,"n",0);x(this,"t",0);x(this,"txt","");this.c.width=300,this.c.height=96,this.c.style.cssText="position:fixed;left:8px;bottom:8px;z-index:9999;pointer-events:none;background:#000a;border-radius:6px;width:300px;height:96px",document.body.appendChild(this.c),this.x=this.c.getContext("2d")}frame(e){if(this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n=Math.min(this.n+1,this.buf.length),this.t+=e,this.t>500){this.t=0;let r=Array.from(this.buf.subarray(0,this.n)).sort((c,u)=>c-u),o=c=>r[Math.min(r.length-1,Math.floor(c*r.length))],a=this.g.renderer;this.txt=`p50 ${o(.5).toFixed(1)}  p95 ${o(.95).toFixed(1)}  p99 ${o(.99).toFixed(1)}  max ${r[r.length-1].toFixed(0)} ms \xB7 pr ${a.getPixelRatio().toFixed(2)}`}let t=this.x,n=300,i=96,s=70/50;t.clearRect(0,0,n,i);for(let r=0;r<this.n;r++){let o=this.buf[(this.i-this.n+r+this.buf.length)%this.buf.length];t.fillStyle=o<17.5?"#3c3":o<34?"#ec3":"#e33";let a=Math.min(70,o*s);t.fillRect(r,i-a,1,a)}t.fillStyle="#fff8",t.fillRect(0,i-16.7*s,n,1),t.fillRect(0,i-33.3*s,n,1),t.fillStyle="#fff",t.font="11px monospace",t.fillText(this.txt,4,12)}};function ko(l){let e=new Map,t=new Map,n=l.clone();return Id(l,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,r=e.get(i),o=r.skeleton.bones;s.skeleton=r.skeleton.clone(),s.bindMatrix.copy(r.bindMatrix),s.skeleton.bones=o.map(function(a){return t.get(a)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Id(l,e,t){t(l,e);for(let n=0;n<l.children.length;n++)Id(l.children[n],e.children[n],t)}var ki=class extends Rt{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new vc(t)}),this.register(function(t){return new _c(t)}),this.register(function(t){return new Cc(t)}),this.register(function(t){return new Ic(t)}),this.register(function(t){return new Pc(t)}),this.register(function(t){return new Mc(t)}),this.register(function(t){return new wc(t)}),this.register(function(t){return new Sc(t)}),this.register(function(t){return new Ac(t)}),this.register(function(t){return new bc(t)}),this.register(function(t){return new Tc(t)}),this.register(function(t){return new yc(t)}),this.register(function(t){return new Rc(t)}),this.register(function(t){return new Ec(t)}),this.register(function(t){return new gc(t)}),this.register(function(t){return new zo(t,oe.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new zo(t,oe.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Lc(t)})}load(e,t,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let c=Jt.extractUrlBase(e);r=Jt.resolveURL(c,this.path)}else r=Jt.extractUrlBase(e);this.manager.itemStart(e);let o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},a=new Li(this.manager);a.setPath(this.path),a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(c){try{s.parse(c,r,function(u){t(u),s.manager.itemEnd(e)},o)}catch(u){o(u)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,r={},o={},a=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(a.decode(new Uint8Array(e,0,4))===Od){try{r[oe.KHR_BINARY_GLTF]=new Dc(e)}catch(h){i&&i(h);return}s=JSON.parse(r[oe.KHR_BINARY_GLTF].content)}else s=JSON.parse(a.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new zc(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[h.name]=h,r[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){let h=s.extensionsUsed[u],d=s.extensionsRequired||[];switch(h){case oe.KHR_MATERIALS_UNLIT:r[h]=new xc;break;case oe.KHR_DRACO_MESH_COMPRESSION:r[h]=new Nc(s,this.dracoLoader);break;case oe.KHR_TEXTURE_TRANSFORM:r[h]=new Oc;break;case oe.KHR_MESH_QUANTIZATION:r[h]=new Fc;break;default:d.indexOf(h)>=0&&o[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(r),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function qb(){let l={};return{get:function(e){return l[e]},add:function(e,t){l[e]=t},remove:function(e){delete l[e]},removeAll:function(){l={}}}}function Ie(l,e,t){let n=l.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var oe={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},gc=class{constructor(e){this.parser=e,this.name=oe.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,a=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,u=new L(16777215);a.color!==void 0&&u.setRGB(a.color[0],a.color[1],a.color[2],it);let h=a.range!==void 0?a.range:0;switch(a.type){case"directional":c=new As(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Zn(u),c.distance=h;break;case"spot":c=new Yn(u),c.distance=h,a.spot=a.spot||{},a.spot.innerConeAngle=a.spot.innerConeAngle!==void 0?a.spot.innerConeAngle:0,a.spot.outerConeAngle=a.spot.outerConeAngle!==void 0?a.spot.outerConeAngle:Math.PI/4,c.angle=a.spot.outerConeAngle,c.penumbra=1-a.spot.innerConeAngle/a.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+a.type)}return c.position.set(0,0,0),Ct(c,a),a.intensity!==void 0&&(c.intensity=a.intensity),c.name=t.createUniqueName(a.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(a){return n._getNodeRef(t.cache,o,a)})}},xc=class{constructor(){this.name=oe.KHR_MATERIALS_UNLIT}getMaterialType(){return z}extendParams(e,t,n){let i=[];e.color=new L(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],it),e.opacity=r[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,j))}return Promise.all(i)}},bc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},vc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new B(s,s)}return Promise.all(i)}},_c=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},yc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},Mc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new L(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],it)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,j)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},wc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},Sc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new L().setRGB(s[0],s[1],s[2],it),Promise.all(i)}},Ac=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_IOR}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Tc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new L().setRGB(s[0],s[1],s[2],it),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,j)),Promise.all(i)}},Ec=class{constructor(e){this.parser=e,this.name=oe.EXT_MATERIALS_BUMP}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},Rc=class{constructor(e){this.parser=e,this.name=oe.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ie(this.parser,e,this.name)!==null?Je:null}extendMaterialParams(e,t){let n=Ie(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Cc=class{constructor(e){this.parser=e,this.name=oe.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,r)}},Ic=class{constructor(e){this.parser=e,this.name=oe.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],o=i.images[r.source],a=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(a=c)}return n.loadTextureImage(e,r.source,a)}},Pc=class{constructor(e){this.parser=e,this.name=oe.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],o=i.images[r.source],a=n.textureLoader;if(o.uri){let c=n.options.manager.getHandler(o.uri);c!==null&&(a=c)}return n.loadTextureImage(e,r.source,a)}},zo=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){let a=i.byteOffset||0,c=i.byteLength||0,u=i.count,h=i.byteStride,d=new Uint8Array(o,a,c);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(u,h,d,i.mode,i.filter).then(function(f){return f.buffer}):r.ready.then(function(){let f=new ArrayBuffer(u*h);return r.decodeGltfBuffer(new Uint8Array(f),u,h,d,i.mode,i.filter),f})})}else return null}},Lc=class{constructor(e){this.name=oe.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==ht.TRIANGLES&&c.mode!==ht.TRIANGLE_STRIP&&c.mode!==ht.TRIANGLE_FAN&&c.mode!==void 0)return null;let r=n.extensions[this.name].attributes,o=[],a={};for(let c in r)o.push(this.parser.getDependency("accessor",r[c]).then(u=>(a[c]=u,a[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(let p of h){let m=new F,g=new M,b=new Z,v=new M(1,1,1),y=new q(p.geometry,p.material,d);for(let S=0;S<d;S++)a.TRANSLATION&&g.fromBufferAttribute(a.TRANSLATION,S),a.ROTATION&&b.fromBufferAttribute(a.ROTATION,S),a.SCALE&&v.fromBufferAttribute(a.SCALE,S),y.setMatrixAt(S,m.compose(g,b,v));let _=null;for(let S in a)if(S==="_COLOR_0"){let E=a[S];y.instanceColor=new Xe(E.array,E.itemSize,E.normalized)}else if(S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"){if(_===null){let C=y.geometry;_=new re,_.name=C.name;for(let T in C.attributes)_.setAttribute(T,C.attributes[T]);for(let T in C.morphAttributes)_.morphAttributes[T]=C.morphAttributes[T];C.index!==null&&_.setIndex(C.index),_.morphTargetsRelative=C.morphTargetsRelative;for(let T of C.groups)_.addGroup(T.start,T.count,T.materialIndex);C.boundingBox!==null&&(_.boundingBox=C.boundingBox.clone()),C.boundingSphere!==null&&(_.boundingSphere=C.boundingSphere.clone()),_.drawRange.start=C.drawRange.start,_.drawRange.count=C.drawRange.count,_.userData=Object.assign({},C.userData),y.geometry=_}let E=a[S];_.setAttribute(S,new Xe(E.array,E.itemSize,E.normalized))}Ae.prototype.copy.call(y,p),this.parser.assignFinalMaterial(y),f.push(y)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},Od="glTF",Ds=12,Pd={JSON:1313821514,BIN:5130562},Dc=class{constructor(e){this.name=oe.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ds),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Od)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Ds,s=new DataView(e,Ds),r=0;for(;r<i;){let o=s.getUint32(r,!0);r+=4;let a=s.getUint32(r,!0);if(r+=4,a===Pd.JSON){let c=new Uint8Array(e,Ds+r,o);this.content=n.decode(c)}else if(a===Pd.BIN){let c=Ds+r;this.body=e.slice(c,c+o)}r+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Nc=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=oe.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,o={},a={},c={};for(let u in r){let h=Bc[u]||u.toLowerCase();o[h]=r[u]}for(let u in e.attributes){let h=Bc[u]||u.toLowerCase();if(r[u]!==void 0){let d=n.accessors[e.attributes[u]],f=Bi[d.componentType];c[h]=f.name,a[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,d){i.decodeDracoFile(u,function(f){for(let p in f.attributes){let m=f.attributes[p],g=a[p];g!==void 0&&(m.normalized=g)}h(f)},o,c,it,d)})})}},Oc=class{constructor(){this.name=oe.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Fc=class{constructor(){this.name=oe.KHR_MESH_QUANTIZATION}},Go=class extends Et{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)t[r]=n[s+r];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,o=this.valueSize,a=o*2,c=o*3,u=i-t,h=(n-t)/u,d=h*h,f=d*h,p=e*c,m=p-c,g=-2*f+3*d,b=f-d,v=1-g,y=b-d+h;for(let _=0;_!==o;_++){let S=r[m+_+o],E=r[m+_+a]*u,C=r[p+_+o],T=r[p+_]*u;s[_]=v*S+y*E+g*C+b*T}return s}},Yb=new Z,Uc=class extends Go{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return Yb.fromArray(s).normalize().toArray(s),s}},ht={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Bi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ld={9728:Si,9729:$t,9984:kl,9985:Gl,9986:zl,9987:jn},Dd={33071:Fn,33648:us,10497:Ht},fc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Bc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},pn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Zb={CUBICSPLINE:void 0,LINEAR:zn,STEP:kn},pc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Kb(l){return l.DefaultMaterial===void 0&&(l.DefaultMaterial=new Ne({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Is})),l.DefaultMaterial}function Qn(l,e,t){for(let n in t.extensions)l[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ct(l,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(l.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function jb(l,e,t){let n=!1,i=!1,s=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(l);let r=[],o=[],a=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(n){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):l.attributes.position;r.push(d)}if(i){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):l.attributes.normal;o.push(d)}if(s){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):l.attributes.color;a.push(d)}}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(a)]).then(function(c){let u=c[0],h=c[1],d=c[2];return n&&(l.morphAttributes.position=u),i&&(l.morphAttributes.normal=h),s&&(l.morphAttributes.color=d),l.morphTargetsRelative=!0,l})}function Jb(l,e){if(l.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)l.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(l.morphTargetInfluences.length===t.length){l.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)l.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function $b(l){let e,t=l.extensions&&l.extensions[oe.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+mc(t.attributes):e=l.indices+":"+mc(l.attributes)+":"+l.mode,l.targets!==void 0)for(let n=0,i=l.targets.length;n<i;n++)e+=":"+mc(l.targets[n]);return e}function mc(l){let e="",t=Object.keys(l).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+l[t[n]]+";";return e}function kc(l){switch(l){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Qb(l){return l.search(/\.jpe?g($|\?)/i)>0||l.search(/^data\:image\/jpeg/)===0?"image/jpeg":l.search(/\.webp($|\?)/i)>0||l.search(/^data\:image\/webp/)===0?"image/webp":l.search(/\.ktx2($|\?)/i)>0||l.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var ev=new F,zc=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new qb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;let a=o.match(/Version\/(\d+)/);i=n&&a?parseInt(a[1],10):-1,s=o.indexOf("Firefox")>-1,r=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&r<98?this.textureLoader=new ws(this.options.manager):this.textureLoader=new Es(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Li(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let o={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return Qn(s,o,i),Ct(o,i),Promise.all(n._invokeAll(function(a){return a.afterRoot&&a.afterRoot(o)})).then(function(){for(let a of o.scenes)a.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i].joints;for(let o=0,a=r.length;o<a;o++)e[r[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(r,o)=>{let a=this.associations.get(r);a!=null&&this.associations.set(o,a);for(let[c,u]of r.children.entries())s(u,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[oe.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(Jt.resolveURL(t.uri,i.path),s,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=fc[i.type],o=Bi[i.componentType],a=i.normalized===!0,c=new o(i.count*r);return Promise.resolve(new ie(c,r,a))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(r){let o=r[0],a=fc[i.type],c=Bi[i.componentType],u=c.BYTES_PER_ELEMENT,h=u*a,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,m,g;if(f&&f!==h){let b=Math.floor(d/f),v="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+b+":"+i.count,y=t.cache.get(v);y||(m=new c(o,b*f,i.count*f/u),y=new Gn(m,f/u),t.cache.add(v,y)),g=new cn(y,a,d%f/u,p)}else o===null?m=new c(i.count*a):m=new c(o,d,i.count*a),g=new ie(m,a,p);if(i.sparse!==void 0){let b=fc.SCALAR,v=Bi[i.sparse.indices.componentType],y=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,S=new v(r[1],y,i.sparse.count*b),E=new c(r[2],_,i.sparse.count*a);o!==null&&(g=new ie(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let C=0,T=S.length;C<T;C++){let R=S[C];if(g.setX(R,E[C*a]),a>=2&&g.setY(R,E[C*a+1]),a>=3&&g.setZ(R,E[C*a+2]),a>=4&&g.setW(R,E[C*a+3]),a>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,r=t.images[s],o=this.textureLoader;if(r.uri){let a=n.manager.getHandler(r.uri);a!==null&&(o=a)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){let i=this,s=this.json,r=s.textures[e],o=s.images[t],a=(o.uri||o.bufferView)+":"+r.sampler;if(this.textureCache[a])return this.textureCache[a];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=r.name||o.name||"",u.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(u.name=o.uri);let d=(s.samplers||{})[r.sampler]||{};return u.magFilter=Ld[d.magFilter]||$t,u.minFilter=Ld[d.minFilter]||jn,u.wrapS=Dd[d.wrapS]||Ht,u.wrapT=Dd[d.wrapT]||Ht,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Si&&u.minFilter!==$t,i.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[a]=c,c}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let r=i.images[e],o=self.URL||self.webkitURL,a=r.uri||"",c=!1;if(r.bufferView!==void 0)a=n.getDependency("bufferView",r.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:r.mimeType});return a=o.createObjectURL(d),a});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(a).then(function(h){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(m){let g=new at(m);g.needsUpdate=!0,d(g)}),t.load(Jt.resolveURL(h,s.path),p,void 0,f)})}).then(function(h){return c===!0&&o.revokeObjectURL(a),Ct(h,r),h.userData.mimeType=r.mimeType||Qb(r.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",a),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),s.extensions[oe.KHR_TEXTURE_TRANSFORM]){let o=n.extensions!==void 0?n.extensions[oe.KHR_TEXTURE_TRANSFORM]:void 0;if(o){let a=s.associations.get(r);r=s.extensions[oe.KHR_TEXTURE_TRANSFORM].extendTexture(r,o),s.associations.set(r,a)}}return i!==void 0&&(r.colorSpace=i),e[t]=r,r})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){let o="PointsMaterial:"+n.uuid,a=this.cache.get(o);a||(a=new hn,je.prototype.copy.call(a,n),a.color.copy(n.color),a.map=n.map,a.sizeAttenuation=!1,this.cache.add(o,a)),n=a}else if(e.isLine){let o="LineBasicMaterial:"+n.uuid,a=this.cache.get(o);a||(a=new Pi,je.prototype.copy.call(a,n),a.color.copy(n.color),a.map=n.map,this.cache.add(o,a)),n=a}if(i||s||r){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),r&&(o+="flat-shading:");let a=this.cache.get(o);a||(a=n.clone(),s&&(a.vertexColors=!0),r&&(a.flatShading=!0),i&&(a.normalScale&&(a.normalScale.y*=-1),a.clearcoatNormalScale&&(a.clearcoatNormalScale.y*=-1)),this.cache.add(o,a),this.associations.set(a,this.associations.get(n))),n=a}e.material=n}getMaterialType(){return Ne}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],r,o={},a=s.extensions||{},c=[];if(a[oe.KHR_MATERIALS_UNLIT]){let h=i[oe.KHR_MATERIALS_UNLIT];r=h.getMaterialType(),c.push(h.extendParams(o,s,t))}else{let h=s.pbrMetallicRoughness||{};if(o.color=new L(1,1,1),o.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],it),o.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",h.baseColorTexture,j)),o.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,o.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",h.metallicRoughnessTexture))),r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=$);let u=s.alphaMode||pc.OPAQUE;if(u===pc.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,u===pc.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&r!==z&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new B(1,1),s.normalTexture.scale!==void 0)){let h=s.normalTexture.scale;o.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&r!==z&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&r!==z){let h=s.emissiveFactor;o.emissive=new L().setRGB(h[0],h[1],h[2],it)}return s.emissiveTexture!==void 0&&r!==z&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,j)),Promise.all(c).then(function(){let h=new r(o);return s.name&&(h.name=s.name),Ct(h,s),t.associations.set(h,{materials:e}),s.extensions&&Qn(i,h,s),h})}createUniqueName(e){let t=ve.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[oe.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(a){return Nd(a,o,t)})}let r=[];for(let o=0,a=e.length;o<a;o++){let c=e[o],u=$b(c),h=i[u];if(h)r.push(h.promise);else{let d;c.extensions&&c.extensions[oe.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Nd(new re,c,t),c.mode===ht.TRIANGLE_STRIP?d=d.then(f=>ac(f,Ps)):c.mode===ht.TRIANGLE_FAN&&(d=d.then(f=>ac(f,Oi))),i[u]={primitive:c,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,o=[];for(let a=0,c=r.length;a<c;a++){let u=r[a].material===void 0?Kb(this.cache):this.getDependency("material",r[a].material);o.push(u)}return o.push(t.loadGeometries(r)),Promise.all(o).then(async function(a){let c=a.slice(0,a.length-1),u=a[a.length-1],h=[];for(let f=0,p=u.length;f<p;f++){let m=u[f],g=r[f],b,v=c[f];if(g.mode===ht.TRIANGLES||g.mode===ht.TRIANGLE_STRIP||g.mode===ht.TRIANGLE_FAN||g.mode===void 0){let y=s.isSkinnedMesh===!0,_=m.hasAttribute("skinIndex")&&m.hasAttribute("skinWeight");y&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),b=y&&_?new gs(m,v):new k(m,v),b.isSkinnedMesh===!0&&b.normalizeSkinWeights()}else if(g.mode===ht.LINES)b=new bs(m,v);else if(g.mode===ht.LINE_STRIP)b=new Vn(m,v);else if(g.mode===ht.LINE_LOOP)b=new vs(m,v);else if(g.mode===ht.POINTS)b=new bt(m,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(b.geometry.morphAttributes).length>0&&Jb(b,s),b.name=t.createUniqueName(s.name||"mesh_"+e),Ct(b,s),g.extensions&&Qn(i,b,g),t.assignFinalMaterial(b),h.push(b)}for(let f=0,p=h.length;f<p;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return s.extensions&&Qn(i,h[0],s),h[0];let d=new _e;s.extensions&&Qn(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=h.length;f<p;f++)d.add(h[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new qn(Yl.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ni(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ct(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),r=i,o=[],a=[];for(let c=0,u=r.length;c<u;c++){let h=r[c];if(h){o.push(h);let d=new F;s!==null&&d.fromArray(s.array,c*16),a.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new xs(o,a)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,r=[],o=[],a=[],c=[],u=[];for(let h=0,d=i.channels.length;h<d;h++){let f=i.channels[h],p=i.samplers[f.sampler],m=f.target,g=m.node,b=i.parameters!==void 0?i.parameters[p.input]:p.input,v=i.parameters!==void 0?i.parameters[p.output]:p.output;m.node!==void 0&&(r.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",b)),a.push(this.getDependency("accessor",v)),c.push(p),u.push(m))}return Promise.all([Promise.all(r),Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],f=h[1],p=h[2],m=h[3],g=h[4],b=[];for(let y=0,_=d.length;y<_;y++){let S=d[y],E=f[y],C=p[y],T=m[y],R=g[y];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let P=n._createAnimationTracks(S,E,C,T,R);if(P)for(let I=0;I<P.length;I++)b.push(P[I])}let v=new Wn(s,void 0,b);return Ct(v,i),v})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&r.traverse(function(o){if(o.isMesh)for(let a=0,c=i.weights.length;a<c;a++)o.morphTargetInfluences[a]=i.weights[a]}),r})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),r=[],o=i.children||[];for(let c=0,u=o.length;c<u;c++)r.push(n.getDependency("node",o[c]));let a=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),a]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,ev)});for(let f=0,p=h.length;f<p;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){let f=u.userData.pivot,p=h[0];u.pivot=new M().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],p.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],r=s.name?i.createUniqueName(s.name):"",o=[],a=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return a&&o.push(a),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let u;if(s.isBone===!0?u=new Ii:c.length>1?u=new _e:c.length===1?u=c[0]:u=new Ae,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=r),Ct(u,s),s.extensions&&Qn(n,u,s),s.matrix!==void 0){let h=new F;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);if(!i.associations.has(u))i.associations.set(u,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let h=i.associations.get(u);i.associations.set(u,{...h})}return i.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new _e;n.name&&(s.name=i.createUniqueName(n.name)),Ct(s,n),n.extensions&&Qn(t,s,n);let r=n.nodes||[],o=[];for(let a=0,c=r.length;a<c;a++)o.push(i.getDependency("node",r[a]));return Promise.all(o).then(function(a){for(let u=0,h=a.length;u<h;u++){let d=a[u];d.parent!==null?s.add(ko(d)):s.add(d)}let c=u=>{let h=new Map;for(let[d,f]of i.associations)(d instanceof je||d instanceof at)&&h.set(d,f);return u.traverse(d=>{let f=i.associations.get(d);f!=null&&h.set(d,f)}),h};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){let r=[],o=e.name?e.name:e.uuid,a=[];function c(f){f.morphTargetInfluences&&a.push(f.name?f.name:f.uuid)}pn[s.path]===pn.weights?(c(e),e.isGroup&&e.children.forEach(c)):a.push(o);let u;switch(pn[s.path]){case pn.weights:u=Zt;break;case pn.rotation:u=Kt;break;case pn.translation:case pn.scale:u=dn;break;default:n.itemSize===1?u=Zt:u=dn;break}let h=i.interpolation!==void 0?Zb[i.interpolation]:zn,d=this._getArrayFromAccessor(n);for(let f=0,p=a.length;f<p;f++){let m=new u(a[f]+"."+pn[s.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),r.push(m)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=kc(t.constructor),i=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Kt?Uc:Go;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function tv(l,e,t){let n=e.attributes,i=new Ce;if(n.POSITION!==void 0){let o=t.json.accessors[n.POSITION],a=o.min,c=o.max;if(a!==void 0&&c!==void 0){if(i.set(new M(a[0],a[1],a[2]),new M(c[0],c[1],c[2])),o.normalized){let u=kc(Bi[o.componentType]);i.min.multiplyScalar(u),i.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let o=new M,a=new M;for(let c=0,u=s.length;c<u;c++){let h=s[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(a.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),a.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),a.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let m=kc(Bi[d.componentType]);a.multiplyScalar(m)}o.max(a)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}l.boundingBox=i;let r=new X;i.getCenter(r.center),r.radius=i.min.distanceTo(i.max)/2,l.boundingSphere=r}function Nd(l,e,t){let n=e.attributes,i=[];function s(r,o){return t.getDependency("accessor",r).then(function(a){l.setAttribute(o,a)})}for(let r in n){let o=Bc[r]||r.toLowerCase();o in l.attributes||i.push(s(n[r],o))}if(e.indices!==void 0&&!l.index){let r=t.getDependency("accessor",e.indices).then(function(o){l.setIndex(o)});i.push(r)}return We.workingColorSpace!==it&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${We.workingColorSpace}" not supported.`),Ct(l,e),tv(l,e,t),Promise.all(i).then(function(){return e.targets!==void 0?jb(l,e.targets,t):l})}var Fd={head:1.3,thigh_l:.9,thigh_r:.9,upperarm_l:.9,upperarm_r:.9,spine_01:.95},Ud=[16734815,4171775,16765503,6213994,16748497,16751421,10185727],Ho=class{constructor(e,t){x(this,"g",e);x(this,"stats",{kids:0,families:0,visible:0});x(this,"gl",[]);x(this,"pool",[]);x(this,"group",new _e);x(this,"cap");x(this,"shadows");x(this,"v",new M);let n=e.real.q.name;this.cap=n==="low"?3:n==="med"?8:14,this.shadows=!t,this.group.name="aw:kids",e.scene.add(this.group);let i=new ki;Promise.all(["ped_maya","ped_sam"].map(s=>i.loadAsync(`./models/${s}.glb`))).then(s=>{this.gl=s,console.info("[aw-kids] models",s.map(r=>r.animations.map(o=>o.name).join("|")))}).catch(s=>console.warn("[aw-kids]",s))}make(e){if(!this.gl.length)return null;let t=this.gl[e%this.gl.length],n=ko(t.scene);n.rotation.y=Math.PI;let i=new _e;i.add(n),i.scale.setScalar(.6+e%3*.04);let s=new L(Ud[e%Ud.length]),r=[];n.traverse(h=>{let d=h;if((d.isMesh||d.isSkinnedMesh)&&(d.castShadow=this.shadows,d.frustumCulled=!1,/accessory|held/i.test(d.name)&&(d.visible=!1),d.material)){let f=d.material.clone();/top/i.test(f.name||"")&&f.color&&f.color.copy(s),h.material=f}Fd[h.name]&&r.push([h,Fd[h.name]])});let o=new Rs(n),a=h=>t.animations.find(d=>d.name===h)||t.animations[0],c=o.clipAction(a("Walk_Brisk")),u=o.clipAction(a("Jog"));return c.play(),u.play(),u.setEffectiveWeight(0),c.time=Math.random()*c.getClip().duration,i.visible=!1,this.group.add(i),this.stats.kids++,{root:i,inner:n,mixer:o,walk:c,jog:u,bones:r,ped:null,slot:0}}update(e){let t=this.g.real.amb;if(!t||!this.gl.length)return;let n=this.g.camera.position,i=this.g.real;for(let a of t.peds)if(a.pedFlip=1,a.rd!==a.__rd){a.__rd=a.rd;for(let c of this.pool)c.ped===a&&(c.ped=null,c.root.visible=!1);if(a.__fam=0,a.rd&&Math.random()<.4){let c=Math.random();a.__fam=c<.06?3:c<.5?2:1;for(let u=0;u<a.__fam;u++){let h=this.pool.find(d=>!d.ped);if(!h&&this.pool.length<this.cap){let d=this.make(this.pool.length);d&&(this.pool.push(d),h=d)}if(!h)break;h.ped=a,h.slot=u}}}let s=0,r=0,o=new Set;for(let a of this.pool){let c=a.ped;if(!c||!c.rd||!c.g.visible){a.root.visible=!1;continue}let u=c.g.position;if(n.distanceToSquared(u)>19600){a.root.visible=!1;continue}o.has(c)||(o.add(c),r++);let h=c.g.rotation.y,d=-Math.sin(h),f=-Math.cos(h),p=a.slot===1?-1:1,m=a.slot===2?0:.75*p,g=a.slot===2?.9:.15,b=u.x+f*m-d*g,v=u.z-d*m-f*g;a.root.position.set(b,i.surfaceAt(b,v)+.02,v),a.root.rotation.y=h,a.root.visible=!0,s++;let y=c.sp||1.3,_=a.root.scale.x,S=y/(1.8*_),E=S>1.45?1:0;if(a.walk.setEffectiveWeight(1-E),a.jog.setEffectiveWeight(E),a.walk.timeScale=Math.min(1.6,S),a.jog.timeScale=Math.min(1.3,y/(3.2*_)),a.applied)for(let[C,T]of a.bones)C.scale.divideScalar(T);a.mixer.update(e),a.applied=!0;for(let[C,T]of a.bones)C.scale.multiplyScalar(T)}this.stats.visible=s,this.stats.families=r}};var Fe=()=>performance.now();function nv(l){if(!l.length)return null;let e=new Map;for(let i of l){let s=i.geometry.attributes.position.array,r=i.material.uuid+"|"+Math.floor((s[0]+s[3]+s[6])/3/80)+","+Math.floor((s[2]+s[5]+s[8])/3/80),o=e.get(r);o||e.set(r,o=[]),o.push(i)}let t=l[0].parent.constructor,n=new t;for(let i of e.values()){let s=i[0],r=Object.keys(s.geometry.attributes),o=i.every(a=>!a.geometry.index&&Object.keys(a.geometry.attributes).join()===r.join());if(i.length>1&&o){let a=new s.geometry.constructor;for(let c of r){let u=0;for(let p of i)u+=p.geometry.attributes[c].array.length;let h=new Float32Array(u),d=s.geometry.attributes[c],f=0;for(let p of i)h.set(p.geometry.attributes[c].array,f),f+=p.geometry.attributes[c].array.length;a.setAttribute(c,new d.constructor(h,d.itemSize,d.normalized))}a.computeBoundingSphere();for(let c of i)c.geometry.dispose();s.geometry=a,n.add(s)}else for(let a of i)n.add(a)}return n}var Vo=class{constructor(e=4){x(this,"budget",e);x(this,"stats",{roadSlices:0,bldSlices:0,streetSlices:0,maxSlice:0,msPerM:0,msPerB:0,msPerW:0,stageMax:{}});let t=window;t.__awRoadJob=(n,i)=>this.roadJob(n,i),t.__awBldJob=(n,i,s)=>this.bldJob(n,i,s),t.__awStreetJob=(n,i)=>this.streetJob(n,i)}streetJob(e,t){let n=t.st,i=(c,u)=>Object.assign(Object.create(t),{st:{cars:[],walls:[],signs:[],...c},json:u}),s=[],r=[];if(n){let c=n.cars||[],u=Math.max(1,Math.round(this.budget*12));for(let p=0;p<c.length;p+=u){let m=c.slice(p,p+u);s.push(()=>t.group.add(e.streets.build(i({cars:m},null)))),r.push("cars")}s.push(()=>t.group.add(e.streets.build(i({},t.json)))),r.push("furniture");let h=n.walls||[],d=[],f=0;s.push(()=>{let p=Fe();for(;f<h.length;){let m=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerW||1))),g=Fe(),b=h.slice(f,f+m);e.streets.build(i({walls:b},null)).traverse(y=>{y.isMesh&&d.push(y)});let v=(Fe()-g)/b.length;if(this.stats.msPerW=this.stats.msPerW?this.stats.msPerW*.8+v*.2:v,f+=b.length,Fe()-p>this.budget*.6)return!1}return!0}),r.push("walls"),s.push(()=>{let p=nv(d);p&&t.group.add(p)}),r.push("wallsMerge"),s.push(()=>t.group.add(e.streets.build(i({signs:n.signs||[]},null)))),r.push("signs"),n.pools&&n.pools.length&&(s.push(()=>t.group.add(e.marks.pools({pools:n.pools}))),r.push("pools"))}let o=0,a=()=>{let c=Fe();for(;o<s.length;){let u=Fe(),h=s[o]()!==!1,d=Fe()-u,f=r[o];if(h&&o++,d>(this.stats.stageMax[f]||0)&&(this.stats.stageMax[f]=+d.toFixed(1)),Fe()-c>this.budget*.6)break}this.stats.streetSlices++,this.note(Fe()-c),o<s.length&&e.queue.unshift({R:t,f:a})};return a}note(e){e>this.stats.maxSlice&&(this.stats.maxSlice=e)}roadJob(e,t){let n=t.json.roads,i=n.map(h=>{let d=0;for(let f=1;f<h.p.length;f++)d+=Math.hypot(h.p[f][0]-h.p[f-1][0],h.p[f][1]-h.p[f-1][1]);return d+20}),s=0,r=null,o=null,a=!1,c=h=>{let d=e.roadGrid(h);for(let[f,p]of d){let m=o.get(f);m?m.push(...p):o.set(f,p)}},u=()=>{let h=Fe();for(r||(r=e.junctionsNear(t),o=new Map);!a;){let d=Math.max(60,this.budget*.8/(this.stats.msPerM||.004)),f=s,p=0;for(;f<n.length&&(f===s||p+i[f]<d);)p+=i[f++];let m=Fe(),g=f>=n.length&&s>=n.length,b=g?e.roads.build({roads:[],junc:t.json.junc},r):e.roads.build({roads:n.slice(s,f),junc:[]},r);if(b.traverse(v=>{v.name=v.name||(g?"plate":"road")}),t.roadMesh?(t.roadMesh.add(b),c(b)):(t.roadMesh=b,t.group.add(b),c(b)),!g&&p>0){let v=(Fe()-m)/p;this.stats.msPerM=this.stats.msPerM?this.stats.msPerM*.8+v*.2:v}if(g?a=!0:s=f,Fe()-h>this.budget*.6)break}t.roadGrid=o,this.stats.roadSlices++,this.note(Fe()-h),a||e.queue.unshift({R:t,f:u})};return u}bldJob(e,t,n){let i=0,s=()=>{let r=Fe();for(;i<n.length;){let o=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerB||.5))),a=n.slice(i,i+o),c=Fe(),u=e.buildings.build({b:a});u.traverse(d=>{d.isMesh&&(d.name="bld:"+(d.material.name||d.material.type))}),t.group.add(u);let h=(Fe()-c)/a.length;if(this.stats.msPerB=this.stats.msPerB?this.stats.msPerB*.8+h*.2:h,i+=a.length,Fe()-r>this.budget*.6)break}this.stats.bldSlices++,this.note(Fe()-r),i<n.length&&e.queue.unshift({R:t,f:s})};return s}};var Wo=class{constructor(e){x(this,"g",e);x(this,"on",!1);x(this,"n",0);x(this,"stats",{aoHalf:!1,shadowEvery:1,a2c:0});x(this,"a2c",new WeakSet);x(this,"scanT",0);let t=e.real?.q;if(!t||t.name!=="high")return;this.on=!0,window.__awAoT=5e3;let n=window.__awPost;if(n&&n.ao){let i=n.ao,s=i.setSize.bind(i);i.setSize=(r,o)=>s(Math.max(1,Math.ceil(r/2)),Math.max(1,Math.ceil(o/2))),i.updateGtaoMaterial({samples:8}),i.updatePdMaterial({samples:8}),n.resize(),this.stats.aoHalf=!0}this.stats.shadowEvery=2}coverage(){this.g.scene.traverse(e=>{let t=e.material;if(t)for(let n of Array.isArray(t)?t:[t])this.a2c.has(n)||(this.a2c.add(n),n.alphaTest>0&&!n.transparent&&!n.alphaToCoverage&&(n.alphaToCoverage=!0,n.needsUpdate=!0,this.stats.a2c++))})}frame(){if(!this.on)return;this.stats.aoHalf&&(this.scanT-=1/60)<=0&&(this.scanT=3,this.coverage());let e=this.g.renderer.shadowMap;e.autoUpdate=!1,(this.n++&1)===0&&(e.needsUpdate=!0)}};var Xo=class{constructor(e){x(this,"on",!1);x(this,"stats",{water:!1,veg3d:0});let t=e.real;if(!t||!t.q||t.q.name!=="high")return;this.on=!0;let n=t.water?.nrm;n&&H.get("hlwater")!=="0"&&(n.anisotropy=16,n.needsUpdate=!0,this.stats.water=!0),H.get("hlveg")!=="0"&&(t.q.veg3d=340),this.stats.veg3d=t.q.veg3d}};var Bd=new Map,qo=new Map,zi=new ze(1,1,1);function dt(l,e,t=.5,n=.1){let i=qo.get(l);return i||(i=new Ne({color:e,roughness:t,metalness:n}),qo.set(l,i)),i}function It(l,e,t=512,n=128,i=.42,s=.1){let r=qo.get(l);if(r)return r;let o=Bd.get(l);if(!o){let a=document.createElement("canvas");a.width=t,a.height=n;let c=a.getContext("2d");e(c,t,n),o=new le(a),o.colorSpace=j,o.flipY=!1,o.anisotropy=4,Bd.set(l,o)}return r=new Ne({map:o,roughness:i,metalness:s}),qo.set(l,r),r}function Qe(l,e,t,n,i,s,r="bold",o="left",a="Arial, Helvetica, sans-serif"){l.font=`${r} ${i}px ${a}`,l.fillStyle=s,l.textAlign=o,l.textBaseline="middle",l.fillText(e,t,n)}function iv(l,e,t,n){l.save(),l.translate(e,t),l.scale(n,n),l.beginPath(),l.moveTo(-18,-30),l.lineTo(18,-30),l.lineTo(18,8),l.quadraticCurveTo(0,32,-18,8),l.closePath(),l.fillStyle="#1d4fb3",l.fill(),l.lineWidth=3,l.strokeStyle="#0d2a66",l.stroke(),l.fillStyle="#e9eef6",l.fillRect(-11,-22,22,22),l.fillStyle="#2e8b3a",l.beginPath(),l.ellipse(-14,10,6,13,.5,0,6.3),l.ellipse(14,10,6,13,-.5,0,6.3),l.fill(),l.fillStyle="#9aa3ad",l.fillRect(-2,-26,4,40),l.fillStyle="#1d4fb3",l.fillRect(-14,22,28,6),l.restore()}function kd(l,e){return(t,n,i)=>{t.fillStyle="#f4f5f7",t.fillRect(0,0,n,i);let s=r=>(e?r:1-r)*n;t.fillStyle="#1747b8",t.fillRect(0,i*.3,n,i*.17),t.fillStyle="#f2c81e",t.fillRect(0,i*.5,n,i*.035),t.fillRect(0,i*.555,n,i*.02),iv(t,s(.36),i*.42,1.05),Qe(t,"POLIS",s(.62),i*.385,38,"#ffffff","bold","center"),Qe(t,"Servicio, Integridad, Seguridad.",s(.47),i*.7,19,"#c8202a","bold","center"),Qe(t,String(l),s(.13),i*.18,30,"#111","bold","center"),Qe(t,"\u260E100",s(.8),i*.18,24,"#1747b8","bold","center"),Qe(t,String(l),s(.93),i*.42,34,"#111","bold","center"),t.strokeStyle="#1747b8",t.lineWidth=7;for(let r=0;r<2;r++)t.beginPath(),t.moveTo(s(.84+r*.035),i*.47),t.lineTo(s(.87+r*.035),i*.3),t.stroke()}}function zd(l){return(e,t,n)=>{e.fillStyle="#f4f5f7",e.fillRect(0,0,t,n);let i=s=>(l?s:1-s)*t;e.fillStyle="#1f3b73",e.fillRect(0,n*.6,t,n*.05),Qe(e,"ForenSys",i(.45),n*.36,44,"#1f3b73","bold","center"),Qe(e,"ARUBA \xB7 Accident Registration",i(.45),n*.52,16,"#1f3b73","bold","center")}}function Gd(l,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;if(t.fillStyle=l?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),l)t.strokeStyle="#ffffff",t.lineWidth=16,t.beginPath(),t.moveTo(s(.05),i*.62),t.bezierCurveTo(s(.35),i*.85,s(.55),i*.15,s(.95),i*.45),t.stroke(),t.strokeStyle="#8f6fb8",t.lineWidth=5,t.beginPath(),t.moveTo(s(.05),i*.66),t.bezierCurveTo(s(.35),i*.9,s(.55),i*.2,s(.95),i*.5),t.stroke(),t.fillStyle="#ffffff",t.fillRect(s(.42)-46,i*.22,92,30),Qe(t,"InSan",s(.42),i*.22+15,24,"#2b6cc4","bold","center");else{t.fillStyle="#1f3a9c",t.fillRect(0,i*.5,n,i*.09),t.fillStyle="#e8ef1c",t.fillRect(s(.42)-n*.36,i*.5,n*.72,i*.09),Qe(t,"AMBULANCE",s(.42),i*.545,30,"#1f3a9c","bold","center"),t.fillStyle="#1f3a9c",t.beginPath();let r=s(.06),o=s(0);t.moveTo(r,i*.5),t.lineTo(o,i*.5),t.lineTo(o,i*.59),t.fill()}}}function Hd(l,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;t.fillStyle=l?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),l?(t.fillStyle="#ffffff",t.fillRect(0,i*.3,n,i*.05)):(t.fillStyle="#1f3a9c",t.fillRect(0,i*.3,n,i*.12)),Qe(t,"911",s(.55),i*.62,44,l?"#ffffff":"#c8202a","bold","center"),l||Qe(t,"PA SALBA BO BIDA",s(.55),i*.8,13,"#c8202a","bold","center")}}function Gc(l,e,t,n,i,s,r){return It(l,o=>{o.fillStyle=e,o.fillRect(0,0,s,r),Qe(o,t,s/2,r/2,i,n,"bold","center")},s,r)}function sv(l){return It("evPlate"+l,(e,t,n)=>{e.fillStyle="#f4f2ea",e.fillRect(0,0,t,n),e.strokeStyle="#1d3f8a",e.lineWidth=4,e.strokeRect(3,3,t-6,n-6),Qe(e,"ARUBA",t/2,13,12,"#1d3f8a","bold","center"),Qe(e,`A-${1e4+l*37}`,t/2,40,34,"#1d3f8a","bold","center")},256,64,.4,0)}var Ns=null,Vd=null;function Os(){return Vd||(Vd=new ki().loadAsync("./models/ev.glb?v=e1").then(l=>{let e=[];l.scene.traverse(t=>{var s;let n=/^ev(\d)_(?:L(\d)_([a-z]+)|(bar|mk))$/.exec(t.name);if(!n)return;let i=e[s=+n[1]]||(e[s]={lods:[new Map,new Map],bar:{p:new M,w:1}});n[3]&&t.isMesh?i.lods[+n[2]].set(n[3],t.geometry):n[4]==="bar"?i.bar={p:t.position.clone(),w:t.scale.x}:n[4]==="mk"&&(i.mk=t.position.clone())}),Ns=e}).catch(l=>{console.warn("[aw-ev] models/ev.glb",l)}))}var Fs=()=>!!Ns,rv={everest:0,forensys:0,isuzu:1,ambY:2,ambP:2},ov=45;function av(l,e){let t=l==="ambY"||l==="ambP",n=l==="ambP",i=l==="forensys",s=t?n?"#f29ac4":"#e8ef1c":"#f4f5f7",r=dt("evPaint"+s,s,.42,.1),o={paint:r,glass:dt("evGlass","#121a21",.08,.6),dark:dt("evDark","#1c1d20",.8,.05),chrome:dt("evChrome","#d6d9dc",.18,.95),light:dt("evLight","#eef2f5",.15,.3),tail:dt("evTail","#a3151a",.3,.1),plate:sv(e)};return t?(o.livr=It("abR"+l,Gd(n,!0),512,264),o.livl=It("abL"+l,Gd(n,!1),512,264),o.cabr=It("acR"+l,Hd(n,!0),256,192),o.cabl=It("acL"+l,Hd(n,!1),256,192),o.rear=Gc("aback"+l,s,n?"InSan  911":"AMBULANCE",n?"#ffffff":"#1f3a9c",40,512,122)):i?(o.livr=It("fsR",zd(!0),768,128),o.livl=It("fsL",zd(!1),768,128),o.hood=o.rear=r):(o.livr=It(`pR${e}`,kd(e,!0),768,128),o.livl=It(`pL${e}`,kd(e,!1),768,128),o.hood=Gc("hoodPolis","#f4f5f7","POLIS","#1747b8",64,256,128),o.rear=Gc(`rear${e}`,"#f4f5f7",`\u260E100   ${e}`,"#1747b8",44,512,76)),o}function Xd(l){let e=dt("evLight","#eef2f5",.15,.3),t=dt("evTail","#a3151a",.3,.1);e.emissive.setRGB(1,.95,.85).multiplyScalar(l*.6),t.emissive.setRGB(1,.12,.06).multiplyScalar(l),t.emissiveIntensity=1+2*l}var lv=(()=>{let l=new ke(.5,12,6),e=l.attributes.position,t=n=>Math.sign(n)*Math.abs(2*n)**.3/2;for(let n=0;n<e.count;n++)e.setXYZ(n,t(e.getX(n)),t(e.getY(n)),t(e.getZ(n)));return l})(),Wd=(l,e,t,n,i,s,r,o)=>{let a=new k(lv,new z({color:e,toneMapped:!1}));return a.scale.set(s,r,o),a.position.set(t,n,i),a.name="aw:ebar",l.add(a),a};function Us(l,e=45){let t=new _e;t.name="aw:ev:"+l;let n=l==="ambY"||l==="ambP",s={g:t,bar:[],colors:l==="forensys"?[16752640,16752640]:n?[16715784,16777215]:[16715784,1720575]},r=()=>{let o=Ns&&Ns[rv[l]];if(!o)return;let a=av(l,e),c=new ms;c.name="aw:evlod",o.lods.forEach((d,f)=>{let p=new _e;for(let[m,g]of d){let b=a[m];if(!b)continue;let v=new k(g,b);v.castShadow=f===0,v.matrixAutoUpdate=!1,p.add(v)}c.addLevel(p,f?ov:0),p.visible=f===0}),t.add(c);let{p:u,w:h}=o.bar;for(let d of[-1,1])s.bar.push(Wd(t,2105380,d*h*.25,u.y+.05,u.z,h*.48,.1,.26));if(n&&o.mk)for(let d of[-1,1])s.bar.push(Wd(t,5246992,d*o.mk.x,o.mk.y,o.mk.z,.22,.14,.05))};return Ns?r():Os().then(r),s}var cv=new ke(.12,10,8);function Bs(l,e,t=!1){let n=new _e;n.name="aw:npc";let i=dt("skin"+(Math.random()*3|0),["#8a5a3a","#b07a52","#d2a07a"][Math.random()*3|0],.7,0),s=dt("shirt"+l,l,.8,0),r=dt("pants"+e,e,.8,0),o=new k(zi,r);o.scale.set(.14,.82,.16),o.position.set(-.09,.41,0),o.geometry=zi;let a=o.clone();a.position.x=.09,n.add(o,a);let c=new k(zi,s);c.scale.set(.4,.6,.22),c.position.set(0,1.12,0),n.add(c);let u=new k(cv,i);u.position.set(0,1.56,0),n.add(u);let h=p=>{let m=new _e;m.position.set(p*.25,1.38,0);let g=new k(zi,s);return g.scale.set(.1,.62,.11),g.position.y=-.31,m.add(g),n.add(m),m},d=h(-1),f=h(1);if(t){let p=new k(zi,dt("tablet","#202326",.3,.2));p.scale.set(.24,.32,.02),p.position.set(0,-.6,.12),f.add(p);let m=new k(zi,new z({color:9422591,toneMapped:!1}));m.scale.set(.2,.27,.005),m.position.set(0,-.6,.135),f.add(m),f.rotation.x=-.9}return{g:n,armL:d,armR:f,legL:o,legR:a,t:Math.random()*10}}function Gi(l,e,t,n=!1){if(l.t+=e,t==="walk"){let i=Math.sin(l.t*7)*.5;l.legL.rotation.x=i,l.legR.rotation.x=-i,l.armL.rotation.x=-i*.8,n||(l.armR.rotation.x=i*.8)}else if(l.legL.rotation.x=l.legR.rotation.x=0,t==="talk"){let i=Math.sin(l.t*2.3),s=Math.sin(l.t*3.1+1);l.armL.rotation.x=-.6-.5*Math.max(0,i),l.armL.rotation.z=-.25*s,n||(l.armR.rotation.x=-.4-.6*Math.max(0,s),l.armR.rotation.z=.3*i)}else l.armL.rotation.x=0,n||(l.armR.rotation.x=0);n&&(l.armR.rotation.x=t==="talk"?-.9-.4*Math.max(0,Math.sin(l.t*.7)):-.9)}function Hi(l,e,t,n){let i=(e+t)*2.5%1,s=Math.floor(i*8);l.bar.forEach((r,o)=>{let a=r.material,c=o%2===0,u=n&&(c?s<4&&(s&1)===0:s>=4&&(s&1)===0);a.color.setHex(u?c?l.colors[0]:l.colors[1]:2105380),u&&a.color.multiplyScalar(3)})}function Yo(l){l.traverse(e=>{let t=e;t.isMesh&&t.material&&t.material.isMeshBasicMaterial&&t.material.dispose()})}var qd=new ze(1,1,1),Zo=new L(1,.06,.04),uv=new L(.1,.25,1),hv=new L(1,1,1),ks=new L(.12,.12,.14),Hc={police:{body:"#f4f5f7",stripe:"#1747b8",a:Zo,b:uv},amb:{body:"#f6f6f2",stripe:"#d0121b",a:Zo,b:hv},fire:{body:"#b5141c",stripe:"#f3f3f3",a:Zo,b:Zo}};function dv(l,e,t,n){let i=l.children.filter(m=>m.isMesh&&m.material===e);if(!i.length)return null;l.updateMatrixWorld(!0);let s=l.matrixWorld.clone().invert(),r=new Cs,o=new M,a=new M,c=24,u=t.min.z+(t.max.z-t.min.z)*.07,h=t.max.z-(t.max.z-t.min.z)*.07,d=(m,g,b)=>{o.set(m*(t.max.x+1),g,b).applyMatrix4(l.matrixWorld),a.set(-m,0,0).transformDirection(l.matrixWorld),r.set(o,a);let v=r.intersectObjects(i,!1)[0];if(!v)return null;let y=v.point.applyMatrix4(s);return y.x+=m*.012,y},f=[];for(let m of[-1,1]){let g=null;for(let b=0;b<=c;b++){let v=u+(h-u)*b/c,y=d(m,n-.08,v),_=d(m,n+.08,v),S=y&&_?[y,_]:null;if(g&&S){let[E,C]=m>0?[S,g]:[g,S];f.push(E[0].x,E[0].y,E[0].z,C[0].x,C[0].y,C[0].z,C[1].x,C[1].y,C[1].z,E[0].x,E[0].y,E[0].z,C[1].x,C[1].y,C[1].z,E[1].x,E[1].y,E[1].z)}g=S}}if(!f.length)return null;let p=new re;return p.setAttribute("position",new ue(f,3)),p}var Ko=class{constructor(e){x(this,"g",e);x(this,"stats",{police:0,amb:0,fire:0,active:0,rolls:0});x(this,"st",new Map);x(this,"force",H.get("emerg")==="force");x(this,"time",0);x(this,"night",-1);x(this,"ext",null);Os()}pickRole(){if(this.stats.rolls++,!this.force&&Math.random()>=.1)return null;let e=Math.random()*10;return e<6?"police":e<9?"amb":"fire"}setup(e,t){let n=this.g.real.amb?.mats||{},i=new Set(Object.values(n)),s=new Ce;for(let f of e.g.children){let p=f;if(!p.isMesh||p.name.startsWith("aw:"))continue;p.geometry.computeBoundingBox(),s.union(p.geometry.boundingBox);let m=p.material;!t.paint&&!Array.isArray(m)&&!i.has(m)&&!m.userData?.pid&&m.color&&(t.paint=m)}t.box=s,t.paint&&(t.base={c:t.paint.color.clone(),r:t.paint.roughness,m:t.paint.metalness,cc:t.paint.clearcoat});let r=s.max.x-s.min.x,o=s.max.z-s.min.z,a=s.max.y,c=s.min.z+o*.55;t.bar=[-1,1].map(f=>{let p=new k(qd,new z({color:ks,toneMapped:!1}));return p.scale.set(r*.3,.12,.28),p.position.set(f*r*.16,a+.06,c),p.name="aw:ebar",p.visible=!1,e.g.add(p),p});let u=s.min.y+(a-s.min.y)*.42,h=t.paint?dv(e.g,t.paint,s,u):null,d=new k(h||qd,new z({color:16777215}));h||(d.scale.set(r+.03,.16,o*.86),d.position.set(0,u,(s.min.z+s.max.z)/2)),d.name="aw:estripe",d.visible=!1,e.g.add(d),t.stripe=d}useModel(e,t,n){t.orig||(t.orig=e.g.children.filter(o=>!o.name.startsWith("aw:"))),t.model&&(e.g.remove(t.model.g),Yo(t.model.g),t.model=void 0);let i=(n==="police"||n==="amb")&&Fs();for(let o of t.orig)o.visible=!i;if(!i)return;let s=n==="police"?Math.random()<.6?"everest":"isuzu":Math.random()<.5?"ambY":"ambP",r=Us(s,[45,50,67,38,71][Math.random()*5|0]);e.g.add(r.g),t.model=r,t.mkind=s}apply(e,t,n){if(t.role&&this.stats[t.role]--,t.role=n,n&&this.stats[n]++,this.useModel(e,t,n),t.model){if(t.bar)for(let s of t.bar)s.visible=!1;t.stripe&&(t.stripe.visible=!1),t.on=Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10;return}n&&!t.bar&&this.setup(e,t);let i=t.paint;if(i&&t.base&&(n?(i.color.set(Hc[n].body),i.roughness=.45,i.metalness=.1):(i.color.copy(t.base.c),i.roughness=t.base.r,i.metalness=t.base.m)),t.bar)for(let s of t.bar)s.visible=!!n;t.stripe&&(t.stripe.visible=!!n,n&&t.stripe.material.color.set(Hc[n].stripe)),t.on=!!n&&Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10}update(e){this.time+=e;let t=Math.round(Math.max(0,Math.min(1,(Oe.value-.3)/.4))*50)/50;t!==this.night&&(this.night=t,Xd(t));let i=this.g.real?.amb?.cars;if(!i)return;let s=0;for(let r of i){let o=this.st.get(r.g);if(o||(o={role:null,rd:null,on:!1,t:0,ph:0},this.st.set(r.g,o)),r.rd&&r.rd!==o.rd?(o.rd=r.rd,this.apply(r,o,this.pickRole())):(o.role==="police"||o.role==="amb")&&!o.model&&Fs()&&this.apply(r,o,o.role),o.role&&o.model){(o.t-=e)<=0&&(o.on=!o.on,o.t=o.on?15+Math.random()*25:10+Math.random()*25),Hi(o.model,this.time,o.ph,o.on&&r.g.visible),o.on&&r.g.visible&&s++;continue}if(!o.role||!o.bar)continue;(o.t-=e)<=0&&(o.on=!o.on,o.t=o.on?15+Math.random()*25:10+Math.random()*25);let a=Hc[o.role],[c,u]=o.bar,h=c.material,d=u.material;if(o.on&&r.g.visible){s++;let f=(this.time+o.ph)*2.5%1,p=Math.floor(f*8),m=p<4&&(p&1)===0,g=p>=4&&(p&1)===0;h.color.copy(m?a.a:ks).multiplyScalar(m?3:1),d.color.copy(g?a.b:ks).multiplyScalar(g?3:1)}else h.color.copy(ks),d.color.copy(ks)}this.stats.active=s}};var jo=class{constructor(e,t){x(this,"g",e);x(this,"emerg",t);x(this,"force",H.get("crash")==="force");x(this,"tx",Math.min(10,Math.max(1,+(H.get("crashx")||1))));x(this,"next",this.force?4:60);x(this,"time",0);x(this,"sc",null);x(this,"stats",{scenes:0,active:!1,phase:0,x:0,z:0,police:!1,fs:!1,talk:0,fx:0,fz:0});Os();let n=H.get("evshow");if(n){let i=()=>{this.amb()?this.showroom(n):setTimeout(i,1e3)};setTimeout(i,3e3)}}amb(){return this.g.real.amb||null}pt(e,t,n,i){let s=e.p,r=0;for(let o=1;o<s.length;o++){let a=s[o][0]-s[o-1][0],c=s[o][1]-s[o-1][1],u=Math.hypot(a,c)||1;if(r+u>=t||o===s.length-1){let h=Math.max(0,Math.min(1,(t-r)/u)),d=a/u,f=c/u;return{x:s[o-1][0]+a*h-f*n,z:s[o-1][1]+c*h+d*n,yaw:i>0?Math.atan2(d,f):Math.atan2(-d,-f)}}r+=u}return{x:s[0][0],z:s[0][1],yaw:0}}len(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}put(e,t,n=0){let i=this.amb();e.position.set(t.x,i.w.surfaceAt(t.x,t.z)+.02,t.z),e.rotation.set(0,t.yaw+n,0)}start(){let e=this.amb();if(!e||e.cars.length<3)return!1;let t=this.g.camera.position,n=e.cars.filter(i=>i.rd&&i.v!==4&&i.g.visible&&!i.g.children.some(s=>s.name.startsWith("aw:ev"))&&i.L>100&&!i.rd.ow&&i.rd.w>=6).map(i=>({c:i,d:Math.hypot(i.g.position.x-t.x,i.g.position.z-t.z)})).filter(i=>i.d>50&&i.d<260).sort((i,s)=>i.d-s.d);for(let{c:i}of n){let s=i.s+i.dir*50;if(s<15||s>i.L-15||(i.dir>0?i.s:i.L-i.s)<40)continue;let o=e.cars.filter(u=>u!==i&&u.v!==4&&!u.g.children.some(h=>h.name.startsWith("aw:ev"))).sort((u,h)=>Math.hypot(h.g.position.x-t.x,h.g.position.z-t.z)-Math.hypot(u.g.position.x-t.x,u.g.position.z-t.z))[0];if(!o)return!1;for(let u of[i,o])e.cars.splice(e.cars.indexOf(u),1);let a=i.dir*Math.min(2.2,i.rd.w/4);o.rd=i.rd,o.g.visible=!0;let c=new _e;return c.name="aw:crash",e.group.add(c),this.sc={rd:i.rd,dirA:i.dir,lat:a,sA:i.s,sB:s,impact:0,A:i,B:o,phase:0,age:0,tCrash:0,root:c,drivers:[],talk:0},this.stats.scenes++,this.stats.active=!0,!0}return!1}clear(){let e=this.sc,t=this.amb();e.root.parent?.remove(e.root),Yo(e.root);for(let n of[e.A,e.B])n.rd=null,n.g.visible=!1,n.g.rotation.set(0,n.g.rotation.y,0),t&&t.cars.push(n);this.emerg&&(this.emerg.ext=null),this.sc=null,this.stats.active=!1,this.stats.phase=0}mover(e,t,n,i){let s=Us(e,[45,50,67][Math.random()*3|0]);return this.sc.root.add(s.g),{m:s,s:t,target:n,lat:i,sp:e==="forensys"?11:15,arrived:!1}}drive(e,t){let n=this.sc,i=n.dirA;if(!e.arrived){let r=(e.target-e.s)*i,o=Math.min(e.sp,Math.max(1.2,r*.8));e.s+=i*o*t,r<.3&&(e.arrived=!0)}let s=e.arrived?e.lat:n.lat+(e.lat-n.lat)*Math.max(0,1-Math.abs(e.target-e.s)/25);this.put(e.m.g,this.pt(n.rd,e.s,s,i))}update(e){e*=this.tx,this.time+=e;let t=this.sc;if(!t){(this.next-=e)<=0&&(this.next=this.force?6:60,(this.g.S&&this.g.S.mode||"walk")!=="plane"&&Fs()&&(this.force||Math.random()<.2)&&this.start());return}t.age+=e,this.stats.phase=t.phase,this.stats.police=!!t.police?.arrived,this.stats.fs=!!t.fs?.arrived,this.stats.talk=Math.round(t.talk),t.fs&&(this.stats.fx=t.fs.m.g.position.x,this.stats.fz=t.fs.m.g.position.z);let n=this.g.camera.position,i=this.pt(t.rd,(t.sA+t.sB)/2,t.lat,t.dirA);if(t.age>260||Math.hypot(i.x-n.x,i.z-n.z)>700){this.clear();return}this.stats.x=i.x,this.stats.z=i.z;let s=t.dirA;if(t.phase===0){let o=9*e;t.sA+=s*o,t.sB-=s*o;let a=(t.sB-t.sA)*s,c=Math.max(0,Math.min(1,1-(a-5)/40));this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s)),this.put(t.B.g,this.pt(t.rd,t.sB,-t.lat+2*t.lat*c,-s)),a<=4.6&&(t.phase=1,t.tCrash=t.age,this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s),.28),this.put(t.B.g,this.pt(t.rd,t.sB,t.lat*.75,-s),-.5),t.A.g.rotation.z=.02);return}let r=t.age-t.tCrash;if(r>3&&t.drivers.length===0)for(let[o,a]of[t.sA-s*1.5,t.sB+s*1.5].entries()){let c=Bs(["#2f6fb5","#c8452f","#3f8a4a","#e8c547"][Math.random()*4|0],["#2a2d33","#5a4a3a","#3b4f6b"][Math.random()*3|0]),u=this.pt(t.rd,a,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(c.g,u,o?Math.PI*.5:-Math.PI*.5),t.root.add(c.g),t.drivers.push(c)}for(let o of t.drivers)Gi(o,e,"talk");if(r>8&&!t.police&&(t.police=this.mover(Math.random()<.6?"everest":"isuzu",s>0?0:t.rd.p.length&&this.len(t.rd),t.sA-s*Math.min(13,(s>0?t.sA:this.len(t.rd)-t.sA)-2),t.lat+Math.sign(t.lat||1)*.9)),t.police&&(this.drive(t.police,e),Hi(t.police.m,this.time,0,!0),this.emerg)){let o=t.police.m.g.position;this.emerg.ext={d:Math.hypot(o.x-n.x,o.z-n.z),ph:0}}if(t.police?.arrived&&!t.fs&&(t.fs=this.mover("forensys",s>0?0:this.len(t.rd),t.sA-s*Math.min(24,(s>0?t.sA:this.len(t.rd)-t.sA)-1),t.lat+Math.sign(t.lat||1)*.9)),t.fs&&(this.drive(t.fs,e),Hi(t.fs.m,this.time,1.3,!t.fs.arrived)),t.fs?.arrived&&!t.staff){t.staff=Bs("#1f3b73","#2a2d33",!0);let o=this.pt(t.rd,t.sA-s*22,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(t.staff.g,o),t.root.add(t.staff.g),t.staffPos={x:o.x,z:o.z}}if(t.staff&&t.staffPos){let o=this.pt(t.rd,(t.sA+t.sB)/2,t.lat+Math.sign(t.lat||1)*3.4,s),a=o.x-t.staffPos.x,c=o.z-t.staffPos.z,u=Math.hypot(a,c);if(u>.4){let h=Math.min(u,1.3*e);t.staffPos.x+=a/u*h,t.staffPos.z+=c/u*h,this.put(t.staff.g,{x:t.staffPos.x,z:t.staffPos.z,yaw:Math.atan2(a,c)}),Gi(t.staff,e,"walk",!0)}else{t.talk+=e,Gi(t.staff,e,"talk",!0);let h=t.staff.g.position;t.staff.g.rotation.y=Math.atan2(i.x-h.x,i.z-h.z);for(let d of t.drivers)d.g.rotation.y=Math.atan2(h.x-d.g.position.x,h.z-d.g.position.z)}}}showroom(e){let t=this.amb(),[n,i]=e.split(",").map(Number);if(!t||!isFinite(n))return;let s=new _e;s.name="aw:evshow",t.group.add(s),["everest","isuzu","ambY","ambP","forensys"].forEach((a,c)=>{let u=Us(a,45),h=n+(c-2)*11;u.g.position.set(h,t.w.surfaceAt(h,i)+.02,i),u.g.rotation.y=Math.PI/2,s.add(u.g),setInterval(()=>Hi(u,performance.now()/1e3,c,!0),50)});let r=Bs("#1f3b73","#2a2d33",!0);r.g.position.set(n+28,t.w.surfaceAt(n+28,i+4),i+4),s.add(r.g);let o=Bs("#c8452f","#3b4f6b");o.g.position.set(n+29,t.w.surfaceAt(n+29,i+4),i+4),o.g.rotation.y=-Math.PI/2,s.add(o.g),setInterval(()=>{Gi(r,.05,"talk",!0),Gi(o,.05,"talk")},50)}};var Vc=420,zs=56,Jo=class{constructor(e){x(this,"g");x(this,"marks");x(this,"smoke");x(this,"smokePos",new Float32Array(zs*3));x(this,"smokeLife",new Float32Array(zs));x(this,"smokeVel",new Float32Array(zs*3));x(this,"i",0);x(this,"puff",0);x(this,"smokeClock",0);x(this,"lx",0);x(this,"lz",0);x(this,"tracking",!1);x(this,"lastSpeed",0);x(this,"baseFov",0);x(this,"m",new F);x(this,"q",new Z);x(this,"p",new M);x(this,"sc",new M(1,1,1));x(this,"up",new M(0,1,0));x(this,"mode","");this.g=e;let t=new qt(.28,1).rotateX(-Math.PI/2),n=new z({color:1053978,transparent:!0,opacity:.56,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2});this.marks=new q(t,n,Vc),this.marks.name="aw:vehicle-skids",this.marks.count=0,this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.instanceMatrix.setUsage(ct),e.scene.add(this.marks),this.smokePos.fill(-1e4);let i=new re;i.setAttribute("position",new ie(this.smokePos,3).setUsage(ct));let s=document.createElement("canvas");s.width=s.height=64;let r=s.getContext("2d"),o=r.createRadialGradient(32,32,2,32,32,30);o.addColorStop(0,"rgba(220,225,228,.72)"),o.addColorStop(.42,"rgba(150,158,164,.34)"),o.addColorStop(1,"rgba(90,98,104,0)"),r.fillStyle=o,r.fillRect(0,0,64,64),this.smoke=new bt(i,new hn({map:new le(s),color:12962251,size:.46,transparent:!0,opacity:.25,depthWrite:!1,sizeAttenuation:!0})),this.smoke.name="aw:moto-smoke",this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,e.scene.add(this.smoke);let a=document.createElement("style");a.textContent=`
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
}`,document.head.appendChild(a);let c=window;c.__awMotoEnabled=!0,c.__awMotoCam=(u,h,d,f)=>this.camera(u,h,d,f)}camera(e,t,n,i){let s=window;if(!i){s.__awMotoBump=Math.max(0,(s.__awMotoBump||0)-n*5);return}let r=Math.abs(t.s||0),o=performance.now()*.001,a=Math.max(0,Math.min(1,(r-25)/30)),c=Math.max(0,s.__awMotoBump||0),u=a*.025+c*.2,h=Math.sin(o*23)*u;e.x+=Math.cos(t.h)*h,e.z-=Math.sin(t.h)*h,e.y+=Math.sin(o*31)*u*.65+c*.08-.5,s.__awMotoBump=Math.max(0,c-n*4.5)}spawnSmoke(e){let t=this.puff,n=t*3,i=Math.sin(e.h),s=Math.cos(e.h);this.smokePos[n]=e.x+i*.78+(Math.random()-.5)*.22,this.smokePos[n+1]=e.y+.24+Math.random()*.12,this.smokePos[n+2]=e.z+s*.78+(Math.random()-.5)*.22,this.smokeVel[n]=(Math.random()-.5)*.3,this.smokeVel[n+1]=.38+Math.random()*.22,this.smokeVel[n+2]=(Math.random()-.5)*.3,this.smokeLife[t]=.72+Math.random()*.35,this.puff=(t+1)%zs}updateSmoke(e){for(let t=0;t<zs;t++){if(this.smokeLife[t]<=0)continue;let n=t*3;if(this.smokeLife[t]-=e,this.smokeLife[t]<=0){this.smokePos[n+1]=-1e4;continue}this.smokePos[n]+=this.smokeVel[n]*e,this.smokePos[n+1]+=this.smokeVel[n+1]*e,this.smokePos[n+2]+=this.smokeVel[n+2]*e,this.smokeVel[n]*=Math.pow(.2,e),this.smokeVel[n+2]*=Math.pow(.2,e)}this.smoke.geometry.getAttribute("position").needsUpdate=!0}update(e){let t=this.g,n=t.S,i=n.mode==="car"||n.mode==="moto",s=n.mode==="moto";n.mode!==this.mode&&(this.mode=n.mode,document.body.classList.toggle("awmoto",s),this.tracking=!1,this.lastSpeed=0);let r=t.camera;this.baseFov||(this.baseFov=r.fov);let o=n.car,a=i?Math.abs(o.s||0):0,c=s?this.baseFov+Math.min(6,Math.max(0,a-10)*.14):n.mode==="car"?this.baseFov+Math.min(14,Math.max(0,a-8)*.3):this.baseFov;if(Math.abs(r.fov-c)>.05&&(r.fov+=(c-r.fov)*Math.min(1,e*3),r.updateProjectionMatrix()),this.updateSmoke(e),!i)return;let u=t.held||{},h=window.__awDrift||0,d=Math.max(0,(this.lastSpeed-a)/Math.max(.001,e)),f=s?h>.22||(u.brake||d>14)&&a>9:(u.brake||d>16)&&a>14;if(this.lastSpeed=a,s&&f&&a>8)for(this.smokeClock+=e*(h>.5?1.6:1);this.smokeClock>.08;)this.smokeClock-=.08,this.spawnSmoke(o);else this.smokeClock=0;let p=o.x-this.lx,m=o.z-this.lz,g=p*p+m*m;if(!this.tracking||!f||g>25){this.lx=o.x,this.lz=o.z,this.tracking=!0;return}if(g<.7*.7)return;let b=Math.atan2(p,m);this.q.setFromAxisAngle(this.up,b),this.sc.set(1,1,Math.sqrt(g));let v=Math.sin(o.h),y=Math.cos(o.h),_=s?.75:1.3,S=s?[0]:[-.78,.78];for(let E of S)this.p.set((o.x+this.lx)/2+v*_+y*E,o.y+.04,(o.z+this.lz)/2+y*_-v*E),this.m.compose(this.p,this.q,this.sc),this.marks.setMatrixAt(this.i,this.m),this.i=(this.i+1)%Vc,this.marks.count=Math.min(Vc,this.marks.count+1);this.marks.instanceMatrix.needsUpdate=!0,this.lx=o.x,this.lz=o.z}};var Wc=560/3.6,ei=40,Yd=5.05,fv=7,Zd=4.6,Kd=7.5,Xc=.56,pv=`
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  vL = position.z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,mv=`
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
}`,gv=`
attribute float aLife; attribute float aSeed; varying float vLife; uniform float uScale;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uScale * (0.35 + aLife * 0.9) * (0.7 + aSeed * 0.6) / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`,xv=`
varying float vLife; uniform float uI;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.0;
  if (r > 1.0 || vLife >= 1.0) discard;
  vec3 col = vLife < 0.25 ? mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.72, 0.32), vLife * 4.0)
                          : mix(vec3(1.0, 0.72, 0.32), vec3(0.85, 0.22, 0.04), (vLife - 0.25) / 0.75);
  float a = (1.0 - r) * pow(1.0 - vLife, 1.6) * uI;
  gl_FragColor = vec4(col * 1.6, a);
}`;function bv(){let l=document.createElement("canvas");l.width=l.height=64;let e=l.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(225,238,255,1)"),t.addColorStop(.25,"rgba(150,190,255,0.6)"),t.addColorStop(.55,"rgba(255,140,40,0.3)"),t.addColorStop(1,"rgba(255,90,10,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);let n=new le(l);return n.colorSpace=j,n}function vv(){let l=[];for(let e=0;e<=14;e++){let t=e/14;l.push(new B(Math.max(.001,(1-t**1.25)*(1+.28*Math.sin(t*Math.PI))),t))}return new _s(l,18).rotateX(Math.PI/2)}var $o=class{constructor(e){x(this,"g");x(this,"on",!1);x(this,"btn");x(this,"fx",new _e);x(this,"plane",null);x(this,"t",0);x(this,"lvl",0);x(this,"pressOn",!1);x(this,"pressT",0);x(this,"core");x(this,"outer");x(this,"glow");x(this,"parts");x(this,"pos",new Float32Array(ei*3));x(this,"vel",new Float32Array(ei*3));x(this,"life",new Float32Array(ei).fill(1));x(this,"ttl",new Float32Array(ei).fill(.2));x(this,"emit",0);x(this,"zoomed",!1);this.g=e;let t=document.createElement("button");this.btn=t,t.innerHTML="TURBO JET<small>tap \xB7 hold</small>",t.className="awturbo",t.title="Turbo jet (T): tap to latch, hold for a burst",t.addEventListener("pointerdown",c=>{c.preventDefault(),c.stopPropagation();try{t.setPointerCapture(c.pointerId)}catch{}this.press(c.timeStamp)});let n=c=>{c.preventDefault(),this.release(c.timeStamp)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),t.addEventListener("contextmenu",c=>c.preventDefault()),document.querySelector('#actions .grp[data-for="plane"]')?.appendChild(t);let i=document.createElement("style");i.textContent=`#actions button.awturbo{grid-column:span 2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;letter-spacing:.06em;background:linear-gradient(180deg,#3a5f9ab8,#1c2c4ab8);border-color:#9fc4ffcc;-webkit-user-select:none;user-select:none}
#actions button.awturbo small{font-size:10px;font-weight:600;opacity:.75;letter-spacing:.02em}
#actions button.awturbo.lit{background:radial-gradient(circle at 50% 120%,#fff6 0,#0000 60%),linear-gradient(180deg,#ffb347,#ff6a1a);color:#1a1a1a;border-color:#fff;box-shadow:0 0 16px #ff8c1acc,0 0 4px #bfe0ff inset}`,document.head.appendChild(i),window.addEventListener("keydown",c=>{c.code==="KeyT"&&!c.repeat&&e.S.mode==="plane"&&!(c.target instanceof HTMLInputElement)&&this.press(c.timeStamp)}),window.addEventListener("keyup",c=>{c.code==="KeyT"&&this.release(c.timeStamp)}),window.addEventListener("blur",c=>this.release(c.timeStamp));let s=document.getElementById("keyhelp");s&&!/turbo/i.test(s.textContent||"")&&(s.textContent+=" \xB7 T turbo jet (plane)"),this.core=this.plume(10273535,4223231,1,.5,1),this.core.scale.set(.3,.3,Zd),this.outer=this.plume(16760426,16734738,0,.6,1.7),this.outer.scale.set(Xc,Xc,Kd),this.glow=new ps(new Ci({map:bv(),color:13820671,blending:Kn,depthWrite:!1,transparent:!0,fog:!1,toneMapped:!1})),this.glow.position.z=.15,this.glow.scale.setScalar(3),this.glow.renderOrder=6;let r=new re;r.setAttribute("position",new ie(this.pos,3).setUsage(ct)),r.setAttribute("aLife",new ie(this.life,1).setUsage(ct)),r.setAttribute("aSeed",new ie(Float32Array.from({length:ei},()=>Math.random()),1)),this.parts=new bt(r,new vt({vertexShader:gv,fragmentShader:xv,uniforms:{uI:{value:0},uScale:{value:300}},transparent:!0,depthWrite:!1,blending:Kn})),this.parts.frustumCulled=!1,this.parts.renderOrder=5;let o=new k(new Tt(.5,.36,.6,16,1,!0).rotateX(Math.PI/2),new Ne({color:3816514,metalness:.8,roughness:.35,side:$}));o.position.z=Yd-.3;let a=new _e;a.position.z=Yd,a.add(this.core,this.outer,this.glow,this.parts),this.fx.name="aw-turbo",this.fx.add(o,a),a.name="aw-turbo-flame"}plume(e,t,n,i,s){let r=new vt({vertexShader:pv,fragmentShader:mv,transparent:!0,depthWrite:!1,side:$,blending:Rl,blendSrc:Cl,blendDst:io,uniforms:{uT:{value:0},uI:{value:0},uCore:{value:n},uOcc:{value:i},uGain:{value:s},uC0:{value:new L(e)},uC1:{value:new L(t)}}}),o=new k(vv(),r);return o.renderOrder=n?5:4,o.frustumCulled=!1,o}press(e){this.g.S.mode==="plane"&&(this.on?(this.set(!1),this.pressOn=!1):(this.set(!0),this.pressOn=!0,this.pressT=e))}release(e){this.pressOn&&e-this.pressT>350&&this.set(!1),this.pressOn=!1}set(e){this.on=e,this.btn.classList.toggle("lit",e)}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}update(e){let t=this.g.S.mode==="plane";!t&&this.on&&(this.set(!1),this.pressOn=!1);let n=window;if(n.__awTurbo=this.on&&t,n.__awTurboK=2,n.__awTurboV=Wc,this.lvl+=((this.on&&t?1:0)-this.lvl)*Math.min(1,e*(this.on?7:4)),this.lvl<.003&&!this.on&&(this.lvl=0),n.__awTurboLvl=this.lvl,this.on&&t){let u=this.g.S.plane;u.s>Wc&&(u.s=Wc)}this.fov(t);let i=t?this.findPlane():null;i&&this.fx.parent!==i&&i.add(this.fx),this.fx.visible=!!i;let s=this.fx.children[1];if(s.visible=this.lvl>0,!i||!s.visible)return;this.t+=e;let r=this.t,o=this.lvl,a=1+Math.sin(r*61)*.07+Math.sin(r*37+1.1)*.06+(Math.random()-.5)*.08;for(let u of[this.core,this.outer]){let h=u.material.uniforms;h.uT.value=r,h.uI.value=o}this.core.scale.z=Zd*(.45+.55*o)*a,this.outer.scale.z=Kd*(.4+.6*o)*(2-a);let c=1+(Math.random()-.5)*.06;this.outer.scale.x=this.outer.scale.y=Xc*c,this.glow.material.opacity=(.5+Math.random()*.2)*o,this.glow.scale.setScalar(3*(.8+.2*a)),this.particles(e,o)}particles(e,t){let n=this.pos,i=this.vel,s=this.life;this.emit+=e*ei/.2*t;for(let a=0;a<ei;a++){if(s[a]>=1){if(this.emit<1)continue;this.emit-=1;let c=Math.random()*.22,u=Math.random()*6.283;n[a*3]=Math.cos(u)*c,n[a*3+1]=Math.sin(u)*c,n[a*3+2]=Math.random()*.4,i[a*3]=(Math.random()-.5)*3.5,i[a*3+1]=(Math.random()-.5)*3.5,i[a*3+2]=28+Math.random()*18,s[a]=0,this.ttl[a]=.14+Math.random()*.16;continue}s[a]=Math.min(1,s[a]+e/this.ttl[a]),n[a*3]+=i[a*3]*e,n[a*3+1]+=i[a*3+1]*e,n[a*3+2]+=i[a*3+2]*e}this.emit=Math.min(this.emit,4);let r=this.parts.geometry;r.attributes.position.needsUpdate=!0,r.attributes.aLife.needsUpdate=!0;let o=this.parts.material;o.uniforms.uI.value=t,o.uniforms.uScale.value=this.g.renderer.domElement.height*.27}fov(e){let t=this.g.camera;if(!e&&!this.zoomed)return;let n=t.fov*Math.PI/360,i=fv*(e?this.lvl:0)*Math.PI/360,s=i>1e-4?Math.tan(n)/Math.tan(n+i):1;Math.abs(t.zoom-s)>1e-4&&(t.zoom=s,t.updateProjectionMatrix()),this.zoomed=s!==1}};var _v=42,yv=56,Mv=40,wv=l=>Math.atan2(Math.sin(l),Math.cos(l)),jd=(l,e)=>Math.sign(l)*Math.pow(Math.abs(l),e),Jd=(l,e,t)=>Math.max(e,Math.min(t,l)),qc=l=>l.y-((l.g||0)+2),Qo=class{constructor(e){x(this,"g");x(this,"ch",0);x(this,"cp",0);x(this,"cd",26);x(this,"camOn",!1);x(this,"lx",0);x(this,"lz",0);x(this,"res",{h:0,p:0,d:26});x(this,"gear");x(this,"gearK",0);x(this,"plane",null);x(this,"spawned",null);x(this,"mode","");this.g=e,this.gear=this.buildGear(),window.__awFly={gnd:t=>t.y<=(t.g||0)+2.05,ctl:(t,n,i,s,r)=>this.ctl(t,n,i,s,r),gs:t=>.6/(1+Math.abs(t.s)/15),acc:(t,n,i,s,r)=>this.acc(t,n,i,s,r),vy:(t,n,i,s)=>this.vy(t,n,s),cam:(t,n,i)=>this.cam(t,n,i),spawn:(t,n)=>this.spawn(t,n)}}ctl(e,t,n,i,s){let r=jd(t,1.5)*1.15;e.q=(e.q||0)+(r-(e.q||0))*Math.min(1,i*7),e.p+=e.q*i;let o=Math.abs(t)<.08;if(o){let c=qc(e),u=s?0:e.thr>.5?c<90?.1:c<140?.1*(140-c)/50:0:c<25?-.035:0;e.p+=(u-e.p)*(1-.4**i)}if(s){o&&e.s>yv&&e.thr>.5&&(e.p+=(.13-e.p)*Math.min(1,i*1.5));let c=e.s<_v?.02:.2;e.p>c&&(e.p+=(c-e.p)*Math.min(1,i*3)),e.p<0&&(e.p=0,e.q=Math.max(0,e.q))}let a=s?0:-jd(n,1.4)*.85;e.r+=(a-e.r)*Math.min(1,i*(s?6:3.2))}acc(e,t,n,i,s){let r=!!window.__awTurbo,o=i&&s<-.3,a=o?0:t;i&&e.thr<.5&&(a*=(e.thr/.5)**2),i||(a=Math.max(a,Mv));let c=(a-e.s)*.9,u=i?r?14:7.5:r?32:16;return Jd(c,-(i?o?10:5:12),u)*n}vy(e,t,n){if(!n&&e.thr<.35&&(t-=(.35-e.thr)/.35*4.5),t>=0)return t;let i=Math.max(0,qc(e));return i>45?t:Math.max(t,-(1.2+i*.5+i*i*.03))}cam(e,t,n){let s=(this.g.camera.aspect<.8?20:26)+Math.min(e.s,160)*.055+(window.__awTurboLvl||0)*3,r=Math.hypot(e.x-this.lx,e.z-this.lz)>300;return this.lx=e.x,this.lz=e.z,(!this.camOn||n||r)&&(this.ch=e.h,this.cp=e.p,this.cd=s,this.camOn=!0),this.ch+=wv(e.h-this.ch)*Math.min(1,t*3),this.cp+=(e.p-this.cp)*Math.min(1,t*3),this.cd+=(s-this.cd)*Math.min(1,t*1.5),this.res.h=this.ch,this.res.p=this.cp,this.res.d=this.cd,this.res}runway(){let e=this.g.DATA?.runways||[],t=null,n=0;for(let i of e){let s=Math.hypot(i[i.length-1][0]-i[0][0],i[i.length-1][1]-i[0][1]);s>n&&(n=s,t=i)}return t&&n>1500?{A:t[0],B:t[t.length-1],L:n}:null}spawn(e,t){if(t==="plane")return;let n=this.runway();if(!n)return;let i=(n.B[0]-n.A[0])/n.L,s=(n.B[1]-n.A[1])/n.L,r=e.x-n.A[0],o=e.z-n.A[1],a=r*i+o*s;if(Math.abs(r*s-o*i)>450||a<-600||a>n.L+600)return;let u=a<n.L/2,h=u?90:n.L-90,d=u?1:-1;e.x=n.A[0]+i*h,e.z=n.A[1]+s*h,e.h=Math.atan2(-i*d,-s*d);let f=this.g.real;e.g=f?Math.max(0,f.heightAt(e.x,e.z)):0,e.y=e.g+2,e.p=0,e.r=0,e.s=0,e.thr=0,e.q=0,this.spawned={x:e.x,z:e.z},this.camOn=!1;let p=document.getElementById("toast");p&&(p.textContent=`Runway ${u?"29":"11"}, Queen Beatrix \xB7 hold THR+ to take off \xB7 DIVE brakes`,p.classList.add("on"),setTimeout(()=>p.classList.remove("on"),4500))}buildGear(){let e=new _e;e.name="aw-gear";let t=new Ne({color:12106948,metalness:.6,roughness:.4}),n=new Ne({color:1776413,roughness:.9}),i=new Tt(.07,.07,1,6).translate(0,-.5,0),s=new Tt(.26,.26,.22,12).rotateZ(Math.PI/2);for(let[r,o,a]of[[0,-3.3,-.45],[-1.15,.4,-.55],[1.15,.4,-.55]]){let c=new _e;c.position.set(r,a,o);let u=a+1.74,h=new k(i,t);h.scale.y=u,c.add(h);let d=new k(s,n);d.position.y=-u,c.add(d),e.add(c)}return e.visible=!1,e}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}get planeObj(){return this.findPlane()}update(e){let t=this.g.S;if(t.mode!==this.mode&&(this.mode=t.mode,t.mode!=="plane"&&(this.camOn=!1)),t.mode!=="plane")return;let n=t.plane;if(this.spawned){if(Math.hypot(n.x-this.spawned.x,n.z-this.spawned.z)>20){let r=this.g.real;n.y=Math.max((r?r.heightAt(n.x,n.z):0)+200,250),n.s=65,n.thr=.65,n.p=.05}this.spawned=null}let i=this.findPlane();if(!i)return;this.gear.parent!==i&&i.add(this.gear);let s=qc(n)<(this.gearK>.5?70:55);this.gearK=Jd(this.gearK+(s?e:-e)/1.6,0,1),this.gear.visible=this.gearK>.01,this.gear.scale.setScalar(this.gearK),this.gear.position.y=(1-this.gearK)*.4}};var Vi=[4380,4538,4696,4848,4999,5150,5308,5466,5629,5789],Gs=8542,ea=80,$d=44,ta=class{constructor(e){x(this,"g",e);x(this,"hAt");x(this,"k",0);x(this,"ang",[]);x(this,"ys",[]);x(this,"static");x(this,"rot");x(this,"m",new F);x(this,"q",new Z);x(this,"e",new At);x(this,"p",new M);x(this,"s",new M(1,1,1));let t=e.real;this.hAt=(o,a)=>t.heightAt(o,a);let n=new lt({color:15659250}),i=new ze(.5,$d,2);i.translate(0,$d/2+1,0);let s=[new ke(1.5,8,6)];for(let o=0;o<3;o++)s.push(i.clone().rotateX(o*2.0944));let r=_t(s.map(o=>o.toNonIndexed()));this.rot=new q(r,n,Vi.length),this.rot.frustumCulled=!1,this.rot.name="aw:windfarm:rotors",this.rot.castShadow=!1,this.rebuild(),e.scene.add(this.rot)}rebuild(){let e=[];Vi.forEach((n,i)=>{let s=this.hAt(Gs,n)-.5;this.ys[i]=Number.isFinite(s)?s:this.ys[i]||0;let r=new Tt(1.4,2.1,ea,10,1,!0).toNonIndexed();r.translate(Gs,this.ys[i]+ea/2,n);let o=new ze(10,3.6,3.6).toNonIndexed();o.translate(Gs-1.5,this.ys[i]+ea+.3,n),e.push(r,o),this.ang[i]===void 0&&(this.ang[i]=i*.7)});let t=_t(e);t.computeBoundingSphere(),this.static?(this.static.geometry.dispose(),this.static.geometry=t):(this.static=new k(t,this.rot.material),this.static.name="aw:windfarm",this.g.scene.add(this.static))}update(e){if((++this.k&255)===0){let t=!1;for(let n=0;n<Vi.length;n++){let i=this.hAt(Gs,Vi[n])-.5;Number.isFinite(i)&&Math.abs(i-this.ys[n])>.05&&(t=!0)}t&&this.rebuild()}for(let t=0;t<Vi.length;t++)this.ang[t]-=e*.9,this.e.set(this.ang[t],0,0),this.q.setFromEuler(this.e),this.p.set(Gs+4.2,this.ys[t]+ea+1.3,Vi[t]),this.m.compose(this.p,this.q,this.s),this.rot.setMatrixAt(t,this.m);this.rot.instanceMatrix.needsUpdate=!0}};var na=[{n:"NEAR",d:1,p:0},{n:"FAR",d:1.75,p:.14},{n:"LOW",d:.72,p:-.13}],ia=class{constructor(){x(this,"i",0);x(this,"btn");x(this,"tip");x(this,"cd",1);x(this,"cp",0);this.btn=document.createElement("button"),this.btn.textContent="\u{1F3A5}",this.btn.title="Camera (C)",this.btn.className="aw-cam",this.btn.setAttribute("aria-label","Cycle chase camera"),this.btn.style.display="none",this.btn.addEventListener("click",t=>{t.preventDefault(),this.next()}),document.body.appendChild(this.btn),this.tip=document.createElement("div"),this.tip.className="aw-camtip",document.body.appendChild(this.tip);let e=document.createElement("style");e.textContent=".aw-cam{position:fixed;right:12px;top:170px;z-index:40;width:44px;height:44px;border-radius:12px;border:0;font:20px system-ui;background:#1e2a3ab0;color:#fff}.aw-camtip{position:fixed;right:62px;top:180px;z-index:40;font:800 12px system-ui;color:#fff;text-shadow:0 1px 3px #000;opacity:0;transition:opacity .4s;pointer-events:none}",document.head.appendChild(e),addEventListener("keydown",t=>{t.code==="KeyC"&&!(t.target instanceof HTMLInputElement)&&this.next()})}next(){this.i=(this.i+1)%na.length,this.tip.textContent="CAM "+na[this.i].n,this.tip.style.opacity="1",setTimeout(()=>this.tip.style.opacity="0",1200)}frame(e,t){let n=e==="car"||e==="moto";this.btn.style.display=n?"block":"none";let i=n?na[this.i]:na[0],s=Math.min(1,t*4);this.cd+=(i.d-this.cd)*s,this.cp+=(i.p-this.cp)*s;let r=window;r.__awCamD=this.cd,r.__awCamP=this.cp}};var Hs=["off","1","2","3","4","5"],Sv={off:"RADIO OFF",1:"Track 1",2:"Track 2",3:"Track 3",4:"Track 4",5:"Track 5"},Av=l=>`./audio/music/track${l}.mp3`,Tv=.32,sa=class{constructor(e){x(this,"g",e);x(this,"el");x(this,"nm");x(this,"a",null);x(this,"st","1");x(this,"shown",!1);x(this,"want",!1);x(this,"t",0);try{localStorage.removeItem("aw_radio");let a=localStorage.getItem("aw_radio2");a&&Hs.includes(a)&&(this.st=a)}catch{}let t=document.createElement("style");t.textContent=`#awRadio{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 96px);transform:translate(-50%);z-index:30;display:none;align-items:center;gap:6px;
      background:#0b1220cc;border:2px solid #ffffff40;border-radius:14px;padding:4px 6px;color:#fff;font:700 13px system-ui,sans-serif;user-select:none;touch-action:none;box-shadow:0 4px 14px #0006}
      #awRadio.on{display:flex}body.touch #awRadio{top:auto;bottom:calc(env(safe-area-inset-bottom) + 172px)}body.touch #awRadio[data-mode=plane]{bottom:auto;top:calc(env(safe-area-inset-top) + var(--aw-radio-top,132px));left:12px;transform:none}#awRadio button{background:#ffffff1a;border:0;color:#fff;border-radius:9px;width:30px;height:30px;font-size:15px;font-weight:900}
      #awRadio .nm{min-width:110px;text-align:center;line-height:1.1}#awRadio .nm small{display:block;font-size:9px;letter-spacing:.18em;opacity:.65}
      #awRadio .nm b{display:block;font-size:14px;color:#ffd23f}#awRadio.off .nm b{color:#aab}`,document.head.appendChild(t),this.el=document.createElement("div"),this.el.id="awRadio";let n=document.createElement("button");n.textContent="\u25C0",n.setAttribute("aria-label","Previous station");let i=document.createElement("button");i.textContent="\u25B6",i.setAttribute("aria-label","Next station"),this.nm=document.createElement("div"),this.nm.className="nm",this.el.append(n,this.nm,i),document.body.appendChild(this.el);let s=a=>a.stopPropagation();for(let a of["pointerdown","touchstart","mousedown"])this.el.addEventListener(a,s);n.addEventListener("click",a=>{a.stopPropagation(),this.step(-1)}),i.addEventListener("click",a=>{a.stopPropagation(),this.step(1)});let r=-1;this.el.addEventListener("pointerdown",a=>{(a.target===this.el||this.nm.contains(a.target))&&(r=a.clientX,this.el.setPointerCapture(a.pointerId))}),this.el.addEventListener("pointerup",a=>{if(r<0)return;let c=a.clientX-r;r=-1,Math.abs(c)>25&&this.step(c<0?1:-1)}),this.el.addEventListener("pointercancel",()=>{r=-1}),addEventListener("keydown",a=>{!this.shown||a.target?.tagName==="INPUT"||(a.key===","?this.step(-1):a.key==="."&&this.step(1))});let o=()=>{this.want&&this.a&&this.a.paused&&this.a.play().catch(()=>{})};addEventListener("pointerdown",o,!0),addEventListener("keydown",o,!0),this.paint()}muted(){try{return localStorage.getItem("aw_muted")==="1"}catch{return!1}}step(e){let t=Hs.indexOf(this.st);this.st=Hs[(t+e+Hs.length)%Hs.length];try{localStorage.setItem("aw_radio2",this.st)}catch{}this.paint(),this.sync(!0)}paint(){this.nm.innerHTML=`<small>RADIO</small><b>${Sv[this.st]}</b>`,this.el.classList.toggle("off",this.st==="off")}sync(e=!1){if(this.want=this.shown&&this.st!=="off"&&!this.muted(),!this.want){this.a&&!this.a.paused&&this.a.pause();return}let t=Av(this.st);this.a||(this.a=new Audio,this.a.loop=!0,this.a.preload="auto",this.a.volume=Tv,window.__awRadio=this.a),(e||!this.a.src.endsWith(t.slice(1)))&&(this.a.src=t);let n=window.__awIntro;n&&!n.paused&&n.pause(),this.a.paused&&this.a.play().catch(()=>{})}update(){let t=this.g.S.mode;if(this.el.dataset.mode!==t&&(this.el.dataset.mode=t,t==="plane")){let n=document.getElementById("hud");if(n){let i=n.getBoundingClientRect();i.bottom>0&&this.el.style.setProperty("--aw-radio-top",Math.round(i.bottom+8)+"px")}}this.shown!==!0?(this.shown=!0,this.el.classList.toggle("on",!0),this.sync()):(this.t=(this.t+1)%30)===0&&this.sync()}};var Qd="smoothstep(-500.0, 1200.0, dot(%P% - vec2(-8840.0, -10365.0), vec2(0.7373, -0.6756)))",Ev=`
  // aw sea: awW 0 leeward (Eagle/Palm Beach) .. 1 windward north coast
  vec2 awP = vWP.xz;
  float awW = ${Qd.replace("%P%","awP")};
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
  float awSpec = (1.0 - 0.45 * smoothstep(150.0, 1500.0, camD) * smoothstep(4.0, 14.0, awD)) * mix(0.65, 1.0, smoothstep(0.5, 4.0, depth));`;function Rv(l,e){fn(l,"sea-v1",t=>{let n=t.fragmentShader,i=n.indexOf("  // shoreline wash"),s="a = max(a, foam * 0.95);",r=n.indexOf(s),o="vec3 n1 = texture(wn, p / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;",a="vec3 n3 = texture(wn, p / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;",c="vec3 nW = normalize(vec3(g.x, 1.0, g.y));",u="float roughnessFactor = mix(0.04, 0.65, foam) + smoothstep(300.0, 4000.0, camD) * 0.08;",h="totalSpecular * smoothstep(0.0, 0.15, dd)";i<0||r<i||![o,a,c,u,h].every(d=>n.includes(d))||(t.fragmentShader=((e?`#define AW_SEA_HQ
`:"")+n.slice(0,i)+Ev+n.slice(r+s.length)).replace(o,"vec3 n1 = awN1;").replace(a,"vec3 n3 = awN3;").replace(c,"g = g * mix(1.0, 1.45, awW) + awSwell; "+c).replace(u,u.replace(";"," + 0.05 * awW;")).replace(h,h+" * awSpec"))})}function Cv(l){fn(l,"sand-v1",e=>{let t=e.fragmentShader,n="const float SAT[8] = float[8](0.55, 0.8, 0.6, 0.9, 0.85, 0.6, 0.5, 0.6);",i="const float GAIN[8] = float[8](1.12, 1.0, 1.95, 1.0, 0.8, 1.25, 1.15, 1.15);",s=`  for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) rwLayer(i, wi, P, tc, tn, tar); }
  float wsum = 0.0; for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) wsum += wi; }`,r="tc = mix(tc, tc * vec3(0.78, 0.9, 0.88), smoothstep(-0.5, -3.0, vWP.y));",o="reflectedLight.indirectSpecular *= tAO;";[n,i,s,r,o].every(a=>t.includes(a))&&(e.fragmentShader=t.replace(n,"const float SAT[8] = float[8](0.55, 0.8, 0.5, 0.9, 0.85, 0.6, 0.5, 0.6);").replace(i,"const float GAIN[8] = float[8](1.12, 1.0, 2.5, 1.0, 0.8, 1.25, 1.15, 1.15);").replace(s,`  float awIT = 1.0 / max(tot, 1e-4), wsum = 0.0;
  for (int i = 0; i < 8; i++) { float wi = w[i] * awIT; if (wi > 0.02) { rwLayer(i, wi, P, tc, tn, tar); wsum += wi; } }`).replace(r,`float awW = ${Qd.replace("%P%","P")}, awSub = smoothstep(-0.2, -2.5, vWP.y);
  tc *= mix(vec3(1.0), vec3(0.96, 0.9, 0.8), awW * w[2] * awIT * (1.0 - awSub));   // windward: coarser, golden coral sand
  tc *= exp(min(vWP.y, 0.0) * vec3(0.9, 0.16, 0.11)) * (1.0 - 0.3 * awW * awSub);   // seabed: red absorbed on the way down and up, darker reef windward
  // A's wet-sand gloss (roughness .28) also covered the seabed, which then mirrored the sky up through
  // the water (the white band off every beach): matte and no sky reflection below the waterline
  float awDry = smoothstep(-0.5, 0.05, vWP.y); tRough = mix(1.0, tRough, awDry);`).replace(o,"reflectedLight.indirectSpecular *= tAO * awDry;"))})}var ra=class{constructor(e){x(this,"stats",{water:0,terrain:0,hq:!1});let t=e.real,n=H.get("seaq"),i=n?n!=="low":t.q.name!=="low";this.stats.hq=i;let s=a=>{a&&!a.userData["aw:sea-v1"]&&(Rv(a,i),this.stats.water++)},r=a=>{a&&!a.userData["aw:sand-v1"]&&(Cv(a),this.stats.terrain++)},o=(a,c)=>{if(!a||typeof a.material!="function")return;let u=a.material.bind(a);a.material=(...h)=>{let d=u(...h);return c(d),d}};o(t.water,s),o(t.terrain,r),r(t.ovMat);for(let a of t.group.children){let c=a.material;a.isMesh&&c&&!Array.isArray(c)&&/\|water/.test(c.customProgramCacheKey?c.customProgramCacheKey():"")&&s(c)}for(let a of t.regions.values())r(a.mat),s(a.wmat)}};var Iv=`
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
}`;function ef(){let l=document.createElement("style");l.id="aw-hud",l.textContent=Iv,document.head.appendChild(l)}var Yc="#1d5683",tf="#47524c",nf="#4c6444",sf="#262c31",Pv="#1b2126",rf=["#aeb5b8","#c3c8ca","#eef0f0","#ffd34d","#ffd34d"],of=[1.1,1.4,2.1,2.7,3.2],Lv=[.45,.55,.9,1.3,1.6],Dv=new Set(["store","mall","hotel","gas","attraction"]),Nv=new Set(["mall","hotel","gas","attraction"]),oa=class{constructor(e){x(this,"g",e);x(this,"stats",{tiles:0,tileMs:0,jobMaxMs:0,world:!1,labels:0,size:0});x(this,"canvas",document.getElementById("minimap"));x(this,"ctx",null);x(this,"css",0);x(this,"tile",document.createElement("canvas"));x(this,"tcx",0);x(this,"tcz",0);x(this,"tppm",0);x(this,"tileOk",!1);x(this,"tileQueued",!1);x(this,"want",{ppm:0,cssPerM:0});x(this,"world",document.createElement("canvas"));x(this,"wk",0);x(this,"wb",null);x(this,"data",null);x(this,"grid",null);x(this,"parkGrid",null);x(this,"stamp",null);x(this,"parkStamp",null);x(this,"gen",0);x(this,"jobs",[]);x(this,"idleOn",!1);x(this,"range",0);x(this,"placed",[]);x(this,"pick",[]);x(this,"rim",null);x(this,"rimW",0);this.tile.width=this.tile.height=1024,this.canvas&&(this.ctx=this.canvas.getContext("2d"),document.body.classList.add("awmm"),this.resize(),addEventListener("resize",()=>this.resize()),addEventListener("orientationchange",()=>setTimeout(()=>this.resize(),250)),window.__awMiniMap=(t,n,i,s,r,o,a,c)=>this.draw(t,n,i,s,r,o,a,c))}resize(){let e=this.canvas,t=e.parentElement;this.css=t.clientWidth||120;let n=Math.max(96,Math.min(300,Math.round(this.css*Math.min(3,devicePixelRatio||1))));e.width!==n&&(e.width=e.height=n,this.tileOk=!1),this.stats.size=n}idle(e,t=!1){t?this.jobs.unshift(e):this.jobs.push(e),this.kick()}kick(){if(this.idleOn||!this.jobs.length)return;this.idleOn=!0;let e=n=>{this.idleOn=!1;do{let i=performance.now();this.jobs.shift()(),this.stats.jobMaxMs=Math.max(this.stats.jobMaxMs,Math.round((performance.now()-i)*10)/10)}while(this.jobs.length&&n&&n.timeRemaining()>4);this.kick()},t=window.requestIdleCallback;t?t(e,{timeout:250}):setTimeout(e,16)}start(e,t){this.data=e,this.wb=t,this.idle(()=>{this.grid||this.index(e)});let n=Math.max(t.maxX-t.minX,t.maxZ-t.minZ),i=this.wk=1024/n,s=this.world;s.width=s.height=1024;let r=s.getContext("2d"),o=u=>(u-t.minX)*i,a=u=>(u-t.minZ)*i,c=u=>u.forEach(([h,d],f)=>f?r.lineTo(o(h),a(d)):r.moveTo(o(h),a(d)));this.idle(()=>{r.fillStyle=Yc,r.fillRect(0,0,1024,1024),r.fillStyle=tf,r.beginPath();for(let u of e.land)c(u.outer),r.closePath();r.fill(),r.fillStyle=nf,r.beginPath();for(let u of e.parks)c(u),r.closePath();r.fill(),r.lineCap=r.lineJoin="round",r.strokeStyle=sf,r.lineWidth=45*i,r.beginPath();for(let u of e.runways)c(u);r.stroke()});for(let u=0;u<=4;u++)this.idle(()=>{r.strokeStyle=rf[u],r.lineWidth=Lv[u],r.beginPath();for(let h of e.roads)h.c===u&&c(h.p);r.stroke(),u===4&&(this.stats.world=!0)})}key(e,t){return e*65536+t}index(e){let t=new Map,n=new Map,i=(s,r,o)=>{let a=1/0,c=-1/0,u=1/0,h=-1/0;for(let[d,f]of r)d<a&&(a=d),d>c&&(c=d),f<u&&(u=f),f>h&&(h=f);for(let d=Math.floor(a/500);d<=Math.floor(c/500);d++)for(let f=Math.floor(u/500);f<=Math.floor(h/500);f++){let p=this.key(d,f),m=s.get(p);m||s.set(p,m=[]),m.push(o)}};e.roads.forEach((s,r)=>i(t,s.p,r)),e.parks.forEach((s,r)=>i(n,s,r)),this.grid=t,this.parkGrid=n,this.stamp=new Uint32Array(e.roads.length),this.parkStamp=new Uint32Array(e.parks.length)}query(e,t,n,i,s,r,o){o.length=0;for(let a=Math.floor(n/500);a<=Math.floor(s/500);a++)for(let c=Math.floor(i/500);c<=Math.floor(r/500);c++){let u=e.get(this.key(a,c));if(u)for(let h of u)t[h]!==this.gen&&(t[h]=this.gen,o.push(h))}return o}queueTile(e,t){if(this.want.ppm=e,this.want.cssPerM=t,this.tileQueued)return;this.tileQueued=!0;let n=()=>{if(!this.grid){this.index(this.data),this.idle(n,!0);return}this.tileQueued=!1;let i=this.g.S,s=i.mode==="walk"?i.walk:i.car;this.renderTile(s.x,s.z,this.want.ppm,this.want.cssPerM)};this.idle(n,!0)}renderTile(e,t,n,i){let s=performance.now(),r=this.data,o=this.tile.getContext("2d"),a=1024/2/n,c=e-a,u=e+a,h=t-a,d=t+a,f=_=>(_-e)*n+1024/2,p=_=>(_-t)*n+1024/2,m=_=>_.forEach(([S,E],C)=>C?o.lineTo(f(S),p(E)):o.moveTo(f(S),p(E)));o.fillStyle=Yc,o.fillRect(0,0,1024,1024),o.fillStyle=tf,o.beginPath();for(let _ of r.land)m(_.outer),o.closePath();o.fill();let g=[];this.gen++,o.fillStyle=nf,o.beginPath();for(let _ of this.query(this.parkGrid,this.parkStamp,c,h,u,d,g))m(r.parks[_]),o.closePath();o.fill(),o.lineCap=o.lineJoin="round",o.strokeStyle=sf,o.lineWidth=45*n,o.beginPath();for(let _ of r.runways)m(_);o.stroke(),this.gen++;let b=this.query(this.grid,this.stamp,c,h,u,d,g),v=n/i,y=(_,S,E)=>{o.strokeStyle=E,o.lineWidth=S,o.beginPath();for(let C of b){let T=r.roads[C];T.c===_&&m(T.p)}o.stroke()};for(let _=2;_<=4;_++)y(_,(of[_]+1.2)*v,Pv);for(let _=0;_<=4;_++)y(_,of[_]*v,rf[_]);this.tcx=e,this.tcz=t,this.tppm=n,this.tileOk=!0,this.stats.tiles++,this.stats.tileMs=Math.round((performance.now()-s)*10)/10}draw(e,t,n,i,s,r,o,a){let c=this.ctx;if(!c)return;this.data||this.start(a,r);let u=this.g.S,h=u.mode,f=h==="car"||h==="moto"?900+Math.min(45,Math.abs(u.car.s||0))*13:h==="walk"?480:i;this.range=!this.range||h==="plane"?f:this.range+(f-this.range)*.12;let p=this.range,m=this.canvas.width,g=m/this.css,b=m/p;c.save(),c.fillStyle=Yc,c.fillRect(0,0,m,m),c.translate(m/2,m/2),c.rotate(n);let v=!1;if(p<=2e3){let y=p<700?.75:.36,_=1024/2/y-p*.5-Math.max(Math.abs(e-this.tcx),Math.abs(t-this.tcz));v=this.tileOk&&this.tppm===y&&_>20,(!v||_<300)&&this.queueTile(y,b/g)}if(v){let y=p*this.tppm;c.drawImage(this.tile,(e-this.tcx)*this.tppm+1024/2-y/2,(t-this.tcz)*this.tppm+1024/2-y/2,y,y,-m/2,-m/2,m,m)}else{let y=this.stats.world,_=y?this.world:s.c,S=y?this.wk:s.k,E=p*S;c.drawImage(_,(e-r.minX)*S-E/2,(t-r.minZ)*S-E/2,E,E,-m/2,-m/2,m,m)}this.pois(c,e,t,n,b,g,m,o,p<=2e3),c.restore(),this.chrome(c,m,n,g)}pois(e,t,n,i,s,r,o,a,c){let u=o/2-4*r,h=u*u,d=this.pick;d.length=0,e.lineWidth=1.2*r,e.strokeStyle="#fff";for(let v of a){let y=(v.x-t)*s,_=(v.z-n)*s,S=y*y+_*_;S>h||v.k.startsWith("m_")||(c&&Nv.has(v.cat)&&(e.fillStyle=v.bg==="#ffffff"||v.bg==="#f4f1e6"?v.fg:v.bg,e.beginPath(),e.arc(y,_,2.4*r,0,6.2832),e.fill(),e.stroke()),Dv.has(v.cat)&&v.sign&&d.push({b:v,d:v.cat==="store"?S:S*.3,x:y,y:_}))}d.sort((v,y)=>v.d-y.d);let f=this.placed;f.length=0,e.font=`800 ${Math.round(9.5*r)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.lineJoin="round";let p=Math.sin(i),m=Math.cos(i),g=0,b=0;for(let v of d){if(g>=3||b>24)break;let y=v.x*m-v.y*p,_=v.x*p+v.y*m-9*r;if(Math.abs(y)<18*r&&Math.abs(_)<19*r)continue;b++;let S=v.b.sign.length>14?v.b.sign.slice(0,13)+"\u2026":v.b.sign,E=e.measureText(S).width+8*r,C=15*r;if(Math.hypot(Math.abs(y)+E/2,Math.abs(_)+C/2)>o/2-2*r)continue;let T=!1;for(let R=0;R<f.length;R+=4)if(Math.abs(y-f[R])*2<E+f[R+2]&&Math.abs(_-f[R+1])*2<C+f[R+3]){T=!0;break}T||Math.abs(y)<E/2+10*r&&Math.abs(_)<C/2+11*r||(f.push(y,_,E,C),e.save(),e.rotate(-i),e.lineWidth=3.2*r,e.strokeStyle="rgba(10,14,18,.85)",e.strokeText(S,y,_),e.fillStyle="#fff",e.fillText(S,y,_),e.restore(),g++)}this.stats.labels=g}chrome(e,t,n,i){let s=t/2;(!this.rim||this.rimW!==t)&&(this.rim=e.createRadialGradient(s,s,s*.72,s,s,s),this.rimW=t,this.rim.addColorStop(0,"rgba(0,0,0,0)"),this.rim.addColorStop(1,"rgba(0,0,0,.38)")),e.fillStyle=this.rim,e.fillRect(0,0,t,t),e.save(),e.translate(s,s),e.beginPath(),e.moveTo(0,-9*i),e.lineTo(7*i,7*i),e.lineTo(0,3.2*i),e.lineTo(-7*i,7*i),e.closePath(),e.lineJoin="round",e.lineWidth=3*i,e.strokeStyle="#11161b",e.stroke(),e.fillStyle="#fff",e.fill();let r=s-9*i,o=Math.sin(n)*r,a=-Math.cos(n)*r;e.beginPath(),e.arc(o,a,7.5*i,0,6.2832),e.fillStyle="#11161bdd",e.fill(),e.lineWidth=1.4*i,e.strokeStyle="#ffd23f",e.stroke(),e.font=`900 ${Math.round(9*i)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffd23f",e.fillText("N",o,a+.5*i),e.restore()}};function Te(l,e,t){let n=l[e],i=l[t],s=i[0]-n[0],r=i[1]-n[1],o=Math.hypot(s,r)||1,a=s/o,c=r/o,u=-c,h=a,d=(n[0]+i[0])*.5,f=(n[1]+i[1])*.5,p=0,m=0;for(let S of l)p+=S[0],m+=S[1];p/=l.length,m/=l.length,(p-d)*u+(m-f)*h<0&&(u=-u,h=-h);let g=0,b=1/0,v=-1/0,y=1/0,_=-1/0;for(let S of l)g=Math.max(g,(S[0]-d)*u+(S[1]-f)*h),b=Math.min(b,S[0]),v=Math.max(v,S[0]),y=Math.min(y,S[1]),_=Math.max(_,S[1]);return b-=1.6,v+=1.6,y-=1.6,_+=1.6,{mx:d,mz:f,ux:a,uz:c,nx:u,nz:h,halfW:o*.5,depth:g,minX:b,maxX:v,minZ:y,maxZ:_}}function st(l,e,t,n){let i=Math.cos(n),s=Math.sin(n),r=(f,p)=>e+i*f+s*p,o=(f,p)=>t-s*f+i*p,a=[[l.mx+l.ux*l.halfW,l.mz+l.uz*l.halfW],[l.mx-l.ux*l.halfW,l.mz-l.uz*l.halfW],[l.mx+l.nx*l.depth,l.mz+l.nz*l.depth],[l.mx+l.nx*l.depth+l.ux*l.halfW,l.mz+l.nz*l.depth+l.uz*l.halfW],[l.mx+l.nx*l.depth-l.ux*l.halfW,l.mz+l.nz*l.depth-l.uz*l.halfW],[l.mx-l.nx*1.4,l.mz-l.nz*1.4]],c=1/0,u=-1/0,h=1/0,d=-1/0;for(let f of a){let p=r(f[0],f[1]),m=o(f[0],f[1]);c=Math.min(c,p),u=Math.max(u,p),h=Math.min(h,m),d=Math.max(d,m)}return{mx:r(l.mx,l.mz),mz:o(l.mx,l.mz),ux:i*l.ux+s*l.uz,uz:-s*l.ux+i*l.uz,nx:i*l.nx+s*l.nz,nz:-s*l.nx+i*l.nz,halfW:l.halfW,depth:l.depth,minX:c-.5,maxX:u+.5,minZ:h-.5,maxZ:d+.5,doorAt:l.doorAt,mouthOut:l.mouthOut,mouthIn:l.mouthIn}}function Ov(l,e,t){let n=!1;for(let i=0,s=l.length-1;i<l.length;s=i++){let r=l[i][0],o=l[i][1],a=l[s][0],c=l[s][1],u=c-o;o>t==c>t||u===0||e<(a-r)*(t-o)/u+r&&(n=!n)}return n}function af(l,e,t,n,i,s){if(t<l.minX||t>l.maxX||n<l.minZ||n>l.maxZ)return!1;let r=t-l.mx,o=n-l.mz,a=r*l.ux+o*l.uz,c=r*l.nx+o*l.nz,u=l.doorAt??0,h=l.mouthOut??-1.25,d=l.mouthIn??1.8,f=Math.abs(a-u)<i-.06&&c>h&&c<d,p=Math.abs(a)<l.halfW-s&&c>s&&c<l.depth-s&&(!l.poly||Ov(l.poly,t,n));if(!f&&!p)return!1;for(let m=0;m<e.length;m++){let g=e[m];if(a>g.a0&&a<g.a1&&c>g.d0&&c<g.d1)return!1}return!0}var W=class{constructor(){x(this,"p",[]);x(this,"n",[]);x(this,"c",[]);x(this,"u",[]);x(this,"ix",[]);x(this,"hasUv",!1)}quad(e,t,n,i){let s=e[1][0]-e[0][0],r=e[1][1]-e[0][1],o=e[1][2]-e[0][2],a=e[2][0]-e[0][0],c=e[2][1]-e[0][1],u=e[2][2]-e[0][2],h=r*u-o*c,d=o*a-s*u,f=s*c-r*a;if(!(h*h+d*d+f*f>1e-10))return;let m=Math.hypot(t[0],t[1],t[2])||1,g=t[0]/m,b=t[1]/m,v=t[2]/m,y=h*g+d*b+f*v<0,_=this.p.length/3;for(let S=0;S<4;S++){let E=e[S];if(this.p.push(E[0],E[1],E[2]),this.n.push(g,b,v),this.c.push(n[0],n[1],n[2]),i){this.hasUv=!0;let C=i[S];this.u.push(C[0],C[1])}}y?this.ix.push(_,_+3,_+2,_,_+2,_+1):this.ix.push(_,_+1,_+2,_,_+2,_+3)}geometry(){let e=new re;return e.setAttribute("position",new ue(this.p,3)),e.setAttribute("normal",new ue(this.n,3)),e.setAttribute("color",new ue(this.c,3)),this.hasUv&&e.setAttribute("uv",new ue(this.u,2)),e.setIndex(new Ri(this.ix,1)),e.computeBoundingSphere(),Fv(e),e}get tris(){return this.ix.length/3}};function Fv(l){let e=l.getAttribute("normal");if(!e)return;let t=e.array;for(let n=0;n<t.length;n+=3){let i=t[n],s=t[n+1],r=t[n+2];(!Number.isFinite(i+s+r)||i*i+s*s+r*r<1e-8)&&(t[n]=0,t[n+1]=1,t[n+2]=0)}}function w(l,e,t,n){return[l.mx+l.ux*e+l.nx*t,n,l.mz+l.uz*e+l.nz*t]}function A(l,e,t,n,i,s,r,o,a){if(!(n>t+1e-4&&s>i+1e-4&&o>r+1e-4))return;let c=w(e,t,i,r),u=w(e,n,i,r),h=w(e,n,s,r),d=w(e,t,s,r),f=w(e,t,i,o),p=w(e,n,i,o),m=w(e,n,s,o),g=w(e,t,s,o),b=[e.ux,0,e.uz],v=[-e.ux,0,-e.uz],y=[e.nx,0,e.nz],_=[-e.nx,0,-e.nz];l.quad([f,p,m,g],[0,1,0],a),l.quad([c,u,h,d],[0,-1,0],a),l.quad([d,g,m,h],y,a),l.quad([c,u,p,f],_,a),l.quad([u,h,m,p],b,a),l.quad([c,f,g,d],v,a)}var jc=-7087.55,Jc=24.62,df=[[-7092.6,32.4],[-7084.3,33.3],[-7082.5,16.8],[-7090.8,16]],Uv=[[-5.05,7.775],[3.25,8.675],[5.05,-7.826],[-3.25,-8.625]],Wi=Te(Uv,2,3);Wi.doorAt=0;var aa=[.82,.1,.11],lf=[.62,.06,.07],mn=[.96,.93,.86],Bv=[.94,.88,.76],cf=[.84,.74,.58],uf=[.02,.4,.2],kv=[.48,.28,.14],zv=[.95,.93,.88],Zc=[.68,.7,.72],Gv=[.86,.58,.16],ff=[{a0:-3.6,a1:-.35,d0:2.6,d1:4.05},{a0:-2.4,a1:-.6,d0:2.05,d1:2.75},{a0:1.85,a1:2.85,d0:1.15,d1:2.15},{a0:-2.9,a1:-1.9,d0:4.9,d1:5.9},{a0:1.3,a1:2.3,d0:5.7,d1:6.7},{a0:-2.7,a1:-1.7,d0:8.7,d1:9.7},{a0:1.05,a1:2.05,d0:9.5,d1:10.5},{a0:-2.2,a1:-1.2,d0:11.9,d1:12.9},{a0:-3.5,a1:-.45,d0:14.3,d1:15.9}],Vs={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Hv(){let l=new W;A(l,Vs,-.19,.19,-.17,.17,.42,.47,aa),A(l,Vs,-.19,.19,-.2,-.145,.47,.9,lf);for(let[e,t]of[[-.15,-.13],[.15,-.13],[-.15,.13],[.15,.13]])A(l,Vs,e-.018,e+.018,t-.018,t+.018,.02,.42,lf);return l.geometry()}function Vv(){let l=new W;return A(l,Vs,-.3,.3,-.3,.3,.7,.75,aa),A(l,Vs,-.05,.05,-.05,.05,.04,.7,[.9,.9,.88]),l.geometry()}function Wv(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f6f1e4",e.fillRect(0,0,512,512),e.fillStyle="#06733a",e.fillRect(0,0,512,86),e.fillStyle="#ffffff",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("PASTECHI HOUSE",256,46),[["Cheese","2.50"],["Ham & Cheese","3.00"],["Beef","3.00"],["Chicken","3.00"],["Tuna","3.00"],["Keri Keri","3.50"],["Lobster","5.00"],["Croquette","2.00"],["Bitterbal","2.00"],["Dedito","2.50"],["Smoothie","4.00"],["Iced Coffee","3.50"]].forEach((i,s)=>{let r=118+s*28;e.fillStyle=s%2?"#efe6d4":"#f6f1e4",e.fillRect(18,r-18,476,28),e.fillStyle="#2a2118",e.font="600 22px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],484,r)}),e.fillStyle="#06733a",e.font="700 18px Arial, sans-serif",e.textAlign="center",e.fillText("spicy garlic sauce  \xB7  take away or sit in",256,484),e.fillStyle="#e0a030",e.beginPath(),e.arc(256,452,16,Math.PI,0),e.quadraticCurveTo(256,468,240,452),e.fill();let n=new le(l);return n.colorSpace=j,n.anisotropy=4,n}function hf(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,t-r,a,i),w(e,t+r,a,i),w(e,t+r,a,s),w(e,t-r,a,s)],c,[1,1,1],u)};o(n,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(n+.02,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var pf=new M(0,1,0),la=new Z,ca=new M,Xv=new M(1,1,1),mf=new F;function Kc(l,e,t,n,i,s){let r=w(t,n,i,0);ca.set(r[0],0,r[2]),la.setFromAxisAngle(pf,Math.atan2(s[0],s[1])),l.setMatrixAt(e,mf.compose(ca,la,Xv))}function gf(l,e){let t=new W,n=Wi.halfW,i=Wi.depth,s=.34,r=.9;for(let O=-n+s;O<n-s-.05;O+=r)for(let U=.2;U<i-s-.05;U+=r){let V=Math.min(O+r-.03,n-s),K=Math.min(U+r-.03,i-s),Y=(Math.round(O/r)+Math.round(U/r)&1)===0;t.quad([w(e,O,U,.04),w(e,V,U,.04),w(e,V,K,.04),w(e,O,K,.04)],[0,1,0],Y?Bv:cf)}t.quad([w(e,-2.25,-.5,.03),w(e,2.25,-.5,.03),w(e,2.25,.16,.03),w(e,-2.25,.16,.03)],[0,1,0],cf),t.quad([w(e,-n+.28,.5,3.42),w(e,n-.28,.5,3.42),w(e,n-.28,i-.35,3.42),w(e,-n+.28,i-.35,3.42)],[0,-1,0],[.93,.92,.88]);for(let O of[2.2,8.2])t.quad([w(e,-1.1,O,3.48),w(e,1.1,O,3.48),w(e,1.1,O+.55,3.48),w(e,-1.1,O+.55,3.48)],[0,-1,0],[1,.95,.78]);let o=.12,a=-2.4,c=2.4;A(t,e,-n+.18,-n+.18+o,.4,i-.25,.05,3.52,mn),A(t,e,n-.18-o,n-.18,.4,i-.25,.05,3.52,mn),A(t,e,-n+.25,n-.25,i-.3,i-.3+o,.05,3.52,mn),A(t,e,-n+.2,a,.2,.2+o,.02,2.22,mn),A(t,e,c,n-.2,.2,.2+o,.02,2.22,mn),A(t,e,a,c,.2,.2+o,2.08,2.26,mn),A(t,e,-n+.22,a,.22,.32,.02,.14,aa),A(t,e,c,n-.22,.22,.32,.02,.14,aa),A(t,e,a,c,.18,.3,2.1,2.24,uf),A(t,e,-3.45,-.45,2.75,3.9,.04,1,kv),A(t,e,-3.5,-.4,2.7,3.95,1,1.06,zv),A(t,e,-3.4,-.5,2.7,2.82,.48,.98,uf),A(t,e,-2.25,-.7,2.15,2.7,1.06,1.14,Zc),A(t,e,-2.15,-.8,2.22,2.62,1.14,1.18,Gv),A(t,e,-3.4,-.55,14.4,15.75,.04,.92,Zc),A(t,e,-2.6,-1.2,14.55,15.4,.92,.98,[.2,.18,.16]),A(t,e,-2.45,-1.35,14.7,15.2,.98,1.06,[1,.42,.08]),A(t,e,-.08,.08,7.9,8.06,3.15,3.42,Zc),A(t,e,-.85,.85,7.94,8.02,3.28,3.34,mn),A(t,e,-.04,.04,7.15,8.8,3.28,3.34,mn);let u=t.geometry(),h=new z({vertexColors:!0,side:$}),d=new k(u,h);d.name="aw:pastechi:shell",d.castShadow=!1,d.receiveShadow=!1,l.add(d);let f=Wv();if(f){let O=new W;hf(O,e,-1.9,3.92,1.4,2.65,1.05),hf(O,e,.4,i-.2,1.35,2.6,1.05);let U=new k(O.geometry(),new z({map:f,side:$}));U.name="aw:pastechi:menu",U.castShadow=!1,U.receiveShadow=!1,l.add(U)}let p=new W,m=[.75,.9,.95],g=1.18,b=1.48,v=-2.2,y=-.75,_=2.18,S=2.66;p.quad([w(e,v,_,b),w(e,y,_,b),w(e,y,S,b),w(e,v,S,b)],[0,1,0],m),p.quad([w(e,v,S,g),w(e,v,S,b),w(e,v,_,b),w(e,v,_,g)],[-e.ux,0,-e.uz],m),p.quad([w(e,y,_,g),w(e,y,_,b),w(e,y,S,b),w(e,y,S,g)],[e.ux,0,e.uz],m),p.quad([w(e,v,S,g),w(e,y,S,g),w(e,y,S,b),w(e,v,S,b)],[e.nx,0,e.nz],m);let E=new z({color:12051698,transparent:!0,opacity:.28,depthWrite:!1,side:$}),C=new k(p.geometry(),E);C.name="aw:pastechi:glass",C.renderOrder=2,C.castShadow=!1,C.receiveShadow=!1,l.add(C);let T=new q(Hv(),new z({vertexColors:!0}),12);T.name="aw:pastechi:chairs",T.castShadow=!1,T.receiveShadow=!1,T.frustumCulled=!1;let R=new q(Vv(),new z({vertexColors:!0}),6);R.name="aw:pastechi:tables",R.castShadow=!1,R.receiveShadow=!1,R.frustumCulled=!1;let P=[[2.35,1.65],[-2.4,5.4],[1.8,6.2],[-2.2,9.2],[1.55,10],[-1.7,12.4]];P.forEach(([O,U],V)=>{Kc(R,V,e,O,U,[0,1]);let K=[e.nx,e.nz],Y=[-e.nx,-e.nz];Kc(T,V*2,e,O,U-.58,K),Kc(T,V*2+1,e,O,U+.58,Y)}),T.count=P.length*2,R.count=P.length,T.instanceMatrix.needsUpdate=!0,R.instanceMatrix.needsUpdate=!0,T.boundingSphere=new X(new M(0,1,0),22),R.boundingSphere=new X(new M(0,1,0),22),l.add(T,R);let I=new q(new ke(.09,6,4),new z({color:14721072}),8);I.name="aw:pastechi:pastry",I.castShadow=!1,I.receiveShadow=!1,I.frustumCulled=!1;let D=new M(1.35,.45,.95),N=0;for(let O of[-1.95,-1.6,-1.25,-.9])for(let U of[2.3,2.52]){let V=w(e,O,U,1.28);ca.set(V[0],V[1],V[2]),la.setFromAxisAngle(pf,O*.4),I.setMatrixAt(N++,mf.compose(ca,la,D))}I.count=N,I.instanceMatrix.needsUpdate=!0,I.boundingSphere=new X(new M(0,1,0),22),l.add(I)}var nu=-7957.65,iu=-5466.6,vf=[[-7969.2,-5451.9],[-7951.9,-5448.8],[-7946.1,-5481.3],[-7963.4,-5484.4]],qv=[[-11.55,14.7],[5.75,17.8],[11.55,-14.7],[-5.75,-17.8]],ti=Te(qv,1,0),eu=-5.5,ha=2.15,_f=2.9;ti.doorAt=eu;ti.depth=16;var ua=[.86,.05,.04],xf=[.62,.04,.03],$c=[1,.74,.05],yf=[.78,.78,.76],Mf=[.62,.62,.6],Xi=[.93,.91,.86],Yv=[.45,.28,.14],wf=[{a0:-2.5,a1:4.7,d0:3.05,d1:4.45},{a0:-4.4,a1:-3.8,d0:1.9,d1:2.6},{a0:-7.55,a1:-6.95,d0:1.9,d1:2.6},{a0:-7.9,a1:-6.7,d0:4.9,d1:6.35},{a0:-4.3,a1:-3.1,d0:6.05,d1:7.55},{a0:-7.75,a1:-6.65,d0:8.65,d1:10.2},{a0:.85,a1:1.95,d0:5.05,d1:6.55},{a0:3.2,a1:4.4,d0:8.45,d1:9.95},{a0:-3.2,a1:3.4,d0:13.25,d1:15.05}],Ws={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Zv(){let l=new W;A(l,Ws,-.2,.2,-.18,.18,.42,.48,ua),A(l,Ws,-.2,.2,-.2,-.14,.48,.92,xf);for(let[e,t]of[[-.16,-.14],[.16,-.14],[-.16,.14],[.16,.14]])A(l,Ws,e-.02,e+.02,t-.02,t+.02,.02,.42,xf);return l.geometry()}function Kv(){let l=new W;return A(l,Ws,-.42,.42,-.42,.42,.7,.76,yf),A(l,Ws,-.06,.06,-.06,.06,.04,.7,Mf),l.geometry()}function jv(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4f1ea",e.fillRect(0,0,512,512),e.fillStyle="#db0007",e.fillRect(0,0,512,78),e.fillStyle="#ffbc0d",e.beginPath(),e.arc(70,118,28,Math.PI,0),e.arc(108,118,28,Math.PI,0),e.fill(),e.fillStyle="#ffffff",e.font="700 36px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("McDONALD'S",300,40),[["Big Mac","8.50"],["Cheeseburger","3.50"],["Quarter Pounder","7.50"],["McNuggets","6.00"],["Fries","3.00"],["McFlurry","4.50"],["Coca-Cola","2.50"],["Coffee","2.50"]].forEach((i,s)=>{let r=130+s*40;e.fillStyle=s%2?"#fff6d8":"#f4f1ea",e.fillRect(16,r-22,480,40),e.fillStyle="#2a2118",e.font="600 26px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],480,r)}),e.fillStyle="#db0007",e.font="700 20px Arial, sans-serif",e.textAlign="center",e.fillText("i'm lovin' it",256,480);let n=new le(l);return n.colorSpace=j,n}function bf(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,t-r,a,i),w(e,t+r,a,i),w(e,t+r,a,s),w(e,t-r,a,s)],c,[1,1,1],u)};o(n,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(n+.03,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var Jv=new M(0,1,0),tu=new Z,da=new M,$v=new M(1,1,1),Sf=new F;function Qc(l,e,t,n,i,s){let r=w(t,n,i,0);da.set(r[0],0,r[2]),tu.setFromAxisAngle(Jv,Math.atan2(s[0],s[1])),l.setMatrixAt(e,Sf.compose(da,tu,$v))}function Af(l,e){let t=new W,n=ti.halfW,i=ti.depth,s=eu-ha,r=eu+ha;t.quad([w(e,-n+.35,.2,.02),w(e,n-.35,.2,.02),w(e,n-.35,i-.35,.02),w(e,-n+.35,i-.35,.02)],[0,1,0],[.7,.7,.68]);let o=1.3;for(let g=-n+.5;g<n-.6;g+=o)for(let b=.25;b<i-.5;b+=o){let v=Math.min(g+o-.04,n-.45),y=Math.min(b+o-.04,i-.4),_=(Math.round(g/o)+Math.round(b/o)&1)===0;t.quad([w(e,g,b,.04),w(e,v,b,.04),w(e,v,y,.04),w(e,g,y,.04)],[0,1,0],_?yf:Mf)}t.quad([w(e,-n+.4,.25,3.15),w(e,n-.4,.25,3.15),w(e,n-.4,i-.4,3.15),w(e,-n+.4,i-.4,3.15)],[0,-1,0],[.9,.9,.88]);let a=.12;A(t,e,-n+.22,-n+.22+a,.35,i-.3,.04,3.2,Xi),A(t,e,n-.22-a,n-.22,.35,i-.3,.04,3.2,Xi),A(t,e,-n+.3,n-.3,i-.32,i-.2,.04,3.2,Xi),A(t,e,-n+.25,s,.16,.16+a,.02,2.9,Xi),A(t,e,r,n-.25,.16,.16+a,.02,2.9,Xi),A(t,e,s,r,.18,.18+a,2.62,2.88,$c),A(t,e,s+.04,s+.18,.2,.48,.02,2.75,ua),A(t,e,r-.18,r-.04,.2,.48,.02,2.75,ua),A(t,e,-n+.3,n-.3,.2,.42,2.92,3.18,Xi),A(t,e,-2.4,4.6,3.15,4.35,.04,1.05,Yv),A(t,e,-2.5,4.7,3.08,4.42,1.05,1.12,[.95,.95,.93]),A(t,e,-2.35,4.55,3.08,3.22,.42,1.02,ua),A(t,e,-1.6,1.6,3.04,3.18,1.12,1.22,$c),A(t,e,-4.35,-3.85,1.95,2.5,.04,1.35,[.16,.16,.17]),A(t,e,-4.28,-3.92,1.9,2.02,.7,1.22,[.05,.05,.06]),A(t,e,-7.5,-7,1.95,2.5,.04,1.35,[.16,.16,.17]),A(t,e,-7.43,-7.07,1.9,2.02,.7,1.22,[.05,.05,.06]),A(t,e,-3,3.2,13.4,14.9,.04,1,[.22,.22,.24]),A(t,e,-1.2,1,13.55,14.6,1,1.08,$c);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:mcd:shell",l.add(c);let u=jv();if(u){let g=new W;bf(g,e,-2.15,2.55,1.35,2.75,.7),bf(g,e,1,4.5,1.45,2.9,1.55);let b=new k(g.geometry(),new z({map:u,side:$}));b.name="aw:mcd:menu",l.add(b)}let h=new q(Zv(),new z({vertexColors:!0}),10),d=new q(Kv(),new z({vertexColors:!0}),5);h.name="aw:mcd:chairs",d.name="aw:mcd:tables",h.frustumCulled=!1,d.frustumCulled=!1;let f=[[-7.3,5.6],[-3.7,6.8],[-7.2,9.4],[1.4,5.8],[3.8,9.2]];f.forEach(([g,b],v)=>{Qc(d,v,e,g,b,[0,1]),Qc(h,v*2,e,g,b-.7,[e.nx,e.nz]),Qc(h,v*2+1,e,g,b+.7,[-e.nx,-e.nz])}),h.count=f.length*2,d.count=f.length,h.instanceMatrix.needsUpdate=!0,d.instanceMatrix.needsUpdate=!0,h.boundingSphere=new X(new M(0,1,0),24),d.boundingSphere=new X(new M(0,1,0),24),l.add(h,d);let p=new q(new ke(.08,5,4),new z({color:16759821}),4);p.name="aw:mcd:bags",p.frustumCulled=!1;let m=new M(.7,1.1,.7);[-1.4,-.3,.8,1.9].forEach((g,b)=>{let v=w(e,g,3.7,1.22);da.set(v[0],v[1],v[2]),p.setMatrixAt(b,Sf.compose(da,tu.identity(),m))}),p.count=4,p.instanceMatrix.needsUpdate=!0,p.boundingSphere=new X(new M(0,1,0),20),l.add(p)}var au=-8064.4,lu=-5917.18,Tf=[[-8085.1,-5908.6],[-8045.2,-5904.4],[-8042.6,-5926.7],[-8084.7,-5929]],Qv=[[-20.7,8.57],[19.2,12.77],[21.8,-9.53],[-20.3,-11.82]],ni=Te(Qv,3,2),ru=0,pa=2.2,ma=2.85;ni.doorAt=ru;ni.depth=14;var fa=[0,.44,.29],qs=[.12,.22,.2],Ef=[.62,.4,.2],ga=[.4,.24,.12],Xs=[.95,.92,.86],e_=[.94,.92,.88],t_=[.55,.62,.58],n_=[.97,.96,.94],Rf=[{a0:3.3,a1:11.3,d0:2.3,d1:4},{a0:3.15,a1:4.7,d0:1.5,d1:2.4},{a0:-8.1,a1:-6.9,d0:4.7,d1:5.9},{a0:-4.9,a1:-3.5,d0:7.4,d1:8.6},{a0:-8.6,a1:-7.4,d0:9.9,d1:11.1},{a0:5.9,a1:7.1,d0:6,d1:7.2},{a0:2,a1:3.2,d0:8.5,d1:9.7},{a0:-3.4,a1:-2.2,d0:10.9,d1:12.1},{a0:-4.2,a1:8.2,d0:12.5,d1:13.8}],Ys={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function i_(){let l=new W;A(l,Ys,-.2,.2,-.18,.18,.44,.5,qs),A(l,Ys,-.2,.2,-.2,-.14,.5,.92,fa);for(let[e,t]of[[-.16,-.14],[.16,-.14],[-.16,.14],[.16,.14]])A(l,Ys,e-.02,e+.02,t-.02,t+.02,.02,.44,ga);return l.geometry()}function s_(){let l=new W;return A(l,Ys,-.42,.42,-.42,.42,.72,.78,Ef),A(l,Ys,-.06,.06,-.06,.06,.05,.72,ga),l.geometry()}function r_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f3efe6",e.fillRect(0,0,512,512),e.fillStyle="#00704a",e.fillRect(0,0,512,86),e.fillStyle="#ffffff",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("STARBUCKS",256,34),e.font="600 18px Arial, sans-serif",e.fillText("Paseo Herencia",256,66),[["Pike Place","4.25"],["Caffe Latte","5.50"],["Cappuccino","5.25"],["Americano","4.50"],["Caramel Macchiato","6.25"],["Caffe Mocha","5.95"],["Frappuccino","6.50"],["Iced Tea","4.25"]].forEach((i,s)=>{let r=128+s*42;e.fillStyle=s%2?"#e7f2ec":"#f3efe6",e.fillRect(16,r-22,480,42),e.fillStyle="#1e3932",e.font="600 24px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],476,r)});let n=new le(l);return n.colorSpace=j,n}function o_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,a,n-r,i),w(e,a,n+r,i),w(e,a,n+r,s),w(e,a,n-r,s)],c,[1,1,1],u)};o(t,[-e.ux,0,-e.uz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.03,[e.ux,0,e.uz],[[0,0],[1,0],[1,1],[0,1]])}var a_=new M(0,1,0),ou=new Z,xa=new M,l_=new M(1,1,1),Cf=new F;function su(l,e,t,n,i,s){let r=w(t,n,i,0);xa.set(r[0],0,r[2]),ou.setFromAxisAngle(a_,Math.atan2(s[0],s[1])),l.setMatrixAt(e,Cf.compose(xa,ou,l_))}function If(l,e){let t=new W,n=ni.halfW,i=ni.depth,s=ru-pa,r=ru+pa,o=.12;t.quad([w(e,-n+.4,.02,.02),w(e,n-.4,.02,.02),w(e,n-.4,i-.3,.02),w(e,-n+.4,i-.3,.02)],[0,1,0],[.72,.69,.64]);let a=1.6;for(let g=-n+.6;g<n-.7;g+=a)for(let b=.06;b<i-.45;b+=a){let v=Math.min(g+a-.05,n-.5),y=Math.min(b+a-.05,i-.35),_=(Math.round(g/a)+Math.round(b/a)&1)===0;t.quad([w(e,g,b,.07),w(e,v,b,.07),w(e,v,y,.07),w(e,g,y,.07)],[0,1,0],_?e_:t_)}t.quad([w(e,-n+.45,.3,3.15),w(e,n-.45,.3,3.15),w(e,n-.45,i-.35,3.15),w(e,-n+.45,i-.35,3.15)],[0,-1,0],[.93,.9,.84]),A(t,e,-n+.28,-n+.28+o,.4,i-.25,.04,3.15,Xs),A(t,e,n-.28-o,n-.28,.4,i-.25,.04,3.15,Xs),A(t,e,-n+.35,n-.35,i-.28,i-.16,.04,3.15,qs),A(t,e,-n+.3,s,.16,.16+o,.02,ma,Xs),A(t,e,r,n-.3,.16,.16+o,.02,ma,Xs),A(t,e,s,r,.18,.18+o,2.52,2.8,fa),A(t,e,s+.04,s+.16,.18,.42,.02,2.7,qs),A(t,e,r-.16,r-.04,.18,.42,.02,2.7,qs),A(t,e,-n+.35,n-.35,.2,.4,2.88,3.16,Xs),A(t,e,3.4,11.2,2.45,3.9,.04,1.05,Ef),A(t,e,3.35,11.25,2.4,3.95,1.05,1.12,ga),A(t,e,3.4,11.2,2.4,2.55,.2,1.05,fa),A(t,e,3.2,4.6,1.55,2.35,.7,1.15,n_),A(t,e,3.25,4.55,1.6,2.3,.15,.7,ga),A(t,e,-4,8,12.7,13.6,.04,1,qs),A(t,e,-1,2.2,12.85,13.4,1,1.08,fa);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:sbux:shell",l.add(c);let u=r_();if(u){let g=new W;o_(g,e,3.15,3.15,1.45,2.95,1.15);let b=new k(g.geometry(),new z({map:u,side:$}));b.name="aw:sbux:menu",l.add(b)}let h=[[-7.5,5.3],[-4.2,8],[-8,10.5],[6.5,6.6],[2.6,9.1],[-2.8,11.5]],d=new q(i_(),new z({vertexColors:!0}),h.length*2),f=new q(s_(),new z({vertexColors:!0}),h.length);d.name="aw:sbux:chairs",f.name="aw:sbux:tables",d.frustumCulled=!1,f.frustumCulled=!1,h.forEach(([g,b],v)=>{su(f,v,e,g,b,[1,0]),su(d,v*2,e,g-.75,b,[e.ux,e.uz]),su(d,v*2+1,e,g+.75,b,[-e.ux,-e.uz])}),d.count=h.length*2,f.count=h.length,d.instanceMatrix.needsUpdate=!0,f.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new M(0,1,0),28),f.boundingSphere=new X(new M(0,1,0),28),l.add(d,f);let p=new q(new ke(.07,6,4),new z({color:16052714}),4);p.name="aw:sbux:cups",p.frustumCulled=!1;let m=new M(.85,1.15,.85);[4.2,6.1,8,9.6].forEach((g,b)=>{let v=w(e,g,3.15,1.2);xa.set(v[0],v[1],v[2]),p.setMatrixAt(b,Cf.compose(xa,ou.identity(),m))}),p.count=4,p.instanceMatrix.needsUpdate=!0,p.boundingSphere=new X(new M(0,1,0),22),l.add(p)}var uu=-7891.58,hu=-5983.49,Of=[[-7971.5,-5946.6],[-7932.6,-5941.9],[-7933.2,-5937],[-7928.7,-5936.4],[-7928.1,-5941.4],[-7870.6,-5935.2],[-7871.9,-5933.5],[-7871.4,-5931.2],[-7869.7,-5930.2],[-7867.6,-5930.6],[-7866.8,-5931.4],[-7866.5,-5933.6],[-7867.9,-5935.3],[-7869.9,-5935.6],[-7866.5,-5970.7],[-7885.8,-5972.7],[-7884.4,-5986.3],[-7865.1,-5984.4],[-7861.6,-6019.9],[-7860.2,-6019.4],[-7858.2,-6019.9],[-7857,-6021.7],[-7857.4,-6023.7],[-7859.3,-6025],[-7861.4,-6024.6],[-7862.6,-6022.9],[-7862.3,-6020.7],[-7919.6,-6026.3],[-7919.1,-6032.4],[-7923,-6032.8],[-7923.2,-6030.6],[-7926.2,-6030.9],[-7926.5,-6027.1],[-7961.6,-6030.5]],Ks={mx:39.8,mz:-17.5,ux:-.0995,uz:.995,nx:-.995,nz:-.0995,halfW:6.2,depth:22,minX:-20,maxX:55,minZ:-45,maxZ:10,doorAt:0,mouthIn:13.2},ba=3.3,va=4.65,Pf=[.05,.28,.72],c_=[.03,.16,.42],Zs=[.95,.93,.9],u_=[.93,.93,.9],h_=[.72,.78,.82],Lf=[.84,.58,.4],d_=[.72,.08,.12],f_=[.95,.78,.12],p_=[.45,.3,.16],Ff=[{a0:3.15,a1:5.85,d0:14.1,d1:16.5},{a0:-5.85,a1:-3.15,d0:14.1,d1:16.5},{a0:-2.3,a1:2.3,d0:19.1,d1:21.3},{a0:2.05,a1:3.15,d0:13.5,d1:14.85},{a0:-3.15,a1:-2.05,d0:13.5,d1:14.85}],cu={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function m_(){let l=new W;A(l,cu,-.55,.55,-.22,.22,.42,.5,p_),A(l,cu,-.55,.55,-.24,-.16,.5,.92,c_);for(let[e,t]of[[-.46,-.16],[.46,-.16],[-.46,.16],[.46,.16]])A(l,cu,e-.03,e+.03,t-.03,t+.03,.04,.42,[.25,.27,.3]);return l.geometry()}function g_(l,e,t,n){let i=document.createElement("canvas");i.width=512,i.height=256;let s=i.getContext("2d");if(!s)return null;s.fillStyle=t,s.fillRect(0,0,512,256),s.fillStyle=n,s.font="700 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(l,256,e?100:128),e&&(s.font="600 28px Arial, sans-serif",s.fillText(e,256,168));let r=new le(i);return r.colorSpace=j,r}function x_(l,e,t,n,i,s,r,o){let a=[e.nx*o,0,e.nz*o],c=o<0?[[1,0],[0,0],[0,1],[1,1]]:[[0,0],[1,0],[1,1],[0,1]];l.quad([w(e,t,i,s),w(e,n,i,s),w(e,n,i,r),w(e,t,i,r)],a,[1,1,1],c)}var b_=new M(0,1,0),Df=new Z,Nf=new M,v_=new M(1,1,1),__=new F;function Uf(l,e){let t=new W,n=Ks.halfW,i=Ks.depth,s=-ba,r=ba;t.quad([w(e,-n+.3,.15,.02),w(e,n-.3,.15,.02),w(e,n-.3,i-.25,.02),w(e,-n+.3,i-.25,.02)],[0,1,0],[.8,.8,.78]);let o=1.8;for(let d=-n+.45;d<n-.5;d+=o)for(let f=.2;f<i-.35;f+=o){let p=Math.min(d+o-.06,n-.4),m=Math.min(f+o-.06,i-.3),g=(Math.round(d/o)+Math.round(f/o)&1)===0;t.quad([w(e,d,f,.06),w(e,p,f,.06),w(e,p,m,.06),w(e,d,m,.06)],[0,1,0],g?u_:h_)}t.quad([w(e,-n+.35,.4,4.35),w(e,n-.35,.4,4.35),w(e,n-.35,i-.3,4.35),w(e,-n+.35,i-.3,4.35)],[0,-1,0],[.96,.96,.94]),A(t,e,s,r,.25,1.3,4.15,4.4,Pf),A(t,e,-n+.2,-n+.38,.4,i-.3,.04,4.3,Zs),A(t,e,n-.38,n-.2,.4,i-.3,.04,4.3,Zs),A(t,e,-n+.3,n-.3,i-.35,i-.18,.04,4.3,Zs),A(t,e,-n+.3,s,.12,.32,.02,va,Lf),A(t,e,r,n-.3,.12,.32,.02,va,Lf),A(t,e,3.2,5.8,14.2,16.4,.05,1.05,Zs),A(t,e,3.2,5.8,14.15,14.4,1.05,2.55,Pf),A(t,e,3.25,5.75,14.1,14.28,2.55,2.72,f_),A(t,e,-5.8,-3.2,14.2,16.4,.05,1.05,Zs),A(t,e,-5.8,-3.2,14.15,14.4,1.05,2.45,[.15,.18,.45]),A(t,e,-2.2,2.2,19.2,21.2,.05,1.1,[.12,.12,.14]),A(t,e,-2.8,2.8,19.05,19.3,1.1,2.7,d_);let a=new k(t.geometry(),new z({vertexColors:!0,side:$}));a.name="aw:plaza:shell",l.add(a),[["SKECHERS","","#0a2a6b","#ffe14a",3.25,5.75,14.12,1.2,2.45],["NIEL'S","FASHION","#101433","#ffffff",-5.75,-3.25,14.12,1.15,2.35],["CARIBBEAN","CINEMAS","#b00018","#ffffff",-2.1,2.1,19.02,1.25,2.55],["PALM BEACH","PLAZA","#08306b","#ffffff",-1.8,1.8,6.4,2.85,4.05]].forEach((d,f)=>{let p=g_(d[0],d[1],d[2],d[3]);if(!p)return;let m=new W;x_(m,e,d[4],d[5],d[6],d[7],d[8],-1);let g=new k(m.geometry(),new z({map:p,side:$}));g.name="aw:plaza:sign"+f,l.add(g)});let u=[[2.6,14.15],[-2.6,14.15]],h=new q(m_(),new z({vertexColors:!0}),u.length);h.name="aw:plaza:benches",h.frustumCulled=!1,u.forEach(([d,f],p)=>{let m=w(e,d,f,0);Nf.set(m[0],0,m[2]),Df.setFromAxisAngle(b_,Math.atan2(e.ux,e.uz)),h.setMatrixAt(p,__.compose(Nf,Df,v_))}),h.count=u.length,h.instanceMatrix.needsUpdate=!0,h.boundingSphere=new X(new M(0,1,0),24),l.add(h)}var fu=-8050.1,pu=-5471.13,kf=[[-8057.4,-5467.6],[-8044.4,-5465.4],[-8042.8,-5474.7],[-8055.8,-5476.8]],y_=[[-7.3,3.47],[5.7,5.73],[7.3,-3.57],[-5.7,-5.67]],ii=Te(y_,0,1),wa=1.65,Sa=3.4;ii.doorAt=0;ii.depth=7.6;var bn=[.07,.07,.08],js=[.74,.05,.07],Bf=[.93,.74,.1],du=[.45,.28,.13],mu=[.28,.16,.08],M_=[.14,.14,.15],w_=[.22,.2,.18],S_=[.93,.9,.84],zf=[{a0:1.55,a1:5.15,d0:2.15,d1:3.55},{a0:1.85,a1:2.45,d0:1.45,d1:2.05},{a0:3.05,a1:3.65,d0:1.45,d1:2.05},{a0:4.25,a1:4.85,d0:1.45,d1:2.05},{a0:-4.85,a1:-3.55,d0:3.15,d1:4.45},{a0:-4.7,a1:-3.4,d0:5.45,d1:6.75}],vn={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function A_(){let l=new W;return A(l,vn,-.16,.16,-.16,.16,.62,.72,bn),A(l,vn,-.04,.04,-.04,.04,.08,.62,[.55,.55,.58]),A(l,vn,-.14,.14,-.14,.14,.02,.08,bn),l.geometry()}function T_(){let l=new W;return A(l,vn,-.42,.42,-.42,.42,.7,.76,du),A(l,vn,-.05,.05,-.05,.05,.05,.7,mu),l.geometry()}function E_(){let l=new W;A(l,vn,-.18,.18,-.18,.18,.42,.48,bn),A(l,vn,-.18,.18,-.18,-.12,.48,.9,js);for(let[e,t]of[[-.14,-.14],[.14,-.14],[-.14,.14],[.14,.14]])A(l,vn,e-.02,e+.02,t-.02,t+.02,.04,.42,mu);return l.geometry()}function R_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#141416",e.fillRect(0,0,512,512),e.fillStyle="#c8102e",e.fillRect(0,0,512,92),e.fillStyle="#f5d76e",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HARD ROCK",256,36),e.font="600 20px Arial, sans-serif",e.fillStyle="#ffffff",e.fillText("CAFE  \xB7  PALM BEACH",256,70),[["Legendary Burger","16"],["BBQ Ribs","22"],["Chicken Wings","14"],["Grilled Chicken","17"],["Caesar Salad","13"],["Fries","6"]].forEach((i,s)=>{let r=140+s*56;e.fillStyle=s%2?"#1c1c20":"#141416",e.fillRect(18,r-26,476,52),e.fillStyle="#f4efe4",e.font="600 26px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],36,r),e.fillStyle="#f5d76e",e.textAlign="right",e.fillText(i[1],472,r)});let n=new le(l);return n.colorSpace=j,n}function C_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,a,n-r,i),w(e,a,n+r,i),w(e,a,n+r,s),w(e,a,n-r,s)],c,[1,1,1],u)};o(t,[-e.ux,0,-e.uz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.03,[e.ux,0,e.uz],[[1,0],[0,0],[0,1],[1,1]])}var _a=new M(0,1,0),gn=new Z,xn=new M,ya=new M(1,1,1),Ma=new F;function Gf(l,e){let t=new W,n=ii.halfW,i=ii.depth,s=-wa,r=wa,o=.1;t.quad([w(e,-n+.3,.15,.02),w(e,n-.3,.15,.02),w(e,n-.3,i-.25,.02),w(e,-n+.3,i-.25,.02)],[0,1,0],[.1,.1,.11]);let a=1.35;for(let g=-n+.4;g<n-.45;g+=a)for(let b=.2;b<i-.35;b+=a){let v=Math.min(g+a-.05,n-.35),y=Math.min(b+a-.05,i-.28),_=(Math.round(g/a)+Math.round(b/a)&1)===0;t.quad([w(e,g,b,.05),w(e,v,b,.05),w(e,v,y,.05),w(e,g,y,.05)],[0,1,0],_?M_:w_)}t.quad([w(e,-n+.35,.3,3.55),w(e,n-.35,.3,3.55),w(e,n-.35,i-.3,3.55),w(e,-n+.35,i-.3,3.55)],[0,-1,0],[.1,.1,.11]),A(t,e,-n+.18,-n+.18+o,.3,i-.2,.04,3.5,bn),A(t,e,n-.18-o,n-.18,.3,i-.2,.04,3.5,bn),A(t,e,-n+.25,n-.25,i-.28,i-.16,.04,3.5,bn),A(t,e,-n+.25,s,.12,.12+o,.02,Sa,bn),A(t,e,r,n-.25,.12,.12+o,.02,Sa,bn),A(t,e,s,r,.14,.14+o,3.05,3.32,js),A(t,e,s,r,.16,.16+o,2.92,3.04,Bf),A(t,e,1.6,5.1,2.2,3.5,.04,1.05,du),A(t,e,1.55,5.15,2.15,3.55,1.05,1.12,mu),A(t,e,1.6,5.1,2.15,2.32,.15,1.05,js),A(t,e,1.55,1.72,2.2,3.5,.15,1.05,js),A(t,e,1.6,5.1,2.15,2.28,1.02,1.08,Bf),A(t,e,-.55,.55,i-.42,i-.22,1.15,1.85,js),A(t,e,-.08,.08,i-.4,i-.24,1.85,2.85,du),A(t,e,-.16,.16,i-.4,i-.24,2.85,3.1,S_);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:hr:shell",l.add(c);let u=R_();if(u){let g=new W;C_(g,e,1.52,2.85,1.25,2.85,.85);let b=new k(g.geometry(),new z({map:u,side:$}));b.name="aw:hr:menu",l.add(b)}let h=[[2.15,1.75],[3.35,1.75],[4.55,1.75]],d=new q(A_(),new z({vertexColors:!0}),h.length);d.name="aw:hr:stools",d.frustumCulled=!1,h.forEach(([g,b],v)=>{let y=w(e,g,b,0);xn.set(y[0],0,y[2]),gn.setFromAxisAngle(_a,Math.atan2(-e.ux,-e.uz)),d.setMatrixAt(v,Ma.compose(xn,gn,ya))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new M(0,1,0),16),l.add(d);let f=[[-4.2,3.8],[-4.05,6.1]],p=new q(E_(),new z({vertexColors:!0}),f.length*2),m=new q(T_(),new z({vertexColors:!0}),f.length);p.name="aw:hr:chairs",m.name="aw:hr:tables",p.frustumCulled=!1,m.frustumCulled=!1,f.forEach(([g,b],v)=>{let y=w(e,g,b,0);xn.set(y[0],0,y[2]),gn.setFromAxisAngle(_a,0),m.setMatrixAt(v,Ma.compose(xn,gn,ya));let _=w(e,g-.7,b,0);xn.set(_[0],0,_[2]),gn.setFromAxisAngle(_a,Math.atan2(e.ux,e.uz)),p.setMatrixAt(v*2,Ma.compose(xn,gn,ya));let S=w(e,g+.7,b,0);xn.set(S[0],0,S[2]),gn.setFromAxisAngle(_a,Math.atan2(-e.ux,-e.uz)),p.setMatrixAt(v*2+1,Ma.compose(xn,gn,ya))}),p.count=f.length*2,m.count=f.length,p.instanceMatrix.needsUpdate=!0,m.instanceMatrix.needsUpdate=!0,p.boundingSphere=new X(new M(0,1,0),16),m.boundingSphere=new X(new M(0,1,0),16),l.add(p,m)}var yu=-7830.95,Mu=-6156.4,Wf=[[-7847.6,-6120],[-7820.6,-6117.4],[-7814.2,-6193.2],[-7841.4,-6195]],I_=[[-16.65,36.4],[10.35,39],[16.75,-36.8],[-10.45,-38.6]],_n=Te(I_,0,1),Aa=3.35,Js=4.15;_n.doorAt=0;_n.depth=13.6;_n.halfW=9.4;var qi=[.94,.94,.95],gu=[.06,.2,.46],P_=[.16,.4,.68],Xf=[.91,.88,.82],L_=[.74,.82,.86],_u=[.52,.36,.2],$s=[.32,.2,.1],Hf=[.2,.46,.26],D_=[.14,.34,.6],ae=1.42,qf=[{a0:-3.4,a1:3.4,d0:8.5,d1:10.5},{a0:5.15,a1:8.7,d0:2.25,d1:4.15},{a0:-7.15,a1:-5.35,d0:4.15,d1:5.55},{a0:-6.9,a1:-5.1,d0:6.55,d1:7.95},{a0:-4.3,a1:-2.7,d0:5.2,d1:6.5}],Ki={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function N_(){let l=new W;return A(l,Ki,-.28,.28,-.28,.28,.4,.48,D_),A(l,Ki,-.28,.28,-.28,-.16,.48,.86,Xf),A(l,Ki,-.26,-.2,-.26,.26,.2,.52,$s),A(l,Ki,.2,.26,-.26,.26,.2,.52,$s),l.geometry()}function O_(){let l=new W;return A(l,Ki,-.36,.36,-.36,.36,.4,.46,_u),A(l,Ki,-.05,.05,-.05,.05,.05,.4,$s),l.geometry()}function Vf(l){let e=document.createElement("canvas");e.width=512,e.height=512;let t=e.getContext("2d");if(!t)return null;l==="desk"?(t.fillStyle="#0d2748",t.fillRect(0,0,512,512),t.fillStyle="#ffffff",t.font="700 54px Arial, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("RADISSON",256,150),t.fillStyle="#8ec8f0",t.font="700 48px Arial, sans-serif",t.fillText("BLU",256,214),t.fillStyle="#d5e4f2",t.font="600 26px Arial, sans-serif",["Reception","The Clover","Pool  \xB7  Beach"].forEach((s,r)=>t.fillText(s,256,310+r*48))):(t.fillStyle="#1c2418",t.fillRect(0,0,512,512),t.fillStyle="#2f6b3a",t.fillRect(0,0,512,96),t.fillStyle="#f4efe4",t.font="700 40px Arial, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("THE CLOVER",256,40),t.font="600 18px Arial, sans-serif",t.fillText("COFFEE  \xB7  TEA",256,74),[["House Coffee","4"],["Espresso","3"],["Iced Tea","4"],["Fruit Bowl","8"],["Avocado Toast","11"]].forEach((s,r)=>{let o=150+r*64;t.fillStyle=r%2?"#243024":"#1c2418",t.fillRect(16,o-28,480,56),t.fillStyle="#f4efe4",t.font="600 26px Arial, sans-serif",t.textAlign="left",t.fillText(s[0],36,o),t.fillStyle="#d4e37a",t.textAlign="right",t.fillText(s[1],468,o)}));let n=new le(e);return n.colorSpace=j,n}function F_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,n,a,s),w(e,i,a,s),w(e,i,a,r),w(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}function U_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,a,n-r,i),w(e,a,n+r,i),w(e,a,n+r,s),w(e,a,n-r,s)],c,[1,1,1],u)};o(t,[-e.ux,0,-e.uz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.03,[e.ux,0,e.uz],[[1,0],[0,0],[0,1],[1,1]])}var xu=new M(0,1,0),Yi=new Z,Zi=new M,bu=new M(1,1,1),vu=new F;function Yf(l,e){let t=new W,n=_n.halfW,i=_n.depth,s=-Aa,r=Aa,o=.12;t.quad([w(e,-n+.25,.12,ae),w(e,n-.25,.12,ae),w(e,n-.25,i-.2,ae),w(e,-n+.25,i-.2,ae)],[0,1,0],[.86,.84,.8]);let a=1.6;for(let g=-n+.35;g<n-.4;g+=a)for(let b=.18;b<i-.3;b+=a){let v=Math.min(g+a-.06,n-.3),y=Math.min(b+a-.06,i-.24),_=(Math.round(g/a)+Math.round(b/a)&1)===0;t.quad([w(e,g,b,ae+.03),w(e,v,b,ae+.03),w(e,v,y,ae+.03),w(e,g,y,ae+.03)],[0,1,0],_?Xf:L_)}t.quad([w(e,-n+.3,.25,4.02),w(e,n-.3,.25,4.02),w(e,n-.3,i-.25,4.02),w(e,-n+.3,i-.25,4.02)],[0,-1,0],qi),A(t,e,-n+.4,n-.4,.4,i-.35,3.88,4,gu),A(t,e,-n+.15,-n+.15+o,.2,i-.15,ae,3.98,qi),A(t,e,n-.15-o,n-.15,.2,i-.15,ae,3.98,qi),A(t,e,-n+.2,n-.2,i-.22,i-.1,ae,3.98,qi),A(t,e,-n+.2,s,.1,.1+o,ae,Js,qi),A(t,e,r,n-.2,.1,.1+o,ae,Js,qi),A(t,e,s,r,.12,.12+o,3.78,Js+.02,gu),A(t,e,-3.2,3.2,8.6,10.3,ae,ae+1.05,_u),A(t,e,-3.3,3.3,8.55,10.4,ae+1.05,ae+1.12,$s),A(t,e,-3.2,3.2,8.5,8.7,ae+.08,ae+1.05,gu),A(t,e,-3.2,3.2,8.52,8.66,ae+.92,ae+1,P_),A(t,e,5.2,8.6,2.3,4.05,ae,ae+1.02,_u),A(t,e,5.15,8.65,2.25,4.1,ae+1.02,ae+1.1,$s),A(t,e,5.2,5.38,2.35,4,ae+.1,ae+1.02,Hf),A(t,e,7.6,8.4,2.45,3.15,ae+1.1,ae+1.7,Hf),A(t,e,6.3,7.2,2.4,3,ae+1.1,ae+1.52,[.55,.62,.32]);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:rd:shell",l.add(c);let u=Vf("desk");if(u){let g=new W;F_(g,e,11.15,-2.5,2.5,ae+1.15,ae+2.45);let b=new k(g.geometry(),new z({map:u,side:$}));b.name="aw:rd:desk",l.add(b)}let h=Vf("clover");if(h){let g=new W;U_(g,e,5.12,3.15,ae+1.15,ae+2.35,.7);let b=new k(g.geometry(),new z({map:h,side:$}));b.name="aw:rd:clover",l.add(b)}let d=[[-6.25,4.85],[-6,7.25]],f=new q(N_(),new z({vertexColors:!0}),d.length*2),p=new q(O_(),new z({vertexColors:!0}),1);f.name="aw:rd:chairs",p.name="aw:rd:tables",f.frustumCulled=!1,p.frustumCulled=!1,d.forEach(([g,b],v)=>{let y=w(e,g-.55,b,0);Zi.set(y[0],ae,y[2]),Yi.setFromAxisAngle(xu,Math.atan2(e.nx,e.nz)),f.setMatrixAt(v*2,vu.compose(Zi,Yi,bu));let _=w(e,g+.55,b,0);Zi.set(_[0],ae,_[2]),Yi.setFromAxisAngle(xu,Math.atan2(-e.nx,-e.nz)),f.setMatrixAt(v*2+1,vu.compose(Zi,Yi,bu))});let m=w(e,-3.5,5.85,0);Zi.set(m[0],ae,m[2]),Yi.setFromAxisAngle(xu,0),p.setMatrixAt(0,vu.compose(Zi,Yi,bu)),f.count=d.length*2,p.count=1,f.instanceMatrix.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0,f.boundingSphere=new X(new M(0,1,0),20),p.boundingSphere=new X(new M(0,1,0),20),l.add(f,p)}var Su=-8208.36,Au=-5722.87,tp=[[-8279.3,-5764.7],[-8277.7,-5764.3],[-8279.3,-5758.7],[-8196.9,-5735.5],[-8213.1,-5679],[-8239.9,-5686.5],[-8241.1,-5682.5],[-8242.9,-5683.1],[-8245.7,-5673.4],[-8243.8,-5672.9],[-8245.1,-5668.4],[-8201.5,-5656.6],[-8200.1,-5661.4],[-8196.7,-5660.5],[-8193.3,-5672.4],[-8196.7,-5673.4],[-8190.7,-5694.2],[-8184.5,-5692.5],[-8181.4,-5703],[-8188,-5704.8],[-8183.8,-5719.4],[-8163.2,-5713.6],[-8164,-5710.8],[-8154.6,-5708.1],[-8151.9,-5717.5],[-8156.1,-5718.7],[-8147.5,-5748.7],[-8156,-5751.1],[-8148.3,-5777.8],[-8170,-5784],[-8169.7,-5784.9],[-8176.2,-5786.7],[-8176.8,-5784.3],[-8182.3,-5785.8],[-8190,-5758.9],[-8258.7,-5778.3],[-8258.4,-5779.4],[-8268.2,-5782.2],[-8269.1,-5779.1],[-8274.8,-5780.7]],Zf=-.9613,Kf=-.2755,B_=[[52.26,4.17],[60.86,-25.84],[60.86+Zf*14,-25.84+Kf*14],[52.26+Zf*14,4.17+Kf*14]],yn=Te(B_,0,1),Ta=2.7,Qs=4.05;yn.doorAt=0;yn.depth=11.5;yn.halfW=8.2;var si=[.93,.88,.78],jf=[.82,.74,.62],wu=[.72,.34,.2],k_=[.48,.3,.16],z_=[.3,.18,.09],Jf=[.18,.4,.24],G_=[.96,.94,.9],we=.08,np=[{a0:-3.3,a1:3.3,d0:7.15,d1:9.05},{a0:-6.4,a1:-4.6,d0:3.6,d1:5.1},{a0:4.5,a1:6.3,d0:3.8,d1:5.3}],$f={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function H_(){let l=new W;return A(l,$f,-.26,.26,-.26,.26,.4,.48,wu),A(l,$f,-.26,.26,-.26,-.16,.48,.84,si),l.geometry()}function V_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f3eadc",e.fillRect(0,0,512,512),e.fillStyle="#8c3b22",e.fillRect(0,0,512,168),e.fillStyle="#fff8ee",e.font="700 58px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HYATT",256,58),e.font="600 32px Arial, sans-serif",e.fillText("REGENCY ARUBA",256,118),e.fillStyle="#3a2a1c",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,240+i*64));let t=new le(l);return t.colorSpace=j,t}function W_(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,n,a,s),w(e,i,a,s),w(e,i,a,r),w(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var X_=new M(0,1,0),Qf=new Z,ep=new M,q_=new M(1,1,1),Y_=new F;function ip(l,e){let t=new W,n=yn.halfW,i=yn.depth,s=-Ta,r=Ta,o=.12;t.quad([w(e,-n+.25,.12,we),w(e,n-.25,.12,we),w(e,n-.25,i-.2,we),w(e,-n+.25,i-.2,we)],[0,1,0],jf);let a=1.7;for(let f=-n+.35;f<n-.4;f+=a)for(let p=.16;p<i-.28;p+=a){let m=Math.min(f+a-.07,n-.3),g=Math.min(p+a-.07,i-.22),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([w(e,f,p,we+.03),w(e,m,p,we+.03),w(e,m,g,we+.03),w(e,f,g,we+.03)],[0,1,0],b?si:jf)}t.quad([w(e,-n+.3,.25,3.95),w(e,n-.3,.25,3.95),w(e,n-.3,i-.25,3.95),w(e,-n+.3,i-.25,3.95)],[0,-1,0],G_),A(t,e,-n+.15,-n+.15+o,.2,i-.15,we,3.9,si),A(t,e,n-.15-o,n-.15,.2,i-.15,we,3.9,si),A(t,e,-n+.2,n-.2,i-.22,i-.1,we,3.9,si),A(t,e,-n+.2,s,.1,.1+o,we,Qs,si),A(t,e,r,n-.2,.1,.1+o,we,Qs,si),A(t,e,s,r,.12,.12+o,3.7,Qs+.02,wu),A(t,e,-3.15,3.15,7.25,8.95,we,we+1.05,k_),A(t,e,-3.25,3.25,7.2,9,we+1.05,we+1.12,z_),A(t,e,-3.1,3.1,7.15,7.35,we+.1,we+1.05,wu),A(t,e,-5.6,-4.8,3.4,4.2,we,we+.9,Jf),A(t,e,4.7,5.6,3.5,4.3,we,we+.9,Jf);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:hy:shell",l.add(c);let u=V_();if(u){let f=new W;W_(f,e,9.6,-2.4,2.4,we+1.2,we+2.7);let p=new k(f.geometry(),new z({map:u,side:$}));p.name="aw:hy:board",l.add(p)}let h=[[-5.5,4.35],[5.4,4.55]],d=new q(H_(),new z({vertexColors:!0}),h.length);d.name="aw:hy:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);ep.set(g[0],we,g[2]),Qf.setFromAxisAngle(X_,Math.atan2(e.ux,e.uz)+(m?Math.PI:0)),d.setMatrixAt(m,Y_.compose(ep,Qf,q_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new M(0,1,0),18),l.add(d)}var Eu=-8295.39,Ru=-5327.6,hp=[[-8333,-5404.5],[-8327.4,-5389.2],[-8323.1,-5390.9],[-8316,-5372.2],[-8324.5,-5369.4],[-8321,-5360.3],[-8324.5,-5358.8],[-8329.4,-5354.3],[-8330.8,-5351.3],[-8332.4,-5344.6],[-8331.5,-5338.6],[-8324.8,-5318],[-8326.7,-5316.1],[-8328.3,-5312.6],[-8329.1,-5308.6],[-8329,-5305],[-8321.7,-5285.8],[-8319.3,-5282.2],[-8313.9,-5279.4],[-8319.1,-5266.5],[-8315.4,-5264.4],[-8323.5,-5248.6],[-8314.9,-5244],[-8307.9,-5260.4],[-8305.4,-5259.6],[-8300.7,-5270.3],[-8303.1,-5271.7],[-8297.3,-5284],[-8298.4,-5287.7],[-8282.3,-5293.9],[-8272.1,-5270.5],[-8246.6,-5280.9],[-8250.7,-5288.9],[-8246.3,-5290.9],[-8251.7,-5303.4],[-8255.4,-5302.1],[-8270.8,-5335.7],[-8273.5,-5330.5],[-8277.7,-5332.9],[-8273.6,-5340.9],[-8269.2,-5339.2],[-8265.7,-5347.7],[-8281,-5353.2],[-8275.3,-5367.4],[-8270,-5354.3],[-8262.4,-5357],[-8272.9,-5386.7],[-8266.7,-5389.7],[-8270.3,-5398.5],[-8280.4,-5394.3],[-8285.8,-5405.6],[-8287.9,-5404.9],[-8295.5,-5388.1]],sp=-.918,rp=.3966,Z_=[[49.08,36.7],[43.68,24.2],[43.68+sp*14,24.2+rp*14],[49.08+sp*14,36.7+rp*14]],wn=Te(Z_,0,1),Ea=2.8,er=4.15;wn.doorAt=0;wn.depth=10.2;wn.halfW=5.5;var Mn=[.96,.95,.92],K_=[.93,.9,.83],op=[.84,.8,.72],Tu=[.07,.16,.36],j_=[.12,.45,.52],J_=[.72,.58,.28],ap=[.16,.4,.26],pe=.08,dp=[{a0:-2.85,a1:2.85,d0:7.1,d1:9.05},{a0:-4.85,a1:-3.35,d0:3.55,d1:5.05},{a0:3.25,a1:4.75,d0:3.55,d1:5.05}],lp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function $_(){let l=new W;return A(l,lp,-.28,.28,-.28,.28,.38,.46,j_),A(l,lp,-.28,.28,-.28,-.16,.46,.86,Mn),l.geometry()}function Q_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4f1ea",e.fillRect(0,0,512,512),e.fillStyle="#12295c",e.fillRect(0,0,512,176),e.fillStyle="#f7f4ee",e.font="700 64px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HILTON",256,58),e.font="600 28px Arial, sans-serif",e.fillText("ARUBA CARIBBEAN",256,124),e.fillStyle="#1a2744",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,248+i*64));let t=new le(l);return t.colorSpace=j,t}function ey(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,n,a,s),w(e,i,a,s),w(e,i,a,r),w(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var ty=new M(0,1,0),cp=new Z,up=new M,ny=new M(1,1,1),iy=new F;function fp(l,e){let t=new W,n=wn.halfW,i=wn.depth,s=-Ea,r=Ea,o=.12;t.quad([w(e,-n+.25,.12,pe),w(e,n-.25,.12,pe),w(e,n-.25,i-.2,pe),w(e,-n+.25,i-.2,pe)],[0,1,0],op);let a=1.65;for(let f=-n+.3;f<n-.35;f+=a)for(let p=.16;p<i-.28;p+=a){let m=Math.min(f+a-.06,n-.28),g=Math.min(p+a-.06,i-.22),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([w(e,f,p,pe+.03),w(e,m,p,pe+.03),w(e,m,g,pe+.03),w(e,f,g,pe+.03)],[0,1,0],b?K_:op)}t.quad([w(e,-.7,.3,pe+.045),w(e,.7,.3,pe+.045),w(e,.7,6.7,pe+.045),w(e,-.7,6.7,pe+.045)],[0,1,0],Tu),t.quad([w(e,-n+.3,.25,3.95),w(e,n-.3,.25,3.95),w(e,n-.3,i-.25,3.95),w(e,-n+.3,i-.25,3.95)],[0,-1,0],Mn),A(t,e,-n+.15,-n+.15+o,.2,i-.15,pe,3.9,Mn),A(t,e,n-.15-o,n-.15,.2,i-.15,pe,3.9,Mn),A(t,e,-n+.2,n-.2,i-.22,i-.1,pe,3.9,Mn),A(t,e,-n+.2,s,.1,.1+o,pe,er,Mn),A(t,e,r,n-.2,.1,.1+o,pe,er,Mn),A(t,e,s,r,.12,.12+o,3.72,er+.02,Tu),A(t,e,-2.7,2.7,7.2,8.95,pe,pe+1.05,Mn),A(t,e,-2.8,2.8,7.15,9,pe+1.05,pe+1.14,Tu),A(t,e,-2.65,2.65,7.15,7.28,pe+.15,pe+1.05,J_),A(t,e,-4.9,-4.05,3.5,4.3,pe,pe+.85,ap),A(t,e,3.95,4.8,3.5,4.3,pe,pe+.85,ap);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:ht:shell",l.add(c);let u=Q_();if(u){let f=new W;ey(f,e,9.55,-2.2,2.2,pe+1.25,pe+2.75);let p=new k(f.geometry(),new z({map:u,side:$}));p.name="aw:ht:board",l.add(p)}let h=[[-4.1,4.25],[4,4.25]],d=new q($_(),new z({vertexColors:!0}),h.length);d.name="aw:ht:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);up.set(g[0],pe,g[2]),cp.setFromAxisAngle(ty,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,iy.compose(up,cp,ny))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new M(0,1,0),16),l.add(d)}var Cu=-8000.03,Iu=-6711.14,yp=[[-8059.3,-6773.7],[-8057.7,-6751.8],[-8055.9,-6750.9],[-8047.3,-6751.1],[-8045.1,-6753],[-8041.2,-6750.6],[-8039.6,-6753.5],[-8036.2,-6751.3],[-8034.9,-6753.5],[-8031.2,-6750.9],[-8029.4,-6753.7],[-8025.7,-6752.1],[-8024,-6754.3],[-8020.4,-6752.2],[-8018.9,-6755],[-8015.4,-6752.9],[-8013.6,-6755],[-8010.4,-6753.3],[-8008.2,-6755.5],[-8005.4,-6753.4],[-8003.1,-6756.2],[-7999.5,-6754.2],[-7998,-6756.1],[-7994.9,-6754.7],[-7993.6,-6755.7],[-7991.4,-6759.5],[-7984.5,-6756.9],[-7979.5,-6693.7],[-7985.4,-6689.9],[-7988.5,-6694.1],[-7992.1,-6691.4],[-7993.7,-6693.8],[-7997.4,-6691],[-7999,-6693.2],[-8003,-6690.6],[-8004.4,-6692.7],[-8008,-6690],[-8009.5,-6692.3],[-8013.2,-6689.5],[-8014.9,-6691.9],[-8018.4,-6689.3],[-8020.2,-6691.5],[-8023.8,-6688.7],[-8025.4,-6691.2],[-8028.9,-6688.4],[-8031.4,-6691.8],[-8034.8,-6689.2],[-8035.5,-6690],[-8039.4,-6687.5],[-8040.3,-6688.6],[-8043.7,-6688.5],[-8044.2,-6690.4],[-8050.6,-6689.9],[-8050.7,-6688.4],[-8052.5,-6687.7],[-8050.6,-6666.4],[-8048.1,-6664.3],[-8042.2,-6664.8],[-8041.2,-6666.4],[-8037.5,-6667],[-8034.7,-6665.4],[-8032.6,-6667.5],[-8029.3,-6665.9],[-8027.2,-6667.9],[-8024,-6666.2],[-8021.8,-6668.4],[-8018.7,-6666.7],[-8016.6,-6669],[-8013.8,-6667.2],[-8011.5,-6669.5],[-8008.2,-6667.4],[-8006.5,-6669.5],[-8003,-6667.6],[-8001.4,-6670],[-7997.8,-6668.4],[-7995.8,-6670.5],[-7992.3,-6668.6],[-7990.3,-6671.1],[-7986.9,-6669.5],[-7984.9,-6671.9],[-7981.7,-6669.7],[-7980,-6672.1],[-7977.7,-6671.6],[-7976.9,-6671.1],[-7976.9,-6669.9],[-7975.6,-6669.5],[-7974.7,-6660.1],[-7982,-6659.5],[-7980.8,-6644.5],[-7941.1,-6647.9],[-7941.1,-6641.9],[-7929.2,-6643.2],[-7929.9,-6655.3],[-7918.2,-6656.1],[-7918.4,-6659.6],[-7933.9,-6668.8],[-7934.8,-6676.4],[-7925.7,-6684.9],[-7926.3,-6689.1],[-7916.4,-6698.3],[-7918.3,-6717.1],[-7940.6,-6733.6],[-7938.2,-6748.8],[-7947.6,-6766.3],[-7960.3,-6759.7],[-7970.2,-6758.9],[-7987,-6779.9],[-8044.5,-6774.2]],pp=.0337,mp=.9994,sy=[[-44.46,-63.06],[-59.27,-62.56],[-59.27+pp*14,-62.56+mp*14],[-44.46+pp*14,-63.06+mp*14]],An=Te(sy,0,1),Ca=2.9,Mp=4.15;An.doorAt=0;An.depth=10.4;An.halfW=6;var Sn=[.94,.9,.82],gp=[.82,.74,.62],Ra=[.48,.12,.16],ry=[.42,.26,.14],oy=[.28,.16,.08],xp=[.16,.38,.22],ay=[.96,.94,.9],me=.08,wp=[{a0:-3.2,a1:3.2,d0:7.15,d1:9.15},{a0:-5.15,a1:-3.55,d0:3.6,d1:5.15},{a0:3.45,a1:5.05,d0:3.6,d1:5.15}],bp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function ly(){let l=new W;return A(l,bp,-.28,.28,-.28,.28,.38,.46,Ra),A(l,bp,-.28,.28,-.28,-.16,.46,.86,Sn),l.geometry()}function cy(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f6f0e6",e.fillRect(0,0,512,512),e.fillStyle="#7a1e2e",e.fillRect(0,0,512,176),e.fillStyle="#fff8f2",e.font="700 54px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("MARRIOTT",256,58),e.font="600 30px Arial, sans-serif",e.fillText("STELLARIS CASINO",256,122),e.fillStyle="#3a241c",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,248+i*64));let t=new le(l);return t.colorSpace=j,t}function uy(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,n,a,s),w(e,i,a,s),w(e,i,a,r),w(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),o(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var hy=new M(0,1,0),vp=new Z,_p=new M,dy=new M(1,1,1),fy=new F;function Sp(l,e){let t=new W,n=An.halfW,i=An.depth,s=-Ca,r=Ca,o=.12;t.quad([w(e,-n+.25,.12,me),w(e,n-.25,.12,me),w(e,n-.25,i-.2,me),w(e,-n+.25,i-.2,me)],[0,1,0],gp);let a=1.7;for(let f=-n+.32;f<n-.36;f+=a)for(let p=.18;p<i-.3;p+=a){let m=Math.min(f+a-.06,n-.28),g=Math.min(p+a-.06,i-.22),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([w(e,f,p,me+.03),w(e,m,p,me+.03),w(e,m,g,me+.03),w(e,f,g,me+.03)],[0,1,0],b?Sn:gp)}t.quad([w(e,-.75,.3,me+.045),w(e,.75,.3,me+.045),w(e,.75,6.8,me+.045),w(e,-.75,6.8,me+.045)],[0,1,0],Ra),t.quad([w(e,-n+.28,.22,5.5),w(e,n-.28,.22,5.5),w(e,n-.28,i-.22,5.5),w(e,-n+.28,i-.22,5.5)],[0,-1,0],ay),A(t,e,-n+.15,-n+.15+o,.2,i-.15,me,5.45,Sn),A(t,e,n-.15-o,n-.15,.2,i-.15,me,5.45,Sn),A(t,e,-n+.2,n-.2,i-.22,i-.1,me,5.45,Sn),A(t,e,-n+.2,s,.1,.1+o,me,5.45,Sn),A(t,e,r,n-.2,.1,.1+o,me,5.45,Sn),A(t,e,s,r,.12,.12+o,3.85,4.05,Ra),A(t,e,s,r,.1,.1+o,4.05,5.45,Sn),A(t,e,-3.05,3.05,7.25,9,me,me+1.05,ry),A(t,e,-3.15,3.15,7.2,9.1,me+1.05,me+1.14,Ra),A(t,e,-2.95,2.95,7.15,7.32,me+.2,me+1.05,oy),A(t,e,-5.2,-4.3,3.5,4.35,me,me+.85,xp),A(t,e,4.2,5.1,3.5,4.35,me,me+.85,xp);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:mr:shell",l.add(c);let u=cy();if(u){let f=new W;uy(f,e,9.7,-2.5,2.5,me+1.25,me+2.8);let p=new k(f.geometry(),new z({map:u,side:$}));p.name="aw:mr:board",l.add(p)}let h=[[-4.35,4.35],[4.25,4.35]],d=new q(ly(),new z({vertexColors:!0}),h.length);d.name="aw:mr:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);_p.set(g[0],me,g[2]),vp.setFromAxisAngle(hy,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,fy.compose(_p,vp,dy))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new M(0,1,0),18),l.add(d)}var Pu=-8172.13,Lu=-5301.78,Ip=[[-8190.1,-5299.2],[-8165.7,-5290.6],[-8162.5,-5299.5],[-8165.9,-5300.6],[-8163.8,-5306.7],[-8184.8,-5314.1]],Ap=.9422,Tp=.3351,py=[[-17.97,2.58],[-12.67,-12.32],[-12.67+Ap*12,-12.32+Tp*12],[-17.97+Ap*12,2.58+Tp*12]],En=Te(py,0,1),Ia=2.05,tr=2.75;En.doorAt=0;En.depth=8.2;En.halfW=5.2;var Tn=[.95,.78,.12],my=[.86,.66,.08],ri=[.12,.52,.24];var gy=[.45,.28,.14],xy=[.96,.95,.9],Ee=.52,Pp=[{a0:-2.6,a1:2.6,d0:5.55,d1:7.35},{a0:-4.3,a1:-2.9,d0:2.7,d1:4.15},{a0:2.8,a1:4.2,d0:2.7,d1:4.15}],Ep={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function by(){let l=new W;return A(l,Ep,-.24,.24,-.24,.24,.4,.48,Tn),A(l,Ep,-.24,.24,-.24,-.14,.48,.86,ri),l.geometry()}function vy(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#fff6d8",e.fillRect(0,0,512,512),e.fillStyle="#1a8a3a",e.fillRect(0,0,512,168),e.fillStyle="#fffdf4",e.font="700 46px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("SE\xD1OR FROG'S",256,62),e.font="600 26px Arial, sans-serif",e.fillText("PALM BEACH",256,122),e.fillStyle="#1c3a18",e.font="600 32px Arial, sans-serif",["Margarita","Nachos","Fajitas"].forEach((n,i)=>e.fillText(n,256,246+i*68));let t=new le(l);return t.colorSpace=j,t}function _y(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,n,a,s),w(e,i,a,s),w(e,i,a,r),w(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var yy=new M(0,1,0),Rp=new Z,Cp=new M,My=new M(1,1,1),wy=new F;function Lp(l,e){let t=new W,n=En.halfW,i=En.depth,s=-Ia,r=Ia,o=.12;t.quad([w(e,-n+.2,.1,Ee),w(e,n-.2,.1,Ee),w(e,n-.2,i-.18,Ee),w(e,-n+.2,i-.18,Ee)],[0,1,0],my);let a=1.35;for(let f=-n+.28;f<n-.3;f+=a)for(let p=.16;p<i-.26;p+=a){let m=Math.min(f+a-.06,n-.24),g=Math.min(p+a-.06,i-.2),b=(Math.round(f/a)+Math.round(p/a)&1)===0;t.quad([w(e,f,p,Ee+.03),w(e,m,p,Ee+.03),w(e,m,g,Ee+.03),w(e,f,g,Ee+.03)],[0,1,0],b?Tn:ri)}t.quad([w(e,-n+.22,.18,2.7),w(e,n-.22,.18,2.7),w(e,n-.22,i-.18,2.7),w(e,-n+.22,i-.18,2.7)],[0,-1,0],xy),A(t,e,-n+.12,-n+.12+o,.16,i-.12,Ee,2.68,Tn),A(t,e,n-.12-o,n-.12,.16,i-.12,Ee,2.68,Tn),A(t,e,-n+.16,n-.16,i-.2,i-.08,Ee,2.68,Tn),A(t,e,-n+.16,s,.08,.08+o,Ee,tr,Tn),A(t,e,r,n-.16,.08,.08+o,Ee,tr,Tn),A(t,e,s,r,.1,.1+o,2.42,tr,ri),A(t,e,-n+.12,-n+.12+o,.16,i-.12,2.2,2.42,ri),A(t,e,n-.12-o,n-.12,.16,i-.12,2.2,2.42,ri),A(t,e,-n+.16,n-.16,i-.2,i-.08,2.2,2.42,ri),A(t,e,-2.4,2.4,5.7,7.2,Ee,Ee+1.05,gy),A(t,e,-2.5,2.5,5.6,7.3,Ee+1.05,Ee+1.14,ri),A(t,e,-2.3,2.3,5.55,5.75,Ee+.15,Ee+1.05,Tn);let c=new k(t.geometry(),new z({vertexColors:!0,side:$}));c.name="aw:sf:shell",l.add(c);let u=vy();if(u){let f=new W;_y(f,e,7.55,-2.1,2.1,Ee+1.05,Ee+2.15);let p=new k(f.geometry(),new z({map:u,side:$}));p.name="aw:sf:board",l.add(p)}let h=[[-3.6,3.4],[3.5,3.4]],d=new q(by(),new z({vertexColors:!0}),h.length);d.name="aw:sf:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);Cp.set(g[0],Ee,g[2]),Rp.setFromAxisAngle(yy,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,wy.compose(Cp,Rp,My))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new X(new M(0,1,0),14),l.add(d)}var Du=-8122.03,Nu=-6342.63,kp=[[-8137.2,-6343.4],[-8137.2,-6339.1],[-8135.8,-6335.8],[-8131.3,-6332.8],[-8131.4,-6329],[-8113.5,-6325.6],[-8108.5,-6346.4],[-8104,-6348.9],[-8105.7,-6351.9],[-8113.1,-6348],[-8113.1,-6346],[-8116.1,-6346.4],[-8119.4,-6343.1],[-8122.1,-6344.5],[-8125,-6347.8],[-8128.8,-6349.1],[-8132.3,-6348.7],[-8135.4,-6346.4]],Dp=-.9722,Np=-.2343,Sy=[[13.53,-3.77],[8.52,17.02],[8.52+Dp*12,17.02+Np*12],[13.53+Dp*12,-3.77+Np*12]],tn=Te(Sy,0,1),La=1.45,nr=1.65;tn.doorAt=8;tn.depth=7.2;tn.halfW=9.5;var Pa=[.05,.42,.48];var Op=[.9,.82,.66],Rn=[.96,.95,.92],Ay=[.45,.28,.14],Re=.06,zp=[{a0:6.5,a1:9.4,d0:5.1,d1:6.65},{a0:6.2,a1:7.2,d0:2.4,d1:3.7},{a0:8.8,a1:9.6,d0:2.4,d1:3.7}],Fp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Ty(){let l=new W;return A(l,Fp,-.24,.24,-.24,.24,.4,.48,Rn),A(l,Fp,-.24,.24,-.24,-.14,.48,.86,Pa),l.geometry()}function Ey(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4efe4",e.fillRect(0,0,512,512),e.fillStyle="#0d6b7a",e.fillRect(0,0,512,176),e.fillStyle="#f7fffe",e.font="700 48px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("MOOMBA BEACH",256,68),e.font="600 26px Arial, sans-serif",e.fillText("PALM BEACH",256,128),e.fillStyle="#16343a",e.font="600 32px Arial, sans-serif",["Burger","Fish","Cocktail"].forEach((n,i)=>e.fillText(n,256,250+i*68));let t=new le(l);return t.colorSpace=j,t}function Ry(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,n,a,s),w(e,i,a,s),w(e,i,a,r),w(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var Cy=new M(0,1,0),Up=new Z,Bp=new M,Iy=new M(1,1,1),Py=new F;function Gp(l,e){let t=new W,n=tn.halfW,i=tn.depth,s=tn.doorAt??0,r=s-La,o=s+La,a=.12;t.quad([w(e,-n+.2,.1,Re),w(e,n-.2,.1,Re),w(e,n-.2,i-.18,Re),w(e,-n+.2,i-.18,Re)],[0,1,0],Op);let c=1.3;for(let p=-n+.28;p<n-.3;p+=c)for(let m=.16;m<i-.26;m+=c){let g=Math.min(p+c-.06,n-.24),b=Math.min(m+c-.06,i-.2),v=(Math.round(p/c)+Math.round(m/c)&1)===0;t.quad([w(e,p,m,Re+.03),w(e,g,m,Re+.03),w(e,g,b,Re+.03),w(e,p,b,Re+.03)],[0,1,0],v?Op:Pa)}t.quad([w(e,-n+.22,.18,1.58),w(e,n-.22,.18,1.58),w(e,n-.22,i-.18,1.58),w(e,-n+.22,i-.18,1.58)],[0,-1,0],Rn),A(t,e,-n+.12,-n+.12+a,.16,i-.12,Re,1.55,Rn),A(t,e,n-.12-a,n-.12,.16,i-.12,Re,1.55,Rn),A(t,e,-n+.16,n-.16,i-.2,i-.08,Re,1.55,Rn),A(t,e,-n+.16,r,.08,.08+a,Re,nr,Rn),A(t,e,o,n-.16,.08,.08+a,Re,nr,Rn),A(t,e,r,o,.1,.1+a,1.38,nr,Pa),A(t,e,6.6,9.3,5.25,6.5,Re,Re+1.02,Ay),A(t,e,6.5,9.4,5.15,6.6,Re+1.02,Re+1.12,Pa),A(t,e,6.7,9.2,5.1,5.3,Re+.15,Re+1.02,Rn);let u=new k(t.geometry(),new z({vertexColors:!0,side:$}));u.name="aw:mb:shell",l.add(u);let h=Ey();if(h){let p=new W;Ry(p,e,6.75,6.7,9.3,Re+.55,Re+1.42);let m=new k(p.geometry(),new z({map:h,side:$}));m.name="aw:mb:board",l.add(m)}let d=[[6.6,3],[9.2,3]],f=new q(Ty(),new z({vertexColors:!0}),d.length);f.name="aw:mb:chairs",f.frustumCulled=!1,d.forEach(([p,m],g)=>{let b=w(e,p,m,0);Bp.set(b[0],Re,b[2]),Up.setFromAxisAngle(Cy,Math.atan2(e.nx,e.nz)),f.setMatrixAt(g,Py.compose(Bp,Up,Iy))}),f.count=d.length,f.instanceMatrix.needsUpdate=!0,f.boundingSphere=new X(new M(0,1,0),16),l.add(f)}var Fu=-8168.34,Uu=-5382.19,Kp=[[-8174.15,-5373.8],[-8168.57,-5372.03],[-8162.67,-5390.63],[-8168.25,-5392.4]],Hp=.953,Vp=.303,Ly=[[-5.81,8.39],[.09,-10.21],[.09+Hp*10,-10.21+Vp*10],[-5.81+Hp*10,8.39+Vp*10]],Cn=Te(Ly,0,1),jp=2.4,Jp=2.7;Cn.doorAt=0;Cn.depth=7.2;Cn.halfW=6.2;var Wp=[.12,.42,.22],Dy=[.08,.28,.14],Ou=[.95,.94,.9],$p=[.7,.12,.14],Xp=[.42,.26,.12],Pe=.12,Qp=[{a0:-1.5,a1:1.5,d0:5.3,d1:6.7},{a0:-4.2,a1:-2.6,d0:2.4,d1:3.8},{a0:2.4,a1:4,d0:2.4,d1:3.8},{a0:-1.1,a1:1.1,d0:3.3,d1:4.5}],qp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Ny(){let l=new W;return A(l,qp,-.22,.22,-.22,.22,.4,.46,$p),A(l,qp,-.22,.22,-.22,-.14,.46,.82,Ou),l.geometry()}function Oy(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f7f3ea",e.fillRect(0,0,512,512),e.fillStyle="#1c6b38",e.fillRect(0,0,512,168),e.fillStyle="#fffdf6",e.font="700 52px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("GIANNI'S",256,62),e.font="600 26px Arial, sans-serif",e.fillText("RISTORANTE",256,122),e.fillStyle="#7a1c22",e.fillRect(0,168,512,10),e.fillStyle="#1c3a18",e.font="600 32px Arial, sans-serif",["Pasta","Pizza","Tiramisu"].forEach((n,i)=>e.fillText(n,256,250+i*68));let t=new le(l);return t.colorSpace=j,t}function Fy(l,e,t,n,i,s,r){let o=(a,c,u)=>{l.quad([w(e,n,a,s),w(e,i,a,s),w(e,i,a,r),w(e,n,a,r)],c,[1,1,1],u)};o(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),o(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var Uy=new M(0,1,0),Yp=new Z,Zp=new M,By=new M(1,1,1),ky=new F;function em(l,e){let t=new W,n=Cn.halfW,i=Cn.depth;t.quad([w(e,-n+.3,.15,Pe),w(e,n-.3,.15,Pe),w(e,n-.3,i-.2,Pe),w(e,-n+.3,i-.2,Pe)],[0,1,0],Dy);let s=1.35;for(let h=-n+.4;h<n-.35;h+=s)for(let d=.25;d<i-.3;d+=s){let f=Math.min(h+s-.08,n-.32),p=Math.min(d+s-.08,i-.22),m=(Math.round(h/s)+Math.round(d/s)&1)===0;t.quad([w(e,h,d,Pe+.02),w(e,f,d,Pe+.02),w(e,f,p,Pe+.02),w(e,h,p,Pe+.02)],[0,1,0],m?Ou:Wp)}let r=[[-3.4,3.1],[3.2,3.1],[0,3.9]];for(let[h,d]of r)A(t,e,h-.55,h+.55,d-.4,d+.4,Pe,Pe+.74,Xp),A(t,e,h-.62,h+.62,d-.46,d+.46,Pe+.74,Pe+.82,Ou);A(t,e,-1.4,1.4,5.4,6.55,Pe,Pe+1.05,Xp),A(t,e,-1.5,1.5,5.3,6.65,Pe+1.05,Pe+1.14,Wp),A(t,e,-1.35,1.35,5.25,5.45,Pe+.2,Pe+1.05,$p);let o=new k(t.geometry(),new z({vertexColors:!0,side:$}));o.name="aw:gn:shell",l.add(o);let a=Oy();if(a){let h=new W;Fy(h,e,6.8,-1.3,1.3,Pe+1.15,Pe+2.35);let d=new k(h.geometry(),new z({map:a,side:$}));d.name="aw:gn:board",l.add(d)}let c=[[-4.2,3.1],[-2.6,3.1],[2.4,3.1],[4,3.1],[-.9,3.2],[.9,3.2]],u=new q(Ny(),new z({vertexColors:!0}),c.length);u.name="aw:gn:chairs",u.frustumCulled=!1,c.forEach(([h,d],f)=>{let p=w(e,h,d,0);Zp.set(p[0],Pe,p[2]),Yp.setFromAxisAngle(Uy,Math.atan2(e.nx,e.nz)+(f%2?Math.PI:0)),u.setMatrixAt(f,ky.compose(Zp,Yp,By))}),u.count=c.length,u.instanceMatrix.needsUpdate=!0,u.boundingSphere=new X(new M(0,1,0),16),l.add(u)}function zy(){let l=st(Wi,jc,Jc,0);l.poly=df;let e=l.doorAt??0;return{id:"pastechihouse",x:jc,z:Jc,rot:0,local:Wi,world:l,doorHalf:2.35,doorTop:2.32,doorSide:.55,wall:.34,obs:ff,cut:["ground","lwall"],show:72,hide:96,build:gf,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Gy(){let l=st(ti,nu,iu,0);l.poly=vf;let e=l.doorAt??0;return{id:"mcd1",x:nu,z:iu,rot:0,local:ti,world:l,doorHalf:ha,doorTop:_f,doorSide:.55,wall:.34,obs:wf,cut:["ground","lwall"],show:90,hide:120,build:Af,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Hy(){let l=st(ni,au,lu,0);l.poly=Tf;let e=l.doorAt??0;return{id:"starbucks2",x:au,z:lu,rot:0,local:ni,world:l,doorHalf:pa,doorTop:ma,doorSide:.55,wall:.34,obs:Rf,cut:["ground","lwall"],show:90,hide:120,build:If,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Vy(){let l=st(Ks,uu,hu,0);l.poly=Of;let e=l.doorAt??0;return{id:"pbplaza",x:uu,z:hu,rot:0,local:Ks,world:l,doorHalf:ba,doorTop:va,doorSide:1.25,wall:.4,obs:Ff,cut:["glass","rot","ground","lwall"],show:110,hide:140,build:Uf,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Wy(){let l=st(ii,fu,pu,0);l.poly=kf;let e=l.doorAt??0;return{id:"hardrock_pb",x:fu,z:pu,rot:0,local:ii,world:l,doorHalf:wa,doorTop:Sa,doorSide:.55,wall:.34,obs:zf,cut:["ground","lwall"],show:80,hide:110,build:Gf,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Xy(){let l=st(_n,yu,Mu,0);l.poly=Wf;let e=l.doorAt??0;return{id:"radisson",x:yu,z:Mu,rot:0,local:_n,world:l,doorHalf:Aa,doorTop:Js,doorSide:.55,wall:.34,obs:qf,cut:["ground","lwall"],show:100,hide:130,build:Yf,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function qy(){let l=st(yn,Su,Au,0);l.poly=tp;let e=l.doorAt??0;return{id:"hyatt",x:Su,z:Au,rot:0,local:yn,world:l,doorHalf:Ta,doorTop:Qs,doorSide:.55,wall:.34,obs:np,cut:["ground","lwall"],show:110,hide:140,build:ip,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Yy(){let l=st(wn,Eu,Ru,0);l.poly=hp;let e=l.doorAt??0;return{id:"hilton",x:Eu,z:Ru,rot:0,local:wn,world:l,doorHalf:Ea,doorTop:er,doorSide:.55,wall:.34,obs:dp,cut:["ground","lwall"],show:120,hide:155,build:fp,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Zy(){let l=st(An,Cu,Iu,0);l.poly=yp;let e=l.doorAt??0;return{id:"marriott",x:Cu,z:Iu,rot:0,local:An,world:l,doorHalf:Ca,doorTop:Mp,doorSide:.55,wall:.34,obs:wp,cut:[],show:150,hide:185,floorAt:{x:-8051.89,z:-6773.95},build:Sp,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Ky(){let l=st(En,Pu,Lu,0);l.poly=Ip;let e=l.doorAt??0;return{id:"senorfrogs",x:Pu,z:Lu,rot:0,local:En,world:l,doorHalf:Ia,doorTop:tr,doorSide:.55,wall:.34,obs:Pp,cut:["ground","lwall"],show:60,hide:85,build:Lp,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function jy(){let l=st(tn,Du,Nu,0);l.poly=kp;let e=l.doorAt??0;return{id:"moomba",x:Du,z:Nu,rot:0,local:tn,world:l,doorHalf:La,doorTop:nr,doorSide:.55,wall:.34,obs:zp,cut:["ground","lwall"],show:70,hide:95,floorAt:{x:-8112.88,z:-6328.23},build:Gp,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Jy(){let l=st(Cn,Fu,Uu,0);l.poly=Kp;let e=l.doorAt??0;return{id:"giannis",x:Fu,z:Uu,rot:0,local:Cn,world:l,doorHalf:jp,doorTop:Jp,doorSide:.55,wall:.34,obs:Qp,cut:[],show:80,hide:110,floorAt:{x:-8171.2,z:-5383.1},build:em,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}var $y=`
  if (awDoorOn > 0.5) {
    float awAlong = dot(vAwW.xz - awDoorM, awDoorU);
    float awSide = dot(vAwW.xz - awDoorM, awDoorN);
    if (abs(awSide) < awDoorSide && abs(awAlong) < awDoorHalf && vAwW.y > awDoorY - 0.15 && vAwW.y < awDoorY + awDoorTop) discard;
  }`,Da=class{constructor(e){x(this,"g",e);x(this,"places");x(this,"rebake",new Map);this.places=[zy(),Gy(),Hy(),Vy(),Wy(),Xy(),qy(),Yy(),Zy(),Ky(),jy(),Jy()];let t=window;t.__awDoor=(n,i)=>this.open(n,i)}open(e,t){let n=this.places;for(let i=0;i<n.length;i++){let s=n[i];if(af(s.world,s.obs,e,t,s.doorHalf,s.wall))return!0}return!1}stats(){return this.places.map(e=>({id:e.id,built:!!e.group,visible:!!e.group?.visible,patched:e.patched,door:e.doorOn.value,y:+e.floorY.toFixed(2)}))}update(){if(this.rebake.size)for(let[i,s]of this.rebake)i.needsUpdate=!0,s<=1?this.rebake.delete(i):this.rebake.set(i,s-1);let e=this.g.S,t=e.mode==="walk"?e.walk:e.mode==="plane"?e.plane:e.car,n=this.places;for(let i=0;i<n.length;i++){let s=n[i],r=Math.hypot(t.x-s.x,t.z-s.z);if(!s.group)r<s.show+20&&this.ensure(s);else{let o=s.group.visible?r<s.hide:r<s.show;s.group.visible!==o&&(s.group.visible=o);let a=o?1:0;s.doorOn.value!==a&&(s.doorOn.value=a),!s.patched&&r<s.show+40&&this.patchHero(s),this.settleFloor(s)}}}settleFloor(e){if(!e.group)return;let t=e.floorAt?.x??e.x,n=e.floorAt?.z??e.z,i=this.g.real.heightAt?.(t,n);!Number.isFinite(i)||Math.abs(i-e.floorY)<.35||(e.group.position.y=i,e.group.updateMatrixWorld(!0),e.floorY=i,e.uY.value=i)}ensure(e){let t=e.floorAt?.x??e.x,n=e.floorAt?.z??e.z,i=this.g.real.heightAt?.(t,n);if(!Number.isFinite(i))return;let s=new _e;s.name="aw:interior:"+e.id,s.position.set(e.x,i,e.z),s.rotation.y=e.rot,e.build(s,e.local),s.traverse(r=>{let o=r;o.isMesh&&(o.castShadow=!1,o.receiveShadow=!1,o.matrixAutoUpdate=!1,o.updateMatrix())}),s.updateMatrixWorld(!0),this.g.scene.add(s),e.group=s,e.floorY=i,e.uY.value=i,e.group.visible=!0,e.doorOn.value=1,this.patchHero(e)}patchHero(e){let n=this.g.real.hero?.list?.find(d=>d.k===e.id||d.id===e.id);if(!n?._g)return;let i=e.doorOn,s=e.uU,r=e.uN,o=e.uM,a=e.uY,c={value:e.doorHalf},u={value:e.doorTop},h={value:e.doorSide};n._g.traverse(d=>{let f=d;if(!f.isMesh||!f.material)return;let p=Array.isArray(f.material)?f.material:[f.material];for(let m of p)this.patchMat(m,e.cut,i,s,r,o,a,c,u,h)}),e.patched=!0}patchMat(e,t,n,i,s,r,o,a,c,u){let h=e.name||"";t.indexOf(h)<0||(this.rebake.set(e,4),e.needsUpdate=!0,fn(e,"door-"+h,d=>{d.vertexShader.includes("#include <begin_vertex>")&&d.fragmentShader.includes("#include <clipping_planes_fragment>")&&(d.uniforms.awDoorOn=n,d.uniforms.awDoorU=i,d.uniforms.awDoorN=s,d.uniforms.awDoorM=r,d.uniforms.awDoorY=o,d.uniforms.awDoorHalf=a,d.uniforms.awDoorTop=c,d.uniforms.awDoorSide=u,d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
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
`+$y))}))}};var tm=H.get("addons")!=="0"&&H.get("gvmoto")!=="0"&&H.get("gv")!=="0";window.__awMotoEnabled=tm;async function Qy(){if(H.get("addons")==="0")return;H.get("hud")!=="0"&&ef();let l=await Gu(),e=H.get("perf")!=="0"?new Lo(l):null,t=H.get("look")!=="0"?new Do(l):null,n=H.get("sea")!=="0"?new ra(l):null,i=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,s=H.get("flora")!=="0"?new No(l,e?e.mobile:i,H.get("ipool")!=="0"):null,r=H.get("jobs")!=="0"?new Oo(l,(e?e.mobile:i)?5:8):null,o=new Uo(l,e?e.mobile:i),a=H.get("far")!=="0"?new Fo(l,l.real.q.name!=="low",H.get("farbatch")!=="0"):null,c=H.get("split")!=="0"?new Vo((e?e.mobile:i)?3:4):null,u=H.get("hiperf")!=="0"?new Wo(l):null,h=H.get("hilook")==="1"?new Xo(l):null,d=H.get("life")!=="0",f=d&&H.get("peds")!=="0"?new To(l):null,p=!f&&H.get("kids")!=="0"?new Ho(l,e?e.mobile:i):null,m=H.get("debug")==="1"?new Bo(l):null,g=new ir,b=H.get("daynight")!=="0",v=b?new co(l,H.get("sun")!=="0"):null,y=b?new uo(l):null,_=b?new wo(l):null,S=d&&H.get("traffic")!=="0"?new Ao(l):null,E=H.get("audio")!=="0"?new Io(l):null,C=H.get("radio")!=="0"&&H.get("audio")!=="0"?new sa(l):null,T=H.get("emerg")!=="0"?new Ko(l):null,R=H.get("crash")!=="0"?new jo(l,T):null,P=tm?new Jo(l):null,I=H.get("fly")!=="0"?new Qo(l):null,D=H.get("turbo")!=="0"?new $o(l):null,N=H.get("wind")!=="0"?new ta(l):null,O=H.get("camcycle")!=="0"?new ia:null,U=H.get("minimap")!=="0"?new oa(l):null,V=H.get("interiors")!=="0"?new Da(l):null;{let ge=()=>{let J=document.querySelector("#credits ul");if(!J)return!1;if(!J.querySelector(".aw-msb")){let Me=document.createElement("li");Me.className="aw-msb",Me.innerHTML='Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)',J.appendChild(Me)}if(!J.querySelector(".aw-mly")){let Me=document.createElement("li");Me.className="aw-mly",Me.innerHTML='Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>',J.appendChild(Me)}return!0};if(!ge()){let J=0,Me=setInterval(()=>{(ge()||++J>30)&&clearInterval(Me)},1e3)}}let K=new fo(l),Y=H.get("mperf")!=="0"?new mo(l,e?e.mobile:i,H.get("warmup")!=="full",H.get("preup")==="1"):null,ee=H.get("ovmerge")!=="0"&&l.real?new _o(l.real):null,Q=H.get("tmerge")!=="0"&&l.real?new yo(l.real):null,ne=H.get("bbatch")!=="0"&&H.get("bmerge")!=="0"?new vo(l,(e?e.mobile:i)?2:3,+(H.get("bbshell")||1/0)):null,fe=!ne&&H.get("bmerge")!=="0"?new bo(l):null,ye=H.get("preload")!=="0"?new po(l):null,de=H.get("mwfreeze")!=="0"?new xo(l):null,Ue=Rd(g,K);window.__aw={clock:g,dn:v,lights:y,lamps:_,traffic:S,peds:f,audio:E,guard:K,perf:e,look:t,flora:s,jobs:r,far:a,ctxg:o,kids:p,split:c,hip:u,hil:h,emerg:T,crash:R,gv:P,fly:I,turbo:D,bmerge:fe,mperf:Y,ovm:ee,tmerge:Q,sea:n,minimap:U,bbatch:ne,mwf:de,interiors:V,version:"0.24.0"};let he=performance.now(),Le=ge=>{let J=Math.max(0,Math.min(2,(ge-he)/1e3));he=ge,$n.value+=J,g.step(Math.min(J,.1)),v&&v.apply(g.t),y&&y.update(J),_&&_.update(J),S&&S.update(J),f&&f.update(Math.min(J,.1),$n.value),E&&E.update(),C&&C.update(),T&&T.update(Math.min(J,.1)),R&&R.update(Math.min(J,.1)),P&&P.update(Math.min(J,.1)),I&&I.update(Math.min(J,.1)),D&&D.update(Math.min(J,.1)),N&&N.update(Math.min(J,.1)),O&&O.frame(l.S.mode,Math.min(J,.1)),e&&e.update(J),t&&t.update(Oe.value),r&&r.frame(),u&&u.frame(),a&&a.update(J),p&&p.update(Math.min(J,.1)),m&&m.frame(J*1e3),K.frame(J),ye&&ye.frame(J),Y&&Y.frame(J),fe&&fe.frame(),ne&&ne.frame(),de&&de.frame(Math.min(J,.1)),V&&V.update(),Ue(),requestAnimationFrame(Le)};requestAnimationFrame(Le),console.info("[aw-addons] day/night + night lights + fps guard active",l.real?.q?.name)}Qy().catch(l=>console.error("[aw-addons] failed",l));
