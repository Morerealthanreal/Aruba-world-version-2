var zp=Object.defineProperty;var Gp=(l,e,t)=>e in l?zp(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var x=(l,e,t)=>Gp(l,typeof e!="symbol"?e+"":e,t);function Fu(){return new Promise(l=>{let e=()=>{let t=window.game;t&&t.ready&&t.real&&t.real.sky&&t.real.sky.sun?l(t):setTimeout(e,250)};e()})}var H=new URLSearchParams(location.search);var Uu="aw_clock";function Hp(){let l={t:.4166666666666667,frozen:!1,len:24};try{let n=JSON.parse(localStorage.getItem(Uu)||"null");n&&isFinite(n.t)&&(l={t:n.t,frozen:!!n.frozen,len:isFinite(n.len)&&n.len>0?n.len:24})}catch{}let e=H.get("t");e!==null&&isFinite(+e)&&(l.t=(+e%24+24)%24/24);let t=H.get("daylen");return t!==null&&+t>0&&(l.len=+t),H.get("freeze")==="1"&&(l.frozen=!0),l}var tr=class{constructor(){x(this,"t");x(this,"frozen");x(this,"len");x(this,"lastSave",0);x(this,"listeners",[]);let e=Hp();this.t=e.t,this.frozen=e.frozen,this.len=e.len}step(e){this.frozen||(this.t=(this.t+e/(this.len*60))%1),performance.now()-this.lastSave>5e3&&this.save()}setHour(e){this.t=(e%24+24)%24/24,this.save(),this.listeners.forEach(t=>t())}setFrozen(e){this.frozen=e,this.save(),this.listeners.forEach(t=>t())}onChange(e){this.listeners.push(e)}save(){this.lastSave=performance.now();try{localStorage.setItem(Uu,JSON.stringify({t:+this.t.toFixed(5),frozen:this.frozen,len:this.len}))}catch{}}};var Rh=1;var Ch=3,Rs=0,ea=1,Q=2,Al=0,Ih=1,Yn=2;var Tl=5;var Ph=100;var El=201;var Lh=204,ta=205;var rl=0,al=1,ol=2,Ur=3,ll=4,cl=5,ul=6,hl=7,na=0,Dh=1,Nh=2;var Rl=1,Cl=2,Il=3,Pl=4,Ll=5,Dl=6,Nl=7,dl="attached",Oh="detached",Ol=300,Fh=301,Fl=302;var Uh=306,Ht=1e3,Nn=1001,ls=1002,Mi=1003,Ul=1004;var Bl=1005;var $t=1006,kl=1007;var Zn=1008;var Kn=1009;var Bh=1014,wi=1015;var Vt=1023;var kh=1028,zh=1029;var Gh=2200,Hh=2201,Vh=2202,Un=2300,Bn=2301,Dr=2302,fl=2303,On=2400,Fn=2401,cs=2402,ia=2500,Wh=2501,zl=0,Cs=1,Di=2;var Gl=0;var Hl="",J="srgb",nt="srgb-linear",pl="linear",Nr="srgb";var Or=7680;var Xh=519;var Vl=35044,ot=35048;var zt=2e3,us=2001;function Vp(l){for(let e=l.length-1;e>=0;--e)if(l[e]>=65535)return!0;return!1}function Wp(l){return ArrayBuffer.isView(l)&&!(l instanceof DataView)}function Br(l){return document.createElementNS("http://www.w3.org/1999/xhtml",l)}var Bu={},Si=null;function ml(...l){let e="THREE."+l.shift();Si?Si("log",e,...l):console.log(e,...l)}function qh(l){let e=l[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=l[1];t&&t.isStackTrace?l[0]+=" "+t.getLocation():l[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return l}function be(...l){l=qh(l);let e="THREE."+l.shift();if(Si)Si("warn",e,...l);else{let t=l[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...l)}}function Se(...l){l=qh(l);let e="THREE."+l.shift();if(Si)Si("error",e,...l);else{let t=l[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...l)}}function _i(...l){let e=l.join(" ");e in Bu||(Bu[e]=!0,be(...l))}var Xp={[rl]:al,[ol]:ul,[ll]:hl,[Ur]:cl,[al]:rl,[ul]:ol,[hl]:ll,[cl]:Ur},Wt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}},ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ku=1234567,as=Math.PI/180,Ai=180/Math.PI;function gt(){let l=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ze[l&255]+ze[l>>8&255]+ze[l>>16&255]+ze[l>>24&255]+"-"+ze[e&255]+ze[e>>8&255]+"-"+ze[e>>16&15|64]+ze[e>>24&255]+"-"+ze[t&63|128]+ze[t>>8&255]+"-"+ze[t>>16&255]+ze[t>>24&255]+ze[n&255]+ze[n>>8&255]+ze[n>>16&255]+ze[n>>24&255]).toLowerCase()}function se(l,e,t){return Math.max(e,Math.min(t,l))}function Wl(l,e){return(l%e+e)%e}function qp(l,e,t,n,i){return n+(l-e)*(i-n)/(t-e)}function Yp(l,e,t){return l!==e?(t-l)/(e-l):0}function os(l,e,t){return(1-t)*l+t*e}function Zp(l,e,t,n){return os(l,e,1-Math.exp(-t*n))}function Kp(l,e=1){return e-Math.abs(Wl(l,e*2)-e)}function jp(l,e,t){return l<=e?0:l>=t?1:(l=(l-e)/(t-e),l*l*(3-2*l))}function Jp(l,e,t){return l<=e?0:l>=t?1:(l=(l-e)/(t-e),l*l*l*(l*(l*6-15)+10))}function $p(l,e){return l+Math.floor(Math.random()*(e-l+1))}function Qp(l,e){return l+Math.random()*(e-l)}function em(l){return l*(.5-Math.random())}function tm(l){l!==void 0&&(ku=l);let e=ku+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function nm(l){return l*as}function im(l){return l*Ai}function sm(l){return l>0&&Number.isInteger(l)&&2**Math.round(Math.log2(l))===l}function rm(l){return Math.pow(2,Math.ceil(Math.log(l)/Math.LN2))}function am(l){return Math.pow(2,Math.floor(Math.log(l)/Math.LN2))}function om(l,e,t,n,i){let s=Math.cos,r=Math.sin,a=s(t/2),o=r(t/2),c=s((e+n)/2),u=r((e+n)/2),h=s((e-n)/2),d=r((e-n)/2),f=s((n-e)/2),p=r((n-e)/2);switch(i){case"XYX":l.set(a*u,o*h,o*d,a*c);break;case"YZY":l.set(o*d,a*u,o*h,a*c);break;case"ZXZ":l.set(o*h,o*d,a*u,a*c);break;case"XZX":l.set(a*u,o*p,o*f,a*c);break;case"YXY":l.set(o*f,a*u,o*p,a*c);break;case"ZYZ":l.set(o*p,o*f,a*u,a*c);break;default:be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function mt(l,e){switch(e.constructor){case Float32Array:return l;case Uint32Array:return l/4294967295;case Uint16Array:return l/65535;case Uint8Array:case Uint8ClampedArray:return l/255;case Int32Array:return Math.max(l/2147483647,-1);case Int16Array:return Math.max(l/32767,-1);case Int8Array:return Math.max(l/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function xe(l,e){switch(e.constructor){case Float32Array:return l;case Uint32Array:return Math.round(l*4294967295);case Uint16Array:return Math.round(l*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(l*255);case Int32Array:return Math.round(l*2147483647);case Int16Array:return Math.round(l*32767);case Int8Array:return Math.round(l*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Xl={DEG2RAD:as,RAD2DEG:Ai,generateUUID:gt,clamp:se,euclideanModulo:Wl,mapLinear:qp,inverseLerp:Yp,lerp:os,damp:Zp,pingpong:Kp,smoothstep:jp,smootherstep:Jp,randInt:$p,randFloat:Qp,randFloatSpread:em,seededRandom:tm,degToRad:nm,radToDeg:im,isPowerOfTwo:sm,ceilPowerOfTwo:rm,floorPowerOfTwo:am,setQuaternionFromProperEuler:om,normalize:xe,denormalize:mt},Kl=class Kl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=se(this.x,e.x,t.x),this.y=se(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=se(this.x,e,t),this.y=se(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(se(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Kl.prototype.isVector2=!0;var B=Kl,K=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,a){let o=n[i+0],c=n[i+1],u=n[i+2],h=n[i+3],d=s[r+0],f=s[r+1],p=s[r+2],m=s[r+3];if(h!==m||o!==d||c!==f||u!==p){let g=o*d+c*f+u*p+h*m;g<0&&(d=-d,f=-f,p=-p,m=-m,g=-g);let b=1-a;if(g<.9995){let v=Math.acos(g),y=Math.sin(v);b=Math.sin(b*v)/y,a=Math.sin(a*v)/y,o=o*b+d*a,c=c*b+f*a,u=u*b+p*a,h=h*b+m*a}else{o=o*b+d*a,c=c*b+f*a,u=u*b+p*a,h=h*b+m*a;let v=1/Math.sqrt(o*o+c*c+u*u+h*h);o*=v,c*=v,u*=v,h*=v}}e[t]=o,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,r){let a=n[i],o=n[i+1],c=n[i+2],u=n[i+3],h=s[r],d=s[r+1],f=s[r+2],p=s[r+3];return e[t]=a*p+u*h+o*f-c*d,e[t+1]=o*p+u*d+c*h-a*f,e[t+2]=c*p+u*f+a*d-o*h,e[t+3]=u*p-a*h-o*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,s=e._z,r=e._order,a=Math.cos,o=Math.sin,c=a(n/2),u=a(i/2),h=a(s/2),d=o(n/2),f=o(i/2),p=o(s/2);switch(r){case"XYZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"YXZ":this._x=d*u*h+c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"ZXY":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h-d*f*p;break;case"ZYX":this._x=d*u*h-c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h+d*f*p;break;case"YZX":this._x=d*u*h+c*f*p,this._y=c*f*h+d*u*p,this._z=c*u*p-d*f*h,this._w=c*u*h-d*f*p;break;case"XZY":this._x=d*u*h-c*f*p,this._y=c*f*h-d*u*p,this._z=c*u*p+d*f*h,this._w=c*u*h+d*f*p;break;default:be("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],c=t[2],u=t[6],h=t[10],d=n+a+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-o)*f,this._y=(s-c)*f,this._z=(r-i)*f}else if(n>a&&n>h){let f=2*Math.sqrt(1+n-a-h);this._w=(u-o)/f,this._x=.25*f,this._y=(i+r)/f,this._z=(s+c)/f}else if(a>h){let f=2*Math.sqrt(1+a-n-h);this._w=(s-c)/f,this._x=(i+r)/f,this._y=.25*f,this._z=(o+u)/f}else{let f=2*Math.sqrt(1+h-n-a);this._w=(r-i)/f,this._x=(s+c)/f,this._y=(o+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(se(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,a=t._x,o=t._y,c=t._z,u=t._w;return this._x=n*u+r*a+i*c-s*o,this._y=i*u+r*o+s*a-n*c,this._z=s*u+r*c+n*o-i*a,this._w=r*u-n*a-i*o-s*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,s=e._z,r=e._w,a=this.dot(e);a<0&&(n=-n,i=-i,s=-s,r=-r,a=-a);let o=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);o=Math.sin(o*c)/u,t=Math.sin(t*c)/u,this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this._onChangeCallback()}else this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},jl=class jl{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(zu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(zu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,s=e.x,r=e.y,a=e.z,o=e.w,c=2*(r*i-a*n),u=2*(a*t-s*i),h=2*(s*n-r*t);return this.x=t+o*c+r*h-a*u,this.y=n+o*u+a*c-s*h,this.z=i+o*h+s*u-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=se(this.x,e.x,t.x),this.y=se(this.y,e.y,t.y),this.z=se(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=se(this.x,e,t),this.y=se(this.y,e,t),this.z=se(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,s=e.z,r=t.x,a=t.y,o=t.z;return this.x=i*o-s*a,this.y=s*r-n*o,this.z=n*a-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Lo.copy(this).projectOnVector(e),this.sub(Lo)}reflect(e){return this.sub(Lo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(se(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};jl.prototype.isVector3=!0;var M=jl,Lo=new M,zu=new K,Jl=class Jl{constructor(e,t,n,i,s,r,a,o,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,a,o,c)}set(e,t,n,i,s,r,a,o,c){let u=this.elements;return u[0]=e,u[1]=i,u[2]=a,u[3]=t,u[4]=s,u[5]=o,u[6]=n,u[7]=r,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[3],o=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],p=n[8],m=i[0],g=i[3],b=i[6],v=i[1],y=i[4],_=i[7],S=i[2],E=i[5],C=i[8];return s[0]=r*m+a*v+o*S,s[3]=r*g+a*y+o*E,s[6]=r*b+a*_+o*C,s[1]=c*m+u*v+h*S,s[4]=c*g+u*y+h*E,s[7]=c*b+u*_+h*C,s[2]=d*m+f*v+p*S,s[5]=d*g+f*y+p*E,s[8]=d*b+f*_+p*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],c=e[7],u=e[8];return t*r*u-t*a*c-n*s*u+n*a*o+i*s*c-i*r*o}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],c=e[7],u=e[8],h=u*r-a*c,d=a*o-u*s,f=c*s-r*o,p=t*h+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=h*m,e[1]=(i*c-u*n)*m,e[2]=(a*n-i*r)*m,e[3]=d*m,e[4]=(u*t-i*o)*m,e[5]=(i*s-a*t)*m,e[6]=f*m,e[7]=(n*o-c*t)*m,e[8]=(r*t-n*s)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,a){let o=Math.cos(s),c=Math.sin(s);return this.set(n*o,n*c,-n*(o*r+c*a)+r+e,-i*c,i*o,-i*(-c*r+o*a)+a+t,0,0,1),this}scale(e,t){return _i("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Do.makeScale(e,t)),this}rotate(e){return _i("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Do.makeRotation(-e)),this}translate(e,t){return _i("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Do.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Jl.prototype.isMatrix3=!0;var te=Jl,Do=new te,Gu=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hu=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function lm(){let l={enabled:!0,workingColorSpace:nt,spaces:{},convert:function(i,s,r){return this.enabled===!1||s===r||!s||!r||(this.spaces[s].transfer===Nr&&(i.r=Gt(i.r),i.g=Gt(i.g),i.b=Gt(i.b)),this.spaces[s].primaries!==this.spaces[r].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===Nr&&(i.r=yi(i.r),i.g=yi(i.g),i.b=yi(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Hl?pl:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,r){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return _i("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),l.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return _i("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),l.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return l.define({[nt]:{primaries:e,whitePoint:n,transfer:pl,toXYZ:Gu,fromXYZ:Hu,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:J},outputColorSpaceConfig:{drawingBufferColorSpace:J}},[J]:{primaries:e,whitePoint:n,transfer:Nr,toXYZ:Gu,fromXYZ:Hu,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:J}}}),l}var Ve=lm();function Gt(l){return l<.04045?l*.0773993808:Math.pow(l*.9478672986+.0521327014,2.4)}function yi(l){return l<.0031308?l*12.92:1.055*Math.pow(l,.41666)-.055}var si,kr=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{si===void 0&&(si=Br("canvas")),si.width=e.width,si.height=e.height;let i=si.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=si}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Br("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=Gt(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gt(t[n]/255)*255):t[n]=Gt(t[n]);return{data:t,width:e.width,height:e.height}}else return be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},cm=0,zr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:cm++}),this.uuid=gt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,a=i.length;r<a;r++)i[r].isDataTexture?s.push(No(i[r].image)):s.push(No(i[r]))}else s=No(i);n.url=s}return t||(e.images[this.uuid]=n),n}};function No(l){return typeof HTMLImageElement<"u"&&l instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&l instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&l instanceof ImageBitmap?kr.getDataURL(l):l.data?{data:Array.from(l.data),width:l.width,height:l.height,type:l.data.constructor.name}:(be("Texture: Unable to serialize Texture."),{})}var um=0,Oo=new M,rt=class l extends Wt{constructor(e=l.DEFAULT_IMAGE,t=l.DEFAULT_MAPPING,n=Nn,i=Nn,s=$t,r=Zn,a=Vt,o=Kn,c=l.DEFAULT_ANISOTROPY,u=Hl){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=gt(),this.name="",this.source=new zr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=o,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Oo).x}get height(){return this.source.getSize(Oo).y}get depth(){return this.source.getSize(Oo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){be(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){be(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ol)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ht:e.x=e.x-Math.floor(e.x);break;case Nn:e.x=e.x<0?0:1;break;case ls:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ht:e.y=e.y-Math.floor(e.y);break;case Nn:e.y=e.y<0?0:1;break;case ls:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};rt.DEFAULT_IMAGE=null;rt.DEFAULT_MAPPING=Ol;rt.DEFAULT_ANISOTROPY=1;var $l=class $l{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,o=e.elements,c=o[0],u=o[4],h=o[8],d=o[1],f=o[5],p=o[9],m=o[2],g=o[6],b=o[10];if(Math.abs(u-d)<.01&&Math.abs(h-m)<.01&&Math.abs(p-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+m)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+b-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(c+1)/2,_=(f+1)/2,S=(b+1)/2,E=(u+d)/4,C=(h+m)/4,A=(p+g)/4;return y>_&&y>S?y<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(y),i=E/n,s=C/n):_>S?_<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(_),n=E/i,s=A/i):S<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(S),n=C/s,i=A/s),this.set(n,i,s,t),this}let v=Math.sqrt((g-p)*(g-p)+(h-m)*(h-m)+(d-u)*(d-u));return Math.abs(v)<.001&&(v=1),this.x=(g-p)/v,this.y=(h-m)/v,this.z=(d-u)/v,this.w=Math.acos((c+f+b-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=se(this.x,e.x,t.x),this.y=se(this.y,e.y,t.y),this.z=se(this.z,e.z,t.z),this.w=se(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=se(this.x,e,t),this.y=se(this.y,e,t),this.z=se(this.z,e,t),this.w=se(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(se(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};$l.prototype.isVector4=!0;var qe=$l;var Qr=class Qr{constructor(e,t,n,i,s,r,a,o,c,u,h,d,f,p,m,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,r,a,o,c,u,h,d,f,p,m,g)}set(e,t,n,i,s,r,a,o,c,u,h,d,f,p,m,g){let b=this.elements;return b[0]=e,b[4]=t,b[8]=n,b[12]=i,b[1]=s,b[5]=r,b[9]=a,b[13]=o,b[2]=c,b[6]=u,b[10]=h,b[14]=d,b[3]=f,b[7]=p,b[11]=m,b[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qr().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/ri.setFromMatrixColumn(e,0).length(),s=1/ri.setFromMatrixColumn(e,1).length(),r=1/ri.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,s=e.z,r=Math.cos(n),a=Math.sin(n),o=Math.cos(i),c=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=r*u,f=r*h,p=a*u,m=a*h;t[0]=o*u,t[4]=-o*h,t[8]=c,t[1]=f+p*c,t[5]=d-m*c,t[9]=-a*o,t[2]=m-d*c,t[6]=p+f*c,t[10]=r*o}else if(e.order==="YXZ"){let d=o*u,f=o*h,p=c*u,m=c*h;t[0]=d+m*a,t[4]=p*a-f,t[8]=r*c,t[1]=r*h,t[5]=r*u,t[9]=-a,t[2]=f*a-p,t[6]=m+d*a,t[10]=r*o}else if(e.order==="ZXY"){let d=o*u,f=o*h,p=c*u,m=c*h;t[0]=d-m*a,t[4]=-r*h,t[8]=p+f*a,t[1]=f+p*a,t[5]=r*u,t[9]=m-d*a,t[2]=-r*c,t[6]=a,t[10]=r*o}else if(e.order==="ZYX"){let d=r*u,f=r*h,p=a*u,m=a*h;t[0]=o*u,t[4]=p*c-f,t[8]=d*c+m,t[1]=o*h,t[5]=m*c+d,t[9]=f*c-p,t[2]=-c,t[6]=a*o,t[10]=r*o}else if(e.order==="YZX"){let d=r*o,f=r*c,p=a*o,m=a*c;t[0]=o*u,t[4]=m-d*h,t[8]=p*h+f,t[1]=h,t[5]=r*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+p,t[10]=d-m*h}else if(e.order==="XZY"){let d=r*o,f=r*c,p=a*o,m=a*c;t[0]=o*u,t[4]=-h,t[8]=c*u,t[1]=d*h+m,t[5]=r*u,t[9]=f*h-p,t[2]=p*h-f,t[6]=a*u,t[10]=m*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hm,e,dm)}lookAt(e,t,n){let i=this.elements;return et.subVectors(e,t),et.lengthSq()===0&&(et.z=1),et.normalize(),tn.crossVectors(n,et),tn.lengthSq()===0&&(Math.abs(n.z)===1?et.x+=1e-4:et.z+=1e-4,et.normalize(),tn.crossVectors(n,et)),tn.normalize(),nr.crossVectors(et,tn),i[0]=tn.x,i[4]=nr.x,i[8]=et.x,i[1]=tn.y,i[5]=nr.y,i[9]=et.y,i[2]=tn.z,i[6]=nr.z,i[10]=et.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[4],o=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],p=n[2],m=n[6],g=n[10],b=n[14],v=n[3],y=n[7],_=n[11],S=n[15],E=i[0],C=i[4],A=i[8],R=i[12],P=i[1],I=i[5],D=i[9],N=i[13],O=i[2],U=i[6],V=i[10],Z=i[14],Y=i[3],ee=i[7],$=i[11],ne=i[15];return s[0]=r*E+a*P+o*O+c*Y,s[4]=r*C+a*I+o*U+c*ee,s[8]=r*A+a*D+o*V+c*$,s[12]=r*R+a*N+o*Z+c*ne,s[1]=u*E+h*P+d*O+f*Y,s[5]=u*C+h*I+d*U+f*ee,s[9]=u*A+h*D+d*V+f*$,s[13]=u*R+h*N+d*Z+f*ne,s[2]=p*E+m*P+g*O+b*Y,s[6]=p*C+m*I+g*U+b*ee,s[10]=p*A+m*D+g*V+b*$,s[14]=p*R+m*N+g*Z+b*ne,s[3]=v*E+y*P+_*O+S*Y,s[7]=v*C+y*I+_*U+S*ee,s[11]=v*A+y*D+_*V+S*$,s[15]=v*R+y*N+_*Z+S*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],a=e[5],o=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],p=e[3],m=e[7],g=e[11],b=e[15],v=o*f-c*d,y=a*f-c*h,_=a*d-o*h,S=r*f-c*u,E=r*d-o*u,C=r*h-a*u;return t*(m*v-g*y+b*_)-n*(p*v-g*S+b*E)+i*(p*y-m*S+b*C)-s*(p*_-m*E+g*C)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],a=e[9],o=e[2],c=e[6],u=e[10];return t*(r*u-a*c)-n*(s*u-a*o)+i*(s*c-r*o)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],p=e[12],m=e[13],g=e[14],b=e[15],v=t*a-n*r,y=t*o-i*r,_=t*c-s*r,S=n*o-i*a,E=n*c-s*a,C=i*c-s*o,A=u*m-h*p,R=u*g-d*p,P=u*b-f*p,I=h*g-d*m,D=h*b-f*m,N=d*b-f*g,O=v*N-y*D+_*I+S*P-E*R+C*A;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/O;return e[0]=(a*N-o*D+c*I)*U,e[1]=(i*D-n*N-s*I)*U,e[2]=(m*C-g*E+b*S)*U,e[3]=(d*E-h*C-f*S)*U,e[4]=(o*P-r*N-c*R)*U,e[5]=(t*N-i*P+s*R)*U,e[6]=(g*_-p*C-b*y)*U,e[7]=(u*C-d*_+f*y)*U,e[8]=(r*D-a*P+c*A)*U,e[9]=(n*P-t*D-s*A)*U,e[10]=(p*E-m*_+b*v)*U,e[11]=(h*_-u*E-f*v)*U,e[12]=(a*R-r*I-o*A)*U,e[13]=(t*I-n*R+i*A)*U,e[14]=(m*y-p*S-g*v)*U,e[15]=(u*S-h*y+d*v)*U,this}scale(e){let t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,r=e.x,a=e.y,o=e.z,c=s*r,u=s*a;return this.set(c*r+n,c*a-i*o,c*o+i*a,0,c*a+i*o,u*a+n,u*o-i*r,0,c*o-i*a,u*o+i*r,s*o*o+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,s=t._x,r=t._y,a=t._z,o=t._w,c=s+s,u=r+r,h=a+a,d=s*c,f=s*u,p=s*h,m=r*u,g=r*h,b=a*h,v=o*c,y=o*u,_=o*h,S=n.x,E=n.y,C=n.z;return i[0]=(1-(m+b))*S,i[1]=(f+_)*S,i[2]=(p-y)*S,i[3]=0,i[4]=(f-_)*E,i[5]=(1-(d+b))*E,i[6]=(g+v)*E,i[7]=0,i[8]=(p+y)*C,i[9]=(g-v)*C,i[10]=(1-(d+m))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=ri.set(i[0],i[1],i[2]).length(),a=ri.set(i[4],i[5],i[6]).length(),o=ri.set(i[8],i[9],i[10]).length();s<0&&(r=-r),dt.copy(this);let c=1/r,u=1/a,h=1/o;return dt.elements[0]*=c,dt.elements[1]*=c,dt.elements[2]*=c,dt.elements[4]*=u,dt.elements[5]*=u,dt.elements[6]*=u,dt.elements[8]*=h,dt.elements[9]*=h,dt.elements[10]*=h,t.setFromRotationMatrix(dt),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,r,a=zt,o=!1){let c=this.elements,u=2*s/(t-e),h=2*s/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),p,m;if(o)p=s/(r-s),m=r*s/(r-s);else if(a===zt)p=-(r+s)/(r-s),m=-2*r*s/(r-s);else if(a===us)p=-r/(r-s),m=-r*s/(r-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,r,a=zt,o=!1){let c=this.elements,u=2/(t-e),h=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),p,m;if(o)p=1/(r-s),m=r/(r-s);else if(a===zt)p=-2/(r-s),m=-(r+s)/(r-s);else if(a===us)p=-1/(r-s),m=-s/(r-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Qr.prototype.isMatrix4=!0;var F=Qr,ri=new M,dt=new F,hm=new M(0,0,0),dm=new M(1,1,1),tn=new M,nr=new M,et=new M,Vu=new F,Wu=new K,St=class l{constructor(e=0,t=0,n=0,i=l.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],a=i[8],o=i[1],c=i[5],u=i[9],h=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-r,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-se(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(o,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(se(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(o,s));break;case"ZYX":this._y=Math.asin(-se(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(o,s)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(se(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-se(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:be("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Vu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wu.setFromEuler(this),this.setFromQuaternion(Wu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};St.DEFAULT_ORDER="XYZ";var hs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},fm=0,Xu=new M,ai=new K,Dt=new F,ir=new M,Zi=new M,pm=new M,mm=new K,qu=new M(1,0,0),Yu=new M(0,1,0),Zu=new M(0,0,1),Ku={type:"added"},gm={type:"removed"},oi={type:"childadded",child:null},Fo={type:"childremoved",child:null},Ae=class l extends Wt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=gt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=l.DEFAULT_UP.clone();let e=new M,t=new St,n=new K,i=new M(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new F},normalMatrix:{value:new te}}),this.matrix=new F,this.matrixWorld=new F,this.matrixAutoUpdate=l.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=l.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ai.setFromAxisAngle(e,t),this.quaternion.multiply(ai),this}rotateOnWorldAxis(e,t){return ai.setFromAxisAngle(e,t),this.quaternion.premultiply(ai),this}rotateX(e){return this.rotateOnAxis(qu,e)}rotateY(e){return this.rotateOnAxis(Yu,e)}rotateZ(e){return this.rotateOnAxis(Zu,e)}translateOnAxis(e,t){return Xu.copy(e).applyQuaternion(this.quaternion),this.position.add(Xu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(qu,e)}translateY(e){return this.translateOnAxis(Yu,e)}translateZ(e){return this.translateOnAxis(Zu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ir.copy(e):ir.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Zi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dt.lookAt(Zi,ir,this.up):Dt.lookAt(ir,Zi,this.up),this.quaternion.setFromRotationMatrix(Dt),i&&(Dt.extractRotation(i.matrixWorld),ai.setFromRotationMatrix(Dt),this.quaternion.premultiply(ai.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Se("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ku),oi.child=e,this.dispatchEvent(oi),oi.child=null):Se("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(gm),Fo.child=e,this.dispatchEvent(Fo),Fo.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ku),oi.child=e,this.dispatchEvent(oi),oi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zi,e,pm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zi,mm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,o){return a[o.uuid]===void 0&&(a[o.uuid]=o.toJSON(e)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let o=a.shapes;if(Array.isArray(o))for(let c=0,u=o.length;c<u;c++){let h=o[c];s(e.shapes,h)}else s(e.shapes,o)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let o=0,c=this.material.length;o<c;o++)a.push(s(e.materials,this.material[o]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let o=this.animations[a];i.animations.push(s(e.animations,o))}}if(t){let a=r(e.geometries),o=r(e.materials),c=r(e.textures),u=r(e.images),h=r(e.shapes),d=r(e.skeletons),f=r(e.animations),p=r(e.nodes);a.length>0&&(n.geometries=a),o.length>0&&(n.materials=o),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function r(a){let o=[];for(let c in a){let u=a[c];delete u.metadata,o.push(u)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ae.DEFAULT_UP=new M(0,1,0);Ae.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var _e=class extends Ae{constructor(){super(),this.isGroup=!0,this.type="Group"}};var Yh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},nn={h:0,s:0,l:0},sr={h:0,s:0,l:0};function Uo(l,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?l+(e-l)*6*t:t<1/2?e:t<2/3?l+(e-l)*6*(2/3-t):l}var L=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=J){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ve.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Ve.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ve.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Ve.workingColorSpace){if(e=Wl(e,1),t=se(t,0,1),n=se(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=Uo(r,s,e+1/3),this.g=Uo(r,s,e),this.b=Uo(r,s,e-1/3)}return Ve.colorSpaceToWorking(this,i),this}setStyle(e,t=J){function n(s){s!==void 0&&parseFloat(s)<1&&be("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:be("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(s,16),t);be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=J){let n=Yh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gt(e.r),this.g=Gt(e.g),this.b=Gt(e.b),this}copyLinearToSRGB(e){return this.r=yi(e.r),this.g=yi(e.g),this.b=yi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=J){return Ve.workingToColorSpace(Ge.copy(this),e),Math.round(se(Ge.r*255,0,255))*65536+Math.round(se(Ge.g*255,0,255))*256+Math.round(se(Ge.b*255,0,255))}getHexString(e=J){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ve.workingColorSpace){Ve.workingToColorSpace(Ge.copy(this),t);let n=Ge.r,i=Ge.g,s=Ge.b,r=Math.max(n,i,s),a=Math.min(n,i,s),o,c,u=(a+r)/2;if(a===r)o=0,c=0;else{let h=r-a;switch(c=u<=.5?h/(r+a):h/(2-r-a),r){case n:o=(i-s)/h+(i<s?6:0);break;case i:o=(s-n)/h+2;break;case s:o=(n-i)/h+4;break}o/=6}return e.h=o,e.s=c,e.l=u,e}getRGB(e,t=Ve.workingColorSpace){return Ve.workingToColorSpace(Ge.copy(this),t),e.r=Ge.r,e.g=Ge.g,e.b=Ge.b,e}getStyle(e=J){Ve.workingToColorSpace(Ge.copy(this),e);let t=Ge.r,n=Ge.g,i=Ge.b;return e!==J?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(nn),this.setHSL(nn.h+e,nn.s+t,nn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(nn),e.getHSL(sr);let n=os(nn.h,sr.h,t),i=os(nn.s,sr.s,t),s=os(nn.l,sr.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ge=new L;L.NAMES=Yh;var ft=new M,Nt=new M,Bo=new M,Ot=new M,li=new M,ci=new M,ju=new M,ko=new M,zo=new M,Go=new M,Ho=new qe,Vo=new qe,Wo=new qe,kt=class l{constructor(e=new M,t=new M,n=new M){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),ft.subVectors(e,t),i.cross(ft);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){ft.subVectors(i,t),Nt.subVectors(n,t),Bo.subVectors(e,t);let r=ft.dot(ft),a=ft.dot(Nt),o=ft.dot(Bo),c=Nt.dot(Nt),u=Nt.dot(Bo),h=r*c-a*a;if(h===0)return s.set(0,0,0),null;let d=1/h,f=(c*o-a*u)*d,p=(r*u-a*o)*d;return s.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Ot)===null?!1:Ot.x>=0&&Ot.y>=0&&Ot.x+Ot.y<=1}static getInterpolation(e,t,n,i,s,r,a,o){return this.getBarycoord(e,t,n,i,Ot)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(s,Ot.x),o.addScaledVector(r,Ot.y),o.addScaledVector(a,Ot.z),o)}static getInterpolatedAttribute(e,t,n,i,s,r){return Ho.setScalar(0),Vo.setScalar(0),Wo.setScalar(0),Ho.fromBufferAttribute(e,t),Vo.fromBufferAttribute(e,n),Wo.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(Ho,s.x),r.addScaledVector(Vo,s.y),r.addScaledVector(Wo,s.z),r}static isFrontFacing(e,t,n,i){return ft.subVectors(n,t),Nt.subVectors(e,t),ft.cross(Nt).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ft.subVectors(this.c,this.b),Nt.subVectors(this.a,this.b),ft.cross(Nt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return l.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return l.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return l.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return l.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return l.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,a;li.subVectors(i,n),ci.subVectors(s,n),ko.subVectors(e,n);let o=li.dot(ko),c=ci.dot(ko);if(o<=0&&c<=0)return t.copy(n);zo.subVectors(e,i);let u=li.dot(zo),h=ci.dot(zo);if(u>=0&&h<=u)return t.copy(i);let d=o*h-u*c;if(d<=0&&o>=0&&u<=0)return r=o/(o-u),t.copy(n).addScaledVector(li,r);Go.subVectors(e,s);let f=li.dot(Go),p=ci.dot(Go);if(p>=0&&f<=p)return t.copy(s);let m=f*c-o*p;if(m<=0&&c>=0&&p<=0)return a=c/(c-p),t.copy(n).addScaledVector(ci,a);let g=u*p-f*h;if(g<=0&&h-u>=0&&f-p>=0)return ju.subVectors(s,i),a=(h-u)/(h-u+(f-p)),t.copy(i).addScaledVector(ju,a);let b=1/(g+m+d);return r=m*b,a=d*b,t.copy(n).addScaledVector(li,r).addScaledVector(ci,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Re=class{constructor(e=new M(1/0,1/0,1/0),t=new M(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(pt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(pt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=pt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let r=0,a=s.count;r<a;r++)e.isMesh===!0?e.getVertexPosition(r,pt):pt.fromBufferAttribute(s,r),pt.applyMatrix4(e.matrixWorld),this.expandByPoint(pt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),rr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),rr.copy(n.boundingBox)),rr.applyMatrix4(e.matrixWorld),this.union(rr)}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pt),pt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ki),ar.subVectors(this.max,Ki),ui.subVectors(e.a,Ki),hi.subVectors(e.b,Ki),di.subVectors(e.c,Ki),sn.subVectors(hi,ui),rn.subVectors(di,hi),Rn.subVectors(ui,di);let t=[0,-sn.z,sn.y,0,-rn.z,rn.y,0,-Rn.z,Rn.y,sn.z,0,-sn.x,rn.z,0,-rn.x,Rn.z,0,-Rn.x,-sn.y,sn.x,0,-rn.y,rn.x,0,-Rn.y,Rn.x,0];return!Xo(t,ui,hi,di,ar)||(t=[1,0,0,0,1,0,0,0,1],!Xo(t,ui,hi,di,ar))?!1:(or.crossVectors(sn,rn),t=[or.x,or.y,or.z],Xo(t,ui,hi,di,ar))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ft[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ft[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ft[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ft[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ft[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ft[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ft[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ft[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ft),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Ft=[new M,new M,new M,new M,new M,new M,new M,new M],pt=new M,rr=new Re,ui=new M,hi=new M,di=new M,sn=new M,rn=new M,Rn=new M,Ki=new M,ar=new M,or=new M,Cn=new M;function Xo(l,e,t,n,i){for(let s=0,r=l.length-3;s<=r;s+=3){Cn.fromArray(l,s);let a=i.x*Math.abs(Cn.x)+i.y*Math.abs(Cn.y)+i.z*Math.abs(Cn.z),o=e.dot(Cn),c=t.dot(Cn),u=n.dot(Cn);if(Math.max(-Math.max(o,c,u),Math.min(o,c,u))>a)return!1}return!0}var Pe=new M,lr=new B,xm=0,ie=class extends Wt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Vl,this.updateRanges=[],this.gpuType=wi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)lr.fromBufferAttribute(this,t),lr.applyMatrix3(e),this.setXY(t,lr.x,lr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pe.fromBufferAttribute(this,t),Pe.applyMatrix3(e),this.setXYZ(t,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pe.fromBufferAttribute(this,t),Pe.applyMatrix4(e),this.setXYZ(t,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pe.fromBufferAttribute(this,t),Pe.applyNormalMatrix(e),this.setXYZ(t,Pe.x,Pe.y,Pe.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pe.fromBufferAttribute(this,t),Pe.transformDirection(e),this.setXYZ(t,Pe.x,Pe.y,Pe.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=mt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mt(t,this.array)),t}setX(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mt(t,this.array)),t}setY(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mt(t,this.array)),t}setW(e,t){return this.normalized&&(t=xe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array),s=xe(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Ti=class extends ie{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Gr=class extends ie{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ce=class extends ie{constructor(e,t,n){super(new Float32Array(e),t,n)}},bm=new Re,ji=new M,qo=new M,W=class{constructor(e=new M,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):bm.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ji.subVectors(e,this.center);let t=ji.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ji,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(qo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ji.copy(e.center).add(qo)),this.expandByPoint(ji.copy(e.center).sub(qo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},vm=0,it=new F,Yo=new Ae,fi=new M,tt=new Re,Ji=new Re,Ue=new M,re=class l extends Wt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vm++}),this.uuid=gt(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Vp(e)?Gr:Ti)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new te().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return it.makeRotationFromQuaternion(e),this.applyMatrix4(it),this}rotateX(e){return it.makeRotationX(e),this.applyMatrix4(it),this}rotateY(e){return it.makeRotationY(e),this.applyMatrix4(it),this}rotateZ(e){return it.makeRotationZ(e),this.applyMatrix4(it),this}translate(e,t,n){return it.makeTranslation(e,t,n),this.applyMatrix4(it),this}scale(e,t,n){return it.makeScale(e,t,n),this.applyMatrix4(it),this}lookAt(e){return Yo.lookAt(e),Yo.updateMatrix(),this.applyMatrix4(Yo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fi).negate(),this.translate(fi.x,fi.y,fi.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new ce(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Re);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Se("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new M(-1/0,-1/0,-1/0),new M(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];tt.setFromBufferAttribute(s),this.morphTargetsRelative?(Ue.addVectors(this.boundingBox.min,tt.min),this.boundingBox.expandByPoint(Ue),Ue.addVectors(this.boundingBox.max,tt.max),this.boundingBox.expandByPoint(Ue)):(this.boundingBox.expandByPoint(tt.min),this.boundingBox.expandByPoint(tt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Se('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new W);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Se("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new M,1/0);return}if(e){let n=this.boundingSphere.center;if(tt.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let a=t[s];Ji.setFromBufferAttribute(a),this.morphTargetsRelative?(Ue.addVectors(tt.min,Ji.min),tt.expandByPoint(Ue),Ue.addVectors(tt.max,Ji.max),tt.expandByPoint(Ue)):(tt.expandByPoint(Ji.min),tt.expandByPoint(Ji.max))}tt.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)Ue.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Ue));if(t)for(let s=0,r=t.length;s<r;s++){let a=t[s],o=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ue.fromBufferAttribute(a,c),o&&(fi.fromBufferAttribute(e,c),Ue.add(fi)),i=Math.max(i,n.distanceToSquared(Ue))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Se('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Se("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,s=t.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new ie(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let a=[],o=[];for(let A=0;A<n.count;A++)a[A]=new M,o[A]=new M;let c=new M,u=new M,h=new M,d=new B,f=new B,p=new B,m=new M,g=new M;function b(A,R,P){c.fromBufferAttribute(n,A),u.fromBufferAttribute(n,R),h.fromBufferAttribute(n,P),d.fromBufferAttribute(s,A),f.fromBufferAttribute(s,R),p.fromBufferAttribute(s,P),u.sub(c),h.sub(c),f.sub(d),p.sub(d);let I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(m.copy(u).multiplyScalar(p.y).addScaledVector(h,-f.y).multiplyScalar(I),g.copy(h).multiplyScalar(f.x).addScaledVector(u,-p.x).multiplyScalar(I),a[A].add(m),a[R].add(m),a[P].add(m),o[A].add(g),o[R].add(g),o[P].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let A=0,R=v.length;A<R;++A){let P=v[A],I=P.start,D=P.count;for(let N=I,O=I+D;N<O;N+=3)b(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let y=new M,_=new M,S=new M,E=new M;function C(A){S.fromBufferAttribute(i,A),E.copy(S);let R=a[A];y.copy(R),y.sub(S.multiplyScalar(S.dot(R))).normalize(),_.crossVectors(E,R);let I=_.dot(o[A])<0?-1:1;r.setXYZW(A,y.x,y.y,y.z,I)}for(let A=0,R=v.length;A<R;++A){let P=v[A],I=P.start,D=P.count;for(let N=I,O=I+D;N<O;N+=3)C(e.getX(N+0)),C(e.getX(N+1)),C(e.getX(N+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new ie(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new M,s=new M,r=new M,a=new M,o=new M,c=new M,u=new M,h=new M;if(e)for(let d=0,f=e.count;d<f;d+=3){let p=e.getX(d+0),m=e.getX(d+1),g=e.getX(d+2);i.fromBufferAttribute(t,p),s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,g),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),a.fromBufferAttribute(n,p),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,g),a.add(u),o.add(u),c.add(u),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),r.fromBufferAttribute(t,d+2),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ue.fromBufferAttribute(e,t),Ue.normalize(),e.setXYZ(t,Ue.x,Ue.y,Ue.z)}toNonIndexed(){function e(a,o){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(o.length*u),f=0,p=0;for(let m=0,g=o.length;m<g;m++){a.isInterleavedBufferAttribute?f=o[m]*a.data.stride+a.offset:f=o[m]*u;for(let b=0;b<u;b++)d[p++]=c[f++]}return new ie(d,u,h)}if(this.index===null)return be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new l,n=this.index.array,i=this.attributes;for(let a in i){let o=i[a],c=e(o,n);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let o=[],c=s[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,n);o.push(f)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let a=0,o=r.length;a<o;a++){let c=r[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let c in o)o[c]!==void 0&&(e[c]=o[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let o in n){let c=n[o];e.data.attributes[o]=c.toJSON(e.data)}let i={},s=!1;for(let o in this.morphAttributes){let c=this.morphAttributes[o],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(i[o]=u,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let u=i[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let c=0,u=r.length;c<u;c++){let h=r[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let o=e.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},kn=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Vl,this.updateRanges=[],this.version=0,this.uuid=gt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=gt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=gt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},Xe=new M,ln=class l{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Xe.fromBufferAttribute(this,t),Xe.applyMatrix4(e),this.setXYZ(t,Xe.x,Xe.y,Xe.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Xe.fromBufferAttribute(this,t),Xe.applyNormalMatrix(e),this.setXYZ(t,Xe.x,Xe.y,Xe.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Xe.fromBufferAttribute(this,t),Xe.transformDirection(e),this.setXYZ(t,Xe.x,Xe.y,Xe.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=mt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=xe(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=xe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=mt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=mt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=mt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=mt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=xe(t,this.array),n=xe(n,this.array),i=xe(i,this.array),s=xe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){ml("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new ie(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new l(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ml("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Zo=new M,_m=new M,ym=new te,Mt=class{constructor(e=new M(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Zo.subVectors(n,t).cross(_m.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(Zo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return n===!0&&(r<0||r>1)?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ym.getNormalMatrix(e),i=this.coplanarPoint(Zo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Mm=0,Ke=class extends Wt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=gt(),this.name="",this.type="Material",this.blending=Ih,this.side=Rs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lh,this.blendDst=ta,this.blendEquation=Ph,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new L(0,0,0),this.blendAlpha=0,this.depthFunc=Ur,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Or,this.stencilZFail=Or,this.stencilZPass=Or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){be(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){be(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let r=[];for(let a in s){let o=s[a];delete o.metadata,r.push(o)}return r}if(t){let s=i(e.textures),r=i(e.images);s.length>0&&(n.textures=s),r.length>0&&(n.images=r)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new L().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Mt().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new B().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ei=class extends Ke{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new L(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},pi,$i=new M,mi=new M,gi=new M,xi=new B,Qi=new B,Zh=new F,cr=new M,es=new M,ur=new M,Ju=new B,Ko=new B,$u=new B,ds=class extends Ae{constructor(e=new Ei){if(super(),this.isSprite=!0,this.type="Sprite",pi===void 0){pi=new re;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new kn(t,5);pi.setIndex([0,1,2,0,2,3]),pi.setAttribute("position",new ln(n,3,0,!1)),pi.setAttribute("uv",new ln(n,2,3,!1))}this.geometry=pi,this.material=e,this.center=new B(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&Se('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),mi.setFromMatrixScale(this.matrixWorld),Zh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),gi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&mi.multiplyScalar(-gi.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let r=this.center;hr(cr.set(-.5,-.5,0),gi,r,mi,i,s),hr(es.set(.5,-.5,0),gi,r,mi,i,s),hr(ur.set(.5,.5,0),gi,r,mi,i,s),Ju.set(0,0),Ko.set(1,0),$u.set(1,1);let a=e.ray.intersectTriangle(cr,es,ur,!1,$i);if(a===null&&(hr(es.set(-.5,.5,0),gi,r,mi,i,s),Ko.set(0,1),a=e.ray.intersectTriangle(cr,ur,es,!1,$i),a===null))return;let o=e.ray.origin.distanceTo($i);o<e.near||o>e.far||t.push({distance:o,point:$i.clone(),uv:kt.getInterpolation($i,cr,es,ur,Ju,Ko,$u,new B),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function hr(l,e,t,n,i,s){xi.subVectors(l,t).addScalar(.5).multiply(n),i!==void 0?(Qi.x=s*xi.x-i*xi.y,Qi.y=i*xi.x+s*xi.y):Qi.copy(xi),l.copy(e),l.x+=Qi.x,l.y+=Qi.y,l.applyMatrix4(Zh)}var dr=new M,Qu=new M,fs=class extends Ae{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);let t=e.levels;for(let n=0,i=t.length;n<i;n++){let s=t[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,n=0){t=Math.abs(t);let i=this.levels,s;for(s=0;s<i.length&&!(t<i[s].distance);s++);return i.splice(s,0,{distance:t,hysteresis:n,object:e}),this.add(e),this}removeLevel(e){let t=this.levels;for(let n=0;n<t.length;n++)if(t[n].distance===e){let i=t.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){let t=this.levels;if(t.length>0){let n,i;for(n=1,i=t.length;n<i;n++){let s=t[n].distance;if(t[n].object.visible&&(s-=s*t[n].hysteresis),e<s)break}return t[n-1].object}return null}raycast(e,t){if(this.levels.length>0){dr.setFromMatrixPosition(this.matrixWorld);let i=e.ray.origin.distanceTo(dr);this.getObjectForDistance(i).raycast(e,t)}}update(e){let t=this.levels;if(t.length>1){dr.setFromMatrixPosition(e.matrixWorld),Qu.setFromMatrixPosition(this.matrixWorld);let n=dr.distanceTo(Qu)/e.zoom;t[0].object.visible=!0;let i,s;for(i=1,s=t.length;i<s;i++){let r=t[i].distance;if(t[i].object.visible&&(r-=r*t[i].hysteresis),n>=r)t[i-1].object.visible=!1,t[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)t[i].object.visible=!1}}toJSON(e){let t=super.toJSON(e);t.object.autoUpdate=this.autoUpdate,t.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let r=n[i];t.object.levels.push({object:r.object.uuid,distance:r.distance,hysteresis:r.hysteresis})}return t}},Ut=new M,jo=new M,fr=new M,pr=new M,cn=class{constructor(e=new M,t=new M(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ut)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ut.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ut.copy(this.origin).addScaledVector(this.direction,t),Ut.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){jo.copy(e).add(t).multiplyScalar(.5),fr.copy(t).sub(e).normalize(),pr.copy(this.origin).sub(jo);let s=e.distanceTo(t)*.5,r=-this.direction.dot(fr),a=pr.dot(this.direction),o=-pr.dot(fr),c=pr.lengthSq(),u=Math.abs(1-r*r),h,d,f,p;if(u>0)if(h=r*o-a,d=r*a-o,p=s*u,h>=0)if(d>=-p)if(d<=p){let m=1/u;h*=m,d*=m,f=h*(h+r*d+2*a)+d*(r*h+d+2*o)+c}else d=s,h=Math.max(0,-(r*d+a)),f=-h*h+d*(d+2*o)+c;else d=-s,h=Math.max(0,-(r*d+a)),f=-h*h+d*(d+2*o)+c;else d<=-p?(h=Math.max(0,-(-r*s+a)),d=h>0?-s:Math.min(Math.max(-s,-o),s),f=-h*h+d*(d+2*o)+c):d<=p?(h=0,d=Math.min(Math.max(-s,-o),s),f=d*(d+2*o)+c):(h=Math.max(0,-(r*s+a)),d=h>0?s:Math.min(Math.max(-s,-o),s),f=-h*h+d*(d+2*o)+c);else d=r>0?-s:s,h=Math.max(0,-(r*d+a)),f=-h*h+d*(d+2*o)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),i&&i.copy(jo).addScaledVector(fr,d),f}intersectSphere(e,t){if(e.radius<0)return null;Ut.subVectors(e.center,this.origin);let n=Ut.dot(this.direction),i=Ut.dot(Ut)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),a=n-r,o=n+r;return o<0?null:a<0?this.at(o,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,r,a,o,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,r=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,r=(e.min.y-d.y)*u),n>r||s>i||((s>n||isNaN(n))&&(n=s),(r<i||isNaN(i))&&(i=r),h>=0?(a=(e.min.z-d.z)*h,o=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,o=(e.min.z-d.z)*h),n>o||a>i)||((a>n||n!==n)&&(n=a),(o<i||i!==i)&&(i=o),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Ut)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,a=this.direction,o=a.x,c=a.y,u=a.z,h=e.x-r.x,d=e.y-r.y,f=e.z-r.z,p=t.x-r.x,m=t.y-r.y,g=t.z-r.z,b=n.x-r.x,v=n.y-r.y,y=n.z-r.z,_=Math.abs(o),S=Math.abs(c),E=Math.abs(u),C,A,R,P,I,D,N,O,U,V,Z,Y;if(_>=S&&_>=E?(R=o,D=h,U=p,Y=b,o>=0?(C=c,A=u,P=d,I=f,N=m,O=g,V=v,Z=y):(C=u,A=c,P=f,I=d,N=g,O=m,V=y,Z=v)):S>=E?(R=c,D=d,U=m,Y=v,c>=0?(C=u,A=o,P=f,I=h,N=g,O=p,V=y,Z=b):(C=o,A=u,P=h,I=f,N=p,O=g,V=b,Z=y)):(R=u,D=f,U=g,Y=y,u>=0?(C=o,A=c,P=h,I=d,N=p,O=m,V=b,Z=v):(C=c,A=o,P=d,I=h,N=m,O=p,V=v,Z=b)),R===0)return null;let ee=C/R,$=A/R,ne=1/R,fe=P-ee*D,ye=I-$*D,de=N-ee*U,Fe=O-$*U,he=V-ee*Y,Ie=Z-$*Y,ge=he*Fe-Ie*de,j=fe*Ie-ye*he,Me=de*ye-Fe*fe;if(i){if(ge<0||j<0||Me<0)return null}else if((ge<0||j<0||Me<0)&&(ge>0||j>0||Me>0))return null;let Qe=ge+j+Me;if(Qe===0)return null;let _t=ne*(ge*D+j*U+Me*Y);return(Qe>0?_t<0:_t>0)?null:this.at(_t/Qe,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},z=class extends Ke{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new L(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new St,this.combine=na,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},eh=new F,In=new cn,mr=new W,th=new M,gr=new M,xr=new M,br=new M,Jo=new M,vr=new M,nh=new M,_r=new M,k=class extends Ae{constructor(e=new re,t=new z){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){vr.set(0,0,0);for(let o=0,c=s.length;o<c;o++){let u=a[o],h=s[o];u!==0&&(Jo.fromBufferAttribute(h,e),r?vr.addScaledVector(Jo,u):vr.addScaledVector(Jo.sub(t),u))}t.add(vr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere),mr.applyMatrix4(s),In.copy(e.ray).recast(e.near),!(mr.containsPoint(In.origin)===!1&&(In.intersectSphere(mr,th)===null||In.origin.distanceToSquared(th)>(e.far-e.near)**2))&&(eh.copy(s).invert(),In.copy(e.ray).applyMatrix4(eh),!(n.boundingBox!==null&&In.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,In)))}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,a=s.index,o=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],v=Math.max(g.start,f.start),y=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,S=y;_<S;_+=3){let E=a.getX(_),C=a.getX(_+1),A=a.getX(_+2);i=yr(this,b,e,n,c,u,h,E,C,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(a.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let v=a.getX(g),y=a.getX(g+1),_=a.getX(g+2);i=yr(this,r,e,n,c,u,h,v,y,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(o!==void 0)if(Array.isArray(r))for(let p=0,m=d.length;p<m;p++){let g=d[p],b=r[g.materialIndex],v=Math.max(g.start,f.start),y=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,S=y;_<S;_+=3){let E=_,C=_+1,A=_+2;i=yr(this,b,e,n,c,u,h,E,C,A),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{let p=Math.max(0,f.start),m=Math.min(o.count,f.start+f.count);for(let g=p,b=m;g<b;g+=3){let v=g,y=g+1,_=g+2;i=yr(this,r,e,n,c,u,h,v,y,_),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}};function wm(l,e,t,n,i,s,r,a){let o;if(e.side===ea?o=n.intersectTriangle(r,s,i,!0,a):o=n.intersectTriangle(i,s,r,e.side===Rs,a),o===null)return null;_r.copy(a),_r.applyMatrix4(l.matrixWorld);let c=t.ray.origin.distanceTo(_r);return c<t.near||c>t.far?null:{distance:c,point:_r.clone(),object:l}}function yr(l,e,t,n,i,s,r,a,o,c){l.getVertexPosition(a,gr),l.getVertexPosition(o,xr),l.getVertexPosition(c,br);let u=wm(l,e,t,n,gr,xr,br,nh);if(u){let h=new M;kt.getBarycoord(nh,gr,xr,br,h),i&&(u.uv=kt.getInterpolatedAttribute(i,a,o,c,h,new B)),s&&(u.uv1=kt.getInterpolatedAttribute(s,a,o,c,h,new B)),r&&(u.normal=kt.getInterpolatedAttribute(r,a,o,c,h,new M),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:o,c,normal:new M,materialIndex:0};kt.getNormal(gr,xr,br,d.normal),u.face=d,u.barycoord=h}return u}var ts=new qe,ih=new qe,sh=new qe,Sm=new qe,rh=new F,Mr=new M,$o=new W,ah=new F,Qo=new cn,ps=class extends k{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=dl,this.bindMatrix=new F,this.bindMatrixInverse=new F,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Re),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Mr),this.boundingBox.expandByPoint(Mr)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new W),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Mr),this.boundingSphere.expandByPoint(Mr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),$o.copy(this.boundingSphere),$o.applyMatrix4(i),e.ray.intersectsSphere($o)!==!1&&(ah.copy(i).invert(),Qo.copy(e.ray).applyMatrix4(ah),!(this.boundingBox!==null&&Qo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Qo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new qe,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===dl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Oh?this.bindMatrixInverse.copy(this.bindMatrix).invert():be("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;ih.fromBufferAttribute(i.attributes.skinIndex,e),sh.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(ts.copy(t),t.set(0,0,0,0)):(ts.set(...t,1),t.set(0,0,0)),ts.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let r=sh.getComponent(s);if(r!==0){let a=ih.getComponent(s);rh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Sm.copy(ts).applyMatrix4(rh),r)}}return t.isVector4&&(t.w=ts.w),t.applyMatrix4(this.bindMatrixInverse)}},Ri=class extends Ae{constructor(){super(),this.isBone=!0,this.type="Bone"}},st=class extends rt{constructor(e=null,t=1,n=1,i,s,r,a,o,c=Mi,u=Mi,h,d){super(null,r,a,o,c,u,i,s,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},oh=new F,Am=new F,ms=class l{constructor(e=[],t=[]){this.uuid=gt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){be("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new F)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new F;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,r=e.length;s<r;s++){let a=e[s]?e[s].matrixWorld:Am;oh.multiplyMatrices(a,t[s]),oh.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new l(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new st(t,e,e,Vt,wi);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let s=e.bones[n],r=t[s];r===void 0&&(be("Skeleton: No bone found with UUID:",s),r=new Ri),this.bones.push(r),this.boneInverses.push(new F().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){let r=t[i];e.bones.push(r.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},We=class extends ie{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},bi=new F,lh=new F,wr=[],ch=new Re,Tm=new F,ns=new k,is=new W,q=class extends k{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new We(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Tm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Re),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,bi),ch.copy(e.boundingBox).applyMatrix4(bi),this.boundingBox.union(ch)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new W),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,bi),is.copy(e.boundingSphere).applyMatrix4(bi),this.boundingSphere.union(is)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,r=e*s+1;for(let a=0;a<n.length;a++)n[a]=i[r+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(ns.geometry=this.geometry,ns.material=this.material,ns.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),is.copy(this.boundingSphere),is.applyMatrix4(n),e.ray.intersectsSphere(is)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,bi),lh.multiplyMatrices(n,bi),ns.matrixWorld=lh,ns.raycast(e,wr);for(let r=0,a=wr.length;r<a;r++){let o=wr[r];o.instanceId=s,o.object=this,t.push(o)}wr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new We(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new st(new Float32Array(i*this.count),i,this.count,kh,wi));let s=this.morphTexture.source.data.data,r=0;for(let c=0;c<n.length;c++)r+=n[c];let a=this.geometry.morphTargetsRelative?1:1-r,o=i*e;return s[o]=a,s.set(n,o+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Pn=new W,Em=new B(.5,.5),Sr=new M,Xt=class{constructor(e=new Mt,t=new Mt,n=new Mt,i=new Mt,s=new Mt,r=new Mt){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zt,n=!1){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],p=s[8],m=s[9],g=s[10],b=s[11],v=s[12],y=s[13],_=s[14],S=s[15];if(i[0].setComponents(c-r,f-u,b-p,S-v).normalize(),i[1].setComponents(c+r,f+u,b+p,S+v).normalize(),i[2].setComponents(c+a,f+h,b+m,S+y).normalize(),i[3].setComponents(c-a,f-h,b-m,S-y).normalize(),n)i[4].setComponents(o,d,g,_).normalize(),i[5].setComponents(c-o,f-d,b-g,S-_).normalize();else if(i[4].setComponents(c-o,f-d,b-g,S-_).normalize(),t===zt)i[5].setComponents(c+o,f+d,b+g,S+_).normalize();else if(t===us)i[5].setComponents(o,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Pn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Pn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Pn)}intersectsSprite(e){Pn.center.set(0,0,0);let t=Em.distanceTo(e.center);return Pn.radius=.7071067811865476+t,Pn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Pn)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Sr.x=i.normal.x>0?e.max.x:e.min.x,Sr.y=i.normal.y>0?e.max.y:e.min.y,Sr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Sr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},uh=new F,Hr=class l{constructor(){this.coordinateSystem=zt,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){let s=t[i];uh.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),n[i]===void 0&&(n[i]=new Xt),n[i].setFromProjectionMatrix(uh,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++)t[i]===void 0&&(t[i]=new Xt),t[i].copy(n[i]);return this._count=e._count,this}clone(){return new l().copy(this)}};function el(l,e){return l-e}function Rm(l,e){return l.z-e.z}function Cm(l,e){return e.z-l.z}var gl=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,n,i){let s=this.pool,r=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let a=s[this.index];r.push(a),this.index++,a.start=e,a.count=t,a.z=n,a.index=i}reset(){this.list.length=0,this.index=0}},Ze=new F,Im=new L(1,1,1),Pm=new Xt,Lm=new Hr,Ar=new Re,Ln=new W,ss=new M,hh=new M,Dm=new M,tl=new gl,He=new k,Tr=[];function Nm(l,e,t=0){let n=e.itemSize;if(l.isInterleavedBufferAttribute||l.array.constructor!==e.array.constructor){let i=l.count;for(let s=0;s<i;s++)for(let r=0;r<n;r++)e.setComponent(s+t,r,l.getComponent(s,r))}else e.array.set(l.array,t*n);e.needsUpdate=!0}function Dn(l,e){if(l.constructor!==e.constructor){let t=Math.min(l.length,e.length);for(let n=0;n<t;n++)e[n]=l[n]}else{let t=Math.min(l.length,e.length);e.set(new l.constructor(l.buffer,0,t))}}var zn=class extends k{constructor(e,t,n=t*2,i){super(new re,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=e,this._maxVertexCount=t,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(e),this._multiDrawStarts=new Int32Array(e),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let e=Math.sqrt(this._maxInstanceCount*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4),n=new st(t,e,e,Vt,wi);this._matricesTexture=n}_initIndirectTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Uint32Array(e*e),n=new st(t,e,e,zh,Bh);this._indirectTexture=n}_initColorsTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);let t=new Float32Array(e*e*4).fill(1),n=new st(t,e,e,Vt,wi);n.colorSpace=Ve.workingColorSpace,this._colorsTexture=n}_initializeGeometry(e){let t=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in e.attributes){let r=e.getAttribute(s),{array:a,itemSize:o,normalized:c}=r,u=new a.constructor(n*o),h=new ie(u,o,c);t.setAttribute(s,h)}if(e.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);t.setIndex(new ie(s,1))}this._geometryInitialized=!0}}_validateGeometry(e){let t=this.geometry;if(!!e.getIndex()!=!!t.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in t.attributes){if(!e.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=e.getAttribute(n),s=t.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(e){let t=this._instanceInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`)}validateGeometryId(e){let t=this._geometryInfo;if(e<0||e>=t.length||t[e].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`)}setCustomSort(e){return this.customSort=e,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Re);let e=this.boundingBox,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,Ze),this.getBoundingBoxAt(s,Ar).applyMatrix4(Ze),e.union(Ar)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new W);let e=this.boundingSphere,t=this._instanceInfo;e.makeEmpty();for(let n=0,i=t.length;n<i;n++){if(t[n].active===!1)continue;let s=t[n].geometryIndex;this.getMatrixAt(n,Ze),this.getBoundingSphereAt(s,Ln).applyMatrix4(Ze),e.union(Ln)}}addInstance(e){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:e},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(el),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let s=this._matricesTexture;Ze.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;let r=this._colorsTexture;return r&&(Im.toArray(r.image.data,i*4),r.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(e,t=-1,n=-1){this._initializeGeometry(e),this._validateGeometry(e);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=t===-1?e.getAttribute("position").count:t;let r=e.getIndex();if(r!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?r.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let o;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(el),o=this._availableGeometryIds.shift(),s[o]=i):(o=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(o,e),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,o}setGeometryAt(e,t){if(e>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(t);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),r=t.getIndex(),a=this._geometryInfo[e];if(i&&r.count>a.reservedIndexCount||t.attributes.position.count>a.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let o=a.vertexStart,c=a.reservedVertexCount;a.vertexCount=t.getAttribute("position").count;for(let u in n.attributes){let h=t.getAttribute(u),d=n.getAttribute(u);Nm(h,d,o);let f=h.itemSize;for(let p=h.count,m=c;p<m;p++){let g=o+p;for(let b=0;b<f;b++)d.setComponent(g,b,0)}d.needsUpdate=!0,d.addUpdateRange(o*f,c*f)}if(i){let u=a.indexStart,h=a.reservedIndexCount;a.indexCount=t.getIndex().count;for(let d=0;d<r.count;d++)s.setX(u+d,o+r.getX(d));for(let d=r.count,f=h;d<f;d++)s.setX(u+d,o);s.needsUpdate=!0,s.addUpdateRange(u,a.reservedIndexCount)}return a.start=i?a.indexStart:a.vertexStart,a.count=i?a.indexCount:a.vertexCount,a.boundingBox=null,t.boundingBox!==null&&(a.boundingBox=t.boundingBox.clone()),a.boundingSphere=null,t.boundingSphere!==null&&(a.boundingSphere=t.boundingSphere.clone()),this._visibilityChanged=!0,e}deleteGeometry(e){let t=this._geometryInfo;if(e>=t.length||t[e].active===!1)return this;let n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].active&&n[i].geometryIndex===e&&this.deleteInstance(i);return t[e].active=!1,this._availableGeometryIds.push(e),this._visibilityChanged=!0,this}deleteInstance(e){return this.validateInstanceId(e),this._instanceInfo[e].active=!1,this._availableInstanceIds.push(e),this._visibilityChanged=!0,this}optimize(){let e=0,t=0,n=this._geometryInfo,i=n.map((r,a)=>a).sort((r,a)=>n[r].vertexStart-n[a].vertexStart),s=this.geometry;for(let r=0,a=n.length;r<a;r++){let o=i[r],c=n[o];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==t){let{indexStart:u,vertexStart:h,reservedIndexCount:d}=c,f=s.index,p=f.array,m=e-h;for(let g=u;g<u+d;g++)p[g]=p[g]+m;f.array.copyWithin(t,u,u+d),f.addUpdateRange(t,d),f.needsUpdate=!0,c.indexStart=t}t+=c.reservedIndexCount}if(c.vertexStart!==e){let{vertexStart:u,reservedVertexCount:h}=c,d=s.attributes;for(let f in d){let p=d[f],{array:m,itemSize:g}=p;m.copyWithin(e*g,u*g,(u+h)*g),p.addUpdateRange(e*g,h*g),p.needsUpdate=!0}c.vertexStart=e}e+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=t,this._nextVertexStart=e,this._visibilityChanged=!0,this}getBoundingBoxAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingBox===null){let s=new Re,r=n.index,a=n.attributes.position;for(let o=i.start,c=i.start+i.count;o<c;o++){let u=o;r&&(u=r.getX(u)),s.expandByPoint(ss.fromBufferAttribute(a,u))}i.boundingBox=s}return t.copy(i.boundingBox),t}getBoundingSphereAt(e,t){if(e>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[e];if(i.boundingSphere===null){let s=new W;this.getBoundingBoxAt(e,Ar),Ar.getCenter(s.center);let r=n.index,a=n.attributes.position,o=0;for(let c=i.start,u=i.start+i.count;c<u;c++){let h=c;r&&(h=r.getX(h)),ss.fromBufferAttribute(a,h),o=Math.max(o,s.center.distanceToSquared(ss))}s.radius=Math.sqrt(o),i.boundingSphere=s}return t.copy(i.boundingSphere),t}setMatrixAt(e,t){this.validateInstanceId(e);let n=this._matricesTexture,i=this._matricesTexture.image.data;return t.toArray(i,e*16),n.needsUpdate=!0,this}getMatrixAt(e,t){return this.validateInstanceId(e),t.fromArray(this._matricesTexture.image.data,e*16)}setColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null&&this._initColorsTexture(),t.toArray(this._colorsTexture.image.data,e*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(e,t){return this.validateInstanceId(e),this._colorsTexture===null?t.isVector4?t.set(1,1,1,1):t.setRGB(1,1,1):t.fromArray(this._colorsTexture.image.data,e*4)}setVisibleAt(e,t){return this.validateInstanceId(e),this._instanceInfo[e].visible===t?this:(this._instanceInfo[e].visible=t,this._visibilityChanged=!0,this)}getVisibleAt(e){return this.validateInstanceId(e),this._instanceInfo[e].visible}setGeometryIdAt(e,t){return this.validateInstanceId(e),this.validateGeometryId(t),this._instanceInfo[e].geometryIndex=t,this._visibilityChanged=!0,this}getGeometryIdAt(e){return this.validateInstanceId(e),this._instanceInfo[e].geometryIndex}getGeometryRangeAt(e,t={}){this.validateGeometryId(e);let n=this._geometryInfo[e];return t.vertexStart=n.vertexStart,t.vertexCount=n.vertexCount,t.reservedVertexCount=n.reservedVertexCount,t.indexStart=n.indexStart,t.indexCount=n.indexCount,t.reservedIndexCount=n.reservedIndexCount,t.start=n.start,t.count=n.count,t}setInstanceCount(e){let t=this._availableInstanceIds,n=this._instanceInfo;for(t.sort(el);t[t.length-1]===n.length-1;)n.pop(),t.pop();if(e<n.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);let i=new Int32Array(e),s=new Int32Array(e);Dn(this._multiDrawCounts,i),Dn(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=e;let r=this._indirectTexture,a=this._matricesTexture,o=this._colorsTexture;r.dispose(),this._initIndirectTexture(),Dn(r.image.data,this._indirectTexture.image.data),a.dispose(),this._initMatricesTexture(),Dn(a.image.data,this._matricesTexture.image.data),o&&(o.dispose(),this._initColorsTexture(),Dn(o.image.data,this._colorsTexture.image.data))}setGeometrySize(e,t){let n=[...this._geometryInfo].filter(a=>a.active);if(Math.max(...n.map(a=>a.vertexStart+a.reservedVertexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(o=>o.indexStart+o.reservedIndexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);let s=this.geometry;s.dispose(),this._maxVertexCount=e,this._maxIndexCount=t,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new re,this._initializeGeometry(s));let r=this.geometry;s.index&&Dn(s.index.array,r.index.array);for(let a in s.attributes)Dn(s.attributes[a].array,r.attributes[a].array)}raycast(e,t){let n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,r=this.geometry;He.material=this.material,He.geometry.index=r.index,He.geometry.attributes=r.attributes,He.geometry.boundingBox===null&&(He.geometry.boundingBox=new Re),He.geometry.boundingSphere===null&&(He.geometry.boundingSphere=new W);for(let a=0,o=n.length;a<o;a++){if(!n[a].visible||!n[a].active)continue;let c=n[a].geometryIndex,u=i[c];He.geometry.setDrawRange(u.start,u.count),this.getMatrixAt(a,He.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,He.geometry.boundingBox),this.getBoundingSphereAt(c,He.geometry.boundingSphere),He.raycast(e,Tr);for(let h=0,d=Tr.length;h<d;h++){let f=Tr[h];f.object=this,f.batchId=a,t.push(f)}Tr.length=0}He.material=null,He.geometry.index=null,He.geometry.attributes={},He.geometry.setDrawRange(0,1/0)}copy(e){return super.copy(e),this.geometry=e.geometry.clone(),this.perObjectFrustumCulled=e.perObjectFrustumCulled,this.sortObjects=e.sortObjects,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this._geometryInfo=e._geometryInfo.map(t=>({...t,boundingBox:t.boundingBox!==null?t.boundingBox.clone():null,boundingSphere:t.boundingSphere!==null?t.boundingSphere.clone():null})),this._instanceInfo=e._instanceInfo.map(t=>({...t})),this._availableInstanceIds=e._availableInstanceIds.slice(),this._availableGeometryIds=e._availableGeometryIds.slice(),this._nextIndexStart=e._nextIndexStart,this._nextVertexStart=e._nextVertexStart,this._geometryCount=e._geometryCount,this._maxInstanceCount=e._maxInstanceCount,this._maxVertexCount=e._maxVertexCount,this._maxIndexCount=e._maxIndexCount,this._geometryInitialized=e._geometryInitialized,this._multiDrawCounts=e._multiDrawCounts.slice(),this._multiDrawStarts=e._multiDrawStarts.slice(),this._multiDrawBytesPerElement=e._multiDrawBytesPerElement,this._indirectTexture=e._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=e._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=e._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(e,t,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let r=i.getIndex(),a=r===null?1:r.array.BYTES_PER_ELEMENT,o=1;s.wireframe&&(o=2,a=i.attributes.position.count>65535?4:2);let c=this._instanceInfo,u=this._multiDrawStarts,h=this._multiDrawCounts,d=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,m=p.image.data,g=n.isArrayCamera?Lm:Pm;f&&(n.isArrayCamera?g.setFromArrayCamera(n):(Ze.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),g.setFromProjectionMatrix(Ze,n.coordinateSystem,n.reversedDepth)));let b=0;if(this.sortObjects){Ze.copy(this.matrixWorld).invert(),ss.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Ze),hh.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Ze);for(let _=0,S=c.length;_<S;_++)if(c[_].visible&&c[_].active){let E=c[_].geometryIndex;this.getMatrixAt(_,Ze),this.getBoundingSphereAt(E,Ln).applyMatrix4(Ze);let C=!1;if(f&&(C=!g.intersectsSphere(Ln)),!C){let A=d[E],R=Dm.subVectors(Ln.center,ss).dot(hh);tl.push(A.start,A.count,R,_)}}let v=tl.list,y=this.customSort;y===null?v.sort(s.transparent?Cm:Rm):y.call(this,v,n);for(let _=0,S=v.length;_<S;_++){let E=v[_];u[b]=E.start*a*o,h[b]=E.count*o,m[b]=E.index,b++}tl.reset()}else for(let v=0,y=c.length;v<y;v++)if(c[v].visible&&c[v].active){let _=c[v].geometryIndex,S=!1;if(f&&(this.getMatrixAt(v,Ze),this.getBoundingSphereAt(_,Ln).applyMatrix4(Ze),S=!g.intersectsSphere(Ln)),!S){let E=d[_];u[b]=E.start*a*o,h[b]=E.count*o,m[b]=v,b++}}p.needsUpdate=!0,this._multiDrawCount=b,this._multiDrawBytesPerElement=a,this._visibilityChanged=!1}onBeforeShadow(e,t,n,i,s,r){this.onBeforeRender(e,null,i,s,r)}},Ci=class extends Ke{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new L(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Vr=new M,Wr=new M,dh=new F,rs=new cn,Er=new W,nl=new M,fh=new M,Gn=class extends Ae{constructor(e=new re,t=new Ci){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Vr.fromBufferAttribute(t,i-1),Wr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Vr.distanceTo(Wr);e.setAttribute("lineDistance",new ce(n,1))}else be("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Er.copy(n.boundingSphere),Er.applyMatrix4(i),Er.radius+=s,e.ray.intersectsSphere(Er)===!1)return;dh.copy(i).invert(),rs.copy(e.ray).applyMatrix4(dh);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){let f=Math.max(0,r.start),p=Math.min(u.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=u.getX(m),v=u.getX(m+1),y=Rr(this,e,rs,o,b,v,m);y&&t.push(y)}if(this.isLineLoop){let m=u.getX(p-1),g=u.getX(f),b=Rr(this,e,rs,o,m,g,p-1);b&&t.push(b)}}else{let f=Math.max(0,r.start),p=Math.min(d.count,r.start+r.count);for(let m=f,g=p-1;m<g;m+=c){let b=Rr(this,e,rs,o,m,m+1,m);b&&t.push(b)}if(this.isLineLoop){let m=Rr(this,e,rs,o,p-1,f,p-1);m&&t.push(m)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Rr(l,e,t,n,i,s,r){let a=l.geometry.attributes.position;if(Vr.fromBufferAttribute(a,i),Wr.fromBufferAttribute(a,s),t.distanceSqToSegment(Vr,Wr,nl,fh)>n)return;nl.applyMatrix4(l.matrixWorld);let c=e.ray.origin.distanceTo(nl);if(!(c<e.near||c>e.far))return{distance:c,point:fh.clone().applyMatrix4(l.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:l}}var ph=new M,mh=new M,gs=class extends Gn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)ph.fromBufferAttribute(t,i),mh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ph.distanceTo(mh);e.setAttribute("lineDistance",new ce(n,1))}else be("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},xs=class extends Gn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},un=class extends Ke{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new L(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},gh=new F,xl=new cn,Cr=new W,Ir=new M,xt=class extends Ae{constructor(e=new re,t=new un){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere),Cr.applyMatrix4(i),Cr.radius+=s,e.ray.intersectsSphere(Cr)===!1)return;gh.copy(i).invert(),xl.copy(e.ray).applyMatrix4(gh);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=a*a,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,r.start),f=Math.min(c.count,r.start+r.count);for(let p=d,m=f;p<m;p++){let g=c.getX(p);Ir.fromBufferAttribute(h,g),xh(Ir,g,o,i,e,t,this)}}else{let d=Math.max(0,r.start),f=Math.min(h.count,r.start+r.count);for(let p=d,m=f;p<m;p++)Ir.fromBufferAttribute(h,p),xh(Ir,p,o,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function xh(l,e,t,n,i,s,r){let a=xl.distanceSqToPoint(l);if(a<t){let o=new M;xl.closestPointToPoint(l,o),o.applyMatrix4(n);let c=i.ray.origin.distanceTo(o);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:o,index:e,face:null,faceIndex:null,barycoord:null,object:r})}}var ue=class extends rt{constructor(e,t,n,i,s,r,a,o,c){super(e,t,n,i,s,r,a,o,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var ke=class l extends re{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let a=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let o=[],c=[],u=[],h=[],d=0,f=0;p("z","y","x",-1,-1,n,t,e,r,s,0),p("z","y","x",1,-1,n,t,-e,r,s,1),p("x","z","y",1,1,e,n,t,i,r,2),p("x","z","y",1,-1,e,n,-t,i,r,3),p("x","y","z",1,-1,e,t,n,i,s,4),p("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new ce(c,3)),this.setAttribute("normal",new ce(u,3)),this.setAttribute("uv",new ce(h,2));function p(m,g,b,v,y,_,S,E,C,A,R){let P=_/C,I=S/A,D=_/2,N=S/2,O=E/2,U=C+1,V=A+1,Z=0,Y=0,ee=new M;for(let $=0;$<V;$++){let ne=$*I-N;for(let fe=0;fe<U;fe++){let ye=fe*P-D;ee[m]=ye*v,ee[g]=ne*y,ee[b]=O,c.push(ee.x,ee.y,ee.z),ee[m]=0,ee[g]=0,ee[b]=E>0?1:-1,u.push(ee.x,ee.y,ee.z),h.push(fe/C),h.push(1-$/A),Z+=1}}for(let $=0;$<A;$++)for(let ne=0;ne<C;ne++){let fe=d+ne+U*$,ye=d+ne+U*($+1),de=d+(ne+1)+U*($+1),Fe=d+(ne+1)+U*$;o.push(fe,ye,Fe),o.push(ye,de,Fe),Y+=6}a.addGroup(f,Y,R),f+=Y,d+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var At=class l extends re{constructor(e=1,t=1,n=1,i=32,s=1,r=!1,a=0,o=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o};let c=this;i=Math.floor(i),s=Math.floor(s);let u=[],h=[],d=[],f=[],p=0,m=[],g=n/2,b=0;v(),r===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(u),this.setAttribute("position",new ce(h,3)),this.setAttribute("normal",new ce(d,3)),this.setAttribute("uv",new ce(f,2));function v(){let _=new M,S=new M,E=0,C=(t-e)/n;for(let A=0;A<=s;A++){let R=[],P=A/s,I=P*(t-e)+e;for(let D=0;D<=i;D++){let N=D/i,O=N*o+a,U=Math.sin(O),V=Math.cos(O);S.x=I*U,S.y=-P*n+g,S.z=I*V,h.push(S.x,S.y,S.z),_.set(U,C,V).normalize(),d.push(_.x,_.y,_.z),f.push(N,1-P),R.push(p++)}m.push(R)}for(let A=0;A<i;A++)for(let R=0;R<s;R++){let P=m[R][A],I=m[R+1][A],D=m[R+1][A+1],N=m[R][A+1];(e>0||R!==0)&&(u.push(P,I,N),E+=3),(t>0||R!==s-1)&&(u.push(I,D,N),E+=3)}c.addGroup(b,E,0),b+=E}function y(_){let S=p,E=new B,C=new M,A=0,R=_===!0?e:t,P=_===!0?1:-1;for(let D=1;D<=i;D++)h.push(0,g*P,0),d.push(0,P,0),f.push(.5,.5),p++;let I=p;for(let D=0;D<=i;D++){let O=D/i*o+a,U=Math.cos(O),V=Math.sin(O);C.x=R*V,C.y=g*P,C.z=R*U,h.push(C.x,C.y,C.z),d.push(0,P,0),E.x=U*.5+.5,E.y=V*.5*P+.5,f.push(E.x,E.y),p++}for(let D=0;D<i;D++){let N=S+D,O=I+D;_===!0?u.push(O,O+1,N):u.push(O+1,O,N),A+=3}c.addGroup(b,A,_===!0?1:2),b+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var bs=class l extends re{constructor(e=[new B(0,-.5),new B(.5,0),new B(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=se(i,0,Math.PI*2);let s=[],r=[],a=[],o=[],c=[],u=1/t,h=new M,d=new B,f=new M,p=new M,m=new M,g=0,b=0;for(let v=0;v<=e.length-1;v++)switch(v){case 0:g=e[v+1].x-e[v].x,b=e[v+1].y-e[v].y,f.x=b*1,f.y=-g,f.z=b*0,m.copy(f),f.normalize(),o.push(f.x,f.y,f.z);break;case e.length-1:o.push(m.x,m.y,m.z);break;default:g=e[v+1].x-e[v].x,b=e[v+1].y-e[v].y,f.x=b*1,f.y=-g,f.z=b*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),o.push(f.x,f.y,f.z),m.copy(p)}for(let v=0;v<=t;v++){let y=n+v*u*i,_=Math.sin(y),S=Math.cos(y);for(let E=0;E<=e.length-1;E++){h.x=e[E].x*_,h.y=e[E].y,h.z=e[E].x*S,r.push(h.x,h.y,h.z),d.x=v/t,d.y=E/(e.length-1),a.push(d.x,d.y);let C=o[3*E+0]*_,A=o[3*E+1],R=o[3*E+0]*S;c.push(C,A,R)}}for(let v=0;v<t;v++)for(let y=0;y<e.length-1;y++){let _=y+v*e.length,S=_,E=_+e.length,C=_+e.length+1,A=_+1;s.push(S,E,A),s.push(C,A,E)}this.setIndex(s),this.setAttribute("position",new ce(r,3)),this.setAttribute("uv",new ce(a,2)),this.setAttribute("normal",new ce(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.points,e.segments,e.phiStart,e.phiLength)}};var qt=class l extends re{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,a=Math.floor(n),o=Math.floor(i),c=a+1,u=o+1,h=e/a,d=t/o,f=[],p=[],m=[],g=[];for(let b=0;b<u;b++){let v=b*d-r;for(let y=0;y<c;y++){let _=y*h-s;p.push(_,-v,0),m.push(0,0,1),g.push(y/a),g.push(1-b/o)}}for(let b=0;b<o;b++)for(let v=0;v<a;v++){let y=v+c*b,_=v+c*(b+1),S=v+1+c*(b+1),E=v+1+c*b;f.push(y,_,E),f.push(_,S,E)}this.setIndex(f),this.setAttribute("position",new ce(p,3)),this.setAttribute("normal",new ce(m,3)),this.setAttribute("uv",new ce(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.width,e.height,e.widthSegments,e.heightSegments)}};var Be=class l extends re{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:r,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let o=Math.min(r+a,Math.PI),c=0,u=[],h=new M,d=new M,f=[],p=[],m=[],g=[];for(let b=0;b<=n;b++){let v=[],y=b/n,_=r+y*a,S=e*Math.cos(_),E=Math.sqrt(e*e-S*S),C=0;b===0&&r===0?C=.5/t:b===n&&o===Math.PI&&(C=-.5/t);for(let A=0;A<=t;A++){let R=A/t,P=i+R*s;h.x=-E*Math.cos(P),h.y=S,h.z=E*Math.sin(P),p.push(h.x,h.y,h.z),d.copy(h).normalize(),m.push(d.x,d.y,d.z),g.push(R+C,1-y),v.push(c++)}u.push(v)}for(let b=0;b<n;b++)for(let v=0;v<t;v++){let y=u[b][v+1],_=u[b][v],S=u[b+1][v],E=u[b+1][v+1];(b!==0||r>0)&&f.push(y,_,E),(b!==n-1||o<Math.PI)&&f.push(_,S,E)}this.setIndex(f),this.setAttribute("position",new ce(p,3)),this.setAttribute("normal",new ce(m,3)),this.setAttribute("uv",new ce(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new l(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};function ql(l){let e={};for(let t in l){e[t]={};for(let n in l[t]){let i=l[t][n];if(bh(i))i.isRenderTargetTexture?(be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(bh(i[0])){let s=[];for(let r=0,a=i.length;r<a;r++)s[r]=i[r].clone();e[t][n]=s}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Ye(l){let e={};for(let t=0;t<l.length;t++){let n=ql(l[t]);for(let i in n)e[i]=n[i]}return e}function bh(l){return l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)}function Om(l){let e=[];for(let t=0;t<l.length;t++)e.push(l[t].clone());return e}var Fm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Um=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bt=class extends Ke{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fm,this.fragmentShader=Um,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ql(e.uniforms),this.uniformsGroups=Om(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;r&&r.isTexture?t.uniforms[i]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[i]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[i]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[i]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[i]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[i]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[i]={type:"m4",value:r.toArray()}:t.uniforms[i]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new L().setHex(i.value);break;case"v2":this.uniforms[n].value=new B().fromArray(i.value);break;case"v3":this.uniforms[n].value=new M().fromArray(i.value);break;case"v4":this.uniforms[n].value=new qe().fromArray(i.value);break;case"m3":this.uniforms[n].value=new te().fromArray(i.value);break;case"m4":this.uniforms[n].value=new F().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}};var Le=class extends Ke{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new L(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new L(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gl,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new St,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},je=class extends Le{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new B(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return se(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new L(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new L(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new L(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var at=class extends Ke{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new L(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new L(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gl,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new St,this.combine=na,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function on(l,e){return!l||l.constructor===e?l:typeof e.BYTES_PER_ELEMENT=="number"?new e(l):Array.prototype.slice.call(l)}function Fr(l){return l!==void 0&&l.inTangents!==void 0&&l.outTangents!==void 0}function Bm(l){function e(i,s){return l[i]-l[s]}let t=l.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function vh(l,e,t){let n=l.length,i=new l.constructor(n);for(let s=0,r=0;r!==n;++s){let a=t[s]*e;for(let o=0;o!==e;++o)i[r++]=l[a+o]}return i}function km(l,e,t,n){let i=1,s=l[0];for(;s!==void 0&&s[n]===void 0;)s=l[i++];if(s===void 0)return;let r=s[n];if(r!==void 0)if(Array.isArray(r))do r=s[n],r!==void 0&&(e.push(s.time),t.push(...r)),s=l[i++];while(s!==void 0);else if(r.toArray!==void 0)do r=s[n],r!==void 0&&(e.push(s.time),r.toArray(t,t.length)),s=l[i++];while(s!==void 0);else do r=s[n],r!==void 0&&(e.push(s.time),t.push(r)),s=l[i++];while(s!==void 0)}var Tt=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];e:{t:{let r;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break t}r=t.length;break n}if(!(e>=s)){let a=t[1];e<a&&(n=2,s=a);for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=t[--n-1],e>=s)break t}r=n,n=0;break n}break e}for(;n<r;){let a=n+r>>>1;e<t[a]?r=a:n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Xr=class extends Tt{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:On,endingEnd:On}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,a=i[s],o=i[r];if(a===void 0)switch(this.getSettings_().endingStart){case Fn:s=e,a=2*t-n;break;case cs:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(o===void 0)switch(this.getSettings_().endingEnd){case Fn:r=e,o=2*n-t;break;case cs:r=1,o=n+i[1]-i[0];break;default:r=e-1,o=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(o-n),this._offsetPrev=s*u,this._offsetNext=r*u}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,c=o-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),m=p*p,g=m*p,b=-d*g+2*d*m-d*p,v=(1+d)*g+(-1.5-2*d)*m+(-.5+d)*p+1,y=(-1-f)*g+(1.5+f)*m+.5*p,_=f*g-f*m;for(let S=0;S!==a;++S)s[S]=b*r[u+S]+v*r[c+S]+y*r[o+S]+_*r[h+S];return s}},vs=class extends Tt{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,c=o-a,u=(n-t)/(i-t),h=1-u;for(let d=0;d!==a;++d)s[d]=r[c+d]*h+r[o+d]*u;return s}},qr=class extends Tt{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Yr=class extends Tt{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,c=o-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let p=(n-t)/(i-t),m=1-p;for(let g=0;g!==a;++g)s[g]=r[c+g]*m+r[o+g]*p;return s}let d=a*2,f=e-1;for(let p=0;p!==a;++p){let m=r[c+p],g=r[o+p],b=f*d+p*2,v=h[b],y=h[b+1],_=e*d+p*2,S=u[_],E=u[_+1],C=Gm(n,t,v,S,i);s[p]=Kh(C,m,y,E,g)}return s}};function Kh(l,e,t,n,i){let s=1-l;return s*s*s*e+3*s*s*l*t+3*s*l*l*n+l*l*l*i}function zm(l,e,t,n,i){let s=1-l;return 3*s*s*(t-e)+6*s*l*(n-t)+3*l*l*(i-n)}function Gm(l,e,t,n,i){let s=(l-e)/(i-e);for(let r=0;r<8;r++){let a=Kh(s,e,t,n,i)-l;if(Math.abs(a)<1e-10)break;let o=zm(s,e,t,n,i);if(Math.abs(o)<1e-10)break;s=Math.max(0,Math.min(1,s-a/o))}return s}var Je=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=on(t,this.TimeBufferType),this.values=on(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:on(e.times,Array),values:on(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Fr(e.settings)&&(n.settings={inTangents:on(e.settings.inTangents,Array),outTangents:on(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new qr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new vs(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Xr(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Yr(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Un:t=this.InterpolantFactoryMethodDiscrete;break;case Bn:t=this.InterpolantFactoryMethodLinear;break;case Dr:t=this.InterpolantFactoryMethodSmooth;break;case fl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return be("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Un;case this.InterpolantFactoryMethodLinear:return Bn;case this.InterpolantFactoryMethodSmooth:return Dr;case this.InterpolantFactoryMethodBezier:return fl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Fr(this.settings)&&(_h(this.settings.inTangents,e),_h(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;for(;s!==i&&n[s]<e;)++s;for(;r!==-1&&n[r]>t;)--r;if(++r,s!==0||r!==i){s>=r&&(r=Math.max(r,1),s=r-1);let a=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*a,r*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Se("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,s=n.length;s===0&&(Se("KeyframeTrack: Track is empty.",this),e=!1);let r=null;for(let a=0;a!==s;a++){let o=n[a];if(typeof o=="number"&&isNaN(o)){Se("KeyframeTrack: Time is not a valid number.",this,a,o),e=!1;break}if(r!==null&&r>o){Se("KeyframeTrack: Out of order keys.",this,a,o,r),e=!1;break}r=o}if(i!==void 0&&Wp(i))for(let a=0,o=i.length;a!==o;++a){let c=i[a];if(isNaN(c)){Se("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Dr,s=e.length-1,r=1;for(let a=1;a<s;++a){let o=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(i)o=!0;else{let h=a*n,d=h-n,f=h+n;for(let p=0;p!==n;++p){let m=t[h+p];if(m!==t[d+p]||m!==t[f+p]){o=!0;break}}}if(o){if(a!==r){e[r]=e[a];let h=a*n,d=r*n;for(let f=0;f!==n;++f)t[d+f]=t[h+f]}++r}}if(s>0){e[r]=e[s];for(let a=s*n,o=r*n,c=0;c!==n;++c)t[o+c]=t[a+c];++r}return r!==e.length?(this.times=e.slice(0,r),this.values=t.slice(0,r*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Fr(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function _h(l,e){for(let t=0,n=l.length;t!==n;t+=2)l[t]*=e}Je.prototype.ValueTypeName="";Je.prototype.TimeBufferType=Float32Array;Je.prototype.ValueBufferType=Float32Array;Je.prototype.DefaultInterpolation=Bn;var Yt=class extends Je{constructor(e,t,n){super(e,t,n)}};Yt.prototype.ValueTypeName="bool";Yt.prototype.ValueBufferType=Array;Yt.prototype.DefaultInterpolation=Un;Yt.prototype.InterpolantFactoryMethodLinear=void 0;Yt.prototype.InterpolantFactoryMethodSmooth=void 0;var _s=class extends Je{constructor(e,t,n,i){super(e,t,n,i)}};_s.prototype.ValueTypeName="color";var Zt=class extends Je{constructor(e,t,n,i){super(e,t,n,i)}};Zt.prototype.ValueTypeName="number";var Zr=class extends Tt{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=(n-t)/(i-t),c=e*a;for(let u=c+a;c!==u;c+=4)K.slerpFlat(s,0,r,c-a,r,c,o);return s}},Kt=class extends Je{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Zr(this.times,this.values,this.getValueSize(),e)}};Kt.prototype.ValueTypeName="quaternion";Kt.prototype.InterpolantFactoryMethodSmooth=void 0;var jt=class extends Je{constructor(e,t,n){super(e,t,n)}};jt.prototype.ValueTypeName="string";jt.prototype.ValueBufferType=Array;jt.prototype.DefaultInterpolation=Un;jt.prototype.InterpolantFactoryMethodLinear=void 0;jt.prototype.InterpolantFactoryMethodSmooth=void 0;var hn=class extends Je{constructor(e,t,n,i){super(e,t,n,i)}};hn.prototype.ValueTypeName="vector";var Hn=class{constructor(e="",t=-1,n=[],i=ia){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=gt(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let r=0,a=n.length;r!==a;++r)t.push(Vm(n[r]).scale(i));let s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,r=n.length;s!==r;++s)t.push(Je.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let s=t.length,r=[];for(let a=0;a<s;a++){let o=[],c=[];o.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);let u=Bm(o);o=vh(o,1,u),c=vh(c,1,u),!i&&o[0]===0&&(o.push(s),c.push(c[0])),r.push(new Zt(".morphTargetInfluences["+t[a].name+"]",o,c).scale(1/n))}return new this(e,-1,r)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,o=e.length;a<o;a++){let c=e[a],u=c.name.match(s);if(u&&u.length>1){let h=u[1],d=i[h];d||(i[h]=d=[]),d.push(c)}}let r=[];for(let a in i)r.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return r}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function Hm(l){switch(l.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Zt;case"vector":case"vector2":case"vector3":case"vector4":return hn;case"color":return _s;case"quaternion":return Kt;case"bool":case"boolean":return Yt;case"string":return jt}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+l)}function Vm(l){if(l.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=Hm(l.type);if(l.times===void 0){let n=[],i=[];km(l.keys,n,i,"value"),l.times=n,l.values=i}let t;return e.parse!==void 0?t=e.parse(l):t=new e(l.name,l.times,l.values,l.interpolation),Fr(l.settings)&&(t.settings={inTangents:on(l.settings.inTangents,Float32Array),outTangents:on(l.settings.outTangents,Float32Array)}),t}var wt={enabled:!1,files:{},add:function(l,e){this.enabled!==!1&&(yh(l)||(this.files[l]=e))},get:function(l){if(this.enabled!==!1&&!yh(l))return this.files[l]},remove:function(l){delete this.files[l]},clear:function(){this.files={}}};function yh(l){try{let e=l.slice(l.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var Kr=class{constructor(e,t,n){let i=this,s=!1,r=0,a=0,o,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,s===!1&&i.onStart!==void 0&&i.onStart(u,r,a),s=!0},this.itemEnd=function(u){r++,i.onProgress!==void 0&&i.onProgress(u,r,a),r===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(u){i.onError!==void 0&&i.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),o?o(u):u},this.setURLModifier=function(u){return o=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],p=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},jh=new Kr,Et=class{constructor(e){this.manager=e!==void 0?e:jh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Et.DEFAULT_MATERIAL_NAME="__DEFAULT";var Bt={},bl=class extends Error{constructor(e,t){super(e),this.response=t}},Ii=class extends Et{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=wt.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0);return}if(Bt[e]!==void 0){Bt[e].push({onLoad:t,onProgress:n,onError:i});return}Bt[e]=[],Bt[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,o=this.responseType;fetch(r).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&be("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Bt[e],h=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0,m=0,g=new ReadableStream({start(b){v();function v(){h.read().then(({done:y,value:_})=>{if(y)b.close();else{m+=_.byteLength;let S=new ProgressEvent("progress",{lengthComputable:p,loaded:m,total:f});for(let E=0,C=u.length;E<C;E++){let A=u[E];A.onProgress&&A.onProgress(S)}b.enqueue(_),v()}},y=>{b.error(y)})}}});return new Response(g)}else throw new bl(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(o){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{wt.add(`file:${e}`,c);let u=Bt[e];delete Bt[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=Bt[e];if(u===void 0)throw this.manager.itemError(e),c;delete Bt[e];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var vi=new WeakMap,jr=class extends Et{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=wt.get(`image:${e}`);if(r!==void 0){if(r.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);else{let h=vi.get(r);h===void 0&&(h=[],vi.set(r,h)),h.push({onLoad:t,onError:i})}return r}let a=Br("img");function o(){u(),t&&t(this);let h=vi.get(this)||[];for(let d=0;d<h.length;d++){let f=h[d];f.onLoad&&f.onLoad(this)}vi.delete(this),s.manager.itemEnd(e)}function c(h){u(),i&&i(h),wt.remove(`image:${e}`);let d=vi.get(this)||[];for(let f=0;f<d.length;f++){let p=d[f];p.onError&&p.onError(h)}vi.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",o,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",o,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),wt.add(`image:${e}`,a),s.manager.itemStart(e),a.src=e,a}};var ys=class extends Et{constructor(e){super(e)}load(e,t,n,i){let s=new rt,r=new jr(this.manager);return r.setCrossOrigin(this.crossOrigin),r.setPath(this.path),r.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}},Vn=class extends Ae{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new L(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}};var il=new F,Mh=new M,wh=new M,Pi=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.mapType=Kn,this.map=null,this.mapPass=null,this.matrix=new F,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xt,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new qe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Mh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Mh),wh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){il.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(il,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,a=i?i.w/s.y:1,o=i?i.x/s.x:0,c=i?i.y/s.y:0;e.coordinateSystem===us||e.reversedDepth?t.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*r,0,0,.5*r+o,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(il)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Pr=new M,Lr=new K,yt=new M,Ms=class extends Ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new F,this.projectionMatrix=new F,this.projectionMatrixInverse=new F,this.coordinateSystem=zt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Pr,Lr,yt),yt.x===1&&yt.y===1&&yt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pr,Lr,yt.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Pr,Lr,yt),yt.x===1&&yt.y===1&&yt.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Pr,Lr,yt.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},an=new M,Sh=new B,Ah=new B,Wn=class extends Ms{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ai*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(as*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ai*2*Math.atan(Math.tan(as*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){an.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(an.x,an.y).multiplyScalar(-e/an.z),an.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(an.x,an.y).multiplyScalar(-e/an.z)}getViewSize(e,t){return this.getViewBounds(e,Sh,Ah),t.subVectors(Ah,Sh)}setViewOffset(e,t,n,i,s,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(as*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let o=r.fullWidth,c=r.fullHeight;s+=r.offsetX*i/o,t-=r.offsetY*n/c,i*=r.width/o,n*=r.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},vl=class extends Pi{constructor(){super(new Wn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Ai*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Xn=class extends Vn{constructor(e,t,n=0,i=Math.PI/3,s=0,r=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.distance=n,this.angle=i,this.penumbra=s,this.decay=r,this.map=null,this.shadow=new vl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},_l=class extends Pi{constructor(){super(new Wn(90,1,.5,500)),this.isPointLightShadow=!0}},qn=class extends Vn{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new _l}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Li=class extends Ms{constructor(e=-1,t=1,n=1,i=-1,s=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,r=s+c*this.view.width,a-=u*this.view.offsetY,o=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},yl=class extends Pi{constructor(){super(new Li(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ws=class extends Vn{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.shadow=new yl}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ss=class extends Vn{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var Jt=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var sl=new WeakMap,As=class extends Et{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&be("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&be("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let s=this,r=wt.get(`image-bitmap:${e}`);if(r!==void 0){if(s.manager.itemStart(e),r.then){r.then(c=>{sl.has(r)===!0?(i&&i(sl.get(r)),s.manager.itemError(e),s.manager.itemEnd(e)):(t&&t(c),s.manager.itemEnd(e))});return}setTimeout(function(){t&&t(r),s.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return wt.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),sl.set(o,c),wt.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});wt.add(`image-bitmap:${e}`,o),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Jr=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,s,r;switch(t){case"quaternion":i=this._slerp,s=this._slerpAdditive,r=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,r=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,r=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=r,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,s=e*i+i,r=this.cumulativeWeight;if(r===0){for(let a=0;a!==i;++a)n[s+a]=n[a];r=t}else{r+=t;let a=t/r;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=r}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,s=this.cumulativeWeight,r=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let o=t*this._origIndex;this._mixBufferRegion(n,i,o,1-s,t)}r>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let o=t,c=t+t;o!==c;++o)if(n[o]!==n[o+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let s=n,r=i;s!==r;++s)t[s]=t[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,s){if(i>=.5)for(let r=0;r!==s;++r)e[t+r]=e[n+r]}_slerp(e,t,n,i){K.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,s){let r=this._workIndex*s;K.multiplyQuaternionsFlat(e,r,e,t,e,n),K.slerpFlat(e,t,e,t,e,r,i)}_lerp(e,t,n,i,s){let r=1-i;for(let a=0;a!==s;++a){let o=t+a;e[o]=e[o]*r+e[n+a]*i}}_lerpAdditive(e,t,n,i,s){for(let r=0;r!==s;++r){let a=t+r;e[a]=e[a]+e[n+r]*i}}},Yl="\\[\\]\\.:\\/",Wm=new RegExp("["+Yl+"]","g"),Zl="[^"+Yl+"]",Xm="[^"+Yl.replace("\\.","")+"]",qm=/((?:WC+[\/:])*)/.source.replace("WC",Zl),Ym=/(WCOD+)?/.source.replace("WCOD",Xm),Zm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zl),Km=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zl),jm=new RegExp("^"+qm+Ym+Zm+Km+"$"),Jm=["material","materials","bones","map"],Ml=class{constructor(e,t,n){let i=n||ve.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ve=class l{constructor(e,t,n){this.path=t,this.parsedPath=n||l.parseTrackName(t),this.node=l.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new l.Composite(e,t,n):new l(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Wm,"")}static parseTrackName(e){let t=jm.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);Jm.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let a=s[r];if(a.name===t||a.uuid===t)return a;let o=n(a.children);if(o)return o}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,s=t.propertyIndex;if(e||(e=l.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){be("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Se("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Se("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Se("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Se("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Se("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let r=e[i];if(r===void 0){let c=t.nodeName;Se("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}o=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else r.fromArray!==void 0&&r.toArray!==void 0?(o=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(o=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ve.Composite=Ml;ve.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ve.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ve.prototype.GetterByBindingType=[ve.prototype._getValue_direct,ve.prototype._getValue_array,ve.prototype._getValue_arrayElement,ve.prototype._getValue_toArray];ve.prototype.SetterByBindingTypeAndVersioning=[[ve.prototype._setValue_direct,ve.prototype._setValue_direct_setNeedsUpdate,ve.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_array,ve.prototype._setValue_array_setNeedsUpdate,ve.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_arrayElement,ve.prototype._setValue_arrayElement_setNeedsUpdate,ve.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_fromArray,ve.prototype._setValue_fromArray_setNeedsUpdate,ve.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var $r=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let s=t.tracks,r=s.length,a=new Array(r),o={endingStart:On,endingEnd:On};for(let c=0;c!==r;++c){let u=s[c].createInterpolant(null);a[c]=u,u.settings=o}this._interpolantSettings=o,this._interpolants=a,this._propertyBindings=new Array(r),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Hh,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,s=e._clip.duration,r=s/i,a=i/s;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,r,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,s=i.time,r=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let o=a.parameterPositions,c=a.sampleValues;return o[0]=s,o[1]=s+n,c[0]=e/r,c[1]=t/r,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let s=this._startTime;if(s!==null){let o=(e-s)*n;o<0||n===0?t=0:(this._startTime=null,t=n*o)}t*=this._updateTimeScale(e);let r=this._updateTime(t),a=this._updateWeight(e);if(a>0){let o=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Wh:for(let u=0,h=o.length;u!==h;++u)o[u].evaluate(r),c[u].accumulateAdditive(a);break;case ia:default:for(let u=0,h=o.length;u!==h;++u)o[u].evaluate(r),c[u].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,s=this._loopCount,r=n===Vh;if(e===0)return s===-1?i:r&&(s&1)===1?t-i:i;if(n===Gh){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,r)):this._setEndings(this.repetitions===0,!0,r)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,s+=Math.abs(a);let o=this.repetitions-s;if(o<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(o===1){let c=e<0;this._setEndings(c,!c,r)}else this._setEndings(!1,!1,r);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this._loopCount=s,this.time=i;if(r&&(s&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=Fn,i.endingEnd=Fn):(e?i.endingStart=this.zeroSlopeAtStart?Fn:On:i.endingStart=cs,t?i.endingEnd=this.zeroSlopeAtEnd?Fn:On:i.endingEnd=cs)}_scheduleFading(e,t,n){let i=this._mixer,s=i.time,r=this._weightInterpolant;r===null&&(r=i._lendControlInterpolant(),this._weightInterpolant=r);let a=r.parameterPositions,o=r.sampleValues;return a[0]=s,o[0]=t,a[1]=s+e,o[1]=n,this}},$m=new Float32Array(1),Ts=class extends Wt{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,s=i.length,r=e._propertyBindings,a=e._interpolants,o=n.uuid,c=this._bindingsByRootAndName,u=c[o];u===void 0&&(u={},c[o]=u);for(let h=0;h!==s;++h){let d=i[h],f=d.name,p=u[f];if(p!==void 0)++p.referenceCount,r[h]=p;else{if(p=r[h],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,o,f));continue}let m=t&&t._propertyBindings[h].binding.parsedPath;p=new Jr(ve.create(n,f,m),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,o,f),r[h]=p}a[h].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,s=this._actionsByClip[i];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,s=this._actionsByClip,r=s[t];if(r===void 0)r={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=r;else{let a=r.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),r.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let s=e._clip.uuid,r=this._actionsByClip,a=r[s],o=a.knownActions,c=o[o.length-1],u=e._byClipCacheIndex;c._byClipCacheIndex=u,o[u]=c,o.pop(),e._byClipCacheIndex=null;let h=a.actionByRoot,d=(e._localRoot||this._root).uuid;delete h[d],o.length===0&&delete r[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let s=t[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,s=this._bindings,r=i[t];r===void 0&&(r={},i[t]=r),r[n]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,s=n.path,r=this._bindingsByRootAndName,a=r[i],o=t[t.length-1],c=e._cacheIndex;o._cacheIndex=c,t[c]=o,t.pop(),delete a[s],Object.keys(a).length===0&&delete r[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,s=t[i];e._cacheIndex=i,t[i]=e,s._cacheIndex=n,t[n]=s}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new vs(new Float32Array(2),new Float32Array(2),1,$m),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,s=t[i];e.__cacheIndex=i,t[i]=e,s.__cacheIndex=n,t[n]=s}clipAction(e,t,n){let i=t||this._root,s=i.uuid,r=typeof e=="string"?Hn.findByName(i,e):e,a=r!==null?r.uuid:e,o=this._actionsByClip[a],c=null;if(n===void 0&&(r!==null?n=r.blendMode:n=ia),o!==void 0){let h=o.actionByRoot[s];if(h!==void 0&&h.blendMode===n)return h;c=o.knownActions[0],r===null&&(r=c._clip)}if(r===null)return null;let u=new $r(this,r,t,n);return this._bindAction(u,c),this._addInactiveAction(u,a,s),u}existingAction(e,t){let n=t||this._root,i=n.uuid,s=typeof e=="string"?Hn.findByName(n,e):e,r=s?s.uuid:e,a=this._actionsByClip[r];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,s=Math.sign(e),r=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,s,r);let a=this._bindings,o=this._nActiveBindings;for(let c=0;c!==o;++c)a[c].apply(r);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let r=s.knownActions;for(let a=0,o=r.length;a!==o;++a){let c=r[a];this._deactivateAction(c);let u=c._cacheIndex,h=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,h._cacheIndex=u,t[u]=h,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let r in n){let a=n[r].actionByRoot,o=a[t];o!==void 0&&(this._deactivateAction(o),this._removeInactiveAction(o))}let i=this._bindingsByRootAndName,s=i[t];if(s!==void 0)for(let r in s){let a=s[r];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Th=new F,Es=class{constructor(e,t,n=0,i=1/0){this.ray=new cn(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new hs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Se("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Th.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Th),this}intersectObject(e,t=!0,n=[]){return wl(e,this,n,t),n.sort(Eh),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)wl(e[i],this,n,t);return n.sort(Eh),n}};function Eh(l,e){return l.distance-e.distance}function wl(l,e,t,n){let i=!0;if(l.layers.test(e.layers)&&l.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let s=l.children;for(let r=0,a=s.length;r<a;r++)wl(s[r],e,t,!0)}}var Ql=class Ql{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}};Ql.prototype.isMatrix2=!0;var Sl=Ql;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");var Qm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,e0=`#ifdef USE_ALPHAHASH
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
#endif`,t0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,n0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,i0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,s0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,r0=`#ifdef USE_AOMAP
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
#endif`,a0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,o0=`#ifdef USE_BATCHING
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
#endif`,l0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,c0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,u0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,h0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,d0=`#ifdef USE_IRIDESCENCE
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
#endif`,f0=`#ifdef USE_BUMPMAP
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
#endif`,p0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,m0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,g0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,b0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,v0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,_0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,y0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,M0=`#define PI 3.141592653589793
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
} // validated`,w0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,S0=`vec3 transformedNormal = objectNormal;
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
#endif`,A0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,T0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,E0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,R0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,C0="gl_FragColor = linearToOutputTexel( gl_FragColor );",I0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,P0=`#ifdef USE_ENVMAP
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
#endif`,L0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,D0=`#ifdef USE_ENVMAP
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
#endif`,N0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,O0=`#ifdef USE_ENVMAP
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
#endif`,F0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,U0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,B0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,k0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,z0=`#ifdef USE_GRADIENTMAP
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
}`,G0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,H0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,V0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,W0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,X0=`#ifdef USE_ENVMAP
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
#endif`,q0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Z0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,K0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,j0=`PhysicalMaterial material;
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
#endif`,J0=`uniform sampler2D dfgLUT;
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
}`,$0=`
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
#endif`,Q0=`#if defined( RE_IndirectDiffuse )
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
#endif`,eg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,tg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,ng=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ig=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ag=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,og=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cg=`#if defined( USE_POINTS_UV )
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
#endif`,ug=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,pg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mg=`#ifdef USE_MORPHTARGETS
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
#endif`,gg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,bg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,vg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Mg=`#ifdef USE_NORMALMAP
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
#endif`,wg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ag=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Tg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Eg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Cg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ig=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Pg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ng=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Og=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ug=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Bg=`float getShadowMask() {
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
}`,kg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zg=`#ifdef USE_SKINNING
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
#endif`,Gg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Hg=`#ifdef USE_SKINNING
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
#endif`,Vg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Yg=`#ifdef USE_TRANSMISSION
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
#endif`,Zg=`#ifdef USE_TRANSMISSION
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
#endif`,Kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$g=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Qg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ex=`uniform sampler2D t2D;
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
}`,tx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nx=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ix=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rx=`#include <common>
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
}`,ax=`#if DEPTH_PACKING == 3200
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
}`,ox=`#define DISTANCE
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
}`,lx=`#define DISTANCE
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
}`,cx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ux=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hx=`uniform float scale;
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
}`,dx=`uniform vec3 diffuse;
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
}`,fx=`#include <common>
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
}`,px=`uniform vec3 diffuse;
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
}`,mx=`#define LAMBERT
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
}`,gx=`#define LAMBERT
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
}`,xx=`#define MATCAP
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
}`,bx=`#define MATCAP
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
}`,vx=`#define NORMAL
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
}`,_x=`#define NORMAL
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
}`,yx=`#define PHONG
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
}`,Mx=`#define PHONG
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
}`,wx=`#define STANDARD
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
}`,Sx=`#define STANDARD
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
}`,Ax=`#define TOON
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
}`,Tx=`#define TOON
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
}`,Ex=`uniform float size;
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
}`,Rx=`uniform vec3 diffuse;
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
}`,Cx=`#include <common>
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
}`,Ix=`uniform vec3 color;
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
}`,Px=`uniform float rotation;
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
}`,Lx=`uniform vec3 diffuse;
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
}`,le={alphahash_fragment:Qm,alphahash_pars_fragment:e0,alphamap_fragment:t0,alphamap_pars_fragment:n0,alphatest_fragment:i0,alphatest_pars_fragment:s0,aomap_fragment:r0,aomap_pars_fragment:a0,batching_pars_vertex:o0,batching_vertex:l0,begin_vertex:c0,beginnormal_vertex:u0,bsdfs:h0,iridescence_fragment:d0,bumpmap_pars_fragment:f0,clipping_planes_fragment:p0,clipping_planes_pars_fragment:m0,clipping_planes_pars_vertex:g0,clipping_planes_vertex:x0,color_fragment:b0,color_pars_fragment:v0,color_pars_vertex:_0,color_vertex:y0,common:M0,cube_uv_reflection_fragment:w0,defaultnormal_vertex:S0,displacementmap_pars_vertex:A0,displacementmap_vertex:T0,emissivemap_fragment:E0,emissivemap_pars_fragment:R0,colorspace_fragment:C0,colorspace_pars_fragment:I0,envmap_fragment:P0,envmap_common_pars_fragment:L0,envmap_pars_fragment:D0,envmap_pars_vertex:N0,envmap_physical_pars_fragment:X0,envmap_vertex:O0,fog_vertex:F0,fog_pars_vertex:U0,fog_fragment:B0,fog_pars_fragment:k0,gradientmap_pars_fragment:z0,lightmap_pars_fragment:G0,lights_lambert_fragment:H0,lights_lambert_pars_fragment:V0,lights_pars_begin:W0,lights_toon_fragment:q0,lights_toon_pars_fragment:Y0,lights_phong_fragment:Z0,lights_phong_pars_fragment:K0,lights_physical_fragment:j0,lights_physical_pars_fragment:J0,lights_fragment_begin:$0,lights_fragment_maps:Q0,lights_fragment_end:eg,lightprobes_pars_fragment:tg,logdepthbuf_fragment:ng,logdepthbuf_pars_fragment:ig,logdepthbuf_pars_vertex:sg,logdepthbuf_vertex:rg,map_fragment:ag,map_pars_fragment:og,map_particle_fragment:lg,map_particle_pars_fragment:cg,metalnessmap_fragment:ug,metalnessmap_pars_fragment:hg,morphinstance_vertex:dg,morphcolor_vertex:fg,morphnormal_vertex:pg,morphtarget_pars_vertex:mg,morphtarget_vertex:gg,normal_fragment_begin:xg,normal_fragment_maps:bg,normal_pars_fragment:vg,normal_pars_vertex:_g,normal_vertex:yg,normalmap_pars_fragment:Mg,clearcoat_normal_fragment_begin:wg,clearcoat_normal_fragment_maps:Sg,clearcoat_pars_fragment:Ag,iridescence_pars_fragment:Tg,opaque_fragment:Eg,packing:Rg,premultiplied_alpha_fragment:Cg,project_vertex:Ig,dithering_fragment:Pg,dithering_pars_fragment:Lg,roughnessmap_fragment:Dg,roughnessmap_pars_fragment:Ng,shadowmap_pars_fragment:Og,shadowmap_pars_vertex:Fg,shadowmap_vertex:Ug,shadowmask_pars_fragment:Bg,skinbase_vertex:kg,skinning_pars_vertex:zg,skinning_vertex:Gg,skinnormal_vertex:Hg,specularmap_fragment:Vg,specularmap_pars_fragment:Wg,tonemapping_fragment:Xg,tonemapping_pars_fragment:qg,transmission_fragment:Yg,transmission_pars_fragment:Zg,uv_pars_fragment:Kg,uv_pars_vertex:jg,uv_vertex:Jg,worldpos_vertex:$g,background_vert:Qg,background_frag:ex,backgroundCube_vert:tx,backgroundCube_frag:nx,cube_vert:ix,cube_frag:sx,depth_vert:rx,depth_frag:ax,distance_vert:ox,distance_frag:lx,equirect_vert:cx,equirect_frag:ux,linedashed_vert:hx,linedashed_frag:dx,meshbasic_vert:fx,meshbasic_frag:px,meshlambert_vert:mx,meshlambert_frag:gx,meshmatcap_vert:xx,meshmatcap_frag:bx,meshnormal_vert:vx,meshnormal_frag:_x,meshphong_vert:yx,meshphong_frag:Mx,meshphysical_vert:wx,meshphysical_frag:Sx,meshtoon_vert:Ax,meshtoon_frag:Tx,points_vert:Ex,points_frag:Rx,shadow_vert:Cx,shadow_frag:Ix,sprite_vert:Px,sprite_frag:Lx},G={common:{diffuse:{value:new L(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new L(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new M},probesMax:{value:new M},probesResolution:{value:new M}},points:{diffuse:{value:new L(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new L(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},Jh={basic:{uniforms:Ye([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.fog]),vertexShader:le.meshbasic_vert,fragmentShader:le.meshbasic_frag},lambert:{uniforms:Ye([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new L(0)},envMapIntensity:{value:1}}]),vertexShader:le.meshlambert_vert,fragmentShader:le.meshlambert_frag},phong:{uniforms:Ye([G.common,G.specularmap,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.fog,G.lights,{emissive:{value:new L(0)},specular:{value:new L(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:le.meshphong_vert,fragmentShader:le.meshphong_frag},standard:{uniforms:Ye([G.common,G.envmap,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.roughnessmap,G.metalnessmap,G.fog,G.lights,{emissive:{value:new L(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:le.meshphysical_vert,fragmentShader:le.meshphysical_frag},toon:{uniforms:Ye([G.common,G.aomap,G.lightmap,G.emissivemap,G.bumpmap,G.normalmap,G.displacementmap,G.gradientmap,G.fog,G.lights,{emissive:{value:new L(0)}}]),vertexShader:le.meshtoon_vert,fragmentShader:le.meshtoon_frag},matcap:{uniforms:Ye([G.common,G.bumpmap,G.normalmap,G.displacementmap,G.fog,{matcap:{value:null}}]),vertexShader:le.meshmatcap_vert,fragmentShader:le.meshmatcap_frag},points:{uniforms:Ye([G.points,G.fog]),vertexShader:le.points_vert,fragmentShader:le.points_frag},dashed:{uniforms:Ye([G.common,G.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:le.linedashed_vert,fragmentShader:le.linedashed_frag},depth:{uniforms:Ye([G.common,G.displacementmap]),vertexShader:le.depth_vert,fragmentShader:le.depth_frag},normal:{uniforms:Ye([G.common,G.bumpmap,G.normalmap,G.displacementmap,{opacity:{value:1}}]),vertexShader:le.meshnormal_vert,fragmentShader:le.meshnormal_frag},sprite:{uniforms:Ye([G.sprite,G.fog]),vertexShader:le.sprite_vert,fragmentShader:le.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:le.background_vert,fragmentShader:le.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:le.backgroundCube_vert,fragmentShader:le.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:le.cube_vert,fragmentShader:le.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:le.equirect_vert,fragmentShader:le.equirect_frag},distance:{uniforms:Ye([G.common,G.displacementmap,{referencePosition:{value:new M},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:le.distance_vert,fragmentShader:le.distance_frag},shadow:{uniforms:Ye([G.lights,G.fog,{color:{value:new L(0)},opacity:{value:1}}]),vertexShader:le.shadow_vert,fragmentShader:le.shadow_frag}};Jh.physical={uniforms:Ye([Jh.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new L(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new L(0)},specularColor:{value:new L(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:le.meshphysical_vert,fragmentShader:le.meshphysical_frag};var Dx=new te;Dx.set(-1,0,0,0,1,0,0,0,1);var w2={[Rl]:"LINEAR_TONE_MAPPING",[Cl]:"REINHARD_TONE_MAPPING",[Il]:"CINEON_TONE_MAPPING",[Pl]:"ACES_FILMIC_TONE_MAPPING",[Dl]:"AGX_TONE_MAPPING",[Nl]:"NEUTRAL_TONE_MAPPING",[Ll]:"CUSTOM_TONE_MAPPING"};var S2=new Float32Array(16),A2=new Float32Array(9),T2=new Float32Array(4);var E2={[Rl]:"Linear",[Cl]:"Reinhard",[Il]:"Cineon",[Pl]:"ACESFilmic",[Dl]:"AgX",[Nl]:"Neutral",[Ll]:"Custom"};var R2={[Rh]:"SHADOWMAP_TYPE_PCF",[Ch]:"SHADOWMAP_TYPE_VSM"};var C2={[Fh]:"ENVMAP_TYPE_CUBE",[Fl]:"ENVMAP_TYPE_CUBE",[Uh]:"ENVMAP_TYPE_CUBE_UV"};var I2={[Fl]:"ENVMAP_MODE_REFRACTION"};var P2={[na]:"ENVMAP_BLENDING_MULTIPLY",[Dh]:"ENVMAP_BLENDING_MIX",[Nh]:"ENVMAP_BLENDING_ADD"};var Nx=new te;Nx.set(-1,0,0,0,1,0,0,0,1);var L2=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);var ec=Math.PI/180,$h=12.5*ec,Qh=0,Ox=12.5/24,lt=(l,e,t)=>{let n=Math.max(0,Math.min(1,(t-l)/(e-l)));return n*n*(3-2*n)};var Fx=[[-18,.006,.011,.034],[-12,.008,.016,.05],[-8,.013,.028,.085],[-5,.022,.05,.14],[-2,.04,.085,.22],[0,.055,.12,.29],[3,.065,.15,.37],[7,.07,.165,.43],[15,.075,.18,.46],[30,.074,.18,.48],[90,.07,.175,.49]],Ux=[[-18,.03,.042,.085],[-12,.045,.05,.095],[-8,.14,.085,.1],[-5,.42,.19,.1],[-2,.78,.34,.12],[0,.95,.46,.18],[3,.98,.6,.32],[7,.82,.66,.5],[15,.6,.64,.7],[30,.5,.58,.7],[90,.46,.55,.69]],Bx=[[-18,.03,.042,.085],[-12,.04,.05,.1],[-8,.06,.075,.15],[-5,.11,.12,.21],[-2,.2,.18,.27],[0,.29,.27,.34],[3,.35,.37,.46],[7,.37,.43,.54],[15,.4,.49,.63],[30,.4,.5,.65],[90,.42,.52,.67]],kx=[[-12,0,0,0],[-8,.08,.035,.02],[-5,.25,.1,.035],[-2,.42,.18,.05],[0,.55,.26,.07],[3,.55,.32,.12],[7,.45,.33,.18],[15,.34,.3,.24],[30,.28,.27,.24],[90,.26,.26,.24]],zx=[[-10,0,0,0],[-6,.05,.03,.05],[-3,.13,.065,.09],[0,.11,.055,.07],[4,.03,.015,.015],[8,0,0,0]],Gx=[[-18,.03,.036,.06],[-12,.04,.045,.075],[-8,.1,.075,.11],[-5,.38,.2,.21],[-2,.82,.38,.24],[0,1,.52,.3],[3,1.02,.7,.46],[7,1,.84,.68],[15,1,.97,.92],[30,1,1,.99],[90,1,1,1]],Hx=[[-18,.012,.018,.042],[-12,.016,.024,.055],[-8,.03,.036,.075],[-5,.06,.055,.1],[-2,.11,.085,.13],[0,.18,.14,.19],[3,.27,.23,.28],[7,.36,.35,.41],[15,.42,.46,.55],[30,.46,.5,.6],[90,.48,.52,.62]],Vx=[[-1.2,0,0,0],[0,2.4,.7,.2],[3,5,2.4,.9],[8,8,5.6,3.4],[20,12,11,9.2],[90,14,13.4,12.4]],Wx=[[-2,1,.36,.14],[0,1,.45,.2],[3,1,.58,.32],[8,1,.72,.48],[15,1,.81,.6],[25,1,.86,.68],[40,1,.9,.74]];function Qt(l,e,t){if(e<=l[0][0])return t.setRGB(l[0][1],l[0][2],l[0][3]);for(let i=1;i<l.length;i++){let s=l[i];if(e<=s[0]){let r=l[i-1],a=(e-r[0])/(s[0]-r[0]);return t.setRGB(r[1]+(s[1]-r[1])*a,r[2]+(s[2]-r[2])*a,r[3]+(s[3]-r[3])*a)}}let n=l[l.length-1];return t.setRGB(n[1],n[2],n[3])}function tc(){return{t:0,elev:0,elevDeg:0,east:0,north:0,up:1,day:1,night:0,stars:0,sunK:1,moonK:0,skyK:1,dusk:0,zenith:new L,horSun:new L,horAnti:new L,glow:new L,belt:new L,cloudLit:new L,cloudShade:new L,disc:new L,light:new L,fog:new L}}function ed(l,e=tc()){let t=(l%1+1)%1,n=(t-Ox)*Math.PI*2,i=Math.cos(Qh),s=Math.sin(Qh),r=Math.cos($h),a=Math.sin($h);e.east=-i*Math.sin(n),e.north=r*s-a*i*Math.cos(n),e.up=a*s+r*i*Math.cos(n),e.elev=e.up;let o=e.elevDeg=Math.asin(Math.max(-1,Math.min(1,e.up)))/ec;e.t=t,e.day=lt(-9,4,o),e.night=1-e.day,e.stars=1-lt(-14,-6,o);let c=1/(Math.max(0,Math.sin(Math.max(o,0)*ec))+.50572*Math.pow(Math.max(o,0)+6.07995,-1.6364));return e.sunK=Math.exp(-.11*(c-1))*lt(-1.5,4,o),e.moonK=1-lt(-12,-3,o),e.skyK=lt(-10,12,o),e.dusk=lt(-10,-1,o)*(1-lt(4,16,o)),Qt(Fx,o,e.zenith),Qt(Ux,o,e.horSun),Qt(Bx,o,e.horAnti),Qt(kx,o,e.glow),Qt(zx,o,e.belt),Qt(Gx,o,e.cloudLit),Qt(Hx,o,e.cloudShade),Qt(Vx,o,e.disc),Qt(Wx,o,e.light),e.fog.copy(e.horAnti).lerp(e.horSun,.3),e}var Ne={value:0},jn={value:0},ra={value:0};function Xx(l=256){let e=49734321,t=()=>(e=e*1664525+1013904223>>>0,e/4294967296),n=c=>{let u=new Float32Array(c*c);for(let h=0;h<u.length;h++)u[h]=t();return u},i=c=>{let u=c.map(n),h=new Float32Array(l*l),d=1e9,f=-1e9;for(let p=0;p<l;p++)for(let m=0;m<l;m++){let g=0,b=.5,v=0;for(let y=0;y<c.length;y++){let _=c[y],S=u[y],E=m/l*_,C=p/l*_,A=Math.floor(E),R=Math.floor(C),P=E-A,I=C-R;P=P*P*(3-2*P),I=I*I*(3-2*I);let D=A%_,N=R%_,O=(A+1)%_,U=(R+1)%_,V=S[N*_+D],Z=S[N*_+O],Y=S[U*_+D],ee=S[U*_+O];g+=b*((V+(Z-V)*P)*(1-I)+(Y+(ee-Y)*P)*I),v+=b,b*=.5}g/=v,h[p*l+m]=g,g<d&&(d=g),g>f&&(f=g)}for(let p=0;p<h.length;p++)h[p]=(h[p]-d)/(f-d);return h},s=i([5,10,20,40,80]),r=i([16,32,64,128]),a=new Uint8Array(l*l*4);for(let c=0;c<l*l;c++)a[c*4]=s[c]*255,a[c*4+1]=r[c]*255,a[c*4+2]=0,a[c*4+3]=255;let o=new st(a,l,l,Vt,Kn);return o.wrapS=o.wrapT=Ht,o.magFilter=$t,o.minFilter=Zn,o.generateMipmaps=!0,o.needsUpdate=!0,o}function td(){let l={uSun:{value:new M(0,1,0)},uMoon:{value:new M(0,1,0)},uSunXZ:{value:new B(1,0)},uCam:{value:new M},uZen:{value:new L},uHorS:{value:new L},uHorA:{value:new L},uGlow:{value:new L},uBelt:{value:new L},uDisc:{value:new L},uCLit:{value:new L},uCShade:{value:new L},uFog:{value:new L},uWind:{value:new qe},uCover:{value:.58},uCloudAmt:{value:1},uMoonI:{value:0}},e=new bt({uniforms:{...l,uNight:Ne,uStars:ra,uTime:jn,uNoise:{value:Xx()}},side:ea,depthWrite:!1,transparent:!0,blending:Al,fog:!1,vertexShader:`
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
      }`}),t=new k(new Be(1,32,16),e);return t.frustumCulled=!1,t.renderOrder=-1e3,t.name="aw:sky",t.matrixAutoUpdate=!0,{mesh:t,u:l}}var qx=new L(14017279),Yx=new L(2770032),Zx=new L(11569752),Kx=new L(9348300),jx=new L(16764836),Jx=new L(10334430),$x=new L(3820134),nd=24,Qx=new L,aa=l=>l-Math.floor(l);function nc(l,e){if(l.y>=e)return l;let t=Math.hypot(l.x,l.z)||1,n=Math.sqrt(1-e*e)/t;return l.set(l.x*n,e,l.z*n)}var oa=class{constructor(e,t=!0){x(this,"g");x(this,"sky");x(this,"ambient");x(this,"sample",tc());x(this,"sunW",new M(0,1,0));x(this,"moonW",new M(0,1,0));x(this,"base");x(this,"ax",{ex:1,ez:0,nx:0,nz:-1});x(this,"wind",{x:0,z:0,qx:0,qz:0});x(this,"low");x(this,"disc");x(this,"clouds",[]);this.g=e;let n=e.real.sky,i=n.sunDir.clone().normalize();this.base={theta:n.theta,envAng0:Math.atan2(-i.z,i.x),sunColor:n.sun.color.clone(),sunI:n.sun.intensity,bounceSky:n.bounce.color.clone(),bounceGround:n.bounce.groundColor.clone(),bounceI:n.bounce.intensity,fog:n.fog.color.clone(),exposure:e.renderer.toneMappingExposure};let s=e.fromLL;if(s){let c=s(12.52,-70),u=s(12.52,-69.99),h=s(12.53,-70),d=Math.hypot(u.x-c.x,u.z-c.z)||1,f=Math.hypot(h.x-c.x,h.z-c.z)||1;this.ax={ex:(u.x-c.x)/d,ez:(u.z-c.z)/d,nx:(h.x-c.x)/f,nz:(h.z-c.z)/f}}let r=this.ax,a=-(.924*r.ex+.383*r.nx)*nd,o=-(.924*r.ez+.383*r.nz)*nd;this.wind={x:a/6e3,z:o/6e3,qx:(.8*a+.6*o)/2300,qz:(-.6*a+.8*o)/2300},this.low=e.real.q?.name==="low",this.disc=t?1:0,this.ambient=new Ss(9348300,0),this.ambient.name="aw:nightAmbient",e.scene.add(this.ambient),this.sky=td(),e.scene.add(this.sky.mesh);for(let c of e.scene.children){let u=c;u.isSprite&&u.material&&u.position.y>25&&u.scale.x>60&&this.clouds.push({m:u.material,c:u.material.color.clone(),o:u.material.opacity})}}apply(e){let t=this.g,n=t.real.sky,i=ed(e,this.sample),s=this.base,r=this.ax,a=this.low,o=i.night,c=i.elevDeg;Ne.value=o,ra.value=i.stars;let u=this.sunW.set(i.east*r.ex+i.north*r.nx,i.up,i.east*r.ez+i.north*r.nz).normalize(),h=nc(this.moonW.copy(u).negate(),.62),d=c>-2,f=n.sunDir;d?nc(f.copy(u),.07):nc(f.copy(h),.78);let p=s.theta+Math.atan2(-f.z,f.x)-s.envAng0;t.scene.environmentRotation.set(0,p,0),t.scene.backgroundRotation.set(0,p,0),t.scene.background&&(t.scene.background=null);let m=lt(.42,.75,o);d?(n.sun.color.copy(i.light).lerp(s.sunColor,lt(30,45,c)),n.sun.intensity=s.sunI*i.sunK):(n.sun.color.copy(qx),n.sun.intensity=s.sunI*(.32+.16*m)*i.moonK*(a?1.1:1)),n.bounce.color.copy(s.bounceSky).lerp(Yx,o),n.bounce.groundColor.copy(s.bounceGround).lerp(Zx,o),n.bounce.intensity=s.bounceI+((.55+.35*m)*(a?.72:1)-s.bounceI)*o;let g=i.dusk*(1-i.moonK);this.ambient.color.copy(jx).lerp(Jx,1-lt(-6,2,c)).lerp(Kx,i.moonK),this.ambient.intensity=.32*g*(a?.75:1)+(.55+.45*m)*(a?.5:1)*i.moonK;let b=a?.12:.22;t.scene.environmentIntensity=b+(1-b)*i.skyK,t.renderer.toneMappingExposure=s.exposure*(1+(a?.02:.14)*o)*(1+.1*i.dusk),n.fog.color.copy(i.fog).lerp(s.fog,.45*lt(12,30,c));let v=t.camera,y=this.sky.u;this.sky.mesh.position.copy(v.position),this.sky.mesh.scale.setScalar(v.far*.9),y.uSun.value.copy(u);let _=Math.hypot(u.x,u.z);_>1e-4&&y.uSunXZ.value.set(u.x/_,u.z/_),y.uMoon.value.copy(h),y.uMoonI.value=i.moonK,y.uCam.value.copy(v.position),y.uZen.value.copy(i.zenith),y.uHorS.value.copy(i.horSun),y.uHorA.value.copy(i.horAnti),y.uGlow.value.copy(i.glow),y.uBelt.value.copy(i.belt),y.uDisc.value.copy(i.disc).multiplyScalar(this.disc),y.uCLit.value.copy(i.cloudLit),y.uCShade.value.copy(i.cloudShade),y.uFog.value.copy(n.fog.color);let S=jn.value,E=this.wind;y.uWind.value.set(aa(E.x*S),aa(E.z*S),aa(E.qx*S),aa(E.qz*S)),y.uCloudAmt.value=1-.35*o;for(let C of this.clouds)C.m.color.copy(C.c).lerp(Qx.copy($x),o),C.m.opacity=C.o*(1-.6*o)}};function dn(l,e,t){let n=l;if(n.userData["aw:"+e])return;n.userData["aw:"+e]=!0;let i=n.onBeforeCompile,s=n.customProgramCacheKey?n.customProgramCacheKey.bind(n):()=>"";n.onBeforeCompile=(r,a)=>{i&&i.call(n,r,a),t(r)},n.customProgramCacheKey=()=>s()+"|aw-"+e,n.needsUpdate=!0}function eb(l){dn(l,"winglow-v1",e=>{e.fragmentShader.includes("float gMask = glass;")&&(e.uniforms.uAwNight=Ne,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
  if (uAwNight > 0.01) {
    float awB = floor(u / 3.6), awF = floor(v / max(fh, 0.5));
    float awR = rwH(vec2(awB * 3.1 + seed * 11.0, awF * 7.3 + 0.37));
    float awLit = step(0.6, awR); // ~40% of windows lit (r202: 50%)
    vec3 awWarm = mix(vec3(1.0, 0.6, 0.28), vec3(1.0, 0.86, 0.62), rwH(vec2(awR, seed + 0.5)));
    totalEmissiveRadiance += awWarm * gMask * awLit * smoothstep(0.3, 0.8, uAwNight) * (0.35 + 0.25 * awR); // owner: city too bright (r202 0.9, before 2.4)
  }`))})}function tb(l){dn(l,"herowin-v2",e=>{e.fragmentShader.includes("#include <emissivemap_fragment>")&&(e.uniforms.uAwNight=Ne,e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
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
  }`))})}var nb=new L(16763269),ib=new M,la=class{constructor(e){x(this,"g");x(this,"head");x(this,"headTarget");x(this,"pools",[]);x(this,"bulbMats",new Set);x(this,"bulbBase",new Map);x(this,"lampMeshes",new Set);x(this,"scanT",0);x(this,"heroGlow",new Map);x(this,"heroN",-1);x(this,"bump",[]);x(this,"poolT",0);x(this,"waterDone",new WeakSet);x(this,"waterSeen",new WeakSet);x(this,"waterTopN",-1);x(this,"waterT",0);this.g=e;let t=e.real;t.buildings?.wall&&eb(t.buildings.wall),this.head=new Xn(16773576,0,58,.95,.6,1),this.head.castShadow=!1,this.head.name="aw:headlight",this.headTarget=new Ae,this.head.target=this.headTarget,e.scene.add(this.head,this.headTarget);let i=(t.q?.name??"med")==="high"?4:0;for(let s=0;s<i;s++){let r=new qn(16757086,0,28,2);r.castShadow=!1,r.name="aw:lampPool",this.pools.push(r),e.scene.add(r)}}patchWaterMat(e){if(!e||Array.isArray(e)||this.waterDone.has(e))return;this.waterDone.add(e);let t=e.customProgramCacheKey?e.customProgramCacheKey():"";/\|water/.test(t)&&dn(e,"waternight-v1",n=>{n.fragmentShader.includes("diffuseColor = vec4(wc, a);")&&(n.uniforms.uAwNight=Ne,n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
uniform float uAwNight;`).replace("diffuseColor = vec4(wc, a);",`wc *= mix(1.0, 0.22, uAwNight); wc = mix(wc, wc * vec3(0.55, 0.75, 1.1), uAwNight * 0.5);
  diffuseColor = vec4(wc, a);`))})}patchWater(){let e=this.g.real;if(e.group.children.length!==this.waterTopN){this.waterTopN=e.group.children.length;for(let t of e.group.children){let n=t.material;t.isMesh&&this.patchWaterMat(n)}}for(let t of e.regions.values())t.wmat&&this.patchWaterMat(t.wmat),!(t.state!=="built"||!t.group||this.waterSeen.has(t.group))&&(this.waterSeen.add(t.group),t.group.traverse(n=>{n.isMesh&&this.patchWaterMat(n.material)}))}scan(){this.waterT++,this.patchWater(),this.g.real.veg.group.traverse(e=>{let t=e.material;!e.isMesh||!t||Array.isArray(t)||!t.emissive||(t.emissive.getHex()===5591884||this.bulbMats.has(t))&&(this.bulbMats.has(t)||(this.bulbMats.add(t),this.bulbBase.set(t,{e:t.emissive.clone(),i:t.emissiveIntensity})),e.isInstancedMesh&&this.lampMeshes.add(e))});for(let e of this.lampMeshes)e.parent||this.lampMeshes.delete(e);this.scanHero()}scanHero(){let e=this.g.real.hero?.group;if(!e)return;let t=0;e.traverse(()=>t++),t!==this.heroN&&(this.heroN=t,e.traverse(n=>{let i=n.material;if(!(!n.isMesh||!i))for(let s of Array.isArray(i)?i:[i]){if(!s||!s.emissive||this.heroGlow.has(s))continue;let r=s.name||"";/^l?(signglow|neon|bulb)/i.test(r)?this.heroGlow.set(s,s.emissiveIntensity||1):r==="sign"?this.heroGlow.set(s,-(s.emissiveIntensity||1)):/^(facade|ground)(_\d+)?$/.test(r)?(tb(s),this.bump.push(s)):r==="glass"&&(s.emissive.setHex(16763269),s.emissiveIntensity=0,this.heroGlow.set(s,0))}}))}carForward(e){let t=this.g.S.car.h;return e.set(-Math.sin(t),0,-Math.cos(t)),!0}update(e){let t=this.g,n=Ne.value;this.scanT-=e,this.scanT<=0&&(this.scanT=2,this.scan());let i=Math.max(0,Math.min(1,(n-.25)/.4));for(let o of this.bulbMats){let c=this.bulbBase.get(o);o.emissive.copy(c.e).lerp(nb,i),o.emissiveIntensity=c.i+i*2}if(this.bump.length){for(let o of this.bump)o.needsUpdate=!0;this.bump.length=0}for(let o of this.heroGlow.keys()){let c=this.heroGlow.get(o);o.emissiveIntensity=c>0?c*(.45+i*.95):c<0?-c*(1+i*.55):i*.16}let s=t.S,r=(s.mode==="car"||s.mode==="moto")&&n>.35,a=ib;if(r&&this.carForward(a)){let o=s.car,c=(o.y||0)+(s.mode==="moto"?.72:.62);this.head.position.set(o.x+a.x*2.2,c,o.z+a.z*2.2),this.headTarget.position.set(o.x+a.x*24,(o.y||0)+.2,o.z+a.z*24),this.headTarget.updateMatrixWorld(),this.head.intensity=14*n}else this.head.intensity=0;if(this.head.visible=n>.35,this.pools.length){if(this.poolT-=e,this.poolT<=0){this.poolT=.5;let o=t.camera.position,c=[],u=new F;for(let h of this.lampMeshes){let d=h.matrixWorld;for(let f=0;f<h.count;f++){h.getMatrixAt(f,u);let p=new M().setFromMatrixPosition(u).applyMatrix4(d),m=(p.x-o.x)**2+(p.z-o.z)**2;m>8100||c.push({d:m,p})}}c.sort((h,d)=>h.d-d.d),this.pools.forEach((h,d)=>{let f=c[d];f&&h.position.set(f.p.x,f.p.y+6.5,f.p.z),h.userData.has=!!f})}for(let o of this.pools)o.intensity=o.userData.has?n*12:0,o.visible=n>.3}}};var ca=[1,.9,.8,.7,.6],id=[1,.85,.75,.75,.75],sd=6,ua=class{constructor(e){x(this,"g");x(this,"enabled");x(this,"target");x(this,"level",0);x(this,"maxLevel",sd);x(this,"fps",60);x(this,"basePR");x(this,"acc",0);x(this,"frames",0);x(this,"lowFor",0);x(this,"highFor",0);x(this,"holdUp",0);x(this,"warm",4);x(this,"shadowTick",0);x(this,"stalls",0);x(this,"upAt",-1e9);x(this,"bounces",0);x(this,"floorUntil",0);x(this,"t",0);x(this,"phone",!1);x(this,"listeners",[]);this.g=e,this.basePR=e.renderer.getPixelRatio(),this.enabled=H.get("fpsguard")!=="0"&&localStorage.getItem("aw_fpsguard")!=="0";let t=e.real?.q?.name,n=+(H.get("fps")||0),i=!(matchMedia("(pointer: coarse)").matches||"ontouchstart"in window),s=t==="high";this.target=n>10?n:t==="low"?i?30:50:i&&s?57:50,this.maxLevel=i&&s?4:i?sd:5,this.phone=!i,document.addEventListener("visibilitychange",()=>{this.warm=2,this.acc=0,this.frames=0})}onChange(e){this.listeners.push(e)}setEnabled(e){this.enabled=e;try{localStorage.setItem("aw_fpsguard",e?"1":"0")}catch{}e||this.setLevel(0),this.listeners.forEach(t=>t())}setLevel(e){if(e=Math.max(0,Math.min(this.maxLevel,e)),e===this.level)return;let t=this.g,n=(this.phone?id:ca)[Math.min(e,ca.length-1)],i=window.__awPRCap||1/0,s=Math.max(.5,Math.min(this.basePR,i)*n);Math.abs(t.renderer.getPixelRatio()-s)>.001&&(t.renderer.setPixelRatio(s),window.dispatchEvent(new Event("resize")),window.__awPost?window.__awPost.render():t.renderer.render(t.scene,t.camera)),t.renderer.shadowMap.autoUpdate=e<5,e<5&&(t.renderer.shadowMap.needsUpdate=!0),window.__noPost=e>=6,this.level=e,this.listeners.forEach(r=>r())}frame(e){let t=this.g.renderer;if(this.level>=5&&++this.shadowTick%7===0&&(t.shadowMap.needsUpdate=!0),!this.enabled||document.hidden)return;if(this.t+=Math.min(e,1),e>1.5&&++this.stalls<3){this.warm=Math.max(this.warm,1);return}if(e<=1.5&&(this.stalls=0),this.warm>0){this.warm-=Math.max(0,e);return}if(this.acc+=e,this.frames++,this.acc<.5)return;this.fps=this.frames/this.acc;let n=this.acc;this.acc=0,this.frames=0,this.holdUp=Math.max(0,this.holdUp-n),this.fps<this.target-2?(this.lowFor+=n,this.highFor=0):this.fps>Math.min(this.target+8,58)?(this.highFor+=n,this.lowFor=0):(this.lowFor=0,this.highFor=0);let i=window.__awAhead,s=!!i&&Math.hypot(i[0],i[1])>25;this.lowFor>=(this.phone?3:1.5)&&this.level<this.maxLevel?(this.t-this.upAt<25&&++this.bounces>=2&&(this.floorUntil=this.t+600),this.setLevel(this.level+1),this.lowFor=0,this.warm=1,this.holdUp=15):this.highFor>=6&&this.level>0&&!(this.phone&&s)&&this.holdUp<=0&&this.t>this.floorUntil&&(this.setLevel(this.level-1),this.upAt=this.t,this.highFor=0,this.warm=1,this.holdUp=8)}describe(){if(!this.enabled)return"off";let e=(this.phone?id:ca)[Math.min(this.level,ca.length-1)],t=this.level>=6?" \xB7 post off":this.level>=5?" \xB7 lazy shadows":"";return`${Math.round(this.fps)} fps \xB7 target ${this.target} \xB7 scale ${Math.round(e*100)}%${t}`}};var ha=class{constructor(e){x(this,"g",e);x(this,"px",NaN);x(this,"pz",NaN);x(this,"vx",0);x(this,"vz",0)}frame(e){let t=this.g.camera.position;if(e>0&&e<.5&&Number.isFinite(this.px)){let o=Math.min(1,e*1.5);this.vx+=((t.x-this.px)/e-this.vx)*o,this.vz+=((t.z-this.pz)/e-this.vz)*o}this.px=t.x,this.pz=t.z;let n=this.vx*5,i=this.vz*5,s=Math.hypot(n,i);s>220&&(n*=220/s,i*=220/s);let r=window,a=r.__awAhead||(r.__awAhead=[0,0]);s<15?(a[0]=0,a[1]=0):(a[0]=n,a[1]=i)}};var sb=["map","normalMap","roughnessMap","metalnessMap","emissiveMap","aoMap","alphaMap","bumpMap","lightMap","specularMap","clearcoatNormalMap"],da=class{constructor(e,t,n=!0,i=!1){x(this,"g",e);x(this,"incremental",n);x(this,"preUpload",i);x(this,"on");x(this,"n",0);x(this,"t",1);x(this,"busy",!1);x(this,"seen",new WeakSet);x(this,"keys",new Set);x(this,"lightKey","");x(this,"seenTex",new WeakSet);x(this,"texQ",[]);x(this,"pend",[]);x(this,"inflight",0);x(this,"stats",{compiles:0,objs:0,reps:0,uploads:0});this.on=t}frame(e){if(!this.on)return;let t=this.g.renderer;if(t.shadowMap.autoUpdate=!1,(this.n++&1)===0&&(t.shadowMap.needsUpdate=!0),this.texQ.length&&this.upload(),(this.t-=e)>0&&!this.pend.length||!t.compileAsync)return;if(!this.incremental){if(this.busy)return;this.t=4,this.busy=!0,t.compileAsync(this.g.scene,this.g.camera).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.busy=!1});return}this.pend.length||(this.t=.5,this.pend=this.scan());let n=this.pend.splice(0,4).filter(s=>s.parent);if(!n.length)return;this.inflight++,this.stats.reps+=n.length;let i={traverse:s=>{for(let r of n)s(r)},traverseVisible:()=>{}};t.compileAsync(i,this.g.camera,this.g.scene).then(()=>{this.stats.compiles++},()=>{}).finally(()=>{this.inflight--})}pending(){return this.pend.length+this.inflight}upload(){let e=this.g.renderer,t=performance.now();for(let n=0;n<2&&this.texQ.length&&performance.now()-t<3;){let i=this.texQ.shift(),s=i.image;if(i.version===0||!s||s.complete===!1){this.texQ.length?this.texQ.push(i):this.seenTex.delete(i);break}e.properties.get(i).__version!==i.version&&(e.initTexture(i),n++,this.stats.uploads++)}}scan(){let e=[],t="",n=i=>{if(i.visible){i.isLight&&(t+=i.type+(i.castShadow?"s":"")+",");for(let s of i.children)n(s)}};return n(this.g.scene),t!==this.lightKey&&(this.lightKey=t,this.keys.clear(),this.seen=new WeakSet),this.g.scene.traverse(i=>{let s=i;if(this.seen.has(s)||!(s.isMesh||s.isPoints||s.isLine||s.isSprite)||!s.material)return;this.seen.add(s),this.stats.objs++;let r=s.geometry,a=r?r.attributes:{},o=Array.isArray(s.material)?s.material:[s.material],c=(s.isInstancedMesh?s.instanceColor?"I":"i":"")+(s.isBatchedMesh?s._colorsTexture?"B":"b":"")+(s.isSkinnedMesh?"s":"")+(s.receiveShadow?"r":"")+(a.color?"c":"")+(a.tangent?"t":"")+(a.uv1?"1":"")+(a.uv2?"2":"")+(r&&Object.keys(r.morphAttributes).length?"m":"")+s.type,u=!1;if(this.preUpload)for(let h of o)for(let d of sb){let f=h[d];f&&f.isTexture&&!f.isCubeTexture&&!this.seenTex.has(f)&&(this.seenTex.add(f),this.texQ.push(f))}for(let h of o){let d=h.id+":"+h.version+":"+c;this.keys.has(d)||(this.keys.add(d),u=!0)}u&&e.push(s)}),e}};function rb(l,e){let t=e&&e.length===l.length*10?e:new Float64Array(l.length*10);for(let n=0,i=0;n<l.length;n++,i+=10){let s=l[n],r=s.position,a=s.quaternion,o=s.scale;t[i]=r.x,t[i+1]=r.y,t[i+2]=r.z,t[i+3]=a.x,t[i+4]=a.y,t[i+5]=a.z,t[i+6]=a.w,t[i+7]=o.x,t[i+8]=o.y,t[i+9]=o.z}return t}function ic(l,e,t){let n=l.position,i=l.quaternion,s=l.scale;return e[t]===n.x&&e[t+1]===n.y&&e[t+2]===n.z&&e[t+3]===i.x&&e[t+4]===i.y&&e[t+5]===i.z&&e[t+6]===i.w&&e[t+7]===s.x&&e[t+8]===s.y&&e[t+9]===s.z}function ab(l,e){for(let t=0;t<16;t++)if(l[t]!==e[t])return!1;return!0}function ad(l,e){e.push(l);let t=l.children;for(let n=0;n<t.length;n++)ad(t[n],e);return e}function rd(l,e){let t=l.o;for(let n=0;n<l.depth&&t;n++)t=t.parent;return t===e}var sc=l=>Object.getPrototypeOf(l);function ob(l){let e=this.__awFz;if(e&&e.frozen){if(!this.matrixWorldNeedsUpdate){if(!l)return;let t=this.parent;if(t&&ab(t.matrixWorld.elements,e.pm)&&ic(this,e.snap,0))return}fa(e),e.fthaw=!0}sc(this).updateMatrixWorld.call(this,l)}function lb(l){for(let e=l.target;e;e=e.parent)if(e.__awFz&&e.__awFz.frozen){fa(e.__awFz);return}}function fa(l){l.frozen&&(l.frozen=!1,l.t=-1,sc(l.o).updateMatrixWorld.call(l.o,!1))}var pa=class{constructor(e){x(this,"g",e);x(this,"stats",{frozen:0,frozenNodes:0,thaws:0,splits:0,roots:0});x(this,"roots",[]);x(this,"parents",[]);x(this,"tracked",new WeakSet);x(this,"hooked",new WeakSet);x(this,"clock",0);x(this,"scanT",0);x(this,"ci",0);x(this,"ck",0);x(this,"oi",0)}top(){return(this.g.real||{}).group||null}track(e,t){this.tracked.has(e)||(this.tracked.add(e),this.roots.push({o:e,depth:t,nodes:[],snap:new Float64Array(0),pm:new Float64Array(16),t:-1,frozen:!1,dead:!1,fthaw:!1}))}frame(e){let t=this.top();if(!t)return;if(this.clock+=e,(this.scanT-=e)<=0){this.scanT=1;for(let c of t.children)this.track(c,1);let s=0;for(let c of this.parents){if(!rd(c,t)){this.tracked.delete(c.o);continue}this.parents[s++]=c;for(let u of c.o.children)this.track(u,c.depth+1)}this.parents.length=s;let r=0,a=0,o=0;for(let c of this.roots)rd(c,t)||(fa(c),c.dead=!0,this.tracked.delete(c.o)),!c.dead&&(this.roots[r++]=c,c.frozen&&(a++,o+=c.nodes.length));this.roots.length=r,this.stats.roots=r,this.stats.frozen=a,this.stats.frozenNodes=o}let n=this.roots.length;if(!n)return;for(let s=0,r=400;s<n&&r>0;s++){let a=this.roots[this.oi=(this.oi+1)%n];if(a.fthaw&&(a.fthaw=!1,this.stats.thaws++),a.frozen||a.dead||a.t>=0&&this.clock-a.t<2)continue;let o=ad(a.o,[]),c=a.snap,u=a.nodes;r-=o.length;let h=a.t<0||u.length!==o.length;for(let d=0;d<o.length&&!h;d++)(o[d]!==u[d]||!ic(o[d],c,d*10))&&(h=!0);if(h&&a.t>=0&&a.depth<4&&a.o.children.length){a.dead=!0,this.stats.splits++,this.parents.push(a);for(let d of a.o.children)this.track(d,a.depth+1);continue}if(h){a.nodes=o,a.snap=rb(o,c),a.t=this.clock;continue}this.freeze(a)}let i=600;for(let s=0;i>0&&s<n;s++){let r=this.roots[this.ci%n];if(!r.frozen){this.ci++,this.ck=0;continue}let a=r.nodes,o=r.snap,c=!1,u=this.ck;for(;u<a.length&&i>0;u++,i--){let h=a[u];if(u>0&&h.matrixWorldNeedsUpdate||!ic(h,o,u*10)){c=!0;break}}if(c&&(fa(r),this.stats.thaws++),c||u>=a.length)this.ci++,this.ck=0;else{this.ck=u;break}}}freeze(e){if(!e.o.parent)return;sc(e.o).updateMatrixWorld.call(e.o,!1);let t=e.o.parent.matrixWorld.elements;for(let n=0;n<16;n++)e.pm[n]=t[n];for(let n of e.nodes)this.hooked.has(n)||(this.hooked.add(n),n.addEventListener("childadded",lb));Object.prototype.hasOwnProperty.call(e.o,"updateMatrixWorld")||(e.o.updateMatrixWorld=ob),e.o.__awFz=e,e.frozen=!0}};function vt(l,e=!1){let t=l[0].index!==null,n=new Set(Object.keys(l[0].attributes)),i=new Set(Object.keys(l[0].morphAttributes)),s={},r={},a=l[0].morphTargetsRelative,o=new re,c=0;for(let u=0;u<l.length;++u){let h=l[u],d=0;if(t!==(h.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in h.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;s[f]===void 0&&(s[f]=[]),s[f].push(h.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==h.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in h.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;r[f]===void 0&&(r[f]=[]),r[f].push(h.morphAttributes[f])}if(e){let f;if(t)f=h.index.count;else if(h.attributes.position!==void 0)f=h.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;o.addGroup(c,f,u),c+=f}}if(t){let u=0,h=[];for(let d=0;d<l.length;++d){let f=l[d].index;for(let p=0;p<f.count;++p)h.push(f.getX(p)+u);u+=l[d].attributes.position.count}o.setIndex(h)}for(let u in s){let h=od(s[u]);if(!h)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;o.setAttribute(u,h)}for(let u in r){let h=r[u][0].length;if(h!==0){o.morphAttributes=o.morphAttributes||{},o.morphAttributes[u]=[];for(let d=0;d<h;++d){let f=[];for(let m=0;m<r[u].length;++m)f.push(r[u][m][d]);let p=od(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;o.morphAttributes[u].push(p)}}}return o}function od(l){let e,t,n,i=-1,s=0;for(let c=0;c<l.length;++c){let u=l[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=u.gpuType),i!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}let r=new e(s),a=new ie(r,t,n),o=0;for(let c=0;c<l.length;++c){let u=l[c];if(u.isInterleavedBufferAttribute){let h=o/t;for(let d=0,f=u.count;d<f;d++)for(let p=0;p<t;p++){let m=u.getComponent(d,p);a.setComponent(d+h,p,m)}}else r.set(u.array,o);o+=u.count*t}return i!==void 0&&(a.gpuType=i),a}function rc(l,e){if(e===zl)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),l;if(e===Di||e===Cs){let t=l.getIndex();if(t===null){let s=[],r=l.getAttribute("position");if(r!==void 0){for(let a=0;a<r.count;a++)s.push(a);l.setIndex(s),t=l.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),l}let n=t.count-2,i=[];if(e===Di)for(let s=1;s<=n;s++)i.push(t.getX(0)),i.push(t.getX(s)),i.push(t.getX(s+1));else for(let s=0;s<n;s++)s%2===0?(i.push(t.getX(s)),i.push(t.getX(s+1)),i.push(t.getX(s+2))):(i.push(t.getX(s+2)),i.push(t.getX(s+1)),i.push(t.getX(s)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),l.setIndex(i),l.clearGroups(),l}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),l}var ma=class{constructor(e){x(this,"g",e);x(this,"stats",{regions:0,before:0,after:0,ms:0});x(this,"n",0);x(this,"todo",[])}frame(){if(++this.n%3)return;let e=this.todo.shift();if(e){let n=performance.now();this.mergeList(e.root,e.list),this.stats.ms=Math.max(this.stats.ms,performance.now()-n);return}let t=this.g.real;for(let n of t.regions.values())if(!(n.__awBM||n.state!=="built"||!n.group)&&!t.queue.some(i=>i.R===n)){n.__awBM=!0,this.collect(n.group);return}}collect(e){let t=new Map;e.traverse(n=>{let i=n;if(!i.isMesh||i.isInstancedMesh||!i.name.startsWith("bld:")||i.name==="bld:kit"||Array.isArray(i.material))return;let s=i,r=!0;for(;s&&s!==e;)s.matrix.equals(cb)||(r=!1),s=s.parent;if(!r)return;let a=i.geometry;if(Object.keys(a.morphAttributes).length||a.groups.length)return;let o=i.name+"|"+i.material.uuid+"|"+Object.keys(a.attributes).sort().join(",")+"|"+(a.index?1:0)+"|"+(i.castShadow?1:0)+(i.receiveShadow?1:0)+"|"+i.renderOrder;(t.get(o)||t.set(o,[]).get(o)).push(i)});for(let n of t.values())this.stats.before+=n.length,n.length<2?this.stats.after++:this.todo.push({root:e,list:n});this.stats.regions++}mergeList(e,t){if(!t[0].parent)return;let n=vt(t.map(r=>r.geometry));if(!n){this.stats.after+=t.length;return}n.computeBoundingSphere(),n.computeBoundingBox();let i=t[0],s=new k(n,i.material);s.name=i.name,s.castShadow=i.castShadow,s.receiveShadow=i.receiveShadow,s.renderOrder=i.renderOrder,s.frustumCulled=i.frustumCulled;for(let r of t)r.removeFromParent(),r.geometry.dispose();e.add(s),this.stats.after++}},cb=new F;var ub=new F,ld=new F,cd=new Xt,en=new M,ud=0,hd=1,dd=2;function ac(l,e,t,n){let i=this.userData.awb;ld.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),cd.setFromProjectionMatrix(ld,t.coordinateSystem,t.reversedDepth);let s=cd.planes,r=n.index?n.index.array.BYTES_PER_ELEMENT:1,a=this._multiDrawStarts,o=this._multiDrawCounts,c=this._geometryInfo,u=0;e:for(let h=0;h<i.nVis;h++){let d=i.vis[h],f=i.cx[d],p=i.cy[d],m=i.cz[d],g=-i.r[d];for(let v=0;v<6;v++){let y=s[v],_=y.normal;if(_.x*f+_.y*p+_.z*m+y.constant<g)continue e}let b=c[d];a[u]=b.start*r,o[u]=b.count,u++}this.userData.awInd||(this._indirectTexture.needsUpdate=!0,this.userData.awInd=1),this._multiDrawCount=u,this._multiDrawBytesPerElement=r,this._visibilityChanged=!1}var ga=class{constructor(e,t,n=1/0){x(this,"g",e);x(this,"budget",t);x(this,"shellR",n);x(this,"stats",{regions:0,batches:0,cells:0,visCells:0,maxSlice:0,failed:0});x(this,"jobs",[]);x(this,"live",new Set);x(this,"fx",NaN);x(this,"fz",NaN);let i=e.real,s=i.update.bind(i);i.update=(...r)=>{let a=s(...r);if(i.cullT===0){let o=window.__awAhead;this.fx=r[0]+(o?o[0]:0),this.fz=r[2]+(o?o[1]:0),this.cullAll()}return a}}pending(){let e=this.jobs.length;for(let t of this.g.real.regions.values())!t.__awBB&&t.state==="built"&&t.group&&e++;return e}frame(){let e=this.g.real,t=performance.now();if(this.live.size){let i=0;for(let s of this.live)(!s.group||!s.group.parent)&&i++;if(i){for(let s of[...this.live])if(!s.group||!s.group.parent){for(let r of s.__awBB||[])r.bm.dispose();this.live.delete(s)}}}if(!this.jobs.length){for(let i of e.regions.values())if(!i.__awBB&&i.state==="built"&&i.group){this.collect(i);break}}for(;this.jobs.length&&performance.now()-t<this.budget;){let i=this.jobs[0];if(!i.list[0].parent||!i.R.group||!i.R.group.parent){this.jobs.shift(),i.b.bm.dispose();continue}let s=i.b.bm;if(i.i<i.list.length){let u=i.list[i.i].geometry;try{s.addInstance(s.addGeometry(u))}catch(h){console.warn("[aw-bb]",h),this.stats.failed++,this.jobs.shift(),s.dispose();continue}u.boundingBox||u.computeBoundingBox(),i.box.union(u.boundingBox),i.i++;continue}let r=i.list[i.k].geometry.attributes.position,a=r.array,o=r.data?-1:r.itemSize;i.box.getCenter(en);let c=i.r2;if(o>0)for(let u=0;u<a.length;u+=o){let h=a[u]-en.x,d=a[u+1]-en.y,f=a[u+2]-en.z,p=h*h+d*d+f*f;p>c&&(c=p)}else for(let u=0;u<r.count;u++){let h=r.getX(u)-en.x,d=r.getY(u)-en.y,f=r.getZ(u)-en.z,p=h*h+d*d+f*f;p>c&&(c=p)}i.r2=c,++i.k===i.list.length&&(i.b.sx=en.x,i.b.sz=en.z,i.b.sr=Math.sqrt(c),this.jobs.shift(),this.swap(i))}let n=performance.now()-t;n>this.stats.maxSlice&&(this.stats.maxSlice=n)}collect(e){let t=e.group,n=new Map;t.traverse(i=>{let s=i;if(!s.isMesh||s.isInstancedMesh||!s.name.startsWith("bld:")||s.name==="bld:kit"||Array.isArray(s.material))return;let r=s;for(;r&&r!==t;){if(!r.matrix.equals(ub))return;r=r.parent}let a=s.geometry;if(Object.keys(a.morphAttributes).length||a.groups.length||!a.attributes.position.count)return;a.boundingSphere||a.computeBoundingSphere();let o=s.name+"|"+s.material.uuid+"|"+Object.keys(a.attributes).sort().map(c=>c+a.attributes[c].array.constructor.name+a.attributes[c].itemSize+(a.attributes[c].normalized?"n":"")).join(",")+"|"+(a.index?1:0)+"|"+(s.castShadow?1:0)+(s.receiveShadow?1:0)+"|"+s.renderOrder+"|"+s.frustumCulled+s.visible;(n.get(o)||n.set(o,[]).get(o)).push(s)}),e.__awBB=[];for(let i of n.values()){if(i.length<2||i.length>65535)continue;let s=0,r=0;for(let f of i){let p=f.geometry;s+=p.attributes.position.count,r+=p.index?p.index.count:0}let a=i[0],o=i.length,c=new zn(o,s,r,a.material);c.name="aw:bb:"+a.name.slice(4),c.castShadow=a.castShadow,c.receiveShadow=a.receiveShadow,c.renderOrder=a.renderOrder,c.sortObjects=!1,c.perObjectFrustumCulled=!0,c.matrixAutoUpdate=!1;let u={bm:c,kind:a.name==="bld:MeshBasicMaterial"?dd:a.name==="bld:trim"?hd:ud,n:o,cx:new Float32Array(o),cy:new Float32Array(o),cz:new Float32Array(o),r:new Float32Array(o),vis:new Uint16Array(o),nVis:0,sx:0,sz:0,sr:1/0},h=new W,d=new W;i.forEach((f,p)=>{let m=f.geometry.boundingSphere;u.cx[p]=m.center.x,u.cy[p]=m.center.y,u.cz[p]=m.center.z,u.r[p]=m.radius,p?h.union(d.copy(m)):h.copy(m)}),c.boundingSphere=h,c.userData.awb=u,c.onBeforeRender=ac,this.jobs.push({R:e,list:i,i:0,b:u,box:new Re,k:0,r2:0})}this.stats.regions++}swap(e){let{R:t,list:n,b:i}=e;t.group.add(i.bm);for(let s of n)s.removeFromParent(),s.geometry.dispose();t.__awBB.push(i),this.live.add(t),this.stats.batches++,this.stats.cells+=i.n,this.cull(i)}cullAll(){let e=0;for(let t of this.live)for(let n of t.__awBB||[])this.cull(n),e+=n.nVis;this.stats.visCells=e}cull(e){let t=this.g.real.q,n=()=>{for(let r=0;r<e.n;r++)e.vis[r]=r;e.nVis=e.n,e.bm.visible=e.n>0};if(!Number.isFinite(this.fx))return n();if(e.kind===ud&&!Number.isFinite(this.shellR)){Math.hypot(e.sx-this.fx,e.sz-this.fz)-e.sr<t.bldR?n():(e.nVis=0,e.bm.visible=!1);return}let i=e.kind===dd?t.contactR:e.kind===hd?t.detailR:this.shellR,s=0;for(let r=0;r<e.n;r++)Math.hypot(e.cx[r]-this.fx,e.cz[r]-this.fz)-e.r[r]<i&&(e.vis[s++]=r);e.nVis=s,e.bm.visible=s>0}};var xa=class{constructor(e){x(this,"stats",{sb:0,drawn:0,blocks:0});x(this,"sbs",[]);let t=e.ovBlocks;if(!t||!t.length)return;let n=t[0].userData.rect[2]-t[0].userData.rect[0]||1,i=t[0].userData.rect[3]-t[0].userData.rect[1]||1,s=Math.min(...t.map(c=>c.userData.rect[0])),r=Math.min(...t.map(c=>c.userData.rect[1])),a=new Map;for(let c of t){let u=Math.floor((c.userData.rect[0]-s+1)/(n*4))+","+Math.floor((c.userData.rect[1]-r+1)/(i*4));(a.get(u)||a.set(u,[]).get(u)).push(c)}for(let c of a.values()){if(c.length<2)continue;let u=new k(c[0].geometry,c[0].material);u.name="ovTerrain:sb",u.receiveShadow=!1,u.matrixAutoUpdate=!1,u.visible=!1,e.group.add(u),this.sbs.push({kids:c,mesh:u,key:"",cache:new Map})}this.stats.sb=this.sbs.length,this.stats.blocks=t.length;let o=e.update.bind(e);e.update=(...c)=>{let u=o(...c);return this.apply(),u}}apply(){let e=0;for(let t of this.sbs){let n="",i=0;for(let r of t.kids)r.visible?(n+=r.userData.lods.indexOf(r.geometry),i++):n+="h";if(i<2){t.mesh.visible=!1;continue}let s=t.cache.get(n);if(s===void 0){if(s=vt(t.kids.filter(r=>r.visible).map(r=>r.geometry))||null,s&&s.computeBoundingSphere(),t.cache.size>=4){let[r,a]=t.cache.entries().next().value;t.cache.delete(r),a&&a!==s&&a.dispose()}t.cache.set(n,s)}else t.cache.delete(n),t.cache.set(n,s);if(!s){t.mesh.visible=!1;continue}t.mesh.geometry=s,t.mesh.visible=!0;for(let r of t.kids)r.visible=!1;e++}this.stats.drawn=e}};var ba=class{constructor(e){x(this,"real",e);x(this,"stats",{merged:0,chunks:0});x(this,"n",0);x(this,"live",new Set);let t=e.update.bind(e);e.update=(...n)=>{let i=t(...n);return this.apply(),i}}apply(){let e=(++this.n&7)===0,t=0,n=0,i=1;for(let s of this.real.regions.values()){let r=s.chunks,a=s.__awTM,o=!!r&&r.length>1&&!!s.group;if(o){for(let u of r)if(!u.mesh||u.step!==16||u.pending){o=!1;break}}if(!o){if(a&&(a.mesh.removeFromParent(),a.mesh.geometry.dispose(),s.__awTM=void 0,r))for(let u of r)u.mesh&&(u.mesh.visible=!0);continue}let c="";for(let u of r)c+=u.mesh.geometry.id+",";if(!a||a.key!==c){if(!e||i<=0){if(a){for(let h of r)h.mesh.visible=!0;a.mesh.visible=!1}continue}i--;let u=vt(r.map(h=>h.mesh.geometry));if(!u)continue;if(u.computeBoundingSphere(),a)a.mesh.geometry.dispose(),a.mesh.geometry=u,a.key=c;else{let h=new k(u,r[0].mesh.material);h.name="terrain16:m",h.receiveShadow=!0,h.matrixAutoUpdate=!1,s.group.add(h),s.__awTM={key:c,mesh:h},this.live.add(s)}}s.__awTM.mesh.visible=!0;for(let u of r)u.mesh.visible=!1;t++,n+=r.length}if(e)for(let s of this.live){let r=s.__awTM,a=!1;for(let o of this.real.regions.values())if(o===s){a=!0;break}(!a||!r)&&(r&&(r.mesh.removeFromParent(),r.mesh.geometry.dispose(),s.__awTM=void 0),this.live.delete(s))}this.stats.merged=t,this.stats.chunks=n}};var oc={value:500};function fd(l,e=1.6){return new bt({uniforms:{uI:l,uNight:Ne,uScale:oc,uMinPx:{value:e}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:Yn,fog:!1,toneMapped:!1})}function va(l,e,t=!1){return new bt({uniforms:{uI:e,uC:{value:new L(l)}},vertexShader:`
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
      }`,transparent:!0,depthWrite:!1,blending:Yn,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4,fog:!1,toneMapped:!1})}var pd=-2.4,md=8.87,gd=new F,hb=new K,db=new M(15,1,15),xd=new M,_a=class{constructor(e){x(this,"g");x(this,"points");x(this,"pools");x(this,"dotI",{value:0});x(this,"poolI",{value:0});x(this,"lists",[]);x(this,"bulbs",new Float32Array(0));x(this,"nBulbs",0);x(this,"t",0);x(this,"nPools");this.g=e;let t=new re;t.setAttribute("position",new ie(new Float32Array(3),3)),this.points=new xt(t,fd(this.dotI)),this.points.frustumCulled=!1,this.points.name="aw:lampGlow",this.points.renderOrder=5;let n=e.real?.q?.name??"med";this.nPools=n==="low"?14:n==="med"?24:32;let i=new qt(1,1).rotateX(-Math.PI/2);this.pools=new q(i,va(16758886,this.poolI),this.nPools),this.pools.frustumCulled=!1,this.pools.count=0,this.pools.name="aw:lampPools",e.scene.add(this.points,this.pools)}rebuild(){let t=this.g.real.veg.lists?.l;if(!t||t.length===this.lists.length&&t.every((c,u)=>c===this.lists[u]))return;this.lists=t.slice();let n=0;for(let c of t)n+=c.length;let i=new Float32Array(n*3),s=new Float32Array(n*3),r=new Float32Array(n),a=0;for(let c of t)for(let[u,h,d,f,p]of c){let m=Math.cos(p),g=Math.sin(p);i[a*3]=u+pd*m*f,i[a*3+1]=h+md*f-.12,i[a*3+2]=d-pd*g*f,s[a*3]=1,s[a*3+1]=.74,s[a*3+2]=.42,r[a]=1.9,a++}let o=new re;o.setAttribute("position",new ie(i,3)),o.setAttribute("color",new ie(s,3)),o.setAttribute("size",new ie(r,1)),this.points.geometry.dispose(),this.points.geometry=o,this.bulbs=i,this.nBulbs=n}update(e){let t=Ne.value,n=Math.max(0,Math.min(1,(t-.3)/.45));if(this.dotI.value=.95*n,this.poolI.value=.34*n,this.points.visible=this.pools.visible=n>.001,this.t-=e,this.t>0)return;this.t=.5,this.rebuild();let i=this.g.camera;if(oc.value=this.g.renderer.domElement.height/2/Math.tan(i.fov*Math.PI/180/2),!this.points.visible)return;let s=i.position.x,r=i.position.z,a=[],o=this.bulbs;for(let u=0;u<this.nBulbs;u++){let h=o[u*3]-s,d=o[u*3+2]-r,f=h*h+d*d;f<25600&&a.push([f,u])}a.sort((u,h)=>u[0]-h[0]);let c=Math.min(this.nPools,a.length);for(let u=0;u<c;u++){let h=a[u][1],d=o[h*3],f=o[h*3+2],p=this.g.real&&this.g.real.heightAt,m=p?p(d,f):o[h*3+1]-md;xd.set(d,m+.3,f),gd.compose(xd,hb,db),this.pools.setMatrixAt(u,gd)}this.pools.count=c,this.pools.instanceMatrix.needsUpdate=!0}};var ya=[16052712,2106667,12106945,9377825,1526392,14145746,5003845,11823922,7038077,14927177,7554357,4093819],fb=new L(16773590),pb=new L(16719888),mb=l=>!!l.rb,Ma=class{constructor(e){x(this,"g",e);x(this,"stats",{pooled:0,visible:0,yielding:0,avoiding:0,batches:0,beamDraws:0,quality:""});x(this,"amb",null);x(this,"states",[]);x(this,"batches",[]);x(this,"stateByCar",new WeakMap);x(this,"matrix",new F);x(this,"zero",new F().makeScale(0,0,0));x(this,"paint",new L);x(this,"beamI",{value:0});x(this,"beamMat",va(16773328,this.beamI,!0));x(this,"beams",null)}start(){let e=this.g.real.amb;if(!e?.kit?.car?.[0])return!1;this.amb=e;let t=this.g.real.q.name,n=t==="low"?5:t==="med"?10:15,i=t==="low"?[0,1,2]:t==="med"?[0,1,2,4]:[0,1,2,3,4];for(this.stats.quality=t;e.cars.length<n;){let r=e.cars.length,a=i[r%i.length],o=this.paint.setHex(ya[(r*5+3)%ya.length]),c=e.carMesh(a,o);c.visible=!1,e.group.add(c),e.cars.push({g:c,v:a,rd:null,L:0,dir:1,s:0,sp:0})}e.nCar=n;for(let r=0;r<5;r++)this.batches.push({cars:[],parts:[]});for(let r=0;r<e.cars.length;r++){let a=e.cars[r],o=Math.max(0,Math.min(4,a.v|0)),c=e.kit.car[0][o].paint,u=new L(ya[r%ya.length]);for(let d of a.g.children){let f=d,p=f.material;if(f.isMesh&&f.geometry===c&&p.color){u=p.color.clone();break}}let h={car:a,base:a.g.children.slice(),color:u,batchIndex:this.batches[o].cars.length,rd:null,cruise:11,yieldPhase:0,yieldTime:0,yieldsAtEnd:!1};this.batches[o].cars.push(h),this.states.push(h),this.stateByCar.set(a,h);for(let d of h.base)d.visible=!1}for(let r=0;r<5;r++)this.makeBatch(r,e.kit.car[0][r]);let s=new qt(4.4,16).rotateX(-Math.PI/2).rotateY(Math.PI).translate(0,.11,10);return this.beams=new q(s,this.beamMat,n),this.beams.name="aw:traffic:beams",this.beams.frustumCulled=!1,this.beams.instanceMatrix.setUsage(ot),this.beams.count=0,e.group.add(this.beams),this.stats.pooled=this.states.length,!0}makeBatch(e,t){let n=this.amb,i=this.batches[e],s=i.cars.length;if(s)for(let r of Object.keys(t)){let a=n.mats[r];if(!a)continue;let o=a.clone();r==="paint"&&o.color&&o.color.setHex(16777215);let c=new q(t[r],o,s);if(c.name=`aw:traffic:${e}:${r}`,c.frustumCulled=!1,c.castShadow=this.g.real.q.name!=="low"&&r==="paint",c.instanceMatrix.setUsage(ot),r==="paint"){for(let u=0;u<s;u++)c.setColorAt(u,i.cars[u].color);c.instanceColor&&(c.instanceColor.needsUpdate=!0)}i.parts.push({mesh:c,mat:o,name:r}),n.group.add(c),this.stats.batches++}}routeChanged(e){let t=e.car;if(e.rd=t.rd,e.cruise=t.v===4?9:11+(e.batchIndex*7+t.v*3)%4,e.yieldPhase=0,e.yieldTime=0,e.yieldsAtEnd=!1,!t.rd||t.rd.rb)return;let n=t.rd.p,i=t.dir>0?n[n.length-1]:n[0];e.yieldsAtEnd=this.amb.pick(i[0],i[1],mb,18).length>0}applyAI(e){let t=this.amb,n=this.g.S.mode,i=n==="walk"?this.g.S.walk:this.g.S.car,s=n!=="plane",r=0,a=0;for(let o=0;o<t.cars.length;o++){let c=t.cars[o],u=this.stateByCar.get(c);if(!u||(c.rd!==u.rd&&this.routeChanged(u),!c.rd))continue;let h=u.cruise;if(c.rd.rb&&(h=Math.min(h,6.5)),u.yieldsAtEnd&&u.yieldPhase<2){let f=c.dir>0?c.L-c.s:c.s;f<22&&(h=Math.min(h,Math.max(0,(f-4.5)*.75))),f<6&&u.yieldPhase===0&&(u.yieldPhase=1,u.yieldTime=.7+(u.batchIndex*13+c.v*5)%8*.1),u.yieldPhase===1&&(h=0,c.sp<.7&&(u.yieldTime-=e)<=0&&(u.yieldPhase=2)),r++}if(s){let f=c.g.position.x-i.x,p=c.g.position.z-i.z,m=f*f+p*p;m<324&&(h=Math.min(h,Math.max(0,(Math.sqrt(m)-5)*.8)),a++)}for(let f=0;f<t.cars.length;f++){if(o===f)continue;let p=t.cars[f];if(p.rd!==c.rd||p.dir!==c.dir)continue;let m=c.dir*(p.s-c.s);m>0&&m<20&&(h=Math.min(h,Math.max(0,(m-5)*.85)))}let d=h-c.sp;c.sp+=Math.max(-8*e,Math.min(2.4*e,d)),c.sp<.001&&(c.sp=.001)}this.stats.yielding=r,this.stats.avoiding=a}isSpecial(e){let t=!1;for(let n of e.car.g.children){if(n.name.startsWith("aw:ev"))return 2;(n.name==="aw:ebar"||n.name==="aw:estripe")&&n.visible&&(t=!0)}return t?1:0}renderInstances(){let e=0,t=0,n=Math.max(0,Math.min(1,(Ne.value-.3)/.4));this.beamI.value=.42*n;for(let i of this.batches){for(let s of i.cars){let r=s.car,a=this.isSpecial(s);for(let c of s.base)c.visible=a===1&&r.g.visible;let o=!!r.rd&&r.g.visible&&a===0;o?(this.matrix.compose(r.g.position,r.g.quaternion,r.g.scale),e++):this.matrix.copy(this.zero);for(let c of i.parts)c.mesh.setMatrixAt(s.batchIndex,this.matrix);o&&n>.001&&this.beams&&this.beams.setMatrixAt(t++,this.matrix)}for(let s of i.parts)s.mesh.instanceMatrix.needsUpdate=!0,s.name==="light"&&s.mat.emissive?(s.mat.emissive.copy(fb),s.mat.emissiveIntensity=1+n*5):s.name==="tail"&&s.mat.emissive&&(s.mat.emissive.copy(pb),s.mat.emissiveIntensity=1+n*3)}this.beams&&(this.beams.count=t,this.beams.visible=t>0,t&&(this.beams.instanceMatrix.needsUpdate=!0)),this.stats.visible=e,this.stats.beamDraws=t?1:0}update(e){if(!this.amb&&!this.start())return;let t=Math.min(.1,e);this.applyAI(t),this.renderInstances()}};var bd=[15293275,4034507,15845451,5089640,15303603,15174469,7560626],vd=[2503749,5588277,14275783,3361897,3224376],_d=[7290667,9590843,12155220,13998706,15581854],gb=new M(1,0,0),wa=class{constructor(e){x(this,"g",e);x(this,"stats",{pooled:0,visible:0,draws:0,triangles:0,corridors:0});x(this,"amb",null);x(this,"walkers",[]);x(this,"routes",[]);x(this,"group",new _e);x(this,"head");x(this,"torso");x(this,"legs");x(this,"arms");x(this,"meshes");x(this,"root",new F);x(this,"local",new F);x(this,"world",new F);x(this,"pos",new M);x(this,"scale",new M);x(this,"quat",new K);x(this,"tint",new L);x(this,"scanIn",0);x(this,"lod2");let t=e.real.q.name,n=t==="low"?18:t==="med"?32:48,i=t==="low"?190:250;this.lod2=i*i,this.group.name="aw:pedestrians";let s=new at({color:16777215}),r=new at({color:16777215}),a=new at({color:16777215});this.head=this.mesh(new Be(1,6,4),s,n,"heads"),this.torso=this.mesh(new ke(1,1,1),r,n,"torsos"),this.legs=this.mesh(new ke(1,1,1),a,n*2,"legs"),this.arms=this.mesh(new ke(1,1,1),s,n*2,"arms"),this.meshes=[this.head,this.torso,this.legs,this.arms],this.group.add(this.head,this.torso,this.legs,this.arms),e.scene.add(this.group);for(let o=0;o<n;o++)this.walkers.push({road:null,length:0,s:0,dir:o&1?1:-1,side:o&2?1:-1,speed:1.05+o%6*.09,phase:o*2.399963%(Math.PI*2),x:0,y:0,z:0,yaw:0,skin:_d[o*3%_d.length],top:bd[o*5%bd.length],bottom:vd[o*7%vd.length]});this.stats.pooled=n}mesh(e,t,n,i){let s=new q(e,t,n);return s.name=`aw:pedestrians:${i}`,s.instanceMatrix.setUsage(ot),s.frustumCulled=!1,s.castShadow=this.g.real.q.name!=="low",s.count=0,s}roadLength(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}inCorridor(e){let t=e.n==="Caya G.F. Betico Croes",n=e.n==="J.E. Irausquin Boulevard";if(!t&&!n)return!1;for(let i=0;i<e.p.length;i++){let s=e.p[i][0],r=e.p[i][1];if(t&&s>-7550&&s<-6450&&Math.abs(r)<350)return!0;let a=s+8220,o=r+5750;if(n&&a*a+o*o<1450*1450)return!0}return!1}scanRoutes(){let e=this.amb;this.routes=[];let t=new Set;for(let n of e.w.regions.values()){let i=n.json?.roads;if(i)for(let s of i){let r=`${s.n}:${s.id}`;s.u||s.p.length<2||t.has(r)||!this.inCorridor(s)||(t.add(r),this.routes.push(s))}}if(this.stats.corridors=this.routes.length,!!this.routes.length)for(let n=0;n<this.walkers.length;n++){let i=this.walkers[n];if(i.road&&this.routes.includes(i.road))continue;let s=this.routes[n%this.routes.length];i.road=s,i.length=this.roadLength(s),i.s=i.length*(n*.61803398875%1*.9+.05),i.side=(n&1?1:-1)*(s.w*.5+1.45)}}sample(e){let t=e.road;if(!t)return!1;let n=0;for(let i=1;i<t.p.length;i++){let s=t.p[i-1][0],r=t.p[i-1][1],a=t.p[i][0]-s,o=t.p[i][1]-r,c=Math.hypot(a,o)||1;if(n+c>=e.s||i===t.p.length-1){let u=Math.max(0,Math.min(1,(e.s-n)/c)),h=a/c,d=o/c;return e.x=s+a*u-d*e.side,e.z=r+o*u+h*e.side,e.y=this.amb.w.surfaceAt(e.x,e.z)+.02,e.yaw=e.dir>0?Math.atan2(h,d):Math.atan2(-h,-d),!0}n+=c}return!1}put(e,t,n,i,s,r,a,o,c){this.pos.set(n,i,s),this.quat.setFromAxisAngle(gb,r),this.scale.set(a,o,c),this.local.compose(this.pos,this.quat,this.scale),this.world.multiplyMatrices(this.root,this.local),e.setMatrixAt(t,this.world)}drawWalker(e,t,n){let i=Math.sin(n*7.2+e.phase),s=Math.abs(i)*.025;this.root.makeRotationY(e.yaw),this.root.setPosition(e.x,e.y+s,e.z),this.put(this.head,t,0,1.77,0,0,.18,.2,.18),this.put(this.torso,t,0,1.29,0,0,.34,.52,.22),this.put(this.legs,t*2,-.14,.64,i*.08,i*.45,.11,.62,.13),this.put(this.legs,t*2+1,.14,.64,-i*.08,-i*.45,.11,.62,.13),this.put(this.arms,t*2,-.43,1.26,0,-i*.5,.08,.48,.09),this.put(this.arms,t*2+1,.43,1.26,0,i*.5,.08,.48,.09),this.head.setColorAt(t,this.tint.setHex(e.skin)),this.torso.setColorAt(t,this.tint.setHex(e.top)),this.legs.setColorAt(t*2,this.tint.setHex(e.bottom)),this.legs.setColorAt(t*2+1,this.tint),this.arms.setColorAt(t*2,this.tint.setHex(e.skin)),this.arms.setColorAt(t*2+1,this.tint)}update(e,t){if(!this.amb){let s=this.g.real.amb;if(!s)return;this.amb=s,this.scanRoutes()}for(;this.amb.peds.length;){let s=this.amb.peds.pop();s.g.visible=!1,s.g.parent?.remove(s.g)}(this.scanIn-=e)<=0&&(this.scanIn=2,this.scanRoutes());let n=this.g.camera.position,i=0;for(let s of this.walkers){if(!s.road||s.length<=0||(s.s+=s.dir*s.speed*e,s.s>=s.length?(s.s=s.length,s.dir=-1):s.s<=0&&(s.s=0,s.dir=1),!this.sample(s)))continue;let r=s.x-n.x,a=s.z-n.z;r*r+a*a>this.lod2||this.drawWalker(s,i++,t)}this.head.count=i,this.torso.count=i,this.legs.count=i*2,this.arms.count=i*2;for(let s of this.meshes)s.count&&(s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.needsUpdate=!0)),s.visible=s.count>0;this.stats.visible=i,this.stats.draws=i?4:0,this.stats.triangles=i*96}};var Sa={up:[10,18,27,37,48],down:[0,7,14,22,31],idle:820,red:6400,launch:2e3},Aa={up:[11,20,30,39,48,55],down:[0,8,16,25,34,43],idle:1400,red:12400,launch:3400};function Ta(l){return l==="car"?32:50}function lc(l,e){return Math.max(8,Math.floor(l*2/Ta(e)))}function cc(l,e,t,n,i,s){let r=e<0?-e:e,a=l.gear,o=0,c=i.up.length-1;a<c&&r>i.up[a]?(a+=1,o=1):a>0&&r<i.down[a]&&(a-=1,o=-1),l.gear=a;let u=i.down[a],d=i.up[a]-u||1,f=(r-u)/d;f<0?f=0:f>1&&(f=1);let p=i.idle+f*(i.red-i.idle);if(p+=t*(1-f*.65)*(i.red-i.idle)*.2,r<.8){let b=Math.sin(s*3.1)*12+Math.sin(s*5.4)*7;p=i.idle+t*i.launch+(t<.12?b:0)}f>.96&&t>.75&&(p-=Math.abs(Math.sin(s*46))*(i.red*.018)),p>i.red&&(p=i.red),p<i.idle*.92&&(p=i.idle*.92),o===1?l.rpm*=.68:o===-1&&(l.rpm=Math.min(i.red,l.rpm*1.18+180)),l.shift=o!==0?.16:l.shift>n?l.shift-n:0;let m=l.shift>0?15:t>.4?8.5:3.4,g=n>0?1-Math.exp(-m*n):0;return l.rpm+=(p-l.rpm)*g,o}function xb(l){return l%=1,l<0?l+1:l}function Ni(l,e,t){let n=xb(l-e);n>.5&&(n=1-n);let i=t*.2;return n<i?i>0?n/i:1:Math.exp(-(n-i)/t)}function bb(l,e){let t=e?.032:.068,n=Ni(l,0,t),i=Ni(l,.5,t*1.08),s=l*Math.PI*2,r=e?1:0,a=Math.sin(s)*.2+Math.sin(s*2)*.3+Math.sin(s*3)*(.05+r*.12)+Math.sin(s*4)*(.045+r*.1)+Math.sin(s*5)*r*.06+Math.sin(s*6)*r*.04;return Math.tanh(((n+i*.9)*(e?.82:.68)+a)*1.12)}function vb(l,e){let t=e?.02:.038,n=Ni(l,.02,t),i=Ni(l,.16,t*.92),s=Ni(l,.56,t*1.15)*.7,r=Ni(l,.71,t)*.58,a=l*Math.PI*2,o=e?1:0,c=Math.sin(a)*.14+Math.sin(a*2)*.2+Math.sin(a*3+.45)*(.06+o*.12)+Math.sin(a*4.5)*(.025+o*.08)+Math.sin(a*6)*o*.05+Math.sin(a*8)*o*.028;return Math.tanh(((n+i+s+r)*(e?.78:.64)+c)*1.2)}function yd(l,e,t,n){let i=n.length,s=t?e==="car"?2500:3e3:e==="car"?820:980,r=1-Math.exp(-2*Math.PI*s/l),a=0,o=0,c=0,u=0,h=0;for(let f=0;f<2;f++)for(let p=0;p<i;p++){let m=p/i*2%1,g=e==="car"?bb(m,t):vb(m,t);if(a+=(g-a)*r,o+=(a-o)*r,c+=(o-c)*r,u+=(c-u)*r,f===1){n[p]=u;let b=u<0?-u:u;b>h&&(h=b)}}let d=h>1e-5?.56/h:0;for(let f=0;f<i;f++)n[f]*=d}var _b=.5,Md=180,Ea=class{constructor(e){x(this,"g",e);x(this,"stats",{started:!1,muted:!1,mode:"car",trafficVoices:0,nodes:0,gear:0,rpm:0,throttle:0,police:0,ambulance:0,impacts:0,turbo:0,level:0});x(this,"audio",null);x(this,"muted",!1);x(this,"quick");x(this,"setting",null);x(this,"keyFwd",!1);x(this,"keyBrk",!1);x(this,"prevT",0);x(this,"prevWall",0);x(this,"arm",.4);x(this,"masterLin",0);x(this,"carDrive",{gear:0,rpm:Sa.idle,shift:0});x(this,"motoDrive",{gear:0,rpm:Aa.idle,shift:0});x(this,"carThr",0);x(this,"motoThr",0);x(this,"overrun",0);x(this,"prevPhase",-1);x(this,"turboWas",!1);x(this,"turboLin",0);x(this,"policeLin",0);x(this,"ambLin",0);x(this,"crashRoot",null);x(this,"waveBase",.012);x(this,"heardMode","");x(this,"policeD",-1);x(this,"policeX",0);x(this,"policeZ",0);x(this,"ambD",-1);x(this,"ambX",0);x(this,"ambZ",0);x(this,"speed",0);x(this,"wx",0);x(this,"wz",0);try{this.muted=localStorage.getItem("aw_muted")==="1"}catch{}this.stats.muted=this.muted,this.quick=document.createElement("button"),this.quick.id="awmutebtn",this.quick.type="button",this.quick.setAttribute("aria-label","Mute game audio");let t=document.createElement("style");t.textContent="#awmutebtn{position:fixed;z-index:50;left:12px;top:calc(96px + env(safe-area-inset-top));width:42px;height:42px;border:2px solid #ffffff73;border-radius:50%;background:#0009;color:#fff;font:20px system-ui;display:grid;place-items:center;padding:0}",document.head.appendChild(t),this.quick.onclick=n=>{n.stopPropagation(),this.toggle()},document.body.appendChild(this.quick),this.syncButtons(),this.mountSetting(0),this.mountCredit(0),addEventListener("pointerdown",()=>{this.muted||this.start()},{once:!0}),addEventListener("keydown",n=>this.onKey(n,!0)),addEventListener("keyup",n=>this.onKey(n,!1)),addEventListener("blur",()=>{this.keyFwd=!1,this.keyBrk=!1})}onKey(e,t){if(e.target instanceof HTMLInputElement)return;let n=e.code==="KeyW"||e.code==="ArrowUp",i=e.code==="Space"||e.code==="KeyS"||e.code==="ArrowDown";n&&(this.keyFwd=t),i&&(this.keyBrk=t),t&&!this.muted&&this.start()}throttle(){let e=this.g.held,t=this.g.joy;if(e?.brake||this.keyBrk)return 0;let n=e?.gas||this.keyFwd?1:0,i=t?.y||0,s=i<0?i<-1?1:-i:0;return s>n?s:n}write(e,t,n,i){return Math.abs(t-n)<i?t:(e.value=n,n)}approach(e,t,n,i){return n<=0?e:e+(t-e)*(1-Math.exp(-i*n))}noiseBuffer(e){let t=Math.floor(e.sampleRate*2),n=e.createBuffer(1,t,e.sampleRate),i=n.getChannelData(0),s=305419896;for(let r=0;r<t;r++)s=Math.imul(s,1664525)+1013904223|0,i[r]=((s>>>8)/8388607-1)*.7;return n}cycleBuffer(e,t,n,i){let s=lc(e.sampleRate,t),r=e.createBuffer(1,s,e.sampleRate);return yd(e.sampleRate,t,n,i.subarray(0,s)),r.getChannelData(0).set(i.subarray(0,s)),r}loop(e,t){let n=e.createBufferSource();return n.buffer=t,n.loop=!0,n.start(),n}tone(e,t,n){let i=e.createOscillator(),s=e.createGain();return i.type=t,i.frequency.value=n,s.gain.value=0,i.connect(s),i.start(),{osc:i,gain:s,hz:n,amp:0}}tap(e,t,n,i){let s=e.createBiquadFilter(),r=e.createGain();return s.type=n,s.frequency.value=i,s.Q.value=.7,r.gain.value=0,t.connect(s),s.connect(r),{filter:s,gain:r,f:i,amp:0}}voice(e,t,n,i,s){let r=this.loop(e,this.cycleBuffer(e,n,!1,i)),a=this.loop(e,this.cycleBuffer(e,n,!0,i)),o=e.createOscillator();o.type="sine",o.frequency.value=40,o.start();let c=e.createGain(),u=e.createGain(),h=e.createGain(),d=e.createBiquadFilter(),f=e.createGain();c.gain.value=.7,u.gain.value=0,h.gain.value=0,f.gain.value=0,d.type="lowpass",d.frequency.value=500,d.Q.value=.45,r.connect(c).connect(d),a.connect(u).connect(d),d.connect(s).connect(f),o.connect(h).connect(f);let p=this.tap(e,t,"bandpass",240);p.gain.connect(f);let m=(Ta(n)>0,1);return r.playbackRate.value=m,a.playbackRate.value=m,{body:r,edge:a,sub:o,bodyGain:c,edgeGain:u,subGain:h,noiseFilter:p.filter,noiseGain:p.gain,filter:d,out:f,rate:m,bg:.7,eg:0,sg:0,ng:0,nf:240,ff:500,og:0,hz:40,level:0}}shape(e){let t=e.createWaveShaper(),n=new Float32Array(256),i=1.25,s=Math.tanh(i);for(let r=0;r<256;r++){let a=r/255*2-1;n[r]=Math.tanh(a*i)/s}return t.curve=n,t.oversample="none",t}start(){if(this.audio){this.audio.ctx.resume();return}try{let e=new AudioContext,t=e.createGain(),n=e.createDynamicsCompressor();n.threshold.value=-16,n.knee.value=18,n.ratio.value=3.5,n.attack.value=.012,n.release.value=.28,t.gain.value=0,t.connect(n).connect(e.destination);let i=this.loop(e,this.noiseBuffer(e)),s=new Float32Array(lc(e.sampleRate,"car")),r=this.voice(e,i,"car",s,this.shape(e)),a=this.voice(e,i,"moto",s,this.shape(e));r.out.connect(t),a.out.connect(t);let o=e.createBiquadFilter();o.type="lowpass",o.frequency.value=160;let c=e.createGain();c.gain.value=0,i.connect(o).connect(c).connect(t);let u=e.createBiquadFilter();u.type="lowpass",u.frequency.value=640,u.Q.value=.5;let h=e.createGain();h.gain.value=0;let d=e.createGain();d.gain.value=0;let f=this.tone(e,"sine",78);i.connect(u).connect(h).connect(d),f.gain.connect(d),d.connect(t);let p=this.tap(e,i,"lowpass",180);p.filter.Q.value=.4,p.gain.connect(t);let m=this.tap(e,i,"bandpass",1100);m.filter.Q.value=.8,m.gain.connect(t);let g=this.tone(e,"sine",38),b=this.tone(e,"sine",55);g.gain.connect(t),b.gain.connect(t);let v=e.createBiquadFilter();v.type="bandpass",v.frequency.value=300,v.Q.value=.65;let y=e.createGain();y.gain.value=0,i.connect(v).connect(y).connect(t);let _=e.createStereoPanner(),S=e.createGain();S.gain.value=0;let E=e.createBiquadFilter();E.type="lowpass",E.frequency.value=1700,E.Q.value=.5;let C=this.tone(e,"sine",700),A=this.tone(e,"sine",1050);C.gain.connect(E),A.gain.connect(E),E.connect(_).connect(S).connect(t);let R=e.createStereoPanner(),P=e.createGain();P.gain.value=0;let I=e.createBiquadFilter();I.type="lowpass",I.frequency.value=1600,I.Q.value=.5;let D=this.tone(e,"sine",680),N=this.tone(e,"sine",940);D.gain.connect(I),N.gain.connect(I),I.connect(R).connect(P).connect(t);let O=e.createOscillator();O.type="sine",O.frequency.value=80;let U=e.createGain();U.gain.value=0,O.connect(U).connect(t),O.start();let V=this.tap(e,i,"lowpass",420);V.filter.Q.value=.4,V.gain.connect(t);let Z=this.tap(e,i,"bandpass",1500);Z.filter.Q.value=.6,Z.gain.connect(t);let Y=this.tap(e,i,"bandpass",1600);Y.gain.connect(t);let ee=this.tap(e,i,"lowpass",680);ee.gain.connect(t);let $=this.tap(e,i,"bandpass",1e3);$.gain.connect(t);let ne=e.createOscillator(),fe=e.createGain();ne.frequency.value=.12,fe.gain.value=.004,ne.connect(fe).connect(ee.gain.gain),ne.start(),this.audio={ctx:e,master:t,noise:i,car:r,moto:a,clunk:c,planeFilter:u,planeNoise:h,planeTone:f,planeOut:d,roar:p,crackle:m,sub:g,sub2:b,whooshFilter:v,whoosh:y,police:C,police2:A,policePan:_,policeOut:S,amb:D,amb2:N,ambPan:R,ambOut:P,thump:O,thumpGain:U,crunch:V,metal:Z,skid:Y,waves:ee,city:$},this.stats.started=!0,this.stats.nodes=48,this.stats.trafficVoices=0,e.resume()}catch(e){console.warn("[aw-audio] WebAudio unavailable",e)}}toggle(){this.muted=!this.muted,this.stats.muted=this.muted;try{localStorage.setItem("aw_muted",this.muted?"1":"0")}catch{}this.muted||this.start(),this.syncButtons()}syncButtons(){this.quick.textContent=this.muted?"\u{1F507}":"\u{1F50A}",this.quick.title=this.muted?"Unmute audio":"Mute audio",this.setting&&(this.setting.textContent=this.muted?"Sound: OFF":"Sound: ON")}mountSetting(e){let t=document.getElementById("awtime");if(!t){e<60&&setTimeout(()=>this.mountSetting(e+1),500);return}let n=document.createElement("div");n.className="lbl",n.textContent="World audio";let i=document.createElement("div");i.className="row";let s=document.createElement("button");s.type="button",s.onclick=()=>this.toggle(),i.appendChild(s),t.append(n,i),this.setting=s,this.syncButtons()}mountCredit(e){let t=document.querySelector("#credits ul");if(!t){e<40&&setTimeout(()=>this.mountCredit(e+1),500);return}if(t.querySelector(".aw-audio"))return;let n=document.createElement("li");n.className="aw-audio",n.innerHTML='Engines, sirens, crash impact and turbo: original procedural synthesis (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 1.0</a>, no third-party samples)',t.appendChild(n)}clunkAt(e){let t=this.audio;if(!t)return;let n=t.clunk.gain;n.cancelScheduledValues(e),n.setValueAtTime(1e-4,e),n.exponentialRampToValueAtTime(.04,e+.01),n.exponentialRampToValueAtTime(1e-4,e+.07)}boom(e,t){let n=this.audio;if(!n)return;let i=t>420?0:1-t/420,s=i*i;if(s<.05)return;let r=n.thump.frequency,a=n.thumpGain.gain;r.cancelScheduledValues(e),r.setValueAtTime(130,e),r.exponentialRampToValueAtTime(34,e+.34),a.cancelScheduledValues(e),a.setValueAtTime(1e-4,e),a.exponentialRampToValueAtTime(.15*s,e+.016),a.exponentialRampToValueAtTime(1e-4,e+.48);let o=n.crunch.gain.gain;o.cancelScheduledValues(e),o.setValueAtTime(1e-4,e),o.exponentialRampToValueAtTime(.08*s,e+.012),o.exponentialRampToValueAtTime(1e-4,e+.4);let c=n.metal.gain.gain;c.cancelScheduledValues(e),c.setValueAtTime(1e-4,e),c.exponentialRampToValueAtTime(.03*s,e+.008),c.exponentialRampToValueAtTime(1e-4,e+.13),this.stats.impacts+=1}whoosh(e){let t=this.audio;if(!t)return;let n=t.whooshFilter.frequency,i=t.whoosh.gain;n.cancelScheduledValues(e),n.setValueAtTime(150,e),n.exponentialRampToValueAtTime(1700,e+.38),n.exponentialRampToValueAtTime(380,e+.85),i.cancelScheduledValues(e),i.setValueAtTime(1e-4,e),i.exponentialRampToValueAtTime(.05,e+.07),i.exponentialRampToValueAtTime(1e-4,e+.9)}silence(e,t){e.level=this.approach(e.level,0,t,10),e.og=this.write(e.out.gain,e.og,e.level,.003),e.eg=this.write(e.edgeGain.gain,e.eg,this.approach(e.eg,0,t,8),.005),e.ng=this.write(e.noiseGain.gain,e.ng,this.approach(e.ng,0,t,8),.003)}snap(e,t,n){for(let i=0;i<8;i++)cc(e,this.speed,0,.08,t,n);e.shift=0}engine(e,t,n,i,s,r,a){let o=cc(n,this.speed,s,a,i,r);this.arm<=0&&o===1&&this.clunkAt(r);let c=n.rpm/60/Ta(e);n.rpm<i.idle*1.25&&s<.15&&(c*=1+.012*Math.sin(r*2.6)+.007*Math.sin(r*5.2)),c<.1?c=.1:c>6&&(c=6),Math.abs(t.rate-c)>=.004&&(t.body.playbackRate.value=c,t.edge.playbackRate.value=c,t.rate=c);let u=(n.rpm-i.idle)/(i.red-i.idle),h=u<0?0:u>1?1:u,d=e==="moto"?2300:1850,f=(e==="moto"?480:400)+h*(e==="moto"?1100:800)+s*(e==="moto"?700:550);f>d&&(f=d),t.ff=this.write(t.filter.frequency,t.ff,f,8);let p=n.rpm/30;t.hz=this.write(t.sub.frequency,t.hz,p<28?28:p,.6),t.bg=this.write(t.bodyGain.gain,t.bg,.62,.01),t.eg=this.write(t.edgeGain.gain,t.eg,s*.42+h*s*.16,.008),t.sg=this.write(t.subGain.gain,t.sg,.05+h*.04+s*.02,.004);let m=.008+s*.02+h*.006;if(e==="moto"&&this.overrun>0){let v=Math.sin(r*53)*Math.sin(r*19);m+=(v>0?v*v*v*v:0)*.03*(this.overrun>.25?1:this.overrun*4)}t.ng=this.write(t.noiseGain.gain,t.ng,m,.002),t.nf=this.write(t.noiseFilter.frequency,t.nf,160+h*640+s*380,12);let g=.15+s*.07+h*.035;n.shift>.1&&(g*=.74);let b=e==="moto"?.24:.26;return g>b&&(g=b),t.level=this.approach(t.level,g,a,9),t.og=this.write(t.out.gain,t.og,t.level,.003),t.level}responders(e,t,n,i,s,r){if(this.policeD=-1,this.ambD=-1,n&&i>=1){let a=this.g.real?.amb,o=a?.group?.children;if(o){let c=this.crashRoot;if(!c||c.parent==null){c=null;for(let h=0;h<o.length;h++)o[h].name==="aw:crash"&&(c=o[h]);this.crashRoot=c}if(c){let h=c.children;for(let d=0;d<h.length;d++){let f=h[d].name;if(f==="aw:ev:everest"||f==="aw:ev:isuzu"){this.place(h[d]),this.policeX=this.wx,this.policeZ=this.wz,this.policeD=Math.hypot(this.policeX-e,this.policeZ-t);break}}}if(this.policeD<0){let h=window.__aw?.emerg?.ext;h&&(this.policeD=h.d,this.policeX=e,this.policeZ=t)}let u=a?.cars;if(u){let h=1e9,d=Math.hypot(s-e,r-t)<420;for(let f=0;f<u.length;f++){let p=u[f];if(!p.g.visible)continue;let m=p.g.children,g=!1;for(let S=0;S<m.length;S++){let E=m[S].name;if(E==="aw:ev:ambY"||E==="aw:ev:ambP"){g=!0;break}}if(!g)continue;this.place(p.g);let b=this.wx,v=this.wz,y=Math.hypot(b-s,v-r),_=Math.hypot(b-e,v-t);y>260&&!(d&&_<130)||_<h&&(h=_,this.ambX=b,this.ambZ=v,this.ambD=_)}}}}else this.crashRoot=null}place(e){let t=0,n=0,i=e;for(;i;)t+=i.position.x,n+=i.position.z,i=i.parent;this.wx=t,this.wz=n}atten(e){if(e<0||e>Md)return 0;let t=1-e/Md;return t*t*.04}update(){let e=this.audio;if(!e)return;let t=e.ctx.currentTime,n=performance.now()*.001,i=this.prevT>0?t-this.prevT:0,s=this.prevWall>0?n-this.prevWall:.016;this.prevT=t,this.prevWall=n;let r=i>s?i:s;if(r>0||(r=.016),r>.05&&(r=.05),r<0)return;this.arm>0&&(this.arm=this.arm>r?this.arm-r:0);let a=this.g.S,o=a.mode;this.stats.mode=o,this.speed=Math.abs(a.car.s||0);let c=o==="car"||o==="moto"?this.throttle():0,u=c>(o==="moto"?this.motoThr:this.carThr);o==="moto"?this.motoThr=this.approach(this.motoThr,c,r,u?14:5):o==="car"&&(this.carThr=this.approach(this.carThr,c,r,u?12:4.5)),o==="moto"&&this.motoThr<.08&&this.motoDrive.rpm>5600?this.overrun=.38:this.overrun=this.overrun>r?this.overrun-r:0,o!==this.heardMode&&(this.heardMode=o,o==="car"?this.snap(this.carDrive,Sa,t):o==="moto"&&this.snap(this.motoDrive,Aa,t));let h=o==="car"?this.engine("car",e.car,this.carDrive,Sa,this.carThr,t,r):(this.silence(e.car,r),0),d=o==="moto"?this.engine("moto",e.moto,this.motoDrive,Aa,this.motoThr,t,r):(this.silence(e.moto,r),0),f=o==="moto"?this.motoDrive:this.carDrive,p=o==="moto"?this.motoThr:this.carThr;this.stats.gear=o==="car"||o==="moto"?f.gear+1:0,this.stats.rpm=o==="car"||o==="moto"?f.rpm:0,this.stats.throttle=o==="car"||o==="moto"?p:0,this.stats.level=o==="moto"?d:o==="car"?h:0;let g=!!(this.g.held?.brake||this.keyBrk),b=Math.abs(a.car.drift||0),y=(o==="moto"?b:o==="car"&&g?Math.min(1,this.speed/20):0)*(o==="moto"?.035:.025);e.skid.amp=this.write(e.skid.gain.gain,e.skid.amp,y,.002);let _=Math.abs(a.plane.s||0),S=a.plane.thr||0,E=o==="plane",C=window,A=!!(C.__awTurbo&&E),R=E?C.__awTurboLvl||(A?1:0):0;this.turboLin=this.approach(this.turboLin,R,r,A?6:3),this.turboLin<.004&&!A&&(this.turboLin=0),A&&!this.turboWas&&this.whoosh(t),this.turboWas=A,this.stats.turbo=this.turboLin;let P=1-this.turboLin*.72,I=E?(.045+S*.03)*(P<.28?.28:P):0;e.planeOut.gain.value=I,e.planeNoise.gain.value=E?.55:0,e.planeFilter.frequency.value=520+S*700,e.planeTone.hz=this.write(e.planeTone.osc.frequency,e.planeTone.hz,72+S*46+_*.15,.5),e.planeTone.amp=this.write(e.planeTone.gain.gain,e.planeTone.amp,E?.22:0,.01);let D=this.turboLin;e.roar.amp=this.write(e.roar.gain.gain,e.roar.amp,D*.055,.002),e.roar.f=this.write(e.roar.filter.frequency,e.roar.f,150+D*160,4),e.sub.hz=this.write(e.sub.osc.frequency,e.sub.hz,32+D*18,.3),e.sub2.hz=this.write(e.sub2.osc.frequency,e.sub2.hz,47+D*12,.3),e.sub.amp=this.write(e.sub.gain.gain,e.sub.amp,D*.034,.002),e.sub2.amp=this.write(e.sub2.gain.gain,e.sub2.amp,D*.016,.001);let N=Math.sin(t*37)*Math.sin(t*17.5),O=N>0?N*N:0;e.crackle.amp=this.write(e.crackle.gain.gain,e.crackle.amp,D*(.006+O*.016),.001);let V=window.__aw?.crash?.stats,Z=V?.phase??0,Y=this.g.camera.position;if(this.prevPhase===0&&Z>=1){let he=(V?.x||Y.x)-Y.x,Ie=(V?.z||Y.z)-Y.z;this.boom(t,Math.hypot(he,Ie))}this.prevPhase=Z,this.responders(Y.x,Y.z,!!V?.active,Z,V?.x||0,V?.z||0);let ee=this.policeD>=0&&this.ambD>=0?.82:1;if(this.policeLin=this.approach(this.policeLin,this.atten(this.policeD)*ee,r,5),this.ambLin=this.approach(this.ambLin,this.atten(this.ambD)*ee,r,5),e.policeOut.gain.value=this.policeLin,e.ambOut.gain.value=this.ambLin,this.stats.police=this.policeLin,this.stats.ambulance=this.ambLin,this.policeLin>.004&&this.policeD>=0){let he=.5+.5*Math.sin(t*1.55),Ie=560+640*he*he*(3-2*he);e.police.hz=this.write(e.police.osc.frequency,e.police.hz,Ie,1),e.police2.hz=this.write(e.police2.osc.frequency,e.police2.hz,Ie*1.5,1),e.police.amp=this.write(e.police.gain.gain,e.police.amp,.72,.02),e.police2.amp=this.write(e.police2.gain.gain,e.police2.amp,.22,.02);let ge=(this.policeX-Y.x)/70;e.policePan.pan.value=ge<-.75?-.75:ge>.75?.75:ge}if(this.ambLin>.004&&this.ambD>=0){let he=.5+.5*Math.sin(t*7.4);e.amb.hz=this.write(e.amb.osc.frequency,e.amb.hz,660,1),e.amb2.hz=this.write(e.amb2.osc.frequency,e.amb2.hz,960,1),e.amb.amp=this.write(e.amb.gain.gain,e.amb.amp,.3+.7*(1-he),.02),e.amb2.amp=this.write(e.amb2.gain.gain,e.amb2.amp,.3+.7*he,.02);let Ie=(this.ambX-Y.x)/70;e.ambPan.pan.value=Ie<-.75?-.75:Ie>.75?.75:Ie}let $=o==="walk"?a.walk:o==="plane"?a.plane:a.car,ne=Math.hypot($.x+8220,$.z+5750),fe=Math.hypot($.x+7150,$.z),ye=Math.max(0,1-ne/1900),de=Math.max(Math.max(0,1-fe/1900),ye*.45);this.waveBase=this.approach(this.waveBase,.012+ye*.022,r,1.2),e.waves.amp=this.write(e.waves.gain.gain,e.waves.amp,this.waveBase,.001),e.city.amp=this.write(e.city.gain.gain,e.city.amp,de*.016,.001);let Fe=this.muted||document.hidden?0:_b;this.masterLin=this.approach(this.masterLin,Fe,r>0?r:.016,8),Math.abs(e.master.gain.value-this.masterLin)>.002&&(e.master.gain.value=this.masterLin)}};var yb=[["Sunrise",6.75],["Noon",12.5],["Sunset",18.25],["Night",21.5]];function wd(l,e){let t=document.createElement("style");t.textContent=`
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
      <div class="row">${yb.map(([h,d])=>`<button data-h="${d}">${h}</button>`).join("")}</div>
      <div class="row"><button id="awfreeze"></button></div>
      <div class="lbl">Auto FPS guard</div>
      <div class="row"><button id="awguard"></button></div><div id="awfps"></div>`;let a=document.getElementById("streset");s.insertBefore(r,a),r.querySelectorAll("[data-h]").forEach(h=>h.addEventListener("click",()=>l.setHour(+h.dataset.h)));let o=r.querySelector("#awfreeze"),c=r.querySelector("#awguard");o.addEventListener("click",()=>l.setFrozen(!l.frozen)),c.addEventListener("click",()=>e.setEnabled(!e.enabled));let u=()=>{o.textContent=l.frozen?"\u25B6 Resume clock":"\u23F8 Freeze clock",c.textContent=e.enabled?"On (tap to turn off)":"Off (tap to turn on)"};l.onChange(u),e.onChange(u),u()};return i(),()=>{let s=document.getElementById("awfps");s&&(s.textContent=e.describe())}}var Oi=class{constructor(e,t,n,i){x(this,"geo",e);x(this,"mat",t);x(this,"o",n);x(this,"parent",i);x(this,"im",null);x(this,"cap",0);x(this,"srcs",new Set)}get size(){return this.srcs.size}add(e){this.srcs.add(e);let t=0;for(let n of this.srcs)t+=n.n;t>this.cap&&this.grow(t)}remove(e){this.srcs.delete(e)}grow(e){let t=256;for(;t<e;)t*=2;let n=this.im,i=new q(this.geo,this.mat,0);i.instanceMatrix=new We(new Float32Array(t*16),16),i.name=this.o.name,i.castShadow=this.o.castShadow,i.receiveShadow=this.o.receiveShadow,i.frustumCulled=!1,i.matrixAutoUpdate=!1,i.count=0,i.visible=!1,this.o.colored&&(i.instanceColor=new We(new Float32Array(t*3),3)),n&&(i.count=n.count,i.visible=n.visible,i.instanceMatrix.array.set(n.instanceMatrix.array.subarray(0,n.count*16)),n.instanceColor&&i.instanceColor&&i.instanceColor.array.set(n.instanceColor.array.subarray(0,n.count*3)),n.removeFromParent(),n.dispose()),this.parent.add(i),this.im=i,this.cap=t}fill(e,t,n,i){let s=this.im;if(!s)return 0;let r=n<0?-1:n*n,a=i*i,o=s.instanceMatrix.array,c=s.instanceColor?s.instanceColor.array:null,u=0;for(let h of this.srcs){let d=Math.max(h.box[0]-e,0,e-h.box[2]),f=Math.max(h.box[1]-t,0,t-h.box[3]);if(d*d+f*f>=a)continue;let p=h.mats,m=h.cols;for(let g=0;g<h.n;g++){let b=h.cx[g]-e,v=h.cz[g]-t,y=b*b+v*v;if(y>=a||y<r)continue;let _=g*16,S=u*16;for(let E=0;E<16;E++)o[S+E]=p[_+E];c&&m&&(c[u*3]=m[g*3],c[u*3+1]=m[g*3+1],c[u*3+2]=m[g*3+2]),u++}}return s.count=u,s.visible=u>0,u>0&&(s.instanceMatrix.clearUpdateRanges(),s.instanceMatrix.addUpdateRange(0,u*16),s.instanceMatrix.needsUpdate=!0,s.instanceColor&&(s.instanceColor.clearUpdateRanges(),s.instanceColor.addUpdateRange(0,u*3),s.instanceColor.needsUpdate=!0)),u}dispose(){this.im&&(this.im.removeFromParent(),this.im.dispose(),this.im=null),this.cap=0}};var Mb=new Set(["bld:kit","parked","parkedHi","props"]),Ra=class{constructor(e,t=null){x(this,"q",e);x(this,"poolParent",t);x(this,"folded",0);x(this,"buckets",0);x(this,"lastX",1e9);x(this,"lastZ",1e9);x(this,"dirty",new Set);x(this,"pools",new Map);x(this,"dirtyPools",new Set);x(this,"job",null);x(this,"live",new Set)}fold(e,t=1e9){if(e.__awInst||e.state!=="built"||!e.group)return!1;let n=this.job;(!n||n.r!==e)&&(n=this.job={r:e,stack:[e.group],groups:new Map,seen:new Set,lists:null,i:0,out:[]});let i=performance.now();if(!n.lists){if(!this.gather(n,i,t))return!1;n.lists=[...n.groups.values()].filter(s=>s.length>=2)}for(;n.i<n.lists.length&&(this.foldList(e,n.lists[n.i++],n.out),!(performance.now()-i>t)););return n.i<n.lists.length?!1:(this.job=null,e.__awInst=n.out,this.poolParent||this.dirty.add(e),!0)}gather(e,t,n){let i=e.stack;for(let s=1;i.length;s++){let r=i.pop(),a=r.children;for(let c=a.length-1;c>=0;c--)i.push(a[c]);let o=r;if(o.isInstancedMesh&&Mb.has(o.name)&&!Array.isArray(o.material)&&o.count!==0){let c=o.parent;c&&!e.seen.has(c)&&(c.updateWorldMatrix(!0,!1),e.seen.add(c)),o.updateWorldMatrix(!1,!1);let u=o.name+"|"+o.geometry.uuid+"|"+o.material.uuid+"|"+o.castShadow+"|"+o.receiveShadow+"|"+(o.instanceColor?1:0),h=e.groups.get(u);h||e.groups.set(u,h=[]),h.push(o)}if((s&127)===0&&performance.now()-t>n)return!1}return!0}foldList(e,t,n){let i=new F,s=new F;{if(t.some(v=>!v.parent))return;let r=0;for(let v of t)r+=v.count;let a=new Float32Array(r*16),o=new Float32Array(r),c=new Float32Array(r),u=t[0].instanceColor?new Float32Array(r*3):null,h=0;for(let v of t)for(let y=0;y<v.count;y++,h++)if(s.fromArray(v.instanceMatrix.array,y*16),i.multiplyMatrices(v.matrixWorld,s),i.toArray(a,h*16),o[h]=a[h*16+12],c[h]=a[h*16+14],u&&v.instanceColor)for(let _=0;_<3;_++)u[h*3+_]=v.instanceColor.array[y*3+_];let d=t[0],f=1e9,p=-1e9,m=1e9,g=-1e9;for(let v=0;v<r;v++)f=Math.min(f,o[v]),p=Math.max(p,o[v]),m=Math.min(m,c[v]),g=Math.max(g,c[v]);if(this.poolParent){let v=d.name+"|"+d.geometry.uuid+"|"+d.material.uuid+"|"+d.castShadow+"|"+d.receiveShadow+"|"+(u?1:0),y=this.pools.get(v);y||this.pools.set(v,y=new Oi(d.geometry,d.material,{name:"aw:inst:"+d.name,castShadow:d.castShadow,receiveShadow:d.receiveShadow,colored:!!u},this.poolParent));let _={kind:d.name,im:null,pool:y,mats:a,cols:u,cx:o,cz:c,n:r,box:[f,m,p,g]};y.add(_),this.dirtyPools.add(y);for(let S of t)S.parent?.remove(S),this.folded++;n.push(_),this.buckets++;return}let b=new q(d.geometry,d.material,r);b.name="aw:inst:"+d.name,b.castShadow=d.castShadow,b.receiveShadow=d.receiveShadow,b.frustumCulled=!1,b.matrixAutoUpdate=!1,b.count=0,b.visible=!1,u&&(b.instanceColor=new We(new Float32Array(r*3),3)),e.group.add(b);for(let v of t)v.parent?.remove(v),this.folded++;n.push({kind:d.name,im:b,mats:a,cols:u,cx:o,cz:c,n:r,box:[f,m,p,g]}),this.buckets++}}range(e){let t=this.q,n=t.contactR||220,i=t.parkHi||35;return e==="bld:kit"?[-1,t.kitR||0]:e==="parked"?[i,t.parkR||n]:e==="parkedHi"?[-1,i]:[-1,(t.detailR||150)*.5]}cull(e,t,n){for(let i of e.__awInst||[]){if(!i.im)continue;let[s,r]=this.range(i.kind),a=s<0?-1:s*s,o=(r+3)*(r+3),c=Math.max(i.box[0]-t,0,t-i.box[2]),u=Math.max(i.box[1]-n,0,n-i.box[3]);if(c*c+u*u>=o){i.im.count&&(i.im.count=0,i.im.visible=!1);continue}let h=i.im.instanceMatrix.array,d=i.im.instanceColor?i.im.instanceColor.array:null,f=0;for(let p=0;p<i.n;p++){let m=i.cx[p]-t,g=i.cz[p]-n,b=m*m+g*g;if(b>=o||b<a)continue;let v=p*16,y=f*16;for(let _=0;_<16;_++)h[y+_]=i.mats[v+_];d&&i.cols&&(d[f*3]=i.cols[p*3],d[f*3+1]=i.cols[p*3+1],d[f*3+2]=i.cols[p*3+2]),f++}i.im.count=f,i.im.visible=f>0,f>0&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,f*16),i.im.instanceMatrix.needsUpdate=!0,i.im.instanceColor&&(i.im.instanceColor.clearUpdateRanges(),i.im.instanceColor.addUpdateRange(0,f*3),i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){this.job&&(!this.job.r.group||!this.job.r.group.parent)&&(this.live.add(this.job.r),this.job.r.__awInst=this.job.out,this.job=null);let i=this.job?this.job.r:[...e.values()].find(r=>!r.__awInst&&r.state==="built");i&&this.fold(i,3)&&this.live.add(i);for(let r of this.live)if(!r.group||!r.group.parent){for(let a of r.__awInst||[])a.im&&a.im.dispose(),a.pool&&(a.pool.remove(a),this.dirtyPools.add(a.pool));this.live.delete(r),this.dirty.delete(r)}if((t-this.lastX)**2+(n-this.lastZ)**2>16){this.lastX=t,this.lastZ=n;for(let r of this.live)this.dirty.add(r);for(let r of this.pools.values())this.dirtyPools.add(r)}for(let[r,a]of this.pools)if(this.dirtyPools.has(a)){let[o,c]=this.range(r.slice(0,r.indexOf("|")));a.fill(this.lastX,this.lastZ,o,c+3)}this.dirtyPools.clear();for(let r of this.dirty)this.cull(r,this.lastX,this.lastZ);this.dirty.clear()}};var Ca=class{constructor(e){x(this,"g");x(this,"real");x(this,"mobile");x(this,"stats");x(this,"carSeen",new WeakSet);x(this,"t",0);x(this,"heroCap");x(this,"inst",null);x(this,"postDone",!1);x(this,"regionChanged",(e,t)=>{for(let n=t;n<e.children.length;n++)e.children[n].traverse(i=>{i.name==="bld:kit"&&i.castShadow&&(i.castShadow=!1,this.stats.kitNoShadow++)})});x(this,"trimPending",!1);x(this,"carDone",new WeakSet);x(this,"pedsDone",!1);this.g=e,this.real=e.real;let t=H.get("perfmobile"),n=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window;this.mobile=t==="1"?!0:t==="0"?!1:n,this.stats={instFolded:0,instBuckets:0,carMeshes:"",peds:"",glassFixed:0,frozen:0,merged:0,mergedFrom:0,kitNoShadow:0,heroHidden:0,mobile:this.mobile,changes:[]};let i=this.real.q.name;this.heroCap=i==="low"?700:i==="med"?1e3:this.mobile?1400:this.real.q.id==="desktop"?5e3:2e3,window.__awMMDiv=3,this.tierProfile(),H.get("inst")!=="0"&&(this.inst=new Ra(this.real.q,H.get("ipool")!=="0"?this.real.group:null)),this.hookUpdate(),this.hookHero(),this.fixGlass()}tierProfile(){let e=this.real.q,t=this.g.renderer,n=this.stats.changes;if(this.mobile){if(e.name==="high"){let i=Math.min(window.devicePixelRatio||1,1.5);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 2->"+i));let s=this.real.sky.sun.shadow;s.mapSize.x>2048&&(s.mapSize.set(2048,2048),s.map?.dispose(),s.map=null,n.push("shadow 4096->2048")),Object.assign(e,{radius:1400,bldR:1400,roadR:900,kitR:100,parkR:250,contactR:300,detailR:500}),n.push("radius 2000->1400, bldR 1400, roadR 900, kitR 100, parkR 250, detailR 500"),this.trimPending=!0}else if(e.name==="med"){let i=Math.min(window.devicePixelRatio||1,1.35);t.getPixelRatio()>i+.001&&(t.setPixelRatio(i),window.dispatchEvent(new Event("resize")),n.push("pixelRatio 1.5->"+i))}}}fixPost(){if(this.postDone)return;let e=window.__awPost;if(!e)return;this.postDone=!0,this.mobile&&e.ao&&(e.ao.enabled=!1,this.stats.changes.push("GTAO off"));let t=e.composer;if(this.mobile&&t)for(let n of[t.renderTarget1,t.renderTarget2])n&&n.samples>2&&(n.samples=2,n.dispose(),this.stats.changes.push("MSAA 4->2"))}fixGlass(){if(this.real.q.id==="desktop"&&!this.mobile)return;let e=[],t=this.g.car;t&&e.push(t);for(let n of this.g.scene.children)n.name!=="realistic"&&e.push(n);for(let n of e)this.carSeen.has(n)||(this.carSeen.add(n),n.traverse(i=>{let s=i.material;!s||Array.isArray(s)||!(s.transmission&&s.transmission>0)||(s.transmission=0,s.transparent=!0,s.color?.set(790807),s.opacity=.72,s.depthWrite=!1,s.roughness!==void 0&&(s.roughness=Math.min(s.roughness,.08)),s.needsUpdate=!0,this.stats.glassFixed++)}))}freeze(e,t){let n=e.userData;if(n.awFrozen)return;n.awFrozen=!0,n.awN=-1;let i=Object.getPrototypeOf(e).updateMatrixWorld;e.updateMatrixWorld=function(s){let r=this.userData;(s||this.matrixWorldNeedsUpdate||r.awN!==this.children.length)&&(r.awN!==this.children.length&&t&&t(this,r.awN>this.children.length?0:Math.max(0,r.awN)),r.awN=this.children.length,i.call(this,!0))},this.stats.frozen++}merge(e,t){let n=e.userData,i=0;if(e.traverse(()=>i++),n.awMergedN===i)return;e.updateMatrixWorld(!0);let s=new F().copy(e.matrixWorld).invert(),r=new Map,a=new Set;e.traverse(u=>{let h=u;if(!h.isMesh||h.isInstancedMesh||h.isSkinnedMesh||!h.geometry||!h.material||!h.visible||h.name.startsWith("aw:")||h.morphTargetInfluences||h.matrixWorld.determinant()<0)return;let d=h.parent,f=!0;for(;d&&d!==e;)f=f&&d.visible&&!(t&&t(d)),d=d.parent;if(!f||t&&t(h))return;let p=h.geometry,m=Object.keys(p.attributes).sort().join(","),g=[];if(Array.isArray(h.material)){if(!p.index||!p.groups.length)return;for(let b of p.groups){let v=h.material[b.materialIndex??0];v&&g.push({m:h,mat:v,start:b.start,count:b.count})}}else g.push({m:h,mat:h.material,start:0,count:1/0});for(let b of g){let v=[b.mat.uuid,m,p.index?1:0,h.castShadow,h.receiveShadow,h.renderOrder].join("|"),y=r.get(v);y||r.set(v,y=[]),y.push(b)}});let o=new F,c=new Map;for(let u of r.values())for(let h of u)c.set(h.m,(c.get(h.m)??!0)&&u.length>=2);for(let u of r.values()){let h=u.filter(g=>c.get(g.m));if(h.length<2)continue;let d=[];for(let g of h){let b=g.m.geometry,v=b.clone();v.morphAttributes={},v.clearGroups(),b.index&&g.count!==1/0&&v.setIndex(Array.from(b.index.array.slice(g.start,g.start+g.count))),o.multiplyMatrices(s,g.m.matrixWorld),v.applyMatrix4(o),d.push(v)}let f=vt(d,!1);if(d.forEach(g=>g.dispose()),!f){h.forEach(g=>c.set(g.m,!1));continue}f.computeBoundingSphere();let p=h[0].m,m=new k(f,h[0].mat);m.name="aw:merged",m.castShadow=p.castShadow,m.receiveShadow=p.receiveShadow,m.renderOrder=p.renderOrder,m.matrixAutoUpdate=!1,e.add(m);for(let g of h)a.add(g.m);this.stats.merged++,this.stats.mergedFrom+=h.length}for(let u of a)if(c.get(u))if(u.children.length){let h=u.geometry;u.geometry=new re,h.dispose(),u.castShadow=!1}else u.parent?.remove(u),u.geometry.dispose();i=0,e.traverse(()=>i++),n.awMergedN=i,e.updateMatrixWorld(!0)}mergeAll(){let e=[this.real.mon?.group,this.real.brands?.group];for(let t of e)if(t)for(let n of t.children)this.merge(n)}hookHero(){let e=this.real.hero;if(!e)return;let t=e.update.bind(e),n=this.heroCap;e.update=(i,s)=>{t(i,s);let r=0;for(let a of e.list)!a._g||!a._g.visible||Math.hypot(a.x-i,a.z-s)>n&&(a._g.visible=!1,a._sign&&(a._sign.visible=!1),r++);this.stats.heroHidden=r}}trim(e,t){this.trimPending=!1;let n=this.real,i=n.M,s=n.q.radius+300,r=0;for(let a of[...n.regions.values()]){if(a.state==="loading")continue;let o=i.X0+(a.rx+.5)*i.RS,c=i.Z0+(a.rz+.5)*i.RS;Math.hypot(o-e,c-t)-i.RS*.71>s&&(n.disposeRegion(a),r++)}r&&this.stats.changes.push("dropped "+r+" far regions")}hookUpdate(){let e=this.real,t=e.update.bind(e);e.update=(...n)=>{t(...n),this.trimPending&&this.trim(n[0],n[2]);for(let i of e.regions.values())i.group&&this.freeze(i.group,this.regionChanged);this.inst&&(this.inst.update(e.regions,n[0],n[2]),this.stats.instFolded=this.inst.folded,this.stats.instBuckets=this.inst.buckets),this.fixPost()};for(let n of[e.mon?.group,e.brands?.group,e.hero?.group])n&&this.freeze(n)}fixCar(){let e=this.g.car;if(!e||this.carDone.has(e))return;this.carDone.add(e);let t=0,n=0;e.traverse(r=>{r.isMesh&&t++}),e.updateMatrixWorld(!0);let i=e.matrixWorld.clone();e.matrixWorld.identity(),e.children.forEach(r=>r.updateMatrixWorld(!0)),this.merge(e,r=>/^Wheel(Front|Rear)(L|R)$/.test(r.name));let s=e.wheels||[];for(let r of s)this.merge(r.o);e.matrixWorld.copy(i),e.updateMatrixWorld(!0),e.traverse(r=>{r.isMesh&&n++}),this.stats.carMeshes=t+" -> "+n}fixPeds(){if(this.pedsDone||!this.mobile)return;let e=this.real.amb;if(!e)return;this.pedsDone=!0;let t=this.real.q.name,n=t==="high"?5:t==="med"?4:2,i=e.peds.length;for(let s of e.peds.splice(n))s.g.visible=!1,s.g.parent?.remove(s.g);for(let s of e.peds)s.g.traverse(r=>{r.castShadow=!1});this.stats.peds=i+" -> "+e.peds.length+" (no shadows)"}update(e){this.t-=e,!(this.t>0)&&(this.t=1,this.fixGlass(),this.fixCar(),this.fixPeds(),this.mergeAll())}};var Ia=class{constructor(e){x(this,"g",e);x(this,"postDone",!1);let t=e.real,n=t.sky.sun.shadow;n.radius=t.q.name==="high"?6:t.q.name==="med"?4.5:3.5,t.roads.asphalt?.color?.isColor&&t.roads.asphalt.color.set(15001838);let i=new L(.94,1.06,.9);for(let s of["mFrond","mCanopy","mShrub"]){let r=t.veg[s];r&&r.color&&r.color.isColor&&r.color.multiply(i)}}update(e){let t=window.__awPost;if(!t||!t.grade)return;let n=t.grade.uniforms;this.postDone||(this.postDone=!0,n.uVib.value=.68,n.uContrast.value=1.12,n.uVig.value=.14,n.uLift.value.set(.008,.007,.002)),t.bloom&&(t.bloom.strength=.16+.04*e,t.bloom.threshold=1.05+.25*e)}};function Sd(l){let e=l*2654435761>>>0||1;return()=>(e=e*1664525+1013904223>>>0)/4294967296}function wb(){let l=[],e=[],t=[],n=[];for(let s=0;s<3;s++){let r=s*Math.PI/3,a=Math.cos(r)*.5,o=Math.sin(r)*.5,c=l.length/3;l.push(-a,0,-o,a,0,o,a,1,o,-a,1,-o),e.push(0,0,1,0,1,1,0,1);for(let u=0;u<4;u++)t.push(0,1,0);n.push(c,c+1,c+2,c,c+2,c+3)}let i=new re;return i.setAttribute("position",new ce(l,3)),i.setAttribute("normal",new ce(t,3)),i.setAttribute("uv",new ce(e,2)),i.setIndex(n),i}function Sb(){let l=[],e=[];for(let n=0;n<10;n++){let i=n/10*Math.PI*2+n%2*.3,s=.55+n%3*.15,r=.55+n%4*.08,a=Math.cos(i),o=Math.sin(i),c=-o*.05,u=a*.05,h=[a*Math.sin(s)*r,Math.cos(s)*r,o*Math.sin(s)*r];l.push(c,0,u,-c,0,-u,h[0],h[1],h[2]),l.push(-c,0,-u,c,0,u,h[0],h[1],h[2]);for(let d=0;d<6;d++)e.push(a*.5,.8,o*.5)}let t=new re;return t.setAttribute("position",new ce(l,3)),t.setAttribute("normal",new ce(e,3)),t}function uc(l){let t=document.createElement("canvas");t.width=t.height=256;let n=t.getContext("2d"),i=Sd(l==="boug"?7:11);if(l==="scrub"){n.lineCap="round";for(let o=0;o<60;o++){let c=256*(.35+i()*.3),u=-Math.PI/2+(i()-.5)*2.2,h=256*(.25+i()*.6);n.strokeStyle=`rgb(${80+i()*30},${70+i()*25},${55+i()*20})`,n.lineWidth=1.5+i()*2,n.beginPath(),n.moveTo(c,256),n.lineTo(c+Math.cos(u)*h,256+Math.sin(u)*h),n.stroke()}for(let o=0;o<700;o++){let c=i(),u=.15+Math.pow(i(),.8)*.8,h=256*(.5+(c-.5)*(.5+.5*u)),d=256*(1-u*.95),f=85+i()*50;n.fillStyle=`rgb(${f*.78+i()*20},${f},${f*.55})`,n.beginPath(),n.ellipse(h,d,2.5+i()*3,1.6+i()*2,i()*Math.PI,0,Math.PI*2),n.fill()}let a=new ue(t);return a.colorSpace=J,a.anisotropy=2,a}let s=l==="boug"?520:260;for(let a=0;a<s;a++){let o=i(),c=Math.pow(i(),.7),u=l==="grape"?.62*Math.sqrt(Math.max(0,1-Math.pow(c*1.05-.45,2)*3.2)):.35+.65*(1-c*.6),h=256*(.5+(o-.5)*u),d=256*(1-c*.95),f=70+i()*70;n.fillStyle=l==="boug"?`rgb(${30+i()*30},${f},${25+i()*25})`:i()<.12?`rgb(${150+i()*40},${90+i()*30},40)`:`rgb(${90+i()*40},${f+60},${45+i()*25})`,n.beginPath();let p=l==="boug"?5+i()*6:9+i()*9;n.ellipse(h,d,p,p*(l==="boug"?.6:.85),i()*Math.PI,0,Math.PI*2),n.fill()}if(l==="boug")for(let a=0;a<260;a++){let o=i(),c=.25+Math.pow(i(),.6)*.72,u=256*(.5+(o-.5)*(.3+.6*(1-c*.5))),h=256*(1-c*.95),d=i()<.8?318+i()*20:20+i()*15;n.fillStyle=`hsl(${d},${75+i()*20}%,${45+i()*15}%)`,n.beginPath(),n.arc(u,h,3+i()*5,0,Math.PI*2),n.fill()}let r=new ue(t);return r.colorSpace=J,r.anisotropy=2,r}var Pa=class{constructor(e,t,n=!1){x(this,"g",e);x(this,"stats",{skipped:0,regions:0,boug:0,aloe:0,grape:0,scrub:0,ac:0,awn:0,drawn:0});x(this,"card",wb());x(this,"aloe",Sb());x(this,"mBoug");x(this,"mGrape");x(this,"mAloe");x(this,"mScrub");x(this,"mAC",new Le({color:15329249,roughness:.55,metalness:.15}));x(this,"mAwn",new Le({color:16777215,roughness:.8,metalness:0}));x(this,"acGeo",(()=>{let e=new ke(.85,.55,.42);return e.clearGroups(),e.translate(0,0,.21),e})());x(this,"awnGeo",(()=>{let e=new ke(1,.06,1);return e.clearGroups(),e.translate(0,0,.5),e})());x(this,"live",new Set);x(this,"gen",null);x(this,"genR",null);x(this,"budget",2);x(this,"lastX",1e9);x(this,"lastZ",1e9);x(this,"mul");x(this,"pools",null);x(this,"vegIdx",null);x(this,"vegSig","");x(this,"hb",null);x(this,"hbN",-1);n&&(this.pools=new Map);let i=e.real.q.name;this.mul=(i==="low"?.6:i==="med"?.85:e.real.q.id==="desktop"?1.4:1)*(t?.8:1);let s=o=>new Le({map:o,alphaTest:.45,side:Q,roughness:.85,metalness:0});this.mBoug=s(uc("boug")),this.mGrape=s(uc("grape")),this.mScrub=s(uc("scrub")),this.mAloe=new Le({color:new L(7311194),roughness:.6,metalness:0,side:Q});let r=e.real,a=r.update.bind(r);r.update=(...o)=>{a(...o),this.update(r.regions,o[0],o[2])}}heightAt(e,t){return this.g.real.heightAt(e,t)}bucket(e,t,n,i,s,r,a){let o=i.length/16;if(!o)return null;if(this.pools){let v=new Float32Array(i),y=new Float32Array(o),_=new Float32Array(o),S=1e9,E=-1e9,C=1e9,A=-1e9;for(let I=0;I<o;I++)y[I]=v[I*16+12],_[I]=v[I*16+14],S=Math.min(S,y[I]),E=Math.max(E,y[I]),C=Math.min(C,_[I]),A=Math.max(A,_[I]);let R=this.pools.get(r);R||this.pools.set(r,R={pool:new Oi(t,n,{name:"aw:flora:"+r,castShadow:!1,receiveShadow:!0,colored:!!a},this.g.real.group),range:s*Math.sqrt(this.mul)});let P={im:null,pool:R.pool,cols:a?new Float32Array(a):void 0,mats:v,cx:y,cz:_,n:o,range:R.range,box:[S,C,E,A]};return R.pool.add(P),P}let c=new q(t,n,o);c.name="aw:flora:"+r,c.frustumCulled=!1,c.castShadow=!1,c.receiveShadow=!0,c.matrixAutoUpdate=!1,c.count=0,c.visible=!1;let u=new Float32Array(i),h=new Float32Array(o),d=new Float32Array(o),f=1e9,p=-1e9,m=1e9,g=-1e9;for(let v=0;v<o;v++)h[v]=u[v*16+12],d[v]=u[v*16+14],f=Math.min(f,h[v]),p=Math.max(p,h[v]),m=Math.min(m,d[v]),g=Math.max(g,d[v]);let b;return a&&(b=new Float32Array(a),c.instanceColor=new We(new Float32Array(o*3),3)),e.group.add(c),{im:c,cols:b,mats:u,cx:h,cz:d,n:o,range:s*Math.sqrt(this.mul),box:[f,m,p,g]}}*build(e){let t=0,n=this.g.real.veg,i=Sd(e.rx*7919+e.rz*104729+13),s=new F,r=new K,a=new M,o=new M,c=new M(0,1,0),u=(A,R,P,I,D,N,O=.05)=>{r.setFromAxisAngle(c,N),o.set(R,this.heightAt(R,P)-O,P),a.set(I,D,I),s.compose(o,r,a);for(let U of s.elements)A.push(U)},h=[],d=[],f=[];for(let A of e.json?.b||[]){if((++t&31)===0&&(yield),!A.p||A.p.length<3||this.hidden(A))continue;let R=A.k==="house"||A.k==="res"||A.k==="apt";if(i()>(R?.38:.08)*this.mul)continue;let P=0,I=0;for(let[Fe,he]of A.p)P+=Fe,I+=he;P/=A.p.length,I/=A.p.length;let D=Math.floor(i()*A.p.length),[N,O]=A.p[D],[U,V]=A.p[(D+1)%A.p.length],Z=U-N,Y=V-O,ee=Math.hypot(Z,Y);if(ee<2.5)continue;let $=-Y/ee,ne=Z/ee,fe=(N+U)/2,ye=(O+V)/2;(fe-P)*$+(ye-I)*ne<0&&($=-$,ne=-ne);let de=1+Math.floor(i()*3);for(let Fe=0;Fe<de;Fe++){let he=.2+i()*.6,Ie=N+Z*he+$*.8,ge=O+Y*he+ne*.8;u(h,Ie,ge,1.5+i()*1.2,1.4+i()*1.4,i()*6.28)}}for(let[A,,R]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((A-this.M().X0)/this.M().RS)!==e.rx||Math.floor((R-this.M().Z0)/this.M().RS)!==e.rz||i()>.5*this.mul)continue;let P=1+Math.floor(i()*4);for(let I=0;I<P;I++){let D=i()*6.28,N=1.5+i()*4,O=.7+i()*.8;u(d,A+Math.cos(D)*N,R+Math.sin(D)*N,O,O*(.8+i()*.5),i()*6.28,.02)}}for(let[A,R,P]of this.vegFor(e,"p")){if((++t&255)===0&&(yield),R>3.5||Math.floor((A-this.M().X0)/this.M().RS)!==e.rx||Math.floor((P-this.M().Z0)/this.M().RS)!==e.rz||i()>.45*this.mul)continue;let I=i()*6.28,D=3+i()*5;u(f,A+Math.cos(I)*D,P+Math.sin(I)*D,2.4+i()*1.8,1.6+i()*1.4,i()*6.28)}let p=[],m=[],g=[],b=[2062988,14241584,15905076,3050327,8011421,15231634,2841027,16052712],v=new L,y=new K,_=new M(1,0,0),S=(A,R,P,I,D,N,O,U,V=0)=>{r.setFromAxisAngle(c,D),V&&r.multiply(y.setFromAxisAngle(_,V)),o.set(R,I,P),a.set(N,O,U),s.compose(o,r,a);for(let Z of s.elements)A.push(Z)};for(let A of e.json?.b||[]){if((++t&31)===0&&(yield),!A.p||A.p.length<3||this.hidden(A))continue;let R=A.k==="com"||A.k==="shop"||A.k==="retail",P=A.k==="house"||A.k==="res"||A.k==="apt";if(!R&&!P)continue;let I=0,D=0;for(let[U,V]of A.p)I+=U,D+=V;I/=A.p.length,D/=A.p.length;let N=A.h||4,O=Math.min(A.p.length,6);for(let U=0;U<O;U++){let[V,Z]=A.p[U],[Y,ee]=A.p[(U+1)%A.p.length],$=Y-V,ne=ee-Z,fe=Math.hypot($,ne);if(fe<3)continue;let ye=-ne/fe,de=$/fe,Fe=(V+Y)/2,he=(Z+ee)/2;(Fe-I)*ye+(he-D)*de<0&&(ye=-ye,de=-de);let Ie=Math.atan2(ye,de);if(i()<(R?.45:.28)*this.mul){let ge=.15+i()*.7,j=V+$*ge+ye*.03,Me=Z+ne*ge+de*.03,Qe=this.heightAt(j,Me),_t=N>6&&i()<.5?3+Math.floor(i()*Math.max(1,(N-4)/3))*3:0;S(p,j,Me,Qe+Math.min(N-.8,2.3+_t),Ie,1,1,1)}if(R&&fe>4&&i()<.5*this.mul){let ge=Math.min(fe*.8,3+i()*6),j=.5,Me=V+$*j+ye*.02,Qe=Z+ne*j+de*.02;S(m,Me,Qe,this.heightAt(Me,Qe)+Math.min(N-.4,2.9),Ie,ge,1,1.1+i()*.5,.32),v.setHex(b[Math.floor(i()*b.length)]).convertSRGBToLinear(),g.push(v.r,v.g,v.b)}}}let E=[];for(let[A,,R]of this.vegFor(e,"k")){if((++t&255)===0&&(yield),Math.floor((A-this.M().X0)/this.M().RS)!==e.rx||Math.floor((R-this.M().Z0)/this.M().RS)!==e.rz||i()>.7*this.mul)continue;let P=1+Math.floor(i()*3);for(let I=0;I<P;I++){let D=i()*6.28,N=2+i()*7;u(E,A+Math.cos(D)*N,R+Math.sin(D)*N,1.8+i()*2.2,1.1+i()*1.4,i()*6.28)}}this.stats.scrub+=E.length/16,this.stats.ac+=p.length/16,this.stats.awn+=m.length/16;let C=[];for(let A of[this.bucket(e,this.card,this.mBoug,h,180,"boug"),this.bucket(e,this.aloe,this.mAloe,d,110,"aloe"),this.bucket(e,this.card,this.mGrape,f,220,"grape"),this.bucket(e,this.card,this.mScrub,E,320,"scrub"),this.bucket(e,this.acGeo,this.mAC,p,140,"ac"),this.bucket(e,this.awnGeo,this.mAwn,m,260,"awn",g)])A&&C.push(A);this.stats.boug+=h.length/16,this.stats.aloe+=d.length/16,this.stats.grape+=f.length/16,this.stats.regions++,e.__awFlora=C,this.live.add(e)}hidden(e){let t=this.g.real,n=0,i=0;for(let[s,r]of e.p)n+=s,i+=r;n/=e.p.length,i/=e.p.length;for(let s of this.heroBoxes())if(n>s[0]&&n<s[2]&&i>s[1]&&i<s[3])return this.stats.skipped++,!0;try{if(t.mon&&t.mon.excluded&&t.mon.excluded(n,i,e))return this.stats.skipped++,!0;if(t.hero&&(t.hero.pts.length||t.hero.polys.length)&&this.nearHero(n,i)&&t.hero.hides(e.p))return this.stats.skipped++,!0}catch{}return!1}vegFor(e,t){let n=this.g.real.veg.lists,i=(n.k||[]).length+":"+(n.p||[]).length+":"+(n.k||[]).reduce((r,a)=>r+a.length,0)+":"+(n.p||[]).reduce((r,a)=>r+a.length,0);if(!this.vegIdx||i!==this.vegSig){this.vegSig=i,this.vegIdx=new Map;let r=this.M();for(let a of["k","p"])for(let o of n[a]||[])for(let c of o){let u=Math.floor((c[0]-r.X0)/r.RS)+","+Math.floor((c[2]-r.Z0)/r.RS),h=this.vegIdx.get(u);h||this.vegIdx.set(u,h={k:[],p:[]}),h[a].push(c)}}let s=this.vegIdx.get(e.rx+","+e.rz);return s?s[t]:[]}heroBoxes(){let e=this.g.real.hero,t=e&&e.list||[];if(this.hb&&this.hbN===t.length)return this.hb;this.hb=[],this.hbN=t.length;for(let n of t){let i=n.foot||(Array.isArray(n.hero?.hide_footprint)?n.hero.hide_footprint:null);if(i&&i.length>2){let s=1e9,r=1e9,a=-1e9,o=-1e9;for(let[c,u]of i)s=Math.min(s,c),a=Math.max(a,c),r=Math.min(r,u),o=Math.max(o,u);this.hb.push([s-6,r-6,a+6,o+6])}else Number.isFinite(n.x)&&this.hb.push([n.x-30,n.z-30,n.x+30,n.z+30])}return this.hb}nearHero(e,t){for(let n of this.heroBoxes())if(e>n[0]-60&&e<n[2]+60&&t>n[1]-60&&t<n[3]+60)return!0;return!1}M(){return this.g.real.M}cull(e,t,n){for(let i of e.__awFlora||[]){if(!i.im)continue;let s=i.range*i.range,r=Math.max(i.box[0]-t,0,t-i.box[2]),a=Math.max(i.box[1]-n,0,n-i.box[3]);if(r*r+a*a>=s){i.im.count=0,i.im.visible=!1;continue}let o=i.im.instanceMatrix.array,c=0;for(let u=0;u<i.n;u++){let h=i.cx[u]-t,d=i.cz[u]-n;if(h*h+d*d<s){let f=u*16,p=c*16;for(let m=0;m<16;m++)o[p+m]=i.mats[f+m];if(i.cols){let m=i.im.instanceColor.array;m[c*3]=i.cols[u*3],m[c*3+1]=i.cols[u*3+1],m[c*3+2]=i.cols[u*3+2]}c++}}i.im.count=c,i.im.visible=c>0,c&&(i.im.instanceMatrix.clearUpdateRanges(),i.im.instanceMatrix.addUpdateRange(0,c*16),i.im.instanceMatrix.needsUpdate=!0,i.cols&&(i.im.instanceColor.needsUpdate=!0))}}update(e,t,n){let i=performance.now();if(!this.gen){for(let r of e.values())if(!r.__awFlora&&r.state==="built"&&r.group&&r.json){this.gen=this.build(r),this.genR=r;break}}for(;this.gen&&performance.now()-i<this.budget;){if(this.genR&&this.genR.state!=="built"){this.gen=null;break}this.gen.next().done&&(this.gen=null,this.lastX=1e9)}for(let r of this.live)if(!r.group||!r.group.parent){for(let a of r.__awFlora||[])a.im&&a.im.dispose(),a.pool&&a.pool.remove(a);this.live.delete(r),this.lastX=1e9}if((t-this.lastX)**2+(n-this.lastZ)**2<36)return;this.lastX=t,this.lastZ=n;let s=0;if(this.pools){for(let r of this.pools.values())s+=r.pool.fill(t,n,-1,r.range);this.stats.drawn=s;return}for(let r of this.live){this.cull(r,t,n);for(let a of r.__awFlora||[])s+=a.im?a.im.count:0}this.stats.drawn=s}};var La=class{constructor(e,t){x(this,"g",e);x(this,"budget",t);x(this,"stats",{jobs:0,maxMs:0,ticks:0,maxJob:0});x(this,"ord",new WeakMap);x(this,"cost",[]);x(this,"ch",new MessageChannel);x(this,"pending",!1);window.__awJobB=-1,this.ch.port1.onmessage=()=>this.run()}frame(){let e=this.g.real;this.pending||!e.queue.length||(this.pending=!0,this.ch.port2.postMessage(0))}run(){this.pending=!1;let e=this.g.real,t=performance.now(),n=e.queue.length>120?this.budget*1.5:this.budget,i=0;for(;e.queue.length&&performance.now()-t<n;){let r=e.queue[0],a=this.ord.get(r.R)??0,o=this.cost[a]||0;if(i>0&&performance.now()-t+o>n)break;e.queue.shift(),this.ord.set(r.R,a+1);let c=performance.now();if(e.regions.get(r.R.rx+","+r.R.rz)===r.R)try{r.f()}catch(h){console.error("[aw-jobs]",h)}let u=performance.now()-c;this.cost[a]=this.cost[a]?this.cost[a]*.7+u*.3:u,u>this.stats.maxJob&&(this.stats.maxJob=u),this.stats.jobs++,i++}let s=performance.now()-t;this.stats.ticks++,s>this.stats.maxMs&&(this.stats.maxMs=s)}};var Ab=[13617856,12433840,11975099,14078664],Tb=[10508348,11232326,9720122,11693646],Eb=[14271098,14199472,9616823,14605264,14069376,11453338,10926543,13605516],Da=class{constructor(e,t,n=!0){x(this,"g",e);x(this,"walls",t);x(this,"useBatch",n);x(this,"mesh",null);x(this,"stats",{buildings:0,tris:0,masked:0,ms:0});x(this,"mask",new Uint8Array(1024*4));x(this,"tex",new st(this.mask,32,32,Vt,Kn));x(this,"t",0);x(this,"batch",null);this.tex.needsUpdate=!0,this.load().catch(i=>console.warn("[aw-far] disabled:",i))}async load(){let e=await fetch("./data/far/massing.bin");if(!e.ok)return;let t=await e.arrayBuffer(),n=new DataView(t);if(n.getUint32(0,!0)!==826693441)return;let i=performance.now(),s=n.getUint32(4,!0);if(t.byteLength<8+s*14){console.warn("[aw-far] massing.bin truncated",t.byteLength,s);return}let r=this.g.real,a=(A,R,P)=>this.walls&&(A>=7||R*P*4>350),o=0,c=0;for(let A=0;A<s;A++){let R=8+A*14,P=n.getInt16(R+4,!0)/20,I=n.getInt16(R+6,!0)/20,D=n.getUint8(R+8)/4,N=n.getUint8(R+9)/4;o+=4,c+=6,a(N,D,Math.hypot(P,I))&&(o+=16,c+=24)}let u=new Float32Array(o*3),h=new Float32Array(o*3),d=new Uint8Array(o*4),f=new Float32Array(o),p=new Uint32Array(c),m=0,g=0,b=new L,v=new L(13219740).convertSRGBToLinear(),y=(A,R,P,I,D,N,O)=>(u[m*3]=A,u[m*3+1]=R,u[m*3+2]=P,h[m*3]=I,h[m*3+1]=D,h[m*3+2]=N,d[m*4]=b.r*255,d[m*4+1]=b.g*255,d[m*4+2]=b.b*255,d[m*4+3]=255,f[m]=O,m++);for(let A=0;A<s;A++){let R=8+A*14,P=n.getInt16(R,!0)/2,I=n.getInt16(R+2,!0)/2,D=n.getInt16(R+4,!0)/20,N=n.getInt16(R+6,!0)/20,O=n.getUint8(R+8)/4,U=n.getUint8(R+9)/4,V=n.getUint8(R+10),Z=n.getUint8(R+11),Y=n.getUint16(R+12,!0),ee=Math.hypot(D,N)||1,$=-N/ee*O,ne=D/ee*O,fe=r.heightAt(P,I)-.5,ye=fe+.5+U,de=[[P-D-$,I-N-ne],[P+D-$,I+N-ne],[P+D+$,I+N+ne],[P-D+$,I-N+ne]],Fe=V>>4;b.setHex(Fe?Tb[Z&3]:Ab[Z&3]).convertSRGBToLinear().lerp(v,.35);let he=de.map(([ge,j])=>y(ge,ye,j,0,1,0,Y));if((de[1][0]-de[0][0])*(de[2][1]-de[0][1])-(de[1][1]-de[0][1])*(de[2][0]-de[0][0])<0?(p[g++]=he[0],p[g++]=he[1],p[g++]=he[2],p[g++]=he[0],p[g++]=he[2],p[g++]=he[3]):(p[g++]=he[0],p[g++]=he[2],p[g++]=he[1],p[g++]=he[0],p[g++]=he[3],p[g++]=he[2]),a(U,O,ee)){b.setHex(Eb[Z>>2&7]).convertSRGBToLinear().lerp(v,.4).multiplyScalar(.85);for(let ge=0;ge<4;ge++){let[j,Me]=de[ge],[Qe,_t]=de[ge+1&3],Pt=_t-Me,Lt=-(Qe-j),Du=Math.hypot(Pt,Lt)||1;Pt/=Du,Lt/=Du,((j+Qe)/2-P)*Pt+((Me+_t)/2-I)*Lt<0&&(Pt=-Pt,Lt=-Lt);let Nu=y(j,fe,Me,Pt,0,Lt,Y),Bp=y(Qe,fe,_t,Pt,0,Lt,Y),Ou=y(Qe,ye,_t,Pt,0,Lt,Y),kp=y(j,ye,Me,Pt,0,Lt,Y);p[g++]=Nu,p[g++]=Bp,p[g++]=Ou,p[g++]=Nu,p[g++]=Ou,p[g++]=kp}}}if(this.useBatch){this.buildBatch(u,h,d,f,p,o,c),this.stats.buildings=s,this.stats.ms=Math.round(performance.now()-i),this.t=0;return}let _=new re;_.setAttribute("position",new ie(u,3)),_.setAttribute("normal",new ie(h,3)),_.setAttribute("color",new ie(d,4,!0)),_.setAttribute("aReg",new ie(f,1)),_.setIndex(new ie(p,1));let S=new at({vertexColors:!0,side:2}),E=this.tex;S.onBeforeCompile=A=>{A.uniforms.uMask={value:E},A.vertexShader=A.vertexShader.replace("#include <common>",`#include <common>
attribute float aReg; uniform sampler2D uMask;`).replace("#include <project_vertex>",`#include <project_vertex>
  { float rx = floor(aReg / 32.0), rz = aReg - rx * 32.0;
    if (texture2D(uMask, (vec2(rx, rz) + 0.5) / 32.0).r > 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); }`)},S.customProgramCacheKey=()=>"awFarCity";let C=new k(_,S);C.name="aw:farCity",C.frustumCulled=!1,C.castShadow=!1,C.receiveShadow=!1,C.matrixAutoUpdate=!1,this.g.scene.add(C),this.mesh=C,this.stats.buildings=s,this.stats.tris=c/3,this.stats.ms=Math.round(performance.now()-i),this.t=0}buildBatch(e,t,n,i,s,r,a){let c=new Uint32Array(1025),u=new Uint32Array(1025);for(let R=0;R<r;R++)c[i[R]+1]++;for(let R=0;R<a;R+=3)u[i[s[R]]+1]+=3;for(let R=0;R<1024;R++)c[R+1]+=c[R],u[R+1]+=u[R];let h=new Uint32Array(r),d=c.slice(0,1024),f=u.slice(0,1024),p=new Float32Array(r*3),m=new Float32Array(r*3),g=new Uint8Array(r*4),b=new Uint32Array(a);for(let R=0;R<r;R++){let P=i[R],I=d[P]++;h[R]=I-c[P],p[I*3]=e[R*3],p[I*3+1]=e[R*3+1],p[I*3+2]=e[R*3+2],m[I*3]=t[R*3],m[I*3+1]=t[R*3+1],m[I*3+2]=t[R*3+2],g[I*4]=n[R*4],g[I*4+1]=n[R*4+1],g[I*4+2]=n[R*4+2],g[I*4+3]=n[R*4+3]}for(let R=0;R<a;R+=3){let P=i[s[R]],I=f[P];f[P]+=3,b[I]=h[s[R]],b[I+1]=h[s[R+1]],b[I+2]=h[s[R+2]]}let v=[];for(let R=0;R<1024;R++)u[R+1]>u[R]&&v.push(R);let y=new at({vertexColors:!0,side:2});y.customProgramCacheKey=()=>"awFarCityB";let _=new zn(v.length,r,a,y),S=v.length,E={cx:new Float32Array(S),cy:new Float32Array(S),cz:new Float32Array(S),r:new Float32Array(S),vis:new Uint16Array(S),nVis:0,reg:new Uint16Array(S),n:S},C=new W,A=new W;v.forEach((R,P)=>{let I=c[R],D=c[R+1],N=new re;N.setAttribute("position",new ie(p.subarray(I*3,D*3),3)),N.setAttribute("normal",new ie(m.subarray(I*3,D*3),3)),N.setAttribute("color",new ie(g.subarray(I*4,D*4),4,!0)),N.setIndex(new ie(b.subarray(u[R],u[R+1]),1)),N.computeBoundingSphere(),_.addInstance(_.addGeometry(N));let O=N.boundingSphere;E.cx[P]=O.center.x,E.cy[P]=O.center.y,E.cz[P]=O.center.z,E.r[P]=O.radius,E.reg[P]=R,P?C.union(A.copy(O)):C.copy(O)}),_.boundingSphere=C,_.name="aw:farCity",_.sortObjects=!1,_.perObjectFrustumCulled=!0,_.castShadow=!1,_.receiveShadow=!1,_.matrixAutoUpdate=!1,_.userData.awb=E,_.onBeforeRender=ac,this.g.scene.add(_),this.batch=E,this.mesh=_,this.stats.tris=a/3}update(e){let n=this.g.camera.position.y,i=Math.max(0,Math.min(1,(n-25)/140)),s=window;if(s.__awFar=12e3+1e4*i,s.__awFogK=1-.55*i,!this.mesh||(this.t-=e,this.t>0))return;this.t=.25;let r=this.g.real.regions;this.mask.fill(0);let a=0;for(let c of r.values()){if(c.state!=="built")continue;let u=c.rx,h=c.rz;u<0||h<0||u>31||h>31||(this.mask[(h*32+u)*4]=255,a++)}this.stats.masked=a;let o=this.batch;if(o){let c=0;for(let u=0;u<o.n;u++){let h=o.reg[u],d=Math.floor(h/32),f=h-d*32;this.mask[(f*32+d)*4]||(o.vis[c++]=u)}o.nVis=c;return}this.tex.needsUpdate=!0}};var Is={desktop:"high",high:"med",med:"low"},Na=class{constructor(e,t){x(this,"g",e);x(this,"stats",{lost:0,prCap:0});let n=e.renderer.domElement;n.addEventListener("webglcontextlost",i=>this.lost(i),!1),n.addEventListener("webglcontextrestored",()=>location.reload(),!1),t||(this.cap(),addEventListener("resize",()=>this.cap()))}tier(){let e=this.g.real.q;return e.id||e.name}cap(){let e=this.tier();if(e!=="high"&&e!=="desktop")return;let t=this.g.renderer,n=e==="desktop"?8e6:24e5,i=innerWidth*innerHeight,s=Math.min(devicePixelRatio||1,e==="desktop"?3:2),r=Math.max(1,Math.min(s,Math.sqrt(n/Math.max(1,i))));window.__awPRCap=r,t.getPixelRatio()>r+.01&&(t.setPixelRatio(r),this.stats.prCap=+r.toFixed(2),dispatchEvent(new Event("resize")))}lost(e){e.preventDefault(),this.stats.lost++;let t=this.tier(),n="aw_ctxlost_"+t,i=0;try{i=+(sessionStorage.getItem(n)||0)+1,sessionStorage.setItem(n,String(i))}catch{}if(i>=2&&Is[t])try{localStorage.setItem("aw_q",Is[t])}catch{}let s=document.createElement("div");s.textContent=i>=2&&Is[t]?`Graphics reset - switching to ${Is[t].toUpperCase()}\u2026`:"Graphics reset - reloading\u2026",s.style.cssText="position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:99999;background:#000c;color:#fff;padding:14px 18px;border-radius:12px;font:600 15px system-ui",document.body.appendChild(s),setTimeout(()=>{let r=new URL(location.href);i>=2&&Is[t]&&r.searchParams.delete("q"),location.href=r.toString()},2500)}};var Oa=class{constructor(e){x(this,"g",e);x(this,"c",document.createElement("canvas"));x(this,"x");x(this,"buf",new Float32Array(300));x(this,"i",0);x(this,"n",0);x(this,"t",0);x(this,"txt","");this.c.width=300,this.c.height=96,this.c.style.cssText="position:fixed;left:8px;bottom:8px;z-index:9999;pointer-events:none;background:#000a;border-radius:6px;width:300px;height:96px",document.body.appendChild(this.c),this.x=this.c.getContext("2d")}frame(e){if(this.buf[this.i]=e,this.i=(this.i+1)%this.buf.length,this.n=Math.min(this.n+1,this.buf.length),this.t+=e,this.t>500){this.t=0;let r=Array.from(this.buf.subarray(0,this.n)).sort((c,u)=>c-u),a=c=>r[Math.min(r.length-1,Math.floor(c*r.length))],o=this.g.renderer;this.txt=`p50 ${a(.5).toFixed(1)}  p95 ${a(.95).toFixed(1)}  p99 ${a(.99).toFixed(1)}  max ${r[r.length-1].toFixed(0)} ms \xB7 pr ${o.getPixelRatio().toFixed(2)}`}let t=this.x,n=300,i=96,s=70/50;t.clearRect(0,0,n,i);for(let r=0;r<this.n;r++){let a=this.buf[(this.i-this.n+r+this.buf.length)%this.buf.length];t.fillStyle=a<17.5?"#3c3":a<34?"#ec3":"#e33";let o=Math.min(70,a*s);t.fillRect(r,i-o,1,o)}t.fillStyle="#fff8",t.fillRect(0,i-16.7*s,n,1),t.fillRect(0,i-33.3*s,n,1),t.fillStyle="#fff",t.font="11px monospace",t.fillText(this.txt,4,12)}};function Fa(l){let e=new Map,t=new Map,n=l.clone();return Ad(l,n,function(i,s){e.set(s,i),t.set(i,s)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let s=i,r=e.get(i),a=r.skeleton.bones;s.skeleton=r.skeleton.clone(),s.bindMatrix.copy(r.bindMatrix),s.skeleton.bones=a.map(function(o){return t.get(o)}),s.bind(s.skeleton,s.bindMatrix)}),n}function Ad(l,e,t){t(l,e);for(let n=0;n<l.children.length;n++)Ad(l.children[n],e.children[n],t)}var Ui=class extends Et{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new xc(t)}),this.register(function(t){return new bc(t)}),this.register(function(t){return new Ec(t)}),this.register(function(t){return new Rc(t)}),this.register(function(t){return new Cc(t)}),this.register(function(t){return new _c(t)}),this.register(function(t){return new yc(t)}),this.register(function(t){return new Mc(t)}),this.register(function(t){return new wc(t)}),this.register(function(t){return new gc(t)}),this.register(function(t){return new Sc(t)}),this.register(function(t){return new vc(t)}),this.register(function(t){return new Tc(t)}),this.register(function(t){return new Ac(t)}),this.register(function(t){return new pc(t)}),this.register(function(t){return new Ua(t,ae.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ua(t,ae.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ic(t)})}load(e,t,n,i){let s=this,r;if(this.resourcePath!=="")r=this.resourcePath;else if(this.path!==""){let c=Jt.extractUrlBase(e);r=Jt.resolveURL(c,this.path)}else r=Jt.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},o=new Ii(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(c){try{s.parse(c,r,function(u){t(u),s.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s,r={},a={},o=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(o.decode(new Uint8Array(e,0,4))===Id){try{r[ae.KHR_BINARY_GLTF]=new Pc(e)}catch(h){i&&i(h);return}s=JSON.parse(r[ae.KHR_BINARY_GLTF].content)}else s=JSON.parse(o.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Bc(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let h=this.pluginCallbacks[u](c);h.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[h.name]=h,r[h.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){let h=s.extensionsUsed[u],d=s.extensionsRequired||[];switch(h){case ae.KHR_MATERIALS_UNLIT:r[h]=new mc;break;case ae.KHR_DRACO_MESH_COMPRESSION:r[h]=new Lc(s,this.dracoLoader);break;case ae.KHR_TEXTURE_TRANSFORM:r[h]=new Dc;break;case ae.KHR_MESH_QUANTIZATION:r[h]=new Nc;break;default:d.indexOf(h)>=0&&a[h]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+h+'".')}}c.setExtensions(r),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}};function Rb(){let l={};return{get:function(e){return l[e]},add:function(e,t){l[e]=t},remove:function(e){delete l[e]},removeAll:function(){l={}}}}function Ce(l,e,t){let n=l.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var ae={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},pc=class{constructor(e){this.parser=e,this.name=ae.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let s=t.json,o=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e],c,u=new L(16777215);o.color!==void 0&&u.setRGB(o.color[0],o.color[1],o.color[2],nt);let h=o.range!==void 0?o.range:0;switch(o.type){case"directional":c=new ws(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new qn(u),c.distance=h;break;case"spot":c=new Xn(u),c.distance=h,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,c.angle=o.spot.outerConeAngle,c.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}return c.position.set(0,0,0),Rt(c,o),o.intensity!==void 0&&(c.intensity=o.intensity),c.name=t.createUniqueName(o.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(o){return n._getNodeRef(t.cache,a,o)})}},mc=class{constructor(){this.name=ae.KHR_MATERIALS_UNLIT}getMaterialType(){return z}extendParams(e,t,n){let i=[];e.color=new L(1,1,1),e.opacity=1;let s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let r=s.baseColorFactor;e.color.setRGB(r[0],r[1],r[2],nt),e.opacity=r[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,J))}return Promise.all(i)}},gc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},xc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let s=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new B(s,s)}return Promise.all(i)}},bc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},vc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},_c=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new L(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let s=n.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],nt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,J)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},yc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},Mc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let s=n.attenuationColor||[1,1,1];return t.attenuationColor=new L().setRGB(s[0],s[1],s[2],nt),Promise.all(i)}},wc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_IOR}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Sc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let s=n.specularColorFactor||[1,1,1];return t.specularColor=new L().setRGB(s[0],s[1],s[2],nt),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,J)),Promise.all(i)}},Ac=class{constructor(e){this.parser=e,this.name=ae.EXT_MATERIALS_BUMP}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},Tc=class{constructor(e){this.parser=e,this.name=ae.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ce(this.parser,e,this.name)!==null?je:null}extendMaterialParams(e,t){let n=Ce(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},Ec=class{constructor(e){this.parser=e,this.name=ae.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let s=i.extensions[this.name],r=t.options.ktx2Loader;if(!r){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,r)}},Rc=class{constructor(e){this.parser=e,this.name=ae.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(o=c)}return n.loadTextureImage(e,r.source,o)}},Cc=class{constructor(e){this.parser=e,this.name=ae.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;let r=s.extensions[t],a=i.images[r.source],o=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(o=c)}return n.loadTextureImage(e,r.source,o)}},Ua=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),r=this.parser.options.meshoptDecoder;if(!r||!r.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){let o=i.byteOffset||0,c=i.byteLength||0,u=i.count,h=i.byteStride,d=new Uint8Array(a,o,c);return r.decodeGltfBufferAsync?r.decodeGltfBufferAsync(u,h,d,i.mode,i.filter).then(function(f){return f.buffer}):r.ready.then(function(){let f=new ArrayBuffer(u*h);return r.decodeGltfBuffer(new Uint8Array(f),u,h,d,i.mode,i.filter),f})})}else return null}},Ic=class{constructor(e){this.name=ae.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==ct.TRIANGLES&&c.mode!==ct.TRIANGLE_STRIP&&c.mode!==ct.TRIANGLE_FAN&&c.mode!==void 0)return null;let r=n.extensions[this.name].attributes,a=[],o={};for(let c in r)a.push(this.parser.getDependency("accessor",r[c]).then(u=>(o[c]=u,o[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let u=c.pop(),h=u.isGroup?u.children:[u],d=c[0].count,f=[];for(let p of h){let m=new F,g=new M,b=new K,v=new M(1,1,1),y=new q(p.geometry,p.material,d);for(let S=0;S<d;S++)o.TRANSLATION&&g.fromBufferAttribute(o.TRANSLATION,S),o.ROTATION&&b.fromBufferAttribute(o.ROTATION,S),o.SCALE&&v.fromBufferAttribute(o.SCALE,S),y.setMatrixAt(S,m.compose(g,b,v));let _=null;for(let S in o)if(S==="_COLOR_0"){let E=o[S];y.instanceColor=new We(E.array,E.itemSize,E.normalized)}else if(S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"){if(_===null){let C=y.geometry;_=new re,_.name=C.name;for(let A in C.attributes)_.setAttribute(A,C.attributes[A]);for(let A in C.morphAttributes)_.morphAttributes[A]=C.morphAttributes[A];C.index!==null&&_.setIndex(C.index),_.morphTargetsRelative=C.morphTargetsRelative;for(let A of C.groups)_.addGroup(A.start,A.count,A.materialIndex);C.boundingBox!==null&&(_.boundingBox=C.boundingBox.clone()),C.boundingSphere!==null&&(_.boundingSphere=C.boundingSphere.clone()),_.drawRange.start=C.drawRange.start,_.drawRange.count=C.drawRange.count,_.userData=Object.assign({},C.userData),y.geometry=_}let E=o[S];_.setAttribute(S,new We(E.array,E.itemSize,E.normalized))}Ae.prototype.copy.call(y,p),this.parser.assignFinalMaterial(y),f.push(y)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},Id="glTF",Ps=12,Td={JSON:1313821514,BIN:5130562},Pc=class{constructor(e){this.name=ae.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Ps),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Id)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Ps,s=new DataView(e,Ps),r=0;for(;r<i;){let a=s.getUint32(r,!0);r+=4;let o=s.getUint32(r,!0);if(r+=4,o===Td.JSON){let c=new Uint8Array(e,Ps+r,a);this.content=n.decode(c)}else if(o===Td.BIN){let c=Ps+r;this.body=e.slice(c,c+a)}r+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Lc=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ae.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,r=e.extensions[this.name].attributes,a={},o={},c={};for(let u in r){let h=Fc[u]||u.toLowerCase();a[h]=r[u]}for(let u in e.attributes){let h=Fc[u]||u.toLowerCase();if(r[u]!==void 0){let d=n.accessors[e.attributes[u]],f=Fi[d.componentType];c[h]=f.name,o[h]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(h,d){i.decodeDracoFile(u,function(f){for(let p in f.attributes){let m=f.attributes[p],g=o[p];g!==void 0&&(m.normalized=g)}h(f)},a,c,nt,d)})})}},Dc=class{constructor(){this.name=ae.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Nc=class{constructor(){this.name=ae.KHR_MESH_QUANTIZATION}},Ba=class extends Tt{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let r=0;r!==i;r++)t[r]=n[s+r];return t}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=a*2,c=a*3,u=i-t,h=(n-t)/u,d=h*h,f=d*h,p=e*c,m=p-c,g=-2*f+3*d,b=f-d,v=1-g,y=b-d+h;for(let _=0;_!==a;_++){let S=r[m+_+a],E=r[m+_+o]*u,C=r[p+_+a],A=r[p+_]*u;s[_]=v*S+y*E+g*C+b*A}return s}},Cb=new K,Oc=class extends Ba{interpolate_(e,t,n,i){let s=super.interpolate_(e,t,n,i);return Cb.fromArray(s).normalize().toArray(s),s}},ct={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Fi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Ed={9728:Mi,9729:$t,9984:Ul,9985:kl,9986:Bl,9987:Zn},Rd={33071:Nn,33648:ls,10497:Ht},hc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Fc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},fn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Ib={CUBICSPLINE:void 0,LINEAR:Bn,STEP:Un},dc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Pb(l){return l.DefaultMaterial===void 0&&(l.DefaultMaterial=new Le({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Rs})),l.DefaultMaterial}function Jn(l,e,t){for(let n in t.extensions)l[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Rt(l,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(l.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Lb(l,e,t){let n=!1,i=!1,s=!1;for(let c=0,u=e.length;c<u;c++){let h=e[c];if(h.POSITION!==void 0&&(n=!0),h.NORMAL!==void 0&&(i=!0),h.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(l);let r=[],a=[],o=[];for(let c=0,u=e.length;c<u;c++){let h=e[c];if(n){let d=h.POSITION!==void 0?t.getDependency("accessor",h.POSITION):l.attributes.position;r.push(d)}if(i){let d=h.NORMAL!==void 0?t.getDependency("accessor",h.NORMAL):l.attributes.normal;a.push(d)}if(s){let d=h.COLOR_0!==void 0?t.getDependency("accessor",h.COLOR_0):l.attributes.color;o.push(d)}}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o)]).then(function(c){let u=c[0],h=c[1],d=c[2];return n&&(l.morphAttributes.position=u),i&&(l.morphAttributes.normal=h),s&&(l.morphAttributes.color=d),l.morphTargetsRelative=!0,l})}function Db(l,e){if(l.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)l.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(l.morphTargetInfluences.length===t.length){l.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)l.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Nb(l){let e,t=l.extensions&&l.extensions[ae.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+fc(t.attributes):e=l.indices+":"+fc(l.attributes)+":"+l.mode,l.targets!==void 0)for(let n=0,i=l.targets.length;n<i;n++)e+=":"+fc(l.targets[n]);return e}function fc(l){let e="",t=Object.keys(l).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+l[t[n]]+";";return e}function Uc(l){switch(l){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Ob(l){return l.search(/\.jpe?g($|\?)/i)>0||l.search(/^data\:image\/jpeg/)===0?"image/jpeg":l.search(/\.webp($|\?)/i)>0||l.search(/^data\:image\/webp/)===0?"image/webp":l.search(/\.ktx2($|\?)/i)>0||l.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Fb=new F,Bc=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Rb,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,r=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let o=a.match(/Version\/(\d+)/);i=n&&o?parseInt(o[1],10):-1,s=a.indexOf("Firefox")>-1,r=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&r<98?this.textureLoader=new ys(this.options.manager):this.textureLoader=new As(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ii(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(r){return r._markDefs&&r._markDefs()}),Promise.all(this._invokeAll(function(r){return r.beforeRoot&&r.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(r){let a={scene:r[0][i.scene||0],scenes:r[0],animations:r[1],cameras:r[2],asset:i.asset,parser:n,userData:{}};return Jn(s,a,i),Rt(a,i),Promise.all(n._invokeAll(function(o){return o.afterRoot&&o.afterRoot(a)})).then(function(){for(let o of a.scenes)o.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){let r=t[i].joints;for(let a=0,o=r.length;a<o;a++)e[r[a]].isBone=!0}for(let i=0,s=e.length;i<s;i++){let r=e[i];r.mesh!==void 0&&(this._addNodeRef(this.meshCache,r.mesh),r.skin!==void 0&&(n[r.mesh].isSkinnedMesh=!0)),r.camera!==void 0&&this._addNodeRef(this.cameraCache,r.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),s=(r,a)=>{let o=this.associations.get(r);o!=null&&this.associations.set(a,o);for(let[c,u]of r.children.entries())s(u,a.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,r){return n.getDependency(e,r)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ae.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(s,r){n.load(Jt.resolveURL(t.uri,i.path),s,void 0,function(){r(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let r=hc[i.type],a=Fi[i.componentType],o=i.normalized===!0,c=new a(i.count*r);return Promise.resolve(new ie(c,r,o))}let s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(r){let a=r[0],o=hc[i.type],c=Fi[i.componentType],u=c.BYTES_PER_ELEMENT,h=u*o,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0,m,g;if(f&&f!==h){let b=Math.floor(d/f),v="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+b+":"+i.count,y=t.cache.get(v);y||(m=new c(a,b*f,i.count*f/u),y=new kn(m,f/u),t.cache.add(v,y)),g=new ln(y,o,d%f/u,p)}else a===null?m=new c(i.count*o):m=new c(a,d,i.count*o),g=new ie(m,o,p);if(i.sparse!==void 0){let b=hc.SCALAR,v=Fi[i.sparse.indices.componentType],y=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,S=new v(r[1],y,i.sparse.count*b),E=new c(r[2],_,i.sparse.count*o);a!==null&&(g=new ie(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let C=0,A=S.length;C<A;C++){let R=S[C];if(g.setX(R,E[C*o]),o>=2&&g.setY(R,E[C*o+1]),o>=3&&g.setZ(R,E[C*o+2]),o>=4&&g.setW(R,E[C*o+3]),o>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){let t=this.json,n=this.options,s=t.textures[e].source,r=t.images[s],a=this.textureLoader;if(r.uri){let o=n.manager.getHandler(r.uri);o!==null&&(a=o)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){let i=this,s=this.json,r=s.textures[e],a=s.images[t],o=(a.uri||a.bufferView)+":"+r.sampler;if(this.textureCache[o])return this.textureCache[o];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=r.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let d=(s.samplers||{})[r.sampler]||{};return u.magFilter=Ed[d.magFilter]||$t,u.minFilter=Ed[d.minFilter]||Zn,u.wrapS=Rd[d.wrapS]||Ht,u.wrapT=Rd[d.wrapT]||Ht,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Mi&&u.minFilter!==$t,i.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[o]=c,c}loadImageSource(e,t){let n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(h=>h.clone());let r=i.images[e],a=self.URL||self.webkitURL,o=r.uri||"",c=!1;if(r.bufferView!==void 0)o=n.getDependency("bufferView",r.bufferView).then(function(h){c=!0;let d=new Blob([h],{type:r.mimeType});return o=a.createObjectURL(d),o});else if(r.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(o).then(function(h){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(m){let g=new rt(m);g.needsUpdate=!0,d(g)}),t.load(Jt.resolveURL(h,s.path),p,void 0,f)})}).then(function(h){return c===!0&&a.revokeObjectURL(o),Rt(h,r),h.userData.mimeType=r.mimeType||Ob(r.uri),h}).catch(function(h){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),h});return this.sourceCache[e]=u,u}assignTexture(e,t,n,i){let s=this;return this.getDependency("texture",n.index).then(function(r){if(!r)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(r=r.clone(),r.channel=n.texCoord),s.extensions[ae.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[ae.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let o=s.associations.get(r);r=s.extensions[ae.KHR_TEXTURE_TRANSFORM].extendTexture(r,a),s.associations.set(r,o)}}return i!==void 0&&(r.colorSpace=i),e[t]=r,r})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,r=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,o=this.cache.get(a);o||(o=new un,Ke.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,o.sizeAttenuation=!1,this.cache.add(a,o)),n=o}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,o=this.cache.get(a);o||(o=new Ci,Ke.prototype.copy.call(o,n),o.color.copy(n.color),o.map=n.map,this.cache.add(a,o)),n=o}if(i||s||r){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),r&&(a+="flat-shading:");let o=this.cache.get(a);o||(o=n.clone(),s&&(o.vertexColors=!0),r&&(o.flatShading=!0),i&&(o.normalScale&&(o.normalScale.y*=-1),o.clearcoatNormalScale&&(o.clearcoatNormalScale.y*=-1)),this.cache.add(a,o),this.associations.set(o,this.associations.get(n))),n=o}e.material=n}getMaterialType(){return Le}loadMaterial(e){let t=this,n=this.json,i=this.extensions,s=n.materials[e],r,a={},o=s.extensions||{},c=[];if(o[ae.KHR_MATERIALS_UNLIT]){let h=i[ae.KHR_MATERIALS_UNLIT];r=h.getMaterialType(),c.push(h.extendParams(a,s,t))}else{let h=s.pbrMetallicRoughness||{};if(a.color=new L(1,1,1),a.opacity=1,Array.isArray(h.baseColorFactor)){let d=h.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],nt),a.opacity=d[3]}h.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",h.baseColorTexture,J)),a.metalness=h.metallicFactor!==void 0?h.metallicFactor:1,a.roughness=h.roughnessFactor!==void 0?h.roughnessFactor:1,h.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",h.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",h.metallicRoughnessTexture))),r=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=Q);let u=s.alphaMode||dc.OPAQUE;if(u===dc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===dc.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&r!==z&&(c.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new B(1,1),s.normalTexture.scale!==void 0)){let h=s.normalTexture.scale;a.normalScale.set(h,h)}if(s.occlusionTexture!==void 0&&r!==z&&(c.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&r!==z){let h=s.emissiveFactor;a.emissive=new L().setRGB(h[0],h[1],h[2],nt)}return s.emissiveTexture!==void 0&&r!==z&&c.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,J)),Promise.all(c).then(function(){let h=new r(a);return s.name&&(h.name=s.name),Rt(h,s),t.associations.set(h,{materials:e}),s.extensions&&Jn(i,h,s),h})}createUniqueName(e){let t=ve.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function s(a){return n[ae.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(o){return Cd(o,a,t)})}let r=[];for(let a=0,o=e.length;a<o;a++){let c=e[a],u=Nb(c),h=i[u];if(h)r.push(h.promise);else{let d;c.extensions&&c.extensions[ae.KHR_DRACO_MESH_COMPRESSION]?d=s(c):d=Cd(new re,c,t),c.mode===ct.TRIANGLE_STRIP?d=d.then(f=>rc(f,Cs)):c.mode===ct.TRIANGLE_FAN&&(d=d.then(f=>rc(f,Di))),i[u]={primitive:c,promise:d},r.push(d)}}return Promise.all(r)}loadMesh(e){let t=this,n=this.json,i=this.extensions,s=n.meshes[e],r=s.primitives,a=[];for(let o=0,c=r.length;o<c;o++){let u=r[o].material===void 0?Pb(this.cache):this.getDependency("material",r[o].material);a.push(u)}return a.push(t.loadGeometries(r)),Promise.all(a).then(async function(o){let c=o.slice(0,o.length-1),u=o[o.length-1],h=[];for(let f=0,p=u.length;f<p;f++){let m=u[f],g=r[f],b,v=c[f];if(g.mode===ct.TRIANGLES||g.mode===ct.TRIANGLE_STRIP||g.mode===ct.TRIANGLE_FAN||g.mode===void 0){let y=s.isSkinnedMesh===!0,_=m.hasAttribute("skinIndex")&&m.hasAttribute("skinWeight");y&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),b=y&&_?new ps(m,v):new k(m,v),b.isSkinnedMesh===!0&&b.normalizeSkinWeights()}else if(g.mode===ct.LINES)b=new gs(m,v);else if(g.mode===ct.LINE_STRIP)b=new Gn(m,v);else if(g.mode===ct.LINE_LOOP)b=new xs(m,v);else if(g.mode===ct.POINTS)b=new xt(m,v);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(b.geometry.morphAttributes).length>0&&Db(b,s),b.name=t.createUniqueName(s.name||"mesh_"+e),Rt(b,s),g.extensions&&Jn(i,b,g),t.assignFinalMaterial(b),h.push(b)}for(let f=0,p=h.length;f<p;f++)t.associations.set(h[f],{meshes:e,primitives:f});if(h.length===1)return s.extensions&&Jn(i,h[0],s),h[0];let d=new _e;s.extensions&&Jn(i,d,s),t.associations.set(d,{meshes:e});for(let f=0,p=h.length;f<p;f++)d.add(h[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Wn(Xl.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Li(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Rt(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let s=i.pop(),r=i,a=[],o=[];for(let c=0,u=r.length;c<u;c++){let h=r[c];if(h){a.push(h);let d=new F;s!==null&&d.fromArray(s.array,c*16),o.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new ms(a,o)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,r=[],a=[],o=[],c=[],u=[];for(let h=0,d=i.channels.length;h<d;h++){let f=i.channels[h],p=i.samplers[f.sampler],m=f.target,g=m.node,b=i.parameters!==void 0?i.parameters[p.input]:p.input,v=i.parameters!==void 0?i.parameters[p.output]:p.output;m.node!==void 0&&(r.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",b)),o.push(this.getDependency("accessor",v)),c.push(p),u.push(m))}return Promise.all([Promise.all(r),Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(u)]).then(function(h){let d=h[0],f=h[1],p=h[2],m=h[3],g=h[4],b=[];for(let y=0,_=d.length;y<_;y++){let S=d[y],E=f[y],C=p[y],A=m[y],R=g[y];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let P=n._createAnimationTracks(S,E,C,A,R);if(P)for(let I=0;I<P.length;I++)b.push(P[I])}let v=new Hn(s,void 0,b);return Rt(v,i),v})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){let r=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&r.traverse(function(a){if(a.isMesh)for(let o=0,c=i.weights.length;o<c;o++)a.morphTargetInfluences[o]=i.weights[o]}),r})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),r=[],a=i.children||[];for(let c=0,u=a.length;c<u;c++)r.push(n.getDependency("node",a[c]));let o=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(r),o]).then(function(c){let u=c[0],h=c[1],d=c[2];d!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Fb)});for(let f=0,p=h.length;f<p;f++)u.add(h[f]);if(u.userData.pivot!==void 0&&h.length>0){let f=u.userData.pivot,p=h[0];u.pivot=new M().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],p.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let s=t.nodes[e],r=s.name?i.createUniqueName(s.name):"",a=[],o=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return o&&a.push(o),s.camera!==void 0&&a.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(s.isBone===!0?u=new Ri:c.length>1?u=new _e:c.length===1?u=c[0]:u=new Ae,u!==c[0])for(let h=0,d=c.length;h<d;h++)u.add(c[h]);if(s.name&&(u.userData.name=s.name,u.name=r),Rt(u,s),s.extensions&&Jn(n,u,s),s.matrix!==void 0){let h=new F;h.fromArray(s.matrix),u.applyMatrix4(h)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);if(!i.associations.has(u))i.associations.set(u,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){let h=i.associations.get(u);i.associations.set(u,{...h})}return i.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,s=new _e;n.name&&(s.name=i.createUniqueName(n.name)),Rt(s,n),n.extensions&&Jn(t,s,n);let r=n.nodes||[],a=[];for(let o=0,c=r.length;o<c;o++)a.push(i.getDependency("node",r[o]));return Promise.all(a).then(function(o){for(let u=0,h=o.length;u<h;u++){let d=o[u];d.parent!==null?s.add(Fa(d)):s.add(d)}let c=u=>{let h=new Map;for(let[d,f]of i.associations)(d instanceof Ke||d instanceof rt)&&h.set(d,f);return u.traverse(d=>{let f=i.associations.get(d);f!=null&&h.set(d,f)}),h};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){let r=[],a=e.name?e.name:e.uuid,o=[];function c(f){f.morphTargetInfluences&&o.push(f.name?f.name:f.uuid)}fn[s.path]===fn.weights?(c(e),e.isGroup&&e.children.forEach(c)):o.push(a);let u;switch(fn[s.path]){case fn.weights:u=Zt;break;case fn.rotation:u=Kt;break;case fn.translation:case fn.scale:u=hn;break;default:n.itemSize===1?u=Zt:u=hn;break}let h=i.interpolation!==void 0?Ib[i.interpolation]:Bn,d=this._getArrayFromAccessor(n);for(let f=0,p=o.length;f<p;f++){let m=new u(o[f]+"."+fn[s.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),r.push(m)}return r}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Uc(t.constructor),i=new Float32Array(t.length);for(let s=0,r=t.length;s<r;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof Kt?Oc:Ba;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Ub(l,e,t){let n=e.attributes,i=new Re;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],o=a.min,c=a.max;if(o!==void 0&&c!==void 0){if(i.set(new M(o[0],o[1],o[2]),new M(c[0],c[1],c[2])),a.normalized){let u=Uc(Fi[a.componentType]);i.min.multiplyScalar(u),i.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=e.targets;if(s!==void 0){let a=new M,o=new M;for(let c=0,u=s.length;c<u;c++){let h=s[c];if(h.POSITION!==void 0){let d=t.json.accessors[h.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(o.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),o.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),o.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){let m=Uc(Fi[d.componentType]);o.multiplyScalar(m)}a.max(o)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}l.boundingBox=i;let r=new W;i.getCenter(r.center),r.radius=i.min.distanceTo(i.max)/2,l.boundingSphere=r}function Cd(l,e,t){let n=e.attributes,i=[];function s(r,a){return t.getDependency("accessor",r).then(function(o){l.setAttribute(a,o)})}for(let r in n){let a=Fc[r]||r.toLowerCase();a in l.attributes||i.push(s(n[r],a))}if(e.indices!==void 0&&!l.index){let r=t.getDependency("accessor",e.indices).then(function(a){l.setIndex(a)});i.push(r)}return Ve.workingColorSpace!==nt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ve.workingColorSpace}" not supported.`),Rt(l,e),Ub(l,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Lb(l,e.targets,t):l})}var Pd={head:1.3,thigh_l:.9,thigh_r:.9,upperarm_l:.9,upperarm_r:.9,spine_01:.95},Ld=[16734815,4171775,16765503,6213994,16748497,16751421,10185727],ka=class{constructor(e,t){x(this,"g",e);x(this,"stats",{kids:0,families:0,visible:0});x(this,"gl",[]);x(this,"pool",[]);x(this,"group",new _e);x(this,"cap");x(this,"shadows");x(this,"v",new M);let n=e.real.q.name;this.cap=n==="low"?3:n==="med"?8:14,this.shadows=!t,this.group.name="aw:kids",e.scene.add(this.group);let i=new Ui;Promise.all(["ped_maya","ped_sam"].map(s=>i.loadAsync(`./models/${s}.glb`))).then(s=>{this.gl=s,console.info("[aw-kids] models",s.map(r=>r.animations.map(a=>a.name).join("|")))}).catch(s=>console.warn("[aw-kids]",s))}make(e){if(!this.gl.length)return null;let t=this.gl[e%this.gl.length],n=Fa(t.scene);n.rotation.y=Math.PI;let i=new _e;i.add(n),i.scale.setScalar(.6+e%3*.04);let s=new L(Ld[e%Ld.length]),r=[];n.traverse(h=>{let d=h;if((d.isMesh||d.isSkinnedMesh)&&(d.castShadow=this.shadows,d.frustumCulled=!1,/accessory|held/i.test(d.name)&&(d.visible=!1),d.material)){let f=d.material.clone();/top/i.test(f.name||"")&&f.color&&f.color.copy(s),h.material=f}Pd[h.name]&&r.push([h,Pd[h.name]])});let a=new Ts(n),o=h=>t.animations.find(d=>d.name===h)||t.animations[0],c=a.clipAction(o("Walk_Brisk")),u=a.clipAction(o("Jog"));return c.play(),u.play(),u.setEffectiveWeight(0),c.time=Math.random()*c.getClip().duration,i.visible=!1,this.group.add(i),this.stats.kids++,{root:i,inner:n,mixer:a,walk:c,jog:u,bones:r,ped:null,slot:0}}update(e){let t=this.g.real.amb;if(!t||!this.gl.length)return;let n=this.g.camera.position,i=this.g.real;for(let o of t.peds)if(o.pedFlip=1,o.rd!==o.__rd){o.__rd=o.rd;for(let c of this.pool)c.ped===o&&(c.ped=null,c.root.visible=!1);if(o.__fam=0,o.rd&&Math.random()<.4){let c=Math.random();o.__fam=c<.06?3:c<.5?2:1;for(let u=0;u<o.__fam;u++){let h=this.pool.find(d=>!d.ped);if(!h&&this.pool.length<this.cap){let d=this.make(this.pool.length);d&&(this.pool.push(d),h=d)}if(!h)break;h.ped=o,h.slot=u}}}let s=0,r=0,a=new Set;for(let o of this.pool){let c=o.ped;if(!c||!c.rd||!c.g.visible){o.root.visible=!1;continue}let u=c.g.position;if(n.distanceToSquared(u)>19600){o.root.visible=!1;continue}a.has(c)||(a.add(c),r++);let h=c.g.rotation.y,d=-Math.sin(h),f=-Math.cos(h),p=o.slot===1?-1:1,m=o.slot===2?0:.75*p,g=o.slot===2?.9:.15,b=u.x+f*m-d*g,v=u.z-d*m-f*g;o.root.position.set(b,i.surfaceAt(b,v)+.02,v),o.root.rotation.y=h,o.root.visible=!0,s++;let y=c.sp||1.3,_=o.root.scale.x,S=y/(1.8*_),E=S>1.45?1:0;if(o.walk.setEffectiveWeight(1-E),o.jog.setEffectiveWeight(E),o.walk.timeScale=Math.min(1.6,S),o.jog.timeScale=Math.min(1.3,y/(3.2*_)),o.applied)for(let[C,A]of o.bones)C.scale.divideScalar(A);o.mixer.update(e),o.applied=!0;for(let[C,A]of o.bones)C.scale.multiplyScalar(A)}this.stats.visible=s,this.stats.families=r}};var Oe=()=>performance.now();function Bb(l){if(!l.length)return null;let e=new Map;for(let i of l){let s=i.geometry.attributes.position.array,r=i.material.uuid+"|"+Math.floor((s[0]+s[3]+s[6])/3/80)+","+Math.floor((s[2]+s[5]+s[8])/3/80),a=e.get(r);a||e.set(r,a=[]),a.push(i)}let t=l[0].parent.constructor,n=new t;for(let i of e.values()){let s=i[0],r=Object.keys(s.geometry.attributes),a=i.every(o=>!o.geometry.index&&Object.keys(o.geometry.attributes).join()===r.join());if(i.length>1&&a){let o=new s.geometry.constructor;for(let c of r){let u=0;for(let p of i)u+=p.geometry.attributes[c].array.length;let h=new Float32Array(u),d=s.geometry.attributes[c],f=0;for(let p of i)h.set(p.geometry.attributes[c].array,f),f+=p.geometry.attributes[c].array.length;o.setAttribute(c,new d.constructor(h,d.itemSize,d.normalized))}o.computeBoundingSphere();for(let c of i)c.geometry.dispose();s.geometry=o,n.add(s)}else for(let o of i)n.add(o)}return n}var za=class{constructor(e=4){x(this,"budget",e);x(this,"stats",{roadSlices:0,bldSlices:0,streetSlices:0,maxSlice:0,msPerM:0,msPerB:0,msPerW:0,stageMax:{}});let t=window;t.__awRoadJob=(n,i)=>this.roadJob(n,i),t.__awBldJob=(n,i,s)=>this.bldJob(n,i,s),t.__awStreetJob=(n,i)=>this.streetJob(n,i)}streetJob(e,t){let n=t.st,i=(c,u)=>Object.assign(Object.create(t),{st:{cars:[],walls:[],signs:[],...c},json:u}),s=[],r=[];if(n){let c=n.cars||[],u=Math.max(1,Math.round(this.budget*12));for(let p=0;p<c.length;p+=u){let m=c.slice(p,p+u);s.push(()=>t.group.add(e.streets.build(i({cars:m},null)))),r.push("cars")}s.push(()=>t.group.add(e.streets.build(i({},t.json)))),r.push("furniture");let h=n.walls||[],d=[],f=0;s.push(()=>{let p=Oe();for(;f<h.length;){let m=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerW||1))),g=Oe(),b=h.slice(f,f+m);e.streets.build(i({walls:b},null)).traverse(y=>{y.isMesh&&d.push(y)});let v=(Oe()-g)/b.length;if(this.stats.msPerW=this.stats.msPerW?this.stats.msPerW*.8+v*.2:v,f+=b.length,Oe()-p>this.budget*.6)return!1}return!0}),r.push("walls"),s.push(()=>{let p=Bb(d);p&&t.group.add(p)}),r.push("wallsMerge"),s.push(()=>t.group.add(e.streets.build(i({signs:n.signs||[]},null)))),r.push("signs"),n.pools&&n.pools.length&&(s.push(()=>t.group.add(e.marks.pools({pools:n.pools}))),r.push("pools"))}let a=0,o=()=>{let c=Oe();for(;a<s.length;){let u=Oe(),h=s[a]()!==!1,d=Oe()-u,f=r[a];if(h&&a++,d>(this.stats.stageMax[f]||0)&&(this.stats.stageMax[f]=+d.toFixed(1)),Oe()-c>this.budget*.6)break}this.stats.streetSlices++,this.note(Oe()-c),a<s.length&&e.queue.unshift({R:t,f:o})};return o}note(e){e>this.stats.maxSlice&&(this.stats.maxSlice=e)}roadJob(e,t){let n=t.json.roads,i=n.map(h=>{let d=0;for(let f=1;f<h.p.length;f++)d+=Math.hypot(h.p[f][0]-h.p[f-1][0],h.p[f][1]-h.p[f-1][1]);return d+20}),s=0,r=null,a=null,o=!1,c=h=>{let d=e.roadGrid(h);for(let[f,p]of d){let m=a.get(f);m?m.push(...p):a.set(f,p)}},u=()=>{let h=Oe();for(r||(r=e.junctionsNear(t),a=new Map);!o;){let d=Math.max(60,this.budget*.8/(this.stats.msPerM||.004)),f=s,p=0;for(;f<n.length&&(f===s||p+i[f]<d);)p+=i[f++];let m=Oe(),g=f>=n.length&&s>=n.length,b=g?e.roads.build({roads:[],junc:t.json.junc},r):e.roads.build({roads:n.slice(s,f),junc:[]},r);if(b.traverse(v=>{v.name=v.name||(g?"plate":"road")}),t.roadMesh?(t.roadMesh.add(b),c(b)):(t.roadMesh=b,t.group.add(b),c(b)),!g&&p>0){let v=(Oe()-m)/p;this.stats.msPerM=this.stats.msPerM?this.stats.msPerM*.8+v*.2:v}if(g?o=!0:s=f,Oe()-h>this.budget*.6)break}t.roadGrid=a,this.stats.roadSlices++,this.note(Oe()-h),o||e.queue.unshift({R:t,f:u})};return u}bldJob(e,t,n){let i=0,s=()=>{let r=Oe();for(;i<n.length;){let a=Math.max(1,Math.round(this.budget*.8/(this.stats.msPerB||.5))),o=n.slice(i,i+a),c=Oe(),u=e.buildings.build({b:o});u.traverse(d=>{d.isMesh&&(d.name="bld:"+(d.material.name||d.material.type))}),t.group.add(u);let h=(Oe()-c)/o.length;if(this.stats.msPerB=this.stats.msPerB?this.stats.msPerB*.8+h*.2:h,i+=o.length,Oe()-r>this.budget*.6)break}this.stats.bldSlices++,this.note(Oe()-r),i<n.length&&e.queue.unshift({R:t,f:s})};return s}};var Ga=class{constructor(e){x(this,"g",e);x(this,"on",!1);x(this,"n",0);x(this,"stats",{aoHalf:!1,shadowEvery:1,a2c:0});x(this,"a2c",new WeakSet);x(this,"scanT",0);let t=e.real?.q;if(!t||t.name!=="high")return;this.on=!0,window.__awAoT=5e3;let n=window.__awPost;if(n&&n.ao){let i=n.ao,s=i.setSize.bind(i);i.setSize=(r,a)=>s(Math.max(1,Math.ceil(r/2)),Math.max(1,Math.ceil(a/2))),i.updateGtaoMaterial({samples:8}),i.updatePdMaterial({samples:8}),n.resize(),this.stats.aoHalf=!0}this.stats.shadowEvery=2}coverage(){this.g.scene.traverse(e=>{let t=e.material;if(t)for(let n of Array.isArray(t)?t:[t])this.a2c.has(n)||(this.a2c.add(n),n.alphaTest>0&&!n.transparent&&!n.alphaToCoverage&&(n.alphaToCoverage=!0,n.needsUpdate=!0,this.stats.a2c++))})}frame(){if(!this.on)return;this.stats.aoHalf&&(this.scanT-=1/60)<=0&&(this.scanT=3,this.coverage());let e=this.g.renderer.shadowMap;e.autoUpdate=!1,(this.n++&1)===0&&(e.needsUpdate=!0)}};var Ha=class{constructor(e){x(this,"on",!1);x(this,"stats",{water:!1,veg3d:0});let t=e.real;if(!t||!t.q||t.q.name!=="high")return;this.on=!0;let n=t.water?.nrm;n&&H.get("hlwater")!=="0"&&(n.anisotropy=16,n.needsUpdate=!0,this.stats.water=!0),H.get("hlveg")!=="0"&&(t.q.veg3d=340),this.stats.veg3d=t.q.veg3d}};var Dd=new Map,Va=new Map,Bi=new ke(1,1,1);function ut(l,e,t=.5,n=.1){let i=Va.get(l);return i||(i=new Le({color:e,roughness:t,metalness:n}),Va.set(l,i)),i}function Ct(l,e,t=512,n=128,i=.42,s=.1){let r=Va.get(l);if(r)return r;let a=Dd.get(l);if(!a){let o=document.createElement("canvas");o.width=t,o.height=n;let c=o.getContext("2d");e(c,t,n),a=new ue(o),a.colorSpace=J,a.flipY=!1,a.anisotropy=4,Dd.set(l,a)}return r=new Le({map:a,roughness:i,metalness:s}),Va.set(l,r),r}function $e(l,e,t,n,i,s,r="bold",a="left",o="Arial, Helvetica, sans-serif"){l.font=`${r} ${i}px ${o}`,l.fillStyle=s,l.textAlign=a,l.textBaseline="middle",l.fillText(e,t,n)}function kb(l,e,t,n){l.save(),l.translate(e,t),l.scale(n,n),l.beginPath(),l.moveTo(-18,-30),l.lineTo(18,-30),l.lineTo(18,8),l.quadraticCurveTo(0,32,-18,8),l.closePath(),l.fillStyle="#1d4fb3",l.fill(),l.lineWidth=3,l.strokeStyle="#0d2a66",l.stroke(),l.fillStyle="#e9eef6",l.fillRect(-11,-22,22,22),l.fillStyle="#2e8b3a",l.beginPath(),l.ellipse(-14,10,6,13,.5,0,6.3),l.ellipse(14,10,6,13,-.5,0,6.3),l.fill(),l.fillStyle="#9aa3ad",l.fillRect(-2,-26,4,40),l.fillStyle="#1d4fb3",l.fillRect(-14,22,28,6),l.restore()}function Nd(l,e){return(t,n,i)=>{t.fillStyle="#f4f5f7",t.fillRect(0,0,n,i);let s=r=>(e?r:1-r)*n;t.fillStyle="#1747b8",t.fillRect(0,i*.3,n,i*.17),t.fillStyle="#f2c81e",t.fillRect(0,i*.5,n,i*.035),t.fillRect(0,i*.555,n,i*.02),kb(t,s(.36),i*.42,1.05),$e(t,"POLIS",s(.62),i*.385,38,"#ffffff","bold","center"),$e(t,"Servicio, Integridad, Seguridad.",s(.47),i*.7,19,"#c8202a","bold","center"),$e(t,String(l),s(.13),i*.18,30,"#111","bold","center"),$e(t,"\u260E100",s(.8),i*.18,24,"#1747b8","bold","center"),$e(t,String(l),s(.93),i*.42,34,"#111","bold","center"),t.strokeStyle="#1747b8",t.lineWidth=7;for(let r=0;r<2;r++)t.beginPath(),t.moveTo(s(.84+r*.035),i*.47),t.lineTo(s(.87+r*.035),i*.3),t.stroke()}}function Od(l){return(e,t,n)=>{e.fillStyle="#f4f5f7",e.fillRect(0,0,t,n);let i=s=>(l?s:1-s)*t;e.fillStyle="#1f3b73",e.fillRect(0,n*.6,t,n*.05),$e(e,"ForenSys",i(.45),n*.36,44,"#1f3b73","bold","center"),$e(e,"ARUBA \xB7 Accident Registration",i(.45),n*.52,16,"#1f3b73","bold","center")}}function Fd(l,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;if(t.fillStyle=l?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),l)t.strokeStyle="#ffffff",t.lineWidth=16,t.beginPath(),t.moveTo(s(.05),i*.62),t.bezierCurveTo(s(.35),i*.85,s(.55),i*.15,s(.95),i*.45),t.stroke(),t.strokeStyle="#8f6fb8",t.lineWidth=5,t.beginPath(),t.moveTo(s(.05),i*.66),t.bezierCurveTo(s(.35),i*.9,s(.55),i*.2,s(.95),i*.5),t.stroke(),t.fillStyle="#ffffff",t.fillRect(s(.42)-46,i*.22,92,30),$e(t,"InSan",s(.42),i*.22+15,24,"#2b6cc4","bold","center");else{t.fillStyle="#1f3a9c",t.fillRect(0,i*.5,n,i*.09),t.fillStyle="#e8ef1c",t.fillRect(s(.42)-n*.36,i*.5,n*.72,i*.09),$e(t,"AMBULANCE",s(.42),i*.545,30,"#1f3a9c","bold","center"),t.fillStyle="#1f3a9c",t.beginPath();let r=s(.06),a=s(0);t.moveTo(r,i*.5),t.lineTo(a,i*.5),t.lineTo(a,i*.59),t.fill()}}}function Ud(l,e){return(t,n,i)=>{let s=r=>(e?r:1-r)*n;t.fillStyle=l?"#f29ac4":"#e8ef1c",t.fillRect(0,0,n,i),l?(t.fillStyle="#ffffff",t.fillRect(0,i*.3,n,i*.05)):(t.fillStyle="#1f3a9c",t.fillRect(0,i*.3,n,i*.12)),$e(t,"911",s(.55),i*.62,44,l?"#ffffff":"#c8202a","bold","center"),l||$e(t,"PA SALBA BO BIDA",s(.55),i*.8,13,"#c8202a","bold","center")}}function kc(l,e,t,n,i,s,r){return Ct(l,a=>{a.fillStyle=e,a.fillRect(0,0,s,r),$e(a,t,s/2,r/2,i,n,"bold","center")},s,r)}function zb(l){return Ct("evPlate"+l,(e,t,n)=>{e.fillStyle="#f4f2ea",e.fillRect(0,0,t,n),e.strokeStyle="#1d3f8a",e.lineWidth=4,e.strokeRect(3,3,t-6,n-6),$e(e,"ARUBA",t/2,13,12,"#1d3f8a","bold","center"),$e(e,`A-${1e4+l*37}`,t/2,40,34,"#1d3f8a","bold","center")},256,64,.4,0)}var Ls=null,Bd=null;function Ds(){return Bd||(Bd=new Ui().loadAsync("./models/ev.glb?v=e1").then(l=>{let e=[];l.scene.traverse(t=>{var s;let n=/^ev(\d)_(?:L(\d)_([a-z]+)|(bar|mk))$/.exec(t.name);if(!n)return;let i=e[s=+n[1]]||(e[s]={lods:[new Map,new Map],bar:{p:new M,w:1}});n[3]&&t.isMesh?i.lods[+n[2]].set(n[3],t.geometry):n[4]==="bar"?i.bar={p:t.position.clone(),w:t.scale.x}:n[4]==="mk"&&(i.mk=t.position.clone())}),Ls=e}).catch(l=>{console.warn("[aw-ev] models/ev.glb",l)}))}var Ns=()=>!!Ls,Gb={everest:0,forensys:0,isuzu:1,ambY:2,ambP:2},Hb=45;function Vb(l,e){let t=l==="ambY"||l==="ambP",n=l==="ambP",i=l==="forensys",s=t?n?"#f29ac4":"#e8ef1c":"#f4f5f7",r=ut("evPaint"+s,s,.42,.1),a={paint:r,glass:ut("evGlass","#121a21",.08,.6),dark:ut("evDark","#1c1d20",.8,.05),chrome:ut("evChrome","#d6d9dc",.18,.95),light:ut("evLight","#eef2f5",.15,.3),tail:ut("evTail","#a3151a",.3,.1),plate:zb(e)};return t?(a.livr=Ct("abR"+l,Fd(n,!0),512,264),a.livl=Ct("abL"+l,Fd(n,!1),512,264),a.cabr=Ct("acR"+l,Ud(n,!0),256,192),a.cabl=Ct("acL"+l,Ud(n,!1),256,192),a.rear=kc("aback"+l,s,n?"InSan  911":"AMBULANCE",n?"#ffffff":"#1f3a9c",40,512,122)):i?(a.livr=Ct("fsR",Od(!0),768,128),a.livl=Ct("fsL",Od(!1),768,128),a.hood=a.rear=r):(a.livr=Ct(`pR${e}`,Nd(e,!0),768,128),a.livl=Ct(`pL${e}`,Nd(e,!1),768,128),a.hood=kc("hoodPolis","#f4f5f7","POLIS","#1747b8",64,256,128),a.rear=kc(`rear${e}`,"#f4f5f7",`\u260E100   ${e}`,"#1747b8",44,512,76)),a}function zd(l){let e=ut("evLight","#eef2f5",.15,.3),t=ut("evTail","#a3151a",.3,.1);e.emissive.setRGB(1,.95,.85).multiplyScalar(l*.6),t.emissive.setRGB(1,.12,.06).multiplyScalar(l),t.emissiveIntensity=1+2*l}var Wb=(()=>{let l=new Be(.5,12,6),e=l.attributes.position,t=n=>Math.sign(n)*Math.abs(2*n)**.3/2;for(let n=0;n<e.count;n++)e.setXYZ(n,t(e.getX(n)),t(e.getY(n)),t(e.getZ(n)));return l})(),kd=(l,e,t,n,i,s,r,a)=>{let o=new k(Wb,new z({color:e,toneMapped:!1}));return o.scale.set(s,r,a),o.position.set(t,n,i),o.name="aw:ebar",l.add(o),o};function Os(l,e=45){let t=new _e;t.name="aw:ev:"+l;let n=l==="ambY"||l==="ambP",s={g:t,bar:[],colors:l==="forensys"?[16752640,16752640]:n?[16715784,16777215]:[16715784,1720575]},r=()=>{let a=Ls&&Ls[Gb[l]];if(!a)return;let o=Vb(l,e),c=new fs;c.name="aw:evlod",a.lods.forEach((d,f)=>{let p=new _e;for(let[m,g]of d){let b=o[m];if(!b)continue;let v=new k(g,b);v.castShadow=f===0,v.matrixAutoUpdate=!1,p.add(v)}c.addLevel(p,f?Hb:0),p.visible=f===0}),t.add(c);let{p:u,w:h}=a.bar;for(let d of[-1,1])s.bar.push(kd(t,2105380,d*h*.25,u.y+.05,u.z,h*.48,.1,.26));if(n&&a.mk)for(let d of[-1,1])s.bar.push(kd(t,5246992,d*a.mk.x,a.mk.y,a.mk.z,.22,.14,.05))};return Ls?r():Ds().then(r),s}var Xb=new Be(.12,10,8);function Fs(l,e,t=!1){let n=new _e;n.name="aw:npc";let i=ut("skin"+(Math.random()*3|0),["#8a5a3a","#b07a52","#d2a07a"][Math.random()*3|0],.7,0),s=ut("shirt"+l,l,.8,0),r=ut("pants"+e,e,.8,0),a=new k(Bi,r);a.scale.set(.14,.82,.16),a.position.set(-.09,.41,0),a.geometry=Bi;let o=a.clone();o.position.x=.09,n.add(a,o);let c=new k(Bi,s);c.scale.set(.4,.6,.22),c.position.set(0,1.12,0),n.add(c);let u=new k(Xb,i);u.position.set(0,1.56,0),n.add(u);let h=p=>{let m=new _e;m.position.set(p*.25,1.38,0);let g=new k(Bi,s);return g.scale.set(.1,.62,.11),g.position.y=-.31,m.add(g),n.add(m),m},d=h(-1),f=h(1);if(t){let p=new k(Bi,ut("tablet","#202326",.3,.2));p.scale.set(.24,.32,.02),p.position.set(0,-.6,.12),f.add(p);let m=new k(Bi,new z({color:9422591,toneMapped:!1}));m.scale.set(.2,.27,.005),m.position.set(0,-.6,.135),f.add(m),f.rotation.x=-.9}return{g:n,armL:d,armR:f,legL:a,legR:o,t:Math.random()*10}}function ki(l,e,t,n=!1){if(l.t+=e,t==="walk"){let i=Math.sin(l.t*7)*.5;l.legL.rotation.x=i,l.legR.rotation.x=-i,l.armL.rotation.x=-i*.8,n||(l.armR.rotation.x=i*.8)}else if(l.legL.rotation.x=l.legR.rotation.x=0,t==="talk"){let i=Math.sin(l.t*2.3),s=Math.sin(l.t*3.1+1);l.armL.rotation.x=-.6-.5*Math.max(0,i),l.armL.rotation.z=-.25*s,n||(l.armR.rotation.x=-.4-.6*Math.max(0,s),l.armR.rotation.z=.3*i)}else l.armL.rotation.x=0,n||(l.armR.rotation.x=0);n&&(l.armR.rotation.x=t==="talk"?-.9-.4*Math.max(0,Math.sin(l.t*.7)):-.9)}function zi(l,e,t,n){let i=(e+t)*2.5%1,s=Math.floor(i*8);l.bar.forEach((r,a)=>{let o=r.material,c=a%2===0,u=n&&(c?s<4&&(s&1)===0:s>=4&&(s&1)===0);o.color.setHex(u?c?l.colors[0]:l.colors[1]:2105380),u&&o.color.multiplyScalar(3)})}function Wa(l){l.traverse(e=>{let t=e;t.isMesh&&t.material&&t.material.isMeshBasicMaterial&&t.material.dispose()})}var Gd=new ke(1,1,1),Xa=new L(1,.06,.04),qb=new L(.1,.25,1),Yb=new L(1,1,1),Us=new L(.12,.12,.14),zc={police:{body:"#f4f5f7",stripe:"#1747b8",a:Xa,b:qb},amb:{body:"#f6f6f2",stripe:"#d0121b",a:Xa,b:Yb},fire:{body:"#b5141c",stripe:"#f3f3f3",a:Xa,b:Xa}};function Zb(l,e,t,n){let i=l.children.filter(m=>m.isMesh&&m.material===e);if(!i.length)return null;l.updateMatrixWorld(!0);let s=l.matrixWorld.clone().invert(),r=new Es,a=new M,o=new M,c=24,u=t.min.z+(t.max.z-t.min.z)*.07,h=t.max.z-(t.max.z-t.min.z)*.07,d=(m,g,b)=>{a.set(m*(t.max.x+1),g,b).applyMatrix4(l.matrixWorld),o.set(-m,0,0).transformDirection(l.matrixWorld),r.set(a,o);let v=r.intersectObjects(i,!1)[0];if(!v)return null;let y=v.point.applyMatrix4(s);return y.x+=m*.012,y},f=[];for(let m of[-1,1]){let g=null;for(let b=0;b<=c;b++){let v=u+(h-u)*b/c,y=d(m,n-.08,v),_=d(m,n+.08,v),S=y&&_?[y,_]:null;if(g&&S){let[E,C]=m>0?[S,g]:[g,S];f.push(E[0].x,E[0].y,E[0].z,C[0].x,C[0].y,C[0].z,C[1].x,C[1].y,C[1].z,E[0].x,E[0].y,E[0].z,C[1].x,C[1].y,C[1].z,E[1].x,E[1].y,E[1].z)}g=S}}if(!f.length)return null;let p=new re;return p.setAttribute("position",new ce(f,3)),p}var qa=class{constructor(e){x(this,"g",e);x(this,"stats",{police:0,amb:0,fire:0,active:0,rolls:0});x(this,"st",new Map);x(this,"force",H.get("emerg")==="force");x(this,"time",0);x(this,"night",-1);x(this,"ext",null);Ds()}pickRole(){if(this.stats.rolls++,!this.force&&Math.random()>=.1)return null;let e=Math.random()*10;return e<6?"police":e<9?"amb":"fire"}setup(e,t){let n=this.g.real.amb?.mats||{},i=new Set(Object.values(n)),s=new Re;for(let f of e.g.children){let p=f;if(!p.isMesh||p.name.startsWith("aw:"))continue;p.geometry.computeBoundingBox(),s.union(p.geometry.boundingBox);let m=p.material;!t.paint&&!Array.isArray(m)&&!i.has(m)&&!m.userData?.pid&&m.color&&(t.paint=m)}t.box=s,t.paint&&(t.base={c:t.paint.color.clone(),r:t.paint.roughness,m:t.paint.metalness,cc:t.paint.clearcoat});let r=s.max.x-s.min.x,a=s.max.z-s.min.z,o=s.max.y,c=s.min.z+a*.55;t.bar=[-1,1].map(f=>{let p=new k(Gd,new z({color:Us,toneMapped:!1}));return p.scale.set(r*.3,.12,.28),p.position.set(f*r*.16,o+.06,c),p.name="aw:ebar",p.visible=!1,e.g.add(p),p});let u=s.min.y+(o-s.min.y)*.42,h=t.paint?Zb(e.g,t.paint,s,u):null,d=new k(h||Gd,new z({color:16777215}));h||(d.scale.set(r+.03,.16,a*.86),d.position.set(0,u,(s.min.z+s.max.z)/2)),d.name="aw:estripe",d.visible=!1,e.g.add(d),t.stripe=d}useModel(e,t,n){t.orig||(t.orig=e.g.children.filter(a=>!a.name.startsWith("aw:"))),t.model&&(e.g.remove(t.model.g),Wa(t.model.g),t.model=void 0);let i=(n==="police"||n==="amb")&&Ns();for(let a of t.orig)a.visible=!i;if(!i)return;let s=n==="police"?Math.random()<.6?"everest":"isuzu":Math.random()<.5?"ambY":"ambP",r=Os(s,[45,50,67,38,71][Math.random()*5|0]);e.g.add(r.g),t.model=r,t.mkind=s}apply(e,t,n){if(t.role&&this.stats[t.role]--,t.role=n,n&&this.stats[n]++,this.useModel(e,t,n),t.model){if(t.bar)for(let s of t.bar)s.visible=!1;t.stripe&&(t.stripe.visible=!1),t.on=Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10;return}n&&!t.bar&&this.setup(e,t);let i=t.paint;if(i&&t.base&&(n?(i.color.set(zc[n].body),i.roughness=.45,i.metalness=.1):(i.color.copy(t.base.c),i.roughness=t.base.r,i.metalness=t.base.m)),t.bar)for(let s of t.bar)s.visible=!!n;t.stripe&&(t.stripe.visible=!!n,n&&t.stripe.material.color.set(zc[n].stripe)),t.on=!!n&&Math.random()<.6,t.t=5+Math.random()*25,t.ph=Math.random()*10}update(e){this.time+=e;let t=Math.round(Math.max(0,Math.min(1,(Ne.value-.3)/.4))*50)/50;t!==this.night&&(this.night=t,zd(t));let i=this.g.real?.amb?.cars;if(!i)return;let s=0;for(let r of i){let a=this.st.get(r.g);if(a||(a={role:null,rd:null,on:!1,t:0,ph:0},this.st.set(r.g,a)),r.rd&&r.rd!==a.rd?(a.rd=r.rd,this.apply(r,a,this.pickRole())):(a.role==="police"||a.role==="amb")&&!a.model&&Ns()&&this.apply(r,a,a.role),a.role&&a.model){(a.t-=e)<=0&&(a.on=!a.on,a.t=a.on?15+Math.random()*25:10+Math.random()*25),zi(a.model,this.time,a.ph,a.on&&r.g.visible),a.on&&r.g.visible&&s++;continue}if(!a.role||!a.bar)continue;(a.t-=e)<=0&&(a.on=!a.on,a.t=a.on?15+Math.random()*25:10+Math.random()*25);let o=zc[a.role],[c,u]=a.bar,h=c.material,d=u.material;if(a.on&&r.g.visible){s++;let f=(this.time+a.ph)*2.5%1,p=Math.floor(f*8),m=p<4&&(p&1)===0,g=p>=4&&(p&1)===0;h.color.copy(m?o.a:Us).multiplyScalar(m?3:1),d.color.copy(g?o.b:Us).multiplyScalar(g?3:1)}else h.color.copy(Us),d.color.copy(Us)}this.stats.active=s}};var Ya=class{constructor(e,t){x(this,"g",e);x(this,"emerg",t);x(this,"force",H.get("crash")==="force");x(this,"tx",Math.min(10,Math.max(1,+(H.get("crashx")||1))));x(this,"next",this.force?4:60);x(this,"time",0);x(this,"sc",null);x(this,"stats",{scenes:0,active:!1,phase:0,x:0,z:0,police:!1,fs:!1,talk:0,fx:0,fz:0});Ds();let n=H.get("evshow");if(n){let i=()=>{this.amb()?this.showroom(n):setTimeout(i,1e3)};setTimeout(i,3e3)}}amb(){return this.g.real.amb||null}pt(e,t,n,i){let s=e.p,r=0;for(let a=1;a<s.length;a++){let o=s[a][0]-s[a-1][0],c=s[a][1]-s[a-1][1],u=Math.hypot(o,c)||1;if(r+u>=t||a===s.length-1){let h=Math.max(0,Math.min(1,(t-r)/u)),d=o/u,f=c/u;return{x:s[a-1][0]+o*h-f*n,z:s[a-1][1]+c*h+d*n,yaw:i>0?Math.atan2(d,f):Math.atan2(-d,-f)}}r+=u}return{x:s[0][0],z:s[0][1],yaw:0}}len(e){let t=0;for(let n=1;n<e.p.length;n++)t+=Math.hypot(e.p[n][0]-e.p[n-1][0],e.p[n][1]-e.p[n-1][1]);return t}put(e,t,n=0){let i=this.amb();e.position.set(t.x,i.w.surfaceAt(t.x,t.z)+.02,t.z),e.rotation.set(0,t.yaw+n,0)}start(){let e=this.amb();if(!e||e.cars.length<3)return!1;let t=this.g.camera.position,n=e.cars.filter(i=>i.rd&&i.v!==4&&i.g.visible&&!i.g.children.some(s=>s.name.startsWith("aw:ev"))&&i.L>100&&!i.rd.ow&&i.rd.w>=6).map(i=>({c:i,d:Math.hypot(i.g.position.x-t.x,i.g.position.z-t.z)})).filter(i=>i.d>50&&i.d<260).sort((i,s)=>i.d-s.d);for(let{c:i}of n){let s=i.s+i.dir*50;if(s<15||s>i.L-15||(i.dir>0?i.s:i.L-i.s)<40)continue;let a=e.cars.filter(u=>u!==i&&u.v!==4&&!u.g.children.some(h=>h.name.startsWith("aw:ev"))).sort((u,h)=>Math.hypot(h.g.position.x-t.x,h.g.position.z-t.z)-Math.hypot(u.g.position.x-t.x,u.g.position.z-t.z))[0];if(!a)return!1;for(let u of[i,a])e.cars.splice(e.cars.indexOf(u),1);let o=i.dir*Math.min(2.2,i.rd.w/4);a.rd=i.rd,a.g.visible=!0;let c=new _e;return c.name="aw:crash",e.group.add(c),this.sc={rd:i.rd,dirA:i.dir,lat:o,sA:i.s,sB:s,impact:0,A:i,B:a,phase:0,age:0,tCrash:0,root:c,drivers:[],talk:0},this.stats.scenes++,this.stats.active=!0,!0}return!1}clear(){let e=this.sc,t=this.amb();e.root.parent?.remove(e.root),Wa(e.root);for(let n of[e.A,e.B])n.rd=null,n.g.visible=!1,n.g.rotation.set(0,n.g.rotation.y,0),t&&t.cars.push(n);this.emerg&&(this.emerg.ext=null),this.sc=null,this.stats.active=!1,this.stats.phase=0}mover(e,t,n,i){let s=Os(e,[45,50,67][Math.random()*3|0]);return this.sc.root.add(s.g),{m:s,s:t,target:n,lat:i,sp:e==="forensys"?11:15,arrived:!1}}drive(e,t){let n=this.sc,i=n.dirA;if(!e.arrived){let r=(e.target-e.s)*i,a=Math.min(e.sp,Math.max(1.2,r*.8));e.s+=i*a*t,r<.3&&(e.arrived=!0)}let s=e.arrived?e.lat:n.lat+(e.lat-n.lat)*Math.max(0,1-Math.abs(e.target-e.s)/25);this.put(e.m.g,this.pt(n.rd,e.s,s,i))}update(e){e*=this.tx,this.time+=e;let t=this.sc;if(!t){(this.next-=e)<=0&&(this.next=this.force?6:60,(this.g.S&&this.g.S.mode||"walk")!=="plane"&&Ns()&&(this.force||Math.random()<.2)&&this.start());return}t.age+=e,this.stats.phase=t.phase,this.stats.police=!!t.police?.arrived,this.stats.fs=!!t.fs?.arrived,this.stats.talk=Math.round(t.talk),t.fs&&(this.stats.fx=t.fs.m.g.position.x,this.stats.fz=t.fs.m.g.position.z);let n=this.g.camera.position,i=this.pt(t.rd,(t.sA+t.sB)/2,t.lat,t.dirA);if(t.age>260||Math.hypot(i.x-n.x,i.z-n.z)>700){this.clear();return}this.stats.x=i.x,this.stats.z=i.z;let s=t.dirA;if(t.phase===0){let a=9*e;t.sA+=s*a,t.sB-=s*a;let o=(t.sB-t.sA)*s,c=Math.max(0,Math.min(1,1-(o-5)/40));this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s)),this.put(t.B.g,this.pt(t.rd,t.sB,-t.lat+2*t.lat*c,-s)),o<=4.6&&(t.phase=1,t.tCrash=t.age,this.put(t.A.g,this.pt(t.rd,t.sA,t.lat,s),.28),this.put(t.B.g,this.pt(t.rd,t.sB,t.lat*.75,-s),-.5),t.A.g.rotation.z=.02);return}let r=t.age-t.tCrash;if(r>3&&t.drivers.length===0)for(let[a,o]of[t.sA-s*1.5,t.sB+s*1.5].entries()){let c=Fs(["#2f6fb5","#c8452f","#3f8a4a","#e8c547"][Math.random()*4|0],["#2a2d33","#5a4a3a","#3b4f6b"][Math.random()*3|0]),u=this.pt(t.rd,o,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(c.g,u,a?Math.PI*.5:-Math.PI*.5),t.root.add(c.g),t.drivers.push(c)}for(let a of t.drivers)ki(a,e,"talk");if(r>8&&!t.police&&(t.police=this.mover(Math.random()<.6?"everest":"isuzu",s>0?0:t.rd.p.length&&this.len(t.rd),t.sA-s*Math.min(13,(s>0?t.sA:this.len(t.rd)-t.sA)-2),t.lat+Math.sign(t.lat||1)*.9)),t.police&&(this.drive(t.police,e),zi(t.police.m,this.time,0,!0),this.emerg)){let a=t.police.m.g.position;this.emerg.ext={d:Math.hypot(a.x-n.x,a.z-n.z),ph:0}}if(t.police?.arrived&&!t.fs&&(t.fs=this.mover("forensys",s>0?0:this.len(t.rd),t.sA-s*Math.min(24,(s>0?t.sA:this.len(t.rd)-t.sA)-1),t.lat+Math.sign(t.lat||1)*.9)),t.fs&&(this.drive(t.fs,e),zi(t.fs.m,this.time,1.3,!t.fs.arrived)),t.fs?.arrived&&!t.staff){t.staff=Fs("#1f3b73","#2a2d33",!0);let a=this.pt(t.rd,t.sA-s*22,t.lat+Math.sign(t.lat||1)*2.4,s);this.put(t.staff.g,a),t.root.add(t.staff.g),t.staffPos={x:a.x,z:a.z}}if(t.staff&&t.staffPos){let a=this.pt(t.rd,(t.sA+t.sB)/2,t.lat+Math.sign(t.lat||1)*3.4,s),o=a.x-t.staffPos.x,c=a.z-t.staffPos.z,u=Math.hypot(o,c);if(u>.4){let h=Math.min(u,1.3*e);t.staffPos.x+=o/u*h,t.staffPos.z+=c/u*h,this.put(t.staff.g,{x:t.staffPos.x,z:t.staffPos.z,yaw:Math.atan2(o,c)}),ki(t.staff,e,"walk",!0)}else{t.talk+=e,ki(t.staff,e,"talk",!0);let h=t.staff.g.position;t.staff.g.rotation.y=Math.atan2(i.x-h.x,i.z-h.z);for(let d of t.drivers)d.g.rotation.y=Math.atan2(h.x-d.g.position.x,h.z-d.g.position.z)}}}showroom(e){let t=this.amb(),[n,i]=e.split(",").map(Number);if(!t||!isFinite(n))return;let s=new _e;s.name="aw:evshow",t.group.add(s),["everest","isuzu","ambY","ambP","forensys"].forEach((o,c)=>{let u=Os(o,45),h=n+(c-2)*11;u.g.position.set(h,t.w.surfaceAt(h,i)+.02,i),u.g.rotation.y=Math.PI/2,s.add(u.g),setInterval(()=>zi(u,performance.now()/1e3,c,!0),50)});let r=Fs("#1f3b73","#2a2d33",!0);r.g.position.set(n+28,t.w.surfaceAt(n+28,i+4),i+4),s.add(r.g);let a=Fs("#c8452f","#3b4f6b");a.g.position.set(n+29,t.w.surfaceAt(n+29,i+4),i+4),a.g.rotation.y=-Math.PI/2,s.add(a.g),setInterval(()=>{ki(r,.05,"talk",!0),ki(a,.05,"talk")},50)}};var Gc=420,Bs=56,Za=class{constructor(e){x(this,"g");x(this,"marks");x(this,"smoke");x(this,"smokePos",new Float32Array(Bs*3));x(this,"smokeLife",new Float32Array(Bs));x(this,"smokeVel",new Float32Array(Bs*3));x(this,"i",0);x(this,"puff",0);x(this,"smokeClock",0);x(this,"lx",0);x(this,"lz",0);x(this,"tracking",!1);x(this,"lastSpeed",0);x(this,"baseFov",0);x(this,"m",new F);x(this,"q",new K);x(this,"p",new M);x(this,"sc",new M(1,1,1));x(this,"up",new M(0,1,0));x(this,"mode","");this.g=e;let t=new qt(.28,1).rotateX(-Math.PI/2),n=new z({color:1053978,transparent:!0,opacity:.56,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2});this.marks=new q(t,n,Gc),this.marks.name="aw:vehicle-skids",this.marks.count=0,this.marks.frustumCulled=!1,this.marks.renderOrder=1,this.marks.instanceMatrix.setUsage(ot),e.scene.add(this.marks),this.smokePos.fill(-1e4);let i=new re;i.setAttribute("position",new ie(this.smokePos,3).setUsage(ot));let s=document.createElement("canvas");s.width=s.height=64;let r=s.getContext("2d"),a=r.createRadialGradient(32,32,2,32,32,30);a.addColorStop(0,"rgba(220,225,228,.72)"),a.addColorStop(.42,"rgba(150,158,164,.34)"),a.addColorStop(1,"rgba(90,98,104,0)"),r.fillStyle=a,r.fillRect(0,0,64,64),this.smoke=new xt(i,new un({map:new ue(s),color:12962251,size:.46,transparent:!0,opacity:.25,depthWrite:!1,sizeAttenuation:!0})),this.smoke.name="aw:moto-smoke",this.smoke.frustumCulled=!1,this.smoke.renderOrder=2,e.scene.add(this.smoke);let o=document.createElement("style");o.textContent=`
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
}`,document.head.appendChild(o);let c=window;c.__awMotoEnabled=!0,c.__awMotoCam=(u,h,d,f)=>this.camera(u,h,d,f)}camera(e,t,n,i){let s=window;if(!i){s.__awMotoBump=Math.max(0,(s.__awMotoBump||0)-n*5);return}let r=Math.abs(t.s||0),a=performance.now()*.001,o=Math.max(0,Math.min(1,(r-25)/30)),c=Math.max(0,s.__awMotoBump||0),u=o*.025+c*.2,h=Math.sin(a*23)*u;e.x+=Math.cos(t.h)*h,e.z-=Math.sin(t.h)*h,e.y+=Math.sin(a*31)*u*.65+c*.08-.5,s.__awMotoBump=Math.max(0,c-n*4.5)}spawnSmoke(e){let t=this.puff,n=t*3,i=Math.sin(e.h),s=Math.cos(e.h);this.smokePos[n]=e.x+i*.78+(Math.random()-.5)*.22,this.smokePos[n+1]=e.y+.24+Math.random()*.12,this.smokePos[n+2]=e.z+s*.78+(Math.random()-.5)*.22,this.smokeVel[n]=(Math.random()-.5)*.3,this.smokeVel[n+1]=.38+Math.random()*.22,this.smokeVel[n+2]=(Math.random()-.5)*.3,this.smokeLife[t]=.72+Math.random()*.35,this.puff=(t+1)%Bs}updateSmoke(e){for(let t=0;t<Bs;t++){if(this.smokeLife[t]<=0)continue;let n=t*3;if(this.smokeLife[t]-=e,this.smokeLife[t]<=0){this.smokePos[n+1]=-1e4;continue}this.smokePos[n]+=this.smokeVel[n]*e,this.smokePos[n+1]+=this.smokeVel[n+1]*e,this.smokePos[n+2]+=this.smokeVel[n+2]*e,this.smokeVel[n]*=Math.pow(.2,e),this.smokeVel[n+2]*=Math.pow(.2,e)}this.smoke.geometry.getAttribute("position").needsUpdate=!0}update(e){let t=this.g,n=t.S,i=n.mode==="car"||n.mode==="moto",s=n.mode==="moto";n.mode!==this.mode&&(this.mode=n.mode,document.body.classList.toggle("awmoto",s),this.tracking=!1,this.lastSpeed=0);let r=t.camera;this.baseFov||(this.baseFov=r.fov);let a=n.car,o=i?Math.abs(a.s||0):0,c=s?this.baseFov+Math.min(6,Math.max(0,o-10)*.14):n.mode==="car"?this.baseFov+Math.min(14,Math.max(0,o-8)*.3):this.baseFov;if(Math.abs(r.fov-c)>.05&&(r.fov+=(c-r.fov)*Math.min(1,e*3),r.updateProjectionMatrix()),this.updateSmoke(e),!i)return;let u=t.held||{},h=window.__awDrift||0,d=Math.max(0,(this.lastSpeed-o)/Math.max(.001,e)),f=s?h>.22||(u.brake||d>14)&&o>9:(u.brake||d>16)&&o>14;if(this.lastSpeed=o,s&&f&&o>8)for(this.smokeClock+=e*(h>.5?1.6:1);this.smokeClock>.08;)this.smokeClock-=.08,this.spawnSmoke(a);else this.smokeClock=0;let p=a.x-this.lx,m=a.z-this.lz,g=p*p+m*m;if(!this.tracking||!f||g>25){this.lx=a.x,this.lz=a.z,this.tracking=!0;return}if(g<.7*.7)return;let b=Math.atan2(p,m);this.q.setFromAxisAngle(this.up,b),this.sc.set(1,1,Math.sqrt(g));let v=Math.sin(a.h),y=Math.cos(a.h),_=s?.75:1.3,S=s?[0]:[-.78,.78];for(let E of S)this.p.set((a.x+this.lx)/2+v*_+y*E,a.y+.04,(a.z+this.lz)/2+y*_-v*E),this.m.compose(this.p,this.q,this.sc),this.marks.setMatrixAt(this.i,this.m),this.i=(this.i+1)%Gc,this.marks.count=Math.min(Gc,this.marks.count+1);this.marks.instanceMatrix.needsUpdate=!0,this.lx=a.x,this.lz=a.z}};var Hc=560/3.6,$n=40,Hd=5.05,Kb=7,Vd=4.6,Wd=7.5,Vc=.56,jb=`
varying float vL; varying vec3 vN; varying vec3 vV;
void main(){
  vL = position.z;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,Jb=`
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
}`,$b=`
attribute float aLife; attribute float aSeed; varying float vLife; uniform float uScale;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = uScale * (0.35 + aLife * 0.9) * (0.7 + aSeed * 0.6) / max(0.5, -mv.z);
  gl_Position = projectionMatrix * mv;
}`,Qb=`
varying float vLife; uniform float uI;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.0;
  if (r > 1.0 || vLife >= 1.0) discard;
  vec3 col = vLife < 0.25 ? mix(vec3(0.75, 0.88, 1.0), vec3(1.0, 0.72, 0.32), vLife * 4.0)
                          : mix(vec3(1.0, 0.72, 0.32), vec3(0.85, 0.22, 0.04), (vLife - 0.25) / 0.75);
  float a = (1.0 - r) * pow(1.0 - vLife, 1.6) * uI;
  gl_FragColor = vec4(col * 1.6, a);
}`;function ev(){let l=document.createElement("canvas");l.width=l.height=64;let e=l.getContext("2d"),t=e.createRadialGradient(32,32,0,32,32,32);t.addColorStop(0,"rgba(225,238,255,1)"),t.addColorStop(.25,"rgba(150,190,255,0.6)"),t.addColorStop(.55,"rgba(255,140,40,0.3)"),t.addColorStop(1,"rgba(255,90,10,0)"),e.fillStyle=t,e.fillRect(0,0,64,64);let n=new ue(l);return n.colorSpace=J,n}function tv(){let l=[];for(let e=0;e<=14;e++){let t=e/14;l.push(new B(Math.max(.001,(1-t**1.25)*(1+.28*Math.sin(t*Math.PI))),t))}return new bs(l,18).rotateX(Math.PI/2)}var Ka=class{constructor(e){x(this,"g");x(this,"on",!1);x(this,"btn");x(this,"fx",new _e);x(this,"plane",null);x(this,"t",0);x(this,"lvl",0);x(this,"pressOn",!1);x(this,"pressT",0);x(this,"core");x(this,"outer");x(this,"glow");x(this,"parts");x(this,"pos",new Float32Array($n*3));x(this,"vel",new Float32Array($n*3));x(this,"life",new Float32Array($n).fill(1));x(this,"ttl",new Float32Array($n).fill(.2));x(this,"emit",0);x(this,"zoomed",!1);this.g=e;let t=document.createElement("button");this.btn=t,t.innerHTML="TURBO JET<small>tap \xB7 hold</small>",t.className="awturbo",t.title="Turbo jet (T): tap to latch, hold for a burst",t.addEventListener("pointerdown",c=>{c.preventDefault(),c.stopPropagation();try{t.setPointerCapture(c.pointerId)}catch{}this.press(c.timeStamp)});let n=c=>{c.preventDefault(),this.release(c.timeStamp)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),t.addEventListener("contextmenu",c=>c.preventDefault()),document.querySelector('#actions .grp[data-for="plane"]')?.appendChild(t);let i=document.createElement("style");i.textContent=`#actions button.awturbo{grid-column:span 2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;letter-spacing:.06em;background:linear-gradient(180deg,#3a5f9ab8,#1c2c4ab8);border-color:#9fc4ffcc;-webkit-user-select:none;user-select:none}
#actions button.awturbo small{font-size:10px;font-weight:600;opacity:.75;letter-spacing:.02em}
#actions button.awturbo.lit{background:radial-gradient(circle at 50% 120%,#fff6 0,#0000 60%),linear-gradient(180deg,#ffb347,#ff6a1a);color:#1a1a1a;border-color:#fff;box-shadow:0 0 16px #ff8c1acc,0 0 4px #bfe0ff inset}`,document.head.appendChild(i),window.addEventListener("keydown",c=>{c.code==="KeyT"&&!c.repeat&&e.S.mode==="plane"&&!(c.target instanceof HTMLInputElement)&&this.press(c.timeStamp)}),window.addEventListener("keyup",c=>{c.code==="KeyT"&&this.release(c.timeStamp)}),window.addEventListener("blur",c=>this.release(c.timeStamp));let s=document.getElementById("keyhelp");s&&!/turbo/i.test(s.textContent||"")&&(s.textContent+=" \xB7 T turbo jet (plane)"),this.core=this.plume(10273535,4223231,1,.5,1),this.core.scale.set(.3,.3,Vd),this.outer=this.plume(16760426,16734738,0,.6,1.7),this.outer.scale.set(Vc,Vc,Wd),this.glow=new ds(new Ei({map:ev(),color:13820671,blending:Yn,depthWrite:!1,transparent:!0,fog:!1,toneMapped:!1})),this.glow.position.z=.15,this.glow.scale.setScalar(3),this.glow.renderOrder=6;let r=new re;r.setAttribute("position",new ie(this.pos,3).setUsage(ot)),r.setAttribute("aLife",new ie(this.life,1).setUsage(ot)),r.setAttribute("aSeed",new ie(Float32Array.from({length:$n},()=>Math.random()),1)),this.parts=new xt(r,new bt({vertexShader:$b,fragmentShader:Qb,uniforms:{uI:{value:0},uScale:{value:300}},transparent:!0,depthWrite:!1,blending:Yn})),this.parts.frustumCulled=!1,this.parts.renderOrder=5;let a=new k(new At(.5,.36,.6,16,1,!0).rotateX(Math.PI/2),new Le({color:3816514,metalness:.8,roughness:.35,side:Q}));a.position.z=Hd-.3;let o=new _e;o.position.z=Hd,o.add(this.core,this.outer,this.glow,this.parts),this.fx.name="aw-turbo",this.fx.add(a,o),o.name="aw-turbo-flame"}plume(e,t,n,i,s){let r=new bt({vertexShader:jb,fragmentShader:Jb,transparent:!0,depthWrite:!1,side:Q,blending:Tl,blendSrc:El,blendDst:ta,uniforms:{uT:{value:0},uI:{value:0},uCore:{value:n},uOcc:{value:i},uGain:{value:s},uC0:{value:new L(e)},uC1:{value:new L(t)}}}),a=new k(tv(),r);return a.renderOrder=n?5:4,a.frustumCulled=!1,a}press(e){this.g.S.mode==="plane"&&(this.on?(this.set(!1),this.pressOn=!1):(this.set(!0),this.pressOn=!0,this.pressT=e))}release(e){this.pressOn&&e-this.pressT>350&&this.set(!1),this.pressOn=!1}set(e){this.on=e,this.btn.classList.toggle("lit",e)}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}update(e){let t=this.g.S.mode==="plane";!t&&this.on&&(this.set(!1),this.pressOn=!1);let n=window;if(n.__awTurbo=this.on&&t,n.__awTurboK=2,n.__awTurboV=Hc,this.lvl+=((this.on&&t?1:0)-this.lvl)*Math.min(1,e*(this.on?7:4)),this.lvl<.003&&!this.on&&(this.lvl=0),n.__awTurboLvl=this.lvl,this.on&&t){let u=this.g.S.plane;u.s>Hc&&(u.s=Hc)}this.fov(t);let i=t?this.findPlane():null;i&&this.fx.parent!==i&&i.add(this.fx),this.fx.visible=!!i;let s=this.fx.children[1];if(s.visible=this.lvl>0,!i||!s.visible)return;this.t+=e;let r=this.t,a=this.lvl,o=1+Math.sin(r*61)*.07+Math.sin(r*37+1.1)*.06+(Math.random()-.5)*.08;for(let u of[this.core,this.outer]){let h=u.material.uniforms;h.uT.value=r,h.uI.value=a}this.core.scale.z=Vd*(.45+.55*a)*o,this.outer.scale.z=Wd*(.4+.6*a)*(2-o);let c=1+(Math.random()-.5)*.06;this.outer.scale.x=this.outer.scale.y=Vc*c,this.glow.material.opacity=(.5+Math.random()*.2)*a,this.glow.scale.setScalar(3*(.8+.2*o)),this.particles(e,a)}particles(e,t){let n=this.pos,i=this.vel,s=this.life;this.emit+=e*$n/.2*t;for(let o=0;o<$n;o++){if(s[o]>=1){if(this.emit<1)continue;this.emit-=1;let c=Math.random()*.22,u=Math.random()*6.283;n[o*3]=Math.cos(u)*c,n[o*3+1]=Math.sin(u)*c,n[o*3+2]=Math.random()*.4,i[o*3]=(Math.random()-.5)*3.5,i[o*3+1]=(Math.random()-.5)*3.5,i[o*3+2]=28+Math.random()*18,s[o]=0,this.ttl[o]=.14+Math.random()*.16;continue}s[o]=Math.min(1,s[o]+e/this.ttl[o]),n[o*3]+=i[o*3]*e,n[o*3+1]+=i[o*3+1]*e,n[o*3+2]+=i[o*3+2]*e}this.emit=Math.min(this.emit,4);let r=this.parts.geometry;r.attributes.position.needsUpdate=!0,r.attributes.aLife.needsUpdate=!0;let a=this.parts.material;a.uniforms.uI.value=t,a.uniforms.uScale.value=this.g.renderer.domElement.height*.27}fov(e){let t=this.g.camera;if(!e&&!this.zoomed)return;let n=t.fov*Math.PI/360,i=Kb*(e?this.lvl:0)*Math.PI/360,s=i>1e-4?Math.tan(n)/Math.tan(n+i):1;Math.abs(t.zoom-s)>1e-4&&(t.zoom=s,t.updateProjectionMatrix()),this.zoomed=s!==1}};var nv=42,iv=56,sv=40,rv=l=>Math.atan2(Math.sin(l),Math.cos(l)),Xd=(l,e)=>Math.sign(l)*Math.pow(Math.abs(l),e),qd=(l,e,t)=>Math.max(e,Math.min(t,l)),Wc=l=>l.y-((l.g||0)+2),ja=class{constructor(e){x(this,"g");x(this,"ch",0);x(this,"cp",0);x(this,"cd",26);x(this,"camOn",!1);x(this,"lx",0);x(this,"lz",0);x(this,"res",{h:0,p:0,d:26});x(this,"gear");x(this,"gearK",0);x(this,"plane",null);x(this,"spawned",null);x(this,"mode","");this.g=e,this.gear=this.buildGear(),window.__awFly={gnd:t=>t.y<=(t.g||0)+2.05,ctl:(t,n,i,s,r)=>this.ctl(t,n,i,s,r),gs:t=>.6/(1+Math.abs(t.s)/15),acc:(t,n,i,s,r)=>this.acc(t,n,i,s,r),vy:(t,n,i,s)=>this.vy(t,n,s),cam:(t,n,i)=>this.cam(t,n,i),spawn:(t,n)=>this.spawn(t,n)}}ctl(e,t,n,i,s){let r=Xd(t,1.5)*1.15;e.q=(e.q||0)+(r-(e.q||0))*Math.min(1,i*7),e.p+=e.q*i;let a=Math.abs(t)<.08;if(a){let c=Wc(e),u=s?0:e.thr>.5?c<90?.1:c<140?.1*(140-c)/50:0:c<25?-.035:0;e.p+=(u-e.p)*(1-.4**i)}if(s){a&&e.s>iv&&e.thr>.5&&(e.p+=(.13-e.p)*Math.min(1,i*1.5));let c=e.s<nv?.02:.2;e.p>c&&(e.p+=(c-e.p)*Math.min(1,i*3)),e.p<0&&(e.p=0,e.q=Math.max(0,e.q))}let o=s?0:-Xd(n,1.4)*.85;e.r+=(o-e.r)*Math.min(1,i*(s?6:3.2))}acc(e,t,n,i,s){let r=!!window.__awTurbo,a=i&&s<-.3,o=a?0:t;i&&e.thr<.5&&(o*=(e.thr/.5)**2),i||(o=Math.max(o,sv));let c=(o-e.s)*.9,u=i?r?14:7.5:r?32:16;return qd(c,-(i?a?10:5:12),u)*n}vy(e,t,n){if(!n&&e.thr<.35&&(t-=(.35-e.thr)/.35*4.5),t>=0)return t;let i=Math.max(0,Wc(e));return i>45?t:Math.max(t,-(1.2+i*.5+i*i*.03))}cam(e,t,n){let s=(this.g.camera.aspect<.8?20:26)+Math.min(e.s,160)*.055+(window.__awTurboLvl||0)*3,r=Math.hypot(e.x-this.lx,e.z-this.lz)>300;return this.lx=e.x,this.lz=e.z,(!this.camOn||n||r)&&(this.ch=e.h,this.cp=e.p,this.cd=s,this.camOn=!0),this.ch+=rv(e.h-this.ch)*Math.min(1,t*3),this.cp+=(e.p-this.cp)*Math.min(1,t*3),this.cd+=(s-this.cd)*Math.min(1,t*1.5),this.res.h=this.ch,this.res.p=this.cp,this.res.d=this.cd,this.res}runway(){let e=this.g.DATA?.runways||[],t=null,n=0;for(let i of e){let s=Math.hypot(i[i.length-1][0]-i[0][0],i[i.length-1][1]-i[0][1]);s>n&&(n=s,t=i)}return t&&n>1500?{A:t[0],B:t[t.length-1],L:n}:null}spawn(e,t){if(t==="plane")return;let n=this.runway();if(!n)return;let i=(n.B[0]-n.A[0])/n.L,s=(n.B[1]-n.A[1])/n.L,r=e.x-n.A[0],a=e.z-n.A[1],o=r*i+a*s;if(Math.abs(r*s-a*i)>450||o<-600||o>n.L+600)return;let u=o<n.L/2,h=u?90:n.L-90,d=u?1:-1;e.x=n.A[0]+i*h,e.z=n.A[1]+s*h,e.h=Math.atan2(-i*d,-s*d);let f=this.g.real;e.g=f?Math.max(0,f.heightAt(e.x,e.z)):0,e.y=e.g+2,e.p=0,e.r=0,e.s=0,e.thr=0,e.q=0,this.spawned={x:e.x,z:e.z},this.camOn=!1;let p=document.getElementById("toast");p&&(p.textContent=`Runway ${u?"29":"11"}, Queen Beatrix \xB7 hold THR+ to take off \xB7 DIVE brakes`,p.classList.add("on"),setTimeout(()=>p.classList.remove("on"),4500))}buildGear(){let e=new _e;e.name="aw-gear";let t=new Le({color:12106948,metalness:.6,roughness:.4}),n=new Le({color:1776413,roughness:.9}),i=new At(.07,.07,1,6).translate(0,-.5,0),s=new At(.26,.26,.22,12).rotateZ(Math.PI/2);for(let[r,a,o]of[[0,-3.3,-.45],[-1.15,.4,-.55],[1.15,.4,-.55]]){let c=new _e;c.position.set(r,o,a);let u=o+1.74,h=new k(i,t);h.scale.y=u,c.add(h);let d=new k(s,n);d.position.y=-u,c.add(d),e.add(c)}return e.visible=!1,e}findPlane(){if(this.plane&&this.plane.parent)return this.plane;let e=this.g.S.plane;for(let t of this.g.scene.children)if(t.isGroup&&t!==this.g.car&&t.children.length>=5&&Math.abs(t.position.x-e.x)<.01&&Math.abs(t.position.z-e.z)<.01&&Math.abs(t.position.y-e.y)<.01)return this.plane=t;return null}get planeObj(){return this.findPlane()}update(e){let t=this.g.S;if(t.mode!==this.mode&&(this.mode=t.mode,t.mode!=="plane"&&(this.camOn=!1)),t.mode!=="plane")return;let n=t.plane;if(this.spawned){if(Math.hypot(n.x-this.spawned.x,n.z-this.spawned.z)>20){let r=this.g.real;n.y=Math.max((r?r.heightAt(n.x,n.z):0)+200,250),n.s=65,n.thr=.65,n.p=.05}this.spawned=null}let i=this.findPlane();if(!i)return;this.gear.parent!==i&&i.add(this.gear);let s=Wc(n)<(this.gearK>.5?70:55);this.gearK=qd(this.gearK+(s?e:-e)/1.6,0,1),this.gear.visible=this.gearK>.01,this.gear.scale.setScalar(this.gearK),this.gear.position.y=(1-this.gearK)*.4}};var Gi=[4380,4538,4696,4848,4999,5150,5308,5466,5629,5789],ks=8542,Ja=80,Yd=44,$a=class{constructor(e){x(this,"g",e);x(this,"hAt");x(this,"k",0);x(this,"ang",[]);x(this,"ys",[]);x(this,"static");x(this,"rot");x(this,"m",new F);x(this,"q",new K);x(this,"e",new St);x(this,"p",new M);x(this,"s",new M(1,1,1));let t=e.real;this.hAt=(a,o)=>t.heightAt(a,o);let n=new at({color:15659250}),i=new ke(.5,Yd,2);i.translate(0,Yd/2+1,0);let s=[new Be(1.5,8,6)];for(let a=0;a<3;a++)s.push(i.clone().rotateX(a*2.0944));let r=vt(s.map(a=>a.toNonIndexed()));this.rot=new q(r,n,Gi.length),this.rot.frustumCulled=!1,this.rot.name="aw:windfarm:rotors",this.rot.castShadow=!1,this.rebuild(),e.scene.add(this.rot)}rebuild(){let e=[];Gi.forEach((n,i)=>{let s=this.hAt(ks,n)-.5;this.ys[i]=Number.isFinite(s)?s:this.ys[i]||0;let r=new At(1.4,2.1,Ja,10,1,!0).toNonIndexed();r.translate(ks,this.ys[i]+Ja/2,n);let a=new ke(10,3.6,3.6).toNonIndexed();a.translate(ks-1.5,this.ys[i]+Ja+.3,n),e.push(r,a),this.ang[i]===void 0&&(this.ang[i]=i*.7)});let t=vt(e);t.computeBoundingSphere(),this.static?(this.static.geometry.dispose(),this.static.geometry=t):(this.static=new k(t,this.rot.material),this.static.name="aw:windfarm",this.g.scene.add(this.static))}update(e){if((++this.k&255)===0){let t=!1;for(let n=0;n<Gi.length;n++){let i=this.hAt(ks,Gi[n])-.5;Number.isFinite(i)&&Math.abs(i-this.ys[n])>.05&&(t=!0)}t&&this.rebuild()}for(let t=0;t<Gi.length;t++)this.ang[t]-=e*.9,this.e.set(this.ang[t],0,0),this.q.setFromEuler(this.e),this.p.set(ks+4.2,this.ys[t]+Ja+1.3,Gi[t]),this.m.compose(this.p,this.q,this.s),this.rot.setMatrixAt(t,this.m);this.rot.instanceMatrix.needsUpdate=!0}};var Qa=[{n:"NEAR",d:1,p:0},{n:"FAR",d:1.75,p:.14},{n:"LOW",d:.72,p:-.13}],eo=class{constructor(){x(this,"i",0);x(this,"btn");x(this,"tip");x(this,"cd",1);x(this,"cp",0);this.btn=document.createElement("button"),this.btn.textContent="\u{1F3A5}",this.btn.title="Camera (C)",this.btn.className="aw-cam",this.btn.setAttribute("aria-label","Cycle chase camera"),this.btn.style.display="none",this.btn.addEventListener("click",t=>{t.preventDefault(),this.next()}),document.body.appendChild(this.btn),this.tip=document.createElement("div"),this.tip.className="aw-camtip",document.body.appendChild(this.tip);let e=document.createElement("style");e.textContent=".aw-cam{position:fixed;right:12px;top:170px;z-index:40;width:44px;height:44px;border-radius:12px;border:0;font:20px system-ui;background:#1e2a3ab0;color:#fff}.aw-camtip{position:fixed;right:62px;top:180px;z-index:40;font:800 12px system-ui;color:#fff;text-shadow:0 1px 3px #000;opacity:0;transition:opacity .4s;pointer-events:none}",document.head.appendChild(e),addEventListener("keydown",t=>{t.code==="KeyC"&&!(t.target instanceof HTMLInputElement)&&this.next()})}next(){this.i=(this.i+1)%Qa.length,this.tip.textContent="CAM "+Qa[this.i].n,this.tip.style.opacity="1",setTimeout(()=>this.tip.style.opacity="0",1200)}frame(e,t){let n=e==="car"||e==="moto";this.btn.style.display=n?"block":"none";let i=n?Qa[this.i]:Qa[0],s=Math.min(1,t*4);this.cd+=(i.d-this.cd)*s,this.cp+=(i.p-this.cp)*s;let r=window;r.__awCamD=this.cd,r.__awCamP=this.cp}};var zs=["off","1","2","3","4","5"],av={off:"RADIO OFF",1:"Track 1",2:"Track 2",3:"Track 3",4:"Track 4",5:"Track 5"},ov=l=>`./audio/music/track${l}.mp3`,lv=.32,to=class{constructor(e){x(this,"g",e);x(this,"el");x(this,"nm");x(this,"a",null);x(this,"st","1");x(this,"shown",!1);x(this,"want",!1);x(this,"t",0);try{localStorage.removeItem("aw_radio");let o=localStorage.getItem("aw_radio2");o&&zs.includes(o)&&(this.st=o)}catch{}let t=document.createElement("style");t.textContent=`#awRadio{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 96px);transform:translate(-50%);z-index:30;display:none;align-items:center;gap:6px;
      background:#0b1220cc;border:2px solid #ffffff40;border-radius:14px;padding:4px 6px;color:#fff;font:700 13px system-ui,sans-serif;user-select:none;touch-action:none;box-shadow:0 4px 14px #0006}
      #awRadio.on{display:flex}body.touch #awRadio{top:auto;bottom:calc(env(safe-area-inset-bottom) + 172px)}body.touch #awRadio[data-mode=plane]{bottom:auto;top:calc(env(safe-area-inset-top) + var(--aw-radio-top,132px));left:12px;transform:none}#awRadio button{background:#ffffff1a;border:0;color:#fff;border-radius:9px;width:30px;height:30px;font-size:15px;font-weight:900}
      #awRadio .nm{min-width:110px;text-align:center;line-height:1.1}#awRadio .nm small{display:block;font-size:9px;letter-spacing:.18em;opacity:.65}
      #awRadio .nm b{display:block;font-size:14px;color:#ffd23f}#awRadio.off .nm b{color:#aab}`,document.head.appendChild(t),this.el=document.createElement("div"),this.el.id="awRadio";let n=document.createElement("button");n.textContent="\u25C0",n.setAttribute("aria-label","Previous station");let i=document.createElement("button");i.textContent="\u25B6",i.setAttribute("aria-label","Next station"),this.nm=document.createElement("div"),this.nm.className="nm",this.el.append(n,this.nm,i),document.body.appendChild(this.el);let s=o=>o.stopPropagation();for(let o of["pointerdown","touchstart","mousedown"])this.el.addEventListener(o,s);n.addEventListener("click",o=>{o.stopPropagation(),this.step(-1)}),i.addEventListener("click",o=>{o.stopPropagation(),this.step(1)});let r=-1;this.el.addEventListener("pointerdown",o=>{(o.target===this.el||this.nm.contains(o.target))&&(r=o.clientX,this.el.setPointerCapture(o.pointerId))}),this.el.addEventListener("pointerup",o=>{if(r<0)return;let c=o.clientX-r;r=-1,Math.abs(c)>25&&this.step(c<0?1:-1)}),this.el.addEventListener("pointercancel",()=>{r=-1}),addEventListener("keydown",o=>{!this.shown||o.target?.tagName==="INPUT"||(o.key===","?this.step(-1):o.key==="."&&this.step(1))});let a=()=>{this.want&&this.a&&this.a.paused&&this.a.play().catch(()=>{})};addEventListener("pointerdown",a,!0),addEventListener("keydown",a,!0),this.paint()}muted(){try{return localStorage.getItem("aw_muted")==="1"}catch{return!1}}step(e){let t=zs.indexOf(this.st);this.st=zs[(t+e+zs.length)%zs.length];try{localStorage.setItem("aw_radio2",this.st)}catch{}this.paint(),this.sync(!0)}paint(){this.nm.innerHTML=`<small>RADIO</small><b>${av[this.st]}</b>`,this.el.classList.toggle("off",this.st==="off")}sync(e=!1){if(this.want=this.shown&&this.st!=="off"&&!this.muted(),!this.want){this.a&&!this.a.paused&&this.a.pause();return}let t=ov(this.st);this.a||(this.a=new Audio,this.a.loop=!0,this.a.preload="auto",this.a.volume=lv,window.__awRadio=this.a),(e||!this.a.src.endsWith(t.slice(1)))&&(this.a.src=t);let n=window.__awIntro;n&&!n.paused&&n.pause(),this.a.paused&&this.a.play().catch(()=>{})}update(){let t=this.g.S.mode;if(this.el.dataset.mode!==t&&(this.el.dataset.mode=t,t==="plane")){let n=document.getElementById("hud");if(n){let i=n.getBoundingClientRect();i.bottom>0&&this.el.style.setProperty("--aw-radio-top",Math.round(i.bottom+8)+"px")}}this.shown!==!0?(this.shown=!0,this.el.classList.toggle("on",!0),this.sync()):(this.t=(this.t+1)%30)===0&&this.sync()}};var Zd="smoothstep(-500.0, 1200.0, dot(%P% - vec2(-8840.0, -10365.0), vec2(0.7373, -0.6756)))",cv=`
  // aw sea: awW 0 leeward (Eagle/Palm Beach) .. 1 windward north coast
  vec2 awP = vWP.xz;
  float awW = ${Zd.replace("%P%","awP")};
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
  float awSpec = (1.0 - 0.45 * smoothstep(150.0, 1500.0, camD) * smoothstep(4.0, 14.0, awD)) * mix(0.65, 1.0, smoothstep(0.5, 4.0, depth));`;function uv(l,e){dn(l,"sea-v1",t=>{let n=t.fragmentShader,i=n.indexOf("  // shoreline wash"),s="a = max(a, foam * 0.95);",r=n.indexOf(s),a="vec3 n1 = texture(wn, p / 9.0 + vec2(uTime * 0.021, uTime * 0.013)).xyz * 2.0 - 1.0;",o="vec3 n3 = texture(wn, p / 120.0 + vec2(uTime * 0.004, 0.0)).xyz * 2.0 - 1.0;",c="vec3 nW = normalize(vec3(g.x, 1.0, g.y));",u="float roughnessFactor = mix(0.04, 0.65, foam) + smoothstep(300.0, 4000.0, camD) * 0.08;",h="totalSpecular * smoothstep(0.0, 0.15, dd)";i<0||r<i||![a,o,c,u,h].every(d=>n.includes(d))||(t.fragmentShader=((e?`#define AW_SEA_HQ
`:"")+n.slice(0,i)+cv+n.slice(r+s.length)).replace(a,"vec3 n1 = awN1;").replace(o,"vec3 n3 = awN3;").replace(c,"g = g * mix(1.0, 1.45, awW) + awSwell; "+c).replace(u,u.replace(";"," + 0.05 * awW;")).replace(h,h+" * awSpec"))})}function hv(l){dn(l,"sand-v1",e=>{let t=e.fragmentShader,n="const float SAT[8] = float[8](0.55, 0.8, 0.6, 0.9, 0.85, 0.6, 0.5, 0.6);",i="const float GAIN[8] = float[8](1.12, 1.0, 1.95, 1.0, 0.8, 1.25, 1.15, 1.15);",s=`  for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) rwLayer(i, wi, P, tc, tn, tar); }
  float wsum = 0.0; for (int i = 0; i < 8; i++) { float wi = w[i] / max(tot, 1e-4); if (wi > 0.02) wsum += wi; }`,r="tc = mix(tc, tc * vec3(0.78, 0.9, 0.88), smoothstep(-0.5, -3.0, vWP.y));",a="reflectedLight.indirectSpecular *= tAO;";[n,i,s,r,a].every(o=>t.includes(o))&&(e.fragmentShader=t.replace(n,"const float SAT[8] = float[8](0.55, 0.8, 0.5, 0.9, 0.85, 0.6, 0.5, 0.6);").replace(i,"const float GAIN[8] = float[8](1.12, 1.0, 2.5, 1.0, 0.8, 1.25, 1.15, 1.15);").replace(s,`  float awIT = 1.0 / max(tot, 1e-4), wsum = 0.0;
  for (int i = 0; i < 8; i++) { float wi = w[i] * awIT; if (wi > 0.02) { rwLayer(i, wi, P, tc, tn, tar); wsum += wi; } }`).replace(r,`float awW = ${Zd.replace("%P%","P")}, awSub = smoothstep(-0.2, -2.5, vWP.y);
  tc *= mix(vec3(1.0), vec3(0.96, 0.9, 0.8), awW * w[2] * awIT * (1.0 - awSub));   // windward: coarser, golden coral sand
  tc *= exp(min(vWP.y, 0.0) * vec3(0.9, 0.16, 0.11)) * (1.0 - 0.3 * awW * awSub);   // seabed: red absorbed on the way down and up, darker reef windward
  // A's wet-sand gloss (roughness .28) also covered the seabed, which then mirrored the sky up through
  // the water (the white band off every beach): matte and no sky reflection below the waterline
  float awDry = smoothstep(-0.5, 0.05, vWP.y); tRough = mix(1.0, tRough, awDry);`).replace(a,"reflectedLight.indirectSpecular *= tAO * awDry;"))})}var no=class{constructor(e){x(this,"stats",{water:0,terrain:0,hq:!1});let t=e.real,n=H.get("seaq"),i=n?n!=="low":t.q.name!=="low";this.stats.hq=i;let s=o=>{o&&!o.userData["aw:sea-v1"]&&(uv(o,i),this.stats.water++)},r=o=>{o&&!o.userData["aw:sand-v1"]&&(hv(o),this.stats.terrain++)},a=(o,c)=>{if(!o||typeof o.material!="function")return;let u=o.material.bind(o);o.material=(...h)=>{let d=u(...h);return c(d),d}};a(t.water,s),a(t.terrain,r),r(t.ovMat);for(let o of t.group.children){let c=o.material;o.isMesh&&c&&!Array.isArray(c)&&/\|water/.test(c.customProgramCacheKey?c.customProgramCacheKey():"")&&s(c)}for(let o of t.regions.values())r(o.mat),s(o.wmat)}};var dv=`
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
}`;function Kd(){let l=document.createElement("style");l.id="aw-hud",l.textContent=dv,document.head.appendChild(l)}var Xc="#1d5683",jd="#47524c",Jd="#4c6444",$d="#262c31",fv="#1b2126",Qd=["#aeb5b8","#c3c8ca","#eef0f0","#ffd34d","#ffd34d"],ef=[1.1,1.4,2.1,2.7,3.2],pv=[.45,.55,.9,1.3,1.6],mv=new Set(["store","mall","hotel","gas","attraction"]),gv=new Set(["mall","hotel","gas","attraction"]),io=class{constructor(e){x(this,"g",e);x(this,"stats",{tiles:0,tileMs:0,jobMaxMs:0,world:!1,labels:0,size:0});x(this,"canvas",document.getElementById("minimap"));x(this,"ctx",null);x(this,"css",0);x(this,"tile",document.createElement("canvas"));x(this,"tcx",0);x(this,"tcz",0);x(this,"tppm",0);x(this,"tileOk",!1);x(this,"tileQueued",!1);x(this,"want",{ppm:0,cssPerM:0});x(this,"world",document.createElement("canvas"));x(this,"wk",0);x(this,"wb",null);x(this,"data",null);x(this,"grid",null);x(this,"parkGrid",null);x(this,"stamp",null);x(this,"parkStamp",null);x(this,"gen",0);x(this,"jobs",[]);x(this,"idleOn",!1);x(this,"range",0);x(this,"placed",[]);x(this,"pick",[]);x(this,"rim",null);x(this,"rimW",0);this.tile.width=this.tile.height=1024,this.canvas&&(this.ctx=this.canvas.getContext("2d"),document.body.classList.add("awmm"),this.resize(),addEventListener("resize",()=>this.resize()),addEventListener("orientationchange",()=>setTimeout(()=>this.resize(),250)),window.__awMiniMap=(t,n,i,s,r,a,o,c)=>this.draw(t,n,i,s,r,a,o,c))}resize(){let e=this.canvas,t=e.parentElement;this.css=t.clientWidth||120;let n=Math.max(96,Math.min(300,Math.round(this.css*Math.min(3,devicePixelRatio||1))));e.width!==n&&(e.width=e.height=n,this.tileOk=!1),this.stats.size=n}idle(e,t=!1){t?this.jobs.unshift(e):this.jobs.push(e),this.kick()}kick(){if(this.idleOn||!this.jobs.length)return;this.idleOn=!0;let e=n=>{this.idleOn=!1;do{let i=performance.now();this.jobs.shift()(),this.stats.jobMaxMs=Math.max(this.stats.jobMaxMs,Math.round((performance.now()-i)*10)/10)}while(this.jobs.length&&n&&n.timeRemaining()>4);this.kick()},t=window.requestIdleCallback;t?t(e,{timeout:250}):setTimeout(e,16)}start(e,t){this.data=e,this.wb=t,this.idle(()=>{this.grid||this.index(e)});let n=Math.max(t.maxX-t.minX,t.maxZ-t.minZ),i=this.wk=1024/n,s=this.world;s.width=s.height=1024;let r=s.getContext("2d"),a=u=>(u-t.minX)*i,o=u=>(u-t.minZ)*i,c=u=>u.forEach(([h,d],f)=>f?r.lineTo(a(h),o(d)):r.moveTo(a(h),o(d)));this.idle(()=>{r.fillStyle=Xc,r.fillRect(0,0,1024,1024),r.fillStyle=jd,r.beginPath();for(let u of e.land)c(u.outer),r.closePath();r.fill(),r.fillStyle=Jd,r.beginPath();for(let u of e.parks)c(u),r.closePath();r.fill(),r.lineCap=r.lineJoin="round",r.strokeStyle=$d,r.lineWidth=45*i,r.beginPath();for(let u of e.runways)c(u);r.stroke()});for(let u=0;u<=4;u++)this.idle(()=>{r.strokeStyle=Qd[u],r.lineWidth=pv[u],r.beginPath();for(let h of e.roads)h.c===u&&c(h.p);r.stroke(),u===4&&(this.stats.world=!0)})}key(e,t){return e*65536+t}index(e){let t=new Map,n=new Map,i=(s,r,a)=>{let o=1/0,c=-1/0,u=1/0,h=-1/0;for(let[d,f]of r)d<o&&(o=d),d>c&&(c=d),f<u&&(u=f),f>h&&(h=f);for(let d=Math.floor(o/500);d<=Math.floor(c/500);d++)for(let f=Math.floor(u/500);f<=Math.floor(h/500);f++){let p=this.key(d,f),m=s.get(p);m||s.set(p,m=[]),m.push(a)}};e.roads.forEach((s,r)=>i(t,s.p,r)),e.parks.forEach((s,r)=>i(n,s,r)),this.grid=t,this.parkGrid=n,this.stamp=new Uint32Array(e.roads.length),this.parkStamp=new Uint32Array(e.parks.length)}query(e,t,n,i,s,r,a){a.length=0;for(let o=Math.floor(n/500);o<=Math.floor(s/500);o++)for(let c=Math.floor(i/500);c<=Math.floor(r/500);c++){let u=e.get(this.key(o,c));if(u)for(let h of u)t[h]!==this.gen&&(t[h]=this.gen,a.push(h))}return a}queueTile(e,t){if(this.want.ppm=e,this.want.cssPerM=t,this.tileQueued)return;this.tileQueued=!0;let n=()=>{if(!this.grid){this.index(this.data),this.idle(n,!0);return}this.tileQueued=!1;let i=this.g.S,s=i.mode==="walk"?i.walk:i.car;this.renderTile(s.x,s.z,this.want.ppm,this.want.cssPerM)};this.idle(n,!0)}renderTile(e,t,n,i){let s=performance.now(),r=this.data,a=this.tile.getContext("2d"),o=1024/2/n,c=e-o,u=e+o,h=t-o,d=t+o,f=_=>(_-e)*n+1024/2,p=_=>(_-t)*n+1024/2,m=_=>_.forEach(([S,E],C)=>C?a.lineTo(f(S),p(E)):a.moveTo(f(S),p(E)));a.fillStyle=Xc,a.fillRect(0,0,1024,1024),a.fillStyle=jd,a.beginPath();for(let _ of r.land)m(_.outer),a.closePath();a.fill();let g=[];this.gen++,a.fillStyle=Jd,a.beginPath();for(let _ of this.query(this.parkGrid,this.parkStamp,c,h,u,d,g))m(r.parks[_]),a.closePath();a.fill(),a.lineCap=a.lineJoin="round",a.strokeStyle=$d,a.lineWidth=45*n,a.beginPath();for(let _ of r.runways)m(_);a.stroke(),this.gen++;let b=this.query(this.grid,this.stamp,c,h,u,d,g),v=n/i,y=(_,S,E)=>{a.strokeStyle=E,a.lineWidth=S,a.beginPath();for(let C of b){let A=r.roads[C];A.c===_&&m(A.p)}a.stroke()};for(let _=2;_<=4;_++)y(_,(ef[_]+1.2)*v,fv);for(let _=0;_<=4;_++)y(_,ef[_]*v,Qd[_]);this.tcx=e,this.tcz=t,this.tppm=n,this.tileOk=!0,this.stats.tiles++,this.stats.tileMs=Math.round((performance.now()-s)*10)/10}draw(e,t,n,i,s,r,a,o){let c=this.ctx;if(!c)return;this.data||this.start(o,r);let u=this.g.S,h=u.mode,f=h==="car"||h==="moto"?900+Math.min(45,Math.abs(u.car.s||0))*13:h==="walk"?480:i;this.range=!this.range||h==="plane"?f:this.range+(f-this.range)*.12;let p=this.range,m=this.canvas.width,g=m/this.css,b=m/p;c.save(),c.fillStyle=Xc,c.fillRect(0,0,m,m),c.translate(m/2,m/2),c.rotate(n);let v=!1;if(p<=2e3){let y=p<700?.75:.36,_=1024/2/y-p*.5-Math.max(Math.abs(e-this.tcx),Math.abs(t-this.tcz));v=this.tileOk&&this.tppm===y&&_>20,(!v||_<300)&&this.queueTile(y,b/g)}if(v){let y=p*this.tppm;c.drawImage(this.tile,(e-this.tcx)*this.tppm+1024/2-y/2,(t-this.tcz)*this.tppm+1024/2-y/2,y,y,-m/2,-m/2,m,m)}else{let y=this.stats.world,_=y?this.world:s.c,S=y?this.wk:s.k,E=p*S;c.drawImage(_,(e-r.minX)*S-E/2,(t-r.minZ)*S-E/2,E,E,-m/2,-m/2,m,m)}this.pois(c,e,t,n,b,g,m,a,p<=2e3),c.restore(),this.chrome(c,m,n,g)}pois(e,t,n,i,s,r,a,o,c){let u=a/2-4*r,h=u*u,d=this.pick;d.length=0,e.lineWidth=1.2*r,e.strokeStyle="#fff";for(let v of o){let y=(v.x-t)*s,_=(v.z-n)*s,S=y*y+_*_;S>h||v.k.startsWith("m_")||(c&&gv.has(v.cat)&&(e.fillStyle=v.bg==="#ffffff"||v.bg==="#f4f1e6"?v.fg:v.bg,e.beginPath(),e.arc(y,_,2.4*r,0,6.2832),e.fill(),e.stroke()),mv.has(v.cat)&&v.sign&&d.push({b:v,d:v.cat==="store"?S:S*.3,x:y,y:_}))}d.sort((v,y)=>v.d-y.d);let f=this.placed;f.length=0,e.font=`800 ${Math.round(9.5*r)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.lineJoin="round";let p=Math.sin(i),m=Math.cos(i),g=0,b=0;for(let v of d){if(g>=3||b>24)break;let y=v.x*m-v.y*p,_=v.x*p+v.y*m-9*r;if(Math.abs(y)<18*r&&Math.abs(_)<19*r)continue;b++;let S=v.b.sign.length>14?v.b.sign.slice(0,13)+"\u2026":v.b.sign,E=e.measureText(S).width+8*r,C=15*r;if(Math.hypot(Math.abs(y)+E/2,Math.abs(_)+C/2)>a/2-2*r)continue;let A=!1;for(let R=0;R<f.length;R+=4)if(Math.abs(y-f[R])*2<E+f[R+2]&&Math.abs(_-f[R+1])*2<C+f[R+3]){A=!0;break}A||Math.abs(y)<E/2+10*r&&Math.abs(_)<C/2+11*r||(f.push(y,_,E,C),e.save(),e.rotate(-i),e.lineWidth=3.2*r,e.strokeStyle="rgba(10,14,18,.85)",e.strokeText(S,y,_),e.fillStyle="#fff",e.fillText(S,y,_),e.restore(),g++)}this.stats.labels=g}chrome(e,t,n,i){let s=t/2;(!this.rim||this.rimW!==t)&&(this.rim=e.createRadialGradient(s,s,s*.72,s,s,s),this.rimW=t,this.rim.addColorStop(0,"rgba(0,0,0,0)"),this.rim.addColorStop(1,"rgba(0,0,0,.38)")),e.fillStyle=this.rim,e.fillRect(0,0,t,t),e.save(),e.translate(s,s),e.beginPath(),e.moveTo(0,-9*i),e.lineTo(7*i,7*i),e.lineTo(0,3.2*i),e.lineTo(-7*i,7*i),e.closePath(),e.lineJoin="round",e.lineWidth=3*i,e.strokeStyle="#11161b",e.stroke(),e.fillStyle="#fff",e.fill();let r=s-9*i,a=Math.sin(n)*r,o=-Math.cos(n)*r;e.beginPath(),e.arc(a,o,7.5*i,0,6.2832),e.fillStyle="#11161bdd",e.fill(),e.lineWidth=1.4*i,e.strokeStyle="#ffd23f",e.stroke(),e.font=`900 ${Math.round(9*i)}px system-ui,sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffd23f",e.fillText("N",a,o+.5*i),e.restore()}};function De(l,e,t){let n=l[e],i=l[t],s=i[0]-n[0],r=i[1]-n[1],a=Math.hypot(s,r)||1,o=s/a,c=r/a,u=-c,h=o,d=(n[0]+i[0])*.5,f=(n[1]+i[1])*.5,p=0,m=0;for(let S of l)p+=S[0],m+=S[1];p/=l.length,m/=l.length,(p-d)*u+(m-f)*h<0&&(u=-u,h=-h);let g=0,b=1/0,v=-1/0,y=1/0,_=-1/0;for(let S of l)g=Math.max(g,(S[0]-d)*u+(S[1]-f)*h),b=Math.min(b,S[0]),v=Math.max(v,S[0]),y=Math.min(y,S[1]),_=Math.max(_,S[1]);return b-=1.6,v+=1.6,y-=1.6,_+=1.6,{mx:d,mz:f,ux:o,uz:c,nx:u,nz:h,halfW:a*.5,depth:g,minX:b,maxX:v,minZ:y,maxZ:_}}function ht(l,e,t,n){let i=Math.cos(n),s=Math.sin(n),r=(f,p)=>e+i*f+s*p,a=(f,p)=>t-s*f+i*p,o=[[l.mx+l.ux*l.halfW,l.mz+l.uz*l.halfW],[l.mx-l.ux*l.halfW,l.mz-l.uz*l.halfW],[l.mx+l.nx*l.depth,l.mz+l.nz*l.depth],[l.mx+l.nx*l.depth+l.ux*l.halfW,l.mz+l.nz*l.depth+l.uz*l.halfW],[l.mx+l.nx*l.depth-l.ux*l.halfW,l.mz+l.nz*l.depth-l.uz*l.halfW],[l.mx-l.nx*1.4,l.mz-l.nz*1.4]],c=1/0,u=-1/0,h=1/0,d=-1/0;for(let f of o){let p=r(f[0],f[1]),m=a(f[0],f[1]);c=Math.min(c,p),u=Math.max(u,p),h=Math.min(h,m),d=Math.max(d,m)}return{mx:r(l.mx,l.mz),mz:a(l.mx,l.mz),ux:i*l.ux+s*l.uz,uz:-s*l.ux+i*l.uz,nx:i*l.nx+s*l.nz,nz:-s*l.nx+i*l.nz,halfW:l.halfW,depth:l.depth,minX:c-.5,maxX:u+.5,minZ:h-.5,maxZ:d+.5,doorAt:l.doorAt,mouthOut:l.mouthOut,mouthIn:l.mouthIn}}function xv(l,e,t){let n=!1;for(let i=0,s=l.length-1;i<l.length;s=i++){let r=l[i][0],a=l[i][1],o=l[s][0],c=l[s][1],u=c-a;a>t==c>t||u===0||e<(o-r)*(t-a)/u+r&&(n=!n)}return n}function tf(l,e,t,n,i,s){if(t<l.minX||t>l.maxX||n<l.minZ||n>l.maxZ)return!1;let r=t-l.mx,a=n-l.mz,o=r*l.ux+a*l.uz,c=r*l.nx+a*l.nz,u=l.doorAt??0,h=l.mouthOut??-1.25,d=l.mouthIn??1.8,f=Math.abs(o-u)<i-.06&&c>h&&c<d,p=Math.abs(o)<l.halfW-s&&c>s&&c<l.depth-s&&(!l.poly||xv(l.poly,t,n));if(!f&&!p)return!1;for(let m=0;m<e.length;m++){let g=e[m];if(o>g.a0&&o<g.a1&&c>g.d0&&c<g.d1)return!1}return!0}var X=class{constructor(){x(this,"p",[]);x(this,"n",[]);x(this,"c",[]);x(this,"u",[]);x(this,"ix",[]);x(this,"hasUv",!1)}quad(e,t,n,i){let s=e[1][0]-e[0][0],r=e[1][1]-e[0][1],a=e[1][2]-e[0][2],o=e[2][0]-e[0][0],c=e[2][1]-e[0][1],u=e[2][2]-e[0][2],h=r*u-a*c,d=a*o-s*u,f=s*c-r*o;if(!(h*h+d*d+f*f>1e-10))return;let m=Math.hypot(t[0],t[1],t[2])||1,g=t[0]/m,b=t[1]/m,v=t[2]/m,y=h*g+d*b+f*v<0,_=this.p.length/3;for(let S=0;S<4;S++){let E=e[S];if(this.p.push(E[0],E[1],E[2]),this.n.push(g,b,v),this.c.push(n[0],n[1],n[2]),i){this.hasUv=!0;let C=i[S];this.u.push(C[0],C[1])}}y?this.ix.push(_,_+3,_+2,_,_+2,_+1):this.ix.push(_,_+1,_+2,_,_+2,_+3)}geometry(){let e=new re;return e.setAttribute("position",new ce(this.p,3)),e.setAttribute("normal",new ce(this.n,3)),e.setAttribute("color",new ce(this.c,3)),this.hasUv&&e.setAttribute("uv",new ce(this.u,2)),e.setIndex(new Ti(this.ix,1)),e.computeBoundingSphere(),bv(e),e}get tris(){return this.ix.length/3}};function bv(l){let e=l.getAttribute("normal");if(!e)return;let t=e.array;for(let n=0;n<t.length;n+=3){let i=t[n],s=t[n+1],r=t[n+2];(!Number.isFinite(i+s+r)||i*i+s*s+r*r<1e-8)&&(t[n]=0,t[n+1]=1,t[n+2]=0)}}function w(l,e,t,n){return[l.mx+l.ux*e+l.nx*t,n,l.mz+l.uz*e+l.nz*t]}function T(l,e,t,n,i,s,r,a,o){if(!(n>t+1e-4&&s>i+1e-4&&a>r+1e-4))return;let c=w(e,t,i,r),u=w(e,n,i,r),h=w(e,n,s,r),d=w(e,t,s,r),f=w(e,t,i,a),p=w(e,n,i,a),m=w(e,n,s,a),g=w(e,t,s,a),b=[e.ux,0,e.uz],v=[-e.ux,0,-e.uz],y=[e.nx,0,e.nz],_=[-e.nx,0,-e.nz];l.quad([f,p,m,g],[0,1,0],o),l.quad([c,u,h,d],[0,-1,0],o),l.quad([d,g,m,h],y,o),l.quad([c,u,p,f],_,o),l.quad([u,h,m,p],b,o),l.quad([c,f,g,d],v,o)}var Zc=-7087.55,Kc=24.62,of=[[-7092.6,32.4],[-7084.3,33.3],[-7082.5,16.8],[-7090.8,16]],vv=[[-5.05,7.775],[3.25,8.675],[5.05,-7.826],[-3.25,-8.625]],Hi=De(vv,2,3);Hi.doorAt=0;var so=[.82,.1,.11],nf=[.62,.06,.07],pn=[.96,.93,.86],_v=[.94,.88,.76],sf=[.84,.74,.58],rf=[.02,.4,.2],yv=[.48,.28,.14],Mv=[.95,.93,.88],qc=[.68,.7,.72],wv=[.86,.58,.16],lf=[{a0:-3.6,a1:-.35,d0:2.6,d1:4.05},{a0:-2.4,a1:-.6,d0:2.05,d1:2.75},{a0:1.85,a1:2.85,d0:1.15,d1:2.15},{a0:-2.9,a1:-1.9,d0:4.9,d1:5.9},{a0:1.3,a1:2.3,d0:5.7,d1:6.7},{a0:-2.7,a1:-1.7,d0:8.7,d1:9.7},{a0:1.05,a1:2.05,d0:9.5,d1:10.5},{a0:-2.2,a1:-1.2,d0:11.9,d1:12.9},{a0:-3.5,a1:-.45,d0:14.3,d1:15.9}],Gs={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Sv(){let l=new X;T(l,Gs,-.19,.19,-.17,.17,.42,.47,so),T(l,Gs,-.19,.19,-.2,-.145,.47,.9,nf);for(let[e,t]of[[-.15,-.13],[.15,-.13],[-.15,.13],[.15,.13]])T(l,Gs,e-.018,e+.018,t-.018,t+.018,.02,.42,nf);return l.geometry()}function Av(){let l=new X;return T(l,Gs,-.3,.3,-.3,.3,.7,.75,so),T(l,Gs,-.05,.05,-.05,.05,.04,.7,[.9,.9,.88]),l.geometry()}function Tv(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f6f1e4",e.fillRect(0,0,512,512),e.fillStyle="#06733a",e.fillRect(0,0,512,86),e.fillStyle="#ffffff",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("PASTECHI HOUSE",256,46),[["Cheese","2.50"],["Ham & Cheese","3.00"],["Beef","3.00"],["Chicken","3.00"],["Tuna","3.00"],["Keri Keri","3.50"],["Lobster","5.00"],["Croquette","2.00"],["Bitterbal","2.00"],["Dedito","2.50"],["Smoothie","4.00"],["Iced Coffee","3.50"]].forEach((i,s)=>{let r=118+s*28;e.fillStyle=s%2?"#efe6d4":"#f6f1e4",e.fillRect(18,r-18,476,28),e.fillStyle="#2a2118",e.font="600 22px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],484,r)}),e.fillStyle="#06733a",e.font="700 18px Arial, sans-serif",e.textAlign="center",e.fillText("spicy garlic sauce  \xB7  take away or sit in",256,484),e.fillStyle="#e0a030",e.beginPath(),e.arc(256,452,16,Math.PI,0),e.quadraticCurveTo(256,468,240,452),e.fill();let n=new ue(l);return n.colorSpace=J,n.anisotropy=4,n}function af(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,t-r,o,i),w(e,t+r,o,i),w(e,t+r,o,s),w(e,t-r,o,s)],c,[1,1,1],u)};a(n,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),a(n+.02,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var cf=new M(0,1,0),ro=new K,ao=new M,Ev=new M(1,1,1),uf=new F;function Yc(l,e,t,n,i,s){let r=w(t,n,i,0);ao.set(r[0],0,r[2]),ro.setFromAxisAngle(cf,Math.atan2(s[0],s[1])),l.setMatrixAt(e,uf.compose(ao,ro,Ev))}function hf(l,e){let t=new X,n=Hi.halfW,i=Hi.depth,s=.34,r=.9;for(let O=-n+s;O<n-s-.05;O+=r)for(let U=.2;U<i-s-.05;U+=r){let V=Math.min(O+r-.03,n-s),Z=Math.min(U+r-.03,i-s),Y=(Math.round(O/r)+Math.round(U/r)&1)===0;t.quad([w(e,O,U,.04),w(e,V,U,.04),w(e,V,Z,.04),w(e,O,Z,.04)],[0,1,0],Y?_v:sf)}t.quad([w(e,-2.25,-.5,.03),w(e,2.25,-.5,.03),w(e,2.25,.16,.03),w(e,-2.25,.16,.03)],[0,1,0],sf),t.quad([w(e,-n+.28,.5,3.42),w(e,n-.28,.5,3.42),w(e,n-.28,i-.35,3.42),w(e,-n+.28,i-.35,3.42)],[0,-1,0],[.93,.92,.88]);for(let O of[2.2,8.2])t.quad([w(e,-1.1,O,3.48),w(e,1.1,O,3.48),w(e,1.1,O+.55,3.48),w(e,-1.1,O+.55,3.48)],[0,-1,0],[1,.95,.78]);let a=.12,o=-2.4,c=2.4;T(t,e,-n+.18,-n+.18+a,.4,i-.25,.05,3.52,pn),T(t,e,n-.18-a,n-.18,.4,i-.25,.05,3.52,pn),T(t,e,-n+.25,n-.25,i-.3,i-.3+a,.05,3.52,pn),T(t,e,-n+.2,o,.2,.2+a,.02,2.22,pn),T(t,e,c,n-.2,.2,.2+a,.02,2.22,pn),T(t,e,o,c,.2,.2+a,2.08,2.26,pn),T(t,e,-n+.22,o,.22,.32,.02,.14,so),T(t,e,c,n-.22,.22,.32,.02,.14,so),T(t,e,o,c,.18,.3,2.1,2.24,rf),T(t,e,-3.45,-.45,2.75,3.9,.04,1,yv),T(t,e,-3.5,-.4,2.7,3.95,1,1.06,Mv),T(t,e,-3.4,-.5,2.7,2.82,.48,.98,rf),T(t,e,-2.25,-.7,2.15,2.7,1.06,1.14,qc),T(t,e,-2.15,-.8,2.22,2.62,1.14,1.18,wv),T(t,e,-3.4,-.55,14.4,15.75,.04,.92,qc),T(t,e,-2.6,-1.2,14.55,15.4,.92,.98,[.2,.18,.16]),T(t,e,-2.45,-1.35,14.7,15.2,.98,1.06,[1,.42,.08]),T(t,e,-.08,.08,7.9,8.06,3.15,3.42,qc),T(t,e,-.85,.85,7.94,8.02,3.28,3.34,pn),T(t,e,-.04,.04,7.15,8.8,3.28,3.34,pn);let u=t.geometry(),h=new z({vertexColors:!0,side:Q}),d=new k(u,h);d.name="aw:pastechi:shell",d.castShadow=!1,d.receiveShadow=!1,l.add(d);let f=Tv();if(f){let O=new X;af(O,e,-1.9,3.92,1.4,2.65,1.05),af(O,e,.4,i-.2,1.35,2.6,1.05);let U=new k(O.geometry(),new z({map:f,side:Q}));U.name="aw:pastechi:menu",U.castShadow=!1,U.receiveShadow=!1,l.add(U)}let p=new X,m=[.75,.9,.95],g=1.18,b=1.48,v=-2.2,y=-.75,_=2.18,S=2.66;p.quad([w(e,v,_,b),w(e,y,_,b),w(e,y,S,b),w(e,v,S,b)],[0,1,0],m),p.quad([w(e,v,S,g),w(e,v,S,b),w(e,v,_,b),w(e,v,_,g)],[-e.ux,0,-e.uz],m),p.quad([w(e,y,_,g),w(e,y,_,b),w(e,y,S,b),w(e,y,S,g)],[e.ux,0,e.uz],m),p.quad([w(e,v,S,g),w(e,y,S,g),w(e,y,S,b),w(e,v,S,b)],[e.nx,0,e.nz],m);let E=new z({color:12051698,transparent:!0,opacity:.28,depthWrite:!1,side:Q}),C=new k(p.geometry(),E);C.name="aw:pastechi:glass",C.renderOrder=2,C.castShadow=!1,C.receiveShadow=!1,l.add(C);let A=new q(Sv(),new z({vertexColors:!0}),12);A.name="aw:pastechi:chairs",A.castShadow=!1,A.receiveShadow=!1,A.frustumCulled=!1;let R=new q(Av(),new z({vertexColors:!0}),6);R.name="aw:pastechi:tables",R.castShadow=!1,R.receiveShadow=!1,R.frustumCulled=!1;let P=[[2.35,1.65],[-2.4,5.4],[1.8,6.2],[-2.2,9.2],[1.55,10],[-1.7,12.4]];P.forEach(([O,U],V)=>{Yc(R,V,e,O,U,[0,1]);let Z=[e.nx,e.nz],Y=[-e.nx,-e.nz];Yc(A,V*2,e,O,U-.58,Z),Yc(A,V*2+1,e,O,U+.58,Y)}),A.count=P.length*2,R.count=P.length,A.instanceMatrix.needsUpdate=!0,R.instanceMatrix.needsUpdate=!0,A.boundingSphere=new W(new M(0,1,0),22),R.boundingSphere=new W(new M(0,1,0),22),l.add(A,R);let I=new q(new Be(.09,6,4),new z({color:14721072}),8);I.name="aw:pastechi:pastry",I.castShadow=!1,I.receiveShadow=!1,I.frustumCulled=!1;let D=new M(1.35,.45,.95),N=0;for(let O of[-1.95,-1.6,-1.25,-.9])for(let U of[2.3,2.52]){let V=w(e,O,U,1.28);ao.set(V[0],V[1],V[2]),ro.setFromAxisAngle(cf,O*.4),I.setMatrixAt(N++,uf.compose(ao,ro,D))}I.count=N,I.instanceMatrix.needsUpdate=!0,I.boundingSphere=new W(new M(0,1,0),22),l.add(I)}var eu=-7957.65,tu=-5466.6,pf=[[-7969.2,-5451.9],[-7951.9,-5448.8],[-7946.1,-5481.3],[-7963.4,-5484.4]],Rv=[[-11.55,14.7],[5.75,17.8],[11.55,-14.7],[-5.75,-17.8]],Qn=De(Rv,1,0),$c=-5.5,lo=2.15,mf=2.9;Qn.doorAt=$c;Qn.depth=16;var oo=[.86,.05,.04],df=[.62,.04,.03],jc=[1,.74,.05],gf=[.78,.78,.76],xf=[.62,.62,.6],Vi=[.93,.91,.86],Cv=[.45,.28,.14],bf=[{a0:-2.5,a1:4.7,d0:3.05,d1:4.45},{a0:-4.4,a1:-3.8,d0:1.9,d1:2.6},{a0:-7.55,a1:-6.95,d0:1.9,d1:2.6},{a0:-7.9,a1:-6.7,d0:4.9,d1:6.35},{a0:-4.3,a1:-3.1,d0:6.05,d1:7.55},{a0:-7.75,a1:-6.65,d0:8.65,d1:10.2},{a0:.85,a1:1.95,d0:5.05,d1:6.55},{a0:3.2,a1:4.4,d0:8.45,d1:9.95},{a0:-3.2,a1:3.4,d0:13.25,d1:15.05}],Hs={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Iv(){let l=new X;T(l,Hs,-.2,.2,-.18,.18,.42,.48,oo),T(l,Hs,-.2,.2,-.2,-.14,.48,.92,df);for(let[e,t]of[[-.16,-.14],[.16,-.14],[-.16,.14],[.16,.14]])T(l,Hs,e-.02,e+.02,t-.02,t+.02,.02,.42,df);return l.geometry()}function Pv(){let l=new X;return T(l,Hs,-.42,.42,-.42,.42,.7,.76,gf),T(l,Hs,-.06,.06,-.06,.06,.04,.7,xf),l.geometry()}function Lv(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4f1ea",e.fillRect(0,0,512,512),e.fillStyle="#db0007",e.fillRect(0,0,512,78),e.fillStyle="#ffbc0d",e.beginPath(),e.arc(70,118,28,Math.PI,0),e.arc(108,118,28,Math.PI,0),e.fill(),e.fillStyle="#ffffff",e.font="700 36px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("McDONALD'S",300,40),[["Big Mac","8.50"],["Cheeseburger","3.50"],["Quarter Pounder","7.50"],["McNuggets","6.00"],["Fries","3.00"],["McFlurry","4.50"],["Coca-Cola","2.50"],["Coffee","2.50"]].forEach((i,s)=>{let r=130+s*40;e.fillStyle=s%2?"#fff6d8":"#f4f1ea",e.fillRect(16,r-22,480,40),e.fillStyle="#2a2118",e.font="600 26px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],480,r)}),e.fillStyle="#db0007",e.font="700 20px Arial, sans-serif",e.textAlign="center",e.fillText("i'm lovin' it",256,480);let n=new ue(l);return n.colorSpace=J,n}function ff(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,t-r,o,i),w(e,t+r,o,i),w(e,t+r,o,s),w(e,t-r,o,s)],c,[1,1,1],u)};a(n,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),a(n+.03,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var Dv=new M(0,1,0),Qc=new K,co=new M,Nv=new M(1,1,1),vf=new F;function Jc(l,e,t,n,i,s){let r=w(t,n,i,0);co.set(r[0],0,r[2]),Qc.setFromAxisAngle(Dv,Math.atan2(s[0],s[1])),l.setMatrixAt(e,vf.compose(co,Qc,Nv))}function _f(l,e){let t=new X,n=Qn.halfW,i=Qn.depth,s=$c-lo,r=$c+lo;t.quad([w(e,-n+.35,.2,.02),w(e,n-.35,.2,.02),w(e,n-.35,i-.35,.02),w(e,-n+.35,i-.35,.02)],[0,1,0],[.7,.7,.68]);let a=1.3;for(let g=-n+.5;g<n-.6;g+=a)for(let b=.25;b<i-.5;b+=a){let v=Math.min(g+a-.04,n-.45),y=Math.min(b+a-.04,i-.4),_=(Math.round(g/a)+Math.round(b/a)&1)===0;t.quad([w(e,g,b,.04),w(e,v,b,.04),w(e,v,y,.04),w(e,g,y,.04)],[0,1,0],_?gf:xf)}t.quad([w(e,-n+.4,.25,3.15),w(e,n-.4,.25,3.15),w(e,n-.4,i-.4,3.15),w(e,-n+.4,i-.4,3.15)],[0,-1,0],[.9,.9,.88]);let o=.12;T(t,e,-n+.22,-n+.22+o,.35,i-.3,.04,3.2,Vi),T(t,e,n-.22-o,n-.22,.35,i-.3,.04,3.2,Vi),T(t,e,-n+.3,n-.3,i-.32,i-.2,.04,3.2,Vi),T(t,e,-n+.25,s,.16,.16+o,.02,2.9,Vi),T(t,e,r,n-.25,.16,.16+o,.02,2.9,Vi),T(t,e,s,r,.18,.18+o,2.62,2.88,jc),T(t,e,s+.04,s+.18,.2,.48,.02,2.75,oo),T(t,e,r-.18,r-.04,.2,.48,.02,2.75,oo),T(t,e,-n+.3,n-.3,.2,.42,2.92,3.18,Vi),T(t,e,-2.4,4.6,3.15,4.35,.04,1.05,Cv),T(t,e,-2.5,4.7,3.08,4.42,1.05,1.12,[.95,.95,.93]),T(t,e,-2.35,4.55,3.08,3.22,.42,1.02,oo),T(t,e,-1.6,1.6,3.04,3.18,1.12,1.22,jc),T(t,e,-4.35,-3.85,1.95,2.5,.04,1.35,[.16,.16,.17]),T(t,e,-4.28,-3.92,1.9,2.02,.7,1.22,[.05,.05,.06]),T(t,e,-7.5,-7,1.95,2.5,.04,1.35,[.16,.16,.17]),T(t,e,-7.43,-7.07,1.9,2.02,.7,1.22,[.05,.05,.06]),T(t,e,-3,3.2,13.4,14.9,.04,1,[.22,.22,.24]),T(t,e,-1.2,1,13.55,14.6,1,1.08,jc);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:mcd:shell",l.add(c);let u=Lv();if(u){let g=new X;ff(g,e,-2.15,2.55,1.35,2.75,.7),ff(g,e,1,4.5,1.45,2.9,1.55);let b=new k(g.geometry(),new z({map:u,side:Q}));b.name="aw:mcd:menu",l.add(b)}let h=new q(Iv(),new z({vertexColors:!0}),10),d=new q(Pv(),new z({vertexColors:!0}),5);h.name="aw:mcd:chairs",d.name="aw:mcd:tables",h.frustumCulled=!1,d.frustumCulled=!1;let f=[[-7.3,5.6],[-3.7,6.8],[-7.2,9.4],[1.4,5.8],[3.8,9.2]];f.forEach(([g,b],v)=>{Jc(d,v,e,g,b,[0,1]),Jc(h,v*2,e,g,b-.7,[e.nx,e.nz]),Jc(h,v*2+1,e,g,b+.7,[-e.nx,-e.nz])}),h.count=f.length*2,d.count=f.length,h.instanceMatrix.needsUpdate=!0,d.instanceMatrix.needsUpdate=!0,h.boundingSphere=new W(new M(0,1,0),24),d.boundingSphere=new W(new M(0,1,0),24),l.add(h,d);let p=new q(new Be(.08,5,4),new z({color:16759821}),4);p.name="aw:mcd:bags",p.frustumCulled=!1;let m=new M(.7,1.1,.7);[-1.4,-.3,.8,1.9].forEach((g,b)=>{let v=w(e,g,3.7,1.22);co.set(v[0],v[1],v[2]),p.setMatrixAt(b,vf.compose(co,Qc.identity(),m))}),p.count=4,p.instanceMatrix.needsUpdate=!0,p.boundingSphere=new W(new M(0,1,0),20),l.add(p)}var ru=-8064.4,au=-5917.18,yf=[[-8085.1,-5908.6],[-8045.2,-5904.4],[-8042.6,-5926.7],[-8084.7,-5929]],Ov=[[-20.7,8.57],[19.2,12.77],[21.8,-9.53],[-20.3,-11.82]],ei=De(Ov,3,2),iu=0,ho=2.2,fo=2.85;ei.doorAt=iu;ei.depth=14;var uo=[0,.44,.29],Ws=[.12,.22,.2],Mf=[.62,.4,.2],po=[.4,.24,.12],Vs=[.95,.92,.86],Fv=[.94,.92,.88],Uv=[.55,.62,.58],Bv=[.97,.96,.94],wf=[{a0:3.3,a1:11.3,d0:2.3,d1:4},{a0:3.15,a1:4.7,d0:1.5,d1:2.4},{a0:-8.1,a1:-6.9,d0:4.7,d1:5.9},{a0:-4.9,a1:-3.5,d0:7.4,d1:8.6},{a0:-8.6,a1:-7.4,d0:9.9,d1:11.1},{a0:5.9,a1:7.1,d0:6,d1:7.2},{a0:2,a1:3.2,d0:8.5,d1:9.7},{a0:-3.4,a1:-2.2,d0:10.9,d1:12.1},{a0:-4.2,a1:8.2,d0:12.5,d1:13.8}],Xs={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function kv(){let l=new X;T(l,Xs,-.2,.2,-.18,.18,.44,.5,Ws),T(l,Xs,-.2,.2,-.2,-.14,.5,.92,uo);for(let[e,t]of[[-.16,-.14],[.16,-.14],[-.16,.14],[.16,.14]])T(l,Xs,e-.02,e+.02,t-.02,t+.02,.02,.44,po);return l.geometry()}function zv(){let l=new X;return T(l,Xs,-.42,.42,-.42,.42,.72,.78,Mf),T(l,Xs,-.06,.06,-.06,.06,.05,.72,po),l.geometry()}function Gv(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f3efe6",e.fillRect(0,0,512,512),e.fillStyle="#00704a",e.fillRect(0,0,512,86),e.fillStyle="#ffffff",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("STARBUCKS",256,34),e.font="600 18px Arial, sans-serif",e.fillText("Paseo Herencia",256,66),[["Pike Place","4.25"],["Caffe Latte","5.50"],["Cappuccino","5.25"],["Americano","4.50"],["Caramel Macchiato","6.25"],["Caffe Mocha","5.95"],["Frappuccino","6.50"],["Iced Tea","4.25"]].forEach((i,s)=>{let r=128+s*42;e.fillStyle=s%2?"#e7f2ec":"#f3efe6",e.fillRect(16,r-22,480,42),e.fillStyle="#1e3932",e.font="600 24px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],32,r),e.textAlign="right",e.fillText(i[1],476,r)});let n=new ue(l);return n.colorSpace=J,n}function Hv(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,o,n-r,i),w(e,o,n+r,i),w(e,o,n+r,s),w(e,o,n-r,s)],c,[1,1,1],u)};a(t,[-e.ux,0,-e.uz],[[1,0],[0,0],[0,1],[1,1]]),a(t-.03,[e.ux,0,e.uz],[[0,0],[1,0],[1,1],[0,1]])}var Vv=new M(0,1,0),su=new K,mo=new M,Wv=new M(1,1,1),Sf=new F;function nu(l,e,t,n,i,s){let r=w(t,n,i,0);mo.set(r[0],0,r[2]),su.setFromAxisAngle(Vv,Math.atan2(s[0],s[1])),l.setMatrixAt(e,Sf.compose(mo,su,Wv))}function Af(l,e){let t=new X,n=ei.halfW,i=ei.depth,s=iu-ho,r=iu+ho,a=.12;t.quad([w(e,-n+.4,.02,.02),w(e,n-.4,.02,.02),w(e,n-.4,i-.3,.02),w(e,-n+.4,i-.3,.02)],[0,1,0],[.72,.69,.64]);let o=1.6;for(let g=-n+.6;g<n-.7;g+=o)for(let b=.06;b<i-.45;b+=o){let v=Math.min(g+o-.05,n-.5),y=Math.min(b+o-.05,i-.35),_=(Math.round(g/o)+Math.round(b/o)&1)===0;t.quad([w(e,g,b,.07),w(e,v,b,.07),w(e,v,y,.07),w(e,g,y,.07)],[0,1,0],_?Fv:Uv)}t.quad([w(e,-n+.45,.3,3.15),w(e,n-.45,.3,3.15),w(e,n-.45,i-.35,3.15),w(e,-n+.45,i-.35,3.15)],[0,-1,0],[.93,.9,.84]),T(t,e,-n+.28,-n+.28+a,.4,i-.25,.04,3.15,Vs),T(t,e,n-.28-a,n-.28,.4,i-.25,.04,3.15,Vs),T(t,e,-n+.35,n-.35,i-.28,i-.16,.04,3.15,Ws),T(t,e,-n+.3,s,.16,.16+a,.02,fo,Vs),T(t,e,r,n-.3,.16,.16+a,.02,fo,Vs),T(t,e,s,r,.18,.18+a,2.52,2.8,uo),T(t,e,s+.04,s+.16,.18,.42,.02,2.7,Ws),T(t,e,r-.16,r-.04,.18,.42,.02,2.7,Ws),T(t,e,-n+.35,n-.35,.2,.4,2.88,3.16,Vs),T(t,e,3.4,11.2,2.45,3.9,.04,1.05,Mf),T(t,e,3.35,11.25,2.4,3.95,1.05,1.12,po),T(t,e,3.4,11.2,2.4,2.55,.2,1.05,uo),T(t,e,3.2,4.6,1.55,2.35,.7,1.15,Bv),T(t,e,3.25,4.55,1.6,2.3,.15,.7,po),T(t,e,-4,8,12.7,13.6,.04,1,Ws),T(t,e,-1,2.2,12.85,13.4,1,1.08,uo);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:sbux:shell",l.add(c);let u=Gv();if(u){let g=new X;Hv(g,e,3.15,3.15,1.45,2.95,1.15);let b=new k(g.geometry(),new z({map:u,side:Q}));b.name="aw:sbux:menu",l.add(b)}let h=[[-7.5,5.3],[-4.2,8],[-8,10.5],[6.5,6.6],[2.6,9.1],[-2.8,11.5]],d=new q(kv(),new z({vertexColors:!0}),h.length*2),f=new q(zv(),new z({vertexColors:!0}),h.length);d.name="aw:sbux:chairs",f.name="aw:sbux:tables",d.frustumCulled=!1,f.frustumCulled=!1,h.forEach(([g,b],v)=>{nu(f,v,e,g,b,[1,0]),nu(d,v*2,e,g-.75,b,[e.ux,e.uz]),nu(d,v*2+1,e,g+.75,b,[-e.ux,-e.uz])}),d.count=h.length*2,f.count=h.length,d.instanceMatrix.needsUpdate=!0,f.instanceMatrix.needsUpdate=!0,d.boundingSphere=new W(new M(0,1,0),28),f.boundingSphere=new W(new M(0,1,0),28),l.add(d,f);let p=new q(new Be(.07,6,4),new z({color:16052714}),4);p.name="aw:sbux:cups",p.frustumCulled=!1;let m=new M(.85,1.15,.85);[4.2,6.1,8,9.6].forEach((g,b)=>{let v=w(e,g,3.15,1.2);mo.set(v[0],v[1],v[2]),p.setMatrixAt(b,Sf.compose(mo,su.identity(),m))}),p.count=4,p.instanceMatrix.needsUpdate=!0,p.boundingSphere=new W(new M(0,1,0),22),l.add(p)}var lu=-7891.58,cu=-5983.49,If=[[-7971.5,-5946.6],[-7932.6,-5941.9],[-7933.2,-5937],[-7928.7,-5936.4],[-7928.1,-5941.4],[-7870.6,-5935.2],[-7871.9,-5933.5],[-7871.4,-5931.2],[-7869.7,-5930.2],[-7867.6,-5930.6],[-7866.8,-5931.4],[-7866.5,-5933.6],[-7867.9,-5935.3],[-7869.9,-5935.6],[-7866.5,-5970.7],[-7885.8,-5972.7],[-7884.4,-5986.3],[-7865.1,-5984.4],[-7861.6,-6019.9],[-7860.2,-6019.4],[-7858.2,-6019.9],[-7857,-6021.7],[-7857.4,-6023.7],[-7859.3,-6025],[-7861.4,-6024.6],[-7862.6,-6022.9],[-7862.3,-6020.7],[-7919.6,-6026.3],[-7919.1,-6032.4],[-7923,-6032.8],[-7923.2,-6030.6],[-7926.2,-6030.9],[-7926.5,-6027.1],[-7961.6,-6030.5]],Ys={mx:39.8,mz:-17.5,ux:-.0995,uz:.995,nx:-.995,nz:-.0995,halfW:6.2,depth:22,minX:-20,maxX:55,minZ:-45,maxZ:10,doorAt:0,mouthIn:13.2},go=3.3,xo=4.65,Tf=[.05,.28,.72],Xv=[.03,.16,.42],qs=[.95,.93,.9],qv=[.93,.93,.9],Yv=[.72,.78,.82],Ef=[.84,.58,.4],Zv=[.72,.08,.12],Kv=[.95,.78,.12],jv=[.45,.3,.16],Pf=[{a0:3.15,a1:5.85,d0:14.1,d1:16.5},{a0:-5.85,a1:-3.15,d0:14.1,d1:16.5},{a0:-2.3,a1:2.3,d0:19.1,d1:21.3},{a0:2.05,a1:3.15,d0:13.5,d1:14.85},{a0:-3.15,a1:-2.05,d0:13.5,d1:14.85}],ou={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function Jv(){let l=new X;T(l,ou,-.55,.55,-.22,.22,.42,.5,jv),T(l,ou,-.55,.55,-.24,-.16,.5,.92,Xv);for(let[e,t]of[[-.46,-.16],[.46,-.16],[-.46,.16],[.46,.16]])T(l,ou,e-.03,e+.03,t-.03,t+.03,.04,.42,[.25,.27,.3]);return l.geometry()}function $v(l,e,t,n){let i=document.createElement("canvas");i.width=512,i.height=256;let s=i.getContext("2d");if(!s)return null;s.fillStyle=t,s.fillRect(0,0,512,256),s.fillStyle=n,s.font="700 54px Arial, sans-serif",s.textAlign="center",s.textBaseline="middle",s.fillText(l,256,e?100:128),e&&(s.font="600 28px Arial, sans-serif",s.fillText(e,256,168));let r=new ue(i);return r.colorSpace=J,r}function Qv(l,e,t,n,i,s,r,a){let o=[e.nx*a,0,e.nz*a],c=a<0?[[1,0],[0,0],[0,1],[1,1]]:[[0,0],[1,0],[1,1],[0,1]];l.quad([w(e,t,i,s),w(e,n,i,s),w(e,n,i,r),w(e,t,i,r)],o,[1,1,1],c)}var e_=new M(0,1,0),Rf=new K,Cf=new M,t_=new M(1,1,1),n_=new F;function Lf(l,e){let t=new X,n=Ys.halfW,i=Ys.depth,s=-go,r=go;t.quad([w(e,-n+.3,.15,.02),w(e,n-.3,.15,.02),w(e,n-.3,i-.25,.02),w(e,-n+.3,i-.25,.02)],[0,1,0],[.8,.8,.78]);let a=1.8;for(let d=-n+.45;d<n-.5;d+=a)for(let f=.2;f<i-.35;f+=a){let p=Math.min(d+a-.06,n-.4),m=Math.min(f+a-.06,i-.3),g=(Math.round(d/a)+Math.round(f/a)&1)===0;t.quad([w(e,d,f,.06),w(e,p,f,.06),w(e,p,m,.06),w(e,d,m,.06)],[0,1,0],g?qv:Yv)}t.quad([w(e,-n+.35,.4,4.35),w(e,n-.35,.4,4.35),w(e,n-.35,i-.3,4.35),w(e,-n+.35,i-.3,4.35)],[0,-1,0],[.96,.96,.94]),T(t,e,s,r,.25,1.3,4.15,4.4,Tf),T(t,e,-n+.2,-n+.38,.4,i-.3,.04,4.3,qs),T(t,e,n-.38,n-.2,.4,i-.3,.04,4.3,qs),T(t,e,-n+.3,n-.3,i-.35,i-.18,.04,4.3,qs),T(t,e,-n+.3,s,.12,.32,.02,xo,Ef),T(t,e,r,n-.3,.12,.32,.02,xo,Ef),T(t,e,3.2,5.8,14.2,16.4,.05,1.05,qs),T(t,e,3.2,5.8,14.15,14.4,1.05,2.55,Tf),T(t,e,3.25,5.75,14.1,14.28,2.55,2.72,Kv),T(t,e,-5.8,-3.2,14.2,16.4,.05,1.05,qs),T(t,e,-5.8,-3.2,14.15,14.4,1.05,2.45,[.15,.18,.45]),T(t,e,-2.2,2.2,19.2,21.2,.05,1.1,[.12,.12,.14]),T(t,e,-2.8,2.8,19.05,19.3,1.1,2.7,Zv);let o=new k(t.geometry(),new z({vertexColors:!0,side:Q}));o.name="aw:plaza:shell",l.add(o),[["SKECHERS","","#0a2a6b","#ffe14a",3.25,5.75,14.12,1.2,2.45],["NIEL'S","FASHION","#101433","#ffffff",-5.75,-3.25,14.12,1.15,2.35],["CARIBBEAN","CINEMAS","#b00018","#ffffff",-2.1,2.1,19.02,1.25,2.55],["PALM BEACH","PLAZA","#08306b","#ffffff",-1.8,1.8,6.4,2.85,4.05]].forEach((d,f)=>{let p=$v(d[0],d[1],d[2],d[3]);if(!p)return;let m=new X;Qv(m,e,d[4],d[5],d[6],d[7],d[8],-1);let g=new k(m.geometry(),new z({map:p,side:Q}));g.name="aw:plaza:sign"+f,l.add(g)});let u=[[2.6,14.15],[-2.6,14.15]],h=new q(Jv(),new z({vertexColors:!0}),u.length);h.name="aw:plaza:benches",h.frustumCulled=!1,u.forEach(([d,f],p)=>{let m=w(e,d,f,0);Cf.set(m[0],0,m[2]),Rf.setFromAxisAngle(e_,Math.atan2(e.ux,e.uz)),h.setMatrixAt(p,n_.compose(Cf,Rf,t_))}),h.count=u.length,h.instanceMatrix.needsUpdate=!0,h.boundingSphere=new W(new M(0,1,0),24),l.add(h)}var hu=-8050.1,du=-5471.13,Nf=[[-8057.4,-5467.6],[-8044.4,-5465.4],[-8042.8,-5474.7],[-8055.8,-5476.8]],i_=[[-7.3,3.47],[5.7,5.73],[7.3,-3.57],[-5.7,-5.67]],ti=De(i_,0,1),yo=1.65,Mo=3.4;ti.doorAt=0;ti.depth=7.6;var xn=[.07,.07,.08],Zs=[.74,.05,.07],Df=[.93,.74,.1],uu=[.45,.28,.13],fu=[.28,.16,.08],s_=[.14,.14,.15],r_=[.22,.2,.18],a_=[.93,.9,.84],Of=[{a0:1.55,a1:5.15,d0:2.15,d1:3.55},{a0:1.85,a1:2.45,d0:1.45,d1:2.05},{a0:3.05,a1:3.65,d0:1.45,d1:2.05},{a0:4.25,a1:4.85,d0:1.45,d1:2.05},{a0:-4.85,a1:-3.55,d0:3.15,d1:4.45},{a0:-4.7,a1:-3.4,d0:5.45,d1:6.75}],bn={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function o_(){let l=new X;return T(l,bn,-.16,.16,-.16,.16,.62,.72,xn),T(l,bn,-.04,.04,-.04,.04,.08,.62,[.55,.55,.58]),T(l,bn,-.14,.14,-.14,.14,.02,.08,xn),l.geometry()}function l_(){let l=new X;return T(l,bn,-.42,.42,-.42,.42,.7,.76,uu),T(l,bn,-.05,.05,-.05,.05,.05,.7,fu),l.geometry()}function c_(){let l=new X;T(l,bn,-.18,.18,-.18,.18,.42,.48,xn),T(l,bn,-.18,.18,-.18,-.12,.48,.9,Zs);for(let[e,t]of[[-.14,-.14],[.14,-.14],[-.14,.14],[.14,.14]])T(l,bn,e-.02,e+.02,t-.02,t+.02,.04,.42,fu);return l.geometry()}function u_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#141416",e.fillRect(0,0,512,512),e.fillStyle="#c8102e",e.fillRect(0,0,512,92),e.fillStyle="#f5d76e",e.font="700 40px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HARD ROCK",256,36),e.font="600 20px Arial, sans-serif",e.fillStyle="#ffffff",e.fillText("CAFE  \xB7  PALM BEACH",256,70),[["Legendary Burger","16"],["BBQ Ribs","22"],["Chicken Wings","14"],["Grilled Chicken","17"],["Caesar Salad","13"],["Fries","6"]].forEach((i,s)=>{let r=140+s*56;e.fillStyle=s%2?"#1c1c20":"#141416",e.fillRect(18,r-26,476,52),e.fillStyle="#f4efe4",e.font="600 26px Arial, sans-serif",e.textAlign="left",e.fillText(i[0],36,r),e.fillStyle="#f5d76e",e.textAlign="right",e.fillText(i[1],472,r)});let n=new ue(l);return n.colorSpace=J,n}function h_(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,o,n-r,i),w(e,o,n+r,i),w(e,o,n+r,s),w(e,o,n-r,s)],c,[1,1,1],u)};a(t,[-e.ux,0,-e.uz],[[0,0],[1,0],[1,1],[0,1]]),a(t-.03,[e.ux,0,e.uz],[[1,0],[0,0],[0,1],[1,1]])}var bo=new M(0,1,0),mn=new K,gn=new M,vo=new M(1,1,1),_o=new F;function Ff(l,e){let t=new X,n=ti.halfW,i=ti.depth,s=-yo,r=yo,a=.1;t.quad([w(e,-n+.3,.15,.02),w(e,n-.3,.15,.02),w(e,n-.3,i-.25,.02),w(e,-n+.3,i-.25,.02)],[0,1,0],[.1,.1,.11]);let o=1.35;for(let g=-n+.4;g<n-.45;g+=o)for(let b=.2;b<i-.35;b+=o){let v=Math.min(g+o-.05,n-.35),y=Math.min(b+o-.05,i-.28),_=(Math.round(g/o)+Math.round(b/o)&1)===0;t.quad([w(e,g,b,.05),w(e,v,b,.05),w(e,v,y,.05),w(e,g,y,.05)],[0,1,0],_?s_:r_)}t.quad([w(e,-n+.35,.3,3.55),w(e,n-.35,.3,3.55),w(e,n-.35,i-.3,3.55),w(e,-n+.35,i-.3,3.55)],[0,-1,0],[.1,.1,.11]),T(t,e,-n+.18,-n+.18+a,.3,i-.2,.04,3.5,xn),T(t,e,n-.18-a,n-.18,.3,i-.2,.04,3.5,xn),T(t,e,-n+.25,n-.25,i-.28,i-.16,.04,3.5,xn),T(t,e,-n+.25,s,.12,.12+a,.02,Mo,xn),T(t,e,r,n-.25,.12,.12+a,.02,Mo,xn),T(t,e,s,r,.14,.14+a,3.05,3.32,Zs),T(t,e,s,r,.16,.16+a,2.92,3.04,Df),T(t,e,1.6,5.1,2.2,3.5,.04,1.05,uu),T(t,e,1.55,5.15,2.15,3.55,1.05,1.12,fu),T(t,e,1.6,5.1,2.15,2.32,.15,1.05,Zs),T(t,e,1.55,1.72,2.2,3.5,.15,1.05,Zs),T(t,e,1.6,5.1,2.15,2.28,1.02,1.08,Df),T(t,e,-.55,.55,i-.42,i-.22,1.15,1.85,Zs),T(t,e,-.08,.08,i-.4,i-.24,1.85,2.85,uu),T(t,e,-.16,.16,i-.4,i-.24,2.85,3.1,a_);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:hr:shell",l.add(c);let u=u_();if(u){let g=new X;h_(g,e,1.52,2.85,1.25,2.85,.85);let b=new k(g.geometry(),new z({map:u,side:Q}));b.name="aw:hr:menu",l.add(b)}let h=[[2.15,1.75],[3.35,1.75],[4.55,1.75]],d=new q(o_(),new z({vertexColors:!0}),h.length);d.name="aw:hr:stools",d.frustumCulled=!1,h.forEach(([g,b],v)=>{let y=w(e,g,b,0);gn.set(y[0],0,y[2]),mn.setFromAxisAngle(bo,Math.atan2(-e.ux,-e.uz)),d.setMatrixAt(v,_o.compose(gn,mn,vo))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new W(new M(0,1,0),16),l.add(d);let f=[[-4.2,3.8],[-4.05,6.1]],p=new q(c_(),new z({vertexColors:!0}),f.length*2),m=new q(l_(),new z({vertexColors:!0}),f.length);p.name="aw:hr:chairs",m.name="aw:hr:tables",p.frustumCulled=!1,m.frustumCulled=!1,f.forEach(([g,b],v)=>{let y=w(e,g,b,0);gn.set(y[0],0,y[2]),mn.setFromAxisAngle(bo,0),m.setMatrixAt(v,_o.compose(gn,mn,vo));let _=w(e,g-.7,b,0);gn.set(_[0],0,_[2]),mn.setFromAxisAngle(bo,Math.atan2(e.ux,e.uz)),p.setMatrixAt(v*2,_o.compose(gn,mn,vo));let S=w(e,g+.7,b,0);gn.set(S[0],0,S[2]),mn.setFromAxisAngle(bo,Math.atan2(-e.ux,-e.uz)),p.setMatrixAt(v*2+1,_o.compose(gn,mn,vo))}),p.count=f.length*2,m.count=f.length,p.instanceMatrix.needsUpdate=!0,m.instanceMatrix.needsUpdate=!0,p.boundingSphere=new W(new M(0,1,0),16),m.boundingSphere=new W(new M(0,1,0),16),l.add(p,m)}var vu=-7830.95,_u=-6156.4,kf=[[-7847.6,-6120],[-7820.6,-6117.4],[-7814.2,-6193.2],[-7841.4,-6195]],d_=[[-16.65,36.4],[10.35,39],[16.75,-36.8],[-10.45,-38.6]],vn=De(d_,0,1),wo=3.35,Ks=4.15;vn.doorAt=0;vn.depth=13.6;vn.halfW=9.4;var Wi=[.94,.94,.95],pu=[.06,.2,.46],f_=[.16,.4,.68],zf=[.91,.88,.82],p_=[.74,.82,.86],bu=[.52,.36,.2],js=[.32,.2,.1],Uf=[.2,.46,.26],m_=[.14,.34,.6],oe=1.42,Gf=[{a0:-3.4,a1:3.4,d0:8.5,d1:10.5},{a0:5.15,a1:8.7,d0:2.25,d1:4.15},{a0:-7.15,a1:-5.35,d0:4.15,d1:5.55},{a0:-6.9,a1:-5.1,d0:6.55,d1:7.95},{a0:-4.3,a1:-2.7,d0:5.2,d1:6.5}],Yi={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function g_(){let l=new X;return T(l,Yi,-.28,.28,-.28,.28,.4,.48,m_),T(l,Yi,-.28,.28,-.28,-.16,.48,.86,zf),T(l,Yi,-.26,-.2,-.26,.26,.2,.52,js),T(l,Yi,.2,.26,-.26,.26,.2,.52,js),l.geometry()}function x_(){let l=new X;return T(l,Yi,-.36,.36,-.36,.36,.4,.46,bu),T(l,Yi,-.05,.05,-.05,.05,.05,.4,js),l.geometry()}function Bf(l){let e=document.createElement("canvas");e.width=512,e.height=512;let t=e.getContext("2d");if(!t)return null;l==="desk"?(t.fillStyle="#0d2748",t.fillRect(0,0,512,512),t.fillStyle="#ffffff",t.font="700 54px Arial, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("RADISSON",256,150),t.fillStyle="#8ec8f0",t.font="700 48px Arial, sans-serif",t.fillText("BLU",256,214),t.fillStyle="#d5e4f2",t.font="600 26px Arial, sans-serif",["Reception","The Clover","Pool  \xB7  Beach"].forEach((s,r)=>t.fillText(s,256,310+r*48))):(t.fillStyle="#1c2418",t.fillRect(0,0,512,512),t.fillStyle="#2f6b3a",t.fillRect(0,0,512,96),t.fillStyle="#f4efe4",t.font="700 40px Arial, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("THE CLOVER",256,40),t.font="600 18px Arial, sans-serif",t.fillText("COFFEE  \xB7  TEA",256,74),[["House Coffee","4"],["Espresso","3"],["Iced Tea","4"],["Fruit Bowl","8"],["Avocado Toast","11"]].forEach((s,r)=>{let a=150+r*64;t.fillStyle=r%2?"#243024":"#1c2418",t.fillRect(16,a-28,480,56),t.fillStyle="#f4efe4",t.font="600 26px Arial, sans-serif",t.textAlign="left",t.fillText(s[0],36,a),t.fillStyle="#d4e37a",t.textAlign="right",t.fillText(s[1],468,a)}));let n=new ue(e);return n.colorSpace=J,n}function b_(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,n,o,s),w(e,i,o,s),w(e,i,o,r),w(e,n,o,r)],c,[1,1,1],u)};a(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),a(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}function v_(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,o,n-r,i),w(e,o,n+r,i),w(e,o,n+r,s),w(e,o,n-r,s)],c,[1,1,1],u)};a(t,[-e.ux,0,-e.uz],[[0,0],[1,0],[1,1],[0,1]]),a(t-.03,[e.ux,0,e.uz],[[1,0],[0,0],[0,1],[1,1]])}var mu=new M(0,1,0),Xi=new K,qi=new M,gu=new M(1,1,1),xu=new F;function Hf(l,e){let t=new X,n=vn.halfW,i=vn.depth,s=-wo,r=wo,a=.12;t.quad([w(e,-n+.25,.12,oe),w(e,n-.25,.12,oe),w(e,n-.25,i-.2,oe),w(e,-n+.25,i-.2,oe)],[0,1,0],[.86,.84,.8]);let o=1.6;for(let g=-n+.35;g<n-.4;g+=o)for(let b=.18;b<i-.3;b+=o){let v=Math.min(g+o-.06,n-.3),y=Math.min(b+o-.06,i-.24),_=(Math.round(g/o)+Math.round(b/o)&1)===0;t.quad([w(e,g,b,oe+.03),w(e,v,b,oe+.03),w(e,v,y,oe+.03),w(e,g,y,oe+.03)],[0,1,0],_?zf:p_)}t.quad([w(e,-n+.3,.25,4.02),w(e,n-.3,.25,4.02),w(e,n-.3,i-.25,4.02),w(e,-n+.3,i-.25,4.02)],[0,-1,0],Wi),T(t,e,-n+.4,n-.4,.4,i-.35,3.88,4,pu),T(t,e,-n+.15,-n+.15+a,.2,i-.15,oe,3.98,Wi),T(t,e,n-.15-a,n-.15,.2,i-.15,oe,3.98,Wi),T(t,e,-n+.2,n-.2,i-.22,i-.1,oe,3.98,Wi),T(t,e,-n+.2,s,.1,.1+a,oe,Ks,Wi),T(t,e,r,n-.2,.1,.1+a,oe,Ks,Wi),T(t,e,s,r,.12,.12+a,3.78,Ks+.02,pu),T(t,e,-3.2,3.2,8.6,10.3,oe,oe+1.05,bu),T(t,e,-3.3,3.3,8.55,10.4,oe+1.05,oe+1.12,js),T(t,e,-3.2,3.2,8.5,8.7,oe+.08,oe+1.05,pu),T(t,e,-3.2,3.2,8.52,8.66,oe+.92,oe+1,f_),T(t,e,5.2,8.6,2.3,4.05,oe,oe+1.02,bu),T(t,e,5.15,8.65,2.25,4.1,oe+1.02,oe+1.1,js),T(t,e,5.2,5.38,2.35,4,oe+.1,oe+1.02,Uf),T(t,e,7.6,8.4,2.45,3.15,oe+1.1,oe+1.7,Uf),T(t,e,6.3,7.2,2.4,3,oe+1.1,oe+1.52,[.55,.62,.32]);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:rd:shell",l.add(c);let u=Bf("desk");if(u){let g=new X;b_(g,e,11.15,-2.5,2.5,oe+1.15,oe+2.45);let b=new k(g.geometry(),new z({map:u,side:Q}));b.name="aw:rd:desk",l.add(b)}let h=Bf("clover");if(h){let g=new X;v_(g,e,5.12,3.15,oe+1.15,oe+2.35,.7);let b=new k(g.geometry(),new z({map:h,side:Q}));b.name="aw:rd:clover",l.add(b)}let d=[[-6.25,4.85],[-6,7.25]],f=new q(g_(),new z({vertexColors:!0}),d.length*2),p=new q(x_(),new z({vertexColors:!0}),1);f.name="aw:rd:chairs",p.name="aw:rd:tables",f.frustumCulled=!1,p.frustumCulled=!1,d.forEach(([g,b],v)=>{let y=w(e,g-.55,b,0);qi.set(y[0],oe,y[2]),Xi.setFromAxisAngle(mu,Math.atan2(e.nx,e.nz)),f.setMatrixAt(v*2,xu.compose(qi,Xi,gu));let _=w(e,g+.55,b,0);qi.set(_[0],oe,_[2]),Xi.setFromAxisAngle(mu,Math.atan2(-e.nx,-e.nz)),f.setMatrixAt(v*2+1,xu.compose(qi,Xi,gu))});let m=w(e,-3.5,5.85,0);qi.set(m[0],oe,m[2]),Xi.setFromAxisAngle(mu,0),p.setMatrixAt(0,xu.compose(qi,Xi,gu)),f.count=d.length*2,p.count=1,f.instanceMatrix.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0,f.boundingSphere=new W(new M(0,1,0),20),p.boundingSphere=new W(new M(0,1,0),20),l.add(f,p)}var Mu=-8208.36,wu=-5722.87,jf=[[-8279.3,-5764.7],[-8277.7,-5764.3],[-8279.3,-5758.7],[-8196.9,-5735.5],[-8213.1,-5679],[-8239.9,-5686.5],[-8241.1,-5682.5],[-8242.9,-5683.1],[-8245.7,-5673.4],[-8243.8,-5672.9],[-8245.1,-5668.4],[-8201.5,-5656.6],[-8200.1,-5661.4],[-8196.7,-5660.5],[-8193.3,-5672.4],[-8196.7,-5673.4],[-8190.7,-5694.2],[-8184.5,-5692.5],[-8181.4,-5703],[-8188,-5704.8],[-8183.8,-5719.4],[-8163.2,-5713.6],[-8164,-5710.8],[-8154.6,-5708.1],[-8151.9,-5717.5],[-8156.1,-5718.7],[-8147.5,-5748.7],[-8156,-5751.1],[-8148.3,-5777.8],[-8170,-5784],[-8169.7,-5784.9],[-8176.2,-5786.7],[-8176.8,-5784.3],[-8182.3,-5785.8],[-8190,-5758.9],[-8258.7,-5778.3],[-8258.4,-5779.4],[-8268.2,-5782.2],[-8269.1,-5779.1],[-8274.8,-5780.7]],Vf=-.9613,Wf=-.2755,__=[[52.26,4.17],[60.86,-25.84],[60.86+Vf*14,-25.84+Wf*14],[52.26+Vf*14,4.17+Wf*14]],_n=De(__,0,1),So=2.7,Js=4.05;_n.doorAt=0;_n.depth=11.5;_n.halfW=8.2;var ni=[.93,.88,.78],Xf=[.82,.74,.62],yu=[.72,.34,.2],y_=[.48,.3,.16],M_=[.3,.18,.09],qf=[.18,.4,.24],w_=[.96,.94,.9],we=.08,Jf=[{a0:-3.3,a1:3.3,d0:7.15,d1:9.05},{a0:-6.4,a1:-4.6,d0:3.6,d1:5.1},{a0:4.5,a1:6.3,d0:3.8,d1:5.3}],Yf={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function S_(){let l=new X;return T(l,Yf,-.26,.26,-.26,.26,.4,.48,yu),T(l,Yf,-.26,.26,-.26,-.16,.48,.84,ni),l.geometry()}function A_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f3eadc",e.fillRect(0,0,512,512),e.fillStyle="#8c3b22",e.fillRect(0,0,512,168),e.fillStyle="#fff8ee",e.font="700 58px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HYATT",256,58),e.font="600 32px Arial, sans-serif",e.fillText("REGENCY ARUBA",256,118),e.fillStyle="#3a2a1c",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,240+i*64));let t=new ue(l);return t.colorSpace=J,t}function T_(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,n,o,s),w(e,i,o,s),w(e,i,o,r),w(e,n,o,r)],c,[1,1,1],u)};a(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),a(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var E_=new M(0,1,0),Zf=new K,Kf=new M,R_=new M(1,1,1),C_=new F;function $f(l,e){let t=new X,n=_n.halfW,i=_n.depth,s=-So,r=So,a=.12;t.quad([w(e,-n+.25,.12,we),w(e,n-.25,.12,we),w(e,n-.25,i-.2,we),w(e,-n+.25,i-.2,we)],[0,1,0],Xf);let o=1.7;for(let f=-n+.35;f<n-.4;f+=o)for(let p=.16;p<i-.28;p+=o){let m=Math.min(f+o-.07,n-.3),g=Math.min(p+o-.07,i-.22),b=(Math.round(f/o)+Math.round(p/o)&1)===0;t.quad([w(e,f,p,we+.03),w(e,m,p,we+.03),w(e,m,g,we+.03),w(e,f,g,we+.03)],[0,1,0],b?ni:Xf)}t.quad([w(e,-n+.3,.25,3.95),w(e,n-.3,.25,3.95),w(e,n-.3,i-.25,3.95),w(e,-n+.3,i-.25,3.95)],[0,-1,0],w_),T(t,e,-n+.15,-n+.15+a,.2,i-.15,we,3.9,ni),T(t,e,n-.15-a,n-.15,.2,i-.15,we,3.9,ni),T(t,e,-n+.2,n-.2,i-.22,i-.1,we,3.9,ni),T(t,e,-n+.2,s,.1,.1+a,we,Js,ni),T(t,e,r,n-.2,.1,.1+a,we,Js,ni),T(t,e,s,r,.12,.12+a,3.7,Js+.02,yu),T(t,e,-3.15,3.15,7.25,8.95,we,we+1.05,y_),T(t,e,-3.25,3.25,7.2,9,we+1.05,we+1.12,M_),T(t,e,-3.1,3.1,7.15,7.35,we+.1,we+1.05,yu),T(t,e,-5.6,-4.8,3.4,4.2,we,we+.9,qf),T(t,e,4.7,5.6,3.5,4.3,we,we+.9,qf);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:hy:shell",l.add(c);let u=A_();if(u){let f=new X;T_(f,e,9.6,-2.4,2.4,we+1.2,we+2.7);let p=new k(f.geometry(),new z({map:u,side:Q}));p.name="aw:hy:board",l.add(p)}let h=[[-5.5,4.35],[5.4,4.55]],d=new q(S_(),new z({vertexColors:!0}),h.length);d.name="aw:hy:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);Kf.set(g[0],we,g[2]),Zf.setFromAxisAngle(E_,Math.atan2(e.ux,e.uz)+(m?Math.PI:0)),d.setMatrixAt(m,C_.compose(Kf,Zf,R_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new W(new M(0,1,0),18),l.add(d)}var Au=-8295.39,Tu=-5327.6,ap=[[-8333,-5404.5],[-8327.4,-5389.2],[-8323.1,-5390.9],[-8316,-5372.2],[-8324.5,-5369.4],[-8321,-5360.3],[-8324.5,-5358.8],[-8329.4,-5354.3],[-8330.8,-5351.3],[-8332.4,-5344.6],[-8331.5,-5338.6],[-8324.8,-5318],[-8326.7,-5316.1],[-8328.3,-5312.6],[-8329.1,-5308.6],[-8329,-5305],[-8321.7,-5285.8],[-8319.3,-5282.2],[-8313.9,-5279.4],[-8319.1,-5266.5],[-8315.4,-5264.4],[-8323.5,-5248.6],[-8314.9,-5244],[-8307.9,-5260.4],[-8305.4,-5259.6],[-8300.7,-5270.3],[-8303.1,-5271.7],[-8297.3,-5284],[-8298.4,-5287.7],[-8282.3,-5293.9],[-8272.1,-5270.5],[-8246.6,-5280.9],[-8250.7,-5288.9],[-8246.3,-5290.9],[-8251.7,-5303.4],[-8255.4,-5302.1],[-8270.8,-5335.7],[-8273.5,-5330.5],[-8277.7,-5332.9],[-8273.6,-5340.9],[-8269.2,-5339.2],[-8265.7,-5347.7],[-8281,-5353.2],[-8275.3,-5367.4],[-8270,-5354.3],[-8262.4,-5357],[-8272.9,-5386.7],[-8266.7,-5389.7],[-8270.3,-5398.5],[-8280.4,-5394.3],[-8285.8,-5405.6],[-8287.9,-5404.9],[-8295.5,-5388.1]],Qf=-.918,ep=.3966,I_=[[49.08,36.7],[43.68,24.2],[43.68+Qf*14,24.2+ep*14],[49.08+Qf*14,36.7+ep*14]],Mn=De(I_,0,1),Ao=2.8,$s=4.15;Mn.doorAt=0;Mn.depth=10.2;Mn.halfW=5.5;var yn=[.96,.95,.92],P_=[.93,.9,.83],tp=[.84,.8,.72],Su=[.07,.16,.36],L_=[.12,.45,.52],D_=[.72,.58,.28],np=[.16,.4,.26],pe=.08,op=[{a0:-2.85,a1:2.85,d0:7.1,d1:9.05},{a0:-4.85,a1:-3.35,d0:3.55,d1:5.05},{a0:3.25,a1:4.75,d0:3.55,d1:5.05}],ip={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function N_(){let l=new X;return T(l,ip,-.28,.28,-.28,.28,.38,.46,L_),T(l,ip,-.28,.28,-.28,-.16,.46,.86,yn),l.geometry()}function O_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4f1ea",e.fillRect(0,0,512,512),e.fillStyle="#12295c",e.fillRect(0,0,512,176),e.fillStyle="#f7f4ee",e.font="700 64px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("HILTON",256,58),e.font="600 28px Arial, sans-serif",e.fillText("ARUBA CARIBBEAN",256,124),e.fillStyle="#1a2744",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,248+i*64));let t=new ue(l);return t.colorSpace=J,t}function F_(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,n,o,s),w(e,i,o,s),w(e,i,o,r),w(e,n,o,r)],c,[1,1,1],u)};a(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),a(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var U_=new M(0,1,0),sp=new K,rp=new M,B_=new M(1,1,1),k_=new F;function lp(l,e){let t=new X,n=Mn.halfW,i=Mn.depth,s=-Ao,r=Ao,a=.12;t.quad([w(e,-n+.25,.12,pe),w(e,n-.25,.12,pe),w(e,n-.25,i-.2,pe),w(e,-n+.25,i-.2,pe)],[0,1,0],tp);let o=1.65;for(let f=-n+.3;f<n-.35;f+=o)for(let p=.16;p<i-.28;p+=o){let m=Math.min(f+o-.06,n-.28),g=Math.min(p+o-.06,i-.22),b=(Math.round(f/o)+Math.round(p/o)&1)===0;t.quad([w(e,f,p,pe+.03),w(e,m,p,pe+.03),w(e,m,g,pe+.03),w(e,f,g,pe+.03)],[0,1,0],b?P_:tp)}t.quad([w(e,-.7,.3,pe+.045),w(e,.7,.3,pe+.045),w(e,.7,6.7,pe+.045),w(e,-.7,6.7,pe+.045)],[0,1,0],Su),t.quad([w(e,-n+.3,.25,3.95),w(e,n-.3,.25,3.95),w(e,n-.3,i-.25,3.95),w(e,-n+.3,i-.25,3.95)],[0,-1,0],yn),T(t,e,-n+.15,-n+.15+a,.2,i-.15,pe,3.9,yn),T(t,e,n-.15-a,n-.15,.2,i-.15,pe,3.9,yn),T(t,e,-n+.2,n-.2,i-.22,i-.1,pe,3.9,yn),T(t,e,-n+.2,s,.1,.1+a,pe,$s,yn),T(t,e,r,n-.2,.1,.1+a,pe,$s,yn),T(t,e,s,r,.12,.12+a,3.72,$s+.02,Su),T(t,e,-2.7,2.7,7.2,8.95,pe,pe+1.05,yn),T(t,e,-2.8,2.8,7.15,9,pe+1.05,pe+1.14,Su),T(t,e,-2.65,2.65,7.15,7.28,pe+.15,pe+1.05,D_),T(t,e,-4.9,-4.05,3.5,4.3,pe,pe+.85,np),T(t,e,3.95,4.8,3.5,4.3,pe,pe+.85,np);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:ht:shell",l.add(c);let u=O_();if(u){let f=new X;F_(f,e,9.55,-2.2,2.2,pe+1.25,pe+2.75);let p=new k(f.geometry(),new z({map:u,side:Q}));p.name="aw:ht:board",l.add(p)}let h=[[-4.1,4.25],[4,4.25]],d=new q(N_(),new z({vertexColors:!0}),h.length);d.name="aw:ht:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);rp.set(g[0],pe,g[2]),sp.setFromAxisAngle(U_,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,k_.compose(rp,sp,B_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new W(new M(0,1,0),16),l.add(d)}var Eu=-8000.03,Ru=-6711.14,gp=[[-8059.3,-6773.7],[-8057.7,-6751.8],[-8055.9,-6750.9],[-8047.3,-6751.1],[-8045.1,-6753],[-8041.2,-6750.6],[-8039.6,-6753.5],[-8036.2,-6751.3],[-8034.9,-6753.5],[-8031.2,-6750.9],[-8029.4,-6753.7],[-8025.7,-6752.1],[-8024,-6754.3],[-8020.4,-6752.2],[-8018.9,-6755],[-8015.4,-6752.9],[-8013.6,-6755],[-8010.4,-6753.3],[-8008.2,-6755.5],[-8005.4,-6753.4],[-8003.1,-6756.2],[-7999.5,-6754.2],[-7998,-6756.1],[-7994.9,-6754.7],[-7993.6,-6755.7],[-7991.4,-6759.5],[-7984.5,-6756.9],[-7979.5,-6693.7],[-7985.4,-6689.9],[-7988.5,-6694.1],[-7992.1,-6691.4],[-7993.7,-6693.8],[-7997.4,-6691],[-7999,-6693.2],[-8003,-6690.6],[-8004.4,-6692.7],[-8008,-6690],[-8009.5,-6692.3],[-8013.2,-6689.5],[-8014.9,-6691.9],[-8018.4,-6689.3],[-8020.2,-6691.5],[-8023.8,-6688.7],[-8025.4,-6691.2],[-8028.9,-6688.4],[-8031.4,-6691.8],[-8034.8,-6689.2],[-8035.5,-6690],[-8039.4,-6687.5],[-8040.3,-6688.6],[-8043.7,-6688.5],[-8044.2,-6690.4],[-8050.6,-6689.9],[-8050.7,-6688.4],[-8052.5,-6687.7],[-8050.6,-6666.4],[-8048.1,-6664.3],[-8042.2,-6664.8],[-8041.2,-6666.4],[-8037.5,-6667],[-8034.7,-6665.4],[-8032.6,-6667.5],[-8029.3,-6665.9],[-8027.2,-6667.9],[-8024,-6666.2],[-8021.8,-6668.4],[-8018.7,-6666.7],[-8016.6,-6669],[-8013.8,-6667.2],[-8011.5,-6669.5],[-8008.2,-6667.4],[-8006.5,-6669.5],[-8003,-6667.6],[-8001.4,-6670],[-7997.8,-6668.4],[-7995.8,-6670.5],[-7992.3,-6668.6],[-7990.3,-6671.1],[-7986.9,-6669.5],[-7984.9,-6671.9],[-7981.7,-6669.7],[-7980,-6672.1],[-7977.7,-6671.6],[-7976.9,-6671.1],[-7976.9,-6669.9],[-7975.6,-6669.5],[-7974.7,-6660.1],[-7982,-6659.5],[-7980.8,-6644.5],[-7941.1,-6647.9],[-7941.1,-6641.9],[-7929.2,-6643.2],[-7929.9,-6655.3],[-7918.2,-6656.1],[-7918.4,-6659.6],[-7933.9,-6668.8],[-7934.8,-6676.4],[-7925.7,-6684.9],[-7926.3,-6689.1],[-7916.4,-6698.3],[-7918.3,-6717.1],[-7940.6,-6733.6],[-7938.2,-6748.8],[-7947.6,-6766.3],[-7960.3,-6759.7],[-7970.2,-6758.9],[-7987,-6779.9],[-8044.5,-6774.2]],cp=.0337,up=.9994,z_=[[-44.46,-63.06],[-59.27,-62.56],[-59.27+cp*14,-62.56+up*14],[-44.46+cp*14,-63.06+up*14]],Sn=De(z_,0,1),Eo=2.9,xp=4.15;Sn.doorAt=0;Sn.depth=10.4;Sn.halfW=6;var wn=[.94,.9,.82],hp=[.82,.74,.62],To=[.48,.12,.16],G_=[.42,.26,.14],H_=[.28,.16,.08],dp=[.16,.38,.22],V_=[.96,.94,.9],me=.08,bp=[{a0:-3.2,a1:3.2,d0:7.15,d1:9.15},{a0:-5.15,a1:-3.55,d0:3.6,d1:5.15},{a0:3.45,a1:5.05,d0:3.6,d1:5.15}],fp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function W_(){let l=new X;return T(l,fp,-.28,.28,-.28,.28,.38,.46,To),T(l,fp,-.28,.28,-.28,-.16,.46,.86,wn),l.geometry()}function X_(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f6f0e6",e.fillRect(0,0,512,512),e.fillStyle="#7a1e2e",e.fillRect(0,0,512,176),e.fillStyle="#fff8f2",e.font="700 54px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("MARRIOTT",256,58),e.font="600 30px Arial, sans-serif",e.fillText("STELLARIS CASINO",256,122),e.fillStyle="#3a241c",e.font="600 30px Arial, sans-serif",["Reception","Casino","Pool  \xB7  Beach"].forEach((n,i)=>e.fillText(n,256,248+i*64));let t=new ue(l);return t.colorSpace=J,t}function q_(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,n,o,s),w(e,i,o,s),w(e,i,o,r),w(e,n,o,r)],c,[1,1,1],u)};a(t,[-e.nx,0,-e.nz],[[1,0],[0,0],[0,1],[1,1]]),a(t-.04,[e.nx,0,e.nz],[[0,0],[1,0],[1,1],[0,1]])}var Y_=new M(0,1,0),pp=new K,mp=new M,Z_=new M(1,1,1),K_=new F;function vp(l,e){let t=new X,n=Sn.halfW,i=Sn.depth,s=-Eo,r=Eo,a=.12;t.quad([w(e,-n+.25,.12,me),w(e,n-.25,.12,me),w(e,n-.25,i-.2,me),w(e,-n+.25,i-.2,me)],[0,1,0],hp);let o=1.7;for(let f=-n+.32;f<n-.36;f+=o)for(let p=.18;p<i-.3;p+=o){let m=Math.min(f+o-.06,n-.28),g=Math.min(p+o-.06,i-.22),b=(Math.round(f/o)+Math.round(p/o)&1)===0;t.quad([w(e,f,p,me+.03),w(e,m,p,me+.03),w(e,m,g,me+.03),w(e,f,g,me+.03)],[0,1,0],b?wn:hp)}t.quad([w(e,-.75,.3,me+.045),w(e,.75,.3,me+.045),w(e,.75,6.8,me+.045),w(e,-.75,6.8,me+.045)],[0,1,0],To),t.quad([w(e,-n+.28,.22,5.5),w(e,n-.28,.22,5.5),w(e,n-.28,i-.22,5.5),w(e,-n+.28,i-.22,5.5)],[0,-1,0],V_),T(t,e,-n+.15,-n+.15+a,.2,i-.15,me,5.45,wn),T(t,e,n-.15-a,n-.15,.2,i-.15,me,5.45,wn),T(t,e,-n+.2,n-.2,i-.22,i-.1,me,5.45,wn),T(t,e,-n+.2,s,.1,.1+a,me,5.45,wn),T(t,e,r,n-.2,.1,.1+a,me,5.45,wn),T(t,e,s,r,.12,.12+a,3.85,4.05,To),T(t,e,s,r,.1,.1+a,4.05,5.45,wn),T(t,e,-3.05,3.05,7.25,9,me,me+1.05,G_),T(t,e,-3.15,3.15,7.2,9.1,me+1.05,me+1.14,To),T(t,e,-2.95,2.95,7.15,7.32,me+.2,me+1.05,H_),T(t,e,-5.2,-4.3,3.5,4.35,me,me+.85,dp),T(t,e,4.2,5.1,3.5,4.35,me,me+.85,dp);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:mr:shell",l.add(c);let u=X_();if(u){let f=new X;q_(f,e,9.7,-2.5,2.5,me+1.25,me+2.8);let p=new k(f.geometry(),new z({map:u,side:Q}));p.name="aw:mr:board",l.add(p)}let h=[[-4.35,4.35],[4.25,4.35]],d=new q(W_(),new z({vertexColors:!0}),h.length);d.name="aw:mr:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);mp.set(g[0],me,g[2]),pp.setFromAxisAngle(Y_,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,K_.compose(mp,pp,Z_))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new W(new M(0,1,0),18),l.add(d)}var Cu=-8172.13,Iu=-5301.78,Ap=[[-8190.1,-5299.2],[-8165.7,-5290.6],[-8162.5,-5299.5],[-8165.9,-5300.6],[-8163.8,-5306.7],[-8184.8,-5314.1]],_p=.9422,yp=.3351,j_=[[-17.97,2.58],[-12.67,-12.32],[-12.67+_p*12,-12.32+yp*12],[-17.97+_p*12,2.58+yp*12]],Tn=De(j_,0,1),Ro=2.05,Qs=2.75;Tn.doorAt=0;Tn.depth=8.2;Tn.halfW=5.2;var An=[.95,.78,.12],J_=[.86,.66,.08],ii=[.12,.52,.24];var $_=[.45,.28,.14],Q_=[.96,.95,.9],Te=.52,Tp=[{a0:-2.6,a1:2.6,d0:5.55,d1:7.35},{a0:-4.3,a1:-2.9,d0:2.7,d1:4.15},{a0:2.8,a1:4.2,d0:2.7,d1:4.15}],Mp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function ey(){let l=new X;return T(l,Mp,-.24,.24,-.24,.24,.4,.48,An),T(l,Mp,-.24,.24,-.24,-.14,.48,.86,ii),l.geometry()}function ty(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#fff6d8",e.fillRect(0,0,512,512),e.fillStyle="#1a8a3a",e.fillRect(0,0,512,168),e.fillStyle="#fffdf4",e.font="700 46px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("SE\xD1OR FROG'S",256,62),e.font="600 26px Arial, sans-serif",e.fillText("PALM BEACH",256,122),e.fillStyle="#1c3a18",e.font="600 32px Arial, sans-serif",["Margarita","Nachos","Fajitas"].forEach((n,i)=>e.fillText(n,256,246+i*68));let t=new ue(l);return t.colorSpace=J,t}function ny(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,n,o,s),w(e,i,o,s),w(e,i,o,r),w(e,n,o,r)],c,[1,1,1],u)};a(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),a(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var iy=new M(0,1,0),wp=new K,Sp=new M,sy=new M(1,1,1),ry=new F;function Ep(l,e){let t=new X,n=Tn.halfW,i=Tn.depth,s=-Ro,r=Ro,a=.12;t.quad([w(e,-n+.2,.1,Te),w(e,n-.2,.1,Te),w(e,n-.2,i-.18,Te),w(e,-n+.2,i-.18,Te)],[0,1,0],J_);let o=1.35;for(let f=-n+.28;f<n-.3;f+=o)for(let p=.16;p<i-.26;p+=o){let m=Math.min(f+o-.06,n-.24),g=Math.min(p+o-.06,i-.2),b=(Math.round(f/o)+Math.round(p/o)&1)===0;t.quad([w(e,f,p,Te+.03),w(e,m,p,Te+.03),w(e,m,g,Te+.03),w(e,f,g,Te+.03)],[0,1,0],b?An:ii)}t.quad([w(e,-n+.22,.18,2.7),w(e,n-.22,.18,2.7),w(e,n-.22,i-.18,2.7),w(e,-n+.22,i-.18,2.7)],[0,-1,0],Q_),T(t,e,-n+.12,-n+.12+a,.16,i-.12,Te,2.68,An),T(t,e,n-.12-a,n-.12,.16,i-.12,Te,2.68,An),T(t,e,-n+.16,n-.16,i-.2,i-.08,Te,2.68,An),T(t,e,-n+.16,s,.08,.08+a,Te,Qs,An),T(t,e,r,n-.16,.08,.08+a,Te,Qs,An),T(t,e,s,r,.1,.1+a,2.42,Qs,ii),T(t,e,-n+.12,-n+.12+a,.16,i-.12,2.2,2.42,ii),T(t,e,n-.12-a,n-.12,.16,i-.12,2.2,2.42,ii),T(t,e,-n+.16,n-.16,i-.2,i-.08,2.2,2.42,ii),T(t,e,-2.4,2.4,5.7,7.2,Te,Te+1.05,$_),T(t,e,-2.5,2.5,5.6,7.3,Te+1.05,Te+1.14,ii),T(t,e,-2.3,2.3,5.55,5.75,Te+.15,Te+1.05,An);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:sf:shell",l.add(c);let u=ty();if(u){let f=new X;ny(f,e,7.55,-2.1,2.1,Te+1.05,Te+2.15);let p=new k(f.geometry(),new z({map:u,side:Q}));p.name="aw:sf:board",l.add(p)}let h=[[-3.6,3.4],[3.5,3.4]],d=new q(ey(),new z({vertexColors:!0}),h.length);d.name="aw:sf:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);Sp.set(g[0],Te,g[2]),wp.setFromAxisAngle(iy,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,ry.compose(Sp,wp,sy))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new W(new M(0,1,0),14),l.add(d)}var Pu=-8122.03,Lu=-6342.63,Np=[[-8137.2,-6343.4],[-8137.2,-6339.1],[-8135.8,-6335.8],[-8131.3,-6332.8],[-8131.4,-6329],[-8113.5,-6325.6],[-8108.5,-6346.4],[-8104,-6348.9],[-8105.7,-6351.9],[-8113.1,-6348],[-8113.1,-6346],[-8116.1,-6346.4],[-8119.4,-6343.1],[-8122.1,-6344.5],[-8125,-6347.8],[-8128.8,-6349.1],[-8132.3,-6348.7],[-8135.4,-6346.4]],Rp=-.9722,Cp=-.2343,ay=[[13.53,-3.77],[8.52,17.02],[8.52+Rp*12,17.02+Cp*12],[13.53+Rp*12,-3.77+Cp*12]],It=De(ay,0,1),Io=1.45,er=1.65;It.doorAt=8;It.depth=7.2;It.halfW=9.5;var Co=[.05,.42,.48];var Ip=[.9,.82,.66],En=[.96,.95,.92],oy=[.45,.28,.14],Ee=.06,Op=[{a0:6.5,a1:9.4,d0:5.1,d1:6.65},{a0:6.2,a1:7.2,d0:2.4,d1:3.7},{a0:8.8,a1:9.6,d0:2.4,d1:3.7}],Pp={mx:0,mz:0,ux:1,uz:0,nx:0,nz:1};function ly(){let l=new X;return T(l,Pp,-.24,.24,-.24,.24,.4,.48,En),T(l,Pp,-.24,.24,-.24,-.14,.48,.86,Co),l.geometry()}function cy(){let l=document.createElement("canvas");l.width=512,l.height=512;let e=l.getContext("2d");if(!e)return null;e.fillStyle="#f4efe4",e.fillRect(0,0,512,512),e.fillStyle="#0d6b7a",e.fillRect(0,0,512,176),e.fillStyle="#f7fffe",e.font="700 48px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("MOOMBA BEACH",256,68),e.font="600 26px Arial, sans-serif",e.fillText("PALM BEACH",256,128),e.fillStyle="#16343a",e.font="600 32px Arial, sans-serif",["Burger","Fish","Cocktail"].forEach((n,i)=>e.fillText(n,256,250+i*68));let t=new ue(l);return t.colorSpace=J,t}function uy(l,e,t,n,i,s,r){let a=(o,c,u)=>{l.quad([w(e,n,o,s),w(e,i,o,s),w(e,i,o,r),w(e,n,o,r)],c,[1,1,1],u)};a(t,[-e.nx,0,-e.nz],[[0,0],[1,0],[1,1],[0,1]]),a(t-.04,[e.nx,0,e.nz],[[1,0],[0,0],[0,1],[1,1]])}var hy=new M(0,1,0),Lp=new K,Dp=new M,dy=new M(1,1,1),fy=new F;function Fp(l,e){let t=new X,n=It.halfW,i=It.depth,s=It.doorAt-Io,r=It.doorAt+Io,a=.12;t.quad([w(e,-n+.2,.1,Ee),w(e,n-.2,.1,Ee),w(e,n-.2,i-.18,Ee),w(e,-n+.2,i-.18,Ee)],[0,1,0],Ip);let o=1.3;for(let f=-n+.28;f<n-.3;f+=o)for(let p=.16;p<i-.26;p+=o){let m=Math.min(f+o-.06,n-.24),g=Math.min(p+o-.06,i-.2),b=(Math.round(f/o)+Math.round(p/o)&1)===0;t.quad([w(e,f,p,Ee+.03),w(e,m,p,Ee+.03),w(e,m,g,Ee+.03),w(e,f,g,Ee+.03)],[0,1,0],b?Ip:Co)}t.quad([w(e,-n+.22,.18,1.58),w(e,n-.22,.18,1.58),w(e,n-.22,i-.18,1.58),w(e,-n+.22,i-.18,1.58)],[0,-1,0],En),T(t,e,-n+.12,-n+.12+a,.16,i-.12,Ee,1.55,En),T(t,e,n-.12-a,n-.12,.16,i-.12,Ee,1.55,En),T(t,e,-n+.16,n-.16,i-.2,i-.08,Ee,1.55,En),T(t,e,-n+.16,s,.08,.08+a,Ee,er,En),T(t,e,r,n-.16,.08,.08+a,Ee,er,En),T(t,e,s,r,.1,.1+a,1.38,er,Co),T(t,e,6.6,9.3,5.25,6.5,Ee,Ee+1.02,oy),T(t,e,6.5,9.4,5.15,6.6,Ee+1.02,Ee+1.12,Co),T(t,e,6.7,9.2,5.1,5.3,Ee+.15,Ee+1.02,En);let c=new k(t.geometry(),new z({vertexColors:!0,side:Q}));c.name="aw:mb:shell",l.add(c);let u=cy();if(u){let f=new X;uy(f,e,6.75,6.7,9.3,Ee+.55,Ee+1.42);let p=new k(f.geometry(),new z({map:u,side:Q}));p.name="aw:mb:board",l.add(p)}let h=[[6.6,3],[9.2,3]],d=new q(ly(),new z({vertexColors:!0}),h.length);d.name="aw:mb:chairs",d.frustumCulled=!1,h.forEach(([f,p],m)=>{let g=w(e,f,p,0);Dp.set(g[0],Ee,g[2]),Lp.setFromAxisAngle(hy,Math.atan2(e.nx,e.nz)),d.setMatrixAt(m,fy.compose(Dp,Lp,dy))}),d.count=h.length,d.instanceMatrix.needsUpdate=!0,d.boundingSphere=new W(new M(0,1,0),16),l.add(d)}function py(){let l=ht(Hi,Zc,Kc,0);l.poly=of;let e=l.doorAt??0;return{id:"pastechihouse",x:Zc,z:Kc,rot:0,local:Hi,world:l,doorHalf:2.35,doorTop:2.32,doorSide:.55,wall:.34,obs:lf,cut:["ground","lwall"],show:72,hide:96,build:hf,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function my(){let l=ht(Qn,eu,tu,0);l.poly=pf;let e=l.doorAt??0;return{id:"mcd1",x:eu,z:tu,rot:0,local:Qn,world:l,doorHalf:lo,doorTop:mf,doorSide:.55,wall:.34,obs:bf,cut:["ground","lwall"],show:90,hide:120,build:_f,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function gy(){let l=ht(ei,ru,au,0);l.poly=yf;let e=l.doorAt??0;return{id:"starbucks2",x:ru,z:au,rot:0,local:ei,world:l,doorHalf:ho,doorTop:fo,doorSide:.55,wall:.34,obs:wf,cut:["ground","lwall"],show:90,hide:120,build:Af,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function xy(){let l=ht(Ys,lu,cu,0);l.poly=If;let e=l.doorAt??0;return{id:"pbplaza",x:lu,z:cu,rot:0,local:Ys,world:l,doorHalf:go,doorTop:xo,doorSide:1.25,wall:.4,obs:Pf,cut:["glass","rot","ground","lwall"],show:110,hide:140,build:Lf,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function by(){let l=ht(ti,hu,du,0);l.poly=Nf;let e=l.doorAt??0;return{id:"hardrock_pb",x:hu,z:du,rot:0,local:ti,world:l,doorHalf:yo,doorTop:Mo,doorSide:.55,wall:.34,obs:Of,cut:["ground","lwall"],show:80,hide:110,build:Ff,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function vy(){let l=ht(vn,vu,_u,0);l.poly=kf;let e=l.doorAt??0;return{id:"radisson",x:vu,z:_u,rot:0,local:vn,world:l,doorHalf:wo,doorTop:Ks,doorSide:.55,wall:.34,obs:Gf,cut:["ground","lwall"],show:100,hide:130,build:Hf,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function _y(){let l=ht(_n,Mu,wu,0);l.poly=jf;let e=l.doorAt??0;return{id:"hyatt",x:Mu,z:wu,rot:0,local:_n,world:l,doorHalf:So,doorTop:Js,doorSide:.55,wall:.34,obs:Jf,cut:["ground","lwall"],show:110,hide:140,build:$f,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function yy(){let l=ht(Mn,Au,Tu,0);l.poly=ap;let e=l.doorAt??0;return{id:"hilton",x:Au,z:Tu,rot:0,local:Mn,world:l,doorHalf:Ao,doorTop:$s,doorSide:.55,wall:.34,obs:op,cut:["ground","lwall"],show:120,hide:155,build:lp,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function My(){let l=ht(Sn,Eu,Ru,0);l.poly=gp;let e=l.doorAt??0;return{id:"marriott",x:Eu,z:Ru,rot:0,local:Sn,world:l,doorHalf:Eo,doorTop:xp,doorSide:.55,wall:.34,obs:bp,cut:[],show:150,hide:185,floorAt:{x:-8051.89,z:-6773.95},build:vp,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function wy(){let l=ht(Tn,Cu,Iu,0);l.poly=Ap;let e=l.doorAt??0;return{id:"senorfrogs",x:Cu,z:Iu,rot:0,local:Tn,world:l,doorHalf:Ro,doorTop:Qs,doorSide:.55,wall:.34,obs:Tp,cut:["ground","lwall"],show:60,hide:85,build:Ep,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}function Sy(){let l=ht(It,Pu,Lu,0);l.poly=Np;let e=l.doorAt??0;return{id:"moomba",x:Pu,z:Lu,rot:0,local:It,world:l,doorHalf:Io,doorTop:er,doorSide:.55,wall:.34,obs:Op,cut:["ground","lwall"],show:70,hide:95,floorAt:{x:-8112.88,z:-6328.23},build:Fp,group:null,floorY:0,doorOn:{value:0},uU:{value:new B(l.ux,l.uz)},uN:{value:new B(l.nx,l.nz)},uM:{value:new B(l.mx+l.ux*e,l.mz+l.uz*e)},uY:{value:0},patched:!1}}var Ay=`
  if (awDoorOn > 0.5) {
    float awAlong = dot(vAwW.xz - awDoorM, awDoorU);
    float awSide = dot(vAwW.xz - awDoorM, awDoorN);
    if (abs(awSide) < awDoorSide && abs(awAlong) < awDoorHalf && vAwW.y > awDoorY - 0.15 && vAwW.y < awDoorY + awDoorTop) discard;
  }`,Po=class{constructor(e){x(this,"g",e);x(this,"places");x(this,"rebake",new Map);this.places=[py(),my(),gy(),xy(),by(),vy(),_y(),yy(),My(),wy(),Sy()];let t=window;t.__awDoor=(n,i)=>this.open(n,i)}open(e,t){let n=this.places;for(let i=0;i<n.length;i++){let s=n[i];if(tf(s.world,s.obs,e,t,s.doorHalf,s.wall))return!0}return!1}stats(){return this.places.map(e=>({id:e.id,built:!!e.group,visible:!!e.group?.visible,patched:e.patched,door:e.doorOn.value,y:+e.floorY.toFixed(2)}))}update(){if(this.rebake.size)for(let[i,s]of this.rebake)i.needsUpdate=!0,s<=1?this.rebake.delete(i):this.rebake.set(i,s-1);let e=this.g.S,t=e.mode==="walk"?e.walk:e.mode==="plane"?e.plane:e.car,n=this.places;for(let i=0;i<n.length;i++){let s=n[i],r=Math.hypot(t.x-s.x,t.z-s.z);if(!s.group)r<s.show+20&&this.ensure(s);else{let a=s.group.visible?r<s.hide:r<s.show;s.group.visible!==a&&(s.group.visible=a);let o=a?1:0;s.doorOn.value!==o&&(s.doorOn.value=o),!s.patched&&r<s.show+40&&this.patchHero(s),this.settleFloor(s)}}}settleFloor(e){if(!e.group)return;let t=e.floorAt?.x??e.x,n=e.floorAt?.z??e.z,i=this.g.real.heightAt?.(t,n);!Number.isFinite(i)||Math.abs(i-e.floorY)<.35||(e.group.position.y=i,e.group.updateMatrixWorld(!0),e.floorY=i,e.uY.value=i)}ensure(e){let t=e.floorAt?.x??e.x,n=e.floorAt?.z??e.z,i=this.g.real.heightAt?.(t,n);if(!Number.isFinite(i))return;let s=new _e;s.name="aw:interior:"+e.id,s.position.set(e.x,i,e.z),s.rotation.y=e.rot,e.build(s,e.local),s.traverse(r=>{let a=r;a.isMesh&&(a.castShadow=!1,a.receiveShadow=!1,a.matrixAutoUpdate=!1,a.updateMatrix())}),s.updateMatrixWorld(!0),this.g.scene.add(s),e.group=s,e.floorY=i,e.uY.value=i,e.group.visible=!0,e.doorOn.value=1,this.patchHero(e)}patchHero(e){let n=this.g.real.hero?.list?.find(d=>d.k===e.id||d.id===e.id);if(!n?._g)return;let i=e.doorOn,s=e.uU,r=e.uN,a=e.uM,o=e.uY,c={value:e.doorHalf},u={value:e.doorTop},h={value:e.doorSide};n._g.traverse(d=>{let f=d;if(!f.isMesh||!f.material)return;let p=Array.isArray(f.material)?f.material:[f.material];for(let m of p)this.patchMat(m,e.cut,i,s,r,a,o,c,u,h)}),e.patched=!0}patchMat(e,t,n,i,s,r,a,o,c,u){let h=e.name||"";t.indexOf(h)<0||(this.rebake.set(e,4),e.needsUpdate=!0,dn(e,"door-"+h,d=>{d.vertexShader.includes("#include <begin_vertex>")&&d.fragmentShader.includes("#include <clipping_planes_fragment>")&&(d.uniforms.awDoorOn=n,d.uniforms.awDoorU=i,d.uniforms.awDoorN=s,d.uniforms.awDoorM=r,d.uniforms.awDoorY=a,d.uniforms.awDoorHalf=o,d.uniforms.awDoorTop=c,d.uniforms.awDoorSide=u,d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
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
`+Ay))}))}};var Up=H.get("addons")!=="0"&&H.get("gvmoto")!=="0"&&H.get("gv")!=="0";window.__awMotoEnabled=Up;async function Ty(){if(H.get("addons")==="0")return;H.get("hud")!=="0"&&Kd();let l=await Fu(),e=H.get("perf")!=="0"?new Ca(l):null,t=H.get("look")!=="0"?new Ia(l):null,n=H.get("sea")!=="0"?new no(l):null,i=matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,s=H.get("flora")!=="0"?new Pa(l,e?e.mobile:i,H.get("ipool")!=="0"):null,r=H.get("jobs")!=="0"?new La(l,(e?e.mobile:i)?5:8):null,a=new Na(l,e?e.mobile:i),o=H.get("far")!=="0"?new Da(l,l.real.q.name!=="low",H.get("farbatch")!=="0"):null,c=H.get("split")!=="0"?new za((e?e.mobile:i)?3:4):null,u=H.get("hiperf")!=="0"?new Ga(l):null,h=H.get("hilook")==="1"?new Ha(l):null,d=H.get("life")!=="0",f=d&&H.get("peds")!=="0"?new wa(l):null,p=!f&&H.get("kids")!=="0"?new ka(l,e?e.mobile:i):null,m=H.get("debug")==="1"?new Oa(l):null,g=new tr,b=H.get("daynight")!=="0",v=b?new oa(l,H.get("sun")!=="0"):null,y=b?new la(l):null,_=b?new _a(l):null,S=d&&H.get("traffic")!=="0"?new Ma(l):null,E=H.get("audio")!=="0"?new Ea(l):null,C=H.get("radio")!=="0"&&H.get("audio")!=="0"?new to(l):null,A=H.get("emerg")!=="0"?new qa(l):null,R=H.get("crash")!=="0"?new Ya(l,A):null,P=Up?new Za(l):null,I=H.get("fly")!=="0"?new ja(l):null,D=H.get("turbo")!=="0"?new Ka(l):null,N=H.get("wind")!=="0"?new $a(l):null,O=H.get("camcycle")!=="0"?new eo:null,U=H.get("minimap")!=="0"?new io(l):null,V=H.get("interiors")!=="0"?new Po(l):null;{let ge=()=>{let j=document.querySelector("#credits ul");if(!j)return!1;if(!j.querySelector(".aw-msb")){let Me=document.createElement("li");Me.className="aw-msb",Me.innerHTML='Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)',j.appendChild(Me)}if(!j.querySelector(".aw-mly")){let Me=document.createElement("li");Me.className="aw-mly",Me.innerHTML='Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>',j.appendChild(Me)}return!0};if(!ge()){let j=0,Me=setInterval(()=>{(ge()||++j>30)&&clearInterval(Me)},1e3)}}let Z=new ua(l),Y=H.get("mperf")!=="0"?new da(l,e?e.mobile:i,H.get("warmup")!=="full",H.get("preup")==="1"):null,ee=H.get("ovmerge")!=="0"&&l.real?new xa(l.real):null,$=H.get("tmerge")!=="0"&&l.real?new ba(l.real):null,ne=H.get("bbatch")!=="0"&&H.get("bmerge")!=="0"?new ga(l,(e?e.mobile:i)?2:3,+(H.get("bbshell")||1/0)):null,fe=!ne&&H.get("bmerge")!=="0"?new ma(l):null,ye=H.get("preload")!=="0"?new ha(l):null,de=H.get("mwfreeze")!=="0"?new pa(l):null,Fe=wd(g,Z);window.__aw={clock:g,dn:v,lights:y,lamps:_,traffic:S,peds:f,audio:E,guard:Z,perf:e,look:t,flora:s,jobs:r,far:o,ctxg:a,kids:p,split:c,hip:u,hil:h,emerg:A,crash:R,gv:P,fly:I,turbo:D,bmerge:fe,mperf:Y,ovm:ee,tmerge:$,sea:n,minimap:U,bbatch:ne,mwf:de,interiors:V,version:"0.23.0"};let he=performance.now(),Ie=ge=>{let j=Math.max(0,Math.min(2,(ge-he)/1e3));he=ge,jn.value+=j,g.step(Math.min(j,.1)),v&&v.apply(g.t),y&&y.update(j),_&&_.update(j),S&&S.update(j),f&&f.update(Math.min(j,.1),jn.value),E&&E.update(),C&&C.update(),A&&A.update(Math.min(j,.1)),R&&R.update(Math.min(j,.1)),P&&P.update(Math.min(j,.1)),I&&I.update(Math.min(j,.1)),D&&D.update(Math.min(j,.1)),N&&N.update(Math.min(j,.1)),O&&O.frame(l.S.mode,Math.min(j,.1)),e&&e.update(j),t&&t.update(Ne.value),r&&r.frame(),u&&u.frame(),o&&o.update(j),p&&p.update(Math.min(j,.1)),m&&m.frame(j*1e3),Z.frame(j),ye&&ye.frame(j),Y&&Y.frame(j),fe&&fe.frame(),ne&&ne.frame(),de&&de.frame(Math.min(j,.1)),V&&V.update(),Fe(),requestAnimationFrame(Ie)};requestAnimationFrame(Ie),console.info("[aw-addons] day/night + night lights + fps guard active",l.real?.q?.name)}Ty().catch(l=>console.error("[aw-addons] failed",l));
