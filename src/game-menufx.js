/* v302 : animations des menus (validées par Amine sur la maquette)
   1 fermeture en fondu (copie fantôme du panneau), 2 cascade plus longue, 3 boutons qui réagissent (vague, lueur),
   4 panneau qui grésille à l'ouverture, 5 onglet choisi qui glisse, 6 pause floutée, 7 succès (médaille, éclats, cadenas),
   8 barres qui se remplissent, 9 boutique (trop cher : secousse rouge ; achat : pièces vers la réserve).
   Chargé en tout dernier : enveloppe show, hide et showAch. Rien ne joue en Mode économie ou en « mouvement réduit ». */
const menuFxOff = () => reduce || DE.classList.contains('eco');

/* ---------- 1 : fermeture en fondu ---------- */
// hide() reste instantané (le jeu teste ov.hidden juste après) : c'est une copie du panneau qui s'efface
function closeGhost() {
  if (menuFxOff() || ov.hidden || panel.querySelectorAll('*').length > 1500) return;
  const ghost = ov.cloneNode(true),
    scroll = panel.scrollTop;
  ghost.removeAttribute('id');
  ghost.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
  ghost.classList.remove('oin');
  ghost.classList.add('mfx-ghost');
  ghost.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ghost);
  const p = ghost.querySelector('.panel');
  if (p) {
    p.classList.remove('pin');
    p.scrollTop = scroll;
  }
  setTimeout(() => ghost.remove(), 260);
}
{
  const hide0 = hide;
  hide = function () {
    try {
      closeGhost();
    } catch (e) {}
    return hide0.apply(this, arguments);
  };
}

/* ---------- 3 : vague au toucher et lueur qui suit la souris ---------- */
const FX_BTN = '.panel :is(.go, .skip, .tab, .shopi, button.char, .rchip), #ov .go';
function rippleAt(btn, x, y) {
  const r = btn.getBoundingClientRect(),
    size = Math.max(r.width, r.height),
    wave = document.createElement('span');
  wave.className = 'mfx-wave';
  wave.style.cssText = `width:${size}px;height:${size}px;left:${x - r.left - size / 2}px;top:${y - r.top - size / 2}px`;
  btn.classList.add('mfx-host');
  btn.appendChild(wave);
  setTimeout(() => {
    wave.remove();
    if (!btn.querySelector('.mfx-wave, .mfx-glow')) btn.classList.remove('mfx-host');
  }, 520);
}
document.addEventListener(
  'pointerdown',
  e => {
    if (menuFxOff()) return;
    try {
      const btn = e.target.closest && e.target.closest(FX_BTN);
      if (btn && !btn.disabled) rippleAt(btn, e.clientX, e.clientY);
      else refusePrice(e);
      rememberBuy(btn);
    } catch (err) {}
  },
  true,
);
if (matchMedia('(pointer: fine)').matches) {
  let glowBtn = null;
  const dropGlow = () => {
    if (!glowBtn) return;
    const g = glowBtn.querySelector('.mfx-glow');
    if (g) g.remove();
    if (!glowBtn.querySelector('.mfx-wave')) glowBtn.classList.remove('mfx-host');
    glowBtn = null;
  };
  document.addEventListener('pointermove', e => {
    try {
      const btn = !menuFxOff() && e.target.closest && e.target.closest(FX_BTN);
      if (btn !== glowBtn) dropGlow();
      if (!btn || btn.disabled) return;
      if (!glowBtn) {
        glowBtn = btn;
        btn.classList.add('mfx-host');
        const g = document.createElement('span');
        g.className = 'mfx-glow';
        btn.appendChild(g);
      }
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', e.clientX - r.left + 'px');
      btn.style.setProperty('--my', e.clientY - r.top + 'px');
    } catch (err) {}
  });
}

/* ---------- 4 : le panneau grésille comme un poste radio ---------- */
function radioCrackle() {
  const r = panel.getBoundingClientRect();
  if (r.width < 10) return;
  const scan = document.createElement('div');
  scan.className = 'mfx-scan';
  scan.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${Math.min(r.height, innerHeight)}px`;
  document.body.appendChild(scan);
  setTimeout(() => scan.remove(), 800);
  aAnim(
    panel,
    [
      { filter: 'brightness(1.5)' },
      { filter: 'brightness(.55)', offset: 0.15 },
      { filter: 'brightness(1.25)', offset: 0.3 },
      { filter: 'brightness(.8)', offset: 0.45 },
      { filter: 'none' },
    ],
    { duration: 420, easing: 'steps(6, end)' },
  );
}

/* ---------- 5 : l'onglet choisi glisse vers le nouveau ---------- */
const activeTabRects = () =>
  [...panel.querySelectorAll('.tabs')].map(t => t.querySelector('.tab.on')?.getBoundingClientRect());
function slideTabs(before) {
  [...panel.querySelectorAll('.tabs')].forEach((tabs, k) => {
    const on = tabs.querySelector('.tab.on'),
      from = before[k];
    if (!on || !from) return;
    const to = on.getBoundingClientRect();
    if (Math.abs(to.left - from.left) + Math.abs(to.top - from.top) < 2) return;
    const shine = document.createElement('div');
    shine.className = 'mfx-tabslide';
    shine.style.cssText = `left:${to.left}px;top:${to.top}px;width:${to.width}px;height:${to.height}px`;
    document.body.appendChild(shine);
    const a = aAnim(
      shine,
      [
        {
          transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width},1)`,
          opacity: 1,
        },
        { transform: 'none', opacity: 1, offset: 0.8 },
        { transform: 'none', opacity: 0 },
      ],
      { duration: 340, easing: 'cubic-bezier(.3,1.3,.5,1)' },
    );
    aDone(a, () => shine.remove());
    aAnim(on, [{ transform: 'scale(.9)' }, { transform: 'scale(1.06)', offset: 0.7 }, { transform: 'none' }], {
      duration: 320,
      delay: 120,
      easing: 'ease-out',
    });
  });
}

/* ---------- 8 : barres qui se remplissent ---------- */
function growBars() {
  [...panel.querySelectorAll('.bar > i, .achbar > i')].slice(0, 40).forEach((bar, k) => {
    const w = bar.style.width;
    if (!w || w === '0%') return;
    aAnim(bar, [{ width: '0%' }, { width: w }], {
      duration: 900,
      delay: 120 + Math.min(k, 12) * 70,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'backwards',
    });
    setTimeout(
      () => {
        bar.classList.add('mfx-sheen');
      },
      1000 + Math.min(k, 12) * 70,
    );
  });
}

/* ---------- 9 : boutique ---------- */
let buyFrom = null;
// trop cher : les boutons d'achat sont désactivés, on retrouve celui qui est sous le doigt
function refusePrice(e) {
  const btn = document
    .elementsFromPoint(e.clientX, e.clientY)
    .find(el => el.matches && el.matches('#panel :is(button.shopi, .citem button.buy):disabled'));
  if (!btn || btn.closest('.citem.locked')) return;
  const target = btn.querySelector('.cost') || btn;
  target.classList.remove('mfx-nope');
  void target.offsetWidth;
  target.classList.add('mfx-nope');
  setTimeout(() => target.classList.remove('mfx-nope'), 450);
  try {
    vib(20);
  } catch (err) {}
}
function rememberBuy(btn) {
  const a = btn && btn.dataset ? btn.dataset.a || '' : '';
  if (!/^shop-|^store-buy$/.test(a) || typeof G !== 'object' || !G) return;
  buyFrom = { rect: btn.getBoundingClientRect(), scrap: G.scrap, card: btn.dataset.v, at: Date.now() };
}
function buyFx() {
  if (!buyFrom || Date.now() - buyFrom.at > 3000 || !G) return;
  const from = buyFrom;
  buyFrom = null;
  if (G.scrap >= from.scrap) return;
  const wallet = [...panel.querySelectorAll('p b')].find(b => /ferraille|scrap/i.test(b.textContent));
  if (wallet) {
    coinsFx(from.rect, wallet.getBoundingClientRect(), 7);
    wallet.style.display = 'inline-block';
    aAnim(
      wallet,
      [{ transform: 'none' }, { transform: 'translateY(-5px) scale(1.18)', color: '#e8c27a' }, { transform: 'none' }],
      {
        duration: 420,
        delay: 460,
        easing: 'cubic-bezier(.3,1.8,.5,1)',
      },
    );
  }
  const bought = from.card && panel.querySelector(`.citem button.buy[data-v="${from.card}"]`);
  if (bought)
    aAnim(bought, [{ transform: 'none' }, { transform: 'translateY(-8px) scale(1.12)' }, { transform: 'none' }], {
      duration: 450,
      easing: 'cubic-bezier(.3,1.8,.5,1)',
    });
}

/* ---------- 7 : succès ---------- */
function sparksAround(el, n) {
  const r = el.getBoundingClientRect(),
    cx = r.left + r.width / 2,
    cy = r.top + r.height / 2;
  for (let k = 0; k < n; k++) {
    const s = document.createElement('span'),
      angle = (k / n) * Math.PI * 2,
      dist = 34 + Math.random() * 18;
    s.className = 'mfx-spark';
    s.style.cssText = `left:${cx}px;top:${cy}px`;
    document.body.appendChild(s);
    const a = aAnim(
      s,
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(.2)`,
          opacity: 0,
        },
      ],
      { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' },
    );
    aDone(a, () => s.remove());
  }
}
{
  const showAch0 = showAch;
  showAch = function () {
    const r = showAch0.apply(this, arguments);
    try {
      const icon = !menuFxOff() && achEl && !achEl.hidden && achEl.querySelector('.ach-ic');
      if (icon) {
        icon.classList.remove('mfx-medal');
        void icon.offsetWidth;
        icon.classList.add('mfx-medal');
        setTimeout(() => sparksAround(icon, 12), 480);
      }
    } catch (e) {}
    return r;
  };
}
// un succès verrouillé secoue son cadenas quand on le touche
document.addEventListener('click', e => {
  try {
    const locked = e.target.closest && e.target.closest('#panel .achi:not(.on)');
    const icon = locked && locked.querySelector('.ach-ic');
    if (!icon || menuFxOff()) return;
    icon.classList.remove('mfx-lock');
    void icon.offsetWidth;
    icon.classList.add('mfx-lock');
  } catch (err) {}
});

/* ---------- show : tout ce qui joue quand un écran s'affiche ---------- */
{
  const show0 = show;
  show = function (h, keep) {
    const opening = ov.hidden;
    const screenTitle = () => panel.querySelector('h2')?.textContent || '';
    let tabsBefore = [],
      titleBefore = '';
    try {
      if (!opening && !menuFxOff()) {
        tabsBefore = activeTabRects();
        titleBefore = screenTitle();
      }
    } catch (e) {}
    const r = show0.apply(this, arguments);
    try {
      // 6 : la pause floute le plateau derrière
      ov.classList.toggle('mfx-pause', typeof h === 'string' && h.includes('data-a="presume"'));
      if (menuFxOff()) return r;
      // même écran redessiné (clic sur un onglet) : pas de cascade, l'onglet glisse
      const sameScreen = !opening && titleBefore && titleBefore === screenTitle();
      if (sameScreen) {
        panel.classList.remove('pin');
        slideTabs(tabsBefore);
      } else if (!keep) {
        // 2 : chaque bloc du panneau arrive à son tour
        [...panel.children].forEach((c, k) => c.style.setProperty('--mi', Math.min(k, 12)));
        growBars();
      }
      if (opening && !onTitle) radioCrackle();
      buyFx();
    } catch (e) {}
    return r;
  };
}
