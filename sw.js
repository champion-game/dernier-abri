/* Dernier Abri : jeu jouable sans internet (v139).
   - Code (page, scripts, styles) : réseau d'abord, copie gardée pour jouer hors ligne. Les mises à jour arrivent donc tout de suite.
   - Images, sons, polices : copie locale d'abord (chargement instantané), rafraîchie en arrière-plan.
   - version.txt : toujours le réseau (vérification de mise à jour). */
const CACHE='abri-1';
const CORE=['./','index.html','src/style.css','src/engine.js','src/audio.js','src/game.js','src/game-draw.js','src/game-ui.js','src/game-screens.js','src/game-menu.js','manifest.webmanifest',
 'assets/fonts/special-elite.woff2','assets/fonts/atkinson-400.woff2','assets/fonts/atkinson-700.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const put=(req,res)=>{if(res&&res.ok&&res.type==='basic'){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(req,c)).catch(()=>{})}return res};
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||r.headers.has('range'))return;
 if(u.pathname.endsWith('version.txt'))return;
 const code=r.mode==='navigate'||/\.(html|js|css|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
 if(code){e.respondWith(fetch(r).then(res=>put(r,res)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>{const net=fetch(r).then(res=>put(r,res)).catch(()=>m);if(m){e.waitUntil(net);return m}return net}));
});
