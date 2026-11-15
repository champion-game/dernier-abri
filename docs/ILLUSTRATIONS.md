# Illustrations des cartes : modèle et liste (v268, Amine)

Image modèle : `docs/ref/modele-carte.webp` (la punk au bandana rouge). Elle fixe le style de **toutes** les cartes.
La couleur dominante suit le rôle de la carte, avec les couleurs déjà fixées en v264 (`cardLook`, `style.css` `.cf.rk-*`).

## 1. Le style (repris du modèle)

1. **3 tons seulement** : encre noire `#1a1410`, crème parchemin `#eedeb8`, et la couleur du rôle (tableau ci-dessous). Aplats, aucun dégradé, grain d'affiche sérigraphiée.
2. **Contre-plongée héroïque** : vu d'en bas, le personnage domine, un pied ou un genou très près de l'objectif.
3. **Fond « affiche déchirée »** : une bande diagonale crème aux bords déchirés traverse le fond coloré ; en bas, des ruines, des poteaux ou des arbres en silhouette noire.
4. **Trait** : contour noir épais et anguleux, hachures pour les ombres. Une seule lumière, en haut à gauche.
5. **Caractère** : pansements, bandanas, mitaines, ceintures à pochettes, vêtements déchirés. Le personnage **regarde le joueur** (règle du 4ᵉ mur).
6. **Objets et réactions** : un personnage manie l'objet, et **l'objet est au premier plan**, grand et net. Le personnage passe au second plan.
7. **Défenses, pièges, postes** : même règle. L'ouvrage est au premier plan, le survivant qui l'installe ou le garde est derrière.
8. **Interdits** : pas de texte ni de chiffre, pas d'emoji, pas de drapeau, **pas de cigarette** (classification d'âge sur mobile), pas de gore détaillé.
9. **Format** : 1024 × 1536, portrait. Sujet au centre, avec de la marge sur les bords (la fenêtre du cadre est en arche). Nom du fichier = identifiant de la carte, à déposer dans `assets/art/cards/`.

## 2. Couleur dominante par rôle

| Rôle | Couleur du jeu | Ton d'affiche conseillé | Cartes |
|---|---|---|---|
| DPS | orange `#ff8a3d` | `#d9621c` | 44 |
| Tank | rouge `#e5484d` | `#b8231a` (le rouge du modèle) | 10 |
| Soin (et soutien) | vert `#7fd65a` | `#4f8a2e` | 21 |
| Défense | acier `#8a939c` | `#5f6b75` | 18 |
| Poste | bleu `#5fb8ff` | `#2f6fa8` | 15 |
| Piège | brun `#b07a45` | `#8a5a2b` | 19 |
| Objet | violet `#b58cff` | `#6e4a9e` | 22 |
| Réaction | rose `#ff6fb5` | `#c43c7a` | 17 |

## 3. Les bandes (reprises des images actuelles)

Les personnages et les noms affichés en jeu viennent des images actuelles (table `ARTN`, `src/game-artx.js`). On les **garde** : seul le traitement change.

| Bande (règles) | Bande (images) | Tenue et accessoires | Décor du fond |
|---|---|---|---|
| Police | Cirque | costumes de piste, paillettes, maillots rayés, caniches savants | chapiteau, gradins, guirlandes |
| Militaires | Survivalistes | bricolages de guerre, treillis rapiécé, matériel de jardin armé | pavillons, potagers, bunker de jardin |
| Soignants | Couvent | religieuses et moines, cornettes, tabliers, croix | cloître, chapelle, jardin du couvent |
| Pyromanes | Fête foraine | forains, punks cracheurs de feu, tatouages, couleurs criardes | grande roue, baraques, lampions |
| Trappeurs | Scouts | uniforme scout, foulard, short, chapeau de chef | camp de tentes, forêt, totem |
| Fermiers | Rodéo | cowboys, salopettes, chemises à carreaux, chapeaux | arène, barrières, grange, taureaux |
| Bricoleurs | Casse | ferrailleurs, cambouis, lunettes de soudeur, pneus | piles d'épaves, grues, pylônes |
| Communauté | Lotissement | voisins ordinaires, pantoufles, tenues de banlieue | maisons de lotissement, jardins, haies |
| Cheminots | Cheminots | casquette, bleu de chauffe, foulard, suie | gare à verrière, rails, château d'eau |
| Secours (`v_`) | Secours | treillis et casque des secours | hélicoptère, convoi, projecteurs |
| Sans bande | Sans bande | survivant ordinaire, tenue de récupération | ville en ruine, poteaux électriques |

## 4. Prompt à copier

> Comic poster illustration, screen-printed propaganda style, strictly 3 colors: black ink, cream parchment (#eedeb8), and [COULEUR] as the only accent color. Bold thick angular black outlines, flat colors, hatching for shadows, paper grain. Dramatic low-angle heroic shot. Background: [COULEUR] with a torn cream diagonal paper band, black silhouettes of [DÉCOR] at the bottom. Subject: [PERSONNAGE], [POSE], looking straight at the viewer. Foreground: [PREMIER PLAN], large and sharp. Post-apocalyptic zombie survival. Portrait 2:3. No text, no letters, no numbers, no flags, no cigarette, no gradients.

Remplacer les crochets par les colonnes de la liste (traduites en anglais). Pour une image marquée « garder », joindre l'image actuelle (`assets/art/cards/<fichier>.webp`) comme référence du personnage. Pour un objet ou une réaction, ajouter : *« the object is in the extreme foreground, the character is behind it »*.

## 5. Liste des illustrations

**Prompts prêts pour ChatGPT** : `docs/illustrations_prompts.xlsx` (une ligne par carte : carte, prompt). Les poses y sont plus extravagantes que dans la colonne « Pose » ci-dessous (demande d’Amine) : c’est le tableur qui fait foi.

Colonne « Image actuelle » : **garder** = le personnage existe déjà, on le redessine dans le nouveau style ; **+ personnage** = l'image actuelle ne montre que l'objet, il faut ajouter quelqu'un qui le manie (l'objet reste au premier plan) ; **à faire** = image de l'ancien style seulement (Cheminots), à refaire en entier.

### DPS, orange (44)

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| gun | Miss Deux-Colts | garder | cowgirl rousse à longue tresse, chapeau, veste à franges | un pied sur un tonneau, colt tendu vers l'objectif | canon du colt | chapiteau, cibles |
| snp | La Biathlète | garder | biathlète blonde en bandeau, gants | allongée, joue contre la carabine | bouche de la carabine | montagnes, piste de ski |
| sht | Calibre 12 | + personnage | survivaliste barbu, gilet de chasse | arme le fusil d'un coup sec | fusil sur une caisse de munitions | grange, pavillon |
| xbow | Arbalète de camp | + personnage | cheftaine scoute, foulard | un genou au sol, arbalète épaulée | arbalète et carreau | tentes, sapins |
| flame | Cracheur de feu | garder | punk à crête, torse tatoué, pantalon bouffant | cambré, crache une gerbe de feu | torche enflammée | chapiteau, brasero |
| mg | Tondeuse de guerre | + personnage | survivaliste en casquette et lunettes | à califourchon sur la tondeuse | canon monté sur la tondeuse | pelouse, clôture de jardin |
| molo | La Barmaid | garder | barmaid aux cheveux roses, créoles | assise sur le comptoir, lance une bouteille | bouteille enflammée | bar, étagères de bouteilles |
| kid | Petit Lance-Pierre | garder | gamin en casquette, panier de vélo | debout sur les pédales, élastique tendu | lance-pierre | maisons de lotissement |
| axe | Fend-la-Bûche | garder | bûcheron barbu à chignon, carreaux, bandana | hache abattue sur une souche | fer de la hache | sapins, montagne |
| dog | Chien Bandana | garder | chien au pelage noir et blanc, bandana rouge | bondit sur un zombie | gueule ouverte | arène, collines |
| butch | Gros Couperet | garder | boucher à chapeau de cowboy, tablier taché | couperet levé sur l'épaule | couperet | grange, crochets |
| k9 | Caniche savant | garder | caniche de cirque, collerette | saute à travers un cerceau | crocs et pompons | chapiteau, filet |
| swat | Lanceuse de couteaux | garder | lanceuse au carré noir, bas résille | accroupie, couteaux en éventail | lames | cible de piste |
| mortar | Mortier potager | + personnage | survivaliste jardinier, chapeau de paille | glisse un obus dans le tube | tube du mortier | potager, serre |
| sentry | Tourelle-caméra | + personnage | survivaliste en treillis, télécommande | accroupi derrière la tourelle | œil de la tourelle | pavillon, barbelés |
| hunter | Écureuil-Vif | garder | scoute aux couettes, foulard | genou à terre, arc bandé | pointe de la flèche | cible, chalet |
| dogs | La Meute bleue | garder | deux chiens au pelage bleu-gris | chargent vers l'objectif | gueule du chef de meute | arène, collines |
| turret | Tourelle à jante | + personnage | ferrailleur en salopette, clé | serre un boulon | tourelle faite de jantes | épaves, grue |
| tesla | Tour à éclairs | + personnage | ferrailleuse en gants isolants | bras levé, attire l'éclair | bobine qui crépite | pylônes, casse |
| vigile | Livreur de pizza | garder | livreur casqué sur son scooter | lance une boîte de pizza | boîte qui vole | rue de lotissement |
| nailer | La Couvreuse | garder | couvreuse en casque jaune, tresses | sur un toit, cloueuse tendue | cloueuse | toits de tuiles |
| ranger | Papy Ball-trap | garder | papy en chaise longue, pantoufles | épaule son fusil, assis | canon du fusil | jardin, barbecue |
| chief_police | La Dompteuse | garder | dompteuse brune, veste rouge à brandebourgs | fouet claquant, tigre derrière | fouet | chapiteau |
| chief_mil | Le Prophète | garder | vieillard hirsute à lunettes, cartouchières | poing levé, fusil brandi | fusil | cheminées d'usine |
| chief_pyro | Le Maître artificier | garder | magicien moustachu en haut-de-forme | fusée d'artifice dans la main | fusée allumée | forge, lampions |
| chief_trap | Akela | garder | vieux chef scout, chapeau, foulard | assis sur un rocher, arc à la main | arc | forêt, chalet |
| rocket | Bazooka | + personnage | survivante en veste militaire | tube sur l'épaule, vise | bouche du bazooka | hangars |
| scout | Hibou-Curieux | garder | scout à lunettes, jumelles | perché sur une branche, montre du doigt | jumelles | forêt, mirador |
| assassin | Le Samouraï | garder | samouraï au chignon, kimono | dégaine le katana | lame | dojo, ruines |
| v_hmg | Calibre 50 | + personnage | soldat des secours, casque | aux poignées de la mitrailleuse | canons rotatifs | blindé, fumée |
| v_sniper | L'Œil des secours | garder | tireur des secours, foulard sur le visage | allongé sur un toit | lunette du fusil | soleil couchant, ruines |
| v_rdog | Chien sauveteur | garder | berger en harnais de secours | bondit au-dessus d'un zombie | harnais et sacoche | viaduc |
| k9squad | Le Grand Numéro | garder | l'Hercule et son caniche | l'Hercule lance le caniche sur un zombie | caniche en vol | chapiteau |
| nightsnp | Œil-de-Nuit | garder | tireuse aux cheveux clairs, lampe frontale | couchée derrière un muret | lunette et projecteur | ville en ruine, nuit |
| heavyflame | Le Géant de feu | garder | cracheur de feu sur échasses | bras écartés, flammes en éventail | flammes | chapiteau en feu |
| autogun | Manège à balles | + personnage | forain en gilet pailleté | fait tourner la manivelle | tourelle de manège | baraques foraines |
| slaughter | L'Équarrisseur | garder | géant barbu, carreaux, tablier | hache et couperet écartés | couperet | scierie, roue à aubes |
| gang | La Bande à vélo | garder | cinq gamins à vélo | foncent vers l'objectif, lance-pierres | roue avant et lance-pierre | rue de lotissement |
| tracker | Renarde-Rusée | garder | scoute aux couettes, foulard | arbalète tendue, en mouvement | carreau | viaduc, forêt |
| rosa | Rosa du Quai 9 | à faire | cheminote noire, foulard jaune | carabine épaulée sur le quai | carabine | quai, wagons |
| chief_rail | Monsieur Terminus | à faire | vieux chef de gare, casquette, redingote | lanterne levée, sifflet aux lèvres | lanterne | verrière, horloge |
| hirond | L'Hirondelle des wagons | à faire | rousse au foulard, clé à la main | court sur le toit d'un wagon | clé et pistolet | wagons, soleil couchant |
| charbon | Gros Charbon | à faire | chauffeur chauve et barbu, tablier de cuir | pelle de charbon brûlant tendue | braises sur la pelle | foyer de la locomotive |
| veuve | La Veuve du Tunnel | à faire | vieille dame aux tresses blanches, manteau | arbalète lourde épaulée | carreau | entrée de tunnel |

### Tank, rouge (10)

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| cop | L'Hercule | garder | hercule moustachu, maillot rayé, ceinture de champion | jambes fléchies, paume tendue qui repousse | paume ouverte | chapiteau |
| monk | Le Moine voisin | garder | moine chauve en robe orange | bâton tenu à deux mains | bâton | lotissement, arbres |
| riot | Videur du chapiteau | garder | videur casqué, gilet brodé | planté derrière son bouclier | bouclier | chapiteau, réverbère |
| pitch | Clown de rodéo | garder | clown au nez rouge, salopette | fourche pointée, sur un tonneau | dents de la fourche | grange, silo |
| amb | Sœur Mêlée | garder | religieuse costaude, manches retroussées | charge avec un brancard en bouclier | brancard | cloître |
| chief_farm | La Reine du rodéo | garder | cowgirl blonde au chapeau rose | sur un taureau, lasso au-dessus de la tête | lasso | arène |
| handler | Madame Pompon | garder | dame forte en veste de dresseuse, plume | bras ouverts, caniches à ses pieds | caniches | chapiteau |
| v_apc | Le Mastodonte | + personnage | pilote des secours | sorti de la tourelle, bras tendu | calandre du blindé | ruines |
| saint | L'Illuminé | garder | vieillard chauve en toge, bâton | bras tendu, survivants derrière lui | bâton | ciel rouge |
| rempart | Le Rempart du 7 h 12 | à faire | cheminot barbu, bonnet | porte de wagon tenue en bouclier | porte de wagon | verrière |

### Soin et soutien, vert (21)

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| med | Sœur Bicyclette | garder | jeune religieuse à vélo | lance un rouleau de bandage | panier et bandage | couvent, collines |
| cook | Sœur Fournée | garder | religieuse ronde en toque | tarte levée, rouleau à pâtisserie | tarte fumante | cuisine du couvent |
| mech | Mécano stock-car | garder | mécano punk aux cheveux verts, combinaison à damier | clé à molette sur l'épaule | clé et moteur | atelier, casse |
| lead | Le Coach | garder | coach grisonnant, sifflet, survêtement | montre la direction, tableau tactique | tableau et ballon | stade de quartier |
| pharma | Sœur Alambic | garder | religieuse aux fioles | fait boire un remède à un blessé | fiole fumante | alambic, cloître |
| priest | L'Exorciste | garder | vieux prêtre, étole violette | brandit son goupillon | goupillon | aqueduc, chapelle |
| stretch | Novice à roulettes | garder | novice en rollers | pousse un brancard en glissant | patin et brancard | couvent |
| teacher | La Bibliothécaire | garder | bibliothécaire à lunettes et chignon | livre brandi, pile de livres | livre ouvert | bibliothèque vitrée |
| carp | Bricoleur du dimanche | garder | monsieur chauve, chaussettes et sandales | perceuse en main, accroupi | perceuse | jardin, cabane |
| doc | Sœur Pistole | garder | vieille religieuse aux lunettes | pistolet et tasse de thé | pistolet | jardin du couvent |
| orderly | Frère Carillon | garder | moine roux et barbu | maillet levé sous une cloche | maillet | clocher |
| chief_care | La Mère Abbesse | garder | abbesse sévère, gants verts | sécateur à la main, roses | sécateur | serre du couvent |
| chief_tech | Le Roi de la casse | garder | vieux ferrailleur aux dreadlocks grises, bras mécanique | trône de pneus, accoudé | bras mécanique | piles d'épaves, grue |
| chief_comm | La Présidente | garder | dame aux bigoudis, tailleur rose | sur un escabeau, mégaphone | mégaphone | lotissement |
| welder | Soudeuse masquée | garder | soudeuse au masque peint de flammes, crête violette | chalumeau tendu | flamme du chalumeau | grue, casse |
| fieldnurse | Sœur Lanterne | garder | vieille religieuse en tenue claire | lanterne et lampe levées | lanterne | jungle, cabanes |
| genmech | Professeur Volts | garder | savant aux cheveux électrisés, gants verts | câbles dans les mains, en marche | pinces et batterie | casse, pylônes |
| v_medic | Toubib des secours | garder | soldat des secours | panse une survivante | bandage | tente |
| canteen | La Kermesse | garder | deux religieuses | servent soupe et tartes | bol de soupe | stand à rayures |
| bielle | Mamie Bielle | à faire | mamie cheminote aux cheveux gris | clé dans un moteur, à genoux | clé à molette | dépôt, horloge |
| aiguille | Maître Aiguille | à faire | aiguilleur musclé, foulard | tire un levier d'aiguillage | levier | rails, château d'eau |

### Défense, acier (18)

Toutes les images actuelles montrent l'ouvrage seul : on garde l'ouvrage au premier plan et on ajoute le survivant derrière.

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| bar | Planches clouées | + personnage | survivante, clous entre les lèvres | cloue une planche, marteau levé | planches clouées | fenêtre de maison |
| car | Vieille guimbarde | + personnage | survivant appuyé sur la carcasse | bras croisés, une botte sur un pneu | épave rouillée | route, ruines |
| fen | Grillage électrifié | + personnage | ferrailleur, gants isolants | tend le fil | grillage et panneau | casse, grue |
| sand | Mur de sacs | + personnage | survivaliste | pose un sac sur l'épaule | sacs de sable | murs de béton |
| door | Porte de chambre forte | + personnage | survivante | tourne la roue de la porte | porte blindée | sous-sol |
| tire | Pneus peints | + personnage | forain, pinceau | peint un pneu de la pile | pneus colorés | fête foraine |
| barrier | Barrière de piste | + personnage | garçon de piste | pose la barrière | barrière rayée | tunnel du cirque |
| bunker | Bunker de jardin | + personnage | survivaliste, arrosoir | à la porte du bunker | bunker et filet de camouflage | jardin, sapins |
| brasero | Brasero forain | + personnage | foraine | attise les braises | brasero | guirlandes, chapiteau |
| modwall | Mur de portières | + personnage | ferrailleuse | soude une portière | portières soudées | casse |
| v_cont | Rempart de conteneurs | + personnage | soldat des secours | guide la grue | conteneurs | port |
| palis | Pieux taillés | + personnage | scout | taille un pieu à la hachette | palissade | camp scout |
| gate | Grille cadenassée | + personnage | survivant | ferme le cadenas | chaîne et cadenas | entrepôt |
| gabion | Cages à cailloux | + personnage | survivaliste | jette une pierre dans la cage | gabions | carrière |
| fortin | Voiture-fortin | + personnage | survivaliste et mécano | sur le toit du fortin | voiture blindée | neige, ruines |
| fourgon | Le Fourgon de fer | à faire | cheminot | pousse le fourgon | fourgon blindé | passage à niveau |
| butoir | Le Butoir | à faire | cheminote | adossée au butoir | butoir à pieux | tunnel |
| express | L'Express de minuit | à faire | chauffeur de locomotive | penché hors de la cabine | locomotive blindée | rails, zombies |

### Poste, bleu (15)

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| lamp | La Poursuite | + personnage | régisseur du cirque | oriente le projecteur | projecteur | chapiteau |
| radio | Radio-cintre | + personnage | survivante, écouteurs | règle la fréquence | radio et cintre-antenne | chalet, montagnes |
| siren | Porte-voix | + personnage | Monsieur Loyal | crie dans le porte-voix | pavillon du porte-voix | chapiteau |
| solar | Plein Soleil | + personnage | ferrailleur | essuie le panneau | panneau solaire | grue, casse |
| hospital | Dortoir des sœurs | + personnage | religieuse | borde un lit | lits de fer | dortoir vitré |
| scare | Monsieur Paille | + personnage | fermier | plante l'épouvantail | épouvantail | champs sous l'orage |
| workshop | L'Établi | + personnage | ferrailleuse | serre l'étau | établi et outils | atelier |
| market | Vide-grenier | + personnage | voisine | derrière son étal | objets du vide-grenier | lotissement |
| v_radio | Radio des secours | + personnage | opératrice des secours | parle dans le combiné | radio militaire | antennes |
| tower | Nid de pie | + personnage | guetteur | en haut du mirador | mirador | marais |
| trench | Le Boyau | + personnage | survivaliste | adossé à la paroi | caillebotis du boyau | ciel d'orage |
| pump | Pompe du puits | + personnage | fermière | actionne la pompe | pompe et seau | moulin, rivière |
| flood | Projo de chantier | + personnage | ouvrier | allume le projecteur | projecteur sur trépied | port, grue |
| nid | Le Nid d'aiguillage | à faire | aiguilleur | à la fenêtre du poste | poste d'aiguillage | rails, nuit |
| draisine | L'Œil de la draisine | à faire | cheminote | pompe le levier | phare de la draisine | gare, nuit |

### Piège, brun (19)

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| trap | Croc-de-loup | + personnage | scout | arme le piège | mâchoires | forêt |
| fire | Nappe de feu | + personnage | forain | vide le jerrican | flaque d'essence | grande roue |
| mine | Galette d'acier | + personnage | survivaliste | enterre la mine | mine | barrage |
| wire | Ronces de fer | + personnage | scout, gants épais | déroule le barbelé | rouleau de barbelés | mirador |
| spike | Gueule de pieux | + personnage | scout | plante un pieu | pieux | forêt |
| gas | Butane | + personnage | forain | roule la bonbonne | bonbonne | baraques |
| smoke | Fumée verte | + personnage | scout | dégoupille le fumigène | fumigène | viaduc |
| bait | Steak pendu | + personnage | scoute | suspend la viande | steak au crochet | camp scout |
| dyn | Réveil-matin | + personnage | survivaliste | règle le réveil | dynamite et réveil | grange |
| clay | Éventail d'acier | + personnage | survivaliste | plante la claymore | claymore | chevalement |
| firetrap | Baril surprise | + personnage | foraine | cloue le couvercle | baril peint | grande roue |
| net | Filet de capture | + personnage | scout | tire la corde | filet | forêt |
| bear | Croc-d'ours | + personnage | scout costaud | ouvre le piège à deux mains | piège et chaîne | cabane en rondins |
| v_mines | Champ de mines | + personnage | démineur des secours | plante un panneau | panneau et mines | herbes hautes |
| log | Bélier pendu | + personnage | scout | coupe la corde | tronc suspendu | moulin |
| pit | Trou de loup | + personnage | survivant | couvre la fosse de feuilles | fosse | forêt d'automne |
| glass | Tessons | + personnage | survivante | sème des tessons | éclats de verre | forêt d'automne |
| cans | Carillon de boîtes | + personnage | gamin | accroche les boîtes | boîtes sur un fil | temple, arbres |
| rocks | Éboulement | + personnage | scout | fait levier sur un rocher | rochers | falaise, viaduc |

### Objet, violet (22)

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| food | Garde-manger | + personnage | survivante | ouvre une conserve au couteau | conserves | étagères |
| rep | Caisse à outils | + personnage | survivant | sort une clé de la caisse | caisse ouverte | atelier |
| kit | Boîte à pharmacie | + personnage | survivante | ouvre la boîte | trousse et ciseaux | infirmerie |
| coffee | Café brûlant | + personnage | survivant aux yeux cernés | tasse tendue vers l'objectif | tasse fumante | cuisine, aube |
| roadmap | Carte et boussole | + personnage | survivante | déplie la carte | carte et crayon | montagnes |
| flare | Fusée rouge | + personnage | survivant | tire la fusée vers le ciel | pistolet lance-fusées | phare |
| v_heli | Pluie de caisses | + personnage | pilote des secours | fait signe depuis la porte | caisses en parachute | hélicoptère |
| gear | Casque et plaques | + personnage | survivant | boucle le gilet | casque et gilet | grue |
| binoc | Jumelles | + personnage | guetteuse | regarde à la jumelle | jumelles | montagnes |
| bandage | Bandages | + personnage | survivant | serre un bandage autour du bras | rouleau et épingles | tente |
| medkit | Musette de soins | + personnage | soignante | ouvre la musette | musette | aqueduc |
| torch | Lampe torche | + personnage | survivante | braque la lampe sur l'objectif | faisceau et lampe | pont métallique |
| pills | Cachets | + personnage | survivant | verse des cachets dans sa main | flacon renversé | usine |
| pack | Sac à dos | + personnage | survivante | hisse le sac sur l'épaule | sac à dos | viaduc |
| tape | Scotch américain | + personnage | ferrailleur | déchire le ruban avec les dents | rouleau | atelier |
| keys | Trousseau | + personnage | survivant | agite le trousseau | clés | dépôt |
| supply | Caisse de matériel | + personnage | survivante | force la caisse au pied-de-biche | caisse | port, grue |
| airdrop | Colis du ciel | + personnage | survivant | bras levés pour attraper le colis | caisse au parachute | aéroport |
| jerry | Jerrican | + personnage | survivant | soulève le jerrican | jerrican | hangar |
| rest | Lit de camp | + personnage | survivante | s'étire, couverture sur l'épaule | lit de camp | tente, lanterne |
| radioop | Voix des secours | + personnage | opérateur | casque sur les oreilles, micro | poste radio | montagnes |
| billets | Vos billets ! | à faire | contrôleur | tend les billets | sacoche et billets | banc de gare |

### Réaction, rose (17)

| Fichier | Nom en jeu | Image actuelle | Personnage | Pose (contre-plongée) | Premier plan | Fond |
|---|---|---|---|---|---|---|
| tear | Gaz lacrymo | + personnage | survivant masqué | lance la grenade | grenade fumante | ruines |
| napalm | Brasier | + personnage | survivante | jette le bidon enflammé | bidon en feu | canyon en flammes |
| air | Bombardement | + personnage | soldat | parle à la radio, bras tendu | radio et combiné | avions, barrage |
| grenade | L'Ananas | + personnage | survivante | dégoupille avec les dents | grenade | usine |
| shot | Tir de couverture | + personnage | survivant | tire depuis la fenêtre de l'abri | canon du fusil | fenêtre |
| patch | Rafistolage | + personnage | ferrailleuse | scotche une poutre | rouleau de scotch | atelier |
| molotov | Molotov | + personnage | survivant | lance la bouteille | bouteille enflammée | viaduc |
| horn | Klaxon de détresse | + personnage | survivante | presse la corne | pavillon du klaxon | voiture, gare |
| rush | Shoot d'adrénaline | + personnage | survivant | se pique au bras | seringue | laboratoire |
| talkie | Talkie-walkie | + personnage | survivante | parle dans le talkie | talkie | pylône |
| storm | Orage | + personnage | survivant sous la pluie | lève une barre de fer vers l'éclair | barre et éclair | montagnes, pluie |
| bomber | Raid aérien | + personnage | soldat | tire une fusée de signal | pistolet lance-fusées | bombardier |
| shell | Obus anti-Colosse | + personnage | soldat | charge l'obus | gros obus | hangar |
| noise | Radiocassette | + personnage | gamin | monte le son | radiocassette | chapiteau |
| v_napalm | Terre brûlée | + personnage | soldat des secours | marque la cible au fumigène | fumigène | avion, raffinerie |
| retard | Retard en gare | à faire | chef de gare | brandit sa montre | montre à gousset | quai |
| coupsif | Coup de sifflet | à faire | contrôleuse | siffle à pleins poumons | sifflet | quai, vapeur |
