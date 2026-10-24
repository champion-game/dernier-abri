/* v170 : animations de cartes inspirées de Hearthstone (main, plateau, menus).
   Règles : tout reste court, ne bloque jamais le joueur (un toucher passe toujours), et rien ne s'anime si l'appareil
   demande moins de mouvement. Le Mode économie retire les effets en boucle (lueurs, reflets) dans style.css. */
const AOK=()=>!reduce;
function aEl(cls,html,parent){const e=document.createElement('div');e.className=cls;if(html)e.innerHTML=html;(parent||document.body).appendChild(e);return e}
function aAnim(el,kf,o){try{return el.animate(kf,o)}catch(e){return null}}
function aDone(a,f){if(a){a.onfinish=f;a.oncancel=f}else f()}
const aMid=r=>({x:r.left+r.width/2,y:r.top+r.height/2});
const RARC={com:'#efe9da',rare:'#4fa3ff',epic:'#b06bff',leg:'#ffb02e'};

/* ---------- main : éventail, cartes jouables, refus ---------- */
// appelé à chaque dessin de la main (render) : la main se courbe en arc, les cartes jouables brillent.
// --ph garde la lueur en phase d'un dessin à l'autre (sinon elle repartirait de zéro à chaque tick de la nuit)
function handFx(hand){const cs=[...hand.querySelectorAll('.card')],n=cs.length,now=performance.now();
 hand.style.setProperty('--ph',-(now%1600)+'ms');hand.style.setProperty('--ph2',-(now%7000)+'ms');
 const cols=(getComputedStyle(hand).gridTemplateColumns||'').split(' ').filter(Boolean).length||n,fan=n>1&&n<=cols&&!LANDTALL.matches,mid=(n-1)/2;
 // la main est redessinée à chaque tick de la nuit : on place l'éventail sans transition, sinon les cartes repartent de 0° et bougent
 cs.forEach(c=>c.style.transition='none');
 cs.forEach((c,k)=>{const d=k-mid;c.style.setProperty('--fr',fan?(d*Math.min(3,10/n)).toFixed(2)+'deg':'0deg');c.style.setProperty('--fy',fan?(d*d*Math.min(2.2,7/n)).toFixed(1)+'px':'0px');
  c.classList.toggle('play',!c.disabled&&!S.dawnWait)});
 void hand.offsetWidth;cs.forEach(c=>c.style.transition='')}
// au doigt : la carte touchée se lève tout de suite (comme le survol à la souris)
$('#hand').addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;const b=e.target.closest('.card');if(b&&!b.disabled)b.classList.add('lift')});
['pointerup','pointercancel'].forEach(n=>addEventListener(n,()=>document.querySelectorAll('#hand .card.lift').forEach(c=>c.classList.remove('lift'))));
function shakeCard(c){if(!c||!AOK())return;const y=c.classList.contains('sel')?-8:0;
 aAnim(c,[{transform:`translate(0,${y}px)`},{transform:`translate(-7px,${y}px) rotate(-3deg)`},{transform:`translate(6px,${y}px) rotate(2deg)`},{transform:`translate(-4px,${y}px)`},{transform:`translate(2px,${y}px)`},{transform:`translate(0,${y}px)`}],{duration:320,easing:'ease-out'})}
function refuseBubble(c,txt){if(!c||!txt)return;document.querySelectorAll('.nobub').forEach(e=>e.remove());const r=c.getBoundingClientRect(),b=aEl('nobub');b.textContent=txt;
 b.style.left=Math.max(70,Math.min(innerWidth-70,r.left+r.width/2))+'px';b.style.top=Math.max(8,r.top-8)+'px';setTimeout(()=>b.remove(),1300)}
// une case refusée : la carte choisie tremble et revient, la case clignote en rouge
function refuseFx(i){try{SFX.play('no',.25)}catch(e){}vib(25);shakeCard(document.querySelector('#hand .card.sel'));
 try{if(i!=null&&i>=0){const p=tc(i);addFX({type:'ring',x:p.x,y:p.y,r:26,c:'#e5484d',dur:300});addFX({type:'flash',x:p.x,y:p.y,r:16,c:'rgba(229,72,77,.45)',dur:220})}}catch(e){}}
// une carte grisée de la main : elle tremble et dit pourquoi elle ne se joue pas
let RFD=null;
addEventListener('pointerdown',e=>{const c=e.target.closest&&e.target.closest('#hand .card');RFD=c&&c.disabled?{c,x:e.clientX,y:e.clientY,t:performance.now()}:null},true);
addEventListener('pointerup',e=>{const r=RFD;RFD=null;if(!r||!ov.hidden||performance.now()-r.t>420||Math.hypot(e.clientX-r.x,e.clientY-r.y)>12)return;
 const c=r.c;let t=null,why='';if(c.dataset.k!==undefined)t=S.hand[+c.dataset.k];else if(c.dataset.u!==undefined)t=S.used[+c.dataset.u];if(!t||!Z.U[t])return;
 if(c.dataset.k!==undefined&&!S.busy&&Z.U[t].react)why=_t('Se joue la nuit');else if(c.dataset.k!==undefined&&S.busy&&!Z.U[t].react)why=_t('Se joue le jour');
 else if(c.dataset.u!==undefined?Z.buildCost(G,t,true)>(G.energy??0):!Z.canPay(G,t))why=_t('Pas assez d’énergie');
 if(!why)return;shakeCard(c);refuseBubble(c,why);try{SFX.play('no',.25)}catch(x){}},true);

/* ---------- glisser : la carte se penche dans le sens du mouvement ---------- */
let TILT={r:0,x:0,raf:0};
addEventListener('pointermove',e=>{if(!HD||!HD.on||!HD.g)return;const vx=e.clientX-(TILT.x||e.clientX);TILT.x=e.clientX;TILT.r=Math.max(-20,Math.min(20,TILT.r*.7+vx*1.4));
 if(!TILT.raf&&AOK()){const f=()=>{if(!HD||!HD.g){TILT.raf=0;TILT.r=0;TILT.x=0;return}TILT.r*=.86;HD.g.style.rotate=TILT.r.toFixed(1)+'deg';TILT.raf=requestAnimationFrame(f)};TILT.raf=requestAnimationFrame(f)}});

/* ---------- pose : la carte vole jusqu'à la case et s'écrase ---------- */
function placeFx(t,i,D){const sel=document.querySelector('#hand .card.sel'),a=LASTRECT||(sel&&sel.getBoundingClientRect());
 if(D.instant){if(a&&AOK())fly(t,a,cellRect(D.onUnit?i:Z.C),0,0,null,{s1:.45,dur:260});return}
 if(!a||!AOK()){landFx(i);return}
 const dur=230;SLAM[i]=performance.now()+dur;fly(t,a,cellRect(i),0,0,null,{s1:.5,dur});setTimeout(()=>landFx(i),dur+150)}
function landFx(i){try{const p=tc(i);burst(p.x,p.y,'#cdb68a',OPT.eco?5:11,.07,2.3);burst(p.x,p.y,'rgba(90,70,40,.7)',OPT.eco?2:5,.05,3);
 addFX({type:'ring',x:p.x,y:p.y,r:32,c:'rgba(235,215,170,.95)',dur:320});shake(performance.now(),3);SFX.play('thud',.05)}catch(e){}}

/* ---------- fin du jour : les cartes réutilisables non jouées brûlent ---------- */
function burnFx(){if(!AOK())return 0;const cs=[...document.querySelectorAll('#hand .card.reuse')];if(!cs.length)return 0;
 cs.forEach((c,k)=>{const r=c.getBoundingClientRect();if(!r.width)return;const g=aEl('burnc',c.innerHTML);g.style.left=r.left+'px';g.style.top=r.top+'px';g.style.width=r.width+'px';g.style.animationDelay=k*70+'ms';
  if(!OPT.eco)for(let j=0;j<6;j++){const s=aEl('ember','',g);s.style.left=(15+Math.random()*70)+'%';s.style.animationDelay=(k*70+120+Math.random()*300)+'ms'}
  setTimeout(()=>g.remove(),900+k*70)});
 try{SFX.play('flame',.1)}catch(e){}setTimeout(()=>{const px=$('#pDisc');if(px){px.classList.add('pulse');setTimeout(()=>px.classList.remove('pulse'),600)}},650);return 1}

/* ---------- nuit : une défense détruite vole en éclats ---------- */
function shardsFx(x,y,t){const D=Z.U[t]||{};const wc={wood:'#a07a4a',stake:'#8a6238',stone:'#a8a498',metal:'#a9b3b8',steel:'#7d868d',sand:'#c9ab73',tire:'#333',rust:'#9a4a2c',stripe:'#e8e0d0',electric:'#9fe8ff'}[WMAT[t]||(D.block?'stone':'wood')];
 const cs=[wc,CATC[D.cat]||'#d8c7a0','#3a2a1a'],s=[];for(let k=0;k<(OPT.eco?6:13);k++){const a=Math.random()*6.28,v=.04+Math.random()*.11;s.push({vx:Math.cos(a)*v,vy:Math.sin(a)*v-.1,a:Math.random()*6,va:(Math.random()-.5)*.03,r:2.5+Math.random()*4,c:cs[k%3]})}
 addFX({type:'shards',x,y,s,dur:700});addFX({type:'flash',x,y,r:26,c:'rgba(255,245,225,.8)',dur:160})}

/* ---------- aube : les 3 cartes au choix arrivent face cachée et se retournent ---------- */
function dealPicks(){if(!AOK())return;const ps=[...panel.querySelectorAll('.picks .pick[data-a=draft]')];
 ps.forEach((b,k)=>{const cf=b.querySelector('.cf');if(!cf)return;const r=(cf.className.match(/\br-(\w+)/)||[])[1]||'com';const bk=aEl('pk-bk','',b);
  aAnim(b,[{transform:'translateY(70px) rotate(-8deg) scale(.7)',opacity:0},{transform:'none',opacity:1}],{duration:320,delay:k*110,easing:'cubic-bezier(.2,1.3,.4,1)',fill:'backwards'});
  setTimeout(()=>{const a=aAnim(b,[{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:110,easing:'ease-in'});
   aDone(a,()=>{bk.remove();const f=aEl('pk-fl','',b);f.style.setProperty('--rc',RARC[r]);setTimeout(()=>f.remove(),700);aAnim(b,[{transform:'scaleX(0)'},{transform:'scaleX(1.06)',offset:.7},{transform:'scaleX(1)'}],{duration:200,easing:'ease-out'});
    try{SFX.play(r==='epic'||r==='leg'?'rare':'card',.05)}catch(e){}})},420+k*170)})}
const _dawnStep=dawnStep;dawnStep=function(ph,picks){const r=_dawnStep(ph,picks);if(ph==='draft')try{dealPicks()}catch(e){}return r};

/* ---------- grande carte : elle grandit depuis sa place, penche sous le doigt, reflet qui suit ---------- */
const _zoomCf=zoomCf;zoomCf=function(cf,lp){_zoomCf(cf,lp);try{const z=zoomEl.querySelector('.zoomc');if(!z)return;aEl('zsh','',z);
 if(AOK()&&cf&&cf.getBoundingClientRect){const a=cf.getBoundingClientRect(),b=z.getBoundingClientRect();if(a.width&&b.width){const s=a.width/b.width,dx=aMid(a).x-aMid(b).x,dy=aMid(a).y-aMid(b).y;
  aAnim(z,[{transform:`translate(${dx}px,${dy}px) scale(${s})`},{transform:'none'}],{duration:280,easing:'cubic-bezier(.2,1.2,.4,1)'})}}}catch(e){}};
function zoomTilt(e){const z=zoomEl.querySelector('.zoomc');if(!z||!AOK())return;const r=z.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
 if(x<-.3||x>1.3||y<-.3||y>1.3){z.style.transform='';return}const cx=Math.max(0,Math.min(1,x)),cy=Math.max(0,Math.min(1,y));
 z.style.transform=`perspective(900px) rotateY(${((cx-.5)*22).toFixed(1)}deg) rotateX(${((.5-cy)*22).toFixed(1)}deg)`;z.style.setProperty('--mx',(cx*100).toFixed(0)+'%');z.style.setProperty('--my',(cy*100).toFixed(0)+'%');z.classList.add('tilt')}
zoomEl.addEventListener('pointermove',zoomTilt);zoomEl.addEventListener('pointerdown',zoomTilt);
zoomEl.addEventListener('pointerleave',()=>{const z=zoomEl.querySelector('.zoomc');if(z){z.style.transform='';z.classList.remove('tilt')}});
// collection, deck, évolutions : toucher une carte l'affiche en grand
panel.addEventListener('click',e=>{const cf=e.target.closest('.citem .cf');if(!cf||e.target.closest('button')||!zoomEl.hidden)return;zoomCf(cf)});

/* ---------- collection : cascade, déblocage ---------- */
// les cartes entrent en vague (fan : elles partent d'une pile au centre et se déploient)
function cascade(fan){if(!AOK())return;const pr=panel.getBoundingClientRect(),cx=pr.left+pr.width/2;let k=0;
 for(const w of panel.querySelectorAll('.citem-w:not([hidden])')){const r=w.getBoundingClientRect();if(r.top>innerHeight)break;if(r.bottom<0)continue;if(k>=28)break;
  const dx=cx-aMid(r).x;aAnim(w,fan?[{transform:`translate(${dx}px,60px) rotate(${(-dx/14).toFixed(1)}deg) scale(.6)`,opacity:0},{transform:'none',opacity:1}]:[{transform:'translateY(16px) scale(.92)',opacity:0},{transform:'none',opacity:1}],
   {duration:fan?360:240,delay:k*(fan?28:22),easing:'cubic-bezier(.2,1.1,.4,1)',fill:'backwards'});k++}
 if(fan&&k)try{SFX.play('shuffle')}catch(e){}}
const _collectionScreen=collectionScreen;collectionScreen=function(keep){_collectionScreen(keep);if(!keep)try{cascade(0)}catch(e){}};
const _deckEditor=deckEditor;deckEditor=function(keep){_deckEditor(keep);if(!keep)try{cascade(1)}catch(e){}};
panel.addEventListener('change',e=>{const f=e.target.dataset&&e.target.dataset.f;if(f&&f!=='q')try{cascade(0)}catch(x){}});
const itemOf=t=>panel.querySelector(`.citem-w[data-t="${t}"] .citem`);
function coinsFx(a,b,n){if(!a||!b)return;const p=aMid(a),q=aMid(b);for(let k=0;k<n;k++){const c=aEl('coin');const ox=(Math.random()-.5)*40,oy=(Math.random()-.5)*20;
 const an=aAnim(c,[{transform:`translate(${p.x+ox}px,${p.y+oy}px) scale(.6)`,opacity:0},{transform:`translate(${(p.x+q.x)/2}px,${Math.min(p.y,q.y)-50}px) scale(1.1)`,opacity:1,offset:.5},{transform:`translate(${q.x}px,${q.y}px) scale(.5)`,opacity:.9}],{duration:460,delay:k*45,easing:'ease-in',fill:'both'});
 aDone(an,()=>c.remove());if(k%3===0)setTimeout(()=>{try{SFX.play('coin',.03)}catch(e){}},k*45+420)}}
function unlockFx(t,src){const it=itemOf(t);if(!it||!AOK())return;const cf=it.querySelector('.cf');if(!cf)return;
 coinsFx(src,cf.getBoundingClientRect(),9);it.classList.add('unl');const lk=aEl('ulock',ii('lock'),it);
 setTimeout(()=>{it.classList.replace('unl','unl2');aEl('uburst','',it);try{SFX.play('rare')}catch(e){}vib(40);
  setTimeout(()=>{const s=aEl('ustamp',_t('Obtenue'),it);setTimeout(()=>{it.classList.remove('unl','unl2');it.querySelectorAll('.ulock,.uburst,.ustamp').forEach(e=>e.remove())},1500)},300)},560)}
const _unlock=ACT.unlock;ACT.unlock=v=>{const had=META.cards.includes(v),src=panel.querySelector('h2+p b');const sr=src&&src.getBoundingClientRect();_unlock(v);if(!had&&META.cards.includes(v))try{unlockFx(v,sr)}catch(e){}};

/* ---------- decks : ajout, retrait, deck complet ---------- */
const dkCount=()=>panel.querySelector('h2+p b');
function popEl(el,c){if(el&&AOK())aAnim(el,[{transform:'scale(1)',color:''},{transform:'scale(1.5)',color:c,offset:.35},{transform:'scale(1)',color:''}],{duration:380,easing:'ease-out'})}
const _dkp=ACT.dkp;ACT.dkp=v=>{const d=META.decks[META.slot],n0=d.length,e0=Z.deckError(d,META.cards),it=itemOf(v),a=it&&it.querySelector('.cf').getBoundingClientRect();_dkp(v);
 if(META.decks[META.slot].length<=n0||!AOK())return;const c=dkCount(),it2=itemOf(v);try{SFX.play('card',.03)}catch(e){}
 if(it2)aAnim(it2,[{transform:'scale(1.06)'},{transform:'none'}],{duration:260,easing:'cubic-bezier(.3,1.6,.5,1)'});
 if(a&&c)fly(v,a,c.getBoundingClientRect(),0,0,()=>{popEl(dkCount(),'#9fd86b');const d1=META.decks[META.slot];if((e0&&!Z.deckError(d1,META.cards))||d1.length===Z.DECK_MAX)deckDone()},{s1:.3,dur:380})};
const _dkm=ACT.dkm;ACT.dkm=v=>{const n0=META.decks[META.slot].length,c0=dkCount(),a=c0&&c0.getBoundingClientRect();_dkm(v);if(META.decks[META.slot].length>=n0||!AOK())return;
 popEl(dkCount(),'#e5484d');const it=itemOf(v);if(a&&it){const b=it.querySelector('.cf').getBoundingClientRect();fly(v,a,{left:b.left,top:b.top+b.height*.3,width:b.width,height:b.height},0,0,null,{s0:.3,s1:.6,dur:320})}};
function deckDone(){const p=dkCount();if(!p)return;const h=p.closest('p');h.classList.remove('dkok');void h.offsetWidth;h.classList.add('dkok');setTimeout(()=>h.classList.remove('dkok'),1400);try{SFX.play('lvl')}catch(e){}}

/* ---------- préparation : le deck choisi avance, les autres reculent ---------- */
const _prepdeck=ACT.prepdeck;ACT.prepdeck=v=>{_prepdeck(v);if(!AOK())return;const ts=[...panel.querySelectorAll('[data-a=prepdeck]')];
 ts.forEach(b=>{if(b.classList.contains('on'))aAnim(b,[{transform:'scale(.9)',filter:'brightness(1.6)'},{transform:'scale(1.1)',offset:.5},{transform:'none',filter:'none'}],{duration:380,easing:'ease-out'});
  else aAnim(b,[{opacity:.4,transform:'scale(.94)'},{opacity:1,transform:'none'}],{duration:420,easing:'ease-out'})});try{SFX.play('card',.03)}catch(e){}};

/* ---------- lancement : le deck est battu puis plonge dans la pioche ---------- */
function launchFx(){const L=aEl('launch');const n=OPT.eco?6:10,cs=[];for(let k=0;k<n;k++){const c=aEl('lcard','',L);c.style.zIndex=k;cs.push(c)}
 let done=false;const end=()=>{if(done)return;done=true;removeEventListener('pointerdown',end,true);aDone(aAnim(L,[{opacity:1},{opacity:0}],{duration:140}),()=>L.remove())};
 addEventListener('pointerdown',end,true);try{SFX.play('shuffle')}catch(e){}setTimeout(()=>{try{SFX.play('shuffle')}catch(e){}},300);
 cs.forEach((c,k)=>{const s=k%2?1:-1,o=k*1.2;aAnim(c,[{transform:`translate(-50%,calc(-50% - ${o}px))`},{transform:`translate(calc(-50% + ${s*46}px),calc(-50% - ${o}px)) rotate(${s*9}deg)`,offset:.25},{transform:`translate(-50%,calc(-50% - ${o}px))`,offset:.5},{transform:`translate(calc(-50% + ${-s*40}px),calc(-50% - ${o}px)) rotate(${-s*8}deg)`,offset:.75},{transform:`translate(-50%,calc(-50% - ${o}px))`}],{duration:560,easing:'ease-in-out'})});
 setTimeout(()=>{if(done)return;const pd=$('#pDraw'),b=pd&&pd.getBoundingClientRect();const tx=b&&b.width?aMid(b).x-innerWidth/2:0,ty=b&&b.width?aMid(b).y-innerHeight/2:200;try{SFX.play('whoosh')}catch(e){}
  cs.forEach((c,k)=>aAnim(c,[{transform:'translate(-50%,-50%)',opacity:1},{transform:`translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(.4) rotate(${k*7-30}deg)`,opacity:.2}],{duration:300,delay:(n-k)*22,easing:'cubic-bezier(.5,0,.8,.4)',fill:'both'}));
  setTimeout(()=>{if(!done){done=true;removeEventListener('pointerdown',end,true);L.remove()}},300+n*22+20);
  if(pd)setTimeout(()=>{pd.classList.add('pulse');setTimeout(()=>pd.classList.remove('pulse'),600)},300+n*22)},580)}
const _start=ACT.start;ACT.start=()=>{const was=!ov.hidden;if(AOK())HOLDT=performance.now()+950;_start();if(was&&ov.hidden&&AOK())try{launchFx()}catch(e){}else HOLDT=0};

/* ---------- récompense : paquet qui tremble puis explose, retournement selon la rareté ---------- */
function packFx(){const gs=panel.querySelector('.gifts');if(!gs)return;gs.classList.add('wait');const p=aEl('gpack','<span class="gp-glow"></span><span class="gp-card"></span>',gs);
 let done=false;const open=()=>{if(done)return;done=true;try{SFX.play('pack')}catch(e){}vib(50);p.classList.add('boom');gs.classList.remove('wait');setTimeout(()=>p.remove(),500)};
 p.addEventListener('click',e=>{e.stopPropagation();open()});gs.addEventListener('click',open,{once:true,capture:true});setTimeout(open,1100)}
const _giftScreen=giftScreen;giftScreen=function(){_giftScreen();const g=META.gift;if(g&&!g.up.length&&!g.got.length&&AOK())try{packFx()}catch(e){}};
function revealFx(i,r){const el=panel.querySelectorAll('.gift')[i];if(!el)return;const f=aEl('grays','',el);f.style.setProperty('--rc',RARC[r]);setTimeout(()=>f.remove(),1100);
 if(r==='epic'||r==='leg'){aAnim(panel,[{transform:'none'},{transform:'translate(-5px,2px)'},{transform:'translate(4px,-2px)'},{transform:'translate(-2px,1px)'},{transform:'none'}],{duration:300});try{SFX.play('rare')}catch(e){}vib(r==='leg'?[60,40,90]:60)}}
let GBUSY=0;const _gift=ACT.gift;ACT.gift=v=>{const g=META.gift,i=+v,t=g&&g.c[i];const flip=t&&!g.up.includes(i)&&!g.got.includes(i);if(!flip||!AOK())return _gift(v);if(GBUSY)return;
 const r=Z.RAR[t]||'com',big=r==='epic'||r==='leg';const el=panel.querySelectorAll('.gift')[i];
 // épique ou légendaire : la carte tremble et sa lueur monte avant de se retourner (le suspense)
 if(big&&el){GBUSY=1;el.classList.add('charge');setTimeout(()=>{GBUSY=0;el.classList.remove('charge');_gift(v);setTimeout(()=>revealFx(i,r),260)},420);return}
 _gift(v);setTimeout(()=>revealFx(i,r),260)};

/* ======== v171 : deuxième série (unités, nuit, économie, menus) ======== */
// coordonnées du plateau (canvas) vers l'écran
function cvPt(p){const r=cv.getBoundingClientRect();return{left:r.left+p.x/L*r.width-6,top:r.top+p.y/L*r.height-6,width:12,height:12}}
// 27 : fusion : éclairs dorés entre les cartes, puis l'étoile tombe sur l'unité
function bolt(a,b,c){ctx.strokeStyle=c;ctx.lineWidth=2.4;ctx.shadowColor=c;ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(a.x,a.y);const n=7;for(let k=1;k<n;k++){const q=k/n;ctx.lineTo(a.x+(b.x-a.x)*q+(Math.random()-.5)*14,a.y+(b.y-a.y)*q+(Math.random()-.5)*14)}ctx.lineTo(b.x,b.y);ctx.stroke()}
const _mergeFx=mergeFx;mergeFx=function(m){_mergeFx(m);try{if(!m||typeof m!=='object'||m.k!=='fuse'||!AOK())return;const p=tc(m.i),fr=(m.from||[]).map(tc);
 addFX({type:'fn',dur:380,fn:q=>{ctx.globalAlpha=1-q;fr.forEach(a=>bolt(a,p,'#ffe27a'))}});
 addFX({type:'fn',dur:700,fn:q=>{const k=Math.min(1,q/.45),y=p.y-70*(1-k*k),b=q>.45?Math.sin((q-.45)/.55*Math.PI)*.35:0;ctx.globalAlpha=q<.85?1:(1-q)/.15;ctx.font='bold 30px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillText('★',p.x+1,y+2);ctx.fillStyle='#ffd23f';ctx.save();ctx.translate(p.x,y);ctx.scale(1+b,1-b*.6);ctx.fillText('★',0,0);ctx.restore()}});
 setTimeout(()=>{burst(p.x,p.y-6,'#fff1b0',12,.1,2);shake(performance.now(),4)},320)}catch(e){}};
// 28 : niveau : colonne de lumière et « N2 » qui grossit puis se pose
function lvFx(i,lv){if(!AOK())return;const p=tc(i);
 addFX({type:'fn',dur:800,fn:q=>{const a=q<.2?q/.2:(1-q)/.8,g=ctx.createLinearGradient(0,p.y-110,0,p.y+20);g.addColorStop(0,'rgba(180,255,150,0)');g.addColorStop(.7,`rgba(180,255,150,${.55*a})`);g.addColorStop(1,'rgba(180,255,150,0)');ctx.fillStyle=g;const w=26*(1-q*.4);ctx.fillRect(p.x-w/2,p.y-110,w,130);
  const s=q<.3?2.4-1.4*(q/.3):1;ctx.globalAlpha=q<.8?1:(1-q)/.2;ctx.font=`bold ${Math.round(16*s)}px system-ui,sans-serif`;ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(_t('N')+lv,p.x+1,p.y-36+1);ctx.fillStyle='#b6f08a';ctx.fillText(_t('N')+lv,p.x,p.y-36)}});
 try{SFX.play('lvl',.2)}catch(e){}}
// 29 : survivant qui rejoint l'abri : son nom s'écrit à la machine
function typeFx(){const f=floats[floats.length-1];if(!f||!AOK())return;f.tw=650;f.t0=performance.now();const n=Math.min(12,Math.ceil(f.txt.length/3));for(let k=0;k<n;k++)setTimeout(()=>{try{SFX.play('tick',.01)}catch(e){}},k*55)}
// 31 : boss : bandeau qui traverse l'écran et ralenti
function bossBanner(name){if(!AOK())return;const b=aEl('bossban',`<span>${name}</span>`);setTimeout(()=>b.remove(),2000);slowT=Math.max(slowT,performance.now()+700);try{shake(performance.now(),8)}catch(e){}}
const _resumeWave=resumeWave;resumeWave=function(){const was=S.pause;_resumeWave();if(was&&!S.pause)try{bossBanner(capF(bossName(G.night)).toUpperCase())}catch(e){}};
// 32 : dernier zombie de la nuit : ralenti et zoom sur le coup final
const _playEvents=playEvents;playEvents=function(ev,types,now){_playEvents(ev,types,now);try{if(!S.busy||!AOK())return;const d=ev.filter(e=>e.k==='die');if(!d.length||G.z.length||G.pending.length||(G.waves>1&&G.wave<G.waves))return;
 const p=DEADP[DEADP.length-1]||CEN;slowT=Math.max(slowT,now+1100);camZoom(now,p.x,p.y,.14,1300);shake(now,7);addFX({type:'flash',x:p.x,y:p.y,r:40,c:'rgba(255,240,200,.85)',dur:350,light:T*2});addFX({type:'ring',x:p.x,y:p.y,r:90,c:'#ffe7a0',dur:700});
 floatTxt(p.x,p.y-24,_t('Dernier !'),'#ffe7a0',20);try{SFX.play('boom',.1)}catch(x){}}catch(e){}};
// 33, 34, 35 : après chaque dessin de l'interface (abri en danger, énergie, ferraille)
let RP={e:null,s:null,day:null};
function renderFx(){if(!G)return;
 // 33 : l'abri presque détruit : la barre bat comme un cœur, les bords de l'écran pulsent en rouge
 const dg=S.busy&&G.shelter>0&&G.shelter/Z.maxS(G)<=.3;document.documentElement.classList.toggle('danger',!!dg);
 if(dg&&!document.querySelector('.dangerv'))aEl('dangerv');
 // 34 : énergie : le point dépensé s'éteint, au lever du jour la jauge se rallume une à une
 const e=G.energy??0,pips=[...document.querySelectorAll('#info .nrg i')];
 if(RP.e!=null&&AOK()&&!S.busy&&pips.length){
  if(e<RP.e)pips.slice(e,RP.e).forEach(i=>aAnim(i,[{background:'#ffe7a0',transform:'scale(1.5)',boxShadow:'0 0 8px #ffd25a'},{transform:'scale(1)'}],{duration:380,easing:'ease-out'}));
  else if(e>RP.e&&RP.day!==G.night)pips.filter(i=>i.classList.contains('on')).forEach((i,k)=>{aAnim(i,[{opacity:.15,transform:'scale(.5)'},{opacity:1,transform:'scale(1.35)',offset:.6},{opacity:1,transform:'scale(1)'}],{duration:320,delay:k*110,easing:'ease-out',fill:'backwards'});setTimeout(()=>{try{SFX.play('tick',.01)}catch(x){}},k*110)})}
 RP.e=e;if(!S.busy)RP.day=G.night;
 // 35 : ferraille gagnée : des pièces sortent des zombies tués et volent vers le compteur
 const sc=G.scrap||0;if(RP.s!=null&&sc>RP.s&&S.busy&&AOK()){const tok=document.querySelector('#fams .tok.coin');if(tok){const b=tok.getBoundingClientRect(),n=Math.min(5,sc-RP.s);
  for(let k=0;k<n;k++){const p=DEADP.length?DEADP.shift():CEN;const c=aEl('coin scrapc');const a=cvPt(p),q=aMid(b);const an=aAnim(c,[{transform:`translate(${a.left+6}px,${a.top+6}px) scale(.5)`,opacity:0},{transform:`translate(${a.left+6+(Math.random()-.5)*30}px,${a.top-24}px) scale(1)`,opacity:1,offset:.3},{transform:`translate(${q.x}px,${q.y}px) scale(.6)`,opacity:.9}],{duration:620,delay:k*70,easing:'ease-in',fill:'both'});
   aDone(an,()=>{c.remove();aAnim(tok,[{transform:'scale(1.35)'},{transform:'none'}],{duration:220})})}}}
 if(!S.busy)DEADP.length=0;RP.s=sc}
// 36 : relique obtenue : elle tourne en 3D au centre, puis file se ranger
const _relic=ACT.relic;ACT.relic=v=>{const b=panel.querySelector(`[data-a=relic][data-v="${v}"]`),ic=b&&b.querySelector('svg,img,.ri,i');const html=ic?ic.outerHTML:'';_relic(v);if(!html||!AOK())return;
 const r=aEl('relicfx',`<span class="rf-rays"></span><span class="rf-ic">${html}</span>`);const ic2=r.querySelector('.rf-ic');aAnim(ic2,[{transform:'scale(.3) rotateY(0)'},{transform:'scale(1.2) rotateY(540deg)',offset:.6},{transform:'scale(1) rotateY(720deg)'}],{duration:800,easing:'ease-out'});
 setTimeout(()=>{const t=document.querySelector('#round'),tb=t&&t.getBoundingClientRect(),dx=tb?aMid(tb).x-innerWidth/2:0,dy=tb?aMid(tb).y-innerHeight/2:-innerHeight/2;
  aDone(aAnim(r,[{transform:'none',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.2)`,opacity:0}],{duration:420,easing:'ease-in',fill:'both'}),()=>r.remove())},900)};
// 37 : troc : la carte achetée vole vers la main, la ferraille descend chiffre par chiffre
let SCR0=null;panel.addEventListener('click',()=>{SCR0=G&&!S.busy?G.scrap:null},true);
panel.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(SCR0==null||!G||G.scrap>=SCR0||!AOK())return;const from=SCR0,to=G.scrap;SCR0=null;
 const el=[...panel.querySelectorAll('h2+p b')].find(x=>/^\d+/.test(x.textContent));if(el){const rest=el.textContent.replace(/^\d+/,'');const st=performance.now(),dur=Math.min(700,(from-to)*45);
  const f=now=>{const q=Math.min(1,(now-st)/dur);el.textContent=Math.round(from-(from-to)*q)+rest;if(q<1)requestAnimationFrame(f);else aAnim(el,[{color:'#e5484d',transform:'scale(1.2)'},{transform:'none'}],{duration:300})};requestAnimationFrame(f)}
 if(b&&b.dataset.a==='store-buy'&&b.dataset.v){const it=b.closest('.citem'),cf=it&&it.querySelector('.cf'),h=$('#hand');if(cf&&h)fly(b.dataset.v,cf.getBoundingClientRect(),h.getBoundingClientRect(),0,0,null,{s1:.6,dur:450});try{SFX.play('coin')}catch(x){}}});
// 39 : mutation choisie : le chiffre se fissure, lueur verte toxique
const _prepmen=ACT.prepmen;ACT.prepmen=v=>{_prepmen(v);if(!+v||!AOK())return;const t=panel.querySelector('.menace .tab.on');if(!t)return;t.classList.add('mcrack');
 aEl('crk','<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0 L17 11 L23 16 L15 25 L21 30 L18 40 M23 16 L32 12 M15 25 L6 27"/></svg>',t);try{SFX.play('crack')}catch(e){}};
// 40 : succès : la médaille tombe du haut et rebondit, son de cloche
const _showAch=showAch;showAch=function(){const was=achEl&&!achEl.hidden;_showAch();if(!was&&achEl&&!achEl.hidden)try{SFX.play('bell')}catch(e){}};
// 41 : points de fin de partie : le total monte par paliers, avec un petit tremblement à chaque palier
countUp=function(){panel.querySelectorAll('[data-count]').forEach(el=>{const n=+el.dataset.count;if(!(n>0))return;if(!AOK()){el.textContent=n;return}const st=Math.min(6,n);el.textContent='0';
 for(let k=1;k<=st;k++)setTimeout(()=>{if(!el.isConnected)return;el.textContent=Math.round(n*k/st);const big=k===st;aAnim(el,[{transform:`scale(${big?1.6:1.3}) rotate(${k%2?-4:4}deg)`,color:big?'#ffd25a':''},{transform:'none'}],{duration:big?420:220,easing:'ease-out'});try{SFX.play(big?'lvl':'coin',.02)}catch(e){}},k*170)})};
// 41 (suite) : écrans de fin : les points gagnés montent par paliers (l'écran peut venir après celui de la récompense)
let ENDPTS=0;
function endPts(){if(!ENDPTS)return;const b=[...panel.querySelectorAll('p b')].find(x=>x.textContent===String(ENDPTS));if(!b)return;ENDPTS=0;b.dataset.count=b.textContent;b.style.display='inline-block';countUp()}
const _show=show;show=function(h,keep){_show(h,keep);try{endPts()}catch(e){}};
['end','leaveWin','demoEnd'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(...a){const p0=META.points;ENDPTS=0;const r=f.apply(this,a);try{const d=META.points-p0;if(d>0){ENDPTS=d;endPts()}}catch(e){}return r}});
