"""Pack d'interface du style artiste : boutons, panneaux, onglets, barres, cases... en relief avec dégradé.
Sortie : assets/art/ui/pack/*.png (fond transparent, taille x2 pour les écrans fins) + planche d'aperçu.
Les matières viennent de tools/textures.py. Lancer : python3 tools/ui_pack.py [dossier_apercu]"""
import os, sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
import textures as T

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, '..', 'assets', 'art', 'ui', 'pack')
PREV = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'test-out')
LIGHT = np.array([-.55, -.6, .58]); LIGHT /= np.linalg.norm(LIGHT)

print('matières…')
TEX = {k: fn().astype(np.float32) for k, fn in
       [('tole', T.tole), ('rouge', T.rouge), ('brosse', T.brosse), ('parchemin', T.parchemin), ('papier', T.papier), ('bois', T.bois)]}
# teintes unies tirées de la tôle (onglet rouge, énergie jaune, PV rouge, vert)
def tint(src, rgb, k=.55):
    g = TEX[src].mean(2, keepdims=True) / 128
    return np.clip(np.array(rgb, np.float32) * (k + (1 - k) * g), 0, 255)
TEX['sombre'] = tint('tole', (40, 43, 48), .3)
TEX['rougeuni'] = tint('tole', (150, 28, 20), .4)
TEX['jaune'] = tint('brosse', (222, 172, 40), .45)
TEX['vert'] = tint('tole', (70, 120, 46), .4)
TEX['sang'] = tint('brosse', (176, 26, 20), .45)

def fill(tex, w, h, scale=.5, off=(0, 0)):
    t = Image.fromarray(tex.astype(np.uint8))
    if scale != 1: t = t.resize((int(t.width * scale), int(t.height * scale)), Image.LANCZOS)
    im = Image.new('RGB', (w, h))
    for y in range(-off[1] % t.height - t.height, h, t.height):
        for x in range(-off[0] % t.width - t.width, w, t.width): im.paste(t, (x, y))
    return np.asarray(im).astype(np.float32)

def sdf_rrect(w, h, r, inset=0):
    """distance signée au bord d'un rectangle arrondi (négatif = dedans)"""
    y, x = np.mgrid[0:h, 0:w].astype(np.float32) + .5
    hw, hh = w / 2 - inset, h / 2 - inset
    qx = np.abs(x - w / 2) - (hw - r); qy = np.abs(y - h / 2) - (hh - r)
    out = np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0)
    return out - r

def light(hm, k):
    dx = np.gradient(hm, axis=1) * k; dy = np.gradient(hm, axis=0) * k
    nz = 1 / np.sqrt(dx * dx + dy * dy + 1)
    d = (-dx * LIGHT[0] - dy * LIGHT[1] + LIGHT[2]) * nz
    return d / LIGHT[2]  # 1 = à plat

def layer(w, h, r, inset, tex, bevel, grad=.38, press=False, bright=1., k=1.6, scale=.5, sunk=False):
    """une plaque : texture + dégradé + biseau éclairé ; renvoie couleur et alpha"""
    sd = sdf_rrect(w, h, r, inset)
    a = np.clip(.5 - sd, 0, 1)
    hm = np.clip(-sd / bevel, 0, 1); hm = hm * hm * (3 - 2 * hm)  # biseau arrondi
    if sunk or press: hm = -hm
    col = fill(tex, w, h, scale)
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    g = (1 + grad / 2 - grad * yy) if not press else (1 - grad / 3 + grad / 3 * yy)
    sh = light(hm * bevel, k)
    col = col * g * bright * (.55 + .45 * sh[..., None]) + np.clip(sh - 1, 0, 1)[..., None] * 140
    return np.clip(col, 0, 255), a

def comp(base, over, a):
    return base * (1 - a[..., None]) + over * a[..., None]

def rivet(im, cx, cy, r=7):
    d = ImageDraw.Draw(im)
    d.ellipse((cx - r + 1, cy - r + 2, cx + r + 1, cy + r + 2), fill=(0, 0, 0, 120))
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(28, 28, 30, 255))
    d.ellipse((cx - r + 1, cy - r + 1, cx + r - 1, cy + r - 1), fill=(128, 130, 134, 255))
    d.ellipse((cx - r + 2, cy - r + 2, cx + r - 3, cy + r - 3), fill=(176, 178, 182, 255))
    d.ellipse((cx - r / 2 - 1, cy - r / 2 - 1, cx - 1, cy - 1), fill=(240, 240, 242, 255))

def shadow(rgba, dy=6, blur=8, op=.7):
    """ombre portée vers le bas, dans une marge transparente"""
    a = rgba.getchannel('A')
    s = Image.new('L', rgba.size, 0); s.paste(a, (0, dy)); s = s.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * op))
    out = Image.new('RGBA', rgba.size, (0, 0, 0, 0)); out.paste((0, 0, 0, 255), (0, 0), s)
    return Image.alpha_composite(out, rgba)

def to_img(col, a):
    return Image.fromarray(np.dstack([col, a * 255]).clip(0, 255).astype(np.uint8), 'RGBA')

def framed(w, h, r, frame, inner, fw, state='normal', rivets=True, M=16, inner_bevel=7, grad=.38, sunk=False, inner_scale=.5):
    """élément encadré : cadre de métal + plaque intérieure ; M = marge pour l'ombre"""
    W, H = w + 2 * M, h + 2 * M + 6
    press = state == 'appuye'; dy = 4 if press else 0
    br = {'normal': 1., 'survol': 1.14, 'appuye': .86, 'inactif': .8}[state]
    full = np.zeros((H, W, 3), np.float32); A = np.zeros((H, W), np.float32)
    fc, fa = layer(w, h, r, 0, TEX[frame], 6, grad=.25, bright=br * (.95 if not press else .9))
    ic, ia = layer(w, h, max(r - fw, 2), fw, TEX[inner], inner_bevel, grad=grad, press=press, bright=br, sunk=sunk, scale=inner_scale)
    # rainure sombre entre cadre et plaque
    groove = np.clip(1 - np.abs(sdf_rrect(w, h, max(r - fw, 2), fw) + .5) / 2.2, 0, 1)
    c = comp(fc, ic, ia); c *= (1 - .55 * groove[..., None])
    if state == 'inactif':
        g = c.mean(2, keepdims=True); c = g * .8 + c * .2
    full[M + dy:M + dy + h, M:M + w] = c; A[M + dy:M + dy + h, M:M + w] = fa
    im = to_img(full, A)
    if rivets and min(w, h) >= 70:
        o = fw / 2 + 1
        for cx, cy in ((o, o), (w - o, o), (o, h - o), (w - o, h - o)): rivet(im, M + cx, M + dy + cy, min(7, fw * .45))
    if state == 'survol':  # léger halo chaud
        a = im.getchannel('A').filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * .45))
        glow = Image.new('RGBA', im.size, (255, 190, 90, 0)); glow.putalpha(a)
        im = Image.alpha_composite(glow, im)
    return shadow(im, dy=2 if press else 7, blur=5 if press else 9, op=.55 if press else .75)

def plain(w, h, r, tex, bevel=6, M=12, grad=.35, sunk=False, scale=.5, op_sh=.7):
    W, H = w + 2 * M, h + 2 * M + 4
    full = np.zeros((H, W, 3), np.float32); A = np.zeros((H, W), np.float32)
    c, a = layer(w, h, r, 0, TEX[tex], bevel, grad=grad, sunk=sunk, scale=scale)
    full[M:M + h, M:M + w] = c; A[M:M + h, M:M + w] = a
    im = to_img(full, A)
    return shadow(im, dy=0 if sunk else 5, blur=6, op=0 if sunk else op_sh)

def ring(w, h, r, frame, fw, M=16):
    """cadre seul, centre transparent (à poser autour d'un contenu)"""
    W, H = w + 2 * M, h + 2 * M + 6
    fc, fa = layer(w, h, r, 0, TEX[frame], 6, grad=.25)
    inner = np.clip(.5 - sdf_rrect(w, h, max(r - fw, 2), fw), 0, 1)
    lip = np.clip(1 - np.abs(sdf_rrect(w, h, max(r - fw, 2), fw) + 1) / 3, 0, 1)
    fc = fc * (1 - .5 * lip[..., None]); fa = fa * (1 - inner)
    full = np.zeros((H, W, 3), np.float32); A = np.zeros((H, W), np.float32)
    full[M:M + h, M:M + w] = fc; A[M:M + h, M:M + w] = fa
    im = to_img(full, A); o = fw / 2 + 1
    for cx, cy in ((o, o), (w - o, o), (o, h - o), (w - o, h - o)): rivet(im, M + cx, M + cy, min(7, fw * .45))
    return shadow(im, dy=5, blur=8, op=.6)

def bar(w, h, fillk, frac):
    """barre creusée avec remplissage (frac = part remplie)"""
    M = 8; W, H = w + 2 * M, h + 2 * M
    full = np.zeros((H, W, 3), np.float32); A = np.zeros((H, W), np.float32)
    fc, fa = layer(w, h, h / 2, 0, TEX['sombre'], 4, grad=.2)
    ic, ia = layer(w, h, h / 2 - 4, 4, TEX['sombre'], 4, sunk=True, bright=.55, grad=0)
    c = comp(fc, ic, ia)
    if frac > 0:
        fw = int(8 + (w - 8) * frac)
        gc, ga = layer(fw, h - 8, (h - 8) / 2, 0, TEX[fillk], (h - 8) / 2, grad=.5, k=1.2)
        sub = c[4:h - 4, 4:4 + fw]; c[4:h - 4, 4:4 + fw] = comp(sub, gc[:, :sub.shape[1]], ga[:, :sub.shape[1]] * ia[4:h - 4, 4:4 + fw])
    full[M:M + h, M:M + w] = c; A[M:M + h, M:M + w] = fa
    return shadow(to_img(full, A), dy=3, blur=4, op=.6)

def circle(d, tex, frame='tole', fw=8, state='normal'):
    return framed(d, d, d / 2, frame, tex, fw, state=state, rivets=False, M=12, inner_bevel=d / 5)

def toggle(on):
    w, h = 120, 60; M = 10
    base = plain(w, h, h / 2, 'sombre', bevel=4, M=M, sunk=True)
    knob = circle(46, 'brosse', 'tole', 6)
    if on:
        tr = plain(w - 10, h - 10, (h - 10) / 2, 'rougeuni', bevel=8, M=0, op_sh=0)
        base.alpha_composite(tr, (M + 5, M + 5))
    base.alpha_composite(knob, (M + (w - 60 if on else 2) - 6, M + 1 - 10))
    return base

def check(on):
    im = framed(56, 56, 10, 'tole', 'sombre', 6, rivets=False, M=10, sunk=True, inner_bevel=5)
    if on:
        d = ImageDraw.Draw(im)
        pts = [(24, 38), (32, 47), (50, 24)]
        d.line([(x + 1, y + 2) for x, y in pts], fill=(0, 0, 0, 200), width=8, joint='curve')
        d.line(pts, fill=(222, 50, 34, 255), width=7, joint='curve')
    return im

def divider(w):
    return plain(w, 10, 5, 'brosse', bevel=4, M=6, grad=.5)

ELEMS = {}
def add(name, im, slice_px=None, role=''):
    ELEMS[name] = (im, slice_px, role)

def build():
    for st in ('normal', 'survol', 'appuye', 'inactif'):
        add(f'btn-rouge-{st}', framed(360, 110, 18, 'sombre', 'rouge', 14, st), 40, 'bouton principal (Affronter la nuit, Jouer)')
        add(f'btn-gris-{st}', framed(360, 110, 18, 'sombre', 'tole', 14, st), 40, 'bouton secondaire')
        add(f'btn-parchemin-{st}', framed(360, 110, 18, 'sombre', 'parchemin', 14, st, inner_scale=.4), 40, 'bouton clair (texte noir)')
        add(f'btn-rond-{st}', circle(110, 'brosse', 'sombre', 10, st), None, 'bouton icône (pause, vitesse, options)')
    add('panneau-metal', framed(520, 380, 20, 'sombre', 'tole', 18, inner_bevel=10, grad=.3), 48, 'panneau (fiche, options)')
    add('panneau-parchemin', framed(520, 380, 20, 'sombre', 'parchemin', 18, inner_bevel=8, grad=.25, inner_scale=.6), 48, 'fiche de carte, texte')
    add('panneau-bois', framed(520, 380, 20, 'sombre', 'bois', 18, inner_bevel=8, grad=.3, inner_scale=.6), 48, 'fond des menus')
    add('panneau-papier', plain(520, 380, 6, 'papier', bevel=5, grad=.18, scale=.6), 24, 'feuille du classeur')
    add('cadre-metal', ring(520, 380, 20, 'sombre', 18), 48, 'cadre seul (plateau, main), centre transparent')
    add('cadre-fin', ring(520, 380, 12, 'brosse', 9), 30, 'liseré fin')
    add('onglet-actif', framed(220, 80, 14, 'sombre', 'rougeuni', 10, rivets=False, inner_bevel=6), 26, 'onglet choisi')
    add('onglet', framed(220, 80, 14, 'sombre', 'tole', 10, rivets=False, inner_bevel=6, state='normal'), 26, 'onglet')
    add('etiquette-jour', framed(300, 120, 10, 'tole', 'parchemin', 10, inner_bevel=8, inner_scale=.4), 30, 'étiquette JOUR n')
    add('pastille-metal', circle(80, 'tole', 'sombre', 8), None, 'pastille (ferraille, cartes)')
    add('pastille-parchemin', circle(80, 'parchemin', 'sombre', 8), None, 'pastille claire')
    add('gemme-rouge', circle(64, 'rougeuni', 'sombre', 7), None, 'dégâts')
    add('gemme-noire', circle(64, 'sombre', 'brosse', 7), None, 'PV')
    add('gemme-jaune', circle(64, 'jaune', 'sombre', 7), None, 'coût en énergie')
    for k, lab in (('sombre', 'nuit passée ou à venir'), ('rougeuni', 'nuit rouge'), ('parchemin', 'nuit en cours')):
        n = {'sombre': 'case-nuit', 'rougeuni': 'case-nuit-rouge', 'parchemin': 'case-nuit-actuelle'}[k]
        add(n, framed(56, 56, 8, 'sombre', k, 6, rivets=False, M=8, inner_bevel=5, inner_scale=.3), 16, lab)
    add('energie-pleine', framed(44, 56, 6, 'sombre', 'jaune', 5, rivets=False, M=8, inner_bevel=5), None, 'case d’énergie')
    add('energie-vide', framed(44, 56, 6, 'sombre', 'sombre', 5, rivets=False, M=8, sunk=True, inner_bevel=4), None, 'case d’énergie vide')
    add('barre-pv', bar(320, 34, 'sang', .68), 17, 'barre de vie')
    add('barre-energie', bar(320, 34, 'jaune', .45), 17, 'barre d’énergie')
    add('barre-xp', bar(320, 34, 'vert', .8), 17, 'barre de progression')
    add('barre-vide', bar(320, 34, 'sang', 0), 17, 'fond de barre')
    add('champ', framed(420, 76, 12, 'tole', 'sombre', 8, rivets=False, sunk=True, inner_bevel=6), 22, 'champ de saisie, recherche')
    add('interrupteur-oui', toggle(True), None, 'option activée')
    add('interrupteur-non', toggle(False), None, 'option désactivée')
    add('case-oui', check(True), None, 'case cochée')
    add('case-non', check(False), None, 'case vide')
    add('separateur', divider(420), 10, 'trait de séparation')
    r = Image.new('RGBA', (32, 32), (0, 0, 0, 0)); rivet(r, 15, 15, 11); add('rivet', r, None, 'rivet seul')

def sheet():
    from textures import ImageFont
    fp = os.path.join(HERE, '..', 'assets', 'fonts')
    try:
        import io; from fontTools.ttLib import TTFont
        f = TTFont(os.path.join(fp, 'oswald-600.woff2')); f.flavor = None; b = io.BytesIO(); f.save(b)
        mk = lambda s: ImageFont.truetype(io.BytesIO(b.getvalue()), s)
    except Exception:
        mk = lambda s: ImageFont.truetype('DejaVuSans-Bold.ttf', s)
    big, small = mk(30), mk(18)
    W = 820; bg = Image.new('RGBA', (W, 2400), (20, 18, 17, 255))
    bg.alpha_composite(Image.fromarray(np.clip(fill(TEX['sombre'], W, 2400, .5) * .45, 0, 255).astype(np.uint8)).convert('RGBA'))
    d = ImageDraw.Draw(bg); y = 14
    def title(t):
        nonlocal y; d.text((16, y), t, font=small, fill=(230, 210, 170)); y += 28
    def put(name, x, label=None, scale=.5, dark=False):
        im = ELEMS[name][0]; im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
        bg.alpha_composite(im, (x, y))
        if label:
            tw = d.textlength(label, font=big); tx = x + (im.width - tw) / 2; ty = y + im.height / 2 - 22
            if dark: d.text((tx, ty + 1), label, font=big, fill=(255, 240, 210)); d.text((tx, ty), label, font=big, fill=(30, 22, 14))
            else: d.text((tx + 2, ty + 2), label, font=big, fill=(0, 0, 0)); d.text((tx, ty), label, font=big, fill=(246, 234, 206))
        return im
    title('BOUTONS : normal / survol / appuyé / inactif')
    for kind, lab, dark in (('rouge', 'AFFRONTER', False), ('gris', 'RETOUR', False), ('parchemin', 'JOUER', True)):
        x = 10; h = 0
        for st in ('normal', 'survol', 'appuye', 'inactif'):
            im = put(f'btn-{kind}-{st}', x, lab, .5, dark); x += im.width - 6; h = im.height
        y += h + 4
    x = 10
    for st in ('normal', 'survol', 'appuye', 'inactif'):
        im = put(f'btn-rond-{st}', x, None, .6)
        cx, cy = x + im.width / 2, y + im.height / 2 - 3
        for bx in (cx - 9, cx + 3):
            d.rectangle((bx + 1, cy - 11, bx + 7, cy + 13), fill=(0, 0, 0)); d.rectangle((bx, cy - 12, bx + 6, cy + 12), fill=(244, 232, 205))
        x += im.width + 10
    y += im.height + 10
    title('PANNEAUX ET CADRES')
    x = 10
    for n in ('panneau-metal', 'panneau-parchemin', 'panneau-bois'):
        im = put(n, x, None, .47); x += im.width + 4
    y += im.height + 6; x = 10
    for n in ('panneau-papier', 'cadre-metal', 'cadre-fin'):
        im = put(n, x, None, .47); x += im.width + 4
    y += im.height + 10
    title('ONGLETS, ÉTIQUETTE, PASTILLES, GEMMES')
    x = 10
    for n, lab in (('onglet-actif', 'PIOCHE'), ('onglet', 'HORDE'), ('onglet', 'JOURNAL')):
        im = put(n, x, lab, .5); x += im.width - 4
    y += im.height + 4; x = 10
    im = put('etiquette-jour', x, 'JOUR 7', .6, True); x += im.width + 6; h = im.height
    for n in ('pastille-metal', 'pastille-parchemin', 'gemme-jaune', 'gemme-rouge', 'gemme-noire'):
        im = put(n, x, None, .7); x += im.width + 4
    y += h + 10
    title('PISTE DES NUITS, ÉNERGIE, BARRES')
    x = 10
    for n in ['case-nuit'] * 3 + ['case-nuit-actuelle', 'case-nuit', 'case-nuit-rouge']:
        im = put(n, x, None, .8); x += im.width - 8
    x += 20
    for n in ['energie-pleine'] * 3 + ['energie-vide']:
        im = put(n, x, None, .8); x += im.width - 10
    y += im.height + 6; x = 10
    for n in ('barre-pv', 'barre-energie'):
        im = put(n, x, None, 1); x += im.width + 4
    y += im.height + 4; x = 10
    for n in ('barre-xp', 'barre-vide'):
        im = put(n, x, None, 1); x += im.width + 4
    y += im.height + 10
    title('OPTIONS ET SAISIE')
    x = 10
    for n in ('interrupteur-oui', 'interrupteur-non', 'case-oui', 'case-non'):
        im = put(n, x, None, .9); x += im.width + 10
    y += 74; x = 10
    im = put('champ', x, None, .7); d.text((x + 36, y + 22), 'Rechercher une carte…', font=small, fill=(150, 150, 150))
    put('separateur', x + im.width + 10, None, .6)
    y += im.height + 12
    out = os.path.join(PREV, 'ui-pack-apercu.png'); bg.crop((0, 0, W, y)).convert('RGB').save(out); print(out)

def main():
    os.makedirs(OUT, exist_ok=True); os.makedirs(PREV, exist_ok=True)
    print('éléments…'); build()
    info = {}
    for n, (im, sl, role) in ELEMS.items():
        im.save(os.path.join(OUT, n + '.png'), optimize=True)
        info[n] = {'taille': list(im.size), 'decoupe': sl, 'usage': role}
    json.dump(info, open(os.path.join(OUT, 'pack.json'), 'w'), ensure_ascii=False, indent=1)
    sheet()

if __name__ == '__main__': main()
