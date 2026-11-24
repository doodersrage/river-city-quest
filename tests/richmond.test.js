// The newer Richmond places: Arthur Ashe Boulevard, the Raceway, Texas Beach, VCU, the Canal Walk,
// the Jefferson Hotel, three new mini-games, festivals, fireflies and food.
const G=require('./harness.js'),SC=G.SC,T=16;
const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const pick=n=>{let k=0;while(G.dlg&&k++<60){if(G.dlg.choices){G.dlg.i=G.dlg.pages.length-1;G.dlg.n=999;G.dlg.sel=n;}G.press.a=1;G.update();}};
const run=n=>{for(let i=0;i<n;i++){G.update();pick(0);}};
const talk=who=>{for(const id in SC){if(!(SC[id].npcs||[]).some(q=>q.talk==who))continue;G.load(id);for(let i=0;i<45;i++)G.update();G.dlg=null;const n=G.cur.npcs.find(q=>q.talk==who);G.enemies.length=0;n.wander=0;n.x=n.tx*T+8;n.y=n.ty*T+8;G.p.x=n.x;G.p.y=n.y+14;G.p.dir=2;G.updCam();G.press.a=1;G.update();return true;}return false;};
G.newGame();G.dlg=null;run(2);G.st.coins=500;
// the new neighborhoods are on the map and joined to the city
for(const [id,name] of [['ow:-1,0','Arthur Ashe Boulevard'],['ow:-1,-1','Richmond Raceway'],['ow:-1,2','Texas Beach & Agecroft'],['ow:2,-1','VCU & Court End'],['ow:4,1',"Canal Walk & Brown's Island"]])ok(SC[id]&&SC[id].name==name,name+' exists');
const settle=()=>{for(let i=0;i<45;i++)G.update();G.dlg=null;G.enemies.length=0;};
const walk=(from,x,y,key,to)=>{G.load(from);settle();G.p.x=x;G.p.y=y;G.updCam();for(let i=0;i<120&&G.cur.id==from;i++){G.keys[key]=1;G.update();}G.keys[key]=0;for(let i=0;i<40;i++)G.update();return G.cur.id==to;};
ok(walk('ow:0,0',12,11*T+8,'left','ow:-1,0'),"walk west from Scott's Addition onto Arthur Ashe Boulevard");
ok(walk('ow:-1,0',15*T+8,20,'up','ow:-1,-1'),'walk north from the Boulevard to the Raceway');
ok(walk('ow:0,2',12,10*T+8,'left','ow:-1,2'),'walk west from Byrd Park to Texas Beach');
ok(walk('ow:2,0',15*T+8,20,'up','ow:2,-1'),'walk north from Jackson Ward to VCU');
ok(walk('ow:3,1',SC['ow:3,1'].w*T-12,10*T+8,'right','ow:4,1'),'walk east from Shockoe Bottom to the Canal Walk');
// doors into the new buildings
for(const [ow,to] of [['ow:1,0','jefferson:0,0'],['ow:-1,0','science:0,0'],['ow:-1,0','vmhc:0,0'],['ow:2,-1','siegel:0,0'],['ow:2,-1','marshall:0,0'],['ow:2,-1','bhm:0,0'],['ow:-1,2','agecroft:0,0']]){
  const d=SC[ow].doors.find(q=>q.to==to);G.load(ow);settle();G.p.x=d.tx*T+8;G.p.y=d.ret[1]*T+6;G.keys.up=1;for(let i=0;i<20&&G.cur.id==ow;i++)G.update();G.keys.up=0;ok(G.cur.id==to,'door from '+SC[ow].name+' into '+SC[to].name);}
ok(G.LORE.length>=66&&['jefferson','libbyview','leebridge','pipeline','sauers','agecroft','hanover','ukrops','sallybell'].every(k=>G.LORE.some(l=>l[0]==k)),'new journal stories ('+G.LORE.length+')');
// the Jefferson's alligator
ok(talk('bellhop'),'bellhop at the Jefferson');pick(0);G.checkAch();ok(G.st.f.gator&&G.st.ach.gator,'hearing about the alligator earns Gator Tale');
// free throws: a perfect shooter waits for the middle of the meter
ok(talk('hoops'),'Rams coach in the Siegel Center');pick(0);ok(G.mode=='mini'&&G.mini.kind=='hoops','free throws start');
for(let i=0;i<4000&&G.mode=='mini';i++){const m=G.mini;if(m.ph!=null&&!m.ball&&Math.abs(Math.sin(m.ph+m.sp))*50<4)G.press.a=1;G.update();}pick(0);
ok(G.st.mini.hoops>=8&&G.st.f.havoc,'free throws: '+G.st.mini.hoops+' of 10 and Havoc');
// tennis: chase the ball and swing as it arrives
ok(talk('tennis'),'tennis coach on the Boulevard');pick(0);ok(G.mode=='mini'&&G.mini.kind=='tennis','tennis starts');
for(let i=0;i<20000&&G.mode=='mini'&&!(G.mini.ret>=16);i++){const m=G.mini,b=m.ball;G.keys.left=G.keys.right=0;if(b&&!b.up){const tx=b.x+b.vx*Math.max(0,(150-b.y)/b.vy);if(tx<m.x-2)G.keys.left=1;if(tx>m.x+2)G.keys.right=1;if(b.y>132&&b.y<146&&m.sw==0)G.press.a=1;}G.update();}
G.keys.left=G.keys.right=0;ok(G.mini&&G.mini.ret>=15,'tennis: '+(G.mini&&G.mini.ret)+' returns in a row');G.mini.miss=3;run(3);pick(0);G.checkAch();ok(G.st.f.ace&&G.st.ach.ace,'15 returns earns Ace');
// raceway: steer around slow cars and oil
ok(talk('racedir'),'race official at the Raceway');pick(0);ok(G.mode=='mini'&&G.mini.kind=='race','raceway dash starts');
for(let i=0;i<6000&&G.mode=='mini';i++){const m=G.mini;G.keys.left=G.keys.right=0;const near=m.obs.filter(o=>!o.hit&&o.y-m.y>100&&o.y-m.y<200&&Math.abs(o.x-m.x)<22).sort((a,b)=>a.y-b.y)[0];
  if(near){if(near.x>=m.x&&m.x>80)G.keys.left=1;else if(near.x<m.x&&m.x<176)G.keys.right=1;else G.keys[near.x>=m.x?'left':'right']=1;}G.update();}
G.keys.left=G.keys.right=0;const rt=G.st.mini.race/60;pick(0);ok(rt>0&&rt<G.MINI.race.silver,'raceway: a careful driver finishes in '+rt.toFixed(1)+'s (gold '+G.MINI.race.gold+')');
// festivals on Brown's Island
G.setDate(new Date(2026,9,8));ok(G.events().includes('folk'),'Folk Festival in early October');const c0=G.st.coins;talk('festival');pick(0);ok(G.st.coins==c0+30,'the festival host hands out 30 coins');
ok(G.crowd&&G.crowd.length>=6,'a crowd gathers at the stage');
G.setDate(new Date(2026,4,20));ok(G.events().includes('riverrock'),'Dominion Riverrock in May');const c1=G.st.coins;talk('festival');pick(0);ok(G.st.coins==c1+30,'and again at Riverrock');
G.setDate(new Date(2026,1,3));ok(!G.events().includes('riverrock')&&!G.events().includes('folk'),'no festival in February');G.load('ow:4,1');ok(!G.crowd,'and no crowd');
// fireflies on a summer night on Belle Isle
G.setDate(new Date(2026,6,10));G.st.clock=Math.round(22/24*36000);ok(G.dark()>.6,'it is night');G.load('ow:2,2');G.dlg=null;G.enemies.length=0;run(2);ok(G.ffly.length>=10,'fireflies come out on Belle Isle');
for(let k=0;k<12&&!G.st.f.firefly;k++){const f=G.ffly[0];if(!f)break;G.p.x=f.x;G.p.y=f.y-6;G.update();}G.checkAch();ok(G.st.f.firefly&&G.st.ach.firefly,'catching ten fireflies earns Firefly Night');
G.load('ow:2,1');run(2);ok(G.ffly.length==0,'no fireflies at the Capitol');
// food: Hanover tomatoes, Sally Bell's and rainbow cookies
const t0=(G.st.ingr&&G.st.ingr.tomato)||0;ok(talk('tomato'),'tomato farmer at the 17th Street Market');pick(0);ok(G.st.ingr.tomato==t0+3&&G.st.lore.hanover,'in July the farmer gives three Hanover tomatoes');
G.st.items.basket=1;G.st.food={};talk('sallybell');ok(G.shop&&G.shop.list==G.SALLY,"Sally Bell's opens her counter");G.shop.cur=0;G.press.a=1;G.update();ok(G.st.food.lunch==1&&G.st.lore.sallybell,'buying a box lunch');
const ck=G.MARKET.find(i=>i.name=='Rainbow Cookie'),tm=G.MARKET.find(i=>i.name=='Hanover Tomato');ok(ck&&ck.why()==''&&tm&&tm.why()=='','rainbow cookies and summer tomatoes at the market');ck.buy();ok(G.st.food.cookie==1&&G.st.lore.ukrops,'a rainbow cookie for the basket');
G.setDate(new Date(2026,0,10));ok(tm.why()=='SUMMER','tomatoes are summer only');G.setDate(null);
ok(['speedway','scimuseum','sauers','agecroft','siegel','stage'].every(a=>G.PHOTOS.some(q=>q.art==a)),'new landmarks for the photo album ('+G.PHOTOS.length+')');
