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
// grande carte au survol de la main (PC, souris), dans la colonne de droite
{let big=null;const show=k=>{try{if(!AX.on()||!DE.classList.contains('felton')||!matchMedia('(hover:hover)').matches)return;const t=S.hand[k];if(t==null)return;
  if(!big){big=document.createElement('div');big.id='axBig';big.className='axbig';const i=$('#info');i.parentNode.insertBefore(big,i)}
  big.innerHTML=cardFace(t);big.hidden=false}catch(e){}};
 const hide=()=>{if(big)big.hidden=true};
 const h=$('#hand');if(h){h.addEventListener('mouseover',e=>{const c=e.target.closest('.card');if(c)show(+c.dataset.k)});h.addEventListener('mouseleave',hide);h.addEventListener('click',hide)}}
