/* Barricard : jeu jouable sans internet (v149).
   - Code (page, scripts, styles) : réseau d'abord, copie gardée pour jouer hors ligne. Les mises à jour arrivent donc tout de suite.
   - Images, sons, polices : copie locale d'abord (chargement instantané), rafraîchie en arrière-plan.
   - version.txt : toujours le réseau (vérification de mise à jour). */
const CACHE = 'abri-4'; // v261 : nouvelle musique d'accueil (même nom de fichier)
const CORE = [
  './',
  'index.html',
  'src/style.css',
  'src/i18n.js',
  'src/lang-en.js',
  'src/engine.js',
  'src/audio.js',
  'src/art-liste.js',
  'src/game.js',
  'src/game-draw.js',
  'src/game-ui.js',
  'src/game-screens.js',
  'src/game-menu.js',
  'src/game-anim.js',
  'src/game-fiche.js',
  'src/game-fx2.js',
  'src/game-artx.js',
  'src/game-coll.js',
  'src/game-fx3.js',
  'src/game-fx5.js',
  'src/game-load.js',
  'manifest.webmanifest',
  'assets/fonts/special-elite.woff2',
  'assets/fonts/atkinson-400.woff2',
  'assets/fonts/atkinson-700.woff2',
  'assets/fonts/oswald-600.woff2',
  'assets/fonts/creepster.woff2',
  'assets/art/ui/accueil.webp',
  'assets/art/ui/accueil-portrait.webp',
  'assets/art/ui/fond.webp',
  'assets/art/ui/barricard.webp',
  'assets/art/ui/panneau-noir.webp',
  'assets/boot/logo.webp',
  'assets/boot/fond.webp',
  'assets/boot/fond-portrait.webp',
  'assets/art/ui/btn-rouge.webp',
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(c => c.addAll(CORE))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});
const put = (req, res) => {
  if (res && res.ok && res.type === 'basic') {
    const c = res.clone();
    caches
      .open(CACHE)
      .then(ca => ca.put(req, c))
      .catch(() => {});
  }
  return res;
};
self.addEventListener('fetch', e => {
  const r = e.request,
    u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || r.headers.has('range')) return;
  if (u.pathname.endsWith('version.txt')) return;
  const code =
    r.mode === 'navigate' || /\.(html|js|css|webmanifest|json)$/.test(u.pathname) || u.pathname.endsWith('/');
  if (code) {
    e.respondWith(
      fetch(r)
        .then(res => put(r, res))
        .catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('index.html'))),
    );
    return;
  }
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(m => {
      const net = fetch(r)
        .then(res => put(r, res))
        .catch(() => m);
      if (m) {
        e.waitUntil(net);
        return m;
      }
      return net;
    }),
  );
});
