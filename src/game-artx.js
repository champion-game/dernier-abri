// v200 : refonte du jeu dans le style artiste (html.artx seulement) : plateau dessiné d'Amine comme sol,
// grande carte au survol (PC), « Nuit rouge dans N » sur l'étiquette du jour. Chargé en dernier.
const AX = { on: () => DE.classList.contains('artx'), plat: null };
// v263 : plateau d'Amine avec la forêt (plateau-foret.webp, 1254 × 1254 px) : ses 9 × 9 cases commencent à (248, 204) et mesurent 84,7 × 88,8 px ; calées sur les cases 1 à 9 du jeu
const AXIm = (w, h, cw, ch, x0, y0) => {
  const sx = T / cw,
    sy = T / ch;
  return { w, h, cw, ch, x0, y0, iw: w * sx, ih: h * sy, ox: T - x0 * sx, oy: T - y0 * sy };
};
const AXI = AXIm(1254, 1254, 84.7, 88.8, 248, 204);
// v263 : sur téléphone (portrait et paysage), le même plateau resserré sur la grille (plateau-herbe.webp, 890 × 931 px, cases de 84,7 × 88,8 px à partir de (64, 66)) :
// les cases sont bien plus grandes ; on ne voit plus les zombies arriver de loin (html.axpal)
const axPalWant = () =>
  AX.on() && !DE.classList.contains('felton') && (ART_NEW.ui || []).includes('plateau-herbe.webp');
function axPalSet() {
  const on = axPalWant();
  if (on === DE.classList.contains('axpal')) return false;
  DE.classList.toggle('axpal', on);
  Object.assign(AXI, on ? AXIm(890, 931, 84.7, 88.8, 64, 66) : AXIm(1254, 1254, 84.7, 88.8, 248, 204));
  AX.plat = null;
  return true;
}
// sol du plateau : l'image d'Amine (9 × 9 cases + palissade) posée sur les 11 × 11 cases du jeu (la palissade couvre l'anneau de la forêt)
{
  const g0 = buildGround;
  buildGround = function (B) {
    g0.apply(this, arguments);
    try {
      if (!AX.on() || !AX.plat) return;
      const g = ground.getContext('2d'),
        k = ground.width / L;
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, ground.width, ground.height);
      g.drawImage(AX.plat, AXI.ox * k, AXI.oy * k, AXI.iw * k, AXI.ih * k);
      g.restore();
    } catch (e) {}
  };
}
function axGround() {
  try {
    setBiome.done = 0;
    setBiome(BIOME);
  } catch (e) {}
}
function axPlat() {
  const u = ART_NEW.ui || [];
  if (AX.plat || !u.includes('plateau.webp')) return axGround();
  const f = DE.classList.contains('axpal')
      ? 'plateau-herbe.webp'
      : u.includes('plateau-foret.webp')
        ? 'plateau-foret.webp'
        : 'plateau.webp',
    im = new Image();
  AX.want = f;
  im.onload = () => {
    if (AX.want !== f) return;
    AX.plat = im;
    axGround();
  };
  im.src = 'assets/art/ui/' + f;
}
{
  const a0 = applyArt;
  applyArt = function () {
    a0.apply(this, arguments);
    try {
      feltLayout();
      if (AX.on()) axPlat();
      else axGround();
    } catch (e) {}
  };
}
// la liste des images peut arriver avant le chargement de ce fichier : on refait la disposition ici
try {
  feltLayout();
} catch (e) {}
if (AX.on()) axPlat();
// étiquette du jour : nombre de jours avant la prochaine nuit rouge (lu sur la piste des nuits)
{
  const r0 = render;
  render = function () {
    r0.apply(this, arguments);
    try {
      const r = $('#round');
      if (!AX.on() || !r || !G || S.busy || G.oneNight) return;
      const cs = [...document.querySelectorAll('#horde .tc')],
        i = cs.findIndex(c => c.classList.contains('now')),
        j = cs.findIndex((c, k) => k > i && c.classList.contains('red'));
      if (i >= 0 && j > i && !r.querySelector('.axn')) {
        const n = j - i;
        r.insertAdjacentHTML(
          'beforeend',
          `<small class="axn">${n === 1 ? _t('Nuit rouge demain') : _t`Nuit rouge dans ${n}`}</small>`,
        );
      }
    } catch (e) {}
  };
}
// PC : en haut du panneau de droite, la carte survolée en grand, sinon la carte choisie (la main est en bas du panneau)
let axHov = null;
function axBig() {
  try {
    let big = $('#axBig');
    const on = AX.on() && DE.classList.contains('felton') && G && S.hand;
    if (!on) {
      if (big) big.hidden = true;
      return;
    }
    if (!big) {
      big = document.createElement('div');
      big.id = 'axBig';
      big.className = 'axbig';
      big.setAttribute('aria-hidden', 'true');
      const i = $('#info');
      i.parentNode.insertBefore(big, i);
    }
    const k =
      axHov != null && S.hand[axHov] != null
        ? axHov
        : S.sel != null && S.sel >= 0 && S.hand[S.sel] != null
          ? S.sel
          : null;
    if (k == null) {
      DE.classList.remove('axhov');
      big.hidden = true;
      big._t = null;
      return;
    }
    DE.classList.toggle('axhov', axHov != null);
    const t = S.hand[k];
    if (big._t !== t) {
      big.innerHTML = cardFace(t);
      hdArt(big);
      big._t = t;
    }
    big.hidden = false;
  } catch (e) {}
}
{
  const h = $('#hand');
  if (h) {
    h.addEventListener('mouseover', e => {
      const c = e.target.closest('.card');
      if (c && matchMedia('(hover:hover)').matches) {
        axHov = +c.dataset.k;
        axBig();
      }
    });
    h.addEventListener('mouseleave', () => {
      axHov = null;
      axBig();
    });
  }
}
{
  const r2 = render;
  render = function () {
    r2.apply(this, arguments);
    axBig();
  };
}
// v202 : fonds et logo d'Amine. L'accueil prend toujours le même fond (pas de tirage parmi les anciens fonds) et le nouveau logo ;
// ses lueurs suivent ce décor : feu de camp qui vacille, lanternes, soleil couchant qui pulse (les braises et la brume restent celles de v174).
const AXG = {
  l: { w: 1672, h: 941, fire: [[25.3, 73.5, 6]], lamp: [[5.9, 18.5, 2.4]], sun: [77.2, 39.3, 5] },
  p: {
    w: 941,
    h: 1672,
    fire: [],
    lamp: [
      [1.9, 35.3, 2.2],
      [7.6, 35.9, 2.2],
      [13.2, 70.1, 3.2],
    ],
    sun: [75.2, 39.2, 7],
  },
};
const AXH = {};
// v245 : accueil sur le modèle d'Amine (plateau sur la table, menu à gauche sur PC, sous le plateau en hauteur).
// Lueurs de ce décor : flamme de la lanterne qui vacille, étoiles qui scintillent, brume devant la forêt, lucioles au-dessus du plateau.
// Positions en % de l'image (accueil.webp 1672 × 941, accueil-portrait.webp 941 × 1672).
const AXG2 = {
  l: {
    w: 1672,
    h: 941,
    fire: [],
    lamp: [[90.3, 19.2, 5.5]],
    mist: [12.5, 15.5],
    stars: [
      [6, 3],
      [14, 7],
      [23, 2.5],
      [31, 6],
      [39, 3.5],
      [47, 8],
      [55, 2],
      [62, 5.5],
      [70, 3],
      [78, 7.5],
      [86, 2.5],
      [95, 5],
      [18, 11],
      [51, 12],
      [74, 10.5],
    ],
    flies: [
      [45, 30],
      [58, 26],
      [72, 34],
      [52, 52],
      [83, 46],
      [64, 60],
      [40, 44],
    ],
  },
  p: {
    w: 941,
    h: 1672,
    fire: [],
    lamp: [[85.6, 28.8, 11]],
    mist: [22.5, 26],
    stars: [
      [5, 3],
      [16, 9],
      [27, 2],
      [38, 15],
      [50, 1.5],
      [62, 16],
      [73, 2.5],
      [84, 8],
      [94, 3.5],
      [10, 18],
      [90, 17],
      [46, 19],
    ],
    flies: [
      [20, 36],
      [42, 32],
      [66, 35],
      [30, 48],
      [55, 50],
      [78, 44],
    ],
  },
};
// l'accueil et les menus ouverts depuis l'accueil (v246) ont ce décor, dans le calque #axbg (fixe depuis la v260 : il ne suit plus la souris)
const axNewHome = () => AX.on() && !!$('#ov.home');
function axGlow() {
  try {
    const ov = $('#ov');
    let g = $('#axglow');
    if (!ov) return;
    if (!AX.on()) {
      if (g) g.remove();
      const bg0 = $('#axbg');
      if (bg0) bg0.remove();
      ['fond', 'fond-portrait2'].forEach(k => {
        if (AXH[k]) {
          HGLOW[k] = AXH[k];
          delete AXH[k];
        }
      });
      return;
    }
    ['fond', 'fond-portrait2'].forEach(k => {
      if (HGLOW[k]) {
        AXH[k] = HGLOW[k];
        delete HGLOW[k];
      }
    });
    const og = $('#hglow');
    if (og) og.remove();
    const nw = axNewHome(),
      por = matchMedia('(max-aspect-ratio:3/4)').matches,
      d = nw ? (por ? AXG2.p : AXG2.l) : por ? AXG.p : AXG.l,
      k = (nw ? 'n' : '') + (por ? 'p' : 'l');
    let bg = $('#axbg');
    if (nw && !bg) {
      bg = document.createElement('div');
      bg.id = 'axbg';
      bg.setAttribute('aria-hidden', 'true');
      ov.insertBefore(bg, ov.firstChild);
    }
    const host = nw ? bg : ov;
    if (!g || g.dataset.k !== k || g.parentNode !== host) {
      if (g) g.remove();
      g = document.createElement('div');
      g.id = 'axglow';
      g.dataset.k = k;
      g.setAttribute('aria-hidden', 'true');
      g.innerHTML = axGlowHtml(d);
      host.insertBefore(g, host.firstChild);
    }
    const W = host.clientWidth,
      H = host.clientHeight,
      sc = nw && por ? W / d.w : Math.max(W / d.w, H / d.h),
      w = d.w * sc,
      hh = d.h * sc;
    g.style.cssText = `width:${w}px;height:${hh}px;left:${(W - w) / 2}px;top:${por ? 0 : (H - hh) * 0.6}px;--w:${w / 100}px`;
  } catch (e) {}
}
// les lueurs d'un décor (soleil, feux, lanternes, et pour l'accueil v245 : brume, étoiles, lucioles)
function axGlowHtml(d) {
  let h = d.sun ? `<i class="ax-sun" style="left:${d.sun[0]}%;top:${d.sun[1]}%;--r:${d.sun[2]}"></i>` : '';
  (d.stars || []).forEach((s, i) => {
    h += `<i class="ax-star" style="left:${s[0]}%;top:${s[1]}%;animation-delay:-${(i * 1.37) % 5}s;animation-duration:${2.4 + ((i * 0.73) % 2.6)}s"></i>`;
  });
  if (d.mist)
    d.mist.forEach((y, i) => {
      h += `<i class="ax-mist" style="top:${y}%;animation-duration:${38 + i * 17}s;animation-delay:-${i * 9}s"></i>`;
    });
  d.fire.forEach((f, i) => {
    h += `<i class="ax-fire" style="left:${f[0]}%;top:${f[1]}%;--r:${f[2]};animation-delay:-${i * 0.41}s"></i>`;
  });
  d.lamp.forEach((f, i) => {
    h += `<i class="ax-lamp${d.flies ? ' ax-lamp2' : ''}" style="left:${f[0]}%;top:${f[1]}%;--r:${f[2]};animation-delay:-${i * 0.53}s;animation-duration:${1.7 + i * 0.37}s"></i>`;
  });
  (d.flies || []).forEach((f, i) => {
    h += `<i class="ax-fly" style="left:${f[0]}%;top:${f[1]}%;--dx:${((i * 37) % 7) - 3}vw;--dy:${((i * 53) % 5) - 2.5}vw;animation-delay:-${(i * 1.9) % 9}s;animation-duration:${7 + ((i * 1.3) % 5)}s"></i>`;
  });
  return h;
}
{
  const h0 = hglowFit;
  hglowFit = function () {
    if (!AX.on()) h0.apply(this, arguments);
    axGlow();
  };
}
addEventListener('resize', axGlow);
// logo : la constante LOGO est fixée avant l'arrivée de la liste des images de l'artiste
{
  const t0 = title;
  title = function () {
    if (AX.on() && typeof FOND_F !== 'undefined' && FOND_F !== 'fond.webp') {
      FOND_F = 'fond.webp';
      try {
        DE.style.setProperty('--fond', `url("${new URL(uiUrl(FOND_F), document.baseURI).href}")`);
      } catch (e) {}
    }
    const r = t0.apply(this, arguments);
    try {
      if (AX.on())
        document.querySelectorAll('#panel .logo img').forEach(i => {
          i.src = uiUrl('barricard.webp');
        });
      axGlow();
    } catch (e) {}
    return r;
  };
}
function axHome() {
  try {
    if (AX.on() && typeof FOND_F !== 'undefined') {
      FOND_F = 'fond.webp';
      DE.style.setProperty('--fond', `url("${new URL(uiUrl(FOND_F), document.baseURI).href}")`);
    }
    if (AX.on())
      document.querySelectorAll('#panel .logo img').forEach(i => {
        i.src = uiUrl('barricard.webp');
      });
    axGlow();
  } catch (e) {}
}
{
  const a1 = applyArt;
  applyArt = function () {
    a1.apply(this, arguments);
    axHome();
  };
}
axHome();
// v204 : PC — nombre de cartes de la main, pour l'éventail
{
  const r3 = render;
  render = function () {
    r3.apply(this, arguments);
    try {
      const h = $('#hand');
      if (h) h.style.setProperty('--hn', Math.max(1, h.querySelectorAll('.card').length));
    } catch (e) {}
  };
}
// v205 : PC — l'image du plateau entière (palissade, miradors) derrière le canvas, calée sur ses cases ;
// le panneau de gauche commence à la hauteur du panneau « Abri » (symétrie)
// v211 : le canvas du jeu déborde jusqu'au cadre (PADU, game-draw.js) : nuit, lumières et aube calculées d'un seul bloc, plus de coupure ;
// getBoundingClientRect du canvas renvoie toujours les 11 × 11 cases, pour que clics et animations restent justes
const AXPAD = 0,
  AXGB = Element.prototype.getBoundingClientRect;
cv.getBoundingClientRect = function () {
  const r = AXGB.call(this);
  if (!PADU) return r;
  const f = PADU / (L + 2 * PADU);
  return new DOMRect(r.left + r.width * f, r.top + r.height * f, r.width * (1 - 2 * f), r.height * (1 - 2 * f));
};
function axPad(v) {
  if (PADU === v) return;
  PADU = v;
  if (v) DE.style.setProperty('--axp', v / L);
  else DE.style.removeProperty('--axp');
  try {
    fit();
  } catch (e) {}
}
function axLay() {
  try {
    const on = AX.on() && DE.classList.contains('felton') && AX.plat && !ax3Want(),
      c = $('#map');
    let d = $('#axPlat');
    axPad(on ? AXPAD : 0);
    if (!on || !c) {
      if (c) c.style.clipPath = '';
      {
        const f = $('#axFrame');
        if (f) f.hidden = true;
      }
      if (d) d.hidden = true;
      {
        const fx = $('#axFx');
        if (fx) fx.hidden = true;
      }
      DE.style.removeProperty('--axlt');
      return;
    }
    if (!d) {
      d = document.createElement('div');
      d.id = 'axPlat';
      d.setAttribute('aria-hidden', 'true');
      c.parentNode.insertBefore(d, c);
    }
    const a = c.parentNode.getBoundingClientRect(),
      r = c.getBoundingClientRect(),
      k = r.width / L;
    d.style.cssText = `left:${r.left - a.left + AXI.ox * k}px;top:${r.top - a.top + AXI.oy * k}px;width:${AXI.iw * k}px;height:${AXI.ih * k}px`;
    d.hidden = false;
    if (!d.firstChild) {
      d.innerHTML = '<i id="axNight"></i>';
    }
    let fx = $('#axFx');
    if (!fx) {
      fx = document.createElement('canvas');
      fx.id = 'axFx';
      fx.setAttribute('aria-hidden', 'true');
      c.parentNode.appendChild(fx);
    }
    {
      const w = r.width * AXM;
      fx.style.left = r.left - a.left - w + 'px';
      fx.style.top = r.top - a.top - w + 'px';
      fx.style.width = fx.style.height = r.width + 2 * w + 'px';
      fx.hidden = false;
    }
    d._ox = -AXI.ox * k;
    d._cw = r.width;

    // cadre en acier : l'image, le canvas et la brume sont coupés net sur son bord
    {
      const W = d.offsetWidth,
        H = d.offsetHeight,
        R = [d.offsetLeft + W * 0.01, d.offsetTop + H * 0.01, W * 0.98, H * 0.98];
      let f = $('#axFrame');
      if (!f) {
        f = document.createElement('div');
        f.id = 'axFrame';
        f.setAttribute('aria-hidden', 'true');
        c.parentNode.appendChild(f);
      }
      f.style.cssText = `left:${R[0]}px;top:${R[1]}px;width:${R[2]}px;height:${R[3]}px`;
      f.hidden = false;
      d.style.clipPath = '';
      const cr = AXGB.call(c),
        cl = cr.left - a.left,
        ct = cr.top - a.top;
      c.style.clipPath = `inset(${R[1] - ct}px ${cl + cr.width - R[0] - R[2]}px ${ct + cr.height - R[1] - R[3]}px ${R[0] - cl}px)`;
      fx.style.clipPath = `inset(${R[1] - fx.offsetTop}px ${fx.offsetLeft + fx.offsetWidth - R[0] - R[2]}px ${fx.offsetTop + fx.offsetHeight - R[1] - R[3]}px ${R[0] - fx.offsetLeft}px)`;
    }
    const sh = document.querySelector('.top .shel');
    if (sh) DE.style.setProperty('--axlt', Math.max(0, sh.getBoundingClientRect().top - a.top - 6) + 'px');
  } catch (e) {}
}
{
  const r4 = render;
  render = function () {
    r4.apply(this, arguments);
    axLay();
  };
}
addEventListener('resize', () => setTimeout(axLay, 50));
// v206 : voile de nuit de la palissade, calqué sur drawDark (game-draw.js) : même couleur, même intensité (nightAmt), même aube
{
  let last = '';
  const loop = () => {
    try {
      const d = $('#axPlat'),
        n = $('#axNight');
      if (d && n && !d.hidden) {
        let bg = 'none';
        const dq = (performance.now() - dawnT) / DAWN,
          dawn = dq >= 0 && dq < 1 && nightTarget === 0;
        if (dawn) {
          const fx = 1 - dq * 1.35,
            ox = d._ox || 0,
            cw = d._cw || 1,
            W = d.offsetWidth || 1,
            st = [];
          for (let k = 0; k <= 12; k++) {
            const x = (k / 12) * W,
              s = (x - ox) / cw;
            st.push(
              `rgba(4,7,18,${(0.8 * Math.min(1, Math.max(0, (fx + 0.3 - s) / 0.3))).toFixed(3)}) ${x.toFixed(0)}px`,
            );
          }
          bg = `linear-gradient(90deg,${st.join(',')})`;
        } else if (nightAmt >= 0.01) bg = `rgba(4,7,18,${(0.8 * nightAmt).toFixed(3)})`;
        if (bg !== last) {
          n.style.background = bg;
          last = bg;
        }
        axFxDraw();
      }
    } catch (e) {}
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
// v208 : nuit (PC) — les effets de brume de la v195 (nappes du bord : ringFog ; bandes qui dérivent : drawFog) sont dessinés sur #axFx,
// un canvas qui déborde du plateau (AXM de chaque côté) : mêmes formules, même rythme, mais ils continuent sur la palissade, donc plus de bord visible
const AXM = 0.13;
let AXRF = null;
function axOn() {
  return AX.on() && DE.classList.contains('felton') && AX.plat && !ax3Want();
}
{
  const rf = ringFog;
  AX.rf = rf;
  let E = null;
  ringFog = function () {
    if (axOn() || DE.classList.contains('ax3')) {
      if (!E) {
        E = document.createElement('canvas');
        E.width = E.height = 2;
      }
      return E;
    }
    return rf.apply(this, arguments);
  };
}
{
  const df = drawFog;
  drawFog = function () {
    if (axOn()) return;
    return df.apply(this, arguments);
  };
}
function axRing() {
  if (AXRF) return AXRF;
  const W = L * (1 + 2 * AXM),
    o = L * AXM,
    c = document.createElement('canvas');
  c.width = c.height = Math.round(W / 2);
  const g = c.getContext('2d'),
    r = rng(31);
  g.scale(0.5, 0.5);
  for (let k = 0; k < 150; k++) {
    let x = o + r() * L,
      y = o + r() * L;
    const s = Math.floor(r() * 4),
      d = -T * 0.9 + r() * T * 2.1;
    if (s === 0) y = o + d;
    else if (s === 1) y = o + L - d;
    else if (s === 2) x = o + d;
    else x = o + L - d;
    const rr = 18 + r() * 24,
      gr = g.createRadialGradient(x, y, 0, x, y, rr);
    gr.addColorStop(0, 'rgba(170,190,215,.3)');
    gr.addColorStop(1, 'rgba(170,190,215,0)');
    g.fillStyle = gr;
    g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  return (AXRF = c);
}
function axFxDraw() {
  const fx = $('#axFx');
  if (!fx || fx.hidden) return;
  const px = Math.round(fx.offsetWidth * Math.min(OPT.eco ? 1 : 2, devicePixelRatio || 1));
  if (fx.width !== px) {
    fx.width = fx.height = px;
  }
  const g = fx.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, px, px);
  const dq0 = (performance.now() - dawnT) / DAWN;
  if (nightAmt < 0.03 && !(dq0 >= 0 && dq0 < 1)) return;
  const W = L * (1 + 2 * AXM),
    k = px / W,
    o = L * AXM,
    now = performance.now();
  g.setTransform(k, 0, 0, k, o * k, o * k);
  // bandes de brume (drawFog) : sous le voile de la nuit dans la v195, donc atténuées comme lui
  if (typeof FOG !== 'undefined' && FOG) {
    const n = OPT.eco ? 3 : 6;
    for (let j = 0; j < n; j++) {
      const w = L * 0.75,
        sp = reduce ? 0 : 0.006 + j * 0.0017,
        x = ((j * W * 0.37 + now * sp) % (W + w)) - w / 2 - o,
        y = L * (0.12 + j * 0.15) + Math.sin(now / 5000 + j) * 12;
      g.globalAlpha = 0.07 * nightAmt * (1 - 0.8 * nightAmt);
      g.drawImage(FOG, x - w / 2, y - w * 0.16, w, w * 0.32);
    }
  }
  if (!PADU) {
    // clair de lune (drawGlow) et soleil de l'aube (drawDark) : le canvas les dessine sur les cases, on les prolonge autour (même dégradé, hors des cases)
    g.save();
    g.beginPath();
    g.rect(-o, -o, W, W);
    g.rect(L, 0, -L, L);
    g.clip('evenodd');
    if (!AX.moon) {
      AX.moon = g.createRadialGradient(L * 0.92, L * 0.05, 0, L * 0.92, L * 0.05, L * 0.95);
      AX.moon.addColorStop(0, 'rgba(110,140,210,.2)');
      AX.moon.addColorStop(1, 'rgba(110,140,210,0)');
    }
    g.globalAlpha = nightAmt;
    g.fillStyle = AX.moon;
    g.fillRect(-o, -o, W, W);
    g.globalAlpha = 1;
    const dq = (now - dawnT) / DAWN;
    if (dq >= 0 && dq < 1 && nightTarget === 0) {
      const sx = L + T * 0.4,
        sy = L * (0.85 - 0.5 * dq),
        R = L * 0.95,
        a = 0.5 * Math.sin(dq * Math.PI),
        sg = g.createRadialGradient(sx, sy, 0, sx, sy, R);
      sg.addColorStop(0, `rgba(255,214,140,${a})`);
      sg.addColorStop(0.35, `rgba(255,150,70,${a * 0.5})`);
      sg.addColorStop(1, 'rgba(255,120,60,0)');
      g.fillStyle = sg;
      g.fillRect(-o, -o, W, W);
    }
    g.restore();
  }
  // nappes du bord (ringFog), au-dessus du voile comme dans la v195
  const dx = reduce ? 0 : Math.sin(now / 2600) * 5,
    dy = reduce ? 0 : Math.cos(now / 3100) * 4;
  g.globalAlpha = nightAmt * 0.75;
  g.drawImage(axRing(), dx - o, dy - o, W, W);
  g.globalAlpha = 1;
}
// v210 : PC — l'éclairage du jeu (drawSky : soleil, ombre, rayons, nuages, crépuscule, teinte de nuit) n'est plus dessiné sur les seules 11 × 11 cases
// (il formait un carré) : il est peint sur l'image entière du plateau (#axPc), à pleine force sur les 9 × 9 cases jouables, puis il s'estompe
// jusqu'au bord de l'image. Le canvas du jeu laisse voir l'image (sol transparent) et ne dessine plus drawSky dans ce mode.
let axSky = null;
try {
  axSky = (0, eval)(
    '(' +
      String(drawSky)
        .replace(/if\(nightAmt>\.03\)\{ctx\.globalAlpha=nightAmt\*\.7;[^}]*\}/, '')
        .replace(/^function drawSky\(now\)/, 'function(now,XC,AXR,AXT)')
        .replace(/\bctx\b/g, 'XC')
        .replace(/fillRect\(0,0,L,L\)/g, 'fillRect(AXR[0],AXR[1],AXR[2],AXR[3])')
        .replace(/setTransform\(\.\.\.CAM\)/g, 'setTransform(...AXT)') +
      ')',
  );
} catch (e) {
  axSky = null;
}
{
  const ds = drawSky;
  drawSky = function () {
    if (axOn() && axSky) return;
    return ds.apply(this, arguments);
  };
}
{
  const fi = frameInner;
  frameInner = function () {
    if (axOn() && axSky) {
      try {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
      } catch (e) {}
    }
    return fi.apply(this, arguments);
  };
}
{
  const bg = buildGround;
  buildGround = function () {
    const r = bg.apply(this, arguments);
    try {
      if (axOn() && axSky) {
        const g = ground.getContext('2d');
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, ground.width, ground.height);
        g.restore();
      }
    } catch (e) {}
    return r;
  };
}
const AXP = { t: 0, B: null, M: null, key: '' };
function axPaint() {
  try {
    const d = $('#axPlat');
    if (!d || d.hidden || !axOn() || !axSky) return;
    let pc = $('#axPc');
    if (!pc) {
      pc = document.createElement('canvas');
      pc.id = 'axPc';
      d.insertBefore(pc, d.firstChild);
    }
    const now = performance.now();
    if (now - AXP.t < (OPT.eco ? 100 : 33)) return;
    AXP.t = now;
    const dpr = Math.min(OPT.eco ? 1 : 1.5, devicePixelRatio || 1),
      w = Math.round(d.offsetWidth * dpr),
      h = Math.round(d.offsetHeight * dpr);
    if (!w || !h) return;
    if (pc.width !== w || pc.height !== h) {
      pc.width = w;
      pc.height = h;
    }
    const iw = AXI.iw,
      ih = AXI.ih,
      ox = AXI.ox,
      oy = AXI.oy,
      k = w / iw; /* coordonnées du jeu -> pixels de l'image : x' = (x - ox) * k */
    const key = w + 'x' + h;
    if (AXP.key !== key) {
      AXP.key = key;
      AXP.B = document.createElement('canvas');
      AXP.B.width = w;
      AXP.B.height = h;
      const M = (AXP.M = document.createElement('canvas'));
      M.width = w;
      M.height = h;
      const m = M.getContext('2d'),
        gx0 = w * 0.06,
        gx1 = w * 0.94,
        gy0 = h * 0.06,
        gy1 = h * 0.94; /* lumière pleine jusqu'au cadre du plateau */
      let gr = m.createLinearGradient(0, 0, w, 0);
      gr.addColorStop(0, 'rgba(0,0,0,0)');
      gr.addColorStop(gx0 / w, '#000');
      gr.addColorStop(gx1 / w, '#000');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      m.fillStyle = gr;
      m.fillRect(0, 0, w, h);
      m.globalCompositeOperation = 'destination-in';
      gr = m.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, 'rgba(0,0,0,0)');
      gr.addColorStop(gy0 / h, '#000');
      gr.addColorStop(gy1 / h, '#000');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      m.fillStyle = gr;
      m.fillRect(0, 0, w, h);
    }
    const p = pc.getContext('2d'),
      B = AXP.B,
      b = B.getContext('2d'),
      n = Math.min(1, Math.max(0, nightAmt));
    p.setTransform(1, 0, 0, 1, 0, 0);
    p.globalAlpha = 1;
    p.globalCompositeOperation = 'source-over';
    p.clearRect(0, 0, w, h);
    p.drawImage(AX.plat, 0, 0, w, h);
    // teinte bleu lune de la nuit (drawSky) : partout, sans estompage
    if (n > 0.03) {
      p.globalAlpha = n * 0.7;
      p.globalCompositeOperation = 'multiply';
      p.fillStyle = 'rgb(95,120,190)';
      p.fillRect(0, 0, w, h);
      p.globalAlpha = 1;
      p.globalCompositeOperation = 'destination-in';
      p.drawImage(AX.plat, 0, 0, w, h);
      p.globalCompositeOperation = 'source-over';
    }
    // lumière du jour et du crépuscule : pleine sur les cases, estompée jusqu'au bord de l'image
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.globalAlpha = 1;
    b.globalCompositeOperation = 'source-over';
    b.clearRect(0, 0, w, h);
    b.drawImage(pc, 0, 0);
    const T0 = [k, 0, 0, k, -ox * k, -oy * k];
    b.setTransform(...T0);
    axSky(now, b, [ox, oy, iw, ih], T0);
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.globalAlpha = 1;
    b.globalCompositeOperation = 'destination-in';
    b.drawImage(AX.plat, 0, 0, w, h);
    b.drawImage(AXP.M, 0, 0);
    b.globalCompositeOperation = 'source-over';
    p.drawImage(B, 0, 0);
    // voile de la nuit et de l'aube (drawDark) hors des cases : le canvas du jeu le dessine déjà sur les cases
    if (!PADU) {
      const dq = (now - dawnT) / DAWN,
        dawn = dq >= 0 && dq < 1 && nightTarget === 0,
        cx0 = (0 - ox) * k,
        cy0 = (0 - oy) * k,
        cw = L * k;
      if (dawn || n >= 0.01) {
        p.save();
        p.beginPath();
        p.rect(0, 0, w, h);
        p.rect(cx0 + cw, cy0, -cw, cw);
        p.clip('evenodd');
        if (dawn) {
          const fx = 1 - dq * 1.35,
            gr = p.createLinearGradient(cx0, 0, cx0 + cw, 0);
          for (let j = 0; j <= 8; j++) {
            const q = j / 8;
            gr.addColorStop(q, `rgba(4,7,18,${0.8 * Math.min(1, Math.max(0, (fx + 0.3 - q) / 0.3))})`);
          }
          p.fillStyle = gr;
          p.fillRect(0, 0, cx0 + 0.5, h);
          p.fillRect(0, 0, w, h);
        } else {
          p.fillStyle = `rgba(4,7,18,${0.8 * n})`;
          p.fillRect(0, 0, w, h);
        }
        p.globalCompositeOperation = 'destination-in';
        p.drawImage(AX.plat, 0, 0, w, h);
        p.restore();
      }
    }
  } catch (e) {}
}
{
  let raf = () => {
    axPaint();
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}
// v219 : nouvelles illustrations de l'artiste (assets/art/cards) et cadres par rareté (style.css, fin du fichier)
// ===== v216 : nouvelle disposition du style artiste, d'après les maquettes d'Amine =====
// Ordinateur : à gauche le ciel du jour (jour, phrase, tampon), la piste, le camp, Deck / Réserve / Défausse, les onglets ;
// au centre le plateau le plus grand possible et le bac de cartes en bas (le bac et le plateau passent devant les colonnes) ;
// à droite le logo et les icônes, l'abri, la grande carte survolée, l'énergie et « Affronter la nuit ».
// Téléphone en hauteur : les mêmes éléments, empilés. Les éléments sont déplacés dans #ax3 ; une marque reste à leur place
// d'origine pour les y remettre (style classique, téléphone tourné).
const AX3 = { el: null, mv: [] };
function ax3Want() {
  return AX.on();
} // v237 : aussi sur téléphone tourné (plateau encadré à gauche, bac à droite)
function ax3Build() {
  if (AX3.el) return AX3.el;
  const a = document.querySelector('.app');
  if (!a) return null;
  const e = document.createElement('div');
  e.id = 'ax3';
  e.innerHTML =
    '<div class="ax3-l"><div class="axsky" id="axSky"></div><div class="axpiles"><div class="axdk" id="axDk"></div><div class="axrd" id="axRd"></div></div></div>' +
    '<div class="ax3-c"><div class="axboard" id="axBoard"><div id="axBord" aria-hidden="true"><i class="t"></i><i class="d"></i></div><canvas id="axFar" aria-hidden="true"></canvas></div><div class="axbac" id="axBac"><i class="axbac-f"></i><i class="axbac-a"></i></div></div>' +
    '<div class="ax3-r"><div class="axtop" id="axTop"><div class="axicons" id="axIcons"></div></div></div>';
  a.appendChild(e);
  return (AX3.el = e);
}
// range les éléments de list (dans l'ordre) dans box ; un élément pas encore créé est simplement ignoré
function ax3Put1(box, list) {
  const ns = list.map(s => (typeof s === 'string' ? document.querySelector(s) : s));
  ns.forEach((n, i) => {
    if (!n || n.parentNode === box) return;
    if (!n._axPh) {
      const ph = document.createComment('ax3');
      n.parentNode.insertBefore(ph, n);
      n._axPh = ph;
      AX3.mv.push(n);
    }
    let ref = null;
    for (let j = i + 1; j < ns.length; j++)
      if (ns[j] && ns[j].parentNode === box) {
        ref = ns[j];
        break;
      }
    box.insertBefore(n, ref);
  });
}
function ax3Put() {
  try {
    if (!ax3Want()) {
      ax3Back();
      return;
    }
    const e = ax3Build();
    if (!e) return;
    DE.classList.add('ax3');
    ax3Put1($('#axSky'), ['#round', '#event']);
    ax3Put1(e.querySelector('.ax3-l'), ['#axSky', '#horde', '#fams', '.axpiles', '#ftabs']);
    ax3Put1($('#axDk'), ['#pDraw']);
    ax3Put1($('#axRd'), ['#pRes', '#pDisc']);
    ax3Put1($('#axBoard'), ['#map', '#axBord']);
    ax3Put1($('#axBac'), [$('#axBac .axbac-f'), '#hand', $('#axBac .axbac-a')]);
    ax3Put1($('#axTop'), ['.top .brand', '#axIcons']);
    ax3Put1($('#axIcons'), ['#pz', '#mute', '#fs', '#mtb', '#holes']);
    ax3Put1(e.querySelector('.ax3-r'), ['#axTop', '.shel', '#tip', '#meter', '#axBig', '#info', '#go']);
    ax3Phase();
  } catch (err) {}
}
function ax3Back() {
  if (!AX3.mv.length && !DE.classList.contains('ax3')) return;
  DE.classList.remove('ax3');
  for (let i = AX3.mv.length - 1; i >= 0; i--) {
    const n = AX3.mv[i],
      ph = n._axPh;
    if (ph && ph.parentNode) ph.parentNode.replaceChild(n, ph);
    n._axPh = null;
  }
  AX3.mv = [];
}
// ciel et décor : jour pendant la préparation, nuit (ou nuit rouge, et nuit du boss) pendant l'attaque
function ax3Phase() {
  try {
    let p = 'jour';
    if (typeof G !== 'undefined' && G && S.busy) p = Z.pressure(G.night) || G.night % 10 === 0 ? 'rouge' : 'nuit';
    if (DE.dataset.axph !== p) DE.dataset.axph = p;
  } catch (e) {}
}
{
  const f0 = feltLayout;
  feltLayout = function () {
    ax3Back();
    const r = f0.apply(this, arguments);
    ax3Put();
    try {
      if (axPalSet()) axPlat();
    } catch (e) {}
    return r;
  };
}
{
  const r5 = render;
  render = function () {
    r5.apply(this, arguments);
    ax3Put();
  };
}
{
  const a5 = applyArt;
  applyArt = function () {
    const r = a5.apply(this, arguments);
    try {
      feltLayout();
    } catch (e) {}
    return r;
  };
}
addEventListener('resize', () => {
  try {
    feltLayout();
    fit();
  } catch (e) {}
});
// Deck (dos noir au symbole biohazard), Réserve et Défausse : trois formes séparées
const AXBIO =
  '<svg viewBox="-50 -50 100 100" aria-hidden="true"><defs><mask id="axbm"><rect x="-50" y="-50" width="100" height="100" fill="#fff"/>' +
  [0, 120, 240]
    .map(
      a =>
        `<circle cx="${(Math.sin((a * Math.PI) / 180) * -22).toFixed(2)}" cy="${(Math.cos((a * Math.PI) / 180) * -22).toFixed(2)}" r="15" fill="#000"/><rect x="-2" y="-12" width="4" height="10" fill="#000" transform="rotate(${a + 180})"/>`,
    )
    .join('') +
  '<circle r="7" fill="#000"/></mask></defs><g mask="url(#axbm)">' +
  [0, 120, 240]
    .map(
      a =>
        `<circle cx="${(Math.sin((a * Math.PI) / 180) * -15).toFixed(2)}" cy="${(Math.cos((a * Math.PI) / 180) * -15).toFixed(2)}" r="22"/>`,
    )
    .join('') +
  '<circle r="14" fill="none" stroke-width="5"/></g></svg>';
const AXIC = {
  res: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="5" width="11" height="15" rx="1.5" transform="rotate(12 13 12)"/><rect x="5" y="5" width="11" height="15" rx="1.5"/></svg>',
  dis: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
};
{
  const p0 = pilesHtml;
  pilesHtml = function () {
    const r = p0.apply(this, arguments);
    try {
      if (!DE.classList.contains('ax3') || !G || !S.draw) return r;
      const pd = $('#pDraw'),
        px = $('#pDisc'),
        pr = $('#pRes'),
        b = G.bench || [];
      pd.innerHTML = `<span class="axdos"></span><span class="axdkt"><em>${_t('Deck')}</em><b>${S.draw.length}</b><small>${_t('cartes restantes')}</small></span>`;
      px.innerHTML = `${AXIC.dis}<span class="axpt"><em>${_t('Défausse')}</em><b class="pn">${S.discard.length}</b></span>`;
      pr.innerHTML = `${AXIC.res}<span class="axpt"><em>${_t('Réserve')}</em><b class="pn">${b.length}</b></span>`;
      pr.classList.toggle('empty', !b.length);
      if (!b.length) pr.disabled = true;
    } catch (e) {}
    return r;
  };
}
{
  const r6 = render;
  render = function () {
    r6.apply(this, arguments);
    try {
      if (DE.classList.contains('ax3')) pilesHtml();
    } catch (e) {}
  };
}
try {
  feltLayout();
} catch (e) {}
// v217 : le cadre du plateau (plateau-bord.webp) passe devant le canvas, qui est coupé sur le bord extérieur du cadre :
// la nuit (teinte bleue et voile, mêmes formules que drawSky et drawDark) est peinte sur le cadre, donc plus de démarcation
{
  let last = '';
  const loop = () => {
    try {
      const b = $('#axBord');
      if (b && DE.classList.contains('ax3')) {
        const t = b.firstChild,
          d = b.lastChild,
          n = Math.max(0, Math.min(1, nightAmt));
        const dq = (performance.now() - dawnT) / DAWN,
          dawn = dq >= 0 && dq < 1 && nightTarget === 0;
        let bg = 'none';
        if (dawn) {
          const fx = 1 - dq * 1.35,
            st = [];
          for (let k = 0; k <= 12; k++) {
            const x = k / 12,
              s = (x * AXI.w - AXI.x0 + AXI.cw) / (11 * AXI.cw);
            st.push(
              `rgba(4,7,18,${(0.8 * Math.min(1, Math.max(0, (fx + 0.3 - s) / 0.3))).toFixed(3)}) ${(x * 100).toFixed(1)}%`,
            );
          }
          bg = `linear-gradient(90deg,${st.join(',')})`;
        } else if (n >= 0.01) bg = `rgba(4,7,18,${(0.8 * n).toFixed(3)})`;
        const k = bg + '|' + (n > 0.03 ? (n * 0.7).toFixed(3) : 0);
        if (k !== last) {
          last = k;
          d.style.background = bg;
          t.style.opacity = n > 0.03 ? (n * 0.7).toFixed(3) : 0;
        }
      }
    } catch (e) {}
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
// v217 : sur grand écran, les colonnes grossissent avec la hauteur (zoom), sans dépasser leur largeur
function ax3Zoom() {
  try {
    const on = DE.classList.contains('ax3') && DE.classList.contains('felton');
    document.querySelectorAll('#ax3 .ax3-l,#ax3 .ax3-r').forEach(c => {
      if (!on) {
        c.style.zoom = '';
        c.style.height = '';
        return;
      }
      c.style.zoom = '';
      const w = c.getBoundingClientRect().width,
        k = Math.max(1, Math.min(1.6, innerHeight / 800, w / 290));
      c.style.zoom = k === 1 ? '' : k.toFixed(3);
      c.style.height = ((innerHeight - 12) / k).toFixed(1) + 'px';
    });
  } catch (e) {}
}
{
  const f1 = feltLayout;
  feltLayout = function () {
    const r = f1.apply(this, arguments);
    ax3Zoom();
    return r;
  };
}
try {
  feltLayout();
} catch (e) {}

/* v227 : onde au clic (choix d’Amine) : un cercle clair part de l’endroit touché et remplit le bouton.
   Style artiste seulement ; rien en Mode économie ni pour les joueurs qui demandent moins d’animations. Les cartes de la main ont leurs propres effets. */
document.addEventListener(
  'pointerdown',
  e => {
    try {
      if (!ARTX() || OPT.eco || reduce || e.button > 0) return;
      const b = e.target.closest && e.target.closest('button');
      if (!b || b.disabled || b.classList.contains('card') || b.closest('#hand')) return;
      const r = b.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      const x = e.clientX - r.left,
        y = e.clientY - r.top,
        d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
      const w = document.createElement('rip-w'),
        i = document.createElement('rip-i');
      Object.assign(i.style, { left: x - 3 + 'px', top: y - 3 + 'px', width: d + 'px', height: d + 'px' });
      w.appendChild(i);
      b.appendChild(w);
      setTimeout(() => w.remove(), 560);
    } catch (x) {}
  },
  true,
);

/* v230 : les zombies qui arrivent, vus de loin dans la forêt (affichage seulement : lit G.pending, la liste du moteur).
   Silhouettes sombres aux yeux rouges qui marchent du bord du plateau vers la route ; elles passent sous le canvas
   juste avant que le moteur fasse entrer le zombie. Coupé en Mode économie (moins de silhouettes) et sans style artiste. */
const AXF = { t: 0, W: 6 };
{
  const s0 = syncZ;
  syncZ = function (now) {
    AXF.t = now;
    return s0.apply(this, arguments);
  };
}
{
  const fl = () => {
    try {
      const cv = $('#axFar');
      if (cv && DE.classList.contains('ax3')) axFarDraw(cv);
    } catch (e) {}
    requestAnimationFrame(fl);
  };
  requestAnimationFrame(fl);
}
function axFarDraw(cv) {
  const W = cv.clientWidth,
    H = cv.clientHeight;
  if (!W || !H) return;
  const dpr = Math.min(2, OPT.eco ? 1 : devicePixelRatio || 1),
    w = Math.round(W * dpr),
    h = Math.round(H * dpr);
  if (cv.width !== w || cv.height !== h) {
    cv.width = w;
    cv.height = h;
  }
  const g = cv.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, w, h);
  // v230 : la brume du bord (ringFog) entoure tout le plateau, forêt comprise, au lieu du seul carré du canvas
  if (nightAmt > 0.03 && AX.rf) {
    const dx = reduce ? 0 : Math.sin(performance.now() / 2600) * 5 * dpr,
      dy = reduce ? 0 : Math.cos(performance.now() / 3100) * 4 * dpr;
    g.globalAlpha = nightAmt * 0.7;
    g.drawImage(AX.rf(), dx - w * 0.02, dy - h * 0.02, w * 1.04, h * 1.04);
    g.globalAlpha = 1;
    if (AX.plat) {
      g.globalCompositeOperation = 'destination-in';
      g.drawImage(AX.plat, 0, 0, w, h);
      g.globalCompositeOperation = 'source-over';
    }
  }
  if (!G || !S.busy || !G.pending || !G.pending.length || nightAmt < 0.2) return;
  const kx = w / AXI.w,
    ky = h / ((AXI.h * AXI.cw) / AXI.ch),
    now = performance.now(),
    fr = Math.max(0, Math.min(1, (now - AXF.t) / tickMs())),
    wt = (G.wtick || 0) + fr,
    wv = G.wave || 1;
  const cx = c => AXI.x0 + (c - 0.5) * AXI.cw,
    cy = r => ((AXI.y0 + (r - 0.5) * AXI.ch) * AXI.cw) / AXI.ch; // centre d'une case du jeu, en px de l'image (hauteur redressée)
  const X0 = 72,
    X1 = 1242,
    Y0 = (64 * AXI.cw) / AXI.ch,
    Y1 = (1028 * AXI.cw) / AXI.ch; // intérieur du cadre
  g.save();
  g.scale(kx, ky);
  g.beginPath();
  g.rect(X0, Y0, X1 - X0, Y1 - Y0);
  g.clip();
  let n = 0;
  for (const p of G.pending) {
    if ((p.wave || 1) !== wv) continue;
    const d = p.at - wt;
    if (d <= 0 || d > AXF.W) continue;
    if (++n > (OPT.eco ? 8 : 24)) break;
    const [r, c] = Z.rc(p.pos),
      ex = cx(c),
      ey = cy(r),
      ox = c === 0 ? -1 : c === 10 ? 1 : 0,
      oy = r === 0 ? -1 : r === 10 ? 1 : 0;
    const sx = ox < 0 ? X0 : ox > 0 ? X1 : ex,
      sy = oy < 0 ? Y0 : oy > 0 ? Y1 : ey; // départ : bord du cadre, dans l'axe de la route
    const q = 1 - d / AXF.W,
      hs = ((p.at * 7919 + p.pos * 31) % 100) / 100,
      lat = (hs - 0.5) * 34,
      bob = Math.sin(now / 260 + hs * 6) * 2.5;
    const x = sx + (ex + ox * 46 - sx) * q + (oy ? lat : 0) + (ox ? 0 : bob * 0.4),
      y = sy + (ey + oy * 46 - sy) * q + (ox ? lat : 0) + (oy ? 0 : bob * 0.4);
    const big = Z.ZT && Z.ZT[p.k] && (Z.ZT[p.k].boss || Z.ZT[p.k].hp >= 20) ? 1.5 : 1,
      R = 24 * big,
      a = Math.min(1, q * 2.2) * Math.min(1, nightAmt);
    g.globalAlpha = a * 0.75;
    g.fillStyle = '#07090c';
    g.beginPath();
    g.ellipse(x, y, R, R * 0.9, 0, 0, 7);
    g.fill();
    const ang = Math.atan2(ey - sy, ex - sx),
      px = -Math.sin(ang),
      py = Math.cos(ang),
      fx = Math.cos(ang) * R * 0.45,
      fy = Math.sin(ang) * R * 0.45,
      bl = (now / 1000 + hs * 9) % 3.2 < 0.12;
    if (!bl) {
      g.globalAlpha = a;
      g.fillStyle = '#ff3a2a';
      if (!OPT.eco) {
        g.shadowColor = '#ff2a1a';
        g.shadowBlur = 8;
      }
      for (const s of [-1, 1]) {
        g.beginPath();
        g.arc(x + fx + px * s * R * 0.3, y + fy + py * s * R * 0.3, 3.4 * big, 0, 7);
        g.fill();
      }
      g.shadowBlur = 0;
    }
  }
  g.restore();
}

// v231 : noms des cartes adaptés aux nouvelles illustrations de l'artiste (Options, « Images de l'artiste » seulement ; le style actuel garde les anciens noms)
const ARTN = {
  sht: _t('Calibre 12'),
  mg: _t('Tondeuse de guerre'),
  mine: _t("Galette d'acier"),
  dyn: _t('Réveil-matin'),
  mortar: _t('Mortier potager'),
  sentry: _t('Tourelle-caméra'),
  clay: _t("Éventail d'acier"),
  bunker: _t('Bunker de jardin'),
  med: _t('Sœur Bicyclette'),
  cook: _t('Sœur Fournée'),
  pharma: _t('Sœur Alambic'),
  priest: _t("L'Exorciste"),
  stretch: _t('Novice à roulettes'),
  amb: _t('Sœur Mêlée'),
  doc: _t('Sœur Pistole'),
  orderly: _t('Frère Carillon'),
  gun: _t('Miss Deux-Colts'),
  cop: _t("L'Hercule"),
  riot: _t('Videur du chapiteau'),
  k9: _t('Caniche savant'),
  swat: _t('Lanceuse de couteaux'),
  chief_police: _t('La Dompteuse'),
  handler: _t('Madame Pompon'),
  k9squad: _t('Le Grand Numéro'),
  lamp: _t('La Poursuite'),
  siren: _t('Porte-voix'),
  barrier: _t('Barrière de piste'),
  autogun: _t('Manège à balles'),
  snp: _t('La Biathlète'),
  chief_mil: _t('Le Prophète'),
  assassin: _t('Le Samouraï'),
  nightsnp: _t('Œil-de-Nuit'),
  chief_care: _t('La Mère Abbesse'),
  fieldnurse: _t('Sœur Lanterne'),
  canteen: _t('La Kermesse'),
  hospital: _t('Dortoir des sœurs'),
  flame: _t('Cracheur de feu'),
  molo: _t('La Barmaid'),
  chief_pyro: _t('Le Maître artificier'),
  heavyflame: _t('Le Géant de feu'),
  tire: _t('Pneus peints'),
  fire: _t('Nappe de feu'),
  gas: _t('Butane'),
  brasero: _t('Brasero forain'),
  firetrap: _t('Baril surprise'),
  hunter: _t('Écureuil-Vif'),
  chief_trap: _t('Akela'),
  scout: _t('Hibou-Curieux'),
  teacher: _t('La Bibliothécaire'),
  vigile: _t('Livreur de pizza'),
  carp: _t('Bricoleur du dimanche'),
  ranger: _t('Papy Ball-trap'),
  chief_comm: _t('La Présidente'),
  gang: _t('La Bande à vélo'),
  saint: _t("L'Illuminé"),
  market: _t('Vide-grenier'),
  v_medic: _t('Toubib des secours'),
  v_sniper: _t("L'Œil des secours"),
  v_rdog: _t('Chien sauveteur'),
  radioop: _t('Voix des secours'),
  v_heli: _t('Pluie de caisses'),
  v_hmg: _t('Calibre 50'),
  v_radio: _t('Radio des secours'),
  v_cont: _t('Rempart de conteneurs'),
  scare: _t('Monsieur Paille'),
  mech: _t('Mécano stock-car'),
  nailer: _t('La Couvreuse'),
  chief_tech: _t('Le Roi de la casse'),
  welder: _t('Soudeuse masquée'),
  genmech: _t('Professeur Volts'),
  fen: _t('Grillage électrifié'),
  radio: _t('Radio-cintre'),
  solar: _t('Plein Soleil'),
  turret: _t('Tourelle à jante'),
  workshop: _t("L'Établi"),
  modwall: _t('Mur de portières'),
  tesla: _t('Tour à éclairs'),
  kid: _t('Petit Lance-Pierre'),
  monk: _t('Le Moine voisin'),
  lead: _t('Le Coach'),
  tracker: _t('Renarde-Rusée'),
  xbow: _t('Arbalète de camp'),
  trap: _t('Croc-de-loup'),
  wire: _t('Ronces de fer'),
  spike: _t('Gueule de pieux'),
  smoke: _t('Fumée verte'),
  bait: _t('Steak pendu'),
  net: _t('Filet de capture'),
  bear: _t("Croc-d'ours"),
  axe: _t('Fend-la-Bûche'),
  dog: _t('Chien Bandana'),
  butch: _t('Gros Couperet'),
  dogs: _t('La Meute bleue'),
  pitch: _t('Clown de rodéo'),
  chief_farm: _t('La Reine du rodéo'),
  slaughter: _t("L'Équarrisseur"),
  v_mines: _t('Champ de mines'),
  v_napalm: _t('Terre brûlée'),
  v_apc: _t('Le Mastodonte'),
  bar: _t('Planches clouées'),
  car: _t('Vieille guimbarde'),
  sand: _t('Mur de sacs'),
  door: _t('Porte de chambre forte'),
  food: _t('Garde-manger'),
  rep: _t('Caisse à outils'),
  kit: _t('Boîte à pharmacie'),
  coffee: _t('Café brûlant'),
  roadmap: _t('Carte et boussole'),
  tear: _t('Gaz lacrymo'),
  napalm: _t('Brasier'),
  air: _t('Bombardement'),
  grenade: _t("L'Ananas"),
  tower: _t('Nid de pie'),
  trench: _t('Le Boyau'),
  pump: _t('Pompe du puits'),
  flood: _t('Projo de chantier'),
  palis: _t('Pieux taillés'),
  gate: _t('Grille cadenassée'),
  gabion: _t('Cages à cailloux'),
  log: _t('Bélier pendu'),
  pit: _t('Trou de loup'),
  glass: _t('Tessons'),
  cans: _t('Carillon de boîtes'),
  rocks: _t('Éboulement'),
  supply: _t('Caisse de matériel'),
  airdrop: _t('Colis du ciel'),
  jerry: _t('Jerrican'),
  rest: _t('Lit de camp'),
  shot: _t('Tir de couverture'),
  patch: _t('Rafistolage'),
  molotov: _t('Molotov'),
  horn: _t('Klaxon de détresse'),
  rush: _t("Shoot d'adrénaline"),
  rocket: _t('Bazooka'),
  flare: _t('Fusée rouge'),
  gear: _t('Casque et plaques'),
  binoc: _t('Jumelles'),
  bandage: _t('Bandages'),
  medkit: _t('Musette de soins'),
  torch: _t('Lampe torche'),
  pills: _t('Cachets'),
  pack: _t('Sac à dos'),
  tape: _t('Scotch américain'),
  keys: _t('Trousseau'),
  talkie: _t('Talkie-walkie'),
  storm: _t('Orage'),
  bomber: _t('Raid aérien'),
  shell: _t('Obus anti-Colosse'),
  noise: _t('Radiocassette'),
  fortin: _t('Voiture-fortin'),
};
function artNames() {
  try {
    const on = !!(ART_DEV && OPT.art);
    for (const k in ARTN) {
      const u = Z.U[k];
      if (!u) continue;
      if (u.n0 === undefined) u.n0 = u.n;
      u.n = on ? ARTN[k] : u.n0;
    }
  } catch (e) {}
}
artNames();
{
  const a6 = applyArt;
  applyArt = function () {
    artNames();
    return a6.apply(this, arguments);
  };
}

// ===== v245 : accueil du style artiste sur le modèle d'Amine =====
// Logo, phrase entre deux filets, gros bouton « Jouer » (panneau noir rougi, lueur de braise), deux grands boutons avec icône,
// barre du bas (Règles, Bestiaire, Stats, Succès, Crédits) et engrenage des Options en haut à droite.
// Le mode test et les crédits passent aussi dans les Options (sur téléphone, la barre n'a pas la place pour « Crédits »).
let axhFirst = true; // l'entrée animée (logo qui tombe, boutons qui glissent) ne se joue qu'au premier affichage
function axPlayHtml() {
  const d = loadSave();
  if (!d) return `<button type="button" class="go axh-play" data-a="new">${_t('Jouer')}</button>`;
  return `<button type="button" class="go axh-play" data-a="load">${_t`Continuer · ${d.s.phase ? _t('Aube') : _t('Jour')} ${d.g.night}`}</button><button type="button" class="axh-new" data-a="new">${_t('Nouvelle partie')}</button>`;
}
function axBigBtn(act, icon, label, extra) {
  return `<button type="button" class="skip axh-big" data-a="${act}">${ii(icon)}<b>${label}${extra || ''}</b></button>`;
}
function axTitleHtml() {
  const intro = DEMO
    ? _t`<p class="demob">Démo</p><p>Tiens <b>${Z.DEMO_N} nuits</b> et repousse le Colosse. Dans le jeu complet : 30 nuits jusqu’aux secours, 3 boss et 10 Mutations.</p>${wishBtn()}`
    : `<p class="axh-tag"><i></i>${_t`Tiens ${Z.WIN_NIGHT} nuits jusqu’à l’arrivée des secours.`}<i></i></p>`;
  const won =
    META.menaceWon >= 0
      ? _t`<p class="mwon">${ii('trophy')} Mutation ${META.menaceWon} vaincue${META.wins > 1 ? _t` · ${META.wins} victoires` : ''}</p>`
      : '';
  const coll = novice()
    ? ''
    : axBigBtn(
        'coll',
        'cards',
        _t('Collection et decks'),
        seen('coll') ? '' : ` <span class="newb">${_t('Nouveau !')}</span>`,
      );
  const daily = DEMO
    ? `<button type="button" class="skip axh-big lockb" disabled title="${_t('Dans le jeu complet')}">${ii('lock')}<b>${_t('Défi du jour')}</b></button>`
    : axBigBtn('daily', 'cal', _t('Défi du jour'));
  const best = META.best
    ? `<p>${_t`Record : ${plural(META.best, _t('nuit survécue'), _t('nuits survécues'))}`}</p>`
    : '';
  const nAch = ACH.filter(a => (META.ach || {})[a[0]]).length;
  const tab = (act, icon, label, cls) =>
    `<button type="button" class="axh-tab${cls ? ' ' + cls : ''}" data-a="${act}">${icon ? ii(icon) : ''}<span>${label}</span></button>`;
  const cls = axhFirst ? ' axh-in' : '';
  axhFirst = false;
  return `<div class="axh-col${cls}"><h1 class="logo">${LOGO.replace(/src="[^"]*"/, 'src="' + uiUrl('barricard.webp') + '"')}</h1>${intro}${won}
  <div class="axh-menu">${axPlayHtml()}${coll}${daily}<div class="axh-info">${best}${nextUnlockTxt()}</div></div></div>
  <nav class="axh-bar${cls}">${tab('rules', 'book', _t('Règles'))}${tab('deck', 'skull', _t('Bestiaire'))}${tab('stats', 'chart', _t('Stats'))}${tab('achs', 'trophy', `${_t('Succès')} ${nAch}/${ACH.length}`)}${tab('credits', '', _t('Crédits'), 'cr')}</nav>
  <button type="button" class="axh-gear" data-a="options" aria-label="${_t('Options')}">${ii('cog')}</button>
  ${iosHint() ? _t('<p class="ver">Sur iPhone : Partager → « Sur l’écran d’accueil » pour jouer en plein écran.</p>') : ''}<p class="ver axh-ver">${VERSION}</p>`;
}
// crédits (sortis de l'accueil)
ACT.credits = () => {
  onTitle = true;
  show(
    `<h2 class="pw">${_t('Crédits')}</h2><p>${_t('Barricard : un jeu d’Amine.')}</p><p>${_t('Sons : Kenney (kenney.nl), artisticdude et saturn91 (OpenGameArt), sous licence CC0 ; La Sonothèque, Pixabay, Sound Fishing (détails dans CREDITS.md).')}</p><p>${_t('Polices : Special Elite, Atkinson Hyperlegible et Oswald (licence SIL Open Font).')}</p><button type="button" class="go" data-a="title">${_t('Retour')}</button>`,
  );
};
// Options ouvertes depuis l'accueil : boutons Crédits et Mode test (qui ne sont plus sur l'accueil du style artiste)
{
  const o0 = optionsScreen;
  optionsScreen = function () {
    const r = o0.apply(this, arguments);
    try {
      const o = $('#panel .opts');
      if (AX.on() && optBack === 'title' && o)
        o.insertAdjacentHTML(
          'afterend',
          `<div class="bgrid axh-optx"><button type="button" class="skip" data-a="credits">${_t('Crédits')}</button><button type="button" class="skip" data-a="testmode">${_t('Mode test')}</button></div>`,
        );
    } catch (e) {}
    return r;
  };
}
// la liste des images de l'artiste arrive après le premier affichage de l'accueil : on le refait dans le bon style
{
  const a2 = applyArt;
  applyArt = function () {
    a2.apply(this, arguments);
    try {
      const home = onTitle && !ov.hidden && panel.classList.contains('ttl');
      if (home && AX.on() !== !!panel.querySelector('.axh-col')) title();
    } catch (e) {}
  };
}
// v246 : le premier accueil est dessiné (game-menu.js) avant que ce fichier soit chargé : on le refait avec la mise en page artiste
try {
  if (AX.on() && onTitle && !ov.hidden && panel.classList.contains('ttl') && !panel.querySelector('.axh-col')) title();
} catch (e) {}
