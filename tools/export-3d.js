// Exporte les personnages 3D en planches d'images vues du dessus, pour l'aperçu ?3d=1 du jeu.
// Usage : node tools/export-3d.js   (≈ 5 à 10 min dans le navigateur de test, sans carte graphique)
// Entrées : tools/3d/fabrique-3d.js (modèles et gestes), tools/3d/xbot.fbx (corps Mixamo), tools/3d/zombies-clips.json
// Sorties : assets/3d/planches/<personnage>-<geste>.webp et l'index assets/3d/planches.js (lu par src/game-3d.js)
const path = require('path'),
  fs = require('fs'),
  { execSync } = require('child_process');
let pw;
try {
  pw = require('playwright');
} catch (e) {
  pw = require(path.join(execSync('npm root -g').toString().trim(), 'playwright'));
}
const RACINE = path.join(__dirname, '..'),
  SORTIE = path.join(RACINE, 'assets/3d/planches');

(async () => {
  const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
  const b = await pw.chromium.launch(
    Object.assign(
      { args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] },
      exe ? { executablePath: exe } : {},
    ),
  );
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('Erreur dans la page :', e.message));
  p.on('console', m => {
    if (m.type() === 'log') console.log('  ' + m.text());
    else if (m.type() === 'warning' && !/GPU stall/.test(m.text()))
      console.log('Avertissement :', m.text().slice(0, 200));
  });
  await p.setContent('<html><body></body></html>');
  for (const s of ['lib/three.min.js', 'lib/fflate.min.js', 'lib/FBXLoader.js', 'fabrique-3d.js'])
    await p.addScriptTag({ content: fs.readFileSync(path.join(RACINE, 'tools/3d', s), 'utf8') });
  const base64 = fs.readFileSync(path.join(RACINE, 'tools/3d/xbot.fbx')).toString('base64'),
    json = JSON.parse(fs.readFileSync(path.join(RACINE, 'tools/3d/zombies-clips.json'), 'utf8'));
  console.log('Fabrication des planches…');
  const resultat = await p.evaluate(
    async ([base64, json]) => {
      const base = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
      const atlas = await window.fabriquerPlanches3d(THREE, base, json),
        sortie = {};
      for (const cle in atlas) {
        sortie[cle] = { echelle: atlas[cle].echelle, clips: {} };
        for (const nom in atlas[cle].clips) {
          const c = atlas[cle].clips[nom];
          sortie[cle].clips[nom] = {
            image: c.planche.toDataURL('image/webp', 0.9),
            taille: c.taille,
            n: c.n,
            duree: +c.duree.toFixed(3),
            boucle: c.boucle,
          };
        }
      }
      return sortie;
    },
    [base64, json],
  );
  await b.close();
  fs.rmSync(SORTIE, { recursive: true, force: true });
  fs.mkdirSync(SORTIE, { recursive: true });
  const index = {};
  let total = 0;
  for (const cle in resultat) {
    index[cle] = { echelle: resultat[cle].echelle, clips: {} };
    for (const nom in resultat[cle].clips) {
      const c = resultat[cle].clips[nom],
        fichier = `${cle}-${nom}.webp`,
        octets = Buffer.from(c.image.split(',')[1], 'base64');
      fs.writeFileSync(path.join(SORTIE, fichier), octets);
      total += octets.length;
      index[cle].clips[nom] = { fichier, taille: c.taille, n: c.n, duree: c.duree, boucle: c.boucle };
    }
  }
  fs.writeFileSync(
    path.join(RACINE, 'assets/3d/planches.js'),
    '// Généré par node tools/export-3d.js : planches des personnages 3D (aperçu ?3d=1), ne pas modifier à la main.\n' +
      'window.PLANCHES_3D = ' +
      JSON.stringify(index, null, 1) +
      ';\n',
  );
  console.log(
    `${Object.keys(index).length} personnages, ${(total / 1024).toFixed(0)} Ko de planches dans assets/3d/planches/`,
  );
})();
