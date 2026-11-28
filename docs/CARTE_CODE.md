# Carte du code (générée)

Fichier généré par `node tools/carte-code.js` (lancé aussi par `node tools/test.js`). **Ne pas modifier à la main.**
Guide écrit à la main : `docs/CODE.md`. Les numéros de ligne permettent `sed -n 'N,Mp' fichier | cut -c1-300`.

## Ordre de chargement (index.html)

1. `src/i18n.js` (57 lignes)
2. `src/lang-en.js` (2361 lignes)
3. `src/engine.js` (6024 lignes)
4. `src/audio.js` (826 lignes)
5. `src/art-liste.js` (3 lignes)
6. `src/game.js` (1728 lignes)
7. `src/game-draw.js` (7034 lignes)
8. `src/game-ui.js` (2086 lignes)
9. `src/game-screens.js` (1681 lignes)
10. `src/game-menu.js` (861 lignes)
11. `src/game-anim.js` (1328 lignes)
12. `src/game-fiche.js` (695 lignes)
13. `src/game-fx2.js` (363 lignes)
14. `src/game-artx.js` (1372 lignes)
15. `src/game-coll.js` (1263 lignes)
16. `src/game-fx3.js` (535 lignes)
17. `src/game-fx5.js` (754 lignes)
18. `src/game-load.js` (195 lignes)
19. `src/game-accueil.js` (272 lignes)
20. `src/game-menufx.js` (308 lignes)
21. `src/game-3d.js` (109 lignes)

## Fonctions enveloppées

Un fichier chargé plus tard remplace la fonction par une version qui appelle l’ancienne (`const r0 = render; render = function () { r0.apply(this, arguments); … }`).
Pour modifier ou déboguer une de ces fonctions, **regarder toute la chaîne**, dans l’ordre (la dernière enveloppe s’exécute en premier).

| Fonction | Définie dans | Enveloppée ensuite par (ordre de chargement) |
|---|---|---|
| `render` | game-ui.js:628 | game-fx2.js:261, game-artx.js:101, game-artx.js:177, game-artx.js:396, game-artx.js:503, game-artx.js:997, game-artx.js:1060 |
| `applyArt` | game.js:314 | game-artx.js:84, game-artx.js:387, game-artx.js:1004, game-artx.js:1360 |
| `frameInner` | game-draw.js:6426 | game-artx.js:696, game-artx.js:735, game-fx3.js:480, game-fx5.js:155 |
| `playEvents` | game-ui.js:4 | game-anim.js:1018, game-fx2.js:329, game-fx3.js:78, game-fx5.js:106 |
| `buildGround` | game-draw.js:1303 | game-artx.js:38, game-artx.js:751 |
| `collectionScreen` | game-screens.js:932 | game-anim.js:438, game-coll.js:1243 |
| `deckEditor` | game-screens.js:900 | game-anim.js:446, game-coll.js:1253 |
| `feltLayout` | game-ui.js:1918 | game-artx.js:985, game-artx.js:1128 |
| `show` | game-screens.js:601 | game-anim.js:1305, game-menufx.js:276 |
| `showAch` | game.js:902 | game-anim.js:1255, game-menufx.js:247 |
| `syncZ` | game-draw.js:2366 | game-fx2.js:201, game-artx.js:1170 |
| `axGlow` | game-artx.js:268 | game-accueil.js:253 |
| `countUp` | game-screens.js:639 | game-anim.js:1264 |
| `dawnStep` | game-screens.js:35 | game-anim.js:333 |
| `drawFloats` | game-draw.js:5823 | game-fx5.js:746 |
| `drawFog` | game-draw.js:6122 | game-artx.js:570 |
| `drawFX` | game-draw.js:5726 | game-fx5.js:636 |
| `drawPlace` | game-draw.js:6314 | game-fx3.js:315 |
| `drawShelter` | game-draw.js:5187 | game-fx5.js:506 |
| `drawSky` | game-draw.js:5914 | game-artx.js:689 |
| `drawSpr` | game.js:235 | game-3d.js:51 |
| `drawUnit` | game-draw.js:3209 | game-3d.js:78 |
| `drawZombie` | game-draw.js:5319 | game-3d.js:69 |
| `giftScreen` | game-screens.js:309 | game-anim.js:771 |
| `hglowFit` | game-menu.js:823 | game-artx.js:345 |
| `hide` | game-screens.js:654 | game-menufx.js:29 |
| `keepEnd` | game-menu.js:582 | game-fiche.js:206 |
| `lights` | game-draw.js:6025 | game-fx3.js:378 |
| `mergeFx` | game-ui.js:1493 | game-anim.js:854 |
| `nightBanner` | game-menu.js:249 | game-fx2.js:286 |
| `optionsScreen` | game-screens.js:515 | game-artx.js:1344 |
| `pilesHtml` | game.js:1569 | game-artx.js:1041 |
| `placeHints` | game-draw.js:7025 | game-fx2.js:246 |
| `resumeWave` | game-ui.js:1773 | game-anim.js:1008 |
| `ringFog` | game-draw.js:2096 | game-artx.js:557 |
| `shelHit` | game-ui.js:609 | game-fx2.js:353 |
| `tapCell` | game-ui.js:1624 | game-ui.js:2074 |
| `title` | game-menu.js:452 | game-artx.js:354 |
| `unitAnim` | game-draw.js:3116 | game-fx3.js:327 |
| `zoomCf` | game-menu.js:268 | game-anim.js:349 |

## Actions des boutons

Un bouton `data-a="nom"` appelle `ACT.nom` (objet `ACT` de `game-screens.js`, ligne 1128).

testmode:1129 · teststart:1136 · tcards:1154 · tadd:1170 · options:1176 · optclose:1177 · presume:1184 · pquit:1189 · prestart:1193 · prestart2:1197 · pmenu:1206 · closeov:1207 · bpick:1211 · artstyle:1219 · new:1226 · prepdeck:1237 · prepch:1242 · preppl:1246 · preprel:1257 · prepmen:1261 · start:1267 · edit:1282 · dkp:1283 · cfam:1291 · crole:1302 · cpg:1313 · cfmore:1317 · atel:1321 · dkdraw:1328 · dkm:1332 · dkreset:1341 · coll:1346 · mdet:1354 · achs:1355 · gift:1356 · gyes:1357 · gno:1358 · gdone:1359 · mback:1360 · evo:1364 · unlock:1365 · load:1379 · title:1384 · close:1385 · rules:1386 · stats:1390 · rgo:1391 · retuto:1395 · deck:1407 · dawn:1415 · lvl:1416 · relic:1428 · evc:1433 · todraft:1452 · draft:1453 · shop:1462 · day:1514 · nightpick:1515 · nightgo:1519 · daily:1523 · wish:1526 · dpick:1536 · peek:1541

Ajoutées ou remplacées ailleurs : unlock (game-anim.js:528) · dkp (game-anim.js:554) · dkm (game-anim.js:588) · prepdeck (game-anim.js:620) · start (game-anim.js:734) · gift (game-anim.js:805) · relic (game-anim.js:1162) · prepmen (game-anim.js:1238) · fshare (game-fiche.js:689) · credits (game-artx.js:1335)

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

- **401** extension : nouvelles cartes de faction
- **885** v89 : 6 nouveaux survivants
- **944** v120 : cartes de victoire (vic = niveau de Mutation à vaincre pour la débloquer ; jamais e
- **1030** v76 : logistique (équipements, postes de soutien, nouvelles défenses, pièges, objets et ré : roleOf:1783 vacate:1900 baseOf:1944 edOf:1947 ck:1951 levelUp:1970 waveCount:2221 famCounts:2422 famLevel:2431 famLevels:2438 allies:2452 wallGroup:2457 enclosed:2477 electrified:2496 igniteWall:2521 breakWall:2528 burnWalls:2539 sol:2559 nightOffers:2573 hurt:2591 recruit:2602 dawnEvent:3182 resolveDawn:3194 testProgress:3231 mutate:3246 zhit:3274 moves:3408
- **3427** chemins des zombies : blockCosts:3433 field:3465 sapBlast:3497 pathStep:3516 killZones:3534 back:3575 shuffle:3584
- **3592** état d'une partie : newState:3606 unlocks:3692
- **3702** collection et deck (entre les parties) : giftOffer:3712 edKill:3748 killScrap:3754 applyMenace:3793 deckError:3803 newDay:3824
- **3862** améliorations et reliques : statistiques réelles d'une carte : upgDesc:3864 stat:3881 upgrade:3931 addRelic:3935 relicChoices:3945 draftChoices:3951 dailyPlan:3973 dailyState:4004 storeOffer:4025 buyStore:4038 pay:4044 fireAmmo:4056
- **4076** pose des cartes : frees:4092 canMove:4105 move:4109 wallLinks:4121 fixLinks:4128 recall:4136 placeBench:4147 useCharges:4169 lineCells:4181 placeLine:4197 canPlace:4210 place:4235
- **4307** fusion et évolutions : absorb:4323 merge:4338 mkey:4391 mtr:4397 cure:4410 lose:4423 applyItem:4490
- **4522** la nuit : waveList:4533 broodDeath:4581 zMaxHp:4587 newcomers:4597 spawn:4602 bigNight:4612 nextWave:4616 startNight:4621 hit:4678 explode:4714 lureTarget:4722 nearestLure:4730 squad:4754 dmgParts:4766 attack:4832 strike:4935 enter:5053 step:5143 endNight:5518 canReact:5595 react:5609 runNight:5767

### src/audio.js

> Sons du jeu : générés en code avec Web Audio, plus des grognements de zombies enregistrés 

(aucune fonction nommée)

### src/art-liste.js

> Généré par node tools/art-liste.js : images du style artiste présentes dans assets/art/ (n

(aucune fonction nommée)

### src/game.js

> Rendu canvas, interface et boucle de jeu. Dépend de src/engine.js (global Z).

- **1** (début) : loadSprites:212 sprK:229 drawSpr:235 hdArt:300 applyArt:314 cardStats:357 ajouterDefsCartouches:437 cartoucheSvg:441 seen:467 novice:474 cardLook:499 bonusCoins:557 isNewCard:578 markCardSeen:585 cardFace:609 saveOpt:715 applyOpt:723 applyCur:743 toggleFs:762 unpause:781 R:789
- **820** state
- **822** progression entre les parties (localStorage) : loadMeta:823 endTest:844 saveMeta:849 ach:890 showAch:902 deckCanAdd:935 edGain:949 edCommit:958 edDrop:988 achCheck:1014 achNight:1039 achScreen:1047 tuto:1066 guideStep:1097 guideOk:1241 tutoTip:1262 tutoHand:1274 tutoPicks:1297 tutoEnd:1302 newGame:1317 fillHand:1364 drawCards:1372 syncBoard:1401 rebuildPos:1433 cellRect:1444 fly:1449 animPiles:1511 pilesHtml:1569
- **1639** sauvegarde (localStorage, marche aussi dans Electron/Tauri) : save:1642 loadSave:1667 clearSave:1694 resume:1700

### src/game-draw.js

> Dernier Abri : dessin de la carte (canvas), effets visuels et boucle d’affichage.

- **3** canvas setup : fit:24 rng:43 leafTree:207 pineTree:260 rockDeco:301 logDeco:324 cactus:352 deadBush:380 carWreck:400 concreteBlock:427 barrel:444 rubble:469 deadTree:485 roofDeco:499 lampPost:576 puddle:597 manhole:607 mushroom:625 tumbleweed:642 skull:651 pumpkin:673 hayBale:698 snowdrift:721 snowman:735 boulderBig:765 buildCity:776 cityRing:793 proj:877 poly:881 tone:889 building3d:894 cactus3d:966 rock3d:1034 ringItem:1099 dirtRoad:1130 drawWoods:1222 setBiome:1295 buildGround:1303 boardEdge:1757 boardFrame:1941 ringFog:2096 drawEdgeNight:2121 clearDecals:2164 splat:2167
- **2179** v274 : idée 8, le plateau garde les traces des nuits : resetMarks:2190 sampleHordeTrail:2198 buildTrail:2214 drawHordeTrail:2232 drawBloodMark:2245 addBloodMark:2280 redrawDecals:2287
- **2295** live visual state : vib:2315 camZoom:2330 shake:2335 jit:2345 zpos:2349 syncZ:2366
- **2415** dessin : un seul style pour tout le jeu (contour sombre, ombre portée, ombrage, petits dét : ell:2417 circ:2424 line:2431 oEll:2441 oCirc:2445 oLine:2449 oRect:2453 rrect:2459 oRound:2463 shade:2472 person:2640 dogShape:2765 zombieBlinkOpen:2807 lightAt:2813 pushSpriteEyes:2824 hpBar:2859 drawBars:2863 socle:2884 trackBoard:2947 cracks:3038 crater:3059 groundCrack:3084 wallJit:3108 unitAnim:3116 drawUnit:3209 drawUnitInner:3315 wallSect:4083 wallPost:4315 drawPerched:4393 feuLayout:4409 feuPoint:4476 feuCellPath:4491 feuTongue:4512 drawFireBeds:4522 feuFlame:4572 drawFireFlames:4579 drawCurrent:4699 drawEnclosure:4727 murRelief:4745 drawRamparts:4754 wireSect:4903 wirePost:4926 drawWires:4930 drawGuide:5007 guideHand:5037 drawKillZones:5106 drawBossRoute:5140 drawShelter:5187 zAnim:5290 drawZombie:5319
- **5471** effects : addFX:5472 drawGrassBlade:5477 tapScale:5492 tapZoom:5503 boardTapFx:5512 risePuff:5560 pieceTapReact:5576 poseImpactFx:5602 drawPoseFx:5627 burst:5658 drawHealBolt:5677 drawHealGlow:5701 drawFX:5726 floatTxt:5820 drawFloats:5823 mkGlow:5893 drawSky:5914 drawGlow:5995 lights:6025 drawFog:6122 drawAmbient:6136 drawSpriteEyes:6214 drawDark:6243 frame:6298 drawPlace:6314 titleDeco:6373 frameInner:6426 safeTxt:6681
- **6691** portée d'une unité touchée (v303, proposition C) : reachCells:6695 reachOutlinePath:6701 drawHealCross:6714 drawReticle:6723 drawReachZone:6745 edAura:6789 dmgCached:6880 bTag:6886 dmgBadge:6904 dmgLinks:6925 placeGain:6990 placeHints:7025

### src/game-ui.js

> Dernier Abri : interface du jour et de la nuit (fiche, main, plateau, déroulé de la nuit).

- **3** combat events → visuals : playEvents:4 showHeal:501
- **532** UI : ficheHtml:534 trackHtml:565 tagsHtml:582 shelHit:609 render:628 fireAmmo:879 updatePreview:903 curAt:1103 useBuild:1124 spentTrace:1132 countPlay:1140 placeLineUI:1151 dmgInfo:1201 dmgSnap:1215 bonusMsg:1223 unitLine:1265 hint:1432 showHint:1441 checkHints:1469 mergeFx:1493 playReact:1532 snapUndo:1570 doUndo:1585 squadFx:1612 tapCell:1624 peekScreen:1749 wavePause:1762 resumeWave:1773 countBosses:1788 slowOnBoss:1791 night:1796 feltLayout:1918 ftPioche:1961 ftHorde:1985 ftJournal:2001 feltTabs:2029

### src/game-screens.js

> Dernier Abri : écrans (aube, options, collection, decks, préparation) et actions des bouto

- **3** l'aube : relique, carte pour demain, boutique : dawn:5 afterRelic:30 dawnStep:35 dawnTxt:85 shopScreen:102 storeScreen:121 listScreen:135 removeCard:140 nightScreen:151 nextDay:165 victory:179 leaveWin:239 wishBtn:263 demoEnd:268 giftStart:295 giftLeft:305 giftScreen:309 giftSync:326 giftTap:347 giftTake:371 giftDone:374 statsScreen:392 logRun:416 end:431 zombieFace:499 optionsScreen:515 runInfo:545 pfoot:584 show:601 countUp:639 hide:654
- **662** collection, decks et préparation de la partie : takeLegacy:664 ensureMeta:676 prepScreen:711 cfOpen:768 cfPool:779 cfList:789 cfTabs:805 cfBar:823 cfPips:842 cfBookHTML:850 cfBook:861 cfSync:894 deckEditor:900 collectionScreen:932 cfBarOld:994 cfGrid:1007 cfApply:1037 cfSyncOld:1042 deckEditorOld:1048 collectionScreenOld:1060 evoScreen:1116 nextUnlockTxt:1660

### src/game-menu.js

> Dernier Abri : défi quotidien, tableau des combats, menu pause, raccourcis, accueil et dém

- **3** défi du jour (v151) : une seule nuit contre la horde du jour, 8 cartes tirées « 1 parmi 3  : dailyEnd:9 dailyBest:13 dailyScreen:34 dailyDraft:44 dailyStart:54 dailyOver:63 pauseMenu:214 abortNight:224 nightBanner:249 zoomCf:268 zoomClose:283 title:452 meterHead:502 meterBody:507 meterSync:538 keepEnd:582 detScreen:585 detSync:592 muteIcon:611 iosHint:620 hglowFit:823

### src/game-anim.js

> v170 : animations de cartes inspirées de Hearthstone (main, plateau, menus).

- **1** (début) : aEl:5 aAnim:12 aDone:19
- **28** main : éventail, cartes jouables, refus : handFx:31 shakeCard:60 refuseBubble:76 refuseFx:87
- **137** glisser : la carte se penche dans le sens du mouvement
- **160** pose : la carte vole jusqu'à la case et s'écrase : placeFx:161 landFx:177
- **191** fin du jour : les cartes réutilisables non jouées brûlent : burnFx:192
- **229** nuit : une défense détruite vole en éclats : shardsFx:230
- **262** aube : les 3 cartes au choix arrivent face cachée et se retournent : dealPicks:263 goldBurst:319
- **347** grande carte : elle grandit depuis sa place, penche sous le doigt, reflet qui suit : zoomTilt:371
- **404** collection : cascade, déblocage : cascade:406 coinsFx:464 unlockFx:497
- **539** decks : ajout, retrait, deck complet : popEl:541 deckDone:605
- **618** préparation : le deck choisi avance, les autres reculent
- **650** lancement : le deck est battu puis plonge dans la pioche : launchFx:651
- **745** récompense : paquet qui tremble puis explose, retournement selon la rareté : packFx:746 revealFx:779
- **831** v171 : deuxième série (unités, nuit, économie, menus) : cvPt:833 bolt:838 fuseCardsFx:898 lvFx:955 typeFx:985 bossBanner:999 ejectCartridge:1036 spinChangedCoins:1061 renderFx:1081 endPts:1295

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
- **351** 8 : maison touchée

### src/game-artx.js

> v200 : refonte du jeu dans le style artiste (html.artx seulement) : plateau dessiné d'Amin

- **1** (début) : axPalSet:18 axGround:57 axPlat:63 axBig:121 axGlow:268 axGlowHtml:323 axHome:372 axPad:416 axLay:425 axOn:550 axRing:575 axFxDraw:602 axMurRoads:709 axMurMask:717 axPaint:766
- **900** v216 : nouvelle disposition du style artiste, d'après les maquettes d'Amine : ax3Want:907 ax3Build:910 ax3Put1:924 ax3Put:943 ax3Back:964 ax3Phase:976 ax3Zoom:1109 axFarDraw:1185
- **1288** v245 : accueil du style artiste sur le modèle d'Amine : axPlayHtml:1293 axBigBtn:1298 axTitleHtml:1301

### src/game-coll.js

> ---------- collection du style artiste (v222) ----------

- **1** (début) : lcItem:43 lcDkItem:60 lcInfo:69 lcDetail:95 lcBase:103 lcList:110 lcCells:115 lcDeckSide:133 lcScreen:161 lcFill:223 lcPage:242 lcSearch:282 lcShow:288 lcOvPlace:342 lcOvOpen:355 lcOvClose:388 lcOri:422 lcGyro:435 lcNo:452 lcReset:619
- **648** déblocage d’une carte : la coque grise tremble, se fissure de lumière et vole en éclats (v : lcbGeometry:667 lcbCanvas:707 lcbResize:717 lcbEmit:725 lcbDrawParticles:728 lcbFrame:787 lcbStart:808 lcBreak:1199 lcBreakNew:1216 lcBreakBuy:1231

### src/game-fx3.js

> v230 : quatrième série d'effets (validée par Amine). Affichage seulement, aucune règle ne 

fx3Reset:67 fx3Events:86 fx3DawnK:218 fx3Corpses:224 fx3Idle:361 fx3Weather:404 fx3Layer:465 fx3Cam:515

### src/game-fx5.js

> v240 : le camp prend vie (demande d'Amine). Affichage seulement, aucune règle ne change.

fx5On:64 fx5Named:71 fx5Line:80 fx5Say:87 fx5Events:114 fx5Tick:163 fx5Edge:232 fx5Crows:241 fx5Shoo:270 fx5Crow:277 fx5Chores:364 fx5Smoke:474 fx5Marks:514 fx5Leaves:568 fx5Dusk:618 fx5Wrap:663 fx5Bubbles:677

### src/game-load.js

> v244 : chargement des images (v254 : étape, pourcentage et astuces sur l'écran de chargeme

preloadImg:11 inCache:24 preloadUi:35 preloadCards:41 bootUrls:52 bootStepLabel:63 bootBar:70 bootTips:99 bootEnd:118 preloadBoot:129 preloadBigOk:153 preloadIdle:159 preloadBackground:173

### src/game-accueil.js

> v301 : nouvel accueil d'Amine (maquette-accueil.html validée) : son image de fond telle qu

accMatrice:92 accSceneHtml:101 accPlacer:141 accAmbiance:167 accScene:219 accLogo:243

### src/game-menufx.js

> v302 : animations des menus (validées par Amine sur la maquette)

- **8** 1 : fermeture en fondu : closeGhost:10
- **37** 3 : vague au toucher et lueur qui suit la souris : rippleAt:39
- **93** 4 : le panneau grésille comme un poste radio : radioCrackle:94
- **115** 5 : l'onglet choisi glisse vers le nouveau : slideTabs:118
- **150** 8 : barres qui se remplissent : growBars:151
- **170** 9 : boutique : refusePrice:173 rememberBuy:187 buyFx:192
- **219** 7 : succès : sparksAround:220
- **273** show : tout ce qui joue quand un écran s'affiche

### src/game-3d.js

> v304 : aperçu des personnages en 3D dans le vrai jeu (essai, pas encore validé par Amine).

(aucune fonction nommée)

## src/style.css

17112 lignes. Les règles s’empilent par version : **à sélecteur égal, la dernière l’emporte**. Le style artiste est sous `html.artx` (1326 lignes). Chercher un sélecteur avec `grep -n` plutôt que par section.

- 1 polices intégrées au jeu (licence SIL OFL), pour jouer sans internet
- 2 v252 : Creepster, police d'horreur réservée au bouton « Affronter la nuit »
- 75 Layout: one-screen phone app — header, night forecast, live top-down map (canvas), hand of
- 904 fusion (doré) et évolution (violet) dans la fiche d'unité
- 912 alliance active et annonce des très grosses nuits
- 922 munitions anti-Colosse : stock, bouton de tir, compte à rebours
- 960 écran d'ordinateur (version Steam) : colonne et carte plus larges
- 970 carte de construction déjà utilisée aujourd'hui (réutilisable), et carte en cours de gliss
- 992 rôle de l'unité (Tank, Soin, DPS) en bas à gauche de la carte
- 1001 illustration de carte (image sans texte) : remplit le haut de la carte, le texte du jeu re
- 1026 ---------- face de carte : le gabarit cartoon d'Amine (assets/ui/cadre.webp, fenêtre et ex
- 1074 effet qui sort du cadre : l'illustration et le personnage détouré occupent une même « scèn
- 1291 version de la main : pas de texte d'effet, le nom et les stats en plus grand
- 1338 main : la carte remplace le bouton
- 1375 choix de l'aube : de grandes cartes
- 1393 collection et deck : une grille de cartes
- 1420 aperçu en grand de la carte survolée ou choisie (ordinateur)
- 1438 faction / rôle à l'encre en bas de la carte
- 1465 recherche et tri des cartes
- 1507 v73 : limite d'unités, réserve, rappel
- 1530 v78 : table de jeu (pioche, main, défausse, réserve)
- 1699 v79 : disposition — en hauteur, l'interface entoure la carte ; en largeur (PC, tablette, t
- 1786 téléphone tourné : peu de hauteur, on resserre
- 1924 v87 : conseils au bon moment
- 1958 v92 : options
- 2022 v93 : aspect jeu de société — table en bois, plateau encadré, cubes d'énergie, bande de pa
- 2100 en largeur, le plateau est posé sur la table : on retire la forêt prolongée
- 2109 v95 : fiche de nuit, piste des nuits, jetons
- 2353 v98 : icônes de faction à l'encre (mêmes pictogrammes que sur les cartes)
- 2397 v98 : la fiche de nuit devient une tuile de plateau (carton épais, cadre imprimé, rivets, 
- 2536 v100 : dos des cartes d'Amine (assets/ui/dos.webp) pour la pioche et les cartes qui volent
- 2558 v101 : logo sur l'accueil, règles du jeu dans leur propre écran
- 2575 v101 : les écrans (accueil, aube, troc, collection…) deviennent des fiches de papier posée
- 2652 v102 : tapis de feutre vert sous la fiche de nuit, la piste et les jetons, comme sous la m
- 2671 v103 : pas de tapis autour ; c'est la fiche de nuit elle-même qui devient un tapis de feut
- 2713 v104 : nom de la nuit écrit directement sur le feutre, sans étiquette
- 2728 v105 : plus d'intitulé « La horde », les jetons parlent d'eux-mêmes
- 2736 v106 : une phrase courte et poétique par type de nuit ; l'effet est dans le détail (touche
- 2745 v107 : la phrase remplace le nom de la nuit sur la fiche
- 2752 v110 : page des évolutions secrètes
- 2785 v111 : carte d'une unité fusionnée : bandeau d'étoiles dorées et cadre qui brille
- 2829 v111 : piste des nuits sur toute la largeur ; mutation et ferraille au bout de la rangée d
- 2880 v112 : première nuit guidée : la carte et le bouton à toucher pulsent en doré
- 2922 v115 : mode économie (petits téléphones) : pas de flous ni d'ombres portées calculées, pas
- 2942 v116 : niveaux de Menace et victoire
- 2967 v119 : dos de carte doré (récompense de la première victoire)
- 2982 v120 : icônes des reliques, hélicoptère et carte de victoire
- 3025 v122 : icônes à l'encre à la place des émojis
- 3080 v123 : règles en fiches illustrées
- 3144 statistiques
- 3205 animations de fin de partie
- 3301 v126 : collection, trois états bien lisibles (débloquée, à portée, hors de portée)
- 3442 v126 : tableau des combats (feutre vert comme la fiche de nuit)
- 3616 en portrait : il s'ouvre en haut, par-dessus la fiche de nuit et la piste (la carte et la 
- 3627 sur ordinateur et téléphone tourné : rangé dans la colonne de droite, dans l'espace libre
- 3650 téléphone tourné : pas de place dans la colonne, il flotte au-dessus de la carte
- 3663 v126 : le tableau des combats dans l'écran de fin de partie
- 3679 v128 : succès (bandeau et page)
- 3781 révélation progressive (v129)
- 3797 mode test
- 3834 v139 : grande carte et raccourcis clavier
- 3871 pas de menu « enregistrer l'image » de l'iPhone sur les cartes (appui long = grande carte)
- 3878 menus : la carte grossit un peu au survol de la souris
- 3904 v139 : transitions d'écran
- 3931 main : la carte se soulève au survol de la souris
- 3941 bandeau « Nuit N »
- 3995 ===== v141 : panneaux en bois (option A), boutons en relief, halos de la collection =====
- 4121 petites fiches de papier posées sur le bois : texte sombre
- 4174 boutons en relief : bombés, s'enfoncent au clic ; choisi = enfoncé et doré ; bloqué = plat
- 4281 collection : halo de rareté = carte acquise (règle v186 en fin de fichier), halo noir = pa
- 4300 boutons secondaires côte à côte, pour que les menus tiennent sans défiler
- 4395 ===== v142 : vraie texture de bois (raccordable, sans démarcation), clous ronds =====
- 4406 boutons toujours visibles en bas des écrans qui défilent : une étagère en bois
- 4432 titres des fiches de papier (règles) en encre sombre
- 4443 champs de texte et menus déroulants : papier enfoncé dans le bois, flèche dessinée
- 4483 barre de recherche et filtres : planche sombre, comme le reste
- 4503 range (volume) aux couleurs du jeu
- 4507 succès : tuiles comme les statistiques, fiches de papier
- 4572 ===== v143 =====
- 4573 symboles de mutation et textes d'alerte : rouge vif sur le bois
- 4577 troc : article impossible = fiche de papier grisée, encore lisible
- 4602 filtres collés en haut : fond opaque, les cartes passent dessous sans se voir
- 4616 v147 : image d'ambiance derrière les menus hors partie (accueil et ses écrans), nouveau lo
- 4627 v168 : en hauteur, sans phrase d'accroche ; le logo monte dans le ciel et le menu commence
- 4679 v150 : récompense de fin de partie. Cartes face cachée (sans halo), on touche pour retourn
- 4919 défi du jour (v151) : la horde du jour, le tirage et le score
- 4964 démo (v153) : étiquette sous le logo
- 4990 v154 : tout ce qui est verrouillé reste lisible, simplement grisé (demande d'Amine)
- 5007 ===== v155 : boutons en planche clouée, texte au pochoir (style E choisi par Amine) =====
- 5094 grisé 1
- 5117 grisé 2
- 5146 icônes du haut
- 5174 v155 : icône des bulles d’aide à taille de texte (elle couvrait l’écran)
- 5181 v161 : abri touché (barre qui tremble, bord de l’écran qui rougit)
- 5220 curseurs PC (option « Curseur de la souris »)
- 5262 ---------- v170 : animations de cartes (game-anim.js) ----------
- 5263 main en éventail : rotate et translate restent séparés de transform (sélection, survol)
- 5294 carte jouable : liseré vert qui pulse (en phase d'un dessin à l'autre grâce à --ph)
- 5315 refus : bulle au-dessus de la carte
- 5347 pioche : la carte se retourne en vol
- 5374 reflet qui passe sur les cartes rares, épiques et légendaires (main, grande carte, choix, 
- 5400 grande carte : penche sous le doigt, reflet qui suit
- 5420 fin du jour : la carte brûle depuis les bords
- 5476 aube : cartes au choix face cachée, éclat de la couleur de la rareté
- 5505 collection : pièces, cadenas, éclat et tampon « Obtenue »
- 5619 deck complet : liseré doré
- 5640 lancement : le deck est battu au centre de l'écran
- 5659 récompense : paquet qui tremble puis explose
- 5760 carte face cachée : sa lueur annonce la rareté (blanc, bleu, violet, doré)
- 5822 boutons : ils s'enfoncent puis rebondissent
- 5839 changement d'écran : glissement un peu plus marqué
- 5849 Mode économie et appareils qui demandent moins de mouvement : pas d'effet en boucle
- 5874 ---------- v171 : deuxième série d'animations ----------
- 5875 boss : bandeau qui traverse l'écran
- 5931 abri presque détruit : barre qui bat, bords rouges qui pulsent
- 5980 ferraille : pièces de métal
- 5989 relique : tourne au centre puis file se ranger
- 6037 mutation : le chiffre se fissure, lueur verte
- 6078 succès : la médaille tombe et rebondit
- 6136 ---------- v173 : fiche de fin de partie (game-fiche.js) : rapport de survie sur papier us
- 6509 v174 : accueil animé (brume qui dérive au pied de la palissade, braises qui montent, logo 
- 6649 v175 : lueurs posées sur l'image d'accueil (#hglow suit le cadrage « cover » de l'image, v
- 6758 v179 : grand écran PC : tapis vert collé à gauche (fiche de nuit, piste, jetons, pioche, d
- 7172 v181 : éditions spéciales (cartes de collection) : liseré coloré sur le cadre (.cf-ed), ef
- 7257 Dorée
- 7291 Blindée
- 7317 Fantôme
- 7344 Holographique
- 7376 Ensanglantée
- 7442 v184 : carte choisie à la récompense : un tampon à l'encre sur l'illustration (remplace la
- 7494 v185 : plus de rareté écrite sous les cartes offertes : le halo suffit ; une carte spécial
- 7510 v186 : un seul code de halo partout : la couleur de la rareté (commune verte, rare bleue, 
- 7563 v189 : fiche d'unité en pastilles (PV, dégâts, portée, victimes) et détail des bonus de dé
- 7659 tutoriel : main qui montre le geste
- 7701 v191 : bouton des trous, bouton de la nuit vivant, nuit rouge, maison touchée
- 7803 ===== v196 : refonte de l'interface du style artiste (maquette d'Amine) — seulement sous h
- 7824 Trois polices, trois rôles (v248) :
- 7849 panneaux : encre sombre usée, liseré clair très fin
- 7869 titre : bandeau sombre, capitales condensées, trait rouge à gauche
- 7931 fiches de papier : parchemin crème, bord noir
- 7950 boutons : parchemin, texte noir en capitales ; principal : rouge sang ; plus de bois ni de
- 8009 icônes du haut : carrés sombres
- 8023 onglets, choix, quantités : cases sombres ; le choisi en rouge
- 8067 champs, menus déroulants, barre de filtres, étagère du bas
- 8105 curseurs et cases : rouge ; les cases des Options deviennent des interrupteurs
- 8147 succès et barres de progression
- 8164 écran de jeu : fiche de nuit, main, tableau et tapis PC en encre sombre (plus de feutre ve
- 8187 jour en cours : étiquette de parchemin, comme sur la maquette
- 8213 v197 : écran de jeu d'après la 2e maquette d'Amine
- 8214 téléphone en hauteur : grande étiquette « JOUR n » posée à gauche de la fiche de nuit
- 8258 piste des nuits : cases sombres, nuit rouge en rouge sang, nuit en cours en parchemin
- 8296 pastilles (survivants, menaces, ferraille) : parchemin à bord noir
- 8319 énergie : cases jaunes dans une barre sombre ; Annuler : bouton sombre à bord vert
- 8343 zombies de la horde : jetons ronds à liseré, chiffre sur pastille claire
- 8347 v197 : boutons en métal usé (demande d'Amine) : acier brossé, rayures, rouille et rivets ;
- 8387 onglets et icônes : métal sombre bruni, le choisi en tôle rouge
- 8413 v198 : métal uniforme (plus de taches de rouille sur les bords, rayures discrètes) ; cadre
- 8469 ===== v199 : relief (demande d'Amine) : métal éclairé et bosselé, biseaux, texte gravé ; p
- 8490 panneaux et cadres : tôle épaisse bosselée, éclairée d'en haut, biseau clair en haut et so
- 8526 boutons secondaires : plaque d'acier brossé épaisse, texte gravé
- 8549 bouton principal : tôle peinte en rouge, bosselée
- 8567 onglets : touches de métal, la choisie enfoncée et rouge
- 8605 champs creusés dans le métal
- 8622 « Affronter la nuit » : le panneau de la maquette (tôle rouge cabossée, cadre de métal noi
- 8654 ===== v200 : refonte du jeu (maquettes validées par Amine), style artiste seulement (html.
- 8655 v201 : retour au cadre cartoon (choix d'Amine) avec les illustrations de l'artiste ; son c
- 8656 ---- PC (html.felton) : bandeau en haut, colonne d'infos à gauche, plateau au centre, fich
- 8762 bandeau : étiquette du jour à gauche, icônes et abri à droite
- 8810 cadres en métal fin et foncé : colonnes, plateau, main
- 8833 pioche à droite de la main, défausse à gauche
- 8899 ---- téléphone en hauteur : bandeau en fond du haut, bouton carré « Affronter la nuit » à 
- 8968 bouton de vitesse (nuit) : plaque d'acier lisible
- 8984 ===== v201 : PC — plateau sur toute la hauteur, colonnes gauche et droite de même hauteur 
- 9106 ===== v202 : fonds d'Amine à l'accueil et derrière le jeu, lueurs de l'accueil sur ce déco
- 9201 v203 : PC — panneau de droite : jour et icônes, fiche d'unité, grande carte (survolée ou c
- 9248 v204 : PC — le plateau garde sa taille maximale ; sur grand écran, les panneaux prennent t
- 9282 ===== v205 : PC — panneau gauche en 3 blocs (nuit, onglets Pioche/Horde/Journal, défausse 
- 9485 ===== v206 : nuit (PC) — hors du canvas, l'image du plateau s'assombrit exactement comme l
- 9496 v208 : nuit (PC) — canvas des brumes de la v195 prolongées sur la palissade (#axFx), fondu
- 9528 v211 : PC — cadre en acier serré autour du plateau ; le canvas du jeu déborde jusqu'au cad
- 9558 ===== v213 : collection et decks en classeur (style artiste seulement) (inspiré de Hearths
- 9594 intercalaires : de vrais onglets de classeur, collés à la page ; l’onglet choisi se fond d
- 9672 recherche + bouton Filtres sur une ligne ; les menus s’ouvrent dessous
- 9722 puces de rôle et de type
- 9758 le classeur : une page de papier réglé à anneaux
- 9804 page qui tourne comme un livre, autour de la reliure à gauche
- 9904 repères : « Nouveau », carte spéciale cachée derrière (coin doré)
- 9933 Atelier : les cartes acquises s’éteignent, celles qu’on peut payer brillent
- 9960 éditeur de deck : toucher une carte l’ajoute ; le deck est un tiroir en bas (téléphone) ou
- 10322 ===== v213 : le classeur dans le style artiste (acier, papier crème, rouge, capitales Oswa
- 10486 le pied de la collection et le tiroir du deck : même plaque d’acier rivetée, liseré rouge
- 10563 v214 (style artiste) : feuille avec de la profondeur (pile de pages, reliure, coin corné) 
- 10687 v214 : lignes du deck de la même couleur crème que le papier des cartes (cadre.webp)
- 10707 ===== v215 : pack « maquette » d'Amine (style artiste seulement) : images en découpe 9 cas
- 10729 boutons secondaires : tuile charbon, texte crème
- 10750 bouton principal : tôle rouge sang tachée, texte crème cerné de noir
- 10776 « Affronter la nuit » : droit, mains de zombies par-dessus la tôle, sous le texte
- 10796 onglets : tuile charbon, le choisi en rouge
- 10806 boutons icônes (son, musique, plein écran)
- 10818 étiquette du jour : parchemin brûlé
- 10826 fiches et pastilles en papier : parchemin aux bords brûlés
- 10849 énergie : cases jaunes à bord sombre
- 10858 ===== v216 : nouvelle disposition du style artiste (maquettes d'Amine) : #ax3 (game-artx.j
- 10900 formes communes : panneau noir
- 10910 ciel du jour : jour (ou nuit) en haut à gauche, phrase dessous, tampon à côté
- 11048 piste des nuits
- 11105 camp : icônes et chiffres, sans pastilles
- 11163 Deck (dos noir biohazard), Réserve et Défausse : trois formes séparées
- 11291 onglets Pioche / Horde / Journal : liste en lignes sombres, liseré de couleur, illustratio
- 11356 colonne de droite : logo et icônes centrés sur l'abri, abri, grande carte, énergie, bouton
- 11498 v251 : « Affronter la nuit » au style de « Jouer » (panneau noir rougi, halo de braise), a
- 11531 fond rouge du bouton, comme « Jouer »
- 11546 sticker de zombies, à gauche du texte et à l'intérieur du bouton
- 11561 police d'horreur sur « Affronter la nuit » (le bouton de vitesse, pendant la nuit, garde O
- 11567 v253 : plus de carte jouable, « Affronter la nuit » brille et respire comme « Jouer ».
- 11643 ---- ordinateur ----
- 11687 ---- téléphone en hauteur ----
- 11688 v250 : le décor couvre tout l'écran, recadré au centre et assombri (avant : bande de 270 p
- 11857 v230 : plateau d'Amine avec la forêt (plateau-foret.webp) : l'image entière est sous le ca
- 11923 v217 : bac de cartes en 3 couches : le fond (découpe 9 cases : les poteaux et la planche d
- 12002 v217 : abri en panneau noir, texte crème
- 12022 v217 : onglets en formes pleines (panneau noir) ; l'onglet ouvert a un trait rouge en haut
- 12043 v217 : Deck, Réserve et Défausse toujours pleins ; vides ou pendant la nuit, seuls le chif
- 12051 v217 : ordinateur : plateau et bac (même largeur, comme l'image d'Amine) au centre, colonn
- 12083 v217 : téléphone : bac de la largeur du plateau, aussi haut que la place le permet
- 12117 v219 : nouveaux cadres de carte de l'artiste (assets/art/ui/cadre-*.webp, fenêtre transpar
- 12221 ===== v219 : les formes de la maquette d'Amine partout dans le style artiste (menus, écran
- 12271 v250 : les boutons rouges reprennent le style de « Jouer » (panneau noir rougi, halo de br
- 12342 v219 : accueil sans panneau (les boutons et les fiches se posent directement sur le fond)
- 12349 v219 : pied des écrans à défilement (Options, Préparer la partie…) : plus de plaque de mét
- 12367 ===== v222 : collection du style artiste reprise du laboratoire (interfaces/collection) : 
- 12583 une carte de la grille : inclinaison 3D, reflet, lueur dorée quand elle est choisie
- 12635 v268 : déblocage d’une carte (game-coll.js, LcBreak) : coque grise, fissures de lumière, é
- 12643 v270 : les cartes de la collection respirent légèrement, décalées les unes des autres
- 12805 cartes distribuées : elles tombent de haut en tournant
- 12823 grande carte : se retourne, flotte, s’incline au survol
- 12982 ordinateur : trois colonnes comme le laboratoire, la grille défile seule
- 13112 v223 : grand écran : colonnes gauche et droite limitées à 440 px (sinon elles s'étirent et
- 13117 v224 : écart plateau / colonnes de 12 px, jusqu'à 50 px quand l'écran a de la place (choix
- 13121 ===== v225 : collection et deck sur le même écran, en pages (plus de défilement) =====
- 13209 bas de l’écran : pages au-dessus des boutons sur téléphone, sur une ligne sur ordinateur
- 13259 téléphone : grande carte par-dessus la grille
- 13340 deck sur téléphone : le tiroir reste dans la page, sous la grille
- 13355 effets des cartes
- 13489 ordinateur : trois colonnes, rien ne défile
- 13594 v225 : en jeu, une carte qu’on ne peut pas jouer est grisée (style artiste)
- 13607 v226 : pas de barre de défilement dans la collection et le deck ; formes du jeu (panneau n
- 13701 v227 : onde au clic sur les boutons (src/game-artx.js)
- 13733 v227 : bouton qui reste enfoncé (filtre, onglet, option choisie) : 2 px plus bas, creusé, 
- 13773 v228 : menus et panneau du deck dans le style du reste (panneaux noirs, texte crème, Oswal
- 13893 v229 : sous la liste du deck, les rôles (Tank, Soin, DPS) en tuiles et les maximums par ra
- 14001 v232 : carte plus haute dans le style artiste (choix d'Amine : ni bande ni zoom). Les illu
- 14088 v237 : téléphone tourné en style artiste : plateau encadré à gauche sur toute la hauteur, 
- 14204 v292 : plateau à routes en croix d'Amine (plateau-herbe.webp, 1254 × 1254 px, cadre compri
- 14234 v296 : téléphone en portrait : plateau à palissade sans forêt (plateau-mur.webp, cases de 
- 14263 v241 : interface plus lisible (demande d'Amine)
- 14264 1 : compteur d'énergie toujours visible le jour : gros chiffre, jetons, à gauche du texte
- 14334 3 : le nom du jeu, coupé sur ordinateur (« Barric… »), n'est plus affiché pendant la parti
- 14340 7 : plus d'énergie (ou plus rien à jouer) : le bouton de la nuit appelle clairement
- 14372 téléphone en portrait
- 14486 ===== v245 : accueil du style artiste sur le modèle d'Amine (game-artx.js, axTitleHtml) ==
- 14503 v246 : les menus ouverts depuis l'accueil gardent son décor, assombri derrière le panneau
- 14565 textes posés sur le décor, sans fiche beige
- 14626 grands boutons (Collection et decks, Défi du jour) : panneau noir, icône, filet, libellé
- 14661 « Jouer » : panneau noir rougi (version B)
- 14704 « Jouer » respire : il grossit un peu et son halo s'élargit
- 14731 barre du bas
- 14814 PC peu haut et téléphone tourné : tout se resserre
- 14852 téléphone en hauteur : logo dans le ciel, menu sous le plateau, barre de 4 icônes
- 14937 entrée : le logo tombe et rebondit, les boutons glissent depuis la gauche, la barre monte 
- 14994 lueurs du décor : étoiles, brume devant la forêt, lucioles
- 15076 v246 : flamme de la lanterne de l'accueil plus forte (halo large qui vacille, mélangé en l
- 15108 v248 : chiffres et étiquette de type des cartes en Oswald (lisibles en petit)
- 15113 v249 : dégâts dans une bulle ronde (laiton, épée en filigrane), soin en vert ; PV d'un tan
- 15183 v256 : téléphone tourné (large mais peu haut) : les 13 familles de la collection ne tienne
- 15205 v257 : accueil sur PC : logo et boutons centrés en hauteur dans la colonne de gauche
- 15211 v257 : collection sur téléphone tourné : 2 lignes de 5 cartes, grande carte plus haute ave
- 15250 ===== v261 : énergie en cartouches de fusil (dessinées en SVG, cartoucheSvg dans game.js),
- 15290 ===== v258 : points de la collection : écrou de ferraille sur le panneau noir =====
- 15317 v260 : le décor de l'accueil reste fixe (ne suit plus la souris) ; lueurs et animations ga
- 15322 v263 : nouveau cadre de carte d'Amine (assets/art/ui/cadre-barricard.webp, 728 × 1106, fen
- 15373 reflet qui balaie l'illustration de temps en temps (coupé en mode économie et si l'apparei
- 15438 dégâts et PV posés sur le bord bas du cadre : le parchemin reste au texte
- 15476 v263 : coût, dégâts et PV en relief : pièces bombées (reflet en haut, ombre en bas, bord m
- 15512 reflet bombé en haut de la pièce + éclat qui la traverse
- 15556 chiffres gravés : clair en haut, ombre en bas, contour sombre
- 15580 v263 : carte survolée (souris) ou touchée : elle grandit et monte au-dessus du bac pour se
- 15620 v263 : fenêtre de choix de cartes plus grande, pour bien voir les cartes
- 15629 v263 : onglets Pioche / Horde / Journal repliés : seule la rangée d'onglets reste
- 15636 v264 : identité visuelle des cartes (game.js : cardLook). Couleurs de rôle de l'artiste :
- 15665 liseré lumineux autour de l'illustration, teinte en bas de l'illustration, petite vie : da
- 15676 au-dessus du cadre (sinon caché par son ombre intérieure), en lumière douce qui éclaire le
- 15763 emblème de la bande (faction) imprimé en filigrane dans le parchemin
- 15788 pierre de coût : couleur du rôle et forme selon le type (rond survivant, carré défense et 
- 15808 Holographique : reflet arc-en-ciel qui glisse sur la carte, et paillettes
- 15846 Légendaire animée : braises qui montent et lueur dorée qui respire
- 15872 ===== v266 : idées validées pour les cartes (docs/IDEES_CARTES.md) =====
- 15873 12 : lumière de la scène : chaude le jour, bleue la nuit, rouge pendant la nuit rouge (htm
- 15894 11 : cadre métallique : un reflet glisse sur les ornements du cadre seulement (masque = le
- 15952 9 : bonus visibles : pièce verte, petite flèche, et elle grossit la première fois qu'on la
- 16001 10 : carte nouvelle : bandeau NOUVEAU et reflet (main) ; dans la collection, le même refle
- 16049 Mode économie et appareils qui demandent moins de mouvement : pas d'effet en boucle
- 16068 7 : douille éjectée quand on dépense de l'énergie (game-anim.js : ejectCartridge)
- 16083 4 : pièce qui tourne quand sa valeur change ; la tranche est une ombre qui glisse sur le c
- 16110 1 : récompense face cachée : une carte rare jaillit avec un éclat doré (game-anim.js : gol
- 16169 6 : défausse qui brûle : la carte se consume de bas en haut (masque qui monte), ligne de b
- 16229 5 : fusion spectaculaire (game-anim.js : fuseCardsFx)
- 16273 2 : carte avec une épaisseur : feuillets empilés (translateZ) et dos, sous la grande carte
- 16304 v267 (option B) : faction et rôle en un seul filigrane : plus de pastille en bas de la car
- 16327 v288 (choix d’Amine) : retour au cadre à fenêtre carrée (assets/art/ui/cadre-noir.webp, 63
- 16367 éditions spéciales : leur propre cadre carré de l’artiste
- 16422 v290 : les petites cartes (main) affichent aussi leur texte, plus gros pour rester lisible
- 16448 v289 : effets de la fenêtre (liseré, teinte, particules, reflet du métal) suivent la fenêt
- 16487 v289 : coût des pièges (hexagone) et des objets et réactions (losange) : même relief que l
- 16527 v295 : sur ordinateur, tout bouton cliquable grossit un peu au survol (demande d’Amine).
- 16538 ===== v301 : nouvel accueil d'Amine (game-accueil.js, maquette-accueil.html) =====
- 16577 téléphone : le bas de l'image se fond dans le noir sous le menu
- 16584 PC : voile sombre à gauche derrière le menu
- 16848 logo : respire avec une lueur rouge, tremble à chaque éclair
- 16869 boutons : les anciens boutons de l'accueil, mais ils ne grossissent plus (ni au survol ni 
- 16895 v302 : animations des menus (game-menufx.js) ; rien en Mode économie ni en « mouvement réd
- 16896 1 : copie du panneau qui s'efface à la fermeture
- 16915 2 : cascade, un bloc après l'autre (--mi posé par show)
- 16926 3 : boutons qui s'enfoncent, vague au toucher, lueur sous la souris
- 16960 4 : lignes de balayage d'un vieux poste radio à l'ouverture
- 16990 5 : reflet rouge qui glisse de l'ancien onglet au nouveau ; interrupteurs qui rebondissent
- 17013 6 : la pause floute et assombrit le plateau peu à peu
- 17029 7 : médaille du succès (reflet, éclats) et cadenas qui secoue
- 17074 8 : reflet sur les barres une fois remplies
- 17087 9 : trop cher, le prix secoue en rouge
