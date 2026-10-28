/* v173 : fiche de fin de partie (« rapport de survie ») en haut des écrans de fin, et son image à partager.
   Tout vient de l'état de la partie (G.mtR : dégâts, éliminations et soins de chaque unité sur toute la partie) :
   aucune règle ici. Le papier usé est dessiné en CSS (style.css) pour l'écran, et redessiné sur un canvas pour l'image. */
let FKIND=null,FBEST=0;
// les données de la fiche
function ficheData(){const m=G.mtR||{},rs=Object.values(m),by={};let dmg=0;
 rs.forEach(r=>{dmg+=r.dmg||0;const b=by[r.t]||(by[r.t]={t:r.t,dmg:0,kills:0});b.dmg+=r.dmg||0;b.kills+=r.kills||0});
 const card=Object.values(by).filter(b=>b.dmg>0).sort((a,b)=>b.dmg-a.dmg)[0]||null;
 // survivant MVP : un survivant nommé (éliminations, soins comptent double) ; sinon la défense qui a le plus encaissé
 const sv=rs.filter(r=>r.name).map(r=>({...r,sc:(r.kills||0)*2+(r.hg||0)})).sort((a,b)=>b.sc-a.sc)[0];
 const wall=!sv||!sv.sc?rs.filter(r=>r.tak>0&&(!card||r.t!==card.t)).sort((a,b)=>b.tak-a.tak)[0]||null:null;
 const deck=deckList(),types=[...new Set(deck)];
 const kind=FKIND||'lose',nights=kind==='lose'?Math.max(0,G.night-1):G.night;
 return{kind,nights,night:G.night,kills:G.kills||0,dmg,relics:(G.relics||[]).length,card,sv:sv&&sv.sc?sv:null,wall,deck:types.slice(0,12),deckN:deck.length,
  ch:(Z.CHARS[G.char]||{}).n||'',pl:(Z.PLACES[G.place]||{}).n||'',m:G.menace||0,ev:G.event&&G.event.n||'',best:META.best||0,rec:kind!=='demo'&&nights>0&&nights>FBEST,
  no:String(META.runs||1).padStart(4,'0'),date:new Date().toLocaleDateString(LANG==='fr'?'fr-FR':'en-GB',{day:'numeric',month:'short',year:'numeric'}),daily:!!G.daily}}
const fStamp=d=>d.kind==='win'?[_t('SECOURU'),_t`NUIT ${d.night}`]:d.kind==='demo'?[_t('DÉMO'),_t('TERMINÉE')]:[_t('TOMBÉ'),_t`NUIT ${d.night}`];
const fWho=d=>[`<b>${d.ch}</b> · ${d.pl}`,[d.m?_t`Mutation ${d.m}`:'',d.daily?_t('Défi du jour'):'',d.kind==='win'?_t('Parti avec les secours'):d.kind==='lose'&&d.ev?d.ev:''].filter(Boolean).join(' · ')];
const fNum=n=>n.toLocaleString(LANG==='fr'?'fr-FR':'en-GB');
// contour déchiré du papier (même tirage à chaque fois) : coin haut droit corné, bas gauche arraché, bas droit brûlé
function ficheEdge(){let a=7;const r=()=>{a=(a*16807)%2147483647;return a/2147483647};const P=[],n=26;
 for(let k=0;k<=n;k++){const x=k/n*100;if(x>90)break;P.push([x,r()*1.3])}P.push([91,.4],[100,6.5]);
 for(let k=2;k<=n;k++){const y=k/n*100;if(y>86)break;P.push([100-r()*1.6,y])}
 [[99,87],[97.5,89],[98.6,91],[95.5,93.5],[96.2,95.5],[92.5,97],[93,99.4],[88,98.6]].forEach(([x,y])=>P.push([x+r()*.8,y+r()*.6]));
 for(let k=n;k>=0;k--){const x=k/n*100;if(x>86)continue;if(x<13)break;P.push([x,100-r()*1.2])}
 [[12,99],[10.5,97.2],[11,95],[8,94.2],[8.6,92],[5,91.5],[4.2,89.6],[1.5,89]].forEach(p=>P.push(p));
 for(let k=n;k>0;k--){const y=k/n*100;if(y>88)continue;P.push([r()*1.6,y])}return P}
const FEDGE=ficheEdge();
function rapportHtml(d){const A=t=>artUrl(t)||'',st=fStamp(d),who=fWho(d);
 const pol=(cls,tag,t,name,l1,l2)=>`<div class="pol ${cls}">${cls==='a'?'<span class="clip"></span>':''}<span class="tag">${tag}</span><span class="ph" style="background-image:url('${A(t)}')"></span><b>${name}</b><em>${l1}${l2?'<br>'+l2:''}</em></div>`;
 const c=d.card,s=d.sv,w=d.wall;
 const p1=c?pol('a',_t('CARTE MVP'),c.t,Z.U[c.t].n,_t`${fNum(c.dmg)} dégâts`,c.kills?plural(c.kills,_t('zombie'),_t('zombies')):''):'';
 const p2=s?pol('b',_t('SURVIVANT MVP'),s.t,s.name,Z.U[s.t].n,s.hg>(s.kills||0)*2?_t`${s.hg} PV soignés`:plural(s.kills||0,_t('zombie'),_t('zombies'))):w?pol('b',_t('DÉFENSE MVP'),w.t,Z.U[w.t].n,_t`${fNum(w.tak)} dégâts encaissés`,''):'';
 return `<div class="fiche-w"><span class="tp l"></span><span class="tp r"></span><span class="tp d"></span><span class="tp f"></span><span class="dog"></span><span class="fpr"></span><span class="fpr b"></span>
 <div class="fiche" style="clip-path:polygon(${FEDGE.map(([x,y])=>x.toFixed(2)+'% '+y.toFixed(2)+'%').join(',')})">
 <div class="fh"><div><h3>${_t('RAPPORT DE SURVIE')}</h3><small>${_t`Dossier n° ${d.no}`} · ${d.date}</small></div><img src="${uiUrl('barricard.webp')}" alt=""></div>
 <div class="fst ${d.kind}">${st[0]}<small>${st[1]}</small></div>
 <p class="fwho">${who[0]}${who[1]?'<br>'+who[1]:''}</p>
 <div class="fnum"><div><b>${d.nights}</b><small>${d.nights>1?_t('nuits'):_t('nuit')}</small></div><div><b>${fNum(d.kills)}</b><small>${_t('zombies')}</small></div><div><b>${fNum(d.dmg)}</b><small>${_t('dégâts')}</small></div><div><b>${d.relics}</b><small>${d.relics>1?_t('reliques'):_t('relique')}</small></div></div>
 ${p1||p2?`<div class="fmvp${p1&&p2?'':' one'}">${p1}${p2}</div>`:''}
 <div class="fdk"><h4>${_t`Le deck (${d.deckN} cartes)`}</h4><div class="row">${d.deck.map(t=>`<i style="background-image:url('${A(t)}')"></i>`).join('')}</div></div>
 <div class="fft"><span>${d.rec?_t('<b>Nouveau record !</b>'):_t`Record : <b>${plural(d.best,_t('nuit'),_t('nuits'))}</b>`}</span><span><b>Barricard</b></span></div></div></div>
 <button type="button" class="go fshare" data-a="fshare">${_t('Partager la fiche')}</button>`}
// insère la fiche en haut de l'écran de fin, et cache ce qu'elle répète déjà (tampon, titre, nombre de nuits, zombies)
function ficheInsert(){if(!FKIND||!G)return;const kind=FKIND;FKIND=null;let d;try{d=ficheData();d.kind=kind;d.nights=kind==='lose'?Math.max(0,G.night-1):G.night;d.rec=kind!=='demo'&&d.nights>0&&d.nights>FBEST}catch(e){return}
 FDATA=d;const kids=[...panel.children];
 const hide=kind==='lose'?kids.slice(0,5).filter(e=>e.matches('.bigstamp,h2,p,.big')):kind==='win'?kids.filter(e=>e.matches('h2,.big')):kids.filter(e=>e.matches('.bigstamp,h2'));
 hide.forEach(e=>e.classList.add('fhide'));panel.classList.add('hasfiche');
 const hl=kids.find(e=>e.matches('.heli')),at=kind==='win'&&hl?hl.nextElementSibling:kids[0];if(at)at.insertAdjacentHTML('beforebegin',rapportHtml(d));else panel.insertAdjacentHTML('afterbegin',rapportHtml(d))}
let FDATA=null;
const _keepEnd=keepEnd;keepEnd=function(){try{ficheInsert()}catch(e){}_keepEnd()};
['end','leaveWin','demoEnd'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(...a){FKIND=n==='end'?'lose':n==='leaveWin'?'win':'demo';FBEST=META.best||0;return f.apply(this,a)}});

/* ---------- image à partager (1080 × 1350) ---------- */
const fImg=src=>new Promise(r=>{if(!src)return r(null);const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
function fRound(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function fCover(g,img,x,y,w,h,fy){if(!img){g.fillStyle='#3a2a1a';g.fillRect(x,y,w,h);return}const s=Math.max(w/img.width,h/img.height),sw=w/s,sh=h/s;g.drawImage(img,(img.width-sw)/2,(img.height-sh)*(fy??.25),sw,sh,x,y,w,h)}
function fFit(g,txt,max,font,size){let s=size;g.font=`${font.replace('$',s)}`;while(g.measureText(txt).width>max&&s>10){s--;g.font=font.replace('$',s)}return s}
async function ficheCanvas(d){try{await Promise.all(["32px 'Special Elite'","700 20px 'Atkinson Hyperlegible'","400 20px 'Atkinson Hyperlegible'"].map(f=>document.fonts.load(f)))}catch(e){}
 const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const [wood,logo,ca,cs,...dk]=await Promise.all([fImg(uiUrl('wood.webp')),fImg(uiUrl('barricard.webp')),fImg(d.card&&artUrl(d.card.t)),fImg((d.sv||d.wall)&&artUrl((d.sv||d.wall).t)),...d.deck.map(t=>fImg(artUrl(t)))]);
 // fond : bois sombre
 if(wood){const p=g.createPattern(wood,'repeat');g.fillStyle=p;g.fillRect(0,0,W,H)}else{g.fillStyle='#3a2414';g.fillRect(0,0,W,H)}
 g.fillStyle='rgba(12,8,5,.5)';g.fillRect(0,0,W,H);const vg=g.createRadialGradient(W/2,H/2,W*.3,W/2,H/2,W*.85);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=vg;g.fillRect(0,0,W,H);
 // le papier
 const px=70,py=70,pw=W-140,ph=H-140,P=FEDGE.map(([x,y])=>[px+x/100*pw,py+y/100*ph]);
 g.save();g.translate(W/2,H/2);g.rotate(-.012);g.translate(-W/2,-H/2);
 g.save();g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=40;g.shadowOffsetY=18;g.beginPath();P.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle='#e8d6ac';g.fill();g.restore();
 g.save();g.beginPath();P.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.clip();
 const pg=g.createRadialGradient(W/2,H/2,100,W/2,H/2,W*.75);pg.addColorStop(0,'#f1e3c2');pg.addColorStop(1,'#d3b882');g.fillStyle=pg;g.fillRect(px,py,pw,ph);
 // taches, grain, pliures, café, brûlure, sang
 const blob=(x,y,rx,ry,c0)=>{const q=g.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));q.addColorStop(0,c0);q.addColorStop(1,'rgba(0,0,0,0)');g.save();g.translate(x,y);g.scale(rx/Math.max(rx,ry),ry/Math.max(rx,ry));g.translate(-x,-y);g.fillStyle=q;g.fillRect(x-rx*2,y-ry*2,rx*4,ry*4);g.restore()};
 let sd=11;const rr=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
 for(let k=0;k<14;k++)blob(px+rr()*pw,py+rr()*ph,60+rr()*160,40+rr()*120,`rgba(120,75,25,${.05+rr()*.08})`);
 blob(px+40,py+40,220,160,'rgba(90,50,15,.3)');blob(px+pw,py+ph,260,200,'rgba(70,35,10,.4)');blob(px,py+ph,200,160,'rgba(60,30,8,.35)');
 for(let k=0;k<5000;k++){g.fillStyle=`rgba(${rr()<.5?'80,50,20':'255,250,235'},${rr()*.12})`;g.fillRect(px+rr()*pw,py+rr()*ph,1+rr()*2,1+rr()*2)}
 g.strokeStyle='rgba(80,50,20,.2)';g.lineWidth=2;g.beginPath();g.moveTo(px+pw/2,py);g.lineTo(px+pw/2,py+ph);g.moveTo(px,py+ph*.56);g.lineTo(px+pw,py+ph*.56);g.stroke();
 g.strokeStyle='rgba(255,250,235,.4)';g.beginPath();g.moveTo(px+pw/2+2,py);g.lineTo(px+pw/2+2,py+ph);g.moveTo(px,py+ph*.56+2);g.lineTo(px+pw,py+ph*.56+2);g.stroke();
 g.strokeStyle='rgba(110,60,20,.28)';g.lineWidth=7;g.beginPath();g.arc(px+pw*.84,py+ph*.78,64,0,7);g.stroke();g.lineWidth=3;g.strokeStyle='rgba(110,60,20,.14)';g.beginPath();g.arc(px+pw*.84,py+ph*.78,74,.4,5.5);g.stroke();
 {const bx=px+pw*.97,by=py+ph*.99,q=g.createRadialGradient(bx,by,0,bx,by,210);q.addColorStop(0,'#140a03');q.addColorStop(.35,'#3a1a06');q.addColorStop(.55,'rgba(110,50,10,.75)');q.addColorStop(.8,'rgba(150,90,30,.3)');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(bx-220,by-220,440,440)}
 [[.62,.24,7],[.645,.26,4],[.6,.225,3]].forEach(([x,y,r])=>{g.fillStyle='rgba(110,15,10,.55)';g.beginPath();g.arc(px+pw*x,py+ph*y,r,0,7);g.fill()});
 g.restore();
 // contenu
 const ink='#2b1a0c',red='#8a1a14',L0=px+70,R0=px+pw-70;g.textBaseline='alphabetic';
 g.fillStyle=ink;fFit(g,_t('RAPPORT DE SURVIE'),R0-L0-220,"$px 'Special Elite'",58);g.fillText(_t('RAPPORT DE SURVIE'),L0,py+130);
 g.font="26px 'Atkinson Hyperlegible'";g.fillStyle='#6a4a28';g.fillText(_t`Dossier n° ${d.no}`+' · '+d.date,L0,py+172);
 if(logo){const lh=96,lw=logo.width/logo.height*lh;g.drawImage(logo,R0-lw,py+66,lw,lh)}
 g.setLineDash([16,10]);g.strokeStyle='rgba(60,35,10,.45)';g.lineWidth=4;g.beginPath();g.moveTo(L0,py+200);g.lineTo(R0,py+200);g.stroke();g.setLineDash([]);
 const who=fWho(d);g.fillStyle=ink;g.font="700 30px 'Atkinson Hyperlegible'";g.fillText(d.ch,L0,py+250);const wch=g.measureText(d.ch).width;g.font="30px 'Atkinson Hyperlegible'";g.fillStyle='#4a3018';g.fillText(' · '+d.pl,L0+wch,py+250);if(who[1])g.fillText(who[1].replace(/<[^>]+>/g,''),L0,py+292);
 // tampon
 {const st=fStamp(d),col=d.kind==='lose'?'rgba(185,25,20,.88)':'rgba(40,120,40,.88)';g.save();g.translate(R0-150,py+270);g.rotate(-.2);g.strokeStyle=col;g.fillStyle=col;g.lineWidth=8;
  g.font="64px 'Special Elite'";const w1=g.measureText(st[0]).width;g.font="34px 'Special Elite'";const w2=g.measureText(st[1]).width;const bw=Math.max(w1,w2)+44;fRound(g,-bw/2,-62,bw,128,14);g.stroke();
  g.textAlign='center';g.font="64px 'Special Elite'";g.fillText(st[0],0,6);g.font="34px 'Special Elite'";g.fillText(st[1],0,48);g.restore();g.textAlign='left'}
 // chiffres
 {const y=py+330,h=130,cw=(R0-L0)/4;g.strokeStyle='rgba(60,35,10,.35)';g.lineWidth=2;g.beginPath();g.moveTo(L0,y);g.lineTo(R0,y);g.moveTo(L0,y+h);g.lineTo(R0,y+h);g.stroke();
  [[d.nights,d.nights>1?_t('nuits'):_t('nuit')],[fNum(d.kills),_t('zombies')],[fNum(d.dmg),_t('dégâts')],[d.relics,d.relics>1?_t('reliques'):_t('relique')]].forEach(([v,l],k)=>{const cx=L0+cw*k+cw/2;
   if(k){g.setLineDash([4,6]);g.beginPath();g.moveTo(L0+cw*k,y+14);g.lineTo(L0+cw*k,y+h-14);g.stroke();g.setLineDash([])}
   g.textAlign='center';g.fillStyle=red;fFit(g,String(v),cw-20,"$px 'Special Elite'",66);g.fillText(String(v),cx,y+76);g.fillStyle='#5a3a1a';g.font="700 22px 'Atkinson Hyperlegible'";g.fillText(l.toUpperCase(),cx,y+112)});g.textAlign='left'}
 // photos MVP
 const pol=(x,y,w,rot,img,tag,tagc,name,l1,l2,clip)=>{g.save();g.translate(x+w/2,y+w*.55);g.rotate(rot);g.translate(-w/2,-w*.55);
  g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=18;g.shadowOffsetY=8;g.fillStyle='#f1e8d0';g.fillRect(0,0,w,w*1.12);g.shadowColor='transparent';
  const iw=w-28;fCover(g,img,14,14,iw,iw*.75);g.fillStyle='rgba(120,80,20,.18)';g.fillRect(14,14,iw,iw*.75);
  g.fillStyle=ink;fFit(g,name,iw,"$px 'Special Elite'",36);g.fillText(name,16,iw*.75+64);g.font="24px 'Atkinson Hyperlegible'";g.fillStyle='#5a3a1a';g.fillText(l1,16,iw*.75+100);if(l2)g.fillText(l2,16,iw*.75+132);
  g.save();g.translate(-8,-14);g.rotate(-.07);g.font="700 22px 'Atkinson Hyperlegible'";const tw=g.measureText(tag).width+24;g.fillStyle=tagc;g.fillRect(0,0,tw,36);g.fillStyle='#fff';g.fillText(tag,12,26);g.restore();
  if(clip){g.strokeStyle='#8d949a';g.lineWidth=6;fRound(g,w-70,-30,30,76,15);g.stroke()}g.restore()};
 {const y=py+500,w=(R0-L0-40)/2,s=d.sv,wl=d.wall,c=d.card;
  const one=!(c&&(s||wl)),x1=one?L0+w/2+20:L0;
  if(c)pol(x1,y,w,-.05,ca,_t('CARTE MVP'),'#8a1a14',Z.U[c.t].n,_t`${fNum(c.dmg)} dégâts`,c.kills?plural(c.kills,_t('zombie'),_t('zombies')):'',1);
  if(s)pol(one?x1:L0+w+40,y,w,.045,cs,_t('SURVIVANT MVP'),'#2f6b22',s.name,Z.U[s.t].n,s.hg>(s.kills||0)*2?_t`${s.hg} PV soignés`:plural(s.kills||0,_t('zombie'),_t('zombies')));
  else if(wl)pol(one?x1:L0+w+40,y,w,.045,cs,_t('DÉFENSE MVP'),'#2f6b22',Z.U[wl.t].n,_t`${fNum(wl.tak)} dégâts encaissés`,'')}
 // deck
 {const y=py+ph-210;g.fillStyle='#5a3a1a';g.font="32px 'Special Elite'";g.fillText(_t`Le deck (${d.deckN} cartes)`,L0,y);const n=dk.length,cw2=Math.min(86,(R0-L0)/Math.max(1,n)+14),ch2=cw2*1.33;
  dk.forEach((im,k)=>{g.save();g.translate(L0+12+k*(cw2-16)+cw2/2,y+30+ch2/2);g.rotate(k%2?.05:-.06);g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=8;g.fillStyle='#fbf8ef';g.fillRect(-cw2/2-4,-ch2/2-4,cw2+8,ch2+8);g.shadowColor='transparent';fCover(g,im,-cw2/2,-ch2/2,cw2,ch2,.2);g.restore()})}
 g.font="26px 'Atkinson Hyperlegible'";g.fillStyle='#6a4a28';g.fillText(d.rec?_t('Nouveau record !'):_t`Record : ${plural(d.best,_t('nuit'),_t('nuits'))}`,L0+60,py+ph-30);g.textAlign='right';g.font="700 26px 'Atkinson Hyperlegible'";g.fillStyle=ink;g.fillText('Barricard',R0-150,py+ph-30);g.textAlign='left';
 // scotch
 const tape=(x,y,w,h,r)=>{g.save();g.translate(x,y);g.rotate(r);g.fillStyle='rgba(206,186,124,.85)';g.beginPath();g.moveTo(-w/2,-h/2);for(let k=0;k<=6;k++)g.lineTo(-w/2+(k%2?8:0)+(k===0?0:0),-h/2+h*k/6);g.lineTo(w/2-(rr()*8),h/2);for(let k=6;k>=0;k--)g.lineTo(w/2-(k%2?8:0),-h/2+h*k/6);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.18)';g.fillRect(-w/2,-h/2,w,h*.35);g.restore()};
 tape(px+150,py+8,220,64,-.15);tape(px+pw-160,py+10,200,60,.12);tape(px+pw*.45,py+ph-4,170,54,-.05);
 g.restore();return c}
async function ficheShare(){const d=FDATA;if(!d)return;const b=panel.querySelector('.fshare');if(b){b.disabled=true}
 try{const c=await ficheCanvas(d);const blob=await new Promise((res,rej)=>{try{c.toBlob(x=>x?res(x):rej(),'image/png')}catch(e){rej(e)}});
  const name=`barricard-${_t('nuit')}-${d.night}.png`,file=new File([blob],name,{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Barricard'})}catch(e){}}
  else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}}
 catch(e){try{const n=document.createElement('p');n.className='bad';n.textContent=_t('Image impossible à créer ici (jeu ouvert sans internet). Fais une capture d’écran.');b&&b.after(n)}catch(x){}}
 if(b)b.disabled=false}
ACT.fshare=()=>{try{SFX.play('ui')}catch(e){}ficheShare()};
