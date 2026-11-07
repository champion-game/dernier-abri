// v230 : quatrième série d'effets (validée par Amine). Affichage seulement, aucune règle ne change.
// 1 gel court sur les gros coups ; 2 morts selon l'arme (cendres, morceaux, flèche, coup de lame) ; 3 corps et douilles au sol jusqu'à l'aube ;
// 4 douilles éjectées ; 5 pluie et orage visibles ; 6 réactions des unités (sursaut, poing levé) ; 7 petits gestes le jour ;
// 8 lumière de l'abri qui s'allume en vacillant à la tombée de la nuit ; 9 caméra qui suit la pression de la horde (ordinateur).
// Rien ne bouge si le système demande moins d'animations ; le Mode économie garde l'essentiel en plus léger.
const FX3 = {
  hs: 0,
  hsT: 0,
  corp: [],
  cas: [],
  g: null,
  react: [],
  idle: [],
  nextIdle: 0,
  drops: [],
  bolt: -1e9,
  nextBolt: 0,
  nightT: -1e9,
  wasBusy: false,
  cam: 0,
};
const FX3_FIRE = new Set(['flame', 'heavyflame', 'fire', 'firetrap', 'napalm', 'brasero', 'chief_pyro', 'molo']);
const FX3_BOOM = new Set(['rocket', 'mortar', 'grenade', 'dyn', 'mine', 'clay', 'air', 'bomber', 'sap', 'napalm']);
const FX3_BOW = new Set(['xbow', 'tracker', 'bow']);
const FX3_BLADE = new Set([
  'cop',
  'butch',
  'monk',
  'riot',
  'pitch',
  'chief_farm',
  'slaughter',
  'saint',
  'amb',
  'orderly',
  'chief_care',
  'axe',
  'assassin',
]);
const FX3_GUN = new Set([
  'gun',
  'snp',
  'mg',
  'kid',
  'swat',
  'vigile',
  'sentry',
  'turret',
  'bunker',
  'chief_police',
  'chief_mil',
  'hunter',
  'nightsnp',
  'autogun',
  'gang',
  'fortin',
  'doc',
  'nailer',
  'ranger',
  'chief_comm',
  'chief_tech',
  'rosa',
  'hirond',
  'chief_rail',
  'sht',
]);
function fx3Reset() {
  FX3.corp.length = 0;
  FX3.cas.length = 0;
  FX3.react.length = 0;
  FX3.idle.length = 0;
  FX3.g = G;
}

// 1 : gel court (40 à 120 ms) : tout le plateau s'arrête une fraction de seconde, ce qui donne du poids au coup
function hitStop(ms) {
  if (reduce || !OPT.shake) return;
  const now = performance.now();
  if (now < FX3.hs) return;
  FX3.hs = now + ms;
  FX3.hsT = now;
}
{
  const f0 = frameInner;
  frameInner = function (now) {
    if (now < FX3.hs) now = FX3.hsT;
    return f0.call(this, now);
  };
}

// 2, 3, 4 et 6 : lecture des événements de la nuit
{
  const p0 = playEvents;
  playEvents = function (ev, types, now) {
    const r = p0.apply(this, arguments);
    try {
      fx3Events(ev, types, now);
    } catch (e) {}
    return r;
  };
}
function fx3Events(ev, types, now) {
  if (FX3.g !== G) fx3Reset();
  const src = {},
    booms = ev.filter(e => e.k === 'boom').map(e => tc(e.i)),
    kills = {};
  for (const e of ev) {
    if (e.k === 'hit' && e.zid != null) {
      const t = e.src >= 0 ? types[e.src] : null;
      src[e.zid] = t || 'r';
      const dm = parseInt(String(e.txt || '').replace('−', '')) || 0;
      if (dm >= 10) hitStop(55);
      // douilles : chaque tir d'arme à feu éjecte une douille sur le côté, qui reste au sol jusqu'à l'aube
      if (t && FX3_GUN.has(t) && e.src >= 0) {
        const sp = tc(e.src),
          a = (facing[e.src] || 0) + (Math.PI / 2) * (Math.random() < 0.5 ? 1 : -1),
          d = 8 + Math.random() * 9;
        PT.push({
          x: sp.x,
          y: sp.y,
          vx: (Math.cos(a) * d) / 300,
          vy: (Math.sin(a) * d) / 300,
          t0: now,
          dur: 300,
          c: '#e2b24a',
          r: 1.3,
          light: 0,
        });
        if (!OPT.eco) {
          FX3.cas.push({ x: sp.x + Math.cos(a) * d, y: sp.y + Math.sin(a) * d, a: Math.random() * 3, t0: now + 300 });
          if (FX3.cas.length > 90) FX3.cas.splice(0, FX3.cas.length - 90);
        }
      }
    }
  }
  for (const e of ev) {
    if (e.k !== 'die') continue;
    const v = V.get(e.zid),
      p = v ? (v.dying ? { x: v.dx, y: v.dy } : zpos(v, now)) : tc(e.i),
      t = src[e.zid],
      k = v ? v.k : 'walk',
      big = ['fat', 'armor', 'howl', 'sap'].includes(k) || e.boss;
    if (e.boss) hitStop(120);
    else if (big) hitStop(70);
    if (t && t !== 'r') kills[t] = (kills[t] || 0) + 1;
    const boom = (t && FX3_BOOM.has(t)) || booms.some(b => Math.hypot(b.x - p.x, b.y - p.y) < T * 1.6);
    const ang = Math.random() * 6.28,
      sz = k === 'fat' ? 1.3 : e.boss ? 1.7 : k === 'crawl' ? 0.8 : 1;
    if (t && FX3_FIRE.has(t)) {
      // brûlé : cendres qui montent et braises, corps calciné
      const n = OPT.eco ? 5 : 12;
      for (let j = 0; j < n; j++)
        PT.push({
          x: p.x + (Math.random() - 0.5) * 12,
          y: p.y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.012,
          vy: -0.02 - Math.random() * 0.03,
          t0: now,
          dur: 700 + Math.random() * 600,
          c: j % 3 ? '#5a554e' : '#ff9a2e',
          r: 1.4 + Math.random() * 1.6,
          light: j % 5 ? 0 : 14,
        });
      FX3.corp.push({ x: p.x, y: p.y, a: ang, sz, k, burnt: 1, t0: now + 250 });
    } else if (boom) {
      // explosion : morceaux projetés loin, pas de corps entier
      const n = OPT.eco ? 4 : 9;
      for (let j = 0; j < n; j++) {
        const a = Math.random() * 6.28,
          s = 0.08 + Math.random() * 0.12;
        PT.push({
          x: p.x,
          y: p.y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          t0: now,
          dur: 380 + Math.random() * 260,
          c: j % 3 ? '#6a1418' : '#7f8a5a',
          r: 2 + Math.random() * 1.8,
          light: 0,
        });
      }
      FX3.corp.push({ x: p.x, y: p.y, a: ang, sz, k, gib: 1, t0: now + 200 });
    } else {
      if (t && FX3_BLADE.has(t)) {
        const a = (e.src >= 0 && facing[e.src] != null ? facing[e.src] : ang) + Math.PI / 2;
        addFX({
          type: 'tracer',
          x1: p.x - Math.cos(a) * 13,
          y1: p.y - Math.sin(a) * 13,
          x2: p.x + Math.cos(a) * 13,
          y2: p.y + Math.sin(a) * 13,
          c: '#f4efe2',
          w: 2.2,
          dur: 170,
        });
      }
      FX3.corp.push({
        x: p.x,
        y: p.y,
        a: ang,
        sz,
        k,
        arrow: t && FX3_BOW.has(t) ? ang + 1 + Math.random() : null,
        t0: now + 380,
      });
    }
  }
  {
    const m = OPT.eco ? 25 : 60;
    if (FX3.corp.length > m) FX3.corp.splice(0, FX3.corp.length - m);
  }
  // 6 : réactions. Survivant tombé : les voisins sursautent. Carnage (4+ d'un coup) ou boss abattu : l'auteur lève le poing
  for (const e of ev) {
    if (e.k === 'lost' && e.name && e.i != null) {
      for (let j = 0; j < G.grid.length; j++) {
        const u = G.grid[j];
        if (u && j !== e.i && Z.isUnit(u.t) && Z.manh(j, e.i) <= 2) FX3.react[j] = { t: now + 80, k: 'scare' };
      }
    }
  }
  const multi = {};
  for (const e of ev) {
    if (e.k === 'hit' && e.src >= 0 && ev.some(d => d.k === 'die' && d.zid === e.zid))
      (multi[e.src] = multi[e.src] || new Set()).add(e.zid);
  }
  for (const s in multi)
    if (multi[s].size >= 4) {
      FX3.react[s] = { t: now + 150, k: 'cheer' };
      hitStop(60);
    }
  if (ev.some(e => e.k === 'die' && e.boss))
    G.grid.forEach((u, j) => {
      if (u && Z.isUnit(u.t)) FX3.react[j] = { t: now + 300 + Math.random() * 200, k: 'cheer' };
    });
}

// 3 : corps et douilles dessinés sous les zombies ; ils partent en fumée quand le rayon de l'aube les touche
function fx3DawnK(x) {
  const dq = (performance.now() - dawnT) / DAWN;
  if (dq < 0 || dq >= 1 || nightTarget !== 0) return 1;
  const s = x / L;
  return Math.max(0, Math.min(1, (s - (dq * 1.35 - 0.3)) / 0.3));
}
function fx3Corpses(now) {
  if (FX3.g !== G) fx3Reset();
  const dq = (now - dawnT) / DAWN;
  if (!S.busy && nightTarget === 0 && (dq >= 1 || dq < 0) && nightAmt < 0.05) {
    if (FX3.corp.length || FX3.cas.length) {
      FX3.corp.length = 0;
      FX3.cas.length = 0;
    }
    return;
  }
  for (const c of FX3.cas) {
    if (now < c.t0) continue;
    const a = fx3DawnK(c.x);
    if (a <= 0) continue;
    ctx.globalAlpha = 0.85 * a;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.a);
    ctx.fillStyle = '#c99a3a';
    ctx.fillRect(-1.6, -0.7, 3.2, 1.4);
    ctx.restore();
  }
  for (const c of FX3.corp) {
    const q = Math.min(1, (now - c.t0) / 250);
    if (q <= 0) continue;
    const a = fx3DawnK(c.x);
    if (a <= 0) {
      if (!c.smoke) {
        c.smoke = 1;
        burst(c.x, c.y, 'rgba(200,200,200,.5)', 4, 0.03, 3);
      }
      continue;
    }
    ctx.save();
    ctx.globalAlpha = q * a * 0.92;
    ctx.translate(c.x, c.y);
    ctx.rotate(c.a);
    ctx.scale(c.sz, c.sz);
    if (c.gib) {
      ctx.fillStyle = 'rgba(90,14,18,.8)';
      for (let j = 0; j < 4; j++) {
        ctx.beginPath();
        ctx.ellipse(Math.cos(j * 1.9) * 7, Math.sin(j * 2.3) * 6, 2.6, 1.8, j, 0, 7);
        ctx.fill();
      }
    } else {
      const body = c.burnt ? '#1d1a17' : '#3c4630',
        head = c.burnt ? '#2a2420' : '#5d6b48';
      ctx.fillStyle = 'rgba(0,0,0,.25)';
      ctx.beginPath();
      ctx.ellipse(1, 1.5, 11, 7, 0, 0, 7);
      ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(-1, 0, 8.5, 5.5, 0, 0, 7);
      ctx.fill();
      ctx.strokeStyle = body;
      ctx.lineWidth = 2.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(3, -4);
      ctx.lineTo(10, -8);
      ctx.moveTo(2, 4);
      ctx.lineTo(9, 6);
      ctx.moveTo(-7, -3);
      ctx.lineTo(-13, -5);
      ctx.moveTo(-7, 3);
      ctx.lineTo(-12, 6);
      ctx.stroke();
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(9, 0, 4.2, 0, 7);
      ctx.fill();
      if (c.arrow != null) {
        ctx.rotate(c.arrow - c.a);
        ctx.strokeStyle = '#cbb489';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(11, 0);
        ctx.stroke();
        ctx.fillStyle = '#e8e0cc';
        ctx.fillRect(9, -1.6, 3, 3.2);
      }
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
{
  const d0 = drawPlace;
  drawPlace = function (now) {
    const r = d0.apply(this, arguments);
    try {
      fx3Corpses(now);
    } catch (e) {}
    return r;
  };
}

// 6 et 7 : réactions la nuit, petits gestes le jour (regarder autour, petit saut, se retourner)
{
  const u0 = unitAnim;
  unitAnim = function (i, u, now, sc) {
    try {
      if (!reduce && Z.isUnit(u.t)) {
        const r = FX3.react[i];
        if (r) {
          const t = now - r.t;
          if (t >= 0 && t < (r.k === 'cheer' ? 900 : 520)) {
            if (r.k === 'scare') {
              const k = Math.sin((t / 520) * Math.PI);
              ctx.translate(Math.sin(t / 22) * 2 * k, -7 * k);
            } else {
              const k = Math.abs(Math.sin((t / 450) * Math.PI * 2));
              ctx.translate(0, -8 * k);
              ctx.scale(1 + 0.06 * k, 1 + 0.06 * k);
            }
          } else if (t >= 900) FX3.react[i] = null;
        }
        const d = FX3.idle[i];
        if (d && !S.busy) {
          const t = now - d.t;
          if (t < d.dur) {
            const q = t / d.dur;
            if (d.k === 'look') ctx.rotate(Math.sin(q * Math.PI * 2) * 0.32);
            else if (d.k === 'hop') {
              const k = Math.sin(q * Math.PI);
              ctx.translate(0, -5 * k);
            } else ctx.rotate(Math.sin(q * Math.PI) * 0.6);
          } else FX3.idle[i] = null;
        }
      }
    } catch (e) {}
    return u0.apply(this, arguments);
  };
}
function fx3Idle(now) {
  if (reduce || S.busy || !G || now < FX3.nextIdle) return;
  FX3.nextIdle = now + 1400 + Math.random() * 2200;
  const us = [];
  G.grid.forEach((u, j) => {
    if (u && Z.isUnit(u.t)) us.push(j);
  });
  if (!us.length) return;
  const j = us[Math.floor(Math.random() * us.length)],
    ks = ['look', 'look', 'hop', 'turn'];
  const k = ks[Math.floor(Math.random() * ks.length)];
  FX3.idle[j] = { t: now, k, dur: k === 'hop' ? 420 : k === 'look' ? 1300 : 900 };
}

// 8 : à la tombée de la nuit, la lumière de l'abri s'allume en vacillant, comme une ampoule qui hésite
{
  const l0 = lights;
  lights = function (now) {
    const ls = l0.apply(this, arguments);
    try {
      const t = now - FX3.nightT;
      if (t >= 0 && t < 1300 && ls[0] && !reduce) {
        const on =
          t > 1000 ||
          [
            [0, 90],
            [200, 260],
            [380, 560],
            [700, 1000],
          ].some(([a, b]) => t >= a && t < b);
        ls[0].a = on ? ls[0].a : 0.04;
        ls[0].r *= on ? 1 : 0.6;
      }
      if (now - FX3.bolt < 240) {
        const k = 1 - (now - FX3.bolt) / 240;
        ls.unshift({ x: CEN.x, y: CEN.y, r: L * 0.95, c: 'cold', a: 0.55 * k });
      }
    } catch (e) {}
    return ls;
  };
}

// 5 : pluie (nuit « Pluie ») et orage (« Coupure de courant » : la ville est privée de courant par l'orage)
function fx3Weather(now, g, w, h, sc) {
  const ev = G && G.event && G.event.id,
    rain = S.busy && (ev === 'pluie' || ev === 'coupure'),
    storm = S.busy && ev === 'coupure';
  if (!rain || reduce) {
    FX3.drops.length = 0;
    return;
  }
  const n = OPT.eco ? 40 : ev === 'coupure' ? 130 : 100;
  while (FX3.drops.length < n)
    FX3.drops.push({
      x: Math.random() * w,
      y: Math.random() * h,
      v: 0.7 + Math.random() * 0.5,
      l: 8 + Math.random() * 10,
    });
  g.save();
  g.strokeStyle = 'rgba(170,190,225,.42)';
  g.lineWidth = Math.max(1, sc);
  g.beginPath();
  for (const d of FX3.drops) {
    d.y += d.v * 16 * sc;
    d.x -= d.v * 3 * sc;
    if (d.y > h) {
      d.y = -d.l * sc;
      d.x = Math.random() * w * 1.1;
    }
    if (d.x < 0) d.x += w;
    g.moveTo(d.x, d.y);
    g.lineTo(d.x + 3 * sc, d.y - d.l * sc);
  }
  g.stroke();
  // petites éclaboussures au sol
  if (!OPT.eco) {
    g.fillStyle = 'rgba(190,205,235,.35)';
    for (let j = 0; j < 6; j++) {
      g.beginPath();
      g.ellipse(Math.random() * w, Math.random() * h, 2.5 * sc, 1.2 * sc, 0, 0, 7);
      g.fill();
    }
  }
  if (storm) {
    if (now > FX3.nextBolt) {
      FX3.nextBolt = now + 5000 + Math.random() * 7000;
      if (FX3.bolt > 0 || now > FX3.nightT + 2500) {
        FX3.bolt = now;
        try {
          setTimeout(() => SFX.play('boom', 0.35), 260);
        } catch (e) {}
      }
    }
    const t = now - FX3.bolt;
    if (t < 320) {
      const a = t < 60 ? 0.55 : t < 110 ? 0.1 : t < 170 ? 0.4 : 0.4 * (1 - (t - 170) / 150);
      g.fillStyle = `rgba(225,232,255,${Math.max(0, a).toFixed(3)})`;
      g.fillRect(0, 0, w, h);
    }
  }
  g.restore();
}
// couche du temps : au-dessus de tout le plateau (forêt comprise) dans le style artiste, sinon sur le canvas du jeu
function fx3Layer() {
  if (!DE.classList.contains('ax3')) return null;
  const b = $('#axBoard');
  if (!b) return null;
  let c = $('#axWx');
  if (!c) {
    c = document.createElement('canvas');
    c.id = 'axWx';
    c.setAttribute('aria-hidden', 'true');
    b.appendChild(c);
  } else if (c.parentNode !== b) b.appendChild(c);
  return c;
}
{
  const f1 = frameInner;
  frameInner = function (now) {
    const r = f1.apply(this, arguments);
    try {
      if (S.busy && !FX3.wasBusy) FX3.nightT = now;
      FX3.wasBusy = !!S.busy;
      fx3Idle(now);
      const c = fx3Layer();
      if (c) {
        const W = c.clientWidth,
          H = c.clientHeight,
          dpr = Math.min(2, OPT.eco ? 1 : devicePixelRatio || 1),
          w = Math.round(W * dpr),
          h = Math.round(H * dpr);
        if (c.width !== w || c.height !== h) {
          c.width = w;
          c.height = h;
          FX3.drops.length = 0;
        }
        const g = c.getContext('2d');
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, w, h);
        fx3Weather(now, g, w, h, (dpr * W) / 600);
      } else {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        fx3Weather(now, ctx, ctx.canvas.width, ctx.canvas.height, ctx.canvas.width / 600);
        ctx.restore();
      }
      fx3Cam(now);
    } catch (e) {}
    return r;
  };
}

// 9 : caméra (ordinateur, style artiste) : le plateau avance doucement vers le joueur quand la horde approche de l'abri
function fx3Cam(now) {
  const b = $('#axBoard');
  if (!b) return;
  const on = DE.classList.contains('ax3') && DE.classList.contains('felton') && S.busy && !reduce && OPT.shake && G;
  let k = 0;
  if (on && G.z.length) {
    let d = 99;
    for (const z of G.z) d = Math.min(d, Z.manh(z.pos, Z.C));
    k = Math.max(0, Math.min(1, (4.5 - d) / 3.5));
  }
  FX3.cam += (k - FX3.cam) * 0.03;
  if (FX3.cam < 0.002 && !on) {
    if (b.style.scale) {
      b.style.scale = '';
    }
    FX3.cam = 0;
    return;
  }
  b.style.scale = (1 + 0.018 * FX3.cam).toFixed(4);
}
