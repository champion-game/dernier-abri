// Génère docs/EQUILIBRAGE_IA.md : toutes les règles et valeurs d'équilibrage, à donner à une IA pour avoir des propositions.
// Usage : node tools/equilibrage.js > docs/EQUILIBRAGE_IA.md
const Z = require(process.argv[2] || require('path').join(__dirname, '../src/engine.js'));
const L = [];
const p = s => L.push(s);
const CAT = {
  wall: 'Défenses',
  shoot: 'Tireurs (distance)',
  melee: 'Corps à corps',
  help: 'Soutien',
  trap: 'Pièges',
  item: 'Objets (jour)',
  react: 'Réactions (nuit)',
};
p(`# Dernier Abri : dossier d'équilibrage

## Consigne pour l'IA

Tu es game designer spécialisé en équilibrage de roguelites et de tower defense.
Voici toutes les règles et toutes les valeurs du jeu « Dernier Abri ». Analyse-les et propose un équilibrage.

Objectifs du créateur :
- La survie est sans fin : le score est le nombre de nuits survécues.
- Les zombies doivent devenir de plus en plus puissants. Le joueur doit pouvoir suivre cette montée en construisant de bons combos (factions, voisins, niveaux, fusions), sans jamais la dépasser durablement. Il ne faut pas plafonner les combos.
- Les zombies doivent arriver jusqu'au corps à corps : les tirs ne doivent pas tout tuer avant.
- La construction (murs, pièges) doit être aussi importante que les troupes.
- Chaque carte doit avoir une raison d'être jouée ; aucune ne doit dominer.

Ce que j'attends de toi :
1. Les déséquilibres que tu repères (cartes trop fortes ou trop faibles, bonus qui s'emballent, courbe de difficulté), avec le calcul qui le montre (par exemple dégâts par tour et par énergie).
2. Des modifications chiffrées et précises (« Tireur : 2 → 1 dégât »), classées par priorité.
3. Pour chaque modification, l'effet attendu sur la partie.
4. Si tu proposes une nouvelle règle, décris-la en une ou deux phrases simples.

## Règles générales

- Plateau de ${Z.N}×${Z.N} cases, l'abri au centre (${Z.MAXS} PV). Le bord est une forêt infranchissable, sauf 4 routes au milieu de chaque bord : les zombies n'entrent que par ces routes.
- Chaque jour : ${Z.ENERGY} énergie, pioche de 5 cartes (main de ${Z.HAND_MAX} au maximum). On pose des cartes autour de l'abri, puis la nuit se joue toute seule en temps réel, tour par tour.
- Deck fermé de ${Z.DECK_MIN} à ${Z.DECK_MAX} cartes, construit avant la partie avec les cartes débloquées. Exemplaires max : commune 3, rare 2, épique 1, légendaire 1.
- Deck de départ : ${Z.STARTER_DECK.map(t => Z.U[t].n).join(', ')}.
- À l'aube : choisir une carte du deck à avoir en main le lendemain, un événement à choix, et un troc contre de la ferraille.
- On peut déplacer une unité par jour.
- L'abri perd des PV quand un zombie l'atteint ; à 0 PV la partie est perdue.

### Constructions
- Cartes à tracer : ${Z.TRACE.map(t => Z.U[t].n).join(', ')}. Une carte donne ${Z.CHARGES} cases pour la journée (3 pour ${['tire', 'barrier', 'modwall'].map(t => Z.U[t].n).join(', ')}), pour le prix de la carte. Les cases se posent une par une ou en ligne ; la carte part à la défausse une fois ses cases posées ou le soir.
- Les autres pièges restent en main la journée et se reposent à leur prix normal.
- Des murs voisins forment un rempart : chaque mur garde ses PV (le mur frappé encaisse) et gagne +1 PV max par mur voisin relié, jusqu’à +3.
- Les zombies calculent leur chemin : entrer sur une case libre coûte 1, sur un mur ou une unité coûte ses PV (pour un rempart, les PV de tout le rempart). Ils contournent si le détour coûte moins cher que de casser.

### Rôles
- Tank : les zombies à ${Z.TAUNT} cases ou moins le visent au lieu de l'abri ; il bloque 1 coup sur 3 ; les soins sur lui sont doublés.
- DPS : +1 dégât s'il a un Tank voisin.
- Escouade : une unité qui a, avec ses voisins, un Tank, un Soin et un DPS gagne +1 dégât (ou +1 soin).

### Bonus de dégâts (ils s'additionnent sans plafond)
Dégâts d'une attaque = dégâts de base + projecteur voisin (+1) + niveaux (+1 par niveau d'attaque) + étoiles de fusion (+1 par étoile) + trait (Précis +1, Aguerri +1 après 10 kills) + souvenir d'héritage (+1) + solidarité (+1 par paire de voisins de la même faction, sans limite) + faction au palier 1 (+1 pour Militaires, Bricoleurs, Soignants ; +1 au corps à corps pour Fermiers) + faction au palier 3 (+1 pour toute la faction) + alliance chasse (+1 au corps à corps) + Tank voisin pour un DPS (+1) + escouade (+1).
Pour une unité qui tire ou mord plusieurs fois, ce bonus total compte une fois par attaque et se répartit entre les coups.
Le Chef de groupe et le Maire donnent des attaques en plus ; la carte Adrénaline double les attaques pendant 3 tours.

### Progression des unités
- Niveaux : à ${Z.lvKills(1)} zombies tués, puis ${Z.lvKills(2) - Z.lvKills(1)}, ${Z.lvKills(3) - Z.lvKills(2)}, ${Z.lvKills(4) - Z.lvKills(3)}… de plus (sans plafond), une unité choisit +1 dégât ou +3 PV.
- Fusion : 3 unités identiques avec le même nombre d'étoiles fusionnent en une unité avec une étoile de plus (+120 % des PV de base et +1 dégât par étoile, sans plafond).
- Évolutions secrètes (deux cartes côte à côte → une unité unique) : ${Z.EVO_KEYS.map(k => Z.U[k].n + ' = ' + Z.EVO[k].map(t => Z.U[t].n).join(' + ')).join(' ; ')}.
- Traits aléatoires des survivants : ${Object.values(Z.TRAITS)
  .map(t => t.n + ' (' + t.d + ')')
  .join(', ')}.

### Factions
Paliers : 4, 6 et 8 unités de la faction sur le plateau. Le Chef (carte légendaire) donne +1 palier tant qu'il est en vie (jusqu'au palier 3).
${Object.values(Z.FAM)
  .map(
    f =>
      `- ${f.n} (${f.cards.map(t => Z.U[t].n).join(', ')}) : ${f.lv[0]} unités → ${f.d[0]} ; ${f.lv[1]} → ${f.d[1]} ; ${f.lv[2]} → ${f.d[2]}.`,
  )
  .join('\n')}

### Alliances (deux factions avec chacune au moins ${Z.ALLY_MIN} unités)
${Object.values(Z.ALLY)
  .map(a => `- ${a.n} (${a.f.map(f => Z.FAM[f].n).join(' + ')}) : ${a.d}.`)
  .join('\n')}

### Reliques (une toutes les 5 nuits)
${Object.values(Z.RELICS)
  .map(r => `- ${r.n} : ${r.d}.`)
  .join('\n')}

## La horde

- Nombre de zombies par nuit (nuits 1 à 10), puis + croissance par nuit au-delà :
${Object.keys(Z.WAVES)
  .map(k => `  - ${Z.ZT[k].n} : ${Z.WAVES[k].join(', ')} ; ensuite +${String(Z.GROW[k]).replace('.', ',')} par nuit`)
  .join('\n')}
- Le Colosse : ${Z.ZT.boss.hp} PV, 1 la nuit 10, 2 la nuit 20, etc. Les nuits du Colosse se jouent en ${Z.WAVES_N} vagues avec une pause pour déplacer ses troupes. Munitions anti-Colosse : ${Z.AMMO_MAX} en stock maximum.
- PV des zombies : PV de base jusqu'à la nuit 3, puis +8 % des PV de base par nuit (additif, arrondi au-dessus). Le Colosse : ${Z.ZT.boss.hp} PV à la nuit 10, puis +8 % par nuit.
- Dégâts des zombies : +1 toutes les 20 nuits.
- Nuits de pression : toutes les 5 nuits, +25 % de zombies. Brèche : quand un zombie blesse l'abri, tous les autres avancent aussitôt d'une case.
- Pas de frénésie ni de multiplicateur exponentiel. Munition anti-Colosse : 15 dégâts + 25 % des PV max du Colosse.
- Mutations : toutes les 5 nuits, la horde gagne une mutation permanente au hasard : ${Object.values(Z.MUTS)
  .map(m => m.n + ' (' + m.d + ')')
  .join(' ; ')}.
- Événements de nuit possibles : ${Z.EVENTS.map(e => e.n + (e.d && e.id !== 'calme' ? ' (' + e.d + ')' : '')).join(' ; ')}.
- Un tour de nuit : chaque unité attaque selon sa cadence, puis chaque zombie avance d'une case selon sa vitesse ou frappe ce qui le bloque.

### Zombies
| Zombie | PV de base | Dégâts | Vitesse | Capacité |
|---|---|---|---|---|
${Object.keys(Z.ZT)
  .map(k => {
    const T = Z.ZT[k];
    return `| ${T.n} | ${T.hp} | ${T.dmg} | 1 case / ${T.spd} tour${T.spd > 1 ? 's' : ''} | ${T.info} |`;
  })
  .join('\n')}

## Les cartes
Colonnes : coût en énergie, rareté, PV, dégâts par coup, portée (losange, en cases), cadence, rôle, faction, capacité. ✦ = évolution secrète (ne se joue pas, se forme sur le plateau).
`);
const RN = { com: 'commune', rare: 'rare', epic: 'épique', leg: 'légendaire' };
for (const c of Object.keys(CAT)) {
  p(
    `\n### ${CAT[c]}\n\n| Carte | Coût | Rareté | PV | Dégâts | Portée | Cadence | Rôle | Faction | Capacité |\n|---|---|---|---|---|---|---|---|---|---|`,
  );
  for (const t of Object.keys(Z.U).filter(t => Z.U[t].cat === c)) {
    const D = Z.U[t],
      ro = Z.roleOf(t),
      f = Z.famOf(t);
    p(
      `| ${D.evo ? '✦ ' : ''}${D.n} | ${D.evo ? '—' : Z.cost(t)} | ${D.evo ? '—' : RN[Z.RAR[t]] || '—'} | ${D.block && D.hp ? D.hp : '—'} | ${D.dmg ?? (D.heal ? 'soin +' + D.heal : '—')}${D.hits > 1 ? ' ×' + D.hits : ''} | ${D.rng ?? '—'} | ${D.every ? (D.every === 1 ? 'chaque tour' : '1 tour sur ' + D.every) : '—'} | ${ro ? Z.ROLES[ro].n : '—'} | ${f ? Z.FAM[f].n : '—'} | ${D.d.replace(/\|/g, '/')} |`,
    );
  }
}
p(
  `\n## Troc de l'aube (ferraille)\n${Object.values(Z.SHOP)
    .map(s => `- ${s.n} : ${s.d} (${s.cost} ferraille${s.more ? ', +' + s.more + ' à chaque achat' : ''}).`)
    .join('\n')}`,
);
p(
  `\n## Survivants de départ\n${Object.values(Z.CHARS)
    .map(c => `- ${c.n} : ${c.d}`)
    .join('\n')}`,
);
p(
  `\n## Lieux\n${Object.values(Z.PLACES)
    .map(c => `- ${c.n} : ${c.d}`)
    .join('\n')}`,
);
console.log(L.join('\n'));
