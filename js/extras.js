"use strict";
/* River City Quest: the city relighting at the end, bus travel, the quest log, hidden secrets,
   seasons and events by the real calendar, and extra sound effects. */

/* ---------- the lamps come back on ---------- */
let relight=null;
const RELIGHT=[['ow:3,0','Church Hill'],['ow:2,1','Capitol Square'],['ow:1,0','Broad Street'],['ow:1,1','The Fan'],['ow:0,1','Carytown']];
function startRelight(){relight={i:-1,t:0};mode='relight';nextRelight();}
function nextRelight(){relight.i++;relight.t=0;if(relight.i>=RELIGHT.length){relight=null;load(st.ret?st.ret[0]:'ow:3,0');mode='win';winT=0;checkAch();return;}
  load(RELIGHT[relight.i][0]);enemies=[];bannerT=0;const L=cur.lamps||[];let cx=cur.w*8,cy=cur.h*8;if(L.length){cx=L.reduce((a,l)=>a+l[0],0)/L.length*TS+8;cy=L.reduce((a,l)=>a+l[1],0)/L.length*TS+8;}
  p.x=-999;p.y=-999;cam.x=clamp(Math.round(cx-W/2),0,Math.max(0,MW()-W));cam.y=clamp(Math.round(cy-PH/2),0,Math.max(0,MH()-PH));}
function relightUpdate(){const r=relight;r.t++;const n=Math.floor(r.t/14);if(r.t%14==0&&n<=(cur.lamps||[]).length+4)sfx(880+n*60,.08,'triangle',.03);if((press.a&&r.t>30)||r.t>200)nextRelight();}
function relightLit(idx){return relight&&idx<Math.floor(relight.t/14);}
function drawRelight(){g.save();g.beginPath();g.rect(0,HUD,W,PH);g.clip();g.translate(0,HUD);g.save();g.translate(-cam.x,-cam.y);drawWorld();g.restore();drawNight();g.restore();
  R(0,0,W,HUD,'#080a18');text('THE LAMPS COME BACK ON',W/2,8,'#f2c14e',8,'center');
  R(0,FH-22,W,22,'rgba(8,10,24,.85)');text(RELIGHT[relight.i][1],W/2,FH-16,'#fff2a8',8,'center','#080c28');}

/* ---------- bus travel and the goal marker ---------- */
function arrivalFor(id){const s=SC[id];applyDyn(s);const cx=s.w>>1,cy=s.h>>1;let best=null;
  for(let y=2;y<s.h-2;y++)for(let x=2;x<s.w-2;x++){const t=s.g[y][x];if(SOLID.includes(t)||'DE~'.includes(t))continue;
    if([[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>!SOLID.includes(s.g[y+b][x+a])).length<3)continue;const d=Math.abs(x-cx)+Math.abs(y-cy);if(!best||d<best[0])best=[d,x,y];}
  return best?[best[1]*TS+8,best[2]*TS+8]:[s.w*8,s.h*8];}
function busTo(id){if(!cur.ow||st.rush){toast(st.rush?'No buses during the boss rush.':'Head back outside to catch a bus.');sfx(150,.08);return false;}
  if(id==curId||!st.vis[id])return false;const [px,py]=arrivalFor(id);menu=null;trans={fade:true,t:0,to:id,px,py};
  tune([[392,.08],[523,.08],[659,.16]],'square');toast('You ride the GRTC bus to '+SC[id].name+'.');return true;}
function goalScene(){
  if(!st.items.lantern)return'ow:2,1';if(!st.got.granite)return'ow:2,2';if(!st.got.iron)return'ow:1,2';if(!st.got.brick)return'ow:3,1';
  if(!st.got.bronze){if(st.got.carkey)return'ow:0,2';if(st.items.kayak)return'ow:1,3';return st.trade=='melon'?'ow:1,1':st.trade=='music'?'ow:0,1':st.trade=='rivermap'?'ow:2,2':'ow:0,1';}
  if(!st.f.won)return'ow:3,0';if(!st.f['boss:tredegar:0,0'])return'ow:1,2';if(!st.f['boss:conserv:0,0'])return'ow:1,-1';if(!st.f.bateau)return'ow:3,3';if(!st.f.frogsDone)return'ow:0,2';return null;}

/* ---------- quest log ---------- */
function quests(){const parts=['oar','pole','tiller'].filter(q=>st.got[q]).length,nsec=Object.keys(SECRETS).filter(id=>st.got['sec:'+id]).length;
  return[
  ['Find the four keystones',nKeys()+'/4',nKeys()>=4],
  ['Unseal the Church Hill Tunnel','',!!st.f.won],
  ['Trade your way to a kayak',st.trade?TRADE[st.trade][0]:'',!!st.items.kayak],
  ['Find the Carillon key','',!!st.got.carkey],
  ['Return a lost race bib','',!!st.items.shoes],
  ['Tredegar Iron Works','',!!st.f['boss:tredegar:0,0']],
  ['The Conservatory','',!!st.f['boss:conserv:0,0']],
  ['Rebuild the bateau',parts+'/3',!!st.f.bateau],
  ['Count frogs in the rain',Math.min(st.frogs,5)+'/5',!!st.f.frogsDone],
  ['Win neighborhood pins',Object.keys(st.pins).length+'/'+NCHAL,Object.keys(st.pins).length>=NCHAL],
  ['Find heart pieces',st.pieces+'/8',st.pieces>=8],
  ['Find hidden secrets',nsec+'/'+Object.keys(SECRETS).length,nsec>=Object.keys(SECRETS).length],
  ['Collect landmark cards',nCards()+'/'+CARDS.length,nCards()>=CARDS.length],
  ['Mini-game medals',['slugger','wizard','derby'].filter(k=>miniMedal(k)).length+'/3',['slugger','wizard','derby'].every(k=>miniMedal(k))]];}
function miniMedal(k){return k=='slugger'?!!st.f.slugger:k=='wizard'?(st.mini&&st.mini.pin||0)>=8000:!!st.f.derbyGold;}

/* ---------- hidden secrets: one stash per neighborhood ---------- */
const SECRETS={};
(function placeSecrets(){for(const id in SC){const s=SC[id];if(!s.ow)continue;const m=s.g0.map(r=>r.map(c=>c=='#'?s.base:c)),ok=(x,y)=>m[y]&&m[y][x]&&!SOLID.includes(m[y][x])&&!'DE~'.includes(m[y][x]);
  const seen=new Set(),q=[];for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++)if((y==0||x==0||y==s.h-1||x==s.w-1)&&ok(x,y)){seen.add(x+','+y);q.push([x,y]);}
  for(const d of s.doors||[])if(ok(d.ret[0],d.ret[1])){seen.add(d.ret+'');q.push(d.ret.slice());}
  while(q.length){const [x,y]=q.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(!seen.has(k)&&ok(x+a,y+b)){seen.add(k);q.push([x+a,y+b]);}}}
  const busy=new Set((s.npcs||[]).map(n=>n.tx+','+n.ty).concat((s.items||[]).map(i=>i.tx+','+i.ty),(s.spots||[]).map(q=>q.join())));
  const cands=[...seen].map(k=>k.split(',').map(Number)).filter(([x,y])=>!busy.has(x+','+y)&&x>1&&y>1&&x<s.w-2&&y<s.h-2&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>'Tbr'.includes(m[y+b][x+a])));
  if(cands.length)SECRETS[id]=cands[HH(s.seed,7,cands.length)%cands.length];}})();
function nSecrets(){return Object.keys(SECRETS).filter(id=>st.got['sec:'+id]).length;}

/* ---------- seasons and events by the real calendar ---------- */
let fakeDate=null;
function today(){return fakeDate||new Date();}
function season(){const m=today().getMonth();return m==11||m<2?'winter':m<5?'spring':m<8?'summer':'fall';}
function events(){const d=today(),m=d.getMonth(),day=d.getDate(),e=[];
  if(m==11)e.push('lights');
  if((m==2&&day>=15)||(m==3&&day<=15))e.push('10k');
  if(m==9&&day<=20)e.push('folk');
  return e;}
function pickWeather(){const w={winter:[.4,.2,.15,.25],spring:[.5,.35,.15,0],summer:[.6,.3,.1,0],fall:[.5,.25,.2,.05]}[season()],r=Math.random();
  return r<w[0]?'clear':r<w[0]+w[1]?'rain':r<w[0]+w[1]+w[2]?'fog':'snow';}
function leafColors(){const s=season();return s=='spring'?['#f8b8d0','#ffffff','#f090b0','#f8d0e0']:s=='fall'?['#e07a28','#d8a838','#b84a20','#e8c050']:null;}
let runners=[];
function seasonOnLoad(){const ev=events();runners=[];
  if(ev.includes('10k')&&curId=='ow:1,1'){for(let i=0;i<7;i++){const f=FOLKC[i%FOLKC.length];runners.push({x:-20-i*40,y:9*TS+8+(i%3)*10,v:.9+Math.random()*.5,spr:npcSpr({who:'Runner'+i,hx:i,hy:i,hat:f[0],shirt:f[1]})});}
    if(!st.f['ev10k'+today().getFullYear()]){st.f['ev10k'+today().getFullYear()]=1;toast('It\'s Monument Avenue 10K season! Runners everywhere.');}}
  if(ev.includes('folk')&&(curId=='ow:2,2'||curId=='ow:1,2'))toast('Music drifts over from the Folk Festival on Brown\'s Island.');
  if(ev.includes('lights')&&(curId=='ow:1,1'||curId=='ow:0,1')&&!st.f['evlights'+today().getFullYear()]){st.f['evlights'+today().getFullYear()]=1;toast('Holiday lights are up! They look best after dark.');}}
function drawSeasonWorld(){
  const ev=events(),s=season(),x0=Math.max(0,Math.floor(cam.x/TS)),y0=Math.max(0,Math.floor(cam.y/TS)),x1=Math.min(cur.w-1,x0+17),y1=Math.min(cur.h-1,y0+12);
  if(s=='spring'&&curId=='ow:0,-1')for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const ch=cur.g[ty][tx],h=HH(tx,ty,99),x=tx*TS,y=ty*TS;
    if(ch==','||(ch=='T'&&h%2)){for(let i=0;i<(ch==','?5:3);i++){const q=HH(h,i,5);R(x+2+q%12,y+2+(q>>4)%11,2,2,i%3?'#f070a8':'#ffffff');}}}
  for(const r of runners){r.x+=r.v;if(r.x>MW()+20)r.x=-20;const f=(frame>>3)&1;g.drawImage(r.spr.side.r.c,Math.round(r.x)-8,Math.round(r.y)-12-f);}
  if(ev.includes('folk')&&(curId=='ow:2,2'||curId=='ow:1,2')&&frame%40==0)parts.push({x:cam.x+20+Math.random()*(W-40),y:cam.y+20,vx:(Math.random()-.5)*.3,vy:.25,life:90,max:90,c:['#f8e060','#ffffff','#f890a0'][rnd(3)],s:2});
}
function drawLights(){if(!events().includes('lights')||!(curId=='ow:1,1'||curId=='ow:0,1')||dark()<.3)return[];const out=[];
  const x0=Math.max(0,Math.floor(cam.x/TS)),y0=Math.max(0,Math.floor(cam.y/TS)),x1=Math.min(cur.w-1,x0+17),y1=Math.min(cur.h-1,y0+12),C=['#e83048','#3ac2e8','#f8e060','#58c868'];
  g.save();g.translate(-cam.x,-cam.y);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){if(cur.g[ty][tx]!='B'||(cur.g[ty+1]&&cur.g[ty+1][tx]=='B'))continue;for(let i=0;i<4;i++){const x=tx*TS+2+i*4,y=ty*TS+1+(i&1),c=C[(i+tx+(frame>>5))%4];R(x,y,2,2,c);if(i%2==0)out.push([x+1,y+1]);}}
  g.restore();return out;}

/* ---------- more sound ---------- */
const VOICE={rat:()=>{sfx(1800,.04,'square',.02);sfx(2200,.03,'square',.015);},goose:()=>{sfx(330,.12,'sawtooth',.04);sfx(290,.1,'sawtooth',.03);},
  squirrel:()=>{for(let i=0;i<3;i++)sfx(1400+i*200,.02,'square',.015);},ghost:()=>sfx(520,.3,'triangle',.03),bat:()=>sfx(2600,.03,'square',.015),
  crab:()=>{sfx(1200,.02,'square',.02);sfx(900,.02,'square',.02);},scooter:()=>sfx(180,.12,'sawtooth',.03)};
function voiceOf(t){if(VOICE[t])VOICE[t]();}
let stepN=0;
function footstep(){const t=tileAt(p.x,p.y+4),k=++stepN&1;
  if(t=='='||t=='-')sfx(k?180:160,.03,'square',.012);else if(t=='p'||t=='|')sfx(k?900:820,.015,'square',.008);else if(t=='s'||t=='F'||t=='E')sfx(k?600:540,.015,'triangle',.01);
  else if(t=='n')sfx(k?300:260,.03,'triangle',.008);else if(t=='~')sfx(200,.05,'sine',.012);else sfx(k?420:380,.02,'triangle',.006);}
const BIGITEMS=new Set(['lantern','powder','bug','shoes','hook','can','kayak','rod','shield']);
const FANFARE=[[523,.08],[659,.08],[784,.08],[1047,.12],[988,.08],[1047,.24]];
