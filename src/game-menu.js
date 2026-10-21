/* Dernier Abri : défi quotidien, tableau des combats, menu pause, raccourcis, accueil et démarrage.
   Les fichiers src/game*.js partagent leurs variables (scripts classiques chargés dans l’ordre par index.html). */
/* ---------- défi quotidien : même graine, même personnage et même lieu pour tout le monde ce jour-là ---------- */
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function dailySetup(day){const r=seedFrom('cfg-'+day),ch=Object.keys(Z.CHARS),pl=Object.keys(Z.PLACES);return{ch:ch[r%ch.length],pl:pl[Math.floor(r/7)%pl.length]}}
function dailyBest(day){try{const d=JSON.parse(localStorage.getItem('abri-daily'))||{};return d[day]??null}catch(e){return null}}
function dailyEnd(n){let prev=null;try{const d=JSON.parse(localStorage.getItem('abri-daily'))||{};prev=d[G.daily]??null;if(prev===null||n>prev){d[G.daily]=n;localStorage.setItem('abri-daily',JSON.stringify(d))}}catch(e){}
 return `<p>Défi du jour : <b>${plural(n,'nuit','nuits')}</b>${prev!==null?` (ton meilleur aujourd’hui : ${plural(Math.max(prev,n),'nuit','nuits')})`:''}. Compare ton score avec tes amis : tout le monde a la même partie aujourd’hui.</p>`}
function dailyScreen(){const day=today(),c=dailySetup(day),b=dailyBest(day);
 show(`<h2 class="pw">Défi du jour</h2><p>Aujourd’hui, tout le monde joue <b>la même partie</b> : même personnage, même lieu, mêmes cartes et mêmes nuits. Tu peux le rejouer autant que tu veux.</p>
  <ul><li>Personnage : <b>${Z.CHARS[c.ch].n}</b></li><li>Lieu : <b>${Z.PLACES[c.pl].n}</b></li><li>Toutes les cartes sont disponibles.</li></ul>
  ${b!==null?`<p>Ton meilleur score aujourd’hui : <b>${plural(b,'nuit','nuits')}</b>.</p>`:''}<p>Les défis ne comptent pas pour les déblocages.</p>
  <button type="button" class="go" data-a="daily-go">Jouer le défi</button><button type="button" class="skip" data-a="title">Retour</button>`)}
// règles du jeu (v123) : des fiches illustrées, avec un sommaire pour sauter à une fiche
const RULES=[
 ['but','trophy','Le but',()=>`<p>Tiens <b>${Z.WIN_NIGHT} nuits</b>. À l’aube de la nuit ${Z.WIN_NIGHT}, après le Patient Zéro, les secours arrivent : tu peux <b>partir</b> (victoire) ou <b>rester</b> en mode infini pour le score, jusqu’à ce que la horde gagne.</p><p>Chaque victoire débloque une <b>Mutation de la horde</b> plus dure (10 niveaux, à choisir avant la partie), une carte de victoire et des reliques.</p>`],
 ['jour','bolt','Le jour',()=>`<p>Tu as <b>${Z.ENERGY} énergies</b> par jour. Chaque carte coûte 0 à 3 : touche-la puis touche une case, ou glisse-la sur le plateau. Les cartes non jouées restent en main.</p><p>Les <b>murs et barbelés</b> se tracent : une carte donne plusieurs cases pour la journée, une par une ou d’un glissé en ligne.</p><p>Tu peux <b>déplacer</b> ce que tu as posé, et <b>rappeler</b> une unité dans ta réserve pour la reposer gratuitement plus tard.</p><p><b>Limite</b> : ${Z.unitCap(G||{night:1})} unités au plus sur le terrain (+1 toutes les 10 nuits). Murs, pièges et postes de soutien ne comptent pas.</p>`],
 ['nuit','moon','La nuit',()=>`<p>Les zombies sortent de la forêt <b>par les 4 routes</b> et marchent vers l’abri : un mur en travers d’une route la ferme. Ils contournent tes défenses si le détour est plus court, sinon ils attaquent le point le plus faible.</p><p>Tes survivants se défendent <b>tout seuls</b>. Garde de l’énergie pour tes cartes <b>Réaction</b> (grenade, tir de l’abri…), jouables pendant l’attaque.</p><p>Dans la forêt, les zombies sont <b>intouchables</b>. Si l’un d’eux blesse l’abri, c’est la <b>brèche</b> : toute la horde avance d’un coup.</p>`],
 ['aube','spark','L’aube',()=>`<p>Choisis une carte de ta <b>pioche</b> pour l’avoir en main le lendemain. Puis le <b>troc</b> : répare l’abri, améliore ou jette une carte, ou ouvre la <b>boutique</b> (objets absents de ton deck et munitions anti-Colosse, 2 au plus, usage unique).</p><p>Parfois, un <b>événement</b> te propose un choix risqué ou prudent. Toutes les 5 nuits, tu trouves une <b>relique</b>.</p>`],
 ['roles','shield','Rôles et escouade',()=>`<p>${ink('tank')} <b>Tank</b> : beaucoup de PV ; les zombies à ${Z.TAUNT} cases ou moins le visent ; il bloque 1 coup sur 3 et frappe peu (1 dégât).</p><p>${ink('heal')} <b>Soin</b> : soigne tes unités, à distance (portée en vert) ou sur les 8 cases autour. Les murs et postes sont réparés par les réparateurs.</p><p>${ink('dps')} <b>DPS</b> : gros dégâts. Le corps à corps rend chaque coup reçu au contact. <b>Tir de soutien</b> : +1 dégât (une fois par tour) sur un zombie au contact d’un Tank. Les tirs lents (Sniper…) reçoivent leurs bonus multipliés par leur intervalle.</p><p><b>Escouade</b> : un Tank, un Soin et un DPS voisins gagnent chacun +1.</p>`],
 ['fam','medal','Les factions',()=>`<p>Chaque faction a 2 bonus : à 2 survivants, puis à 5 (équipe complète). Seuls les survivants comptent (humains et chiens). Son Chef légendaire compte pour 2.</p><div class="deck">${Object.keys(Z.FAM).map(k=>{const f=Z.FAM[k];return `<div class="dk"><span class="fic">${ink(k)}</span><span><b>${f.n}</b>${f.lv[0]} : ${f.d[0]}. ${f.lv[1]} : ${f.d[1]}.</span></div>`}).join('')}</div>`],
 ['fusion','star','Fusion, évolutions, niveaux',()=>`<p><b>Fusion</b> : 3 unités identiques (même nombre d’étoiles) deviennent une <b>nouvelle carte ★</b> : plus de PV, +1 dégât, 2 places libérées, et les 3 cartes repartent dans ta défausse.</p><p><b>Évolution</b> ✦ : certaines paires posées côte à côte deviennent une nouvelle carte unique (page Évolutions secrètes de la Collection).</p><p>Une carte ★ ou ✦ ne retourne jamais dans le deck : blessée, elle part en réserve ; détruite, elle disparaît.</p><p><b>Niveaux</b> : à 20 zombies tués, puis 25 de plus, 30…, l’unité gagne +1 dégât ou +3 PV.</p>`],
 ['murs','post','Les remparts',()=>`<p>Des murs posés côte à côte forment un <b>rempart</b> : chaque mur gagne +1 PV par mur voisin (jusqu’à +3). Chaque mur garde ses PV : une brèche s’ouvre là où ça cède.</p>`],
 ['surv','band','Les survivants',()=>`<p>Chaque survivant a un <b>prénom</b> et un trait. La première fois qu’il tombe, il part blessé en réserve pour 3 nuits et garde une cicatrice ; la seconde fois, il est perdu pour de bon.</p>`],
 ['horde','skull','La horde',()=>`<p><b>Frénésie meurtrière</b> : dès la nuit 5, +10 % de PV pour tous les zombies, puis +10 % de plus chaque nuit.</p><p><b>Curée</b> : une unité encerclée prend +1 dégât par autre zombie à son contact (+2 au plus). Les Tanks ne la subissent pas.</p><p><b>Nuit rouge</b> toutes les 5 nuits : +15 % de zombies, puis une mutation instable (un affixe qui change toutes les 5 nuits) et une relique.</p><p><b>Boss</b> toutes les 10 nuits : <b>le Colosse</b> (nuit 10), <b>la Mère</b> (20, elle pond des rampants), <b>le Patient Zéro</b> (30, il accélère la horde), accompagnés de Colosses en renfort. Le boss arrive dans une 2ᵉ vague, frappe très fort et ne meurt pas en touchant l’abri. Entre les deux vagues, tu déplaces tes unités. La nuit suivante est un <b>répit</b> (30 % de zombies en moins).</p>`],
 ['mut','dna','Mutations de la horde',()=>`<p>Après ta première victoire, choisis un niveau de Mutation avant la partie. Les niveaux s’additionnent :</p><div class="deck">${Z.MENACES.slice(1).map((x,k)=>`<div class="dk"><span class="fic mnum">${k+1}</span><span><b>${x.n}</b>${x.d}.</span></div>`).join('')}</div>`]];
const rulesHtml=()=>`<div class="rindex">${RULES.map(([id,ic,t])=>`<button type="button" class="rchip" data-a="rgo" data-v="${id}">${ic==='dna'?svg('mut'):ic==='shield'?ink('tank'):ii(ic)}${t}</button>`).join('')}</div>${RULES.map(([id,ic,t,f])=>`<section class="rfiche" id="r-${id}"><h3>${ic==='dna'?svg('mut'):ic==='shield'?ink('tank'):ii(ic)}${t}</h3>${f()}</section>`).join('')}`;
// logo du jeu (aussi dans assets/ui/logo.svg), dessiné en SVG avec les polices du jeu
const LOGO=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 210" role="img" aria-label="Dernier Abri">
 <defs>
  <radialGradient id="lg-moon" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fff4cf"/><stop offset=".7" stop-color="#f2d58a"/><stop offset="1" stop-color="#d9a640"/></radialGradient>
  <radialGradient id="lg-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd25a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient>
  <linearGradient id="lg-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a3a"/><stop offset=".5" stop-color="#7a4f28"/><stop offset="1" stop-color="#5a3818"/></linearGradient>
 </defs>
 <circle cx="180" cy="74" r="62" fill="#2a1d13"/>
 <circle cx="180" cy="74" r="57" fill="url(#lg-moon)"/>
 <circle cx="158" cy="56" r="7" fill="#e3bf6c" opacity=".55"/><circle cx="204" cy="92" r="9" fill="#e3bf6c" opacity=".45"/><circle cx="208" cy="50" r="4" fill="#e3bf6c" opacity=".5"/>
 <g fill="#1e140c">
  <path d="M118 128 L123 82 L119 70 L126 80 L128 60 L131 84 L137 74 L133 92 L136 128Z"/>
  <path d="M232 128 L235 90 L229 78 L238 88 L240 66 L243 90 L249 80 L245 98 L248 128Z"/>
  <path d="M138 130 L138 92 L180 60 L222 92 L222 130Z"/>
  <rect x="200" y="66" width="10" height="20"/>
  <path d="M130 96 L180 54 L230 96 L224 100 L180 63 L136 100Z"/>
 </g>
 <circle cx="180" cy="100" r="22" fill="url(#lg-glow)"/>
 <rect x="171" y="92" width="18" height="17" rx="1.5" fill="#ffc947"/>
 <path d="M180 92v17M171 100.5h18" stroke="#1e140c" stroke-width="2.4"/>
 <path d="M150 112 h12 v18 h-12z" fill="#3a2614"/>
 <g>
  <path d="M22 126 Q180 112 338 126 L332 190 Q180 178 28 190Z" fill="#1e140c" transform="translate(0,4)"/>
  <path d="M22 126 Q180 112 338 126 L332 190 Q180 178 28 190Z" fill="url(#lg-wood)" stroke="#2a1a0c" stroke-width="3"/>
  <path d="M26 158 Q180 146 334 158" stroke="#4a2e14" stroke-width="2" fill="none" opacity=".7"/>
  <path d="M60 136 q30 -3 60 -2 M230 168 q40 -2 70 1 M70 176 q25 -2 50 -1" stroke="#b5814a" stroke-width="1.5" fill="none" opacity=".6"/>
  <circle cx="40" cy="138" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/><circle cx="320" cy="138" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/>
  <circle cx="44" cy="177" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/><circle cx="316" cy="177" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/>
  <text x="180" y="170" text-anchor="middle" font-family="'Special Elite',serif" font-size="35" letter-spacing="1.5" fill="#1e140c" transform="translate(2,3)">DERNIER ABRI</text>
  <text x="180" y="170" text-anchor="middle" font-family="'Special Elite',serif" font-size="35" letter-spacing="1.5" fill="#f2e1b0" stroke="#2a1a0c" stroke-width="1.2" paint-order="stroke">DERNIER ABRI</text>
 </g>
 <path d="M64 128 q4 0 4 5 v9 q0 3 -2.5 3 q-2.5 0 -2.5 -3 v-5 q-3 0 -3 -4 q0 -5 4 -5z" fill="#8e1d12" opacity=".9"/>
 <text x="180" y="206" text-anchor="middle" font-family="'Atkinson Hyperlegible',sans-serif" font-size="12.5" letter-spacing="4" fill="#5a4630">UNE NUIT DE PLUS</text>
</svg>`;
// v139 : menu pause (bouton en haut, Échap, ou quand on quitte l'appli pendant la nuit)
function pauseMenu(){if(!G)return;onTitle=false;const nt=S.busy;if(nt)USERP=true;
 show(`<h2 class="pw">Pause</h2><p>${nt?`Nuit ${G.night} : la horde attend.`:`Jour ${G.night}.`}</p>
  <button type="button" class="go" data-a="presume">Reprendre</button><button type="button" class="skip" data-a="options">${ii('gear')} Options</button><button type="button" class="skip" data-a="pquit">Quitter vers l’accueil</button><button type="button" class="skip" data-a="prestart">Recommencer une partie</button>
  <p class="ver">${TEST?'Mode test : rien n’est sauvegardé.':nt?'Si tu quittes maintenant, cette nuit sera rejouée depuis le début quand tu reprendras la partie.':'Ta partie est sauvegardée : « Continuer » sur l’accueil la reprend.'}</p>`)}
// abandonne la nuit en cours (quitter ou recommencer) : la boucle s'arrête, la sauvegarde du début de nuit reste
function abortNight(){RUN++;unpause();S.pause=0;if(S.resume){const f=S.resume;S.resume=null;f()}
 if(S.busy){S.busy=false;nightTarget=0;KC.on=0;try{SFX.setWeather(null)}catch(e){}}}
$('#pz').addEventListener('click',()=>{if(ov.hidden)pauseMenu()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S&&S.busy&&!USERP&&ov.hidden)pauseMenu()});
// v139 : bandeau « Nuit N » au début de la nuit
function nightBanner(){try{const red=Z.pressure(G.night),el=document.createElement('div');el.className='nightban'+(red?' red':'');
 el.innerHTML=`<b>Nuit ${G.night}</b>${G.event&&G.event.n?`<small>${G.event.n}</small>`:''}`;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}catch(e){}}
// v139 : grande carte (clic droit ou appui long sur une carte de la main)
// v140 : grande carte partout (main, collection, deck, bestiaire, aube…) : clic droit, ou appui long au doigt (iPhone compris).
// Elle s'ouvre par-dessus l'écran en cours ; un toucher ou Échap la ferme.
const zoomEl=document.createElement('div');zoomEl.className='zoomv';zoomEl.hidden=true;document.body.appendChild(zoomEl);
let lpAt=0,LP=null;
function zoomCf(cf,lp){if(!cf)return;if(lp)lpAt=performance.now();if(HD&&HD.g)HD.g.remove();HD=null;const c=cf.cloneNode(true);c.classList.remove('ghost');
 zoomEl.innerHTML='<div class="zoomc"></div><p>Touche pour fermer</p>';zoomEl.firstChild.appendChild(c);zoomEl.hidden=false;try{SFX.play('ui')}catch(e){}}
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
const KEYS_HELP=[['Espace','Affronter la nuit · changer la vitesse · vague suivante'],['1 à 9','Choisir une carte de la main'],['Échap','Annuler la sélection · pause et menu'],['Ctrl + Z','Annuler la dernière action du jour'],['M','Couper ou remettre le son'],['D','Tableau des combats'],['Clic droit','Grande carte (sur n’importe quelle carte) · annuler la sélection (plateau)']];
addEventListener('keydown',e=>{const tg=e.target;if(tg&&/^(INPUT|SELECT|TEXTAREA)$/.test(tg.tagName))return;if(e.altKey||e.metaKey)return;
 const k=e.key,open=!ov.hidden;
 if(!zoomEl.hidden){if(k==='Escape'||k===' '){e.preventDefault();zoomClose()}return}
 if(k==='Escape'){e.preventDefault();if(open){const b=panel.querySelector('[data-a=presume],[data-a=closeov],[data-a=close],[data-a=optclose],[data-a=pmenu]');if(b)b.click();return}
  if(S.sel!==null||S.bsel!=null||S.moveFrom!==null||S.inspect!==null){S.sel=null;S.bsel=null;S.moveFrom=null;S.inspect=null;render()}else pauseMenu();return}
 if((e.ctrlKey&&(k==='z'||k==='Z'))){if(!open){e.preventDefault();doUndo()}return}
 if(e.ctrlKey)return;
 if(k==='m'||k==='M'){muteBtn.click();return}
 if(open)return;
 if(k===' '||k==='Enter'){e.preventDefault();const g=$('#go');if(!g.disabled&&!g.hidden)g.click();return}
 if(k==='d'||k==='D'){$('#mtb').click();return}
 if(/^[1-9]$/.test(k)){const c=$('#hand').querySelectorAll('.card')[+k-1];if(c&&!c.disabled)c.click()}});
function title(){endTest();onTitle=true;setTimeout(()=>{if(!ov.hidden&&panel.querySelector('.logo'))TTL=true},0);show(`<h1 class="logo">${LOGO}</h1><p>Tiens <b>${Z.WIN_NIGHT} nuits</b> jusqu’à l’arrivée des secours… ou reste pour <b>une nuit de plus</b>. Chaque nuit, la horde est plus nombreuse et plus coriace.</p>${META.menaceWon>=0?`<p class="mwon">${ii('trophy')} Mutation ${META.menaceWon} vaincue${META.wins>1?` · ${META.wins} victoires`:''}</p>`:''}

${META.best?`<p>Ton record : <b>${plural(META.best,'nuit survécue','nuits survécues')}</b> · total : <b>${META.total}</b> nuits sur ${plural(META.runs,'partie','parties')}.</p>`:''}${nextUnlockTxt()}
${(d=>d?`<button type="button" class="go" data-a="load">Continuer · ${d.s.phase?'Aube':'Jour'} ${d.g.night}</button><button type="button" class="skip" data-a="new">Nouvelle partie</button>`:'<button type="button" class="go" data-a="new">Jouer</button>')(loadSave())}
<button type="button" class="skip" data-a="rules">Règles du jeu</button>${novice()?'':`<button type="button" class="skip" data-a="coll">Collection et decks${seen('coll')?'':' <span class="newb">Nouveau !</span>'}</button>`}<button type="button" class="skip" data-a="daily">Défi du jour</button><button type="button" class="skip" data-a="deck">Cartes et bestiaire</button><button type="button" class="skip" data-a="stats">Statistiques</button><button type="button" class="skip" data-a="achs">${ii('trophy')} Succès · ${ACH.filter(a=>(META.ach||{})[a[0]]).length}/${ACH.length}</button><button type="button" class="skip" data-a="options">${ii('gear')} Options</button><button type="button" class="skip" data-a="testmode">Mode test</button>${iosHint()?'<p class="ver">Sur iPhone : Partager → « Sur l’écran d’accueil » pour jouer en plein écran.</p>':''}<p class="ver">Sons : Kenney (kenney.nl), artisticdude et saturn91 (OpenGameArt), sous licence CC0 ; La Sonothèque, Pixabay, Sound Fishing (détails dans CREDITS.md).</p><p class="ver">${VERSION}</p>`)}
applyOpt();newGame();render();requestAnimationFrame(frame);title();

// bouton son
/* v126 : tableau des combats (comme Details! dans WoW) : dégâts, encaissés, soins donnés et reçus, morts, pour la nuit ou toute la partie.
   Sur ordinateur et téléphone tourné, il se range dans la colonne de droite ; en portrait, il s'ouvre en bas de l'écran par-dessus la main. */
const MT={tab:'dmg',all:0,at:0};
const MT_TABS=[['dmg','Dégâts'],['tak','Encaissés'],['hg','Soins'],['hr','Reçus'],['dead','Morts']];
const MT_X={x_burn:'Brûlures',x_bleed:'Saignements',x_shelter:'L’abri'};
const mtName=t=>MT_X[t]||(Z.U[t]?Z.U[t].n:t);
const mtCol=t=>{if(t==='x_shelter')return'#c94a4a';if(MT_X[t])return'#e07a2a';const c=(Z.U[t]||{}).cat;return{shoot:'#d9a441',melee:'#c9573a',help:'#6fae5a',wall:'#9a8f7e',trap:'#b07a3c',post:'#5a8fc9'}[c]||'#a77ad9'};
const fmt1=v=>(Math.round(v*10)/10).toLocaleString('fr-FR');
// l'en-tête (onglets) n'est reconstruit que quand on change d'onglet : le corps se met à jour en direct sans voler les clics
function meterHead(){const night=!MT.all;return `<div class="mt-h"><b class="mt-ttl"></b><span class="mt-sc"><button type="button" data-mt="n" class="${night?'on':''}">Nuit</button><button type="button" data-mt="a" class="${night?'':'on'}">Partie</button></span><button type="button" class="mt-x" data-mt="x" aria-label="Fermer">×</button></div>
  <div class="mt-tabs">${MT_TABS.map(([k,n])=>`<button type="button" data-mt="t:${k}" class="${MT.tab===k?'on':''}">${n}</button>`).join('')}</div><div class="mt-b"></div>`}
function meterBody(){const night=!MT.all,m=(night?G.mtN:G.mtR)||{},ticks=(night?G.mtT:G.mtRT)||0;
 if(MT.tab==='dead'){const ds=(G.mtD||[]).filter(d=>!night||d.night===G.night).slice(-40).reverse();
  return ds.length?`<ul class="mt-dead">${ds.map(d=>`<li><i style="background:${mtCol(d.t)}"></i><span><b>${d.name||mtName(d.t)}</b>${d.name?` <small>${mtName(d.t)}</small>`:''}<br><small>${night?'':`Nuit ${d.night} · `}${d.ko?'blessé, part en réserve':'mort pour de bon'}${d.by&&Z.ZT[d.by]?` · ${Z.ZT[d.by].n}`:''}</small></span></li>`).join('')}</ul>`:`<p class="mt-0">Personne n’est tombé${night?' cette nuit':''}.</p>`}
 const k=MT.tab,rows=Object.values(m).filter(r=>r[k]>0).sort((a,b)=>b[k]-a[k]),max=rows.length?rows[0][k]:1,tot=rows.reduce((a,r)=>a+r[k],0);
 if(!rows.length)return `<p class="mt-0">${G.mtN?'Rien pour l’instant.':'Les chiffres apparaîtront pendant la première nuit.'}</p>`;
 const per=k==='dmg'&&ticks>0;
 return `<ol class="mt-rows">${rows.slice(0,14).map(r=>`<li><i class="mt-bar" style="width:${Math.max(3,r[k]/max*100)}%;background:${mtCol(r.t)}"></i><span class="mt-n">${r.name&&r.name!==mtName(r.t)?`${r.name} <small>${mtName(r.t)}</small>`:(r.name||mtName(r.t))}</span><span class="mt-v">${r[k]}${per?` <small>${fmt1(r[k]/ticks)}/t</small>`:''}${k==='dmg'&&r.kills?` <small>· ${r.kills} ${ii('skull')}</small>`:''}</span></li>`).join('')}</ol>
  <p class="mt-tot">Total : <b>${tot}</b>${per?` · ${fmt1(tot/ticks)} par tour`:''}${rows.length>14?` · ${rows.length-14} autres`:''}</p>`}
function meterSync(force){const el=$('#meter');if(!el)return;const on=!!OPT.meter;el.hidden=!on;$('#mtb').classList.toggle('on',on);
 if(!on)return;const now=performance.now();if(!force&&now-MT.at<300)return;MT.at=now;
 try{const key=MT.tab+MT.all;if(force||el.dataset.k!==key||!el.querySelector('.mt-b')){el.innerHTML=meterHead();el.dataset.k=key}
  el.querySelector('.mt-ttl').textContent=MT.all?'Toute la partie':`Nuit ${G.night}`;el.querySelector('.mt-b').innerHTML=meterBody()}catch(e){el.innerHTML='<p class="mt-0">Détails indisponibles.</p>'}}
$('#mtb').addEventListener('click',()=>{OPT.meter=OPT.meter?0:1;saveOpt();meterSync(1)});
$('#meter').addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(!b)return;const v=b.dataset.mt;
 if(v==='x'){OPT.meter=0;saveOpt()}else if(v==='n')MT.all=0;else if(v==='a')MT.all=1;else if(v.startsWith('t:'))MT.tab=v.slice(2);meterSync(1)});
// v126 : à la fin d'une partie (défaite ou départ en hélico), on peut revoir le tableau des combats de toute la partie
const detBtn=()=>G&&G.mtR&&Object.keys(G.mtR).length?`<button type="button" class="skip" data-a="mdet">${ii('chart')} Détails de la partie</button>`:'';
function keepEnd(){S.endHtml=panel.innerHTML}
function detScreen(){MT.all=1;show(`<h2 class="pw">Détails de la partie</h2><p>${plural(G.night,'nuit','nuits')}, ${G.kills} zombies éliminés.</p><div class="meter inpanel" id="meterP"></div><button type="button" class="go" data-a="mback">Retour</button>`);detSync()}
function detSync(){const el=document.getElementById('meterP');if(!el)return;el.innerHTML=meterHead();el.querySelector('.mt-ttl').textContent=MT.all?'Toute la partie':`Nuit ${G.night}`;el.querySelector('.mt-b').innerHTML=meterBody();const x=el.querySelector('.mt-x');if(x)x.remove()}
panel.addEventListener('click',e=>{const b=e.target.closest('#meterP [data-mt]');if(!b)return;const v=b.dataset.mt;if(v==='n')MT.all=0;else if(v==='a')MT.all=1;else if(v.startsWith('t:'))MT.tab=v.slice(2);detSync()});
const muteBtn=$('#mute');
function muteIcon(){muteBtn.innerHTML=`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${SFX.muted?'<path d="M16 9l5 6M21 9l-5 6"/>':'<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>'}</svg>`;muteBtn.setAttribute('aria-label',SFX.muted?'Activer le son':'Couper le son')}
muteBtn.addEventListener('click',()=>{SFX.toggle();muteIcon()});muteIcon();
function iosHint(){return /iPhone|iPod/.test(navigator.userAgent)&&!(matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone)}
// plein écran : bouton sur les navigateurs qui le permettent (Android, PC). Sur iPhone, passer par « Sur l’écran d’accueil ».
const fsBtn=$('#fs'),DE=document.documentElement,fsReq=DE.requestFullscreen||DE.webkitRequestFullscreen,
 standalone=matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone;
if(fsReq&&!standalone){fsBtn.hidden=false;fsBtn.addEventListener('click',()=>{try{const on=document.fullscreenElement||document.webkitFullscreenElement;
 if(on)(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const r=fsReq.call(DE,{navigationUI:'hide'});if(r&&r.catch)r.catch(()=>{})}}catch(e){}})}

