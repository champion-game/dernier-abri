# Guide du code

À lire avant d’intervenir sur le code. Index détaillé (chaque fonction, chaque enveloppe, chaque bouton, avec sa ligne) : `docs/CARTE_CODE.md`, généré par `node tools/carte-code.js` (lancé aussi par `node tools/test.js`).

## Lire le code sans tout charger

Le code est formaté par Prettier (`.prettierrc.json`), mais les fichiers sont longs (`engine.js` et `game-draw.js` près de 6 000 lignes, `style.css` 14 000). Quelques lignes restent longues : ce sont des textes et des gabarits HTML, qu’on ne peut pas couper.

- Trouver où vit une fonction : `grep -n "nom" docs/CARTE_CODE.md`, puis `sed -n 'N,Mp' src/fichier.js | cut -c1-300`.
- Chercher dans le code : `grep -n "motif" src/*.js | cut -c1-200`.
- Ne jamais `cat` un fichier `src/` en entier.

## Bonnes pratiques à suivre

- **Mise en forme** : après chaque modification, `npx --yes prettier@3.3.3 --write <fichiers touchés>`. Pas d’autre style à la main.
- **Noms** : parlants pour tout nouveau code (`drawSmoke`, `zombieSpeed`), même si l’ancien code utilise des abréviations (`G`, `S`, `ii`).
- **Une règle de jeu va dans `engine.js`**, jamais dans `game*.js`. Le moteur ne touche pas au DOM.
- **Pas de nouvelle variable globale implicite** : toujours `const` ou `let`.
- **Pas de code mort** : une fonction remplacée est supprimée, pas laissée de côté (l’historique git la garde).
- **Commentaires** : en français, courts, pour expliquer le pourquoi (pas le quoi).
- **Tests** : une règle qui change a son test dans `tools/test-engine.js`.
- Un commit de mise en forme pure est noté dans `.git-blame-ignore-revs`, pour que `git blame` montre la vraie origine des lignes.

## Architecture en une minute

1. `src/engine.js` : **les règles**, sans DOM, dans une fonction fermée qui expose seulement l’objet `Z` (liste des exports en bas du fichier). Tourne dans Node (tests, équilibrage) et dans le navigateur. Données des cartes `U` (l. 15), évolutions `EVO`, traits `TRAITS`, zombies `ZT`, événements `EVENTS`, reliques `RELICS`, familles `FAM`, mutations `MUTS`, personnages `CHARS`, boutique `SHOP` ; puis chemins, état d’une partie (`newState`), collection et decks, pose (`canPlace`, `place`), fusion, et la nuit (`startNight`, `step`, `endNight`).
2. `src/game*.js` : **l’affichage**. Ce sont des scripts classiques qui partagent leurs variables globales, chargés dans l’ordre de `index.html`. Un fichier peut donc utiliser tout ce qui est défini avant lui.
3. `src/style.css` : tout le style, empilé par version.

## Variables globales principales

| Nom | Où | Rôle |
|---|---|---|
| `Z` | engine.js | le moteur (règles et données) |
| `G` | game.js (`newGame`) | l’état de la partie, créé par `Z.newState` : grille, nuit, énergie, ferraille, zombies… C’est ce qui est sauvegardé |
| `S` | game.js (`newGame`) | l’état de l’interface pendant une partie : pioche, main, défausse, carte choisie, `busy` pendant la nuit |
| `META` | game.js (`loadMeta`) | la progression entre les parties (collection, decks, meilleur score) |
| `OPT` | game.js | les options (son, vitesse, mode économie…) |
| `ACT` | game-screens.js | les actions des boutons : `data-a="nom"` appelle `ACT.nom` |
| `V`, `FX`, `PT` | game-draw.js | état visuel de la nuit (positions animées, effets, particules) |
| `cv`, `ctx` | game-draw.js | le canvas de la carte et son contexte 2D |
| `DE` | game-menu.js | `document.documentElement` (classes `artx`, `felton`…) |
| `SFX` | audio.js | les sons : `SFX.play('shot')` |
| `_t` | i18n.js | traduction : `_t('texte')` ou `` _t`… ${x} …` `` |
| `$` | game.js | `document.querySelector` |
| `ii('nom')`, `ink('nom')` | game.js | icônes dessinées (à la place des emojis, interdits) |

Clés `localStorage` : `abri-save` (partie en cours, `SAVE_V`), `abri-meta` (progression), `abri-opts`, `abri-defi`, `abri-ftab`, `abri-style`, `abri-tuto`.

## Le piège principal : les fonctions enveloppées

Les fichiers chargés tard (`game-anim.js`, `game-fx2.js`, `game-artx.js`, `game-fx3.js`, `game-fx5.js`, `game-coll.js`, `game-fiche.js`) ajoutent des effets en **remplaçant** des fonctions existantes :

```js
{const r0=render;render=function(){r0.apply(this,arguments);/* effet en plus */}}
```

Conséquences :
- Modifier `render` dans `game-ui.js` ne suffit pas toujours : 7 enveloppes passent après (`game-fx2.js`, puis 6 dans `game-artx.js`). Même chose pour `playEvents` (4), `frameInner` (4), `applyArt` (4).
- La dernière enveloppe chargée s’exécute en premier ; elle peut court-circuiter l’original (ex. `collectionScreen` dans `game-coll.js` remplace tout en style artiste).
- La liste à jour est dans `docs/CARTE_CODE.md`, « Fonctions enveloppées ».

Pour un **nouvel** effet visuel, préférer modifier directement la fonction d’origine plutôt qu’ajouter une enveloppe de plus. Si une enveloppe est vraiment utile (effet séparé qu’on veut pouvoir retirer d’un bloc), garder la forme ci-dessus, dans un bloc `{ }`, avec un `try{}catch(e){}` autour de l’ajout.

## Deux styles en parallèle

- Le style actuel (cartoon) reste celui des joueurs.
- Le style artiste vit sous `html.artx` (CSS) et dans `game-artx.js`, `game-coll.js` (JS, testé avec `ARTX()` ou `AX.on()`), avec les images de `assets/art/`.
- Accueil du style artiste (v245) : `title()` appelle `axTitleHtml()` (game-artx.js) quand `html.artx` est actif ; `show()` met la classe `axh` sur `#ov` ; le décor est le calque `#axbg`, immobile depuis la v259 (ni parallaxe ni lueurs animées).
- Une modification du style artiste ne doit jamais changer le style actuel : la préfixer par `html.artx`.

## Le CSS

- Organisé par version (`/* v126 : … */`), pas par écran : une même zone peut être réglée à plusieurs endroits, **la dernière règle l’emporte**.
- Avant de modifier un sélecteur : `grep -n "sélecteur" src/style.css | cut -c1-200` pour voir toutes ses règles.
- Pour un réglage nouveau, l’ajouter à la fin avec un commentaire `/* vNNN : … */`.

## Recettes

- **Nouvelle carte** : données dans `U` de `engine.js` (règles), puis affichage (nom, texte, icône) dans `game.js` si besoin, traduction dans `lang-en.js`, et test dans `tools/test-engine.js`. Lire d’abord `docs/GAME_DESIGN.md`.
- **Nouvelle illustration de carte** (`assets/cards_cartoon/`) : la déclarer dans `CART_FILES` (`game.js`), puis `python3 tools/miniatures.py` (miniature dans `assets/cards_min/`, ou `assets/art_min/cards/` pour l’artiste, vérifiée par le test moteur). Les petites cartes affichent la miniature ; `hdArt(élément)` passe une grande carte à l’image complète.
- **Nouveau texte** : en français dans `_t('…')`, traduction dans `src/lang-en.js` (clé = texte français exact). Le test moteur signale les oublis.
- **Nouveau bouton** : `<button data-a="nom">` et une entrée `nom:()=>{…}` dans `ACT` (`game-screens.js`).
- **Nouvel effet de nuit** : `playEvents` (`game-ui.js`) reçoit les événements du moteur ; le dessin se fait dans `frameInner` / `drawFX` (`game-draw.js`).
- **Chargement des images** : `src/game-load.js`. L’écran de chargement (`#boot`, style dans `index.html` ; v254 : fond et logo allégés dans `assets/boot/`, barre dans le panneau noir, étape, pourcentage et astuces `BOOT_TIPS`) attend l’essentiel (`bootUrls`) ; le reste se charge ensuite en arrière-plan (`preloadBackground`), en sautant ce que le service worker garde déjà.
- **Dessin** : chaque élément dans un `try{}catch(e){}` pour que la boucle d’affichage ne s’arrête jamais.
- **Mise en ligne** : voir `CLAUDE.md` (numéro de version à trois endroits, `node tools/test.js`).

## Outils

| Fichier | Rôle |
|---|---|
| `tools/test.js` | tous les tests (régénère aussi la carte du code) |
| `tools/test-engine.js` | tests du moteur (Node, ~3 s) |
| `tools/test-browser.js` | le vrai jeu dans Chromium (~3 min) |
| `tools/balance.js` | équilibrage, seulement quand Amine le demande |
| `tools/equilibrage.js` | génère `docs/EQUILIBRAGE_IA.md` (règles et valeurs pour une IA) |
| `tools/carte-code.js` | génère `docs/CARTE_CODE.md` |
| `tools/miniatures.py` | miniatures des illustrations de cartes (`assets/cards_min/`, `assets/art_min/cards/`) |
| `tools/art-liste.js` | liste des images de l’artiste |
| `tools/*.py` | génération ponctuelle d’images (textures, pack d’interface, agrandissement) |
