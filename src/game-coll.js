/* ---------- collection du style artiste (v222) ----------
   Reprise de l’interface « Collection » du laboratoire (champion-game/laboratoire-, interfaces/collection) :
   filtres à gauche, recherche, grille de cartes au centre, grande carte à droite qui se retourne quand on en choisit une autre,
   inclinaison 3D et reflet au survol de la souris, cartes distribuées à l’ouverture.
   Seulement avec le style artiste (html.artx) : le style actuel garde son ancienne collection.
   Chargé en dernier : remplace collectionScreen quand le style artiste est actif. */
const LC = { sel: null, deal: 0, flip: 0, next: null };
// filtres : types de carte puis rôles (un seul à la fois, comme les catégories du laboratoire) ; CF.role est partagé avec l’éditeur de deck
const lcTypes = () => [
  ['', ii('card'), _t('Toutes')],
  ['c:wall', svg('bar'), CATN.wall],
  ['c:post', ii('post'), CATN.post],
  ['c:shoot', svg('gun'), CATN.shoot],
  ['c:melee', ii('sword'), CATN.melee],
  ['c:help', svg('radio'), CATN.help],
  ['c:trap', ink('trap'), CATN.trap],
  ['c:item', ii('pack'), CATN.item],
  ['c:react', ii('bolt'), CATN.react],
  ['tank', ink('tank'), 'Tank'],
  ['heal', ink('heal'), _t('Soin')],
  ['dps', ink('dps'), 'DPS'],
];
const lcHit = (t, r) => !r || (r.startsWith('c:') ? Z.U[t].cat === r.slice(2) : Z.roleOf(t) === r);
const lcPrice = t => Z.CARD_PRICE[Z.RAR[t] || 'com'];
// trois états : débloquée, achetable maintenant, hors de portée (plus : victoire en Mutation, jeu complet)
const lcState = t =>
  META.cards.includes(t) || (META.eds || []).includes(t)
    ? 'in'
    : Z.U[t].vic != null
      ? 'vic'
      : !Z.demoOk(t)
        ? 'full'
        : META.points >= lcPrice(t)
          ? 'buy'
          : 'far';
const lcN = t => norm(Z.U[t].n + ' ' + (Z.U[t].d || ''));

// une carte de la grille. Collection : on la choisit (grande carte). Deck : on l’ajoute, grisée si on ne peut plus.
const lcShine = t =>
  (Z.RAR[t] || 'com') !== 'com'
    ? `<i class="lc-shine" style="--sd:${((Z.KEYS.indexOf(t) * 1.7) % 6).toFixed(1)}s"></i>`
    : '';
function lcItem(t, i) {
  const st = lcState(t),
    eds = META.eds || [],
    sp = !Z.edOf(t) && Z.edCards(t).some(v => eds.includes(v));
  const badge =
    st === 'in'
      ? ''
      : st === 'vic'
        ? `<span class="cbadge vic">${ii('trophy')}</span>`
        : st === 'buy'
          ? `<span class="lc-pr">${ii('unlock')}${lcPrice(t)}</span>`
          : `<span class="cbadge lk">${ii('lock')}</span>`;
  return `<div class="lc-w${LC.deal ? ' deal' : ''}" data-t="${t}" style="--i:${Math.min(i, 24)};--dx:${((i % 3) - 1) * -50};--rot:${(i % 2 ? 1 : -1) * (6 + (i % 4) * 3)}">
  <div class="lc s-${st}${t === LC.sel ? ' on' : ''}" data-a="lcsel" data-v="${t}" role="button" tabindex="0" aria-label="${Z.U[t].n}"><div class="lc-tilt">${cardFace(t, { base: 1 })}${lcShine(t)}<i class="lc-glare"></i></div>${badge}${cNew(t)}${sp ? `<span class="cspec" title="${_t('Carte spéciale obtenue')}"></span>` : ''}</div></div>`;
}
function lcDkItem(t, i, d, cnt) {
  const n = cnt[t] || 0,
    mx = Z.edOf(t) ? 1 : Z.copyMax(t),
    ok = deckCanAdd(d, t);
  return `<div class="lc-w${LC.deal ? ' deal' : ''}" data-t="${t}" style="--i:${Math.min(i, 24)};--dx:${((i % 3) - 1) * -50};--rot:${(i % 2 ? 1 : -1) * (6 + (i % 4) * 3)}">
  <div class="lc${ok ? '' : ' nadd'}" data-a="lcadd" data-v="${t}" role="button" tabindex="0" aria-label="${_t('Ajouter')} ${Z.U[t].n}"${ok ? '' : ' aria-disabled="true"'}><div class="lc-tilt">${cardFace(t, { base: 1 })}${lcShine(t)}<i class="lc-glare"></i></div>${n ? `<span class="lc-n${n >= mx ? ' max' : ''}">${n}/${mx}</span>` : ''}${cNew(t)}</div></div>`;
}

// sous la grande carte : type, faction, rôle et ce qu’il faut pour la débloquer
function lcInfo(t) {
  const U = Z.U[t],
    st = lcState(t),
    pr = lcPrice(t),
    f = Z.famOf(t),
    ro = Z.roleOf(t),
    eds = META.eds || [],
    sp = !Z.edOf(t) && Z.edCards(t).some(v => eds.includes(v));
  const meta = [CATN[U.cat], f ? Z.FAM[f].n : '', ro ? Z.ROLES[ro].n : '']
    .filter(Boolean)
    .map(x => `<span>${x}</span>`)
    .join('');
  const act =
    st === 'in'
      ? `<b class="lcd-ok">✓ ${_t('Débloquée')}</b>`
      : st === 'vic'
        ? _t`<b class="vlock">${ii('trophy')} Victoire en Mutation ${U.vic}</b>`
        : st === 'full'
          ? _t`<b class="vlock">${ii('lock')} Jeu complet</b>`
          : st === 'buy'
            ? _t`<button type="button" class="buy ok" data-a="unlock" data-v="${t}">${ii('unlock')} Débloquer · ${pr} pts</button>`
            : _t`<span class="cfar"><span>${ii('lock')} ${pr} pts</span><small>il en manque ${pr - META.points}</small></span>`;
  return `<div class="lcd-meta">${meta}</div><div class="lcd-act">${act}</div>${sp ? `<p class="lcd-sp">${ii('star')} ${_t('Carte spéciale obtenue')}</p>` : ''}`;
}
const lcBack = () => `<div class="lcd-back"><i class="lcd-sun"></i><b class="lcd-emb">BARRI<em>CARD</em></b></div>`;
function lcDetail(t) {
  if (!t) return `<p class="lc-none">${_t('Aucune carte.')}</p>`;
  return `<div class="lcd" data-t="${t}"><div class="lcd-float"><div class="lcd-flip"><div class="lcd-tilt"><div class="citem lcd-c">${cardFace(t, { base: 1 })}</div><i class="lc-glare"></i></div>${lcBack()}</div></div></div><div class="lcd-info">${lcInfo(t)}</div>`;
}

// liste affichée (filtres, tri, recherche) et pages : 9 cartes (3 × 3) sur téléphone, 10 (5 × 2) sur tablette ou téléphone tourné, 12 (4 × 3) sur ordinateur
const lcPer = () => (innerWidth >= 900 ? 12 : innerWidth >= 600 ? 10 : 9);
function lcBase() {
  const own = META.cards;
  const b = LC.deck
    ? own.slice()
    : Z.KEYS.filter(t => !CF.own || (CF.own === 'b' ? lcState(t) === 'buy' : (CF.own === 'y') === own.includes(t)));
  return cfPool(b, CF.fam).filter(t => !CF.rar || (Z.RAR[t] || 'com') === CF.rar);
}
function lcList() {
  const q = norm(CF.q.trim()),
    l = cfList(lcBase());
  return q ? l.filter(t => lcN(t).includes(q)) : l;
}
function lcCells() {
  const l = lcList(),
    per = lcPer(),
    np = Math.max(1, Math.ceil(l.length / per));
  CF.page = Math.min(Math.max(0, CF.page), np - 1);
  const pg = l.slice(CF.page * per, CF.page * per + per);
  let h;
  if (!pg.length) h = `<p class="lc-none">${_t('Aucune carte.')}</p>`;
  else if (LC.deck) {
    const d = META.decks[META.slot],
      cnt = deckCount(d);
    h = pg.map((t, i) => lcDkItem(t, i, d, cnt)).join('');
  } else h = pg.map((t, i) => lcItem(t, i)).join('');
  return { h, np, l };
}
const lcPgH = np =>
  `<button type="button" class="cpg" data-a="lcpg" data-v="-1" ${CF.page ? '' : 'disabled'} aria-label="${_t('Page précédente')}">${ii('back')}</button><span>${_t`Page ${CF.page + 1} / ${np}`}</span><button type="button" class="cpg" data-a="lcpg" data-v="1" ${CF.page < np - 1 ? '' : 'disabled'} aria-label="${_t('Page suivante')}">${ii('back', 'flip')}</button>`;
// panneau du deck : à droite sur ordinateur, tiroir sous la grille sur téléphone
function lcDeckSide() {
  const d = META.decks[META.slot],
    cnt = deckCount(d),
    err = Z.deckError(d, ownAll());
  const u = [...new Set(d)].sort((a, b) => Z.cost(a) - Z.cost(b) || Z.U[a].n.localeCompare(Z.U[b].n, 'fr'));
  return `<aside class="dkside${CF.drawer ? ' open' : ''}"><button type="button" class="dkhd" data-a="dkdraw" aria-expanded="${!!CF.drawer}"><span class="dkcount">${_t`Deck ${META.slot + 1}`} · <b>${d.length}</b> / ${Z.DECK_MAX}</span><span class="dkst${err ? ' bad' : ' good'}">${err || _t('Prêt.')}</span><i class="dkchev${CF.drawer ? ' open' : ''}"></i></button>
  <div class="dkbody"><div class="dklist">${u.length ? u.map(t => `<button type="button" class="dkrow r-${rar(t)}" data-a="dkm" data-v="${t}" title="${_t('Retirer')}"><span class="dkcost">${Z.cost(t)}</span><span class="dkname">${Z.U[t].n}</span><span class="dkart" style="background-image:url('${artUrl(Z.baseOf(t))}')"></span><b>×${cnt[t]}</b></button>`).join('') : _t('<p class="dkempty">Touche une carte du classeur pour l’ajouter.</p>')}</div>
  <div class="dkst2"><h4>${_t('Rôles du deck')}</h4><div class="dkroles">${[
    ['tank', 'Tank', '#c9bea6'],
    ['heal', _t('Soin'), '#6cc65a'],
    ['dps', 'DPS', '#e8392b'],
  ]
    .map(([k, n, c]) => {
      const v = d.filter(t => Z.roleOf(t) === k).length;
      return `<span class="${v ? '' : 'zero'}">${ink(k)}<b>${v}</b><small>${n}</small><em style="--w:${Math.min(100, v * 10)}%;--c:${c}"></em></span>`;
    })
    .join('')}</div>
  <div class="dkchips">${[
    ['com', '#8d8370', _t('Commune ×3')],
    ['rare', '#4fa3ff', _t('Rare ×2')],
    ['epic', '#b06bff', _t('Épique ×1')],
  ]
    .map(([r, c, n]) => `<span><i style="background:${c}"></i>${n}</span>`)
    .join('')}</div>
  ${(META.eds || []).length ? `<p class="dkrule">${_t`Cartes spéciales : 1 par carte, ${Z.ED_MAX} au maximum, comptées dans la limite de leur carte.`}</p>` : ''}</div>
  <button type="button" class="skip lc-reset" data-a="dkreset">${_t('Remettre le deck de départ')}</button></div></aside>`;
}
// un seul écran pour la collection et pour le deck (même filtres, même grille en pages)
function lcScreen(keep, deck) {
  LC.deck = !!deck;
  if (!keep) {
    cfOpen();
    LC.ov = 0;
  }
  const own = META.cards,
    eds = META.eds || [],
    pts = META.points;
  if (CF.fam === '*' && !eds.length) CF.fam = '';
  if (deck) CF.own = '';
  CF.sort = 'cat';
  const T = lcTypes();
  if (!T.some(x => x[0] === CF.role)) CF.role = '';
  const base = lcBase(),
    isOwn = t => own.includes(t) || eds.includes(t);
  const filters =
    T.map(([v, ic, n]) => {
      const p = base.filter(t => lcHit(t, v)),
        o = p.filter(isOwn).length;
      return `<button type="button" class="lc-f${CF.role === v ? ' on' : ''}" data-a="lcf" data-v="${v}" aria-pressed="${CF.role === v}">${ic}<span>${n}</span><i>${deck ? p.length : o + '/' + p.length}</i></button>`;
    }).join('') +
    (deck
      ? ''
      : `<button type="button" class="lc-f evo" data-a="evo">${ii('spark')}<span>${_t('Évolutions')}</span><i>${(META.evo || []).filter(k => Z.EVO[k]).length}/${Z.EVO_KEYS.length}</i></button>`);
  const o = (v, n) => `<option value="${v}">${n}</option>`;
  const sel = `<span class="lc-dd lc-type"><select data-f="role" aria-label="${_t('Type')}">${T.map(([v, , n]) => o(v, v ? n : _t('Type'))).join('')}</select></span>
  <span class="lc-dd"><select data-f="fam" aria-label="${_t('Faction')}">${o('', _t('Faction'))}${Object.keys(Z.FAM)
    .map(f => o(f, Z.FAM[f].n))
    .join('')}${o('-', _t('Sans faction'))}${eds.length ? o('*', _t('Spéciales')) : ''}</select></span>
  <span class="lc-dd"><select data-f="rar" aria-label="${_t('Rareté')}">${o('', _t('Rareté'))}${['com', 'rare', 'epic', 'leg'].map(r => o(r, GIFT_RN[r])).join('')}</select></span>
  ${deck ? '' : `<span class="lc-dd"><select data-f="own" aria-label="${_t('Débloquées')}">${o('', _t('État'))}${o('y', _t('Débloquées'))}${o('n', _t('À débloquer'))}${o('b', _t('À portée'))}</select></span>`}`;
  const L0 = lcList();
  if (!deck && (!LC.sel || !Z.U[LC.sel] || !L0.includes(LC.sel))) LC.sel = L0[0] || null;
  const nIn = Z.KEYS.filter(t => own.includes(t)).length,
    { h, np } = lcCells();
  const ls = panel.querySelector('.dklist'),
    lsY = ls ? ls.scrollTop : 0;
  show(
    `<h2 class="pw chead lc-h">${deck ? _t`Deck ${META.slot + 1}` : _t('Collection')}${deck ? '' : `<span class="cpts"><b>${pts}</b> ${_t('pts')}</span>`}</h2>
  <p class="lc-sub">${deck ? (matchMedia('(hover:hover)').matches ? _t('Clic gauche : ajouter. Clic droit : retirer.') : _t('Touche une carte pour l’ajouter, une ligne du deck pour la retirer.')) : _t`${nIn}/${Z.KEYS.length} débloquées`}</p>
  <div class="lcoll lcx${deck ? ' lcdeck' : ''}${LC.ov && !deck ? ' ov' : ''}">
   <aside class="lc-side"><div class="lc-filters" role="toolbar" aria-label="${_t('Rôle ou type')}">${filters}</div></aside>
   <section class="lc-mid">
    <div class="lc-bar"><label class="lc-search">${ii('binoc')}<input type="search" data-f="q" placeholder="${_t('Chercher une carte…')}" value="${CF.q.replace(/"/g, '&quot;')}" aria-label="${_t('Chercher une carte')}"></label><div class="lc-sel">${sel}</div></div>
    <div class="lc-grid">${h}</div>
   </section>
   <section class="lc-det" aria-live="polite">${deck ? lcDeckSide() : lcDetail(LC.sel) + lcX()}</section>
  </div>
  <div class="lc-ft"><button type="button" class="skip" data-a="${deck ? 'coll' : 'title'}">${deck ? _t('Collection') : _t('Accueil')}</button><div class="cpager lc-pg">${lcPgH(np)}</div><button type="button" class="go" data-a="new">${deck ? _t('Terminé') : _t('Préparer une partie')}</button></div>`,
    keep,
  );
  cfSync();
  LC.deal = 0;
  const ls2 = panel.querySelector('.dklist');
  if (ls2) ls2.scrollTop = lsY;
  if (LC.ov && !deck) lcOvPlace();
}
// change de page : les cartes partent en cascade, les nouvelles arrivent de l’autre côté
function lcFill(dir) {
  const g = panel.querySelector('.lc-grid'),
    pg = panel.querySelector('.lc-pg');
  if (!g) return;
  const { h, np } = lcCells();
  g.innerHTML = h;
  if (pg) pg.innerHTML = lcPgH(np);
  if (dir && AOK() && !OPT.eco)
    [...g.children].forEach((c, k) =>
      c.animate(
        [
          { transform: `translateX(${dir * 60}px) rotate(${dir * 6}deg)`, opacity: 0 },
          { transform: 'none', opacity: 1 },
        ],
        { duration: 300, delay: k * 25, easing: 'cubic-bezier(.2,.8,.3,1.2)', fill: 'backwards' },
      ),
    );
}
function lcPage(dir) {
  if (LC.turn) return;
  const np = Math.max(1, Math.ceil(lcList().length / lcPer())),
    to = CF.page + dir;
  const g = panel.querySelector('.lc-grid');
  if (to < 0 || to >= np) {
    if (g && AOK())
      g.animate([{ transform: 'none' }, { transform: `translateX(${-dir * 10}px)` }, { transform: 'none' }], {
        duration: 260,
        easing: 'ease-out',
      });
    return;
  }
  CF.page = to;
  try {
    SFX.play('page');
  } catch (e) {}
  if (!g || !AOK() || OPT.eco) {
    lcFill(0);
    return;
  }
  LC.turn = 1;
  const cs = [...g.children];
  cs.forEach((c, k) =>
    c.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: `translateX(${-dir * 50}px) rotate(${-dir * 6}deg)`, opacity: 0 },
      ],
      { duration: 200, delay: k * 18, easing: 'ease-in', fill: 'forwards' },
    ),
  );
  setTimeout(
    () => {
      LC.turn = 0;
      lcFill(dir);
    },
    200 + cs.length * 18,
  );
}
function lcSearch() {
  CF.page = 0;
  lcFill(0);
}

// la grande carte se retourne pour montrer la nouvelle (dos BARRICARD au milieu)
async function lcShow(t) {
  const box = panel.querySelector('.lc-det');
  if (!box) return;
  const fl = box.querySelector('.lcd-flip');
  if (!fl || !AOK() || !fl.animate || OPT.eco) {
    box.innerHTML = lcDetail(t);
    return;
  }
  if (LC.flip) {
    LC.next = t;
    return;
  }
  LC.flip = 1;
  try {
    SFX.play('page');
  } catch (e) {}
  try {
    await fl.animate([{ transform: 'rotateY(0) translateZ(0)' }, { transform: 'rotateY(180deg) translateZ(60px)' }], {
      duration: 280,
      easing: 'cubic-bezier(.55,0,.8,.3)',
      fill: 'forwards',
    }).finished;
    const lcd = box.querySelector('.lcd');
    if (lcd) lcd.dataset.t = t;
    const c = fl.querySelector('.lcd-c');
    if (c) {
      c.innerHTML = cardFace(t, { base: 1 });
      hdArt(c);
    }
    const inf = box.querySelector('.lcd-info');
    if (inf) inf.innerHTML = lcInfo(t);
    box.classList.remove('pop');
    void box.offsetWidth;
    box.classList.add('pop');
    await fl.animate(
      [{ transform: 'rotateY(180deg) translateZ(60px)' }, { transform: 'rotateY(360deg) translateZ(0)' }],
      { duration: 500, easing: 'cubic-bezier(.15,.9,.3,1.15)', fill: 'forwards' },
    ).finished;
    fl.getAnimations().forEach(a => a.cancel());
  } catch (e) {
    box.innerHTML = lcDetail(t);
  }
  LC.flip = 0;
  if (LC.next != null) {
    const n = LC.next;
    LC.next = null;
    if (n !== t) lcShow(n);
  }
}

const lcX = () =>
  `<button type="button" class="lc-x" data-a="lcclose" aria-label="${_t('Fermer')}"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
const lcPhone = () => matchMedia('(max-width:899px)').matches;
// téléphone : la grande carte s’ouvre par-dessus la grille, en grandissant depuis sa place
function lcOvPlace() {
  const d = panel.querySelector('.lcoll.ov .lc-det');
  if (!d) return;
  const op = d.offsetParent || panel,
    a = panel.getBoundingClientRect(),
    b = op.getBoundingClientRect();
  Object.assign(d.style, {
    top: a.top + panel.clientTop - b.top - op.clientTop + 'px',
    left: a.left + panel.clientLeft - b.left - op.clientLeft + 'px',
    width: panel.clientWidth + 'px',
    height: panel.clientHeight + 'px',
  });
}
function lcOvOpen(t, from) {
  const L = panel.querySelector('.lcoll');
  const d = L && L.querySelector('.lc-det');
  if (!d) return;
  d.innerHTML = lcDetail(t) + lcX();
  LC.ov = 1;
  L.classList.add('ov');
  lcOvPlace();
  lcGyro();
  const c = d.querySelector('.lcd');
  if (!from || !c || !AOK() || OPT.eco) return;
  const a = from.getBoundingClientRect(),
    b = c.getBoundingClientRect();
  if (!b.width) return;
  c.animate(
    [
      {
        transform: `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px,${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width})`,
      },
      { transform: 'none' },
    ],
    { duration: 420, easing: 'cubic-bezier(.2,.8,.25,1)' },
  );
  const inf = d.querySelector('.lcd-info');
  if (inf)
    inf.animate(
      [
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 300, delay: 220, easing: 'ease-out', fill: 'backwards' },
    );
}
function lcOvClose() {
  const L = panel.querySelector('.lcoll.ov');
  LC.ov = 0;
  if (!L) return;
  const d = L.querySelector('.lc-det'),
    c = d.querySelector('.lcd'),
    w = panel.querySelector(`.lc-w[data-t="${LC.sel}"] .lc`);
  const end = () => {
    L.classList.remove('ov');
  };
  if (!c || !w || !AOK() || OPT.eco) {
    end();
    return;
  }
  const a = w.getBoundingClientRect(),
    b = c.getBoundingClientRect();
  d.classList.add('closing');
  c.animate(
    [
      { transform: 'none' },
      {
        transform: `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px,${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width})`,
      },
    ],
    { duration: 300, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' },
  );
  setTimeout(() => {
    d.classList.remove('closing');
    end();
  }, 290);
}
// inclinaison du téléphone (gyroscope) : la grande carte suit, avec son reflet ; l’iPhone demande l’autorisation une fois
let lcG0 = null,
  lcGOn = false;
function lcOri(e) {
  const c = LC.ov && panel.querySelector('.lcoll.ov .lcd');
  if (!c || e.gamma == null || OPT.eco || reduce) return;
  if (!lcG0) lcG0 = { b: e.beta, g: e.gamma };
  const k = v => Math.max(-14, Math.min(14, v)),
    ry = k((e.gamma - lcG0.g) * 0.8),
    rx = k((lcG0.b - e.beta) * 0.7);
  c.classList.add('gyro');
  c.style.setProperty('--ry', ry.toFixed(1) + 'deg');
  c.style.setProperty('--rx', rx.toFixed(1) + 'deg');
  c.style.setProperty('--gx', (50 + ry * 3).toFixed(0) + '%');
  c.style.setProperty('--gy', (50 - rx * 3).toFixed(0) + '%');
}
function lcGyro() {
  lcG0 = null;
  if (lcGOn) return;
  const D = window.DeviceOrientationEvent;
  if (!D) return;
  lcGOn = true;
  try {
    if (typeof D.requestPermission === 'function')
      D.requestPermission()
        .then(r => {
          if (r === 'granted') addEventListener('deviceorientation', lcOri);
        })
        .catch(() => {});
    else addEventListener('deviceorientation', lcOri);
  } catch (e) {}
}
// carte refusée (deck) ou verrouillée : elle tremble, son badge clignote
function lcNo(c) {
  if (!c || !AOK()) return;
  c.animate(
    [
      { transform: 'none' },
      { transform: 'translateX(-6px) rotate(-2deg)' },
      { transform: 'translateX(6px) rotate(2deg)' },
      { transform: 'translateX(-4px)' },
      { transform: 'none' },
    ],
    { duration: 380 },
  );
  const b = c.querySelector('.lc-n,.cbadge.lk,.lc-pr');
  if (b) {
    b.classList.remove('lcbad');
    void b.offsetWidth;
    b.classList.add('lcbad');
  }
}

Object.assign(ACT, {
  lcsel: v => {
    if (!Z.U[v]) return;
    const el = panel.querySelector(`.lc-w[data-t="${v}"] .lc`);
    if (el && !el.classList.contains('s-in')) {
      const b = el.querySelector('.cbadge.lk,.lc-pr');
      if (b && AOK()) {
        b.classList.remove('lcshk');
        void b.offsetWidth;
        b.classList.add('lcshk');
      }
    }
    if (lcPhone()) {
      LC.sel = v;
      panel.querySelectorAll('.lc.on').forEach(e => e.classList.remove('on'));
      if (el) el.classList.add('on');
      try {
        SFX.play('page');
      } catch (e) {}
      lcOvOpen(v, el && el.querySelector('.lc-tilt'));
      return;
    }
    if (v !== LC.sel) {
      LC.sel = v;
      panel.querySelectorAll('.lc.on').forEach(e => e.classList.remove('on'));
      if (el) {
        el.classList.add('on');
        el.classList.remove('picked');
        void el.offsetWidth;
        el.classList.add('picked');
      }
      lcShow(v);
    }
  },
  lcclose: () => lcOvClose(),
  lcadd: v => {
    const d = META.decks[META.slot];
    if (!Z.U[v]) return;
    if (!deckCanAdd(d, v)) {
      lcNo(panel.querySelector(`.lc-w[data-t="${v}"] .lc`));
      try {
        SFX.play('no');
      } catch (e) {}
      vib(30);
      return;
    }
    ACT.dkp(v);
    if (META.decks[META.slot].length >= Z.DECK_MAX) {
      const g = panel.querySelector('.lc-ft .go');
      if (g && AOK()) {
        g.classList.remove('lcflash');
        void g.offsetWidth;
        g.classList.add('lcflash');
      }
    }
  },
  lcpg: v => lcPage(+v),
  lcf: v => {
    v = v || '';
    if (CF.role === v) return;
    CF.role = v;
    CF.page = 0;
    LC.deal = 1;
    try {
      SFX.play('ui');
    } catch (e) {}
    cfRe();
  },
});
// clavier : Entrée ou Espace sur une carte de la grille ; flèches gauche et droite pour changer de page
panel.addEventListener('keydown', e => {
  const c = e.target.closest && e.target.closest('.lc');
  if (c && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    ACT[c.dataset.a](c.dataset.v);
  } else if (
    panel.querySelector('.lcx') &&
    !e.target.closest('input,select') &&
    (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
  ) {
    e.preventDefault();
    lcPage(e.key === 'ArrowRight' ? 1 : -1);
  }
});
// changement de filtre : les cartes sont redistribuées
panel.addEventListener(
  'change',
  e => {
    if (panel.querySelector('.lcoll') && e.target.dataset && e.target.dataset.f && e.target.dataset.f !== 'q')
      LC.deal = 1;
  },
  true,
);
// glisser le doigt sur la grille pour changer de page
let lcSw = null,
  lcSwAt = 0;
panel.addEventListener('pointerdown', e => {
  lcSw = e.target.closest('.lcx .lc-grid') ? { x: e.clientX, y: e.clientY, t: Date.now() } : null;
});
panel.addEventListener('pointerup', e => {
  const w = lcSw;
  lcSw = null;
  if (!w) return;
  const dx = e.clientX - w.x,
    dy = e.clientY - w.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - w.t < 900) {
    lcSwAt = Date.now();
    lcPage(dx < 0 ? 1 : -1);
  }
});
panel.addEventListener(
  'click',
  e => {
    if (Date.now() - lcSwAt < 400 && e.target.closest('.lc-grid')) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true,
);
// téléphone : toucher à côté de la grande carte la ferme
panel.addEventListener('click', e => {
  if (LC.ov && e.target.closest('.lcoll.ov .lc-det') && !e.target.closest('.lcd,.lcd-info,button')) lcOvClose();
});
panel.addEventListener(
  'scroll',
  () => {
    if (LC.ov) lcOvPlace();
  },
  { passive: true },
);
// deck : clic gauche ajoute, clic droit retire un exemplaire
panel.addEventListener('contextmenu', e => {
  const c = e.target.closest('.lcdeck .lc[data-a=lcadd]');
  if (!c) return;
  e.preventDefault();
  if (META.decks[META.slot].includes(c.dataset.v)) ACT.dkm(c.dataset.v);
  else {
    lcNo(c);
    try {
      SFX.play('no');
    } catch (x) {}
  }
});

// inclinaison 3D et reflet qui suivent la souris
let lcHov = null;
function lcReset(c) {
  if (!c) return;
  c.classList.remove('hov');
  c.style.removeProperty('--rx');
  c.style.removeProperty('--ry');
}
panel.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse' || OPT.eco || reduce) return;
  const c = e.target.closest('.lc,.lcd');
  if (c !== lcHov) {
    lcReset(lcHov);
    lcHov = c;
  }
  if (!c) return;
  const r = c.getBoundingClientRect(),
    px = (e.clientX - r.left) / r.width,
    py = (e.clientY - r.top) / r.height,
    mx = c.classList.contains('lcd') ? 10 : 16;
  c.classList.add('hov');
  c.style.setProperty('--ry', `${((px - 0.5) * mx).toFixed(1)}deg`);
  c.style.setProperty('--rx', `${((0.5 - py) * mx).toFixed(1)}deg`);
  c.style.setProperty('--gx', `${(px * 100).toFixed(0)}%`);
  c.style.setProperty('--gy', `${(py * 100).toFixed(0)}%`);
});
panel.addEventListener('pointerleave', () => {
  lcReset(lcHov);
  lcHov = null;
});

const _collAx = collectionScreen,
  _dkAx = deckEditor;
collectionScreen = function (keep) {
  if (!ARTX()) return _collAx(keep);
  if (!keep) LC.deal = 1;
  try {
    lcScreen(keep);
  } catch (e) {
    console.error(e);
    _collAx(keep);
  }
};
deckEditor = function (keep) {
  if (!ARTX()) return _dkAx(keep);
  if (!keep) LC.deal = 1;
  try {
    lcScreen(keep, 1);
  } catch (e) {
    console.error(e);
    _dkAx(keep);
  }
};
