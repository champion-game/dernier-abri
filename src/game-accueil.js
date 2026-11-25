// v301 : nouvel accueil d'Amine (maquette-accueil.html validée) : son image de fond telle quelle (accueil.webp),
// le logo Barricard de la maquette, des plaques dorées pour Jouer, Collection et Défi, et un décor animé :
// étoiles, étoile filante, éclair lointain (le logo tremble), mirador et fenêtre qui clignotent, lanterne,
// fumée de la cheminée, braises, lucioles, brume, reflets sur les cartes et les jetons dessinés.
// Le décor est une « scène » à la taille de l'image (1672 × 941) mise à l'échelle dans le calque #axbg :
// sur PC elle couvre l'écran ; sur téléphone en hauteur elle montre le plateau sous le logo.
// Chargé en tout dernier : il enveloppe axTitleHtml et axGlow (game-artx.js).

const ACC = { W: 1672, H: 941, CW: 158, CH: 231 };
// coins (haut-gauche, haut-droit, bas-gauche) des cartes peintes, mesurés sur l'image, pour y faire passer un reflet
ACC.CARTES = [
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
];
ACC.timers = [];

// matrice 2D qui pose un rectangle CW × CH sur les trois coins d'une carte dessinée
function accMatrice([tl, tr, bl]) {
  const { CW, CH } = ACC;
  return `matrix(${(tr[0] - tl[0]) / CW},${(tr[1] - tl[1]) / CW},${(bl[0] - tl[0]) / CH},${(bl[1] - tl[1]) / CH},${tl[0]},${tl[1]})`;
}

// contenu de la scène : lumières fixes, puis particules (moins nombreuses en Mode économie)
function accSceneHtml() {
  const eco = document.documentElement.classList.contains('eco');
  let h = '<div class="acc-ciel"><i class="acc-eclair"></i><i class="acc-filante"></i>';
  for (let i = 0; i < (eco ? 18 : 42); i++) {
    // pseudo-hasard stable : les étoiles restent à la même place d'un affichage à l'autre
    const x = (i * 397) % ACC.W,
      y = (i * 131) % 230;
    if (x < 640 && y < 320 && i % 3) continue; // coin du logo (PC)
    const t = 2 + ((i * 7) % 5) * 0.5;
    h += `<i class="acc-etoile" style="left:${x}px;top:${y}px;width:${t}px;height:${t}px;--d:${2 + (i % 4)}s;--r:-${i % 5}s"></i>`;
  }
  h += '</div><div class="acc-lum">';
  h += '<i class="acc-lueur acc-mirador"></i><i class="acc-lueur acc-maison"></i>';
  h += '<i class="acc-lueur acc-lanterne2"></i><i class="acc-lueur acc-lanterne"></i>';
  h +=
    '<i class="acc-jeton" style="left:1272px;top:778px;--d:1s"></i><i class="acc-jeton" style="left:1383px;top:808px;--d:1.6s"></i>';
  for (let i = 0; i < 6; i++) h += `<i class="acc-fumee" style="--d:-${i * 0.9}s"></i>`;
  for (let i = 0; i < (eco ? 5 : 16); i++) {
    const lanterne = i < 6;
    h += lanterne
      ? `<i class="acc-braise" style="left:${1555 + ((i * 13) % 40)}px;top:${330 + ((i * 7) % 30)}px;--d:${3 + (i % 3)}s;--r:-${i}s;--x:${((i * 17) % 60) - 30}px"></i>`
      : `<i class="acc-braise acc-luciole" style="left:${560 + ((i * 173) % 900)}px;top:${300 + ((i * 89) % 300)}px;--d:${6 + (i % 5)}s;--r:-${i * 1.3}s;--x:${((i * 41) % 160) - 80}px"></i>`;
  }
  ACC.CARTES.forEach(c => (h += `<i class="acc-reflet" style="transform:${accMatrice(c)}"></i>`));
  h += '</div><div class="acc-brumes"><i class="acc-brume" style="top:600px"></i>';
  h +=
    '<i class="acc-brume" style="top:700px;animation-duration:55s;animation-direction:reverse;opacity:.7"></i></div>';
  return h;
}

// place la scène : couvre l'écran sur PC ; sur téléphone en hauteur, montre le plateau juste sous le logo
function accPlacer() {
  try {
    const bg = $('#axbg'),
      sc = $('#accScene');
    if (!bg || !sc) return;
    const vw = bg.clientWidth || innerWidth,
      vh = innerHeight,
      { W, H } = ACC,
      portrait = matchMedia('(max-aspect-ratio:3/4)').matches;
    let k, ox, oy;
    if (!portrait) {
      // ne jamais couper le plateau ni la lanterne à droite
      k = Math.min(Math.max(vw / W, vh / H), vw / 1500);
      ox = Math.max((vw - W * k) / 2, vw - W * k);
      oy = (vh - H * k) * 0.6;
    } else {
      // le plateau (lignes 250 à 930 de l'image) est centré entre le bas du logo et le haut du menu
      const logo = $('#ov.axh .axh-col .logo'),
        menu = $('#ov.axh .axh-menu');
      const haut = logo ? logo.getBoundingClientRect().bottom : vw * 0.3,
        bas = menu ? menu.getBoundingClientRect().top : vh * 0.55,
        place = Math.max(120, bas - haut);
      k = Math.min(vw / 1000, place / 680);
      ox = vw / 2 - 1000 * k;
      oy = haut + (place - 680 * k) / 2 - 250 * k;
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
        f.style.left = 900 + Math.random() * 650 + 'px';
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
    if (!$('#accScene')) {
      const sc = document.createElement('div');
      sc.id = 'accScene';
      sc.innerHTML = accSceneHtml();
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
