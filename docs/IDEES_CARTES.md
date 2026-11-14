# Idées validées pour les cartes (à mettre dans le jeu)

Validées par Amine le 14 novembre 2026, à partir des pages de démo. **Toutes mises dans le jeu en v266** (code : fin de `src/style.css`, bloc « v266 » ; `cardLook`, `bonusCoins`, `isNewCard` dans `src/game.js` ; `goldBurst`, `burnFx`, `placeFx`, `fuseCardsFx`, `ejectCartridge`, `spinChangedCoins`, `thickLayers` dans `src/game-anim.js` ; `drawFloats` dans `src/game-draw.js`).
Tout est faisable en code (CSS et `game-*.js`), sans nouvelle image. Chaque effet qui bouge doit se couper en Mode économie (`html.eco`) et avec `prefers-reduced-motion`, et rester jouable à 390 px de large.

Déjà en place en v265 (pour mémoire) : cadre d’Amine teinté selon la rareté, couleur du rôle, pierre de coût selon le type, emblème de bande (faction) en filigrane, petite vie selon le rôle (grandes cartes), Holographique arc-en-ciel, Légendaire animée (`cardLook` dans `src/game.js`, fin de `src/style.css`).

## Animations 3D

1. **Récompense face cachée** : à l’aube, les 3 cartes proposées arrivent de dos (`assets/ui/dos.webp`) et se retournent une par une ; une carte rare jaillit avec un éclat doré. Écran : `.picks` (`game-screens.js`).
2. **Carte avec une épaisseur** : tranche (feuillets empilés en `translateZ`) et dos visibles quand la grande carte penche ou se retourne (grande carte, collection).
3. **Pose de carte en vol** : la carte quitte la main en arc, se couche sur la case, soulève de la poussière, puis la figurine apparaît ; le plateau tremble légèrement.
4. **Pièces qui tournent** : coût, dégâts et PV ont une tranche et font un tour quand leur valeur change.
5. **Fusion spectaculaire** : les deux cartes identiques tournent l’une vers l’autre, éclair, la carte fusionnée sort avec ses étoiles ★.
6. **Défausse qui brûle** : la carte défaussée ou détruite se consume de bas en haut (masque qui monte), ligne de braise, cendres.
7. **Douilles éjectées** : quand on dépense de l’énergie, la cartouche (`cartoucheSvg` dans `game.js`) est éjectée en tournoyant.
8. **Dégâts qui jaillissent** : la nuit, les chiffres de dégâts sautent vers l’écran en profondeur ; le zombie touché recule et blanchit un instant ; critiques plus gros et rouges.

## Lecture des cartes

9. **Bonus visibles** : quand un bonus (faction, relique, amélioration) change un chiffre, la pièce passe en vert, grossit un instant et reçoit une petite flèche.
10. **Carte nouvelle** : bandeau NOUVEAU et reflet la première fois qu’on obtient une carte (main et collection) ; mémoriser dans `META`.

## Beauté

11. **Cadre métallique** : un reflet glisse sur les ornements du cadre seulement (masque = `cadre-barricard.webp`), de temps en temps.
12. **Lumière de la scène** : les cartes prennent la lumière du moment : chaude le jour, bleue la nuit, rouge pendant la nuit rouge (lire la phase comme les décors `--ui-decor-*`).

## Refusées (ne pas faire)

Plateau vu comme une table avec figurines, main en éventail, pioche en pile, fenêtre dans la grande carte, gemme de rareté, synergies de bande, améliorations gravées, nom doré, illustration qui respire, brume, parchemin vieilli. Jouable ou pas : non retenu.

## Pages de démo (privées, compte d’Amine)

- Première série 3D : https://claude.ai/artifact/6R3FCRNsHD7W7KxycPG537
- Deuxième série 3D : https://claude.ai/artifact/Ft2E5NJ6PdeGa54MTUGycU
- Lecture des cartes : https://claude.ai/artifact/8PdC5XhKcHnZCawDBnGhee
- Beauté : https://claude.ai/artifact/9coqpzEqCHQnX8BY3XD3n1
