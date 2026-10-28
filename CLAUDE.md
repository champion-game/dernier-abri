# Barricard (anciennement « Dernier Abri »)

Nom du jeu (v144, décision d’Amine) : **Barricard** (barricade + card), le même dans toutes les langues. « Dernier Abri » reste l’indicatif radio de la maison dans l’histoire et le nom de la Mutation 10. Le dépôt et l’adresse du site gardent l’ancien nom.

Roguelite de cartes de survie zombie, destiné d'abord à Steam (PC), avec une version mobile ensuite.
Le jour, le joueur pose des cartes autour de sa maison. La nuit, la horde attaque en temps réel et la défense se joue toute seule. Le but est de tenir 30 nuits jusqu’à l’arrivée des secours (victoire, puis 10 niveaux de Mutation) ; le joueur peut aussi rester en mode infini pour le score.

Le document de conception complet est dans `docs/GAME_DESIGN.md`. Lis-le avant toute modification de règles.

## Contexte du créateur

- Amine développe seul, sans expérience de programmation de jeu : c'est toi qui écris le code.
- Il communique en français et veut des réponses courtes et directes.
- Il teste souvent sur son téléphone : chaque changement doit rester jouable en portrait à environ 390 px de large, et bien tenir sur un écran d'ordinateur (1280 × 800).
- Challenge ses idées quand elles nuisent au jeu, et propose des options réalisables.

## Stack technique

- HTML, CSS et JavaScript sans framework ni étape de build. Ouvrir `index.html` suffit pour jouer.
- Rendu de la carte en Canvas 2D (`src/game.js`). Tous les graphismes sont dessinés en code pour l'instant.
- Polices : Special Elite (titres) et Atkinson Hyperlegible (texte), fichiers dans `assets/fonts/`.
- Interface en français (langue source) et en anglais (`src/lang-en.js`).

## Structure

- `index.html` : la page et la structure de l'interface.
- `src/engine.js` : le moteur, avec les règles pures (cartes, zombies, vagues, événements, déroulé d'une nuit tour par tour). Aucun accès au DOM, il doit tourner dans Node comme dans le navigateur. Il expose l'objet global `Z`.
- `src/game.js` et `src/game-*.js` : l’interface, découpée en fichiers chargés dans l’ordre par `index.html` (ils partagent leurs variables) :
  - `game.js` : constantes (dont `VERSION`), cartes affichées, progression, sauvegarde ;
  - `game-draw.js` : dessin de la carte (canvas), effets visuels, boucle d’affichage ;
  - `game-ui.js` : fiche, main, plateau, déroulé de la nuit ;
  - `game-screens.js` : aube, options, collection, decks, préparation, actions des boutons (`ACT`) ;
  - `game-menu.js` : défi du jour, tableau des combats, menu pause, raccourcis clavier, accueil et démarrage.
  - `game-anim.js` : animations de cartes inspirées de Hearthstone (main, pose, aube, collection, decks, récompense) ; chargé en dernier, il enveloppe quelques fonctions des autres fichiers.
  - `game-fiche.js` : fiche de fin de partie (rapport de survie) et son image à partager ; chargé après `game-anim.js`.
  - `game-fx2.js` : troisième série d’effets (avant → après, zones non couvertes, bouton de la nuit, nuit rouge, gros coups, maison touchée, aube) ; chargé en dernier.
- `sw.js` : rend le jeu jouable sans internet une fois chargé (code : réseau d’abord ; images et sons : copie locale d’abord).
- `assets/art/` : les images de l’artiste en essai (même nom que l’image remplacée, puis `node tools/art-liste.js`), visibles via Options → « Images de l’artiste » sur le site GitHub seulement (voir `docs/GAME_DESIGN.md`, « Le style artiste »).
- `assets/fonts/` : les polices, intégrées au jeu (plus de Google Fonts).
- `src/audio.js` : les sons, générés en code avec Web Audio (objet global `SFX`).
- `src/i18n.js` : la traduction (`_t`, langue choisie) ; `src/lang-en.js` : le dictionnaire anglais (clé = texte français).
- `src/style.css` : le style de l'interface.
- `tools/simulate.js` : ancienne simulation d’équilibrage (remplacée par `tools/balance.js`).
- `tools/balance.js` : le test d’équilibrage (à lancer quand Amine le demande).
- `tools/test.js` : les tests automatiques (moteur et navigateur).
- `docs/GAME_DESIGN.md` : le document de conception, à tenir à jour.

## Économie de tokens (demande d'Amine)

- Une seule capture d'écran par changement visuel, en largeur téléphone (390 px). PC et téléphone tourné seulement si quelque chose cloche ou si Amine le demande.
- Ne regarde pas les captures de `tools/test-out/` si le test ne signale aucun problème.
- Cherche avec `grep` et lis seulement les passages utiles : jamais un fichier entier, les lignes des fichiers `game*.js` sont très longues.
- Lance le test navigateur complet une seule fois, juste avant la mise en ligne ; entre-temps, `node tools/test-engine.js` suffit.
- Réponses courtes. Pas de longue analyse sans demande.
- Une conversation par sujet : quand un sujet est terminé, propose à Amine d'ouvrir une nouvelle conversation (avec le dépôt champion-game/dernier-abri) pour le suivant.

## Règles de travail

- Garde la séparation moteur / rendu : une règle de jeu va dans `engine.js`, jamais dans `game.js`.
- Amine teste lui-même le gameplay et l'équilibrage sur son téléphone. Ne lance pas `node tools/simulate.js` ni `node tools/balance.js` sauf s'il le demande : contente-toi de vérifier que le jeu tourne sans erreur. Le joueur automatique joue nettement moins bien que lui.
- Après chaque changement visible, teste le jeu en largeur téléphone et sur écran d'ordinateur, et vérifie qu'il n'y a aucune erreur dans la console.
- La boucle d'affichage ne doit jamais s'arrêter sur une erreur : chaque élément est dessiné dans un bloc protégé. Évite les API de canvas récentes sans solution de secours (exemple : `roundRect`, déjà remplacé si absent).
- Mets à jour `docs/GAME_DESIGN.md` quand une décision de conception change.
- Fais des commits petits, avec un message clair en français.
- Après chaque mise en ligne, donne toujours à Amine le lien direct vers la nouvelle version, avec son numéro pour contourner le cache : `https://champion-game.github.io/dernier-abri/?v=NNN` (NNN = numéro de `version.txt`, ex. `?v=151`). Publié depuis `main`.
- Travaille et pousse toujours directement sur `main`, sans pull request (décision d'Amine) : c'est `main` qui est en ligne. Si la session impose une autre branche, fusionne-la dans `main` à chaque mise en ligne.
- Avant chaque mise en ligne, lance `node tools/test.js` et corrige tout ce qui échoue :
  - `tools/test-engine.js` (Node, ~3 s) : intégrité des cartes et zombies, pose de chaque carte, règles clés, et 300 nuits aléatoires (jusqu’à la nuit 60, avec mutations et événements) qui ne doivent jamais planter, produire de valeurs absurdes, laisser un zombie dans la forêt ou dépasser 2 s ;
  - `tools/test-browser.js` (Chromium, ~3 min) : le vrai jeu en 390 × 844, 1280 × 800 et 844 × 390 (téléphone tourné), tous les écrans, pose des cartes de la main, plusieurs nuits complètes avec l’aube, la pause du Colosse et la reprise de sauvegarde ; vérifie l’absence d’erreur console, de fichier manquant et de défilement horizontal, et les images/s. Les captures sont dans `tools/test-out/` : regarde-les quand un changement est visuel.
  - Quand une règle change, ajoute ou adapte le test correspondant dans `tools/test-engine.js`.
- Test d'équilibrage : `node tools/balance.js` (~3 min), **seulement quand Amine le demande**. Il produit `tools/balance-out/rapport.md` (courbe de difficulté avec un joueur automatique, montée en puissance de la horde, valeur de chaque carte comparée aux cartes de son type) et ajoute une ligne à `tools/balance-out/historique.csv` pour comparer les versions. Résume-lui les points saillants et propose des corrections, sans les appliquer avant son accord.
- À chaque mise en ligne, change `VERSION` en haut de `src/game.js` (affichée sur l’écran d’accueil), le numéro `?v=` de tous les fichiers dans `index.html` et le numéro dans `version.txt` (même numéro, ex. `v70`) : le jeu compare `version.txt` à sa version et se recharge tout seul s’il est en retard (cache du site ou du téléphone).

## Prochaines étapes (par ordre de priorité)

Équilibrage : Amine est satisfait de l’état v114 (frénésie +10 %/nuit sur les PV seulement depuis la v131, curée, 4 énergies). Le joueur automatique de `tools/balance.js` est à jour des règles mais joue bien moins bien qu’Amine : il sert à comparer les cartes, pas à mesurer la difficulté.


1. Performance : v115 a allégé la nuit (obscurité mi-résolution, plafonds de sons, particules et lumières) et ajouté un Mode économie. À confirmer sur un téléphone d’entrée de gamme.
2. Derniers sons enregistrés (arbalète, lance-flammes, mort d’un survivant, aube, musique de nuit) : fichiers CC0 fournis par Amine, intégrés comme dans `assets/sounds/` (voir `CREDITS.md`).
3. Graphismes : le jeu est en style cartoon (illustrations et sprites générés). Un artiste va tout redessiner : ses images arrivent par lots dans `assets/art/` (v193), à tester avec la case des Options avant de devenir le style par défaut. **Refonte de l’interface** : tout le nouveau style se limite à `html.artx` (CSS) et aux images de `assets/art/`, pour que le style actuel reste intact pour les joueurs. Sauvegarde de la dernière version stable avant la refonte : branche `sauvegarde-v195` (ne jamais la modifier ; pour revenir en arrière, remettre `main` à son état). Déclarer sur Steam l’usage d’IA qui resterait.
4. Préparer Steam : test à l’aveugle, page Steam, démo pour le Next Fest, version Electron ou Tauri, succès, sauvegarde cloud, classement du défi quotidien.
5. **Traduction anglaise : faite (v146).** Tout nouveau texte s’écrit en français dans `_t('…')` ou `` _t`…${x}…` `` (voir `src/i18n.js`), et sa traduction anglaise s’ajoute dans `src/lang-en.js` (clé = texte français exact). `node tools/test-engine.js` signale tout texte sans traduction.
