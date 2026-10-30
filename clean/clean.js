/* Barricard « Clean UI » : version à part, chargée par clean/index.html.
   Elle force le style artiste (html.artx) avec la palette du pack Clean UI (clean/clean.css),
   sans changer l'option enregistrée : la version normale du jeu reste telle quelle. */
(function(){try{
 const DE=document.documentElement;DE.classList.add('clean');
 const artSaved=!!OPT.art;OPT.art=1;
 // l'option « Images de l'artiste » enregistrée reste celle de la version normale
 const save0=saveOpt;saveOpt=function(){const a=OPT.art;OPT.art=artSaved;try{save0()}finally{OPT.art=a}};
 // dos des cartes : celui du pack
 DE.style.setProperty('--ui-dos',`url("${new URL('clean/assets/04_Cards/card_back.png',document.baseURI).href}")`);
 // plateau : cases en papier du pack (clean/assets/plateau-clean.webp, fait par tools/clean-plateau.py)
 if(typeof axPlat==='function')axPlat=function(){if(AX.plat&&AX.plat.clean)return axGround();const im=new Image();im.onload=()=>{im.clean=1;AX.plat=im;axGround()};im.src='clean/assets/plateau-clean.webp'};
 fetch('assets/art/liste.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{if(j)ART_NEW=Object.assign({cards:[],sprites:[],relics:[],ui:[]},j);applyArt();DE.classList.add('artx')}).catch(()=>{applyArt();DE.classList.add('artx')});
}catch(e){console.warn(e)}})();
