# Carte du code (générée)

Fichier généré par `node tools/carte-code.js` (lancé aussi par `node tools/test.js`). **Ne pas modifier à la main.**
Guide écrit à la main : `docs/CODE.md`. Les numéros de ligne permettent `sed -n 'N,Mp' fichier | cut -c1-300`.

## Ordre de chargement (index.html)

1. `src/i18n.js` (57 lignes)
2. `src/lang-en.js` (2160 lignes)
3. `src/engine.js` (5759 lignes)
4. `src/audio.js` (811 lignes)
5. `src/game.js` (1569 lignes)
6. `src/game-draw.js` (5935 lignes)
7. `src/game-ui.js` (2019 lignes)
8. `src/game-screens.js` (1687 lignes)
9. `src/game-menu.js` (842 lignes)
10. `src/game-anim.js` (1181 lignes)
11. `src/game-fiche.js` (695 lignes)
12. `src/game-fx2.js` (364 lignes)
13. `src/game-artx.js` (1297 lignes)
14. `src/game-coll.js` (662 lignes)
15. `src/game-fx3.js` (556 lignes)
16. `src/game-fx5.js` (768 lignes)
17. `src/game-load.js` (140 lignes)

## Fonctions enveloppées

Un fichier chargé plus tard remplace la fonction par une version qui appelle l’ancienne (`const r0 = render; render = function () { r0.apply(this, arguments); … }`).
Pour modifier ou déboguer une de ces fonctions, **regarder toute la chaîne**, dans l’ordre (la dernière enveloppe s’exécute en premier).

| Fonction | Définie dans | Enveloppée ensuite par (ordre de chargement) |
|---|---|---|
| `render` | game-ui.js:601 | game-fx2.js:261, game-artx.js:82, game-artx.js:158, game-artx.js:283, game-artx.js:390, game-artx.js:841, game-artx.js:904 |
| `applyArt` | game.js:326 | game-artx.js:65, game-artx.js:274, game-artx.js:848, game-artx.js:1292 |
| `frameInner` | game-draw.js:5426 | game-artx.js:583, game-fx3.js:85, game-fx3.js:501, game-fx5.js:155 |
| `playEvents` | game-ui.js:4 | game-anim.js:913, game-fx2.js:329, game-fx3.js:94, game-fx5.js:106 |
| `buildGround` | game-draw.js:1303 | game-artx.js:26, game-artx.js:595 |
| `collectionScreen` | game-screens.js:938 | game-anim.js:397, game-coll.js:642 |
| `deckEditor` | game-screens.js:906 | game-anim.js:405, game-coll.js:652 |
| `feltLayout` | game-ui.js:1857 | game-artx.js:829, game-artx.js:972 |
| `syncZ` | game-draw.js:2249 | game-fx2.js:201, game-artx.js:1014 |
| `unitAnim` | game-draw.js:2927 | game-fx3.js:348, game-fx5.js:476 |
| `countUp` | game-screens.js:647 | game-anim.js:1117 |
| `dawnStep` | game-screens.js:35 | game-anim.js:298 |
| `drawFloats` | game-draw.js:4890 | game-fx5.js:760 |
| `drawFog` | game-draw.js:5153 | game-artx.js:457 |
| `drawFX` | game-draw.js:4796 | game-fx5.js:650 |
| `drawPlace` | game-draw.js:5314 | game-fx3.js:336 |
| `drawShelter` | game-draw.js:4493 | game-fx5.js:520 |
| `drawSky` | game-draw.js:4962 | game-artx.js:576 |
| `giftScreen` | game-screens.js:309 | game-anim.js:724 |
| `hglowFit` | game-menu.js:804 | game-artx.js:232 |
| `keepEnd` | game-menu.js:555 | game-fiche.js:206 |
| `lights` | game-draw.js:5073 | game-fx3.js:399 |
| `mergeFx` | game-ui.js:1444 | game-anim.js:807 |
| `nightBanner` | game-menu.js:227 | game-fx2.js:286 |
| `pilesHtml` | game.js:1413 | game-artx.js:885 |
| `placeHints` | game-draw.js:5926 | game-fx2.js:246 |
| `resumeWave` | game-ui.js:1726 | game-anim.js:903 |
| `ringFog` | game-draw.js:2096 | game-artx.js:444 |
| `shelHit` | game-ui.js:582 | game-fx2.js:354 |
| `show` | game-screens.js:610 | game-anim.js:1158 |
| `showAch` | game.js:763 | game-anim.js:1108 |
| `tapCell` | game-ui.js:1578 | game-ui.js:2007 |
| `title` | game-menu.js:430 | game-artx.js:241 |
| `zoomCf` | game-menu.js:246 | game-anim.js:309 |

## Actions des boutons

Un bouton `data-a="nom"` appelle `ACT.nom` (objet `ACT` de `game-screens.js`, ligne 1134).

testmode:1135 · teststart:1142 · tcards:1160 · tadd:1176 · options:1182 · optclose:1183 · presume:1190 · pquit:1195 · prestart:1199 · prestart2:1203 · pmenu:1212 · closeov:1213 · bpick:1217 · artstyle:1225 · new:1232 · prepdeck:1243 · prepch:1248 · preppl:1252 · preprel:1263 · prepmen:1267 · start:1273 · edit:1288 · dkp:1289 · cfam:1297 · crole:1308 · cpg:1319 · cfmore:1323 · atel:1327 · dkdraw:1334 · dkm:1338 · dkreset:1347 · coll:1352 · mdet:1360 · achs:1361 · gift:1362 · gyes:1363 · gno:1364 · gdone:1365 · mback:1366 · evo:1370 · unlock:1371 · load:1385 · title:1390 · close:1391 · rules:1392 · stats:1396 · rgo:1397 · retuto:1401 · deck:1413 · dawn:1421 · lvl:1422 · relic:1434 · evc:1439 · todraft:1458 · draft:1459 · shop:1468 · day:1520 · nightpick:1521 · nightgo:1525 · daily:1529 · wish:1532 · dpick:1542 · peek:1547

Ajoutées ou remplacées ailleurs : unlock (game-anim.js:481) · dkp (game-anim.js:507) · dkm (game-anim.js:541) · prepdeck (game-anim.js:573) · start (game-anim.js:687) · gift (game-anim.js:758) · relic (game-anim.js:1015) · prepmen (game-anim.js:1091) · fshare (game-fiche.js:689)

## Fichier par fichier

Sections (commentaires `/* ---------- … */`, `// ---`, `// ===`) puis fonctions définies, avec leur ligne.

### src/i18n.js

> Traduction (v146). Le français est la langue source : chaque texte affiché passe par _t,

_t:19 _tPage:41

### src/lang-en.js

> Dictionnaire anglais (v146) : clé = texte français exact, valeur = traduction. {0}, {1}… =

(aucune fonction nommée)

### src/engine.js

> Moteur du jeu : règles pures, sans DOM. Utilisé par le jeu (navigateur) et par les outils 

- **431** extension : nouvelles cartes de faction
- **981** v89 : 6 nouveaux survivants
- **1052** v120 : cartes de victoire (vic = niveau de Mutation à vaincre pour la débloquer ; jamais e
- **1162** v76 : logistique (équipements, postes de soutien, nouvelles défenses, pièges, objets et ré : roleOf:1753 baseOf:1853 edOf:1856 ck:1860 levelUp:1879 waveCount:2145 famCounts:2345 famLevel:2354 famLevels:2361 allies:2375 wallGroup:2380 sol:2400 nightOffers:2414 hurt:2432 recruit:2443 dawnEvent:3023 resolveDawn:3035 testProgress:3072 mutate:3087 zhit:3115 moves:3248
- **3267** chemins des zombies : blockCosts:3273 field:3305 sapBlast:3336 pathStep:3355 killZones:3373 back:3414 shuffle:3423
- **3431** état d'une partie : newState:3445 unlocks:3531
- **3541** collection et deck (entre les parties) : giftOffer:3551 edKill:3589 killScrap:3595 applyMenace:3634 deckError:3644 newDay:3665
- **3703** améliorations et reliques : statistiques réelles d'une carte : upgDesc:3705 stat:3722 upgrade:3772 addRelic:3776 relicChoices:3786 draftChoices:3792 dailyPlan:3814 dailyState:3845 storeOffer:3866 buyStore:3879 pay:3885 fireAmmo:3897
- **3917** pose des cartes : frees:3933 canMove:3946 move:3950 wallLinks:3960 fixLinks:3967 recall:3975 placeBench:3986 useCharges:4006 lineCells:4018 placeLine:4034 canPlace:4047 place:4070
- **4136** fusion et évolutions : absorb:4152 merge:4167 mkey:4222 mtr:4228 cure:4241 lose:4254 applyItem:4317
- **4348** la nuit : waveList:4357 broodDeath:4404 zMaxHp:4410 newcomers:4420 spawn:4425 bigNight:4435 nextWave:4439 startNight:4444 hit:4501 explode:4532 lureTarget:4537 squad:4563 dmgParts:4575 attack:4641 strike:4737 enter:4845 step:4930 endNight:5278 canReact:5348 react:5362 runNight:5512

### src/audio.js

> Sons du jeu : générés en code avec Web Audio, plus des grognements de zombies enregistrés 

(aucune fonction nommée)

### src/game.js

> Rendu canvas, interface et boucle de jeu. Dépend de src/engine.js (global Z).

- **1** (début) : loadSprites:227 sprK:243 drawSpr:249 hdArt:312 applyArt:326 cardStats:368 seen:449 novice:456 cardFace:464 saveOpt:565 applyOpt:584 applyCur:604 toggleFs:623 unpause:642 R:650
- **681** state
- **683** progression entre les parties (localStorage) : loadMeta:684 endTest:705 saveMeta:710 ach:751 showAch:763 deckCanAdd:796 edGain:810 edCommit:819 edDrop:849 achCheck:875 achNight:900 achScreen:908 tuto:927 guideStep:958 guideOk:1098 tutoTip:1119 tutoHand:1131 tutoPicks:1154 tutoEnd:1159 newGame:1174 fillHand:1224 drawCards:1232 syncBoard:1259 cellRect:1297 fly:1302 animPiles:1355 pilesHtml:1413
- **1483** sauvegarde (localStorage, marche aussi dans Electron/Tauri) : save:1486 loadSave:1510 clearSave:1533 resume:1539

### src/game-draw.js

> Dernier Abri : dessin de la carte (canvas), effets visuels et boucle d’affichage.

- **3** canvas setup : fit:24 rng:43 leafTree:207 pineTree:260 rockDeco:301 logDeco:324 cactus:352 deadBush:380 carWreck:400 concreteBlock:427 barrel:444 rubble:469 deadTree:485 roofDeco:499 lampPost:576 puddle:597 manhole:607 mushroom:625 tumbleweed:642 skull:651 pumpkin:673 hayBale:698 snowdrift:721 snowman:735 boulderBig:765 buildCity:776 cityRing:793 proj:877 poly:881 tone:889 building3d:894 cactus3d:966 rock3d:1034 ringItem:1099 dirtRoad:1130 drawWoods:1222 setBiome:1295 buildGround:1303 boardEdge:1757 boardFrame:1941 ringFog:2096 drawEdgeNight:2121 clearDecals:2164 splat:2167
- **2179** live visual state : vib:2198 camZoom:2213 shake:2218 jit:2228 zpos:2232 syncZ:2249
- **2295** dessin : un seul style pour tout le jeu (contour sombre, ombre portée, ombrage, petits dét : ell:2297 circ:2304 line:2311 oEll:2321 oCirc:2325 oLine:2329 oRect:2333 rrect:2339 oRound:2343 shade:2352 person:2520 dogShape:2645 hpBar:2672 drawBars:2676 socle:2697 trackBoard:2758 cracks:2849 crater:2870 groundCrack:2895 wallJit:2919 unitAnim:2927 drawUnit:3000 drawUnitInner:3106 wallSect:3867 wallPost:4043 drawRamparts:4105 wireSect:4216 wirePost:4239 drawWires:4243 drawGuide:4313 guideHand:4343 drawKillZones:4412 drawBossRoute:4446 drawShelter:4493 zAnim:4596 drawZombie:4624
- **4773** effects : addFX:4774 burst:4778 drawFX:4796 floatTxt:4887 drawFloats:4890 mkGlow:4941 drawSky:4962 drawGlow:5043 lights:5073 drawFog:5153 drawAmbient:5167 drawDark:5244 frame:5298 drawPlace:5314 titleDeco:5373 frameInner:5426 safeTxt:5680 edAura:5690 dmgCached:5781 bTag:5787 dmgBadge:5805 dmgLinks:5826 placeGain:5891 placeHints:5926

### src/game-ui.js

> Dernier Abri : interface du jour et de la nuit (fiche, main, plateau, déroulé de la nuit).

- **3** combat events → visuals : playEvents:4
- **505** UI : ficheHtml:507 trackHtml:538 tagsHtml:555 shelHit:582 render:601 fireAmmo:847 updatePreview:871 curAt:1063 useBuild:1084 spentTrace:1092 countPlay:1100 placeLineUI:1111 dmgInfo:1161 dmgSnap:1175 bonusMsg:1183 unitLine:1225 hint:1383 showHint:1392 checkHints:1420 mergeFx:1444 playReact:1483 snapUndo:1521 doUndo:1536 squadFx:1566 tapCell:1578 peekScreen:1702 wavePause:1715 resumeWave:1726 night:1740 feltLayout:1857 ftPioche:1900 ftHorde:1924 ftJournal:1940 feltTabs:1966

### src/game-screens.js

> Dernier Abri : écrans (aube, options, collection, decks, préparation) et actions des bouto

- **3** l'aube : relique, carte pour demain, boutique : dawn:5 afterRelic:30 dawnStep:35 dawnTxt:85 shopScreen:102 storeScreen:121 listScreen:135 removeCard:140 nightScreen:151 nextDay:165 victory:179 leaveWin:239 wishBtn:263 demoEnd:268 giftStart:295 giftLeft:305 giftScreen:309 giftSync:326 giftTap:347 giftTake:371 giftDone:374 statsScreen:392 logRun:416 end:431 zombieFace:499 optionsScreen:515 runInfo:554 pfoot:593 show:610 countUp:647 hide:662
- **670** collection, decks et préparation de la partie : takeLegacy:672 ensureMeta:684 prepScreen:717 cfOpen:774 cfPool:785 cfList:795 cfTabs:811 cfBar:829 cfPips:848 cfBookHTML:856 cfBook:867 cfSync:900 deckEditor:906 collectionScreen:938 cfBarOld:1000 cfGrid:1013 cfApply:1043 cfSyncOld:1048 deckEditorOld:1054 collectionScreenOld:1066 evoScreen:1122 nextUnlockTxt:1666

### src/game-menu.js

> Dernier Abri : défi quotidien, tableau des combats, menu pause, raccourcis, accueil et dém

- **3** défi du jour (v151) : une seule nuit contre la horde du jour, 8 cartes tirées « 1 parmi 3  : dailyEnd:9 dailyBest:13 dailyScreen:34 dailyDraft:44 dailyStart:54 dailyOver:63 pauseMenu:192 abortNight:202 nightBanner:227 zoomCf:246 zoomClose:261 title:430 meterHead:475 meterBody:480 meterSync:511 keepEnd:555 detScreen:558 detSync:565 muteIcon:584 iosHint:593 hglowFit:804

### src/game-anim.js

> v170 : animations de cartes inspirées de Hearthstone (main, plateau, menus).

- **1** (début) : aEl:5 aAnim:12 aDone:19
- **28** main : éventail, cartes jouables, refus : handFx:31 shakeCard:60 refuseBubble:76 refuseFx:87
- **137** glisser : la carte se penche dans le sens du mouvement
- **160** pose : la carte vole jusqu'à la case et s'écrase : placeFx:161 landFx:177
- **188** fin du jour : les cartes réutilisables non jouées brûlent : burnFx:189
- **222** nuit : une défense détruite vole en éclats : shardsFx:223
- **255** aube : les 3 cartes au choix arrivent face cachée et se retournent : dealPicks:256
- **307** grande carte : elle grandit depuis sa place, penche sous le doigt, reflet qui suit : zoomTilt:330
- **363** collection : cascade, déblocage : cascade:365 coinsFx:423 unlockFx:456
- **492** decks : ajout, retrait, deck complet : popEl:494 deckDone:558
- **571** préparation : le deck choisi avance, les autres reculent
- **603** lancement : le deck est battu puis plonge dans la pioche : launchFx:604
- **698** récompense : paquet qui tremble puis explose, retournement selon la rareté : packFx:699 revealFx:732
- **784** v171 : deuxième série (unités, nuit, économie, menus) : cvPt:786 bolt:791 lvFx:849 typeFx:879 bossBanner:893 renderFx:933 endPts:1148

### src/game-fiche.js

> v173 : fiche de fin de partie (« rapport de survie ») en haut des écrans de fin, et son im

- **1** (début) : ficheData:7 ficheEdge:80 rapportHtml:133 ficheInsert:176
- **222** image à partager (1080 × 1350) : fRound:231 fCover:240 fFit:251 ficheCanvas:260 ficheShare:646

### src/game-fx2.js

> ======== v191 : interface et animations, troisième série ========

- **11** 1 : avant → après : simG:13 uStats:16 upgLines:31 upgPrev:41 drawUpg:120
- **138** 3 : trous de la défense : drawHoles:140 holesSync:168
- **191** 9 : aube : drawDawn:216
- **259** 5 : bouton de la nuit
- **284** 6 : nuit rouge
- **326** 7 : gros zombie abattu
- **352** 8 : maison touchée

### src/game-artx.js

> v200 : refonte du jeu dans le style artiste (html.artx seulement) : plateau dessiné d'Amin

- **1** (début) : axPalSet:15 axGround:40 axPlat:46 axBig:102 axGlow:180 axHome:259 axPad:303 axLay:312 axOn:437 axRing:462 axFxDraw:489 axPaint:610
- **744** v216 : nouvelle disposition du style artiste, d'après les maquettes d'Amine : ax3Want:751 ax3Build:754 ax3Put1:768 ax3Put:787 ax3Back:808 ax3Phase:820 ax3Zoom:953 axFarDraw:1029 artNames:1278

### src/game-coll.js

> ---------- collection du style artiste (v222) ----------

lcItem:43 lcDkItem:58 lcInfo:67 lcDetail:92 lcBase:99 lcList:106 lcCells:111 lcDeckSide:129 lcScreen:157 lcFill:216 lcPage:234 lcSearch:274 lcShow:280 lcOvPlace:334 lcOvOpen:347 lcOvClose:380 lcOri:414 lcGyro:427 lcNo:444 lcReset:611

### src/game-fx3.js

> v230 : quatrième série d'effets (validée par Amine). Affichage seulement, aucune règle ne 

fx3Reset:67 hitStop:76 fx3Events:102 fx3DawnK:239 fx3Corpses:245 fx3Idle:382 fx3Weather:425 fx3Layer:486 fx3Cam:536

### src/game-fx5.js

> v240 : le camp prend vie (demande d'Amine). Affichage seulement, aucune règle ne change.

fx5On:64 fx5Named:71 fx5Line:80 fx5Say:87 fx5Events:114 fx5Tick:163 fx5Edge:232 fx5Crows:241 fx5Shoo:270 fx5Crow:277 fx5Chores:364 fx5Smoke:488 fx5Marks:528 fx5Leaves:582 fx5Dusk:632 fx5Wrap:677 fx5Bubbles:691

### src/game-load.js

> v244 : chargement des images.

preloadImg:11 inCache:24 preloadUi:35 preloadCards:41 bootUrls:52 bootBar:62 bootEnd:67 preloadBoot:78 preloadBigOk:98 preloadIdle:104 preloadBackground:118

## src/style.css

14234 lignes. Les règles s’empilent par version : **à sélecteur égal, la dernière l’emporte**. Le style artiste est sous `html.artx` (1000 lignes). Chercher un sélecteur avec `grep -n` plutôt que par section.

- 1 polices intégrées au jeu (licence SIL OFL), pour jouer sans internet
- 67 Layout: one-screen phone app — header, night forecast, live top-down map (canvas), hand of
- 896 fusion (doré) et évolution (violet) dans la fiche d'unité
- 904 alliance active et annonce des très grosses nuits
- 914 munitions anti-Colosse : stock, bouton de tir, compte à rebours
- 952 écran d'ordinateur (version Steam) : colonne et carte plus larges
- 962 carte de construction déjà utilisée aujourd'hui (réutilisable), et carte en cours de gliss
- 984 rôle de l'unité (Tank, Soin, DPS) en bas à gauche de la carte
- 993 illustration de carte (image sans texte) : remplit le haut de la carte, le texte du jeu re
- 1018 ---------- face de carte : le gabarit cartoon d'Amine (assets/ui/cadre.webp, fenêtre et ex
- 1066 effet qui sort du cadre : l'illustration et le personnage détouré occupent une même « scèn
- 1283 version de la main : pas de texte d'effet, le nom et les stats en plus grand
- 1330 main : la carte remplace le bouton
- 1367 choix de l'aube : de grandes cartes
- 1385 collection et deck : une grille de cartes
- 1412 aperçu en grand de la carte survolée ou choisie (ordinateur)
- 1430 faction / rôle à l'encre en bas de la carte
- 1457 recherche et tri des cartes
- 1499 v73 : limite d'unités, réserve, rappel
- 1522 v78 : table de jeu (pioche, main, défausse, réserve)
- 1691 v79 : disposition — en hauteur, l'interface entoure la carte ; en largeur (PC, tablette, t
- 1778 téléphone tourné : peu de hauteur, on resserre
- 1916 v87 : conseils au bon moment
- 1950 v92 : options
- 2014 v93 : aspect jeu de société — table en bois, plateau encadré, cubes d'énergie, bande de pa
- 2092 en largeur, le plateau est posé sur la table : on retire la forêt prolongée
- 2101 v95 : fiche de nuit, piste des nuits, jetons
- 2345 v98 : icônes de faction à l'encre (mêmes pictogrammes que sur les cartes)
- 2389 v98 : la fiche de nuit devient une tuile de plateau (carton épais, cadre imprimé, rivets, 
- 2528 v100 : dos des cartes d'Amine (assets/ui/dos.webp) pour la pioche et les cartes qui volent
- 2550 v101 : logo sur l'accueil, règles du jeu dans leur propre écran
- 2567 v101 : les écrans (accueil, aube, troc, collection…) deviennent des fiches de papier posée
- 2644 v102 : tapis de feutre vert sous la fiche de nuit, la piste et les jetons, comme sous la m
- 2663 v103 : pas de tapis autour ; c'est la fiche de nuit elle-même qui devient un tapis de feut
- 2705 v104 : nom de la nuit écrit directement sur le feutre, sans étiquette
- 2720 v105 : plus d'intitulé « La horde », les jetons parlent d'eux-mêmes
- 2728 v106 : une phrase courte et poétique par type de nuit ; l'effet est dans le détail (touche
- 2737 v107 : la phrase remplace le nom de la nuit sur la fiche
- 2744 v110 : page des évolutions secrètes
- 2777 v111 : carte d'une unité fusionnée : bandeau d'étoiles dorées et cadre qui brille
- 2821 v111 : piste des nuits sur toute la largeur ; mutation et ferraille au bout de la rangée d
- 2872 v112 : première nuit guidée : la carte et le bouton à toucher pulsent en doré
- 2914 v115 : mode économie (petits téléphones) : pas de flous ni d'ombres portées calculées, pas
- 2934 v116 : niveaux de Menace et victoire
- 2959 v119 : dos de carte doré (récompense de la première victoire)
- 2974 v120 : icônes des reliques, hélicoptère et carte de victoire
- 3017 v122 : icônes à l'encre à la place des émojis
- 3072 v123 : règles en fiches illustrées
- 3136 statistiques
- 3197 animations de fin de partie
- 3293 v126 : collection, trois états bien lisibles (débloquée, à portée, hors de portée)
- 3434 v126 : tableau des combats (feutre vert comme la fiche de nuit)
- 3608 en portrait : il s'ouvre en haut, par-dessus la fiche de nuit et la piste (la carte et la 
- 3619 sur ordinateur et téléphone tourné : rangé dans la colonne de droite, dans l'espace libre
- 3642 téléphone tourné : pas de place dans la colonne, il flotte au-dessus de la carte
- 3655 v126 : le tableau des combats dans l'écran de fin de partie
- 3671 v128 : succès (bandeau et page)
- 3773 révélation progressive (v129)
- 3789 mode test
- 3826 v139 : grande carte et raccourcis clavier
- 3863 pas de menu « enregistrer l'image » de l'iPhone sur les cartes (appui long = grande carte)
- 3870 menus : la carte grossit un peu au survol de la souris
- 3896 v139 : transitions d'écran
- 3923 main : la carte se soulève au survol de la souris
- 3933 bandeau « Nuit N »
- 3987 ===== v141 : panneaux en bois (option A), boutons en relief, halos de la collection =====
- 4113 petites fiches de papier posées sur le bois : texte sombre
- 4166 boutons en relief : bombés, s'enfoncent au clic ; choisi = enfoncé et doré ; bloqué = plat
- 4273 collection : halo de rareté = carte acquise (règle v186 en fin de fichier), halo noir = pa
- 4292 boutons secondaires côte à côte, pour que les menus tiennent sans défiler
- 4387 ===== v142 : vraie texture de bois (raccordable, sans démarcation), clous ronds =====
- 4398 boutons toujours visibles en bas des écrans qui défilent : une étagère en bois
- 4424 titres des fiches de papier (règles) en encre sombre
- 4435 champs de texte et menus déroulants : papier enfoncé dans le bois, flèche dessinée
- 4475 barre de recherche et filtres : planche sombre, comme le reste
- 4495 range (volume) aux couleurs du jeu
- 4499 succès : tuiles comme les statistiques, fiches de papier
- 4564 ===== v143 =====
- 4565 symboles de mutation et textes d'alerte : rouge vif sur le bois
- 4569 troc : article impossible = fiche de papier grisée, encore lisible
- 4594 filtres collés en haut : fond opaque, les cartes passent dessous sans se voir
- 4608 v147 : image d'ambiance derrière les menus hors partie (accueil et ses écrans), nouveau lo
- 4619 v168 : en hauteur, sans phrase d'accroche ; le logo monte dans le ciel et le menu commence
- 4671 v150 : récompense de fin de partie. Cartes face cachée (sans halo), on touche pour retourn
- 4911 défi du jour (v151) : la horde du jour, le tirage et le score
- 4956 démo (v153) : étiquette sous le logo
- 4982 v154 : tout ce qui est verrouillé reste lisible, simplement grisé (demande d'Amine)
- 4999 ===== v155 : boutons en planche clouée, texte au pochoir (style E choisi par Amine) =====
- 5086 grisé 1
- 5109 grisé 2
- 5138 icônes du haut
- 5166 v155 : icône des bulles d’aide à taille de texte (elle couvrait l’écran)
- 5173 v161 : abri touché (barre qui tremble, bord de l’écran qui rougit)
- 5212 curseurs PC (option « Curseur de la souris »)
- 5254 ---------- v170 : animations de cartes (game-anim.js) ----------
- 5255 main en éventail : rotate et translate restent séparés de transform (sélection, survol)
- 5286 carte jouable : liseré vert qui pulse (en phase d'un dessin à l'autre grâce à --ph)
- 5307 refus : bulle au-dessus de la carte
- 5339 pioche : la carte se retourne en vol
- 5366 reflet qui passe sur les cartes rares, épiques et légendaires (main, grande carte, choix, 
- 5392 grande carte : penche sous le doigt, reflet qui suit
- 5412 fin du jour : la carte brûle depuis les bords
- 5468 aube : cartes au choix face cachée, éclat de la couleur de la rareté
- 5497 collection : pièces, cadenas, éclat et tampon « Obtenue »
- 5611 deck complet : liseré doré
- 5632 lancement : le deck est battu au centre de l'écran
- 5651 récompense : paquet qui tremble puis explose
- 5752 carte face cachée : sa lueur annonce la rareté (blanc, bleu, violet, doré)
- 5814 boutons : ils s'enfoncent puis rebondissent
- 5831 changement d'écran : glissement un peu plus marqué
- 5841 Mode économie et appareils qui demandent moins de mouvement : pas d'effet en boucle
- 5866 ---------- v171 : deuxième série d'animations ----------
- 5867 boss : bandeau qui traverse l'écran
- 5923 abri presque détruit : barre qui bat, bords rouges qui pulsent
- 5972 ferraille : pièces de métal
- 5981 relique : tourne au centre puis file se ranger
- 6029 mutation : le chiffre se fissure, lueur verte
- 6070 succès : la médaille tombe et rebondit
- 6128 ---------- v173 : fiche de fin de partie (game-fiche.js) : rapport de survie sur papier us
- 6501 v174 : accueil animé (brume qui dérive au pied de la palissade, braises qui montent, logo 
- 6641 v175 : lueurs posées sur l'image d'accueil (#hglow suit le cadrage « cover » de l'image, v
- 6750 v179 : grand écran PC : tapis vert collé à gauche (fiche de nuit, piste, jetons, pioche, d
- 7164 v181 : éditions spéciales (cartes de collection) : liseré coloré sur le cadre (.cf-ed), ef
- 7249 Dorée
- 7283 Blindée
- 7309 Fantôme
- 7336 Holographique
- 7368 Ensanglantée
- 7434 v184 : carte choisie à la récompense : un tampon à l'encre sur l'illustration (remplace la
- 7486 v185 : plus de rareté écrite sous les cartes offertes : le halo suffit ; une carte spécial
- 7502 v186 : un seul code de halo partout : la couleur de la rareté (commune verte, rare bleue, 
- 7555 v189 : fiche d'unité en pastilles (PV, dégâts, portée, victimes) et détail des bonus de dé
- 7651 tutoriel : main qui montre le geste
- 7693 v191 : bouton des trous, bouton de la nuit vivant, nuit rouge, maison touchée
- 7795 ===== v196 : refonte de l'interface du style artiste (maquette d'Amine) — seulement sous h
- 7834 panneaux : encre sombre usée, liseré clair très fin
- 7854 titre : bandeau sombre, capitales condensées, trait rouge à gauche
- 7916 fiches de papier : parchemin crème, bord noir
- 7935 boutons : parchemin, texte noir en capitales ; principal : rouge sang ; plus de bois ni de
- 7994 icônes du haut : carrés sombres
- 8008 onglets, choix, quantités : cases sombres ; le choisi en rouge
- 8052 champs, menus déroulants, barre de filtres, étagère du bas
- 8090 curseurs et cases : rouge ; les cases des Options deviennent des interrupteurs
- 8132 succès et barres de progression
- 8149 écran de jeu : fiche de nuit, main, tableau et tapis PC en encre sombre (plus de feutre ve
- 8172 jour en cours : étiquette de parchemin, comme sur la maquette
- 8198 v197 : écran de jeu d'après la 2e maquette d'Amine
- 8199 téléphone en hauteur : grande étiquette « JOUR n » posée à gauche de la fiche de nuit
- 8243 piste des nuits : cases sombres, nuit rouge en rouge sang, nuit en cours en parchemin
- 8281 pastilles (survivants, menaces, ferraille) : parchemin à bord noir
- 8304 énergie : cases jaunes dans une barre sombre ; Annuler : bouton sombre à bord vert
- 8328 zombies de la horde : jetons ronds à liseré, chiffre sur pastille claire
- 8332 v197 : boutons en métal usé (demande d'Amine) : acier brossé, rayures, rouille et rivets ;
- 8372 onglets et icônes : métal sombre bruni, le choisi en tôle rouge
- 8398 v198 : métal uniforme (plus de taches de rouille sur les bords, rayures discrètes) ; cadre
- 8454 ===== v199 : relief (demande d'Amine) : métal éclairé et bosselé, biseaux, texte gravé ; p
- 8475 panneaux et cadres : tôle épaisse bosselée, éclairée d'en haut, biseau clair en haut et so
- 8511 boutons secondaires : plaque d'acier brossé épaisse, texte gravé
- 8534 bouton principal : tôle peinte en rouge, bosselée
- 8552 onglets : touches de métal, la choisie enfoncée et rouge
- 8590 champs creusés dans le métal
- 8607 « Affronter la nuit » : le panneau de la maquette (tôle rouge cabossée, cadre de métal noi
- 8639 ===== v200 : refonte du jeu (maquettes validées par Amine), style artiste seulement (html.
- 8640 v201 : retour au cadre cartoon (choix d'Amine) avec les illustrations de l'artiste ; son c
- 8641 ---- PC (html.felton) : bandeau en haut, colonne d'infos à gauche, plateau au centre, fich
- 8747 bandeau : étiquette du jour à gauche, icônes et abri à droite
- 8795 cadres en métal fin et foncé : colonnes, plateau, main
- 8818 pioche à droite de la main, défausse à gauche
- 8884 ---- téléphone en hauteur : bandeau en fond du haut, bouton carré « Affronter la nuit » à 
- 8953 bouton de vitesse (nuit) : plaque d'acier lisible
- 8969 ===== v201 : PC — plateau sur toute la hauteur, colonnes gauche et droite de même hauteur 
- 9091 ===== v202 : fonds d'Amine à l'accueil et derrière le jeu, lueurs de l'accueil sur ce déco
- 9186 v203 : PC — panneau de droite : jour et icônes, fiche d'unité, grande carte (survolée ou c
- 9233 v204 : PC — le plateau garde sa taille maximale ; sur grand écran, les panneaux prennent t
- 9267 ===== v205 : PC — panneau gauche en 3 blocs (nuit, onglets Pioche/Horde/Journal, défausse 
- 9470 ===== v206 : nuit (PC) — hors du canvas, l'image du plateau s'assombrit exactement comme l
- 9481 v208 : nuit (PC) — canvas des brumes de la v195 prolongées sur la palissade (#axFx), fondu
- 9513 v211 : PC — cadre en acier serré autour du plateau ; le canvas du jeu déborde jusqu'au cad
- 9543 ===== v213 : collection et decks en classeur (style artiste seulement) (inspiré de Hearths
- 9579 intercalaires : de vrais onglets de classeur, collés à la page ; l’onglet choisi se fond d
- 9657 recherche + bouton Filtres sur une ligne ; les menus s’ouvrent dessous
- 9707 puces de rôle et de type
- 9743 le classeur : une page de papier réglé à anneaux
- 9789 page qui tourne comme un livre, autour de la reliure à gauche
- 9889 repères : « Nouveau », carte spéciale cachée derrière (coin doré)
- 9918 Atelier : les cartes acquises s’éteignent, celles qu’on peut payer brillent
- 9945 éditeur de deck : toucher une carte l’ajoute ; le deck est un tiroir en bas (téléphone) ou
- 10307 ===== v213 : le classeur dans le style artiste (acier, papier crème, rouge, capitales Oswa
- 10471 le pied de la collection et le tiroir du deck : même plaque d’acier rivetée, liseré rouge
- 10548 v214 (style artiste) : feuille avec de la profondeur (pile de pages, reliure, coin corné) 
- 10672 v214 : lignes du deck de la même couleur crème que le papier des cartes (cadre.webp)
- 10692 ===== v215 : pack « maquette » d'Amine (style artiste seulement) : images en découpe 9 cas
- 10714 boutons secondaires : tuile charbon, texte crème
- 10735 bouton principal : tôle rouge sang tachée, texte crème cerné de noir
- 10761 « Affronter la nuit » : droit, mains de zombies par-dessus la tôle, sous le texte
- 10781 onglets : tuile charbon, le choisi en rouge
- 10791 boutons icônes (son, musique, plein écran)
- 10803 étiquette du jour : parchemin brûlé
- 10811 fiches et pastilles en papier : parchemin aux bords brûlés
- 10834 énergie : cases jaunes à bord sombre
- 10843 ===== v216 : nouvelle disposition du style artiste (maquettes d'Amine) : #ax3 (game-artx.j
- 10885 formes communes : panneau noir
- 10895 ciel du jour : jour (ou nuit) en haut à gauche, phrase dessous, tampon à côté
- 11033 piste des nuits
- 11090 camp : icônes et chiffres, sans pastilles
- 11148 Deck (dos noir biohazard), Réserve et Défausse : trois formes séparées
- 11280 onglets Pioche / Horde / Journal : liste en lignes sombres, liseré de couleur, illustratio
- 11345 colonne de droite : logo et icônes centrés sur l'abri, abri, grande carte, énergie, bouton
- 11546 ---- ordinateur ----
- 11590 ---- téléphone en hauteur ----
- 11759 v230 : plateau d'Amine avec la forêt (plateau-foret.webp) : l'image entière est sous le ca
- 11825 v217 : bac de cartes en 3 couches : le fond (découpe 9 cases : les poteaux et la planche d
- 11904 v217 : abri en panneau noir, texte crème
- 11924 v217 : onglets en formes pleines (panneau noir) ; l'onglet ouvert a un trait rouge en haut
- 11945 v217 : Deck, Réserve et Défausse toujours pleins ; vides ou pendant la nuit, seuls le chif
- 11953 v217 : ordinateur : plateau et bac (même largeur, comme l'image d'Amine) au centre, colonn
- 11985 v217 : téléphone : bac de la largeur du plateau, aussi haut que la place le permet
- 12019 v219 : nouveaux cadres de carte de l'artiste (assets/art/ui/cadre-*.webp, fenêtre transpar
- 12123 ===== v219 : les formes de la maquette d'Amine partout dans le style artiste (menus, écran
- 12223 v219 : accueil sans panneau (les boutons et les fiches se posent directement sur le fond)
- 12230 v219 : pied des écrans à défilement (Options, Préparer la partie…) : plus de plaque de mét
- 12248 ===== v222 : collection du style artiste reprise du laboratoire (interfaces/collection) : 
- 12464 une carte de la grille : inclinaison 3D, reflet, lueur dorée quand elle est choisie
- 12580 cartes distribuées : elles tombent de haut en tournant
- 12598 grande carte : se retourne, flotte, s’incline au survol
- 12786 ordinateur : trois colonnes comme le laboratoire, la grille défile seule
- 12916 v223 : grand écran : colonnes gauche et droite limitées à 440 px (sinon elles s'étirent et
- 12921 v224 : écart plateau / colonnes de 12 px, jusqu'à 50 px quand l'écran a de la place (choix
- 12925 ===== v225 : collection et deck sur le même écran, en pages (plus de défilement) =====
- 13013 bas de l’écran : pages au-dessus des boutons sur téléphone, sur une ligne sur ordinateur
- 13063 téléphone : grande carte par-dessus la grille
- 13144 deck sur téléphone : le tiroir reste dans la page, sous la grille
- 13159 effets des cartes
- 13293 ordinateur : trois colonnes, rien ne défile
- 13398 v225 : en jeu, une carte qu’on ne peut pas jouer est grisée (style artiste)
- 13411 v226 : pas de barre de défilement dans la collection et le deck ; formes du jeu (panneau n
- 13505 v227 : onde au clic sur les boutons (src/game-artx.js)
- 13537 v227 : bouton qui reste enfoncé (filtre, onglet, option choisie) : 2 px plus bas, creusé, 
- 13577 v228 : menus et panneau du deck dans le style du reste (panneaux noirs, texte crème, Oswal
- 13697 v229 : sous la liste du deck, les rôles (Tank, Soin, DPS) en tuiles et les maximums par ra
- 13805 v232 : carte plus haute dans le style artiste (choix d'Amine : ni bande ni zoom). Les illu
- 13892 v237 : téléphone tourné en style artiste : plateau encadré à gauche sur toute la hauteur, 
- 13980 v239 : téléphone (portrait et paysage) : plateau à palissade sans forêt (plateau-herbe.web
- 14012 v241 : interface plus lisible (demande d'Amine)
- 14013 1 : compteur d'énergie toujours visible le jour : gros chiffre, jetons, à gauche du texte
- 14083 3 : le nom du jeu, coupé sur ordinateur (« Barric… »), n'est plus affiché pendant la parti
- 14089 7 : plus d'énergie (ou plus rien à jouer) : le bouton de la nuit appelle clairement
- 14121 téléphone en portrait
