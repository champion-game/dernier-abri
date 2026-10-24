/* Dernier Abri : interface du jour et de la nuit (fiche, main, plateau, déroulé de la nuit).
   Les fichiers src/game*.js partagent leurs variables (scripts classiques chargés dans l’ordre par index.html). */
/* ---------- combat events → visuals ---------- */
function playEvents(ev,types,now){
 const shots=new Set(),dead=ev.filter(e=>e.k==='die');
 // victimes : compteur ; v166 : multi-éliminations par attaque (une même source tue plusieurs zombies dans le tour), ralenti à la mort du Colosse
 if(dead.length){KC.n+=dead.length;KC.t=now;
  try{const by={},src={};for(const e of ev){if(e.k==='hit'&&e.zid!=null)src[e.zid]=e.src>=0?e.src:'r';else if(e.k==='shot'&&e.zid!=null)src[e.zid]='r'}
   dead.forEach(e=>{const k=src[e.zid];if(k==null)return;(by[k]=by[k]||[]).push(e)});
   for(const k in by){const g=by[k],n=g.length;if(n<2)continue;const ps=g.map(e=>{const v=V.get(e.zid);return v?zpos(v,now):tc(e.i)}),cx=ps.reduce((a,p)=>a+p.x,0)/n,cy=ps.reduce((a,p)=>a+p.y,0)/n;
    if(n===2)floatTxt(cx,cy-14,_t('Doublé !'),'#ffd25a',15);
    else if(n===3){floatTxt(cx,cy-14,_t('Triplé !'),'#ff9a2e',18);shake(now,4)}
    else if(n<6){floatTxt(cx,cy-14,_t`Carnage ×${n} !`,'#ff7a2e',21);shake(now,6);addFX({type:'ring',x:cx,y:cy,r:60,c:'#ff9a2e',dur:420})}
    else{floatTxt(cx,cy-14,_t`MASSACRE ×${n} !`,'#e5484d',24);shake(now,9);addFX({type:'ring',x:cx,y:cy,r:90,c:'#e5484d',dur:600});slowT=Math.max(slowT,now+700);camZoom(now,cx,cy,.08,1000)}
    if(n>=3){const kk=typeof k==='string'?-1:+k;if(kk>=0)addFX({type:'ring',x:tc(kk).x,y:tc(kk).y,r:30,c:'#ffd25a',dur:350})}
    NB.multi=Math.max(NB.multi||0,n)}}catch(x){}
  try{SFX.play('zdie',.22)}catch(x){}
  dead.forEach(e=>{const v=V.get(e.zid),p=v?zpos(v,now):tc(e.i);burst(p.x,p.y,'#d8d0b8',5,.07,1.6);burst(p.x,p.y,'rgba(140,20,24,.9)',9,.1,2.4);addFX({type:'ring',x:p.x,y:p.y,r:26,c:'rgba(229,72,77,.8)',dur:260});
   // gros zombies : éclair et secousse à leur mort
   if(v&&['fat','armor','howl','sap'].includes(v.k)&&!e.boss){shake(now,4);addFX({type:'flash',x:p.x,y:p.y,r:22,c:'rgba(255,120,80,.6)',dur:180})}
   if(e.boss){vib(220);slowT=now+1800;shake(now,14);addFX({type:'ring',x:p.x,y:p.y,r:120,c:'#f2b33d',dur:900});addFX({type:'flash',x:p.x,y:p.y,r:50,c:'rgba(255,200,90,.9)',dur:700,light:T*3});burst(p.x,p.y,'rgba(140,20,24,.9)',30,.15,3);floatTxt(CEN.x,CEN.y-50,(v&&v.k==='mere')?_t('LA MÈRE EST TOMBÉE'):(v&&v.k==='zero')?_t('LE PATIENT ZÉRO EST TOMBÉ'):_t('LE COLOSSE EST TOMBÉ'),'#f2b33d',20);SFX.play('boom');if(v)ach(v.k==='mere'?'mere':v.k==='zero'?'zero':'colosse')}})
  if(dead.length>=5)ach('carnage')}
 const SND={v_hmg:'mg',v_sniper:'snp',v_rdog:'bark',v_apc:'melee',sap:'boom',rocket:'cannon',doc:'shot',nailer:'mg',ranger:'snp',chief_comm:'shot',chief_tech:'mg',amb:'melee',orderly:'melee',chief_care:'melee',nightsnp:'snp',heavyflame:'flame',fortin:'shot',autogun:'mg',slaughter:'melee',gang:'shot',saint:'melee',tracker:'bow',k9squad:'bark',swat:'snp',vigile:'shot',hunter:'bow',sentry:'mg',turret:'mg',mortar:'cannon',tesla:'hit',bunker:'shot',riot:'melee',k9:'bark',dogs:'bark',pitch:'melee',gun:'shot',kid:'shot',snp:'snp',sht:'sht',mg:'mg',xbow:'bow',flame:'flame',axe:'melee',dog:'bark',cop:'melee',butch:'melee',monk:'melee'};
 for(const e of ev){
  try{if(e.k==='bite'||e.k==='spit'){if(e.i!=null)ouchT[e.i]=now;const zv=V.get(e.zid);if(zv&&e.k==='bite')zv.atk=now}}catch(x){}
  try{if(e.k==='hit'){const sd=SND[types[e.src]]||'hit';SFX.play(sd,sd==='bark'?.7:undefined)}else if(e.k==='bite'||e.k==='spit')SFX.play(e.i===Z.C?'shelter':'bite');
   else if(e.k==='boom')SFX.play('boom');else if(e.k==='lost')SFX.play(e.name?'death':'lost',.3);else if(e.k==='ko')SFX.play('lost',.3);else if(e.k==='molo')SFX.play('flame');else if(e.k==='howl')SFX.play('groan',.2)}catch(x){}
  if(e.k==='hit'){const v=V.get(e.zid);const tp=v?(v.dying?{x:v.dx,y:v.dy}:zpos(v,now)):tc(e.i);if(v)v.flash=now;
   {const dm=parseInt(e.txt.replace('−',''))||0;floatTxt(tp.x,tp.y,e.txt,dm>=10?'#ff9a2e':dm>=4?'#ffd25a':'#ffffff',dm>=10?23:dm>=4?17:13);if(dm>=10)shake(now,3)}burst(tp.x,tp.y,'rgba(140,20,24,.9)',4,.06,2);splat(tp.x,tp.y,false);
   const t=types[e.src],sp=tc(e.src);
   if(t){facing[e.src]=Math.atan2(tp.y-sp.y,tp.x-sp.x);atkT[e.src]=now;if((Z.U[t]||{}).cat==='trap'){burst(sp.x,sp.y,'#e8e0c8',7,.08,1.6);addFX({type:'flash',x:sp.x,y:sp.y,r:9,c:'rgba(255,240,200,.8)',dur:110})}}
   const key=e.src+':'+e.zid;
   if(['gun','snp','mg','kid','swat','vigile','sentry','turret','bunker','chief_police','chief_mil','hunter','nightsnp','autogun','gang','fortin','doc','nailer','ranger','chief_comm','chief_tech'].includes(t)){const big=t==='snp'||t==='nightsnp',a=facing[e.src],mx=sp.x+Math.cos(a)*(big?26:18),my=sp.y+Math.sin(a)*(big?26:18);
    addFX({type:'tracer',x1:mx,y1:my,x2:tp.x,y2:tp.y,c:big?'#fff4c8':'#ffd27a',w:big?1.6:1.2,dur:big?260:160});
    addFX({type:'flash',x:mx,y:my,r:big?7:5,c:'#ffe08a',dur:90,light:T*.9})}
   else if(t==='sht'){if(!shots.has(e.src)){shots.add(e.src);const a=facing[e.src],mx=sp.x+Math.cos(a)*15,my=sp.y+Math.sin(a)*15;addFX({type:'flash',x:mx,y:my,r:8,c:'#ffd27a',dur:110,light:T})}
    addFX({type:'tracer',x1:sp.x,y1:sp.y,x2:tp.x+(Math.random()-.5)*10,y2:tp.y+(Math.random()-.5)*10,c:'#ffcf70',w:1,dur:140})}
   else if(t==='rocket'){addFX({type:'tracer',x1:sp.x,y1:sp.y,x2:tp.x,y2:tp.y,c:'#ffb35c',w:3,dur:240});addFX({type:'flash',x:tp.x,y:tp.y,r:20,c:'rgba(255,160,60,.85)',dur:300,light:T*1.4});burst(tp.x,tp.y,'#ff9a2e',10,.12,2.5)}
   else if(t==='xbow'||t==='tracker'){addFX({type:'tracer',x1:sp.x,y1:sp.y,x2:tp.x,y2:tp.y,c:'#d8c49a',w:1.8,dur:200})}
   else if(t==='flame'||t==='heavyflame'){for(let k=0;k<6;k++)PT.push({x:sp.x+(tp.x-sp.x)*k/6,y:sp.y+(tp.y-sp.y)*k/6,vx:(Math.random()-.5)*.02,vy:-.02,t0:now,dur:260,c:k%2?'#ff9a2e':'#ffd25a',r:3+k*.6,light:k===5?24:0})}
   else if(t==='tesla'){addFX({type:'tracer',x1:sp.x,y1:sp.y,x2:tp.x,y2:tp.y,c:'#9fe8ff',w:2,dur:160});addFX({type:'flash',x:tp.x,y:tp.y,r:6,c:'#bff3ff',dur:120,light:T*.7})}
   else if(['cop','butch','monk','riot','pitch','k9','dogs','chief_farm','slaughter','saint','k9squad','amb','orderly','chief_care'].includes(t))addFX({type:'swing',x:sp.x,y:sp.y,a:facing[e.src],dur:200});
   else if(t==='spike'||t==='wire')burst(tp.x,tp.y,'#a07a4a',4,.05,2);
   else if(t==='axe')addFX({type:'swing',x:sp.x,y:sp.y,a:facing[e.src],dur:220});
   else if(t==='dog')addFX({type:'flash',x:tp.x,y:tp.y,r:6,c:'rgba(255,255,255,.7)',dur:90});
   else if(t==='fen'){addFX({type:'tracer',x1:sp.x,y1:sp.y,x2:tp.x,y2:tp.y,c:'#9fe8ff',w:2,dur:120});addFX({type:'flash',x:tp.x,y:tp.y,r:7,c:'#bff3ff',dur:120,light:T*.8})}
   else if(t==='trap')addFX({type:'ring',x:sp.x,y:sp.y,r:22,c:'#d9dde0',dur:250});
   else if(t==='fire')burst(tp.x,tp.y,'#ff9a2e',3,.04,3);
  }
  if(e.k==='boom'){const p=tc(e.i);addFX({type:'flash',x:p.x,y:p.y,r:46,c:'rgba(255,160,60,.9)',dur:380,light:T*2.2});addFX({type:'ring',x:p.x,y:p.y,r:70,c:'#ffb35c',dur:420});burst(p.x,p.y,'#ff9a2e',22,.2,3);burst(p.x,p.y,'#3a3a3a',14,.12,4);shake(now,8);crater(p.x,p.y,20)}
  if(e.k==='bite'){const v=V.get(e.zid),p=tc(e.i);
   if(e.i===Z.C){shake(now,8);hurtT=now;shelHit();vib(45);if(v){if((Z.ZT[v.k]||{}).boss){v.lunge=now;v.lx=p.x;v.ly=p.y}else v.bit=1}floatTxt(p.x,p.y-8,e.txt,'#ff6b6b');burst(p.x,p.y,'rgba(140,20,24,.9)',8,.08,2)}
   else{if(v){v.lunge=now;v.lx=p.x;v.ly=p.y}UHIT[e.i]=now;floatTxt(p.x,p.y,e.txt,'#ff6b6b',15);const wc={wood:'#a07a4a',stake:'#8a6238',stone:'#a8a498',metal:'#a9b3b8',steel:'#7d868d',sand:'#c9ab73',tire:'#333',rust:'#9a4a2c',stripe:'#e8e0d0',electric:'#9fe8ff'}[WMAT[types[e.i]]||(Z.U[types[e.i]]&&Z.U[types[e.i]].block?'stone':'wood')];burst(p.x,p.y,wc,Z.U[types[e.i]]&&Z.U[types[e.i]].block?10:5,.09,2.4)}}
  if(e.k==='ko'||e.k==='lost')vib(e.name?[70,50,70]:30);
  if(e.k==='ko'){const p=tc(e.i);burst(p.x,p.y,'rgba(140,20,24,.9)',8,.08,2);floatTxt(p.x,p.y-12,_t('Blessé : en réserve'),'#ffb35c',13)}
  if(e.k==='lost'){const p=tc(e.i);try{shardsFx(p.x,p.y,types[e.i])}catch(x){}burst(p.x,p.y,'#8a6a45',16,.12,3);burst(p.x,p.y,'rgba(140,20,24,.9)',6,.08,2);splat(p.x,p.y,true)
   // v166 : un mur qui cède : éclats de son matériau, secousse, et (au plus une fois toutes les 12 s) ralenti et zoom sur la brèche
   if((Z.U[types[e.i]]||{}).cat==='wall'){const wc={wood:'#a07a4a',stake:'#8a6238',stone:'#a8a498',metal:'#a9b3b8',steel:'#7d868d',sand:'#c9ab73',tire:'#333',rust:'#9a4a2c',stripe:'#e8e0d0',electric:'#9fe8ff'}[WMAT[types[e.i]]||'wood'];
    burst(p.x,p.y,wc,26,.22,3.5);burst(p.x,p.y,'#3a3a3a',10,.1,4);addFX({type:'flash',x:p.x,y:p.y,r:34,c:'rgba(255,220,170,.7)',dur:260});addFX({type:'ring',x:p.x,y:p.y,r:56,c:wc,dur:420});shake(now,10);vib([40,30,60]);try{SFX.play('boom',.5)}catch(x){}
    if(now>wallSlowT){wallSlowT=now+12000;slowT=Math.max(slowT,now+1200);camZoom(now,p.x,p.y,.16,1500);floatTxt(p.x,p.y-20,_t('LE MUR CÈDE !'),'#e5484d',18)}}}
  if(e.k==='spit'){const v=V.get(e.zid),p=tc(e.i),f=v?zpos(v,now):tc(e.from);addFX({type:'tracer',x1:f.x,y1:f.y,x2:p.x,y2:p.y,c:'#c6e83a',w:3,dur:220});burst(p.x,p.y,'#b7d83a',6,.06,2);floatTxt(p.x,p.y,e.txt,'#c6e83a');if(e.i===Z.C){shake(now,5);hurtT=now;shelHit()}}
  if(e.k==='smoke'){const p=tc(e.i);for(let k=0;k<26;k++)PT.push({x:p.x+(Math.random()-.5)*90,y:p.y+(Math.random()-.5)*90,vx:(Math.random()-.5)*.01,vy:-.008,t0:now,dur:1800,c:'rgba(190,200,190,.35)',r:8+Math.random()*8,light:0})}
  if(e.k==='eat'){const p=tc(e.i);floatTxt(p.x,p.y,_t('miam'),'#ff9a9a');burst(p.x,p.y,'rgba(140,20,24,.9)',4,.04,2)}
  if(e.k==='molo'){const p=tc(e.i),sp=tc(e.src);addFX({type:'tracer',x1:sp.x,y1:sp.y,x2:p.x,y2:p.y,c:'#3c7a3a',w:2,dur:200});addFX({type:'flash',x:p.x,y:p.y,r:30,c:'rgba(255,140,40,.8)',dur:320,light:T*1.6});burst(p.x,p.y,'#ff9a2e',16,.12,3)}
  if(e.k==='howl'){const p=tc(e.i);addFX({type:'ring',x:p.x,y:p.y,r:60,c:'#e0a0c0',dur:500});floatTxt(p.x,p.y-10,_t('HOOO !'),'#e0a0c0')}
  if(e.k==='block'){const p=tc(e.i);floatTxt(p.x,p.y-6,_t('Bloqué'),'#7cc7ff');addFX({type:'ring',x:p.x,y:p.y,r:26,c:'#7cc7ff',dur:220});try{SFX.play('hit')}catch(x){}}
  if(e.k==='saved'){const p=tc(e.i);floatTxt(p.x,p.y-10,_t('Increvable !'),'#f2b33d');addFX({type:'ring',x:p.x,y:p.y,r:40,c:'#f2b33d',dur:400})}
  if(e.k==='air'){shake(now,10);const c=tc(e.i);addFX({type:'ring',x:c.x,y:c.y,r:T*2.5,c:'#ffb35c',dur:500});for(let k=0;k<6;k++){const x=c.x+(Math.random()-.5)*T*4,y=c.y+(Math.random()-.5)*T*4;addFX({type:'flash',x,y,r:30,c:'rgba(255,170,60,.8)',dur:400,light:T*1.5})}SFX.play('boom')}
  if(e.k==='breach'){shake(now,6);floatTxt(CEN.x,CEN.y-46,_t('BRÈCHE ! La horde accélère'),'#e5484d',15)}
  if(e.k==='shot'){const v=V.get(e.zid),tp=v?zpos(v,now):CEN;addFX({type:'tracer',x1:CEN.x,y1:CEN.y-10,x2:tp.x,y2:tp.y,c:'#fff4c8',w:2,dur:260});addFX({type:'flash',x:CEN.x,y:CEN.y-10,r:8,c:'#ffe08a',dur:120,light:T})}
  if(e.k==='heal'){const p=tc(e.i);for(let k=0;k<3;k++)PT.push({x:p.x+(Math.random()-.5)*20,y:p.y,vx:0,vy:-.03,t0:now,dur:500,c:'#7ee08a',r:2.5,light:0})}
 }
}

/* ---------- UI ---------- */
// jeu de société : la fiche de nuit (événement, jetons de zombies, frénésie, tampon) et la piste des nuits
function ficheHtml(){const w=Z.waveList(G),fz=Z.frenzy(G),dm=Z.dmgBonus(G.night),boss=Z.bigNight(G,w);
 const fin=G.night===Z.WIN_NIGHT&&!G.won;const stamp=S.busy?'':fin?_t('<i class="stamp boss">Boss final</i>'):boss?`<i class="stamp boss">${ZN[Z.leadBoss(G.night)||'boss'][0]}</i>`:Z.pressure(G.night)?_t('<i class="stamp red">Nuit rouge</i>'):Z.respite(G.night,G)?_t('<i class="stamp calm">Répit</i>'):'';
 const toks=S.busy?'':Z.ZK.filter(k=>w[k]).map(k=>`<span class="ztk" title="${plural(w[k],...ZN[k])}"><span class="ztk-i" style="background-image:url('assets/sprites_cartoon/z_${k}.webp')"></span><b>${w[k]}</b></span>`).join('');
 const fzt=fz&&!S.busy?_t`<span class="ztk fz" title="Frénésie meurtrière : +${fz} % de PV"><span class="ztk-i">${ii('drop','zw')}</span><b>+${fz}%</b></span>`:'';
 return `<div class="fiche-top"><b title="${G.event.n}">${G.night===Z.WIN_NIGHT&&!G.won?_t('Dernière nuit : les secours arrivent à l’aube.'):G.event.p||G.event.n}</b>${G.side>=0?_t`<span class="poem">Fusée : ils viendront ${[_t('du nord'),_t('du sud'),_t('de l’ouest'),_t('de l’est')][G.side]}</span>`:''}</div>${toks||fzt?`<div class="ztoks">${toks}${fzt}</div>`:''}${stamp}`}
function trackHtml(){const a=Math.floor((G.night-1)/10)*10+1,mut=G.muts&&G.muts[0],soon=Z.mutNight(G.night),cells=[];
 for(let n=a;n<a+10;n++){const cls=(n%10===0?' boss':n%5===0?' red':Z.respite(n,G)?' calm':'')+(n<G.night?' past':'')+(n===G.night?' now':'');
  cells.push(_t`<span class="tc${cls}" title="Nuit ${n}${n%10===0?' : '+bossName(n):n%5===0?_t(' : nuit rouge'):Z.respite(n,G)?_t(' : nuit de répit'):''}">${n%10===0?ii('skull'):n}${n===G.night?'<i class="meeple"></i>':''}</span>`)}
 return `<span class="track">${cells.join('')}</span>`}
// jetons mutation et ferraille : au bout de la rangée des jetons d'unités et de factions
function tagsHtml(){const mut=G.muts&&G.muts[0],soon=Z.mutNight(G.night);return _t`<span class="tags">${mut?_t`<span class="tok mut${soon?' soon':''}" data-tok="mut" title="Mutation instable : ${Z.MUTS[mut].n}">${svg('mut')}</span>`:''}<span class="tok coin" title="Ferraille">${G.scrap}</span></span>`}
const cardName=t=>Z.stat(G,t).n;
const roleTag=t=>{const r=Z.roleOf(t);return r?`<span class="role" title="${Z.ROLES[r].n}">${ink(r)}</span>`:''};
const roleLine=t=>{const r=Z.roleOf(t);return r?` <em class="ce">${ink(r)} ${Z.ROLES[r].n}</em>`:''};
const famTag=t=>{const f=Z.famOf(t);return f&&seen('fam1')?`<span class="ft">${ink(f)}</span>`:''};
const famLine=t=>{const f=Z.famOf(t);return f&&seen('fam1')?` <em class="ce">${ink(f)} ${Z.FAM[f].n}</em>`:''};
const rar=t=>Z.RAR[t]||'com';
const rarTag=t=>rar(t)==='com'?'':`<span class="rt ${rar(t)}">${Z.RARITY[rar(t)].n}</span>`;
const WIDE=matchMedia('(min-width:760px)');
const left0=()=>Math.max(0,G.energy??0);
// v161 : l’abri touché fait trembler sa barre de vie et rougir le bord de l’écran
function shelHit(){try{const el=document.querySelector('.shel');if(el&&!reduce){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit')}
 let hv=document.getElementById('hurtV');if(!hv){hv=document.createElement('div');hv.id='hurtV';document.body.appendChild(hv)}
 hv.classList.add('on');clearTimeout(shelHit.t);shelHit.t=setTimeout(()=>hv.classList.remove('on'),90)}catch(e){}}
function render(){
 try{meterSync()}catch(e){}
 $('#round').innerHTML=(G.oneNight?_t('Défi'):S.busy?_t`Nuit ${G.night}`:_t`Jour ${G.night}`)+(G.menace?`<small class="mtag">M${G.menace}</small>`:'');
 $('#shelT').textContent=`${Math.max(0,G.shelter)}/${Z.maxS(G)}`;
 const sb=$('#shelB');sb.style.width=Math.max(0,G.shelter)/Z.maxS(G)*100+'%';sb.className=G.shelter<=3?'low':'';
 $('#event').innerHTML=ficheHtml();
 const mN=G.muts.length,soon=Z.mutNight(G.night);
 $('#horde').innerHTML=trackHtml();
 const left=G.energy??Z.ENERGY;
 const hand=$('#hand'),nH=S.hand.length+new Set(S.used||[]).size;hand.style.setProperty('--n',Math.max(4,Math.min(WIDE.matches?9:5,nH)));
 // en largeur sur grand écran : autant de colonnes que la largeur du panneau le permet (cartes de 100 à 118 px)
 if(LANDTALL.matches&&innerHeight>=640){const cols=Math.max(3,Math.min(Math.max(nH,4),Math.floor((hand.clientWidth+6)/106)));hand.style.gridTemplateColumns=`repeat(${cols},minmax(0,118px))`}else hand.style.gridTemplateColumns='';
 const gst=guideStep()||{},gcard=gst.card,glock=t=>!!guideStep()&&gst.lock!==t;hand.innerHTML=S.hand.map((t,k)=>`<button type="button" class="card${S.sel===k?' sel':''}${gcard===t&&S.hand.indexOf(t)===k?' guide':''}" data-k="${k}" ${(S.busy?!Z.U[t].react:Z.U[t].react)||!Z.canPay(G,t)||glock(t)?'disabled':''}>${cardFace(t,{mini:1,v:Z.U[t].react&&!S.busy?_t('Nuit'):''})}</button>`).join('')
  +[...new Set(S.used||[])].map(t=>{const k=S.used.indexOf(t),n=S.used.filter(x=>x===t).length,on=S.sel!==null&&S.sel<0&&S.used[-1-S.sel]===t;
   const tr=Z.isTrace(t),ch=tr?Z.charges(G,t,true):0;
   return `<button type="button" class="card reuse${on?' sel':''}${gcard===t?' guide':''}" data-u="${k}" ${S.busy||Z.buildCost(G,t,true)>(G.energy??0)||(tr&&!ch)||glock(t)?'disabled':''}>${cardFace(t,{mini:1,cost:Z.buildCost(G,t,true),tag:tr?_t`Encore ${ch} case${ch>1?'s':''}`:_t('Encore')+(n>1?' ×'+n:'')})}</button>`}).join('')
  ;try{if(typeof handFx==='function')handFx(hand)}catch(e){}try{pilesHtml();animPiles()}catch(e){}
 const fc=Z.famCounts(G),fl=Z.famLevels(G);const nU=Z.unitCount(G),cap=Z.unitCap(G);$('#fams').innerHTML=_t`<span class="fam cap${nU>=cap?' full':''}" title="Unités sur le terrain (murs et pièges illimités)">${ink('cap')} ${nU}/${cap}</span>`+Object.keys(Z.FAM).filter(f=>fc[f]&&seen('fam1')).map(f=>`<span class="fam l${fl[f]}" title="${Z.FAM[f].n}">${ink(f)} ${fc[f]}${fl[f]?' '+'★'.repeat(fl[f]):'/'+Z.FAM[f].lv[0]}</span>`).join('')+tagsHtml();
 const info=$('#info');info.className='info';
 if(S.busy&&S.sel!==null&&S.sel>=0){const t=S.hand[S.sel];info.innerHTML=`<b>${cardName(t)}</b> : ${Z.U[t].d}. `+(Z.U[t].react==='unit'?_t('Touche une unité blessée.'):_t('Touche une case de la carte.'))}
 else if(S.pause&&S.moveFrom!==null&&G.grid[S.moveFrom])info.innerHTML=unitLine(G.grid[S.moveFrom])+_t(' Touche une case libre en bleu pour le déplacer.');
 else if(S.pause)info.innerHTML=_t`<b>Pause : vague ${S.pause} sur ${G.waves} repoussée.</b> ${capF(bossName(G.night))} arrivera par la route en rouge. Déplace tes cartes librement : touche-en une, puis une case libre. `+`${G.oneNight?_t('Énergie illimitée pour tes réactions.'):_t`<span class="nrg">${'<i class="on"></i>'.repeat(Math.min(10,Math.max(0,left0())))}</span> ${left0()} énergie pour tes réactions.`}`;
 else if(S.busy){const left=G.z.length+G.pending.length,hasR=S.hand.some(t=>Z.U[t].react);info.innerHTML=_t`<b>${plural(left,_t('zombie'),_t('zombies'))}</b> encore dehors.`+(hasR?` ${G.oneNight?_t('Énergie illimitée pour tes réactions.'):_t`<span class="nrg">${'<i class="on"></i>'.repeat(Math.min(10,Math.max(0,left0())))}</span> ${left0()} énergie pour tes réactions.`}`:'')}
 else if(S.bsel!=null&&G.bench[S.bsel]){const u=G.bench[S.bsel];info.innerHTML=unitLine(u)+(u.koUntil?_t` <b>Blessé :</b> se repose, de retour au jour ${u.koUntil+1}.`:Z.capFull(G,u.t)?_t` <b>Limite de ${Z.unitCap(G)} unités atteinte</b> : rappelle ou fusionne une unité.`:_t(' En réserve : touche une case en vert pour la reposer gratuitement.'))}
 else if(S.sel!==null&&!S.busy){const t=selCard(),D=Z.U[t];info.innerHTML=(Z.isUnit(t)&&Z.capFull(G,t)?_t`<b>Limite de ${Z.unitCap(G)} unités atteinte.</b> Fusionne, ou rappelle une unité dans la réserve. `:'')+_t`<b>${cardName(t)}</b> (${selCost()} énergie${selReuse()?_t(', réutilisée'):''}) : ${D.d}.`+(Z.isTrace(t)?_t` Carte à tracer : ${Z.charges(G,t,selReuse())} case${Z.charges(G,t,selReuse())>1?'s':''} à poser aujourd’hui${selReuse()?'':_t(' pour le prix de la carte')}, une par une ou d’un glissé.`:'')+(D.onUnit?_t(' Touche une unité blessée.'):D.instant?_t(' Touche l’abri.'):D.near?_t(' Touche une case collée à l’abri.'):Z.LINE.includes(t)?_t(' Touche une case, ou glisse pour tracer une ligne.'):_t(' Touche un emplacement.'))}
 else if(S.moveFrom!==null&&G.grid[S.moveFrom])info.innerHTML=unitLine(G.grid[S.moveFrom])+_t(' Touche une case libre en bleu pour la déplacer.')+(Z.canRecall(G,S.moveFrom)?' <button type="button" class="recall" data-a="recall">'+ii('back')+_t(' Rappeler</button>'):'');
 else if(S.inspect!==null&&G.grid[S.inspect])info.innerHTML=unitLine(G.grid[S.inspect])+(Z.canRecall(G,S.inspect)?' <button type="button" class="recall" data-a="recall">'+ii('back')+_t(' Rappeler</button>'):'');
 else if(G.oneNight)info.innerHTML=_t`<b>Défi du jour</b> : énergie illimitée. Pose tes cartes, puis affronte la horde. Touche une carte posée pour la déplacer.`;
 else info.innerHTML=_t`<span class="nrg">${'<i class="on"></i>'.repeat(Math.min(10,Math.max(0,left)))}${'<i></i>'.repeat(Math.max(0,Z.ENERGY-left))}</span> <b>${left}</b> énergie. Touche une carte posée pour la déplacer ou la rappeler.`;
 if(TEST&&!S.busy)info.insertAdjacentHTML('beforeend',_t` <button type="button" class="recall" data-a="tcards">+ Carte (test)</button>`);
 if(canUndo())info.insertAdjacentHTML('beforeend',_t` <button type="button" class="recall undo" data-a="undo" title="Annuler la dernière action du jour">${ii('undo')} Annuler</button>`);
 // bouton de tir : un seul élément, mis à jour sans être recréé (sinon le toucher peut se perdre pendant la nuit)
 updatePreview();checkHints();
 const tip=$('#tip'),gs=guideStep(),tt=tutoTip();if(tt&&ov.hidden){tip.hidden=false;const sk=gs?_t('Passer le tutoriel'):'';if(tip.dataset.t!==tt+sk){tip.dataset.t=tt+sk;tip.textContent=tt;if(sk)tip.insertAdjacentHTML('beforeend',` <button type="button" class="tskip" data-a="tskip">${sk}</button>`)}}else if(TUTO<4&&ov.hidden&&(S.busy?TUTO===3:TUTO<3)&&!tutoDay()){tip.hidden=false;tip.dataset.t='';tip.textContent=TIPS[TUTO]}else tip.hidden=true;
 $('#go').classList.toggle('guide',!!(gs&&gs.go&&ov.hidden));
 $('#info').hidden=!!(gs&&ov.hidden);
 const go=$('#go');go.disabled=!!S.dawnWait;go.textContent=S.pause?_t`Lancer la vague ${S.pause+1} sur ${G.waves}`:S.busy?_t`Vitesse ×${SPEED} (toucher pour changer)`:_t('Affronter la nuit');go.classList.toggle('speed',S.busy&&!S.pause);
}
$('#hand').addEventListener('click',e=>{const b=e.target.closest('.card');if(!b||b.disabled)return;SFX.play('ui');LASTRECT=b.getBoundingClientRect();
 if(b.dataset.b!==undefined){const k=+b.dataset.b;S.bsel=S.bsel===k?null:k;S.sel=null;S.moveFrom=null;S.inspect=null;render();return}S.bsel=null;
 if(b.dataset.u!==undefined){const k=-1-(+b.dataset.u);S.sel=S.sel===k?null:k;S.moveFrom=null;S.inspect=null;render();return}const k=+b.dataset.k;
 if(S.busy&&Z.U[S.hand[k]].react==='any'){playReact(k,Z.C);return}S.sel=S.sel===k?null:k;S.moveFrom=null;S.inspect=null;if(S.sel!==null)tuto(0);render()});
// rappeler une unité dans la réserve (le jour) : elle garde tout et se repose gratuitement
$('#info').addEventListener('click',e=>{if(e.target.closest('[data-a=undo]')){doUndo();return}if(e.target.closest('[data-a=tcards]')){ACT.tcards();return}const b=e.target.closest('[data-a=recall]');if(!b||S.busy)return;const i=S.moveFrom??S.inspect;if(i==null)return;snapUndo();if(!Z.recall(G,i)){UNDO.pop();return}
 const p=tc(i),u=G.bench[G.bench.length-1];facing[i]=null;addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#9ee08a',dur:350});floatTxt(p.x,p.y-14,_t`${u.name||cardName(u.t)} en réserve`,'#9ee08a');SFX.play('back');
 S.moveFrom=null;S.inspect=null;syncBoard();save();render()});
// munition anti-Colosse : 30 dégâts, ignore l'armure
let fireBtn=null;
function FIRE(){if(!fireBtn){fireBtn=document.createElement('button');fireBtn.type='button';fireBtn.className='ammo';fireBtn.id='fire';fireBtn.hidden=true;$('#info').after(fireBtn);fireBtn.addEventListener('click',fireAmmo)}return fireBtn}
function fireAmmo(){const ev=Z.fireAmmo(G);if(!ev)return;const now=performance.now();syncZ(now);playEvents(ev,G.grid.map(u=>u&&u.t),now);SFX.play('snp');SFX.play('boom');shake(now,9);
 const z=ev.find(e=>e.k==='shot'),v=z&&V.get(z.zid),p=v?zpos(v,now):CEN;floatTxt(p.x,p.y-30,`−${Z.AMMO_DMG}`,'#ffd25a',22);render()}
// glisser-déposer : on attrape une carte de la main et on la lâche sur une case de la carte
let HD=null;
// survol d'une carte de la main sur ordinateur : aperçu en grand (sans redessiner la main, sinon le clic se perd)
// en largeur avec assez de hauteur : la carte choisie s'affiche en grand dans le panneau de droite
const LANDTALL=matchMedia('(orientation:landscape) and (min-aspect-ratio:5/4) and (min-width:560px)');
function updatePreview(){const land=LANDTALL.matches;if(!WIDE.matches&&!land)return;let pv=$('#preview');if(!pv){pv=document.createElement('div');pv.id='preview';document.body.appendChild(pv)}
 const t=S.hover||selCard()||(land&&S.bsel!=null&&G.bench[S.bsel]?G.bench[S.bsel].t:null)||(land&&(S.inspect??S.moveFrom)!=null&&G.grid[S.inspect??S.moveFrom]?G.grid[S.inspect??S.moveFrom].t:null);pv.hidden=!t||!ov.hidden;pv.classList.toggle('land',land);
 if(land){const place=above=>{const a=$(above).getBoundingClientRect(),b=$('#info').getBoundingClientRect(),sd=$('.side2').getBoundingClientRect(),hh=b.top-a.bottom-(innerHeight<520?10:24),w=Math.max(0,Math.min(sd.width*.55,hh*1086/1448));
   pv.style.width=w+'px';pv.style.left=(sd.left+sd.width/2-w/2)+'px';pv.style.top=(a.bottom+(innerHeight<520?5:12)+(hh-w*1448/1086)/2)+'px';return w};
  // pas assez de place (téléphone tourné) : la carte choisie prend la place des lignes nuit / horde / factions
  document.body.classList.remove('pvon');if(t&&ov.hidden&&place('#fams')<110){document.body.classList.add('pvon');if(place('.top')<60)pv.hidden=true}}
 else{document.body.classList.remove('pvon');pv.style.width=pv.style.left=pv.style.top=''}
 const gu=land&&S.bsel!=null&&G.bench[S.bsel]&&G.bench[S.bsel].t===t?G.bench[S.bsel]:land&&(S.inspect??S.moveFrom)!=null&&G.grid[S.inspect??S.moveFrom]&&G.grid[S.inspect??S.moveFrom].t===t?G.grid[S.inspect??S.moveFrom]:null,gd=gu&&gu.gold||0;
 const key=t+(S.busy?1:0)+(G.upg[t]?'u':'')+gd;if(t&&pv.dataset.t!==key){pv.dataset.t=key;pv.innerHTML=cardFace(t,{gold:gd})}}
$('#hand').addEventListener('pointerover',e=>{const b=e.target.closest('.card');if(!b||e.pointerType!=='mouse')return;S.hover=b.dataset.b!==undefined?(G.bench[+b.dataset.b]||{}).t:b.dataset.u!==undefined?S.used[+b.dataset.u]:S.hand[+b.dataset.k];updatePreview()});
$('#hand').addEventListener('pointerleave',()=>{if(S.hover){S.hover=null;updatePreview()}});
$('#hand').addEventListener('pointerdown',e=>{const b=e.target.closest('.card');if(b)LASTRECT=b.getBoundingClientRect();if(!b||b.disabled||S.busy||b.dataset.b!==undefined)return;HD={b,x:e.clientX,y:e.clientY,on:false,g:null}});
addEventListener('pointermove',e=>{if(!HD)return;if(!HD.on&&Math.hypot(e.clientX-HD.x,e.clientY-HD.y)>12){HD.on=true;HD.g=HD.b.cloneNode(true);HD.g.classList.add('ghost');document.body.appendChild(HD.g);document.documentElement.classList.add('dragging');
  const k=HD.b.dataset.u!==undefined?-1-(+HD.b.dataset.u):+HD.b.dataset.k;S.sel=k;S.moveFrom=null;S.inspect=null;render()}
 if(HD.on){HD.g.style.left=e.clientX+'px';HD.g.style.top=e.clientY+'px'}});
addEventListener('pointerup',e=>{document.documentElement.classList.remove('dragging');if(!HD)return;const d=HD;HD=null;if(!d.on)return;d.g.remove();const r=cv.getBoundingClientRect();
 if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){LASTRECT={left:e.clientX-36,top:e.clientY-48,width:72,height:96};tapCell(cellAt(e))}else render()});
addEventListener('pointercancel',()=>{document.documentElement.classList.remove('dragging');if(HD&&HD.g)HD.g.remove();HD=null});
$('#round').addEventListener('click',()=>{if(!S.busy&&ov.hidden)runInfo()});
$('#event').addEventListener('click',()=>{if(S.busy||!ov.hidden)return;const w=Z.waveList(G),fz=Z.frenzy(G),dm=Z.dmgBonus(G.night);SFX.play('ui');
 show(_t`<h2 class="pw">Nuit ${G.night}</h2>${G.event.p?`<p class="poem">${G.event.p}</p>`:''}<p><b>${G.event.n}</b> : ${G.event.d}.</p>${Z.pressure(G.night)?_t`<p>${ii('drop')} <b>Nuit rouge</b> : 15 % de zombies en plus, puis une mutation instable et une relique à l’aube.</p>`:''}${Z.respite(G.night,G)?_t`<p>${ii('moon')} <b>Nuit de répit</b> : 30 % de zombies en moins.</p>`:''}${Z.bigNight(G,w)?_t`<p>${ii('skull')} <b>Nuit de boss : ${bossName(G.night)}</b>. La horde arrive en 2 vagues, le boss dans la seconde. ${Z.ZT[Z.leadBoss(G.night)||'boss'].info.replace(/^[^:]*: /,'')}.</p>`:''}${fz?_t`<p>${ii('drop')} <b>Frénésie meurtrière</b>  : +${fz} % de PV pour tous les zombies (+10 % de plus chaque nuit).</p>`:''}
  <div class="deck">${Z.ZK.filter(k=>w[k]).map(k=>`<div class="dk" style="--cc:var(--z-${k})"><span class="ztk-i big" style="background-image:url('assets/sprites_cartoon/z_${k}.webp')"></span><span><b>${plural(w[k],...ZN[k])}</b>${Z.ZT[k].info}</span></div>`).join('')}</div><button type="button" class="go" data-a="closeov">Fermer</button>`)});
$('#fams').addEventListener('click',e=>{const t=e.target.closest('[data-tok=mut]');if(!t||!ov.hidden)return;const m=Z.MUTS[G.muts[0]];SFX.play('ui');
 show(_t`<h2 class="pw">Mutation instable</h2><p><b>${m.n}</b> : ${m.d}.</p><p>Instable, elle ne dure que jusqu’à la prochaine (toutes les 5 nuits).</p><button type="button" class="go" data-a="closeov">Fermer</button>`)});
const cellAt=e=>{const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*L,y=(e.clientY-r.top)/r.height*L;return clamp(Math.floor(y/T),0,Z.N-1)*Z.N+clamp(Math.floor(x/T),0,Z.N-1)};
cv.addEventListener('click',e=>{if(S.skipClick){S.skipClick=false;return}tapCell(cellAt(e))});
// murs en ligne : appuyer sur la 1ʳᵉ case, glisser jusqu'à 4 cases, relâcher
const lineCard=()=>!S.busy&&Z.LINE.includes(selCard())?selCard():null;
cv.addEventListener('pointerdown',e=>{const t=lineCard(),i=cellAt(e);if(!t||selCost()>(G.energy??0)||!Z.canPlace(G,t,i))return;S.drag={a:i,cells:[i]};try{cv.setPointerCapture(e.pointerId)}catch(x){}});
cv.addEventListener('pointermove',e=>{if(!S.drag)return;const t=lineCard();if(!t){S.drag=null;return}const c=Z.lineCells(G,t,S.drag.a,cellAt(e),selReuse());if(c.length!==S.drag.cells.length){S.drag.cells=c;SFX.play('ui')}});
cv.addEventListener('pointerup',e=>{if(!S.drag)return;const cells=S.drag.cells;S.drag=null;if(cells.length>1){S.skipClick=true;placeLineUI(cells)}});
cv.addEventListener('pointercancel',()=>{S.drag=null});
// curseur de la souris sur le plateau : clic possible, pose interdite, glisser
function curAt(i){if(!G||S.dawnWait)return'';if(S.drag)return'g';
 if(S.busy){if(S.sel!==null&&S.sel>=0&&Z.U[S.hand[S.sel]].react)return'c';if(!(S.pause&&S.sel===null))return''}
 if(S.bsel!=null)return'c';if(S.sel===null)return S.moveFrom!==null||G.grid[i]?'c':'';
 const t=selCard();return t&&selCost()<=(G.energy??0)&&Z.canPlace(G,t,i)?'c':'i'}
cv.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;let k='';try{k=curAt(cellAt(e))}catch(x){}if(cv.dataset.cu!==k)cv.dataset.cu=k});
// une carte de construction posée pour la 1ʳᵉ fois passe de la main aux cartes « Encore » et reste choisie
function useBuild(t){if(S.sel>=0){S.hand.splice(S.sel,1);S.used.push(t);S.sel=-S.used.length}}
// carte à tracer dont toutes les cases sont posées : elle quitte la main (défausse)
function spentTrace(t){if(!Z.isTrace(t)||Z.charges(G,t,true)>0)return;const n=S.used.filter(x=>x===t).length;S.used=S.used.filter(x=>x!==t);for(let k=0;k<n;k++)S.discard.push(t);S.sel=null}
// statistiques : nombre de fois où chaque carte est jouée (toutes parties confondues)
function countPlay(t){if(G.daily)return;const c=META.played||(META.played={});c[t]=(c[t]||0)+1;saveMeta(META)}
function placeLineUI(cells){const t=selCard(),re=selReuse(),gd=guideStep();if(gd&&!cells.every(i=>guideOk(gd,i)))return;if(Z.lineCost(G,t,cells.length,re)>G.energy)return;if(!re)countPlay(t);tuto(1);useBuild(t);Z.placeLine(G,t,cells,R,re);spentTrace(t);syncBoard();S.moveFrom=null;S.inspect=null;
 cells.forEach(j=>{facing[j]=null;const p=tc(j);addFX({type:'ring',x:p.x,y:p.y,r:30,c:'#f2b33d',dur:350})});const q=tc(cells[cells.length-1]);floatTxt(q.x,q.y-14,_t`${cells.length} cases`+(Z.charges(G,t,true)>0?_t` · encore ${Z.charges(G,t,true)}`:''),'#f2b33d');SFX.play('place');save();render()}
// fiche d'une unité : prénom, métier, trait, victimes, PV
function unitLine(u){const tr=Z.TRAITS[u.trait],D=Z.U[u.t],lv=(u.lvA||0)+(u.lvD||0),k=u.kills||0,i=G.grid.indexOf(u),ro=Z.roleOf(u.t);
 const rl=ro?` · ${ink(ro)} <b>${Z.ROLES[ro].n}</b>`+(ro==='tank'?_t` (provoque à ${Z.TAUNT} cases, bloque 1 coup sur 3)`:'')+(Z.squad(G,i)?_t(' · <b>escouade</b> (+1)'):''):'';
 return (u.name?`<b>${u.name}</b>, ${cardName(u.t)}`:`<b>${cardName(u.t)}</b>`)+rl+(u.gold?_t` <b class="gold">${stars(u)} doré</b>`:'')+(D.evo?_t(' <b class="evo">✦ évolution</b>'):'')
  +(tr?` · <b>${tr.n}</b> (${tr.d})`:'')+(D.dmg?` · ${plural(k,_t('zombie tué'),_t('zombies tués'))}`+(seen('lvl')?_t`, niveau suivant à ${Z.lvKills(Z.lvOf(k)+1)}`:''):'')
  +(lv?_t` · niveau ${lv} (+${u.lvA||0} dégât, +${(u.lvD||0)*3} PV)`:'')+(u.leg?_t` · porte le souvenir de <b>${u.leg}</b> (+1 dégât, +2 PV)`:'')
  +(g=>g.length>1?_t` · <b>rempart de ${g.length} murs</b> : ${g.reduce((a,k)=>a+G.grid[k].hp,0)}/${g.reduce((a,k)=>a+Z.maxHp(G,G.grid[k]),0)} PV en commun`:'')(Z.wallGroup(G,G.grid.indexOf(u)))+(u.scar?_t(' · <b>cicatrice</b> : la prochaine chute sera fatale'):'')+(Z.eqOf(u).length?_t` · équipé : ${Z.eqOf(u).map(t=>ii(EQIC[t]||'pack')+' '+Z.U[t].n).join(', ')}`:'')+_t` · ${u.hp}/${Z.maxHp(G,u)} PV.`}
/* conseils au bon moment : une bulle, une seule fois par joueur, la première fois qu'une situation se présente */
const HINTS={
 fuse:ii('star')+_t(' <b>Fusion !</b> 3 unités identiques deviennent une nouvelle carte avec une étoile de plus : plus de PV, +1 dégât, 2 places libérées, et les 3 cartes repartent dans ta défausse.'),
 evo:_t('✦ <b>Évolution !</b> Certaines paires de cartes posées côte à côte deviennent une nouvelle carte unique, et les deux cartes repartent dans ta défausse. Il en existe d’autres à découvrir : retrouve-les dans la Collection, page Évolutions secrètes.'),
 fam1:ii('medal')+_t(' <b>Bonus de faction.</b> 2 survivants de la même faction débloquent son 1ᵉʳ bonus. À 5 survivants : 2ᵉ bonus et équipe complète (+1 dégât, +2 PV). Le pictogramme de faction s’affiche désormais en bas des cartes et en haut de l’écran.'),
 fam2:ii('medal')+_t(' <b>Équipe complète !</b> 5 survivants de la même faction : 2ᵉ bonus, +1 dégât et +2 PV pour toute la faction.'),
 squad:ink('tank')+ink('heal')+ink('dps')+_t(' <b>Escouade !</b> Un Tank, un Soin et un DPS voisins gagnent chacun +1 dégât (ou +1 soin).'),
 cap:ink('cap')+_t(' <b>Limite d’unités atteinte.</b> Fusionne des unités identiques, ou rappelle-en une dans la réserve (touche-la, puis « Rappeler »). Murs, pièges et postes ne comptent pas.'),
 post:ii('post')+_t(' <b>Poste de soutien.</b> Les postes (projecteur, hôpital, atelier…) aident sans combattre et ne comptent pas dans la limite d’unités. Les réparateurs les réparent.'),
 equip:ii('pack')+_t(' <b>Équipement.</b> Il reste sur l’unité, même rappelée. Une unité porte un seul exemplaire de chaque équipement.'),
 ko:ii('band')+_t(' <b>Unité blessée.</b> Elle part en réserve avec ses étoiles et ses niveaux, et revient après 3 nuits de repos. Attention : sa prochaine chute sera fatale.'),
 red:ii('drop')+_t(' <b>Nuit rouge ce soir.</b> 15 % de zombies en plus. À l’aube : une nouvelle mutation instable et une relique pour toi.'),
 boss:ii('skull')+_t(' <b>Nuit de boss.</b> Toutes les 10 nuits, un boss mène la horde : le Colosse (nuit 10), la Mère (20), le Patient Zéro (30). La horde arrive en 2 vagues. Pendant la pause, sa route s’affiche en rouge : mets-y murs, Tank et pièges. Il fait 10 dégâts par coup et frappe l’abri sans mourir.'),
 pause:_t('⏸️ <b>Pause entre les vagues.</b> Le boss arrivera par la route en rouge. Déplace tes cartes sur son chemin, puis relance.'),
 mere:ii('skull')+_t(' <b>La Mère attaque ce soir.</b> Elle pond un rampant tous les 4 tours, et en libère 2 en mourant. Les rampants passent sous les murs : garde des tireurs près de l’abri.'),
 zero:ii('skull')+_t(' <b>Le Patient Zéro, boss final.</b> Plus fragile que le Colosse mais plus rapide : les zombies autour de lui accélèrent. Abats-le vite, les munitions anti-Colosse marchent aussi sur lui.'),
 respite:ii('moon')+_t(' <b>Nuit de répit.</b> 30 % de zombies en moins après le boss… mais la frénésie meurtrière, elle, ne s’arrête pas : chaque nuit, +10 % de PV.'),
 mut:svg('mut')+_t(' <b>Mutation instable.</b> La horde a un affixe pendant 5 nuits (voir l’icône en haut). Puis une autre mutation instable le remplace.')
};
const HQ=[];let hintEl=null,hintT=0;
function hint(k){if(!HINTS[k])return;META.hints=META.hints||{};if(META.hints[k])return;META.hints[k]=1;saveMeta(META);HQ.push(HINTS[k]);showHint()}
function showHint(){if(hintEl&&!hintEl.hidden)return;if(!ov.hidden){setTimeout(showHint,1000);return}const t=HQ.shift();if(!t)return;
 if(!hintEl){hintEl=document.createElement('div');hintEl.className='hint';hintEl.setAttribute('role','status');document.body.appendChild(hintEl);hintEl.addEventListener('click',()=>{hintEl.hidden=true;clearTimeout(hintT);setTimeout(showHint,250)})}
 hintEl.innerHTML=t+_t('<small>Touche pour fermer</small>');hintEl.hidden=false;SFX.play('ui');clearTimeout(hintT);hintT=setTimeout(()=>{hintEl.hidden=true;setTimeout(showHint,300)},8000)}
function checkHints(){try{if(!G||!S)return;const fl=Object.values(Z.famLevels(G));
 if(fl.some(l=>l>=1))hint('fam1');if(fl.some(l=>l>=2))hint('fam2');
 if(G.grid.some((u,i)=>u&&Z.squad(G,i)))hint('squad');if(Z.unitCount(G)>=Z.unitCap(G))hint('cap');
 if(G.grid.some(u=>u&&Z.U[u.t].cat==='post'))hint('post');if(G.grid.some(u=>u&&Z.eqOf(u).length))hint('equip');
 if((G.bench||[]).some(u=>u.koUntil))hint('ko');if(G.muts&&G.muts.length)hint('mut');if(S.pause)hint('pause');
 if(!S.busy&&ov.hidden){if(Z.bigNight(G)){hint('boss');const L=Z.leadBoss(G.night);if(L&&L!=='boss')hint(L)}else if(Z.pressure(G.night))hint('red');if(Z.respite(G.night,G))hint('respite')}}catch(e){}}
// fusion ou évolution juste après une pose ou un déplacement : effets, son, et découverte enregistrée dans la collection
function mergeFx(m){if(!m||typeof m!=='object')return;const p=tc(m.i),now=performance.now();MERGE={i:m.i,from:m.from||(m.j!=null?[m.j]:[]),t:now};
 const pull=(j,c)=>{const q=tc(j);facing[j]=null;addFX({type:'tracer',x1:q.x,y1:q.y,x2:p.x,y2:p.y,c,w:3,dur:450});burst(q.x,q.y,c,12,.09,2)};
 if(m.k==='fuse'){hint('fuse');ach('fuse');m.from.forEach(j=>pull(j,'#f2c23d'));addFX({type:'ring',x:p.x,y:p.y,r:64,c:'#f2c23d',dur:650});addFX({type:'flash',x:p.x,y:p.y,r:32,c:'rgba(255,210,90,.8)',dur:420,light:T*1.5});floatTxt(p.x,p.y-22,_t`Fusion ! ${cardName(m.t)} ${'★'.repeat(m.gold||1)}`,'#f2c23d',16);SFX.play('fuse')}
 if(m.k==='evo'){hint('evo');pull(m.j,'#c58cff');addFX({type:'ring',x:p.x,y:p.y,r:72,c:'#c58cff',dur:750});addFX({type:'flash',x:p.x,y:p.y,r:36,c:'rgba(200,150,255,.85)',dur:500,light:T*1.6});burst(p.x,p.y,'#e0c8ff',18,.12,2.5);floatTxt(p.x,p.y-22,_t`Évolution : ${Z.U[m.t].n} !`,'#d9b8ff',16);SFX.play('evo');
  META.evo=META.evo||[];if(!META.evo.includes(m.t)){META.evo.push(m.t);saveMeta(META);floatTxt(p.x,p.y+6,_t('Nouvelle découverte'),'#ffffff',13)}}
 shake(now,4);achCheck()}
// jouer une réaction pendant la nuit
function playReact(k,i){const t=S.hand[k];const types=G.grid.map(u=>u&&u.t);const ev=Z.react(G,t,i);if(!ev)return false;
 S.hand.splice(k,1);countPlay(t);if(!Z.U[t].once)S.discard.push(t);syncBoard();S.sel=null;const now=performance.now();syncZ(now);playEvents(ev,types,now);
 const p=tc(i);if(t==='shell'&&ev.some(e=>e.k==='die'&&e.boss))ach('ammo');if(t==='shell'){SFX.play('snp');SFX.play('boom');shake(now,9);const z=ev.find(e=>e.k==='shot'),v=z&&V.get(z.zid),q=v?zpos(v,now):CEN;floatTxt(q.x,q.y-30,_t('Munition !'),'#ffd25a',20)}if(t==='grenade'||t==='air')SFX.play('boom');else if(t==='shot')SFX.play('snp');else SFX.play('place');
 if(t==='horn'){addFX({type:'ring',x:CEN.x,y:CEN.y,r:200,c:'#f2b33d',dur:600});floatTxt(CEN.x,CEN.y-20,_t('Reculez !'),'#f2b33d')}
 if(t==='rush')floatTxt(CEN.x,CEN.y-20,_t('Adrénaline !'),'#ff7a59');
 if(t==='patch')floatTxt(p.x,p.y,_t('+5 PV'),'#9fd86b');
 render();return true}
// v128 : annuler les actions du jour (pose, déplacement, rappel), jusqu'à 10 en arrière. Vidé à la tombée de la nuit.
let UNDO=[];
function snapUndo(t){try{UNDO.push({g:JSON.stringify({...G,event:G.event.id}),s:JSON.stringify({draw:S.draw,discard:S.discard,hand:S.hand,used:S.used}),rs:RS,night:G.night,t:t||null});if(UNDO.length>10)UNDO.shift()}catch(e){UNDO=[]}}
const canUndo=()=>!S.busy&&!S.pause&&UNDO.length>0&&UNDO[UNDO.length-1].night===G.night;
function doUndo(){if(!canUndo())return;const u=UNDO.pop();try{const g=JSON.parse(u.g),s2=JSON.parse(u.s);
  for(const k of Object.keys(G))if(!(k in g))delete G[k];Object.assign(G,g,{event:Z.EVENTS.find(e=>e.id===g.event)||G.event});Z.touch(G);
  RS=u.rs;Object.assign(S,s2,{sel:null,moveFrom:null,inspect:null,bsel:null});if(u.t&&META.played&&META.played[u.t]>0){META.played[u.t]--;saveMeta(META)}
  S.board=G.grid.filter(Boolean).concat(G.bench||[]);POS=new Map();G.grid.forEach((x,j)=>{if(x)POS.set(x,j)});DISC0=-1;facing.fill(null);
  SFX.play('ui');save()}catch(e){UNDO=[]}render()}
// la première escouade de la partie (Tank, Soin et DPS côte à côte) : grosse annonce, une seule fois
function squadFx(){if(!G||G.sqDone||S.busy)return;const j=G.grid.findIndex((u,k)=>u&&Z.squad(G,k));if(j<0)return;G.sqDone=1;const p=tc(j);
 floatTxt(p.x,p.y-30,_t('Escouade ! +1 dégât (ou +1 soin)'),'#ffd25a',20);addFX({type:'ring',x:p.x,y:p.y,r:70,c:'#ffd25a',dur:700});SFX.play('lvl');vib(60);save()}
function tapCell(i){
 if(S.dawnWait)return;// fin de nuit, l'aube arrive : plus rien ne se pose
 const gd=guideStep();if(gd&&!guideOk(gd,i))return;
 if(S.busy&&!(S.pause&&S.sel===null)){if(S.sel!==null&&S.sel>=0&&Z.U[S.hand[S.sel]].react)playReact(S.sel,i);return}
 if(S.bsel!=null&&!S.busy){const k=S.bsel;S.bsel=null;snapUndo();const mg=Z.placeBench(G,k,i);if(!mg)UNDO.pop();if(mg){facing[i]=null;syncBoard();mergeFx(mg);S.inspect=typeof mg==='object'?i:null;const p=tc(i);addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#9ee08a',dur:350});SFX.play('place');save()}render();return}
 if(S.sel===null){
  // déplacement d'une carte posée : on la touche, puis on touche une case libre
  if(S.moveFrom!==null){const a=S.moveFrom;S.moveFrom=null;S.inspect=null;if(!S.busy)snapUndo();const mv=Z.move(G,a,i);if(!mv&&!S.busy)UNDO.pop();if(mv){facing[i]=facing[a];facing[a]=null;const p=tc(i);addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#7cc7ff',dur:350});syncBoard();mergeFx(mv);if(typeof mv==='object')S.inspect=i;if(!S.busy)save()}render();squadFx();return}
  S.inspect=null;if(G.grid[i])S.moveFrom=i;render();
  return}
 const t=selCard(),D=Z.U[t],re=selReuse(),build=Z.isTrace(t);
 if(selCost()>(G.energy??0)||!Z.canPlace(G,t,i)){try{refuseFx(i)}catch(e){}return}
 snapUndo(re?null:t);tuto(1);if(!re)countPlay(t);if(build)useBuild(t);else S.hand.splice(S.sel,1);const mg=Z.place(G,t,i,R,false,{reuse:re});try{placeFx(t,i,D)}catch(e){}spentTrace(t);if(!D.instant)facing[i]=null;if(D.instant)S.discard.push(t);syncBoard();if(!build)S.sel=null;S.moveFrom=null;S.inspect=mg?i:null;
 if(!mg&&G.grid[i]&&G.grid[i].name){const q=tc(i);floatTxt(q.x,q.y-14,_t`${G.grid[i].name} rejoint l’abri`,'#f2b33d')}
 if(!mg&&G.grid[i]&&G.grid[i].leg){const q=tc(i);floatTxt(q.x,q.y+14,_t`Souvenir de ${G.grid[i].leg} : +1 dégât, +2 PV`,'#f2c23d',14);addFX({type:'ring',x:q.x,y:q.y,r:50,c:'#f2c23d',dur:600})}
 const p=D.instant&&!D.onUnit?CEN:tc(i);addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#f2b33d',dur:350});SFX.play(D.cat==='shoot'?'cock':'place');
 const St=Z.stat(G,t);
 if(t==='food')floatTxt(CEN.x,CEN.y,_t`+${St.gain} PV`,'#9fd86b');
 if(t==='rep')G.grid.forEach((u,j)=>{if(u&&Z.U[u.t].block){const q=tc(j);floatTxt(q.x,q.y,`+${St.gain}`,'#9fd86b')}});
 if(t==='kit')floatTxt(p.x,p.y,_t('Soigné'),'#9fd86b');
 if(t==='coffee')floatTxt(CEN.x,CEN.y,_t('+2 énergie'),'#f2b33d');
 if(t==='flare')floatTxt(CEN.x,CEN.y,_t('Fusée !'),'#ff8a5a');
 mergeFx(mg);save();render();achCheck();squadFx();
 if(G.drawNow||D.peek)UNDO=[];
 if(G.drawNow){const n=G.drawNow;G.drawNow=0;drawCards(Math.min(n,Math.max(0,Z.HAND_MAX-S.hand.length)));floatTxt(CEN.x,CEN.y-30,_t('Largage : +')+n+_t(' cartes'),'#9ee08a');save();render()}
 if(D.peek)peekScreen();
}
function peekScreen(){
 if(S.draw.length<3&&S.discard.length){S.draw=shuffle(S.discard).concat(S.draw);S.discard=[];S.reshuf=1}
 const top=S.draw.slice(-3).reverse();if(!top.length)return;
 show(_t`<h2 class="pw">Carte routière</h2><p>Les prochaines cartes de ta pioche. Prends-en une dans ta main.</p>
  <div class="picks">${top.map(t=>pickBtn(t,'peek',t)).join('')}</div>`);
}

// pause entre deux vagues d'une très grosse nuit : le joueur peut déplacer une unité et jouer ses réactions
function wavePause(n){return new Promise(res=>{S.pause=n;S.moveFrom=null;S.inspect=null;S.resume=res;SFX.play('dawn');
 floatTxt(CEN.x,CEN.y-40,_t`Vague ${n} repoussée !`,'#9fd86b',18);render()})}
function resumeWave(){if(!S.pause)return;S.pause=0;S.moveFrom=null;S.inspect=null;Z.nextWave(G);const f=S.resume;S.resume=null;vib([150,80,150]);floatTxt(CEN.x,CEN.y-40,_t`Vague ${G.wave} sur ${G.waves} : ${bossName(G.night)} arrive !`,'#ff6b6b',18);SFX.play('roar');render();f&&f()}
async function night(){
 if(S.busy||S.dawnWait)return;S.busy=true;SPEED=OPT.speed||1;S.sel=null;S.drag=null;{const bn=S.used.length&&typeof burnFx==='function'&&burnFx();S.discard.push(...S.used);if(bn)DISC0=S.discard.length}S.used=[];
 S.moveFrom=null;S.inspect=null;save();
 const scrap0=G.scrap,kills0=G.kills;
 UNDO=[];
 if(tutoDay()===Z.TUTO_N){TUTO=5;try{localStorage.setItem('abri-tuto',5)}catch(e){}}tuto(2);nightTarget=1;KC.n=0;KC.on=1;const run=++RUN;nightBanner();Z.startNight(G,R);render();
 // v125 : météo sonore (pluie, orage) et corne de la nuit rouge
 try{SFX.setWeather(G.event.id==='pluie'?'amb-rain':G.event.id==='coupure'?'amb-storm':null);if(Z.pressure(G.night))setTimeout(()=>SFX.play('horn'),300)}catch(e){}
 await nwait(900);if(run!==RUN)return;
 let r;
 do{const types=G.grid.map(u=>u&&u.t);
  r=Z.step(G);syncBoard();const now=performance.now();
  syncZ(now);playEvents(r.ev,types,now);render();
  if(r.pause){await wavePause(r.pause);if(run!==RUN)return}
  const lostEv=r.ev.filter(e=>e.k==='lost'),koEv=r.ev.filter(e=>e.k==='ko');
  if(lostEv.length||koEv.length){const info=$('#info');info.className='info warn';const ppl=lostEv.filter(e=>e.name),obj=lostEv.filter(e=>!e.name);
   info.innerHTML=[koEv.length?_t`${ii('band')} ${koEv.map(e=>`<b>${e.name||Z.U[e.t].n}</b>`).join(', ')} ${koEv.length>1?_t('sont blessés et partent'):_t('est blessé et part')} en réserve (repos 3 nuits).`:'',ppl.length?`${ii('cross')} ${ppl.map(e=>`<b>${e.name}</b> (${Z.U[e.t].n})`).join(', ')} ${ppl.length>1?_t('sont tombés'):_t('est tombé')}.`:'',obj.length?_t`${obj.map(e=>Z.U[e.t].n).join(', ')} détruit${obj.length>1?'s':''} !`:''].join(' ')}
  await nwait(tickMs());if(run!==RUN)return;
 }while(!r.done);
 await nwait(700);if(run!==RUN)return;
 try{SFX.setWeather(null)}catch(e){}
 const dawnInfo=Z.endNight(G);syncBoard();nightTarget=0;dawnT=performance.now();KC.on=0;S.busy=false;S.dawnWait=1;render();await nwait(DAWN);S.dawnWait=0;if(run!==RUN)return;
 if(G.oneNight)return dailyOver();
 if(G.shelter<=0)return end();
 const mut=Z.mutNight(G.night)?Z.mutate(G,R):null;
 const hero=G.grid.filter(u=>u&&u.name&&u.nk>0).sort((a,b)=>b.nk-a.nk)[0];
 const fallen=(G.fallen||[]).filter(f=>f.night===G.night);
 const rewardCard=null;
 S.dawn={kills:G.kills-kills0,scrap:G.scrap-scrap0,heal:dawnInfo.heal,mut,rewardCard,relicReward:dawnInfo.relic,tier:dawnInfo.tier,hero:hero?{name:hero.name,t:hero.t,nk:hero.nk}:null,fallen};save();render();
 achNight(G.kills-kills0);
 if(DEMO&&G.night>=Z.DEMO_N&&!G.won)return demoEnd();
 if(G.night===Z.WIN_NIGHT&&!G.won)return victory();
 dawn();
}
