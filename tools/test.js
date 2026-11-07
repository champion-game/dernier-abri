// Lance tous les tests : le moteur (rapide), puis le vrai jeu dans le navigateur (téléphone et ordinateur).
// Usage : node tools/test.js            (tout)
//         node tools/test.js moteur     (seulement le moteur, ~3 s)
// Variables : NIGHTS=… pour le nombre de nuits jouées (300 dans le moteur, 5 dans le navigateur par défaut).
const { spawnSync } = require('child_process'),
  path = require('path');
const only = process.argv[2];
let ko = 0;
// la carte du code (docs/CARTE_CODE.md) est régénérée à chaque test pour rester à jour
spawnSync(process.execPath, [path.join(__dirname, 'carte-code.js')], { stdio: 'inherit' });
const run = f => {
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { stdio: 'inherit', env: process.env });
  if (r.status) ko++;
};
run('test-engine.js');
if (only !== 'moteur') run('test-browser.js');
console.log(ko ? '\n✗ Des tests ont échoué.' : '\n✓ Tous les tests sont passés.');
process.exitCode = ko ? 1 : 0;
