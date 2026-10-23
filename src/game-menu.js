/* Dernier Abri : défi quotidien, tableau des combats, menu pause, raccourcis, accueil et démarrage.
   Les fichiers src/game*.js partagent leurs variables (scripts classiques chargés dans l’ordre par index.html). */
/* ---------- défi du jour (v151) : une seule nuit contre la horde du jour, 8 cartes tirées « 1 parmi 3 », même tirage pour tout le monde ---------- */
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
// ancien défi (une partie complète) : fin d'une partie sauvegardée avant la v151
function dailyEnd(n){return ''}
const dailyPlan=day=>Z.dailyPlan(rng(seedFrom('defi-'+day)));
function dailyBest(day){try{const d=JSON.parse(localStorage.getItem('abri-defi'))||{};return d[day]??null}catch(e){return null}}
let DLY=null; // tirage en cours : {day, plan, picks}
// la horde du jour : une carte par type de zombie, avec le nombre
// nombre réel de chaque type (pleine lune, mutation et lieu compris)
const hordeHtml=p=>{const w=Z.waveList(Z.dailyState(p,[],()=>.5));return `<div class="dzs">${Z.ZK.filter(k=>w[k]>0).map(k=>`<div class="dzc">${zombieFace(k)}<b class="dzn">×${w[k]}</b></div>`).join('')}</div>`};
const dailyRules=p=>{const e=Z.EVENTS.find(x=>x.id===p.event)||Z.EVENTS[0];return `<ul class="dmods">${p.event!=='calme'?`<li><b>${e.n}</b> : ${e.d}</li>`:''}${p.mut?_t`<li>Mutation <b>${Z.MUTS[p.mut].n}</b> : ${Z.MUTS[p.mut].d}</li>`:''}<li>${_t('Personnage')} : <b>${Z.CHARS[p.ch].n}</b> · ${_t('Lieu')} : <b>${Z.PLACES[p.pl].n}</b></li></ul>`};
function dailyScreen(){const day=today(),p=dailyPlan(day),b=dailyBest(day);
 show(_t`<h2 class="pw">Défi du jour</h2><p>Une seule nuit contre <b>la horde du jour</b>, aussi forte qu’une nuit ${p.night}. Tout le monde affronte la même horde et tire les mêmes cartes.</p>
  ${hordeHtml(p)}${dailyRules(p)}
  <p>Choisis <b>${Z.DAILY.picks} cartes</b>, une parmi 3 à chaque tirage, dans toute la collection. Énergie illimitée, survivants au niveau ${Z.DAILY.lv}.</p>
  ${b!==null?_t`<p>Ton meilleur score aujourd’hui : <b>${b}</b>.</p>`:''}<p>Les défis ne comptent pas pour les déblocages.</p>
  <button type="button" class="go" data-a="daily-go">Tirer mes cartes</button><button type="button" class="skip" data-a="title">Retour</button>`)}
function dailyDraft(){const d=DLY,p=d.plan,k=d.picks.length;
 if(k>=Z.DAILY.picks)return dailyStart();
 show(_t`<h2 class="pw">Tirage ${k+1} sur ${Z.DAILY.picks}</h2><p>Garde une carte. ${Z.DAILY.picks-k>1?_t`Encore ${Z.DAILY.picks-k-1} après celle-ci.`:_t('C’est la dernière.')}</p>
  <div class="picks">${p.offers[k].map(t=>pickBtn(t,'dpick',t)).join('')}</div>
  ${k?_t`<p class="dgot">Tes cartes : ${d.picks.map(t=>`<b>${Z.U[t].n}</b>`).join(', ')}</p>`:''}
  <details class="dhorde"><summary>${_t('La horde du jour')}</summary>${hordeHtml(p)}${dailyRules(p)}</details>`)}
function dailyStart(){const d=DLY;DLY=null;newGame(d.plan.ch,d.plan.pl,d.day,d.picks,d.plan);save();hide();render()}
// fin du défi : gagné si l'abri tient, score = zombies tués + bonus de victoire et PV restants
function dailyOver(){const won=G.shelter>0,sc=Z.dailyScore(G,won),day=G.daily,tot=Object.values(G.fixedW||{}).reduce((a,b)=>a+b,0);let prev=null;
 try{const d=JSON.parse(localStorage.getItem('abri-defi'))||{};prev=d[day]??null;if(prev===null||sc>prev){d[day]=sc;localStorage.setItem('abri-defi',JSON.stringify(d))}}catch(e){}
 try{ach('daily');achCheck()}catch(e){}clearSave();
 if(won){SFX.play('dawn');vib([100,60,100])}else{SFX.play('death');vib([300,120,300])}
 show(_t`<i class="bigstamp ${won?'ok':'ko'}">${won?_t('Tenu'):_t('Tombé')}</i><h2 class="${won?'ok':'ko'}">${won?_t('L’abri a tenu !'):_t('L’abri est tombé')}</h2>
  <div class="big">${_t`Score : ${sc}`}</div>
  <p><b>${G.kills}</b> zombies éliminés${won?_t`, <b>${Math.max(0,G.shelter)}</b> PV d’abri restants`:''}.</p>
  <p class="dsc">${_t`Score : ${Z.DAILY.score.kill} par zombie, plus ${Z.DAILY.score.win} en cas de victoire et ${Z.DAILY.score.hp} par PV d’abri restant.`}</p>
  <p>${prev!==null&&prev>=sc?_t`Ton meilleur score aujourd’hui : <b>${prev}</b>.`:prev!==null?_t('Nouveau meilleur score du jour !'):''} ${_t('Tout le monde a la même horde aujourd’hui : compare avec tes amis.')}</p>
  <button type="button" class="go" data-a="daily">Rejouer le défi</button><button type="button" class="skip" data-a="title">Accueil</button>`)}
// règles du jeu (v123) : des fiches illustrées, avec un sommaire pour sauter à une fiche
const RULES=[
 ['but','trophy',_t('Le but'),()=>_t`<p>Tiens <b>${Z.WIN_NIGHT} nuits</b>. À l’aube de la nuit ${Z.WIN_NIGHT}, après le Patient Zéro, les secours arrivent : tu peux <b>partir</b> (victoire) ou <b>rester</b> en mode infini pour le score, jusqu’à ce que la horde gagne.</p><p>Chaque victoire débloque une <b>Mutation de la horde</b> plus dure (10 niveaux, à choisir avant la partie), une carte de victoire et des reliques.</p>`],
 ['jour','bolt',_t('Le jour'),()=>_t`<p>Tu as <b>${Z.ENERGY} énergies</b> par jour. Chaque carte coûte 0 à 3 : touche-la puis touche une case, ou glisse-la sur le plateau. Les cartes non jouées restent en main.</p><p>Les <b>murs et barbelés</b> se tracent : une carte donne plusieurs cases pour la journée, une par une ou d’un glissé en ligne.</p><p>Tu peux <b>déplacer</b> ce que tu as posé, et <b>rappeler</b> une unité dans ta réserve pour la reposer gratuitement plus tard.</p><p><b>Limite</b> : ${Z.unitCap(G||{night:1})} unités au plus sur le terrain (+1 toutes les 10 nuits). Murs, pièges et postes de soutien ne comptent pas.</p>`],
 ['nuit','moon',_t('La nuit'),()=>_t`<p>Les zombies sortent de la forêt <b>par les 4 routes</b> et marchent vers l’abri : un mur en travers d’une route la ferme. Ils contournent tes défenses si le détour est plus court, sinon ils attaquent le point le plus faible.</p><p>Tes survivants se défendent <b>tout seuls</b>. Garde de l’énergie pour tes cartes <b>Réaction</b> (grenade, tir de l’abri…), jouables pendant l’attaque.</p><p>Dans la forêt, les zombies sont <b>intouchables</b>. Si l’un d’eux blesse l’abri, c’est la <b>brèche</b> : toute la horde avance d’un coup.</p>`],
 ['aube','spark',_t('L’aube'),()=>_t`<p>Choisis une carte de ta <b>pioche</b> pour l’avoir en main le lendemain. Puis le <b>troc</b> : répare l’abri, améliore ou jette une carte, ou ouvre la <b>boutique</b> (objets absents de ton deck et munitions anti-Colosse, 2 au plus, usage unique).</p><p>Parfois, un <b>événement</b> te propose un choix risqué ou prudent. Toutes les 5 nuits, tu trouves une <b>relique</b>.</p>`],
 ['roles','shield',_t('Rôles et escouade'),()=>_t`<p>${ink('tank')} <b>Tank</b> : beaucoup de PV ; les zombies à ${Z.TAUNT} cases ou moins le visent ; il bloque 1 coup sur 3 et frappe peu (1 dégât).</p><p>${ink('heal')} <b>Soin</b> : soigne tes unités, à distance (portée en vert) ou sur les 8 cases autour. Les murs et postes sont réparés par les réparateurs.</p><p>${ink('dps')} <b>DPS</b> : gros dégâts. Le corps à corps rend chaque coup reçu au contact. <b>Tir de soutien</b> : +1 dégât (une fois par tour) sur un zombie au contact d’un Tank. Les tirs lents (Sniper…) reçoivent leurs bonus multipliés par leur intervalle.</p><p><b>Escouade</b> : un Tank, un Soin et un DPS voisins gagnent chacun +1.</p>`],
 ['fam','medal',_t('Les factions'),()=>_t`<p>Chaque faction a 2 bonus : à 2 survivants, puis à 5 (équipe complète). Seuls les survivants comptent (humains et chiens). Son Chef légendaire compte pour 2.</p><div class="deck">${Object.keys(Z.FAM).map(k=>{const f=Z.FAM[k];return `<div class="dk"><span class="fic">${ink(k)}</span><span><b>${f.n}</b>${f.lv[0]} : ${f.d[0]}. ${f.lv[1]} : ${f.d[1]}.</span></div>`}).join('')}</div>`],
 ['fusion','star',_t('Fusion, évolutions, niveaux'),()=>_t`<p><b>Fusion</b> : 3 unités identiques (même nombre d’étoiles) deviennent une <b>nouvelle carte ★</b> : plus de PV, +1 dégât, 2 places libérées, et les 3 cartes repartent dans ta défausse.</p><p><b>Évolution</b> ✦ : certaines paires posées côte à côte deviennent une nouvelle carte unique (page Évolutions secrètes de la Collection).</p><p>Une carte ★ ou ✦ ne retourne jamais dans le deck : blessée, elle part en réserve ; détruite, elle disparaît.</p><p><b>Niveaux</b> : à 20 zombies tués, puis 25 de plus, 30…, l’unité gagne +1 dégât ou +3 PV.</p>`],
 ['murs','post',_t('Les remparts'),()=>_t`<p>Des murs posés côte à côte forment un <b>rempart</b> : chaque mur gagne +1 PV par mur voisin (jusqu’à +3). Chaque mur garde ses PV : une brèche s’ouvre là où ça cède.</p>`],
 ['surv','band',_t('Les survivants'),()=>_t`<p>Chaque survivant a un <b>prénom</b> et un trait. La première fois qu’il tombe, il part blessé en réserve pour 3 nuits et garde une cicatrice ; la seconde fois, il est perdu pour de bon.</p>`],
 ['horde','skull',_t('La horde'),()=>_t`<p><b>Frénésie meurtrière</b> : dès la nuit 5, +10 % de PV pour tous les zombies, puis +10 % de plus chaque nuit.</p><p><b>Curée</b> : une unité encerclée prend +1 dégât par autre zombie à son contact (+2 au plus). Les Tanks ne la subissent pas.</p><p><b>Nuit rouge</b> toutes les 5 nuits : +15 % de zombies, puis une mutation instable (un affixe qui change toutes les 5 nuits) et une relique.</p><p><b>Boss</b> toutes les 10 nuits : <b>le Colosse</b> (nuit 10), <b>la Mère</b> (20, elle pond des rampants), <b>le Patient Zéro</b> (30, il accélère la horde), accompagnés de Colosses en renfort. Le boss arrive dans une 2ᵉ vague, frappe très fort et ne meurt pas en touchant l’abri. Entre les deux vagues, tu déplaces tes unités. La nuit suivante est un <b>répit</b> (30 % de zombies en moins).</p>`],
 ['mut','dna',_t('Mutations de la horde'),()=>_t`<p>Après ta première victoire, choisis un niveau de Mutation avant la partie. Les niveaux s’additionnent :</p><div class="deck">${Z.MENACES.slice(1).map((x,k)=>`<div class="dk"><span class="fic mnum">${k+1}</span><span><b>${x.n}</b>${x.d}.</span></div>`).join('')}</div>`]];
const rulesHtml=()=>`<div class="rindex">${RULES.map(([id,ic,t])=>`<button type="button" class="rchip" data-a="rgo" data-v="${id}">${ic==='dna'?svg('mut'):ic==='shield'?ink('tank'):ii(ic)}${t}</button>`).join('')}</div>${RULES.map(([id,ic,t,f])=>`<section class="rfiche" id="r-${id}"><h3>${ic==='dna'?svg('mut'):ic==='shield'?ink('tank'):ii(ic)}${t}</h3>${f()}</section>`).join('')}`;
// v139 : menu pause (bouton en haut, Échap, ou quand on quitte l'appli pendant la nuit)
function pauseMenu(){if(!G)return;onTitle=false;const nt=S.busy;if(nt)USERP=true;
 show(_t`<h2 class="pw">Pause</h2><p>${nt?_t`Nuit ${G.night} : la horde attend.`:_t`Jour ${G.night}.`}</p>
  <button type="button" class="go" data-a="presume">Reprendre</button><button type="button" class="skip" data-a="options">${ii('gear')} Options</button><button type="button" class="skip" data-a="pquit">Quitter vers l’accueil</button><button type="button" class="skip" data-a="prestart">Recommencer une partie</button>
  <p class="ver">${TEST?_t('Mode test : rien n’est sauvegardé.'):nt?_t('Si tu quittes maintenant, cette nuit sera rejouée depuis le début quand tu reprendras la partie.'):_t('Ta partie est sauvegardée : « Continuer » sur l’accueil la reprend.')}</p>`)}
// abandonne la nuit en cours (quitter ou recommencer) : la boucle s'arrête, la sauvegarde du début de nuit reste
function abortNight(){RUN++;unpause();S.pause=0;if(S.resume){const f=S.resume;S.resume=null;f()}
 if(S.busy){S.busy=false;nightTarget=0;KC.on=0;try{SFX.setWeather(null)}catch(e){}}}
$('#pz').addEventListener('click',()=>{if(ov.hidden)pauseMenu()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S&&S.busy&&!USERP&&ov.hidden)pauseMenu()});
// v139 : bandeau « Nuit N » au début de la nuit
function nightBanner(){try{const red=Z.pressure(G.night),el=document.createElement('div');el.className='nightban'+(red?' red':'');
 el.innerHTML=_t`<b>Nuit ${G.night}</b>${G.event&&G.event.n?`<small>${G.event.n}</small>`:''}`;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}catch(e){}}
// v139 : grande carte (clic droit ou appui long sur une carte de la main)
// v140 : grande carte partout (main, collection, deck, bestiaire, aube…) : clic droit, ou appui long au doigt (iPhone compris).
// Elle s'ouvre par-dessus l'écran en cours ; un toucher ou Échap la ferme.
const zoomEl=document.createElement('div');zoomEl.className='zoomv';zoomEl.hidden=true;document.body.appendChild(zoomEl);
let lpAt=0,LP=null;
function zoomCf(cf,lp){if(!cf)return;if(lp)lpAt=performance.now();if(HD&&HD.g)HD.g.remove();HD=null;const c=cf.cloneNode(true);c.classList.remove('ghost');
 zoomEl.innerHTML=_t('<div class="zoomc"></div><p>Touche pour fermer</p>');zoomEl.firstChild.appendChild(c);zoomEl.hidden=false;try{SFX.play('ui')}catch(e){}}
function zoomClose(){zoomEl.hidden=true;zoomEl.innerHTML=''}
zoomEl.addEventListener('click',()=>{if(performance.now()-lpAt>500)zoomClose()});
zoomEl.addEventListener('contextmenu',e=>{e.preventDefault();zoomClose()});
const zoomTarget=e=>{const t=e.target.closest&&e.target.closest('.cf');return t&&(t.closest('#hand')||t.closest('#panel'))?t:null};
addEventListener('contextmenu',e=>{const cf=zoomTarget(e);if(!cf)return;e.preventDefault();if(zoomEl.hidden)zoomCf(cf)});
// appui long (doigt ou stylet) : 450 ms sans bouger
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;const cf=zoomTarget(e);if(!cf)return;clearTimeout(LP&&LP.t);
 LP={x:e.clientX,y:e.clientY,t:setTimeout(()=>{LP=null;zoomCf(cf,1)},450)}},true);
addEventListener('pointermove',e=>{if(LP&&Math.hypot(e.clientX-LP.x,e.clientY-LP.y)>10){clearTimeout(LP.t);LP=null}},true);
['pointerup','pointercancel','scroll'].forEach(n=>addEventListener(n,()=>{if(LP){clearTimeout(LP.t);LP=null}},true));
// le clic qui suit un appui long ne doit pas jouer ou choisir la carte
addEventListener('click',e=>{if(!zoomEl.contains(e.target)&&(!zoomEl.hidden||performance.now()-lpAt<500)){e.stopPropagation();e.preventDefault()}},true);
// clic droit sur la carte : annule la sélection ; sur une unité, affiche sa fiche
cv.addEventListener('contextmenu',e=>{e.preventDefault();if(!ov.hidden)return;const i=cellAt(e);S.sel=null;S.bsel=null;S.drag=null;S.moveFrom=null;S.inspect=i!=null&&i>=0&&G.grid[i]?i:null;render()});
// v139 : raccourcis clavier (ordinateur)
const KEYS_HELP=[[_t('Espace'),_t('Affronter la nuit · changer la vitesse · vague suivante')],[_t('1 à 9'),_t('Choisir une carte de la main')],[_t('Échap'),_t('Annuler la sélection · pause et menu')],[_t('Ctrl + Z'),_t('Annuler la dernière action du jour')],['M',_t('Couper ou remettre le son')],['F',_t('Plein écran')],['D',_t('Tableau des combats')],[_t('Clic droit'),_t('Grande carte (sur n’importe quelle carte) · annuler la sélection (plateau)')]];
addEventListener('keydown',e=>{const tg=e.target;if(tg&&/^(INPUT|SELECT|TEXTAREA)$/.test(tg.tagName))return;if(e.altKey||e.metaKey)return;
 const k=e.key,open=!ov.hidden;
 if(!zoomEl.hidden){if(k==='Escape'||k===' '){e.preventDefault();zoomClose()}return}
 if(k==='Escape'){e.preventDefault();if(open){const b=panel.querySelector('[data-a=presume],[data-a=closeov],[data-a=close],[data-a=optclose],[data-a=pmenu]');if(b)b.click();return}
  if(S.sel!==null||S.bsel!=null||S.moveFrom!==null||S.inspect!==null){S.sel=null;S.bsel=null;S.moveFrom=null;S.inspect=null;render()}else pauseMenu();return}
 if((e.ctrlKey&&(k==='z'||k==='Z'))){if(!open){e.preventDefault();doUndo()}return}
 if(e.ctrlKey)return;
 if(k==='m'||k==='M'){muteBtn.click();return}
 if(k==='f'||k==='F'){toggleFs();return}
 if(open)return;
 if(k===' '||k==='Enter'){e.preventDefault();const g=$('#go');if(!g.disabled&&!g.hidden)g.click();return}
 if(k==='d'||k==='D'){$('#mtb').click();return}
 if(/^[1-9]$/.test(k)){const c=$('#hand').querySelectorAll('.card')[+k-1];if(c&&!c.disabled)c.click()}});
// v147 : logo du jeu (illustration d’Amine)
const LOGO='<img src="assets/ui/barricard.webp" alt="Barricard" width="840" height="420">';
function title(){endTest();if(META.gift){S.endHtml=null;giftScreen();return}onTitle=true;show(_t`<h1 class="logo">${LOGO}</h1>${DEMO?_t`<p class="demob">Démo</p><p>Tiens <b>${Z.DEMO_N} nuits</b> et repousse le Colosse. Dans le jeu complet : 30 nuits jusqu’aux secours, 3 boss et 10 Mutations.</p>${wishBtn()}`:_t`<p>Tiens <b>${Z.WIN_NIGHT} nuits</b> jusqu’à l’arrivée des secours… ou reste pour <b>une nuit de plus</b>. Chaque nuit, la horde est plus nombreuse et plus coriace.</p>`}${META.menaceWon>=0?_t`<p class="mwon">${ii('trophy')} Mutation ${META.menaceWon} vaincue${META.wins>1?_t` · ${META.wins} victoires`:''}</p>`:''}

${META.best?_t`<p>Ton record : <b>${plural(META.best,_t('nuit survécue'),_t('nuits survécues'))}</b> · total : <b>${META.total}</b> nuits sur ${plural(META.runs,_t('partie'),_t('parties'))}.</p>`:''}${nextUnlockTxt()}
${(d=>d?_t`<button type="button" class="go" data-a="load">Continuer · ${d.s.phase?_t('Aube'):_t('Jour')} ${d.g.night}</button><button type="button" class="skip" data-a="new">Nouvelle partie</button>`:_t('<button type="button" class="go" data-a="new">Jouer</button>'))(loadSave())}
<div class="bgrid"><button type="button" class="skip" data-a="rules">Règles du jeu</button>${novice()?'':_t`<button type="button" class="skip" data-a="coll">Collection et decks${seen('coll')?'':_t(' <span class="newb">Nouveau !</span>')}</button>`}${DEMO?_t`<button type="button" class="skip lockb" disabled title="Dans le jeu complet">${ii('lock')} Défi du jour</button>`:_t('<button type="button" class="skip" data-a="daily">Défi du jour</button>')}<button type="button" class="skip" data-a="deck">Bestiaire</button><button type="button" class="skip" data-a="stats">Statistiques</button><button type="button" class="skip" data-a="achs">${ii('trophy')} Succès · ${ACH.filter(a=>(META.ach||{})[a[0]]).length}/${ACH.length}</button><button type="button" class="skip" data-a="options">${ii('gear')} Options</button><button type="button" class="skip" data-a="testmode">Mode test</button></div>${iosHint()?_t('<p class="ver">Sur iPhone : Partager → « Sur l’écran d’accueil » pour jouer en plein écran.</p>'):''}<p class="ver">Sons : Kenney (kenney.nl), artisticdude et saturn91 (OpenGameArt), sous licence CC0 ; La Sonothèque, Pixabay, Sound Fishing (détails dans CREDITS.md).</p><p class="ver">${VERSION}</p>`)}
applyOpt();newGame();render();requestAnimationFrame(frame);title();

// bouton son
/* v126 : tableau des combats (comme Details! dans WoW) : dégâts, encaissés, soins donnés et reçus, morts, pour la nuit ou toute la partie.
   Sur ordinateur et téléphone tourné, il se range dans la colonne de droite ; en portrait, il s'ouvre en bas de l'écran par-dessus la main. */
const MT={tab:'dmg',all:0,at:0};
const MT_TABS=[['dmg',_t('Dégâts')],['tak',_t('Encaissés')],['hg',_t('Soins')],['hr',_t('Reçus')],['dead',_t('Morts')]];
const MT_X={x_burn:_t('Brûlures'),x_bleed:_t('Saignements'),x_shelter:_t('L’abri')};
const mtName=t=>MT_X[t]||(Z.U[t]?Z.U[t].n:t);
const mtCol=t=>{if(t==='x_shelter')return'#c94a4a';if(MT_X[t])return'#e07a2a';const c=(Z.U[t]||{}).cat;return{shoot:'#d9a441',melee:'#c9573a',help:'#6fae5a',wall:'#9a8f7e',trap:'#b07a3c',post:'#5a8fc9'}[c]||'#a77ad9'};
const fmt1=v=>(Math.round(v*10)/10).toLocaleString(LANG==='fr'?'fr-FR':'en-US');
// l'en-tête (onglets) n'est reconstruit que quand on change d'onglet : le corps se met à jour en direct sans voler les clics
function meterHead(){const night=!MT.all;return _t`<div class="mt-h"><b class="mt-ttl"></b><span class="mt-sc"><button type="button" data-mt="n" class="${night?'on':''}">Nuit</button><button type="button" data-mt="a" class="${night?'':'on'}">Partie</button></span><button type="button" class="mt-x" data-mt="x" aria-label="Fermer">×</button></div>
  <div class="mt-tabs">${MT_TABS.map(([k,n])=>`<button type="button" data-mt="t:${k}" class="${MT.tab===k?'on':''}">${n}</button>`).join('')}</div><div class="mt-b"></div>`}
function meterBody(){const night=!MT.all,m=(night?G.mtN:G.mtR)||{},ticks=(night?G.mtT:G.mtRT)||0;
 if(MT.tab==='dead'){const ds=(G.mtD||[]).filter(d=>!night||d.night===G.night).slice(-40).reverse();
  return ds.length?`<ul class="mt-dead">${ds.map(d=>`<li><i style="background:${mtCol(d.t)}"></i><span><b>${d.name||mtName(d.t)}</b>${d.name?` <small>${mtName(d.t)}</small>`:''}<br><small>${night?'':_t`Nuit ${d.night} · `}${d.ko?_t('blessé, part en réserve'):_t('mort pour de bon')}${d.by&&Z.ZT[d.by]?` · ${Z.ZT[d.by].n}`:''}</small></span></li>`).join('')}</ul>`:_t`<p class="mt-0">Personne n’est tombé${night?_t(' cette nuit'):''}.</p>`}
 const k=MT.tab,rows=Object.values(m).filter(r=>r[k]>0).sort((a,b)=>b[k]-a[k]),max=rows.length?rows[0][k]:1,tot=rows.reduce((a,r)=>a+r[k],0);
 if(!rows.length)return `<p class="mt-0">${G.mtN?_t('Rien pour l’instant.'):_t('Les chiffres apparaîtront pendant la première nuit.')}</p>`;
 const per=k==='dmg'&&ticks>0;
 return _t`<ol class="mt-rows">${rows.slice(0,14).map(r=>`<li><i class="mt-bar" style="width:${Math.max(3,r[k]/max*100)}%;background:${mtCol(r.t)}"></i><span class="mt-n">${r.name&&r.name!==mtName(r.t)?`${r.name} <small>${mtName(r.t)}</small>`:(r.name||mtName(r.t))}</span><span class="mt-v">${r[k]}${per?` <small>${fmt1(r[k]/ticks)}/t</small>`:''}${k==='dmg'&&r.kills?` <small>· ${r.kills} ${ii('skull')}</small>`:''}</span></li>`).join('')}</ol>
  <p class="mt-tot">Total : <b>${tot}</b>${per?_t` · ${fmt1(tot/ticks)} par tour`:''}${rows.length>14?_t` · ${rows.length-14} autres`:''}</p>`}
function meterSync(force){const el=$('#meter');if(!el)return;const on=!!OPT.meter;el.hidden=!on;$('#mtb').classList.toggle('on',on);
 if(!on)return;const now=performance.now();if(!force&&now-MT.at<300)return;MT.at=now;
 try{const key=MT.tab+MT.all;if(force||el.dataset.k!==key||!el.querySelector('.mt-b')){el.innerHTML=meterHead();el.dataset.k=key}
  el.querySelector('.mt-ttl').textContent=MT.all?_t('Toute la partie'):_t`Nuit ${G.night}`;el.querySelector('.mt-b').innerHTML=meterBody()}catch(e){el.innerHTML=_t('<p class="mt-0">Détails indisponibles.</p>')}}
$('#mtb').addEventListener('click',()=>{OPT.meter=OPT.meter?0:1;saveOpt();meterSync(1)});
$('#meter').addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(!b)return;const v=b.dataset.mt;
 if(v==='x'){OPT.meter=0;saveOpt()}else if(v==='n')MT.all=0;else if(v==='a')MT.all=1;else if(v.startsWith('t:'))MT.tab=v.slice(2);meterSync(1)});
// v126 : à la fin d'une partie (défaite ou départ en hélico), on peut revoir le tableau des combats de toute la partie
const detBtn=()=>G&&G.mtR&&Object.keys(G.mtR).length?_t`<button type="button" class="skip" data-a="mdet">${ii('chart')} Détails de la partie</button>`:'';
function keepEnd(){S.endHtml=panel.innerHTML}
function detScreen(){MT.all=1;show(_t`<h2 class="pw">Détails de la partie</h2><p>${plural(G.night,_t('nuit'),_t('nuits'))}, ${G.kills} zombies éliminés.</p><div class="meter inpanel" id="meterP"></div><button type="button" class="go" data-a="mback">Retour</button>`);detSync()}
function detSync(){const el=document.getElementById('meterP');if(!el)return;el.innerHTML=meterHead();el.querySelector('.mt-ttl').textContent=MT.all?_t('Toute la partie'):_t`Nuit ${G.night}`;el.querySelector('.mt-b').innerHTML=meterBody();const x=el.querySelector('.mt-x');if(x)x.remove()}
panel.addEventListener('click',e=>{const b=e.target.closest('#meterP [data-mt]');if(!b)return;const v=b.dataset.mt;if(v==='n')MT.all=0;else if(v==='a')MT.all=1;else if(v.startsWith('t:'))MT.tab=v.slice(2);detSync()});
const muteBtn=$('#mute');
function muteIcon(){muteBtn.innerHTML=`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${SFX.muted?'<path d="M16 9l5 6M21 9l-5 6"/>':'<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>'}</svg>`;muteBtn.setAttribute('aria-label',SFX.muted?_t('Activer le son'):_t('Couper le son'))}
muteBtn.addEventListener('click',()=>{SFX.toggle();muteIcon()});muteIcon();
function iosHint(){return /iPhone|iPod/.test(navigator.userAgent)&&!(matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone)}
// plein écran : bouton sur les navigateurs qui le permettent (Android, PC). Sur iPhone, passer par « Sur l’écran d’accueil ».
const fsBtn=$('#fs'),DE=document.documentElement,fsReq=DE.requestFullscreen||DE.webkitRequestFullscreen,
 standalone=matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone;
if(fsReq&&!standalone){fsBtn.hidden=false;fsBtn.addEventListener('click',()=>{try{const on=document.fullscreenElement||document.webkitFullscreenElement;
 if(on)(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const r=fsReq.call(DE,{navigationUI:'hide'});if(r&&r.catch)r.catch(()=>{})}}catch(e){}})}

