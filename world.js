"use strict";
/* River City Quest: world data. Maps, rooms, dungeon links and the Richmond journal. */
const TS=16,COLS=16,ROWS=11;

/* ---------- Richmond lore: the journal ---------- */
const LORE=[
['names',`Named for a View`,`Richmond was laid out in 1737. The story goes that William Byrd II looked out from Church Hill at the bend in the James and thought of the view of the Thames from Richmond Hill in England, so he named the town Richmond.`],
['stjohns',`St. John's Church`,`In March 1775 the Second Virginia Convention met inside this white wooden church. Patrick Henry ended his speech here with "Give me liberty, or give me death!" Reenactors still perform it in the church.`],
['eliza',`Eliza Poe's Grave`,`Edgar Allan Poe's mother, the actress Eliza Poe, died in Richmond in December 1811, when Edgar was two. She is buried here in St. John's churchyard.`],
['tunnel',`The Church Hill Tunnel`,`On October 2, 1925, the railroad tunnel under Church Hill caved in on a work train. Engineer Thomas Mason died at the controls. Fireman Benjamin Mosby crawled out badly scalded and died hours later. Laborers Richard Lewis and H. Smith were never found. Engine 231 and ten flat cars are still sealed inside.`],
['vampire',`The Richmond Vampire`,`A legend grew out of the collapse: a pale, bloody figure crawled from the tunnel and fled to a tomb in Hollywood Cemetery. The real story is sadder. The figure people remembered was most likely fireman Benjamin Mosby, burned by steam from the boiler.`],
['capitol',`A Temple for a Capitol`,`Thomas Jefferson modeled the Virginia State Capitol on the Maison Carree, an ancient Roman temple in Nimes, France. The legislature first met in it in 1788.`],
['capital1780',`Capital Since 1780`,`Virginia's government moved here from Williamsburg in 1780. Richmond was closer to the middle of the state and farther from British ships along the coast.`],
['houdon',`Houdon's Washington`,`The marble George Washington in the rotunda is by the French sculptor Jean-Antoine Houdon. He made a life mask of Washington at Mount Vernon in 1785, and many call this the truest likeness of him.`],
['civilrights',`Civil Rights Memorial`,`Unveiled in 2008, this memorial honors 16-year-old Barbara Johns and her classmates at Moton High School in Farmville, who walked out in 1951 to protest their run-down school. Their case became part of Brown v. Board of Education.`],
['jward',`Harlem of the South`,`In the early 1900s Jackson Ward was a center of Black business and culture, full of banks, insurance companies, churches and theaters. Second Street, called the Deuce, drew touring jazz stars to its clubs.`],
['walker',`St. Luke Penny Savings`,`Maggie L. Walker opened the St. Luke Penny Savings Bank in Jackson Ward in 1903, becoming the first woman to charter a bank in the United States. She urged neighbors to save even pennies to buy homes and start businesses.`],
['bojangles',`Bojangles' Traffic Light`,`Tap dancer Bill "Bojangles" Robinson was born in Jackson Ward in 1878. In 1933 he saw children struggling to cross Leigh Street at Adams and paid for a traffic light there himself. A statue of him, mid-dance, has stood beside it since 1973.`],
['streetcar',`First Electric Streetcars`,`In 1888 Frank Sprague's electric streetcars began running in Richmond, the first large electric street railway in the world that really worked. Cities across the country soon copied it.`],
['broad',`Department Store Row`,`For most of the 1900s, Miller & Rhoads and Thalhimers faced each other on Broad Street. Families came downtown to shop, eat in the Miller & Rhoads Tea Room and visit its famous Santa.`],
['scotts',`Scott's Addition`,`This old district of factories and warehouses became Richmond's brewery and cidery row in the 2010s. The Diamond, home of the city's minor league baseball, sits at its edge.`],
['diamond',`Baseball on the Boulevard`,`Richmond's minor league teams have played at The Diamond since 1985. Today's team, the Flying Squirrels, is named for a little animal that glides between trees.`],
['carytown',`Carytown`,`Carytown is a long stretch of West Cary Street packed with small shops and restaurants. Every summer it fills up for a giant watermelon festival.`],
['byrd',`The Byrd Theatre`,`The Byrd opened in 1928 and still shows movies under its huge crystal chandelier. On Saturday nights an organist rises out of the pit playing the Mighty Wurlitzer before the show.`],
['faberge',`Imperial Easter Eggs`,`In 1947 Lillian Thomas Pratt left her collection of Russian treasures to the Virginia Museum of Fine Arts. It includes five jeweled Imperial Easter Eggs made by the House of Faberge for the Russian royal family, the largest public group of them outside Russia.`],
['fan',`Why It's Called the Fan`,`The streets here spread west from Monroe Park like the ribs of a folding fan. Its blocks of row houses are often called the largest intact Victorian neighborhood in the country.`],
['ashe',`Arthur Ashe`,`Arthur Ashe was born in Richmond in 1943 and learned tennis at the park where his father was caretaker. In 1975 he became the first Black man to win Wimbledon. His statue went up on Monument Avenue in 1996.`],
['k10',`Monument Avenue 10K`,`Every spring, tens of thousands of runners crowd Monument Avenue for the Monument Avenue 10K, one of the largest 10K races in the country.`],
['carillon',`The Carillon`,`This 240-foot bell tower in Byrd Park is Virginia's memorial to World War I. It was dedicated on October 15, 1932, to honor the roughly 3,700 Virginians who died in the war. Its bells were cast in England.`],
['maymont',`Maymont`,`James and Sallie Dooley built this Gilded Age estate in the 1890s. When Sallie died in 1925 she left it to the city. It became a public park with Japanese and Italian gardens and native wildlife.`],
['hollywood',`Hollywood Cemetery`,`Named for the holly trees on its hills, Hollywood Cemetery opened in 1849. Presidents James Monroe and John Tyler are buried here. Monroe's tomb sits inside a Gothic cast-iron cage people call the birdcage.`],
['pyramid',`The Granite Pyramid`,`This 90-foot pyramid was raised in 1869 as a memorial to the Confederate soldiers buried in the cemetery. Its James River granite blocks were stacked without any mortar.`],
['irondog',`The Iron Dog`,`A cast-iron Newfoundland dog guards the grave of Florence Rees, who died of scarlet fever in 1862 at age two. The best-known story says the dog was moved here so it would not be melted down for bullets during the Civil War.`],
['falls',`The Falls of the James`,`Richmond sits on the fall line, where the James tumbles over rocks before it becomes a tidal river. English explorers led by Christopher Newport reached these falls in 1607, near a town of the Powhatan people.`],
['belleisle',`Belle Isle`,`Over the years this island has been a fishery, a granite quarry, a Civil War prison camp for captured Union soldiers, a nail factory and a power plant. Today it is a park, reached by a footbridge hung under a highway bridge.`],
['quarry',`The Quarry Pond`,`Quarrymen blasted Belle Isle's granite loose with black powder and cut it into blocks for buildings across Richmond. When the digging stopped, the pit filled with water and became a pond.`],
['tredegar',`Tredegar Iron Works`,`Across the canal from Belle Isle, Tredegar Iron Works cast cannon, rails and locomotives. Its old buildings now house the American Civil War Museum.`],
['rocketts',`Rocketts Landing`,`For two centuries Rocketts was Richmond's port, as far up the James as ships could sail. On April 4, 1865, Abraham Lincoln stepped ashore here and walked into the city.`],
['trail',`Virginia Capital Trail`,`This paved trail runs about 52 miles along the James from Richmond to Jamestown, linking Virginia's capital today with its first one.`],
['shockoe',`Shockoe Bottom`,`Richmond's oldest business district grew up along Shockoe Creek. Main Street Station, with its tall clock tower, opened here in 1901.`],
['slavetrail',`The Richmond Slave Trail`,`Before the Civil War, Shockoe Bottom held one of the largest slave markets in the United States. Lumpkin's Jail stood a few blocks from here. The Richmond Slave Trail marks the route enslaved people were forced to walk, so that they are remembered.`],
['stonehouse',`The Old Stone House`,`The Poe Museum's Old Stone House dates to the mid-1700s and is the oldest house still standing in Richmond. In 1824 a 15-year-old Edgar Allan Poe stood in an honor guard outside it when Lafayette came to visit.`],
['poe',`Poe in Richmond`,`Edgar Allan Poe grew up in Richmond and later edited the Southern Literary Messenger here. As a teenager he swam about six miles of the James against the tide, a feat he was proud of all his life.`],
['goldbugtale',`The Gold-Bug`,`Poe's 1843 story "The Gold-Bug" follows a man who cracks a secret code to find Captain Kidd's buried treasure. It was one of his most popular stories while he was alive.`],
['foresthill',`Forest Hill Park`,`Holden Rhodes built the granite Stone House here in the 1830s. In 1890 a trolley company turned the grounds into an amusement park with a carousel, a roller coaster and a penny arcade inside the house. The rides came down in 1932, and the city bought the land in 1934.`],
['manchester',`Manchester`,`Manchester began as a town on the south bank in 1769 and became its own city in 1874. In 1910 it joined Richmond, and part of the deal was a new bridge across the James.`],
['mayo',`Mayo's Bridge`,`John Mayo Jr. opened a toll bridge here in 1788, and floods carried it away again and again. The concrete bridge standing today went up after Manchester joined Richmond, and it is the city's oldest highway bridge over the James.`],
];
const LOREM={};LORE.forEach(([id,t,s])=>LOREM[id]={t,s});
const READX={'!engine':['C&O Engine 231','It sits right where the hill buried it in 1925, rusted and silent.'],
  '!organ':['The Mighty Wurlitzer','You press a key. The whole theatre hums.'],
  '!carousel':['Carousel Horse','A painted wooden horse from the old amusement park, its paint long faded.']};

/* ---------- builders ---------- */
const SC={},LINKS=[];let seedN=1;
const BRICK=['#a85040','#7a3428','#c46a58'],BRICK2=['#94483a','#6a2e24','#b06254'],STEEL=['#7a8494','#565e6c','#98a2b2'],CREAM=['#e4d8bc','#b4a684','#fbf0d8'],STONE=['#9a9aa0','#6a6a74','#bcbcc4'];
const AST={
  quarry:{fl:['#5a5e68','#444852','#727682'],wl:['#7a7e8a','#4e525c','#a0a4b0']},
  pyramid:{fl:['#6e6a72','#55515a','#86828a'],wl:['#9a968c','#6a665e','#c2beb2']},
  poe:{wood:true,fl:['#6a4a34','#4e3424','#82603f'],wl:['#8a4a3c','#5e2e24','#a8685a']},
  tunnel:{fl:['#4a4038','#342c26','#5e5248'],wl:['#6a4034','#44261e','#865448']},
  carillon:{fl:['#7a6a5a','#5e5044','#948270'],wl:['#a87a5a','#7a5238','#c89a78']},
  cave:{fl:['#5a4e44','#423830','#6e6256'],wl:['#6e5a4a','#4a3a2e','#8a7462']},
  bank:{lit:true,wood:true,fl:['#8a5a34','#6a4224','#a8744a'],wl:['#c8b48c','#8a7a5a','#e4d4b0']},
  byrd:{lit:true,fl:['#7a1c2c','#5a1020','#94303e'],wl:['#8a6a3a','#5e4420','#b08a52']},
  capitol:{lit:true,fl:['#d4d0c4','#b0aca0','#ece8dc'],wl:['#e4e0d4','#a8a498','#ffffff']},
  vmfa:{lit:true,fl:['#2a2a3a','#1e1e2c','#3a3a4e'],wl:['#d8d4cc','#a8a49c','#f4f0e8']}
};
const AREAN={ow:'Richmond',quarry:'Belle Isle Quarry',pyramid:'The Pyramid',poe:'Poe Museum Cellar',tunnel:'Church Hill Tunnel',carillon:'The Carillon'};
const C3=(a,b,c)=>[a,b,c];
function def(id,o){const [a,c]=id.split(':'),[x,y]=c.split(',').map(Number);
  Object.assign(o,{id,area:a,ax:x,ay:y,seed:seedN++});o.en=o.en||[];o.dyn=o.dyn||[];o.reads=o.reads||{};o.feats=o.feats||[];o.items=o.items||[];SC[id]=o;return o;}
function ow(x,y,name,o){def('ow:'+x+','+y,Object.assign({name,ow:true},o));}
function room(area,x,y,name,o){def(area+':'+x+','+y,Object.assign({name,base:'F',border:'W',interior:true},AST[o.style||area],o));}
function link(area,a,dir,b,type){LINKS.push({a:area+':'+a,b:area+':'+b,dir,type});}
/* map rows are run-length tokens: "B14" = 14 B tiles, anything else is literal.
   Placeholders: @ person, ! enemy, * heart piece, & quest item, v cracked rock, % rubble over a door */
function rle(r){return r.split(' ').filter(Boolean).map(t=>{const m=/^(\D)(\d+)$/.exec(t);return m?m[1].repeat(+m[2]):t;}).join('');}

/* ---------- the city: 14 neighborhoods, each a 2x2-screen scrolling map ---------- */
const NPC={
  brewer:{who:'Brewer',hat:C3('#2e9d6b','#1c6c48','#58c890'),shirt:C3('#c9a26b','#96743f','#e4c48f'),talk:'brewer'},
  ballplayer:{who:'Ballplayer',hat:C3('#e83048','#a01c30','#f890a0'),shirt:C3('#f4f4f8','#b8bccc','#ffffff'),talk:'ballplayer'},
  musician:{who:'Musician',hat:C3('#8a4fb0','#5c3080','#b07cd8'),shirt:C3('#f2c14e','#b88a20','#ffe08a'),talk:'musician'},
  henry:{who:'Reenactor',hat:C3('#2a2a34','#14141c','#4a4a58'),shirt:C3('#6a3a2a','#4a2418','#8a5a44'),talk:'henry'},
  shop:{who:'Shopkeeper',hat:C3('#d94f70','#a02c4c','#f488a4'),shirt:C3('#34c8b0','#1c8a7a','#74e4d0'),talk:'shop'},
  vendor:{who:'Melon Vendor',hat:C3('#2e9d6b','#1c6c48','#58c890'),shirt:C3('#e83048','#a01c30','#f890a0'),talk:'vendor'},
  runner:{who:'Runner',hat:C3('#f2c14e','#b88a20','#ffe08a'),shirt:C3('#e83048','#a01c30','#f890a0'),talk:'runner'},
  archivist:{who:'Archivist',hat:C3('#6a7088','#464a60','#9096ac'),shirt:C3('#8a5a2b','#5e3a18','#b07c48'),talk:'archivist'},
  caretaker:{who:'Carillon Caretaker',hat:C3('#5a4a8a','#3a2e60','#8a7ab8'),shirt:C3('#c08840','#7a5420','#e8b070'),talk:'caretaker'},
  keeper:{who:'Cemetery Keeper',hat:C3('#4d5e3a','#34402a','#74885c'),shirt:C3('#6b7a4a','#4a5632','#909e6e'),talk:'keeper'},
  kayaker:{who:'Kayaker',hat:C3('#e8d28a','#b09a54','#fff0b8'),shirt:C3('#d8692a','#a04414','#f09458'),talk:'kayaker'},
  ranger:{who:'Park Ranger',hat:C3('#6a5a2a','#4a3e18','#9a8a50'),shirt:C3('#4a6a3a','#2e4624','#6a9058'),talk:'ranger'},
  painter:{who:'Mural Painter',hat:C3('#3ac2e8','#1a8ab0','#8ae0f8'),shirt:C3('#f08030','#b85a18','#ffb868'),talk:'painter'}
};
const N=k=>Object.assign({},NPC[k]);

ow(0,0,"Scott's Addition",{base:'p',pal:[STEEL,BRICK,STEEL,BRICK2],rows:[
'B32','B f12 p6 B13','B f ....nn.... f p6 B13','B f ...n..n... f p6 B13','B f ..n....n.. f p6 B13','B f ...n..n... f p6 s12 B',
'B f ....nn.... p7 s6 @ s5 B','B f .10 f @ p5 s6 M s5 B','B f12 p6 s12 B','B p31','B p6 ! p17 ! p6','B p31','B p31','B s13 p4 s13 B',
'B B5 s B6 s p4 s b12 B','B B5 s B6 s p4 s b .10 b B','B B5 s B6 s p4 s b ...,,.!... b B','B B5 s B6 s p4 s b .,,....,,. b B',
'B s13 p4 s b ....bbb... b B','B s13 p4 s b ....b*b... b B','B s13 p4 s b12 B','B14 p4 B14'],
  npcs:[N('brewer'),N('ballplayer')],enT:['rat','scooter','rat'],readsL:['scotts']});
ow(1,0,"Broad Street",{base:'p',pal:[BRICK,CREAM,['#8a8e9c','#62667a','#a8acba']],rows:[
'B32','B14 s4 B14','B14 s ! s2 B14','B14 s4 B14','B14 s b2 s B14','B14 s4 B14','B14 s4 B14','B s13 M s16 B','B s30 B',
'p32','K32','p6 ! p17 ! p7','p32','B s14 M s15 B','B s30 B',
'B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B','B s13 p4 s13 B','B14 p4 B14'],
  enT:['rat','scooter','scooter'],readsL:['broad','streetcar']});
ow(2,0,"Jackson Ward",{base:'p',pal:[BRICK,BRICK2],rows:[
'B32','B9 s11 B12','B9 s11 B12','B9 s3 @ s7 B12','B5 D B3 s11 B12','B s8 M s21 B','B s30 B','B s20 Q s9 B','B s19 Y s10 B',
'p32','p5 ! p20 ! p5','p32','p32','B s13 p4 s13 B',
'B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B',
'B s13 p4 s13 B','B s3 b3 s7 p4 s7 ! s5 B','B s13 p4 s13 B','B14 p4 B14'],
  npcs:[N('musician')],enT:['rat','scooter','rat'],readsL:['jward','bojangles','bojangles'],doorsL:[{to:'bank:0,0'}]});
ow(3,0,"Church Hill",{base:'.',rows:[
'T32','T r8 .14 T9','T r8 .8 C5 .9 T','T r % r D r4 .8 C5 .9 T','T .3 k .5 M .6 C5 .3 @ .5 T','T .3 k .12 C5 .9 T','T .3 k .26 T',
'T .3 k .11 x . x . x . ! .8 T','T .15 x . x . x .10 T','.31 T','. ! .29 T','.31 T','.31 T','T .30 T',
'T .4 ,4 .5 T2 .15 T','T .13 T2 .4 b6 .5 T','T .19 b.*..b .5 T','T .5 ! .13 b6 .5 T','T .25 M .4 T','T .30 T','T .30 T','T14 .4 T14'],
  npcs:[N('henry')],enT:['bat','bat','bat'],readsL:['tunnel','names'],readsAt:{'18,7':'eliza'},readsT:{C:'stjohns'},
  doorsL:[{to:'libby:0,0'},{to:'tunnel:0,1',need:'keystones'}]});
ow(0,1,"Carytown",{base:'s',awn:true,pal:[['#d8a048','#a87428','#f0c070'],['#5aa8a0','#3a7c76','#80c8c0'],['#d87878','#a84c4c','#f0a0a0'],BRICK],rows:[
'B14 p4 B14','B . C10 .. p4 B14','B . C10 .. p4 B14','B . C10 .. p4 B14','B . C10 .. p4 B14','B . C10 .. p4 s13 B','B . C4 D C5 .. p4 s13 B',
'B .4 ,4 .5 p4 s13 B','B s13 p4 s13 B','B p31','B p4 ! p26','B p31','B p31','B s13 p4 s13 B',
'B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B4 D B7 B','B s3 @ s9 p4 s7 @ s5 B','B s5 M s7 p4 s6 ! s6 B','B s13 p4 s13 B','B s2 ! s10 p4 s13 B','B14 p4 B14'],
  npcs:[N('shop'),N('vendor')],enT:['scooter','scooter','rat'],readsL:['carytown'],doorsL:[{to:'vmfa:0,0'},{to:'byrd:0,0'}]});
ow(1,1,"The Fan",{base:'.',pal:[CREAM,['#9ab8a0','#6c8c74','#bcd8c2'],BRICK,['#8aa0c8','#5e749c','#aec2e4']],rows:[
'B14 p4 B14','B s13 p4 s13 B','B s B5 s B5 s p4 s B5 s B5 s B','B s B5 s B5 s p4 s B5 s B5 s B','B s B5 s B5 s p4 s B5 s B5 s B',
'B s4 M s8 p4 s13 B','B .3 ! .9 p4 .8 @ .4 B','B s13 p4 s13 B','B s13 p4 s13 B',
'p32','.6 , Y , .5 p4 .14','.14 p4 .5 ! .8','p32','B s13 p4 s13 B',
'B s B5 s B5 s p4 s B5 s B5 s B','B s B5 s B5 s p4 s B5 s B5 s B','B s B5 s B5 s p4 s B5 s B5 s B',
'B s13 p4 s13 B','B .3 ! .9 p4 . b7 .5 B','B .13 p4 . b ..*.. b .5 B','B .13 p4 . b7 .5 B','B14 p4 B14'],
  npcs:[N('runner')],enT:['squirrel','squirrel','rat'],readsL:['fan','ashe']});
ow(2,1,"Capitol Square",{base:'.',rows:[
'f14 p4 f14','f .13 p4 .13 f','f . T .2 B2 .7 p4 .2 C8 .3 f','f .4 B2 .7 p4 .2 C8 .3 f','f .4 B2 .7 p4 .2 C8 .3 f','f .13 p4 .2 C8 .3 f',
'f .13 p4 .2 C3 D C4 .3 f','f .6 @ .6 p4 .4 M .8 f','f .13 p4 .13 f','p32','p32','p32','p32','f .13 p4 .13 f',
'f . T .3 w4 .4 p4 .3 ,4 .6 f','f .5 w4 .4 p4 .3 ,4 . Y .4 f','f .5 w4 .4 p4 .13 f','f .13 p4 .9 T .3 f','f .2 T .10 p4 .13 f',
'f .13 p4 .13 f','f .13 p4 .13 f','f14 p4 f14'],
  npcs:[N('archivist')],enT:[],readsL:['capitol','civilrights'],doorsL:[{to:'capitol:0,0'}]});
ow(3,1,"Shockoe Bottom",{base:'p',pal:[BRICK2,STONE],rows:[
'B14 p4 B14','B s13 p4 s B12 B','B s13 p4 s B12 B','B s4 B5 s4 p4 s B12 B','B s4 B5 s4 p4 s B12 B','B s4 B5 s4 p4 s B12 B',
'B s13 p4 s2 M s10 B','B K30 B','B s13 p4 s13 B','p31 B','p6 ! p17 ! p6 B','p31 B','p31 B','B s13 p4 s3 M s9 B','B s13 p4 s13 B',
'B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B11 s B','B s2 B2 D B3 s5 p4 s B11 s B','B s7 M s5 p4 s4 ! s8 B','B s13 p4 s13 B','B s13 p4 s13 B','B14 p4 B14'],
  enT:['rat','rat','rat'],readsL:['shockoe','slavetrail','stonehouse'],doorsL:[{to:'poe:1,2'}]});
ow(0,2,"Byrd Park & Maymont",{base:'.',pal:[BRICK,CREAM],rows:[
'T14 .4 T14','T .30 T','T .2 B4 .12 w9 .3 T','T .2 B4 .11 w11 .2 T','T .2 B4 .4 @ .6 w4 .*. w4 .2 T','T .2 B4 .11 w11 .2 T','T .2 B4 .12 w9 .3 T',
'T .2 B D B2 . M .9 ! .12 T','T .30 T','T .9 p22','T .9 p22','T .3 ! .5 p22','T .9 p22','T .30 T',
'T .2 B6 .22 T','T .2 B6 .8 M .2 ,8 .3 T','T .2 B6 .9 ! . ,3 w2 ,3 .3 T','T .11 & .7 ,3 w2 ,3 .3 T','T .19 ,8 .3 T','T .5 ! .24 T','T .30 T','T32'],
  npcs:[N('caretaker')],enT:['goose','squirrel','goose','goose'],readsL:['carillon','maymont'],doorsL:[{to:'carillon:1,2',need:'carkey'}],
  itemsL:[{id:'bib',kind:'bib'}]});
ow(1,2,"Hollywood Cemetery",{base:'.',rows:[
'T14 .4 T14','T .30 T','T .2 x .2 x .3 x .8 P5 .7 T','T .18 P5 .7 T','T .3 G .6 @ .7 P5 .7 T','T .18 P2 % P2 .7 T','T .30 T',
'T .2 x .3 x .3 x .6 ! .4 x .3 x .3 T','T .30 T','.32','.5 Y .9 ! .16','.32','.32','T .2 x .3 x .3 x .6 ! .4 x .3 x .3 T','T .30 T',
'T .21 T b3 T .4 T','T .21 T b*b T .4 T','T .21 T5 .4 T','w32','w32','w32','w32'],
  npcs:[N('keeper')],enT:['ghost','ghost','ghost'],readsL:['irondog','hollywood'],readsT:{P:'pyramid'},doorsL:[{to:'pyramid:0,1'}]});
ow(2,2,"Belle Isle",{base:'.',rows:[
'w14 =4 w14','w14 =4 w14','w14 =4 w14','w3 .26 w3','w3 .5 @ .4 M .3 r7 .5 w3','w3 .14 r2 D r4 .5 w3','w3 .26 w3','w3 . T .8 ! .15 w3','w3 .26 w3',
'-3 .26 -3','-3 .6 ! .19 -3','-3 .26 -3','-3 .26 -3','w3 .26 w3','w3 .3 r2 % r .16 ! .2 w3','w3 .17 M .8 w3','w3 .26 w3','w3 .5 ! .20 w3','w3 .26 w3',
'w14 ~4 w14','w14 ~4 w14','w14 ~4 w14'],
  npcs:[N('kayaker')],enT:['crab','goose','crab','crab'],readsL:['belleisle','falls'],doorsL:[{to:'quarry:0,1'},{to:'ruins:0,0'}]});
ow(3,2,"Rocketts Landing",{base:'n',rows:[
'r14 n4 r14','r n30 r','r n3 M n26 r','r n30 r','r n5 ! n18 ! n5 r','r n30 r','r n22 M n7 r','r n30 r','r n30 r',
'n31 r','n10 ! n20 r','n31 r','n31 r','r n30 r','r n30 r',
'r w8 =2 w6 ~2 w12 r','r w8 =2 w6 ~2 w12 r','r w8 =2 w6 ~6 w8 r','r w16 ~2 * ~3 w8 r','r w16 ~6 w8 r','r w30 r','r32'],
  enT:['crab','crab','crab'],readsL:['rocketts','trail']});
ow(1,3,"Forest Hill Park",{base:'.',pal:[STONE],rows:[
'T32','T .30 T','T .3 B7 .20 T','T .3 B7 .5 @ .14 T','T .3 B7 .6 M .13 T','T .3 B7 .20 T','T .2 b3 .14 r5 .6 T','T .2 b*b .14 r . & . r .6 T','T .2 b3 .14 r2 v r2 .6 T',
'T .13 ! .17','T .10 K21','T .31','T .2 w8 .21','T .2 w8 .4 Y .15 T','T .2 w8 .20 T','T .2 w8 .6 ! .13 T','T .2 w8 .20 T','T .30 T','T .8 ! .21 T','T .30 T','T .30 T','T32'],
  npcs:[N('ranger')],enT:['squirrel','goose','squirrel'],readsL:['foresthill','!carousel'],itemsL:[{id:'carkey',kind:'carkey'}]});
ow(2,3,"Manchester",{base:'p',pal:[BRICK,STEEL],rows:[
'w14 ~4 w8 f4 w2','w14 ~4 w8 =4 w2','w14 ~4 w8 =4 w2','U14 p4 U8 =4 U2','B s5 M s7 p4 s4 @ s3 M s4 B','B s30 B',
'B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B11 s B','p31 B','p6 ! p17 ! p6 B','p31 B','p31 B','B s30 B',
'B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B11 s B','B s13 p4 s7 ! s5 B','B s30 B','B s30 B','B s30 B','B32'],
  npcs:[N('painter')],enT:['rat','scooter','rat'],readsL:['manchester','mayo']});

/* ---------- buildings and caves ---------- */
room('bank',0,0,'St. Luke Penny Savings Bank',{entry:true,feats:[['V',3,4,10,1]],
  npcs:[{tx:7,ty:3,who:'Teller',hat:C3('#3a3a54','#24243a','#5a5a7a'),shirt:C3('#e8e4dc','#b0aca4','#ffffff'),talk:'teller'}]});
room('byrd',0,0,'The Byrd Theatre',{entry:true,feats:[['O',7,2,2,1],['h',2,5,5,1],['h',9,5,5,1],['h',2,7,5,1],['h',9,7,5,1]],readsT:{O:'!organ'},
  npcs:[{tx:10,ty:2,who:'Organist',hat:C3('#1a1a24','#0c0c14','#3a3a48'),shirt:C3('#8a1c2c','#5a1020','#b03040'),talk:'organist'}]});
room('capitol',0,0,'Capitol Rotunda',{entry:true,statue:'marble',feats:[['Y',7,4]],reads:{'7,4':'houdon'},
  npcs:[{tx:11,ty:6,who:'Capitol Guide',hat:C3('#2e4a8a','#1c2e5a','#4a6ab0'),shirt:C3('#2e4a8a','#1c2e5a','#4a6ab0'),talk:'guide'}]});
room('vmfa',0,0,'Virginia Museum of Fine Arts',{entry:true,feats:[['g',3,3],['g',6,3],['g',9,3],['g',12,3],['g',7,6]],readsT:{g:'faberge'},
  npcs:[{tx:4,ty:7,who:'Docent',hat:C3('#e8e4dc','#b0aca4','#ffffff'),shirt:C3('#2e2e3e','#1a1a26','#4a4a5e'),talk:'docent'}]});
room('libby',0,0,'Cave Under Libby Hill',{entry:true,style:'cave',feats:[['r',3,3],['r',12,6],['r',4,7]],en:[['bat',5,4],['bat',10,5]],chests:[{id:'libby',tx:8,ty:3,item:'hc'}]});
room('ruins',0,0,'Power Plant Ruins',{entry:true,style:'cave',feats:[['w',2,2,3,2],['w',11,6,3,2],['Z',7,2,3,2]],en:[['crab',5,6],['bat',10,4]],chests:[{id:'ruins',tx:13,ty:2,item:'hc'}]});

/* dungeon 1: Belle Isle Quarry -> blasting powder, granite keystone */
room('quarry',0,1,'Quarry Floor',{entry:true,solve:'clear',feats:[['w',3,3,2,2],['w',11,6,2,2]],en:[['crab',6,6],['crab',10,3]],chests:[{id:'q1',tx:12,ty:3,item:'key',appear:true}]});
room('quarry',1,1,'Flooded Cut',{feats:[['w',4,2,8,2],['M',2,2]],reads:{'2,2':'quarry'},en:[['bat',8,6],['crab',4,7],['crab',11,7]],chests:[{id:'q2',tx:13,ty:2,item:'coins20'}]});
room('quarry',0,0,'Powder Store',{solve:'clear',feats:[['r',12,2,2,1],['r',2,7,2,1]],en:[['bat',5,4],['bat',10,4],['crab',8,7]],chests:[{id:'q3',tx:3,ty:2,item:'powder',appear:true}]});
room('quarry',1,0,'Quarry Pond',{bossT:'turtle',reward:'granite',feats:[['w',1,1,2,2],['w',13,1,2,2],['w',1,8,2,2],['w',13,8,2,2]],en:[['turtle',9,4]]});
link('quarry','0,1','N','0,0','lock');link('quarry','0,1','E','1,1','open');link('quarry','0,0','E','1,0','bomb');
/* dungeon 2: the Pyramid -> cast-iron shield, iron keystone */
room('pyramid',0,1,'Hall of Lamps',{entry:true,solve:'lit',braz:[[3,2],[12,2],[3,7],[12,7]],en:[['ghost',5,5],['ghost',10,5]]});
room('pyramid',0,0,'Burial Vault',{solve:'clear',feats:[['W',4,7],['W',11,7]],en:[['ghost',4,4],['ghost',11,4],['bat',8,6],['bat',6,2]],chests:[{id:'p1',tx:8,ty:2,item:'shield',appear:true}]});
room('pyramid',1,0,'Ossuary',{feats:[['W',5,3],['W',10,3],['W',5,7],['W',10,7]],en:[['ghost',8,5],['bat',3,3],['bat',12,7]],chests:[{id:'p2',tx:12,ty:2,item:'key'}]});
room('pyramid',1,1,'Heart of the Pyramid',{bossT:'wraith',reward:'iron',feats:[['W',4,3],['W',11,3],['W',4,7],['W',11,7]],en:[['wraith',8,3]]});
link('pyramid','0,1','N','0,0','gate');link('pyramid','0,0','E','1,0','open');link('pyramid','1,0','S','1,1','lock');
/* dungeon 3: Poe Museum Cellar -> the Gold-Bug, brick keystone */
room('poe',1,2,'Cellar Stair',{entry:true,statue:'bust',feats:[['Y',3,7]],reads:{'3,7':'poe'},en:[['rat',4,4],['rat',11,6]]});
room('poe',2,2,'Wine Cellar',{solve:'lit',braz:[[4,2],[11,2],[13,7]],en:[['rat',6,5],['bat',10,4]],chests:[{id:'e1',tx:8,ty:7,item:'key',appear:true}]});
room('poe',1,1,"Raven's Study",{solve:'clear',feats:[['V',3,6,2,1],['V',11,6,2,1]],en:[['bat',4,3],['bat',11,3],['rat',5,8],['rat',10,8]],chests:[{id:'e2',tx:8,ty:3,item:'bug',appear:true}]});
room('poe',0,1,'Enchanted Garden',{feats:[[',',1,1,3,2],[',',12,8,3,2],['w',5,3,6,5],['F',7,5,2,1],['M',13,2]],reads:{'13,2':'goldbugtale'},items:[{id:'poekey',kind:'skey',px:128,py:88}]});
room('poe',1,0,"The Raven's Roost",{bossT:'raven',reward:'brick',feats:[['W',3,3],['W',12,3]],en:[['raven',8,2]]});
room('poe',0,2,'Hidden Vault',{statue:'bust',feats:[['Y',3,3],['Y',12,3]],chests:[{id:'e3',tx:8,ty:4,item:'hc'}]});
link('poe','1,2','E','2,2','open');link('poe','1,2','N','1,1','lock');link('poe','1,2','W','0,2','bomb');link('poe','1,1','W','0,1','open');link('poe','1,1','N','1,0','lock');
/* dungeon 4: the Carillon -> push-block puzzles, bronze keystone */
room('carillon',1,2,'Carillon Base',{entry:true,solve:'switch',feats:[['#',4,5],['^',11,5],['W',2,2],['W',13,2],['W',2,7],['W',13,7]],en:[['bat',6,3],['bat',10,7]]});
room('carillon',1,1,'Rope Room',{solve:'clear',feats:[['W',4,3],['W',11,3],['W',4,7],['W',11,7]],en:[['bat',3,5],['bat',12,5],['ghost',6,2],['ghost',9,8]],chests:[{id:'c1',tx:8,ty:5,item:'coins20',appear:true}]});
room('carillon',0,1,'Bell Loft',{solve:'switch',feats:[['#',4,3],['#',11,7],['^',4,7],['^',11,3],['W',7,2],['W',8,8]],en:[['ghost',8,5]],chests:[{id:'c2',tx:13,ty:5,item:'key',appear:true}]});
room('carillon',2,1,'Belfry Ledge',{feats:[['r',3,3],['r',12,7],['r',6,8]],en:[['bat',8,4],['bat',10,6]],chests:[{id:'c3',tx:8,ty:3,item:'piece'}]});
room('carillon',1,0,'The Great Bell',{bossT:'bell',reward:'bronze',feats:[['W',3,3],['W',12,3],['W',3,7],['W',12,7]],en:[['bell',8,4]]});
link('carillon','1,2','N','1,1','gate');link('carillon','1,1','W','0,1','open');link('carillon','1,1','E','2,1','bomb');link('carillon','1,1','N','1,0','lock');
/* finale: the tunnel */
room('tunnel',0,1,'Church Hill Tunnel',{entry:true,feats:[['k',7,1,2,8],['r',3,2],['r',12,6],['r',4,7],['M',2,5]],reads:{'2,5':'tunnel'},en:[['bat',4,4],['bat',11,4],['bat',10,7]]});
room('tunnel',0,0,'Engine 231',{bossT:'vampire',feats:[['k',7,3,2,7],['Z',6,1,4,2]],readsT:{Z:'!engine'},en:[['vampire',8,5]]});
link('tunnel','0,1','N','0,0','bomb');

/* ---------- build every scene's grid ---------- */
const OPP={N:'S',S:'N',E:'W',W:'E'};
function cellsFor(s,d){const c=[];
  if(d=='N'||d=='S'){const y=d=='N'?0:ROWS-1;for(let x=7;x<=8;x++)c.push([x,y]);}
  else{const x=d=='W'?0:COLS-1;for(let y=4;y<=6;y++)c.push([x,y]);}
  return c;}
(function finalize(){
  for(const id in SC)SC[id].opens=[];
  for(const L of LINKS){const A=SC[L.a],B=SC[L.b];A.opens.push(L.dir);B.opens.push(OPP[L.dir]);
    if(L.type!='open'){const t={lock:'L',bomb:'%',gate:'H'}[L.type];
      for(const [Sx,d] of [[A,L.dir],[B,OPP[L.dir]]])Sx.dyn.push({cells:cellsFor(Sx,d),closed:t,open:Sx.base,flag:L.type=='gate'?null:'e:'+L.a+'>'+L.b,solved:L.type=='gate'?L.a:null});}}
  for(const id in SC){const s=SC[id];
    if(s.rows){
      const rows=s.rows.map(rle);s.h=rows.length;s.w=rows[0].length;
      const m=[],npc=[],en=[],rd=[],dr=[],it=[],pc=[];
      rows.forEach((r,y)=>{if(r.length!==s.w)throw new Error(s.name+' row '+y+' is '+r.length+' wide, expected '+s.w);m.push([]);
        for(let x=0;x<s.w;x++){let ch=r[x];
          if(ch=='@'){npc.push([x,y]);ch=s.base;}else if(ch=='!'){en.push([x,y]);ch=s.base;}else if(ch=='*'){pc.push([x,y]);ch=s.base;}else if(ch=='&'){it.push([x,y]);ch=s.base;}
          else if(ch=='v'){s.dyn.push({cells:[[x,y]],closed:'%',open:s.base,flag:'rub:'+id+':'+x+','+y});ch='%';}
          else if(ch=='%'){s.dyn.push({cells:[[x,y]],closed:'%',open:'D',flag:'rub:'+id+':'+x+','+y});dr.push([x,y]);}
          if('MYGQ'.includes(ch))rd.push([x,y]);if(ch=='D')dr.push([x,y]);
          m[y].push(ch);}});
      const need=(a,b,what)=>{if(a.length!==(b||[]).length)throw new Error(s.name+': '+a.length+' '+what+' placeholders but '+(b||[]).length+' listed');};
      need(npc,s.npcs,'person');need(en,s.enT,'enemy');need(rd,s.readsL,'marker');need(dr,s.doorsL,'door');need(it,s.itemsL,'item');
      (s.npcs||[]).forEach((n,i)=>{n.tx=npc[i][0];n.ty=npc[i][1];});
      s.en=en.map((q,i)=>[s.enT[i],q[0],q[1]]);
      rd.forEach((q,i)=>s.reads[q.join()]=s.readsL[i]);Object.assign(s.reads,s.readsAt||{});
      s.doors=dr.sort((a,b)=>a[1]-b[1]||a[0]-b[0]).map((q,i)=>Object.assign({tx:q[0],ty:q[1],ret:[q[0],q[1]+1]},s.doorsL[i]));
      s.items=it.map((q,i)=>Object.assign({tx:q[0],ty:q[1]},s.itemsL[i])).concat(pc.map(q=>({id:'pc:'+id+':'+q.join(),kind:'piece',tx:q[0],ty:q[1]})));
      s.g0=m;
    }else{
      s.w=COLS;s.h=ROWS;const m=[];
      for(let y=0;y<ROWS;y++){m.push([]);for(let x=0;x<COLS;x++)m[y].push(x==0||y==0||x==COLS-1||y==ROWS-1?s.border:s.base);}
      for(const d of s.opens)for(const [x,y] of cellsFor(s,d))m[y][x]=s.base;
      if(s.entry)m[9][7]=m[9][8]='E';
      for(const [t,x,y,w=1,h=1] of s.feats)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)m[yy][xx]=t;
      s.g0=m;
    }
  }
})();
const AREAB={};for(const id in SC){const s=SC[id],b=AREAB[s.area]||(AREAB[s.area]={x0:9,y0:9,x1:0,y1:0});b.x0=Math.min(b.x0,s.ax);b.y0=Math.min(b.y0,s.ay);b.x1=Math.max(b.x1,s.ax);b.y1=Math.max(b.y1,s.ay);}
