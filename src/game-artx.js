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
// v204 : PC — nombre de cartes de la main, pour l'éventail
{const r3=render;render=function(){r3.apply(this,arguments);try{const h=$('#hand');if(h)h.style.setProperty('--hn',Math.max(1,h.querySelectorAll('.card').length))}catch(e){}}}
// v205 : PC — l'image du plateau entière (palissade, miradors) derrière le canvas, calée sur ses cases ;
// le panneau de gauche commence à la hauteur du panneau « Abri » (symétrie)
function axLay(){try{const on=AX.on()&&DE.classList.contains('felton')&&AX.plat,c=$('#map');let d=$('#axPlat');
 if(!on||!c){if(d)d.hidden=true;{const fx=$('#axFx');if(fx)fx.hidden=true}DE.style.removeProperty('--axlt');return}
 if(!d){d=document.createElement('div');d.id='axPlat';d.setAttribute('aria-hidden','true');c.parentNode.insertBefore(d,c)}
 const a=c.parentNode.getBoundingClientRect(),r=c.getBoundingClientRect(),k=r.width/L,sc=T/94.1;
 d.style.cssText=`left:${r.left-a.left+(T-200*sc)*k}px;top:${r.top-a.top+(T-162*sc)*k}px;width:${1245*sc*k}px;height:${1263*sc*k}px`;d.hidden=false;
 if(!d.firstChild){d.innerHTML='<i id="axNight"></i>'}
 let fx=$('#axFx');if(!fx){fx=document.createElement('canvas');fx.id='axFx';fx.setAttribute('aria-hidden','true');c.parentNode.appendChild(fx)}
 {const w=r.width*AXM;fx.style.left=(r.left-a.left-w)+'px';fx.style.top=(r.top-a.top-w)+'px';fx.style.width=fx.style.height=(r.width+2*w)+'px';fx.hidden=false}d._ox=(200*sc-T)*k;d._cw=r.width;

 const sh=document.querySelector('.top .shel');if(sh)DE.style.setProperty('--axlt',Math.max(0,sh.getBoundingClientRect().top-a.top-6)+'px')}catch(e){}}
{const r4=render;render=function(){r4.apply(this,arguments);axLay()}}
addEventListener('resize',()=>setTimeout(axLay,50));
// v206 : voile de nuit de la palissade, calqué sur drawDark (game-draw.js) : même couleur, même intensité (nightAmt), même aube
{let last='';const loop=()=>{try{const d=$('#axPlat'),n=$('#axNight');if(d&&n&&!d.hidden){let bg='none';
 const dq=(performance.now()-dawnT)/DAWN,dawn=dq>=0&&dq<1&&nightTarget===0;
 if(dawn){const fx=1-dq*1.35,ox=d._ox||0,cw=d._cw||1,W=d.offsetWidth||1,st=[];for(let k=0;k<=12;k++){const x=k/12*W,s=(x-ox)/cw;st.push(`rgba(4,7,18,${(.8*Math.min(1,Math.max(0,(fx+.3-s)/.3))).toFixed(3)}) ${x.toFixed(0)}px`)}bg=`linear-gradient(90deg,${st.join(',')})`}
 else if(nightAmt>=.01)bg=`rgba(4,7,18,${(.8*nightAmt).toFixed(3)})`;
 if(bg!==last){n.style.background=bg;last=bg}
 axFxDraw()}}catch(e){}requestAnimationFrame(loop)};requestAnimationFrame(loop)}
// v208 : nuit (PC) — les effets de brume de la v195 (nappes du bord : ringFog ; bandes qui dérivent : drawFog) sont dessinés sur #axFx,
// un canvas qui déborde du plateau (AXM de chaque côté) : mêmes formules, même rythme, mais ils continuent sur la palissade, donc plus de bord visible
const AXM=.13;let AXRF=null;
function axOn(){return AX.on()&&DE.classList.contains('felton')&&AX.plat}
{const rf=ringFog;let E=null;ringFog=function(){if(axOn()){if(!E){E=document.createElement('canvas');E.width=E.height=2}return E}return rf.apply(this,arguments)}}
{const df=drawFog;drawFog=function(){if(axOn())return;return df.apply(this,arguments)}}
function axRing(){if(AXRF)return AXRF;const W=L*(1+2*AXM),o=L*AXM,c=document.createElement('canvas');c.width=c.height=Math.round(W/2);const g=c.getContext('2d'),r=rng(31);g.scale(.5,.5);
 for(let k=0;k<150;k++){let x=o+r()*L,y=o+r()*L;const s=Math.floor(r()*4),d=-T*.9+r()*T*2.1;if(s===0)y=o+d;else if(s===1)y=o+L-d;else if(s===2)x=o+d;else x=o+L-d;
  const rr=18+r()*24,gr=g.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,'rgba(170,190,215,.3)');gr.addColorStop(1,'rgba(170,190,215,0)');g.fillStyle=gr;g.fillRect(x-rr,y-rr,rr*2,rr*2)}
 return AXRF=c}
function axFxDraw(){const fx=$('#axFx');if(!fx||fx.hidden)return;const px=Math.round(fx.offsetWidth*Math.min(OPT.eco?1:2,devicePixelRatio||1));
 if(fx.width!==px){fx.width=fx.height=px}const g=fx.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,px,px);const dq0=(performance.now()-dawnT)/DAWN;if(nightAmt<.03&&!(dq0>=0&&dq0<1))return;
 const W=L*(1+2*AXM),k=px/W,o=L*AXM,now=performance.now();g.setTransform(k,0,0,k,o*k,o*k);
 // bandes de brume (drawFog) : sous le voile de la nuit dans la v195, donc atténuées comme lui
 if(typeof FOG!=='undefined'&&FOG){const n=OPT.eco?3:6;for(let j=0;j<n;j++){const w=L*.75,sp=reduce?0:.006+j*.0017,x=((j*W*.37+now*sp)%(W+w))-w/2-o,y=L*(.12+j*.15)+Math.sin(now/5000+j)*12;
  g.globalAlpha=.07*nightAmt*(1-.8*nightAmt);g.drawImage(FOG,x-w/2,y-w*.16,w,w*.32)}}
 // clair de lune (drawGlow) et soleil de l'aube (drawDark) : le canvas les dessine sur les cases, on les prolonge autour (même dégradé, hors des cases)
 g.save();g.beginPath();g.rect(-o,-o,W,W);g.rect(L,0,-L,L);g.clip('evenodd');
 if(!AX.moon){AX.moon=g.createRadialGradient(L*.92,L*.05,0,L*.92,L*.05,L*.95);AX.moon.addColorStop(0,'rgba(110,140,210,.2)');AX.moon.addColorStop(1,'rgba(110,140,210,0)')}
 g.globalAlpha=nightAmt;g.fillStyle=AX.moon;g.fillRect(-o,-o,W,W);g.globalAlpha=1;
 const dq=(now-dawnT)/DAWN;if(dq>=0&&dq<1&&nightTarget===0){const sx=L+T*.4,sy=L*(.85-.5*dq),R=L*.95,a=.5*Math.sin(dq*Math.PI),sg=g.createRadialGradient(sx,sy,0,sx,sy,R);
  sg.addColorStop(0,`rgba(255,214,140,${a})`);sg.addColorStop(.35,`rgba(255,150,70,${a*.5})`);sg.addColorStop(1,'rgba(255,120,60,0)');g.fillStyle=sg;g.fillRect(-o,-o,W,W)}
 g.restore();
 // nappes du bord (ringFog), au-dessus du voile comme dans la v195
 const dx=reduce?0:Math.sin(now/2600)*5,dy=reduce?0:Math.cos(now/3100)*4;g.globalAlpha=nightAmt*.75;g.drawImage(axRing(),dx-o,dy-o,W,W);g.globalAlpha=1}
// v210 : PC — l'éclairage du jeu (drawSky : soleil, ombre, rayons, nuages, crépuscule, teinte de nuit) n'est plus dessiné sur les seules 11 × 11 cases
// (il formait un carré) : il est peint sur l'image entière du plateau (#axPc), à pleine force sur les 9 × 9 cases jouables, puis il s'estompe
// jusqu'au bord de l'image. Le canvas du jeu laisse voir l'image (sol transparent) et ne dessine plus drawSky dans ce mode.
let axSky=null;try{axSky=(0,eval)('('+String(drawSky).replace(/if\(nightAmt>\.03\)\{ctx\.globalAlpha=nightAmt\*\.7;[^}]*\}/,'').replace(/^function drawSky\(now\)/,'function(now,XC,AXR,AXT)').replace(/\bctx\b/g,'XC').replace(/fillRect\(0,0,L,L\)/g,'fillRect(AXR[0],AXR[1],AXR[2],AXR[3])').replace(/setTransform\(\.\.\.CAM\)/g,'setTransform(...AXT)')+')')}catch(e){axSky=null}
{const ds=drawSky;drawSky=function(){if(axOn()&&axSky)return;return ds.apply(this,arguments)}}
{const fi=frameInner;frameInner=function(){if(axOn()&&axSky){try{ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height)}catch(e){}}return fi.apply(this,arguments)}}
{const bg=buildGround;buildGround=function(){const r=bg.apply(this,arguments);try{if(axOn()&&axSky){const g=ground.getContext('2d');g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,ground.width,ground.height);g.restore()}}catch(e){}return r}}
const AXP={t:0,B:null,M:null,key:''};
function axPaint(){try{const d=$('#axPlat');if(!d||d.hidden||!axOn()||!axSky)return;let pc=$('#axPc');
 if(!pc){pc=document.createElement('canvas');pc.id='axPc';d.insertBefore(pc,d.firstChild)}
 const now=performance.now();if(now-AXP.t<(OPT.eco?100:33))return;AXP.t=now;
 const dpr=Math.min(OPT.eco?1:1.5,devicePixelRatio||1),w=Math.round(d.offsetWidth*dpr),h=Math.round(d.offsetHeight*dpr);if(!w||!h)return;
 if(pc.width!==w||pc.height!==h){pc.width=w;pc.height=h}
 const sc=T/94.1,iw=1245*sc,ih=1263*sc,ox=T-200*sc,oy=T-162*sc,k=w/iw;/* coordonnées du jeu -> pixels de l'image : x' = (x - ox) * k */
 const key=w+'x'+h;if(AXP.key!==key){AXP.key=key;AXP.B=document.createElement('canvas');AXP.B.width=w;AXP.B.height=h;const M=AXP.M=document.createElement('canvas');M.width=w;M.height=h;
  const m=M.getContext('2d'),gx0=(T-ox)*k,gx1=(L-T-ox)*k,gy0=(T-oy)*k,gy1=(L-T-oy)*k;
  let gr=m.createLinearGradient(0,0,w,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(gx0/w,'#000');gr.addColorStop(gx1/w,'#000');gr.addColorStop(1,'rgba(0,0,0,0)');m.fillStyle=gr;m.fillRect(0,0,w,h);
  m.globalCompositeOperation='destination-in';gr=m.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(gy0/h,'#000');gr.addColorStop(gy1/h,'#000');gr.addColorStop(1,'rgba(0,0,0,0)');m.fillStyle=gr;m.fillRect(0,0,w,h)}
 const p=pc.getContext('2d'),B=AXP.B,b=B.getContext('2d'),n=Math.min(1,Math.max(0,nightAmt));
 p.setTransform(1,0,0,1,0,0);p.globalAlpha=1;p.globalCompositeOperation='source-over';p.clearRect(0,0,w,h);p.drawImage(AX.plat,0,0,w,h);
 // teinte bleu lune de la nuit (drawSky) : partout, sans estompage
 if(n>.03){p.globalAlpha=n*.7;p.globalCompositeOperation='multiply';p.fillStyle='rgb(95,120,190)';p.fillRect(0,0,w,h);p.globalAlpha=1;p.globalCompositeOperation='destination-in';p.drawImage(AX.plat,0,0,w,h);p.globalCompositeOperation='source-over'}
 // lumière du jour et du crépuscule : pleine sur les cases, estompée jusqu'au bord de l'image
 b.setTransform(1,0,0,1,0,0);b.globalAlpha=1;b.globalCompositeOperation='source-over';b.clearRect(0,0,w,h);b.drawImage(pc,0,0);
 const T0=[k,0,0,k,-ox*k,-oy*k];b.setTransform(...T0);axSky(now,b,[ox,oy,iw,ih],T0);
 b.setTransform(1,0,0,1,0,0);b.globalAlpha=1;b.globalCompositeOperation='destination-in';b.drawImage(AX.plat,0,0,w,h);b.drawImage(AXP.M,0,0);b.globalCompositeOperation='source-over';
 p.drawImage(B,0,0);
 // voile de la nuit et de l'aube (drawDark) hors des cases : le canvas du jeu le dessine déjà sur les cases
 {const dq=(now-dawnT)/DAWN,dawn=dq>=0&&dq<1&&nightTarget===0,cx0=(0-ox)*k,cy0=(0-oy)*k,cw=L*k;if(dawn||n>=.01){
  p.save();p.beginPath();p.rect(0,0,w,h);p.rect(cx0+cw,cy0,-cw,cw);p.clip('evenodd');
  if(dawn){const fx=1-dq*1.35,gr=p.createLinearGradient(cx0,0,cx0+cw,0);for(let j=0;j<=8;j++){const q=j/8;gr.addColorStop(q,`rgba(4,7,18,${.8*Math.min(1,Math.max(0,(fx+.3-q)/.3))})`)}
   p.fillStyle=gr;p.fillRect(0,0,cx0+.5,h);p.fillRect(0,0,w,h)}
  else{p.fillStyle=`rgba(4,7,18,${.8*n})`;p.fillRect(0,0,w,h)}
  p.globalCompositeOperation='destination-in';p.drawImage(AX.plat,0,0,w,h);p.restore()}}
}catch(e){}}
{let raf=()=>{axPaint();requestAnimationFrame(raf)};requestAnimationFrame(raf)}
