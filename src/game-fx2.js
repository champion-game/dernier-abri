/* ======== v191 : interface et animations, troisième série ========
   Chargé après game-fiche.js. Comme game-anim.js, il enveloppe quelques fonctions des autres fichiers.
   1 : avant → après sur les unités qu'une carte améliore (équipement, soin, fusion, évolution)
   3 : bouton « trous » : les cases du chemin des zombies qu'aucune unité n'atteint
   5 : bouton de la nuit vivant quand l'énergie est dépensée
   6 : nuit rouge en cinématique (ciel rouge, caméra qui avance, titre tapé à la machine, cri lointain)
   7 : gros zombie abattu : ralenti et zoom à l'endroit
   8 : maison touchée : les bords de l'écran s'allument en rouge
   9 : aube : un rayon de soleil balaie la carte, les zombies restants partent en fumée */

// ---------- 1 : avant → après ----------
let UPG={k:'',m:new Map()};
function simG(){return Object.assign(JSON.parse(JSON.stringify({...G,event:null,z:[],pending:[]})),{event:G.event})}
function uStats(st,i){const u=st.grid[i];if(!u||!Z.U[u.t])return null;const D=Z.stat(st,u.t);let d=0;
 if(D.dmg){d=D.dmg;try{d+=Z.dmgParts(st,i,Z.famLevels(st)).reduce((a,p)=>a+(p.s?0:p.v),0)}catch(e){d+=Z.unitDmg(u)}}
 return{d,mx:Z.maxHp(st,u),hp:u.hp,g:u.gold||0}}
function upgLines(a,b){const L=[];if(!a||!b)return L;
 const st=b.g>a.g?'★'.repeat(b.g+1):'';
 if(b.d!==a.d)L.push((st?st+' ':'')+'⚔'+a.d+'→'+b.d);else if(st)L.push(st);
 if(b.mx!==a.mx)L.push('♥'+a.mx+'→'+b.mx);else if(b.hp!==a.hp)L.push('♥'+a.hp+'→'+b.hp);
 return L}
function upgPrev(t){const key=t+'|'+JSON.stringify(G.grid)+'|'+(G.relics||[]).join()+'|'+G.night;if(UPG.k===key)return UPG.m;const m=new Map();UPG={k:key,m};
 const D=Z.stat(G,t);if(!D||D.react)return m;const rnd=()=>.5;
 const sim=i=>{const st=simG();let r=null;try{r=Z.place(st,t,i,rnd)}catch(e){return null}return{st,r}};
 // équipement et soin : la carte se pose sur l'unité elle-même
 if(D.equip||D.onUnit){G.grid.forEach((u,i)=>{if(!u||!Z.canPlace(G,t,i))return;const s=sim(i);if(!s)return;const L=upgLines(uStats(G,i),uStats(s.st,i));if(L.length)m.set(i,{L,c:'#9fd86b'})});return m}
 if(D.instant||!D.block)return m;
 // fusion : une case libre suffit (les unités absorbées sont les plus proches) ; évolution : une case libre voisine du partenaire
 const tt=Z.baseOf(t),free=Z.INNER.filter(i=>!G.grid[i]&&Z.canPlace(G,t,i)),g0=0;
 const same=G.grid.filter(u=>u&&u.t===tt&&(u.gold||0)===g0).length;
 const tries=[];if(same>=1){const i=free.find(i=>!Z.around(i).some(j=>G.grid[j]&&Z.EVO_KEYS.some(k=>{const[x,y]=Z.EVO[k];return(x===tt&&y===G.grid[j].t)||(y===tt&&x===G.grid[j].t)})));if(i!=null)tries.push(i)}
 G.grid.forEach((u,j)=>{if(!u||u.gold||Z.U[u.t].evo)return;if(!Z.EVO_KEYS.some(k=>{const[x,y]=Z.EVO[k];return(x===tt&&y===u.t)||(y===tt&&x===u.t)}))return;const i=free.find(i=>Z.around(i).includes(j));if(i!=null)tries.push(i)});
 for(const i of tries){const s=sim(i);const r=s&&s.r;if(!r)continue;
  if(r.k==='fuse'){const a=uStats(G,r.from[0]),b=uStats(s.st,i);const L=upgLines(a,b);if(L.length)r.from.forEach(j=>{if(G.grid[j]&&!m.has(j))m.set(j,{L,c:'#ffd25a'})})}
  else if(r.k==='evo'&&G.grid[r.j]&&!m.has(r.j))m.set(r.j,{L:['✦ '+(Z.U[r.t]||{}).n],c:'#c9a2ff'})}
 return m}
function drawUpg(now){if(S.busy||S.moveFrom!=null)return;const t=selCard();if(!t)return;const m=upgPrev(t);if(!m.size)return;const pu=.88+.12*Math.sin(now/260);
 ctx.save();ctx.globalAlpha=pu;m.forEach((v,i)=>{const p=tc(i),n=v.L.length,h=23;v.L.forEach((s,k)=>bTag(p.x,p.y-T*.1+(k-(n-1)/2)*h,s,v.c,18))});ctx.restore()}

// ---------- 3 : trous de la défense ----------
let HOLES={sig:'',z:[]};
function drawHoles(now){if(!OPT.holes||S.busy||!G)return;const sig=G.grid.map(u=>u?u.t:'').join()+'|'+G.place+'|'+G.side+'|'+(G.relics||[]).length;
 if(sig!==HOLES.sig){let z=[];try{const k=Z.killZones(G,0);z=Object.keys(k).filter(j=>k[j]===0).map(Number)}catch(e){}HOLES={sig,z}}
 const a=.32+.12*Math.sin(now/400);ctx.save();ctx.setLineDash([9,6]);ctx.lineDashOffset=-now/60;
 HOLES.z.forEach(j=>{const p=tc(j);ctx.fillStyle=`rgba(229,52,40,${a})`;ctx.fillRect(p.x-T/2+3,p.y-T/2+3,T-6,T-6);ctx.strokeStyle='rgba(255,215,200,.95)';ctx.lineWidth=3;ctx.strokeRect(p.x-T/2+6,p.y-T/2+6,T-12,T-12)});
 ctx.setLineDash([]);ctx.restore()}
function holesSync(){const b=$('#holes');if(!b)return;b.classList.toggle('on',!!OPT.holes);b.setAttribute('aria-pressed',OPT.holes?'true':'false')}
try{const b=$('#holes');if(b){b.setAttribute('aria-label',_t('Zones non couvertes'));b.title=_t('Zones non couvertes');b.addEventListener('click',()=>{OPT.holes=OPT.holes?0:1;saveOpt();holesSync();try{SFX.play('ui')}catch(e){}});holesSync()}}catch(e){}

// ---------- 9 : aube ----------
let DAWNSW=-1e9;const SWEEP=1300;
const _endNight=Z.endNight;Z.endNight=function(st){const r=_endNight.apply(this,arguments);if(typeof G!=='undefined'&&st===G)DAWNSW=performance.now();return r};
const _syncZ=syncZ;syncZ=function(now){
 // à l'aube, les zombies encore debout restent figés, puis partent en fumée quand le rayon de soleil les touche
 try{if(now-DAWNSW<200&&!(G.z||[]).length&&AOK())for(const v of V.values())if(!v.dying){const p=zpos(v,now);v.dx=p.x;v.dy=p.y;v.dying=DAWNSW+150+clamp((p.x+p.y)/(2*L),0,1)*(SWEEP-300);v.smoke=1}}catch(e){}
 _syncZ(now)};
function drawDawn(now){const q=(now-DAWNSW)/SWEEP;if(q<0||q>1)return;
 for(const v of V.values())if(v.smoke===1&&now>=v.dying){v.smoke=2;const x=v.dx,y=v.dy;burst(x,y,'rgba(190,185,175,.75)',OPT.eco?5:12,.05,3.4);burst(x,y-4,'#ffb347',OPT.eco?2:6,.08,1.6);addFX({type:'flash',x,y,r:18,c:'rgba(255,214,140,.7)',dur:260})}
 if(OPT.eco||!AOK())return;
 const W=L*.55,pos=-W+q*(2*L+2*W),al=Math.sin(q*Math.PI);ctx.save();ctx.globalCompositeOperation='lighter';
 const g=ctx.createLinearGradient((pos-W)/2,(pos-W)/2,(pos+W)/2,(pos+W)/2);g.addColorStop(0,'rgba(255,200,120,0)');g.addColorStop(.5,`rgba(255,214,140,${.38*al})`);g.addColorStop(.62,`rgba(255,240,200,${.22*al})`);g.addColorStop(1,'rgba(255,200,120,0)');
 ctx.fillStyle=g;ctx.fillRect(0,0,L,L);ctx.restore()}

// dessins sur la carte : après les aperçus de pose (mêmes coordonnées)
const _placeHints=placeHints;placeHints=function(now){_placeHints(now);try{drawHoles(now)}catch(e){}try{drawUpg(now)}catch(e){}try{drawDawn(now)}catch(e){}};

// ---------- 5 : bouton de la nuit ----------
const _render=render;render=function(){_render();try{const go=$('#go');if(!go||!G)return;let ready=false;
 if(!S.busy&&!S.pause&&!S.dawnWait&&ov.hidden){const e=G.energy??0;ready=e<=0||!(S.hand||[]).some(t=>{try{return Z.canPay(G,t)&&!(Z.U[Z.baseOf(t)]||{}).react}catch(x){return false}})}
 go.classList.toggle('ready',ready);go.classList.toggle('idle',!S.busy&&!S.pause&&!ready)}catch(e){}};

// ---------- 6 : nuit rouge ----------
const _nightBanner=nightBanner;nightBanner=function(){_nightBanner();try{if(!G||!Z.pressure(G.night)||!AOK())return;const now=performance.now();
 const bs=document.querySelectorAll('.nightban'),el=bs[bs.length-1];
 aEl('redsky');setTimeout(()=>{document.querySelectorAll('.redsky').forEach(x=>x.remove())},2600);
 try{camZoom(now,CEN.x,CEN.y,.07,2200)}catch(e){}
 setTimeout(()=>{try{SFX.play('roar')}catch(e){}},800);
 if(el){el.classList.add('cine');el.insertAdjacentHTML('afterbegin',`<em>${_t('Nuit rouge')}</em>`);const b=el.querySelector('b');if(b){const txt=b.textContent;b.textContent='';b.style.minWidth='1ch';let k=0;
  const ty=()=>{if(!b.isConnected)return;k++;b.textContent=txt.slice(0,k);if(k<txt.length)setTimeout(ty,75)};setTimeout(ty,250)}}}catch(e){}};

// ---------- 7 : gros zombie abattu ----------
let BIGK=0;
const _playEvents2=playEvents;playEvents=function(ev,types,now){_playEvents2(ev,types,now);try{if(!S.busy||!AOK())return;
 for(const e of ev){if(e.k!=='die')continue;const v=V.get(e.zid);if(!v)continue;const big=e.boss||['fat','armor'].includes(v.k);if(!big)continue;
  const p=v.dying?{x:v.dx,y:v.dy}:zpos(v,now);
  if(e.boss){camZoom(now,p.x,p.y,.18,1800);continue}
  if(now<BIGK)continue;BIGK=now+5000;slowT=Math.max(slowT,now+650);camZoom(now,p.x,p.y,.11,1100)}}catch(x){}};

// ---------- 8 : maison touchée ----------
const _shelHit=shelHit;shelHit=function(){_shelHit();try{let h=document.querySelector('.hurtv');if(!h)h=aEl('hurtv');h.classList.remove('on');void h.offsetWidth;h.classList.add('on')}catch(e){}};
