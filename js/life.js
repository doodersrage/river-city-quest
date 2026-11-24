"use strict";
/* River City Quest: everyday Richmond life. A shelter dog, the camera and photo album, your row house,
   the bike and the Capital Trail, food and cooking, and First Friday nights on Broad Street. */

/* ---------- placing extra townspeople without redrawing maps ---------- */
function openSpot(s,cx,cy){let best=null;for(let y=1;y<s.h-1;y++)for(let x=1;x<s.w-1;x++){const t=s.g0[y][x];if(SOLID.includes(t)||'DE~#'.includes(t))continue;
  if((s.npcs||[]).some(n=>Math.abs(n.tx-x)+Math.abs(n.ty-y)<2))continue;if([[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>!SOLID.includes(s.g0[y+b][x+a])).length<4)continue;
  const d=Math.abs(x-cx)+Math.abs(y-cy);if(!best||d<best[0])best=[d,x,y];}return best;}
function addNpc(id,def,cx,cy,extra){const s=SC[id],b=openSpot(s,cx,cy);if(!b)return null;const n=Object.assign({},def,{tx:b[1],ty:b[2],x:b[1]*TS+8,y:b[2]*TS+8,hx:b[1]*TS+8,hy:b[2]*TS+8,f:1,t:0,vx:0,vy:0},extra||{});(s.npcs=s.npcs||[]).push(n);return n;}
addNpc('ow:2,3',{who:'Shelter Volunteer',hat:C3('#e8d28a','#b09a54','#fff0b8'),shirt:C3('#58a850','#2f7a3c','#90d070'),talk:'shelter'},20,17);
addNpc('ow:3,2',{who:'Trail Cyclist',hat:C3('#3ac2e8','#1a8ab0','#8ae0f8'),shirt:C3('#f2c14e','#b88a20','#ffe08a'),talk:'cyclist'},20,10);
SC['rowhouse:0,0'].name='Your Row House';

/* ---------- the dog ---------- */
let dog=null;const DOGNAMES=['BISCUIT','JAMES','PEANUT','ROSIE'];
const DOGSPR=sp(["............","..kk.....kk.",".kUUk...kUUk",".kUuukkkkuuk",".kuuuuuuuuk.","..kueuuuek..","..kuuwwuuk..","...kuuuuk...","..kuuuuuuk..",".kuuuuuuuuk.",".kukk..kkuk.",".kk......kk."]);
function dogReset(){if(!st||!st.dog)return dog=null;dog={x:p.x-10,y:p.y+4,trail:[],t:0,cool:0,dig:0,bark:0,f:1,goal:null};}
function dogTick(){if(!dog)return;const d=dog;d.t++;if(d.cool>0)d.cool--;if(d.bark>0)d.bark--;
  d.trail.push([p.x,p.y]);if(d.trail.length>18)d.trail.shift();
  let tx=d.trail[0][0],ty=d.trail[0][1],sp=1.5;
  const sec=picks.find(k=>k.kind=='secret'&&Math.hypot(k.x-p.x,k.y-p.y)<90);
  const foe=enemies.find(e=>!e.boss&&!e.gone&&e.type!='ghost'&&Math.hypot(e.x-d.x,e.y-d.y)<56&&Math.hypot(e.x-p.x,e.y-p.y)<90);
  if(foe){tx=foe.x;ty=foe.y;sp=2;if(Math.hypot(foe.x-d.x,foe.y-d.y)<10&&d.cool<=0){d.cool=50;hitEnemy(foe,1,'dog',Math.sign(foe.x-d.x)*2,Math.sign(foe.y-d.y)*2);d.bark=20;sfx(700,.05,'square',.03);}}
  else if(sec){tx=sec.x;ty=sec.y+6;if(Math.hypot(sec.x-d.x,sec.y-d.y)<16&&d.t%50==0){d.bark=20;sfx(760,.05,'square',.03);sfx(680,.05,'square',.025);}}
  else if(d.dig>0){d.dig--;if(d.dig==0){const r=Math.random(),k=r<.65?'coin':r<.85?'heart':'tomato';picks.push({x:d.x,y:d.y+4,kind:k,life:600});burst(d.x,d.y+4,6,['#8a6a3a','#6a4a2a'],1.2,2);sfx(500,.08);}return;}
  else if(cur.ow&&d.t%2400==1200&&tileAt(d.x,d.y)=='.'&&Math.hypot(d.x-p.x,d.y-p.y)<40){d.dig=70;}
  const dx=tx-d.x,dy=ty-d.y,l=Math.hypot(dx,dy);if(l>(foe||sec?2:16)){const m=Math.min(sp*(l>60?1.8:1),l);d.x+=dx/l*m;d.y+=dy/l*m;if(Math.abs(dx)>.5)d.f=dx<0?-1:1;}
  if(l>220){d.x=p.x-10;d.y=p.y+4;}}
function drawDog(){if(!dog)return;const d=dog,mv=(d.t>>3)&1,x=Math.round(d.x),y=Math.round(d.y);shadow(x,y+4,4);
  g.drawImage(d.f<0?DOGSPR.l.c:DOGSPR.r.c,x-6,y-8-(d.dig>0?((d.t>>2)&1):mv));
  if(d.dig>0&&(d.t>>2)&1)R(x-4+((d.t>>1)&3),y+3,2,1,'#6a4a2a');
  if(d.bark>0){R(x-1,y-16,3,5,'#ffffff');R(x-1,y-10,3,2,'#ffffff');}}

/* ---------- camera and photo album ---------- */
const PHOTOCAP={grandstand:'The Diamond, home of the Flying Squirrels',store:'The old Broad Street department stores',shelter:'A bus shelter on Broad Street',hippodrome:'The Hippodrome on Second Street',
  church:'St. John\'s Church on Church Hill',vmfa:'The Virginia Museum of Fine Arts',byrd:'The Byrd Theatre in Carytown',capitol:'The Virginia State Capitol',belltower:'The old Capitol Square bell tower',
  station:'Main Street Station',market:'The 17th Street Market',carillon:'The Carillon in Byrd Park',mansion:'Maymont House',pyramid:'The granite pyramid in Hollywood Cemetery',
  birdcage:'President Monroe\'s tomb',ruins:'The power plant ruins on Belle Isle',steamboat:'A steamboat at Rocketts Landing',stonehouse:'Forest Hill\'s Stone House',trolley:'An old Forest Hill trolley'};
const PHOTOS=[];for(const id in SC){const s=SC[id];if(!s.ow)continue;for(const L of s.lm||[])if(PHOTOCAP[L.art]&&!PHOTOS.some(q=>q.art==L.art))PHOTOS.push({id,art:L.art,L});}
let flash=0;const thumbs={};
function snapPhoto(){flash=8;sfx(1600,.03,'square',.03);sfx(900,.06,'triangle',.03);
  const L=(cur.lm||[]).filter(L=>PHOTOCAP[L.art]).map(L=>[L,Math.hypot(L.x*TS+L.w*8-p.x,L.y*TS+L.h*8-p.y)]).sort((a,b)=>a[1]-b[1])[0];
  if(!L||L[1]>150){toast('Nice shot! Find a landmark to fill your album.');return;}
  st.photos=st.photos||{};const k=L[0].art,isNew=!st.photos[k];st.photos[k]={night:dark()>.5,wx:st.wxk>.5?st.wx:'clear',ssn:season()};needSave=true;
  toast((isNew?'New photo: ':'Retook: ')+PHOTOCAP[k]+' ('+Object.keys(st.photos).length+'/'+PHOTOS.length+')');delete thumbs[k];}
function thumbOf(ph){if(thumbs[ph.art])return thumbs[ph.art];const s=SC[ph.id],L=ph.L,w=L.w*TS+24,h=L.h*TS+20,c=mkCanvas(w,h),old=g;g=c.getContext('2d');
  R(0,0,w,h,'#58a848');for(let i=0;i<w*h/90;i++){const q=HH(i,ph.art.length,5);R(q%w,(q>>8)%h,2,1,'#68b854');}
  try{LMART[L.art](12,10,L.w*TS,L.h*TS,0,s,L);}catch(e){}
  const info=st.photos&&st.photos[ph.art];if(info&&info.night){g.globalAlpha=.45;R(0,0,w,h,'#0a0e2e');g.globalAlpha=1;}
  if(info&&info.wx=='snow'){for(let i=0;i<40;i++){const q=HH(i,9,9);R(q%w,(q>>8)%h,1,1,'#ffffff');}}if(info&&info.wx=='rain'){g.globalAlpha=.25;R(0,0,w,h,'#1c2440');g.globalAlpha=1;}
  g=old;thumbs[ph.art]=c;return c;}
function sharePhoto(ph){const t=thumbOf(ph),c=document.createElement('canvas');c.width=1200;c.height=900;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  x.fillStyle='#14102a';x.fillRect(0,0,1200,900);const sc=Math.min(1080/t.width,700/t.height);x.drawImage(t,600-t.width*sc/2,60,t.width*sc,t.height*sc);
  x.fillStyle='#fff2a8';x.textAlign='center';x.font='28px "Press Start 2P", monospace';x.fillText(PHOTOCAP[ph.art],600,820);x.fillStyle='#aeb7c2';x.font='16px "Press Start 2P", monospace';x.fillText('River City Quest',600,866);
  c.toBlob(async b=>{try{const file=new File([b],'rcq-photo.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text:PHOTOCAP[ph.art]});return;}}catch(e){if(e&&e.name=='AbortError')return;}
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='rcq-photo.png';document.body.appendChild(a);a.click();a.remove();},'image/png');}
function drawAlbum(m){const pc=m.pc||0,n=st.photos?Object.keys(st.photos).length:0;
  if(m.big!=null){const ph=PHOTOS[m.big],t=thumbOf(ph),sc=Math.min(232/t.width,120/t.height);R(8,24,W-16,150,'#080a18');g.drawImage(t,W/2-t.width*sc/2|0,30,t.width*sc|0,t.height*sc|0);
    text(PHOTOCAP[ph.art],W/2,156,'#fff2a8',6,'center','#080c28');text('A: share   B: back',W/2,FH-14,'#aeb7c2',6,'center');return;}
  text('Photos '+n+'/'+PHOTOS.length,W/2,25,'#fff2a8',8,'center','#080c28');
  PHOTOS.forEach((ph,i)=>{const x=8+(i%5)*49,y=36+(i/5|0)*30,own=st.photos&&st.photos[ph.art];R(x,y,45,27,i==pc?((frame>>4)&1?'#fff2a8':'#f2c14e'):'#080a18');
    if(own){const t=thumbOf(ph);g.drawImage(t,x+1,y+1,43,25);}else{R(x+1,y+1,43,25,'#1c2660');text('?',x+22,y+9,'#3a4a98',8,'center');}});
  const ph=PHOTOS[pc];text(st.photos&&st.photos[ph.art]?PHOTOCAP[ph.art]:'Not taken yet. Use the camera near it.',W/2,FH-24,'#ffffff',6,'center','#080c28');
  text(st.items.camera?'A: look   B: next tab':'Buy a camera at the Carytown shop',W/2,FH-14,'#aeb7c2',6,'center');}

/* ---------- home sweet home ---------- */
const HOME='rowhouse:0,0',FURN={rug:['Braided Rug',15],fern:['Potted Fern',8],piano:['Upright Piano',40],tank:['Fish Tank',30]};
const HSPOT={bed:[13,8],stove:[10,1],shelf:[4,2],table:[10,3],piano:[13,4],tank:[2,4],fern:[1,1],rug:[7,5]};
function drawHome(){if(curId!=HOME)return;const F=st.furn||{},X=k=>HSPOT[k][0]*TS,Y=k=>HSPOT[k][1]*TS;
  if(F.rug){R(X('rug')-24,Y('rug')-10,64,36,'#8a2a3a');R(X('rug')-20,Y('rug')-6,56,28,'#c8a060');R(X('rug')-16,Y('rug')-2,48,20,'#3a5a8a');}
  R(X('bed')-4,Y('bed')-6,24,28,'#1a1423');R(X('bed')-3,Y('bed')-5,22,26,'#e8e4dc');R(X('bed')-3,Y('bed')+5,22,16,'#3d63c8');R(X('bed'),Y('bed')-3,8,6,'#ffffff');
  R(X('stove'),Y('stove')+2,16,14,'#1a1423');R(X('stove')+1,Y('stove')+3,14,12,'#4a4a58');R(X('stove')+3,Y('stove')+4,4,2,'#e83048');R(X('stove')+9,Y('stove')+4,4,2,'#e83048');R(X('stove')+2,Y('stove')+9,12,5,'#2a2a34');
  const bosses=['quarry:1,0','pyramid:1,1','poe:1,0','carillon:1,0','tredegar:0,0','conserv:0,0','tunnel:0,0'];bosses.forEach((b,i)=>{if(st.f['boss:'+b]){const x=X('shelf')-12+i*7,y=Y('shelf')-2;R(x,y,5,7,'#f2c14e');R(x+1,y+1,3,2,'#fff2a8');R(x+1,y+7,3,1,'#b8860b');}});
  const nc=typeof nCards=='function'?nCards():0;for(let i=0;i<Math.min(nc,12);i++){const x=7*TS+(i%6)*12,y=2+(i/6|0)*7;R(x,y,10,6,'#c9a26b');R(x+1,y+1,8,4,CARDS[i]&&st.cards[CARDS[i].id]?CARDS[i].col:'#3a3446');}
  const np=st.photos?Object.keys(st.photos).length:0;for(let i=0;i<Math.min(np,6);i++)R(2*TS+i*9,2,8,6,i%2?'#e8dcb0':'#c8d8e8');
  if(F.piano){R(X('piano'),Y('piano'),26,16,'#1a1423');R(X('piano')+1,Y('piano')+1,24,10,'#3a2418');R(X('piano')+2,Y('piano')+11,22,3,'#ffffff');for(let i=4;i<24;i+=3)R(X('piano')+i,Y('piano')+11,1,2,'#1a1423');}
  if(F.tank){R(X('tank'),Y('tank'),26,14,'#1a1423');R(X('tank')+1,Y('tank')+1,24,12,'#3a7a86');R(X('tank')+1,Y('tank')+1,24,2,'#a8dce0');const fk=Object.keys(st.fish||{});
    fk.forEach((k,i)=>{const fx=X('tank')+3+((frame/3+i*17)%18),fy=Y('tank')+4+i*2;R(Math.round(fx),fy,3,2,['#f2c14e','#58a848','#8a8e9c','#e8e4dc','#5a6470'][i%5]);});}
  if(F.fern){R(X('fern')+4,Y('fern')+8,8,7,'#8a5a34');for(const [a,b] of [[2,2],[6,0],[10,2],[4,5],[9,5]])R(X('fern')+a,Y('fern')+b,4,4,'#3d8a3a');}}
const LETTERS=[['won','The Archivist','The journal you finished is in the Library of Virginia now. Your name is on the first page.'],
  ['boss:tredegar:0,0','The Historian','Heard you quieted Tredegar. The old ironworkers would have bought you a round.'],
  ['bateau','The River Historian','The bateau floated on her first try. Come see her on the James!'],['frogsDone','The Naturalist','Final frog count: 112. You found five of them. Thank you!'],
  ['derbyGold','The Derby Kid','Your gold time is still on the chalkboard on Libby Hill. Nobody has beaten it.'],['gallery','The Curator','The three paintings you found are hanging in our front window.']];
function homeInteract(){if(curId!=HOME)return false;const [fx,fy]=front(12),tx=fx/TS,ty=fy/TS,near=k=>Math.abs(tx-(HSPOT[k][0]+.5))<1.3&&Math.abs(ty-(HSPOT[k][1]+.5))<1.3;
  if(near('bed')){say(['Your own bed. Rest until...'],sel=>{if(sel==2)return;const want=sel==0?7:20,h=hour();let add=((want-h+24)%24)||24;st.clock+=Math.round(add/24*CYC);p.hp=p.max;tune([[392,.2],[330,.2],[262,.4]],'triangle');toast('You wake up rested. Hearts refilled.');needSave=true;},'Bed',['Morning','Evening','Not now']);return true;}
  if(near('stove')){cookMenu();return true;}
  if(near('table')){const got=LETTERS.filter(l=>st.f[l[0]]);say(got.length?got.map(l=>'From '+l[1]+': "'+l[2]+'"'):['No mail yet. Help people around town and they\'ll write.'],null,'Mail');return true;}
  if(near('shelf')){const n=['quarry:1,0','pyramid:1,1','poe:1,0','carillon:1,0','tredegar:0,0','conserv:0,0','tunnel:0,0'].filter(b=>st.f['boss:'+b]).length;say([n?'Your trophy shelf holds '+n+' of 7 boss trophies.':'An empty shelf, waiting for trophies.','Cards on the wall: '+nCards()+'. Photos: '+(st.photos?Object.keys(st.photos).length:0)+'.'],null,'Trophy Shelf');return true;}
  if(near('piano')&&st.furn&&st.furn.piano){tune([[523,.15],[659,.15],[784,.15],[1047,.3],[880,.15],[784,.3]],'triangle');toast('You play a little tune.');return true;}
  return false;}

/* ---------- food and cooking ---------- */
const FOODS={cupcake:['Carytown Cupcake',2,'Heals one heart and puts a spring in your step.'],biscuit:['Ham Biscuit',6,'Heals three hearts.'],stew:['Brunswick Stew',99,'Heals every heart and toughens you up for a while.']};
const RECIPES=[['biscuit',{ham:1,flour:1}],['stew',{tomato:1,ham:1}],['cupcake',{flour:1,sugar:1}]];
function cookMenu(){st.food=st.food||{};st.ingr=st.ingr||{};const I=st.ingr,can=RECIPES.filter(([,r])=>Object.entries(r).every(([k,n])=>(I[k]||0)>=n));
  const have='You have: ham '+(I.ham||0)+', flour '+(I.flour||0)+', sugar '+(I.sugar||0)+', tomatoes '+(I.tomato||0)+'.';
  if(!can.length){say(['The stove is warm. '+have,'Recipes: ham + flour = Ham Biscuit. Tomato + ham = Brunswick Stew. Flour + sugar = Cupcake.'],null,'Stove');return;}
  say(['What should you cook? '+have],sel=>{const c=can[sel];if(!c)return;for(const [k,n] of Object.entries(c[1]))I[k]-=n;st.food[c[0]]=(st.food[c[0]]||0)+1;(st.f.cooked=st.f.cooked||{})[c[0]]=1;tune([[659,.08],[784,.08],[988,.16]],'triangle');toast('You cooked a '+FOODS[c[0]][0]+'!');needSave=true;},'Stove',can.map(c=>FOODS[c[0]][0]).concat(['Nothing']));}
let warm=0,zoom=0;
function eatMenu(){st.food=st.food||{};const have=Object.keys(FOODS).filter(k=>st.food[k]>0);
  if(!have.length){toast('The basket is empty. Buy food in Carytown or cook at home.');sfx(150,.06);return;}
  say(['Your picnic basket: '+have.map(k=>FOODS[k][0]+' x'+st.food[k]).join(', ')+'.'],sel=>{const k=have[sel];if(!k)return;st.food[k]--;p.hp=Math.min(p.max,p.hp+FOODS[k][1]);
    if(k=='stew')warm=1800;if(k=='cupcake')zoom=600;tune([[523,.08],[659,.08],[784,.15]],'triangle');burst(p.x,p.y-8,10,['#f8a030','#ffffff'],1.2,2);toast('Mmm. '+FOODS[k][0]+'!');needSave=true;},'Picnic Basket',have.map(k=>FOODS[k][0]).concat(['Not now']));}
const GARDENS=['ow:0,2','ow:0,-1','ow:4,0','ow:1,-1','ow:3,1'];
function spawnTomatoes(){if(!cur.ow||!GARDENS.includes(curId))return;const day=Math.floor(st.clock/CYC),key='tom:'+curId+':'+day;if(st.f[key])return;
  const cells=[];cur.g.forEach((r,y)=>r.forEach((c,x)=>{if(c==','||(curId=='ow:3,1'&&c=='p'&&HH(x,y,3)%9==0))cells.push([x,y]);}));if(!cells.length)return;
  const [x,y]=cells[HH(day,curId.length,7)%cells.length];picks.push({x:x*TS+8,y:y*TS+8,kind:'tomato',life:1e9,day:key});}

/* ---------- the bike ---------- */
function bikeSpeed(){if(!st.riding)return 0;const t=tileAt(p.x,p.y);return'psn=-|'.includes(t)?2.3:1.8;}
function drawBike(){if(!st.riding)return;const x=Math.round(p.x),y=Math.round(p.y),side=p.dir==1||p.dir==3,sp=(frame>>2)&1;
  if(side){R(x-8,y+1,6,6,'#1a1423');R(x+2,y+1,6,6,'#1a1423');R(x-7,y+2,4,4,sp?'#8e909c':'#5c5e6a');R(x+3,y+2,4,4,sp?'#5c5e6a':'#8e909c');R(x-4,y,8,2,'#e83048');}
  else{R(x-2,y-2,4,10,'#1a1423');R(x-1,y-1,2,8,'#8e909c');R(x-4,y+3,8,2,'#e83048');}}

/* ---------- First Friday on Broad Street ---------- */
const WEEK=['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
const weekday=()=>Math.floor((st?st.clock:0)/CYC)%7;
function firstFriday(){return weekday()==4&&dark()>.4;}
let ffNpcs=[];
function fridayOnLoad(){const s=cur;s.npcs=(s.npcs||[]).filter(n=>!n.ff);ffNpcs=[];
  if(!s.ow||!firstFriday()||!(curId=='ow:1,0'||curId=='ow:2,0'))return;
  const mk2=(who,talk,lines,c)=>{const n=addNpc(curId,{who,hat:FOLKC[c][0],shirt:FOLKC[c][1],talk,lines,wander:talk=='folk'},rnd(s.w),rnd(s.h),{ff:1});if(n){n.spr=npcSpr(n);ffNpcs.push(n);}};
  if(curId=='ow:1,0'){mk2('Curator','curator',[],3);mk2('Gallery Goer','folk',['First Friday! Every gallery on Broad Street stays open late.','Have you seen the new show? It\'s all paintings of the James.'],1);mk2('Street Musician','folk',['Got any requests? I know every song about Richmond. All three of them.'],5);}
  else mk2('Gallery Goer','folk',['The art walk spills over into Jackson Ward, too.'],2);
  if(!st.f.gallery&&st.f.galleryAsk)for(const k of ['p1','p2','p3'])if(!st.got['paint:'+k]){const n=openSpot(s,rnd(s.w),rnd(s.h));if(n&&(k!='p3'||curId=='ow:2,0')&&(k=='p3'||curId=='ow:1,0'))picks.push({x:n[1]*TS+8,y:n[2]*TS+8,kind:'painting',id:'paint:'+k,life:1e9});}
  toast('First Friday! Galleries open late.');}
function fridayDecor(){if(!firstFriday()||!(curId=='ow:1,0'||curId=='ow:2,0'))return;if(frame%30==0)parts.push({x:cam.x+20+Math.random()*(W-40),y:cam.y+30+Math.random()*60,vx:(Math.random()-.5)*.2,vy:-.2,life:90,max:90,c:['#f8e060','#f890a0','#8ae0f8'][rnd(3)],s:2});}

/* ---------- the new townspeople ---------- */
TALK.shelter=n=>{if(st.dog)return['How\'s '+st.dog.name+' doing? Dogs love the parks along the river.'];
  say(['This pup has been waiting for a home for weeks. Would you like to adopt?'],sel=>{if(sel==4)return;st.dog={name:DOGNAMES[sel]};dogReset();tune(FANFARE);needSave=true;
    say([st.dog.name+' is yours! '+st.dog.name+' will follow you, sniff out hidden stashes, chase small pests and dig up treats now and then.'],null,n.who);},n.who,DOGNAMES.concat(['Not today']));return null;};
TALK.cyclist=n=>{if(!st.items.bike){const L=give('bike');return['The Virginia Capital Trail starts right here and runs all the way to Jamestown.','I just got a new bike. Take my old one!',...L];}
  say(['Want to ride the Capital Trail time trial? Beat '+fmtTime(MINI.trail.gold*60)+' for gold.'+(st.mini&&st.mini.trail?' Your best: '+fmtTime(st.mini.trail)+'.':'')],sel=>{if(sel==0)startMini('trail');},n.who,['Let\'s ride!','Not now']);return null;};
TALK.curator=n=>{const got=['p1','p2','p3'].filter(k=>st.got['paint:'+k]).length;
  if(st.f.gallery)return['Welcome back! Those three paintings are the talk of the art walk.'];
  if(got>=3){st.f.gallery=1;st.coins=Math.min(999,st.coins+50);tune(JING);needSave=true;return['You found all three! I can hang the show tonight after all.','Please, take 50 coins. And come back next First Friday.'];}
  if(!st.f.galleryAsk){st.f.galleryAsk=1;needSave=true;for(const k of ['p1','p2'])if(!st.got['paint:'+k]){const b=openSpot(cur,rnd(cur.w),rnd(cur.h));if(b)picks.push({x:b[1]*TS+8,y:b[2]*TS+8,kind:'painting',id:'paint:'+k,life:1e9});}}
  return['Disaster! Three paintings for tonight\'s show went missing on the way over.','Two must be somewhere on Broad Street, and one blew over to Jackson Ward. Find them before the night is over?'+(got?' You have '+got+' of 3.':'')];};
