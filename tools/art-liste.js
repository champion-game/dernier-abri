// Style artiste : refait assets/art/liste.json d'après les images présentes dans assets/art/<cards|sprites|relics|ui>/.
// Signale les fichiers dont le nom ne correspond à aucune image actuelle (ils ne remplaceraient rien).
// Usage : node tools/art-liste.js        (node tools/art-liste.js --check : échoue si la liste n'est pas à jour)
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..','assets'),ART=path.join(ROOT,'art');
const OLD={cards:'cards_cartoon',sprites:'sprites_cartoon',relics:'relics',ui:'ui'};
const IMG=/\.(webp|png|jpg|jpeg|svg)$/i;
function build(){const L={},warn=[];
 for(const d in OLD){const dir=path.join(ART,d);L[d]=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>IMG.test(f)).sort():[];
  const old=new Set(fs.readdirSync(path.join(ROOT,OLD[d])));
  L[d].forEach(f=>{if(!old.has(f))warn.push(`${d}/${f} : aucune image actuelle « assets/${OLD[d]}/${f} »`)})}
 return{L,warn}}
const{L,warn}=build(),file=path.join(ART,'liste.json'),txt=JSON.stringify(L,null,1)+'\n';
if(require.main===module){
 if(process.argv.includes('--check')){const cur=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';
  if(cur!==txt){console.error('assets/art/liste.json pas à jour : lancer node tools/art-liste.js');process.exit(1)}}
 else{fs.writeFileSync(file,txt);console.log('liste.json :',Object.entries(L).map(([d,l])=>d+' '+l.length).join(', '))}
 warn.forEach(w=>console.warn('Attention :',w))}
module.exports={build,txt};
