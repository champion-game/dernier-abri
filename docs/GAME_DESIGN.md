# Barricard — Document de conception

**Nom (v144)** : le jeu s’appelle **Barricard** (barricade + card), dans toutes les langues. « Dernier Abri » reste l’indicatif radio de la maison (voir `docs/HISTOIRE.md`) et le nom de la Mutation 10.

## Le pitch

Un roguelite de cartes de survie zombie, **sans fin**. Le jour, tu fortifies ta maison avec des cartes : barricades, survivants armés, pièges, objets. La nuit, la horde sort des bois et attaque en temps réel. Il n'y a pas de secours : le but est de survivre une nuit de plus, encore et encore. Le joueur doit toujours se sentir en détresse.

Public visé : grand public, fans de survie zombie (Project Zomboid, They Are Billions) et de roguelites courts.
Plateformes visées : Steam (PC) puis mobile.

## La boucle de jeu

1. **Début** : tu prépares la partie : un de tes 3 decks (20 à 30 cartes, construits avec ta collection), un personnage (qui donne parfois une relique) et un lieu.
2. **Jour** : tu as **4 énergies**. Chaque carte coûte de 0 à 3 énergies selon sa puissance ; tu joues autant de cartes que ton énergie le permet (le Café, gratuit, donne +2 énergies). Les cartes non jouées **restent en main** pour les jours suivants. Chaque jour, la main est complétée jusqu'à 5 cartes (+1 avec une Radio en jeu, +1 avec le Grand sac à dos), avec au moins 1 nouvelle carte et 8 cartes au maximum. Une fois par jour, tu peux aussi **déplacer** une de tes unités vers une case libre.
3. **Nuit** : les zombies apparaissent sur l'anneau extérieur (les bois) et marchent vers la maison. Tes unités attaquent automatiquement. Les zombies frappent tout ce qui bloque leur chemin. Le bouton du bas passe la nuit en vitesse ×2.
4. **Aube** :
   - toutes les 4 nuits, la horde mute (bonus permanent pour les zombies) ;
   - toutes les 5 nuits, tu choisis 1 relique parmi 3 ;
   - tu choisis 1 carte parmi 3 (ou aucune), tirées de ta propre pioche et de ta défausse : elle arrive **d'office dans ta main du lendemain** (aucune carte hors du deck) ;
   - au troc, tu dépenses ta ferraille (réparer, acheter, améliorer, jeter).
5. La partie continue jusqu'à ce que la maison tombe à 0 PV. Le Colosse attaque toutes les 10 nuits.

Score : nombre de nuits survécues, avec un record sauvegardé (et le nombre de zombies éliminés).

## La sauvegarde

- La partie en cours est sauvegardée automatiquement dans le navigateur (`localStorage`) : au début de chaque jour, après chaque carte jouée et à l'aube, avec le choix de cartes proposé.
- L'écran d'accueil propose « Continuer » si une partie est en cours. La sauvegarde est effacée à la victoire ou à la défaite.
- Recharger la page pendant la nuit ramène au jour, avec les cartes déjà posées. Recharger à l'aube garde les 3 mêmes cartes proposées.
- La sauvegarde porte un numéro de version, pour pouvoir gérer les anciennes sauvegardes lors des mises à jour (Steam).

## La carte

- Grille de 11 × 11 cases depuis la v188, soit 9 × 9 cases jouables (9 × 9 de la v32 à la v187, 7 × 7 avant). Les portées n’ont pas été revues pour ce passage : à confirmer en jeu. Une sauvegarde en 9 × 9 est recentrée sur la nouvelle carte.
- L'anneau extérieur (40 cases) est la forêt : les zombies y apparaissent, le joueur ne peut rien y poser.
- La case centrale est la maison : 10 PV maximum.
- Les 80 cases intérieures restantes sont les emplacements du joueur.
- **Murs tracés en ligne** : Barricade, Épave, Clôture, Sacs de sable, Mur de pneus, Barrage de police et Mur modulaire se tracent en glissant sur 1 à 4 cases en ligne droite. La 1ʳᵉ case coûte le prix de la carte, chaque case en plus 1 énergie. Une seule carte pour tout le mur. Les murs ne fusionnent plus (un mur tracé fusionnerait sur lui-même), et l'évolution Fortin demande désormais Épave + Bunker.
- **Cartes de construction** (tous les murs et tous les pièges) : après la 1ʳᵉ pose, la carte reste en main toute la journée (marquée « Encore ») et se repose par clic ou par tracé. Réutiliser un mur coûte 1 énergie par case, un piège son prix normal. Le soir, la carte part à la défausse ; les constructions restent sur la carte et ne rendent plus de carte en tombant. La défausse n'est remélangée que quand la pioche est vide.
- **Glisser-déposer** : toute carte de la main peut être glissée jusqu'à sa case (en plus du choix puis clic).
- **Portée en losange** (v36) : au-delà du contact, la portée se compte en pas droits (|lignes| + |colonnes|). À portée 2, un tireur couvre 12 cases au lieu de 24 avec l'ancien carré. Le corps à corps (portée 1) garde les 8 cases autour. Les portées longues passent de 5 à 4. Toucher une unité qui tire affiche sa zone de tir.
- **Portées réduites** pour compenser la carte plus grande (les zombies marchent plus longtemps sous le feu) : portée 3 → 2, portée 4 → 3, portée illimitée → 5 (Sniper, Mortier, Tireur de nuit). La portée 2 ne change pas.
- **Chemins des zombies** : chaque tour, le jeu calcule pour toute la carte la distance jusqu'à la cible (l'abri, ou un leurre comme la Sirène). Entrer sur une case libre coûte 1 ; une case occupée coûte en plus ses PV (pour un rempart, les PV de tout le rempart). Les zombies contournent donc tant que le détour est plus court que de casser, sinon ils attaquent le point le plus faible. On ne passe pas en diagonale entre deux obstacles. Les rampants passent sous les murs. Le Colosse fonce toujours tout droit et détruit ce qu'il frappe. À égalité de chemin, le style de marche de chaque zombie décide, pour qu'ils n'arrivent pas tous par le même côté.
- **Remparts** : des murs voisins (8 cases autour) fusionnent en un seul ouvrage : palissade de rondins taillés en pointe (bois) ou panneaux rivetés (métal), tours aux extrémités et aux angles, une seule barre de PV ; fissures puis brèches quand les PV baissent. Les PV sont mis en commun (le mur le plus solide encaisse chaque coup). Les murs simples se fondent dans le rempart ; Clôture, Bunker, Brasero et Fortin gardent leur dessin.

## Les cartes

Il y a 85 cartes (dont 8 chefs légendaires). Le deck de départ ne contient que les 8 cartes du personnage : les autres se gagnent à l'aube ou s'achètent au troc. Les unités posées restent en place d'une nuit à l'autre et gardent leurs dégâts. Poser une carte sur une case occupée remplace l'unité.

Coût en énergie :

- **0 énergie** : Café
- **1 énergie** : Barricade, Clôture, Sacs de sable, Gamin, Chien, Infirmière, Piège à loup, Essence, Barbelés, Fumigène, Appât, Conserves, Trousse de secours, Carte routière, Fusée de détresse
- **2 énergie** : Mur de pneus, Tireur, Arbalète, Lance-flammes, Bûcheron, Policier, Boucher, Moine, Projecteur, Radio, Cuisinier, Mécanicien, Mine, Fosse à pieux, Bonbonne de gaz, Outils
- **3 énergie** : Épave, Porte blindée, Sniper, Fusil à pompe, Mitrailleuse, Cocktails, Sirène, Chef de groupe, Panneau solaire, Dynamite

Rareté : à chaque tirage (aube, troc), une carte est commune à 67 %, rare à 27 %, épique à 6 %. Les cartes les plus puissantes sont épiques.

| Carte | Type | Rareté | PV | Effet |
|---|---|---|---|---|
| Barricade | Défense | Commune | 6 | Planches clouées : bloque les zombies, 6 PV |
| Épave | Défense | Rare | 12 | Carcasse de voiture : bloque, 12 PV |
| Clôture | Défense | Commune | 5 | Clôture électrique : bloque, 5 PV, 1 dégât à chaque zombie qui la frappe |
| Sacs de sable | Défense | Commune | 5 | Bloque, 5 PV, ne perd jamais plus de 1 PV par coup |
| Porte blindée | Défense | Épique | 15 | Bloque, 15 PV, seulement sur une case collée à l’abri |
| Mur de pneus | Défense | Rare | 8 | Bloque, 8 PV, laisse une flaque d’essence en tombant |
| Tireur | Tireur | Commune | 3 | 1 dégât par tour, portée 2 |
| Sniper | Tireur | Rare | 2 | 3 dégâts tous les 2 tours, portée illimitée |
| Fusil à pompe | Tireur | Épique | 4 | 2 dégâts à tous les zombies autour de lui |
| Arbalète | Tireur | Rare | 3 | Tous les 2 tours, 2 dégâts à 2 zombies différents, portée 3 |
| Lance-flammes | Tireur | Rare | 4 | 1 dégât au contact et enflamme le zombie : 1 dégât par tour pendant 3 tours |
| Mitrailleuse | Tireur | Épique | 3 | 3 tirs de 1 dégât par tour, portée 2, s’enraye 1 tour sur 3 |
| Cocktails | Tireur | Épique | 2 | Tous les 3 tours, un cocktail sur le groupe le plus serré : 2 dégâts et feu, portée 3 |
| Gamin | Tireur | Commune | 1 | Lance-pierre : 2 tirs de 1 dégât par tour, portée 2, mais 1 seul PV |
| Bûcheron | Corps à corps | Commune | 5 | 2 dégâts par tour au corps à corps, 5 PV |
| Chien | Corps à corps | Commune | 3 | Mord 2 fois par tour au corps à corps |
| Policier | Corps à corps | Commune | 4 | 1 dégât au contact et repousse le zombie d’une case |
| Boucher | Corps à corps | Rare | 4 | 2 dégâts au contact, récupère 1 PV à chaque zombie tué |
| Moine | Corps à corps | Rare | 6 | 1 dégât à tous les zombies autour de lui, 6 PV |
| Infirmière | Soutien | Commune | 2 | Soigne 1 PV à une unité voisine tous les 2 tours |
| Projecteur | Soutien | Rare | 2 | Les unités autour font +1 dégât |
| Radio | Soutien | Rare | 2 | Tant qu'elle tient, tu pioches 1 carte de plus chaque jour |
| Cuisinier | Soutien | Rare | 2 | À chaque aube, l’abri récupère 1 PV |
| Mécanicien | Soutien | Rare | 3 | Répare 1 PV à une défense voisine à chaque tour |
| Sirène | Soutien | Épique | 4 | Les zombies à 2 cases ou moins marchent vers elle au lieu de l’abri |
| Chef de groupe | Soutien | Épique | 3 | Tous les 3 tours, les unités autour attaquent une fois de plus |
| Panneau solaire | Soutien | Épique | 2 | Projecteurs et clôtures marchent pendant une coupure, clôtures à 2 dégâts |
| Piège à loup | Piège | Commune | 1 | Le premier zombie qui marche dessus subit 5 dégâts |
| Essence | Piège | Commune | 1 | Flaque enflammée : 2 dégâts par tour aux zombies dessus, s'éteint à l'aube |
| Mine | Piège | Rare | 1 | Explose au passage : 6 dégâts sur la case et autour |
| Barbelés | Piège | Commune | 1 | Ne bloque pas : 1 dégât et ralentit chaque zombie qui passe, reste en place |
| Fosse à pieux | Piège | Rare | 4 | 3 dégâts à chaque zombie qui tombe dedans, casse après 4 zombies |
| Bonbonne de gaz | Piège | Épique | 1 | Bloque. Explose quand un zombie la frappe : 5 dégâts sur la case et autour |
| Fumigène | Piège | Commune | 1 | Le premier zombie qui passe libère la fumée : les zombies autour sont perdus 3 tours |
| Appât | Piège | Commune | 3 | Viande crue : 3 zombies s’arrêtent 3 tours pour manger |
| Dynamite | Piège | Épique | 1 | Explose au 8ᵉ tour de la nuit : 8 dégâts sur la case et autour |
| Conserves | Objet | Commune | – | Utilise-la sur l'abri : +3 PV |
| Outils | Objet | Commune | – | Utilise-les sur l'abri : toutes tes unités récupèrent 3 PV |
| Trousse de secours | Objet | Rare | – | Utilise-la sur une de tes unités blessées : elle récupère tous ses PV |
| Café | Objet | Épique | – | Utilise-le sur l’abri : il ne compte pas, et tu joues 1 carte de plus aujourd’hui |
| Carte routière | Objet | Rare | – | Utilise-la sur l’abri : regarde les 3 prochaines cartes de ta pioche et prends-en une |
| Fusée de détresse | Objet | Rare | – | Utilise-la sur l’abri : la nuit prochaine, la horde n’arrive que d’un seul côté |

Règles détaillées :
- « Autour » désigne les 8 cases voisines.
- La portée est mesurée en cases, diagonales comprises.
- Les tireurs visent le zombie le plus proche de la maison, puis le plus blessé.
- Les pièges ne bloquent pas le passage, sauf la Bonbonne de gaz.
- L'essence disparaît à l'aube. Le piège, la mine, le fumigène et la dynamite disparaissent après usage. La fosse et l'appât s'usent.
- Les objets se jouent sur la maison (la Trousse sur une unité blessée) et ont un effet immédiat.
- Le feu (essence, lance-flammes, cocktails, explosions) ignore le blindage.

## Les réactions (agir pendant la nuit)

- Les cartes de la catégorie **Réaction** ne se jouent que pendant la nuit, avec l'énergie **gardée** du jour : chaque jour, il faut choisir entre construire et garder de quoi réagir.
- Grenade (1, commune) : 5 dégâts sur la case visée et autour. Tir de l'abri (1, commune) : 6 dégâts au zombie le plus proche de l'abri. Réparation express (1, commune) : une unité récupère 5 PV. Molotov (2, rare) : 2 dégâts en zone et les zombies brûlent 4 tours. Klaxon (2, rare) : tous les zombies (sauf le Colosse) reculent d'une case. Adrénaline (2, épique) : les unités attaquent deux fois pendant 3 tours.
- Chaque personnage commence avec une Grenade.

## Les factions et leurs chefs

Chaque unité appartient au plus à une faction. Plus il y a d'unités d'une même faction sur la carte, plus la faction est forte (2 paliers). Le **Chef** de la faction (carte légendaire : 1 exemplaire, 3 énergie, 100 points de survie, jamais proposé à l'aube ni au troc) lui fait gagner **un palier** tant qu'il est en vie. Les badges sous la horde montrent le nombre d'unités et les paliers atteints (★).

| Faction | Cartes | Palier 1 | Palier 2 | Chef |
|---|---|---|---|---|
| 👮 Police | Policier, Tireur, Projecteur, Sirène | 3 : les policiers perdent 1 PV de moins par coup | 5 : +1 portée | Le Commissaire (2 dégâts, portée 2) |
| 🎖️ Militaires | Sniper, Mitrailleuse, Fusil à pompe, Mine, Dynamite | 3 : +1 dégât | 5 : mines et dynamite +3 dégâts | La Sergente (3 tirs, portée 3) |
| ⛑️ Soignants | Infirmière, Cuisinier | 2 : soins +1 PV | 4 : toutes les unités +2 PV à l'aube | La Doctoresse (soigne 2 PV chaque tour) |
| 🔥 Pyromanes | Essence, Lance-flammes, Cocktails, Bonbonne, Pneus | 3 : feu +1 dégât par tour | 5 : les zombies qui meurent en brûlant explosent | Le Pyromane (enflamme tout à 2 cases) |
| 🪤 Trappeurs | Piège à loup, Fosse, Barbelés, Fumigène, Appât, Arbalète | 3 : pièges +2 dégâts | 5 : +4 au total | Le Braconnier (3 dégâts, portée 4) |
| 🐕 Fermiers | Chien, Bûcheron, Boucher | 2 : corps à corps +1 dégât | 4 : +1 PV par zombie tué | La Fermière (2 coups de 2, 8 PV) |
| ⚡ Bricoleurs | Clôture, Panneau solaire, Mécanicien, Radio | 3 : clôtures +1 dégât | 5 : clôtures étourdissantes, réparations +1 | L'Ingénieur (répare 2 PV par tour) |
| 🏠 Communauté | Chef de groupe, Moine, Gamin | 2 : l'abri +1 PV à l'aube | 4 : +1 énergie par jour | Le Maire (les voisins attaquent plus souvent) |

Tous les paliers sont à 3 et 5 unités.

**Solidarité** : chaque voisin (les 8 cases autour) de la même faction donne +1 dégât, ou +1 soin, ou +1 réparation, au plus +2. Un trait pointillé relie les voisins solidaires sur la carte.

**Riposte du corps à corps** : une unité de corps à corps frappée au contact rend aussitôt le coup (ses dégâts habituels). Le corps à corps a aussi été renforcé : Bûcheron 7 PV / 3 dégâts, Chien 5 PV, Policier 6 PV / 2, Boucher 6 PV / 3, Moine 8 PV / 2 en zone, Agent anti-émeute 11 PV / 2, Chien policier 6 PV, Meute 7 PV, Fermier à la fourche 7 PV / 3, La Fermière 11 PV. Le Lance-flammes passe à portée 2 et 5 PV.

**Rôles (Tank, Soin, DPS)** : une icône sur chaque carte d'unité.
- 🛡️ **Tank** (Policier, Moine, Agent anti-émeute, Fermier à la fourche, Ambulancier, La Fermière, Le Saint ; +3 PV chacun) : **provoque** les zombies à 3 cases ou moins, qui le visent au lieu de l'abri ; **bloque 1 coup sur 3**.
- ❤️ **Soin** (Infirmière, Pharmacienne, Brancardier, Hôpital, Prêtre, Infirmier costaud, Médecin de garde, La Doctoresse, Cantine) : soigne **le double** sur un Tank.
- ⚔️ **DPS** (tous les tireurs et le corps à corps offensif) : **+1 dégât** s'il a un Tank voisin (à couvert).
- **Escouade** : une unité qui a, avec ses voisins, un Tank, un Soin et un DPS gagne +1 dégât (ou +1 soin).
- Quand on touche un Tank pendant la journée, sa zone de provocation s'affiche.

**Alliances** : quand deux factions ont chacune au moins 3 unités sur la carte, elles débloquent un bonus commun (badge 🤝 sous la horde).

| Alliance | Factions | Bonus |
|---|---|---|
| Loi martiale | 👮 + 🎖️ | tireurs +1 portée |
| Pièges incendiaires | 🔥 + 🪤 | les pièges enflamment (3 tours) |
| Médecine de campagne | ⛑️ + 🐕 | corps à corps : +1 PV par zombie tué |
| Arsenal | 🎖️ + ⚡ | les tirs traversent l'armure des Blindés |
| Entraide | ⛑️ + 🏠 | à l'aube, l'abri et toutes les unités +1 PV |
| Patrouille de quartier | 👮 + 🏠 | le corps à corps repousse |
| Battue | 🐕 + 🪤 | corps à corps +1 dégât |
| Court-circuit | 🔥 + ⚡ | clôtures et Tesla enflamment |

**Murs reliés** : des murs voisins (8 cases autour) forment un rempart, relié par une poutre à l'écran. Quand un mur est frappé, c'est le mur le plus solide du rempart qui perd les PV. Le Colosse, lui, détruit toujours le mur qu'il frappe.

**Chaque faction peut se défendre seule** (au moins 3 combattants) :
- ⛑️ Soignants : Ambulancier (8 PV, 1 dégât et recul), Médecin de garde (pistolet, portée 2, se soigne), Infirmier costaud (2 dégâts, soigne ses voisins quand il tue, rare), et La Doctoresse frappe au scalpel (2 dégâts). Palier 1 : soins +1 et +1 dégât.
- ⚡ Bricoleurs : Cloueur (2 tirs de 1, portée 2), et L'Ingénieur tire 2 clous par tour. Palier 1 : +1 dégât à tous les bricoleurs (plus seulement les clôtures).
- 🏠 Communauté : Garde champêtre (2 dégâts tous les 2 tours, portée 3), et Le Maire tire (2 dégâts, portée 2). Palier 1 : +1 portée aux tireurs de la Communauté.

### Cartes de l'extension « factions » (31 cartes)

Pour que chaque faction ait de quoi remplir un deck, 28 unités et 3 réactions ont été ajoutées (à débloquer dans la collection) :

| Carte | Faction | Rareté | Énergie | Effet |
|---|---|---|---|---|
| Agent anti-émeute | 👮 Police | Rare | 2 | Bouclier : 9 PV, ne perd jamais plus de 2 PV par coup, frappe et repousse |
| Chien policier | 👮 Police | Commune | 1 | Mord 2 fois par tour, chaque morsure étourdit le zombie 1 tour |
| Barrage de police | 👮 Police | Commune | 2 | Barrières de police : bloque, 8 PV |
| Tireur d’élite du GIGN | 👮 Police | Épique | 3 | 2 dégâts par tour, portée 3 |
| Mortier | 🎖️ Militaires | Rare | 3 | Tous les 3 tours, un obus sur le groupe le plus serré : 3 dégâts sur la case et autour |
| Sentinelle automatique | 🎖️ Militaires | Rare | 2 | Tourelle : 2 tirs de 1 dégât par tour, portée 2, 6 PV |
| Mine claymore | 🎖️ Militaires | Commune | 2 | Explose au passage : 4 dégâts sur toutes les cases à 2 cases ou moins |
| Bunker | 🎖️ Militaires | Rare | 3 | Bloque, 14 PV, et tire sur les zombies au contact |
| Pharmacienne | ⛑️ Soignants | Rare | 2 | Soigne 1 PV à une unité voisine à chaque tour |
| Hôpital de campagne | ⛑️ Soignants | Épique | 3 | Tous les 2 tours, toutes les unités voisines récupèrent 1 PV |
| Prêtre | ⛑️ Soignants | Rare | 2 | Une fois chacune, les unités voisines qui devraient tomber restent à 1 PV |
| Brancardier | ⛑️ Soignants | Commune | 1 | Soigne 1 PV à une unité voisine tous les 2 tours, 4 PV |
| Brasero | 🔥 Pyromanes | Rare | 2 | Bloque. Tous les 2 tours, 1 dégât et feu aux zombies collés à lui |
| Fût piégé | 🔥 Pyromanes | Commune | 1 | Explose au passage : 4 dégâts autour et les zombies brûlent 3 tours |
| Filet | 🪤 Trappeurs | Commune | 1 | Le zombie qui passe est pris 4 tours, sert 2 fois |
| Piège à ours | 🪤 Trappeurs | Rare | 2 | Le premier zombie qui marche dessus subit 10 dégâts |
| Chasseur | 🪤 Trappeurs | Commune | 2 | 2 dégâts tous les 2 tours, portée 3 |
| Meute de chiens | 🐕 Fermiers | Rare | 2 | 4 morsures de 1 dégât par tour au corps à corps |
| Fermier à la fourche | 🐕 Fermiers | Commune | 2 | 2 dégâts au contact (3 avant la v136) et repousse le zombie d’une case |
| Épouvantail | 🐕 Fermiers | Commune | 1 | Les zombies à 2 cases ou moins marchent vers lui au lieu de l’abri, 6 PV |
| Tourelle bricolée | ⚡ Bricoleurs | Commune | 2 | 1 dégât par tour, portée 2, 4 PV |
| Atelier | ⚡ Bricoleurs | Rare | 3 | Répare 1 PV à toutes les défenses voisines à chaque tour |
| Mur modulaire | ⚡ Bricoleurs | Commune | 2 | Panneaux de tôle : bloque, 9 PV |
| Bobine Tesla | ⚡ Bricoleurs | Épique | 3 | Tous les 2 tours, un arc frappe 3 zombies (2 dégâts). Inactive pendant une coupure |
| Institutrice | 🏠 Communauté | Rare | 2 | Tant qu’elle tient, tu pioches 1 carte de plus chaque jour |
| Marché | 🏠 Communauté | Commune | 2 | À chaque aube, +2 ferraille |
| Vigile | 🏠 Communauté | Commune | 1 | 1 dégât par tour, portée 2, 4 PV |
| Charpentier | 🏠 Communauté | Rare | 2 | À chaque aube, les défenses voisines récupèrent 2 PV |
| Gaz lacrymogène | Réaction | Commune | 1 | Pendant la nuit : les zombies sur la case visée et autour sont perdus 3 tours |
| Napalm | Réaction | Rare | 2 | Pendant la nuit : la case visée et autour s’embrasent (flaques de feu jusqu’à l’aube) |
| Frappe aérienne | Réaction | Épique | 3 | Pendant la nuit : 4 dégâts à tous les zombies |


## Le choix de la nuit

C'est un moment rare : environ 1 aube sur 4, à partir de la nuit 3. Après le troc, on choisit alors la nuit suivante entre deux propositions : une prudente et une risquée, chacune avec un événement différent. Les autres soirs, la nuit est normale, sans bonus.

| Nuit | Horde | Récompense à l'aube |
|---|---|---|
| Tranquille | −30 % | aucune |
| Ordinaire | normale | +6 ferraille |
| De pillage | +40 % | +15 ferraille |
| Sanglante | +70 % | une relique |

## La collection et les decks

- **Collection** (permanente) : les types de cartes débloqués. On commence avec 22 cartes de base. Chaque partie rapporte des **points de survie** : 10 par nuit survécue, plus 1 tous les 4 zombies. On débloque une carte pour toujours : commune 20 points, rare 45, épique 90, chef légendaire 130 (v150 ; avant : 15 / 35 / 70 / 100). **Cartes offertes (v150)** : en fin de partie (hors défi du jour), 3 cartes face cachée tirées parmi les cartes achetables pas encore débloquées ; on en garde 1 à partir de 5 nuits survécues, 2 à partir de 10, les 3 à partir de 20 (`Z.giftCount`, `Z.giftOffer`). Voir v150. Les parties du défi quotidien ne rapportent pas de points.
- **Decks** : 3 emplacements sauvegardés. Un deck compte 20 à 30 cartes, avec au maximum 3 exemplaires d'une commune, 2 d'une rare, 1 d'une épique. Chaque emplacement commence avec le deck de départ (20 cartes équilibrées).
- **Pendant la partie** : on pioche dans son deck. Une unité posée quitte la pioche ; quand elle est détruite, qu'un piège se déclenche ou qu'elle est remplacée, sa carte revient dans la défausse et peut être repiochée. Les objets et les réactions vont dans la défausse après usage. Les unités offertes par le jeu (lieu, événements, pneus en feu) ne sont pas des cartes et ne reviennent pas.
- Les cartes gagnées à l'aube et au troc sont des **renforts temporaires** : elles ne valent que pour la partie en cours, et ne sont proposées que parmi les cartes de la collection.
- Le personnage ne fixe plus le deck : il donne seulement sa relique de départ.
- Défi quotidien (v151) : une seule nuit, 8 cartes tirées « 1 parmi 3 » dans toutes les cartes (voir « Le défi quotidien »).
- **Affichage de la collection (v126)** : trois états bien distincts. Débloquée : en couleur, pastille verte ✓. À portée (assez de points) : en couleur avec un halo doré et un gros bouton « Débloquer · N pts ». Hors de portée : grisée avec un cadenas et « il en manque N ». Les cartes de victoire ont un trophée. Un résumé indique le nombre de cartes débloquées et à portée, et le filtre « À portée » les isole.

## Les survivants nommés

C'est l'identité du jeu : on s'attache à ses survivants, et on les perd.

- Chaque humain posé (tireurs, corps à corps, infirmière, cuisinier, mécanicien, chef de groupe) et chaque chien reçoit un **prénom** et un **trait** tirés au hasard. Le prénom s'affiche sous l'unité pendant le jour.
- Chaque survivant compte ses zombies tués. Toucher une unité affiche sa fiche (prénom, métier, trait, victimes, PV).
- À l'aube : le **héros de la nuit** (celui qui a tué le plus) et les **survivants tombés** sont annoncés.
- Un survivant tombé est perdu pour de bon et rejoint le **mémorial** (visible en touchant « Jour X », et sur l'écran de fin).

| Trait | Effet |
|---|---|
| Costaud | +2 PV |
| Fragile | −1 PV |
| Précis | +1 dégât (seulement pour les unités qui attaquent) |
| Myope | −1 portée (seulement pour les tireurs à distance) |
| Increvable | survit une fois à un coup fatal |
| Coriace | récupère 1 PV à chaque aube |
| Aguerri | +1 dégât après 10 zombies tués (seulement pour les unités qui attaquent) |

## Fusion, évolutions et niveaux

Inspiré de *Super Auto Pets*, *Vampire Survivors* et *Rogue Tower* : les unités grandissent pendant la partie.

- **Fusion** : dès que 3 unités du même type et du même nombre d'étoiles sont sur la carte (à la pose de la 3ᵉ), elles fusionnent en une unité avec une étoile de plus, sur la case de la dernière posée. Chaque étoile ajoute les PV de base de la carte (★ = PV ×2, ★★ = PV ×3…) et +1 dégât (ou +1 soin, +1 réparation). Les fusions s'enchaînent : 3 unités ★ donnent une ★★. Le but : garder une chance de survie dans les parties très longues. La fusion crée une **nouvelle carte ★** : les 3 cartes qui la composent repartent toutes en défausse et peuvent être tirées de nouveau (v111). Si l’unité fusionnée tombe, sa carte ★ est perdue ; rappelée en réserve, elle garde ses étoiles, visibles sur sa carte. L'unité dorée garde le prénom, le trait et les niveaux du survivant le plus aguerri, et cumule les victimes. Pas de fusion pour les pièges, les chefs, les évolutions. Une pose gratuite (événement de l'aube, départ du lieu) ne déclenche pas de fusion.
- **Évolutions secrètes** : deux cartes précises posées (ou déplacées) côte à côte se transforment en une unité unique ✦. Ces unités ne sont jamais dans un deck ni tirées. Elles apparaissent dans la Collection une fois découvertes (sauvegardé dans `abri-meta.evo`). Quand l'évolution tombe, ses 2 cartes d'origine reviennent dans la défausse. L'évolution passe avant la fusion.

| Évolution | Cartes | Effet |
|---|---|---|
| Brigade canine | Policier + Chien | 2 ×2 dégâts, étourdit et repousse, 8 PV |
| Tireur de nuit | Sniper + Projecteur | 3 dégâts à chaque tour, portée illimitée |
| Lance-flammes lourd | Lance-flammes + Bonbonne de gaz | 2 dégâts et feu à tous les zombies à 2 cases |
| Fortin | Épave + Bunker | bloque, 30 PV, 3 dégâts au contact (avant la v34 : Épave + Barricade, retiré car les murs forment maintenant des remparts) |
| Tourelle automatique | Tireur + Mécanicien | 3 tirs de 1, portée 3 |
| Équarrisseur | Bûcheron + Boucher | 3 dégâts en zone, se soigne en tuant |
| Cantine de campagne | Infirmière + Cuisinier | soigne 2 par tour, +2 PV à l'abri à l'aube |
| Bande de gamins | Gamin + Institutrice | 4 tirs de 1, portée 2 |
| Le Saint | Moine + Prêtre | 1 dégât en zone, protège ses voisins d'un coup fatal |
| Traqueur | Arbalète + Chasseur | 2 dégâts à 2 zombies par tour, portée 4 |

- **Niveaux** : tous les 20 zombies tués (20, 40, 60…), une unité gagne un niveau. À l'aube, le joueur choisit : offensif (+1 dégât) ou défensif (+3 PV max et soin complet). Le niveau est affiché sur l'unité (N1, N2…).

## Les trois boss (v128)

Toutes les 10 nuits, un boss mène la horde ; les autres boss de la nuit sont des Colosses en renfort (autant de boss qu'avant : 1 la nuit 10, 2 la nuit 20, 3 la nuit 30).
| Nuit | Boss | PV de base | Vitesse | Capacité |
|---|---|---|---|---|
| 10, 40… | Le Colosse | 58 | lent (3) | fonce tout droit, 10 dégâts par coup (+2 toutes les 10 nuits) |
| 20, 50… | La Mère (+1 Colosse) | 50 | lent (3) | comme le Colosse, et pond un rampant tous les 4 tours (6 au plus) ; en mourant, libère 2 rampants |
| 30, 60… | Le Patient Zéro (+2 Colosses), boss final | 42 | normal (2) | comme le Colosse ; les zombies à 2 cases de lui avancent plus vite (vitesse 2 → 1, 3 → 2), zone montrée par un cercle pointillé |

Les munitions anti-Colosse marchent sur les trois. Les illustrations de la Mère et du Patient Zéro sont provisoires (images de la réserve, agrandies) : à faire dessiner avant Steam.

## La nuit du Colosse en 2 vagues

**Préparer le Colosse** : un compte à rebours dans le bandeau (« Colosse dans N nuits »), et à la boutique du troc des **munitions anti-Colosse** (20 ferraille, 2 au plus en ta possession, usage unique depuis la v111). Pendant sa nuit, un bouton « Tirer sur le Colosse » apparaît : chaque munition lui inflige 30 dégâts (sans tenir compte de l'armure). Trois munitions retirent environ 90 de ses ~123 PV à la nuit 10 : il faut toujours une défense pour finir le travail. Le but : donner un objectif d'économie aux nuits 1 à 9.

**Lance-roquettes** (carte épique, 3 énergie, sans faction) : 2 dégâts tous les 2 tours à portée 3, ×5 contre le Colosse et les Gonflés. L'option « deck anti-Colosse ».

Seule la nuit du Colosse (toutes les 10 nuits) est coupée en 2 vagues ; le Colosse arrive dans la 2ᵉ. Quand la 1ʳᵉ vague est repoussée, la nuit se met en pause : le joueur déplace librement toutes ses unités et peut jouer ses réactions, puis lance la 2ᵉ vague. L'annonce « ⚠ Nuit du Colosse : 2 vagues » apparaît pendant la journée. Toutes les autres nuits arrivent d'un seul tenant (choix d'Amine : la pause est réservée à l'élite). Si la 1ʳᵉ vague reste bloquée (ex. un cracheur hors de portée qui crache sur un mur réparé), la 2ᵉ vague arrive quand même 60 tours après le dernier zombie de la 1ʳᵉ, sans pause (v137).

## L'héritage des survivants

Un survivant nommé qui tombe après 100 victimes ou plus laisse un souvenir (3 au plus, les plus glorieux, sauvegardés dans `abri-meta.legacy`). Dans la partie suivante (hors défi du jour), la première unité de son métier posée porte son souvenir : +1 dégât et +2 PV. Les souvenirs sont consommés au début de la partie.

## Le retour visuel

Sensations inspirées de *Balatro* et *Vampire Survivors* : compteur de victimes de la nuit en haut à gauche, « Doublé », « Triplé », « Carnage ×N » ou « MASSACRE ×N » quand une même attaque tue plusieurs zombies dans le tour (v166 : compté par attaque, plus par tour), gros chiffres jaunes pour les coups de 4 dégâts ou plus, secousse de l'écran selon la force (explosion, frappe aérienne, mort du Colosse), ralenti à la mort du Colosse, chiffres de l'aube qui défilent.

**v170 : animations de cartes inspirées de *Hearthstone*** (fichier `src/game-anim.js`, branche à valider avant `main`). Tout reste court et ne bloque jamais le joueur ; rien ne bouge si l’appareil demande moins d’animations, et le Mode économie retire les effets en boucle.
- En partie : la pioche arrive face cachée et se retourne en vol ; la main se courbe en éventail ; la carte survolée ou touchée se lève et grossit ; les cartes jouables ont un liseré vert qui pulse ; la carte posée vole jusqu’à sa case et s’écrase (poussière, petite secousse, son sourd) ; un refus fait trembler la carte (bulle « Pas assez d’énergie », « Se joue la nuit »…) ; la carte glissée se penche dans le sens du mouvement ; les cartes réutilisables non jouées brûlent au début de la nuit ; un reflet passe sur les cartes rares, épiques et légendaires ; une défense frappée tremble et blanchit, une défense détruite vole en éclats ; les 3 cartes de l’aube arrivent face cachée et se retournent avec un éclat de la couleur de leur rareté.
- Menus : grande carte qui grandit depuis sa place, penche sous le doigt avec un reflet (toucher une carte de la collection l’ouvre) ; déblocage avec pièces, cadenas qui saute, éclat et tampon « Obtenue » ; cartes en cascade quand on change de filtre ; deck : la carte ajoutée vole vers le compteur, la carte retirée y revient, liseré doré quand le deck devient complet, cartes déployées en éventail à l’ouverture ; préparation : le deck choisi avance, les autres reculent ; lancement : le deck est battu puis plonge dans la pioche ; récompense : paquet qui tremble puis explose, lueur de la carte face cachée qui annonce sa rareté (change la décision v150 « sans halo »), suspense et éclat pour les épiques et légendaires ; boutons qui rebondissent ; changement d’écran plus glissé.

**v171 : deuxième série d’animations** (même fichier, mêmes règles : court, jamais bloquant, coupé si l’appareil demande moins de mouvement).
- Plateau : une unité au corps à corps fait un pas vers sa cible puis revient, un tireur recule plus net ; fusion avec éclairs dorés et étoile qui tombe sur l’unité ; passage de niveau avec colonne de lumière et « N2 » qui grossit puis se pose ; le nom d’un survivant qui rejoint l’abri s’écrit à la machine ; une unité à moins de 35 % de ses PV respire plus lentement avec une lueur rouge.
- Nuit : à l’arrivée du boss, bandeau à son nom qui traverse l’écran et court ralenti ; le dernier zombie de la nuit tombe au ralenti avec zoom (« Dernier ! ») ; abri à 30 % de PV ou moins : la barre bat comme un cœur et les bords de l’écran pulsent en rouge.
- Économie : chaque point d’énergie dépensé s’éteint en flash, la jauge se rallume une à une au lever du jour ; des pièces de ferraille volent des zombies tués vers le compteur ; la relique choisie tourne en 3D au centre puis file se ranger ; au troc et à la boutique, la ferraille descend chiffre par chiffre et la carte achetée vole vers la main.
- Accueil animé (v174) : braises qui montent, brume qui dérive en bas, logo qui tombe puis se balance comme un panneau, bouton principal qui luit ; v175 : la lune rayonne, les étoiles scintillent et la ville en feu vacille (lueurs posées sur l’image, positions par image dans `HGLOW` de `game-menu.js`). CSS seulement, coupé en Mode économie et si l’appareil demande moins d’animations.
- Menus (les cartes flottantes derrière l’accueil ont été essayées puis retirées à la demande d’Amine) : la mutation choisie se fissure avec une lueur verte ; un succès tombe du haut et rebondit, avec un son de cloche ; les compteurs de l’aube et les points de fin de partie montent par paliers avec un petit tremblement.

**v189 : bonus de dégâts lisibles** (demande d’Amine : le joueur doit comprendre comment et pourquoi une unité frappe plus fort). Le moteur liste chaque bonus (`Z.dmgParts`) et le calcul des dégâts de la nuit utilise cette même liste : l’affichage ne peut pas mentir. Chaque famille de bonus a sa couleur (Projecteur jaune, Radio bleue, Escouade orange, faction violette, niveau vert, doré or…).
- Pastille ⚔ sous chaque unité qui attaque : dégâts par attaque, blanche sans bonus, dorée avec bonus.
- Unité touchée le jour : un anneau et une flèche colorés partent de chaque source de bonus (Projecteur, Radio, Escouade, Maître-chien) vers l’unité, avec son « +1 ⚔ ».
- Carte choisie dans la main : chaque case où la poser fait gagner des dégâts affiche « +N ⚔ » (total gagné par toutes les unités).
- Après une pose ou un déplacement : « Bonus +1 Projecteur · +1 Escouade » au-dessus de chaque unité qui gagne un bonus, et « −1 … » pour celles qui en perdent.
- Fiche de l’unité en pastilles : PV avec jauge, dégâts, portée, victimes avec jauge du niveau suivant, puis le détail « ⚔ 6 = 2 +1 Niveau +1 Précis +1 Projecteur +1 Escouade ».

**v173 : fiche de fin de partie (« rapport de survie »)** (`src/game-fiche.js`). En haut des écrans de défaite, de départ en hélicoptère et de fin de démo : une feuille de papier usé (bords déchirés, coin corné, coin arraché, bord brûlé, taches, pliures, empreintes de sang, scotch jauni) avec tampon (« TOMBÉ / NUIT n » en rouge, « SECOURU » ou « DÉMO TERMINÉE » en vert), survivant et lieu, mutation, 4 chiffres (nuits, zombies, dégâts, reliques), la **carte MVP** (le plus de dégâts sur la partie, toutes les cartes du même type additionnées), le **survivant MVP** (survivant nommé : éliminations ×2 + PV soignés ; à défaut, la **défense MVP** qui a le plus encaissé), le deck en vignettes et le record. Les chiffres viennent du tableau des combats (`G.mtR`), sans nouvelle règle. Le bouton « Partager la fiche » la redessine en image 1080 × 1350 (format Instagram) : menu de partage du téléphone, ou téléchargement sur PC. Hors ligne (fichier ouvert en local), l’image ne peut pas être créée : le jeu propose une capture d’écran.

## Confort et objectifs (v128)

- **Annuler** : pendant le jour, un bouton « Annuler » apparaît sous la carte après une pose, un déplacement ou un rappel. On peut revenir jusqu'à 10 actions en arrière. Impossible après une carte qui révèle la pioche (Largage, cartes qui montrent les prochaines cartes), et tout est effacé à la tombée de la nuit.
- **Vibrations** (téléphones Android ; l'iPhone ne les permet pas dans le navigateur) : brèche dans l'abri, survivant blessé ou mort, arrivée et mort d'un boss, défaite, succès. Option « Vibrations du téléphone ».
- **Succès** : 28 objectifs permanents (nuits tenues, victoires, Mutations, boss tués, carnages, fusions, évolutions, factions, collection…). Un bandeau les annonce ; la page « Succès » est accessible depuis l'accueil et les statistiques. Ils préparent ceux de Steam et ne changent pas les règles.

## Menu pause et confort (v139)

- **Menu pause** : bouton ⏸ en haut (ou Échap). Pendant la nuit, il fige la horde. Il propose Reprendre, Options, Quitter vers l’accueil (la partie reste sauvegardée ; une nuit quittée en cours sera rejouée depuis le début) et Recommencer une partie (la partie en cours est perdue, sans points de survie). Le jeu se met en pause tout seul si on quitte l’appli pendant la nuit.
- **Raccourcis clavier** (listés dans les options sur ordinateur) : Espace (nuit, vitesse, vague suivante), 1 à 9 (cartes de la main), Échap (annuler la sélection, puis pause), Ctrl+Z (annuler), M (son), D (tableau des combats).
- **Clic droit / appui long** (v140, iPhone compris) : sur n’importe quelle carte (main, collection, deck, bestiaire, aube, troc…), elle s’affiche en grand par-dessus l’écran ; un toucher ou Échap la ferme. Sur le plateau, le clic droit annule la sélection. Dans les menus, les cartes grossissent un peu au survol de la souris.
- **Hors ligne** : une fois chargé, le jeu marche sans internet ; les polices sont dans le jeu.
- **Habillage** : fondu et glissement des écrans, carte qui se soulève au survol de la souris, bandeau « Nuit N » au début de chaque nuit, accueil de nuit avec des zombies qui rôdent autour de la maison.
- **Option daltonisme** : barres de vie bleu/orange (tes unités) et rose (zombies) au lieu de vert/rouge.

## Habillage des menus (v141)

- **Panneaux en bois** (option A choisie par Amine) : planches, grain, clous aux coins, texte clair. Les petites fiches posées dessus (reliques, règles, statistiques) restent en papier.
- **Boutons en planche clouée, texte au pochoir** (v155, style E choisi par Amine) : bois sombre ; bouton principal à 4 clous, texte jaune en majuscules et cadre pointillé ; secondaire à 2 clous, texte crème ; icônes à 1 clou. Un bouton désactivé a le bois terne, la planche enfoncée et le texte effacé ; un bouton verrouillé (contenu du jeu complet dans la démo) a une latte clouée en travers, derrière le texte pour qu’il reste lisible.
- **Boutons en relief** : bombés avec une épaisseur dessous, ils s’enfoncent au clic. Un choix sélectionné reste enfoncé et devient doré (pas de coche). Un choix bloqué est plat et creux.
- **Pas d’emoji** : uniquement les symboles dessinés du jeu.
- **Collection** : halo vert autour des cartes acquises, halo noir et carte grisée pour celles pas encore acquises.
- **Sans défilement** : accueil, préparation de la partie et options tiennent sur l’écran (téléphone 390 × 844 et ordinateur 1280 × 800). Les écrans longs (collection, éditeur de deck, règles) défilent avec une fine barre couleur bois.
- **v142** : vraie texture de bois (image `assets/ui/wood.webp`, générée par `tools/wood.py`, raccordable sans démarcation) et clous ronds (`assets/ui/nail.png`). Quand un écran défile, ses boutons de fin (Retour, Terminé…) restent visibles sur une étagère en bas. Champs de recherche et menus déroulants en papier enfoncé dans le bois. Filtre par rôle (tank, soin, DPS) ou par type dans la collection et l’éditeur de deck. Succès présentés comme les statistiques (tuiles, barre de progression, obtenus puis à obtenir). Le bestiaire ne montre plus que les zombies et les mutations (les cartes du joueur sont dans la Collection). Ajouter ou retirer une carte, ou en acheter une, ne rejoue plus l’animation d’ouverture de l’écran.

## Rôles : tank et DPS (v136)

Constat d'Amine en nuit 24 : l'Agent anti-émeute faisait plus de dégâts que les Snipers. Le tank frappe à chaque tour (il attire la horde) et les bonus fixes (+1 par attaque) profitent surtout aux unités qui attaquent souvent.

- **Tanks à 1 dégât de base** (Policier, Moine, Agent anti-émeute, Ambulancier, Maître-chien, Blindé des secours, Le Saint, La Fermière 2 × 1) ; le Fermier à la fourche passe de 3 à 2. Leur rôle est d'encaisser.
- **Tir de soutien** : un DPS fait +1 dégât, une fois par tour, sur un zombie au contact d'un Tank. Formation récompensée : tank devant, tireurs derrière.
- **Tirs lents** : une unité qui attaque tous les N tours reçoit ses bonus fixes (niveaux, faction, solidarité…) multipliés par N (Sniper : ×2).

## Le tableau des combats (v126)

Inspiré de Details! dans *World of Warcraft*. Le bouton en forme de graphique, en haut de l'écran, l'ouvre et le ferme à tout moment (jour et nuit). Il se met à jour en direct pendant la nuit.
- Onglets : **Dégâts** (total et par tour, zombies tués), **Encaissés** (murs, unités et l'abri), **Soins** donnés (soigneurs et réparateurs), **Reçus**, **Morts** (qui est tombé, blessé ou mort pour de bon, et quel zombie l'a eu).
- Portée : **la nuit** en cours (ou la dernière, le jour) ou **toute la partie**.
- Chaque survivant a sa ligne. Les murs, pièges et cartes sont regroupés par type ; brûlures et saignements ont leur ligne.
- Sur ordinateur et téléphone tourné, il se range dans la colonne de droite ; en portrait, il s'ouvre en bas de l'écran.
- À la fin de la partie (défaite ou départ en hélicoptère), le bouton « Détails de la partie » rouvre ce tableau pour toute la partie.
- Le moteur compte tout dans `st.mtN` (nuit), `st.mtR` (partie) et `st.mtD` (morts).

## Les zombies

Les zombies sont peu nombreux mais coriaces : ils doivent arriver jusqu'aux défenses, pas mourir à la lisière du bois.

| Zombie | PV de base | Vitesse | Dégâts par coup | Particularité |
|---|---|---|---|---|
| Rôdeur | 11 | avance tous les 2 tours | 1 | lent |
| Coureur | 8 | avance chaque tour | 1 | rapide |
| Gonflé | 30 | avance tous les 3 tours | 2 | très lent, 2 dégâts par coup |
| Chien zombie | 4 | avance chaque tour | 1 | rapide et fragile |
| Rampant | 8 | avance tous les 2 tours | 1 | passe sous les défenses (barricades, épaves…) |
| Cracheur | 11 | avance tous les 2 tours | 1 | crache sur ce qui est à 2 cases devant lui ; après 3 crachats sur une défense, il avance au contact (v138) |
| Blindé | 19 | avance tous les 2 tours | 1 | encaisse 1 dégât de moins par coup, sauf le feu |
| Hurleur | 15 | avance tous les 2 tours | 1 | appelle 2 rôdeurs en mourant |
| Le Colosse | 112 | avance tous les 3 tours | 2 | boss de la nuit 10 : détruit une défense d’un coup et frappe l’abri sans mourir |

Leurs PV restent stables jusqu'à la nuit 10, puis augmentent de 12 % par nuit (en plus des mutations).
Les zombies apparaissent de façon échelonnée pendant la nuit, à une position aléatoire de la forêt (d'un seul côté après une Fusée de détresse). Les Colosses arrivent à partir du 10ᵉ tour des nuits 10, 20, 30…

**Sapeur** (dès la nuit 4, 1 à 2 par nuit puis de plus en plus) : 12 PV, lent. Bardé d'explosifs, il ne contourne pas les murs : il fonce dedans et se fait sauter. 15 dégâts au rempart (le mur frappé, puis les plus solides du rempart), 6 à une unité, 3 aux unités et aux zombies autour. À l'abri : 3 dégâts. Tué avant, il explose quand même (3 autour, abri −1 s'il est collé). Contre lui : le tuer à distance, ou des murs isolés en avant comme leurres.

## Les vagues

Nuits 1 à 10 : table fixe. Ensuite, chaque nuit ajoute des zombies de chaque type (+0,6 rôdeur, +0,36 coureur, +0,24 gonflé, chien, rampant et blindé, +0,18 cracheur, +0,15 hurleur), et un Colosse de plus toutes les 10 nuits.

| Nuit | Rôdeur | Coureur | Gonflé | Chien zombie | Rampant | Cracheur | Blindé | Hurleur | Le Colosse | PV des zombies |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ×1.00 |
| 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ×1.00 |
| 3 | 4 | 1 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | ×1.00 |
| 4 | 4 | 1 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | ×1.00 |
| 5 | 4 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 0 | ×1.00 |
| 6 | 4 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | ×1.00 |
| 7 | 5 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | ×1.00 |
| 8 | 5 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | ×1.00 |
| 9 | 5 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | ×1.00 |
| 10 | 5 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | ×1.00 |
| 15 | 8 | 4 | 2 | 2 | 2 | 2 | 2 | 2 | 0 | ×1.60 |
| 20 | 11 | 6 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | ×2.20 |
| 30 | 17 | 9 | 6 | 6 | 6 | 5 | 6 | 4 | 3 | ×3.40 |

## Les événements de l'aube

À partir de la nuit 2, 15 % des aubes proposent une petite histoire avec deux choix (au moins 3 nuits entre deux, jamais deux fois la même tant que les 25 n’ont pas été vues, v111) : un choix risqué qui peut rapporter gros, et un choix prudent. La liste complète est dans `DAWN` (`src/engine.js`). Ils arrivent après la relique éventuelle et avant le choix de la carte.

| Événement | Choix risqué | Choix prudent |
|---|---|---|
| Un inconnu à la porte | L'accueillir : un survivant gratuit, ou 30 % de risque qu'il soit mordu (abri −2 PV) | Fermer la porte |
| Des pillards | Les repousser : +6 ferraille, un défenseur perd 3 PV | Payer 8 ferraille |
| Le supermarché | Fouiller : 60 % +12 ferraille, sinon abri −2 PV | Rester à l'abri |
| Un message radio | Y aller : un survivant gratuit, −1 énergie demain | Ignorer |
| Un chien errant | L'adopter : un chien gratuit | Le chasser |
| Une caisse militaire | L'ouvrir : 50 % une amélioration gratuite, sinon une unité perd 4 PV | La laisser |
| Un mécanicien de passage | Payer 6 ferraille : toutes les unités récupèrent leurs PV | Refuser |
| Un blessé dans le fossé | Soigner : abri −1 PV, toutes les unités +3 PV | Passer son chemin |

## Les mutations de la horde

**Frénésie meurtrière** (v114) : dès la nuit 5, +10 % de PV et de dégâts pour tous les zombies, puis +10 % de plus chaque nuit (nuit 10 : +60 %, nuit 15 : +110 %, nuit 30 : +260 %). **Depuis la v188, elle touche de nouveau les dégâts** (décision d'Amine), sauf pour le Colosse (ses dégâts restent 10, +2 toutes les 10 nuits : avec la frénésie il raserait un mur d'un coup) : les fractions s'accumulent coup après coup pour chaque zombie (1 dégât à +50 % : un coup sur deux à 2), et l'explosion du Sapeur ne change pas. De la v131 à la v187, elle ne touchait que les PV (le tank mourait même soigné en nuit 15). **Curée** : une unité encerclée prend +1 dégât par autre zombie à son contact (+2 au plus, pas le Colosse). **Depuis la v132, les Tanks l'ignorent** ; depuis la v133, le plafond par coup (Agent anti-émeute 2, Sacs de sable 1) s'applique après tous les bonus de dégâts (en nuit 15, un tank soigné par la Doctoresse et l'Hôpital tombait à chaque fois). Avant : un tank qui attire la horde devait être soigné.

Toutes les 4 nuits (nuits 4, 8, 12…), la horde gagne une mutation tirée au hasard, permanente pour toute la partie. Elle est annoncée à l'aube, et le bandeau du haut prévient la veille (« mute à l'aube »). Le but : casser les défenses qui semblaient sûres (par exemple une armée de tireurs) sans ajouter de mécanique à gérer pour le joueur.

| Mutation | Effet |
|---|---|
| Peau épaisse | Les zombies ont +20 % de PV (cumulable) |
| Horde nombreuse | +20 % de zombies chaque nuit (cumulable) |
| Enragés | Les rôdeurs et les coureurs font +1 dégât par coup |
| Carapace | Les rôdeurs encaissent 1 dégât de moins par coup (sauf le feu et les explosions) |
| Régénération | Les zombies récupèrent 1 PV tous les 3 tours |
| Putréfaction | En mourant, un zombie éclabousse les unités autour de lui : 1 dégât |
| Pas pressés | Les zombies lents et très lents avancent plus vite |

## Les personnages

| Personnage | Deck de départ | Relique de départ |
|---|---|---|
| Le survivant | Barricade, Barricade, Épave, Tireur, Tireur, Bûcheron, Piège à loup, Conserves | aucune |
| La policière | Barricade, Clôture, Tireur, Tireur, Sniper, Policier, Projecteur, Conserves | Lunette de visée |
| Le fermier | Barricade, Barricade, Piège à loup, Piège à loup, Mine, Essence, Fosse à pieux, Chien | Manuel du trappeur |
| L’infirmière | Barricade, Épave, Tireur, Bûcheron, Infirmière, Conserves, Outils, Trousse de secours | Marmite de soupe |

## Les lieux

On choisit un lieu après le personnage. Chaque lieu change le départ et une règle.

| Lieu | Effet | Déblocage |
|---|---|---|
| La maison des bois | Ni bonus, ni malus | Dès le départ |
| La ferme | Rivière au nord : la horde arrive par 3 côtés. 2 barricades au départ | Record de 5 nuits |
| La station-service | 2 bonbonnes de gaz et 10 ferraille au départ, l'Essence est gratuite. Horde +15 % | Record de 8 nuits |
| Le centre commercial | Abri à 15 PV. Zombies +15 % de PV | Record de 12 nuits |

## La progression entre les parties

Sauvegardée dans le navigateur : meilleur record, total de nuits survécues, nombre de parties. Les parties du défi quotidien ne comptent pas.

- Personnages : la Policière à 8 nuits au total, le Fermier à 20, l'Infirmière à 35.
- Lieux : selon le record (voir ci-dessus).
- Les cartes se débloquent désormais dans la collection avec les points de survie (voir « La collection et les decks »).
- L'écran d'accueil indique le prochain déblocage ; l'écran de fin liste ce qui vient d'être débloqué.

## Les reliques

Une relique reste active toute la partie. On en choisit 1 parmi 3 toutes les 5 nuits : c'est rare et ça doit compter.

| Relique | Effet |
|---|---|
| Lunette de visée | Tes tireurs ont +1 portée |
| Manuel du trappeur | Tes pièges font +2 dégâts |
| Marmite de soupe | À chaque aube, l’abri récupère 1 PV |
| Grand sac à dos | Tu pioches 1 carte de plus chaque jour |
| Caisse de clous | Tes défenses ont +3 PV |
| Adrénaline | Tes unités au corps à corps font +1 dégât |
| Groupe électrogène | Plus de coupure de courant, clôtures à 2 dégâts |
| Aimant | +3 ferraille à chaque aube |

## La ferraille, le troc et les améliorations

- Chaque zombie éliminé rapporte 1 ferraille, le Colosse 15. Les prix sont élevés : il faut économiser plusieurs nuits pour un achat important.
- À chaque aube, le troc propose :

| Action | Coût | Effet |
|---|---|---|
| La boutique | 5 pour l’ouvrir | 5 objets absents du deck (8 / 14 / 22 / 30 selon la rareté, un exemplaire chacun) et des munitions anti-Colosse (20, 2 au plus). Change à chaque aube |
| Réparer l’abri | 15 | +3 PV à l’abri |
| Améliorer une carte | 25 (+15 par amélioration déjà faite) | Toutes tes cartes de ce type sont améliorées. Plus cher à chaque fois |
| Jeter une carte | 10 | Retire une carte de ton deck |

- Une amélioration vaut pour toutes les cartes de ce type, y compris celles déjà posées, pour toute la partie. Le nom prend un « + ». Elle coûte 25, puis 40, 55… : c'est un investissement rare. Effet selon la carte : +1 dégât (unités qui attaquent), +2 dégâts (pièges qui explosent ou blessent), +4 PV (défenses), +2 PV (soutien), +1 tour (fumigène, appât), +2 PV soignés (Conserves, Outils).

## Les événements

Chaque nuit après la première a 80 % de chances d'avoir un événement (20 % de nuits calmes).

| Événement | Effet |
|---|---|
| Nuit calme | Aucun effet |
| Brouillard | Portée des tireurs −1 |
| Pleine lune | +50 % de zombies |
| Pluie | L'essence ne brûle pas |
| Coupure de courant | Projecteurs et clôtures inactifs |
| Horde affamée | Les rôdeurs deviennent des coureurs |

## L'équilibrage

L'équilibrage est vérifié par simulation (`node tools/simulate.js`). Un bot pose ses cartes en testant toutes les possibilités sur une nuit simulée, puis joue la vraie nuit avec un autre tirage aléatoire.

- Le bot joue le Survivant. À l'aube, il choisit comme un joueur : il teste chacune des 3 cartes sur la nuit suivante et garde la meilleure. Il prend une relique au hasard et dépense sa ferraille (réparer si l'abri est à 5 PV ou moins, sinon améliorer). Il joue jusqu'à la chute de l'abri. `HASARD=1 node tools/simulate.js` le fait choisir ses cartes au hasard.
- Cible : le bot tombe en moyenne vers la nuit 7-8, et environ 40 % des zombies arrivent au contact d'une unité ou de l'abri (la simulation affiche cette part).
- Résultat actuel (60 parties) : chute en moyenne à la nuit 4,1 ; 70 % des zombies arrivent au contact. Corrigé ensuite : avant, 22 des 24 trajets entraient dans l'abri par les 2 cases à gauche et à droite de la maison, donc deux murs solides suffisaient presque. Le bot place mieux qu'un débutant, mais Amine trouvait le jeu trop facile : la cible a été durcie.
- Les deux premières nuits sont volontairement plus faciles pour l'apprentissage.
- Un placement au hasard perd généralement dès la nuit 2 : le placement doit compter.

## La direction visuelle

- Vue de dessus, ambiance forêt la nuit, maison au toit rouge au centre.
- Le jour : carte lisible, emplacements visibles quand une carte est sélectionnée.
- **Plateau lumineux** (v157, inspiré d’une maquette d’Amine) : herbe claire en damier avec un léger relief par case, routes de terre beige bordées d’herbe, forêt de feuillus en relief (ombres, rochers, troncs couchés) qui projette son ombre sur le bord du terrain, fleurs et cailloux discrets loin du centre des cases pour ne pas gêner la lecture. Tout reste dessiné en code.
- **Terrains** (v158) : purement graphiques, sans effet sur les règles. Un terrain est tiré au hasard à chaque partie (le même pour tous au défi du jour) et gardé dans la sauvegarde : forêt, automne (feuillages roux, feuilles mortes), neige (sapins enneigés, traces de pas), désert (sable, cactus, route goudronnée), bitume (béton, épaves, blocs, fûts, gravats) et montagne (sapins, rochers, route de gravier). Les lucioles de nuit restent en forêt, automne et montagne.
- **Décors enrichis et relief** (v159) : bitume = immeubles en relief tout autour (façades avec étages et fenêtres vues depuis une caméra au-dessus de la maison, toits avec climatiseurs, ombre portée), trottoir avec lampadaires, passages piétons, et sur les cases marquages de parking, plaques d’égout, flaques, sacs poubelles ; désert = cactus debout et rochers de grès en relief, crânes, virevoltants ; forêt = champignons, flaques ; automne = citrouilles, bottes de foin ; neige = flaques gelées, congères, bonhomme de neige ; montagne = gros rochers parfois enneigés.
- **Contour du plateau** (v162, choix d’Amine parmi plusieurs maquettes) : une clôture basse fait le tour des cases, ouverte sur les 4 routes, pour montrer d’un coup d’œil que les zombies n’entrent que par là. Sa matière suit le terrain : piquets et lisses en bois avec portails ouverts (forêt, automne), grillage enneigé (neige), barbelés (désert), barrières de chantier et cônes (bitume), muret de pierres (montagne). Autour, un cadre en planches clouées en relief (épaisseur visible, ombre sur le plateau, planches en travers dans les coins) fait du terrain un plateau de jeu, dans l’esprit barricade. La nuit, une brume monte de la forêt et des paires d’yeux orange clignotent près des routes d’où viendront les zombies encore à venir. Décor seulement, sans effet sur les règles.
- **Lumière** (v158) : le jour, soleil chaud en haut à gauche, rayons qui filtrent et ombres de nuages qui glissent ; au crépuscule et à l’aube, lumière orangée rasante ; la nuit, plus sombre, teinte bleu lune et halos colorés (orange pour l’abri, le feu et les tirs, blanc-bleu pour les projecteurs, rouge pour la sirène). Allégé en Mode économie, immobile avec « réduire les animations ».
- La nuit : obscurité avec des sources de lumière (maison, projecteurs, flammes, tirs). Les zombies ont des yeux rouges lumineux pour rester visibles.
- Retours visuels : traînées de balles, éclairs de tir, coups de hache, explosions, taches de sang qui restent au sol, tremblement d'écran quand la maison est touchée.
- Unités sur un cercle de couleur selon leur rôle : bois (défense), jaune (tireur), rouge-orangé (corps à corps), bleu (soutien), rouge (piège), violet clair (objet).

## Le défi quotidien

Refait en v151 (décision d’Amine) : une seule manche, on gagne ou on perd, avec un score.

- Chaque jour, tout le monde a le même défi (graine tirée de la date, `Z.dailyPlan`) : personnage, lieu, événement de nuit, 0 ou 1 mutation, et **la horde du jour**.
- **La horde** : 3 à 5 types de zombies tirés au sort, parfois un boss (35 %). Elle a la force d’une **nuit 20** (frénésie : PV et dégâts ×2,6), mais son effectif vaut la moitié d’une vraie nuit 20 (`Z.DAILY.scale` = 0,5) parce qu’on n’a que 8 cartes. La horde est affichée avant le tirage.
- **Le tirage** : 8 fois, 1 carte à garder parmi 3, dans toute la collection (même les cartes pas encore débloquées). Les 3 cartes de chaque tirage sont les mêmes pour tout le monde. Une carte proposée ne revient pas dans les tirages suivants.
- **La nuit** : les 8 cartes sont en main, énergie illimitée, limite d’unités relevée à 8, survivants posés au niveau 4 (comme vers la nuit 20). Pas d’aube : la fin de la nuit termine le défi.
- **Score** : 10 par zombie tué ; en cas de victoire, +1000 et +100 par PV d’abri restant. Le meilleur score du jour est gardé dans le navigateur (`abri-defi`).
- Rejouable à volonté ; ne compte pas pour les déblocages ni les statistiques.
- Réglage (v151) : avec le joueur automatique, ~20 % de victoires ; Amine devrait gagner plus souvent.
- Plus tard : certains jours (le dimanche ?), **jouer la horde** contre une défense tirée au sort.
- Pas encore de classement en ligne : il faudra un serveur (ou les classements Steam).

## La révélation progressive (v129)

Comme dans *Balatro*, les systèmes avancés tournent dès le départ, mais leur affichage attend que le joueur les rencontre (souvenir dans `abri-meta.hints`) :

- **Première partie** : « Jouer » lance directement la partie (Survivant, Maison des bois, deck de départ, sans Mutation), sans écran de préparation. Le bouton « Collection et decks » n'apparaît qu'après la 1ʳᵉ partie, avec un badge « Nouveau ! » jusqu'à la première visite.
- **Factions** : pictogramme de faction sur les cartes, compteurs en haut de l'écran, section Factions du panneau et résumé du deck cachés jusqu'au premier bonus de faction (bulle « Bonus de faction »).
- **Niveaux** : la fiche d'une unité n'annonce pas le prochain niveau avant le premier niveau gagné ; l'écran de ce premier niveau explique le principe.
- **Évolutions** : déjà secrètes, révélées à la découverte.
- Option **« Tout afficher dès le départ »** pour les habitués (et pour le test navigateur).

## La démo publique (v153)

Version gratuite sur une page itch.io publique (plus tard : démo Steam pour le Next Fest), pour donner envie et récolter des listes de souhaits. Le jeu complet reste sur une page itch.io privée pour les amis testeurs.

- Un seul code : `DEMO_BUILD` (src/game.js) passe à vrai seulement dans la copie envoyée sur la page de la démo (`.github/workflows/itch.yml`). « ?demo » dans l'adresse l'active pour essayer. Règles dans le moteur : `Z.setDemo`, `Z.demoOk`.
- **10 nuits**, jusqu'au Colosse : après la nuit 10, écran « Fin de la démo » (score, points, cartes offertes, ce que contient le jeu complet, bouton liste de souhaits Steam dès que `STEAM_URL` est rempli).
- Ouvert : le Survivant et la Policière, la Maison des bois et la Ferme, les cartes communes et rares (collection, aube, troc, boutique, cartes offertes), reliques, événements, succès.
- Fermé (cadenas « Dans le jeu complet ») : la Station-service et le Centre commercial, le Fermier et l'Infirmière, les cartes épiques et légendaires et les chefs de faction. Les nuits 11 à 30, la victoire, les Mutations et le mode infini n'existent pas dans la démo. Le défi du jour reste visible sur l'accueil, avec un cadenas (décision d'Amine : montrer qu'il existe).
- Mode test gardé (décision d'Amine, pour faire tester l'équilibrage), mais limité aux nuits 1 à 10 et aux cartes de la démo. La version complète garde le mode test sans limite.

## Le style artiste (v193)

Les illustrations de l’artiste remplacent les images actuelles petit à petit, sans casser le jeu.

- Chaque image livrée va dans `assets/art/<cards|sprites|relics|ui>/`, **avec le même nom de fichier** que l’image qu’elle remplace (`assets/cards_cartoon/`, `assets/sprites_cartoon/`, `assets/relics/`, `assets/ui/`). Puis `node tools/art-liste.js` met à jour `assets/art/liste.json` et signale les noms qui ne remplacent rien. Le test moteur vérifie que la liste est à jour.
- Options → case « Images de l’artiste (essai) » : bascule tout de suite d’un style à l’autre (cartes, sprites du plateau, reliques, fonds, cadre et dos des cartes, logo, maison fortifiée). Une image pas encore livrée garde l’image actuelle.
- La case n’existe que sur le site GitHub et en local. `assets/art/` n’est pas envoyé sur itch.io (démo et jeu complet) : les joueurs gardent le style actuel.
- **v194 : premier lot** : les 150 cartes et les 12 zombies (illustrations portrait, découpées des planches de l’artiste) et le nouveau cadre portrait (`assets/art/ui/cadre.webp`, 1024 × 1536, fenêtre et extérieur rendus transparents). Avec ce cadre, `html.artx` change la mise en page de la carte (`src/style.css`, fin du fichier) : illustration dans la fenêtre, coût dans la gemme du haut, dégâts dans la gemme rouge, PV dans la noire, nom et texte sur le parchemin. Les planches sont en basse définition (~300 × 550 par carte) : v195 les agrandit ×4 avec `tools/upscale.py` (Real-ESRGAN, à partir des planches d’origine), puis les ramène à 720 px de large (WebP qualité 72, ~150 Ko par carte). Demander quand même les fichiers d’origine en haute définition, et le cadre avec sa transparence.
- **v196 : refonte de l’interface** d’après la maquette d’Amine (`html.artx` seulement, fin de `src/style.css`) : panneaux en encre sombre usée, titre en bandeau sombre avec un trait rouge, boutons en parchemin à texte noir, bouton principal rouge sang, onglets sombres (le choisi en rouge), interrupteurs rouges dans les Options, étiquette « Jour » en parchemin, fiche de nuit et main sans feutre vert. Police des titres et boutons : Oswald. Mêmes écrans et mêmes options qu’avant.
- Quand le style artiste sera validé : il deviendra le style par défaut, puis les anciennes images seront retirées (ou gardées en option « classique », au choix d’Amine).

## Le mode test (v130)

Bouton « Mode test » sur l'accueil, pour essayer cartes et nuits : on choisit la nuit de départ (1 à 60), Survivant et Maison des bois, deck de départ, énergie illimitée (99 par jour), 999 ferraille, toutes les cartes proposées à l'aube et au troc. Pendant le jour, « + Carte (test) » ouvre la liste de toutes les cartes (avec recherche) pour en mettre n'importe laquelle en main (8 au plus). Rien n'est enregistré : ni record, ni points, ni succès, ni bulles vues, ni sauvegarde de partie ; la partie en cours normale reste intacte.

**Progression simulée** (v134, cochée par défaut) : en partant de la nuit N, on reçoit 1 relique au hasard par nuit rouge passée (nuits 5, 10…), la horde a sa mutation instable (dès la nuit 6), et chaque survivant posé arrive avec N/6 niveaux (offensifs d'abord s'il attaque). Sans elle, une nuit 15 en test est bien plus dure qu'en vraie partie.

## Le tutoriel

**Tutoriel guidé (v163, revu en v164 avec Amine)** : la toute première partie (et « Rejouer la première nuit guidée » dans les règles) suit 4 journées guidées, puis la nuit rouge sans aide. Une bulle dit quoi faire, la carte à toucher et les cases visées brillent ; pendant ces 4 jours, seule l’action demandée est possible et seules les cases qui brillent l’acceptent (le plan reste intact). Les cartes de construction s’utilisent en entier (4 cases). Un lien « Passer le tutoriel » dans la bulle rend la partie normale. Depuis la v190, une main dessinée montre chaque geste : elle glisse de la carte (ou de l’unité à déplacer) vers la case visée le long d’un pointillé doré, puis la touche ; à l’étape de la nuit, elle tapote « Affronter la nuit ».

Idée : la maison devient un fortin à une seule porte, au nord. La horde arrive par les 4 routes et fait le tour jusqu’à la porte.

| Jour | Ce que fait le joueur | Ce qu’il apprend |
|---|---|---|
| 1 | Bûcheron au nord de la maison ; Barricade sur 4 cases : ouest, est et sud de la maison, et devant le Bûcheron | DPS au corps à corps, murs ; les zombies doivent frapper le Bûcheron (blessé à chaque fois) |
| 2 | Trousse de secours sur le Bûcheron ; Bûcheron décalé à gauche, barricade de devant déplacée à droite de la porte ; Policier dans la porte | soin, déplacement gratuit, Tank (provocation, recul), bonus du DPS à côté d’un Tank |
| 3 | Policier avancé d’une case ; Matériel lourd sur lui ; Tireur juste derrière lui ; Barbelés sur les 4 routes (à la sortie de la forêt) | première ligne, équipement, DPS à distance à couvert, piège sur chaque chemin |
| 4 | Barricade de droite avancée (elle protège le Tireur) ; Tireur décalé à droite ; Infirmière derrière le Policier | Soin, Escouade (annonce « Escouade ! ») |
| 5 | Libre : vraie nuit rouge | jouer seul |

```
Jour 4 (M maison, # barricade) :
. . P # .
. B I T .
. # M # .
. . # . .
```

- Le deck du tutoriel est le deck de départ plus Trousse de secours, Policier, Barbelés et Matériel lourd. Chaque jour, la main a le nombre normal de cartes : les cartes du jour y remplacent des cartes au hasard. À l’aube des nuits 1 à 3, la carte conseillée (Policier, Tireur, Infirmière) fait partie des 3 propositions et brille, avec une phrase qui explique la nuit passée.
- Règles du moteur (`Z.tutoOn`) : nuits 1 à 4 calmes, par les 4 routes, horde fixe (2, 3, 3, puis 4 Rôdeurs) ; nuit 5 = vraie nuit rouge, sans événement. Pas d’événement de l’aube pendant le tutoriel, et pas de trait « +PV » pour les survivants (le Bûcheron doit être blessé la nuit 1).
- Simulation (100 parties) : Bûcheron blessé la nuit 1 à chaque fois, une unité du tutoriel tombe dans 3 % des parties, escouade formée dans 98 %, maison tombée à la nuit rouge dans 2 %. Le Matériel lourd est au jour 3 (et non 4) : sans lui, le Policier avancé mourait 1 fois sur 5. Un test du moteur vérifie ce scénario sur 40 parties.
- Hors tutoriel aussi, la première escouade formée dans une partie est annoncée en grand (« Escouade ! +1 dégât (ou +1 soin) »).

## Le son

- Tous les sons sont générés en code (Web Audio, `src/audio.js`) : tirs différents selon l'arme, coups au corps à corps, morsures, coups sur l'abri, explosions, grognements, mort d'un survivant, carillon de l'aube, mutation.
- Ambiance de nuit : vent et grondement sourd dont le volume suit l'obscurité.
- Un bouton en haut coupe ou remet le son (choix mémorisé).
- Plus tard : remplacer par des sons d'un pack libre de droits si besoin.

## Le style graphique

**Face des cartes (v44)** : le cadre vide en métal rouillé généré par Amine (`assets/cards/frame.webp`, rivets, barbelés, fenêtre noire en haut, parchemin en bas) sert de gabarit unique. L'illustration de chaque carte se pose dans la fenêtre ; le jeu « imprime » à l'encre sur le parchemin (mode multiply, pour prendre la texture du papier) le nom en police machine à écrire, le texte d'effet, une ligne de pictogrammes monochromes (faction, rôle) avec le type, l'attaque (ou le soin) à gauche et les PV dans une goutte de sang à droite. Le coût est une pièce de métal patinée sur le coin de l'illustration ; la rareté, un petit losange sourd entre l'illustration et le parchemin. Pas d'emoji ni de couleurs vives sur la carte. **Effet qui sort du cadre (v42)** : chaque illustration a une version détourée (`<identifiant>_pop.webp`, fond transparent, faite automatiquement avec un outil de détourage) ; le personnage déborde par le haut et les côtés du cadre, jamais sur le parchemin. Réservé aux cartes très puissantes : les chefs légendaires et les évolutions secrètes. Sur toutes les illustrations, le personnage regarde le joueur (il « casse le 4ᵉ mur »). Dans la main, une version réduite sans le texte d'effet ; sur ordinateur, la carte survolée ou choisie s'affiche en grand à gauche.

**Illustrations des cartes (en test)** : une image par carte, générée par IA, **sans aucun texte ni cadre**, au format portrait 3:4 (768 × 1024), déposée dans `assets/cards/<identifiant>.webp`. Le jeu écrit lui-même le nom, le coût, les stats, la rareté, la faction et le rôle par-dessus, ce qui garde les mises à jour et la traduction faciles. Dans `src/game.js`, `ART_FILES` liste les cartes qui ont leur image, et `ART_TEST` applique une seule image à toutes les cartes pour essayer le rendu. Sans image, la carte garde son icône. À déclarer sur Steam (contenu généré par IA).


- Tout est dessiné en code, dans un seul style : contour sombre autour de chaque forme, ombre portée, ombrage, petits détails (sang, rouille, coutures), palette sombre et désaturée.
- Survivants : une silhouette commune vue de dessus, habillée selon le métier (tenue, couvre-chef, arme, accessoire) avec une couleur de peau variable.
- Zombies : une silhouette commune, chaque type a sa taille, sa peau, ses vêtements et un détail reconnaissable (casque du blindé, pustules du gonflé, os du Colosse…).
- Décision : un pack Kenney a été essayé puis retiré (style trop « cartoon »). Aucun pack du marché ne couvre 16 survivants, 9 zombies, défenses, pièges et décors dans un même style. Pour la sortie Steam, un artiste pourra tout redessiner en partant de ce style.

## Les cartes spéciales (v181)

Des versions rares des unités, à collectionner (comme les cartes dorées de Hearthstone). Une carte spéciale est une carte à part dans la collection, rangée juste après sa carte normale (Boucher, Boucher Dorée…). Elle reste cachée tant qu’elle n’est pas gagnée. Seules les unités (tireurs, corps à corps, soutien) en ont.

| Édition | Effet | Cartes | Comment l’obtenir |
|---|---|---|---|
| Dorée | +1 dégât | unités qui attaquent | 500 zombies tués par ce type de carte, toutes parties confondues |
| Blindée | +50 % de PV | toutes les unités | une unité de ce type survit 20 nuits d’affilée sur le terrain (une blessure remet le compte à zéro) |
| Ensanglantée | récupère 1 PV par zombie tué (2 pour le Boucher, qui s’ajoute à son effet) | unités qui attaquent | 20 passages en convalescence, toutes parties confondues (la nuit de la défaite ne compte pas) |
| Fantôme | ne compte pas dans la limite d’unités (2 au plus) | toutes les unités | tirage en fin de partie |
| Holographique | +1 ferraille par zombie tué | unités qui attaquent | tirage en fin de partie |

- **Tirage en fin de partie** : 1 % de chance par nuit survécue (30 % pour une victoire), sur une unité jouée pendant la partie, Fantôme ou Holographique au hasard. Garantie après 10 parties sans tirage gagnant. La carte tirée prend la place d’une des 3 cartes de l’écran de récompense (v183) : elle fait partie du choix.
- **Deck** : 1 exemplaire d’une carte spéciale, une seule spéciale par carte (Boucher Dorée ou Boucher Fantôme, pas les deux), 5 spéciales au plus. Elle compte dans la limite d’exemplaires de sa carte (rare ×2 : 1 Boucher Dorée + 1 Boucher).
- **En partie** : posée, l’unité garde son édition (pion avec halo ou anneau). Fusion et évolution gardent l’édition ; quand l’unité tombe, la carte spéciale revient dans la défausse. Pas de spéciales ni de progression en défi du jour, en démo et en mode test (les spéciales y redeviennent des cartes normales).
- Technique : la carte s’écrit `type~éd` (`butch~dor`, `arm`, `fan`, `holo`, `sang`) ; ces cartes existent dans `Z.U` sans apparaître dans les listes. Sur le terrain, l’unité garde son type et porte `u.ed`. Sauvegarde : `META.eds` (gagnées), `META.edp` (progression), `META.edMiss`.

## L'historique des décisions

- Premier concept « Blackout » (garder une ville alimentée en électricité) : abandonné, jugé pas assez intéressant.
- Le thème de survie zombie a été retenu.
- Une version en cartes et icônes a été jugée trop abstraite : passage à une carte visuelle avec une nuit animée en temps réel, en gardant les cartes pour la construction le jour.
- Le développement se fait à 100 % avec Claude Code.
- Deck de départ réduit à 8 cartes par personnage : avec 40 cartes, un deck complet dès le départ rendrait les parties toutes pareilles.
- La carte choisie à l'aube arrive d'office dans la main du lendemain (demande d'Amine).
- Une seule monnaie (la ferraille) pour le troc : plusieurs ressources seraient trop lourdes sur petit écran.
- Trajets variés et contournement des murs : avant, deux murs à gauche et à droite de la maison bloquaient presque toute la horde.
- Survivants nommés, avec trait et mort définitive : identité du jeu pour Steam (on s'attache, on raconte ses parties).
- Énergie (4 par jour, cartes à 0-3) à la place de « 2 cartes par jour », main conservée d'un jour à l'autre et déplacement d'une unité par jour (Amine : 2 cartes ne laissaient pas de vraie stratégie).
- 8 factions avec un Chef légendaire, à la place des 6 familles.
- Collection permanente et decks construits avant la partie (Amine : plus de stratégie de deck). Deck de 30 cartes au maximum plutôt que 40, pour que la stratégie ne se dilue pas.
- Réactions de nuit, familles et choix de la nuit (rejouabilité et décisions). PV des zombies −25 % (Amine : trop dur), puis +25 % et choix de la nuit rendu rare (1 aube sur 4).
- Amine teste lui-même l'équilibrage ; la simulation n'est plus lancée à chaque changement.
- PV des zombies doublés une seconde fois (Amine était invincible à la nuit 15). Le bot tombe alors vers la nuit 4 : il joue nettement moins bien qu'Amine, la simulation sert surtout à comparer.
- Zombies deux fois plus coriaces mais 40 % moins nombreux (Amine : « les zombies meurent avant d'atteindre mes unités »). Avant, seuls 26 % arrivaient au contact.
- Mutations de la horde toutes les 4 nuits plutôt qu'une gestion de nourriture ou de munitions (demande d'Amine : garder le jeu fun et simple). Elles répondent au problème de l'« armée de tireurs » invincible dès la nuit 5.
- Passage en survie sans fin (demande d'Amine : le jeu finissait trop vite et était trop facile). Ferraille plus rare à dépenser (prix ×2 à ×3), améliorations plus chères à chaque fois, reliques toutes les 5 nuits, rareté des cartes.

- Fusion ×3, évolutions secrètes et niveaux par victimes (demande d'Amine, inspirés des jeux à succès du genre), plus un retour visuel plus fort. Les mutations restent permanentes et cumulatives.
- Premier lot d'illustrations intégré (v44) : 77 cartes, 10 cartes de zombies (bestiaire), nouveau cadre ; sprites générés inutilisables (texte et fond incrustés), le plateau reste dessiné en code.
- Toutes les cartes illustrées (v45) : les 26 manquantes viennent d’un collage (basse résolution, à refaire une par une avant Steam). Premiers sprites vus du dessus (`assets/sprites/<id>.webp`, fond transparent, tournés vers la droite) : Tireur, Barricade, Piège à loup, Rôdeur. Un sprite remplace le dessin en code dès que son image est chargée, sinon le dessin en code reste.
- Sprites (v46) : 75 sprites branchés depuis une planche ChatGPT (basse résolution, environ 120 px chacun). Deux familles : vus du dessus (tournés vers la cible) et vus de 3/4 face caméra (restent droits, se retournent gauche/droite). Les murs se posent en travers de la route, les objets et pièges ne bougent pas. Restent dessinés en code : fen, sht, xbow, mg, molo, kid, swat, hunter, doc, chief_police, axe, monk, riot, k9, pitch, amb, orderly, mech, lead, carp, Chien infecté, Sapeur, Colosse.
- Netteté (v50) : les 31 illustrations en basse résolution (collage et planche des héros) sont agrandies ×4 avec Real-ESRGAN (`tools/upscale.py`), qui reconstruit les détails au lieu de flouter. À refaire en vraie pleine résolution avant Steam si possible.
- Style cartoon (v51-v52) : 98 cartes et 9 zombies cartoon dans `assets/cards_cartoon/`, activables par le bouton « Style des cartes » de l’écran d’accueil (mémorisé sur l’appareil). Les cartes sans image cartoon gardent l’illustration réaliste.
- Sprites cartoon (v53) : 94 sprites vus strictement du dessus (`assets/sprites_cartoon/`), personnages et zombies tournés vers le bas dans l’image, le jeu les fait pivoter vers leur cible. Ils suivent le bouton « Style graphique » de l’accueil ; les sprites manquants (épave, porte, brasero, fortin) gardent la version réaliste.
- Inventaire (v54) : 7 cartes cartoon manquantes comblées avec des images en trop (Fortin, Tourelle automatique, Traqueur, Brasero, Dynamite, Piège à ours, Colosse) et sprite du Fortin. Les images cartoon inutilisées sont rangées dans `assets/extras/` (cartes, sprites, tuiles de sol) pour de futures mises à jour ; le jeu ne les charge pas.
- Cadre usé d'Amine adopté pour toutes les cartes, écriture et symboles à l'encre pour se fondre dans le parchemin (demande d'Amine).
- Cartes au design complet façon Hearthstone, écriture intégrée à la carte (demande d'Amine).
- Portée en losange et portées longues à 4, nouveau zombie Sapeur qui fait sauter les murs (demande d'Amine).
- Rôles Tank / Soin / DPS avec provocation à 3 cases et escouades, remparts redessinés (demande d'Amine).
- Zombies qui calculent leur chemin (contourner ou casser au plus faible), murs voisins fusionnés en remparts, Fortin = Épave + Bunker (demande d'Amine).
- Cartes de construction réutilisables dans la journée puis défaussées le soir, glisser-déposer des cartes, plus aucune portée illimitée (demande d'Amine).
- Carte 9 × 9, murs tracés en ligne (1 énergie par case en plus), portées réduites ; le jeu vise d'abord Steam (PC), en restant jouable sur téléphone (demande d'Amine).
- Zombies ordinaires +20 % de PV (le Colosse non : il était déjà la cause des défaites), munitions anti-Colosse au troc, compte à rebours, Lance-roquettes (demande d'Amine : début trop facile, mort systématique au Colosse).
- Pause en pleine nuit réservée à la nuit du Colosse (2 vagues), avec déplacements libres pendant la pause (demande d'Amine).
- Le deck est fermé pendant la partie : plus aucune carte ajoutée (l'aube propose 3 cartes de sa propre pioche pour la main du lendemain, plus d'achat de carte au troc, la Nuit de pillage et les événements donnent de la ferraille, des soins ou un survivant). Héritage relevé à 100 victimes (demande d'Amine).
- Très grosses nuits en 3 vagues avec pause, alliances entre factions, murs reliés, héritage des survivants tombés (demande d'Amine).
- Solidarité entre voisins de même faction, riposte et renfort du corps à corps, combattants pour les Soignants, les Bricoleurs et la Communauté (Amine : des factions ne pouvaient pas se défendre, le corps à corps était injouable).
- Frénésie meurtrière dès la nuit 8 et fusions à plusieurs étoiles (demande d'Amine : difficulté toujours croissante, mais le joueur garde une chance dans les longues parties).

## Les questions ouvertes

- Prochaines étapes déjà proposées : lieux (ferme, station-service, centre commercial), déblocages entre les parties, niveaux de difficulté, défi quotidien, succès Steam, tutoriel, journal de fin de partie, expéditions, survivants qui demandent asile, choix entre deux nuits, synergies visibles.

- Lieux différents d'une partie à l'autre (ferme, station-service, centre commercial) ?
- Le nom définitif du jeu.

**v56**
- Équilibrage : tous les DPS à distance gagnent +1 de portée, tous les DPS au corps à corps +2 dégâts par coup (textes des cartes mis à jour).
- Cartes (v58) : faction et rôle imprimés à l’encre en bas de la carte, entre les dégâts et les PV, à côté du type ; le rôle est en couleur (bleu = tank, vert = soin, rouge = DPS). Visibles aussi sur les petites cartes de la main.
- Collection et éditeur de deck : recherche par nom ou texte, tri (type, coût, rareté, nom, faction), filtre par faction, et dans la collection filtre débloquées / à débloquer.
- Murs construits (v57) : dessinés en code avec leur propre matériau (bois, sacs de sable, pneus, béton rayé, tôle, acier, épave rouillée). Des murs voisins se raccordent automatiquement par une section continue (moitié du matériau de chacun), avec des poteaux aux extrémités et aux angles ; un mur seul est un tronçon en travers de la route.

**v59** : la nuit s'affiche plus lentement (un tour dure 650 ms au lieu de 430 ms à vitesse ×1). Purement visuel, les règles et l'équilibrage ne changent pas ; les vitesses ×2 et plus restent disponibles.

**v60 : la construction compte**
- Les zombies sortent de la forêt uniquement par les 4 routes (milieu de chaque bord). Le reste du bord est la forêt : ils ne peuvent pas y marcher. Une ligne de 3 murs juste devant une route la ferme vraiment : les zombies doivent la casser. Placer ses murs devient un choix tactique (quelles routes fermer, lesquelles laisser en couloir de tir). Les lieux à côtés limités et les nuits « d'un seul côté » n'utilisent que les routes concernées.
- Constructions à tracer (v61 : barricade, épave, clôture, sacs de sable, pneus, barrières, mur modulaire, barbelés) : une carte donne 4 cases pour la journée, pour le prix de la carte. On les pose comme on veut, une par une ou d’un glissé en ligne, tant qu’il en reste. La carte part à la défausse quand ses 4 cases sont posées, ou le soir. Plusieurs exemplaires de la même carte additionnent leurs cases. Les autres pièges restent en main la journée et se reposent à leur prix normal.
- Ambiance de nuit : musique de nuit (v192, nappe générée en code en secours), hiboux, loups au loin, grognements de zombies et craquements de branches, au hasard ; le volume suit l'obscurité (sons générés en code).

**v62** : constructions à tracer = Barricade, Clôture électrique, Sacs de sable, Pneus, Barrage de police, Mur modulaire, Barbelés (l'Épave n'est plus traçable : elle se pose à l'unité et se fond quand même dans les remparts). Toutes sont dessinées en code, jamais en sprite, quel que soit le style graphique, pour que les tracés se raccordent de façon cohérente : la clôture électrique devient un matériau de rempart (poteaux, 3 fils, étincelles si le courant passe) ; les barbelés voisins se relient en une ligne continue de rouleaux avec piquets aux bouts et aux angles.

**v63 : équilibrage**
- Objectif : tir ≈ 1 dégât par tour et par énergie, corps à corps ≈ 2.
- Chiens : Chien 2 × 2 dégâts, coût 2 ; Chien policier 2 × 1 + étourdit, coût 1 ; Meute 4 × 2, coût 3 ; Brigade canine 2 × 3.
- Tireurs : Tireur et Tourelle bricolée 2 dégâts/tour ; Chasseur et Garde champêtre 2 dégâts à chaque tour ; Arbalète 2 × 2 zombies à chaque tour, coût 3 ; Sniper 5 dégâts tous les 2 tours ; Mitrailleuse s'enraye 1 tour sur 4.
- Construction : Barricade, Sacs de sable et Clôture coûtent 2 ; Épave coûte 2 ; Pneus, Barrage et Mur modulaire donnent 3 cases par carte (4 pour les autres) ; Barbelés restent à 1.
- Zombies : +50 % de PV, intégrés aux PV de base (v64, plus de bonus séparé) : Rôdeur 17, Coureur 12, Gonflé 45, Chien zombie 6, Rampant 12, Cracheur 17, Blindé 29, Hurleur 23, Sapeur 18 ; Colosse inchangé (112).

**v65**
- Le Colosse : 58 PV au lieu de 112 (deux munitions anti-Colosse suffisent à l'abattre).
- Frénésie meurtrière : à partir de la nuit 4, chaque nuit ajoute +10 % de PV et de dégâts à tous les zombies (+10 % nuit 4, +20 % nuit 5… +60 % nuit 9). Elle n'est plus liée aux mutations.
- Plus de choix de la nuit à affronter : la nuit suivante est toujours imposée.

**v66 : les combos se construisent, la horde suit**
- Principe : pas de plafond aux combos. Le joueur doit pouvoir suivre la montée des zombies en construisant ses combos au fil des nuits, sans la dépasser trop tôt.
- Les bonus de dégâts (faction, solidarité, voisins, niveaux, étoiles, traits…) comptent une fois par attaque : pour une unité à plusieurs tirs ou morsures, ils sont répartis entre les coups.
- Paliers de faction à 4, 6 et 8 unités (au lieu de 3 et 5). Nouveau palier 3 : +1 dégât pour toute la faction. Un Chef donne toujours +1 palier (jusqu'au palier 3).
- Solidarité sans limite : +1 par voisin de la même faction (au lieu de +2 au maximum).
- Frénésie meurtrière multiplicative : dès la nuit 4, PV et dégâts des zombies ×1,08 par nuit, cumulatif (+17 % nuit 5, +71 % nuit 10, +152 % nuit 15, +270 % nuit 20).

**v67 : équilibrage V1 (survie infinie honnête)**
- Principe : aucune nuit impossible, aucun multiplicateur exponentiel. La difficulté vient du nombre de zombies, de leur variété, des mutations, des événements, de la pression sur plusieurs routes et des brèches. Pas de plafond aux combos, pas d'adaptation cachée au build du joueur.
- Frénésie meurtrière supprimée.
- PV des zombies : PV de base jusqu'à la nuit 3, puis +8 % des PV de base par nuit (additif, arrondi au-dessus). Rôdeur : 17 → 27 (nuit 10) → 41 (20) → 81 (50).
- Dégâts des zombies : +1 toutes les 20 nuits.
- Nombre de zombies après la nuit 10 : croissance doublée (Rôdeur +1,2 par nuit…). Nuit de pression toutes les 5 nuits : +25 % de zombies.
- Mutations toutes les 5 nuits, au hasard, cumulables : Peau épaisse +15 % PV, Horde nombreuse +15 % de zombies, Enragés +1 dégât, Carapace −1 dégât subi (max −3), Régénération +1 PV/3 tours par cumul, Putréfaction +1 dégât par cumul, Pas pressés (jusqu'à 1 case par tour).
- Brèche : quand un zombie blesse l'abri, tous les autres avancent aussitôt d'une case (une fois par tour).
- L'événement de la nuit est connu dès le matin (déjà le cas).
- Niveaux : 20 kills, puis 25, 30, 35… de plus, sans plafond. Fusion : +120 % des PV de base par étoile (au lieu de +100 %).
- Solidarité : +1 dégât par paire de voisins de la même faction.
- Zones limitées : Fusil à pompe 4 zombies max, Lance-flammes lourd 6 max, Frappe aérienne 10 dégâts en rayon 2 autour de la case visée.
- Mitrailleuse 2 × 3, s'enraye 1 tour sur 3. Chien policier : seule la 1ʳᵉ morsure du tour étourdit. Une seule réparation par case et par tour.
- Constructions : Barricade 7, Sacs 6, Barrage 7, Épave 14, Bunker 16, Porte 18, Fortin 32 PV.
- Colosse : 58 PV à la nuit 10, puis +8 % de ses PV par nuit (88 à la nuit 20). Munition : 15 + 25 % de ses PV max.
- Communauté palier 2 : la 1ʳᵉ carte de chaque jour coûte 1 énergie de moins (au lieu de +1 énergie par jour).

**v68** : 5 énergie par jour au lieu de 4.

**v69 : remparts sans partage des PV**
- Chaque mur garde ses PV : le mur que le zombie frappe encaisse le coup (avant, le mur le plus solide du rempart encaissait tout, donc tous les murs baissaient ensemble et tombaient d'un coup).
- Bonus de liaison : chaque mur gagne +1 PV max par mur voisin relié, jusqu'à +3. Le bonus s'ajoute à la pose et se perd quand un voisin tombe.
- Sapeur : 15 dégâts au mur frappé, le surplus passe aux murs reliés les plus proches.
- Une barre de vie par mur ; l'usure et les brèches se dessinent mur par mur. Les zombies visent toujours le point le plus faible (calcul de chemin inchangé).

**v70** : mise à jour automatique. `version.txt` contient le numéro de la dernière version ; au lancement, si la page chargée est plus ancienne (cache de GitHub Pages ou du téléphone), le jeu se recharge avec une adresse neuve qui contourne les caches (une seule tentative par version).

**v71** : un zombie repoussé (Policier, Klaxon…) n'est plus projeté dans la forêt : contre la lisière, il reste sur place (bug trouvé par les nouveaux tests automatiques, `node tools/test.js`).

**v72** : portée de toutes les unités qui tirent réduite de 1 (Tireur 2, Sniper 4, Mortier 4, Fusil à pompe 1, Médecin de garde, L’Ingénieur et Le Maire au contact…), car le début était trop facile.

**v73** : la stratégie passe avant la quantité.
- **Limite d’unités** : au plus 5 unités sur le terrain (tireurs, corps à corps, soutien, chefs, évolutions), +1 toutes les 10 nuits. Murs et pièges sont illimités. Une pose qui déclenche une fusion ou une évolution reste permise à la limite.
- **Rappel** : le jour, une unité peut être rappelée dans la réserve. Elle garde ses PV, niveaux, étoiles, prénom et trait, ne compte plus dans la limite et se repose gratuitement quand on veut.
- **Déplacement libre** : le jour, tout ce qui est posé (unités, murs, pièges) se déplace sans limite. Les murs recalculent leur bonus de liaison.
- **Factions** : paliers à 2, 3 et 5 unités (avant 4, 6, 8). Seules les unités comptent, pas les murs ni les pièges. Palier 3 (équipe complète) : +1 dégât et +2 PV pour toute la faction. Alliances dès 2 unités dans chaque faction.
- **Frénésie meurtrière douce** : moins de zombies en plus chaque nuit (croissance divisée par 2), mais dès la nuit 4 leurs PV montent de 12 % des PV de base par nuit (avant 8 %) et leurs dégâts de +1 toutes les 10 nuits (avant 20). Croissance linéaire, jamais exponentielle. Affichée dans la barre « Cette nuit ».

**v74** : un zombie encore dans la forêt (anneau extérieur) ne peut être ni ciblé ni blessé, par rien (tirs, explosions, réactions, munitions). Il faut qu’il entre sur la carte. Les Cracheurs ne crachent pas depuis la forêt.

**v75** : à l’aube, la carte à prendre en main est choisie uniquement dans la pioche (plus dans la défausse).

**v76** : 33 nouvelles cartes de logistique, toutes illustrées avec les images cartoon de réserve (`assets/extras`). Pas de nouvelle unité : elles attendent leurs sprites.
- **Équipements** (objets posés sur une unité, ils y restent même rappelée ; un seul exemplaire de chaque par unité ; icône sur l’unité) : Matériel lourd (+4 PV, Tank bloque 1 coup sur 2), Jumelles (tireur : +1 portée, +1 dégât au-delà de 2 cases), Bandages (+1 PV par kill), Sacoche de soins (soigne 1 PV à un voisin tous les 2 tours), Lampe torche (ignore le Brouillard, +1 dégât sur un zombie intact), Pilules (survit une fois par nuit avec 4 PV), Sac à dos (+1 ferraille par kill de la nuit), Ruban adhésif (unité fusionnée : +1 dégât par étoile), Clés du dépôt (l’unité ne compte plus dans la limite).
- **Postes de soutien** (nouveau type, hors limite d’unités, effet non cumulable : une unité profite d’un seul poste de chaque sorte) : Poste de secours (1 PV tous les 4 tours aux unités voisines), Caisse de munitions (+1 dégât aux tireurs voisins), Mirador (+1 portée aux tireurs voisins), Tranchée (−1 dégât reçu par les unités voisines), Pompe à eau (soin complet à l’aube des voisines), Projecteur de chantier (+1 dégât sur les zombies à 2 cases), Établi (répare les défenses voisines).
- **Défenses** : Palissade (à tracer, 6 PV, pieux : 1 dégât au zombie qui frappe), Grille métallique (10 PV, se répare), Gabions (12 PV, un Sapeur ne lui fait que 5 dégâts).
- **Pièges** : Tronc oscillant (5 dégâts et recul de 2, 3 fois par nuit), Fosse piégée (tue le 1ᵉʳ zombie ordinaire, puis ralentit), Verre brisé (saignement 3 tours), Boîtes de conserve (alerte : +1 dégât aux tireurs 3 tours), Éboulement (6 dégâts en zone).
- **Objets** : Ravitaillement (+6 ferraille), Largage (pioche 3 cartes), Jerrican (+2 énergie demain), Repos (soigne la réserve), Opérateur radio (+1 à la limite d’unités, une fois par partie).
- **Réactions** : Talkie-walkie (relève une unité blessée par la plus solide de la réserve), Orage (zombies −2 tours, le feu s’éteint), Bombardier (8 dégâts sur toute une ligne), Boîte à bruit (les zombies marchent vers la case visée 4 tours).
- En style réaliste, ces cartes affichent leur illustration cartoon (pas d’image réaliste).

**v77** : le style cartoon devient le seul style (le bouton « Style graphique » disparaît). Les 4 cartes sans illustration cartoon (Mur de pneus, Fumigène, Café, Filet) gardent leur image réaliste en attendant.

**v78** : table de jeu. La main est posée sur une table en bois, entre la **pioche** (à gauche, dos de carte et nombre restant) et la **défausse** (à droite, dernière carte visible). Les unités rappelées forment un tas **Réserve** sous la pioche. Toucher un tas montre son contenu (la pioche dans le désordre). Animations : les cartes piochées glissent de la pioche vers la main, les cartes jouées ou tombées volent vers la défausse, et la défausse revient dans la pioche quand celle-ci est vide.

**v79** : affichage en largeur et plein écran.
- Dès que l’écran est plus large que haut (PC, tablette, téléphone tourné), la carte occupe toute la hauteur à gauche et l’interface passe à droite (barre du haut, nuit, horde, factions, info, table de jeu, bouton de nuit). Sur PC, la carte choisie s’affiche en grand dans le panneau de droite et la main passe sur 2 rangées. En hauteur, l’affichage reste en colonne.
- Bouton plein écran (Android, PC). Sur iPhone, le jeu s’installe comme une application via « Partager → Sur l’écran d’accueil » (manifeste, icône de l’abri, ouverture en plein écran) ; un rappel s’affiche sur l’écran d’accueil du jeu.

**v80** : en largeur, le panneau de droite a une largeur fixe (330 px sur téléphone tourné, 440 px sur PC, 520 px sur très grand écran) et l’aire de jeu prend tout le reste : la carte grandit autant que la hauteur le permet, et une forêt dessinée (routes comprises) prolonge le plateau jusqu’aux bords. La carte choisie s’affiche en grand dans le panneau de droite, ou dans le coin de la forêt sur téléphone tourné quand la place manque.

**v81** : en largeur, le plateau prend d’abord toute la hauteur ; la place restante va au panneau de droite (au moins 330 px sur téléphone tourné, 440 px sur PC, au plus 900 px), la forêt ne remplit que ce qui dépasse. Les cartes en main grandissent avec le panneau (jusqu’à 118 px, sur 1 ou 2 rangées). Sur téléphone tourné, la carte choisie s’affiche en grand dans le panneau, à la place des lignes nuit / horde / factions.

**v82 : tri des systèmes** (pour qu’un nouveau joueur comprenne le jeu en jouant ; environ 11 règles au lieu d’une vingtaine).
- **Frénésie meurtrière** : PV de base jusqu’à la nuit 9, puis +10 % à la nuit 10 et +10 % de plus à chaque nuit (nuit 15 : +60 %). Dégâts : +1 toutes les 10 nuits.
- **Factions** : 2 paliers, à 2 survivants (bonus propre à la faction) et à 5 survivants (second bonus et équipe complète : +1 dégât et +2 PV). Seuls les survivants comptent (humains et chiens) : ni les constructions, ni les machines. Le Chef compte pour 2.
- **Retirés** : les alliances (elles poussaient à mélanger les factions), la solidarité (doublon), l’héritage (presque jamais vu), le bouton et le stock de munitions anti-Colosse.
- **Escouade** : seule règle de rôles restante. Un Tank, un Soin et un DPS voisins gagnent chacun +1 dégât (ou +1 soin). Plus de bonus « DPS à côté d’un Tank » ni de « soin double sur un Tank ». Le Tank garde sa provocation et son blocage.
- **Unités et postes** : une unité est un survivant ou une machine qui combat ou soigne (elle compte dans la limite). Les bâtiments sans survivant deviennent des postes de soutien hors limite : Projecteur, Radio, Sirène, Panneau solaire, Hôpital de campagne, Épouvantail, Atelier, Marché. Postes en double retirés : Caisse de munitions (doublon du Projecteur), Poste de secours (de l’Hôpital), Établi (de l’Atelier). Les postes n’ont pas de rôle.
- **Une seule règle de réutilisation** : seules les cartes à tracer (murs en ligne, barbelés, palissade) restent en main pour leurs N cases de la journée. Les autres constructions se jouent comme une carte normale et reviennent à la défausse quand elles tombent.
- **Nuit rouge** : toutes les 5 nuits, +15 % de zombies (v132, calculés sur le total : l'arrondi type par type faisait monter l'ancien +25 % à +40 %), puis à l’aube une mutation et une relique (annoncée dans la barre « Cette nuit »).
- **Munition anti-Colosse** : une carte réaction (achetée au troc, elle arrive en main) qui frappe le Colosse sur la carte.
- **Événements de l’aube** : environ 1 aube sur 4 (au lieu de presque 1 sur 2).

**v83** : soins. Les soigneurs ne soignent plus que les unités (les murs sont pour les réparateurs : Mécanicien, Atelier, Charpentier, Outils). Deux familles : **soin à distance** (Infirmière portée 2, Brancardier portée 3, La Doctoresse portée 2 ; portée affichée en vert) et **soin au contact** (Pharmacienne, Hôpital de campagne, Cantine, Sacoche de soins : les 8 cases autour). La Trousse de secours et les soins de l’aube des Soignants ne visent plus que les unités.

**v84** : les réparateurs (Mécanicien, Atelier, Charpentier, L’Ingénieur) réparent aussi les postes de soutien, pas seulement les murs. Textes des Chefs mis à jour (« compte pour 2 » au lieu de « gagne un palier »).

**v85** : le Colosse ne détruit plus une défense d’un coup. Il fait 10 dégâts par coup aux défenses, postes et unités à la nuit 10, +2 toutes les 10 nuits (12 à la nuit 20, 14 à la nuit 30). Le Tank peut bloquer ses coups (1 sur 3). Il reste très lent, fonce tout droit, ignore la provocation et le recul, et frappe l’abri sans mourir.

**v86 : rythme de la horde et convalescence.**
- **Nombre de zombies** : il monte jusqu’à la nuit 10. Après chaque Colosse, une **nuit de répit** (nuits 11, 21, 31…) a 30 % de zombies en moins, puis le nombre remonte. Au-delà de la nuit 10, la croissance est logarithmique (de plus en plus lente), jamais exponentielle.
- **Frénésie meurtrière** : un niveau de plus après chaque Colosse, cumulable (niveau 1 dès la nuit 11, 2 dès la nuit 21…). Chaque niveau : +60 % des PV de base et +1 dégât pour tous les zombies, Colosse compris. C’est elle qui porte la difficulté, plus le nombre.
- **Mutations** : toutes les 5 nuits, une nouvelle mutation remplace la précédente, comme un affixe. Une seule active à la fois.
- **Convalescence** : une unité qui tombe pour la 1ʳᵉ fois part blessée en réserve. Elle garde étoiles, niveaux, prénom, trait et équipements, ne peut pas être reposée le lendemain, et revient avec tous ses PV le surlendemain. Elle garde une cicatrice : à la chute suivante, elle meurt pour de bon (mémorial). La carte Repos guérit les blessés tout de suite ; le Talkie-walkie ne peut pas faire entrer un blessé.

**v87** :
- **Convalescence de 3 nuits** : une unité tombée la nuit N revient au jour N+4, avec tous ses PV.
- **Route du Colosse** : pendant la pause de sa nuit, sa route s’affiche en rouge (flèche animée de la route jusqu’à l’abri).
- **Conseils au bon moment** : une bulle, une seule fois par joueur, la première fois qu’une situation arrive (fusion, évolution, bonus de faction, équipe complète, escouade, limite d’unités, poste, équipement, unité blessée, nuit rouge, Colosse, pause, nuit de répit, mutation). Les cartes, elles, se débloquent déjà progressivement (22 au départ, les autres achetées avec les points).
- **Sensations** : chiffres de dégâts plus gros et orange à partir de 10 (avec secousse), éclaboussure et anneau à chaque mort, éclair et secousse à la mort des gros zombies, secousse plus forte quand l’abri est touché.

**v88** : premiers sons enregistrés. 30 grognements de zombies (OpenGameArt, CC0 : artisticdude et saturn91), dans `assets/sounds/` (236 Ko au total, sources dans `CREDITS.md`). Ils remplacent les grognements générés (début de vague, Hurleur, ambiance de nuit) et accompagnent la mort des zombies, avec une hauteur au hasard. Si un fichier manque, le son généré reprend le relais.

**v89** : images manquantes et 6 nouveaux survivants (sprites de la planche cartoon, illustrations de la réserve).
- Illustrations cartoon de Mur de pneus, Fumigène, Café et Filet (objets posés sur un fond de nuit flou tiré des autres cartes) ; sprite cartoon du Brasero.
- **Maître-chien** (Police, Tank, 12 PV, 2 dégâts) : les chiens voisins font +1 dégât.
- **Soudeuse** (Bricoleurs, réparatrice) : répare 2 PV par tour à une défense ou un poste voisin.
- **Éclaireur** (Trappeurs, DPS, portée 4, 2 dégâts) : marque le zombie touché 2 tours (+1 dégât de chaque coup).
- **Assassin** (Militaires, DPS, 3 dégâts au contact) : toutes les 4 attaques, tue d’un coup un zombie ordinaire (jamais le Colosse).
- **Infirmière de campagne** (Soignants, soin à distance portée 2) : à l’aube, les unités en réserve non blessées récupèrent 2 PV.
- **Électricien** (Bricoleurs) : plus de coupure de courant et clôtures à 2 dégâts tant qu’il est sur la carte ; répare 1 PV par tour.

**v90** : sons d’interface enregistrés (Kenney Interface Sounds, CC0) : toucher une carte, poser une carte, fusion, niveau, évolution, rappel en réserve. Les tirs, explosions et coups restent générés en attendant un pack d’armes.

**v91** : tirs, sniper, fusil à pompe, explosions, coups au corps à corps, impacts sur les zombies, morsures, coups sur l’abri et défenses détruites utilisent des sons enregistrés (Kenney Impact Sounds et 25 CC0 bang SFX), avec une hauteur au hasard. Lecture par Web Audio sur le site (léger même avec beaucoup de tirs), lecteur audio classique en fichier local, son généré en secours.

**v92** : écran d’options (accueil et écran de la partie) : langue (français ; anglais en préparation), volume des effets sonores, volume de la musique et de l’ambiance, vitesse de la nuit au départ (×1, ×2, ×4 ; le bouton de vitesse passe de ×1 à ×2 puis ×4), secousses de l’écran, texte plus grand. Réglages enregistrés sur l’appareil. Textes de l’accueil mis à jour (convalescence, équipe complète au lieu des alliances).

**v93** : nettoyage et aspect jeu de société.
- Les images réalistes (cartes, sprites, zombies : environ 11 Mo) sont archivées dans `archive/realiste/` et ne sont plus chargées. Le cadre des cartes passe dans `assets/ui/`. 4 évolutions (Lance-flammes lourd, Équarrisseur, Bande de gamins, Le Saint) gardent leur ancienne image en attendant une version cartoon.
- Jeu de société : table en bois sous le jeu, plateau encadré (bois) avec ses cases imprimées, unités et postes en pions de carton (face crème, liseré de la couleur du type), zombies sur socles de figurines, énergie en cubes de bois, événement de la nuit sur une bande de papier, main sur un tapis de feutre vert. En largeur, le plateau est posé sur la table (plus de forêt prolongée).

**v95** : haut de l’écran en éléments de jeu de société. **Fiche de nuit** en papier : l’événement, des jetons ronds de zombies (tête et nombre), un jeton de frénésie, et un tampon « Nuit rouge », « Répit » ou « Colosse » ; la toucher ouvre le détail de la nuit. **Piste des nuits** : 10 cases de la dizaine en cours, un pion sur la nuit actuelle, cases rouges (nuits rouges), vertes (répit) et tête de mort (Colosse). **Jetons** : mutation (violet, à toucher pour lire son effet), ferraille (pièce), unités et factions en jetons de carton.

**v96** : essai de pions illustrés (image de la carte) à la place des sprites, abandonné à la demande d’Amine : les sprites cartoon vus du dessus font déjà penser à des pions de jeu de plateau, on les garde. Correction : la nuit, le tampon de la fiche (« Colosse »…) ne chevauche plus le texte de l’événement.

**v97** : plateau homogénéisé en jeu de plateau. Tous les pions reposent sur un **socle de carton** commun (épaisseur, ombre, liseré) : rond crème liseré de la couleur du type pour les survivants, rond rouge sang pour les zombies (Colosse plus vif), carré pour les postes et les murs isolés, tuile plate pour les pièges. L’abri est posé sur une grande tuile carrée. Les noms sont imprimés sur de petites étiquettes de papier. Les sprites restent ceux d’origine.

**v98** : plateau plus épuré, à la demande d’Amine. Les pièges n’ont plus de socle (ni de halo) : seuls les survivants, les zombies, les postes et l’abri ont le leur. Les jetons de faction utilisent les pictogrammes à l’encre des cartes au lieu des émojis (aussi dans l’aide et la liste des cartes ; le texte de l’accueil sur les factions est mis à jour). La fiche de nuit devient une tuile de plateau : carton épais, cadre imprimé, rivets aux coins, titre sur une plaque sombre et jetons posés dans une zone imprimée « La horde ».

**v99** : nouveau gabarit de carte fourni par Amine (`assets/ui/cadre.webp`), plus cartoon et jeu de société : cadre d’ardoise à liseré doré, rivets, fenêtre d’illustration à coins coupés et cartouche de parchemin. Le cadre est posé par-dessus l’illustration (fenêtre transparente) ; nom, texte et stats sont recalés sur le parchemin. L’ancien cadre en métal rouillé est archivé (`archive/cadre_ancien.webp`).

**v100** : dos des cartes fourni par Amine (`assets/ui/dos.webp` : parchemin et bleu nuit, rose des vents dorée) pour la pioche (avec l’épaisseur du paquet) et les cartes qui volent de la pioche vers la main. Il remplace le dos rouge rayé.

**v101** : logo du jeu (`assets/ui/logo.svg`, aussi intégré en SVG dans `game.js`) : pleine lune, maison en ombre chinoise avec une fenêtre allumée, arbres morts, panneau de bois cloué « Dernier Abri », sous-titre « Une nuit de plus ». L’accueil est allégé : les règles sont derrière un bouton **Règles du jeu** (texte mis à jour : nuit rouge, mutation comme affixe, frénésie, répit ; rôles en pictogrammes). Tous les écrans (accueil, aube, troc, collection, options…) deviennent des fiches de papier posées sur la table, comme la fiche de nuit. Correction : au lancement, les cartes ne volent plus vers la main tant qu’un écran couvre le plateau ; l’animation se joue à sa fermeture.

**v102** : en haut de l’écran, la fiche de nuit, la piste des nuits et les jetons (unités, factions, mutation, ferraille) sont posés sur un tapis de feutre vert, le même que sous la main : le plateau est encadré par deux tapis de jeu. « Aucun effet » n’est plus écrit sur la fiche d’une nuit calme.

**v103** : correction de la v102 selon Amine : pas de tapis autour de la zone du haut ; c’est la fiche de nuit elle-même qui est en feutre vert (comme sous la main), avec le nom de l’événement sur une étiquette de papier et les jetons de la horde dans une zone plus sombre du feutre. La piste et les jetons restent posés sur la table.

**v104** : le nom de la nuit et « La horde » sont écrits directement sur le feutre (sans étiquette), pour un plateau plus épuré.

**v105** : l’intitulé « La horde » est retiré de la fiche de nuit : les jetons de zombies suffisent.

**v106** : la fiche de nuit n’écrit plus l’effet de la nuit. Chaque type de nuit a une phrase courte et poétique (champ `p` de `EVENTS` : « Le vent retient son souffle. », « La brume avale les silhouettes. », « La lune pleine les appelle tous. », « L’eau noie les flammes et les pas. », « Plus une lueur. Rien que leurs râles. », « Ils ont faim. Ils courent. »). Toucher la fiche ouvre le détail : la phrase, l’effet de la nuit, la nuit rouge, le répit, le Colosse, la frénésie et chaque type de zombie. Quand une fusée annonce la direction de la horde, la fiche l’indique à la place de la phrase.

**v107** : sur la fiche de nuit, la phrase poétique remplace le nom de la nuit (« La brume avale les silhouettes. » au lieu de « Brouillard ») ; le nom et l’effet restent dans le détail. La fusée s’affiche en petit à droite quand elle annonce la direction de la horde.

**v108** : les 4 dernières évolutions (Lance-flammes lourd, Équarrisseur, Le Saint, Bande de gamins) ont enfin leur illustration cartoon, tirée de la planche « Cartes héros » d’Amine et agrandie ×4 (Real-ESRGAN) ; la Bande de gamins réunit les deux vignettes d’enfants. Les anciennes images réalistes sont archivées dans `archive/evolutions_realistes/`. Toutes les cartes sont désormais en style cartoon.

**v109** : les 4 évolutions reçoivent les grandes illustrations cartoon générées par Amine (Lance-flammes lourd, Équarrisseur, Le Saint, Bande de gamins), à la place des vignettes agrandies de la v108. Correction : le Mur de pneus, le Fumigène, le Café et le Filet avaient leur illustration depuis la v89 mais elle n’était pas déclarée dans le jeu (pictogramme à la place) ; un test du moteur vérifie maintenant que chaque illustration de `assets/cards_cartoon/` est bien déclarée.

**v110** : page **Évolutions secrètes**, ouverte par un bouton en haut de la Collection (avec le compteur « n/10 découvertes »). Les évolutions découvertes en partie s’affichent en grande carte avec leur recette (ex. « Policier + Chien ») ; les autres en silhouette (sprite vu du dessus en ombre sur fond violet), « ??? », avec un indice : la première carte de la recette (« Indice : Sniper + ? »). L’ancienne liste en bas de la Collection est supprimée.

**v111** (demandes d’Amine) :
- **Énergie** : retour à **4 énergies** par jour (`ENERGY=4`).
- **Événements de l’aube** : 25 événements au lieu de 8 (17 nouveaux : convoi abandonné, pharmacie, enfant seul, armurerie, groupe électrogène, marchande ambulante, église en ruine, soldat déserteur, incendie, carnet de survie, loups, hélicoptère écrasé, bibliothèque, deux survivants armés, orage, fouilleurs, ferme abandonnée). Ils sont plus rares : 15 % des aubes, au moins 3 nuits entre deux, et jamais deux fois le même tant que tous n’ont pas été vus dans la partie (`st.seenEv`, `st.lastEv`).
- **Boutique** (remplace l’achat direct de munitions au troc) : 5 ferraille pour l’ouvrir ; elle propose 5 objets (objets et réactions, jamais d’unité) absents du deck, même non débloqués, un exemplaire de chacun (8 / 14 / 22 / 30 ferraille selon la rareté), plus des munitions anti-Colosse (20 ferraille). Elle change à chaque aube. Les achats arrivent en main et rejoignent le deck pour la partie.
- **Munitions anti-Colosse** : 2 au plus en ta possession (main, pioche, défausse), et **usage unique** (elles ne reviennent plus en défausse) : le Colosse ne peut plus être abattu d’une salve.
- **Fusion** : elle crée une **nouvelle carte ★** ; les 3 cartes qui la composent repartent toutes en défausse. Si l’unité fusionnée tombe, sa carte ★ est perdue ; rappelée en réserve, elle garde ses étoiles, visibles sur sa carte (bandeau doré ★, cadre qui brille) et sur le tas de la réserve.
- **Haut de l’écran** : la piste des nuits prend toute la largeur ; mutation et ferraille sont au bout de la rangée des jetons (toujours visibles, la rangée défile si elle déborde) ; zone des zombies resserrée.

**v112** : **première nuit guidée**. À la toute première partie, le jeu met le Tireur et la Barricade dans la main et guide pas à pas : choisir le Tireur (la carte pulse en doré), le poser sur la case qui brille au-dessus de la maison, choisir la Barricade, la poser sur la case qui brille de la route du sud, puis « Affronter la nuit » (le bouton pulse). La bulle du guide remplace la ligne d’info pendant ces étapes. Le joueur reste libre de faire autrement ; le guide s’arrête au lancement de la nuit, puis les bulles habituelles (nuit, aube) prennent le relais. Les Règles du jeu proposent « Rejouer la première nuit guidée ».

**v113** (équilibrage validé par Amine, d’après le rapport v112) :
- **Frénésie meurtrière** : +25 % des PV de base toutes les 5 nuits (au lieu de +60 % d’un coup après chaque Colosse), pour éviter le saut brutal entre la nuit 10 et la nuit 15 ; +1 dégât après chaque Colosse, comme avant.
- **Essence** : 1 dégât par tour au lieu de 2 (de loin la carte la plus rentable).
- **Assassin** : 2 dégâts au lieu de 3. **Meute de chiens** : 4 morsures de 1 au lieu de 2.
- **Chef de groupe** : les unités autour attaquent une fois de plus tous les 2 tours au lieu de 3 (Le Maire garde 3). **Ambulancier** : 2 dégâts au lieu de 1.

**v114** (demande d’Amine) : la frénésie meurtrière commence à la nuit 5 (+10 %) et grandit de +10 % chaque nuit ; elle s’applique désormais aux **dégâts** des zombies autant qu’à leurs PV (avant, seuls les PV montaient : les combats duraient plus longtemps sans jamais menacer les tanks). Le +1 dégât après chaque Colosse est supprimé (remplacé par cette montée continue). Nouvelle règle de **curée** : +1 dégât par autre zombie au contact de l’unité frappée, +2 au plus.

**v115** : performance pendant les grosses nuits.
- Mesure (Chromium, nuit chargée) : le dessin du jeu prend 1,5 à 2,7 ms par image ; le plus coûteux est l’obscurité de la nuit (1 à 2 ms).
- Obscurité dessinée à mi-résolution et lumières réutilisant un même disque dégradé préparé une fois : 0,35 à 0,8 ms (≈ 2,5× plus rapide), sans différence visible. Lueur de l’abri limitée à sa zone.
- Plafonds : 10 sons en même temps, 220 particules, 24 lumières.
- **Mode économie** (Options) pour les petits téléphones : plateau à résolution normale au lieu de doublée, 5 sons, 70 particules, 12 lumières, ni flous ni ombres portées sur les cartes et l’interface.

**v116** : **victoire et niveaux de Menace** (décision d’Amine).
- **Victoire** : tenir **30 nuits** (`WIN_NIGHT`). La nuit 30 est une nuit du Colosse (« Colosse final » sur la fiche, phrase « Dernière nuit : les secours arrivent à l’aube »). À l’aube, écran « Les secours sont là ! » : +100 + 50 × Menace points de survie, et la Menace suivante se débloque. Deux choix :
  - **Partir avec les secours** : la partie se termine en victoire (points des 30 nuits en plus).
  - **Rester** : mode infini, pour le score ; la victoire reste acquise. La frénésie (+10 % par nuit) fixe une limite naturelle, vers la nuit 35 à 50.
- **Menace** (0 à 10, choisie dans « Préparer la partie », niveaux cumulatifs, chaque victoire débloque le suivant) :
  1. Horde coriace : +10 % de PV dès la nuit 1.
  2. Réveil difficile : 3 énergies le premier jour.
  3. Sans répit : plus de nuit de répit.
  4. Pénurie : boutique à 10 ferraille, un zombie ordinaire sur deux rapporte de la ferraille.
  5. Mutation précoce : une mutation dès la nuit 1.
  6. Curée : jusqu’à +3 dégâts.
  7. Blessures profondes : convalescence de 4 nuits.
  8. Nuits de sang : nuits rouges à +40 % de zombies (au lieu de +15 %).
  9. Double Colosse : un Colosse de plus à chaque nuit du Colosse.
  10. Dernier Abri : abri −3 PV max, frénésie dès la nuit 3.
- L’accueil affiche la meilleure Menace vaincue et le nombre de victoires ; la Menace en cours s’affiche à côté du jour (« M3 »). Le défi du jour reste en Menace 0.
- Note : la Menace 8 devait faire revenir les nuits rouges toutes les 4 nuits ; elle les rend plutôt plus fortes, pour ne pas décaler mutations et reliques.

**v117** : vocabulaire (décision d’Amine, plus dans le thème) : les niveaux de difficulté de la v116 s’appellent **Mutations** (« Mutation de la horde » 0 à 10, « Mutation 3 vaincue ») au lieu de Menaces, et les affixes qui changent toutes les 5 nuits s’appellent **mutations instables**. Le niveau 5 devient « Instabilité précoce : une mutation instable dès la nuit 1 ». Dans le code, les niveaux restent `menace` / `MENACES` et les affixes `muts` / `MUTS`.

**v118** (décision d’Amine) : les **évolutions** fonctionnent comme la fusion : elles créent une **nouvelle carte** (avec son illustration), et les 2 cartes de la recette repartent aussitôt dans la défausse. Règle commune aux cartes fusionnées ★ et évoluées ✦ : elles n’entrent jamais dans le deck ni la défausse et ne se piochent jamais ; blessées, elles partent en réserve (convalescence) ; détruites, elles disparaissent.

**v119** : récompenses de victoire.
- **22 reliques** (8 avant, 14 nouvelles). Disponibles tout de suite : Sifflet de dresseur (chiens +2 PV, +1 dégât), Trousse de chirurgien (soins +1), Gilet pare-balles (tanks bloquent 1 coup sur 2), Coffre de pillard (boutique à 6 cartes), Carnet de troc (amélioration −10 ferraille), Ceinture de cartouches (3 munitions), Pacte du sang (+1 énergie par jour, abri −1 PV à chaque aube), Appât vivant (+50 % de ferraille par zombie, +15 % de zombies). Débloquées par les victoires (`lock` = niveau de Mutation vaincu) : Sérum expérimental (M0 : convalescence 2 nuits), Cloche d’église (M2 : unités +2 PV à l’aube), Carnet de recettes (M4 : fusion à 2 unités), Plan de l’abri (M6 : abri +3 PV max), Insigne du sauveteur (M8 : +1 unité), Fanion des secours (M10 : +1 énergie par jour). En partie, seules les reliques débloquées peuvent sortir (`st.relicPool`).
- **Relique de départ** : chaque victoire ajoute une relique au hasard (parmi celles débloquées) à la réserve du joueur ; avant une partie, il peut en choisir une (« Préparer la partie »), en plus de celle de son personnage.
- **Dos de carte doré** débloqué à la première victoire (activé tout de suite, réglable dans les Options).

**v120** : illustrations d’Amine intégrées et **cartes de victoire**.
- Les 22 reliques ont chacune leur icône (`assets/relics/<id>.webp`).
- Écran de victoire : l’hélicoptère des secours (`assets/ui/heli.webp`).
- **Maison fortifiée** (`assets/ui/shelter_fort.webp`) : récompense de la première victoire avec le dos doré, réglable dans les Options (« Abri »).
- **10 cartes de victoire** (légendaires, champ `vic` = niveau de Mutation à vaincre). Elles ne s’achètent pas et ne sortent pas en boutique : une victoire les ajoute à la collection, puis le joueur les met dans son deck (1 exemplaire).
  - M0 Hélicoptère de ravitaillement (objet, 1) : +2 énergie et pioche 2 cartes.
  - M1 Mitrailleuse lourde (tireur, 3) : 3 tirs de 2, portée 2, ne s’enraye pas, 6 PV.
  - M2 Radio militaire (poste, 2) : les tireurs à 2 cases ou moins font +1 dégât.
  - M3 Médecin militaire (soin, 2) : 2 PV tous les 2 tours, portée 3.
  - M4 Mur de conteneurs (défense, 3) : 20 PV, anti-sapeur.
  - M5 Tireur des secours (tireur, 3) : 6 dégâts tous les 2 tours, portée 4.
  - M6 Champ de mines (piège, 2) : 8 dégâts en zone, 3 fois.
  - M7 Chien de sauvetage (corps à corps, 2) : 2 morsures de 2, soigne 1 PV à un voisin tous les 2 tours.
  - M8 Frappe au napalm (réaction, 2) : 4 dégâts en zone puis feu.
  - M9 Blindé des secours (tank, 3) : 30 PV, 2 dégâts, repousse.

**v122** : plus d’émojis dans le jeu. Toutes les icônes (aide, détail de la nuit, aube, victoire, mémorial, cadenas, options, rôles, factions, équipements sur les pions, compteur de victimes, Colosse sur la piste) sont des pictogrammes à l’encre dessinés en code (`GLY` dans `game.js`), dans le style des pictogrammes des cartes. Restent seulement les signes typographiques ★ (étoiles de fusion), ✦ (évolution) et ✓.

**v123** : finition de l’interface.
- **Règles du jeu** en fiches illustrées (le but, le jour, la nuit, l’aube, rôles et escouade, factions, fusion et évolutions, remparts, survivants, la horde, Mutations de la horde), avec un sommaire pour sauter à une fiche. Les règles qui étaient dans « Voir les cartes et les zombies » y ont été déplacées ; cette page devient **Cartes et bestiaire** (catalogue des cartes, des zombies et des mutations instables).
- **Animations de fin** : défaite avec secousse, voile rouge et tampon « Tombé » ; victoire avec l’hélicoptère qui arrive, lueur dorée et tampon « Victoire » ; l’hélicoptère repart quand on part avec les secours. Coupées en mode économie et si le système demande moins d’animations.
- **Statistiques** (bouton sur l’accueil) : record, victoires, meilleure Mutation, parties, nuits et zombies au total, les 10 dernières parties (`META.hist`), les cartes les plus jouées (`META.played`). Le défi du jour n’y compte pas.

**v124** : sons de La Sonothèque fournis par Amine (voir `CREDITS.md`) : grillons et insectes en boucle sous l’ambiance de nuit (volume selon l’obscurité et le réglage « Musique et ambiance »), vraies chouettes à la place du hibou synthétique, page qui tourne quand on pioche ou choisit la carte de l’aube, pistolet qu’on arme quand on pose un tireur, et un 3ᵉ coup de fusil à pompe.

**v125** : 20 sons de plus trouvés par Amine (Pixabay, Sound Fishing ; voir `CREDITS.md`) : arbalète et arc, lance-flammes, mort des zombies (corps qui tombe), mutation instable, oiseaux de l’aube, rugissement du Colosse à son arrivée, corne au début d’une nuit rouge, hélicoptère et carillon de victoire, carillon de relique, canon (mortier, lance-roquettes), aboiements des chiens, 3 grognements de zombies de plus, variantes d’impacts (flèche, tomahawk). Ambiances météo en boucle : orage pendant la Pluie, tonnerre et vent pendant la Coupure de courant (les grillons baissent).

**v146** : version anglaise complète (décision d’Amine).
- Le français reste la langue source. Chaque texte affiché passe par `_t` (`src/i18n.js`) : `_t('Texte')` ou `` _t`Texte avec ${trou}` ``. La traduction est dans `src/lang-en.js` (clé = texte français exact, `{0}`, `{1}`… = trous).
- Langue : Options → Langue (le jeu se recharge). Par défaut, celle du navigateur (français si le navigateur est en français, anglais sinon).
- Vocabulaire anglais : abri = shelter, ferraille = scrap, PV = HP, portée = range (P2 → R2), niveau N1 → L1, troc = barter, réserve = reserve, pioche = draw pile, défausse = discard pile, Colosse = Colossus, Mère = Mother, Patient Zéro = Patient Zero, frénésie meurtrière = killing frenzy, curée = killing spree, « Une nuit de plus » = « One more night ».
- `tools/test-engine.js` vérifie que chaque texte du code a sa traduction (mêmes trous) et fait tourner le moteur en anglais ; `tools/test-browser.js` joue aussi une partie en anglais et signale tout texte visible qui ressemble à du français.

**v147** : nouvelle identité visuelle de l’accueil (illustrations d’Amine).
- Logo « Barricard — One More Night » (`assets/ui/barricard.webp`), le même dans toutes les langues ; il remplace le logo SVG de la v101.
- Image d’ambiance (`assets/ui/keyart.webp`) derrière l’accueil et les écrans ouverts depuis l’accueil (règles, défi, bestiaire, statistiques, succès, options…). Pendant une partie (pause, aube…), le plateau assombri reste derrière, sans l’image.
- Accueil : textes dans des bandeaux de papier ; crédits et version en petit texte clair, sans bandeau.

**v148** : image d’ambiance en deux formats : `keyart-portrait.webp` (841 × 1870) sur les écrans en hauteur (téléphone), `keyart.webp` (2000 × 1125 depuis la v149) sur les écrans en largeur ; voile sombre allégé.

**v167** : nouvelle image d’ambiance (palissade, survivants et zombies, milieu vide pour le menu) : `fond.webp` (1672 × 941) en largeur, `fond-portrait.webp` (841 × 1870) en hauteur, survivants en haut. En hauteur, la phrase d’accroche de l’accueil est retirée pour que le logo se pose sur la palissade.

**v168** : en hauteur, `fond-portrait2.webp` : survivants sur une palissade au tiers de l’écran. Sur téléphone, le logo (plus petit) monte dans le ciel et le menu commence juste sous la palissade, pour que les survivants restent visibles.

**v169** : en largeur (PC), l’image d’accueil est tirée au hasard à chaque démarrage parmi 6 (`fond.webp`, `fond-2.webp` à `fond-6.webp`, survivants différents). Easter egg : `fond-zombies.webp` (zombies sur la palissade, survivants en bas), environ 1 démarrage sur 25 (poids dans `FONDS`, `game-menu.js`).

**v187** (demande d’Amine) : **ruée de l’aube**. Avant, quand le temps de la nuit s’écoulait, les zombies restants disparaissaient : 2 tanks et 2 soigneurs avec peu de dégâts tenaient la horde jusqu’à la fin sans la tuer. Désormais, à la fin du temps, les zombies restants ignorent la provocation des tanks et les leurres, vont 2× plus vite et foncent sur l’abri ; les zombies pas encore arrivés ne viennent plus. Après 40 tours de ruée (`Z.RUSH_MAX`), ceux qui restent mordent l’abri et la nuit se termine. Il faut donc assez de dégâts pour finir la horde.

**v186** : un seul code de halo pour toutes les cartes (main, collection, decks, aube, boutique, récompense) : couleur de la rareté (commune verte, rare bleue, épique violette, légendaire orange) ou de l’édition pour une carte spéciale. Collection : une carte acquise a son halo de rareté (avant : vert), une carte pas encore acquise reste grisée. Éditeur de deck : les cartes hors du deck sont atténuées, sans halo.

**v185** : récompense : tampon « Choisie » sur fond transparent, encre usée et double cadre ; plus de rareté écrite sous les cartes, le halo de rareté suffit ; une carte spéciale a le halo de son édition.

**v184** : récompense : une carte choisie reçoit un tampon « Choisie » à l’encre verte (au lieu de la pastille ✓) ; sous la carte spéciale, sa vraie rareté (l’édition est déjà écrite en haut de la carte).

**v183** : écran de récompense : la carte spéciale tirée fait partie des 3 cartes ; toucher une carte retournée la valide (tampon vert), la toucher encore annule, plus de fenêtre de confirmation ; les cartes validées sont ajoutées en touchant Continuer.

**v182** : la Fantôme ou l’Holographique tirée en fin de partie s’affiche sur l’écran de récompense, avec les 3 cartes offertes.

**v181** : cartes spéciales (éditions Dorée, Blindée, Ensanglantée, Fantôme, Holographique), à collectionner ; voir « Les cartes spéciales ».

**v180** : grand écran PC (tapis vert à gauche), l’espace vide sous la piste des nuits devient un panneau à 3 onglets ; le joueur choisit, le choix est retenu (`abri-ftab`).
- **Pioche** : une ligne par sorte de carte (couleur du type, nom, illustration, exemplaires restants), barre de répartition par type ; les cartes absentes de la pioche (main, défausse) sont grisées. Lignes plus fines quand la liste ne tient pas, puis défilement.
- **Horde** : chaque zombie de la nuit avec son nombre, ses PV réels (frénésie, mutations, lieu : `Z.zMaxHp`), ses dégâts et son effet ; total de PV ; zombies nouveaux la nuit suivante en ombre (`Z.newcomers`).
- **Journal** : zombies tués, nuits tenues, dégâts infligés, survivants perdus ; graphique des zombies tués par nuit (`st.hist`, noté à chaque `endNight`) ; meilleure carte et carte la plus frappée de la nuit précédente (tableau des combats).
- Les piles (pioche, réserve, défausse) passent côte à côte en bas du tapis.

**v150** : cartes offertes en fin de partie, et prix des cartes relevés d’environ 30 %.
- Après une défaite ou un départ en hélicoptère (pas au défi du jour) : 5 nuits survécues ou plus → 1 carte à choisir parmi 3 ; 10 ou plus → 2 parmi 3 ; 20 ou plus → les 3. Tirage parmi les cartes achetables pas encore débloquées (jamais les cartes de victoire), moins de 3 si presque tout est débloqué.
- Écran « Récompense » : les 3 cartes arrivent face cachée (dos de carte, sans halo) ; on touche pour retourner (animation 3D), le halo dit la rareté (commune vert, rare bleu, épique violet, légendaire orange) ; on retouche pour prendre, avec une fenêtre de confirmation.
- Le tirage est enregistré dès la fin de partie (`META.gift`) : fermer le jeu ne permet pas de retirer, l’écran revient au prochain passage par l’accueil.
- Prix : commune 20, rare 45, épique 90, chef 130 (total pour tout acheter : environ 5 600 points au lieu de 4 300).

**v165** : curseurs PC. Avec une souris, le jeu affiche ses propres curseurs (32 px, `assets/cursors/`) : normal, clic possible, pose interdite (carte sélectionnée qui ne peut pas aller sur cette case) et glisser. Trois styles au choix dans les options (Survivant par défaut, Rouille, Zombie) ou le curseur du système. Options : case « Plein écran » (même effet que le bouton du haut) et touche F.

**v166 : la nuit plus spectaculaire** (affichage seulement, règles inchangées)
- Mur qui cède : éclats de son matériau, secousse, et au plus une fois toutes les 12 s un ralenti d'environ 1 s avec un zoom sur la brèche et « LE MUR CÈDE ! ».
- Multi-éliminations : comptées par attaque (une même unité, un même piège ou une même réaction), plus par tour. 2 = Doublé, 3 = Triplé, 4-5 = Carnage ×N, 6 et plus = MASSACRE ×N avec un petit ralenti et zoom. Elles récompensent le placement (zombies entassés dans un couloir), pas le nombre total de zombies.
- Couloirs de mort : le jour, les cases du chemin probable des zombies couvertes par au moins 2 unités qui attaquent sont teintées en rouge (plus foncé à 3 et 4+, avec une cible dès 3) ; la nuit, la teinte reste discrète. Calcul dans le moteur (`Z.killZones`), sans effet sur les règles.

**v192 : vraies musiques** (ElevenLabs, voir `CREDITS.md`). Boucles : menu (accueil, collection, options), jour (pose des cartes), nuit, boss (nuits de boss, nuit rouge et nuit sanglante). Une fois : aube (écran de l’aube), défaite, victoire (avec l’hélicoptère). Fondu enchaîné entre les morceaux et à chaque tour de boucle ; la boucle baisse pendant l’aube. Réglage « Musique et ambiance ». Les insectes, chouettes et zombies lointains restent sous la musique de nuit ; la nappe et les notes générées en code ne servent plus que si le fichier ne charge pas. Le son se coupe quand le jeu passe en arrière-plan.

**v191 : interface et animations** (affichage seulement, règles inchangées ; tout est réduit en Mode économie)
- Avant → après : une carte choisie montre sur chaque unité qu’elle améliore ce qui change (équipement, soin : ⚔ et ♥ avant → après ; fusion : ★★ sur les unités absorbées ; évolution : ✦ et le nom sur le partenaire).
- Zones non couvertes : un bouton en haut (cadre avec un rond) colore en rouge, le jour, les cases du chemin des zombies qu’aucune unité qui attaque n’atteint. Le choix est gardé.
- Bouton de la nuit : il brille et pulse quand plus aucune carte de la main n’est payable, et reste un peu terne tant qu’il reste de quoi jouer.
- Nuit rouge : petite cinématique (ciel rouge, caméra qui avance, « NUIT ROUGE » et le titre tapé à la machine, rugissement lointain).
- Gros zombie abattu (Gonflé, Blindé) : ralenti court et zoom à l’endroit, au plus une fois toutes les 5 s ; boss : zoom en plus du ralenti existant.
- Maison touchée : les bords de l’écran s’allument en rouge un court instant.
- Aube : un rayon de soleil balaie la carte en diagonale ; les zombies encore debout restent figés et partent en fumée quand il les touche.
