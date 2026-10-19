// Test du vrai jeu dans un navigateur (Chromium via Playwright), sur téléphone (390 × 844), ordinateur (1280 × 800) et téléphone tourné (844 × 390).
// Il ouvre tous les écrans, pose les cartes de la main, joue plusieurs nuits complètes avec les écrans de l'aube,
// recharge la partie sauvegardée, et vérifie : aucune erreur dans la console, aucun fichier manquant,
// pas de défilement horizontal, une image par seconde correcte. Captures d'écran dans tools/test-out/.
// Usage : node tools/test-browser.js   (NIGHTS=8 pour jouer plus de nuits)
const path=require('path'),fs=require('fs'),{execSync}=require('child_process');
let pw;try{pw=require('playwright')}catch(e){pw=require(path.join(execSync('npm root -g').toString().trim(),'playwright'))}
const ROOT=path.join(__dirname,'..'),OUT=path.join(__dirname,'test-out');fs.mkdirSync(OUT,{recursive:true});
const URL='file://'+path.join(ROOT,'index.html'),NIGHTS=+process.env.NIGHTS||5;
const exe=fs.existsSync('/opt/pw-browsers/chromium')?'/opt/pw-browsers/chromium':undefined;
const problems=[];let shots=0;

async function run(vp,label){
 const b=await pw.chromium.launch(exe?{executablePath:exe}:{});const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1});
 await ctx.addInitScript(()=>{try{if(!localStorage.getItem('abri-tuto'))localStorage.setItem('abri-tuto','5')}catch(e){}});
 const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push('erreur JS : '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console : '+m.text())});
 p.on('requestfailed',r=>errs.push('fichier manquant : '+r.url().replace('file://'+ROOT,'')));
 const shot=async n=>{await p.screenshot({path:path.join(OUT,`${label}-${n}.png`)});shots++};
 const overflow=async where=>{const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)problems.push(`${label} : défilement horizontal de ${o} px (${where})`)};
 const ov=()=>p.evaluate(()=>{const o=document.querySelector('#ov');if(!o||o.hidden)return'';const h=o.querySelector('h2');return h?h.textContent.trim():'(sans titre)'});
 const click=async sel=>{const e=await p.$(sel);if(!e)return false;await e.click({timeout:3000}).catch(()=>{});await p.waitForTimeout(150);return true};
 const step=async(name,fn)=>{try{await fn()}catch(e){problems.push(`${label} : ${name} a échoué (${e.message.split('\n')[0]})`)}};

 await p.goto(URL);await p.waitForTimeout(600);
 // écrans d'accueil
 await step('accueil',async()=>{await shot('01-accueil');await overflow('accueil')});
 await step('bestiaire',async()=>{await click('[data-a=deck]');await p.waitForTimeout(300);await shot('02-cartes');await overflow('cartes et zombies');await click('[data-a=title]')});
 await step('collection',async()=>{await click('[data-a=coll]');await p.waitForTimeout(300);await p.fill('[data-f=q]','tir');await p.waitForTimeout(150);
  const n=await p.$$eval('.citem-w',es=>es.filter(e=>!e.hidden).length);if(!n)problems.push(`${label} : la recherche « tir » ne trouve rien`);
  await p.selectOption('[data-f=sort]','cost');await p.waitForTimeout(200);await shot('03-collection');await overflow('collection');await click('[data-a=title]')});

 await step('options',async()=>{await click('[data-a=options]');await p.waitForTimeout(200);if(!/Options/.test(await ov()))problems.push(`${label} : l’écran d’options ne s’ouvre pas`);await shot('03b-options');await overflow('options');
  await p.evaluate(()=>{const r=document.querySelector('[data-o=sfx]');r.value=40;r.dispatchEvent(new Event('input',{bubbles:true}))});if(await p.evaluate(()=>OPT.sfx)!==.4)problems.push(`${label} : le volume ne s’enregistre pas`);await click('[data-a=optclose]')});
 // une partie
 await step('nouvelle partie',async()=>{await click('[data-a=new]');await click('[data-a=edit]');await shot('04-deck');await overflow('éditeur de deck');await click('[data-a=new]');await click('[data-a=start]');await p.waitForTimeout(400)});
 await step('tableau des combats',async()=>{await p.evaluate(()=>document.querySelectorAll('.hint').forEach(e=>e.remove()));await click('#mtb');
  const vis=await p.evaluate(()=>{const m=document.querySelector('#meter');return !!m&&!m.hidden&&m.getBoundingClientRect().height>40});
  if(!vis)problems.push(`${label} : le tableau des combats ne s’ouvre pas`);await click('[data-mt="t:dead"]');await shot('05c-details');await overflow('tableau des combats');
  await click('[data-mt="t:dmg"]');if(!vis)return;await click('#mtb');if(await p.evaluate(()=>!document.querySelector('#meter').hidden))problems.push(`${label} : le tableau des combats ne se ferme pas`)});
 await step('annuler une pose',async()=>{const st=()=>p.evaluate(()=>JSON.stringify([S.hand,G.energy,G.grid.map(u=>u&&u.t)]));const s0=await st();
  const t=await p.evaluate(()=>{for(let k=0;k<S.hand.length;k++){const t=S.hand[k];if(Z.U[t].instant||Z.U[t].react)continue;const cs=[...Array(81).keys()].filter(j=>Z.canPlace(G,t,j));if(cs.length&&Z.cost(t)<=G.energy){S.sel=k;tapCell(cs[0]);return t}}return null});
  if(!t)return;await p.evaluate(()=>document.querySelectorAll('.hint').forEach(e=>e.remove()));
  if(!(await click('[data-a=undo]')))problems.push(`${label} : pas de bouton Annuler après une pose`);else if(await st()!==s0)problems.push(`${label} : Annuler ne remet pas la main, l’énergie et le plateau comme avant`)});
 const box=await p.$eval('#map',e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width}});const cs=box.w/9;
 const at=i=>[box.x+(i%9+.5)*cs,box.y+(Math.floor(i/9)+.5)*cs];
 let reached=0;
 for(let n=1;n<=NIGHTS;n++){
  // jour : poser les cartes de la main tant qu'il y a de l'énergie (les réactions restent pour la nuit)
  await step(`jour ${n}`,async()=>{for(let k=0;k<10;k++){
    const pick=await p.evaluate(()=>{for(let i=0;i<S.hand.length;i++){const t=S.hand[i],D=Z.U[t];if(D.react)continue;if(Z.costOf(G,t)>G.energy)continue;
      const cells=D.onUnit?G.grid.map((u,j)=>j).filter(j=>Z.canPlace(G,t,j)):D.instant?[Z.C]:[...Array(81).keys()].filter(j=>Z.canPlace(G,t,j));
      if(cells.length)return{i,cell:cells[Math.floor(Math.random()*cells.length)]}}return null});
    if(!pick)break;await click(`.card[data-k="${pick.i}"]`);await p.mouse.click(...at(pick.cell));await p.waitForTimeout(120);
    if(await p.evaluate(()=>S.sel!==null&&S.sel<0))await p.evaluate(()=>{S.sel=null;render()})}
   if(n===1){await shot('05-jour');await click('#pDraw');await p.waitForTimeout(200);if(!/Pioche/.test(await ov()))problems.push(`${label} : la pioche ne s’ouvre pas`);await click('#ov [data-a=closeov]');
    await click('#pDisc');await p.waitForTimeout(200);if(!/Défausse/.test(await ov()))problems.push(`${label} : la défausse ne s’ouvre pas`);await click('#ov [data-a=closeov]')}await overflow('jour');
   // rappel d'une unité dans la réserve, puis remise en jeu gratuite
   if(n===2){const u=await p.evaluate(()=>G.grid.findIndex((v,j)=>Z.canRecall(G,j)));if(u>=0){await p.mouse.click(...at(u));await click('#info [data-a=recall]');
    if(await p.evaluate(()=>G.bench.length)!==1)problems.push(`${label} : le rappel d’une unité ne marche pas`);else{await shot('05b-reserve');await click('#pRes');
     const c=await p.evaluate(()=>[...Array(81).keys()].find(j=>Z.canPlaceBench(G,0,j)));if(c!=null){await p.mouse.click(...at(c));if(await p.evaluate(()=>G.bench.length))problems.push(`${label} : l’unité de la réserve ne se repose pas`)}}}}});
  // nuit en accéléré, avec une réaction si possible
  await step(`nuit ${n}`,async()=>{await p.evaluate(()=>{G.maxS=G.shelter=200});await click('#go');await p.evaluate(()=>{SPEED=16});
   let t=0;while(await p.evaluate(()=>S.busy)&&t<300){await p.waitForTimeout(200);t++;
    // nuit du Colosse : pause entre les 2 vagues, on relance
    if(await p.evaluate(()=>!!S.pause)){if(n===10)await shot('09-pause-colosse');await click('#go');await p.evaluate(()=>{SPEED=16})}
    if(t===8){const fps=await p.evaluate(()=>new Promise(r=>{let k=0;const s=performance.now();const f=()=>{k++;if(performance.now()-s<1000)requestAnimationFrame(f);else r(k)};requestAnimationFrame(f)}));if(fps<25)problems.push(`${label} : seulement ${fps} images/s pendant la nuit ${n}`)}
    if(t===3&&n===2)await shot('06-nuit')}
   if(t>=300)problems.push(`${label} : la nuit ${n} ne se termine pas`)});
  // aube : avancer dans les écrans en cliquant le premier choix
  let fell=false;
  await step(`aube ${n}`,async()=>{for(let w=0;w<20&&!(await ov());w++)await p.waitForTimeout(200);
   for(let k=0;k<15;k++){const h=await ov();if(!h)break;if(/tombé/i.test(h)){fell=true;break}
    if(k===0&&n===1)await shot('07-aube');await overflow('aube : '+h);
    const sel=['#ov [data-a=lvl]','#ov button.relic:not([disabled])','#ov button.pick:not([disabled])','#ov [data-a=evc]:not([disabled])','#ov .go:not([disabled])','#ov .skip:not([disabled])'];
    let done=false;for(const s of sel){if(await click(s)){done=true;break}}if(!done)break}
   const h=await ov();if(h&&!fell){await shot(`bloque-nuit${n}`);problems.push(`${label} : bloqué sur l’écran « ${h} » après la nuit ${n}`)}});
  if(fell){await shot('08-defaite');
   if(await click('[data-a=mdet]')){if(!(await p.$('#meterP .mt-rows, #meterP .mt-0')))problems.push(`${label} : les détails de la partie sont vides`);await shot('08b-details');await click('[data-a=mback]')}
   else problems.push(`${label} : pas de bouton « Détails de la partie » après la défaite`);break}
  const nn=await p.evaluate(()=>G.night);if(nn!==n+1)problems.push(`${label} : après la nuit ${n}, le jeu est au jour ${nn} (attendu ${n+1})`);
  reached=n;
 }
 // sauvegarde : recharger la page et continuer la partie
 await step('reprise de la sauvegarde',async()=>{const night=await p.evaluate(()=>G.night);await p.reload();await p.waitForTimeout(600);
  if(await click('[data-a=load]')){const n2=await p.evaluate(()=>G.night);if(n2!==night)problems.push(`${label} : la sauvegarde reprend à la nuit ${n2} au lieu de ${night}`)}});
 errs.forEach(e=>problems.push(`${label} : ${e}`));
 await b.close();return reached}

(async()=>{const r1=await run({width:390,height:844},'telephone'),r2=await run({width:1280,height:800},'ordinateur'),r3=await run({width:844,height:390},'paysage');
 console.log(`Navigateur : téléphone ${r1} nuit(s) jouée(s), ordinateur ${r2}, téléphone en largeur ${r3}, ${shots} captures dans tools/test-out/.`);
 if(problems.length){console.log([...new Set(problems)].slice(0,40).map(x=>'  ✗ '+x).join('\n'));process.exitCode=1}
 else console.log('  Aucun problème : pas d’erreur console, pas de fichier manquant, pas de défilement horizontal.')})();
