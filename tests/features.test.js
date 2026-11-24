const G=require('./harness.js'),SC=G.SC;const T=16;
const run=n=>{for(let i=0;i<n;i++){G.update();let k=0;while(G.dlg&&k++<50){G.press.a=1;G.update();}}};
const at=(tx,ty,dir)=>{G.p.x=tx*T+8;G.p.y=ty*T+8;G.p.dir=dir;G.p.atk=0;G.p.spin=0;G.p.charging=false;G.p.kt=0;G.p.dash=0;};
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
G.newGame();run(3);
// tredegar door
G.load('ow:1,2');const d=G.cur.doors.find(q=>q.to=='tredegar:0,2');ok(!!d,'Hollywood Cemetery has a Tredegar door');
at(d.ret[0],d.ret[1],2);G.keys.up=1;run(12);G.keys.up=0;run(40);ok(G.cur.id=='tredegar:0,2','walking in reaches the Foundry Gate');
// pattern shop: clear -> hook chest appears
G.load('tredegar:1,2');for(const e of G.enemies.slice())G.kill(e);G.enemies.length=0;run(20);
ok(G.cur.g[3][4]=='c','clearing the Pattern Shop reveals the hook chest');
at(4,4,2);G.press.a=1;run(3);ok(G.st.items.hook&&G.st.eq=='hook','chest gives the grappling hook');
// hook across the pit to the island
at(12,6,2);G.press.b=1;run(1);ok(!!G.hook,'hook fires');run(40);ok(Math.floor(G.p.y/T)==3&&Math.floor(G.p.x/T)==12&&!G.hook,'hook pulls you across the pit onto the island');
at(11,3,2);G.press.a=1;run(3);ok(G.st.keys.tredegar==1,'island chest holds the small key');
at(12,3,0);G.press.b=1;run(45);ok(Math.floor(G.p.y/T)==6,'hook back to the mainland');
// hook stops on a wall
at(4,6,1);G.press.b=1;run(30);ok(Math.floor(G.p.x/T)==4&&!G.hook,'hook bounces off a plain wall');
// casting floor chasm
G.load('tredegar:0,1');at(7,7,2);G.press.b=1;run(40);ok(Math.floor(G.p.y/T)==3,'hook crosses the casting floor chasm');
// boss
G.load('tredegar:0,0');const b=G.enemies.find(e=>e.type=='foreman');ok(!!b,'Iron Foreman appears');
const hp0=b.hp;b.x=G.p.x=128;b.y=60;at(8,6,2);b.x=136;b.y=72;G.p.inv=999;G.press.a=1;run(10);ok(b.hp==hp0,'paddle clanks off the armor');
at(8,7,2);b.x=136;b.y=60;b.t=1;G.st.eq='hook';G.press.b=1;run(25);ok(b.state=='stun','hook rips the chest plate and stuns it');
let guard=0;while(G.enemies.includes(b)&&guard++<40){b.state='stun';b.st=100;b.flash=0;b.x=136;b.y=86;at(8,6,2);G.p.inv=999;G.press.a=1;run(8);}
ok(!G.enemies.includes(b),'stunned foreman can be beaten');ok(G.st.cards.tredegar,'boss gives the Tredegar card');
ok(!G.picks.some(k=>k.kind=='keystone')&&G.picks.some(k=>k.kind=='container'),'boss leaves a heart charm, no keystone');
// night
G.st.clock=36000*(15/24);ok(G.dark()==1,'clock at 9pm is dark');G.load('ow:1,1');ok(G.enemies.filter(e=>e.night).length>=1,'night brings extra foes');
G.st.clock=4500;ok(G.dark()==0,'morning is light');
// weather + frogs
G.load('ow:0,2');G.st.wx='rain';G.st.wxk=1;G.st.wxT=99999;G.p.hp=99;G.p.max=99;at(16,9,0);for(let i=0;i<400;i++){G.update();G.enemies.length=0;}
const fr=G.picks.filter(k=>k.kind=='frog');ok(fr.length>0,'frogs come out in the rain ('+fr.length+')');
const f0=G.st.frogs;const k=fr[0];G.p.x=k.x;G.p.y=k.y;run(1);ok(G.st.frogs==f0+1,'walking into a frog catches it');
G.st.frogs=5;const nat=G.cur.npcs.find(n=>n.talk=='naturalist');at(nat.tx,nat.ty+1,2);nat.x=nat.tx*T+8;nat.y=nat.ty*T+8;G.press.a=1;run(3);
ok(G.st.f.frogsDone&&G.st.cards.maymont,'naturalist rewards five frogs with the Maymont card');
// weather changes over time
G.st.wx='clear';G.st.wxT=1;G.st.wxNext=null;let seen=new Set();for(let i=0;i<20;i++){G.st.wxT=1;for(let j=0;j<400;j++)G.update();seen.add(G.st.wx);}ok(seen.size>=2,'weather changes ('+[...seen].join(',')+')');
// fishing
G.load('ow:2,2');G.enemies.length=0;G.st.items.rod=1;G.st.eq='rod';
let spot=null;for(let y=1;y<G.cur.h-1&&!spot;y++)for(let x=1;x<G.cur.w-1;x++)if(G.cur.g[y][x]=='.'&&G.cur.g[y-1][x]=='w'){spot=[x,y];break;}
at(spot[0],spot[1],2);G.press.b=1;G.update();ok(G.fish&&G.fish.ph=='wait','casting into water starts fishing');
G.fish.t=1;G.update();ok(G.fish.ph=='bite','a fish bites');G.press.a=1;G.update();ok(G.fish.ph=='reel','pressing A hooks it');
const c0=G.st.coins;for(let i=0;i<400&&G.fish;i++){if(i%4==0)G.press.a=1;if(G.fish)G.fish.ten=0;G.update();}
run(1);ok(!G.fish&&Object.values(G.st.fish).reduce((a,b)=>a+b,0)>=1&&G.st.coins>c0,'reeling lands a fish for coins');
G.press.b=1;at(spot[0],spot[1]+2,2);G.update();ok(!G.fish||G.cur.g[spot[1]+1][spot[0]]=='w','no cast without water ahead');G.fish=null;
// cards from the shop
G.st.coins=500;const n0=Object.keys(G.st.cards).length;G.load('shop:0,0');
for(const n of G.cur.npcs)if(n.talk=='shop'){at(n.tx,n.ty+1,2);n.x=n.tx*T+8;n.y=n.ty*T+8;}
G.press.a=1;for(let i=0;i<8&&!G.shop;i++){G.update();if(G.dlg)G.press.a=1;}
if(G.shop){G.shop.cur=G.SHOPLIST.findIndex(i=>i.name=='Landmark Card Pack');G.press.a=1;G.update();}ok(Object.keys(G.st.cards).length==n0+1,'card pack adds a new card');
G.shop=null;
// menu tabs
G.load('ow:2,1');G.dlg=null;G.press.menu=1;G.update();const seenT=new Set();for(let i=0;i<5;i++){seenT.add(G.menu.tab);G.press.b=1;G.update();G.draw();}ok(seenT.size==5,'menu has five tabs incl. cards');G.press.menu=1;G.update();
// controls
ok(G.actionOf('ArrowUp')=='up'&&G.actionOf('z')=='a'&&G.actionOf('Z')=='a'&&G.actionOf('Enter')=='menu','default key bindings');
ok(G.fmtTime(60*75)=='1:15.0','timer format');
// title slots
G.mode='title';G.titleSel=0;const o=G.titleOpts();ok(o.length==5&&o[3]=='IMPORT SAVE CODE'&&o[4]=='OPTIONS','title lists three save slots, import and options');
// draw everything once at night in snow
G.mode='play';G.st.clock=36000*(16/24);G.st.wx='snow';G.st.wxk=1;G.st.snow=1;G.load('ow:1,0');let er=0;try{for(let i=0;i<5;i++){G.update();G.draw();}}catch(e){er=e;console.log(e.stack)}ok(!er,'night snow renders');
// background map painting + cache
G.mode='play';G.load('ow:2,1');G.pump(5000);ok(G.cur.cv.every(c=>c)&&G.jobs.length==0,'background jobs paint all animation frames and prefetch neighbors');
ok(G.CVC.has('ow:3,1')&&G.CVC.get('ow:3,1').cv.every(c=>c),'neighbor maps are prefetched');
const cv0=G.CVC.get('ow:3,1').cv[0];G.load('ow:3,1');ok(G.cur.cv[0]===cv0,'entering a prefetched map reuses its canvas');
G.load('tredegar:1,2');G.pump(5000);const before=G.cur.cv[0];delete G.st.f['c:t2'];G.refresh();ok(G.cur.cv[0]!==before,'a changed room is repainted, not served stale');
