/* Zombies 3D de Barricard (aperçu ?3d=1) : habillage du corps Mixamo X Bot pour chaque zombie du jeu
   (couleurs par zone relevées sur les dessins, motifs, coiffure, accessoires, proportions).
   Généré depuis la maquette « Barricard roster zombies 3D » ; utilisé en jeu (src/game-3d.js) et par tools/export-3d.js. */
window.zombiesMixamo = function (THREE) {
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
  const bruit3 = (x, y, z) => Math.sin(x * 9.1 + y * 3.7) * Math.cos(y * 7.3 - z * 5.1) * Math.sin(z * 8.7 + x * 2.3);
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
    zone === 'peau' || zone === 'mains' || (Z.peauNue || []).includes(zone) ? 0 : (Z.cuir || []).includes(zone) ? 2 : 1;
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
          piece(anneau(0.035, 0.014), T.rose, accroche(r, n, [0, 20, 0]), [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]),
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
        [-1, 1].forEach(s => piece(SPH, T.bandana, c, [s * 0.04, 0, -0.09], [0.045, 0.02, 0.025], [0, 0, s * 0.45]));
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
          piece(anneau(0.045, 0.02), T.rougeVif, accroche(r, n, [0, 20, 0]), [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]),
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
    // repères des yeux sur la tête (en centimètres, devant le visage) : le jeu y dessine la lueur des yeux
    [
      ['oeilG', 3],
      ['oeilD', -3],
    ].forEach(([nom, x]) => {
      const oeil = new THREE.Object3D();
      oeil.name = nom;
      oeil.position.set(x, 8, 9.5);
      os(obj, 'Head').add(oeil);
    });
  }
  // Réunit les accessoires de chaque os en quelques objets (un par texture, plus un seul contour) :
  // un zombie passe d'environ 80 objets à dessiner à une quinzaine, indispensable pour une horde en 3D en direct
  const contourFusionne = new THREE.MeshBasicMaterial({ color: 0x17110d, side: THREE.BackSide });
  function fusionner(obj) {
    obj.updateMatrixWorld(true);
    const groupes = new Map(),
      retires = [],
      inv = new THREE.Matrix4(),
      m = new THREE.Matrix4();
    obj.traverse(o => {
      if (!o.isMesh || o.isSkinnedMesh) return;
      let os_ = o.parent;
      while (os_ && !os_.isBone) os_ = os_.parent;
      if (!os_) return;
      inv.copy(os_.matrixWorld).invert();
      m.multiplyMatrices(inv, o.matrixWorld);
      const contour = !!o.material.isShaderMaterial;
      const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      for (const nom of Object.keys(g.attributes))
        if (!['position', 'normal', 'uv'].includes(nom)) g.deleteAttribute(nom);
      if (contour) {
        // épaisseur du contour reportée dans la forme : un seul matériau noir pour tous
        const e = +(o.material.vertexShader.match(/normal \* ([\d.]+)/) || [0, 0])[1];
        const p = g.attributes.position,
          n = g.attributes.normal;
        for (let i = 0; i < p.count; i++)
          p.setXYZ(i, p.getX(i) + n.getX(i) * e, p.getY(i) + n.getY(i) * e, p.getZ(i) + n.getZ(i) * e);
      }
      g.applyMatrix4(m);
      const cle =
        os_.uuid +
        '|' +
        (contour
          ? 'contour'
          : (o.material.map ? o.material.map.uuid : '-') + (o.material.color ? o.material.color.getHexString() : ''));
      if (!groupes.has(cle)) groupes.set(cle, { os: os_, mat: o.material, contour, geos: [] });
      groupes.get(cle).geos.push(g);
      retires.push(o);
    });
    retires.forEach(o => o.parent && o.parent.remove(o));
    for (const { os: o, mat, contour, geos } of groupes.values()) {
      const geo = THREE.BufferGeometryUtils.mergeBufferGeometries(geos);
      if (!geo) continue;
      const mesh = new THREE.Mesh(
        geo,
        contour
          ? contourFusionne
          : new THREE.MeshToonMaterial({ map: mat.map, color: mat.color, gradientMap: degrade }),
      );
      o.add(mesh);
    }
  }
  return { ROSTER, habiller, fusionner };
};
