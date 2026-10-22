// Traduction (v146). Le français est la langue source : chaque texte affiché passe par _t,
// qui cherche sa version dans le dictionnaire de la langue choisie (src/lang-en.js) et garde le français sinon.
//   _t('Texte')            → texte simple
//   _t`Tu as ${n} cartes`   → texte avec trous : la clé du dictionnaire est « Tu as {0} cartes »
// La langue se choisit dans les options (le jeu se recharge) ; par défaut, celle du navigateur.
const LANG=(()=>{try{const o=JSON.parse(localStorage.getItem('abri-opts'));if(o&&(o.lang==='fr'||o.lang==='en'))return o.lang}catch(e){}
 try{return /^fr/i.test(navigator.language||'fr')?'fr':'en'}catch(e){return'fr'}})();
const I18N={};
const _tKeys=new WeakMap();
function _t(s,...a){
 if(typeof s==='string'){if(LANG==='fr')return s;const d=I18N[LANG];const v=d&&d[s];return v!=null?v:s}
 if(LANG!=='fr'){const d=I18N[LANG];let k=_tKeys.get(s);if(k===undefined){k=s.reduce((r,q,i)=>r+(i?'{'+(i-1)+'}':'')+q,'');_tKeys.set(s,k)}
  const v=d&&d[k];if(v!=null)return v.replace(/\{(\d+)\}/g,(m,i)=>a[i])}
 let r=s[0];for(let i=0;i<a.length;i++)r+=a[i]+s[i+1];return r}
// textes fixes de index.html (boutons, libellés d’accessibilité)
function _tPage(){if(LANG==='fr')return;document.documentElement.lang=LANG;
 document.querySelectorAll('[aria-label]').forEach(e=>e.setAttribute('aria-label',_t(e.getAttribute('aria-label'))));
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const t=n.nodeValue.trim();if(t){const v=_t(t);if(v!==t)n.nodeValue=n.nodeValue.replace(t,v)}}}
