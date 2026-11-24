"use strict";
/* River City Quest: Cards, time of day, weather, frogs, the grappling hook, fishing, options, story beats, awards, New Game+, boss rush, the opening, sharing. */
/* ---------- landmark cards ---------- */
const CARDS=[
  {id:'capitol',name:'Virginia State Capitol',short:'CAPITOL',col:'#8a8678',src:'a card pack at the shop',fact:'Thomas Jefferson designed it after a Roman temple in France. The General Assembly first met in it in 1788.'},
  {id:'stjohn',name:"St. John's Church",short:"ST JOHN'S",col:'#7a6a5a',src:'a card pack at the shop',fact:'In 1775 Patrick Henry stood up in this church and said, "Give me liberty, or give me death!"'},
  {id:'mainst',name:'Main Street Station',short:'STATION',col:'#9a4a34',src:'a card pack at the shop',fact:'Opened in 1901. Its clock tower can be seen all over Shockoe Bottom.'},
  {id:'byrd',name:'The Byrd Theatre',short:'BYRD',col:'#7a1c2c',src:'a card pack at the shop',fact:'A Carytown movie palace since 1928. Its Mighty Wurlitzer organ still rises from below the stage.'},
  {id:'vmfa',name:'Virginia Museum of Fine Arts',short:'VMFA',col:'#3a3a4e',src:'a card pack at the shop',fact:'Home to five Faberge imperial Easter eggs, and general admission is free.'},
  {id:'belleisle',name:'Belle Isle',short:'BELLE ISLE',col:'#4a5a6a',src:'beat the Belle Isle Quarry boss',fact:'An island in the James with old granite quarries, a power plant ruin and rapids all around.'},
  {id:'hollywood',name:'Hollywood Cemetery',short:'HOLLYWOOD',col:'#3a5a3a',src:'beat the Pyramid boss',fact:'Opened in 1849 on the bluffs over the James. Presidents James Monroe and John Tyler rest here.'},
  {id:'poe',name:'The Poe Museum',short:'POE',col:'#5a3a24',src:'beat the boss of the Poe cellar',fact:'Poe grew up in Richmond. The museum\'s Old Stone House is the oldest house in the city.'},
  {id:'carillon',name:'The Carillon',short:'CARILLON',col:'#8a5a3a',src:'beat the Carillon boss',fact:'Virginia\'s World War I memorial, a tall bell tower in Byrd Park dedicated in 1932.'},
  {id:'tredegar',name:'Tredegar Iron Works',short:'TREDEGAR',col:'#6a3a2a',src:'beat the Tredegar boss',fact:'Founded in 1837 beside the James. Its foundries cast cannon, rails and locomotives.'},
  {id:'maymont',name:'Maymont',short:'MAYMONT',col:'#4a6a3a',src:'help the naturalist in Byrd Park',fact:'The Dooley family estate, finished in 1893. Today it has gardens, a nature center and real black bears.'},
  {id:'sturgeon',name:'Atlantic Sturgeon',short:'STURGEON',col:'#3a5a7a',src:'catch one in the James',fact:'An ancient, armored fish that swims up the James to spawn. They can grow longer than ten feet.'}];
const CARDM={};CARDS.forEach(c=>CARDM[c.id]=c);CARDM.sturgeon.ic=IC.fish;
const PACK=['capitol','stjohn','mainst','byrd','vmfa'],BOSSCARD={turtle:'belleisle',wraith:'hollywood',raven:'poe',bell:'carillon',foreman:'tredegar'};
const nCards=()=>CARDS.filter(c=>st.cards[c.id]).length;
function awardCard(id,quiet){if(!st.cards||st.cards[id])return false;st.cards[id]=1;needSave=true;if(!quiet)toast('New landmark card: '+CARDM[id].name+'!');return true;}
const fmtTime=f=>{const t=Math.floor(f/6),ds=t%10,sec=Math.floor(t/10),h=Math.floor(sec/3600),m=Math.floor(sec/60)%60,ss=sec%60;return(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(ss).padStart(2,'0')+'.'+ds;};

/* ---------- time of day ---------- */
const CYC=36000;
const hour=()=>(6+(st?st.clock:4500)/CYC*24)%24;
function dark(){if(typeof relight!='undefined'&&relight)return 1;const h=hour();return h>=20||h<5?1:h>=17?(h-17)/3:h<7?(7-h)/2:0;}
function dusk(){const h=hour();return Math.max(0,1-Math.abs(h-18.5)/1.5)+.6*Math.max(0,1-Math.abs(h-6))/1;}
function drawClock(x,y){
  const nt=dark()>.5;R(x,y,13,10,'#080a18');R(x+1,y+1,11,8,nt?'#141a44':'#3a6ab0');
  if(nt){R(x+4,y+2,5,6,'#e8ecf8');R(x+3,y+3,7,4,'#e8ecf8');R(x+6,y+2,4,4,'#141a44');R(x+2,y+2,1,1,'#ffffff');R(x+10,y+7,1,1,'#ffffff');}
  else{R(x+4,y+3,5,4,'#f2c14e');R(x+5,y+2,3,6,'#f2c14e');R(x+5,y+3,2,2,'#fff2a8');if(dusk()>.3)R(x+1,y+7,11,2,'#e07a48');}
  const w=st.wx,k=st.wxk;if(w=='clear'||k<.3)return;
  R(x,y+11,13,8,'#080a18');R(x+1,y+12,11,6,'#26306a');
  if(w=='rain')for(const a of[2,6,9])R(x+a,y+13+(a&1),1,3,'#7ab0f0');
  else if(w=='snow')for(const [a,b] of[[2,13],[6,15],[9,13],[4,16]])R(x+a,y+b-11+11,1,1,'#ffffff');
  else{R(x+2,y+13,9,1,'#aeb7c2');R(x+3,y+15,8,1,'#aeb7c2');}
}

/* ---------- weather ---------- */
function wxTick(){
  if(st.wxNext){st.wxk=Math.max(0,st.wxk-1/240);if(st.wxk<=0){st.wx=st.wxNext;st.wxNext=null;}}
  else{if(st.wx!='clear')st.wxk=Math.min(1,st.wxk+1/300);
    if(--st.wxT<=0){st.wxT=3000+rnd(4200);const n=pickWeather();if(n!=st.wx)st.wxNext=n;}}
  if(st.wx=='snow'&&st.wxk>.5)st.snow=Math.min(1,st.snow+1/1800);else st.snow=Math.max(0,st.snow-1/2400);
}
let drops=[],splash=[],flakes=[],flies=[];
function drawSky(){
  const w=st.wx,k=w=='clear'?0:st.wxk;
  if(!(w=='rain'&&k>.4))drawClouds();
  drawLeaves();
  drawFog(.1+.09*Math.max(0,1-(Math.abs(st.ow[0]-3)+st.ow[1])/4)+(w=='fog'?.32*k:0));
  if(w=='fog'&&k>0){g.globalAlpha=.2*k;R(0,0,W,PH,'#c8d0dc');g.globalAlpha=1;}
  if(w=='rain'&&k>0){g.globalAlpha=.2*k;R(0,0,W,PH,'#1c2440');g.globalAlpha=1;}
  if(w=='snow'&&k>0){g.globalAlpha=.1*k;R(0,0,W,PH,'#e8eeff');g.globalAlpha=1;}
  const ds=dusk();if(ds>0){g.globalAlpha=.14*Math.min(1,ds);R(0,0,W,PH,'#ff7a3a');g.globalAlpha=1;}
  drawNight();
  drawFlies();
  if(w=='rain')drawRain(k);else drops.length=0;
  if(w=='snow')drawSnow(k);else flakes.length=0;
  g.drawImage(gradeC,0,0);
}
function drawRain(k){
  const n=Math.round(80*k);while(drops.length<n)drops.push({x:Math.random()*(W+60),y:Math.random()*PH,v:5+Math.random()*2});if(drops.length>n)drops.length=n;
  g.globalAlpha=.65;for(const d of drops){d.x-=1.3;d.y+=d.v;if(d.y>PH){if(Math.random()<.5)splash.push({x:d.x,y:20+Math.random()*(PH-24),t:8});d.y=-6;d.x=Math.random()*(W+60);}
    const x=Math.round(d.x),y=Math.round(d.y);R(x,y,1,2,'#a8c8f0');R(x-1,y+2,1,2,'#a8c8f0');}
  g.globalAlpha=1;
  for(const q of splash){q.t--;const r=4-(q.t>>1);g.globalAlpha=q.t/8*.8;R(Math.round(q.x)-r,Math.round(q.y),r*2+1,1,'#c8e0ff');R(Math.round(q.x),Math.round(q.y)-2,1,1,'#c8e0ff');}
  g.globalAlpha=1;splash=splash.filter(q=>q.t>0);
}
function drawSnow(k){
  const n=Math.round(70*k);while(flakes.length<n)flakes.push({x:Math.random()*W,y:Math.random()*PH,ph:Math.random()*6,v:.3+Math.random()*.5,s:Math.random()<.3?2:1});if(flakes.length>n)flakes.length=n;
  for(const f of flakes){f.ph+=.03;f.x+=Math.sin(f.ph)*.4-.15;f.y+=f.v;if(f.y>PH){f.y=-2;f.x=Math.random()*W;}if(f.x<-2)f.x=W;R(Math.round(f.x),Math.round(f.y),f.s,f.s,'#ffffff');}
}
function drawWeatherGround(){
  const wet=st.wx=='rain'?st.wxk:0,sn=st.snow;if(wet<.2&&sn<.05)return;
  const x0=Math.max(0,Math.floor(cam.x/TS)),y0=Math.max(0,Math.floor(cam.y/TS)),x1=Math.min(cur.w-1,x0+17),y1=Math.min(cur.h-1,y0+12);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const ch=cur.g[ty][tx],h=HH(tx,ty,cur.seed),x=tx*TS,y=ty*TS;
    if(wet>=.2&&'psn'.includes(ch)&&h%7==0){g.globalAlpha=.45*wet;R(x+3,y+8,10,3,'#2a3c66');R(x+5,y+7,6,5,'#2a3c66');g.globalAlpha=.6*wet;R(x+5,y+8,3,1,'#a8c8f0');
      if(((frame>>2)+h)%16<3){R(x+8,y+9,1,1,'#ffffff');}g.globalAlpha=1;}
    if(sn>=.05){g.globalAlpha=Math.min(1,sn*1.2);
      if(ch=='B'&&ty+1<cur.h&&cur.g[ty+1][tx]=='B'){R(x,y,16,16,'#eef3ff');if(h&1)R(x+(h>>3)%12,y+(h>>6)%12,3,2,'#c8d4ec');}
      else if(ch=='B'){R(x,y,16,2,'#f4f8ff');}
      else if(ch=='T'){R(x+5,y+1,6,2,'#f4f8ff');R(x+3,y+3,4,1,'#f4f8ff');R(x+9,y+4,3,1,'#f4f8ff');}
      else if('.,'.includes(ch)){R(x+(h>>4)%10,y+(h>>8)%11,5,3,'#f4f8ff');if(sn>.5)R(x+(h>>2)%12,y+(h>>9)%12,4,2,'#f4f8ff');}
      g.globalAlpha=1;}}
}
function drawNight(){
  const dk=dark();if(dk<=.02)return;
  const wins=(cur.wins?Object.values(cur.wins):[]).filter((w,i)=>w[2]&&(!relight||relightLit(Math.floor(i/3)))).map(w=>[w[0],w[1],true]);
  if(dk>.2){g.save();g.translate(-cam.x,-cam.y);g.globalAlpha=Math.min(1,dk*1.3);
    for(const [x,y,on] of wins)if(on&&x>cam.x-16&&x<cam.x+W&&y>cam.y-16&&y<cam.y+PH){R(x+4,y+5,8,7,'#f8d868');R(x+7,y+5,2,7,'#d8a838');R(x+4,y+8,8,1,'#d8a838');R(x+4,y+5,3,1,'#fff6c0');}
    g.globalAlpha=1;g.restore();}
  lg.globalCompositeOperation='source-over';lg.clearRect(0,0,W,PH);lg.fillStyle='rgba(10,14,46,'+(.7*dk).toFixed(3)+')';lg.fillRect(0,0,W,PH);
  const bulbs=drawLights();
  lg.globalCompositeOperation='destination-out';
  const hole=holeAt;for(const [x,y] of bulbs)hole(x,y,7);
  hole(p.x,p.y-4,st.items.lantern?54:32);
  for(const [lx,ly] of cur.lamps||[])if(litLamp(lx,ly))hole(lx*TS+8,ly*TS+4,48);
  for(const [x,y,on] of wins)if(on)hole(x+8,y+9,15);
  for(const c of cars)hole(c.x+c.dir*16,c.y,26);
  for(const q of shots)hole(q.x,q.y,12);for(const b of bombs)hole(b.x,b.y-6,10);
  if(bug)hole(bug.x,bug.y,16);if(hook)hole(hook.x,hook.y,12);
  for(const f of flies)hole(f.x+cam.x,f.y+cam.y,7);
  g.drawImage(lightC,0,0);
}
function drawFlies(){
  const on=dark()>.6&&cur.leafy&&st.wx!='rain'&&st.wx!='snow';
  if(!on){flies.length=0;return;}
  while(flies.length<12)flies.push({x:Math.random()*W,y:20+Math.random()*(PH-30),ph:Math.random()*6,b:rnd(90)});
  for(const f of flies){f.ph+=.04;f.x+=Math.cos(f.ph)*.35;f.y+=Math.sin(f.ph*1.3)*.25;f.b=(f.b+1)%90;
    if(f.b<55){g.globalAlpha=.35;R(Math.round(f.x)-1,Math.round(f.y)-1,3,3,'#f8f080');g.globalAlpha=1;R(Math.round(f.x),Math.round(f.y),1,1,'#fffbd0');}}
}

/* ---------- frogs (rainy-day quest) ---------- */
function frogTick(){
  for(const k of picks)if(k.kind=='frog'){if(k.jump>0)k.jump--;if(--k.hop<=0){k.hop=50+rnd(70);const a=rnd(4),nx=k.x+DX[a]*12,ny=k.y+DY[a]*12;if(!blocked(nx,ny,4,true)){k.x=nx;k.y=ny;k.jump=10;}}}
  if(frame%90||!cur.ow||st.wx!='rain'||st.wxk<.5||st.f.frogsDone)return;
  if(picks.filter(k=>k.kind=='frog').length>=3)return;
  for(let i=0;i<40;i++){const tx=1+rnd(cur.w-2),ty=1+rnd(cur.h-2);if(cur.g[ty][tx]!='.')continue;
    if(![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>cur.g[ty+b][tx+a]=='w'))continue;
    const x=tx*TS+8,y=ty*TS+8;if(Math.hypot(x-p.x,y-p.y)<48)continue;
    picks.push({x,y,kind:'frog',life:1500,hop:30+rnd(40),jump:0});break;}
}

/* ---------- grappling hook ---------- */
function updHook(){
  const h=hook;
  if(h.st=='out'){h.d+=5;h.x=p.x+h.dx*h.d;h.y=p.y-4+h.dy*h.d;
    for(const e of enemies){if(e.gone)continue;const r=e.boss?15:9;
      if(Math.abs(e.x-h.x)<r&&Math.abs(e.y-6-h.y)<r+3){hitEnemy(e,e.boss?0:1,'hook',h.dx*2,h.dy*2);if(!e.boss&&enemies.includes(e))e.stun=60;h.st='back';sfx(1500,.04);return;}}
    for(let i=picks.length-1;i>=0;i--){const k=picks[i];if(Math.abs(k.x-h.x)<9&&Math.abs(k.y-h.y-4)<9){h.carry.push(k);picks.splice(i,1);h.st='back';}}
    const t=tileAt(h.x,h.y+4);
    if(t=='+'){const tx=Math.floor(h.x/TS),ty=Math.floor((h.y+4)/TS);h.st='pull';h.x=tx*TS+8;h.y=ty*TS+4;h.tx=(tx-h.dx)*TS+8;h.ty=(ty-h.dy)*TS+8;sfx(1200,.08,'square',.04);burst(h.x,h.y,5,['#ffffff','#f8e060'],1.2,1);return;}
    if(t===null||(SOLID.includes(t)&&!'_w~'.includes(t))||h.d>=104){h.st='back';if(t&&SOLID.includes(t)){sfx(1500,.04,'square',.03);burst(h.x,h.y,3,['#ffffff'],1,1);}}}
  else if(h.st=='back'){h.d-=7;h.x=p.x+h.dx*h.d;h.y=p.y-4+h.dy*h.d;for(const k of h.carry){k.x=h.x;k.y=h.y+4;}if(h.d<=0){hook=null;for(const k of h.carry)collect(k);}}
  else{const dx=h.tx-p.x,dy=h.ty-p.y,l=Math.hypot(dx,dy);p.inv=Math.max(p.inv,2);
    if(l<=4){p.x=h.tx;p.y=h.ty;hook=null;sfx(500,.05);return;}p.x+=dx/l*4;p.y+=dy/l*4;if(frame%3==0)sfx(1800,.02,'square',.01);}
}
function drawHook(){
  const h=hook,ax=p.x,ay=p.y-4,l=Math.hypot(h.x-ax,h.y-ay);
  for(let d=0;d<l;d+=4){const x=Math.round(ax+(h.x-ax)*d/l),y=Math.round(ay+(h.y-ay)*d/l);R(x-1,y-1,3,3,'#1a1423');R(x,y,1,1,'#aeb2c0');}
  const x=Math.round(h.x),y=Math.round(h.y);R(x-3,y-3,7,7,'#1a1423');R(x-2,y-2,5,5,'#d8dce4');R(x-1,y-1,3,3,'#8e909c');
  R(x-3+h.dx*3-(h.dy?2:0),y-3+h.dy*3-(h.dx?2:0),2,2,'#d8dce4');
}

/* ---------- fishing ---------- */
const FISH=[
  {id:'bluegill',name:'bluegill',str:1,coins:3,w:()=>5,txt:'A little sunfish. Every pond in Richmond has them.'},
  {id:'bass',name:'largemouth bass',str:1.6,coins:6,w:()=>4,txt:'A fighter. Bass lurk along weedy edges.'},
  {id:'catfish',name:'blue catfish',str:2,coins:8,w:()=>dark()>.5?6:1,txt:'Blue catfish feed at night, and they get huge in the James.'},
  {id:'shad',name:'American shad',str:1.4,coins:6,w:()=>st.wx=='rain'?5:.3,txt:'Shad run up the James to spawn. Rain gets them moving.'},
  {id:'sturgeon',name:'Atlantic sturgeon',str:2.6,coins:30,w:()=>riverHere()?(dark()>.5?.9:.45)*(st.lure?3:1):0,txt:'An ancient, armored giant. Spotting one in the James is a big deal.'}];
const riverHere=()=>(cur.ow&&((cur.ay==2&&cur.ax>=1)||(cur.ay==3&&cur.ax!=1&&cur.ax!=2)))||cur.area=='boathouse';
function pickFish(){const ws=FISH.map(f=>f.w()),t=ws.reduce((a,b)=>a+b,0);let r=Math.random()*t;for(let i=0;i<FISH.length;i++){r-=ws[i];if(r<=0)return FISH[i];}return FISH[0];}
function fishEnd(m){fish=null;toast(m);sfx(150,.1);}
function fishUpdate(){
  const f=fish;f.t--;
  if(press.b){fish=null;toast('You reel in your line.');return;}
  if(f.ph=='wait'){if(press.a){fishEnd('Too early! Nothing on the hook.');return;}if(f.t<=0){f.ph='bite';f.t=28;buzz(60);sfx(1300,.06);sfx(1700,.08);}}
  else if(f.ph=='bite'){if(press.a){f.ph='reel';f.sp=pickFish();f.dist=40;f.ten=18;f.run=0;sfx(900,.05);}else if(f.t<=0)fishEnd('It stole the bait and swam off.');}
  else{const S=f.sp;
    if(f.run>0)f.run--;else if(Math.random()<.012*S.str)f.run=35+rnd(40);
    f.dist+=(f.run?.13:.05)*S.str;f.ten=Math.max(0,f.ten-(f.run?.2:.75));
    if(press.a){f.dist-=3.2;f.ten+=f.run?15:8;sfx(400+Math.round(f.ten)*6,.03,'square',.02);}
    if(f.ten>=100){fishEnd('Snap! The line broke.');return;}
    if(f.dist>=72){fishEnd('It got away.');return;}
    if(f.dist<=0){if(typeof splashSfx=='function')splashSfx(1);fish=null;st.fish[S.id]=(st.fish[S.id]||0)+1;st.coins=Math.min(999,st.coins+S.coins);p.hold={ic:IC.fish,t:90};tune(JING);needSave=true;
      const L=['You caught '+(/^[aeiou]/i.test(S.name)?'an ':'a ')+S.name+'!',S.txt+' (+'+S.coins+' coins)'];
      if(S.id=='sturgeon'&&awardCard('sturgeon',true))L.push('You earned the Atlantic Sturgeon card!');say(L,null,'Fishing');}}
}
function drawBobber(){
  const f=fish,ax=p.x+DX[p.dir]*6,ay=p.y-14,bx=Math.round(f.x),dip=f.ph=='bite'?3:f.ph=='reel'?2:0,by=Math.round(f.y)+((frame>>4)&1)+dip;
  g.strokeStyle='rgba(240,240,255,.7)';g.lineWidth=1;g.beginPath();g.moveTo(ax,ay);g.quadraticCurveTo((ax+bx)/2,Math.max(ay,by)+6,bx,by);g.stroke();
  R(bx-2,by-3,5,5,'#1a1423');R(bx-1,by-2,3,2,'#e83048');R(bx-1,by,3,1,'#ffffff');
  if(f.ph=='bite'||f.ph=='reel'){g.globalAlpha=.6;R(bx-5,by+3,11,1,'#d8f4ff');g.globalAlpha=1;}
  if(f.ph=='bite'){R(Math.round(p.x)-1,Math.round(p.y)-30,3,7,'#f2c14e');R(Math.round(p.x)-1,Math.round(p.y)-21,3,2,'#f2c14e');}
}
function drawFishUI(){
  const f=fish;
  if(f.ph!='reel'){const m=f.ph=='bite'?'BITE! Press A!':'Waiting for a bite...  B: stop';const w=m.length*8+14;R((W-w)/2|0,FH-22,w,14,'rgba(8,10,24,.85)');text(m,W/2,FH-19,f.ph=='bite'?'#fff2a8':'#ffffff',8,'center');return;}
  const x0=40,y0=FH-44,w=176;panel(x0,y0,w,38);
  text('Tap A to reel',x0+8,y0+5,'#fff2a8',8,'left','#080c28');if(f.run&&(frame>>3)&1)text('RUNNING!',x0+w-8,y0+5,'#f890a0',8,'right','#080c28');else if(OPT.assist&&f.ten>75)text('EASY!',x0+w-8,y0+5,'#ffffff',8,'right','#080c28');
  R(x0+8,y0+17,w-44,6,'#080a18');R(x0+9,y0+18,Math.round((w-46)*Math.max(0,1-f.dist/72)),4,'#3ac2e8');
  R(x0+8,y0+27,w-44,6,'#080a18');const tc=f.ten>75?'#e83048':f.ten>50?'#f2c14e':'#58a848';R(x0+9,y0+28,Math.round((w-46)*Math.min(1,f.ten/100)),4,tc);
  text('FISH',x0+w-10,y0+17,'#ffffff',6,'right','#080c28');text('LINE',x0+w-10,y0+27,'#ffffff',6,'right','#080c28');
}

/* ---------- options, slots, controls, gamepad ---------- */
const OPT={timer:false,big:false,assist:false,calm:false,bs:'M'};try{Object.assign(OPT,JSON.parse(localStorage.getItem('rcq-opt')||'{}'));if(localStorage.getItem('rcq-timer')=='1')OPT.timer=true;}catch(e){}
function saveOpt(){try{localStorage.setItem('rcq-opt',JSON.stringify(OPT));}catch(e){}applyBtnSize();}
function applyBtnSize(){try{const c=document.getElementById('controls');if(c&&c.style)c.style.zoom={S:.85,M:1,L:1.2}[OPT.bs]||1;}catch(e){}}
const ACTS=['up','down','left','right','a','b','menu'],ACTN={up:'UP',down:'DOWN',left:'LEFT',right:'RIGHT',a:'A (paddle/talk)',b:'B (item)',menu:'MENU'};
const DEFB={up:['w'],down:['s'],left:['a'],right:['d'],a:[' ','z','j'],b:['x','k'],menu:['i','m']};
const FIXED={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'menu',Escape:'menu'};
let CUST={};try{CUST=JSON.parse(localStorage.getItem('rcq-keys')||'{}')||{};}catch(e){CUST={};}
const normKey=k=>k&&k.length==1?k.toLowerCase():k;
function actionOf(key){key=normKey(key);for(const a of ACTS)if(CUST[a]===key)return a;if(FIXED[key])return FIXED[key];for(const a of ACTS)if(!CUST[a]&&DEFB[a].includes(key))return a;return null;}
const keyName=k=>k==' '?'SPACE':k.length==1?k.toUpperCase():k.replace('Arrow','');
function bindName(a){return CUST[a]?keyName(CUST[a]):keyName(DEFB[a][0]);}
const padPrev={};
function pollPad(){
  let gps=[];try{gps=navigator.getGamepads?navigator.getGamepads():[];}catch(e){}
  let gp=null;for(const q of gps||[])if(q&&q.connected){gp=q;break;}if(!gp)return;
  const b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed),ax=gp.axes||[];
  const s={up:b(12)||ax[1]<-.5,down:b(13)||ax[1]>.5,left:b(14)||ax[0]<-.5,right:b(15)||ax[0]>.5,a:b(0),b:b(2)||b(1),menu:b(9)||b(8)||b(3)};
  for(const k in s){const v=!!s[k];if(v!==!!padPrev[k]){if(k!='menu')keys[k]=v?1:0;if(v&&(k=='a'||k=='b'||k=='menu'))press[k]=1;}padPrev[k]=v;}
}

/* ---------- story beats ---------- */
const BOSSINTRO={
  turtle:['Something huge stirs at the bottom of the quarry pond.','OLD SNAPPER surfaces, jaws first!'],
  wraith:['Cold light gathers between the granite walls.','A WRAITH drifts out of the dark. Paddles pass right through it. Maybe its own magic won\'t.'],
  raven:['A shape sits on the bust above the door, tapping, tapping...','THE RAVEN spreads its wings.'],
  bell:['High in the tower, the great bell starts to swing on its own.','The BRONZE BELL comes for you!'],
  arum:['Under the glass dome, an enormous bud sways. The air smells awful.','THE TITAN ARUM spits seeds at you. Its tough skin shrugs off your paddle. It looks thirsty.'],
  foreman:['Gears grind. A furnace door bangs open.','THE IRON FOREMAN clanks to life. A paddle won\'t dent that armor.'],
  vampire:['Engine 231 sits where the hill buried it, cold and silent.','Then something pale climbs out of the cab.']};
const AREAHINT={'ow:0,0':'There\'s a path north to Bryan Park now. The botanical garden is past it.','ow:3,0':'Chimborazo Park is just east. Great view of the river.','ow:1,2':'Hear that clanking? It comes from the old Tredegar works, down in the corner of the cemetery.','ow:0,2':'The naturalist by the lake is counting frogs. Rainy days are best for that.',
  'ow:0,1':'The shop up the street sells fishing rods now. And card packs! My kid collects them.','ow:2,3':'Ancarrow\'s Landing is just east of here, down by the river. A historian there is building a boat.',
  'ow:1,3':'West of the park is Pony Pasture, with rapids you can wade in.','ow:2,2':'You can fish off the bridge, you know. Bring a rod.'};
function folkContext(){
  const o=[],h=hour();
  if(AREAHINT[curId])o.push(AREAHINT[curId]);
  if(st.f.won)o.push('The lamps are back on all over town. People say it was you who did it!');
  else if(nKeys()>0)o.push('Word is somebody\'s been finding the old tunnel keystones. '+nKeys()+' so far!');
  if(dark()>.6)o.push(h<5?'Out at this hour? Watch for bats.':'Evening, friend. Bats come out after dark, so mind yourself.');
  if(st.wx=='rain'&&st.wxk>.5)o.push('Rain like this brings the frogs out.');
  if(st.wx=='snow'&&st.wxk>.5)o.push('Snow in Richmond! Two inches and the whole city shuts down.');
  if(st.wx=='fog'&&st.wxk>.5)o.push('This fog is thick. Stay off the river.');
  return o.length?o[rnd(o.length)]:null;
}
function goal(){return tr(goalEn());}
function goalEn(){
  if(!st.items.lantern)return'Talk to the archivist beside the Capitol.';
  if(!st.got.granite)return'Cross the footbridge south of Capitol Square to the Belle Isle quarry.';
  if(!st.got.iron)return'Blast the rubble off the pyramid door in Hollywood Cemetery.';
  if(!st.got.brick)return'Find the Poe Museum cellar in Shockoe Bottom.';
  if(!st.got.bronze){if(st.got.carkey)return'Climb the Carillon in Byrd Park.';if(st.items.kayak)return'Paddle south to Forest Hill Park and look for the Carillon key.';
    return st.trade=='melon'?'Someone hungry in the Fan might trade for that watermelon.':st.trade=='music'?'The organist at the Byrd Theatre would love that sheet music.':st.trade=='rivermap'?'The kayaker on Belle Isle wants that river map.':'Ask the Carillon caretaker in Byrd Park, then visit the melon vendor in Carytown.';}
  if(!st.f.won)return'Take all four keystones to the tunnel on Church Hill.';
  if(!st.f['boss:tredegar:0,0'])return'Explore Tredegar Iron Works, in the corner of Hollywood Cemetery.';
  if(!st.f['boss:conserv:0,0'])return'Explore the conservatory at Lewis Ginter Botanical Garden, north of Bryan Park.';
  if(!st.f.bateau)return'Help the river historian at Ancarrow\'s Landing rebuild a bateau.';
  if(!st.f.frogsDone)return'Count frogs for the naturalist in Byrd Park on a rainy day.';
  if(nCards()<CARDS.length)return'Collect every landmark card ('+nCards()+'/'+CARDS.length+').';
  return'Try for every award, or start New Game+ from the title screen.';
}

/* ---------- awards ---------- */
const ACH=[
  ['first','First Light','Get the gas lantern',()=>st.items.lantern],
  ['keys','Keystone Keeper','Find all four keystones',()=>nKeys()>=4],
  ['won','Fog Lifter','Beat the thing in the tunnel',()=>st.f.won],
  ['iron','Iron Will','Beat the Iron Foreman',()=>st.f['boss:tredegar:0,0']],
  ['bloom','Green Thumb','Beat the Titan Arum',()=>st.f['boss:conserv:0,0']],
  ['pins','City Pinned','Win all 14 neighborhood pins',()=>Object.keys(st.pins).length>=NCHAL],
  ['lore','Local Historian','Fill the whole journal',()=>nLore()>=LORE.length],
  ['cards','Card Shark','Collect all 12 landmark cards',()=>nCards()>=CARDS.length],
  ['angler','Angler','Catch all five kinds of fish',()=>FISH.every(f=>st.fish[f.id])],
  ['bateau','Boat Builder','Rebuild the bateau',()=>st.f.bateau],
  ['frogs','Frog Counter','Finish the frog count',()=>st.f.frogsDone],
  ['hearts','Whole Heart','Find all eight heart pieces',()=>st.pieces>=8],
  ['night','Night Watch','Beat 25 foes after dark',()=>(st.nightKills||0)>=25],
  ['rich','Deep Pockets','Carry 999 coins',()=>st.coins>=999],
  ['speed','Speedrunner','Beat the game in under an hour',()=>st.f.won&&st.time<216000],
  ['ngplus','Again!','Beat New Game+',()=>st.f.ngWon],
  ['secret','Secret Keeper','Find every hidden stash',()=>nSecrets()>=Object.keys(SECRETS).length],
  ['slugger','Slugger','Hit 3 homers in one round',()=>st.f.slugger],
  ['wizard','Pinball Wizard','Score 8,000 at pinball',()=>(st.mini&&st.mini.pin||0)>=8000],
  ['derbyw','Derby Champ','Win gold in the derby',()=>st.f.derbyGold],
  ['dog','Good Dog','Adopt a dog from the shelter',()=>!!st.dog],
  ['shutter','Shutterbug','Photograph every landmark',()=>st.photos&&Object.keys(st.photos).length>=PHOTOS.length],
  ['chef','Home Cook','Cook all three recipes',()=>st.f.cooked&&Object.keys(st.f.cooked).length>=3],
  ['trailw','Trail Blazer','Win gold on the Capital Trail',()=>st.f.trailGold],
  ['gallery','Art Walk','Find the curator\'s paintings',()=>st.f.gallery]];
function checkAch(){st.ach=st.ach||{};for(const [id,name,,ok] of ACH)if(!st.ach[id]&&ok()){st.ach[id]=1;needSave=true;toast('Award: '+name+'!');tune([[784,.08],[988,.08],[1319,.16]],'triangle');return;}}

/* ---------- New Game+ and boss rush ---------- */
const RUSH=['quarry:1,0','pyramid:1,1','poe:1,0','carillon:1,0','tredegar:0,0','conserv:0,0','tunnel:0,0'];
function loadRush(i){load(RUSH[i]);p.x=128;p.y=8*TS+8;p.dir=2;p.hp=p.max;p.inv=60;updCam();toast('Boss '+(i+1)+' of '+RUSH.length);}
function startRush(){st=newState();p=newPlayer();Object.assign(st.items,{lantern:1,balls:1,powder:1,bug:1,shoes:1,bottle:1,hook:1,can:1});st.bottle=1;st.shield=1;st.ammo.balls=50;st.ammo.powder=16;st.cap={balls:50,powder:16};
  st.eq='hook';p.max=p.hp=20;st.rush={i:0};st.time=0;mode='play';loadRush(0);}
function newGamePlus(d){const keep={cards:d.st.cards||{},fish:d.st.fish||{},ach:d.st.ach||{},ng:(d.st.ng||0)+1};newGame();Object.assign(st,keep);toast('New Game+: foes are tougher and hit harder.');needSave=true;}

/* ---------- opening: name entry and illustrated intro ---------- */
const NAMECH='ABCDEFGHIJKLMNOPQRSTUVWXYZ-.';let nm=null,intro=null,credits=null;
function startNew(){newGame();st.name='RORY';nm={s:'RORY',cur:NAMECH.length+1};mode='name';}
function nameUpdate(){
  const n=NAMECH.length+2,cols=10;
  if(nav('left'))nm.cur=(nm.cur+n-1)%n;if(nav('right'))nm.cur=(nm.cur+1)%n;
  if(nav('up'))nm.cur=nm.cur-cols<0?Math.min(n-1,nm.cur+cols*2):nm.cur-cols;if(nav('down'))nm.cur=nm.cur+cols>=n?nm.cur%cols:nm.cur+cols;
  if(press.b&&nm.s.length){nm.s=nm.s.slice(0,-1);sfx(400,.04);}
  if(press.menu||(press.a&&nm.cur==n-1)){st.name=(nm.s.trim()||'RORY');nm=null;intro={i:0,t:0};mode='intro';sfx(880,.08,'triangle');return;}
  if(press.a){if(nm.cur==n-2)nm.s=nm.s.slice(0,-1);else if(nm.s.length<8)nm.s+=NAMECH[nm.cur];sfx(700,.04);}
}
function drawName(){
  drawTitleBg();R(16,20,W-32,160,'rgba(8,10,24,.82)');R(16,20,W-32,1,'#f2c14e');
  text('WHAT\'S YOUR NAME?',W/2,30,'#fff2a8',8,'center');
  R(W/2-44,46,88,16,'#080a18');text(nm.s+((frame>>4)&1&&nm.s.length<8?'_':''),W/2,50,'#ffffff',8,'center');
  const cells=[...NAMECH,'DEL','OK'];
  cells.forEach((c,i)=>{const x=26+(i%10)*21,y=74+(i/10|0)*22,sel=i==nm.cur,w=18;
    R(x,y,w,16,sel?'#f2c14e':'#26306a');text(c,x+w/2,y+(c.length>1?5:4),sel?'#1a1423':'#ffffff',c.length>1?6:8,'center');});
  text('A: pick   B: erase   MENU: done',W/2,168,'#aeb7c2',6,'center');
}
const PANELS=[
  {draw(t){drawTitleBg();},txt:()=>'Richmond, Virginia. The River City, where the James tumbles over the falls.'},
  {draw(t){drawTitleBg();g.globalAlpha=Math.min(.55,t/200);R(0,0,W,FH,'#0a0c1a');g.globalAlpha=1;drawFog(Math.min(.7,.2+t/150));},txt:()=>'One autumn night a cold fog rose off the river, and the gas lamps began to go out, block by block.'},
  {draw(t){R(0,0,W,FH,'#0c0a18');R(0,90,W,110,'#1a1626');for(let i=0;i<W;i+=8)R(i,86+((i*7)%9),8,8,'#1a1626');
    R(84,70,88,90,'#3a2a2a');R(92,78,72,82,'#4a3632');for(let i=0;i<5;i++)R(88+i*18,70,14,6,'#5a463e');R(104,96,48,64,'#050408');R(108,90,40,8,'#050408');
    for(let y=160;y<FH;y+=6){R(60,y,136,2,'#3a3446');}R(96,160,4,40,'#5a5468');R(156,160,4,40,'#5a5468');
    if(((t>>5)&3)!=0){R(118,118,4,3,'#e83048');R(132,118,4,3,'#e83048');}drawFog(.25);},txt:()=>'Deep under Church Hill, in a railroad tunnel sealed since 1925, something woke up.'},
  {draw(t){const gr=g.createLinearGradient(0,0,0,FH);gr.addColorStop(0,'#5a7ab0');gr.addColorStop(1,'#c8a878');g.fillStyle=gr;g.fillRect(0,0,W,FH);
    R(48,40,160,10,'#efe4c8');R(56,50,144,60,'#e4dccc');for(let i=0;i<6;i++)R(64+i*24,52,8,58,'#fbf6ea');R(40,110,176,8,'#d8d0c0');R(0,118,W,82,'#58a848');R(96,118,64,82,'#a89c94');
    const s=HERO.down[(t>>4)&1].r.c;g.drawImage(s,Math.round(128-s.width*1.5),82,s.width*3,s.height*3);drawFog(.12);},txt:()=>(st.name||'RORY')+' grabbed an old kayak paddle and headed for Capitol Square.'}];
function introUpdate(){intro.t++;if(press.menu){intro=null;mode='play';return;}if(press.a&&intro.t>20){intro.i++;intro.t=0;sfx(660,.04);if(intro.i>=PANELS.length){intro=null;mode='play';}}}
function drawIntro(){const P=PANELS[intro.i];P.draw(intro.t);R(8,FH-50,W-16,44,'rgba(8,10,24,.88)');R(8,FH-50,W-16,1,'#f2c14e');
  const ls=wrap(tr(P.txt()),30),n=Math.floor(intro.t*1.2);let left=n;ls.forEach((l,i)=>{const sh=l.slice(0,Math.max(0,left));left-=l.length;if(sh)text(sh,16,FH-44+i*11,'#ffffff',8,'left','#080c28');});
  text((intro.i+1)+'/'+PANELS.length+'  A: next  MENU: skip',W-14,FH-12,'#7a84b6',6,'right');}
const CREDITS=()=>['RIVER CITY QUEST','','Starring '+(st.name||'RORY'),'','Made by doodersrage','with Claude','','Set in Richmond, Virginia','','The real places are worth a visit.','Learn more from:','','Library of Virginia','The Valentine','Virginia Museum of History & Culture','James River Park System','Maymont','Lewis Ginter Botanical Garden','The Poe Museum','American Civil War Museum','Richmond National Battlefield Park','Virginia Museum of Fine Arts','','','Thanks for playing!'];
function creditsUpdate(){credits.y+=press.a||keys.a?2:.35;const end=CREDITS().length*14+FH;if(press.menu||credits.y>end){credits=null;mode='title';titleInit();}}
function drawCredits(){drawTitleBg();R(0,0,W,FH,'rgba(8,10,24,.55)');CREDITS().forEach((l,i)=>{const y=Math.round(FH-credits.y+i*14);if(y<-10||y>FH)return;
  text(l,W/2,y,i==0?'#f2c14e':l.startsWith('Starring')||l.startsWith('Thanks')?'#fff2a8':'#e8ecf8',i==0?16:8,'center','#1a1423');});}

/* ---------- sharing: save codes and a finish card ---------- */
async function encodeSave(d){const json=JSON.stringify(d);
  try{if(typeof CompressionStream=='function'){const cs=new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));const buf=new Uint8Array(await new Response(cs).arrayBuffer());let b='';for(const c of buf)b+=String.fromCharCode(c);return'RCQ1:'+btoa(b);}}catch(e){}
  return'RCQ0:'+btoa(unescape(encodeURIComponent(json)));}
async function decodeSave(code){code=(code||'').trim().replace(/\s+/g,'');
  if(code.startsWith('RCQ1:')){const bin=atob(code.slice(5)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
    const ds=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(ds).text());}
  if(code.startsWith('RCQ0:'))return JSON.parse(decodeURIComponent(escape(atob(code.slice(5)))));
  throw new Error('not a save code');}
async function exportSave(d){try{const c=await encodeSave(d);
  try{await navigator.clipboard.writeText(c);tl.msg='Save code copied! Paste it on your other device.';}catch(e){window.prompt('Copy this save code:',c);tl.msg='Copy the code, then IMPORT it on your other device.';}}catch(e){tl.msg='Could not make a save code.';}tl.msgT=300;}
async function importSave(){const c=window.prompt('Paste a River City Quest save code:');if(!c)return;
  try{const d=await decodeSave(c);if(!d||!d.st||!SC[d.at])throw 0;let n=[1,2,3].find(i=>!readSave(i));
    if(!n){if(!window.confirm('All three slots are full. Replace slot 3?'))return;n=3;}
    localStorage.setItem(saveKey(n),JSON.stringify(d));titleInit();titleSel=n-1;tl.msg='Imported into slot '+n+'.';}catch(e){tl.msg='That code didn\'t work. Check that it was copied whole.';}tl.msgT=300;}
function shareCard(){
  const c=document.createElement('canvas');c.width=1200;c.height=630;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  const old=g;g=buf.getContext('2d');drawTitleBg();g=old;x.drawImage(buf,0,0,W,FH,0,-40,1200,940);
  x.fillStyle='rgba(8,10,24,.6)';x.fillRect(0,0,1200,630);x.textAlign='center';x.fillStyle='#f2c14e';x.font='64px "Press Start 2P", monospace';x.fillText('RIVER CITY QUEST',600,130);
  x.fillStyle='#ffffff';x.font='30px "Press Start 2P", monospace';x.fillText((st.name||'RORY')+' lifted the fog',600,230);
  x.fillStyle='#fff2a8';x.font='56px "Press Start 2P", monospace';x.fillText(fmtTime(st.time),600,330);
  x.fillStyle='#e8ecf8';x.font='22px "Press Start 2P", monospace';x.fillText('Stories '+nLore()+'/'+LORE.length+'   Cards '+nCards()+'/'+CARDS.length+'   Awards '+Object.keys(st.ach||{}).length+'/'+ACH.length,600,410);
  if(st.ng)x.fillText('New Game+ '+st.ng,600,450);x.fillStyle='#aeb7c2';x.font='18px "Press Start 2P", monospace';x.fillText('doodersrage.github.io/river-city-quest',600,570);
  const txt=(st.name||'I')+' beat River City Quest in '+fmtTime(st.time)+'! https://doodersrage.github.io/river-city-quest/';
  c.toBlob(async b=>{try{const file=new File([b],'river-city-quest.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text:txt});return;}}catch(e){if(e&&e.name=='AbortError')return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='river-city-quest.png';document.body.appendChild(a);a.click();a.remove();},'image/png');
}

/* ---------- phone niceties ---------- */
function buzz(ms){if(OPT.haptic===false)return;try{if(navigator.vibrate)navigator.vibrate(ms);}catch(e){}}
