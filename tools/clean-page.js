// Fabrique clean/index.html (version « Clean UI » à part) à partir de index.html.
// À relancer après chaque changement de index.html ou de numéro de version : node tools/clean-page.js
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
let h=fs.readFileSync(path.join(root,'index.html'),'utf8');
const v=(h.match(/\?v=(\d+)/)||[,'0'])[1];
h=h.replace('<html lang="fr">','<html lang="fr" class="clean">')
 .replace('<meta charset="utf-8">','<meta charset="utf-8">\n<base href="../">')
 .replace('<title>Barricard</title>','<title>Barricard (Clean UI)</title>')
 .replace(/(<link rel="stylesheet" href="src\/style\.css[^>]*>)/,`$1\n<link rel="stylesheet" href="clean/clean.css?v=${v}">`)
 .replace('</body>',`<script src="clean/clean.js?v=${v}"></script>\n</body>`);
h=h.replace('<!doctype html>','<!doctype html>\n<!-- Fichier fabriqué par tools/clean-page.js : ne pas modifier à la main -->');fs.writeFileSync(path.join(root,'clean','index.html'),h);
console.log('clean/index.html v'+v);
