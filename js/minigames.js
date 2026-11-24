"use strict";
/* River City Quest: mini-games. Batting practice at The Diamond, pinball in the Stone House arcade,
   and a soapbox derby down Libby Hill. Each runs full screen in mode 'mini'. */
let mini=null;
const MINI={
  bat:{name:'Batting Practice',award:'slugger'},
  pin:{name:'Stone House Pinball',award:'wizard'},
  derby:{name:'Libby Hill Soapbox Derby',award:'derby',gold:15.5,silver:19},
  trail:{name:'Capital Trail Time Trial',award:'trail',gold:21,silver:26,who:'The cyclist',flag:'trailGold',label:'CAPITAL TRAIL'},
  race:{name:'Richmond Raceway Dash',award:'flag',gold:14.5,silver:18,who:'The race official',flag:'raceGold',label:'RICHMOND RACEWAY'}};
MINI.derby.who='The Derby Kid';MINI.derby.flag='derbyGold';MINI.derby.label='LIBBY HILL';
function startMini(kind){mini={kind,t:0,done:false};mode='mini';sfx(880,.08,'triangle');
  if(kind=='bat')Object.assign(mini,{n:0,hits:0,hr:0,ball:null,swing:0,msg:'Press A to swing',wait:60,log:[]});
  if(kind=='pin')Object.assign(mini,{balls:3,score:0,ball:null,fl:[0,0],flv:[0,0],launch:40,bumps:[[92,60,9],[164,60,9],[128,92,10],[60,104,7],[196,104,7]],lit:[0,0,0,0,0],msg:'',still:0});
  if(kind=='derby'||kind=='trail'||kind=='race'){const tr=kind=='trail',rc=kind=='race',L=tr?4200:rc?3900:3100,obs=[];for(let y=260;y<L-100;y+=(tr?80:rc?70:90)+rnd(70)){const k=rnd(4);obs.push({x:76+rnd(100),y,k:tr?['goose','jogger','puddle','goose'][k]:rc?['car','car','oil','car'][k]:['hay','cone','puddle','hay'][k],hit:false,v:rc&&k!=2?1.2+Math.random()*1.4:0});}
    Object.assign(mini,{x:128,v:0,y:0,obs,time:0,bump:0,len:L,msg:'Steer with left and right'});}}
function endMini(lines){const k=mini.kind;mini=null;mode='play';if(lines&&lines.length)say(lines,null,MINI[k].name);needSave=true;}
function miniUpdate(){const m=mini;m.t++;
  if(press.menu){endMini(['You walk away from the game.']);return;}
  if(MINI[m.kind].upd)MINI[m.kind].upd(m);else if(m.kind=='bat')batUpdate(m);else if(m.kind=='pin')pinUpdate(m);else derbyUpdate(m);}
function drawMiniGame(){const m=mini;if(MINI[m.kind].draw)MINI[m.kind].draw(m);else if(m.kind=='race')drawRace(m);else if(m.kind=='bat')drawBat(m);else if(m.kind=='pin')drawPin(m);else if(m.kind=='trail')drawTrail(m);else drawDerby(m);
  if(m.msg)text(m.msg,W/2,FH-12,'#ffffff',6,'center','#080c28');}
function miniBest(k,v,lowerBetter){st.mini=st.mini||{};const b=st.mini[k];if(b==null||(lowerBetter?v<b:v>b)){st.mini[k]=v;return true;}return false;}

/* ---- batting practice: time your swing as the pitch crosses the plate ---- */
const PLATE=166;
function batUpdate(m){
  if(m.swing>0)m.swing--;
  if(!m.ball){if(m.n>=10){if(!m.done){m.done=true;const coins=m.hits*2+m.hr*5;st.coins=Math.min(999,st.coins+coins);const nb=miniBest('bat',m.hits+m.hr);
        if(m.hr>=3)st.f.slugger=1;endMini(['Ten pitches: '+m.hits+' hits, '+m.hr+' home runs.','The coach slips you '+coins+' coins.'+(nb?' That\'s your best round yet!':'')]);}return;}
    if(--m.wait<=0){const sp=1.6+Math.random()*1.6,curve=(Math.random()-.5)*.5;m.ball={x:128,y:58,vy:sp,vx:curve,arr:Math.round((PLATE-58)/sp),age:0,res:null};sfx(300,.05);m.msg='Pitch '+(m.n+1)+' of 10';}return;}
  const b=m.ball;b.age++;
  if(!b.res){b.y+=b.vy;b.x+=b.vx;b.vx*=.99;
    if(press.a&&m.swing==0){m.swing=12;const d=b.age-b.arr;sfx(220,.06,'sawtooth',.03);
      const ad=Math.abs(d);b.res=ad<=2?'hr':ad<=5?'hit':ad<=8?'foul':'miss';
      if(b.res=='hr'){m.hr++;m.hits++;b.vy=-6;b.vx=(Math.random()-.5)*2;tune([[784,.06],[988,.06],[1319,.14]],'triangle');m.msg='HOME RUN!';shake=8;buzz(60);}
      else if(b.res=='hit'){m.hits++;b.vy=-4;b.vx=(d<0?-1:1)*(1.5+Math.random()*2);sfx(900,.1,'square',.04);m.msg='Base hit!';buzz(30);}
      else if(b.res=='foul'){b.vy=-2.5;b.vx=(d<0?-3:3);sfx(500,.08);m.msg=d<0?'Foul, too early':'Foul, too late';}
      else{m.msg=d<0?'Swing and a miss! Too early.':'Swing and a miss! Too late.';b.res='miss';}}
    if(b.y>PLATE+18&&!b.res){b.res='miss';m.msg='Strike! You watched it go by.';sfx(160,.1);}}
  else{b.x+=b.vx;b.y+=b.vy;if(b.res!='miss')b.vy+=.04;}
  if(b.res&&(b.y<-10||b.y>FH+10||b.age>b.arr+70)){m.log.push(b.res);m.ball=null;m.n++;m.wait=50;}
}
function drawBat(m){
  R(0,0,W,FH,'#3a7a3a');for(let y=0;y<FH;y+=10)R(0,y,W,5,'#428a42');
  g.fillStyle='#b8875a';g.beginPath();g.moveTo(128,40);g.lineTo(236,130);g.lineTo(128,FH+40);g.lineTo(20,130);g.closePath();g.fill();
  g.fillStyle='#3a7a3a';g.beginPath();g.moveTo(128,62);g.lineTo(206,130);g.lineTo(128,190);g.lineTo(50,130);g.closePath();g.fill();
  R(124,56,8,4,'#f4f4f8');R(122,PLATE+4,12,5,'#f4f4f8');R(124,PLATE+9,8,2,'#f4f4f8');
  R(0,0,W,26,'#1e3a5e');for(let i=0;i<W;i+=6)R(i,20+(i%12?0:2),4,6,'#2a4a6e');
  const pit=HERO.down[(m.t>>4)&1].r.c;g.drawImage(pit,120,32);
  const b=m.ball;if(b){const s=Math.max(2,Math.round(2+b.y/60));R(Math.round(b.x)-s/2,Math.round(b.y)+6,s,2,'rgba(10,8,24,.3)');R(Math.round(b.x)-s/2,Math.round(b.y)-s/2,s,s,'#ffffff');}
  const hx=150,hy=PLATE-6;g.drawImage(HERO.up[0].r.c,hx-8,hy-6);
  const a=m.swing>0?(-2.2+(12-m.swing)*.35):-2.4;for(let r=4;r<18;r++)R(Math.round(hx-4+Math.cos(a)*r),Math.round(hy+Math.sin(a)*r),2,2,r>13?'#f0dc98':'#c9a26b');
  text('Pitch '+Math.min(10,m.n+1)+'/10   Hits '+m.hits+'   HR '+m.hr,W/2,4,'#fff2a8',8,'center','#080c28');
  text('A: swing   MENU: quit',W/2,FH-22,'#e8ecf8',6,'center','#080c28');
}

/* ---- pinball: B is the left flipper, A the right ---- */
const PFL=[{x:96,y:178,dir:1},{x:160,y:178,dir:-1}],PFLEN=26;
function flipSeg(i,m){const f=PFL[i],a=(f.dir>0?.45:Math.PI-.45)-f.dir*m.fl[i]*.9;return[f.x,f.y,f.x+Math.cos(a)*PFLEN,f.y+Math.sin(a)*PFLEN];}
function pinUpdate(m){
  for(let i=0;i<2;i++){const on=i==0?keys.b:keys.a,prev=m.fl[i];m.fl[i]=Math.max(0,Math.min(1,m.fl[i]+(on?.35:-.18)));m.flv[i]=m.fl[i]-prev;if(on&&prev==0)sfx(300,.04,'square',.02);}
  if(!m.ball){if(m.balls<=0){if(!m.done){m.done=true;const coins=Math.floor(m.score/500);st.coins=Math.min(999,st.coins+coins);const nb=miniBest('pin',m.score);
      endMini(['Game over! Score: '+m.score+'.','The machine spits out '+coins+' coins.'+(nb?' New high score!':'')]);}return;}
    if(--m.launch<=0){m.ball={x:236,y:40,vx:-1.6-Math.random(),vy:.5};sfx(500,.12,'sawtooth',.03);m.msg='Ball '+(4-m.balls)+' of 3';}return;}
  const b=m.ball;for(let step=0;step<2;step++){
    b.vy+=.045;b.x+=b.vx/2;b.y+=b.vy/2;const sp=Math.hypot(b.vx,b.vy);if(sp>7){b.vx*=7/sp;b.vy*=7/sp;}
    if(b.x<22){b.x=22;b.vx=Math.abs(b.vx)*.8;}if(b.x>244){b.x=244;b.vx=-Math.abs(b.vx)*.8;}if(b.y<34){b.y=34;b.vy=Math.abs(b.vy)*.8;}
    if(b.y<70&&b.x>200){const d=(b.x-200)+(70-b.y);if(d>60){b.vx=-Math.abs(b.vx)-.5;}}
    m.bumps.forEach(([x,y,r],i)=>{const dx=b.x-x,dy=b.y-y,d=Math.hypot(dx,dy);if(d<r+3){const nx=dx/d,ny=dy/d;b.x=x+nx*(r+3);b.y=y+ny*(r+3);const dot=b.vx*nx+b.vy*ny;b.vx-=2*dot*nx;b.vy-=2*dot*ny;b.vx+=nx*1.6;b.vy+=ny*1.6;
      m.score+=100;m.lit[i]=12;sfx(700+i*90,.05,'square',.03);}});
    for(const [x1,y1,x2,y2] of [[22,150,96,178],[244,150,160,178]]){const r=segHit(b,x1,y1,x2,y2,3);if(r){b.vx=r[0];b.vy=r[1];}}
    for(let i=0;i<2;i++){const [x1,y1,x2,y2]=flipSeg(i,m),r=segHit(b,x1,y1,x2,y2,3,m.flv[i]);if(r){b.vx=r[0];b.vy=r[1];if(m.flv[i]>0){b.vy-=5*m.flv[i]+2;b.vx+=(i==0?1:-1)*1.2;}}}}
  if(Math.hypot(b.vx,b.vy)<.35){if(++m.still>40){b.vx+=b.x<128?.9:-.9;b.vy-=.6;m.still=0;}}else m.still=0;
  for(let i=0;i<m.lit.length;i++)if(m.lit[i]>0)m.lit[i]--;
  if(b.y>FH+6){m.ball=null;m.balls--;m.launch=60;sfx(150,.3,'sawtooth',.04);m.msg=m.balls?'Ball lost!':'';}
}
function segHit(b,x1,y1,x2,y2,r,boost){const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy,t=Math.max(0,Math.min(1,((b.x-x1)*dx+(b.y-y1)*dy)/l2)),px=x1+dx*t,py=y1+dy*t,ex=b.x-px,ey=b.y-py,d=Math.hypot(ex,ey);
  if(d>=r||d==0)return null;const nx=ex/d,ny=ey/d;b.x=px+nx*r;b.y=py+ny*r;const dot=b.vx*nx+b.vy*ny;if(dot>0)return null;return[(b.vx-2*dot*nx)*.85,(b.vy-2*dot*ny)*.85];}
function drawPin(m){
  const gr=g.createLinearGradient(0,0,0,FH);gr.addColorStop(0,'#2a1a4a');gr.addColorStop(1,'#14102a');g.fillStyle=gr;g.fillRect(0,0,W,FH);
  R(16,28,234,4,'#c9a26b');R(16,28,4,FH,'#c9a26b');R(246,28,4,FH,'#c9a26b');
  for(let i=0;i<5;i++)R(40+i*40,40,6,6,(m.t>>3)%5==i?'#f8e060':'#5a4a2a');
  m.bumps.forEach(([x,y,r],i)=>{g.fillStyle=m.lit[i]?'#fff2a8':'#e83048';g.beginPath();g.arc(x,y,r,0,6.283);g.fill();g.fillStyle=m.lit[i]?'#ffffff':'#f890a0';g.beginPath();g.arc(x-2,y-2,r/2.5,0,6.283);g.fill();});
  g.strokeStyle='#c9a26b';g.lineWidth=3;g.beginPath();g.moveTo(22,150);g.lineTo(96,178);g.moveTo(244,150);g.lineTo(160,178);g.stroke();
  g.strokeStyle='#f2c14e';g.lineWidth=5;g.lineCap='round';for(let i=0;i<2;i++){const [x1,y1,x2,y2]=flipSeg(i,m);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}g.lineCap='butt';
  const b=m.ball;if(b){g.fillStyle='#e8ecf8';g.beginPath();g.arc(b.x,b.y,3,0,6.283);g.fill();R(Math.round(b.x)-1,Math.round(b.y)-2,1,1,'#ffffff');}
  text('SCORE '+m.score,10,6,'#fff2a8',8,'left','#080c28');text('BALLS '+m.balls,W-10,6,'#ffffff',8,'right','#080c28');
  text('B: left flipper   A: right flipper   MENU: quit',W/2,FH-22,'#e8ecf8',6,'center','#080c28');
}

/* ---- soapbox derby: steer down Libby Hill, dodge hay bales and cones ---- */
function derbyUpdate(m){
  if(m.done)return;
  m.time++;const st0=m.bump>0;if(m.bump>0)m.bump--;
  m.v=Math.min(st0?1.6:m.kind=='race'?5.2:4.2,m.v+(m.kind=='race'?.05:.04));m.y+=m.v;for(const o of m.obs)if(o.v)o.y+=o.v;
  const dx=keys.right-keys.left;m.x=Math.max(64,Math.min(192,m.x+dx*1.8));
  for(const o of m.obs){if(o.hit)continue;const sy=o.y-m.y;if(sy>120&&sy<150&&Math.abs(o.x-m.x)<14){o.hit=true;
    if(o.k=='puddle'||o.k=='oil'){m.v*=.6;sfx(400,.1,'triangle',.03);if(typeof splashSfx=='function')splashSfx(.4);}else{m.bump=40;m.v=1;shake=6;buzz(40);sfx(120,.15,'sawtooth',.05);}}}
  if(m.y>=m.len){m.done=true;const M=MINI[m.kind],s=m.time/60,medal=s<M.gold?'gold':s<M.silver?'silver':'bronze',coins={gold:20,silver:10,bronze:5}[medal];st.coins=Math.min(999,st.coins+coins);
    const nb=miniBest(m.kind,Math.round(m.time),true);if(medal=='gold')st.f[M.flag]=1;
    endMini(['Finished in '+fmtTime(m.time)+'! That\'s a '+medal+' medal.',M.who+' hands over '+coins+' coins.'+(nb?' A new best time!':'')]);}
}
function drawDerby(m){
  R(0,0,W,FH,'#58a848');const off=Math.floor(m.y)%32;
  for(let y=-off;y<FH;y+=32){R(0,y,48,30,'#a85040');R(2,y+2,44,4,'#c46a58');R(208,y,48,30,'#94483a');R(210,y+2,44,4,'#b06254');R(10,y+12,10,8,'#f8d868');R(228,y+16,10,8,'#28406a');}
  R(56,0,144,FH,'#8a8e9c');R(56,0,4,FH,'#e4e0d4');R(196,0,4,FH,'#e4e0d4');for(let y=-(Math.floor(m.y)%24);y<FH;y+=24)R(127,y,2,12,'#f2c14e');
  for(const o of m.obs){const y=Math.round(o.y-m.y);if(y<-20||y>FH+10)continue;const x=Math.round(o.x);
    if(o.k=='hay'){R(x-10,y-6,20,12,'#1a1423');R(x-9,y-5,18,10,'#d8b048');R(x-9,y-2,18,1,'#a88830');}
    else if(o.k=='cone'){R(x-4,y-6,8,12,'#1a1423');R(x-3,y-5,6,10,'#f08030');R(x-3,y-2,6,2,'#ffffff');}
    else{g.globalAlpha=.7;R(x-12,y-4,24,8,'#2a4a8a');g.globalAlpha=1;R(x-6,y-2,6,1,'#a8c8f0');}}
  const cx=Math.round(m.x),cy=138+(m.bump>0&&(m.t>>1)&1?1:0);
  R(cx-9,cy-10,18,22,'#1a1423');R(cx-8,cy-9,16,20,'#e83048');R(cx-8,cy-9,16,3,'#f890a0');R(cx-11,cy-7,4,6,'#1a1423');R(cx+7,cy-7,4,6,'#1a1423');R(cx-11,cy+5,4,6,'#1a1423');R(cx+7,cy+5,4,6,'#1a1423');
  g.drawImage(HERO.up[0].r.c,cx-8,cy-8);
  const pct=Math.min(1,m.y/m.len);R(244,30,6,140,'#1a1423');R(245,31+Math.round(138*(1-pct)),4,Math.round(138*pct),'#f2c14e');
  text(fmtTime(m.time),10,6,'#fff2a8',8,'left','#080c28');text('LIBBY HILL',W-14,6,'#ffffff',8,'right','#080c28');
}
function drawTrail(m){
  R(0,0,W,FH,'#58a848');const off=Math.floor(m.y);
  R(0,0,52,FH,'#4a6e62');for(let y=-(off%20);y<FH;y+=20){R(6,y,10,1,'#b8d4c0');R(26,y+9,12,1,'#7a9e8a');}R(50,0,6,FH,'#c8b890');
  for(let y=-(off%48);y<FH;y+=48){blob(212,y,'#2f7a3c','#1f5a30','#143c22');blob(228,y+22,'#2f7a3c','#1f5a30','#143c22');}
  R(56,0,144,FH,'#5e5a62');R(56,0,3,FH,'#e8e4dc');R(197,0,3,FH,'#e8e4dc');for(let y=-(off%24);y<FH;y+=24)R(127,y,2,12,'#e8e4dc');
  for(const o of m.obs){const y=Math.round(o.y-m.y);if(y<-20||y>FH+10)continue;const x=Math.round(o.x);
    if(o.k=='goose')g.drawImage(SPR.goose.r.c,x-8,y-9);else if(o.k=='jogger'){R(x-3,y-8,6,6,'#f2c698');R(x-4,y-2,8,7,'#e83048');R(x-3,y+5,2,4,'#3c3c54');R(x+1,y+5,2,4,'#3c3c54');}
    else{g.globalAlpha=.7;R(x-12,y-4,24,8,'#2a4a8a');g.globalAlpha=1;}}
  const cx=Math.round(m.x),cy=138+(m.bump>0&&(m.t>>1)&1?1:0);R(cx-2,cy-6,4,18,'#1a1423');R(cx-1,cy-5,2,16,'#8e909c');R(cx-5,cy+1,10,2,'#e83048');g.drawImage(HERO.up[(m.t>>3)&1].r.c,cx-8,cy-10);
  const pct=Math.min(1,m.y/m.len);R(244,30,6,140,'#1a1423');R(245,31+Math.round(138*(1-pct)),4,Math.round(138*pct),'#f2c14e');
  text(fmtTime(m.time),10,6,'#fff2a8',8,'left','#080c28');text('CAPITAL TRAIL',W-14,6,'#ffffff',8,'right','#080c28');}
