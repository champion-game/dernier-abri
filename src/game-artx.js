// v200 : refonte du jeu dans le style artiste (html.artx seulement) : plateau dessiné d'Amine comme sol,
// grande carte au survol (PC), « Nuit rouge dans N » sur l'étiquette du jour. Chargé en dernier.
const AX={on:()=>DE.classList.contains('artx'),plat:null};
// sol du plateau : l'image d'Amine (9 × 9 cases + palissade) posée sur les 11 × 11 cases du jeu (la palissade couvre l'anneau de la forêt)
{const g0=buildGround;buildGround=function(B){g0.apply(this,arguments);try{if(!AX.on()||!AX.plat)return;const g=ground.getContext('2d'),k=ground.width/L,sc=T/94.1;
 g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,ground.width,ground.height);g.drawImage(AX.plat,(T-200*sc)*k,(T-162*sc)*k,1245*sc*k,1263*sc*k);g.restore()}catch(e){}}}
function axGround(){try{setBiome.done=0;setBiome(BIOME)}catch(e){}}
function axPlat(){if(AX.plat||!(ART_NEW.ui||[]).includes('plateau.webp'))return axGround();const im=new Image();im.onload=()=>{AX.plat=im;axGround()};im.src='assets/art/ui/plateau.webp'}
{const a0=applyArt;applyArt=function(){a0.apply(this,arguments);try{feltLayout();if(AX.on())axPlat();else axGround()}catch(e){}}}
// la liste des images peut arriver avant le chargement de ce fichier : on refait la disposition ici
try{feltLayout()}catch(e){}if(AX.on())axPlat();
// étiquette du jour : nombre de jours avant la prochaine nuit rouge (lu sur la piste des nuits)
{const r0=render;render=function(){r0.apply(this,arguments);try{const r=$('#round');if(!AX.on()||!r||!G||S.busy||G.oneNight)return;
 const cs=[...document.querySelectorAll('#horde .tc')],i=cs.findIndex(c=>c.classList.contains('now')),j=cs.findIndex((c,k)=>k>i&&c.classList.contains('red'));
 if(i>=0&&j>i&&!r.querySelector('.axn')){const n=j-i;r.insertAdjacentHTML('beforeend',`<small class="axn">${n===1?_t('Nuit rouge demain'):_t`Nuit rouge dans ${n}`}</small>`)}}catch(e){}}}
// PC : en haut du panneau de droite, la carte survolée en grand, sinon la carte choisie (la main est en bas du panneau)
let axHov=null;
function axBig(){try{let big=$('#axBig');const on=AX.on()&&DE.classList.contains('felton')&&G&&S.hand;
 if(!on){if(big)big.hidden=true;return}
 if(!big){big=document.createElement('div');big.id='axBig';big.className='axbig';big.setAttribute('aria-hidden','true');const i=$('#info');i.parentNode.insertBefore(big,i)}
 const k=axHov!=null&&S.hand[axHov]!=null?axHov:(S.sel!=null&&S.sel>=0&&S.hand[S.sel]!=null?S.sel:null);
 if(k==null){DE.classList.remove('axhov');big.hidden=true;big._t=null;return}
 DE.classList.toggle('axhov',axHov!=null);const t=S.hand[k];if(big._t!==t){big.innerHTML=cardFace(t);big._t=t}big.hidden=false}catch(e){}}
{const h=$('#hand');if(h){h.addEventListener('mouseover',e=>{const c=e.target.closest('.card');if(c&&matchMedia('(hover:hover)').matches){axHov=+c.dataset.k;axBig()}});h.addEventListener('mouseleave',()=>{axHov=null;axBig()})}}
{const r2=render;render=function(){r2.apply(this,arguments);axBig()}}
// v202 : fonds et logo d'Amine. L'accueil prend toujours le même fond (pas de tirage parmi les anciens fonds) et le nouveau logo ;
// ses lueurs suivent ce décor : feu de camp qui vacille, lanternes, soleil couchant qui pulse (les braises et la brume restent celles de v174).
const AXG={l:{w:1672,h:941,fire:[[25.3,73.5,6]],lamp:[[5.9,18.5,2.4]],sun:[77.2,39.3,5]},p:{w:941,h:1672,fire:[],lamp:[[1.9,35.3,2.2],[7.6,35.9,2.2],[13.2,70.1,3.2]],sun:[75.2,39.2,7]}};
const AXH={};
function axGlow(){try{const ov=$('#ov');let g=$('#axglow');if(!ov)return;
 if(!AX.on()){if(g)g.remove();['fond','fond-portrait2'].forEach(k=>{if(AXH[k]){HGLOW[k]=AXH[k];delete AXH[k]}});return}
 ['fond','fond-portrait2'].forEach(k=>{if(HGLOW[k]){AXH[k]=HGLOW[k];delete HGLOW[k]}});const og=$('#hglow');if(og)og.remove();
 const por=matchMedia('(max-aspect-ratio:3/4)').matches,d=por?AXG.p:AXG.l,k=por?'p':'l';
 if(!g||g.dataset.k!==k){if(g)g.remove();g=document.createElement('div');g.id='axglow';g.dataset.k=k;g.setAttribute('aria-hidden','true');
  let h=`<i class="ax-sun" style="left:${d.sun[0]}%;top:${d.sun[1]}%;--r:${d.sun[2]}"></i>`;
  d.fire.forEach((f,i)=>{h+=`<i class="ax-fire" style="left:${f[0]}%;top:${f[1]}%;--r:${f[2]};animation-delay:-${i*.41}s"></i>`});
  d.lamp.forEach((f,i)=>{h+=`<i class="ax-lamp" style="left:${f[0]}%;top:${f[1]}%;--r:${f[2]};animation-delay:-${i*.53}s;animation-duration:${1.7+i*.37}s"></i>`});
  g.innerHTML=h;ov.insertBefore(g,ov.firstChild)}
 const W=ov.clientWidth,H=ov.clientHeight,sc=Math.max(W/d.w,H/d.h),w=d.w*sc,hh=d.h*sc;
 g.style.cssText=`width:${w}px;height:${hh}px;left:${(W-w)/2}px;top:${por?0:(H-hh)*.6}px;--w:${w/100}px`}catch(e){}}
{const h0=hglowFit;hglowFit=function(){if(!AX.on())h0.apply(this,arguments);axGlow()}}
addEventListener('resize',axGlow);
// logo : la constante LOGO est fixée avant l'arrivée de la liste des images de l'artiste
{const t0=title;title=function(){if(AX.on()&&typeof FOND_F!=='undefined'&&FOND_F!=='fond.webp'){FOND_F='fond.webp';try{DE.style.setProperty('--fond',`url("${new URL(uiUrl(FOND_F),document.baseURI).href}")`)}catch(e){}}
 const r=t0.apply(this,arguments);try{if(AX.on())document.querySelectorAll('#panel .logo img').forEach(i=>{i.src=uiUrl('barricard.webp')});axGlow()}catch(e){}return r}}
function axHome(){try{if(AX.on()&&typeof FOND_F!=='undefined'){FOND_F='fond.webp';DE.style.setProperty('--fond',`url("${new URL(uiUrl(FOND_F),document.baseURI).href}")`)}
 if(AX.on())document.querySelectorAll('#panel .logo img').forEach(i=>{i.src=uiUrl('barricard.webp')});axGlow()}catch(e){}}
{const a1=applyArt;applyArt=function(){a1.apply(this,arguments);axHome()}}
axHome();
