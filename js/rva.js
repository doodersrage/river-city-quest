"use strict";
/* River City Quest: more of Richmond. Arthur Ashe Boulevard, the Raceway, Texas Beach and Agecroft,
   VCU and Court End, the Canal Walk and Brown's Island, the Jefferson Hotel's alligator,
   fireflies on Belle Isle, Riverrock and the Folk Festival, and Richmond food favorites. */

/* ---------- a tiny 3x5 pixel font for signs painted into the map ---------- */
const PXF={A:'010101111101101',B:'110101110101110',C:'011100100100011',E:'111100110100111',F:'111100110100100',H:'101101111101101',I:'111010010010111',K:'101101110101101',
  L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',R:'110101110101101',S:'011100010001110',T:'111010010010010',V:'101101101101010',W:'101101111111101',Y:'101101010010010',"'":'010010000000000',' ':'000000000000000'};
function pxText(str,x,y,c,sc){sc=sc||1;const w=str.length*4*sc-sc;let cx=Math.round(x-w/2);for(const ch of str){const gl=PXF[ch]||PXF[' '];for(let i=0;i<15;i++)if(gl[i]=='1')R(cx+(i%3)*sc,y+Math.floor(i/3)*sc,sc,sc,c);cx+=4*sc;}}

/* ---------- landmark art ---------- */
Object.assign(LMART,{
  scimuseum(x,y,w,h,fr){const cx=x+w/2;R(x,y+18,w,h-18,'#1a1423');R(x+1,y+19,w-2,h-20,'#e4dcc8');for(let i=y+22;i<y+h;i+=5)R(x+1,i,w-2,1,'#c8c0aa');
    g.fillStyle='#1a1423';g.beginPath();g.arc(cx,y+22,30,Math.PI,0);g.fill();g.fillStyle='#7a9aa8';g.beginPath();g.arc(cx,y+22,28,Math.PI,0);g.fill();
    g.fillStyle='#9ab8c4';g.beginPath();g.arc(cx-6,y+18,14,Math.PI,0);g.fill();R(cx-2,y-10,4,6,'#1a1423');R(cx-1,y-9,2,4,'#f2c14e');
    R(x+4,y+24,w-8,4,'#c8c0aa');for(let i=x+10;i<x+w-8;i+=14){R(i,y+28,7,h-34,'#f4f0e4');R(i+5,y+28,2,h-34,'#bcb4a0');}
    R(x+1,y+h-6,w-2,5,'#c8c0aa');R(x+w/2-20,y+30,40,5,'#1a1423');pxText('SCIENCE',x+w/2,y+31,'#f2c14e',1);},
  vmhc(x,y,w,h){R(x,y+6,w,h-6,'#1a1423');R(x+1,y+7,w-2,h-8,'#d8d2c4');for(let i=0;i<8;i++){const ww=Math.round(w*(i+1)/8);R(x+(w-ww)/2,y+i,ww,1,'#1a1423');}
    R(x+2,y+8,w-4,4,'#ece6d8');for(let i=x+8;i<x+w-8;i+=13){R(i,y+12,7,h-18,'#f8f4ea');R(i+5,y+12,2,h-18,'#c8c2b4');}R(x+1,y+h-6,w-2,5,'#bcb6a8');},
  sauers(x,y,w,h,fr){brickWall(x,y+30,w,h-30,'#a85040','#7a3428','#c46a58');R(x,y+30,w,3,'#e8e4dc');for(let i=x+8;i<x+w-10;i+=16)windowAt(i,y+40,9,10,false);
    R(x+6,y+28,2,6,'#3c3a44');R(x+w-8,y+28,2,6,'#3c3a44');R(x+4,y+2,w-8,26,'#1a1423');R(x+5,y+3,w-10,24,'#2a1830');
    const on=(fr>>1)&1;pxText("SAUER'S",x+w/2,y+5,on?'#f8e060':'#c89a30',2);pxText('VANILLA',x+w/2,y+16,on?'#ff9a60':'#b86a40',1);
    R(x+w-20,y+6,6,14,'#1a1423');R(x+w-19,y+8,4,11,on?'#c87a30':'#8a5a24');R(x+w-18,y+6,2,2,'#f4f4f8');},
  ashecenter(x,y,w,h){R(x,y,w,h,'#1a1423');R(x+1,y+1,w-2,h-2,'#3a7ab0');R(x+5,y+5,w-10,h-10,'#e8ecf0');R(x+6,y+6,w-12,h-12,'#3a8ac8');
    R(x+w/2,y+6,1,h-12,'#e8ecf0');R(x+6,y+h/2,w-12,1,'#1a1423');for(let i=x+2;i<x+w-2;i+=4)R(i,y,1,3,'#5a5662');R(x+w/2-16,y+h-10,32,7,'#1a1423');pxText('ASHE',x+w/2,y+h-9,'#f2c14e',1);},
  speedway(x,y,w,h,fr){R(x,y,w,h,'#1a1423');R(x+1,y+1,w-2,h-2,'#58a848');g.fillStyle='#5a5662';g.beginPath();g.ellipse(x+w/2,y+h/2+6,w/2-8,h/2-10,0,0,6.283);g.fill();
    g.fillStyle='#58a848';g.beginPath();g.ellipse(x+w/2,y+h/2+6,w/2-34,h/2-28,0,0,6.283);g.fill();for(let i=0;i<8;i++)R(x+w/2-1,y+h-30+i*2,2,1,i&1?'#1a1423':'#ffffff');
    for(let r=0;r<3;r++){R(x+4,y+4+r*6,w-8,4,r&1?'#c8ccd4':'#e8e4dc');}
    for(let i=0;i<30;i++){const q=HH(i,fr>>1,9);R(x+6+q%(w-12),y+4+((q>>8)%3)*6,2,2,['#e83048','#f2c14e','#3d63c8','#ffffff'][q%4]);}
    for(let k=0;k<3;k++){const a=(fr*.35+k*2.1),ex=x+w/2+Math.cos(a)*(w/2-21),ey=y+h/2+6+Math.sin(a)*(h/2-19);R(ex-3,ey-2,6,4,['#e83048','#3d63c8','#f2c14e'][k]);}},
  agecroft(x,y,w,h,fr){R(x,y+12,w,h-12,'#1a1423');R(x+1,y+13,w-2,h-14,'#efe4c8');for(let i=x+2;i<x+w-2;i+=7){R(i,y+13,2,h-14,'#4a3424');}
    for(let r=y+20;r<y+h;r+=10)R(x+1,r,w-2,2,'#4a3424');for(let k=0;k<3;k++){const gx=x+8+k*((w-16)/2|0);for(let i=0;i<12;i++){const ww=Math.max(2,i*2);R(gx-ww/2,y+i+2,ww,1,i==11?'#1a1423':'#6a3a2a');}}
    for(let i=x+6;i<x+w-12;i+=26){R(i,y+26,14,9,'#1a1423');for(let j=0;j<3;j++)R(i+1+j*5,y+27,4,7,(fr>>1)&1&&j==1?'#f8d868':'#a8c0c8');}},
  siegel(x,y,w,h,fr){R(x,y+8,w,h-8,'#1a1423');R(x+1,y+9,w-2,h-10,'#3a3a44');R(x+1,y+9,w-2,4,'#f2c14e');g.fillStyle='#1a1423';g.beginPath();g.ellipse(x+w/2,y+10,w/2-2,9,0,Math.PI,0);g.fill();
    g.fillStyle='#5a5a66';g.beginPath();g.ellipse(x+w/2,y+10,w/2-4,7,0,Math.PI,0);g.fill();for(let i=x+8;i<x+w-8;i+=14)R(i,y+18,8,10,'#28406a');
    R(x+w/2-22,y+30,44,14,'#1a1423');pxText('RAMS',x+w/2,y+32,(fr>>1)&1?'#f2c14e':'#ffffff',2);},
  marshall(x,y,w,h){brickWall(x,y+8,w,h-8,'#b05a40','#7a3a28','#d07a60');R(x-1,y+2,w+2,7,'#1a1423');R(x,y+3,w,5,'#4a4458');R(x+6,y-2,4,6,'#1a1423');R(x+w-10,y-2,4,6,'#1a1423');
    for(let i=x+8;i<x+w-10;i+=20){windowAt(i,y+14,9,12,false);windowAt(i,y+36,9,12,false);}},
  sallybell(x,y,w,h,fr){brickWall(x,y,w,h,'#e8dcc0','#b4a684','#fbf0d8');R(x,y+18,w,8,'#1a1423');for(let i=x+1;i<x+w-1;i+=6)R(i,y+19,3,6,'#d87878');R(x+3,y+4,w-6,11,'#1a1423');
    pxText('SALLY BELL',x+w/2,y+5,'#fff2a8',1);R(x+8,y+h-24,w-16,22,'#28406a');for(let i=0;i<3;i++){R(x+12+i*12,y+h-16,8,6,'#f4f0e4');R(x+12+i*12,y+h-13,8,1,'#d87878');}},
  armory(x,y,w,h,fr){brickWall(x,y+8,w,h-8,'#a85040','#7a3428','#c46a58');for(let i=x;i<x+w;i+=12){R(i,y+2,8,7,'#1a1423');R(i+1,y+3,6,6,'#a85040');}
    R(x+w/2-10,y-6,20,16,'#1a1423');brickWall(x+w/2-9,y-5,18,15,'#a85040','#7a3428','#c46a58');for(let i=x+w/2-9;i<x+w/2+9;i+=6)R(i,y-9,4,4,'#a85040');
    for(let i=x+8;i<x+w-12;i+=30)windowAt(i,y+22,8,14,(fr>>1)&1);},
  stage(x,y,w,h,fr){R(x,y,w,h,'#1a1423');R(x+1,y+h-14,w-2,13,'#6a4a30');R(x+1,y+h-14,w-2,2,'#8a6a44');R(x+2,y+1,4,h-15,'#3c3a44');R(x+w-6,y+1,4,h-15,'#3c3a44');R(x+2,y+1,w-4,4,'#3c3a44');
    R(x+8,y+5,w-16,h-20,'#14101e');pxText("BROWN'S ISLAND",x+w/2,y+h-10,'#f2c14e',1);}
});
Object.assign(PHOTOCAP,{scimuseum:'The Science Museum in old Broad Street Station',vmhc:'The Virginia Museum of History & Culture',sauers:"The Sauer's vanilla sign",
  ashecenter:'The tennis courts on Arthur Ashe Boulevard',speedway:'Richmond Raceway',agecroft:'Agecroft Hall, shipped from England',siegel:'The Siegel Center, home of the Rams',
  marshall:'The John Marshall House',sallybell:"Sally Bell's Kitchen",armory:'The Leigh Street Armory',stage:"The stage on Brown's Island"});
for(const id in SC){const s=SC[id];if(!s.ow)continue;for(const L of s.lm||[])if(PHOTOCAP[L.art]&&!PHOTOS.some(q=>q.art==L.art))PHOTOS.push({id,art:L.art,L});}

/* ---------- food ---------- */
Object.assign(FOODS,{cookie:['Rainbow Cookie',2,'Three colored layers and chocolate on top.'],lunch:["Sally Bell's Box Lunch",8,'A sandwich, potato salad, a deviled egg, a cheese wafer and a cupcake.']});
const SALLY=[
  {name:'Box Lunch',price:6,why:()=>!st.items.basket?'???':'',buy(){st.food=st.food||{};st.food.lunch=(st.food.lunch||0)+1;learn('sallybell');return'Tied up with string, right into the basket.';}},
  {name:'Cupcake',price:4,why:()=>!st.items.basket?'???':'',buy(){st.food=st.food||{};st.food.cupcake=(st.food.cupcake||0)+1;return'In the basket it goes.';}}];
MARKET.push({name:'Rainbow Cookie',price:3,why:()=>!st.items.basket?'???':'',buy(){st.food=st.food||{};st.food.cookie=(st.food.cookie||0)+1;learn('ukrops');return'Just like the old Ukrop\'s bakery made them.';}},
  {name:'Hanover Tomato',price:2,why:()=>season()=='summer'?'':'SUMMER',buy(){st.ingr=st.ingr||{};st.ingr.tomato=(st.ingr.tomato||0)+1;learn('hanover');return'A Hanover tomato. You have '+st.ingr.tomato+'.';}});

/* ---------- people ---------- */
const askPlay=(n,lines,kind,yes)=>{say(lines,sel=>{if(sel==0)startMini(kind);},n.who,[yes,'Not now']);return null;};
TALK.tennis=n=>askPlay(n,['Arthur Ashe learned on courts a lot like these. Want to rally against the ball machine?','Move left and right, and press A when the ball reaches you. Miss three and you\'re done.'+(st.mini&&st.mini.tennis?' Your best: '+st.mini.tennis+' returns.':'')],'tennis','Let\'s rally!');
TALK.hoops=n=>askPlay(n,['Ten free throws. Press A when the needle hits the middle of the meter.','Make eight and you\'ve got Havoc in your blood.'+(st.mini&&st.mini.hoops!=null?' Your best: '+st.mini.hoops+' of 10.':'')],'hoops','Shoot!');
TALK.racedir=n=>askPlay(n,['Want a few laps around the Action Track? Dodge the slow cars and the oil.','Beat '+fmtTime(MINI.race.gold*60)+' for gold.'+(st.mini&&st.mini.race?' Your best: '+fmtTime(st.mini.race)+'.':'')],'race','Start your engine!');
TALK.sallybell=n=>{if(!st.items.basket)return['Box lunches, made fresh every morning since the 1920s.','You\'ll want a picnic basket to carry one. The 17th Street Market sells them.'];
  learn('sallybell');shop={cur:0,msg:'Fresh this morning!',list:SALLY,title:"SALLY BELL'S KITCHEN",who:"Sally Bell's Kitchen"};return null;};
TALK.sciguide=n=>{n.li=(n.li||0)+1;return[['Before this was a museum, it was Broad Street Station. Thousands of travelers a day passed under this dome.','Look at the cases. Every exhibit is something you can poke, spin or climb.'],
  ['Our Dome theater shows the night sky. Out in the fog, it\'s the only place in town you can still see stars.','Have you seen the Sauer\'s sign across Broad? Its little bottle blinks all night.']][(n.li-1)%2];};
TALK.bellhop=n=>{if(!st.f.gator){st.f.gator=1;needSave=true;return['Welcome to the Jefferson! Mind the fountain.','Real alligators lived in these pools until 1948. Ever since the fog rolled in, guests swear one is back.','Between you and me? They\'re right.'];}
  return['Old Pompey, we call him. He seems happy. He doesn\'t eat guests.','Mostly he just likes the warm marble.'];};
TALK.festival=n=>{const ev=events(),y=today().getFullYear(),k='fest'+y+(ev.includes('folk')?'f':'r');
  if(ev.includes('folk')||ev.includes('riverrock')){if(!st.f[k]){st.f[k]=1;st.coins=Math.min(999,st.coins+30);tune(JING);needSave=true;return[ev.includes('folk')?'Welcome to the Richmond Folk Festival!':'Welcome to Dominion Riverrock!',ev.includes('folk')?'Bands from all over the world, right here on Brown\'s Island. And it\'s free!':'Climbing, kayaking, dogs leaping into pools, and bands at night.','Here, festival money. 30 coins. Go get a funnel cake.'];}
    return[ev.includes('folk')?'Enjoy the Folk Festival!':'Enjoy Riverrock!','The stage runs till late. Listen for it all over downtown.'];}
  return['Brown\'s Island is quiet today. Come back in May for Dominion Riverrock, or in October for the Richmond Folk Festival.','Either way, there\'s a present in it for you.'];};
addNpc('ow:3,1',{who:'Tomato Farmer',hat:C3('#e8d28a','#b09a54','#fff0b8'),shirt:C3('#e83048','#a81c30','#f890a0'),talk:'tomato'},8,17);
TALK.tomato=n=>{learn('hanover');if(events().includes('tomato')){if(!st.f['tomfest'+today().getFullYear()]){st.f['tomfest'+today().getFullYear()]=1;st.ingr=st.ingr||{};st.ingr.tomato=(st.ingr.tomato||0)+3;tune(JING);needSave=true;
    return['It\'s tomato festival month! Hanover tomatoes, the best in the world.','Take three, on the house. Brunswick stew needs a tomato.'];}return['Enjoy those tomatoes!','Salt, pepper, white bread and mayo. That\'s all a Hanover tomato needs.'];}
  return['Hanover tomatoes come in July. You\'ve never had one? You\'ve never had a tomato.','In summer the Market Grocer sells them too.'];};

/* ---------- seasonal events ---------- */
const _events=events;
events=function(){const e=_events(),d=today(),m=d.getMonth();if(m==4)e.push('riverrock');if(m==6)e.push('tomato');return e;};
const _seasonOnLoad=seasonOnLoad;
seasonOnLoad=function(){_seasonOnLoad();const ev=events(),y=today().getFullYear();
  if(curId=='ow:4,1'&&(ev.includes('folk')||ev.includes('riverrock'))&&!st.f['evfest'+y]){st.f['evfest'+y]=1;toast(ev.includes('folk')?'The Folk Festival is on! Find the host by the stage.':'It\'s Dominion Riverrock! Find the host by the stage.');}
  if(curId=='ow:3,1'&&ev.includes('tomato')&&!st.f['evtom'+y]){st.f['evtom'+y]=1;toast('Hanover tomatoes are in! Talk to the tomato farmer.');}
  ffReset();};

/* ---------- fireflies on Belle Isle and Texas Beach ---------- */
let ffly=[],ffN=0;
function ffReset(){ffly=[];ffN=0;}
function ffTick(){if(!cur||!cur.ow||(curId!='ow:2,2'&&curId!='ow:-1,2')||dark()<.6||season()=='winter'){if(ffly.length)ffly=[];return;}
  while(ffly.length<12){let x,y,k=0;do{x=rnd(cur.w)*TS+8;y=rnd(cur.h)*TS+8;}while(k++<30&&(SOLID.includes(tileAt(x,y))||tileAt(x,y)=='~'));ffly.push({x,y,a:Math.random()*6.28,t:rnd(200)});}
  for(let i=ffly.length-1;i>=0;i--){const f=ffly[i];f.t++;f.a+=(Math.random()-.5)*.3;f.x+=Math.cos(f.a)*.35;f.y+=Math.sin(f.a)*.35;
    if(Math.hypot(f.x-p.x,f.y-p.y-6)<9){ffly.splice(i,1);ffN++;sfx(1500+ffN*40,.04,'triangle',.02);burst(f.x,f.y,4,['#f8f070','#ffffff'],.6,1);
      if(ffN>=10&&!st.f.firefly){st.f.firefly=1;needSave=true;tune(JING);toast('Ten fireflies! You let them all go.');}else toast('Firefly! ('+ffN+')');}}}
function drawFireflies(){for(const f of ffly){const on=Math.sin(f.t*.12)>0;if(!on)continue;g.globalAlpha=.35;R(Math.round(f.x)-2,Math.round(f.y)-2,5,5,'#f8f070');g.globalAlpha=1;R(Math.round(f.x),Math.round(f.y),1,1,'#ffffa8');}}

/* ---------- the Jefferson Hotel alligator and festival crowds ---------- */
function drawGator(){const t=frame*.02,x=Math.round(128+Math.sin(t)*20),y=64+Math.round(Math.sin(t*2.3)*3),f=Math.cos(t)>0?1:-1;
  g.globalAlpha=.85;R(x-10,y-2,20,5,'#2f6a3a');R(x-8,y-3,16,1,'#3d8a4a');for(let i=-7;i<8;i+=3)R(x+i,y-4,1,1,'#2a5a32');
  R(x+f*10-(f<0?6:0),y-1,6,3,'#2f6a3a');R(x+f*12-(f<0?1:0),y-2,1,1,'#f8e060');R(x-f*10-(f>0?5:0),y,5,2,'#2a5a32');g.globalAlpha=1;}
let crowd=null;
function crowdFor(){if(curId!='ow:4,1')return null;const ev=events();if(!ev.includes('folk')&&!ev.includes('riverrock'))return null;
  if(!crowd){crowd=[];[[19,16],[20,16.4],[21,16],[25,16.3],[26,16],[27,16.4],[18,16.6],[28,16.6]].forEach(([tx,ty],i)=>{const f=FOLKC[i%FOLKC.length];crowd.push({x:tx*TS+8,y:Math.round(ty*TS)+8,spr:npcSpr({who:'Fan'+i,hx:i,hy:i,hat:f[0],shirt:f[1]})});});}return crowd;}
function rvaActs(act){if(curId=='jefferson:0,0')act.push([60,drawGator]);if(curId=='siegel:0,0')act.unshift([-1,drawCourt]);if(ffly.length)act.push([9999,drawFireflies]);
  const c=crowdFor();if(c)act.push([13*TS,drawBand]);if(c)for(const q of c)act.push([q.y,()=>{const b=(frame>>3)&1;D(q.spr.up.r,q.x-8,q.y-11-b);}]);
  if(c&&frame%30==0)parts.push({x:23*TS+Math.random()*60-30,y:13*TS,vx:(Math.random()-.5)*.3,vy:-.3,life:70,max:70,c:['#f8e060','#ffffff','#f890a0'][rnd(3)],s:2});}
function rvaTick(){ffTick();}
function drawCourt(){const c='#f2c14e';R(16,88,224,1,c);g.strokeStyle=c;g.lineWidth=1;g.beginPath();g.arc(128,88.5,18,0,6.283);g.stroke();R(104,104,48,1,c);R(104,104,1,40,c);R(151,104,1,40,c);
  g.beginPath();g.arc(128,104.5,14,Math.PI,0);g.stroke();R(116,34,24,2,'#1a1423');R(120,36,16,12,'#ffffff');R(124,40,8,6,'#e83048');R(125,41,6,4,'#ffffff');pxText('RAMS',128,94,'#1a1a24',2);}
function drawBand(){const x=19*TS,y=13*TS,w=10*TS,h=3*TS,ev=events();R(x+8,y+5,w-16,h-20,'#2a1a4a');
  for(let k=0;k<5;k++)R(x+12+k*((w-24)/4|0),y+6,3,3,(k+(frame>>4))%2?'#fff2a8':'#f890a0');
  for(let k=0;k<3;k++){const bx=x+30+k*((w-60)/2|0),b=((frame>>4)+k)&1;R(bx-3,y+h-26-b,6,10,['#e83048','#3ac2e8','#f2c14e'][k]);R(bx-2,y+h-30-b,4,4,'#f2c698');}
  R(x+w/2-34,y+h-13,68,8,'#6a4a30');pxText(ev.includes('riverrock')?'RIVERROCK':'FOLK FEST',x+w/2,y+h-12,'#f2c14e',1);}

/* ---------- mini-game: Rams free throws ---------- */
MINI.hoops={name:'Rams Free Throws',award:'havoc',
  upd(m){if(m.n==null)Object.assign(m,{n:0,made:0,ph:0,sp:.05,ball:null,msg:'Press A when the needle is centered'});
    if(m.ball){const b=m.ball;b.t++;const k=b.t/b.T;b.x=b.x0+(b.x1-b.x0)*k;b.y=b.y0+(b.y1-b.y0)*k-Math.sin(Math.min(1,k)*Math.PI)*70;
      if(b.t==b.T){if(b.res!='miss'){m.made++;tune([[784,.05],[988,.08]],'triangle');buzz(20);}else sfx(160,.12);m.msg=b.res=='swish'?'Swish!':b.res=='rim'?'In off the rim!':'Clank. Missed.';}
      if(b.t>b.T+30){m.ball=null;m.n++;m.sp=.05+m.n*.008;}return;}
    if(m.n>=10){if(!m.done){m.done=true;const coins=m.made*2;st.coins=Math.min(999,st.coins+coins);const nb=miniBest('hoops',m.made);if(m.made>=8)st.f.havoc=1;
      endMini([m.made+' of 10 from the line.','The coach tosses you '+coins+' coins.'+(nb?' Your best yet!':'')+(m.made>=8?' That\'s Havoc!':'')]);}return;}
    m.ph+=m.sp;if(press.a){const off=Math.sin(m.ph)*50,ad=Math.abs(off),res=ad<7?'swish':ad<15?(Math.random()<.6?'rim':'miss'):'miss';
      m.ball={x0:128,y0:150,x1:128+(res=='miss'?(off<0?-14:14):0),y1:56,x:128,y:150,t:0,T:40,res};sfx(400,.05);}},
  draw(m){R(0,0,W,FH,'#c89a5a');for(let x=0;x<W;x+=12)R(x,0,1,FH,'#b0844a');R(0,0,W,30,'#1a1a24');for(let i=0;i<W;i+=6)R(i,10+(i%12?0:3),4,10,['#f2c14e','#3a3a44','#ffffff'][(i/6)%3|0]);
    R(98,34,60,40,'#ffffff');R(100,36,56,36,'#e8ecf0');R(118,50,20,14,'#ffffff');R(119,51,18,12,'#e83048');R(120,52,16,10,'#e8ecf0');R(116,64,24,3,'#e83048');for(let i=0;i<6;i++)R(118+i*4,67,2,8,'#f4f4f8');
    g.strokeStyle='#ffffff';g.lineWidth=2;g.beginPath();g.ellipse(128,170,60,26,0,Math.PI,0);g.stroke();R(68,168,120,2,'#ffffff');
    g.drawImage(HERO.up[0].r.c,120,150);const b=m.ball;if(b){R(Math.round(b.x)-3,Math.round(b.y)-3,7,7,'#1a1423');R(Math.round(b.x)-2,Math.round(b.y)-2,5,5,'#e07a28');R(Math.round(b.x)-2,Math.round(b.y),5,1,'#1a1423');}
    if(!b&&m.n<10){R(68,96,120,10,'#1a1423');R(69,97,118,8,'#3a3a44');R(122,97,12,8,'#58c868');R(112,97,10,8,'#f2c14e');R(134,97,10,8,'#f2c14e');R(Math.round(128+Math.sin(m.ph)*50)-1,93,3,16,'#ffffff');}
    text('Shot '+Math.min(10,(m.n||0)+1)+'/10   Made '+(m.made||0),W/2,4,'#fff2a8',8,'center','#080c28');text('A: shoot   MENU: quit',W/2,FH-22,'#e8ecf8',6,'center','#080c28');}};

/* ---------- mini-game: tennis at the Ashe Center ---------- */
MINI.tennis={name:'Ashe Center Tennis',award:'ace',
  upd(m){if(m.x==null)Object.assign(m,{x:128,ball:null,wait:50,ret:0,miss:0,sw:0,msg:'Left and right to move, A to swing'});
    m.x=Math.max(40,Math.min(216,m.x+(keys.right-keys.left)*2.2));if(m.sw>0)m.sw--;if(press.a&&m.sw==0){m.sw=14;sfx(260,.05,'square',.02);}
    if(m.miss>=3){if(!m.done){m.done=true;const coins=m.ret;st.coins=Math.min(999,st.coins+coins);const nb=miniBest('tennis',m.ret);if(m.ret>=15)st.f.ace=1;
      endMini([m.ret+' returns before three misses.','The coach hands you '+coins+' coins.'+(nb?' A new best!':'')+(m.ret>=15?' Arthur Ashe would be proud.':'')]);}return;}
    if(!m.ball){if(--m.wait<=0){const sp=1.6+Math.min(2.2,m.ret*.09),tx=50+rnd(156);m.ball={x:128,y:40,vx:(tx-128)/((150-40)/sp),vy:sp,up:false};sfx(500,.04);}return;}
    const b=m.ball;b.x+=b.vx;b.y+=b.vy;if(b.x<30||b.x>226)b.vx=-b.vx;
    if(!b.up&&m.sw>6&&Math.abs(b.y-150)<12&&Math.abs(b.x-m.x)<18){b.up=true;b.vy=-3.2;b.vx=(b.x-m.x)*.12;m.ret++;tune([[880,.04]],'square');m.msg='Return '+m.ret+'!';buzz(15);}
    if(b.up&&b.y<34){m.ball=null;m.wait=30;}
    if(!b.up&&b.y>FH-20){m.ball=null;m.wait=50;m.miss++;sfx(150,.15);m.msg='Missed! ('+(3-m.miss)+' left)';}},
  draw(m){R(0,0,W,FH,'#3a7ab0');R(28,26,200,FH-40,'#3a8ac8');R(28,26,200,2,'#ffffff');R(28,FH-16,200,2,'#ffffff');R(28,26,2,FH-40,'#ffffff');R(226,26,2,FH-40,'#ffffff');
    R(28,100,200,3,'#1a1423');for(let i=30;i<226;i+=4)R(i,99,2,1,'#e8ecf0');R(127,26,2,74,'#ffffff');R(60,60,136,1,'#ffffff');
    R(118,28,20,10,'#1a1423');R(119,29,18,8,'#5a5662');R(126,36,4,4,'#3a3a44');
    const b=m.ball;if(b){R(Math.round(b.x)-2,Math.round(b.y)+4,4,2,'rgba(10,8,24,.3)');R(Math.round(b.x)-2,Math.round(b.y)-2,5,5,'#1a1423');R(Math.round(b.x)-1,Math.round(b.y)-1,3,3,'#d8f060');}
    const px=Math.round(m.x||128);g.drawImage(HERO.up[0].r.c,px-8,142);const a=m.sw>0?(-2.6+(14-m.sw)*.3):-2.2;for(let r=4;r<14;r++)R(Math.round(px+4+Math.cos(a)*r),Math.round(150+Math.sin(a)*r),2,2,r>9?'#e8ecf0':'#5a5662');
    text('Returns '+(m.ret||0)+'   Misses '+(m.miss||0)+'/3',W/2,4,'#fff2a8',8,'center','#080c28');text('A: swing   MENU: quit',W/2,FH-22,'#e8ecf8',6,'center','#080c28');}};

/* ---------- the Raceway dash draws its own track ---------- */
function drawRace(m){R(0,0,W,FH,'#58a848');const off=Math.floor(m.y);
  R(0,0,48,FH,'#c8ccd4');for(let y=-(off%10);y<FH;y+=10)for(let i=0;i<5;i++){const q=HH(i,(y+off)/10|0,3);R(4+i*9,y+2,3,3,['#e83048','#f2c14e','#3d63c8','#ffffff'][q%4]);}R(48,0,6,FH,'#ffffff');
  R(54,0,152,FH,'#4a4a54');R(206,0,6,FH,'#e83048');for(let y=-(off%16);y<FH;y+=16)R(206,y,6,8,'#ffffff');R(212,0,44,FH,'#58a848');
  for(let y=-(off%24);y<FH;y+=24){R(104,y,2,12,'#e8e4dc');R(154,y,2,12,'#e8e4dc');}
  const fy=Math.round(m.len-m.y+138);if(fy>-10&&fy<FH)for(let i=0;i<19;i++)for(let j=0;j<2;j++)R(54+i*8,fy+j*4,4,4,(i+j)&1?'#ffffff':'#1a1423'),R(58+i*8,fy+j*4,4,4,(i+j)&1?'#1a1423':'#ffffff');
  for(const o of m.obs){const y=Math.round(o.y-m.y);if(y<-20||y>FH+10)continue;const x=Math.round(o.x);
    if(o.k=='car'){const c=['#3d63c8','#f2c14e','#34c8b0','#b890f8'][Math.round(o.x)%4];R(x-7,y-10,14,20,'#1a1423');R(x-6,y-9,12,18,c);R(x-4,y-6,8,5,'#a8c8e0');R(x-6,y-1,12,2,'#ffffff');}
    else{g.globalAlpha=.75;R(x-11,y-4,22,8,'#14101e');g.globalAlpha=1;R(x-5,y-2,5,1,'#5a3a8a');}}
  const cx=Math.round(m.x),cy=138+(m.bump>0&&(m.t>>1)&1?1:0);R(cx-8,cy-11,16,22,'#1a1423');R(cx-7,cy-10,14,20,'#e83048');R(cx-5,cy-7,10,5,'#a8c8e0');R(cx-7,cy+1,14,2,'#ffffff');R(cx-1,cy+3,2,5,'#ffffff');
  const pct=Math.min(1,m.y/m.len);R(244,30,6,140,'#1a1423');R(245,31+Math.round(138*(1-pct)),4,Math.round(138*pct),'#f2c14e');
  text(fmtTime(m.time),10,6,'#fff2a8',8,'left','#080c28');text('RICHMOND RACEWAY',W-14,6,'#ffffff',8,'right','#080c28');}

/* ---------- awards ---------- */
ACH.push(['ace','Ace','Return 15 shots at the Ashe Center',()=>st.f.ace],['havoc','Havoc','Make 8 of 10 free throws for the Rams',()=>st.f.havoc],
  ['flag','Checkered Flag','Win gold at Richmond Raceway',()=>st.f.raceGold],['firefly','Firefly Night','Catch 10 fireflies in one night',()=>st.f.firefly],
  ['gator','Gator Tale','Hear about the Jefferson alligator',()=>st.f.gator]);
