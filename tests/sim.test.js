const G=require('./harness.js'),SC=G.SC;const T=16;
const run=n=>{for(let i=0;i<n;i++){G.update();let k=0;while(G.dlg&&k++<50){G.press.a=1;G.update();}}};
const at=(tx,ty,dir)=>{G.p.x=tx*T+8;G.p.y=ty*T+8;G.p.dir=dir;G.p.atk=0;G.p.spin=0;G.p.charging=false;G.p.kt=0;G.p.dash=0;};
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
// --- random sim across every scene
G.newGame();G.dlg=null;let errs=0;const ids=Object.keys(SC);
for(let r=0;r<ids.length*2;r++){const id=ids[r%ids.length];G.load(id);G.p.x=G.cur.w*8;G.p.y=G.cur.h*8;G.p.hp=99;G.p.max=99;
  Object.assign(G.st.items,{lantern:1,balls:1,powder:1,bug:1,shoes:1,bottle:1,hook:1,rod:1,kayak:r%2});G.st.clock=r*4100;G.st.wx=['clear','rain','snow','fog'][r%4];G.st.wxk=1;G.st.snow=r%4==2?1:0;G.st.ammo.balls=30;G.st.ammo.powder=10;G.st.shield=1;
  for(let i=0;i<1500;i++){if(i%25==0)for(const k of['up','down','left','right'])G.keys[k]=Math.random()<.3?1:0;G.keys.a=Math.random()<.2?1:0;
    if(i%9==0)G.press.a=1;if(i%31==0){G.press.b=1;G.st.eq=['lantern','balls','powder','bug','shoes','bottle','hook','rod'][(i/31|0)%8];}
    if(i%400==0)G.press.menu=1;if(G.menu&&i%7==0)G.press.b=1;if(G.menu&&i%50==0)G.press.menu=1;if(G.shop&&i%40==0)G.press.b=1;
    try{G.update();if(i%40==0)G.draw();}catch(e){errs++;if(errs<6)console.log('ERR',G.cur.id,e.stack.split('\n').slice(0,3).join(' | '));}
    if(G.mode!='play')G.mode='play';if(G.p.hp<20)G.p.hp=99;}}
for(const k in G.keys)G.keys[k]=0;ok(errs==0,'random simulation across all '+ids.length+' scenes ('+errs+' errors, '+G.st.kills+' foes beaten)');
// --- scripted
G.newGame();run(3);
ok(G.cur.id=='ow:2,1'&&G.cam.x>=0,'new game starts in Capitol Square');
at(7,8,2);G.press.a=1;run(3);ok(G.st.items.lantern,'archivist gives lantern');
// walk east off the map edge -> fade into Shockoe
at(31,10,3);G.keys.right=1;run(30);G.keys.right=0;ok(G.cur.id=='ow:3,1'&&G.p.x<20,'walking off the east edge fades into Shockoe Bottom');
// camera scrolls
at(28,18,0);run(2);ok(G.cam.x==G.cur.w*T-256&&G.cam.y==G.cur.h*T-176,'camera scrolls to the far corner');
// bushes
G.load('ow:1,1');run(2);G.enemies.length=0;at(18,17,0);const before=G.cur.g[18][19];G.p.dir=3;G.p.x=18*T+4;G.p.y=18*T+8;G.press.a=1;run(12);
ok(before=='b'&&G.cur.g[18][19]=='.','paddle cuts a bush');
// trade chain
G.load('ow:0,1');run(2);G.enemies.length=0;const v=G.cur.npcs.find(n=>n.talk=='vendor');at(v.tx,v.ty+1,2);G.press.a=1;run(3);ok(G.st.trade=='melon','melon vendor gives a watermelon');
G.load('ow:2,0');run(2);G.enemies.length=0;at(12,4,2);G.press.a=1;run(3);ok(G.st.trade=='music','musician trades sheet music');
G.load('byrd:0,0');run(2);at(10,3,2);G.press.a=1;run(3);ok(G.st.trade=='rivermap','organist trades a river map');
G.load('ow:2,2');run(2);G.enemies.length=0;at(8,5,2);G.press.a=1;run(3);ok(G.st.items.kayak&&!G.st.trade,'kayaker gives the kayak');
// kayak across rapids south
at(15,18,0);G.keys.down=1;run(120);G.keys.down=0;ok(G.cur.id=='ow:2,3','kayak crosses the rapids to Manchester');
// forest hill key behind cracked rock
G.load('ow:1,3');run(2);G.enemies.length=0;G.st.items.powder=1;G.st.ammo.powder=5;G.st.eq='powder';at(22,9,2);G.press.b=1;run(100);
ok(G.cur.g[8][22]=='.','powder clears the cracked rock in Forest Hill');at(22,8,2);G.keys.up=1;run(25);G.keys.up=0;ok(G.st.got.carkey,'Carillon key picked up');
// carillon door
G.load('ow:0,2');run(2);G.enemies.length=0;at(4,8,2);G.keys.up=1;run(20);G.keys.up=0;ok(G.cur.id=='carillon:1,2','Carillon door opens with the key');
// block puzzle: push block from (4,5) to switch (11,5)
G.enemies.length=0;at(3,5,3);G.keys.right=1;run(400);G.keys.right=0;
ok(G.st.f['sw:carillon:1,2']&&G.cur.g[0][7]=='F','pushing the block onto the switch opens the gate');
// bell loft: two blocks
G.load('carillon:0,1');run(2);G.enemies.length=0;at(4,2,0);G.keys.down=1;run(300);G.keys.down=0;at(11,8,2);G.keys.up=1;run(300);G.keys.up=0;
ok(G.st.f['sw:carillon:0,1']&&G.cur.g[5][13]=='c','two-block puzzle makes the key chest appear');
// bell boss
G.load('carillon:1,0');run(2);const b=G.enemies[0];ok(b&&b.type=='bell','great bell spawns');
G.p.inv=99999;let t0=0;for(let i=0;i<4000&&G.enemies.includes(b);i++){if(b.state=='stun'){G.p.x=b.x-14;G.p.y=b.y;G.p.dir=3;if(i%5==0)G.press.a=1;}else{G.p.x=40;G.p.y=150;}run(1);}
ok(!G.enemies.includes(b)&&G.st.f['boss:carillon:1,0'],'bell boss beaten by hitting it after it slams down');
G.p.x=112;G.p.y=80;run(20);ok(G.st.got.bronze,'bronze keystone collected');
// tunnel needs 4
G.st.got.granite=G.st.got.iron=G.st.got.brick=1;G.st.got.bronze=0;G.load('ow:3,0');run(2);G.enemies.length=0;at(4,4,2);G.keys.up=1;run(20);G.keys.up=0;ok(G.cur.id=='ow:3,0','tunnel stays sealed with 3 keystones');
G.st.got.bronze=1;at(4,4,2);G.keys.up=1;run(20);G.keys.up=0;ok(G.cur.id=='tunnel:0,1','tunnel opens with 4 keystones');
// heart pieces: bug fetches the Byrd Park island piece
G.load('ow:0,2');run(2);G.enemies.length=0;G.st.eq='bug';const pc0=G.st.pieces;at(17,4,3);G.press.b=1;run(90);ok(G.st.pieces==pc0+1,'gold-bug fetches the island heart piece');
// older mechanics still work
at(7,8,2);G.load('quarry:0,1');at(7,8,2);run(2);G.enemies.length=0;run(2);ok(G.cur.g[3][12]=='c','quarry chest appears');at(12,4,2);G.press.a=1;run(3);
at(7,1,2);G.p.x=128;G.keys.up=1;run(3);G.keys.up=0;ok(G.cur.g[0][7]=='F','quarry lock opens');
at(7,8,2);G.load('pyramid:0,1');at(7,8,2);run(2);G.enemies.length=0;G.st.eq='lantern';for(const [x,y] of [[3,2],[12,2],[3,7],[12,7]]){at(x,y+1,2);G.press.b=1;run(2);}ok(G.cur.g[0][7]=='F','braziers open pyramid gate');
G.load('poe:0,1');run(2);G.st.eq='bug';at(4,5,3);G.press.b=1;run(80);ok(G.st.keys.poe>=1,'gold-bug fetches poe island key');
G.load('ow:2,1');run(2);at(22,9,2);const lb=Object.keys(G.st.lore).length;G.press.a=1;run(2);ok(G.st.lore.capitol,'reading a marker adds a journal entry');

// --- new systems
const T2=16,tick=n=>{for(let i=0;i<n;i++)G.update();};
const closeDlg=()=>{let k=0;while(G.dlg&&k++<60){G.press.a=1;G.update();}};
const startNpc=(id,who)=>{G.load(id);run(2);G.enemies.length=0;const n=G.cur.npcs.find(q=>q.chal==who);G.p.x=n.x;G.p.y=n.y+16;G.p.dir=2;G.p.atk=0;G.p.spin=0;G.press.a=1;G.update();
  if(G.dlg&&G.dlg.choices){G.dlg.i=G.dlg.pages.length-1;G.dlg.n=999;G.dlg.sel=0;G.press.a=1;G.update();}return n;};
G.st.items.lantern=1;G.st.items.bug=1;G.st.items.balls=1;G.st.pins={};
startNpc('ow:0,0','flies');ok(G.st.chal===undefined&&G.picks.filter(k=>k.kind=='token').length==8,'shag flies: 8 fly balls appear');
for(const k of G.picks.filter(k=>k.kind=='token')){G.p.x=k.x;G.p.y=k.y;G.update();closeDlg();}ok(G.st.pins.flies,'collecting all fly balls wins the pin');
startNpc('ow:1,0','bus');const fl=G.picks.find(k=>k.kind=='flag');ok(!!fl,'bus race: finish flag appears');G.p.x=fl.x;G.p.y=fl.y;G.update();closeDlg();ok(G.st.pins.bus,'reaching the flag wins the race');
startNpc('ow:3,1','rats');let rc=G.enemies.filter(e=>e.chal).length;ok(rc==8,'market rats: 8 rats spawn');
G.p.inv=99999;for(const e of G.enemies.filter(e=>e.chal)){e.hp=1;e.flash=0;G.p.x=e.x-14;G.p.y=e.y;G.p.dir=3;G.p.atk=0;G.press.a=1;tick(8);closeDlg();}
ok(G.st.pins.rats,'beating all the rats wins ('+G.enemies.filter(e=>e.chal).length+' left)');
startNpc('ow:3,0','lamps');G.st.eq='lantern';for(const [x,y] of G.cur.lamps){G.p.x=x*T2+8;G.p.y=(y+1)*T2+8;G.p.dir=2;G.p.atk=0;G.press.b=1;G.update();closeDlg();}
ok(G.st.pins.lamps,'lighting every gas lamp on Church Hill wins');
startNpc('ow:2,3','murals');for(const [x,y] of G.cur.murals){G.p.x=x*T2+8;G.p.y=(y+1)*T2+8;G.p.dir=2;G.p.atk=0;G.press.a=1;G.update();closeDlg();}
ok(G.st.pins.murals,'finding all five murals wins');
// timeout
startNpc('ow:3,2','crabs');tick(41*60);closeDlg();ok(!G.st.pins.crabs&&G.enemies.filter(e=>e.chal).length==0,'running out of time fails and clears the challenge');
// quiz: answer correctly by reading the dialog choices
G.load('ow:2,1');run(2);const qg=G.cur.npcs.find(q=>q.chal=='quiz');G.p.x=qg.x;G.p.y=qg.y+16;G.p.dir=2;G.press.a=1;G.update();
let guard=0;while(G.dlg&&guard++<400){if(G.dlg.choices){G.dlg.n=999;G.dlg.i=G.dlg.pages.length-1;if(G.dlg.choices[0]=="Let's go!"){G.dlg.sel=0;G.press.a=1;G.update();continue;}
  const pages=G.dlg.pages.map(p=>p.join(' ')).join(' ');const ans=G.dlg.choices.findIndex(c=>{const L=G.LORE.find(l=>l[1]==c);const sn=L[2].split('. ')[0];return pages.replace(/\s+/g,' ').includes(sn.slice(0,20));});G.dlg.sel=Math.max(0,ans);G.press.a=1;G.update();}
  else{G.press.a=1;G.update();}}
ok(G.st.pins.quiz,'answering three journal questions wins the quiz');
// cars stop for you
G.load('ow:1,0');run(2);G.enemies.length=0;const car=G.cars?null:null;
// ow chest
G.load('ow:1,0');run(2);G.enemies.length=0;const ch=G.cur.chests[0];const c0=G.st.coins;G.p.x=ch.tx*T2+8;G.p.y=(ch.ty+1)*T2+8;G.p.dir=2;G.p.atk=0;G.press.a=1;G.update();closeDlg();ok(G.st.coins==c0+50,'hidden chest gives 50 coins');
// landmark read
G.load('ow:3,1');run(2);G.enemies.length=0;G.p.x=20*T2+8;G.p.y=7*T2+8;G.p.dir=2;G.p.atk=0;delete G.st.lore.shockoe;G.press.a=1;G.update();closeDlg();ok(G.st.lore.shockoe,'pressing A on Main Street Station reads its story');
// golden paddle
G.st.pins={};for(const k of Object.keys(G.CHAL))if(k!='trolley')G.st.pins[k]=1;startNpc('ow:1,3','trolley');const f2=G.picks.find(k=>k.kind=='flag');G.p.x=f2.x;G.p.y=f2.y;G.update();closeDlg();ok(G.st.gold,'earning all 14 pins turns the paddle gold');
// wanderers move
G.load('ow:2,1');run(2);const w=G.cur.npcs.find(n=>n.wander);const w0=[w.x,w.y];G.p.x=40;G.p.y=40;let moved=false;for(let i=0;i<800&&!moved;i++){tick(1);if(w.x!=w0[0]||w.y!=w0[1])moved=true;}ok(moved,'townsfolk wander around');
