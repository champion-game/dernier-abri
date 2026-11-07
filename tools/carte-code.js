// Génère docs/CARTE_CODE.md : où se trouve chaque fonction, quelles fonctions sont « enveloppées »
// (réécrites par un fichier chargé plus tard), les actions des boutons et les sections du CSS.
// Lancé automatiquement par tools/test.js, pour que la carte reste à jour.
// Usage : node tools/carte-code.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// fichiers JS dans l'ordre de chargement de index.html
const files = [...read('index.html').matchAll(/<script src="([^"?]+)/g)].map(m => m[1]);
const src = {};
for (const f of files) src[f] = read(f).split('\n');

const out = [];
const p = s => out.push(s);
const short = s => s.replace(/\s+/g, ' ').replace(/\*\/.*$/, '').trim().slice(0, 90);

// 1. définitions : « function nom( » en début de ligne (ou indentées dans le moteur)
const defs = {}; // nom -> [{f, l}]
for (const f of files) src[f].forEach((line, i) => {
  const re = f === 'src/engine.js' ? /^\s{0,4}(?:async )?function ([A-Za-z_$][\w$]*)\s*\(/ : /^(?:async )?function ([A-Za-z_$][\w$]*)\s*\(/;
  const m = line.match(re);
  if (m) (defs[m[1]] = defs[m[1]] || []).push({ f, l: i + 1 });
});

// 2. enveloppes : « nom=function », « nom=(…)=> » ou « nom=x=> » sur une fonction déjà définie
const wraps = {}; // nom -> [{f, l}]
for (const f of files) {
  if (f === 'src/engine.js') continue;
  src[f].forEach((line, i) => {
    for (const m of line.matchAll(/(?:^|[^\w$.])([A-Za-z_$][\w$]*)=(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g)) {
      const n = m[1];
      if (!defs[n] || defs[n][0].f === 'src/engine.js') continue; // le moteur est fermé (objet Z) : un même nom ailleurs est une autre variable
      if (/\b(const|let|var)\s*$/.test(line.slice(0, m.index + m[0].indexOf(n)))) continue; // variable locale du même nom
      const d = defs[n][0];
      if (d.f === f && d.l === i + 1) continue;
      (wraps[n] = wraps[n] || []).push({ f, l: i + 1 });
    }
  });
}
const rel = x => `${path.basename(x.f)}:${x.l}`;

p('# Carte du code (générée)');
p('');
p('Fichier généré par `node tools/carte-code.js` (lancé aussi par `node tools/test.js`). **Ne pas modifier à la main.**');
p('Guide écrit à la main : `docs/CODE.md`. Les numéros de ligne permettent `sed -n \'N,Mp\' fichier | cut -c1-300`.');
p('');
p('## Ordre de chargement (index.html)');
p('');
p(files.map((f, i) => `${i + 1}. \`${f}\` (${src[f].length} lignes)`).join('\n'));
p('');
p('## Fonctions enveloppées');
p('');
p('Un fichier chargé plus tard remplace la fonction par une version qui appelle l’ancienne (`const r0=render;render=function(){r0.apply(this,arguments);…}`).');
p('Pour modifier ou déboguer une de ces fonctions, **regarder toute la chaîne**, dans l’ordre (la dernière enveloppe s’exécute en premier).');
p('');
p('| Fonction | Définie dans | Enveloppée ensuite par (ordre de chargement) |');
p('|---|---|---|');
const order = f => files.indexOf(f);
for (const n of Object.keys(wraps).sort((a, b) => wraps[b].length - wraps[a].length || a.localeCompare(b))) {
  const w = wraps[n].sort((a, b) => order(a.f) - order(b.f) || a.l - b.l);
  p(`| \`${n}\` | ${rel(defs[n][0])} | ${w.map(rel).join(', ')} |`);
}
p('');

// 3. actions des boutons (data-a="…" → ACT.nom)
const scr = 'src/game-screens.js';
const a0 = src[scr].findIndex(l => /^const ACT=\{/.test(l));
const acts = [];
if (a0 >= 0) for (let i = a0 + 1; i < src[scr].length; i++) {
  const l = src[scr][i];
  if (/^\};?/.test(l)) break;
  const m = l.match(/^ ([A-Za-z_$][\w$]*):/);
  if (m) acts.push(`${m[1]}:${i + 1}`);
}
const extra = [];
for (const f of files) src[f].forEach((l, i) => { for (const m of l.matchAll(/ACT\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) extra.push(`${m[1]} (${path.basename(f)}:${i + 1})`) });
p('## Actions des boutons');
p('');
p('Un bouton `data-a="nom"` appelle `ACT.nom` (objet `ACT` de `game-screens.js`, ligne ' + (a0 + 1) + ').');
p('');
p(acts.join(' · '));
if (extra.length) { p(''); p('Ajoutées ou remplacées ailleurs : ' + extra.join(' · ')); }
p('');

// 4. par fichier : sections et fonctions
p('## Fichier par fichier');
p('');
p('Sections (commentaires `/* ---------- … */`, `// ---`, `// ===`) puis fonctions définies, avec leur ligne.');
for (const f of files) {
  p('');
  p(`### ${f}`);
  p('');
  const lines = src[f];
  const head = short(lines[0].replace(/^\s*(\/\/|\/\*)\s?/, ''));
  if (head) p(`> ${head}`);
  p('');
  const secs = [];
  lines.forEach((l, i) => {
    const m = l.match(/^\s*(?:\/\*\s*-{3,}|\/\*\s*={3,}|\/\/\s*-{3,}|\/\/\s*={3,})\s*(.*)/);
    if (m && i > 0) secs.push({ l: i + 1, t: short(m[1].replace(/[-=]{3,}.*$/, '')) });
  });
  const fns = [];
  for (const n in defs) for (const d of defs[n]) if (d.f === f) fns.push({ n, l: d.l });
  fns.sort((a, b) => a.l - b.l);
  if (!secs.length) { p(fns.map(x => `${x.n}:${x.l}`).join(' ') || '(aucune fonction nommée)'); continue; }
  const bounds = [{ l: 1, t: '(début)' }, ...secs];
  bounds.forEach((s, k) => {
    const end = k + 1 < bounds.length ? bounds[k + 1].l : Infinity;
    const in_ = fns.filter(x => x.l >= s.l && x.l < end);
    if (!in_.length && k === 0) return;
    p(`- **${s.l}** ${s.t}${in_.length ? ' : ' + in_.map(x => `${x.n}:${x.l}`).join(' ') : ''}`);
  });
}
p('');

// 5. CSS : sections
const css = read('src/style.css').split('\n');
p('## src/style.css');
p('');
p(`${css.length} lignes. Les règles s’empilent par version : **à sélecteur égal, la dernière l’emporte**. Le style artiste est sous \`html.artx\` (${css.filter(l => l.includes('html.artx')).length} lignes). Chercher un sélecteur avec \`grep -n\` plutôt que par section.`);
p('');
css.forEach((l, i) => {
  const m = l.match(/^\/\*\s*(.*)/);
  if (m) p(`- ${i + 1} ${short(m[1])}`);
});
p('');

fs.writeFileSync(path.join(ROOT, 'docs/CARTE_CODE.md'), out.join('\n'));
console.log(`docs/CARTE_CODE.md : ${Object.keys(defs).length} fonctions, ${Object.keys(wraps).length} enveloppées, ${acts.length} actions.`);
