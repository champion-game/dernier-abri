# Carte du code (générée)

Fichier généré par `node tools/carte-code.js` (lancé aussi par `node tools/test.js`). **Ne pas modifier à la main.**
Guide écrit à la main : `docs/CODE.md`. Les numéros de ligne permettent `sed -n 'N,Mp' fichier | cut -c1-300`.

## Ordre de chargement (index.html)

1. `src/i18n.js` (19 lignes)
2. `src/lang-en.js` (1804 lignes)
3. `src/engine.js` (1185 lignes)
4. `src/audio.js` (181 lignes)
5. `src/game.js` (482 lignes)
6. `src/game-draw.js` (1086 lignes)
7. `src/game-ui.js` (408 lignes)
8. `src/game-screens.js` (457 lignes)
9. `src/game-menu.js` (174 lignes)
10. `src/game-anim.js` (212 lignes)
11. `src/game-fiche.js` (127 lignes)
12. `src/game-fx2.js` (91 lignes)
13. `src/game-artx.js` (404 lignes)
14. `src/game-coll.js` (181 lignes)
15. `src/game-fx3.js` (108 lignes)
16. `src/game-fx5.js` (164 lignes)

## Fonctions enveloppées

Un fichier chargé plus tard remplace la fonction par une version qui appelle l’ancienne (`const r0=render;render=function(){r0.apply(this,arguments);…}`).
Pour modifier ou déboguer une de ces fonctions, **regarder toute la chaîne**, dans l’ordre (la dernière enveloppe s’exécute en premier).

| Fonction | Définie dans | Enveloppée ensuite par (ordre de chargement) |
|---|---|---|
| `render` | game-ui.js:102 | game-fx2.js:68, game-artx.js:21, game-artx.js:33, game-artx.js:59, game-artx.js:84, game-artx.js:186, game-artx.js:197 |
| `applyArt` | game.js:160 | game-artx.js:17, game-artx.js:56, game-artx.js:187, game-artx.js:403 |
| `frameInner` | game-draw.js:989 | game-artx.js:123, game-fx3.js:16, game-fx3.js:97, game-fx5.js:54 |
| `playEvents` | game-ui.js:4 | game-anim.js:168, game-fx2.js:83, game-fx3.js:19, game-fx5.js:40 |
| `buildGround` | game-draw.js:194 | game-artx.js:13, game-artx.js:124 |
| `collectionScreen` | game-screens.js:285 | game-anim.js:94, game-coll.js:179 |
| `deckEditor` | game-screens.js:274 | game-anim.js:95, game-coll.js:180 |
| `feltLayout` | game-ui.js:377 | game-artx.js:185, game-artx.js:210 |
| `syncZ` | game-draw.js:338 | game-fx2.js:53, game-artx.js:226 |
| `unitAnim` | game-draw.js:530 | game-fx3.js:72, game-fx5.js:113 |
| `countUp` | game-screens.js:202 | game-anim.js:205 |
| `dawnStep` | game-screens.js:16 | game-anim.js:73 |
| `drawFloats` | game-draw.js:863 | game-fx5.js:163 |
| `drawFog` | game-draw.js:931 | game-artx.js:98 |
| `drawFX` | game-draw.js:844 | game-fx5.js:144 |
| `drawPlace` | game-draw.js:971 | game-fx3.js:69 |
| `drawShelter` | game-draw.js:767 | game-fx5.js:124 |
| `drawSky` | game-draw.js:877 | game-artx.js:122 |
| `giftScreen` | game-screens.js:98 | game-anim.js:138 |
| `hglowFit` | game-menu.js:164 | game-artx.js:49 |
| `keepEnd` | game-menu.js:140 | game-fiche.js:51 |
| `lights` | game-draw.js:909 | game-fx3.js:81 |
| `mergeFx` | game-ui.js:278 | game-anim.js:152 |
| `nightBanner` | game-menu.js:63 | game-fx2.js:73 |
| `pilesHtml` | game.js:457 | game-artx.js:193 |
| `placeHints` | game-draw.js:1084 | game-fx2.js:65 |
| `resumeWave` | game-ui.js:341 | game-anim.js:166 |
| `ringFog` | game-draw.js:305 | game-artx.js:97 |
| `shelHit` | game-ui.js:99 | game-fx2.js:90 |
| `show` | game-screens.js:195 | game-anim.js:210 |
| `showAch` | game.js:296 | game-anim.js:203 |
| `tapCell` | game-ui.js:304 | game-ui.js:407 |
| `title` | game-menu.js:104 | game-artx.js:52 |
| `zoomCf` | game-menu.js:70 | game-anim.js:76 |

## Actions des boutons

Un bouton `data-a="nom"` appelle `ACT.nom` (objet `ACT` de `game-screens.js`, ligne 348).

testmode:349 · teststart:353 · tcards:355 · tadd:359 · options:360 · optclose:361 · presume:362 · pquit:363 · prestart:364 · prestart2:365 · pmenu:366 · closeov:367 · bpick:368 · artstyle:369 · new:370 · prepdeck:371 · prepch:372 · preppl:373 · preprel:376 · prepmen:377 · start:378 · edit:379 · dkp:380 · cfam:381 · crole:382 · cpg:383 · cfmore:384 · atel:385 · dkdraw:386 · dkm:387 · dkreset:388 · coll:389 · mdet:390 · achs:391 · gift:392 · mback:393 · evo:394 · unlock:395 · char:396 · place:397 · load:398 · title:399 · close:400 · rules:401 · stats:402 · rgo:403 · retuto:404 · deck:405 · dawn:406 · lvl:407 · relic:408 · evc:409 · todraft:412 · draft:413 · shop:414 · day:425 · nightpick:426 · nightgo:427 · daily:428 · wish:429 · dpick:431 · peek:432

Ajoutées ou remplacées ailleurs : unlock (game-anim.js:105) · dkp (game-anim.js:110) · dkm (game-anim.js:114) · prepdeck (game-anim.js:119) · start (game-anim.js:132) · gift (game-anim.js:141) · relic (game-anim.js:189) · prepmen (game-anim.js:200) · fshare (game-fiche.js:126)

## Fichier par fichier

Sections (commentaires `/* ---------- … */`, `// ---`, `// ===`) puis fonctions définies, avec leur ligne.

### src/i18n.js

> Traduction (v146). Le français est la langue source : chaque texte affiché passe par _t,

_t:10 _tPage:16

### src/lang-en.js

> Dictionnaire anglais (v146) : clé = texte français exact, valeur = traduction. {0}, {1}… =

(aucune fonction nommée)

### src/engine.js

> Moteur du jeu : règles pures, sans DOM. Utilisé par le jeu (navigateur) et par les outils 

- **63** extension : nouvelles cartes de faction
- **119** v89 : 6 nouveaux survivants
- **126** v120 : cartes de victoire (vic = niveau de Mutation à vaincre pour la débloquer ; jamais e
- **137** v76 : logistique (équipements, postes de soutien, nouvelles défenses, pièges, objets et ré : roleOf:211 baseOf:253 edOf:254 ck:256 levelUp:269 waveCount:326 famCounts:381 famLevel:382 famLevels:383 allies:389 wallGroup:392 sol:396 nightOffers:408 hurt:416 recruit:417 dawnEvent:501 resolveDawn:504 testProgress:525 mutate:527 zhit:537 moves:586
- **591** chemins des zombies : blockCosts:597 field:603 sapBlast:612 pathStep:614 killZones:620 back:626 shuffle:627
- **629** état d'une partie : newState:634 unlocks:656
- **659** collection et deck (entre les parties) : giftOffer:667 edKill:676 killScrap:678 applyMenace:697 deckError:702 newDay:708
- **717** améliorations et reliques : statistiques réelles d'une carte : upgDesc:719 stat:726 upgrade:741 addRelic:742 relicChoices:743 draftChoices:744 dailyPlan:752 dailyState:762 storeOffer:770 buyStore:772 pay:773 fireAmmo:778
- **783** pose des cartes : frees:790 canMove:795 move:796 wallLinks:799 fixLinks:800 recall:804 placeBench:806 useCharges:817 lineCells:823 placeLine:827 canPlace:829 place:839
- **855** fusion et évolutions : absorb:864 merge:867 mkey:885 mtr:886 cure:889 lose:892 applyItem:902
- **917** la nuit : waveList:924 broodDeath:936 zMaxHp:938 newcomers:940 spawn:941 bigNight:945 nextWave:946 startNight:947 hit:961 explode:965 lureTarget:967 squad:969 dmgParts:973 attack:1002 strike:1033 enter:1053 step:1069 endNight:1137 canReact:1156 react:1160 runNight:1180

### src/audio.js

> Sons du jeu : générés en code avec Web Audio, plus des grognements de zombies enregistrés 

(aucune fonction nommée)

### src/game.js

> Rendu canvas, interface et boucle de jeu. Dépend de src/engine.js (global Z).

- **1** (début) : sprK:129 drawSpr:130 applyArt:160 cardStats:172 seen:202 novice:203 cardFace:205 saveOpt:239 applyOpt:242 applyCur:245 toggleFs:249 unpause:256
- **270** state
- **272** progression entre les parties (localStorage) : loadMeta:273 endTest:277 saveMeta:278 ach:295 showAch:296 deckCanAdd:306 edGain:310 edCommit:312 edDrop:318 achCheck:324 achNight:334 achScreen:337 tuto:346 guideStep:361 guideOk:392 tutoTip:395 tutoHand:397 tutoPicks:402 tutoEnd:403 newGame:405 fillHand:415 drawCards:416 syncBoard:429 cellRect:437 fly:438 animPiles:447 pilesHtml:457
- **469** sauvegarde (localStorage, marche aussi dans Electron/Tauri) : save:471 loadSave:472 clearSave:474 resume:475

### src/game-draw.js

> Dernier Abri : dessin de la carte (canvas), effets visuels et boucle d’affichage.

- **3** canvas setup : fit:10 rng:12 leafTree:36 pineTree:46 rockDeco:51 logDeco:54 cactus:59 deadBush:62 carWreck:63 concreteBlock:67 barrel:69 rubble:71 deadTree:72 roofDeco:75 lampPost:83 puddle:85 manhole:86 mushroom:87 tumbleweed:88 skull:89 pumpkin:91 hayBale:93 snowdrift:95 snowman:96 boulderBig:98 buildCity:100 cityRing:103 proj:122 poly:123 tone:125 building3d:126 cactus3d:140 rock3d:149 ringItem:160 dirtRoad:166 drawWoods:177 setBiome:193 buildGround:194 boardEdge:257 boardFrame:283 ringFog:305 drawEdgeNight:308 clearDecals:318 splat:319
- **321** live visual state : camZoom:329 shake:330 jit:334 zpos:335 syncZ:338
- **346** dessin : un seul style pour tout le jeu (contour sombre, ombre portée, ombrage, petits dét : ell:348 circ:349 line:350 oEll:352 oCirc:353 oLine:354 oRect:355 rrect:356 oRound:357 shade:359 person:446 dogShape:476 hpBar:485 drawBars:486 socle:490 trackBoard:502 cracks:522 crater:525 groundCrack:527 wallJit:529 unitAnim:530 drawUnit:543 drawUnitInner:569 wallSect:638 wallPost:666 drawRamparts:674 wireSect:707 wirePost:710 drawWires:711 drawGuide:723 guideHand:731 drawKillZones:752 drawBossRoute:757 drawShelter:767 zAnim:790 drawZombie:797
- **841** effects : addFX:842 burst:843 drawFX:844 floatTxt:862 drawFloats:863 mkGlow:873 drawSky:877 drawGlow:902 lights:909 drawFog:931 drawAmbient:934 drawDark:951 frame:965 drawPlace:971 titleDeco:980 frameInner:989 safeTxt:1044 edAura:1047 dmgCached:1060 bTag:1062 dmgBadge:1065 dmgLinks:1070 placeGain:1080 placeHints:1084

### src/game-ui.js

> Dernier Abri : interface du jour et de la nuit (fiche, main, plateau, déroulé de la nuit).

- **3** combat events → visuals : playEvents:4
- **76** UI : ficheHtml:78 trackHtml:83 tagsHtml:88 shelHit:99 render:102 FIRE:153 fireAmmo:154 updatePreview:161 curAt:194 useBuild:200 spentTrace:202 countPlay:204 placeLineUI:205 dmgInfo:213 dmgSnap:218 bonusMsg:220 unitLine:231 hint:267 showHint:268 checkHints:271 mergeFx:278 playReact:285 snapUndo:294 doUndo:296 squadFx:302 tapCell:304 peekScreen:331 wavePause:339 resumeWave:341 night:342 feltLayout:377 ftPioche:384 ftHorde:388 ftJournal:392 feltTabs:401

### src/game-screens.js

> Dernier Abri : écrans (aube, options, collection, decks, préparation) et actions des bouto

- **3** l'aube : relique, carte pour demain, boutique : dawn:5 afterRelic:15 dawnStep:16 dawnTxt:36 shopScreen:39 storeScreen:51 listScreen:57 removeCard:58 nightScreen:60 nextDay:64 victory:69 leaveWin:82 wishBtn:85 demoEnd:86 giftStart:94 giftLeft:97 giftScreen:98 giftSync:103 giftTap:108 giftTake:111 giftDone:112 statsScreen:114 logRun:121 end:122 zombieFace:136 optionsScreen:144 runInfo:162 charScreen:174 placeScreen:182 pfoot:191 show:195 countUp:202 hide:204
- **205** collection, decks et préparation de la partie : takeLegacy:207 ensureMeta:209 prepScreen:217 cfOpen:238 cfPool:241 cfList:242 cfTabs:246 cfBar:252 cfPips:259 cfBookHTML:260 cfBook:265 cfSync:272 deckEditor:274 collectionScreen:285 cfBarOld:304 cfGrid:309 cfApply:318 cfSyncOld:320 deckEditorOld:321 collectionScreenOld:325 evoScreen:343 nextUnlockTxt:452

### src/game-menu.js

> Dernier Abri : défi quotidien, tableau des combats, menu pause, raccourcis, accueil et dém

- **3** défi du jour (v151) : une seule nuit contre la horde du jour, 8 cartes tirées « 1 parmi 3  : dailyEnd:6 dailyBest:8 dailyScreen:14 dailyDraft:20 dailyStart:26 dailyOver:28 pauseMenu:53 abortNight:58 nightBanner:63 zoomCf:70 zoomClose:72 title:104 meterHead:121 meterBody:123 meterSync:131 keepEnd:140 detScreen:141 detSync:142 muteIcon:145 iosHint:147 hglowFit:164

### src/game-anim.js

> v170 : animations de cartes inspirées de Hearthstone (main, plateau, menus).

- **1** (début) : aEl:5 aAnim:6 aDone:7
- **11** main : éventail, cartes jouables, refus : handFx:14 shakeCard:25 refuseBubble:27 refuseFx:30
- **41** glisser : la carte se penche dans le sens du mouvement
- **46** pose : la carte vole jusqu'à la case et s'écrase : placeFx:47 landFx:51
- **54** fin du jour : les cartes réutilisables non jouées brûlent : burnFx:55
- **61** nuit : une défense détruite vole en éclats : shardsFx:62
- **66** aube : les 3 cartes au choix arrivent face cachée et se retournent : dealPicks:67
- **75** grande carte : elle grandit depuis sa place, penche sous le doigt, reflet qui suit : zoomTilt:79
- **87** collection : cascade, déblocage : cascade:89 coinsFx:98 unlockFx:101
- **107** decks : ajout, retrait, deck complet : popEl:109 deckDone:116
- **118** préparation : le deck choisi avance, les autres reculent
- **123** lancement : le deck est battu puis plonge dans la pioche : launchFx:124
- **134** récompense : paquet qui tremble puis explose, retournement selon la rareté : packFx:135 revealFx:139
- **147** v171 : deuxième série (unités, nuit, économie, menus) : cvPt:149 bolt:151 lvFx:158 typeFx:163 bossBanner:165 renderFx:173 endPts:209

### src/game-fiche.js

> v173 : fiche de fin de partie (« rapport de survie ») en haut des écrans de fin, et son im

- **1** (début) : ficheData:6 ficheEdge:21 rapportHtml:29 ficheInsert:45
- **54** image à partager (1080 × 1350) : fRound:56 fCover:57 fFit:58 ficheCanvas:59 ficheShare:119

### src/game-fx2.js

> ======== v191 : interface et animations, troisième série ========

- **11** 1 : avant → après : simG:13 uStats:14 upgLines:17 upgPrev:22 drawUpg:37
- **40** 3 : trous de la défense : drawHoles:42 holesSync:47
- **50** 9 : aube : drawDawn:57
- **67** 5 : bouton de la nuit
- **72** 6 : nuit rouge
- **81** 7 : gros zombie abattu
- **89** 8 : maison touchée

### src/game-artx.js

> v200 : refonte du jeu dans le style artiste (html.artx seulement) : plateau dessiné d'Amin

- **1** (début) : axPalSet:10 axGround:15 axPlat:16 axBig:26 axGlow:38 axHome:54 axPad:66 axLay:67 axOn:96 axRing:99 axFxDraw:103 axPaint:126
- **155** v216 : nouvelle disposition du style artiste, d'après les maquettes d'Amine : ax3Want:162 ax3Build:163 ax3Put1:169 ax3Put:172 ax3Back:181 ax3Phase:184 ax3Zoom:207 axFarDraw:228 artNames:401

### src/game-coll.js

> ---------- collection du style artiste (v222) ----------

lcItem:19 lcDkItem:23 lcInfo:28 lcDetail:37 lcBase:42 lcList:45 lcCells:46 lcDeckSide:54 lcScreen:64 lcFill:91 lcPage:93 lcSearch:99 lcShow:102 lcOvPlace:117 lcOvOpen:119 lcOvClose:124 lcOri:131 lcGyro:134 lcNo:137 lcReset:172

### src/game-fx3.js

> v230 : quatrième série d'effets (validée par Amine). Affichage seulement, aucune règle ne 

fx3Reset:12 hitStop:15 fx3Events:20 fx3DawnK:53 fx3Corpses:54 fx3Idle:76 fx3Weather:85 fx3Layer:96 fx3Cam:105

### src/game-fx5.js

> v240 : le camp prend vie (demande d'Amine). Affichage seulement, aucune règle ne change.

fx5On:28 fx5Named:29 fx5Line:31 fx5Say:33 fx5Events:41 fx5Tick:55 fx5Edge:72 fx5Crows:73 fx5Shoo:78 fx5Crow:79 fx5Chores:95 fx5Smoke:116 fx5Marks:125 fx5Leaves:132 fx5Dusk:140 fx5Wrap:149 fx5Bubbles:150

## src/style.css

2598 lignes. Les règles s’empilent par version : **à sélecteur égal, la dernière l’emporte**. Le style artiste est sous `html.artx` (899 lignes). Chercher un sélecteur avec `grep -n` plutôt que par section.

- 1 polices intégrées au jeu (licence SIL OFL), pour jouer sans internet
- 11 Layout: one-screen phone app — header, night forecast, live top-down map (canvas), hand of
- 159 fusion (doré) et évolution (violet) dans la fiche d'unité
- 163 alliance active et annonce des très grosses nuits
- 167 munitions anti-Colosse : stock, bouton de tir, compte à rebours
- 175 écran d'ordinateur (version Steam) : colonne et carte plus larges
- 178 carte de construction déjà utilisée aujourd'hui (réutilisable), et carte en cours de gliss
- 184 rôle de l'unité (Tank, Soin, DPS) en bas à gauche de la carte
- 187 illustration de carte (image sans texte) : remplit le haut de la carte, le texte du jeu re
- 193 ---------- face de carte : le gabarit cartoon d'Amine (assets/ui/cadre.webp, fenêtre et ex
- 202 effet qui sort du cadre : l'illustration et le personnage détouré occupent une même « scèn
- 232 version de la main : pas de texte d'effet, le nom et les stats en plus grand
- 242 main : la carte remplace le bouton
- 250 choix de l'aube : de grandes cartes
- 254 collection et deck : une grille de cartes
- 261 aperçu en grand de la carte survolée ou choisie (ordinateur)
- 265 faction / rôle à l'encre en bas de la carte
- 272 recherche et tri des cartes
- 279 v73 : limite d'unités, réserve, rappel
- 284 v78 : table de jeu (pioche, main, défausse, réserve)
- 309 v79 : disposition — en hauteur, l'interface entoure la carte ; en largeur (PC, tablette, t
- 324 téléphone tourné : peu de hauteur, on resserre
- 351 v87 : conseils au bon moment
- 356 v92 : options
- 366 v93 : aspect jeu de société — table en bois, plateau encadré, cubes d'énergie, bande de pa
- 384 en largeur, le plateau est posé sur la table : on retire la forêt prolongée
- 386 v95 : fiche de nuit, piste des nuits, jetons
- 417 v98 : icônes de faction à l'encre (mêmes pictogrammes que sur les cartes)
- 426 v98 : la fiche de nuit devient une tuile de plateau (carton épais, cadre imprimé, rivets, 
- 451 v100 : dos des cartes d'Amine (assets/ui/dos.webp) pour la pioche et les cartes qui volent
- 456 v101 : logo sur l'accueil, règles du jeu dans leur propre écran
- 461 v101 : les écrans (accueil, aube, troc, collection…) deviennent des fiches de papier posée
- 477 v102 : tapis de feutre vert sous la fiche de nuit, la piste et les jetons, comme sous la m
- 483 v103 : pas de tapis autour ; c'est la fiche de nuit elle-même qui devient un tapis de feut
- 493 v104 : nom de la nuit écrit directement sur le feutre, sans étiquette
- 496 v105 : plus d'intitulé « La horde », les jetons parlent d'eux-mêmes
- 499 v106 : une phrase courte et poétique par type de nuit ; l'effet est dans le détail (touche
- 502 v107 : la phrase remplace le nom de la nuit sur la fiche
- 505 v110 : page des évolutions secrètes
- 513 v111 : carte d'une unité fusionnée : bandeau d'étoiles dorées et cadre qui brille
- 521 v111 : piste des nuits sur toute la largeur ; mutation et ferraille au bout de la rangée d
- 534 v112 : première nuit guidée : la carte et le bouton à toucher pulsent en doré
- 542 v115 : mode économie (petits téléphones) : pas de flous ni d'ombres portées calculées, pas
- 547 v116 : niveaux de Menace et victoire
- 553 v119 : dos de carte doré (récompense de la première victoire)
- 557 v120 : icônes des reliques, hélicoptère et carte de victoire
- 567 v122 : icônes à l'encre à la place des émojis
- 579 v123 : règles en fiches illustrées
- 589 statistiques
- 598 animations de fin de partie
- 613 v126 : collection, trois états bien lisibles (débloquée, à portée, hors de portée)
- 639 v126 : tableau des combats (feutre vert comme la fiche de nuit)
- 667 en portrait : il s'ouvre en haut, par-dessus la fiche de nuit et la piste (la carte et la 
- 669 sur ordinateur et téléphone tourné : rangé dans la colonne de droite, dans l'espace libre
- 676 téléphone tourné : pas de place dans la colonne, il flotte au-dessus de la carte
- 680 v126 : le tableau des combats dans l'écran de fin de partie
- 683 v128 : succès (bandeau et page)
- 700 révélation progressive (v129)
- 703 mode test
- 707 v139 : grande carte et raccourcis clavier
- 714 pas de menu « enregistrer l'image » de l'iPhone sur les cartes (appui long = grande carte)
- 716 menus : la carte grossit un peu au survol de la souris
- 720 v139 : transitions d'écran
- 726 main : la carte se soulève au survol de la souris
- 728 bandeau « Nuit N »
- 737 ===== v141 : panneaux en bois (option A), boutons en relief, halos de la collection =====
- 764 petites fiches de papier posées sur le bois : texte sombre
- 771 boutons en relief : bombés, s'enfoncent au clic ; choisi = enfoncé et doré ; bloqué = plat
- 790 collection : halo de rareté = carte acquise (règle v186 en fin de fichier), halo noir = pa
- 795 boutons secondaires côte à côte, pour que les menus tiennent sans défiler
- 815 ===== v142 : vraie texture de bois (raccordable, sans démarcation), clous ronds =====
- 821 boutons toujours visibles en bas des écrans qui défilent : une étagère en bois
- 828 titres des fiches de papier (règles) en encre sombre
- 831 champs de texte et menus déroulants : papier enfoncé dans le bois, flèche dessinée
- 841 barre de recherche et filtres : planche sombre, comme le reste
- 846 range (volume) aux couleurs du jeu
- 848 succès : tuiles comme les statistiques, fiches de papier
- 862 ===== v143 =====
- 863 symboles de mutation et textes d'alerte : rouge vif sur le bois
- 865 troc : article impossible = fiche de papier grisée, encore lisible
- 869 filtres collés en haut : fond opaque, les cartes passent dessous sans se voir
- 873 v147 : image d'ambiance derrière les menus hors partie (accueil et ses écrans), nouveau lo
- 876 v168 : en hauteur, sans phrase d'accroche ; le logo monte dans le ciel et le menu commence
- 884 v150 : récompense de fin de partie. Cartes face cachée (sans halo), on touche pour retourn
- 916 défi du jour (v151) : la horde du jour, le tirage et le score
- 925 démo (v153) : étiquette sous le logo
- 928 v154 : tout ce qui est verrouillé reste lisible, simplement grisé (demande d'Amine)
- 932 ===== v155 : boutons en planche clouée, texte au pochoir (style E choisi par Amine) =====
- 949 grisé 1
- 954 grisé 2
- 958 icônes du haut
- 964 v155 : icône des bulles d’aide à taille de texte (elle couvrait l’écran)
- 966 v161 : abri touché (barre qui tremble, bord de l’écran qui rougit)
- 973 curseurs PC (option « Curseur de la souris »)
- 980 ---------- v170 : animations de cartes (game-anim.js) ----------
- 981 main en éventail : rotate et translate restent séparés de transform (sélection, survol)
- 986 carte jouable : liseré vert qui pulse (en phase d'un dessin à l'autre grâce à --ph)
- 990 refus : bulle au-dessus de la carte
- 993 pioche : la carte se retourne en vol
- 998 reflet qui passe sur les cartes rares, épiques et légendaires (main, grande carte, choix, 
- 1002 grande carte : penche sous le doigt, reflet qui suit
- 1006 fin du jour : la carte brûle depuis les bords
- 1013 aube : cartes au choix face cachée, éclat de la couleur de la rareté
- 1017 collection : pièces, cadenas, éclat et tampon « Obtenue »
- 1030 deck complet : liseré doré
- 1033 lancement : le deck est battu au centre de l'écran
- 1036 récompense : paquet qui tremble puis explose
- 1046 carte face cachée : sa lueur annonce la rareté (blanc, bleu, violet, doré)
- 1054 boutons : ils s'enfoncent puis rebondissent
- 1058 changement d'écran : glissement un peu plus marqué
- 1061 Mode économie et appareils qui demandent moins de mouvement : pas d'effet en boucle
- 1066 ---------- v171 : deuxième série d'animations ----------
- 1067 boss : bandeau qui traverse l'écran
- 1072 abri presque détruit : barre qui bat, bords rouges qui pulsent
- 1078 ferraille : pièces de métal
- 1080 relique : tourne au centre puis file se ranger
- 1086 mutation : le chiffre se fissure, lueur verte
- 1093 succès : la médaille tombe et rebondit
- 1100 ---------- v173 : fiche de fin de partie (game-fiche.js) : rapport de survie sur papier us
- 1152 v174 : accueil animé (brume qui dérive au pied de la palissade, braises qui montent, logo 
- 1174 v175 : lueurs posées sur l'image d'accueil (#hglow suit le cadrage « cover » de l'image, v
- 1186 v179 : grand écran PC : tapis vert collé à gauche (fiche de nuit, piste, jetons, pioche, d
- 1234 v181 : éditions spéciales (cartes de collection) : liseré coloré sur le cadre (.cf-ed), ef
- 1246 Dorée
- 1252 Blindée
- 1258 Fantôme
- 1264 Holographique
- 1269 Ensanglantée
- 1279 v184 : carte choisie à la récompense : un tampon à l'encre sur l'illustration (remplace la
- 1287 v185 : plus de rareté écrite sous les cartes offertes : le halo suffit ; une carte spécial
- 1290 v186 : un seul code de halo partout : la couleur de la rareté (commune verte, rare bleue, 
- 1299 v189 : fiche d'unité en pastilles (PV, dégâts, portée, victimes) et détail des bonus de dé
- 1319 tutoriel : main qui montre le geste
- 1322 v191 : bouton des trous, bouton de la nuit vivant, nuit rouge, maison touchée
- 1338 ===== v196 : refonte de l'interface du style artiste (maquette d'Amine) — seulement sous h
- 1350 panneaux : encre sombre usée, liseré clair très fin
- 1356 titre : bandeau sombre, capitales condensées, trait rouge à gauche
- 1366 fiches de papier : parchemin crème, bord noir
- 1370 boutons : parchemin, texte noir en capitales ; principal : rouge sang ; plus de bois ni de
- 1383 icônes du haut : carrés sombres
- 1387 onglets, choix, quantités : cases sombres ; le choisi en rouge
- 1396 champs, menus déroulants, barre de filtres, étagère du bas
- 1403 curseurs et cases : rouge ; les cases des Options deviennent des interrupteurs
- 1411 succès et barres de progression
- 1416 écran de jeu : fiche de nuit, main, tableau et tapis PC en encre sombre (plus de feutre ve
- 1422 jour en cours : étiquette de parchemin, comme sur la maquette
- 1428 v197 : écran de jeu d'après la 2e maquette d'Amine
- 1429 téléphone en hauteur : grande étiquette « JOUR n » posée à gauche de la fiche de nuit
- 1440 piste des nuits : cases sombres, nuit rouge en rouge sang, nuit en cours en parchemin
- 1448 pastilles (survivants, menaces, ferraille) : parchemin à bord noir
- 1453 énergie : cases jaunes dans une barre sombre ; Annuler : bouton sombre à bord vert
- 1458 zombies de la horde : jetons ronds à liseré, chiffre sur pastille claire
- 1460 v197 : boutons en métal usé (demande d'Amine) : acier brossé, rayures, rouille et rivets ;
- 1475 onglets et icônes : métal sombre bruni, le choisi en tôle rouge
- 1480 v198 : métal uniforme (plus de taches de rouille sur les bords, rayures discrètes) ; cadre
- 1495 ===== v199 : relief (demande d'Amine) : métal éclairé et bosselé, biseaux, texte gravé ; p
- 1502 panneaux et cadres : tôle épaisse bosselée, éclairée d'en haut, biseau clair en haut et so
- 1509 boutons secondaires : plaque d'acier brossé épaisse, texte gravé
- 1515 bouton principal : tôle peinte en rouge, bosselée
- 1521 onglets : touches de métal, la choisie enfoncée et rouge
- 1528 champs creusés dans le métal
- 1533 « Affronter la nuit » : le panneau de la maquette (tôle rouge cabossée, cadre de métal noi
- 1543 ===== v200 : refonte du jeu (maquettes validées par Amine), style artiste seulement (html.
- 1544 v201 : retour au cadre cartoon (choix d'Amine) avec les illustrations de l'artiste ; son c
- 1545 ---- PC (html.felton) : bandeau en haut, colonne d'infos à gauche, plateau au centre, fich
- 1565 bandeau : étiquette du jour à gauche, icônes et abri à droite
- 1573 cadres en métal fin et foncé : colonnes, plateau, main
- 1578 pioche à droite de la main, défausse à gauche
- 1593 ---- téléphone en hauteur : bandeau en fond du haut, bouton carré « Affronter la nuit » à 
- 1609 bouton de vitesse (nuit) : plaque d'acier lisible
- 1613 ===== v201 : PC — plateau sur toute la hauteur, colonnes gauche et droite de même hauteur 
- 1637 ===== v202 : fonds d'Amine à l'accueil et derrière le jeu, lueurs de l'accueil sur ce déco
- 1651 v203 : PC — panneau de droite : jour et icônes, fiche d'unité, grande carte (survolée ou c
- 1663 v204 : PC — le plateau garde sa taille maximale ; sur grand écran, les panneaux prennent t
- 1672 ===== v205 : PC — panneau gauche en 3 blocs (nuit, onglets Pioche/Horde/Journal, défausse 
- 1708 ===== v206 : nuit (PC) — hors du canvas, l'image du plateau s'assombrit exactement comme l
- 1711 v208 : nuit (PC) — canvas des brumes de la v195 prolongées sur la palissade (#axFx), fondu
- 1717 v211 : PC — cadre en acier serré autour du plateau ; le canvas du jeu déborde jusqu'au cad
- 1725 ===== v213 : collection et decks en classeur (style artiste seulement) (inspiré de Hearths
- 1732 intercalaires : de vrais onglets de classeur, collés à la page ; l’onglet choisi se fond d
- 1745 recherche + bouton Filtres sur une ligne ; les menus s’ouvrent dessous
- 1754 puces de rôle et de type
- 1760 le classeur : une page de papier réglé à anneaux
- 1769 page qui tourne comme un livre, autour de la reliure à gauche
- 1786 repères : « Nouveau », carte spéciale cachée derrière (coin doré)
- 1789 Atelier : les cartes acquises s’éteignent, celles qu’on peut payer brillent
- 1796 éditeur de deck : toucher une carte l’ajoute ; le deck est un tiroir en bas (téléphone) ou
- 1845 ===== v213 : le classeur dans le style artiste (acier, papier crème, rouge, capitales Oswa
- 1872 le pied de la collection et le tiroir du deck : même plaque d’acier rivetée, liseré rouge
- 1888 v214 (style artiste) : feuille avec de la profondeur (pile de pages, reliure, coin corné) 
- 1908 v214 : lignes du deck de la même couleur crème que le papier des cartes (cadre.webp)
- 1913 ===== v215 : pack « maquette » d'Amine (style artiste seulement) : images en découpe 9 cas
- 1920 boutons secondaires : tuile charbon, texte crème
- 1926 bouton principal : tôle rouge sang tachée, texte crème cerné de noir
- 1933 « Affronter la nuit » : droit, mains de zombies par-dessus la tôle, sous le texte
- 1938 onglets : tuile charbon, le choisi en rouge
- 1941 boutons icônes (son, musique, plein écran)
- 1945 étiquette du jour : parchemin brûlé
- 1948 fiches et pastilles en papier : parchemin aux bords brûlés
- 1952 énergie : cases jaunes à bord sombre
- 1955 ===== v216 : nouvelle disposition du style artiste (maquettes d'Amine) : #ax3 (game-artx.j
- 1965 formes communes : panneau noir
- 1968 ciel du jour : jour (ou nuit) en haut à gauche, phrase dessous, tampon à côté
- 1987 piste des nuits
- 1998 camp : icônes et chiffres, sans pastilles
- 2008 Deck (dos noir biohazard), Réserve et Défausse : trois formes séparées
- 2028 onglets Pioche / Horde / Journal : liste en lignes sombres, liseré de couleur, illustratio
- 2039 colonne de droite : logo et icônes centrés sur l'abri, abri, grande carte, énergie, bouton
- 2071 ---- ordinateur ----
- 2078 ---- téléphone en hauteur ----
- 2107 v230 : plateau d'Amine avec la forêt (plateau-foret.webp) : l'image entière est sous le ca
- 2119 v217 : bac de cartes en 3 couches : le fond (découpe 9 cases : les poteaux et la planche d
- 2134 v217 : abri en panneau noir, texte crème
- 2138 v217 : onglets en formes pleines (panneau noir) ; l'onglet ouvert a un trait rouge en haut
- 2143 v217 : Deck, Réserve et Défausse toujours pleins ; vides ou pendant la nuit, seuls le chif
- 2146 v217 : ordinateur : plateau et bac (même largeur, comme l'image d'Amine) au centre, colonn
- 2152 v217 : téléphone : bac de la largeur du plateau, aussi haut que la place le permet
- 2159 v219 : nouveaux cadres de carte de l'artiste (assets/art/ui/cadre-*.webp, fenêtre transpar
- 2184 ===== v219 : les formes de la maquette d'Amine partout dans le style artiste (menus, écran
- 2209 v219 : accueil sans panneau (les boutons et les fiches se posent directement sur le fond)
- 2211 v219 : pied des écrans à défilement (Options, Préparer la partie…) : plus de plaque de mét
- 2216 ===== v222 : collection du style artiste reprise du laboratoire (interfaces/collection) : 
- 2250 une carte de la grille : inclinaison 3D, reflet, lueur dorée quand elle est choisie
- 2271 cartes distribuées : elles tombent de haut en tournant
- 2274 grande carte : se retourne, flotte, s’incline au survol
- 2304 ordinateur : trois colonnes comme le laboratoire, la grille défile seule
- 2330 v223 : grand écran : colonnes gauche et droite limitées à 440 px (sinon elles s'étirent et
- 2332 v224 : écart plateau / colonnes de 12 px, jusqu'à 50 px quand l'écran a de la place (choix
- 2334 ===== v225 : collection et deck sur le même écran, en pages (plus de défilement) =====
- 2354 bas de l’écran : pages au-dessus des boutons sur téléphone, sur une ligne sur ordinateur
- 2361 téléphone : grande carte par-dessus la grille
- 2378 deck sur téléphone : le tiroir reste dans la page, sous la grille
- 2382 effets des cartes
- 2403 ordinateur : trois colonnes, rien ne défile
- 2426 v225 : en jeu, une carte qu’on ne peut pas jouer est grisée (style artiste)
- 2429 v226 : pas de barre de défilement dans la collection et le deck ; formes du jeu (panneau n
- 2449 v227 : onde au clic sur les boutons (src/game-artx.js)
- 2454 v227 : bouton qui reste enfoncé (filtre, onglet, option choisie) : 2 px plus bas, creusé, 
- 2461 v228 : menus et panneau du deck dans le style du reste (panneaux noirs, texte crème, Oswal
- 2481 v229 : sous la liste du deck, les rôles (Tank, Soin, DPS) en tuiles et les maximums par ra
- 2497 v232 : carte plus haute dans le style artiste (choix d'Amine : ni bande ni zoom). Les illu
- 2523 v237 : téléphone tourné en style artiste : plateau encadré à gauche sur toute la hauteur, 
- 2544 v239 : téléphone (portrait et paysage) : plateau à palissade sans forêt (plateau-herbe.web
- 2552 v241 : interface plus lisible (demande d'Amine)
- 2553 1 : compteur d'énergie toujours visible le jour : gros chiffre, jetons, à gauche du texte
- 2565 3 : le nom du jeu, coupé sur ordinateur (« Barric… »), n'est plus affiché pendant la parti
- 2567 7 : plus d'énergie (ou plus rien à jouer) : le bouton de la nuit appelle clairement
- 2572 téléphone en portrait
