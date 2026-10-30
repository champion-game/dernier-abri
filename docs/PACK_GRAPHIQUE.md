# Pack graphique de Barricard : inventaire et cahier des charges

Liste de tous les graphismes du jeu, pour produire un pack cohérent (artiste ou génération).
Règle : chaque nouvelle image garde **le même nom de fichier** que celle qu’elle remplace et se dépose dans `assets/art/<cards|sprites|relics|ui>/` (voir `docs/GAME_DESIGN.md`, « Le style artiste »).

## 1. Résumé

| Famille | Nombre | Format actuel | Où |
|---|---|---|---|
| Illustrations de cartes | 150 cartes + 8 chefs (×2) + 12 zombies | webp, ~900 × 800 (paysage) ; chefs 768 × 1024 | `assets/cards_cartoon/` |
| Sprites du plateau (vus du dessus) | 108 unités + 12 zombies | webp transparent, 256 px max, tournés vers la droite | `assets/sprites_cartoon/` |
| Reliques (icônes) | 22 | webp transparent, 192 px | `assets/relics/` |
| Cadre et dos de carte | 2 | webp, 768 × 1024 / 360 × 480 | `assets/ui/cadre.webp`, `dos.webp` |
| Fonds d’écran | 7 paysage + 1 portrait | webp, 1672 × 941 / 841 × 1870 | `assets/ui/fond*.webp` |
| Logo, affiche | 4 | webp, svg | `barricard.webp`, `logo.svg`, `keyart*.webp` |
| Abri fortifié, hélicoptère | 2 | webp transparent | `shelter_fort.webp`, `heli.webp` |
| Plateau (style artiste) | 1 | webp | `assets/art/ui/plateau.webp` |
| Matières de l’interface | 2 en image (bois, clou) + 6 en essai | webp, raccordables | `wood.webp`, `nail.png`, `tools/textures.py` |
| Curseurs | 3 jeux × 4 (normal, clic, glisser, interdit) | png 32 × 32 | `assets/cursors/` |
| Icônes de l’application | 3 | png 180 / 192 / 512 | `assets/icons/` |
| Icônes de l’interface | 102 + 6 | **dessinées en code** (SVG) | `ICON` dans `src/game.js` |
| Sol, forêt, effets, nuit | — | **dessinés en code** (canvas) | `src/game-draw.js` |

Réserve non utilisée (idées pour plus tard) : `assets/extras/` (78 illustrations, 51 sprites, 40 tuiles de sol).

## 2. Ce qui est dessiné en code (à remplacer par des images si on veut un pack complet)

- **Sol du plateau, 6 terrains** : forêt, automne, neige, désert, bitume, montagne. Pour chacun : case claire, case foncée, couronne extérieure, route de terre ou d’asphalte, petits décors (fleurs, feuilles, touffes, cailloux).
- **Arbres et décor de la couronne** : feuillus, sapins enneigés, cactus et rochers, ruines urbaines, sapins de montagne.
- **Maison au centre** (abri de base, avant fortification).
- **Effets de nuit** : projectiles (balle, carreau, roquette, mortier), flammes, explosions, gaz, fumée, sang, éclairs du Tesla, lumière des lampes, brouillard, lune, aube.
- **Interface** : boutons, panneaux, onglets, barres de vie et d’énergie, piste des nuits (en CSS et SVG).
- **102 icônes** (une par carte, plus statistiques, menus) et 6 pastilles de rôle : attaque, dégâts, soin, tank, piège, chef.

## 3. Règles de cohérence

1. **Une seule vue par famille** : cartes de face, en 3/4 ; sprites **vus du dessus**, tournés vers la droite, fond transparent ; reliques de face, fond transparent.
2. **Une seule lumière** : en haut à gauche, partout (cartes, sprites, matières, icônes).
3. **Une seule palette** : rouge sang `#9e2016`, acier sombre `#3a3f45`, parchemin `#eedeb8`, vert forêt éteint `#3d5a2a`, bois `#5a3a20`, plus une couleur vive par rareté (commune grise, rare bleue, épique violette, légendaire or).
4. **Un seul trait** : même épaisseur de contour noir pour toutes les illustrations d’une famille, même niveau de détail.
5. **Lisibilité sur téléphone** : un sprite doit se reconnaître à 40 px de large (silhouette nette, contraste fort avec le sol).
6. **Relief** : ombre portée vers le bas à droite sur les sprites ; dégradé clair en haut et sombre en bas sur les éléments d’interface.
7. **Jamais d’emoji**, et pas de texte dans les images (le jeu est traduit).
8. **Taille de livraison** : cartes 1024 × 1536 en portrait (cadre de l’artiste) ou 900 × 800 en paysage (cadre actuel) ; sprites 512 px max ; matières 512 × 512 raccordables.

## 4. Liste détaillée (nom de fichier = identifiant)

« Carte » = illustration dans `cards_cartoon/<id>.webp` ; « Sprite » = image du plateau dans `sprites_cartoon/<id>.webp`. Un tiret : pas d’image, le jeu utilise l’icône ou le dessin en code.

### Murs et barricades (15)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| bar | Barricade | oui | oui |
| car | Épave | oui | — |
| fen | Clôture | oui | oui |
| sand | Sacs de sable | oui | oui |
| door | Porte blindée | oui | — |
| tire | Mur de pneus | oui | oui |
| barrier | Barrage de police | oui | oui |
| bunker | Bunker | oui | oui |
| brasero | Brasero | oui | oui |
| modwall | Mur modulaire | oui | oui |
| v_cont | Mur de conteneurs | oui | oui |
| palis | Palissade | oui | — |
| gate | Grille métallique | oui | oui |
| gabion | Gabions | oui | oui |
| fortin | Fortin | oui | oui |

### Tireurs (31)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| gun | Tireur | oui | oui |
| snp | Sniper | oui | oui |
| sht | Fusil à pompe | oui | oui |
| xbow | Arbalète | oui | oui |
| flame | Lance-flammes | oui | oui |
| mg | Mitrailleuse | oui | oui |
| molo | Cocktails | oui | oui |
| kid | Gamin | oui | oui |
| swat | Tireur d’élite du GIGN | oui | oui |
| mortar | Mortier | oui | oui |
| sentry | Sentinelle automatique | oui | oui |
| hunter | Chasseur | oui | oui |
| turret | Tourelle bricolée | oui | oui |
| tesla | Bobine Tesla | oui | oui |
| vigile | Vigile | oui | oui |
| doc | Médecin de garde | oui | oui |
| nailer | Cloueur | oui | oui |
| ranger | Garde champêtre | oui | oui |
| chief_police | Le Commissaire | oui | oui |
| chief_mil | La Sergente | oui | oui |
| chief_pyro | Le Pyromane | oui | oui |
| chief_trap | Le Braconnier | oui | oui |
| rocket | Lance-roquettes | oui | oui |
| scout | Éclaireur | oui | oui |
| v_hmg | Mitrailleuse lourde | oui | oui |
| v_sniper | Tireur des secours | oui | oui |
| nightsnp | Tireur de nuit | oui | oui |
| heavyflame | Lance-flammes lourd | oui | oui |
| autogun | Tourelle automatique | oui | oui |
| gang | Bande de gamins | oui | oui |
| tracker | Traqueur | oui | oui |

### Corps à corps (19)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| axe | Bûcheron | oui | oui |
| dog | Chien | oui | oui |
| cop | Policier | oui | oui |
| butch | Boucher | oui | oui |
| monk | Moine | oui | oui |
| riot | Agent anti-émeute | oui | oui |
| k9 | Chien policier | oui | oui |
| dogs | Meute de chiens | oui | oui |
| pitch | Fermier à la fourche | oui | oui |
| amb | Ambulancier | oui | oui |
| orderly | Infirmier costaud | oui | oui |
| chief_farm | La Fermière | oui | oui |
| handler | Maître-chien | oui | oui |
| assassin | Assassin | oui | oui |
| v_rdog | Chien de sauvetage | oui | oui |
| v_apc | Blindé des secours | oui | oui |
| k9squad | Brigade canine | oui | oui |
| slaughter | Équarrisseur | oui | oui |
| saint | Le Saint | oui | oui |

### Soutien (17)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| med | Infirmière | oui | oui |
| cook | Cuisinier | oui | oui |
| mech | Mécanicien | oui | oui |
| lead | Chef de groupe | oui | oui |
| pharma | Pharmacienne | oui | oui |
| priest | Prêtre | oui | oui |
| stretch | Brancardier | oui | oui |
| teacher | Institutrice | oui | oui |
| carp | Charpentier | oui | oui |
| chief_care | La Doctoresse | oui | oui |
| chief_tech | L’Ingénieur | oui | oui |
| chief_comm | Le Maire | oui | oui |
| welder | Soudeuse | oui | oui |
| fieldnurse | Infirmière de campagne | oui | oui |
| genmech | Électricien | oui | oui |
| v_medic | Médecin militaire | oui | oui |
| canteen | Cantine de campagne | oui | oui |

### Postes et bâtiments (13)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| lamp | Projecteur | oui | oui |
| radio | Radio | oui | oui |
| siren | Sirène | oui | oui |
| solar | Panneau solaire | oui | oui |
| hospital | Hôpital de campagne | oui | oui |
| scare | Épouvantail | oui | oui |
| workshop | Atelier | oui | oui |
| market | Marché | oui | oui |
| v_radio | Radio militaire | oui | oui |
| tower | Mirador | oui | oui |
| trench | Tranchée | oui | oui |
| pump | Pompe à eau | oui | oui |
| flood | Projecteur de chantier | oui | oui |

### Pièges (19)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| trap | Piège à loup | oui | oui |
| fire | Essence | oui | oui |
| mine | Mine | oui | oui |
| wire | Barbelés | oui | oui |
| spike | Fosse à pieux | oui | oui |
| gas | Bonbonne de gaz | oui | oui |
| smoke | Fumigène | oui | oui |
| bait | Appât | oui | oui |
| dyn | Dynamite | oui | oui |
| clay | Mine claymore | oui | oui |
| firetrap | Fût piégé | oui | oui |
| net | Filet | oui | oui |
| bear | Piège à ours | oui | oui |
| v_mines | Champ de mines | oui | oui |
| log | Tronc oscillant | oui | — |
| pit | Fosse piégée | oui | oui |
| glass | Verre brisé | oui | — |
| cans | Boîtes de conserve | oui | — |
| rocks | Éboulement | oui | oui |

### Objets (actions) (21)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| food | Conserves | oui | — |
| rep | Outils | oui | — |
| kit | Trousse de secours | oui | — |
| coffee | Café | oui | — |
| roadmap | Carte routière | oui | — |
| flare | Fusée de détresse | oui | — |
| v_heli | Hélicoptère de ravitaillement | oui | — |
| gear | Matériel lourd | oui | — |
| binoc | Jumelles | oui | — |
| bandage | Bandages | oui | — |
| medkit | Sacoche de soins | oui | — |
| torch | Lampe torche | oui | — |
| pills | Pilules | oui | — |
| pack | Sac à dos | oui | — |
| tape | Ruban adhésif | oui | — |
| keys | Clés du dépôt | oui | — |
| supply | Ravitaillement | oui | — |
| airdrop | Largage | oui | — |
| jerry | Jerrican | oui | — |
| rest | Repos | oui | — |
| radioop | Opérateur radio | oui | — |

### Réactions (15)

| Fichier | Nom | Carte | Sprite |
|---|---|---|---|
| tear | Gaz lacrymogène | oui | — |
| napalm | Napalm | oui | — |
| air | Frappe aérienne | oui | — |
| grenade | Grenade | oui | — |
| shot | Tir de l’abri | oui | — |
| patch | Réparation express | oui | — |
| molotov | Molotov | oui | — |
| horn | Klaxon | oui | — |
| rush | Adrénaline | oui | — |
| v_napalm | Frappe au napalm | oui | — |
| talkie | Talkie-walkie | oui | — |
| storm | Orage | oui | — |
| bomber | Bombardier | oui | — |
| shell | Munition anti-Colosse | oui | — |
| noise | Boîte à bruit | oui | — |

### Chefs (8, carte + version « pop » + sprite)

- chief_police
- chief_mil
- chief_care
- chief_pyro
- chief_trap
- chief_farm
- chief_tech
- chief_comm

### Zombies (12, carte + sprite : z_<id>)

| Fichier | Nom |
|---|---|
| z_walk | Rôdeur |
| z_run | Coureur |
| z_fat | Gonflé |
| z_zdog | Chien zombie |
| z_crawl | Rampant |
| z_spit | Cracheur |
| z_armor | Blindé |
| z_howl | Hurleur |
| z_sap | Sapeur |
| z_boss | Le Colosse |
| z_mere | La Mère |
| z_zero | Le Patient Zéro |

### Reliques (22, assets/relics/)

| Fichier | Nom |
|---|---|
| lunette | Lunette de visée |
| pieges | Manuel du trappeur |
| soupe | Marmite de soupe |
| sac | Grand sac à dos |
| clous | Caisse de clous |
| rage | Adrénaline |
| groupe | Groupe électrogène |
| aimant | Aimant |
| sifflet | Sifflet de dresseur |
| chirurgien | Trousse de chirurgien |
| gilet | Gilet pare-balles |
| coffre | Coffre de pillard |
| troc | Carnet de troc |
| cartouches | Ceinture de cartouches |
| pacte | Pacte du sang |
| appat | Appât vivant |
| serum | Sérum expérimental |
| cloche | Cloche d’église |
| recettes | Carnet de recettes |
| plan | Plan de l’abri |
| insigne | Insigne du sauveteur |
| fanion | Fanion des secours |

## 5. Pack d’interface généré (essai)

`python3 tools/ui_pack.py` produit 47 éléments dans `assets/art/ui/pack/` (PNG transparents, taille ×2, ombre comprise) et `pack.json` (taille, découpe pour `border-image`, usage) :
boutons rouge, gris, parchemin et rond (états normal, survol, appuyé, inactif), panneaux métal, parchemin, bois et papier, cadres seuls, onglets, étiquette du jour, pastilles, gemmes (coût, dégâts, PV), cases de la piste des nuits, cases d’énergie, barres (PV, énergie, progression), champ de saisie, interrupteurs, cases à cocher, séparateur, rivet.
Matières : `tools/textures.py`. Lumière en haut à gauche, dégradé clair en haut et sombre en bas. Pas encore branché dans le jeu.
