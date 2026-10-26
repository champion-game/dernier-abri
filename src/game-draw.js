/* Dernier Abri : dessin de la carte (canvas), effets visuels et boucle d’affichage.
   Les fichiers src/game*.js partagent leurs variables (scripts classiques chargés dans l’ordre par index.html). */
/* ---------- canvas setup ---------- */
const T=64,L=T*Z.N,CEN={x:L/2,y:L/2};
if(!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.min(r,w/2,h/2);this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
const cv=$('#map'),ctx=cv.getContext('2d');
const dark=document.createElement('canvas'),dctx=dark.getContext('2d');
let SC=1,DPR=1;
function fit(){const w=cv.clientWidth||320;if(!fit.w0||fit.w0!==w){fit.w0=w;setTimeout(drawWoods,0)}DPR=Math.min(OPT.eco?1:2,devicePixelRatio||1);const px=Math.round(w*DPR);if(cv.width!==px){cv.width=cv.height=px;const dp=Math.ceil(px/2);dark.width=dark.height=dp}SC=px/L}
const tc=i=>{const[r,c]=Z.rc(i);return{x:c*T+T/2,y:r*T+T/2}};
function rng(seed){return()=>(seed=(seed*16807)%2147483647)/2147483647}

/* en largeur : la forêt prolonge le plateau jusqu'aux bords de l'écran (fond dessiné derrière la carte, redessiné au redimensionnement) */
// v157 : plateau lumineux façon jeu de société ; v158 : 6 terrains purement graphiques, tirés au hasard à chaque partie (BIOME)
const BIO={
 foret:{ring:'#2f4d22',rsp:['#3a5c29','#26401b','#46693a'],gap:'#3d6424',cell:['#679a3c','#5d8f36'],hi:'rgba(255,255,200,.1)',lo:'rgba(20,40,10,.16)',patch:['rgba(30,60,14,.16)','rgba(220,240,140,.08)'],
  blades:['#7fb049','#4c7d2a','#8cbc52','#3f6c24'],grid:'rgba(90,60,28,.28)',shadow:'10,25,6',flora:'leaf',tc:[['#1d3a14','#3f7a2a','#7cb446'],['#2a4512','#5a8a26','#98bd48'],['#15301a','#2f6634','#5e9c4c']],
  deco:'flowers',flowers:['#f4f1e4','#f4d34a','#c9b4f0'],tufts:['#3c6a22','#86ba4c'],road:{edge:'#7d5d34',fill:'#c19b63',sp:['#d4b27a','#aa8551','#cfa96f'],rut:'rgba(120,84,44,.32)',peb:'#6f5232',grass:['#4f7f2c','#79a845']}},
 automne:{ring:'#4a3a1c',rsp:['#5a4622','#3a2c14','#6a5228'],gap:'#6a6428',cell:['#a39b4a','#978f42'],hi:'rgba(255,240,190,.14)',lo:'rgba(60,40,10,.18)',patch:['rgba(120,60,10,.14)','rgba(255,220,120,.1)'],
  blades:['#c2b25a','#857a32','#b8a04c','#6f6a2a'],grid:'rgba(90,60,20,.3)',shadow:'40,24,6',flora:'leaf',tc:[['#5a1e0c','#b8441c','#f07a32'],['#6a3a08','#d88a1c','#f6c446'],['#4a1a14','#9a2a1c','#d4543a'],['#3a4012','#7a7a26','#b4a842']],
  deco:'leaves',flowers:['#d8642a','#e8a432','#b8401f','#c9852a'],tufts:['#7a6a2a','#c4a850'],road:{edge:'#6d4e2c',fill:'#b48e5a',sp:['#c8a06a','#9a7548','#d0763a'],rut:'rgba(110,74,40,.34)',peb:'#5f4428',grass:['#8a7a32','#c0a44a']}},
 neige:{ring:'#c9d5e1',rsp:['#b8c6d4','#e6edf3','#aebdcc'],gap:'#a9b8c8',cell:['#eef3f8','#e2eaf2'],hi:'rgba(255,255,255,.6)',lo:'rgba(70,95,140,.16)',patch:['rgba(120,150,195,.12)','rgba(255,255,255,.35)'],
  blades:null,grid:'rgba(90,110,140,.3)',shadow:'40,60,110',flora:'snowpine',deco:'snow',tufts:['#7a6a5a','#9a8a78'],
  road:{edge:'#8e98a4',fill:'#c3c8cd',sp:['#e6eaee','#a2a9b0','#d4d8dc'],rut:'rgba(80,84,96,.38)',peb:'#6e6a66',grass:['#ffffff','#dde5ee']}},
 desert:{ring:'#c39a60',rsp:['#b48a52','#d6b078','#a67c48'],gap:'#b08e58',cell:['#e4c78c','#dabb80'],hi:'rgba(255,250,225,.28)',lo:'rgba(120,80,30,.18)',patch:['rgba(160,110,50,.14)','rgba(255,240,200,.16)'],
  blades:null,grid:'rgba(120,85,40,.32)',shadow:'90,50,20',flora:'desert',deco:'desert',tufts:['#8a7a3a','#a8984a'],
  road:{edge:'#3e3a36',fill:'#66605a',sp:['#7e766e','#524c46','#8e857a'],rut:null,dash:'#e8c84a',peb:'#2e2a26',grass:['#c8a468','#b08e58']}},
 bitume:{ring:'#2e3032',rsp:['#3a3c3e','#232527','#46484a'],gap:'#3a3c3e',cell:['#707274','#686a6c'],hi:'rgba(255,255,255,.1)',lo:'rgba(0,0,0,.22)',patch:['rgba(0,0,0,.14)','rgba(255,255,255,.05)'],
  blades:null,grid:'rgba(20,20,20,.35)',shadow:'0,0,0',flora:'urban',deco:'urban',tufts:['#5a7a32','#7a9a44'],
  road:{edge:'#232425',fill:'#46484b',sp:['#55575a','#3a3c3e','#5e6064'],rut:null,dash:'#e8c440',peb:'#1e1e1e',grass:['#8a8c8e','#5a7a32']}},
 montagne:{ring:'#3e4c34',rsp:['#4a5a3e','#323e2a','#5a6650'],gap:'#56643a',cell:['#84965a','#7a8c52'],hi:'rgba(255,255,220,.12)',lo:'rgba(30,40,20,.18)',patch:['rgba(90,90,80,.2)','rgba(230,240,190,.08)'],
  blades:['#a0b46a','#5e7040','#aebe7a','#4e5e36'],grid:'rgba(60,60,40,.3)',shadow:'15,25,15',flora:'pine',deco:'mountain',flowers:['#f4f1e4','#b8a4e8','#e8e0f8'],tufts:['#4e6030','#9cb066'],
  road:{edge:'#5e5a52',fill:'#a29c8f',sp:['#bdb7aa','#857f74','#c8c2b4'],rut:'rgba(70,65,58,.36)',peb:'#4e4a44',grass:['#5e7040','#94a862']}}};
const BIOMES=Object.keys(BIO);let BIOME='foret';
function leafTree(g,x,y,s,r,k,pal){k=k||1;const c=pal[Math.floor(r()*pal.length)],n=5+Math.floor(r()*3),pts=[[x,y,s*.62]];
 for(let i=0;i<n;i++){const a=i/n*6.283+r()*.7,d=s*(.3+r()*.25);pts.push([x+Math.cos(a)*d,y+Math.sin(a)*d,s*(.42+r()*.2)])}
 g.fillStyle='rgba(12,24,8,.4)';g.beginPath();g.ellipse(x+s*.3,y+s*.42,s*1.08,s*.92,0,0,7);g.fill();
 g.fillStyle='#1a1408';pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px,py,pr+1.3*k,0,7);g.fill()});
 g.fillStyle=c[1];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px,py,pr,0,7);g.fill()});
 g.fillStyle=c[0];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px+pr*.22,py+pr*.28,pr*.55,0,7);g.fill()});
 g.fillStyle=c[1];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px-pr*.05,py-pr*.05,pr*.62,0,7);g.fill()});
 g.fillStyle=c[2];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px-pr*.28,py-pr*.32,pr*.42,0,7);g.fill()});
 g.fillStyle='rgba(255,255,210,.35)';for(let i=0;i<4;i++){const p=pts[1+Math.floor(r()*(pts.length-1))];g.beginPath();g.arc(p[0]-p[2]*.4,p[1]-p[2]*.45,1.2*k,0,7);g.fill()}}
// sapin vu du dessus : étoiles de branches empilées, de la plus sombre à la plus claire (avec de la neige sur les branches)
function pineTree(g,x,y,s,r,k,snow){k=k||1;const rot=r()*6.3,star=(rad,c)=>{g.fillStyle=c;g.beginPath();for(let i=0;i<16;i++){const a=rot+i/16*6.283,d=i%2?rad*.62:rad;g.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d)}g.closePath();g.fill()};
 g.fillStyle=snow?'rgba(40,60,110,.3)':'rgba(10,20,8,.4)';g.beginPath();g.ellipse(x+s*.35,y+s*.45,s,s*.85,0,0,7);g.fill();
 star(s+1.3*k,'#0e1a0e');star(s,snow?'#2c4a3a':'#1f4a28');star(s*.72,snow?'#3e6450':'#2f6a36');star(s*.44,snow?'#557a62':'#4a8a46');
 if(snow){g.fillStyle='#f4f8fc';for(let i=0;i<6;i++){const a=rot+i*1.05+r()*.4,d=s*(.25+r()*.5);g.beginPath();g.ellipse(x+Math.cos(a)*d-1*k,y+Math.sin(a)*d-1*k,s*.17,s*.11,a,0,7);g.fill()}
  g.beginPath();g.arc(x-1*k,y-1*k,s*.16,0,7);g.fill()}else{g.fillStyle='#7ab05a';g.beginPath();g.arc(x-s*.08,y-s*.08,s*.14,0,7);g.fill()}}
function rockDeco(g,x,y,s,r,c){c=c||['#8b8e87','#b9bcb2','#6c6f69'];g.fillStyle='rgba(10,20,6,.35)';g.beginPath();g.ellipse(x+s*.25,y+s*.35,s*1.05,s*.7,0,0,7);g.fill();
 g.fillStyle='#2a2c28';g.beginPath();g.ellipse(x,y,s+1.2,s*.78+1.2,r()*.6,0,7);g.fill();g.fillStyle=c[0];g.beginPath();g.ellipse(x,y,s,s*.78,0,0,7);g.fill();
 g.fillStyle=c[1];g.beginPath();g.ellipse(x-s*.25,y-s*.25,s*.55,s*.36,-.4,0,7);g.fill();g.fillStyle=c[2];g.beginPath();g.ellipse(x+s*.3,y+s*.3,s*.4,s*.22,0,0,7);g.fill()}
function logDeco(g,x,y,len,w,a){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='rgba(10,20,6,.35)';g.fillRect(-len/2+2,-w/2+3,len,w);
 g.fillStyle='#2b1c10';g.fillRect(-len/2-1,-w/2-1,len+2,w+2);g.fillStyle='#7a5230';g.fillRect(-len/2,-w/2,len,w);g.fillStyle='#93673e';g.fillRect(-len/2,-w/2,len,w*.35);
 g.fillStyle='#2b1c10';g.beginPath();g.ellipse(len/2,0,w*.32+1,w/2+1,0,0,7);g.fill();g.fillStyle='#c9a26a';g.beginPath();g.ellipse(len/2,0,w*.32,w/2,0,0,7);g.fill();
 g.strokeStyle='#8a6a40';g.lineWidth=.8;g.beginPath();g.ellipse(len/2,0,w*.17,w*.27,0,0,7);g.stroke();g.restore()}
// désert : cactus, buissons secs ; ville : épaves, blocs de béton, fûts, gravats ; partout : arbres morts
function cactus(g,x,y,s,r,k){k=k||1;const c=(cx,cy,w,h)=>{g.fillStyle='#163010';g.beginPath();g.ellipse(cx,cy,w+1.2*k,h+1.2*k,0,0,7);g.fill();g.fillStyle='#4f8a3a';g.beginPath();g.ellipse(cx,cy,w,h,0,0,7);g.fill();g.fillStyle='#7ab25a';g.beginPath();g.ellipse(cx-w*.3,cy-h*.2,w*.35,h*.7,0,0,7);g.fill()};
 g.fillStyle='rgba(90,50,20,.32)';g.beginPath();g.ellipse(x+s*.4,y+s*.3,s*.5,s*.9,-.5,0,7);g.fill();
 c(x-s*.42,y-s*.05,s*.16,s*.32);c(x+s*.42,y-s*.25,s*.16,s*.3);c(x,y,s*.26,s*.72);g.fillStyle='#f0e0a0';for(let i=0;i<5;i++){g.fillRect(x+(r()-.5)*s*.4,y+(r()-.5)*s,1*k,1*k)}}
function deadBush(g,x,y,s,r,k,col){k=k||1;g.strokeStyle=col||'#6a4a2a';g.lineCap='round';for(let i=0;i<7;i++){const a=r()*6.3,d=s*(.5+r()*.5);g.lineWidth=1.6*k;g.beginPath();g.moveTo(x,y);const mx=x+Math.cos(a)*d*.5,my=y+Math.sin(a)*d*.5;g.lineTo(mx,my);g.lineTo(x+Math.cos(a+.3)*d,y+Math.sin(a+.3)*d);g.moveTo(mx,my);g.lineWidth=1*k;g.lineTo(x+Math.cos(a-.4)*d*.8,y+Math.sin(a-.4)*d*.8);g.stroke()}}
function carWreck(g,x,y,s,r,k){k=k||1;const c=['#8a3a2a','#3a5a7a','#6a6a5a','#9a7a3a'][Math.floor(r()*4)];g.save();g.translate(x,y);g.rotate(r()*6.3);const w=s*1.9,h=s*.95;
 g.fillStyle='rgba(0,0,0,.4)';g.fillRect(-w/2+3*k,-h/2+4*k,w,h);g.fillStyle='#111';g.fillRect(-w/2-1.3*k,-h/2-1.3*k,w+2.6*k,h+2.6*k);g.fillStyle=c;g.fillRect(-w/2,-h/2,w,h);
 g.fillStyle='rgba(0,0,0,.35)';g.fillRect(-w*.2,-h/2+1.5*k,w*.45,h-3*k);g.fillStyle='#2a3a44';g.fillRect(w*.25,-h/2+2*k,w*.08,h-4*k);g.fillRect(-w*.3,-h/2+2*k,w*.07,h-4*k);
 g.fillStyle='#6a3a1a';for(let i=0;i<4;i++){g.beginPath();g.arc((r()-.5)*w*.8,(r()-.5)*h*.7,(1+r()*2)*k,0,7);g.fill()}g.restore()}
function concreteBlock(g,x,y,s,r,k){k=k||1;g.save();g.translate(x,y);g.rotate(r()*.6-.3);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(-s/2+3*k,-s/2+4*k,s,s);g.fillStyle='#1a1a1a';g.fillRect(-s/2-1.3*k,-s/2-1.3*k,s+2.6*k,s+2.6*k);
 g.fillStyle='#a2a4a6';g.fillRect(-s/2,-s/2,s,s);g.fillStyle='#c2c4c6';g.fillRect(-s/2,-s/2,s,s*.3);g.fillStyle=r()<.5?'#d8b430':'#a2a4a6';g.fillRect(-s/2,s*.15,s,s*.12);g.restore()}
function barrel(g,x,y,s,r,k){k=k||1;const c=['#8a3a1a','#2a5a8a','#4a6a2a'][Math.floor(r()*3)];g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.arc(x+2*k,y+3*k,s,0,7);g.fill();
 g.fillStyle='#111';g.beginPath();g.arc(x,y,s+1.2*k,0,7);g.fill();g.fillStyle=c;g.beginPath();g.arc(x,y,s,0,7);g.fill();g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1*k;g.beginPath();g.arc(x,y,s*.65,0,7);g.stroke();g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.arc(x-s*.35,y-s*.35,s*.25,0,7);g.fill()}
function rubble(g,x,y,s,r,k){k=k||1;for(let i=0;i<7;i++){const px=x+(r()-.5)*s*1.4,py=y+(r()-.5)*s,q=s*(.2+r()*.25);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(px-q+2*k,py-q+2*k,2*q,2*q*.7);g.fillStyle=['#8a8c8e','#6a6c6e','#9a7a5a','#aaaaa8'][Math.floor(r()*4)];g.save();g.translate(px,py);g.rotate(r()*3);g.fillRect(-q,-q*.7,2*q,1.4*q);g.restore()}}
function deadTree(g,x,y,s,r,k){k=k||1;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+s*.3,y+s*.35,s*.7,s*.5,0,0,7);g.fill();deadBush(g,x,y,s,r,k,'#3e2c1c');g.fillStyle='#4a3420';g.beginPath();g.arc(x,y,s*.14,0,7);g.fill()}
// un élément de la couronne extérieure selon le terrain (null : laisser le sol visible)
// v159 : décors en plus par terrain (toits d'immeubles, trottoirs, flaques, champignons, congères…), toujours hors du centre des cases
function roofDeco(g,x,y,w,h,r,k,top){k=k||1;const c=[['#55575c','#6a6c72'],['#6a4c3c','#80604c'],['#3e5656','#527070'],['#5c5444','#746a56'],['#4a4a5a','#5e5e70']][Math.floor(r()*5)];
 if(!top){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(x+4*k,y+5*k,w,h)}g.fillStyle='#121314';g.fillRect(x-1.3*k,y-1.3*k,w+2.6*k,h+2.6*k);g.fillStyle=c[1];g.fillRect(x,y,w,h);
 g.fillStyle=c[0];g.fillRect(x+3*k,y+3*k,w-6*k,h-6*k);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x,y,w,1.5*k);g.fillRect(x,y,1.5*k,h);
 g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=.8*k;for(let i=x+10*k;i<x+w-4*k;i+=10*k){g.beginPath();g.moveTo(i,y+3*k);g.lineTo(i,y+h-3*k);g.stroke()}
 const n=1+Math.floor(r()*3);for(let i=0;i<n;i++){const bw=(6+r()*5)*k,bh=(5+r()*4)*k,bx=x+4*k+r()*Math.max(1,w-bw-8*k),by=y+4*k+r()*Math.max(1,h-bh-8*k);
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(bx+1.5*k,by+2*k,bw,bh);g.fillStyle='#1a1a1a';g.fillRect(bx-.8*k,by-.8*k,bw+1.6*k,bh+1.6*k);g.fillStyle='#a8acb0';g.fillRect(bx,by,bw,bh);g.fillStyle='#6a6e72';g.beginPath();g.arc(bx+bw/2,by+bh/2,Math.min(bw,bh)*.32,0,7);g.fill()}
 if(r()<.5){const vx=x+w*(.2+r()*.6),vy=y+h*(.2+r()*.6);g.fillStyle='#1a1a1a';g.beginPath();g.arc(vx,vy,3.2*k,0,7);g.fill();g.fillStyle='#8a8e92';g.beginPath();g.arc(vx,vy,2.2*k,0,7);g.fill()}
 if(r()<.35){const hx=x+w*(.25+r()*.5),hy=y+h*(.25+r()*.5),hr=(4+r()*4)*k;g.fillStyle='rgba(30,20,10,.5)';g.beginPath();g.arc(hx,hy,hr*1.5,0,7);g.fill();g.fillStyle='#0c0a08';g.beginPath();for(let i=0;i<9;i++){const a=i/9*6.28,d=hr*(.6+r()*.5);g.lineTo(hx+Math.cos(a)*d,hy+Math.sin(a)*d)}g.fill()}}
function lampPost(g,x,y,a,k){k=k||1;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+1.5*k,y+2*k,2.6*k,0,7);g.fill();g.strokeStyle='#202224';g.lineWidth=1.6*k;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*9*k,y+Math.sin(a)*9*k);g.stroke();
 g.fillStyle='#202224';g.beginPath();g.arc(x,y,2.2*k,0,7);g.fill();g.fillStyle='#f0e6b0';g.beginPath();g.ellipse(x+Math.cos(a)*9*k,y+Math.sin(a)*9*k,2.4*k,1.6*k,a,0,7);g.fill()}
function puddle(g,x,y,s,r,ice){g.fillStyle=ice?'rgba(170,210,240,.7)':'rgba(40,50,70,.45)';g.beginPath();g.ellipse(x,y,s,s*.6,r()*3,0,7);g.fill();g.fillStyle=ice?'rgba(255,255,255,.8)':'rgba(170,200,230,.35)';g.beginPath();g.ellipse(x-s*.3,y-s*.15,s*.4,s*.12,-.3,0,7);g.fill()}
function manhole(g,x,y){g.fillStyle='#1c1c1e';g.beginPath();g.arc(x,y,6.2,0,7);g.fill();g.fillStyle='#55575a';g.beginPath();g.arc(x,y,5,0,7);g.fill();g.strokeStyle='#3a3c3e';g.lineWidth=.8;for(let i=-3;i<=3;i+=2){g.beginPath();g.moveTo(x-4,y+i);g.lineTo(x+4,y+i);g.stroke()}}
function mushroom(g,x,y,r){for(let i=0;i<3;i++){const px=x+(r()-.5)*7,py=y+(r()-.5)*5,s=1.6+r()*1.4;g.fillStyle='rgba(20,30,10,.35)';g.beginPath();g.arc(px+.7,py+.9,s,0,7);g.fill();g.fillStyle='#b8341e';g.beginPath();g.arc(px,py,s,0,7);g.fill();g.fillStyle='#fff';g.fillRect(px-.6,py-.6,1,1)}}
function tumbleweed(g,x,y,s,r){g.strokeStyle='#8a6a3a';g.lineWidth=.8;for(let i=0;i<10;i++){g.beginPath();g.arc(x+(r()-.5)*s*.5,y+(r()-.5)*s*.5,s*(.4+r()*.5),r()*6,r()*6+2);g.stroke()}}
function skull(g,x,y){g.fillStyle='rgba(80,50,20,.3)';g.beginPath();g.ellipse(x+1,y+1.5,4,3,0,0,7);g.fill();g.fillStyle='#efe6d0';g.beginPath();g.ellipse(x,y,3.6,3,0,0,7);g.fill();g.fillRect(x-2,y+1.5,4,2.4);g.fillStyle='#3a2a1a';g.fillRect(x-2,y-.8,1.4,1.4);g.fillRect(x+.6,y-.8,1.4,1.4);
 g.strokeStyle='#efe6d0';g.lineWidth=1.3;g.beginPath();g.moveTo(x-9,y+5);g.lineTo(x-4,y+7);g.moveTo(x+5,y+6);g.lineTo(x+10,y+4);g.stroke()}
function pumpkin(g,x,y,s){g.fillStyle='rgba(40,20,5,.35)';g.beginPath();g.ellipse(x+1,y+1.5,s*1.2,s,0,0,7);g.fill();g.fillStyle='#5a2a08';g.beginPath();g.ellipse(x,y,s*1.2+1,s+1,0,0,7);g.fill();g.fillStyle='#e07a1c';g.beginPath();g.ellipse(x,y,s*1.2,s,0,0,7);g.fill();
 g.strokeStyle='#b0560e';g.lineWidth=.8;g.beginPath();g.ellipse(x,y,s*.5,s,0,0,7);g.stroke();g.fillStyle='#f4a040';g.beginPath();g.ellipse(x-s*.5,y-s*.4,s*.3,s*.2,0,0,7);g.fill();g.fillStyle='#3a5a1a';g.fillRect(x-.8,y-s-1.5,1.6,2.5)}
function hayBale(g,x,y,s,r){g.save();g.translate(x,y);g.rotate(r()*3);g.fillStyle='rgba(40,25,5,.4)';g.fillRect(-s+2,-s*.6+3,2*s,1.2*s);g.fillStyle='#4a3410';g.fillRect(-s-1,-s*.6-1,2*s+2,1.2*s+2);g.fillStyle='#d8b450';g.fillRect(-s,-s*.6,2*s,1.2*s);
 g.strokeStyle='#a8843a';g.lineWidth=.7;for(let i=-s+2;i<s;i+=2.5){g.beginPath();g.moveTo(i,-s*.6);g.lineTo(i+1,s*.6);g.stroke()}g.fillStyle='#7a5a20';g.fillRect(-s*.45,-s*.6,1.2,1.2*s);g.fillRect(s*.35,-s*.6,1.2,1.2*s);g.restore()}
function snowdrift(g,x,y,s,r){g.fillStyle='rgba(70,95,140,.18)';g.beginPath();g.ellipse(x+2,y+3,s*1.2,s*.55,0,0,7);g.fill();g.fillStyle='#f8fbff';g.beginPath();g.ellipse(x,y,s*1.2,s*.5,r()*.4-.2,0,7);g.fill();g.fillStyle='#ffffff';g.beginPath();g.ellipse(x-s*.3,y-s*.15,s*.6,s*.2,0,0,7);g.fill()}
function snowman(g,x,y){g.fillStyle='rgba(40,60,110,.3)';g.beginPath();g.ellipse(x+3,y+4,9,6,0,0,7);g.fill();[[0,2,7],[0,-6,5]].forEach(([dx,dy,s])=>{g.fillStyle='#8a9ab0';g.beginPath();g.arc(x+dx,y+dy,s+1,0,7);g.fill();g.fillStyle='#fdfeff';g.beginPath();g.arc(x+dx,y+dy,s,0,7);g.fill()});
 g.fillStyle='#e8782a';g.beginPath();g.moveTo(x,y-6);g.lineTo(x+5,y-5);g.lineTo(x,y-5);g.fill();g.fillStyle='#222';g.fillRect(x-2,y-8,1.2,1.2);g.fillRect(x+1,y-8,1.2,1.2);g.fillStyle='#b8342a';g.fillRect(x-5,y-2,10,2)}
function boulderBig(g,x,y,s,r,snowcap){rockDeco(g,x,y,s,r,['#7a7c78','#a4a69e','#5a5c58']);rockDeco(g,x+s*.7,y+s*.3,s*.6,r,['#84867f','#acaea6','#62645f']);if(snowcap){g.fillStyle='#f4f8fc';g.beginPath();g.ellipse(x-s*.2,y-s*.3,s*.6,s*.3,-.3,0,7);g.fill()}}
// ville : immeubles serrés le long des bords, trottoir et lampadaires côté terrain, passages piétons à l'entrée des routes
function buildCity(g,r,M,RW,k,W,H,cx,cy){k=k||1;W=W||L;H=H||L;cx=cx==null?M:cx;cy=cy==null?M:cy;const gap=(RW/2+10*k);
 const blocks=[];for(let y=-20*k;y<H;y+=(46+r()*10)*k){for(let x=-20*k;x<W;){const w=(34+r()*30)*k;blocks.push([x,y,w,(40+r()*8)*k]);x+=w+(r()<.3?10*k:3*k)}}
 return blocks.filter(([x,y,w,h])=>!(x<cx+gap&&x+w>cx-gap)&&!(y<cy+gap&&y+h>cy-gap))}
function cityRing(g,r,M,RW){const D=T-12;
 // immeubles dans la couronne
 const ringOK=(x,y,w,h)=>(y+h<=D||y>=L-D||x+w<=D||x>=L-D)&&!(x<M+RW/2+8&&x+w>M-RW/2-8)&&!(y<M+RW/2+8&&y+h>M-RW/2-8);
 const gs=M-RW/2-8,ge=M+RW/2+8,place=(horiz,lo,hi,fix0,fix1)=>{const dep=fix1-fix0;for(let p=lo;p<hi;){if(p>=gs&&p<ge){p=ge+2;continue}let b=Math.min(p+26+r()*30,hi);if(p<gs&&b>gs)b=gs-2;
   if(b-p>=8)BL.push(horiz?[p,fix0,b-p,dep]:[fix0,p,dep,b-p]);p=b+(r()<.35?8:3)}};
 const BL=[];place(true,-4,L+4,-4,D-6);place(true,-4,L+4,L-D+6,L+4);place(false,D+2,L-D-2,-4,D-6);place(false,D+2,L-D-2,L-D+6,L+4);
 PJ={cx:M,cy:M,H:620};BL.sort((a,b)=>Math.hypot(b[0]+b[2]/2-M,b[1]+b[3]/2-M)-Math.hypot(a[0]+a[2]/2-M,a[1]+a[3]/2-M)).forEach(([x,y,w,h])=>building3d(g,x,y,w,h,28+r()*34,r));
 // trottoir le long du terrain
 g.fillStyle='#8e8f8c';[[T-11,T-11,L-2*T+22,10],[T-11,L-T+1,L-2*T+22,10],[T-11,T-1,10,L-2*T+2],[L-T+1,T-1,10,L-2*T+2]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
 g.strokeStyle='rgba(40,40,40,.35)';g.lineWidth=.7;for(let i=T-11;i<L-T+11;i+=9){g.beginPath();g.moveTo(i,T-11);g.lineTo(i,T-1);g.moveTo(i,L-T+1);g.lineTo(i,L-T+11);g.moveTo(T-11,i);g.lineTo(T-1,i);g.moveTo(L-T+1,i);g.lineTo(L-T+11,i);g.stroke()}
 g.strokeStyle='#c4c5c2';g.lineWidth=1.2;g.strokeRect(T-1.5,T-1.5,L-2*T+3,L-2*T+3);
 // lampadaires et poubelles sur le trottoir (jamais devant les routes)
 for(let i=T+12;i<L-T;i+=T*1.5){if(Math.abs(i-M)<RW)continue;lampPost(g,i,T-6,Math.PI/2);lampPost(g,i,L-T+6,-Math.PI/2);lampPost(g,T-6,i,0);lampPost(g,L-T+6,i,Math.PI)}
 // passages piétons à l'entrée des routes
 g.fillStyle='rgba(235,235,225,.8)';for(let i=-RW/2+4;i<RW/2-3;i+=6){g.fillRect(M+i,T-14,3.4,12);g.fillRect(M+i,L-T+2,3.4,12);g.fillRect(T-14,M+i,12,3.4);g.fillRect(L-T+2,M+i,12,3.4)}
 // voitures abandonnées et gravats dans les ruelles
 for(let k=0;k<10;k++){const x=r()*L,y=r()*L;const inR=x<D||y<D||x>L-D||y>L-D;if(!inR||Math.abs(x-M)<RW/2+8||Math.abs(y-M)<RW/2+8)continue;r()<.5?rubble(g,x,y,7,r):barrel(g,x,y,3.5,r)}}
// v159 : relief (fausse 3D) des immeubles, cactus et rochers : caméra au-dessus de la maison, on voit les faces tournées vers le centre
let PJ={cx:L/2,cy:L/2,H:620};
function proj(x,y,z){const s=PJ.H/(PJ.H-z);return[PJ.cx+(x-PJ.cx)*s,PJ.cy+(y-PJ.cy)*s]}
function poly(g,pts,c){g.fillStyle=c;g.beginPath();pts.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();g.fill()}
const LIT=(nx,ny)=>.78+.22*(-nx*.7-ny*.7);// lumière venue du haut à gauche
function tone(c,f){const n=parseInt(c.slice(1),16),q=v=>Math.max(0,Math.min(255,Math.round(v*f)));return`rgb(${q(n>>16)},${q(n>>8&255)},${q(n&255)})`}
function building3d(g,x,y,w,h,z,r,k){k=k||1;const wall=['#8a8478','#7a6a5a','#6a7a7a','#8a7a64','#76768a','#9a8a7a'][Math.floor(r()*6)];
 const c=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],t=c.map(([a,b])=>proj(a,b,z));
 // ombre portée vers le bas à droite
 const sx=z*.45,sy=z*.55;g.fillStyle='rgba(0,0,0,.38)';g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.lineTo(x+w+sx,y+sy);g.lineTo(x+w+sx,y+h+sy);g.lineTo(x+sx,y+h+sy);g.lineTo(x,y+h);g.closePath();g.fill();
 const N=[[0,-1],[1,0],[0,1],[-1,0]];
 for(let i=0;i<4;i++){const j=(i+1)%4,[nx,ny]=N[i],mx=(c[i][0]+c[j][0])/2,my=(c[i][1]+c[j][1])/2;if(nx*(PJ.cx-mx)+ny*(PJ.cy-my)<=0)continue;
  const q=[c[i],c[j],t[j],t[i]];poly(g,q,'#141516');const f=LIT(nx,ny);poly(g,[[q[0][0]+(nx?0:.6*k),q[0][1]+(ny?0:.6*k)],q[1],q[2],q[3]],tone(wall,f));
  // étages et fenêtres
  const L2=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],P=(u,v)=>L2(L2(c[i],c[j],u),L2(t[i],t[j],u),v);
  const cols=Math.max(1,Math.floor(Math.hypot(c[j][0]-c[i][0],c[j][1]-c[i][1])/(9*k))),fl=Math.max(1,Math.round(z/(14*k)));
  for(let a=0;a<cols;a++)for(let b=0;b<fl;b++){const u0=(a+.25)/cols,u1=(a+.75)/cols,v0=(b+.3)/fl,v1=(b+.75)/fl,rv=r();
   poly(g,[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)],rv<.12?'#0a0a0c':rv<.2?'#e8c86a':tone('#3a4a5c',f*(.9+r()*.3)))}
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=.6*k;for(let b=1;b<fl;b++){const a1=P(0,b/fl),a2=P(1,b/fl);g.beginPath();g.moveTo(a1[0],a1[1]);g.lineTo(a2[0],a2[1]);g.stroke()}}
 const rx=Math.min(t[0][0],t[2][0]),ry=Math.min(t[0][1],t[2][1]);roofDeco(g,rx,ry,Math.abs(t[2][0]-t[0][0]),Math.abs(t[2][1]-t[0][1]),r,k,true)}
function cactus3d(g,x,y,s,r,k){k=k||1;const z=s*2.1,wd=s*.42;
 g.strokeStyle='rgba(90,50,20,.34)';g.lineCap='round';g.lineWidth=wd;g.beginPath();g.moveTo(x,y);g.lineTo(x+z*.5,y+z*.6);g.stroke();
 const px=1,py=0,side=r()<.5?1:-1;
 const limb=(pts,w)=>{const P=pts.map(([a,b,h])=>{const q=proj(a,b,h*.3);return[q[0],q[1]-h*.8]});const st=(c,lw)=>{g.strokeStyle=c;g.lineWidth=lw;g.beginPath();P.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.stroke()};
  st('#12280c',w+2.4*k);st('#3f7a2e',w);g.save();g.translate(-w*.22,-w*.22);st('#6aa84a',w*.45);g.restore();st('rgba(20,50,10,.35)',w*.12);return P};
 // bras gauche et droit puis le tronc
 limb([[x+px*side*s*.15,y+py*side*s*.15,z*.35],[x+px*side*s*.6,y+py*side*s*.6,z*.42],[x+px*side*s*.6,y+py*side*s*.6,z*.75]],wd*.7);
 if(r()<.7)limb([[x-px*side*s*.15,y-py*side*s*.15,z*.5],[x-px*side*s*.5,y-py*side*s*.5,z*.55],[x-px*side*s*.5,y-py*side*s*.5,z*.85]],wd*.62);
 const P=limb([[x,y,0],[x,y,z]],wd);const[tx,ty]=P[1];g.fillStyle='#f4d0e0';if(r()<.4){g.beginPath();g.arc(tx,ty,wd*.3,0,7);g.fill()}}
function rock3d(g,x,y,s,r,c,k){k=k||1;c=c||['#b0704a','#d49a6a','#8a5236'];const n=6+Math.floor(r()*3),z=s*(.6+r()*.5),base=[];
 for(let i=0;i<n;i++){const a=i/n*6.283+r()*.4,d=s*(.75+r()*.35);base.push([x+Math.cos(a)*d,y+Math.sin(a)*d*.85])}
 const top=base.map(([a,b])=>proj(x+(a-x)*.72,y+(b-y)*.72,z));
 g.fillStyle='rgba(90,50,20,.34)';g.beginPath();base.forEach(([a,b],i)=>{const q=[a+z*.5,b+z*.6];i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])});g.closePath();g.fill();poly(g,base,'rgba(90,50,20,.3)');
 poly(g,base,'#2a1a10');
 for(let i=0;i<n;i++){const j=(i+1)%n,ex=base[j][0]-base[i][0],ey=base[j][1]-base[i][1],el=Math.hypot(ex,ey)||1,nx=ey/el,ny=-ex/el,mx=(base[i][0]+base[j][0])/2,my=(base[i][1]+base[j][1])/2;
  const out=nx*(mx-x)+ny*(my-y)>0?1:-1;if(out*(nx*(PJ.cx-mx)+ny*(PJ.cy-my))<=0&&nx*(top[i][0]-base[i][0])*out+ny*(top[i][1]-base[i][1])*out<=0)continue;
  poly(g,[base[i],base[j],top[j],top[i]],tone(c[2],LIT(nx*out,ny*out)*1.1))}
 g.strokeStyle='rgba(40,20,10,.35)';g.lineWidth=.7*k;for(let i=0;i<n;i+=2){g.beginPath();g.moveTo(base[i][0],base[i][1]);g.lineTo(top[i][0],top[i][1]);g.stroke()}
 poly(g,top,'#2a1a10');const tc=top.map(([a,b])=>[a,b]);poly(g,tc.map(([a,b])=>{const cx=tc.reduce((s,p)=>s+p[0],0)/n,cy=tc.reduce((s,p)=>s+p[1],0)/n;return[cx+(a-cx)*.93,cy+(b-cy)*.93]}),c[0]);
 const cx=tc.reduce((s,p)=>s+p[0],0)/n,cy=tc.reduce((s,p)=>s+p[1],0)/n;g.fillStyle=c[1];g.beginPath();g.ellipse(cx-s*.2,cy-s*.2,s*.35,s*.2,-.5,0,7);g.fill()}
function ringItem(g,B,x,y,s,r,k){const f=B.flora,v=r();
 if(f==='leaf')return leafTree(g,x,y,s,r,k,B.tc);
 if(f==='pine'){if(v<.66)return pineTree(g,x,y,s,r,k,false);if(v<.8)return boulderBig(g,x,y,s*.6,r,r()<.4);if(v<.95)return rockDeco(g,x,y,s*.55,r);return}
 if(f==='snowpine'){if(v<.12)return snowdrift(g,x,y,s*.7,r);if(v<.85)return pineTree(g,x,y,s,r,k,true);return rockDeco(g,x,y,s*.4,r,['#9aa2ac','#f4f8fc','#7a828c'])}
 if(f==='desert'){if(v<.16)return cactus3d(g,x,y,s*.8,r,k);if(v<.34)return deadBush(g,x,y,s*.6,r,k);if(v<.5)return rock3d(g,x,y,s*.75,r,null,k);if(v<.6)return tumbleweed(g,x,y,s*.45,r);return}
 if(f==='urban'){if(v<.12)return carWreck(g,x,y,s*.9,r,k);if(v<.27)return concreteBlock(g,x,y,s*.7,r,k);if(v<.37)return barrel(g,x,y,s*.35,r,k);if(v<.57)return rubble(g,x,y,s*.8,r,k);if(v<.65)return deadTree(g,x,y,s*.8,r,k);return}}
function dirtRoad(g,x1,y1,x2,y2,w,r,k,R){k=k||1;R=R||BIO.foret.road;const len=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/len,uy=(y2-y1)/len,st=3*k;
 const pass=(c,rad,j)=>{g.fillStyle=c;for(let d=0;d<=len;d+=st){const o=(r()-.5)*j;g.beginPath();g.arc(x1+ux*d-uy*o,y1+uy*d+ux*o,rad*(.9+r()*.2),0,7);g.fill()}};
 pass(R.edge,w/2+2*k,3*k);pass(R.fill,w/2,2.5*k);
 for(let i=0;i<len*w/(14*k*k);i++){const d=r()*len,o=(r()-.5)*w*.85;g.fillStyle=R.sp[Math.floor(r()*3)];g.globalAlpha=.7;g.fillRect(x1+ux*d-uy*o,y1+uy*d+ux*o,(1+r()*2)*k,(1+r()*2)*k)}g.globalAlpha=1;
 if(R.rut){g.strokeStyle=R.rut;g.lineWidth=2.4*k;g.beginPath();[-.2,.2].forEach(f=>{g.moveTo(x1-uy*w*f,y1+ux*w*f);g.lineTo(x2-uy*w*f,y2+ux*w*f)});g.stroke()}
 if(R.dash){g.strokeStyle=R.dash;g.globalAlpha=.75;g.lineWidth=2.2*k;g.setLineDash([9*k,8*k]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.setLineDash([]);g.globalAlpha=1;
  // fissures dans le bitume
  g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.8*k;for(let i=0;i<len/(30*k);i++){const d=r()*len,o=(r()-.5)*w*.7;let x=x1+ux*d-uy*o,y=y1+uy*d+ux*o;g.beginPath();g.moveTo(x,y);for(let j=0;j<4;j++){x+=(r()-.5)*8*k;y+=(r()-.5)*8*k;g.lineTo(x,y)}g.stroke()}}
 for(let i=0;i<len/(9*k);i++){const d=r()*len,o=(r()-.5)*w*.8,x=x1+ux*d-uy*o,y=y1+uy*d+ux*o;g.fillStyle=R.peb;g.beginPath();g.ellipse(x,y,(1+r()*1.6)*k,(.8+r()*1.1)*k,r()*3,0,7);g.fill()}
 // touffes (herbe, neige, sable) qui débordent sur les bords
 g.lineWidth=1.1*k;for(let i=0;i<len/(2.2*k);i++){const d=r()*len,s=r()<.5?-1:1,o=s*(w/2+(r()-.6)*4*k),x=x1+ux*d-uy*o,y=y1+uy*d+ux*o;g.strokeStyle=R.grass[r()<.5?0:1];g.beginPath();g.moveTo(x,y);g.lineTo(x-1.8*k,y-3.5*k);g.moveTo(x,y);g.lineTo(x+1.6*k,y-3.8*k);g.stroke()}}
function drawWoods(force){const w=$('#woods');if(!w)return;const W=w.clientWidth,H=w.clientHeight;if(!W||!H||getComputedStyle(w).display==='none')return;
 const d=Math.min(2,devicePixelRatio||1);if(force!==true&&w.width===Math.round(W*d)&&w.height===Math.round(H*d)&&w.dataset.b===BIOME)return;w.width=Math.round(W*d);w.height=Math.round(H*d);w.dataset.b=BIOME;
 const B=BIO[BIOME]||BIO.foret,g=w.getContext('2d');g.scale(d,d);const r=rng(23),m=cv.getBoundingClientRect(),o=w.getBoundingClientRect(),k=m.width/L,cx=m.left-o.left+m.width/2,cy=m.top-o.top+m.height/2;
 g.fillStyle=B.ring;g.fillRect(0,0,W,H);for(let i=0;i<W*H/80;i++){g.fillStyle=B.rsp[Math.floor(r()*3)];g.globalAlpha=.6;g.fillRect(r()*W,r()*H,1+r()*2*k,1+r()*2*k)}g.globalAlpha=1;
 // les routes continuent hors du plateau
 dirtRoad(g,0,cy,W,cy,40*k,r,k,B.road);dirtRoad(g,cx,0,cx,H,40*k,r,k,B.road);
 const off=(x,y,m)=>Math.abs(y-cy)<20*k+m||Math.abs(x-cx)<20*k+m,step=20*k,tr=[];
 if(B.flora==='leaf'||B.flora==='pine')for(let n=0;n<W*H/(step*step*6);n++){const x=r()*W,y=r()*H;if(!off(x,y,8*k))r()<.5?rockDeco(g,x,y,(4+r()*4)*k,r):logDeco(g,x,y,(20+r()*12)*k,6*k,r()*3)}
 for(let y=-step;y<H+step;y+=step)for(let x=-step;x<W+step;x+=step){const px=x+(r()-.5)*step,py=y+(r()-.5)*step,sz=(12+r()*12)*k;if(off(px,py,sz*.7))continue;if(r()<.85)tr.push([px,py,sz])}
 if(B.flora==='urban'){PJ={cx,cy,H:620*k};buildCity(g,r,0,40*k,k,W,H,cx,cy).forEach(([x,y,bw,bh])=>{const mr=m.left-o.left,mt=m.top-o.top;if(x+bw>mr-12*k&&x<mr+m.width+12*k&&y+bh>mt-12*k&&y<mt+m.height+12*k)return;building3d(g,x,y,bw,bh,(28+r()*34)*k,r,k)})}
 else{PJ={cx,cy,H:620*k};if(B.flora==='desert')tr.sort((a,b)=>Math.hypot(b[0]-cx,b[1]-cy)-Math.hypot(a[0]-cx,a[1]-cy));else tr.sort((a,b)=>a[1]-b[1]);tr.forEach(([x,y,sz])=>ringItem(g,B,x,y,sz,r,k))}
 g.fillStyle='rgba(8,14,6,.18)';g.fillRect(0,0,W,H)}
addEventListener('resize',()=>setTimeout(drawWoods,60));
/* ground, pre-rendered once per terrain */
const MIDN=(Z.N-1)/2;
const ground=document.createElement('canvas');ground.width=ground.height=L*2;
function setBiome(b){b=BIO[b]?b:'foret';if(b===BIOME&&setBiome.done)return;BIOME=b;setBiome.done=1;buildGround(BIO[b]);setTimeout(()=>drawWoods(true),0)}
function buildGround(B){const g=ground.getContext('2d');g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,L,L);const r=rng(11),RW=40,M=L/2;
 const onRoad=(x,y,m)=>Math.abs(x-M)<RW/2+m||Math.abs(y-M)<RW/2+m;
 // couronne extérieure (forêt, dunes, ruines…)
 g.fillStyle=B.ring;g.fillRect(0,0,L,L);for(let k=0;k<900;k++){g.fillStyle=B.rsp[Math.floor(r()*3)];g.globalAlpha=.6;g.fillRect(r()*L,r()*L,1+r()*3,1+r()*3)}g.globalAlpha=1;
 if(B.flora==='desert')for(let k=0;k<40;k++){g.fillStyle=r()<.5?'rgba(255,235,190,.16)':'rgba(120,70,30,.14)';g.beginPath();g.ellipse(r()*L,r()*L,14+r()*22,5+r()*7,r()*.6-.3,0,7);g.fill()}
 // cases en damier, avec un léger relief (bord clair en haut, sombre en bas)
 g.fillStyle=B.gap;g.fillRect(T,T,L-2*T,L-2*T);
 for(let rr=1;rr<Z.N-1;rr++)for(let c=1;c<Z.N-1;c++){const x=c*T,y=rr*T,base=B.cell[(rr+c)%2];g.fillStyle=base;g.fillRect(x+1,y+1,T-2,T-2);const v=r();g.fillStyle=v<.5?`rgba(20,30,10,${(.5-v)*.14})`:`rgba(255,250,220,${(v-.5)*.1})`;g.fillRect(x+1,y+1,T-2,T-2);
  g.fillStyle=B.hi;g.fillRect(x+1,y+1,T-2,2);g.fillRect(x+1,y+1,2,T-2);g.fillStyle=B.lo;g.fillRect(x+1,y+T-3,T-2,2);g.fillRect(x+T-3,y+1,2,T-2)}
 for(let k=0;k<46;k++){const x=T+r()*(L-2*T),y=T+r()*(L-2*T);g.fillStyle=r()<.6?B.patch[0]:B.patch[1];g.beginPath();g.ellipse(x,y,8+r()*16,5+r()*10,r()*3,0,7);g.fill()}
 if(B.blades){g.lineWidth=1;for(let k=0;k<1500;k++){const x=T+r()*(L-2*T),y=T+3+r()*(L-2*T-3);g.strokeStyle=B.blades[Math.floor(r()*4)];g.globalAlpha=.7;g.beginPath();g.moveTo(x,y);g.lineTo(x-1.3,y-3);g.moveTo(x,y);g.lineTo(x+1.2,y-3.2);g.stroke()}g.globalAlpha=1}
 else for(let k=0;k<1100;k++){g.fillStyle=B.rsp[Math.floor(r()*3)];g.globalAlpha=.35;g.fillRect(T+r()*(L-2*T),T+r()*(L-2*T),1+r()*1.5,1+r()*1.5)}g.globalAlpha=1;
 if(B.deco==='desert'){g.strokeStyle='rgba(150,105,50,.22)';g.lineWidth=1.2;for(let k=0;k<60;k++){const x=T+r()*(L-2*T),y=T+r()*(L-2*T);g.beginPath();g.moveTo(x-8,y);g.quadraticCurveTo(x,y-3,x+8,y);g.stroke()}}
 // routes jusqu'à la maison
 dirtRoad(g,M,-6,M,L+6,RW,r,1,B.road);dirtRoad(g,-6,M,L+6,M,RW,r,1,B.road);
 g.strokeStyle=B.grid;g.lineWidth=1.4;for(let i=1;i<Z.N-1;i++){g.beginPath();g.moveTo(i*T,M-RW/2);g.lineTo(i*T,M+RW/2);g.moveTo(M-RW/2,i*T);g.lineTo(M+RW/2,i*T);g.stroke()}
 g.beginPath();g.moveTo(T,MIDN*T);g.lineTo(L-T,MIDN*T);g.moveTo(T,(MIDN+1)*T);g.lineTo(L-T,(MIDN+1)*T);g.moveTo(MIDN*T,T);g.lineTo(MIDN*T,L-T);g.moveTo((MIDN+1)*T,T);g.lineTo((MIDN+1)*T,L-T);g.stroke();
 // petits décors loin du centre des cases, pour ne pas gêner la lecture
 const free=(x,y)=>{const cx=(Math.floor(x/T)+.5)*T,cy=(Math.floor(y/T)+.5)*T;return Math.hypot(x-cx,y-cy)>17&&!onRoad(x,y,2)&&x>T+4&&y>T+4&&x<L-T-4&&y<L-T-4};
 const flower=(x,y,pc)=>{for(let p=0;p<5;p++){const a=p*1.2566;g.fillStyle='rgba(20,40,10,.35)';g.beginPath();g.arc(x+Math.cos(a)*1.8+.6,y+Math.sin(a)*1.8+.8,1.4,0,7);g.fill();g.fillStyle=pc;g.beginPath();g.arc(x+Math.cos(a)*1.8,y+Math.sin(a)*1.8,1.4,0,7);g.fill()}g.fillStyle='#e0a21e';g.beginPath();g.arc(x,y,1.1,0,7);g.fill()};
 const leaf=(x,y,c)=>{g.save();g.translate(x,y);g.rotate(r()*6.3);g.fillStyle='rgba(40,20,5,.3)';g.beginPath();g.ellipse(.8,1,3,1.6,0,0,7);g.fill();g.fillStyle=c;g.beginPath();g.ellipse(0,0,3,1.6,0,0,7);g.fill();g.strokeStyle='rgba(60,25,5,.5)';g.lineWidth=.5;g.beginPath();g.moveTo(-3,0);g.lineTo(3,0);g.stroke();g.restore()};
 const tuft=(x,y)=>{g.lineWidth=1.3;for(let b=0;b<6;b++){g.strokeStyle=B.tufts[b%2];g.beginPath();g.moveTo(x,y);g.lineTo(x+(b-2.5)*1.6,y-4-r()*3);g.stroke()}};
 for(let k=0;k<90;k++){const x=r()*L,y=r()*L;if(!free(x,y))continue;const d=B.deco;
  if(d==='flowers'||d==='mountain')flower(x,y,B.flowers[Math.floor(r()*B.flowers.length)]);
  else if(d==='leaves'){for(let i=0;i<3;i++)leaf(x+(r()-.5)*10,y+(r()-.5)*10,B.flowers[Math.floor(r()*B.flowers.length)])}
  else if(d==='snow'){if(r()<.5){g.fillStyle='rgba(90,110,150,.28)';for(let i=0;i<4;i++){g.beginPath();g.ellipse(x+i*5,y+(i%2)*4,1.4,2.2,.3,0,7);g.fill()}}else{g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.arc(x,y,1,0,7);g.fill()}}
  else if(d==='desert'){if(r()<.3)deadBush(g,x,y,4,r);else{g.fillStyle='#9a7448';g.beginPath();g.ellipse(x,y,1.4,1,0,0,7);g.fill()}}
  else if(d==='urban'){const q=r();if(q<.3){g.fillStyle='rgba(15,15,20,.3)';g.beginPath();g.ellipse(x,y,5+r()*5,3+r()*3,r()*3,0,7);g.fill()}else if(q<.6){g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=.8;let px=x,py=y;g.beginPath();g.moveTo(px,py);for(let j=0;j<5;j++){px+=(r()-.5)*10;py+=(r()-.5)*10;g.lineTo(px,py)}g.stroke()}else if(q<.8)tuft(x,y);else{g.fillStyle=['#c8c0a8','#a84a3a','#4a7aa8'][Math.floor(r()*3)];g.save();g.translate(x,y);g.rotate(r()*3);g.fillRect(-2.5,-1.5,5,3);g.restore()}}}
 if(B.deco!=='urban')for(let k=0;k<40;k++){const x=r()*L,y=r()*L;if(!free(x,y))continue;B.deco==='snow'?deadBush(g,x,y,3,r,1,'#6a5a4a'):tuft(x,y)}
 const rockC=B.flora==='desert'?['#b0704a','#d49a6a','#8a5236']:B.deco==='snow'?['#9aa2ac','#f4f8fc','#7a828c']:null;
 for(let k=0;k<(B.deco==='mountain'?34:16);k++){const x=r()*L,y=r()*L;if(free(x,y))rockDeco(g,x,y,2+r()*(B.deco==='mountain'?3.5:2),r,rockC)}
 if(B.flora==='leaf'||B.flora==='pine')for(let k=0;k<7;k++){const x=r()*L,y=r()*L;if(!free(x,y))continue;g.save();g.translate(x,y);g.rotate(r()*3);g.fillStyle='#2b1c10';g.fillRect(-9.5,-2.5,19,5);g.fillStyle='#8a6640';g.fillRect(-8.5,-1.5,17,3);g.fillStyle='#a37b4d';g.fillRect(-8.5,-1.5,17,1);g.restore()}
 // v159 : décors en plus selon le terrain
 const corners=[];for(let rr=2;rr<Z.N-1;rr++)for(let c=2;c<Z.N-1;c++){const x=c*T,y=rr*T;if(!onRoad(x,y,6))corners.push([x,y])}
 const pick=()=>corners.splice(Math.floor(r()*corners.length),1)[0]||[T*2,T*2],spot=()=>{for(let i=0;i<20;i++){const x=r()*L,y=r()*L;if(free(x,y))return[x,y]}return null};
 const D=B.deco;
 if(D==='urban'){const cells=[];for(let rr=1;rr<Z.N-1;rr++)for(let c=1;c<Z.N-1;c++)if(rr!==MIDN&&c!==MIDN)cells.push([c,rr]);
  for(let i=0;i<9;i++){const [c,rr]=cells.splice(Math.floor(r()*cells.length),1)[0],x=c*T,y=rr*T;g.strokeStyle='rgba(235,235,220,.55)';g.lineWidth=2;g.beginPath();
   if(r()<.5){g.moveTo(x+6,y+5);g.lineTo(x+6,y+T-5);g.moveTo(x+T-6,y+5);g.lineTo(x+T-6,y+T-5)}else{g.moveTo(x+5,y+6);g.lineTo(x+T-5,y+6);g.moveTo(x+5,y+T-6);g.lineTo(x+T-5,y+T-6)}g.stroke()}
  for(let i=0;i<5;i++){const [x,y]=pick();manhole(g,x,y)}
  for(let i=0;i<9;i++){const q=spot();if(q)puddle(g,q[0],q[1],5+r()*5,r)}
  for(let i=0;i<14;i++){const q=spot();if(!q)continue;const[x,y]=q;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x+1,y+1.5,4,3,0,0,7);g.fill();g.fillStyle=r()<.5?'#1e1e22':'#3a4a2a';g.beginPath();g.ellipse(x,y,3.6,2.8,0,0,7);g.fill();g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.arc(x-1,y-1,1,0,7);g.fill()}
  for(let i=0;i<20;i++){const q=spot();if(!q)continue;g.fillStyle='rgba(220,240,255,.8)';g.fillRect(q[0],q[1],1.2,1.2);g.fillRect(q[0]+3,q[1]+1,1,1)}}
 if(D==='flowers'){for(let i=0;i<8;i++){const q=spot();if(q)mushroom(g,q[0],q[1],r)}for(let i=0;i<4;i++){const q=spot();if(q)puddle(g,q[0],q[1],5+r()*3,r)}}
 if(D==='leaves'){for(let i=0;i<5;i++){const [x,y]=pick();pumpkin(g,x+(r()-.5)*8,y+(r()-.5)*8,4+r()*2)}for(let i=0;i<2;i++){const [x,y]=pick();hayBale(g,x,y,7,r)}for(let i=0;i<6;i++){const q=spot();if(q)mushroom(g,q[0],q[1],r)}}
 if(D==='snow'){for(let i=0;i<6;i++){const [x,y]=pick();puddle(g,x,y,7+r()*5,r,true)}for(let i=0;i<8;i++){const q=spot();if(q)snowdrift(g,q[0],q[1],4+r()*3,r)}}
 if(D==='desert'){for(let i=0;i<3;i++){const [x,y]=pick();skull(g,x,y)}for(let i=0;i<6;i++){const q=spot();if(q)tumbleweed(g,q[0],q[1],5+r()*2,r)}}
 if(D==='mountain'){for(let i=0;i<5;i++){const [x,y]=pick();rockDeco(g,x,y,4+r()*2,r)}for(let i=0;i<60;i++){const q=spot();if(q){g.fillStyle=r()<.5?'#8a8c86':'#6a6c66';g.fillRect(q[0],q[1],1.6,1.2)}}}
 // ombre de la couronne sur le bord du terrain (profondeur)
 const sh=(x0,y0,x1,y1,x,y,w,h)=>{const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,`rgba(${B.shadow},.42)`);gr.addColorStop(1,`rgba(${B.shadow},0)`);g.fillStyle=gr;g.fillRect(x,y,w,h)};
 sh(0,T,0,T+16,T,T,L-2*T,16);sh(0,L-T,0,L-T-12,T,L-T-12,L-2*T,12);sh(T,0,T+14,0,T,T,14,L-2*T);sh(L-T,0,L-T-14,0,L-T-14,T,14,L-2*T);
 const inRing=(x,y)=>x<T*.95||y<T*.95||x>L-T*.95||y>L-T*.95;
 if(B.flora==='leaf'||B.flora==='pine')for(let k=0;k<22;k++){const x=r()*L,y=r()*L;if(!inRing(x,y)||onRoad(x,y,8))continue;r()<.5?rockDeco(g,x,y,4+r()*4,r):logDeco(g,x,y,22+r()*14,7,r()*3)}
 if(B.flora==='urban')cityRing(g,r,M,RW);else{const trees=[],st=17;for(let y=-st/2;y<L+st;y+=st)for(let x=-st/2;x<L+st;x+=st){const px=x+(r()-.5)*st,py=y+(r()-.5)*st,sz=11+r()*11;
  if(!(px<T*.9||py<T*.9||px>L-T*.9||py>L-T*.9)||onRoad(px,py,sz*.7)||r()<.12)continue;trees.push([px,py,sz])}
 PJ={cx:M,cy:M,H:620};trees.sort(B.flora==='desert'?(a,b)=>Math.hypot(b[0]-M,b[1]-M)-Math.hypot(a[0]-M,a[1]-M):(a,b)=>a[1]-b[1]).forEach(([x,y,s])=>ringItem(g,B,x,y,s,r,1))}
 if(B.flora==='snowpine')snowman(g,T*.55,L-T*.5);
 if(B.flora==='leaf'||B.flora==='pine')for(let k=0;k<12;k++){const x=r()*L,y=r()*L;if(!inRing(x,y)||onRoad(x,y,8))continue;r()<.6?rockDeco(g,x,y,4+r()*4,r):logDeco(g,x,y,20+r()*12,6,r()*3)}
 try{boardEdge(g,B,r)}catch(e){}
}
/* v162 : contour du plateau. Clôture ouverte aux 4 routes (le joueur voit par où entrent les zombies),
   matière selon le terrain, puis cadre en planches clouées en relief (style barricade). Décor seulement. */
const FRAME_W=17,FRAME_H=7;
function boardEdge(g,B,r){const M=L/2,GAP=27,a=T,b=L-T;
 const segs=[];[[a,a,b,a,0],[a,b,b,b,0],[a,a,a,b,1],[b,a,b,b,1]].forEach(([x1,y1,x2,y2,v])=>{if(!v)segs.push([x1,y1,M-GAP,y2],[M+GAP,y1,x2,y2]);else segs.push([x1,y1,x2,M-GAP],[x1,M+GAP,x2,y2])});
 const along=(s,step,f)=>{const n=Math.max(1,Math.round(Math.hypot(s[2]-s[0],s[3]-s[1])/step));for(let i=0;i<=n;i++)f(s[0]+(s[2]-s[0])*i/n,s[1]+(s[3]-s[1])*i/n,i,n)};
 const ln=(x1,y1,x2,y2,c,w)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};
 const box=(x,y,s,c1,c2,c3)=>{g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-s/2+2,y-s/2+3,s,s);g.fillStyle=c1;g.fillRect(x-s/2-1,y-s/2-1,s+2,s+2);g.fillStyle=c2;g.fillRect(x-s/2,y-s/2,s,s);g.fillStyle=c3;g.fillRect(x-s/2,y-s/2,s,s*.4)};
 const gates=[[M-GAP,a,0,-1],[M+GAP,a,0,-1],[M-GAP,b,0,1],[M+GAP,b,0,1],[a,M-GAP,-1,0],[a,M+GAP,-1,0],[b,M-GAP,1,0],[b,M+GAP,1,0]];
 const cone=(x,y)=>{g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.arc(x+2,y+3,5,0,7);g.fill();[[5.5,'#1a1a1a'],[4.6,'#ff7a1a'],[2.8,'#fff'],[1.4,'#ff7a1a']].forEach(([rr,c])=>{g.fillStyle=c;g.beginPath();g.arc(x,y,rr,0,7);g.fill()})};
 g.save();g.lineCap='round';const F=B.flora;
 if(F==='leaf'){// piquets et lisses en bois, portails ouverts vers la forêt
  segs.forEach(s=>{ln(s[0]+2,s[1]+3,s[2]+2,s[3]+3,'rgba(0,0,0,.3)',8);ln(s[0],s[1],s[2],s[3],'#3a2412',8);ln(s[0],s[1],s[2],s[3],'#9a6a3a',5.5);ln(s[0],s[1]-1.2,s[2],s[3]-1.2,'#c99a62',1.6)});
  segs.forEach(s=>along(s,18,(x,y)=>box(x,y,9,'#2a1608','#7a4e28','#b07a46')));
  gates.forEach(([x,y,ox,oy],k)=>{const sg=k%2?1:-1,ex=x+ox*14-(oy?sg:0)*6,ey=y+oy*14-(ox?sg:0)*6;ln(x+2,y+3,ex+2,ey+3,'rgba(0,0,0,.3)',5);ln(x,y,ex,ey,'#3a2412',5);ln(x,y,ex,ey,'#a87440',3);box(x,y,12,'#2a1608','#6a4020','#a8743e')})}
 else if(F==='snowpine'){// grillage, poteaux coiffés de neige
  segs.forEach(s=>{ln(s[0]+2,s[1]+3,s[2]+2,s[3]+3,'rgba(30,45,70,.3)',6);ln(s[0],s[1],s[2],s[3],'#2c333b',6);g.save();g.setLineDash([2,2]);ln(s[0],s[1],s[2],s[3],'#8a949e',4);g.restore();ln(s[0],s[1]-1.5,s[2],s[3]-1.5,'rgba(255,255,255,.75)',1.2)});
  segs.forEach(s=>along(s,22,(x,y)=>{box(x,y,7,'#22282e','#5a646e','#9aa4ae');g.fillStyle='#fff';g.beginPath();g.ellipse(x,y-1,4.5,3,0,0,7);g.fill()}));gates.forEach(([x,y])=>{box(x,y,10,'#22282e','#5a646e','#fff');g.fillStyle='#fff';g.beginPath();g.ellipse(x,y-1,5.5,3.5,0,0,7);g.fill()})}
 else if(F==='desert'){// barbelés sur piquets
  segs.forEach(s=>{const v=s[0]===s[2];for(const d of[-2.5,2.5]){const ox=v?d:0,oy=v?0:d;ln(s[0]+ox+1,s[1]+oy+2,s[2]+ox+1,s[3]+oy+2,'rgba(60,30,10,.35)',1.6);ln(s[0]+ox,s[1]+oy,s[2]+ox,s[3]+oy,'#2e2a26',1.6);
   along(s,5,(x,y)=>{ln(x+ox-2,y+oy-2,x+ox+2,y+oy+2,'#1e1a16',1);ln(x+ox-2,y+oy+2,x+ox+2,y+oy-2,'#1e1a16',1)})}});
  segs.forEach(s=>along(s,26,(x,y)=>box(x,y,7,'#2a1608','#6a4a28','#9a7a4e')));gates.forEach(([x,y])=>box(x,y,10,'#2a1608','#5a3a20','#9a7a4e'))}
 else if(F==='urban'){// barrières de chantier, cônes aux routes
  segs.forEach(s=>along(s,26,(x,y,i,n)=>{if(i<n){const nx=s[0]+(s[2]-s[0])*(i+1)/n,ny=s[1]+(s[3]-s[1])*(i+1)/n;ln(x+2,y+3,nx+2,ny+3,'rgba(0,0,0,.35)',4);ln(x,y,nx,ny,'#2a2e33',4);g.save();g.setLineDash([1.5,1.5]);ln(x,y,nx,ny,'#c8ced4',2.4);g.restore()}
   g.fillStyle='#222';g.fillRect(x-4,y-3,8,6);g.fillStyle='#8a8f94';g.fillRect(x-3.5,y-2.5,7,5);g.fillStyle='#a8adb2';g.fillRect(x-3.5,y-2.5,7,2)}));
  gates.forEach(([x,y,ox,oy])=>cone(x+ox*9,y+oy*9))}
 else{// muret de pierres sèches
  segs.forEach(s=>along(s,6.5,(x,y)=>{const rx=3.2+r()*1.6,ry=2.6+r()*1.4,c=['#8a8c86','#a2a49c','#74766f'][Math.floor(r()*3)],ro=r();g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x+1.5,y+2.5,rx,ry,0,0,7);g.fill();g.fillStyle='#3c3d39';g.beginPath();g.ellipse(x,y,rx+1,ry+1,ro,0,7);g.fill();g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,ro,0,7);g.fill();g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(x-1,y-1,rx*.5,ry*.4,0,0,7);g.fill()}))}
 g.restore();g.save();boardFrame(g,r);g.restore()}
function boardFrame(g,r){const w=FRAME_W,h=FRAME_H,o=w+h;
 // ombre du cadre sur le plateau (lumière en haut à gauche)
 const sh=(a,b,c,d,x,y,ww,hh,k)=>{const gr=g.createLinearGradient(a,b,c,d);gr.addColorStop(0,`rgba(10,5,0,${k})`);gr.addColorStop(1,'rgba(10,5,0,0)');g.fillStyle=gr;g.fillRect(x,y,ww,hh)};
 sh(0,o,0,o+18,o,o,L-2*o,18,.55);sh(o,0,o+16,0,o,o,16,L-2*o,.5);sh(0,L-o,0,L-o-7,o,L-o-7,L-2*o,7,.3);sh(L-o,0,L-o-7,0,L-o-7,o,7,L-2*o,.3);
 // épaisseur du bois : faces intérieures, sombres côté haut et gauche
 const P={n:[[w,w],[L-w,w],[L-w-h,w+h],[w+h,w+h],'#4a2c14',1],w:[[w,w],[w,L-w],[w+h,L-w-h],[w+h,w+h],'#5a361a',0],s:[[w,L-w],[L-w,L-w],[L-w-h,L-w-h],[w+h,L-w-h],'#a87444',1],e:[[L-w,w],[L-w,L-w],[L-w-h,L-w-h],[L-w-h,w+h],'#8e5e34',0]};
 for(const k in P){const q=P[k];g.beginPath();for(let i=0;i<4;i++)i?g.lineTo(...q[i]):g.moveTo(...q[i]);g.closePath();g.fillStyle=q[4];g.fill();g.save();g.clip();g.strokeStyle='rgba(40,20,5,.35)';g.lineWidth=.6;
  for(let i=0;i<5;i++){const t=r()*h;g.beginPath();if(q[5]){const y=k==='n'?w+t:L-w-t;g.moveTo(0,y);g.lineTo(L,y)}else{const x=k==='w'?w+t:L-w-t;g.moveTo(x,0);g.lineTo(x,L)}g.stroke()}g.restore();g.strokeStyle='#24140a';g.lineWidth=1;g.stroke()}
 const plank=(x,y,pw,ph,hor,lift)=>{const c=['#a8743f','#9a6838','#b4824c','#8e5e32'][Math.floor(r()*4)];lift=lift||0;
  g.fillStyle='rgba(0,0,0,.45)';g.fillRect(x+2+lift,y+3+lift,pw,ph);g.fillStyle='#5a361a';g.fillRect(x+1,y+2,pw,ph);
  g.fillStyle='#24140a';g.fillRect(x-1,y-1,pw+2,ph+2);g.fillStyle=c;g.fillRect(x,y,pw,ph);
  const gr=hor?g.createLinearGradient(0,y,0,y+ph):g.createLinearGradient(x,0,x+pw,0);gr.addColorStop(0,'rgba(255,230,180,.35)');gr.addColorStop(.25,'rgba(255,230,180,0)');gr.addColorStop(.8,'rgba(30,15,0,0)');gr.addColorStop(1,'rgba(30,15,0,.35)');g.fillStyle=gr;g.fillRect(x,y,pw,ph);
  g.strokeStyle='rgba(60,30,10,.45)';g.lineWidth=.7;for(let k=0;k<5;k++){g.beginPath();if(hor){const yy=y+2+r()*(ph-4);g.moveTo(x,yy);g.bezierCurveTo(x+pw*.3,yy+r()*2-1,x+pw*.7,yy+r()*2-1,x+pw,yy)}else{const xx=x+2+r()*(pw-4);g.moveTo(xx,y);g.bezierCurveTo(xx+r()*2-1,y+ph*.3,xx+r()*2-1,y+ph*.7,xx,y+ph)}g.stroke()}
  for(let k=0;k<2;k++){const kx=x+3+r()*(pw-6),ky=y+3+r()*(ph-6),a=hor?0:1.57;g.fillStyle='rgba(50,25,8,.55)';g.beginPath();g.ellipse(kx,ky,2,1.3,a,0,7);g.fill();g.strokeStyle='rgba(50,25,8,.35)';g.beginPath();g.ellipse(kx,ky,3.4,2.2,a,0,7);g.stroke()}};
 const nail=(x,y)=>{g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.arc(x+.8,y+1,1.9,0,7);g.fill();g.fillStyle='#1a1a1a';g.beginPath();g.arc(x,y,1.9,0,7);g.fill();g.fillStyle='#a8aeb4';g.beginPath();g.arc(x-.4,y-.4,1.2,0,7);g.fill();g.fillStyle='rgba(140,60,20,.5)';g.beginPath();g.arc(x+1.4,y+1.6,1.6,0,7);g.fill()};
 const half=L/2;[0,L-w].forEach(x=>{plank(x,w-2,w,half-w+4,false);plank(x,half+1,w,half-w,false)});
 [0,L-w].forEach(y=>{plank(-3,y,half+6,w,true);plank(half-2,y,half+5,w,true)});
 for(let t=24;t<L-20;t+=46){nail(t,w*.3);nail(t+4,w*.72);nail(t,L-w*.3);nail(t+4,L-w*.72);nail(w*.3,t);nail(w*.72,t+4);nail(L-w*.3,t);nail(L-w*.72,t+4)}
 // planches en travers dans les coins
 [[w,w,1],[L-w,w,-1],[w,L-w,-1],[L-w,L-w,1]].forEach(([x,y,s])=>{g.save();g.translate(x,y);g.rotate(s*Math.PI/4);plank(-26,-6,52,12,true,3);nail(-18,0);nail(18,0);g.restore()})}
/* la nuit : brume qui monte de la forêt, et des yeux qui brillent près des routes d'où viendront les zombies */
let RFOG=null;
function ringFog(){if(RFOG)return RFOG;const c=document.createElement('canvas');c.width=c.height=L/2;const g=c.getContext('2d'),r=rng(31);g.scale(.5,.5);
 for(let k=0;k<90;k++){let x=r()*L,y=r()*L;const s=Math.floor(r()*4),d=r()*T*1.15;if(s===0)y=d;else if(s===1)y=L-d;else if(s===2)x=d;else x=L-d;const rr=18+r()*24,gr=g.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,'rgba(170,190,215,.3)');gr.addColorStop(1,'rgba(170,190,215,0)');g.fillStyle=gr;g.fillRect(x-rr,y-rr,rr*2,rr*2)}
 return RFOG=c}
function drawEdgeNight(now){if(nightAmt<.05)return;ctx.save();
 const dx=reduce?0:Math.sin(now/2600)*5,dy=reduce?0:Math.cos(now/3100)*4;ctx.globalAlpha=nightAmt*.75;ctx.drawImage(ringFog(),dx,dy,L,L);
 if(S.busy&&G.pending&&G.pending.length){const seen=new Set();let n=0;const max=OPT.eco?4:8;
  for(const p of G.pending){if(seen.has(p.pos))continue;seen.add(p.pos);const c=tc(p.pos),v=c.x<T||c.x>L-T,out=v?Math.sign(c.x-L/2):Math.sign(c.y-L/2);
   for(let j=0;j<2&&n<max;j++,n++){const h=(p.pos*7+j*13)%10/10,along=(j?1:-1)*(26+h*22),d=30+h*24,e0=out>0?L-d:d,x=v?e0:c.x+along,y=v?c.y+along:e0;
    const bl=Math.sin(now/(600+h*500)+p.pos+j*2);if(bl>.88)continue;ctx.globalAlpha=nightAmt*(.6+.4*Math.max(0,bl));
    for(const e of[-3.5,3.5]){const ex=v?x:x+e,ey=v?y+e:y;circ(ex,ey,4.5,'rgba(255,90,20,.35)');circ(ex,ey,2.3,'#ffb21a')}}}}
 ctx.restore()}
setBiome('foret');
const decal=document.createElement('canvas');decal.width=decal.height=L*2;const gx=decal.getContext('2d');gx.scale(2,2);
function clearDecals(){gx.clearRect(0,0,L,L)}
function splat(x,y,big){const n=big?9:3;for(let k=0;k<n;k++){const a=Math.random()*7,d=Math.random()*(big?12:7);gx.fillStyle=Math.random()<.5?'rgba(110,14,18,.55)':'rgba(70,90,30,.45)';gx.beginPath();gx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,1+Math.random()*(big?4:2),0,7);gx.fill()}}

/* ---------- live visual state ---------- */
const V=new Map(),FX=[],PT=[],facing=Array(Z.N*Z.N).fill(null),atkT=Array(Z.N*Z.N).fill(0),ouchT=Array(Z.N*Z.N).fill(0);
const SLAM={},UHIT={},DEADP=[];let nightAmt=0,nightTarget=0,shakeT=0,shakeK=5,hurtT=0,last=performance.now();
// tremblement de l'écran : k = force ; une secousse plus forte remplace une plus faible
// v128 : vibrations du téléphone (Android ; l'iPhone ne les permet pas dans le navigateur), au plus une toutes les 250 ms
let vibT=0;function vib(p){if(!OPT.vib||!navigator.vibrate)return;const n=performance.now();if(n-vibT<250)return;vibT=n;try{navigator.vibrate(p)}catch(e){}}
// v166 : zoom de caméra bref sur un point (mur qui cède, massacre) ; coupé avec les secousses ou si le système demande moins d'animations
let zoomFX=null,wallSlowT=0,CAM=[1,0,0,1,0,0],CAMZ=[1,0,0,1,0,0];const NB={};
function camZoom(now,x,y,k,dur){if(!OPT.shake||reduce)return;if(zoomFX&&now-zoomFX.t0<zoomFX.dur&&zoomFX.k>k)return;zoomFX={t0:now,x,y,k,dur}}
function shake(now,k){if(!OPT.shake)return;if(now-shakeT>200||k>=shakeK){shakeT=now;shakeK=k}}
// compteur de victimes de la nuit (affiché en haut à gauche)
const KC={n:0,t:0,on:0};
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
function jit(id){const r=rng(id*977+13);return{x:(r()-.5)*26,y:(r()-.5)*26}}
function zpos(v,now){const p=clamp((now-v.t0)/v.dur,0,1);let x=v.from.x+(v.to.x-v.from.x)*p,y=v.from.y+(v.to.y-v.from.y)*p;
 if(v.lunge){const q=(now-v.lunge)/260;if(q<1){const k=Math.sin(Math.PI*q)*9,dx=v.lx-x,dy=v.ly-y,d=Math.hypot(dx,dy)||1;x+=dx/d*k;y+=dy/d*k}}
 return{x,y}}
function syncZ(now){const ids=new Set();
 for(const z of G.z){ids.add(z.id);let v=V.get(z.id);const j=jit(z.id),c=tc(z.pos),to={x:c.x+j.x,y:c.y+j.y};
  if(!v){const dx=c.x-CEN.x,dy=c.y-CEN.y,d=Math.hypot(dx,dy)||1;v={id:z.id,k:z.k,pos:z.pos,from:{x:to.x+dx/d*46,y:to.y+dy/d*46},to,t0:now,dur:Z.zspd(G,z.k)*tickMs(),hp:z.hp,max:z.max,born:now};V.set(z.id,v);if(Math.random()<.35)SFX.play('groan',.7)}
  else if(v.pos!==z.pos){v.from=zpos(v,now);v.to=to;v.t0=now;v.dur=Z.zspd(G,z.k)*tickMs();v.pos=z.pos}
  v.hp=z.hp;v.burn=z.burnT>0}
 for(const v of V.values())if(!ids.has(v.id)&&!v.dying){v.dying=now;const p=zpos(v,now);v.dx=p.x;v.dy=p.y;if(!v.bit)splat(p.x,p.y,true)}
}

/* ---------- dessin : un seul style pour tout le jeu (contour sombre, ombre portée, ombrage, petits détails) ---------- */
const INK='#0e110b';
function ell(x,y,rx,ry,c){if(!(rx>0&&ry>0))return;ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,7);ctx.fill()}
function circ(x,y,r,c){if(!(r>0))return;ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
function line(x1,y1,x2,y2,c,w){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
// formes avec contour : la silhouette sombre un peu plus grande, puis la couleur par-dessus
function oEll(x,y,rx,ry,c,w=1.3){ell(x,y,rx+w,ry+w,INK);ell(x,y,rx,ry,c)}
function oCirc(x,y,r,c,w=1.3){circ(x,y,r+w,INK);circ(x,y,r,c)}
function oLine(x1,y1,x2,y2,c,w){line(x1,y1,x2,y2,INK,w+2.4);line(x1,y1,x2,y2,c,w)}
function oRect(x,y,w,h,c,lw=1.3){ctx.fillStyle=INK;ctx.fillRect(x-lw,y-lw,w+2*lw,h+2*lw);ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function rrect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function oRound(x,y,w,h,r,c,lw=1.3){ctx.fillStyle=INK;rrect(x-lw,y-lw,w+2*lw,h+2*lw,r+lw);ctx.fill();ctx.fillStyle=c;rrect(x,y,w,h,r);ctx.fill()}
const SHADE={};
function shade(c,k){const key=c+k;if(SHADE[key])return SHADE[key];const n=parseInt(c.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(k<0?v*(1+k):v+(255-v)*k)));
 return SHADE[key]='#'+((1<<24)|(f(n>>16)<<16)|(f(n>>8&255)<<8)|f(n&255)).toString(16).slice(1)}

/* armes, dessinées vers la droite (+x), sous les mains */
const WEAP={
 pistol:()=>{oRect(9,3,7,2.6,'#2b2d30')},
 rifle:()=>{oRect(4,2.8,19,2.6,'#2a2c2e');oRect(3,2.2,6,3.8,'#5a4128');oRect(13,1.6,4,1.2,'#1a1a1a',.6)},
 sniper:()=>{oRect(2,3,27,2.2,'#24282a');oRect(10,1.2,7,1.8,'#111',.8);oRect(1,2.2,7,3.8,'#4b3a26')},
 shotgun:()=>{oRect(4,2.2,16,3.8,'#3a3a3c');oRect(3,1.8,6,4.6,'#6b4a2c');oRect(12,5.8,5,1.6,'#5a3a22',.6)},
 mg:()=>{oRect(2,1.8,23,4.6,'#2b2e2a');oRect(10,6.2,6,3.2,'#7a6a2a');line(12,9.5,8,12,'#b9a23a',1.4)},
 xbow:()=>{oRect(4,3,13,2.2,'#5a4128');ctx.strokeStyle=INK;ctx.lineWidth=3.4;ctx.beginPath();ctx.arc(14,4,7,-1.25,1.25);ctx.stroke();ctx.strokeStyle='#8a6a40';ctx.lineWidth=1.6;ctx.stroke();line(9,4,17,4,'#ddd',.8)},
 flame:()=>{oRect(4,2.3,15,3.6,'#5c6166');oRect(18,1.6,3,5,'#2b2b2b');circ(22,4,1.2,'#5aa0ff')},
 molo:now=>{oRect(8,2.6,7,3.6,'#3f7a3a',1);circ(16,4.4,1.6+Math.sin(now/60)*.5,'#ffb43a');circ(16.5,4.4,.8,'#fff2a0')},
 sling:()=>{oLine(8,4,13,4,'#7a5232',1.4);line(13,1.5,13,6.5,'#7a5232',1.4);line(13,1.5,16,4,'#c9b38a',.6);line(13,6.5,16,4,'#c9b38a',.6)},
 axe:()=>{oLine(3,5,18,5,'#6b4a2a',2.2);oRect(14,-.5,6,6,'#a9afb5',1);ctx.fillStyle='#e4e8ec';ctx.fillRect(19,-.5,1,6)},
 cleaver:()=>{oRect(10,1,8,6,'#b9bec3',1);oRect(6,3.4,4,1.8,'#3a2a1a',.8);circ(16,3,.8,'#7a2020')},
 baton:()=>{oLine(5,5,17,5,'#1b1d22',2)},
 wrench:()=>{oLine(6,5,15,5,'#8e959c',2);oCirc(16.5,5,2.3,'#8e959c',1);circ(17.5,5,1,'#4a4f54')},
 bag:()=>{oRound(6,3,8,6,1.5,'#e8e4d8',1);ctx.fillStyle='#d23b3b';ctx.fillRect(9.2,4.2,1.8,3.6);ctx.fillRect(8.2,5.2,3.8,1.6)},
 ladle:()=>{oLine(6,5,14,5,'#9aa0a6',1.4);oCirc(15.5,5,2.2,'#9aa0a6',1)},
 fork:()=>{oLine(3,5,17,5,'#6b4a2a',1.8);[2.5,5,7.5].forEach(o=>oLine(17,o,22,o,'#9aa0a6',1))},
 hammer:()=>{oLine(5,5,15,5,'#6b4a2a',2);oRect(14,1.5,4,7,'#7a7f85',1)},
 rocket:()=>{oRect(0,1.2,24,5.6,'#4a5236');oRect(22,.6,4,6.8,'#2a2e26',1);circ(25,4,1.6,'#c0392b')},
 none:()=>{}
};
/* survivants : une silhouette commune vue de dessus, habillée selon le métier */
const SKINS=['#e8bf96','#c99067','#8d5a3b','#f0cfa8','#a87048','#6e4630'];
const LOOK={
 gun:{body:'#4f5d3a',w:'rifle',head:'cap',hc:'#2e3a22',pack:'#3a3a2a'},
 snp:{body:'#3b4734',w:'sniper',head:'hood',hc:'#2a3324'},
 sht:{body:'#6b4a2c',w:'shotgun',hc:'#2e2218',extra:'belt'},
 mg:{body:'#3e4a32',w:'mg',head:'helmet',hc:'#3a4430',extra:'belt'},
 xbow:{body:'#55603e',w:'xbow',hc:'#6b3b1e',pack:'#5a4128'},
 flame:{body:'#5d5f4a',w:'flame',head:'helmet',hc:'#4a4a3a',tank:'#9a2e2a'},
 molo:{body:'#5a3a2a',w:'molo',head:'hood',hc:'#3a2a20',one:1},
 kid:{body:'#c9a13a',w:'sling',head:'cap',hc:'#b33a3a',small:1,one:1},
 axe:{body:'#8c2f2a',w:'axe',hc:'#6b3b1e',one:1,plaid:1},
 cop:{body:'#2c3e66',w:'baton',head:'cap',hc:'#1d2945',extra:'vest',one:1},
 butch:{body:'#d8d2c4',w:'cleaver',head:'bald',extra:'apron',one:1},
 monk:{body:'#c8701e',w:'none',head:'bald'},
 med:{body:'#e8e4d8',w:'bag',hc:'#1d1a17',extra:'cross',one:1},
 cook:{body:'#f2f2f2',w:'ladle',head:'hat',one:1},
 mech:{body:'#2f5d8a',w:'wrench',head:'cap',hc:'#24476a',one:1,extra:'grease'},
 lead:{body:'#4b6b3a',w:'pistol',head:'cap',hc:'#2c3a22',extra:'belt',one:1},
 // chefs : tenue de leur faction, avec un insigne doré
 riot:{body:'#2a3346',w:'baton',head:'helmet',hc:'#1e2633',extra:'shield',one:1},
 swat:{body:'#1c2128',w:'sniper',head:'helmet',hc:'#14181d',extra:'vest'},
 pharma:{body:'#d9efe6',w:'bag',hc:'#3a2a1a',extra:'cross',one:1},
 priest:{body:'#1d1d22',w:'none',head:'bald',extra:'collar'},
 stretch:{body:'#e8a33a',w:'bag',head:'cap',hc:'#c0392b',one:1},
 hunter:{body:'#5a5a32',w:'rifle',head:'cap',hc:'#c06a1a',pack:'#4a3a22'},
 pitch:{body:'#6b5a3a',w:'fork',hc:'#9a9a9a',plaid:1},
 teacher:{body:'#7a4a6a',w:'none',hc:'#3a2a1a',one:1},
 vigile:{body:'#2e2e3a',w:'pistol',head:'cap',hc:'#1a1a22',extra:'vest',one:1},
 carp:{body:'#8a6a3a',w:'hammer',head:'cap',hc:'#c9a13a',one:1,extra:'belt'},
 chief_police:{body:'#1f2f55',w:'pistol',head:'cap',hc:'#0f1a33',extra:'vest',one:1,chief:1},
 chief_mil:{body:'#3a4630',w:'mg',head:'helmet',hc:'#2e3826',extra:'belt',chief:1},
 chief_care:{body:'#f2efe6',w:'bag',hc:'#5a3a22',extra:'cross',one:1,chief:1},
 chief_pyro:{body:'#3a2a22',w:'flame',head:'helmet',hc:'#5a2a1a',tank:'#c0392b',chief:1},
 chief_trap:{body:'#4a5232',w:'xbow',head:'hood',hc:'#3a4026',pack:'#5a4128',chief:1},
 chief_farm:{body:'#7a3a26',w:'axe',hc:'#b88a4a',one:1,plaid:1,chief:1},
 chief_tech:{body:'#2a4f78',w:'wrench',head:'helmet',hc:'#e0b23a',one:1,extra:'grease',chief:1},
 chief_comm:{body:'#5a4a6a',w:'pistol',hc:'#d8d8d8',one:1,chief:1},
 rocket:{body:'#4a5236',w:'rocket',head:'helmet',hc:'#3a4230',pack:'#5a4128'},
 // combattants des factions de soutien
 amb:{body:'#e8e4d8',w:'none',head:'cap',hc:'#c0392b',extra:'cross'},
 doc:{body:'#f2f2f2',w:'pistol',hc:'#3a2a1a',extra:'cross',one:1},
 orderly:{body:'#7ab0a0',w:'baton',head:'bald',extra:'cross',one:1},
 nailer:{body:'#c98a2a',w:'pistol',head:'helmet',hc:'#e0b23a',one:1,extra:'grease'},
 ranger:{body:'#4a5a2a',w:'rifle',head:'cap',hc:'#2a3a1a',pack:'#5a4128'},
 // évolutions
 nightsnp:{body:'#2a3340',w:'sniper',head:'hood',hc:'#1a2028',extra:'vest'},
 heavyflame:{body:'#4a4a3a',w:'flame',head:'helmet',hc:'#2a2a22',tank:'#c0392b',extra:'belt'},
 slaughter:{body:'#d8d2c4',w:'cleaver',head:'bald',extra:'apron'},
 saint:{body:'#e8e0c8',w:'none',head:'bald',extra:'collar',halo:1},
 tracker:{body:'#3e4a2a',w:'xbow',head:'hood',hc:'#2a3320',pack:'#5a4128'},
 canteen:{body:'#f2f2f2',w:'ladle',head:'hat',extra:'cross',one:1}
};
function person(x,y,a,o,now,skin){
 const br=Math.sin(now/650+x*.7)*.45;skin=skin||'#e8bf96';
 ctx.save();ctx.translate(x,y);ell(2.5,5,12.5,9.5,'rgba(0,0,0,.4)');ctx.rotate(a);if(o.small)ctx.scale(.8,.8);
 if(o.pack)oRound(-14,-6,6,12,2,o.pack,1.1);
 if(o.tank){oEll(-11,0,4,6.5,o.tank,1.1);ell(-12,-2,1.5,2.5,'rgba(255,255,255,.2)');line(-8,3,6,5,'#2a2a2a',1)}
 const hR=[10,5],hL=o.one?[3,-9.5]:[16,3.6];
 (WEAP[o.w]||WEAP.none)(now);
 oLine(-1,7.5,hR[0],hR[1],o.body,3.4);oLine(-1,-7.5,hL[0],hL[1],o.body,3.4);
 oCirc(hR[0],hR[1],2.1,skin,1);oCirc(hL[0],hL[1],2.1,skin,1);
 oEll(-1,0,7+br*.2,11.2+br*.25,o.body);
 if(o.plaid){ctx.save();ctx.beginPath();ctx.ellipse(-1,0,7,11,0,0,7);ctx.clip();ctx.fillStyle='rgba(0,0,0,.28)';for(let k=-12;k<12;k+=4)ctx.fillRect(-9,k,16,1.4);for(let k=-8;k<8;k+=4)ctx.fillRect(k,-12,1.4,24);ctx.restore()}
 ell(-3.6,0,3.4,8.6,'rgba(0,0,0,.22)');ell(1.2,-4,2.4,4,'rgba(255,255,255,.09)');
 if(o.extra==='cross'){ctx.fillStyle='#d23b3b';ctx.fillRect(-5.5,-1.1,5,2.2);ctx.fillRect(-4.1,-2.6,2.2,5.2)}
 if(o.extra==='apron'){ell(1,0,4,8.4,'#ece8dd');circ(2,3,1.7,'#9a2a2a');circ(-.5,-3.5,1.1,'#9a2a2a');circ(3,-1,.8,'#9a2a2a')}
 if(o.extra==='vest'){ctx.fillStyle='rgba(15,22,40,.6)';ctx.fillRect(-6,-8,7,16);ctx.fillStyle='#e8d36a';ctx.fillRect(-4.5,-1,3,2)}
 if(o.extra==='belt')line(-6,-9.5,3,9.5,'#7a6a2a',2);
 if(o.extra==='collar'){ctx.fillStyle='#f2f2f2';ctx.fillRect(1,-1.2,3,2.4)}
 if(o.extra==='shield'){oRound(9,-12,5,20,2,'#5d6670',1.2);ctx.fillStyle='rgba(180,220,255,.25)';ctx.fillRect(10,-10,3,6)}
 if(o.extra==='grease'){circ(-3,4,1.6,'rgba(0,0,0,.35)');circ(-1,-5,1,'rgba(0,0,0,.3)')}
 oCirc(1,0,5.3,skin,1.2);
 const hc=o.hc||'#2e2218';
 if(o.head==='helmet'){circ(.4,0,5.7,hc);ell(-.8,-1.8,2.4,1.8,'rgba(255,255,255,.14)');line(4.8,-3.5,4.8,3.5,shade(hc,-.4),1.2)}
 else if(o.head==='cap'){ctx.fillStyle=hc;ctx.beginPath();ctx.arc(0,0,5.6,Math.PI*.45,Math.PI*1.55);ctx.fill();ctx.fillRect(3,-3.4,3.8,6.8)}
 else if(o.head==='hat'){oCirc(-.6,0,5.2,'#f6f6f6',1);circ(-2.2,0,3.4,'#e2e2e2')}
 else if(o.head==='hood'){circ(-.3,0,6,hc);circ(2.2,0,3.4,skin);ell(.5,0,1.2,3.2,'rgba(0,0,0,.25)')}
 else if(o.head==='bald'){ell(-.6,-1.6,2,1.5,'rgba(255,255,255,.2)')}
 else{ctx.fillStyle=hc;ctx.beginPath();ctx.arc(.2,0,5.6,Math.PI*.55,Math.PI*1.45);ctx.fill();circ(-3,0,2.4,hc)}
 if(o.halo){ctx.strokeStyle='#f2c23d';ctx.lineWidth=1.6;ctx.globalAlpha=.85;ctx.beginPath();ctx.arc(.5,0,8,0,7);ctx.stroke();ctx.globalAlpha=1}
 if(o.chief){ctx.save();ctx.rotate(-Math.PI/2);ctx.fillStyle=INK;ctx.beginPath();for(let k=0;k<10;k++){const r=k%2?2.2:4.6,t=k/10*Math.PI*2;ctx.lineTo(Math.cos(t)*r,-9+Math.sin(t)*r)}ctx.fill();ctx.fillStyle='#f2c23d';ctx.beginPath();for(let k=0;k<10;k++){const r=k%2?1.5:3.6,t=k/10*Math.PI*2;ctx.lineTo(Math.cos(t)*r,-9+Math.sin(t)*r)}ctx.fill();ctx.restore()}
 ctx.restore()}
function dogShape(skin,coat,dark,now,wag){
 line(-11,0,-17,Math.sin(now/(wag||90))*4,INK,4.4);line(-11,0,-17,Math.sin(now/(wag||90))*4,coat,2.6);
 oEll(-2,0,11,6,coat);ell(-3,-2,7,2.5,'rgba(255,255,255,.08)');ell(-4,2.5,7,2,'rgba(0,0,0,.2)');
 oCirc(9,0,5,coat);oEll(13.5,0,3,2.4,dark,1);circ(15.6,0,1,INK);
 oEll(8,-4.5,2,3,dark,1);oEll(8,4.5,2,3,dark,1)}
const CATC={post:'#9ee08a',wall:'#c9a27a',shoot:'#f2b33d',melee:'#ff7a59',help:'#7cc7ff',trap:'#e5484d',item:'#d6c2ff'};
let BARS=[],EYES=[],LABELS=[];
// v139 : couleurs adaptées au daltonisme (palette Okabe-Ito) : bleu et orange pour tes unités, rose pour les zombies
const HPC=()=>OPT.cb?{ok:'#56b4e9',low:'#e69f00',z:'#cc79a7'}:{ok:'#9fd86b',low:'#e5484d',z:'#e5484d'};
function hpBar(x,y,f,c){if(f>=1)return;BARS.push([x,y,f,c])}
function drawBars(){for(const[x,y,f,c]of BARS){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-18,y-1,36,7);ctx.fillStyle=c;ctx.fillRect(x-17,y,34*clamp(f,0,1),5)}}
const EQIC={gear:'vest',binoc:'binoc',bandage:'band',medkit:'medkit',torch:'torch',pills:'pills',pack:'pack',tape:'tape',keys:'keys'};
/* jeu de plateau : un socle commun en carton sous chaque pièce (épaisseur, face, liseré de couleur).
   rond = survivants et zombies, carré = postes et défenses isolées, plat = pièges, grande tuile = abri. */
function socle(x,y,R,face,rim,kind){const sq=kind!=='round',th=kind==='flat'?1.5:4,rr=R*.2;
 const path=(dy,r)=>{if(!sq){ctx.beginPath();ctx.arc(x,y+dy,r,0,7)}else{const a=x-r,b=y+dy-r,w=2*r;ctx.beginPath();ctx.moveTo(a+rr,b);ctx.lineTo(a+w-rr,b);ctx.quadraticCurveTo(a+w,b,a+w,b+rr);ctx.lineTo(a+w,b+w-rr);ctx.quadraticCurveTo(a+w,b+w,a+w-rr,b+w);ctx.lineTo(a+rr,b+w);ctx.quadraticCurveTo(a,b+w,a,b+w-rr);ctx.lineTo(a,b+rr);ctx.quadraticCurveTo(a,b,a+rr,b);ctx.closePath()}};
 ctx.save();ctx.fillStyle='rgba(0,0,0,.42)';path(th+3,R+.5);ctx.fill();ctx.fillStyle='#4a3622';path(th,R);ctx.fill();ctx.fillStyle=face;path(0,R);ctx.fill();
 ctx.lineWidth=3.5;ctx.strokeStyle=rim;path(0,R-2.6);ctx.stroke();ctx.lineWidth=1.2;ctx.strokeStyle='rgba(40,26,12,.75)';path(0,R);ctx.stroke();ctx.restore()}
const pieceKind=(t,D)=>Z.isUnit(t)?'round':D.cat==='post'||(D.cat==='wall'&&D.block&&!PLAIN.has(t))?'square':null;
// animation des pièces (sur l’image fixe) : respiration, recul au tir, secousse quand elles sont mordues
// v161 : animations du plateau. On compare le plateau d’une image à l’autre :
// pièce posée (elle tombe et soulève de la poussière), déplacée (elle glisse), fusionnée (les pièces s’attirent),
// montée de niveau (elle saute), retirée ou perdue (elle bascule et s’efface).
const NC=Z.N*Z.N,TRK={grid:null,u:[],t:[],gold:[],lv:[],dust:[]},bornT=Array(NC).fill(-1e9),popT=Array(NC).fill(-1e9),lvT=Array(NC).fill(-1e9),SLD=[];
let MERGE=null,dawnT=-1e9;const DAWN=1500;
const lvOf=u=>u?(u.lvA||0)+(u.lvD||0):0;
function trackBoard(now){
 const g=G.grid,n=g.length;
 if(TRK.grid!==g){TRK.grid=g;TRK.dust=[];for(let i=0;i<n;i++){const u=g[i];TRK.u[i]=u;TRK.t[i]=u&&u.t;TRK.gold[i]=u&&u.gold||0;TRK.lv[i]=lvOf(u)}return}
 for(let i=0;i<n;i++){const u=g[i],pu=TRK.u[i];
  if(pu&&pu!==u&&!g.includes(pu)){const t=TRK.t[i],p=tc(i);
   if(MERGE&&now-MERGE.t<700&&MERGE.from.includes(i)){const q=tc(MERGE.i);addFX({type:'fly',k:t,x1:p.x,y1:p.y,x2:q.x,y2:q.y,dur:420})}
   else if(t&&Z.U[t]){addFX({type:'gone',k:t,x:p.x,y:p.y,dur:520});burst(p.x,p.y,'rgba(200,190,160,.7)',6,.05,2.4)}}
  if(u&&u!==pu){const j=TRK.u.indexOf(u);
   if(j>=0&&j!==i){const a=tc(j),b=tc(i);SLD[i]={dx:a.x-b.x,dy:a.y-b.y,t:now}}
   else if(TRK.t[i]!==u.t){bornT[i]=now;TRK.dust.push({i,t:now+170})}}
  if(u){if(TRK.t[i]&&TRK.t[i]!==u.t&&u===pu)popT[i]=now;
   if((u.gold||0)>(u===pu||TRK.t[i]===u.t?TRK.gold[i]:u.gold||0)){popT[i]=now;const p=tc(i);burst(p.x,p.y,'#ffe7a0',14,.1,2.2);burst(p.x,p.y,'#f2c23d',10,.07,3)}
   if(lvOf(u)>TRK.lv[i]&&(u===pu||TRK.t[i]===u.t)){lvT[i]=now;const p=tc(i);floatTxt(p.x,p.y-26,'▲','#9fd86b',18);try{lvFx(i,lvOf(u))}catch(e){}addFX({type:'ring',x:p.x,y:p.y,r:36,c:'#9fd86b',dur:420})}}
 }
 for(let i=0;i<n;i++){const u=g[i];TRK.u[i]=u;TRK.t[i]=u&&u.t;TRK.gold[i]=u&&u.gold||0;TRK.lv[i]=lvOf(u)}
 for(let k=TRK.dust.length-1;k>=0;k--){const d=TRK.dust[k];if(now<d.t)continue;TRK.dust.splice(k,1);if(!g[d.i])continue;const p=tc(d.i);
  for(let m=0;m<10;m++){const a=m/10*6.28+Math.random()*.4,sp=.03+Math.random()*.03;PT.push({x:p.x+Math.cos(a)*14,y:p.y+Math.sin(a)*14,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,t0:now,dur:380+Math.random()*200,c:'rgba(214,200,165,.75)',r:3+Math.random()*2.5,light:0})}
  addFX({type:'ring',x:p.x,y:p.y,r:30,c:'rgba(230,215,180,.7)',dur:300})}
}
// fissures dessinées sur une pièce de défense abîmée
function cracks(x,y,i,f){const r=rng(i*53+7);ctx.save();ctx.strokeStyle='rgba(20,14,10,.8)';ctx.lineWidth=1.6;ctx.lineJoin='round';
 for(let k=0;k<(f<.2?4:2);k++){let px=x+(r()-.5)*24,py=y+(r()-.5)*24;ctx.beginPath();ctx.moveTo(px,py);for(let m=0;m<4;m++){px+=(r()-.5)*12;py+=(r()-.5)*12;ctx.lineTo(px,py)}ctx.stroke()}ctx.restore()}
// trou laissé au sol par une explosion, et fissure laissée par les pas du boss
function crater(x,y,r){try{gx.save();gx.fillStyle='rgba(12,10,8,.6)';gx.beginPath();gx.ellipse(x,y,r,r*.85,0,0,7);gx.fill();gx.strokeStyle='rgba(120,100,70,.45)';gx.lineWidth=3;gx.beginPath();gx.ellipse(x,y,r+2,r*.85+2,0,0,7);gx.stroke();
 gx.strokeStyle='rgba(15,12,10,.45)';gx.lineWidth=1.5;for(let k=0;k<7;k++){const a=k/7*6.28+Math.random()*.5,l=r*(1.3+Math.random()*.7);gx.beginPath();gx.moveTo(x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.7);gx.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);gx.stroke()}gx.restore()}catch(e){}}
function groundCrack(x,y){try{gx.save();gx.strokeStyle='rgba(18,14,10,.5)';gx.lineWidth=1.8;for(let k=0;k<3;k++){let px=x,py=y,a=Math.random()*6.28;gx.beginPath();gx.moveTo(px,py);for(let m=0;m<3;m++){a+=(Math.random()-.5)*1.2;const l=4+Math.random()*6;px+=Math.cos(a)*l;py+=Math.sin(a)*l;gx.lineTo(px,py)}gx.stroke()}gx.restore()}catch(e){}}
// secousse d’un mur qui encaisse (rempart)
function wallJit(now,...ks){let j=0;for(const k of ks){const th=now-ouchT[k];if(th<240)j=Math.max(j,(1-th/240))}return j?Math.sin(now/18)*2.2*j:0}
function unitAnim(i,u,now,sc){
 const live=Z.isUnit(u.t),ta=now-atkT[i],th=now-ouchT[i],trap=(Z.U[u.t]||{}).cat==='trap';
 const sl=SLD[i];if(sl){const q=(now-sl.t)/240;if(q>=1)SLD[i]=null;else{const k=(1-q)*(1-q);ctx.translate(sl.dx*k/sc,sl.dy*k/sc)}}
 const tb=now-bornT[i];if(tb<340){const q=tb/340;if(q<.55){const k=q/.55;ctx.globalAlpha*=Math.min(1,k*2.5);ctx.translate(0,-22*(1-k)*(1-k));const s=1.5-.5*k*k;ctx.scale(s,s)}else{const k=Math.sin((q-.55)/.45*Math.PI)*.18;ctx.scale(1+k,1-k)}}
 const tp=now-popT[i];if(tp<480){const k=Math.sin(tp/480*Math.PI)*(1-tp/960)*.45;ctx.scale(1+k,1+k)}
 const tl=now-lvT[i];if(tl<420){const k=Math.sin(tl/420*Math.PI);ctx.translate(0,-9*k);ctx.scale(1+.08*k,1+.08*k)}
 if(trap){if(ta<260){const k=1-ta/260;ctx.scale(1+.3*k,1-.15*k)}return}
 if(live){const low=u.hp/Math.max(1,Z.maxHp(G,u))<.35,b=Math.sin(now/(low?1150:650)+i*1.7),a=low?.035:.018;ctx.scale(1+a*b,1-a*b)}
 // v170+ : attaque façon Hearthstone : le corps à corps fait un pas vers sa cible puis revient, le tireur recule plus net
 if(facing[i]!=null){const mel=((Z.U[u.t]||{}).rng||1)<=1;if(mel&&ta<230){const k=Math.sin(ta/230*Math.PI),d=7*k/sc*1.45;ctx.translate(Math.cos(facing[i])*d,Math.sin(facing[i])*d);ctx.scale(1+.08*k,1+.08*k)}
  else if(!mel&&ta<170){const k=1-ta/170,d=3.6*k;ctx.translate(-Math.cos(facing[i])*d,-Math.sin(facing[i])*d);ctx.scale(1+.06*k,1+.06*k)}}
 if(th<240){const k=1-th/240;ctx.translate(Math.sin(th/18)*2.4*k,0);ctx.scale(1-.07*k,1+.05*k)}
}
function drawUnit(i,u,now){
 const sl=SLAM[i];let sk=1;if(sl){const q=(now-sl)/170;if(q<0)return;if(q<1)sk=1+.85*(1-q)*(1-q);else delete SLAM[i]}
 const p0=tc(i),D0=Z.stat(G,u.t),cc=CATC[D0.cat];
 // jeu de plateau : socle commun (rond, carré ou plat selon la nature de la pièce)
 {const kd=pieceKind(u.t,D0);if(kd)socle(p0.x,p0.y,kd==='round'?25:24,'#d8c7a0',cc,kd);
  else if(D0.cat!=='trap'){ctx.save();ctx.globalAlpha=D0.block?.16:.1;circ(p0.x,p0.y,26,cc);ctx.restore()}}
 // version dorée (fusion) ou évolution : un anneau qui pulse
 if(u.gold||D0.evo){ctx.save();ctx.strokeStyle=u.gold?'#f2c23d':'#c58cff';ctx.lineWidth=3;ctx.globalAlpha=.55+.3*Math.sin(now/300);ctx.beginPath();ctx.arc(p0.x,p0.y,28,0,7);ctx.stroke();ctx.restore()}
 if(u.ed){try{edAura(p0.x,p0.y,u.ed,now,i)}catch(e){}}
 // v170 : carte qui vient d'être posée (elle tombe et s'écrase) et défense qui vient d'être frappée (tremble et blanchit)
 const ht=now-(UHIT[i]||-1e9),hit=ht<240,mx0=Math.max(1,Z.maxHp(G,u));
 ctx.save();ctx.translate(p0.x+(hit?Math.sin(ht*.12)*3*(1-ht/240):0),p0.y);const sc=(1.45+.12*Math.min(3,u.gold||0))*sk;ctx.scale(sc,sc);
 try{unitAnim(i,u,now,sc)}catch(e){}
 ctx.translate(-p0.x,-p0.y);if(u.ed==='fan')ctx.globalAlpha*=.62+.08*Math.sin(now/700+i);
 drawUnitInner(i,u,now);ctx.restore();
 if(Z.isUnit(u.t)&&!D0.block&&u.hp/mx0<.35){ctx.save();ctx.globalAlpha=.16+.1*Math.sin(now/1150*2+i);ctx.globalCompositeOperation='multiply';circ(p0.x,p0.y,21,'#e5484d');ctx.restore()}
 if(hit){ctx.save();ctx.globalAlpha=.55*(1-ht/240);ctx.globalCompositeOperation='lighter';circ(p0.x,p0.y,22,'#fff');ctx.restore()}
 if(D0.block){const f=u.hp/Z.maxHp(G,u);if(f<.4)try{cracks(p0.x,p0.y,i,f)}catch(e){}}
 if(D0.up)safeTxt(p0.x+19,p0.y-17,'+','#f2b33d');
 if(u.gold)safeTxt(p0.x-19,p0.y-17,u.gold>1?u.gold+'★':'★','#f2c23d');else if(D0.evo)safeTxt(p0.x-19,p0.y-17,'✦','#c58cff');
 const lv=(u.lvA||0)+(u.lvD||0);if(lv){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(p0.x+11,p0.y+14,18,12);ctx.fillStyle='#9fd86b';ctx.font='bold 9px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText(_t('N')+lv,p0.x+20,p0.y+23)}
 const eq=Z.eqOf(u);if(eq.length){ctx.font='10px system-ui,sans-serif';ctx.textAlign='center';eq.slice(0,4).forEach((t,k)=>{const ex=p0.x-25,ey=p0.y-8+k*13;circ(ex,ey,6.8,'rgba(10,10,10,.8)');glyph(EQIC[t]||'pack',ex,ey,9,'#fff',2.6)})}
 try{dmgBadge(i,p0,D0,now)}catch(e){}
 const mx=Z.maxHp(G,u);if(D0.block)hpBar(p0.x,p0.y-31,u.hp/mx,u.hp/mx>.4?HPC().ok:HPC().low);
 if(u.name&&nightAmt<.5)LABELS.push([p0.x,p0.y+33,u.name.replace(/^(Le |La |L’)/,'')+(u.gold?' '+stars(u):'')]);
}
function drawUnitInner(i,u,now){
 const{x,y}=tc(i),dx=x-CEN.x,dy=y-CEN.y,out=Math.atan2(dy,dx);const a=facing[i]??out,s=rng(i+3);
 if(!PLAIN.has(u.t)&&u.t!=='wire'&&drawSpr(u.t,x,y,a,out))return;
 const sk0=SKINS[(i*7+(u.name||'').length)%SKINS.length];
 if(u.t==='k9squad'){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.translate(-2,11);ctx.scale(.75,.75);dogShape('#3a2a1a','#4a3626','#1e140c',now,90);ctx.restore();person(x-2,y-5,a,LOOK.cop,now,sk0);return}
 if(u.t==='gang'){[[-9,-6],[8,-7],[0,8]].forEach(([ox,oy],k)=>person(x+ox,y+oy,a,{...LOOK.kid,hc:['#b33a3a','#3a6ab3','#3a9a4a'][k]},now,SKINS[(i+k*2)%SKINS.length]));return}
 const alias={fortin:'bunker',autogun:'sentry'}[u.t];if(alias)u={...u,t:alias};
 const L0=LOOK[u.t];
 if(L0){const sk=SKINS[(i*7+(u.name||'').length)%SKINS.length],sw=L0.w==='axe'||L0.w==='cleaver'?Math.sin(now/280)*.12:0;person(x,y,a+sw,L0,now,sk);return}
 switch(u.t){
  case 'k9':{ctx.save();ctx.translate(x,y);ell(2,5,13,8,'rgba(0,0,0,.35)');ctx.rotate(a);dogShape('#3a2a1a','#4a3626','#1e140c',now,90);oRect(-7,-3,9,6,'#1f2f55',1);ctx.restore();break}
  case 'dogs':{ctx.save();ctx.translate(x,y);ell(2,5,15,10,'rgba(0,0,0,.35)');ctx.rotate(a);ctx.save();ctx.translate(-3,-6);ctx.scale(.8,.8);dogShape('#7a5232','#8a6a42','#4a2f1a',now,80);ctx.restore();ctx.save();ctx.translate(2,6);ctx.scale(.8,.8);dogShape('#5a4a3a','#5a4a3a','#2a2018',now,110);ctx.restore();ctx.restore();break}
  case 'barrier':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);ell(3,6,25,9,'rgba(0,0,0,.35)');oRect(-24,-5,48,10,'#e8e8e8');ctx.fillStyle='#c0392b';for(let k=-22;k<24;k+=10){ctx.beginPath();ctx.moveTo(k,-5);ctx.lineTo(k+5,-5);ctx.lineTo(k+1,5);ctx.lineTo(k-4,5);ctx.fill()}[-20,20].forEach(p=>oRect(p-2,5,4,4,'#555',1));ctx.restore();break}
  case 'mortar':{ctx.save();ctx.translate(x,y);ell(2,5,12,9,'rgba(0,0,0,.35)');oCirc(0,0,9,'#4a5236');ctx.rotate(a);oRect(0,-3,14,6,'#2a2e26');circ(14,0,2,'#111');ctx.restore();break}
  case 'sentry':case 'turret':{ctx.save();ctx.translate(x,y);ell(2,5,12,9,'rgba(0,0,0,.35)');oCirc(0,0,u.t==='sentry'?10:8.5,u.t==='sentry'?'#55603e':'#6a5a3a');[0,1,2].forEach(k=>{const t=k*2.1;line(Math.cos(t)*6,Math.sin(t)*6,Math.cos(t)*11,Math.sin(t)*11,'#333',2)});ctx.rotate(a);oRect(0,-2.5,15,5,'#2b2e2a');if(u.t==='sentry')oRect(0,1.5,13,2.5,'#2b2e2a',.8);oCirc(0,0,4,u.t==='sentry'?'#3e4a32':'#8a7a4a',1);if(u.t==='turret')circ(-2,-2,1.2,'#c0392b');ctx.restore();break}
  case 'clay':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);circ(1,3,10,'rgba(0,0,0,.3)');ctx.fillStyle=INK;ctx.beginPath();ctx.arc(0,9,13,Math.PI*1.2,Math.PI*1.8);ctx.lineTo(0,3);ctx.fill();oRect(-8,-4,16,6,'#4f6b3f',1);ctx.fillStyle='#ddd';ctx.font='bold 4px sans-serif';ctx.fillText(_t('FRONT'),-6,0);if(Math.floor(now/400)%2)circ(6,-2,1.2,'#ff3b3b');ctx.restore();break}
  case 'bunker':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);ell(3,6,26,14,'rgba(0,0,0,.4)');oRound(-24,-11,48,22,5,'#7a7a72');ctx.fillStyle='rgba(0,0,0,.25)';for(let k=-20;k<24;k+=8)ctx.fillRect(k,-11,1,22);ctx.fillStyle='#111';ctx.fillRect(-12,-3,24,4);ctx.restore();break}
  case 'hospital':{ctx.save();ctx.translate(x,y);ell(3,6,24,16,'rgba(0,0,0,.35)');oRect(-20,-14,40,28,'#e8e4d8');line(-20,0,20,0,'rgba(0,0,0,.2)',1);ctx.fillStyle='#d23b3b';ctx.fillRect(-3,-9,6,18);ctx.fillRect(-9,-3,18,6);ctx.restore();break}
  case 'priest':case 'pharma':case 'stretch':break;
  case 'brasero':{ctx.save();ctx.translate(x,y);ell(2,5,12,9,'rgba(0,0,0,.35)');oCirc(0,0,10,'#3a3a3a');circ(0,0,7,'#1a1a1a');circ(0,0,5,'#ff7a2a');circ(-1,-1,2.5,'#ffd25a');if(nightAmt>.2&&Math.random()<.3)PT.push({x:x+(Math.random()-.5)*10,y:y-4,vx:0,vy:-.05,t0:now,dur:400,c:Math.random()<.5?'#ff9a2e':'#ffd25a',r:3,light:22});ctx.restore();break}
  case 'firetrap':{ctx.save();ctx.translate(x,y);ell(2,4,10,8,'rgba(0,0,0,.35)');oCirc(0,0,8,'#8e2d2a');ctx.strokeStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(0,0,5,0,7);ctx.stroke();oLine(0,-8,4,-13,'#ccc',.8);if(Math.floor(now/250)%2)circ(4,-13,1.8,'#ffcf4a');ctx.restore();break}
  case 'net':{ctx.save();ctx.translate(x,y);ell(0,0,18,13,'rgba(0,0,0,.25)');ctx.strokeStyle='#c9b38a';ctx.lineWidth=1;for(let k=-15;k<=15;k+=5){ctx.beginPath();ctx.moveTo(k,-11);ctx.lineTo(k+6,11);ctx.moveTo(k,11);ctx.lineTo(k+6,-11);ctx.stroke()}ctx.restore();break}
  case 'bear':{ctx.save();ctx.translate(x,y);circ(1,2,15,'rgba(0,0,0,.3)');ctx.strokeStyle=INK;ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,13,0,7);ctx.stroke();ctx.strokeStyle='#7d8287';ctx.lineWidth=3;ctx.stroke();for(let k=0;k<14;k++){const t=k/14*Math.PI*2;line(Math.cos(t)*13,Math.sin(t)*13,Math.cos(t)*6,Math.sin(t)*6,'#c5c9cd',1.6)}oCirc(0,0,3.5,'#555',1);ctx.restore();break}
  case 'scare':{ctx.save();ctx.translate(x,y);ell(2,5,12,7,'rgba(0,0,0,.3)');ctx.rotate(out);oLine(-14,0,14,0,'#6b4a2a',2.4);oEll(0,0,5,8,'#7a5a3a');ell(0,0,3,6,'#c9a13a');oCirc(0,0,5,'#d8c38a',1);circ(0,0,6.5,'rgba(90,60,30,.85)');circ(0,0,3.5,'#c9a13a');[-14,14].forEach(p=>{line(p,0,p+(p>0?3:-3),-3,'#c9a13a',1);line(p,0,p+(p>0?3:-3),3,'#c9a13a',1)});ctx.restore();break}
  case 'workshop':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);ell(3,6,22,13,'rgba(0,0,0,.35)');oRect(-20,-10,40,20,'#6b5236');ctx.fillStyle='rgba(0,0,0,.2)';for(let k=-16;k<20;k+=8)ctx.fillRect(k,-10,1,20);oLine(-12,-4,-2,-4,'#9aa0a6',1.6);oCirc(-1,-4,2,'#9aa0a6',.8);oRect(4,-6,8,4,'#7a7f85',.8);oLine(6,3,14,3,'#c0392b',1.4);ctx.restore();break}
  case 'modwall':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);ell(3,6,26,10,'rgba(0,0,0,.35)');[-24,-8,8].forEach((p,k)=>{oRect(p,-6,15,12,['#7d8a8f','#6f7c80','#83908f'][k],1);line(p+2,-3,p+13,-3,'rgba(255,255,255,.15)',1);circ(p+3,3,.9,'#cfd6da');circ(p+12,3,.9,'#cfd6da')});ctx.restore();break}
  case 'tesla':{ctx.save();ctx.translate(x,y);ell(2,5,11,8,'rgba(0,0,0,.35)');oCirc(0,0,8,'#3a3a3a');oCirc(0,0,5,'#b87333',1);ctx.strokeStyle='#e0a050';ctx.lineWidth=1;for(let k=2;k<5;k++){ctx.beginPath();ctx.arc(0,0,k,0,7);ctx.stroke()}oCirc(0,-1,2.5,'#c9d6e0',1);if(powered()&&Math.random()<.15){const t=Math.random()*7;line(0,-1,Math.cos(t)*14,Math.sin(t)*14,'#9fe8ff',1);PT.push({x:x+Math.cos(t)*14,y:y+Math.sin(t)*14,vx:0,vy:0,t0:now,dur:120,c:'#bff3ff',r:2,light:16})}ctx.restore();break}
  case 'market':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);ell(3,6,22,14,'rgba(0,0,0,.35)');oRect(-18,-12,36,24,'#6b5236');ctx.fillStyle=INK;ctx.fillRect(-20,-14,40,9);[0,1,2,3,4].forEach(k=>{ctx.fillStyle=k%2?'#e8e4d8':'#c0392b';ctx.fillRect(-19+k*7.6,-13,7.6,7)});[[-10,4,'#d84a3a'],[-2,5,'#e8a33a'],[7,3,'#7ab04a'],[12,7,'#d84a3a']].forEach(([a,b,c])=>oCirc(a,b,2.6,c,.8));ctx.restore();break}
  case 'dog':{ctx.save();ctx.translate(x,y);ell(2,5,13,8,'rgba(0,0,0,.35)');ctx.rotate(a);dogShape('#7a5232','#7a5232','#4a2f1a',now,90);line(5,-3,5,3,'#c0392b',1.6);ctx.restore();break}
  case 'bar':{ctx.save();ctx.translate(x,y);ell(3,6,25,11,'rgba(0,0,0,.35)');[[-.45,-6,'#8a6a45'],[.4,4,'#7d5f3d'],[0,0,'#957552']].forEach(([r,o,c])=>{ctx.save();ctx.rotate(r+out+Math.PI/2);oRect(-24,o-4.5,48,9,c);ctx.fillStyle='rgba(0,0,0,.2)';for(let k=-20;k<24;k+=9)ctx.fillRect(k,o-4.5,1,9);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(-24,o-4.5,48,2);circ(-18,o,1.3,'#cfcfcf');circ(18,o,1.3,'#cfcfcf');ctx.restore()});ctx.restore();break}
  case 'car':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2+(s()-.5)*.5);ell(3,6,29,18,'rgba(0,0,0,.4)');[[-18,-16],[11,-16],[-18,12],[11,12]].forEach(([a,b])=>oRect(a,b,7,4,'#151515',1));
   oRound(-26,-13,52,26,7,'#6e3426');oRound(-11,-11,23,22,4,'#55281e',.8);ctx.fillStyle='#2a343c';ctx.fillRect(12,-10,6,20);ctx.fillRect(-17,-10,4,20);
   ctx.fillStyle='rgba(160,200,220,.25)';ctx.fillRect(13,-9,2,8);[[-19,6,3.2],[5,-8,2.4],[-2,7,2],[20,8,1.6]].forEach(([a,b,r])=>circ(a,b,r,'rgba(150,80,35,.75)'));line(-26,0,26,0,'rgba(0,0,0,.25)',1);ctx.restore();break}
  case 'fen':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);[-20,0,20].forEach(p=>{circ(p+1,3,4,'rgba(0,0,0,.35)');oCirc(p,0,3.4,'#7a7a7a',1)});
   const on=powered();[-4,0,4].forEach(o=>{line(-20,o,20,o,INK,2.4);line(-20,o,20,o,on?'#9fb6c8':'#666',1.1)});
   if(on){circ(-20,0,1.2,'#bff3ff');if(nightAmt>.3&&Math.random()<.04)PT.push({x:x+(Math.random()-.5)*40,y:y+(Math.random()-.5)*10,vx:0,vy:-.02,t0:now,dur:180,c:'#9fe8ff',r:2,light:18})}ctx.restore();break}
  case 'sand':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);ell(2,6,25,11,'rgba(0,0,0,.35)');[[-13,-4],[0,-4],[13,-4],[-6.5,5],[6.5,5]].forEach(([a,b])=>{oEll(a,b,7.5,5,'#b09468',1.1);line(a-5,b,a+5,b,'rgba(0,0,0,.18)',1);ell(a-2,b-2,3,1.5,'rgba(255,255,255,.12)')});ctx.restore();break}
  case 'door':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);ell(3,6,27,11,'rgba(0,0,0,.4)');oRect(-25,-7.5,50,15,'#5d666e');ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(-25,-7.5,50,3);
   [-19,-7,5,17].forEach(p=>{circ(p,-3.5,1.3,'#a9b2ba');circ(p,3.5,1.3,'#a9b2ba')});[[-12,2,4],[10,-3,3]].forEach(([a,b,r])=>circ(a,b,r,'rgba(140,70,30,.55)'));line(-25,0,25,0,'rgba(0,0,0,.3)',1);ctx.restore();break}
  case 'tire':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);[-15,0,15].forEach(p=>{circ(p+1,3,9.5,'rgba(0,0,0,.35)');oCirc(p,0,9,'#1d1d1d',1.2);circ(p,0,4,'#3b4b2c');ctx.strokeStyle='#3a3a3a';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p,0,6.8,0,7);ctx.stroke();ell(p-3,-4,2.5,1.4,'rgba(255,255,255,.1)')});ctx.restore();break}
  case 'lamp':{ctx.save();ctx.translate(x,y);ell(2,5,11,7,'rgba(0,0,0,.35)');oLine(-8,8,0,0,'#555',2);oLine(8,8,0,0,'#555',2);oLine(0,-9,0,0,'#555',2);ctx.rotate(out);oRect(-6,-6,10,12,'#a8a8a8');ctx.fillStyle=powered()?'#ffe9a8':'#555';ctx.fillRect(4,-5,3,10);ctx.restore();break}
  case 'radio':{ctx.save();ctx.translate(x,y);ell(2,5,13,8,'rgba(0,0,0,.35)');oRound(-11,-7,22,14,2,'#3b4a3a');oCirc(-4,0,4,'#1e1e1e',.8);for(let k=0;k<3;k++)line(3,-3+k*3,8,-3+k*3,'#222',1);oLine(6,-7,14,-18,'#9a9a9a',1.2);if(Math.floor(now/500)%2)circ(8,4,1.8,'#ff4040');ctx.restore();break}
  case 'siren':{ctx.save();ctx.translate(x,y);ell(2,5,12,8,'rgba(0,0,0,.35)');oLine(-7,8,0,0,'#555',2);oLine(7,8,0,0,'#555',2);oRect(-7,-7,14,10,'#4f4f4f');const on=Math.floor(now/300)%2;oCirc(0,-3,4.5,on?'#ff3b3b':'#7a1d1d',1);if(on)circ(-1.5,-4.5,1.4,'#ffd0d0');ctx.restore();break}
  case 'solar':{ctx.save();ctx.translate(x,y);ctx.rotate(out);ell(3,5,16,12,'rgba(0,0,0,.35)');oRect(-14,-10,28,20,'#1e2f5a');[-7,0,7].forEach(k=>line(k,-10,k,10,'#8aa0c8',.8));line(-14,0,14,0,'#8aa0c8',.8);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(-14,-10,10,6);ctx.restore();break}
  case 'trap':{ctx.save();ctx.translate(x,y);circ(1,2,11,'rgba(0,0,0,.3)');ctx.strokeStyle=INK;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,9,0,7);ctx.stroke();ctx.strokeStyle='#8b8f93';ctx.lineWidth=2;ctx.stroke();for(let k=0;k<10;k++){const t=k/10*Math.PI*2;line(Math.cos(t)*9,Math.sin(t)*9,Math.cos(t)*4.5,Math.sin(t)*4.5,'#c5c9cd',1.4)}oCirc(0,0,2.5,'#555',1);ctx.restore();break}
  case 'fire':{ell(x+1,y+2,23,16,'rgba(0,0,0,.25)');ell(x,y,22,15,'rgba(30,26,36,.85)');ell(x-6,y-4,9,4,'rgba(130,100,170,.28)');ell(x+7,y+5,5,2,'rgba(90,140,170,.22)');
   if(S.busy&&G.event.id!=='pluie'){for(let k=0;k<2;k++)PT.push({x:x+(Math.random()-.5)*34,y:y+(Math.random()-.5)*20,vx:(Math.random()-.5)*.01,vy:-.045,t0:now,dur:420,c:Math.random()<.5?'#ff9a2e':'#ffd25a',r:3+Math.random()*3,light:0})}break}
  case 'mine':{circ(x+1,y+3,10,'rgba(0,0,0,.3)');oCirc(x,y,8,'#3b3d33');ctx.strokeStyle='#5d604f';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,5,0,7);ctx.stroke();if(Math.floor(now/400)%2)circ(x,y,2,'#ff3b3b');break}
  case 'wire':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);[-24,24].forEach(p=>oLine(p,-8,p,8,'#5a4632',2.4));[-5,0,5].forEach(o=>{ctx.beginPath();for(let k=-24;k<=24;k+=4)ctx.lineTo(k,o+((k/4)%2?1.5:-1.5));ctx.strokeStyle=INK;ctx.lineWidth=2.6;ctx.stroke();ctx.strokeStyle='#9da1a6';ctx.lineWidth=1;ctx.stroke()});ctx.restore();break}
  case 'spike':{ell(x,y,21,15,INK);ell(x,y,19.5,13.5,'#1c140b');for(let k=0;k<u.hp+3;k++){const t=k/(u.hp+3)*7,px=x+Math.cos(t)*10,py=y+Math.sin(t)*6;oLine(px,py+3,px,py-6,'#a07a4a',1.6);circ(px,py-6,.8,'#d8c19a')}break}
  case 'gas':{ctx.save();ctx.translate(x,y);ell(2,5,10,8,'rgba(0,0,0,.35)');oCirc(0,0,8.5,'#b8332f');ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,5.5,0,7);ctx.stroke();ell(-3,-3,3,2,'rgba(255,255,255,.28)');oCirc(0,0,2.2,'#888',.8);ctx.fillStyle='#f2d24a';ctx.fillRect(-6,4,4,2);ctx.restore();break}
  case 'log':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2+Math.sin(now/500)*.15);ell(2,5,22,8,'rgba(0,0,0,.3)');oLine(-22,-12,-22,12,'#4a3420',2.4);oLine(22,-12,22,12,'#4a3420',2.4);oLine(-22,-11,22,-11,'#4a3420',1.6);
   oRound(-17,-6,34,12,6,u.lu>=3?'#5a4632':'#8a6238');ctx.fillStyle='rgba(0,0,0,.2)';for(let k=-12;k<16;k+=7)ctx.fillRect(k,-6,1.2,12);[-10,0,10].forEach(k=>oLine(k,6,k,11,'#cfcfcf',1));ctx.restore();break}
  case 'glass':{ctx.save();ctx.translate(x,y);const r=rng(i*13);for(let k=0;k<9;k++){const px=(r()-.5)*30,py=(r()-.5)*22,s2=3+r()*4,t=r()*7;ctx.save();ctx.translate(px,py);ctx.rotate(t);ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(-s2-1,0);ctx.lineTo(0,-s2*.7-1);ctx.lineTo(s2+1,s2*.4);ctx.fill();
   ctx.fillStyle=k%3?'rgba(120,200,150,.85)':'rgba(190,230,240,.85)';ctx.beginPath();ctx.moveTo(-s2,0);ctx.lineTo(0,-s2*.7);ctx.lineTo(s2,s2*.4);ctx.fill();ctx.restore()}ctx.restore();break}
  case 'cans':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);oLine(-22,0,22,0,'#d8d0b8',1);[-22,22].forEach(p=>oLine(p,-6,p,6,'#5a4632',2.2));[-11,0,11].forEach((p,k)=>{oRect(p-3.5,1,7,9,['#b8433a','#9aa0a6','#c9a13a'][k],1);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(p-2.5,2,1.5,7)});ctx.restore();break}
  case 'smoke':{circ(x+1,y+3,7,'rgba(0,0,0,.3)');oCirc(x,y,6,'#4f6b3f');ctx.fillStyle='#ddd';ctx.fillRect(x-4,y-1,8,2);circ(x+3,y-5,1.5,'#9a9a9a');break}
  case 'bait':{ell(x+1,y+3,12,8,'rgba(0,0,0,.3)');oEll(x,y,11,7,'#a8323a');ell(x-2,y-1,6,3.5,'#d36a6f');oCirc(x+8,y+3,3,'#f0ece4',1);circ(x-6,y+3,1,'#6a1418');break}
  case 'dyn':{ctx.save();ctx.translate(x,y);ell(1,4,12,8,'rgba(0,0,0,.3)');[-6,0,6].forEach(p=>oRect(p-2.5,-8,5,16,'#c0392b',1));ctx.fillStyle='#222';ctx.fillRect(-9,-2,18,3);oLine(0,-8,4,-14,'#ccc',.8);if(Math.floor(now/200)%2){circ(4,-14,2.4,'#ffcf4a');circ(4,-14,1,'#fff')}ctx.restore();break}
 }
}
/* murs construits : dessinés en code, chacun avec son matériau (bois, sacs, pneus, béton rayé, tôle, acier, épave).
   Des murs voisins se raccordent automatiquement : une section continue relie leurs centres (moitié du matériau de chacun),
   avec un poteau aux extrémités et aux angles, et une seule barre de PV par ouvrage.
   Un mur seul est un tronçon posé en travers de la route, prêt à se raccorder. */
const PLAIN=new Set(['bar','car','fen','sand','tire','barrier','modwall','door','palis']),METAL=new Set(['car','modwall','door','barrier']);
const WMAT={palis:'stake',gate:'metal',gabion:'stone',sand:'sand',tire:'tire',barrier:'stripe',modwall:'metal',door:'steel',car:'rust',fen:'electric',bunker:'stone',brasero:'metal',fortin:'stone'};
// section de mur dans le repère local : de x0 à x1, épaisseur 2h centrée sur y=0
function wallSect(m,x0,x1,h,r){const w=x1-x0;if(w<=0)return;
 if(m!=='electric'){ctx.fillStyle=INK;ctx.fillRect(x0-1,-h-2,w+2,2*h+4)}
 if(m==='wood'){for(let x=x0;x<x1;x+=7){const ww=Math.min(6,x1-x),c=['#8a6238','#9a7244','#7d5732'][Math.floor(r()*3)];ctx.fillStyle=c;ctx.fillRect(x,-h,ww,2*h);
   ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(x,-h,1.4,2*h);ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(x-.6,-h);ctx.lineTo(x+ww/2,-h-5.5);ctx.lineTo(x+ww+.6,-h);ctx.fill();
   ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,-h);ctx.lineTo(x+ww/2,-h-4.3);ctx.lineTo(x+ww,-h);ctx.fill()}
  [-h*.45,h*.5].forEach(y=>{ctx.fillStyle=INK;ctx.fillRect(x0,y-2.6,w,5.2);ctx.fillStyle='#5f4226';ctx.fillRect(x0,y-1.8,w,3.6);for(let x=x0+4;x<x1;x+=11)circ(x,y,.9,'#d8d8d8')})}
 else if(m==='stake'){for(let x=x0;x<x1;x+=6){const ww=Math.min(5.4,x1-x),c=['#6e4a28','#7d5732','#5f3f22'][Math.floor(r()*3)];ctx.fillStyle=c;ctx.fillRect(x,-h+3,ww,2*h-6);
   [[-h+3,-1],[h-3,1]].forEach(([y0,d])=>{ctx.fillStyle=INK;ctx.beginPath();ctx.moveTo(x-.6,y0);ctx.lineTo(x+ww/2,y0+d*7.5);ctx.lineTo(x+ww+.6,y0);ctx.fill();ctx.fillStyle='#c9a46a';ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x+ww/2,y0+d*6);ctx.lineTo(x+ww,y0);ctx.fill()})}
  ctx.fillStyle=INK;ctx.fillRect(x0,-2.5,w,5);ctx.fillStyle='#8a7a5a';ctx.fillRect(x0,-1.5,w,3)}
 else if(m==='sand'){ctx.fillStyle='#6d5a38';ctx.fillRect(x0,-h,w,2*h);[[-h/2,0],[h/2,5]].forEach(([y,o])=>{for(let x=x0-5+o;x<x1+5;x+=10){if(x+5<x0||x-5>x1)continue;
   ctx.save();ctx.beginPath();ctx.rect(x0,-h-2,w,2*h+4);ctx.clip();oEll(x,y,5.6,h/2-.4,'#c9ab73',1.2);ell(x-1.5,y-1.6,2.6,1.3,'rgba(255,255,255,.22)');line(x-3,y+1.5,x+3,y+1.5,'rgba(0,0,0,.18)',1);ctx.restore()}})}
 else if(m==='tire'){ctx.fillStyle='#2a2a2a';ctx.fillRect(x0,-h,w,2*h);ctx.save();ctx.beginPath();ctx.rect(x0,-h-2,w,2*h+4);ctx.clip();
  for(let x=x0+h-2;x<x1+h;x+=2*h-3){oCirc(x,0,h-1,'#1c1c1c',1.2);ctx.strokeStyle='#4a4a4a';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x,0,h-3.5,0,7);ctx.stroke();circ(x,0,h*.42,'#3b4a2c');ell(x-3,-4,3,1.4,'rgba(255,255,255,.12)')}ctx.restore()}
 else if(m==='stripe'){ctx.fillStyle='#efeae0';ctx.fillRect(x0,-h+2,w,2*h-4);ctx.save();ctx.beginPath();ctx.rect(x0,-h+2,w,2*h-4);ctx.clip();ctx.fillStyle='#c8372d';
   for(let x=x0-2*h;x<x1+2*h;x+=12){ctx.beginPath();ctx.moveTo(x,-h);ctx.lineTo(x+6,-h);ctx.lineTo(x+6+2*h,h);ctx.lineTo(x+2*h,h);ctx.fill()}ctx.restore();
   ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x0,h-4,w,2);ctx.fillStyle='#8c8c86';ctx.fillRect(x0,-h,w,2);ctx.fillRect(x0,h-2,w,2)}
 else if(m==='metal'||m==='steel'){const a=m==='metal'?['#7d8a8f','#6f7c80']:['#555e66','#4b535a'];for(let x=x0;x<x1;x+=14){const ww=Math.min(13,x1-x);ctx.fillStyle=a[Math.floor((x-x0)/14)%2];ctx.fillRect(x,-h,ww,2*h);
   ctx.fillStyle='rgba(255,255,255,.13)';ctx.fillRect(x,-h,ww,3);ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(x+ww-1,-h,1,2*h);[[2.5,-h+4],[ww-3,-h+4],[2.5,h-4],[ww-3,h-4]].forEach(([cx,cy])=>circ(x+cx,cy,1,'#cfd6da'));
   if(m==='steel'){line(x+2,-1,x+ww-2,-1,'rgba(0,0,0,.35)',1.2)}if(r()<.3)circ(x+ww/2+(r()-.5)*6,(r()-.5)*h,1.8+r()*2,'rgba(150,75,30,.55)')}}
 else if(m==='rust'){ctx.fillStyle='#8a3d24';ctx.fillRect(x0,-h,w,2*h);ctx.fillStyle='#a2502e';ctx.fillRect(x0,-h,w,h*.7);ctx.fillStyle='#2c3640';for(let x=x0+4;x<x1-8;x+=22)ctx.fillRect(x,-h*.25,10,h*.6);
   ctx.fillStyle='rgba(0,0,0,.25)';for(let x=x0+11;x<x1;x+=22)ctx.fillRect(x,-h,1.2,2*h);for(let k=0;k<w/12;k++)circ(x0+r()*w,(r()-.5)*1.6*h,1.5+r()*2.2,'rgba(60,25,10,.45)')}
 else if(m==='electric'){// clôture électrique : poteaux de bois, 3 fils tendus, isolateurs ; étincelles si le courant passe
  const on=powered();
  [-h*.6,0,h*.6].forEach(y=>{line(x0,y,x1,y,INK,2.6);line(x0,y,x1,y,on?'#a9c4d6':'#777',1.2)});
  for(let x=x0+8;x<x1-2;x+=16){oCirc(x,0,3.2,'#6b4a2a',1.2);[-h*.6,0,h*.6].forEach(y=>circ(x,y,1.3,'#e8e0c8'))}
  if(on&&nightAmt>.3&&r()<.5){const x=x0+r()*w;line(x,-h*.6,x+3,0,'#bff3ff',1)}}
 else{ctx.fillStyle='#8a8a82';ctx.fillRect(x0,-h,w,2*h);ctx.fillStyle='rgba(0,0,0,.2)';for(let x=x0+8;x<x1;x+=16)ctx.fillRect(x,-h,1.2,2*h)}}
// poteau (extrémité ou angle) selon le matériau
function wallPost(m,x,y){const metal=m==='metal'||m==='steel'||m==='rust'||m==='stripe';
 ell(x+4,y+6,16,13,'rgba(0,0,0,.35)');
 if(m==='sand'){[[-6,4],[6,4],[0,-4]].forEach(([a,b])=>oEll(x+a,y+b,8,6,'#c9ab73',1.3));ell(x-2,y-6,3,1.4,'rgba(255,255,255,.25)');return}
 if(m==='tire'){oCirc(x,y,12.5,'#1c1c1c',1.4);ctx.strokeStyle='#4a4a4a';ctx.lineWidth=1.5;[9.5,7].forEach(rr=>{ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.stroke()});circ(x,y,4.5,'#3b4a2c');return}
 if(m==='electric'){oCirc(x,y,8,'#6b4a2a',1.6);circ(x,y,5,'#8a6238');oCirc(x,y,3,'#d8d0b8',1);if(powered())circ(x,y,1.4,'#9fe8ff');return}
 if(m==='wood'){oCirc(x,y,10.5,'#6b4a2a',1.8);circ(x,y,7.5,'#8a6238');ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;[5,2.5].forEach(rr=>{ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.stroke()});return}
 const pc={rust:['#6e3426','#9a4a2c'],stripe:['#a9a59a','#e0dcd0'],steel:['#3f464d','#5c656d'],metal:['#5d666e','#87939a']}[m]||['#8f8f86','#a6a69c'];
 oRound(x-11,y-11,22,22,3,pc[0],1.8);oRound(x-7,y-7,14,14,2,pc[1],1);if(m==='stripe'){ctx.fillStyle='#c8372d';ctx.fillRect(x-7,y-2,14,4)}[[-8,-8],[8,-8],[-8,8],[8,8]].forEach(([a,b])=>circ(x+a,y+b,1.1,'#d6dde2'))}
function drawRamparts(ramp){const seen=new Set();
 G.grid.forEach((u,i)=>{if(!u||Z.U[u.t].cat!=='wall'||seen.has(i))return;const g=Z.wallGroup(G,i);g.forEach(j=>seen.add(j));
  if(g.length<2&&!PLAIN.has(u.t))return;
  const links=[];for(const a of g)for(const b of Z.around(a))if(b>a&&g.includes(b)){const[ra,ca]=Z.rc(a),[rb,cb]=Z.rc(b);
   // pas de section en diagonale si le coin est déjà dans le rempart (évite les croisements)
   if(ra!==rb&&ca!==cb&&(g.includes(ra*Z.N+cb)||g.includes(rb*Z.N+ca)))continue;links.push([a,b])}
  // chaque mur garde ses PV : l'usure et la barre de vie sont propres à chaque mur
  const fw=k=>Math.max(0,G.grid[k].hp)/Z.maxHp(G,G.grid[k]),mat=k=>WMAT[G.grid[k].t]||'stone',H=11;
  const wear=(d,r,f)=>{if(f<.66)for(let k=0;k<3;k++){const x=r()*d;line(x,-H,x+(r()-.5)*8,H,'rgba(0,0,0,.6)',1.4)}
   if(f<.33){const x=d*(.3+r()*.4);ctx.fillStyle='rgba(15,12,10,.85)';ctx.fillRect(x,-H,6+r()*6,2*H)}};
  ctx.lineCap='round';
  if(!links.length){// mur seul : un tronçon en travers de la route
   const p=tc(i),out=Math.atan2(p.y-CEN.y,p.x-CEN.x)+Math.PI/2,half=T*.42,r=rng(i*977);
   ctx.save();ctx.translate(p.x+wallJit(performance.now(),i),p.y);ctx.rotate(out);ctx.fillStyle='rgba(0,0,0,.38)';ctx.fillRect(-half+4,-H+7,2*half,2*H);ctx.translate(-half,0);
   wallSect(mat(i),0,2*half,H,r);wear(2*half,r,fw(i));ctx.restore();
   const e1={x:p.x-Math.cos(out)*half,y:p.y-Math.sin(out)*half},e2={x:p.x+Math.cos(out)*half,y:p.y+Math.sin(out)*half};
   wallPost(mat(i),e1.x,e1.y);wallPost(mat(i),e2.x,e2.y)}
  else{
   // ombre portée de tout l'ouvrage
   links.forEach(([a,b])=>{const p=tc(a),q=tc(b);const el=mat(a)==='electric'&&mat(b)==='electric';line(p.x+4,p.y+8,q.x+4,q.y+8,el?'rgba(0,0,0,.18)':'rgba(0,0,0,.38)',el?8:2*H+6)});
   // sections : chaque moitié prend le matériau de son mur
   links.forEach(([a,b])=>{const p=tc(a),q=tc(b),d=Math.hypot(q.x-p.x,q.y-p.y),r=rng(a*131+b);
    ctx.save();ctx.translate(p.x+wallJit(performance.now(),a,b),p.y);ctx.rotate(Math.atan2(q.y-p.y,q.x-p.x));
    if(mat(a)===mat(b))wallSect(mat(a),0,d,H,r);else{wallSect(mat(a),0,d/2,H,r);wallSect(mat(b),d/2,d,H,r);ctx.fillStyle=INK;ctx.fillRect(d/2-1.5,-H-2,3,2*H+4)}
    wear(d,r,Math.min(fw(a),fw(b)));ctx.restore()});
   // poteaux aux extrémités et aux angles
   const nb=k=>links.filter(([a,b])=>a===k||b===k).map(([a,b])=>a===k?b:a);
   g.forEach(k=>{const p=tc(k),ls=nb(k);let corner=ls.length!==2;
    if(!corner){const[r0,c0]=Z.rc(k),[r1,c1]=Z.rc(ls[0]),[r2,c2]=Z.rc(ls[1]);corner=(r1-r0)!==(r0-r2)||(c1-c0)!==(c0-c2)}
    if(corner&&PLAIN.has(G.grid[k].t))wallPost(mat(k),p.x,p.y)})}
  g.forEach(k=>{if(PLAIN.has(G.grid[k].t)){ramp.add(k);const u2=G.grid[k],p=tc(k);if(u2.gold)LABELS.push([p.x,p.y+4,u2.gold>1?u2.gold+'★':'★'])}});
  g.forEach(k=>{const p=tc(k),f=fw(k);hpBar(p.x,p.y-24,f,f>.4?HPC().ok:HPC().low)})})}
/* barbelés : dessinés en code ; des barbelés voisins se raccordent en une ligne continue de rouleaux, piquets aux bouts et aux angles */
function wireSect(d,r){ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(0,-7,d,14);
 for(let o=-1;o<=1;o+=2){ctx.beginPath();for(let x=0;x<=d;x+=2){const y=o*5*Math.cos(x/6.5*Math.PI);ctx.lineTo(x,y)}ctx.strokeStyle=INK;ctx.lineWidth=2.8;ctx.stroke();ctx.strokeStyle='#a8adb2';ctx.lineWidth=1.2;ctx.stroke()}
 line(0,0,d,0,INK,2.4);line(0,0,d,0,'#8d9196',1);for(let x=4;x<d;x+=7){line(x-1.6,-1.8,x+1.6,1.8,'#c9cdd1',1);line(x-1.6,1.8,x+1.6,-1.8,'#c9cdd1',1)}}
function wirePost(x,y){oRect(x-3,y-3,6,6,'#5a4632',1.3);circ(x-1,y-1,1,'#8a6a45')}
function drawWires(){const W=i=>!!(G.grid[i]&&G.grid[i].t==='wire'),seen=new Set();
 G.grid.forEach((u,i)=>{if(!u||u.t!=='wire'||seen.has(i))return;const g=[i],q=[i];seen.add(i);
  while(q.length){const a=q.pop();for(const b of Z.around(a))if(W(b)&&!seen.has(b)){seen.add(b);g.push(b);q.push(b)}}
  const links=[];for(const a of g)for(const b of Z.around(a))if(b>a&&g.includes(b)){const[ra,ca]=Z.rc(a),[rb,cb]=Z.rc(b);if(ra!==rb&&ca!==cb&&(g.includes(ra*Z.N+cb)||g.includes(rb*Z.N+ca)))continue;links.push([a,b])}
  if(!links.length){const p=tc(i),out=Math.atan2(p.y-CEN.y,p.x-CEN.x)+Math.PI/2,half=T*.42;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(out);ctx.translate(-half,0);wireSect(2*half,rng(i));ctx.restore();
   wirePost(p.x-Math.cos(out)*half,p.y-Math.sin(out)*half);wirePost(p.x+Math.cos(out)*half,p.y+Math.sin(out)*half);return}
  links.forEach(([a,b])=>{const p=tc(a),q2=tc(b),d=Math.hypot(q2.x-p.x,q2.y-p.y);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(q2.y-p.y,q2.x-p.x));wireSect(d,rng(a*31+b));ctx.restore()});
  const nb=k=>links.filter(([a,b])=>a===k||b===k).map(([a,b])=>a===k?b:a);
  g.forEach(k=>{const ls=nb(k);let corner=ls.length!==2;if(!corner){const[r0,c0]=Z.rc(k),[r1,c1]=Z.rc(ls[0]),[r2,c2]=Z.rc(ls[1]);corner=(r1-r0)!==(r0-r2)||(c1-c0)!==(c0-c2)}if(corner){const p=tc(k);wirePost(p.x,p.y)}})})}
// pendant la pause de la nuit du Colosse : sa route en rouge (il fonce tout droit de sa route vers l'abri)
// première nuit guidée : la case à toucher pulse en doré
// tutoriel : les cases à toucher brillent (g.on : la case porte déjà l'unité visée, ex. soin ou équipement)
function drawGuide(now){const g=guideStep();if(!g||!g.cells)return;const k=.5+.5*Math.sin(now/220);
 for(const i of g.cells){if(G.grid[i]&&!g.on)continue;const p=tc(i);
  ctx.save();ctx.strokeStyle=`rgba(255,210,90,${.55+.45*k})`;ctx.lineWidth=4;ctx.shadowColor='#ffd25a';ctx.shadowBlur=12+10*k;ctx.strokeRect(p.x-T/2+4,p.y-T/2+4,T-8,T-8);
  if(!G.grid[i]&&i!==Z.C){ctx.fillStyle=`rgba(255,210,90,${.12+.12*k})`;ctx.fillRect(p.x-T/2+4,p.y-T/2+4,T-8,T-8)}ctx.restore()}}
// v166 : couloirs de mort : les cases du chemin probable des zombies couvertes par au moins 2 unités, teintées en rouge (plus fort avec plus d'unités)
let KZ={sig:'',z:{}};
function drawKillZones(now){const sig=G.grid.map(u=>u?u.t:'').join()+'|'+G.place+'|'+G.side+'|'+(G.relics||[]).length;if(sig!==KZ.sig){KZ={sig,z:Z.killZones(G)}}
 const night=S.busy,k=night?.55:.8+.2*Math.sin(now/500);ctx.save();
 for(const j in KZ.z){const n=KZ.z[j],p=tc(+j),a=(n>=4?.6:n===3?.48:.32)*k;ctx.fillStyle=`rgba(214,40,36,${a})`;ctx.fillRect(p.x-T/2+2,p.y-T/2+2,T-4,T-4);if(!night){ctx.strokeStyle=`rgba(255,80,70,${a+.15})`;ctx.lineWidth=1.5;ctx.strokeRect(p.x-T/2+3,p.y-T/2+3,T-6,T-6)}
  if(!night&&n>=3){ctx.strokeStyle=`rgba(255,235,225,${.8*k})`;ctx.lineWidth=1.4;const r=T*.13;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.moveTo(p.x-r*1.7,p.y);ctx.lineTo(p.x+r*1.7,p.y);ctx.moveTo(p.x,p.y-r*1.7);ctx.lineTo(p.x,p.y+r*1.7);ctx.stroke()}}
 ctx.restore()}
function drawBossRoute(now){if(!S.pause||!G.pending)return;const bp=G.pending.filter(p=>(Z.ZT[p.k]||{}).boss),ps=[...new Set(bp.map(p=>p.pos))];if(!ps.length)return;
 const k=.55+.35*Math.sin(now/220);ctx.save();ctx.lineCap='round';
 ps.forEach(pos=>{const a=tc(pos),b=CEN,ang=Math.atan2(b.y-a.y,b.x-a.x),ex=b.x-Math.cos(ang)*T*.75,ey=b.y-Math.sin(ang)*T*.75;
  ctx.strokeStyle=`rgba(0,0,0,${.5*k})`;ctx.lineWidth=T*.42;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(ex,ey);ctx.stroke();
  ctx.strokeStyle=`rgba(229,72,77,${k})`;ctx.lineWidth=T*.3;ctx.setLineDash([T*.35,T*.22]);ctx.lineDashOffset=-now/40;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=`rgba(229,72,77,${k})`;ctx.beginPath();ctx.moveTo(ex+Math.cos(ang)*T*.4,ey+Math.sin(ang)*T*.4);ctx.lineTo(ex+Math.cos(ang+2.4)*T*.4,ey+Math.sin(ang+2.4)*T*.4);ctx.lineTo(ex+Math.cos(ang-2.4)*T*.4,ey+Math.sin(ang-2.4)*T*.4);ctx.fill();
  safeTxt(a.x+Math.cos(ang)*T*.9,a.y+Math.sin(ang)*T*.9-T*.35,ZN[bp.find(p=>p.pos===pos).k][0],'#ff6b6b')});
 ctx.restore()}
// abri fortifié (récompense de victoire, réglable dans les Options)
const FORT=new Image();FORT.src='assets/ui/shelter_fort.webp';
function drawShelter(now){
 const x=CEN.x,y=CEN.y,f=G.shelter/Z.maxS(G);
 if(OPT.shelter==='fort'&&FORT.complete&&FORT.naturalWidth){socle(x,y+2,T*.47,'#d8c7a0','#a07a4c','square');const s=T*.98;ctx.drawImage(FORT,x-s/2,y-s/2,s,s);if(f<.5){ctx.save();ctx.globalAlpha=(.5-f)*.9;ctx.fillStyle='#1a0a06';ctx.fillRect(x-s/2,y-s/2,s,s);ctx.restore()}return}socle(x,y+2,T*.47,'#d8c7a0','#a07a4c','square');ctx.save();ctx.translate(x,y);
 oRect(-30,-26,60,52,'#5b4b39',1.6);
 // toit en tuiles, deux pans
 ctx.fillStyle=INK;ctx.fillRect(-35.5,-31.5,71,63);
 ctx.fillStyle='#7a3b2b';ctx.fillRect(-34,-30,68,30);ctx.fillStyle='#8e4632';ctx.fillRect(-34,0,68,30);
 for(let r=0;r<8;r++){const yy=-30+r*7.5;ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(-34,yy+6,68,1.2);for(let c=0;c<9;c++){const xx=-34+c*8+(r%2?4:0);ctx.fillStyle='rgba(0,0,0,.16)';ctx.fillRect(xx,yy,1,7.5)}}
 ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(-34,-30,68,4);
 oLine(-34,0,34,0,'#4a2016',2.4);
 // tuiles manquantes et planches selon les dégâts
 const miss=[[-22,-20],[10,12],[18,-12],[-8,18],[-26,8],[4,-24]];miss.slice(0,Math.round((1-f)*miss.length)).forEach(([a,b])=>{ctx.fillStyle='#2a1a12';ctx.fillRect(a,b,8,6)});
 if(f<.5){oLine(-24,-18,-6,-6,'#8a6a45',3);oLine(12,10,26,20,'#8a6a45',3)}
 // cheminée
 oRect(12,-24,9,10,'#4a4a4a',1.2);ctx.fillStyle='#2a2a2a';ctx.fillRect(14,-22,5,5);
 const lit=nightAmt>.2;[[-24,-8],[16,4]].forEach(([a,b])=>{oRect(a,b,8,6,lit?'#ffcf6b':'#2a3036',1);if(lit){ctx.globalAlpha=.25;circ(a+4,b+3,9,'#ffcf6b');ctx.globalAlpha=1}});
 ctx.restore();
 if(Math.random()<(nightAmt>.3?.06:.02))PT.push({x:x+16,y:y-26,vx:.004,vy:-.02,t0:now,dur:1300,c:'rgba(160,160,160,.35)',r:4,light:0});
}
/* zombies : silhouette commune, chaque type a sa taille, sa peau, ses vêtements et un détail qui le rend reconnaissable */
const ZL={walk:{sz:1,skin:'#8fa070',cloth:'#4a4a42'},run:{sz:.92,skin:'#a7b062',cloth:'#5a4836',lean:1},fat:{sz:1.35,skin:'#9c8aa8',cloth:'#4b3b4f',fat:1},
 zdog:{sz:.85,skin:'#6d7a4a',cloth:'#4a3b2a',dog:1},crawl:{sz:.85,skin:'#7f9c96',cloth:'#3a4646',low:1},spit:{sz:1,skin:'#b4c85a',cloth:'#4a5a22',spit:1},
 armor:{sz:1.08,skin:'#8fa070',cloth:'#2e3640',helm:'#6e7780',vest:1},howl:{sz:1,skin:'#c4a0b4',cloth:'#5a3a4a',howl:1},sap:{sz:1.05,skin:'#9aa86a',cloth:'#4a4030',sap:1},boss:{sz:2.2,skin:'#8a5a52',cloth:'#2e2020',boss:1},mere:{sz:2.1,skin:'#b89a8a',cloth:'#3a2a2a',boss:1},zero:{sz:1.75,skin:'#c07060',cloth:'#2a1a1a',boss:1}};
function zAnim(v,now,a,moving){
 if(v.dying){const k=clamp((now-v.dying)/500,0,1);ctx.scale(1-.3*k,1-.3*k);return}
 const ph=now/(Z.ZT[v.k].spd===1?90:200)+v.id;
 if(moving){const b=Math.abs(Math.sin(ph));ctx.scale(1+.05*b,1-.04*b)}else{const b=Math.sin(now/500+v.id);ctx.scale(1+.02*b,1+.02*b)}
 const tb=now-(v.atk||-1e9);if(tb<220){const k=Math.sin(tb/220*Math.PI),d=5*k;ctx.translate(Math.cos(a)*d,Math.sin(a)*d);ctx.scale(1+.08*k,1+.08*k)}
 const tf=now-(v.flash||-1e9);if(tf<150){const k=1-tf/150;ctx.translate(-Math.cos(a)*3*k,-Math.sin(a)*3*k);ctx.scale(1-.1*k,1+.08*k)}
}
function drawZombie(v,now){
 const p=v.dying?{x:v.dx,y:v.dy}:zpos(v,now),k=v.k;let alpha=clamp((now-v.born)/350,0,1);
 if(v.dying){alpha=1-clamp((now-v.dying)/500,0,1);if(alpha<=0)return false}
 const Lk=ZL[k]||ZL.walk,a=Math.atan2(CEN.y-p.y,CEN.x-p.x),moving=now-v.t0<v.dur,wob=Math.sin(now/(Z.ZT[k].spd===1?90:200)+v.id)*(moving?.22:.06);
 const sz=Lk.sz*1.5,skin=Lk.skin,cloth=Lk.cloth;
 if(v.burn&&!v.dying&&Math.random()<.3)PT.push({x:p.x+(Math.random()-.5)*10,y:p.y-4,vx:0,vy:-.04,t0:now,dur:300,c:Math.random()<.5?'#ff9a2e':'#ffd25a',r:2.5,light:0});
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(p.x,p.y);
 // jeu de plateau : même socle rond que les survivants, en rouge sang
 // Patient Zéro : cercle pointillé sur la zone où la horde accélère (2 cases)
 if((Z.ZT[k]||{}).haste&&!v.dying){ctx.save();ctx.strokeStyle='rgba(255,58,106,.45)';ctx.lineWidth=2;ctx.setLineDash([7,6]);ctx.lineDashOffset=-now/60;ctx.beginPath();ctx.arc(0,0,T*Z.ZT[k].haste+T*.5,0,7);ctx.stroke();ctx.restore()}
 const isB=!!(Z.ZT[k]||{}).boss;
 if(isB&&moving&&!v.dying){const st=Math.floor(now/520);if(v.stepN!==st){v.stepN=st;shake(now,2.5);groundCrack(p.x,p.y+4);burst(p.x,p.y+6,'rgba(150,130,100,.6)',5,.04,3)}}socle(0,1,11.5*sz,isB?'#6e1410':'#4a1512',isB?'#ff5a3a':'#b8302a','round');
 const zk='z_'+k,[zim,zd]=sprK(zk),zup=zim&&zd[0]==='up';
 try{zAnim(v,now,a,moving)}catch(e){}
 ctx.rotate(zup?wob*.6+(v.dying?.6:0):a+wob);ctx.scale(sz,sz);
 if(v.dying&&!zup)ctx.rotate(.6);
 if(zim){if(zup&&Math.cos(a)<-.1)ctx.scale(-1,1);drawSpr(zk,0,0,0,0)}
 else if(Lk.dog){dogShape(skin,skin,cloth,now,70);circ(10,-2,1,'#d7262e');circ(10,2,1,'#d7262e');ell(-4,1,2.5,1.6,'#6a1418')}
 else{
  const sw=Math.sin(now/170+v.id)*2.4*(moving?1:.3),reach=v.dying?5:(Lk.low?11:Lk.lean?17:15);
  const h1=[reach+sw,-6.5+sw*.3],h2=[reach-sw,6.5-sw*.3];
  oLine(1,-6.5,h1[0],h1[1],skin,3.2);oLine(1,6.5,h2[0],h2[1],skin,3.2);
  oCirc(h1[0],h1[1],2,shade(skin,-.2),1);oCirc(h2[0],h2[1],2,shade(skin,-.2),1);
  if(Lk.low){oEll(-5,0,10,6,cloth);line(-14,-3,-10,0,shade(cloth,-.3),2)}
  else oEll(0,0,Lk.fat?9.5:7,Lk.fat?12.5:10.5,cloth);
  ell(-3,-4,3,2.5,shade(cloth,-.35));ell(-2,5,2.6,2,'#6a1418');ell(1,-2,1.5,3,'rgba(255,255,255,.07)');
  if(Lk.vest)oRect(-5.5,-7,6,14,'#2a3036',1);
  if(Lk.fat){circ(-2,4,2.3,'#6c5a7a');circ(2,-5,1.8,'#6c5a7a');circ(-4,-1,1.4,'#7a6a8a')}
  if(Lk.boss){[[-6,-8],[-8,0],[-6,8]].forEach(([a,b])=>oLine(a,b,a-5,b*1.3,'#e8e0cc',1.2));ell(-2,3,4,2.5,'#6a1418')}
  oCirc(3,0,5.2,skin,1.2);ell(1.2,0,2.4,4,'rgba(0,0,0,.2)');circ(2,-2.6,1.3,'#7a1a1a');
  if(Lk.helm){circ(2.4,0,5.7,Lk.helm);line(5.8,-4,5.8,4,'#1c2228',1.6);ell(1,-2,2,1.4,'rgba(255,255,255,.15)')}
  if(Lk.spit)oCirc(7.2,0,2.6,'#d8f05a',.8);
  // sapeur : bâtons de dynamite sanglés sur le dos et voyant rouge qui clignote
  if(Lk.sap){[-4,0,4].forEach(o=>oRect(-9,o-1.6,7,3.2,'#c0392b',.8));ctx.fillStyle='#222';ctx.fillRect(-9.5,-6,1.4,12);oLine(-9,-5,-13,-9,'#ccc',.6);
   if(Math.floor(now/180)%2){circ(-13,-9,2.2,'#ffcf4a');circ(-13,-9,1,'#fff')}circ(-4,0,1.4,Math.floor(now/240)%2?'#ff3b3b':'#5a1010')}
  if(Lk.howl){ell(7.6,0,2.1,1.5,'#2a0a0a');ctx.strokeStyle='#ffd0e8';ctx.lineWidth=1;ctx.beginPath();ctx.arc(10,0,3+Math.sin(now/120)*1.5,-.8,.8);ctx.stroke()}
  if(!Lk.helm){circ(6,-2,1.1,'#d7262e');circ(6,2,1.1,'#d7262e')}
 }
 if(v.flash&&now-v.flash<110){ctx.globalAlpha=alpha*.8;circ(0,0,11,'#fff')}
 ctx.restore();
 if(!v.dying){const ex=Math.cos(a+wob),ey=Math.sin(a+wob);if(!sprK('z_'+k)[0])EYES.push([p.x+ex*5.5*sz,p.y+ey*5.5*sz,-ey,ex,sz,alpha]);if(v.hp<v.max||(Z.ZT[k]||{}).boss)hpBar(p.x,p.y-17*sz,v.hp/v.max,HPC().z)}
 return true;
}

/* ---------- effects ---------- */
function addFX(f){f.t0=performance.now();FX.push(f)}
function burst(x,y,c,n,spd,r){const now=performance.now();for(let k=0;k<n;k++){const a=Math.random()*7,s=spd*(.4+Math.random());PT.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t0:now,dur:300+Math.random()*250,c,r:r||2,light:0})}}
function drawFX(now){
 // v115 : au plus 220 particules (70 en mode économie) : les plus anciennes disparaissent d'abord
 {const m=OPT.eco?70:220;if(PT.length>m)PT.splice(0,PT.length-m)}
 for(let k=FX.length-1;k>=0;k--){const f=FX[k],p=Math.max(0,(now-f.t0)/f.dur);if(p>=1){FX.splice(k,1);continue}
  ctx.globalAlpha=1-p;
  if(f.type==='tracer')line(f.x1,f.y1,f.x1+(f.x2-f.x1)*Math.min(1,p*3),f.y1+(f.y2-f.y1)*Math.min(1,p*3),f.c,f.w);
  if(f.type==='flash')circ(f.x,f.y,f.r*(1-p*.5),f.c);
  if(f.type==='swing'){ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,18,f.a-1+p*1.6,f.a-.4+p*1.6);ctx.stroke()}
  if(f.type==='fly'){const e=p*p,x=f.x1+(f.x2-f.x1)*e,y=f.y1+(f.y2-f.y1)*e;ctx.globalAlpha=1;if(!drawSpr(f.k,x,y,0,0,1.45*(1-.5*p)))circ(x,y,12*(1-.5*p),CATC[(Z.U[f.k]||{}).cat]||'#f2c23d')}
  if(f.type==='gone'){ctx.save();ctx.globalAlpha=1-p;ctx.translate(f.x,f.y);ctx.rotate(p*.9);ctx.translate(0,p*8);if(!drawSpr(f.k,0,0,0,0,1.45*(1-.3*p)))circ(0,0,12*(1-p),'rgba(200,190,160,.8)');ctx.restore()}
  if(f.type==='shards')try{const g=.0009,dt=now-f.t0;ctx.globalAlpha=Math.min(1,(1-p)*1.6);for(const q of f.s){const x=f.x+q.vx*dt,y=f.y+q.vy*dt+g*dt*dt;ctx.save();ctx.translate(x,y);ctx.rotate(q.a+q.va*dt);ctx.fillStyle=q.c;ctx.beginPath();ctx.moveTo(-q.r,-q.r*.6);ctx.lineTo(q.r,-q.r*.3);ctx.lineTo(q.r*.2,q.r*.8);ctx.closePath();ctx.fill();ctx.restore()}}catch(e){}
  if(f.type==='fn')try{ctx.save();f.fn(p,now);ctx.restore()}catch(e){}
  if(f.type==='ring'&&p>0){ctx.strokeStyle=f.c;ctx.lineWidth=3*(1-p);ctx.beginPath();ctx.arc(f.x,f.y,f.r*p,0,7);ctx.stroke()}
  ctx.globalAlpha=1}
 for(let k=PT.length-1;k>=0;k--){const q=PT[k],p=Math.max(0,(now-q.t0)/q.dur);if(p>=1){PT.splice(k,1);continue}const dt=now-q.t0;
  ctx.globalAlpha=1-p;circ(q.x+q.vx*dt,q.y+q.vy*dt,q.r*(1-p*.5),q.c);ctx.globalAlpha=1}
}
const floats=[];
function floatTxt(x,y,txt,c,sz){floats.push({x,y,txt,c,sz:sz||13,t0:performance.now()})}
function drawFloats(now){ctx.textAlign='center';
 for(let k=floats.length-1;k>=0;k--){const f=floats[k],p=(now-f.t0)/(f.dur||(f.sz>13?1400:700));if(p>=1){floats.splice(k,1);continue}if(p<0)continue;
  ctx.font=`bold ${f.sz}px "Atkinson Hyperlegible",system-ui,sans-serif`;if(!f.cx){const w=ctx.measureText(f.txt).width/2+(f.bg?8:4);f.x=Math.max(w,Math.min(L-w,f.x));f.cx=1}
  const tx=f.txt,yy=f.tw?f.y-18-Math.max(0,p-.5)*24:f.y-18-p*18;let cl=0;
  // machine à écrire : le texte entier est dessiné, découvert de gauche à droite (jamais de mot coupé dans le texte)
  if(f.tw){const q=Math.min(1,(now-f.t0)/f.tw);if(q<1){const w=ctx.measureText(tx).width;ctx.save();ctx.beginPath();ctx.rect(f.x-w/2-2,yy-f.sz-4,(w+4)*q,f.sz+10);ctx.clip();cl=1}}
  ctx.globalAlpha=f.tw?Math.min(1,(1-p)*2.5):1-p;if(f.bg){const w=ctx.measureText(tx).width+12;ctx.fillStyle='rgba(16,11,6,.82)';ctx.fillRect(f.x-w/2,yy-f.sz+1,w,f.sz+6);ctx.strokeStyle=f.c;ctx.lineWidth=1;ctx.strokeRect(f.x-w/2,yy-f.sz+1,w,f.sz+6)}ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(tx,f.x+1,yy+1);ctx.fillStyle=f.c;ctx.fillText(tx,f.x,yy);ctx.globalAlpha=1;if(cl)ctx.restore()}}

// v158 : jeux de lumière (décor seulement, hors des règles) : le jour, soleil chaud, rayons qui filtrent des arbres et ombres de nuages ;
// au crépuscule et à l'aube, lumière dorée rasante ; la nuit, clair de lune bleuté et halos colorés autour des lumières
function mkGlow(rgb,mid){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
 g.addColorStop(0,`rgba(${rgb},1)`);g.addColorStop(mid||.4,`rgba(${rgb},.42)`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.fillRect(0,0,64,64);return c}
const GLW={warm:mkGlow('255,130,30'),fire:mkGlow('255,90,30'),cold:mkGlow('170,210,255'),red:mkGlow('255,40,40'),cloud:mkGlow('16,30,40',.55),tint:mkGlow('255,170,110',.5)};
const SKY={};
function drawSky(now){const day=1-nightAmt,t=reduce?0:now;ctx.save();
 if(day>.02){
  // soleil chaud en haut à gauche, ombre fraîche en bas à droite
  if(!SKY.sun){SKY.sun=ctx.createRadialGradient(L*.08,L*.04,0,L*.08,L*.04,L*1.05);SKY.sun.addColorStop(0,'rgba(255,226,150,.3)');SKY.sun.addColorStop(.5,'rgba(255,214,140,.09)');SKY.sun.addColorStop(1,'rgba(255,214,140,0)');
   SKY.cool=ctx.createLinearGradient(L*.3,L*.3,L,L);SKY.cool.addColorStop(0,'rgba(20,40,80,0)');SKY.cool.addColorStop(1,'rgba(20,40,80,.16)')}
  ctx.globalAlpha=day;ctx.globalCompositeOperation='lighter';ctx.fillStyle=SKY.sun;ctx.fillRect(0,0,L,L);
  ctx.globalCompositeOperation='source-over';ctx.fillStyle=SKY.cool;ctx.fillRect(0,0,L,L);
  // rayons de soleil qui filtrent entre les arbres, ils ondulent doucement
  ctx.globalCompositeOperation='lighter';ctx.translate(0,0);ctx.rotate(-.62);
  for(let k=0;k<(OPT.eco?2:4);k++){const x=L*(.05+k*.24)+Math.sin(t/4200+k*2)*10,w=18+k%2*16,g=ctx.createLinearGradient(x-w,0,x+w,0);
   g.addColorStop(0,'rgba(255,240,180,0)');g.addColorStop(.5,`rgba(255,240,180,${(.08+.035*Math.sin(t/2600+k))*day})`);g.addColorStop(1,'rgba(255,240,180,0)');
   ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(x-w,-L,2*w,L*3)}
  ctx.setTransform(...CAM);ctx.globalCompositeOperation='source-over';
  // ombres de nuages qui glissent lentement sur le plateau
  for(let k=0;k<(OPT.eco?1:3);k++){const w=L*(.55+k*.15),h=w*.62,x=((k*L*.7+t*(.006+k*.002))%(L+w*1.4))-w*.7,y=L*(.15+k*.33)+Math.sin(t/9000+k)*20;
   ctx.globalAlpha=.3*day;ctx.drawImage(GLW.cloud,x-w/2,y-h/2,w,h)}}
 // crépuscule et aube : lumière dorée rasante, au plus fort à mi-chemin entre le jour et la nuit
 const dusk=Math.sin(clamp(nightAmt,0,1)*Math.PI);if(dusk>.03){
  if(!SKY.dusk){SKY.dusk=ctx.createLinearGradient(0,L,L,0);SKY.dusk.addColorStop(0,'rgb(255,160,90)');SKY.dusk.addColorStop(.55,'rgb(240,140,150)');SKY.dusk.addColorStop(1,'rgb(140,120,200)')}
  ctx.globalAlpha=dusk*.55;ctx.globalCompositeOperation='multiply';ctx.fillStyle=SKY.dusk;ctx.fillRect(0,0,L,L);
  if(!SKY.low){SKY.low=ctx.createRadialGradient(0,L,0,0,L,L*1.1);SKY.low.addColorStop(0,'rgba(255,150,60,.3)');SKY.low.addColorStop(1,'rgba(255,150,60,0)')}
  ctx.globalAlpha=dusk;ctx.globalCompositeOperation='lighter';ctx.fillStyle=SKY.low;ctx.fillRect(0,0,L,L)}
 // nuit : tout prend une teinte bleu lune
 if(nightAmt>.03){ctx.globalAlpha=nightAmt*.7;ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb(95,120,190)';ctx.fillRect(0,0,L,L)}
 ctx.restore()}
function drawGlow(now){if(nightAmt<.03)return;const n=nightAmt;ctx.save();ctx.globalCompositeOperation='lighter';
 // clair de lune venu du haut à droite
 if(!SKY.moon){SKY.moon=ctx.createRadialGradient(L*.92,L*.05,0,L*.92,L*.05,L*.95);SKY.moon.addColorStop(0,'rgba(110,140,210,.2)');SKY.moon.addColorStop(1,'rgba(110,140,210,0)')}
 ctx.globalAlpha=n;ctx.fillStyle=SKY.moon;ctx.fillRect(0,0,L,L);
 // halos colorés : chaud pour l'abri, le feu et les tirs, froid pour les projecteurs, rouge pour la sirène
 for(const l of lights(now)){const g=GLW[l.c||'warm'];if(l.c==='warm'||l.c==='fire'){const r=l.r;ctx.globalCompositeOperation='multiply';ctx.globalAlpha=Math.min(1,n*(l.a||.2)*2.2);ctx.drawImage(GLW.tint,l.x-r,l.y-r,2*r,2*r);ctx.globalCompositeOperation='lighter'}ctx.globalAlpha=Math.min(1,n*(l.a||.2)*1.5);const r=l.r*1.15;ctx.drawImage(g,l.x-r,l.y-r,2*r,2*r)}
 ctx.restore()}
function lights(now){
 const ls=[{x:CEN.x,y:CEN.y,r:T*(2.1+(reduce?0:.05*Math.sin(now/110)*Math.sin(now/43))),c:'warm',a:.32}];
 const pow=powered();
 G.grid.forEach((u,i)=>{if(!u)return;const p=tc(i);
  if(u.t==='lamp'&&pow){const d=Math.atan2(p.y-CEN.y,p.x-CEN.x);ls.push({x:p.x+Math.cos(d)*40,y:p.y+Math.sin(d)*40,r:T*1.5,c:'cold',a:.28});ls.push({x:p.x,y:p.y,r:T*.8,c:'cold'})}
  else if(u.t==='siren')ls.push({x:p.x,y:p.y,r:T*(Math.floor(now/300)%2?1.2:.9),c:'red',a:.3});
  else if(u.t==='fire'&&S.busy&&G.event.id!=='pluie')ls.push({x:p.x,y:p.y,r:T*(1.05+Math.sin(now/80+i)*.08),c:'fire',a:.34});
  else ls.push({x:p.x,y:p.y,r:T*.95,a:.1})});
 FX.forEach(f=>{if(f.light){const p=(now-f.t0)/f.dur;if(p<1)ls.push({x:f.x,y:f.y,r:f.light*(1-p),c:'fire',a:.4})}});
 PT.forEach(q=>{if(q.light)ls.push({x:q.x,y:q.y,r:q.light,c:'fire',a:.3})});
 // v115 : au plus 24 lumières (12 en mode économie) : l'abri et les unités d'abord, puis les effets
 return ls.slice(0,OPT.eco?12:24);
}
// v115 : l'obscurité se dessine à mi-résolution (les lumières sont des dégradés doux, la différence ne se voit pas) et chaque lumière
// réutilise un même disque dégradé préparé une fois, au lieu d'un dégradé recalculé par lumière et par image
const LIGHT=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);
 g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.55,'rgba(0,0,0,.7)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return c})();
// v156 : ambiance de nuit animée (décor seulement, hors des règles) : brume qui dérive, lucioles dans la forêt, chauves-souris
const FOG=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
 g.addColorStop(0,'rgba(190,205,225,1)');g.addColorStop(1,'rgba(190,205,225,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return c})();
const FLY=(()=>{const r=rng(77),a=[];for(let k=0;k<16;k++){const s=Math.floor(r()*4),u=r()*L,d=r()*T*.85;a.push({x:s===0?u:s===1?u:s===2?d:L-d,y:s===0?d:s===1?L-d:s===2?u:u,ph:r()*7,sp:.6+r()*.8})}return a})();
const BATS=[];let batNext=0;
function drawFog(now){if(nightAmt<.05)return;const n=OPT.eco?3:6;ctx.save();
 for(let k=0;k<n;k++){const w=L*.75,sp=reduce?0:.006+k*.0017,x=((k*L*.37+now*sp)%(L+w))-w/2,y=L*(.12+k*.15)+Math.sin(now/5000+k)*12;
  ctx.globalAlpha=.07*nightAmt;ctx.drawImage(FOG,x-w/2,y-w*.16,w,w*.32)}ctx.restore()}
function drawAmbient(now){if(nightAmt<.05)return;ctx.save();
 // lucioles : de petits points verts qui clignotent et flottent dans la forêt
 ctx.globalCompositeOperation='lighter';const nf=['foret','automne','montagne'].includes(BIOME)?(OPT.eco?6:FLY.length):0;
 for(let k=0;k<nf;k++){const f=FLY[k],t=now/1000*f.sp,b=Math.max(0,Math.sin(t*1.6+f.ph));if(b<.05)continue;
  const x=f.x+(reduce?0:Math.sin(t+f.ph)*9),y=f.y+(reduce?0:Math.cos(t*.8+f.ph*2)*7),a=b*b*nightAmt;
  ctx.globalAlpha=a*.25;circ(x,y,4.5,'#d8f56a');ctx.globalAlpha=a;circ(x,y,1.4,'#f4ffb0')}
 ctx.globalCompositeOperation='source-over';
 // chauves-souris : un petit groupe traverse le ciel de temps en temps, ailes battantes
 if(!reduce){if(now>=batNext){batNext=now+(BATS.length?7000:2500)+Math.random()*9000;const n=1+Math.floor(Math.random()*3),a=Math.random()*7,
   x0=CEN.x+Math.cos(a)*L*.75,y0=CEN.y+Math.sin(a)*L*.75,x1=CEN.x-Math.cos(a+(Math.random()-.5))*L*.75,y1=CEN.y-Math.sin(a+(Math.random()-.5))*L*.75;
   for(let k=0;k<n;k++)BATS.push({x0:x0+(Math.random()-.5)*40,y0:y0+(Math.random()-.5)*40,x1:x1+(Math.random()-.5)*40,y1:y1+(Math.random()-.5)*40,t0:now+k*220,dur:3600+Math.random()*1400,ph:Math.random()*7,c:(Math.random()-.5)*90})}
  for(let k=BATS.length-1;k>=0;k--){const b=BATS[k],p=(now-b.t0)/b.dur;if(p>=1){BATS.splice(k,1);continue}if(p<0)continue;
   const dx=b.x1-b.x0,dy=b.y1-b.y0,d=Math.hypot(dx,dy)||1,bend=Math.sin(p*Math.PI)*b.c,x=b.x0+dx*p-dy/d*bend+Math.sin(now/260+b.ph)*4,y=b.y0+dy*p+dx/d*bend+Math.cos(now/200+b.ph)*3,
    fl=Math.sin(now/55+b.ph);ctx.globalAlpha=.85*nightAmt*Math.min(1,Math.sin(p*Math.PI)*4);ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx)+Math.PI/2);
   ctx.fillStyle='#0b0a10';ctx.strokeStyle='rgba(150,160,190,.35)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(0,-2.5);
   ctx.quadraticCurveTo(-5,-3-fl*3,-10,fl*4);ctx.quadraticCurveTo(-5,1,0,2.5);ctx.quadraticCurveTo(5,1,10,fl*4);ctx.quadraticCurveTo(5,-3-fl*3,0,-2.5);ctx.fill();ctx.stroke();ctx.restore()}}
 ctx.restore()}
function drawDark(now){
 if(nightAmt<.01)return;const k=dark.width/L;
 dctx.setTransform(1,0,0,1,0,0);dctx.globalCompositeOperation='source-over';dctx.clearRect(0,0,dark.width,dark.height);
 const dq=(now-dawnT)/DAWN,dawn=dq>=0&&dq<1&&nightTarget===0;
 if(dawn){const gr=dctx.createLinearGradient(0,0,dark.width,0),fx=1-dq*1.35;for(let k=0;k<=8;k++){const s=k/8;gr.addColorStop(s,`rgba(4,7,18,${.8*clamp((fx+.3-s)/.3,0,1)})`)}dctx.fillStyle=gr}
 else dctx.fillStyle=`rgba(4,7,18,${.8*nightAmt})`;
 dctx.fillRect(0,0,dark.width,dark.height);
 dctx.setTransform(k,0,0,k,0,0);dctx.globalCompositeOperation='destination-out';
 for(const l of lights(now))dctx.drawImage(LIGHT,l.x-l.r,l.y-l.r,2*l.r,2*l.r);
 ctx.save();ctx.setTransform(...CAMZ);ctx.drawImage(dark,0,0,cv.width,cv.height);ctx.restore();
 ctx.save();ctx.globalCompositeOperation='lighter';const r=T*1.6,g=ctx.createRadialGradient(CEN.x,CEN.y,0,CEN.x,CEN.y,r);g.addColorStop(0,`rgba(255,170,60,${.12*nightAmt*(reduce?1:1+.25*Math.sin(now/90)*Math.sin(now/37))})`);g.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g;ctx.fillRect(CEN.x-r,CEN.y-r,2*r,2*r);ctx.restore();
 if(dawn)try{const sx=L+T*.4,sy=L*(.85-.5*dq),R=L*.95,a=.5*Math.sin(dq*Math.PI),sg=ctx.createRadialGradient(sx,sy,0,sx,sy,R);sg.addColorStop(0,`rgba(255,214,140,${a})`);sg.addColorStop(.35,`rgba(255,150,70,${a*.5})`);sg.addColorStop(1,'rgba(255,120,60,0)');
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=sg;ctx.fillRect(0,0,L,L);ctx.restore()}catch(e){}
}
function frame(now){
 requestAnimationFrame(frame);
 try{frameInner(now)}catch(e){ctx.restore&&ctx.setTransform(1,0,0,1,0,0);if(!frame.err){frame.err=1;console.error(e)}}
}
// décor propre à chaque lieu, par-dessus le sol commun
function drawPlace(now){const pl=G.place;
 if(pl==='ferme'){ctx.fillStyle='#24465a';ctx.fillRect(0,0,L,T*.8);ctx.strokeStyle='rgba(160,200,220,.35)';ctx.lineWidth=1.5;for(let k=0;k<6;k++){const y=8+k*8,o=(now/40+k*30)%60;ctx.beginPath();for(let x=-60+o;x<L;x+=60){ctx.moveTo(x,y);ctx.lineTo(x+22,y)}ctx.stroke()}
  ctx.fillStyle='rgba(120,140,60,.18)';for(let r=1;r<Z.N-1;r++)ctx.fillRect(T,r*T+T/2-2,L-2*T,4)}
 if(pl==='station'){ctx.fillStyle='rgba(120,120,115,.35)';ctx.fillRect(T,T,L-2*T,L-2*T);ctx.strokeStyle='rgba(230,200,60,.35)';ctx.lineWidth=2;ctx.setLineDash([10,8]);ctx.strokeRect(T*1.5,T*1.5,L-3*T,L-3*T);ctx.setLineDash([]);
  [[T*1.2,L-T*1.4],[L-T*1.6,T*1.2]].forEach(([x,y])=>{ctx.fillStyle='#8e2d2a';ctx.fillRect(x,y,14,20);ctx.fillStyle='#ddd';ctx.fillRect(x+3,y+3,8,6)})}
 if(pl==='mall'){ctx.fillStyle='rgba(90,95,100,.45)';ctx.fillRect(T,T,L-2*T,L-2*T);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1.5;for(let c=1;c<Z.N;c++){ctx.beginPath();ctx.moveTo(c*T,T);ctx.lineTo(c*T,T*1.6);ctx.moveTo(c*T,L-T);ctx.lineTo(c*T,L-T*1.6);ctx.stroke()}}
}
// v139 : écran d'accueil vivant : la nuit tombe sur la maison et quelques zombies rôdent (décor, hors des règles)
let TTL=false,decoOn=0,decoNext=0;const DECO=[];let decoId=900000;
function titleDeco(now){
 if(TTL&&!ov.hidden&&!S.busy){nightTarget=.85;
  if(!decoOn){decoOn=1;decoNext=0}
  if(DECO.length<6&&now>=decoNext){decoNext=now+(DECO.length<3?150:1400+Math.random()*1200);const ks=Z.ZK.filter(k=>!Z.ZT[k].boss),k=ks[Math.floor(Math.random()*ks.length)],a=Math.random()*Math.PI*2,r=L*(.3+Math.random()*.22),p={x:CEN.x+Math.cos(a)*r,y:CEN.y+Math.sin(a)*r};
   const v={id:++decoId,k,pos:-1,from:p,to:p,t0:now,dur:1,hp:1,max:1,born:now,deco:1};V.set(v.id,v);DECO.push(v)}
  for(let n=DECO.length-1;n>=0;n--){const v=DECO[n];if(now-v.t0<v.dur)continue;const p=v.to,dx=CEN.x-p.x,dy=CEN.y-p.y,d=Math.hypot(dx,dy)||1;
   if(d<L*.2){v.dying=now;v.dx=p.x;v.dy=p.y;DECO.splice(n,1);continue}
   const st=18+Math.random()*14,sd=(Math.random()-.5)*30;v.from=p;v.to={x:p.x+dx/d*st-dy/d*sd,y:p.y+dy/d*st+dx/d*sd};v.t0=now+Math.random()*900;v.dur=(Z.ZT[v.k].spd===1?1100:2200)}
 }else if(decoOn){decoOn=0;DECO.forEach(v=>{if(!v.dying){const p=zpos(v,now);v.dying=now;v.dx=p.x;v.dy=p.y}});DECO.length=0;if(!S.busy)nightTarget=0}}
function frameInner(now){
 const dt=Math.min(50,now-last);last=now;fit();try{titleDeco(now)}catch(e){}
 nightAmt+=(nightTarget-nightAmt)*Math.min(1,dt/450);{const dq=(now-dawnT)/DAWN;if(dq>=0&&dq<1&&nightTarget===0)nightAmt=Math.max(nightAmt,1-dq)}SFX.night(nightAmt);
 let sx=0,sy=0;if(now-shakeT<260&&!reduce){const k=(1-(now-shakeT)/260)*shakeK;sx=(Math.random()-.5)*k;sy=(Math.random()-.5)*k}
 {let zm=1,ox=0,oy=0;if(zoomFX){const q=(now-zoomFX.t0)/zoomFX.dur;if(q>=1||q<0)zoomFX=null;else{const e=q<.15?q/.15:q>.55?(1-q)/.45:1;zm=1+zoomFX.k*e*e*(3-2*e);ox=zoomFX.x*(1-zm);oy=zoomFX.y*(1-zm)}}
 CAM=[SC*zm,0,0,SC*zm,(sx+ox)*SC,(sy+oy)*SC];CAMZ=[zm,0,0,zm,ox*SC,oy*SC];ctx.setTransform(...CAM)}
 BARS=[];EYES=[];LABELS=[];
 ctx.drawImage(ground,0,0,L,L);try{drawPlace(now)}catch(e){}ctx.drawImage(decal,0,0,L,L);
 if(!S.busy&&S.drag){const t=selCard();ctx.fillStyle='rgba(242,179,61,.28)';ctx.strokeStyle='#f2b33d';ctx.lineWidth=2;S.drag.cells.forEach(j=>{const p=tc(j);ctx.fillRect(p.x-T/2+3,p.y-T/2+3,T-6,T-6);ctx.strokeRect(p.x-T/2+3,p.y-T/2+3,T-6,T-6)});
  const q=tc(S.drag.cells[S.drag.cells.length-1]);safeTxt(q.x,q.y+5,_t`${S.drag.cells.length}/${Z.charges(G,t,selReuse())} · ${Z.lineCost(G,t,S.drag.cells.length,selReuse())} énergie`,'#fff')}
 if(!S.busy){
  const t=selCard(),mv=S.moveFrom;
  if(mv!==null){const p=tc(mv);ctx.strokeStyle='#7cc7ff';ctx.lineWidth=2.5;ctx.strokeRect(p.x-T/2+2,p.y-T/2+2,T-4,T-4)}
  const bs=S.bsel;
  for(const i of Z.INNER){const p=tc(i);if(bs!=null&&Z.canPlaceBench(G,bs,i)){ctx.strokeStyle='rgba(158,224,138,.8)';ctx.lineWidth=1.5;ctx.setLineDash([4,4])}else if(mv!==null&&Z.canMove(G,mv,i)){ctx.strokeStyle='rgba(124,199,255,.75)';ctx.lineWidth=1.5;ctx.setLineDash([4,4])}else if(t&&Z.canPlace(G,t,i)){ctx.strokeStyle='rgba(242,179,61,.7)';ctx.lineWidth=t==='kit'?2:1;ctx.setLineDash([4,4])}else{ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;ctx.setLineDash([])}ctx.strokeRect(p.x-T/2+2,p.y-T/2+2,T-4,T-4)}
  ctx.setLineDash([]);
  if(t&&Z.canPlace(G,t,Z.C)){ctx.strokeStyle='rgba(242,179,61,.8)';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.strokeRect(CEN.x-T/2-4,CEN.y-T/2-4,T+8,T+8);ctx.setLineDash([])}
 }
 const safe=f=>{ctx.save();try{f()}catch(e){}ctx.restore()};
 try{trackBoard(now)}catch(e){}
 safe(()=>drawKillZones(now));
 safe(()=>drawShelter(now));
 safe(()=>drawBossRoute(now));
 safe(()=>drawGuide(now));
 safe(()=>drawWires());
 G.grid.forEach((u,i)=>{if(u&&!Z.U[u.t].block&&u.t!=='wire')safe(()=>drawUnit(i,u,now))});
 const zs=[...V.values()].sort((a,b)=>zpos(a,now).y-zpos(b,now).y);
 zs.forEach(v=>safe(()=>{if(!drawZombie(v,now))V.delete(v.id)}));
 const ramp=new Set();safe(()=>drawRamparts(ramp));
 // zone de tir d'une unité touchée (portée 2 et plus : un losange)
 safe(()=>{const k=S.inspect??S.moveFrom;const u=k!=null&&G.grid[k];if(!u||S.busy)return;const D=Z.stat(G,u.t),hr=D.hrng>1,rg=hr?D.hrng:D.rng;if(!(rg>1))return;
  // portée de tir en jaune, portée de soin en vert
  ctx.fillStyle=hr?'rgba(126,224,138,.13)':'rgba(242,179,61,.13)';ctx.strokeStyle=hr?'rgba(126,224,138,.55)':'rgba(242,179,61,.55)';ctx.lineWidth=1.5;for(let j=0;j<Z.N*Z.N;j++)if(j!==k&&Z.inRange(j,k,rg)){const p=tc(j);ctx.fillRect(p.x-T/2+2,p.y-T/2+2,T-4,T-4);ctx.strokeRect(p.x-T/2+2,p.y-T/2+2,T-4,T-4)}});
 safe(()=>{const k=S.inspect??S.moveFrom;const u=k!=null&&G.grid[k];if(!u||Z.roleOf(u.t)!=='tank'||S.busy)return;const p=tc(k),r=(Z.TAUNT+.5)*T;
  ctx.strokeStyle='rgba(229,72,77,.6)';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.strokeRect(p.x-r,p.y-r,2*r,2*r);ctx.setLineDash([]);ctx.fillStyle='rgba(229,72,77,.06)';ctx.fillRect(p.x-r,p.y-r,2*r,2*r)});
 G.grid.forEach((u,i)=>{if(u&&Z.U[u.t].block&&!ramp.has(i))safe(()=>drawUnit(i,u,now))});
 drawFX(now);
 safe(()=>drawFog(now));
 safe(()=>drawSky(now));
 drawDark(now);
 safe(()=>drawEdgeNight(now));
 safe(()=>drawGlow(now));
 safe(()=>drawAmbient(now));
 if(nightAmt>.05){ctx.save();ctx.shadowColor='#ff2a2a';ctx.shadowBlur=6;for(const[x,y,nx,ny,sz,al]of EYES){ctx.globalAlpha=al*nightAmt;circ(x+nx*2*sz,y+ny*2*sz,1.3*sz,'#ff4a3a');circ(x-nx*2*sz,y-ny*2*sz,1.3*sz,'#ff4a3a')}ctx.restore()}
 drawBars();
 ctx.save();ctx.font='bold 10px "Atkinson Hyperlegible",system-ui,sans-serif';ctx.textAlign='center';for(const[x,y,n]of LABELS){const w=ctx.measureText(n).width+8;ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x-w/2+1,y-9,w,13);ctx.fillStyle='#efe3c6';ctx.fillRect(x-w/2,y-10,w,13);ctx.strokeStyle='rgba(90,70,40,.8)';ctx.lineWidth=.8;ctx.strokeRect(x-w/2+.5,y-9.5,w-1,12);ctx.fillStyle='#2b1a0c';ctx.fillText(n,x,y)}ctx.restore();
 safe(()=>dmgLinks(now));safe(()=>placeHints(now));
 drawFloats(now);
 if(KC.on&&KC.n){ctx.save();const q=clamp((now-KC.t)/300,0,1),k=1+.5*(1-q);ctx.translate(30,22);ctx.scale(k,k);ctx.font='bold 16px "Special Elite",system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillText(KC.n,9,6);ctx.fillStyle=q<1?'#ffd25a':'#ebe7da';ctx.fillText(KC.n,8,5);glyph('skull',-12,0,14,q<1?'#ffd25a':'#ebe7da',2.2);ctx.restore()}
 if(now-hurtT<400){ctx.save();ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.width*.3,cv.width/2,cv.height/2,cv.width*.75);g.addColorStop(0,'rgba(229,72,77,0)');g.addColorStop(1,`rgba(229,72,77,${.45*(1-(now-hurtT)/400)})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);ctx.restore()}
}

const powered=()=>G.event.id!=='coupure'||G.relics.includes('groupe')||G.grid.some(u=>u&&u.t==='solar');
function safeTxt(x,y,t,c){ctx.font='bold 14px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(t,x+1,y+1);ctx.fillStyle=c;ctx.fillText(t,x,y)}

/* v181 : pion d'une carte spéciale (édition) : halo et anneau reconnaissables la nuit. Économie : sans animation. */
function edAura(x,y,e,now,i){const eco=OPT&&OPT.eco,t=eco?0:now,pl=.5+.5*Math.sin(t/420+i);ctx.save();
 const glow=(c,r,a)=>{const g=ctx.createRadialGradient(x,y,r*.35,x,y,r);g.addColorStop(0,c.replace('A',a));g.addColorStop(1,c.replace('A',0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()};
 const ring=(c,w,r)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.stroke()};
 if(e==='dor'){glow('rgba(255,200,60,A)',36,.55+.2*pl);ring('#f5c542',2.5,29);ring('rgba(255,247,200,.9)',1,31);
  for(let k=0;k<3;k++){const a=t/900+k*2.1,r=31,sx=x+Math.cos(a)*r,sy=y+Math.sin(a)*r,s=2+1.5*Math.abs(Math.sin(t/300+k));ctx.fillStyle='#fff6c8';ctx.beginPath();ctx.moveTo(sx,sy-s*2);ctx.lineTo(sx+s*.5,sy);ctx.lineTo(sx,sy+s*2);ctx.lineTo(sx-s*.5,sy);ctx.closePath();ctx.fill()}}
 else if(e==='arm'){ring('#59626a',5,29);ring('#d5dbe0',2,29);for(let k=0;k<4;k++){const a=Math.PI/4+k*Math.PI/2;ctx.fillStyle='#eef2f5';ctx.beginPath();ctx.arc(x+Math.cos(a)*29,y+Math.sin(a)*29,2.6,0,7);ctx.fill();ctx.strokeStyle='#2f363b';ctx.lineWidth=1;ctx.stroke()}}
 else if(e==='fan'){glow('rgba(130,230,255,A)',38,.45+.2*pl);ctx.setLineDash([4,4]);ctx.lineDashOffset=-t/60;ring('rgba(160,235,255,.85)',1.5,30);ctx.setLineDash([])}
 else if(e==='holo'){const n=12,o=t/1400;for(let k=0;k<n;k++){ctx.strokeStyle='hsl('+Math.round(k*360/n)+',95%,62%)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,29,o+k*2*Math.PI/n,o+(k+1)*2*Math.PI/n+.02);ctx.stroke()}glow('rgba(190,140,255,A)',36,.3+.15*pl)}
 else if(e==='sang'){glow('rgba(220,20,10,A)',42,.6+.2*pl);ring('#5a0805',2,35);ring('#d0281a',3,32);for(let k=0;k<4;k++){const a=Math.PI*(.15+k*.23),dx=x+Math.cos(a)*33,dy=y+Math.sin(a)*33,h=4+3*Math.abs(Math.sin(t/800+k));ctx.fillStyle='#a10c07';ctx.fillRect(dx-1.2,dy,2.4,h);ctx.beginPath();ctx.arc(dx,dy+h,1.8,0,7);ctx.fill()}}
 ctx.restore()}
/* v189 : bonus de dégâts lisibles sur la carte */
// cache des dégâts de chaque case (recalculé au plus 4 fois par seconde)
let DMGC={t:-1e9,m:new Map()};
function dmgCached(i,now){if(now-DMGC.t>250||now<DMGC.t)DMGC={t:now,m:new Map()};if(!DMGC.m.has(i))DMGC.m.set(i,dmgInfo(i));return DMGC.m.get(i)}
// petite étiquette arrondie (texte coloré sur fond sombre)
function bTag(x,y,txt,c,fs){ctx.font=`bold ${fs||11}px system-ui,sans-serif`;const w=ctx.measureText(txt).width+9,h=(fs||11)+4;ctx.beginPath();ctx.arc(x-w/2+h/2,y,h/2,Math.PI/2,Math.PI*1.5);ctx.arc(x+w/2-h/2,y,h/2,-Math.PI/2,Math.PI/2);ctx.closePath();
 ctx.fillStyle='rgba(16,11,6,.9)';ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=c;ctx.textAlign='center';ctx.fillText(txt,x,y+(fs||11)*.36)}
// pastille ⚔ sous chaque unité qui attaque : blanche sans bonus, dorée avec bonus
function dmgBadge(i,p,D,now){if(!D.dmg||!D.rng)return;const di=dmgCached(i,now);if(!di)return;const up=di.bonus>0,x=p.x-19,y=p.y+20,txt=String(di.total);
 ctx.font='bold 10px system-ui,sans-serif';const w=ctx.measureText(txt).width+17;ctx.fillStyle='rgba(10,8,5,.85)';ctx.fillRect(x-w/2,y-6.5,w,13);
 ctx.strokeStyle=up?'#f2c23d':'rgba(255,255,255,.3)';ctx.lineWidth=up?1.6:1;ctx.strokeRect(x-w/2,y-6.5,w,13);
 glyph('sword',x-w/2+6.5,y,9,up?'#ffd25a':'#ddd',2.6);ctx.fillStyle=up?'#ffd25a':'#fff';ctx.textAlign='center';ctx.fillText(txt,x+5,y+3.6)}
// unité touchée (le jour) : un trait coloré relie chaque source de bonus à l'unité, avec son « +1 »
function dmgLinks(now){const k=S.inspect??S.moveFrom;if(k==null||S.busy||!G.grid[k])return;const di=dmgCached(k,now);if(!di)return;const q=tc(k),pu=.5+.5*Math.sin(now/220);
 const arrow=(p,c)=>{const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,a0=T*.3,a1=d-T*.28-pu*T*.06;if(a1<=a0)return;
  const ax=p.x+ux*a0,ay=p.y+uy*a0,bx=p.x+ux*a1,by=p.y+uy*a1,h=7,w=5;ctx.lineCap='round';ctx.lineJoin='round';
  for(const[col,lw]of[['rgba(0,0,0,.75)',6],[c,3]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx-ux*h*.6,by-uy*h*.6);ctx.stroke();
   ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(bx+ux*(lw>3?2:0),by+uy*(lw>3?2:0));ctx.lineTo(bx-ux*h-uy*(w+(lw>3?1.5:0)),by-uy*h+ux*(w+(lw>3?1.5:0)));ctx.lineTo(bx-ux*h+uy*(w+(lw>3?1.5:0)),by-uy*h-ux*(w+(lw>3?1.5:0)));ctx.closePath();ctx.fill()}};
 di.P.forEach(pt=>{const c=BONC[pt.k]||'#fff',n=pt.from.length,per=n&&pt.v%n===0?pt.v/n:0;pt.from.forEach((j,m)=>{const p=tc(j);
  ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=.6+.35*pu;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(p.x,p.y,T*.46,0,7);ctx.stroke();ctx.globalAlpha=1;arrow(p,c);ctx.restore();
  if(per||m===0)bTag(p.x,p.y-T*.44,'+'+(per||pt.v)+' ⚔',c)})})}
// carte choisie dans la main : chaque case où la poser fait gagner des dégâts affiche « +N ⚔ » (total gagné par toutes les unités)
let PGC={k:'',m:new Map()};
function placeGain(t){const key=t+'|'+G.grid.map(u=>u?u.t+(u.lvA||0):'').join(',')+'|'+(G.relics||[]).join()+'|'+G.night;if(PGC.k===key)return PGC.m;const m=new Map();PGC={k:key,m};
 const D=Z.stat(G,t);if(!D||D.instant||D.react||D.onUnit||D.equip||Z.isTrace(t))return m;const tt=Z.baseOf(t),ed=Z.edOf(t);
 const tot=()=>{const fl=Z.famLevels(G);let s=0;G.grid.forEach((u,j)=>{if(u&&Z.U[u.t]&&Z.stat(G,u.t).dmg)Z.dmgParts(G,j,fl).forEach(p=>{if(POSK.includes(p.k))s+=p.v})});return s};
 const s0=tot();for(const i of Z.INNER){if(G.grid[i]||!Z.canPlace(G,t,i))continue;G.grid[i]=ed?{t:tt,hp:1,ed}:{t:tt,hp:1};try{const g=tot()-s0;if(g>0)m.set(i,g)}catch(e){}finally{G.grid[i]=null}}return m}
function placeHints(now){if(S.busy)return;const t=selCard();if(!t||S.moveFrom!=null)return;placeGain(t).forEach((g,i)=>{const p=tc(i);bTag(p.x,p.y,'+'+g+' ⚔','#ffd25a',12)})}

