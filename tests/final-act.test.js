// The bigger finale, bus travel, the quest log, secrets, mini-games and seasons.
const G=require('./harness.js'),SC=G.SC,T=16;
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const closeDlg=()=>{let k=0;while(G.dlg&&k++<99){if(G.dlg.choices){G.dlg.i=G.dlg.pages.length-1;G.dlg.n=999;}G.press.a=1;G.update();}};
const run=n=>{for(let i=0;i<n;i++){G.update();closeDlg();}};
G.newGame();closeDlg();run(3);
// bus travel
G.st.vis['ow:2,2']=1;ok(G.busTo('ow:2,2'),'bus leaves for a visited neighborhood');run(30);ok(G.cur.id=='ow:2,2','bus arrives at Belle Isle');
const [ax,ay]=G.arrivalFor('ow:1,0');const t=SC['ow:1,0'].g[Math.floor(ay/T)][Math.floor(ax/T)];ok(!G.SOLID.includes(t)&&t!='D','bus stop lands on open ground');
ok(!G.busTo('ow:4,0'),'no bus to places you have not been');
G.load('quarry:0,1');ok(!G.busTo('ow:2,1'),'no bus from inside a dungeon');G.load('ow:2,1');
ok(G.goalScene()=='ow:2,1','goal marker starts on Capitol Square');
// quest log
const Q=G.quests();ok(Q.length>=12&&Q.every(q=>q.length==3),'quest log lists '+Q.length+' quests');
// secrets
const ns=Object.keys(G.SECRETS).length;ok(ns>=17,'a hidden stash in '+ns+' neighborhoods');
G.load('ow:2,1');const sp=G.picks.find(k=>k.kind=='secret');ok(!!sp,'the Capitol Square stash is out there');
const c0=G.st.coins;G.p.x=sp.x;G.p.y=sp.y;run(2);ok(G.st.coins==c0+25&&G.nSecrets()==1,'finding it pays 25 coins');
G.load('ow:2,1');ok(!G.picks.some(k=>k.kind=='secret'),'a found stash stays found');
// mini-games: batting with perfect timing
G.st.pins.flies=1;G.startMini('bat');let guard=0;
while(G.mode=='mini'&&guard++<6000){const b=G.mini&&G.mini.ball;if(b&&!b.res&&b.age==b.arr)G.press.a=1;G.update();}
closeDlg();ok(G.mode=='play'&&G.st.f.slugger,'perfect swings hit home runs in batting practice');
// pinball: never flip, three balls drain
const pc=G.st.coins;G.startMini('pin');guard=0;while(G.mode=='mini'&&guard++<20000)G.update();closeDlg();ok(G.mode=='play'&&G.st.mini.pin>=0,'pinball ends after three balls');
// pinball physics: flipper sends a ball up
G.startMini('pin');G.mini.launch=99999;G.mini.ball={x:112,y:170,vx:0,vy:1};G.keys.b=1;for(let i=0;i<6;i++)G.update();G.keys.b=0;ok(G.mini.ball&&G.mini.ball.vy<0,'the left flipper knocks the ball upward');G.press.menu=1;G.update();closeDlg();
// derby: drive straight down the middle lane to the finish
G.startMini('derby');guard=0;while(G.mode=='mini'&&guard++<9000){const m=G.mini;if(m){const o=m.obs.find(o=>!o.hit&&o.y-m.y>100&&o.y-m.y<170&&Math.abs(o.x-m.x)<22);G.keys.left=o&&o.x>=m.x?1:0;G.keys.right=o&&o.x<m.x?1:0;}G.update();}
G.keys.left=G.keys.right=0;closeDlg();ok(G.mode=='play'&&G.st.mini.derby>0,'the soapbox derby reaches the finish ('+G.fmtTime(G.st.mini.derby)+')');
// final boss phases
G.load('tunnel:0,0');G.p.x=8*T+8;G.p.y=8*T+8;G.updCam();closeDlg();const v=G.enemies.find(e=>e.type=='vampire');ok(!!v,'the final boss waits by Engine 231');
G.p.inv=1e9;v.hp=Math.floor(v.mhp*.6);run(3);ok(v.swarm&&G.enemies.filter(e=>e.type=='bat').length>=3,'phase two: it splits into bats');
for(const b of G.enemies.filter(e=>e.type=='bat'))G.kill(b);G.enemies.splice(0,G.enemies.length,v);run(12);ok(!v.swarm&&!v.gone||v.t<5,'beating the bats brings it back');
v.hp=Math.floor(v.mhp*.3);v.swarm=0;run(3);ok(v.p3,'phase three: it gets desperate');
G.kill(v);G.enemies.length=0;closeDlg();ok(G.mode=='relight','beating it starts the relighting');
let lamps=0;for(let i=0;i<3000&&G.mode=='relight';i++){G.update();if(G.relight&&G.cur.lamps&&G.cur.lamps.length&&G.relight.t>150)lamps=1;}
ok(lamps&&G.mode=='win','the lamps relight across five neighborhoods, then the ending');
// seasons
G.mode='play';G.setDate(new Date(2026,11,10));ok(G.season()=='winter'&&G.events().includes('lights'),'December brings holiday lights');
G.setDate(new Date(2026,3,5));ok(G.season()=='spring'&&G.events().includes('10k'),'early April is 10K season');
G.load('ow:1,1');ok(true,'loading the Fan in 10K season works');for(let i=0;i<5;i++){G.update();G.draw();}
G.setDate(new Date(2026,9,10));ok(G.events().includes('folk'),'October brings the Folk Festival');G.load('ow:2,2');for(let i=0;i<50;i++){G.update();G.draw();}
G.setDate(new Date(2026,11,10));G.st.clock=36000*16/24;G.load('ow:1,1');let er=0;try{for(let i=0;i<5;i++){G.update();G.draw();}}catch(e){er=e;console.log(e.stack)}ok(!er,'holiday lights draw at night');
G.setDate(null);
// menu tabs
G.st.clock=4500;G.load('ow:2,1');G.dlg=null;G.press.menu=1;G.update();const tabs=new Set();for(let i=0;i<7;i++){tabs.add(G.menu.tab);G.draw();G.press.b=1;G.update();}ok(tabs.size==7,'menu has seven tabs incl. quests');G.press.menu=1;G.update();
