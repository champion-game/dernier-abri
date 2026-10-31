"""Pack d'interface « maquette » (d'après la maquette d'Amine) : panneaux noir charbon à bord gris usé,
parchemin aux bords brûlés, bouton rouge taché, pastilles, vitesse, losanges de nuit...
Sortie : assets/art/ui/pack2/*.png (transparents, taille x2) + planche d'aperçu.
Lancer : python3 tools/ui_pack2.py [dossier_apercu]"""
import os, sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
import textures as T

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'assets', 'art', 'ui', 'pack2')
PREV = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'test-out')
SEED = [100]

def nz(w, h, fx, fy=None):
    SEED[0] += 1; n = T.noise(fx, fy or fx, SEED[0])
    return np.tile(n, (h // T.S + 1, w // T.S + 1))[:h, :w].astype(np.float32)

def sdf(w, h, r, inset=0):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32) + .5
    qx = np.abs(x - w / 2) - (w / 2 - inset - r); qy = np.abs(y - h / 2) - (h / 2 - inset - r)
    return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r

def band(sd, a, b, soft=.8):
    """1 entre les distances a et b (négatif = dedans)"""
    return np.clip((sd - a) / soft + .5, 0, 1) * np.clip((b - sd) / soft + .5, 0, 1)

def mix(c, col, t): return c * (1 - t[..., None]) + np.array(col, np.float32) * t[..., None]

def finish(c, a, M=14, dy=6, blur=8, op=.75):
    h, w = a.shape; W, H = w + 2 * M, h + 2 * M + dy
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    el = Image.fromarray(np.dstack([np.clip(c, 0, 255), np.clip(a, 0, 1) * 255]).astype(np.uint8), 'RGBA')
    if op:
        s = Image.new('L', (W, H), 0); s.paste(el.getchannel('A'), (M, M + dy))
        s = s.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * op))
        im.paste((0, 0, 0, 255), (0, 0), s)
    im.alpha_composite(el, (M, M)); return im

# ---------- matières ----------
def charbon(w, h, r=10, light=1., border=(96, 94, 90)):
    """panneau noir charbon : dégradé léger, grain, bord gris fin et usé, filet sombre intérieur"""
    sd = sdf(w, h, r); rag = np.clip(nz(w, h, 40) - 1.2, 0, None) * 1.5
    a = np.clip(.5 - (sd + rag), 0, 1)
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    base = (34 - 16 * yy) * light
    c = np.repeat((base + nz(w, h, 90) * 2.2 + nz(w, h, 8) * 2.5)[..., None], 3, 2) * np.array([1, .98, 1.04], np.float32)
    use = np.clip(1.15 - np.clip(nz(w, h, 24) - .3, 0, None) * .6, .35, 1)
    c = mix(c, border, band(sd, -4, -1.2) * use)                    # bord gris usé
    c = mix(c, (8, 8, 9), band(sd, -1.2, 0))                         # trait noir extérieur
    c = mix(c, (6, 6, 7), band(sd, -7.5, -5.5) * .8)                 # filet sombre intérieur
    c = mix(c, (60, 60, 62), band(sd, -9, -7.5) * .35)               # reflet du filet
    c *= (1 - np.clip(1 + sd / 26, 0, 1)[..., None] * .35)           # ombre intérieure près du bord
    return c, a

def parchemin(w, h, r=6, burn=1., grey=False, ragged=1.):
    """parchemin crème, fibres, taches, bords brûlés et salis, trait d'encre irrégulier"""
    sd = sdf(w, h, r); rag = np.clip(nz(w, h, 30) - .8, 0, None) * 2.2 * ragged
    sdr = sd + rag; a = np.clip(.5 - sdr, 0, 1)
    t = np.clip(.55 + .12 * nz(w, h, 5) + .06 * nz(w, h, 40) + .05 * nz(w, h, 14, 200), 0, 1)
    lo, hi = ((120, 116, 110), (176, 172, 164)) if grey else ((196, 172, 128), (240, 226, 194))
    c = np.array(lo, np.float32) + (np.array(hi, np.float32) - lo) * t[..., None]
    tache = np.clip(nz(w, h, 9) - 1.9, 0, 1) * .12 + np.clip(nz(w, h, 120) - 2.2, 0, 1) * .5; c *= (1 - tache[..., None])  # taches légères + petits points
    e = np.clip(1 + sdr / (22 * burn), 0, 1) ** 1.7 * np.clip(.75 + .45 * nz(w, h, 12), .2, 1.3)
    c = mix(c, (70, 42, 22) if not grey else (60, 58, 56), np.clip(e * .8, 0, 1))   # brûlé
    ink = band(sdr, -3.2, -.4) * np.clip(1.1 - np.clip(nz(w, h, 30) - .5, 0, None), .4, 1)
    c = mix(c, (30, 22, 16), ink)
    return c, a

def rouge(w, h, r=8):
    """tôle rouge sang tachée : centre plus clair, vignette sombre, marbrures, rayures, cadre sombre"""
    sd = sdf(w, h, r); a = np.clip(.5 - (sd + np.clip(nz(w, h, 40) - 1.2, 0, None) * 1.5), 0, 1)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    rad = np.sqrt(((x - w * .5) / (w * .62)) ** 2 + ((y - h * .42) / (h * .75)) ** 2)
    t = np.clip(1.05 - rad, 0, 1)
    c = np.array([74, 10, 8], np.float32) + np.array([96, 22, 14], np.float32) * t[..., None]
    c *= np.clip(.92 + .12 * nz(w, h, 6) + .06 * nz(w, h, 50), .6, 1.2)[..., None]
    spl = np.clip(nz(w, h, 16) - 1.1, 0, 1) * .45; c *= (1 - spl[..., None])         # taches sombres
    scr = np.clip(np.abs(nz(w, h, 2, 160)) - 2.1, 0, 1) * .5; c = mix(c, (190, 120, 100), scr * .5)  # rayures
    c = mix(c, (24, 6, 5), band(sd, -5, 0) * 1.)                     # cadre sombre
    c = mix(c, (120, 26, 18), band(sd, -7, -5) * .6)                 # filet rouge
    c *= (1 - np.clip(1 + sd / 30, 0, 1)[..., None] * .4)
    return c, a

def jaune_case(s):
    sd = sdf(s, s, 4); a = np.clip(.5 - sd, 0, 1)
    yy = np.linspace(0, 1, s, dtype=np.float32)[:, None]
    c = np.dstack([250 - 30 * yy, 188 - 40 * yy, 40 - 10 * yy]) * np.clip(1 + .05 * nz(s, s, 30), .8, 1.2)[..., None]
    c = mix(c, (20, 16, 10), band(sd, -3, 0))
    return c, a

def vide_case(s):
    sd = sdf(s, s, 4); a = np.clip(.5 - sd, 0, 1)
    c = np.full((s, s, 3), 14, np.float32); c = mix(c, (110, 108, 104), band(sd, -3, -.8)); return c, a

def losange(s, col, dark):
    y, x = np.mgrid[0:s, 0:s].astype(np.float32) + .5
    d = (np.abs(x - s / 2) + np.abs(y - s / 2)) - s / 2 + 1
    a = np.clip(.5 - d, 0, 1); yy = (y / s)[..., None]
    c = np.array(col, np.float32) * (1.15 - .35 * yy)
    c = mix(c, dark, band(d, -2.5, 0)); return c, a

def badge(d, fill=(14, 14, 15), ring=(236, 226, 200)):
    """pastille de nombre : rond noir cerclé de crème"""
    y, x = np.mgrid[0:d, 0:d].astype(np.float32) + .5
    sd = np.hypot(x - d / 2, y - d / 2) - d / 2 + 1; a = np.clip(.5 - sd, 0, 1)
    c = np.full((d, d, 3), fill, np.float32) * (1.25 - .45 * (y / d))[..., None]
    c = mix(c, ring, band(sd, -d * .1, -d * .03)); c = mix(c, (0, 0, 0), band(sd, -d * .03, 0))
    return c, a

def outline(w, h, r, col, wd):
    """contour seul (segment choisi, carte choisie)"""
    sd = sdf(w, h, r); a = band(sd, -wd, 0, 1.)
    c = np.full((h, w, 3), col, np.float32); return c, a

def barre(w, h, frac, col):
    sd = sdf(w, h, h / 2); a = np.clip(.5 - sd, 0, 1)
    c = np.full((h, w, 3), 18, np.float32); c = mix(c, (70, 68, 66), band(sd, -2, -.5))
    if frac:
        fw = int(w * frac); f = np.zeros((h, w), np.float32); f[:, :fw] = 1
        f *= np.clip(.5 - sdf(w, h, h / 2, 3), 0, 1)
        yy = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
        c = c * (1 - f[..., None]) + np.array(col, np.float32) * (1.25 - .5 * yy) * f[..., None]
    return c, a

# ---------- états des boutons ----------
def state(c, a, st):
    if st == 'survol': c = c * 1.15 + 6
    if st == 'appuye': c = c * .8
    if st == 'inactif': g = c.mean(2, keepdims=True); c = g * .75 + c * .1
    return c, a

ELEMS = {}
def add(name, im, cut, role): ELEMS[name] = (im, cut, role)

def build():
    for st in ('normal', 'survol', 'appuye', 'inactif'):
        dy = 2 if st == 'appuye' else 6
        add(f'btn-nuit-{st}', finish(*state(*rouge(600, 230), st), dy=dy), 40, 'Affronter la nuit')
        add(f'btn-icone-{st}', finish(*state(*charbon(96, 88, 10), st), dy=dy, M=10), 22, 'son, musique, plein écran, stats')
        add(f'btn-tuile-{st}', finish(*state(*charbon(190, 190, 10), st), dy=dy, M=12), 30, 'Options, Règles, Recount')
        add(f'btn-parchemin-{st}', finish(*state(*parchemin(400, 100, 6, .7), st), dy=dy), 30, 'bouton clair')
    add('panneau-sombre', finish(*charbon(620, 440, 12)), 34, 'grands panneaux (Deck, Cartes disponibles)')
    add('tuile-sombre', finish(*charbon(300, 150, 10)), 26, 'Réserve, Défausse, compteur de zombies')
    add('panneau-parchemin', finish(*parchemin(620, 320, 8)), 40, 'JOUR, Abri')
    add('ligne-carte', finish(*parchemin(560, 88, 4, .55, ragged=.5), M=10, dy=4, op=.6), 24, 'ligne de la liste de cartes')
    add('ligne-carte-vide', finish(*parchemin(560, 88, 4, .55, grey=True, ragged=.5), M=10, dy=4, op=.6), 24, 'ligne grisée (0 exemplaire)')
    c, a = parchemin(560, 88, 4, .55, ragged=.5); sd = sdf(560, 88, 4)
    c = mix(c, (200, 30, 22), band(sd, -4, 0)); im = finish(c, a, M=16, dy=4, op=.6)
    g = Image.new('RGBA', im.size, (230, 40, 28, 0)); g.putalpha(im.getchannel('A').filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * .55)))
    g.alpha_composite(im); add('ligne-carte-choisie', g, 24, 'ligne choisie (contour rouge lumineux)')
    add('cadre-carte', finish(*parchemin(330, 460, 10, 1.1), dy=8), 40, 'fond de carte (illustration posée dessus)')
    add('bandeau-nom', finish(*parchemin(270, 60, 4, .5, ragged=.4), M=8, dy=3, op=.5), 16, 'nom en bas de la carte')
    add('pastille-nombre', finish(*badge(56), M=8, dy=3, op=.6), None, 'nombre d’exemplaires')
    add('pastille-cout', finish(*badge(74, ring=(250, 246, 236)), M=8, dy=4, op=.7), None, 'coût de la carte')
    add('vitesse-fond', finish(*charbon(580, 110, 10)), 30, 'sélecteur de vitesse')
    add('vitesse-choix', finish(*outline(180, 84, 8, (238, 170, 30), 4), M=6, dy=0, op=0), 16, 'segment choisi (contour jaune)')
    add('energie-pleine', finish(*jaune_case(46), M=6, dy=2, op=.5), None, 'énergie')
    add('energie-vide', finish(*vide_case(46), M=6, dy=2, op=.5), None, 'énergie vide')
    add('nuit-rouge', finish(*losange(34, (214, 30, 26), (60, 6, 6)), M=4, dy=2, op=.5), None, 'nuit passée / nuit rouge')
    add('nuit-grise', finish(*losange(34, (120, 120, 122), (30, 30, 32)), M=4, dy=2, op=.5), None, 'nuit à venir')
    add('nuit-noire', finish(*losange(34, (34, 34, 36), (90, 90, 92)), M=4, dy=2, op=.5), None, 'nuit lointaine')
    add('barre-pv', finish(*barre(520, 26, .94, (205, 30, 24)), M=6, dy=2, op=.5), 13, 'PV de l’abri')
    add('barre-vide', finish(*barre(520, 26, 0, (0, 0, 0)), M=6, dy=2, op=.5), 13, 'fond de barre')

def font(sz):
    fp = os.path.join(HERE, '..', 'assets', 'fonts')
    try:
        import io; from fontTools.ttLib import TTFont
        f = TTFont(os.path.join(fp, 'oswald-600.woff2')); f.flavor = None; b = io.BytesIO(); f.save(b); b.seek(0)
        return ImageFont.truetype(b, sz)
    except Exception:
        return ImageFont.truetype('DejaVuSans-Bold.ttf', sz)

def sheet():
    F = {s: font(s) for s in (16, 18, 22, 26, 34, 52)}
    W, Hh = 820, 1400; bg = Image.new('RGBA', (W, Hh), (52, 44, 36, 255))
    tex = np.clip(np.array(Image.new('RGB', (W, Hh), (52, 44, 36))).astype(np.float32) * (1 + .08 * nz(W, Hh, 6)[..., None]), 0, 255)
    bg.alpha_composite(Image.fromarray(tex.astype(np.uint8)).convert('RGBA'))
    d = ImageDraw.Draw(bg)
    def put(n, x, y, s=.5):
        im = ELEMS[n][0]; im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.LANCZOS); bg.alpha_composite(im, (int(x), int(y))); return im
    def txt(x, y, t, f, col=(244, 236, 216), sh=True, anchor='la'):
        if sh: d.text((x + 1, y + 2), t, font=F[f], fill=(0, 0, 0), anchor=anchor)
        d.text((x, y), t, font=F[f], fill=col, anchor=anchor)
    # colonne gauche : JOUR, deck, liste
    im = put('panneau-parchemin', 10, 10, .5)
    txt(30, 22, 'JOUR', 26, (24, 18, 12), False); txt(34, 52, '9', 52, (24, 18, 12), False)
    x = 30
    for i in range(10):
        put('nuit-rouge' if i < 4 else ('nuit-grise' if i < 8 else 'nuit-noire'), x, 140, .7); x += 27
    put('panneau-sombre', 10, 190, .5); txt(150, 214, 'DECK', 22); txt(150, 240, '15', 52); txt(150, 306, 'cartes restantes', 16, (190, 186, 178), False)
    put('cadre-carte', 30, 210, .26)
    put('tuile-sombre', 330, 10, .5); txt(355, 30, 'RÉSERVE', 18); txt(355, 56, '2', 34)
    put('tuile-sombre', 500, 10, .5); txt(525, 30, 'DÉFAUSSE', 18); txt(525, 56, '2', 34)
    y = 110
    rows = [('ligne-carte-choisie', 'Barricade', '3'), ('ligne-carte', 'Clôture', '1'), ('ligne-carte-vide', 'Projecteur', '0'), ('ligne-carte', 'Tireur', '2')]
    for n, lab, k in rows:
        off = 3 if 'choisie' in n else 0
        im = put(n, 330 - off, y - off, .5)
        txt(372, y + 16, lab, 22, (40, 30, 20) if 'vide' not in n else (70, 68, 64), False)
        put('pastille-nombre', 574, y + 9, .5); txt(592, y + 27, k, 18, (244, 236, 216), False, 'mm')
        y += 54
    # cartes en main
    y = 470; x = 330
    for k, lab in (('3', 'Barricade'), ('1', 'Mitrailleuse'), ('2', 'Guetteur')):
        put('cadre-carte', x, y, .45); put('bandeau-nom', x + 22, y + 160, .5); txt(x + 85, y + 178, lab, 16, (30, 22, 14), False, 'mm')
        put('pastille-cout', x - 4, y - 4, .5); txt(x + 18, y + 18, k, 22, (244, 236, 216), False, 'mm'); x += 158
    # abri + PV
    put('panneau-parchemin', 10, 432, .5); txt(30, 446, 'ABRI', 26, (24, 18, 12), False); txt(30, 482, '190 / 200', 22, (24, 18, 12), False)
    put('barre-pv', 26, 532, .5)
    # zombies + énergie
    put('tuile-sombre', 10, 600, 1.04); txt(40, 624, '7 ZOMBIES', 34, (232, 50, 36)); txt(40, 670, 'encore dehors.', 18, (200, 196, 188), False)
    x = 40
    for n in ('energie-pleine', 'energie-pleine', 'energie-vide'): put(n, x, 706, .6); x += 34
    # bouton de la nuit (4 états)
    put('btn-nuit-normal', 10, 760, .58); txt(190, 820, 'AFFRONTER', 34, anchor='mm'); txt(190, 858, 'LA NUIT', 34, anchor='mm')
    xs = 380
    for st in ('survol', 'appuye', 'inactif'):
        put(f'btn-nuit-{st}', xs, 776, .23); xs += 146
    txt(380, 760, 'survol / appuyé / inactif', 16, (220, 210, 190), False)
    # vitesse
    put('vitesse-fond', 10, 920, .58); put('vitesse-choix', 20, 932, .58); d.polygon([(52, 946), (52, 970), (70, 958)], fill=(238, 170, 30)); txt(92, 958, 'x1', 26, (238, 170, 30), anchor='mm')
    txt(190, 958, 'x2', 26, (150, 148, 144), anchor='mm'); txt(290, 958, 'x4', 26, (150, 148, 144), anchor='mm')
    # boutons icônes et tuiles
    x = 380
    for st in ('normal', 'survol', 'appuye', 'inactif'):
        put(f'btn-icone-{st}', x, 900, .55); x += 64
    x = 10
    for lab in ('OPTIONS', 'RÈGLES', 'STATS'):
        put('btn-tuile-normal', x, 1010, .55); txt(x + 60, 1100, lab, 18, anchor='mm'); x += 120
    for i, st in enumerate(('normal', 'survol', 'appuye', 'inactif')):
        put(f'btn-parchemin-{st}', 380 + (i % 2) * 215, 1000 + (i // 2) * 66, .5)
        txt(380 + (i % 2) * 215 + 107, 1000 + (i // 2) * 66 + 32, 'JOUER', 22, (30, 22, 14), False, 'mm')
    out = os.path.join(PREV, 'ui-pack2-apercu.png'); bg.crop((0, 0, W, 1150)).convert('RGB').save(out); print(out)

def main():
    os.makedirs(OUT, exist_ok=True); os.makedirs(PREV, exist_ok=True)
    build(); info = {}
    for n, (im, cut, role) in ELEMS.items():
        im.save(os.path.join(OUT, n + '.png'), optimize=True); info[n] = {'taille': list(im.size), 'decoupe': cut, 'usage': role}
    json.dump(info, open(os.path.join(OUT, 'pack.json'), 'w'), ensure_ascii=False, indent=1)
    sheet()

if __name__ == '__main__': main()
