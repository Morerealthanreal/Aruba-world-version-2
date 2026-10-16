/* Aruba World intro music on the loading screen (r276; r277 track choice; r284 5 new songs).
   Plain script loaded early from <head> (injected by tools/patch_intro.py via landmarks/install.sh).
   - TRACKS: Settings choice Track 1-5/Off (default Track 1); files are streamed unchanged (no re-encode).
   - Autoplay first; if the browser blocks it, starts on the first tap/click/key, with a small hint.
   - Fades out over ~1.5 s when #loading is hidden (player enters the game). Never blocks loading.
   - choice stored in localStorage 'aw_intro_track'. Kill switch ?intro=0. */
(function(){
  var TRACKS=['./audio/music/track1.mp3','./audio/music/track2.mp3','./audio/music/track3.mp3','./audio/music/track4.mp3','./audio/music/track5.mp3'];
  var KEY='aw_intro_v2', FADE_MS=1500, VOL=1; /* '1'..'5'|'off', default '1' (v2 songs; old aw_intro_track/aw_intro_mute selections dropped) */
  try{ localStorage.removeItem('aw_intro_track'); localStorage.removeItem('aw_intro_mute'); }catch(e){}
  window.__awTracks=TRACKS;
  var q=new URLSearchParams(location.search);
  function choice(){ try{ var v=localStorage.getItem(KEY); return (v==='off'||/^[1-5]$/.test(v||''))?v:'1'; }catch(e){return '1';} }
  function muted(){ return choice()==='off'; }
  var off=q.get('intro')==='0'||q.get('addons')==='0';
  var a=null, done=false, waiting=false, hint=null, fadeT=null;
  function loadingVisible(){ var L=document.getElementById('loading'); return !L||L.style.display!=='none'; }
  function make(){ if(a) return a; a=new Audio(); a.preload='auto'; a.src=TRACKS[(+choice()||1)-1]; a.volume=VOL; window.__awIntro=a; return a; }
  function removeHint(){ if(hint&&hint.parentNode) hint.parentNode.removeChild(hint); hint=null; }
  function showHint(){ if(hint||done) return; var L=document.getElementById('loading'); if(!L){ document.addEventListener('DOMContentLoaded',showHint,{once:true}); return; }
    hint=document.createElement('div'); hint.id='awIntroHint'; hint.textContent='\uD83D\uDD0A tap to start music';
    hint.style.cssText='margin-top:14px;font-size:13px;opacity:.75;letter-spacing:.04em;pointer-events:none'; L.appendChild(hint); }
  function gesture(){ if(!waiting) return; waiting=false; unbind(); removeHint(); if(done||muted()||!loadingVisible()) return; make().play().catch(function(){}); }
  var EV=['pointerdown','touchstart','keydown','click'];
  function bind(){ EV.forEach(function(e){ window.addEventListener(e,gesture,{capture:true,passive:true}); }); }
  function unbind(){ EV.forEach(function(e){ window.removeEventListener(e,gesture,{capture:true}); }); }
  function start(){ if(off||done||muted()) return; make();
    var p=a.play(); if(p&&p.catch) p.catch(function(){ if(done||muted()) return; waiting=true; bind(); showHint(); }); }
  function fadeOut(){ if(done) return; done=true; waiting=false; unbind(); removeHint(); if(!a||a.paused){ if(a){a.pause();} return; }
    var v0=a.volume, t0=performance.now(); fadeT=setInterval(function(){ var k=(performance.now()-t0)/FADE_MS; if(k>=1){ clearInterval(fadeT); a.pause(); a.volume=v0; a.removeAttribute('src'); a.load(); return; } a.volume=Math.max(0,v0*(1-k)); },40); }
  function watch(){ var L=document.getElementById('loading'); if(!L){ document.addEventListener('DOMContentLoaded',watch,{once:true}); return; }
    if(!loadingVisible()){ fadeOut(); return; }
    new MutationObserver(function(){ if(!loadingVisible()) fadeOut(); }).observe(L,{attributes:true,attributeFilter:['style','class']}); }
  /* Settings: Intro music Track 1 / 2 / 3 / Off */
  function addToggle(){ var S=document.getElementById('settings'); if(!S||document.getElementById('awIntroSel')) return !!S;
    var box=document.createElement('div'); box.id='awIntroSel'; box.innerHTML='<div class="lbl">Intro music</div>';
    var row=document.createElement('div'); row.className='tabs'; var opts=[['1','1'],['2','2'],['3','3'],['4','4'],['5','5'],['off','Off']];
    function paint(){ var c=choice(); Array.prototype.forEach.call(row.children,function(b){ b.classList.toggle('on',b.dataset.v===c); }); }
    opts.forEach(function(o){ var b=document.createElement('button'); b.dataset.v=o[0]; b.textContent=o[1]; b.onclick=function(){ try{localStorage.setItem(KEY,o[0]);}catch(e){} paint(); if(o[0]==='off'&&a&&!a.paused) a.pause(); removeHint(); }; row.appendChild(b); });
    paint(); box.appendChild(row); var anchor=document.getElementById('streset'); if(anchor&&anchor.parentNode===S) S.insertBefore(box,anchor); else S.appendChild(box); return true; }
  var tries=0; (function poll(){ if(addToggle()) return; if(tries++<240) setTimeout(poll,500); })();
  if(!off){ start(); watch(); }
})();
