// Tests du moteur (Node, sans navigateur) : intégrité des données, pose de chaque carte, règles clés,
// et des centaines de nuits aléatoires qui ne doivent jamais planter ni produire de valeurs absurdes.
// Usage : node tools/test-engine.js   (code de sortie 1 si un test échoue)
const path=require('path'),fs=require('fs');
const Z=require(path.join(__dirname,'../src/engine.js'));
const ROOT=path.join(__dirname,'..');
let pass=0,fail=0;const fails=[];
function check(name,fn){try{const r=fn();if(r===false)throw new Error('faux');pass++}catch(e){fail++;fails.push(name+' : '+e.message)}}
const eq=(a,b,m)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw new Error((m||'')+` attendu ${JSON.stringify(b)}, obtenu ${JSON.stringify(a)}`)};
const ok=(c,m)=>{if(!c)throw new Error(m||'condition fausse')};
// petit générateur pseudo-aléatoire reproductible
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%1e9)/1e9}}
const fin=x=>typeof x==='number'&&Number.isFinite(x);
const KEYS=Object.keys(Z.U),PLAY=KEYS.filter(t=>!Z.U[t].evo);
const fresh=()=>{const st=Z.newState('surv','bois',rng(7));st.grid.fill(null);st.energy=99;return st};
const freeCells=st=>[...Array(Z.N*Z.N).keys()].filter(i=>!st.grid[i]&&!Z.isEdge(i)&&i!==Z.C);

/* ---------- 1. intégrité des données ---------- */
for(const t of KEYS){const D=Z.U[t];
 check(`carte ${t} : nom, type et texte`,()=>ok(D.n&&D.cat&&D.d,'champ manquant'));
 if(!D.evo)check(`carte ${t} : coût entre 0 et 3`,()=>{const c=Z.cost(t);ok(fin(c)&&c>=0&&c<=3,'coût '+c)});
 if(D.block)check(`carte ${t} : PV positifs`,()=>ok(fin(D.hp)&&D.hp>0,'PV '+D.hp));
 if(D.dmg!=null)check(`carte ${t} : dégâts et portée valides`,()=>ok(fin(D.dmg)&&D.dmg>=0&&(D.rng==null||D.rng>=1),'dmg '+D.dmg+' rng '+D.rng));
 check(`carte ${t} : illustration présente`,()=>ok(fs.existsSync(path.join(ROOT,'assets/cards_cartoon',t+'.webp')),'assets/cards_cartoon/'+t+'.webp manquant'));
}
for(const k of Object.keys(Z.ZT)){const T=Z.ZT[k];check(`zombie ${k} : stats valides`,()=>ok(T.n&&fin(T.hp)&&T.hp>0&&fin(T.dmg)&&fin(T.spd)&&T.spd>=1))}
for(const f of Object.keys(Z.FAM))check(`faction ${f} : cartes existantes, 2 paliers`,()=>{Z.FAM[f].cards.forEach(t=>ok(Z.U[t],t+' inconnue'));eq(Z.FAM[f].lv.length,2);eq(Z.FAM[f].d.length,2)});
for(const k of Z.EVO_KEYS)check(`évolution ${k} : recette valide`,()=>Z.EVO[k].forEach(t=>ok(Z.U[t],t+' inconnue')));
check('évolution : nouvelle carte, les 2 cartes de la recette repartent en défausse',()=>{const st=fresh();Z.place(st,'cop',2*9+3,rng(1));Z.place(st,'dog',2*9+4,rng(1));const u=st.grid.find(v=>v&&v.t==='k9squad');ok(u,'pas d’évolution');eq([...u.fbk].sort(),['cop','dog']);eq(u.src,[])});
check('deck de départ valide',()=>eq(Z.deckError(Z.STARTER_DECK,Z.STARTER_CARDS),''));
check('cartes offertes : 0/1/2/3 selon les nuits',()=>eq([4,5,9,10,19,20,30].map(Z.giftCount),[0,1,1,2,2,3,3]));
check('cartes offertes : 3 cartes achetables, distinctes, pas encore débloquées',()=>{for(let i=0;i<50;i++){const o=Z.giftOffer(Z.STARTER_CARDS,rng(i+1));eq(o.length,3);ok(new Set(o).size===3,'doublon');
 for(const k of o){ok(!Z.STARTER_CARDS.includes(k),k+' déjà débloquée');ok(Z.U[k].vic==null,k+' carte de victoire');ok(Z.CARD_PRICE[Z.RAR[k]],k+' sans prix')}}});
check('cartes offertes : moins de 3 quand presque tout est débloqué',()=>{const all=Z.KEYS.filter(k=>Z.U[k].vic==null&&Z.CARD_PRICE[Z.RAR[k]]);eq(Z.giftOffer(all.slice(1),rng(3)),[all[0]]);eq(Z.giftOffer(all,rng(3)),[])});
check('démo : 2 personnages, 2 lieux, ni épique, ni légendaire, ni chef (offertes, boutique, collection)',()=>{Z.setDemo(1);try{
 const all=Z.KEYS.filter(k=>Z.U[k].vic==null),u=Z.unlocks({best:99,total:99,cards:all});
 eq(u.chars,['surv','cop']);eq(u.places,['bois','ferme']);ok(u.pool.length>20,'collection vide');
 const bad=k=>['epic','leg'].includes(Z.RAR[k])||Z.U[k].chief;ok(!u.pool.some(bad),'carte interdite dans la collection');
 for(let i=0;i<30;i++){ok(!Z.giftOffer(Z.STARTER_CARDS,rng(i+1)).some(bad),'carte interdite offerte');ok(!Z.storeOffer(fresh(),[],rng(i+1)).some(o=>bad(o.t||o)),'carte interdite en boutique')}
 eq(Z.DEMO_N,10)}finally{Z.setDemo(0)}ok(Z.unlocks({best:99,total:99}).chars.length===4,'démo restée active')});
check('les 4 routes sont au bord, hors forêt',()=>Z.ROADS.forEach(i=>ok(Z.isEdge(i)&&!Z.isForest(i))));
check('reliques : 22, dont 6 de victoire, tirées seulement si débloquées',()=>{eq(Object.keys(Z.RELICS).length,22);eq(Z.VICTORY_RELICS.length,6);const st=fresh();for(let k=0;k<40;k++)Z.relicChoices(st,rng(k),5).forEach(r=>ok(Z.RELICS[r].lock==null,r+' verrouillée'));st.relicPool=['serum'];ok([...Array(60).keys()].some(k=>Z.relicChoices(st,rng(k),3).includes('serum')))});
check('reliques : effets (insigne, plan, recettes, pacte, sifflet, coffre, cartouches)',()=>{const st=fresh();const c0=Z.unitCap(st);Z.addRelic(st,'insigne');eq(Z.unitCap(st),c0+1);
 const m0=Z.maxS(st);Z.addRelic(st,'plan');eq(Z.maxS(st),m0+3);
 const s2=fresh();Z.addRelic(s2,'recettes');[2*9+2,2*9+4].forEach(i=>Z.place(s2,'gun',i,rng(1)));eq(s2.grid.filter(Boolean).length,1);eq(s2.grid.find(Boolean).gold,1);
 const s3=fresh();Z.addRelic(s3,'pacte');Z.newDay(s3,rng(1));eq(s3.energy,Z.ENERGY+1);const sT=fresh();sT.test=1;Z.newDay(sT,rng(1));eq(sT.energy,99);
 const s4=fresh();Z.addRelic(s4,'sifflet');eq(Z.stat(s4,'dog').dmg,Z.U.dog.dmg+1);
 const s5=fresh();Z.addRelic(s5,'coffre');eq(Z.storeOffer(s5,[],rng(2)).length,Z.STORE_N+1);
 const s6=fresh();eq(Z.ammoMax(s6),2);Z.addRelic(s6,'cartouches');eq(Z.ammoMax(s6),3)});
check('chaque type de nuit a un nom, un effet et une phrase courte',()=>Z.EVENTS.forEach(e=>ok(e.n&&e.d&&e.p&&e.p.length<=45)));
check('Menace : 10 niveaux décrits, règles de départ',()=>{eq(Z.MENACES.length,11);for(let k=1;k<=10;k++)ok(Z.MENACES[k].n&&Z.MENACES[k].d);
 const a=Z.applyMenace(Z.newState('surv','bois',rng(1)),0,rng(1));eq(a.energy,Z.ENERGY);eq(a.muts.length,0);
 const b=Z.applyMenace(Z.newState('surv','bois',rng(1)),10,rng(1));eq(b.energy,Z.ENERGY-1);eq(b.muts.length,1);eq(b.maxS,Z.newState('surv','bois',rng(1)).maxS-3)});
check('Menace : PV, répit, nuits rouges, Colosse, frénésie',()=>{const s0=fresh(),s1=fresh();s1.menace=10;
 s0.night=s1.night=11;ok(Z.respite(11,s0));ok(!Z.respite(11,s1));
 s0.night=s1.night=15;const w0=Z.waveList(s0),w1=Z.waveList(s1);ok(w1.walk>w0.walk,'nuit rouge');
 s0.night=s1.night=10;eq(Z.waveList(s1).boss,Z.waveList(s0).boss+1);
 ok(Math.abs(Z.hpMult(4,s1)-1.2)<1e-9);eq(Z.hpMult(4,s0),1);
 const z0=Z.spawn?null:null;eq(Z.killScrap(s1,false)+Z.killScrap(s1,false),1);eq(Z.killScrap(s0,false),1);eq(Z.killScrap(s1,true),15)});
check('au moins 25 événements d’aube, chacun avec 2 choix qui marchent',()=>{const ks=Object.keys(Z.DAWN);ok(ks.length>=25,'seulement '+ks.length);ks.forEach(k=>Z.DAWN[k].ch.forEach((c,i)=>{for(let s=1;s<=6;s++){const st=fresh();st.scrap=30;Z.place(st,'gun',2*9+4,rng(1),true);Z.place(st,'bar',2*9+5,rng(1),true);const r=Z.resolveDawn(st,k,i,rng(s),['gun','bar','snp']);ok(r&&typeof r.txt==='string'&&r.txt.length,k+' '+i+' sans texte');ok(st.scrap>=0&&st.shelter>=1&&isFinite(st.shelter),k+' '+i+' valeurs');(r.cards||[]).forEach(t=>ok(Z.U[t],k+' carte inconnue '+t))}}))});
check('événements d’aube : rares, espacés de 3 nuits, sans répétition',()=>{const st=fresh();const r=rng(7);let n=0,last=-99;const seen=[];for(let night=2;night<400;night++){st.night=night;const e=Z.dawnEvent(st,r);if(e){n++;ok(night-last>=3,'trop rapprochés');last=night;seen.push(e)}}
 const ks=Object.keys(Z.DAWN).length;ok(n>20&&n<90,'fréquence '+n+' sur 398 aubes');eq(new Set(seen.slice(0,Math.min(ks,seen.length))).size,Math.min(ks,seen.length),'répétition avant d’avoir tout vu')});
check('chaque illustration de assets/cards_cartoon est déclarée dans CART_FILES (game.js)',()=>{const m=fs.readFileSync(path.join(ROOT,'src/game.js'),'utf8').match(/const CART_FILES=\(([\s\S]*?)\)\.split/);ok(m,'CART_FILES introuvable');const list=m[1].replace(/['+\s]+/g,' ').trim().split(' ');const miss=fs.readdirSync(path.join(ROOT,'assets/cards_cartoon')).map(f=>f.replace(/\.webp$/,'')).filter(f=>!f.endsWith('_pop')&&!f.startsWith('z_')&&Z.U[f]&&!list.includes(f));eq(miss,[])});

/* ---------- 2. pose de chaque carte ---------- */
for(const t of PLAY){const D=Z.U[t];if(D.react)continue;
 check(`pose de ${t}`,()=>{const st=fresh();st.grid[2*9+4]={t:'gun',hp:1,gold:D.gold?1:0};
  const i=D.onUnit?2*9+4:D.instant?Z.C:freeCells(st).find(j=>Z.canPlace(st,t,j));ok(i!=null,'aucune case valide');
  ok(Z.canPlace(st,t,i),'canPlace refuse');const e0=st.energy;Z.place(st,t,i,rng(3));
  ok(t==='coffee'||t==='v_heli'||st.energy<=e0,'énergie augmentée');if(!D.instant){const u=st.grid[i];ok(u,'rien sur la case');if(D.block)ok(fin(u.hp)&&u.hp>0,'PV '+u.hp)}})}
for(const t of PLAY.filter(t=>Z.U[t].react))
 check(`réaction ${t}`,()=>{const st=fresh();st.grid[3*9+4]={t:'gun',hp:1};Z.startNight(st,rng(5));for(let k=0;k<6;k++)Z.step(st);
  const i=Z.U[t].react==='unit'?3*9+4:2*9+4;if(!Z.canReact(st,t,i))return;Z.react(st,t,i);st.z.forEach(z=>ok(fin(z.hp),'PV zombie '+z.hp))});

/* ---------- 3. règles clés ---------- */
check('murs reliés : +1 PV par voisin (8, 9, 8)',()=>{const st=fresh();[3,4,5].forEach(c=>Z.place(st,'bar',9+c,rng(1),true));eq([3,4,5].map(c=>st.grid[9+c].hp),[8,9,8])});
check('carte à tracer : 4 cases puis plus rien',()=>{const st=fresh();Z.placeLine(st,'bar',[10,11,12,13],rng(1));eq(Z.charges(st,'bar',true),0)});
check('pneus : 3 cases par carte',()=>eq(Z.chargesOf('tire'),3));
check('niveaux : 20, 45, 75, 110',()=>eq([1,2,3,4].map(Z.lvKills),[20,45,75,110]));
check('mutations plafonnées (Carapace 3, Pas pressés 2)',()=>{const st=fresh();const r=rng(11);for(let k=0;k<200;k++)Z.mutate(st,r);ok(Z.mc(st,'carapace')<=3&&Z.mc(st,'frenesie')<=2)});
check('PV zombies : par paliers réguliers, pas d’explosion',()=>{const a=Z.hpMult(20)-Z.hpMult(10),b=Z.hpMult(100)-Z.hpMult(90);ok(Math.abs(a-b)<1e-9,'croissance non linéaire')});
// tutoriel guidé (v164) : la disposition demandée au joueur doit marcher (presque) à tous les coups
check('tutoriel : nuits 1 à 4 à horde fixe par les 4 routes, sans événement ; nuit 5 normale',()=>{const st=Z.newState('surv','bois',rng(3));st.tuto=1;
 for(let n=1;n<=4;n++){st.night=n;Z.newDay(st,rng(n));st.night=n;eq(st.event.id,'calme');Z.startNight(st,rng(n));const w=Z.TUTO_W[n-1];eq(st.pending.length,Object.values(w).reduce((a,b)=>a+b,0))}
 st.night=5;Z.startNight(st,rng(5));const n5=st.pending.length;st.tuto=0;Z.startNight(st,rng(5));eq(n5,st.pending.length)});
check('tutoriel : Bûcheron blessé la nuit 1, escouade au jour 4, la maison tient',()=>{let lost=0,deaths=0;for(let sd=1;sd<=40;sd++){const R=rng(sd),st=Z.newState('surv','bois',R);st.tuto=1;
 const P=(t,i)=>Z.place(st,t,i,R,true),M=(a,b)=>Z.move(st,a,b),run=()=>{Z.startNight(st,R);for(let k=0;k<3000&&!Z.step(st).done;k++);Z.endNight(st);Z.newDay(st,R)};
 P('axe',31);[39,41,49,22].forEach(i=>P('bar',i));run();const ax=st.grid[31];ok(ax&&ax.t==='axe'&&ax.hp<Z.maxHp(st,ax),'Bûcheron blessé (graine '+sd+')');ok(st.shelter===Z.maxS(st),'maison intacte');
 P('kit',31);ok(M(31,30)&&M(22,32),'déplacements jour 2');P('cop',31);run();
 if(!M(31,22)){deaths++;continue}P('gear',22);P('gun',31);[13,37,43,67].forEach(i=>P('wire',i));run();
 if(!M(32,23)||!M(31,32)){deaths++;continue}P('med',31);if(![22,30,31,32].every(i=>st.grid[i]&&Z.squad(st,i)))deaths++;run();
 run();if(st.shelter<=0)lost++}
 ok(deaths<=3,deaths+' parties où une unité du tutoriel est tombée');ok(lost<=3,lost+' nuits rouges perdues sur 40')});
check('curée : les Tanks l’ignorent (v132)',()=>{const st=fresh();st.night=3;const T=6*9+4;Z.place(st,'v_apc',T,rng(1),true);Z.startNight(st,rng(1));st.pending=[];
 st.z=[7*9+3,7*9+4,7*9+5].map((p,i)=>({id:i+1,k:'walk',pos:p,hp:50,max:50,cd:0,style:0}));const u=st.grid[T],h0=u.hp;Z.step(st);ok(h0-u.hp<=3,'perte '+(h0-u.hp))});
check('plafond de l’Agent anti-émeute : jamais plus de 2 PV par coup, même avec les bonus (v133)',()=>{const d0=Z.ZT.walk.dmg;try{Z.ZT.walk.dmg=6;const st=fresh();st.night=3;const T=6*9+4;Z.place(st,'riot',T,rng(1),true);Z.startNight(st,rng(1));st.pending=[];
 st.z=[{id:1,k:'walk',pos:7*9+4,hp:50,max:50,cd:0,style:0}];const u=st.grid[T],h0=u.hp;Z.step(st);ok(h0-u.hp<=2,'perte '+(h0-u.hp))}finally{Z.ZT.walk.dmg=d0}});
check('mode test : progression simulée (reliques, mutation, niveaux)',()=>{const st=fresh();eq(Z.testProgress(st,15,rng(3)),2);eq(st.relics.length,2);eq(st.muts.length,1);eq(st.testLv,2);Z.place(st,'gun',5*9+4,rng(2));const u=st.grid[5*9+4];eq((u.lvA||0)+(u.lvD||0),2);eq(Z.lvPending(u),0)});
// dégâts infligés en 20 tours à un zombie increvable placé en (7,4) ; unité en P, tank éventuel en (6,4)
function dps20(k,P,tank,lv){const st=fresh();st.night=3;st.testLv=lv||0;if(k)Z.place(st,k,P,rng(1),true);if(tank)Z.place(st,'v_apc',6*9+4,rng(1),true);Z.startNight(st,rng(1));st.pending=[];
 const z={id:1,k:'walk',pos:7*9+4,hp:1e6,max:1e6,cd:99,style:0};st.z=[z];for(let t=0;t<20;t++){z.cd=99;z.pos=7*9+4;Z.step(st)}return 1e6-z.hp}
check('tir de soutien : un DPS fait +1 sur un zombie collé à un Tank (v136)',()=>{const T=dps20(null,0,1);eq(dps20('gun',5*9+4,0),40);eq(dps20('gun',5*9+4,1)-T,60)});
check('tirs lents : bonus fixes multipliés par l’intervalle (v136)',()=>{eq(dps20('snp',5*9+4,0,2),10*(5+2))});
check('tanks : 1 dégât de base (v136)',()=>{['cop','monk','riot','amb','handler','v_apc','saint','chief_farm'].forEach(k=>eq(Z.U[k].dmg,1));eq(Z.U.pitch.dmg,2)});
check('nuit rouge : +15 % de zombies sur le total (v132)',()=>{const st=fresh(),sum=w=>Z.ZK.filter(k=>!Z.ZT[k].boss).reduce((a,k)=>a+w[k],0);st.night=15;const a=sum(Z.waveList(st));const b=Z.ZK.filter(k=>!Z.ZT[k].boss).reduce((x,k)=>x+Z.waveCount(k,15),0);eq(a,b+Math.round(b*Z.PRESSURE))});
check('nuit de pression : plus de zombies que la nuit d’avant',()=>{const st=fresh();st.night=15;const a=Z.waveList(st).walk;st.night=14;ok(a>Z.waveList(st).walk)});
check('Communauté palier 2 : 1re carte moins chère une seule fois',()=>{const st=fresh();st.energy=10;['vigile','teacher','market','carp','lead','monk'].forEach((t,k)=>st.grid[2*9+1+k]={t,hp:3});
 const c1=Z.costOf(st,'gun');Z.place(st,'gun',6*9+4,rng(2));ok(Z.costOf(st,'gun')===c1+1,'remise appliquée deux fois')});

check('limite de 5 unités, murs et pièges illimités',()=>{const st=fresh();['gun','axe','med','snp','dog'].forEach((t,k)=>Z.place(st,t,2*9+2+k,rng(1)));
 eq(Z.unitCount(st),5);ok(!Z.canPlace(st,'cop',6*9+4),'6ᵉ unité acceptée');ok(Z.canPlace(st,'bar',6*9+4),'mur refusé');ok(Z.canPlace(st,'trap',6*9+4),'piège refusé')});
check('limite : +1 toutes les 10 nuits',()=>{const st=fresh();st.night=9;eq(Z.unitCap(st),5);st.night=10;eq(Z.unitCap(st),6);st.night=25;eq(Z.unitCap(st),7)});
check('limite : une pose qui fusionne reste permise',()=>{const st=fresh();['gun','gun','axe','med','snp'].forEach((t,k)=>Z.place(st,t,2*9+1+k*2,rng(1)));
 ok(Z.canPlace(st,'gun',6*9+4),'fusion refusée');Z.place(st,'gun',6*9+4,rng(1));eq(Z.unitCount(st),4)});
check('fusion : nouvelle carte ★, les 3 cartes qui la composent repartent en défausse',()=>{const st=fresh();[2*9+2,2*9+4,6*9+4].forEach(i=>Z.place(st,'gun',i,rng(1)));const us=st.grid.filter(Boolean);eq(us.length,1);const u=us[0];eq(u.gold,1);eq(u.fbk,['gun']);eq(u.src,[]);[2*9+2,2*9+4,6*9+5].forEach(i=>{Z.place(st,'gun',i,rng(1))});const v=st.grid.filter(u=>u&&u.gold===1).length;ok(v>=1)});
check('rappel : l’unité garde tout et se repose gratuitement',()=>{const st=fresh();Z.place(st,'gun',2*9+4,rng(1));const u=st.grid[2*9+4];u.kills=30;u.lvA=1;u.gold=1;
 ok(Z.recall(st,2*9+4));eq(Z.unitCount(st),0);eq(st.bench.length,1);const e=st.energy;ok(Z.placeBench(st,0,6*9+4));const v=st.grid[6*9+4];
 ok(v===u&&v.kills===30&&v.lvA===1&&v.gold===1,'unité modifiée');eq(st.energy,e);eq(st.bench.length,0)});
check('rappel : les murs ne se rappellent pas',()=>{const st=fresh();Z.place(st,'bar',2*9+4,rng(1),true);ok(!Z.canRecall(st,2*9+4))});
check('déplacement libre, plusieurs fois par jour, murs compris',()=>{const st=fresh();Z.place(st,'gun',2*9+4,rng(1));Z.place(st,'bar',3*9+3,rng(1),true);
 ok(Z.move(st,2*9+4,2*9+5));ok(Z.move(st,2*9+5,2*9+6));ok(Z.move(st,3*9+3,6*9+3),'mur non déplacé')});
check('déplacement à la limite d’unités permis',()=>{const st=fresh();['gun','axe','med','snp','dog'].forEach((t,k)=>Z.place(st,t,2*9+2+k,rng(1)));ok(Z.move(st,2*9+2,6*9+2))});
check('mur déplacé : bonus de liaison recalculé',()=>{const st=fresh();[3,4].forEach(c=>Z.place(st,'bar',9+c,rng(1),true));eq(st.grid[13].hp,8);Z.move(st,13,6*9+6);eq(st.grid[6*9+6].hp,7);eq(st.grid[12].hp,7)});
check('factions : paliers à 2 et 5 survivants ; constructions et machines ne comptent pas',()=>{const st=fresh();eq(Z.FAM.mil.lv,[2,5]);
 st.grid[10]={t:'mine',hp:1};st.grid[11]={t:'sentry',hp:3};st.grid[12]={t:'snp',hp:3};eq(Z.famLevels(st).mil,0);st.grid[13]={t:'mg',hp:3};eq(Z.famLevels(st).mil,1);
 st.grid[14]={t:'sht',hp:3};st.grid[15]={t:'snp',hp:3};eq(Z.famLevels(st).mil,1);st.grid[16]={t:'mg',hp:3};eq(Z.famLevels(st).mil,2)});
check('Chef : compte pour 2 survivants',()=>{const st=fresh();st.grid[10]={t:'chief_mil',hp:5};eq(Z.famLevels(st).mil,1)});
check('équipe complète : +2 PV',()=>{const st=fresh();['snp','mg','sht','snp'].forEach((t,k)=>st.grid[10+k]={t,hp:3});const u={t:'snp',hp:3};const a=Z.maxHp(st,u);st.grid[20]=u;eq(Z.maxHp(st,u),a+2)});
check('frénésie : +10 % dès la nuit 5 puis +10 % par nuit, sur les PV seulement (v131) ; curée +2 au plus',()=>{const sF=fresh();sF.night=20;eq(Z.zhit(sF,{k:'walk'}),Z.ZT.walk.dmg);eq(Z.hpMult(4),1);ok(Math.abs(Z.hpMult(5)-1.1)<1e-9);ok(Math.abs(Z.hpMult(15)-2.1)<1e-9);ok(Math.abs(Z.frenzyMult({night:10})-1.6)<1e-9);eq(Z.dmgBonus(30),0);eq(Z.CUREE_MAX,2)});
check('nuit de répit : 30 % de zombies en moins après un Colosse',()=>{const st=fresh();st.night=11;const a=Z.waveList(st).walk;st.night=12;ok(a<Z.waveList(st).walk,'pas de répit')});
check('horde : croissance logarithmique (ralentit)',()=>{const g=(a,b)=>Z.waveCount('walk',b)-Z.waveCount('walk',a);ok(g(20,30)>=g(50,60),'croissance qui accélère');ok(Z.waveCount('walk',60)<20,'trop de zombies')});
check('mutation = affixe : une seule à la fois, qui change',()=>{const st=fresh();const r=rng(4);const a=Z.mutate(st,r),b=Z.mutate(st,r);eq(st.muts.length,1);ok(a!==b)});
check('convalescence : 1ʳᵉ chute = réserve blessée 3 nuits, 2ᵉ chute = mort',()=>{const st=fresh();st.night=10;Z.place(st,'gun',2*9+4,rng(1));const u=st.grid[2*9+4];u.lvA=2;u.gold=1;
 Z.startNight(st,rng(1));st.pending=[];st.z=[];st.putrid=0;u.hp=-1;st.muts=['putride'];
 st.z=[{id:1,k:'walk',pos:3*9+4,hp:0,max:5,cd:9,style:0}];Z.step(st);
 ok(!st.grid[2*9+4],'toujours sur la carte');eq(st.bench.length,1);ok(st.bench[0]===u&&u.gold===1&&u.lvA===2,'unité modifiée');ok(!Z.canPlaceBench(st,0,6*9+4),'reposable trop tôt');
 for(let d=0;d<3;d++){Z.endNight(st);Z.newDay(st,rng(1));ok(!Z.canPlaceBench(st,0,6*9+4),'reposable trop tôt (jour '+st.night+')')}Z.endNight(st);Z.newDay(st,rng(1));ok(Z.canPlaceBench(st,0,6*9+4),'pas revenue');eq(u.hp,Z.maxHp(st,u))});

check('zombie dans la forêt : intouchable',()=>{const st=fresh();st.grid[1*9+4]={t:'gun',hp:3};Z.startNight(st,rng(5));st.pending=[];
 st.z=[{id:1,k:'walk',pos:4,hp:5,max:5,cd:99}];for(let k=0;k<3;k++)Z.step(st);eq(st.z[0].hp,5)});

check('équipement : posé une seule fois par unité, garde l’effet',()=>{const st=fresh();Z.place(st,'gun',2*9+4,rng(1));const u=st.grid[2*9+4],h=Z.maxHp(st,u);
 ok(Z.canPlace(st,'gear',2*9+4));Z.place(st,'gear',2*9+4,rng(1));eq(Z.maxHp(st,u),h+4);ok(!Z.canPlace(st,'gear',2*9+4),'2 fois le même équipement')});
check('Jumelles : seulement sur une unité à distance',()=>{const st=fresh();Z.place(st,'axe',2*9+4,rng(1));ok(!Z.canPlace(st,'binoc',2*9+4))});
check('Clés : l’unité ne compte plus dans la limite',()=>{const st=fresh();Z.place(st,'gun',2*9+4,rng(1));eq(Z.unitCount(st),1);Z.place(st,'keys',2*9+4,rng(1));eq(Z.unitCount(st),0)});
check('postes de soutien : hors limite et non cumulables',()=>{const st=fresh();['gun','axe','med','snp','dog'].forEach((t,k)=>Z.place(st,t,2*9+2+k,rng(1)));ok(Z.canPlace(st,'pump',6*9+4));ok(Z.canPlace(st,'lamp',6*9+5));ok(!Z.isUnit('hospital'))});
check('Opérateur radio : +1 à la limite, une seule fois',()=>{const st=fresh();const c=Z.unitCap(st);Z.place(st,'radioop',Z.C,rng(1));eq(Z.unitCap(st),c+1);ok(!Z.canPlace(st,'radioop',Z.C))});
check('Pilules : survit une fois par nuit',()=>{const st=fresh();Z.place(st,'monk',2*9+4,rng(1));Z.place(st,'pills',2*9+4,rng(1));Z.startNight(st,rng(2));st.pending=[];const u=st.grid[2*9+4];
 st.z=[{id:1,k:'fat',pos:1*9+4,hp:999,max:999,cd:1,style:0}];u.hp=1;for(let k=0;k<12&&u.pillN==null;k++)Z.step(st);ok(u.pillN===st.night,'pilules non utilisées')});
check('Fosse piégée : avale le premier zombie',()=>{const st=fresh();Z.place(st,'pit',3*9+4,rng(1),true);Z.startNight(st,rng(2));st.pending=[];st.z=[{id:1,k:'fat',pos:2*9+4,hp:80,max:80,cd:1,style:0}];Z.step(st);eq(st.z.length,0)});
check('Talkie-walkie : échange avec la réserve',()=>{const st=fresh();Z.place(st,'gun',2*9+4,rng(1));Z.place(st,'axe',2*9+5,rng(1));Z.recall(st,2*9+5);st.grid[2*9+4].hp=1;Z.startNight(st,rng(2));st.energy=5;
 ok(Z.react(st,'talkie',2*9+4));eq(st.grid[2*9+4].t,'axe');eq(st.bench[0].t,'gun')});

check('escouade : +1 seulement avec un Tank, un Soin et un DPS voisins',()=>{const st=fresh();st.grid[20]={t:'gun',hp:3};st.grid[21]={t:'cop',hp:9};ok(!Z.squad(st,20));st.grid[29]={t:'med',hp:2};ok(Z.squad(st,20))});
check('les postes de soutien n’ont pas de rôle',()=>{['lamp','hospital','workshop','tower'].forEach(t=>eq(Z.roleOf(t),null))});
check('un piège posé revient à la défausse (il ne reste plus en main)',()=>{const st=fresh();Z.place(st,'trap',3*9+4,rng(1));ok(!st.grid[3*9+4].gen)});

check('munition : seulement contre le Colosse sur la carte',()=>{const st=fresh();Z.startNight(st,rng(1));st.pending=[];st.energy=5;ok(!Z.canReact(st,'shell',Z.C));
 st.z=[{id:9,k:'boss',pos:2*9+4,hp:100,max:100,cd:5,style:0}];ok(Z.canReact(st,'shell',Z.C));Z.react(st,'shell',Z.C);ok(st.z[0].hp<100)});
check('boutique : 5 objets hors du deck, jamais d’unité ni de munition, achats payés',()=>{const st=fresh();st.scrap=100;ok(Z.pay(st,'store'));eq(st.scrap,95);const deck=['gun','bar','food','grenade'];const o=Z.storeOffer(st,deck,rng(3));eq(o.length,Z.STORE_N);o.forEach(t=>{ok(['item','react'].includes(Z.U[t].cat),t+' n’est pas un objet');ok(!deck.includes(t),t+' déjà dans le deck');ok(t!=='shell')});eq(new Set(o).size,o.length);const p=Z.storePrice(o[0]);ok(Z.buyStore(st,o[0]));eq(st.scrap,95-p);st.scrap=Z.AMMO_COST-1;ok(!Z.buyStore(st,'shell'))});
check('munition anti-Colosse : usage unique, 2 au plus',()=>{ok(Z.U.shell.once);eq(Z.AMMO_MAX,2)});

check('soin à distance : l’Infirmière soigne à 2 cases',()=>{const st=fresh();st.grid[2*9+2]={t:'med',hp:2};st.grid[2*9+4]={t:'gun',hp:1};Z.startNight(st,rng(1));st.pending=[];st.z=[];for(let k=0;k<2;k++)Z.step(st);ok(st.grid[2*9+4].hp>1,'pas soigné')});
check('soin au contact : la Pharmacienne ne soigne pas à 2 cases',()=>{const st=fresh();st.grid[2*9+2]={t:'pharma',hp:3};st.grid[2*9+4]={t:'gun',hp:1};Z.startNight(st,rng(1));st.pending=[];st.z=[];for(let k=0;k<2;k++)Z.step(st);eq(st.grid[2*9+4].hp,1)});
check('les soigneurs ne soignent pas les murs',()=>{const st=fresh();st.grid[2*9+2]={t:'pharma',hp:3};st.grid[2*9+3]={t:'bar',hp:1};Z.startNight(st,rng(1));st.pending=[];st.z=[];for(let k=0;k<3;k++)Z.step(st);eq(st.grid[2*9+3].hp,1)});

check('les réparateurs réparent les postes de soutien',()=>{const st=fresh();st.grid[2*9+2]={t:'mech',hp:3};st.grid[2*9+3]={t:'lamp',hp:1};Z.startNight(st,rng(1));st.pending=[];st.z=[];Z.step(st);ok(st.grid[2*9+3].hp>1)});

check('Colosse : 10 dégâts par coup, ne tue plus une défense d’un coup',()=>{const st=fresh();st.night=10;eq(Z.bossHit(st),10);st.night=20;eq(Z.bossHit(st),12);
 st.night=10;st.grid[3*9+4]={t:'car',hp:14};Z.startNight(st,rng(1));st.pending=[];st.z=[{id:1,k:'boss',pos:2*9+4,hp:999,max:999,cd:1,style:0}];Z.step(st);eq(st.grid[3*9+4].hp,4)});

check('Maître-chien : les chiens voisins font +1 dégât',()=>{const st=fresh();st.grid[2*9+4]={t:'dog',hp:5};Z.startNight(st,rng(1));st.pending=[];
 const z={id:1,k:'fat',pos:1*9+4,hp:99,max:99,cd:99,style:0};st.z=[z];Z.step(st);const a=99-z.hp;st.grid[2*9+3]={t:'handler',hp:12};z.hp=99;Z.step(st);ok(99-z.hp>a,'pas de bonus')});
check('Éclaireur : le zombie touché est marqué (+1 dégât)',()=>{const st=fresh();st.grid[5*9+4]={t:'scout',hp:3};Z.startNight(st,rng(1));st.pending=[];const z={id:1,k:'fat',pos:2*9+4,hp:99,max:99,cd:99,style:0};st.z=[z];Z.step(st);ok(z.markT>0,'pas marqué')});
check('Assassin : exécute un zombie ordinaire toutes les 4 attaques, jamais le Colosse',()=>{const st=fresh();st.grid[3*9+4]={t:'assassin',hp:5};Z.startNight(st,rng(1));st.pending=[];
 const z={id:1,k:'fat',pos:2*9+4,hp:999,max:999,cd:99,style:0};st.z=[z];for(let k=0;k<4;k++)Z.step(st);ok(z.hp<=0,'pas exécuté');
 const b={id:2,k:'boss',pos:2*9+4,hp:999,max:999,cd:99,style:0};st.z=[b];for(let k=0;k<4;k++)Z.step(st);ok(b.hp>900,'Colosse exécuté')});
check('Électricien : plus de coupure de courant',()=>{const st=fresh();st.event=Z.EVENTS.find(e=>e.id==='coupure');st.grid[2*9+4]={t:'genmech',hp:4};st.grid[3*9+4]={t:'tesla',hp:4};
 Z.startNight(st,rng(1));st.pending=[];const z={id:1,k:'fat',pos:4*9+3,hp:99,max:99,cd:99,style:0};st.z=[z];Z.step(st);Z.step(st);ok(z.hp<99,'la Tesla ne tire pas')});
check('Infirmière de campagne : soigne la réserve à l’aube',()=>{const st=fresh();st.grid[2*9+4]={t:'fieldnurse',hp:3};st.bench=[{t:'gun',hp:1}];Z.endNight(st);eq(st.bench[0].hp,3)});

check('Tableau des combats : dégâts, zombies tués, encaissés, soins et morts comptés',()=>{const st=fresh();st.grid[3*9+4]={t:'gun',hp:3,name:'Léa'};st.grid[3*9+3]={t:'pharma',hp:4};
 Z.startNight(st,rng(1));st.pending=[];const z={id:1,k:'walk',pos:2*9+4,hp:3,max:3,cd:99,style:0};st.z=[z];for(let k=0;k<4;k++)Z.step(st);
 const rows=Object.values(st.mtN),lea=rows.find(r=>r.name==='Léa');ok(lea&&lea.dmg===3&&lea.kills===1,'dégâts ou tué non comptés '+JSON.stringify(lea));
 ok(st.mtR[lea.id].dmg===3,'total de la partie');
 const g=st.grid[3*9+4];g.hp=1;const z2={id:2,k:'fat',pos:2*9+4,hp:99,max:99,cd:1,style:0};st.z=[z2];for(let k=0;k<6;k++)Z.step(st);
 ok(Object.values(st.mtN).some(r=>r.tak>0),'dégâts encaissés non comptés');
 ok((st.mtD||[]).some(d=>d.name==='Léa'&&d.by==='fat')||Object.values(st.mtN).some(r=>r.hg>0),'ni mort ni soin compté');
 Z.startNight(st,rng(2));ok(!Object.keys(st.mtN).length&&Object.keys(st.mtR).length,'remise à zéro de la nuit')});
check('Tableau des combats : soin compté pour le soigneur et le soigné',()=>{const st=fresh();st.grid[3*9+4]={t:'gun',hp:1,name:'Paul'};st.grid[3*9+3]={t:'pharma',hp:4,name:'Ana'};
 Z.startNight(st,rng(1));st.pending=[];st.z=[];for(let k=0;k<4;k++)Z.step(st);const r=Object.values(st.mtN);
 ok(r.find(x=>x.name==='Ana').hg>0&&r.find(x=>x.name==='Paul').hr>0,JSON.stringify(r))});

check('Boss : Colosse nuit 10, la Mère nuit 20 (+1 Colosse), le Patient Zéro nuit 30 (+2 Colosses)',()=>{
 for(const [n,lead,nb] of [[10,'boss',1],[20,'mere',2],[30,'zero',3]]){const st=fresh();st.night=n;Z.startNight(st,rng(1));const b=st.pending.filter(p=>Z.ZT[p.k].boss);
  eq(b.length,nb);eq(b[0].k,lead);ok(st.waves===2,'pas de pause entre les vagues nuit '+n)}});
check('Nuit de boss : un zombie bloqué en 1re vague n\'empêche pas le boss d\'arriver',()=>{const st=fresh();st.night=10;st.shelter=st.maxS=1e6;Z.startNight(st,rng(1));
 st.pending=st.pending.filter(p=>p.wave===2);st.z=[{id:950,k:'spit',pos:1*9+4,hp:1e6,max:1e6,cd:1e6,style:0}];let t=0;
 while(!st.z.some(z=>Z.ZT[z.k].boss)&&t<400){Z.step(st);t++}ok(st.z.some(z=>Z.ZT[z.k].boss),'le boss n\'arrive jamais (vague '+st.wave+')')});
check('Cracheur : après 3 crachats sur un mur, il avance au contact',()=>{const st=fresh();Z.startNight(st,rng(1));st.pending=[];
 const z={id:960,k:'spit',pos:1*9+4,hp:1e6,max:1e6,cd:1,style:0};st.z=[z];Z.around(Z.C).forEach(j=>st.grid[j]={t:'bar',hp:1e6});let t=0;
 while(z.pos===1*9+4&&t<200){Z.step(st);t++}ok(z.pos===2*9+4,'le cracheur ne bouge pas (case '+z.pos+')')});
check('La Mère pond des rampants (6 au plus) et en libère 2 en mourant',()=>{const st=fresh();st.night=20;Z.startNight(st,rng(1));st.pending=[];
 const m={id:900,k:'mere',pos:2*9+4,hp:999,max:999,cd:999,style:0};st.z=[m];for(let k=0;k<40;k++)Z.step(st);
 ok((m.kids||0)===6,'pontes '+m.kids);
 st.z=[{id:901,k:'mere',pos:2*9+4,hp:1,max:50,cd:999,style:0}];st.grid[3*9+4]={t:'gun',hp:3};const before=st.spawned||0;for(let k=0;k<3;k++)Z.step(st);
 ok((st.spawned||0)-before>=2,'pas de rampants à la mort')});
check('Patient Zéro : les zombies proches avancent plus vite',()=>{const run=withZero=>{const st=fresh();st.night=30;Z.startNight(st,rng(1));st.pending=[];
  const w={id:1,k:'walk',pos:1*9+4,hp:999,max:999,cd:2,style:0};st.z=[w];if(withZero)st.z.push({id:2,k:'zero',pos:1*9+3,hp:999,max:999,cd:999,style:0});
  let t=0;while(w.pos!==3*9+4&&t<20){Z.step(st);t++}return t};
 ok(run(1)<run(0),'pas plus rapide')});

/* ---------- 4. nuits aléatoires ---------- */
const PLACE=PLAY.filter(t=>!Z.U[t].react&&!Z.U[t].instant&&!Z.U[t].onUnit);
const NIGHTS=+process.env.NIGHTS||300;let maxZ=0,slow=0,worst=0;
for(let g=0;g<NIGHTS;g++){const r=rng(1000+g);
 check(`nuit aléatoire n°${g}`,()=>{const st=Z.newState('surv',['bois','ferme','station','centre'][g%4]||'bois',r);st.night=1+Math.floor(r()*60);
  for(let k=0;k<Math.floor(st.night/5);k++)Z.mutate(st,r);
  const n=4+Math.floor(r()*20);for(let k=0;k<n;k++){const t=PLACE[Math.floor(r()*PLACE.length)],cs=freeCells(st).filter(j=>Z.canPlace(st,t,j));if(cs.length)Z.place(st,t,cs[Math.floor(r()*cs.length)],r,true)}
  if(r()<.5){const e=Z.EVENTS[Math.floor(r()*Z.EVENTS.length)];st.event=e}if(r()<.4)Z.applyMenace(st,Math.floor(r()*11),r);
  // une nuit sur deux, abri indestructible : la nuit va jusqu'au bout, même avec une grosse horde
  if(g%2)st.shelter=st.maxS=1e6;
  const t0=Date.now();Z.startNight(st,r);let res,ticks=0;
  do{res=Z.step(st);ticks++;if(res.pause)Z.nextWave(st);
   for(const z of st.z){if(z.hp<=0)continue;ok(fin(z.hp)&&fin(z.pos),'zombie invalide');ok(!Z.isForest(z.pos),`zombie ${z.k} dans la forêt (case ${z.pos})`)}
   ok(ticks<3000,'la nuit ne se termine pas')}while(!res.done);
  maxZ=Math.max(maxZ,st.spawned||0);const ms=Date.now()-t0;worst=Math.max(worst,ms);if(ms>2000)slow++;
  ok(fin(st.shelter),'PV abri '+st.shelter);st.grid.forEach(u=>{if(u&&Z.U[u.t].block)ok(fin(u.hp),u.t+' PV '+u.hp)});
  Z.endNight(st)})}
check('couloirs de mort : case du chemin couverte par 2 tireurs',()=>{const st=fresh();ok(!Object.keys(Z.killZones(st)).length,'aucune zone sans unité');
 st.grid[21]={t:'gun',hp:3};st.grid[23]={t:'gun',hp:3};const k=Z.killZones(st);ok(k[22]>=2,'case 22 couverte');ok(!k[21]&&!k[23],'pas sur les unités');ok(!Object.keys(k).some(j=>Z.isEdge(+j)),'pas dans la forêt')});
check('aucune nuit de plus de 2 s',()=>ok(slow===0,slow+' nuit(s) lente(s), pire '+worst+' ms'));

/* ---------- défi du jour (v151) : une nuit, horde tirée au sort, 8 cartes « 1 parmi 3 » ---------- */
for(let d=0;d<40;d++){const p=Z.dailyPlan(rng(900+d)),p2=Z.dailyPlan(rng(900+d));
 check(`défi ${d} : même graine, même défi`,()=>eq(JSON.stringify(p),JSON.stringify(p2)));
 check(`défi ${d} : ${Z.DAILY.picks} tirages de 3 cartes connues, horde non vide`,()=>{eq(p.offers.length,Z.DAILY.picks);p.offers.forEach(o=>{eq(o.length,3);o.forEach(t=>ok(Z.U[t],t+' inconnue'));ok(new Set(o).size===3,'doublon '+o)});ok(Object.values(p.w).reduce((a,b)=>a+b,0)>0);ok(Z.CHARS[p.ch]&&Z.PLACES[p.pl]&&Z.EVENTS.some(e=>e.id===p.event)&&(!p.mut||Z.MUTS[p.mut]))});
 check(`défi ${d} : la nuit se joue sans planter, énergie illimitée, place pour les 8 cartes`,()=>{const r=rng(50+d),deck=p.offers.map(o=>o[d%3]),st=Z.dailyState(p,deck,r);
  ok(st.oneNight&&st.energy>=99,'énergie');ok(Z.unitCap(st)>=deck.length,'limite '+Z.unitCap(st));
  const w=Z.waveList(st);Z.ZK.filter(k=>Z.ZT[k].boss).forEach(k=>eq(w[k],p.w[k]||0));
  Z.runNight(st,r);ok(fin(st.kills)&&fin(st.shelter),'valeurs');const sc=Z.dailyScore(st,st.shelter>0);ok(fin(sc)&&sc>=0,'score '+sc)})}
/* ---------- 5. traduction anglaise ---------- */
// chaque texte passé à _t dans le code doit avoir sa traduction dans src/lang-en.js, avec les mêmes trous {0}, {1}…
{const vm=require('vm');
 const keysOf=src=>{const out=[];let i=0;
  const cook=raw=>Function('return `'+raw+'`')();
  // lit un gabarit `…` à partir de src[j]==='`' ; renvoie [clé, fin]
  const tpl=j=>{let k='',raw='',n=0;j++;for(;j<src.length;j++){const c=src[j];
    if(c==='\\'){raw+=c+src[j+1];j++;continue}
    if(c==='`'){k+=cook(raw);return[k,j+1]}
    if(c==='$'&&src[j+1]==='{'){k+=cook(raw)+'{'+(n++)+'}';raw='';j=expr(j+2)-1;continue}
    raw+=c}return[k,j]};
  const expr=j=>{let d=0;for(;j<src.length;j++){const c=src[j];
    if(c==='\''||c==='"'){const q=c;j++;while(j<src.length&&src[j]!==q){if(src[j]==='\\')j++;j++}continue}
    if(c==='`'){j=tpl(j)[1]-1;continue}
    if(c==='/'&&/[(,=:[!&|?{};]/.test(src.slice(0,j).trimEnd().slice(-1))){j++;let cl=0;while(j<src.length&&(src[j]!=='/'||cl)){if(src[j]==='\\')j++;else if(src[j]==='[')cl=1;else if(src[j]===']')cl=0;j++}continue}
    if(c==='{')d++;else if(c==='}'){if(!d)return j+1;d--}}return j};
  while((i=src.indexOf('_t',i))>=0){const pre=src[i-1]||' ';if(/[\w$]/.test(pre)){i+=2;continue}
   const c=src[i+2];
   if(c==='`'){const [k]=tpl(i+2);out.push(k)}
   else if(c==='('&&(src[i+3]==='\''||src[i+3]==='"')){const q=src[i+3];let j=i+4;while(src[j]!==q){if(src[j]==='\\')j++;j++}
    if(src[j+1]===')')out.push(Function('return '+src.slice(i+3,j+1))())}
   i+=2}
  return out};
 const ctx={I18N:{},console};vm.createContext(ctx);
 vm.runInContext(fs.readFileSync(path.join(ROOT,'src/lang-en.js'),'utf8'),ctx);
 const EN=ctx.I18N.en||{};const ph=s=>new Set(s.match(/\{\d+\}/g)||[]);
 for(const f of ['engine.js','game.js','game-draw.js','game-ui.js','game-screens.js','game-menu.js']){
  const ks=keysOf(fs.readFileSync(path.join(ROOT,'src',f),'utf8'));
  const miss=ks.filter(k=>EN[k]==null);
  check(`traduction : ${f} (${ks.length} textes) tous traduits`,()=>ok(!miss.length,miss.length+' sans traduction : '+miss.slice(0,process.env.ALLMISS?99:3).map(k=>JSON.stringify(k).slice(0,process.env.ALLMISS?2000:90)).join(' | ')));
  const bad=ks.filter(k=>EN[k]!=null&&[...ph(EN[k])].some(p=>!ph(k).has(p)));
  check(`traduction : ${f} trous {0}… cohérents`,()=>ok(!bad.length,bad.slice(0,3).join(' | ')));
 }
 // le moteur en anglais : noms traduits et nuits sans plantage
 const g={I18N:{},console,localStorage:{getItem:()=>JSON.stringify({lang:'en'})},navigator:{language:'en'},NodeFilter:{SHOW_TEXT:4},
  document:{documentElement:{},body:{},querySelectorAll:()=>[],createTreeWalker:()=>({nextNode:()=>null})}};
 g.globalThis=g;vm.createContext(g);
 for(const f of ['i18n.js','lang-en.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,'src',f),'utf8')+(f==='engine.js'?';globalThis.Z=Z;':''),g);
 const ZE=g.Z;
 check('traduction : moteur en anglais (noms de cartes et de zombies)',()=>{eq(ZE.U.gun.n,'Gunner');eq(ZE.ZT.walk.n,'Walker');eq(ZE.U.gun.v,'2 · R2')});
 const FR=/\b(le|la|les|des|une|tes|ton|abri|ferraille|dégâts?|nuit)\b|’/i;
 check('traduction : nuits et événements de l’aube en anglais',()=>{const r=rng(5);const P=Object.keys(ZE.U).filter(t=>!ZE.U[t].evo&&!ZE.U[t].react&&!ZE.U[t].instant&&!ZE.U[t].onUnit);
  for(let g=0;g<12;g++){const st=ZE.newState('surv','bois',r);st.night=1+g*4;st.shelter=st.maxS=1e6;
   for(let k=0;k<10;k++){const t=P[Math.floor(r()*P.length)],cs=[...Array(81).keys()].filter(j=>!st.grid[j]&&!ZE.isEdge(j)&&j!==ZE.C&&ZE.canPlace(st,t,j));if(cs.length)ZE.place(st,t,cs[Math.floor(r()*cs.length)],r,true)}
   ZE.startNight(st,r);let res,n=0;do{res=ZE.step(st);if(res.pause)ZE.nextWave(st)}while(!res.done&&n++<3000);ZE.endNight(st)}
  for(const id of Object.keys(ZE.DAWN))ZE.DAWN[id].ch.forEach((c,k)=>{for(let s=0;s<4;s++){const st=ZE.newState('surv','bois',rng(s+1));st.scrap=50;st.night=6;const o=ZE.resolveDawn(st,id,k,rng(s*7+k),['gun','bar']);
   ok(typeof o.txt==='string'&&!/undefined|\{\d\}/.test(o.txt),id+' : '+o.txt);ok(!FR.test(o.txt),'français restant ('+id+') : '+o.txt);
   ok(!FR.test(ZE.DAWN[id].n+' '+c.n+' '+c.d),'français restant : '+ZE.DAWN[id].n+' / '+c.n)}})});
}

console.log(`Moteur : ${pass} tests réussis, ${fail} échoué(s). Nuits aléatoires : ${NIGHTS} (jusqu’à ${maxZ} zombies, la plus lente ${worst} ms).`);
if(fail){console.log(fails.slice(0,40).map(f=>'  ✗ '+f).join('\n'));process.exitCode=1}
