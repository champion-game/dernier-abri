/* v304 : aperçu des personnages en 3D dans le vrai jeu (essai, pas encore validé par Amine).
   Actif seulement avec ?3d=1 dans l'adresse (mémorisé ; ?3d=0 pour revenir aux dessins).
   v307 : les personnages 3D sont photographiés à l'avance (node tools/export-3d.js) en planches d'images vues du dessus
   (assets/3d/planches/, index assets/3d/planches.js). Le jeu les affiche comme des dessins : aucun calcul 3D en jeu.
   Maquettes : artifacts « Barricard test 3D » et « Barricard roster zombies 3D ». */
(function () {
  let actif = false;
  try {
    const q = new URLSearchParams(location.search).get('3d');
    if (q === '1') localStorage.setItem('abri-3d', '1');
    if (q === '0') localStorage.removeItem('abri-3d');
    actif = localStorage.getItem('abri-3d') === '1';
  } catch (e) {}
  if (!actif) return;

  const ATLAS = {}; // clé du sprite -> { clips: { repos, marche, attaque, tir0, tir1, touche, mort }, echelle } ; un clip = { planche, taille, n, duree, boucle }
  let enCours = null; // personnage en train d'être dessiné (unité ou zombie), pour choisir son geste

  // image d'un geste : en boucle selon l'horloge, ou jouée une fois depuis son début (puis figée sur la dernière)
  function imageClip(clip, t, boucle) {
    const n = clip.n,
      k = Math.floor((t / clip.duree) * n);
    return { clip, k: boucle ? ((k % n) + n) % n : Math.min(n - 1, Math.max(0, k)) };
  }
  // le geste à montrer selon ce que fait le personnage dans le jeu
  function choisirImage(A) {
    const C = A.clips,
      e = enCours,
      horloge = performance.now() / 1000 + (e ? e.decalage : 0);
    if (e && e.zombie) {
      const v = e.zombie,
        now = e.now;
      if (v.dying) return imageClip(C.mort, (now - v.dying) / 1000, false);
      if (C.touche && now - (v.flash || -1e9) < C.touche.duree * 1000)
        return imageClip(C.touche, (now - v.flash) / 1000, false);
      if (now - (v.atk || -1e9) < 600) return imageClip(C.attaque, horloge, true);
      return e.bouge ? imageClip(C.marche, horloge, true) : imageClip(C.repos, horloge, true);
    }
    if (e && e.unite != null) {
      const ta = (e.now - atkT[e.unite]) / 1000;
      if (C.tir0 && ta >= 0 && ta < C.tir0.duree)
        return imageClip(Math.round(atkT[e.unite]) % 2 ? C.tir1 : C.tir0, ta, false);
      if (C.attaque && !C.attaque.boucle && ta >= 0 && ta < C.attaque.duree) return imageClip(C.attaque, ta, false);
      if (C.attaque && C.attaque.boucle && ta >= 0 && ta < 0.9) return imageClip(C.attaque, horloge, true);
    }
    return imageClip(C.repos, horloge, true);
  }

  // drawSpr dessine le modèle animé quand il existe, sinon le dessin d'origine
  const drawSprDessin = drawSpr;
  drawSpr = function (k, x, y, a, out, mul) {
    const A = ATLAS[k];
    if (!A) return drawSprDessin.apply(this, arguments);
    const d = sprK(k)[1];
    if (!d) return drawSprDessin.apply(this, arguments);
    const [m, b, z] = d,
      sz = z * (mul || 1) * A.echelle;
    ctx.save();
    ctx.translate(x, y);
    if (m === 'rot') ctx.rotate(a - b);
    const { clip, k: case_ } = choisirImage(A);
    // toutes les images d'un geste sont sur une seule planche : une seule texture pour le navigateur
    ctx.drawImage(clip.planche, case_ * clip.taille, 0, clip.taille, clip.taille, -sz / 2, -sz / 2, sz, sz);
    ctx.restore();
    return true;
  };
  // chaque zombie et chaque unité a son propre temps d'animation, pour ne pas bouger tous ensemble
  const drawZombieDessin = drawZombie;
  drawZombie = function (v, now) {
    enCours = { zombie: v, now, decalage: ((v.id || 0) * 0.37) % 7, bouge: now - v.t0 < v.dur };
    try {
      return drawZombieDessin.apply(this, arguments);
    } finally {
      enCours = null;
    }
  };
  const drawUnitDessin = drawUnit;
  drawUnit = function (i, u, now) {
    enCours = { unite: i, now, decalage: (i * 0.53) % 7 };
    try {
      return drawUnitDessin.apply(this, arguments);
    } finally {
      enCours = null;
    }
  };

  // planches préparées à l'avance : un personnage passe en 3D dès que toutes ses planches sont chargées
  const index = document.createElement('script');
  index.src = 'assets/3d/planches.js';
  index.onload = () => {
    const P = window.PLANCHES_3D || {};
    for (const cle in P) {
      const A = { echelle: P[cle].echelle, clips: {} };
      let reste = 0;
      for (const nom in P[cle].clips) {
        const c = P[cle].clips[nom],
          image = new Image();
        reste++;
        image.onload = () => {
          if (--reste === 0) ATLAS[cle] = A;
        };
        image.src = 'assets/3d/planches/' + c.fichier;
        A.clips[nom] = Object.assign({ planche: image }, c);
      }
    }
  };
  document.head.appendChild(index);
})();
