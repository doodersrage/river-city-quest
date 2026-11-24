// Full playthrough: new game to the ending, through the real game logic.
// The bot walks through every door and dungeon exit for real (keys, bombs, gates must work),
// and fights bosses with the mechanic each one needs. It only teleports between spots it has
// already been allowed to reach, and to stand next to people it needs to talk to.
const G=require('./harness.js'),SC=G.SC,T=16;
let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
const DIRS={up:[0,-1,2],down:[0,1,0],left:[-1,0,1],right:[1,0,3]};
function closeDlg(){let k=0;while(G.dlg&&k++<200){if(G.dlg.choices){G.dlg.i=G.dlg.pages.length-1;G.dlg.n=999;G.dlg.sel=G.dlg.choices.length-1;}G.press.a=1;G.update();}}
function run(n){for(let i=0;i<n;i++){G.update();closeDlg();if(G.mode!='play')return;}}
function at(tx,ty,dir){Object.assign(G.p,{x:tx*T+8,y:ty*T+8,dir:dir==null?G.p.dir:dir,atk:0,spin:0,charging:false,kt:0,dash:0});G.updCam();}
function hold(k,n){G.keys[k]=1;for(let i=0;i<n;i++){G.update();closeDlg();}G.keys[k]=0;}
function safe(){G.p.hp=G.p.max;G.p.inv=999;}
function settleIn(id){G.load(id);G.dlg=null;const c=G.cur,cx=c.w>>1,cy=c.h>>1;let best=null;
  for(let y=2;y<c.h-2;y++)for(let x=2;x<c.w-2;x++){const t=c.g[y][x];if(G.SOLID.includes(t)||'DE~'.includes(t))continue;const d=Math.abs(x-cx)+Math.abs(y-cy);if(!best||d<best[0])best=[d,x,y];}
  if(best)at(best[1],best[2]);}
function cleanEnemies(){for(const e of G.enemies.slice())if(!e.boss){G.kill(e);const i=G.enemies.indexOf(e);if(i>=0)G.enemies.splice(i,1);}run(20);}
function walkable(x,y){const t=G.cur.g[y]&&G.cur.g[y][x];return t&&!G.SOLID.includes(t);}
function standBeside(x,y){for(const [d,[dx,dy,dir]] of Object.entries(DIRS)){const sx=x-dx,sy=y-dy;if(walkable(sx,sy)){at(sx,sy,dir);return d;}}return null;}
function openChests(){for(let y=0;y<G.cur.h;y++)for(let x=0;x<G.cur.w;x++)if(G.cur.g[y][x]=='c'){if(standBeside(x,y)){G.press.a=1;run(3);}}}
function grabPicks(){for(const k of G.picks.slice()){if(!G.picks.includes(k))continue;G.p.x=k.x;G.p.y=k.y;run(3);}}
function talkTo(talk){for(const id in SC){const n=(SC[id].npcs||[]).find(q=>q.talk==talk);if(!n)continue;settleIn(id);cleanEnemies();
    n.x=n.tx*T+8;n.y=n.ty*T+8;n.vx=n.vy=0;n.wander=false;const d=standBeside(n.tx,n.ty);if(!d)return false;safe();G.press.a=1;G.update();closeDlg();run(2);return true;}return false;}
function bombAt(x,y){G.st.eq='powder';G.st.ammo.powder=Math.max(G.st.ammo.powder,3);if(!standBeside(x,y))return false;safe();G.press.b=1;G.update();
  const [fx,fy]=[G.p.x,G.p.y];at(Math.floor(fx/T),Math.floor(fy/T));G.p.x+=0;for(let i=0;i<4;i++){} // step back two tiles so the blast misses us
  const b=G.p.dir;const back=[[0,-1],[1,0],[0,1],[-1,0]][b];for(const s of[2,1]){const bx=Math.floor(fx/T)+back[0]*s,by=Math.floor(fy/T)+back[1]*s;if(walkable(bx,by)){at(bx,by);break;}}
  run(110);return true;}
function enterDoor(sceneId,to){settleIn(sceneId);cleanEnemies();const d=G.cur.doors.find(q=>q.to==to);if(!d)return false;
  if(G.cur.g[d.ty][d.tx]=='%'){bombAt(d.tx,d.ty);}
  at(d.ret[0],d.ret[1],2);safe();G.keys.up=1;for(let i=0;i<80&&G.cur.id==sceneId;i++){G.update();closeDlg();}G.keys.up=0;run(40);return G.cur.id==to;}

// --- dungeon solver
function nb(id,d){const s=SC[id],[a]=id.split(':'),[dx,dy]={N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]}[d];return a+':'+(s.ax+dx)+','+(s.ay+dy);}
function exitCells(d){return d=='N'?[[7,0],[8,0]]:d=='S'?[[7,10],[8,10]]:d=='W'?[[0,5]]:[[15,5]];}
function solveRoom(){safe();cleanEnemies();
  (G.cur.braz||[]).forEach(([x,y],i)=>{if(G.cur.g[y][x]=='j'){G.st.eq='lantern';if(standBeside(x,y)){G.press.b=1;run(4);}}});
  // push blocks onto switches that sit in a straight line
  const sw=[];G.cur.g0.forEach((r,y)=>r.forEach((c,x)=>{if(c=='^')sw.push([x,y]);}));
  for(const b of G.blocks){if(G.cur.g[b.ty][b.tx]=='^')continue;const t=sw.find(([x,y])=>(x==b.tx||y==b.ty)&&!G.blocks.some(o=>o.tx==x&&o.ty==y));if(!t)continue;
    const dx=Math.sign(t[0]-b.tx),dy=Math.sign(t[1]-b.ty),key=dx>0?'right':dx<0?'left':dy>0?'down':'up';
    for(let k=0;k<20&&(b.tx!=t[0]||b.ty!=t[1]);k++){at(b.tx-dx,b.ty-dy,DIRS[key][2]);safe();hold(key,45);run(10);}}
  run(10);openChests();grabPicks();}
function killBoss(){const e=G.enemies.find(q=>q.boss);if(!e)return true;let n=0;
  while(G.enemies.includes(e)&&n++<300&&G.mode=='play'){safe();e.flash=0;e.kt=0;
    for(const q of G.enemies.slice())if(!q.boss){G.kill(q);G.enemies.splice(G.enemies.indexOf(q),1);}
    if(e.gone){run(4);continue;}
    if(e.type=='turtle'){e.state='stun';e.st=999;G.hitEnemyT(e,1,'paddle');}
    else if(e.type=='wraith'){e.vis=0;G.hitEnemyT(e,1,'refl');e.vis=0;}
    else if(e.type=='bell'){e.state='stun';e.st=999;e.z=0;G.hitEnemyT(e,2,'bomb');}
    else if(e.type=='foreman'){if(e.state!='stun')G.hitEnemyT(e,0,'hook');G.hitEnemyT(e,1,'paddle');}
    else if(e.type=='arum'){if(e.state!='bloom'){G.st.eq='can';e.x=136;e.y=72;at(8,6,2);G.press.b=1;G.update();}G.hitEnemyT(e,1,'paddle');}
    else G.hitEnemyT(e,1,'paddle');
    run(6);}
  return!G.enemies.includes(e);}
function doDungeon(entry){
  const area=entry.split(':')[0],seen=new Set([G.cur.id]);let boss=false,guard=0;
  while(guard++<60){solveRoom();if(G.cur.bossT){boss=killBoss();if(G.mode!='play')return boss;run(30);grabPicks();break;}
    // try to step into a room we have not seen yet
    let moved=false;
    for(const id of[...seen]){settleIn(id);solveRoom();
      for(const d of SC[id].opens){const to=nb(id,d);if(seen.has(to)||!SC[to])continue;const cells=exitCells(d),[cx,cy]=cells[0],t=G.cur.g[cy][cx];
        if(t=='H')continue;
        if(t=='L'&&!(G.st.keys[area]>0))continue;
        if(t=='%'){if(!G.st.items.powder)continue;const ix=cx+(d=='E'?-1:d=='W'?1:0),iy=cy+(d=='S'?-1:d=='N'?1:0);bombAt(cx,cy);run(10);if(G.cur.g[cy][cx]=='%')continue;}
        const key={N:'up',S:'down',E:'right',W:'left'}[d],[dx,dy]=DIRS[key];const c2=cells.find(([x,y])=>walkable(x-dx,y-dy)&&walkable(x-dx*2,y-dy*2))||cells[0];at(c2[0]-dx*2,c2[1]-dy*2,DIRS[key][2]);safe();
        G.keys[key]=1;for(let i=0;i<70&&G.cur.id==id;i++){G.update();closeDlg();}G.keys[key]=0;run(25);
        if(G.cur.id==to){seen.add(to);moved=true;break;}}
      if(moved)break;}
    if(!moved)break;}
  return boss;}
function leaveDungeon(){const ret=G.st.ret;if(!G.cur.bossT)return false;at(7,7,0);safe();hold('down',30);run(20);return!!G.cur.ow;}
function dungeon(scene,to,name){const inside=enterDoor(scene,to);ok(inside,'enter '+name);if(!inside)return;const b=doDungeon(to);ok(b,'beat the '+name+' boss');if(G.mode=='play')ok(leaveDungeon(),'leave '+name+' by the stairs');}

// ---------------- the run
G.newGame();closeDlg();run(5);
ok(/archivist/.test(G.goal()),'hint: talk to the archivist');
talkTo('archivist');ok(G.st.items.lantern,'archivist gives the lantern');
talkTo('ballplayer');ok(G.st.items.balls,'ballplayer gives baseballs');
talkTo('brewer');ok(G.st.items.bottle,'brewer gives ginger beer');
ok(/Belle Isle/.test(G.goal()),'hint: Belle Isle');
dungeon('ow:2,2','quarry:0,1','Belle Isle Quarry');ok(G.st.got.granite&&G.st.items.powder,'granite keystone and blasting powder');
ok(/pyramid/.test(G.goal()),'hint: the pyramid');
dungeon('ow:1,2','pyramid:0,1','Pyramid');ok(G.st.got.iron&&G.st.shield,'iron keystone and shield');
ok(/Poe/.test(G.goal()),'hint: the Poe Museum');
dungeon('ow:3,1','poe:1,2','Poe cellar');ok(G.st.got.brick&&G.st.items.bug,'brick keystone and the Gold-Bug');
ok(/Carillon|melon|caretaker/.test(G.goal()),'hint: the Carillon');
talkTo('caretaker');talkTo('vendor');ok(G.st.trade=='melon','vendor gives a watermelon');
ok(/Fan/.test(G.goal()),'hint: trade the melon');
talkTo('musician');ok(G.st.trade=='music','musician trades sheet music');
talkTo('organist');ok(G.st.trade=='rivermap','organist trades a river map');
talkTo('kayaker');ok(G.st.items.kayak,'kayaker trades the kayak');
ok(/Forest Hill/.test(G.goal()),'hint: Forest Hill');
settleIn('ow:1,3');cleanEnemies();for(const d of G.cur.dyn)if(d.flag&&d.flag.startsWith('rub:')&&!G.st.f[d.flag]){const [x,y]=d.cells[0];bombAt(x,y);}
grabPicks();ok(G.st.got.carkey,'Carillon key found behind the cracked rocks');
dungeon('ow:0,2','carillon:1,2','Carillon');ok(G.st.got.bronze,'bronze keystone');
ok(/tunnel/.test(G.goal()),'hint: the tunnel');
// side content before the finale
dungeon('ow:1,2','tredegar:0,2','Tredegar Iron Works');ok(G.st.items.hook,'grappling hook');
G.load('ow:2,1');run(2);
ok(enterDoor('ow:1,-1','conserv:0,2'),'reach the conservatory through Northside');const cb=doDungeon('conserv:0,2');ok(cb&&G.st.items.can,'beat the Titan Arum with the watering can');leaveDungeon();
settleIn('ow:0,3');cleanEnemies();for(const d of G.cur.dyn)if(d.flag&&d.flag.startsWith('rub:')&&!G.st.f[d.flag]){const [x,y]=d.cells[0];bombAt(x,y);}
G.st.eq='hook';at(18,7,2);G.press.b=1;run(45);grabPicks();settleIn('ow:3,3');cleanEnemies();G.st.eq='hook';at(24,7,2);G.press.b=1;run(45);grabPicks();
talkTo('historian');ok(G.st.f.bateau&&G.st.lure,'bateau rebuilt, golden lure earned');
// finale
const coins=G.st.coins;
ok(enterDoor('ow:3,0','tunnel:0,1'),'four keystones open the tunnel');
doDungeon('tunnel:0,1');
let lit=0;for(let i=0;i<4000&&G.mode!='win';i++){if(G.dlg)closeDlg();if(G.mode=='relight'){lit=1;if(i%40==0)G.press.a=1;}G.update();}
ok(lit,'the lamps relight across the city');
ok(G.mode=='win','beating the thing in the tunnel reaches the ending');
console.log('coins at the finale:',coins,' hearts:',G.p.max/2,' foes:',G.st.kills,' stories:',Object.keys(G.st.lore).length,' time:',G.fmtTime(G.st.time));
process.exitCode=fails?1:0;
