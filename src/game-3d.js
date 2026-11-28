/* v304 : aperçu des personnages en 3D dans le vrai jeu (essai, pas encore validé par Amine).
   Actif seulement avec ?3d=1 dans l'adresse (mémorisé ; ?3d=0 pour revenir aux dessins).
   Les modèles 3D (formes arrondies, textures peintes en code) sont animés puis photographiés vus du dessus
   au lancement : chaque personnage devient une suite d'images, que drawSpr affiche à la place du dessin.
   Le jeu reste donc en 2D : aucun calcul 3D pendant la nuit. Maquette : artifact « Barricard test 3D ». */
(function () {
  let actif = false;
  try {
    const q = new URLSearchParams(location.search).get('3d');
    if (q === '1') localStorage.setItem('abri-3d', '1');
    if (q === '0') localStorage.removeItem('abri-3d');
    actif = localStorage.getItem('abri-3d') === '1';
  } catch (e) {}
  if (!actif) return;

  const ATLAS = {}; // clé du sprite -> { clips: { repos, marche, attaque, tir0, tir1, touche, mort }, echelle }
  let enCours = null; // personnage en train d'être dessiné (unité ou zombie), pour choisir son geste

  // image d'un geste : en boucle selon l'horloge, ou jouée une fois depuis son début (puis figée sur la dernière)
  function imageClip(clip, t, boucle) {
    const n = clip.images.length,
      k = Math.floor((t / clip.duree) * n);
    return clip.images[boucle ? ((k % n) + n) % n : Math.min(n - 1, Math.max(0, k))];
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
    ctx.drawImage(choisirImage(A), -sz / 2, -sz / 2, sz, sz);
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
  // les yeux ajoutés sur les dessins de zombies ne tombent plus au bon endroit sur le modèle
  const yeuxDessin = pushSpriteEyes;
  pushSpriteEyes = function (v) {
    if (ATLAS['z_' + v.k]) return;
    return yeuxDessin.apply(this, arguments);
  };

  // bibliothèques chargées l'une après l'autre : three.js, puis de quoi lire les fichiers Mixamo (.fbx)
  const LIBS = ['assets/lib/three.min.js', 'assets/lib/fflate.min.js', 'assets/lib/FBXLoader.js'];
  (function charger(k) {
    if (k >= LIBS.length) {
      try {
        fabriquer(window.THREE);
      } catch (e) {
        console.warn(e);
      }
      return;
    }
    const script = document.createElement('script');
    script.src = LIBS[k];
    script.onload = () => charger(k + 1);
    document.head.appendChild(script);
  })(0);

  function fabriquer(THREE) {
    let BOUCLE = null; // pendant la photo d'une boucle : mouvements rendus périodiques
    const EPAIS_CONTOUR = 0.026; // contour plus épais qu'en maquette : les personnages sont petits à l'écran
    const R = (a, b) => a + Math.random() * (b - a);
    const G = () => new THREE.Group();

    // ================= Textures peintes en code =================
    function texture(peindre, taille = 256, rep = [1, 1]) {
      const c = document.createElement('canvas');
      c.width = c.height = taille;
      const g = c.getContext('2d');
      peindre(g, taille);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rep[0], rep[1]);
      t.anisotropy = 4;
      return t;
    }
    const fond = (g, S, c) => {
      g.fillStyle = c;
      g.fillRect(0, 0, S, S);
    };
    function grain(g, S, n, a, clair) {
      for (let i = 0; i < n; i++) {
        g.fillStyle = clair ? `rgba(255,255,255,${R(0, a)})` : `rgba(0,0,0,${R(0, a)})`;
        g.fillRect(R(0, S), R(0, S), R(1, 2.5), R(1, 2.5));
      }
    }
    function fibres(g, S, n, coul, a, long, angle) {
      g.strokeStyle = coul;
      g.lineWidth = 1;
      for (let i = 0; i < n; i++) {
        const x = R(0, S),
          y = R(0, S),
          an = angle == null ? R(0, 6.3) : angle + R(-0.2, 0.2),
          l = R(long * 0.5, long);
        g.globalAlpha = R(a * 0.3, a);
        g.beginPath();
        g.moveTo(x, y);
        g.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l);
        g.stroke();
      }
      g.globalAlpha = 1;
    }
    function taches(g, S, n, coul, rmin, rmax, a) {
      g.fillStyle = coul;
      for (let i = 0; i < n; i++) {
        const r = R(rmin, rmax);
        g.globalAlpha = R(a * 0.4, a);
        g.beginPath();
        g.ellipse(R(0, S), R(0, S), r, r * R(0.5, 1), R(0, 3), 0, 6.3);
        g.fill();
      }
      g.globalAlpha = 1;
    }
    function plis(g, S, n, coul, a) {
      g.strokeStyle = coul;
      for (let i = 0; i < n; i++) {
        const x = R(0, S);
        g.globalAlpha = R(a * 0.4, a);
        g.lineWidth = R(2, 6);
        g.beginPath();
        g.moveTo(x, 0);
        g.bezierCurveTo(x + R(-30, 30), S * 0.3, x + R(-30, 30), S * 0.7, x + R(-20, 20), S);
        g.stroke();
      }
      g.globalAlpha = 1;
    }
    function couture(g, S, y, coul) {
      g.strokeStyle = coul;
      g.lineWidth = 1.5;
      g.setLineDash([5, 4]);
      g.globalAlpha = 0.6;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(S, y);
      g.stroke();
      g.setLineDash([]);
      g.globalAlpha = 1;
    }
    function salir(g, S, n) {
      // sang et crasse
      taches(g, S, n, '#6e1810', 4, 18, 0.75);
      taches(g, S, n * 3, '#8e2a1e', 1, 4, 0.8);
      taches(g, S, n, '#4a3a24', 6, 22, 0.25);
    }
    const tissu = (c, extra) =>
      texture((g, S) => {
        fond(g, S, c);
        fibres(g, S, 1400, 'rgba(0,0,0,.5)', 0.18, 5);
        fibres(g, S, 600, 'rgba(255,255,255,.5)', 0.12, 4);
        plis(g, S, 10, 'rgba(0,0,0,.6)', 0.14);
        grain(g, S, 1200, 0.12);
        extra && extra(g, S);
      });
    const cheveux = (base, clair, sombre) =>
      texture((g, S) => {
        fond(g, S, base);
        fibres(g, S, 900, sombre, 0.7, 40, Math.PI / 2);
        fibres(g, S, 500, clair, 0.55, 34, Math.PI / 2);
        grain(g, S, 400, 0.1);
      });
    const peau = (base, sombre, clair, zombie) =>
      texture((g, S) => {
        fond(g, S, base);
        taches(g, S, 40, sombre, 6, 24, zombie ? 0.35 : 0.12);
        taches(g, S, 30, clair, 4, 16, zombie ? 0.3 : 0.15);
        if (zombie) {
          fibres(g, S, 60, '#3e4a2a', 0.45, 22);
          taches(g, S, 10, '#6a1a12', 3, 10, 0.7);
          taches(g, S, 14, '#3c4a26', 2, 6, 0.7);
        }
        grain(g, S, 900, 0.08);
      });
    const cuir = base =>
      texture((g, S) => {
        fond(g, S, base);
        taches(g, S, 30, 'rgba(0,0,0,.6)', 10, 40, 0.18);
        taches(g, S, 20, 'rgba(255,230,190,.5)', 8, 30, 0.1);
        fibres(g, S, 120, 'rgba(255,235,200,.8)', 0.3, 14);
        grain(g, S, 1600, 0.14);
        couture(g, S, S * 0.12, '#e8cfa0');
        couture(g, S, S * 0.88, '#e8cfa0');
      });
    const T = {
      chemise: tissu('#dccbab'),
      volant: tissu('#f2e8d4', (g, S) => {
        for (let x = 0; x < S; x += 10) {
          g.fillStyle = 'rgba(120,100,70,.18)';
          g.fillRect(x, 0, 3, S);
        }
      }),
      feutre: texture((g, S) => {
        fond(g, S, '#7c5434');
        taches(g, S, 50, '#5a3a22', 10, 40, 0.3);
        taches(g, S, 40, '#a2774d', 8, 30, 0.22);
        fibres(g, S, 600, 'rgba(0,0,0,.6)', 0.15, 6);
        grain(g, S, 1400, 0.12);
      }),
      bande: cuir('#a77a4a'),
      cuir: cuir('#6e4628'),
      cuirFonce: cuir('#3a2a1e'),
      roux: cheveux('#b4432a', '#e88356', '#5e1d10'),
      noirs: cheveux('#2c2522', '#5a4a40', '#120e0c'),
      barbe: cheveux('#3a2a1f', '#6e5440', '#160f0a'),
      gris: cheveux('#9c9a96', '#d8d6d0', '#5a5854'),
      blond: cheveux('#e6be55', '#fbe39a', '#a87a26'),
      metal: texture((g, S) => {
        const d = g.createLinearGradient(0, 0, S, 0);
        d.addColorStop(0, '#6c7279');
        d.addColorStop(0.45, '#e1e5ea');
        d.addColorStop(0.6, '#a8aeb5');
        d.addColorStop(1, '#5c6168');
        g.fillStyle = d;
        g.fillRect(0, 0, S, S);
        fibres(g, S, 300, 'rgba(255,255,255,.8)', 0.25, 30, Math.PI / 2);
        taches(g, S, 12, '#4a3a2a', 2, 6, 0.3);
      }),
      bois: texture((g, S) => {
        fond(g, S, '#8a5a32');
        g.strokeStyle = 'rgba(50,25,10,.45)';
        for (let i = 0; i < 26; i++) {
          g.lineWidth = R(1, 3);
          const x = R(0, S);
          g.beginPath();
          g.moveTo(x, 0);
          g.bezierCurveTo(x + R(-12, 12), S / 3, x + R(-12, 12), (S * 2) / 3, x, S);
          g.stroke();
        }
        grain(g, S, 800, 0.12);
      }),
      carreaux: texture(
        (g, S) => {
          fond(g, S, '#b3262a');
          const p = S / 4;
          g.fillStyle = 'rgba(18,10,12,.78)';
          for (let i = 0; i < 4; i++) {
            g.fillRect(i * p, 0, p / 2, S);
            g.fillRect(0, i * p, S, p / 2);
          }
          g.fillStyle = 'rgba(0,0,0,.35)';
          for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g.fillRect(i * p, j * p, p / 2, p / 2);
          fibres(g, S, 1500, 'rgba(0,0,0,.6)', 0.2, 4);
          fibres(g, S, 700, 'rgba(255,200,190,.6)', 0.12, 4);
          plis(g, S, 8, 'rgba(0,0,0,.7)', 0.18);
          grain(g, S, 900, 0.12);
        },
        256,
        [3, 2],
      ),
      jean: tissu('#33384a'),
      pantBrun: tissu('#4c3322'),
      pantSombre: tissu('#2e2a26'),
      peauClair: peau('#d79f78', '#a8684a', '#f2c4a0'),
      tatou: texture((g, S) => {
        fond(g, S, '#d49a72');
        taches(g, S, 30, '#a8684a', 6, 20, 0.12);
        g.strokeStyle = 'rgba(150,40,30,.75)';
        g.lineCap = 'round';
        for (let i = 0; i < 9; i++) {
          const x = R(0, S),
            y = R(0, S);
          g.lineWidth = R(2, 5);
          g.beginPath();
          g.arc(x, y, R(8, 24), R(0, 3), R(3, 6));
          g.stroke();
          g.beginPath();
          g.moveTo(x, y);
          g.quadraticCurveTo(x + R(-30, 30), y + R(-30, 30), x + R(-40, 40), y + R(-40, 40));
          g.stroke();
        }
        grain(g, S, 900, 0.08);
      }),
      rayures: texture((g, S) => {
        fond(g, S, '#ead8b8');
        g.fillStyle = '#a63128';
        for (let i = 0; i < 8; i++) g.fillRect(0, (i * S) / 8, S, S / 16);
        fibres(g, S, 1200, 'rgba(0,0,0,.5)', 0.16, 5);
        plis(g, S, 8, 'rgba(0,0,0,.6)', 0.14);
        taches(g, S, 10, '#5a4428', 6, 20, 0.2);
        grain(g, S, 900, 0.12);
      }),
      peauZ: peau('#8fa267', '#55663a', '#b8c98c', true),
      veste: tissu('#3a4466', (g, S) => {
        taches(g, S, 14, '#6b5a3a', 6, 20, 0.3);
        salir(g, S, 3);
      }),
      navy: tissu('#22294a'),
      pantNavy: tissu('#2a3150', (g, S) => salir(g, S, 2)),
      or: texture((g, S) => {
        const d = g.createLinearGradient(0, 0, S, S);
        d.addColorStop(0, '#f6d27a');
        d.addColorStop(1, '#9a6c22');
        g.fillStyle = d;
        g.fillRect(0, 0, S, S);
      }),
      sacoche: cuir('#8b6a40'),
      papier: texture((g, S) => {
        fond(g, S, '#efe5cf');
        g.strokeStyle = 'rgba(120,100,70,.5)';
        g.lineWidth = 3;
        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(S / 2, S * 0.55);
        g.lineTo(S, 0);
        g.stroke();
        grain(g, S, 500, 0.1);
      }),
      cire: texture((g, S) => {
        fond(g, S, '#b3261e');
        taches(g, S, 12, '#e0574a', 6, 20, 0.4);
        taches(g, S, 10, '#6e1210', 6, 18, 0.4);
      }),
      maillot: tissu('#8fae5c', (g, S) => {
        g.fillStyle = 'rgba(255,255,255,.85)';
        g.fillRect(0, S * 0.14, S, 7);
        g.fillRect(0, S * 0.2, S, 4);
        taches(g, S, 16, '#4c6a26', 6, 18, 0.35);
        salir(g, S, 3);
      }),
      blanc: tissu('#f1ece0'),
      rose: tissu('#e2508a'),
      short: tissu('#3c3f46'),
      blouse: tissu('#d9ccb4', (g, S) => {
        salir(g, S, 14);
        taches(g, S, 6, '#7f9660', 8, 16, 0.9);
      }),
      toque: tissu('#e2dacb', (g, S) => taches(g, S, 30, '#cfc6b6', 10, 30, 0.3)),
      bandana: tissu('#b2282a', (g, S) => {
        g.fillStyle = 'rgba(255,240,230,.85)';
        for (let x = 6; x < S; x += 22)
          for (let y = 6; y < S; y += 22) {
            g.beginPath();
            g.arc(x + (y % 44 ? 11 : 0), y, 2.5, 0, 6.3);
            g.fill();
          }
      }),
      pantGris: tissu('#5c5a58', (g, S) => salir(g, S, 4)),
      basket: tissu('#d8d2c6', (g, S) => taches(g, S, 8, '#5a4a3a', 6, 20, 0.3)),
    };
    // ================= Formes arrondies =================
    const degrade = (() => {
      const t = new THREE.DataTexture(new Uint8Array([85, 140, 190, 228]), 4, 1, THREE.LuminanceFormat);
      t.minFilter = t.magFilter = THREE.NearestFilter;
      t.needsUpdate = true;
      return t;
    })();
    const SPH = new THREE.SphereGeometry(1, 28, 20);
    const cacheGeo = new Map();
    const geo = (cle, faire) => {
      if (!cacheGeo.has(cle)) cacheGeo.set(cle, faire());
      return cacheGeo.get(cle);
    };
    // Gélule : articulation au centre de la demi-sphère du haut, pend vers le bas
    function gelule(long, r1, r2) {
      return geo(`g${long}_${r1}_${r2}`, () => {
        const pts = [];
        for (let i = 0; i <= 8; i++) {
          const a = -Math.PI / 2 + ((i / 8) * Math.PI) / 2;
          pts.push(new THREE.Vector2(r2 * Math.cos(a), -long + r2 * Math.sin(a)));
        }
        for (let i = 0; i <= 8; i++) {
          const a = ((i / 8) * Math.PI) / 2;
          pts.push(new THREE.Vector2(r1 * Math.cos(a), r1 * Math.sin(a)));
        }
        pts[0].x = 0.0001;
        pts[pts.length - 1].x = 0.0001;
        return new THREE.LatheGeometry(pts, 18);
      });
    }
    // Coussin : boîte aux bords entièrement arrondis
    function coussin(w, h, d, r) {
      return geo(`c${w}_${h}_${d}_${r}`, () => {
        const s = new THREE.Shape(),
          x = -w / 2 + r,
          y = -h / 2 + r,
          W = w - 2 * r,
          H = h - 2 * r,
          k = Math.min(W, H) * 0.25;
        s.moveTo(x + k, y);
        s.lineTo(x + W - k, y);
        s.quadraticCurveTo(x + W, y, x + W, y + k);
        s.lineTo(x + W, y + H - k);
        s.quadraticCurveTo(x + W, y + H, x + W - k, y + H);
        s.lineTo(x + k, y + H);
        s.quadraticCurveTo(x, y + H, x, y + H - k);
        s.lineTo(x, y + k);
        s.quadraticCurveTo(x, y, x + k, y);
        const g = new THREE.ExtrudeGeometry(s, {
          depth: Math.max(0.001, d - 2 * r),
          bevelEnabled: true,
          bevelThickness: r,
          bevelSize: r,
          bevelSegments: 4,
          curveSegments: 6,
        });
        g.center();
        return g;
      });
    }
    const tour = (pts, seg = 28) =>
      new THREE.LatheGeometry(
        pts.map(p => new THREE.Vector2(p[0], p[1])),
        seg,
      );
    const anneau = (r, e) => geo(`a${r}_${e}`, () => new THREE.TorusGeometry(r, e, 10, 28));
    const GEO = {
      bord: tour(
        [
          [0, 0],
          [0.2, -0.006],
          [0.33, 0],
          [0.4, 0.025],
          [0.44, 0.065],
          [0.435, 0.085],
          [0.405, 0.055],
          [0.33, 0.03],
          [0.2, 0.022],
          [0, 0.022],
        ],
        36,
      ),
      calotte: tour([
        [0, 0],
        [0.17, 0],
        [0.178, 0.08],
        [0.162, 0.16],
        [0.125, 0.21],
        [0.06, 0.2],
        [0.02, 0.17],
        [0, 0.17],
      ]),
      kepi: tour([
        [0, 0],
        [0.185, 0],
        [0.198, 0.06],
        [0.2, 0.11],
        [0.185, 0.135],
        [0, 0.14],
      ]),
      toque: tour([
        [0, 0],
        [0.17, 0],
        [0.175, 0.07],
        [0.2, 0.13],
        [0.25, 0.2],
        [0.26, 0.26],
        [0.22, 0.31],
        [0.12, 0.33],
        [0, 0.32],
      ]),
      casserole: tour([
        [0, 0],
        [0.1, 0],
        [0.12, 0.02],
        [0.128, 0.07],
        [0.118, 0.072],
        [0.108, 0.025],
        [0.09, 0.012],
        [0, 0.012],
      ]),
      lame: (() => {
        const s = new THREE.Shape();
        s.moveTo(-0.03, 0.045);
        s.lineTo(0.05, 0.045);
        s.quadraticCurveTo(0.12, 0.05, 0.16, 0.12);
        s.quadraticCurveTo(0.2, 0, 0.16, -0.12);
        s.quadraticCurveTo(0.12, -0.05, 0.05, -0.045);
        s.lineTo(-0.03, -0.045);
        s.quadraticCurveTo(-0.05, 0, -0.03, 0.045);
        const g = new THREE.ExtrudeGeometry(s, {
          depth: 0.012,
          bevelEnabled: true,
          bevelThickness: 0.008,
          bevelSize: 0.008,
          bevelSegments: 3,
          curveSegments: 10,
        });
        g.center();
        return g;
      })(),
    };

    // Contour sombre d'épaisseur constante : la forme gonflée le long des normales, vue de dos
    const cacheContour = new Map();
    function matContour(e) {
      const cle = Math.round(e * 2000);
      if (!cacheContour.has(cle))
        cacheContour.set(
          cle,
          new THREE.ShaderMaterial({
            uniforms: { e: { value: cle / 2000 } },
            side: THREE.BackSide,
            vertexShader:
              'uniform float e; void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * e, 1.0); }',
            fragmentShader: 'void main(){ gl_FragColor = vec4(0.09, 0.065, 0.05, 1.0); }',
          }),
        );
      return cacheContour.get(cle);
    }

    // Atelier : chaque personnage a ses propres matériaux (pour l'éclair quand il est touché)
    function atelier() {
      const mats = [],
        cache = new Map();
      const outil = { proj: true };
      const M = tex => {
        if (!cache.has(tex)) {
          const m = new THREE.MeshToonMaterial({ map: tex, gradientMap: degrade });
          mats.push(m);
          cache.set(tex, m);
        }
        return cache.get(tex);
      };
      const piece = (g, tex, parent, pos = [0, 0, 0], sc = [1, 1, 1], rot) => {
        const m = new THREE.Mesh(g, M(tex));
        m.position.set(...pos);
        m.scale.set(...sc);
        if (rot) m.rotation.set(...rot);
        m.castShadow = true;
        m.userData.proj = outil.proj;
        const moy = (sc[0] + sc[1] + sc[2]) / 3;
        m.add(new THREE.Mesh(g, matContour(EPAIS_CONTOUR / moy)));
        parent.add(m);
        return m;
      };
      const membre = (parent, x, y, z, long, r1, r2, tex) => {
        const pivot = G();
        pivot.position.set(x, y, z);
        parent.add(pivot);
        piece(gelule(long, r1, r2), tex, pivot);
        pivot.bout = long;
        return pivot;
      };
      const suite = (pivot, long, r1, r2, tex) => membre(pivot, 0, -pivot.bout, 0, long, r1, r2, tex);
      return Object.assign(outil, { mats, piece, membre, suite });
    }

    // Corps humain commun à tous : jambes, bassin, buste, tête, bras et mains
    function humain(a, c) {
      const L = c.larg || 1,
        V = c.ventre || 1;
      const racine = G(),
        chute = G(),
        corps = G();
      racine.add(chute);
      chute.add(corps);
      corps.position.y = 0.95;
      a.proj = false;
      const j = [-1, 1].map(s => {
        const cuisse = a.membre(corps, s * 0.13 * L, 0, 0, 0.42, 0.105 * Math.sqrt(L), 0.088, c.pant);
        const tibia = a.suite(cuisse, 0.4, 0.085, 0.068, c.tibia || c.pant);
        const pied = G();
        pied.position.y = -0.4;
        tibia.add(pied);
        a.piece(SPH, c.chaus, pied, [0, -0.05, 0.055], [0.085, 0.07, 0.145]);
        return { cuisse, tibia, pied };
      });
      a.piece(SPH, c.pant, corps, [0, 0, 0], [0.25 * L, 0.15, 0.18 * V]);
      a.proj = true;
      // bas du torse fixé au bassin : le buste peut se tordre sans laisser de trou
      if (c.rayures) a.piece(SPH, c.haut, corps, [0, 0.2, 0], [0.2, 0.31 * L, 0.21 * V], [0, 0, Math.PI / 2]);
      else a.piece(SPH, c.haut, corps, [0, 0.2, 0], [0.31 * L, 0.21 * V, 0.2], [Math.PI / 2, 0, 0]);
      const buste = G();
      buste.position.y = 0.04;
      buste.rotation.x = c.voute || 0;
      corps.add(buste);
      const torse = c.rayures
        ? a.piece(SPH, c.haut, buste, [0, 0.33, 0], [0.42, 0.36 * L, 0.24 * V], [0, 0, Math.PI / 2]) // pôle sur le côté : rayures parallèles vues de dessus
        : a.piece(SPH, c.haut, buste, [0, 0.33, 0], [0.36 * L, 0.24 * V, 0.42], [Math.PI / 2, 0, 0]); // pôle vers l'avant : rayures et carreaux bien orientés vus de dessus
      a.proj = false;
      a.piece(gelule(0.08, 0.07, 0.075), c.peau, buste, [0, 0.72, 0]);
      a.proj = true;
      const tete = G();
      tete.position.set(0, 0.82, 0.03);
      buste.add(tete);
      a.piece(SPH, c.peau, tete, [0, 0, 0], [0.158, 0.168, 0.165]);
      a.piece(SPH, c.peau, tete, [0, -0.03, 0.14], [0.035, 0.04, 0.035]); // nez
      [-1, 1].forEach(s => a.piece(SPH, c.peau, tete, [s * 0.155, -0.01, 0], [0.03, 0.045, 0.025])); // oreilles
      const clav = [];
      const bras = [-1, 1].map(s => {
        const cl = G();
        cl.position.set(s * 0.29 * L, 0.56, 0);
        buste.add(cl);
        clav.push(cl); // clavicule : hausse les épaules
        a.piece(SPH, c.epaules || c.haut, cl, [0, 0, 0], [0.15, 0.115, 0.15]);
        const epaule = a.membre(cl, s * 0.08 * L, 0, 0, 0.27, 0.085 * Math.sqrt(L), 0.07, c.bras);
        epaule.rotation.z = s * 0.1;
        const coude = a.suite(epaule, 0.25, 0.068, 0.056, c.avantBras);
        const main = G();
        main.position.y = -0.3;
        coude.add(main);
        a.piece(SPH, c.mains, main, [0, 0, 0], [0.068, 0.058, 0.082]);
        a.piece(SPH, c.mains, main, [s * -0.05, 0.01, 0.035], [0.025, 0.045, 0.025]); // pouce
        return { epaule, coude, main, s };
      });
      return {
        racine,
        chute,
        corps,
        buste,
        torse,
        tete,
        j,
        bras,
        clav,
        mats: a.mats,
        voute: c.voute || 0,
        rayures: !!c.rayures,
      };
    }
    function griffes(a, p, tex) {
      p.bras.forEach(b =>
        [-0.035, 0, 0.035].forEach((dx, i) => {
          const d = a.membre(b.main, dx, -0.04, 0.01, 0.06, 0.018, 0.01, tex);
          d.rotation.z = (i - 1) * 0.25;
          d.rotation.x = 0.3;
        }),
      );
    }

    // ================= Les personnages =================
    // Textures de détail en plus des textures de base
    Object.assign(T, {
      tresse: texture((g, S) => {
        // mèches croisées en chevrons
        fond(g, S, '#6e2416');
        for (let y = 0; y < S; y += 32)
          for (let x = 0; x < S; x += 32) {
            const d = g.createLinearGradient(x, y, x + 16, y + 28);
            d.addColorStop(0, '#e2794a');
            d.addColorStop(0.5, '#b4432a');
            d.addColorStop(1, '#7a2614');
            g.fillStyle = d;
            g.beginPath();
            g.ellipse(x + 10, y + 16, 9, 15, -0.5, 0, 6.3);
            g.fill();
            g.beginPath();
            g.ellipse(x + 24, y + 16, 9, 15, 0.5, 0, 6.3);
            g.fill();
          }
        fibres(g, S, 500, '#f0a070', 0.35, 14, Math.PI / 2 - 0.4);
      }),
      dentelle: tissu('#f4ecda', (g, S) => {
        g.fillStyle = 'rgba(120,96,64,.35)';
        for (let x = 4; x < S; x += 12)
          for (let y = 4; y < S; y += 12) {
            g.beginPath();
            g.arc(x, y, 2, 0, 6.3);
            g.fill();
          }
      }),
      lacage: texture((g, S) => {
        fond(g, S, '#6e4628');
        taches(g, S, 24, 'rgba(0,0,0,.6)', 8, 30, 0.2);
        grain(g, S, 1200, 0.14);
        g.strokeStyle = '#d8c09a';
        g.lineWidth = 3;
        for (let y = 10; y < S; y += 26) {
          g.beginPath();
          g.moveTo(S * 0.4, y);
          g.lineTo(S * 0.6, y + 13);
          g.moveTo(S * 0.6, y);
          g.lineTo(S * 0.4, y + 13);
          g.stroke();
        }
        couture(g, S, S * 0.1, '#e8cfa0');
        couture(g, S, S * 0.9, '#e8cfa0');
      }),
      feutre: texture((g, S) => {
        fond(g, S, '#7c5434');
        taches(g, S, 50, '#5a3a22', 10, 40, 0.3);
        taches(g, S, 40, '#a2774d', 8, 30, 0.22);
        fibres(g, S, 700, 'rgba(0,0,0,.6)', 0.15, 6);
        grain(g, S, 1400, 0.12);
        g.strokeStyle = 'rgba(60,36,20,.35)';
        g.lineWidth = 6;
        g.beginPath();
        g.moveTo(0, S * 0.55);
        g.bezierCurveTo(S * 0.3, S * 0.5, S * 0.7, S * 0.62, S, S * 0.56);
        g.stroke(); // trace de sueur
      }),
      rouge: tissu('#a63128'),
      cheveuxBlondRaie: texture((g, S) => {
        fond(g, S, '#e6be55');
        fibres(g, S, 1200, '#a87a26', 0.7, 50, Math.PI / 2);
        fibres(g, S, 700, '#fbe39a', 0.6, 40, Math.PI / 2);
        g.fillStyle = 'rgba(140,100,30,.6)';
        g.fillRect(S / 2 - 2, 0, 4, S);
      }),
      plaie: texture((g, S) => {
        fond(g, S, '#5a1410');
        taches(g, S, 20, '#8e2a1e', 6, 20, 0.8);
        taches(g, S, 10, '#2a0604', 4, 12, 0.8);
      }),
      scotch: tissu('#2a2422'),
      laiton: texture((g, S) => {
        const d = g.createLinearGradient(0, 0, S, 0);
        d.addColorStop(0, '#8a6420');
        d.addColorStop(0.5, '#f2d07a');
        d.addColorStop(1, '#7a5418');
        g.fillStyle = d;
        g.fillRect(0, 0, S, S);
        grain(g, S, 300, 0.2);
      }),
      chaussette: tissu('#ece6da', (g, S) => {
        g.fillStyle = 'rgba(60,140,80,.8)';
        g.fillRect(0, S * 0.2, S, 8);
        salir(g, S, 2);
      }),
    });

    // Ceinture avec boucle, visible en vue de 3/4
    function ceinture(a, p, r, tex) {
      a.piece(anneau(r, 0.028), tex || T.cuirFonce, p.corps, [0, 0.08, 0], [1, 1, 0.75], [Math.PI / 2, 0, 0]);
      a.piece(coussin(0.07, 0.06, 0.02, 0.008), T.laiton, p.corps, [0, 0.08, r * 0.75 + 0.01]);
    }
    // Revolver : canon, barillet, carcasse, chien, pontet et crosse
    function revolver(a, main) {
      const r = G();
      r.position.set(0, -0.02, 0.03);
      main.add(r);
      a.membre(r, 0, -0.06, 0, 0.17, 0.02, 0.018, T.metal);
      a.piece(SPH, T.metal, r, [0, -0.25, 0.022], [0.008, 0.012, 0.01]); // guidon
      a.piece(gelule(0.06, 0.036, 0.036), T.metal, r, [0, -0.02, 0.012]);
      a.piece(coussin(0.05, 0.1, 0.05, 0.018), T.metal, r, [0, -0.03, 0.0]);
      a.piece(SPH, T.metal, r, [0, 0.03, 0.03], [0.012, 0.02, 0.018], [0.5, 0, 0]); // chien
      a.piece(anneau(0.025, 0.006), T.metal, r, [0, 0.0, -0.03], [1, 1, 1], [0, Math.PI / 2, 0]);
      a.piece(SPH, T.bois, r, [0, 0.06, -0.03], [0.024, 0.06, 0.03], [-0.5, 0, 0]);
      a.piece(SPH, T.metal, r, [0, 0.11, -0.055], [0.022, 0.012, 0.022]);
      return r;
    }

    function pistolero() {
      const a = atelier();
      const p = humain(a, {
        haut: T.chemise,
        bras: T.chemise,
        avantBras: T.chemise,
        mains: T.peauClair,
        peau: T.peauClair,
        pant: T.pantBrun,
        chaus: T.cuirFonce,
      });
      // jabot à volants : trois rangs, dentelle et crème en alternance
      for (let r = 0; r < 3; r++)
        for (let i = 0; i < 22; i++) {
          const an = (i / 22) * Math.PI * 2 + r * 0.14;
          a.piece(
            SPH,
            r % 2 ? T.dentelle : T.volant,
            p.buste,
            [Math.cos(an) * (0.26 + 0.055 * r), 0.67 - r * 0.055, Math.sin(an) * (0.18 + 0.05 * r)],
            [0.07, 0.03, 0.06],
            [0, -an, 0.35 + r * 0.1],
          );
        }
      ceinture(a, p, 0.26);
      p.bras.forEach(b => {
        a.piece(SPH, T.chemise, b.epaule, [0, -0.1, 0], [0.11, 0.14, 0.11]); // manche bouffante
        a.piece(gelule(0.15, 0.07, 0.082), T.lacage, b.coude, [0, -0.07, 0]); // brassard lacé
        for (let k = 0; k < 4; k++)
          a.piece(
            SPH,
            T.metal,
            b.coude,
            [Math.sin(k * 1.6 - 2.4) * 0.08, -0.1 - (k % 2) * 0.06, Math.cos(k * 1.6 - 2.4) * 0.08],
            [0.012, 0.012, 0.012],
          );
        revolver(a, b.main);
        b.bouche = new THREE.Object3D();
        b.bouche.position.set(0, -0.27, 0.03);
        b.main.add(b.bouche);
        b.epaule.rotation.x = -1.3;
      });
      // chapeau : bord relevé sur les côtés, calotte pincée, bande et boucle
      const ch = G();
      ch.position.y = 0.1;
      ch.scale.set(0.82, 0.82, 0.76);
      p.tete.add(ch);
      a.piece(GEO.bord, T.feutre, ch);
      const cal = a.piece(GEO.calotte, T.feutre, ch, [0, 0.012, 0], [1, 1, 0.9]);
      [-1, 1].forEach(s => a.piece(SPH, T.feutre, ch, [s * 0.06, 0.19, 0.1], [0.05, 0.03, 0.05])); // pincements
      a.piece(anneau(0.172, 0.022), T.bande, ch, [0, 0.05, 0], [1, 1, 0.9], [Math.PI / 2, 0, 0]);
      a.piece(coussin(0.05, 0.04, 0.015, 0.006), T.laiton, ch, [0.12, 0.05, 0.1], [1, 1, 1], [0, 0.9, 0]);
      // tresse : maillons tressés, lien de cuir et pointe
      p.tresse = [];
      let par = p.tete;
      for (let i = 0; i < 8; i++) {
        const g = G();
        g.position.set(0, i ? -0.06 : -0.02, i ? -0.014 : -0.165);
        par.add(g);
        a.piece(SPH, T.tresse, g, [0, 0, 0], [0.052 - i * 0.003, 0.042, 0.05 - i * 0.003], [0, i % 2 ? 0.3 : -0.3, 0]);
        p.tresse.push(g);
        par = g;
      }
      a.piece(anneau(0.03, 0.01), T.cuir, par, [0, -0.04, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      a.piece(SPH, T.roux, par, [0, -0.08, 0], [0.035, 0.05, 0.035]);
      return p;
    }

    function bucheron() {
      const a = atelier();
      const p = humain(a, {
        haut: T.carreaux,
        bras: T.carreaux,
        avantBras: T.peauClair,
        mains: T.peauClair,
        peau: T.peauClair,
        pant: T.jean,
        chaus: T.cuirFonce,
        larg: 1.08,
        ventre: 1.05,
      });
      // bretelles devant et derrière, pinces en laiton
      [-1, 1].forEach(s => {
        a.piece(SPH, T.cuir, p.buste, [s * 0.14, 0.34, 0], [0.045, 0.43, 0.254]);
        a.piece(coussin(0.06, 0.05, 0.02, 0.008), T.laiton, p.buste, [s * 0.14, 0.2, 0.24]);
        a.piece(coussin(0.06, 0.05, 0.02, 0.008), T.laiton, p.buste, [s * 0.14, 0.2, -0.24]);
      });
      a.piece(anneau(0.075, 0.03), T.carreaux, p.buste, [0, 0.7, 0], [1, 1, 1], [Math.PI / 2, 0, 0]); // col
      ceinture(a, p, 0.28);
      p.bras.forEach(b => {
        a.piece(anneau(0.072, 0.03), T.carreaux, b.coude, [0, -0.02, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
        a.piece(anneau(0.07, 0.025), T.carreaux, b.coude, [0, -0.06, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      });
      // cheveux bruns tirés en chignon
      a.piece(SPH, T.noirs, p.tete, [0, 0.035, -0.012], [0.17, 0.152, 0.174]);
      a.piece(SPH, T.noirs, p.tete, [0, 0.13, -0.1], [0.08, 0.07, 0.08]);
      a.piece(anneau(0.05, 0.014), T.cuirFonce, p.tete, [0, 0.11, -0.06], [1, 1, 1], [0.9, 0, 0]);
      [-1, 1].forEach(s => a.piece(SPH, T.noirs, p.tete, [s * 0.15, -0.04, 0.03], [0.02, 0.06, 0.03])); // favoris
      // hache : manche gainé, fer avec tranchant plus clair
      const h = G();
      h.position.set(0, 0.05, 0);
      p.bras[1].main.add(h);
      a.membre(h, 0, 0.14, 0, 0.66, 0.026, 0.03, T.bois);
      for (let k = 0; k < 3; k++)
        a.piece(anneau(0.029, 0.008), T.scotch, h, [0, 0.05 - k * 0.03, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      a.piece(GEO.lame, T.metal, h, [0.08, -0.5, 0]);
      a.piece(GEO.lame, T.metal, h, [0.1, -0.5, 0], [0.55, 0.96, 1.3]);
      a.piece(SPH, T.cuirFonce, h, [0, -0.5, 0], [0.04, 0.06, 0.035]);
      p.hache = h;
      return p;
    }

    function lanceFlammes() {
      const a = atelier();
      const p = humain(a, {
        haut: T.rayures,
        epaules: T.tatou,
        bras: T.tatou,
        avantBras: T.tatou,
        mains: T.peauClair,
        peau: T.peauClair,
        pant: T.pantSombre,
        chaus: T.cuirFonce,
        larg: 1.3,
        ventre: 1.3,
        rayures: true,
      });
      // bretelles du débardeur et gros deltoïdes
      [-1, 1].forEach(s => {
        a.piece(anneau(0.2, 0.035), T.rouge, p.buste, [s * 0.17, 0.44, 0], [1, 1, 1.15], [0, Math.PI / 2, 0]);
        a.piece(SPH, T.tatou, p.buste, [s * 0.44, 0.53, 0], [0.15, 0.13, 0.15]);
      });
      ceinture(a, p, 0.34);
      // crâne rasé, sourcils, moustache et longue barbe tressée avec anneaux
      [-1, 1].forEach(s =>
        a.piece(SPH, T.barbe, p.tete, [s * 0.06, 0.05, 0.14], [0.045, 0.015, 0.02], [0, 0, s * -0.2]),
      );
      [-1, 1].forEach(s => a.piece(SPH, T.barbe, p.tete, [s * 0.05, -0.06, 0.15], [0.06, 0.02, 0.03], [0, 0, s * 0.4]));
      a.piece(SPH, T.barbe, p.tete, [0, -0.07, 0.1], [0.12, 0.08, 0.085]);
      let par = p.tete;
      p.barbe = [];
      for (let i = 0; i < 9; i++) {
        const g = G();
        g.position.set(0, i ? -0.028 : -0.11, i ? 0.05 : 0.12);
        par.add(g);
        a.piece(SPH, T.barbe, g, [0, 0, 0], [0.06 - i * 0.004, 0.036, 0.055], [0, i % 2 ? 0.3 : -0.3, 0]);
        if (i === 3 || i === 6) a.piece(anneau(0.05 - i * 0.004, 0.01), T.metal, g, [0, 0, 0], [1, 1, 1], [0, 0, 0]);
        p.barbe.push(g);
        par = g;
      }
      // bracelet clouté et lance-flammes : poignée gainée, réservoir, buse évasée, veilleuse
      const b = p.bras[0];
      a.piece(anneau(0.064, 0.024), T.cuirFonce, b.coude, [0, -0.2, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      for (let k = 0; k < 7; k++)
        a.piece(
          SPH,
          T.metal,
          b.coude,
          [Math.cos(k * 0.9) * 0.088, -0.2, Math.sin(k * 0.9) * 0.088],
          [0.014, 0.02, 0.014],
        );
      a.membre(b.main, 0, 0.03, 0.02, 0.16, 0.032, 0.032, T.scotch);
      a.membre(b.main, 0, -0.12, 0.02, 0.12, 0.03, 0.036, T.metal);
      a.piece(
        tour([
          [0, 0],
          [0.04, 0],
          [0.055, -0.06],
          [0.05, -0.065],
          [0, -0.04],
        ]),
        T.metal,
        b.main,
        [0, -0.26, 0.02],
      );
      a.piece(gelule(0.12, 0.045, 0.045), T.rouge, b.main, [0, -0.05, 0.09]);
      b.bouche = new THREE.Object3D();
      b.bouche.position.set(0, -0.34, 0.02);
      b.main.add(b.bouche);
      b.epaule.rotation.x = -1.25;
      p.bras[1].epaule.rotation.x = -0.3;
      return p;
    }

    function facteur() {
      const a = atelier();
      const p = humain(a, {
        haut: T.veste,
        bras: T.veste,
        avantBras: T.veste,
        mains: T.peauZ,
        peau: T.peauZ,
        pant: T.pantNavy,
        chaus: T.cuirFonce,
        voute: 0.45,
      });
      a.piece(anneau(0.085, 0.035), T.navy, p.buste, [0, 0.7, 0.01], [1, 1, 1], [Math.PI / 2, 0, 0]); // col
      for (let i = 0; i < 4; i++) a.piece(SPH, T.laiton, p.buste, [0.03, 0.16 + i * 0.1, 0.232], [0.022, 0.022, 0.015]);
      [-1, 1].forEach(s =>
        a.piece(coussin(0.11, 0.06, 0.02, 0.008), T.navy, p.buste, [s * 0.14, 0.5, 0.2], [1, 1, 1], [-0.5, 0, 0]),
      ); // rabats de poche
      // bandoulière avec boucle, sacoche, rabat, enveloppe et cachet
      a.piece(SPH, T.cuir, p.buste, [0, 0.38, 0], [0.03, 0.44, 0.255], [0, 0, 0.75]);
      a.piece(coussin(0.06, 0.05, 0.02, 0.008), T.laiton, p.buste, [0.12, 0.5, 0.22], [1, 1, 1], [-0.4, 0, 0.75]);
      a.piece(coussin(0.44, 0.32, 0.13, 0.04), T.sacoche, p.buste, [0, 0.37, -0.27]);
      a.piece(coussin(0.45, 0.17, 0.04, 0.015), T.sacoche, p.buste, [0, 0.47, -0.34], [1, 1, 1], [-0.15, 0, 0]);
      a.piece(coussin(0.2, 0.12, 0.016, 0.006), T.papier, p.buste, [0, 0.41, -0.365]);
      a.piece(SPH, T.cire, p.buste, [0, 0.41, -0.377], [0.032, 0.032, 0.012]);
      // manches déchirées : lambeaux autour des poignets
      p.bras.forEach(b => {
        for (let k = 0; k < 5; k++)
          a.piece(
            SPH,
            T.veste,
            b.coude,
            [Math.cos(k * 1.26) * 0.06, -0.24 - (k % 2) * 0.025, Math.sin(k * 1.26) * 0.06],
            [0.03, 0.045, 0.03],
          );
      });
      // képi avec insigne, visière, cheveux gris en bataille
      a.piece(GEO.kepi, T.navy, p.tete, [0, 0.06, -0.01]);
      a.piece(anneau(0.195, 0.012), T.scotch, p.tete, [0, 0.08, -0.01], [1, 1, 1], [Math.PI / 2, 0, 0]);
      a.piece(SPH, T.laiton, p.tete, [0, 0.13, 0.17], [0.03, 0.03, 0.012]);
      a.piece(SPH, T.navy, p.tete, [0, 0.08, 0.16], [0.13, 0.018, 0.085]);
      for (let i = 0; i < 12; i++) {
        const an = Math.PI * (0.1 + i * 0.07) + Math.PI;
        a.piece(
          SPH,
          T.gris,
          p.tete,
          [Math.cos(an) * 0.17, 0.02 + (i % 3) * 0.015, Math.sin(an) * 0.17 + 0.01],
          [0.05, 0.035, 0.05],
          [i * 0.4, 0, 0.3],
        );
      }
      a.piece(SPH, T.plaie, p.tete, [0.08, -0.02, 0.12], [0.04, 0.03, 0.02]);
      griffes(a, p, T.peauZ);
      p.type = 'facteur';
      return p;
    }

    function coureuse() {
      const a = atelier();
      const p = humain(a, {
        haut: T.maillot,
        bras: T.maillot,
        avantBras: T.peauZ,
        mains: T.peauZ,
        peau: T.peauZ,
        pant: T.short,
        tibia: T.peauZ,
        chaus: T.basket,
        larg: 0.9,
        ventre: 0.9,
        voute: 0.55,
      });
      p.bras.forEach(b => {
        a.piece(anneau(0.07, 0.02), T.blanc, b.coude, [0, -0.01, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
        a.piece(anneau(0.058, 0.026), T.rose, b.coude, [0, -0.22, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      });
      a.piece(SPH, T.plaie, p.bras[0].coude, [0.05, -0.1, 0.03], [0.03, 0.05, 0.025]); // morsure
      p.j.forEach(j => a.piece(gelule(0.1, 0.072, 0.07), T.chaussette, j.tibia, [0, -0.3, 0]));
      // cheveux avec raie, bandeau rose, chouchou et queue de cheval épaisse
      a.piece(SPH, T.cheveuxBlondRaie, p.tete, [0, 0.035, -0.01], [0.168, 0.152, 0.172]);
      a.piece(anneau(0.164, 0.024), T.rose, p.tete, [0, 0.02, 0], [1, 1, 1], [Math.PI / 2 - 0.25, 0, 0]);
      a.piece(anneau(0.04, 0.02), T.rose, p.tete, [0, 0.08, -0.16], [1, 1, 1], [0.4, 0, 0]);
      p.queue = [];
      let par = p.tete;
      for (let i = 0; i < 7; i++) {
        const g = G();
        g.position.set(0, i ? -0.012 : 0.08, i ? -0.055 : -0.18);
        par.add(g);
        a.piece(SPH, T.blond, g, [0, 0, 0], [0.062 - i * 0.006, 0.05 - i * 0.003, 0.075]);
        p.queue.push(g);
        par = g;
      }
      a.piece(SPH, T.blond, par, [0, -0.02, -0.04], [0.02, 0.02, 0.05], [0.6, 0, 0]);
      griffes(a, p, T.peauZ);
      p.type = 'coureuse';
      return p;
    }

    function gros() {
      const a = atelier();
      const p = humain(a, {
        haut: T.blouse,
        bras: T.blouse,
        avantBras: T.peauZ,
        mains: T.peauZ,
        peau: T.peauZ,
        pant: T.pantGris,
        chaus: T.cuirFonce,
        larg: 1.45,
        ventre: 1.6,
        voute: 0.2,
      });
      // trous dans la blouse : chair verte qui dépasse, bord déchiré
      [
        [0.32, 0.3, 0.2],
        [-0.36, 0.42, 0.1],
        [0.1, 0.5, -0.3],
        [-0.2, 0.2, 0.3],
      ].forEach(([x, y, z]) => {
        a.piece(SPH, T.peauZ, p.buste, [x, y, z], [0.07, 0.06, 0.06]);
        for (let k = 0; k < 6; k++)
          a.piece(
            SPH,
            T.blouse,
            p.buste,
            [x + Math.cos(k) * 0.065, y + Math.sin(k) * 0.06, z * 1.02],
            [0.025, 0.02, 0.02],
          );
      });
      for (let i = 0; i < 4; i++) a.piece(SPH, T.blanc, p.buste, [0, 0.18 + i * 0.1, 0.385], [0.02, 0.02, 0.01]); // boutons
      // toque nuageuse avec bandeau
      a.piece(GEO.toque, T.toque, p.tete, [0, 0.08, -0.01]);
      a.piece(anneau(0.18, 0.03), T.toque, p.tete, [0, 0.1, -0.01], [1, 1, 1], [Math.PI / 2, 0, 0]);
      for (let i = 0; i < 7; i++) {
        const an = (i / 7) * Math.PI * 2;
        a.piece(
          SPH,
          T.toque,
          p.tete,
          [Math.cos(an) * 0.15, 0.34 + (i % 2) * 0.02, Math.sin(an) * 0.15],
          [0.11, 0.085, 0.11],
        );
      }
      a.piece(SPH, T.toque, p.tete, [0, 0.4, 0], [0.12, 0.07, 0.12]);
      // bandana noué derrière, pans qui pendent
      a.piece(anneau(0.15, 0.045), T.bandana, p.buste, [0, 0.69, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      a.piece(SPH, T.bandana, p.buste, [0, 0.71, -0.17], [0.05, 0.04, 0.04]);
      [-1, 1].forEach(s =>
        a.piece(SPH, T.bandana, p.buste, [s * 0.08, 0.72, -0.19], [0.08, 0.035, 0.04], [0, 0, s * 0.45]),
      );
      [-1, 1].forEach(s =>
        a.piece(SPH, T.bandana, p.buste, [s * 0.03, 0.64, -0.2], [0.025, 0.07, 0.02], [0, 0, s * 0.3]),
      );
      // casserole cabossée tenue par le manche
      const b = p.bras[1];
      a.membre(b.main, 0, 0.02, 0.03, 0.22, 0.016, 0.018, T.metal);
      a.piece(SPH, T.bois, b.main, [0, 0.0, 0.03], [0.022, 0.05, 0.022]);
      a.piece(GEO.casserole, T.metal, b.main, [0, -0.32, 0.02], [1, 1, 1], [Math.PI / 2, 0, 0]);
      griffes(a, p, T.peauZ);
      p.type = 'gros';
      return p;
    }

    const ZTYPES = {
      facteur: {
        faire: facteur,
        pv: 3,
        v: 0.55,
        cadence: 4.2,
        foulee: 0.4,
        genou: 0.7,
        rebond: 0.03,
        roulis: 0.08,
        torsion: 0.12,
        flex: 0.12,
        ecart: 0.03,
        balance: 0.02,
        brasX: -1.35,
        balBras: 0.12,
        ecartBras: 0.12,
      },
      coureuse: {
        faire: coureuse,
        pv: 2,
        v: 1.25,
        cadence: 9,
        foulee: 0.75,
        genou: 1.4,
        rebond: 0.07,
        roulis: 0.05,
        torsion: 0.25,
        flex: 0.2,
        ecart: 0,
        balance: 0,
        brasX: -1.0,
        balBras: 0.5,
        ecartBras: 0.25,
      },
      gros: {
        faire: gros,
        pv: 7,
        v: 0.32,
        cadence: 2.4,
        foulee: 0.3,
        genou: 0.4,
        rebond: 0.025,
        roulis: 0.16,
        torsion: 0.08,
        flex: 0.08,
        ecart: 0.12,
        balance: 0.06,
        brasX: -1.1,
        balBras: 0.2,
        ecartBras: 0.35,
      },
    };

    // ================= Animations souples =================
    // Attaques : le facteur griffe d'un bras puis de l'autre, la coureuse s'acharne et mord, le gros abat sa casserole à deux mains
    const ATTAQUES = {
      facteur: { freq: 5, leve: 0.9, abat: 0.45, balaye: 0.35, penche: 0.3, torsion: 0.3, raideur: 110 },
      coureuse: {
        freq: 9,
        leve: 0.7,
        abat: 0.5,
        balaye: 0.45,
        penche: 0.35,
        torsion: 0.4,
        raideur: 170,
        morsure: true,
      },
      gros: { freq: 3.2, leve: 1.4, abat: 0.5, balaye: 0.1, penche: 0.45, torsion: 0, raideur: 120, deuxMains: true },
    };
    // Ressort amorti : chaque articulation suit sa cible avec inertie et un léger rebond,
    // ce qui casse l'effet « robot » des mouvements calculés directement.
    function ressort(p, nom, v0, k, amort) {
      p.rs = p.rs || {};
      return p.rs[nom] || (p.rs[nom] = { v: v0, vit: 0, k, amort, cible: v0 });
    }
    function vers(p, nom, cible, dt, k = 120, amort = 14) {
      const r = ressort(p, nom, cible, k, amort);
      r.cible = cible;
      r.k = k;
      r.amort = amort;
      const n = Math.max(1, Math.ceil(dt * 120)),
        h = dt / n;
      for (let i = 0; i < n; i++) {
        r.vit += (r.k * (r.cible - r.v) - r.amort * r.vit) * h;
        r.v += r.vit * h;
      }
      return r.v;
    }
    const pousser = (p, nom, impulsion) => {
      if (p.rs && p.rs[nom]) p.rs[nom].vit += impulsion;
    };
    // Bruit doux : petites variations qui ne se répètent jamais à l'identique
    let bruit = (t, s) =>
      Math.sin(t * 1.31 + s) * 0.5 + Math.sin(t * 2.73 + s * 1.7) * 0.3 + Math.sin(t * 5.17 + s * 2.3) * 0.2;
    const lisse = k => k * k * (3 - 2 * k);
    const borne = (v, a, b) => Math.max(a, Math.min(b, v));

    // Mèches, queue de cheval et barbe : chaque maillon suit le précédent avec retard
    function chaine(p, liens, nom, dt, o) {
      if (!liens || !liens.length) return;
      const anc = new THREE.Vector3();
      liens[0].parent.getWorldPosition(anc);
      const st =
        p['ch' + nom] || (p['ch' + nom] = { prev: anc.clone(), vel: new THREE.Vector3(), acc: new THREE.Vector3() });
      if (dt > 0) {
        const v = anc.clone().sub(st.prev).divideScalar(dt);
        st.acc.copy(v).sub(st.vel).divideScalar(dt).clampLength(0, 25);
        st.vel.copy(v);
        st.prev.copy(anc);
      }
      const yaw = p.racine.rotation.y + (p.buste ? p.buste.rotation.y : 0),
        c = Math.cos(yaw),
        s = Math.sin(yaw);
      const aAv = st.acc.x * s + st.acc.z * c,
        aLat = st.acc.x * c - st.acc.z * s;
      const vAv = st.vel.x * s + st.vel.z * c;
      liens.forEach((l, i) => {
        const f = 1 + i * 0.3;
        const cx = o.base + (aAv * o.inertie + vAv * o.vent) * f;
        const cz = -aLat * o.inertie * f;
        l.rotation.x = vers(p, nom + 'x' + i, borne(cx, -0.9, 0.9), dt, o.k * (1 - i * 0.06), o.amort);
        l.rotation.z = vers(p, nom + 'z' + i, borne(cz, -0.7, 0.7), dt, o.k * (1 - i * 0.06), o.amort);
      });
    }

    // Ventre et torse qui rebondissent avec les pas
    function rebondTorse(p, dt, force) {
      const tr = p.torse;
      if (!tr.userData.base) tr.userData.base = tr.scale.clone();
      const y = p.corps.position.y,
        st = p.stTorse || (p.stTorse = { y, vy: 0 });
      if (dt > 0) {
        const vy = (y - st.y) / dt;
        pousser(p, 'ventre', -(vy - st.vy) * force);
        st.vy = vy;
        st.y = y;
      }
      const j = vers(p, 'ventre', 0, dt, 160, 7),
        b = tr.userData.base;
      if (p.rayures) tr.scale.set(b.x * (1 + j), b.y * (1 - j * 0.5), b.z * (1 - j * 0.5));
      else tr.scale.set(b.x * (1 - j * 0.5), b.y * (1 - j * 0.5), b.z * (1 + j));
    }

    // Démarche commune : bassin qui tourne, jambes, pieds à plat, buste en contre-rotation
    function demarche(p, ph, o, dt) {
      const s = Math.sin(ph),
        c = Math.cos(ph);
      [0, 1].forEach(i => {
        const sg = i ? -1 : 1,
          sw = s * sg,
          cw = c * sg;
        const boite = o.boite && i === o.cote ? 1 - o.boite * 0.6 : 1;
        const cuisse = sw * o.foulee * boite - o.flex * 0.5;
        const genou = Math.max(0, cw) * o.genou * boite + o.flex + Math.max(0, -sw) * 0.15;
        p.j[i].cuisse.rotation.x = vers(p, 'cu' + i, cuisse, dt, 260, 24);
        p.j[i].tibia.rotation.x = vers(p, 'ge' + i, genou, dt, 260, 24);
        p.j[i].cuisse.rotation.z = vers(p, 'cz' + i, (i ? 1 : -1) * o.ecart - (p.corps.rotation.z || 0), dt, 200, 22);
        p.j[i].pied.rotation.x =
          -(p.j[i].cuisse.rotation.x + p.j[i].tibia.rotation.x) * 0.85 - (p.buste === undefined ? 0 : 0);
      });
      const boiteDrop = o.boite ? Math.max(0, o.cote ? -s : s) * o.boite * 0.06 : 0;
      p.corps.position.y = vers(p, 'hy', 0.95 - o.flex * 0.14 - o.rebond * Math.abs(s) - boiteDrop, dt, 300, 26);
      p.corps.position.x = vers(p, 'hx', o.balance * s, dt, 120, 14);
      p.corps.rotation.y = vers(p, 'hry', s * o.torsion, dt, 160, 16);
      p.corps.rotation.z = vers(p, 'hrz', -s * o.roulis + boiteDrop * 2 * (o.cote ? -1 : 1), dt, 140, 14);
      p.buste.rotation.y = vers(p, 'bry', -s * o.torsion * 1.5 + (o.torsionHaut || 0), dt, 120, 13);
      p.buste.rotation.z = vers(p, 'brz', s * o.roulis * 0.7, dt, 110, 11);
      p.buste.rotation.x =
        vers(p, 'brx', o.penche + Math.abs(s) * o.rebond * 1.8, dt, 120, 12) +
        (p.rs && p.rs.recul ? vers(p, 'recul', 0, dt, 90, 9) : 0);
    }

    // Caractère propre à chaque zombie : boiterie, tête penchée, bras mort, tics
    function personnalite() {
      return {
        boite: Math.random() < 0.45 ? R(0.3, 0.9) : 0,
        cote: Math.random() < 0.5 ? 0 : 1,
        inclin: R(-0.35, 0.35),
        brasMou: Math.random() < 0.35 ? (Math.random() < 0.5 ? 0 : 1) : -1,
        rythme: R(0.85, 1.15),
        graine: R(0, 50),
        tic: 0,
      };
    }
    function animZombie(z, dt, t) {
      const c = ZTYPES[z.type],
        P = z.perso || (z.perso = personnalite());
      ressort(z, 'recul', 0, 90, 9);
      if (z.titube > 0) z.titube -= dt;
      const cad = c.cadence * P.rythme * (z.marche ? 1 : 0.3) * (z.titube > 0 ? 0.25 : 1);
      z.phase += dt * cad * (BOUCLE ? 1 : 1 + 0.35 * Math.sin(z.phase * 2 + P.graine)); // pas irréguliers
      demarche(
        z,
        z.phase,
        {
          foulee: z.marche ? c.foulee : 0.05,
          genou: c.genou,
          rebond: c.rebond,
          roulis: c.roulis,
          torsion: c.torsion,
          flex: c.flex,
          boite: P.boite,
          cote: P.cote,
          ecart: c.ecart,
          balance: c.balance,
          penche: z.voute,
        },
        dt,
      );
      // tête : penchée, ballottée en retard, secouée par des tics
      if (t > P.tic) {
        pousser(z, 'tz', R(-7, 7));
        pousser(z, 'tx', R(-5, 5));
        P.tic = t + R(1.2, 4);
      }
      z.tete.rotation.z = vers(z, 'tz', P.inclin + Math.sin(z.phase) * c.roulis * 2, dt, 55, 5);
      z.tete.rotation.x = vers(z, 'tx', -0.2 - z.voute * 0.55 + Math.abs(Math.sin(z.phase)) * 0.1, dt, 55, 6);
      z.tete.rotation.y = vers(z, 'ty', Math.sin(z.phase * 0.5) * 0.15 + bruit(t * 0.7, P.graine) * 0.25, dt, 35, 6);
      // bras tendus et mous, poignets lâches, parfois un bras mort qui pend ; en attaque, chaque type frappe à sa façon
      const A = z.attaque ? ATTAQUES[z.type] : null;
      let elan = 0,
        frappe = 0,
        frappeG = 0,
        frappeD = 0;
      z.bras.forEach((b, i) => {
        const mou = P.brasMou === i && !A;
        let x = mou
          ? -0.1 + Math.sin(z.phase + i * Math.PI) * 0.25
          : c.brasX + Math.sin(z.phase + i * Math.PI) * c.balBras + bruit(t * 1.3, P.graine + i) * 0.12;
        let ecart = (i ? 1 : -1) * (mou ? 0.08 : c.ecartBras) + bruit(t, P.graine + 3 + i) * 0.08,
          coude = (mou ? -0.05 : -0.35) + Math.sin(z.phase * 1.3 + i) * 0.18;
        let k = 60,
          am = 7;
        if (A) {
          // s < 0 : le bras se lève (élan) ; s > 0 : il s'abat vers l'avant en balayant vers l'intérieur
          const s = Math.sin(t * A.freq + (A.deuxMains ? 0 : i * Math.PI));
          const monte = Math.max(0, -s),
            coup = Math.pow(Math.max(0, s), 1.5);
          x = c.brasX - A.leve * monte + A.abat * coup;
          ecart = (i ? 1 : -1) * (c.ecartBras + 0.15 * monte - A.balaye * coup);
          coude = -0.85 * monte - 0.05 * coup;
          k = A.raideur;
          am = 10;
          elan = Math.max(elan, monte);
          frappe = Math.max(frappe, coup);
          if (i) frappeD = coup;
          else frappeG = coup;
        }
        b.epaule.rotation.x = vers(z, 'ex' + i, x, dt, k, am);
        b.epaule.rotation.z = vers(z, 'ez' + i, ecart, dt, k, am);
        b.coude.rotation.x = vers(z, 'cx' + i, coude, dt, k * 0.8, am * 0.8);
        b.main.rotation.x = vers(z, 'mx' + i, A ? 0.6 * frappe : 0.35 + Math.sin(z.phase + i) * 0.25, dt, 35, 4);
      });
      // le corps accompagne le coup : recul pendant l'élan, buste projeté et tordu vers le bras qui frappe, morsure
      z.buste.rotation.x += vers(z, 'lunge', A ? A.penche * frappe - 0.18 * elan : 0, dt, 140, 12);
      z.buste.rotation.y += vers(z, 'twist', A ? (frappeG - frappeD) * A.torsion : 0, dt, 120, 11);
      z.corps.position.z = vers(z, 'avance', A ? 0.07 * frappe - 0.03 * elan : 0, dt, 140, 12);
      if (A && A.morsure) z.tete.rotation.x += vers(z, 'mord', -0.35 * frappe + 0.2 * elan, dt, 160, 10);
      z.impact = !!A && frappe > 0.8 && !(z.dejaImpact > 0.8);
      z.dejaImpact = frappe;
      if (z.queue) chaine(z, z.queue, 'q', dt, { base: 0.45, inertie: 0.035, vent: 0.25, k: 70, amort: 6 });
      rebondTorse(z, dt, z.type === 'gros' ? 0.5 : 0.12);
      z.coup = Math.max(0, (z.coup || 0) - dt * 5);
      const brule = z.brule || 0;
      z.brule = Math.max(0, brule - dt * 2);
      for (const m of z.mats) m.emissive.setRGB(z.coup + brule * 0.5, z.coup + brule * 0.15, z.coup);
    }

    // Mort : les genoux lâchent, le corps s'effondre, les bras retombent, petit rebond au sol
    function mourir(z, dt) {
      const k = z.t;
      if (!z.chuteDe) z.chuteDe = { bras: [R(-2.6, -0.3), R(-2.6, -0.3)], cou: R(-0.6, 0.6) };
      [0, 1].forEach(i => {
        z.j[i].cuisse.rotation.x = vers(z, 'cu' + i, -1.1 + i * 0.3, dt, 90, 10);
        z.j[i].tibia.rotation.x = vers(z, 'ge' + i, 1.5 - i * 0.4, dt, 90, 10);
      });
      z.corps.position.y = vers(z, 'hy', k < 0.35 ? 0.55 : 0.3, dt, 120, 10);
      z.buste.rotation.x = vers(z, 'brx', -0.5, dt, 60, 6);
      z.bras.forEach((b, i) => {
        b.epaule.rotation.x = vers(z, 'ex' + i, z.chuteDe.bras[i], dt, 40, 5);
        b.epaule.rotation.z = vers(z, 'ez' + i, (i ? 1 : -1) * 0.9, dt, 40, 5);
        b.coude.rotation.x = vers(z, 'cx' + i, -0.2, dt, 30, 4);
      });
      z.tete.rotation.z = vers(z, 'tz', z.chuteDe.cou, dt, 40, 4);
      if (z.queue) chaine(z, z.queue, 'q', dt, { base: 0.45, inertie: 0.035, vent: 0, k: 70, amort: 6 });
      // bascule au sol avec un rebond
      const e = borne((k - 0.15) / 0.45, 0, 1);
      const rebond = e < 1 ? 1 - Math.pow(1 - e, 3) : 1;
      const ang =
        (((rebond + (e >= 1 ? 0 : Math.sin(e * Math.PI) * 0.06)) * Math.PI) / 2) * 0.92 +
        (k > 0.6 ? Math.sin((k - 0.6) * 18) * Math.exp(-(k - 0.6) * 8) * 0.08 : 0);
      return ang;
    }

    // ---------- Les défenseurs ----------
    // Repos vivant commun : respiration, transfert du poids, regard qui se promène
    function respirer(p, dt, t, o) {
      const souffle = Math.sin(t * (BOUCLE ? BOUCLE.souffle : o.frequence || 1.6));
      p.clav.forEach(cl => (cl.position.y = 0.56 + souffle * 0.008));
      const poids = Math.sin(t * (BOUCLE ? BOUCLE.poids : 0.55) + (o.graine || 0));
      demarche(
        p,
        0,
        {
          foulee: 0,
          genou: 0,
          rebond: 0,
          roulis: 0,
          torsion: 0,
          flex: o.flex || 0.08,
          ecart: o.ecart || 0.05,
          balance: 0,
          penche: (p.voute || 0) + (o.penche || 0),
          torsionHaut: o.torsionHaut || 0,
        },
        dt,
      );
      p.corps.position.x = vers(p, 'hx', poids * 0.025, dt, 60, 10);
      p.corps.rotation.z = vers(p, 'hrz', -poids * 0.035, dt, 60, 10);
      if (BOUCLE) p.regard = { y: 0, x: 0, t: 1e9 };
      else if (!p.regard || t > p.regard.t) p.regard = { y: R(-0.4, 0.4), x: R(-0.15, 0.1), t: t + R(1.5, 3.5) };
      const suit = o.cible != null;
      p.tete.rotation.y = vers(p, 'ty', suit ? o.cible * 0.5 : p.regard.y, dt, 50, 9);
      p.tete.rotation.x = vers(p, 'tx', suit ? 0.05 : p.regard.x, dt, 50, 9);
      p.tete.rotation.z = vers(p, 'tz', poids * 0.04, dt, 50, 9);
      rebondTorse(p, dt, 0.1);
      p.torse.scale.multiplyScalar(1 + souffle * 0.006);
    }

    // Pistolero : le buste devance les pieds, recul sec à chaque tir puis retour en souplesse
    function poseGun(p, dt, t, tir, cote, torsion, enGarde) {
      respirer(p, dt, t, {
        torsionHaut: vers(p, 'avance', (torsion || 0) * 0.7, dt, 90, 12),
        cible: torsion,
        flex: 0.1,
        ecart: 0.07,
      });
      if (tir) {
        pousser(p, 'ex' + cote, -9);
        pousser(p, 'cx' + cote, -10);
        pousser(p, 'recul', -2.5);
        pousser(p, 'ty', R(-1, 1));
      }
      p.bras.forEach((b, i) => {
        const garde = enGarde === false ? 0.7 : 0;
        b.epaule.rotation.x = vers(p, 'ex' + i, -1.32 + garde + bruit(t * 0.8, i * 9) * 0.03, dt, 140, 11);
        b.epaule.rotation.z = vers(p, 'ez' + i, (i ? 1 : -1) * (0.12 + garde * 0.2), dt, 140, 12);
        b.coude.rotation.x = vers(p, 'cx' + i, -0.08 - garde * 0.4, dt, 160, 11);
      });
      if (!p.rs.recul) ressort(p, 'recul', 0, 90, 9);
      chaine(p, p.tresse, 't', dt, { base: 0.06, inertie: 0.02, vent: 0.1, k: 60, amort: 6 });
    }

    // Bûcheron : élan avec flexion, frappe rapide, accompagnement puis retour en garde
    function poseHache(p, dt, t, k, torsion) {
      let tour = 0,
        haut = -1.15,
        flex = 0.1,
        avance = 0,
        k2 = 160,
        am = 16;
      if (k >= 0) {
        if (k < 0.45) {
          const e = lisse(k / 0.45);
          tour = 0.85 * e;
          haut = -1.15 - 1.3 * e;
          flex = 0.1 + 0.2 * e;
          avance = -0.05 * e;
        } else if (k < 0.58) {
          const e = (k - 0.45) / 0.13;
          tour = 0.85 - 1.75 * e * e;
          haut = -2.45 + 2.0 * e * e;
          flex = 0.3 + 0.1 * e;
          avance = 0.12 * e;
          k2 = 420;
          am = 24;
        } else {
          const e = lisse((k - 0.58) / 0.42);
          tour = -0.9 * (1 - e);
          haut = -0.45 - 0.7 * e;
          flex = 0.4 - 0.3 * e;
          avance = 0.12 * (1 - e);
        }
      }
      respirer(p, dt, t, {
        torsionHaut: vers(p, 'tourH', tour + (torsion || 0) * 0.5, dt, k2, am),
        cible: torsion,
        flex: vers(p, 'flex', flex, dt, 200, 18),
        ecart: 0.1,
        penche: vers(p, 'pen', avance * 2, dt, k2, am),
      });
      p.corps.position.z = vers(p, 'hz', avance, dt, k2, am);
      p.bras[1].epaule.rotation.x = vers(p, 'ex1', haut, dt, k2, am);
      p.bras[1].coude.rotation.x = vers(p, 'cx1', -0.3 - (k >= 0 && k < 0.45 ? 0.4 : 0), dt, k2, am);
      p.bras[0].epaule.rotation.x = vers(p, 'ex0', haut + 0.15, dt, k2, am);
      p.bras[0].epaule.rotation.z = 0.55;
      p.bras[0].coude.rotation.x = vers(p, 'cx0', -0.5, dt, k2, am);
      p.hache.rotation.x = vers(p, 'hax', -0.6 + (k >= 0.45 && k < 0.6 ? 0.5 : 0), dt, k2, am);
      p.hache.rotation.z = -0.5;
    }

    // Lance-flammes : jambes écartées, buste qui balaie, bras qui vibre sous la poussée
    function poseFeu(p, dt, t, actif, torsion) {
      const balaye = actif ? Math.sin(t * 2.2) * 0.3 : 0;
      respirer(p, dt, t, {
        torsionHaut: vers(p, 'bal', balaye + (torsion || 0) * 0.6, dt, 70, 10),
        cible: torsion,
        flex: actif ? 0.22 : 0.1,
        ecart: actif ? 0.14 : 0.08,
        frequence: 1.2,
      });
      const tremble = actif ? bruit(t * 18, 1) * 0.05 : 0;
      p.bras[0].epaule.rotation.x = vers(p, 'ex0', -1.25 + tremble - (actif ? 0.05 : -0.25), dt, 140, 12);
      p.bras[0].epaule.rotation.y = 0;
      p.bras[0].coude.rotation.x = vers(p, 'cx0', actif ? -0.15 : -0.5, dt, 120, 12);
      p.bras[1].epaule.rotation.x = vers(p, 'ex1', -0.3 + Math.sin(t * 1.2) * 0.05, dt, 40, 5);
      p.bras[1].epaule.rotation.z = vers(p, 'ez1', 0.18, dt, 40, 5);
      p.bras[1].coude.rotation.x = vers(p, 'cx1', -0.3, dt, 40, 5);
      chaine(p, p.barbe, 'b', dt, { base: 0, inertie: 0.02, vent: 0, k: 70, amort: 6 });
    }

    // ---------- Zombies Mixamo (maquette « Barricard roster zombies 3D ») ----------
    function zombiesMixamo(THREE) {
      const R = (a, b) => a + Math.random() * (b - a);
      const G = () => new THREE.Group();

      // ---------- Textures peintes ----------
      function texture(peindre, taille = 256) {
        const c = document.createElement('canvas');
        c.width = c.height = taille;
        peindre(c.getContext('2d'), taille);
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 4;
        return t;
      }
      const fond = (g, S, c) => {
        g.fillStyle = c;
        g.fillRect(0, 0, S, S);
      };
      function taches(g, S, n, coul, rmin, rmax, a) {
        g.fillStyle = coul;
        for (let i = 0; i < n; i++) {
          const r = R(rmin, rmax);
          g.globalAlpha = R(a * 0.4, a);
          g.beginPath();
          g.ellipse(R(0, S), R(0, S), r, r * R(0.5, 1), R(0, 3), 0, 6.3);
          g.fill();
        }
        g.globalAlpha = 1;
      }
      function fibres(g, S, n, coul, a, long, angle) {
        g.strokeStyle = coul;
        g.lineWidth = 1;
        for (let i = 0; i < n; i++) {
          const x = R(0, S),
            y = R(0, S),
            an = angle == null ? R(0, 6.3) : angle + R(-0.2, 0.2),
            l = R(long * 0.5, long);
          g.globalAlpha = R(a * 0.3, a);
          g.beginPath();
          g.moveTo(x, y);
          g.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l);
          g.stroke();
        }
        g.globalAlpha = 1;
      }
      const tissu = (c, extra) =>
        texture((g, S) => {
          fond(g, S, c);
          fibres(g, S, 1400, 'rgba(0,0,0,.5)', 0.18, 5);
          fibres(g, S, 600, 'rgba(255,255,255,.5)', 0.12, 4);
          extra && extra(g, S);
        });
      const cuir = c =>
        texture((g, S) => {
          fond(g, S, c);
          taches(g, S, 30, 'rgba(0,0,0,.6)', 10, 40, 0.18);
          fibres(g, S, 120, 'rgba(255,235,200,.8)', 0.3, 14);
        });
      const cheveux = (b, cl, so) =>
        texture((g, S) => {
          fond(g, S, b);
          fibres(g, S, 900, so, 0.7, 40, Math.PI / 2);
          fibres(g, S, 500, cl, 0.55, 34, Math.PI / 2);
        });
      const T = {
        navy: tissu('#22294a'),
        sacoche: cuir('#8b6a40'),
        cuir: cuir('#6e4628'),
        papier: tissu('#efe5cf'),
        cire: tissu('#b3261e'),
        gris: cheveux('#9c9a96', '#d8d6d0', '#5a5854'),
        laiton: tissu('#d6a645'),
        blond: cheveux('#e6be55', '#fbe39a', '#a87a26'),
        rose: tissu('#e2508a'),
        blanc: tissu('#f1ece0'),
        toque: tissu('#e2dacb', (g, S) => taches(g, S, 30, '#cfc6b6', 10, 30, 0.3)),
        bandana: tissu('#b2282a', (g, S) => {
          g.fillStyle = 'rgba(255,240,230,.85)';
          for (let x = 6; x < S; x += 22)
            for (let y = 6; y < S; y += 22) {
              g.beginPath();
              g.arc(x, y, 2.5, 0, 6.3);
              g.fill();
            }
        }),
        metal: texture((g, S) => {
          const d = g.createLinearGradient(0, 0, S, 0);
          d.addColorStop(0, '#6c7279');
          d.addColorStop(0.5, '#e1e5ea');
          d.addColorStop(1, '#5c6168');
          g.fillStyle = d;
          g.fillRect(0, 0, S, S);
        }),
        bois: tissu('#8a5a32'),
        cheveuxBruns: cheveux('#4a3424', '#7a5a40', '#24180f'),
        verre: tissu('#d8a440'),
      };

      // ---------- Ombrage en aplats et contour sombre ----------
      const degrade = (() => {
        const t = new THREE.DataTexture(new Uint8Array([85, 140, 190, 228]), 4, 1, THREE.LuminanceFormat);
        t.minFilter = t.magFilter = THREE.NearestFilter;
        t.needsUpdate = true;
        return t;
      })();
      const contourRigide = e =>
        new THREE.ShaderMaterial({
          side: THREE.BackSide,
          vertexShader: `void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * ${e.toFixed(4)}, 1.0); }`,
          fragmentShader: 'void main(){ gl_FragColor = vec4(0.09,0.065,0.05,1.0); }',
        });
      // contour d'un corps qui se déforme : gonflé après le calcul de la peau
      function contourSouple(epais) {
        const m = new THREE.MeshLambertMaterial({
          color: 0x000000,
          emissive: 0x17110d,
          side: THREE.BackSide,
          skinning: true,
        }); // Lambert : ses normales suivent la peau
        m.onBeforeCompile = s => {
          s.vertexShader = s.vertexShader.replace(
            '#include <skinning_vertex>',
            `#include <skinning_vertex>\n transformed += normalize(objectNormal) * ${epais.toFixed(2)};`,
          );
        };
        return m;
      }
      const SPH = new THREE.SphereGeometry(1, 24, 16);
      function piece(geo, tex, parent, pos = [0, 0, 0], sc = [1, 1, 1], rot) {
        const m = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ map: tex, gradientMap: degrade }));
        m.position.set(...pos);
        m.scale.set(...sc);
        if (rot) m.rotation.set(...rot);
        m.castShadow = true;
        m.add(new THREE.Mesh(geo, contourRigide(0.012 / ((sc[0] + sc[1] + sc[2]) / 3))));
        parent.add(m);
        return m;
      }
      const tour = pts =>
        new THREE.LatheGeometry(
          pts.map(p => new THREE.Vector2(p[0], p[1])),
          28,
        );
      const anneau = (r, e) => new THREE.TorusGeometry(r, e, 10, 28);

      // ---------- Habiller le mannequin ----------
      // Couleur de chaque zone du corps, choisie d'après l'os qui la fait bouger le plus
      function zoneDe(nom) {
        nom = nom.replace('mixamorig', '');
        if (/Head|Neck/.test(nom)) return 'peau';
        if (/Hand/.test(nom)) return 'mains';
        if (/ForeArm/.test(nom)) return 'avantBras';
        if (/Arm|Shoulder/.test(nom)) return 'bras';
        if (/Spine/.test(nom)) return 'haut';
        if (/Hips/.test(nom)) return 'bassin';
        if (/UpLeg/.test(nom)) return 'cuisses';
        if (/Leg/.test(nom)) return 'jambes';
        if (/Foot|Toe/.test(nom)) return 'pieds';
        return 'haut';
      }
      // bruit de couleur : taches de crasse et de pourriture, pour un rendu peint
      const bruit3 = (x, y, z) =>
        Math.sin(x * 9.1 + y * 3.7) * Math.cos(y * 7.3 - z * 5.1) * Math.sin(z * 8.7 + x * 2.3);
      const composante = (a, i, k) => [a.getX, a.getY, a.getZ, a.getW][k].call(a, i);
      Object.assign(T, {
        navy: tissu('#3e3846'),
        sacoche: cuir('#8e6e52'),
        gris: cheveux('#b8ad9c', '#e2d8c8', '#6e6458'),
        blond: cheveux('#d6c081', '#efdca4', '#9a7e42'),
        rose: tissu('#c46a72'),
        toque: tissu('#f2e4d4'),
        bandana: tissu('#8e3a2e'),
        cheveuxBruns: cheveux('#4b3c2c', '#7e5e44', '#20150c'),
        noir: cuir('#222226'),
        casque: texture((g, S) => {
          fond(g, S, '#1c1c20');
          g.fillStyle = '#d8d2c4';
          g.fillRect(S * 0.46, 0, S * 0.08, S);
          taches(g, S, 20, 'rgba(255,255,255,.4)', 4, 14, 0.15);
        }),
        chaine: texture((g, S) => {
          const d = g.createLinearGradient(0, 0, S, 0);
          d.addColorStop(0, '#5c6168');
          d.addColorStop(0.5, '#d0d4d8');
          d.addColorStop(1, '#4c5158');
          g.fillStyle = d;
          g.fillRect(0, 0, S, S);
        }),
        fourrure: texture((g, S) => {
          fond(g, S, '#f3e8dc');
          fibres(g, S, 1600, '#b8b0a0', 0.5, 18);
          fibres(g, S, 800, '#ffffff', 0.6, 14);
        }),
        perle: tissu('#ece6da'),
        bordeaux: tissu('#7c4c47'),
        orange: tissu('#cf9342', (g, S) => {
          g.fillStyle = '#c9ccd0';
          g.fillRect(0, S * 0.4, S, S * 0.12);
          g.fillRect(0, S * 0.7, S, S * 0.12);
          taches(g, S, 14, '#5a3a1a', 6, 20, 0.3);
        }),
        jaune: tissu('#cd982f', (g, S) => taches(g, S, 16, '#8a6a10', 6, 18, 0.3)),
        masque: tissu('#71332b', (g, S) => {
          g.fillStyle = '#c8a050';
          for (let i = 0; i < 7; i++) {
            const x = S * (0.1 + i * 0.13);
            g.beginPath();
            g.moveTo(x, S);
            g.quadraticCurveTo(x + 12, S * 0.55, x + 4, S * 0.25);
            g.quadraticCurveTo(x + 20, S * 0.6, x + 26, S);
            g.fill();
          }
        }),
        voile: tissu('#f4f0e8', (g, S) => {
          g.strokeStyle = 'rgba(170,40,40,.8)';
          g.lineWidth = 8;
          g.strokeRect(4, 4, S - 8, S - 8);
        }),
        rougeVif: tissu('#8e3a2e'),
        roseFonce: tissu('#b27c71'),
        noeudRose: tissu('#c08a86'),
        filtre: texture((g, S) => {
          fond(g, S, '#3a3c40');
          for (let y = 0; y < S; y += 16) {
            g.fillStyle = '#5a5e64';
            g.fillRect(0, y, S, 6);
          }
        }),
        vertPeau: texture((g, S) => {
          fond(g, S, '#a8a46a');
          taches(g, S, 30, '#55663a', 6, 20, 0.4);
        }),
      });

      // Corps peint : couleur par zone, salissures et taches de sang
      // motif de chaque zone : 0 peau, 1 tissu, 2 cuir
      const motifDe = (zone, Z) =>
        zone === 'peau' || zone === 'mains' || (Z.peauNue || []).includes(zone)
          ? 0
          : (Z.cuir || []).includes(zone)
            ? 2
            : 1;
      // matériau peint : le motif est calculé dans le corps lui-même (il suit les plis), sans texture à déplier
      function materiauPeint() {
        const m = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: degrade, skinning: true });
        m.onBeforeCompile = s => {
          s.vertexShader =
            'attribute float motif;\nvarying float vMotif;\nvarying vec3 vPosCorps;\n' +
            s.vertexShader.replace(
              '#include <begin_vertex>',
              '#include <begin_vertex>\n vMotif = motif; vPosCorps = position;',
            );
          s.fragmentShader =
            `varying float vMotif;\nvarying vec3 vPosCorps;
float hachage(vec3 p) { p = fract(p * .3183 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float bruitDoux(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(hachage(i), hachage(i + vec3(1,0,0)), f.x), mix(hachage(i + vec3(0,1,0)), hachage(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hachage(i + vec3(0,0,1)), hachage(i + vec3(1,0,1)), f.x), mix(hachage(i + vec3(0,1,1)), hachage(i + vec3(1,1,1)), f.x), f.y), f.z); }
` +
            s.fragmentShader.replace(
              '#include <color_fragment>',
              `#include <color_fragment>
 float gros = bruitDoux(vPosCorps * .06), fin = bruitDoux(vPosCorps * .22 + 7.);
 if (vMotif < .5) { // peau : marbrures sombres et plaques claires
   diffuseColor.rgb *= .84 + .3 * gros;
   diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.36, .3, .18), smoothstep(.6, .85, fin) * .55);
 } else if (vMotif < 1.5) { // tissu : trame fine, usure, plis plus sombres
   float trame = .95 + .05 * sin(vPosCorps.x * 2.2 + vPosCorps.z * 2.2) * sin(vPosCorps.y * 2.2);
   diffuseColor.rgb *= trame * (.88 + .2 * gros) * (1. - smoothstep(.72, .9, fin) * .25);
 } else { // cuir : patine et éraflures claires
   diffuseColor.rgb *= .8 + .35 * gros;
   diffuseColor.rgb += vec3(.08) * smoothstep(.8, .95, fin);
 }`,
            );
        };
        return m;
      }
      function peindreCorps(mesh, couleurs, salete, sang, Z) {
        const g = mesh.geometry,
          idx = g.attributes.skinIndex,
          poids = g.attributes.skinWeight,
          pos = g.attributes.position;
        const os = mesh.skeleton.bones.map(b => zoneDe(b.name));
        const col = new Float32Array(pos.count * 3),
          motifs = new Float32Array(pos.count),
          c = new THREE.Color(),
          rouge = new THREE.Color('#5e1a12');
        for (let i = 0; i < pos.count; i++) {
          let best = 0,
            w = -1;
          for (let k = 0; k < 4; k++) {
            const p = composante(poids, i, k);
            if (p > w) {
              w = p;
              best = composante(idx, i, k);
            }
          }
          c.set(couleurs[os[best]] || couleurs.haut);
          motifs[i] = motifDe(os[best], Z);
          const x = pos.getX(i) * 0.02,
            y = pos.getY(i) * 0.02,
            z = pos.getZ(i) * 0.02;
          const n = bruit3(x, y, z),
            n2 = bruit3(x * 2.3 + 5, y * 2.1, z * 1.7 - 3);
          c.multiplyScalar(1 + n * 0.12 - (n > 0.55 ? salete : 0));
          if (n2 > 1 - sang) c.lerp(rouge, 0.75);
          col[i * 3] = c.r;
          col[i * 3 + 1] = c.g;
          col[i * 3 + 2] = c.b;
        }
        g.setAttribute('color', new THREE.BufferAttribute(col, 3));
        g.setAttribute('motif', new THREE.BufferAttribute(motifs, 1));
        mesh.material = materiauPeint();
        mesh.castShadow = true;
        const bord = new THREE.SkinnedMesh(g, contourSouple(1.9)); // trait plus épais, comme l'encre des dessins
        bord.bind(mesh.skeleton, mesh.bindMatrix);
        mesh.parent.add(bord);
      }
      const os = (racine, nom) => {
        let b = null;
        racine.traverse(o => {
          if (o.isBone && o.name.replace(':', '') === 'mixamorig' + nom) b = o;
        });
        return b;
      };
      function accroche(racine, nom, pos = [0, 0, 0], rot) {
        const g = G();
        g.scale.setScalar(100);
        g.position.set(...pos);
        if (rot) g.rotation.set(...rot);
        os(racine, nom).add(g);
        return g;
      }
      function silhouette(racine, ventre, epaules) {
        const s = os(racine, 'Spine'),
          s1 = os(racine, 'Spine1');
        s.scale.set(ventre[0], 1, ventre[1]);
        s1.scale.set(epaules[0], 1, epaules[1]);
        const kx = 1 / (ventre[0] * epaules[0]),
          kz = 1 / (ventre[1] * epaules[1]);
        ['Neck', 'LeftShoulder', 'RightShoulder'].forEach(n => os(racine, n).scale.set(kx, 1, kz));
      }
      // Chevelure : des dizaines de mèches plaquées sur le crâne, orientées du sommet vers la nuque comme une vraie coiffure,
      // plus des mèches folles qui rebiquent (zombie mal coiffé). o : texture, densité, longueur, épaisseur, raie, désordre, boucles
      const MECHE = new THREE.SphereGeometry(1, 10, 8);
      function chevelure(t, o) {
        const tex = o.tex,
          n = o.n || 70,
          R = o.rayon || 0.104,
          centre = new THREE.Vector3(0, 0.02, -0.01);
        const haut = new THREE.Vector3(0, 1, 0),
          m4 = new THREE.Matrix4();
        for (let i = 0; i < n; i++) {
          // points répartis sur la sphère (spirale de Fibonacci), gardés au-dessus de la ligne des cheveux
          const y = 1 - ((i + 0.5) / n) * 1.25,
            r = Math.sqrt(Math.max(0, 1 - y * y)),
            a = i * 2.39996;
          const nrm = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
          if (y < (o.bas || -0.15)) continue;
          if (nrm.z > 0.45 && y < (o.front || 0.45)) continue; // le visage reste dégagé
          // direction de la mèche : vers le bas le long du crâne (vers l'arrière sur le sommet), et s'écarte de la raie
          let dir = haut.clone().negate().addScaledVector(nrm, nrm.y);
          if (dir.lengthSq() < 0.02) dir.set(0, 0, -1).addScaledVector(nrm, -nrm.z);
          if (o.raie) dir.x += Math.sign(nrm.x || 1) * 0.6 * Math.max(0, nrm.y);
          if (o.tire) dir.addScaledVector(new THREE.Vector3(0, 0.4, -1), o.tire); // cheveux tirés vers un chignon ou une queue
          dir.normalize();
          const jit = o.desordre || 0.25;
          dir.x += (Math.random() - 0.5) * jit;
          dir.z += (Math.random() - 0.5) * jit;
          dir.normalize();
          const x = new THREE.Vector3().crossVectors(dir, nrm).normalize(),
            z = new THREE.Vector3().crossVectors(x, dir).normalize();
          const meche = new THREE.Mesh(MECHE, materiauMeche(tex));
          m4.makeBasis(x, dir, z);
          meche.quaternion.setFromRotationMatrix(m4);
          const long = (o.long || 0.05) * (0.75 + Math.random() * 0.5),
            large = (o.large || 0.03) * (0.8 + Math.random() * 0.4);
          meche.scale.set(large, long, o.epais || 0.018);
          meche.position
            .copy(centre)
            .addScaledVector(nrm, R)
            .addScaledVector(dir, long * 0.5);
          meche.castShadow = true;
          t.add(meche);
          if (o.boucles && Math.random() < o.boucles) {
            // boucle : petite boule frisée posée sur la mèche
            const b = new THREE.Mesh(MECHE, materiauMeche(tex));
            b.scale.setScalar(large * 1.1);
            b.position.copy(meche.position).addScaledVector(nrm, 0.012);
            t.add(b);
          }
        }
        // calotte sous les mèches : pas de trou de crâne entre elles
        const calotte = new THREE.Mesh(SPH, materiauMeche(tex, true));
        calotte.scale.set(R * 0.98, R * 0.9, R);
        calotte.position.copy(centre);
        t.add(calotte);
        // mèches folles qui rebiquent
        for (let i = 0; i < (o.folles || 6); i++) {
          const a = Math.random() * Math.PI * 2,
            nrm = new THREE.Vector3(Math.cos(a) * 0.7, 0.3 + Math.random() * 0.6, Math.sin(a) * 0.7 - 0.2).normalize();
          const f = new THREE.Mesh(MECHE, materiauMeche(tex));
          f.quaternion.setFromUnitVectors(
            haut,
            nrm
              .clone()
              .add(new THREE.Vector3(0, -0.3, 0))
              .normalize(),
          );
          f.scale.set(0.008, (o.long || 0.05) * 1.1, 0.006);
          f.position.copy(centre).addScaledVector(nrm, R * 1.05);
          t.add(f);
        }
      }
      // matériau d'une mèche, avec un contour fin (le contour des mèches serait trop chargé : seule la calotte en a un)
      const cacheMeche = new Map();
      function materiauMeche(tex, calotte) {
        const cle = tex.uuid + (calotte ? 'c' : '');
        if (!cacheMeche.has(cle))
          cacheMeche.set(
            cle,
            new THREE.MeshToonMaterial({ map: tex, gradientMap: degrade, color: calotte ? 0xb8b8b8 : 0xffffff }),
          );
        return cacheMeche.get(cle);
      }
      // chignon : boule de mèches enroulées
      function chignon(t, tex, pos, taille) {
        const c = G();
        c.position.set(...pos);
        t.add(c);
        piece(SPH, tex, c, [0, 0, 0], [taille, taille * 0.9, taille]);
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2,
            m = new THREE.Mesh(MECHE, materiauMeche(tex));
          m.position.set(Math.cos(a) * taille * 0.7, Math.sin(i * 1.3) * taille * 0.3, Math.sin(a) * taille * 0.7);
          m.scale.set(taille * 0.55, taille * 0.3, taille * 0.3);
          m.rotation.y = -a;
          c.add(m);
        }
        return c;
      }
      const ZV = '#a8a46a',
        ZVm = '#988b63'; // peau olive des dessins, mains un peu plus sombres // peau de zombie, mains

      // ---------- Le roster ----------
      // Chaque zombie : nom du jeu, dessin, couleurs par zone, silhouette, accessoires, gestes
      const ROSTER = [
        {
          id: 'walk',
          taille: 1.0,
          tete: 1.05,
          nom: 'Rôdeur',
          sprite: 'z_walk',
          texte: 'Le facteur. Lent, il titube bras tendus avec sa sacoche au dos.',
          couleurs: {
            peau: ZV,
            mains: ZVm,
            avantBras: '#4f4a58',
            bras: '#4f4a58',
            haut: '#4f4a58',
            bassin: '#3a3540',
            cuisses: '#3d3844',
            jambes: '#3d3844',
            pieds: '#2e241c',
          },
          salete: 0.25,
          sang: 0.08,
          roles: {
            marcher: ['marche', 1],
            courir: ['marche', 1.5],
            attendre: ['repos', 1],
            attaquer: ['attaque', 1],
            mordre: ['morsure', 1],
            crier: ['cri', 1],
            mourir: ['mort', 1],
          },
          prog: [
            ['marcher', 4],
            ['attaquer', 5],
            ['crier', 2.8],
            ['marcher', 3],
            ['mordre', 6.6],
            ['mourir', 3.5],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 10, 1]);
            piece(
              tour([
                [0, 0],
                [0.105, 0],
                [0.112, 0.05],
                [0.112, 0.08],
                [0.1, 0.095],
                [0, 0.1],
              ]),
              T.navy,
              t,
            );
            piece(SPH, T.navy, t, [0, 0.02, 0.1], [0.08, 0.012, 0.06]);
            piece(SPH, T.laiton, t, [0, 0.06, 0.11], [0.02, 0.02, 0.008]);
            const h = G();
            h.position.y = -0.1;
            t.add(h);
            chevelure(h, { tex: T.gris, n: 60, bas: -0.35, front: 0.2, long: 0.05, desordre: 0.7, folles: 10 });
            const d = accroche(r, 'Spine2', [0, -6, -13]);
            piece(new THREE.BoxGeometry(0.3, 0.22, 0.09), T.sacoche, d);
            piece(SPH, T.cire, d, [0, 0.02, -0.05], [0.022, 0.022, 0.008]);
            piece(new THREE.BoxGeometry(0.13, 0.08, 0.01), T.papier, d, [0, 0.02, -0.047]);
          },
        },
        {
          id: 'run',
          taille: 0.94,
          tete: 0.95,
          bras: 1.05,
          nom: 'Coureur',
          sprite: 'z_run',
          texte: 'La joggeuse. Rapide, elle fonce et mord au cou.',
          couleurs: {
            peau: '#aba765',
            mains: '#9a9460',
            avantBras: '#aba765',
            bras: '#a9b06a',
            haut: '#a9b06a',
            bassin: '#3e3a3a',
            cuisses: '#3e3a3a',
            jambes: '#aba765',
            pieds: '#d8ccb4',
          },
          salete: 0.2,
          sang: 0.06,
          ventre: [0.92, 0.92],
          epaules: [0.95, 0.95],
          peauNue: ['avantBras', 'jambes'],
          roles: {
            marcher: ['marche2', 1.1],
            courir: ['course', 1],
            attendre: ['repos', 1.2],
            attaquer: ['attaque', 1.3],
            mordre: ['cou', 1.1],
            crier: ['cri', 1.2],
            mourir: ['agonie', 1],
          },
          prog: [
            ['courir', 4],
            ['mordre', 4],
            ['attendre', 3],
            ['courir', 3],
            ['attaquer', 4],
            ['mourir', 3.8],
          ],
          habiller(r, p) {
            const t = accroche(r, 'Head', [0, 6, 0]);
            chevelure(t, { tex: T.blond, n: 80, raie: true, tire: 0.6, long: 0.055, desordre: 0.2, folles: 5 });
            piece(anneau(0.1, 0.014), T.rose, t, [0, 0, 0], [1, 1, 1], [Math.PI / 2 - 0.25, 0, 0]);
            let par = t;
            p.queue = [];
            for (let i = 0; i < 6; i++) {
              const g = G();
              g.position.set(0, i ? -0.01 : 0.05, i ? -0.045 : -0.11);
              par.add(g);
              for (let k = 0; k < 4; k++) {
                const m = new THREE.Mesh(MECHE, materiauMeche(T.blond));
                m.position.set(((k % 2) - 0.5) * 0.025, k > 1 ? 0.01 : -0.01, 0);
                m.scale.set(0.026 - i * 0.002, 0.022, 0.045);
                m.rotation.z = (k - 1.5) * 0.2;
                g.add(m);
              }
              p.queue.push(g);
              par = g;
            }
            piece(anneau(0.03, 0.012), T.rose, p.queue[0], [0, 0, 0.02], [1, 1, 1], [0.3, 0, 0]);
            ['LeftForeArm', 'RightForeArm'].forEach(n =>
              piece(
                anneau(0.035, 0.014),
                T.rose,
                accroche(r, n, [0, 20, 0]),
                [0, 0, 0],
                [1, 1, 1],
                [Math.PI / 2, 0, 0],
              ),
            );
          },
        },
        {
          id: 'fat',
          taille: 1.1,
          tete: 1.1,
          nom: 'Gonflé',
          sprite: 'z_fat',
          texte: 'Le cuistot. Très lent, il frappe fort (2 dégâts) avec sa casserole.',
          couleurs: {
            peau: ZV,
            mains: ZVm,
            avantBras: ZV,
            bras: '#eadacb',
            haut: '#eadacb',
            bassin: '#5c524c',
            cuisses: '#5c524c',
            jambes: '#5c524c',
            pieds: '#2e241c',
          },
          salete: 0.35,
          sang: 0.14,
          ventre: [1.45, 1.7],
          epaules: [1.15, 1.1],
          peauNue: ['avantBras'],
          roles: {
            marcher: ['marche2', 0.75],
            courir: ['marche', 0.9],
            attendre: ['repos', 0.8],
            attaquer: ['attaque', 0.8],
            mordre: ['morsure2', 0.85],
            crier: ['cri', 0.8],
            mourir: ['mort', 0.9],
          },
          prog: [
            ['marcher', 5],
            ['attaquer', 6],
            ['attendre', 3],
            ['mordre', 5.4],
            ['crier', 3.5],
            ['mourir', 3.5],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 9, 0]);
            piece(
              tour([
                [0, 0],
                [0.11, 0],
                [0.115, 0.05],
                [0.15, 0.1],
                [0.165, 0.15],
                [0.14, 0.19],
                [0.07, 0.2],
                [0, 0.19],
              ]),
              T.toque,
              t,
            );
            for (let i = 0; i < 6; i++) {
              const a = (i / 6) * Math.PI * 2;
              piece(SPH, T.toque, t, [Math.cos(a) * 0.09, 0.2, Math.sin(a) * 0.09], [0.07, 0.05, 0.07]);
            }
            const c = accroche(r, 'Neck', [0, 2, 0]);
            piece(anneau(0.075, 0.025), T.bandana, c, [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
            [-1, 1].forEach(s =>
              piece(SPH, T.bandana, c, [s * 0.04, 0, -0.09], [0.045, 0.02, 0.025], [0, 0, s * 0.45]),
            );
            const m = accroche(r, 'RightHand', [0, 8, 3]);
            piece(new THREE.CylinderGeometry(0.011, 0.012, 0.2, 8), T.metal, m, [0, 0.1, 0]);
            piece(
              tour([
                [0, 0],
                [0.08, 0],
                [0.095, 0.015],
                [0.1, 0.055],
                [0.092, 0.057],
                [0.085, 0.02],
                [0, 0.01],
              ]),
              T.metal,
              m,
              [0, 0.26, 0],
              [1, 1, 1],
              [0, 0, Math.PI / 2],
            );
          },
        },
        {
          id: 'crawl',
          taille: 0.95,
          tete: 1.08,
          bras: 1.1,
          nom: 'Rampant',
          sprite: 'z_crawl',
          texte: 'Le mécanicien en salopette. Il rampe et passe sous les défenses.',
          couleurs: {
            peau: '#a39a6e',
            mains: '#938a5e',
            avantBras: '#a39a6e',
            bras: '#54515d',
            haut: '#54515d',
            bassin: '#54515d',
            cuisses: '#54515d',
            jambes: '#4a4652',
            pieds: '#2e241c',
          },
          salete: 0.4,
          sang: 0.06,
          ventre: [0.95, 0.95],
          roles: {
            marcher: ['rampe', 1],
            courir: ['rampeVite', 1],
            attendre: ['rampe', 0.25],
            attaquer: ['rampeVite', 1.4],
            mordre: ['rampe', 1.6],
            crier: ['rampe', 0.5],
            mourir: ['rampe', 0.05],
          },
          prog: [
            ['marcher', 5],
            ['courir', 3],
            ['attendre', 2.5],
            ['courir', 3],
            ['attaquer', 2.5],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 6, 0]);
            chevelure(t, {
              tex: T.cheveuxBruns,
              n: 75,
              rayon: 0.11,
              long: 0.03,
              large: 0.028,
              epais: 0.022,
              desordre: 0.9,
              boucles: 0.8,
              folles: 3,
            });
            piece(anneau(0.1, 0.01), T.cuir, t, [0, 0.045, 0], [1, 1, 1], [Math.PI / 2 - 0.3, 0, 0]);
            [-1, 1].forEach(s => {
              piece(anneau(0.025, 0.009), T.metal, t, [s * 0.035, 0.07, 0.085], [1, 1, 1], [-0.4, 0, 0]);
              piece(SPH, T.verre, t, [s * 0.035, 0.07, 0.087], [0.02, 0.02, 0.008], [-0.4, 0, 0]);
            });
          },
        },
        {
          id: 'spit',
          taille: 0.9,
          tete: 0.95,
          nom: 'Cracheur',
          sprite: 'z_spit',
          texte: 'La mariée. Elle crache sur ce qui est à 2 cases devant elle avant d’avancer.',
          couleurs: {
            peau: '#aba765',
            mains: '#9a9460',
            avantBras: '#aba765',
            bras: '#e6d6bf',
            haut: '#e6d6bf',
            bassin: '#e6d6bf',
            cuisses: '#e6d6bf',
            jambes: '#aba765',
            pieds: '#d8ccb4',
          },
          salete: 0.25,
          sang: 0.12,
          ventre: [0.95, 0.95],
          epaules: [0.95, 0.95],
          crache: true,
          peauNue: ['avantBras', 'jambes'],
          roles: {
            marcher: ['marche2', 0.9],
            courir: ['marche', 1.2],
            attendre: ['repos', 1],
            attaquer: ['cri', 1.2],
            mordre: ['morsure2', 1],
            crier: ['cri', 1],
            mourir: ['agonie', 1],
          },
          prog: [
            ['marcher', 4],
            ['attaquer', 2.5],
            ['attaquer', 2.5],
            ['attendre', 2],
            ['mordre', 4.6],
            ['mourir', 3.8],
          ],
          habiller(r, p) {
            const t = accroche(r, 'Head', [0, 6, 0]);
            chevelure(t, { tex: T.cheveuxBruns, n: 70, tire: 0.8, long: 0.05, desordre: 0.3, folles: 8 });
            chignon(t, T.cheveuxBruns, [0, 0.1, -0.07], 0.05);
            piece(new THREE.PlaneGeometry(0.22, 0.34, 1, 4), T.voile, t, [0, -0.08, -0.1], [1, 1, 1], [0.25, 0, 0]);
            const d = accroche(r, 'Spine2', [0, 0, -12]);
            [-1, 1].forEach(s => piece(SPH, T.rougeVif, d, [s * 0.06, 0.02, 0], [0.07, 0.04, 0.025], [0, 0, s * 0.4]));
            piece(SPH, T.rougeVif, d, [0, 0.02, -0.01], [0.025, 0.025, 0.02]);
            p.bouche = accroche(r, 'Head', [0, 2, 12]);
          },
        },
        {
          id: 'armor',
          taille: 1.14,
          tete: 1.05,
          nom: 'Blindé',
          sprite: 'z_armor',
          texte: 'Le motard en cuir et casque. Il encaisse 1 dégât de moins par coup, sauf le feu.',
          couleurs: {
            peau: ZV,
            mains: ZVm,
            avantBras: '#3a322e',
            bras: '#3a322e',
            haut: '#3a322e',
            bassin: '#463d38',
            cuisses: '#463d38',
            jambes: '#463d38',
            pieds: '#1d1612',
          },
          salete: 0.15,
          sang: 0.05,
          ventre: [1.1, 1.1],
          epaules: [1.12, 1.05],
          cuir: ['haut', 'bras', 'avantBras', 'bassin', 'cuisses', 'jambes', 'pieds'],
          roles: {
            marcher: ['marche', 0.85],
            courir: ['marche', 1.2],
            attendre: ['repos', 0.9],
            attaquer: ['attaque', 0.9],
            mordre: ['morsure', 0.9],
            crier: ['cri', 0.9],
            mourir: ['mort', 1],
          },
          prog: [
            ['marcher', 5],
            ['attaquer', 5],
            ['attendre', 2.5],
            ['mordre', 6.6],
            ['mourir', 3.5],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 7, 0]);
            piece(SPH, T.casque, t, [0, 0.02, 0], [0.125, 0.12, 0.13]);
            piece(SPH, T.noir, t, [0, -0.02, 0.08], [0.1, 0.05, 0.06]);
            const c = accroche(r, 'Spine2', [0, 0, 0]);
            for (let i = 0; i < 9; i++) {
              const a = i / 9;
              piece(
                anneau(0.022, 0.007),
                T.chaine,
                c,
                [-0.16 + a * 0.32, 0.12 - a * 0.26, 0.14 + Math.sin(a * Math.PI) * 0.02],
                [1, 1, 1],
                [0, i % 2 ? Math.PI / 2 : 0, 0.9],
              );
            }
            const e = accroche(r, 'RightShoulder', [0, 12, 0]);
            piece(SPH, T.noir, e, [0, 0, 0], [0.08, 0.07, 0.08]);
            for (let i = 0; i < 7; i++) {
              const a = (i / 7) * Math.PI * 2;
              piece(
                new THREE.ConeGeometry(0.018, 0.07, 8),
                T.chaine,
                e,
                [Math.cos(a) * 0.07, 0.02, Math.sin(a) * 0.07],
                [1, 1, 1],
                [Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3],
              );
            }
          },
        },
        {
          id: 'howl',
          taille: 0.86,
          tete: 1.08,
          bras: 1.08,
          nom: 'Hurleur',
          sprite: 'z_howl',
          texte: 'La dame au boa. En mourant, elle appelle 2 rôdeurs.',
          couleurs: {
            peau: '#aba765',
            mains: '#9a9460',
            avantBras: '#aba765',
            bras: '#7c4c47',
            haut: '#7c4c47',
            bassin: '#7c4c47',
            cuisses: '#7c4c47',
            jambes: '#aba765',
            pieds: '#3a2a24',
          },
          salete: 0.2,
          sang: 0.08,
          ventre: [1, 1.05],
          peauNue: ['avantBras', 'jambes'],
          roles: {
            marcher: ['marche2', 0.9],
            courir: ['marche', 1.2],
            attendre: ['repos', 1],
            attaquer: ['cou', 1],
            mordre: ['morsure', 1],
            crier: ['cri', 0.85],
            mourir: ['agonie', 1],
          },
          prog: [
            ['marcher', 4],
            ['crier', 3.3],
            ['attaquer', 4],
            ['crier', 3.3],
            ['mourir', 3.8],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 6, 0]);
            chevelure(t, { tex: T.gris, n: 70, tire: 0.9, long: 0.05, desordre: 0.35, folles: 12 });
            chignon(t, T.gris, [0, 0.12, -0.03], 0.055);
            const c = accroche(r, 'Neck', [0, 0, 0]);
            for (let i = 0; i < 16; i++) {
              const a = (i / 16) * Math.PI * 2;
              piece(SPH, T.fourrure, c, [Math.cos(a) * 0.12, -0.02, Math.sin(a) * 0.1], [0.055, 0.045, 0.055]);
            }
            for (let i = 0; i < 12; i++) {
              const a = Math.PI * (0.15 + i * 0.06);
              piece(SPH, T.perle, c, [Math.cos(a) * 0.07, -0.04, Math.sin(a) * 0.07 + 0.01], [0.012, 0.012, 0.012]);
            }
          },
        },
        {
          id: 'sap',
          taille: 1.06,
          tete: 1.0,
          nom: 'Sapeur',
          sprite: 'z_sap',
          texte: 'L’ouvrier de chantier. Il fonce sur les murs et explose (15 dégâts au rempart).',
          couleurs: {
            peau: ZV,
            mains: ZVm,
            avantBras: '#9d8b73',
            bras: '#9d8b73',
            haut: '#cf9342',
            bassin: '#4b3c2c',
            cuisses: '#4b3c2c',
            jambes: '#4b3c2c',
            pieds: '#2e241c',
          },
          salete: 0.3,
          sang: 0.06,
          ventre: [1.05, 1.05],
          roles: {
            marcher: ['marche', 1.1],
            courir: ['course', 1],
            attendre: ['repos', 1],
            attaquer: ['attaque', 1.1],
            mordre: ['morsure2', 1],
            crier: ['cri', 1],
            mourir: ['mort', 1.1],
          },
          prog: [
            ['courir', 4],
            ['attaquer', 4],
            ['marcher', 3],
            ['courir', 3],
            ['mourir', 3],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 8, 0]);
            piece(
              tour([
                [0, 0],
                [0.135, 0],
                [0.135, 0.012],
                [0.11, 0.02],
                [0.115, 0.07],
                [0.08, 0.11],
                [0, 0.12],
              ]),
              T.jaune,
              t,
            );
            const n = G();
            n.position.y = -0.08;
            t.add(n);
            chevelure(n, { tex: T.cheveuxBruns, n: 40, bas: -0.4, front: 0.1, long: 0.03, desordre: 0.5, folles: 2 });
            const v = accroche(r, 'Spine2', [0, 0, 0]);
            piece(SPH, T.orange, v, [0, -0.02, 0], [0.19, 0.2, 0.15]);
          },
        },
        {
          id: 'boss',
          nom: 'Le Colosse',
          sprite: 'z_boss',
          texte: 'Le catcheur masqué. Boss énorme : chaque pas fait trembler le sol.',
          couleurs: {
            peau: '#a8a46a',
            mains: ZVm,
            avantBras: '#a8a46a',
            bras: '#a8a46a',
            haut: '#71332b',
            bassin: '#71332b',
            cuisses: '#71332b',
            jambes: '#71332b',
            pieds: '#2a1508',
          },
          salete: 0.15,
          sang: 0.08,
          ventre: [1.35, 1.35],
          epaules: [1.3, 1.15],
          taille: 1.6,
          tete: 0.92,
          bras: 1.08,
          peauNue: ['bras', 'avantBras'],
          roles: {
            marcher: ['marche', 0.7],
            courir: ['marche', 1],
            attendre: ['repos', 0.7],
            attaquer: ['attaque', 0.75],
            mordre: ['morsure2', 0.7],
            crier: ['cri', 0.7],
            mourir: ['mort', 0.7],
          },
          prog: [
            ['marcher', 6],
            ['crier', 4],
            ['attaquer', 6.6],
            ['marcher', 4],
            ['mourir', 4.5],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 6, 0]);
            piece(SPH, T.masque, t, [0, 0.015, 0.005], [0.125, 0.13, 0.13], [0, Math.PI, 0]);
            const c = accroche(r, 'Spine2', [0, 0, 0]);
            piece(anneau(0.17, 0.012), T.laiton, c, [0, 0.08, 0], [1, 1, 0.8], [Math.PI / 2, 0, 0]);
            ['LeftForeArm', 'RightForeArm'].forEach(n =>
              piece(
                anneau(0.045, 0.02),
                T.rougeVif,
                accroche(r, n, [0, 20, 0]),
                [0, 0, 0],
                [1, 1, 1],
                [Math.PI / 2, 0, 0],
              ),
            );
          },
        },
        {
          id: 'mere',
          taille: 0.84,
          tete: 1.12,
          nom: 'La Mère',
          sprite: 'z_mere',
          texte: 'La grand-mère en robe rose. Boss : elle fait naître des zombies autour d’elle.',
          couleurs: {
            peau: '#aba765',
            mains: '#9a9460',
            avantBras: '#aba765',
            bras: '#b27c71',
            haut: '#b27c71',
            bassin: '#b27c71',
            cuisses: '#b27c71',
            jambes: '#aba765',
            pieds: '#3a2a24',
          },
          salete: 0.2,
          sang: 0.06,
          ventre: [1.15, 1.2],
          peauNue: ['avantBras', 'jambes'],
          roles: {
            marcher: ['marche2', 0.7],
            courir: ['marche', 0.9],
            attendre: ['repos', 0.8],
            attaquer: ['attaque', 0.8],
            mordre: ['morsure', 0.8],
            crier: ['cri', 0.8],
            mourir: ['mort', 0.8],
          },
          prog: [
            ['marcher', 6],
            ['crier', 3.5],
            ['attendre', 3],
            ['attaquer', 6],
            ['mourir', 4],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 6, 0]);
            chevelure(t, {
              tex: T.gris,
              n: 70,
              tire: 0.6,
              long: 0.035,
              large: 0.03,
              epais: 0.022,
              desordre: 0.6,
              boucles: 0.6,
              folles: 4,
            });
            chignon(t, T.gris, [0, 0.1, -0.03], 0.055);
            [-1, 1].forEach(s =>
              piece(SPH, T.noeudRose, t, [s * 0.05, 0.13, -0.03], [0.045, 0.025, 0.02], [0, 0, s * 0.4]),
            );
          },
        },
        {
          id: 'zero',
          nom: 'Le Patient Zéro',
          sprite: 'z_zero',
          texte: 'L’homme à la combinaison jaune. Boss : autour de lui, la horde accélère.',
          couleurs: {
            peau: '#a8a46a',
            mains: '#3a322e',
            avantBras: '#cd982f',
            bras: '#cd982f',
            haut: '#cd982f',
            bassin: '#cd982f',
            cuisses: '#cd982f',
            jambes: '#cd982f',
            pieds: '#3a322e',
          },
          salete: 0.3,
          sang: 0.1,
          ventre: [1.1, 1.1],
          epaules: [1.1, 1.05],
          taille: 1.18,
          tete: 1.0,
          bras: 1.06,
          roles: {
            marcher: ['marche', 1.1],
            courir: ['course', 1.05],
            attendre: ['repos', 1],
            attaquer: ['cou', 1.2],
            mordre: ['morsure', 1],
            crier: ['cri', 1],
            mourir: ['agonie', 1],
          },
          prog: [
            ['courir', 4],
            ['crier', 2.8],
            ['attaquer', 4],
            ['marcher', 3],
            ['mourir', 3.8],
          ],
          habiller(r) {
            const t = accroche(r, 'Head', [0, 4, 0]);
            piece(SPH, T.noir, t, [0, -0.03, 0.08], [0.08, 0.07, 0.05]);
            [-1, 1].forEach(s => {
              piece(
                new THREE.CylinderGeometry(0.035, 0.035, 0.06, 14),
                T.filtre,
                t,
                [s * 0.065, -0.04, 0.1],
                [1, 1, 1],
                [Math.PI / 2, 0, s * 0.4],
              );
            });
            piece(anneau(0.1, 0.012), T.noir, t, [0, 0.0, 0], [1, 1, 1], [Math.PI / 2 - 0.2, 0, 0]);
            for (let i = 0; i < 7; i++) {
              const a = R(0, 6.3),
                m = new THREE.Mesh(MECHE, materiauMeche(T.cheveuxBruns));
              m.position.set(Math.cos(a) * 0.08, 0.05 + R(0, 0.04), Math.sin(a) * 0.08 - 0.02);
              m.scale.set(0.012, 0.03, 0.008);
              m.rotation.set(R(-0.8, 0.8), 0, R(-0.8, 0.8));
              t.add(m);
            }
          },
        },
      ];

      // habille un corps X Bot : silhouette, proportions, peinture du corps, accessoires et coiffure
      function habiller(obj, Z) {
        const meshes = [];
        obj.traverse(o => {
          if (o.isSkinnedMesh) meshes.push(o);
        });
        silhouette(obj, Z.ventre || [1, 1], Z.epaules || [1, 1]);
        if (Z.tete) os(obj, 'Head').scale.setScalar(Z.tete);
        if (Z.bras) ['LeftArm', 'RightArm'].forEach(n => os(obj, n).scale.set(1, Z.bras, 1));
        meshes.forEach(m => peindreCorps(m, Z.couleurs, Z.salete, Z.sang, Z));
        Z.habiller(obj, {});
      }
      return { ROSTER, habiller };
    }

    // ---------- Photo des animations ----------
    const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    const TAILLE = 128;
    rendu.setPixelRatio(1);
    rendu.setSize(TAILLE, TAILLE, false);
    rendu.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x5a4a30, 0.75));
    const soleil = new THREE.DirectionalLight(0xfff0d8, 0.8);
    soleil.position.set(-3, 10, 3);
    scene.add(soleil);
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
    const TOUR = Math.PI * 2;
    // Chaque personnage : une boucle de repos (ou de marche) et ses gestes, joués quand le jeu le demande
    const LISTE = [
      {
        cle: 'gun',
        faire: pistolero,
        demi: 0.62,
        cz: 0.12,
        clips: {
          repos: { duree: 4, n: 24, boucle: true, anim: (p, dt, t) => poseGun(p, dt, t, false, 0, 0, true) },
          tir0: { duree: 0.36, n: 6, anim: (p, dt, t) => poseGun(p, dt, t, t === 0, 0, 0, true) },
          tir1: { duree: 0.36, n: 6, anim: (p, dt, t) => poseGun(p, dt, t, t === 0, 1, 0, true) },
        },
      },
      {
        cle: 'axe',
        faire: bucheron,
        demi: 0.78,
        cz: 0.15,
        clips: {
          repos: { duree: 4, n: 24, boucle: true, anim: (p, dt, t) => poseHache(p, dt, t, -1, 0) },
          attaque: { duree: 0.6, n: 10, anim: (p, dt, t) => poseHache(p, dt, t, Math.min(1, 0.3 + t / 0.6), 0) },
        },
      },
      {
        cle: 'flame',
        faire: lanceFlammes,
        demi: 0.8,
        cz: 0.2,
        clips: {
          repos: { duree: 4, n: 24, boucle: true, anim: (p, dt, t) => poseFeu(p, dt, t, false, 0) },
          attaque: { duree: TOUR / 2.2, n: 18, boucle: true, anim: (p, dt, t) => poseFeu(p, dt, t, true, 0) },
        },
      },
    ];
    function photographier(o) {
      const clips = {};
      for (const nom in o.clips) {
        const c = o.clips[nom];
        // un modèle neuf par geste, mis en route sur sa pose de départ
        const p = o.faire();
        scene.add(p.racine);
        const depart = c.boucle ? c : o.clips.repos,
          W = TOUR / depart.duree;
        BOUCLE = { souffle: W * 2, poids: W };
        bruit = (t, s) =>
          Math.sin(t * W + s) * 0.5 + Math.sin(t * W * 2 + s * 1.7) * 0.3 + Math.sin(t * W * 3 + s * 2.3) * 0.2;
        const pasDepart = depart.duree / depart.n / 4;
        for (let t = 0; t < depart.duree * 3; t += pasDepart) depart.anim(p, pasDepart, t);
        const pas = c.duree / c.n / 4,
          t0 = c.boucle ? depart.duree * 3 : 0;
        if (!c.boucle) {
          const W2 = TOUR / c.duree;
          bruit = (t, s) => Math.sin(t * W2 + s) * 0.5 + Math.sin(t * W2 * 2 + s * 1.7) * 0.3;
        }
        Object.assign(cam, { left: -o.demi, right: o.demi, top: o.demi, bottom: -o.demi });
        cam.position.set(0, 20, o.cz + 0.001);
        cam.up.set(0, 0, -1);
        cam.lookAt(0, 0.5, o.cz);
        cam.updateProjectionMatrix();
        const images = [];
        for (let i = 0; i < c.n; i++) {
          for (let k = 0; k < 4; k++) c.anim(p, pas, t0 + (i * c.duree) / c.n + k * pas);
          rendu.render(scene, cam);
          const cv = document.createElement('canvas');
          cv.width = cv.height = TAILLE;
          cv.getContext('2d').drawImage(rendu.domElement, 0, 0);
          images.push(cv);
        }
        scene.remove(p.racine);
        BOUCLE = null;
        clips[nom] = { images, duree: c.duree, boucle: !!c.boucle };
      }
      // le dessin de l'artiste remplit son image ; le modèle laisse une marge autour
      ATLAS[o.cle] = { clips, echelle: 1.25 };
    }
    // ---------- Zombies : corps Mixamo habillés, animés par la capture de mouvement ----------
    const ZTAILLE = 112; // images un peu plus petites : 11 zombies, 4 gestes chacun
    function photographierZombie(Z, M, base, CLIPS) {
      const obj = new THREE.FBXLoader().parse(base, '');
      obj.scale.setScalar(0.01 * (Z.taille || 1));
      M.habiller(obj, Z);
      scene.add(obj);
      const mixer = new THREE.AnimationMixer(obj),
        demi = 0.62 * (Z.taille || 1);
      Object.assign(cam, { left: -demi, right: demi, top: demi, bottom: -demi });
      cam.position.set(0, 20, 0.12 * (Z.taille || 1) + 0.001);
      cam.up.set(0, 0, -1);
      cam.lookAt(0, 0.5, 0.12 * (Z.taille || 1));
      cam.updateProjectionMatrix();
      rendu.setSize(ZTAILLE, ZTAILLE, false);
      // geste du jeu -> rôle Mixamo du zombie ; la chute n'en garde que le début (le jeu l'efface en 0,5 s)
      const GESTES = {
        marche: [Z.id === 'run' || Z.id === 'zero' ? 'courir' : 'marcher', 12, true],
        repos: ['attendre', 8, true],
        attaque: ['attaquer', 10, true],
        mort: ['mourir', 6, false, 0.6],
      };
      const clips = {};
      for (const geste in GESTES) {
        const [role, n, boucle, coupe] = GESTES[geste],
          [nomClip, vitesse] = Z.roles[role],
          clip = CLIPS[nomClip],
          duree = coupe || clip.duration / vitesse;
        mixer.stopAllAction();
        const action = mixer.clipAction(clip);
        action.play();
        const images = [];
        for (let i = 0; i < n; i++) {
          action.time = (i / n) * duree * vitesse;
          mixer.update(0);
          rendu.render(scene, cam);
          const cv = document.createElement('canvas');
          cv.width = cv.height = ZTAILLE;
          cv.getContext('2d').drawImage(rendu.domElement, 0, 0);
          images.push(cv);
        }
        clips[geste] = { images, duree, boucle };
      }
      scene.remove(obj);
      rendu.setSize(TAILLE, TAILLE, false);
      ATLAS['z_' + Z.id] = { clips, echelle: 1.3 };
    }
    // un personnage à la fois, pour ne pas figer l'écran au lancement : d'abord les survivants, puis les zombies
    const file = LISTE.map(o => () => photographier(o));
    Promise.all([
      fetch('assets/3d/xbot.fbx').then(r => r.arrayBuffer()),
      fetch('assets/3d/zombies-clips.json').then(r => r.json()),
    ])
      .then(([base, json]) => {
        const M = zombiesMixamo(THREE),
          CLIPS = {};
        for (const nom in json) {
          CLIPS[nom] = THREE.AnimationClip.parse(json[nom]);
          CLIPS[nom].uuid = THREE.MathUtils.generateUUID(); // sans identifiant, le moteur confond tous les clips
        }
        M.ROSTER.forEach(Z => file.push(() => photographierZombie(Z, M, base, CLIPS)));
      })
      .catch(e => console.warn(e));
    (function suivant() {
      const tache = file.shift();
      if (tache)
        try {
          tache();
        } catch (e) {
          console.warn(e);
        }
      setTimeout(suivant, tache ? 30 : 300);
    })();
  }
})();
