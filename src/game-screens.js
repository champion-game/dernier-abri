/* Dernier Abri : écrans (aube, options, collection, decks, préparation) et actions des boutons.
   Les fichiers src/game*.js partagent leurs variables (scripts classiques chargés dans l’ordre par index.html). */
/* ---------- l'aube : relique, carte pour demain, boutique ---------- */
const pickBtn=(t,a,v)=>`<button type="button" class="pick" data-a="${a}" data-v="${v}">${cardFace(t)}</button>`;
function dawn(){
 const d=S.dawn;if(d&&!d.chimed){d.chimed=1;SFX.play('dawn')}
 if(d&&d.mut&&!d.mutShown){d.mutShown=1;SFX.play('mutate');
  return show(_t`<h2 class="ko">Mutation instable</h2>${dawnTxt()}<div class="relics"><div class="relic mutx">${svg('mut')}<span><b>${Z.MUTS[d.mut].n}</b>${Z.MUTS[d.mut].d}</span></div></div><p>Elle remplace la précédente pendant 5 nuits, puis une autre mutation instable prendra sa place.</p><button type="button" class="go" data-a="dawn">Continuer</button>`)}
 // une unité a atteint 20, 40, 60… zombies tués : choix de son amélioration
 const li=Z.lvReady(G);if(li>=0)return dawnStep('lvl',[li]);
 if(Z.relicNight(G.night)||(d&&d.relicReward&&!d.relicDone)){if(d)d.relicDone=1;const r=Z.relicChoices(G,R);if(r.length)return dawnStep('relic',r)}
 afterRelic();
}
// un événement de l'aube (environ 1 aube sur 2), puis le choix de la carte
function afterRelic(){const ev=Z.dawnEvent(G,R);if(ev)return dawnStep('event',[ev]);dawnStep('draft')}
function dawnStep(ph,picks){
 S.phase=ph;
 if(ph==='relic'){S.picks=picks;save();
  return show(_t`<h2 class="ok">Nuit ${G.night} survécue</h2>${dawnTxt()}<p>Dans les décombres, tu trouves un objet rare. Choisis une <b>relique</b> : elle reste active toute la partie.</p>
   <div class="relics">${picks.map(r=>`<button type="button" class="relic" data-a="relic" data-v="${r}">${relicIc(r)}<span><b>${Z.RELICS[r].n}</b>${Z.RELICS[r].d}</span></button>`).join('')}</div>`)}
 if(ph==='lvl'){S.picks=picks;save();const u=G.grid[picks[0]];if(!u||Z.lvPending(u)<=0){S.phase=null;return dawn()}
  const lv=(u.lvA||0)+(u.lvD||0)+1;SFX.play('lvl');const lvNew=!seen('lvl');META.hints=META.hints||{};if(lvNew){META.hints.lvl=1;saveMeta(META)}
  return show(_t`<h2 class="ok">Niveau ${lv} !</h2>${dawnTxt()}<p><b>${u.name||cardName(u.t)}</b>${u.name?` (${cardName(u.t)})`:''} a tué <b>${u.kills} zombies</b>. Choisis son amélioration, elle dure toute la partie :</p>${lvNew?'<p class="newx">'+ii('star')+_t(' <b>Nouveau : les niveaux.</b> Plus un survivant tue de zombies, plus il monte en niveau. Son niveau s’affiche sur la carte (N1, N2…).</p>'):''}
   <div class="relics"><button type="button" class="relic" data-a="lvl" data-v="atk">${svg('shot')}<span><b>Offensive</b>+1 dégât à chaque coup</span></button><button type="button" class="relic" data-a="lvl" data-v="def">${svg('riot')}<span><b>Défensive</b>+3 PV max, et tous ses PV récupérés</span></button></div>`)}
 if(ph==='event'){S.picks=picks;save();const E=Z.DAWN[picks[0]];
  return show(`<h2 class="pw">${E.n}</h2>${dawnTxt()}<p>${E.d}</p><div class="relics">${E.ch.map((c,k)=>`<button type="button" class="relic evc" data-a="evc" data-v="${k}" ${c.ok&&!c.ok(G)?'disabled':''}><span><b>${c.n}</b>${c.d}</span></button>`).join('')}</div>`)}
 // la carte de demain : 3 cartes au choix tirées de ta pioche et de ta défausse (jamais de carte hors du deck)
 if(ph==='draft'){S.picks=picks||shuffle([...new Set(S.draw)]).slice(0,3);if(!S.picks.length)return dawnStep('shop');save();
  return show(_t`<h2 class="ok">Nuit ${G.night} survécue</h2>${dawnTxt()}<p>Choisis une carte de <b>ta pioche</b> que tu auras <b>en main demain</b>.</p>
   ${TUTO===3?(tuto(3),_t`<p class="tipin">${ii('bulb')} À chaque aube, tu choisis une carte de ta pioche : elle arrive dans ta main dès demain. Ensuite viendra le troc, où tu dépenses ta ferraille.</p>`):''}
   <div class="picks">${S.picks.map(t=>pickBtn(t,'draft',t)).join('')}</div>
   <button type="button" class="skip" data-a="draft" data-v="">Ne rien prendre</button>`)}
 if(ph==='night')return nightScreen(picks);
 S.picks=null;save();shopScreen();
}
function dawnTxt(){const d=S.dawn;if(!d||d.txtShown)return '';d.txtShown=1;return (d.rewardCard?_t`<p>Butin de la ${(Z.TIERS[d.tier]||Z.TIERS.base).n.toLowerCase()} : <b>${Z.U[d.rewardCard].n}</b> rejoint ton deck.</p>`:'')+_t`<p>L’abri tient avec <b>${G.shelter}/${Z.maxS(G)} PV</b>. Cette nuit : <b><span data-count="${d.kills}">${d.kills}</span> ${d.kills>1?_t('zombies éliminés'):_t('zombie éliminé')}</b>, <b>+<span data-count="${d.scrap}">${d.scrap}</span> ferraille</b>${d.heal?_t`, <b>+${d.heal} PV</b> à l’aube`:''}.</p>`
 +(d.hero?_t`<p>Héros de la nuit : <b>${d.hero.name}</b> (${Z.U[d.hero.t].n}), ${plural(d.hero.nk,_t('zombie'),_t('zombies'))}.</p>`:'')
 +(d.fallen&&d.fallen.length?_t`<p class="rip">${ii('cross')} Tombés cette nuit : ${d.fallen.map(f=>`<b>${f.name}</b> (${Z.U[f.t].n}, ${plural(f.kills,_t('zombie'),_t('zombies'))})`).join(', ')}.</p>`:'')}
function shopScreen(){
 S.phase='shop';S.picks=null;save();
 const row=(k,ex)=>{const o=Z.SHOP[k],c=Z.shopCost(G,k),ok=G.scrap>=c&&!ex;return `<button type="button" class="shopi" data-a="shop-${k}" ${ok?'':'disabled'}><span><b>${o.n}</b>${o.d}</span><span class="cost">${svg('scrap')}${c}</span></button>`};
 const upg=deckTypes().filter(t=>Z.UPGRADABLE.includes(t)&&!G.upg[t]);
 show(_t`<h2 class="pw">Le troc de l’aube</h2><p>Tu as <b>${G.scrap} ferraille</b>. Un zombie éliminé rapporte 1 ferraille, un boss 15. Économise pour ce qui compte. ${G.night%10===9?_t`<b>${capF(bossName(G.night+1))} attaque demain !</b> `:''}Munitions anti-Colosse : <b>${ammoOwned()}/${Z.ammoMax(G)}</b>.</p>
  <div class="shop">${S.store?_t`<button type="button" class="shopi" data-a="store-open"><span><b>Retourner à la boutique</b>Déjà ouverte pour cette aube</span><span class="cost">✓</span></button>`:row('store')}${row('heal',G.shelter>=Z.maxS(G))}${row('upgrade',!upg.length)}${row('remove',deckList().length<=5)}</div>
  <button type="button" class="go" data-a="nightpick">Continuer</button>`);
}
const deckTypes=()=>[...new Set(deckList())];
// munitions anti-Colosse possédées (main, pioche, défausse)
const ammoOwned=()=>[...S.hand,...S.draw,...S.discard].filter(t=>t==='shell').length;
// la boutique : 5 objets absents du deck (un exemplaire chacun) et des munitions ; les achats arrivent en main
function storeScreen(){const st=S.store;if(!st)return shopScreen();const own=ammoOwned();
 const item=(t,price,dis,label)=>`<div class="citem${dis?' locked':''}">${cardFace(t,{base:1})}<span class="qty"><button type="button" class="buy" data-a="store-buy" data-v="${t}" ${dis||G.scrap<price?'disabled':''}>${label||price+_t(' ferraille')}</button></span></div>`;
 show(_t`<h2 class="pw">La boutique</h2><p>Tu as <b>${G.scrap} ferraille</b>. Les cartes achetées arrivent dans ta main et rejoignent ton deck pour la partie. Une seule de chaque, sauf les munitions (${own}/${Z.ammoMax(G)}).</p>
  <div class="cgrid">${st.c.map(t=>st.b.includes(t)?item(t,0,1,_t('✓ Achetée')):item(t,Z.storePrice(t))).join('')}${item('shell',Z.AMMO_COST,own>=Z.ammoMax(G),own>=Z.ammoMax(G)?_t`Maximum (${Z.ammoMax(G)})`:'')}</div>
  <button type="button" class="go" data-a="store-back">Retour au troc</button>`,true)}
const pileTypes=()=>[...new Set(pileList())];
function listScreen(title,txt,types,a){show(_t`<h2 class="pw">${title}</h2><p>${txt}</p><div class="deck pickable">${types.map(t=>`<button type="button" class="dk" data-a="${a}" data-v="${t}" style="--cc:${cc(t)}">${art(t)}<span><b>${cardName(t)}${a==='up-pick'?` → ${Z.upgDesc(t)}`:''}</b>${Z.U[t].d}</span></button>`).join('')}</div><button type="button" class="skip" data-a="shop">Retour</button>`)}
function removeCard(t){for(const pile of[S.discard,S.draw,S.hand]){const k=pile.indexOf(t);if(k>=0){pile.splice(k,1);return true}}return false}
// choisir la nuit suivante : une prudente, une risquée qui rapporte
function nightScreen(offers){S.phase='night';S.picks=offers||Z.nightOffers(G,R);save();
 const ev=id=>Z.EVENTS.find(e=>e.id===id)||Z.EVENTS[0];
 show(_t`<h2 class="pw">Quelle nuit affronter ?</h2><p>Les éclaireurs ont repéré deux possibilités pour la nuit ${G.night+1}.</p>
  <div class="relics">${S.picks.map((o,k)=>{const T=Z.TIERS[o.tier],E=ev(o.event);return _t`<button type="button" class="relic nightc ${T.safe?'safe':'risk'}" data-a="nightgo" data-v="${k}"><span><b>${T.n}</b>${T.d}<em>Événement : ${E.n}${E.id!=='calme'?' ('+E.d+')':''}</em></span></button>`}).join('')}</div>`)}
function nextDay(offer){
 Z.newDay(G,R,offer);S.moveFrom=null;S.busy=false;S.phase=null;S.picks=null;S.dawn=null;V.clear();
 fillHand();save();hide();render();
}
// victoire : la nuit 30 est tenue, les secours arrivent. Partir (victoire) ou rester (infini, pour le score)
function victory(){G.won=1;try{ach('win');if((G.menace||0)>=5)ach('m5');if((G.menace||0)>=10)ach('m10');if(G.daily)ach('daily');achCheck()}catch(e){}const m=G.menace||0,pts=G.daily?0:Z.winPoints(m),unl=!G.daily&&m<Z.MENACE_MAX&&(META.menace||0)<=m;
 let relUnl=null,relStart=null,cardUnl=null;
 if(!G.daily){const vc=Z.VICTORY_CARDS.find(t=>Z.U[t].vic===m);if(vc&&!META.cards.includes(vc)){cardUnl=vc;META.cards.push(vc)}}
 if(!G.daily){const vr=Z.VICTORY_RELICS.find(r=>Z.RELICS[r].lock===m&&!(META.relicsUnl||[]).includes(r));if(vr){relUnl=vr;META.relicsUnl=[...(META.relicsUnl||[]),vr]}
  const avail=Object.keys(Z.RELICS).filter(r=>(Z.RELICS[r].lock==null||(META.relicsUnl||[]).includes(r))&&!(META.startPool||[]).includes(r));
  if(avail.length){relStart=avail[Math.floor(Math.random()*avail.length)];META.startPool=[...(META.startPool||[]),relStart]}}
 if(!G.daily&&!META.wins){OPT.back='gold';OPT.shelter='fort';saveOpt();applyOpt()}
 if(!G.daily){META.wins=(META.wins||0)+1;META.menaceWon=Math.max(META.menaceWon??-1,m);META.menace=Math.max(META.menace||0,Math.min(Z.MENACE_MAX,m+1));META.points=(META.points||0)+pts;saveMeta(META)}
 save();SFX.play('heli');setTimeout(()=>SFX.play('relic'),900);const alive=G.grid.filter(u=>u&&u.name).map(u=>u.name);
 show(_t`<img class="heli" src="assets/ui/heli.webp?v=121" alt=""><h2 class="ok">Les secours sont là !</h2><p>À l’aube de la nuit ${Z.WIN_NIGHT}, un hélicoptère se pose devant l’abri. Tu as tenu.</p><i class="bigstamp ok">Victoire${m?` · M${m}`:''}</i>
  <p><b>${G.kills}</b> zombies éliminés.${alive.length?_t` Survivants : ${alive.join(', ')}.`:''}</p>${pts?_t`<p>+<b>${pts}</b> points de survie (total : ${META.points}).</p>`:''}${META.wins===1&&!G.daily?_t`<p class="tipin">${ii('spark')} <b>Dos de carte doré</b> et <b>maison fortifiée</b> débloqués pour ta première victoire (modifiables dans les Options).</p>`:''}${unl?_t`<p class="tipin">${ii('unlock')} <b>Mutation ${m+1} débloquée</b> : ${Z.MENACES[m+1].n}. Choisis-la en préparant ta prochaine partie.</p>`:''}${cardUnl?_t`<p class="tipin">${ii('card')} <b>Carte de victoire</b> : ${Z.U[cardUnl].n} rejoint ta collection. Ajoute-la à ton deck.</p><div class="vcard">${cardFace(cardUnl,{base:1})}</div>`:''}${relUnl?_t`<p class="tipin">${ii('gift')} <b>Nouvelle relique débloquée</b> : ${Z.RELICS[relUnl].n} (${Z.RELICS[relUnl].d}). Tu pourras la trouver en partie.</p>`:''}${relStart?_t`<p class="tipin">${ii('pack')} <b>Relique de départ</b> : ${Z.RELICS[relStart].n} rejoint ta réserve. Choisis-la avant ta prochaine partie.</p>`:''}
  <button type="button" class="go" data-a="win-leave">Partir avec les secours</button><button type="button" class="skip" data-a="win-stay">Rester : une nuit de plus (mode infini, pour le score)</button>
  <p class="ver">Si tu restes, ta victoire est déjà acquise : la horde grandit chaque nuit, jusqu’à ce qu’elle gagne.</p>`)}
function leaveWin(){clearSave();logRun(1);const nights=G.night;let pts=0;if(!G.daily){pts=Z.runPoints(nights,G.kills);META.points=(META.points||0)+pts;META.best=Math.max(META.best,nights);META.total+=nights;META.runs++;saveMeta(META)}giftStart(nights);
 show(_t`<img class="heli away" src="assets/ui/heli.webp?v=121" alt=""><h2 class="ok">Victoire</h2><p>L’hélicoptère décolle. Derrière toi, la horde envahit la clairière… mais tu es parti.</p><div class="big">${plural(nights,_t('nuit survécue'),_t('nuits survécues'))}</div>${pts?_t`<p>+<b>${pts}</b> points de survie pour ces ${nights} nuits (total : ${META.points}).</p>`:''}${detBtn()}<button type="button" class="go" data-a="title">Accueil</button>`);keepEnd();if(META.gift)giftScreen()}
// v150 : cartes offertes en fin de partie (règle : Z.giftCount, Z.giftOffer). Le tirage est enregistré tout de suite
// (META.gift) : fermer le jeu ne permet pas de retirer d'autres cartes, l'écran revient au prochain passage par l'accueil.
function giftStart(nights){if(G.daily||TEST)return;const n=Z.giftCount(nights);if(!n)return;const c=Z.giftOffer(META.cards);if(!c.length)return;
 META.gift={c,n:Math.min(n,c.length),got:[],up:[]};saveMeta(META)}
const GIFT_RN={com:_t('Commune'),rare:_t('Rare'),epic:_t('Épique'),leg:_t('Légendaire')};
function giftLeft(){const g=META.gift;return g?g.n-g.got.length:0}
function giftScreen(){const g=META.gift;if(!g)return;
 const msg=g.n>=g.c.length?_t('Les 3 cartes sont pour toi.'):g.n>1?_t`Choisis ${g.n} cartes parmi 3.`:_t('Choisis 1 carte parmi 3.');
 show(_t`<h2 class="pw">Récompense</h2><p>${msg} Touche une carte pour la retourner, puis touche-la encore pour la prendre. Chaque carte prise rejoint ta collection pour toujours.</p>
  <div class="gifts">${g.c.map((t,i)=>`<button type="button" class="gift r-${Z.RAR[t]||'com'}${g.up.includes(i)?' up':''}${g.got.includes(i)?' got':''}" data-a="gift" data-v="${i}" aria-label="${_t('Carte offerte')} ${i+1}"><span class="g-in"><span class="g-back"></span><span class="g-face">${cardFace(t,{base:1})}<span class="g-rar">${GIFT_RN[Z.RAR[t]||'com']}</span><span class="g-ok">✓</span></span></span></button>`).join('')}</div>
  <p class="g-left"></p><button type="button" class="go" data-a="gdone" hidden>Continuer</button>`);giftSync()}
function giftSync(){const g=META.gift;if(!g)return;const left=giftLeft(),el=panel.querySelector('.g-left'),b=panel.querySelector('[data-a=gdone]');
 panel.querySelectorAll('.gift').forEach((e,i)=>{e.classList.toggle('up',g.up.includes(i));e.classList.toggle('got',g.got.includes(i));e.classList.toggle('off',!left&&!g.got.includes(i))});
 if(el)el.innerHTML=left?(left>1?_t`Encore <b>${left}</b> cartes à choisir.`:_t('Encore <b>1</b> carte à choisir.')):_t('Cartes ajoutées à ta collection.');if(b)b.hidden=!!left}
function giftTap(v){const g=META.gift,i=+v;if(!g||!g.c[i]||g.got.includes(i))return;
 if(!g.up.includes(i)){g.up.push(i);saveMeta(META);SFX.play('card');giftSync();return}
 if(!giftLeft())return;const t=g.c[i];
 const box=document.createElement('div');box.className='gconf';
 box.innerHTML=_t`<div class="gbox r-${Z.RAR[t]||'com'}"><p>Prendre <b>${Z.U[t].n}</b> ?</p><p class="g-sub">${GIFT_RN[Z.RAR[t]||'com']}${giftLeft()>1?'':_t(' · les autres cartes seront perdues')}</p><div class="g-btns"><button type="button" class="go" data-a="gyes" data-v="${i}">Prendre</button><button type="button" class="skip" data-a="gno">Annuler</button></div></div>`;
 panel.appendChild(box);SFX.play('ui')}
function giftTake(v){const g=META.gift,i=+v;panel.querySelectorAll('.gconf').forEach(e=>e.remove());if(!g||!g.c[i]||g.got.includes(i)||!giftLeft())return;
 g.got.push(i);const t=g.c[i];if(!META.cards.includes(t))META.cards.push(t);saveMeta(META);SFX.play('dawn');vib(40);giftSync();try{achCheck()}catch(e){}}
function giftDone(){META.gift=null;saveMeta(META);if(S.endHtml)show(S.endHtml);else title()}
function statsScreen(){const h=META.hist||[],pl=Object.entries(META.played||{}).filter(([t])=>Z.U[t]).sort((a,b)=>b[1]-a[1]).slice(0,6),avg=h.length?Math.round(h.reduce((a,x)=>a+x.n,0)/h.length*10)/10:0;
 const tile=(v,l)=>`<div class="stile"><b>${v}</b><span>${l}</span></div>`;
 show(_t`<h2 class="pw">Statistiques</h2><div class="stiles">${tile(META.best||0,_t('record de nuits'))}${tile(META.wins||0,_t('victoires'))}${tile(META.menaceWon>=0?META.menaceWon:'—',_t('Mutation vaincue'))}${tile(META.runs||0,_t('parties'))}${tile(META.total||0,_t('nuits au total'))}${tile(META.kills||0,_t('zombies éliminés'))}</div>
  <h3>Dernières parties</h3>${h.length?_t`<p>Moyenne : <b>${avg}</b> nuits.</p><div class="hist">${h.slice(0,10).map(x=>_t`<div class="hrow${x.w?' win':''}"><span class="hn">${x.w?ii('trophy'):ii('skull')} ${x.n} nuits</span><span>${Z.CHARS[x.ch]?Z.CHARS[x.ch].n:''} · ${Z.PLACES[x.pl]?Z.PLACES[x.pl].n:''}${x.m?_t` · Mutation ${x.m}`:''}</span><span class="hk">${x.k} zombies</span></div>`).join('')}</div>`:_t('<p>Aucune partie terminée pour l’instant.</p>')}
  <h3>Tes cartes préférées</h3>${pl.length?`<div class="cgrid fav">${pl.map(([t,n])=>`<div class="citem">${cardFace(t,{base:1,mini:1})}<span class="qty">${plural(n,_t('fois'),_t('fois'))}</span></div>`).join('')}</div>`:_t('<p>Joue quelques parties pour voir tes cartes préférées.</p>')}
  <button type="button" class="skip" data-a="achs">${ii('trophy')} Succès</button><button type="button" class="go" data-a="title">Retour</button>`)}
// historique des parties (les 20 dernières) et victimes au total
function logRun(win){if(G.daily)return;META.kills=(META.kills||0)+G.kills;(META.hist=META.hist||[]).unshift({n:win?G.night:G.night-1,w:win?1:0,m:G.menace||0,k:G.kills,ch:G.char,pl:G.place,d:Date.now()});META.hist=META.hist.slice(0,20);saveMeta(META)}
function end(){
 SFX.play('death');vib([300,120,300]);achCheck();if(G.daily)ach('daily');if(!G.won)logRun(0);else logRun(1);
 clearSave();const nights=G.night-1;
 const before=Z.unlocks(META),newRec=nights>META.best&&nights>0;
 const legs=G.daily?[]:Z.legacies(G);if(legs.length){META.legacy=[...(META.legacy||[]),...legs.map(f=>({name:f.name,t:f.t,kills:f.kills}))].sort((a,b)=>b.kills-a.kills).slice(0,3)}
 let pts=0;if(!G.daily){pts=Z.runPoints(nights,G.kills);META.points=(META.points||0)+pts;META.best=Math.max(META.best,nights);META.total+=nights;META.runs++;saveMeta(META)}giftStart(nights);
 const best=META.best,after=Z.unlocks(META);
 const fresh=[...after.chars.filter(k=>!before.chars.includes(k)).map(k=>_t('Personnage : ')+Z.CHARS[k].n),...after.places.filter(k=>!before.places.includes(k)).map(k=>_t('Lieu : ')+Z.PLACES[k].n),];
 const dailyTxt=G.daily?dailyEnd(nights):'';
 show(_t`<i class="bigstamp ko">Tombé</i><h2 class="ko">L’abri est tombé</h2><p>La horde est entrée pendant la nuit <b>${G.night}</b>.</p><div class="big">${plural(nights,_t('nuit survécue'),_t('nuits survécues'))}</div><p><b>${G.kills}</b> zombies éliminés. Record : <b>${plural(best,_t('nuit'),_t('nuits'))}</b>${newRec?_t(' (nouveau record !)'):''}.</p>${dailyTxt}${legs.length?_t`<p>${ii('medal')} <b>Héritage :</b> ${legs.map(f=>_t`${f.name} (${Z.U[f.t].n}, ${f.kills} zombies)`).join(', ')} ${legs.length>1?_t('laissent'):_t('laisse')} un souvenir pour ta prochaine partie : le premier ${legs.length>1?_t('survivant du même métier'):Z.U[legs[0].t].n} posé aura +1 dégât et +2 PV.</p>`:''}${pts?_t`<p>+<b>${pts}</b> points de survie (total : ${META.points}). Débloque de nouvelles cartes dans la <b>Collection</b>.</p>`:''}${fresh.length?_t`<h3>Débloqué !</h3><ul>${fresh.map(f=>`<li><b>${f}</b></li>`).join('')}</ul>`:''}<h3>Mémorial</h3>${memorialHtml()}<button type="button" class="go" data-a="new">Rejouer</button>${detBtn()}<button type="button" class="skip" data-a="coll">Collection</button><button type="button" class="skip" data-a="title">Accueil</button>`);keepEnd();if(META.gift)giftScreen();
}
const CATN={wall:_t('Défenses'),post:_t('Postes de soutien'),shoot:_t('Tireurs'),melee:_t('Corps à corps'),help:_t('Soutien'),trap:_t('Pièges'),item:_t('Objets'),react:_t('Réactions')};
const deckHtml=()=>Object.keys(CATN).map(c=>`<h3>${CATN[c]}</h3><div class="deck">${Z.KEYS.filter(t=>Z.U[t].cat===c).map(t=>_t`<div class="dk" style="--cc:${cc(t)}">${art(t)}<span><b>${Z.U[t].n}</b>${rarTag(t)}<em class="ce">${Z.cost(t)} énergie</em> · ${Z.U[t].d}${famLine(t)}</span></div>`).join('')}</div>`).join('');
// carte d'un zombie : même cadre, illustration de assets/cards_cartoon/z_<type>.webp, attaque et PV de base
function zombieFace(k){const z=Z.ZT[k],hp=Math.round(z.hp*(z.boss?1:Z.ZHP));
 return _t`<span class="cf zomb"><span class="cf-art" style="background-image:url('assets/cards_cartoon/z_${k}.webp')"></span><span class="cf-vig"></span>
  <span class="cf-name">${z.n}</span><span class="cf-rule"></span><span class="cf-txt${z.info.length>80?' xlong':z.info.length>50?' long':''}"><span>${z.info.charAt(0).toUpperCase()+z.info.slice(1)}</span></span>
  <span class="cf-foot"><span class="cf-atk" title="Dégâts">${ink('atk')}<b>${z.dmg}</b></span><span class="cf-marks"><em>Zombie</em></span><span class="cf-hp" title="PV"><b>${hp}</b></span></span></span>`}
const zedHtml=()=>`<div class="cgrid">${Z.ZK.map(k=>`<div class="citem">${zombieFace(k)}</div>`).join('')}</div>`;
const memorialHtml=()=>(G.fallen||[]).length?`<div class="deck">${G.fallen.map(f=>_t`<div class="dk" style="--cc:var(--muted)">${svg(f.t)}<span><b>${ii('cross')} ${f.name}</b>${Z.U[f.t].n} · ${Z.TRAITS[f.trait]?Z.TRAITS[f.trait].n+' · ':''}${plural(f.kills,_t('zombie'),_t('zombies'))} · tombé la nuit ${f.night}</span></div>`).join('')}</div>`:`<p>${G.shelter>0?_t('Personne n’est tombé. Pour l’instant.'):_t('Aucun survivant n’est tombé au combat.')}</p>`;
// écran d'options : volumes, vitesse de nuit, secousses, taille du texte, langue
let optBack=null,onTitle=false;
function optionsScreen(back){if(back)optBack=back;const pc=v=>Math.round(v*100);
 show(_t`<h2 class="pw">Options</h2><div class="opts">
  <label>Langue<select data-o="lang"><option value="fr" ${OPT.lang==='fr'?'selected':''}>Français</option><option value="en" ${OPT.lang==='en'?'selected':''}>English</option></select></label>
  <label><span>Effets sonores <b>${pc(OPT.sfx)} %</b></span><input type="range" min="0" max="100" step="5" value="${pc(OPT.sfx)}" data-o="sfx"></label>
  <label><span>Musique et ambiance <b>${pc(OPT.mus)} %</b></span><input type="range" min="0" max="100" step="5" value="${pc(OPT.mus)}" data-o="mus"></label>
  <label>Vitesse de la nuit au départ<select data-o="speed">${[1,2,4].map(v=>`<option value="${v}" ${OPT.speed==v?'selected':''}>× ${v}</option>`).join('')}</select></label>
  <label class="chk"><input type="checkbox" data-o="shake" ${OPT.shake?'checked':''}> Secousses de l’écran</label>
  ${navigator.vibrate?_t`<label class="chk"><input type="checkbox" data-o="vib" ${OPT.vib?'checked':''}> Vibrations du téléphone</label>`:''}
  ${(typeof META!=='undefined'&&META.wins>0)?_t`<label>Dos des cartes<select data-o="back"><option value="" ${OPT.back!=='gold'?'selected':''}>Classique</option><option value="gold" ${OPT.back==='gold'?'selected':''}>Doré (victoire)</option></select></label><label>Abri<select data-o="shelter"><option value="" ${OPT.shelter!=='fort'?'selected':''}>Maison</option><option value="fort" ${OPT.shelter==='fort'?'selected':''}>Maison fortifiée (victoire)</option></select></label>`:''}
  <label class="chk"><input type="checkbox" data-o="all" ${OPT.all?'checked':''}> Tout afficher dès le départ (factions, niveaux, collection), pour les joueurs habitués</label>
  <label class="chk"><input type="checkbox" data-o="eco" ${OPT.eco?'checked':''}> Mode économie (petits téléphones : moins d’effets, plateau moins détaillé)</label>
  <label class="chk"><input type="checkbox" data-o="text" ${OPT.text?'checked':''}> Texte plus grand</label>
  <label class="chk"><input type="checkbox" data-o="cb" ${OPT.cb?'checked':''}> Couleurs adaptées au daltonisme (barres de vie bleu, orange et rose)</label>
 </div>${matchMedia('(hover: hover)').matches?_t`<h3>Raccourcis clavier</h3><dl class="keys">${KEYS_HELP.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`:''}<button type="button" class="go" data-a="optclose">Retour</button>`)}
function runInfo(){onTitle=false;
 const counts={};deckList().forEach(t=>counts[t]=(counts[t]||0)+1);
 show(_t`<h2 class="pw">${Z.CHARS[G.char].n}</h2><p><b>${G.kills}</b> zombies éliminés · <b>${G.scrap}</b> ferraille</p>
  <h3>Reliques</h3>${G.relics.length?`<div class="deck">${G.relics.map(r=>`<div class="dk" style="--cc:var(--lantern)">${relicIc(r)}<span><b>${Z.RELICS[r].n}</b>${Z.RELICS[r].d}</span></div>`).join('')}</div>`:_t('<p>Aucune pour l’instant. Tu en trouves une toutes les 5 nuits.</p>')}
  <h3>Mutation instable de la horde</h3>${G.muts.length?`<div class="deck">${G.muts.map(m=>`<div class="dk" style="--cc:var(--blood)">${svg('mut')}<span><b>${Z.MUTS[m].n}</b>${Z.MUTS[m].d}</span></div>`).join('')}</div>`:_t('<p>Aucune pour l’instant. Mutation instable toutes les 5 nuits.</p>')}
  ${seen('fam1')?'':'<!--'}<h3>Factions</h3><div class="deck">${Object.keys(Z.FAM).map(f=>{const F=Z.FAM[f],c=Z.famCounts(G)[f]||0,l=Z.famLevels(G)[f];return `<div class="dk" style="--cc:${l?'var(--lantern)':'var(--muted)'}"><span class="fic">${ink(f)}</span><span><b>${F.n} : ${c}</b>${l?_t('Actif : ')+F.d.slice(0,l).join(' ; '):_t`Encore ${F.lv[0]-c} pour : ${F.d[0]}`}</span></div>`}).join('')}</div>${seen('fam1')?'':'-->'} 
  <h3>Tes survivants</h3>${G.grid.some(u=>u&&u.name)?`<div class="deck">${G.grid.filter(u=>u&&u.name).map(u=>_t`<div class="dk" style="--cc:${cc(u.t)}">${svg(u.t)}<span><b>${u.name}</b>${cardName(u.t)} · ${Z.TRAITS[u.trait].n} (${Z.TRAITS[u.trait].d}) · ${plural(u.kills||0,_t('zombie'),_t('zombies'))} · ${u.hp}/${Z.maxHp(G,u)} PV</span></div>`).join('')}</div>`:_t('<p>Aucun survivant posé.</p>')}
  <button type="button" class="skip" data-a="options">${ii('gear')} Options</button>
  <h3>Mémorial</h3>${memorialHtml()}
  <h3>Ton deck (${deckList().length} cartes)</h3><div class="deck">${Object.entries(counts).map(([t,n])=>`<div class="dk" style="--cc:${cc(t)}">${art(t)}<span><b>${n>1?n+' × ':''}${cardName(t)}</b>${Z.U[t].d}${G.upg[t]?_t` (amélioré : ${Z.upgDesc(t)})`:''}</span></div>`).join('')}</div>
  <button type="button" class="go" data-a="close">Fermer</button>`);
}
function charScreen(){
 const ok=Z.unlocks(META).chars;
 show(_t`<h2 class="pw">Choisis ton survivant</h2><p>Chacun commence avec son propre deck de 8 cartes. Total de nuits survécues : <b>${META.total}</b>.</p>
  <div class="chars">${Object.entries(Z.CHARS).map(([k,c])=>ok.includes(k)?`<button type="button" class="char" data-a="char" data-v="${k}"><b>${c.n}</b><span>${c.d}</span><span class="mini">${c.deck.map(t=>`<i style="color:${cc(t)}">${art(t)}</i>`).join('')}</span></button>`
   :_t`<button type="button" class="char" disabled><b>${ii('lock')} ${c.n}</b><span>Se débloque à ${Z.UNLOCK.chars[k]} nuits survécues au total.</span></button>`).join('')}</div>
  <button type="button" class="skip" data-a="title">Retour</button>`);
}
let pendingChar='surv';
function placeScreen(){
 const ok=Z.unlocks(META).places;if(ok.length===1){newGame(pendingChar,'bois');save();hide();render();return}
 show(_t`<h2 class="pw">Choisis ton lieu</h2><p>Ton record : <b>${plural(META.best,_t('nuit'),_t('nuits'))}</b>.</p>
  <div class="chars">${Object.entries(Z.PLACES).map(([k,p])=>ok.includes(k)?`<button type="button" class="char" data-a="place" data-v="${k}"><b>${p.n}</b><span>${p.d}</span></button>`
   :_t`<button type="button" class="char" disabled><b>${ii('lock')} ${p.n}</b><span>Se débloque avec un record de ${Z.UNLOCK.places[k]} nuits.</span></button>`).join('')}</div>
  <button type="button" class="skip" data-a="new">Retour</button>`);
}
const ov=$('#ov'),panel=$('#panel');
// v142 : les boutons de fin d'écran (Retour, Terminé…) sont rangés sur une étagère qui reste visible quand l'écran défile
function pfoot(){try{const ks=[...panel.children];let k=ks.length;while(k>0&&ks[k-1].matches('button.go,button.skip,.bgrid'))k--;
 if(k<ks.length&&k>0){const f=document.createElement('div');f.className='pfoot'+(ks.slice(k).filter(e=>e.matches('.skip')).length===1?' one':'');ks.slice(k).forEach(e=>f.appendChild(e));panel.appendChild(f)}
 panel.classList.toggle('scrolls',panel.scrollHeight>panel.clientHeight+4)}catch(e){}}
addEventListener('resize',()=>{if(!ov.hidden)panel.classList.toggle('scrolls',panel.scrollHeight>panel.clientHeight+4)});
function show(h,keep){TTL=false;const pv=document.getElementById('preview');if(pv)pv.hidden=true;const y=panel.scrollTop,was=ov.hidden;panel.innerHTML=h;ov.hidden=false;ov.classList.toggle('home',!!onTitle);panel.classList.toggle('ttl',!!panel.querySelector('.logo'));pfoot();panel.scrollTop=keep?y:0;
 // v139 : fondu de l'écran à l'ouverture, contenu qui glisse quand on change d'écran (pas quand on reste sur le même écran)
 if(keep)panel.classList.remove('pin');else{ov.classList.remove('oin');panel.classList.remove('pin');void panel.offsetWidth;if(was)ov.classList.add('oin');panel.classList.add('pin')}
 // v123 : défaite (secousse et voile rouge) et victoire (lueur dorée) animées
 const lose=h.includes('bigstamp ko'),win=h.includes('bigstamp ok');panel.classList.remove('lose','win');ov.classList.remove('lose','win');if(lose||win){void panel.offsetWidth;panel.classList.add(lose?'lose':'win');ov.classList.add(lose?'lose':'win')}
 countUp()}
// les chiffres marqués data-count défilent de 0 à leur valeur
function countUp(){if(reduce)return;panel.querySelectorAll('[data-count]').forEach(el=>{const n=+el.dataset.count;if(!(n>0))return;const t0=performance.now();el.textContent='0';
 const f=now=>{const p=clamp((now-t0)/900,0,1);el.textContent=Math.round(n*ease(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
function hide(){ov.hidden=true;requestAnimationFrame(()=>{try{animPiles()}catch(e){}})}
/* ---------- collection, decks et préparation de la partie ---------- */
// héritage : les souvenirs des survivants tombés passent à la partie qui commence (une seule fois)
function takeLegacy(){G.legacy=[];if(META.legacy&&META.legacy.length){META.legacy=[];saveMeta(META)}}
const legacyTxt=()=>'';const legacyTxt0=()=>(META.legacy||[]).length?_t`<p>${ii('medal')} Souvenirs pour cette partie : ${META.legacy.map(l=>_t`<b>${l.name}</b> (${Z.U[l.t].n}, ${l.kills} zombies) : ton premier ${Z.U[l.t].n} posé aura +1 dégât et +2 PV`).join(' ; ')}.</p>`:'';
function ensureMeta(){if(!META.cards||!META.cards.length)META.cards=Z.STARTER_CARDS.slice();if(META.points==null)META.points=(META.total||0)*5;
 if(!META.decks)META.decks=[0,1,2].map(()=>Z.STARTER_DECK.slice());if(META.slot==null)META.slot=0;if(META.menace==null)META.menace=0;if(META.menaceWon==null)META.menaceWon=-1;if(META.wins==null)META.wins=0;if(!META.relicsUnl)META.relicsUnl=[];if(!META.startPool)META.startPool=[];saveMeta(META)}
ensureMeta();
const PREP={ch:'surv',pl:'bois',menace:0,relic:''};
// niveaux de Menace : on choisit le niveau avant la partie ; chaque victoire débloque le suivant (jusqu'à 10)
const menaceTabs=()=>`<div class="tabs wrap menace">${Array.from({length:Z.MENACE_MAX+1},(_,k)=>k<=(META.menace||0)?`<button type="button" class="tab${k===PREP.menace?' on':''}" data-a="prepmen" data-v="${k}">${k}${k<=META.menaceWon?' ✓':''}</button>`:`<button type="button" class="tab" disabled>${ii('lock')} ${k}</button>`).join('')}</div>`;
const menaceTxt=m=>m?_t`<b>Mutation ${m}</b> (tous les niveaux jusqu’au ${m} s’additionnent) :</p><ul class="mlist">${Z.MENACES.slice(1,m+1).map((x,k)=>`<li><b>${k+1}. ${x.n}</b> : ${x.d}.</li>`).join('')}</ul><p>Victoire : +${Z.winPoints(m)} points de survie${m<Z.MENACE_MAX?_t` et la Mutation ${m+1} débloquée`:''}.`:_t`<b>Mutation 0</b> : la horde d’origine.${(META.menace||0)<1?_t` Gagne la nuit ${Z.WIN_NIGHT} pour débloquer la Mutation 1.`:''}`;
const deckCount=d=>{const c={};d.forEach(t=>c[t]=(c[t]||0)+1);return c};
function prepScreen(){const u=Z.unlocks(META);PREP.menace=Math.max(0,Math.min(META.menace||0,PREP.menace??META.menaceSel??0));if(!u.chars.includes(PREP.ch))PREP.ch='surv';if(!u.places.includes(PREP.pl))PREP.pl='bois';
 const d=META.decks[META.slot],err=Z.deckError(d,META.cards),fc={};d.forEach(t=>{const f=Z.famOf(t);if(f)fc[f]=(fc[f]||0)+1});
 show(_t`<h2 class="pw">Préparer la partie</h2>
  <h3>Ton deck</h3><div class="tabs">${META.decks.map((x,k)=>_t`<button type="button" class="tab${k===META.slot?' on':''}" data-a="prepdeck" data-v="${k}">Deck ${k+1}<small>${x.length} cartes</small></button>`).join('')}</div>
  <p>${err?`<span class="bad">${err}</span>`:_t`<b>${d.length}</b> cartes${seen('fam1')?' · '+(Object.entries(fc).sort((a,b)=>b[1]-a[1]).map(([f,n])=>`${ink(f)} ${n}`).join(' ')||_t('aucune faction')):''}`}</p>
  <button type="button" class="skip" data-a="edit">Modifier le deck ${META.slot+1}</button>
  <h3>Ton survivant</h3><div class="tabs wrap">${Object.keys(Z.CHARS).map(k=>u.chars.includes(k)?`<button type="button" class="tab${k===PREP.ch?' on':''}" data-a="prepch" data-v="${k}">${Z.CHARS[k].n}</button>`:`<button type="button" class="tab" disabled>${ii('lock')} ${Z.CHARS[k].n}</button>`).join('')}</div>
  <p>${Z.CHARS[PREP.ch].d}</p>
  <h3>Ton lieu</h3><div class="tabs wrap">${Object.keys(Z.PLACES).map(k=>u.places.includes(k)?`<button type="button" class="tab${k===PREP.pl?' on':''}" data-a="preppl" data-v="${k}">${Z.PLACES[k].n}</button>`:`<button type="button" class="tab" disabled>${ii('lock')} ${Z.PLACES[k].n}</button>`).join('')}</div>
  <p>${Z.PLACES[PREP.pl].d}</p>
  <h3>Mutation de la horde</h3>${menaceTabs()}<p>${menaceTxt(PREP.menace)}</p>
  <h3>Relique de départ</h3>${(META.startPool||[]).length?_t`<div class="tabs wrap"><button type="button" class="tab${!PREP.relic?' on':''}" data-a="preprel" data-v="">Aucune</button>${META.startPool.map(r=>`<button type="button" class="tab${PREP.relic===r?' on':''}" data-a="preprel" data-v="${r}">${Z.RELICS[r].n}</button>`).join('')}</div><p>${PREP.relic?`<b>${Z.RELICS[PREP.relic].n}</b> : ${Z.RELICS[PREP.relic].d}.`:_t('Tu commences sans relique en plus.')}</p>`:_t('<p>Chaque victoire ajoute une relique à ta réserve : tu pourras en choisir une ici avant la partie.</p>')}
  ${legacyTxt()}<button type="button" class="go" data-a="start" ${err?'disabled':''}>Commencer</button>
  <div class="bgrid"><button type="button" class="skip" data-a="coll">Collection · ${META.points} pts</button><button type="button" class="skip" data-a="title">Retour</button></div>`)}
/* recherche et tri des cartes (collection et éditeur de deck) */
const CF={q:'',sort:'cat',fam:'',own:'',role:''};
const RORD={com:0,rare:1,epic:2,leg:3};
const norm=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function cfBar(own){return _t`<div class="cfbar"><input type="search" data-f="q" placeholder="Chercher une carte…" value="${CF.q.replace(/"/g,'&quot;')}" aria-label="Chercher une carte">
 <select data-f="sort" aria-label="Trier"><option value="cat">Par type</option><option value="cost">Par coût</option><option value="rar">Par rareté</option><option value="name">Par nom</option><option value="fam">Par faction</option></select>
 <select data-f="role" aria-label="Rôle ou type"><option value="">Tous les rôles</option><optgroup label="Rôle"><option value="tank">Tank</option><option value="heal">Soin</option><option value="dps">DPS</option></optgroup><optgroup label="Type">${Object.keys(CATN).map(c=>`<option value="c:${c}">${CATN[c]}</option>`).join('')}</optgroup></select>
 <select data-f="fam" aria-label="Faction"><option value="">Toutes les factions</option>${Object.keys(Z.FAM).map(f=>`<option value="${f}">${Z.FAM[f].n}</option>`).join('')}<option value="-">Sans faction</option></select>
 ${own?_t`<select data-f="own" aria-label="Débloquées"><option value="">Toutes</option><option value="y">Débloquées</option><option value="n">À débloquer</option><option value="b">À portée</option></select>`:''}</div>`}
function cfGrid(ts,item){
 ts=ts.filter(t=>!CF.fam||(CF.fam==='-'?!Z.famOf(t):Z.famOf(t)===CF.fam));
 ts=ts.filter(t=>!CF.role||(CF.role.startsWith('c:')?Z.U[t].cat===CF.role.slice(2):Z.roleOf(t)===CF.role));
 const key=t=>`<div class="citem-w" data-n="${norm(Z.U[t].n+' '+(Z.U[t].d||''))}">${item(t)}</div>`;
 if(CF.sort==='cat')return Object.keys(CATN).map(c=>{const g=ts.filter(t=>Z.U[t].cat===c);return g.length?`<section class="cfsec"><h3>${CATN[c]}</h3><div class="cgrid">${g.map(key).join('')}</div></section>`:''}).join('')||_t('<p>Aucune carte.</p>');
 const by={cost:t=>Z.cost(t),rar:t=>-RORD[Z.RAR[t]||'com'],name:()=>0,fam:t=>Z.famOf(t)?Object.keys(Z.FAM).indexOf(Z.famOf(t)):99}[CF.sort];
 const s=ts.slice().sort((a,b)=>by(a)-by(b)||Z.U[a].n.localeCompare(Z.U[b].n,'fr'));
 return s.length?`<section class="cfsec"><div class="cgrid">${s.map(key).join('')}</div></section>`:_t('<p>Aucune carte.</p>')}
// filtre texte sans redessiner (le champ garde le focus)
function cfApply(){const q=norm(CF.q.trim());panel.querySelectorAll('.citem-w').forEach(e=>e.hidden=!!q&&!e.dataset.n.includes(q));
 panel.querySelectorAll('.cfsec').forEach(s=>s.hidden=!s.querySelector('.citem-w:not([hidden])'))}
function cfSync(){panel.querySelectorAll('[data-f]').forEach(e=>{if(e.tagName==='SELECT')e.value=CF[e.dataset.f]});cfApply()}
function deckEditor(keep){const d=META.decks[META.slot],cnt=deckCount(d),err=Z.deckError(d,META.cards);
 show(_t`<h2 class="pw">Deck ${META.slot+1}</h2><p><b>${d.length}</b> / ${Z.DECK_MAX} cartes (minimum ${Z.DECK_MIN}). ${err?`<span class="bad">${err}</span>`:_t('Prêt.')} Commune ×3, rare ×2, épique ×1 au maximum.</p>
  ${cfBar(false)}${cfGrid(META.cards.slice(),t=>`<div class="citem${cnt[t]?' in':''}">${cardFace(t,{base:1})}<span class="qty"><button type="button" data-a="dkm" data-v="${t}" ${cnt[t]?'':'disabled'}>−</button><b>${cnt[t]||0}/${Z.copyMax(t)}</b><button type="button" data-a="dkp" data-v="${t}" ${(cnt[t]||0)>=Z.copyMax(t)||d.length>=Z.DECK_MAX?'disabled':''}>+</button></span></div>`)}
  <button type="button" class="go" data-a="new">Terminé</button><button type="button" class="skip" data-a="dkreset">Remettre le deck de départ</button><button type="button" class="skip" data-a="coll">Collection</button>`,keep);cfSync()}
function collectionScreen(keep){const own=META.cards,pts=META.points,price=t=>Z.CARD_PRICE[Z.RAR[t]||'com'];
 // trois états bien distincts : débloquée (couleur + coche), achetable maintenant (couleur, cadre doré, bouton), hors de portée (grisée + cadenas)
 const state=t=>own.includes(t)?'in':Z.U[t].vic!=null?'vic':pts>=price(t)?'buy':'far';
 const nIn=Z.KEYS.filter(t=>own.includes(t)).length,nBuy=Z.KEYS.filter(t=>state(t)==='buy').length;
 show(_t`<h2 class="pw">Collection</h2><p>Tu as <b>${pts}</b> points de survie. Chaque partie en rapporte : 10 par nuit survécue, plus 1 tous les 4 zombies. Une carte débloquée l’est pour toujours.</p>
  <div class="csum"><span class="cs-in">${nIn}/${Z.KEYS.length} débloquées</span><span class="cs-buy">${ii('unlock')} ${nBuy} à portée</span></div>
  <button type="button" class="skip evob" data-a="evo">✦ Évolutions secrètes · ${(META.evo||[]).filter(k=>Z.EVO[k]).length}/${Z.EVO_KEYS.length} découvertes</button>
  ${cfBar(true)}${cfGrid(Z.KEYS.filter(t=>!CF.own||(CF.own==='b'?state(t)==='buy':(CF.own==='y')===own.includes(t))),t=>{const st=state(t),pr=price(t);
   const badge=st==='in'?'':st==='vic'?`<span class="cbadge vic">${ii('trophy')}</span>`:st==='far'?`<span class="cbadge lk">${ii('lock')}</span>`:'';
   const foot=st==='in'?_t('<b class="cok">Débloquée</b>')
    :st==='vic'?_t`<b class="vlock">${ii('trophy')} Victoire en Mutation ${Z.U[t].vic}</b>`
    :st==='buy'?_t`<button type="button" class="buy ok" data-a="unlock" data-v="${t}">${ii('unlock')} Débloquer · ${pr} pts</button>`
    :_t`<span class="cfar"><span>${ii('lock')} ${pr} pts</span><small>il en manque ${pr-pts}</small></span>`;
   return `<div class="citem s-${st}${st==='in'?' in':st==='buy'?'':' locked'}">${badge}${cardFace(t,{base:1})}<span class="qty">${foot}</span></div>`})}
  <button type="button" class="go" data-a="new">Préparer une partie</button><button type="button" class="skip" data-a="title">Accueil</button>`,keep);cfSync()}
// page des évolutions secrètes : les cartes découvertes en grand avec leur recette, les autres en silhouette avec un indice
function evoScreen(){const ev=META.evo||[],n=Z.EVO_KEYS.filter(k=>ev.includes(k)).length;
 show(_t`<h2 class="pw">Évolutions secrètes</h2><p>Deux cartes précises posées <b>côte à côte</b> sur le plateau se transforment en une unité unique. C’est une <b>nouvelle carte</b> : les deux cartes de la recette repartent aussitôt dans ta défausse. La carte évoluée n’entre jamais dans le deck ni la défausse : blessée, elle part en réserve ; détruite, elle disparaît. Tu en as découvert <b>${n} sur ${Z.EVO_KEYS.length}</b>.</p>
  <div class="cgrid">${Z.EVO_KEYS.map(k=>{const [a,b]=Z.EVO[k];return ev.includes(k)?`<div class="citem in">${cardFace(k,{base:1})}<span class="qty recipe">${Z.U[a].n} + ${Z.U[b].n}</span></div>`
   :_t`<div class="citem evo-x"><span class="cf"><span class="cf-art"><i class="evo-sil" style="background-image:url('assets/sprites_cartoon/${k}.webp')"></i></span><span class="cf-vig"></span><span class="cf-name">???</span><span class="cf-txt"><span>Pas encore découverte</span></span></span><span class="qty recipe">Indice : ${Z.U[a].n} + ?</span></div>`}).join('')}</div>
  <button type="button" class="go" data-a="coll">Collection</button><button type="button" class="skip" data-a="title">Accueil</button>`)}
const ACT={
 testmode:()=>{onTitle=true;show(_t`<h2 class="pw">Mode test</h2><p>Pour essayer les cartes : tu choisis la nuit de départ, l’énergie est illimitée, 999 ferraille, et le bouton <b>« + Carte (test) »</b> met n’importe quelle carte dans ta main. <b>Rien n’est enregistré</b> : ni record, ni points, ni succès, ni sauvegarde.</p>
  <label class="tnight">Nuit de départ <input type="number" id="tnight" min="1" max="60" value="${TEST_N}" inputmode="numeric"></label>
  <label class="chk"><input type="checkbox" id="tprog" ${TEST_P?'checked':''}> Progression simulée : les reliques et la mutation de la horde d’une vraie partie, et des survivants avec des niveaux (1 niveau toutes les 6 nuits)</label>
  <button type="button" class="go" data-a="teststart">Lancer</button><button type="button" class="skip" data-a="title">Accueil</button>`)},
 teststart:()=>{const el=document.getElementById('tnight');TEST_N=Math.max(1,Math.min(60,Math.round(+(el&&el.value)||1)));const pc=document.getElementById('tprog');TEST_P=!pc||pc.checked;
  newGame('surv','bois',null,Z.STARTER_DECK);TEST=true;GUIDE=false;G.test=1;G.night=TEST_N;if(TEST_P)Z.testProgress(G,TEST_N,R);G.energy=99;G.scrap=999;G.pool=Z.KEYS.filter(t=>!Z.U[t].evo);onTitle=false;hide();render()},
 tcards:()=>{if(!TEST||S.busy)return;const full=S.hand.length>=Z.HAND_MAX;
  show(_t`<h2 class="pw">Ajouter une carte</h2><p>Main : <b>${S.hand.length}/${Z.HAND_MAX}</b>${full?_t(' · <span class="bad">main pleine : joue une carte d’abord</span>'):''}</p><input type="search" class="tq" placeholder="Chercher une carte" aria-label="Chercher une carte" oninput="const q=this.value.toLowerCase();this.parentElement.querySelectorAll('[data-a=tadd]').forEach(b=>b.hidden=q&&!b.dataset.n.includes(q))">`
   +Object.keys(CATL).map(c=>{const ks=Z.KEYS.filter(t=>Z.U[t].cat===c);return ks.length?`<h3>${CATL[c]}</h3><div class="cgrid tgrid">${ks.map(t=>`<button type="button" class="citem in" data-a="tadd" data-v="${t}" data-n="${Z.U[t].n.toLowerCase()}" ${full?'disabled':''}>${cardFace(t,{mini:1})}</button>`).join('')}</div>`:''}).join('')
   +_t`<button type="button" class="go" data-a="closeov">Fermer</button>`)},
 tadd:v=>{if(!TEST||!Z.U[v]||S.hand.length>=Z.HAND_MAX)return;S.hand.push(v);render();ACT.tcards()},
 options:()=>optionsScreen(onTitle?'title':USERP||panel.querySelector('[data-a=presume]')?'pause':'game'),
 optclose:()=>{if(optBack==='pause')pauseMenu();else if(optBack==='game'){hide();render()}else title()},
 presume:()=>{hide();unpause();render()},
 pquit:()=>{abortNight();title()},
 prestart:()=>show(_t`<h2 class="ko">Recommencer ?</h2><p>La partie en cours sera <b>perdue</b>, sans points de survie.</p><button type="button" class="go" data-a="prestart2">Oui, recommencer</button><button type="button" class="skip" data-a="pmenu">Non, retour</button>`),
 prestart2:()=>{const t=TEST,d=G.daily;abortNight();clearSave();if(t)ACT.testmode();else if(d)ACT.daily();else ACT.new()},
 pmenu:()=>pauseMenu(),
 closeov:()=>{hide();render()},
 bpick:v=>{S.bsel=+v;S.sel=null;S.moveFrom=null;S.inspect=null;hide();render()},
 artstyle:()=>{ART_STYLE=ART_STYLE==='cartoon'?'real':'cartoon';try{localStorage.setItem('abri-style',ART_STYLE)}catch(e){}title()},
 new:()=>{endTest();if(novice()){PREP.ch='surv';PREP.pl='bois';PREP.menace=0;PREP.relic='';return ACT.start()}prepScreen()},
 prepdeck:v=>{META.slot=+v;saveMeta(META);prepScreen()},
 prepch:v=>{PREP.ch=v;prepScreen()},
 preppl:v=>{PREP.pl=v;prepScreen()},
 'win-leave':()=>leaveWin(),
 'win-stay':()=>{G.endless=1;save();SFX.play('ui');dawn()},
 preprel:v=>{PREP.relic=v||'';prepScreen()},
 prepmen:v=>{PREP.menace=+v;META.menaceSel=+v;saveMeta(META);prepScreen()},
 start:()=>{const d=META.decks[META.slot];if(Z.deckError(d,META.cards))return;newGame(PREP.ch,PREP.pl,null,d);G.relicPool=(META.relicsUnl||[]).slice();Z.applyMenace(G,PREP.menace,R);if(PREP.relic&&(META.startPool||[]).includes(PREP.relic)&&!G.relics.includes(PREP.relic)){Z.addRelic(G,PREP.relic);if(PREP.relic==='pacte'||PREP.relic==='fanion')G.energy++}takeLegacy();save();hide();render()},
 edit:()=>deckEditor(),
 dkp:v=>{const d=META.decks[META.slot];if(d.length<Z.DECK_MAX&&(deckCount(d)[v]||0)<Z.copyMax(v)&&META.cards.includes(v)){d.push(v);saveMeta(META)}deckEditor(1)},
 dkm:v=>{const d=META.decks[META.slot],k=d.indexOf(v);if(k>=0){d.splice(k,1);saveMeta(META)}deckEditor(1)},
 dkreset:()=>{META.decks[META.slot]=Z.STARTER_DECK.slice();saveMeta(META);deckEditor()},
 coll:()=>{if(!seen('coll')){META.hints=META.hints||{};META.hints.coll=1;saveMeta(META)}collectionScreen()},
 mdet:()=>detScreen(),
 achs:()=>achScreen(),
 gift:giftTap,gyes:giftTake,gno:()=>panel.querySelectorAll('.gconf').forEach(e=>e.remove()),gdone:giftDone,
 mback:()=>{if(S.endHtml)show(S.endHtml);else title()},
 evo:()=>evoScreen(),
 unlock:v=>{if(Z.U[v].vic!=null)return;const pr=Z.CARD_PRICE[Z.RAR[v]||'com'];if(!META.cards.includes(v)&&META.points>=pr){META.points-=pr;META.cards.push(v);saveMeta(META);SFX.play('dawn');achCheck()}collectionScreen(1)},
 char:v=>{pendingChar=v;placeScreen()},
 place:v=>{newGame(pendingChar,v);save();hide();render()},
 load:()=>{const d=loadSave();if(d)resume(d);else prepScreen()},
 title:()=>title(),
 close:()=>hide(),
 rules:()=>show(_t`<h2 class="pw">Règles du jeu</h2>${rulesHtml()}<button type="button" class="skip" data-a="retuto">Rejouer la première nuit guidée</button><button type="button" class="go" data-a="title">Retour</button>`),
 stats:()=>statsScreen(),
 rgo:v=>{const e=document.getElementById('r-'+v);if(e)e.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})},
 retuto:()=>{TUTO=0;try{localStorage.setItem('abri-tuto','0')}catch(e){}ACT.new()},
 deck:()=>show(_t`<h2 class="pw">Le bestiaire</h2><p>Les zombies de la horde et leurs mutations. Tes cartes sont dans la Collection.</p>${zedHtml()}<h2 class="pw">Les mutations instables</h2><p>Une seule à la fois, elle change toutes les 5 nuits.</p><div class="deck">${Object.values(Z.MUTS).map(m=>`<div class="dk" style="--cc:var(--blood)">${svg('mut')}<span><b>${m.n}</b>${m.d}</span></div>`).join('')}</div><button type="button" class="go" data-a="title">Retour</button>`),
 dawn:()=>dawn(),
 lvl:v=>{const i=S.picks&&S.picks[0];if(i!=null&&Z.levelUp(G,i,v==='atk'?'atk':'def')){const p=tc(i);floatTxt(p.x,p.y-20,v==='atk'?_t('+1 dégât'):_t('+3 PV'),'#9fd86b',15);addFX({type:'ring',x:p.x,y:p.y,r:44,c:'#9fd86b',dur:500})}S.phase=null;save();render();dawn()},
 relic:v=>{Z.addRelic(G,v);SFX.play('relic');afterRelic()},
 evc:v=>{const id=S.picks&&S.picks[0];if(!id)return dawnStep('draft');const r=Z.resolveDawn(G,id,+v,R,deckList());
  (r.cards||[]).forEach(t=>S.discard.push(t));if(G.drawNow){drawCards(Math.min(G.drawNow,Math.max(0,Z.HAND_MAX-S.hand.length)));G.drawNow=0}syncBoard();S.phase='draft';S.picks=null;save();render();SFX.play('ui');
  show(_t`<h2 class="pw">${Z.DAWN[id].n}</h2><p>${r.txt}</p>${r.cards&&r.cards.length?_t`<p>Ajouté à ton deck : <b>${r.cards.map(t=>Z.U[t].n).join(', ')}</b>.</p>`:''}<button type="button" class="go" data-a="todraft">Continuer</button>`)},
 todraft:()=>dawnStep('draft'),
 draft:v=>{const k=v?S.draw.indexOf(v):-1;if(k>=0){S.draw.splice(k,1);S.next=v;SFX.play('card')}dawnStep('shop')},
 shop:()=>shopScreen(),
 'shop-heal':()=>{if(Z.pay(G,'heal'))render();shopScreen()},
 'shop-store':()=>{if(Z.pay(G,'store')){S.store={c:Z.storeOffer(G,deckTypes(),R),b:[]};save();render();SFX.play('ui')}storeScreen()},
 'store-open':()=>storeScreen(),
 'store-back':()=>shopScreen(),
 'store-buy':v=>{const st=S.store;if(!st||!v)return;if(v==='shell'?ammoOwned()>=Z.ammoMax(G):(st.b.includes(v)||!st.c.includes(v)))return;
  if(!Z.buyStore(G,v))return;if(v!=='shell')st.b.push(v);if(S.hand.length<Z.HAND_MAX)S.hand.push(v);else S.discard.push(v);SFX.play('place');save();render();storeScreen()},
 'shop-upgrade':()=>listScreen(_t('Améliorer une carte'),_t('Toutes les cartes de ce type seront améliorées, y compris celles déjà posées.'),deckTypes().filter(t=>Z.UPGRADABLE.includes(t)&&!G.upg[t]),'up-pick'),
 'shop-remove':()=>listScreen(_t('Jeter une carte'),_t('Une carte de ce type quitte ton deck pour cette partie (les unités posées ne comptent pas).'),pileTypes(),'rm-pick'),
 'up-pick':v=>{if(Z.pay(G,'upgrade'))Z.upgrade(G,v);render();shopScreen()},
 'rm-pick':v=>{if(pileList().includes(v)&&Z.pay(G,'remove'))removeCard(v);shopScreen()},
 day:()=>nextDay(),
 nightpick:()=>{S.store=null;return Z.nightChoice(G,R)?nightScreen():nextDay()},
 nightgo:v=>{const o=S.picks&&S.picks[+v];nextDay(o)},
 daily:()=>dailyScreen(),
 'daily-go':()=>{const day=today();DLY={day,plan:dailyPlan(day),picks:[]};dailyDraft()},
 dpick:v=>{if(!DLY||!Z.U[v]||!DLY.plan.offers[DLY.picks.length].includes(v))return;DLY.picks.push(v);dailyDraft()},
 peek:v=>{const k=S.draw.lastIndexOf(v);if(k>=0){S.draw.splice(k,1);S.hand.push(v)}save();hide();render()}
};
// barre de recherche / tri : le texte filtre sur place, les listes redessinent l'écran ouvert
panel.addEventListener('input',e=>{const f=e.target.dataset&&e.target.dataset.f;if(f==='q'){CF.q=e.target.value;cfApply()}});
panel.addEventListener('change',e=>{const f=e.target.dataset&&e.target.dataset.f;if(!f||f==='q')return;CF[f]=e.target.value;(panel.querySelector('[data-a=dkreset]')?deckEditor:collectionScreen)(true)});
panel.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const f=ACT[b.dataset.a];if(f)f(b.dataset.v)});
panel.addEventListener('input',e=>{const el=e.target.closest('[data-o]');if(!el)return;const k=el.dataset.o;
 if(k==='sfx'||k==='mus'){OPT[k]=+el.value/100;const b=el.parentElement.querySelector('b');if(b)b.textContent=el.value+(LANG==='fr'?' %':'%')}
 else if(k==='speed')OPT.speed=+el.value;else if(k==='shake'||k==='text'||k==='eco'||k==='vib'||k==='all'||k==='cb'){OPT[k]=el.checked?1:0;if(k==='vib'&&OPT.vib)vib(60)}else if(k==='lang'){OPT.lang=el.value;saveOpt();location.reload();return}else if(k==='back')OPT.back=el.value;else if(k==='shelter')OPT.shelter=el.value;
 saveOpt();applyOpt();if(k==='sfx')SFX.play('ui')});
$('#go').addEventListener('click',()=>{if(S.pause)resumeWave();else if(S.busy){SPEED=SPEED===1?2:SPEED===2?4:1;render()}else night()});

function nextUnlockTxt(){const u=Z.unlocks(META),nx=[];
 for(const k in Z.UNLOCK.chars)if(!u.chars.includes(k))nx.push([Z.UNLOCK.chars[k]-META.total,_t`${Z.CHARS[k].n} dans ${Z.UNLOCK.chars[k]-META.total} nuits au total`]);
 for(const k in Z.UNLOCK.cards)if(!u.pool.includes(k))nx.push([Z.UNLOCK.cards[k]-META.total,_t`la carte ${Z.U[k].n} dans ${Z.UNLOCK.cards[k]-META.total} nuits au total`]);
 for(const k in Z.UNLOCK.places)if(!u.places.includes(k))nx.push([99,_t`${Z.PLACES[k].n} avec un record de ${Z.UNLOCK.places[k]} nuits`]);
 nx.sort((a,b)=>a[0]-b[0]);return nx.length?_t`<p>Prochain déblocage : ${nx[0][1]}.</p>`:''}
