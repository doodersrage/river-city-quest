"use strict";
/* River City Quest: Page buttons, keyboard, touch and gamepad input, and the main loop. */
const sndBtn=document.getElementById('snd');
function setSound(on){musicOn=on;try{localStorage.setItem('rcq-sound',on?'1':'0');}catch(e){}if(sndBtn){sndBtn.innerHTML='<span class="lg">SOUND </span>'+(on?'ON':'OFF');sndBtn.setAttribute('aria-label',on?'Sound on':'Sound off');sndBtn.setAttribute('aria-pressed',on?'true':'false');}
  if(typeof musicVolume=='function')musicVolume(on);}
try{musicOn=localStorage.getItem('rcq-sound')!=='0';}catch(e){}
if(sndBtn){sndBtn.addEventListener('click',()=>{wake();setSound(!musicOn);});setSound(musicOn);}
addEventListener('keydown',e=>{if((e.key=='n'||e.key=='N')&&!capture&&!actionOf(e.key))setSound(!musicOn);});
/* full screen (offered on phones held sideways) */
{const fb=document.getElementById('fs');const de=document.documentElement;
  if(fb&&de&&(de.requestFullscreen||de.webkitRequestFullscreen)){fb.hidden=false;fb.addEventListener('click',()=>{try{if(document.fullscreenElement||document.webkitFullscreenElement)(document.exitFullscreen||document.webkitExitFullscreen).call(document);else(de.requestFullscreen||de.webkitRequestFullscreen).call(de);}catch(e){}});}}
/* install to home screen */
let installEvt=null;const instBtn=document.getElementById('install');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(instBtn)instBtn.hidden=false;});
if(instBtn)instBtn.addEventListener('click',async()=>{if(!installEvt)return;installEvt.prompt();try{await installEvt.userChoice;}catch(e){}installEvt=null;instBtn.hidden=true;});
if('serviceWorker' in navigator&&location.protocol=='https:'&&location.hostname.endsWith('github.io'))navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ---------- input ---------- */
addEventListener('keydown',e=>{wake();
  if(capture){e.preventDefault();if(e.key!='Escape'&&!FIXED[e.key]){CUST[capture]=normKey(e.key);for(const a of ACTS)if(a!=capture&&CUST[a]===CUST[capture])delete CUST[a];try{localStorage.setItem('rcq-keys',JSON.stringify(CUST));}catch(_){}sfx(1100,.06);}capture=null;return;}
  const k=actionOf(e.key);if(!k)return;e.preventDefault();
  if(k=='menu'){if(!e.repeat)press.menu=1;return;}
  keys[k]=1;if((k=='a'||k=='b')&&!e.repeat)press[k]=1;});
addEventListener('keyup',e=>{const k=actionOf(e.key);if(k&&k!='menu')keys[k]=0;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0;});
const pad=document.getElementById('pad'),knob=document.getElementById('knob');
function padMove(e){
  const r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=Math.hypot(dx,dy);
  keys.up=keys.down=keys.left=keys.right=0;
  if(m>r.width*.1){const ax=dx/m,ay=dy/m;if(ax>.38)keys.right=1;if(ax<-.38)keys.left=1;if(ay>.38)keys.down=1;if(ay<-.38)keys.up=1;}
  const c=Math.min(m,r.width*.3)/(m||1);knob.style.transform='translate('+dx*c+'px,'+dy*c+'px)';
}
function padEnd(){keys.up=keys.down=keys.left=keys.right=0;knob.style.transform='';}
pad.addEventListener('pointerdown',e=>{wake();try{pad.setPointerCapture(e.pointerId);}catch(_){ }padMove(e);e.preventDefault();});
pad.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType=='touch')padMove(e);});
pad.addEventListener('pointerup',padEnd);pad.addEventListener('pointercancel',padEnd);
function bindBtn(el,k){
  el.addEventListener('pointerdown',e=>{wake();press[k]=1;keys[k]=1;el.classList.add('on');try{el.setPointerCapture(e.pointerId);}catch(_){ }e.preventDefault();});
  const up=()=>{keys[k]=0;el.classList.remove('on');};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
}
bindBtn(document.getElementById('act'),'a');bindBtn(document.getElementById('bbtn'),'b');
document.getElementById('menu').addEventListener('pointerdown',e=>{wake();press.menu=1;e.preventDefault();});
cv.addEventListener('pointerdown',e=>{wake();if(mode!='play'||dlg||menu)press.a=1;e.preventDefault();});
addEventListener('contextmenu',e=>e.preventDefault());

applyBtnSize();
document.addEventListener('visibilitychange',()=>{if(document.hidden){paused=true;try{if(st&&mode=='play')save();if(ac)ac.suspend();}catch(e){}}else{paused=false;last=performance.now();try{if(ac&&musicOn)ac.resume();}catch(e){}}});
/* ---------- loop ---------- */
titleInit();
let last=0,acc=0,paused=false;
function loop(t){
  if(!paused){acc+=Math.min(100,t-last);while(acc>=16.6){update();acc-=16.6;}draw();if(mode=='play'&&!trans)pump(4);}
  last=t;requestAnimationFrame(loop);
}
if(document.fonts&&document.fonts.load)document.fonts.load('8px "Press Start 2P"').catch(()=>{});
requestAnimationFrame(t=>{last=t;loop(t);});
window.__g={busTo,quests,SECRETS,nSecrets,startMini,get mini(){return mini},setDate(d){fakeDate=d},season,events,startRelight,get relight(){return relight},goalScene,arrivalFor,hitEnemyT:(e,d,s)=>hitEnemy(e,d,s,0,0),get keysMap(){return null},get dyn(){return cur.dyn},startNew,encodeSave,decodeSave,get nm(){return nm},get intro(){return intro},get credits(){return credits},goal,ACH,checkAch,RUSH,startRush,newGamePlus,folkContext,BOSSINTRO,get saveData(){return saveData},set saveData(v){saveData=v},SC,LORE,CHAL,update,draw,keys,press,load,mk,say,give,newGame,refresh,explode,irisStart,kill,updCam,pump,CVC,get jobs(){return jobs},CARDS,FISH,actionOf,titleOpts,hour,dark,fmtTime,get hook(){return hook},get fish(){return fish},set fish(v){fish=v},get tl(){return tl},get titleSel(){return titleSel},set titleSel(v){titleSel=v},get slot(){return saveSlot},OPT,
  get p(){return p},get st(){return st},get mode(){return mode},set mode(v){mode=v},get enemies(){return enemies},get dlg(){return dlg},set dlg(v){dlg=v},
  get cur(){return cur},get cam(){return cam},get blocks(){return blocks},get trans(){return trans},get menu(){return menu},set menu(v){menu=v},get shop(){return shop},set shop(v){shop=v},get picks(){return picks},get bug(){return bug},pause(v){paused=v},SOLID};
