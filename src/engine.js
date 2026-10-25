// Moteur du jeu : règles pures, sans DOM. Utilisé par le jeu (navigateur) et par tools/simulate.js (Node).
const Z=(()=>{
 // traduction : _t vient de src/i18n.js dans le navigateur ; dans Node (tests), le texte français est gardé tel quel
 const _t=typeof globalThis!=='undefined'&&typeof globalThis._t==='function'?globalThis._t:(s,...a)=>typeof s==='string'?s:s.reduce((r,q,i)=>r+(i?a[i-1]:'')+q,'');
 // carte de 9×9 cases : l'anneau extérieur est la forêt d'où vient la horde, l'abri est au centre
 const N=11,C=(N*N-1)/2,MID=(N-1)/2,MAXS=10;let HPS=0,HPS2=.12;
 // frénésie meurtrière (v114, demande d'Amine) : +10 % dès la nuit 5, puis +10 % de plus chaque nuit (nuit 10 : +60 %, nuit 15 : +110 %…).
 // Elle s'applique aux PV ET aux dégâts des zombies (v188 ; les fractions de dégât s'accumulent coup après coup : 1,5 = un coup sur deux à 2).
 const HP_FROM=5,HP_STEP=.1;
 // niveaux de Menace (v116) : st.menace de 0 à 10 ; men(st,k) vaut vrai si la Menace k est active (elles se cumulent)
 const men=(st,k)=>((st&&st.menace)||0)>=k;
 const frenzyLv=(n,st)=>Math.max(0,n-(men(st,10)?3:HP_FROM)+1);
 const hpMult=(n,st)=>1+HP_STEP*frenzyLv(n,st);
 const dmgBonus=()=>0;
 const U={
  // défenses
  bar:{n:_t('Barricade'),cat:'wall',hp:7,block:1,v:_t('7 PV'),d:_t('Planches clouées : bloque les zombies, 7 PV')},
  car:{n:_t('Épave'),cat:'wall',hp:14,block:1,v:_t('14 PV'),d:_t('Carcasse de voiture : bloque, 14 PV')},
  fen:{n:_t('Clôture'),cat:'wall',hp:5,block:1,thorns:1,v:_t('5 PV'),d:_t('Clôture électrique : bloque, 5 PV, 1 dégât à chaque zombie qui la frappe')},
  sand:{n:_t('Sacs de sable'),cat:'wall',hp:6,block:1,cap:1,v:_t('6 PV'),d:_t('Bloque, 6 PV, ne perd jamais plus de 1 PV par coup')},
  door:{n:_t('Porte blindée'),cat:'wall',hp:18,block:1,near:1,v:_t('18 PV'),d:_t('Bloque, 18 PV, seulement sur une case collée à l’abri')},
  tire:{n:_t('Mur de pneus'),cat:'wall',hp:8,block:1,tire:1,v:_t('8 PV'),d:_t('Bloque, 8 PV, laisse une flaque d’essence en tombant')},
  // tireurs
  gun:{n:_t('Tireur'),cat:'shoot',hp:3,block:1,rng:2,dmg:2,every:1,v:_t('2 · P2'),d:_t('2 dégâts par tour, portée 2')},
  snp:{n:_t('Sniper'),cat:'shoot',hp:2,block:1,rng:4,dmg:5,every:2,v:_t('5 · P4'),d:_t('5 dégâts tous les 2 tours, portée 4')},
  sht:{n:_t('Fusil à pompe'),cat:'shoot',hp:4,block:1,rng:1,dmg:2,every:1,aoe:1,aoeMax:4,v:'2 ×4',d:_t('2 dégâts aux 4 zombies les plus proches à 1 case')},
  xbow:{n:_t('Arbalète'),cat:'shoot',hp:3,block:1,rng:2,dmg:2,every:1,hits:2,distinct:1,v:_t('2 ×2 · P2'),d:_t('À chaque tour, 2 dégâts à 2 zombies différents, portée 2')},
  flame:{n:_t('Lance-flammes'),cat:'shoot',hp:5,block:1,rng:2,dmg:1,every:1,ignite:3,v:_t('Feu · P2'),d:_t('1 dégât à 2 cases et enflamme le zombie : 1 dégât par tour pendant 3 tours, 5 PV')},
  mg:{n:_t('Mitrailleuse'),cat:'shoot',hp:3,block:1,rng:2,dmg:2,every:1,hits:3,jam:3,v:_t('2 ×3 · P2'),d:_t('3 tirs de 2 dégâts par tour, portée 2, s’enraye 1 tour sur 3')},
  molo:{n:_t('Cocktails'),cat:'shoot',hp:2,block:1,rng:2,dmg:2,every:3,molo:1,v:_t('Zone · P2'),d:_t('Tous les 3 tours, un cocktail sur le groupe le plus serré : 2 dégâts et feu, portée 2')},
  kid:{n:_t('Gamin'),cat:'shoot',hp:1,block:1,rng:2,dmg:1,every:1,hits:2,v:_t('1 ×2 · P2'),d:_t('Lance-pierre : 2 tirs de 1 dégât par tour, portée 2, mais 1 seul PV')},
  // corps à corps
  axe:{n:_t('Bûcheron'),cat:'melee',hp:7,block:1,rng:1,dmg:5,every:1,v:_t('5 · P1'),d:_t('5 dégâts par tour au corps à corps, 7 PV')},
  dog:{n:_t('Chien'),cat:'melee',hp:5,block:1,rng:1,dmg:2,every:1,hits:2,v:'2 ×2',d:_t('Mord 2 fois par tour (2 dégâts) au corps à corps, 5 PV')},
  cop:{n:_t('Policier'),cat:'melee',hp:9,block:1,rng:1,dmg:1,every:1,push:1,v:_t('1 · Recul'),d:_t('1 dégât au contact et repousse le zombie d’une case, 9 PV')},
  butch:{n:_t('Boucher'),cat:'melee',hp:6,block:1,rng:1,dmg:5,every:1,feed:1,v:_t('5 · Soin'),d:_t('5 dégâts au contact, récupère 1 PV à chaque zombie tué')},
  monk:{n:_t('Moine'),cat:'melee',hp:11,block:1,rng:1,dmg:1,every:1,aoe:1,v:_t('1 zone'),d:_t('1 dégât à tous les zombies autour de lui, 11 PV')},
  // soutien
  med:{n:_t('Infirmière'),cat:'help',hp:2,block:1,heal:1,hrng:2,v:_t('Soin · P2'),d:_t('Soin à distance : 1 PV tous les 2 tours à l’unité la plus blessée à 2 cases ou moins')},
  lamp:{n:_t('Projecteur'),cat:'post',hp:2,block:1,buff:1,v:'+1',d:_t('Les unités autour font +1 dégât')},
  radio:{n:_t('Radio'),cat:'post',hp:2,block:1,v:_t('+1 carte'),d:_t('Tant qu\'elle tient, tu pioches 1 carte de plus chaque jour')},
  cook:{n:_t('Cuisinier'),cat:'help',hp:2,block:1,cook:1,v:_t('+1 abri'),d:_t('À chaque aube, l’abri récupère 1 PV')},
  mech:{n:_t('Mécanicien'),cat:'help',hp:3,block:1,mech:1,v:_t('Répare'),d:_t('Répare 1 PV à une défense ou un poste voisin à chaque tour')},
  siren:{n:_t('Sirène'),cat:'post',hp:4,block:1,lure:2,v:_t('Attire'),d:_t('Les zombies à 2 cases ou moins marchent vers elle au lieu de l’abri')},
  lead:{n:_t('Chef de groupe'),cat:'help',hp:3,block:1,lead:1,v:_t('Rythme'),d:_t('Tous les 2 tours, les unités autour attaquent une fois de plus')},
  solar:{n:_t('Panneau solaire'),cat:'post',hp:2,block:1,solar:1,v:_t('Courant'),d:_t('Projecteurs et clôtures marchent pendant une coupure, clôtures à 2 dégâts')},
  // pièges
  trap:{n:_t('Piège à loup'),cat:'trap',hp:1,block:0,trap:5,v:'5',d:_t('Le premier zombie qui marche dessus subit 5 dégâts')},
  fire:{n:_t('Essence'),cat:'trap',hp:1,block:0,burn:1,v:_t('1/tour'),d:_t('Flaque enflammée : 1 dégât par tour aux zombies dessus, s\'éteint à l\'aube')},
  mine:{n:_t('Mine'),cat:'trap',hp:1,block:0,mine:6,v:_t('6 zone'),d:_t('Explose au passage : 6 dégâts sur la case et autour')},
  wire:{n:_t('Barbelés'),cat:'trap',hp:1,block:0,wire:1,v:_t('Ralentit'),d:_t('Ne bloque pas : 1 dégât et ralentit chaque zombie qui passe, reste en place')},
  spike:{n:_t('Fosse à pieux'),cat:'trap',hp:4,block:0,spike:3,v:'3 ×4',d:_t('3 dégâts à chaque zombie qui tombe dedans, casse après 4 zombies')},
  gas:{n:_t('Bonbonne de gaz'),cat:'trap',hp:1,block:1,gas:5,v:_t('5 zone'),d:_t('Bloque. Explose quand un zombie la frappe : 5 dégâts sur la case et autour')},
  smoke:{n:_t('Fumigène'),cat:'trap',hp:1,block:0,smoke:3,v:_t('Étourdit'),d:_t('Le premier zombie qui passe libère la fumée : les zombies autour sont perdus 3 tours')},
  bait:{n:_t('Appât'),cat:'trap',hp:3,block:0,bait:3,v:_t('Retient'),d:_t('Viande crue : 3 zombies s’arrêtent 3 tours pour manger')},
  dyn:{n:_t('Dynamite'),cat:'trap',hp:1,block:0,dyn:8,v:_t('8 zone'),d:_t('Explose au 8ᵉ tour de la nuit : 8 dégâts sur la case et autour')},
  // objets
  food:{n:_t('Conserves'),cat:'item',instant:1,gain:3,v:_t('+3 abri'),d:_t('Utilise-la sur l\'abri : +3 PV')},
  rep:{n:_t('Outils'),cat:'item',instant:1,gain:3,v:_t('+3 PV'),d:_t('Utilise-les sur l\'abri : toutes tes unités récupèrent 3 PV')},
  kit:{n:_t('Trousse de secours'),cat:'item',instant:1,onUnit:1,v:_t('Soin total'),d:_t('Utilise-la sur une de tes unités blessées : elle récupère tous ses PV')},
  coffee:{n:_t('Café'),cat:'item',instant:1,v:_t('+2 énergie'),d:_t('Utilise-le sur l’abri : gratuit, +2 énergie aujourd’hui')},
  roadmap:{n:_t('Carte routière'),cat:'item',instant:1,peek:3,v:_t('Fouille'),d:_t('Utilise-la sur l’abri : regarde les 3 prochaines cartes de ta pioche et prends-en une')},
  // --- extension : nouvelles cartes de faction ---
  riot:{n:_t('Agent anti-émeute'),cat:'melee',hp:14,block:1,rng:1,dmg:1,every:1,push:1,cap:2,v:_t('1 · Bouclier'),d:_t('Bouclier : 14 PV, ne perd jamais plus de 2 PV par coup, 1 dégât et repousse')},
  k9:{n:_t('Chien policier'),cat:'melee',hp:6,block:1,rng:1,dmg:1,every:1,hits:2,stun:1,v:_t('1 ×2 · Étourdit'),d:_t('Mord 2 fois par tour (1 dégât) ; la 1ʳᵉ morsure du tour étourdit le zombie 1 tour')},
  barrier:{n:_t('Barrage de police'),cat:'wall',hp:7,block:1,v:_t('7 PV'),d:_t('Barrières de police : bloque, 7 PV')},
  swat:{n:_t('Tireur d’élite du GIGN'),cat:'shoot',hp:4,block:1,rng:2,dmg:2,every:1,v:_t('2 · P2'),d:_t('2 dégâts par tour, portée 2')},
  mortar:{n:_t('Mortier'),cat:'shoot',hp:3,block:1,rng:4,dmg:3,every:3,blast:1,v:_t('3 zone · P4'),d:_t('Tous les 3 tours, un obus sur le groupe le plus serré : 3 dégâts sur la case et autour')},
  sentry:{n:_t('Sentinelle automatique'),cat:'shoot',hp:6,block:1,rng:2,dmg:1,every:1,hits:2,v:_t('1 ×2 · P2'),d:_t('Tourelle : 2 tirs de 1 dégât par tour, portée 2, 6 PV')},
  clay:{n:_t('Mine claymore'),cat:'trap',hp:1,block:0,clay:4,v:_t('4 grande zone'),d:_t('Explose au passage : 4 dégâts sur toutes les cases à 2 cases ou moins')},
  bunker:{n:_t('Bunker'),cat:'wall',hp:16,block:1,rng:1,dmg:1,every:1,v:_t('16 PV · 1'),d:_t('Bloque, 16 PV, et tire sur les zombies au contact')},
  pharma:{n:_t('Pharmacienne'),cat:'help',hp:3,block:1,heal:1,hfast:1,v:_t('Soin rapide'),d:_t('Soin au contact : 1 PV à chaque tour à l’unité voisine la plus blessée (8 cases autour)')},
  hospital:{n:_t('Hôpital de campagne'),cat:'post',hp:6,block:1,healAll:1,v:_t('Soin zone'),d:_t('Soin au contact : tous les 2 tours, toutes les unités sur les 8 cases autour récupèrent 1 PV')},
  priest:{n:_t('Prêtre'),cat:'help',hp:3,block:1,bless:1,v:_t('Protège'),d:_t('Une fois chacune, les unités voisines qui devraient tomber restent à 1 PV')},
  stretch:{n:_t('Brancardier'),cat:'help',hp:4,block:1,heal:1,hrng:3,v:_t('Soin · P3'),d:_t('Soin à distance : il court chercher les blessés, 1 PV tous les 2 tours à l’unité la plus blessée à 3 cases ou moins, 4 PV')},
  brasero:{n:_t('Brasero'),cat:'wall',hp:5,block:1,aura:1,v:_t('Brûle autour'),d:_t('Bloque. Tous les 2 tours, 1 dégât et feu aux zombies collés à lui')},
  firetrap:{n:_t('Fût piégé'),cat:'trap',hp:1,block:0,firetrap:4,v:_t('4 zone + feu'),d:_t('Explose au passage : 4 dégâts autour et les zombies brûlent 3 tours')},
  net:{n:_t('Filet'),cat:'trap',hp:2,block:0,net:4,v:_t('Immobilise'),d:_t('Le zombie qui passe est pris 4 tours, sert 2 fois')},
  bear:{n:_t('Piège à ours'),cat:'trap',hp:1,block:0,trap:10,v:'10',d:_t('Le premier zombie qui marche dessus subit 10 dégâts')},
  hunter:{n:_t('Chasseur'),cat:'shoot',hp:3,block:1,rng:2,dmg:2,every:1,v:_t('2 · P2'),d:_t('2 dégâts par tour, portée 2')},
  dogs:{n:_t('Meute de chiens'),cat:'melee',hp:7,block:1,rng:1,dmg:1,every:1,hits:4,v:'1 ×4',d:_t('4 morsures de 1 dégât par tour au corps à corps')},
  pitch:{n:_t('Fermier à la fourche'),cat:'melee',hp:10,block:1,rng:1,dmg:2,every:1,push:1,v:_t('2 · Recul'),d:_t('2 dégâts au contact et repousse le zombie d’une case, 10 PV')},
  scare:{n:_t('Épouvantail'),cat:'post',hp:6,block:1,lure:2,v:_t('Attire'),d:_t('Les zombies à 2 cases ou moins marchent vers lui au lieu de l’abri, 6 PV')},
  turret:{n:_t('Tourelle bricolée'),cat:'shoot',hp:4,block:1,rng:2,dmg:2,every:1,v:_t('2 · P2'),d:_t('2 dégâts par tour, portée 2, 4 PV')},
  workshop:{n:_t('Atelier'),cat:'post',hp:5,block:1,mech:1,mechAll:1,v:_t('Répare tout'),d:_t('Répare 1 PV à toutes les défenses et tous les postes voisins à chaque tour')},
  modwall:{n:_t('Mur modulaire'),cat:'wall',hp:9,block:1,v:_t('9 PV'),d:_t('Panneaux de tôle : bloque, 9 PV')},
  tesla:{n:_t('Bobine Tesla'),cat:'shoot',hp:4,block:1,rng:2,dmg:2,every:2,hits:3,distinct:1,needPow:1,v:_t('2 ×3 · P2'),d:_t('Tous les 2 tours, un arc frappe 3 zombies (2 dégâts). Inactive pendant une coupure')},
  teacher:{n:_t('Institutrice'),cat:'help',hp:3,block:1,draw:1,v:_t('+1 carte'),d:_t('Tant qu’elle tient, tu pioches 1 carte de plus chaque jour')},
  market:{n:_t('Marché'),cat:'post',hp:4,block:1,market:2,v:_t('+2 ferraille'),d:_t('À chaque aube, +2 ferraille')},
  vigile:{n:_t('Vigile'),cat:'shoot',hp:4,block:1,rng:2,dmg:1,every:1,v:_t('1 · P2'),d:_t('1 dégât par tour, portée 2, 4 PV')},
  carp:{n:_t('Charpentier'),cat:'help',hp:4,block:1,carp:2,v:_t('Répare'),d:_t('À chaque aube, les défenses et les postes voisins récupèrent 2 PV')},
  tear:{n:_t('Gaz lacrymogène'),cat:'react',react:'cell',v:_t('Étourdit'),d:_t('Pendant la nuit : les zombies sur la case visée et autour sont perdus 3 tours')},
  napalm:{n:_t('Napalm'),cat:'react',react:'cell',v:_t('Feu zone'),d:_t('Pendant la nuit : la case visée et autour s’embrasent (flaques de feu jusqu’à l’aube)')},
  air:{n:_t('Frappe aérienne'),cat:'react',react:'cell',v:_t('10 zone'),d:_t('Pendant la nuit : 10 dégâts à tous les zombies à 2 cases ou moins de la case visée')},
  // combattants des factions de soutien
  amb:{n:_t('Ambulancier'),cat:'melee',hp:11,block:1,rng:1,dmg:1,every:1,push:1,v:_t('1 · Recul'),d:_t('Bloque avec son brancard : 11 PV, 1 dégât au contact et repousse le zombie')},
  doc:{n:_t('Médecin de garde'),cat:'shoot',hp:4,block:1,rng:1,dmg:1,every:1,selfHeal:1,v:_t('1 · P1 · Soin'),d:_t('Pistolet : 1 dégât par tour, portée 1, et récupère 1 PV tous les 2 tours')},
  orderly:{n:_t('Infirmier costaud'),cat:'melee',hp:7,block:1,rng:1,dmg:2,every:1,healKill:1,v:_t('2 · Soigne'),d:_t('2 dégâts au contact. À chaque zombie tué, ses voisins récupèrent 1 PV')},
  nailer:{n:_t('Cloueur'),cat:'shoot',hp:4,block:1,rng:2,dmg:1,every:1,hits:2,v:_t('1 ×2 · P2'),d:_t('Cloueuse pneumatique : 2 tirs de 1 dégât par tour, portée 2')},
  ranger:{n:_t('Garde champêtre'),cat:'shoot',hp:4,block:1,rng:2,dmg:2,every:1,v:_t('2 · P2'),d:_t('Fusil de chasse : 2 dégâts par tour, portée 2')},
  // chefs de faction (légendaires) : chacun compte pour 2 survivants de sa faction
  chief_police:{n:_t('Le Commissaire'),cat:'shoot',hp:5,block:1,rng:2,dmg:2,every:1,chief:'police',v:_t('2 · P2'),d:_t('Chef de la Police : 2 dégâts par tour, portée 2. Compte pour 2 dans la faction Police')},
  chief_mil:{n:_t('La Sergente'),cat:'shoot',hp:5,block:1,rng:2,dmg:1,every:1,hits:3,chief:'mil',v:_t('1 ×3 · P2'),d:_t('Cheffe des Militaires : 3 tirs par tour, portée 2. Compte pour 2 Militaires')},
  chief_care:{n:_t('La Doctoresse'),cat:'help',hp:5,block:1,rng:1,dmg:2,every:1,heal:2,hfast:1,hrng:2,chief:'care',v:_t('Soin 2 · P2'),d:_t('Cheffe des Soignants : soin à distance de 2 PV à chaque tour (2 cases) et coups de scalpel au contact (2 dégâts). Compte pour 2 Soignants')},
  chief_pyro:{n:_t('Le Pyromane'),cat:'shoot',hp:5,block:1,rng:2,dmg:1,every:1,aoe:1,ignite:3,chief:'pyro',v:_t('Feu zone'),d:_t('Chef des Pyromanes : enflamme tous les zombies à 2 cases. Compte pour 2 Pyromanes')},
  chief_trap:{n:_t('Le Braconnier'),cat:'shoot',hp:4,block:1,rng:3,dmg:3,every:2,chief:'trap',v:_t('3 · P3'),d:_t('Chef des Trappeurs : 3 dégâts tous les 2 tours, portée 3. Compte pour 2 Trappeurs')},
  chief_farm:{n:_t('La Fermière'),cat:'melee',hp:14,block:1,rng:1,dmg:1,every:1,hits:2,chief:'farm',v:'1 ×2',d:_t('Cheffe des Fermiers : 2 coups de 1 dégât par tour, 14 PV. Compte pour 2 Fermiers')},
  chief_tech:{n:_t('L’Ingénieur'),cat:'help',hp:6,block:1,rng:1,dmg:1,every:1,hits:2,mech:2,chief:'tech',v:_t('Répare 2 · 1 ×2'),d:_t('Chef des Bricoleurs : répare 2 PV aux défenses et postes voisins à chaque tour et tire 2 clous par tour (portée 1). Compte pour 2 Bricoleurs')},
  chief_comm:{n:_t('Le Maire'),cat:'help',hp:5,block:1,rng:1,dmg:2,every:1,lead:1,chief:'comm',v:_t('Rythme · 2'),d:_t('Chef de la Communauté : les unités autour attaquent plus souvent, et il tire (2 dégâts, portée 1). Compte pour 2 dans la faction Communauté')},
  // réactions : jouables seulement pendant la nuit, avec l'énergie gardée du jour
  grenade:{n:_t('Grenade'),cat:'react',react:'cell',v:_t('5 zone'),d:_t('Pendant la nuit : 5 dégâts sur la case visée et autour')},
  shot:{n:_t('Tir de l’abri'),cat:'react',react:'any',v:'6',d:_t('Pendant la nuit : 6 dégâts au zombie le plus proche de l’abri')},
  patch:{n:_t('Réparation express'),cat:'react',react:'unit',v:_t('+5 PV'),d:_t('Pendant la nuit : une de tes unités récupère 5 PV')},
  molotov:{n:_t('Molotov'),cat:'react',react:'cell',v:_t('Feu zone'),d:_t('Pendant la nuit : 2 dégâts sur la case visée et autour, et les zombies y brûlent 4 tours')},
  horn:{n:_t('Klaxon'),cat:'react',react:'any',v:_t('Recul'),d:_t('Pendant la nuit : tous les zombies reculent d’une case')},
  rush:{n:_t('Adrénaline'),cat:'react',react:'any',v:'×2',d:_t('Pendant la nuit : tes unités attaquent deux fois pendant 3 tours')},
  rocket:{n:_t('Lance-roquettes'),cat:'shoot',hp:4,block:1,rng:2,dmg:2,every:2,heavy:5,v:_t('2 · ×5 gros'),d:_t('Tous les 2 tours, une roquette : 2 dégâts, et 5 fois plus (10) contre le Colosse et les Gonflés. Portée 2')},
  flare:{n:_t('Fusée de détresse'),cat:'item',instant:1,flare:1,v:_t('1 côté'),d:_t('Utilise-la sur l’abri : la nuit prochaine, la horde n’arrive que d’un seul côté')},
  // --- v89 : 6 nouveaux survivants ---
  handler:{n:_t('Maître-chien'),cat:'melee',hp:12,block:1,rng:1,dmg:1,every:1,dogBoost:1,v:_t('1 · Chiens +1'),d:_t('Tank : 12 PV, 1 dégât au contact. Les chiens voisins font +1 dégât')},
  welder:{n:_t('Soudeuse'),cat:'help',hp:4,block:1,mech:2,v:_t('Répare 2'),d:_t('Répare 2 PV par tour à une défense ou un poste voisin')},
  scout:{n:_t('Éclaireur'),cat:'shoot',hp:3,block:1,rng:4,dmg:2,every:1,mark:2,v:_t('2 · P4 · Marque'),d:_t('2 dégâts par tour, portée 4. Le zombie touché est marqué 2 tours : il prend +1 dégât de chaque coup')},
  assassin:{n:_t('Assassin'),cat:'melee',hp:5,block:1,rng:1,dmg:2,every:1,exec:4,v:_t('2 · Exécute'),d:_t('2 dégâts au contact. Toutes les 4 attaques, il tue d’un coup un zombie ordinaire (pas le Colosse)')},
  fieldnurse:{n:_t('Infirmière de campagne'),cat:'help',hp:3,block:1,heal:1,hrng:2,benchHeal:2,v:_t('Soin · P2'),d:_t('Soin à distance : 1 PV tous les 2 tours à l’unité la plus blessée à 2 cases. À l’aube, les unités en réserve (non blessées) récupèrent 2 PV')},
  genmech:{n:_t('Électricien'),cat:'help',hp:4,block:1,mech:1,genPow:1,v:_t('Courant · Répare'),d:_t('Tant qu’il est sur la carte : plus de coupure de courant et clôtures à 2 dégâts. Répare 1 PV par tour à une défense ou un poste voisin')},
  // --- v120 : cartes de victoire (vic = niveau de Mutation à vaincre pour la débloquer ; jamais en boutique ni à l'achat)
  v_heli:{n:_t('Hélicoptère de ravitaillement'),cat:'item',instant:1,vic:0,v:_t('+2 énergie · +2 cartes'),d:_t('Utilise-le sur l’abri : +2 énergie aujourd’hui et pioche 2 cartes')},
  v_hmg:{n:_t('Mitrailleuse lourde'),cat:'shoot',hp:6,block:1,rng:2,dmg:2,every:1,hits:3,vic:1,v:_t('2 ×3 · P2'),d:_t('3 tirs de 2 dégâts par tour, portée 2, sans jamais s’enrayer')},
  v_radio:{n:_t('Radio militaire'),cat:'post',hp:5,block:1,vic:2,v:_t('Tireurs +1'),d:_t('Les tireurs à 2 cases ou moins font +1 dégât')},
  v_medic:{n:_t('Médecin militaire'),cat:'help',hp:5,block:1,heal:2,hrng:3,vic:3,v:_t('Soin 2 · P3'),d:_t('Soin à distance : 2 PV tous les 2 tours à l’unité la plus blessée à 3 cases ou moins')},
  v_cont:{n:_t('Mur de conteneurs'),cat:'wall',hp:20,block:1,antiSap:5,vic:4,v:_t('20 PV · anti-sapeur'),d:_t('Bloque, 20 PV. Un Sapeur ne lui fait que 5 dégâts')},
  v_sniper:{n:_t('Tireur des secours'),cat:'shoot',hp:4,block:1,rng:4,dmg:6,every:2,vic:5,v:_t('6 · P4'),d:_t('6 dégâts tous les 2 tours, portée 4')},
  v_mines:{n:_t('Champ de mines'),cat:'trap',hp:3,block:0,mine:8,multi:1,vic:6,v:_t('8 zone ×3'),d:_t('Explose au passage : 8 dégâts sur la case et autour, 3 fois')},
  v_rdog:{n:_t('Chien de sauvetage'),cat:'melee',hp:7,block:1,rng:1,dmg:2,every:1,hits:2,heal:1,vic:7,v:_t('2 ×2 · Soin'),d:_t('Mord 2 fois par tour (2 dégâts) et soigne 1 PV à un voisin tous les 2 tours')},
  v_napalm:{n:_t('Frappe au napalm'),cat:'react',react:'cell',vic:8,v:_t('4 · Feu zone'),d:_t('Pendant la nuit : 4 dégâts sur la case visée et autour, qui s’embrasent ensuite')},
  v_apc:{n:_t('Blindé des secours'),cat:'melee',hp:30,block:1,rng:1,dmg:1,every:1,push:1,vic:9,v:_t('30 PV · 1'),d:_t('Tank : 30 PV, 1 dégât et repousse ; attire les zombies proches')},
  // --- v76 : logistique (équipements, postes de soutien, nouvelles défenses, pièges, objets et réactions) ---
  // équipements : se posent sur une de tes unités et y restent (même rappelée). Une unité ne porte qu'un exemplaire de chaque équipement.
  gear:{n:_t('Matériel lourd'),cat:'item',instant:1,onUnit:1,equip:1,v:_t('+4 PV'),d:_t('Équipement : l’unité gagne 4 PV max. Un Tank équipé bloque 1 coup sur 2')},
  binoc:{n:_t('Jumelles'),cat:'item',instant:1,onUnit:1,equip:1,far:1,v:_t('+1 portée'),d:_t('Équipement d’un tireur : +1 portée, et +1 dégât sur les zombies à plus de 2 cases')},
  bandage:{n:_t('Bandages'),cat:'item',instant:1,onUnit:1,equip:1,att:1,v:_t('Soin au kill'),d:_t('Équipement : l’unité récupère 1 PV à chaque zombie qu’elle tue')},
  medkit:{n:_t('Sacoche de soins'),cat:'item',instant:1,onUnit:1,equip:1,v:_t('Soigne'),d:_t('Équipement : tous les 2 tours, l’unité soigne 1 PV à un voisin blessé')},
  torch:{n:_t('Lampe torche'),cat:'item',instant:1,onUnit:1,equip:1,att:1,v:_t('+1 frais'),d:_t('Équipement : ignore le Brouillard, +1 dégât sur les zombies encore intacts')},
  pills:{n:_t('Pilules'),cat:'item',instant:1,onUnit:1,equip:1,v:_t('Sursaut'),d:_t('Équipement : une fois par nuit, l’unité qui devrait tomber reste debout avec 4 PV')},
  pack:{n:_t('Sac à dos'),cat:'item',instant:1,onUnit:1,equip:1,att:1,v:_t('Butin'),d:_t('Équipement : à l’aube, +1 ferraille par zombie tué par l’unité pendant la nuit')},
  tape:{n:_t('Ruban adhésif'),cat:'item',instant:1,onUnit:1,equip:1,gold:1,v:'+1 / ★',d:_t('Équipement d’une unité fusionnée : +1 dégât par étoile')},
  keys:{n:_t('Clés du dépôt'),cat:'item',instant:1,onUnit:1,equip:1,v:_t('Hors limite'),d:_t('Équipement : l’unité ne compte plus dans la limite d’unités')},
  // postes de soutien : ne comptent pas dans la limite d'unités. Leur effet ne se cumule pas (une unité profite d'un seul poste de chaque sorte).
  tower:{n:_t('Mirador'),cat:'post',hp:8,block:1,v:_t('+1 portée'),d:_t('Les tireurs voisins ont +1 portée')},
  trench:{n:_t('Tranchée'),cat:'post',hp:6,block:1,v:_t('Abri'),d:_t('Les unités voisines perdent 1 PV de moins par coup (au moins 1)')},
  pump:{n:_t('Pompe à eau'),cat:'post',hp:5,block:1,v:_t('Soin à l’aube'),d:_t('À l’aube, les unités voisines récupèrent tous leurs PV')},
  flood:{n:_t('Projecteur de chantier'),cat:'post',hp:3,block:1,v:_t('Éclaire'),d:_t('Les zombies à 2 cases ou moins prennent +1 dégât de chaque coup. Inactif pendant une coupure')},
  // défenses
  palis:{n:_t('Palissade'),cat:'wall',hp:6,block:1,thorns:1,v:_t('6 PV · pieux'),d:_t('Pieux taillés : bloque, 6 PV, 1 dégât à chaque zombie qui la frappe')},
  gate:{n:_t('Grille métallique'),cat:'wall',hp:10,block:1,regen:4,v:_t('10 PV · se répare'),d:_t('Bloque, 10 PV, récupère 1 PV tous les 4 tours')},
  gabion:{n:_t('Gabions'),cat:'wall',hp:12,block:1,antiSap:5,v:_t('12 PV · anti-sapeur'),d:_t('Bloque, 12 PV. Un Sapeur ne lui fait que 5 dégâts')},
  // pièges
  log:{n:_t('Tronc oscillant'),cat:'trap',hp:1,block:0,log:5,v:_t('5 · recul ×3'),d:_t('5 dégâts et repousse de 2 cases, 3 fois par nuit')},
  pit:{n:_t('Fosse piégée'),cat:'trap',hp:1,block:0,pit:1,v:_t('Avale'),d:_t('Le premier zombie ordinaire qui passe y meurt. Ensuite, le trou ralentit les suivants')},
  glass:{n:_t('Verre brisé'),cat:'trap',hp:1,block:0,bleed:3,v:_t('Saigne'),d:_t('Les zombies qui passent saignent : 1 dégât par tour pendant 3 tours')},
  cans:{n:_t('Boîtes de conserve'),cat:'trap',hp:1,block:0,alarm:3,v:_t('Alerte'),d:_t('Le premier zombie qui passe donne l’alerte : tes tireurs font +1 dégât pendant 3 tours')},
  rocks:{n:_t('Éboulement'),cat:'trap',hp:1,block:0,rocks:6,v:_t('6 zone'),d:_t('Des rochers tombent au passage : 6 dégâts sur la case et autour')},
  // objets
  supply:{n:_t('Ravitaillement'),cat:'item',instant:1,v:_t('+6 ferraille'),d:_t('Utilise-le sur l’abri : +6 ferraille')},
  airdrop:{n:_t('Largage'),cat:'item',instant:1,v:_t('+3 cartes'),d:_t('Utilise-le sur l’abri : pioche 3 cartes')},
  jerry:{n:_t('Jerrican'),cat:'item',instant:1,v:_t('+2 énergie demain'),d:_t('Utilise-le sur l’abri : +2 énergie demain')},
  rest:{n:_t('Repos'),cat:'item',instant:1,v:_t('Réserve soignée'),d:_t('Utilise-le sur l’abri : les unités en réserve récupèrent tous leurs PV, et les blessés sont guéris tout de suite')},
  radioop:{n:_t('Opérateur radio'),cat:'item',instant:1,v:_t('+1 unité'),d:_t('Utilise-le sur l’abri : +1 unité à la limite, pour toute la partie (une seule fois par partie)')},
  // réactions
  talkie:{n:_t('Talkie-walkie'),cat:'react',react:'unit',v:_t('Relève'),d:_t('Pendant la nuit : une unité blessée part en réserve, la plus solide de la réserve prend sa place')},
  storm:{n:_t('Orage'),cat:'react',react:'any',v:_t('Ralentit'),d:_t('Pendant la nuit : tous les zombies perdent 2 tours, mais le feu s’éteint')},
  bomber:{n:_t('Bombardier'),cat:'react',react:'cell',v:_t('8 en ligne'),d:_t('Pendant la nuit : 8 dégâts à tous les zombies de la ligne visée')},
  shell:{n:_t('Munition anti-Colosse'),cat:'react',react:'any',antiboss:1,once:1,v:_t('Boss'),d:_t('Pendant la nuit, quand un boss est sur la carte (Colosse, Mère, Patient Zéro) : un tir qui lui inflige 15 dégâts plus le quart de ses PV max, sans armure. Usage unique')},
  noise:{n:_t('Boîte à bruit'),cat:'react',react:'cell',v:_t('Attire'),d:_t('Pendant la nuit : les zombies marchent vers la case visée pendant 4 tours')},
  // évolutions secrètes : jamais dans le deck, elles naissent de deux cartes précises posées côte à côte (voir EVO)
  k9squad:{n:_t('Brigade canine'),cat:'melee',hp:8,block:1,rng:1,dmg:3,every:1,hits:2,stun:1,push:1,evo:1,v:_t('3 ×2 · Étourdit'),d:_t('Un policier et son chien : 2 morsures de 3 dégâts par tour, qui étourdissent et repoussent')},
  nightsnp:{n:_t('Tireur de nuit'),cat:'shoot',hp:4,block:1,rng:4,dmg:3,every:1,evo:1,v:_t('3 · P4'),d:_t('Un sniper et son projecteur : 3 dégâts à chaque tour, portée 4')},
  heavyflame:{n:_t('Lance-flammes lourd'),cat:'shoot',hp:7,block:1,rng:2,dmg:2,every:1,aoe:1,aoeMax:6,ignite:3,evo:1,v:_t('Feu ×6 · P2'),d:_t('2 dégâts à 6 zombies au plus à 2 cases, qui brûlent ensuite 3 tours')},
  fortin:{n:_t('Fortin'),cat:'wall',hp:32,block:1,rng:1,dmg:3,every:1,evo:1,v:_t('32 PV · 3'),d:_t('Épave et bunker soudés : bloque, 32 PV, et frappe les zombies au contact (3 dégâts)')},
  autogun:{n:_t('Tourelle automatique'),cat:'shoot',hp:7,block:1,rng:2,dmg:1,every:1,hits:3,evo:1,v:_t('1 ×3 · P2'),d:_t('Montée par le mécanicien : 3 tirs de 1 dégât par tour, portée 2')},
  slaughter:{n:_t('Équarrisseur'),cat:'melee',hp:9,block:1,rng:1,dmg:5,every:1,aoe:1,feed:1,evo:1,v:_t('5 zone · Soin'),d:_t('5 dégâts à tous les zombies autour, récupère 1 PV par zombie tué')},
  canteen:{n:_t('Cantine de campagne'),cat:'help',hp:6,block:1,heal:2,hfast:1,cook:2,evo:1,v:_t('Soin 2 · +2 abri'),d:_t('Soin au contact : 2 PV à chaque tour à l’unité voisine la plus blessée, et l’abri récupère 2 PV à chaque aube')},
  gang:{n:_t('Bande de gamins'),cat:'shoot',hp:5,block:1,rng:2,dmg:1,every:1,hits:4,evo:1,v:_t('1 ×4 · P2'),d:_t('Toute la classe au lance-pierre : 4 tirs de 1 dégât par tour, portée 2')},
  saint:{n:_t('Le Saint'),cat:'melee',hp:13,block:1,rng:1,dmg:1,every:1,aoe:1,bless:1,evo:1,v:_t('1 zone · Protège'),d:_t('1 dégât à tous les zombies autour, et ses voisins survivent une fois à un coup fatal')},
  tracker:{n:_t('Traqueur'),cat:'shoot',hp:5,block:1,rng:3,dmg:2,every:1,hits:2,distinct:1,evo:1,v:_t('2 ×2 · P3'),d:_t('À chaque tour, 2 dégâts à 2 zombies différents, portée 3')}
 };
 /* rôles des unités : 🛡️ Tank, ❤️ Soin, ⚔️ DPS (les autres sont des murs, pièges, objets ou du soutien)
    Tank : provoque les zombies à 3 cases ou moins (ils le visent au lieu de l'abri) et bloque 1 coup sur 3.
    Soin : soigne le double sur un Tank. DPS : +1 dégât s'il a un Tank voisin (à couvert).
    Escouade : une unité qui a, avec ses voisins, un Tank, un Soin et un DPS gagne +1 dégât (ou +1 soin). */
 const ROLES={tank:{n:_t('Tank'),ic:'🛡️'},heal:{n:_t('Soin'),ic:'❤️'},dps:{n:_t('DPS'),ic:'⚔️'}};
 const TANKS='riot amb monk cop pitch chief_farm saint handler v_apc'.split(' '),HEALS='med pharma stretch hospital priest orderly doc chief_care canteen fieldnurse v_medic'.split(' ');
 const TAUNT=3;
 function roleOf(t){t=baseOf(t);const D=U[t];if(!D||!D.block||!isUnit(t))return null;if(TANKS.includes(t))return'tank';if(HEALS.includes(t))return'heal';
  if(D.dmg&&(D.cat==='shoot'||D.cat==='melee'))return'dps';return null}
 // les évolutions ne sont jamais tirées : elles restent hors des cartes jouables
 const KEYS=Object.keys(U).filter(t=>!U[t].evo);
 const EVO={k9squad:['cop','dog'],nightsnp:['snp','lamp'],heavyflame:['flame','gas'],fortin:['car','bunker'],autogun:['gun','mech'],slaughter:['axe','butch'],canteen:['med','cook'],gang:['kid','teacher'],saint:['monk','priest'],tracker:['xbow','hunter']};
 const EVO_KEYS=Object.keys(EVO);
 // survivants nommés : chaque humain ou chien posé reçoit un prénom et un trait, compte ses victimes, et meurt pour de bon
 const HUMANS='gun snp sht xbow flame mg molo kid axe cop butch monk med cook mech lead riot swat pharma priest stretch hunter pitch teacher vigile carp amb doc orderly nailer ranger handler welder scout assassin fieldnurse genmech v_hmg v_medic v_sniper'.split(' ');
 const NAMES='Marco Léa Karim Sofia Hugo Nadia Bruno Inès Yanis Chloé Malik Julie Théo Amira Victor Lina Samir Emma Rachid Zoé Paul Yasmine Louis Clara Mehdi Sarah Hector Nora Igor Maya Omar Jade Gaston Lou Bilal Rose Kenji Alice Driss Margot'.split(' ');
 const DOG_NAMES='Rex Kira Brutus Lola Tyson Médor Nala Rocky'.split(' ');
 const TRAITS={
  costaud:{n:_t('Costaud'),d:_t('+2 PV'),hpB:2},
  fragile:{n:_t('Fragile'),d:_t('−1 PV'),hpB:-1},
  precis:{n:_t('Précis'),d:_t('+1 dégât'),dmgB:1,att:1},
  myope:{n:_t('Myope'),d:_t('−1 portée'),rngB:-1,far:1},
  increvable:{n:_t('Increvable'),d:_t('survit une fois à un coup fatal')},
  coriace:{n:_t('Coriace'),d:_t('récupère 1 PV à chaque aube'),regen:1},
  aguerri:{n:_t('Aguerri'),d:_t('+1 dégât après 10 zombies tués'),att:1}
 };
 const named=t=>(t=baseOf(t),HUMANS).includes(t)||t==='dog'||t==='k9'||t==='dogs'||!!(U[t]&&U[t].chief);
 // PV max : la version dorée (fusion) a deux fois plus de PV, chaque niveau défensif ajoute 3 PV
 // murs reliés : chaque mur gagne +1 PV max par mur voisin (jusqu'à +3)
 // équipements portés par une unité
 const eqOf=u=>(u&&u.eq)||[],hasEq=(u,t)=>eqOf(u).includes(t);
 // une unité profite-t-elle d'un poste de soutien voisin de ce type ?
 const nearPost=(st,i,t)=>around(i).some(j=>st.grid[j]&&st.grid[j].t===t);
 // unités (survivants, chiens, machines, chefs, évolutions) : limitées sur le terrain. Les murs et les pièges ne comptent pas.
 const isUnit=t=>!!(U[t]&&U[t].block&&(U[t].cat==='shoot'||U[t].cat==='melee'||U[t].cat==='help'));
 const DOGS=['dog','dogs','k9','k9squad','v_rdog'];
 const isWallU=v=>!!(v&&U[v.t]&&U[v.t].cat==='wall'&&U[v.t].block);
 const linkB=(st,j)=>j<0?0:Math.min(3,around(j).filter(k=>isWallU(st.grid[k])).length);
 const maxHp=(st,u)=>Math.max(1,(st&&st.grid&&isWallU(u)?linkB(st,st.grid.indexOf(u)):0)+Math.ceil(stat(st,u.t).hp*(1+1.2*(u.gold||0))*(u.ed==='arm'?1.5:1))+((TRAITS[u.trait]||{}).hpB||0)+(u.lvD||0)*3+(u.leg?2:0)+(st&&st.grid&&famW(u.t)&&famLevel(st,famOf(u.t))>=2?2:0)+(hasEq(u,'gear')?4:0));
 const unitDmg=u=>{const T=TRAITS[u.trait]||{};return (hasEq(u,'tape')?(u.gold||0):0)+(T.dmgB||0)+(u.trait==='aguerri'&&(u.kills||0)>=10?1:0)+(u.lvA||0)+(u.gold||0)+(u.leg?1:0)+(u.ed==='dor'?1:0)};
 /* v181 : éditions spéciales, des cartes de collection. Une carte spéciale s'écrit « type~éd » (ex. butch~dor) : elle n'existe
    que dans la collection et les decks (jamais tirée). Posée, l'unité redevient son type normal et porte u.ed. Seules les unités en ont. */
 const EDS={dor:{n:_t('Dorée'),d:_t('+1 dégât'),att:1},arm:{n:_t('Blindée'),d:_t('+50 % de PV')},
  fan:{n:_t('Fantôme'),d:_t('Ne compte pas dans la limite d’unités (2 au plus)')},holo:{n:_t('Holographique'),d:_t('+1 ferraille par zombie tué'),att:1},
  sang:{n:_t('Ensanglantée'),d:_t('Récupère 1 PV par zombie tué'),att:1}};
 const ED_IDS=Object.keys(EDS),ED_MAX=5,FAN_MAX=2,ED_GOAL={dor:500,arm:20,sang:20};
 function baseOf(t){return(U[t]&&U[t].base)||t}
 function edOf(t){return(U[t]&&U[t].ed)||null}
 // la carte d'une unité posée (avec son édition)
 function ck(u){return u.ed?u.t+'~'+u.ed:u.t}
 const edOk=(t,e)=>!!(U[t]&&!U[t].ed&&!U[t].evo&&isUnit(t)&&EDS[e]&&(!EDS[e].att||!!U[t].dmg));
 // héritage : un survivant tombé après 100 victimes laisse un souvenir ; dans la partie suivante, la première unité de son métier gagne +1 dégât et +2 PV
 const LEGACY_KILLS=100;
 // héritage retiré (v82) : presque jamais vu
 const legacies=()=>[];
 // niveaux : tous les 20 zombies tués, l'unité gagne un niveau, offensif (+1 dégât) ou défensif (+3 PV max et soin complet)
 const LVL=20;
 // kills nécessaires : niveau 1 à 20, puis 25 de plus, 30 de plus, 35… (sans plafond)
 const lvKills=n=>n*LVL+5*n*(n-1)/2;
 const lvOf=k=>{let n=0;while(lvKills(n+1)<=k)n++;return n};
 const lvPending=u=>u?lvOf(u.kills||0)-(u.lvA||0)-(u.lvD||0):0;
 const lvReady=st=>st.grid.findIndex(u=>u&&U[u.t].block&&lvPending(u)>0);
 function levelUp(st,i,kind){const u=st.grid[i];if(!u||lvPending(u)<=0)return false;
  if(kind==='atk')u.lvA=(u.lvA||0)+1;else{u.lvD=(u.lvD||0)+1;u.hp=maxHp(st,u)}return true}
 // énergie : chaque jour on a ENERGY points, chaque carte coûte de 0 à 3 selon sa puissance
 const ENERGY=4,HAND_MAX=8;
 const COST={v_heli:1,v_hmg:3,v_radio:2,v_medic:2,v_cont:3,v_sniper:3,v_mines:2,v_rdog:2,v_napalm:2,v_apc:3,rocket:3,amb:2,doc:2,orderly:2,nailer:2,ranger:2,riot:2,k9:1,barrier:2,swat:3,mortar:3,sentry:2,clay:2,bunker:3,pharma:2,hospital:3,priest:2,stretch:1,brasero:2,firetrap:1,net:1,bear:2,hunter:2,dogs:2,pitch:2,scare:1,turret:2,workshop:3,modwall:2,tesla:3,teacher:2,market:2,vigile:1,carp:2,tear:1,napalm:2,air:3,chief_police:3,chief_mil:3,chief_care:3,chief_pyro:3,chief_trap:3,chief_farm:3,chief_tech:3,chief_comm:3,coffee:0,grenade:1,shot:1,patch:1,molotov:2,horn:2,rush:2};
 'bar fen sand trap fire wire smoke bait food kid dog med roadmap kit flare'.split(' ').forEach(t=>COST[t]=1);
 'gun axe cop tire spike mine lamp radio cook mech butch monk flame xbow rep gas'.split(' ').forEach(t=>COST[t]=2);
 'car door snp sht mg molo siren lead solar dyn'.split(' ').forEach(t=>COST[t]=3);
 // équilibrage v63 : constructions à tracer plus chères, épave moins chère, chiens plus chers, arbalète plus chère
 Object.assign(COST,{bar:2,sand:2,fen:2,car:2,dog:2,dogs:3,xbow:3});
 Object.assign(COST,{handler:2,welder:2,scout:3,assassin:3,fieldnurse:2,genmech:2,gear:1,binoc:1,bandage:1,medkit:2,torch:1,pills:1,pack:1,tape:1,keys:3,tower:2,trench:2,pump:2,flood:2,palis:2,gate:2,gabion:3,
  shell:1,log:2,pit:2,glass:1,cans:1,rocks:2,supply:1,airdrop:2,jerry:1,rest:0,radioop:3,talkie:1,storm:2,bomber:3,noise:1});
 const cost=t=>COST[t]??2;
 const ZT={
  walk:{n:_t('Rôdeur'),hp:17,spd:2,dmg:1,info:_t('lent')},
  run:{n:_t('Coureur'),hp:12,spd:1,dmg:1,info:_t('rapide')},
  fat:{n:_t('Gonflé'),hp:45,spd:3,dmg:2,info:_t('très lent, 2 dégâts par coup')},
  zdog:{n:_t('Chien zombie'),hp:6,spd:1,dmg:1,info:_t('rapide et fragile')},
  crawl:{n:_t('Rampant'),hp:12,spd:2,dmg:1,crawl:1,info:_t('passe sous les défenses (barricades, épaves…)')},
  spit:{n:_t('Cracheur'),hp:17,spd:2,dmg:1,spit:1,info:_t('crache sur ce qui est à 2 cases devant lui, puis avance après 3 crachats')},
  armor:{n:_t('Blindé'),hp:29,spd:2,dmg:1,armor:1,info:_t('encaisse 1 dégât de moins par coup, sauf le feu')},
  howl:{n:_t('Hurleur'),hp:23,spd:2,dmg:1,howl:2,info:_t('appelle 2 rôdeurs en mourant')},
  sap:{n:_t('Sapeur'),hp:18,spd:2,dmg:3,sap:1,info:_t('fonce sur les murs et explose : 15 dégâts au rempart, 3 autour, même s’il est tué avant')},
  boss:{n:_t('Le Colosse'),hp:58,spd:3,dmg:2,boss:1,info:_t('boss de la nuit 10, et renfort des nuits 20 et 30 : 10 dégâts par coup sur tes défenses et tes unités (+2 toutes les 10 nuits), fonce tout droit et frappe l’abri sans mourir')},
  // v128 : deux nouveaux boss. Toutes les 10 nuits, un boss mène la horde : le Colosse (10), la Mère (20), le Patient Zéro (30), puis on recommence.
  mere:{n:_t('La Mère'),hp:50,spd:3,dmg:2,boss:1,brood:4,info:_t('boss de la nuit 20 : fonce tout droit et frappe comme le Colosse, pond un rampant tous les 4 tours (6 au plus) et en libère 2 en mourant')},
  zero:{n:_t('Le Patient Zéro'),hp:42,spd:2,dmg:2,boss:1,haste:2,info:_t('boss final de la nuit 30 : plus rapide et plus fragile que le Colosse, frappe aussi fort ; les zombies à 2 cases de lui avancent bien plus vite (sauf les plus rapides)')}
 };
 const ZK=Object.keys(ZT);
 const EVENTS=[
  {id:'calme',n:_t('Nuit calme'),d:_t('Aucun effet'),p:_t('Le vent retient son souffle.')},
  {id:'brume',n:_t('Brouillard'),d:_t('Portée des tireurs −1'),p:_t('La brume avale les silhouettes.')},
  {id:'lune',n:_t('Pleine lune'),d:_t('+50 % de zombies'),p:_t('La lune pleine les appelle tous.')},
  {id:'pluie',n:_t('Pluie'),d:_t('L\'essence ne brûle pas'),p:_t('L’eau noie les flammes et les pas.')},
  {id:'coupure',n:_t('Coupure de courant'),d:_t('Projecteurs et clôtures inactifs'),p:_t('Plus une lueur. Rien que leurs râles.')},
  {id:'sprint',n:_t('Horde affamée'),d:_t('Les rôdeurs deviennent des coureurs'),p:_t('Ils ont faim. Ils courent.')}
 ];
 // nuits 1 à 10, puis chaque nuit ajoute GROW zombies de chaque type (survie sans fin)
 let WAVES={
  walk: [2,2,4,4,4,4,5,5,5,5],
  run:  [0,0,1,1,1,1,2,2,2,2],
  fat:  [0,0,1,1,1,1,1,1,1,1],
  zdog: [0,0,0,1,1,1,1,1,1,1],
  crawl:[0,0,1,1,1,1,1,1,1,1],
  spit: [0,0,0,0,1,1,1,1,1,1],
  armor:[0,0,0,0,1,1,1,1,1,1],
  howl: [0,0,0,0,0,1,1,1,1,1],
  sap:  [0,0,0,1,1,1,1,2,2,2]
 };
 // moins de zombies en plus chaque nuit (v73) : la horde grandit surtout en PV et en dégâts (frénésie), pas en nombre
 let GROW={walk:.6,run:.36,fat:.24,zdog:.24,crawl:.24,spit:.18,armor:.24,howl:.15,sap:.2};
 // le Colosse arrive toutes les 10 nuits (1 la nuit 10, 2 la nuit 20…)
 const bossCount=n=>n%10===0?n/10:0;
 // le boss qui mène la horde : Colosse (10, 40…), Mère (20, 50…), Patient Zéro (30, 60…) ; les autres boss de la nuit sont des Colosses
 const BOSSES=['boss','mere','zero'],leadBoss=n=>n%10===0&&n>0?BOSSES[(n/10-1)%3]:null;
 const bossOf=(k,n)=>{const c=bossCount(n);if(!c)return 0;const L=leadBoss(n);return k==='boss'?(L==='boss'?c:c-1):(k===L?1:0)};
 // au-delà de la nuit 10, la horde grossit de façon logarithmique (de plus en plus lentement)
 function waveCount(k,n){if(ZT[k].boss)return bossOf(k,n);const t=WAVES[k]||[];if(n<=t.length)return t[n-1]||0;return Math.round((t[t.length-1]||0)+(GROW[k]||0)*6*Math.log(1+(n-t.length)/6))}
 // nuit de répit : la nuit qui suit un Colosse (11, 21, 31…) a 30 % de zombies en moins
 const respite=(n,st)=>!men(st,3)&&n>10&&n%10===1;
 const RELICS={
  lunette:{n:_t('Lunette de visée'),d:_t('Tes tireurs ont +1 portée')},
  pieges:{n:_t('Manuel du trappeur'),d:_t('Tes pièges font +2 dégâts')},
  soupe:{n:_t('Marmite de soupe'),d:_t('À chaque aube, l’abri récupère 1 PV')},
  sac:{n:_t('Grand sac à dos'),d:_t('Tu pioches 1 carte de plus chaque jour')},
  clous:{n:_t('Caisse de clous'),d:_t('Tes défenses ont +3 PV')},
  rage:{n:_t('Adrénaline'),d:_t('Tes unités au corps à corps font +1 dégât')},
  groupe:{n:_t('Groupe électrogène'),d:_t('Plus de coupure de courant, clôtures à 2 dégâts')},
  aimant:{n:_t('Aimant'),d:_t('+3 ferraille à chaque aube')},
  // v119 : 8 nouvelles reliques disponibles tout de suite
  sifflet:{n:_t('Sifflet de dresseur'),d:_t('Tes chiens ont +2 PV et +1 dégât')},
  chirurgien:{n:_t('Trousse de chirurgien'),d:_t('Tes soins rendent 1 PV de plus')},
  gilet:{n:_t('Gilet pare-balles'),d:_t('Tes tanks bloquent 1 coup sur 2 au lieu de 1 sur 3')},
  coffre:{n:_t('Coffre de pillard'),d:_t('La boutique propose 6 cartes au lieu de 5')},
  troc:{n:_t('Carnet de troc'),d:_t('Améliorer une carte coûte 10 ferraille de moins')},
  cartouches:{n:_t('Ceinture de cartouches'),d:_t('Tu peux avoir 3 munitions anti-Colosse au lieu de 2')},
  pacte:{n:_t('Pacte du sang'),d:_t('+1 énergie chaque jour, mais l’abri perd 1 PV à chaque aube'),risk:1},
  appat:{n:_t('Appât vivant'),d:_t('+50 % de ferraille par zombie, mais +15 % de zombies'),risk:1},
  // v119 : 6 reliques débloquées par les victoires (lock : niveau de Mutation à vaincre)
  serum:{n:_t('Sérum expérimental'),d:_t('La convalescence ne dure que 2 nuits'),lock:0},
  cloche:{n:_t('Cloche d’église'),d:_t('À chaque aube, toutes tes unités récupèrent 2 PV'),lock:2},
  recettes:{n:_t('Carnet de recettes'),d:_t('Tes fusions ne demandent que 2 unités identiques'),lock:4},
  plan:{n:_t('Plan de l’abri'),d:_t('L’abri a +3 PV max'),lock:6},
  insigne:{n:_t('Insigne du sauveteur'),d:_t('+1 unité sur le terrain'),lock:8},
  fanion:{n:_t('Fanion des secours'),d:_t('+1 énergie chaque jour'),lock:10}
 };
 const hasR=(st,r)=>!!(st&&st.relics&&st.relics.includes(r));
 // reliques débloquées par les victoires : st.relicPool (rempli par le jeu à partir de la sauvegarde du joueur)
 const relicOpen=(st,r)=>RELICS[r].lock==null||(st.relicPool||[]).includes(r);
 const VICTORY_RELICS=Object.keys(RELICS).filter(r=>RELICS[r].lock!=null);
 const ammoMax=st=>AMMO_MAX+(hasR(st,'cartouches')?1:0);
 // une relique toutes les 5 nuits
 const relicNight=n=>n%5===0;
 // familles : plus il y a d'unités d'une famille sur la carte, plus la famille est forte (2 paliers)
 // factions : plus il y a d'unités d'une faction sur la carte, plus elle est forte (2 paliers).
 // Le Chef d'une faction (carte légendaire) compte pour 2 survivants.
 const FAM={
  police:{n:_t('Police'),ic:'👮',cards:['riot','k9','barrier','swat','cop','gun','lamp','siren','handler','chief_police'],lv:[2,5],d:[_t('tes policiers perdent 1 PV de moins par coup'),_t('tes policiers ont +1 portée ; équipe complète : +1 dégât et +2 PV pour toute la faction')]},
  mil:{n:_t('Militaires'),ic:'🎖️',cards:['mortar','sentry','clay','bunker','snp','mg','sht','mine','dyn','assassin','chief_mil'],lv:[2,5],d:[_t('tes militaires font +1 dégât'),_t('mines et dynamite : +3 dégâts ; équipe complète : +1 dégât et +2 PV pour toute la faction')]},
  care:{n:_t('Soignants'),ic:'⛑️',cards:['amb','doc','orderly','pharma','hospital','priest','stretch','med','cook','fieldnurse','chief_care'],lv:[2,5],d:[_t('soins +1 PV, tes soignants font +1 dégât'),_t('à l’aube, toutes tes unités récupèrent 2 PV ; équipe complète : +1 dégât et +2 PV pour toute la faction')]},
  pyro:{n:_t('Pyromanes'),ic:'🔥',cards:['brasero','firetrap','fire','flame','molo','gas','tire','chief_pyro'],lv:[2,5],d:[_t('le feu fait +1 dégât par tour'),_t('les zombies qui meurent en brûlant explosent (2 dégâts autour) ; équipe complète : +1 dégât et +2 PV pour toute la faction')]},
  trap:{n:_t('Trappeurs'),ic:'🪤',cards:['net','bear','hunter','trap','spike','wire','smoke','bait','xbow','scout','chief_trap'],lv:[2,5],d:[_t('pièges : +2 dégâts'),_t('pièges : +4 dégâts au total ; équipe complète : +1 dégât et +2 PV pour toute la faction')]},
  farm:{n:_t('Fermiers'),ic:'🐕',cards:['dogs','pitch','scare','dog','axe','butch','chief_farm'],lv:[2,5],d:[_t('corps à corps : +1 dégât'),_t('corps à corps : +1 PV à chaque zombie tué ; équipe complète : +1 dégât et +2 PV pour toute la faction')]},
  tech:{n:_t('Bricoleurs'),ic:'⚡',cards:['nailer','turret','workshop','modwall','tesla','fen','solar','mech','radio','welder','genmech','chief_tech'],lv:[2,5],d:[_t('tes bricoleurs font +1 dégât, clôtures +1'),_t('clôtures : étourdissent 1 tour, réparations +1 PV ; équipe complète : +1 dégât et +2 PV pour toute la faction')]},
  comm:{n:_t('Communauté'),ic:'🏠',cards:['ranger','teacher','market','vigile','carp','lead','monk','kid','chief_comm'],lv:[2,5],d:[_t('tes membres de la Communauté ont +1 portée, l’abri +1 PV à l’aube'),_t('ta 1ʳᵉ carte de chaque jour coûte 1 énergie de moins ; équipe complète : +1 dégât et +2 PV pour toute la faction')]}
 };
 const CHIEF={police:'chief_police',mil:'chief_mil',care:'chief_care',pyro:'chief_pyro',trap:'chief_trap',farm:'chief_farm',tech:'chief_tech',comm:'chief_comm'};
 const famOf=t=>{t=baseOf(t);return Object.keys(FAM).find(f=>FAM[f].cards.includes(t))};
 // seuls les survivants (humains et chiens) comptent pour les paliers de faction : ni les constructions, ni les machines.
 // Le Chef d'une faction compte pour 2.
 const famW=t=>named(t)?(U[t].chief?2:1):0;
 function famCounts(st){const c={};for(const u of st.grid)if(u&&famW(u.t)){const f=famOf(u.t);if(f)c[f]=(c[f]||0)+famW(u.t)}return c}
 function famLevel(st,f){if(!f||!st||!st.grid)return 0;let n=0;for(const u of st.grid)if(u&&famOf(u.t)===f)n+=famW(u.t);const L=FAM[f].lv;return n>=L[1]?2:n>=L[0]?1:0}
 function famLevels(st){const c=famCounts(st),l={};for(const f in FAM){const n=c[f]||0;l[f]=n>=FAM[f].lv[1]?2:n>=FAM[f].lv[0]?1:0}return l}
 const facOf=t=>famOf(t);
 // alliances : deux factions avec chacune au moins 2 unités sur la carte débloquent un bonus commun
 const ALLY={};
 const ALLY_MIN=2;
 // alliances supprimées (v82) : elles poussaient à mélanger les factions
 function allies(){return[]}
 const ally=(st,k)=>!!(st._al&&st._al.has(k));
 // murs reliés : des murs voisins forment un rempart ; le mur le plus solide du groupe encaisse les coups
 function wallGroup(st,n){const isW=j=>{const v=st.grid[j];return !!(v&&U[v.t].cat==='wall'&&U[v.t].block)};if(!isW(n))return[];const seen=new Set([n]),q=[n];
  while(q.length){const j=q.pop();for(const k of around(j))if(!seen.has(k)&&isW(k)){seen.add(k);q.push(k)}}return[...seen]}
 // solidarité : chaque voisin de la même faction donne +1 (dégât, soin ou réparation), au plus +2
 // solidarité supprimée (v82) : doublon avec les factions et l'escouade
 function sol(){return 0}
 // choisir sa nuit : à l'aube, 2 nuits au choix, l'une prudente, l'autre risquée mais payante
 const TIERS={
  base:{n:_t('Nuit'),d:_t('Horde normale.'),count:1},
  calm:{n:_t('Nuit tranquille'),d:_t('Horde −30 %. Aucun bonus.'),count:.7,safe:1},
  normal:{n:_t('Nuit ordinaire'),d:_t('Horde normale. +6 ferraille à l’aube.'),count:1,scrap:6,safe:1},
  raid:{n:_t('Nuit de pillage'),d:_t('Horde +40 %. +15 ferraille à l’aube.'),count:1.4,scrap:15},
  blood:{n:_t('Nuit sanglante'),d:_t('Horde +70 %. Une relique à l’aube.'),count:1.7,relic:1}
 };
 // le choix de la nuit est rare : 1 aube sur 4 environ, à partir de la nuit 3
 // plus de choix de la nuit à affronter (v65) : la nuit suivante est toujours imposée
 const nightChoice=()=>false;
 function nightOffers(st,rnd=Math.random){const ev=()=>(rnd()<.2?EVENTS[0]:EVENTS[1+Math.floor(rnd()*(EVENTS.length-1))]).id;
  const e1=ev();let e2=ev();for(let k=0;k<5&&e2===e1;k++)e2=ev();
  return[{tier:rnd()<.5?'calm':'normal',event:e1},{tier:rnd()<.6?'raid':'blood',event:e2}]}
 // événements de l'aube : une petite histoire et un choix. Chaque choix renvoie un texte et ses effets.
 // Les effets sur le deck (cartes gagnées) sont rendus dans res.cards : c'est le jeu qui les ajoute au deck.
 const freeCells=st=>INNER.filter(i=>!st.grid[i]);
 const randUnit=(st,rnd)=>{const us=st.grid.map((u,i)=>u&&U[u.t].block?i:-1).filter(i=>i>=0);return us.length?us[Math.floor(rnd()*us.length)]:-1};
 const pickR=(a,rnd)=>a[Math.floor(rnd()*a.length)];
 function hurt(st,j,d){const u=st.grid[j];if(!u)return'';u.hp-=d;const nm=u.name||U[u.t].n;if(u.hp<=0){lose(st,j,u,[]);return st.grid[j]?_t`${nm} s’en sort de justesse.`:_t`${nm} n’a pas survécu.`}return _t`${nm} perd ${d} PV.`}
 function recruit(st,t,rnd){const fc=freeCells(st);if(!fc.length)return null;const i=pickR(fc,rnd);place(st,t,i,rnd,true);st.grid[i].gen=1;return st.grid[i]}
 const DAWN={
  stranger:{n:_t('Un inconnu à la porte'),d:_t('Quelqu’un frappe, à bout de forces. Son bras est caché sous sa veste.'),ch:[
   {n:_t('L’accueillir'),d:_t('Un survivant gratuit… s’il n’est pas mordu.'),go:(st,rnd)=>{if(rnd()<.3){st.shelter=Math.max(1,st.shelter-2);return{txt:_t('L’inconnu était mordu. La transformation a lieu dans la nuit : l’abri perd 2 PV avant que tout soit fini.')}}
    const u=recruit(st,pickR(['gun','axe','cop','med'],rnd),rnd);return{txt:u?_t`${u.name} rejoint l’abri (${U[u.t].n}).`:_t('Il n’y a plus de place autour de l’abri. L’inconnu repart dans la nuit.')}}},
   {n:_t('Lui fermer la porte'),d:_t('Pas de risque.'),go:()=>({txt:_t('Ses coups contre la porte cessent au bout d’une heure.')})}]},
  raiders:{n:_t('Des pillards'),d:_t('Trois hommes armés exigent ta ferraille.'),ch:[
   {n:_t('Payer 8 ferraille'),d:_t('Ils partent sans histoire.'),ok:st=>st.scrap>=8,go:st=>{st.scrap-=8;return{txt:_t('Ils empochent la ferraille et disparaissent.')}}},
   {n:_t('Les repousser'),d:_t('+6 ferraille, mais un de tes défenseurs est blessé.'),go:(st,rnd)=>{st.scrap+=6;const j=randUnit(st,rnd);return{txt:_t('Tu récupères leurs affaires (+6 ferraille). ')+(j>=0?hurt(st,j,3):'')}}}]},
  market:{n:_t('Le supermarché'),d:_t('Un supermarché à moitié pillé, à dix minutes de marche.'),ch:[
   {n:_t('Fouiller'),d:_t('12 ferraille… ou une embuscade.'),go:(st,rnd)=>{if(rnd()<.6){st.scrap+=12;return{txt:_t('Butin : 12 ferraille.')}}st.shelter=Math.max(1,st.shelter-2);return{txt:_t('Une embuscade ! Tu rentres en courant, la horde sur les talons : l’abri perd 2 PV.')}}},
   {n:_t('Rester à l’abri'),d:_t('Pas de risque.'),go:()=>({txt:_t('Tu passes la matinée à renforcer les planches.')})}]},
  radio:{n:_t('Un message radio'),d:_t('Des survivants donnent leur position et demandent de l’aide.'),ch:[
   {n:_t('Y aller'),d:_t('Un survivant gratuit, mais −1 énergie demain (fatigue).'),go:(st,rnd)=>{st.nextE=(st.nextE||0)-1;const u=recruit(st,pickR(['gun','axe','med','vigile'],rnd),rnd);return{txt:u?_t`${u.name} (${U[u.t].n}) te suit jusqu’à l’abri. Le retour est épuisant.`:_t('Il n’y a plus de place autour de l’abri. Le retour est épuisant pour rien.')}}},
   {n:_t('Ignorer'),d:_t('Pas de risque.'),go:()=>({txt:_t('Le message se répète jusqu’au soir, puis plus rien.')})}]},
  dog:{n:_t('Un chien errant'),d:_t('Un chien maigre rôde autour de l’abri.'),ch:[
   {n:_t('L’adopter'),d:_t('Un chien gratuit autour de l’abri.'),go:(st,rnd)=>{const u=recruit(st,'dog',rnd);return{txt:u?_t`${u.name} monte la garde.`:_t('Pas de place pour lui. Il s’éloigne.')}}},
   {n:_t('Le chasser'),d:_t('Rien ne se passe.'),go:()=>({txt:_t('Il disparaît dans les bois.')})}]},
  cache:{n:_t('Une caisse militaire'),d:_t('Une caisse scellée, peut-être piégée.'),ch:[
   {n:_t('L’ouvrir'),d:_t('Une amélioration gratuite… ou une explosion.'),go:(st,rnd,deck)=>{if(rnd()<.5){const ts=[...new Set(deck||[])].filter(t=>UPGRADABLE.includes(t)&&!st.upg[t]);if(ts.length){const t=pickR(ts,rnd);upgrade(st,t);return{txt:_t`Du matériel de qualité : ${U[t].n} est amélioré.`}}st.scrap+=6;return{txt:_t('De la ferraille de qualité : +6.')}}
    const j=randUnit(st,rnd);return{txt:_t('Piégée ! ')+(j>=0?hurt(st,j,4):_t('Personne n’était à côté.'))}}},
   {n:_t('La laisser'),d:_t('Pas de risque.'),go:()=>({txt:_t('Tu la recouvres de branches et tu l’oublies.')})}]},
  mechanic:{n:_t('Un mécanicien de passage'),d:_t('Il propose de réparer tes défenses contre de la ferraille.'),ch:[
   {n:_t('Payer 6 ferraille'),d:_t('Toutes tes unités récupèrent tous leurs PV.'),ok:st=>st.scrap>=6,go:st=>{st.scrap-=6;st.grid.forEach(u=>{if(u&&U[u.t].block)u.hp=maxHp(st,u)});return{txt:_t('En une matinée, tout est comme neuf.')}}},
   {n:_t('Refuser'),d:_t('Pas de risque.'),go:()=>({txt:_t('Il hausse les épaules et reprend la route.')})}]},
  wounded:{n:_t('Un blessé dans le fossé'),d:_t('Une personne blessée appelle à l’aide.'),ch:[
   {n:_t('Soigner la personne'),d:_t('L’abri perd 1 PV (provisions), toutes tes unités récupèrent 3 PV.'),go:st=>{st.shelter=Math.max(1,st.shelter-1);st.grid.forEach(u=>{if(u&&U[u.t].block)u.hp=Math.min(maxHp(st,u),u.hp+3)});return{txt:_t('C’était une infirmière. Avant de repartir, elle soigne tout le monde.')}}},
   {n:_t('Passer ton chemin'),d:_t('Pas de risque.'),go:()=>({txt:_t('Ses appels s’éteignent dans ton dos.')})}]},
  // v111 : 17 nouveaux événements (25 au total)
  convoy:{n:_t('Un convoi abandonné'),d:_t('Trois camions militaires en travers de la route, portières ouvertes.'),ch:[
   {n:_t('Fouiller les camions'),d:_t('+10 ferraille, mais −1 énergie demain (fatigue).'),go:st=>{st.scrap+=10;st.nextE=(st.nextE||0)-1;return{txt:_t('Tu reviens chargé : +10 ferraille. Tes jambes te le feront payer demain.')}}},
   {n:_t('Passer ton chemin'),d:_t('Pas de risque.'),go:()=>({txt:_t('Les camions disparaissent derrière toi dans la brume.')})}]},
  pharmacy:{n:_t('La pharmacie'),d:_t('La vitrine est intacte. Quelque chose bouge dans l’arrière-boutique.'),ch:[
   {n:_t('Forcer la porte'),d:_t('Une Trousse de secours… ou un défenseur blessé.'),go:(st,rnd)=>{if(rnd()<.6)return{txt:_t('Les étagères ne sont pas vides.'),cards:['kit']};const j=randUnit(st,rnd);return{txt:_t('Un rôdeur t’attendait. ')+(j>=0?hurt(st,j,3):_t('Tu t’en sors de justesse.'))}}},
   {n:_t('Repartir'),d:_t('Pas de risque.'),go:()=>({txt:_t('Tu laisses la pharmacie à ce qui l’habite.')})}]},
  child:{n:_t('Un enfant seul'),d:_t('Un gamin, une fronde à la main, te suit de loin depuis l’aube.'),ch:[
   {n:_t('L’accueillir'),d:_t('Un Gamin rejoint l’abri, mais l’abri perd 1 PV (une bouche de plus).'),go:(st,rnd)=>{st.shelter=Math.max(1,st.shelter-1);const u=recruit(st,'kid',rnd);return{txt:u?_t`${u.name} s’installe près de la porte, sa fronde chargée.`:_t('Pas de place autour de l’abri : il repart avec tes provisions.')}}},
   {n:_t('Lui indiquer la route'),d:_t('Pas de risque.'),go:()=>({txt:_t('Il hoche la tête et disparaît vers le sud.')})}]},
  gunshop:{n:_t('L’armurerie'),d:_t('Le rideau de fer est à moitié levé.'),ch:[
   {n:_t('Se glisser dessous'),d:_t('Deux Grenades… ou une embuscade.'),go:(st,rnd)=>{if(rnd()<.55)return{txt:_t('Une caisse oubliée sous le comptoir.'),cards:['grenade','grenade']};st.shelter=Math.max(1,st.shelter-2);return{txt:_t('Une embuscade ! Tu rentres en courant, la horde sur les talons : l’abri perd 2 PV.')}}},
   {n:_t('Ne pas tenter le diable'),d:_t('Pas de risque.'),go:()=>({txt:_t('Le rideau grince dans le vent derrière toi.')})}]},
  generator:{n:_t('Un groupe électrogène'),d:_t('Il tourne encore, dans un garage. Il faut du carburant pour le ramener.'),ch:[
   {n:_t('Le ramener (4 ferraille)'),d:_t('+1 énergie demain.'),ok:st=>st.scrap>=4,go:st=>{st.scrap-=4;st.nextE=(st.nextE||0)+1;return{txt:_t('Le moteur ronronne derrière l’abri. Demain, tu iras plus vite.')}}},
   {n:_t('Le laisser'),d:_t('Pas de risque.'),go:()=>({txt:_t('Son bruit finira par attirer quelqu’un d’autre.')})}]},
  trader:{n:_t('Une marchande ambulante'),d:_t('Une charrette, une vieille femme et un fusil sur les genoux.'),ch:[
   {n:_t('Échanger 10 ferraille'),d:_t('Une carte rare au hasard rejoint ton deck.'),ok:st=>st.scrap>=10,go:(st,rnd)=>{const ts=(st.pool||KEYS).filter(t=>RAR[t]==='rare'&&U[t]&&!U[t].chief);if(!ts.length)return{txt:_t('Elle n’a rien qui t’intéresse.')};st.scrap-=10;const t=pickR(ts,rnd);return{txt:_t`Elle te tend ${U[t].n} sans un mot.`,cards:[t]}}},
   {n:_t('Refuser'),d:_t('Pas de risque.'),go:()=>({txt:_t('Elle repart en sifflotant.')})}]},
  church:{n:_t('L’église en ruine'),d:_t('Le clocher tient encore debout. Le toit est en plomb.'),ch:[
   {n:_t('Prier un moment'),d:_t('Toutes tes unités récupèrent 2 PV.'),go:st=>{st.grid.forEach(u=>{if(u&&U[u.t].block)u.hp=Math.min(maxHp(st,u),u.hp+2)});return{txt:_t('Le silence fait du bien à tout le monde.')}}},
   {n:_t('Arracher le plomb du toit'),d:_t('+8 ferraille.'),go:st=>{st.scrap+=8;return{txt:_t('Les cloches ne sonneront plus : +8 ferraille.')}}}]},
  deserter:{n:_t('Un soldat déserteur'),d:_t('Il a encore son arme et son uniforme, mais plus de chef.'),ch:[
   {n:_t('L’engager (10 ferraille)'),d:_t('Un Tireur d’élite rejoint l’abri.'),ok:st=>st.scrap>=10,go:(st,rnd)=>{st.scrap-=10;const u=recruit(st,'swat',rnd);return{txt:u?_t`${u.name} prend position sans un mot.`:_t('Pas de place autour de l’abri : il garde ta ferraille et s’en va.')}}},
   {n:_t('Le désarmer'),d:_t('+5 ferraille, mais un de tes défenseurs est blessé.'),go:(st,rnd)=>{st.scrap+=5;const j=randUnit(st,rnd);return{txt:_t('Il se défend avant de fuir (+5 ferraille). ')+(j>=0?hurt(st,j,2):'')}}}]},
  blaze:{n:_t('Un incendie au loin'),d:_t('Une maison brûle de l’autre côté du champ.'),ch:[
   {n:_t('Sauver ce qui peut l’être'),d:_t('+6 ferraille, mais −1 énergie demain.'),go:st=>{st.scrap+=6;st.nextE=(st.nextE||0)-1;return{txt:_t('Tu rentres couvert de suie, les bras chargés : +6 ferraille.')}}},
   {n:_t('Regarder brûler'),d:_t('Pas de risque.'),go:()=>({txt:_t('Au moins, les zombies iront voir là-bas.')})}]},
  diary:{n:_t('Un carnet de survie'),d:_t('Trouvé sur un banc, plein de notes et de schémas.'),ch:[
   {n:_t('Le lire'),d:_t('Tu pioches 2 cartes tout de suite.'),go:st=>{st.drawNow=(st.drawNow||0)+2;return{txt:_t('Des idées plein la tête pour aujourd’hui.')}}},
   {n:_t('Brûler les pages'),d:_t('+1 PV à l’abri (un peu de chaleur).'),go:st=>{st.shelter=Math.min(maxS(st),st.shelter+1);return{txt:_t('Le feu crépite. Les mots partent en fumée.')}}}]},
  wolves:{n:_t('Des loups affamés'),d:_t('Une meute tourne autour de l’abri depuis la nuit.'),ch:[
   {n:_t('Leur jeter des provisions'),d:_t('L’abri perd 1 PV.'),go:st=>{st.shelter=Math.max(1,st.shelter-1);return{txt:_t('Ils emportent la viande et s’éloignent.')}}},
   {n:_t('Les chasser'),d:_t('+4 ferraille (fourrures), mais un défenseur est blessé.'),go:(st,rnd)=>{st.scrap+=4;const j=randUnit(st,rnd);return{txt:_t('La meute recule (+4 ferraille). ')+(j>=0?hurt(st,j,3):'')}}}]},
  crash:{n:_t('Un hélicoptère écrasé'),d:_t('La carcasse fume encore dans la clairière.'),ch:[
   {n:_t('Fouiller l’épave'),d:_t('Une Munition anti-Colosse… ou une explosion.'),go:(st,rnd)=>{if(rnd()<.5)return{txt:_t('Dans la soute : une munition de gros calibre.'),cards:['shell']};const j=randUnit(st,rnd);return{txt:_t('Le réservoir explose ! ')+(j>=0?hurt(st,j,4):_t('Personne n’était à côté.'))}}},
   {n:_t('Ne pas s’approcher'),d:_t('Pas de risque.'),go:()=>({txt:_t('La fumée monte toute la journée.')})}]},
  library:{n:_t('La bibliothèque'),d:_t('Des manuels techniques, intacts, sur une étagère.'),ch:[
   {n:_t('Étudier'),d:_t('Une carte de ton deck est améliorée, mais −1 énergie demain.'),go:(st,rnd,deck)=>{const ts=[...new Set(deck||[])].filter(t=>UPGRADABLE.includes(t)&&!st.upg[t]);st.nextE=(st.nextE||0)-1;if(!ts.length)return{txt:_t('Rien d’utile cette fois. La journée est perdue.')};const t=pickR(ts,rnd);upgrade(st,t);return{txt:_t`Tu as compris comment mieux utiliser ${U[t].n} : la carte est améliorée.`}}},
   {n:_t('Emporter du papier'),d:_t('+3 ferraille.'),go:st=>{st.scrap+=3;return{txt:_t('Ça servira à allumer le feu, et à troquer : +3 ferraille.')}}}]},
  couple:{n:_t('Deux survivants armés'),d:_t('Un frère et une sœur, prêts à se battre, mais affamés.'),ch:[
   {n:_t('Les nourrir'),d:_t('Un Tireur et un Bûcheron rejoignent l’abri, mais l’abri perd 3 PV.'),go:(st,rnd)=>{st.shelter=Math.max(1,st.shelter-3);const a=recruit(st,'gun',rnd),b=recruit(st,'axe',rnd);const ns=[a,b].filter(Boolean).map(u=>u.name);return{txt:ns.length?_t`${ns.join(_t(' et '))} rejoignent l’abri.`:_t('Pas de place autour de l’abri : ils mangent et repartent.')}}},
   {n:_t('Refuser'),d:_t('Pas de risque.'),go:()=>({txt:_t('Ils te regardent longtemps avant de partir.')})}]},
  storm:{n:_t('Un orage se prépare'),d:_t('Le ciel noircit à l’ouest. Le toit ne tiendra pas.'),ch:[
   {n:_t('Renforcer le toit (5 ferraille)'),d:_t('+1 PV max et +1 PV à l’abri.'),ok:st=>st.scrap>=5,go:st=>{st.scrap-=5;st.maxS=maxS(st)+1;st.shelter=Math.min(maxS(st),st.shelter+1);return{txt:_t('Le toit tient bon sous la pluie.')}}},
   {n:_t('Prier pour que ça passe'),d:_t('L’abri perd 1 PV.'),go:st=>{st.shelter=Math.max(1,st.shelter-1);return{txt:_t('Une gouttière cède dans la nuit : l’abri perd 1 PV.')}}}]},
  scavengers:{n:_t('Des fouilleurs'),d:_t('Deux silhouettes fouillent les poubelles derrière l’abri.'),ch:[
   {n:_t('Partager le butin'),d:_t('+5 ferraille.'),go:st=>{st.scrap+=5;return{txt:_t('Ils connaissent les bons coins : +5 ferraille.')}}},
   {n:_t('Les chasser'),d:_t('Pas de risque.'),go:()=>({txt:_t('Ils filent sans demander leur reste.')})}]},
  farm:{n:_t('Une ferme abandonnée'),d:_t('Le potager a poussé tout seul.'),ch:[
   {n:_t('Remplir les sacs'),d:_t('Des Conserves rejoignent ton deck.'),go:()=>({txt:_t('Carottes, pommes de terre et un bocal de confiture.'),cards:['food']})},
   {n:_t('Ne pas s’attarder'),d:_t('Pas de risque.'),go:()=>({txt:_t('Un épouvantail te regarde partir.')})}]}
 };
 // événements de l'aube (v111) : rares (15 % des aubes), au moins 3 nuits entre deux événements,
 // et jamais deux fois le même tant que tous n'ont pas été vus dans la partie
 const EV_CHANCE=.15,EV_GAP=3;
 function dawnEvent(st,rnd=Math.random){if(st.night<2||tutoOn(st)||st.night-(st.lastEv||-99)<EV_GAP||rnd()>=EV_CHANCE)return null;
  let ks=Object.keys(DAWN).filter(k=>!(st.seenEv||[]).includes(k));if(!ks.length){st.seenEv=[];ks=Object.keys(DAWN)}
  const k=pickR(ks,rnd);st.seenEv=[...(st.seenEv||[]),k];st.lastEv=st.night;return k}
 function resolveDawn(st,id,k,rnd=Math.random,deck){const c=DAWN[id].ch[k];if(c.ok&&!c.ok(st))return{txt:_t('Impossible.')};const r=c.go(st,rnd,deck)||{};touch(st);return r}
 // mutations : toutes les 5 nuits, une nouvelle mutation remplace la précédente (affixe de la horde)
 const MUTS={
  peau:{n:_t('Peau épaisse'),d:_t('Les zombies ont +15 % de PV'),stack:99},
  nombre:{n:_t('Horde nombreuse'),d:_t('+15 % de zombies chaque nuit'),stack:99},
  enrage:{n:_t('Enragés'),d:_t('Les rôdeurs et les coureurs font +1 dégât par coup'),stack:99},
  carapace:{n:_t('Carapace'),d:_t('Les rôdeurs encaissent 1 dégât de moins par coup, sauf le feu et les explosions'),stack:3},
  regen:{n:_t('Régénération'),d:_t('Les zombies récupèrent 1 PV tous les 3 tours'),stack:99},
  putride:{n:_t('Putréfaction'),d:_t('En mourant, un zombie éclabousse les unités autour de lui : 1 dégât'),stack:99},
  frenesie:{n:_t('Pas pressés'),d:_t('Les zombies lents et très lents avancent d’un cran plus vite'),stack:2}
 };
 const mutNight=n=>n%5===0;
 const mc=(st,m)=>(st.muts||[]).filter(x=>x===m).length;
 // frénésie meurtrière : à partir de la nuit 4, chaque nuit multiplie les PV (et non plus les dégâts depuis la v131) des zombies par 1,08 (cumulatif :
 // +8 % nuit 4, +17 % nuit 5, +71 % nuit 10, +151 % nuit 15, +270 % nuit 20)
 const FRENZY_FROM=HP_FROM,FRENZY=HP_STEP;
 // frénésie meurtrière supprimée (v67) : la difficulté vient du nombre, des mutations et des brèches, pas d'un multiplicateur infini
 // v73 : la frénésie revient en douceur, intégrée aux PV (hpMult) et aux dégâts (dmgBonus) ; frenzy donne le bonus de PV en %
 const frenzy=st=>Math.round((hpMult((st&&st.night)||1,st)-1)*100),frenzyMult=st=>hpMult((st&&st.night)||1,st);
 // mutation = affixe : toutes les 5 nuits, une nouvelle mutation remplace la précédente (une seule à la fois)
 // mode test (v134) : départ à la nuit N avec ce qu'une vraie partie aurait accumulé : 1 relique et la mutation instable par nuit rouge passée, niveaux des survivants (N/6)
function testProgress(st,N,rnd=Math.random){st.night=N;let k=0;for(let n=1;n<N;n++)if(relicNight(n)){const r=relicChoices(st,rnd);if(r.length){addRelic(st,r[Math.floor(rnd()*r.length)]);k++}}
 if(N>5)mutate(st,rnd);st.testLv=Math.floor(N/6);return k}
function mutate(st,rnd=Math.random){const cur=(st.muts||[])[0],pool=Object.keys(MUTS).filter(m=>m!==cur);const m=pool[Math.floor(rnd()*pool.length)];st.muts=[m];return m}
 const zspd=(st,k)=>{const s=ZT[k].spd;return s>1&&!ZT[k].boss?Math.max(1,s-mc(st,'frenesie')):s};
 const CUREE_MAX=2,RUSH_MAX=40;
 const zdmg=(st,k)=>ZT[k].dmg+((k==='walk'||k==='run')?mc(st,'enrage'):0)+dmgBonus(st.night||1);
 // dégâts réels d'un coup (v188, décision d'Amine) : la frénésie multiplie aussi les dégâts, comme les PV (+10 % par niveau).
 // Les fractions s'accumulent coup après coup pour chaque zombie (1 dégât à +50 % : un coup sur deux à 2).
 const fzHit=(st,z,d)=>{if(d<=0)return d;const m=frenzyMult(st);if(m<=1)return d;const x=d*m+(z.fa||0),w=Math.floor(x+1e-9);z.fa=x-w;return w};
 const zDmgAvg=(st,k)=>ZT[k].boss?bossHit(st):Math.round(zdmg(st,k)*frenzyMult(st)*10)/10;// le Colosse garde ses dégâts fixes (+2 toutes les 10 nuits) : sinon il raserait un mur d'un coup
 // le Colosse frappe une défense ou une unité : 10 dégâts à la nuit 10, +2 toutes les 10 nuits (il ne tue plus d'un coup, v85)
 const bossHit=st=>10+2*Math.max(0,Math.floor((st.night||10)/10)-1);
 function zhit(st,z){return fzHit(st,z,zdmg(st,z.k))}
 const CHARS={
  surv:{n:_t('Le survivant'),d:_t('Aucun bonus. Idéal pour apprendre.'),deck:['bar','bar','car','gun','gun','axe','trap','food','grenade'],relic:null},
  cop:{n:_t('La policière'),d:_t('Commence avec la Lunette de visée : tes tireurs ont +1 portée.'),deck:['bar','fen','gun','gun','snp','cop','lamp','food','grenade'],relic:'lunette'},
  farm:{n:_t('Le fermier'),d:_t('Commence avec le Manuel du trappeur : tes pièges font +2 dégâts.'),deck:['bar','bar','trap','trap','mine','fire','spike','dog','grenade'],relic:'pieges'},
  nurse:{n:_t('L’infirmière'),d:_t('Commence avec la Marmite de soupe : +1 PV à l’abri à chaque aube.'),deck:['bar','car','gun','axe','med','food','rep','kit','grenade'],relic:'soupe'}
 };
 const SHOP={
  heal:{n:_t('Réparer l’abri'),d:_t('+3 PV à l’abri'),cost:15},
  store:{n:_t('La boutique'),d:_t('5 objets qui ne sont pas dans ton deck, et des munitions anti-Colosse. Elle change à chaque visite'),cost:5},
  upgrade:{n:_t('Améliorer une carte'),d:_t('Toutes tes cartes de ce type sont améliorées. Plus cher à chaque fois'),cost:25,more:15},
  remove:{n:_t('Jeter une carte'),d:_t('Retire une carte de ton deck'),cost:10}
 };
 const shopCost=(st,k)=>(k==='store'&&men(st,4)?5:0)-(k==='upgrade'&&hasR(st,'troc')?10:0)+SHOP[k].cost+(SHOP[k].more||0)*Object.keys(st.upg||{}).length;
 // rareté : les cartes puissantes sortent rarement à l'aube et au troc
 const RARITY={com:{n:_t('Commune'),w:67},rare:{n:_t('Rare'),w:27},epic:{n:_t('Épique'),w:6},leg:{n:_t('Légendaire'),w:0}};
 const RAR={};
 'bar fen sand gun kid axe dog cop med trap fire wire smoke bait food rep'.split(' ').forEach(t=>RAR[t]='com');
 'car tire snp xbow flame butch monk lamp radio cook mech mine spike kit flare roadmap'.split(' ').forEach(t=>RAR[t]='rare');
 'v_heli v_hmg v_radio v_medic v_cont v_sniper v_mines v_rdog v_napalm v_apc'.split(' ').forEach(t=>RAR[t]='leg');
 'door sht mg molo siren lead solar gas dyn coffee rush'.split(' ').forEach(t=>RAR[t]='epic');
 'grenade shot patch'.split(' ').forEach(t=>RAR[t]='com');
 'k9 barrier clay stretch firetrap net hunter pitch scare turret modwall vigile market tear amb doc nailer ranger'.split(' ').forEach(t=>RAR[t]='com');
 'riot mortar sentry bunker pharma priest brasero bear dogs workshop teacher carp napalm orderly'.split(' ').forEach(t=>RAR[t]='rare');
 'swat hospital tesla air rocket'.split(' ').forEach(t=>RAR[t]='epic');
 'gear bandage torch pack trench glass cans supply jerry rest talkie noise palis'.split(' ').forEach(t=>RAR[t]='com');
 'binoc medkit pills tape tower pump flood gate gabion log pit rocks airdrop storm'.split(' ').forEach(t=>RAR[t]='rare');
 'keys radioop bomber'.split(' ').forEach(t=>RAR[t]='epic');
 'welder fieldnurse'.split(' ').forEach(t=>RAR[t]='com');'handler scout genmech'.split(' ').forEach(t=>RAR[t]='rare');RAR.assassin='epic';RAR.shell='rare';
 KEYS.filter(t=>U[t].chief).forEach(t=>RAR[t]='leg');'molotov horn'.split(' ').forEach(t=>RAR[t]='rare');
 const SIDES=[_t('le nord'),_t('le sud'),_t('l’ouest'),_t('l’est')];
 const rc=i=>[Math.floor(i/N),i%N],idx=(r,c)=>r*N+c;
 const isEdge=i=>{const[r,c]=rc(i);return r===0||r===N-1||c===0||c===N-1};
 // portée : au contact (1), les 8 cases autour ; au-delà, un losange (on compte les pas en ligne droite), plus étroit qu'un carré
 const manh=(a,b)=>{const[ar,ac]=rc(a),[br,bc]=rc(b);return Math.abs(ar-br)+Math.abs(ac-bc)};
 const inRange=(p,i,r)=>r<=1?cheb(p,i)<=1:manh(p,i)<=r;
 const cheb=(a,b)=>{const[ar,ac]=rc(a),[br,bc]=rc(b);return Math.max(Math.abs(ar-br),Math.abs(ac-bc))};
 const around=i=>{const[r,c]=rc(i),o=[];for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(!dr&&!dc)continue;const R=r+dr,K=c+dc;if(R>=0&&R<N&&K>=0&&K<N)o.push(idx(R,K))}return o};
 // les routes : les zombies sortent de la forêt uniquement par les 4 routes (le milieu de chaque bord).
 // Le reste du bord est la forêt : les zombies ne peuvent pas y marcher, ils doivent passer par l'intérieur.
 const ROADS=[idx(0,MID),idx(N-1,MID),idx(MID,0),idx(MID,N-1)];
 const isForest=i=>isEdge(i)&&!ROADS.includes(i);
 const EDGES=ROADS.slice();
 const INNER=[...Array(N*N).keys()].filter(i=>!isEdge(i)&&i!==C);
 const sideOf=i=>{const[r,c]=rc(i);return r===0?0:r===N-1?1:c===0?2:3};
 // les pas possibles vers la cible (la maison par défaut), du préféré au moins préféré.
 // Chaque zombie a un style de marche (z.style) : 0 réduit d'abord l'écart en ligne, 1 l'écart en colonne, 2 coupe en diagonale.
 // Tous ces pas rapprochent de la cible ; les zombies arrivent ainsi de tous les côtés et par les 8 cases autour de l'abri.
 function moves(p,t=C,style=0){const[r,c]=rc(p),[tr,tc]=rc(t),sr=Math.sign(tr-r),sc=Math.sign(tc-c),ar=Math.abs(tr-r),ac=Math.abs(tc-c);
  const row=sr?idx(r+sr,c):-1,col=sc?idx(r,c+sc):-1,diag=sr&&sc?idx(r+sr,c+sc):-1;
  const order=style===2?[diag,ar>=ac?row:col,ar>=ac?col:row]:style===1?[ac>=ar?col:row,diag,ac>=ar?row:col]:[ar>=ac?row:col,diag,ar>=ac?col:row];
  return order.filter((m,k)=>m>=0&&order.indexOf(m)===k)}
 const next=(p,t,style)=>moves(p,t,style)[0];
 /* ---------- chemins des zombies ----------
    Chaque tour, une carte des distances jusqu'à la cible (l'abri ou un leurre) est calculée pour toute la carte.
    Entrer sur une case libre coûte 1 ; une case occupée par un obstacle coûte en plus ses PV (pour un rempart, les PV de tout le rempart).
    Les zombies contournent donc tant que le détour est plus court que de casser, sinon ils attaquent le point le plus faible.
    En diagonale, on ne passe pas entre deux obstacles. Les rampants passent sous les murs. Le Colosse, lui, fonce tout droit. */
 // mode : 'crawl' (rampant : passe sous les murs), 'sap' (sapeur : les murs ne l'arrêtent pas, il fonce dedans) ou rien
 function blockCosts(st,t,crawl){const bc=new Array(N*N).fill(0),gs={};
  for(let j=0;j<N*N;j++){if(j===t)continue;if(j===C){bc[j]=999;continue}const v=st.grid[j];if(!v||!U[v.t].block)continue;
   if(U[v.t].cat==='wall'){if(crawl==='crawl')continue;if(crawl==='sap'){bc[j]=1;continue}if(gs[j]===undefined){const g=wallGroup(st,j),sum=g.reduce((a,k)=>a+Math.max(1,st.grid[k].hp),0);g.forEach(k=>gs[k]=sum)}bc[j]=gs[j]}
   else bc[j]=Math.max(1,v.hp)}
  return bc}
 const diagOK=(a,b,bc)=>{const[ra,ca]=rc(a),[rb,cb]=rc(b);return ra===rb||ca===cb||!(bc[idx(ra,cb)]>0&&bc[idx(rb,ca)]>0)};
 function field(st,t,crawl){const key=t+(crawl||''),cache=st._df||(st._df={});if(cache[key])return cache[key];
  const bc=blockCosts(st,t,crawl),D=new Array(N*N).fill(Infinity),done=new Array(N*N).fill(false);D[t]=0;
  for(;;){let u=-1,b=Infinity;for(let j=0;j<N*N;j++)if(!done[j]&&D[j]<b){b=D[j];u=j}if(u<0)break;done[u]=true;
   for(const x of around(u)){if(done[x]||isForest(x)||!diagOK(x,u,bc))continue;const nd=D[u]+1+bc[u];if(nd<D[x])D[x]=nd}}
  return cache[key]={D,bc}}
 // le pas suivant d'un zombie : la case voisine qui minimise (coût d'entrée + distance restante) ; à égalité, son style de marche décide
 const zmode=T=>T.crawl?'crawl':T.sap?'sap':'';
 // explosion du sapeur : les unités (et les zombies) autour prennent des dégâts
 const SAP_WALL=15,SAP_AROUND=3;
 function sapBlast(st,pos,ev){around(pos).concat(pos).forEach(j=>{const u=st.grid[j];if(u&&U[u.t].block){ouch(st,u,SAP_AROUND,u.hp);u.hp-=SAP_AROUND;ev.push({i:j,txt:'−'+SAP_AROUND,k:'bite'});if(u.hp<=0)lose(st,j,u,ev)}});
  st.z.filter(o=>o.hp>0&&cheb(o.pos,pos)<=1).forEach(o=>hit(st,o,SAP_AROUND,ev,-1,1));if(cheb(pos,C)<=1){st.shelter-=1;ev.push({i:C,txt:'−1',k:'bite'})}ev.push({i:pos,k:'boom'})}
 function pathStep(st,p,t,crawl,style){const{D,bc}=field(st,t,crawl),pref=moves(p,t,style);let best=-1,bv=Infinity;
  const cand=[...pref,...around(p).filter(j=>!pref.includes(j))];
  for(const j of cand){if(isForest(j)||!diagOK(p,j,bc))continue;const v=1+bc[j]+D[j];if(v<bv-1e-9){bv=v;best=j}}
  return best<0?pref[0]:best}
 // v166 : couloirs de mort (affichage seulement) : les cases du chemin probable des zombies couvertes par au moins 2 unités qui attaquent
 function killZones(st){const sv=st._df,path=new Set(),ps=(PLACES[st.place]||{}).sides,edges=st.side>=0?EDGES.filter(i=>sideOf(i)===st.side):ps?EDGES.filter(i=>ps.includes(sideOf(i))&&!(ps.indexOf(0)<0&&rc(i)[0]===0)):EDGES;st._df={};
  try{for(const r of edges){let p=r;for(let k=0;k<N*N&&p!==C&&p>=0;k++){const u=st.grid[p];if(!isEdge(p)&&!(u&&U[u.t].block))path.add(p);const n=pathStep(st,p,C,'',0);if(n===p)break;p=n}}}finally{st._df=sv||{}}
  const atk=[];st.grid.forEach((u,i)=>{if(!u||!U[u.t]||U[u.t].cat==='wall'||U[u.t].cat==='trap')return;const D=stat(st,u.t);if(D.dmg>0)atk.push([i,D.rng||1])});
  const out={};for(const j of path){let n=0;for(const[i,r]of atk)if(i!==j&&inRange(j,i,r))n++;if(n>=2)out[j]=n}return out}
 // un pas en s'éloignant de la maison (recul)
 // (jamais dans la forêt : contre la lisière, le zombie reste sur place)
 function back(p){let[r,c]=rc(p);const dr=r-MID,dc=c-MID;if(Math.abs(dr)>=Math.abs(dc))r+=Math.sign(dr);else c+=Math.sign(dc);const b=idx(Math.max(0,Math.min(N-1,r)),Math.max(0,Math.min(N-1,c)));return isForest(b)?p:b}
 function shuffle(a,rnd=Math.random){for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

 /* ---------- état d'une partie ---------- */
 // v181 : les cartes spéciales existent dans U, RAR et COST sans apparaître dans les listes (propriétés non énumérables)
 KEYS.forEach(t=>ED_IDS.forEach(e=>{if(!edOk(t,e))return;const k=t+'~'+e,hide=(o,v)=>Object.defineProperty(o,k,{value:v,enumerable:false,configurable:true,writable:true});
  hide(U,{...U[t],base:t,ed:e});if(RAR[t])hide(RAR,RAR[t]);if(COST[t]!=null)hide(COST,COST[t])}));
 const edCards=t=>ED_IDS.filter(e=>edOk(t,e)).map(e=>t+'~'+e);
 function newState(ch,pl,rnd=Math.random,pool){const P=PLACES[pl]||PLACES.bois;const st={grid:Array(N*N).fill(null),shelter:P.maxS||MAXS,maxS:P.maxS||MAXS,place:PLACES[pl]?pl:'bois',pool:pool||KEYS.slice(),night:1,event:EVENTS[0],z:[],pending:[],tick:0,zid:0,kills:0,scrap:0,relics:[],upg:{},muts:[],energy:ENERGY,moved:0,bench:[],side:-1,char:CHARS[ch]?ch:'surv'};
  const r=CHARS[st.char].relic;if(r)st.relics.push(r);
  st.scrap+=P.scrap||0;(P.start||[]).forEach(([t,i])=>{place(st,t,i,rnd,true);st.grid[i].gen=1});return st}
 const maxS=st=>st.maxS||MAXS;
 // les lieux : chacun change la carte de départ et une règle
 const PLACES={
  bois:{n:_t('La maison des bois'),d:_t('Le lieu d’origine. Ni bonus, ni malus.')},
  ferme:{n:_t('La ferme'),d:_t('Une rivière protège le nord : la horde arrive par les 3 autres côtés. Deux bottes de paille (barricades) au départ.'),sides:[1,2,3],start:[['bar',3*N+3],['bar',3*N+5]]},
  station:{n:_t('La station-service'),d:_t('Deux bonbonnes de gaz et 10 ferraille au départ, l’Essence ne coûte rien. Mais la horde est 15 % plus nombreuse.'),start:[['gas',N+MID],['gas',(N-2)*N+MID]],scrap:10,free:['fire'],count:1.15},
  mall:{n:_t('Le centre commercial'),d:_t('Murs épais : l’abri a 15 PV au lieu de 10. Mais les zombies ont 15 % de PV en plus.'),maxS:15,hp:1.15}
 };
 // progression entre les parties : ce qui est débloqué selon le record (lieux) et le total de nuits survécues (personnages, cartes)
 const UNLOCK={
  chars:{surv:0,cop:8,farm:20,nurse:35},
  places:{bois:0,ferme:5,station:8,mall:12},
  cards:{}
 };
 /* démo publique (v153) : réglage activé seulement dans la version démo envoyée sur itch.io (Z.setDemo).
    Elle s'arrête après la nuit DEMO_N (le Colosse) ; seuls 2 personnages et 2 lieux, et pas de carte épique, légendaire ni de chef. */
 let DEMO=0;const DEMO_N=10,DEMO_CHARS=['surv','cop'],DEMO_PLACES=['bois','ferme'];
 const setDemo=v=>{DEMO=v?1:0},isDemo=()=>!!DEMO;
 const demoOk=t=>!DEMO||!!U[t]&&RAR[t]!=='epic'&&RAR[t]!=='leg'&&!U[t].chief;
 function unlocks(meta){const m=meta||{},b=m.best||0,t=m.total||0;
  return{chars:Object.keys(UNLOCK.chars).filter(k=>t>=UNLOCK.chars[k]&&(!DEMO||DEMO_CHARS.includes(k))),places:Object.keys(UNLOCK.places).filter(k=>b>=UNLOCK.places[k]&&(!DEMO||DEMO_PLACES.includes(k))),
   pool:(m.cards&&m.cards.length?m.cards:STARTER_CARDS).filter(k=>U[k]&&demoOk(k))}}
 /* ---------- collection et deck (entre les parties) ----------
    La collection : les types de cartes débloqués, pour toujours. On en débloque avec les points de survie gagnés en fin de partie.
    Le deck : préparé avant la partie, 20 à 30 cartes, avec un nombre limité d'exemplaires selon la rareté. */
 const DECK_MIN=20,DECK_MAX=30,COPY_MAX={com:3,rare:2,epic:1,leg:1};
 const CARD_PRICE={com:20,rare:45,epic:90,leg:130};// v150 : +30 % environ, car chaque partie offre aussi des cartes
 /* v150 : cartes offertes en fin de partie (hors défi du jour). 5 nuits survécues ou plus : 1 carte à choisir parmi 3 ;
    10 ou plus : 2 parmi 3 ; 20 ou plus : les 3. Tirées parmi les cartes achetables pas encore débloquées. */
 const giftCount=n=>n>=20?3:n>=10?2:n>=5?1:0;
 function giftOffer(cards,r){const own=new Set(cards&&cards.length?cards:STARTER_CARDS),R=r||Math.random;
  const pool=KEYS.filter(k=>!own.has(k)&&U[k].vic==null&&CARD_PRICE[RAR[k]]&&demoOk(k)),out=[];
  while(out.length<3&&pool.length)out.push(pool.splice(Math.floor(R()*pool.length),1)[0]);return out}
 const STARTER_CARDS='bar car fen sand gun snp kid axe dog cop med lamp trap fire mine wire spike food rep grenade shot patch'.split(' ');
 const STARTER_DECK=['bar','bar','bar','fen','car','gun','gun','gun','snp','axe','axe','dog','med','trap','trap','mine','food','rep','grenade','grenade'];
 const copyMax=t=>COPY_MAX[RAR[t]||'com'];
 const runPoints=(nights,kills)=>nights*10+Math.floor(kills/4);
 // ferraille d'un zombie tué : 15 pour le Colosse, 1 sinon ; en Menace 4, un zombie ordinaire sur deux seulement en rapporte
 // v181 : un zombie tué par une unité. Compte pour la Dorée (500 victimes par type, toutes parties) ; Holographique : +1 ferraille ; Ensanglantée : +1 PV
 function edKill(st,u){if(!u||!isUnit(u.t))return;if(!U[u.t].evo)(st.edK=st.edK||{})[u.t]=(st.edK[u.t]||0)+1;
  if(u.ed==='holo')st.scrap+=1;if(u.ed==='sang'&&u.hp>0)cure(st,u,1,u)}
 function killScrap(st,boss){let v=boss?15:1;if(!boss&&men(st,4)){st.kacc=(st.kacc||0)+1;v=st.kacc%2}
  if(hasR(st,'appat')){st.bacc=(st.bacc||0)+v*.5;const x=Math.floor(st.bacc);st.bacc-=x;v+=x}return v}
 // victoire (v116) : survivre à la nuit 30 (le Colosse final) ; on peut ensuite partir (victoire) ou rester (infini)
 const VICTORY_CARDS=Object.keys(U).filter(t=>U[t].vic!=null).sort((a,b)=>U[a].vic-U[b].vic);
 const WIN_NIGHT=30,winPoints=m=>100+50*m;
 // les 10 niveaux de Menace : chacun ajoute une règle, et ils se cumulent ; on débloque le niveau suivant en gagnant
 const MENACES=[null,
  {n:_t('Horde coriace'),d:_t('Les zombies ont +10 % de PV dès la nuit 1')},
  {n:_t('Réveil difficile'),d:_t('Le premier jour, tu n’as que 3 énergies')},
  {n:_t('Sans répit'),d:_t('Plus de nuit de répit après le Colosse')},
  {n:_t('Pénurie'),d:_t('La boutique coûte 10 ferraille, et un zombie ordinaire sur deux seulement rapporte de la ferraille')},
  {n:_t('Instabilité précoce'),d:_t('Une mutation instable est active dès la nuit 1')},
  {n:_t('Curée'),d:_t('La curée monte jusqu’à +3 dégâts au lieu de +2')},
  {n:_t('Blessures profondes'),d:_t('Les blessés restent 4 nuits en convalescence au lieu de 3')},
  {n:_t('Nuits de sang'),d:_t('Les nuits rouges amènent +40 % de zombies au lieu de +15 %')},
  {n:_t('Double Colosse'),d:_t('Chaque nuit du Colosse en amène un de plus')},
  {n:_t('Dernier Abri'),d:_t('L’abri perd 3 PV max, et la frénésie démarre dès la nuit 3')}];
 const MENACE_MAX=10;
 // à appeler juste après newState : applique les règles de départ de la Menace choisie
 function applyMenace(st,m,rnd=Math.random){st.menace=Math.max(0,Math.min(MENACE_MAX,m|0));
  if(men(st,2))st.energy=Math.min(st.energy,ENERGY-1);
  if(men(st,5)&&!(st.muts||[]).length)mutate(st,rnd);
  if(men(st,10)){st.maxS=Math.max(1,(st.maxS||MAXS)-3);st.shelter=Math.min(st.shelter,st.maxS)}
  return st}
 function deckError(deck,owned){if(deck.length<DECK_MIN)return _t`Il faut au moins ${DECK_MIN} cartes (${deck.length} pour l’instant).`;
  if(deck.length>DECK_MAX)return _t`${DECK_MAX} cartes au maximum.`;
  // v181 : une carte spéciale compte dans la limite d'exemplaires de sa carte ; 1 seule spéciale par carte, ED_MAX par deck
  const c={},sp={};let ns=0;for(const t of deck){if(!U[t])return _t`Carte inconnue.`;const b=baseOf(t);c[b]=(c[b]||0)+1;if(owned&&!owned.includes(t))return _t`${U[t].n} n’est pas dans ta collection.`;if(c[b]>copyMax(b))return _t`${U[b].n} : ${copyMax(b)} exemplaire(s) au maximum.`;
   if(U[t].ed){if(sp[b])return _t`${U[b].n} : une seule carte spéciale par carte.`;sp[b]=1;if(++ns>ED_MAX)return _t`${ED_MAX} cartes spéciales au maximum.`}}
  return''}
 function newDay(st,rnd,offer){st.night++;(st.bench||[]).forEach(u=>{if(u.koUntil&&st.night>u.koUntil){delete u.koUntil;u.hp=maxHp(st,u)}});st.charges={};st.energy=ENERGY+(st.nextE||0)+(hasR(st,'pacte')?1:0)+(hasR(st,'fanion')?1:0);st.disc=0;st.nextE=0;st.moved=0;st.rushT=0;if(st.test)st.energy=99;
  if(offer){st.event=EVENTS.find(e=>e.id===offer.event)||EVENTS[0];st.tier=offer.tier}else{st.event=rnd()<.2?EVENTS[0]:EVENTS[1+Math.floor(rnd()*(EVENTS.length-1))];st.tier='base'}if(tutoOn(st)){st.event=EVENTS[0];st.tier='base'}}
 const has=(st,t)=>st.grid.some(u=>u&&u.t===t);
 // Communauté au palier 2 : la 1ʳᵉ carte jouée chaque jour coûte 1 énergie de moins (minimum 0)
 const commDisc=st=>!!(st&&st.grid&&!st.disc&&famLevels(st).comm>=2);
 const costOf=(st,t)=>(PLACES[st.place]||{}).free&&PLACES[st.place].free.includes(t)?0:Math.max(0,cost(t)-(commDisc(st)?1:0));
 const canPay=(st,t)=>costOf(st,t)<=(st.energy??ENERGY);
 const drawCount=st=>5+(has(st,'radio')?1:0)+(has(st,'teacher')?1:0)+(st.relics.includes('sac')?1:0);

 /* ---------- améliorations et reliques : statistiques réelles d'une carte ---------- */
 const TRAPF=['trap','mine','spike','gas','dyn'];
 function upgDesc(t){const b=U[t];
  if(b.dmg)return _t('+1 dégât');if(TRAPF.some(k=>b[k]))return _t('+2 dégâts');if(b.burn)return _t('+1 dégât de feu');
  if(b.smoke||b.bait)return _t('+1 tour');if(b.wire)return _t('+1 dégât');if(b.cat==='wall')return _t('+4 PV');
  if(b.buff)return _t('+1 au bonus');if(b.heal)return _t('soigne 2 PV');if(b.gain)return _t('+2 PV soignés');if(b.cat==='help'||b.cat==='post')return _t('+2 PV');return null}
 const UPGRADABLE=KEYS.filter(upgDesc);
 const cache=new WeakMap();
 const touch=st=>cache.delete(st);
 function stat(st,t){const b=U[t];
  if(b&&b.ed){const d={...stat(st,b.base),base:b.base,ed:b.ed};if(b.ed==='dor'&&d.dmg)d.dmg++;if(b.ed==='arm'&&d.hp)d.hp=Math.ceil(d.hp*1.5);return d}
  if(!st)return b;const R=st.relics||[],up=st.upg&&st.upg[t];if(!up&&!R.length)return b;
  let m=cache.get(st);if(!m){m={};cache.set(st,m)}if(m[t])return m[t];
  const d={...b};
  if(up){d.n=b.n+'+';d.up=1;
   if(b.dmg)d.dmg++;else if(TRAPF.some(k=>b[k]))TRAPF.forEach(k=>{if(b[k])d[k]+=2});else if(b.burn)d.burn++;
   else if(b.smoke)d.smoke++;else if(b.bait)d.bait++;else if(b.wire)d.wire++;else if(b.cat==='wall')d.hp+=4;
   else if(b.buff)d.buff++;else if(b.heal)d.heal++;else if(b.gain)d.gain+=2;else if(b.cat==='help'||b.cat==='post')d.hp+=2}
  if(R.includes('lunette')&&b.cat==='shoot')d.rng++;
  if(R.includes('pieges'))TRAPF.forEach(k=>{if(b[k])d[k]+=2});
  if(R.includes('clous')&&b.cat==='wall')d.hp+=3;
  if(R.includes('rage')&&b.cat==='melee')d.dmg++;
  if(R.includes('sifflet')&&DOGS.includes(t)){d.hp=(d.hp||0)+2;if(d.dmg)d.dmg++}
  return m[t]=d}
 function upgrade(st,t){st.upg[t]=1;touch(st)}
 function addRelic(st,r){if(!st.relics.includes(r)){st.relics.push(r);if(r==='plan'){st.maxS=maxS(st)+3;st.shelter+=3}}touch(st)}
 function relicChoices(st,rnd=Math.random,n=3){return shuffle(Object.keys(RELICS).filter(r=>!st.relics.includes(r)&&relicOpen(st,r)),rnd).slice(0,n)}
 function draftChoices(rnd=Math.random,n=3,pool=KEYS){const out=[];
  while(out.length<n){let r=rnd()*100,rr='com';for(const k in RARITY){if(r<RARITY[k].w){rr=k;break}r-=RARITY[k].w}
   const cand=pool.filter(t=>RAR[t]===rr&&!out.includes(t));if(cand.length)out.push(cand[Math.floor(rnd()*cand.length)]);else if(!pool.some(t=>!out.includes(t)))break}
  return out}
 // défi du jour (v151) : une seule nuit contre une horde tirée au sort, à la force d'une nuit 20 (PV et dégâts de frénésie),
 // mais réglée pour un deck de DAILY.picks cartes (survivants posés au niveau DAILY.lv, comme vers la nuit 20) tirées « 1 parmi 3 » dans toutes les cartes, sans limite d'énergie.
 // Tout vient de rnd (graine du jour) : tout le monde a la même horde et les mêmes tirages.
 const DAILY={night:20,picks:8,scale:.5,lv:4,score:{kill:10,hp:100,win:1000}};
 function dailyPlan(rnd=Math.random){const pick=a=>a[Math.floor(rnd()*a.length)];
  const ch=pick(Object.keys(CHARS)),pl=pick(Object.keys(PLACES)),event=rnd()<.4?'calme':pick(EVENTS.slice(1)).id,mut=rnd()<.7?pick(Object.keys(MUTS)):null;
  const n=DAILY.night,norm=ZK.filter(k=>!ZT[k].boss);let budget=DAILY.scale*norm.reduce((s,k)=>s+waveCount(k,n)*ZT[k].hp,0);
  const w={};ZK.forEach(k=>w[k]=0);
  const boss=rnd()<.35?pick(BOSSES):null;if(boss){w[boss]=1;budget-=ZT[boss].hp*3}
  const types=shuffle(norm.slice(),rnd).slice(0,3+Math.floor(rnd()*3)),wt=types.map(()=>1+rnd()*2),tw=wt.reduce((a,b)=>a+b,0);
  types.forEach((k,j)=>w[k]=Math.max(1,Math.round(budget*wt[j]/tw/ZT[k].hp)));
  const offers=[],seen=[];for(let j=0;j<DAILY.picks;j++){const pool=KEYS.filter(t=>!seen.includes(t)),o=draftChoices(rnd,3,pool.length>=3?pool:KEYS);seen.push(...o);offers.push(o)}
  return{night:n,ch,pl,event,mut,w,offers}}
 // la partie du défi : l'état de la nuit, le deck tiré, énergie illimitée et assez de place pour les 8 cartes
 function dailyState(plan,deck,rnd=Math.random){const st=newState(plan.ch,plan.pl,rnd);st.night=plan.night;st.event=EVENTS.find(e=>e.id===plan.event)||EVENTS[0];
  st.muts=plan.mut?[plan.mut]:[];st.fixedW={...plan.w};st.oneNight=1;st.energy=99;st.testLv=DAILY.lv;st.capD=Math.max(0,deck.length-unitCap(st));return st}
 // score du défi : zombies tués, plus un bonus de victoire et les PV restants de l'abri
 const dailyScore=(st,won)=>st.kills*DAILY.score.kill+(won?DAILY.score.win+Math.max(0,st.shelter)*DAILY.score.hp:0);
 // boutique (v111) : on paie pour l'ouvrir ; elle propose 5 objets (objets et réactions, jamais d'unité), même pas encore débloqués
 // absents du deck, chacun achetable une fois, plus des munitions anti-Colosse (AMMO_MAX au plus en ta possession)
 const STORE_N=5,AMMO_COST=20,STORE_PRICE={com:8,rare:14,epic:22,leg:30};
 const storePrice=t=>STORE_PRICE[RAR[t]||'com'];
 function storeOffer(st,deckTypes,rnd=Math.random){const pool=KEYS.filter(t=>U[t]&&(U[t].cat==='item'||U[t].cat==='react')&&!U[t].antiboss&&!U[t].chief&&U[t].vic==null&&demoOk(t)&&!(deckTypes||[]).includes(t));
  return shuffle(pool.slice(),rnd).slice(0,STORE_N+(hasR(st,'coffre')?1:0))}
 function buyStore(st,t){const c=t==='shell'?AMMO_COST:storePrice(t);if(st.scrap<c)return false;st.scrap-=c;return true}
 function pay(st,k){const c=shopCost(st,k);if(st.scrap<c)return false;st.scrap-=c;if(k==='heal')st.shelter=Math.min(maxS(st),st.shelter+3);return true}
 // munitions anti-Colosse : achetées au troc, tirées pendant la nuit sur le Colosse (ignorent l'armure)
 const AMMO_MAX=2,AMMO_DMG=30;
 const bossAlive=st=>st.z.some(z=>z.hp>0&&ZT[z.k].boss&&!isEdge(z.pos));
 const ammoDmg=z=>15+Math.ceil(.25*z.max);
 function fireAmmo(st){if(!(st.ammo>0))return null;const z=st.z.filter(z=>z.hp>0&&ZT[z.k].boss&&!isEdge(z.pos)).sort((a,b)=>a.hp-b.hp)[0];if(!z)return null;st.ammo--;const ev=[];
  hit(st,z,ammoDmg(z),ev,-1,1);ev.push({i:C,k:'shot',zid:z.id});
  for(const o of st.z)if(o.hp<=0&&!o.dead){o.dead=1;st.kills++;st.scrap+=killScrap(st,ZT[o.k].boss);ev.push({i:o.pos,k:'die',zid:o.id,boss:!!ZT[o.k].boss});if(ZT[o.k].brood)broodDeath(st,o,ev)}
  st.z=st.z.filter(z=>z.hp>0);return ev}

 /* ---------- pose des cartes ---------- */
 // limite d'unités sur le terrain : 5, puis +1 toutes les 10 nuits. Murs et pièges illimités.
 const unitCap=st=>5+Math.floor(((st&&st.night)||1)/10)+((st&&st.capB)||0)+((st&&st.capD)||0)+(hasR(st,'insigne')?1:0);
 // v181 : jusqu'à 2 unités Fantôme ne comptent pas dans la limite
 const fanN=st=>st.grid.filter(u=>u&&u.ed==='fan'&&isUnit(u.t)).length;
 const unitCount=st=>Math.max(0,st.grid.reduce((n,u)=>n+(u&&isUnit(u.t)&&!hasEq(u,'keys')?1:0),0)-Math.min(FAN_MAX,fanN(st)));
 // une pose qui déclenche une fusion ou une évolution ne prend pas de place en plus : elle reste permise à la limite
 function frees(st,t,i){t=baseOf(t);if(!U[t].evo&&evoAt(st,t,i))return true;if(!canFuse(t))return false;
  return st.grid.filter((v,j)=>j!==i&&v&&v.t===t&&!(v.gold||0)).length>=2}
 const evoAt=(st,t,i)=>around(i).some(j=>basic(st.grid[j])&&evoOf(t,st.grid[j].t));
 const capFull=(st,t,i)=>isUnit(t)&&!(edOf(t)==='fan'&&fanN(st)<FAN_MAX)&&unitCount(st)>=unitCap(st)&&!(i!=null&&frees(st,t,i));
 // déplacer ses cartes posées : librement pendant le jour, vers une case libre où elles pourraient être posées
 function canMove(st,a,b){const u=st.grid[a];return !!u&&a!==b&&!st.grid[b]&&canPlace(st,u.t,b,1)}
 function move(st,a,b){if(!canMove(st,a,b))return false;const u=st.grid[a],w0=wallLinks(st);
  st.grid[b]=u;st.grid[a]=null;fixLinks(st,w0);return merge(st,b)||true}
 // murs reliés : après un déplacement ou un rappel, chaque mur garde ses PV propres et recalcule son bonus de liaison
 function wallLinks(st){const m=new Map();st.grid.forEach((v,j)=>{if(isWallU(v))m.set(v,linkB(st,j))});return m}
 function fixLinks(st,m){st.grid.forEach((v,j)=>{if(isWallU(v)&&m.has(v))v.hp=Math.max(1,v.hp+linkB(st,j)-m.get(v))})}
 // rappeler une unité : elle quitte le terrain et attend dans la réserve, avec ses PV, niveaux, étoiles, prénom et trait.
 // On la repose gratuitement quand on veut. En réserve, elle ne compte pas dans la limite.
 const canRecall=(st,i)=>!!(st.grid[i]&&isUnit(st.grid[i].t));
 function recall(st,i){if(!canRecall(st,i))return false;const u=st.grid[i];st.grid[i]=null;(st.bench=st.bench||[]).push(u);return true}
 const canPlaceBench=(st,k,i)=>{const u=(st.bench||[])[k];return !!u&&!u.koUntil&&!st.grid[i]&&canPlace(st,ck(u),i)};
 function placeBench(st,k,i){if(!canPlaceBench(st,k,i))return false;const u=st.bench.splice(k,1)[0];st.grid[i]=u;return merge(st,i)||true}
 // constructions à tracer (barricade, clôture, sacs de sable, pneus, barrage, mur modulaire, barbelés) : une carte = 4 cases pour la journée, pour le prix de la carte.
 // Les cases se posent comme on veut : une par une, ou en ligne droite (1 à 4 cases d'un glissé), tant qu'il en reste.
 // La carte est payée à la 1ʳᵉ pose ; les cases suivantes sont gratuites. Elle part à la défausse quand ses 4 cases sont posées,
 // ou le soir. Plusieurs exemplaires de la même carte additionnent leurs cases.
 const LINE=['bar','fen','sand','tire','barrier','modwall','wire','palis'],LINE_MAX=4,TRACE=LINE,CHARGES=4;
 const isTrace=t=>TRACE.includes(t);
 // cases encore disponibles aujourd'hui pour une carte à tracer (déjà payée si reuse, sinon une nouvelle carte : 4 cases)
 // nombre de cases par carte : 4, sauf les murs les plus solides (3)
 const CHG={tire:3,barrier:3,modwall:3},chargesOf=t=>CHG[t]||CHARGES;
 const charges=(st,t,reuse)=>reuse?((st.charges||{})[t]||0):chargesOf(t);
 function useCharges(st,t,n,reuse){if(!isTrace(t))return;const c=st.charges||(st.charges={});if(!reuse)c[t]=(c[t]||0)+chargesOf(t);c[t]=Math.max(0,c[t]-n)}
 // autres cartes de construction (pièges) : après la 1ʳᵉ pose, la carte reste en main pour la journée et se repose à son prix normal.
 // Les constructions ne rendent pas de carte en tombant : la carte part à la défausse à la fin du jour.
 const isBuild=t=>!!U[t]&&!U[t].evo&&(U[t].cat==='wall'||U[t].cat==='trap'||U[t].cat==='post');
 const buildCost=(st,t,reuse)=>reuse?(isTrace(t)?0:U[t].cat==='wall'?1:costOf(st,t)):costOf(st,t);
 const lineCost=(st,t,n,reuse)=>buildCost(st,t,reuse);
 function lineCells(st,t,a,b,reuse){if(!LINE.includes(t)||!canPlace(st,t,a))return[a];const[ar,ac]=rc(a),[br,bc]=rc(b);
  const max=Math.min(LINE_MAX,charges(st,t,reuse));
  const horiz=Math.abs(bc-ac)>=Math.abs(br-ar),d=horiz?Math.sign(bc-ac):Math.sign(br-ar),len=Math.min(max,1+Math.abs(horiz?bc-ac:br-ar)),out=[a];
  for(let k=1;k<len&&d;k++){const j=horiz?idx(ar,ac+d*k):idx(ar+d*k,ac);if(!canPlace(st,t,j))break;out.push(j)}return out}
 function placeLine(st,t,cells,rnd=Math.random,reuse){if(cells.length<2)return place(st,t,cells[0],rnd,false,{reuse});const c=lineCost(st,t,cells.length,reuse);if(c>(st.energy??ENERGY))return null;
  cells.forEach(j=>{place(st,t,j,rnd,true);st.grid[j].gen=1});st.energy-=c;useCharges(st,t,cells.length,reuse);if(!reuse)st.disc=1;return null}
 function canPlace(st,t,i,moving){const D=U[t];if(D.react)return false;
  if(!moving&&capFull(st,t,i))return false;
  if(D.equip){const u=st.grid[i];return !!(u&&isUnit(u.t)&&!hasEq(u,t)&&(!D.far||(U[u.t].rng||0)>1)&&(!D.att||!!U[u.t].dmg)&&(!D.gold||(u.gold||0)>0))}
  if(D.onUnit)return !!(st.grid[i]&&isUnit(st.grid[i].t)&&st.grid[i].hp<maxHp(st,st.grid[i]));
  if(t==='radioop'&&st.capB)return false;
  if(D.instant)return i===C;
  if(isEdge(i)||i===C)return false;
  if(D.near)return cheb(i,C)===1;
  return true}
 function place(st,t,i,rnd=Math.random,free,opt){const ed=edOf(t);const D=stat(st,t);if(ed)t=baseOf(t);if(!free){st.energy=(st.energy??ENERGY)-buildCost(st,t,opt&&opt.reuse);useCharges(st,t,1,opt&&opt.reuse);if(!(opt&&opt.reuse))st.disc=1}if(D.instant){applyItem(st,t,i,rnd);return}
  const u={t,hp:D.hp};if(ed){u.ed=ed;u.hp=maxHp(st,u)}
  if(named(t)){const used=new Set(st.grid.filter(Boolean).map(v=>v.name).concat((st.fallen||[]).map(f=>f.name)));
   const dg=t==='dog'||t==='k9'||t==='dogs',pool=(dg?DOG_NAMES:NAMES).filter(n=>!used.has(n));const list=pool.length?pool:(dg?DOG_NAMES:NAMES);
   u.name=D.chief?U[t].n:list[Math.floor(rnd()*list.length)];
   const tr=Object.keys(TRAITS).filter(k=>(!TRAITS[k].att||D.dmg)&&(!TRAITS[k].far||(D.rng||0)>1)&&!(tutoOn(st)&&TRAITS[k].hpB));// tutoriel : PV prévisibles
   u.trait=tr[Math.floor(rnd()*tr.length)];u.kills=0;
   // mode test, progression simulée : le survivant arrive avec les niveaux d'une vraie partie (offensif d'abord pour ceux qui attaquent)
   if(st.testLv){const L=st.testLv;u.lvA=D.dmg?Math.ceil(L/2):0;u.lvD=L-u.lvA;u.kills=lvKills(L)}
   u.hp=maxHp(st,u)}
  if(!free&&isTrace(t))u.gen=1;
  const lg=(st.legacy||[]).find(l=>l.t===t&&!l.used);if(lg&&D.block){lg.used=1;u.leg=lg.name;u.hp=maxHp(st,u)}
  // un mur posé : lui et ses murs voisins gagnent leur bonus de liaison (+1 PV par voisin relié, jusqu'à +3)
  const wn=isWallU(u)?around(i).filter(k=>isWallU(st.grid[k])).map(k=>[k,linkB(st,k)]):[];
  st.grid[i]=u;if(isWallU(u)){u.hp+=linkB(st,i);wn.forEach(([k,b])=>{const v=st.grid[k];v.hp+=linkB(st,k)-b})}
  return free?null:merge(st,i)}
 /* ---------- fusion et évolutions ----------
    Fusion : 3 unités du même type et du même nombre d'étoiles fusionnent en une unité avec une étoile de plus
    (chaque étoile : +120 % des PV de base, +1 dégât ou +1 soin). Les fusions s'enchaînent (3 ★ donnent ★★, etc.).
    Les 2 unités absorbées rendent leur carte à la défausse : elles pourront être tirées de nouveau.
    Évolution : deux cartes précises posées côte à côte deviennent une unité unique (EVO), une nouvelle carte ; les 2 cartes repartent aussitôt en défausse. */
 const basic=u=>!!u&&!u.gold&&!U[u.t].evo;
 const evoOf=(a,b)=>EVO_KEYS.find(k=>{const[x,y]=EVO[k];return(a===x&&b===y)||(a===y&&b===x)});
 const canFuse=t=>{const D=U[t];return !!D.block&&!D.evo&&!D.chief&&D.cat!=='trap'&&D.cat!=='wall'&&D.cat!=='post'};
 // l'unité qui reste garde le prénom, le trait et les niveaux du plus aguerri, et cumule les victimes
 function absorb(u,others){const all=[u,...others],best=all.filter(v=>v.name).sort((a,b)=>(b.kills||0)-(a.kills||0))[0];
  if(best&&best!==u){u.name=best.name;u.trait=best.trait;u.saved=best.saved}
  u.kills=all.reduce((s,v)=>s+(v.kills||0),0);u.lvA=Math.max(...all.map(v=>v.lvA||0));u.lvD=Math.max(...all.map(v=>v.lvD||0));u.leg=all.map(v=>v.leg).find(Boolean);const e=u.ed||all.map(v=>v.ed).find(Boolean);if(e)u.ed=e}
 function merge(st,i){const u=st.grid[i];if(!u||U[u.t].evo)return null;
  if(basic(u))for(const j of around(i)){const v=st.grid[j];if(!basic(v))continue;const k=evoOf(u.t,v.t);if(!k)continue;
   const from=[u.t,v.t];
   // v118 : l'évolution crée une nouvelle carte ; les 2 cartes de la recette repartent aussitôt en défausse (u.fbk).
   // La carte évoluée ne va jamais dans le deck : blessée elle va en réserve, détruite elle disparaît.
   u.fbk=(u.fbk||[]).concat([u,v].flatMap(w=>w.src||(w.gen?[]:[ck(w)])));u.src=[];delete u.gen;absorb(u,[v]);v.absorbed=1;st.grid[j]=null;u.t=k;u.hp=maxHp(st,u);
   return{k:'evo',i,j,t:k,from}}
  if(!canFuse(u.t))return null;const from=[];
  for(;;){const g=u.gold||0,same=st.grid.map((v,j)=>j!==i&&v&&v.t===u.t&&(v.gold||0)===g?j:-1).filter(j=>j>=0).sort((a,b)=>cheb(a,i)-cheb(b,i));
   const need=hasR(st,'recettes')?1:2;if(same.length<need)break;const js=same.slice(0,need);
   // v111 : la fusion crée une nouvelle carte ★ ; les cartes qui la composent repartent toutes en défausse
   // (u.fbk : cartes à rendre, que le rendu verse dans la défausse ; u.src=[] : la nouvelle carte ne revient pas quand l'unité tombe)
   if(!u.src||u.src.length){u.fbk=(u.fbk||[]).concat(u.src||(u.gen?[]:[ck(u)]));u.src=[]}
   absorb(u,js.map(j=>st.grid[j]));js.forEach(j=>{st.grid[j]=null});u.gold=g+1;u.hp=maxHp(st,u);from.push(...js)}
  return from.length?{k:'fuse',i,t:u.t,from,gold:u.gold}:null}
 // v126 : tableau des combats (comme Details! dans WoW) : dégâts infligés, encaissés, soins donnés et reçus, zombies tués, morts.
 // st.mtN : la nuit en cours ; st.mtR : toute la partie ; st.mtD : les morts. Les survivants ont chacun leur ligne (u.mid),
 // les murs, pièges et cartes sont regroupés par type ; les sources sans unité (brûlure, saignement, réactions) ont une ligne à part.
 function mkey(st,u){if(!u)return null;if(u.mid)return u.mid;if(isUnit(u.t)&&!u.gen)return u.mid='u'+(st.midN=(st.midN||0)+1);return 't:'+u.t}
 function mtr(st,u,k,v){if(!(v>0)||!u||!st.mtN)return;const id=mkey(st,u);if(!id)return;st.mtR=st.mtR||{};
  for(const m of [st.mtN,st.mtR]){const r=m[id]||(m[id]={id,t:u.t,name:'',dmg:0,tak:0,hg:0,hr:0,kills:0});r[k]+=v;if(u.name)r.name=u.name;r.t=u.t}}
 // soin compté : renvoie les PV réellement rendus
 function cure(st,v,a,by){if(!v||!(a>0))return 0;const b=v.hp;v.hp=Math.min(maxHp(st,v),v.hp+a);const g=v.hp-b;if(g>0){mtr(st,v,'hr',g);mtr(st,by||v,'hg',g)}return g}
 const ouch=(st,u,d,hp0)=>mtr(st,u,'tak',Math.max(0,Math.min(d,hp0)));
 // une unité tombe : un survivant nommé rejoint le mémorial (sauf s'il est Increvable et n'a pas encore utilisé sa chance)
 function lose(st,j,u,ev){if(u.trait==='increvable'&&!u.saved){u.hp=1;u.saved=1;ev.push({i:j,k:'saved',name:u.name});return false}
  if(hasEq(u,'pills')&&u.pillN!==st.night){u.pillN=st.night;u.hp=Math.min(4,maxHp(st,u));ev.push({i:j,k:'saved',name:u.name});return false}
  if(U[u.t].block&&!u.blessed&&around(j).some(k=>st.grid[k]&&U[st.grid[k].t].bless)){u.hp=1;u.blessed=1;ev.push({i:j,k:'saved',name:u.name||U[u.t].n});return false}
  // convalescence : une unité qui tombe pour la 1ʳᵉ fois part blessée en réserve (elle garde tout) et se repose 3 nuits.
  // Elle garde une cicatrice : la fois suivante, elle tombe pour de bon.
  const dlog=ko=>{if(isUnit(u.t)&&st.mtN)(st.mtD=st.mtD||[]).push({name:u.name||'',t:u.t,night:st.night,ko,by:st._zk||null,tick:st.tick||0})};
  if(isUnit(u.t)&&!u.scar){dlog(1);u.nts=0;if(!U[u.t].evo)(st.edKO=st.edKO||{})[u.t]=(st.edKO[u.t]||0)+1;st.grid[j]=null;u.scar=1;u.hp=0;u.koUntil=st.night+(men(st,7)?4:3)-(hasR(st,'serum')?1:0);(st.bench=st.bench||[]).push(u);ev.push({i:j,k:'ko',t:u.t,name:u.name});return true}
  dlog(0);u.nts=0;st.grid[j]=null;ev.push({i:j,k:'lost',t:u.t,name:u.name});
  if(isWallU(u))around(j).forEach(k=>{const v=st.grid[k];if(isWallU(v))v.hp=Math.min(v.hp,maxHp(st,v))});
  if(u.name)(st.fallen=st.fallen||[]).push({name:u.name,t:u.t,trait:u.trait,kills:u.kills||0,night:st.night});return true}
 function applyItem(st,t,i,rnd){const D=stat(st,t);
  if(t==='food')st.shelter=Math.min(maxS(st),st.shelter+D.gain);
  if(t==='rep')st.grid.forEach(u=>{if(u&&U[u.t].block)u.hp=Math.min(maxHp(st,u),u.hp+D.gain)});
  if(t==='kit'&&st.grid[i])st.grid[i].hp=maxHp(st,st.grid[i]);
  if(t==='coffee')st.energy+=2;
  if(D.equip&&st.grid[i]){const u=st.grid[i];(u.eq=u.eq||[]).push(t);if(t==='gear')u.hp+=4}
  if(t==='supply')st.scrap+=6;
  if(t==='airdrop')st.drawNow=(st.drawNow||0)+3;
  if(t==='v_heli'){st.energy+=2;st.drawNow=(st.drawNow||0)+2}
  if(t==='jerry')st.nextE=(st.nextE||0)+2;
  if(t==='rest')(st.bench||[]).forEach(u=>{delete u.koUntil;u.hp=maxHp(st,u)});
  if(t==='radioop')st.capB=1;
  if(t==='flare')st.side=Math.floor(rnd()*4)}

 /* ---------- la nuit ---------- */
 // nuits de pression : toutes les 5 nuits, +15 % de zombies pour la nuit (v132 : calculé sur le total, avant on arrondissait type par type et le pic montait à +40 %)
 const pressure=n=>n%5===0,PRESSURE=.15;
 /* tutoriel guidé (v163, revu en v164) : à la toute première partie (st.tuto), les nuits 1 à 4 sont calmes et réglées d'avance
    (petite horde fixe, par les 4 routes) ; la nuit 5 est une vraie nuit rouge, mais sans événement. */
 const TUTO_N=5,TUTO_W=[{walk:2},{walk:3},{walk:3},{walk:4}];
 const tutoOn=st=>!!(st&&st.tuto&&st.night<=TUTO_N);
 function waveList(st){const e=st.event.id,w={};
  if(tutoOn(st)&&TUTO_W[st.night-1]){for(const k of ZK)w[k]=TUTO_W[st.night-1][k]||0;return w}
  for(const k of ZK){let v=st.fixedW?(st.fixedW[k]||0):waveCount(k,st.night);if(!ZT[k].boss){if(e==='lune')v*=1.5;v=Math.round(v*(1+.15*mc(st,'nombre'))*(respite(st.night,st)?.7:1)*((PLACES[st.place]||{}).count||1)*((TIERS[st.tier]||TIERS.base).count)*(hasR(st,'appat')?1.15:1))}w[k]=v}
  if(pressure(st.night)){const ks=ZK.filter(k=>!ZT[k].boss&&w[k]>0),p=men(st,8)?.4:PRESSURE,tot=ks.reduce((a,k)=>a+w[k],0);let extra=Math.round(tot*p);
   // le surplus se répartit selon la part de chaque type (plus grands restes d'abord)
   const sh=ks.map(k=>({k,x:w[k]*p}));sh.forEach(o=>{const f=Math.floor(o.x);w[o.k]+=f;extra-=f});sh.sort((a,b)=>(b.x%1)-(a.x%1));for(let i=0;extra>0&&sh.length;i++,extra--)w[sh[i%sh.length].k]++}
  if(e==='sprint'){w.run+=w.walk;w.walk=0}
  if(w.boss&&men(st,9))w.boss++;
  return w}
 // les zombies ordinaires ont +20 % de PV (ils mouraient trop vite en début de partie) ; le Colosse n'est pas concerné
 const ZHP=1; // ancien bonus de PV des zombies, désormais intégré aux PV de base (v64)
 // la Mère libère 2 rampants en mourant (sauf dans la forêt)
 function broodDeath(st,z,ev){if(isEdge(z.pos))return;for(let k=0;k<2;k++)spawn(st,'crawl',z.pos);ev.push({i:z.pos,k:'howl'})}
 // PV d'un zombie de ce type cette nuit (frénésie, mutations, lieu) : sert au moteur et au panneau « Horde »
 function zMaxHp(st,k){return Math.ceil(ZT[k].hp*hpMult(st.night,st)*(men(st,1)?1.1:1)*(1+.15*mc(st,'peau'))*((PLACES[st.place]||{}).hp||1))}
 // zombies absents cette nuit qui apparaissent la nuit suivante (hors défi du jour)
 function newcomers(st){if(st.daily||st.fixedW)return[];const n=st.night;return ZK.filter(k=>waveCount(k,n+1)>0&&!(waveCount(k,n)>0))}
 function spawn(st,k,pos){const hp=zMaxHp(st,k);const z={id:++st.zid,k,pos,hp,max:hp,cd:zspd(st,k),style:st.zid%3};st.z.push(z);st.spawned=(st.spawned||0)+1;return z}
  // nuit du Colosse : la horde arrive en 2 vagues (le Colosse dans la 2ᵉ), avec une pause entre les deux où l'on déplace librement ses unités.
 // Toutes les autres nuits arrivent d'un seul tenant.
 const WAVES_N=2;
 function bigNight(st,w){w=w||waveList(st);return BOSSES.some(k=>w[k]>0)}
 function nextWave(st){st.wave=(st.wave||1)+1;st.wtick=0;st.freeMove=0}
 function startNight(st,rnd){st.k0=st.kills||0;st.mtN={};st.mtT=0;st.mtR=st.mtR||{};st._su=null;st._zk=null;const w=waveList(st),list=[],big=bigNight(st,w);st.grid.forEach(u=>{if(u){u.nk=0;u.lu=0}});st.noise=null;st.alarmT=0;
  for(const k of ZK)if(!ZT[k].boss)for(let j=0;j<w[k];j++)list.push(k);
  shuffle(list,rnd);
  const ps=(PLACES[st.place]||{}).sides,edges=st.side>=0?EDGES.filter(i=>sideOf(i)===st.side):ps?EDGES.filter(i=>ps.includes(sideOf(i))&&!(ps.indexOf(0)<0&&rc(i)[0]===0)):EDGES;
  const per=Math.ceil(list.length/WAVES_N)||1;st.waves=big?WAVES_N:0;st.freeMove=0;st.wave=1;st.wtick=0;st.rush=0;
  st.pending=list.map((k,j)=>{const wv=big?1+Math.floor(j/per):1,jj=big?j-(wv-1)*per:j;return{k,wave:wv,at:1+Math.floor(jj*1.3),pos:edges[Math.floor(rnd()*edges.length)]}});
  const bl=[];const L=leadBoss(st.night);if(L&&w[L])for(let j=0;j<w[L];j++)bl.push(L);BOSSES.forEach(k=>{if(k!==L)for(let j=0;j<(w[k]||0);j++)bl.push(k)});
  bl.forEach((k,j)=>st.pending.push({k,wave:big?WAVES_N:1,at:10+j*12,pos:edges[Math.floor(rnd()*edges.length)]}));
  st.cap=Math.max(90,st.pending.reduce((m,p)=>Math.max(m,p.at),0)+60);
  st.wend=st.pending.filter(p=>(p.wave||1)===1).reduce((m,p)=>Math.max(m,p.at),0)+60;
  st.z=[];st.tick=0}
 const power=st=>st.event.id!=='coupure'||st.relics.includes('groupe')||has(st,'solar')||has(st,'genmech');
 const lampB=(st,i,pow)=>pow?around(i).reduce((s,j)=>s+(st.grid[j]&&st.grid[j].t==='lamp'?stat(st,'lamp').buff:0),0):0;
 // un zombie encore dans la forêt (anneau extérieur) ne peut pas être touché : il faut qu'il entre sur la carte
 function hit(st,z,d,ev,src,fire){if(isEdge(z.pos))return false;if(d>0&&z.markT>0)d++;
 // tir de soutien (v136) : un DPS fait +1 dégât (une fois par tour) sur un zombie au contact d'un Tank
 if(d>0){const a=st._su||(src>=0?st.grid[src]:null);if(a&&a._sup!==st.tick&&roleOf(a.t)==='dps'&&st.grid.some((v,j)=>v&&roleOf(v.t)==='tank'&&cheb(j,z.pos)<=1)){a._sup=st.tick;d++}}if(d>0&&st._flood&&st._flood.some(j=>cheb(j,z.pos)<=2))d++;if(!fire){const a=(ZT[z.k].armor||0)+(z.k==='walk'?Math.min(3,mc(st,'carapace')):0);if(a)d=Math.max(0,d-a)}const was=z.hp;z.hp-=d;ev.push({i:z.pos,txt:d?'−'+d:'0',k:'hit',zid:z.id,src});
  const su=st._su||(src>=0?st.grid[src]:null);if(su&&was>0){mtr(st,su,'dmg',Math.min(d,was));if(z.hp<=0)mtr(st,su,'kills',1)}return was>0&&z.hp<=0}
 function explode(st,i,d,ev){st.z.filter(o=>o.hp>0&&cheb(o.pos,i)<=1).forEach(o=>hit(st,o,d,ev,i,1));ev.push({i,k:'boom'})}
 // la cible d'un zombie : le leurre (Sirène, Épouvantail) ou le Tank le plus proche à portée de provocation, sinon l'abri
 function lureTarget(st,p){if(st.rush)return C;if(st.noise&&st.noise.until>=st.tick)return st.noise.i;let best=C,bd=99;for(let j=0;j<st.grid.length;j++){const u=st.grid[j];if(!u)continue;const r=U[u.t].lure||(roleOf(u.t)==='tank'?TAUNT:0);if(!r)continue;const d=cheb(p,j);if(d<=r&&d<bd){bd=d;best=j}}return best}
 const nbRoles=(st,i)=>{const r=new Set();for(const j of around(i)){const v=st.grid[j];if(v)r.add(roleOf(v.t))}return r};
 function squad(st,i){const u=st.grid[i];if(!u)return false;const me=roleOf(u.t);if(!me)return false;const r=nbRoles(st,i);r.add(me);return r.has('tank')&&r.has('heal')&&r.has('dps')}
 function attack(st,i,u,D,rng,dmg,ev){
  const inR=()=>st.z.filter(z=>z.hp>0&&!isEdge(z.pos)&&inRange(z.pos,i,rng));
  const got=k=>{if(k){u.kills=(u.kills||0)+1;u.nk=(u.nk||0)+1;edKill(st,u);if(hasEq(u,'bandage'))cure(st,u,1,u);
   if(D.cat==='melee'&&ally(st,'fieldcare'))cure(st,u,1,u);
   if(D.healKill)around(i).forEach(j=>{const v=st.grid[j];if(v&&U[v.t].block&&v.hp<maxHp(st,v)){cure(st,v,1,u);ev.push({i:j,k:'heal'})}})}};
  const pierce=D.cat==='shoot'&&ally(st,'arsenal');
  if(D.aoe){let ts=inR();if(D.aoeMax)ts=ts.sort((a,b)=>cheb(a.pos,i)-cheb(b.pos,i)||cheb(a.pos,C)-cheb(b.pos,C)).slice(0,D.aoeMax);if(ts.length){ts.forEach(z=>got(hit(st,z,dmg,ev,i,pierce)));ev.push({i,k:'fire'})}return}
  if(D.molo||D.blast){const ts=inR();if(!ts.length)return;let best=null,bc=-1;
   for(const z of ts){const c=st.z.filter(o=>o.hp>0&&cheb(o.pos,z.pos)<=1).length;if(c>bc){bc=c;best=z}}
   const at=best.pos;ev.push({i,k:'fire'},D.blast?{i:at,k:'boom'}:{i:at,k:'molo',src:i});
   st.z.filter(o=>o.hp>0&&cheb(o.pos,at)<=1).forEach(o=>{got(hit(st,o,dmg,ev,i,1));if(D.molo)o.burnT=Math.max(o.burnT||0,2)});return}
  // le bonus (dmg − dégâts de base) compte une fois par attaque : il est réparti entre les tirs ou morsures
  const H=D.hits||1,bonus=Math.max(0,dmg-D.dmg),dh=h=>D.dmg+Math.floor(bonus/H)+(h<bonus%H?1:0);
  const done=new Set();
  for(let h=0;h<H;h++){let ts=inR();if(D.distinct)ts=ts.filter(z=>!done.has(z.id));if(!ts.length)break;
   ts.sort((a,b)=>cheb(a.pos,C)-cheb(b.pos,C)||a.hp-b.hp);const z=ts[0];done.add(z.id);
   const xb=(hasEq(u,'binoc')&&manh(z.pos,i)>2?1:0)+(hasEq(u,'torch')&&z.hp>=z.max?1:0);
   const ex=D.exec&&!ZT[z.k].boss&&(u.exN=(u.exN||0)+1)%D.exec===0;
   const killed=ex?hit(st,z,z.hp+9,ev,i,1):hit(st,z,(D.heavy&&(ZT[z.k].boss||z.k==='fat')?dh(h)*D.heavy:dh(h))+xb,ev,i,pierce);ev.push({i,k:'fire'});got(killed);
   if(D.mark&&z.hp>0)z.markT=Math.max(z.markT||0,D.mark+1);
   if((D.ignite||(u.t==='tesla'&&ally(st,'short')))&&z.hp>0)z.burnT=Math.max(z.burnT||0,D.ignite||3);
   if(D.stun&&z.hp>0&&(u.t!=='k9'||u.stunT!==st.tick)){z.cd+=D.stun;u.stunT=st.tick}
   if((D.push||(D.cat==='melee'&&ally(st,'patrol')))&&z.hp>0&&!ZT[z.k].boss){const b=back(z.pos),bu=st.grid[b];if(!(bu&&U[bu.t].block))z.pos=b}
   if((D.feed||(D.cat==='melee'&&(st._fl||{}).farm>=2))&&killed)cure(st,u,1,u)}
 }
 // réparateurs (Mécanicien, Atelier, Charpentier, L'Ingénieur) : ils réparent les murs et les postes de soutien ; les soigneurs, eux, soignent les unités
 const repairable=t=>!!(U[t]&&U[t].block&&(U[t].cat==='wall'||U[t].cat==='post'));
 // réparations : une même case de défense ne reçoit qu'une réparation par tour
 const repOK=(st,j)=>(st._rep||{})[j]!==st.tick,repDone=(st,j)=>{(st._rep||(st._rep={}))[j]=st.tick};
 const SPITS=3;
 // un zombie frappe une unité qui bloque (au contact, ou à distance pour le cracheur)
 function strike(st,z,n,u,ev,ranged,pow){st._zk=z.k;if(!z.reach){z.reach=1;st.reached=(st.reached||0)+1}const T=ZT[z.k],D=stat(st,u.t);
  if(T.sap){z.hp=0;z.bit=1;let left=D.cat==='wall'?(D.antiSap||SAP_WALL):6;
   // 15 dégâts au mur frappé (le surplus passe aux murs reliés les plus proches), 6 à une unité, puis 3 autour
   const cells=D.cat==='wall'?[n,...wallGroup(st,n).filter(j=>j!==n).sort((a,b)=>cheb(a,n)-cheb(b,n))]:[n];
   for(const j of cells){const v=st.grid[j];if(!v||left<=0)continue;const d=Math.min(left,v.hp);v.hp-=d;ouch(st,v,d,d);left-=d;ev.push({i:j,txt:'−'+d,k:'bite',zid:z.id});if(v.hp<=0)lose(st,j,v,ev)}
   sapBlast(st,z.pos,ev);return}let d=T.boss?bossHit(st):zhit(st,z);if(roleOf(u.t)==='tank'){u.blk=(u.blk||0)+1;if(u.blk%((hasEq(u,'gear')||hasR(st,'gilet'))?2:3)===0){ev.push({i:n,txt:_t('bloqué'),k:'block',zid:z.id});return}}if(!T.boss&&(st._fl||{}).police&&famOf(u.t)==='police')d=Math.max(1,d-1);if(!T.boss&&isUnit(u.t)&&nearPost(st,n,'trench'))d=Math.max(1,d-1);
  // curée (v114) : une unité encerclée prend +1 dégât par autre zombie à son contact (+2 au plus). v132 : les Tanks l'ignorent (ils sont faits pour être encerclés)
  if(!T.boss&&isUnit(u.t)&&roleOf(u.t)!=='tank')d+=Math.min(CUREE_MAX+(men(st,6)?1:0),st.z.filter(o=>o!==z&&o.hp>0&&!ZT[o.k].boss&&cheb(o.pos,n)<=1).length);
  // plafond par coup (Agent anti-émeute, Sacs de sable) : appliqué en dernier, après tous les bonus (v133)
  if(D.cap&&!T.boss)d=Math.min(d,D.cap);
  const tn=n,tu=u;
  ouch(st,tu,d,tu.hp);tu.hp-=d;ev.push({i:tn,txt:'−'+d,k:ranged?'spit':'bite',zid:z.id,from:z.pos});
  if(!ranged&&u.t==='fen'&&pow){const el=(st._fl||{}).tech||0;hit(st,z,((st.relics.includes('groupe')||has(st,'solar')||has(st,'genmech'))?2:1)+(el?1:0),ev,n);if(el>=2)z.cd+=1;if(ally(st,'short'))z.burnT=Math.max(z.burnT||0,3)}
  if(!ranged&&D.thorns&&u.t!=='fen')hit(st,z,D.thorns,ev,n);
  // riposte : une unité de corps à corps frappée au contact rend le coup aussitôt
  if(!ranged&&D.cat==='melee'&&D.dmg&&u.hp>0&&z.hp>0){const fl=st._fl||{};if(hit(st,z,D.dmg+unitDmg(u)+sol(st,n,u)+(fl.farm?1:0)+(fl.care&&famOf(u.t)==='care'?1:0)+(ally(st,'hunt')?1:0),ev,n)){u.kills=(u.kills||0)+1;u.nk=(u.nk||0)+1;edKill(st,u)}}
  if(D.gas){st.grid[n]=null;st._su=u;explode(st,n,D.gas,ev);st._su=null;return}
  if(tu.hp<=0&&lose(st,tn,tu,ev)&&stat(st,tu.t).tire)st.grid[tn]={t:'fire',hp:1,gen:1}}
 // un zombie entre sur une case sans obstacle
 function enter(st,z,n,u,ev){if(!u||U[u.t].block)return;const D=stat(st,u.t),tb=[0,2,4][(st._fl||{}).trap||0];
  if(D.cat==='trap'&&ally(st,'incend'))z.burnT=Math.max(z.burnT||0,3);
  if(D.trap){hit(st,z,D.trap+tb,ev,n);st.grid[n]=null}
  if(D.mine){if(D.multi&&--u.hp>0){}else st.grid[n]=null;explode(st,n,D.mine+tb+((st._fl||{}).mil>=2?3:0),ev)}
  if(D.spike){hit(st,z,D.spike+tb,ev,n);u.hp--;if(u.hp<=0)st.grid[n]=null}
  if(D.wire){hit(st,z,D.wire+tb,ev,n);z.cd+=ZT[z.k].spd}
  if(D.clay){st.grid[n]=null;st.z.filter(o=>o.hp>0&&cheb(o.pos,n)<=2).forEach(o=>hit(st,o,D.clay+tb+((st._fl||{}).mil>=2?3:0),ev,n,1));ev.push({i:n,k:'boom'})}
  if(D.firetrap){st.grid[n]=null;st.z.filter(o=>o.hp>0&&cheb(o.pos,n)<=1).forEach(o=>{hit(st,o,D.firetrap+tb,ev,n,1);o.burnT=Math.max(o.burnT||0,3)});ev.push({i:n,k:'boom'})}
  if(D.net){z.cd+=D.net;ev.push({i:n,k:'eat',zid:z.id});u.hp--;if(u.hp<=0)st.grid[n]=null}
  if(D.smoke){st.z.filter(o=>o.hp>0&&cheb(o.pos,n)<=1).forEach(o=>o.cd+=D.smoke);ev.push({i:n,k:'smoke'});st.grid[n]=null}
  if(D.bait){z.cd+=D.bait;ev.push({i:n,k:'eat',zid:z.id});u.hp--;if(u.hp<=0)st.grid[n]=null}
  if(D.log&&(u.lu||0)<3){u.lu=(u.lu||0)+1;hit(st,z,D.log+tb,ev,n);if(z.hp>0&&!ZT[z.k].boss)for(let k=0;k<2;k++){const b=back(z.pos),bu=st.grid[b];if(!(bu&&U[bu.t].block))z.pos=b}}
  if(D.pit){if(!u.open&&!ZT[z.k].boss){u.open=1;hit(st,z,z.hp,ev,n,1);ev.push({i:n,k:'boom'})}else z.cd+=1}
  if(D.bleed)z.bleedT=Math.max(z.bleedT||0,D.bleed);
  if(D.alarm){st.alarmT=st.tick+D.alarm;st.grid[n]=null;ev.push({i:n,k:'howl'})}
  if(D.rocks){st.grid[n]=null;explode(st,n,D.rocks+tb,ev)}}
 function step(st){const ev=[];st.tick++;st.mtT=(st.mtT||0)+1;st.mtRT=(st.mtRT||0)+1;st._df={};st.wtick=(st.wtick||0)+1;const e=st.event.id,pow=power(st),fl=st._fl=famLevels(st);st._al=new Set(allies(st));if(st.rushT>0)st.rushT--;
  st.pending=st.pending.filter(p=>{if((p.wave||1)===(st.wave||1)&&p.at<=st.wtick){spawn(st,p.k,p.pos);return false}return true});
  const alive=()=>st.z.filter(z=>z.hp>0);
  for(const z of alive()){z.inFire=0}
  st._flood=pow?st.grid.map((u,j)=>u&&u.t==='flood'?j:-1).filter(j=>j>=0):[];
  st._su={t:'x_burn'};for(const z of alive())if(z.burnT>0){z.burnT--;hit(st,z,1+(fl.pyro?1:0),ev,-1,1)}
  st._su={t:'x_bleed'};for(const z of alive())if(z.bleedT>0){z.bleedT--;hit(st,z,1,ev,-1,1)}st._su=null;
  for(const z of alive())if(z.markT>0)z.markT--;
  if(mc(st,'regen')&&st.tick%3===0)for(const z of alive())if(z.hp<z.max)z.hp=Math.min(z.max,z.hp+mc(st,'regen'));
  for(let i=0;i<st.grid.length;i++){const u=st.grid[i];if(!u)continue;const D=stat(st,u.t);
   if(D.rng&&st.tick%D.every===0&&!(D.jam&&st.tick%D.jam===0)&&!(D.needPow&&!pow)){
    const reps=1+(around(i).some(j=>{const L=st.grid[j]&&U[st.grid[j].t];return L&&L.lead&&st.tick%(L.chief?3:2)===0})?1:0)+(st.rushT>0?1:0);
    const F=famOf(u.t),rng=Math.max(1,D.rng-(e==='brume'&&D.cat==='shoot'?1:0)+(D.cat==='shoot'&&ally(st,'martial')?1:0)+((TRAITS[u.trait]||{}).rngB||0)+(fl.police>=2&&F==='police'?1:0)+(fl.comm&&F==='comm'&&D.rng>1?1:0)+(D.rng>1&&hasEq(u,'binoc')?1:0)+(D.cat==='shoot'&&D.rng>1&&nearPost(st,i,'tower')?1:0)+(e==='brume'&&D.cat==='shoot'&&hasEq(u,'torch')?1:0)),
     dmg=D.dmg+lampB(st,i,pow)+(D.cat==='shoot'&&st.grid.some((v,j)=>v&&v.t==='v_radio'&&j!==i&&cheb(j,i)<=2)?1:0)+unitDmg(u)+sol(st,i,u)+(fl.mil&&F==='mil'?1:0)+(D.cat==='melee'&&fl.farm?1:0)+(fl.tech&&F==='tech'?1:0)+(fl.care&&F==='care'?1:0)+(D.cat==='melee'&&ally(st,'hunt')?1:0)+(squad(st,i)?1:0)+(F&&fl[F]>=2?1:0)+(DOGS.includes(u.t)&&around(i).some(j=>st.grid[j]&&U[st.grid[j].t].dogBoost)?1:0)+(D.cat==='shoot'&&st.alarmT>=st.tick?1:0);
    // v136 : les tirs lents (Sniper…) reçoivent leurs bonus fixes multipliés par leur intervalle, pour ne pas perdre la moitié des bonus
    const bon=dmg-D.dmg,dmgF=D.every>1&&bon>0?D.dmg+bon*D.every:dmg;
    for(let r=0;r<reps;r++)attack(st,i,u,D,rng,dmgF,ev)}
   if(D.heal&&(D.hfast||st.tick%2===0)){const ns=(D.hrng>1?st.grid.map((v,j)=>j).filter(j=>j!==i&&inRange(j,i,D.hrng)):around(i)).map(j=>st.grid[j]).filter(v=>v&&isUnit(v.t)&&v.hp<maxHp(st,v));if(ns.length){ns.sort((a,b)=>(a.hp-maxHp(st,a))-(b.hp-maxHp(st,b)));cure(st,ns[0],D.heal+(fl.care?1:0)+(hasR(st,'chirurgien')?1:0)+(u.gold||0)+(squad(st,i)?1:0),u);ev.push({i,k:'heal'})}}
   if(D.mech&&!D.mechAll){const ns=around(i).filter(j=>st.grid[j]&&repairable(st.grid[j].t)&&st.grid[j].hp<maxHp(st,st.grid[j])&&repOK(st,j));if(ns.length){repDone(st,ns[0]);const w=st.grid[ns[0]];cure(st,w,(D.mech>1?D.mech:1)+(fl.tech>=2?1:0)+(u.gold||0)+(sol(st,i,u)?1:0),u);ev.push({i:ns[0],k:'heal'})}}
   if(D.selfHeal&&st.tick%2===0&&u.hp<maxHp(st,u)){cure(st,u,1,u);ev.push({i,k:'heal'})}
   if(hasEq(u,'medkit')&&st.tick%2===0){const ns=around(i).filter(j=>{const v=st.grid[j];return v&&isUnit(v.t)&&v.hp<maxHp(st,v)});if(ns.length){const v=st.grid[ns[0]];cure(st,v,1,u);ev.push({i:ns[0],k:'heal'})}}
   if(D.regen&&st.tick%D.regen===0&&u.hp<maxHp(st,u)){cure(st,u,1,u);ev.push({i,k:'heal'})}
   if(D.healAll&&st.tick%2===0)around(i).forEach(j=>{const v=st.grid[j];if(v&&isUnit(v.t)&&v.hp<maxHp(st,v)){cure(st,v,1+(fl.care?1:0)+(hasR(st,'chirurgien')?1:0),u);ev.push({i:j,k:'heal'})}});
   if(D.mechAll)around(i).forEach(j=>{const v=st.grid[j];if(v&&repairable(v.t)&&v.hp<maxHp(st,v)&&repOK(st,j)){repDone(st,j);cure(st,v,1+(fl.tech>=2?1:0),u);ev.push({i:j,k:'heal'})}});
   if(D.aura&&st.tick%2===0)alive().filter(z=>cheb(z.pos,i)<=1).forEach(z=>{hit(st,z,1+(fl.pyro?1:0),ev,i,1);z.burnT=Math.max(z.burnT||0,2)});
   if(D.burn&&e!=='pluie')alive().filter(z=>z.pos===i).forEach(z=>{z.inFire=1;hit(st,z,D.burn+(fl.pyro?1:0),ev,i,1)});
   if(D.dyn&&st.tick===8){st.grid[i]=null;st._su=u;explode(st,i,D.dyn+(fl.mil>=2?3:0),ev);st._su=null}
  }
  // Patient Zéro : les zombies proches avancent 50 % plus vite ; la Mère pond des rampants
  const hasters=alive().filter(z=>ZT[z.k].haste&&!isEdge(z.pos));
  for(const z of alive())if(ZT[z.k].brood&&!isEdge(z.pos)&&(z.kids||0)<6&&st.tick%ZT[z.k].brood===0){z.kids=(z.kids||0)+1;const c=spawn(st,'crawl',z.pos);c.cd=2;ev.push({i:z.pos,k:'howl'})}
  for(const z of st.z){if(z.hp<=0)continue;z.cd--;if(z.cd>0)continue;const T=ZT[z.k];z.cd=zspd(st,z.k);if(st.rush)z.cd=Math.max(1,Math.ceil(z.cd/2));if(hasters.length&&!T.boss&&hasters.some(h=>cheb(h.pos,z.pos)<=ZT[h.k].haste))z.cd=Math.max(1,Math.floor(z.cd*2/3));
   const tgt=lureTarget(st,z.pos);
   let n=T.boss?moves(z.pos,tgt,z.style)[0]:pathStep(st,z.pos,tgt,zmode(T),z.style);
   if(n===C){if(!z.reach){z.reach=1;st.reached=(st.reached||0)+1}const dm=T.sap?3:zhit(st,z);if(dm>0&&st._breach!==st.tick){st._breach=st.tick;st.z.forEach(o=>{if(o!==z&&o.hp>0)o.cd=Math.min(o.cd,1)});ev.push({i:C,k:'breach'})}if(T.sap)ev.push({i:C,k:'boom'});mtr(st,{t:'x_shelter'},'tak',dm);st.shelter-=dm;ev.push({i:C,txt:'−'+dm,k:'bite',zid:z.id});if(!T.boss){z.hp=0;z.bit=1}continue}
   const u=st.grid[n];
   if(u&&U[u.t].block&&!(T.crawl&&U[u.t].cat==='wall')){strike(st,z,n,u,ev,false,pow);continue}
   if(T.spit&&!isEdge(z.pos)){const n2=pathStep(st,n,tgt,zmode(T),z.style);
    if(n2===C){if(!z.reach){z.reach=1;st.reached=(st.reached||0)+1}const dm=zhit(st,z);mtr(st,{t:'x_shelter'},'tak',dm);st.shelter-=dm;ev.push({i:C,txt:'−'+dm,k:'spit',zid:z.id,from:z.pos});continue}
    // après 3 crachats sur la même défense, il avance au contact (sinon il reste hors de portée et bloque la vague)
    const u2=st.grid[n2];if(u2&&U[u2.t].block&&(z.spits||0)<SPITS){z.spits=(z.spits||0)+1;strike(st,z,n2,u2,ev,true,pow);continue}z.spits=0}
   z.pos=n;st._su=u||null;enter(st,z,n,u,ev);st._su=null
  }
  for(const z of st.z)if(z.hp<=0&&!z.dead){z.dead=1;if(!z.bit){const T=ZT[z.k];st.kills++;st.scrap+=killScrap(st,T.boss);ev.push({i:z.pos,k:'die',zid:z.id,boss:!!T.boss});
   if(fl.pyro>=2&&(z.burnT>0||z.inFire)){st._su={t:'x_burn'};st.z.filter(o=>o.hp>0&&o!==z&&cheb(o.pos,z.pos)<=1).forEach(o=>hit(st,o,2,ev,-1,1));st._su=null;ev.push({i:z.pos,k:'boom'})}
   st._zk=z.k;if(mc(st,'putride'))around(z.pos).forEach(j=>{const u=st.grid[j],pd=mc(st,'putride');if(u&&U[u.t].block){ouch(st,u,pd,u.hp);u.hp-=pd;ev.push({i:j,txt:'−'+pd,k:'bite',zid:z.id});if(u.hp<=0)lose(st,j,u,ev)}});
   if(T.howl){ev.push({i:z.pos,k:'howl'});for(let k=0;k<T.howl;k++)spawn(st,'walk',z.pos)}
   if(T.brood)broodDeath(st,z,ev);
   if(T.sap)sapBlast(st,z.pos,ev)}}st._zk=null;
  st.z=st.z.filter(z=>z.hp>0);
  const boss=st.z.some(z=>ZT[z.k].boss)||st.pending.some(p=>ZT[p.k].boss);
  // v182 : ruée de l'aube. Le temps est écoulé et des zombies restent : ils ignorent les tanks et les leurres, vont 2× plus vite et foncent sur l'abri.
  // Après RUSH_MAX tours, ceux qui restent mordent l'abri et la nuit se termine (évite de gagner en bloquant la horde sans la tuer).
  const late=st.wtick>(st.cap||90)+(boss?110:0);
  if(late&&!st.rush&&st.shelter>0&&st.z.length){st.rush=st.tick;st.pending=[];ev.push({i:C,k:'rush'})}
  if(st.rush&&st.tick-st.rush>=RUSH_MAX&&st.z.length&&st.shelter>0){for(const z of st.z){const dm=zhit(st,z);if(dm>0){mtr(st,{t:'x_shelter'},'tak',dm);st.shelter-=dm;ev.push({i:C,txt:'−'+dm,k:'bite',zid:z.id})}}st.z=[]}
  const done=(!st.pending.length&&!st.z.length)||st.shelter<=0||(late&&!st.z.length);
  // fin d'une vague : pause (le joueur déplace librement ses unités et peut jouer ses réactions avant la suivante)
  if(!done&&st.waves&&!st.z.length&&!st.pending.some(p=>(p.wave||1)===st.wave)){st.freeMove=1;return{ev,done:false,pause:st.wave}}
  // vague bloquée (ex. un cracheur qui crache sur un mur réparé sans que personne ne puisse l'atteindre) : la vague suivante arrive quand même, sans pause
  if(!done&&st.waves&&st.wave<st.waves&&st.wtick>(st.wend||150)&&!st.pending.some(p=>(p.wave||1)===st.wave))nextWave(st)
  return{ev,done};
 }
 // l'aube : l'essence s'éteint, les soins et la ferraille de l'aube s'appliquent
 function endNight(st){// historique pour le Journal : zombies tués et dégâts infligés de chaque nuit
  try{const d=Object.values(st.mtN||{}).reduce((a,r)=>a+(r.dmg||0),0);(st.hist=st.hist||[])[st.night-1]={k:Math.max(0,(st.kills||0)-(st.k0||0)),d:Math.round(d)}}catch(e){}
  st.grid.forEach((u,i)=>{if(u&&u.t==='fire')st.grid[i]=null;else if(u&&u.trait==='coriace'&&u.hp>0)u.hp=Math.min(maxHp(st,u),u.hp+1)});st.z=[];st.side=-1;st.rush=0;
  if(st.shelter<=0)return{heal:0,scrap:0};
  // v181 : nuits d'affilée survécues sur le terrain (Blindée à 20)
  st.grid.forEach(u=>{if(u&&isUnit(u.t)&&!U[u.t].evo){u.nts=(u.nts||0)+1;if(u.nts>=ED_GOAL.arm&&edOk(u.t,'arm')){const a=st.edArm=st.edArm||[];if(!a.includes(u.t))a.push(u.t)}}});
  const fl=famLevels(st),T=TIERS[st.tier]||TIERS.base;
  const mutual=allies(st).includes('mutual');if(mutual)st.grid.forEach(u=>{if(u&&U[u.t].block)u.hp=Math.min(maxHp(st,u),u.hp+1)});
  const h=st.grid.reduce((a,u)=>a+(u&&U[u.t].cook||0),0)+(st.relics.includes('soupe')?1:0)+(fl.comm?1:0)+(mutual?1:0),before=st.shelter;
  if(fl.care>=2)st.grid.forEach(u=>{if(u&&isUnit(u.t))u.hp=Math.min(maxHp(st,u),u.hp+2)});
  st.shelter=Math.min(maxS(st),st.shelter+h);
  if(hasR(st,'pacte'))st.shelter=Math.max(1,st.shelter-1);
  if(hasR(st,'cloche'))st.grid.forEach(u=>{if(u&&isUnit(u.t))u.hp=Math.min(maxHp(st,u),u.hp+2)});
  st.grid.forEach((u,i)=>{if(u&&U[u.t].carp)around(i).forEach(j=>{const v=st.grid[j];if(v&&repairable(v.t))v.hp=Math.min(maxHp(st,v),v.hp+U[u.t].carp)})});
  st.grid.forEach((u,i)=>{if(u&&isUnit(u.t)&&nearPost(st,i,'pump'))u.hp=maxHp(st,u)});
  const bh=st.grid.reduce((a,u)=>a+(u&&U[u.t].benchHeal||0),0);if(bh)(st.bench||[]).forEach(u=>{if(!u.koUntil)u.hp=Math.min(maxHp(st,u),u.hp+bh)});
  const s=(st.relics.includes('aimant')?3:0)+(T.scrap||0)+st.grid.reduce((a,u)=>a+(u&&U[u.t].market||0)+(u&&hasEq(u,'pack')?(u.nk||0):0),0);st.scrap+=s;
  return{heal:st.shelter-before,scrap:s,card:T.card||null,relic:!!T.relic,tier:st.tier||'base'}}
 // réactions pendant la nuit
 function canReact(st,t,i){const D=U[t];if(!D||!D.react||!canPay(st,t))return false;
  if(D.antiboss)return bossAlive(st);
  if(t==='talkie')return !!(st.grid[i]&&isUnit(st.grid[i].t)&&st.grid[i].hp<maxHp(st,st.grid[i])&&(st.bench||[]).some(v=>!v.koUntil));
  if(D.react==='unit')return !!(st.grid[i]&&U[st.grid[i].t].block&&st.grid[i].hp<maxHp(st,st.grid[i]));return D.react==='any'||(i>=0&&i<N*N)}
 function react(st,t,i){if(!canReact(st,t,i))return null;const ev=[];st._su={t};st.energy-=costOf(st,t);st.disc=1;const al=()=>st.z.filter(z=>z.hp>0&&!isEdge(z.pos));
  if(t==='grenade')explode(st,i,5,ev);
  if(t==='v_napalm'){explode(st,i,4,ev);around(i).concat(i).forEach(j=>{if(!isEdge(j)&&j!==C&&!st.grid[j])st.grid[j]={t:'fire',hp:1,gen:1}});al().filter(z=>z.hp>0&&cheb(z.pos,i)<=1).forEach(z=>{z.burnT=Math.max(z.burnT||0,3)});ev.push({i,k:'molo',src:C})}
  if(t==='shot'){const z=al().sort((a,b)=>cheb(a.pos,C)-cheb(b.pos,C)||a.hp-b.hp)[0];if(z){hit(st,z,6,ev,-1,1);ev.push({i:C,k:'shot',zid:z.id})}}
  if(t==='patch'){const u=st.grid[i];cure(st,u,5,{t});ev.push({i,k:'heal'})}
  if(t==='molotov'){al().filter(z=>cheb(z.pos,i)<=1).forEach(z=>{hit(st,z,2,ev,-1,1);z.burnT=Math.max(z.burnT||0,4)});ev.push({i,k:'molo',src:C})}
  if(t==='horn'){al().forEach(z=>{if(ZT[z.k].boss)return;const b=back(z.pos),bu=st.grid[b];if(!(bu&&U[bu.t].block))z.pos=b});ev.push({i:C,k:'horn'})}
  if(t==='rush'){st.rushT=3;ev.push({i:C,k:'rush'})}
  if(t==='tear'){al().filter(z=>cheb(z.pos,i)<=1).forEach(z=>z.cd+=3);ev.push({i,k:'smoke'})}
  if(t==='talkie'){const b=st.bench;let k=-1;b.forEach((v,j)=>{if(!v.koUntil&&(k<0||v.hp>b[k].hp))k=j});const v=b.splice(k,1)[0];b.push(st.grid[i]);st.grid[i]=v;ev.push({i,k:'heal'})}
  if(U[t].antiboss){const z=al().filter(z=>ZT[z.k].boss).sort((a,b)=>a.hp-b.hp)[0];if(z){hit(st,z,ammoDmg(z),ev,-1,1);ev.push({i:C,k:'shot',zid:z.id})}}
  if(t==='storm'){al().forEach(z=>{z.cd+=2;z.burnT=0});st.grid.forEach((u,j)=>{if(u&&u.t==='fire')st.grid[j]=null});ev.push({i:C,k:'horn'})}
  if(t==='bomber'){const r=rc(i)[0];al().filter(z=>rc(z.pos)[0]===r).forEach(z=>hit(st,z,8,ev,-1,1));for(let c=1;c<N-1;c++)ev.push({i:idx(r,c),k:'boom'})}
  if(t==='noise'){st.noise={i,until:st.tick+4};ev.push({i,k:'howl'})}
  if(t==='air'){al().filter(z=>cheb(z.pos,i)<=2).forEach(z=>hit(st,z,10,ev,-1,1));ev.push({i,k:'air'})}
  if(t==='napalm'){around(i).concat(i).forEach(j=>{if(!isEdge(j)&&j!==C&&!st.grid[j])st.grid[j]={t:'fire',hp:1,gen:1}});al().filter(z=>cheb(z.pos,i)<=1).forEach(z=>{hit(st,z,1,ev,-1,1);z.burnT=Math.max(z.burnT||0,3)});ev.push({i,k:'molo',src:C})}
  for(const z of st.z)if(z.hp<=0&&!z.dead){z.dead=1;st.kills++;st.scrap+=killScrap(st,ZT[z.k].boss);ev.push({i:z.pos,k:'die',zid:z.id,boss:!!ZT[z.k].boss});if(ZT[z.k].brood)broodDeath(st,z,ev)}
  st._su=null;st.z=st.z.filter(z=>z.hp>0);return ev}
 function runNight(st,rnd){startNight(st,rnd);let r;do{r=step(st);if(r.pause)nextWave(st)}while(!r.done)}
 return{edKill,EDS,ED_IDS,ED_MAX,FAN_MAX,ED_GOAL,baseOf,edOf,ck,edOk,edCards,fanN,zMaxHp,newcomers,TUTO_N,TUTO_W,tutoOn,DAILY,dailyPlan,dailyState,dailyScore,BOSSES,leadBoss,bossOf,inRange,manh,SAP_WALL,ROLES,roleOf,TAUNT,squad,nbRoles,lureTarget,pathStep,field,killZones,N,C,MID,LINE,LINE_MAX,TRACE,CHARGES,chargesOf,isTrace,charges,isBuild,buildCost,lineCost,lineCells,placeLine,MAXS,maxS,PLACES,UNLOCK,unlocks,costOf,DECK_MIN,DECK_MAX,COPY_MAX,CARD_PRICE,giftCount,giftOffer,STARTER_CARDS,STARTER_DECK,copyMax,runPoints,deckError,U,KEYS,ZT,ZK,EVENTS,RELICS,relicNight,MUTS,mutNight,mutate,zspd,mc,CHARS,SHOP,shopCost,RARITY,RAR,waveCount,SIDES,UPGRADABLE,get HPS(){return HPS},set HPS(v){HPS=v},hpMult,get WAVES(){return WAVES},set WAVES(v){WAVES=v},get GROW(){return GROW},set GROW(v){GROW=v},
  RUSH_MAX,DAWN,dawnEvent,resolveDawn,CUREE_MAX,VICTORY_CARDS,VICTORY_RELICS,relicOpen,ammoMax,hasR,MENACES,MENACE_MAX,applyMenace,setDemo,isDemo,demoOk,DEMO_N,DEMO_CHARS,DEMO_PLACES,WIN_NIGHT,winPoints,killScrap,EV_CHANCE,EV_GAP,STORE_N,AMMO_COST,STORE_PRICE,storePrice,storeOffer,buyStore,rc,isEdge,isForest,ROADS,INNER,EDGES,around,cheb,newState,newDay,waveList,stat,upgDesc,upgrade,addRelic,relicChoices,draftChoices,shuffle,pay,touch,canPlace,place,startNight,step,endNight,runNight,drawCount,FAM,CHIEF,famOf,famCounts,famLevels,TIERS,nightOffers,nightChoice,canReact,react,TRAITS,named,maxHp,sol,ALLY,ALLY_MIN,allies,wallGroup,LEGACY_KILLS,legacies,bigNight,nextWave,WAVES_N,AMMO_MAX,AMMO_DMG,bossAlive,fireAmmo,ZHP,EVO,EVO_KEYS,merge,frenzy,frenzyMult,zhit,testProgress,FRENZY,FRENZY_FROM,dmgBonus,pressure,PRESSURE,lvKills,lvOf,ammoDmg,LVL,lvPending,lvReady,levelUp,ENERGY,HAND_MAX,cost,canPay,canMove,move,bossHit,frenzyLv,fzHit,zDmgAvg,respite,eqOf,hasEq,isUnit,unitCap,unitCount,capFull,canRecall,recall,canPlaceBench,placeBench,famLevel};
})();
if(typeof module!=='undefined')module.exports=Z;
