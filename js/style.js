"use strict";
/* River City Quest: Richmond's look. Cast-iron porches and railings, ghost signs and murals on old brick,
   neighborhood house styles, the James River palette, magnolias and dogwoods, and the skyline. */

/* ---------- a 3x5 pixel font for painted signs ---------- */
const F5={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',
  I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',
  Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',
  Y:'101101010010010',Z:'111001010100111','&':'010101010101011','.':'000000000000010',' ':'000000000000000','5':'111100110001110','C2':'011100100100011'};
function sign5(str,x,y,sc,col){let q=x;for(const ch of str){const m=F5[ch];if(m)for(let i=0;i<15;i++)if(m[i]=='1')R(q+(i%3)*sc,y+(i/3|0)*sc,sc,sc,col);q+=4*sc;}}

/* ---------- where the ghost signs and murals go ---------- */
const SIGNS=['FLOUR & FEED','TOBACCO','DRY GOODS','COAL & ICE','HARDWARE','GINGER ALE','RIVER CITY SOAP','CIGARS','FURNITURE','OYSTERS','SEED & GRAIN','PIANOS'];
const DECOR={'ow:0,0':['sign','mural'],'ow:1,0':['sign','mural'],'ow:2,0':['sign'],'ow:3,1':['sign','sign'],'ow:2,3':['mural','sign','mural'],'ow:1,1':['mural','mural'],'ow:0,1':['mural','mural'],'ow:3,2':['sign'],'ow:1,2':[]};
function decorFor(s){if(s.decor)return s.decor;s.decor=[];s.decoCells=new Set();const want=(DECOR[s.id]||[]).slice();if(!want.length||!s.g0)return s.decor;
  const runs=[];for(let y=1;y<s.h-1;y++){let x0=-1;for(let x=0;x<=s.w;x++){const ok=x<s.w&&s.g0[y][x]=='B'&&s.g0[y+1]&&s.g0[y+1][x]!='B'&&s.g0[y-1][x]=='B';
      if(ok&&x0<0)x0=x;if(!ok&&x0>=0){if(x-x0>=5)runs.push([x0,y,x-x0]);x0=-1;}}}
  runs.sort((a,b)=>b[2]-a[2]||HH(a[0],a[1],s.seed)%7-HH(b[0],b[1],s.seed)%7);
  for(const r of runs){if(!want.length)break;const kind=want.shift(),len=Math.min(r[2],kind=='sign'?9:8),x0=r[0]+((r[2]-len)>>1),k=HH(s.seed,r[1],x0)>>>0;
    s.decor.push({kind,x:x0,y:r[1],len,k});for(let i=0;i<len;i++)s.decoCells.add((x0+i)+','+r[1]);}
  return s.decor;}
function isDecor(s,tx,ty){return s.decoCells&&s.decoCells.has(tx+','+ty);}
function drawDecor(s){for(const d of decorFor(s)){const x=d.x*TS,y=d.y*TS,w=d.len*TS;
  if(d.kind=='sign'){const txt=SIGNS[d.k%SIGNS.length],sc=txt.length*8<=w-8?2:1,tw=txt.length*4*sc-sc,th=5*sc;
    g.globalAlpha=.42;R(x+3,y+3,w-6,11,'#e8dcc0');g.globalAlpha=.5;sign5(txt,x+((w-tw)>>1),y+3+((11-th)>>1),sc,'#6a1c1c');
    g.globalAlpha=1;for(let i=0;i<w/3;i++){const q=HH(d.k,i,9);if(q%3==0){const px=x+3+q%(w-6),py=y+3+(q>>8)%11;R(px,py,1+(q>>12)%2,1,'#a85040');}}}
  else{drawMural(d.k%6,x+1,y+2,w-2,12);R(x+1,y+14,w-2,1,'rgba(10,8,24,.3)');}}}
function drawMural(kind,x,y,w,h){
  if(kind==0){const sky=['#f08a4a','#f8b86a','#f8d890'];sky.forEach((c,i)=>R(x,y+i*2,w,2,c));R(x,y+6,w,h-6,'#3e6a8a');R(x+(w>>1)-4,y+1,8,5,'#fff2a8');
    for(let i=0;i<w;i+=6)R(x+i,y+8+((i>>2)&1),4,1,'#a8c8e0');for(let i=6;i<w;i+=17)R(x+i,y+10,4,2,'#8a8e9c');}
  else if(kind==1){R(x,y,w,h,'#2e8a8a');for(let i=4;i<w-4;i+=12){const cx=x+i+2,cy=y+6;R(cx-3,cy-1,7,3,'#ffffff');R(cx-1,cy-3,3,7,'#ffffff');R(cx-3,cy-1,1,1,'#f080a0');R(cx+3,cy+1,1,1,'#f080a0');R(cx,cy,1,1,'#d8b048');}}
  else if(kind==2){R(x,y,w,h,'#f2c14e');for(let i=3;i<w-8;i+=14){R(x+i,y+4,6,4,'#c41e3a');R(x+i+5,y+2,3,3,'#c41e3a');R(x+i+7,y+3,2,1,'#f08030');R(x+i-1,y+5,2,2,'#8a1424');R(x+i+6,y+3,1,1,'#1a1423');}}
  else if(kind==3){R(x,y,w,h,'#1e2a5e');const C=['#e83048','#f2c14e','#3ac2e8','#58c868','#f890a0'];for(let i=0;i<w;i+=6){const c=C[(i/6)%5];for(let j=0;j<6;j++)R(x+i+j,y+h-1-Math.min(j,5-j)*2,1,1+Math.min(j,5-j)*2,c);}}
  else if(kind==4){R(x,y,w,h,'#a8d0e0');R(x,y+9,w,3,'#6a9ab0');for(let i=6;i<w-6;i+=22){R(x+i,y+2,2,8,'#5a6470');R(x+i-2,y+2,4,2,'#5a6470');R(x+i-4,y+3,2,1,'#e8b048');R(x+i+2,y+5,4,3,'#7a8490');R(x+i+1,y+10,1,2,'#3a4048');R(x+i+3,y+10,1,2,'#3a4048');}}
  else{R(x,y,w,h,'#6a3a8a');for(let i=0;i<w;i+=5){const hh=3+HH(i,x,3)%7;R(x+i,y+h-hh,4,hh,'#2a1a3a');if(hh>5)R(x+i+1,y+h-hh+2,1,1,'#f8d868');}R(x+3,y+2,3,3,'#fff2a8');}}

/* ---------- cast iron ---------- */
function ironPorch(x,y,tint){const I='#1a1a22',H='#4a4a58';
  R(x,y+5,16,2,I);R(x,y+5,16,1,H);R(x+1,y+7,2,7,I);R(x+13,y+7,2,7,I);R(x+1,y+7,1,7,H);
  for(let i=3;i<13;i+=3){R(x+i,y+8,2,1,I);R(x+i,y+9,1,1,I);R(x+i+1,y+10,1,1,I);}
  R(x,y+11,16,1,I);R(x,y+14,16,1,I);for(let i=1;i<16;i+=2)R(x+i,y+12,1,2,I);for(let i=2;i<16;i+=4){R(x+i,y+12,1,1,H);}
  R(x,y+15,16,1,'rgba(10,8,24,.3)');}
function ironCurl(x,y,fx,fy,c,h){const P=[[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[0,3],[2,2],[3,2],[3,3],[2,3]];for(const [a,b] of P)R(x+a*fx,y+b*fy,1,1,c);R(x+(fx>0?1:-1),y+(fy>0?1:-1),1,1,h);}

/* ---------- neighborhood house styles ---------- */
function styledFacade(s,x,y,h,tx,ty,c){
  const hs=s.hs,ft=h%4,clap=c[3]=='clap';
  if(hs=='glass'){R(x,y,16,16,'#a8d8d8');for(let i=0;i<16;i+=4){R(x+i,y,1,16,'#eef6f2');}for(let j=3;j<16;j+=5)R(x,y+j,16,1,'#eef6f2');R(x+2,y+2,3,3,'#d8f0f0');R(x,y+15,16,1,'#6a8a8a');return true;}
  if(clap){R(x,y,16,16,c[0]);for(let j=1;j<16;j+=3){R(x,y+j,16,1,c[1]);R(x,y+j+1,16,1,c[2]);}R(x+15,y,1,16,c[1]);}
  if(hs=='fan'&&ft>0&&ft<3){R(x+2,y+3,12,11,'#efe4c8');R(x+3,y+4,10,9,'#d8ccb0');R(x+2,y+3,12,1,'#fffaf0');R(x+2,y+14,12,1,'rgba(10,8,24,.35)');
    for(const a of[4,7,10]){const lit=(h>>(5+a))%3==0;R(x+a,y+5,2,7,lit?'#f8d868':'#28406a');if(!lit)R(x+a,y+5,1,1,'#88a8d8');}
    if(s.ow)(s.wins||(s.wins={}))[x+','+y]=[x,y,(h>>7)%3!=0];
    for(let i=1;i<16;i+=3)R(x+i,y+2,1,1,'#8a7a60');return true;}
  if(hs=='hill'&&ft>0&&ft<3){for(const a of[3,9]){R(x+a-1,y+4,1,8,'#2f6a3a');R(x+a+4,y+4,1,8,'#2f6a3a');R(x+a,y+4,4,8,'#efe4c8');R(x+a+1,y+5,2,6,'#28406a');R(x+a+1,y+8,2,1,'#efe4c8');}
    if(s.ow)(s.wins||(s.wins={}))[x+','+y]=[x,y,(h>>7)%3!=0];return true;}
  if(hs=='ware'&&ft>0){for(const a of[2,9]){R(x+a,y+5,5,9,'#c8bca8');R(x+a+1,y+4,3,1,'#c8bca8');R(x+a+1,y+6,3,8,'#24324e');R(x+a+2,y+5,1,1,'#24324e');R(x+a+1,y+9,3,1,'#c8bca8');R(x+a+1,y+6,1,1,'#6a88b8');}
    if(ft==3){R(x+3,y+4,10,12,'#1a1423');R(x+4,y+5,8,11,'#2f5a3a');R(x+8,y+5,1,11,'#1a1423');R(x+4,y+9,8,1,'#24482e');}
    if(s.ow&&ft<3)(s.wins||(s.wins={}))[x+','+y]=[x,y,(h>>7)%3!=0];return true;}
  return false;}
function wantsPorch(s,h){return(s.hs=='jw'&&h%3!=1)||(s.hs=='hill'&&h%3==0)||(s.hs=='fan'&&h%5==0);}
function tinRoof(x,y,h,nb){R(x,y,16,16,'#8a929c');for(let i=1;i<16;i+=4){R(x+i,y,1,16,'#b8c0c8');R(x+i+1,y,1,16,'#6a727c');}
  if(h%5==0)R(x+2+h%9,y+3,3,2,'#a86a4a');
  if(nb(0,-1)!='B'){R(x,y,16,2,'#c8d0d8');R(x,y+2,16,1,'#4a525c');}if(nb(-1,0)!='B')R(x,y,1,16,'#c8d0d8');if(nb(1,0)!='B')R(x+15,y,1,16,'#4a525c');}
function glassRoof(x,y,h,nb){R(x,y,16,16,'#9ad0d0');for(let i=0;i<16;i+=4)R(x+i,y,1,16,'#e4f4f0');for(let j=0;j<16;j+=4)R(x,y+j,16,1,'#e4f4f0');R(x+5,y+5,4,4,'#c8ecec');
  if(nb(0,-1)!='B')R(x,y,16,2,'#4a6a6a');if(nb(-1,0)!='B')R(x,y,2,16,'#4a6a6a');if(nb(1,0)!='B')R(x+14,y,2,16,'#4a6a6a');}

/* ---------- the James River and the ponds ---------- */
const WATER={river:{base:'#4a6e62',dark:'#3e5e54',hi:'#b8d4c0',mid:'#7a9e8a',shade:'#2c4640',foam:'#e8f4ea',rapid:'#5e8878'},
  pond:{base:'#3a7a86',dark:'#326c78',hi:'#a8dce0',mid:'#5aa0b0',shade:'#24505c',foam:'#d8f4f4',rapid:'#4a8a9a'}};
function waterOf(s){return s.ow&&(s.ay>=2||s.id=='ow:2,3')&&s.id!='ow:0,2'&&s.id!='ow:1,3'?WATER.river:WATER.pond;}
function boulder(x,y,h){R(x+3,y+7,10,7,'#1a1423');R(x+4,y+6,8,8,'#1a1423');R(x+4,y+7,8,6,'#8e909c');R(x+5,y+6,6,1,'#a8aab4');R(x+5,y+7,3,2,'#c4c6ce');R(x+9,y+11,3,2,'#6a6c78');
  R(x+2,y+13,12,1,'#e8f4ea');R(x+1,y+12,2,1,'#e8f4ea');R(x+13,y+12,2,1,'#e8f4ea');}

/* ---------- magnolias and dogwoods ---------- */
function treeKind(h){const q=HH(h,3,4)%7;return q==0?'magnolia':q==1?'dogwood':'oak';}
function magnolia(x,y,h){blob(x,y,'#1f5a3a','#143c28','#0c2a1a');R(x+4,y+2,4,2,'#3a8a5a');R(x+9,y+5,3,1,'#3a8a5a');R(x+3,y+6,2,1,'#3a8a5a');
  const sn=typeof season=='function'?season():'summer';if(sn=='spring'||sn=='summer')for(const [a,b] of [[5,4],[10,3],[7,8]]){R(x+a,y+b,3,3,'#fffaf0');R(x+a+1,y+b+1,1,1,'#e8d890');}}
function dogwood(x,y,h){const sn=typeof season=='function'?season():'summer';
  if(sn=='fall'){blob(x,y,'#a83a28','#7a2418','#4a140c');R(x+4,y+2,4,2,'#d86a48');R(x+9,y+5,2,1,'#e8a048');return;}
  if(sn=='winter'){R(x+7,y+3,2,8,'#5a3a24');R(x+4,y+4,3,1,'#5a3a24');R(x+9,y+5,3,1,'#5a3a24');R(x+5,y+2,1,2,'#5a3a24');R(x+10,y+3,1,2,'#5a3a24');return;}
  blob(x,y,'#3a8a3a','#2a6a2a','#143c22');if(sn=='spring')for(let i=0;i<7;i++){const q=HH(h,i,21);R(x+3+q%10,y+2+(q>>4)%8,2,2,i%3?'#ffffff':'#f8b8d0');}else{R(x+4,y+2,4,2,'#58a850');}}

/* ---------- the skyline for the title and ending ---------- */
function drawSkyline(){const D='#141226',E='#24203c',WIN=(x,y)=>HH(x,y,(frame>>6))%9?'#f8d868':'#a88030';
  for(let i=0;i<W;i+=11){const q=HH(i,5,2),hh=14+q%22,w=9+(q>>6)%3;R(i,150-hh,w,hh,D);for(let y=150-hh+4;y<146;y+=6)for(let x=i+2;x<i+w-2;x+=3)if(HH(x,y,4)%4==0)R(x,y,1,2,WIN(x,y));}
  // the Carillon: square tower, open belfry, little spire
  R(18,72,12,78,D);R(17,70,14,3,E);R(20,58,8,12,D);R(21,60,2,7,'#3a3458');R(25,60,2,7,'#3a3458');R(22,50,4,8,D);R(23,46,2,4,D);
  // the James Monroe Building and the Riverfront Plaza towers
  R(60,64,22,86,D);R(60,64,22,2,E);for(let y=68;y<146;y+=5)for(let x=62;x<80;x+=3)if(HH(x,y,7)%3==0)R(x,y,2,2,WIN(x,y));
  for(const [x,t] of [[200,80],[220,72]]){R(x,t,16,150-t,D);R(x,t,16,2,E);for(let y=t+4;y<146;y+=5)for(let xx=x+2;xx<x+14;xx+=3)if(HH(xx,y,8)%3==0)R(xx,y,2,2,WIN(xx,y));}
  // the Capitol: temple front with columns and a pediment
  R(96,112,48,38,D);for(let i=0;i<10;i++)R(98+i,111-i,44-i*2,1,D);for(let x=100;x<142;x+=5)R(x,116,2,28,'#2c2848');R(94,144,52,6,D);
  // Main Street Station: clock tower with a pyramid roof
  R(168,78,12,72,D);for(let i=0;i<8;i++)R(168+i,78-i,12-i*2,1,D);R(171,86,6,6,'#e8dcb0');R(173,87,1,3,'#1a1423');R(173,89,3,1,'#1a1423');R(160,120,28,30,D);
  for(const x of[164,172,180])R(x,126,4,6,WIN(x,126));
}
function drawRiverFront(){
  // Mayo Bridge: low arches across the rapids
  R(0,158,W,4,'#0c0a18');R(0,157,W,1,'#3a3458');for(let x=6;x<W;x+=26){R(x,162,4,10,'#0c0a18');for(let i=0;i<8;i++)R(x+4+i,162+Math.round(Math.sqrt(64-(i-4)*(i-4))/2),1,1,'#0c0a18');}
  // rocks in the falls and the Pipeline walkway
  for(let i=0;i<9;i++){const q=HH(i,9,3),x=(q%W),y=176+(q>>8)%14;R(x,y,6+(q>>4)%4,3,'#2a2640');R(x+1,y-1,4,1,'#3a3458');if((frame>>3)+i&1)R(x-2,y+2,3,1,'#c8d0f0');}
  R(0,190,W,2,'#1a1830');for(let x=4;x<W;x+=14)R(x,190,1,6,'#1a1830');
}
