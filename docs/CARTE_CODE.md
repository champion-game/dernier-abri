# Carte du code (générée)

Fichier généré par `node tools/carte-code.js` (lancé aussi par `node tools/test.js`). **Ne pas modifier à la main.**
Guide écrit à la main : `docs/CODE.md`. Les numéros de ligne permettent `sed -n 'N,Mp' fichier | cut -c1-300`.

## Ordre de chargement (index.html)

1. `src/i18n.js` (57 lignes)
2. `src/lang-en.js` (2210 lignes)
3. `src/engine.js` (5759 lignes)
4. `src/audio.js` (811 lignes)
5. `src/art-liste.js` (3 lignes)
6. `src/game.js` (1665 lignes)
7. `src/game-draw.js` (5935 lignes)
8. `src/game-ui.js` (2029 lignes)
9. `src/game-screens.js` (1679 lignes)
10. `src/game-menu.js` (839 lignes)
11. `src/game-anim.js` (1178 lignes)
12. `src/game-fiche.js` (695 lignes)
13. `src/game-fx2.js` (364 lignes)
14. `src/game-artx.js` (1476 lignes)
15. `src/game-coll.js` (664 lignes)
16. `src/game-fx3.js` (556 lignes)
17. `src/game-fx5.js` (768 lignes)
18. `src/game-load.js` (195 lignes)

## Fonctions enveloppées

Un fichier chargé plus tard remplace la fonction par une version qui appelle l’ancienne (`const r0 = render; render = function () { r0.apply(this, arguments); … }`).
Pour modifier ou déboguer une de ces fonctions, **regarder toute la chaîne**, dans l’ordre (la dernière enveloppe s’exécute en premier).

| Fonction | Définie dans | Enveloppée ensuite par (ordre de chargement) |
|---|---|---|
| `render` | game-ui.js:601 | game-fx2.js:261, game-artx.js:82, game-artx.js:158, game-artx.js:377, game-artx.js:484, game-artx.js:935, game-artx.js:998 |
| `applyArt` | game.js:329 | game-artx.js:65, game-artx.js:368, game-artx.js:942, game-artx.js:1386, game-artx.js:1464 |
| `frameInner` | game-draw.js:5426 | game-artx.js:677, game-fx3.js:85, game-fx3.js:501, game-fx5.js:155 |
| `playEvents` | game-ui.js:4 | game-anim.js:913, game-fx2.js:329, game-fx3.js:94, game-fx5.js:106 |
| `buildGround` | game-draw.js:1303 | game-artx.js:26, game-artx.js:689 |
| `collectionScreen` | game-screens.js:930 | game-anim.js:397, game-coll.js:644 |
| `deckEditor` | game-screens.js:898 | game-anim.js:405, game-coll.js:654 |
| `feltLayout` | game-ui.js:1861 | game-artx.js:923, game-artx.js:1066 |
| `syncZ` | game-draw.js:2249 | game-fx2.js:201, game-artx.js:1108 |
| `unitAnim` | game-draw.js:2927 | game-fx3.js:348, game-fx5.js:476 |
| `countUp` | game-screens.js:639 | game-anim.js:1114 |
| `dawnStep` | game-screens.js:35 | game-anim.js:298 |
| `drawFloats` | game-draw.js:4890 | game-fx5.js:760 |
| `drawFog` | game-draw.js:5153 | game-artx.js:551 |
| `drawFX` | game-draw.js:4796 | game-fx5.js:650 |
| `drawPlace` | game-draw.js:5314 | game-fx3.js:336 |
| `drawShelter` | game-draw.js:4493 | game-fx5.js:520 |
| `drawSky` | game-draw.js:4962 | game-artx.js:670 |
| `giftScreen` | game-screens.js:309 | game-anim.js:724 |
| `hglowFit` | game-menu.js:801 | game-artx.js:326 |
| `keepEnd` | game-menu.js:560 | game-fiche.js:206 |
| `lights` | game-draw.js:5073 | game-fx3.js:399 |
| `mergeFx` | game-ui.js:1448 | game-anim.js:807 |
| `nightBanner` | game-menu.js:227 | game-fx2.js:286 |
| `optionsScreen` | game-screens.js:515 | game-artx.js:1448 |
| `pilesHtml` | game.js:1509 | game-artx.js:979 |
| `placeHints` | game-draw.js:5926 | game-fx2.js:246 |
| `resumeWave` | game-ui.js:1730 | game-anim.js:903 |
| `ringFog` | game-draw.js:2096 | game-artx.js:538 |
| `shelHit` | game-ui.js:582 | game-fx2.js:354 |
| `show` | game-screens.js:601 | game-anim.js:1155 |
| `showAch` | game.js:859 | game-anim.js:1105 |
| `tapCell` | game-ui.js:1582 | game-ui.js:2017 |
| `title` | game-menu.js:430 | game-artx.js:335 |
| `zoomCf` | game-menu.js:246 | game-anim.js:309 |

## Actions des boutons

Un bouton `data-a="nom"` appelle `ACT.nom` (objet `ACT` de `game-screens.js`, ligne 1126).

testmode:1127 · teststart:1134 · tcards:1152 · tadd:1168 · options:1174 · optclose:1175 · presume:1182 · pquit:1187 · prestart:1191 · prestart2:1195 · pmenu:1204 · closeov:1205 · bpick:1209 · artstyle:1217 · new:1224 · prepdeck:1235 · prepch:1240 · preppl:1244 · preprel:1255 · prepmen:1259 · start:1265 · edit:1280 · dkp:1281 · cfam:1289 · crole:1300 · cpg:1311 · cfmore:1315 · atel:1319 · dkdraw:1326 · dkm:1330 · dkreset:1339 · coll:1344 · mdet:1352 · achs:1353 · gift:1354 · gyes:1355 · gno:1356 · gdone:1357 · mback:1358 · evo:1362 · unlock:1363 · load:1377 · title:1382 · close:1383 · rules:1384 · stats:1388 · rgo:1389 · retuto:1393 · deck:1405 · dawn:1413 · lvl:1414 · relic:1426 · evc:1431 · todraft:1450 · draft:1451 · shop:1460 · day:1512 · nightpick:1513 · nightgo:1517 · daily:1521 · wish:1524 · dpick:1534 · peek:1539

Ajoutées ou remplacées ailleurs : unlock (game-anim.js:481) · dkp (game-anim.js:507) · dkm (game-anim.js:541) · prepdeck (game-anim.js:573) · start (game-anim.js:687) · gift (game-anim.js:758) · relic (game-anim.js:1012) · prepmen (game-anim.js:1088) · fshare (game-fiche.js:689) · credits (game-artx.js:1439)

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

### src/art-liste.js

> Généré par node tools/art-liste.js : images du style artiste présentes dans assets/art/ (n

(aucune fonction nommée)

### src/game.js

> Rendu canvas, interface et boucle de jeu. Dépend de src/engine.js (global Z).

- **1** (début) : loadSprites:227 sprK:244 drawSpr:250 hdArt:315 applyArt:329 cardStats:372 ajouterDefsCartouches:452 cartoucheSvg:456 seen:482 novice:489 cardLook:514 cardFace:562 saveOpt:672 applyOpt:680 applyCur:700 toggleFs:719 unpause:738 R:746
- **777** state
- **779** progression entre les parties (localStorage) : loadMeta:780 endTest:801 saveMeta:806 ach:847 showAch:859 deckCanAdd:892 edGain:906 edCommit:915 edDrop:945 achCheck:971 achNight:996 achScreen:1004 tuto:1023 guideStep:1054 guideOk:1194 tutoTip:1215 tutoHand:1227 tutoPicks:1250 tutoEnd:1255 newGame:1270 fillHand:1320 drawCards:1328 syncBoard:1355 cellRect:1393 fly:1398 animPiles:1451 pilesHtml:1509
- **1579** sauvegarde (localStorage, marche aussi dans Electron/Tauri) : save:1582 loadSave:1606 clearSave:1629 resume:1635

### src/game-draw.js

> Dernier Abri : dessin de la carte (canvas), effets visuels et boucle d’affichage.

- **3** canvas setup : fit:24 rng:43 leafTree:207 pineTree:260 rockDeco:301 logDeco:324 cactus:352 deadBush:380 carWreck:400 concreteBlock:427 barrel:444 rubble:469 deadTree:485 roofDeco:499 lampPost:576 puddle:597 manhole:607 mushroom:625 tumbleweed:642 skull:651 pumpkin:673 hayBale:698 snowdrift:721 snowman:735 boulderBig:765 buildCity:776 cityRing:793 proj:877 poly:881 tone:889 building3d:894 cactus3d:966 rock3d:1034 ringItem:1099 dirtRoad:1130 drawWoods:1222 setBiome:1295 buildGround:1303 boardEdge:1757 boardFrame:1941 ringFog:2096 drawEdgeNight:2121 clearDecals:2164 splat:2167
- **2179** live visual state : vib:2198 camZoom:2213 shake:2218 jit:2228 zpos:2232 syncZ:2249
- **2295** dessin : un seul style pour tout le jeu (contour sombre, ombre portée, ombrage, petits dét : ell:2297 circ:2304 line:2311 oEll:2321 oCirc:2325 oLine:2329 oRect:2333 rrect:2339 oRound:2343 shade:2352 person:2520 dogShape:2645 hpBar:2672 drawBars:2676 socle:2697 trackBoard:2758 cracks:2849 crater:2870 groundCrack:2895 wallJit:2919 unitAnim:2927 drawUnit:3000 drawUnitInner:3106 wallSect:3867 wallPost:4043 drawRamparts:4105 wireSect:4216 wirePost:4239 drawWires:4243 drawGuide:4313 guideHand:4343 drawKillZones:4412 drawBossRoute:4446 drawShelter:4493 zAnim:4596 drawZombie:4624
- **4773** effects : addFX:4774 burst:4778 drawFX:4796 floatTxt:4887 drawFloats:4890 mkGlow:4941 drawSky:4962 drawGlow:5043 lights:5073 drawFog:5153 drawAmbient:5167 drawDark:5244 frame:5298 drawPlace:5314 titleDeco:5373 frameInner:5426 safeTxt:5680 edAura:5690 dmgCached:5781 bTag:5787 dmgBadge:5805 dmgLinks:5826 placeGain:5891 placeHints:5926

### src/game-ui.js

> Dernier Abri : interface du jour et de la nuit (fiche, main, plateau, déroulé de la nuit).

- **3** combat events → visuals : playEvents:4
- **505** UI : ficheHtml:507 trackHtml:538 tagsHtml:555 shelHit:582 render:601 fireAmmo:851 updatePreview:875 curAt:1067 useBuild:1088 spentTrace:1096 countPlay:1104 placeLineUI:1115 dmgInfo:1165 dmgSnap:1179 bonusMsg:1187 unitLine:1229 hint:1387 showHint:1396 checkHints:1424 mergeFx:1448 playReact:1487 snapUndo:1525 doUndo:1540 squadFx:1570 tapCell:1582 peekScreen:1706 wavePause:1719 resumeWave:1730 night:1744 feltLayout:1861 ftPioche:1904 ftHorde:1928 ftJournal:1944 feltTabs:1972

### src/game-screens.js

> Dernier Abri : écrans (aube, options, collection, decks, préparation) et actions des bouto

- **3** l'aube : relique, carte pour demain, boutique : dawn:5 afterRelic:30 dawnStep:35 dawnTxt:85 shopScreen:102 storeScreen:121 listScreen:135 removeCard:140 nightScreen:151 nextDay:165 victory:179 leaveWin:239 wishBtn:263 demoEnd:268 giftStart:295 giftLeft:305 giftScreen:309 giftSync:326 giftTap:347 giftTake:371 giftDone:374 statsScreen:392 logRun:416 end:431 zombieFace:499 optionsScreen:515 runInfo:545 pfoot:584 show:601 countUp:639 hide:654
- **662** collection, decks et préparation de la partie : takeLegacy:664 ensureMeta:676 prepScreen:709 cfOpen:766 cfPool:777 cfList:787 cfTabs:803 cfBar:821 cfPips:840 cfBookHTML:848 cfBook:859 cfSync:892 deckEditor:898 collectionScreen:930 cfBarOld:992 cfGrid:1005 cfApply:1035 cfSyncOld:1040 deckEditorOld:1046 collectionScreenOld:1058 evoScreen:1114 nextUnlockTxt:1658

### src/game-menu.js

> Dernier Abri : défi quotidien, tableau des combats, menu pause, raccourcis, accueil et dém

- **3** défi du jour (v151) : une seule nuit contre la horde du jour, 8 cartes tirées « 1 parmi 3  : dailyEnd:9 dailyBest:13 dailyScreen:34 dailyDraft:44 dailyStart:54 dailyOver:63 pauseMenu:192 abortNight:202 nightBanner:227 zoomCf:246 zoomClose:261 title:430 meterHead:480 meterBody:485 meterSync:516 keepEnd:560 detScreen:563 detSync:570 muteIcon:589 iosHint:598 hglowFit:801

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
- **784** v171 : deuxième série (unités, nuit, économie, menus) : cvPt:786 bolt:791 lvFx:849 typeFx:879 bossBanner:893 renderFx:933 endPts:1145

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

- **1** (début) : axPalSet:15 axGround:40 axPlat:46 axBig:102 axGlow:249 axGlowHtml:304 axHome:353 axPad:397 axLay:406 axOn:531 axRing:556 axFxDraw:583 axPaint:704
- **838** v216 : nouvelle disposition du style artiste, d'après les maquettes d'Amine : ax3Want:845 ax3Build:848 ax3Put1:862 ax3Put:881 ax3Back:902 ax3Phase:914 ax3Zoom:1047 axFarDraw:1123 artNames:1372
- **1392** v245 : accueil du style artiste sur le modèle d'Amine : axPlayHtml:1397 axBigBtn:1402 axTitleHtml:1405

### src/game-coll.js

> ---------- collection du style artiste (v222) ----------

lcItem:43 lcDkItem:58 lcInfo:67 lcDetail:93 lcBase:101 lcList:108 lcCells:113 lcDeckSide:131 lcScreen:159 lcFill:218 lcPage:236 lcSearch:276 lcShow:282 lcOvPlace:336 lcOvOpen:349 lcOvClose:382 lcOri:416 lcGyro:429 lcNo:446 lcReset:613

### src/game-fx3.js

> v230 : quatrième série d'effets (validée par Amine). Affichage seulement, aucune règle ne 

fx3Reset:67 hitStop:76 fx3Events:102 fx3DawnK:239 fx3Corpses:245 fx3Idle:382 fx3Weather:425 fx3Layer:486 fx3Cam:536

### src/game-fx5.js

> v240 : le camp prend vie (demande d'Amine). Affichage seulement, aucune règle ne change.

fx5On:64 fx5Named:71 fx5Line:80 fx5Say:87 fx5Events:114 fx5Tick:163 fx5Edge:232 fx5Crows:241 fx5Shoo:270 fx5Crow:277 fx5Chores:364 fx5Smoke:488 fx5Marks:528 fx5Leaves:582 fx5Dusk:632 fx5Wrap:677 fx5Bubbles:691

### src/game-load.js

> v244 : chargement des images (v254 : étape, pourcentage et astuces sur l'écran de chargeme

preloadImg:11 inCache:24 preloadUi:35 preloadCards:41 bootUrls:52 bootStepLabel:63 bootBar:70 bootTips:99 bootEnd:118 preloadBoot:129 preloadBigOk:153 preloadIdle:159 preloadBackground:173

## src/style.css

15737 lignes. Les règles s’empilent par version : **à sélecteur égal, la dernière l’emporte**. Le style artiste est sous `html.artx` (1205 lignes). Chercher un sélecteur avec `grep -n` plutôt que par section.

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
- 12699 cartes distribuées : elles tombent de haut en tournant
- 12717 grande carte : se retourne, flotte, s’incline au survol
- 12876 ordinateur : trois colonnes comme le laboratoire, la grille défile seule
- 13006 v223 : grand écran : colonnes gauche et droite limitées à 440 px (sinon elles s'étirent et
- 13011 v224 : écart plateau / colonnes de 12 px, jusqu'à 50 px quand l'écran a de la place (choix
- 13015 ===== v225 : collection et deck sur le même écran, en pages (plus de défilement) =====
- 13103 bas de l’écran : pages au-dessus des boutons sur téléphone, sur une ligne sur ordinateur
- 13153 téléphone : grande carte par-dessus la grille
- 13234 deck sur téléphone : le tiroir reste dans la page, sous la grille
- 13249 effets des cartes
- 13383 ordinateur : trois colonnes, rien ne défile
- 13488 v225 : en jeu, une carte qu’on ne peut pas jouer est grisée (style artiste)
- 13501 v226 : pas de barre de défilement dans la collection et le deck ; formes du jeu (panneau n
- 13595 v227 : onde au clic sur les boutons (src/game-artx.js)
- 13627 v227 : bouton qui reste enfoncé (filtre, onglet, option choisie) : 2 px plus bas, creusé, 
- 13667 v228 : menus et panneau du deck dans le style du reste (panneaux noirs, texte crème, Oswal
- 13787 v229 : sous la liste du deck, les rôles (Tank, Soin, DPS) en tuiles et les maximums par ra
- 13895 v232 : carte plus haute dans le style artiste (choix d'Amine : ni bande ni zoom). Les illu
- 13982 v237 : téléphone tourné en style artiste : plateau encadré à gauche sur toute la hauteur, 
- 14098 v239 : téléphone (portrait et paysage) : plateau à palissade sans forêt (plateau-herbe.web
- 14130 v241 : interface plus lisible (demande d'Amine)
- 14131 1 : compteur d'énergie toujours visible le jour : gros chiffre, jetons, à gauche du texte
- 14201 3 : le nom du jeu, coupé sur ordinateur (« Barric… »), n'est plus affiché pendant la parti
- 14207 7 : plus d'énergie (ou plus rien à jouer) : le bouton de la nuit appelle clairement
- 14239 téléphone en portrait
- 14353 ===== v245 : accueil du style artiste sur le modèle d'Amine (game-artx.js, axTitleHtml) ==
- 14370 v246 : les menus ouverts depuis l'accueil gardent son décor, assombri derrière le panneau
- 14432 textes posés sur le décor, sans fiche beige
- 14493 grands boutons (Collection et decks, Défi du jour) : panneau noir, icône, filet, libellé
- 14528 « Jouer » : panneau noir rougi (version B)
- 14571 « Jouer » respire : il grossit un peu et son halo s'élargit
- 14598 barre du bas
- 14681 PC peu haut et téléphone tourné : tout se resserre
- 14719 téléphone en hauteur : logo dans le ciel, menu sous le plateau, barre de 4 icônes
- 14804 entrée : le logo tombe et rebondit, les boutons glissent depuis la gauche, la barre monte 
- 14861 lueurs du décor : étoiles, brume devant la forêt, lucioles
- 14943 v246 : flamme de la lanterne de l'accueil plus forte (halo large qui vacille, mélangé en l
- 14975 v248 : chiffres et étiquette de type des cartes en Oswald (lisibles en petit)
- 14980 v249 : dégâts dans une bulle ronde (laiton, épée en filigrane), soin en vert ; PV d'un tan
- 15050 v256 : téléphone tourné (large mais peu haut) : les 13 familles de la collection ne tienne
- 15072 v257 : accueil sur PC : logo et boutons centrés en hauteur dans la colonne de gauche
- 15078 v257 : collection sur téléphone tourné : 2 lignes de 5 cartes, grande carte plus haute ave
- 15117 ===== v261 : énergie en cartouches de fusil (dessinées en SVG, cartoucheSvg dans game.js),
- 15157 ===== v258 : points de la collection : écrou de ferraille sur le panneau noir =====
- 15184 v260 : le décor de l'accueil reste fixe (ne suit plus la souris) ; lueurs et animations ga
- 15189 v263 : nouveau cadre de carte d'Amine (assets/art/ui/cadre-barricard.webp, 728 × 1106, fen
- 15239 reflet qui balaie l'illustration de temps en temps (coupé en mode économie et si l'apparei
- 15304 dégâts et PV posés sur le bord bas du cadre : le parchemin reste au texte
- 15342 v263 : coût, dégâts et PV en relief : pièces bombées (reflet en haut, ombre en bas, bord m
- 15378 reflet bombé en haut de la pièce + éclat qui la traverse
- 15422 chiffres gravés : clair en haut, ombre en bas, contour sombre
- 15446 v263 : carte survolée (souris) ou touchée : elle grandit et monte au-dessus du bac pour se
- 15486 v263 : fenêtre de choix de cartes plus grande, pour bien voir les cartes
- 15495 v263 : onglets Pioche / Horde / Journal repliés : seule la rangée d'onglets reste
- 15502 v264 : identité visuelle des cartes (game.js : cardLook). Couleurs de rôle de l'artiste :
- 15531 liseré lumineux autour de l'illustration, teinte en bas de l'illustration, petite vie : da
- 15542 au-dessus du cadre (sinon caché par son ombre intérieure), en lumière douce qui éclaire le
- 15629 emblème de la bande (faction) imprimé en filigrane dans le parchemin
- 15654 pierre de coût : couleur du rôle et forme selon le type (rond survivant, carré défense et 
- 15674 Holographique : reflet arc-en-ciel qui glisse sur la carte, et paillettes
- 15712 Légendaire animée : braises qui montent et lueur dorée qui respire
