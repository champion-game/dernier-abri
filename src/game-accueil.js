// v301 : nouvel accueil d'Amine (maquette-accueil.html validée) : son image de fond telle quelle (accueil.webp),
// le logo Barricard de la maquette, les boutons d'avant (qui ne grossissent plus) et un décor animé :
// étoiles, étoile filante, éclair lointain (le logo tremble), mirador et fenêtre qui clignotent, lanterne,
// fumée de la cheminée, braises, lucioles, brume, reflets sur les cartes et les jetons dessinés.
// Le décor est une « scène » à la taille de l'image mise à l'échelle dans le calque #axbg : sur PC accueil.webp
// couvre l'écran ; sur téléphone en hauteur, accueil-portrait.webp prend toute la largeur.
// Chargé en tout dernier : il enveloppe axTitleHtml et axGlow (game-artx.js).

const ACC = { CW: 158, CH: 231, timers: [] };
/* Les deux images d'Amine, utilisées telles quelles : accueil.webp (PC, 1672 × 941) et accueil-portrait.webp
   (téléphone en hauteur, 941 × 1672). Positions mesurées sur chaque image : lumières [x, y, taille],
   cheminée, jetons, zone du ciel pour les étoiles, et coins (haut-gauche, haut-droit, bas-gauche) des cartes peintes. */
ACC.L = {
  W: 1672,
  H: 941,
  ciel: [0, 0, 1672, 230],
  coinLogo: [640, 320], // pas d'étoile derrière le logo (PC)
  mirador: [975, 120, 62],
  maison: [1095, 440, 90],
  lanterne: [1575, 340, 280],
  fumee: [1104, 392],
  jetons: [
    [1272, 778, 118],
    [1383, 808, 118],
  ],
  braises: [1555, 330, 560, 300, 900, 300],
  brumes: [600, 700],
  cartes: [
    [
      [595, 640],
      [750, 660],
      [482, 790],
    ],
    [
      [775, 717],
      [927, 725],
      [705, 887],
    ],
    [
      [920, 732],
      [1062, 737],
      [857, 892],
    ],
    [
      [1057, 737],
      [1222, 755],
      [992, 902],
    ],
  ],
};
ACC.P = {
  W: 941,
  H: 1672,
  ciel: [0, 0, 941, 420],
  coinLogo: [0, 0],
  mirador: [536, 432, 58],
  maison: [520, 825, 80],
  lanterne: [868, 665, 240],
  fumee: [527, 772],
  jetons: [
    [714, 1124, 92],
    [810, 1162, 92],
  ],
  braises: [855, 655, 120, 700, 700, 260],
  brumes: [900, 1000],
  cartes: [
    [
      [145, 1007],
      [285, 1025],
      [47, 1150],
    ],
    [
      [315, 1080],
      [437, 1090],
      [225, 1225],
    ],
    [
      [445, 1095],
      [560, 1107],
      [362, 1247],
    ],
    [
      [560, 1110],
      [690, 1125],
      [487, 1262],
    ],
  ],
};
const accPortrait = () => matchMedia('(max-aspect-ratio:3/4)').matches;

// matrice 2D qui pose un rectangle CW × CH sur les trois coins d'une carte dessinée
function accMatrice([tl, tr, bl]) {
  const { CW, CH } = ACC;
  return `matrix(${(tr[0] - tl[0]) / CW},${(tr[1] - tl[1]) / CW},${(bl[0] - tl[0]) / CH},${(bl[1] - tl[1]) / CH},${tl[0]},${tl[1]})`;
}
// une lueur ronde centrée sur [x, y, taille]
const accLueur = (cls, [x, y, t]) =>
  `<i class="acc-lueur ${cls}" style="left:${x - t / 2}px;top:${y - t / 2}px;width:${t}px;height:${t}px"></i>`;

// contenu de la scène : lumières fixes, puis particules (moins nombreuses en Mode économie)
function accSceneHtml(d) {
  const eco = document.documentElement.classList.contains('eco');
  const [cx, cy, cw, ch] = d.ciel;
  let h = '<div class="acc-ciel"><i class="acc-eclair"></i><i class="acc-filante"></i>';
  for (let i = 0; i < (eco ? 18 : 42); i++) {
    // pseudo-hasard stable : les étoiles restent à la même place d'un affichage à l'autre
    const x = cx + ((i * 397) % cw),
      y = cy + ((i * 131) % ch);
    if (x < d.coinLogo[0] && y < d.coinLogo[1] && i % 3) continue;
    const t = 2 + ((i * 7) % 5) * 0.5;
    h += `<i class="acc-etoile" style="left:${x}px;top:${y}px;width:${t}px;height:${t}px;--d:${2 + (i % 4)}s;--r:-${i % 5}s"></i>`;
  }
  h += '</div><div class="acc-lum">';
  h += accLueur('acc-mirador', d.mirador) + accLueur('acc-maison', d.maison);
  const [lx, ly, lt] = d.lanterne;
  h += accLueur('acc-lanterne2', [lx, ly + lt * 0.35, lt * 1.6]) + accLueur('acc-lanterne', [lx, ly, lt]);
  d.jetons.forEach(
    ([x, y, t], i) =>
      (h += `<i class="acc-jeton" style="left:${x - t / 2}px;top:${y - t / 2}px;width:${t}px;height:${t}px;--d:${1 + i * 0.6}s"></i>`),
  );
  for (let i = 0; i < 6; i++)
    h += `<i class="acc-fumee" style="left:${d.fumee[0]}px;top:${d.fumee[1]}px;--d:-${i * 0.9}s"></i>`;
  const [bx, by, zx, zy, zw, zh] = d.braises;
  for (let i = 0; i < (eco ? 5 : 16); i++) {
    h +=
      i < 6
        ? `<i class="acc-braise" style="left:${bx + ((i * 13) % 40) - 20}px;top:${by + ((i * 7) % 30) - 15}px;--d:${3 + (i % 3)}s;--r:-${i}s;--x:${((i * 17) % 60) - 30}px"></i>`
        : `<i class="acc-braise acc-luciole" style="left:${zx + ((i * 173) % zw)}px;top:${zy + ((i * 89) % zh)}px;--d:${6 + (i % 5)}s;--r:-${i * 1.3}s;--x:${((i * 41) % 160) - 80}px"></i>`;
  }
  d.cartes.forEach(c => (h += `<i class="acc-reflet" style="transform:${accMatrice(c)}"></i>`));
  h += '</div><div class="acc-brumes">';
  d.brumes.forEach(
    (y, i) =>
      (h += `<i class="acc-brume" style="top:${y}px${i ? ';animation-duration:55s;animation-direction:reverse;opacity:.7' : ''}"></i>`),
  );
  return h + '</div>';
}

// place la scène : couvre l'écran sur PC ; sur téléphone, l'image en hauteur prend toute la largeur
// et remonte juste ce qu'il faut pour que les cartes peintes restent au-dessus du menu
function accPlacer() {
  try {
    const bg = $('#axbg'),
      sc = $('#accScene');
    if (!bg || !sc) return;
    const vw = bg.clientWidth || innerWidth,
      vh = innerHeight;
    let k, ox, oy;
    if (sc.dataset.k === 'l') {
      const { W, H } = ACC.L;
      // ne jamais couper le plateau ni la lanterne à droite
      k = Math.min(Math.max(vw / W, vh / H), vw / 1500);
      ox = Math.max((vw - W * k) / 2, vw - W * k);
      oy = (vh - H * k) * 0.6;
    } else {
      k = vw / ACC.P.W;
      ox = 0;
      const menu = $('#ov.axh .axh-menu');
      const haut = menu ? menu.getBoundingClientRect().top : vh;
      oy = Math.min(0, haut - 1290 * k);
    }
    sc.style.transform = `translate(${ox}px,${oy}px) scale(${k})`;
  } catch (e) {}
}

// éclair lointain et étoile filante, à intervalles irréguliers
function accAmbiance() {
  ACC.timers.forEach(clearTimeout);
  ACC.timers = [];
  const relance = (el, cls) => {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };
  const orage = () => {
    ACC.timers.push(
      setTimeout(
        () => {
          const e = $('#accScene .acc-eclair');
          if (!e) return;
          relance(e, 'go');
          const logo = $('#ov.axh .axh-col .logo');
          if (logo) relance(logo, 'acc-tremble');
          orage();
        },
        9000 + Math.random() * 9000,
      ),
    );
  };
  const filante = () => {
    ACC.timers.push(
      setTimeout(() => {
        const f = $('#accScene .acc-filante');
        if (!f) return;
        const portrait = f.closest('#accScene').dataset.k === 'p';
        f.style.left = (portrait ? 350 : 900) + Math.random() * (portrait ? 550 : 650) + 'px';
        f.style.top = 20 + Math.random() * 90 + 'px';
        relance(f, 'go');
        filante();
      }, 7000),
    );
  };
  const reflet = () => {
    ACC.timers.push(
      setTimeout(() => {
        const r = document.querySelectorAll('#accScene .acc-reflet');
        if (!r.length) return;
        relance(r[Math.floor(Math.random() * r.length)], 'go');
        reflet();
      }, 2600),
    );
  };
  orage();
  filante();
  reflet();
}

// crée la scène dans le calque de l'accueil (une seule fois par affichage de l'accueil)
function accScene() {
  try {
    const bg = $('#axbg');
    if (!AX.on() || !bg || !$('#ov.home')) return;
    bg.classList.add('acc');
    const k = accPortrait() ? 'p' : 'l';
    let sc = $('#accScene');
    if (!sc || sc.dataset.k !== k) {
      if (sc) sc.remove();
      const d = k === 'p' ? ACC.P : ACC.L;
      sc = document.createElement('div');
      sc.id = 'accScene';
      sc.dataset.k = k;
      sc.style.width = d.W + 'px';
      sc.style.height = d.H + 'px';
      sc.innerHTML = accSceneHtml(d);
      bg.appendChild(sc);
      accAmbiance();
    }
    accPlacer();
  } catch (e) {}
}

// le logo de l'accueil est celui de la maquette
function accLogo() {
  try {
    document.querySelectorAll('#ov.axh .axh-col .logo img').forEach(i => {
      if (!/logo-accueil/.test(i.src)) i.src = 'assets/art/ui/logo-accueil.webp';
    });
  } catch (e) {}
}

{
  const g0 = axGlow;
  axGlow = function () {
    const r = g0.apply(this, arguments);
    accLogo();
    accScene();
    return r;
  };
}
// le logo change de taille une fois chargé : on recale la scène sous lui (téléphone)
document.addEventListener(
  'load',
  e => {
    if (e.target && e.target.closest && e.target.closest('#ov.axh .logo')) accPlacer();
  },
  true,
);
addEventListener('resize', accPlacer);
// l'accueil est déjà affiché quand ce fichier se charge : on pose tout de suite logo et décor
axGlow();
