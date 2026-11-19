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
  const pend = lcPend(t),
    badge = pend
      ? `<span class="cbadge lk">${ii('lock')}</span>`
      : st === 'in'
        ? ''
        : st === 'vic'
          ? `<span class="cbadge vic">${ii('trophy')}</span>`
          : st === 'buy'
            ? `<span class="lc-pr">${ii('unlock')}${lcPrice(t)}</span>`
            : `<span class="cbadge lk">${ii('lock')}</span>`;
  return `<div class="lc-w${LC.deal ? ' deal' : ''}" data-t="${t}" style="--i:${Math.min(i, 24)};--dx:${((i % 3) - 1) * -50};--rot:${(i % 2 ? 1 : -1) * (6 + (i % 4) * 3)}">
  <div class="lc s-${st}${t === LC.sel ? ' on' : ''}${pend ? ' lc-pend' : ''}" data-a="lcsel" data-v="${t}" role="button" tabindex="0" aria-label="${Z.U[t].n}"><div class="lc-tilt">${cardFace(t, { base: 1 })}${lcShine(t)}<i class="lc-glare"></i></div>${badge}${cNew(t)}${sp ? `<span class="cspec" title="${_t('Carte spéciale obtenue')}"></span>` : ''}</div></div>`;
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
// verso de la grande carte : le dos d'Amine, le même que la pioche
const lcBack = () => `<div class="lcd-back"></div>`;
function lcDetail(t) {
  if (!t) return `<p class="lc-none">${_t('Aucune carte.')}</p>`;
  return `<div class="lcd" data-t="${t}"><div class="lcd-float"><div class="lcd-flip"><div class="lcd-tilt">${AOK() ? thickLayers() : ''}<div class="citem lcd-c">${cardFace(t, { base: 1 })}</div><i class="lc-glare"></i></div>${lcBack()}</div></div></div><div class="lcd-info">${lcInfo(t)}</div>`;
}

// liste affichée (filtres, tri, recherche) et pages : 9 cartes (3 × 3) sur téléphone, 10 (5 × 2) sur tablette ou téléphone tourné, 12 (4 × 3) sur ordinateur
// téléphone tourné (large mais peu haut, v257) : 5 × 2 pour des cartes plus grandes
const lcPer = () => (innerWidth >= 900 ? (innerHeight <= 560 ? 10 : 12) : innerWidth >= 600 ? 10 : 9);
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
    LC.brk = new Set(); // cartes nouvelles déjà révélées pendant cette visite
  }
  const dealt = LC.deal;
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
    `<h2 class="pw chead lc-h">${deck ? _t`Deck ${META.slot + 1}` : _t('Collection')}${deck ? '' : ptsBadge(pts)}</h2>
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
  lcBreakNew(dealt);
}
// change de page : les cartes partent en cascade, les nouvelles arrivent de l’autre côté
function lcFill(dir) {
  const g = panel.querySelector('.lc-grid'),
    pg = panel.querySelector('.lc-pg');
  if (!g) return;
  const { h, np } = lcCells();
  g.innerHTML = h;
  if (pg) pg.innerHTML = lcPgH(np);
  lcBreakNew(0);
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

/* ---------- déblocage d’une carte : la coque grise tremble, se fissure de lumière et vole en éclats (v268) ----------
   Joué quand on achète une carte, et à la première visite de la collection pour les cartes gagnées depuis (CNEW).
   Six étapes (ms) : réveil 0-450, tremblement 450-1500, secousses 1500-2050, souffle 2050-2300, éclat 2300-2550, révélation -3500.
   La carte en couleurs est déjà dessous : on pose par-dessus une copie grise découpée en six éclats le long des fissures. */
const LCB = { live: new Set(), parts: [], cv: null, cx: null, raf: 0, last: 0 };
const LCB_END = 3500,
  LCB_H = 1.66; // hauteur / largeur d’une carte, pour des fissures d’épaisseur régulière
const lcbClamp = x => (x < 0 ? 0 : x > 1 ? 1 : x);
const lcbEase = x => 1 - Math.pow(1 - lcbClamp(x), 3);
const lcbRnd = (a, b) => a + Math.random() * (b - a);
const lcbSfx = (n, gap) => {
  try {
    SFX.play(n, gap);
  } catch (e) {}
};
// une carte en attente de sa révélation (gagnée depuis la dernière visite) reste grise avec son cadenas
const lcPend = t => !LC.deck && CNEW.includes(t) && !(LC.brk && LC.brk.has(t));

// fissures (en % de la carte) : un tracé principal de haut en bas et six branches, un peu différents pour chaque carte
function lcbGeometry(seed) {
  let s = (seed * 9973 + 7) % 2147483647 || 1;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647,
    j = (v, a = 3) => v + (r() - 0.5) * 2 * a;
  const main = [
    [55, 0.5],
    [49, 17],
    [53, 29],
    [46, 42],
    [58, 52],
    [50, 63],
    [41, 72],
    [52, 82],
    [48, 99.5],
  ].map(([x, y], i) => (i === 0 || i === 8 ? [j(x, 4), y] : [j(x), j(y, 2)]));
  const lines = {
    main,
    b1: [main[3], [j(28), j(37)], [j(12), j(46)], [0.5, j(44, 2)]],
    b2: [main[4], [j(73), j(45)], [j(88), j(51)], [99.5, j(40, 2)]],
    b3: [main[6], [j(27), j(78)], [j(12), j(73)], [0.5, j(80, 2)]],
    b4: [main[7], [j(69), j(88)], [j(84), j(84)], [99.5, j(92, 2)]],
    b5: [main[1], [j(64), j(12)], [j(76), j(5)]],
    b6: [main[5], [j(64), j(66)], [j(72), j(62)]],
  };
  const { b1, b2, b3, b4 } = lines,
    edge = v => (v <= 1 ? 0 : v >= 99 ? 100 : v),
    rev = a => a.slice().reverse();
  // six éclats découpés le long des fissures
  const shards = [
    [[0, 0], ...main.slice(0, 4), ...b1.slice(1)],
    [...main.slice(0, 5), ...b2.slice(1), [100, 0]],
    [...rev(b1.slice(1)), ...main.slice(3, 7), ...b3.slice(1)],
    [...main.slice(4, 8), ...b4.slice(1), ...rev(b2.slice(1))],
    [...rev(b3.slice(1)), main[6], main[7], main[8], [0, 100]],
    [main[7], ...b4.slice(1), [100, 100], main[8]],
  ].map(p => p.map(([x, y]) => [edge(x), edge(y)]));
  return { lines, shards };
}

// particules sur une toile posée au-dessus de tout le temps de l’effet : étincelles, poussière, débris, braises, onde de choc
function lcbCanvas() {
  if (LCB.cv && LCB.cv.isConnected) return;
  const c = document.createElement('canvas');
  c.className = 'lcb-fx';
  c.setAttribute('aria-hidden', 'true');
  document.body.appendChild(c);
  LCB.cv = c;
  LCB.cx = c.getContext('2d');
  lcbResize();
}
function lcbResize() {
  if (!LCB.cv) return;
  const r = Math.min(2, devicePixelRatio || 1);
  LCB.cv.width = innerWidth * r;
  LCB.cv.height = innerHeight * r;
  LCB.cx.setTransform(r, 0, 0, r, 0, 0);
}
addEventListener('resize', lcbResize);
function lcbEmit(p) {
  if (LCB.parts.length < (OPT.eco ? 200 : 600)) LCB.parts.push(p);
}
function lcbDrawParticles(dt) {
  const cx = LCB.cx,
    s = dt / 1000;
  if (!cx) return;
  cx.clearRect(0, 0, innerWidth, innerHeight);
  LCB.parts = LCB.parts.filter(p => (p.age += dt) < p.life);
  for (const p of LCB.parts) {
    p.vy += (p.g || 0) * s;
    if (p.drag) {
      p.vx *= p.drag;
      p.vy *= p.drag;
    }
    p.x += p.vx * s;
    p.y += p.vy * s;
    const k = p.age / p.life;
    cx.save();
    if (p.type === 'spark') {
      cx.globalCompositeOperation = 'lighter';
      cx.strokeStyle = `rgba(255,${(200 + 55 * (1 - k)) | 0},${(120 * (1 - k)) | 0},${1 - k})`;
      cx.lineWidth = p.w;
      cx.lineCap = 'round';
      cx.beginPath();
      cx.moveTo(p.x, p.y);
      cx.lineTo(p.x - p.vx * 0.025, p.y - p.vy * 0.025);
      cx.stroke();
    } else if (p.type === 'ember') {
      cx.globalCompositeOperation = 'lighter';
      cx.fillStyle = `rgba(255,200,90,${Math.sin(k * Math.PI) * 0.9})`;
      cx.beginPath();
      cx.arc(p.x + Math.sin(p.age / 140 + p.ph) * 4, p.y, p.w * (1 - k * 0.5), 0, 7);
      cx.fill();
    } else if (p.type === 'dust') {
      cx.fillStyle = `rgba(150,140,128,${(1 - k) * 0.8})`;
      cx.fillRect(p.x, p.y, p.w, p.w);
    } else if (p.type === 'chip') {
      p.rot += p.vr * s;
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.fillStyle = `rgba(${p.c},${p.c},${p.c},${1 - k * k})`;
      cx.beginPath();
      cx.moveTo(-p.w, -p.w * 0.6);
      cx.lineTo(p.w, -p.w * 0.2);
      cx.lineTo(-p.w * 0.2, p.w);
      cx.closePath();
      cx.fill();
    } else if (p.type === 'ring') {
      const e = lcbEase(k);
      cx.globalCompositeOperation = 'lighter';
      cx.strokeStyle = `rgba(255,230,160,${(1 - k) * 0.8})`;
      cx.lineWidth = 6 * (1 - k) + 1;
      cx.beginPath();
      cx.ellipse(p.x, p.y, p.w * e, p.w * e * 0.75, 0, 0, 7);
      cx.stroke();
    }
    cx.restore();
  }
}

// boucle de l’effet : toutes les cartes en cours et les particules
function lcbFrame(now) {
  const dt = Math.min(100, now - LCB.last); // temps réel : l’effet garde sa durée même sur un appareil lent
  LCB.last = now;
  // seule la carte tremble (v270) : la collection ne bouge plus
  for (const b of [...LCB.live]) {
    try {
      b.update(dt);
    } catch (e) {
      b.finish();
    }
  }
  try {
    lcbDrawParticles(dt);
  } catch (e) {}
  if (LCB.live.size || LCB.parts.length) LCB.raf = requestAnimationFrame(lcbFrame);
  else {
    LCB.raf = 0;
    if (LCB.cv) LCB.cv.remove();
    LCB.cv = null;
  }
}
function lcbStart() {
  lcbCanvas();
  if (!LCB.raf) {
    LCB.last = performance.now();
    LCB.raf = requestAnimationFrame(lcbFrame);
  }
}

class LcBreak {
  constructor(el, t) {
    this.el = el;
    this.tilt = el.querySelector('.lc-tilt');
    this.geo = lcbGeometry(Z.KEYS.indexOf(t) + 3);
    this.t = 0;
    this.ph = 0;
    this.fired = {};
    this.screen = 0;
    this.prog = { main: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 };
    this.w = this.tilt.getBoundingClientRect().width || 100;
    this.u = this.w / 240; // 1 pour une grande carte de 240 px
    this.build();
  }
  build() {
    const cf = this.tilt.querySelector('.cf'),
      toD = pts => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${(y * LCB_H).toFixed(1)}`).join(' L'),
      grey = () => {
        const c = cf.cloneNode(true);
        c.removeAttribute('id');
        return c;
      };
    const fx = document.createElement('div');
    fx.className = 'lcb';
    fx.setAttribute('aria-hidden', 'true');
    const shell = document.createElement('div');
    shell.className = 'lcb-shell';
    shell.appendChild(grey());
    fx.appendChild(shell);
    this.shardEls = this.geo.shards.map(p => {
      const d = document.createElement('div');
      d.className = 'lcb-shard';
      d.style.clipPath = `polygon(${p.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(',')})`;
      const cx = p.reduce((a, q) => a + q[0], 0) / p.length,
        cy = p.reduce((a, q) => a + q[1], 0) / p.length;
      d.style.transformOrigin = `${cx}% ${cy}%`;
      d.dataset.cx = cx;
      d.dataset.cy = cy;
      d.appendChild(grey());
      fx.appendChild(d);
      return d;
    });
    const paths = Object.entries(this.geo.lines)
      .map(([id, pts]) =>
        ['g1', 'g2', 'c'].map(cl => `<path class="${cl}" data-l="${id}" pathLength="1" d="${toD(pts)}"/>`).join(''),
      )
      .join('');
    fx.insertAdjacentHTML(
      'beforeend',
      `<i class="lcb-leak"></i><svg class="lcb-cracks" viewBox="0 0 100 ${(100 * LCB_H).toFixed(1)}" preserveAspectRatio="none">${paths}</svg><i class="lcb-flash"></i><i class="lcb-shine"></i>`,
    );
    this.tilt.appendChild(fx);
    this.el.insertAdjacentHTML('afterbegin', '<i class="lcb-rays" aria-hidden="true"></i>');
    this.fx = fx;
    this.shell = shell;
    this.q = s => this.el.querySelector(s);
    this.leak = this.q('.lcb-leak');
    this.flash = this.q('.lcb-flash');
    this.shine = this.q('.lcb-shine');
    this.rays = this.q('.lcb-rays');
    this.svg = this.q('.lcb-cracks');
    this.paths = {};
    fx.querySelectorAll('.lcb-cracks path').forEach(p => (this.paths[p.dataset.l] ||= []).push(p));
    // longueurs cumulées des fissures, pour faire jaillir les étincelles le long de la partie déjà ouverte
    this.segs = {};
    for (const [id, pts] of Object.entries(this.geo.lines)) {
      let L = 0;
      const acc = [0];
      for (let i = 1; i < pts.length; i++) {
        L += Math.hypot(pts[i][0] - pts[i - 1][0], (pts[i][1] - pts[i - 1][1]) * LCB_H);
        acc.push(L);
      }
      this.segs[id] = { pts, acc, L };
    }
    // le cadenas de la carte (ou un nouveau, si la grille vient d’être redessinée sans lui)
    this.lock = this.el.querySelector('.cbadge.lk,.lc-pr');
    if (!this.lock) {
      this.el.insertAdjacentHTML('beforeend', `<span class="cbadge lk">${ii('lock')}</span>`);
      this.lock = this.el.querySelector('.cbadge.lk');
    }
    this.el.classList.add('lcb-on');
    this.el.classList.remove('lc-pend', 's-far', 's-buy', 's-full', 's-vic');
  }
  rect() {
    const r = this.tilt.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }
  once(key, at, fn) {
    if (!this.fired[key] && this.t >= at) {
      this.fired[key] = 1;
      fn();
    }
  }
  kick(at, power) {
    return this.t >= at ? power * Math.exp(-(this.t - at) / 75) : 0;
  }
  pointOnCracks() {
    const ids = Object.keys(this.prog).filter(k => this.prog[k] > 0.02);
    if (!ids.length) return null;
    const id = ids[(Math.random() * ids.length) | 0],
      s = this.segs[id],
      d = Math.random() * this.prog[id] * s.L;
    let i = 1;
    while (i < s.acc.length - 1 && s.acc[i] < d) i++;
    const k = (d - s.acc[i - 1]) / (s.acc[i] - s.acc[i - 1] || 1),
      a = s.pts[i - 1],
      b = s.pts[i];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  }
  sparks(n, speed) {
    const r = this.rect(),
      u = this.u;
    for (let i = 0; i < n; i++) {
      const p = this.pointOnCracks();
      if (!p) return;
      const a = lcbRnd(0, Math.PI * 2),
        v = lcbRnd(0.4, 1) * speed * u;
      lcbEmit({
        type: 'spark',
        x: r.x + (p[0] / 100) * r.w,
        y: r.y + (p[1] / 100) * r.h,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 60 * u,
        g: 600 * u,
        drag: 0.985,
        w: lcbRnd(1, 2.2) * Math.max(0.7, u),
        life: lcbRnd(250, 600),
        age: 0,
      });
    }
  }
  dust(n) {
    const r = this.rect();
    for (let i = 0; i < n; i++) {
      const bottom = Math.random() < 0.5;
      lcbEmit({
        type: 'dust',
        x: bottom ? r.x + lcbRnd(0, r.w) : r.x + (Math.random() < 0.5 ? 0 : r.w),
        y: bottom ? r.y + r.h * lcbRnd(0.85, 1) : r.y + lcbRnd(0.2, 1) * r.h,
        vx: lcbRnd(-20, 20),
        vy: lcbRnd(10, 60),
        g: 300,
        w: lcbRnd(1, 2.5) * Math.max(0.8, this.u),
        life: lcbRnd(400, 900),
        age: 0,
      });
    }
  }
  update(dt) {
    if (!this.el.isConnected) return this.finish();
    this.t += dt;
    const t = this.t,
      u = this.u;
    let amp = 0,
      f = 0.05,
      lift = 0,
      sc = 1;
    this.screen = 0;
    if (t < 450) {
      // 1. réveil : la carte se soulève
      const k = t / 450;
      lift = -8 * lcbEase(k);
      sc = 1 + 0.04 * lcbEase(k);
      amp = 0.6 * k;
    } else if (t < 1500) {
      // 2. tremblement qui monte, avec trois à-coups ; la première fissure s’ouvre
      const k = (t - 450) / 1050;
      lift = -8;
      sc = 1.04;
      f = 0.05 + 0.07 * k;
      amp = 0.8 + 5 * k * k + this.kick(780, 4) + this.kick(1080, 5) + this.kick(1320, 6);
      this.prog.main = lcbEase((t - 700) / 800);
      this.prog.b5 = lcbEase((t - 1100) / 260);
      this.prog.b6 = lcbEase((t - 1300) / 200);
      if (Math.random() < 0.25 + k * 0.6) this.dust(1 + ((k * 2) | 0));
      if (t > 720 && Math.random() < 0.15 + k * 0.5) this.sparks(1, 160);
    } else if (t < 2050) {
      // 3. deux grosses secousses : les fissures se ramifient, la collection tremble
      const k1 = this.kick(1550, 14),
        k2 = this.kick(1810, 18);
      lift = -9;
      sc = 1.05;
      f = 0.13;
      amp = 4 + k1 + k2;
      this.screen = k1 * 0.5 + k2 * 0.6;
      this.prog.main = this.prog.b5 = this.prog.b6 = 1;
      this.prog.b1 = lcbEase((t - 1550) / 120);
      this.prog.b2 = lcbEase((t - 1810) / 110);
      this.prog.b3 = lcbEase((t - 1850) / 130);
      if (Math.random() < 0.5) this.dust(2);
      if (Math.random() < 0.6) this.sparks(2, 220);
    } else if (t < 2300) {
      // 4. souffle retenu : la carte vibre très vite, la lumière déborde
      const k = (t - 2050) / 250;
      lift = -9 - 4 * lcbEase(k);
      sc = 1.05 + 0.07 * lcbEase(k);
      amp = 0.9;
      f = 0.32;
      this.prog.b1 = this.prog.b2 = this.prog.b3 = 1;
      this.prog.b4 = lcbEase((t - 2070) / 150);
      if (Math.random() < 0.8) this.sparks(2, 120);
    } else {
      // 5 et 6. éclatement puis rebond amorti
      const k = (t - 2300) / 1000;
      sc = 1 + 0.12 * Math.exp(-k * 5) * Math.cos(k * 16);
      lift = -13 * (1 - lcbEase((t - 2300) / 500));
      this.screen = 16 * Math.exp(-(t - 2300) / 120);
    }

    // tremblement : somme de sinus à fréquence croissante
    this.ph += dt * f;
    const p = this.ph,
      n1 = Math.sin(p) + 0.6 * Math.sin(p * 2.3 + 1.3) + 0.3 * Math.sin(p * 3.7 + 2.1),
      n2 = Math.sin(p * 1.2 + 0.7) + 0.6 * Math.sin(p * 2.9 + 2.2) + 0.3 * Math.sin(p * 4.1),
      n3 = Math.sin(p * 0.9 + 2.4) + 0.5 * Math.sin(p * 2.1),
      a = amp * Math.max(0.55, u);
    this.el.style.transform = `translate(${(n1 / 1.9) * a}px,${lift * Math.max(0.5, u) + (n2 / 1.9) * a * 0.6}px) rotate(${(n3 / 1.5) * amp * 0.55}deg) scale(${sc})`;

    // fissures : longueur ouverte et épaisseur (voulue en pixels, convertie en unités du dessin)
    const heat = lcbClamp((t - 700) / 1600),
      sw = (Math.max(0.6, u) * 100) / this.w,
      wd = [(3 + 5 * heat) * sw, (1.3 + 1.6 * heat) * sw, (0.8 + 0.7 * heat) * sw];
    for (const [id, ps] of Object.entries(this.paths))
      ps.forEach((q, i) => {
        q.style.strokeDashoffset = 1 - this.prog[id];
        q.style.strokeWidth = wd[i];
      });

    // lumière qui fuit des fissures, coque qui s’illumine
    const leak =
      t < 900
        ? 0
        : t < 1500
          ? 0.3 * lcbEase((t - 900) / 600)
          : t < 2050
            ? 0.3 + 0.25 * lcbEase((t - 1500) / 550)
            : t < 2300
              ? 0.55 + 0.4 * lcbEase((t - 2050) / 250)
              : 0;
    this.leak.style.opacity = leak;
    if (t < 2300)
      this.shell.style.filter = `grayscale(1) brightness(${0.45 + leak * 0.25}) drop-shadow(0 0 ${(leak * 16 * Math.max(0.6, u)).toFixed(1)}px rgba(255,190,70,${Math.min(1, leak * 1.3).toFixed(2)}))`;

    // le cadenas saute puis tombe
    this.once('lock', 1000, () => {
      this.lockFall = { x: 0, y: 0, vx: lcbRnd(-60, 30) * u, vy: -180 * u, r: 0, vr: lcbRnd(-500, -200) };
      lcbSfx('thud');
    });
    if (this.lockFall && this.lock) {
      const L = this.lockFall,
        s = dt / 1000;
      L.vy += 1500 * u * s;
      L.x += L.vx * s;
      L.y += L.vy * s;
      L.r += L.vr * s;
      this.lock.style.transform = `translate(${L.x}px,${L.y}px) rotate(${L.r}deg)`;
      this.lock.style.opacity = lcbClamp(1 - (t - 1000) / 700);
    }

    // sons
    this.once('rumble', 450, () => lcbSfx('rumble'));
    this.once('c0', 700, () => lcbSfx('crack', 0));
    this.once('c1', 1080, () => lcbSfx('thud', 0));
    this.once('c2', 1320, () => lcbSfx('crack', 0));
    this.once('k1', 1550, () => {
      lcbSfx('crack', 0);
      this.sparks(14, 300);
    });
    this.once('k2', 1810, () => {
      lcbSfx('crack', 0);
      this.sparks(18, 340);
    });
    this.once('burst', 2300, () => this.burst());
    this.once('chime', 2420, () => lcbSfx('rare'));

    if (t >= 2300) {
      const e = t - 2300,
        s = dt / 1000;
      this.flash.style.opacity = e < 60 ? e / 60 : lcbClamp(1 - (e - 60) / 380);
      this.svg.style.opacity = lcbClamp(1 - e / 120);
      this.shardEls.forEach((el, i) => {
        const d = this.shardPhys[i];
        d.vy += 1700 * u * s;
        d.x += d.vx * s;
        d.y += d.vy * s;
        d.r += d.vr * s;
        el.style.transform = `translate(${d.x}px,${d.y}px) rotate(${d.r}deg) scale(${1 + e / 2000})`;
        el.style.opacity = lcbClamp(1 - e / 650);
      });
      this.rays.style.opacity = e < 120 ? e / 120 : lcbClamp(1 - (e - 120) / 1000);
      this.rays.style.transform = `translate(-50%,-50%) rotate(${e * 0.03}deg) scale(${0.6 + 0.5 * lcbEase(e / 900)})`;
      const glow = lcbClamp(1 - e / 1100);
      this.tilt.style.filter = `drop-shadow(0 0 ${(18 * glow * Math.max(0.6, u)).toFixed(1)}px rgba(255,200,90,${glow.toFixed(2)})) brightness(${1 + 0.5 * lcbClamp(1 - e / 400)})`;
      const sh = lcbClamp((t - 2650) / 550);
      this.shine.style.opacity = sh > 0 && sh < 1 ? 1 : 0;
      this.shine.style.backgroundPosition = `${100 - sh * 100}% 0`;
      if (t < 3300 && Math.random() < 0.55) this.embers(1);
    }
    if (t >= LCB_END) this.finish();
  }
  // 5. la coque vole en éclats : flash, onde, étincelles, débris
  burst() {
    this.shell.style.visibility = 'hidden';
    const r = this.rect(),
      u = this.u,
      mx = r.x + r.w / 2,
      my = r.y + r.h / 2,
      few = OPT.eco ? 0.5 : 1;
    this.shardPhys = this.shardEls.map(el => {
      const dx = el.dataset.cx - 50,
        dy = (el.dataset.cy - 50) * LCB_H,
        L = Math.hypot(dx, dy) || 1,
        v = lcbRnd(260, 460) * u;
      el.style.visibility = 'visible';
      return { x: 0, y: 0, vx: (dx / L) * v, vy: (dy / L) * v * 0.7 - 260 * u, r: 0, vr: lcbRnd(-420, 420) };
    });
    for (let i = 0; i < Math.round(50 * Math.max(0.5, u) * few); i++) {
      const a = lcbRnd(0, Math.PI * 2),
        v = lcbRnd(200, 620) * u;
      lcbEmit({
        type: 'spark',
        x: mx + lcbRnd(-0.2, 0.2) * r.w,
        y: my + lcbRnd(-0.2, 0.2) * r.h,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 100 * u,
        g: 700 * u,
        drag: 0.98,
        w: lcbRnd(1.2, 2.6) * Math.max(0.7, u),
        life: lcbRnd(350, 800),
        age: 0,
      });
    }
    for (let i = 0; i < Math.round(26 * Math.max(0.5, u) * few); i++) {
      const a = lcbRnd(0, Math.PI * 2),
        v = lcbRnd(150, 480) * u;
      lcbEmit({
        type: 'chip',
        x: mx + lcbRnd(-0.4, 0.4) * r.w,
        y: my + lcbRnd(-0.4, 0.4) * r.h,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 220 * u,
        g: 1500 * u,
        drag: 0.99,
        w: lcbRnd(2, 6) * Math.max(0.6, u),
        c: lcbRnd(55, 120) | 0,
        rot: lcbRnd(0, 6),
        vr: lcbRnd(-12, 12),
        life: lcbRnd(500, 900),
        age: 0,
      });
    }
    lcbEmit({ type: 'ring', x: mx, y: my, vx: 0, vy: 0, w: r.w * 1.1, life: 450, age: 0 });
    lcbSfx('shatter', 0);
    vib(40);
  }
  embers(n) {
    const r = this.rect();
    for (let i = 0; i < n; i++)
      lcbEmit({
        type: 'ember',
        x: r.x + lcbRnd(0.05, 0.95) * r.w,
        y: r.y + lcbRnd(0.3, 1) * r.h,
        vx: 0,
        vy: lcbRnd(-70, -30) * this.u,
        g: 0,
        w: lcbRnd(1.2, 2.8) * Math.max(0.7, this.u),
        ph: lcbRnd(0, 6),
        life: lcbRnd(700, 1300),
        age: 0,
      });
  }
  finish() {
    LCB.live.delete(this);
    this.screen = 0;
    this.fx.remove();
    this.rays.remove();
    if (this.lock) this.lock.remove();
    this.el.style.transform = '';
    this.tilt.style.filter = '';
    this.el.classList.remove('lcb-on');
  }
}
// lance l’effet sur une carte de la grille (sans animation : elle reprend simplement ses couleurs)
function lcBreak(t) {
  const el = panel.querySelector(`.lc-w[data-t="${t}"] .lc`);
  if (!el || el.classList.contains('lcb-on')) return;
  if (!AOK() || !el.querySelector('.lc-tilt .cf')) {
    el.classList.remove('lc-pend');
    el.querySelector('.cbadge.lk')?.remove();
    lcbSfx('rare');
    return;
  }
  try {
    LCB.live.add(new LcBreak(el, t));
    lcbStart();
  } catch (e) {
    el.classList.remove('lc-pend');
  }
}
// cartes gagnées depuis la dernière visite et visibles sur la page : elles se révèlent l’une après l’autre
function lcBreakNew(dealt) {
  if (LC.deck) return;
  const due = [...panel.querySelectorAll('.lc.lc-pend')].map(e => e.dataset.v);
  due.forEach((t, k) =>
    setTimeout(
      () => {
        if (!lcPend(t)) return;
        LC.brk.add(t);
        lcBreak(t);
      },
      (dealt ? 900 : 250) + k * 700,
    ),
  );
}
// achat dans la collection : sur téléphone, la grande carte se referme d’abord vers sa place dans la grille
function lcBreakBuy(t) {
  (LC.brk ||= new Set()).add(t);
  const el = panel.querySelector(`.lc-w[data-t="${t}"] .lc`);
  if (el) el.classList.add('lc-pend');
  if (LC.ov) {
    lcOvClose();
    setTimeout(() => lcBreak(t), 330);
  } else lcBreak(t);
}

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
