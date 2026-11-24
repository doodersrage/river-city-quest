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
['ponypasture',`Pony Pasture`,`Part of the James River Park System, Pony Pasture is a stretch of riverbank beside wide, rocky rapids. People come to wade, tube and fish, and to watch for herons and bald eagles.`],
['ancarrow',`Ancarrow's Landing`,`A boat landing on the south bank in Manchester. The Richmond Slave Trail begins here, tracing the route enslaved people were forced to walk into the city.`],
['bateau',`James River Bateaux`,`Before railroads, long flat-bottomed bateaux carried tobacco and other goods down the James to Richmond. A festival still poles replica bateaux down the river every summer.`],
['bryanpark',`Bryan Park`,`Isobel Stewart Bryan gave this park to the city in 1909 in memory of her husband, newspaper publisher Joseph Bryan. Its azalea garden blooms by the thousands every spring.`],
['ginter',`Lewis Ginter Botanical Garden`,`The garden grows on land once owned by Lewis Ginter, a tobacco businessman who helped shape Richmond in the late 1800s. Its glass conservatory is full of tropical plants.`],
['chimborazo',`Chimborazo`,`During the Civil War, Chimborazo Hospital stood on this hilltop, one of the largest military hospitals of its time. Today it is a park with a wide view of the James.`],
['stonehouse',`The Old Stone House`,`The Poe Museum's Old Stone House dates to the mid-1700s and is the oldest house still standing in Richmond. In 1824 a 15-year-old Edgar Allan Poe stood in an honor guard outside it when Lafayette came to visit.`],
['poe',`Poe in Richmond`,`Edgar Allan Poe grew up in Richmond and later edited the Southern Literary Messenger here. As a teenager he swam about six miles of the James against the tide, a feat he was proud of all his life.`],
['goldbugtale',`The Gold-Bug`,`Poe's 1843 story "The Gold-Bug" follows a man who cracks a secret code to find Captain Kidd's buried treasure. It was one of his most popular stories while he was alive.`],
['foresthill',`Forest Hill Park`,`Holden Rhodes built the granite Stone House here in the 1830s. In 1890 a trolley company turned the grounds into an amusement park with a carousel, a roller coaster and a penny arcade inside the house. The rides came down in 1932, and the city bought the land in 1934.`],
['manchester',`Manchester`,`Manchester began as a town on the south bank in 1769 and became its own city in 1874. In 1910 it joined Richmond, and part of the deal was a new bridge across the James.`],
['mayo',`Mayo's Bridge`,`John Mayo Jr. opened a toll bridge here in 1788, and floods carried it away again and again. The concrete bridge standing today went up after Manchester joined Richmond, and it is the city's oldest highway bridge over the James.`],
['sciencemuseum',`Science Museum of Virginia`,`The Science Museum fills the old Broad Street Station, a domed train station designed by John Russell Pope that opened in 1919. Passenger trains stopped running here in the 1970s. Now the ticket hall holds exhibits, and the Dome theater shows the night sky.`],
['vmhc',`Virginia Museum of History & Culture`,`The Virginia Historical Society was founded in 1831. Its museum on Arthur Ashe Boulevard tells the story of Virginia, from the Native peoples who lived here first through the centuries since.`],
['ashblvd',`Arthur Ashe Boulevard`,`In 2019 Richmond renamed the Boulevard for Arthur Ashe, the tennis champion who grew up here. As a boy he was kept off the city's whites-only courts, so he learned the game at Brook Field, the Black playground where his father worked.`],
['sauers',`The Sauer's Sign`,`C.F. Sauer started selling vanilla extract in Richmond in 1887. The company's giant lighted sign on West Broad Street, with its blinking bottle, became one of the city's best-loved landmarks.`],
['raceway',`Richmond Raceway`,`NASCAR has raced in Richmond since the 1950s. Today's track is a three-quarter-mile oval, short enough that fans can see every car on every lap. Drivers call it the Action Track.`],
['agecroft',`Agecroft Hall`,`Agecroft Hall was built in Lancashire, England, in the late 1400s. In the 1920s a Richmond businessman, Thomas C. Williams Jr., bought it, had it taken apart, shipped it across the Atlantic in crates and rebuilt it above the James in Windsor Farms.`],
['texasbeach',`Texas Beach`,`Texas Beach is a stretch of sand and boulders in the James River Park System. You reach it on a footbridge over the railroad and the old canal. Nobody seems sure how it got its name.`],
['vcu',`VCU and the Rams`,`Virginia Commonwealth University formed in 1968 when the Richmond Professional Institute joined the Medical College of Virginia. In 2011 its basketball team, the Rams, started in the brand-new First Four and made it all the way to the Final Four.`],
['marshall',`John Marshall House`,`John Marshall built this brick house in 1790. He served as Chief Justice of the United States for 34 years, longer than anyone else, and his rulings helped shape the Supreme Court's power.`],
['bhm',`Black History Museum`,`The Black History Museum & Cultural Center of Virginia now lives in the Leigh Street Armory, built in 1895 for one of Richmond's Black militia units. Later it served as a school. The museum reopened here in 2016.`],
['jefferson',`The Jefferson Hotel`,`Lewis Ginter opened the Jefferson in 1895. For decades live alligators lived in the marble pools of its lobby. The last of them died in 1948, and bronze alligators keep watch there now.`],
['canalwalk',`The Canal Walk`,`George Washington pushed for a canal to carry boats from Richmond west toward the Ohio River. The James River and Kanawha Canal never got that far before railroads took over. Its downtown stretch is now the Canal Walk.`],
['brownsisland',`Brown's Island`,`Brown's Island was once lined with mills and factories. Now it is a park where Richmond throws big outdoor parties, including the Richmond Folk Festival every October and Dominion Riverrock, an outdoor sports and music festival, in May.`],
['pipeline',`The Pipeline Walk`,`This catwalk runs along the top of a big pipe at the east end of the falls, just above the rapids. From it you can watch great blue herons nesting on the river islands.`],
['libbyview',`The View That Named Richmond`,`Legend says William Byrd II looked at the bend of the James from this hill and was reminded of the view at Richmond upon Thames, back in England. So he named the new town Richmond.`],
['leebridge',`The Belle Isle Footbridge`,`The footbridge to Belle Isle hangs from cables under the Lee Bridge, so you walk across the James right under the traffic, with the rapids below your feet.`],
['hanover',`Hanover Tomatoes`,`Richmonders swear by Hanover tomatoes, grown in the sandy soil of Hanover County just north of the city. Every July a tomato festival celebrates them.`],
['ukrops',`Ukrop's Rainbow Cookies`,`Ukrop's was the Richmond grocery chain everybody knew. Its bakery's rainbow cookies, three colored layers with chocolate on top, are still a local favorite.`],
['sallybell',`Sally Bell's Kitchen`,`Sally Bell's Kitchen has been a Richmond bakery since the 1920s. Its famous boxed lunch comes with a sandwich, potato salad, a deviled egg, a cheese wafer and a cupcake, all tied up in a box.`],
];
const LOREM={};LORE.forEach(([id,t,s])=>LOREM[id]={t,s});
const READX={'!engine':['C&O Engine 231','It sits right where the hill buried it in 1925, rusted and silent.'],
  '!organ':['The Mighty Wurlitzer','You press a key. The whole theatre hums.'],
  '!carousel':['Carousel Horse','A painted wooden horse from the old amusement park, its paint long faded.'],
  '!arcade':['Penny Arcade','You drop in a penny. The machine whirs, a little card pops out: GOOD LUCK IN THE FOG.']};

/* ---------- builders ---------- */
const SC={},LINKS=[];let seedN=1;
const BRICK=['#a85040','#7a3428','#c46a58'],BRICK2=['#94483a','#6a2e24','#b06254'],STEEL=['#7a8494','#565e6c','#98a2b2'],CREAM=['#e4d8bc','#b4a684','#fbf0d8'],STONE=['#9a9aa0','#6a6a74','#bcbcc4'];
const AST={
  quarry:{fl:['#5a5e68','#444852','#727682'],wl:['#7a7e8a','#4e525c','#a0a4b0']},
  pyramid:{fl:['#6e6a72','#55515a','#86828a'],wl:['#9a968c','#6a665e','#c2beb2']},
  poe:{wood:true,fl:['#6a4a34','#4e3424','#82603f'],wl:['#8a4a3c','#5e2e24','#a8685a']},
  tunnel:{fl:['#4a4038','#342c26','#5e5248'],wl:['#6a4034','#44261e','#865448']},
  carillon:{fl:['#7a6a5a','#5e5044','#948270'],wl:['#a87a5a','#7a5238','#c89a78']},
  tredegar:{fl:['#4e484c','#3a3438','#625a5e'],wl:['#7a4a3a','#54301f','#9a6450']},
  conserv:{lit:true,fl:['#5a6a4a','#46543a','#6e7e5c'],wl:['#c8d8d0','#8aa098','#eef6f2']},
  cave:{fl:['#5a4e44','#423830','#6e6256'],wl:['#6e5a4a','#4a3a2e','#8a7462']},
  bank:{lit:true,wood:true,fl:['#8a5a34','#6a4224','#a8744a'],wl:['#c8b48c','#8a7a5a','#e4d4b0']},
  byrd:{lit:true,fl:['#7a1c2c','#5a1020','#94303e'],wl:['#8a6a3a','#5e4420','#b08a52']},
  capitol:{lit:true,fl:['#d4d0c4','#b0aca0','#ece8dc'],wl:['#e4e0d4','#a8a498','#ffffff']},
  vmfa:{lit:true,fl:['#2a2a3a','#1e1e2c','#3a3a4e'],wl:['#d8d4cc','#a8a49c','#f4f0e8']},
  tap:{lit:true,wood:true,fl:['#7a5434','#5a3c22','#966a44'],wl:['#8a4a3c','#5e2e24','#a8685a']},
  tea:{lit:true,fl:['#9a8a6a','#7a6a4e','#b4a484'],wl:['#e8dcc0','#b4a684','#fbf0d8']},
  hippo:{lit:true,fl:['#5a1020','#3a0814','#7a1c2c'],wl:['#d8a830','#9a7420','#f0c860']},
  church:{lit:true,wood:true,fl:['#8a6a44','#6a4e30','#a4825a'],wl:['#f4f2ec','#c8c4b8','#ffffff']},
  shop:{lit:true,wood:true,fl:['#8a5a34','#6a4224','#a8744a'],wl:['#5aa8a0','#3a7c76','#80c8c0']},
  home:{lit:true,wood:true,fl:['#9a6a3a','#7a4e28','#b4844c'],wl:['#d87878','#a84c4c','#f0a0a0']},
  station:{lit:true,fl:['#c8c0b0','#a8a090','#e0d8c8'],wl:['#b05a40','#7a3a28','#d07a60']},
  mansion:{lit:true,wood:true,fl:['#6a3a2a','#4a2418','#8a5a44'],wl:['#5a7a5a','#3a5a3a','#7a9a7a']},
  boat:{lit:true,wood:true,fl:['#a07848','#7a5834','#c09868'],wl:['#6a5a4a','#4a3e32','#8a7a6a']},
  hotel:{lit:true,fl:['#c8b890','#a89870','#e4d8b4'],wl:['#e8dcc0','#b4a684','#fbf0d8']},
  gym:{lit:true,wood:true,fl:['#c89a5a','#a87a3a','#e0b47a'],wl:['#2a2a32','#14141a','#f2c14e']},
  armory:{lit:true,wood:true,fl:['#8a5a34','#6a4224','#a8744a'],wl:['#b05a40','#7a3a28','#d07a60']},
  arcade:{lit:true,wood:true,fl:['#7a6a5a','#5e5044','#948270'],wl:['#9a9aa0','#6a6a74','#bcbcc4']},
  studio:{lit:true,fl:['#8a8a90','#6a6a70','#a8a8ae'],wl:['#e8e4dc','#b0aca4','#ffffff']}
};
const AREAN={ow:'Richmond',quarry:'Belle Isle Quarry',pyramid:'The Pyramid',poe:'Poe Museum Cellar',tunnel:'Church Hill Tunnel',tredegar:'Tredegar Iron Works',conserv:'The Conservatory',carillon:'The Carillon'};
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
  ballplayer:{who:'Ballplayer',hat:C3('#e83048','#a01c30','#f890a0'),shirt:C3('#f4f4f8','#b8bccc','#ffffff'),talk:'ballplayer',chal:'flies'},
  musician:{who:'Musician',hat:C3('#8a4fb0','#5c3080','#b07cd8'),shirt:C3('#f2c14e','#b88a20','#ffe08a'),talk:'musician'},
  dancer:{who:'Tap Dancer',hat:C3('#2a2a34','#14141c','#4a4a58'),shirt:C3('#d94f70','#a02c4c','#f488a4'),talk:'chal',chal:'taps'},
  henry:{who:'Reenactor',hat:C3('#2a2a34','#14141c','#4a4a58'),shirt:C3('#6a3a2a','#4a2418','#8a5a44'),talk:'henry'},
  lamplighter:{who:'Lamplighter',hat:C3('#3a3a54','#24243a','#5a5a7a'),shirt:C3('#4a6a8a','#2e4a66','#6a8aac'),talk:'chal',chal:'lamps'},
  shop:{who:'Shopkeeper',hat:C3('#d94f70','#a02c4c','#f488a4'),shirt:C3('#34c8b0','#1c8a7a','#74e4d0'),talk:'shop'},
  vendor:{who:'Melon Vendor',hat:C3('#2e9d6b','#1c6c48','#58c890'),shirt:C3('#e83048','#a01c30','#f890a0'),talk:'vendor',chal:'melons'},
  commuter:{who:'Commuter',hat:C3('#5a4a3a','#3a2e22','#7a6a5a'),shirt:C3('#2e4a8a','#1c2e5a','#4a6ab0'),talk:'chal',chal:'bus'},
  runner:{who:'Runner',hat:C3('#f2c14e','#b88a20','#ffe08a'),shirt:C3('#e83048','#a01c30','#f890a0'),talk:'runner',chal:'tenk'},
  archivist:{who:'Archivist',hat:C3('#6a7088','#464a60','#9096ac'),shirt:C3('#8a5a2b','#5e3a18','#b07c48'),talk:'archivist'},
  quizguide:{who:'Tour Guide',hat:C3('#2e4a8a','#1c2e5a','#4a6ab0'),shirt:C3('#f2c14e','#b88a20','#ffe08a'),talk:'chal',chal:'quiz'},
  marketeer:{who:'Market Vendor',hat:C3('#e8d28a','#b09a54','#fff0b8'),shirt:C3('#6b7a4a','#4a5632','#909e6e'),talk:'chal',chal:'rats'},
  caretaker:{who:'Carillon Caretaker',hat:C3('#5a4a8a','#3a2e60','#8a7ab8'),shirt:C3('#c08840','#7a5420','#e8b070'),talk:'caretaker'},
  fisher:{who:'Fisher',hat:C3('#6a5a2a','#4a3e18','#9a8a50'),shirt:C3('#3d63c8','#27428e','#7397ee'),talk:'chal',chal:'lures'},
  keeper:{who:'Cemetery Keeper',hat:C3('#4d5e3a','#34402a','#74885c'),shirt:C3('#6b7a4a','#4a5632','#909e6e'),talk:'keeper'},
  watchman:{who:'Night Watchman',hat:C3('#2a2a34','#14141c','#4a4a58'),shirt:C3('#4a4a5e','#2e2e3e','#6a6a80'),talk:'chal',chal:'ghosts'},
  kayaker:{who:'Kayaker',hat:C3('#e8d28a','#b09a54','#fff0b8'),shirt:C3('#d8692a','#a04414','#f09458'),talk:'kayaker'},
  volunteer:{who:'River Volunteer',hat:C3('#34c8b0','#1c8a7a','#74e4d0'),shirt:C3('#58a850','#2f7a3c','#90d070'),talk:'chal',chal:'cleanup'},
  crabber:{who:'Crabber',hat:C3('#e8e4dc','#b0aca4','#ffffff'),shirt:C3('#d8692a','#a04414','#f09458'),talk:'chal',chal:'crabs'},
  ranger:{who:'Park Ranger',hat:C3('#6a5a2a','#4a3e18','#9a8a50'),shirt:C3('#4a6a3a','#2e4624','#6a9058'),talk:'ranger'},
  conductor:{who:'Old Conductor',hat:C3('#2e4a8a','#1c2e5a','#4a6ab0'),shirt:C3('#2e4a8a','#1c2e5a','#4a6ab0'),talk:'chal',chal:'trolley'},
  naturalist:{who:'Naturalist',hat:C3('#6a8a3a','#4a6a24','#8aac5a'),shirt:C3('#c8b48c','#9a8660','#e4d4b0'),talk:'naturalist'},
  racer:{who:'Derby Kid',hat:C3('#e83048','#a01c30','#f890a0'),shirt:C3('#f2c14e','#b88a20','#ffe08a'),talk:'racer'},
  historian:{who:'River Historian',hat:C3('#8a5a2b','#5e3a18','#b07c48'),shirt:C3('#2e4a8a','#1c2e5a','#4a6ab0'),talk:'historian'},
  painter:{who:'Mural Painter',hat:C3('#3ac2e8','#1a8ab0','#8ae0f8'),shirt:C3('#f08030','#b85a18','#ffb868'),talk:'painter',chal:'murals'}
};
const N=k=>Object.assign({},NPC[k]);
const FOLKC=[[C3('#6a4020','#4a2c14','#8a5a30'),C3('#58a850','#2f7a3c','#90d070')],[C3('#f2c14e','#b88a20','#ffe08a'),C3('#3d63c8','#27428e','#7397ee')],
  [C3('#1a1a24','#0c0c14','#3a3a48'),C3('#e83048','#a01c30','#f890a0')],[C3('#c8c8d0','#9a9aa4','#ececf4'),C3('#8a4fb0','#5c3080','#b07cd8')],
  [C3('#d8692a','#a04414','#f09458'),C3('#e8e4dc','#b0aca4','#ffffff')],[C3('#3a2a20','#24180e','#5a4030'),C3('#f08098','#c05068','#ffb0c0')]];
let folkN=0;
const F=(...lines)=>{const c=FOLKC[folkN++%FOLKC.length];return{who:'Local',hat:c[0],shirt:c[1],talk:'folk',lines,wander:true};};

ow(0,0,"Scott's Addition",{hs:'ware',base:'p',pal:[STEEL,BRICK,STEEL,BRICK2],rows:[
'B13 p6 B13','B X12 p6 B13','B X12 p6 B13','B ..?..nn..?.. p6 B13','B .?.n....n.?. p6 B4 D B8','B ..n..?...n.. p6 susasasus`ss B',
'B ...n.nn.n?.. p6 sasasas@ssss B','B ..?.....?... p6 s2 M s2 l s6 B','B f5 .. f5 @ p5 s12 B','p32','p7 ! p17 ! p6','p11 @ p20','p32',
'B s2 l s5 l s4 p4 s4 l s5 l s2 B','B B5 s B6 s p4 s b12 B','B B5 s B6 s p4 s b .10 b B','B B5 s B6 s p4 s b ...,,.!... b B','B B5 s B6 s p4 s b .,,....,,. b B',
'B s13 p4 s b ....bbb... b B','B b3 ` s9 p4 s b ....b*b... b B','B $ b2 s10 p4 s b12 B','B14 p4 B14'],
  npcs:[F('Breweries everywhere you look in Scott\'s Addition. Old factories make good taprooms.','I can hear the crowd at The Diamond from my porch on game nights.'),N('ballplayer'),
    F('This fog rolled in the night the lamps on Church Hill went out. Strange times.','Go easy on the rats. Well, not too easy.')],
  enT:['rat','scooter','rat'],readsL:['scotts'],doorsL:[{to:'taproom:0,0'}],chestsL:['coins50'],lm:[{art:'grandstand',x:1,y:1,w:12,h:2,read:'diamond'}],cars:[{y:10,dir:1}]});
ow(1,0,"Broad Street",{base:'p',pal:[BRICK,CREAM,['#8a8e9c','#62667a','#a8acba']],rows:[
'B32','B X13 s $ s2 X13 B','B X13 s4 X13 B','B X13 s ! s2 X13 B','B X13 b4 X13 B','B X13 s4 X13 B','B X6 D X6 s4 X7 D X5 B',
'B s2 l s4 t s2 M s3 @ s3 t s4 l s6 B','B s5 q s18 q s5 B','p32','K32','p6 ! p17 ! p7','p32','B s2 l s4 t s3 M s10 X3 s4 ? B','B s6 ` s16 ` s6 B',
'B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B','B s2 u s3 u s3 l s2 p4 s2 l s3 u s3 u s2 B','B s3 @ s9 p4 s9 ! s3 B','B14 p4 B14'],
  npcs:[N('commuter'),F('My grandmother had lunch at the Miller & Rhoads Tea Room every Christmas.','The streetcars are long gone, but the Pulse bus runs right down Broad.')],
  enT:['rat','scooter','scooter','rat'],readsL:['broad','streetcar'],doorsL:[{to:'tearoom:0,0'},{to:'jefferson:0,0'}],chestsL:['coins50'],
  lm:[{art:'store',x:1,y:1,w:13,h:6,read:'broad',c:'#c8b48c'},{art:'store',x:18,y:1,w:13,h:6,read:'broad',c:'#b0a8a0'},{art:'shelter',x:23,y:13,w:3,h:1}],cars:[{y:10,dir:1,kind:'bus'},{y:12,dir:-1}]});
ow(2,0,"Jackson Ward",{hs:'jw',base:'p',pal:[BRICK,BRICK2],rows:[
'B14 p4 B14','B B8 s2 l s7 X12 B','B B8 s10 X12 B','B B8 s3 @ s6 X12 B','B B4 D B3 s10 X5 D X6 B','B s8 M s7 ? s5 ? s7 B','B s2 t s4 t s4 t s4 t s4 t s7 B',
'B s4 ? s15 Q s9 B','B s5 @ s13 Y s10 B','p32','p5 ! p20 ! p5','p12 @ p19','p20 ? p11','B s2 l s10 p4 s7 ? s2 l s2 B','B f3 s f8 s p4 s f8 s f3 B',
'B B12 s p4 s B12 B','B B12 s p4 s B12 B','B B12 s p4 s B12 B','B s5 ? s7 p4 s13 B','B b3 s ` s8 p4 s7 ! s5 B','B $ b2 s10 p4 s13 B','B14 p4 B14'],
  npcs:[N('musician'),N('dancer'),F('They called Second Street the Deuce. Every club on it had a band.','Mrs. Walker\'s house is just down the street. They keep it as a museum.')],
  enT:['rat','scooter','rat'],readsL:['jward','bojangles','bojangles'],doorsL:[{to:'bank:0,0'},{to:'hippo:0,0'}],chestsL:['coins50'],
  lm:[{art:'hippodrome',x:19,y:1,w:12,h:4,read:'jward'}],cars:[{y:9,dir:1}]});
ow(3,0,"Church Hill",{hs:'hill',roof:'tin',pal:[BRICK,['#e8d48a','#b8a45a','#f8e8b0','clap'],['#9ab8a0','#6c8c74','#bcd8c2','clap'],BRICK2,['#8aa0c8','#5e749c','#aec2e4','clap']],base:'.',rows:[
'T32','T r8 .9 X6 .7 T','T r8 .9 X6 .7 T','T r % r D r4 .9 X6 .3 @ .3 T','T .3 k .3 l .4 M .4 X6 .7 T','T .3 k .13 X2 D X3 .7 T','T .3 k .12 l .13 T',
'T .3 k .11 x . x . x . ! .8 T','T .15 x . x . x .3 l .6 T','.31 T','. ! .29 T','.9 @ .22','.32','T R13 S4 R13 T',
'T .4 ,4 .10 @ .11 T','T .3 l .15 b6 .5 T','T .19 b.*..b .5 T','T .5 ! .13 b6 .5 T','T .10 i .2 i .11 M .4 T','T b3 ` .17 l .8 T','T $ b2 .27 T','T14 .4 T14'],
  npcs:[N('henry'),N('lamplighter'),N('racer')],enT:['bat','bat','bat'],readsL:['tunnel','names'],readsAt:{'18,7':'eliza'},
  doorsL:[{to:'libby:0,0'},{to:'tunnel:0,1',need:'keystones'},{to:'stjohn:0,0'}],chestsL:['coins50'],lm:[{art:'church',x:18,y:1,w:6,h:5,read:'stjohns'}]});
ow(0,1,"Carytown",{base:'s',awn:true,pal:[['#d8a048','#a87428','#f0c070'],['#5aa8a0','#3a7c76','#80c8c0'],['#d87878','#a84c4c','#f0a0a0'],BRICK],rows:[
'B14 p4 B14','B . X11 .. p4 B13','B . X11 .. p4 B13','B . X11 .. p4 B13','B . X11 .. p4 s12 B','B . X5 D X5 .. p4 s2 @ s9 B','B .2 S7 .4 p4 s3 t s3 t s5 B',
'B .4 ,4 .5 p4 s3 ? s9 B','B s3 l s4 ? s4 p4 s4 l s8 B','B p31','B p4 ! p10 @ p15','B p31','B p20 ? p10','B s2 l s4 q s5 p4 s5 q s4 l s2 B',
'B B12 s p4 s X7 B5 B','B B12 s p4 s X7 B5 B','B B5 D B6 s p4 s X3 D X3 B5 B','B s2 a s a s2 ? s5 p4 s3 ? s3 @ s5 B','B s5 M s2 ? s4 p4 s6 ! s6 B','B b3 s3 u s6 p4 s3 ? s3 ` s5 B','B $ b2 ! s8 ? p4 s13 B','B14 p4 B14'],
  npcs:[F('I come for the movies at the Byrd. Two dollars, and an organ before the show!','Every summer the whole street smells like watermelon.'),F('Have you seen the eggs at the art museum? Made for a Russian empress!'),N('vendor')],
  enT:['scooter','rat','scooter'],readsL:['carytown'],doorsL:[{to:'vmfa:0,0'},{to:'shop:0,0'},{to:'byrd:0,0'}],chestsL:['coins50'],
  lm:[{art:'vmfa',x:2,y:1,w:11,h:5,read:'faberge'},{art:'byrd',x:19,y:14,w:7,h:3,read:'byrd'}]});
ow(1,1,"The Fan",{hs:'fan',base:'.',pal:[CREAM,['#9ab8a0','#6c8c74','#bcd8c2'],BRICK,['#8aa0c8','#5e749c','#aec2e4']],rows:[
'B14 p4 B14','B s5 @ s7 p4 s13 B','B s B5 s B5 s p4 s B5 s B5 s B','B s B5 s B5 s p4 s B5 s B5 s B','B s B5 s B5 s p4 s B5 s B5 s B',
'B s t s4 M s4 t s p4 s t s4 t s4 t s B','B .3 ! .9 p4 .8 @ .4 B','B s13 p4 s13 B','B s3 l s9 p4 s9 l s3 B',
'p32','.2 i .3 , Y , .2 i .2 p4 .5 i .8','. ? .12 p4 .5 ! .8','p32','B s3 l s9 p4 s9 l s3 B',
'B s B5 s B5 s p4 s B5 s B5 s B','B s B5 s B5 s p4 s B5 s B5 s B','B s B2 D B2 s B5 s p4 s B5 s B5 s B',
'B s2 u s u s u s6 p4 s4 @ s8 B','B .3 ! .9 p4 . b7 .5 B','B b2 ` .10 p4 . b ..*.. b .5 B','B $ b .11 p4 . b7 .5 B','B14 p4 B14'],
  npcs:[F('Every porch on this block has a cat on it. I have counted.','The streets fan out from Monroe Park. Hence the name!'),N('runner'),F('My dog loves Monument Avenue. So many statues to sniff. Well, fewer now.')],
  enT:['squirrel','squirrel','rat'],readsL:['fan','ashe'],doorsL:[{to:'rowhouse:0,0'}],chestsL:['coins50'],cars:[{y:9,dir:-1}]});
ow(2,1,"Capitol Square",{base:'.',rows:[
'f14 p4 f14','f .2 T . X2 .7 p4 X10 .3 f','f .4 X2 .7 p4 X10 .3 f','f .4 X2 .2 ` .4 p4 X10 .3 f','f .4 X2 .7 p4 X10 .3 f','f .13 p4 X10 .3 f',
'f .13 p4 X4 D X5 .3 f','f .6 @ .6 p4 S10 .3 f','f .2 l .4 i .5 p4 .4 M .4 l .3 f','p32','p6 @ p25','p32','p32','f .2 l .10 p4 .10 l .2 f',
'f . T .3 w4 .4 p4 .3 ,4 .6 f','f .5 w4 .4 p4 .3 ,4 . Y .4 f','f .5 w4 .4 p4 .2 i .2 i .7 f','f .3 y .9 p4 .9 T .3 f','f .2 T .3 ` .6 p4 .5 @ .7 f',
'f b3 .10 p4 .13 f','f $ b2 .10 p4 .13 f','f14 p4 f14'],
  npcs:[N('archivist'),N('quizguide'),F('The squirrels here are bolder than the legislators.','I eat lunch by the fountain every day. Even in the fog.')],
  enT:[],readsL:['capitol','civilrights'],doorsL:[{to:'capitol:0,0'}],chestsL:['coins50'],
  lm:[{art:'capitol',x:18,y:1,w:10,h:6,read:'capitol'},{art:'belltower',x:5,y:1,w:2,h:4,read:'capital1780'}]});
ow(3,1,"Shockoe Bottom",{hs:'ware',base:'p',pal:[BRICK2,STONE],rows:[
'B14 p4 B14','B s5 ? s7 p4 s X12 B','B s3 l s9 p4 s X12 B','B s4 B5 s4 p4 s X12 B','B s4 B5 s4 p4 s X12 B','B s4 B5 s4 p4 s X12 B','B s13 p4 s X5 D X6 B',
'B K30 B','B s13 p4 s M s4 ` s6 B','p32','p6 ! p17 ! p7','p10 @ p21','p5 ? p9 ? p9 ? p6','B s13 p4 s3 M s9 B','B s13 p4 s2 X10 s B',
'B s2 B6 s5 p4 s2 X10 s B','B s2 B6 s5 p4 s3 a s a s @ s a s a s B','B s2 B2 D B3 s5 p4 s13 B','B s7 M s5 p4 s4 ! s8 B','B b3 s4 ? s5 p4 s5 ? s7 B','B $ b2 s10 p4 s5 ` s7 B','B14 p4 B14'],
  npcs:[F('Main Street Station\'s clock has kept time over Shockoe since 1901.','Trains still stop here. You can ride all the way to Washington.'),N('marketeer')],
  enT:['rat','rat','rat'],readsL:['shockoe','slavetrail','stonehouse'],doorsL:[{to:'station:0,0'},{to:'poe:1,2'}],chestsL:['coins50'],
  lm:[{art:'station',x:19,y:1,w:12,h:6,read:'shockoe'},{art:'market',x:20,y:14,w:10,h:2}]});
ow(0,2,"Byrd Park & Maymont",{base:'.',pal:[BRICK,CREAM],rows:[
'T14 .4 T14','T .2 X3 .7 l .4 w11 .2 T','T .2 X3 .11 w4 ? w6 .3 T','T .2 X3 .4 @ .6 w5 ? w5 .3 T','T .2 X3 .12 w4 .*. w4 .2 T','T .2 X3 .11 w2 ? w8 .3 T',
'T .2 X3 .5 @ .6 w10 ? .2 T','T .2 X D X . M .12 ! w7 .3 T','T .2 S3 .10 i .3 i .4 @ .5 T','. .9 p22','. .9 p22','. .3 ! .5 p22','. .9 p22','T .5 l .10 l .13 T',
'T .2 X6 .22 T','T .2 X6 .8 M .2 ,8 .3 T','T .2 X6 .9 ! . ,3 w2 ,3 .3 T','T .2 X2 D X3 .3 & .7 ,3 w2 ,3 .3 T','T .8 @ .10 ,8 .3 T','T b3 ! .26 T','T $ b2 .27 T','T32'],
  npcs:[N('caretaker'),N('fisher'),N('naturalist'),F('Maymont has bears, you know. Real ones. And a Japanese garden.','The geese here own this park. We just visit.')],
  enT:['goose','squirrel','goose','goose'],readsL:['carillon','maymont'],doorsL:[{to:'carillon:1,2',need:'carkey'},{to:'mansion:0,0'}],
  itemsL:[{id:'bib',kind:'bib'}],chestsL:['coins50'],lm:[{art:'carillon',x:3,y:1,w:3,h:7,read:'carillon'},{art:'mansion',x:3,y:14,w:6,h:4,read:'maymont'}]});
ow(1,2,"Hollywood Cemetery",{base:'.',rows:[
'T14 .4 T14','T .5 ? .10 ? .13 T','T .2 x .2 x .3 x .8 X5 .7 T','T .18 X5 .7 T','T .3 G .6 @ .7 X5 .7 T','T .18 X2 % X2 .7 T','T s30 T',
'T .2 x .3 x .3 x .6 ! .4 x .3 x .3 T','T .4 X2 .9 @ .14 T','.5 X2 .25','.15 ! .16','.6 ? .14 ? .10','.26 ? .5','T .2 x .3 x .3 x .6 ! .4 x .3 x .3 T','T s10 ? s19 T',
'T .2 x . x . x .14 T b3 T B4 T','T .21 T b*b T B D B2 T','T b3 .18 T5 .4 T','T $ b2 .27 T','w32','w32','w32'],
  npcs:[N('keeper'),N('watchman')],enT:['ghost','ghost','ghost'],readsL:['irondog'],doorsL:[{to:'pyramid:0,1'},{to:'tredegar:0,2'}],chestsL:['coins50'],
  lm:[{art:'pyramid',x:19,y:2,w:5,h:4,read:'pyramid'},{art:'birdcage',x:5,y:8,w:2,h:2,read:'hollywood'}]});
ow(2,2,"Belle Isle",{base:'.',rows:[
'w14 =4 w14','w14 =4 w14','w14 =4 w14','w3 .2 ? .8 M .14 w3','w3 .5 @ .4 M .3 r7 .5 w3','w3 .14 r2 D r4 .5 w3','w3 .3 T .7 ` .8 ? .5 w3',
'w3 . T .8 ! .9 ? .5 w3','w3 .10 @ .15 w3','-3 .26 -3','-3 .6 ! .19 -3','-3 .26 -3','-3 .20 ? .5 -3','w3 .26 w3',
'w3 . X6 .16 ! .2 w3','w3 . X6 .11 M .7 w3','w3 . X2 % X3 .19 w3','w3 .2 ? .5 ! .17 w3','w3 .9 r2 .3 ? r2 .9 w3','w14 ~4 w14','w14 ~9 $ r w7','w14 ~4 w14'],
  npcs:[N('kayaker'),N('volunteer')],enT:['crab','goose','crab','crab'],readsL:['leebridge','belleisle','falls'],doorsL:[{to:'quarry:0,1'},{to:'ruins:0,0'}],chestsL:['coins50'],
  lm:[{art:'ruins',x:4,y:14,w:6,h:3,read:'belleisle'}]});
ow(3,2,"Rocketts Landing",{hs:'ware',base:'n',pal:[BRICK2],rows:[
'r14 n4 r14','r n2 B6 n5 n4 n3 B10 r','r n2 B6 n12 B10 r','r n2 B2 D B3 n3 M n8 B10 r','r n5 ! n18 ! n5 r','r n3 l n8 ? n8 l n8 r','r n22 M n7 r',
'r n4 @ n10 i n2 i n11 r','r n8 ? n12 ? n8 r','n31 r','n10 ! n20 r','n6 ? n12 @ n11 r','n31 r','r n3 ` n26 r','r n4 =2 n3 =2 n19 r',
'r w4 =2 X7 w2 ~2 w13 r','r w4 =2 X7 w2 ~2 w13 r','r w4 =2 w8 ~6 w10 r','r w4 $ w10 ~2 * ~3 w9 r','r w15 ~6 w9 r','r w30 r','r32'],
  npcs:[F('This was the port of Richmond once. Tall ships, right where you\'re standing.','The Capital Trail starts here. Fifty-some miles to Jamestown by bike.'),N('crabber')],
  enT:['crab','crab','crab'],readsL:['rocketts','trail'],doorsL:[{to:'boathouse:0,0'}],chestsL:['coins50'],lm:[{art:'steamboat',x:7,y:15,w:7,h:2}]});
ow(1,3,"Forest Hill Park",{base:'.',pal:[STONE],rows:[
'T32','T .30 T','T .3 X7 .20 T','T .3 X7 .5 @ .14 T','T .3 X7 .6 M .13 T','T .3 X3 D X3 .20 T','T .2 b3 .14 r5 .6 T','T .2 b*b .14 r . & . r .6 T','T .2 b3 .14 r2 v r2 .6 T',
'. .4 @ .8 ! .17','T .3 X3 .3 K22','T .29 ? .','T .2 w8 .21','T .2 w8 .4 Y .15 T','T .2 w8 .20 T','T .2 w8 .6 ! .13 T','T .2 w8 .3 @ .16 T','T .14 i .3 i .11 T','T .8 ! .21 T','T b3 .27 T','T $ b2 .27 T','T32'],
  npcs:[N('ranger'),N('conductor'),F('My great-grandmother rode the roller coaster here for a nickel.','The lake used to freeze over in winter. Everyone went skating.')],
  enT:['squirrel','goose','squirrel'],readsL:['foresthill','!carousel'],doorsL:[{to:'stonehouse:0,0'}],itemsL:[{id:'carkey',kind:'carkey'}],chestsL:['coins50'],
  lm:[{art:'stonehouse',x:4,y:2,w:7,h:4,read:'foresthill'},{art:'trolley',x:4,y:10,w:3,h:1}]});
ow(2,3,"Manchester",{hs:'ware',base:'p',pal:[BRICK,STEEL],rows:[
'w14 ~4 w8 f4 w2','w14 ~4 w8 =4 w2','w14 ~4 w8 =4 w2','U3 e U5 e U4 p4 U2 e U5 =4 U2','B s5 M s7 p4 s4 @ s3 M s4 B','B s2 l s5 l s4 p4 s4 l s4 l s3 B',
'B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B11 s B','B s2 B2 D B3 s5 p4 s B4 e B6 s B','p31 B','p6 ! p17 ! p7','p13 @ p18','p32','B s3 q s9 p4 s9 q s3 B',
'B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B11 s B','B s2 B6 s5 p4 s B4 e B6 s B','B s13 p4 s7 ! s5 B','B s3 ` s9 p4 s13 B','B b3 s10 p4 s13 B','B $ b2 s10 p4 s13 B','B32'],
  npcs:[N('painter'),F('Manchester was its own city until 1910. Some folks here still say it is.','The floodwall keeps the James out when it rises. Mostly.')],
  enT:['rat','scooter','rat'],readsL:['manchester','mayo'],doorsL:[{to:'studio:0,0'}],chestsL:['coins50'],cars:[{y:12,dir:1}]});

ow(0,3,"Pony Pasture",{base:'.',rows:['TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','TwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwT','TwwwwrrwwwwwwwwnnnnwwwwwwwrwwwwT','Tww~~~wwwwwwwwwn&n+wwwwwwwwwwwwT','Twwwwwwwwwwwwwwnnnnwww~~~wwwwwwT','TwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwT','TwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwT','TnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnT','Tnn..M.....T......+......T....nT','T.......@.......!.......,,,,....','T..TT.......rrr.........,,,,...T','T...T.......v&r....@...........T','T...........rrr.....!..........T','T..b..TT.........ssssssss.....`T','T..........................T...T','T..TTT......!.........T.......$T','T..T.T................bb.......T','T.....@........................T','T..............!...............T','T....TT...........TT........TT.T','T..............................T','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
  npcs:[F('The rapids out there are gentle enough to wade. Mostly.','Herons fish off those rocks every morning. Bald eagles too, if you\'re patient.'),
    F('A bateau oar washed up on that sandbar. Too far to wade. You\'d need some way to reach it.','Somebody piled rocks over something by the trail. Looked like a long wooden pole.'),
    F('Forest Hill Park is just east of here. Manchester and the river landing are past that.','Fish bite better on gray days, I swear it.')],
  enT:['goose','squirrel','goose','crab'],readsL:['ponypasture'],itemsL:[{id:'oar',kind:'part'},{id:'pole',kind:'part'}],chestsL:['coins50']});
ow(3,3,"Ancarrow's Landing",{base:'.',rows:['wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww','wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww','wwwwwwwwwwwwwwwwwwwwwn&n+wwwwwww','wwwwww==wwwwwwwwwwwwwnnnnwwwwwww','wwwwww==wwwwwwwwwwwwwwwwwwwwwwww','wwwwww==wwwwwwwwwwwwwwwwwwwwwwww','wwwwww==wwwwwwwwwwwwwwwwwwwwwwww','rnnnnn==nnnnnnnnnnnnnnnnnnnnnnnr','rn..M.......@...........+.....nr','r..............................r','pppppppppppp..........!......TTr','pppppppppppp....@..............r','pppppppppppp...................r','rrrr....M.......bbb......!.....r','r.......T.......b$b............r','r...TT..........bbb.....@......r','r..!...........................r','r.......TT.........TT..........r','r..`...........!...............r','r....TT..................TT....r','r..............................r','rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr'],
  npcs:[F('This is where the boats go in. Fishermen, kayakers, everybody.','On a clear day you can see the whole skyline from the ramp.'),N('historian'),
    F('Shad and catfish run right up to this landing in spring.','If you see a sturgeon out there, holler. They\'re coming back to the James.')],
  enT:['crab','rat','crab','goose'],readsL:['ancarrow','slavetrail'],itemsL:[{id:'tiller',kind:'part'}],chestsL:['coins50']});
ow(0,-1,"Bryan Park",{base:'.',rows:['TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','T..............................T','T..,,,,..TT........wwwwww......T','T..,,,,..TT.......wwwwwwww.....T','T..,,,,..........wwwwwwwwww....T','T...@.......M....wwwwwwwwww....T','T..,,,,..........wwwwwwwwww....T','T..,,,,...!.......wwwwwwww..@..T','T.................wwwwww........','T.....TT.......!................','T.....TT........................','T..bbb.........sssssss.........T','T..b$b.........s.....s....TT...T','T..bbb.........s..!..s....TT...T','T..............sssssss.........T','T...TT.........................T','T...TT.....@...........`.......T','T..............................T','T.......TT.........!......TT...T','T.......TT................TT...T','T............pppppp............T','TTTTTTTTTTTTTppppppTTTTTTTTTTTTT'],
  npcs:[F('Every spring the azalea garden here turns pink and white. Thousands of them.','Young\'s Pond has the best turtles in the city. Don\'t tell anyone.'),
    F('East of here is the botanical garden. Their glass conservatory has been acting strange lately.','I heard something in there is growing way too fast.'),
    F('Scott\'s Addition is just south, down the path.','Frisbee golf? In this fog? Maybe tomorrow.')],
  enT:['squirrel','goose','squirrel','goose'],readsL:['bryanpark'],chestsL:['coins50']});
ow(1,-1,"Lewis Ginter Botanical Garden",{hs:'glass',base:'.',rows:['TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','T..............................T','T...BBBBBBBBBB.................T','T...BBBBBBBBBB....,,,,,,,,.....T','T...BBBBBBBBBB....,,,,,,,,.....T','T...BBBBDBBBBB....,,,www,,.....T','T.............M...,,,www,,.....T','T...l....l.........,,,,,,......T','...............@...............T','......!........................T','...............................T','T....ssssssssssssssssssss......T','T....s,,,,,,s..T..s,,,,,s......T','T....s,,!,,,s.....s,,,,,s......T','T....ssssssssssssssssssss......T','T..............................T','T..TT....@.............TT......T','T..TT.......!..........TT..$...T','T..............................T','T.....wwww...........`.........T','T.....wwww.....................T','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
  npcs:[F('The conservatory doors blew open in the fog, and vines came out after them.','Our gardener left a watering can somewhere inside. Plants in there respond to it. Strongly.'),
    F('Something enormous is blooming under the glass dome. It smells like a dumpster in August.','Bryan Park is west of here.')],
  enT:['squirrel','rat','goose'],readsL:['ginter'],doorsL:[{to:'conserv:0,2'}],chestsL:['coins50']});
ow(4,0,"Chimborazo",{base:'.',rows:['TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','T..............................T','T..TT......,,,,,,.......TT.....T','T..TT......,,,M,,.......TT.....T','T..........,,,,,,..............T','T....@.........................T','T.........!.........l..........T','T....bbb...........sssss.......T','T....b$b...........s...s...@...T','T....bbb...........sssss.......T','T..............!...............T','...............................T','..........@....................T','T..............................T','T...TT...........!.......TT....T','T...TT...................TT....T','T.......M......................T','T......`..........l............T','TrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrT','TwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwT','TwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwT','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'],
  npcs:[F('This hill held one of the biggest military hospitals of the Civil War. Thousands of beds.','Now it\'s a park. Best view of the river bend you\'ll find.'),
    F('Church Hill is right next door, to the west.','Fog looks like a lake from up here.'),
    F('My grandfather walked his dog here every day for fifty years.','Watch the edge of the bluff. It drops straight down.')],
  enT:['bat','rat','ghost'],readsL:['chimborazo','libbyview'],chestsL:['coins50']});
/* ---------- more of Richmond: the Boulevard, the Raceway, Texas Beach, VCU and the Canal Walk ---------- */
ow(-1,0,"Arthur Ashe Boulevard",{base:'.',pal:[BRICK,CREAM],rows:["BTTTTTTTTTTTTTppppTTTTTTTTTTTTTB", "B.XXXXXXXXXXX.pppp.XXXXXXXXXXX.B", "B.XXXXXXXXXXX.pppp.XXXXXXXXXXX.B", "B.XXXXXXXXXXX.pppp.XXXXXXXXXXX.B", "B.XXXXXXXXXXX.pppp.XXXXXXXXXXX.B", "B.XXXXXXXXXXX.pppp.XXXXXXXXXXX.B", "B.XXXXXDXXXXX.pppp.XXXXXDXXXXX.B", "BsssssssssssssppppsssssssssssssB", "Bsslssssst@sMsppppsssstssssslssB", "Bppppppppppppppppppppppppppppppp", "Bppppp!ppppppppppppppppppppppppp", "Bpppppppppppppppppppppppp!pppppp", "Bppppppppppppppppppppppppppppppp", "BsslsssssssssstsstsssssssssslssB", "B.XXXXXXXXXX.......XXXXXXXXXXX.B", "B.XXXXXXXXXX.M.....XXXXXXXXXXX.B", "B.XXXXXXXXXX....@..XXXXXXXXXXX.B", "B.XXXXXXXXXX.T.....XXXXXXXXXXX.B", "B.XXXXXXXXXX............@......B", "Bbbb............T...!..........B", "B$bb....`..............T...T...B", "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"],
  npcs:[F('The Science Museum used to be Broad Street Station. Trains pulled in right where the exhibits are now.','Inside there\'s a giant domed theater. Lie back and the stars fill the whole ceiling.'),F('Smell that? Vanilla. On a warm day the whole Boulevard smells like a bakery.','That sign has been glowing over Broad Street for as long as anybody can remember.'),{who:'Tennis Coach',hat:C3('#f4f4f8','#c8c8d0','#ffffff'),shirt:C3('#3d63c8','#27428e','#7397ee'),talk:'tennis'}],
  enT:["rat", "scooter", "scooter"],readsL:["ashblvd", "sauers"],doorsL:[{to:"science:0,0"},{to:"vmhc:0,0"}],chestsL:["coins50"],lm:[{art:'scimuseum',x:2,y:1,w:11,h:6,read:'sciencemuseum'},{art:'vmhc',x:19,y:1,w:11,h:6,read:'vmhc'},{art:'sauers',x:2,y:14,w:10,h:5,read:'sauers'},{art:'ashecenter',x:19,y:14,w:11,h:4,read:'ashblvd'}],cars:[{y:10,dir:-1}]});
ow(-1,-1,"Richmond Raceway",{base:'.',rows:["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T..XXXXXXXXXXXXXXXXXXXXXXXXXX..T", "T...........@.pppp.M...........T", "T.pppppppppppppppppppppppppppp.T", "T.pppppppppppppppppppppppppppp.T", "T.pppppp!ppppppppppppp@ppppppp.T", "T.ppplppppplpppppppplppppplppp.T", "T.pppppppppppppppppppppppppppp.T", "T.ppppp@ppppppppppppppppp!pppp.T", "T.pppppppppppppppppppppppppppp.T", "T.............pppp.............T", "T..T.......!..pppp....T........T", "T...T....T....pppp.........TbbbT", "T.....T.......pppp.......T..b$bT", "TTTTTTTTTTTTTTppppTTTTTTTTTTTTTT"],
  npcs:[{who:'Race Official',hat:C3('#1a1a24','#0c0c14','#3a3a48'),shirt:C3('#f4f4f8','#c8c8d0','#ffffff'),talk:'racedir'},F('Short track racing! Three-quarters of a mile, and you can see the whole thing from your seat.','My granddaddy came to races here when it was still dirt.'),F('Spring race and fall race. Twice a year this whole lot fills up with campers.','I brought earplugs. You should get some too.')],
  enT:["scooter", "rat", "goose"],readsL:["raceway"],chestsL:["coins50"],lm:[{art:'speedway',x:3,y:1,w:26,h:8,read:'raceway'}]});
ow(-1,2,"Texas Beach & Agecroft",{base:'.',pal:[BRICK,CREAM],rows:["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", "T..XXXXXXXXXX................b.T", "T..XXXXXXXXXX..,,,,,,,,..T...b$T", "T..XXXXXXXXXX..,,,bb,,,......bbT", "T..XXXXXXXXXX..,,,bb,,,....T...T", "T..XXXXXDXXXX..,,,,,,,,........T", "T.......ppp....................T", "T.......ppp...T..@........T....T", "T.T.....ppp...........!........T", "T.......ppp.....................", "T....ppppppppppppppppppppppppppp", "T....ppppppppppppppppppppppppppp", "T...............................", "TKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKT", "Twwwwwwwwwwwww====wwwwwwwwwwwwwT", "TnnrnnnnnMnnnnnnnnnnnnnnnn!nnnnT", "Tnnnnn@nnnnnn!nnnnnnnn@nnnnrnnnT", "TnnnnnnnnnnrnnnnnnnnnnnnnnnnnnnT", "Twwwww~~wrw~~www~~www~~wwwwwwwwT", "Twwwwwww~www~www~wwwrwww~wwwwwwT", "TwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwT", "TwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwT"],
  npcs:[F('Agecroft Hall was built in England back when Henry VII was king. Then somebody shipped it here in crates.','I keep the gardens. The roses don\'t know they\'re on the wrong side of the ocean.'),F('Texas Beach! Sand, rocks and the James. Just mind the current.','You get here over a footbridge across the train tracks and the canal. Half the fun.'),F('The water\'s low enough to rock-hop in late summer.','Byrd Park and Maymont are just east, up the trail.')],
  enT:["goose", "crab", "crab"],readsL:["texasbeach"],doorsL:[{to:"agecroft:0,0"}],chestsL:["coins50"],lm:[{art:'agecroft',x:3,y:1,w:10,h:5,read:'agecroft'}]});
ow(2,-1,"VCU & Court End",{hs:'jw',base:'s',pal:[BRICK,BRICK2,CREAM],rows:["BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", "BsXXXXXXXXXXXsppppsssssssssssssB", "BsXXXXXXXXXXXsppppsXXXXXXXXXstsB", "BsXXXXXXXXXXXsppppsXXXXXXXXXsssB", "BsXXXXXXXXXXXsppppsXXXXXXXXXsssB", "BsXXXXXXXXXXXsppppsXXXXXXXXXstsB", "BsXXXXXDXXXXXsppppsXXXXDXXXXsssB", "BsssssssssssssppppsssssssssssssB", "Bsslssssst@sMsppppssstsssssslssB", "BppppppppppppppppppppppppppppppB", "Bpppp!pppppppppppppppppppppppppB", "Bppppppppppppppppppppppppp!ppppB", "Bpppppppppppppppppppp@pppppppppB", "BsslssssssstssppppssstsssssslssB", "BsXXXXXXXXssssppppsXXXXXXXXXXXsB", "BsXXXXXXXXssssppppsXXXXXXXXXXXsB", "BsXXXXXXXXssssppppsXXXXXXXXXXXsB", "BsXXXXXXXXssssppppsXXXXXXXXXXXsB", "Bsssss@sssssssppppsXXXXXDXXXXXsB", "Bsssssssssss!sppppssssssssssbbbB", "Bsssssssssssssppppssssssssssbb$B", "BBBBBBBBBBBBBBppppBBBBBBBBBBBBBB"],
  npcs:[F('Go Rams! The Siegel Center gets so loud the floor shakes.','They call the defense Havoc. Full-court press, all game long.'),F('I study art at VCU. Half the murals in this city were painted by somebody from my school.','The old Medical College of Virginia buildings are just down the hill.'),{who:"Sally Bell's Kitchen",hat:C3('#f4f4f8','#c8c8d0','#ffffff'),shirt:C3('#d87878','#a84c4c','#f0a0a0'),talk:'sallybell'}],
  enT:["squirrel", "scooter", "rat"],readsL:["vcu"],doorsL:[{to:"siegel:0,0"},{to:"marshall:0,0"},{to:"bhm:0,0"}],chestsL:["coins50"],lm:[{art:'siegel',x:2,y:1,w:11,h:6,read:'vcu'},{art:'marshall',x:19,y:2,w:9,h:5,read:'marshall'},{art:'sallybell',x:2,y:14,w:8,h:4},{art:'armory',x:19,y:14,w:11,h:5,read:'bhm'}],cars:[{y:10,dir:1}]});
ow(4,1,"Canal Walk & Brown's Island",{hs:'ware',base:'.',pal:[BRICK2,BRICK],rows:["BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBT", "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBT", "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBT", "BssslsssssssMsssssssssssssslsssT", "BssssssssssssssssssssssssssssssT", "Bwwwwwww==wwwwwwwwwwww==wwwwwwwT", "Bwwwwwww==wwwwwwwwwwww==wwwwwwwT", "BssssssssssssssssssssssssssssssT", "Bssslsssssssssss@slsssssssslsssT", "ppppppppppppppppppppppp........T", "pppppppppp!pppppppppppp........T", "ppppppppppppppppppppppp........T", "ppppppppppppppppppppppp........T", "B..................XXXXXXXXXX..T", "B..T...!......M....XXXXXXXXXX.TT", "B.........T........XXXXXXXXXX..T", "B.....@................@.......T", "Bnnnnnnnnnnnnnnnnnnn!nnnnnnnnnnT", "Bw-----------------------nnnMnww", "Bww~ww~ww~ww~ww~ww~ww~wwwn`nn$ww", "Bwwww~www~www~www~www~wwwwwwwwww", "Bwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"],
  npcs:[F('The canal boats run right through downtown. Same canal George Washington wanted dug to the Ohio River.','Watch the bridges. Low clearance!'),F('Head out on the Pipeline walk if you want to see herons. They nest on the islands out there.','It\'s a catwalk on top of a big pipe. Don\'t look down if you get dizzy.'),{who:'Festival Host',hat:C3('#f2c14e','#b88a20','#ffe08a'),shirt:C3('#3ac2e8','#1a8ab0','#8ae0f8'),talk:'festival'}],
  enT:["rat", "goose", "crab"],readsL:["canalwalk", "brownsisland", "pipeline"],chestsL:["coins50"],lm:[{art:'stage',x:19,y:13,w:10,h:3,read:'brownsisland'}]});
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
room('science',0,0,'Science Museum of Virginia',{entry:true,style:'station',feats:[['g',3,3],['g',6,3],['g',9,3],['g',12,3],['g',3,6],['g',12,6]],readsT:{g:'sciencemuseum'},
  npcs:[{tx:8,ty:6,who:'Science Guide',hat:C3('#3ac2e8','#1a8ab0','#8ae0f8'),shirt:C3('#f4f4f8','#c8c8d0','#ffffff'),talk:'sciguide'}]});
room('vmhc',0,0,'Virginia Museum of History & Culture',{entry:true,style:'capitol',feats:[['g',3,3],['g',7,3],['g',11,3],['g',3,6],['g',11,6]],readsT:{g:'vmhc'},
  npcs:[{tx:7,ty:6,who:'Historian',hat:C3('#5a5662','#3c3a44','#7a7684'),shirt:C3('#8a3a2a','#5a2418','#a85a44'),talk:'folk',lines:['Virginia\'s story is long and not always kind. We try to tell all of it.','Have you seen Arthur Ashe\'s name on the street signs out front?']}]});
room('jefferson',0,0,'The Jefferson Hotel',{entry:true,style:'hotel',feats:[['w',6,3,4,2],['Y',3,3],['Y',12,3]],reads:{'3,3':'jefferson','12,3':'jefferson'},
  npcs:[{tx:11,ty:6,who:'Bellhop',hat:C3('#8a1424','#5a0c18','#b02030'),shirt:C3('#8a1424','#5a0c18','#b02030'),talk:'bellhop'}]});
room('siegel',0,0,'The Siegel Center',{entry:true,style:'gym',feats:[['h',1,2,4,1],['h',11,2,4,1],['h',1,4,3,1],['h',12,4,3,1]],
  npcs:[{tx:8,ty:3,who:'Rams Coach',hat:C3('#f2c14e','#b88a20','#ffe08a'),shirt:C3('#1a1a24','#0c0c14','#3a3a48'),talk:'hoops'}]});
room('marshall',0,0,'John Marshall House',{entry:true,style:'mansion',feats:[['g',3,3],['g',12,3],['V',6,2,4,1]],readsT:{g:'marshall'},
  npcs:[{tx:7,ty:6,who:'Docent',hat:C3('#e8e4dc','#b0aca4','#ffffff'),shirt:C3('#2e4a8a','#1c2e5a','#4a6ab0'),talk:'folk',lines:['Marshall lived here for more than forty years. He walked to market and carried home his own groceries.','The Court\'s biggest early decisions were written by the man who slept upstairs.']}]});
room('bhm',0,0,'Black History Museum',{entry:true,style:'armory',feats:[['g',3,3],['g',6,3],['g',9,3],['g',12,3],['g',3,6],['g',12,6]],readsT:{g:'bhm'},
  npcs:[{tx:8,ty:6,who:'Museum Guide',hat:C3('#2a2a32','#14141a','#4a4a54'),shirt:C3('#f2c14e','#b88a20','#ffe08a'),talk:'folk',lines:['Jackson Ward is right down the street. Maggie Walker\'s bank, the Hippodrome, all of it.','This building has been an armory, a school and now a museum. It has seen a lot of Richmond.']}]});
room('agecroft',0,0,'Agecroft Hall',{entry:true,style:'poe',feats:[['g',3,3],['g',12,3],['h',5,2,6,1],['O',7,5,2,1]],readsT:{g:'agecroft'},
  npcs:[{tx:11,ty:6,who:'Tudor Guide',hat:C3('#1a1a24','#0c0c14','#3a3a48'),shirt:C3('#58a850','#2f7a3c','#90d070'),talk:'folk',lines:['Every beam in this hall crossed the ocean in a crate. They numbered the pieces so it would go back together.','The great hall\'s windows came from England too. Old glass, a little wavy.']}]});


const FL=(who,c,...lines)=>({who,hat:FOLKC[c][0],shirt:FOLKC[c][1],talk:'folk',lines});
room('taproom',0,0,"Scott's Addition Taproom",{entry:true,style:'tap',feats:[['V',3,3,10,1],['a',3,6],['a',7,6],['a',11,6],['a',5,8],['a',10,8]],
  npcs:[Object.assign(N('brewer'),{tx:7,ty:2}),Object.assign(FL('Regular',4,'They brew a ginger beer here that could wake the dead. Bad choice of words, with all that\'s going on.','Try the brewer. Free refills for heroes.'),{tx:13,ty:7})]});
room('tearoom',0,0,'Miller & Rhoads Tea Room',{entry:true,style:'tea',feats:[['a',3,3],['a',6,3],['a',9,3],['a',12,3],['a',4,6],['a',11,6],['u',1,1],['u',14,1]],
  npcs:[Object.assign(FL('Santa',2,'Ho ho! You\'re early. It\'s not even December!','I\'ve been coming to Richmond\'s department stores for a very long time. Don\'t tell anyone how long.'),{tx:8,ty:2}),
        Object.assign(FL('Waiter',3,'Chicken salad and a Missouri Club, the house favorites.','Booths by the window fill up fast at Christmas.'),{tx:3,ty:8})]});
room('hippo',0,0,'The Hippodrome',{entry:true,style:'hippo',feats:[['V',3,2,10,1],['h',2,5,5,1],['h',9,5,5,1],['h',2,7,5,1],['h',9,7,5,1]],
  npcs:[Object.assign(FL('Bandleader',4,'Jazz greats played this stage when Jackson Ward was the Harlem of the South.','Tonight we play for whoever wanders in out of the fog.'),{tx:8,ty:1})]});
room('stjohn',0,0,"St. John's Church",{entry:true,style:'church',feats:[['V',7,2,2,1],['h',2,4,5,1],['h',9,4,5,1],['h',2,6,5,1],['h',9,6,5,1]],readsT:{V:'stjohns'},
  npcs:[Object.assign(FL('Docent',3,'Patrick Henry stood about where you\'re standing. The pews are original to the 1700s church, mostly.','Edgar Allan Poe\'s mother is buried in the churchyard outside.'),{tx:12,ty:2})]});
room('shop',0,0,'Carytown Goods',{entry:true,style:'shop',feats:[['V',4,4,8,1],['u',1,1],['u',14,1],['V',1,2,2,1],['V',13,2,2,1]],
  npcs:[Object.assign(N('shop'),{tx:8,ty:3})]});
room('rowhouse',0,0,'A Fan Row House',{entry:true,style:'home',feats:[['V',3,2,3,1],['a',10,3],['u',13,1],['u',2,7],['i',11,7]],
  npcs:[Object.assign(FL('Neighbor',5,'Come in out of the fog! This house is over a hundred years old. The floors creak in every room.','Cats? Oh, those belong to the whole block.'),{tx:7,ty:5})]});
room('station',0,0,'Main Street Station',{entry:true,style:'station',feats:[['V',5,3,6,1],['i',2,6],['i',3,6],['i',12,6],['i',13,6],['i',2,8],['i',13,8]],
  npcs:[Object.assign(FL('Ticket Agent',2,'Trains north to Washington and east to Newport News. Nothing to Church Hill anymore.','The old train shed out back is bigger than it looks.'),{tx:8,ty:2}),
        Object.assign(FL('Traveler',1,'I came down from New York. Nobody warned me about the fog.'),{tx:9,ty:7})]});
room('mansion',0,0,'Maymont House',{entry:true,style:'mansion',statue:'marble',feats:[['V',6,2,4,1],['Y',2,2],['Y',13,2],['a',4,6],['a',11,6],['u',1,8],['u',14,8]],
  npcs:[Object.assign(FL('Docent',3,'The Dooleys furnished every room with treasures from their travels.','Mrs. Dooley left the whole estate to the city. Wasn\'t that something?'),{tx:8,ty:4})]});
room('boathouse',0,0,'Rocketts Boathouse',{entry:true,style:'boat',feats:[['w',9,2,5,5],['=',8,4,1,2],['V',2,2,3,1],['u',2,7]],
  npcs:[Object.assign(FL('Old Captain',4,'Tall ships used to tie up all along this shore. Now it\'s kayaks and paddleboards.','Keep your kayak pointed downstream and the James will carry you.'),{tx:5,ty:4})]});
room('stonehouse',0,0,'Stone House Arcade',{entry:true,style:'arcade',feats:[['O',2,2],['O',4,2],['O',11,2],['O',13,2],['O',2,6],['O',13,6]],readsT:{O:'!arcade'},
  npcs:[Object.assign(FL('Attendant',0,'Back when this was an amusement park, kids spent pennies in machines right here in the house.','The machines don\'t work anymore. Most of them.'),{tx:8,ty:4})]});
room('studio',0,0,'Manchester Art Studio',{entry:true,style:'studio',feats:[['Y',3,2],['Y',6,2],['Y',9,2],['u',13,2],['a',11,6]],
  npcs:[Object.assign(FL('Artist',1,'Half the walls in Manchester have a mural on them now. Some of them are mine.','The light off the river is the best in the city for painting.'),{tx:7,ty:5})]});

/* ---------- neighborhood challenges ---------- */
const CHAL={
  flies:{name:'Shag Flies',type:'collect',time:30,ic:'ball',intro:'Fly balls are dropping all over the field. Grab every one before time runs out!'},
  bus:{name:'Catch the Bus',type:'race',time:8,intro:'My bus leaves from the shelter at the east end of Broad. Beat me there and you win!'},
  taps:{name:'Lost Taps',type:'collect',time:40,ic:'tap',intro:'The taps came off my shoes and scattered all over Jackson Ward. Find all six!'},
  lamps:{name:'Light the Gas Lamps',type:'light',time:60,intro:'The fog snuffed every gas lamp on Church Hill. Light them all with your lantern!'},
  melons:{name:'Melon Roundup',type:'collect',time:35,ic:'melon',intro:'A crate tipped over and melons rolled all down Cary Street. Gather them up!'},
  tenk:{name:'Monument Avenue 10K',type:'race',time:9,intro:'Race me to the finish flag at the west end of Monument Avenue! Go!'},
  quiz:{name:'Richmond History Quiz',type:'quiz',intro:'Three questions about stories in your journal. Ready?'},
  rats:{name:'Market Rats',type:'defeat',time:40,foe:'rat',n:8,intro:'Rats are swarming the 17th Street Market. Clear out eight of them!'},
  lures:{name:'Lost Lures',type:'collect',time:60,ic:'lure',needs:'bug',intro:'My fishing lures snagged on the little islands in the lake. Fetch all four!'},
  ghosts:{name:'Restless Spirits',type:'defeat',time:45,foe:'ghost',n:6,intro:'Ghosts are rising all over the cemetery. Lay six of them to rest!'},
  cleanup:{name:'River Cleanup',type:'collect',time:40,ic:'trash',intro:'The flood left trash all over the island. Pick up all six pieces!'},
  crabs:{name:'Crab Catch',type:'defeat',time:40,foe:'crab',n:6,intro:'The crabs are thick at Rocketts today. Bag six of them!'},
  trolley:{name:'Last Trolley',type:'race',time:7,intro:'Run the old trolley line to the end of the tracks, east of here, before the bell!'},
  murals:{name:'Mural Hunt',type:'tag',time:60,intro:'Five murals are hidden on walls around Manchester. Find them all and press A at each!'}
};
const NCHAL=Object.keys(CHAL).length;

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
/* dungeon 5: Tredegar Iron Works -> grappling hook, the Iron Foreman */
room('tredegar',0,2,'Foundry Gate',{entry:true,feats:[['W',3,3],['W',12,3],['M',3,6]],reads:{'3,6':'tredegar'},en:[['rat',6,4],['rat',10,6],['bat',8,3]]});
room('tredegar',1,2,'Pattern Shop',{solve:'clear',feats:[['_',9,1,6,1],['_',9,2,1,2],['_',14,2,1,2],['_',9,4,6,2],['+',12,2],['+',12,7]],
  en:[['rat',4,6],['rat',6,8],['bat',3,3],['bat',7,2]],chests:[{id:'t1',tx:4,ty:3,item:'hook',appear:true},{id:'t2',tx:11,ty:2,item:'key'}]});
room('tredegar',0,1,'Casting Floor',{solve:'clear',feats:[['_',1,4,14,3],['+',7,2],['+',8,8],['W',2,8],['W',13,8]],
  en:[['bat',4,2],['bat',11,2],['bat',8,5]],chests:[{id:'t3',tx:3,ty:2,item:'coins50'}]});
room('tredegar',0,0,'Furnace Hall',{bossT:'foreman',feats:[['W',3,3],['W',12,3],['W',3,7],['W',12,7]],en:[['foreman',8,4]]});
link('tredegar','0,2','E','1,2','open');link('tredegar','0,2','N','0,1','lock');link('tredegar','0,1','N','0,0','gate');

/* dungeon 6: the Conservatory at Lewis Ginter -> watering can, the Titan Arum */
room('conserv',0,2,'Palm House',{entry:true,feats:[['T',3,3],['T',12,3],['T',3,7],['T',12,7],[',',6,2,4,1]],en:[['rat',6,5],['rat',10,6],['bat',8,3]]});
room('conserv',1,2,'Orchid Room',{solve:'clear',feats:[['_',9,1,6,2],['_',9,3,3,2],['_',14,3,1,2],['_',9,5,6,4],['z',8,4],[',',2,7,4,2]],
  en:[['rat',4,6],['bat',3,3],['bat',6,7],['squirrel',5,4]],chests:[{id:'g1',tx:4,ty:2,item:'can',appear:true},{id:'g2',tx:12,ty:3,item:'key'}]});
room('conserv',0,1,'Fern Gully',{solve:'clear',feats:[['_',1,4,14,3],['z',5,7],['z',10,3],['T',2,2],['T',13,8]],en:[['bat',4,2],['bat',11,8],['bat',8,5]],chests:[{id:'g3',tx:12,ty:2,item:'coins50'}]});
room('conserv',0,0,'Under the Dome',{bossT:'arum',feats:[[',',2,2,3,2],[',',11,2,3,2],['T',2,7],['T',13,7]],en:[['arum',8,3]]});
link('conserv','0,2','E','1,2','open');link('conserv','0,2','N','0,1','lock');link('conserv','0,1','N','0,0','gate');

/* finale: the tunnel */
room('tunnel',0,1,'Church Hill Tunnel',{entry:true,feats:[['k',7,1,2,8],['r',3,2],['r',12,6],['r',4,7],['M',2,5]],reads:{'2,5':'tunnel'},en:[['bat',4,4],['bat',11,4],['bat',10,7]]});
room('tunnel',0,0,'Engine 231',{bossT:'vampire',feats:[['k',7,3,2,7],['Z',6,1,4,2]],readsT:{Z:'!engine'},en:[['vampire',8,5]]});
room('tunnel',1,1,'Flooded Siding',{feats:[['w',8,2,7,7],['F',11,5],['k',1,5,7,1],['r',3,2],['r',4,8]],en:[['crab',4,4],['crab',5,7],['bat',11,2]],items:[{id:'tunkey',kind:'skey',px:184,py:88}]});
room('tunnel',1,0,'Signal Room',{solve:'lit',braz:[[3,2],[12,2],[3,8],[12,8]],feats:[['k',1,5,14,1],['W',6,3],['W',9,7]],en:[['ghost',5,5],['ghost',10,4],['bat',8,7]]});
link('tunnel','0,1','E','1,1','bomb');link('tunnel','1,1','N','1,0','lock');link('tunnel','1,0','W','0,0','gate');

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
      const m=[],npc=[],en=[],rd=[],dr=[],it=[],pc=[],spots=[],chs=[],birds=[],lamps=[],murals=[];
      rows.forEach((r,y)=>{if(r.length!==s.w)throw new Error(s.name+' row '+y+' is '+r.length+' wide, expected '+s.w);m.push([]);
        for(let x=0;x<s.w;x++){let ch=r[x];
          if(ch=='@'){npc.push([x,y]);ch=s.base;}else if(ch=='!'){en.push([x,y]);ch=s.base;}else if(ch=='*'){pc.push([x,y]);ch=s.base;}else if(ch=='&'){it.push([x,y]);ch=s.base;}
          else if(ch=='?'){spots.push([x,y]);ch=s.base;}else if(ch=='$'){chs.push([x,y]);ch=s.base;}else if(ch=='`'){birds.push([x,y]);ch=s.base;}
          if(ch=='l')lamps.push([x,y]);if(ch=='e')murals.push([x,y]);
          else if(ch=='v'){s.dyn.push({cells:[[x,y]],closed:'%',open:s.base,flag:'rub:'+id+':'+x+','+y});ch='%';}
          else if(ch=='%'){s.dyn.push({cells:[[x,y]],closed:'%',open:'D',flag:'rub:'+id+':'+x+','+y});dr.push([x,y]);}
          if('MYGQ'.includes(ch))rd.push([x,y]);if(ch=='D')dr.push([x,y]);
          m[y].push(ch);}});
      const need=(a,b,what)=>{if(a.length!==(b||[]).length)throw new Error(s.name+': '+a.length+' '+what+' placeholders but '+(b||[]).length+' listed');};
      need(npc,s.npcs,'person');need(chs,s.chestsL,'chest');
      s.spots=spots;s.birds=birds;s.lamps=lamps;s.murals=murals;s.chests=chs.map((q,i)=>({id:'ch:'+id,tx:q[0],ty:q[1],item:s.chestsL[i]}));
      for(const L of s.lm||[])for(let yy=L.y;yy<L.y+L.h;yy++)for(let xx=L.x;xx<L.x+L.w;xx++)if(!'XD%'.includes(rows[yy][xx]))throw new Error(s.name+': landmark '+L.art+' covers '+rows[yy][xx]+' at '+xx+','+yy);need(en,s.enT,'enemy');need(rd,s.readsL,'marker');need(dr,s.doorsL,'door');need(it,s.itemsL,'item');
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
for(const id in SC)for(const n of SC[id].npcs||[]){n.x=n.tx*TS+8;n.y=n.ty*TS+8;n.hx=n.x;n.hy=n.y;n.f=1;n.t=0;n.vx=0;n.vy=0;}
const AREAB={};for(const id in SC){const s=SC[id],b=AREAB[s.area]||(AREAB[s.area]={x0:9,y0:9,x1:0,y1:0});b.x0=Math.min(b.x0,s.ax);b.y0=Math.min(b.y0,s.ay);b.x1=Math.max(b.x1,s.ax);b.y1=Math.max(b.y1,s.ay);}
