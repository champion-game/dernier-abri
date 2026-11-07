// v240 : le camp prend vie (demande d'Amine). Affichage seulement, aucune règle ne change.
// 1 répliques : les survivants parlent dans une petite bulle (début de nuit, camarade tombé, carnage, maison attaquée, blessure, aube, et de temps en temps le jour) ;
// 2 le jour, le camp s'occupe : les unités respirent, le cuisinier fait de la vapeur, le mécanicien des étincelles, les tireurs nettoient leur arme, les soigneurs préparent leurs soins, les chiens dorment ; la cheminée fume ;
// 5 le monde bouge : lumière du soir à mesure que l'énergie est dépensée, corbeaux sur les corps à l'aube, feuilles au vent, maison marquée par les nuits.
// Pas de bulle pendant le tutoriel guidé. Rien ne bouge si le système demande moins d'animations ; le Mode économie allège tout.
const FX5={g:null,bub:[],last:0,nN:0,wasBusy:false,low:{},crows:[],sig:'',smoke:[],nextSmoke:0,leaves:[],nextDay:0,eMax:0,dusk:0};
const FX5_DOG=new Set(['dog','k9','dogs','k9squad']);
const FX5_MECH=new Set(['mech','welder','genmech','carp','nailer']);
const FX5_MED=new Set(['med','doc','pharma','amb','orderly','fieldnurse','v_medic','stretch','priest']);
const fx5Pick=a=>a[Math.floor(Math.random()*a.length)];
const FX5L={
 night:[_t('Les voilà…'),_t('Tout le monde à son poste !'),_t('Je les entends.'),_t('Pas un ne passe.'),_t('Encore une nuit…')],
 dawn:[_t('On a tenu.'),_t('Le soleil… enfin.'),_t('Encore vivants.'),_t('Quelle nuit…')],
 day:[_t('J’ai faim.'),_t('Quelqu’un a du café ?'),_t('Tu crois que l’hélico viendra ?'),_t('Je monte la garde.'),_t('Trop calme…'),_t('Il faut renforcer les murs.'),_t('Je dors plus la nuit.')],
 cheer:[_t('Au suivant !'),_t('Bien envoyé !'),_t('Carnage !'),_t('Ils tombent comme des mouches !')],
 boss:[_t('On l’a eu !'),_t('Il est tombé !')],
 breach:[_t('Ils sont à la porte !'),_t('La maison !'),_t('Ils cognent à la porte !')],
 low:[_t('Je saigne…'),_t('Un soin, vite !'),_t('Je vais pas tenir…')],
 saved:[_t('Pas encore !'),_t('Même pas mal.')],
 shelter:[_t('La maison ne tiendra pas longtemps.'),_t('Il faut réparer le toit.')],
 dog:[_t('Wouf !'),_t('Grrr…'),_t('Wouf wouf !')],
 trait:{fragile:[_t('J’ai peur…')],increvable:[_t('Ils m’auront pas.')],costaud:[_t('Qu’ils viennent !')],precis:[_t('Un tir, un mort.')],
  myope:[_t('Quelqu’un a vu mes lunettes ?')],coriace:[_t('J’en ai vu d’autres.')],aguerri:[_t('Reste concentré.')]}
};
const fx5Lost=n=>fx5Pick([_t`Non ! ${n} !`,_t`Pour ${n} !`,_t`Adieu, ${n}…`]);
const fx5Ko=n=>fx5Pick([_t`${n}, tiens bon !`,_t`Couvrez ${n} !`]);

function fx5On(){if(!G||TTL)return false;try{if(typeof tutoDay==='function'&&tutoDay())return false}catch(e){}return true}
function fx5Named(f){const r=[];if(!G)return r;G.grid.forEach((u,j)=>{if(u&&u.name&&Z.isUnit(u.t)&&(!f||f(u,j)))r.push(j)});return r}
// réplique selon le moment ; le trait colore parfois la phrase (seulement le jour et en début de nuit)
function fx5Line(u,k){if(FX5_DOG.has(u.t))return fx5Pick(FX5L.dog);const tr=FX5L.trait[u.trait];if(tr&&(k==='night'||k==='day')&&Math.random()<.4)return fx5Pick(tr);return fx5Pick(FX5L[k])}
// une bulle à la fois par unité, 2 à l'écran au plus, un petit silence entre deux, 5 par nuit au plus (sauf un camarade tombé)
function fx5Say(i,txt,o){o=o||{};if(!txt||!G||!fx5On())return false;const u=G.grid[i];if(!u||!u.name)return false;const now=performance.now();
 if(FX5.bub.some(b=>b.i===i))return false;
 if(!o.force&&(now-FX5.last<2600||FX5.bub.length>=2||(S.busy&&FX5.nN>=5)))return false;
 if(FX5.bub.length>=3)FX5.bub.shift();
 const p=tc(i);FX5.bub.push({i,txt,x:p.x,y:p.y,t0:now,dur:o.dur||2700});FX5.last=now;if(S.busy)FX5.nN++;return true}

// lecture des événements de la nuit
{const p0=playEvents;playEvents=function(ev,types,now){const r=p0.apply(this,arguments);try{fx5Events(ev)}catch(e){}return r}}
function fx5Events(ev){if(!fx5On())return;
 for(const e of ev){
  if((e.k==='lost'||e.k==='ko')&&e.name&&e.i!=null){const hs=fx5Named((u,j)=>!FX5_DOG.has(u.t)&&j!==e.i&&Z.manh(j,e.i)<=3);
   if(hs.length){const n=String(e.name).replace(/^(Le |La |L’)/,'');fx5Say(fx5Pick(hs),e.k==='lost'?fx5Lost(n):fx5Ko(n),{force:1,dur:3200})}}
  else if(e.k==='saved'&&e.i!=null&&G.grid[e.i])fx5Say(e.i,fx5Pick(FX5L.saved),{force:1});
  else if(e.k==='breach'&&Math.random()<.5){const hs=fx5Named((u,j)=>Z.manh(j,Z.C)<=2);if(hs.length)fx5Say(fx5Pick(hs),fx5Pick(FX5L.breach))}}
 if(ev.some(e=>e.k==='die'&&e.boss)){const hs=fx5Named();if(hs.length)fx5Say(fx5Pick(hs),fx5Pick(FX5L.boss),{force:1})}
 else{const m={};for(const e of ev)if(e.k==='hit'&&e.src>=0&&ev.some(d=>d.k==='die'&&d.zid===e.zid))(m[e.src]=m[e.src]||new Set()).add(e.zid);
  for(const s in m)if(m[s].size>=4&&G.grid[s]&&G.grid[s].name){fx5Say(+s,fx5Line(G.grid[s],'cheer'));break}}
 // blessure grave : une fois par unité et par nuit
 G.grid.forEach((u,j)=>{if(u&&u.name&&Z.isUnit(u.t)&&!FX5.low[j]&&u.hp>0&&u.hp/Math.max(1,Z.maxHp(G,u))<.35){FX5.low[j]=1;if(Math.random()<.6)fx5Say(j,FX5_DOG.has(u.t)?_t('Kaï !'):fx5Pick(FX5L.low))}})}

// passage jour / nuit, répliques du jour, corbeaux
{const f0=frameInner;frameInner=function(now){const r=f0.apply(this,arguments);try{fx5Tick(now)}catch(e){}return r}}
function fx5Tick(now){
 if(FX5.g!==G){FX5.g=G;FX5.bub.length=0;FX5.crows.length=0;FX5.low={};FX5.eMax=0;FX5.nextDay=now+9000;FX5.wasBusy=!!S.busy}
 if(!G)return;const busy=!!S.busy;
 if(busy&&!FX5.wasBusy){FX5.nN=0;FX5.low={};FX5.eMax=0;FX5.crows.forEach(c=>fx5Shoo(c,now));
  const hs=fx5Named();if(hs.length){const j=fx5Pick(hs);setTimeout(()=>{try{if(S.busy&&G.grid[j])fx5Say(j,fx5Line(G.grid[j],'night'))}catch(e){}},900)}}
 if(!busy&&FX5.wasBusy&&!S.pause){FX5.nextDay=now+22000;
  const hs=fx5Named();if(hs.length){const j=fx5Pick(hs);setTimeout(()=>{try{if(!S.busy&&G.grid[j])fx5Say(j,fx5Line(G.grid[j],'dawn'),{force:1})}catch(e){}},2600)}
  fx5Crows(now)}
 FX5.wasBusy=busy;
 if(!busy){const e=G.energy??0;if(e>FX5.eMax)FX5.eMax=e}
 if(!busy&&ov.hidden&&now>FX5.nextDay){FX5.nextDay=now+18000+Math.random()*16000;const hs=fx5Named();
  if(hs.length&&fx5On()){const j=fx5Pick(hs),low=G.shelter/Math.max(1,Z.maxS(G))<.5;fx5Say(j,low&&Math.random()<.5&&!FX5_DOG.has(G.grid[j].t)?fx5Pick(FX5L.shelter):fx5Line(G.grid[j],'day'))}}
 // les corbeaux s'envolent dès qu'on pose ou déplace une carte, ou quand la nuit tombe
 if(FX5.crows.length){const sig=G.grid.map(u=>u?u.t:'').join();if(sig!==FX5.sig){if(FX5.sig)FX5.crows.forEach(c=>fx5Shoo(c,now+Math.random()*250));FX5.sig=sig}
  if(nightAmt>.3)FX5.crows.forEach(c=>fx5Shoo(c,now))}else FX5.sig=''}

// 5 : corbeaux qui se posent sur les corps à l'aube, picorent, sautillent, puis repartent
function fx5Edge(){const r=[];for(let j=0;j<Z.N*Z.N;j++){const[a,b]=Z.rc(j);if((a===0||b===0||a===Z.N-1||b===Z.N-1)&&!G.grid[j])r.push(j)}const p=tc(r.length?fx5Pick(r):0);return{x:p.x+(Math.random()-.5)*30,y:p.y+(Math.random()-.5)*30}}
function fx5Crows(now){if(reduce||!fx5On())return;const n=OPT.eco?1:2+Math.floor(Math.random()*2),sp=(FX3&&FX3.corp||[]).slice(-14);
 for(let k=0;k<n;k++){let p;if(sp.length&&Math.random()<.8){const c=fx5Pick(sp);p={x:c.x+(Math.random()-.5)*16,y:c.y+(Math.random()-.5)*16}}else p=fx5Edge();
  p.x=Math.max(8,Math.min(L-8,p.x));p.y=Math.max(8,Math.min(L-8,p.y));const a=Math.random()*6.28;
  FX5.crows.push({x:p.x,y:p.y,fx:p.x+Math.cos(a)*L*.8,fy:p.y+Math.sin(a)*L*.8,t0:now+2200+k*600+Math.random()*900,dir:Math.random()*6.28,nh:0,hop:-1e9,ph:Math.random()*7,stay:16000+Math.random()*16000,leave:0})}
 if(FX5.crows.length>6)FX5.crows.splice(0,FX5.crows.length-6)}
function fx5Shoo(c,t){if(c.leave)return;c.leave=t;const a=Math.atan2(c.y-CEN.y,c.x-CEN.x)+(Math.random()-.5);c.ox=c.x+Math.cos(a)*L*.9;c.oy=c.y+Math.sin(a)*L*.9}
function fx5Crow(c,now){const t=now-c.t0;if(t<0)return;let x=c.x,y=c.y,fly=0,ang=c.dir;
 if(!c.leave&&t>c.stay)fx5Shoo(c,now);
 if(c.leave&&now>=c.leave){const q=(now-c.leave)/1200;if(q>=1){c.dead=1;return}const e=q*q;x=c.x+(c.ox-c.x)*e;y=c.y+(c.oy-c.y)*e;fly=Math.min(1,q*4);ang=Math.atan2(c.oy-c.y,c.ox-c.x)}
 else if(t<1300){const q=t/1300,e=1-(1-q)*(1-q);x=c.fx+(c.x-c.fx)*e;y=c.fy+(c.y-c.fy)*e;fly=1-Math.max(0,(q-.8)/.2);ang=Math.atan2(c.y-c.fy,c.x-c.fx)}
 else if(now>c.nh){c.nh=now+1300+Math.random()*2800;if(Math.random()<.5){c.dir+=(Math.random()-.5)*2.4;c.hop=now;c.x=Math.max(8,Math.min(L-8,c.x+Math.cos(c.dir)*5));c.y=Math.max(8,Math.min(L-8,c.y+Math.sin(c.dir)*5))}}
 const hp=now-c.hop<220?Math.sin((now-c.hop)/220*Math.PI)*3:0,h=fly*16+hp;
 ctx.save();ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x+h*.5,y+h*.7+2,6,3.5,0,0,7);ctx.fill();
 ctx.translate(x,y-h);ctx.rotate(ang);ctx.scale(1.6,1.6);ctx.fillStyle='#16161b';
 if(fly>.05){const w=Math.sin(now/55+c.ph);for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(2.5,0);ctx.lineTo(-1,s*(9+4*w));ctx.lineTo(-5,s*(7+3*w));ctx.lineTo(-4,0);ctx.closePath();ctx.fill()}}
 ctx.beginPath();ctx.moveTo(-5,0);ctx.lineTo(-10,-2.6);ctx.lineTo(-10,2.6);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.ellipse(-.5,0,6,3.6,0,0,7);ctx.fill();
 const pk=fly<.05?Math.max(0,Math.sin(now/170+c.ph))**6*2.2:0;ctx.beginPath();ctx.arc(5+pk,0,2.6,0,7);ctx.fill();
 ctx.fillStyle='#8f8470';ctx.beginPath();ctx.moveTo(7+pk,-1);ctx.lineTo(10.5+pk,0);ctx.lineTo(7+pk,1);ctx.closePath();ctx.fill();
 ctx.fillStyle='#d9d2b8';ctx.beginPath();ctx.arc(5.6+pk,-1.1,.55,0,7);ctx.arc(5.6+pk,1.1,.55,0,7);ctx.fill();ctx.restore()}

// 2 : petites occupations du jour, chacune quelques secondes, à tour de rôle
function fx5Chores(now){if(reduce||S.busy||nightAmt>.4||!fx5On())return;const k0=1-nightAmt/.4;
 G.grid.forEach((u,i)=>{if(!u||!u.name||!Z.isUnit(u.t))return;const per=9000+(i*373)%4000,t=(now+i*1777)%per;if(t>3600)return;
  const p=tc(i),a=facing[i]??Math.atan2(p.y-CEN.y,p.x-CEN.x),q=t/3600;ctx.save();ctx.globalAlpha=k0*Math.min(1,Math.sin(q*Math.PI)*3);
  if(FX5_DOG.has(u.t)){// le chien somnole : des « z » qui montent
   ctx.fillStyle='#f4efe2';ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=2;ctx.textAlign='center';
   for(let n=0;n<3;n++){const s=(q*3+n/3)%1,x=p.x+10+s*8,y=p.y-10-s*20;ctx.font=`bold ${7+s*5}px "Atkinson Hyperlegible",system-ui,sans-serif`;ctx.globalAlpha=k0*(1-s)*.9;ctx.strokeText('z',x,y);ctx.fillText('z',x,y)}}
  else if(u.t==='cook'){// marmite qui fume
   ctx.strokeStyle='rgba(235,235,230,.7)';ctx.lineWidth=2;ctx.lineCap='round';for(let n=0;n<3;n++){const s=(q*2+n/3)%1,x=p.x-6+n*6;ctx.globalAlpha=k0*(1-s)*.7;ctx.beginPath();ctx.moveTo(x,p.y-12-s*16);ctx.quadraticCurveTo(x+4*Math.sin(now/200+n),p.y-18-s*16,x,p.y-24-s*16);ctx.stroke()}}
  else if(FX5_MECH.has(u.t)||FX3_BLADE.has(u.t)){// on bricole ou on aiguise sa lame : quelques étincelles
   if(Math.random()<(OPT.eco?.04:.1)){const x=p.x+Math.cos(a)*13,y=p.y+Math.sin(a)*13;for(let n=0;n<3;n++){const b=Math.random()*6.28,s=.05+Math.random()*.08;PT.push({x,y,vx:Math.cos(b)*s,vy:Math.sin(b)*s-.03,t0:now,dur:220+Math.random()*160,c:Math.random()<.5?'#ffd25a':'#fff2b0',r:1.4,light:0})}}}
  else if(FX5_MED.has(u.t)){// on prépare les soins : une petite croix verte qui monte
   const y=p.y-12-q*18;ctx.font='bold 11px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillText('✚',p.x+11,y+1);ctx.fillStyle='#7ee08a';ctx.fillText('✚',p.x+10,y)}
  else if(FX3_GUN.has(u.t)||FX3_BOW.has(u.t)){// on nettoie son arme : un reflet passe sur le canon
   const s=Math.sin(((now/900)%1)*Math.PI);if(s>.05){const x=p.x+Math.cos(a)*16,y=p.y+Math.sin(a)*16,r=1.5+4*s;ctx.fillStyle='#fffbe8';ctx.globalAlpha*=s;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r*.25,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.25,y);ctx.closePath();ctx.moveTo(x-r,y);ctx.lineTo(x,y-r*.25);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r*.25);ctx.closePath();ctx.fill()}}
  else{// une tasse chaude : un mince filet de vapeur
   ctx.strokeStyle='rgba(235,235,230,.6)';ctx.lineWidth=1.5;ctx.lineCap='round';const s=q,x=p.x+12;ctx.beginPath();ctx.moveTo(x,p.y-8-s*10);ctx.quadraticCurveTo(x+3*Math.sin(now/250),p.y-13-s*10,x,p.y-18-s*10);ctx.stroke()}
  ctx.restore()})}
// les unités respirent doucement le jour
{const u0=unitAnim;unitAnim=function(i,u,now,sc){try{if(!reduce&&!S.busy&&Z.isUnit(u.t)){const k=1+.02*Math.sin(now/850+i*1.3);ctx.scale(k,1+.02*Math.sin(now/850+i*1.3+.6))}}catch(e){}return u0.apply(this,arguments)}}

// 2 : fumée de la cheminée (plus noire quand l'abri est abîmé)
function fx5Smoke(now){if(reduce)return;const fort=OPT.shelter==='fort'&&typeof FORT!=='undefined'&&FORT.complete&&FORT.naturalWidth,sx=CEN.x+(fort?8:16.5),sy=CEN.y-(fort?T*.38:19);
 if(now>FX5.nextSmoke){FX5.nextSmoke=now+(OPT.eco?900:420);FX5.smoke.push({t0:now,dx:(Math.random()-.5)*4});if(FX5.smoke.length>14)FX5.smoke.shift()}
 const low=G.shelter/Math.max(1,Z.maxS(G))<.5,c=low?'45,38,34':'150,145,138',w=Math.sin(now/3000)*6+12;ctx.save();
 for(let n=FX5.smoke.length-1;n>=0;n--){const s=FX5.smoke[n],q=(now-s.t0)/3400;if(q>=1){FX5.smoke.splice(n,1);continue}
  ctx.fillStyle=`rgba(${c},${((1-q)*(low?.55:.42)*(1-nightAmt*.5)).toFixed(3)})`;ctx.beginPath();ctx.arc(sx+s.dx+q*w,sy-q*38,3+q*9,0,7);ctx.fill()}
 ctx.restore()}

// 5 : la maison garde les traces des nuits : planches clouées, puis griffures
{const d0=drawShelter;drawShelter=function(now){const r=d0.apply(this,arguments);try{fx5Marks()}catch(e){}return r}}
function fx5Marks(){const nt=G.night||0,pl=Math.min(3,Math.floor((nt-1)/4)),cl=Math.min(4,Math.floor((nt-1)/3));if(pl<=0&&cl<=0)return;ctx.save();ctx.translate(CEN.x,CEN.y);
 [[-14,-14,.35],[10,12,-.25],[-16,14,.15]].slice(0,Math.max(0,pl)).forEach(([x,y,r])=>{ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(-12,-2,25,6);ctx.fillStyle='#9a7a4e';ctx.fillRect(-13,-3,25,6);ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(-13,1.6,25,1.4);ctx.fillStyle='#d6d6d6';ctx.fillRect(-11,-1,1.6,1.6);ctx.fillRect(8.5,-1,1.6,1.6);ctx.restore()});
 ctx.strokeStyle='rgba(30,16,10,.75)';ctx.lineWidth=1.2;ctx.lineCap='round';
 [[-26,-6,.9],[24,-12,2.3],[-6,24,-.4],[20,20,1.6]].slice(0,Math.max(0,cl)).forEach(([x,y,r])=>{ctx.save();ctx.translate(x,y);ctx.rotate(r);for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(k*3,-6);ctx.lineTo(k*3+1.5,6);ctx.stroke()}ctx.restore()});
 ctx.restore()}

// 5 : feuilles (ou flocons, ou poussière) poussées par le vent pendant le jour
function fx5Leaves(now){if(reduce||OPT.eco||S.busy||nightAmt>.5){FX5.leaves.length=0;return}
 const pal=BIOME==='neige'?['#ffffff','#e8eef5']:BIOME==='desert'?['#c9a86a','#b08d55']:BIOME==='bitume'?['#8a8478','#6e6a62']:BIOME==='automne'?['#c46a24','#a8451c','#d8a33a']:['#7a8a3a','#a5822f','#5f7a34'];
 while(FX5.leaves.length<7)FX5.leaves.push({x:-10-Math.random()*L*.6,y:Math.random()*L,v:.6+Math.random()*.6,r:Math.random()*6,vr:(Math.random()-.5)*.08,ph:Math.random()*7,c:fx5Pick(pal)});
 ctx.save();for(const f of FX5.leaves){f.x+=f.v*.9;f.y+=Math.sin(now/700+f.ph)*.35+.12;f.r+=f.vr;if(f.x>L+12||f.y>L+12){f.x=-10-Math.random()*60;f.y=Math.random()*L*.9;f.c=fx5Pick(pal)}
  ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.r);ctx.globalAlpha=.8*(1-nightAmt*2);ctx.fillStyle=f.c;ctx.beginPath();if(BIOME==='neige')ctx.arc(0,0,1.8,0,7);else ctx.ellipse(0,0,3.6,1.7,0,0,7);ctx.fill();ctx.restore()}
 ctx.restore()}

// 5 : lumière du soir : plus on dépense son énergie, plus la lumière tourne à l'orange (la nuit approche)
function fx5Dusk(){let k=0;if(!S.busy&&FX5.eMax>=2)k=Math.max(0,Math.min(1,1-(G.energy??0)/FX5.eMax));FX5.dusk+=(k-FX5.dusk)*.03;const d=FX5.dusk*(1-nightAmt);if(d<.01)return;
 ctx.save();const g=ctx.createRadialGradient(CEN.x,CEN.y,L*.15,CEN.x,CEN.y,L*.75);g.addColorStop(0,`rgba(255,160,70,${(.07*d).toFixed(3)})`);g.addColorStop(1,`rgba(110,40,30,${(.36*d).toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(0,0,L,L);ctx.restore()}

// sous l'obscurité : occupations, fumée, corbeaux, feuilles, lumière du soir
{const d0=drawFX;drawFX=function(now){const r=d0.apply(this,arguments);if(G&&!TTL){const sf=f=>{ctx.save();try{f()}catch(e){}ctx.restore()};
  sf(()=>fx5Chores(now));sf(()=>fx5Smoke(now));sf(()=>{for(let n=FX5.crows.length-1;n>=0;n--){const c=FX5.crows[n];fx5Crow(c,now);if(c.dead)FX5.crows.splice(n,1)}});sf(()=>fx5Leaves(now));sf(()=>fx5Dusk())}
 return r}}

// 1 : les bulles, au-dessus de tout (même de l'obscurité)
function fx5Wrap(s,mw){const w=s.replace(/ ([?!:;…])/g,'\u00a0$1').split(' '),out=[];let l='';for(const x of w){const t=l?l+' '+x:x;if(l&&ctx.measureText(t).width>mw){out.push(l);l=x}else l=t}if(l)out.push(l);return out}
function fx5Bubbles(now){if(!FX5.bub.length)return;const z=Math.max(.3,SC/(DPR||1)),fs=Math.min(20,Math.max(10,11.5/z)),lw=Math.max(1,1.2/z);
 ctx.save();ctx.font=`bold ${fs.toFixed(1)}px "Atkinson Hyperlegible",system-ui,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
 for(let n=FX5.bub.length-1;n>=0;n--){const b=FX5.bub[n],t=now-b.t0;if(t>=b.dur||t<0){if(t>=b.dur)FX5.bub.splice(n,1);continue}
  const ls=fx5Wrap(b.txt,fs*10),lh=fs*1.2,w=Math.max(...ls.map(s=>ctx.measureText(s).width))+fs*1.1,h=ls.length*lh+fs*.55;
  const up=b.y-26-h-fs*.5>0,ay=up?b.y-24:b.y+26,by=up?ay-fs*.5-h:ay+fs*.5,bx=Math.max(3,Math.min(L-w-3,b.x-w/2));
  const pop=reduce?1:t<180?.55+.45*Math.sin(t/180*Math.PI/2)*1.08:1;ctx.save();ctx.globalAlpha=t>b.dur-300?Math.max(0,(b.dur-t)/300):1;
  ctx.translate(b.x,ay);ctx.scale(pop,pop);ctx.translate(-b.x,-ay);
  const r=Math.min(fs*.5,h/2),tx=Math.max(bx+r+3,Math.min(bx+w-r-3,b.x)),ty=up?by+h:by;
  ctx.beginPath();ctx.moveTo(bx+r,by);ctx.lineTo(bx+w-r,by);ctx.quadraticCurveTo(bx+w,by,bx+w,by+r);ctx.lineTo(bx+w,by+h-r);ctx.quadraticCurveTo(bx+w,by+h,bx+w-r,by+h);ctx.lineTo(bx+r,by+h);ctx.quadraticCurveTo(bx,by+h,bx,by+h-r);ctx.lineTo(bx,by+r);ctx.quadraticCurveTo(bx,by,bx+r,by);ctx.closePath();
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.save();ctx.translate(lw*1.5,lw*1.5);ctx.fill();ctx.restore();ctx.fillStyle='#f6efdc';ctx.fill();ctx.strokeStyle='#2b1a0c';ctx.lineWidth=lw;ctx.stroke();
  ctx.beginPath();ctx.moveTo(tx-fs*.35,ty);ctx.lineTo(b.x,ay);ctx.lineTo(tx+fs*.35,ty);ctx.fill();ctx.stroke();ctx.fillRect(tx-fs*.35+lw,up?ty-lw*1.5:ty-lw*.5,fs*.7-lw*2,lw*2);
  ctx.fillStyle='#2b1a0c';ls.forEach((s,k)=>ctx.fillText(s,bx+w/2,by+fs*.28+lh*(k+.5)));ctx.restore()}
 ctx.restore()}
{const d0=drawFloats;drawFloats=function(now){const r=d0.apply(this,arguments);try{if(G&&!TTL)fx5Bubbles(now)}catch(e){}return r}}
