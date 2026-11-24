# River City Quest

A top-down adventure game set in Richmond, Virginia. A cold fog has rolled up off the James. Find four keystones hidden in the Belle Isle quarry, the Hollywood Cemetery pyramid, the Poe Museum cellar and the Carillon, unseal the Church Hill Tunnel, and face what's been down there since 1925.

**Play it:** https://doodersrage.github.io/river-city-quest/

On a phone, use your browser's "Add to Home Screen" (or the INSTALL button when it appears) to run it full screen like an app. It works offline after the first visit.

## Controls

| | Phone | Keyboard |
|---|---|---|
| Move | Thumb pad | Arrows or WASD |
| A: swing, talk, read, open, push | A button | Z, J or Space |
| Spin attack | Hold A after a swing, then let go | Same |
| B: use the equipped item | B button | X or K |
| Inventory, journal, map | MENU (top right) | Enter, Esc, I or M |
| Sound on or off | SOUND (top right) | N |

Progress saves automatically in your browser. Choose CONTINUE on the title screen to pick up where you left off.

## What's in it

- **14 scrolling neighborhoods**, each a big map you explore in any direction: Scott's Addition, Broad Street, Jackson Ward, Church Hill, Carytown and the VMFA, the Fan, Capitol Square, Shockoe Bottom, Byrd Park and Maymont, Hollywood Cemetery, Belle Isle, Rocketts Landing, and south of the river, Manchester and Forest Hill Park.
- **Five dungeons** with small keys, locked doors, cracked walls, braziers, push-block puzzles and a boss each.
- **Items for the B button:** Gas Lantern, Baseballs, Blasting Powder, the Gold-Bug, Running Shoes and Ginger Beer. The Cast-Iron Shield and the Kayak work on their own.
- **A trading quest** across town that ends with a kayak for crossing the whitewater on the James.
- **Eight heart pieces** hidden behind bushes, across water and in the rapids. Four make a heart.
- **A journal of 41 Richmond stories** from historical markers, statues and people around town: Patrick Henry at St. John's, Maggie L. Walker's bank, Bojangles' traffic light, Sprague's electric streetcars, the VMFA's Faberge eggs, the Carillon, Forest Hill's old amusement park, Mayo's Bridge, the Church Hill Tunnel collapse and more.
- **Chiptune music** for the city, the south bank, dungeons, bosses and the title screen.

## Files

No build step and no dependencies. Open `index.html` in a browser to play locally.

- `world.js`: the maps, rooms, dungeon links and journal text
- `game.js`: the engine, drawing and controls
- `music.js`: the music sequencer and songs
- `sw.js`, `manifest.webmanifest`, `icon-*.png`: install-to-home-screen and offline support

Maps are written as run-length rows, so `B14 p4 B14` is 14 building tiles, 4 cobblestone tiles and 14 more buildings. When you change any file, bump `VERSION` in `sw.js` so installed copies update.
