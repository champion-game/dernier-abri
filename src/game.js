// Rendu canvas, interface et boucle de jeu. Dépend de src/engine.js (global Z).
const ICON={
 bar:'<path d="M4 6l16 4M4 14l16 4M7 4v17M17 4v17"/>',
 car:'<path d="M3 15l2-5h12l3 5v3H3zM6 10l1.5-3h8l1.5 3"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
 fen:'<path d="M5 4v16M12 4v16M19 4v16M5 9h14M5 15h14"/>',
 sand:'<path d="M4 19h16M5 19c0-3 3-4 7-4s7 1 7 4M7 15c0-3 2-4 5-4s5 1 5 4"/>',
 door:'<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9 7h6M9 11h6M9 15h6"/>',
 tire:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/>',
 gun:'<circle cx="12" cy="12" r="6.5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',
 snp:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 1v6M12 17v6M1 12h6M17 12h6"/>',
 sht:'<path d="M6 7h5v13H6zM13 7h5v13h-5zM6 11h5M13 11h5M7 4h3M14 4h3"/>',
 xbow:'<path d="M4 7c5 2.5 11 2.5 16 0M12 8v13M9 18l3 3 3-3M4 7l8 2 8-2"/>',
 flame:'<path d="M3 15h8l3-3h2M5 15v-4h5v4"/><path d="M18 8c1 1.5 3 2 3 4a2.5 2.5 0 0 1-5 0c0-1 .8-1.6 1.3-2.3z"/>',
 mg:'<path d="M3 10h14M3 14h14M17 9v6h3M7 14l-3 6M11 14l3 6"/>',
 molo:'<path d="M10 4h4v3l2 3v10H8V10l2-3z"/><path d="M12 1v3M8 14h8"/>',
 kid:'<path d="M8 3v6a4 4 0 0 0 8 0V3M12 13v8M8 3l4 6 4-6"/>',
 axe:'<path d="M13 4l7 7-4.5 1.5-4-4zM14.5 9.5 4 20"/>',
 dog:'<circle cx="6.5" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="17.5" cy="10" r="2"/><path d="M12 12c-3 0-5 3-5 5.5 0 1.5 1.5 2.5 5 2.5s5-1 5-2.5C17 15 15 12 12 12z"/>',
 cop:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
 butch:'<path d="M3 5h12v9H3zM15 9h6"/><circle cx="6" cy="8" r="1"/>',
 monk:'<circle cx="12" cy="6" r="3"/><path d="M5 21c0-5 3-9 7-9s7 4 7 9M3 14l5-2M21 14l-5-2"/>',
 med:'<path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z"/>',
 lamp:'<path d="M3 9l8-4v14l-8-4zM14 8l6-3M14 12h7M14 16l6 3"/>',
 radio:'<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M8 9l10-6M14 13h3M14 16h3"/><circle cx="9" cy="14.5" r="2"/>',
 cook:'<path d="M7 11a4 4 0 1 1 3-6 4 4 0 0 1 7 2 3 3 0 0 1 0 4zM7 11v8h10v-8"/>',
 mech:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
 siren:'<path d="M7 18v-6a5 5 0 0 1 10 0v6M5 18h14v3H5zM12 2v2M4 6l1.5 1.5M20 6l-1.5 1.5"/>',
 lead:'<path d="M5 21V4M5 4h12l-3 4 3 4H5"/>',
 solar:'<path d="M3 18l3-12h12l3 12zM4.5 12h15M9 6l-1 12M15 6l1 12"/>',
 trap:'<path d="M3 16h18M4 16l2-6 2 6 2-6 2 6 2-6 2 6 2-6 2 6"/>',
 fire:'<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2.5-5 .5 2 1.5 2.5 2.5 2.5C12 8 11.5 5.5 12 3z"/>',
 mine:'<circle cx="12" cy="14" r="5.5"/><path d="M12 8.5V5M9 4h6M16.5 9.5l1.8-1.8"/>',
 wire:'<path d="M3 12h18M5 9l2 6M10 9l2 6M15 9l2 6"/>',
 spike:'<path d="M3 20h18M6 20l2-12 2 12M12 20l2-14 2 14M17 20l1.5-8 1.5 8"/>',
 gas:'<rect x="7" y="6" width="10" height="15" rx="4"/><path d="M10 6V3h4v3"/>',
 smoke:'<path d="M8 21h8V11H8zM10 11V8h4v3M6 6c-2-2 0-4 2-3M12 4c0-2 3-2 3 0M18 6c2-1 3 1 1 3"/>',
 bait:'<path d="M6 9c2-4 9-5 12-1s0 9-5 9-8-4-7-8z"/><circle cx="16" cy="16" r="2.5"/><path d="M17.5 17.5L21 21"/>',
 dyn:'<path d="M5 9h4v12H5zM10 9h4v12h-4zM15 9h4v12h-4zM12 9c0-3 2-4 4-6"/>',
 food:'<path d="M6 5h12v15H6zM6 9h12M6 16h12"/>',
 rep:'<path d="M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5l-2.5 2.5-3-1-1-3z"/>',
 kit:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M12 10v7M8.5 13.5h7"/>',
 coffee:'<path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 11h2a2 2 0 0 1 0 4h-2M8 3c-1 2 1 3 0 5M12 3c-1 2 1 3 0 5"/>',
 roadmap:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
 flare:'<path d="M10 21V11h4v10M12 11V8M12 3l1 3h-2zM6 6l2 2M18 6l-2 2"/>',
 grenade:'<circle cx="11" cy="14" r="6.5"/><path d="M9 7.5h4M11 7.5V5l5-2"/>',
 shot:'<path d="M4 20l7-7M11 13l2-6 6-2-2 6zM15 9l5-5"/>',
 patch:'<path d="M5 9l4-4 10 10-4 4zM9 9l2 2M12 6l2 2M9 12l2 2"/>',
 molotov:'<path d="M10 5h4v3l2 3v9H8v-9l2-3z"/><path d="M12 1c1 2 2 2.5 2 4"/>',
 horn:'<path d="M3 10h4l8-5v14l-8-5H3zM18 8c1.5 1 1.5 7 0 8M20.5 6c2.5 2 2.5 10 0 12"/>',
 rush:'<path d="M13 2L5 13h6l-1 9 8-12h-6z"/>',
 riot:'<path d="M6 4h12v9c0 4-3 6-6 7-3-1-6-3-6-7z"/><path d="M9 9h6"/>',
 k9:'<circle cx="6.5" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="17.5" cy="10" r="2"/><path d="M8 15h8l-1 5H9z"/>',
 barrier:'<path d="M3 9h18v6H3zM6 9l-3 6M12 9l-3 6M18 9l-3 6M5 15v5M19 15v5"/>',
 swat:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="M12 12h.01"/>',
 mortar:'<path d="M9 20l2-12h4l1 12zM8 20h10M11 8l2-5 2 5"/>',
 sentry:'<circle cx="12" cy="14" r="6"/><path d="M12 14l8-8M17 6l3 3"/>',
 clay:'<path d="M4 15c4-5 12-5 16 0v3H4zM8 18v3M16 18v3M12 9V6"/>',
 bunker:'<path d="M3 17l3-8h12l3 8zM8 13h8"/>',
 pharma:'<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M12 8v8M8 12h8"/>',
 hospital:'<path d="M2 20L12 6l10 14zM12 11v6M9 14h6"/>',
 priest:'<path d="M12 3v18M7 8h10"/>',
 stretch:'<path d="M3 15h18M5 15v4M19 15v4M6 11h12v4H6z"/>',
 brasero:'<path d="M6 12h12l-2 8H8zM12 3c1 3 4 4 4 7H8c0-3 3-4 4-7z"/>',
 firetrap:'<rect x="7" y="7" width="10" height="14" rx="2"/><path d="M12 7c0-2 2-3 3-5"/>',
 net:'<path d="M4 4l16 16M20 4L4 20M4 12h16M12 4v16M4 4h16v16H4z"/>',
 bear:'<path d="M2 15h20M3 15l2-7 2 7 2-7 2 7 2-7 2 7 2-7 2 7 2-7"/>',
 hunter:'<path d="M3 13l14-4M14 7l5 2-3 3M6 13l-1 6"/>',
 dogs:'<circle cx="7" cy="9" r="3"/><circle cx="16" cy="12" r="3"/><path d="M4 17c1-3 5-3 6 0M13 20c1-3 5-3 6 0"/>',
 pitch:'<path d="M12 22V8M7 3v5c0 2 2 3 5 3s5-1 5-3V3M12 3v5"/>',
 scare:'<path d="M12 3v18M4 9h16"/><circle cx="12" cy="6" r="2.5"/><path d="M7 4h10"/>',
 turret:'<rect x="6" y="12" width="12" height="8" rx="2"/><path d="M12 12V7h8"/>',
 workshop:'<path d="M3 12h18M5 12v8M19 12v8M7 8l3-4 3 4M15 5v7"/>',
 modwall:'<rect x="3" y="5" width="8" height="14"/><rect x="13" y="5" width="8" height="14"/><path d="M5 9h4M15 9h4"/>',
 tesla:'<path d="M9 21h6M10 21V9M14 21V9M8 9h8M12 9V3M7 5l3 2M17 5l-3 2"/>',
 teacher:'<path d="M3 7l9-4 9 4-9 4zM7 9v5c0 2 10 2 10 0V9"/>',
 market:'<path d="M3 9l2-5h14l2 5zM4 9v11h16V9M9 20v-6h6v6"/>',
 vigile:'<circle cx="12" cy="8" r="4"/><path d="M5 21c0-5 3-8 7-8s7 3 7 8M12 13v4"/>',
 carp:'<path d="M14 4l6 6-3 3-6-6zM12 9L3 18l3 3 9-9"/>',
 tear:'<path d="M7 21h10V11H7zM9 11V8h6v3M5 6c-2-2 1-4 3-2M12 4c0-2 3-2 3 0M19 6c2-1 2 2 0 3"/>',
 napalm:'<path d="M4 20c2-5 5-3 4-9 4 2 5 5 4 9 1-4 3-5 5-4-1 2 1 3 3 4z"/>',
 air:'<path d="M2 12h20M12 2l3 10-3 10-3-10z"/>',
 relic:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
 mut:'<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5V3a6 6 0 0 1 5 9.5M14.2 13.2l5.6 3.3a6 6 0 0 1-10 0M9.8 13.2l-5.6 3.3A6 6 0 0 1 7 6"/>',
 scrap:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'
};
// évolutions : icônes provisoires tirées des cartes d'origine
Object.assign(ICON,{rocket:'<path d="M3 15l12-8 3 3-8 12zM15 7l3-3 2 2-3 3M6 14l-3 1 1-3"/>',ammo:'<path d="M9 3h6v4l1 2v12H8V9l1-2zM8 13h8"/>',amb:ICON.stretch,doc:ICON.pharma,orderly:ICON.med,nailer:ICON.turret,ranger:ICON.hunter,k9squad:ICON.k9,nightsnp:ICON.snp+'<path d="M2 2l3 3M22 2l-3 3"/>',heavyflame:ICON.flame,fortin:ICON.bunker,autogun:ICON.sentry,slaughter:ICON.butch,canteen:ICON.cook,gang:ICON.kid,saint:'<circle cx="12" cy="5" r="3"/><path d="M12 9v12M7 13h10"/>',tracker:ICON.xbow});
const stars=u=>'★'.repeat(u.gold||0);
const relicIc=r=>`<img class="relic-ic" src="assets/relics/${r}.webp" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{innerHTML:svg('relic')}))">`;
const svg=t=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICON[t]||ICON.relic}</svg>`;
/* illustrations des cartes : une image sans texte par carte, dans assets/cards/<identifiant>.webp.
   Le jeu écrit lui-même le nom, le coût, les stats et le texte par-dessus (mises à jour et traduction faciles).
   ART_FILES : les cartes qui ont déjà leur image. ART_TEST : si rempli, cette image sert à TOUTES les cartes (essai du rendu).
   Sans image, la carte garde son icône. */
// ART_POP : les cartes qui ont aussi leur personnage détouré (<identifiant>_pop.webp, fond transparent) : il déborde du cadre
const ART_DIR='assets/cards/',ART_TEST='';
const ART_FILES='air amb axe bar barrier brasero bunker butch car carp chief_care chief_comm chief_farm chief_mil chief_police chief_pyro chief_tech chief_trap coffee cook cop doc dog dogs door fen flame flare food grenade gun hospital hunter k9 kid kit lamp lead market mech med mg modwall molo monk mortar nailer napalm orderly patch pharma pitch priest radio ranger rep riot roadmap rocket sand scare sentry shot sht siren snp solar stretch swat teacher tear tesla tire turret vigile workshop xbow trap fire mine wire spike gas smoke bait dyn clay firetrap net bear horn rush molotov k9squad nightsnp heavyflame fortin autogun slaughter canteen gang saint tracker'.split(' ');
const ART_POP=ART_FILES.filter(t=>t.startsWith('chief_')).concat('k9squad nightsnp heavyflame fortin autogun slaughter canteen gang saint tracker'.split(' '));
/* sprites du plateau (assets/sprites/<id>.webp, fond transparent) : remplacent le dessin en code dès que l'image est chargée.
   [mode, angle, taille] : rot = vu du dessus, tourné vers la cible (angle = direction regardée dans l'image) ;
   up = vu de 3/4 face caméra, reste droit et se retourne vers la gauche ou la droite ; flip = objet de 3/4 qui se retourne ;
   wall = mur dont le côté long est vertical dans l'image, posé en travers de la route ; wallh = côté long horizontal ; fix = ne bouge pas. */
const SPRD={},SPR={};
[['rot',0,40,'gun'],['rot',0,46,'snp chief_trap chief_care tracker'],['rot',.15,46,'chief_mil'],['rot',.3,46,'chief_pyro'],['rot',.5,44,'chief_farm'],['rot',.6,44,'chief_tech'],['rot',-.4,44,'chief_comm'],['rot',.1,48,'nightsnp heavyflame'],
 ['up',0,38,'vigile cop butch med nailer ranger rocket priest stretch teacher flame cook pharma'],['up',0,34,'dog dogs'],['up',0,44,'k9squad gang slaughter'],['up',0,50,'saint'],
 ['rot',0,34,'z_walk'],['up',0,30,'z_crawl z_howl z_spit z_armor z_fat z_run'],
 ['wall',0,54,'bar'],['wall',0,52,'car barrier sand door modwall'],['wall',0,44,'tire'],['wallh',0,46,'wire'],
 ['flip',0,52,'fortin'],['flip',0,38,'sentry autogun turret'],['flip',0,36,'mortar'],
 ['fix',0,48,'bunker hospital'],['fix',0,44,'workshop market fire'],['fix',0,40,'scare spike net'],['fix',0,38,'lamp'],['fix',0,36,'solar'],['fix',0,34,'radio tesla canteen bear'],
 ['fix',0,30,'trap brasero smoke'],['fix',0,28,'siren dyn clay firetrap'],['fix',0,26,'gas mine'],['fix',0,22,'bait']
].forEach(([m,b,z,ids])=>ids.split(' ').forEach(k=>{SPRD[k]=[m,b,z]}));// v93 : les sprites réalistes ne sont plus chargés (archivés), seuls les cartoon servent
/* sprites cartoon (assets/sprites_cartoon/<id>.webp) : utilisés quand le style cartoon est choisi.
   Vus strictement du dessus, personnages et zombies tournés vers le BAS (angle π/2) ; murs dessinés à l'horizontale. */
const SPRDC={},SPRC={},DOWN=Math.PI/2;
[['rot',DOWN,44,'gun snp sht xbow flame mg molo kid swat hunter vigile doc nailer ranger rocket'],['rot',DOWN,46,'mortar sentry turret'],['fix',0,40,'tesla'],
 ['rot',DOWN,46,'axe cop butch monk riot pitch amb orderly med radio cook mech lead pharma priest stretch teacher carp'],['rot',DOWN,40,'dog k9'],['rot',DOWN,46,'dogs'],
 ['rot',DOWN,50,'chief_police chief_mil chief_pyro chief_trap chief_farm chief_care chief_tech chief_comm k9squad nightsnp heavyflame slaughter saint tracker'],['rot',DOWN,52,'gang autogun'],
 ['fix',0,50,'canteen hospital market workshop'],['fix',0,42,'lamp siren solar scare'],
 ['wallh',0,54,'sand bar barrier modwall fen'],['fix',0,46,'bunker'],['fix',0,40,'tire'],
 ['fix',0,40,'fire spike net bear wire'],['fix',0,32,'trap mine clay gas smoke bait dyn firetrap'],
 ['fix',0,48,'tower'],['rot',DOWN,46,'handler welder scout assassin fieldnurse genmech'],['fix',0,40,'brasero'],['fix',0,40,'trench rocks'],['fix',0,36,'pump flood'],['fix',0,42,'pit'],['wallh',0,50,'gate gabion'],
 ['rot',DOWN,48,'v_hmg v_medic v_sniper'],['rot',DOWN,42,'v_rdog'],['rot',DOWN,56,'v_apc'],['fix',0,46,'v_radio'],['fix',0,52,'v_cont'],['fix',0,40,'v_mines'],
 ['rot',DOWN,34,'z_walk z_run z_sap z_armor z_howl z_crawl z_spit z_boss z_mere z_zero'],['rot',DOWN,40,'z_fat'],['rot',DOWN,30,'z_zdog']
].forEach(([m,b,z,ids])=>ids.split(' ').forEach(k=>{SPRDC[k]=[m,b,z];const im=new Image();im.onload=()=>SPRC[k]=im;im.src='assets/sprites_cartoon/'+k+'.webp'}));
// le sprite à utiliser selon le style choisi (cartoon si disponible, sinon réaliste)
function sprK(k){if((ART_STYLE==='cartoon'||!SPRD[k])&&SPRC[k])return[SPRC[k],SPRDC[k]];return[SPR[k],SPRD[k]]}
function drawSpr(k,x,y,a,out,mul){const[im,d]=sprK(k);if(!im||!d)return false;const[m,b,z]=d,sz=z*(mul||1),r=im.width/im.height,w=r>=1?sz:sz*r,h=r>=1?sz/r:sz;
 ctx.save();ctx.translate(x,y);if(m==='rot')ctx.rotate(a-b);else if(m==='wall')ctx.rotate(out);else if(m==='wallh')ctx.rotate(out+Math.PI/2);else if((m==='up'||m==='flip')&&Math.cos(a)<-.1)ctx.scale(-1,1);
 ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();return true}
// seules les cartes très puissantes (chefs légendaires et évolutions secrètes) débordent du cadre
const popOK=t=>Z.RAR[t]==='leg'||!!(Z.U[t]&&Z.U[t].evo);
/* style des illustrations (essai) : « cartoon » utilise assets/cards_cartoon/ pour les cartes qui y ont une image, les autres gardent l'illustration actuelle */
// style graphique : cartoon pour tout le monde (v77). Les cartes sans image cartoon gardent leur image réaliste.
let ART_STYLE='cartoon';
const CART_FILES=('chief_police chief_mil chief_pyro chief_trap chief_farm chief_care chief_tech chief_comm k9squad nightsnp '+
 'gun snp sht xbow flame mg molo kid swat mortar sentry hunter turret tesla vigile doc nailer ranger rocket axe dog cop butch monk riot k9 dogs pitch amb orderly '+
 'med lamp radio cook mech siren lead solar pharma hospital priest stretch scare workshop teacher market carp canteen '+
 'fortin autogun tracker brasero dyn bear food kit rep roadmap gas molotov grenade shot flare bait patch napalm rush horn air trap wire mine spike tear firetrap fen fire clay sand bar modwall barrier bunker door car '+
 'tire smoke coffee net heavyflame slaughter gang saint handler welder scout assassin fieldnurse genmech shell gear binoc bandage medkit torch pills pack tape keys tower trench pump flood palis gate gabion log pit glass cans rocks supply airdrop jerry rest radioop talkie storm bomber noise v_heli v_hmg v_radio v_medic v_cont v_sniper v_mines v_rdog v_napalm v_apc').split(' ');
const CART_ZOMB='walk fat sap armor zdog crawl run howl spit boss mere zero'.split(' ');
const CART_POP=CART_FILES.slice(0,10);
const cartoon=t=>CART_FILES.includes(t)&&(ART_STYLE==='cartoon'||!ART_FILES.includes(t));
const popUrl=t=>popOK(t)&&CART_POP.includes(t)?'assets/cards_cartoon/'+t+'_pop.webp':'';
const artUrl=t=>CART_FILES.includes(t)?'assets/cards_cartoon/'+t+'.webp':'';
/* face de carte complète (style Hearthstone) : illustration dans une fenêtre arrondie, gemme de coût, bandeau du nom,
   texte d'effet, gemmes d'attaque et de PV, faction, rôle et rareté. Tout est écrit par le jeu.
   o.mini : version de la main (sans le texte d'effet) ; o.base : stats de base (collection), sinon celles de la partie (améliorations). */
const CATL={post:'Poste de soutien',wall:'Défense',shoot:'Tireur',melee:'Corps à corps',help:'Soutien',trap:'Piège',item:'Objet',react:'Réaction'};
const TRAPK=['trap','mine','spike','gas','clay','firetrap','dyn','burn','wire'];
function cardStats(D){const o={};if(D.dmg)o.atk=D.dmg+(D.hits>1?'×'+D.hits:'');else{const k=TRAPK.find(k=>D[k]);if(k)o.atk=D[k];else if(D.heal||D.mech)o.heal=D.heal||D.mech}
 if(D.block&&D.hp)o.hp=D.hp;return o}
// pictogrammes à l'encre (factions, rôles, stats) : monochromes, pour se fondre dans le parchemin
const INKI={police:ICON.cop,mil:ICON.relic,care:ICON.med,pyro:ICON.fire,trap:ICON.trap,farm:ICON.dog,tech:ICON.rush,comm:'<path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6"/>',
 tank:ICON.riot,heal:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',dps:'<path d="M4 4l10 10M14 14l2-2M14 14l-2 2M20 4L10 14M10 14l-2-2M10 14l2 2M5 17l2 2M19 17l-2 2"/>',
 atk:'<path d="M4 20l9-9M13 11l2-6 4-1-1 4-6 2zM6 14l4 4"/>'};
INKI.cap='<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6M15.5 4.8a3.2 3.2 0 0 1 0 6.4M17.5 14.3c2 .7 3.5 2.6 3.5 5.7"/>';
// v122 : icônes à l'encre à la place des émojis (même style que les pictogrammes des cartes) ; GLY = chemins SVG
const GLY={skull:'M12 3a7 7 0 0 0-7 7v3l2 2v4h10v-4l2-2v-3a7 7 0 0 0-7-7z M7.5 11a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0 M13.3 11a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0 M10 19v2 M14 19v2',
 drop:'M12 3c-3 4.5-6 8-6 11a6 6 0 0 0 12 0c0-3-3-6.5-6-11z',moon:'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
 star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',medal:'M8 2l4 6 4-6 M12 21a5.5 5.5 0 1 0 0-11a5.5 5.5 0 1 0 0 11z M12 13v5 M9.5 15.5h5',
 post:'M4 21h16 M6 21V10l6-6 6 6v11 M10 21v-5h4v5 M9 12h6',pack:'M7 9a5 5 0 0 1 10 0v12H7z M9 6.5V5a3 3 0 0 1 6 0v1.5 M9 14h6v4H9z',
 band:'M4.6 14.4l9.8-9.8a3.2 3.2 0 0 1 4.6 4.6l-9.8 9.8a3.2 3.2 0 0 1-4.6-4.6z M9.5 9.5l5 5',cross:'M12 3v18 M7 8h10',
 bulb:'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3z',
 spark:'M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
 unlock:'M6 11h12v10H6z M8 11V7a4 4 0 0 1 7.6-1.8',lock:'M6 11h12v10H6z M8 11V7a4 4 0 0 1 8 0v4',
 card:'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M12 8.5l2.5 3.5-2.5 3.5-2.5-3.5z',
 gift:'M4 9h16v4H4z M6 13h12v8H6z M12 9v12 M12 9C10 5 6 5 6 7.5S12 9 12 9 M12 9c2-4 6-4 6-1.5S12 9 12 9',
 gear:'M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.9 4.9L7 7 M17 17l2.1 2.1 M4.9 19.1L7 17 M17 7l2.1-2.1',
 trophy:'M8 4h8v5a4 4 0 0 1-8 0z M8 6H5c0 2 1 3.5 3 4 M16 6h3c0 2-1 3.5-3 4 M12 13v4 M8 21h8 M9.5 17h5v4h-5z',
 back:'M9 14L4 9l5-5 M4 9h10a6 6 0 0 1 0 12h-3',
 hand:'M9 11V5a1.5 1.5 0 0 1 3 0v6 M12 10V8.5a1.5 1.5 0 0 1 3 0V11 M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-2-4a1.5 1.5 0 0 1 2.6-1.4L9 14',
 vest:'M8 3l4 3 4-3 3 3v15H5V6z M12 6v15 M8 12h2 M14 12h2',binoc:'M6 14a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M18 14a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M3 17V8l3-4h3v10 M21 17V8l-3-4h-3v10 M9 11h6',
 medkit:'M4 8h16v12H4z M9 8V5h6v3 M12 11v6 M9 14h6',torch:'M8 3h8l-2 6v12h-4V9z M8 3l-.5-1 M12 12v3',pills:'M5 13l8-8a4 4 0 0 1 6 6l-8 8a4 4 0 0 1-6-6z M9 9l6 6',
 tape:'M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z M12 9.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z M19 12h3v4',keys:'M8 9a4 4 0 1 0 0 8a4 4 0 1 0 0-8z M12 13h9 M18 13v3 M21 13v2',
 heart:'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',chart:'M4 20h16M7 20v-6M12 20V8M17 20v-11',undo:'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3'};
const ii=(k,cls)=>`<svg class="ink${cls?' '+cls:''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${GLY[k]}"/></svg>`;
const P2D={};const glyph=(k,x,y,sz,col,lw)=>{const p=P2D[k]||(P2D[k]=new Path2D(GLY[k]));ctx.save();ctx.translate(x-sz/2,y-sz/2);ctx.scale(sz/24,sz/24);ctx.lineWidth=(lw||2.2);ctx.lineCap=ctx.lineJoin='round';ctx.strokeStyle=col;ctx.stroke(p);ctx.restore()};
/* révélation progressive (v129) : factions, niveaux et menus restent cachés tant que le joueur ne les a pas rencontrés.
   Les règles s'appliquent quand même ; seul l'affichage attend. Option « Tout afficher » pour les habitués. */
function seen(k){try{return !!(OPT.all||(META.hints&&META.hints[k]))}catch(e){return true}}
function novice(){try{return !OPT.all&&!META.runs}catch(e){return false}}
const ink=k=>`<svg class="ink" viewBox="0 0 24 24" aria-hidden="true">${INKI[k]}</svg>`;
function cardFace(t,o={}){const U0=Z.U[t],D=o.base?U0:Z.stat(G,t),r=rar(t),st=cardStats(D),f=Z.famOf(t),ro=Z.roleOf(t),u=artUrl(t),cost=o.cost??(o.base?Z.cost(t):Z.costOf(G,t));
 const atk=st.atk!=null?`<span class="cf-atk" title="Dégâts">${ink('atk')}<b>${st.atk}</b></span>`:st.heal?`<span class="cf-atk heal" title="Soin">${ink('heal')}<b>+${st.heal}</b></span>`:'';
 const hp=st.hp?`<span class="cf-hp" title="PV"><b>${st.hp}</b></span>`:'';
 // texte de la carte : pour un chef, la faction est déjà indiquée par le pictogramme, on raccourcit
 const txt=U0.chief?U0.d.replace(/^Che(?:f|ffe) d[^:]*: /,'').replace(/\. (?:Les?|La) [^.]* gagne(?:nt)? un palier$/,'. Faction : +1 palier'):U0.d;
 // faction et rôle : pictogrammes à l'encre en bas de la carte, entre les dégâts et les PV (rôle en couleur : tank / soin / DPS)
 const marks=(f&&seen('fam1')?`<i class="mk-fam" title="${Z.FAM[f].n}">${ink(f)}</i>`:'')+(ro?`<i class="mk-${ro}" title="${Z.ROLES[ro].n}">${ink(ro)}</i>`:'');
 return `<span class="cf r-${r}${o.mini?' mini':''}${D.up?' up':''}${o.gold?' gold':''}">${o.gold?`<span class="cf-stars" title="Fusionnée">${'★'.repeat(o.gold)}</span>`:''}
  <span class="cf-art"${u?` style="background-image:url('${u}')"`:''}>${u?'':svg(t)}</span><span class="cf-vig"></span>${u&&popUrl(t)?`<span class="cf-pop" style="background-image:url('${popUrl(t)}')"></span>`:''}
  ${r!=='com'?`<span class="cf-rar" title="${Z.RARITY[r].n}"></span>`:''}<span class="cf-cost">${cost}</span>
  <span class="cf-name">${D.n}</span>
  ${o.mini?(atk||hp?'':`<span class="cf-v">${o.v||(U0.react?'Nuit':U0.v)}</span>`)+(o.tag?`<span class="cf-tag">${o.tag}</span>`:''):`<span class="cf-rule"></span><span class="cf-txt${txt.length>80?' xlong':txt.length>55?' long':''}"><span>${txt}${D.rng>1&&!/portée/i.test(U0.d)?`. <b>Portée ${D.rng}</b>`:''}</span></span>`}
  <span class="cf-foot">${atk||'<span></span>'}<span class="cf-marks">${marks}${o.mini?'':`<em>${CATL[U0.cat]||''}</em>`}</span>${hp||'<span></span>'}</span></span>`}
const art=t=>{const u=Z.U[t]&&artUrl(t);return u?`<span class="art" style="background-image:url('${u}')"></span>`:svg(t)};
const cc=t=>`var(--k-${Z.U[t].cat})`;
// à changer à chaque mise en ligne : permet de vérifier sur le téléphone qu'on a la dernière version
const VERSION='v142 · 22 oct.';
/* mise à jour automatique : version.txt (à la racine) contient le numéro de la dernière version publiée.
   Si la page chargée est plus ancienne (cache du site ou du téléphone), on la recharge avec une adresse neuve,
   ce qui contourne les deux caches. Une seule tentative par version, pour ne jamais boucler. */
(()=>{try{if(location.protocol==='file:'||navigator.onLine===false)return;const cur=VERSION.split(' ')[0];
 fetch('version.txt?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{const v=(t||'').trim();
  if(!/^v\d+$/.test(v)||v===cur)return;const k='abri-upd-'+v;try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1')}catch(e){}
  location.replace(location.pathname+'?v='+v.slice(1)+location.hash)}).catch(()=>{})}catch(e){}})();
// v139 : jeu jouable sans internet une fois chargé (sw.js), seulement en ligne (pas en fichier local)
try{if('serviceWorker' in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}catch(e){}
// slowT : ralenti (mort du Colosse) jusqu'à cet instant
// options du joueur (enregistrées sur l'appareil)
const OPT=(()=>{const d={sfx:1,mus:1,speed:1,shake:1,vib:1,text:0,eco:0,all:0,back:'',shelter:'',lang:'fr'};try{return Object.assign(d,JSON.parse(localStorage.getItem('abri-opts'))||{})}catch(e){return d}})();
function saveOpt(){try{localStorage.setItem('abri-opts',JSON.stringify(OPT))}catch(e){}}
function applyOpt(){try{SFX.setVol(OPT.sfx,OPT.mus);SFX.setMaxVoices(OPT.eco?5:10)}catch(e){}document.documentElement.classList.toggle('bigtext',!!OPT.text);document.documentElement.classList.toggle('eco',!!OPT.eco);document.documentElement.classList.toggle('goldback',OPT.back==='gold');if(typeof fit==='function'&&cv){fit.w0=0}document.documentElement.lang=OPT.lang}
const TICK=650;let SPEED=1,slowT=0;const tickMs=()=>TICK/SPEED*(performance.now()<slowT?3:1);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
// v139 : pause du joueur (menu) ; RUN change quand on abandonne la nuit en cours, ce qui arrête sa boucle
let USERP=false,RUN=0;const pauseQ=[];
const nwait=async ms=>{await wait(ms);while(USERP)await new Promise(r=>pauseQ.push(r))};
function unpause(){USERP=false;pauseQ.splice(0).forEach(f=>f())}
const $=s=>document.querySelector(s);
// hasard de la partie, à graine : la graine est sauvegardée, et le défi quotidien utilise la même pour tout le monde.
// Les effets visuels (particules, sang…) gardent Math.random.
let RS=1;function R(){RS=(RS*16807)%2147483647;return (RS-1)/2147483646}
const seedFrom=str=>{let h=2166136261;for(const c of str)h=Math.imul(h^c.charCodeAt(0),16777619);return (Math.abs(h)%2147483646)+1};
const shuffle=a=>Z.shuffle(a,R);
const plural=(n,s,p)=>n+' '+(n>1?p:s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ZN={walk:['rôdeur','rôdeurs'],run:['coureur','coureurs'],fat:['gonflé','gonflés'],zdog:['chien zombie','chiens zombies'],crawl:['rampant','rampants'],spit:['cracheur','cracheurs'],armor:['blindé','blindés'],howl:['hurleur','hurleurs'],sap:['sapeur','sapeurs'],boss:['Colosse','Colosses'],mere:['Mère','Mères'],zero:['Patient Zéro','Patients Zéro']};
// v128 : le boss qui mène la nuit (Colosse, Mère, Patient Zéro)
const bossName=n=>({boss:'le Colosse',mere:'la Mère',zero:'le Patient Zéro'})[Z.leadBoss(n)]||'le Colosse';
const capF=t=>t.charAt(0).toUpperCase()+t.slice(1);

/* ---------- state ---------- */
let S,G;
/* ---------- progression entre les parties (localStorage) ---------- */
function loadMeta(){let m={};try{m=JSON.parse(localStorage.getItem('abri-meta'))||{}}catch(e){}
 if(m.cards)m.cards=m.cards.filter(t=>Z.U[t]);if(m.decks)for(const k in m.decks)if(Array.isArray(m.decks[k]))m.decks[k]=m.decks[k].filter(t=>Z.U[t]);
 if(!m.best){try{m.best=+localStorage.getItem('abri-best-nuits')||0}catch(e){}}m.best=m.best||0;m.total=m.total||m.best||0;m.runs=m.runs||0;return m}
var TEST=false,TEST_N=1,TEST_P=true;// mode test : rien n'est enregistré (record, points, succès, sauvegarde)
function endTest(){if(!TEST)return;TEST=false;META=loadMeta()}
function saveMeta(m){if(TEST)return;try{localStorage.setItem('abri-meta',JSON.stringify(m))}catch(e){}}
/* v128 : succès. Débloqués pour toujours (META.ach), annoncés par un bandeau, listés dans une page depuis l'accueil et les statistiques.
   Ils ne changent pas les règles : ce sont des objectifs pour guider le joueur (et préparer ceux de Steam). */
const ACH=[
 ['n5','spark','Premiers pas','Tenir 5 nuits.'],['n10','spark','Le cap des dix','Tenir 10 nuits.'],['n20','spark','Vétéran','Tenir 20 nuits.'],
 ['win','trophy','Les secours sont là','Gagner une partie : tenir 30 nuits.'],['m5','trophy','Souche instable','Gagner en Mutation 5.'],['m10','trophy','Dernière souche','Gagner en Mutation 10.'],
 ['n40','moon','Gardien de la vallée','Rester après la victoire et tenir 40 nuits.'],['daily','medal','Défi relevé','Finir un défi du jour.'],
 ['colosse','skull','Abattre le Colosse','Tuer le Colosse.'],['mere','skull','Matricide','Tuer la Mère.'],['zero','skull','Fin de l’épidémie','Tuer le Patient Zéro.'],
 ['ammo','skull','Gros calibre','Achever un boss avec une Munition anti-Colosse.'],['bossclean','vest','Pas une égratignure','Finir une nuit de boss sans que l’abri perde de PV.'],
 ['carnage','drop','Carnage','Tuer 5 zombies d’un coup.'],['night50','drop','Marée noire','Tuer 50 zombies en une seule nuit.'],
 ['k100','drop','Cent de plus','Tuer 100 zombies au total.'],['k1000','drop','Mille morts','Tuer 1 000 zombies au total.'],
 ['hero','medal','Légende vivante','Un survivant tue 100 zombies dans la même partie.'],['nolos','heart','Personne ne reste derrière','Tenir 10 nuits sans perdre ni blesser un survivant.'],
 ['fuse','star','Ensemble','Réussir une fusion.'],['fuse2','star','Élite','Obtenir une unité ★★.'],['evo','star','Évolution','Découvrir une évolution secrète.'],['evoall','star','Naturaliste','Découvrir les 10 évolutions secrètes.'],
 ['chief','medal','Le chef est là','Poser un chef de faction.'],['fam5','medal','Équipe complète','Avoir 5 survivants de la même faction.'],
 ['relic5','gift','Collectionneur','Avoir 5 reliques dans une partie.'],['rich','post','Ferrailleur','Avoir 50 ferraille en même temps.'],['coll','card','Tout le paquet','Débloquer toutes les cartes de la collection.']
];
const ACHQ=[];let achEl=null,achT=0;
function ach(id){try{META.ach=META.ach||{};if(META.ach[id])return;const a=ACH.find(x=>x[0]===id);if(!a)return;META.ach[id]=Date.now();saveMeta(META);ACHQ.push(a);showAch()}catch(e){}}
function showAch(){if(achEl&&!achEl.hidden)return;const a=ACHQ.shift();if(!a)return;
 if(!achEl){achEl=document.createElement('div');achEl.className='achtoast';achEl.setAttribute('role','status');document.body.appendChild(achEl);achEl.addEventListener('click',()=>{achEl.hidden=true;clearTimeout(achT);setTimeout(showAch,200)})}
 achEl.innerHTML=`<span class="ach-ic">${ii(a[1])}</span><span><small>Succès débloqué</small><b>${a[2]}</b><em>${a[3]}</em></span>`;achEl.hidden=false;try{SFX.play('relic',.5)}catch(e){}vib(80);
 clearTimeout(achT);achT=setTimeout(()=>{achEl.hidden=true;setTimeout(showAch,300)},3800)}
// vérifications à l'aube, à la fin d'une partie, et après une pose
function achCheck(){try{if(!G)return;const n=G.won?G.night:G.night-(S.busy?0:0);
 const nights=G.shelter>0?G.night:G.night-1;if(nights>=5)ach('n5');if(nights>=10)ach('n10');if(nights>=20)ach('n20');if(G.won&&nights>=40)ach('n40');
 const tot=(META.kills||0)+(G.kills||0);if(tot>=100)ach('k100');if(tot>=1000)ach('k1000');
 if(G.grid.concat(G.bench||[]).some(u=>u&&(u.kills||0)>=100))ach('hero');
 if(G.grid.some(u=>u&&(u.gold||0)>=2))ach('fuse2');if(G.grid.some(u=>u&&u.t.startsWith('chief_')))ach('chief');
 const fc=Z.famCounts(G);if(Object.values(fc).some(v=>v>=5))ach('fam5');
 if((G.relics||[]).length>=5)ach('relic5');if((G.scrap||0)>=50)ach('rich');
 if((META.evo||[]).filter(k=>Z.EVO[k]).length>=1)ach('evo');if((META.evo||[]).filter(k=>Z.EVO[k]).length>=Z.EVO_KEYS.length)ach('evoall');
 if(Z.KEYS.filter(t=>Z.U[t].vic==null).every(t=>META.cards.includes(t)))ach('coll')}catch(e){}}
// après une nuit : succès liés à la nuit qui vient de finir
function achNight(kills){try{if(kills>=50)ach('night50');
 if(Z.bigNight(G)&&G.shelter>0&&!((G.mtN||{})['t:x_shelter']||{}).tak)ach('bossclean');
 if(G.night>=10&&G.shelter>0&&!(G.mtD||[]).length)ach('nolos');achCheck()}catch(e){}}
function achScreen(back){const got=META.ach||{},n=ACH.filter(a=>got[a[0]]).length,pc=Math.round(n/ACH.length*100);
 const tile=(v,l)=>`<div class="stile"><b>${v}</b><span>${l}</span></div>`,row=a=>`<div class="achi${got[a[0]]?' on':''}"><span class="ach-ic">${got[a[0]]?ii(a[1]):ii('lock')}</span><span><b>${a[2]}</b><em>${a[3]}</em></span></div>`;
 const on=ACH.filter(a=>got[a[0]]),off=ACH.filter(a=>!got[a[0]]);
 show(`<h2 class="pw">Succès</h2><div class="stiles">${tile(n,'obtenus')}${tile(ACH.length-n,'à obtenir')}${tile(pc+' %','complété')}</div><div class="achbar"><i style="width:${pc}%"></i></div>
  ${on.length?`<h3>Obtenus</h3><div class="achs">${on.map(row).join('')}</div>`:''}${off.length?`<h3>À obtenir</h3><div class="achs">${off.map(row).join('')}</div>`:''}
  <button type="button" class="go" data-a="${back||'title'}">Retour</button>`)}
let META=loadMeta();
// tutoriel de la première partie : une bulle d'aide par étape (0 à 4 ; 5 = terminé)
let TUTO=5;try{TUTO=+(localStorage.getItem('abri-tuto')??(META.runs||META.best?5:0))}catch(e){}
function tuto(n){if(TUTO===n){TUTO=n+1;try{localStorage.setItem('abri-tuto',TUTO)}catch(e){}}}
/* première nuit guidée (v112) : à la toute première partie, le jeu montre quoi toucher, étape par étape :
   le Tireur, sa case au-dessus de la maison, la Barricade, sa case sur la route du sud, puis « Affronter la nuit ».
   GUIDE est vrai tant que la première journée guidée n'est pas finie ; ensuite les bulles habituelles prennent le relais. */
let GUIDE=false;const GUIDE_CELLS={gun:31,bar:58};
function guideStep(){if(!GUIDE||!G||G.night!==1||S.busy)return null;const has=t=>G.grid.some(u=>u&&u.t===t),sel=selCard();
 if(!has('gun'))return sel==='gun'?{n:1,cell:GUIDE_CELLS.gun,txt:'Pose-le juste au-dessus de la maison : touche la case qui brille.'}:{n:0,card:'gun',txt:'Les zombies sortent de la forêt par les 4 routes et marchent vers ta maison. Pour te défendre, touche le Tireur en bas de l’écran (il coûte 2 énergies).'};
 if(!has('bar'))return sel==='bar'?{n:3,cell:GUIDE_CELLS.bar,txt:'Pose-la sur la route du sud pour la fermer : touche la case qui brille.'}:{n:2,card:'bar',txt:'Bien ! Ton tireur tirera tout seul sur les zombies à sa portée. Maintenant, touche la Barricade.'};
 return{n:4,go:1,txt:'Ton énergie est dépensée pour aujourd’hui. Touche « Affronter la nuit » : tes survivants se défendront tout seuls.'}}
// au lancement de la toute première partie : le Tireur et la Barricade sont dans la main
function guideStart(){GUIDE=false;if(TUTO!==0)return;const need=['gun','bar'];if(!need.every(t=>S.hand.includes(t)||S.draw.includes(t)))return;
 need.forEach(t=>{if(S.hand.includes(t))return;S.draw.splice(S.draw.lastIndexOf(t),1);if(S.hand.length>=Z.drawCount(G)){const k=S.hand.findIndex(x=>!need.includes(x));if(k>=0)S.draw.unshift(...S.hand.splice(k,1))}S.hand.push(t)});
 const rk=t=>need.includes(t)?need.indexOf(t):9;S.hand.sort((a,b)=>rk(a)-rk(b));GUIDE=true}
const TIPS=['Touche une carte en bas pour la choisir. Le chiffre jaune est son coût en énergie.','Touche une case en pointillés jaunes pour la poser.','Bien ! Les points jaunes sous la carte sont ton énergie. Pose d’autres cartes, puis touche « Affronter la nuit ».','Tes survivants se défendent tout seuls. Touche le bouton du bas pour accélérer.'];
function newGame(ch,pl,daily,deck){endTest();try{UNDO=[]}catch(e){}
 RS=daily?seedFrom('abri-'+daily):1+Math.floor(Math.random()*2147483645);
 G=Z.newState(ch,pl,R,daily?Z.KEYS.slice():Z.unlocks(META).pool);if(daily)G.daily=daily;
 S={draw:shuffle([...(deck||META.decks[META.slot]||Z.STARTER_DECK)]),board:G.grid.filter(Boolean),discard:[],bsel:null,hand:[],used:[],sel:null,moveFrom:null,inspect:null,busy:false,next:null,phase:null,picks:null,dawn:null};
 V.clear();FX.length=0;PT.length=0;facing.fill(null);clearDecals();POS=new Map();G.grid.forEach((u,j)=>{if(u)POS.set(u,j)});DISC0=-1;
 fillHand();if(!daily)guideStart();else GUIDE=false;
}
// la carte choisie à l'aube arrive d'office dans la main, le reste est pioché
// la main se garde d'un jour à l'autre : on la complète jusqu'au nombre de cartes du jour (au moins 1 nouvelle), sans dépasser HAND_MAX
function fillHand(){if(S.next){S.hand.push(S.next);S.next=null}drawCards(Math.min(Z.HAND_MAX-S.hand.length,Math.max(1,Z.drawCount(G)-S.hand.length)))}
function drawCards(n){for(let k=0;k<n;k++){if(!S.draw.length&&S.discard.length){S.draw=shuffle(S.discard);S.discard=[];S.reshuf=1}if(!S.draw.length)break;S.hand.push(S.draw.pop());S.newDraw=(S.newDraw||0)+1}}
// le deck de la partie : pioche, défausse, main, et les unités posées (qui reviennent dans la défausse quand elles tombent)
const pileList=()=>[...S.draw,...S.discard,...S.hand,...(S.used||[])];
// carte choisie : S.sel ≥ 0 désigne une carte de la main, S.sel < 0 une carte de construction déjà utilisée aujourd'hui (S.used)
const selCard=()=>S.sel===null?null:S.sel>=0?S.hand[S.sel]:(S.used||[])[-1-S.sel];
const selReuse=()=>S.sel!==null&&S.sel<0;
const selCost=()=>{const t=selCard();return t?Z.buildCost(G,t,selReuse()):0};
// les cartes d'une unité posée : une évolution porte ses 2 cartes d'origine (u.src), une unité offerte (gen) aucune
const cardsOf=u=>u.src||(u.gen?[]:[u.t]);
const deckList=()=>[...pileList(),...(S.board||[]).flatMap(cardsOf)];
// une unité posée qui a disparu de la carte (détruite, piège déclenché, fusionnée…) : sa carte revient dans la défausse.
// Une unité absorbée par une évolution ne revient pas : ses cartes reviendront quand l'évolution tombera.
// Un mur tracé en ligne n'a qu'une carte : si la case qui la porte tombe, une autre case du même mur la reprend.
function syncBoard(){const live=new Set(G.grid.filter(Boolean).concat(G.bench||[]));
 // fusion : les cartes qui composent la nouvelle carte ★ repartent en défausse
 for(const u of live)if(u.fbk){const j=POS.get(u)??G.grid.indexOf(u);u.fbk.forEach(()=>{if(j>=0)FLYSRC.push(cellRect(j))});S.discard.push(...u.fbk);delete u.fbk}
for(const u of S.board||[])if(!live.has(u)&&!u.absorbed){
  if(u.line&&!u.gen){const heir=[...live].find(v=>v.line===u.line);if(heir){delete heir.gen;continue}}
  const cs=cardsOf(u),j=POS.get(u);if(j!=null)cs.forEach(()=>FLYSRC.push(cellRect(j)));S.discard.push(...cs)}S.board=[...live];POS=new Map();G.grid.forEach((u,j)=>{if(u)POS.set(u,j)})}
// table de jeu : animations des cartes entre la pioche, la main et la défausse
let POS=new Map();const FLYSRC=[];let LASTRECT=null,DISC0=-1;
function cellRect(i){const r=cv.getBoundingClientRect(),c=r.width/Z.N;return{left:r.left+(i%Z.N)*c,top:r.top+Math.floor(i/Z.N)*c,width:c,height:c}}
function fly(t,a,b,delay,back,done){if(reduce||!a||!b){done&&done();return}const g=document.createElement('div');g.className='flyc'+(back?' back':'');if(!back&&t)g.innerHTML=cardFace(t,{mini:1});document.body.appendChild(g);
 const W=56,H=75,x0=a.left+a.width/2-W/2,y0=a.top+a.height/2-H/2,x1=b.left+b.width/2-W/2,y1=b.top+b.height/2-H/2;
 const an=g.animate([{transform:`translate(${x0}px,${y0}px) scale(.85)`,opacity:.95},{transform:`translate(${x1}px,${y1}px) scale(1)`,opacity:1}],{duration:340,delay,easing:'cubic-bezier(.3,.7,.3,1)',fill:'both'});
 an.onfinish=()=>{g.remove();done&&done()};an.oncancel=an.onfinish}
function animPiles(){const pd=$('#pDraw'),px=$('#pDisc');if(!pd||!px)return;
 // un écran (accueil, aube…) couvre le plateau : on garde les animations pour quand il se ferme
 {const o=document.getElementById('ov');if(o&&!o.hidden)return}const rd=pd.getBoundingClientRect(),rx=px.getBoundingClientRect();
 if(S.reshuf){S.reshuf=0;for(let k=0;k<5;k++)fly(null,rx,rd,k*60,1);px.classList.add('pulse');setTimeout(()=>px.classList.remove('pulse'),600)}
 if(S.newDraw){const n=S.newDraw;S.newDraw=0;const cs=[...document.querySelectorAll('#hand .card[data-k]')].slice(-n);
  cs.forEach((c,k)=>{c.style.visibility='hidden';fly(S.hand[+c.dataset.k],rd,c.getBoundingClientRect(),120+k*110,0,()=>{c.style.visibility=''})});if(n)setTimeout(()=>SFX.play('card'),120)}
 const n=S.discard.length;if(DISC0<0||n<DISC0)DISC0=n;
 if(n>DISC0){const h=$('#hand').getBoundingClientRect();S.discard.slice(DISC0).slice(-5).forEach((t,k)=>fly(t,FLYSRC.shift()||LASTRECT||h,rx,k*90));DISC0=n}
 FLYSRC.length=0;LASTRECT=null}
const backHtml=n=>`<span class="pb"><b>${n}</b></span>`;
function pilesHtml(){const pd=$('#pDraw'),px=$('#pDisc'),pr=$('#pRes');if(!pd)return;
 pd.innerHTML=`${backHtml(S.draw.length)}<em>Pioche</em>`;pd.disabled=S.busy;
 const top=S.discard[S.discard.length-1];px.innerHTML=(top?`<span class="pt" style="background-image:url('${artUrl(top)}')"></span>`:'<span class="pt empty"></span>')+`<b class="pn">${S.discard.length}</b><em>Défausse</em>`;px.disabled=S.busy;
 const b=G.bench||[];pr.hidden=!b.length;if(b.length){pr.innerHTML=`<span class="pt${b[0].gold?' gold':''}" style="background-image:url('${artUrl(b[0].t)}')">${b[0].gold?`<i class="pstars">${'★'.repeat(b[0].gold)}</i>`:''}</span><b class="pn">${b.length}</b><em>Réserve</em>`;pr.disabled=S.busy;pr.classList.toggle('sel',S.bsel!=null)}}
// voir le contenu d'un tas
const pileView=(ts,ordered)=>{if(!ts.length)return '<p>Vide.</p>';if(ordered)return `<div class="plist">${ts.map(t=>`<div class="pl"><span class="pt" style="background-image:url('${artUrl(t)}')"></span>${cardName(t)}</div>`).join('')}</div>`;
 const c={};ts.forEach(t=>c[t]=(c[t]||0)+1);return `<div class="plist">${Object.keys(c).sort((a,b)=>cardName(a).localeCompare(cardName(b))).map(t=>`<div class="pl"><span class="pt" style="background-image:url('${artUrl(t)}')"></span>${cardName(t)}${c[t]>1?` <b>×${c[t]}</b>`:''}</div>`).join('')}</div>`};
$('#pDraw').addEventListener('click',()=>{if(S.busy)return;SFX.play('ui');show(`<h2 class="pw">Pioche : ${plural(S.draw.length,'carte','cartes')}</h2><p>Les cartes que tu vas piocher, dans le désordre (l’ordre reste secret). Quand la pioche est vide, la défausse est mélangée pour la remplir.</p>${pileView(S.draw)}<button type="button" class="go" data-a="closeov">Fermer</button>`)});
$('#pDisc').addEventListener('click',()=>{if(S.busy)return;SFX.play('ui');show(`<h2 class="pw">Défausse : ${plural(S.discard.length,'carte','cartes')}</h2><p>Les cartes jouées, utilisées ou tombées, de la plus récente à la plus ancienne. Elles reviendront quand la pioche sera vide.</p>${pileView(S.discard.slice().reverse(),1)}<button type="button" class="go" data-a="closeov">Fermer</button>`)});
$('#pRes').addEventListener('click',()=>{if(S.busy)return;SFX.play('ui');const b=G.bench||[];if(b.length===1&&!b[0].koUntil){S.bsel=S.bsel===0?null:0;S.sel=null;S.moveFrom=null;S.inspect=null;render();return}
 show(`<h2 class="pw">Réserve</h2><p>Tes unités rappelées. Choisis-en une, puis touche une case en vert pour la reposer gratuitement.</p><div class="picks">${b.map((u,k)=>`<button type="button" class="pick" data-a="bpick" data-v="${k}" ${u.koUntil?'disabled':''}>${cardFace(u.t,{mini:1,cost:0,gold:u.gold,tag:u.koUntil?`Blessé · jour ${u.koUntil+1}`:(u.name||'')})}</button>`).join('')}</div><button type="button" class="skip" data-a="closeov">Fermer</button>`)});

/* ---------- sauvegarde (localStorage, marche aussi dans Electron/Tauri) ---------- */
const SAVE_KEY='abri-save',SAVE_V=3; // v3 : carte 9×9 (les anciennes sauvegardes en 7×7 sont ignorées)
function save(){if(TEST)return;try{G.rs=RS;const g={...G,event:G.event.id,z:[],pending:[],tick:0};localStorage.setItem(SAVE_KEY,JSON.stringify({v:SAVE_V,g,s:{draw:S.draw,discard:S.discard,hand:S.hand,used:S.used,next:S.next,phase:S.phase,picks:S.picks,store:S.store}}))}catch(e){}}
function loadSave(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY));if(d&&d.v===SAVE_V&&d.g&&d.s){['draw','discard','hand','used'].forEach(k=>{if(Array.isArray(d.s[k]))d.s[k]=d.s[k].filter(t=>Z.U[t])});if(d.s.next&&!Z.U[d.s.next])d.s.next=null;
  if(Array.isArray(d.g.grid))d.g.grid=d.g.grid.map(u=>u&&Z.U[u.t]?u:null);if(Array.isArray(d.g.bench))d.g.bench=d.g.bench.filter(u=>u&&Z.U[u.t]);return d}}catch(e){}return null}
function clearSave(){if(TEST)return;try{localStorage.removeItem(SAVE_KEY)}catch(e){}}
function resume(d){try{UNDO=[]}catch(e){}
 newGame(d.g.char,d.g.place);
 Object.assign(G,d.g,{event:Z.EVENTS.find(e=>e.id===d.g.event)||Z.EVENTS[0]});Z.touch(G);
 RS=d.g.rs||RS;Object.assign(S,d.s,{sel:null,busy:false});if(G.ammo>0){for(let k=0;k<G.ammo;k++)S.hand.push('shell');G.ammo=0}S.used=S.used||[];G.bench=G.bench||[];S.bsel=null;S.board=G.grid.filter(Boolean).concat(G.bench);POS=new Map();G.grid.forEach((u,j)=>{if(u)POS.set(u,j)});DISC0=-1;
 hide();render();
 if(S.phase)dawnStep(S.phase,S.picks);
}
