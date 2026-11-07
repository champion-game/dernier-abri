# Guide du code

À lire avant d’intervenir sur le code. Index détaillé (chaque fonction, chaque enveloppe, chaque bouton, avec sa ligne) : `docs/CARTE_CODE.md`, généré par `node tools/carte-code.js` (lancé aussi par `node tools/test.js`).

## Lire le code sans tout charger

Les fichiers `game*.js`, `engine.js` et `style.css` ont des lignes très longues (jusqu’à 2 600 caractères).

- Trouver où vit une fonction : `grep -n "nom" docs/CARTE_CODE.md`, puis `sed -n 'N,Mp' src/fichier.js | cut -c1-300`.
- Chercher dans le code : `grep -noE ".{0,60}motif.{0,60}" src/*.js` (montre le contexte sans la ligne entière).
- Ne jamais `cat` un fichier `src/` en entier.

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
- Une modification du style artiste ne doit jamais changer le style actuel : la préfixer par `html.artx`.

## Le CSS

- Organisé par version (`/* v126 : … */`), pas par écran : une même zone peut être réglée à plusieurs endroits, **la dernière règle l’emporte**.
- Avant de modifier un sélecteur : `grep -n "sélecteur" src/style.css | cut -c1-200` pour voir toutes ses règles.
- Pour un réglage nouveau, l’ajouter à la fin avec un commentaire `/* vNNN : … */`.

## Recettes

- **Nouvelle carte** : données dans `U` de `engine.js` (règles), puis affichage (nom, texte, icône) dans `game.js` si besoin, traduction dans `lang-en.js`, et test dans `tools/test-engine.js`. Lire d’abord `docs/GAME_DESIGN.md`.
- **Nouveau texte** : en français dans `_t('…')`, traduction dans `src/lang-en.js` (clé = texte français exact). Le test moteur signale les oublis.
- **Nouveau bouton** : `<button data-a="nom">` et une entrée `nom:()=>{…}` dans `ACT` (`game-screens.js`).
- **Nouvel effet de nuit** : `playEvents` (`game-ui.js`) reçoit les événements du moteur ; le dessin se fait dans `frameInner` / `drawFX` (`game-draw.js`).
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
| `tools/art-liste.js` | liste des images de l’artiste |
| `tools/*.py` | génération ponctuelle d’images (textures, pack d’interface, agrandissement) |
