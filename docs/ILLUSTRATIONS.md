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

## 3. Signes de chaque bande (faction)

| Bande | Tenue et accessoires | Décor du fond |
|---|---|---|
| Police | képi ou casquette, insigne, gilet pare-balles | commissariat, voitures de patrouille en ruine |
| Militaires | treillis, casque, plaques d'identité, sangles | barbelés, camion militaire, sacs de sable |
| Soignants | blouse, brassard à croix, stéthoscope | tente de campagne, hôpital éventré |
| Pyromanes | combinaison roussie, masque à gaz, gants épais | usine en flammes, cuves, fumée |
| Trappeurs | fourrure, capuche, cuir, colliers de dents | forêt de sapins, cabane |
| Fermiers | salopette, chapeau de paille, chemise à carreaux | grange, silo, champs |
| Bricoleurs | bleu de travail, lunettes de soudeur, ceinture à outils | atelier, pylônes, câbles |
| Communauté | vêtements civils rapiécés, écharpe | rue de village, église, mairie |
| Cheminots | casquette de cheminot, gilet, foulard, suie | gare, rails, wagons, château d'eau |
| Secours (cartes `v_`) | combinaison et casque des secours, bandes réfléchissantes | hélicoptère, convoi, projecteurs |
| Sans bande | survivant ordinaire, tenue de récupération | ville en ruine, poteaux électriques |

## 4. Prompt à copier

> Comic poster illustration, screen-printed propaganda style, strictly 3 colors: black ink, cream parchment (#eedeb8), and [COULEUR] as the only accent color. Bold thick angular black outlines, flat colors, hatching for shadows, paper grain. Dramatic low-angle heroic shot. Background: [COULEUR] with a torn cream diagonal paper band, black silhouettes of [DÉCOR] at the bottom. Subject: [PERSONNAGE], [POSE], looking straight at the viewer. Foreground: [PREMIER PLAN], large and sharp. Post-apocalyptic zombie survival. Portrait 2:3. No text, no letters, no numbers, no flags, no cigarette, no gradients.

Remplacer les crochets par les colonnes de la liste (traduites en anglais). Pour un objet ou une réaction, ajouter : *« the object is in the extreme foreground, the character is behind it »*.

## 5. Liste des illustrations

Les 16 cartes des Cheminots et du train (de `rosa` à `express`) n'ont **pas encore d'image** : priorité. Les autres existent et seront refaites dans le nouveau style.

### DPS, orange (44)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| gun | Tireur | policier trentenaire, gilet pare-balles | un genou à terre, pistolet tenu à deux mains | canon du pistolet, douilles | rue en ruine |
| snp | Sniper | militaire en tenue camouflée | allongé, joue contre la crosse | lunette du fusil | château d'eau, toits |
| sht | Fusil à pompe | militaire costaud, casque | debout, arme le fusil d'un coup sec | fusil à pompe, cartouches | barbelés, camion |
| xbow | Arbalète | trappeuse en capuche de fourrure | accroupie, arbalète épaulée | carreau prêt à partir | sapins |
| flame | Lance-flammes | pyromane en masque à gaz | jambes écartées, jet de flammes | buse du lance-flammes | cuves d'usine |
| mg | Mitrailleuse | militaire torse en sangles | derrière l'arme sur bipied, bande de balles | mitrailleuse et bande | sacs de sable |
| molo | Cocktails | pyromane en combinaison roussie | bras armé en arrière pour lancer | bouteille enflammée | usine en flammes |
| kid | Gamin | gamin de 11 ans, casquette, genoux écorchés | debout sur une poubelle, élastique tendu | lance-pierre | rue de village |
| axe | Bûcheron | fermier barbu, chemise à carreaux | hache levée au-dessus de la tête | fer de la hache | sapins, souches |
| dog | Chien | berger allemand balafré, bandana | bondit vers l'objectif, crocs sortis | gueule ouverte | ferme |
| butch | Boucher | boucher massif, tablier taché | couperet sur l'épaule | couperet | grange, crochets |
| k9 | Chien policier | malinois en harnais de police | en arrêt, aboie | harnais et insigne | voitures de patrouille |
| swat | Tireur d'élite du GIGN | policière en casque et cagoule | épaule le fusil d'assaut | viseur du fusil | commissariat |
| mortar | Mortier | militaire, casque, gants | glisse un obus dans le tube | tube du mortier | barbelés, fumée |
| sentry | Sentinelle automatique | soldat technicien, tablette | à côté de la tourelle, la règle | tourelle à trépied | camp militaire |
| hunter | Chasseur | chasseur en veste de cuir, bonnet | fusil de chasse en appui sur le genou | fusil et cartouchière | forêt |
| dogs | Meute de chiens | trois chiens efflanqués | chargent en éventail vers l'objectif | gueule du chef de meute | champs |
| turret | Tourelle bricolée | bricoleuse en lunettes de soudeur | serre un boulon de la tourelle | tourelle en tôle et tuyaux | atelier |
| tesla | Bobine Tesla | bricoleur, gants isolants | bras levé, arc électrique au-dessus | bobine qui crépite | pylônes |
| vigile | Vigile | vigile de supermarché, blouson | lampe et revolver croisés | revolver | parking, caddies |
| nailer | Cloueur | ouvrier, casque de chantier | cloueuse tendue à bout de bras | cloueuse pneumatique | échafaudages |
| ranger | Garde champêtre | garde âgé, moustache, képi | fusil en bandoulière, prêt à tirer | fusil de chasse | église de village |
| chief_police | Le Commissaire | commissaire grisonnant, imper ouvert | pose de chef, pistolet levé | insigne et pistolet | commissariat en ruine |
| chief_mil | La Sergente | sergente aux tresses, casque | crie un ordre, fusil levé | fusil d'assaut | camion, barbelés |
| chief_pyro | Le Pyromane | pyromane hilare, masque relevé | torche et lance-flammes en croix | flammes | usine qui brûle |
| chief_trap | Le Braconnier | braconnier, crâne de loup en capuche | debout sur un rocher, fusil long | trophées et fusil | forêt, lune |
| rocket | Lance-roquettes | survivante en veste militaire | lance-roquettes sur l'épaule | bouche du tube | ruines, Colosse au loin |
| scout | Éclaireur | jeune trappeur, cape | perché sur un arbre, carabine | carabine et jumelles | sapins |
| assassin | Assassin | militaire cagoulé | accroupi, couteau de combat à l'envers | lame | ombres, barbelés |
| v_hmg | Mitrailleuse lourde | soldat des secours | fixe la mitrailleuse sur un blindé | canon de la mitrailleuse | convoi |
| v_sniper | Tireur des secours | tireuse des secours | allongée sur un toit | grand fusil de précision | hélicoptère |
| v_rdog | Chien de sauvetage | chien en gilet réfléchissant | assis, trousse dans la gueule | trousse et gilet | projecteurs |
| k9squad | Brigade canine | policier et son chien | côte à côte, laisse tendue | chien prêt à mordre | voitures de patrouille |
| nightsnp | Tireur de nuit | sniper sur une tour | projecteur à côté du fusil | faisceau et lunette | nuit, toits |
| heavyflame | Lance-flammes lourd | pyromane en armure de récupération | flammes en éventail | réservoirs et buse | flammes partout |
| autogun | Tourelle automatique | mécanicien couvert de cambouis | main posée sur la tourelle | tourelle automatique | atelier |
| slaughter | Équarrisseur | colosse en tablier, deux couperets | tourne sur lui-même | couperets | abattoir |
| gang | Bande de gamins | cinq enfants | tirent ensemble, élastiques tendus | lance-pierres | cour d'école |
| tracker | Traqueur | traqueuse aux peintures de guerre | arbalète double épaulée | deux carreaux | sapins |
| rosa | Rosa du Quai 9 | cheminote quarantenaire, foulard | debout sur un quai, carabine | carabine | quai de gare |
| chief_rail | Monsieur Terminus | chef de gare moustachu, casquette | lanterne et revolver | lanterne | gare, horloge |
| hirond | L'Hirondelle des wagons | jeune acrobate, foulard | sur le toit d'un wagon, pistolets | pistolets | wagons |
| charbon | Gros Charbon | chauffeur de locomotive, suie | pelle de charbon brûlant | pelle et braises | locomotive |
| veuve | La Veuve du Tunnel | veuve en voile noir | arbalète lourde, au bord d'un tunnel | carreau | entrée de tunnel |

### Tank, rouge (10)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| cop | Policier | policier robuste | matraque et bras tendu qui repousse | matraque | voitures de patrouille |
| monk | Moine | moine chauve, bure déchirée | bâton en rotation | bâton | monastère |
| riot | Agent anti-émeute | agent casqué | bouclier planté devant lui | bouclier | barricades |
| pitch | Fermier à la fourche | fermier, salopette | fourche pointée vers l'objectif | dents de la fourche | grange |
| amb | Ambulancier | ambulancier, gilet réfléchissant | brancard tenu comme un bouclier | brancard | ambulance |
| chief_farm | La Fermière | fermière massive, chapeau de paille | pied sur une botte de foin, faux | lame de la faux | silo, champs |
| handler | Maître-chien | maître-chien, protections de bras | deux chiens en laisse | laisses et chiens | chenil |
| v_apc | Blindé des secours | pilote du blindé | sortie de la tourelle | blindé de face | convoi |
| saint | Le Saint | vieil homme, auréole de flammes | bras écartés | chapelet | église en ruine |
| rempart | Le Rempart du 7 h 12 | cheminot géant | plaque de wagon en bouclier | plaque de fer | rails |

### Soin et soutien, vert (21)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| med | Infirmière | infirmière, brassard | seringue levée | seringue | tente de soins |
| cook | Cuisinier | cuisinier bedonnant | louche levée au-dessus d'une marmite | marmite fumante | cuisine de camp |
| mech | Mécanicien | mécanicien, bleu de travail | clé à molette sur l'épaule | clé à molette | atelier |
| lead | Chef de groupe | meneuse, mégaphone | bras tendu, donne l'ordre | mégaphone | rue |
| pharma | Pharmacienne | pharmacienne, blouse | flacons entre les doigts | flacons | pharmacie |
| priest | Prêtre | prêtre, soutane déchirée | croix levée | croix | église |
| stretch | Brancardier | brancardier | court avec un brancard | brancard | hôpital |
| teacher | Institutrice | institutrice | livre ouvert, règle | livre | école |
| carp | Charpentier | charpentier | marteau et planche | marteau | chantier |
| doc | Médecin de garde | médecin, stéthoscope | pistolet et trousse | trousse | hôpital |
| orderly | Infirmier costaud | infirmier massif | poings bandés | bandes | couloir d'hôpital |
| chief_care | La Doctoresse | doctoresse | stéthoscope et scalpel | stéthoscope | hôpital |
| chief_tech | L'Ingénieur | ingénieur, lunettes | plan roulé et clé | plan | atelier |
| chief_comm | Le Maire | maire, écharpe | bras ouverts | écharpe | mairie |
| welder | Soudeuse | soudeuse | masque relevé, chalumeau | chalumeau | atelier |
| fieldnurse | Infirmière de campagne | infirmière militaire | bandages | trousse | tente |
| genmech | Électricien | électricien | câbles sur l'épaule | groupe électrogène | pylônes |
| v_medic | Médecin militaire | médecin des secours | trousse ouverte | trousse | hélicoptère |
| canteen | Cantine de campagne | cuisinière | louche et gamelle | marmite | tente |
| bielle | Mamie Bielle | vieille cheminote | clé et burette | burette | dépôt |
| aiguille | Maître Aiguille | aiguilleur âgé | tire un levier | levier | poste d'aiguillage |

### Défense, acier (18)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| bar | Barricade | survivante, marteau | cloue une planche | planches clouées | fenêtre de maison |
| car | Épave | survivant | appuyé sur la carcasse | épave de voiture | route |
| fen | Clôture | bricoleur, gants isolants | tend un fil | clôture électrique | pylônes |
| sand | Sacs de sable | soldat | empile un sac | sacs de sable | barbelés |
| door | Porte blindée | survivante | verrouille la porte | porte blindée | maison |
| tire | Mur de pneus | pyromane | empile des pneus | pneus | usine |
| barrier | Barrage de police | policier | pose une barrière | barrières | carrefour |
| bunker | Bunker | soldat | à la meurtrière | bunker de béton | barbelés |
| brasero | Brasero | pyromane | attise le feu | brasero | nuit |
| modwall | Mur modulaire | bricoleuse | visse une tôle | panneaux de tôle | atelier |
| v_cont | Mur de conteneurs | soldat des secours | guide la grue | conteneurs | port |
| palis | Palissade | trappeur | taille un pieu | pieux | forêt |
| gate | Grille métallique | survivant | ferme la grille | grille | entrepôt |
| gabion | Gabions | soldat | remplit de pierres | gabions | camp |
| fortin | Fortin | soldat et mécanicien | sur le toit | fortin soudé | route |
| fourgon | Le Fourgon de fer | cheminot | pousse le fourgon | fourgon blindé | rails |
| butoir | Le Butoir | cheminote | adossée au butoir | butoir | fin de voie |
| express | L'Express de minuit | chauffeur de locomotive | à la cabine | locomotive blindée | nuit, rails |

### Poste, bleu (15)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| lamp | Projecteur | policier | oriente le projecteur | projecteur | nuit |
| radio | Radio | survivante | écouteurs sur la tête | poste radio | maison |
| siren | Sirène | policier | tourne la manivelle | sirène | toits |
| solar | Panneau solaire | bricoleur | essuie un panneau | panneau solaire | toits |
| hospital | Hôpital de campagne | soignante | ouvre la tente | tente à croix | camp |
| scare | Épouvantail | fermier | plante l'épouvantail | épouvantail | champs |
| workshop | Atelier | bricoleuse | à l'établi | établi et outils | atelier |
| market | Marché | marchand | derrière son étal | étal de ferraille | rue |
| v_radio | Radio militaire | soldat des secours | parle dans le combiné | radio militaire | hélicoptère |
| tower | Mirador | guetteur | en haut du mirador | mirador | forêt |
| trench | Tranchée | soldat | dans la tranchée | rebord de la tranchée | barbelés |
| pump | Pompe à eau | fermière | actionne la pompe | pompe | ferme |
| flood | Projecteur de chantier | ouvrier | allume le projecteur | projecteur de chantier | chantier |
| nid | Le Nid d'aiguillage | aiguilleur | à la fenêtre du poste | poste d'aiguillage | rails |
| draisine | L'Œil de la draisine | cheminote | pompe la draisine | draisine et phare | rails |

### Piège, brun (19)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| trap | Piège à loup | trappeuse | arme le piège | mâchoires du piège | forêt |
| fire | Essence | pyromane | vide un bidon | flaque d'essence | route |
| mine | Mine | soldat | enterre la mine | mine | champ |
| wire | Barbelés | soldat | déroule le barbelé | barbelés | camp |
| spike | Fosse à pieux | trappeur | taille un pieu | fosse et pieux | forêt |
| gas | Bonbonne de gaz | pyromane | roule la bonbonne | bonbonne | usine |
| smoke | Fumigène | trappeur | pose le fumigène | fumigène | forêt |
| bait | Appât | trappeuse | jette la viande | viande crue | forêt |
| dyn | Dynamite | soldat | branche le détonateur | bâtons de dynamite | carrière |
| clay | Mine claymore | soldat | pose la claymore | claymore | barbelés |
| firetrap | Fût piégé | pyromane | trafique un fût | fût | usine |
| net | Filet | trappeur | tire la corde | filet | forêt |
| bear | Piège à ours | trappeur | ouvre le piège | grand piège à ours | cabane |
| v_mines | Champ de mines | démineur des secours | plante un piquet | mines alignées | champ |
| log | Tronc oscillant | trappeur | tient la corde | tronc suspendu | forêt |
| pit | Fosse piégée | survivant | recouvre la fosse | fosse | route |
| glass | Verre brisé | survivante | sème du verre | éclats de verre | rue |
| cans | Boîtes de conserve | gamin | accroche les boîtes | boîtes sur un fil | clôture |
| rocks | Éboulement | trappeur | coupe la corde | rochers | montagne |

### Objet, violet (22)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| food | Conserves | survivante | ouvre une conserve | conserve | cuisine |
| rep | Outils | survivant | caisse sur l'épaule | caisse à outils | atelier |
| kit | Trousse de secours | survivante | ouvre la trousse | trousse | maison |
| coffee | Café | survivant | boit à la tasse | tasse fumante | aube |
| roadmap | Carte routière | survivante | déplie la carte | carte routière | voiture |
| flare | Fusée de détresse | survivant | lève la fusée | fusée allumée | nuit |
| v_heli | Hélicoptère de ravitaillement | pilote | fait signe | hélicoptère | ciel |
| gear | Matériel lourd | survivant | enfile un gilet | gilet blindé | maison |
| binoc | Jumelles | guetteuse | regarde à la jumelle | jumelles | toits |
| bandage | Bandages | survivant | serre un bandage | bandage | maison |
| medkit | Sacoche de soins | soignante | sacoche en bandoulière | sacoche | tente |
| torch | Lampe torche | survivante | éclaire l'objectif | lampe torche | nuit |
| pills | Pilules | survivant | avale une pilule | boîte de pilules | maison |
| pack | Sac à dos | survivante | ajuste le sac | sac à dos | route |
| tape | Ruban adhésif | bricoleur | déroule le ruban | rouleau | atelier |
| keys | Clés du dépôt | survivant | agite les clés | trousseau | dépôt |
| supply | Ravitaillement | survivante | ouvre une caisse | caisse | route |
| airdrop | Largage | survivant | attrape la caisse | caisse au parachute | ciel |
| jerry | Jerrican | survivant | soulève le jerrican | jerrican | station-service |
| rest | Repos | survivante | s'étire | lit de camp | maison |
| radioop | Opérateur radio | opérateur | règle la radio | poste radio | antenne |
| billets | Vos billets ! | contrôleur | tend les billets | billets | gare |

### Réaction, rose (17)

| Fichier | Nom | Personnage | Pose et cadrage | Premier plan | Fond |
|---|---|---|---|---|---|
| tear | Gaz lacrymogène | policier masqué | tire au lanceur | lanceur et grenade | nuage |
| napalm | Napalm | pyromane | lance le bidon | bidon en feu | flammes |
| air | Frappe aérienne | soldat | parle à la radio | radio et pointeur | avions |
| grenade | Grenade | survivante | dégoupille | grenade | ruines |
| shot | Tir de l'abri | survivant | tire depuis la fenêtre | canon du fusil | maison |
| patch | Réparation express | bricoleuse | scotche en vitesse | ruban et clé | maison |
| molotov | Molotov | survivant | lance la bouteille | bouteille enflammée | rue |
| horn | Klaxon | survivante | appuie sur la corne | corne de brume | voiture |
| rush | Adrénaline | survivant | se pique au bras | seringue | nuit |
| talkie | Talkie-walkie | survivante | parle au talkie | talkie | maison |
| storm | Orage | survivant | lève une barre de fer | barre et éclair | pluie |
| bomber | Bombardier | soldat | tire une fusée | pistolet lance-fusées | bombardier |
| shell | Munition anti-Colosse | soldat | charge l'obus | gros obus | Colosse |
| noise | Boîte à bruit | gamin | lance un réveil | réveil | rue |
| v_napalm | Frappe au napalm | soldat des secours | marque la cible | fumigène | avion |
| retard | Retard en gare | chef de gare | brandit sa montre | montre à gousset | gare |
| coupsif | Coup de sifflet | contrôleuse | siffle | sifflet | quai |
