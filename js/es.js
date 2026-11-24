"use strict";
/* River City Quest: Spanish. Menus, items, quests, awards, cards, hints, the opening and the shop.
   Dialog and journal stories are still English. tr() falls back to English for anything not listed. */
const ES={
 // menus and tabs
 'ITEMS':'BOLSA','GEAR':'DATOS','QUEST':'TAREA','STORY':'NOTAS','CARDS':'CARTA','PHOTO':'FOTOS','AWARD':'LOGRO','MAP':'MAPA',
 'A: put on B   B: next tab':'A: poner en B   B: otra pestaña','A: read   B: next tab':'A: leer   B: otra pestaña','B: next tab':'B: otra pestaña','B: next tab   MENU: close':'B: otra pestaña   MENÚ: cerrar',
 'A: read the card':'A: leer la carta','A: look   B: next tab':'A: ver   B: otra pestaña','A: share   B: back':'A: compartir   B: volver','Buy a camera at the Carytown shop':'Compra una cámara en la tienda de Carytown',
 'Not taken yet. Use the camera near it.':'Aún no tomada. Usa la cámara cerca.','Arrows: pick a place   B: next tab':'Flechas: elige un lugar   B: otra pestaña',
 'You haven\'t found this yet.':'Todavía no lo has encontrado.','???':'???','Kayak Paddle':'Remo de kayak','A swings. Hold, let go: spin.':'A golpea. Mantén y suelta: giro.',
 'Cast-Iron Shield':'Escudo de hierro','Bounces shots you face.':'Rebota los disparos de frente.','Somewhere in iron and stone.':'En algún lugar de hierro y piedra.',
 'Four pieces grow a heart.':'Cuatro piezas forman un corazón.','Small keys work where found.':'Las llaves sirven donde se encuentran.','Kayak':'Kayak','Paddle across whitewater.':'Rema por los rápidos.',
 'Someone on the river has one.':'Alguien en el río tiene uno.','Quest item: none':'Objeto de misión: ninguno','People around town need help.':'La gente del pueblo necesita ayuda.',
 'Every pin earns a golden paddle.':'Todos los pines dan un remo dorado.','Golden Paddle: double damage!':'Remo dorado: ¡doble daño!',
 // items
 'Gas Lantern':'Farol de gas','Baseballs':'Pelotas de béisbol','Blasting Powder':'Pólvora','The Gold-Bug':'El Escarabajo de Oro','Running Shoes':'Zapatillas','Grappling Hook':'Garfio',
 'Fishing Rod':'Caña de pescar','Watering Can':'Regadera','Camera':'Cámara','Picnic Basket':'Cesta de picnic','Bicycle':'Bicicleta','Ginger Beer':'Cerveza de jengibre',
 'Lights a cold brazier in front of you. Carrying it also pushes back the dark underground.':'Enciende un brasero frente a ti. También aleja la oscuridad bajo tierra.',
 'Throws a ball straight ahead. Refill at the Carytown shop or from the ballplayer.':'Lanza una pelota hacia adelante. Recarga en la tienda de Carytown o con el beisbolista.',
 'Sets a keg down that blows a moment later. Cracked walls and rubble give way.':'Deja un barril que explota al momento. Las paredes agrietadas y los escombros ceden.',
 'Flies out and back, stunning small foes and fetching anything it touches, even over water.':'Vuela y regresa, aturde a enemigos pequeños y trae lo que toca, incluso sobre el agua.',
 'Dash straight ahead. Small foes get bowled over, and nothing can hurt you mid-dash.':'Corre en línea recta. Derribas a los enemigos pequeños y nada te hiere al correr.',
 'Fires a chain ahead. Hook an iron post to fly over a gap. It yanks armor loose, too.':'Lanza una cadena. Engancha un poste de hierro para cruzar un hueco. También arranca armaduras.',
 'Cast into water with B. Press A when it bites, then tap A to reel. Mind the tension!':'Lanza al agua con B. Pulsa A cuando pique y toca A para recoger. ¡Cuidado con la tensión!',
 'Water a sprout and it grows like crazy, even across a gap. Some big plants like it too.':'Riega un brote y crece muchísimo, incluso sobre un hueco. A algunas plantas grandes también les gusta.',
 'Snap a photo of a landmark to add it to your album. Weather and time of day show in the shot.':'Fotografía un monumento para tu álbum. El clima y la hora salen en la foto.',
 'Eat food you bought or cooked. Cook at the stove in your row house in the Fan.':'Come lo que compraste o cocinaste. Cocina en la estufa de tu casa en el Fan.',
 'Hop on or off with B. Fast on paths and sidewalks. You can\'t swing while riding.':'Sube o baja con B. Rápida en caminos y aceras. No puedes golpear mientras pedaleas.',
 'Drink it to refill every heart. The brewer in Scott\'s Addition refills it for free.':'Bébela para llenar todos los corazones. El cervecero de Scott\'s Addition la rellena gratis.',
 // title and options
 'IMPORT SAVE CODE':'IMPORTAR CÓDIGO','OPTIONS':'OPCIONES','CONTINUE':'CONTINUAR','NEW GAME':'NUEVA PARTIDA','NEW GAME+':'NUEVA PARTIDA+','BOSS RUSH':'DESAFÍO DE JEFES','COPY SAVE CODE':'COPIAR CÓDIGO',
 'BACK':'VOLVER','YES, ERASE IT':'SÍ, BORRAR','NO':'NO','CONTROLS':'CONTROLES','RESET KEYS':'RESTABLECER TECLAS','B: back':'B: volver','Gamepad: A, X/B, Start':'Mando: A, X/B, Start',
 'Arrows and Enter always work. Gamepads too.':'Las flechas y Enter siempre funcionan. Los mandos también.','The Tunnel Under Church Hill':'El túnel bajo Church Hill',
 'WHAT\'S YOUR NAME?':'¿CÓMO TE LLAMAS?','A: pick   B: erase   MENU: done':'A: elegir   B: borrar   MENÚ: listo','PRESS A':'PULSA A','B: share your time':'B: comparte tu tiempo',
 'THE FOG LIFTS':'SE LEVANTA LA NIEBLA','Richmond is safe.':'Richmond está a salvo.','THE LAMPS COME BACK ON':'LOS FAROLES SE ENCIENDEN',
 // quests
 'Find the four keystones':'Encuentra las cuatro claves','Unseal the Church Hill Tunnel':'Abre el túnel de Church Hill','Trade your way to a kayak':'Intercambia hasta un kayak',
 'Find the Carillon key':'Encuentra la llave del Carillón','Return a lost race bib':'Devuelve un dorsal perdido','Tredegar Iron Works':'Fundición Tredegar','The Conservatory':'El Invernadero',
 'Rebuild the bateau':'Reconstruye el bateau','Count frogs in the rain':'Cuenta ranas bajo la lluvia','Win neighborhood pins':'Gana pines de barrio','Find heart pieces':'Encuentra piezas de corazón',
 'Find hidden secrets':'Encuentra secretos','Collect landmark cards':'Colecciona cartas','Mini-game medals':'Medallas de minijuegos','Adopt a dog':'Adopta un perro',
 'Fill the photo album':'Llena el álbum de fotos','First Friday paintings':'Cuadros del First Friday',
 // awards
 'First Light':'Primera luz','Get the gas lantern':'Consigue el farol de gas','Keystone Keeper':'Guardián de claves','Find all four keystones':'Encuentra las cuatro claves',
 'Fog Lifter':'Disipa niebla','Beat the thing in the tunnel':'Vence a la cosa del túnel','Iron Will':'Voluntad de hierro','Beat the Iron Foreman':'Vence al Capataz de Hierro',
 'Green Thumb':'Mano verde','Beat the Titan Arum':'Vence al Aro Gigante','City Pinned':'Ciudad de pines','Win all 14 neighborhood pins':'Gana los 14 pines','Local Historian':'Historiador local',
 'Fill the whole journal':'Completa el diario','Card Shark':'Coleccionista','Collect all 12 landmark cards':'Reúne las 12 cartas','Angler':'Pescador','Catch all five kinds of fish':'Pesca los cinco tipos de pez',
 'Boat Builder':'Constructor','Frog Counter':'Contador de ranas','Finish the frog count':'Termina el conteo de ranas','Whole Heart':'Corazón entero','Find all eight heart pieces':'Encuentra las ocho piezas',
 'Night Watch':'Guardia nocturna','Beat 25 foes after dark':'Vence a 25 enemigos de noche','Deep Pockets':'Bolsillos llenos','Carry 999 coins':'Lleva 999 monedas','Speedrunner':'Velocista',
 'Beat the game in under an hour':'Termina en menos de una hora','Again!':'¡Otra vez!','Beat New Game+':'Termina Nueva Partida+','Secret Keeper':'Guardasecretos','Find every hidden stash':'Encuentra todos los escondites',
 'Slugger':'Bateador','Hit 3 homers in one round':'3 jonrones en una ronda','Pinball Wizard':'Mago del pinball','Score 8,000 at pinball':'8.000 puntos en pinball','Derby Champ':'Campeón del derby',
 'Win gold in the derby':'Oro en el derby','Good Dog':'Buen perro','Adopt a dog from the shelter':'Adopta un perro del refugio','Shutterbug':'Fotógrafo','Photograph every landmark':'Fotografía todos los monumentos',
 'Home Cook':'Cocinero','Cook all three recipes':'Cocina las tres recetas','Trail Blazer':'Pionero','Win gold on the Capital Trail':'Oro en el Capital Trail','Art Walk':'Paseo de arte','Find the curator\'s paintings':'Encuentra los cuadros',
 // hints (goal)
 'Talk to the archivist beside the Capitol.':'Habla con la archivista junto al Capitolio.','Cross the footbridge south of Capitol Square to the Belle Isle quarry.':'Cruza el puente peatonal al sur de Capitol Square hasta la cantera de Belle Isle.',
 'Blast the rubble off the pyramid door in Hollywood Cemetery.':'Vuela los escombros de la puerta de la pirámide en Hollywood Cemetery.','Find the Poe Museum cellar in Shockoe Bottom.':'Encuentra el sótano del Museo Poe en Shockoe Bottom.',
 'Climb the Carillon in Byrd Park.':'Sube al Carillón en Byrd Park.','Paddle south to Forest Hill Park and look for the Carillon key.':'Rema al sur hasta Forest Hill Park y busca la llave del Carillón.',
 'Someone hungry in the Fan might trade for that watermelon.':'Alguien con hambre en el Fan podría cambiar esa sandía.','The organist at the Byrd Theatre would love that sheet music.':'Al organista del Teatro Byrd le encantaría esa partitura.',
 'The kayaker on Belle Isle wants that river map.':'La kayakista de Belle Isle quiere ese mapa del río.','Ask the Carillon caretaker in Byrd Park, then visit the melon vendor in Carytown.':'Pregunta a la cuidadora del Carillón en Byrd Park y luego visita al vendedor de sandías en Carytown.',
 'Take all four keystones to the tunnel on Church Hill.':'Lleva las cuatro claves al túnel de Church Hill.','Explore Tredegar Iron Works, in the corner of Hollywood Cemetery.':'Explora la Fundición Tredegar, en una esquina de Hollywood Cemetery.',
 'Explore the conservatory at Lewis Ginter Botanical Garden, north of Bryan Park.':'Explora el invernadero del Jardín Botánico Lewis Ginter, al norte de Bryan Park.',
 'Help the river historian at Ancarrow\'s Landing rebuild a bateau.':'Ayuda al historiador del río en Ancarrow\'s Landing a reconstruir un bateau.',
 'Count frogs for the naturalist in Byrd Park on a rainy day.':'Cuenta ranas para la naturalista de Byrd Park un día de lluvia.','Try for every award, or start New Game+ from the title screen.':'Busca todos los logros o empieza Nueva Partida+ desde el título.',
 // opening and credits
 'Richmond, Virginia. The River City, where the James tumbles over the falls.':'Richmond, Virginia. La Ciudad del Río, donde el James cae por los rápidos.',
 'One autumn night a cold fog rose off the river, and the gas lamps began to go out, block by block.':'Una noche de otoño subió una niebla fría del río, y los faroles de gas se apagaron cuadra por cuadra.',
 'Deep under Church Hill, in a railroad tunnel sealed since 1925, something woke up.':'Bajo Church Hill, en un túnel de tren sellado desde 1925, algo despertó.',
 'Made by doodersrage':'Hecho por doodersrage','with Claude':'con Claude','Set in Richmond, Virginia':'Ambientado en Richmond, Virginia','The real places are worth a visit.':'Los lugares reales merecen una visita.','Learn more from:':'Aprende más en:','Thanks for playing!':'¡Gracias por jugar!',
 // shop and mini-games
 'CARYTOWN GOODS':'TIENDA DE CARYTOWN','17TH STREET MARKET':'MERCADO DE LA CALLE 17','Fresh from the farms!':'¡Recién llegado del campo!','What can I get you?':'¿Qué te sirvo?','Cupcake':'Cupcake','Come back any time!':'¡Vuelve cuando quieras!','A: buy   B: leave':'A: comprar   B: salir','Thank you kindly!':'¡Muchas gracias!','Not enough coins.':'No tienes suficientes monedas.','SOLD OUT':'AGOTADO','FULL':'LLENO',
 'Landmark Card Pack':'Sobre de cartas','Big Satchel':'Bolsa grande','Heart Charm':'Amuleto de corazón','10 Baseballs':'10 pelotas','4 Powder Kegs':'4 barriles','Carytown Cupcake':'Cupcake de Carytown',
 'Virginia Ham':'Jamón de Virginia','Bag of Flour':'Bolsa de harina','Bag of Sugar':'Bolsa de azúcar','Braided Rug':'Alfombra trenzada','Potted Fern':'Helecho en maceta','Fish Tank':'Pecera','Upright Piano':'Piano vertical',
 'A: swing   MENU: quit':'A: batear   MENÚ: salir','B: left flipper   A: right flipper   MENU: quit':'B: aleta izq.   A: aleta der.   MENÚ: salir','Steer with left and right':'Gira con izquierda y derecha',
 'HOME RUN!':'¡JONRÓN!','Base hit!':'¡Hit!','Ball lost!':'¡Bola perdida!',
 // common toasts
 'Head back outside to catch a bus.':'Sal afuera para tomar el autobús.','You haven\'t been there yet.':'Todavía no has estado allí.','You hop on the bike.':'Te subes a la bici.','You hop off the bike.':'Te bajas de la bici.',
 'Face open water to cast.':'Mira hacia el agua para lanzar.','Nothing on B. Press MENU to pick an item.':'Nada en B. Pulsa MENÚ para elegir un objeto.','Challenge abandoned.':'Desafío abandonado.',
 'A chest appeared!':'¡Apareció un cofre!',
 'Move with the pad or the arrow keys.':'Muévete con el control o las flechas.','Walk up to the archivist and press A to talk.':'Acércate a la archivista y pulsa A para hablar.',
 'Press A away from people to swing your paddle.':'Pulsa A lejos de la gente para golpear con el remo.','Press B to use the item on B. Right now that is your lantern.':'Pulsa B para usar el objeto de B. Ahora es tu farol.',
 'Press MENU to see your items, quests and map.':'Pulsa MENÚ para ver objetos, misiones y mapa.','In the MENU, press B to flip tabs until you reach MAP. The star marks your next goal.':'En el MENÚ, pulsa B para pasar pestañas hasta el MAPA. La estrella marca tu próximo objetivo.',
 "You're all set! Follow the star on your map.":'¡Listo! Sigue la estrella de tu mapa.',
'First Friday! Galleries open late.':'¡First Friday! Galerías abiertas.','Award: Good Dog!':'Logro: ¡Buen perro!','A hidden way opens!':'¡Se abre un camino oculto!','Save the bike for outdoors.':'Guarda la bici para afuera.'};
const ESP=[[/^Shot (\d+)\/10   Made (\d+)$/,"Tiro $1/10   Encestados $2"],[/^Returns (\d+)   Misses (\d+)\/3$/,"Devoluciones $1   Fallos $2/3"],[/^Return (\d+)!$/,"¡Devolución $1!"],[/^Missed! \((\d+) left\)$/,"¡Fallaste! (quedan $1)"],[/^Firefly! \((\d+)\)$/,"¡Luciérnaga! ($1)"],[/^(\d+) of 10 from the line\.$/,"$1 de 10 desde la línea."],[/^(\d+) returns before three misses\.$/,"$1 devoluciones antes de tres fallos."],[/^A Hanover tomato\. You have (\d+)\.$/,"Un tomate de Hanover. Tienes $1."],[/^Stories found (\d+)\/(\d+)$/,'Historias $1/$2'],[/^Cards (\d+)\/(\d+)   Fish caught (\d+)$/,'Cartas $1/$2   Peces $3'],[/^Awards (\d+)\/(\d+)$/,'Logros $1/$2'],[/^Quests (\d+)\/(\d+)$/,'Tareas $1/$2'],
  [/^Photos (\d+)\/(\d+)$/,'Fotos $1/$2'],[/^SOUND: ON$/,'SONIDO: SÍ'],[/^SOUND: OFF$/,'SONIDO: NO'],[/^VIBRATION: ON$/,'VIBRACIÓN: SÍ'],[/^VIBRATION: OFF$/,'VIBRACIÓN: NO'],[/^TIMER: ON$/,'CRONO: SÍ'],[/^TIMER: OFF$/,'CRONO: NO'],
  [/^TEXT: BIG$/,'TEXTO: GRANDE'],[/^TEXT: NORMAL$/,'TEXTO: NORMAL'],[/^COLOR ASSIST: ON$/,'AYUDA DE COLOR: SÍ'],[/^COLOR ASSIST: OFF$/,'AYUDA DE COLOR: NO'],[/^CALM MODE: ON$/,'MODO CALMA: SÍ'],[/^CALM MODE: OFF$/,'MODO CALMA: NO'],
  [/^BUTTONS: SMALL$/,'BOTONES: PEQUEÑOS'],[/^BUTTONS: MEDIUM$/,'BOTONES: MEDIANOS'],[/^BUTTONS: LARGE$/,'BOTONES: GRANDES'],[/^SLOT (\d)  - EMPTY -$/,'RANURA $1  - VACÍA -'],[/^SLOT (\d)  (.*)$/,'RANURA $1  $2'],
  [/^NEXT: /,'SIGUIENTE: '],[/^A: ride the bus to (.*)$/,'A: autobús a $1'],[/^Pitch (\d+)\/10   Hits (\d+)   HR (\d+)$/,'Lanzamiento $1/10   Hits $2   JR $3'],[/^Get it: (.*)$/,'Cómo: $1'],
  [/^Hearts (\d+)  Pieces (\d+)\/4$/,'Corazones $1  Piezas $2/4'],[/^Coins (\d+)  Keys (.*)$/,'Monedas $1  Llaves $2'],[/^Keystones (\d)\/4$/,'Claves $1/4'],[/^Stories (\d+)\/(\d+)  Pins (\d+)\/(\d+)$/,'Historias $1/$2  Pines $3/$4'],
  [/^Starring (.*)$/,'Con $1'],[/^TIP (\d)\/(\d)$/,'CONSEJO $1/$2'],[/^MUSIC: (\d+)%$/,'MÚSICA: $1%'],[/^EFFECTS: (\d+)%$/,'EFECTOS: $1%'],[/^You got the (.*)!$/,'¡Conseguiste: $1!'],[/^You got a (.*)!$/,'¡Conseguiste: $1!'],[/^You found the (.*)!$/,'¡Encontraste: $1!'],[/^Ball (\d) of 3$/,'Bola $1 de 3'],[/^Pitch (\d+) of 10$/,'Lanzamiento $1 de 10'],[/^Time (.*)$/,'Tiempo $1']];
let ESFRAG=null;
function trLong(s){if(typeof OPT=='undefined'||OPT.lang!='es'||typeof s!='string')return s;const t=tr(s);if(t!==s)return t;
  if(!ESFRAG)ESFRAG=Object.keys(ESX).filter(k=>k.length>=10).sort((a,b)=>b.length-a.length);let out=s;for(const k of ESFRAG)if(out.includes(k))out=out.split(k).join(ESX[k]);return out;}
function tr(s){if(typeof OPT=='undefined'||OPT.lang!='es'||typeof s!='string')return s;if(ES[s])return ES[s];if(typeof ESX!='undefined'&&ESX[s])return ESX[s];for(const [re,to] of ESP)if(re.test(s))return s.replace(re,to);return s;}
