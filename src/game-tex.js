// Essai (branche de test) : pack de textures par-dessus le style artiste (html.artx.tex),
// avec trois ambiances : jour, nuit, nuit rouge (html[data-amb]). Images dans assets/art/tex/. Chargé tout à la fin.
// - plateau : un terrain dessiné par ambiance (9 × 9 dalles, palissade), à la place de l'image du plateau ;
// - PC : disposition de la maquette (colonne de gauche : jour, horde, pioche, cartes, boutons ; à droite : abri, infos, décor, bouton de la nuit ; la main sous le plateau).
const TX={pl:{},amb:'',pc:false,home:null};
function txAmb(){if(typeof G==='undefined'||!G||onTitle||!S.busy)return'day';return Z.pressure(G.night)||G.tier==='blood'?'blood':'night'}
function txImg(a){let im=TX.pl[a];if(!im){im=TX.pl[a]=new Image();im._tx=1;im.onload=()=>{if(TX.amb===a)txPlat(a)};im.src='assets/art/tex/plat-'+a+'.webp'}return im}
function txPlat(a){try{const im=txImg(a);if(!AX.plat||!im.complete||!im.naturalWidth||AX.plat===im)return;AX.plat=im;AXP.key='';axGround()}catch(e){}}
// PC : on déplace quelques éléments (les identifiants restent les mêmes), et on les remet en place en quittant ce mode
function txLay(on){try{if(TX.pc===on)return;const f=$('#felt'),s2=document.querySelector('.side2'),top=document.querySelector('.top'),r=$('#round'),t=$('#table'),app=document.querySelector('.app');if(!f||!s2||!top||!r||!t)return;
 if(on){if(!TX.home)TX.home={r:[r.parentNode,r.nextSibling],top:[top.parentNode,top.nextSibling],t:[t.parentNode,t.nextSibling],b:['pz','mtb','holes'].map(i=>{const e=$('#'+i);return e&&[e,e.parentNode,e.nextSibling]})};
  f.insertBefore(r,f.firstChild);s2.insertBefore(top,s2.firstChild);app.insertBefore(t,s2);
  let bt=$('#txBtns');if(!bt){bt=document.createElement('div');bt.id='txBtns';bt.className='txbtns'}f.appendChild(bt);
  [['pz',_t('Menu')],['mtb',_t('Combats')],['holes',_t('Zones')]].forEach(([i,n])=>{const e=$('#'+i);if(!e)return;bt.appendChild(e);if(!e.querySelector('.txl'))e.insertAdjacentHTML('beforeend',`<span class="txl">${n}</span>`)})}
 else if(TX.home){const H=TX.home,put=([p,n],e)=>{try{p.insertBefore(e,n&&n.parentNode===p?n:null)}catch(x){p.appendChild(e)}};
  put(H.top,top);H.b.slice().reverse().forEach(x=>{if(x)put([x[1],x[2]],x[0])});put(H.r,r);put(H.t,t);const bt=$('#txBtns');if(bt)bt.remove();document.querySelectorAll('.txl').forEach(e=>e.remove())}
 TX.pc=on;try{fit()}catch(e){}try{axLay()}catch(e){}}catch(e){}}
function txSync(){try{const on=DE.classList.contains('artx');DE.classList.toggle('tex',on);txLay(on&&DE.classList.contains('felton'));if(!on)return;const a=txAmb();
 if(TX.amb!==a){TX.amb=a;DE.dataset.amb=a;
  // le terrain de nuit est déjà sombre : voile plus léger, sans teinte bleue en plus ; nuit rouge : voile rouge sang
  NDK=a==='blood'?'38,3,5':'4,7,18';NDA=a==='day'?.8:a==='blood'?.38:.45;NTN=a==='day'?'95,120,190':'235,235,240';['day','night','blood'].forEach(txImg)}
 txPlat(a)}catch(e){}}
{const r0=render;render=function(){const r=r0.apply(this,arguments);txSync();return r}}
addEventListener('resize',()=>setTimeout(txSync,0));setInterval(txSync,400);txSync();
