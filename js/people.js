"use strict";
/* River City Quest: Neighborhood challenges, items, the shop and what everyone in town says. */
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
    case'bike':st.items.bike=1;st.eq='bike';ic=IC.bike;L=['You got a Bicycle!','Hop on with B. It\'s quick on paths and sidewalks.'];break;
    case'can':st.items.can=1;st.eq='can';ic=IC.can;L=['You got the Watering Can!','Use it with B on a dry sprout. Try the one by the sunken bed.'];break;
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
  if(ic)p.hold={ic,t:90};tune(BIGITEMS.has(code)?FANFARE:JING);needSave=true;return L;
}
const TALK={
  archivist(){
    if(!st.items.lantern)return[(st.name?st.name+'! Good, you came. ':'')+'Fog off the James, and the gas lamps dying block by block. Something woke under Church Hill.',
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
    if(st.pins.flies){say(['Nice glove work out there. Want to take some swings in the batting cage? Ten pitches.'],sel=>{if(sel==0)startMini('bat');},n.who,['Batter up!','No thanks']);return null;}
    return offer(n,['The Flying Squirrels play over at The Diamond. Best seats in town are out on the grass.']);},
  racer(n){say(['This is the Libby Hill soapbox derby! Steepest street in Church Hill.','Want to race my car down the hill? Beat '+fmtTime(MINI.derby.gold*60)+' for gold.'+(st.mini&&st.mini.derby?' Your best: '+fmtTime(st.mini.derby)+'.':'')],sel=>{if(sel==0)startMini('derby');},n.who,['Let\'s race!','Not now']);return null;},
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
  historian(){learn('ancarrow');
    if(st.f.bateau)return['The bateau is drying out by the ramp. Come see her launch some summer.','That golden lure brings the big ones up. Try it in the James at night.'];
    const n=['oar','pole','tiller'].filter(q=>st.got[q]).length;
    if(n==3){st.f.bateau=1;learn('bateau');st.lure=1;st.coins=Math.min(999,st.coins+50);needSave=true;p.hold={ic:IC.lure,t:90};tune(JING);
      return['The oar, the pole and the tiller! She\'ll float again.','Before railroads, bateaux like this one carried tobacco down the James. You\'ve helped save a piece of that.',
        'Take my Golden Lure and 50 coins. Fish bite faster for it, and sturgeon can\'t resist it.',...give('hc')];}
    return['Before railroads, long flat-bottomed bateaux carried tobacco and flour down the James.','I\'m rebuilding one, but the river scattered the parts: an oar, a pole and a tiller.',
      n?'You\'ve found '+n+' of 3. Keep looking!':'Try Pony Pasture, west of Forest Hill Park. And look out on the island off this landing.'];},
  naturalist(){
    if(st.f.frogsDone)return['The frog count is in the record books, thanks to you.','Come back on a rainy night. You never know what turns up.'];
    if(st.frogs>=5){st.f.frogsDone=1;st.coins=Math.min(999,st.coins+40);const got=awardCard('maymont',true);needSave=true;tune(JING);
      return['Five frogs! Wonderful. I\'ll count them and let them go by the lake.','Here are 40 coins for your trouble'+(got?', and a Maymont card for your collection.':'.')];}
    return['I\'m counting frogs for Maymont. They mostly come out when it rains, near the water.','Could you catch five for me? Just walk into them.'+(st.frogs?' You have '+st.frogs+' so far.':''),
      st.wx=='rain'?'It\'s raining right now. Go look!':'Wait for a rainy day, then check around the ponds and the river.'];},
  folk(n){n.li=(n.li||0)+1;const c=folkContext();if(c&&n.li%2==0)return[c];return[n.lines[(n.li-1)%n.lines.length]];},
  docent(){return['The eggs in these cases were made for the Russian royal family.','Read the plaque on each case. A Virginian collector left them to the museum.'];},
  shop(){shop={cur:0,msg:'What can I get you?',list:SHOP,title:'CARYTOWN GOODS',who:'Shopkeeper'};return null;},
  grocer(){shop={cur:0,msg:'Fresh from the farms!',list:MARKET,title:'17TH STREET MARKET',who:'Market Grocer'};return null;},
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
const BOSSTXT={arum:['The Titan Arum wilts with a sigh you can smell from across the room.','The vines slowly pull back into their beds.'],foreman:['The Iron Foreman grinds to a halt, steam hissing from every joint.','The furnaces gutter out. Tredegar is quiet again.'],turtle:['Old Snapper sinks back into the deep end of the quarry pond.','Something glints where it lay.'],
  wraith:['The wraith thins to mist and drifts up through the granite.','The pyramid falls quiet.'],
  raven:['The raven croaks one last word. You can guess which one.','It flaps off through a crack in the brick and is gone.'],
  bell:['The great bell cracks and settles on its beam.','From the top of the tower, the other bells start to ring.']};
const ING=(k,n)=>()=>{st.ingr=st.ingr||{};st.ingr[k]=(st.ingr[k]||0)+1;return'One '+n+'. You have '+st.ingr[k]+'.';};
const MARKET=[
  {name:'Picnic Basket',price:10,why:()=>st.items.basket?'SOLD OUT':'',buy(){st.items.basket=1;st.food=st.food||{};st.food.cupcake=(st.food.cupcake||0)+1;return'A basket, with a cupcake in it!';}},
  {name:'Cupcake',price:4,why:()=>!st.items.basket?'???':'',buy(){st.food=st.food||{};st.food.cupcake=(st.food.cupcake||0)+1;return'In the basket it goes.';}},
  {name:'Virginia Ham',price:3,why:()=>'',buy:ING('ham','Virginia ham')},
  {name:'Bag of Flour',price:2,why:()=>'',buy:ING('flour','bag of flour')},
  {name:'Bag of Sugar',price:2,why:()=>'',buy:ING('sugar','bag of sugar')},
];
const SHOP=[
  {name:'Camera',price:25,why:()=>st.items.camera?'SOLD OUT':'',buy(){st.items.camera=1;if(!st.eq)st.eq='camera';return'Snap landmarks to fill your album!';}},
  {name:'Braided Rug',price:15,why:()=>st.furn&&st.furn.rug?'SOLD OUT':'',buy(){(st.furn=st.furn||{}).rug=1;return'Delivered to your row house in the Fan.';}},
  {name:'Potted Fern',price:8,why:()=>st.furn&&st.furn.fern?'SOLD OUT':'',buy(){(st.furn=st.furn||{}).fern=1;return'Delivered to your row house in the Fan.';}},
  {name:'Fish Tank',price:30,why:()=>st.furn&&st.furn.tank?'SOLD OUT':'',buy(){(st.furn=st.furn||{}).tank=1;return'Delivered. Fish you catch will swim in it.';}},
  {name:'Upright Piano',price:40,why:()=>st.furn&&st.furn.piano?'SOLD OUT':'',buy(){(st.furn=st.furn||{}).piano=1;return'Delivered to your row house in the Fan.';}},
  {name:'Fishing Rod',price:30,why:()=>st.items.rod?'SOLD OUT':'',buy(){st.items.rod=1;if(!st.eq)st.eq='rod';return'A fine rod. Use it on B at the water.';}},
  {name:'Landmark Card Pack',price:20,why:()=>PACK.every(c=>st.cards[c])?'SOLD OUT':'',buy(){const c=PACK.filter(c=>!st.cards[c]),id=c[rnd(c.length)];awardCard(id,true);return'You got the '+CARDM[id].name+' card!';}},
  {name:'Big Satchel',price:60,why:()=>st.f.satchel?'SOLD OUT':'',buy(){st.f.satchel=1;st.cap.balls=Math.max(st.cap.balls,50);st.cap.powder=Math.max(st.cap.powder,16);}},
  {name:'Heart Charm',price:15,why:()=>st.got.hcShop?'SOLD OUT':'',buy(){st.got.hcShop=1;give('hc');}},
  {name:'Ginger Beer',price:5,why:()=>!st.items.bottle?'NO BOTTLE':st.bottle?'FULL':'',buy(){st.bottle=1;}},
  {name:'10 Baseballs',price:4,why:()=>!st.items.balls?'???':st.ammo.balls>=st.cap.balls?'FULL':'',buy(){st.ammo.balls=Math.min(st.cap.balls,st.ammo.balls+10);}},
  {name:'4 Powder Kegs',price:8,why:()=>!st.items.powder?'???':st.ammo.powder>=st.cap.powder?'FULL':'',buy(){st.ammo.powder=Math.min(st.cap.powder,st.ammo.powder+4);}}
];
