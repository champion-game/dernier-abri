/* v304 : aperçu des personnages en 3D dans le vrai jeu (essai, pas encore validé par Amine).
   Actif seulement avec ?3d=1 dans l'adresse (mémorisé ; ?3d=0 pour revenir aux dessins ; ?3d=force : 3D en direct sans garde-fou).
   v307 : les personnages 3D sont photographiés à l'avance (node tools/export-3d.js) en planches d'images vues du dessus
   (assets/3d/planches/, index assets/3d/planches.js). Le jeu les affiche comme des dessins : aucun calcul 3D en jeu.
   v309 : les zombies sont rendus en vraie 3D en direct (corps Mixamo, src/zombies-3d.js), comme dans la maquette :
   tous les zombies visibles sont dessinés ensemble à chaque image dans une grille (une case par zombie), puis le jeu
   recopie chaque case à sa place. Les planches servent de repli (trop de zombies, appareil trop lent, chargement).
   Maquettes : artifacts « Barricard test 3D » et « Barricard roster zombies 3D ». */
(function () {
  let actif = false,
    force = false; // ?3d=force : 3D en direct même si l'appareil est lent (pour comparer)
  try {
    const q = new URLSearchParams(location.search).get('3d');
    if (q === '1' || q === 'force') localStorage.setItem('abri-3d', q);
    if (q === '0') localStorage.removeItem('abri-3d');
    actif = !!localStorage.getItem('abri-3d');
    force = localStorage.getItem('abri-3d') === 'force';
  } catch (e) {}
  if (!actif) return;

  const ATLAS = {}; // clé du sprite -> { clips: { repos, marche, attaque, tir0, tir1, touche, mort }, echelle } ; un clip = { planche, taille, n, duree, boucle }
  let enCours = null; // personnage en train d'être dessiné (unité ou zombie), pour choisir son geste
  let DIRECT = null; // zombies en 3D en direct, une fois prêts

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
    if (DIRECT && enCours && enCours.zombie && DIRECT.dessiner(enCours, k, x, y, a, mul)) return true;
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

  // ---------- Zombies en 3D en direct ----------
  // bibliothèques chargées l'une après l'autre (seulement avec ?3d=1), puis le corps Mixamo et ses animations
  const LIBS = ['three.min.js', 'fflate.min.js', 'FBXLoader.js', 'BufferGeometryUtils.js', 'SkeletonUtils.js'].map(
    f => 'assets/lib/' + f,
  );
  LIBS.push('src/zombies-3d.js?v=' + (typeof VERSION === 'string' ? VERSION.split(' ')[0] : ''));
  (function charger(k) {
    if (k >= LIBS.length) {
      Promise.all([
        fetch('assets/3d/xbot.fbx').then(r => r.arrayBuffer()),
        fetch('assets/3d/zombies-clips.json').then(r => r.json()),
      ])
        .then(([base, json]) => zombiesEnDirect(window.THREE, base, json))
        .catch(e => console.warn('Zombies 3D en direct indisponibles :', e));
      return;
    }
    const s = document.createElement('script');
    s.src = LIBS[k];
    s.onload = () => charger(k + 1);
    s.onerror = () => console.warn('Zombies 3D : fichier introuvable', LIBS[k]);
    document.head.appendChild(s);
  })(0);

  function zombiesEnDirect(THREE, base, json) {
    const M = window.zombiesMixamo(THREE),
      CLIPS = {};
    for (const nom in json) {
      CLIPS[nom] = THREE.AnimationClip.parse(json[nom]);
      CLIPS[nom].uuid = THREE.MathUtils.generateUUID(); // sans identifiant, le moteur confond tous les clips
    }
    // la grille : une case de 1,24 m (le zombie et ses bras tendus) par zombie, vue du dessus
    const CASE = 112,
      GRILLE = 8,
      MONDE = 1.24,
      DEMI = (MONDE * GRILLE) / 2;
    const toile = document.createElement('canvas');
    const rendu = new THREE.WebGLRenderer({ canvas: toile, antialias: true, alpha: true, preserveDrawingBuffer: true });
    rendu.setPixelRatio(1);
    rendu.setSize(CASE * GRILLE, CASE * GRILLE, false);
    rendu.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x5a4a30, 0.75));
    const soleil = new THREE.DirectionalLight(0xfff0d8, 0.8);
    soleil.position.set(-3, 10, 3);
    scene.add(soleil);
    const cam = new THREE.OrthographicCamera(-DEMI, DEMI, DEMI, -DEMI, 0.1, 50);
    cam.position.set(0, 20, 0.001);
    cam.up.set(0, 0, -1);
    cam.lookAt(0, 0, 0);

    // un modèle habillé par type de zombie, préparé quand le navigateur a du temps libre
    const corps = new THREE.FBXLoader().parse(base, ''),
      MODELES = {},
      aPreparer = M.ROSTER.slice();
    const auRepos = window.requestIdleCallback
      ? f => requestIdleCallback(f, { timeout: 2000 })
      : f => setTimeout(f, 50);
    (function preparer() {
      const Z = aPreparer.shift();
      if (!Z) return;
      try {
        const m = THREE.SkeletonUtils.clone(corps);
        m.traverse(o => {
          if (o.isSkinnedMesh) o.geometry = o.geometry.clone(); // chaque type a sa propre peinture
        });
        M.habiller(m, Z);
        M.fusionner(m);
        const cadre = Z.id === 'crawl' ? 1.45 : 1; // le rampant allongé a besoin de plus de place
        m.scale.setScalar(0.01 / cadre);
        MODELES[Z.id] = { m, Z, echelle: 1.3 * cadre, decale: 0.12 / cadre };
      } catch (e) {
        console.warn(e);
      }
      auRepos(preparer);
    })();

    const cases = new Array(GRILLE * GRILLE).fill(null),
      instances = new Map(),
      reserve = {};
    let creations = 0;
    // le zombie du jeu reçoit une case et un modèle 3D (repris de la réserve s'il y en a un)
    function instancePour(v) {
      let inst = instances.get(v);
      if (inst) return inst;
      const mod = MODELES[v.k],
        c = cases.indexOf(null);
      if (!mod || c < 0 || creations >= 2) return null; // pas plus de deux nouveaux par image, pour éviter les à-coups
      creations++;
      const obj = (reserve[v.k] && reserve[v.k].pop()) || THREE.SkeletonUtils.clone(mod.m);
      obj.userData.mixer = obj.userData.mixer || new THREE.AnimationMixer(obj);
      obj.position.set(
        -DEMI + ((c % GRILLE) + 0.5) * MONDE,
        0,
        -DEMI + (Math.floor(c / GRILLE) + 0.5) * MONDE - mod.decale,
      );
      scene.add(obj);
      inst = {
        v,
        obj,
        mixer: obj.userData.mixer,
        case: c,
        mod,
        vu: performance.now(),
        pret: false,
        geste: null,
        action: null,
      };
      cases[c] = inst;
      instances.set(v, inst);
      return inst;
    }
    function liberer(inst) {
      scene.remove(inst.obj);
      inst.mixer.stopAllAction();
      (reserve[inst.v.k] = reserve[inst.v.k] || []).push(inst.obj);
      cases[inst.case] = null;
      instances.delete(inst.v);
    }
    // geste selon ce que fait le zombie dans le jeu, enchaîné en fondu comme dans la maquette
    function gesteDe(inst) {
      const v = inst.v,
        now = inst.nowJeu;
      if (v.dying) return 'mourir';
      if (now - (v.atk || -1e9) < 600) return 'attaquer';
      const bouge = now - v.t0 < v.dur;
      return bouge ? (v.k === 'run' || v.k === 'zero' ? 'courir' : 'marcher') : 'attendre';
    }
    function jouer(inst, geste) {
      if (inst.geste === geste) return;
      const [nom, vitesse] = inst.mod.Z.roles[geste],
        clip = CLIPS[nom],
        a = inst.mixer.clipAction(clip),
        unique = geste === 'mourir';
      a.setLoop(unique ? THREE.LoopOnce : THREE.LoopRepeat);
      a.clampWhenFinished = unique;
      a.timeScale = vitesse;
      a.reset().play();
      if (inst.action) inst.action.crossFadeTo(a, 0.25, false);
      else a.time = Math.random() * clip.duration; // chacun démarre à un moment différent de son pas
      inst.action = a;
      inst.geste = geste;
    }
    // garde-fou : si l'appareil n'arrive plus à suivre, retour aux planches d'images
    let lent = 0,
      prec = performance.now();
    function image(now) {
      const reel = Math.min(0.5, (now - prec) / 1000),
        dt = Math.min(0.1, reel);
      prec = now;
      creations = 0;
      try {
        for (const inst of [...instances.values()]) {
          if (now - inst.vu > 800) {
            liberer(inst);
            continue;
          }
          jouer(inst, gesteDe(inst));
          inst.mixer.update(dt);
        }
        if (instances.size) {
          rendu.render(scene, cam);
          instances.forEach(inst => (inst.pret = true));
          // plus de 2 s cumulées sous 32 images/s : l'appareil ne suit pas
          lent = reel > 1 / 32 ? lent + reel : Math.max(0, lent - reel);
          if (lent > 2 && !force) {
            console.warn('Zombies 3D en direct : appareil trop lent, retour aux images préparées');
            [...instances.values()].forEach(liberer);
            DIRECT = null;
            return;
          }
        }
      } catch (e) {
        console.warn(e);
      }
      requestAnimationFrame(image);
    }
    requestAnimationFrame(image);

    DIRECT = {
      // dessine le zombie depuis sa case de la grille ; faux s'il n'a pas (encore) de modèle 3D
      dessiner(e, k, x, y, a, mul) {
        if (typeof OPT !== 'undefined' && OPT.eco) return false; // Mode économie : images préparées
        const inst = instancePour(e.zombie);
        if (!inst) return false;
        inst.vu = performance.now();
        inst.nowJeu = e.now;
        if (!inst.pret) return false;
        const d = sprK(k)[1];
        if (!d) return false;
        const [m, b, z] = d,
          sz = z * (mul || 1) * inst.mod.echelle;
        ctx.save();
        ctx.translate(x, y);
        if (m === 'rot') ctx.rotate(a - b);
        ctx.drawImage(
          toile,
          (inst.case % GRILLE) * CASE,
          Math.floor(inst.case / GRILLE) * CASE,
          CASE,
          CASE,
          -sz / 2,
          -sz / 2,
          sz,
          sz,
        );
        ctx.restore();
        return true;
      },
    };
  }
})();
