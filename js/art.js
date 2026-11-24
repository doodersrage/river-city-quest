"use strict";
/* River City Quest: Tile art and the hand-drawn Richmond landmarks. */
/* ---------- tile art ---------- */
function R(x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function grass(x,y,h){
  R(x,y,16,16,'#58a848');
  for(let i=0;i<4;i++){const q=HH(h,i,7);R(x+q%13,y+(q>>4)%14,2+(q>>8)%3,1+(q>>11)%2,i&1?'#4c9a40':'#68b854');}
  if(h%3==0){const a=x+2+(h>>3)%10,b=y+4+(h>>7)%9;R(a,b,1,1,'#2f7a38');R(a+1,b-1,1,2,'#2f7a38');R(a+2,b,1,1,'#2f7a38');R(a+1,b-2,1,1,'#84cc68');}
}
function flowers(x,y,h){
  grass(x,y,h+1);const cs=['#f8e060','#f08098','#ffffff','#b890f8'];
  for(let i=0;i<4;i++){const q=HH(h,i,3),a=x+1+(i&1)*8+q%5,b=y+1+(i>>1)*8+(q>>3)%5;R(a,b+2,1,2,'#2f7a38');R(a-1,b,3,2,cs[(q>>6)%4]);R(a,b-1,1,1,cs[(q>>6)%4]);R(a,b,1,1,'#f8a030');}
}
function cobble(x,y,h){
  R(x,y,16,16,'#5e5450');const tn=['#9a8e88','#a89c94','#8a7e78'],hi=['#b4a8a0','#c2b6ae','#a4988f'];
  for(let r=0;r<4;r++){const segs=r&1?[[0,4],[4,8],[12,4]]:[[0,8],[8,8]];
    segs.forEach((sg,i)=>{const q=HH(h,r,(r&1&&i==2)?0:i)%3;R(x+sg[0],y+r*4,sg[1]-1,3,tn[q]);R(x+sg[0],y+r*4,sg[1]-1,1,hi[q]);});}
}
function sidewalk(x,y,h){
  R(x,y,16,16,'#c4bcae');R(x,y,16,1,'#dad2c4');R(x,y,1,16,'#dad2c4');R(x,y+15,16,1,'#a39b8d');R(x+15,y,1,16,'#a39b8d');
  for(let i=0;i<3;i++){const q=HH(h,i,9);R(x+2+q%12,y+2+(q>>4)%12,1,1,i?'#b0a898':'#d4ccbe');}
  if(h%7==0){R(x+5,y+6,3,1,'#a39b8d');R(x+8,y+7,2,1,'#a39b8d');R(x+10,y+8,1,2,'#a39b8d');}
}
function sand(x,y,h){
  R(x,y,16,16,'#e2cf96');
  for(let i=0;i<7;i++){const q=HH(h,i,5);R(x+q%15,y+(q>>4)%15,1+(q>>9)%2,1,i&1?'#cdb97c':'#f4e8ba');}
  if(h%6==0){R(x+9,y+9,3,2,'#f8f0e0');R(x+9,y+11,3,1,'#c8b890');}
}
function floor(s,x,y,h){
  const f=s.fl||['#4a4458','#38324a','#5c566c'];R(x,y,16,16,f[0]);
  if(s.wood){for(let i=0;i<16;i+=4){R(x,y+i+3,16,1,f[1]);R(x,y+i,16,1,f[2]);}R(x+(h%2?4:11),y,1,16,f[1]);R(x+3+h%9,y+5,2,1,f[1]);}
  else{R(x,y,16,1,f[2]);R(x,y,1,16,f[2]);R(x,y+15,16,1,f[1]);R(x+15,y,1,16,f[1]);
    for(let i=0;i<3;i++){const q=HH(h,i,2);R(x+2+q%12,y+2+(q>>4)%12,1+(q>>8)%2,1,i?f[1]:f[2]);}
    if(h%5==0){R(x+4,y+9,2,1,f[1]);R(x+6,y+10,3,1,f[1]);R(x+8,y+11,1,2,f[1]);}}
}
function ground(s,ch,x,y,h){
  if(ch==',')flowers(x,y,h);else if(ch=='p')cobble(x,y,h);else if(ch=='s')sidewalk(x,y,h);else if(ch=='n')sand(x,y,h);else if(ch=='F')floor(s,x,y,h);else grass(x,y,h);
}
const GRASSY='.,T';
function fringe(x,y,h,nb){
  for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){if(!GRASSY.includes(nb(dx,dy)))continue;
    for(let i=0;i<16;i++){const q=HH(h,i+dx*3,dy+5),l=1+q%3+(i%4==1?1:0),a=dx?(dx<0?0:16-l):i,b=dy?(dy<0?0:16-l):i,w=dx?l:1,hh=dy?l:1;
      R(x+a,y+b,w,hh,q&8?'#4c9a40':'#58a848');
      const ex=dx?(dx<0?a+l:a-1):a,ey=dy?(dy<0?b+l:b-1):b;R(x+ex,y+ey,1,1,'rgba(30,60,30,.35)');}}
  if(GRASSY.includes(nb(0,-1))&&GRASSY.includes(nb(-1,0)))R(x,y,3,3,'#58a848');
  if(GRASSY.includes(nb(0,-1))&&GRASSY.includes(nb(1,0)))R(x+13,y,3,3,'#58a848');
  if(GRASSY.includes(nb(0,1))&&GRASSY.includes(nb(-1,0)))R(x,y+13,3,3,'#58a848');
  if(GRASSY.includes(nb(0,1))&&GRASSY.includes(nb(1,0)))R(x+13,y+13,3,3,'#58a848');
}
const BLOB=[6,10,12,14,14,14,14,14,12,12,10,6];
function blob(x,y,mid,dark,out){
  BLOB.forEach((w,i)=>{const a=x+8-w/2;R(a,y+i,w,1,mid);R(a,y+i,1,1,out);R(a+w-1,y+i,1,1,out);});
  R(x+5,y,6,1,out);R(x+5,y+11,6,1,out);
  R(x+8,y+8,5,2,dark);R(x+10,y+6,3,2,dark);R(x+6,y+9,3,1,dark);
}
function facade(s,x,y,h,tx,ty,roofAbove,plain){
  const pl=s.pal||[BRICK],c=pl[(tx+(ty>5?3:0))%pl.length];
  R(x,y,16,16,c[0]);
  for(let r=0;r<4;r++){R(x,y+r*4+3,16,1,c[1]);const o=r&1?4:0;R(x+o,y+r*4,1,3,c[1]);R(x+o+8,y+r*4,1,3,c[1]);
    const q=HH(h,r,4);if(q%3==0)R(x+((o+1+(q>>3)%2*8)%16),y+r*4,7,3,c[2]);}
  R(x+15,y,1,16,c[1]);R(x,y,1,16,c[2]);
  if(roofAbove)R(x,y,16,2,'rgba(10,8,24,.4)');else{R(x,y,16,2,'#efe4c8');R(x,y+2,16,1,'#8a7a60');R(x,y,16,1,'#fffaf0');}
  if(plain)return;
  const ft=h%4;
  if(ft==0){R(x+4,y+4,8,12,'#efe4c8');R(x+5,y+5,6,11,'#5a3420');R(x+6,y+6,4,3,'#28406a');R(x+6,y+6,1,1,'#88a8d8');R(x+6,y+10,4,5,'#7a4a2c');R(x+9,y+11,1,1,'#f2c14e');R(x+3,y+15,10,1,'#c8c0b0');}
  else if(ft<3){const lit=(h>>5)%3==0;if(s.ow)(s.wins||(s.wins={}))[x+','+y]=[x,y,(h>>7)%3!=0];R(x+3,y+4,10,9,'#efe4c8');R(x+4,y+5,8,7,lit?'#f8d868':'#28406a');R(x+7,y+5,2,7,'#efe4c8');R(x+4,y+8,8,1,'#efe4c8');
    if(lit){R(x+4,y+5,3,1,'#fff6c0');}else{R(x+5,y+5,1,1,'#88a8d8');R(x+4,y+6,1,1,'#88a8d8');R(x+10,y+9,1,1,'#5878a8');}
    R(x+2,y+13,12,1,'#d8ccb0');R(x+2,y+14,12,1,'rgba(10,8,24,.3)');}
  if(s.awn&&ft<3){const ac=[['#e83048','#ffffff'],['#2e9d6b','#ffffff'],['#3d63c8','#fff2a8']][(tx>>1)%3];
    for(let i=0;i<16;i+=2){R(x+i,y+2,2,3,ac[(i>>1)&1]);R(x+i,y+5,2,1,(i>>1)&1?'#c8c8d0':'#a01c30');}R(x,y+6,16,1,'rgba(10,8,24,.3)');}
}
function roof(x,y,h,nb){
  R(x,y,16,16,'#4c4854');
  for(let i=0;i<6;i++){const q=HH(h,i,6);R(x+q%15,y+(q>>4)%15,1,1,i&1?'#5c5866':'#403c48');}
  if(nb(0,-1)!='B'){R(x,y,16,2,'#74707e');R(x,y+2,16,1,'#34303c');}
  if(nb(-1,0)!='B'){R(x,y,2,16,'#74707e');R(x+2,y,1,16,'#34303c');}
  if(nb(1,0)!='B'){R(x+14,y,2,16,'#5e5a68');R(x+13,y,1,16,'#34303c');}
  const ft=h%6;
  if(ft==0){R(x+4,y+5,8,7,'#22202a');R(x+4,y+4,8,6,'#9aa0a8');R(x+4,y+4,8,1,'#c8ccd4');R(x+6,y+6,4,2,'#5c6068');}
  else if(ft==1){R(x+5,y+5,6,6,'#28406a');R(x+5,y+5,6,1,'#88a8d8');R(x+4,y+4,8,1,'#74707e');R(x+4,y+11,8,1,'#34303c');}
}
function wallFace(s,x,y,h){const c=s.wl||['#5b5368','#463f52','#756c85'];R(x,y,16,16,c[0]);
  for(let r=1;r<4;r++){R(x,y+r*4+3,16,1,c[1]);R(x+(r&1?4:0),y+r*4,1,3,c[1]);R(x+(r&1?12:8),y+r*4,1,3,c[1]);R(x,y+r*4,16,1,c[2]);}
  R(x,y,16,4,'#2a2434');R(x,y,16,1,'#4a445a');R(x,y+3,16,1,'#14101c');R(x,y+13,16,3,'rgba(10,8,24,.3)');}
function nbOf(s,tx,ty,dx,dy){const X=tx+dx,Y=ty+dy;return X<0||Y<0||X>=s.w||Y>=s.h?'':s.g[Y][X];}
function tile(s,ch,tx,ty,fr,plain){
  const x=tx*TS,y=ty*TS,h=HH(tx,ty,s.seed);
  const nb=(dx,dy)=>{const X=tx+dx,Y=ty+dy;return X<0||Y<0||X>=s.w||Y>=s.h?ch:s.g[Y][X];};
  const gb='.,psnF'.includes(s.base)?s.base:'.';
  switch(ch){
    case'.':case',':case'p':case's':case'n':case'F':ground(s,ch,x,y,h);
      if(ch=='.'&&h%5==0){const a=x+3+(h>>4)%9,b=y+9+(h>>9)%4,sw=fr==1?1:fr==3?-1:0;
        R(a,b,1,4,'#3d8a3a');R(a+2+sw,b-2,1,5,'#4c9a40');R(a+4,b+1,1,3,'#3d8a3a');R(a+2+sw,b-2,1,1,'#90d070');R(a+sw,b,1,1,'#84cc68');}
      if(ch=='p'||ch=='s'||ch=='n')fringe(x,y,h,nb);
      break;
    case'T':grass(x,y,h);
      if(nb(-1,0)=='T')R(x,y+1,8,13,'#1c5230');if(nb(1,0)=='T')R(x+8,y+1,8,13,'#1c5230');if(nb(0,-1)=='T')R(x+1,y,14,8,'#1c5230');if(nb(0,1)=='T')R(x+1,y+8,14,8,'#1c5230');
      R(x+3,y+13,11,2,'rgba(10,8,24,.3)');R(x+7,y+10,3,5,'#6a4424');R(x+7,y+10,1,5,'#4a2c14');
      blob(x,y,'#2f7a3c','#1f5a30','#143c22');R(x+4,y+2,4,2,'#58a850');R(x+3,y+4,3,2,'#58a850');R(x+5,y+2,2,1,'#90d070');R(x+9,y+4,2,1,'#58a850');
      {const q=HH(h,1,8);R(x+4+q%7,y+6+(q>>4)%3,1,1,'#143c22');R(x+6+(q>>7)%5,y+3,1,1,'#1f5a30');}
      break;
    case'B':if(nb(0,1)!='B')facade(s,x,y,h,tx,ty,nb(0,-1)=='B',plain);else roof(x,y,h,nb);break;
    case'C':
      if(nb(0,1)!='C'&&nb(0,1)!='D'){R(x,y,16,16,'#d0cec4');R(x,y,16,2,'#ffffff');R(x,y+2,16,1,'#a8a69c');
        for(const a of[1,9]){R(x+a,y+3,5,1,'#e4e2d8');R(x+a+1,y+4,3,10,'#ffffff');R(x+a+3,y+4,1,10,'#c4c2b8');R(x+a,y+14,5,2,'#e4e2d8');}
        R(x+6,y+4,3,10,'#8e8c84');R(x+14,y+4,2,10,'#8e8c84');R(x,y+4,1,10,'#8e8c84');
        if(h%2==0){R(x+6,y+7,3,7,'#3a2a20');}}
      else{R(x,y,16,16,'#dcdad0');for(let i=3;i<16;i+=4)R(x,y+i,16,1,'#c0beb4');
        if(nb(0,-1)!='C'){R(x,y,16,2,'#ffffff');R(x,y+2,16,1,'#a8a69c');}
        if(nb(-1,0)!='C')R(x,y,2,16,'#f4f2ea');if(nb(1,0)!='C')R(x+14,y,2,16,'#b8b6ac');}
      break;
    case'w':{
      R(x,y,16,16,'#2f6fb0');
      for(let i=0;i<3;i++){const q=HH(h,i,11);R(x+q%12,y+2+(q>>4)%12,4+(q>>8)%3,2,'#2a64a2');}
      for(let i=0;i<3;i++){const q=HH(h,i,12),a=(q%16+fr*2*(i&1?1:-1)+32)%16,b=2+i*5+(q>>4)%3;
        for(let k=0;k<5;k++)R(x+(a+k)%16,y+b,1,1,k<2?'#a8dcf4':'#5aa0d8');}
      const land=q=>q!='w'&&q!='='&&q!='-';
      if(h%13==0&&!land(nb(0,-1))&&!land(nb(0,1))&&!land(nb(-1,0))&&!land(nb(1,0))){const a=x+3+(h>>5)%6,b=y+4+(h>>8)%6,bob=fr>>1;
        R(a,b+bob+1,7,4,'#1e4a80');R(a,b+bob,7,4,'#3d8a3a');R(a+1,b+bob-1,5,6,'#3d8a3a');R(a+3,b+bob,1,2,'#2f6fb0');R(a+1,b+bob,2,1,'#68b854');
        if(h%2)R(a+5,b+bob-1,2,2,'#f08098');}
      if(h%3==0){const a=x+(h>>4)%12,b=y+(h>>7)%12;if((fr+(h>>2))%4==0){R(a,b,3,1,'#e8f8ff');R(a+1,b-1,1,3,'#e8f8ff');}}
      if(land(nb(0,-1))){R(x,y,16,3,'#1e4a80');for(let i=0;i<16;i++)if((i+fr+tx*3)%5<3)R(x+i,y+3,1,1,'#d8f4ff');}
      if(land(nb(0,1)))for(let i=0;i<16;i++)if((i+fr+tx)%4<2)R(x+i,y+15,1,1,'#d8f4ff');
      if(land(nb(-1,0)))for(let i=0;i<16;i++)if((i+fr+ty)%4<2)R(x,y+i,1,1,'#d8f4ff');
      if(land(nb(1,0)))for(let i=0;i<16;i++)if((i+fr*3+ty)%4<2)R(x+15,y+i,1,1,'#d8f4ff');
      if(nb(0,-1)=='='||nb(0,-1)=='-')R(x,y,16,4,'rgba(10,8,24,.35)');
      break;}
    case'_':R(x,y,16,16,'#0c0a14');
      if(nb(0,-1)!='_'){R(x,y,16,5,'#3a3438');R(x,y,16,1,'#5e5658');R(x,y+5,16,1,'#1c1820');}
      if(nb(-1,0)!='_')R(x,y,1,16,'#2a2630');if(nb(1,0)!='_')R(x+15,y,1,16,'#2a2630');if(nb(0,1)!='_')R(x,y+15,16,1,'#4a4448');
      {const q=HH(h,fr,3);R(x+2+q%10,y+9+(q>>4)%5,2,1,'rgba(240,128,48,'+(.18+.1*((fr+h)&1))+')');}
      break;
    case'z':floor(s,x,y,h);R(x+4,y+12,9,2,'rgba(10,8,24,.3)');R(x+5,y+10,7,3,'#6a4a2a');R(x+6,y+9,5,1,'#8a6a3a');R(x+7,y+5,2,5,'#7a8a3a');R(x+5,y+5,3,2,'#9aa04a');R(x+9,y+4,3,2,'#9aa04a');R(x+8,y+3,1,2,'#b8b860');break;
    case'1':floor(s,x,y,h);R(x+3,y+12,11,3,'rgba(10,8,24,.3)');R(x+5,y+10,7,4,'#6a4a2a');blob(x,y-1,'#3d8a3a','#2f6a30','#143c22');R(x+5,y+2,3,2,'#68b854');R(x+9,y+5,3,2,'#f08098');R(x+4,y+6,2,2,'#f8e060');break;
    case'|':R(x,y,16,16,'#0c0a14');for(let i=0;i<16;i+=4){R(x+1,y+i,14,3,'#2f6a30');R(x+1,y+i,14,1,'#58a848');R(x+2+((i>>2)*5+h)%9,y+i+1,3,1,'#84cc68');}R(x,y,1,16,'#1c4a22');R(x+15,y,1,16,'#1c4a22');break;
    case'+':ground(s,s.base,x,y,h);R(x+3,y+12,11,3,'rgba(10,8,24,.35)');R(x+5,y+4,6,11,'#1a1423');R(x+6,y+5,4,9,'#5c5e6a');R(x+6,y+5,1,9,'#8e909c');
      R(x+4,y+1,8,5,'#1a1423');R(x+5,y+2,6,3,'#f2c14e');R(x+7,y+3,2,1,'#1a1423');R(x+5,y+2,6,1,'#fff2a8');break;
    case'=':R(x,y,16,16,'#b88858');for(let i=0;i<16;i+=4){R(x,y+i+3,16,1,'#7a5430');R(x,y+i,16,1,'#d0a474');R(x+2+HH(h,i,1)%11,y+i+1,1,1,'#7a5430');}
      if(nb(-1,0)=='w'){R(x,y,3,16,'#5a3c20');R(x+1,y,1,16,'#8a6038');R(x+3,y,1,16,'rgba(10,8,24,.3)');}
      if(nb(1,0)=='w'){R(x+13,y,3,16,'#5a3c20');R(x+14,y,1,16,'#8a6038');}
      break;
    case'-':R(x,y,16,16,'#b88858');for(let i=0;i<16;i+=4){R(x+i+3,y,1,16,'#7a5430');R(x+i,y,1,16,'#d0a474');R(x+i+1,y+2+HH(h,i,1)%11,1,1,'#7a5430');}
      if(nb(0,-1)=='w'){R(x,y,16,3,'#5a3c20');R(x,y+1,16,1,'#8a6038');R(x,y+3,16,1,'rgba(10,8,24,.3)');}
      if(nb(0,1)=='w'){R(x,y+13,16,3,'#5a3c20');R(x,y+14,16,1,'#8a6038');}
      break;
    case'r':ground(s,gb,x,y,h);
      if(nb(-1,0)=='r')R(x,y+2,8,13,'#5c5e6a');if(nb(1,0)=='r')R(x+8,y+2,8,13,'#5c5e6a');if(nb(0,-1)=='r')R(x+1,y,14,8,'#5c5e6a');if(nb(0,1)=='r')R(x+1,y+8,14,8,'#5c5e6a');
      R(x+3,y+13,12,2,'rgba(10,8,24,.3)');
      g.save();g.translate(0,2);blob(x,y,'#8e909c','#6c6e7a','#3c3e48');g.restore();
      R(x+4,y+4,5,2,'#b8bac4');R(x+3,y+6,3,2,'#b8bac4');R(x+5,y+4,2,1,'#dcdee6');R(x+8,y+7,1,3,'#3c3e48');R(x+9,y+9,2,1,'#3c3e48');
      break;
    case'x':grass(x,y,h);R(x+5,y+13,9,2,'rgba(10,8,24,.3)');
      R(x+4,y+3,8,11,'#3a3e48');R(x+5,y+2,6,1,'#3a3e48');R(x+5,y+4,6,10,'#a0a4ae');R(x+5,y+3,6,1,'#a0a4ae');R(x+5,y+3,1,11,'#ccd0d8');R(x+6,y+3,4,1,'#ccd0d8');R(x+10,y+4,1,10,'#787c88');
      R(x+7,y+5,2,6,'#5c606c');R(x+6,y+7,4,1,'#5c606c');R(x+3,y+14,2,1,'#2f7a38');R(x+11,y+14,2,1,'#2f7a38');
      break;
    case'f':ground(s,gb,x,y,h);
      if(nb(-1,0)=='f'||nb(1,0)=='f'){R(x,y+14,16,1,'rgba(10,8,24,.3)');R(x,y+6,16,1,'#18181e');R(x,y+11,16,1,'#18181e');
        for(let i=2;i<16;i+=4){R(x+i,y+4,1,10,'#18181e');R(x+i,y+3,1,1,'#50505e');}R(x,y+2,2,12,'#282830');R(x,y+2,1,12,'#50505e');R(x,y+1,2,1,'#f2c14e');}
      else{R(x+9,y,1,16,'rgba(10,8,24,.3)');R(x+7,y,2,16,'#18181e');R(x+7,y,1,16,'#50505e');for(let i=0;i<16;i+=8){R(x+6,y+i,4,2,'#282830');R(x+7,y+i-1,2,1,'#f2c14e');}}
      break;
    case'P':R(x,y,16,16,'#b0aca0');for(let r=0;r<4;r++){R(x,y+r*4+3,16,1,'#8a867a');R(x+(r&1?4:0),y+r*4,1,3,'#8a867a');R(x+(r&1?12:8),y+r*4,1,3,'#8a867a');R(x,y+r*4,16,1,'#c6c2b6');}
      if(nb(-1,0)!='P'&&nb(-1,0)!='D'&&nb(-1,0)!='%')R(x,y,16,16,'rgba(255,255,255,.14)');if(nb(1,0)!='P'&&nb(1,0)!='D'&&nb(1,0)!='%')R(x,y,16,16,'rgba(10,8,24,.22)');
      if(nb(0,-1)!='P')R(x,y,16,1,'#e4e0d4');
      if(nb(0,-1)!='P'&&nb(-1,0)!='P'){R(x,y,16,16,'#b0aca0');for(let i=0;i<16;i++)R(x,y+i,15-i,1,'#58a848');}
      if(nb(0,-1)!='P'&&nb(1,0)!='P'&&nb(1,0)!='D'){for(let i=0;i<16;i++)R(x+1+i,y+i,15-i,1,'#58a848');R(x,y,1,16,'rgba(10,8,24,.22)');}
      break;
    case'D':{const bc=nb(-1,0);tile(s,bc=='D'||bc=='%'?'P':bc,tx,ty,fr,true);
      R(x+1,y+3,14,13,'#d0ccc0');R(x+2,y+2,12,1,'#d0ccc0');R(x+4,y+1,8,1,'#d0ccc0');R(x+1,y+3,1,13,'#f0ece0');R(x+14,y+3,1,13,'#8a867a');
      R(x+3,y+4,10,12,'#08060c');R(x+4,y+3,8,1,'#08060c');R(x+5,y+2,6,1,'#08060c');R(x+4,y+12,8,4,'#181420');R(x+5,y+14,6,2,'#2a2436');
      break;}
    case'k':ground(s,gb,x,y,h);for(let i=1;i<16;i+=5){R(x+1,y+i,14,2,'#6a4a30');R(x+1,y+i+2,14,1,'#3a2818');R(x+1,y+i,14,1,'#86623e');}
      for(const a of[3,11]){R(x+a,y,2,16,'#8a909c');R(x+a,y,1,16,'#d8dce4');R(x+a+2,y,1,16,'rgba(10,8,24,.35)');}break;
    case'K':ground(s,gb,x,y,h);for(let i=1;i<16;i+=5){R(x+i,y+1,2,14,'#6a4a30');R(x+i+2,y+1,1,14,'#3a2818');R(x+i,y+1,1,14,'#86623e');}
      for(const a of[3,11]){R(x,y+a,16,2,'#8a909c');R(x,y+a,16,1,'#d8dce4');R(x,y+a+2,16,1,'rgba(10,8,24,.35)');}break;
    case'W':{
      if(nb(0,1)!='W'){wallFace(s,x,y,h);
        if(ty==0&&tx%4==1){if(fr==0)s.torches.push([x+8,y+8]);R(x+7,y+9,2,5,'#3a2a1a');R(x+6,y+8,4,2,'#6a5030');
          const f=fr&1,f2=fr>>1;R(x+6-f2%2,y+4-f,4,5,'#f08020');R(x+7,y+3-f+f2,2,5,'#f8e060');R(x+7+f,y+5,1,2,'#ffffff');}}
      else{R(x,y,16,16,'#2a2434');
        if(nb(0,-1)!='W')R(x,y,16,1,'#4a445a');if(nb(-1,0)!='W')R(x,y,1,16,'#4a445a');if(nb(1,0)!='W')R(x+15,y,1,16,'#14101c');
        if(h%3==0)R(x+3+h%8,y+4+(h>>4)%8,2,1,'#3a3446');}
      break;}
    case'E':R(x,y,16,16,'#0c0a12');['#9a94a8','#7a748a','#5a546a','#3a344a'].forEach((c,i)=>{R(x+1,y+i*4,14,3,c);R(x+1,y+i*4,14,1,'rgba(255,255,255,.25)');});break;
    case'M':ground(s,gb,x,y,h);R(x+3,y+14,10,2,'rgba(10,8,24,.3)');R(x+7,y+9,2,6,'#2a2a34');R(x+7,y+9,1,6,'#5a5a68');
      R(x+1,y+1,14,9,'#1a1423');R(x+6,y,4,2,'#1a1423');R(x+2,y+2,12,7,'#c8ccd4');R(x+7,y+1,2,1,'#c8ccd4');R(x+2,y+2,12,1,'#ffffff');
      R(x+4,y+4,8,1,'#3a3a54');R(x+4,y+6,6,1,'#3a3a54');R(x+2,y+8,12,1,'#8a90a0');break;
    case'%':if(s.ow){ground(s,gb,x,y,h);R(x+2,y+12,13,3,'rgba(10,8,24,.3)');
        R(x+1,y+7,8,8,'#3c3e48');R(x+2,y+8,6,6,'#8e909c');R(x+7,y+3,8,11,'#3c3e48');R(x+8,y+4,6,9,'#9a9ca8');R(x+4,y+2,6,6,'#3c3e48');R(x+5,y+3,4,4,'#a8aab4');
        R(x+9,y+5,2,1,'#c8cad4');R(x+3,y+9,2,1,'#c8cad4');R(x+10,y+8,1,4,'#3c3e48');R(x+11,y+9,2,1,'#3c3e48');R(x+4,y+10,1,3,'#3c3e48');}
      else{wallFace(s,x,y,h);R(x+5,y+5,2,2,'#14101c');R(x+7,y+7,2,2,'#14101c');R(x+9,y+6,2,3,'#14101c');R(x+6,y+9,2,3,'#14101c');R(x+10,y+10,2,2,'#14101c');R(x+4,y+11,2,2,'#14101c');R(x+8,y+12,1,2,'#14101c');}
      break;
    case'L':{const c=s.wl||['#5b5368','#463f52','#756c85'];R(x,y,16,16,c[1]);R(x+1,y+1,14,15,'#1a1423');R(x+2,y+2,12,14,'#7a4a28');
      for(let i=4;i<14;i+=4)R(x+i,y+2,1,14,'#5a3418');R(x+2,y+5,12,2,'#3a3a48');R(x+2,y+12,12,2,'#3a3a48');R(x+2,y+5,12,1,'#7a7a8a');
      R(x+6,y+7,4,4,'#f2c14e');R(x+7,y+8,2,2,'#1a1423');R(x+7,y+10,2,2,'#1a1423');break;}
    case'H':R(x,y,16,16,'#0c0a12');R(x,y+3,16,2,'#5c606c');R(x,y+11,16,2,'#5c606c');
      for(let i=1;i<16;i+=4){R(x+i,y,2,16,'#8a909c');R(x+i,y,1,16,'#d8dce4');}break;
    case'j':case'J':floor(s,x,y,h);R(x+3,y+13,10,2,'rgba(10,8,24,.35)');R(x+5,y+9,6,6,'#4a4458');R(x+5,y+9,1,6,'#6a6478');
      R(x+2,y+5,12,5,'#1a1423');R(x+3,y+6,10,3,'#5c5866');R(x+3,y+6,10,1,'#9a94a8');
      if(ch=='J'){const f=fr&1,f2=fr>>1;R(x+4,y+1-f,8,6,'#f08020');R(x+5+f2,y-1+f,5,6,'#f8e060');R(x+7,y+2,2,3,'#ffffff');}
      else{R(x+4,y+6,8,2,'#2a2030');R(x+6,y+6,2,1,'#4a3030');}break;
    case'c':case'o':floor(s,x,y,h);R(x+2,y+13,13,2,'rgba(10,8,24,.35)');
      if(ch=='c'){R(x+1,y+3,14,12,'#1a1423');R(x+2,y+4,12,10,'#a8642c');R(x+2,y+4,12,3,'#c8843c');R(x+2,y+4,12,1,'#e8a85c');R(x+2,y+8,12,1,'#5a3418');R(x+7,y+7,2,4,'#f2c14e');R(x+7,y+9,2,1,'#1a1423');}
      else{R(x+1,y+1,14,14,'#1a1423');R(x+2,y+2,12,4,'#c8843c');R(x+2,y+6,12,3,'#2a1810');R(x+2,y+9,12,5,'#a8642c');R(x+2,y+9,12,1,'#5a3418');}
      break;
    case'Y':{ground(s,gb,x,y,h);const mar=s.statue=='marble',bust=s.statue=='bust';const a=mar?'#f4f2ec':bust?'#3a3446':'#4a6a5a',b2=mar?'#c8c4b8':bust?'#24202e':'#2e4a3e',hi=mar?'#ffffff':bust?'#5a5468':'#7a9a8a';
      R(x+2,y+13,12,2,'rgba(10,8,24,.3)');R(x+3,y+10,10,5,'#8a8690');R(x+3,y+10,10,1,'#c8c4cc');R(x+3,y+14,10,1,'#5a5662');
      if(bust){R(x+5,y+3,6,7,b2);R(x+6,y+2,4,6,a);R(x+5,y+7,6,3,a);R(x+6,y+3,1,4,hi);}
      else{R(x+6,y,4,4,b2);R(x+6,y,3,3,a);R(x+5,y+4,6,6,b2);R(x+5,y+4,5,6,a);R(x+6,y+4,1,5,hi);R(x+4,y+5,1,3,a);R(x+11,y+5,1,3,b2);}
      break;}
    case'G':ground(s,gb,x,y,h);R(x+2,y+13,12,2,'rgba(10,8,24,.3)');R(x+2,y+11,12,4,'#8a8690');R(x+2,y+11,12,1,'#c8c4cc');
      R(x+3,y+6,9,5,'#1e1c24');R(x+9,y+2,5,6,'#1e1c24');R(x+13,y+5,2,2,'#1e1c24');R(x+9,y+2,2,3,'#0c0a10');R(x+3,y+9,2,2,'#1e1c24');R(x+10,y+9,2,2,'#1e1c24');R(x+1,y+6,2,2,'#1e1c24');
      R(x+11,y+3,2,1,'#5a5662');R(x+4,y+6,6,1,'#3a3644');break;
    case'Q':ground(s,gb,x,y,h);R(x+6,y+14,5,2,'rgba(10,8,24,.3)');R(x+7,y+8,2,7,'#2a2a34');R(x+7,y+8,1,7,'#5a5a68');
      R(x+5,y,6,10,'#1a1423');R(x+6,y+1,4,8,'#3a3a44');
      {const ph=fr<2?2:fr==2?1:0;['#e83048','#f8c030','#30d070'].forEach((c,i)=>R(x+7,y+1+i*3,2,2,i==ph?c:'#24222c'));}break;
    case'V':floor(s,x,y,h);R(x,y+3,16,12,'#5a3a22');R(x,y+2,16,3,'#e8e4dc');R(x,y+2,16,1,'#ffffff');R(x,y+5,16,1,'#3a2414');
      R(x+2,y+7,5,6,'#6a4a2e');R(x+9,y+7,5,6,'#6a4a2e');R(x,y+14,16,1,'rgba(10,8,24,.35)');break;
    case'h':floor(s,x,y,h);R(x+1,y+3,6,11,'#1a1423');R(x+9,y+3,6,11,'#1a1423');R(x+2,y+4,4,9,'#a8243a');R(x+10,y+4,4,9,'#a8243a');R(x+2,y+4,4,2,'#d04860');R(x+10,y+4,4,2,'#d04860');break;
    case'O':floor(s,x,y,h);R(x,y+1,16,14,'#1a1423');R(x+1,y+2,14,12,'#ece0c4');R(x+1,y+2,14,2,'#d8a830');R(x+1,y+9,14,3,'#ffffff');
      for(let i=2;i<15;i+=3)R(x+i,y+9,1,2,'#1a1423');R(x+1,y+12,14,1,'#d8a830');R(x+3,y+5,10,2,'#c89820');break;
    case'Z':R(x,y,16,16,'#1e1c24');R(x+1,y+1,14,14,'#2e2c36');
      if(nb(0,-1)!='Z'){R(x,y,16,2,'#4a4652');if(tx%2==0){R(x+5,y-0,6,4,'#1e1c24');R(x+6,y,4,3,'#3a3644');}}
      for(let i=3;i<16;i+=5)R(x+i,y+5,1,1,'#6a6672');R(x,y+8,16,1,'#5a2a1a');
      if(nb(0,1)!='Z'){R(x+1,y+10,6,6,'#1a1423');R(x+9,y+10,6,6,'#1a1423');R(x+2,y+11,4,4,'#7a1424');R(x+10,y+11,4,4,'#7a1424');R(x+3,y+12,2,2,'#4a0c14');R(x+11,y+12,2,2,'#4a0c14');}
      break;
    case'~':{R(x,y,16,16,'#3a82c0');
      for(let i=0;i<4;i++){const q=HH(h,i,13),a=(q%16+fr*4)%16,b=1+i*4+(q>>4)%2;R(x+a,y+b,5,2,'#e8f8ff');R(x+(a+7)%16,y+b+1,3,1,'#a8dcf4');R(x+(a+12)%16,y+b,2,1,'#ffffff');}
      for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0]]){const q=nb(dx,dy);if(q!='~'&&q!='w'&&q!='=')R(x+(dx>0?14:0),y+(dy>0?14:0),dx?2:16,dy?2:16,'#ffffff');}
      break;}
    case'b':ground(s,gb,x,y,h);R(x+2,y+12,13,3,'rgba(10,8,24,.3)');
      R(x+1,y+3,14,11,'#143c22');R(x+2,y+2,12,12,'#143c22');R(x+2,y+3,12,10,'#2f7a3c');R(x+3,y+2,10,11,'#2f7a3c');
      R(x+3,y+4,4,3,'#58a850');R(x+9,y+3,3,2,'#58a850');R(x+5,y+9,3,2,'#58a850');R(x+4,y+4,2,1,'#90d070');R(x+10,y+8,3,3,'#1f5a30');R(x+6,y+6,2,2,'#1f5a30');break;
    case'^':floor(s,x,y,h);R(x+2,y+2,12,12,'#1a1423');R(x+3,y+3,10,10,'#8a6a3a');R(x+3,y+3,10,2,'#c89a5a');R(x+6,y+6,4,4,'#f2c14e');R(x+7,y+7,2,2,'#fff2a8');break;
    case'U':R(x,y,16,16,'#9a9a9e');R(x,y,16,2,'#c8c8cc');R(x,y+14,16,2,'#6a6a70');for(let i=0;i<16;i+=8)R(x+i,y+2,1,12,'#7a7a80');
      {const c=['#e83048','#3ac2e8','#f2c14e','#34c8b0','#b890f8'][h%5];if(h%3)R(x+2+h%6,y+4,6,6,c);if(h%4==0)R(x+9,y+7,4,5,['#f08030','#58a850'][h%2]);}break;
    case'g':floor(s,x,y,h);R(x+2,y+12,13,3,'rgba(10,8,24,.35)');R(x+3,y+9,10,6,'#5a4a3a');R(x+3,y+9,10,1,'#8a7a6a');
      R(x+2,y+1,12,9,'#1a1423');R(x+3,y+2,10,7,'#a8c8e0');R(x+3,y+2,2,7,'#d8f0ff');
      {const c=['#e83048','#3d63c8','#2e9d6b','#c08840','#b890f8'][h%5];R(x+6,y+3,4,5,c);R(x+7,y+2,2,1,c);R(x+6,y+5,4,1,'#f2c14e');R(x+7,y+3,1,1,'#ffffff');}break;
    case'X':ground(s,gb,x,y,h);break;
    case'S':R(x,y,16,16,'#8a8690');for(let i=0;i<4;i++){R(x,y+i*4,16,1,'#c8c4cc');R(x,y+i*4+3,16,1,'#5a5662');}break;
    case'R':ground(s,gb,x,y,h);R(x,y+4,16,12,'#7a6a58');R(x,y+4,16,2,'#4c8a3c');R(x,y+6,16,1,'#3a5a2a');
      for(let i=0;i<3;i++){const q=HH(h,i,21);R(x+q%13,y+8+(q>>4)%6,3,2,'#5e5040');R(x+q%13,y+8+(q>>4)%6,3,1,'#9a8a74');}R(x,y+15,16,1,'#3e3428');break;
    case'l':ground(s,gb,x,y,h);R(x+6,y+14,5,2,'rgba(10,8,24,.3)');R(x+7,y+5,2,10,'#1e1c24');R(x+6,y+13,4,2,'#1e1c24');
      R(x+5,y+1,6,5,'#1e1c24');R(x+6,y+2,4,3,'#4a4652');R(x+7,y,2,1,'#1e1c24');break;
    case'i':ground(s,gb,x,y,h);R(x+1,y+12,14,2,'rgba(10,8,24,.3)');R(x+1,y+5,14,2,'#1a1423');R(x+1,y+8,14,3,'#1a1423');
      R(x+2,y+6,12,1,'#a8743a');R(x+2,y+9,12,1,'#c8904a');R(x+2,y+11,2,3,'#1a1423');R(x+12,y+11,2,3,'#1a1423');break;
    case'a':ground(s,gb,x,y,h);R(x+3,y+13,11,2,'rgba(10,8,24,.3)');R(x+7,y+6,2,8,'#5a5662');R(x+4,y+9,8,2,'#1a1423');R(x+5,y+9,6,1,'#e8e4dc');
      {const c=['#e83048','#2e9d6b','#3d63c8','#f2c14e'][h%4];R(x+1,y+2,14,4,'#1a1423');R(x+2,y+1,12,4,c);for(let i=2;i<14;i+=4)R(x+i,y+1,2,4,'#ffffff');R(x+7,y,2,1,'#1a1423');}break;
    case'q':ground(s,gb,x,y,h);R(x+5,y+13,7,2,'rgba(10,8,24,.3)');R(x+5,y+5,6,9,'#1a1423');R(x+6,y+6,4,7,'#e83048');R(x+6,y+4,4,2,'#1a1423');R(x+7,y+3,2,1,'#e83048');
      R(x+4,y+8,1,2,'#1a1423');R(x+11,y+8,1,2,'#1a1423');R(x+6,y+6,1,6,'#f890a0');break;
    case'u':ground(s,gb,x,y,h);R(x+2,y+13,13,2,'rgba(10,8,24,.3)');R(x+2,y+8,12,6,'#1a1423');R(x+3,y+9,10,4,'#8a5a34');R(x+3,y+9,10,1,'#a8744a');
      R(x+3,y+4,10,5,'#2f7a3c');R(x+4,y+3,3,2,'#58a850');{const c=['#f08098','#f8e060','#b890f8'][h%3];R(x+5,y+5,2,2,c);R(x+9,y+4,2,2,c);R(x+11,y+6,1,1,c);}break;
    case'y':ground(s,gb,x,y,h);R(x,y+3,16,12,'#1a1423');R(x+1,y+4,14,10,'#b0aca0');R(x+3,y+6,10,6,'#2f6fb0');
      {const f=fr&1;R(x+7,y+1-f,2,6,'#a8dcf4');R(x+5+f,y+6,1,2,'#ffffff');R(x+10-f,y+6,1,2,'#ffffff');R(x+4,y+8+f,8,1,'#a8dcf4');}break;
    case't':ground(s,gb,x,y,h);R(x+2,y+12,13,3,'rgba(10,8,24,.3)');R(x+3,y+13,10,2,'#5e4a34');R(x+7,y+8,2,6,'#6a4424');
      R(x+2,y,12,9,'#143c22');R(x+3,y+1,10,7,'#2f7a3c');R(x+4,y+2,4,2,'#58a850');R(x+5,y+2,2,1,'#90d070');R(x+9,y+5,3,2,'#1f5a30');break;
    case'e':{const c=s.wl||['#9a9a9e','#6a6a70','#c8c8cc'];if(s.g[ty]&&nbOf(s,tx,ty,0,-1)=='B')tile(s,'B',tx,ty,fr,true);else tile(s,'U',tx,ty,fr);
      R(x+1,y+3,14,10,'#1a1423');const cs=['#e83048','#f2c14e','#3ac2e8','#34c8b0','#b890f8','#f08030'];for(let i=0;i<6;i++){const q=HH(h,i,31);R(x+2+(q%10),y+4+(q>>5)%7,3+(q>>9)%3,2+(q>>11)%2,cs[(q>>3)%6]);}
      R(x+2,y+4,12,1,'#ffffff');break;}
  }
}
/* ---------- landmark art: one hand-drawn piece per Richmond landmark ---------- */
function brickWall(x,y,w,h,c0,c1,c2){R(x,y,w,h,c0);for(let r=0;r<h;r+=4){R(x,y+r+3,w,1,c1);for(let i=(r/4&1)*4;i<w;i+=8)R(x+i,y+r,1,3,c1);if((r>>2)%3==0)R(x+((r*7)%Math.max(1,w-8)),y+r,7,1,c2);}}
function windowAt(x,y,w,h,lit){R(x-1,y-1,w+2,h+2,'#efe4c8');R(x,y,w,h,lit?'#f8d868':'#28406a');R(x+(w>>1),y,1,h,'#efe4c8');if(!lit){R(x,y,1,1,'#88a8d8');}else R(x,y,2,1,'#fff6c0');}
function doorway(x,y){R(x+3,y+3,10,13,'#1a1423');R(x+4,y+2,8,1,'#1a1423');R(x+4,y+4,8,12,'#08060c');R(x+5,y+3,6,1,'#08060c');R(x+4,y+12,8,4,'#181420');}
const LMART={
  grandstand(x,y,w,h,fr){R(x,y,w,h,'#1a1423');for(let r=0;r<4;r++){R(x+1,y+2+r*7,w-2,5,r&1?'#2e7d4f':'#3a9a60');R(x+1,y+2+r*7,w-2,1,'#58c890');}
    for(let i=4;i<w;i+=24){R(x+i,y,2,h,'#c8ccd4');}R(x,y,w,2,'#e8e4dc');
    for(let i=0;i<18;i++){const q=HH(i,fr>>1,7);R(x+4+q%(w-8),y+3+((q>>8)%4)*7,2,2,['#e83048','#f2c14e','#ffffff','#3d63c8','#f08098'][q%5]);}},
  store(x,y,w,h,fr,s,L){const c=L.c||'#c8b48c';R(x,y,w,h,'#1a1423');R(x+1,y+1,w-2,h-1,c);
    R(x+1,y+1,w-2,3,'#efe4c8');R(x+1,y+4,w-2,1,'#7a6a50');
    for(let r=0;r<3;r++)for(let i=8;i<w-12;i+=18)windowAt(x+i,y+10+r*18,10,11,((i+r*7+(fr>>1))%5)==0);
    R(x+1,y+h-26,w-2,8,'#6c1c2c');for(let i=6;i<w-6;i+=10)R(x+i,y+h-24,6,4,'#f2c14e');
    for(let i=1;i<w-1;i+=4)R(x+i,y+h-16,2,4,i%8<4?'#e83048':'#ffffff');R(x+1,y+h-12,w-2,11,'#efe4c8');
    for(let i=6;i<w-16;i+=22)R(x+i,y+h-11,14,10,'#28406a');},
  shelter(x,y,w,h){R(x,y+2,w,3,'#3d63c8');R(x+1,y+2,w-2,1,'#7397ee');R(x+2,y+5,1,10,'#5a5662');R(x+w-3,y+5,1,10,'#5a5662');
    g.globalAlpha=.45;R(x+3,y+5,w-6,9,'#a8dcf4');g.globalAlpha=1;R(x+8,y+10,w-16,2,'#5a5662');R(x+w/2-3,y-2,6,4,'#f2c14e');},
  hippodrome(x,y,w,h,fr){brickWall(x,y,w,h,'#d8c8a0','#a89870','#f0e4c0');R(x,y,w,3,'#8a7a5a');
    R(x+w-22,y-0,10,h-14,'#1a1423');R(x+w-21,y+1,8,h-16,'#6c1c2c');for(let i=0;i<5;i++)R(x+w-19,y+4+i*7,4,4,((i+fr)%2)?'#fff2a8':'#f2c14e');
    R(x+8,y+h-30,w-40,12,'#1a1423');R(x+9,y+h-29,w-42,10,'#e8e4dc');for(let i=10;i<w-34;i+=4)R(x+i,y+h-31,2,2,((i>>2)+fr)%2?'#fff2a8':'#e83048');
    R(x+12,y+h-26,w-50,4,'#6c1c2c');windowAt(x+10,y+10,10,10,true);windowAt(x+30,y+10,10,10,false);windowAt(x+50,y+10,10,10,true);},
  church(x,y,w,h,fr){const bx=x,by=y+28;R(bx,by,w,h-28,'#1a1423');R(bx+1,by+1,w-2,h-29,'#f4f2ec');for(let i=by+4;i<y+h;i+=4)R(bx+1,i,w-2,1,'#d8d4c8');
    R(bx-2,by-6,w+4,7,'#1a1423');R(bx,by-5,w,5,'#5a5662');R(x+w/2-10,y+8,20,22,'#1a1423');R(x+w/2-9,y+9,18,21,'#f4f2ec');R(x+w/2-6,y+12,12,8,'#28406a');
    R(x+w/2-6,y,12,9,'#1a1423');R(x+w/2-4,y,8,8,'#5a5662');R(x+w/2-1,y-6,2,7,'#1a1423');R(x+w/2-3,y-4,6,2,'#1a1423');
    windowAt(bx+8,by+12,8,14,(fr>>1)&1);windowAt(bx+w-16,by+12,8,14,!((fr>>1)&1));},
  vmfa(x,y,w,h){R(x,y,w,h,'#1a1423');R(x+1,y+1,w-2,h-2,'#d8d4cc');R(x+1,y+1,w-2,6,'#f4f0e8');R(x+1,y+7,w-2,2,'#a8a49c');
    for(let i=10;i<w-8;i+=16){R(x+i,y+12,6,h-16,'#f4f0e8');R(x+i+4,y+12,2,h-16,'#b8b4ac');}R(x+1,y+h-4,w-2,3,'#a8a49c');
    R(x+w/2-26,y+2,52,4,'#6c1c2c');R(x+w/2-24,y+3,48,2,'#f2c14e');},
  byrd(x,y,w,h,fr){brickWall(x,y,w,h,'#b06a48','#7a4630','#d08a68');R(x,y,w,3,'#e8dcc0');
    R(x+w/2-8,y-6,16,h-12,'#1a1423');R(x+w/2-7,y-5,14,h-14,'#3d63c8');for(let i=0;i<4;i++)R(x+w/2-4,y-2+i*7,8,5,(i+fr)%2?'#fff2a8':'#f8d868');
    R(x+4,y+h-22,w-8,8,'#1a1423');for(let i=6;i<w-6;i+=3)R(x+i,y+h-21,2,6,(i+fr)%3?'#fff2a8':'#e83048');},
  capitol(x,y,w,h){R(x,y+14,w,h-14,'#1a1423');R(x+1,y+15,w-2,h-16,'#f4f2ec');
    for(let i=0;i<14;i++){const ww=Math.round(w*(i+1)/14);R(x+(w-ww)/2,y+i,ww,1,i==13?'#1a1423':'#f4f2ec');R(x+(w-ww)/2,y+i,1,1,'#1a1423');R(x+(w+ww)/2-1,y+i,1,1,'#1a1423');}
    R(x+w/2-10,y+8,20,3,'#c8c4b8');R(x+4,y+18,w-8,h-24,'#8e8c84');for(let i=8;i<w-8;i+=14){R(x+i,y+18,7,h-24,'#ffffff');R(x+i+5,y+18,2,h-24,'#c4c2b8');}
    R(x+1,y+h-6,w-2,5,'#e4e2d8');},
  belltower(x,y,w,h){brickWall(x,y+6,w,h-6,'#b05a40','#7a3a28','#d07a60');R(x+2,y,w-4,7,'#1a1423');R(x+3,y+1,w-6,6,'#c8c4b8');R(x+w/2-1,y-4,2,5,'#1a1423');
    R(x+8,y+14,w-16,10,'#1a1423');R(x+w/2-3,y+16,6,6,'#f2c14e');R(x+w/2,y+17,1,3,'#1a1423');},
  station(x,y,w,h,fr){brickWall(x,y+12,w-28,h-12,'#b05a40','#7a3a28','#d07a60');R(x,y+8,w-28,6,'#1a1423');R(x+1,y+9,w-30,4,'#c8643c');
    for(let i=8;i<w-36;i+=20)windowAt(x+i,y+22,10,14,((i>>3)+(fr>>1))%3==0);for(let i=8;i<w-36;i+=20)windowAt(x+i,y+48,10,14,false);
    const tx=x+w-28;brickWall(tx,y+6,28,h-6,'#b05a40','#7a3a28','#d07a60');R(tx-2,y,32,8,'#1a1423');R(tx,y+1,28,6,'#c8643c');R(tx+12,y-6,4,7,'#1a1423');
    R(tx+5,y+14,18,18,'#1a1423');R(tx+6,y+15,16,16,'#f4f2ec');R(tx+13,y+18,2,6,'#1a1423');R(tx+14,y+22,5,2,'#1a1423');windowAt(tx+9,y+42,10,14,true);},
  market(x,y,w,h){R(x,y,w,8,'#1a1423');R(x+1,y+1,w-2,6,'#2e7d4f');for(let i=2;i<w;i+=6)R(x+i,y+1,2,6,'#3a9a60');R(x,y+8,w,1,'#14301e');
    for(let i=4;i<w;i+=26)R(x+i,y+8,3,h-8,'#5a5662');for(let i=10;i<w-8;i+=16){R(x+i,y+18,10,8,'#8a5a34');R(x+i+1,y+16,8,3,['#e83048','#f2c14e','#58a850','#f08030'][(i>>4)%4]);}},
  carillon(x,y,w,h,fr){const cx=x+w/2;R(cx-17,y+12,34,h-12,'#1a1423');brickWall(cx-16,y+13,32,h-14,'#c8a078','#8a6a48','#e4c098');
    R(cx-12,y+4,24,10,'#1a1423');R(cx-11,y+5,22,9,'#c8a078');R(cx-4,y-6,8,11,'#1a1423');R(cx-3,y-5,6,10,'#7a8a6a');R(cx-1,y-10,2,5,'#1a1423');
    for(let i=-9;i<9;i+=7){R(cx+i,y+16,5,14,'#1a1423');R(cx+i+1,y+22,3,4,(fr>>1)&1?'#c08840':'#7a5420');}
    for(let i=0;i<4;i++){R(cx-2,y+44+i*16,4,8,'#1a1423');R(cx-1,y+45+i*16,2,6,'#28406a');}},
  mansion(x,y,w,h,fr){R(x,y+10,w,h-10,'#1a1423');R(x+1,y+11,w-2,h-12,'#a89a88');for(let i=y+14;i<y+h;i+=5)R(x+1,i,w-2,1,'#8a7c6a');
    R(x-2,y+6,w+4,6,'#1a1423');R(x,y+7,w,4,'#8a3a2a');R(x+w-24,y-4,18,16,'#1a1423');R(x+w-23,y-3,16,15,'#a89a88');R(x+w-24,y-10,18,7,'#1a1423');R(x+w-22,y-9,14,5,'#8a3a2a');
    for(let i=8;i<w-30;i+=16)windowAt(x+i,y+18,8,12,(i+fr)%3==0);for(let i=8;i<w-12;i+=16)windowAt(x+i,y+40,8,12,false);windowAt(x+w-18,y+2,6,8,true);},
  pyramid(x,y,w,h){for(let i=0;i<h;i++){const ww=Math.max(4,Math.round(w*(i+1)/h));const xx=x+(w-ww)/2|0;R(xx,y+i,ww,1,'#1a1423');R(xx+1,y+i,ww-2,1,i%5==4?'#8a867a':'#b0aca0');R(xx+1,y+i,Math.max(1,ww/2|0)-1,1,i%5==4?'#9a968a':'#c6c2b6');}},
  birdcage(x,y,w,h){R(x+1,y+h-6,w-2,6,'#8a8690');R(x+1,y+h-6,w-2,1,'#c8c4cc');for(let i=3;i<w-2;i+=4)R(x+i,y+6,1,h-12,'#1e1c24');R(x+2,y+6,w-4,1,'#1e1c24');R(x+2,y+h-8,w-4,1,'#1e1c24');
    for(let i=0;i<6;i++)R(x+w/2-i,y+6-i,2*i+1,1,'#1e1c24');R(x+w/2-1,y-2,2,3,'#1e1c24');R(x+w/2-4,y+14,8,10,'#7a7a84');},
  ruins(x,y,w,h){R(x,y+8,w,h-8,'#1a1423');brickWall(x+1,y+9,w-2,h-9,'#8a6a5a','#5e4438','#a8887a');for(let i=0;i<w;i+=10){const hh=4+(i*7)%12;R(x+i,y+8-hh,8,hh+1,'#1a1423');R(x+i+1,y+9-hh,6,hh,'#8a6a5a');}
    for(let i=12;i<w-12;i+=22){R(x+i,y+18,12,h-18,'#1a1423');R(x+i+1,y+16,10,2,'#1a1423');}R(x+6,y+12,4,10,'#2f7a3c');R(x+w-12,y+10,5,12,'#2f7a3c');},
  steamboat(x,y,w,h,fr){R(x,y+14,w,h-14,'#1a1423');R(x+1,y+15,w-2,h-17,'#f4f2ec');R(x+1,y+h-4,w-2,2,'#e83048');R(x+6,y+4,w-20,11,'#1a1423');R(x+7,y+5,w-22,9,'#e8e4dc');
    for(let i=10;i<w-20;i+=8)R(x+i,y+7,4,4,'#28406a');R(x+w-16,y+10,14,h-12,'#1a1423');R(x+w-15,y+11,12,h-14,'#8a1424');for(let i=0;i<4;i++)R(x+w-15,y+12+((i*4+fr*2)%12),12,1,'#e83048');
    R(x+12,y-8,4,13,'#1a1423');R(x+20,y-8,4,13,'#1a1423');R(x+12,y-8,4,2,'#f2c14e');R(x+20,y-8,4,2,'#f2c14e');R(x+13+(fr&1),y-12,3,3,'#c8c8d0');},
  stonehouse(x,y,w,h,fr){R(x,y+10,w,h-10,'#1a1423');R(x+1,y+11,w-2,h-12,'#9a9aa0');for(let r=y+12;r<y+h;r+=5)for(let i=x+1+((r>>2)&1)*4;i<x+w-1;i+=9)R(i,r,7,4,'#a8a8b0');
    R(x-2,y+4,w+4,8,'#1a1423');R(x,y+5,w,6,'#5a5662');R(x+w/2-4,y-6,8,11,'#1a1423');R(x+w/2-3,y-5,6,9,'#e8e4dc');R(x+w/2-1,y-2,2,3,'#c08840');
    R(x+4,y+h-16,w-8,3,'#6a4a30');for(let i=8;i<w-8;i+=20)R(x+i,y+h-14,2,13,'#e8e4dc');for(let i=12;i<w-12;i+=26)windowAt(x+i,y+18,8,10,(fr>>1)&1);},
  trolley(x,y,w,h){R(x,y+1,w,h-2,'#1a1423');R(x+1,y+2,w-2,h-5,'#2e7d4f');R(x+1,y+2,w-2,2,'#f2c14e');for(let i=4;i<w-4;i+=7)R(x+i,y+5,5,4,'#a8c8e0');R(x+4,y+h-3,4,3,'#1a1423');R(x+w-8,y+h-3,4,3,'#1a1423');R(x+w/2,y-4,1,6,'#1a1423');}
};
function drawLandmarks(s,fr){for(const L of s.lm||[]){const f=LMART[L.art];if(!f)continue;f(L.x*TS,L.y*TS,L.w*TS,L.h*TS,fr,s,L);
  for(let yy=L.y;yy<L.y+L.h;yy++)for(let xx=L.x;xx<L.x+L.w;xx++){const c=s.g[yy][xx];if(c=='D')doorway(xx*TS,yy*TS);else if(c=='%')rubbleAt(xx*TS,yy*TS);}}}
function rubbleAt(x,y){R(x+2,y+12,13,3,'rgba(10,8,24,.3)');R(x+1,y+7,8,8,'#3c3e48');R(x+2,y+8,6,6,'#8e909c');R(x+7,y+3,8,11,'#3c3e48');R(x+8,y+4,6,9,'#9a9ca8');R(x+4,y+2,6,6,'#3c3e48');R(x+5,y+3,4,4,'#a8aab4');R(x+10,y+8,1,4,'#3c3e48');}
function shadeTile(s,x,y){const t=s.g[y][x];if((SOLID.includes(t)&&t!='w')||t=='X')return;
  const n=y>0?s.g[y-1][x]:'',w=x>0?s.g[y][x-1]:'';
  if(n&&'BCPWLH%U'.includes(n)){R(x*TS,y*TS,16,4,'rgba(10,8,24,.32)');R(x*TS,y*TS+4,16,2,'rgba(10,8,24,.14)');}
  if(w&&'BCPW'.includes(w))R(x*TS,y*TS,3,16,'rgba(10,8,24,.2)');
  if(n=='T'||n=='r'||n=='b')R(x*TS+2,y*TS,12,1,'rgba(10,8,24,.2)');}
function renderMap(s,fr){
  const c=mkCanvas(s.w*TS,s.h*TS),old=g;g=c.getContext('2d');
  for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++)tile(s,s.g[y][x],x,y,fr);
  for(let y=0;y<s.h;y++)for(let x=0;x<s.w;x++)shadeTile(s,x,y);
  drawLandmarks(s,fr);
  g=old;return c;
}
function patchTile(tx,ty){const old=g;const ce=CVC.get(curId);if(ce)ce.sig=sigOf(cur);for(const j of jobs)if(j.id===curId&&j.cv)j.stale=1;cur.cv.forEach((c,fr)=>{if(!c)return;g=c.getContext('2d');g.clearRect(tx*TS,ty*TS,TS,TS);tile(cur,cur.g[ty][tx],tx,ty,fr);shadeTile(cur,tx,ty);});g=old;}
