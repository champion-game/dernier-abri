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
const VERSION='v136 · 19 oct.';
/* mise à jour automatique : version.txt (à la racine) contient le numéro de la dernière version publiée.
   Si la page chargée est plus ancienne (cache du site ou du téléphone), on la recharge avec une adresse neuve,
   ce qui contourne les deux caches. Une seule tentative par version, pour ne jamais boucler. */
(()=>{try{if(location.protocol==='file:')return;const cur=VERSION.split(' ')[0];
 fetch('version.txt?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{const v=(t||'').trim();
  if(!/^v\d+$/.test(v)||v===cur)return;const k='abri-upd-'+v;try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1')}catch(e){}
  location.replace(location.pathname+'?v='+v.slice(1)+location.hash)}).catch(()=>{})}catch(e){}})();
// slowT : ralenti (mort du Colosse) jusqu'à cet instant
// options du joueur (enregistrées sur l'appareil)
const OPT=(()=>{const d={sfx:1,mus:1,speed:1,shake:1,vib:1,text:0,eco:0,all:0,back:'',shelter:'',lang:'fr'};try{return Object.assign(d,JSON.parse(localStorage.getItem('abri-opts'))||{})}catch(e){return d}})();
function saveOpt(){try{localStorage.setItem('abri-opts',JSON.stringify(OPT))}catch(e){}}
function applyOpt(){try{SFX.setVol(OPT.sfx,OPT.mus);SFX.setMaxVoices(OPT.eco?5:10)}catch(e){}document.documentElement.classList.toggle('bigtext',!!OPT.text);document.documentElement.classList.toggle('eco',!!OPT.eco);document.documentElement.classList.toggle('goldback',OPT.back==='gold');if(typeof fit==='function'&&cv){fit.w0=0}document.documentElement.lang=OPT.lang}
const TICK=650;let SPEED=1,slowT=0;const tickMs=()=>TICK/SPEED*(performance.now()<slowT?3:1);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
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
function achScreen(back){const got=META.ach||{},n=ACH.filter(a=>got[a[0]]).length;
 show(`<h2 class="pw">Succès</h2><p>Tu en as débloqué <b>${n} sur ${ACH.length}</b>.</p><div class="achs">${ACH.map(a=>`<div class="achi${got[a[0]]?' on':''}"><span class="ach-ic">${got[a[0]]?ii(a[1]):ii('lock')}</span><span><b>${a[2]}</b><em>${a[3]}</em></span></div>`).join('')}</div>
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
 g.fillStyle='#34432a';g.fillRect(0,0,W,H);for(let i=0;i<W*H/60;i++){g.fillStyle=['#46583a','#2c3a22','#40422e'][Math.floor(r()*3)];g.globalAlpha=.5;g.fillRect(r()*W,r()*H,1+r()*2*k,1+r()*2*k)}g.globalAlpha=1;
 // les routes continuent hors du plateau
 g.strokeStyle='#6a5a3e';g.lineWidth=26*k;g.beginPath();g.moveTo(0,cy);g.lineTo(W,cy);g.moveTo(cx,0);g.lineTo(cx,H);g.stroke();
 g.strokeStyle='rgba(30,24,16,.5)';g.lineWidth=2*k;g.beginPath();[-6,6].forEach(o2=>{g.moveTo(0,cy+o2*k);g.lineTo(W,cy+o2*k);g.moveTo(cx+o2*k,0);g.lineTo(cx+o2*k,H)});g.stroke();
 g.fillStyle='rgba(8,10,6,.45)';g.fillRect(0,0,W,H);
 // arbres serrés, en évitant la route
 const tree=(x,y,s)=>{g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+3*k,y+4*k,s,0,7);g.fill();[['#16200f',1],['#1d2a14',.75],['#25351a',.45]].forEach(([c,q])=>{g.fillStyle=c;g.beginPath();g.arc(x-s*(1-q)*.3,y-s*(1-q)*.3,s*q,0,7);g.fill()})};
 const step=14*k;for(let y=-step;y<H+step;y+=step)for(let x=-step;x<W+step;x+=step){const px=x+(r()-.5)*step,py=y+(r()-.5)*step;if(Math.abs(py-cy)<18*k||Math.abs(px-cx)<18*k)continue;if(r()<.8)tree(px,py,(7+r()*7)*k)}}
addEventListener('resize',()=>setTimeout(drawWoods,60));
/* ground, pre-rendered once */
const MIDN=(Z.N-1)/2;
const ground=document.createElement('canvas');ground.width=ground.height=L*2;
(function(){const g=ground.getContext('2d');g.scale(2,2);const r=rng(11);
 g.fillStyle='#34432a';g.fillRect(0,0,L,L);
 // taches de boue et d'herbe plus sombre
 for(let k=0;k<40;k++){const x=r()*L,y=r()*L;g.fillStyle=r()<.5?'rgba(40,32,20,.25)':'rgba(20,34,16,.3)';g.beginPath();g.ellipse(x,y,8+r()*18,5+r()*12,r()*3,0,7);g.fill()}
 for(let k=0;k<2600;k++){const x=r()*L,y=r()*L,s=1+r()*3;g.fillStyle=['#46583a','#34432a','#4d603c','#40422e','#525440'][Math.floor(r()*5)];g.globalAlpha=.55;g.fillRect(x,y,s,s)}
 g.globalAlpha=1;
 // touffes d'herbe
 for(let k=0;k<420;k++){const x=r()*L,y=r()*L;g.strokeStyle=r()<.5?'#526a3c':'#2c3a22';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x-1.5,y-3);g.moveTo(x,y);g.lineTo(x+1.5,y-3);g.stroke()}
 // dirt roads to the shelter
 g.strokeStyle='#6a5a3e';g.lineCap='round';g.lineWidth=26;g.beginPath();g.moveTo(L/2,0);g.lineTo(L/2,L);g.moveTo(0,L/2);g.lineTo(L,L/2);g.stroke();
 for(let k=0;k<900;k++){const along=r()*L,off=(r()-.5)*24,h=r()<.5;const x=h?along:L/2+off,y=h?L/2+off:along;g.fillStyle=r()<.5?'#7a6849':'#574a33';g.fillRect(x,y,2,2)}
 // tire ruts
 g.strokeStyle='rgba(30,24,16,.5)';g.lineWidth=2;g.beginPath();g.moveTo(L/2-6,0);g.lineTo(L/2-6,L);g.moveTo(L/2+6,0);g.lineTo(L/2+6,L);g.stroke();
 // rocks and debris on the inner area
 for(let k=0;k<26;k++){const x=T+r()*(L-2*T),y=T+r()*(L-2*T);if(Math.abs(x-L/2)<20||Math.abs(y-L/2)<20)continue;g.fillStyle='#4b4d44';g.beginPath();g.ellipse(x,y,2+r()*3,1.5+r()*2,r()*3,0,7);g.fill()}
 // outer ring: dark woods where the horde comes from
 g.fillStyle='rgba(8,10,6,.45)';g.fillRect(0,0,L,T);g.fillRect(0,L-T,L,T);g.fillRect(0,T,T,L-2*T);g.fillRect(L-T,T,T,L-2*T);
 const tree=(x,y,s)=>{g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+3,y+4,s,0,7);g.fill();
  [['#16200f',1],['#1d2a14',.75],['#25351a',.45]].forEach(([c,k])=>{g.fillStyle=c;g.beginPath();g.arc(x-s*(1-k)*.3,y-s*(1-k)*.3,s*k,0,7);g.fill()})};
 for(let k=0;k<170;k++){const side=Math.floor(r()*4),a=r()*L,d=r()*T*.55;let x,y;
  if(side===0){x=a;y=d}else if(side===1){x=a;y=L-d}else if(side===2){x=d;y=a}else{x=L-d;y=a}
  if(Math.abs(x-L/2)<18&&(y<T||y>L-T))continue;if(Math.abs(y-L/2)<18&&(x<T||x>L-T))continue;
  tree(x,y,7+r()*9)}
 // planches et débris abandonnés
 for(let k=0;k<9;k++){const x=T*1.2+r()*(L-2.4*T),y=T*1.2+r()*(L-2.4*T);if(Math.abs(x-L/2)<24||Math.abs(y-L/2)<24)continue;g.save();g.translate(x,y);g.rotate(r()*3);g.fillStyle='#0e110b';g.fillRect(-9.5,-2.5,19,5);g.fillStyle='#6b5236';g.fillRect(-8.5,-1.5,17,3);g.restore()}
 // inner border: broken fence line
 g.strokeStyle='rgba(120,100,70,.35)';g.lineWidth=1.5;g.setLineDash([7,6]);g.strokeRect(T+.5,T+.5,L-2*T-1,L-2*T-1);g.setLineDash([]);
 // jeu de société : cases imprimées sur le plateau (filet sombre + reflet clair), coins arrondis discrets
 for(let rr=1;rr<Z.N-1;rr++)for(let c=1;c<Z.N-1;c++){if(rr===MIDN&&c===MIDN)continue;const x=c*T,y=rr*T;
  g.strokeStyle='rgba(10,12,6,.38)';g.lineWidth=1.4;g.strokeRect(x+2.5,y+2.5,T-5,T-5);g.strokeStyle='rgba(255,240,200,.07)';g.lineWidth=1;g.strokeRect(x+3.6,y+3.6,T-7.2,T-7.2)}
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
 const lv=(u.lvA||0)+(u.lvD||0);if(lv){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(p0.x+11,p0.y+14,18,12);ctx.fillStyle='#9fd86b';ctx.font='bold 9px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('N'+lv,p0.x+20,p0.y+23)}
 const eq=Z.eqOf(u);if(eq.length){ctx.font='10px system-ui,sans-serif';ctx.textAlign='center';eq.slice(0,4).forEach((t,k)=>{const ex=p0.x-25,ey=p0.y-8+k*13;circ(ex,ey,6.8,'rgba(10,10,10,.8)');glyph(EQIC[t]||'pack',ex,ey,9,'#fff',2.6)})}
 const mx=Z.maxHp(G,u);if(D0.block)hpBar(p0.x,p0.y-31,u.hp/mx,u.hp/mx>.4?'#9fd86b':'#e5484d');
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
  case 'clay':{ctx.save();ctx.translate(x,y);ctx.rotate(out+Math.PI/2);circ(1,3,10,'rgba(0,0,0,.3)');ctx.fillStyle=INK;ctx.beginPath();ctx.arc(0,9,13,Math.PI*1.2,Math.PI*1.8);ctx.lineTo(0,3);ctx.fill();oRect(-8,-4,16,6,'#4f6b3f',1);ctx.fillStyle='#ddd';ctx.font='bold 4px sans-serif';ctx.fillText('FRONT',-6,0);if(Math.floor(now/400)%2)circ(6,-2,1.2,'#ff3b3b');ctx.restore();break}
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
  g.forEach(k=>{const p=tc(k),f=fw(k);hpBar(p.x,p.y-24,f,f>.4?'#9fd86b':'#e5484d')})})}
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
 if(!v.dying){const ex=Math.cos(a+wob),ey=Math.sin(a+wob);if(!sprK('z_'+k)[0])EYES.push([p.x+ex*5.5*sz,p.y+ey*5.5*sz,-ey,ex,sz,alpha]);if(v.hp<v.max||(Z.ZT[k]||{}).boss)hpBar(p.x,p.y-17*sz,v.hp/v.max,'#e5484d')}
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
 const ls=[{x:CEN.x,y:CEN.y,r:T*2.1}];
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
function drawDark(now){
 if(nightAmt<.01)return;const k=dark.width/L;
 dctx.setTransform(1,0,0,1,0,0);dctx.globalCompositeOperation='source-over';dctx.clearRect(0,0,dark.width,dark.height);
 dctx.fillStyle=`rgba(4,7,18,${.66*nightAmt})`;dctx.fillRect(0,0,dark.width,dark.height);
 dctx.setTransform(k,0,0,k,0,0);dctx.globalCompositeOperation='destination-out';
 for(const l of lights(now))dctx.drawImage(LIGHT,l.x-l.r,l.y-l.r,2*l.r,2*l.r);
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(dark,0,0,cv.width,cv.height);ctx.restore();
 ctx.save();ctx.globalCompositeOperation='lighter';const r=T*1.6,g=ctx.createRadialGradient(CEN.x,CEN.y,0,CEN.x,CEN.y,r);g.addColorStop(0,`rgba(255,170,60,${.12*nightAmt})`);g.addColorStop(1,'rgba(255,170,60,0)');ctx.fillStyle=g;ctx.fillRect(CEN.x-r,CEN.y-r,2*r,2*r);ctx.restore();
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
function frameInner(now){
 const dt=Math.min(50,now-last);last=now;fit();
 nightAmt+=(nightTarget-nightAmt)*Math.min(1,dt/450);SFX.night(nightAmt);
 let sx=0,sy=0;if(now-shakeT<260&&!reduce){const k=(1-(now-shakeT)/260)*shakeK;sx=(Math.random()-.5)*k;sy=(Math.random()-.5)*k}
 ctx.setTransform(SC,0,0,SC,sx*SC,sy*SC);
 BARS=[];EYES=[];LABELS=[];
 ctx.drawImage(ground,0,0,L,L);try{drawPlace(now)}catch(e){}ctx.drawImage(decal,0,0,L,L);
 if(!S.busy&&S.drag){const t=selCard();ctx.fillStyle='rgba(242,179,61,.28)';ctx.strokeStyle='#f2b33d';ctx.lineWidth=2;S.drag.cells.forEach(j=>{const p=tc(j);ctx.fillRect(p.x-T/2+3,p.y-T/2+3,T-6,T-6);ctx.strokeRect(p.x-T/2+3,p.y-T/2+3,T-6,T-6)});
  const q=tc(S.drag.cells[S.drag.cells.length-1]);safeTxt(q.x,q.y+5,`${S.drag.cells.length}/${Z.charges(G,t,selReuse())} · ${Z.lineCost(G,t,S.drag.cells.length,selReuse())} énergie`,'#fff')}
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
 drawDark(now);
 if(nightAmt>.05){ctx.save();ctx.shadowColor='#ff2a2a';ctx.shadowBlur=6;for(const[x,y,nx,ny,sz,al]of EYES){ctx.globalAlpha=al*nightAmt;circ(x+nx*2*sz,y+ny*2*sz,1.3*sz,'#ff4a3a');circ(x-nx*2*sz,y-ny*2*sz,1.3*sz,'#ff4a3a')}ctx.restore()}
 drawBars();
 ctx.save();ctx.font='bold 10px "Atkinson Hyperlegible",system-ui,sans-serif';ctx.textAlign='center';for(const[x,y,n]of LABELS){const w=ctx.measureText(n).width+8;ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x-w/2+1,y-9,w,13);ctx.fillStyle='#efe3c6';ctx.fillRect(x-w/2,y-10,w,13);ctx.strokeStyle='rgba(90,70,40,.8)';ctx.lineWidth=.8;ctx.strokeRect(x-w/2+.5,y-9.5,w-1,12);ctx.fillStyle='#2b1a0c';ctx.fillText(n,x,y)}ctx.restore();
 drawFloats(now);
 if(KC.on&&KC.n){ctx.save();const q=clamp((now-KC.t)/300,0,1),k=1+.5*(1-q);ctx.translate(30,22);ctx.scale(k,k);ctx.font='bold 16px "Special Elite",system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillText(KC.n,9,6);ctx.fillStyle=q<1?'#ffd25a':'#ebe7da';ctx.fillText(KC.n,8,5);glyph('skull',-12,0,14,q<1?'#ffd25a':'#ebe7da',2.2);ctx.restore()}
 if(now-hurtT<400){ctx.save();ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.width*.3,cv.width/2,cv.height/2,cv.width*.75);g.addColorStop(0,'rgba(229,72,77,0)');g.addColorStop(1,`rgba(229,72,77,${.45*(1-(now-hurtT)/400)})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);ctx.restore()}
}

const powered=()=>G.event.id!=='coupure'||G.relics.includes('groupe')||G.grid.some(u=>u&&u.t==='solar');
function safeTxt(x,y,t,c){ctx.font='bold 14px system-ui,sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(t,x+1,y+1);ctx.fillStyle=c;ctx.fillText(t,x,y)}

/* ---------- combat events → visuals ---------- */
function playEvents(ev,types,now){
 const shots=new Set(),dead=ev.filter(e=>e.k==='die');
 // victimes : compteur, « Carnage » si au moins 3 morts d'un coup, ralenti à la mort du Colosse
 if(dead.length){KC.n+=dead.length;KC.t=now;
  if(dead.length>=3){const ps=dead.map(e=>tc(e.i)),cx=ps.reduce((a,p)=>a+p.x,0)/ps.length,cy=ps.reduce((a,p)=>a+p.y,0)/ps.length;floatTxt(cx,cy-10,dead.length>=5?`Carnage ×${dead.length} !`:`Triple !${dead.length>3?' ×'+dead.length:''}`,'#ff9a2e',17);shake(now,4)}
  try{SFX.play('zdie',.22)}catch(x){}
  dead.forEach(e=>{const v=V.get(e.zid),p=v?zpos(v,now):tc(e.i);burst(p.x,p.y,'#d8d0b8',5,.07,1.6);burst(p.x,p.y,'rgba(140,20,24,.9)',9,.1,2.4);addFX({type:'ring',x:p.x,y:p.y,r:26,c:'rgba(229,72,77,.8)',dur:260});
   // gros zombies : éclair et secousse à leur mort
   if(v&&['fat','armor','howl','sap'].includes(v.k)&&!e.boss){shake(now,4);addFX({type:'flash',x:p.x,y:p.y,r:22,c:'rgba(255,120,80,.6)',dur:180})}
   if(e.boss){vib(220);slowT=now+1800;shake(now,14);addFX({type:'ring',x:p.x,y:p.y,r:120,c:'#f2b33d',dur:900});addFX({type:'flash',x:p.x,y:p.y,r:50,c:'rgba(255,200,90,.9)',dur:700,light:T*3});burst(p.x,p.y,'rgba(140,20,24,.9)',30,.15,3);floatTxt(CEN.x,CEN.y-50,(v&&v.k==='mere')?'LA MÈRE EST TOMBÉE':(v&&v.k==='zero')?'LE PATIENT ZÉRO EST TOMBÉ':'LE COLOSSE EST TOMBÉ','#f2b33d',20);SFX.play('boom');if(v)ach(v.k==='mere'?'mere':v.k==='zero'?'zero':'colosse')}})
  if(dead.length>=5)ach('carnage')}
 const SND={v_hmg:'mg',v_sniper:'snp',v_rdog:'bark',v_apc:'melee',sap:'boom',rocket:'cannon',doc:'shot',nailer:'mg',ranger:'snp',chief_comm:'shot',chief_tech:'mg',amb:'melee',orderly:'melee',chief_care:'melee',nightsnp:'snp',heavyflame:'flame',fortin:'shot',autogun:'mg',slaughter:'melee',gang:'shot',saint:'melee',tracker:'bow',k9squad:'bark',swat:'snp',vigile:'shot',hunter:'bow',sentry:'mg',turret:'mg',mortar:'cannon',tesla:'hit',bunker:'shot',riot:'melee',k9:'bark',dogs:'bark',pitch:'melee',gun:'shot',kid:'shot',snp:'snp',sht:'sht',mg:'mg',xbow:'bow',flame:'flame',axe:'melee',dog:'bark',cop:'melee',butch:'melee',monk:'melee'};
 for(const e of ev){
  try{if(e.k==='hit'){const sd=SND[types[e.src]]||'hit';SFX.play(sd,sd==='bark'?.7:undefined)}else if(e.k==='bite'||e.k==='spit')SFX.play(e.i===Z.C?'shelter':'bite');
   else if(e.k==='boom')SFX.play('boom');else if(e.k==='lost')SFX.play(e.name?'death':'lost',.3);else if(e.k==='ko')SFX.play('lost',.3);else if(e.k==='molo')SFX.play('flame');else if(e.k==='howl')SFX.play('groan',.2)}catch(x){}
  if(e.k==='hit'){const v=V.get(e.zid);const tp=v?(v.dying?{x:v.dx,y:v.dy}:zpos(v,now)):tc(e.i);if(v)v.flash=now;
   {const dm=parseInt(e.txt.replace('−',''))||0;floatTxt(tp.x,tp.y,e.txt,dm>=10?'#ff9a2e':dm>=4?'#ffd25a':'#ffffff',dm>=10?23:dm>=4?17:13);if(dm>=10)shake(now,3)}burst(tp.x,tp.y,'rgba(140,20,24,.9)',4,.06,2);splat(tp.x,tp.y,false);
   const t=types[e.src],sp=tc(e.src);
   if(t)facing[e.src]=Math.atan2(tp.y-sp.y,tp.x-sp.x);
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
  if(e.k==='boom'){const p=tc(e.i);addFX({type:'flash',x:p.x,y:p.y,r:46,c:'rgba(255,160,60,.9)',dur:380,light:T*2.2});addFX({type:'ring',x:p.x,y:p.y,r:70,c:'#ffb35c',dur:420});burst(p.x,p.y,'#ff9a2e',22,.2,3);burst(p.x,p.y,'#3a3a3a',14,.12,4);shake(now,8);gx.fillStyle='rgba(15,12,10,.6)';gx.beginPath();gx.arc(p.x,p.y,22,0,7);gx.fill()}
  if(e.k==='bite'){const v=V.get(e.zid),p=tc(e.i);
   if(e.i===Z.C){shake(now,8);hurtT=now;vib(45);if(v){if((Z.ZT[v.k]||{}).boss){v.lunge=now;v.lx=p.x;v.ly=p.y}else v.bit=1}floatTxt(p.x,p.y-8,e.txt,'#ff6b6b');burst(p.x,p.y,'rgba(140,20,24,.9)',8,.08,2)}
   else{if(v){v.lunge=now;v.lx=p.x;v.ly=p.y}floatTxt(p.x,p.y,e.txt,'#ff6b6b');burst(p.x,p.y,types[e.i]==='car'?'#9a9a9a':'#a07a4a',5,.07,2)}}
  if(e.k==='ko'||e.k==='lost')vib(e.name?[70,50,70]:30);
  if(e.k==='ko'){const p=tc(e.i);burst(p.x,p.y,'rgba(140,20,24,.9)',8,.08,2);floatTxt(p.x,p.y-12,'Blessé : en réserve','#ffb35c',13)}
  if(e.k==='lost'){const p=tc(e.i);burst(p.x,p.y,'#8a6a45',16,.12,3);burst(p.x,p.y,'rgba(140,20,24,.9)',6,.08,2);splat(p.x,p.y,true)}
  if(e.k==='spit'){const v=V.get(e.zid),p=tc(e.i),f=v?zpos(v,now):tc(e.from);addFX({type:'tracer',x1:f.x,y1:f.y,x2:p.x,y2:p.y,c:'#c6e83a',w:3,dur:220});burst(p.x,p.y,'#b7d83a',6,.06,2);floatTxt(p.x,p.y,e.txt,'#c6e83a');if(e.i===Z.C){shake(now,5);hurtT=now}}
  if(e.k==='smoke'){const p=tc(e.i);for(let k=0;k<26;k++)PT.push({x:p.x+(Math.random()-.5)*90,y:p.y+(Math.random()-.5)*90,vx:(Math.random()-.5)*.01,vy:-.008,t0:now,dur:1800,c:'rgba(190,200,190,.35)',r:8+Math.random()*8,light:0})}
  if(e.k==='eat'){const p=tc(e.i);floatTxt(p.x,p.y,'miam','#ff9a9a');burst(p.x,p.y,'rgba(140,20,24,.9)',4,.04,2)}
  if(e.k==='molo'){const p=tc(e.i),sp=tc(e.src);addFX({type:'tracer',x1:sp.x,y1:sp.y,x2:p.x,y2:p.y,c:'#3c7a3a',w:2,dur:200});addFX({type:'flash',x:p.x,y:p.y,r:30,c:'rgba(255,140,40,.8)',dur:320,light:T*1.6});burst(p.x,p.y,'#ff9a2e',16,.12,3)}
  if(e.k==='howl'){const p=tc(e.i);addFX({type:'ring',x:p.x,y:p.y,r:60,c:'#e0a0c0',dur:500});floatTxt(p.x,p.y-10,'HOOO !','#e0a0c0')}
  if(e.k==='block'){const p=tc(e.i);floatTxt(p.x,p.y-6,'Bloqué','#7cc7ff');addFX({type:'ring',x:p.x,y:p.y,r:26,c:'#7cc7ff',dur:220});try{SFX.play('hit')}catch(x){}}
  if(e.k==='saved'){const p=tc(e.i);floatTxt(p.x,p.y-10,'Increvable !','#f2b33d');addFX({type:'ring',x:p.x,y:p.y,r:40,c:'#f2b33d',dur:400})}
  if(e.k==='air'){shake(now,10);const c=tc(e.i);addFX({type:'ring',x:c.x,y:c.y,r:T*2.5,c:'#ffb35c',dur:500});for(let k=0;k<6;k++){const x=c.x+(Math.random()-.5)*T*4,y=c.y+(Math.random()-.5)*T*4;addFX({type:'flash',x,y,r:30,c:'rgba(255,170,60,.8)',dur:400,light:T*1.5})}SFX.play('boom')}
  if(e.k==='breach'){shake(now,6);floatTxt(CEN.x,CEN.y-46,'BRÈCHE ! La horde accélère','#e5484d',15)}
  if(e.k==='shot'){const v=V.get(e.zid),tp=v?zpos(v,now):CEN;addFX({type:'tracer',x1:CEN.x,y1:CEN.y-10,x2:tp.x,y2:tp.y,c:'#fff4c8',w:2,dur:260});addFX({type:'flash',x:CEN.x,y:CEN.y-10,r:8,c:'#ffe08a',dur:120,light:T})}
  if(e.k==='heal'){const p=tc(e.i);for(let k=0;k<3;k++)PT.push({x:p.x+(Math.random()-.5)*20,y:p.y,vx:0,vy:-.03,t0:now,dur:500,c:'#7ee08a',r:2.5,light:0})}
 }
}

/* ---------- UI ---------- */
// jeu de société : la fiche de nuit (événement, jetons de zombies, frénésie, tampon) et la piste des nuits
function ficheHtml(){const w=Z.waveList(G),fz=Z.frenzy(G),dm=Z.dmgBonus(G.night),boss=Z.bigNight(G,w);
 const fin=G.night===Z.WIN_NIGHT&&!G.won;const stamp=S.busy?'':fin?'<i class="stamp boss">Boss final</i>':boss?`<i class="stamp boss">${ZN[Z.leadBoss(G.night)||'boss'][0]}</i>`:Z.pressure(G.night)?'<i class="stamp red">Nuit rouge</i>':Z.respite(G.night,G)?'<i class="stamp calm">Répit</i>':'';
 const toks=S.busy?'':Z.ZK.filter(k=>w[k]).map(k=>`<span class="ztk" title="${plural(w[k],...ZN[k])}"><span class="ztk-i" style="background-image:url('assets/sprites_cartoon/z_${k}.webp')"></span><b>${w[k]}</b></span>`).join('');
 const fzt=fz&&!S.busy?`<span class="ztk fz" title="Frénésie meurtrière : +${fz} % de PV"><span class="ztk-i">${ii('drop','zw')}</span><b>+${fz}%</b></span>`:'';
 return `<div class="fiche-top"><b title="${G.event.n}">${G.night===Z.WIN_NIGHT&&!G.won?'Dernière nuit : les secours arrivent à l’aube.':G.event.p||G.event.n}</b>${G.side>=0?`<span class="poem">Fusée : ils viendront ${['du nord','du sud','de l’ouest','de l’est'][G.side]}</span>`:''}</div>${toks||fzt?`<div class="ztoks">${toks}${fzt}</div>`:''}${stamp}`}
function trackHtml(){const a=Math.floor((G.night-1)/10)*10+1,mut=G.muts&&G.muts[0],soon=Z.mutNight(G.night),cells=[];
 for(let n=a;n<a+10;n++){const cls=(n%10===0?' boss':n%5===0?' red':Z.respite(n,G)?' calm':'')+(n<G.night?' past':'')+(n===G.night?' now':'');
  cells.push(`<span class="tc${cls}" title="Nuit ${n}${n%10===0?' : '+bossName(n):n%5===0?' : nuit rouge':Z.respite(n,G)?' : nuit de répit':''}">${n%10===0?ii('skull'):n}${n===G.night?'<i class="meeple"></i>':''}</span>`)}
 return `<span class="track">${cells.join('')}</span>`}
// jetons mutation et ferraille : au bout de la rangée des jetons d'unités et de factions
function tagsHtml(){const mut=G.muts&&G.muts[0],soon=Z.mutNight(G.night);return `<span class="tags">${mut?`<span class="tok mut${soon?' soon':''}" data-tok="mut" title="Mutation instable : ${Z.MUTS[mut].n}">${svg('mut')}</span>`:''}<span class="tok coin" title="Ferraille">${G.scrap}</span></span>`}
const cardName=t=>Z.stat(G,t).n;
const roleTag=t=>{const r=Z.roleOf(t);return r?`<span class="role" title="${Z.ROLES[r].n}">${ink(r)}</span>`:''};
const roleLine=t=>{const r=Z.roleOf(t);return r?` <em class="ce">${ink(r)} ${Z.ROLES[r].n}</em>`:''};
const famTag=t=>{const f=Z.famOf(t);return f&&seen('fam1')?`<span class="ft">${ink(f)}</span>`:''};
const famLine=t=>{const f=Z.famOf(t);return f&&seen('fam1')?` <em class="ce">${ink(f)} ${Z.FAM[f].n}</em>`:''};
const rar=t=>Z.RAR[t]||'com';
const rarTag=t=>rar(t)==='com'?'':`<span class="rt ${rar(t)}">${Z.RARITY[rar(t)].n}</span>`;
const WIDE=matchMedia('(min-width:760px)');
const left0=()=>Math.max(0,G.energy??0);
function render(){
 try{meterSync()}catch(e){}
 $('#round').innerHTML=(S.busy?`Nuit ${G.night}`:`Jour ${G.night}`)+(G.menace?`<small class="mtag">M${G.menace}</small>`:'');
 $('#shelT').textContent=`${Math.max(0,G.shelter)}/${Z.maxS(G)}`;
 const sb=$('#shelB');sb.style.width=Math.max(0,G.shelter)/Z.maxS(G)*100+'%';sb.className=G.shelter<=3?'low':'';
 $('#event').innerHTML=ficheHtml();
 const mN=G.muts.length,soon=Z.mutNight(G.night);
 $('#horde').innerHTML=trackHtml();
 const left=G.energy??Z.ENERGY;
 const hand=$('#hand'),nH=S.hand.length+new Set(S.used||[]).size;hand.style.setProperty('--n',Math.max(4,Math.min(WIDE.matches?9:5,nH)));
 // en largeur sur grand écran : autant de colonnes que la largeur du panneau le permet (cartes de 100 à 118 px)
 if(LANDTALL.matches&&innerHeight>=640){const cols=Math.max(3,Math.min(Math.max(nH,4),Math.floor((hand.clientWidth+6)/106)));hand.style.gridTemplateColumns=`repeat(${cols},minmax(0,118px))`}else hand.style.gridTemplateColumns='';
 const gcard=(guideStep()||{}).card;hand.innerHTML=S.hand.map((t,k)=>`<button type="button" class="card${S.sel===k?' sel':''}${gcard===t&&S.hand.indexOf(t)===k?' guide':''}" data-k="${k}" ${(S.busy?!Z.U[t].react:Z.U[t].react)||!Z.canPay(G,t)?'disabled':''}>${cardFace(t,{mini:1,v:Z.U[t].react&&!S.busy?'Nuit':''})}</button>`).join('')
  +[...new Set(S.used||[])].map(t=>{const k=S.used.indexOf(t),n=S.used.filter(x=>x===t).length,on=S.sel!==null&&S.sel<0&&S.used[-1-S.sel]===t;
   const tr=Z.isTrace(t),ch=tr?Z.charges(G,t,true):0;
   return `<button type="button" class="card reuse${on?' sel':''}" data-u="${k}" ${S.busy||Z.buildCost(G,t,true)>(G.energy??0)||(tr&&!ch)?'disabled':''}>${cardFace(t,{mini:1,cost:Z.buildCost(G,t,true),tag:tr?`Encore ${ch} case${ch>1?'s':''}`:'Encore'+(n>1?' ×'+n:'')})}</button>`}).join('')
  ;try{pilesHtml();animPiles()}catch(e){}
 const fc=Z.famCounts(G),fl=Z.famLevels(G);const nU=Z.unitCount(G),cap=Z.unitCap(G);$('#fams').innerHTML=`<span class="fam cap${nU>=cap?' full':''}" title="Unités sur le terrain (murs et pièges illimités)">${ink('cap')} ${nU}/${cap}</span>`+Object.keys(Z.FAM).filter(f=>fc[f]&&seen('fam1')).map(f=>`<span class="fam l${fl[f]}" title="${Z.FAM[f].n}">${ink(f)} ${fc[f]}${fl[f]?' '+'★'.repeat(fl[f]):'/'+Z.FAM[f].lv[0]}</span>`).join('')+tagsHtml();
 const info=$('#info');info.className='info';
 if(S.busy&&S.sel!==null&&S.sel>=0){const t=S.hand[S.sel];info.innerHTML=`<b>${cardName(t)}</b> : ${Z.U[t].d}. `+(Z.U[t].react==='unit'?'Touche une unité blessée.':'Touche une case de la carte.')}
 else if(S.pause&&S.moveFrom!==null&&G.grid[S.moveFrom])info.innerHTML=unitLine(G.grid[S.moveFrom])+' Touche une case libre en bleu pour le déplacer.';
 else if(S.pause)info.innerHTML=`<b>Pause : vague ${S.pause} sur ${G.waves} repoussée.</b> ${capF(bossName(G.night))} arrivera par la route en rouge. Déplace tes cartes librement : touche-en une, puis une case libre. `+`<span class="nrg">${'<i class="on"></i>'.repeat(Math.min(10,Math.max(0,left0())))}</span> ${left0()} énergie pour tes réactions.`;
 else if(S.busy){const left=G.z.length+G.pending.length,hasR=S.hand.some(t=>Z.U[t].react);info.innerHTML=`<b>${plural(left,'zombie','zombies')}</b> encore dehors.`+(hasR?` <span class="nrg">${'<i class="on"></i>'.repeat(Math.min(10,Math.max(0,left0())))}</span> ${left0()} énergie pour tes réactions.`:'')}
 else if(S.bsel!=null&&G.bench[S.bsel]){const u=G.bench[S.bsel];info.innerHTML=unitLine(u)+(u.koUntil?` <b>Blessé :</b> se repose, de retour au jour ${u.koUntil+1}.`:Z.capFull(G,u.t)?` <b>Limite de ${Z.unitCap(G)} unités atteinte</b> : rappelle ou fusionne une unité.`:' En réserve : touche une case en vert pour la reposer gratuitement.')}
 else if(S.sel!==null&&!S.busy){const t=selCard(),D=Z.U[t];info.innerHTML=(Z.isUnit(t)&&Z.capFull(G,t)?`<b>Limite de ${Z.unitCap(G)} unités atteinte.</b> Fusionne, ou rappelle une unité dans la réserve. `:'')+`<b>${cardName(t)}</b> (${selCost()} énergie${selReuse()?', réutilisée':''}) : ${D.d}.`+(Z.isTrace(t)?` Carte à tracer : ${Z.charges(G,t,selReuse())} case${Z.charges(G,t,selReuse())>1?'s':''} à poser aujourd’hui${selReuse()?'':' pour le prix de la carte'}, une par une ou d’un glissé.`:'')+(D.onUnit?' Touche une unité blessée.':D.instant?' Touche l’abri.':D.near?' Touche une case collée à l’abri.':Z.LINE.includes(t)?' Touche une case, ou glisse pour tracer une ligne.':' Touche un emplacement.')}
 else if(S.moveFrom!==null&&G.grid[S.moveFrom])info.innerHTML=unitLine(G.grid[S.moveFrom])+' Touche une case libre en bleu pour la déplacer.'+(Z.canRecall(G,S.moveFrom)?' <button type="button" class="recall" data-a="recall">'+ii('back')+' Rappeler</button>':'');
 else if(S.inspect!==null&&G.grid[S.inspect])info.innerHTML=unitLine(G.grid[S.inspect])+(Z.canRecall(G,S.inspect)?' <button type="button" class="recall" data-a="recall">'+ii('back')+' Rappeler</button>':'');
 else info.innerHTML=`<span class="nrg">${'<i class="on"></i>'.repeat(Math.min(10,Math.max(0,left)))}${'<i></i>'.repeat(Math.max(0,Z.ENERGY-left))}</span> <b>${left}</b> énergie. Touche une carte posée pour la déplacer ou la rappeler.`;
 if(TEST&&!S.busy)info.insertAdjacentHTML('beforeend',` <button type="button" class="recall" data-a="tcards">+ Carte (test)</button>`);
 if(canUndo())info.insertAdjacentHTML('beforeend',` <button type="button" class="recall undo" data-a="undo" title="Annuler la dernière action du jour">${ii('undo')} Annuler</button>`);
 // bouton de tir : un seul élément, mis à jour sans être recréé (sinon le toucher peut se perdre pendant la nuit)
 updatePreview();checkHints();
 const tip=$('#tip'),gs=guideStep();if(gs&&ov.hidden){tip.hidden=false;tip.textContent=gs.txt}else if(TUTO<4&&ov.hidden&&(S.busy?TUTO===3:TUTO<3)&&!GUIDE){tip.hidden=false;tip.textContent=TIPS[TUTO]}else tip.hidden=true;
 $('#go').classList.toggle('guide',!!(gs&&gs.go&&ov.hidden));
 $('#info').hidden=!!(gs&&ov.hidden);
 const go=$('#go');go.disabled=false;go.textContent=S.pause?`Lancer la vague ${S.pause+1} sur ${G.waves}`:S.busy?`Vitesse ×${SPEED} (toucher pour changer)`:'Affronter la nuit';go.classList.toggle('speed',S.busy&&!S.pause);
}
$('#hand').addEventListener('click',e=>{const b=e.target.closest('.card');if(!b||b.disabled)return;SFX.play('ui');LASTRECT=b.getBoundingClientRect();
 if(b.dataset.b!==undefined){const k=+b.dataset.b;S.bsel=S.bsel===k?null:k;S.sel=null;S.moveFrom=null;S.inspect=null;render();return}S.bsel=null;
 if(b.dataset.u!==undefined){const k=-1-(+b.dataset.u);S.sel=S.sel===k?null:k;S.moveFrom=null;S.inspect=null;render();return}const k=+b.dataset.k;
 if(S.busy&&Z.U[S.hand[k]].react==='any'){playReact(k,Z.C);return}S.sel=S.sel===k?null:k;S.moveFrom=null;S.inspect=null;if(S.sel!==null)tuto(0);render()});
// rappeler une unité dans la réserve (le jour) : elle garde tout et se repose gratuitement
$('#info').addEventListener('click',e=>{if(e.target.closest('[data-a=undo]')){doUndo();return}if(e.target.closest('[data-a=tcards]')){ACT.tcards();return}const b=e.target.closest('[data-a=recall]');if(!b||S.busy)return;const i=S.moveFrom??S.inspect;if(i==null)return;snapUndo();if(!Z.recall(G,i)){UNDO.pop();return}
 const p=tc(i),u=G.bench[G.bench.length-1];facing[i]=null;addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#9ee08a',dur:350});floatTxt(p.x,p.y-14,`${u.name||cardName(u.t)} en réserve`,'#9ee08a');SFX.play('back');
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
addEventListener('pointermove',e=>{if(!HD)return;if(!HD.on&&Math.hypot(e.clientX-HD.x,e.clientY-HD.y)>12){HD.on=true;HD.g=HD.b.cloneNode(true);HD.g.classList.add('ghost');document.body.appendChild(HD.g);
  const k=HD.b.dataset.u!==undefined?-1-(+HD.b.dataset.u):+HD.b.dataset.k;S.sel=k;S.moveFrom=null;S.inspect=null;render()}
 if(HD.on){HD.g.style.left=e.clientX+'px';HD.g.style.top=e.clientY+'px'}});
addEventListener('pointerup',e=>{if(!HD)return;const d=HD;HD=null;if(!d.on)return;d.g.remove();const r=cv.getBoundingClientRect();
 if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)tapCell(cellAt(e));else render()});
addEventListener('pointercancel',()=>{if(HD&&HD.g)HD.g.remove();HD=null});
$('#round').addEventListener('click',()=>{if(!S.busy&&ov.hidden)runInfo()});
$('#event').addEventListener('click',()=>{if(S.busy||!ov.hidden)return;const w=Z.waveList(G),fz=Z.frenzy(G),dm=Z.dmgBonus(G.night);SFX.play('ui');
 show(`<h2 class="pw">Nuit ${G.night}</h2>${G.event.p?`<p class="poem">${G.event.p}</p>`:''}<p><b>${G.event.n}</b> : ${G.event.d}.</p>${Z.pressure(G.night)?`<p>${ii('drop')} <b>Nuit rouge</b> : 15 % de zombies en plus, puis une mutation instable et une relique à l’aube.</p>`:''}${Z.respite(G.night,G)?`<p>${ii('moon')} <b>Nuit de répit</b> : 30 % de zombies en moins.</p>`:''}${Z.bigNight(G,w)?`<p>${ii('skull')} <b>Nuit de boss : ${bossName(G.night)}</b>. La horde arrive en 2 vagues, le boss dans la seconde. ${Z.ZT[Z.leadBoss(G.night)||'boss'].info.replace(/^[^:]*: /,'')}.</p>`:''}${fz?`<p>${ii('drop')} <b>Frénésie meurtrière</b>  : +${fz} % de PV pour tous les zombies (+10 % de plus chaque nuit).</p>`:''}
  <div class="deck">${Z.ZK.filter(k=>w[k]).map(k=>`<div class="dk" style="--cc:var(--z-${k})"><span class="ztk-i big" style="background-image:url('assets/sprites_cartoon/z_${k}.webp')"></span><span><b>${plural(w[k],...ZN[k])}</b>${Z.ZT[k].info}</span></div>`).join('')}</div><button type="button" class="go" data-a="closeov">Fermer</button>`)});
$('#fams').addEventListener('click',e=>{const t=e.target.closest('[data-tok=mut]');if(!t||!ov.hidden)return;const m=Z.MUTS[G.muts[0]];SFX.play('ui');
 show(`<h2 class="pw">Mutation instable</h2><p><b>${m.n}</b> : ${m.d}.</p><p>Instable, elle ne dure que jusqu’à la prochaine (toutes les 5 nuits).</p><button type="button" class="go" data-a="closeov">Fermer</button>`)});
const cellAt=e=>{const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*L,y=(e.clientY-r.top)/r.height*L;return clamp(Math.floor(y/T),0,Z.N-1)*Z.N+clamp(Math.floor(x/T),0,Z.N-1)};
cv.addEventListener('click',e=>{if(S.skipClick){S.skipClick=false;return}tapCell(cellAt(e))});
// murs en ligne : appuyer sur la 1ʳᵉ case, glisser jusqu'à 4 cases, relâcher
const lineCard=()=>!S.busy&&Z.LINE.includes(selCard())?selCard():null;
cv.addEventListener('pointerdown',e=>{const t=lineCard(),i=cellAt(e);if(!t||selCost()>(G.energy??0)||!Z.canPlace(G,t,i))return;S.drag={a:i,cells:[i]};try{cv.setPointerCapture(e.pointerId)}catch(x){}});
cv.addEventListener('pointermove',e=>{if(!S.drag)return;const t=lineCard();if(!t){S.drag=null;return}const c=Z.lineCells(G,t,S.drag.a,cellAt(e),selReuse());if(c.length!==S.drag.cells.length){S.drag.cells=c;SFX.play('ui')}});
cv.addEventListener('pointerup',e=>{if(!S.drag)return;const cells=S.drag.cells;S.drag=null;if(cells.length>1){S.skipClick=true;placeLineUI(cells)}});
cv.addEventListener('pointercancel',()=>{S.drag=null});
// une carte de construction posée pour la 1ʳᵉ fois passe de la main aux cartes « Encore » et reste choisie
function useBuild(t){if(S.sel>=0){S.hand.splice(S.sel,1);S.used.push(t);S.sel=-S.used.length}}
// carte à tracer dont toutes les cases sont posées : elle quitte la main (défausse)
function spentTrace(t){if(!Z.isTrace(t)||Z.charges(G,t,true)>0)return;const n=S.used.filter(x=>x===t).length;S.used=S.used.filter(x=>x!==t);for(let k=0;k<n;k++)S.discard.push(t);S.sel=null}
// statistiques : nombre de fois où chaque carte est jouée (toutes parties confondues)
function countPlay(t){if(G.daily)return;const c=META.played||(META.played={});c[t]=(c[t]||0)+1;saveMeta(META)}
function placeLineUI(cells){const t=selCard(),re=selReuse();if(Z.lineCost(G,t,cells.length,re)>G.energy)return;if(!re)countPlay(t);tuto(1);useBuild(t);Z.placeLine(G,t,cells,R,re);spentTrace(t);syncBoard();S.moveFrom=null;S.inspect=null;
 cells.forEach(j=>{facing[j]=null;const p=tc(j);addFX({type:'ring',x:p.x,y:p.y,r:30,c:'#f2b33d',dur:350})});const q=tc(cells[cells.length-1]);floatTxt(q.x,q.y-14,`${cells.length} cases`+(Z.charges(G,t,true)>0?` · encore ${Z.charges(G,t,true)}`:''),'#f2b33d');SFX.play('place');save();render()}
// fiche d'une unité : prénom, métier, trait, victimes, PV
function unitLine(u){const tr=Z.TRAITS[u.trait],D=Z.U[u.t],lv=(u.lvA||0)+(u.lvD||0),k=u.kills||0,i=G.grid.indexOf(u),ro=Z.roleOf(u.t);
 const rl=ro?` · ${ink(ro)} <b>${Z.ROLES[ro].n}</b>`+(ro==='tank'?` (provoque à ${Z.TAUNT} cases, bloque 1 coup sur 3)`:'')+(Z.squad(G,i)?' · <b>escouade</b> (+1)':''):'';
 return (u.name?`<b>${u.name}</b>, ${cardName(u.t)}`:`<b>${cardName(u.t)}</b>`)+rl+(u.gold?` <b class="gold">${stars(u)} doré</b>`:'')+(D.evo?' <b class="evo">✦ évolution</b>':'')
  +(tr?` · <b>${tr.n}</b> (${tr.d})`:'')+(D.dmg?` · ${plural(k,'zombie tué','zombies tués')}`+(seen('lvl')?`, niveau suivant à ${Z.lvKills(Z.lvOf(k)+1)}`:''):'')
  +(lv?` · niveau ${lv} (+${u.lvA||0} dégât, +${(u.lvD||0)*3} PV)`:'')+(u.leg?` · porte le souvenir de <b>${u.leg}</b> (+1 dégât, +2 PV)`:'')
  +(g=>g.length>1?` · <b>rempart de ${g.length} murs</b> : ${g.reduce((a,k)=>a+G.grid[k].hp,0)}/${g.reduce((a,k)=>a+Z.maxHp(G,G.grid[k]),0)} PV en commun`:'')(Z.wallGroup(G,G.grid.indexOf(u)))+(u.scar?' · <b>cicatrice</b> : la prochaine chute sera fatale':'')+(Z.eqOf(u).length?` · équipé : ${Z.eqOf(u).map(t=>ii(EQIC[t]||'pack')+' '+Z.U[t].n).join(', ')}`:'')+` · ${u.hp}/${Z.maxHp(G,u)} PV.`}
/* conseils au bon moment : une bulle, une seule fois par joueur, la première fois qu'une situation se présente */
const HINTS={
 fuse:ii('star')+' <b>Fusion !</b> 3 unités identiques deviennent une nouvelle carte avec une étoile de plus : plus de PV, +1 dégât, 2 places libérées, et les 3 cartes repartent dans ta défausse.',
 evo:'✦ <b>Évolution !</b> Certaines paires de cartes posées côte à côte deviennent une nouvelle carte unique, et les deux cartes repartent dans ta défausse. Il en existe d’autres à découvrir : retrouve-les dans la Collection, page Évolutions secrètes.',
 fam1:ii('medal')+' <b>Bonus de faction.</b> 2 survivants de la même faction débloquent son 1ᵉʳ bonus. À 5 survivants : 2ᵉ bonus et équipe complète (+1 dégât, +2 PV). Le pictogramme de faction s’affiche désormais en bas des cartes et en haut de l’écran.',
 fam2:ii('medal')+' <b>Équipe complète !</b> 5 survivants de la même faction : 2ᵉ bonus, +1 dégât et +2 PV pour toute la faction.',
 squad:ink('tank')+ink('heal')+ink('dps')+' <b>Escouade !</b> Un Tank, un Soin et un DPS voisins gagnent chacun +1 dégât (ou +1 soin).',
 cap:ink('cap')+' <b>Limite d’unités atteinte.</b> Fusionne des unités identiques, ou rappelle-en une dans la réserve (touche-la, puis « Rappeler »). Murs, pièges et postes ne comptent pas.',
 post:ii('post')+' <b>Poste de soutien.</b> Les postes (projecteur, hôpital, atelier…) aident sans combattre et ne comptent pas dans la limite d’unités. Les réparateurs les réparent.',
 equip:ii('pack')+' <b>Équipement.</b> Il reste sur l’unité, même rappelée. Une unité porte un seul exemplaire de chaque équipement.',
 ko:ii('band')+' <b>Unité blessée.</b> Elle part en réserve avec ses étoiles et ses niveaux, et revient après 3 nuits de repos. Attention : sa prochaine chute sera fatale.',
 red:ii('drop')+' <b>Nuit rouge ce soir.</b> 15 % de zombies en plus. À l’aube : une nouvelle mutation instable et une relique pour toi.',
 boss:ii('skull')+' <b>Nuit de boss.</b> Toutes les 10 nuits, un boss mène la horde : le Colosse (nuit 10), la Mère (20), le Patient Zéro (30). La horde arrive en 2 vagues. Pendant la pause, sa route s’affiche en rouge : mets-y murs, Tank et pièges. Il fait 10 dégâts par coup et frappe l’abri sans mourir.',
 pause:'⏸️ <b>Pause entre les vagues.</b> Le boss arrivera par la route en rouge. Déplace tes cartes sur son chemin, puis relance.',
 mere:ii('skull')+' <b>La Mère attaque ce soir.</b> Elle pond un rampant tous les 4 tours, et en libère 2 en mourant. Les rampants passent sous les murs : garde des tireurs près de l’abri.',
 zero:ii('skull')+' <b>Le Patient Zéro, boss final.</b> Plus fragile que le Colosse mais plus rapide : les zombies autour de lui accélèrent. Abats-le vite, les munitions anti-Colosse marchent aussi sur lui.',
 respite:ii('moon')+' <b>Nuit de répit.</b> 30 % de zombies en moins après le boss… mais la frénésie meurtrière, elle, ne s’arrête pas : chaque nuit, +10 % de PV.',
 mut:svg('mut')+' <b>Mutation instable.</b> La horde a un affixe pendant 5 nuits (voir l’icône en haut). Puis une autre mutation instable le remplace.'
};
const HQ=[];let hintEl=null,hintT=0;
function hint(k){if(!HINTS[k])return;META.hints=META.hints||{};if(META.hints[k])return;META.hints[k]=1;saveMeta(META);HQ.push(HINTS[k]);showHint()}
function showHint(){if(hintEl&&!hintEl.hidden)return;if(!ov.hidden){setTimeout(showHint,1000);return}const t=HQ.shift();if(!t)return;
 if(!hintEl){hintEl=document.createElement('div');hintEl.className='hint';hintEl.setAttribute('role','status');document.body.appendChild(hintEl);hintEl.addEventListener('click',()=>{hintEl.hidden=true;clearTimeout(hintT);setTimeout(showHint,250)})}
 hintEl.innerHTML=t+'<small>Touche pour fermer</small>';hintEl.hidden=false;SFX.play('ui');clearTimeout(hintT);hintT=setTimeout(()=>{hintEl.hidden=true;setTimeout(showHint,300)},8000)}
function checkHints(){try{if(!G||!S)return;const fl=Object.values(Z.famLevels(G));
 if(fl.some(l=>l>=1))hint('fam1');if(fl.some(l=>l>=2))hint('fam2');
 if(G.grid.some((u,i)=>u&&Z.squad(G,i)))hint('squad');if(Z.unitCount(G)>=Z.unitCap(G))hint('cap');
 if(G.grid.some(u=>u&&Z.U[u.t].cat==='post'))hint('post');if(G.grid.some(u=>u&&Z.eqOf(u).length))hint('equip');
 if((G.bench||[]).some(u=>u.koUntil))hint('ko');if(G.muts&&G.muts.length)hint('mut');if(S.pause)hint('pause');
 if(!S.busy&&ov.hidden){if(Z.bigNight(G)){hint('boss');const L=Z.leadBoss(G.night);if(L&&L!=='boss')hint(L)}else if(Z.pressure(G.night))hint('red');if(Z.respite(G.night,G))hint('respite')}}catch(e){}}
// fusion ou évolution juste après une pose ou un déplacement : effets, son, et découverte enregistrée dans la collection
function mergeFx(m){if(!m||typeof m!=='object')return;const p=tc(m.i),now=performance.now();
 const pull=(j,c)=>{const q=tc(j);facing[j]=null;addFX({type:'tracer',x1:q.x,y1:q.y,x2:p.x,y2:p.y,c,w:3,dur:450});burst(q.x,q.y,c,12,.09,2)};
 if(m.k==='fuse'){hint('fuse');ach('fuse');m.from.forEach(j=>pull(j,'#f2c23d'));addFX({type:'ring',x:p.x,y:p.y,r:64,c:'#f2c23d',dur:650});addFX({type:'flash',x:p.x,y:p.y,r:32,c:'rgba(255,210,90,.8)',dur:420,light:T*1.5});floatTxt(p.x,p.y-22,`Fusion ! ${cardName(m.t)} ${'★'.repeat(m.gold||1)}`,'#f2c23d',16);SFX.play('fuse')}
 if(m.k==='evo'){hint('evo');pull(m.j,'#c58cff');addFX({type:'ring',x:p.x,y:p.y,r:72,c:'#c58cff',dur:750});addFX({type:'flash',x:p.x,y:p.y,r:36,c:'rgba(200,150,255,.85)',dur:500,light:T*1.6});burst(p.x,p.y,'#e0c8ff',18,.12,2.5);floatTxt(p.x,p.y-22,`Évolution : ${Z.U[m.t].n} !`,'#d9b8ff',16);SFX.play('evo');
  META.evo=META.evo||[];if(!META.evo.includes(m.t)){META.evo.push(m.t);saveMeta(META);floatTxt(p.x,p.y+6,'Nouvelle découverte','#ffffff',13)}}
 shake(now,4);achCheck()}
// jouer une réaction pendant la nuit
function playReact(k,i){const t=S.hand[k];const types=G.grid.map(u=>u&&u.t);const ev=Z.react(G,t,i);if(!ev)return false;
 S.hand.splice(k,1);countPlay(t);if(!Z.U[t].once)S.discard.push(t);syncBoard();S.sel=null;const now=performance.now();syncZ(now);playEvents(ev,types,now);
 const p=tc(i);if(t==='shell'&&ev.some(e=>e.k==='die'&&e.boss))ach('ammo');if(t==='shell'){SFX.play('snp');SFX.play('boom');shake(now,9);const z=ev.find(e=>e.k==='shot'),v=z&&V.get(z.zid),q=v?zpos(v,now):CEN;floatTxt(q.x,q.y-30,'Munition !','#ffd25a',20)}if(t==='grenade'||t==='air')SFX.play('boom');else if(t==='shot')SFX.play('snp');else SFX.play('place');
 if(t==='horn'){addFX({type:'ring',x:CEN.x,y:CEN.y,r:200,c:'#f2b33d',dur:600});floatTxt(CEN.x,CEN.y-20,'Reculez !','#f2b33d')}
 if(t==='rush')floatTxt(CEN.x,CEN.y-20,'Adrénaline !','#ff7a59');
 if(t==='patch')floatTxt(p.x,p.y,'+5 PV','#9fd86b');
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
function tapCell(i){
 if(S.busy&&!(S.pause&&S.sel===null)){if(S.sel!==null&&S.sel>=0&&Z.U[S.hand[S.sel]].react)playReact(S.sel,i);return}
 if(S.bsel!=null&&!S.busy){const k=S.bsel;S.bsel=null;snapUndo();const mg=Z.placeBench(G,k,i);if(!mg)UNDO.pop();if(mg){facing[i]=null;syncBoard();mergeFx(mg);S.inspect=typeof mg==='object'?i:null;const p=tc(i);addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#9ee08a',dur:350});SFX.play('place');save()}render();return}
 if(S.sel===null){
  // déplacement d'une carte posée : on la touche, puis on touche une case libre
  if(S.moveFrom!==null){const a=S.moveFrom;S.moveFrom=null;S.inspect=null;if(!S.busy)snapUndo();const mv=Z.move(G,a,i);if(!mv&&!S.busy)UNDO.pop();if(mv){facing[i]=facing[a];facing[a]=null;const p=tc(i);addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#7cc7ff',dur:350});syncBoard();mergeFx(mv);if(typeof mv==='object')S.inspect=i;if(!S.busy)save()}render();return}
  S.inspect=null;if(G.grid[i])S.moveFrom=i;render();
  return}
 const t=selCard(),D=Z.U[t],re=selReuse(),build=Z.isTrace(t);
 if(selCost()>(G.energy??0)||!Z.canPlace(G,t,i))return;
 snapUndo(re?null:t);tuto(1);if(!re)countPlay(t);if(build)useBuild(t);else S.hand.splice(S.sel,1);const mg=Z.place(G,t,i,R,false,{reuse:re});spentTrace(t);if(!D.instant)facing[i]=null;if(D.instant)S.discard.push(t);syncBoard();if(!build)S.sel=null;S.moveFrom=null;S.inspect=mg?i:null;
 if(!mg&&G.grid[i]&&G.grid[i].name){const q=tc(i);floatTxt(q.x,q.y-14,`${G.grid[i].name} rejoint l’abri`,'#f2b33d')}
 if(!mg&&G.grid[i]&&G.grid[i].leg){const q=tc(i);floatTxt(q.x,q.y+14,`Souvenir de ${G.grid[i].leg} : +1 dégât, +2 PV`,'#f2c23d',14);addFX({type:'ring',x:q.x,y:q.y,r:50,c:'#f2c23d',dur:600})}
 const p=D.instant&&!D.onUnit?CEN:tc(i);addFX({type:'ring',x:p.x,y:p.y,r:34,c:'#f2b33d',dur:350});SFX.play(D.cat==='shoot'?'cock':'place');
 const St=Z.stat(G,t);
 if(t==='food')floatTxt(CEN.x,CEN.y,`+${St.gain} PV`,'#9fd86b');
 if(t==='rep')G.grid.forEach((u,j)=>{if(u&&Z.U[u.t].block){const q=tc(j);floatTxt(q.x,q.y,`+${St.gain}`,'#9fd86b')}});
 if(t==='kit')floatTxt(p.x,p.y,'Soigné','#9fd86b');
 if(t==='coffee')floatTxt(CEN.x,CEN.y,'+2 énergie','#f2b33d');
 if(t==='flare')floatTxt(CEN.x,CEN.y,'Fusée !','#ff8a5a');
 mergeFx(mg);save();render();achCheck();
 if(G.drawNow||D.peek)UNDO=[];
 if(G.drawNow){const n=G.drawNow;G.drawNow=0;drawCards(Math.min(n,Math.max(0,Z.HAND_MAX-S.hand.length)));floatTxt(CEN.x,CEN.y-30,'Largage : +'+n+' cartes','#9ee08a');save();render()}
 if(D.peek)peekScreen();
}
function peekScreen(){
 if(S.draw.length<3&&S.discard.length){S.draw=shuffle(S.discard).concat(S.draw);S.discard=[];S.reshuf=1}
 const top=S.draw.slice(-3).reverse();if(!top.length)return;
 show(`<h2 class="pw">Carte routière</h2><p>Les prochaines cartes de ta pioche. Prends-en une dans ta main.</p>
  <div class="picks">${top.map(t=>pickBtn(t,'peek',t)).join('')}</div>`);
}

// pause entre deux vagues d'une très grosse nuit : le joueur peut déplacer une unité et jouer ses réactions
function wavePause(n){return new Promise(res=>{S.pause=n;S.moveFrom=null;S.inspect=null;S.resume=res;SFX.play('dawn');
 floatTxt(CEN.x,CEN.y-40,`Vague ${n} repoussée !`,'#9fd86b',18);render()})}
function resumeWave(){if(!S.pause)return;S.pause=0;S.moveFrom=null;S.inspect=null;Z.nextWave(G);const f=S.resume;S.resume=null;vib([150,80,150]);floatTxt(CEN.x,CEN.y-40,`Vague ${G.wave} sur ${G.waves} : ${bossName(G.night)} arrive !`,'#ff6b6b',18);SFX.play('roar');render();f&&f()}
async function night(){
 if(S.busy)return;S.busy=true;SPEED=OPT.speed||1;S.sel=null;S.drag=null;S.discard.push(...S.used);S.used=[];
 S.moveFrom=null;S.inspect=null;save();
 const scrap0=G.scrap,kills0=G.kills;
 UNDO=[];
 if(GUIDE){GUIDE=false;if(TUTO<3){TUTO=3;try{localStorage.setItem('abri-tuto',3)}catch(e){}}}tuto(2);nightTarget=1;KC.n=0;KC.on=1;Z.startNight(G,R);render();
 // v125 : météo sonore (pluie, orage) et corne de la nuit rouge
 try{SFX.setWeather(G.event.id==='pluie'?'amb-rain':G.event.id==='coupure'?'amb-storm':null);if(Z.pressure(G.night))setTimeout(()=>SFX.play('horn'),300)}catch(e){}
 await wait(900);
 let r;
 do{const types=G.grid.map(u=>u&&u.t);
  r=Z.step(G);syncBoard();const now=performance.now();
  syncZ(now);playEvents(r.ev,types,now);render();
  if(r.pause)await wavePause(r.pause);
  const lostEv=r.ev.filter(e=>e.k==='lost'),koEv=r.ev.filter(e=>e.k==='ko');
  if(lostEv.length||koEv.length){const info=$('#info');info.className='info warn';const ppl=lostEv.filter(e=>e.name),obj=lostEv.filter(e=>!e.name);
   info.innerHTML=[koEv.length?`${ii('band')} ${koEv.map(e=>`<b>${e.name||Z.U[e.t].n}</b>`).join(', ')} ${koEv.length>1?'sont blessés et partent':'est blessé et part'} en réserve (repos 3 nuits).`:'',ppl.length?`${ii('cross')} ${ppl.map(e=>`<b>${e.name}</b> (${Z.U[e.t].n})`).join(', ')} ${ppl.length>1?'sont tombés':'est tombé'}.`:'',obj.length?`${obj.map(e=>Z.U[e.t].n).join(', ')} détruit${obj.length>1?'s':''} !`:''].join(' ')}
  await wait(tickMs());
 }while(!r.done);
 await wait(700);
 try{SFX.setWeather(null)}catch(e){}
 const dawnInfo=Z.endNight(G);syncBoard();nightTarget=0;KC.on=0;S.busy=false;render();await wait(900);
 if(G.shelter<=0)return end();
 const mut=Z.mutNight(G.night)?Z.mutate(G,R):null;
 const hero=G.grid.filter(u=>u&&u.name&&u.nk>0).sort((a,b)=>b.nk-a.nk)[0];
 const fallen=(G.fallen||[]).filter(f=>f.night===G.night);
 const rewardCard=null;
 S.dawn={kills:G.kills-kills0,scrap:G.scrap-scrap0,heal:dawnInfo.heal,mut,rewardCard,relicReward:dawnInfo.relic,tier:dawnInfo.tier,hero:hero?{name:hero.name,t:hero.t,nk:hero.nk}:null,fallen};save();render();
 achNight(G.kills-kills0);
 if(G.night===Z.WIN_NIGHT&&!G.won)return victory();
 dawn();
}

/* ---------- l'aube : relique, carte pour demain, boutique ---------- */
const pickBtn=(t,a,v)=>`<button type="button" class="pick" data-a="${a}" data-v="${v}">${cardFace(t)}</button>`;
function dawn(){
 const d=S.dawn;if(d&&!d.chimed){d.chimed=1;SFX.play('dawn')}
 if(d&&d.mut&&!d.mutShown){d.mutShown=1;SFX.play('mutate');
  return show(`<h2 class="ko">Mutation instable</h2>${dawnTxt()}<div class="relics"><div class="relic mutx">${svg('mut')}<span><b>${Z.MUTS[d.mut].n}</b>${Z.MUTS[d.mut].d}</span></div></div><p>Elle remplace la précédente pendant 5 nuits, puis une autre mutation instable prendra sa place.</p><button type="button" class="go" data-a="dawn">Continuer</button>`)}
 // une unité a atteint 20, 40, 60… zombies tués : choix de son amélioration
 const li=Z.lvReady(G);if(li>=0)return dawnStep('lvl',[li]);
 if(Z.relicNight(G.night)||(d&&d.relicReward&&!d.relicDone)){if(d)d.relicDone=1;const r=Z.relicChoices(G,R);if(r.length)return dawnStep('relic',r)}
 afterRelic();
}
// un événement de l'aube (environ 1 aube sur 2), puis le choix de la carte
function afterRelic(){const ev=Z.dawnEvent(G,R);if(ev)return dawnStep('event',[ev]);dawnStep('draft')}
function dawnStep(ph,picks){
 S.phase=ph;
 if(ph==='relic'){S.picks=picks;save();
  return show(`<h2 class="ok">Nuit ${G.night} survécue</h2>${dawnTxt()}<p>Dans les décombres, tu trouves un objet rare. Choisis une <b>relique</b> : elle reste active toute la partie.</p>
   <div class="relics">${picks.map(r=>`<button type="button" class="relic" data-a="relic" data-v="${r}">${relicIc(r)}<span><b>${Z.RELICS[r].n}</b>${Z.RELICS[r].d}</span></button>`).join('')}</div>`)}
 if(ph==='lvl'){S.picks=picks;save();const u=G.grid[picks[0]];if(!u||Z.lvPending(u)<=0){S.phase=null;return dawn()}
  const lv=(u.lvA||0)+(u.lvD||0)+1;SFX.play('lvl');const lvNew=!seen('lvl');META.hints=META.hints||{};if(lvNew){META.hints.lvl=1;saveMeta(META)}
  return show(`<h2 class="ok">Niveau ${lv} !</h2>${dawnTxt()}<p><b>${u.name||cardName(u.t)}</b>${u.name?` (${cardName(u.t)})`:''} a tué <b>${u.kills} zombies</b>. Choisis son amélioration, elle dure toute la partie :</p>${lvNew?'<p class="newx">'+ii('star')+' <b>Nouveau : les niveaux.</b> Plus un survivant tue de zombies, plus il monte en niveau. Son niveau s’affiche sur la carte (N1, N2…).</p>':''}
   <div class="relics"><button type="button" class="relic" data-a="lvl" data-v="atk">${svg('shot')}<span><b>Offensive</b>+1 dégât à chaque coup</span></button><button type="button" class="relic" data-a="lvl" data-v="def">${svg('riot')}<span><b>Défensive</b>+3 PV max, et tous ses PV récupérés</span></button></div>`)}
 if(ph==='event'){S.picks=picks;save();const E=Z.DAWN[picks[0]];
  return show(`<h2 class="pw">${E.n}</h2>${dawnTxt()}<p>${E.d}</p><div class="relics">${E.ch.map((c,k)=>`<button type="button" class="relic evc" data-a="evc" data-v="${k}" ${c.ok&&!c.ok(G)?'disabled':''}><span><b>${c.n}</b>${c.d}</span></button>`).join('')}</div>`)}
 // la carte de demain : 3 cartes au choix tirées de ta pioche et de ta défausse (jamais de carte hors du deck)
 if(ph==='draft'){S.picks=picks||shuffle([...new Set(S.draw)]).slice(0,3);if(!S.picks.length)return dawnStep('shop');save();
  return show(`<h2 class="ok">Nuit ${G.night} survécue</h2>${dawnTxt()}<p>Choisis une carte de <b>ta pioche</b> que tu auras <b>en main demain</b>.</p>
   ${TUTO===3?(tuto(3),`<p class="tipin">${ii('bulb')} À chaque aube, tu choisis une carte de ta pioche : elle arrive dans ta main dès demain. Ensuite viendra le troc, où tu dépenses ta ferraille.</p>`):''}
   <div class="picks">${S.picks.map(t=>pickBtn(t,'draft',t)).join('')}</div>
   <button type="button" class="skip" data-a="draft" data-v="">Ne rien prendre</button>`)}
 if(ph==='night')return nightScreen(picks);
 S.picks=null;save();shopScreen();
}
function dawnTxt(){const d=S.dawn;if(!d||d.txtShown)return '';d.txtShown=1;return (d.rewardCard?`<p>Butin de la ${(Z.TIERS[d.tier]||Z.TIERS.base).n.toLowerCase()} : <b>${Z.U[d.rewardCard].n}</b> rejoint ton deck.</p>`:'')+`<p>L’abri tient avec <b>${G.shelter}/${Z.maxS(G)} PV</b>. Cette nuit : <b><span data-count="${d.kills}">${d.kills}</span> ${d.kills>1?'zombies éliminés':'zombie éliminé'}</b>, <b>+<span data-count="${d.scrap}">${d.scrap}</span> ferraille</b>${d.heal?`, <b>+${d.heal} PV</b> à l’aube`:''}.</p>`
 +(d.hero?`<p>Héros de la nuit : <b>${d.hero.name}</b> (${Z.U[d.hero.t].n}), ${plural(d.hero.nk,'zombie','zombies')}.</p>`:'')
 +(d.fallen&&d.fallen.length?`<p class="rip">${ii('cross')} Tombés cette nuit : ${d.fallen.map(f=>`<b>${f.name}</b> (${Z.U[f.t].n}, ${plural(f.kills,'zombie','zombies')})`).join(', ')}.</p>`:'')}
function shopScreen(){
 S.phase='shop';S.picks=null;save();
 const row=(k,ex)=>{const o=Z.SHOP[k],c=Z.shopCost(G,k),ok=G.scrap>=c&&!ex;return `<button type="button" class="shopi" data-a="shop-${k}" ${ok?'':'disabled'}><span><b>${o.n}</b>${o.d}</span><span class="cost">${svg('scrap')}${c}</span></button>`};
 const upg=deckTypes().filter(t=>Z.UPGRADABLE.includes(t)&&!G.upg[t]);
 show(`<h2 class="pw">Le troc de l’aube</h2><p>Tu as <b>${G.scrap} ferraille</b>. Un zombie éliminé rapporte 1 ferraille, un boss 15. Économise pour ce qui compte. ${G.night%10===9?`<b>${capF(bossName(G.night+1))} attaque demain !</b> `:''}Munitions anti-Colosse : <b>${ammoOwned()}/${Z.ammoMax(G)}</b>.</p>
  <div class="shop">${S.store?`<button type="button" class="shopi" data-a="store-open"><span><b>Retourner à la boutique</b>Déjà ouverte pour cette aube</span><span class="cost">✓</span></button>`:row('store')}${row('heal',G.shelter>=Z.maxS(G))}${row('upgrade',!upg.length)}${row('remove',deckList().length<=5)}</div>
  <button type="button" class="go" data-a="nightpick">Continuer</button>`);
}
const deckTypes=()=>[...new Set(deckList())];
// munitions anti-Colosse possédées (main, pioche, défausse)
const ammoOwned=()=>[...S.hand,...S.draw,...S.discard].filter(t=>t==='shell').length;
// la boutique : 5 objets absents du deck (un exemplaire chacun) et des munitions ; les achats arrivent en main
function storeScreen(){const st=S.store;if(!st)return shopScreen();const own=ammoOwned();
 const item=(t,price,dis,label)=>`<div class="citem${dis?' locked':''}">${cardFace(t,{base:1})}<span class="qty"><button type="button" class="buy" data-a="store-buy" data-v="${t}" ${dis||G.scrap<price?'disabled':''}>${label||price+' ferraille'}</button></span></div>`;
 show(`<h2 class="pw">La boutique</h2><p>Tu as <b>${G.scrap} ferraille</b>. Les cartes achetées arrivent dans ta main et rejoignent ton deck pour la partie. Une seule de chaque, sauf les munitions (${own}/${Z.ammoMax(G)}).</p>
  <div class="cgrid">${st.c.map(t=>st.b.includes(t)?item(t,0,1,'✓ Achetée'):item(t,Z.storePrice(t))).join('')}${item('shell',Z.AMMO_COST,own>=Z.ammoMax(G),own>=Z.ammoMax(G)?`Maximum (${Z.ammoMax(G)})`:'')}</div>
  <button type="button" class="go" data-a="store-back">Retour au troc</button>`,true)}
const pileTypes=()=>[...new Set(pileList())];
function listScreen(title,txt,types,a){show(`<h2 class="pw">${title}</h2><p>${txt}</p><div class="deck pickable">${types.map(t=>`<button type="button" class="dk" data-a="${a}" data-v="${t}" style="--cc:${cc(t)}">${art(t)}<span><b>${cardName(t)}${a==='up-pick'?` → ${Z.upgDesc(t)}`:''}</b>${Z.U[t].d}</span></button>`).join('')}</div><button type="button" class="skip" data-a="shop">Retour</button>`)}
function removeCard(t){for(const pile of[S.discard,S.draw,S.hand]){const k=pile.indexOf(t);if(k>=0){pile.splice(k,1);return true}}return false}
// choisir la nuit suivante : une prudente, une risquée qui rapporte
function nightScreen(offers){S.phase='night';S.picks=offers||Z.nightOffers(G,R);save();
 const ev=id=>Z.EVENTS.find(e=>e.id===id)||Z.EVENTS[0];
 show(`<h2 class="pw">Quelle nuit affronter ?</h2><p>Les éclaireurs ont repéré deux possibilités pour la nuit ${G.night+1}.</p>
  <div class="relics">${S.picks.map((o,k)=>{const T=Z.TIERS[o.tier],E=ev(o.event);return `<button type="button" class="relic nightc ${T.safe?'safe':'risk'}" data-a="nightgo" data-v="${k}"><span><b>${T.n}</b>${T.d}<em>Événement : ${E.n}${E.id!=='calme'?' ('+E.d+')':''}</em></span></button>`}).join('')}</div>`)}
function nextDay(offer){
 Z.newDay(G,R,offer);S.moveFrom=null;S.busy=false;S.phase=null;S.picks=null;S.dawn=null;V.clear();
 fillHand();save();hide();render();
}
// victoire : la nuit 30 est tenue, les secours arrivent. Partir (victoire) ou rester (infini, pour le score)
function victory(){G.won=1;try{ach('win');if((G.menace||0)>=5)ach('m5');if((G.menace||0)>=10)ach('m10');if(G.daily)ach('daily');achCheck()}catch(e){}const m=G.menace||0,pts=G.daily?0:Z.winPoints(m),unl=!G.daily&&m<Z.MENACE_MAX&&(META.menace||0)<=m;
 let relUnl=null,relStart=null,cardUnl=null;
 if(!G.daily){const vc=Z.VICTORY_CARDS.find(t=>Z.U[t].vic===m);if(vc&&!META.cards.includes(vc)){cardUnl=vc;META.cards.push(vc)}}
 if(!G.daily){const vr=Z.VICTORY_RELICS.find(r=>Z.RELICS[r].lock===m&&!(META.relicsUnl||[]).includes(r));if(vr){relUnl=vr;META.relicsUnl=[...(META.relicsUnl||[]),vr]}
  const avail=Object.keys(Z.RELICS).filter(r=>(Z.RELICS[r].lock==null||(META.relicsUnl||[]).includes(r))&&!(META.startPool||[]).includes(r));
  if(avail.length){relStart=avail[Math.floor(Math.random()*avail.length)];META.startPool=[...(META.startPool||[]),relStart]}}
 if(!G.daily&&!META.wins){OPT.back='gold';OPT.shelter='fort';saveOpt();applyOpt()}
 if(!G.daily){META.wins=(META.wins||0)+1;META.menaceWon=Math.max(META.menaceWon??-1,m);META.menace=Math.max(META.menace||0,Math.min(Z.MENACE_MAX,m+1));META.points=(META.points||0)+pts;saveMeta(META)}
 save();SFX.play('heli');setTimeout(()=>SFX.play('relic'),900);const alive=G.grid.filter(u=>u&&u.name).map(u=>u.name);
 show(`<img class="heli" src="assets/ui/heli.webp?v=121" alt=""><h2 class="ok">Les secours sont là !</h2><p>À l’aube de la nuit ${Z.WIN_NIGHT}, un hélicoptère se pose devant l’abri. Tu as tenu.</p><i class="bigstamp ok">Victoire${m?` · M${m}`:''}</i>
  <p><b>${G.kills}</b> zombies éliminés.${alive.length?` Survivants : ${alive.join(', ')}.`:''}</p>${pts?`<p>+<b>${pts}</b> points de survie (total : ${META.points}).</p>`:''}${META.wins===1&&!G.daily?`<p class="tipin">${ii('spark')} <b>Dos de carte doré</b> et <b>maison fortifiée</b> débloqués pour ta première victoire (modifiables dans les Options).</p>`:''}${unl?`<p class="tipin">${ii('unlock')} <b>Mutation ${m+1} débloquée</b> : ${Z.MENACES[m+1].n}. Choisis-la en préparant ta prochaine partie.</p>`:''}${cardUnl?`<p class="tipin">${ii('card')} <b>Carte de victoire</b> : ${Z.U[cardUnl].n} rejoint ta collection. Ajoute-la à ton deck.</p><div class="vcard">${cardFace(cardUnl,{base:1})}</div>`:''}${relUnl?`<p class="tipin">${ii('gift')} <b>Nouvelle relique débloquée</b> : ${Z.RELICS[relUnl].n} (${Z.RELICS[relUnl].d}). Tu pourras la trouver en partie.</p>`:''}${relStart?`<p class="tipin">${ii('pack')} <b>Relique de départ</b> : ${Z.RELICS[relStart].n} rejoint ta réserve. Choisis-la avant ta prochaine partie.</p>`:''}
  <button type="button" class="go" data-a="win-leave">Partir avec les secours</button><button type="button" class="skip" data-a="win-stay">Rester : une nuit de plus (mode infini, pour le score)</button>
  <p class="ver">Si tu restes, ta victoire est déjà acquise : la horde grandit chaque nuit, jusqu’à ce qu’elle gagne.</p>`)}
function leaveWin(){clearSave();logRun(1);const nights=G.night;let pts=0;if(!G.daily){pts=Z.runPoints(nights,G.kills);META.points=(META.points||0)+pts;META.best=Math.max(META.best,nights);META.total+=nights;META.runs++;saveMeta(META)}
 show(`<img class="heli away" src="assets/ui/heli.webp?v=121" alt=""><h2 class="ok">Victoire</h2><p>L’hélicoptère décolle. Derrière toi, la horde envahit la clairière… mais tu es parti.</p><div class="big">${plural(nights,'nuit survécue','nuits survécues')}</div>${pts?`<p>+<b>${pts}</b> points de survie pour ces ${nights} nuits (total : ${META.points}).</p>`:''}${detBtn()}<button type="button" class="go" data-a="title">Accueil</button>`);keepEnd()}
function statsScreen(){const h=META.hist||[],pl=Object.entries(META.played||{}).filter(([t])=>Z.U[t]).sort((a,b)=>b[1]-a[1]).slice(0,6),avg=h.length?Math.round(h.reduce((a,x)=>a+x.n,0)/h.length*10)/10:0;
 const tile=(v,l)=>`<div class="stile"><b>${v}</b><span>${l}</span></div>`;
 show(`<h2 class="pw">Statistiques</h2><div class="stiles">${tile(META.best||0,'record de nuits')}${tile(META.wins||0,'victoires')}${tile(META.menaceWon>=0?META.menaceWon:'—','Mutation vaincue')}${tile(META.runs||0,'parties')}${tile(META.total||0,'nuits au total')}${tile(META.kills||0,'zombies éliminés')}</div>
  <h3>Dernières parties</h3>${h.length?`<p>Moyenne : <b>${avg}</b> nuits.</p><div class="hist">${h.slice(0,10).map(x=>`<div class="hrow${x.w?' win':''}"><span class="hn">${x.w?ii('trophy'):ii('skull')} ${x.n} nuits</span><span>${Z.CHARS[x.ch]?Z.CHARS[x.ch].n:''} · ${Z.PLACES[x.pl]?Z.PLACES[x.pl].n:''}${x.m?` · Mutation ${x.m}`:''}</span><span class="hk">${x.k} zombies</span></div>`).join('')}</div>`:'<p>Aucune partie terminée pour l’instant.</p>'}
  <h3>Tes cartes préférées</h3>${pl.length?`<div class="cgrid fav">${pl.map(([t,n])=>`<div class="citem">${cardFace(t,{base:1,mini:1})}<span class="qty">${plural(n,'fois','fois')}</span></div>`).join('')}</div>`:'<p>Joue quelques parties pour voir tes cartes préférées.</p>'}
  <button type="button" class="skip" data-a="achs">${ii('trophy')} Succès</button><button type="button" class="go" data-a="title">Retour</button>`)}
// historique des parties (les 20 dernières) et victimes au total
function logRun(win){if(G.daily)return;META.kills=(META.kills||0)+G.kills;(META.hist=META.hist||[]).unshift({n:win?G.night:G.night-1,w:win?1:0,m:G.menace||0,k:G.kills,ch:G.char,pl:G.place,d:Date.now()});META.hist=META.hist.slice(0,20);saveMeta(META)}
function end(){
 SFX.play('death');vib([300,120,300]);achCheck();if(G.daily)ach('daily');if(!G.won)logRun(0);else logRun(1);
 clearSave();const nights=G.night-1;
 const before=Z.unlocks(META),newRec=nights>META.best&&nights>0;
 const legs=G.daily?[]:Z.legacies(G);if(legs.length){META.legacy=[...(META.legacy||[]),...legs.map(f=>({name:f.name,t:f.t,kills:f.kills}))].sort((a,b)=>b.kills-a.kills).slice(0,3)}
 let pts=0;if(!G.daily){pts=Z.runPoints(nights,G.kills);META.points=(META.points||0)+pts;META.best=Math.max(META.best,nights);META.total+=nights;META.runs++;saveMeta(META)}
 const best=META.best,after=Z.unlocks(META);
 const fresh=[...after.chars.filter(k=>!before.chars.includes(k)).map(k=>'Personnage : '+Z.CHARS[k].n),...after.places.filter(k=>!before.places.includes(k)).map(k=>'Lieu : '+Z.PLACES[k].n),];
 const dailyTxt=G.daily?dailyEnd(nights):'';
 show(`<i class="bigstamp ko">Tombé</i><h2 class="ko">L’abri est tombé</h2><p>La horde est entrée pendant la nuit <b>${G.night}</b>.</p><div class="big">${plural(nights,'nuit survécue','nuits survécues')}</div><p><b>${G.kills}</b> zombies éliminés. Record : <b>${plural(best,'nuit','nuits')}</b>${newRec?' (nouveau record !)':''}.</p>${dailyTxt}${legs.length?`<p>${ii('medal')} <b>Héritage :</b> ${legs.map(f=>`${f.name} (${Z.U[f.t].n}, ${f.kills} zombies)`).join(', ')} ${legs.length>1?'laissent':'laisse'} un souvenir pour ta prochaine partie : le premier ${legs.length>1?'survivant du même métier':Z.U[legs[0].t].n} posé aura +1 dégât et +2 PV.</p>`:''}${pts?`<p>+<b>${pts}</b> points de survie (total : ${META.points}). Débloque de nouvelles cartes dans la <b>Collection</b>.</p>`:''}${fresh.length?`<h3>Débloqué !</h3><ul>${fresh.map(f=>`<li><b>${f}</b></li>`).join('')}</ul>`:''}<h3>Mémorial</h3>${memorialHtml()}<button type="button" class="go" data-a="new">Rejouer</button>${detBtn()}<button type="button" class="skip" data-a="coll">Collection</button><button type="button" class="skip" data-a="title">Accueil</button>`);keepEnd();
}
const CATN={wall:'Défenses',post:'Postes de soutien',shoot:'Tireurs',melee:'Corps à corps',help:'Soutien',trap:'Pièges',item:'Objets',react:'Réactions'};
const deckHtml=()=>Object.keys(CATN).map(c=>`<h3>${CATN[c]}</h3><div class="deck">${Z.KEYS.filter(t=>Z.U[t].cat===c).map(t=>`<div class="dk" style="--cc:${cc(t)}">${art(t)}<span><b>${Z.U[t].n}</b>${rarTag(t)}<em class="ce">${Z.cost(t)} énergie</em> · ${Z.U[t].d}${famLine(t)}</span></div>`).join('')}</div>`).join('');
// carte d'un zombie : même cadre, illustration de assets/cards_cartoon/z_<type>.webp, attaque et PV de base
function zombieFace(k){const z=Z.ZT[k],hp=Math.round(z.hp*(z.boss?1:Z.ZHP));
 return `<span class="cf zomb"><span class="cf-art" style="background-image:url('assets/cards_cartoon/z_${k}.webp')"></span><span class="cf-vig"></span>
  <span class="cf-name">${z.n}</span><span class="cf-rule"></span><span class="cf-txt${z.info.length>80?' xlong':z.info.length>50?' long':''}"><span>${z.info.charAt(0).toUpperCase()+z.info.slice(1)}</span></span>
  <span class="cf-foot"><span class="cf-atk" title="Dégâts">${ink('atk')}<b>${z.dmg}</b></span><span class="cf-marks"><em>Zombie</em></span><span class="cf-hp" title="PV"><b>${hp}</b></span></span></span>`}
const zedHtml=()=>`<div class="cgrid">${Z.ZK.map(k=>`<div class="citem">${zombieFace(k)}</div>`).join('')}</div>`;
const memorialHtml=()=>(G.fallen||[]).length?`<div class="deck">${G.fallen.map(f=>`<div class="dk" style="--cc:var(--muted)">${svg(f.t)}<span><b>${ii('cross')} ${f.name}</b>${Z.U[f.t].n} · ${Z.TRAITS[f.trait]?Z.TRAITS[f.trait].n+' · ':''}${plural(f.kills,'zombie','zombies')} · tombé la nuit ${f.night}</span></div>`).join('')}</div>`:`<p>${G.shelter>0?'Personne n’est tombé. Pour l’instant.':'Aucun survivant n’est tombé au combat.'}</p>`;
// écran d'options : volumes, vitesse de nuit, secousses, taille du texte, langue
let optBack=null,onTitle=false;
function optionsScreen(back){if(back)optBack=back;const pc=v=>Math.round(v*100);
 show(`<h2 class="pw">Options</h2><div class="opts">
  <label>Langue<select data-o="lang"><option value="fr" ${OPT.lang==='fr'?'selected':''}>Français</option><option value="en" disabled>English (bientôt)</option></select></label>
  <label><span>Effets sonores <b>${pc(OPT.sfx)} %</b></span><input type="range" min="0" max="100" step="5" value="${pc(OPT.sfx)}" data-o="sfx"></label>
  <label><span>Musique et ambiance <b>${pc(OPT.mus)} %</b></span><input type="range" min="0" max="100" step="5" value="${pc(OPT.mus)}" data-o="mus"></label>
  <label>Vitesse de la nuit au départ<select data-o="speed">${[1,2,4].map(v=>`<option value="${v}" ${OPT.speed==v?'selected':''}>× ${v}</option>`).join('')}</select></label>
  <label class="chk"><input type="checkbox" data-o="shake" ${OPT.shake?'checked':''}> Secousses de l’écran</label>
  ${navigator.vibrate?`<label class="chk"><input type="checkbox" data-o="vib" ${OPT.vib?'checked':''}> Vibrations du téléphone</label>`:''}
  ${(typeof META!=='undefined'&&META.wins>0)?`<label>Dos des cartes<select data-o="back"><option value="" ${OPT.back!=='gold'?'selected':''}>Classique</option><option value="gold" ${OPT.back==='gold'?'selected':''}>Doré (victoire)</option></select></label><label>Abri<select data-o="shelter"><option value="" ${OPT.shelter!=='fort'?'selected':''}>Maison</option><option value="fort" ${OPT.shelter==='fort'?'selected':''}>Maison fortifiée (victoire)</option></select></label>`:''}
  <label class="chk"><input type="checkbox" data-o="all" ${OPT.all?'checked':''}> Tout afficher dès le départ (factions, niveaux, collection), pour les joueurs habitués</label>
  <label class="chk"><input type="checkbox" data-o="eco" ${OPT.eco?'checked':''}> Mode économie (petits téléphones : moins d’effets, plateau moins détaillé)</label>
  <label class="chk"><input type="checkbox" data-o="text" ${OPT.text?'checked':''}> Texte plus grand</label>
 </div><button type="button" class="go" data-a="optclose">Retour</button>`)}
function runInfo(){onTitle=false;
 const counts={};deckList().forEach(t=>counts[t]=(counts[t]||0)+1);
 show(`<h2 class="pw">${Z.CHARS[G.char].n}</h2><p><b>${G.kills}</b> zombies éliminés · <b>${G.scrap}</b> ferraille</p>
  <h3>Reliques</h3>${G.relics.length?`<div class="deck">${G.relics.map(r=>`<div class="dk" style="--cc:var(--lantern)">${relicIc(r)}<span><b>${Z.RELICS[r].n}</b>${Z.RELICS[r].d}</span></div>`).join('')}</div>`:'<p>Aucune pour l’instant. Tu en trouves une toutes les 5 nuits.</p>'}
  <h3>Mutation instable de la horde</h3>${G.muts.length?`<div class="deck">${G.muts.map(m=>`<div class="dk" style="--cc:var(--blood)">${svg('mut')}<span><b>${Z.MUTS[m].n}</b>${Z.MUTS[m].d}</span></div>`).join('')}</div>`:'<p>Aucune pour l’instant. Mutation instable toutes les 5 nuits.</p>'}
  ${seen('fam1')?'':'<!--'}<h3>Factions</h3><div class="deck">${Object.keys(Z.FAM).map(f=>{const F=Z.FAM[f],c=Z.famCounts(G)[f]||0,l=Z.famLevels(G)[f];return `<div class="dk" style="--cc:${l?'var(--lantern)':'var(--muted)'}"><span class="fic">${ink(f)}</span><span><b>${F.n} : ${c}</b>${l?'Actif : '+F.d.slice(0,l).join(' ; '):`Encore ${F.lv[0]-c} pour : ${F.d[0]}`}</span></div>`}).join('')}</div>${seen('fam1')?'':'-->'} 
  <h3>Tes survivants</h3>${G.grid.some(u=>u&&u.name)?`<div class="deck">${G.grid.filter(u=>u&&u.name).map(u=>`<div class="dk" style="--cc:${cc(u.t)}">${svg(u.t)}<span><b>${u.name}</b>${cardName(u.t)} · ${Z.TRAITS[u.trait].n} (${Z.TRAITS[u.trait].d}) · ${plural(u.kills||0,'zombie','zombies')} · ${u.hp}/${Z.maxHp(G,u)} PV</span></div>`).join('')}</div>`:'<p>Aucun survivant posé.</p>'}
  <button type="button" class="skip" data-a="options">${ii('gear')} Options</button>
  <h3>Mémorial</h3>${memorialHtml()}
  <h3>Ton deck (${deckList().length} cartes)</h3><div class="deck">${Object.entries(counts).map(([t,n])=>`<div class="dk" style="--cc:${cc(t)}">${art(t)}<span><b>${n>1?n+' × ':''}${cardName(t)}</b>${Z.U[t].d}${G.upg[t]?` (amélioré : ${Z.upgDesc(t)})`:''}</span></div>`).join('')}</div>
  <button type="button" class="go" data-a="close">Fermer</button>`);
}
function charScreen(){
 const ok=Z.unlocks(META).chars;
 show(`<h2 class="pw">Choisis ton survivant</h2><p>Chacun commence avec son propre deck de 8 cartes. Total de nuits survécues : <b>${META.total}</b>.</p>
  <div class="chars">${Object.entries(Z.CHARS).map(([k,c])=>ok.includes(k)?`<button type="button" class="char" data-a="char" data-v="${k}"><b>${c.n}</b><span>${c.d}</span><span class="mini">${c.deck.map(t=>`<i style="color:${cc(t)}">${art(t)}</i>`).join('')}</span></button>`
   :`<button type="button" class="char" disabled><b>${ii('lock')} ${c.n}</b><span>Se débloque à ${Z.UNLOCK.chars[k]} nuits survécues au total.</span></button>`).join('')}</div>
  <button type="button" class="skip" data-a="title">Retour</button>`);
}
let pendingChar='surv';
function placeScreen(){
 const ok=Z.unlocks(META).places;if(ok.length===1){newGame(pendingChar,'bois');save();hide();render();return}
 show(`<h2 class="pw">Choisis ton lieu</h2><p>Ton record : <b>${plural(META.best,'nuit','nuits')}</b>.</p>
  <div class="chars">${Object.entries(Z.PLACES).map(([k,p])=>ok.includes(k)?`<button type="button" class="char" data-a="place" data-v="${k}"><b>${p.n}</b><span>${p.d}</span></button>`
   :`<button type="button" class="char" disabled><b>${ii('lock')} ${p.n}</b><span>Se débloque avec un record de ${Z.UNLOCK.places[k]} nuits.</span></button>`).join('')}</div>
  <button type="button" class="skip" data-a="new">Retour</button>`);
}
const ov=$('#ov'),panel=$('#panel');
function show(h,keep){const pv=document.getElementById('preview');if(pv)pv.hidden=true;const y=panel.scrollTop;panel.innerHTML=h;ov.hidden=false;panel.scrollTop=keep?y:0;
 // v123 : défaite (secousse et voile rouge) et victoire (lueur dorée) animées
 const lose=h.includes('bigstamp ko'),win=h.includes('bigstamp ok');panel.classList.remove('lose','win');ov.classList.remove('lose','win');if(lose||win){void panel.offsetWidth;panel.classList.add(lose?'lose':'win');ov.classList.add(lose?'lose':'win')}
 countUp()}
// les chiffres marqués data-count défilent de 0 à leur valeur
function countUp(){if(reduce)return;panel.querySelectorAll('[data-count]').forEach(el=>{const n=+el.dataset.count;if(!(n>0))return;const t0=performance.now();el.textContent='0';
 const f=now=>{const p=clamp((now-t0)/900,0,1);el.textContent=Math.round(n*ease(p));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
function hide(){ov.hidden=true;requestAnimationFrame(()=>{try{animPiles()}catch(e){}})}
/* ---------- collection, decks et préparation de la partie ---------- */
// héritage : les souvenirs des survivants tombés passent à la partie qui commence (une seule fois)
function takeLegacy(){G.legacy=[];if(META.legacy&&META.legacy.length){META.legacy=[];saveMeta(META)}}
const legacyTxt=()=>'';const legacyTxt0=()=>(META.legacy||[]).length?`<p>${ii('medal')} Souvenirs pour cette partie : ${META.legacy.map(l=>`<b>${l.name}</b> (${Z.U[l.t].n}, ${l.kills} zombies) : ton premier ${Z.U[l.t].n} posé aura +1 dégât et +2 PV`).join(' ; ')}.</p>`:'';
function ensureMeta(){if(!META.cards||!META.cards.length)META.cards=Z.STARTER_CARDS.slice();if(META.points==null)META.points=(META.total||0)*5;
 if(!META.decks)META.decks=[0,1,2].map(()=>Z.STARTER_DECK.slice());if(META.slot==null)META.slot=0;if(META.menace==null)META.menace=0;if(META.menaceWon==null)META.menaceWon=-1;if(META.wins==null)META.wins=0;if(!META.relicsUnl)META.relicsUnl=[];if(!META.startPool)META.startPool=[];saveMeta(META)}
ensureMeta();
const PREP={ch:'surv',pl:'bois',menace:0,relic:''};
// niveaux de Menace : on choisit le niveau avant la partie ; chaque victoire débloque le suivant (jusqu'à 10)
const menaceTabs=()=>`<div class="tabs wrap menace">${Array.from({length:Z.MENACE_MAX+1},(_,k)=>k<=(META.menace||0)?`<button type="button" class="tab${k===PREP.menace?' on':''}" data-a="prepmen" data-v="${k}">${k}${k<=META.menaceWon?' ✓':''}</button>`:`<button type="button" class="tab" disabled>${ii('lock')} ${k}</button>`).join('')}</div>`;
const menaceTxt=m=>m?`<b>Mutation ${m}</b> (tous les niveaux jusqu’au ${m} s’additionnent) :</p><ul class="mlist">${Z.MENACES.slice(1,m+1).map((x,k)=>`<li><b>${k+1}. ${x.n}</b> : ${x.d}.</li>`).join('')}</ul><p>Victoire : +${Z.winPoints(m)} points de survie${m<Z.MENACE_MAX?` et la Mutation ${m+1} débloquée`:''}.`:`<b>Mutation 0</b> : la horde d’origine.${(META.menace||0)<1?` Gagne la nuit ${Z.WIN_NIGHT} pour débloquer la Mutation 1.`:''}`;
const deckCount=d=>{const c={};d.forEach(t=>c[t]=(c[t]||0)+1);return c};
function prepScreen(){const u=Z.unlocks(META);PREP.menace=Math.max(0,Math.min(META.menace||0,PREP.menace??META.menaceSel??0));if(!u.chars.includes(PREP.ch))PREP.ch='surv';if(!u.places.includes(PREP.pl))PREP.pl='bois';
 const d=META.decks[META.slot],err=Z.deckError(d,META.cards),fc={};d.forEach(t=>{const f=Z.famOf(t);if(f)fc[f]=(fc[f]||0)+1});
 show(`<h2 class="pw">Préparer la partie</h2>
  <h3>Ton deck</h3><div class="tabs">${META.decks.map((x,k)=>`<button type="button" class="tab${k===META.slot?' on':''}" data-a="prepdeck" data-v="${k}">Deck ${k+1}<small>${x.length} cartes</small></button>`).join('')}</div>
  <p>${err?`<span class="bad">${err}</span>`:`<b>${d.length}</b> cartes${seen('fam1')?' · '+(Object.entries(fc).sort((a,b)=>b[1]-a[1]).map(([f,n])=>`${ink(f)} ${n}`).join(' ')||'aucune faction'):''}`}</p>
  <button type="button" class="skip" data-a="edit">Modifier le deck ${META.slot+1}</button>
  <h3>Ton survivant</h3><div class="tabs wrap">${Object.keys(Z.CHARS).map(k=>u.chars.includes(k)?`<button type="button" class="tab${k===PREP.ch?' on':''}" data-a="prepch" data-v="${k}">${Z.CHARS[k].n}</button>`:`<button type="button" class="tab" disabled>${ii('lock')} ${Z.CHARS[k].n}</button>`).join('')}</div>
  <p>${Z.CHARS[PREP.ch].d}</p>
  <h3>Ton lieu</h3><div class="tabs wrap">${Object.keys(Z.PLACES).map(k=>u.places.includes(k)?`<button type="button" class="tab${k===PREP.pl?' on':''}" data-a="preppl" data-v="${k}">${Z.PLACES[k].n}</button>`:`<button type="button" class="tab" disabled>${ii('lock')} ${Z.PLACES[k].n}</button>`).join('')}</div>
  <p>${Z.PLACES[PREP.pl].d}</p>
  <h3>Mutation de la horde</h3>${menaceTabs()}<p>${menaceTxt(PREP.menace)}</p>
  <h3>Relique de départ</h3>${(META.startPool||[]).length?`<div class="tabs wrap"><button type="button" class="tab${!PREP.relic?' on':''}" data-a="preprel" data-v="">Aucune</button>${META.startPool.map(r=>`<button type="button" class="tab${PREP.relic===r?' on':''}" data-a="preprel" data-v="${r}">${Z.RELICS[r].n}</button>`).join('')}</div><p>${PREP.relic?`<b>${Z.RELICS[PREP.relic].n}</b> : ${Z.RELICS[PREP.relic].d}.`:'Tu commences sans relique en plus.'}</p>`:'<p>Chaque victoire ajoute une relique à ta réserve : tu pourras en choisir une ici avant la partie.</p>'}
  ${legacyTxt()}<button type="button" class="go" data-a="start" ${err?'disabled':''}>Commencer</button>
  <button type="button" class="skip" data-a="coll">Collection (${META.points} points)</button><button type="button" class="skip" data-a="title">Retour</button>`)}
/* recherche et tri des cartes (collection et éditeur de deck) */
const CF={q:'',sort:'cat',fam:'',own:''};
const RORD={com:0,rare:1,epic:2,leg:3};
const norm=x=>x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function cfBar(own){return `<div class="cfbar"><input type="search" data-f="q" placeholder="Chercher une carte…" value="${CF.q.replace(/"/g,'&quot;')}" aria-label="Chercher une carte">
 <select data-f="sort" aria-label="Trier"><option value="cat">Par type</option><option value="cost">Par coût</option><option value="rar">Par rareté</option><option value="name">Par nom</option><option value="fam">Par faction</option></select>
 <select data-f="fam" aria-label="Faction"><option value="">Toutes les factions</option>${Object.keys(Z.FAM).map(f=>`<option value="${f}">${Z.FAM[f].n}</option>`).join('')}<option value="-">Sans faction</option></select>
 ${own?`<select data-f="own" aria-label="Débloquées"><option value="">Toutes</option><option value="y">Débloquées</option><option value="n">À débloquer</option><option value="b">À portée</option></select>`:''}</div>`}
function cfGrid(ts,item){
 ts=ts.filter(t=>!CF.fam||(CF.fam==='-'?!Z.famOf(t):Z.famOf(t)===CF.fam));
 const key=t=>`<div class="citem-w" data-n="${norm(Z.U[t].n+' '+(Z.U[t].d||''))}">${item(t)}</div>`;
 if(CF.sort==='cat')return Object.keys(CATN).map(c=>{const g=ts.filter(t=>Z.U[t].cat===c);return g.length?`<section class="cfsec"><h3>${CATN[c]}</h3><div class="cgrid">${g.map(key).join('')}</div></section>`:''}).join('')||'<p>Aucune carte.</p>';
 const by={cost:t=>Z.cost(t),rar:t=>-RORD[Z.RAR[t]||'com'],name:()=>0,fam:t=>Z.famOf(t)?Object.keys(Z.FAM).indexOf(Z.famOf(t)):99}[CF.sort];
 const s=ts.slice().sort((a,b)=>by(a)-by(b)||Z.U[a].n.localeCompare(Z.U[b].n,'fr'));
 return s.length?`<section class="cfsec"><div class="cgrid">${s.map(key).join('')}</div></section>`:'<p>Aucune carte.</p>'}
// filtre texte sans redessiner (le champ garde le focus)
function cfApply(){const q=norm(CF.q.trim());panel.querySelectorAll('.citem-w').forEach(e=>e.hidden=!!q&&!e.dataset.n.includes(q));
 panel.querySelectorAll('.cfsec').forEach(s=>s.hidden=!s.querySelector('.citem-w:not([hidden])'))}
function cfSync(){panel.querySelectorAll('[data-f]').forEach(e=>{if(e.tagName==='SELECT')e.value=CF[e.dataset.f]});cfApply()}
function deckEditor(keep){const d=META.decks[META.slot],cnt=deckCount(d),err=Z.deckError(d,META.cards);
 show(`<h2 class="pw">Deck ${META.slot+1}</h2><p><b>${d.length}</b> / ${Z.DECK_MAX} cartes (minimum ${Z.DECK_MIN}). ${err?`<span class="bad">${err}</span>`:'✓ Prêt.'} Commune ×3, rare ×2, épique ×1 au maximum.</p>
  ${cfBar(false)}${cfGrid(META.cards.slice(),t=>`<div class="citem${cnt[t]?' in':''}">${cardFace(t,{base:1})}<span class="qty"><button type="button" data-a="dkm" data-v="${t}" ${cnt[t]?'':'disabled'}>−</button><b>${cnt[t]||0}/${Z.copyMax(t)}</b><button type="button" data-a="dkp" data-v="${t}" ${(cnt[t]||0)>=Z.copyMax(t)||d.length>=Z.DECK_MAX?'disabled':''}>+</button></span></div>`)}
  <button type="button" class="go" data-a="new">Terminé</button><button type="button" class="skip" data-a="dkreset">Remettre le deck de départ</button><button type="button" class="skip" data-a="coll">Collection</button>`,keep);cfSync()}
function collectionScreen(keep){const own=META.cards,pts=META.points,price=t=>Z.CARD_PRICE[Z.RAR[t]||'com'];
 // trois états bien distincts : débloquée (couleur + coche), achetable maintenant (couleur, cadre doré, bouton), hors de portée (grisée + cadenas)
 const state=t=>own.includes(t)?'in':Z.U[t].vic!=null?'vic':pts>=price(t)?'buy':'far';
 const nIn=Z.KEYS.filter(t=>own.includes(t)).length,nBuy=Z.KEYS.filter(t=>state(t)==='buy').length;
 show(`<h2 class="pw">Collection</h2><p>Tu as <b>${pts}</b> points de survie. Chaque partie en rapporte : 10 par nuit survécue, plus 1 tous les 4 zombies. Une carte débloquée l’est pour toujours.</p>
  <div class="csum"><span class="cs-in">✓ ${nIn}/${Z.KEYS.length} débloquées</span><span class="cs-buy">${ii('unlock')} ${nBuy} à portée</span></div>
  <button type="button" class="skip evob" data-a="evo">✦ Évolutions secrètes · ${(META.evo||[]).filter(k=>Z.EVO[k]).length}/${Z.EVO_KEYS.length} découvertes</button>
  ${cfBar(true)}${cfGrid(Z.KEYS.filter(t=>!CF.own||(CF.own==='b'?state(t)==='buy':(CF.own==='y')===own.includes(t))),t=>{const st=state(t),pr=price(t);
   const badge=st==='in'?`<span class="cbadge ok">✓</span>`:st==='vic'?`<span class="cbadge vic">${ii('trophy')}</span>`:st==='far'?`<span class="cbadge lk">${ii('lock')}</span>`:'';
   const foot=st==='in'?'<b class="cok">Débloquée</b>'
    :st==='vic'?`<b class="vlock">${ii('trophy')} Victoire en Mutation ${Z.U[t].vic}</b>`
    :st==='buy'?`<button type="button" class="buy ok" data-a="unlock" data-v="${t}">${ii('unlock')} Débloquer · ${pr} pts</button>`
    :`<span class="cfar"><span>${ii('lock')} ${pr} pts</span><small>il en manque ${pr-pts}</small></span>`;
   return `<div class="citem s-${st}${st==='in'?' in':st==='buy'?'':' locked'}">${badge}${cardFace(t,{base:1})}<span class="qty">${foot}</span></div>`})}
  <button type="button" class="go" data-a="new">Préparer une partie</button><button type="button" class="skip" data-a="title">Accueil</button>`,keep);cfSync()}
// page des évolutions secrètes : les cartes découvertes en grand avec leur recette, les autres en silhouette avec un indice
function evoScreen(){const ev=META.evo||[],n=Z.EVO_KEYS.filter(k=>ev.includes(k)).length;
 show(`<h2 class="pw">Évolutions secrètes</h2><p>Deux cartes précises posées <b>côte à côte</b> sur le plateau se transforment en une unité unique. C’est une <b>nouvelle carte</b> : les deux cartes de la recette repartent aussitôt dans ta défausse. La carte évoluée n’entre jamais dans le deck ni la défausse : blessée, elle part en réserve ; détruite, elle disparaît. Tu en as découvert <b>${n} sur ${Z.EVO_KEYS.length}</b>.</p>
  <div class="cgrid">${Z.EVO_KEYS.map(k=>{const [a,b]=Z.EVO[k];return ev.includes(k)?`<div class="citem in">${cardFace(k,{base:1})}<span class="qty recipe">${Z.U[a].n} + ${Z.U[b].n}</span></div>`
   :`<div class="citem evo-x"><span class="cf"><span class="cf-art"><i class="evo-sil" style="background-image:url('assets/sprites_cartoon/${k}.webp')"></i></span><span class="cf-vig"></span><span class="cf-name">???</span><span class="cf-txt"><span>Pas encore découverte</span></span></span><span class="qty recipe">Indice : ${Z.U[a].n} + ?</span></div>`}).join('')}</div>
  <button type="button" class="go" data-a="coll">Collection</button><button type="button" class="skip" data-a="title">Accueil</button>`)}
const ACT={
 testmode:()=>{onTitle=true;show(`<h2 class="pw">Mode test</h2><p>Pour essayer les cartes : tu choisis la nuit de départ, l’énergie est illimitée, 999 ferraille, et le bouton <b>« + Carte (test) »</b> met n’importe quelle carte dans ta main. <b>Rien n’est enregistré</b> : ni record, ni points, ni succès, ni sauvegarde.</p>
  <label class="tnight">Nuit de départ <input type="number" id="tnight" min="1" max="60" value="${TEST_N}" inputmode="numeric"></label>
  <label class="chk"><input type="checkbox" id="tprog" ${TEST_P?'checked':''}> Progression simulée : les reliques et la mutation de la horde d’une vraie partie, et des survivants avec des niveaux (1 niveau toutes les 6 nuits)</label>
  <button type="button" class="go" data-a="teststart">Lancer</button><button type="button" class="skip" data-a="title">Accueil</button>`)},
 teststart:()=>{const el=document.getElementById('tnight');TEST_N=Math.max(1,Math.min(60,Math.round(+(el&&el.value)||1)));const pc=document.getElementById('tprog');TEST_P=!pc||pc.checked;
  newGame('surv','bois',null,Z.STARTER_DECK);TEST=true;GUIDE=false;G.test=1;G.night=TEST_N;if(TEST_P)Z.testProgress(G,TEST_N,R);G.energy=99;G.scrap=999;G.pool=Z.KEYS.filter(t=>!Z.U[t].evo);onTitle=false;hide();render()},
 tcards:()=>{if(!TEST||S.busy)return;const full=S.hand.length>=Z.HAND_MAX;
  show(`<h2 class="pw">Ajouter une carte</h2><p>Main : <b>${S.hand.length}/${Z.HAND_MAX}</b>${full?' · <span class="bad">main pleine : joue une carte d’abord</span>':''}</p><input type="search" class="tq" placeholder="Chercher une carte" aria-label="Chercher une carte" oninput="const q=this.value.toLowerCase();this.parentElement.querySelectorAll('[data-a=tadd]').forEach(b=>b.hidden=q&&!b.dataset.n.includes(q))">`
   +Object.keys(CATL).map(c=>{const ks=Z.KEYS.filter(t=>Z.U[t].cat===c);return ks.length?`<h3>${CATL[c]}</h3><div class="cgrid tgrid">${ks.map(t=>`<button type="button" class="citem in" data-a="tadd" data-v="${t}" data-n="${Z.U[t].n.toLowerCase()}" ${full?'disabled':''}>${cardFace(t,{mini:1})}</button>`).join('')}</div>`:''}).join('')
   +`<button type="button" class="go" data-a="closeov">Fermer</button>`)},
 tadd:v=>{if(!TEST||!Z.U[v]||S.hand.length>=Z.HAND_MAX)return;S.hand.push(v);render();ACT.tcards()},
 options:()=>optionsScreen(onTitle?'title':'game'),
 optclose:()=>{if(optBack==='game'){hide();render()}else title()},
 closeov:()=>{hide();render()},
 bpick:v=>{S.bsel=+v;S.sel=null;S.moveFrom=null;S.inspect=null;hide();render()},
 artstyle:()=>{ART_STYLE=ART_STYLE==='cartoon'?'real':'cartoon';try{localStorage.setItem('abri-style',ART_STYLE)}catch(e){}title()},
 new:()=>{endTest();if(novice()){PREP.ch='surv';PREP.pl='bois';PREP.menace=0;PREP.relic='';return ACT.start()}prepScreen()},
 prepdeck:v=>{META.slot=+v;saveMeta(META);prepScreen()},
 prepch:v=>{PREP.ch=v;prepScreen()},
 preppl:v=>{PREP.pl=v;prepScreen()},
 'win-leave':()=>leaveWin(),
 'win-stay':()=>{G.endless=1;save();SFX.play('ui');dawn()},
 preprel:v=>{PREP.relic=v||'';prepScreen()},
 prepmen:v=>{PREP.menace=+v;META.menaceSel=+v;saveMeta(META);prepScreen()},
 start:()=>{const d=META.decks[META.slot];if(Z.deckError(d,META.cards))return;newGame(PREP.ch,PREP.pl,null,d);G.relicPool=(META.relicsUnl||[]).slice();Z.applyMenace(G,PREP.menace,R);if(PREP.relic&&(META.startPool||[]).includes(PREP.relic)&&!G.relics.includes(PREP.relic)){Z.addRelic(G,PREP.relic);if(PREP.relic==='pacte'||PREP.relic==='fanion')G.energy++}takeLegacy();save();hide();render()},
 edit:()=>deckEditor(),
 dkp:v=>{const d=META.decks[META.slot];if(d.length<Z.DECK_MAX&&(deckCount(d)[v]||0)<Z.copyMax(v)&&META.cards.includes(v)){d.push(v);saveMeta(META)}deckEditor(1)},
 dkm:v=>{const d=META.decks[META.slot],k=d.indexOf(v);if(k>=0){d.splice(k,1);saveMeta(META)}deckEditor(1)},
 dkreset:()=>{META.decks[META.slot]=Z.STARTER_DECK.slice();saveMeta(META);deckEditor()},
 coll:()=>{if(!seen('coll')){META.hints=META.hints||{};META.hints.coll=1;saveMeta(META)}collectionScreen()},
 mdet:()=>detScreen(),
 achs:()=>achScreen(),
 mback:()=>{if(S.endHtml)show(S.endHtml);else title()},
 evo:()=>evoScreen(),
 unlock:v=>{if(Z.U[v].vic!=null)return;const pr=Z.CARD_PRICE[Z.RAR[v]||'com'];if(!META.cards.includes(v)&&META.points>=pr){META.points-=pr;META.cards.push(v);saveMeta(META);SFX.play('dawn');achCheck()}collectionScreen(1)},
 char:v=>{pendingChar=v;placeScreen()},
 place:v=>{newGame(pendingChar,v);save();hide();render()},
 load:()=>{const d=loadSave();if(d)resume(d);else prepScreen()},
 title:()=>title(),
 close:()=>hide(),
 rules:()=>show(`<h2 class="pw">Règles du jeu</h2>${rulesHtml()}<button type="button" class="skip" data-a="retuto">Rejouer la première nuit guidée</button><button type="button" class="go" data-a="title">Retour</button>`),
 stats:()=>statsScreen(),
 rgo:v=>{const e=document.getElementById('r-'+v);if(e)e.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})},
 retuto:()=>{TUTO=0;try{localStorage.setItem('abri-tuto','0')}catch(e){}ACT.new()},
 deck:()=>show(`<h2 class="pw">Les cartes</h2><p>Toutes les cartes du jeu, par type. Les règles sont dans <button type="button" class="round" data-a="rules">Règles du jeu</button>.</p>${deckHtml()}<h2 class="pw">Le bestiaire</h2>${zedHtml()}<h2 class="pw">Les mutations instables</h2><p>Une seule à la fois, elle change toutes les 5 nuits.</p><div class="deck">${Object.values(Z.MUTS).map(m=>`<div class="dk" style="--cc:var(--blood)">${svg('mut')}<span><b>${m.n}</b>${m.d}</span></div>`).join('')}</div><button type="button" class="go" data-a="title">Retour</button>`),
 dawn:()=>dawn(),
 lvl:v=>{const i=S.picks&&S.picks[0];if(i!=null&&Z.levelUp(G,i,v==='atk'?'atk':'def')){const p=tc(i);floatTxt(p.x,p.y-20,v==='atk'?'+1 dégât':'+3 PV','#9fd86b',15);addFX({type:'ring',x:p.x,y:p.y,r:44,c:'#9fd86b',dur:500})}S.phase=null;save();render();dawn()},
 relic:v=>{Z.addRelic(G,v);SFX.play('relic');afterRelic()},
 evc:v=>{const id=S.picks&&S.picks[0];if(!id)return dawnStep('draft');const r=Z.resolveDawn(G,id,+v,R,deckList());
  (r.cards||[]).forEach(t=>S.discard.push(t));if(G.drawNow){drawCards(Math.min(G.drawNow,Math.max(0,Z.HAND_MAX-S.hand.length)));G.drawNow=0}syncBoard();S.phase='draft';S.picks=null;save();render();SFX.play('ui');
  show(`<h2 class="pw">${Z.DAWN[id].n}</h2><p>${r.txt}</p>${r.cards&&r.cards.length?`<p>Ajouté à ton deck : <b>${r.cards.map(t=>Z.U[t].n).join(', ')}</b>.</p>`:''}<button type="button" class="go" data-a="todraft">Continuer</button>`)},
 todraft:()=>dawnStep('draft'),
 draft:v=>{const k=v?S.draw.indexOf(v):-1;if(k>=0){S.draw.splice(k,1);S.next=v;SFX.play('card')}dawnStep('shop')},
 shop:()=>shopScreen(),
 'shop-heal':()=>{if(Z.pay(G,'heal'))render();shopScreen()},
 'shop-store':()=>{if(Z.pay(G,'store')){S.store={c:Z.storeOffer(G,deckTypes(),R),b:[]};save();render();SFX.play('ui')}storeScreen()},
 'store-open':()=>storeScreen(),
 'store-back':()=>shopScreen(),
 'store-buy':v=>{const st=S.store;if(!st||!v)return;if(v==='shell'?ammoOwned()>=Z.ammoMax(G):(st.b.includes(v)||!st.c.includes(v)))return;
  if(!Z.buyStore(G,v))return;if(v!=='shell')st.b.push(v);if(S.hand.length<Z.HAND_MAX)S.hand.push(v);else S.discard.push(v);SFX.play('place');save();render();storeScreen()},
 'shop-upgrade':()=>listScreen('Améliorer une carte','Toutes les cartes de ce type seront améliorées, y compris celles déjà posées.',deckTypes().filter(t=>Z.UPGRADABLE.includes(t)&&!G.upg[t]),'up-pick'),
 'shop-remove':()=>listScreen('Jeter une carte','Une carte de ce type quitte ton deck pour cette partie (les unités posées ne comptent pas).',pileTypes(),'rm-pick'),
 'up-pick':v=>{if(Z.pay(G,'upgrade'))Z.upgrade(G,v);render();shopScreen()},
 'rm-pick':v=>{if(pileList().includes(v)&&Z.pay(G,'remove'))removeCard(v);shopScreen()},
 day:()=>nextDay(),
 nightpick:()=>{S.store=null;return Z.nightChoice(G,R)?nightScreen():nextDay()},
 nightgo:v=>{const o=S.picks&&S.picks[+v];nextDay(o)},
 daily:()=>dailyScreen(),
 'daily-go':()=>{const day=today(),c=dailySetup(day),r=rng(seedFrom('deck-'+day)),d=[],ks=Z.KEYS.slice();while(d.length<24){const t=ks[Math.floor(r()*ks.length)];if(d.filter(x=>x===t).length<Z.copyMax(t))d.push(t)}newGame(c.ch,c.pl,day,d);save();hide();render()},
 peek:v=>{const k=S.draw.lastIndexOf(v);if(k>=0){S.draw.splice(k,1);S.hand.push(v)}save();hide();render()}
};
// barre de recherche / tri : le texte filtre sur place, les listes redessinent l'écran ouvert
panel.addEventListener('input',e=>{const f=e.target.dataset&&e.target.dataset.f;if(f==='q'){CF.q=e.target.value;cfApply()}});
panel.addEventListener('change',e=>{const f=e.target.dataset&&e.target.dataset.f;if(!f||f==='q')return;CF[f]=e.target.value;(panel.querySelector('[data-a=dkreset]')?deckEditor:collectionScreen)(true)});
panel.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const f=ACT[b.dataset.a];if(f)f(b.dataset.v)});
panel.addEventListener('input',e=>{const el=e.target.closest('[data-o]');if(!el)return;const k=el.dataset.o;
 if(k==='sfx'||k==='mus'){OPT[k]=+el.value/100;const b=el.parentElement.querySelector('b');if(b)b.textContent=el.value+' %'}
 else if(k==='speed')OPT.speed=+el.value;else if(k==='shake'||k==='text'||k==='eco'||k==='vib'||k==='all'){OPT[k]=el.checked?1:0;if(k==='vib'&&OPT.vib)vib(60)}else if(k==='lang')OPT.lang=el.value;else if(k==='back')OPT.back=el.value;else if(k==='shelter')OPT.shelter=el.value;
 saveOpt();applyOpt();if(k==='sfx')SFX.play('ui')});
$('#go').addEventListener('click',()=>{if(S.pause)resumeWave();else if(S.busy){SPEED=SPEED===1?2:SPEED===2?4:1;render()}else night()});

function nextUnlockTxt(){const u=Z.unlocks(META),nx=[];
 for(const k in Z.UNLOCK.chars)if(!u.chars.includes(k))nx.push([Z.UNLOCK.chars[k]-META.total,`${Z.CHARS[k].n} dans ${Z.UNLOCK.chars[k]-META.total} nuits au total`]);
 for(const k in Z.UNLOCK.cards)if(!u.pool.includes(k))nx.push([Z.UNLOCK.cards[k]-META.total,`la carte ${Z.U[k].n} dans ${Z.UNLOCK.cards[k]-META.total} nuits au total`]);
 for(const k in Z.UNLOCK.places)if(!u.places.includes(k))nx.push([99,`${Z.PLACES[k].n} avec un record de ${Z.UNLOCK.places[k]} nuits`]);
 nx.sort((a,b)=>a[0]-b[0]);return nx.length?`<p>Prochain déblocage : ${nx[0][1]}.</p>`:''}
/* ---------- défi quotidien : même graine, même personnage et même lieu pour tout le monde ce jour-là ---------- */
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function dailySetup(day){const r=seedFrom('cfg-'+day),ch=Object.keys(Z.CHARS),pl=Object.keys(Z.PLACES);return{ch:ch[r%ch.length],pl:pl[Math.floor(r/7)%pl.length]}}
function dailyBest(day){try{const d=JSON.parse(localStorage.getItem('abri-daily'))||{};return d[day]??null}catch(e){return null}}
function dailyEnd(n){let prev=null;try{const d=JSON.parse(localStorage.getItem('abri-daily'))||{};prev=d[G.daily]??null;if(prev===null||n>prev){d[G.daily]=n;localStorage.setItem('abri-daily',JSON.stringify(d))}}catch(e){}
 return `<p>Défi du jour : <b>${plural(n,'nuit','nuits')}</b>${prev!==null?` (ton meilleur aujourd’hui : ${plural(Math.max(prev,n),'nuit','nuits')})`:''}. Compare ton score avec tes amis : tout le monde a la même partie aujourd’hui.</p>`}
function dailyScreen(){const day=today(),c=dailySetup(day),b=dailyBest(day);
 show(`<h2 class="pw">Défi du jour</h2><p>Aujourd’hui, tout le monde joue <b>la même partie</b> : même personnage, même lieu, mêmes cartes et mêmes nuits. Tu peux le rejouer autant que tu veux.</p>
  <ul><li>Personnage : <b>${Z.CHARS[c.ch].n}</b></li><li>Lieu : <b>${Z.PLACES[c.pl].n}</b></li><li>Toutes les cartes sont disponibles.</li></ul>
  ${b!==null?`<p>Ton meilleur score aujourd’hui : <b>${plural(b,'nuit','nuits')}</b>.</p>`:''}<p>Les défis ne comptent pas pour les déblocages.</p>
  <button type="button" class="go" data-a="daily-go">Jouer le défi</button><button type="button" class="skip" data-a="title">Retour</button>`)}
// règles du jeu (v123) : des fiches illustrées, avec un sommaire pour sauter à une fiche
const RULES=[
 ['but','trophy','Le but',()=>`<p>Tiens <b>${Z.WIN_NIGHT} nuits</b>. À l’aube de la nuit ${Z.WIN_NIGHT}, après le Patient Zéro, les secours arrivent : tu peux <b>partir</b> (victoire) ou <b>rester</b> en mode infini pour le score, jusqu’à ce que la horde gagne.</p><p>Chaque victoire débloque une <b>Mutation de la horde</b> plus dure (10 niveaux, à choisir avant la partie), une carte de victoire et des reliques.</p>`],
 ['jour','bolt','Le jour',()=>`<p>Tu as <b>${Z.ENERGY} énergies</b> par jour. Chaque carte coûte 0 à 3 : touche-la puis touche une case, ou glisse-la sur le plateau. Les cartes non jouées restent en main.</p><p>Les <b>murs et barbelés</b> se tracent : une carte donne plusieurs cases pour la journée, une par une ou d’un glissé en ligne.</p><p>Tu peux <b>déplacer</b> ce que tu as posé, et <b>rappeler</b> une unité dans ta réserve pour la reposer gratuitement plus tard.</p><p><b>Limite</b> : ${Z.unitCap(G||{night:1})} unités au plus sur le terrain (+1 toutes les 10 nuits). Murs, pièges et postes de soutien ne comptent pas.</p>`],
 ['nuit','moon','La nuit',()=>`<p>Les zombies sortent de la forêt <b>par les 4 routes</b> et marchent vers l’abri : un mur en travers d’une route la ferme. Ils contournent tes défenses si le détour est plus court, sinon ils attaquent le point le plus faible.</p><p>Tes survivants se défendent <b>tout seuls</b>. Garde de l’énergie pour tes cartes <b>Réaction</b> (grenade, tir de l’abri…), jouables pendant l’attaque.</p><p>Dans la forêt, les zombies sont <b>intouchables</b>. Si l’un d’eux blesse l’abri, c’est la <b>brèche</b> : toute la horde avance d’un coup.</p>`],
 ['aube','spark','L’aube',()=>`<p>Choisis une carte de ta <b>pioche</b> pour l’avoir en main le lendemain. Puis le <b>troc</b> : répare l’abri, améliore ou jette une carte, ou ouvre la <b>boutique</b> (objets absents de ton deck et munitions anti-Colosse, 2 au plus, usage unique).</p><p>Parfois, un <b>événement</b> te propose un choix risqué ou prudent. Toutes les 5 nuits, tu trouves une <b>relique</b>.</p>`],
 ['roles','shield','Rôles et escouade',()=>`<p>${ink('tank')} <b>Tank</b> : beaucoup de PV ; les zombies à ${Z.TAUNT} cases ou moins le visent ; il bloque 1 coup sur 3 et frappe peu (1 dégât).</p><p>${ink('heal')} <b>Soin</b> : soigne tes unités, à distance (portée en vert) ou sur les 8 cases autour. Les murs et postes sont réparés par les réparateurs.</p><p>${ink('dps')} <b>DPS</b> : gros dégâts. Le corps à corps rend chaque coup reçu au contact. <b>Tir de soutien</b> : +1 dégât (une fois par tour) sur un zombie au contact d’un Tank. Les tirs lents (Sniper…) reçoivent leurs bonus multipliés par leur intervalle.</p><p><b>Escouade</b> : un Tank, un Soin et un DPS voisins gagnent chacun +1.</p>`],
 ['fam','medal','Les factions',()=>`<p>Chaque faction a 2 bonus : à 2 survivants, puis à 5 (équipe complète). Seuls les survivants comptent (humains et chiens). Son Chef légendaire compte pour 2.</p><div class="deck">${Object.keys(Z.FAM).map(k=>{const f=Z.FAM[k];return `<div class="dk"><span class="fic">${ink(k)}</span><span><b>${f.n}</b>${f.lv[0]} : ${f.d[0]}. ${f.lv[1]} : ${f.d[1]}.</span></div>`}).join('')}</div>`],
 ['fusion','star','Fusion, évolutions, niveaux',()=>`<p><b>Fusion</b> : 3 unités identiques (même nombre d’étoiles) deviennent une <b>nouvelle carte ★</b> : plus de PV, +1 dégât, 2 places libérées, et les 3 cartes repartent dans ta défausse.</p><p><b>Évolution</b> ✦ : certaines paires posées côte à côte deviennent une nouvelle carte unique (page Évolutions secrètes de la Collection).</p><p>Une carte ★ ou ✦ ne retourne jamais dans le deck : blessée, elle part en réserve ; détruite, elle disparaît.</p><p><b>Niveaux</b> : à 20 zombies tués, puis 25 de plus, 30…, l’unité gagne +1 dégât ou +3 PV.</p>`],
 ['murs','post','Les remparts',()=>`<p>Des murs posés côte à côte forment un <b>rempart</b> : chaque mur gagne +1 PV par mur voisin (jusqu’à +3). Chaque mur garde ses PV : une brèche s’ouvre là où ça cède.</p>`],
 ['surv','band','Les survivants',()=>`<p>Chaque survivant a un <b>prénom</b> et un trait. La première fois qu’il tombe, il part blessé en réserve pour 3 nuits et garde une cicatrice ; la seconde fois, il est perdu pour de bon.</p>`],
 ['horde','skull','La horde',()=>`<p><b>Frénésie meurtrière</b> : dès la nuit 5, +10 % de PV pour tous les zombies, puis +10 % de plus chaque nuit.</p><p><b>Curée</b> : une unité encerclée prend +1 dégât par autre zombie à son contact (+2 au plus). Les Tanks ne la subissent pas.</p><p><b>Nuit rouge</b> toutes les 5 nuits : +15 % de zombies, puis une mutation instable (un affixe qui change toutes les 5 nuits) et une relique.</p><p><b>Boss</b> toutes les 10 nuits : <b>le Colosse</b> (nuit 10), <b>la Mère</b> (20, elle pond des rampants), <b>le Patient Zéro</b> (30, il accélère la horde), accompagnés de Colosses en renfort. Le boss arrive dans une 2ᵉ vague, frappe très fort et ne meurt pas en touchant l’abri. Entre les deux vagues, tu déplaces tes unités. La nuit suivante est un <b>répit</b> (30 % de zombies en moins).</p>`],
 ['mut','dna','Mutations de la horde',()=>`<p>Après ta première victoire, choisis un niveau de Mutation avant la partie. Les niveaux s’additionnent :</p><div class="deck">${Z.MENACES.slice(1).map((x,k)=>`<div class="dk"><span class="fic mnum">${k+1}</span><span><b>${x.n}</b>${x.d}.</span></div>`).join('')}</div>`]];
const rulesHtml=()=>`<div class="rindex">${RULES.map(([id,ic,t])=>`<button type="button" class="rchip" data-a="rgo" data-v="${id}">${ic==='dna'?svg('mut'):ic==='shield'?ink('tank'):ii(ic)}${t}</button>`).join('')}</div>${RULES.map(([id,ic,t,f])=>`<section class="rfiche" id="r-${id}"><h3>${ic==='dna'?svg('mut'):ic==='shield'?ink('tank'):ii(ic)}${t}</h3>${f()}</section>`).join('')}`;
// logo du jeu (aussi dans assets/ui/logo.svg), dessiné en SVG avec les polices du jeu
const LOGO=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 210" role="img" aria-label="Dernier Abri">
 <defs>
  <radialGradient id="lg-moon" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="#fff4cf"/><stop offset=".7" stop-color="#f2d58a"/><stop offset="1" stop-color="#d9a640"/></radialGradient>
  <radialGradient id="lg-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd25a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb020" stop-opacity="0"/></radialGradient>
  <linearGradient id="lg-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a3a"/><stop offset=".5" stop-color="#7a4f28"/><stop offset="1" stop-color="#5a3818"/></linearGradient>
 </defs>
 <circle cx="180" cy="74" r="62" fill="#2a1d13"/>
 <circle cx="180" cy="74" r="57" fill="url(#lg-moon)"/>
 <circle cx="158" cy="56" r="7" fill="#e3bf6c" opacity=".55"/><circle cx="204" cy="92" r="9" fill="#e3bf6c" opacity=".45"/><circle cx="208" cy="50" r="4" fill="#e3bf6c" opacity=".5"/>
 <g fill="#1e140c">
  <path d="M118 128 L123 82 L119 70 L126 80 L128 60 L131 84 L137 74 L133 92 L136 128Z"/>
  <path d="M232 128 L235 90 L229 78 L238 88 L240 66 L243 90 L249 80 L245 98 L248 128Z"/>
  <path d="M138 130 L138 92 L180 60 L222 92 L222 130Z"/>
  <rect x="200" y="66" width="10" height="20"/>
  <path d="M130 96 L180 54 L230 96 L224 100 L180 63 L136 100Z"/>
 </g>
 <circle cx="180" cy="100" r="22" fill="url(#lg-glow)"/>
 <rect x="171" y="92" width="18" height="17" rx="1.5" fill="#ffc947"/>
 <path d="M180 92v17M171 100.5h18" stroke="#1e140c" stroke-width="2.4"/>
 <path d="M150 112 h12 v18 h-12z" fill="#3a2614"/>
 <g>
  <path d="M22 126 Q180 112 338 126 L332 190 Q180 178 28 190Z" fill="#1e140c" transform="translate(0,4)"/>
  <path d="M22 126 Q180 112 338 126 L332 190 Q180 178 28 190Z" fill="url(#lg-wood)" stroke="#2a1a0c" stroke-width="3"/>
  <path d="M26 158 Q180 146 334 158" stroke="#4a2e14" stroke-width="2" fill="none" opacity=".7"/>
  <path d="M60 136 q30 -3 60 -2 M230 168 q40 -2 70 1 M70 176 q25 -2 50 -1" stroke="#b5814a" stroke-width="1.5" fill="none" opacity=".6"/>
  <circle cx="40" cy="138" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/><circle cx="320" cy="138" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/>
  <circle cx="44" cy="177" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/><circle cx="316" cy="177" r="4" fill="#c9a35a" stroke="#3a2410" stroke-width="1.5"/>
  <text x="180" y="170" text-anchor="middle" font-family="'Special Elite',serif" font-size="35" letter-spacing="1.5" fill="#1e140c" transform="translate(2,3)">DERNIER ABRI</text>
  <text x="180" y="170" text-anchor="middle" font-family="'Special Elite',serif" font-size="35" letter-spacing="1.5" fill="#f2e1b0" stroke="#2a1a0c" stroke-width="1.2" paint-order="stroke">DERNIER ABRI</text>
 </g>
 <path d="M64 128 q4 0 4 5 v9 q0 3 -2.5 3 q-2.5 0 -2.5 -3 v-5 q-3 0 -3 -4 q0 -5 4 -5z" fill="#8e1d12" opacity=".9"/>
 <text x="180" y="206" text-anchor="middle" font-family="'Atkinson Hyperlegible',sans-serif" font-size="12.5" letter-spacing="4" fill="#5a4630">UNE NUIT DE PLUS</text>
</svg>`;
function title(){endTest();onTitle=true;show(`<h1 class="logo">${LOGO}</h1><p>Tiens <b>${Z.WIN_NIGHT} nuits</b> jusqu’à l’arrivée des secours… ou reste pour <b>une nuit de plus</b>. Chaque nuit, la horde est plus nombreuse et plus coriace.</p>${META.menaceWon>=0?`<p class="mwon">${ii('trophy')} Mutation ${META.menaceWon} vaincue${META.wins>1?` · ${META.wins} victoires`:''}</p>`:''}

${META.best?`<p>Ton record : <b>${plural(META.best,'nuit survécue','nuits survécues')}</b> · total : <b>${META.total}</b> nuits sur ${plural(META.runs,'partie','parties')}.</p>`:''}${nextUnlockTxt()}
${(d=>d?`<button type="button" class="go" data-a="load">Continuer · ${d.s.phase?'Aube':'Jour'} ${d.g.night}</button><button type="button" class="skip" data-a="new">Nouvelle partie</button>`:'<button type="button" class="go" data-a="new">Jouer</button>')(loadSave())}
<button type="button" class="skip" data-a="rules">Règles du jeu</button>${novice()?'':`<button type="button" class="skip" data-a="coll">Collection et decks${seen('coll')?'':' <span class="newb">Nouveau !</span>'}</button>`}<button type="button" class="skip" data-a="daily">Défi du jour</button><button type="button" class="skip" data-a="deck">Cartes et bestiaire</button><button type="button" class="skip" data-a="stats">Statistiques</button><button type="button" class="skip" data-a="achs">${ii('trophy')} Succès · ${ACH.filter(a=>(META.ach||{})[a[0]]).length}/${ACH.length}</button><button type="button" class="skip" data-a="options">${ii('gear')} Options</button><button type="button" class="skip" data-a="testmode">Mode test</button>${iosHint()?'<p class="ver">Sur iPhone : Partager → « Sur l’écran d’accueil » pour jouer en plein écran.</p>':''}<p class="ver">Sons : Kenney (kenney.nl), artisticdude et saturn91 (OpenGameArt), sous licence CC0 ; La Sonothèque, Pixabay, Sound Fishing (détails dans CREDITS.md).</p><p class="ver">${VERSION}</p>`)}
applyOpt();newGame();render();requestAnimationFrame(frame);title();

// bouton son
/* v126 : tableau des combats (comme Details! dans WoW) : dégâts, encaissés, soins donnés et reçus, morts, pour la nuit ou toute la partie.
   Sur ordinateur et téléphone tourné, il se range dans la colonne de droite ; en portrait, il s'ouvre en bas de l'écran par-dessus la main. */
const MT={tab:'dmg',all:0,at:0};
const MT_TABS=[['dmg','Dégâts'],['tak','Encaissés'],['hg','Soins'],['hr','Reçus'],['dead','Morts']];
const MT_X={x_burn:'Brûlures',x_bleed:'Saignements',x_shelter:'L’abri'};
const mtName=t=>MT_X[t]||(Z.U[t]?Z.U[t].n:t);
const mtCol=t=>{if(t==='x_shelter')return'#c94a4a';if(MT_X[t])return'#e07a2a';const c=(Z.U[t]||{}).cat;return{shoot:'#d9a441',melee:'#c9573a',help:'#6fae5a',wall:'#9a8f7e',trap:'#b07a3c',post:'#5a8fc9'}[c]||'#a77ad9'};
const fmt1=v=>(Math.round(v*10)/10).toLocaleString('fr-FR');
// l'en-tête (onglets) n'est reconstruit que quand on change d'onglet : le corps se met à jour en direct sans voler les clics
function meterHead(){const night=!MT.all;return `<div class="mt-h"><b class="mt-ttl"></b><span class="mt-sc"><button type="button" data-mt="n" class="${night?'on':''}">Nuit</button><button type="button" data-mt="a" class="${night?'':'on'}">Partie</button></span><button type="button" class="mt-x" data-mt="x" aria-label="Fermer">×</button></div>
  <div class="mt-tabs">${MT_TABS.map(([k,n])=>`<button type="button" data-mt="t:${k}" class="${MT.tab===k?'on':''}">${n}</button>`).join('')}</div><div class="mt-b"></div>`}
function meterBody(){const night=!MT.all,m=(night?G.mtN:G.mtR)||{},ticks=(night?G.mtT:G.mtRT)||0;
 if(MT.tab==='dead'){const ds=(G.mtD||[]).filter(d=>!night||d.night===G.night).slice(-40).reverse();
  return ds.length?`<ul class="mt-dead">${ds.map(d=>`<li><i style="background:${mtCol(d.t)}"></i><span><b>${d.name||mtName(d.t)}</b>${d.name?` <small>${mtName(d.t)}</small>`:''}<br><small>${night?'':`Nuit ${d.night} · `}${d.ko?'blessé, part en réserve':'mort pour de bon'}${d.by&&Z.ZT[d.by]?` · ${Z.ZT[d.by].n}`:''}</small></span></li>`).join('')}</ul>`:`<p class="mt-0">Personne n’est tombé${night?' cette nuit':''}.</p>`}
 const k=MT.tab,rows=Object.values(m).filter(r=>r[k]>0).sort((a,b)=>b[k]-a[k]),max=rows.length?rows[0][k]:1,tot=rows.reduce((a,r)=>a+r[k],0);
 if(!rows.length)return `<p class="mt-0">${G.mtN?'Rien pour l’instant.':'Les chiffres apparaîtront pendant la première nuit.'}</p>`;
 const per=k==='dmg'&&ticks>0;
 return `<ol class="mt-rows">${rows.slice(0,14).map(r=>`<li><i class="mt-bar" style="width:${Math.max(3,r[k]/max*100)}%;background:${mtCol(r.t)}"></i><span class="mt-n">${r.name&&r.name!==mtName(r.t)?`${r.name} <small>${mtName(r.t)}</small>`:(r.name||mtName(r.t))}</span><span class="mt-v">${r[k]}${per?` <small>${fmt1(r[k]/ticks)}/t</small>`:''}${k==='dmg'&&r.kills?` <small>· ${r.kills} ${ii('skull')}</small>`:''}</span></li>`).join('')}</ol>
  <p class="mt-tot">Total : <b>${tot}</b>${per?` · ${fmt1(tot/ticks)} par tour`:''}${rows.length>14?` · ${rows.length-14} autres`:''}</p>`}
function meterSync(force){const el=$('#meter');if(!el)return;const on=!!OPT.meter;el.hidden=!on;$('#mtb').classList.toggle('on',on);
 if(!on)return;const now=performance.now();if(!force&&now-MT.at<300)return;MT.at=now;
 try{const key=MT.tab+MT.all;if(force||el.dataset.k!==key||!el.querySelector('.mt-b')){el.innerHTML=meterHead();el.dataset.k=key}
  el.querySelector('.mt-ttl').textContent=MT.all?'Toute la partie':`Nuit ${G.night}`;el.querySelector('.mt-b').innerHTML=meterBody()}catch(e){el.innerHTML='<p class="mt-0">Détails indisponibles.</p>'}}
$('#mtb').addEventListener('click',()=>{OPT.meter=OPT.meter?0:1;saveOpt();meterSync(1)});
$('#meter').addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(!b)return;const v=b.dataset.mt;
 if(v==='x'){OPT.meter=0;saveOpt()}else if(v==='n')MT.all=0;else if(v==='a')MT.all=1;else if(v.startsWith('t:'))MT.tab=v.slice(2);meterSync(1)});
// v126 : à la fin d'une partie (défaite ou départ en hélico), on peut revoir le tableau des combats de toute la partie
const detBtn=()=>G&&G.mtR&&Object.keys(G.mtR).length?`<button type="button" class="skip" data-a="mdet">${ii('chart')} Détails de la partie</button>`:'';
function keepEnd(){S.endHtml=panel.innerHTML}
function detScreen(){MT.all=1;show(`<h2 class="pw">Détails de la partie</h2><p>${plural(G.night,'nuit','nuits')}, ${G.kills} zombies éliminés.</p><div class="meter inpanel" id="meterP"></div><button type="button" class="go" data-a="mback">Retour</button>`);detSync()}
function detSync(){const el=document.getElementById('meterP');if(!el)return;el.innerHTML=meterHead();el.querySelector('.mt-ttl').textContent=MT.all?'Toute la partie':`Nuit ${G.night}`;el.querySelector('.mt-b').innerHTML=meterBody();const x=el.querySelector('.mt-x');if(x)x.remove()}
panel.addEventListener('click',e=>{const b=e.target.closest('#meterP [data-mt]');if(!b)return;const v=b.dataset.mt;if(v==='n')MT.all=0;else if(v==='a')MT.all=1;else if(v.startsWith('t:'))MT.tab=v.slice(2);detSync()});
const muteBtn=$('#mute');
function muteIcon(){muteBtn.innerHTML=`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/>${SFX.muted?'<path d="M16 9l5 6M21 9l-5 6"/>':'<path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>'}</svg>`;muteBtn.setAttribute('aria-label',SFX.muted?'Activer le son':'Couper le son')}
muteBtn.addEventListener('click',()=>{SFX.toggle();muteIcon()});muteIcon();
function iosHint(){return /iPhone|iPod/.test(navigator.userAgent)&&!(matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone)}
// plein écran : bouton sur les navigateurs qui le permettent (Android, PC). Sur iPhone, passer par « Sur l’écran d’accueil ».
const fsBtn=$('#fs'),DE=document.documentElement,fsReq=DE.requestFullscreen||DE.webkitRequestFullscreen,
 standalone=matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone;
if(fsReq&&!standalone){fsBtn.hidden=false;fsBtn.addEventListener('click',()=>{try{const on=document.fullscreenElement||document.webkitFullscreenElement;
 if(on)(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const r=fsReq.call(DE,{navigationUI:'hide'});if(r&&r.catch)r.catch(()=>{})}}catch(e){}})}

