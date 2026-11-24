"use strict";
/* River City Quest: Setup, sprites, game state, saving, sound effects and dialog. */
const W=256,PH=176,HUD=24,FH=PH+HUD,S=3;
const cv=document.getElementById('game');cv.width=W*S;cv.height=FH*S;
const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
const buf=mkCanvas(W,FH);let g=buf.getContext('2d');g.imageSmoothingEnabled=false;
const SOLID='TBCwrxfWPMLHjJcoYGQVhOZ%bUg~XRliaquyte_+z1',BUGSOLID=SOLID.replace('w','').replace('~','').replace('_',''),BALLSOLID=BUGSOLID;
let cam={x:0,y:0},blocks=[],musicOn=true;
const DX=[0,-1,0,1],DY=[1,0,-1,0];
const rnd=n=>Math.floor(Math.random()*n),clamp=(v,a,b)=>v<a?a:v>b?b:v;
function HH(a,b,c){let n=(Math.imul(a,374761393)+Math.imul(b,668265263)+Math.imul(c,362437))|0;n=Math.imul(n^(n>>>13),1274126177);return(n^(n>>>16))>>>1;}
function wrap(s,n){const out=[];let l='';for(const w of s.split(' ')){const t=l?l+' '+w:w;if(t.length>n&&l){out.push(l);l=w;}else l=t;}if(l)out.push(l);return out;}

/* ---------- pixel sprites ---------- */
const PAL={k:'#1a1423',K:'#3a3446',s:'#f2c698',S:'#c98f62',c:'#f09a9a',e:'#20182a',w:'#ffffff',
  o:'#f08030',O:'#b85a18',y:'#ffb868',h:'#6a4020',b:'#3d63c8',B:'#27428e',l:'#7397ee',p:'#3c3c54',n:'#6b4426',
  g:'#8f8496',G:'#5f566a',a:'#b9aec2',u:'#b86a30',U:'#7c431a',f:'#e8a25e',t:'#f2dcb4',
  T:'#34c8b0',D:'#1c8a7a',r:'#e83048',R:'#8a1424',v:'#6c4c9e',V:'#3e2a5e',m:'#9c7cd4',
  q:'#c8d8f0',Q:'#8aa0c8',j:'#2a2636',J:'#4a4662',i:'#5c6ca4',P:'#e2ded2',d:'#aaa69a',x:'#34223f',X:'#1c1224',
  Y:'#f2c14e',z:'#b8860b',L:'#fff2a8',A:'#c8843c',N:'#7a8494',I:'#d8dce4'};
function mkSpr(rows,swap,flip,white){
  const w=Math.max(...rows.map(r=>r.length)),h=rows.length,c=mkCanvas(w,h),x=c.getContext('2d');
  for(let j=0;j<h;j++)for(let i=0;i<rows[j].length;i++){const ch=rows[j][i];if(ch=='.')continue;
    x.fillStyle=white?'#ffffff':(swap&&swap[ch])||PAL[ch]||'#f0f';x.fillRect(flip?w-1-i:i,j,1,1);}
  return c;
}
function sp(rows,swap){return{r:{c:mkSpr(rows,swap,false),wht:mkSpr(rows,swap,false,true)},l:{c:mkSpr(rows,swap,true),wht:mkSpr(rows,swap,true,true)}};}
const CAP=[".....kkkkkk.....","...kkooooyykk...","..kooooooooyyk..","..kOoooooooook..","..kOOOOOOOOOOk.."];
const LEGS=["....kppkkppk....","....knnkknnk....","....kkk..kkk...."],STEP=["....kppkkppk....","....knnk.kkk....","....kkk........."];
const H_DOWN=CAP.concat(["..khsssssssshk..","..kssessssessk..","..kscessssecsk..","...ksssSSsssk...","...kkbbbbbbkk...","..kslbbwwbbBsk..","..kslbbbbbbBsk..","...kkBbbbbBkk..."]);
const H_UP=CAP.concat(["..khhhhhhhhhhk..","..khhhhhhhhhhk..","..kshhhhhhhhsk..","...khhhhhhhhk...","...kkbbbbbbkk...","..ksbBBBBBBbsk..","..ksbbBBBBbbsk..","...kkBbbbbBkk..."]);
const H_SIDE=[".....kkkkkk.....","...kkooooyykk...","..kooooooooyyk..","..kOoooooooook..","..kOOOOOOOOOOOk.","..khhhhssssssk..","..khhhsssssesk..","..khhssssssesk..","...khsssssssk...","....kkbbbbkk....","....kBblbbbk....","....kBbssbbk....","....kkBbbbkk...."];
const HERO={
  down:[sp(H_DOWN.concat(LEGS)),sp(H_DOWN.concat(STEP))],
  up:[sp(H_UP.concat(LEGS)),sp(H_UP.concat(STEP))],
  side:[sp(H_SIDE.concat([".....kppppk.....",".....knnnnnk....",".....kkkkkkk...."])),sp(H_SIDE.concat(["....kppkkppk....","...knnk..knnk...","...kkkk..kkkk..."]))]
};
const SKINS=[['#f2c698','#c98f62','#f09a9a'],['#d9a066','#a8723f','#e08a7a'],['#a86a3a','#7a4520','#c0705a'],['#7a4a28','#54301a','#9a5a48']];
const HAIRS=['#6a4020','#1a1423','#d8a838','#8a8a90','#a83a20','#3a2418'];
const NLEG=["....kppkkppk....","....knnkknnk....","....kkk..kkk...."];
function npcSpr(n){let q=0;const key=(n.who||'')+(n.hx|0)+','+(n.hy|0);for(const c of key)q=(q*31+c.charCodeAt(0))>>>0;
  const sk=SKINS[q%4],hr=HAIRS[(q>>3)%HAIRS.length],pants=['#3c3c54','#5a4a3a','#2e3a5e','#4a4a4a'][(q>>6)%4];
  const sw={o:n.hat[0],O:n.hat[1],y:n.hat[2],b:n.shirt[0],B:n.shirt[1],l:n.shirt[2],s:sk[0],S:sk[1],c:sk[2],h:hr,p:pants};
  return{down:sp(H_DOWN.concat(NLEG),sw),up:sp(H_UP.concat(NLEG),sw),side:sp(H_SIDE.concat([".....kppppk.....",".....knnnnnk....",".....kkkkkkk...."]),sw)};}
function npcFrame(n){const d=n.d||0;if(d==1||d==3)return d==1?n.spr.side.l:n.spr.side.r;return d==2?n.spr.up.r:n.spr.down.r;}
const SPR={
  rat:sp(["","","","","","..........kk.kk.",".....kkkkkcgkcgk","...kkaaaagggggk.","..kaaggggggegggk","..kgggggggggggck",".kkGggggggggGkk.","kckkGGkkkkGGk...",".kk.kkk..kkk....","","",""]),
  squirrel:sp(["",".kkkk...........","kfffUk.....k.k..","kfuufUk...kukuk.","kfuuuUk..kuuuuuk","kUfuuUk..kueuuuk",".kUfuUk.kuuuuutk",".kUfuukkuuuuttk.","..kUfukuuuuttk..","..kUuukuuuutk...","...kUukuutuuk...","...kkukuuuuUk...","....kkkUkkUUk...","......kkk.kkk...","",""]),
  goose:sp(["..........kkkk..",".........kKKKKk.",".........kKeKKkk",".........kwwKKGk",".........kKwkkk.",".........kKKk...",".........kKKk...","..kkkkkkkkKKk...",".kUuuuuuuukKtk..","kUUuuuUuuuuttk..","kwUUuuuUuuuttk..",".kwwUUuuuutttk..","..kkwwttttttk...","....kkkkkkkk....",".....kG..kG.....","....kGGk.kGGk..."]),
  scooter:sp(["","..........kkkk..",".........kKKKKk.","..........kkTk..","...........kTk..","..........krTk..","..........krTk..","...........kTk..","...........kTk..","...........kTk..",".kkkkkkkkkkkTk..","kTTTTTTTTTTTDk..","kkkDDDDDDDDkkkk.","kKakk....kkKakk.","kaKk......kaKk..",".kk........kk..."]),
  crab:sp(["","","",".kk..........kk.","kook........kook","kOok.kk..kk.kooO",".kOk.kwkkwk.kOk.","..kkkkekkekkkk..","..kkllllllllkk..",".kBlbbbbbbbblBk.",".kBbbbbbbbbbbBk.","..kBBbbbbbbBBk..",".kkkkBBBBBBkkkk.","kOk.kOkkkkOk.kOk","kk..kk....kk..kk",""]),
  bat:[sp(["","",".kk..........kk.","kvvk........kvvk","kvmvk.k..k.kvmvk","kvvmvkvkkvkvmvvk","kVvvmvvvvvvmvvVk",".kVvvvrvvrvvvVk.","..kVVvvvvvvVVk..","...kkkvvvvkkk...","......kVVk......",".......kk.......","","","",""]),
       sp(["","","","","......k..k......",".....kvkkvk.....","..kkkvvvvvvkkk..",".kvvvvrvvrvvvvk.","kvmmvvvvvvvvmmvk","kvmvVkvvvvkVvmvk","kvvVk.kVVk.kVvvk","kVVk...kk...kVVk",".kk..........kk.","","",""])],
  ghost:sp(["",".....QQQQQQ.....","...QQwwwwwwQQ...","..QwwwwwwwwwqQ..",".QwwwwwwwwwwqqQ.",".QwweewwweewqqQ.",".QwweewwweewqqQ.",".QwwwwwwwwwwqqQ.",".QwwwweeewwwqqQ.",".QwwwwwwwwwqqqQ.",".QwwwwwwwwwqqqQ.",".QwwwwwwwwqqqqQ.",".QwwqQwwwqQqqqQ.",".QwqQ.QwqQ.QqqQ.","..QQ...QQ...QQ..",""]),
  raven:sp(["................kkkkk...","...............kjjjjjk..","..............kjJJjrjkk.","..............kjJjjjjaGk","..............kjjjjjkGk.","......kkkkkkkkkjjjjk.k..","....kkjjJJJJjjjjjjjk....","..kkjjjJiiiJJjjjjjjk....",".kjjjjjJJiiJjjjjjjk.....","kjjjjjjjjJJjjjjjjk......",".kkjjjjjjjjjjjjkk.......","...kkkjjjjjjjkk.........","......kkGkkGkk..........",".......kGk.kGk..........","......kGGGkGGGk.........","......kkkkkkkkk........."]),
  vampire:sp([".....kkkkkk.....","....kKKkkKKk....","...kKkkkkkkKk...","...kkPPkkPPkk...","...kPPPPPPPPk...","...kPrrPPrrPk...","...kPPPPPPPPk...","...kdPwPPwPdk...",".k..kdPPPPdk..k.","kxk.kkddddkk.kxk","kxxkkrkPPkrkkxxk","kxxxkrrkkrrkxxxk","kxxxxkrrrrkxxxxk","kXxxxkrRRrkxxxXk","kXxxxkrRRrkxxxXk","kXxxxxkRRkxxxxXk","kXxxxxkRRkxxxxXk","kXxxxxxkkxxxxxXk","kXXxxxxxxxxxxXXk","kXXxxxxxxxxxxXXk",".kXXxxxxxxxxXXk.",".kXXXxxxxxxXXXk.","..kXXXXXXXXXXk..","...kkkkkkkkkk..."])
};
const WING=["..kkk.......",".kjJjkk.....",".kjJJjjkk...","..kjJJjjjk..","..kjjJJjjjk.","...kjjjjjjk.","....kkkkkk.."];
const WINGS=[sp(WING),sp(WING.slice().reverse())];
const COIN=[sp(["..kkkk..",".kLYYzk.","kLYzzYzk","kYYzYYzk","kYYzYYzk","kYYzzYzk",".kYYYzk.","..kkkk.."]),sp(["...kk...","..kLzk..","..kYzk..","..kYzk..","..kYzk..","..kYzk..","..kYzk..","...kk..."])];
const HEARTROWS=[".kk...kk.","krrk.krrk","krwrkrrRk","krrrrrrRk",".krrrrRk.","..krrRk..","...kRk...","....k...."];
const HEART=sp(HEARTROWS).r.c,HEART0=sp(HEARTROWS,{r:'#3a2a48',R:'#2a1c38',w:'#4a3a58'}).r.c;
const IC={
  lantern:mkSpr(["....kkkk....","...kK..Kk...","....kkkk....","...kYYYYk...","..kzLLLLzk..","..kzLwwLzk..","..kzLLLLzk..","..kzYYYYzk..","...kkkkkk...","....kzzk....","...kkkkkk...","............"]),
  ball:mkSpr(["............","....kkkk....","...kwwwwk...","..kwrwwrwk..","..kwrwwwrk..","..kwwrwwwk..","..kwrwwwrk..","..kwrwwrwk..","...kwwwwk...","....kkkk....","............","............"]),
  keg:mkSpr(["......kYk...",".....kzk....","...kkkkkk...","..kKKKKKKk..","..kuuuuuUk..",".kuuuuuuuUk.",".kKKKKKKKKk.",".kuuuuuuuUk.",".kuuuuuuuUk.","..kKKKKKKk..","...kkkkkk...","............"]),
  bug:mkSpr(["..k......k..","...k....k...","....kkkk....","...kzYYzk...","..kYLYYYzk..",".kkYLYzYzkk.","..kYYYzYzk..",".kkYYYzYzkk.","..kzYYzYzk..",".kkkzzzzkkk.","....kkkk....","............"]),
  shoes:mkSpr(["............","............","...kkkk.....","..klllbk....","..klbbbk....","..kbbbbkkk..","..kbwbwbbbk.",".kbbbbbbbblk",".kwwwwwwwwwk",".kkkkkkkkkkk","............","............"]),
  bottle:mkSpr(["....kkkk....","....kuuk....","....kkkk....","....kqqk....","...kqqqqk...","..kqffffqk..","..kqfyffqk..","..kqffffqk..","..kqffffqk..","..kqffffqk..","...kkkkkk...","............"]),
  bottleE:mkSpr(["....kkkk....","....kuuk....","....kkkk....","....kqqk....","...kqqqqk...","..kqQqqqqk..","..kqwqqqqk..","..kqqqqqqk..","..kqqqqqQk..","..kqQQQQQk..","...kkkkkk...","............"]),
  paddle:mkSpr(["........kkk.",".......kfffk","......kffffk",".....kffffk.","....kffffk..","...kufkkk...","..kuk.......",".kuk........","kuk.........","kk..........","............","............"]),
  shield:mkSpr(["............",".kkkkkkkkkk.",".kaaaaaaaGk.",".kaIIIIIIGk.",".kaIaaaaIGk.",".kaIaIIaIGk.",".kaIaaaaIGk.","..kaIIIIGk..","..kaaaaaGk..","...kaaaGk...","....kkkk....","............"],{a:'#5a6478',G:'#2e3442',I:'#9aa4b8'}),
  key:mkSpr(["............","...kkkk.....","..kYYYYk....","..kYkkYk....","..kYYYYk....","...kYYk.....","....kYk.....","....kYkk....","....kYYYk...","....kYkk....","....kYYk....",".....kk....."]),
  bib:mkSpr(["............",".kkkkkkkkkk.",".kwwwwwwwwk.",".kwrrrrrrwk.",".kwwwwwwwwk.",".kwkwkkwkwk.",".kwkwkwwkwk.",".kwkwkkwkwk.",".kwwwwwwwwk.",".kkkkkkkkkk.","............","............"]),
  journal:mkSpr(["............",".kkkkkkkkk..",".kRrrrrrrrk.",".kRrYYYYrrk.",".kRrrrrrrrk.",".kRrrrrrrrk.",".kRrrYrrrrk.",".kRrrrrrrrk.",".kRwwwwwwwk.",".kkkkkkkkkk.","............","............"])
};
Object.assign(IC,{
  kayak:mkSpr(["............","..........k.","........kkYk",".kkkkkkkkrrk","krrrrrrrrrrk","kRrrwwwwrrRk",".kRRRRRRRRk.","..kkkkkkkk..","....kuk.....","...kuk......","..kuk.......","..kk........"]),
  melon:mkSpr(["............","....kkkk....","..kkDTDTkk..",".kDTDTDTDTk.",".kTDTDTDTDk.","kDTDTDTDTDTk","kTDTDTDTDTDk",".kDTDTDTDTk.",".kTDTDTDTDk.","..kkDTDTkk..","....kkkk....","............"]),
  music:mkSpr(["............",".kkkkkkkkkk.",".kwwwwwwwwk.",".kkkkkkkkkk.",".kwwwwwkwwk.",".kkkkkkkkkk.",".kwwwkwwkwk.",".kkkkkkkkkk.",".kwwkkwwwwk.",".kkkkkkkkkk.",".kwwwwwwwwk.",".kkkkkkkkkk."]),
  rivermap:mkSpr(["............","kkkkkkkkkkkk","ktttttttqqtk","kttttttqqttk","ktYtttqqtttk","kttttqqtttrk","ktttqqttttrk","ktqqtttttttk","kqqttttYtttk","kttttttttttk","kkkkkkkkkkkk","............"]),
  carkey:mkSpr(["............","..kkkk......",".kAYYAk.....",".kYkkYk.....",".kAYYAk.....","..kAYk......","...kYk......","...kYkkk....","...kYAYk....","...kYkk.....","...kYAk.....","....kk......"]),
  piece:mkSpr(["............","..kk........",".krrk.......",".krwrk......",".krrrrk.....","..krrrk.....","...krrk.....","....kk......","............","............","............","............"])
});
Object.assign(IC,{
  pin:mkSpr(["....kkkk....","...kYYYYk...","..kYLLYYzk..",".kYLYrrYYzk.",".kYYrrrrYzk.",".kYYrrrrYzk.",".kYYYrrYYzk.","..kYYYYYzk..","...kzzzzk...","....kkkk....",".....kk.....",".....k......"]),
  tap:mkSpr(["............","............","...kkkkkk...","..kIIIIIIk..",".kINNNNNNIk.",".kNNNNNNNNk.","..kNNNNNNk..","...kkkkkk...","............","............","............","............"]),
  lure:mkSpr(["....kk......","...kYk......","...kk.......","..kkrrk.....",".kwrrrrk....",".krrrrrrkk..","..krrrrrYYk.","...kkrrrkk..","....k.kk....","...kk.......","............","............"]),
  trash:mkSpr(["............","....kkkk....","...kqqqqk...","..kkkkkkkk..","..kqwqqqQk..","..kqwqqqQk..","..kqqwqqQk..","..kqqwqqQk..","..kqqqqqQk..","...kkkkkk...","............","............"])
});
function drawCar(c){const x=Math.round(c.x),y=Math.round(c.y),L=c.len,h=L/2;shadow(x,y+6,h-2);
  if(c.kind=='bus'){R(x-h,y-12,L,17,'#1a1423');R(x-h+1,y-11,L-2,15,'#f4f4f8');R(x-h+1,y-5,L-2,3,'#3d63c8');for(let i=-h+4;i<h-6;i+=7)R(x+i,y-10,5,4,'#28406a');R(x+(c.dir>0?h-4:-h+1),y-9,3,6,'#a8dcf4');}
  else{R(x-h,y-6,L,11,'#1a1423');R(x-h+1,y-5,L-2,9,c.col);R(x-h+6,y-10,L-12,6,'#1a1423');R(x-h+7,y-9,L-14,4,'#a8dcf4');R(x-h+1,y-5,L-2,1,'rgba(255,255,255,.4)');
    R(x+(c.dir>0?h-3:-h+1),y-3,2,2,'#fff2a8');}
  R(x-h+3,y+3,6,4,'#1a1423');R(x+h-9,y+3,6,4,'#1a1423');}
const KEYS4=['granite','iron','brick','bronze'];
const KEYNAME={granite:'Granite',iron:'Iron',brick:'Brick',bronze:'Bronze'},KEYCOL={granite:['#a3a6ad','#6c6e7a','#d4d6dc'],iron:['#4d5f7a','#2e3a50','#7c90b0'],brick:['#b3543d','#7a3428','#d88068'],bronze:['#c08840','#7a5420','#e8b070']};
const TRADE={melon:['Watermelon',IC.melon,'From the Carytown festival. Someone hungry might trade for it.'],music:['Sheet Music',IC.music,'An old Wurlitzer arrangement. The Byrd organist would love it.'],
  rivermap:['Old River Map',IC.rivermap,'Shows a safe line through the rapids. A kayaker could use it.']};
const KSIC={};for(const k in KEYCOL){const c=mkCanvas(12,12),x=c.getContext('2d'),q=KEYCOL[k],f=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
  f(0,0,12,12,'#1a1423');f(1,1,10,10,q[0]);f(1,1,10,2,q[2]);f(1,1,2,10,q[2]);f(1,9,10,2,q[1]);f(9,1,2,10,q[1]);f(4,4,4,4,q[1]);f(5,5,2,2,q[2]);KSIC[k]=c;}
IC.hook=mkSpr(["....kkk.....","...kYzYk....","....kzk.....","....kNk.....","....kNk.....","....kNk.....",".kk.kNk.kk..","kIk.kNk.kIk.","kIk.kNk.kIk.",".kIkkNkkIk..","..kIIIIIk...","...kkkkk...."]);
IC.rod=mkSpr(["..........kk",".........kNk","........kNk.",".......kNk..","......kNk...",".....kNk.q..","....kuk..q..","...kuk...q..","..kUk...krk.",".kUk....kwk.","kUk......k..",".k.........."]);
IC.frog=mkSpr(["..kk....kk..",".kwek..kwek.",".kDDkkkkDDk.","kDDDDDDDDDDk","kDTTTTTTTTDk",".kDTTTTTTDk.","kDkkDDDDkkDk","kk..kkkk..kk"],{D:'#2f7a3c',T:'#68b854'});
IC.can=mkSpr(["............","......kkkk..",".....k....k.","..k.kkkkkk.k",".kNkNIIIINkk","kNk.kNIIIINk","k...kNNNNNNk","....kNNNNNNk","....kNNNNNNk",".....kkkkkk.","............","............"],{N:'#3a8a8a',I:'#7ac8c0'});
IC.oar=mkSpr(["..........kk",".........kuk","........kuk.",".......kuk..","......kuk...",".....kuk....","....kuk.....","..kkuk......",".kAAk.......","kAAAk.......","kAAk........",".kk........."]);
IC.lure=mkSpr(["....kk......","...kYk......","...kk.......","..kkYYk.....",".kYLYYzk....","kYLYYYzzk...","kYYYzzzk....",".kzzzzk.....","..kkkk.k....","......kk.k..",".......kkk..","............"]);
IC.card=mkSpr(["..kkkkkkkk..","..kYYYYYYk..","..kYqqqqYk..","..kYqiiqYk..","..kYqiiqYk..","..kYqqqqYk..","..kYYYYYYk..","..kYkkkkYk..","..kYYYYYYk..","..kkkkkkkk..","............","............"]);
IC.fish=mkSpr(["............","............","....kkkk....","..kkqqqqkk.k",".kqwkqqqqqkk",".kqqqqqqqqqk","..kQQQQQQkkk","...kkkkkk..k","............","............","............","............"]);
const ITEMS=[
  {id:'lantern',name:'Gas Lantern',ic:IC.lantern,desc:'Lights a cold brazier in front of you. Carrying it also pushes back the dark underground.'},
  {id:'balls',name:'Baseballs',ic:IC.ball,ammo:'balls',desc:'Throws a ball straight ahead. Refill at the Carytown shop or from the ballplayer.'},
  {id:'powder',name:'Blasting Powder',ic:IC.keg,ammo:'powder',desc:'Sets a keg down that blows a moment later. Cracked walls and rubble give way.'},
  {id:'bug',name:'The Gold-Bug',ic:IC.bug,desc:'Flies out and back, stunning small foes and fetching anything it touches, even over water.'},
  {id:'shoes',name:'Running Shoes',ic:IC.shoes,desc:'Dash straight ahead. Small foes get bowled over, and nothing can hurt you mid-dash.'},
  {id:'hook',name:'Grappling Hook',ic:IC.hook,desc:'Fires a chain ahead. Hook an iron post to fly over a gap. It yanks armor loose, too.'},
  {id:'rod',name:'Fishing Rod',ic:IC.rod,desc:'Cast into water with B. Press A when it bites, then tap A to reel. Mind the tension!'},
  {id:'can',name:'Watering Can',ic:IC.can,desc:'Water a sprout and it grows like crazy, even across a gap. Some big plants like it too.'},
  {id:'bottle',name:'Ginger Beer',ic:IC.bottle,desc:'Drink it to refill every heart. The brewer in Scott\'s Addition refills it for free.'}
];

/* ---------- state ---------- */
let mode='title',frame=0,fade=0,dlg=null,trans=null,menu=null,shop=null,cur,curId,enemies=[],shots=[],picks=[],parts=[],bombs=[],bug=null,st,p,winT=0;
let hook=null,fish=null,hitstop=0,hurtT=0,chal=null,cars=[],birds=[],banner='',bannerT=0,toastMsg='',toastT=0,shake=0,needSave=false,titleSel=0,saveData=null;
function newState(){return{coins:0,got:{},f:{},keys:{},lore:{},vis:{},items:{},ammo:{balls:0,powder:0},cap:{balls:30,powder:10},eq:null,bottle:0,shield:0,ret:null,dent:null,ow:[2,1],kills:0,pieces:0,trade:null,kayak:0,pins:{},gold:0,clock:4500,time:0,wx:'clear',wxT:2400,wxk:0,wxNext:null,snow:0,cards:{},fish:{},frogs:0,ng:0,ach:{},splits:{},nightKills:0,lure:0,rush:null};}
function newPlayer(){return{x:136,y:120,dir:0,hp:6,max:6,inv:0,atk:0,kt:0,kx:0,ky:0,moving:false,charging:false,charge:0,spin:0,dash:0,trail:[],hold:null};}
const HPS={arum:8,foreman:9,rat:1,squirrel:1,goose:2,scooter:2,crab:2,bat:1,ghost:2,raven:7,vampire:14,turtle:8,wraith:6,bell:8};
const FLY={bat:1,ghost:1,raven:1,vampire:1,wraith:1,bell:1};
const BOSS={arum:1,foreman:1,raven:1,vampire:1,turtle:1,wraith:1,bell:1};
function mk(type,x,y){const hp=HPS[type]*(st&&st.ng?2:1);return{type,x,y,hp,mhp:hp,vx:0,vy:0,t:rnd(30),flash:0,kt:0,kx:0,ky:0,f:1,stuck:false,gone:false,stun:0,state:type=='bell'?'float':'walk',st:0,vis:0,z:type=='bell'?40:0,boss:!!BOSS[type]};}
const nKeys=()=>KEYS4.filter(k=>st.got[k]).length;
const MW=()=>cur.w*TS,MH=()=>cur.h*TS;
function updCam(){cam.x=clamp(Math.round(p.x-W/2),0,Math.max(0,MW()-W));cam.y=clamp(Math.round(p.y-PH/2),0,Math.max(0,MH()-PH));}
const nLore=()=>Object.keys(st.lore).length;
function isSolved(s){if(!s)return false;if(s.solve=='lit')return(s.braz||[]).every((b,i)=>st.f['b:'+s.id+':'+i]);if(s.solve=='clear')return!!st.f['clr:'+s.id];if(s.solve=='switch')return!!st.f['sw:'+s.id];return false;}
function applyDyn(s){
  s.g=s.g0.map(r=>r.map(c=>c=='#'?s.base:c));
  for(const d of s.dyn){const o=(d.flag&&st.f[d.flag])||(d.solved&&isSolved(SC[d.solved]));for(const [x,y] of d.cells)s.g[y][x]=o?d.open:d.closed;}
  (s.braz||[]).forEach(([x,y],i)=>s.g[y][x]=st.f['b:'+s.id+':'+i]?'J':'j');
  for(const c of s.chests||[]){if(st.f['c:'+c.id])s.g[c.ty][c.tx]='o';else if(!c.appear||isSolved(s))s.g[c.ty][c.tx]='c';}
  if(s.bossT&&st.f['boss:'+s.id])s.g[8][7]=s.g[8][8]='E';
  if(s.interior)s.g0.forEach((r,y)=>r.forEach((c,x)=>{if(c!='z'||!st.f['grow:'+s.id+':'+x+','+y])return;s.g[y][x]='1';
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){let X=x+dx,Y=y+dy;if(!s.g0[Y]||s.g0[Y][X]!='_')continue;while(s.g0[Y]&&s.g0[Y][X]=='_'){s.g[Y][X]='|';X+=dx;Y+=dy;}}}));
}
/* map canvases are cached per scene and painted a few rows at a time in the background */
const CVC=new Map();let jobs=[];
const sigOf=s=>s.g.map(r=>r.join('')).join('|');
function cacheGet(s){const sig=sigOf(s),c=CVC.get(s.id);if(c&&c.sig===sig){CVC.delete(s.id);CVC.set(s.id,c);return c;}return null;}
function cachePut(s,sig,cv0){const e={sig,cv:[cv0,null,null,null],torches:s.torches};CVC.set(s.id,e);
  while(CVC.size>14){const k=CVC.keys().next().value;if(k===curId)break;CVC.delete(k);}
  for(let f=1;f<4;f++)jobs.push({id:s.id,e,fr:f});return e;}
function refresh(){applyDyn(cur);let c=cacheGet(cur);
  if(!c){jobs=jobs.filter(j=>j.id!==cur.id);cur.torches=[];c=cachePut(cur,sigOf(cur),renderMap(cur,0));jobs.sort((a,b)=>(b.id===cur.id)-(a.id===cur.id));}
  cur.cv=c.cv;cur.torches=c.torches;}
function prefetch(){
  jobs=jobs.filter(j=>!j.pre&&!j.new&&CVC.get(j.id)===j.e);
  const ids=new Set();
  if(cur.ow){for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])ids.add('ow:'+(cur.ax+dx)+','+(cur.ay+dy));for(const d of cur.doors||[])ids.add(d.to);}
  else{for(const id in SC){const q=SC[id];if(q.area==cur.area&&Math.abs(q.ax-cur.ax)+Math.abs(q.ay-cur.ay)==1)ids.add(id);}if(st&&st.ret)ids.add(st.ret[0]);}
  for(const id of ids)if(SC[id]&&id!==curId&&!jobs.some(j=>j.pre===id))jobs.push({pre:id});
}
/* one background step: paint part of a map canvas, then yield */
function runJob(){
  const j=jobs[0];if(!j)return false;
  if(j.pre){jobs.shift();const s=SC[j.pre];applyDyn(s);if(cacheGet(s))return true;j.e=null;j.s=s;j.id=s.id;j.fr=0;j.new=true;jobs.unshift(j);delete j.pre;return true;}
  const s=SC[j.id];
  if(!j.cv){if(j.fr>0&&j.e.cv[j.fr]){jobs.shift();return true;}j.cv=mkCanvas(s.w*TS,s.h*TS);j.y=0;j.ph=0;if(j.fr==0)s.torches=[];}
  const old=g;g=j.cv.getContext('2d');
  if(j.ph==0){const y1=Math.min(s.h,j.y+4);for(let y=j.y;y<y1;y++)for(let x=0;x<s.w;x++)tile(s,s.g[y][x],x,y,j.fr);j.y=y1;if(j.y>=s.h){j.ph=1;j.y=0;}}
  else if(j.ph==1){const y1=Math.min(s.h,j.y+8);for(let y=j.y;y<y1;y++)for(let x=0;x<s.w;x++)shadeTile(s,x,y);j.y=y1;if(j.y>=s.h)j.ph=2;}
  else{drawLandmarks(s,j.fr);jobs.shift();
    if(j.new){applyDyn(s);cachePut(s,sigOf(s),j.cv);}
    else if(j.stale){j.cv=null;j.stale=0;jobs.push(j);}
    else if(CVC.get(j.id)===j.e)j.e.cv[j.fr]=j.cv;}
  g=old;return true;
}
function pump(ms){const t0=performance.now();let n=0;while(jobs.length&&(n++<1||performance.now()-t0<ms)){if(!runJob())break;}}
function load(id){
  cur=SC[id];curId=id;enemies=[];shots=[];picks=[];parts=[];bombs=[];bug=null;hook=null;fish=null;hitstop=0;fade=10;
  refresh();
  blocks=[];cur.g0.forEach((r,y)=>r.forEach((c,x)=>{if(c=='#')blocks.push({tx:x,ty:y,x:x*TS,y:y*TS,mv:0,dx:0,dy:0});}));
  if(st.f['sw:'+id]){const sw=[];cur.g0.forEach((r,y)=>r.forEach((c,x)=>{if(c=='^')sw.push([x,y]);}));blocks.forEach((b,i)=>{if(sw[i]){b.tx=sw[i][0];b.ty=sw[i][1];b.x=b.tx*TS;b.y=b.ty*TS;}});}
  push.n=0;
  for(const n of cur.npcs||[])if(!n.spr)n.spr=npcSpr(n);
  if(cur.leafy==null){let c=0;for(const r of cur.g)for(const ch of r)if(ch=='T')c++;cur.leafy=!!cur.ow&&c>=24;}
  if(chal&&chal.scene!==id){chal=null;toast('Challenge abandoned.');}
  cars=(cur.cars||[]).map(c=>({x:rnd(cur.w*TS),y:c.y*TS+8,dir:c.dir,kind:c.kind||'car',len:c.kind=='bus'?40:26,sp:c.kind=='bus'?.8:1.1,stop:0,col:['#e83048','#3d63c8','#f2c14e','#2e9d6b','#e8e4dc'][rnd(5)]}));
  birds=(cur.birds||[]).map(([x,y])=>({x:x*TS+8,y:y*TS+10,hx:x*TS+8,hy:y*TS+10,st:'sit',t:rnd(60),vx:0,vy:0}));
  if(cur.ow)st.ow=[cur.ax,cur.ay];
  st.vis[id]=1;
  const done=cur.ow?false:cur.bossT?st.f['boss:'+id]:st.f['clr:'+id];
  if(!done)for(const [t,tx,ty] of cur.en)enemies.push(mk(t,tx*TS+8,ty*TS+8));
  if(cur.ow&&SECRETS[id]&&!st.got['sec:'+id]){const [sx,sy]=SECRETS[id];picks.push({x:sx*TS+8,y:sy*TS+8,kind:'secret',id:'sec:'+id,life:1e9});}
  if(cur.ow)seasonOnLoad();
  if(cur.ow&&dark()>.6)for(let i=0,n=0;i<60&&n<2;i++){const x=rnd(cur.w)*TS+8,y=rnd(cur.h)*TS+8;if(!blocked(x,y,6,true)&&Math.hypot(x-p.x,y-p.y)>90){const e=mk(n?'ghost':'bat',x,y);e.night=1;enemies.push(e);n++;}}
  for(const it of cur.items||[])if(!st.got[it.id])picks.push({x:it.px||it.tx*TS+8,y:it.py||it.ty*TS+8,kind:it.kind,id:it.id,life:1e9});
  if(cur.bossT&&st.f['boss:'+id]){if(cur.reward&&!st.got[cur.reward])picks.push({x:112,y:80,kind:'keystone',id:cur.reward,life:1e9});
    if(!st.got['hc:'+id]&&cur.bossT!='vampire')picks.push({x:144,y:80,kind:'container',id:'hc:'+id,life:1e9});}
  banner=cur.name;bannerT=100;needSave=true;prefetch();
  if(cur.bossT&&!st.f['boss:'+id]&&!st.rush&&!st.f['intro:'+id]&&BOSSINTRO[cur.bossT]){st.f['intro:'+id]=1;say(BOSSINTRO[cur.bossT],null,cur.name);}
  if(typeof pickSong=='function')pickSong();
}
const push={n:0,dir:-1};
function blockAt(tx,ty){return blocks.find(b=>b.tx==tx&&b.ty==ty||(b.mv&&b.tx-b.dx==tx&&b.ty-b.dy==ty));}
function tryPush(){
  const [fx,fy]=front(8),tx=Math.floor(fx/TS),ty=Math.floor(fy/TS),b=blockAt(tx,ty);
  if(!b||b.mv){push.n=0;return;}
  if(cur.g[b.ty][b.tx]=='^'){if(push.n++==14)toast('It\'s locked onto the switch.');return;}
  if(push.dir!=p.dir){push.dir=p.dir;push.n=0;}
  if(++push.n<14)return;push.n=0;
  const nx=b.tx+DX[p.dir],ny=b.ty+DY[p.dir],t=cur.g[ny]&&cur.g[ny][nx];
  if(!t||SOLID.includes(t)||blockAt(nx,ny)||t=='E'||t=='D'){sfx(150,.05);return;}
  b.tx=nx;b.ty=ny;b.dx=DX[p.dir];b.dy=DY[p.dir];b.mv=8;sfx(110,.15,'square',.03);
}
function updBlocks(){
  for(const b of blocks)if(b.mv){b.mv--;b.x+=b.dx*2;b.y+=b.dy*2;if(!b.mv){b.x=b.tx*TS;b.y=b.ty*TS;
    if(cur.solve=='switch'&&!st.f['sw:'+curId]){const sw=[];cur.g.forEach((r,y)=>r.forEach((c,x)=>{if(c=='^')sw.push([x,y]);}));
      if(sw.length&&sw.every(([x,y])=>blocks.some(q=>q.tx==x&&q.ty==y&&!q.mv))){st.f['sw:'+curId]=1;refresh();tune(SECRET);toast((cur.chests||[]).length?'A chest appeared!':'Something opened nearby.');needSave=true;}
      else if(cur.g[b.ty][b.tx]=='^')sfx(660,.08,'triangle');}}}
}
function burst(x,y,n,cols,sp0,size){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp0*(.4+Math.random());parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:14+rnd(10),max:24,c:cols[rnd(cols.length)],s:size});}}
function toast(m){toastMsg=m;toastT=150;}
function learn(id){if(!LOREM[id]||st.lore[id])return;st.lore[id]=1;toast('Journal: '+LOREM[id].t);needSave=true;}

/* ---------- save ---------- */
let saveSlot=1;try{saveSlot=+localStorage.getItem('rcq-slot')||1;}catch(e){}
const saveKey=n=>n==1?'rcq-save-2':'rcq-save-2-s'+n;
function save(){if(st&&st.rush)return;try{localStorage.setItem(saveKey(saveSlot),JSON.stringify({st,max:p.max,at:curId,x:p.x,y:p.y}));localStorage.setItem('rcq-slot',saveSlot);}catch(e){}}
function readSave(n){try{const d=JSON.parse(localStorage.getItem(saveKey(n||saveSlot))||'null');return d&&d.st&&SC[d.at]?d:null;}catch(e){return null;}}
function newGame(){st=newState();p=newPlayer();load('ow:2,1');p.x=7*TS+8;p.y=8*TS+8;p.dir=2;mode='play';
  say(['A cold fog has rolled up off the James, and the gas lamps of Richmond are going dark.','The archivist by the Capitol wants a word. Walk up and press A to talk.']);}
function continueGame(d){st=Object.assign(newState(),d.st);p=newPlayer();p.max=d.max;p.hp=p.max;load(d.at);p.x=d.x;p.y=d.y;settle();updCam();mode='play';}

/* ---------- sound ---------- */
let ac=null;
function wake(){if(ac){if(ac.state=='suspended')ac.resume().catch(()=>{});return;}try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){ac=null;}}
function sfx(f,d,type,v){if(!ac||!musicOn)return;try{const o=ac.createOscillator(),gn=ac.createGain();o.type=type||'square';o.frequency.value=f;
  gn.gain.value=v||.04;gn.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+(d||.08));o.connect(gn);gn.connect(ac.destination);o.start();o.stop(ac.currentTime+(d||.08));}catch(e){}}
function tune(seq,type){if(!ac||!musicOn)return;try{let t=ac.currentTime;for(const [f,d] of seq){if(f){const o=ac.createOscillator(),gn=ac.createGain();o.type=type||'square';o.frequency.value=f;
  gn.gain.setValueAtTime(.045,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d*.95);o.connect(gn);gn.connect(ac.destination);o.start(t);o.stop(t+d);}t+=d;}}catch(e){}}
const JING=[[523,.09],[659,.09],[784,.09],[1047,.24]],SECRET=[[784,.07],[740,.07],[622,.07],[440,.07],[415,.07],[659,.07],[831,.07],[1047,.2]],ORGAN=[[392,.22],[523,.22],[659,.22],[784,.44],[659,.22],[784,.6]];

/* ---------- dialog ---------- */
function say(lines,cb,head,choices){
  const pages=[];
  const cw=OPT.big?21:27,lp=OPT.big?3:4;for(const s of lines){const ls=wrap(s,cw);for(let i=0;i<ls.length;i+=lp)pages.push(ls.slice(i,i+lp));}
  dlg={pages,i:0,n:0,cb:cb||null,head:head||'',choices:choices||null,sel:0};
}
function dlgUpdate(){
  const tot=dlg.pages[dlg.i].join('').length,last=dlg.i==dlg.pages.length-1;
  if(dlg.n<tot){dlg.n+=2;if(dlg.n%6==0)sfx(520,.02,'square',.012);}
  if(dlg.choices&&last&&dlg.n>=tot){const k=dlg.choices.length;
    if(nav('up')){dlg.sel=(dlg.sel+k-1)%k;sfx(600,.02);}if(nav('down')){dlg.sel=(dlg.sel+1)%k;sfx(600,.02);}
    if(press.a||press.b){const sel=press.a?dlg.sel:k-1,cb=dlg.cb;sfx(700,.03);dlg=null;if(cb)cb(sel);}return;}
  if(press.a||press.b){if(dlg.n<tot)dlg.n=tot;else{dlg.i++;dlg.n=0;sfx(700,.03);if(dlg.i>=dlg.pages.length){const cb=dlg.cb;dlg=null;if(cb)cb();}}}
}
