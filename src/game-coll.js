/* ---------- collection du style artiste (v222) ----------
   Reprise de l’interface « Collection » du laboratoire (champion-game/laboratoire-, interfaces/collection) :
   filtres à gauche, recherche, grille de cartes au centre, grande carte à droite qui se retourne quand on en choisit une autre,
   inclinaison 3D et reflet au survol de la souris, cartes distribuées à l’ouverture.
   Seulement avec le style artiste (html.artx) : le style actuel garde son ancienne collection.
   Chargé en dernier : remplace collectionScreen quand le style artiste est actif. */
const LC={sel:null,deal:0,flip:0,next:null};
// filtres : types de carte puis rôles (un seul à la fois, comme les catégories du laboratoire) ; CF.role est partagé avec l’éditeur de deck
const lcTypes=()=>[['',ii('card'),_t('Toutes')],['c:wall',svg('bar'),CATN.wall],['c:post',ii('post'),CATN.post],['c:shoot',svg('gun'),CATN.shoot],['c:melee',ii('sword'),CATN.melee],
 ['c:help',svg('radio'),CATN.help],['c:trap',ink('trap'),CATN.trap],['c:item',ii('pack'),CATN.item],['c:react',ii('bolt'),CATN.react],['tank',ink('tank'),'Tank'],['heal',ink('heal'),_t('Soin')],['dps',ink('dps'),'DPS']];
const lcHit=(t,r)=>!r||(r.startsWith('c:')?Z.U[t].cat===r.slice(2):Z.roleOf(t)===r);
const lcPrice=t=>Z.CARD_PRICE[Z.RAR[t]||'com'];
// trois états : débloquée, achetable maintenant, hors de portée (plus : victoire en Mutation, jeu complet)
const lcState=t=>META.cards.includes(t)||(META.eds||[]).includes(t)?'in':Z.U[t].vic!=null?'vic':!Z.demoOk(t)?'full':META.points>=lcPrice(t)?'buy':'far';
const lcN=t=>norm(Z.U[t].n+' '+(Z.U[t].d||''));

function lcItem(t,i,q){const st=lcState(t),eds=META.eds||[],sp=!Z.edOf(t)&&Z.edCards(t).some(v=>eds.includes(v)),n=lcN(t);
 const badge=st==='in'?'':st==='vic'?`<span class="cbadge vic">${ii('trophy')}</span>`:st==='buy'?`<span class="lc-pr">${ii('unlock')}${lcPrice(t)}</span>`:`<span class="cbadge lk">${ii('lock')}</span>`;
 return `<div class="lc-w${LC.deal?' deal':''}" data-t="${t}" data-n="${n}" style="--i:${Math.min(i,24)};--dx:${(i%3-1)*-50};--rot:${(i%2?1:-1)*(6+i%4*3)}"${q&&!n.includes(q)?' hidden':''}>
  <div class="lc s-${st}${t===LC.sel?' on':''}" data-a="lcsel" data-v="${t}" role="button" tabindex="0" aria-label="${Z.U[t].n}"><div class="lc-tilt">${cardFace(t,{base:1})}<i class="lc-glare"></i></div>${badge}${cNew(t)}${sp?`<span class="cspec" title="${_t('Carte spéciale obtenue')}"></span>`:''}</div></div>`}

// sous la grande carte : type, faction, rôle et ce qu’il faut pour la débloquer
function lcInfo(t){const U=Z.U[t],st=lcState(t),pr=lcPrice(t),f=Z.famOf(t),ro=Z.roleOf(t),eds=META.eds||[],sp=!Z.edOf(t)&&Z.edCards(t).some(v=>eds.includes(v));
 const meta=[CATN[U.cat],f?Z.FAM[f].n:'',ro?Z.ROLES[ro].n:''].filter(Boolean).map(x=>`<span>${x}</span>`).join('');
 const act=st==='in'?`<b class="lcd-ok">✓ ${_t('Débloquée')}</b>`
  :st==='vic'?_t`<b class="vlock">${ii('trophy')} Victoire en Mutation ${U.vic}</b>`
  :st==='full'?_t`<b class="vlock">${ii('lock')} Jeu complet</b>`
  :st==='buy'?_t`<button type="button" class="buy ok" data-a="unlock" data-v="${t}">${ii('unlock')} Débloquer · ${pr} pts</button>`
  :_t`<span class="cfar"><span>${ii('lock')} ${pr} pts</span><small>il en manque ${pr-META.points}</small></span>`;
 return `<div class="lcd-meta">${meta}</div><div class="lcd-act">${act}</div>${sp?`<p class="lcd-sp">${ii('star')} ${_t('Carte spéciale obtenue')}</p>`:''}`}
const lcBack=()=>`<div class="lcd-back"><i class="lcd-sun"></i><b class="lcd-emb">BARRI<em>CARD</em></b></div>`;
function lcDetail(t){if(!t)return `<p class="lc-none">${_t('Aucune carte.')}</p>`;
 return `<div class="lcd" data-t="${t}"><div class="lcd-float"><div class="lcd-flip"><div class="lcd-tilt"><div class="citem lcd-c">${cardFace(t,{base:1})}</div><i class="lc-glare"></i></div>${lcBack()}</div></div></div><div class="lcd-info">${lcInfo(t)}</div>`}

function lcScreen(keep){if(!keep)cfOpen();const own=META.cards,eds=META.eds||[],pts=META.points,q=norm(CF.q.trim());
 if(CF.fam==='*'&&!eds.length)CF.fam='';const T=lcTypes();if(!T.some(x=>x[0]===CF.role))CF.role='';
 const nIn=Z.KEYS.filter(t=>own.includes(t)).length,nBuy=Z.KEYS.filter(t=>lcState(t)==='buy').length;
 const base=cfPool(Z.KEYS.filter(t=>!CF.own||(CF.own==='b'?lcState(t)==='buy':(CF.own==='y')===own.includes(t))),CF.fam);
 const list=cfList(base);// filtre du type ou du rôle (CF.role) et tri (CF.sort)
 if(!LC.sel||!Z.U[LC.sel]||!list.includes(LC.sel))LC.sel=list[0]||null;
 const isOwn=t=>own.includes(t)||eds.includes(t);
 const filters=T.map(([v,ic,n])=>{const p=base.filter(t=>lcHit(t,v)),o=p.filter(isOwn).length;
  return `<button type="button" class="lc-f${CF.role===v?' on':''}" data-a="lcf" data-v="${v}" aria-pressed="${CF.role===v}">${ic}<span>${n}</span><i>${o}/${p.length}</i></button>`}).join('')
  +`<button type="button" class="lc-f evo" data-a="evo">${ii('spark')}<span>${_t('Évolutions')}</span><i>${(META.evo||[]).filter(k=>Z.EVO[k]).length}/${Z.EVO_KEYS.length}</i></button>`;
 const o=(v,n)=>`<option value="${v}">${n}</option>`;
 const sel=`<div class="lc-sel${CF.more?' on':''}"><select data-f="sort" aria-label="${_t('Trier')}">${o('cat',_t('Par type'))}${o('cost',_t('Par coût'))}${o('rar',_t('Par rareté'))}${o('name',_t('Par nom'))}${o('fam',_t('Par faction'))}</select>
  <select data-f="own" aria-label="${_t('Débloquées')}">${o('',_t('Toutes'))}${o('y',_t('Débloquées'))}${o('n',_t('À débloquer'))}${o('b',_t('À portée'))}</select>
  <select data-f="fam" aria-label="${_t('Faction')}">${o('',_t('Toutes les factions'))}${Object.keys(Z.FAM).map(f=>o(f,Z.FAM[f].n)).join('')}${o('-',_t('Sans faction'))}${eds.length?o('*',_t('Spéciales')):''}</select></div>`;
 const on=CF.sort!=='cat'||CF.own||CF.fam;
 show(`<h2 class="pw chead">${_t('Collection')}<span class="cpts"><b>${pts}</b> ${_t('pts')}</span></h2>
  <div class="lcoll">
   <aside class="lc-side">
    <div class="lc-filters" role="toolbar" aria-label="${_t('Rôle ou type')}">${filters}</div>
    <div class="lc-q"><label class="lc-search">${ii('binoc')}<input type="search" data-f="q" placeholder="${_t('Chercher une carte…')}" value="${CF.q.replace(/"/g,'&quot;')}" aria-label="${_t('Chercher une carte')}"></label><button type="button" class="cfmore${CF.more?' on':''}${on?' act':''}" data-a="cfmore" aria-expanded="${!!CF.more}">${_t('Trier')}</button></div>
    ${sel}
    <div class="lc-sum"><span>${_t`${nIn}/${Z.KEYS.length} débloquées`}</span>${nBuy?`<button type="button" class="lc-buyf${CF.own==='b'?' on':''}" data-a="lcbuy" aria-pressed="${CF.own==='b'}">${ii('unlock')} ${_t`${nBuy} à portée`}</button>`:''}</div>
   </aside>
   <section class="lc-grid-w"><div class="lc-grid">${list.length?list.map((t,i)=>lcItem(t,i,q)).join(''):`<p class="lc-none">${_t('Aucune carte.')}</p>`}</div></section>
   <section class="lc-det" aria-live="polite">${lcDetail(LC.sel)}</section>
  </div>
  <button type="button" class="go" data-a="new">${_t('Préparer une partie')}</button><button type="button" class="skip" data-a="title">${_t('Accueil')}</button>`,keep);
 cfSync();LC.deal=0}

// recherche en direct (le champ garde le focus)
function lcSearch(){const q=norm(CF.q.trim());panel.querySelectorAll('.lc-w').forEach(e=>e.hidden=!!q&&!e.dataset.n.includes(q))}

// la grande carte se retourne pour montrer la nouvelle (dos BARRICARD au milieu)
async function lcShow(t){const box=panel.querySelector('.lc-det');if(!box)return;
 const fl=box.querySelector('.lcd-flip');
 if(!fl||!AOK()||!fl.animate||OPT.eco){box.innerHTML=lcDetail(t);return}
 if(LC.flip){LC.next=t;return}
 LC.flip=1;try{SFX.play('page')}catch(e){}
 try{await fl.animate([{transform:'rotateY(0) translateZ(0)'},{transform:'rotateY(180deg) translateZ(60px)'}],{duration:280,easing:'cubic-bezier(.55,0,.8,.3)',fill:'forwards'}).finished;
  const lcd=box.querySelector('.lcd');if(lcd)lcd.dataset.t=t;
  const c=fl.querySelector('.lcd-c');if(c)c.innerHTML=cardFace(t,{base:1});const inf=box.querySelector('.lcd-info');if(inf)inf.innerHTML=lcInfo(t);box.classList.remove('pop');void box.offsetWidth;box.classList.add('pop');
  await fl.animate([{transform:'rotateY(180deg) translateZ(60px)'},{transform:'rotateY(360deg) translateZ(0)'}],{duration:500,easing:'cubic-bezier(.15,.9,.3,1.15)',fill:'forwards'}).finished;
  fl.getAnimations().forEach(a=>a.cancel())}catch(e){box.innerHTML=lcDetail(t)}
 LC.flip=0;if(LC.next!=null){const n=LC.next;LC.next=null;if(n!==t)lcShow(n)}}

Object.assign(ACT,{
 lcsel:v=>{if(!Z.U[v])return;const el=panel.querySelector(`.lc-w[data-t="${v}"] .lc`);
  if(v!==LC.sel){LC.sel=v;panel.querySelectorAll('.lc.on').forEach(e=>e.classList.remove('on'));if(el){el.classList.add('on');el.classList.remove('picked');void el.offsetWidth;el.classList.add('picked')}lcShow(v)}
  // téléphone : la grande carte est en haut de l’écran
  if(matchMedia('(max-width:899px)').matches){const d=panel.querySelector('.lc-det');if(d&&d.getBoundingClientRect().top<panel.getBoundingClientRect().top)d.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}},
 lcf:v=>{v=v||'';if(CF.role===v)return;CF.role=v;LC.deal=1;try{SFX.play('ui')}catch(e){}collectionScreen(true)},
 lcbuy:()=>{CF.own=CF.own==='b'?'':'b';LC.deal=1;try{SFX.play('ui')}catch(e){}collectionScreen(true)}
});
// clavier : Entrée ou Espace sur une carte de la grille
panel.addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('.lc');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();ACT.lcsel(c.dataset.v)}});
// changement de tri ou de filtre : les cartes sont redistribuées
panel.addEventListener('change',e=>{if(panel.querySelector('.lcoll')&&e.target.dataset&&e.target.dataset.f&&e.target.dataset.f!=='q')LC.deal=1},true);

// inclinaison 3D et reflet qui suivent la souris
let lcHov=null;
function lcReset(c){if(!c)return;c.classList.remove('hov');c.style.removeProperty('--rx');c.style.removeProperty('--ry')}
panel.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||OPT.eco||reduce)return;const c=e.target.closest('.lc,.lcd');
 if(c!==lcHov){lcReset(lcHov);lcHov=c}if(!c)return;const r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height,mx=c.classList.contains('lcd')?10:16;
 c.classList.add('hov');c.style.setProperty('--ry',`${((px-.5)*mx).toFixed(1)}deg`);c.style.setProperty('--rx',`${((.5-py)*mx).toFixed(1)}deg`);c.style.setProperty('--gx',`${(px*100).toFixed(0)}%`);c.style.setProperty('--gy',`${(py*100).toFixed(0)}%`)});
panel.addEventListener('pointerleave',()=>{lcReset(lcHov);lcHov=null});

const _collAx=collectionScreen;
collectionScreen=function(keep){if(!ARTX())return _collAx(keep);if(!keep)LC.deal=1;try{lcScreen(keep)}catch(e){console.error(e);_collAx(keep)}};
