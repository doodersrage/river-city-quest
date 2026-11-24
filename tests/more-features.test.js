const G=require('./harness.js'),SC=G.SC;const T=16;
const run=n=>{for(let i=0;i<n;i++){G.update();let k=0;while(G.dlg&&k++<50){G.press.a=1;G.update();}}};
const at=(tx,ty,dir)=>{G.p.x=tx*T+8;G.p.y=ty*T+8;G.p.dir=dir;G.p.atk=0;G.p.spin=0;G.p.charging=false;G.p.kt=0;G.p.dash=0;};
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
G.newGame();run(3);
ok(/archivist/.test(G.goal()),'first goal points to the archivist');
G.st.items.lantern=1;ok(/Belle Isle/.test(G.goal()),'goal moves on to Belle Isle');
G.checkAch();ok(G.st.ach.first,'award for the lantern');
// new maps via edges
G.load('ow:1,3');G.p.hp=99;G.p.max=99;at(0,9,1);G.p.x=3;G.keys.left=1;run(40);G.keys.left=0;run(30);ok(G.cur.id=='ow:0,3','walking west from Forest Hill reaches Pony Pasture');
G.load('ow:2,3');at(31,11,3);G.p.x=31*T+12;G.keys.right=1;run(40);G.keys.right=0;run(30);ok(G.cur.id=='ow:3,3',"walking east from Manchester reaches Ancarrow's Landing");
// hook to the island and grab the oar
G.load('ow:0,3');G.enemies.length=0;G.st.items.hook=1;G.st.eq='hook';at(18,7,2);G.press.b=1;run(45);ok(Math.floor(G.p.y/T)==4&&Math.floor(G.p.x/T)==18,'hook reaches the Pony Pasture sandbar');
at(16,3,2);run(5);ok(G.st.got.oar,'bateau oar picked up');
G.load('ow:0,3');G.enemies.length=0;const pole=G.picks.find(k=>k.id=='pole');ok(pole&&G.cur.g[11][12]=='%','pole is walled in by cracked rock');
G.st.items.powder=1;G.st.ammo.powder=5;G.st.eq='powder';at(11,11,3);G.p.inv=999;G.press.b=1;run(4);at(9,13,0);run(120);ok(G.cur.g[11][12]!='%','powder opens the rocks');
G.p.x=pole.x;G.p.y=pole.y;run(3);ok(G.st.got.pole,'pole picked up');
G.load('ow:3,3');G.enemies.length=0;G.st.eq='hook';at(24,7,2);G.press.b=1;run(45);ok(Math.floor(G.p.y/T)==3,'hook reaches the landing island');at(22,2,2);run(5);ok(G.st.got.tiller,'tiller picked up');
const hist=G.cur.npcs.find(n=>n.talk=='historian');at(hist.tx,hist.ty+1,2);hist.x=hist.tx*T+8;hist.y=hist.ty*T+8;hist.wander=0;const mx=G.p.max;G.press.a=1;run(4);
ok(G.st.f.bateau&&G.st.lure&&G.p.max==mx+2,'historian rebuilds the bateau and gives the Golden Lure and a heart');
// boss intro
G.load('quarry:1,0');ok(G.dlg&&G.dlg.head=='Quarry Pond','boss room opens with an intro');G.dlg=null;
G.load('ow:2,1');G.load('quarry:1,0');ok(!G.dlg||G.dlg.head!='Quarry Pond','intro only plays once');G.dlg=null;
// folk talk
G.load('ow:1,2');G.dlg=null;ok(typeof G.folkContext()=='string','townsfolk have something to say about the moment');
// big text
G.OPT.big=true;G.say(['This sentence is long enough to need a few lines when the big text option is turned on in options.']);ok(G.dlg.pages.every(p=>p.length<=3&&p.every(l=>l.length<=21)),'big text wraps shorter lines');G.dlg=null;G.OPT.big=false;
// menu six tabs draw
G.press.menu=1;G.update();const tabs=new Set();for(let i=0;i<6;i++){tabs.add(G.menu.tab);G.draw();G.press.b=1;G.update();}ok(tabs.size==6,'menu has six tabs incl. awards');G.press.menu=1;G.update();
// NG+
const fake={st:JSON.parse(JSON.stringify(G.st))};fake.st.f.won=1;fake.st.cards={capitol:1};G.newGamePlus(fake);
ok(G.st.ng==1&&G.st.cards.capitol&&!G.st.items.lantern,'New Game+ keeps cards, resets items');
G.load('ow:0,0');const rat=G.enemies.find(e=>e.type=='rat');ok(rat&&rat.hp==2,'NG+ foes are tougher');
const hp=G.p.hp;G.p.inv=0;G.p.dash=0;rat.x=G.p.x;rat.y=G.p.y;rat.flash=0;run(2);ok(G.p.hp<=hp-2,'NG+ foes hit harder');
// boss rush
G.startRush();ok(G.cur.id==G.RUSH[0]&&G.p.max==20,'boss rush starts at the first boss');let steps=0;
for(let i=0;i<G.RUSH.length&&G.mode=='play';i++){const b=G.enemies.find(e=>e.boss);if(!b){console.log('no boss in',G.cur.id);break;}G.kill(b);G.enemies.splice(G.enemies.indexOf(b),1);run(30);steps++;}
ok(steps==G.RUSH.length&&G.mode=='title','boss rush runs through all six bosses and returns to the title');
// title options
G.mode='title';const T3=()=>{};G.saveData=fake;
