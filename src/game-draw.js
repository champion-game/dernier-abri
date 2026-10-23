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
function drawWoods(){const w=$('#woods');if(!w)return;const W=w.clientWidth,H=w.clientHeight;if(!W||!H||getComputedStyle(w).display==='none')return;
 const d=Math.min(2,devicePixelRatio||1);if(w.width===Math.round(W*d)&&w.height===Math.round(H*d))return;w.width=Math.round(W*d);w.height=Math.round(H*d);
 const g=w.getContext('2d');g.scale(d,d);const r=rng(23),m=cv.getBoundingClientRect(),o=w.getBoundingClientRect(),k=m.width/L,cx=m.left-o.left+m.width/2,cy=m.top-o.top+m.height/2;
 g.fillStyle='#2f4d22';g.fillRect(0,0,W,H);for(let i=0;i<W*H/80;i++){g.fillStyle=['#3a5c29','#26401b','#46693a'][Math.floor(r()*3)];g.globalAlpha=.6;g.fillRect(r()*W,r()*H,1+r()*2*k,1+r()*2*k)}g.globalAlpha=1;
 // les routes continuent hors du plateau
 dirtRoad(g,0,cy,W,cy,40*k,r,k);dirtRoad(g,cx,0,cx,H,40*k,r,k);
 // rochers, troncs et arbres serrés, en évitant la route
 const off=(x,y,m)=>Math.abs(y-cy)<20*k+m||Math.abs(x-cx)<20*k+m,step=20*k,tr=[];
 for(let n=0;n<W*H/(step*step*6);n++){const x=r()*W,y=r()*H;if(!off(x,y,8*k))r()<.5?rockDeco(g,x,y,(4+r()*4)*k,r):logDeco(g,x,y,(20+r()*12)*k,6*k,r()*3)}
 for(let y=-step;y<H+step;y+=step)for(let x=-step;x<W+step;x+=step){const px=x+(r()-.5)*step,py=y+(r()-.5)*step,sz=(12+r()*12)*k;if(off(px,py,sz*.7))continue;if(r()<.85)tr.push([px,py,sz])}
 tr.sort((a,b)=>a[1]-b[1]).forEach(([x,y,sz])=>leafTree(g,x,y,sz,r,k));
 g.fillStyle='rgba(8,14,6,.18)';g.fillRect(0,0,W,H)}
addEventListener('resize',()=>setTimeout(drawWoods,60));
/* ground, pre-rendered once */
const MIDN=(Z.N-1)/2;
// v157 : plateau lumineux façon jeu de société (herbe en damier, routes de terre, forêt feuillue en relief)
const TREEC=[['#1d3a14','#3f7a2a','#7cb446'],['#2a4512','#5a8a26','#98bd48'],['#15301a','#2f6634','#5e9c4c']];
function leafTree(g,x,y,s,r,k){k=k||1;const c=TREEC[Math.floor(r()*TREEC.length)],n=5+Math.floor(r()*3),pts=[[x,y,s*.62]];
 for(let i=0;i<n;i++){const a=i/n*6.283+r()*.7,d=s*(.3+r()*.25);pts.push([x+Math.cos(a)*d,y+Math.sin(a)*d,s*(.42+r()*.2)])}
 g.fillStyle='rgba(12,24,8,.4)';g.beginPath();g.ellipse(x+s*.3,y+s*.42,s*1.08,s*.92,0,0,7);g.fill();
 g.fillStyle='#14260c';pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px,py,pr+1.3*k,0,7);g.fill()});
 g.fillStyle=c[1];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px,py,pr,0,7);g.fill()});
 g.fillStyle=c[0];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px+pr*.22,py+pr*.28,pr*.55,0,7);g.fill()});
 g.fillStyle=c[1];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px-pr*.05,py-pr*.05,pr*.62,0,7);g.fill()});
 g.fillStyle=c[2];pts.forEach(([px,py,pr])=>{g.beginPath();g.arc(px-pr*.28,py-pr*.32,pr*.42,0,7);g.fill()});
 g.fillStyle='rgba(255,255,210,.35)';for(let i=0;i<4;i++){const p=pts[1+Math.floor(r()*(pts.length-1))];g.beginPath();g.arc(p[0]-p[2]*.4,p[1]-p[2]*.45,1.2*k,0,7);g.fill()}}
function rockDeco(g,x,y,s,r){g.fillStyle='rgba(10,20,6,.35)';g.beginPath();g.ellipse(x+s*.25,y+s*.35,s*1.05,s*.7,0,0,7);g.fill();
 g.fillStyle='#2a2c28';g.beginPath();g.ellipse(x,y,s+1.2,s*.78+1.2,r()*.6,0,7);g.fill();g.fillStyle='#8b8e87';g.beginPath();g.ellipse(x,y,s,s*.78,0,0,7);g.fill();
 g.fillStyle='#b9bcb2';g.beginPath();g.ellipse(x-s*.25,y-s*.25,s*.55,s*.36,-.4,0,7);g.fill();g.fillStyle='#6c6f69';g.beginPath();g.ellipse(x+s*.3,y+s*.3,s*.4,s*.22,0,0,7);g.fill()}
function logDeco(g,x,y,len,w,a){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='rgba(10,20,6,.35)';g.fillRect(-len/2+2,-w/2+3,len,w);
 g.fillStyle='#2b1c10';g.fillRect(-len/2-1,-w/2-1,len+2,w+2);g.fillStyle='#7a5230';g.fillRect(-len/2,-w/2,len,w);g.fillStyle='#93673e';g.fillRect(-len/2,-w/2,len,w*.35);
 g.fillStyle='#2b1c10';g.beginPath();g.ellipse(len/2,0,w*.32+1,w/2+1,0,0,7);g.fill();g.fillStyle='#c9a26a';g.beginPath();g.ellipse(len/2,0,w*.32,w/2,0,0,7);g.fill();
 g.strokeStyle='#8a6a40';g.lineWidth=.8;g.beginPath();g.ellipse(len/2,0,w*.17,w*.27,0,0,7);g.stroke();g.restore()}
function dirtRoad(g,x1,y1,x2,y2,w,r,k){k=k||1;const len=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/len,uy=(y2-y1)/len,st=3*k;
 const pass=(c,rad,j)=>{g.fillStyle=c;for(let d=0;d<=len;d+=st){const o=(r()-.5)*j;g.beginPath();g.arc(x1+ux*d-uy*o,y1+uy*d+ux*o,rad*(.9+r()*.2),0,7);g.fill()}};
 pass('#7d5d34',w/2+2*k,3*k);pass('#c19b63',w/2,2.5*k);
 for(let i=0;i<len*w/(14*k*k);i++){const d=r()*len,o=(r()-.5)*w*.85;g.fillStyle=['#d4b27a','#aa8551','#cfa96f'][Math.floor(r()*3)];g.globalAlpha=.7;g.fillRect(x1+ux*d-uy*o,y1+uy*d+ux*o,(1+r()*2)*k,(1+r()*2)*k)}g.globalAlpha=1;
 g.strokeStyle='rgba(120,84,44,.32)';g.lineWidth=2.4*k;g.beginPath();[-.2,.2].forEach(f=>{g.moveTo(x1-uy*w*f,y1+ux*w*f);g.lineTo(x2-uy*w*f,y2+ux*w*f)});g.stroke();
 for(let i=0;i<len/(9*k);i++){const d=r()*len,o=(r()-.5)*w*.8,x=x1+ux*d-uy*o,y=y1+uy*d+ux*o;g.fillStyle='#6f5232';g.beginPath();g.ellipse(x,y,(1+r()*1.6)*k,(.8+r()*1.1)*k,r()*3,0,7);g.fill()}
 // touffes d'herbe qui débordent sur les bords
 g.lineWidth=1.1*k;for(let i=0;i<len/(2.2*k);i++){const d=r()*len,s=r()<.5?-1:1,o=s*(w/2+(r()-.6)*4*k),x=x1+ux*d-uy*o,y=y1+uy*d+ux*o;g.strokeStyle=r()<.5?'#4f7f2c':'#79a845';g.beginPath();g.moveTo(x,y);g.lineTo(x-1.8*k,y-3.5*k);g.moveTo(x,y);g.lineTo(x+1.6*k,y-3.8*k);g.stroke()}}
const ground=document.createElement('canvas');ground.width=ground.height=L*2;
(function(){const g=ground.getContext('2d');g.scale(2,2);const r=rng(11),RW=40,M=L/2;
 const onRoad=(x,y,m)=>Math.abs(x-M)<RW/2+m||Math.abs(y-M)<RW/2+m;
 // forêt (anneau extérieur) : sous-bois sombre
 g.fillStyle='#2f4d22';g.fillRect(0,0,L,L);for(let k=0;k<900;k++){g.fillStyle=['#3a5c29','#26401b','#46693a'][Math.floor(r()*3)];g.globalAlpha=.6;g.fillRect(r()*L,r()*L,1+r()*3,1+r()*3)}g.globalAlpha=1;
 // cases d'herbe en damier, avec un léger relief (bord clair en haut, sombre en bas)
 g.fillStyle='#3d6424';g.fillRect(T,T,L-2*T,L-2*T);
 for(let rr=1;rr<Z.N-1;rr++)for(let c=1;c<Z.N-1;c++){const x=c*T,y=rr*T,base=(rr+c)%2?'#679a3c':'#5d8f36';g.fillStyle=base;g.fillRect(x+1,y+1,T-2,T-2);const v=r();g.fillStyle=v<.5?`rgba(20,45,10,${(.5-v)*.16})`:`rgba(230,245,160,${(v-.5)*.1})`;g.fillRect(x+1,y+1,T-2,T-2);
  g.fillStyle='rgba(255,255,200,.1)';g.fillRect(x+1,y+1,T-2,2);g.fillRect(x+1,y+1,2,T-2);g.fillStyle='rgba(20,40,10,.16)';g.fillRect(x+1,y+T-3,T-2,2);g.fillRect(x+T-3,y+1,2,T-2)}
 // taches d'herbe plus sombre ou plus claire
 for(let k=0;k<46;k++){const x=T+r()*(L-2*T),y=T+r()*(L-2*T);g.fillStyle=r()<.6?'rgba(30,60,14,.16)':'rgba(220,240,140,.08)';g.beginPath();g.ellipse(x,y,8+r()*16,5+r()*10,r()*3,0,7);g.fill()}
 // brins d'herbe
 g.lineWidth=1;for(let k=0;k<1500;k++){const x=T+r()*(L-2*T),y=T+3+r()*(L-2*T-3);g.strokeStyle=['#7fb049','#4c7d2a','#8cbc52','#3f6c24'][Math.floor(r()*4)];g.globalAlpha=.7;g.beginPath();g.moveTo(x,y);g.lineTo(x-1.3,y-3);g.moveTo(x,y);g.lineTo(x+1.2,y-3.2);g.stroke()}g.globalAlpha=1;
 // routes de terre jusqu'à la maison, à travers la forêt
 dirtRoad(g,M,-6,M,L+6,RW,r);dirtRoad(g,-6,M,L+6,M,RW,r);
 // filet des cases redessiné par-dessus les routes
 g.strokeStyle='rgba(90,60,28,.28)';g.lineWidth=1.4;for(let i=1;i<Z.N-1;i++){g.beginPath();g.moveTo(i*T,M-RW/2);g.lineTo(i*T,M+RW/2);g.moveTo(M-RW/2,i*T);g.lineTo(M+RW/2,i*T);g.stroke()}
 g.beginPath();g.moveTo(T,(MIDN)*T);g.lineTo(L-T,MIDN*T);g.moveTo(T,(MIDN+1)*T);g.lineTo(L-T,(MIDN+1)*T);g.moveTo(MIDN*T,T);g.lineTo(MIDN*T,L-T);g.moveTo((MIDN+1)*T,T);g.lineTo((MIDN+1)*T,L-T);g.stroke();
 // petits décors loin du centre des cases (fleurs, touffes, cailloux, planches) pour ne pas gêner la lecture
 const free=(x,y)=>{const cx=(Math.floor(x/T)+.5)*T,cy=(Math.floor(y/T)+.5)*T;return Math.hypot(x-cx,y-cy)>17&&!onRoad(x,y,2)&&x>T+4&&y>T+4&&x<L-T-4&&y<L-T-4};
 for(let k=0;k<90;k++){const x=r()*L,y=r()*L;if(!free(x,y))continue;const pc=r()<.6?'#f4f1e4':r()<.5?'#f4d34a':'#c9b4f0';
  for(let p=0;p<5;p++){const a=p*1.2566;g.fillStyle='rgba(20,40,10,.35)';g.beginPath();g.arc(x+Math.cos(a)*1.8+.6,y+Math.sin(a)*1.8+.8,1.4,0,7);g.fill();g.fillStyle=pc;g.beginPath();g.arc(x+Math.cos(a)*1.8,y+Math.sin(a)*1.8,1.4,0,7);g.fill()}
  g.fillStyle='#e0a21e';g.beginPath();g.arc(x,y,1.1,0,7);g.fill()}
 for(let k=0;k<40;k++){const x=r()*L,y=r()*L;if(!free(x,y))continue;g.lineWidth=1.3;for(let b=0;b<6;b++){g.strokeStyle=b%2?'#3c6a22':'#86ba4c';g.beginPath();g.moveTo(x,y);g.lineTo(x+(b-2.5)*1.6,y-4-r()*3);g.stroke()}}
 for(let k=0;k<16;k++){const x=r()*L,y=r()*L;if(free(x,y))rockDeco(g,x,y,2+r()*2,r)}
 for(let k=0;k<7;k++){const x=r()*L,y=r()*L;if(!free(x,y))continue;g.save();g.translate(x,y);g.rotate(r()*3);g.fillStyle='#2b1c10';g.fillRect(-9.5,-2.5,19,5);g.fillStyle='#8a6640';g.fillRect(-8.5,-1.5,17,3);g.fillStyle='#a37b4d';g.fillRect(-8.5,-1.5,17,1);g.restore()}
 // ombre de la forêt sur le bord du terrain (profondeur)
 const sh=(x0,y0,x1,y1,x,y,w,h)=>{const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,'rgba(10,25,6,.42)');gr.addColorStop(1,'rgba(10,25,6,0)');g.fillStyle=gr;g.fillRect(x,y,w,h)};
 sh(0,T,0,T+16,T,T,L-2*T,16);sh(0,L-T,0,L-T-12,T,L-T-12,L-2*T,12);sh(T,0,T+14,0,T,T,14,L-2*T);sh(L-T,0,L-T-14,0,L-T-14,T,14,L-2*T);
 // forêt : rochers et troncs au sol, puis arbres serrés (du haut vers le bas pour le relief), jamais sur les routes
 const inRing=(x,y)=>x<T*.95||y<T*.95||x>L-T*.95||y>L-T*.95;
 for(let k=0;k<22;k++){const x=r()*L,y=r()*L;if(!inRing(x,y)||onRoad(x,y,8))continue;r()<.5?rockDeco(g,x,y,4+r()*4,r):logDeco(g,x,y,22+r()*14,7,r()*3)}
 const trees=[],st=17;for(let y=-st/2;y<L+st;y+=st)for(let x=-st/2;x<L+st;x+=st){const px=x+(r()-.5)*st,py=y+(r()-.5)*st,sz=11+r()*11;
  if(!(px<T*.9||py<T*.9||px>L-T*.9||py>L-T*.9)||onRoad(px,py,sz*.7)||r()<.12)continue;trees.push([px,py,sz])}
 trees.sort((a,b)=>a[1]-b[1]).forEach(([x,y,s])=>leafTree(g,x,y,s,r));
 for(let k=0;k<12;k++){const x=r()*L,y=r()*L;if(!inRing(x,y)||onRoad(x,y,8))continue;r()<.6?rockDeco(g,x,y,4+r()*4,r):logDeco(g,x,y,20+r()*12,6,r()*3)}
})();
const decal=document.createElement('canvas');decal.width=decal.height=L*2;const gx=decal.getContext('2d');gx.scale(2,2);
function clearDecals(){gx.clearRect(0,0,L,L)}
function splat(x,y,big){const n=big?9:3;for(let k=0;k<n;k++){const a=Math.random()*7,d=Math.random()*(big?12:7);gx.fillStyle=Math.random()<.5?'rgba(110,14,18,.55)':'rgba(70,90,30,.45)';gx.beginPath();gx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,1+Math.random()*(big?4:2),0,7);gx.fill()}}

/* ---------- live visual state ---------- */
const V=new Map(),FX=[],PT=[],facing=Array(Z.N*Z.N).fill(null);
let nightAmt=0,nightTarget=0,shakeT=0,shakeK=5,hurtT=0,last=performance.now();
// tremblement de l'écran : k = force ; une secousse plus forte remplace une plus faible
// v128 : vibrations du téléphone (Android ; l'iPhone ne les permet pas dans le navigateur), au plus une toutes les 250 ms
let vibT=0;function vib(p){if(!OPT.vib||!navigator.vibrate)return;const n=performance.now();if(n-vibT<250)return;vibT=n;try{navigator.vibrate(p)}catch(e){}}
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
function drawUnit(i,u,now){
 const p0=tc(i),D0=Z.stat(G,u.t),cc=CATC[D0.cat];
 // jeu de plateau : socle commun (rond, carré ou plat selon la nature de la pièce)
 {const kd=pieceKind(u.t,D0);if(kd)socle(p0.x,p0.y,kd==='round'?25:24,'#d8c7a0',cc,kd);
  else if(D0.cat!=='trap'){ctx.save();ctx.globalAlpha=D0.block?.16:.1;circ(p0.x,p0.y,26,cc);ctx.restore()}}
 // version dorée (fusion) ou évolution : un anneau qui pulse
 if(u.gold||D0.evo){ctx.save();ctx.strokeStyle=u.gold?'#f2c23d':'#c58cff';ctx.lineWidth=3;ctx.globalAlpha=.55+.3*Math.sin(now/300);ctx.beginPath();ctx.arc(p0.x,p0.y,28,0,7);ctx.stroke();ctx.restore()}
 ctx.save();ctx.translate(p0.x,p0.y);const sc=1.45+.12*Math.min(3,u.gold||0);ctx.scale(sc,sc);ctx.translate(-p0.x,-p0.y);
 drawUnitInner(i,u,now);ctx.restore();
 if(D0.up)safeTxt(p0.x+19,p0.y-17,'+','#f2b33d');
 if(u.gold)safeTxt(p0.x-19,p0.y-17,u.gold>1?u.gold+'★':'★','#f2c23d');else if(D0.evo)safeTxt(p0.x-19,p0.y-17,'✦','#c58cff');
 const lv=(u.lvA||0)+(u.lvD||0);if(lv){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(p0.x+11,p0.y+14,18,12);ctx.fillStyle='#9fd86b';ctx.font='bold 9px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText(_t('N')+lv,p0.x+20,p0.y+23)}
 const eq=Z.eqOf(u);if(eq.length){ctx.font='10px system-ui,sans-serif';ctx.textAlign='center';eq.slice(0,4).forEach((t,k)=>{const ex=p0.x-25,ey=p0.y-8+k*13;circ(ex,ey,6.8,'rgba(10,10,10,.8)');glyph(EQIC[t]||'pack',ex,ey,9,'#fff',2.6)})}
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
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(out);ctx.fillStyle='rgba(0,0,0,.38)';ctx.fillRect(-half+4,-H+7,2*half,2*H);ctx.translate(-half,0);
   wallSect(mat(i),0,2*half,H,r);wear(2*half,r,fw(i));ctx.restore();
   const e1={x:p.x-Math.cos(out)*half,y:p.y-Math.sin(out)*half},e2={x:p.x+Math.cos(out)*half,y:p.y+Math.sin(out)*half};
   wallPost(mat(i),e1.x,e1.y);wallPost(mat(i),e2.x,e2.y)}
  else{
   // ombre portée de tout l'ouvrage
   links.forEach(([a,b])=>{const p=tc(a),q=tc(b);const el=mat(a)==='electric'&&mat(b)==='electric';line(p.x+4,p.y+8,q.x+4,q.y+8,el?'rgba(0,0,0,.18)':'rgba(0,0,0,.38)',el?8:2*H+6)});
   // sections : chaque moitié prend le matériau de son mur
   links.forEach(([a,b])=>{const p=tc(a),q=tc(b),d=Math.hypot(q.x-p.x,q.y-p.y),r=rng(a*131+b);
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(q.y-p.y,q.x-p.x));
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
function drawGuide(now){const g=guideStep();if(!g||g.cell==null||G.grid[g.cell])return;const p=tc(g.cell),k=.5+.5*Math.sin(now/220);
 ctx.save();ctx.strokeStyle=`rgba(255,210,90,${.55+.45*k})`;ctx.lineWidth=4;ctx.shadowColor='#ffd25a';ctx.shadowBlur=12+10*k;ctx.strokeRect(p.x-T/2+4,p.y-T/2+4,T-8,T-8);
 ctx.fillStyle=`rgba(255,210,90,${.12+.12*k})`;ctx.fillRect(p.x-T/2+4,p.y-T/2+4,T-8,T-8);ctx.restore()}
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
 const isB=!!(Z.ZT[k]||{}).boss;socle(0,1,11.5*sz,isB?'#6e1410':'#4a1512',isB?'#ff5a3a':'#b8302a','round');
 const zk='z_'+k,[zim,zd]=sprK(zk),zup=zim&&zd[0]==='up';ctx.rotate(zup?wob*.6+(v.dying?.6:0):a+wob);ctx.scale(sz,sz);
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
  if(f.type==='ring'&&p>0){ctx.strokeStyle=f.c;ctx.lineWidth=3*(1-p);ctx.beginPath();ctx.arc(f.x,f.y,f.r*p,0,7);ctx.stroke()}
  ctx.globalAlpha=1}
 for(let k=PT.length-1;k>=0;k--){const q=PT[k],p=Math.max(0,(now-q.t0)/q.dur);if(p>=1){PT.splice(k,1);continue}const dt=now-q.t0;
  ctx.globalAlpha=1-p;circ(q.x+q.vx*dt,q.y+q.vy*dt,q.r*(1-p*.5),q.c);ctx.globalAlpha=1}
}
const floats=[];
function floatTxt(x,y,txt,c,sz){floats.push({x,y,txt,c,sz:sz||13,t0:performance.now()})}
function drawFloats(now){ctx.textAlign='center';
 for(let k=floats.length-1;k>=0;k--){const f=floats[k],p=(now-f.t0)/(f.sz>13?1400:700);if(p>=1){floats.splice(k,1);continue}
  ctx.font=`bold ${f.sz}px "Atkinson Hyperlegible",system-ui,sans-serif`;
  ctx.globalAlpha=1-p;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(f.txt,f.x+1,f.y-18-p*18+1);ctx.fillStyle=f.c;ctx.fillText(f.txt,f.x,f.y-18-p*18);ctx.globalAlpha=1}}

function lights(now){
 const ls=[{x:CEN.x,y:CEN.y,r:T*(2.1+(reduce?0:.05*Math.sin(now/110)*Math.sin(now/43)))}];
 const pow=powered();
 G.grid.forEach((u,i)=>{if(!u)return;const p=tc(i);
  if(u.t==='lamp'&&pow){const d=Math.atan2(p.y-CEN.y,p.x-CEN.x);ls.push({x:p.x+Math.cos(d)*40,y:p.y+Math.sin(d)*40,r:T*1.5});ls.push({x:p.x,y:p.y,r:T*.8})}
  else if(u.t==='siren')ls.push({x:p.x,y:p.y,r:T*(Math.floor(now/300)%2?1.2:.9)});
  else if(u.t==='fire'&&S.busy&&G.event.id!=='pluie')ls.push({x:p.x,y:p.y,r:T*(1.05+Math.sin(now/80+i)*.08)});
  else ls.push({x:p.x,y:p.y,r:T*.95})});
 FX.forEach(f=>{if(f.light){const p=(now-f.t0)/f.dur;if(p<1)ls.push({x:f.x,y:f.y,r:f.light*(1-p)})}});
 PT.forEach(q=>{if(q.light)ls.push({x:q.x,y:q.y,r:q.light})});
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
 ctx.globalCompositeOperation='lighter';const nf=OPT.eco?6:FLY.length;
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
 dctx.fillStyle=`rgba(4,7,18,${.66*nightAmt})`;dctx.fillRect(0,0,dark.width,dark.height);
 dctx.setTransform(k,0,0,k,0,0);dctx.globalCompositeOperation='destination-out';
 for(const l of lights(now))dctx.drawImage(LIGHT,l.x-l.r,l.y-l.r,2*l.r,2*l.r);
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(dark,0,0,cv.width,cv.height);ctx.restore();
 ctx.save();ctx.globalCompositeOperation='lighter';const r=T*1.6,g=ctx.createRadialGradient(CEN.x,CEN.y,0,CEN.x,CEN.y,r);g.addColorStop(0,`rgba(255,170,60,${.12*nightAmt*(reduce?1:1+.25*Math.sin(now/90)*Math.sin(now/37))})`);g.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g;ctx.fillRect(CEN.x-r,CEN.y-r,2*r,2*r);ctx.restore();
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
 nightAmt+=(nightTarget-nightAmt)*Math.min(1,dt/450);SFX.night(nightAmt);
 let sx=0,sy=0;if(now-shakeT<260&&!reduce){const k=(1-(now-shakeT)/260)*shakeK;sx=(Math.random()-.5)*k;sy=(Math.random()-.5)*k}
 ctx.setTransform(SC,0,0,SC,sx*SC,sy*SC);
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
 drawDark(now);
 safe(()=>drawAmbient(now));
 if(nightAmt>.05){ctx.save();ctx.shadowColor='#ff2a2a';ctx.shadowBlur=6;for(const[x,y,nx,ny,sz,al]of EYES){ctx.globalAlpha=al*nightAmt;circ(x+nx*2*sz,y+ny*2*sz,1.3*sz,'#ff4a3a');circ(x-nx*2*sz,y-ny*2*sz,1.3*sz,'#ff4a3a')}ctx.restore()}
 drawBars();
 ctx.save();ctx.font='bold 10px "Atkinson Hyperlegible",system-ui,sans-serif';ctx.textAlign='center';for(const[x,y,n]of LABELS){const w=ctx.measureText(n).width+8;ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x-w/2+1,y-9,w,13);ctx.fillStyle='#efe3c6';ctx.fillRect(x-w/2,y-10,w,13);ctx.strokeStyle='rgba(90,70,40,.8)';ctx.lineWidth=.8;ctx.strokeRect(x-w/2+.5,y-9.5,w-1,12);ctx.fillStyle='#2b1a0c';ctx.fillText(n,x,y)}ctx.restore();
 drawFloats(now);
 if(KC.on&&KC.n){ctx.save();const q=clamp((now-KC.t)/300,0,1),k=1+.5*(1-q);ctx.translate(30,22);ctx.scale(k,k);ctx.font='bold 16px "Special Elite",system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillText(KC.n,9,6);ctx.fillStyle=q<1?'#ffd25a':'#ebe7da';ctx.fillText(KC.n,8,5);glyph('skull',-12,0,14,q<1?'#ffd25a':'#ebe7da',2.2);ctx.restore()}
 if(now-hurtT<400){ctx.save();ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.width*.3,cv.width/2,cv.height/2,cv.width*.75);g.addColorStop(0,'rgba(229,72,77,0)');g.addColorStop(1,`rgba(229,72,77,${.45*(1-(now-hurtT)/400)})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);ctx.restore()}
}

const powered=()=>G.event.id!=='coupure'||G.relics.includes('groupe')||G.grid.some(u=>u&&u.t==='solar');
function safeTxt(x,y,t,c){ctx.font='bold 14px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(t,x+1,y+1);ctx.fillStyle=c;ctx.fillText(t,x,y)}
