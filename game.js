"use strict";
const W=256,PH=176,HUD=24,FH=PH+HUD,S=3;
const cv=document.getElementById('game');cv.width=W*S;cv.height=FH*S;
const ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
const buf=mkCanvas(W,FH);let g=buf.getContext('2d');g.imageSmoothingEnabled=false;
const SOLID='TBCwrxfWPMLHjJcoYGQVhOZ%bUg~XRliaquyte_+',BUGSOLID=SOLID.replace('w','').replace('~','').replace('_',''),BALLSOLID=BUGSOLID;
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
  {id:'bottle',name:'Ginger Beer',ic:IC.bottle,desc:'Drink it to refill every heart. The brewer in Scott\'s Addition refills it for free.'}
];

/* ---------- state ---------- */
let mode='title',frame=0,fade=0,dlg=null,trans=null,menu=null,shop=null,cur,curId,enemies=[],shots=[],picks=[],parts=[],bombs=[],bug=null,st,p,winT=0;
let hook=null,fish=null,hitstop=0,hurtT=0,chal=null,cars=[],birds=[],banner='',bannerT=0,toastMsg='',toastT=0,shake=0,needSave=false,titleSel=0,saveData=null;
function newState(){return{coins:0,got:{},f:{},keys:{},lore:{},vis:{},items:{},ammo:{balls:0,powder:0},cap:{balls:30,powder:10},eq:null,bottle:0,shield:0,ret:null,dent:null,ow:[2,1],kills:0,pieces:0,trade:null,kayak:0,pins:{},gold:0,clock:4500,time:0,wx:'clear',wxT:2400,wxk:0,wxNext:null,snow:0,cards:{},fish:{},frogs:0};}
function newPlayer(){return{x:136,y:120,dir:0,hp:6,max:6,inv:0,atk:0,kt:0,kx:0,ky:0,moving:false,charging:false,charge:0,spin:0,dash:0,trail:[],hold:null};}
const HPS={foreman:9,rat:1,squirrel:1,goose:2,scooter:2,crab:2,bat:1,ghost:2,raven:7,vampire:14,turtle:8,wraith:6,bell:8};
const FLY={bat:1,ghost:1,raven:1,vampire:1,wraith:1,bell:1};
const BOSS={foreman:1,raven:1,vampire:1,turtle:1,wraith:1,bell:1};
function mk(type,x,y){return{type,x,y,hp:HPS[type],vx:0,vy:0,t:rnd(30),flash:0,kt:0,kx:0,ky:0,f:1,stuck:false,gone:false,stun:0,state:type=='bell'?'float':'walk',st:0,vis:0,z:type=='bell'?40:0,boss:!!BOSS[type]};}
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
  cur=SC[id];curId=id;enemies=[];shots=[];picks=[];parts=[];bombs=[];bug=null;hook=null;fish=null;fade=10;
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
  if(cur.ow&&dark()>.6)for(let i=0,n=0;i<60&&n<2;i++){const x=rnd(cur.w)*TS+8,y=rnd(cur.h)*TS+8;if(!blocked(x,y,6,true)&&Math.hypot(x-p.x,y-p.y)>90){const e=mk(n?'ghost':'bat',x,y);e.night=1;enemies.push(e);n++;}}
  for(const it of cur.items||[])if(!st.got[it.id])picks.push({x:it.px||it.tx*TS+8,y:it.py||it.ty*TS+8,kind:it.kind,id:it.id,life:1e9});
  if(cur.bossT&&st.f['boss:'+id]){if(cur.reward&&!st.got[cur.reward])picks.push({x:112,y:80,kind:'keystone',id:cur.reward,life:1e9});
    if(!st.got['hc:'+id]&&cur.bossT!='vampire')picks.push({x:144,y:80,kind:'container',id:'hc:'+id,life:1e9});}
  banner=cur.name;bannerT=100;needSave=true;prefetch();
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
function save(){try{localStorage.setItem(saveKey(saveSlot),JSON.stringify({st,max:p.max,at:curId,x:p.x,y:p.y}));localStorage.setItem('rcq-slot',saveSlot);}catch(e){}}
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
  for(const s of lines){const ls=wrap(s,27);for(let i=0;i<ls.length;i+=4)pages.push(ls.slice(i,i+4));}
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
/* ---------- neighborhood challenges ---------- */
function offer(n,pre){const d=CHAL[n.chal],done=st.pins[n.chal];
  say(pre.concat([d.intro,done?'You\'ve already earned this pin. Go again for a few coins?':'Win and you get a Richmond city pin.']),sel=>{if(sel==0)startChal(n.chal,n);},d.name,['Let\'s go!','Not now']);return null;}
function startChal(id,n){const d=CHAL[id];
  if(d.needs=='bug'&&!st.items.bug){say(['You\'d need something that can fly over the water and bring things back.'],null,n.who);return;}
  if(d.type=='light'&&!st.items.lantern){say(['You\'ll need a lantern for this one.'],null,n.who);return;}
  if(d.type=='quiz'){runQuiz(n);return;}
  const sp=cur.spots;chal={id,d,t:d.time*60,got:0,need:0,set:new Set(),who:n.who,scene:curId};
  if(d.type=='collect'){chal.need=sp.length;for(const [x,y] of sp)picks.push({x:x*TS+8,y:y*TS+8,kind:'token',ic:d.ic,life:1e9,chal:1});}
  else if(d.type=='race'){chal.need=1;const [x,y]=sp[0];picks.push({x:x*TS+8,y:y*TS+8,kind:'flag',life:1e9,chal:1});}
  else if(d.type=='defeat'){chal.need=d.n;for(let i=0;i<d.n;i++){const [x,y]=sp[i%sp.length],e=mk(d.foe,x*TS+8+(i>=sp.length?6:0),y*TS+8);e.chal=1;enemies.push(e);}}
  else if(d.type=='light')chal.need=cur.lamps.length;
  else if(d.type=='tag')chal.need=cur.murals.length;
  tune([[523,.08],[784,.08],[1047,.16]]);toast(d.name+': go!');
}
function chalProgress(){if(!chal)return;chal.got++;sfx(988,.06,'triangle');if(chal.got>=chal.need)chalWin();}
function chalClear(){picks=picks.filter(k=>!k.chal);enemies=enemies.filter(e=>!e.chal);}
function chalWin(){const c=chal,first=!st.pins[c.id];st.pins[c.id]=1;st.coins=Math.min(999,st.coins+(first?25:10));chalClear();chal=null;needSave=true;tune(JING);
  const L=[c.d.name+': you did it!',first?'You earned a Richmond city pin and 25 coins. ('+Object.keys(st.pins).length+' of '+NCHAL+' pins)':'Ten coins for another win.'];
  if(first&&Object.keys(st.pins).length>=NCHAL&&!st.gold){st.gold=1;L.push('That\'s every pin in Richmond! Your kayak paddle turns gold. It hits twice as hard now.');p.hold={ic:IC.paddle,t:90};}
  else if(first)p.hold={ic:IC.pin,t:90};
  say(L,null,c.who);}
function chalFail(){const c=chal;chalClear();chal=null;sfx(150,.3,'sawtooth',.04);say(['Time\'s up!','Talk to the '+c.who.toLowerCase()+' to try again.'],null,c.d.name);}
function runQuiz(n){const read=LORE.filter(l=>st.lore[l[0]]);
  if(read.length<3){say(['Find at least three stories for your journal first, from markers, statues and people. Then come back!'],null,n.who);return;}
  const pool=read.slice(),qs=[];for(let i=0;i<3;i++)qs.push(pool.splice(rnd(pool.length),1)[0]);let score=0,i=0;
  const ask=()=>{if(i>=3){if(score==3){chal={id:'quiz',d:CHAL.quiz,who:n.who};chalWin();}else say([score+' out of 3. Brush up on your journal and try again!'],null,n.who);return;}
    const L=qs[i],others=LORE.filter(o=>o[0]!=L[0]),opts=[L[1]];while(opts.length<3){const o=others[rnd(others.length)][1];if(!opts.includes(o))opts.push(o);}
    opts.sort(()=>Math.random()-.5);const sn=L[2].split('. ')[0],q=sn.length>95?sn.slice(0,92)+'...':sn+'.';
    say(['Question '+(i+1)+' of 3: which journal story is this from?','"'+q+'"'],sel=>{if(opts[sel]==L[1]){score++;tune([[784,.06],[1047,.1]]);}else sfx(150,.12);i++;ask();},n.who,opts);};
  ask();}
function give(code){
  let ic=null,L=[];
  switch(code){
    case'lantern':st.items.lantern=1;st.eq='lantern';ic=IC.lantern;L=['You got the Gas Lantern!','Use it with B on cold braziers. Carrying it also lights up dark places.'];break;
    case'balls':st.items.balls=1;st.ammo.balls=Math.max(st.ammo.balls,15);st.eq='balls';ic=IC.ball;L=['You got Baseballs!','Use them with B to throw one straight ahead.'];break;
    case'bottle':st.items.bottle=1;st.bottle=1;if(!st.eq)st.eq='bottle';ic=IC.bottle;L=['You got a bottle of Ginger Beer!','Drink it with B to refill every heart. Bring the bottle back and I\'ll fill it free.'];break;
    case'powder':st.items.powder=1;st.ammo.powder=Math.max(st.ammo.powder,8);st.eq='powder';ic=IC.keg;L=['You got the Blasting Powder!','Use it with B to set down a keg. Cracked walls and rubble give way. One cracked wall is right here.'];break;
    case'shield':st.shield=1;ic=IC.shield;L=['You got the Cast-Iron Shield!','It works on its own. Face a shot head-on and it bounces straight back.'];break;
    case'bug':st.items.bug=1;st.eq='bug';ic=IC.bug;L=['You got the Gold-Bug!','A golden beetle from Poe\'s story. Throw it with B and it flies back with whatever it touches.'];break;
    case'shoes':st.items.shoes=1;st.eq='shoes';ic=IC.shoes;L=['You got the Running Shoes!','Use them with B to dash. Small foes get bowled over.'];break;
    case'hook':st.items.hook=1;st.eq='hook';ic=IC.hook;L=['You got the Grappling Hook!','Fire it with B. Hook an iron post to fly across a gap. There\'s a post across that pit.'];break;
    case'rod':st.items.rod=1;st.eq='rod';ic=IC.rod;L=['You got a Fishing Rod!','Face open water and cast with B.'];break;
    case'key':st.keys[cur.area]=(st.keys[cur.area]||0)+1;ic=IC.key;L=['You got a small key!','It opens one locked door in this place.'];break;
    case'hc':p.max+=2;p.hp=p.max;ic=HEART;L=['A heart charm! Your hearts grew by one.'];break;
    case'coins20':st.coins+=20;ic=COIN[0].r.c;L=['Twenty coins!'];break;
    case'coins50':st.coins=Math.min(999,st.coins+50);ic=COIN[0].r.c;L=['A hidden stash of fifty coins!'];break;
    case'piece':st.pieces++;ic=IC.piece;
      if(st.pieces%4==0){p.max+=2;p.hp=p.max;L=['A heart piece! That makes four. Your hearts grew by one.'];}
      else L=['A heart piece! ('+(st.pieces%4)+' of 4) Find four to grow a heart.'];break;
    case'kayak':st.items.kayak=1;st.trade=null;ic=IC.kayak;L=['You got the Kayak!','Walk into whitewater on the James to paddle across it. The south bank is open to you now.'];break;
    case'melon':case'music':case'rivermap':st.trade=code;ic=TRADE[code][1];L=['You got the '+TRADE[code][0]+'!',TRADE[code][2]];break;
  }
  if(ic)p.hold={ic,t:90};tune(JING);needSave=true;return L;
}
const TALK={
  archivist(){
    if(!st.items.lantern)return['Fog off the James, and the gas lamps dying block by block. Something woke under Church Hill.',
      'The old railroad tunnel caved in back in 1925. Four keystones hold its seal shut.',
      'Granite is in the Belle Isle quarry. Iron is in the Hollywood Cemetery pyramid. Brick is down in the cellar of the Poe Museum. Bronze is up in the Carillon.',
      ...give('lantern'),
      'Press MENU any time for your items, gear, journal and map. Choose which item B uses there.',
      'Historical markers and the people of this city all have stories. Fill your journal with 8 and come see me.'];
    const n=nLore();
    if(n>=18&&!st.f.ar2){st.f.ar2=1;st.cap.balls=50;st.cap.powder=16;needSave=true;tune(JING);
      return[n+' stories! You know this city better than most who live in it.','Take these bigger satchels. You can carry 50 baseballs and 16 powder kegs now.'];}
    if(n>=8&&!st.f.ar1){st.f.ar1=1;return[n+' stories in your journal already. The Library of Virginia thanks you.',...give('hc')];}
    const h=[];
    if(!st.got.granite)h.push('Start at the Belle Isle quarry. Go south out of the square and across the footbridge. The quarrymen kept blasting powder down there.');
    else if(!st.got.iron)h.push('Rubble blocks the pyramid door in Hollywood Cemetery, southwest of here. Your blasting powder will clear it.');
    else if(!st.got.brick)h.push('The Poe Museum is in Shockoe Bottom, east of here. Its cellar goes deeper than anyone admits.');
    else if(!st.got.bronze)h.push('One keystone is left, in the Carillon in Byrd Park. Its caretaker lost the key. Start by asking her.');
    else h.push('All four keystones! The tunnel mouth is on Church Hill, north and east of here. Go steady.');
    if(!st.items.balls)h.push('There\'s a ballplayer up in Scott\'s Addition with a bucket of spare baseballs.');
    h.push(n<8?'Your journal holds '+n+' stories. Bring me 8 for a reward.':n<18?'Your journal holds '+n+' stories. Bring me 18 and I have something bigger.':'Your journal holds '+n+' stories. Few people know Richmond so well.');
    return h;
  },
  brewer(){p.hp=p.max;
    if(!st.items.bottle)return['Rough night? Ginger beer is on the house in Scott\'s Addition.',...give('bottle')];
    const was=st.bottle;st.bottle=1;needSave=true;
    return[was?'Hearts are topped off. Come back when that bottle runs dry.':'Filled your bottle back up, and your hearts too.'];},
  ballplayer(n){learn('diamond');
    if(!st.items.balls)return offer(n,['I was shagging flies by The Diamond and the fog ate half my bucket. Take what\'s left.',...give('balls')]);
    if(st.ammo.balls<10){st.ammo.balls=10;needSave=true;return offer(n,['Running low? Here, take a few.']);}
    return offer(n,['The Flying Squirrels play over at The Diamond. Best seats in town are out on the grass.']);},
  musician(){
    if(st.trade=='melon'){const L=give('music');return['Is that a Carytown watermelon? The band hasn\'t eaten all day! Take this in trade.',...L];}
    if(st.trade=='music'||st.trade=='rivermap'||st.items.kayak)return['That melon hit the spot. Hold A after a swing for a spin attack, by the way.'];
    return['Those rental scooters have gone feral. Two good whacks stops one.',
    'Hold A after a swing to wind up, then let go for a spin attack.',
    'The band\'s starving, too. A cold watermelon would hit the spot.'];},
  vendor(n){learn('carytown');
    if(!st.trade&&!st.items.kayak&&!st.f.melon){st.f.melon=1;return offer(n,['Watermelon festival leftovers! I can\'t sell another one. Take it, somebody will want it.',...give('melon')]);}
    return offer(n,['Best melons in Virginia, right here on Cary Street.']);},
  caretaker(){learn('carillon');
    if(st.got.bronze)return['The bells are ringing again. Thank you.'];
    if(st.got.carkey)return['My key! The Carillon door is open to you. Something heavy is swinging up in the bell chamber.'];
    return['When the fog came, I ran for the river and dropped the Carillon key somewhere in Forest Hill Park, across the James.',
      st.items.kayak?'You have a kayak? Then paddle the whitewater south of Belle Isle. Forest Hill is west of Manchester.':'You\'d need a boat to get over there. The kayaker on Belle Isle might lend one, if you have something she wants.'];},
  ranger(){learn('foresthill');
    return['This was an amusement park once. Carousel, roller coaster, even a penny arcade in the Stone House.',
      st.got.carkey?'Hope that key gets the bells ringing again.':'Somebody dropped something shiny behind the rocks east of the Stone House. Those rocks look cracked to me.'];},
  painter(n){learn('manchester');
    if(!st.f.painter){st.f.painter=1;st.coins+=30;needSave=true;tune(JING);return offer(n,['You paddled over in this fog? Brave. Here, the mural fund can spare 30 coins.']);}
    return offer(n,['Murals all along these walls. Manchester\'s been painting itself for years.']);},
  chal(n){return offer(n,[]);},
  naturalist(){
    if(st.f.frogsDone)return['The frog count is in the record books, thanks to you.','Come back on a rainy night. You never know what turns up.'];
    if(st.frogs>=5){st.f.frogsDone=1;st.coins=Math.min(999,st.coins+40);const got=awardCard('maymont',true);needSave=true;tune(JING);
      return['Five frogs! Wonderful. I\'ll count them and let them go by the lake.','Here are 40 coins for your trouble'+(got?', and a Maymont card for your collection.':'.')];}
    return['I\'m counting frogs for Maymont. They mostly come out when it rains, near the water.','Could you catch five for me? Just walk into them.'+(st.frogs?' You have '+st.frogs+' so far.':''),
      st.wx=='rain'?'It\'s raining right now. Go look!':'Wait for a rainy day, then check around the ponds and the river.'];},
  folk(n){n.li=(n.li||0)+1;return[n.lines[(n.li-1)%n.lines.length]];},
  docent(){return['The eggs in these cases were made for the Russian royal family.','Read the plaque on each case. A Virginian collector left them to the museum.'];},
  shop(){shop={cur:0,msg:'What can I get you?'};return null;},
  keeper(){learn('vampire');
    return['Folks say a pale thing crawled out of the tunnel collapse and ran here to hide in a tomb.','The truth is sadder. It\'s in your journal now if you want it.',
      st.f['rub:pyr']?'The pyramid\'s open now. The iron keystone is somewhere inside. Mind the ghosts.':'Rubble seals the pyramid door. Blasting powder from the Belle Isle quarry would clear it.'];},
  kayaker(){learn('tredegar');
    if(st.trade=='rivermap'){const L=give('kayak');return['A map of the old lines through the falls! I\'ve wanted one of these for years.','Here, take my spare kayak. Paddle the whitewater south of the island to reach Manchester.',...L];}
    if(st.items.kayak)return['Stay on the whitewater and you\'ll ride right across. Manchester\'s on the far bank.'];
    return['Tredegar Iron Works is just across the canal. They cast cannon there once.','The quarry door is in the rocks on the east side of the island.','Cracked rock hides more than you\'d think. Try powder on the rocks by the water.'];},
  runner(n){learn('k10');
    if(st.got.bib&&!st.items.shoes)return offer(n,['My race bib! I thought it was gone for good. Here, my spare running shoes. Fair trade.',...give('shoes')]);
    return offer(n,st.items.shoes?[]:['I dropped my race bib on a training run through Maymont. Find it and I\'ll trade you my spare running shoes.']);},
  henry(){learn('stjohns');
    return['"I know not what course others may take; but as for me, give me liberty or give me death!"','That\'s how Patrick Henry ended it, right in that church, in March of 1775.'];},
  teller(){learn('walker');
    return['Welcome to the St. Luke Penny Savings Bank.','Mrs. Walker started this bank in 1903 so people here could save and borrow when other banks turned them away.','Keep your coins handy, though. The Carytown shop takes them.'];},
  organist(){learn('byrd');tune(ORGAN,'triangle');
    if(st.trade=='music'){const L=give('rivermap');return['This arrangement! I haven\'t seen it since I was a kid. You have to let me keep it.','Take this old river map in trade. It was tucked in the organ bench.',...L];}
    return['The Mighty Wurlitzer! I play her before the Saturday night show.','Go ahead, press A at the console. She won\'t bite.'];},
  guide(){learn('capital1780');
    return['Welcome to the Capitol. The General Assembly still meets in this building.','Richmond has been Virginia\'s capital since 1780. Williamsburg was too easy for British ships to reach.'];}
};
const BOSSTXT={foreman:['The Iron Foreman grinds to a halt, steam hissing from every joint.','The furnaces gutter out. Tredegar is quiet again.'],turtle:['Old Snapper sinks back into the deep end of the quarry pond.','Something glints where it lay.'],
  wraith:['The wraith thins to mist and drifts up through the granite.','The pyramid falls quiet.'],
  raven:['The raven croaks one last word. You can guess which one.','It flaps off through a crack in the brick and is gone.'],
  bell:['The great bell cracks and settles on its beam.','From the top of the tower, the other bells start to ring.']};
const SHOP=[
  {name:'Fishing Rod',price:30,why:()=>st.items.rod?'SOLD OUT':'',buy(){st.items.rod=1;if(!st.eq)st.eq='rod';return'A fine rod. Use it on B at the water.';}},
  {name:'Landmark Card Pack',price:20,why:()=>PACK.every(c=>st.cards[c])?'SOLD OUT':'',buy(){const c=PACK.filter(c=>!st.cards[c]),id=c[rnd(c.length)];awardCard(id,true);return'You got the '+CARDM[id].name+' card!';}},
  {name:'Big Satchel',price:60,why:()=>st.f.satchel?'SOLD OUT':'',buy(){st.f.satchel=1;st.cap.balls=Math.max(st.cap.balls,50);st.cap.powder=Math.max(st.cap.powder,16);}},
  {name:'Heart Charm',price:15,why:()=>st.got.hcShop?'SOLD OUT':'',buy(){st.got.hcShop=1;give('hc');}},
  {name:'Ginger Beer',price:5,why:()=>!st.items.bottle?'NO BOTTLE':st.bottle?'FULL':'',buy(){st.bottle=1;}},
  {name:'10 Baseballs',price:4,why:()=>!st.items.balls?'???':st.ammo.balls>=st.cap.balls?'FULL':'',buy(){st.ammo.balls=Math.min(st.cap.balls,st.ammo.balls+10);}},
  {name:'4 Powder Kegs',price:8,why:()=>!st.items.powder?'???':st.ammo.powder>=st.cap.powder?'FULL':'',buy(){st.ammo.powder=Math.min(st.cap.powder,st.ammo.powder+4);}}
];

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
const litLamp=(x,y)=>cur.id!='ow:3,0'||st.pins.lamps||(chal&&chal.id=='lamps'&&chal.set.has(x+','+y));
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
  p.hp-=d;p.inv=50;hurtT=12;hitstop=4;const dx=p.x-sx,dy=p.y-sy,l=Math.hypot(dx,dy)||1;p.kx=dx/l*2.5;p.ky=dy/l*2.5;p.kt=8;p.atk=0;p.charging=false;p.spin=0;sfx(140,.18,'sawtooth');
  burst(p.x,p.y-4,6,['#e83048','#ffffff'],1.6,2);
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
    case'vampire':{const ph=e.t%170;e.gone=ph>=130;e.vx=dx;
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
  if(e.type=='foreman'){if(src=='hook'){if(e.state=='stun')return false;e.state='stun';e.st=170;e.flash=8;shake=6;sfx(1100,.1,'square',.05);sfx(180,.3,'sawtooth',.05);burst(e.x,e.y-12,14,['#8e909c','#d8dce4','#f8a030'],2.2,2);toast('The chest plate rips loose!');return true;}
    if(e.state!='stun'){sfx(1500,.05,'square',.03);burst(e.x,e.y-8,3,['#ffffff'],1,1);return'clank';}}
  if(e.type=='bell'&&e.state!='stun'){if(e.z>12)return false;if(src!='bomb'){sfx(1500,.05,'square',.03);return'clank';}}
  e.hp-=dmg;e.flash=16;hitstop=Math.max(hitstop,e.boss?4:3);e.kx=kx||0;e.ky=ky||0;e.kt=e.boss?2:8;sfx(240,.06);
  burst(e.x,e.y-2,5,['#ffffff','#fff2a8'],1.8,2);
  if(e.hp<=0){const i=enemies.indexOf(e);if(i>=0)enemies.splice(i,1);kill(e);}
  return true;
}
function kill(e){
  if(e.chal&&chal)chalProgress();
  st.kills++;sfx(90,.2,'sawtooth',.06);hitstop=e.boss?12:5;parts.push({ring:1,x:e.x,y:e.y-4,vx:0,vy:0,life:16,max:16,c:'#ffffff',s:0});for(let i=0;i<8;i++){const a=i*.785;parts.push({x:e.x+Math.cos(a)*4,y:e.y-4+Math.sin(a)*4,vx:Math.cos(a)*1.1,vy:Math.sin(a)*1.1-.2,life:20,max:20,c:i&1?'#d8d8e8':'#a8a8c0',s:4});}burst(e.x,e.y-2,e.boss?22:10,['#ffffff','#d8d8e8','#a8a8c0'],e.boss?2.2:1.3,3);
  if(e.type=='vampire'){enemies=[];shots=[];st.f['boss:'+curId]=1;st.f.won=1;needSave=true;
    say(['The pale thing shrieks and comes apart like wet newspaper.','Above you the fog thins. One by one the lamps along Broad Street come back on.','Richmond is safe. Somebody owes you a ginger beer.'],()=>{mode='win';winT=0;});return;}
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
    case'frog':st.frogs++;sfx(1400,.05,'triangle');burst(k.x,k.y,5,['#68b854','#ffffff'],1.2,1);toast(st.frogs>=5&&!st.f.frogsDone?'Five frogs! Take them to the naturalist in Byrd Park.':'Caught a frog! ('+Math.min(st.frogs,5)+'/5)');needSave=true;break;
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
  const id=st.eq;
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
    case'rod':{const [fx,fy]=front(20),t=tileAt(fx,fy);if(t!='w'&&t!='~'){toast('Face open water to cast.');sfx(150,.06);break;}
      if(enemies.some(e=>!e.gone&&Math.hypot(e.x-p.x,e.y-p.y)<60)){toast('Too much commotion to fish.');break;}
      fish={ph:'wait',t:80+rnd(160),x:fx,y:fy,ten:0,dist:0,sp:null,run:0};sfx(700,.08,'triangle');break;}
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
  if(mode=='play'&&st&&!menu&&!trans){st.clock++;st.time++;wxTick();}
  if(fade>0)fade--;if(bannerT>0)bannerT--;if(toastT>0)toastT--;if(shake>0)shake--;
  if(p&&p.hold&&--p.hold.t<=0)p.hold=null;
  if(mode=='title')titleUpdate();
  else if(mode=='win'){winT++;if(press.a&&winT>60){mode='title';titleInit();}}
  else if(trans){trans.t++;
    if(trans.fade){if(trans.t==12){load(trans.to);fade=0;p.x=trans.px;p.y=trans.py;settle();updCam();}if(trans.t>=24)trans=null;}
    else if(trans.iris){if(trans.t>=34)trans=null;}
    else if(trans.t>=20)trans=null;}
  else if(menu)menuUpdate();
  else if(shop)shopUpdate();
  else if(dlg)dlgUpdate();
  else if(fish)fishUpdate();
  else if(press.menu){menu={tab:0,cur:Math.max(0,ITEMS.findIndex(i=>i.id==st.eq)),jc:0,jt:0,rd:null};sfx(880,.05);}
  else if(hitstop>0){hitstop--;for(const q of parts)if(q.ring)q.life--;}
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
      const sp0=p.charging?.8:onRiver()?1.05:1.3,l=Math.hypot(dx,dy),ox=p.x,oy=p.y;moveP(dx/l*sp0,dy/l*sp0);p.moving=true;
      const [fx,fy]=front(8),ft=tileAt(fx,fy);if(ft=='L')tryUnlock(Math.floor(fx/TS),Math.floor(fy/TS),false);
      if(blocks.length&&(!dx||!dy)&&ox==p.x&&oy==p.y)tryPush();else push.n=0;
      if(ft=='~'&&!st.items.kayak&&toastT<=0)toast('Whitewater. You\'d need a boat.');
    }else{p.moving=false;push.n=0;}
    if(press.a){if(!interact()){p.atk=14;p.charging=false;sfx(420,.05);}}
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
  updBlocks();updLife();
  if(chal&&chal.t!=null&&--chal.t<=0){chalFail();return;}
  for(const e of enemies.slice())updEnemy(e);
  if(dlg||mode!='play')return;
  for(const e of enemies){if(e.gone||(e.type=='foreman'&&e.state=='stun')||(e.type=='turtle'&&e.state=='stun')||e.stun>0||(e.type=='bell'&&e.z>12))continue;const r=e.type=='turtle'||e.type=='bell'||e.type=='foreman'?13:e.boss?11:9;
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
  if(press.b){m.tab=(m.tab+1)%5;sfx(760,.04);return;}
  if(m.tab==0){
    if(nav('left')){m.cur=m.cur%4==0?m.cur+3:m.cur-1;sfx(600,.02);}
    if(nav('right')){m.cur=m.cur%4==3?m.cur-3:m.cur+1;sfx(600,.02);}
    if(nav('up')||nav('down')){m.cur=(m.cur+4)%8;sfx(600,.02);}
    if(press.a){const it=ITEMS[m.cur];if(st.items[it.id]){st.eq=it.id;sfx(990,.08,'triangle');needSave=true;}else sfx(150,.06);}
  }else if(m.tab==2){
    const N=LORE.length;
    if(nav('up'))m.jc=(m.jc+N-1)%N;if(nav('down'))m.jc=(m.jc+1)%N;
    if(m.jc<m.jt)m.jt=m.jc;if(m.jc>m.jt+10)m.jt=m.jc-10;
    if(nav('left')){m.tab=1;}else if(nav('right')){m.tab=3;}
    if(press.a){const [id,t,s]=LORE[m.jc];if(st.lore[id]){const ls=wrap(s,28),pages=[];for(let i=0;i<ls.length;i+=10)pages.push(ls.slice(i,i+10));m.rd={t,pages,pg:0};sfx(700,.03);}else sfx(150,.06);}
  }else if(m.tab==3){
    m.cc=m.cc||0;const N=CARDS.length;
    if(nav('left'))m.cc=(m.cc+N-1)%N;if(nav('right'))m.cc=(m.cc+1)%N;if(nav('up'))m.cc=(m.cc+N-4)%N;if(nav('down'))m.cc=(m.cc+4)%N;
    if(press.a){const c=CARDS[m.cc];if(st.cards[c.id]){const ls=wrap(c.fact,28);m.rd={t:c.name,pages:[ls],pg:0};sfx(700,.03);}else sfx(150,.06);}
  }else{
    if(nav('left'))m.tab=(m.tab+4)%5;else if(nav('right'))m.tab=(m.tab+1)%5;
  }
}
function shopUpdate(){
  if(press.b||press.menu){shop=null;say(['Come back any time!'],null,'Shopkeeper');return;}
  if(nav('up'))shop.cur=(shop.cur+SHOP.length-1)%SHOP.length;
  if(nav('down'))shop.cur=(shop.cur+1)%SHOP.length;
  if(press.a){const it=SHOP[shop.cur],why=it.why();
    if(why){sfx(150,.08);shop.msg=why=='???'?'You\'d need one of those first.':why=='FULL'?'You can\'t carry more.':why=='NO BOTTLE'?'You need a bottle for that.':'That one\'s gone.';}
    else if(st.coins<it.price){sfx(150,.08);shop.msg='Not enough coins.';}
    else{st.coins-=it.price;const r=it.buy();tune([[880,.06],[1175,.12]]);shop.msg=r||'Thank you kindly!';needSave=true;}}
}
let tl={lv:0,saves:[]},capture=null;
function titleInit(){tl={lv:0,saves:[1,2,3].map(n=>readSave(n))};titleSel=Math.max(0,Math.min(2,saveSlot-1));saveData=tl.saves[titleSel];}
function titleOpts(){
  if(tl.lv==0)return tl.saves.map((d,i)=>'SLOT '+(i+1)+'  '+(d?(d.max/2)+' HEARTS  '+fmtTime(d.st.time||0):'- EMPTY -')).concat(['OPTIONS']);
  if(tl.lv==1)return['CONTINUE','NEW GAME','BACK'];
  if(tl.lv==2)return['YES, ERASE IT','NO'];
  if(tl.lv==3)return['SOUND: '+(musicOn?'ON':'OFF'),'TIMER: '+(OPT.timer?'ON':'OFF'),'CONTROLS','BACK'];
  return ACTS.map(a=>ACTN[a]+'  '+bindName(a)).concat(['RESET KEYS','BACK']);
}
function titleUpdate(){
  if(capture)return;
  const o=titleOpts(),n=o.length;
  if(nav('up'))titleSel=(titleSel+n-1)%n;if(nav('down'))titleSel=(titleSel+1)%n;
  const go=(lv,sel)=>{tl.lv=lv;titleSel=sel||0;sfx(760,.05);};
  if(press.b){if(tl.lv==1||tl.lv==3)go(0,tl.lv==3?3:saveSlot-1);else if(tl.lv==2)go(1,1);else if(tl.lv==4)go(3,2);return;}
  if(!(press.a||press.menu))return;
  const sel=titleSel;
  if(tl.lv==0){if(sel==3){go(3);return;}saveSlot=sel+1;saveData=tl.saves[sel];if(saveData)go(1);else{sfx(660,.15,'triangle');newGame();}}
  else if(tl.lv==1){if(sel==0){sfx(660,.15,'triangle');continueGame(saveData);}else if(sel==1)go(2,1);else go(0,saveSlot-1);}
  else if(tl.lv==2){if(sel==0){sfx(660,.15,'triangle');newGame();}else go(1,1);}
  else if(tl.lv==3){if(sel==0)setSound(!musicOn);else if(sel==1){OPT.timer=!OPT.timer;try{localStorage.setItem('rcq-timer',OPT.timer?'1':'0');}catch(e){}sfx(880,.05);}else if(sel==2)go(4);else go(0,3);}
  else{if(sel<ACTS.length){capture=ACTS[sel];sfx(990,.05);}else if(sel==ACTS.length){CUST={};try{localStorage.removeItem('rcq-keys');}catch(e){}sfx(880,.05);}else go(3,2);}
}

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

/* ---------- drawing ---------- */
let texts=[];
function text(s,x,y,c,size,align,sh){texts.push([s,x,y,c,size||8,align||'left',sh]);}
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
function panel(x,y,w,h){R(x+1,y,w-2,h,'#f4f4f8');R(x,y+1,w,h-2,'#f4f4f8');
  const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'#2a3c9c');gr.addColorStop(1,'#0c1440');g.fillStyle=gr;g.fillRect(x+2,y+2,w-4,h-4);
  R(x+3,y+3,w-6,1,'#6878d0');R(x+3,y+3,1,h-6,'#6878d0');R(x+3,y+h-4,w-6,1,'#080c28');R(x+w-4,y+3,1,h-6,'#080c28');}
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
function drawLeaves(){if(!cur.leafy){leaves.length=0;return;}
  if(leaves.length<14&&Math.random()<.08)leaves.push({x:Math.random()*W,y:-4,vx:.2+Math.random()*.3,vy:.25+Math.random()*.25,ph:Math.random()*6,c:['#e07a28','#d8a838','#b84a20','#e8c050'][rnd(4)]});
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
  act.push([p.y,drawPlayer]);
  act.sort((a,b)=>a[0]-b[0]);for(const a of act)a[1]();
  for(const s of shots){const x=Math.round(s.x),y=Math.round(s.y);
    if(s.k=='ball'){R(x-2,y-2,5,5,'#1a1423');R(x-1,y-1,3,3,'#ffffff');R(x,y-1,1,1,'#e83048');}
    else if(s.k=='orb'){const c=s.refl?'#fff2a8':'#b890f8';R(x-4,y-3,8,6,'#1a1423');R(x-3,y-4,6,8,'#1a1423');R(x-3,y-3,6,6,c);R(x-1,y-2,2,2,'#ffffff');}
    else{const c=s.refl?'#fff2a8':s.k=='feather'?'#4a4662':s.k=='ring'?'#f0c070':s.k=='spark'?((frame>>1)&1?'#f8e060':'#f08020'):'#e83048';R(x-3,y-2,6,4,'#1a1423');R(x-2,y-3,4,6,'#1a1423');R(x-2,y-2,4,4,c);R(x-1,y-1,2,2,'#ffffff');}}
  if(hook)drawHook();
  if(fish)drawBobber();
  if(cur.ow)drawWeatherGround();
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
  KEYS4.forEach((k,i)=>{const x=146+i*13;if(st.got[k])g.drawImage(KSIC[k],x,3);else{R(x,3,12,12,'#080a18');R(x+1,4,10,10,'#2c3460');}});
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
  pg.forEach((l,i)=>{const sh=l.slice(0,Math.max(0,left));left-=l.length;if(sh)text(sh,x0+10,top+10+i*12,'#ffffff',8,'left','#080c28');});
  if(dlg.choices&&dlg.i==dlg.pages.length-1&&left>=0){const k=dlg.choices.length,ph=k*13+10,py=top>HUD+20?top-ph-4:top+h+4;panel(x0,py,w,ph);
    dlg.choices.forEach((c,i)=>{if(i==dlg.sel)R(x0+6,py+5+i*13,w-12,12,'#2c3a8a');text((i==dlg.sel?'> ':'  ')+c,x0+10,py+7+i*13,'#ffffff',8,'left','#080c28');});return;}
  if(left>=0&&(frame>>4)&1){R(W-20,top+h-11,7,1,'#fff2a8');R(W-19,top+h-10,5,1,'#fff2a8');R(W-18,top+h-9,3,1,'#fff2a8');R(W-17,top+h-8,1,1,'#fff2a8');}
}
function drawBanner(){const w=banner.length*8+20,x=(W-w)/2|0,y=HUD+6;const a=Math.min(1,bannerT/20);g.globalAlpha=a*.85;R(x,y,w,16,'#080a18');g.globalAlpha=a;R(x,y+15,w,1,'#f2c14e');g.globalAlpha=1;
  if(a>.3)text(banner,W/2,y+4,'#fff2a8',8,'center','#1a1423');}
function drawToast(){const w=Math.min(W-8,toastMsg.length*8+16),x=(W-w)/2|0,y=FH-22;R(x,y,w,16,'rgba(8,10,24,.9)');R(x,y,w,1,'#f2c14e');text(toastMsg,W/2,y+4,'#ffffff',8,'center');}
const TABS=['ITEMS','GEAR','JOURNAL','CARDS','MAP'];
const SHORT={'ow:0,0':["SCOTT'S",'ADDITION'],'ow:1,0':['BROAD','STREET'],'ow:2,0':['JACKSON','WARD'],'ow:3,0':['CHURCH','HILL'],'ow:0,1':['CARYTOWN',''],'ow:1,1':['THE FAN',''],'ow:2,1':['CAPITOL','SQUARE'],'ow:3,1':['SHOCKOE','BOTTOM'],'ow:0,2':['BYRD PARK','MAYMONT'],'ow:1,2':['HOLLYWOOD','CEMETERY'],'ow:2,2':['BELLE','ISLE'],'ow:3,2':['ROCKETTS','LANDING'],'ow:1,3':['FOREST','HILL'],'ow:2,3':['MANCHESTER','']};
const OWKEY={'ow:2,2':'granite','ow:1,2':'iron','ow:3,1':'brick','ow:0,2':'bronze'};
function drawMenu(){
  const m=menu;
  const gr=g.createLinearGradient(0,0,0,FH);gr.addColorStop(0,'#141e56');gr.addColorStop(1,'#070a22');g.fillStyle=gr;g.fillRect(0,0,W,FH);
  R(2,2,W-4,1,'#f4f4f8');R(2,FH-3,W-4,1,'#f4f4f8');R(2,2,1,FH-4,'#f4f4f8');R(W-3,2,1,FH-4,'#f4f4f8');
  let tx=6;TABS.forEach((t,i)=>{const w=t.length*8+6;R(tx,6,w,13,i==m.tab?'#f2c14e':'#26306a');text(t,tx+3,9,i==m.tab?'#1a1423':'#aeb7c2');tx+=w+4;});
  R(6,21,W-12,1,'#4a58a8');
  if(m.rd){panel(8,26,W-16,150);text(m.rd.t,W/2,34,'#fff2a8',8,'center','#080c28');
    m.rd.pages[m.rd.pg].forEach((l,i)=>text(l,16,52+i*12,'#ffffff',8,'left','#080c28'));
    text((m.rd.pg+1)+'/'+m.rd.pages.length+'  A: '+(m.rd.pg+1<m.rd.pages.length?'next':'close'),W/2,FH-16,'#aeb7c2',8,'center');return;}
  if(m.tab==0){
    ITEMS.forEach((it,i)=>{const x=22+(i%4)*56,y=28+(i/4|0)*42,own=st.items[it.id],sel=i==m.cur;
      R(x,y,40,34,sel?((frame>>4)&1?'#fff2a8':'#f2c14e'):'#080a18');R(x+2,y+2,36,30,'#1c2660');R(x+2,y+2,36,1,'#3a4a98');
      if(own){const ic=it.id=='bottle'&&!st.bottle?IC.bottleE:it.ic;g.drawImage(ic,0,0,12,12,x+8,y+5,24,24);
        if(it.ammo)mtext(st.ammo[it.ammo],x+36-String(st.ammo[it.ammo]).length*4,y+26,'#ffffff');
        if(st.eq==it.id){R(x+2,y+2,9,9,'#f2c14e');mtext('B',x+5,y+4,'#1a1423',false);}}
      else text('?',x+20,y+13,'#3a4a98',8,'center');});
    const it=ITEMS[m.cur],own=st.items[it.id];panel(8,114,W-16,62);
    text(own?it.name:'???',16,122,'#fff2a8',8,'left','#080c28');
    (own?wrap(it.desc,28):['You haven\'t found this yet.']).forEach((l,i)=>text(l,16,136+i*11,'#ffffff',8,'left','#080c28'));
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
    rows.forEach(([ic,a,b],i)=>{const y=25+i*19;R(10,y,20,18,'#080a18');R(11,y+1,18,16,'#1c2660');
      if(ic)g.drawImage(ic,14+(12-ic.width)/2|0,y+3+(12-ic.height)/2|0);
      if(i==2)KEYS4.forEach((k,j)=>{const x=150+j*16;if(st.got[k])g.drawImage(KSIC[k],x,y+3);else{R(x,y+3,12,12,'#080a18');R(x+1,y+4,10,10,'#2c3460');}});
      text(a,36,y+1,'#fff2a8',8,'left','#080c28');if(b)text(b,36,y+10,'#aeb7c2',8,'left','#080c28');});
    text('B: next tab   MENU: close',W/2,FH-16,'#aeb7c2',8,'center');
  }else if(m.tab==2){
    text('Stories found '+nLore()+'/'+LORE.length,W/2,26,'#fff2a8',8,'center','#080c28');
    for(let i=0;i<11;i++){const j=m.jt+i;if(j>=LORE.length)break;const [id,t]=LORE[j],y=40+i*12,sel=j==m.jc,got=st.lore[id];
      if(sel)R(8,y-2,W-16,12,'#2c3a8a');text((sel?'> ':'  ')+(got?t:'- - - - - -'),12,y,got?'#ffffff':'#5a6496',8,'left','#080c28');}
    text('A: read   B: next tab',W/2,FH-16,'#aeb7c2',8,'center');
  }else if(m.tab==3){
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
      for(const id in SHORT){const s=SC[id],x=9+s.ax*60,y=25+s.ay*38,here=id==curId,v=st.vis[id];
        R(x,y,58,36,here&&(frame>>4)&1?'#fff2a8':'#080a18');R(x+1,y+1,56,34,v?(s.ay>=2&&s.ay<3?'#2f5f96':s.ay==3?'#5a6a3a':'#3a6a48'):'#1e2446');
        if(v){const [a,b]=SHORT[id];text(a,x+29,y+4,'#ffffff',6,'center','#080c28');if(b)text(b,x+29,y+12,'#ffffff',6,'center','#080c28');}
        else text('?',x+29,y+12,'#4a5486',8,'center');
        const rs=Object.values(s.reads).concat(Object.values(s.readsT||{})).filter(r=>r[0]!='!'),u=[...new Set(rs)];
        if(v&&u.length){const n=u.filter(r=>st.lore[r]).length;g.drawImage(IC.journal,x+2,y+22);mtext(n+'/'+u.length,x+15,y+27,n==u.length?'#fff2a8':'#ffffff');}
        {const cn=(s.npcs||[]).find(n=>n.chal);if(cn&&v){if(st.pins[cn.chal])g.drawImage(IC.pin,x+30,y+22);else{R(x+33,y+24,6,6,'#080a18');R(x+34,y+25,4,4,'#2c3460');}}}
        if(OWKEY[id]){const k=OWKEY[id];if(st.got[k])g.drawImage(KSIC[k],x+43,y+22);else if(v){R(x+43,y+22,12,12,'#080a18');R(x+44,y+23,10,10,'#2c3460');}}
        if(here)R(x+50,y+3,4,4,'#e83048');}
    }else{
      text(AREAN[cur.area]||cur.name,W/2,28,'#fff2a8',8,'center','#080c28');
      const b=AREAB[cur.area],cols=b.x1-b.x0+1,rows=b.y1-b.y0+1,cw=46,ch=32,x0=(W-cols*(cw+4))/2|0,y0=44;
      for(const id in SC){const s=SC[id];if(s.area!=cur.area)continue;const x=x0+(s.ax-b.x0)*(cw+4),y=y0+(s.ay-b.y0)*(ch+4),here=id==curId,v=st.vis[id];
        R(x,y,cw,ch,here&&(frame>>4)&1?'#fff2a8':'#080a18');R(x+1,y+1,cw-2,ch-2,v?'#4a3a6a':'#1e2446');
        if(s.bossT&&v){if(st.f['boss:'+id])g.drawImage(KSIC[s.reward]||IC.key,x+cw/2-6,y+10);else{R(x+cw/2-4,y+10,8,8,'#e8e4dc');R(x+cw/2-3,y+12,2,2,'#1a1423');R(x+cw/2+1,y+12,2,2,'#1a1423');}}
        if(s.entry&&v)mtext('E',x+3,y+3,'#ffffff');}
      text('Keys here: '+(st.keys[cur.area]||0),W/2,172,'#ffffff',8,'center');
    }
    text('B: next tab   MENU: close',W/2,FH-16,'#aeb7c2',8,'center');
  }
}
MF.E='111100111100111';
function drawShop(){
  const x0=14,y0=HUD+14,w=W-28,h=140;panel(x0,y0,w,h);
  text('CARYTOWN GOODS',x0+10,y0+9,'#fff2a8',8,'left','#080c28');D(COIN[0].r,x0+w-40,y0+8);mtext(st.coins,x0+w-28,y0+10,'#fff2a8');
  SHOP.forEach((it,i)=>{const y=y0+24+i*13,sel=i==shop.cur,why=it.why();if(sel)R(x0+6,y-3,w-12,13,'#2c3a8a');
    text((sel?'> ':'  ')+it.name,x0+8,y,why?'#7a84b6':'#ffffff',8,'left','#080c28');text(why||String(it.price),x0+w-10,y,why?'#7a84b6':'#fff2a8',8,'right','#080c28');});
  text(shop.msg,x0+w/2,y0+114,'#aeb7c2',8,'center');text('A: buy   B: leave',x0+w/2,y0+127,'#ffffff',8,'center');
}
const SKY=['#0c1030','#141a44','#22245a','#3a2a66','#6a3a6e','#a8505e','#e08a58'];
function drawTitleBg(){
  SKY.forEach((c,i)=>{R(0,i*21,W,21,c);if(i)for(let x=0;x<W;x+=2){R(x,i*21,1,1,SKY[i-1]);R(x+1,i*21-1,1,1,c);}});
  for(let i=0;i<40;i++){const q=HH(i,3,9);if(((frame>>4)+i)%7)R(q%W,(q>>8)%70,1,1,i%5?'#c8d0f0':'#ffffff');}
  R(196,22,14,14,'#fff2c8');R(194,25,18,8,'#fff2c8');R(198,20,10,18,'#fff2c8');R(200,26,3,3,'#e8d8a0');R(205,31,2,2,'#e8d8a0');
  for(let i=0;i<W;i+=13){const q=HH(i,5,2),h=22+q%34,w=9+(q>>6)%5;R(i,150-h,w,h,'#141226');R(i,150-h,1,h,'#24203c');
    for(let y=150-h+4;y<146;y+=6)for(let x=i+2;x<i+w-2;x+=3)if(HH(x,y,4)%3==0)R(x,y,2,3,HH(x,y,(frame>>6))%9?'#f8d868':'#a88030');}
  R(100,96,40,54,'#141226');R(104,90,32,6,'#141226');R(112,84,16,6,'#141226');for(let x=104;x<136;x+=6)R(x,100,2,30,'#2c2848');
  R(0,134,W,5,'#0c0a18');R(0,133,W,1,'#3a3458');
  for(let i=-8;i<W;i+=34){R(i,139,7,16,'#0c0a18');for(let k=0;k<5;k++){R(i+7+k,139,1,5-k,'#0c0a18');R(i+33-k,139,1,5-k,'#0c0a18');}}
  ['#3a2a66','#2a2660','#1c2250','#141a44'].forEach((c,i)=>R(0,150+i*13,W,13,c));
  for(let i=0;i<26;i++){const q=HH(i,8,1),y=152+(q>>8)%46;R(((q%W)+((frame>>2)*(i&1?1:-1))+W*4)%W,y,6+(q>>4)%10,1,i%4?'#6a5a9a':'#f0a878');}
  drawFog(.2);
}
function draw(){
  g=buf.getContext('2d');
  if(mode=='title'||mode=='win'){
    drawTitleBg();
    if(mode=='title'){
      text('RIVER CITY',W/2+2,26,'#6a1c2c',16,'center');text('RIVER CITY',W/2,24,'#f2c14e',16,'center');
      text('QUEST',W/2+2,48,'#6a1c2c',16,'center');text('QUEST',W/2,46,'#fff2a8',16,'center');
      text('The Tunnel Under Church Hill',W/2,70,'#e8ecf8',8,'center','#1a1423');
      const opts=titleOpts(),top=tl.lv==4?80:88,sp=tl.lv==4?11:13;
      opts.forEach((o,i)=>{const y=top+i*sp,sel=i==titleSel;if(sel){R(18,y-3,W-36,sp-1,'rgba(8,10,24,.78)');}text((sel?'> ':'  ')+o+(sel?' <':'  '),W/2,y,sel?'#ffffff':'#aeb7c2',8,'center','#1a1423');});
      const hint=capture?'Press a key for '+ACTN[capture]+'...':tl.lv==2?'Slot '+saveSlot+' will be erased.':tl.lv==4?'Arrows and Enter always work. Gamepads too.':tl.lv?'B: back':'Gamepad: A, X/B, Start';
      text(hint,W/2,FH-14,capture||tl.lv==2?'#f0a878':'#aeb7c2',8,'center','#1a1423');
    }else{
      text('THE FOG LIFTS',W/2+2,30,'#6a1c2c',16,'center');text('THE FOG LIFTS',W/2,28,'#f2c14e',16,'center');
      text('Richmond is safe.',W/2,58,'#ffffff',8,'center','#1a1423');
      text('Stories '+nLore()+'/'+LORE.length+'   Hearts '+p.max/2,W/2,76,'#e8ecf8',8,'center','#1a1423');
      text('Coins '+st.coins+'   Foes '+st.kills+'   Cards '+nCards()+'/'+CARDS.length,W/2,90,'#e8ecf8',8,'center','#1a1423');
      text('Time '+fmtTime(st.time),W/2,102,'#fff2a8',8,'center','#1a1423');
      if(winT>60&&(frame>>5)&1)text('PRESS A',W/2,120,'#ffffff',8,'center','#1a1423');
    }
  }else if(menu){drawMenu();}
  else{
    const sx=shake?rnd(3)-1:0,sy=shake?rnd(3)-1:0;
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
    if(b){R(77,5,102,7,'#1a1423');R(78,6,100,5,'#3a1c30');R(78,6,Math.round(100*b.hp/HPS[b.type]),5,'#e83048');R(78,6,Math.round(100*b.hp/HPS[b.type]),1,'#f890a0');}
    if(hurtT>0){g.globalAlpha=hurtT/12*.35;R(0,0,W,PH,'#e83048');g.globalAlpha=1;}
    if(fade>0){g.globalAlpha=fade/10;R(0,0,W,PH,'#000');g.globalAlpha=1;}
    g.restore();
    drawHUD();
    if(fish&&!dlg)drawFishUI();
    if(OPT.timer&&!dlg)text(fmtTime(st.time),W-3,FH-11,'#ffffff',8,'right','#1a1423');
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
const sndBtn=document.getElementById('snd');
function setSound(on){musicOn=on;try{localStorage.setItem('rcq-sound',on?'1':'0');}catch(e){}if(sndBtn){sndBtn.innerHTML='<span class="lg">SOUND </span>'+(on?'ON':'OFF');sndBtn.setAttribute('aria-label',on?'Sound on':'Sound off');sndBtn.setAttribute('aria-pressed',on?'true':'false');}
  if(typeof musicVolume=='function')musicVolume(on);}
try{musicOn=localStorage.getItem('rcq-sound')!=='0';}catch(e){}
if(sndBtn){sndBtn.addEventListener('click',()=>{wake();setSound(!musicOn);});setSound(musicOn);}
addEventListener('keydown',e=>{if((e.key=='n'||e.key=='N')&&!capture&&!actionOf(e.key))setSound(!musicOn);});
/* install to home screen */
let installEvt=null;const instBtn=document.getElementById('install');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(instBtn)instBtn.hidden=false;});
if(instBtn)instBtn.addEventListener('click',async()=>{if(!installEvt)return;installEvt.prompt();try{await installEvt.userChoice;}catch(e){}installEvt=null;instBtn.hidden=true;});
if('serviceWorker' in navigator&&location.protocol=='https:'&&location.hostname.endsWith('github.io'))navigator.serviceWorker.register('sw.js').catch(()=>{});

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
function dark(){const h=hour();return h>=20||h<5?1:h>=17?(h-17)/3:h<7?(7-h)/2:0;}
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
    if(--st.wxT<=0){st.wxT=3000+rnd(4200);const r=Math.random(),n=r<.45?'clear':r<.72?'rain':r<.87?'fog':'snow';if(n!=st.wx)st.wxNext=n;}}
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
  const wins=cur.wins?Object.values(cur.wins):[];
  if(dk>.2){g.save();g.translate(-cam.x,-cam.y);g.globalAlpha=Math.min(1,dk*1.3);
    for(const [x,y,on] of wins)if(on&&x>cam.x-16&&x<cam.x+W&&y>cam.y-16&&y<cam.y+PH){R(x+4,y+5,8,7,'#f8d868');R(x+7,y+5,2,7,'#d8a838');R(x+4,y+8,8,1,'#d8a838');R(x+4,y+5,3,1,'#fff6c0');}
    g.globalAlpha=1;g.restore();}
  lg.globalCompositeOperation='source-over';lg.clearRect(0,0,W,PH);lg.fillStyle='rgba(10,14,46,'+(.7*dk).toFixed(3)+')';lg.fillRect(0,0,W,PH);
  lg.globalCompositeOperation='destination-out';
  const hole=holeAt;
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
  {id:'sturgeon',name:'Atlantic sturgeon',str:2.6,coins:30,w:()=>riverHere()?(dark()>.5?.9:.45):0,txt:'An ancient, armored giant. Spotting one in the James is a big deal.'}];
const riverHere=()=>(cur.ow&&cur.ay==2&&cur.ax>=1)||cur.area=='boathouse';
function pickFish(){const ws=FISH.map(f=>f.w()),t=ws.reduce((a,b)=>a+b,0);let r=Math.random()*t;for(let i=0;i<FISH.length;i++){r-=ws[i];if(r<=0)return FISH[i];}return FISH[0];}
function fishEnd(m){fish=null;toast(m);sfx(150,.1);}
function fishUpdate(){
  const f=fish;f.t--;
  if(press.b){fish=null;toast('You reel in your line.');return;}
  if(f.ph=='wait'){if(press.a){fishEnd('Too early! Nothing on the hook.');return;}if(f.t<=0){f.ph='bite';f.t=28;sfx(1300,.06);sfx(1700,.08);}}
  else if(f.ph=='bite'){if(press.a){f.ph='reel';f.sp=pickFish();f.dist=40;f.ten=18;f.run=0;sfx(900,.05);}else if(f.t<=0)fishEnd('It stole the bait and swam off.');}
  else{const S=f.sp;
    if(f.run>0)f.run--;else if(Math.random()<.012*S.str)f.run=35+rnd(40);
    f.dist+=(f.run?.13:.05)*S.str;f.ten=Math.max(0,f.ten-(f.run?.2:.75));
    if(press.a){f.dist-=3.2;f.ten+=f.run?15:8;sfx(400+Math.round(f.ten)*6,.03,'square',.02);}
    if(f.ten>=100){fishEnd('Snap! The line broke.');return;}
    if(f.dist>=72){fishEnd('It got away.');return;}
    if(f.dist<=0){fish=null;st.fish[S.id]=(st.fish[S.id]||0)+1;st.coins=Math.min(999,st.coins+S.coins);p.hold={ic:IC.fish,t:90};tune(JING);needSave=true;
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
  text('Tap A to reel',x0+8,y0+5,'#fff2a8',8,'left','#080c28');if(f.run&&(frame>>3)&1)text('RUNNING!',x0+w-8,y0+5,'#f890a0',8,'right','#080c28');
  R(x0+8,y0+17,w-44,6,'#080a18');R(x0+9,y0+18,Math.round((w-46)*Math.max(0,1-f.dist/72)),4,'#3ac2e8');
  R(x0+8,y0+27,w-44,6,'#080a18');const tc=f.ten>75?'#e83048':f.ten>50?'#f2c14e':'#58a848';R(x0+9,y0+28,Math.round((w-46)*Math.min(1,f.ten/100)),4,tc);
  text('FISH',x0+w-10,y0+17,'#ffffff',6,'right','#080c28');text('LINE',x0+w-10,y0+27,'#ffffff',6,'right','#080c28');
}

/* ---------- options, slots, controls, gamepad ---------- */
const OPT={timer:false};try{OPT.timer=localStorage.getItem('rcq-timer')=='1';}catch(e){}
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

/* ---------- loop ---------- */
titleInit();
let last=0,acc=0,paused=false;
function loop(t){
  if(!paused){acc+=Math.min(100,t-last);while(acc>=16.6){update();acc-=16.6;}draw();if(mode=='play'&&!trans)pump(4);}
  last=t;requestAnimationFrame(loop);
}
if(document.fonts&&document.fonts.load)document.fonts.load('8px "Press Start 2P"').catch(()=>{});
requestAnimationFrame(t=>{last=t;loop(t);});
window.__g={SC,LORE,CHAL,update,draw,keys,press,load,mk,say,give,newGame,refresh,explode,irisStart,kill,updCam,pump,CVC,get jobs(){return jobs},CARDS,FISH,actionOf,titleOpts,hour,dark,fmtTime,get hook(){return hook},get fish(){return fish},set fish(v){fish=v},get tl(){return tl},get titleSel(){return titleSel},set titleSel(v){titleSel=v},get slot(){return saveSlot},OPT,
  get p(){return p},get st(){return st},get mode(){return mode},set mode(v){mode=v},get enemies(){return enemies},get dlg(){return dlg},set dlg(v){dlg=v},
  get cur(){return cur},get cam(){return cam},get blocks(){return blocks},get trans(){return trans},get menu(){return menu},set menu(v){menu=v},get shop(){return shop},set shop(v){shop=v},get picks(){return picks},get bug(){return bug},pause(v){paused=v},SOLID};
