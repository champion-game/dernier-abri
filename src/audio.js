// Sons du jeu : générés en code avec Web Audio, plus des grognements de zombies enregistrés (assets/sounds, licence CC0, voir CREDITS.md).
// Expose l'objet global SFX : SFX.play('shot'), SFX.night(0..1) (ambiance de nuit), SFX.music('day') (musique en boucle), SFX.sting('dawn'), SFX.toggle().
// Tout est protégé : si l'audio n'est pas disponible, le jeu continue sans son.
const SFX=(()=>{
 let ac=null,master=null,sfxG=null,musG=null,BUS=null,noiseBuf=null,amb=null,muted=false,VOL={sfx:1,mus:1};
 try{muted=localStorage.getItem('abri-mute')==='1'}catch(e){}
 const last={};
 function init(){
  if(ac)return ac;
  try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ac=new A();
   master=ac.createGain();master.gain.value=muted?0:.55;master.connect(ac.destination);
   // deux bus : effets sonores et musique/ambiance, réglables séparément dans les options
   sfxG=ac.createGain();sfxG.gain.value=VOL.sfx;sfxG.connect(master);musG=ac.createGain();musG.gain.value=VOL.mus;musG.connect(master);
   noiseBuf=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  }catch(e){ac=null}
  return ac}
 // le navigateur n'autorise le son qu'après un geste du joueur
 const unlock=()=>{if(init()){loadAll();if(ac.state==='suspended')ac.resume().catch(()=>{});primeMusic()}};
 ['pointerdown','touchstart','keydown'].forEach(ev=>addEventListener(ev,unlock,{passive:true}));
 // sons enregistrés (assets/sounds, CC0 : voir CREDITS.md), chargés au premier geste du joueur.
 // Lecture par Web Audio (léger, même avec beaucoup de tirs) ; si le chargement échoue (fichier ouvert en local), lecteur audio classique ;
 // si le son n'est pas prêt, on retombe sur le son généré.
 // [fichiers, volume, variation de hauteur, hauteur de base]
 const R3=(p,n,s=1)=>Array.from({length:n},(_,k)=>p+String(k+s).padStart(p.endsWith('0')?1:2,'0'));
 const SAMP={
  zgroan:[R3('zombie-',33),.5,.2],
  // v125 : sons trouvés par Amine (Pixabay, Sound Fishing)
  relic:[['ui-relic'],.55,0],heli:[['fx-heli'],.6,0],horn:[['fx-horn'],.55,0],zdie:[['fx-zdie'],.35,.15],mutate:[['fx-mutate'],.6,0],
  bow:[['fx-bow1','fx-bow2'],.45,.08],roar:[['fx-roar1','fx-roar2'],.7,.05],flame:[['fx-flame'],.38,.1],dawn:[['amb-dawn'],.5,0],
  cannon:[['fx-cannon'],.5,.08],bark:[['fx-bark'],.4,.12],weather:[['amb-rain','amb-storm'],0,0],
  ui:[['ui-select_001','ui-select_002','ui-click_001'],.5,.06],place:[['ui-drop_001','ui-drop_002','ui-drop_003','ui-drop_004'],.7,.08],
  fuse:[['ui-confirmation_002'],.7,0],lvl:[['ui-confirmation_001'],.7,0],evo:[['ui-maximize_006'],.7,0],back:[['ui-back_001'],.6,.05],
  shot:[['fx-shot1','fx-shot2','fx-shot3'],.32,.1],owl:[['amb-owl1','amb-owl2'],.5,.04],bed:[['amb-crickets','amb-insects'],0,0],card:[['ui-page'],.55,.08],cock:[['fx-cock'],.55,.05],mg:[['fx-shot3','fx-shot2'],.24,.08,1.18],snp:[['fx-snp1','fx-snp2'],.5,.05],sht:[['fx-sht1','fx-sht2','fx-sht3'],.42,.06],
  boom:[['fx-boom1','fx-boom2','fx-boom3'],.7,.08],melee:[['fx-melee000','fx-melee001','fx-melee002','fx-melee-tomahawk'],.5,.1],hit:[['fx-hit000','fx-hit001','fx-hit002','fx-hit-arrow'],.28,.12],
  bite:[['fx-bite000','fx-bite001','fx-bite002'],.42,.1],shelter:[['fx-shelter000','fx-shelter001','fx-shelter002'],.6,.06],lost:[['fx-lost000','fx-lost001','fx-lost002'],.55,.06]};
 const BUF={},EL={};let loaded=false;
 function loadAll(){if(loaded||!ac)return;loaded=true;
  for(const n in SAMP)SAMP[n][0].forEach(f=>{if(BUF[f]||EL[f])return;const url='assets/sounds/'+f+'.mp3';EL[f]=null;
   const html=()=>{try{const a=new Audio();a.preload='auto';a.src=url;EL[f]=a}catch(e){}};if(location.protocol==='file:'){html();return}
   fetch(url).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(b=>new Promise((res,rej)=>ac.decodeAudioData(b,res,rej))).then(buf=>{BUF[f]=buf})
    .catch(html)})}
 function playFile(f,vol,rate){
  if(BUF[f]){const s=ac.createBufferSource();s.buffer=BUF[f];s.playbackRate.value=rate;const g=ac.createGain();g.gain.value=vol;s.connect(g);g.connect(BUS||sfxG);voice(BUF[f].duration/rate);s.start(ac.currentTime);return true}
  const a0=EL[f];if(!a0||a0.readyState<2)return false;
  try{const a=a0.cloneNode();voice((a0.duration||.5)/rate);a.volume=Math.max(0,Math.min(1,vol*(BUS===musG?VOL.mus:VOL.sfx)));a.playbackRate=rate;a.preservesPitch=a.mozPreservesPitch=a.webkitPreservesPitch=false;const p=a.play();if(p&&p.catch)p.catch(()=>{});return true}catch(e){return false}}
 function sample(name,vol,rate){const d=SAMP[name];if(!d||muted||!ac)return false;const f=d[0][Math.floor(Math.random()*d[0].length)];
  return playFile(f,vol??d[1],rate??((d[3]||1)*(1+(Math.random()*2-1)*d[2])))}
 const zombie=(vol,rate)=>sample('zgroan',vol,rate);
 function noise(t,dur,{f=1200,q=1,type='bandpass',vol=.5,attack=.002,f2}={}){
  const s=ac.createBufferSource();s.buffer=noiseBuf;s.loop=true;
  const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q;
  const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+attack);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  s.connect(fl);fl.connect(g);g.connect(BUS||sfxG);s.start(t,Math.random()*1.5);s.stop(t+dur+.05)}
 function tone(t,dur,{f=220,f2,type='sine',vol=.4,attack=.005}={}){
  const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+attack);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g);g.connect(BUS||sfxG);o.start(t);o.stop(t+dur+.05)}
 const S={
  shot:t=>{noise(t,.09,{f:2400,q:.8,vol:.35});tone(t,.06,{f:180,f2:60,vol:.25})},
  snp:t=>{noise(t,.25,{f:1600,q:.6,vol:.55});tone(t,.18,{f:140,f2:40,vol:.4})},
  sht:t=>{noise(t,.22,{f:900,q:.5,vol:.6,type:'lowpass'});tone(t,.12,{f:110,f2:40,vol:.4})},
  mg:t=>{for(let k=0;k<3;k++)noise(t+k*.05,.05,{f:2600,q:1,vol:.25})},
  bow:t=>{noise(t,.12,{f:500,f2:2500,q:2,vol:.25})},
  flame:t=>{noise(t,.3,{f:700,q:.4,vol:.3,type:'lowpass',attack:.03})},
  melee:t=>{noise(t,.07,{f:600,q:1.5,vol:.35});tone(t,.08,{f:90,f2:50,vol:.3})},
  hit:t=>{tone(t,.07,{f:120,f2:70,vol:.18});noise(t,.05,{f:400,q:1,vol:.12})},
  bite:t=>{noise(t,.12,{f:300,q:2,vol:.4});tone(t,.15,{f:70,f2:40,vol:.35,type:'triangle'})},
  shelter:t=>{tone(t,.35,{f:60,f2:30,vol:.6,type:'triangle'});noise(t,.25,{f:200,type:'lowpass',vol:.5})},
  boom:t=>{noise(t,1.1,{f:900,f2:80,type:'lowpass',vol:.9,attack:.005});tone(t,.8,{f:80,f2:25,vol:.7})},
  lost:t=>{noise(t,.25,{f:350,q:3,vol:.45});noise(t+.05,.2,{f:900,q:4,vol:.25})},
  zdie:t=>{zombie(.32,.95+Math.random()*.4)},
  groan:t=>{if(zombie(.5,.7+Math.random()*.35))return;const f=70+Math.random()*40;tone(t,.9,{f,f2:f*.7,type:'sawtooth',vol:.08,attack:.15});tone(t,.9,{f:f*1.01,f2:f*.69,type:'sawtooth',vol:.06,attack:.2})},
  place:t=>{tone(t,.08,{f:220,f2:140,vol:.25,type:'triangle'});noise(t,.04,{f:1500,vol:.1})},
  ui:t=>tone(t,.05,{f:660,vol:.12,type:'triangle'}),
  dawn:t=>{[392,494,587,784].forEach((f,k)=>tone(t+k*.12,.6,{f,vol:.12,type:'triangle'}))},
  mutate:t=>{tone(t,1.2,{f:110,f2:70,type:'sawtooth',vol:.12,attack:.2});tone(t,1.2,{f:117,f2:73,type:'sawtooth',vol:.1,attack:.2})},
  fuse:t=>{[330,440,554,660,880].forEach((f,k)=>tone(t+k*.06,.35,{f,vol:.13,type:'triangle'}));noise(t+.25,.4,{f:5000,q:2,vol:.08})},
  evo:t=>{[262,330,392].forEach(f=>{tone(t,1.1,{f,f2:f*2,vol:.09,type:'sawtooth',attack:.3});tone(t,1.1,{f:f*1.01,f2:f*2.02,vol:.07,type:'triangle',attack:.3})});noise(t+.8,.6,{f:6000,q:3,vol:.1})},
  lvl:t=>{[523,659,784,1047].forEach((f,k)=>tone(t+k*.09,.4,{f,vol:.13,type:'square'}))},
  death:t=>{[330,262,196].forEach((f,k)=>tone(t+k*.25,.5,{f,vol:.12,type:'triangle'}))},
  // v170 : sons des animations de cartes
  no:t=>{tone(t,.09,{f:180,f2:150,vol:.14,type:'square'});tone(t+.1,.12,{f:150,f2:120,vol:.14,type:'square'})},
  thud:t=>{tone(t,.16,{f:95,f2:38,vol:.45,type:'triangle'});noise(t,.12,{f:420,type:'lowpass',vol:.3})},
  coin:t=>{tone(t,.09,{f:1320,vol:.08,type:'square'});tone(t+.06,.16,{f:1760,vol:.07,type:'square'})},
  shuffle:t=>{for(let k=0;k<7;k++)noise(t+k*.045,.035,{f:2600+k*120,q:1.2,vol:.14})},
  whoosh:t=>{noise(t,.25,{f:400,f2:2400,q:1,vol:.18,attack:.06})},
  pack:t=>{noise(t,.5,{f:5000,f2:600,type:'lowpass',vol:.45,attack:.005});[523,659,784].forEach((f,k)=>tone(t+.05+k*.07,.5,{f,vol:.1,type:'triangle'}))},
  tick:t=>{noise(t,.018,{f:3200,q:2,vol:.12})},
  bell:t=>{[1047,1319,1568].forEach((f,k)=>{tone(t+k*.05,1.1,{f,vol:.08,type:'sine'});tone(t+k*.05,.6,{f:f*2.76,vol:.025,type:'sine'})})},
  crack:t=>{noise(t,.06,{f:2400,q:3,vol:.3});noise(t+.05,.09,{f:900,q:2,vol:.25});tone(t,.4,{f:90,f2:60,vol:.12,type:'sawtooth',attack:.02})},
  rare:t=>{[392,523,659,784,1047].forEach((f,k)=>tone(t+k*.07,.7,{f,vol:.11,type:'triangle'}));noise(t+.3,.6,{f:7000,q:3,vol:.09})}
 };
 // v115 : nombre de sons joués en même temps plafonné (10, ou 5 en mode économie) : au-delà, on n'entend plus rien de plus,
 // mais chaque son coûte du calcul, surtout sur un petit téléphone pendant les grosses nuits
 let voices=0,maxVoices=10;const voice=d=>{voices++;setTimeout(()=>{voices=Math.max(0,voices-1)},Math.min(3000,Math.max(80,d*1000)))};
 function play(name,gap=.06){
  if(muted||!init()||!(S[name]||SAMP[name]))return;if(voices>=maxVoices)return;
  try{const t=ac.currentTime;if(last[name]&&t-last[name]<gap)return;last[name]=t;if(sample(name))return;voice(.3);S[name](t+.01)}catch(e){}}
 // ambiance de nuit : vent filtré + grondement sourd + nappe musicale sombre, dont le volume suit l'obscurité ;
 // par-dessus, des bruits lointains au hasard : hiboux, loups, grognements de zombies, et quelques notes de musique.
 let music=null,nextEvt=0,nextNote=0,weather=null;const bed={};
 // un son qui glisse d'une fréquence à l'autre en suivant une courbe, avec un léger vibrato (loup, hibou)
 function glide(t,pts,{type='sine',vol=.08,vib=0,vibF=5,lp=1800}={}){
  const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(pts[0][1],t);pts.slice(1).forEach(([dt,f])=>o.frequency.linearRampToValueAtTime(f,t+dt));
  const dur=pts[pts.length-1][0];let lfo=null;
  if(vib){lfo=ac.createOscillator();lfo.frequency.value=vibF;const lg=ac.createGain();lg.gain.value=vib;lfo.connect(lg);lg.connect(o.frequency);lfo.start(t);lfo.stop(t+dur+.1)}
  const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp;
  const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+Math.min(.25,dur*.2));g.gain.setValueAtTime(vol,t+dur*.75);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(fl);fl.connect(g);g.connect(musG);o.start(t);o.stop(t+dur+.05)}
 const AMB={
  // hibou : « hou… hou-hou-houuu »
  owl:t=>{const f=360+Math.random()*40,v=.05;[[0,.45],[.75,.22],[1.02,.22],[1.3,.7]].forEach(([d,l])=>glide(t+d,[[0,f*1.04],[l*.3,f],[l,f*.9]],{vol:v,lp:900}))},
  // loup au loin : un long hurlement qui monte puis redescend, parfois deux loups
  wolf:t=>{const f=260+Math.random()*60;glide(t,[[0,f],[.6,f*1.9],[2.2,f*1.75],[3.2,f*1.3]],{type:'triangle',vol:.045,vib:9,vibF:5.5,lp:1300});
   if(Math.random()<.5){const g2=f*1.12;glide(t+1.1,[[0,g2],[.5,g2*1.8],[2,g2*1.6],[2.8,g2*1.2]],{type:'triangle',vol:.03,vib:8,vibF:6,lp:1100})}},
  // grognement de zombie lointain
  groan:t=>{if(zombie(.16,.6+Math.random()*.3))return;const f=60+Math.random()*35;glide(t,[[0,f],[.5,f*1.15],[1.4,f*.75]],{type:'sawtooth',vol:.035,vib:4,vibF:9,lp:420});glide(t+.08,[[0,f*1.5],[.6,f*1.6],[1.3,f*1.1]],{type:'sawtooth',vol:.02,lp:380})},
  // craquement de branche
  crack:t=>{noise(t,.06,{f:2200,q:3,vol:.08});noise(t+.07,.04,{f:1800,q:3,vol:.05})}
 };
 // notes de musique : gamme mineure grave, sons doux et longs (comme un piano étouffé)
 const SCALE=[110,123.5,130.8,146.8,164.8,174.6,196,220,246.9,261.6];
 function note(t,f,vol){tone(t,3.2,{f,vol,type:'sine',attack:.02});tone(t,2.4,{f:f*2,vol:vol*.25,type:'triangle',attack:.02})}
 function night(k){
  if(!ac||muted)return;
  try{if(!amb){const s=ac.createBufferSource();s.buffer=noiseBuf;s.loop=true;const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=380;
    const g=ac.createGain();g.gain.value=0;const o=ac.createOscillator();o.type='sine';o.frequency.value=48;const og=ac.createGain();og.gain.value=.5;
    s.connect(fl);fl.connect(g);o.connect(og);og.connect(g);g.connect(musG);s.start();o.start();amb={g}}
   amb.g.gain.setTargetAtTime(.16*k,ac.currentTime,.3);
   // v124 : grillons et insectes enregistrés, en boucle, qui montent avec la nuit
   ['amb-crickets','amb-insects','amb-rain','amb-storm'].forEach((f,i)=>{const L=bed[f];if(!L&&BUF[f]){const s=ac.createBufferSource();s.buffer=BUF[f];s.loop=true;const g=ac.createGain();g.gain.value=0;s.connect(g);g.connect(musG);s.start();bed[f]={g}}
    else if(!L&&EL[f]&&EL[f].readyState>=2&&!EL[f].loop){const a=EL[f];a.loop=true;a.volume=0;const pr=a.play();if(pr&&pr.catch)pr.catch(()=>{});bed[f]={a}}
    const B=bed[f];if(!B)return;const v=i<2?(i?.22:.38)*k*(weather?.4:1):(weather===f?.55*Math.max(k,.3):0);if(B.g)B.g.gain.setTargetAtTime(v,ac.currentTime,.8);else B.a.volume=Math.max(0,Math.min(1,v*VOL.mus))});
   // nappe : accord de la mineur très grave qui respire lentement
   if(!music){const g=ac.createGain();g.gain.value=0;const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=600;fl.connect(g);g.connect(musG);
    [55,82.4,110,130.8].forEach((f,i)=>{const o=ac.createOscillator();o.type=i%2?'triangle':'sawtooth';o.frequency.value=f*(1+(i-1.5)*.002);
     const og=ac.createGain();og.gain.value=i===0?.35:.18;const l=ac.createOscillator();l.frequency.value=.05+i*.03;const lg=ac.createGain();lg.gain.value=og.gain.value*.6;l.connect(lg);lg.connect(og.gain);
     o.connect(og);og.connect(fl);o.start();l.start()});music={g}}
   const real=mReal();music.g.gain.setTargetAtTime(real?0:.07*k,ac.currentTime,.8);
   const t=ac.currentTime;if(k<.6){nextEvt=t+3;nextNote=t+2;return}
   if(t>nextEvt){const r=Math.random(),e=r<.32?'owl':r<.55?'wolf':r<.9?'groan':'crack';BUS=musG;try{if(!(e==='owl'&&sample('owl',.35+Math.random()*.25)))AMB[e](t+.05)}finally{BUS=null}nextEvt=t+4+Math.random()*7}
   if(t>nextNote&&!real){BUS=musG;try{const f=SCALE[Math.floor(Math.random()*SCALE.length)];note(t+.05,f,.035);if(Math.random()<.4)note(t+.9,SCALE[Math.floor(Math.random()*SCALE.length)],.025)}finally{BUS=null}nextNote=t+3.5+Math.random()*4}
  }catch(e){}}
 // v192 : vraies musiques (ElevenLabs, voir CREDITS.md) : menu, jour, nuit, boss en boucle ; aube, défaite, victoire jouées une fois.
 // Lues en streaming par 3 lecteurs audio réutilisés (léger en mémoire ; chaque morceau ne se télécharge que quand il joue),
 // branchés sur le bus « Musique et ambiance ». Deux lecteurs se relaient pour les boucles (fondu enchaîné), le 3ᵉ joue les morceaux courts.
 // [volume, durée du fondu de boucle en s]
 const MT={menu:[.5,4],day:[.45,2.5],night:[.55,4],boss:[.5,2.5],dawn:[.9],defeat:[.8],victory:[.65]};
 const MP=[];let mWant=null,mCur=null,mI=0,loopG=null,duckT=null;
 const mUrl=n=>'assets/sounds/music-'+n+'.mp3';
 function players(){if(MP.length)return MP;
  for(let k=0;k<3;k++){const a=new Audio();a.preload='none';const P={a,g:null,v:0,n:null};
   if(location.protocol!=='file:'&&ac.createMediaElementSource)try{if(!loopG){loopG=ac.createGain();loopG.connect(musG)}const s=ac.createMediaElementSource(a);P.g=ac.createGain();P.g.gain.value=0;s.connect(P.g);P.g.connect(k<2?loopG:musG)}catch(e){P.g=null}
   if(!P.g)a.volume=0;MP.push(P)}return MP}
 function mVol(P,v,tc){P.v=v;try{if(P.g)P.g.gain.setTargetAtTime(v,ac.currentTime,tc);else P.a.volume=Math.max(0,Math.min(1,v*VOL.mus))}catch(e){}}
 function mStart(P,n,tc){clearTimeout(P.st);try{if(P.n!==n){P.n=n;P.a.src=mUrl(n)}else P.a.currentTime=0;const pr=P.a.play();if(pr&&pr.catch)pr.catch(()=>{})}catch(e){}mVol(P,MT[n][0],tc)}
 function mStop(P,tc){mVol(P,0,tc);clearTimeout(P.st);P.st=setTimeout(()=>{if(!P.v)try{P.a.pause()}catch(e){}},tc*4000+200)}
 // appelé à chaque image : morceau voulu (ou null pour le silence)
 function mTick(){
  if(!ac||!primed||document.hidden)return;const L=players();
  if(mWant!==mCur){if(mCur)mStop(L[mI],.6);mCur=mWant;if(mCur){mStop(L[mI],.6);mI^=1;mStart(L[mI],mCur,.8)}}
  if(!mCur)return;const P=L[mI],a=P.a,X=MT[mCur][1];
  if(a.duration&&a.currentTime>a.duration-X){mStop(P,X/4);mI^=1;mStart(L[mI],mCur,X/4)}
  else if(a.paused&&!a.ended&&a.readyState>=2)try{const pr=a.play();if(pr&&pr.catch)pr.catch(()=>{})}catch(e){}}
 const mReal=()=>!!(mCur&&MP[mI]&&MP[mI].a.readyState>=2);
 // iPhone : un lecteur ne peut jouer que s’il a été lancé une fois pendant un toucher du joueur, d’où ce lancement-arrêt au premier geste
 let primed=false;function primeMusic(){if(primed)return;primed=true;try{players().forEach((P,k)=>{try{P.n=k?'dawn':'menu';P.a.src=mUrl(P.n);const pr=P.a.play(),off=()=>{if(!P.v)try{P.a.pause()}catch(e){}};if(pr&&pr.then)pr.then(off,()=>{});else off()}catch(e){}})}catch(e){}}
 function setMusic(n){if(muted)n=null;mWant=n;try{mTick()}catch(e){}}
 // morceau joué une fois ; la boucle en cours baisse pendant ce temps
 function sting(n){if(muted||!init()||!primed||!MT[n])return;try{const P=players()[2];mStart(P,n,.05);
   if(loopG){loopG.gain.setTargetAtTime(.2,ac.currentTime,.3);clearTimeout(duckT);duckT=setTimeout(()=>{try{loopG.gain.setTargetAtTime(1,ac.currentTime,1.2)}catch(e){}},Math.max(2,(P.a.duration||9)-1.5)*1000)}}catch(e){}}
 // jeu en arrière-plan (téléphone verrouillé, autre onglet) : on coupe tout
 document.addEventListener('visibilitychange',()=>{try{if(!ac)return;if(document.hidden){MP.forEach(P=>{try{P.a.pause()}catch(e){}});ac.suspend().catch(()=>{})}
  else if(!muted){ac.resume().catch(()=>{});if(mCur&&MP[mI]){const a=MP[mI].a;try{const pr=a.play();if(pr&&pr.catch)pr.catch(()=>{})}catch(e){}}}}catch(e){}});
 function toggle(){muted=!muted;for(const f in bed)if(bed[f].a){try{muted?bed[f].a.pause():bed[f].a.play()}catch(e){}}try{localStorage.setItem('abri-mute',muted?'1':'0')}catch(e){}
  if(init()){master.gain.setTargetAtTime(muted?0:.55,ac.currentTime,.05);if(!muted)unlock()}if(muted)setMusic(null);return muted}
 // volumes des options (0 à 1)
 function setVol(sfx,mus){VOL.sfx=sfx;VOL.mus=mus;if(sfxG){sfxG.gain.setTargetAtTime(sfx,ac.currentTime,.05);musG.gain.setTargetAtTime(mus,ac.currentTime,.05)}MP.forEach(P=>{if(!P.g)mVol(P,P.v)})}
 return{play,night,music:setMusic,sting,toggle,setVol,setWeather:w=>{weather=w},setMaxVoices:n=>{maxVoices=n},get muted(){return muted}};
})();
