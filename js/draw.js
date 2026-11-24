"use strict";
/* River City Quest: Drawing the world, the HUD, menus, title and ending screens. */
/* ---------- drawing ---------- */
let texts=[];
function text(s,x,y,c,size,align,sh){texts.push([tr(s),x,y,c,size||8,align||'left',sh]);}
function flushText(){
  ctx.textBaseline='top';
  for(const [s,x,y,c,size,align,sh] of texts){ctx.font=size+'px "Press Start 2P", monospace';ctx.textAlign=align;
    if(sh){ctx.fillStyle=sh;ctx.fillText(s,x+1,y+1);}ctx.fillStyle=c;ctx.fillText(s,x,y);}
  texts=[];
}
const MF={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001111','A':'010101111101101','B':'110101110101110','/':'001001010100100','x':'000101010101000'};
function mtext(s,x,y,c,sh){s=String(s);if(sh!==false){let q=x+1;for(const ch of s){const m=MF[ch];if(m)for(let i=0;i<15;i++)if(m[i]=='1')R(q+i%3,y+1+(i/3|0),1,1,'#080a18');q+=4;}}
  for(const ch of s){const m=MF[ch];if(m)for(let i=0;i<15;i++)if(m[i]=='1')R(x+i%3,y+(i/3|0),1,1,c);x+=4;}}
function D(s,x,y,white){g.drawImage(white?s.wht:s.c,Math.round(x),Math.round(y));}
function shadow(x,y,w){x=Math.round(x);y=Math.round(y);R(x-w,y,w*2,3,'rgba(10,8,24,.3)');R(x-w+2,y-1,w*2-4,5,'rgba(10,8,24,.3)');}
function panel(x,y,w,h){R(x+1,y,w-2,h,'#1a1a22');R(x,y+1,w,h-2,'#1a1a22');R(x+1,y+1,w-2,1,'#6a6a7a');R(x+1,y+1,1,h-2,'#6a6a7a');R(x+1,y+h-2,w-2,1,'#4a4a58');R(x+w-2,y+1,1,h-2,'#4a4a58');
  const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#2a3c9c');gr.addColorStop(1,'#0c1440');g.fillStyle=gr;g.fillRect(x+2,y+2,w-4,h-4);
  R(x+3,y+3,w-6,1,'#6878d0');R(x+3,y+3,1,h-6,'#6878d0');R(x+3,y+h-4,w-6,1,'#080c28');R(x+w-4,y+3,1,h-6,'#080c28');
  if(w>40&&h>20){ironCurl(x+3,y+3,1,1,'#9a9aaa','#f2c14e');ironCurl(x+w-4,y+3,-1,1,'#9a9aaa','#f2c14e');ironCurl(x+3,y+h-4,1,-1,'#9a9aaa','#f2c14e');ironCurl(x+w-4,y+h-4,-1,-1,'#9a9aaa','#f2c14e');
    if(w>120){const m=x+(w>>1);R(m-2,y,5,1,'#9a9aaa');R(m-1,y-1,3,1,'#9a9aaa');R(m,y-2,1,1,'#f2c14e');}}}
function paddleAt(an,glow){
  const ox=p.x,oy=p.y-3,cs=Math.cos(an),sn=Math.sin(an);
  for(let r=4;r<=17;r++){const q=r>=13?2:1;R(Math.round(ox+cs*r)-q,Math.round(oy+sn*r)-q,q*2+1,q*2+1,'#1a1423');}
  for(let r=4;r<=17;r++){const q=r>=13?1:0;R(Math.round(ox+cs*r)-q,Math.round(oy+sn*r)-q,q*2+1,q*2+1,r>=13?(glow?'#fff2a8':st.gold?'#f2c14e':'#f0dc98'):(st.gold?'#d8a830':'#c9a26b'));}
  R(Math.round(ox+cs*15),Math.round(oy+sn*15),1,1,'#ffffff');
  if(glow){const a=frame/3;R(Math.round(ox+cs*16+Math.cos(a)*4),Math.round(oy+sn*16+Math.sin(a)*4),2,2,'#ffffff');}
}
const BASEAN=[Math.PI/2,Math.PI,-Math.PI/2,0];
function drawPaddle(){
  const t=Math.min(1,(14-p.atk)/8),base=BASEAN[p.dir],ox=p.x,oy=p.y-3;
  for(let j=2;j>=1;j--){const an=base-1.1+2.2*Math.max(0,t-j*.18);g.globalAlpha=.36/j;for(let r=10;r<=18;r+=2)R(Math.round(ox+Math.cos(an)*r)-1,Math.round(oy+Math.sin(an)*r)-1,3,3,'#ffffff');}
  g.globalAlpha=1;paddleAt(base-1.1+2.2*t,false);
}
function drawSpin(){
  const k=1-p.spin/22,base=BASEAN[p.dir]+k*Math.PI*2;
  g.globalAlpha=.4;for(let j=1;j<10;j++){const an=base-j*.25;R(Math.round(p.x+Math.cos(an)*16)-1,Math.round(p.y-3+Math.sin(an)*16)-1,3,3,'#ffffff');}
  g.globalAlpha=1;paddleAt(base,true);
}
function heroSpr(){const d=p.dir,set=d==0?HERO.down:d==2?HERO.up:HERO.side,wk=p.moving?(frame>>3)&3:0;let s;
  if(d==0||d==2)s=wk==1?set[1].r:wk==3?set[1].l:set[0].r;else{const fr=set[wk&1];s=d==3?fr.r:fr.l;}return{s,bob:(wk&1)?1:0};}
function drawWeapon(){if(p.spin>0)drawSpin();else if(p.atk>0)drawPaddle();else if(p.charging)paddleAt(BASEAN[p.dir],p.charge>=40);}
function drawPlayer(){
  for(const t of p.trail){g.globalAlpha=.3*t.a;D(t.s,t.x-8,t.y-11);}g.globalAlpha=1;
  shadow(p.x,p.y+4,5);
  if(p.hold){D(HERO.down[0].r,p.x-8,p.y-11);g.drawImage(p.hold.ic,Math.round(p.x-p.hold.ic.width/2),Math.round(p.y-13-p.hold.ic.height));return;}
  if(p.inv>0&&(frame>>1)&1)return;
  const {s,bob}=heroSpr(),behind=p.dir==2,boat=onRiver();
  if(behind)drawWeapon();
  D(s,p.x-8,p.y-11-(boat?2:bob));
  if(boat){const x=Math.round(p.x),y=Math.round(p.y),hz=p.dir==1||p.dir==3,bob2=(frame>>4)&1;
    if(hz){R(x-12,y+bob2-1,24,7,'#1a1423');R(x-11,y+bob2,22,5,'#e83048');R(x-11,y+bob2,22,1,'#f890a0');R(x-6,y+bob2+1,12,2,'#8a1424');}
    else{R(x-6,y-6+bob2,12,16,'#1a1423');R(x-5,y-5+bob2,10,14,'#e83048');R(x-5,y-5+bob2,2,14,'#f890a0');R(x-3,y-1+bob2,6,4,'#8a1424');}
    R(x-9+((frame>>3)&3)*5,y+7,3,1,'#ffffff');}
  if(!behind)drawWeapon();
}
function drawBell(e,wh){
  const x=Math.round(e.x),y=Math.round(e.y-e.z),C=wh?['#fff','#fff','#fff','#fff']:['#1a1423','#7a5420','#c08840','#f0c070'];
  const sz=e.z>12?7-e.z/10:9;R(x-sz,y+8,sz*2,3,'rgba(10,8,24,.35)');
  if(e.z>2){g.globalAlpha=.35;R(x-10,Math.round(e.y)+6,20,4,'#0a0818');g.globalAlpha=1;}
  const ws=[6,8,10,12,12,14,14,16,16,18,20,22];
  R(x-2,y-24,4,4,C[0]);R(x-1,y-23,2,2,C[1]);
  ws.forEach((w,i)=>{R(x-w/2-1,y-20+i,w+2,1,C[0]);R(x-w/2,y-20+i,w,1,C[2]);R(x-w/2,y-20+i,2,1,C[3]);R(x+w/2-3,y-20+i,3,1,C[1]);});
  R(x-12,y-8,24,3,C[0]);R(x-11,y-8,22,2,C[1]);R(x-8,y-14,16,1,C[1]);
  if(e.state=='stun'){R(x-2,y-6,4,5,C[0]);R(x-1,y-5,2,3,'#3a3446');for(let i=0;i<3;i++){const a=frame/8+i*2.1;R(Math.round(x+Math.cos(a)*12),Math.round(y-26+Math.sin(a)*3),2,2,'#f8e060');}}
}
const OV=[8,14,18,20,22,22,22,22,22,20,18,14,8];
function oval(cx,top,ws,c){ws.forEach((w,i)=>R(Math.round(cx-w/2),top+i,w,1,c));}
function drawArum(e,wh){
  const x=Math.round(e.x),y=Math.round(e.y),bl=e.state=='bloom',c=k=>wh?'#ffffff':k,sw=Math.round(Math.sin(frame/20)*1);
  shadow(x,y+8,14);
  R(x-14,y+2,28,8,c('#1a1423'));R(x-13,y+3,26,6,c('#6a4a2a'));R(x-13,y+3,26,1,c('#8a6a3a'));
  for(const a of[-12,-6,6,12]){R(x+a-1,y+4,3,6,c('#2f6a30'));}
  if(bl){R(x-15,y-18,30,21,c('#1a1423'));R(x-14,y-17,28,19,c('#6a1c3c'));R(x-12,y-15,24,15,c('#8a2a4c'));R(x-14,y-17,4,19,c('#2f6a30'));R(x+10,y-17,4,19,c('#2f6a30'));
    R(x-3,y-34+sw,6,30,c('#1a1423'));R(x-2,y-33+sw,4,28,c('#d8b048'));R(x-1,y-33+sw,1,28,c('#f8e060'));
    for(let i=0;i<3;i++){const a=frame/9+i*2.1;R(Math.round(x+Math.cos(a)*16),Math.round(y-22+Math.sin(a)*3),2,2,'#f8e060');}}
  else{R(x-7,y-32+sw,14,36,c('#1a1423'));R(x-6,y-31+sw,12,34,c('#3d8a3a'));R(x-6,y-31+sw,3,34,c('#58a848'));R(x+3,y-31+sw,3,34,c('#2f6a30'));
    R(x-2,y-36+sw,4,5,c('#1a1423'));R(x-1,y-35+sw,2,4,c('#6a1c3c'));for(let i=0;i<4;i++)R(x-5+((i*3+(e.t>>3))%9),y-26+i*7+sw,2,1,c('#84cc68'));}
}
function drawForeman(e,wh){
  const wind=e.state=='wind',stun=e.state=='stun',sh=wind?((frame>>1)&1)*2-1:0,x=Math.round(e.x)+sh,y=Math.round(e.y),stp=e.state=='walk'&&(frame>>3)&1;
  const W_=wh?'#ffffff':null,c=k=>W_||k,o=c('#1a1423'),b=c('#4a4a5a'),l=c('#7c7c8e'),dk=c('#2a2a36'),gl=c('#f8a030');
  shadow(x,y+8,13);
  R(x-10,y-1+stp,7,9,o);R(x-9,y+stp,5,7,b);R(x+3,y-1+(1-stp),7,9,o);R(x+4,y+(1-stp),5,7,b);
  const ay=wind?y-28:y-16;R(x-17,ay,6,15,o);R(x-16,ay+1,4,13,l);R(x+11,ay,6,15,o);R(x+12,ay+1,4,13,l);R(x-18,ay+13,8,5,o);R(x+10,ay+13,8,5,o);
  R(x-12,y-20,24,20,o);R(x-11,y-19,22,18,b);R(x-11,y-19,22,2,l);R(x-11,y-3,22,2,dk);
  for(const [a,q] of [[-9,-16],[8,-16],[-9,-5],[8,-5]])R(x+a,y+q,1,1,l);
  R(x+5,y-32,5,7,o);R(x+6,y-31,3,6,dk);if(((frame>>3)+e.t)%3==0){g.globalAlpha=.5;R(x+5,y-37-((frame>>2)&3),5,4,'#8e909c');g.globalAlpha=1;}
  R(x-7,y-28,14,9,o);R(x-6,y-27,12,7,b);R(x-6,y-27,12,1,l);R(x-4,y-24,3,2,gl);R(x+1,y-24,3,2,gl);
  if(stun){R(x-8,y-16,16,11,o);R(x-7,y-15,14,9,gl);R(x-4,y-13,8,5,(frame>>2)&1?c('#fff2a8'):gl);
    for(let i=0;i<3;i++){const a=frame/7+i*2.1;R(Math.round(x+Math.cos(a)*12),Math.round(y-32+Math.sin(a)*3),2,2,'#f8e060');}}
  else{R(x-8,y-16,16,11,o);R(x-7,y-15,14,9,l);R(x-7,y-15,14,1,c('#a8a8b8'));R(x-7,y-7,14,1,dk);for(const [a,q] of [[-6,-14],[5,-14],[-6,-8],[5,-8]])R(x+a,y+q,1,1,dk);}
}
function drawTurtle(e,wh){
  const sh=e.state=='wind'?((frame>>1)&1)*2-1:0,x=Math.round(e.x)+sh,y=Math.round(e.y),f=e.f>0?1:-1,stun=e.state=='stun';
  const C=wh?['#fff','#fff','#fff','#fff','#fff','#fff']:['#1a1423','#3a5226','#5e7d3c','#8fae62','#9aa978','#d8c878'];
  shadow(x,y+7,12);
  const leg=(lx,ly)=>{R(lx-1,ly-1,7,6,C[0]);R(lx,ly,5,4,C[4]);};
  if(stun){oval(x,y-11,[8].concat(OV.map(w=>w+2),[8]),C[0]);oval(x,y-10,OV,C[5]);R(x-1,y-9,2,12,'#b0a050');R(x-9,y-4,18,1,'#b0a050');
    const w=(frame>>2)&1;leg(x-13,y-12+w);leg(x+8,y-12+(1-w));leg(x-13,y+2-w);leg(x+8,y+2+w);
    for(let i=0;i<3;i++){const a=frame/8+i*2.1;R(Math.round(x+Math.cos(a)*10),Math.round(y-15+Math.sin(a)*3),2,2,'#f8e060');}return;}
  const w=e.state=='walk'&&(frame>>3)&1;
  leg(x-11,y-11+w);leg(x+6,y-11+(w?0:1));leg(x-11,y+3-w);leg(x+6,y+3);
  const hx=f>0?x+10:x-17,hy=y-6;R(hx-1,hy-1,9,8,C[0]);R(hx,hy,7,6,C[4]);R(f>0?hx+4:hx+1,hy+1,2,2,wh?'#fff':'#1a1423');R(f>0?hx+5:hx+1,hy+4,2,1,C[0]);
  oval(x,y-11,[8].concat(OV.map(w=>w+2),[8]),C[0]);oval(x,y-10,OV,C[2]);
  R(x-4,y-7,8,6,C[3]);R(x-3,y-6,6,4,C[2]);R(x-10,y-4,5,5,C[1]);R(x+5,y-4,5,5,C[1]);R(x-6,y+0,12,2,C[1]);R(x-7,y-9,5,2,C[3]);
}
function drawWraith(e,wh){
  const x=Math.round(e.x),y=Math.round(e.y+Math.sin(frame/14)*2),vis=e.vis>0;
  g.globalAlpha=wh?1:vis?1:.28+.1*Math.sin(frame/5);
  const body=wh?'#fff':vis?'#c8d0e8':'#8a94c0',dark=wh?'#fff':'#1a1423';
  const ws=[6,10,12,14,16,16,18,18,20,20,22,22,22];
  ws.forEach((w,i)=>{R(x-w/2-1,y-16+i,w+2,1,dark);R(x-w/2,y-16+i,w,1,body);});
  for(let i=0;i<6;i++){const ox=x-11+i*4,len=3+((frame>>3)+i)%3;R(ox,y-3,3,len,body);R(ox,y-3+len,3,1,dark);}
  R(x-5,y-12,10,6,dark);R(x-3,y-10,2,2,'#e83048');R(x+1,y-10,2,2,'#e83048');
  g.globalAlpha=1;
}
function drawEnemy(e){
  if(e.gone)return;
  const wh=e.flash>0&&(frame&2),sd=e.f>0?'r':'l',fl=(frame>>3)&1,stz=e.stun>0;
  if(stz){g.globalAlpha=.75;}
  switch(e.type){
    case'bat':shadow(e.x,e.y+10,3);D(SPR.bat[stz?0:fl][sd],e.x-8,e.y-8,wh);break;
    case'ghost':shadow(e.x,e.y+9,4);g.globalAlpha=stz?.6:.8;D(SPR.ghost[sd],e.x-8,e.y-9+Math.sin((frame+e.t)/12)*2,wh);g.globalAlpha=1;break;
    case'raven':{shadow(e.x,e.y+12,7);const b=SPR.raven[sd],w=WINGS[fl][sd];D(b,e.x-12,e.y-9,wh);D(w,e.x-12+(e.f>0?4:8),e.y-9+(fl?6:-3),wh);break;}
    case'vampire':{const ph=e.t%170;shadow(e.x,e.y+6,6);g.globalAlpha=ph<15?ph/15:ph>115?Math.max(0,(130-ph)/15):1;D(SPR.vampire[sd],e.x-8,e.y-18+Math.sin(frame/14),wh);g.globalAlpha=1;break;}
    case'turtle':drawTurtle(e,wh);break;
    case'bell':drawBell(e,wh);break;
    case'foreman':drawForeman(e,wh);break;
    case'arum':drawArum(e,wh);break;
    case'wraith':shadow(e.x,e.y+10,8);drawWraith(e,wh);break;
    case'scooter':shadow(e.x,e.y+6,6);D(SPR.scooter[sd],e.x-8,e.y-9,wh);break;
    case'crab':shadow(e.x,e.y+5,6);D(SPR.crab[sd],e.x-8,e.y-9+(stz?0:fl),wh);break;
    default:shadow(e.x,e.y+5,5);D(SPR[e.type][sd],e.x-8,e.y-9-((e.vx||e.vy)&&fl&&!stz?1:0),wh);
  }
  g.globalAlpha=1;
  if(stz)for(let i=0;i<2;i++){const a=frame/6+i*3.1;R(Math.round(e.x+Math.cos(a)*6),Math.round(e.y-12+Math.sin(a)*2),2,2,'#f8e060');}
}
function drawPick(k){
  if(k.life<120&&(frame>>2)&1)return;
  const x=Math.round(k.x),y=Math.round(k.y),b=Math.round(Math.sin(frame/10)*1.5);
  if(k.kind=='coin'){shadow(x,y+5,3);D(COIN[(frame>>3)&1].r,x-4,y-5+b);}
  else if(k.kind=='heart'){shadow(x,y+5,3);g.drawImage(HEART,x-4,y-5+b);}
  else if(k.kind=='part'){shadow(x,y+6,5);g.drawImage(IC.oar,x-6,y-8+b);if((frame>>3)&1)R(x+3,y-9+b,2,2,'#ffffff');}
  else if(k.kind=='tomato'){shadow(x,y+4,3);R(x-3,y-4+b,7,6,'#1a1423');R(x-2,y-3+b,5,4,'#e83048');R(x-1,y-3+b,1,1,'#f890a0');R(x-1,y-5+b,3,2,'#3d8a3a');}
  else if(k.kind=='painting'){shadow(x,y+5,5);R(x-6,y-9+b,12,10,'#1a1423');R(x-5,y-8+b,10,8,'#c9a26b');R(x-4,y-7+b,8,6,'#3e6a8a');R(x-4,y-3+b,8,2,'#58a848');R(x+1,y-6+b,2,2,'#f8e060');}
  else if(k.kind=='secret'){const d=Math.hypot(k.x-p.x,k.y-p.y);if(d<56&&(frame+k.x)%80<14){const q=(frame>>1)&3;R(x-q,y-6,1+q*2,1,'#fff2a8');R(x,y-6-q,1,1+q*2,'#fff2a8');R(x,y-6,1,1,'#ffffff');}}
  else if(k.kind=='frog'){shadow(x,y+3,4);const j=k.jump>0?Math.round(Math.sin(k.jump/10*Math.PI)*5):0;g.drawImage(IC.frog,x-6,y-6-j);}
  else if(k.kind=='ballpk'){shadow(x,y+5,3);g.drawImage(IC.ball,x-6,y-7+b);}
  else if(k.kind=='powpk'){shadow(x,y+5,3);g.drawImage(IC.keg,x-6,y-8+b);}
  else if(k.kind=='bib'){shadow(x,y+6,5);g.drawImage(IC.bib,x-6,y-8+b);}
  else if(k.kind=='skey'){shadow(x,y+6,4);g.drawImage(IC.key,x-6,y-8+b);if((frame>>3)&1)R(x+3,y-9+b,2,2,'#ffffff');}
  else if(k.kind=='carkey'){shadow(x,y+6,4);g.drawImage(IC.carkey,x-6,y-8+b);if((frame>>3)&1)R(x+3,y-9+b,2,2,'#ffffff');}
  else if(k.kind=='token'){shadow(x,y+5,4);g.drawImage(IC[k.ic]||IC.ball,x-6,y-8+b);if((frame>>2)%6==0)R(x+3,y-9+b,2,2,'#ffffff');}
  else if(k.kind=='flag'){shadow(x,y+6,5);R(x-1,y-14,2,20,'#1a1423');R(x+1,y-14,10,7,'#1a1423');R(x+1,y-13,9,5,(frame>>3)&1?'#e83048':'#f2c14e');R(x+1,y-13,4,2,'#ffffff');}
  else if(k.kind=='piece'){shadow(x,y+5,4);g.drawImage(IC.piece,x-4,y-6+b);if((frame>>3)&1)R(x+3,y-7+b,2,2,'#ffffff');}
  else if(k.kind=='container'){shadow(x,y+7,5);R(x-7,y-8+b,15,14,'#1a1423');R(x-6,y-7+b,13,12,'#fff2a8');R(x-5,y-6+b,11,10,'#3a1c30');g.drawImage(HEART,x-4,y-5+b);if((frame>>3)&1)R(x+5,y-9+b,2,2,'#ffffff');}
  else if(k.kind=='keystone'){shadow(x,y+8,6);g.drawImage(KSIC[k.id],x-6,y-7+b);const q=(frame>>2)%8;if(q<3){R(x-9+q*8,y-9+b,1,3,'#ffffff');R(x-10+q*8,y-8+b,3,1,'#ffffff');}}
}
const fogC=mkCanvas(96,96);{const f=fogC.getContext('2d'),gr=f.createRadialGradient(48,48,4,48,48,48);gr.addColorStop(0,'rgba(220,228,240,1)');gr.addColorStop(1,'rgba(220,228,240,0)');f.fillStyle=gr;f.fillRect(0,0,96,96);}
function drawIris(){const t=trans.t,c=t<16,k=c?1-t/15:Math.max(0,(t-18)/16),r=Math.max(0,180*k*k),cx=c?trans.ox:p.x-cam.x,cy=c?trans.oy:p.y-cam.y-4;
  if(t>=34)return;g.fillStyle='#000';g.beginPath();g.rect(0,0,W,PH);g.moveTo(cx+r,cy);g.arc(cx,cy,r,0,Math.PI*2);g.fill('evenodd');
  if(r>2){g.strokeStyle='rgba(242,193,78,.5)';g.lineWidth=1;g.beginPath();g.arc(cx,cy,r,0,6.283);g.stroke();}}
const cloudC=mkCanvas(120,64);{const f=cloudC.getContext('2d');f.fillStyle='rgba(16,20,48,1)';
  for(const [x,y,r] of [[34,34,22],[60,26,26],[86,36,20],[50,42,18],[74,44,16]]){f.beginPath();f.arc(x,y,r,0,6.283);f.fill();}}
function drawClouds(){g.globalAlpha=.13;const sx=MW()+360,sy=MH()+200;for(let i=0;i<4;i++){const wx=(i*331+frame*.18)%sx-120,wy=(i*173+frame*.06)%sy-60;g.drawImage(cloudC,Math.round(wx-cam.x),Math.round(wy-cam.y),240,128);}g.globalAlpha=1;}
const vigC=mkCanvas(W,PH);{const f=vigC.getContext('2d'),gr=f.createRadialGradient(W/2,PH/2,PH*.45,W/2,PH/2,W*.72);gr.addColorStop(0,'rgba(8,6,20,0)');gr.addColorStop(1,'rgba(8,6,20,.45)');f.fillStyle=gr;f.fillRect(0,0,W,PH);}
const gradeC=mkCanvas(W,PH);{const f=gradeC.getContext('2d'),gr=f.createLinearGradient(0,0,0,PH);gr.addColorStop(0,'rgba(255,196,120,.10)');gr.addColorStop(.5,'rgba(255,196,120,0)');gr.addColorStop(1,'rgba(40,30,110,.10)');f.fillStyle=gr;f.fillRect(0,0,W,PH);
  const v=f.createRadialGradient(W/2,PH/2,PH*.55,W/2,PH/2,W*.75);v.addColorStop(0,'rgba(8,6,20,0)');v.addColorStop(1,'rgba(8,6,20,.28)');f.fillStyle=v;f.fillRect(0,0,W,PH);}
let leaves=[];
function drawLeaves(){const LC=leafColors();if(!cur.leafy||!LC){leaves.length=0;return;}
  if(leaves.length<14&&Math.random()<.08)leaves.push({x:Math.random()*W,y:-4,vx:.2+Math.random()*.3,vy:.25+Math.random()*.25,ph:Math.random()*6,c:LC[rnd(4)]});
  for(const l of leaves){l.ph+=.06;l.x+=l.vx+Math.sin(l.ph)*.5;l.y+=l.vy;const w=Math.cos(l.ph)>0?2:1;R(Math.round(l.x),Math.round(l.y),w,1,l.c);R(Math.round(l.x)+(w>1?1:0),Math.round(l.y)+1,1,1,'#7a3a18');}
  leaves=leaves.filter(l=>l.y<PH+4&&l.x<W+4);}
function drawFog(a){for(let i=0;i<5;i++){const x=((i*83+frame*(.15+i*.05))%(W+170))-170,y=4+i*33+Math.sin(frame/90+i)*7;g.globalAlpha=a;g.drawImage(fogC,x,y,170,60);}g.globalAlpha=1;}
const lightC=mkCanvas(W,PH),lg=lightC.getContext('2d');
const holeC=mkCanvas(64,64);{const f=holeC.getContext('2d'),gr=f.createRadialGradient(32,32,7,32,32,32);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');f.fillStyle=gr;f.fillRect(0,0,64,64);}
function holeAt(x,y,r){x-=cam.x;y-=cam.y;if(x<-r||y<-r||x>W+r||y>PH+r)return;lg.drawImage(holeC,Math.round(x-r),Math.round(y-r),Math.round(r*2),Math.round(r*2));}
function drawLight(){
  lg.globalCompositeOperation='source-over';lg.clearRect(0,0,W,PH);lg.fillStyle=cur.area=='tunnel'?'rgba(20,4,24,.72)':'rgba(8,6,24,.68)';lg.fillRect(0,0,W,PH);
  lg.globalCompositeOperation='destination-out';
  const hole=holeAt;
  hole(p.x,p.y-4,(st.items.lantern?68:38)+Math.sin(frame/9)*2);
  for(const [x,y] of cur.torches||[])hole(x,y,46+((frame>>3)&1)*3);
  (cur.braz||[]).forEach(([x,y],i)=>{if(st.f['b:'+cur.id+':'+i])hole(x*TS+8,y*TS+6,44+((frame>>3)&1)*3);});
  for(const s of shots)hole(s.x,s.y,14);
  for(const b of bombs)hole(b.x,b.y-8,10);
  if(bug)hole(bug.x,bug.y,18);
  if(hook)hole(hook.x,hook.y,14);
  for(const k of picks)if(k.kind=='keystone'||k.kind=='skey')hole(k.x,k.y,26);
  for(const e of enemies)if((e.type=='vampire'&&!e.gone)||e.type=='wraith')hole(e.x,e.y-8,28);
  g.drawImage(lightC,0,0);
}
function drawWorld(){
  g.drawImage(cur.cv[(frame>>4)&3]||cur.cv[0],0,0);
  if(cur.ow){drawWeatherGround();drawSeasonWorld();fridayDecor();}
  drawHome();
  for(const k of picks)drawPick(k);
  for(const b of blocks){const x=Math.round(b.x),y=Math.round(b.y);R(x+1,y+13,15,3,'rgba(10,8,24,.35)');R(x,y,16,15,'#1a1423');R(x+1,y+1,14,13,'#8a7a6a');R(x+1,y+1,14,3,'#b4a490');R(x+1,y+11,14,3,'#5e5044');R(x+4,y+5,8,5,'#6e5e4e');R(x+5,y+6,6,3,'#9a8a76');}
  for(const b of bombs){const x=Math.round(b.x),y=Math.round(b.y);shadow(x,y+5,5);g.drawImage(IC.keg,x-6,y-9);if(b.t<24&&(frame>>1)&1){g.globalAlpha=.6;R(x-5,y-6,10,9,'#ffffff');g.globalAlpha=1;}if((frame>>1)&1)R(x+1,y-10,2,2,'#fff2a8');}
  const act=[];
  for(const [lx,ly] of cur.lamps||[])if(litLamp(lx,ly)){const x=lx*TS,y=ly*TS;g.globalAlpha=.16+.04*((frame>>3)&1);g.fillStyle='#f8d868';g.beginPath();g.arc(x+8,y+4,14,0,6.283);g.fill();g.globalAlpha=1;R(x+6,y+2,4,3,'#fff2a8');R(x+7,y+1,2,1,'#f8d868');}
  for(const [mx,my] of cur.murals||[])if(chal&&chal.d.type=='tag'&&chal.set.has(mx+','+my)&&(frame>>3)&1)R(mx*TS+7,my*TS-3,3,3,'#fff2a8');
  for(const n of cur.npcs||[])act.push([n.y,()=>{const mv=(n.vx||n.vy)&&(frame>>3)&1;shadow(n.x,n.y+4,5);D(npcFrame(n),n.x-8,n.y-11-(mv?1:0));
    if(n.chal&&!st.pins[n.chal]&&!dlg&&(frame>>4)&1){R(Math.round(n.x)-1,Math.round(n.y)-22,3,6,'#f2c14e');R(Math.round(n.x)-1,Math.round(n.y)-14,3,2,'#f2c14e');}}]);
  for(const c of cars)act.push([c.y+4,()=>drawCar(c)]);
  for(const e of enemies)act.push([e.y+(FLY[e.type]?6:0),()=>drawEnemy(e)]);
  if(!relight)act.push([p.y,()=>{drawBike();drawPlayer();}]);
  if(dog&&!relight)act.push([dog.y,drawDog]);
  act.sort((a,b)=>a[0]-b[0]);for(const a of act)a[1]();
  for(const s of shots){const x=Math.round(s.x),y=Math.round(s.y);
    if(s.k=='ball'){R(x-2,y-2,5,5,'#1a1423');R(x-1,y-1,3,3,'#ffffff');R(x,y-1,1,1,'#e83048');}
    else if(s.k=='orb'){const c=s.refl?'#fff2a8':'#b890f8';R(x-4,y-3,8,6,'#1a1423');R(x-3,y-4,6,8,'#1a1423');R(x-3,y-3,6,6,c);R(x-1,y-2,2,2,'#ffffff');}
    else{const c=s.refl?'#fff2a8':s.k=='feather'?'#4a4662':s.k=='ring'?'#f0c070':s.k=='spark'?((frame>>1)&1?'#f8e060':'#f08020'):s.k=='seed'?'#84cc68':'#e83048';R(x-3,y-2,6,4,'#1a1423');R(x-2,y-3,4,6,'#1a1423');R(x-2,y-2,4,4,c);R(x-1,y-1,2,2,'#ffffff');}}
  if(hook)drawHook();
  if(fish)drawBobber();
  if(bug){const x=Math.round(bug.x),y=Math.round(bug.y);g.drawImage(IC.bug,x-6,y-6);for(const k of bug.carry)drawPick(k);if((frame>>1)&1){R(x-8,y-2,2,1,'#fff2a8');R(x+6,y-2,2,1,'#fff2a8');}}
  for(const b of birds){if(b.st=='gone')continue;const x=Math.round(b.x),y=Math.round(b.y);
    if(b.st=='sit'){const bob=(frame+b.hx)>>4&1;R(x-3,y-2,6,4,'#1a1423');R(x-2,y-1,4,2,'#8a8496');R(x+(bob?1:2),y-4+bob,3,3,'#1a1423');R(x+(bob?2:3),y-3+bob,1,1,'#5f566a');}
    else{const w=(frame>>1)&1;R(x-2,y-1,4,3,'#1a1423');R(x-1,y,2,1,'#8a8496');R(x-6,y-(w?3:0),4,2,'#5f566a');R(x+2,y-(w?3:0),4,2,'#5f566a');}}
  for(const q of parts){if(q.ring){const k=1-q.life/q.max,r=3+k*16;g.globalAlpha=1-k;g.strokeStyle=k<.4?'#ffffff':'#fff2a8';g.lineWidth=2;g.beginPath();g.arc(Math.round(q.x),Math.round(q.y),r,0,6.283);g.stroke();g.globalAlpha=1;continue;}const sz=Math.max(1,Math.round(q.s*q.life/q.max*1.6));R(Math.round(q.x)-(sz>>1),Math.round(q.y)-(sz>>1),sz,sz,q.c);}
}
function eqIcon(){if(!st.eq)return null;if(st.eq=='bottle')return st.bottle?IC.bottle:IC.bottleE;return ITEMS.find(i=>i.id==st.eq).ic;}
function eqCount(){const it=ITEMS.find(i=>i.id==st.eq);return it&&it.ammo?String(st.ammo[it.ammo]):'';}
function slot(x,y,lab,ic,cnt){R(x,y,18,20,'#080a18');R(x+1,y+1,16,18,'#26306a');R(x+1,y+1,16,1,'#4a58a8');R(x+1,y+18,16,1,'#141a40');R(x+1,y+1,1,17,'#3a4690');
  for(const [a,b] of [[0,0],[16,0],[0,18],[16,18]]){R(x+a,y+b,2,2,'#f2c14e');R(x+a+(a?0:1),y+b+(b?0:1),1,1,'#fff2a8');}if(ic)g.drawImage(ic,x+3,y+5);mtext(lab,x+2,y+2,'#f2c14e');if(cnt)mtext(cnt,x+17-cnt.length*4,y+14,'#ffffff');}
function drawHUD(){
  const gr=g.createLinearGradient(0,0,0,HUD);gr.addColorStop(0,'#232a54');gr.addColorStop(1,'#10122a');g.fillStyle=gr;g.fillRect(0,0,W,HUD);
  R(0,0,W,1,'#3a4690');R(0,HUD-3,W,1,'#080a18');R(0,HUD-2,W,1,'#f2c14e');R(0,HUD-1,W,1,'#6c5010');for(let i=8;i<W;i+=32)R(i,HUD-2,1,1,'#fff2a8');
  slot(2,1,'B',eqIcon(),eqCount());slot(21,1,'A',IC.paddle,'');
  const low=p.hp<=2&&p.hp>0,last=Math.ceil(p.hp/2)-1;
  for(let i=0;i<p.max/2;i++){const f=clamp(p.hp-i*2,0,2),x=43+(i%7)*10,y=(i<7?2:12)-(low&&i==last&&(frame>>3)&1?1:0);g.drawImage(HEART0,x,y);if(f==2)g.drawImage(HEART,x,y);else if(f==1)g.drawImage(HEART,0,0,5,8,x,y,5,8);}
  D(COIN[0].r,116,2);mtext(st.coins,126,4,'#fff2a8');
  if(!cur.ow){g.drawImage(IC.key,113,10);mtext(st.keys[cur.area]||0,126,14,'#ffffff');}
  KEYS4.forEach((k,i)=>{const x=146+i*13;if(st.got[k])g.drawImage(KSIC[k],x,3);else{R(x,3,12,12,'#080a18');R(x+1,4,10,10,'#2c3460');}if(OPT.assist)text('GIBZ'[i],x+6,5,'#ffffff',6,'center','#080a18');});
  if(st.ng)text('+'+(st.ng>1?st.ng:''),40,15,'#f2c14e',6,'left','#080a18');
  drawClock(201,3);
  if(st.pieces%4){g.drawImage(IC.piece,146,15);mtext((st.pieces%4)+'/4',156,17,'#ffffff');}
  drawMini(216,2,36,19,false);
}
function drawMini(x0,y0,w,h,big){
  const a=cur.area,b=AREAB[a],cols=b.x1-b.x0+1,rows=b.y1-b.y0+1;
  if(cols*rows==1)return;
  if(!big)R(x0-1,y0-1,w+2,h+2,'#080a18');
  const cw=Math.floor((w-cols+1)/cols),ch=Math.floor((h-rows+1)/rows);
  for(const id in SC){const s=SC[id];if(s.area!=a)continue;const x=x0+(s.ax-b.x0)*(cw+1),y=y0+(s.ay-b.y0)*(ch+1),here=id==curId;
    R(x,y,cw,ch,here?((frame>>4)&1?'#fff2a8':'#f2c14e'):st.vis[id]?(a=='ow'?(s.ay==2?'#2f5f96':'#3a6a48'):'#6a5a8a'):'#1e2446');}
}
function drawDlg(){
  const top=p.y-cam.y>PH/2?HUD+10:FH-70,x0=6,w=W-12,h=62;
  panel(x0,top,w,h);
  if(dlg.head){const hw=dlg.head.length*8+12;R(x0+8,top-7,hw,12,'#f4f4f8');R(x0+9,top-6,hw-2,10,'#6c1c2c');text(dlg.head,x0+14,top-5,'#fff2a8');}
  let left=dlg.n;const pg=dlg.pages[dlg.i];
  const fs=OPT.big?10:8,lh=OPT.big?15:12;pg.forEach((l,i)=>{const sh=l.slice(0,Math.max(0,left));left-=l.length;if(sh)text(sh,x0+10,top+9+i*lh,'#ffffff',fs,'left','#080c28');});
  if(dlg.choices&&dlg.i==dlg.pages.length-1&&left>=0){const k=dlg.choices.length,ph=k*13+10,py=top>HUD+20?top-ph-4:top+h+4;panel(x0,py,w,ph);
    dlg.choices.forEach((c,i)=>{if(i==dlg.sel)R(x0+6,py+5+i*13,w-12,12,'#2c3a8a');text((i==dlg.sel?'> ':'  ')+c,x0+10,py+7+i*13,'#ffffff',8,'left','#080c28');});return;}
  if(left>=0&&(frame>>4)&1){R(W-20,top+h-11,7,1,'#fff2a8');R(W-19,top+h-10,5,1,'#fff2a8');R(W-18,top+h-9,3,1,'#fff2a8');R(W-17,top+h-8,1,1,'#fff2a8');}
}
function drawBanner(){const w=banner.length*8+20,x=(W-w)/2|0,y=HUD+6;const a=Math.min(1,bannerT/20);g.globalAlpha=a*.85;R(x,y,w,16,'#080a18');g.globalAlpha=a;R(x,y+15,w,1,'#f2c14e');g.globalAlpha=1;
  if(a>.3)text(banner,W/2,y+4,'#fff2a8',8,'center','#1a1423');}
function drawToast(){const w=Math.min(W-8,toastMsg.length*8+16),x=(W-w)/2|0,y=FH-22;R(x,y,w,16,'rgba(8,10,24,.9)');R(x,y,w,1,'#f2c14e');text(toastMsg,W/2,y+4,'#ffffff',8,'center');}
const TABS=['ITEMS','GEAR','QUEST','STORY','CARDS','PHOTO','AWARD','MAP'];
const SHORT={'ow:0,-1':['BRYAN','PARK'],'ow:1,-1':['GINTER','GARDEN'],'ow:0,0':["SCOTT'S",'ADDITION'],'ow:1,0':['BROAD','STREET'],'ow:2,0':['JACKSON','WARD'],'ow:3,0':['CHURCH','HILL'],'ow:4,0':['CHIMBO-','RAZO'],
  'ow:0,1':['CARYTOWN',''],'ow:1,1':['THE FAN',''],'ow:2,1':['CAPITOL','SQUARE'],'ow:3,1':['SHOCKOE','BOTTOM'],'ow:0,2':['BYRD PK','MAYMONT'],'ow:1,2':['HOLLY-','WOOD'],'ow:2,2':['BELLE','ISLE'],
  'ow:3,2':['ROCKETTS','LANDING'],'ow:0,3':['PONY','PASTURE'],'ow:1,3':['FOREST','HILL'],'ow:2,3':['MANCHES-','TER'],'ow:3,3':["ANCAR-","ROW'S"]};
const OWKEY={'ow:2,2':'granite','ow:1,2':'iron','ow:3,1':'brick','ow:0,2':'bronze'};
function drawMenu(){
  const m=menu;
  const gr=g.createLinearGradient(0,0,0,FH);gr.addColorStop(0,'#141e56');gr.addColorStop(1,'#070a22');g.fillStyle=gr;g.fillRect(0,0,W,FH);
  R(2,2,W-4,1,'#f4f4f8');R(2,FH-3,W-4,1,'#f4f4f8');R(2,2,1,FH-4,'#f4f4f8');R(W-3,2,1,FH-4,'#f4f4f8');
  const tw=(W-4)/TABS.length;TABS.forEach((t,i)=>{const x=Math.round(2+i*tw),w=Math.round(tw)-1;R(x,6,w,13,i==m.tab?'#f2c14e':'#26306a');text(t,x+w/2,10,i==m.tab?'#1a1423':'#aeb7c2',6,'center');});
  R(6,21,W-12,1,'#4a58a8');
  if(m.rd){panel(8,26,W-16,150);text(m.rd.t,W/2,34,'#fff2a8',8,'center','#080c28');
    m.rd.pages[m.rd.pg].forEach((l,i)=>text(l,16,52+i*12,'#ffffff',8,'left','#080c28'));
    text((m.rd.pg+1)+'/'+m.rd.pages.length+'  A: '+(m.rd.pg+1<m.rd.pages.length?'next':'close'),W/2,FH-16,'#aeb7c2',8,'center');return;}
  if(m.tab==0){
    ITEMS.forEach((it,i)=>{const x=6+(i%6)*41,y=28+(i/6|0)*42,own=st.items[it.id],sel=i==m.cur;
      R(x,y,38,34,sel?((frame>>4)&1?'#fff2a8':'#f2c14e'):'#080a18');R(x+2,y+2,34,30,'#1c2660');R(x+2,y+2,34,1,'#3a4a98');
      if(own){const ic=it.id=='bottle'&&!st.bottle?IC.bottleE:it.ic;g.drawImage(ic,0,0,12,12,x+7,y+5,24,24);
        if(it.ammo)mtext(st.ammo[it.ammo],x+34-String(st.ammo[it.ammo]).length*4,y+26,'#ffffff');
        if(st.eq==it.id){R(x+2,y+2,9,9,'#f2c14e');mtext('B',x+5,y+4,'#1a1423',false);}}
      else text('?',x+20,y+13,'#3a4a98',8,'center');});
    const it=ITEMS[m.cur],own=st.items[it.id];panel(8,114,W-16,62);
    text(own?it.name:'???',16,122,'#fff2a8',8,'left','#080c28');
    (own?wrap(tr(it.desc),28):['You haven\'t found this yet.']).forEach((l,i)=>text(l,16,136+i*11,'#ffffff',8,'left','#080c28'));
    text('A: put on B   B: next tab',W/2,FH-16,'#aeb7c2',8,'center');
  }else if(m.tab==1){
    const q=st.trade?[TRADE[st.trade][1],TRADE[st.trade][0],'Trade it to the right person.']:st.got.bib&&!st.items.shoes?[IC.bib,'Race Bib','Someone in the Fan lost it.']
      :st.got.carkey&&!st.got.bronze?[IC.carkey,'Carillon Key','Opens the Carillon in Byrd Park.']:[null,'Quest item: none','People around town need help.'];
    const rows=[[IC.paddle,'Kayak Paddle','A swings. Hold, let go: spin.'],
      [st.shield?IC.shield:null,st.shield?'Cast-Iron Shield':'???',st.shield?'Bounces shots you face.':'Somewhere in iron and stone.'],
      [null,'Keystones '+nKeys()+'/4',''],
      [HEART,'Hearts '+p.max/2+'  Pieces '+(st.pieces%4)+'/4','Four pieces grow a heart.'],
      [COIN[0].r.c,'Coins '+st.coins+'  Keys '+(cur.ow?'-':(st.keys[cur.area]||0)),'Small keys work where found.'],
      [st.items.kayak?IC.kayak:null,st.items.kayak?'Kayak':'???',st.items.kayak?'Paddle across whitewater.':'Someone on the river has one.'],
      q,[IC.pin,'Stories '+nLore()+'/'+LORE.length+'  Pins '+Object.keys(st.pins).length+'/'+NCHAL,st.gold?'Golden Paddle: double damage!':'Every pin earns a golden paddle.']];
    rows.forEach(([ic,a,b],i)=>{const y=24+i*18;R(10,y,20,18,'#080a18');R(11,y+1,18,16,'#1c2660');
      if(ic)g.drawImage(ic,14+(12-ic.width)/2|0,y+3+(12-ic.height)/2|0);
      if(i==2)KEYS4.forEach((k,j)=>{const x=150+j*16;if(st.got[k])g.drawImage(KSIC[k],x,y+3);else{R(x,y+3,12,12,'#080a18');R(x+1,y+4,10,10,'#2c3460');}});
      text(a,36,y+1,'#fff2a8',8,'left','#080c28');if(b)text(b,36,y+10,'#aeb7c2',8,'left','#080c28');});
    R(8,170,W-16,1,'#4a58a8');wrap(tr('NEXT: ')+goal(),40).slice(0,2).forEach((l,i)=>text(l,10,174+i*9,'#fff2a8',6,'left','#080c28'));
  }else if(m.tab==3){
    text('Stories found '+nLore()+'/'+LORE.length,W/2,26,'#fff2a8',8,'center','#080c28');
    for(let i=0;i<11;i++){const j=m.jt+i;if(j>=LORE.length)break;const [id,t]=LORE[j],y=40+i*12,sel=j==m.jc,got=st.lore[id];
      if(sel)R(8,y-2,W-16,12,'#2c3a8a');text((sel?'> ':'  ')+(got?t:'- - - - - -'),12,y,got?'#ffffff':'#5a6496',8,'left','#080c28');}
    text('A: read   B: next tab',W/2,FH-16,'#aeb7c2',8,'center');
  }else if(m.tab==2){
    drawQuests();
  }else if(m.tab==5){
    drawAlbum(m);
  }else if(m.tab==6){
    st.ach=st.ach||{};const n=ACH.filter(a=>st.ach[a[0]]).length;text('Awards '+n+'/'+ACH.length,W/2,25,'#fff2a8',8,'center','#080c28');
    const H=Math.ceil(ACH.length/2),ac=m.ac||0;
    ACH.forEach(([id,name],i)=>{const x=i<H?8:W/2+2,y=36+(i%H)*10,got=st.ach[id];if(i==ac)R(x-2,y-2,W/2-10,10,'#2c3a8a');R(x,y,7,7,got?'#f2c14e':'#26306a');if(got)R(x+2,y+2,3,3,'#fff2a8');
      text(name,x+11,y,got?'#ffffff':'#7a84b6',6,'left','#080c28');});
    const sel=ACH[ac];panel(8,150,W-16,24);text(sel[2]+(st.ach[sel[0]]?'  (done)':''),W/2,158,'#fff2a8',6,'center','#080c28');
    let rb=0;try{rb=+localStorage.getItem('rcq-rush')||0;}catch(e){}
    text((rb?'Boss rush best '+fmtTime(rb)+'   ':'')+'B: next tab',W/2,FH-14,'#aeb7c2',6,'center');
  }else if(m.tab==4){
    const cc=m.cc||0;
    CARDS.forEach((c,i)=>{const x=12+(i%4)*60,y=26+(i/4|0)*38,own=st.cards[c.id],sel=i==cc;
      R(x,y,52,34,sel?((frame>>4)&1?'#fff2a8':'#f2c14e'):'#080a18');R(x+2,y+2,48,30,own?c.col:'#1c2660');
      if(own){R(x+2,y+2,48,1,'rgba(255,255,255,.35)');R(x+4,y+4,44,16,'rgba(8,10,24,.35)');g.drawImage(c.ic||IC.card,x+20,y+6);text(c.short,x+26,y+23,'#ffffff',6,'center','#080c28');}
      else text('?',x+26,y+12,'#3a4a98',8,'center');});
    const c=CARDS[cc],own=st.cards[c.id];panel(8,142,W-16,36);
    text(own?c.name:'???',16,148,'#fff2a8',8,'left','#080c28');
    text(own?'A: read the card':'Get it: '+c.src,16,162,'#ffffff',8,'left','#080c28');
    const fc=Object.values(st.fish).reduce((a,b)=>a+b,0);
    text('Cards '+nCards()+'/'+CARDS.length+'   Fish caught '+fc,W/2,FH-16,'#aeb7c2',8,'center');
  }else{
    if(cur.ow){
      for(const id in SHORT){const s=SC[id];if(!s)continue;const x=7+s.ax*49,y=24+(s.ay+1)*30,here=id==curId,v=st.vis[id],cw=46,ch=28;
        R(x,y,cw,ch,here&&(frame>>4)&1?'#fff2a8':'#080a18');R(x+1,y+1,cw-2,ch-2,v?(s.ay==2?'#2f5f96':s.ay==3?'#5a6a3a':s.ay<0?'#4a6a3a':'#3a6a48'):'#1e2446');
        if(v){const [a,b]=SHORT[id];text(a,x+cw/2,y+3,'#ffffff',6,'center','#080c28');if(b)text(b,x+cw/2,y+10,'#ffffff',6,'center','#080c28');}
        else text('?',x+cw/2,y+8,'#4a5486',8,'center');
        const rs=Object.values(s.reads).concat(Object.values(s.readsT||{})).filter(r=>r[0]!='!'),u=[...new Set(rs)];
        if(v&&u.length){const n=u.filter(r=>st.lore[r]).length;R(x+3,y+20,5,5,n==u.length?'#fff2a8':'#aeb7c2');R(x+4,y+21,3,1,'#5a4a3a');}
        {const cn=(s.npcs||[]).find(n=>n.chal);if(cn&&v){R(x+11,y+20,5,5,st.pins[cn.chal]?'#f2c14e':'#2c3460');}}
        if(OWKEY[id]){const k=OWKEY[id];if(st.got[k])g.drawImage(KSIC[k],0,0,12,12,x+19,y+18,8,8);else if(v){R(x+19,y+18,8,8,'#2c3460');}}
        if(here)R(x+cw-6,y+2,4,4,'#e83048');
        if(id==goalScene()&&(frame>>3)&1){R(x+cw-11,y+17,7,7,'#1a1423');R(x+cw-10,y+18,5,5,'#f2c14e');R(x+cw-8,y+16,1,9,'#f2c14e');R(x+cw-12,y+20,9,1,'#f2c14e');}
        if(m.mc==id){g.strokeStyle='#fff2a8';g.lineWidth=1;g.strokeRect(x-.5,y-.5,cw+1,ch+1);}}
    }else{
      text(AREAN[cur.area]||cur.name,W/2,28,'#fff2a8',8,'center','#080c28');
      const b=AREAB[cur.area],cols=b.x1-b.x0+1,rows=b.y1-b.y0+1,cw=46,ch=32,x0=(W-cols*(cw+4))/2|0,y0=44;
      for(const id in SC){const s=SC[id];if(s.area!=cur.area)continue;const x=x0+(s.ax-b.x0)*(cw+4),y=y0+(s.ay-b.y0)*(ch+4),here=id==curId,v=st.vis[id];
        R(x,y,cw,ch,here&&(frame>>4)&1?'#fff2a8':'#080a18');R(x+1,y+1,cw-2,ch-2,v?'#4a3a6a':'#1e2446');
        if(s.bossT&&v){if(st.f['boss:'+id])g.drawImage(KSIC[s.reward]||IC.key,x+cw/2-6,y+10);else{R(x+cw/2-4,y+10,8,8,'#e8e4dc');R(x+cw/2-3,y+12,2,2,'#1a1423');R(x+cw/2+1,y+12,2,2,'#1a1423');}}
        if(s.entry&&v)mtext('E',x+3,y+3,'#ffffff');}
      text('Keys here: '+(st.keys[cur.area]||0),W/2,172,'#ffffff',8,'center');
    }
    text(cur.ow?(m.mc&&m.mc!=curId&&st.vis[m.mc]?'A: ride the bus to '+SC[m.mc].name:'Arrows: pick a place   B: next tab'):'B: next tab   MENU: close',W/2,FH-14,'#aeb7c2',6,'center');
  }
}
MF.E='111100111100111';
function drawShop(){
  const x0=14,y0=HUD+14,w=W-28,h=140;panel(x0,y0,w,h);
  text('CARYTOWN GOODS',x0+10,y0+9,'#fff2a8',8,'left','#080c28');D(COIN[0].r,x0+w-40,y0+8);mtext(st.coins,x0+w-28,y0+10,'#fff2a8');
  const top=Math.max(0,Math.min(SHOP.length-7,shop.cur-3));if(top>0)text('^',x0+w-6,y0+18,'#aeb7c2',6,'center');if(top+7<SHOP.length)text('v',x0+w-6,y0+108,'#aeb7c2',6,'center');
  SHOP.forEach((it,i)=>{if(i<top||i>=top+7)return;const y=y0+24+(i-top)*13,sel=i==shop.cur,why=it.why();if(sel)R(x0+6,y-3,w-12,13,'#2c3a8a');
    text((sel?'> ':'  ')+it.name,x0+8,y,why?'#7a84b6':'#ffffff',8,'left','#080c28');text(why||String(it.price),x0+w-10,y,why?'#7a84b6':'#fff2a8',8,'right','#080c28');});
  text(shop.msg,x0+w/2,y0+114,'#aeb7c2',8,'center');text('A: buy   B: leave',x0+w/2,y0+127,'#ffffff',8,'center');
}
const SKY=['#0c1030','#141a44','#22245a','#3a2a66','#6a3a6e','#a8505e','#e08a58'];
function drawTitleBg(){
  SKY.forEach((c,i)=>{R(0,i*21,W,21,c);if(i)for(let x=0;x<W;x+=2){R(x,i*21,1,1,SKY[i-1]);R(x+1,i*21-1,1,1,c);}});
  for(let i=0;i<40;i++){const q=HH(i,3,9);if(((frame>>4)+i)%7)R(q%W,(q>>8)%70,1,1,i%5?'#c8d0f0':'#ffffff');}
  R(196,22,14,14,'#fff2c8');R(194,25,18,8,'#fff2c8');R(198,20,10,18,'#fff2c8');R(200,26,3,3,'#e8d8a0');R(205,31,2,2,'#e8d8a0');
  drawSkyline();
  ['#3a2a66','#2a2660','#1c2250','#141a44'].forEach((c,i)=>R(0,150+i*13,W,13,c));
  for(let i=0;i<26;i++){const q=HH(i,8,1),y=152+(q>>8)%46;R(((q%W)+((frame>>2)*(i&1?1:-1))+W*4)%W,y,6+(q>>4)%10,1,i%4?'#6a5a9a':'#f0a878');}
  drawRiverFront();
  drawFog(.2);
}
function draw(){
  g=buf.getContext('2d');
  if(mode=='name')drawName();
  else if(mode=='intro')drawIntro();
  else if(mode=='mini')drawMiniGame();
  else if(mode=='relight')drawRelight();
  else if(mode=='credits')drawCredits();
  else if(mode=='title'||mode=='win'){
    drawTitleBg();
    if(mode=='title'){
      text('RIVER CITY',W/2+2,26,'#6a1c2c',16,'center');text('RIVER CITY',W/2,24,'#f2c14e',16,'center');
      text('QUEST',W/2+2,48,'#6a1c2c',16,'center');text('QUEST',W/2,46,'#fff2a8',16,'center');
      text('The Tunnel Under Church Hill',W/2,70,'#e8ecf8',8,'center','#1a1423');
      const opts=titleOpts(),top=tl.lv>=3?80:88,sp=opts.length>9?10:opts.length>4?11:13;R(14,top-6,W-28,opts.length*sp+8,'rgba(8,10,24,.6)');
      opts.forEach((o,i)=>{const y=top+i*sp,sel=i==titleSel;if(sel){R(18,y-3,W-36,sp-1,'rgba(8,10,24,.78)');}text((sel?'> ':'  ')+o+(sel?' <':'  '),W/2,y,sel?'#ffffff':'#aeb7c2',8,'center','#1a1423');});
      if(tl.msgT>0)tl.msgT--;
      const hint=tl.msgT>0?tl.msg:capture?'Press a key for '+ACTN[capture]+'...':tl.lv==2?'Slot '+saveSlot+' will be erased.':tl.lv==4?'Arrows and Enter always work. Gamepads too.':tl.lv?'B: back':'Gamepad: A, X/B, Start';
      text(hint,W/2,FH-14,capture||tl.lv==2?'#f0a878':'#aeb7c2',8,'center','#1a1423');
    }else{
      text('THE FOG LIFTS',W/2+2,30,'#6a1c2c',16,'center');text('THE FOG LIFTS',W/2,28,'#f2c14e',16,'center');
      text('Richmond is safe.',W/2,58,'#ffffff',8,'center','#1a1423');
      text('Stories '+nLore()+'/'+LORE.length+'   Hearts '+p.max/2,W/2,76,'#e8ecf8',8,'center','#1a1423');
      text('Coins '+st.coins+'   Foes '+st.kills+'   Cards '+nCards()+'/'+CARDS.length,W/2,90,'#e8ecf8',8,'center','#1a1423');
      text('Time '+fmtTime(st.time)+(st.ng?'   NG+'+(st.ng>1?st.ng:''):''),W/2,102,'#fff2a8',8,'center','#1a1423');
      const SPN={quarry:'Quarry',pyramid:'Pyramid',poe:'Poe',carillon:'Carillon',tredegar:'Tredegar',conserv:'Garden',tunnel:'Tunnel'},sp=Object.keys(SPN).filter(k=>st.splits&&st.splits[k]).sort((a,b)=>st.splits[a]-st.splits[b]);
      if(sp.length)R(0,129,W,10+((sp.length+1)>>1)*9,'rgba(8,10,24,.75)');sp.forEach((k,i)=>text(SPN[k]+' '+fmtTime(st.splits[k]),(i%2?W*3/4:W/4),134+(i>>1)*9,'#c8d0f0',6,'center','#1a1423'));
      if(winT>60)text('B: share your time',W/2,FH-12,'#aeb7c2',6,'center','#1a1423');
      if(winT>60&&(frame>>5)&1)text('PRESS A',W/2,116,'#ffffff',8,'center','#1a1423');
    }
  }else if(menu){drawMenu();}
  else{
    const sx=shake&&!OPT.calm?rnd(3)-1:0,sy=shake&&!OPT.calm?rnd(3)-1:0;
    g.save();g.beginPath();g.rect(0,HUD,W,PH);g.clip();g.translate(sx,HUD+sy);
    if(trans&&trans.iris&&trans.t<16)g.drawImage(trans.old,0,0);
    else if(trans&&!trans.fade&&!trans.iris){const k=trans.t/20,e=k*k*(3-2*k),ox=Math.round(trans.dx*W*e),oy=Math.round(trans.dy*PH*e);
      g.drawImage(trans.old,-ox,-oy);g.save();g.translate(trans.dx*W-ox,trans.dy*PH-oy);drawWorld();g.restore();}
    else{g.save();g.translate(-cam.x,-cam.y);drawWorld();g.restore();}
    if(trans&&trans.fade){g.globalAlpha=Math.min(1,trans.t<12?trans.t/11:(24-trans.t)/12);R(0,0,W,PH,'#000');g.globalAlpha=1;}
    const irisOld=trans&&trans.iris&&trans.t<16;
    if(irisOld);else if(cur.interior&&!cur.lit)drawLight();
    else if(cur.ow)drawSky();
    if(!cur.ow&&!irisOld)g.drawImage(vigC,0,0);
    if(trans&&trans.iris)drawIris();
    const b=enemies.find(e=>e.boss);
    if(b){R(77,5,102,7,'#1a1423');R(78,6,100,5,'#3a1c30');R(78,6,Math.round(100*b.hp/(b.mhp||HPS[b.type])),5,'#e83048');R(78,6,Math.round(100*b.hp/(b.mhp||HPS[b.type])),1,'#f890a0');}
    if(flash>0){g.globalAlpha=flash/8;R(0,0,W,PH,'#ffffff');g.globalAlpha=1;flash--;}
    if(hurtT>0){g.globalAlpha=hurtT/12*.35;R(0,0,W,PH,'#e83048');g.globalAlpha=1;}
    if(fade>0){g.globalAlpha=fade/10;R(0,0,W,PH,'#000');g.globalAlpha=1;}
    g.restore();
    drawHUD();
    if(fish&&!dlg)drawFishUI();
    if((OPT.timer||st.rush)&&!dlg)text(fmtTime(st.time),W-3,FH-11,'#ffffff',8,'right','#1a1423');
    if(chal&&chal.t!=null){const txt=chal.d.name+'  '+Math.ceil(chal.t/60)+'s  '+chal.got+'/'+chal.need,w=txt.length*8+16,x=(W-w)/2|0;
      R(x,HUD+4,w,16,'rgba(8,10,24,.88)');R(x,HUD+19,w,1,chal.t<300&&(frame>>3)&1?'#e83048':'#f2c14e');text(txt,W/2,HUD+8,'#ffffff',8,'center');}
    else if(bannerT>0&&!dlg&&!shop&&!(trans&&trans.iris&&trans.t<22))drawBanner();
    if(toastT>0&&!dlg&&!shop)drawToast();
    if(shop)drawShop();
    if(dlg)drawDlg();
  }
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(buf,0,0,W*S,FH*S);
  ctx.setTransform(S,0,0,S,0,0);flushText();
}
function drawQuests(){const Q=quests(),n=Q.filter(q=>q[2]).length,top=Math.min(menu.qs||0,Math.max(0,Q.length-13));text('Quests '+n+'/'+Q.length,W/2,25,'#fff2a8',8,'center','#080c28');
  if(top>0)text('^',W-8,25,'#aeb7c2',6,'center');if(top+13<Q.length)text('v',W-8,152,'#aeb7c2',6,'center');
  Q.forEach(([name,prog,done],j)=>{const i=j-top;if(i<0||i>=13)return;const y=36+i*9;R(10,y,7,7,done?'#58a848':'#26306a');if(done){R(11,y+3,2,2,'#ffffff');R(13,y+4,2,2,'#ffffff');R(15,y+1,1,4,'#ffffff');}
    text(name,22,y,done?'#aeb7c2':'#ffffff',6,'left','#080c28');if(prog)text(prog,W-10,y,done?'#7a84b6':'#fff2a8',6,'right','#080c28');});
  wrap(tr('NEXT: ')+goal(),40).slice(0,2).forEach((l,i)=>text(l,10,166+i*9,'#fff2a8',6,'left','#080c28'));}
