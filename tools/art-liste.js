// Style artiste : refait assets/art/liste.json d'après les images présentes dans assets/art/<cards|sprites|relics|ui>/.
// Usage : node tools/art-liste.js        (node tools/art-liste.js --check : échoue si la liste n'est pas à jour)
const fs = require('fs'),
  path = require('path');
const ROOT = path.join(__dirname, '..', 'assets'),
  ART = path.join(ROOT, 'art');
const IMG = /\.(webp|png|jpg|jpeg|svg)$/i;
function build() {
  const L = {};
  for (const d of ['cards', 'sprites', 'relics', 'ui']) {
    const dir = path.join(ART, d);
    L[d] = fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter(f => IMG.test(f))
          .sort()
      : [];
  }
  return { L };
}
// v246 : la liste est aussi écrite dans src/art-liste.js (chargé avant game.js) pour être connue dès le lancement
const { L } = build(),
  file = path.join(ART, 'liste.json'),
  txt = JSON.stringify(L, null, 1) + '\n',
  jsFile = path.join(__dirname, '..', 'src', 'art-liste.js'),
  js =
    '// Généré par node tools/art-liste.js : images du style artiste présentes dans assets/art/ (ne pas modifier à la main)\n' +
    'const ART_LIST = ' +
    JSON.stringify(L) +
    ';\n';
if (require.main === module) {
  if (process.argv.includes('--check')) {
    const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '',
      curJs = fs.existsSync(jsFile) ? fs.readFileSync(jsFile, 'utf8') : '';
    if (cur !== txt || curJs !== js) {
      console.error('liste des images artiste pas à jour : lancer node tools/art-liste.js');
      process.exit(1);
    }
  } else {
    fs.writeFileSync(file, txt);
    fs.writeFileSync(jsFile, js);
    console.log(
      'liste.json et src/art-liste.js :',
      Object.entries(L)
        .map(([d, l]) => d + ' ' + l.length)
        .join(', '),
    );
  }
}
module.exports = { build, txt, js };
