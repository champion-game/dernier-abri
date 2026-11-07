/* v244 : chargement des images.
   1. Au lancement, l'écran de chargement (#boot, dans index.html) attend l'essentiel : la page et ses images,
      les sprites du plateau, les cadres de cartes et les cartes du deck. Il ne s'affiche qu'au bout de 0,4 s
      (style.css), donc pas du tout quand tout est déjà sur l'appareil ; il disparaît au plus tard après 12 s.
   2. Ensuite, en arrière-plan : les miniatures de toutes les cartes, le reste de l'interface, puis les grandes images
      (seulement sur une bonne connexion). Pause pendant la nuit et quand le jeu n'est pas à l'écran.
   Les images déjà gardées par le service worker (sw.js) sont sautées. Chargé en dernier. */
const PRELOAD = { done: new Set(), bootOver: false };

// charge une image ; la promesse est toujours tenue (même en cas d'erreur ou après 15 s)
function preloadImg(url) {
  return new Promise(res => {
    if (!url || PRELOAD.done.has(url)) return res();
    PRELOAD.done.add(url);
    const im = new Image();
    const end = () => res();
    im.onload = im.onerror = end;
    setTimeout(end, 15000);
    im.src = url;
  });
}

// l'image est-elle déjà dans le cache du service worker ?
async function inCache(url) {
  try {
    return typeof caches !== 'undefined' && !!(await caches.match(url, { ignoreSearch: true }));
  } catch (e) {
    return false;
  }
}

const preloadArtOn = () => !!(ART_DEV && OPT.art);

// images de l'interface du style artiste (vide en style cartoon : ses fonds sont déjà gardés par sw.js)
function preloadUi(filter) {
  if (!preloadArtOn()) return filter ? ['assets/ui/cadre.webp', 'assets/ui/dos.webp'] : [];
  return (ART_NEW.ui || []).filter(f => !filter || filter(f)).map(f => 'assets/art/ui/' + f);
}

// toutes les cartes du jeu (cartes de base et zombies), petites ou grandes
function preloadCards(big) {
  const out = [];
  for (const t of Z.KEYS) {
    if (Z.baseOf(t) !== t) continue;
    out.push(artUrl(t, big), popUrl(t, big));
  }
  for (const k in Z.ZT) out.push(zArt(k, big));
  return out.filter(Boolean);
}

// l'essentiel du lancement
function bootUrls() {
  // SPRDA : sprites qui n'existent qu'en style artiste
  const spr = [...Object.keys(SPRDC), ...(preloadArtOn() ? Object.keys(SPRDA) : [])].map(sprUrl);
  let deck = [];
  try {
    deck = (META.decks[META.slot] || Z.STARTER_DECK).map(t => artUrl(Z.baseOf(t)));
  } catch (e) {}
  return [...spr, ...preloadUi(f => /^cadre-/.test(f)), ...deck].filter(Boolean);
}

function bootBar(r) {
  const b = document.getElementById('bootBar');
  if (b) b.style.width = Math.round(r * 100) + '%';
}

function bootEnd() {
  if (PRELOAD.bootOver) return;
  PRELOAD.bootOver = true;
  const el = document.getElementById('boot');
  if (!el) return;
  bootBar(1);
  el.classList.add('out');
  setTimeout(() => el.remove(), 400);
  setTimeout(preloadBackground, 1500);
}

async function preloadBoot() {
  setTimeout(bootEnd, 12000); // jamais bloqué plus de 12 s
  try {
    await ART_READY;
    const urls = bootUrls();
    const total = urls.length + 1;
    let n = 0;
    const tick = () => bootBar(++n / total);
    const page = new Promise(res =>
      document.readyState === 'complete' ? res() : addEventListener('load', () => res(), { once: true }),
    ).then(tick);
    await Promise.all([page, ...urls.map(u => preloadImg(u).then(tick))]);
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  } catch (e) {
    console.warn(e);
  }
  bootEnd();
}

// les grandes images seulement sur une bonne connexion (pas d'économie de données, pas de 2G/3G)
function preloadBigOk() {
  const c = navigator.connection;
  return !c || (!c.saveData && (!c.effectiveType || c.effectiveType === '4g'));
}

// attend que le jeu soit à l'écran et pas en pleine nuit
function preloadIdle() {
  return new Promise(res => {
    const check = () => {
      let busy = false;
      try {
        busy = !!(S && S.busy);
      } catch (e) {}
      if (!document.hidden && !busy) res();
      else setTimeout(check, 2000);
    };
    check();
  });
}

async function preloadBackground() {
  try {
    const list = [...preloadCards(false), ...preloadUi()];
    if (preloadBigOk()) list.push(...preloadCards(true));
    const queue = [];
    for (const u of list) if (!PRELOAD.done.has(u) && !queue.includes(u)) queue.push(u);
    // 3 téléchargements à la fois
    const worker = async () => {
      while (queue.length) {
        await preloadIdle();
        const u = queue.shift();
        if (await inCache(u)) PRELOAD.done.add(u);
        else await preloadImg(u);
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  } catch (e) {
    console.warn(e);
  }
}

preloadBoot();
