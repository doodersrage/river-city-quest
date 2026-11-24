// The dog, camera and album, your row house, cooking and eating, the bike and trail, and First Friday.
const G=require('./harness.js'),SC=G.SC,T=16;
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pick=n=>{let k=0;while(G.dlg&&k++<60){if(G.dlg.choices&&G.dlg.i==G.dlg.pages.length-1){G.dlg.n=999;G.dlg.sel=n;}else if(G.dlg.choices){G.dlg.i=G.dlg.pages.length-1;G.dlg.n=999;G.dlg.sel=n;}G.press.a=1;G.update();}};
const run=n=>{for(let i=0;i<n;i++){G.update();pick(0);}};
const talk=who=>{for(const id in SC){if(!(SC[id].npcs||[]).some(q=>q.talk==who))continue;G.load(id);G.dlg=null;const n=G.cur.npcs.find(q=>q.talk==who);G.enemies.length=0;n.wander=0;n.x=n.tx*T+8;n.y=n.ty*T+8;G.p.x=n.x;G.p.y=n.y+14;G.p.dir=2;G.updCam();G.press.a=1;G.update();return true;}return false;};
G.newGame();G.dlg=null;run(2);
// dog
ok(talk('shelter'),'shelter volunteer is in Manchester');pick(1);ok(G.st.dog&&G.st.dog.name=='JAMES'&&G.dog,'adopting a dog named James');
G.load('ow:2,1');G.dlg=null;G.enemies.length=0;const d=G.dog;G.p.x+=80;run(120);ok(Math.hypot(d.x-G.p.x,d.y-G.p.y)<40,'the dog follows you');
const sec=G.picks.find(k=>k.kind=='secret');if(sec){G.p.x=sec.x+30;G.p.y=sec.y;d.x=G.p.x;d.y=G.p.y;run(150);ok(Math.hypot(d.x-sec.x,d.y-sec.y)<24,'the dog sniffs out a hidden stash');}
G.load('ow:0,0');G.dlg=null;const rat=G.enemies.find(e=>e.type=='rat');G.enemies.splice(0,G.enemies.length,rat);G.p.x=rat.x+30;G.p.y=rat.y;G.p.inv=1e9;G.dog.x=G.p.x;G.dog.y=G.p.y;rat.hp=1;
for(let i=0;i<200&&G.enemies.includes(rat);i++){rat.t=0;G.update();}ok(!G.enemies.includes(rat),'the dog chases down a rat');
// camera
G.st.coins=500;G.st.items.camera=1;G.st.eq='camera';G.load('ow:2,1');G.dlg=null;const L=G.cur.lm.find(l=>l.art=='capitol');G.p.x=(L.x+L.w/2)*T;G.p.y=(L.y+L.h+2)*T;G.press.b=1;G.update();
ok(G.st.photos&&G.st.photos.capitol,'photographing the Capitol adds it to the album');ok(G.PHOTOS.length>=15,'the album has room for '+G.PHOTOS.length+' landmarks');
// home
G.load('rowhouse:0,0');G.dlg=null;ok(G.cur.name=='Your Row House','the Fan row house is yours');
G.p.x=13*T+8;G.p.y=7*T+8;G.p.dir=0;const c0=G.st.clock,h0=G.hour();G.press.a=1;G.update();pick(1);ok(G.hour()>=19.5&&G.hour()<20.5,'sleeping until evening sets the clock ('+G.hour().toFixed(1)+')');
G.st.ingr={ham:2,flour:1,tomato:1};G.p.x=10*T+8;G.p.y=2*T+8;G.p.dir=2;G.press.a=1;G.update();pick(1);ok(G.st.food&&G.st.food.stew==1,'cooking Brunswick stew from tomato and ham');
G.st.items.basket=1;G.st.eq='basket';G.p.hp=1;G.press.b=1;G.update();pick(0);ok(G.p.hp==G.p.max&&G.warm>0,'eating stew heals fully and warms you up');
const hp=G.p.hp;G.p.inv=0;G.hurtT=0;
// bike
G.load('ow:2,1');G.dlg=null;G.enemies.length=0;ok(talk('cyclist')&&G.st.items.bike,'the trail cyclist hands you a bike');pick(1);
G.load('ow:2,1');G.dlg=null;G.enemies.length=0;G.p.x=16*T+8;G.p.y=9*T+8;G.st.eq='bike';G.press.b=1;G.update();ok(G.st.riding,'hop on the bike');
let x0=G.p.x;G.keys.right=1;for(let i=0;i<20;i++)G.update();G.keys.right=0;const bikeD=G.p.x-x0;G.st.riding=false;x0=G.p.x;G.keys.left=1;for(let i=0;i<20;i++)G.update();G.keys.left=0;const walkD=x0-G.p.x;
ok(bikeD>walkD*1.3,'biking is faster than walking ('+bikeD.toFixed(0)+' vs '+walkD.toFixed(0)+')');
G.st.riding=true;G.load('quarry:0,1');ok(!G.st.riding,'you hop off going indoors');G.load('ow:2,1');
G.startMini('trail');let g=0;while(G.mode=='mini'&&g++<9000){const m=G.mini;if(m){const o=m.obs.find(o=>!o.hit&&o.y-m.y>100&&o.y-m.y<170&&Math.abs(o.x-m.x)<22);G.keys.left=o&&o.x>=m.x?1:0;G.keys.right=o&&o.x<m.x?1:0;}G.update();}
G.keys.left=G.keys.right=0;pick(0);ok(G.mode=='play'&&G.st.mini.trail>0,'the Capital Trail time trial finishes ('+G.fmtTime(G.st.mini.trail)+')');
// First Friday
const day=Math.floor(G.st.clock/36000);G.st.clock=(day+((4-day%7+7)%7))*36000+36000*15/24;ok(G.weekday()==4&&G.firstFriday(),'Friday night is First Friday');
G.load('ow:1,0');G.dlg=null;const cur=G.cur.npcs.find(n=>n.talk=='curator');ok(!!cur,'the curator is out on Broad Street');
talk('curator');pick(0);const ps=G.picks.filter(k=>k.kind=='painting');ok(ps.length==2,'two lost paintings appear on Broad Street');
for(const k of ps){G.p.x=k.x;G.p.y=k.y;run(2);}G.load('ow:2,0');G.dlg=null;const p3=G.picks.find(k=>k.kind=='painting');ok(!!p3,'the third is in Jackson Ward');G.p.x=p3.x;G.p.y=p3.y;run(2);
G.load('ow:1,0');G.dlg=null;talk('curator');pick(0);ok(G.st.f.gallery,'returning all three finishes the gallery hunt');
G.st.clock+=36000;G.load('ow:1,0');ok(!G.cur.npcs.some(n=>n.ff),'the art walk packs up after Friday');
// menu draws every tab
G.dlg=null;G.press.menu=1;G.update();const tabs=new Set();for(let i=0;i<8;i++){tabs.add(G.menu.tab);G.draw();G.press.b=1;G.update();}ok(tabs.size==8,'menu has eight tabs incl. photos');
// Spanish
G.menu=null;G.OPT.lang='es';ok(/archivista|Explora|Busca|Lleva|Ayuda|Cuenta/.test(G.goal()),'hints switch to Spanish');G.toast('Challenge abandoned.');G.draw();
G.mode='title';G.draw();G.OPT.lang='en';ok(/^[A-Z]/.test(G.goal()),'and back to English');G.mode='play';
// tutorial
G.mode='title';G.startNew();G.press.a=1;G.update();for(let i=0;i<10&&G.mode!='play';i++){G.press.menu=1;G.update();}
ok(G.st.tut===0,'a new game starts the tips');let k=0;while(G.dlg&&k++<40){G.press.a=1;G.update();}
G.keys.right=1;for(let i=0;i<80;i++)G.update();G.keys.right=0;ok(G.st.tut==1,'tip 1 clears after walking');
G.st.items.lantern=1;G.update();ok(G.st.tut==2,'tip 2 clears after meeting the archivist');
G.p.atk=5;G.update();G.update();ok(G.st.tut==3,'tip 3 clears after a swing');
G.p.atk=0;G.p.charging=false;G.st.eq='lantern';G.press.b=1;G.update();G.update();ok(G.st.tut==4,'tip 4 clears after using B');
G.press.menu=1;G.update();G.update();ok(G.st.tut==5,'tip 5 clears on opening the menu');
for(let i=0;i<8&&G.st.tut!=null;i++){G.press.b=1;G.update();G.draw();}ok(G.st.tut==null,'tip 6 clears on the map tab, and the tips end');G.press.menu=1;G.update();
