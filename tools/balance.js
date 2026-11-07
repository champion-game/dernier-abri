// Test d'équilibrage (Node). À lancer quand Amine le demande : node tools/balance.js
// Trois analyses, toutes sur le vrai moteur (src/engine.js) :
//  1. Valeur des cartes : chaque carte est ajoutée à une défense de référence (3 barricades + 2 tireurs sur la route du nord),
//     face à la horde de la nuit 3, 8 et 15. On mesure ce qu'elle apporte (dégâts, zombies tués, PV de l'abri sauvés)
//     et on le rapporte à son coût en énergie. Les cartes très au-dessus ou très en dessous de la moyenne sont signalées.
//  2. Courbe de difficulté : un joueur automatique (pioche réelle, énergie du moteur, limite d'unités, réserve et convalescence,
//     cartes tenues par les unités posées, fusion en nouvelle carte ★, ferme les routes avec des murs,
//     place ses tireurs derrière, ses tanks et ses soigneurs autour) joue des parties complètes. On mesure jusqu'où il tient.
//  3. Montée en puissance : nombre de zombies et PV totaux de la horde nuit après nuit.
// Rapport complet : tools/balance-out/rapport.md ; historique des versions : tools/balance-out/historique.csv.
// Options : PARTIES=40 (parties de la courbe), ESSAIS=24 (nuits par carte et par palier).
const path = require('path'),
  fs = require('fs');
const Z = require(path.join(__dirname, '../src/engine.js'));
const OUT = path.join(__dirname, 'balance-out');
fs.mkdirSync(OUT, { recursive: true });
const VERSION =
  (fs.readFileSync(path.join(__dirname, '../src/game.js'), 'utf8').match(/const VERSION='([^ ']+)/) || [])[1] || '?';
const PARTIES = +process.env.PARTIES || 40,
  ESSAIS = +process.env.ESSAIS || 24;
function rng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1e9) / 1e9;
  };
}
const idx = (r, c) => r * Z.N + c,
  U = Z.U,
  t0 = Date.now();
const lines = [];
const out = s => {
  lines.push(s);
};

/* ---------- outils communs ---------- */
// joue une nuit complète et renvoie les dégâts infligés par case d'unité, les zombies tués, les PV perdus par l'abri
function playNight(st, r) {
  const dmg = {},
    s0 = st.shelter;
  let kills0 = st.kills;
  Z.startNight(st, r);
  let res,
    t = 0;
  do {
    res = Z.step(st);
    t++;
    if (res.pause) Z.nextWave(st);
    for (const e of res.ev || [])
      if (e.k === 'hit' && e.src >= 0 && e.txt) {
        const d = +String(e.txt).replace('−', '');
        if (d > 0) dmg[e.src] = (dmg[e.src] || 0) + d;
      }
  } while (!res.done && t < 3000);
  return { dmg, kills: st.kills - kills0, lost: Math.max(0, s0 - Math.max(0, st.shelter)), fell: st.shelter <= 0 };
}
const median = a => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? s[s.length >> 1] : 0;
};
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

/* ---------- 1. valeur des cartes ---------- */
// défense de référence sur la route du nord (la horde de la nuit ne vient que de ce côté)
function base(night, seed) {
  const r = rng(seed);
  const st = Z.newState('surv', 'bois', r);
  st.grid.fill(null);
  st.night = night;
  st.event = Z.EVENTS[0];
  st.side = 0;
  st.shelter = st.maxS = 99;
  [3, 4, 5].forEach(c => Z.place(st, 'bar', idx(2, c), r, true));
  Z.place(st, 'gun', idx(3, 3), r, true);
  Z.place(st, 'gun', idx(3, 5), r, true);
  return { st, r };
}
// emplacements essayés pour la carte testée : derrière le mur, devant, à la place du mur central, à côté des tireurs
const SLOTS = [idx(3, 4), idx(1, 4), idx(2, 4), idx(4, 4), idx(1, 3)];
function evalCard(t, night) {
  let gain = 0,
    kills = 0,
    saved = 0,
    n = 0;
  const D = U[t];
  for (let k = 0; k < ESSAIS; k++) {
    const seed = night * 1000 + k + 1;
    const b0 = base(night, seed),
      r0 = playNight(b0.st, b0.r);
    const ref = Object.values(r0.dmg).reduce((a, b) => a + b, 0);
    let best = null;
    for (const slot of SLOTS) {
      const { st, r } = base(night, seed);
      if (slot === idx(2, 4) && D.cat !== 'trap' && !D.instant) st.grid[slot] = null;
      if (D.react || D.instant || D.onUnit) continue;
      if (!Z.canPlace(st, t, slot)) continue;
      if (Z.LINE.includes(t) && slot === idx(1, 4)) Z.placeLine(st, t, [idx(1, 3), idx(1, 4), idx(1, 5)], r);
      else Z.place(st, t, slot, r, true);
      const res = playNight(st, r);
      const tot = Object.values(res.dmg).reduce((a, b) => a + b, 0);
      const score = tot - ref + (res.kills - r0.kills) * 5 + (r0.lost - res.lost) * 8;
      if (!best || score > best.score) best = { score, tot, kills: res.kills - r0.kills, saved: r0.lost - res.lost };
    }
    if (best) {
      gain += best.tot - ref;
      kills += best.kills;
      saved += best.saved;
      n++;
    }
  }
  return n ? { gain: gain / n, kills: kills / n, saved: saved / n } : null;
}
const TESTED = Object.keys(U).filter(t => !U[t].evo && !U[t].react && !U[t].instant && !U[t].onUnit);
// soutien dont l'effet ne se voit pas sur une seule nuit (pioche, ferraille, soins, réparations à l'aube, courant…) :
// mesuré mais pas classé. Seuls les soutiens qui frappent ou renforcent les attaques sont classés.
const MEASURABLE = t =>
  (U[t].cat !== 'help' && U[t].cat !== 'post') || U[t].dmg || U[t].buff || U[t].lead || U[t].chief;
const NIGHTS = [3, 8, 15],
  cards = [];
for (const t of TESTED) {
  const r = { t, cost: Math.max(1, Z.cost(t)), by: {} };
  let score = 0;
  for (const n of NIGHTS) {
    const e = evalCard(t, n);
    r.by[n] = e;
    if (e) score += e.gain + e.kills * 5 + e.saved * 8;
  }
  r.value = score / NIGHTS.length / r.cost;
  cards.push(r);
}
// chaque carte est comparée aux cartes de son type (murs entre eux, tireurs entre eux…)
const CATS = [...new Set(cards.map(c => U[c.t].cat))],
  medBy = {};
CATS.forEach(
  k =>
    (medBy[k] =
      median(
        cards
          .filter(c => U[c.t].cat === k && MEASURABLE(c.t))
          .map(c => c.value)
          .filter(v => v > 0),
      ) || 1),
);
cards.forEach(c => (c.rel = c.value / medBy[U[c.t].cat]));
cards.sort((a, b) => U[a.t].cat.localeCompare(U[b.t].cat) || b.rel - a.rel);
const strong = cards.filter(c => MEASURABLE(c.t) && c.rel >= 1.8),
  weak = cards.filter(c => MEASURABLE(c.t) && c.rel <= 0.4 && c.t !== 'door');

/* ---------- 2. courbe de difficulté : parties complètes ---------- */
const ROADS = [
  { mouth: idx(0, 4), front: [idx(1, 3), idx(1, 4), idx(1, 5)], back: [idx(2, 3), idx(2, 5), idx(2, 4)] },
  { mouth: idx(8, 4), front: [idx(7, 3), idx(7, 4), idx(7, 5)], back: [idx(6, 3), idx(6, 5), idx(6, 4)] },
  { mouth: idx(4, 0), front: [idx(3, 1), idx(4, 1), idx(5, 1)], back: [idx(3, 2), idx(5, 2), idx(4, 2)] },
  { mouth: idx(4, 8), front: [idx(3, 7), idx(4, 7), idx(5, 7)], back: [idx(3, 6), idx(5, 6), idx(4, 6)] },
];
// un bon deck de 26 cartes, équilibré entre murs, tireurs, corps à corps, soins et objets
const DECK =
  'bar bar bar sand sand car gun gun gun snp mg hunter xbow axe cop riot dog med med pharma mech lamp food food rep trap'.split(
    ' ',
  );
function freeIn(st, cells) {
  return cells.filter(j => !st.grid[j]);
}
// choix de la case selon le rôle de la carte : murs sur la route la moins défendue, tireurs et soigneurs autour de l'abri
// (de là, avec la portée 3, ils couvrent deux routes), corps à corps et tanks juste derrière le mur
const RING1 = [...Array(81).keys()].filter(i => Z.cheb(i, Z.C) === 1),
  RING2 = [...Array(81).keys()].filter(i => Z.cheb(i, Z.C) === 2 && !Z.isEdge(i));
function slotFor(st, t) {
  const D = U[t],
    role = Z.roleOf(t);
  const order = [...ROADS].sort((a, b) => defense(st, a) - defense(st, b));
  const try_ = cells => cells.find(j => Z.canPlace(st, t, j));
  if (D.cat === 'wall') return try_(order.flatMap(R => R.front));
  if (D.cat === 'trap') return try_(order.flatMap(R => R.back.slice(0, 2)));
  if (D.cat === 'melee' || role === 'tank') return try_(order.flatMap(R => [R.back[2], ...R.back])) ?? try_(RING2);
  return try_(RING1) ?? try_(RING2) ?? try_([...Array(81).keys()]);
}
function defense(st, R) {
  return [...R.front, ...R.back].reduce(
    (s, j) => s + (st.grid[j] ? (U[st.grid[j].t].cat === 'wall' ? st.grid[j].hp : 8) : 0),
    0,
  );
}
// ideal=true : le joueur a toujours tout le deck en main (il choisit librement), repère d'un très bon joueur
const clone = o => JSON.parse(JSON.stringify(o));
// note d'une fin de nuit : PV de l'abri d'abord, puis zombies tués et PV des unités restantes
// v112 : seuls les PV des unités comptent (avant, les murs gonflaient la note : le joueur automatique bétonnait au lieu de tirer)
const score = st =>
  st.shelter * 30 + st.kills * 6 + st.grid.reduce((a, u) => a + (u && Z.isUnit(u.t) ? Math.min(u.hp, 20) : 0), 0) * 0.3;
// il juge ses poses sur une nuit plus dure que la prochaine (2 nuits plus tard) pour ne pas sous-estimer les tueurs
function simNight(st, seed) {
  const c = clone(st);
  c.event = Z.EVENTS.find(e => e.id === st.event.id) || st.event;
  playNight(c, rng(seed));
  return c;
}
// v112 : il juge ses poses sur la vraie nuit suivante, en moyenne sur 2 tirages (l'abri peut passer sous 0 : on voit l'écart même dans une nuit perdue)
const simScore = (st, seed) => (score(simNight(st, seed)) + score(simNight(st, seed + 1))) / 2;
// pose une carte à la case de son rôle (un mur à tracer est posé en ligne devant la route)
function playCard(st, t, r) {
  const D = U[t];
  if (D.instant) {
    Z.place(st, t, Z.C, r);
    return true;
  }
  const j = slotFor(st, t);
  if (j == null) return false;
  if (Z.isTrace(t)) {
    const R = ROADS.find(R => R.front.includes(j));
    const cells = R ? freeIn(st, R.front).filter(c => Z.canPlace(st, t, c)) : [j];
    if (cells.length > 1) Z.placeLine(st, t, cells.slice(0, Z.chargesOf(t)), r);
    else Z.place(st, t, j, r);
  } else Z.place(st, t, j, r);
  return true;
}
// cartes tenues par les unités posées (comme dans le jeu) : la carte revient en défausse quand l'unité quitte le plateau ;
// une fusion rend aussitôt les 3 cartes qui la composent (u.fbk) ; une unité absorbée par une évolution ne rend rien tout de suite
const cardsOf = u => u.src || (u.gen ? [] : [u.t]);
function syncCards(st, G) {
  const live = new Set(st.grid.filter(Boolean).concat(st.bench || []));
  for (const u of live)
    if (u.fbk) {
      G.disc.push(...u.fbk);
      delete u.fbk;
    }
  for (const u of G.board) if (!live.has(u) && !u.absorbed) G.disc.push(...cardsOf(u));
  G.board = [...live];
}
// réserve : les blessés guéris (convalescence finie) reviennent sur le plateau, à la case de leur rôle
function rebench(st) {
  for (let k = (st.bench || []).length - 1; k >= 0; k--) {
    const u = st.bench[k];
    if (u.koUntil) continue;
    const j = slotFor(st, u.t);
    if (j != null && Z.canPlaceBench(st, k, j)) Z.placeBench(st, k, j);
  }
}
function game(seed, ideal) {
  const r = rng(seed);
  const st = Z.newState('surv', 'bois', r);
  let draw = Z.shuffle([...DECK], r),
    hand = [];
  const G = { disc: [], board: [] };
  const stats = { spawned: 0, reached: 0, dealt: 0 };
  for (;;) {
    rebench(st);
    syncCards(st, G);
    let disc = G.disc; // pioche
    if (ideal) {
      hand = [...DECK];
    } else {
      const n = Z.drawCount(st);
      let fresh = 0;
      while ((hand.length < n || fresh < 1) && hand.length < Z.HAND_MAX) {
        fresh++;
        if (!draw.length) {
          draw = Z.shuffle(G.disc, r);
          G.disc = disc = [];
        }
        if (!draw.length) break;
        hand.push(draw.pop());
      }
    }
    // jour : il essaie chaque carte jouable de sa main sur une copie de la nuit à venir et pose la meilleure,
    // tant qu'il reste de l'énergie et qu'une carte améliore le résultat
    const nseed = Math.floor(r() * 1e9);
    for (let guard = 0; guard < 10; guard++) {
      let best = null,
        any = null;
      const base = simScore(st, nseed);
      for (const t of [...new Set(hand)]) {
        const D = U[t];
        if (!Z.canPay(st, t) || D.onUnit || D.react) continue;
        if (
          D.instant &&
          !(
            (t === 'food' && st.shelter < st.maxS - 2) ||
            (t === 'rep' && st.grid.some(u => u && U[u.t].block && u.hp < Z.maxHp(st, u) - 2))
          )
        )
          continue;
        const c = clone(st);
        if (!playCard(c, t, r)) continue;
        const v = simScore(c, nseed);
        const gain = (v - base) / Math.max(1, Z.costOf(st, t));
        if (v > base && (!best || gain > best.gain)) best = { t, gain };
        if (!D.instant && (!any || gain > any.gain)) any = { t, gain };
      }
      // rien n'améliore la simulation : il pose quand même la meilleure carte plutôt que de garder son énergie
      if (!best) best = any;
      if (!best) break;
      playCard(st, best.t, r);
      const h = hand.indexOf(best.t);
      hand.splice(h, 1);
      if (U[best.t].instant || Z.isTrace(best.t)) disc.push(best.t);
      syncCards(st, G);
      disc = G.disc;
    }
    if (!ideal) while (hand.length > Z.HAND_MAX - 1) G.disc.push(hand.pop());
    const res = playNight(st, r);
    Z.endNight(st);
    syncCards(st, G);
    stats.dealt += Object.values(res.dmg).reduce((a, b) => a + b, 0);
    stats.spawned += st.spawned || 0;
    stats.reached += st.reached || 0;
    st.spawned = 0;
    st.reached = 0;
    if (st.shelter <= 0 || st.night >= 60) return { night: st.night, fell: st.shelter <= 0, ...stats };
    // aube : niveaux (dégâts), mutation, relique, troc
    for (let i = 0; i < 81; i++) while (st.grid[i] && Z.lvPending(st.grid[i]) > 0) Z.levelUp(st, i, 'atk');
    if (Z.mutNight(st.night)) Z.mutate(st, r);
    if (Z.relicNight(st.night)) {
      const c = Z.relicChoices(st, r);
      if (c.length) Z.addRelic(st, c[0]);
    }
    for (let k = 0; k < 5; k++) {
      if (st.shelter <= st.maxS - 3 && Z.pay(st, 'heal')) continue;
      break;
    }
    Z.newDay(st, r);
  }
}
function curveOf(ideal) {
  const runs = [];
  for (let g = 0; g < PARTIES; g++) runs.push(game(7000 + g, ideal));
  const deaths = runs.map(x => x.night),
    alive = n => pct(runs.filter(x => x.night > n || !x.fell).length, runs.length);
  return {
    deaths,
    alive,
    reached: pct(
      runs.reduce((a, x) => a + x.reached, 0),
      runs.reduce((a, x) => a + x.spawned, 0),
    ),
  };
}
const CUR = curveOf(false),
  IDEAL = curveOf(true);

/* ---------- 3. montée en puissance de la horde ---------- */
const curve = [1, 3, 5, 10, 15, 20, 30, 40, 50, 60].map(n => {
  const st = Z.newState('surv', 'bois', rng(n));
  st.night = n;
  const w = Z.waveList(st);
  const count = Object.entries(w).reduce((a, [k, v]) => a + v, 0);
  const hp = Object.entries(w).reduce(
    (a, [k, v]) => a + v * Math.ceil(Z.ZT[k].hp * (Z.ZT[k].boss ? 1 + 0.08 * Math.max(0, n - 10) : Z.hpMult(n))),
    0,
  );
  return { n, count, hp, dmg: 1 + Z.dmgBonus(n) };
});

/* ---------- rapport ---------- */
const f1 = x => Math.round(x * 10) / 10;
out(`# Rapport d'équilibrage — ${VERSION}\n`);
out(
  `Généré le ${new Date().toLocaleString('fr-FR')} en ${Math.round((Date.now() - t0) / 1000)} s. Ces chiffres viennent d'un joueur automatique : ils servent à comparer les cartes et les versions entre elles, pas à prédire ton score.\n`,
);
out(`## 1. Courbe de difficulté (${PARTIES} parties par joueur automatique)\n`);
out(
  `Le joueur automatique ferme d'abord les routes avec ses murs, place ses tireurs et soigneurs autour de l'abri, ses tanks et son corps à corps derrière les murs, monte ses niveaux en dégâts et répare l'abri au troc. Deck : ${DECK.length} cartes équilibrées. Il ne joue pas les réactions de nuit.\n`,
);
out(
  `| Joueur | Chute (médiane) | Moyenne | Meilleure | Vivant N5 | N10 | N15 | N20 | N30 | Zombies au contact |\n|---|---|---|---|---|---|---|---|---|---|`,
);
for (const [nm, c] of [
  ['Pioche normale', CUR],
  ['Deck entier en main (très bon joueur)', IDEAL],
])
  out(
    `| ${nm} | **${median(c.deaths)}** | ${f1(c.deaths.reduce((a, b) => a + b, 0) / c.deaths.length)} | ${Math.max(...c.deaths)} | ${c.alive(5)} % | ${c.alive(10)} % | ${c.alive(15)} % | ${c.alive(20)} % | ${c.alive(30)} % | ${c.reached} % |`,
  );
out('');
out(
  `## 2. Montée en puissance de la horde\n\n| Nuit | Zombies | PV totaux | Dégâts par coup (rôdeur) |\n|---|---|---|---|`,
);
curve.forEach(c => out(`| ${c.n} | ${c.count} | ${c.hp} | ${c.dmg} |`));
out(`\n## 3. Valeur des cartes (${ESSAIS} nuits par palier, nuits ${NIGHTS.join(', ')})\n`);
out(
  `Valeur = apport moyen (dégâts en plus + zombies tués en plus × 5 + PV de l'abri sauvés × 8) divisé par le coût, comparé aux cartes du même type : 100 = la carte médiane de son type.\n`,
);
// classement général : toutes les cartes mesurables, de la plus rentable à la moins rentable (100 = médiane générale)
{
  const ms = cards.filter(c => MEASURABLE(c.t) && c.t !== 'door'),
    gm = median(ms.map(c => c.value).filter(v => v > 0)) || 1;
  out(
    `### Classement général (rentabilité par point d'énergie, 100 = la carte médiane)\n\n| Rang | Carte | Type | Coût | Score |\n|---|---|---|---|---|`,
  );
  [...ms]
    .sort((a, b) => b.value - a.value)
    .forEach((c, k) =>
      out(
        `| ${k + 1} | ${U[c.t].n} | ${{ wall: 'Défense', shoot: 'Tireur', melee: 'Corps à corps', help: 'Soutien', trap: 'Piège', post: 'Poste' }[U[c.t].cat]} | ${Z.cost(c.t)} | ${Math.round((c.value / gm) * 100)} |`,
      ),
    );
  out('');
}
out(
  `**Trop fortes (≥ 180)** : ${strong.map(c => `${U[c.t].n} (${Math.round(c.rel * 100)})`).join(', ') || 'aucune'}\n`,
);
out(`**Trop faibles (≤ 40)** : ${weak.map(c => `${U[c.t].n} (${Math.round(c.rel * 100)})`).join(', ') || 'aucune'}\n`);
out(
  `| Carte | Type | Coût | Valeur | Dégâts en plus (N3 / N8 / N15) | Zombies tués en plus | PV abri sauvés |\n|---|---|---|---|---|---|---|`,
);
cards.forEach(c => {
  const b = NIGHTS.map(n => (c.by[n] ? f1(c.by[n].gain) : '—')).join(' / ');
  const k = f1(NIGHTS.reduce((a, n) => a + (c.by[n] ? c.by[n].kills : 0), 0) / NIGHTS.length);
  const s = f1(NIGHTS.reduce((a, n) => a + (c.by[n] ? c.by[n].saved : 0), 0) / NIGHTS.length);
  out(
    `| ${U[c.t].n} | ${{ wall: 'Défense', shoot: 'Tireur', melee: 'Corps à corps', help: 'Soutien', trap: 'Piège', post: 'Poste' }[U[c.t].cat]} | ${Z.cost(c.t)} | ${MEASURABLE(c.t) ? Math.round(c.rel * 100) : 'non classé'} | ${b} | ${k} | ${s} |`,
  );
});
out(
  `\nNon classées : les soutiens à effet indirect (pioche, ferraille, soins, réparations, courant) et la Porte blindée (collée à l'abri), car une seule nuit sur une seule route ne montre pas leur effet. Non testées : les cartes à effet à la demande ou sur l'abri : ${Object.keys(
    U,
  )
    .filter(t => !U[t].evo && (U[t].react || U[t].instant || U[t].onUnit))
    .map(t => U[t].n)
    .join(', ')}.`,
);
fs.writeFileSync(path.join(OUT, 'rapport.md'), lines.join('\n') + '\n');
// historique : une ligne par lancement, pour comparer les versions
const H = path.join(OUT, 'historique.csv');
if (!fs.existsSync(H))
  fs.writeFileSync(
    H,
    'date;version;chute_mediane(pioche/ideal);vivant_n10;vivant_n20;contact_pct;cartes_trop_fortes;cartes_trop_faibles\n',
  );
fs.appendFileSync(
  H,
  [
    new Date().toISOString().slice(0, 16),
    VERSION,
    median(CUR.deaths) + '/' + median(IDEAL.deaths),
    CUR.alive(10) + '/' + IDEAL.alive(10),
    CUR.alive(20) + '/' + IDEAL.alive(20),
    CUR.reached,
    strong.map(c => c.t).join(' '),
    weak.map(c => c.t).join(' '),
  ].join(';') + '\n',
);
// résumé à l'écran
console.log(`Équilibrage ${VERSION} (${Math.round((Date.now() - t0) / 1000)} s)`);
console.log(
  `  Chute (joueur auto, pioche normale) : nuit ${median(CUR.deaths)} en médiane · vivant N10 ${CUR.alive(10)} % · contact ${CUR.reached} %`,
);
console.log(
  `  Chute (très bon joueur, deck entier) : nuit ${median(IDEAL.deaths)} en médiane · vivant N10 ${IDEAL.alive(10)} % · N20 ${IDEAL.alive(20)} %`,
);
console.log(`  Trop fortes : ${strong.map(c => U[c.t].n).join(', ') || 'aucune'}`);
console.log(`  Trop faibles : ${weak.map(c => U[c.t].n).join(', ') || 'aucune'}`);
console.log(`  Rapport complet : tools/balance-out/rapport.md`);
