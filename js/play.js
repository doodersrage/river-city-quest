"use strict";
/* River City Quest: Movement, enemies, bosses, actions, the main update loop and menu controls. */
/* ---------- collision & movement ---------- */
function tileAt(px,py){const tx=Math.floor(px/TS),ty=Math.floor(py/TS);if(tx<0||ty<0||tx>=cur.w||ty>=cur.h)return null;return cur.g[ty][tx];}
function blockedPt(x,y,set){const t=tileAt(x,y);return t===null||set.includes(t);}
function blocked(x,y,h,oob,pl){
  for(let i=0;i<4;i++){const px=x+(i&1?h:-h),py=y+(i&2?h:-h),t=tileAt(px,py);if(t===null){if(oob)return true;}
    else if(SOLID.includes(t)&&!(pl&&t=='~'&&st.items.kayak))return true;
    else if(blocks.length&&blockAt(Math.floor(px/TS),Math.floor(py/TS)))return true;}
  return false;
}
const onRiver=()=>tileAt(p.x,p.y)=='~';
function npcAt(x,y){for(const n of cur.npcs||[])if(Math.abs(n.x-x)<13&&Math.abs(n.y-y)<13)return n;return null;}
function npcHit(x,y){for(const n of cur.npcs||[])if(Math.abs(n.x-x)<11&&Math.abs(n.y-y)<11)return true;return carHit(x,y);}
function carHit(x,y){for(const c of cars)if(Math.abs(x-c.x)<c.len/2+5&&Math.abs(y-c.y)<10)return true;return false;}
function updLife(){
  for(const n of cur.npcs||[]){if(!n.wander||dlg)continue;
    if(--n.t<=0){n.t=50+rnd(90);const a=rnd(6);if(a<4){n.vx=DX[a]*.4;n.vy=DY[a]*.4;}else n.vx=n.vy=0;}
    const nx=n.x+n.vx,ny=n.y+n.vy;
    if((n.vx||n.vy)&&Math.abs(nx-n.hx)<40&&Math.abs(ny-n.hy)<40&&!blocked(nx,ny,5,true)&&!(Math.abs(nx-p.x)<13&&Math.abs(ny-p.y)<13)&&!carHit(nx,ny)){n.x=nx;n.y=ny;}else n.vx=n.vy=0;
    if(n.vx)n.f=n.vx<0?-1:1;if(n.vx||n.vy)n.d=n.vx<0?1:n.vx>0?3:n.vy<0?2:0;}
  for(const n of cur.npcs||[])if(n.look>0&&--n.look==0&&!(n.vx||n.vy)&&!dlg)n.d=n.d0||0;
  for(const c of cars){const ah=(p.x-c.x)*c.dir;if(Math.abs(p.y-c.y)<13&&ah>-c.len/2-6&&ah<c.len/2+22){if(!c.stop){c.stop=1;sfx(440,.12,'square',.03);}continue;}
    c.stop=0;c.x+=c.dir*c.sp;if(c.x>MW()+40)c.x=-40;if(c.x<-40)c.x=MW()+40;}
  for(const b of birds){b.t++;
    if(b.st=='sit'){if(Math.hypot(p.x-b.x,p.y-b.y)<30){b.st='fly';b.t=0;b.vx=(b.x<p.x?-1:1)*(1+Math.random());b.vy=-1.6-Math.random();sfx(1300,.04,'square',.01);}}
    else if(b.st=='fly'){b.x+=b.vx;b.y+=b.vy;b.vy-=.02;if(b.y<cam.y-20||b.t>300){b.st='gone';b.t=0;}}
    else if(b.t>600&&Math.hypot(p.x-b.hx,p.y-b.hy)>120){b.st='sit';b.x=b.hx;b.y=b.hy;}}
}
const litLamp=(x,y)=>relight?relightLit((cur.lamps||[]).findIndex(l=>l[0]==x&&l[1]==y)):cur.id!='ow:3,0'||st.pins.lamps||(chal&&chal.id=='lamps'&&chal.set.has(x+','+y));
function moveP(dx,dy){
  if(dx&&!blocked(p.x+dx,p.y,5,false,true)&&!npcHit(p.x+dx,p.y))p.x+=dx;
  if(dy&&!blocked(p.x,p.y+dy,5,false,true)&&!npcHit(p.x,p.y+dy))p.y+=dy;
}
function cutAt(x,y){const tx=Math.floor(x/TS),ty=Math.floor(y/TS);if(tileAt(x,y)!='b')return;
  cur.g[ty][tx]=cur.base;patchTile(tx,ty);burst(tx*TS+8,ty*TS+8,8,['#2f7a3c','#58a850','#90d070'],1.6,2);sfx(300,.05,'square',.03);
  const r=Math.random();if(r<.2)picks.push({x:tx*TS+8,y:ty*TS+8,kind:'coin',life:600});else if(r<.3)picks.push({x:tx*TS+8,y:ty*TS+8,kind:'heart',life:600});}
function moveE(e,dx,dy){
  let ok=true;
  if(dx){if(!blocked(e.x+dx,e.y,5,true))e.x+=dx;else ok=false;}
  if(dy){if(!blocked(e.x,e.y+dy,5,true))e.y+=dy;else ok=false;}
  return ok;
}
const front=d=>[p.x+DX[p.dir]*d,p.y+DY[p.dir]*d];
function hurt(d,sx,sy){
  if(p.inv>0||p.dash>0||p.hp<=0)return;
  if(st.ng)d++;if(warm>0)d=Math.max(1,Math.ceil(d/2));if(st.riding){st.riding=false;}buzz(40);p.hp-=d;p.inv=50;hurtT=OPT.calm?0:12;hitstop=4;const dx=p.x-sx,dy=p.y-sy,l=Math.hypot(dx,dy)||1;p.kx=dx/l*2.5;p.ky=dy/l*2.5;p.kt=8;p.atk=0;p.charging=false;p.spin=0;sfx(140,.18,'sawtooth');
  burst(p.x,p.y-4,6,['#e83048','#ffffff'],1.6,2);
  if(p.hp<=0&&st.rush){p.hp=0;const n=st.rush.i;st.rush.over=1;say(['The fog takes you.','Boss rush over: you beat '+n+' of '+RUSH.length+'.'],()=>{mode='title';titleInit();});return;}
  if(p.hp<=0){p.hp=0;bug=null;
    say(['The fog takes you...',st.dent?'You come to at the entrance.':'You wake by the fountain in Capitol Square.'],()=>{
      p.hp=p.max;p.kt=0;p.inv=60;if(st.dent){load(st.dent);p.x=128;p.y=8*TS+6;p.dir=2;}else{load('ow:2,1');p.x=7*TS+8;p.y=8*TS+8;p.dir=2;}updCam();});}
}
function shoot(e,sp0,a,k){shots.push({x:e.x,y:e.y-4,vx:Math.cos(a)*sp0,vy:Math.sin(a)*sp0,life:200,k:k||e.type});sfx(520,.06);}

/* ---------- enemies ---------- */
function updEnemy(e){
  if(e.flash>0)e.flash--;
  if(e.kt>0){e.kt--;if(FLY[e.type]){e.x+=e.kx;e.y+=e.ky;}else moveE(e,e.kx,e.ky);return;}
  if(e.stun>0){e.stun--;return;}
  e.t++;
  const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;let a;
  switch(e.type){
    case'rat':if(e.t%45==1||e.stuck){a=rnd(4);e.vx=DX[a]*.8;e.vy=DY[a]*.8;}e.stuck=!moveE(e,e.vx,e.vy);break;
    case'squirrel':{const ph=e.t%70;if(ph==40){e.vx=dx/d*1.7;e.vy=dy/d*1.7;}if(ph>=40&&ph<62)moveE(e,e.vx,e.vy);else e.vx=dx;break;}
    case'goose':if(d<70){e.vx=dx/d*.75;e.vy=dy/d*.75;moveE(e,e.vx,e.vy);}
      else{if(e.t%60==1||e.stuck){a=rnd(4);e.vx=DX[a]*.4;e.vy=DY[a]*.4;}e.stuck=!moveE(e,e.vx,e.vy);}break;
    case'scooter':if((!e.vx&&!e.vy)||e.stuck||Math.random()<.01){a=rnd(4);e.vx=DX[a]*1.4;e.vy=DY[a]*1.4;}e.stuck=!moveE(e,e.vx,e.vy);break;
    case'crab':if(e.t%60==1||e.stuck){e.vx=(Math.random()<.5?-1:1)*1.2;e.vy=Math.random()<.3?(dy>0?.4:-.4):0;}e.stuck=!moveE(e,e.vx,e.vy);break;
    case'bat':e.x+=dx/d*.6+Math.cos(e.t/9)*.8;e.y+=dy/d*.6+Math.sin(e.t/7)*.8;e.vx=dx;break;
    case'ghost':e.x+=dx/d*.4;e.y+=dy/d*.4;e.vx=dx;break;
    case'raven':{const ph=e.t%120;
      if(ph<70){const tx=p.x-e.x,ty=clamp(p.y-50,20,PH)-e.y,l=Math.hypot(tx,ty)||1;if(l>2){e.x+=tx/l*.7;e.y+=ty/l*.7;}e.vx=dx;if(ph==35)shoot(e,1.6,Math.atan2(dy,dx),'feather');}
      else{if(ph==70){e.vx=dx/d*2.2;e.vy=dy/d*2.2;sfx(300,.15,'sawtooth');}e.x+=e.vx;e.y+=e.vy;}break;}
    case'vampire':{
      if(!e.p2&&e.hp<=e.mhp*.6){e.p2=1;e.swarm=1;shake=10;for(let i=0;i<3;i++)enemies.push(mk('bat',e.x+(i-1)*20,e.y-10));burst(e.x,e.y-6,16,['#6c4c9e','#e83048','#1a1423'],2,2);toast('It bursts into a swarm of bats!');sfx(200,.4,'sawtooth',.05);}
      if(e.swarm){e.gone=true;if(!enemies.some(q=>q.type=='bat')){e.swarm=0;e.t=0;e.gone=false;burst(e.x,e.y-6,12,['#6c4c9e','#e83048'],1.6,2);toast('The bats pull back together!');}break;}
      if(!e.p3&&e.hp<=e.mhp*.3){e.p3=1;shake=14;toast('Engine 231 groans. The thing is desperate!');sfx(90,.5,'sawtooth',.06);}
      if(e.p3&&e.t%170==60){for(let i=0;i<8;i++)shoot(e,1.5,i*Math.PI/4,'blood');}
      const ph=e.t%170;e.gone=ph>=130;e.vx=dx;
      if(ph==0){for(let i=0;i<30;i++){const x=(2+rnd(12))*TS+8,y=(3+rnd(6))*TS+8;if(!blocked(x,y,6,true)&&Math.hypot(x-p.x,y-p.y)>50){e.x=x;e.y=y;break;}}sfx(200,.25,'triangle');burst(e.x,e.y-6,10,['#6c4c9e','#e83048'],1.4,2);}
      if(ph==40||ph==80||(e.hp<=7&&ph==110)){const b=Math.atan2(p.y-e.y,p.x-e.x),s0=e.hp<=7?1.9:1.5;for(const o of[-.4,0,.4])shoot(e,s0,b+o,'blood');}
      if(ph==100&&enemies.filter(q=>q.type=='bat').length<2)enemies.push(mk('bat',e.x,e.y-10));
      break;}
    case'turtle':
      if(e.state=='stun'){if(--e.st<=0){e.state='walk';e.t=0;}break;}
      if(e.state=='wind'){if(--e.st<=0){e.state='charge';if(Math.abs(dx)>Math.abs(dy)){e.vx=Math.sign(dx)*2.6;e.vy=0;}else{e.vx=0;e.vy=Math.sign(dy)*2.6;}sfx(160,.2,'sawtooth');}break;}
      if(e.state=='charge'){if(!moveE(e,e.vx,e.vy)){e.state='stun';e.st=140;shake=10;sfx(70,.3,'sawtooth',.08);burst(e.x+Math.sign(e.vx)*10,e.y+Math.sign(e.vy)*10,10,['#8e909c','#5c5e6a'],1.8,2);}break;}
      if(e.t%40<30){const h=Math.abs(dx)>Math.abs(dy);moveE(e,h?Math.sign(dx)*.5:0,h?0:Math.sign(dy)*.5);}
      e.vx=dx;if(e.t>=100){e.state='wind';e.st=36;}
      break;
    case'bell':updBell(e,dx,dy,d);break;
    case'foreman':updForeman(e,dx,dy,d);break;
    case'arum':updArum(e,dx,dy,d);break;
    case'wraith':
      if(e.vis>0){e.vis--;e.x+=Math.sin(e.t/6)*.3;e.vx=dx;break;}
      {const tx=clamp(p.x,40,W-40),ty=clamp(p.y-56,30,90);e.x+=(tx-e.x)*.02+Math.cos(e.t/20)*.5;e.y+=(ty-e.y)*.02;}
      if(e.t%110==60){shoot(e,1.4,Math.atan2(dy,dx),'orb');sfx(300,.2,'triangle');}
      if(e.t%330==200&&enemies.filter(q=>q.type=='ghost').length<2)enemies.push(mk('ghost',e.x,e.y));
      e.vx=dx;break;
  }
  if(FLY[e.type]){e.x=clamp(e.x,12,MW()-12);e.y=clamp(e.y,14,MH()-12);}
  if(e.vx)e.f=e.vx<0?-1:1;
}
function updArum(e,dx,dy,d){
  e.vx=0;e.kt=0;
  if(e.state=='bloom'){if(--e.st<=0){e.state='walk';e.t=0;sfx(260,.3,'triangle',.05);}return;}
  if(e.t%70==35){const b=Math.atan2(dy,dx),n=e.hp<=4?5:3;for(let i=0;i<n;i++)shoot(e,1.4,b+(i-(n-1)/2)*.32,'seed');sfx(420,.08,'triangle',.04);}
  if(e.t%260==200&&enemies.filter(q=>q.type=='rat').length<2){enemies.push(mk('rat',e.x+(rnd(2)?-30:30),e.y+20));burst(e.x,e.y+10,6,['#58a848','#6a4a2a'],1.2,2);}
}
function updForeman(e,dx,dy,d){
  if(e.state=='stun'){if(--e.st<=0){e.state='walk';e.t=0;sfx(200,.2,'sawtooth',.05);burst(e.x,e.y-10,8,['#8e909c','#5c5e6a'],1.5,2);}e.vx=dx;return;}
  if(e.state=='wind'){if(--e.st<=0){e.state='walk';shake=10;sfx(70,.3,'sawtooth',.08);for(let i=0;i<8;i++)shoot(e,1.5,i*Math.PI/4+(e.hp<5?Math.PI/8:0),'spark');burst(e.x,e.y,12,['#f8e060','#f08020','#e83048'],2,2);}return;}
  if(d>4)moveE(e,dx/d*.45,dy/d*.45);e.vx=dx;
  if(e.t%150==149){e.state='wind';e.st=40;sfx(300,.3,'sawtooth',.04);}
  if(e.hp<=5&&e.t%90==45)shoot(e,1.7,Math.atan2(dy,dx),'spark');
}
function updBell(e,dx,dy,d){
  if(e.state=='stun'){if(--e.st<=0){e.state='rise';e.st=30;}return;}
  if(e.state=='rise'){e.z=Math.min(40,e.z+1.5);if(--e.st<=0)e.state='float';return;}
  if(e.state=='drop'){e.z-=4;if(e.z<=0){e.z=0;e.state='stun';e.st=110;shake=12;sfx(80,.4,'sawtooth',.08);sfx(330,.7,'triangle',.07);
    for(let i=0;i<8;i++)shoot(e,1.6,i*Math.PI/4,'ring');burst(e.x,e.y,14,['#e8b070','#c08840','#ffffff'],2.2,2);}return;}
  e.z=40;if(d>4){e.x+=dx/d*.8;e.y+=dy/d*.8;}e.vx=dx;
  if(e.t%140==139){e.state='drop';sfx(500,.3,'triangle',.05);}
}
function hitEnemy(e,dmg,src,kx,ky){
  if(e.gone||e.flash>0)return false;
  if(e.type=='turtle'&&e.state!='stun'&&src!='bomb'){sfx(1500,.05,'square',.03);burst(e.x,e.y-6,3,['#ffffff'],1,1);return'clank';}
  if(e.type=='wraith'&&e.vis<=0){if(src!='refl')return false;e.vis=130;}
  if(e.type=='arum'&&e.state!='bloom'){if(src=='hook'||src=='bug')return false;sfx(1500,.05,'square',.03);burst(e.x,e.y-8,3,['#84cc68'],1,1);return'clank';}
  if(e.type=='foreman'){if(src=='hook'){if(e.state=='stun')return false;e.state='stun';e.st=170;e.flash=8;shake=6;sfx(1100,.1,'square',.05);sfx(180,.3,'sawtooth',.05);burst(e.x,e.y-12,14,['#8e909c','#d8dce4','#f8a030'],2.2,2);toast('The chest plate rips loose!');return true;}
    if(e.state!='stun'){sfx(1500,.05,'square',.03);burst(e.x,e.y-8,3,['#ffffff'],1,1);return'clank';}}
  if(e.type=='bell'&&e.state!='stun'){if(e.z>12)return false;if(src!='bomb'){sfx(1500,.05,'square',.03);return'clank';}}
  voiceOf(e.type);e.hp-=dmg;e.flash=16;hitstop=Math.max(hitstop,e.boss?4:3);e.kx=kx||0;e.ky=ky||0;e.kt=e.boss?2:8;sfx(240,.06);
  burst(e.x,e.y-2,5,['#ffffff','#fff2a8'],1.8,2);
  if(e.hp<=0){const i=enemies.indexOf(e);if(i>=0)enemies.splice(i,1);kill(e);}
  return true;
}
function kill(e){
  if(e.chal&&chal)chalProgress();
  st.kills++;buzz(e.boss?120:15);if(e.night)st.nightKills=(st.nightKills||0)+1;sfx(90,.2,'sawtooth',.06);hitstop=e.boss?12:5;parts.push({ring:1,x:e.x,y:e.y-4,vx:0,vy:0,life:16,max:16,c:'#ffffff',s:0});for(let i=0;i<8;i++){const a=i*.785;parts.push({x:e.x+Math.cos(a)*4,y:e.y-4+Math.sin(a)*4,vx:Math.cos(a)*1.1,vy:Math.sin(a)*1.1-.2,life:20,max:20,c:i&1?'#d8d8e8':'#a8a8c0',s:4});}burst(e.x,e.y-2,e.boss?22:10,['#ffffff','#d8d8e8','#a8a8c0'],e.boss?2.2:1.3,3);
  if(e.boss&&st.rush){enemies=[];shots=[];bombs=[];st.rush.i++;tune(JING);
    if(st.rush.i>=RUSH.length){const t=st.time;let best=0;try{best=+localStorage.getItem('rcq-rush')||0;if(!best||t<best)localStorage.setItem('rcq-rush',t);}catch(_){}
      say(['Boss rush cleared in '+fmtTime(t)+'!',best&&best<t?'Best: '+fmtTime(best)+'.':'That\'s a new best time!'],()=>{mode='title';titleInit();},'Boss Rush');}
    else say(['Down! '+(RUSH.length-st.rush.i)+' to go.'],()=>loadRush(st.rush.i),'Boss Rush');return;}
  if(e.boss){st.splits=st.splits||{};if(!st.splits[cur.area])st.splits[cur.area]=st.time;}
  if(e.type=='vampire'){enemies=[];shots=[];st.f['boss:'+curId]=1;st.f.won=1;if(st.ng)st.f.ngWon=1;needSave=true;
    say(['The pale thing shrieks and comes apart like wet newspaper.','Above you the fog thins. One by one the lamps along Broad Street come back on.','Richmond is safe. Somebody owes you a ginger beer.','By morning the fog has burned off the James. Every lamp from Church Hill to Carytown is lit.','The archivist adds one last story to the journal. It\'s called '+(st.name||'Rory')+' and the Fog.'],()=>startRelight(),'Engine 231');return;}
  if(e.boss){st.f['boss:'+curId]=1;st.f['clr:'+curId]=1;enemies=[];shots=[];bombs=[];refresh();
    if(cur.reward)picks.push({x:112,y:80,kind:'keystone',id:cur.reward,life:1e9});picks.push({x:144,y:80,kind:'container',id:'hc:'+curId,life:1e9});
    tune(JING);const bc=BOSSCARD[e.type],nc=bc&&awardCard(bc,true);say(BOSSTXT[e.type].concat(nc?['You found a landmark card: '+CARDM[bc].name+'!']:[]),null,cur.name);needSave=true;return;}
  const r=Math.random();
  if(r<.3)picks.push({x:e.x,y:e.y,kind:'coin',life:600});
  else if(r<.44)picks.push({x:e.x,y:e.y,kind:'heart',life:600});
  else if(r<.52&&st.items.balls)picks.push({x:e.x,y:e.y,kind:'ballpk',life:600});
  else if(r<.57&&st.items.powder)picks.push({x:e.x,y:e.y,kind:'powpk',life:600});
}
function collect(k){
  switch(k.kind){
    case'token':case'flag':burst(k.x,k.y,6,['#fff2a8','#ffffff'],1.4,2);chalProgress();break;
    case'part':{st.got[k.id]=1;p.hold={ic:IC.oar,t:90};tune(JING);needSave=true;const n=['oar','pole','tiller'].filter(q=>st.got[q]).length;
      say(['You found the bateau '+k.id+'! ('+n+' of 3)',n<3?'The river historian at Ancarrow\'s Landing will want it.':'That\'s every part! Take them to the historian at Ancarrow\'s Landing.'],null,'Bateau Part');break;}
    case'frog':st.frogs++;sfx(1400,.05,'triangle');if(typeof splashSfx=='function')splashSfx(.4);burst(k.x,k.y,5,['#68b854','#ffffff'],1.2,1);toast(st.frogs>=5&&!st.f.frogsDone?'Five frogs! Take them to the naturalist in Byrd Park.':'Caught a frog! ('+Math.min(st.frogs,5)+'/5)');needSave=true;break;
    case'tomato':st.ingr=st.ingr||{};st.ingr.tomato=(st.ingr.tomato||0)+1;if(k.day)st.f[k.day]=1;sfx(1000,.05,'triangle');toast('A ripe Hanover tomato! ('+st.ingr.tomato+')');needSave=true;break;
    case'painting':{st.got[k.id]=1;const n=['p1','p2','p3'].filter(q=>st.got['paint:'+q]).length;tune(JING);toast('A lost painting! ('+n+'/3) Bring them to the curator.');needSave=true;break;}
    case'secret':st.got[k.id]=1;st.coins=Math.min(999,st.coins+25);tune([[1047,.06],[1319,.06],[1568,.12]],'triangle');burst(k.x,k.y,10,['#fff2a8','#ffffff','#f2c14e'],1.6,2);toast('A hidden stash! 25 coins. ('+nSecrets()+'/'+Object.keys(SECRETS).length+' secrets)');needSave=true;break;
    case'coin':st.coins=Math.min(999,st.coins+1);sfx(1200,.05);burst(k.x,k.y,3,['#fff2a8'],1,1);break;
    case'heart':p.hp=Math.min(p.max,p.hp+2);sfx(800,.1,'triangle');break;
    case'ballpk':st.ammo.balls=Math.min(st.cap.balls,st.ammo.balls+3);sfx(1000,.05);break;
    case'powpk':st.ammo.powder=Math.min(st.cap.powder,st.ammo.powder+1);sfx(1000,.05);break;
    case'container':st.got[k.id]=1;p.max+=2;p.hp=p.max;p.hold={ic:HEART,t:90};tune(JING);say(['A heart charm! Your hearts grew by one.']);needSave=true;break;
    case'keystone':{st.got[k.id]=1;p.hold={ic:KSIC[k.id],t:90};tune(JING);const n=nKeys();
      say(['You found the '+KEYNAME[k.id]+' Keystone! ('+n+' of 4)',n>=4?'All four hum together. The tunnel on Church Hill is waiting.':'Take the stairs to head back up.'],null,'Keystone');needSave=true;break;}
    case'bib':st.got.bib=1;p.hold={ic:IC.bib,t:90};tune(JING);say(['A race bib from the Monument Avenue 10K.','A runner in the Fan must be missing it.']);needSave=true;break;
    case'piece':st.got[k.id]=1;say(give('piece'));break;
    case'carkey':st.got.carkey=1;p.hold={ic:IC.carkey,t:90};tune(JING);say(['You found the Carillon Key!','Bring it to the Carillon in Byrd Park.']);needSave=true;break;
    case'skey':st.got[k.id]=1;st.keys[cur.area]=(st.keys[cur.area]||0)+1;p.hold={ic:IC.key,t:90};tune(JING);say(['The Gold-Bug brought back a small key!']);needSave=true;break;
  }
}

/* ---------- actions ---------- */
function interact(){
  const [fx,fy]=front(14);
  if(homeInteract())return true;
  let n=npcAt(fx,fy);
  if(!n&&tileAt(fx,fy)=='V'){const [gx,gy]=front(30);n=npcAt(gx,gy);}
  if(n){sfx(700,.03);n.d=(p.dir+2)%4;n.look=150;n.vx=n.vy=0;n.t=Math.max(n.t||0,90);const r=TALK[n.talk](n);if(r)say(r,null,n.who);return true;}
  const tx=Math.floor(fx/TS),ty=Math.floor(fy/TS),t=tileAt(fx,fy);
  if(t=='c'){const c=cur.chests.find(q=>q.tx==tx&&q.ty==ty);if(c){st.f['c:'+c.id]=1;refresh();say(give(c.item),null,'Treasure');}return true;}
  if(t=='e'){if(chal&&chal.d.type=='tag'){const k=tx+','+ty;if(!chal.set.has(k)){chal.set.add(k);burst(tx*TS+8,ty*TS+8,8,['#e83048','#f2c14e','#3ac2e8'],1.4,2);chalProgress();}else toast('Already found that one.');}
    else say(['A bright mural, painted right onto the wall.'],null,'Mural');return true;}
  if(t=='l'&&!(chal&&chal.d.type=='light')){say([litLamp(tx,ty)?'A gas lamp, burning low in the fog.':'A cold gas lamp. The lamplighter could use help.'],null,'Gas Lamp');return true;}
  const lmk=t=='X'&&(cur.lm||[]).find(L=>tx>=L.x&&tx<L.x+L.w&&ty>=L.y&&ty<L.y+L.h);
  const r=cur.reads[tx+','+ty]||(cur.readsT&&cur.readsT[t])||(lmk&&lmk.read);
  if(r=='!arcade'){say(['A pinball machine called RIVER CITY RAMBLE. One coin a game.'+(st.mini&&st.mini.pin?' High score: '+st.mini.pin+'.':'')],sel=>{if(sel!=0)return;if(st.coins<1){toast('You need a coin.');return;}st.coins--;startMini('pin');},'Stone House Arcade',['Play (1 coin)','Walk away']);return true;}
  if(r){if(r[0]=='!'){const x=READX[r];if(r=='!organ')tune(ORGAN,'triangle');say([x[1]],null,x[0]);}else{sfx(700,.03);say([LOREM[r].s],null,LOREM[r].t);learn(r);}return true;}
  if(t=='j'){say(['A cold brazier.',st.items.lantern?'Use the Gas Lantern on it with B. Pick it in the MENU if it isn\'t on B.':'Something would have to light it.']);return true;}
  if(t=='L'){tryUnlock(tx,ty,true);return true;}
  return false;
}
function tryUnlock(tx,ty,loud){
  if((st.keys[cur.area]||0)>0){const d=cur.dyn.find(q=>q.closed=='L'&&q.cells.some(([x,y])=>x==tx&&y==ty));if(!d)return;
    st.f[d.flag]=1;st.keys[cur.area]--;refresh();tune([[392,.06],[523,.06],[784,.12]]);toast('Unlocked!');needSave=true;}
  else if(loud)say(['Locked tight. A small key from somewhere in here would open it.']);
  else if(toastT<=0)toast('Locked. Find a small key.');
}
function lightAt(tx,ty){
  const i=(cur.braz||[]).findIndex(([x,y])=>x==tx&&y==ty);if(i<0)return;
  const was=isSolved(cur);st.f['b:'+cur.id+':'+i]=1;refresh();sfx(900,.1,'triangle');burst(tx*TS+8,ty*TS+4,10,['#f8e060','#f08020','#ffffff'],1.4,2);
  if(!was&&isSolved(cur)){tune(SECRET);toast((cur.chests||[]).length?'A chest appeared!':'Something opened nearby.');}needSave=true;
}
function useItem(){
  const id=st.eq;tutF.b=1;
  if(!id){toast('Nothing on B. Press MENU to pick an item.');return;}
  switch(id){
    case'lantern':{const [fx,fy]=front(14),lt=tileAt(fx,fy),ltx=Math.floor(fx/TS),lty=Math.floor(fy/TS);
      if(lt=='l'&&chal&&chal.d.type=='light'){const k=ltx+','+lty;if(!chal.set.has(k)){chal.set.add(k);burst(ltx*TS+8,lty*TS+3,8,['#f8e060','#f08020','#ffffff'],1.2,2);chalProgress();}break;}
      if(lt=='j')lightAt(ltx,lty);
      else{sfx(660,.06,'triangle');burst(p.x+DX[p.dir]*10,p.y-4+DY[p.dir]*10,4,['#f8e060','#f08020'],1,2);}break;}
    case'balls':if(st.ammo.balls<=0){toast('Out of baseballs.');sfx(150,.06);break;}
      st.ammo.balls--;shots.push({x:p.x+DX[p.dir]*6,y:p.y-4+DY[p.dir]*6,vx:DX[p.dir]*3.4,vy:DY[p.dir]*3.4,life:70,k:'ball',pl:true});sfx(700,.05);break;
    case'powder':if(st.ammo.powder<=0){toast('Out of blasting powder.');sfx(150,.06);break;}
      if(bombs.length>=2)break;st.ammo.powder--;bombs.push({x:p.x+DX[p.dir]*12,y:p.y+DY[p.dir]*12,t:80});sfx(300,.05);break;
    case'bug':if(bug)break;bug={x:p.x,y:p.y-4,vx:DX[p.dir]*4,vy:DY[p.dir]*4,t:0,ret:false,carry:[],hit:new Set()};sfx(1400,.05);break;
    case'hook':if(hook)break;hook={x:p.x,y:p.y-4,dx:DX[p.dir],dy:DY[p.dir],d:0,st:'out',carry:[]};sfx(900,.06,'square',.03);break;
    case'camera':snapPhoto();break;
    case'basket':eatMenu();break;
    case'bike':if(!cur.ow){toast('Save the bike for outdoors.');break;}st.riding=!st.riding;sfx(st.riding?900:500,.06,'triangle',.03);toast(st.riding?'You hop on the bike.':'You hop off the bike.');break;
    case'can':{const [fx,fy]=front(14),t=tileAt(fx,fy),tx=Math.floor(fx/TS),ty=Math.floor(fy/TS);
      for(let i=0;i<6;i++)parts.push({x:fx,y:fy-4,vx:(Math.random()-.5)*1.4,vy:Math.random()*1.2,life:14,max:14,c:i&1?'#7ac8f0':'#d8f4ff',s:2});if(typeof splashSfx=='function')splashSfx(.3);
      if(t=='z'){st.f['grow:'+curId+':'+tx+','+ty]=1;refresh();tune(SECRET);toast('The sprout drinks it up and grows!');burst(tx*TS+8,ty*TS+8,12,['#58a848','#84cc68','#f08098'],1.8,2);needSave=true;break;}
      const a=enemies.find(e=>e.type=='arum'&&Math.hypot(e.x-fx,e.y-fy)<34);if(a&&a.state!='bloom'){a.state='bloom';a.st=230;sfx(500,.3,'triangle',.05);toast('The Titan Arum unfurls!');}
      break;}
    case'rod':{const [fx,fy]=front(20),t=tileAt(fx,fy);if(t!='w'&&t!='~'){toast('Face open water to cast.');sfx(150,.06);break;}
      if(enemies.some(e=>!e.gone&&Math.hypot(e.x-p.x,e.y-p.y)<60)){toast('Too much commotion to fish.');break;}
      fish={ph:'wait',t:Math.round((80+rnd(160))*(st.lure?.55:1)),x:fx,y:fy,ten:0,dist:0,sp:null,run:0};sfx(700,.08,'triangle');if(typeof splashSfx=='function')splashSfx(.6,.18);break;}
    case'shoes':if(p.dash>0)break;p.dash=20;p.trail=[];sfx(300,.15,'sawtooth',.03);break;
    case'bottle':if(st.bottle){st.bottle=0;p.hp=p.max;tune([[523,.08],[659,.08],[784,.15]],'triangle');burst(p.x,p.y-8,10,['#f8a030','#ffffff'],1.2,2);toast('Ahh. Every heart refilled.');needSave=true;}
      else toast('The bottle is empty. The brewer refills it.');break;
  }
}
function explode(b){
  shake=12;sfx(60,.4,'sawtooth',.1);sfx(110,.3,'square',.06);burst(b.x,b.y,26,['#f8e060','#f08020','#e83048','#8a8496','#ffffff'],2.6,3);
  for(const e of enemies.slice())if(Math.hypot(e.x-b.x,e.y-b.y)<30)hitEnemy(e,2,'bomb',Math.sign(e.x-b.x)*3,Math.sign(e.y-b.y)*3);
  for(let dy=-24;dy<=24;dy+=16)for(let dx=-24;dx<=24;dx+=16)cutAt(b.x+dx,b.y+dy);
  if(Math.hypot(p.x-b.x,p.y-b.y)<20)hurt(1,b.x,b.y);
  let opened=false;
  for(const d of cur.dyn)if(d.closed=='%'&&d.flag&&!st.f[d.flag]&&d.cells.some(([x,y])=>Math.hypot(x*TS+8-b.x,y*TS+8-b.y)<32)){st.f[d.flag]=1;opened=true;}
  if(opened){refresh();tune(SECRET);toast('A hidden way opens!');needSave=true;}
}
function reflectNear(x,y,r){
  for(const s of shots){if(s.pl||s.refl)continue;if(Math.abs(s.x-x)<r&&Math.abs(s.y-y)<r)reflect(s);}
}
function reflect(s){s.refl=true;s.life=160;const w=enemies.find(e=>e.type=='wraith');
  if(s.k=='orb'&&w){const a=Math.atan2(w.y-s.y,w.x-s.x),v=Math.hypot(s.vx,s.vy)*1.6;s.vx=Math.cos(a)*v;s.vy=Math.sin(a)*v;}else{s.vx*=-1.3;s.vy*=-1.3;}
  sfx(1100,.06);burst(s.x,s.y,4,['#ffffff'],1.2,2);}

/* ---------- update ---------- */
const keys={up:0,down:0,left:0,right:0,a:0,b:0},press={a:0,b:0,menu:0},hold={up:0,down:0,left:0,right:0};
function updHold(){for(const d in hold)hold[d]=keys[d]?hold[d]+1:0;}
const nav=d=>hold[d]==1||(hold[d]>18&&hold[d]%5==0);
function update(){
  frame++;pollPad();updHold();
  if(st&&st.tut!=null)tutTick();
  if(mode=='play'&&st&&!menu&&!trans){st.clock++;st.time++;wxTick();if(frame%60==0&&!st.rush)checkAch();}
  if(fade>0)fade--;if(bannerT>0)bannerT--;if(toastT>0)toastT--;if(shake>0)shake--;
  if(p&&p.hold&&--p.hold.t<=0)p.hold=null;
  if(mode=='title')titleUpdate();
  else if(mode=='name')nameUpdate();
  else if(mode=='intro')introUpdate();
  else if(mode=='mini')miniUpdate();
  else if(mode=='relight')relightUpdate();
  else if(mode=='credits')creditsUpdate();
  else if(mode=='win'){winT++;if(press.b&&winT>60)shareCard();else if(press.a&&winT>60){credits={y:0};mode='credits';}}
  else if(trans){trans.t++;
    if(trans.fade){if(trans.t==12){load(trans.to);fade=0;p.x=trans.px;p.y=trans.py;settle();updCam();}if(trans.t>=24)trans=null;}
    else if(trans.iris){if(trans.t>=34)trans=null;}
    else if(trans.t>=20)trans=null;}
  else if(menu)menuUpdate();
  else if(shop)shopUpdate();
  else if(dlg)dlgUpdate();
  else if(fish)fishUpdate();
  else if(press.menu){menu={tab:0,cur:Math.max(0,ITEMS.findIndex(i=>i.id==st.eq)),jc:0,jt:0,rd:null};sfx(880,.05);}
  else if(hitstop>0){hitstop--;for(const q of parts)if(q.ring)q.life--;if(hurtT>0)hurtT--;return;}
  else play();
  if(hurtT>0)hurtT--;
  for(const k in press)press[k]=0;
  if(needSave&&mode=='play'&&!trans){needSave=false;save();}
}
function play(){
  for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.x+=q.vx;q.y+=q.vy;q.vx*=.9;q.vy*=.9;if(--q.life<=0)parts.splice(i,1);}
  if(hook){updHook();if(p.inv>0)p.inv--;updCam();return;}
  frogTick();
  if(p.inv>0)p.inv--;
  for(const t of p.trail)t.a-=.1;p.trail=p.trail.filter(t=>t.a>0);
  if(p.kt>0){p.kt--;moveP(p.kx,p.ky);}
  else if(p.dash>0){p.dash--;const ox=p.x,oy=p.y;moveP(DX[p.dir]*3,DY[p.dir]*3);if(frame%2==0)p.trail.push({s:heroSpr().s,x:p.x,y:p.y,a:1});
    if(ox==p.x&&oy==p.y){p.dash=0;shake=4;sfx(120,.08);}
    for(const e of enemies.slice())if(!e.gone&&Math.abs(e.x-p.x)<12&&Math.abs(e.y-p.y)<12)hitEnemy(e,1,'dash',DX[p.dir]*3,DY[p.dir]*3);}
  else if(p.spin>0){p.spin--;
    for(const e of enemies.slice()){const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1;if(d<(e.boss?28:24))hitEnemy(e,2,'spin',dx/d*3,dy/d*3);}
    if(p.spin%4==0)for(let a=0;a<8;a++)cutAt(p.x+Math.cos(a*.785)*16,p.y-2+Math.sin(a*.785)*16);
    reflectNear(p.x,p.y-3,22);}
  else if(p.atk>0){p.atk--;if(p.atk==0&&keys.a){p.charging=true;p.charge=0;}}
  else{
    if(p.charging){if(keys.a){if(p.charge<60&&++p.charge==40)sfx(1200,.08,'triangle');}
      else{if(p.charge>=40){p.spin=22;sfx(500,.25,'sawtooth',.05);}p.charging=false;p.charge=0;}}
    const dx=keys.right-keys.left,dy=keys.down-keys.up;
    if(dx||dy){
      if(!p.charging){if(dx&&!dy)p.dir=dx>0?3:1;else if(dy&&!dx)p.dir=dy>0?0:2;
        else if(!((p.dir==3&&dx>0)||(p.dir==1&&dx<0)||(p.dir==0&&dy>0)||(p.dir==2&&dy<0)))p.dir=dx>0?3:1;}
      if(frame%14==0)footstep();
      const sp0=(st.riding?bikeSpeed():p.charging?.8:onRiver()?1.05:1.3)*(zoom>0?1.25:1),l=Math.hypot(dx,dy),ox=p.x,oy=p.y;moveP(dx/l*sp0,dy/l*sp0);p.moving=true;
      const [fx,fy]=front(8),ft=tileAt(fx,fy);if(ft=='L')tryUnlock(Math.floor(fx/TS),Math.floor(fy/TS),false);
      if(blocks.length&&(!dx||!dy)&&ox==p.x&&oy==p.y)tryPush();else push.n=0;
      if(ft=='~'&&!st.items.kayak&&toastT<=0)toast('Whitewater. You\'d need a boat.');
    }else{p.moving=false;push.n=0;}
    if(press.a){if(!interact()){if(st.riding){st.riding=false;toast('You hop off the bike.');}else{p.atk=14;p.charging=false;sfx(420,.05);}}}
    else if(press.b)useItem();
  }
  if(dlg||shop||menu)return;
  if(p.atk>5){
    const hx=p.x+DX[p.dir]*12,hy=p.y-2+DY[p.dir]*12;
    for(const e of enemies.slice()){const r=e.boss?14:11;
      if(!e.gone&&Math.abs(e.x-hx)<r&&Math.abs(e.y-hy)<r){const res=hitEnemy(e,st.gold?2:1,'paddle',DX[p.dir]*2.5,DY[p.dir]*2.5);
        if(res=='clank'){p.kx=-DX[p.dir]*2;p.ky=-DY[p.dir]*2;p.kt=6;p.atk=0;}
        if(dlg||mode!='play')return;}}
    reflectNear(hx,hy,11);
    if(p.atk==10)cutAt(hx,hy);
  }
  updBlocks();updLife();dogTick();if(warm>0)warm--;if(zoom>0)zoom--;
  if(chal&&chal.t!=null&&--chal.t<=0){chalFail();return;}
  for(const e of enemies.slice())updEnemy(e);
  if(dlg||mode!='play')return;
  for(const e of enemies){if(e.gone||e.type=='arum'||(e.type=='foreman'&&e.state=='stun')||(e.type=='turtle'&&e.state=='stun')||e.stun>0||(e.type=='bell'&&e.z>12))continue;const r=e.type=='turtle'||e.type=='bell'||e.type=='foreman'?13:e.boss?11:9;
    if(Math.abs(e.x-p.x)<r&&Math.abs(e.y-p.y)<r){hurt(e.type=='vampire'||(e.type=='turtle'&&e.state=='charge')||(e.type=='bell'&&e.state=='drop')?2:1,e.x,e.y);if(dlg)return;}}
  for(let i=shots.length-1;i>=0;i--){const s=shots[i];s.x+=s.vx;s.y+=s.vy;s.life--;
    if(s.life<=0||s.x<cam.x-8||s.y<cam.y-8||s.x>cam.x+W+8||s.y>cam.y+PH+8){shots.splice(i,1);continue;}
    if(s.pl||s.refl){
      if(s.pl&&blockedPt(s.x,s.y,BALLSOLID)){burst(s.x,s.y,3,['#ffffff'],1,1);shots.splice(i,1);continue;}
      for(const e of enemies){if(!e.gone&&Math.abs(e.x-s.x)<(e.boss?13:9)&&Math.abs(e.y-4-s.y)<(e.boss?14:10)){
        const r=hitEnemy(e,1,s.refl&&s.k=='orb'?'refl':'shot',s.vx*.6,s.vy*.6);if(r!==false){shots.splice(i,1);break;}}}
      if(dlg||mode!='play')return;
    }else if(Math.abs(s.x-p.x)<7&&Math.abs(s.y-(p.y-4))<8){
      const v=Math.hypot(s.vx,s.vy)||1;
      if(st.shield&&p.atk==0&&!p.spin&&(DX[p.dir]*s.vx+DY[p.dir]*s.vy)/v<-.5)reflect(s);
      else{shots.splice(i,1);hurt(1,s.x,s.y);if(dlg)return;}
    }}
  for(let i=bombs.length-1;i>=0;i--){const b=bombs[i];if(--b.t<=0){bombs.splice(i,1);explode(b);if(dlg)return;}else if(b.t%12==0)sfx(1600-b.t*10,.02,'square',.015);}
  if(bug)updBug();
  for(let i=picks.length-1;i>=0;i--){const k=picks[i];k.life--;
    if(k.life<=0){picks.splice(i,1);continue;}
    if(Math.abs(k.x-p.x)<10&&Math.abs(k.y-p.y)<10){picks.splice(i,1);collect(k);if(dlg)return;}}
  if(!cur.ow&&!cur.bossT&&cur.en.length&&!enemies.length&&!st.f['clr:'+curId]){st.f['clr:'+curId]=1;needSave=true;
    if((cur.chests||[]).some(c=>c.appear&&!st.f['c:'+c.id])&&cur.solve=='clear'){refresh();tune(SECRET);toast('A chest appeared!');burst(128,88,12,['#fff2a8','#ffffff'],2,2);}}
  // doors, stairs, screen edges
  const t=tileAt(p.x,p.y);
  if(t=='D'){const tx=Math.floor(p.x/TS),ty=Math.floor(p.y/TS),d=(cur.doors||[]).find(q=>q.tx==tx&&q.ty==ty);
    const bounce=m=>{p.x=d.ret[0]*TS+8;p.y=d.ret[1]*TS+8;p.dir=0;say(m);};
    if(d){if(d.need=='keystones'&&nKeys()<4)bounce(['The tunnel mouth is sealed. Four hollows in the stone wait for keystones. You have '+nKeys()+'.']);
      else if(d.need=='carkey'&&!st.got.carkey)bounce(['The Carillon door is locked. The caretaker nearby might know where the key went.']);
      else{st.ret=[curId,d.ret[0],d.ret[1]];st.dent=d.to;const intro=d.to=='tunnel:0,1'&&!st.f.tunIntro;irisStart();load(d.to);p.x=128;p.y=8*TS+6;p.dir=2;updCam();
        if(intro){st.f.tunIntro=1;say(['The keystones crumble and the seal splits. Cold air breathes out of the dark.','Rubble chokes the tunnel ahead. Good thing you brought powder.']);}}}}
  else if(t=='E'&&st.ret){const r=st.ret;st.dent=null;irisStart();load(r[0]);p.x=r[1]*TS+8;p.y=r[2]*TS+8;p.dir=0;updCam();}
  else{
    let nx=cur.ax,ny=cur.ay,ox=p.x,oy=p.y,px=p.x,py=p.y;
    if(p.x<3){nx--;px=-1;}else if(p.x>MW()-3){nx++;px=8;}else if(p.y<3){ny--;py=-1;}else if(p.y>MH()-3){ny++;py=8;}
    if(nx!=cur.ax||ny!=cur.ay){const nid=cur.area+':'+nx+','+ny,ns=SC[nid];
      if(ns){if(px<0)px=ns.w*TS-8;if(py<0)py=ns.h*TS-8;
        if(cur.ow){trans={fade:true,t:0,to:nid,px,py};p.x=clamp(p.x,4,MW()-4);p.y=clamp(p.y,4,MH()-4);}
        else{const old=cur.cv[(frame>>4)&3]||cur.cv[0],dx=nx-cur.ax,dy=ny-cur.ay;load(nid);p.x=px;p.y=py;fade=0;trans={old,dx,dy,t:0};}}
      else{p.x=clamp(ox,8,MW()-8);p.y=clamp(oy,8,MH()-8);}}
  }
  updCam();
}
function irisStart(){const old=mkCanvas(W,PH);old.getContext('2d').drawImage(buf,0,HUD,W,PH,0,0,W,PH);trans={iris:true,t:0,old,ox:p.x-cam.x,oy:p.y-cam.y-4};sfx(330,.12,'triangle',.04);}
function settle(){
  if(!blocked(p.x,p.y,5,false,true))return;
  const horiz=p.x<16||p.x>MW()-16;let best=null,bd=1e9;
  for(let k=0;k<(horiz?cur.h:cur.w);k++){const x=horiz?p.x:k*TS+8,y=horiz?k*TS+8:p.y;if(!blocked(x,y,5,false,true)){const d=Math.abs(horiz?y-p.y:x-p.x);if(d<bd){bd=d;best=[x,y];}}}
  if(best){p.x=best[0];p.y=best[1];}
}
function updBug(){
  const b=bug;b.t++;
  if(!b.ret){b.x+=b.vx;b.y+=b.vy;if(b.t>=24||blockedPt(b.x,b.y,BUGSOLID))b.ret=true;}
  else{const dx=p.x-b.x,dy=p.y-4-b.y,d=Math.hypot(dx,dy)||1;if(d<6){bug=null;for(const k of b.carry)collect(k);return;}b.x+=dx/d*4.2;b.y+=dy/d*4.2;}
  for(let i=picks.length-1;i>=0;i--){const k=picks[i];if(Math.abs(k.x-b.x)<9&&Math.abs(k.y-b.y)<9){b.carry.push(k);picks.splice(i,1);b.ret=true;}}
  for(const k of b.carry){k.x=b.x;k.y=b.y+6;}
  for(const e of enemies)if(!e.gone&&!b.hit.has(e)&&Math.abs(e.x-b.x)<10&&Math.abs(e.y-b.y)<10){b.hit.add(e);b.ret=true;
    if(e.boss)sfx(1500,.04);else{e.stun=80;if(e.hp<=1)hitEnemy(e,1,'bug',0,0);}}
  if(frame%6==0)sfx(1800,.02,'square',.01);
}

/* ---------- menus ---------- */
function menuUpdate(){
  const m=menu;
  if(press.menu){menu=null;sfx(600,.05);return;}
  if(m.rd){if(press.a){m.rd.pg++;sfx(700,.03);if(m.rd.pg>=m.rd.pages.length)m.rd=null;}else if(press.b)m.rd=null;return;}
  if(m.big!=null){if(press.a)sharePhoto(PHOTOS[m.big]);if(press.a||press.b)m.big=null;return;}
  if(press.b){m.tab=(m.tab+1)%8;sfx(760,.04);return;}
  if(m.tab==0){
    const NI=ITEMS.length;if(nav('left')){m.cur=(m.cur+NI-1)%NI;sfx(600,.02);}
    if(nav('right')){m.cur=(m.cur+1)%NI;sfx(600,.02);}
    if(nav('up')||nav('down')){m.cur=m.cur<6?Math.min(NI-1,m.cur+6):m.cur-6;sfx(600,.02);}
    if(press.a){const it=ITEMS[m.cur];if(st.items[it.id]){st.eq=it.id;sfx(990,.08,'triangle');needSave=true;}else sfx(150,.06);}
  }else if(m.tab==2){
    const NQ=quests().length;m.qs=m.qs||0;if(nav('down'))m.qs=Math.min(Math.max(0,NQ-13),m.qs+1);if(nav('up'))m.qs=Math.max(0,m.qs-1);
  }else if(m.tab==3){
    const N=LORE.length;
    if(nav('up'))m.jc=(m.jc+N-1)%N;if(nav('down'))m.jc=(m.jc+1)%N;
    if(m.jc<m.jt)m.jt=m.jc;if(m.jc>m.jt+10)m.jt=m.jc-10;
    if(nav('left')){m.tab=2;}else if(nav('right')){m.tab=4;}
    if(press.a){const [id,t,s]=LORE[m.jc];if(st.lore[id]){const ls=wrap(tr(s),28),pages=[];for(let i=0;i<ls.length;i+=10)pages.push(ls.slice(i,i+10));m.rd={t,pages,pg:0};sfx(700,.03);}else sfx(150,.06);}
  }else if(m.tab==4){
    m.cc=m.cc||0;const N=CARDS.length;
    if(nav('left'))m.cc=(m.cc+N-1)%N;if(nav('right'))m.cc=(m.cc+1)%N;if(nav('up'))m.cc=(m.cc+N-4)%N;if(nav('down'))m.cc=(m.cc+4)%N;
    if(press.a){const c=CARDS[m.cc];if(st.cards[c.id]){const ls=wrap(tr(c.fact),28);m.rd={t:c.name,pages:[ls],pg:0};sfx(700,.03);}else sfx(150,.06);}
  }else if(m.tab==5){
    m.pc=m.pc||0;const N=PHOTOS.length;if(nav('left'))m.pc=(m.pc+N-1)%N;if(nav('right'))m.pc=(m.pc+1)%N;if(nav('up'))m.pc=(m.pc+N-5)%N;if(nav('down'))m.pc=(m.pc+5)%N;
    if(press.a&&st.photos&&st.photos[PHOTOS[m.pc].art]){m.big=m.pc;sfx(700,.03);}
  }else if(m.tab==6){
    m.ac=m.ac||0;const N=ACH.length,H=Math.ceil(N/2);
    if(nav('up'))m.ac=(m.ac+N-1)%N;if(nav('down'))m.ac=(m.ac+1)%N;if(nav('left')||nav('right'))m.ac=m.ac<H?Math.min(N-1,m.ac+H):m.ac-H;
  }else if(m.tab==7&&cur.ow){
    if(!m.mc||!SC[m.mc])m.mc=curId;const s0=SC[m.mc];
    for(const [d,dx,dy] of [['left',-1,0],['right',1,0],['up',0,-1],['down',0,1]])if(nav(d)){for(let k=1;k<5;k++){const id='ow:'+(s0.ax+dx*k)+','+(s0.ay+dy*k);if(SHORT[id]&&SC[id]){m.mc=id;sfx(600,.02);break;}}break;}
    if(press.a){if(m.mc==curId)sfx(150,.06);else if(!st.vis[m.mc]){toast('You haven\'t been there yet.');sfx(150,.06);}else busTo(m.mc);}
  }else{
    if(nav('left'))m.tab=(m.tab+7)%8;else if(nav('right'))m.tab=(m.tab+1)%8;
  }
}
function shopUpdate(){
  if(press.b||press.menu){const w=shop.who||'Shopkeeper';shop=null;say(['Come back any time!'],null,w);return;}
  const SL=shop.list||SHOP;if(nav('up'))shop.cur=(shop.cur+SL.length-1)%SL.length;
  if(nav('down'))shop.cur=(shop.cur+1)%SL.length;
  if(press.a){const it=SL[shop.cur],why=it.why();
    if(why){sfx(150,.08);shop.msg=why=='???'?'You\'d need one of those first.':why=='FULL'?'You can\'t carry more.':why=='NO BOTTLE'?'You need a bottle for that.':'That one\'s gone.';}
    else if(st.coins<it.price){sfx(150,.08);shop.msg='Not enough coins.';}
    else{st.coins-=it.price;const r=it.buy();tune([[880,.06],[1175,.12]]);shop.msg=r||'Thank you kindly!';needSave=true;}}
}
let tl={lv:0,saves:[]},capture=null;
function titleInit(){tl={lv:0,saves:[1,2,3].map(n=>readSave(n))};titleSel=Math.max(0,Math.min(2,saveSlot-1));saveData=tl.saves[titleSel];}
function titleOpts(){
  if(tl.lv==0)return tl.saves.map((d,i)=>'SLOT '+(i+1)+'  '+(d?(d.st.name?d.st.name+' ':'')+(d.max/2)+'H '+fmtTime(d.st.time||0):'- EMPTY -')).concat(['IMPORT SAVE CODE','OPTIONS']);
  if(tl.lv==1)return saveData&&saveData.st.f.won?['CONTINUE','NEW GAME+','BOSS RUSH','COPY SAVE CODE','NEW GAME','BACK']:['CONTINUE','COPY SAVE CODE','NEW GAME','BACK'];
  if(tl.lv==2)return['YES, ERASE IT','NO'];
  if(tl.lv==3)return['SOUND: '+(musicOn?'ON':'OFF'),'MUSIC: '+Math.round(OPT.music*100)+'%','EFFECTS: '+Math.round(OPT.sfx*100)+'%','VIBRATION: '+(OPT.haptic===false?'OFF':'ON'),'TIMER: '+(OPT.timer?'ON':'OFF'),'TEXT: '+(OPT.big?'BIG':'NORMAL'),'COLOR ASSIST: '+(OPT.assist?'ON':'OFF'),'CALM MODE: '+(OPT.calm?'ON':'OFF'),'BUTTONS: '+{S:'SMALL',M:'MEDIUM',L:'LARGE'}[OPT.bs],OPT.lang=='es'?'IDIOMA: ESPAÑOL':'LANGUAGE: ENGLISH','CONTROLS','BACK'];
  return ACTS.map(a=>ACTN[a]+'  '+bindName(a)).concat(['RESET KEYS','BACK']);
}
function titleUpdate(){
  if(capture)return;
  const o=titleOpts(),n=o.length;
  if(nav('up'))titleSel=(titleSel+n-1)%n;if(nav('down'))titleSel=(titleSel+1)%n;
  const go=(lv,sel)=>{tl.lv=lv;titleSel=sel||0;sfx(760,.05);};
  if(press.b){if(tl.lv==1||tl.lv==3)go(0,tl.lv==3?4:saveSlot-1);else if(tl.lv==2)go(1,0);else if(tl.lv==4)go(3,10);return;}
  if(!(press.a||press.menu))return;
  const sel=titleSel;
  if(tl.lv==0){if(sel==4){go(3);return;}if(sel==3){importSave();return;}saveSlot=sel+1;saveData=tl.saves[sel];if(saveData)go(1);else{sfx(660,.15,'triangle');startNew();}}
  else if(tl.lv==1){const o2=titleOpts()[sel];
    if(o2=='CONTINUE'){sfx(660,.15,'triangle');continueGame(saveData);}else if(o2=='NEW GAME+'){sfx(660,.15,'triangle');newGamePlus(saveData);}
    else if(o2=='BOSS RUSH'){sfx(660,.15,'triangle');startRush();}else if(o2=='COPY SAVE CODE')exportSave(saveData);else if(o2=='NEW GAME')go(2,1);else go(0,saveSlot-1);}
  else if(tl.lv==2){if(sel==0){sfx(660,.15,'triangle');startNew();}else go(1,0);}
  else if(tl.lv==3){const o=titleOpts()[sel]||'';
    if(sel==0)setSound(!musicOn);
    else if(o.startsWith('MUSIC')){OPT.music=OPT.music>=1?0:Math.round((OPT.music+.2)*10)/10;saveOpt();musicVolume(musicOn);}
    else if(o.startsWith('EFFECTS')){OPT.sfx=OPT.sfx>=1?0:Math.round((OPT.sfx+.2)*10)/10;saveOpt();sfx(880,.08);}
    else if(o.startsWith('VIBRATION')){OPT.haptic=OPT.haptic===false;if(OPT.haptic)buzz(40);saveOpt();}
    else if(o.startsWith('TIMER')){OPT.timer=!OPT.timer;try{localStorage.setItem('rcq-timer',OPT.timer?'1':'0');}catch(e){}saveOpt();}
    else if(o.startsWith('TEXT')){OPT.big=!OPT.big;saveOpt();}else if(o.startsWith('COLOR')){OPT.assist=!OPT.assist;saveOpt();}else if(o.startsWith('CALM')){OPT.calm=!OPT.calm;saveOpt();}
    else if(o.startsWith('BUTTONS')){OPT.bs={S:'M',M:'L',L:'S'}[OPT.bs];saveOpt();}else if(o.startsWith('LANGUAGE')||o.startsWith('IDIOMA')){OPT.lang=OPT.lang=='es'?'en':'es';saveOpt();}
    else if(o=='CONTROLS')go(4);else go(0,4);sfx(880,.05);}
  else{if(sel<ACTS.length){capture=ACTS[sel];sfx(990,.05);}else if(sel==ACTS.length){CUST={};try{localStorage.removeItem('rcq-keys');}catch(e){}sfx(880,.05);}else go(3,10);}
}
