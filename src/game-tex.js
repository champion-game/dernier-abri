// Essai (branche textures-ambiances) : pack de textures par-dessus le style artiste (html.artx.tex),
// avec trois ambiances : jour, nuit, nuit rouge (html[data-amb]). Images dans assets/art/tex/. Chargé tout à la fin.
const TX={c:null};
function txAmb(){if(typeof G==='undefined'||!G||onTitle||!S.busy)return'day';return Z.pressure(G.night)||G.tier==='blood'?'blood':'night'}
// sol du plateau : les cases de l'image d'Amine (9 × 9) recouvertes de dalles de béton, le cadre reste le même
function txPlat(){try{if(!AX.plat||AX.plat._tx||!TX.c||!TX.c.complete||!TX.c.naturalWidth)return;const P=AX.plat,w=P.naturalWidth||P.width,h=P.naturalHeight||P.height,c=document.createElement('canvas');c.width=w;c.height=h;
 const g=c.getContext('2d'),s=w/1245,x0=200*s,y0=162*s,cs=94.1*s;g.drawImage(P,0,0,w,h);let sd=11;const rnd=()=>(sd=sd*16807%2147483647)/2147483647;
 const X=[[8,113],[129,121],[259,121],[389,109]],Y=[[6,118],[131,119],[258,115],[380,123]],jt=cs*.035;g.fillStyle='#211f1c';g.fillRect(x0,y0,9*cs,9*cs);
 for(let i=0;i<9;i++)for(let j=0;j<9;j++){const a=X[rnd()*4|0],b=Y[rnd()*4|0];g.drawImage(TX.c,a[0],b[0],a[1],b[1],x0+i*cs+jt,y0+j*cs+jt,cs-2*jt,cs-2*jt)}
 g.save();g.globalCompositeOperation='multiply';g.fillStyle='rgb(255,232,196)';g.fillRect(x0,y0,9*cs,9*cs);g.restore();// dalles un peu chaudes, comme au soleil
 // ombre portée du cadre sur les dalles
 const W=9*cs;g.save();g.beginPath();g.rect(x0,y0,W,W);g.clip();g.shadowColor='rgba(0,0,0,.7)';g.shadowBlur=28*s;g.lineWidth=40*s;g.strokeStyle='#000';g.strokeRect(x0-20*s,y0-20*s,W+40*s,W+40*s);g.restore();
 c._tx=1;AX.plat=c;AXP.key='';axGround()}catch(e){}}
function txSync(){try{const on=DE.classList.contains('artx');DE.classList.toggle('tex',on);if(!on)return;const a=txAmb();
 if(DE.dataset.amb!==a){DE.dataset.amb=a;NDK=a==='blood'?'38,3,5':'4,7,18';NTN=a==='blood'?'215,85,80':'95,120,190'}
 if(!TX.c){TX.c=new Image();TX.c.onload=txPlat;TX.c.src='assets/art/tex/concrete.webp'}
 if(AX.plat&&!AX.plat._tx)txPlat()}catch(e){}}
{const r0=render;render=function(){const r=r0.apply(this,arguments);txSync();return r}}
setInterval(txSync,400);txSync();
