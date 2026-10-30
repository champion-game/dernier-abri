// Essai (branche de test) : pack de textures par-dessus le style artiste (html.artx.tex),
// avec trois ambiances : jour, nuit, nuit rouge (html[data-amb]). Images dans assets/art/tex/. Chargé tout à la fin.
// - téléphone : plateau dessiné par ambiance (9 × 9 dalles) et cadres du pack sur l'interface actuelle ;
// - PC (html.mq) : la maquette telle quelle (page de 1280 × 853 mise à l'échelle), branchée sur le jeu :
//   la grille 9 × 9 est posée sur les dalles du terrain rectangulaire, la main et les infos du jeu y sont déplacées.
const TX={pl:{},amb:'',mq:false,home:null,h:{}};
const TXI='assets/art/tex/';
function txAmb(){if(typeof G==='undefined'||!G||onTitle||!S.busy)return'day';return Z.pressure(G.night)||G.tier==='blood'?'blood':'night'}
function txImg(a){let im=TX.pl[a];if(!im){im=TX.pl[a]=new Image();im._tx=1;im.onload=()=>{if(TX.amb===a)txPlat(a)};im.src=TXI+'plat-'+a+'.webp'}return im}
function txPlat(a){try{const im=txImg(a);if(!AX.plat||!im.complete||!im.naturalWidth||AX.plat===im)return;AX.plat=im;AXP.key='';axGround()}catch(e){}}
const txSvg=n=>`<img src="${TXI}icons/${n}.svg" alt="">`;
// ---- PC : la maquette ----
function mqBuild(){let m=$('#mq');if(m)return m;m=document.createElement('div');m.id='mq';m.setAttribute('aria-hidden','false');
 m.innerHTML=`<div class="mq-fit"><div class="mq-c">
 <div class="scene-sky"></div><div class="floor-wood"></div>
 <section class="panorama"><img id="mqPano" alt=""></section>
 <section class="battlefield" id="mqBf"><img class="world-base" id="mqField" alt=""><div class="world-shade"></div></section>
 <section class="day-panel paper" id="mqDay"><span class="phase"></span><strong class="day-number"></strong><span class="day-moon"></span><img class="skyline" src="${TXI}icons/skyline.svg" alt=""><div class="day-progress"></div></section>
 <section class="deck-panel metal"><div class="deck-upper" data-mq="deck"><div class="deck-back">${txSvg('biohazard')}</div><div class="deck-copy"><span class="label">${_t('DECK')}</span><strong class="deck-count" id="mqDeckN"></strong><p>${_t('cartes')}<br>${_t('restantes')}</p></div></div>
  <div class="deck-lower"><div class="stock" data-mq="res">${txSvg('cards')}<span>${_t('RÉSERVE')}<strong id="mqRes"></strong></span></div><div class="stock" data-mq="disc">${txSvg('trash')}<span>${_t('DÉFAUSSE')}<strong id="mqDisc"></strong></span></div></div></section>
 <section class="inventory metal"><h2>${_t('CARTES DISPONIBLES')}</h2><div class="inventory-list" id="mqInv"></div></section>
 <nav class="bottom-menu"><button type="button" class="menu-button metal" data-mq="opt">${txSvg('gear')}<span>${_t('Options')}</span></button><button type="button" class="menu-button metal" data-mq="rules">${txSvg('book')}<span>${_t('Règles')}</span></button><button type="button" class="menu-button metal" data-mq="stats">${txSvg('chart')}<span>${_t('Combats')}</span></button></nav>
 <div class="game-toolbar"><button type="button" class="square-control metal" data-mq="sfx" aria-label="${_t('Son')}">${txSvg('speaker')}</button><button type="button" class="square-control metal" data-mq="mus" aria-label="${_t('Musique')}">${txSvg('music')}</button><button type="button" class="square-control metal" data-mq="fs" aria-label="${_t('Plein écran')}">${txSvg('fullscreen')}</button><button type="button" class="square-control metal" data-mq="holes" aria-label="${_t('Zones non couvertes')}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><circle cx="12" cy="12" r="3"/></svg></button></div>
 <section class="shelter-panel paper"><img class="fortress" src="${TXI}icons/shelter.svg" alt=""><h2>${_t('ABRI')}</h2><div class="shelter-value" id="mqShel"></div><div class="health-track"><span id="mqShelB"></span></div></section>
 <section class="threat-panel metal"><img class="horde" src="${TXI}icons/zombies.svg" alt=""><div class="threat-copy"><span><strong id="mqZ"></strong> ${_t('ZOMBIES')}</span><p id="mqZt"></p><div class="threat-boxes" id="mqNrg"></div></div></section>
 <div class="mq-info" id="mqInfo"><div class="mq-ev" id="mqEv"></div></div>
 <div class="hand-support"></div><div class="mq-hand" id="mqHand"></div>
 <button type="button" class="action-button" id="mqGo">${txSvg('zombies')}<span id="mqGoT"></span></button>
 <div class="speed-panel metal" id="mqSpd"><button type="button" data-sp="1">${txSvg('play')}×1</button><button type="button" data-sp="2">×2</button><button type="button" data-sp="4">×4</button></div>
 </div></div>`;
 document.querySelector('.app').appendChild(m);
 m.addEventListener('click',e=>{const b=e.target.closest('[data-mq],[data-sp]');if(!b)return;const k=b.dataset.mq,c=i=>{const x=$('#'+i);if(x)x.click()};
  if(b.dataset.sp){const v=+b.dataset.sp;OPT.speed=v;saveOpt();if(S.busy)SPEED=v;SFX.play('ui');mqSync();return}
  if(k==='deck')c('round');else if(k==='res')c('pRes');else if(k==='disc')c('pDisc');else if(k==='opt')c('pz');else if(k==='stats')c('mtb');else if(k==='holes')c('holes');else if(k==='sfx')c('mute');else if(k==='fs')c('fs');
  else if(k==='rules'){try{ACT.rules()}catch(x){c('pz')}}
  else if(k==='mus'){OPT.mus=OPT.mus>0?0:(TX.mus||.6);if(OPT.mus)TX.mus=OPT.mus;try{SFX.setVol(OPT.sfx,OPT.mus)}catch(x){}saveOpt();mqSync()}});
 $('#mqGo').addEventListener('click',()=>{const g=$('#go');if(g&&!g.disabled&&!(S.busy&&!S.pause))g.click()});
 return m}
// la grille du jeu (11 × 11 avec l'anneau de la forêt) posée sur les dalles du terrain : 9 colonnes au centre des 13, les 9 rangées
function mqPlace(){const c=$('#map');if(!c||!L)return;const W=730,H=630,X=x=>x*W/1536,Y=y=>y*H/1024,cw=(1256-286)/9,ch=(960-90)/9;
 const x0=X(286-cw),x1=X(1256+cw),y0=Y(90-ch),y1=Y(960+ch),f=PADU/L,w=x1-x0,h=y1-y0;
 const st={left:(x0-w*f)+'px',top:(y0-h*f)+'px',width:(w*(1+2*f))+'px',height:(h*(1+2*f))+'px'};
 for(const k in st)c.style.setProperty(k,st[k],'important')}
function mqLay(on){try{if(TX.mq===on)return;const app=document.querySelector('.app'),c=$('#map'),h=$('#hand'),i=$('#info');if(!app||!c||!h||!i)return;
 if(on){const m=mqBuild();if(!TX.home)TX.home=[[c,c.parentNode,c.nextSibling],[h,h.parentNode,h.nextSibling],[i,i.parentNode,i.nextSibling]];
  $('#mqBf').appendChild(c);$('#mqHand').appendChild(h);$('#mqInfo').appendChild(i);DE.classList.add('mq');m.hidden=false}
 else{DE.classList.remove('mq');const m=$('#mq');if(m)m.hidden=true;if(TX.home)TX.home.forEach(([e,p,n])=>{try{p.insertBefore(e,n&&n.parentNode===p?n:null)}catch(x){p.appendChild(e)}});
  ['left','top','width','height'].forEach(k=>c.style.removeProperty(k))}
 TX.mq=on;mqFit();try{fit()}catch(e){}try{axLay()}catch(e){}if(on)mqPlace();mqSync()}catch(e){}}
function mqFit(){const m=$('#mq');if(!m||!TX.mq)return;const s=Math.min(innerWidth/1280,innerHeight/853),f=m.firstChild;f.style.width=1280*s+'px';f.style.height=853*s+'px';f.firstChild.style.transform=`scale(${s})`}
const mqSet=(id,html)=>{const e=$('#'+id);if(e&&TX.h[id]!==html){TX.h[id]=html;e.innerHTML=html}};
function mqSync(){try{if(!TX.mq||typeof G==='undefined'||!G||!S.draw)return;const a=TX.amb||'day';
 const fi=$('#mqField'),pa=$('#mqPano');if(fi.dataset.a!==a){fi.dataset.a=a;fi.src=TXI+'field-'+a+'.webp';pa.src=TXI+'pano-'+a+'.webp'}
 // jour
 const d=$('#mqDay');d.querySelector('.phase').textContent=G.oneNight?_t('DÉFI'):S.busy?_t('NUIT'):_t('JOUR');d.querySelector('.day-number').textContent=G.night;
 {const cs=[...document.querySelectorAll('#horde .tc')],n=cs.findIndex(x=>x.classList.contains('now'));mqSet('mqDP',cs.map((x,k)=>`<i class="${k<n?'filled':k===n?'half':''}${x.classList.contains('red')?' red':''}"></i>`).join(''));
  const dp=d.querySelector('.day-progress');if(!dp.id)dp.id='mqDP'}
 // pioche, réserve, défausse
 mqSet('mqDeckN',''+S.draw.length);mqSet('mqRes',''+(G.bench||[]).length);mqSet('mqDisc',''+S.discard.length);
 // cartes disponibles : chaque carte du deck, avec le nombre restant dans la pioche
 {const left={},tot={};S.draw.forEach(t=>left[t]=(left[t]||0)+1);[...S.draw,...S.hand,...S.discard].forEach(t=>tot[t]=1);const sel=S.sel!=null&&S.sel>=0?S.hand[S.sel]:null;
  const ks=Object.keys(tot).filter(t=>Z.U[t]).sort((x,y)=>(left[y]?1:0)-(left[x]?1:0)||cardName(x).localeCompare(cardName(y)));
  mqSet('mqInv',ks.map(t=>{const n=left[t]||0;return `<div class="inventory-row${t===sel?' selected':''}${n?'':' empty'}" title="${cardName(t)}"><img class="inv-icon" src="${artUrl(t)}" alt=""><strong>${cardName(t)}</strong><span class="inv-count">${n}</span></div>`}).join(''))}
 // abri
 {const mx=Z.maxS(G),v=Math.max(0,G.shelter);mqSet('mqShel',`<span>${v}</span> / <span>${mx}</span>`);$('#mqShelB').style.width=Math.max(0,Math.min(100,v/mx*100))+'%'}
 // zombies : ceux de la nuit qui vient, puis ceux encore dehors ; les cases jaunes : l'énergie
 {let n=0;if(S.busy)n=(G.z||[]).filter(z=>z&&!(z.hp<=0)).length+(G.pending||[]).length;else{const w=Z.waveList(G);for(const k in w)n+=w[k]}
  mqSet('mqZ',''+n);mqSet('mqZt',S.busy?_t('encore dehors.'):_t('attendus cette nuit.'));const e=Math.max(0,G.energy??Z.ENERGY);mqSet('mqNrg',Array.from({length:Math.max(Z.ENERGY,e)},(_,k)=>`<i class="${k<e?'filled':''}"></i>`).join(''))}
 {const ev=$('#event .fiche-top b')||$('#event'),t=ev?(ev.firstChild&&ev.firstChild.nodeType===3?ev.firstChild.textContent:(ev.innerText||'').split('\n')[0]).trim():'';mqSet('mqEv',t)}
 // bouton de la nuit et vitesse
 {const g=$('#go'),busy=S.busy&&!S.pause;mqSet('mqGoT',S.busy?(S.pause?(g?g.textContent:''):_t('Nuit en cours')):_t('Affronter<br>la nuit'));$('#mqGo').classList.toggle('off',!!(busy||(g&&g.disabled)));
  const sp=S.busy?SPEED:(OPT.speed||1);document.querySelectorAll('#mqSpd [data-sp]').forEach(b=>b.classList.toggle('active',+b.dataset.sp===sp))}
 $('#mq').querySelector('[data-mq=mus]').classList.toggle('muted',!(OPT.mus>0));
 }catch(e){}}
// l'abri au centre : la barricade du pack
{const sb=new Image();sb.src=TXI+'shelter-barricade.webp';const ds=drawShelter;drawShelter=function(){if(!TX.mq||!sb.complete||!sb.naturalWidth)return ds.apply(this,arguments);try{const x=CEN.x,y=CEN.y,f=G.shelter/Z.maxS(G),s=T*1.55,r=sb.naturalHeight/sb.naturalWidth;
 ctx.save();ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowOffsetX=-T*.08;ctx.shadowOffsetY=T*.12;ctx.shadowBlur=T*.06;ctx.drawImage(sb,x-s/2,y-s*r/2,s,s*r);ctx.restore();
 if(f<.5){ctx.save();ctx.globalAlpha=(.5-f)*.8;ctx.globalCompositeOperation='source-atop';ctx.fillStyle='#1a0a06';ctx.fillRect(x-s/2,y-s*r/2,s,s*r);ctx.restore()}}catch(e){return ds.apply(this,arguments)}}}
function txSync(){try{const on=DE.classList.contains('artx');DE.classList.toggle('tex',on);mqLay(on&&DE.classList.contains('felton'));if(!on)return;const a=txAmb();
 if(TX.amb!==a){TX.amb=a;DE.dataset.amb=a;['day','night','blood'].forEach(txImg)}
 // téléphone : le terrain de nuit est déjà sombre, voile plus léger, rouge la nuit rouge ; PC (maquette) : pas de voile, le terrain porte l'ambiance
 NDK=a==='blood'?'38,3,5':'4,7,18';NTN=a==='day'?'95,120,190':'235,235,240';NDA=a==='day'?.8:TX.mq?0:a==='blood'?.38:.45;
 txPlat(a);mqSync()}catch(e){}}
{const r0=render;render=function(){const r=r0.apply(this,arguments);txSync();return r}}
addEventListener('resize',()=>setTimeout(()=>{txSync();mqFit();if(TX.mq)mqPlace()},0));setInterval(txSync,300);txSync();
