"""Pack de textures du style artiste (assets/art/ui/tex-*.webp) + planche d'aperçu.
Chaque texture est raccordable (bruit périodique) et éclairée en relief (lumière en haut à gauche).
Le dégradé et le biseau se posent sur chaque élément (aperçu : tools/test-out/textures-apercu.png).
Lancer : python3 tools/textures.py [dossier_apercu]"""
import sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

S = 512
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'art', 'ui')
PREV = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'test-out')

def noise(fx, fy, seed, n=S):
    """bruit périodique (FFT) : fx, fy = finesse horizontale et verticale"""
    r = np.random.default_rng(seed)
    kx = np.fft.fftfreq(n)[None, :] * n; ky = np.fft.fftfreq(n)[:, None] * n
    amp = np.exp(-((kx / fx) ** 2 + (ky / fy) ** 2)); amp[0, 0] = 0
    sp = amp * (r.normal(size=(n, n)) + 1j * r.normal(size=(n, n)))
    v = np.fft.ifft2(sp).real; return v / v.std()

def shade(h, strength):
    """éclairage d'une carte de hauteurs, lumière en haut à gauche (raccordable : différences circulaires)"""
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * strength
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * strength
    nz = 1 / np.sqrt(dx * dx + dy * dy + 1)
    L = np.array([-.55, -.55, .63]); L /= np.linalg.norm(L)
    d = (-dx * L[0] - dy * L[1] + L[2]) * nz
    spec = np.clip(d, 0, 1) ** 24
    return d, spec

def finish(base, h, strength, gloss=0.):
    d, spec = shade(h, strength)
    col = base * (0.35 + 0.85 * d[..., None]) + 255 * gloss * spec[..., None]
    return np.clip(col, 0, 255)

def lerp(a, b, t): return np.array(a) + (np.array(b) - np.array(a)) * t[..., None]

# 1. tôle bosselée (acier sombre)
def tole():
    h = noise(3, 3, 1) * 1.0 + noise(9, 9, 2) * .35 + noise(90, 90, 3) * .06
    t = np.clip(.5 + .12 * noise(4, 4, 4) + .05 * noise(40, 40, 5), 0, 1)
    base = lerp((52, 57, 63), (98, 104, 112), t)
    return finish(base, h, 2.2, .35)

# 2. tôle rouge peinte, écaillée
def rouge():
    h = noise(3, 3, 11) + noise(10, 10, 12) * .3 + noise(110, 110, 13) * .05
    chip = noise(14, 14, 14) + noise(50, 50, 15) * .35
    m = np.clip((chip - 1.6) * 3, 0, 1)  # écailles : on voit le métal dessous
    t = np.clip(.5 + .15 * noise(5, 5, 16), 0, 1)
    paint = lerp((96, 16, 12), (158, 32, 22), t)
    metal = lerp((60, 62, 66), (100, 100, 104), t)
    base = paint * (1 - m[..., None]) + metal * m[..., None]
    h = h - m * .9  # la peinture a une épaisseur
    return finish(base, h, 2.6, .25)

# 3. acier brossé
def brosse():
    h = noise(2, 400, 21) * .5 + noise(1.2, 160, 22) * .4 + noise(3, 3, 23) * .4
    t = np.clip(.5 + .16 * noise(1.5, 300, 24) + .1 * noise(3, 3, 25), 0, 1)
    base = lerp((96, 102, 110), (160, 166, 174), t)
    return finish(base, h, .9, .45)

# 4. parchemin
def parchemin():
    h = noise(6, 6, 31) * .5 + noise(70, 70, 32) * .25 + noise(18, 220, 33) * .2
    t = np.clip(.55 + .14 * noise(5, 5, 34) + .06 * noise(30, 30, 35), 0, 1)
    tache = np.clip((noise(7, 7, 36) - 1.4) * .5, 0, .35)
    base = lerp((176, 150, 104), (238, 222, 184), t) * (1 - tache[..., None])
    return finish(base, h, .55)

# 5. papier ivoire du classeur
def papier():
    fib = noise(30, 260, 41) * .3 + noise(260, 30, 42) * .3
    h = noise(160, 160, 43) * .2 + fib * .6 + noise(5, 5, 44) * .3
    t = np.clip(.6 + .08 * noise(4, 4, 45) + .05 * fib, 0, 1)
    base = lerp((200, 190, 166), (246, 240, 224), t)
    return finish(base, h, .35)

# 6. bois sombre (planches horizontales)
def bois():
    P = 128; Y, X = np.mgrid[0:S, 0:S].astype(float)
    warp = noise(1.5, 5, 51) * 9 + noise(6, 30, 52) * 1.6
    fib = noise(14, 320, 53); r = np.random.default_rng(54)
    t = np.zeros((S, S)); h = np.zeros((S, S)); k = np.ones((S, S))
    for i in range(S // P):
        sl = slice(i * P, (i + 1) * P); y = Y[sl] - i * P
        g = np.sin((y + warp[sl]) * r.uniform(.07, .11) + r.uniform(0, 6.28))
        t[sl] = np.clip(.45 + .2 * g + .24 * fib[sl], 0, 1)
        k[sl] = r.uniform(.82, 1.05)
        h[sl] = .25 * fib[sl] + .3 * g - np.clip(1 - y / 4, 0, 1) * 2 - np.clip((y - P + 6) / 6, 0, 1) * 3
    base = lerp((40, 24, 13), (104, 66, 38), t) * k[..., None]
    return finish(base, h, 1.5, .1)

MATS = [('tex-tole', 'Tôle bosselée', tole), ('tex-rouge', 'Tôle rouge', rouge), ('tex-brosse', 'Acier brossé', brosse),
        ('tex-parchemin', 'Parchemin', parchemin), ('tex-papier', 'Papier', papier), ('tex-bois', 'Bois sombre', bois)]

def bevel_panel(tex, w, h, rad, depth, label, font, dark_text):
    """aperçu d'un élément : texture + dégradé vertical + biseau + rivets + ombre portée"""
    tile = Image.fromarray(tex.astype(np.uint8))
    im = Image.new('RGB', (w, h))
    for y in range(0, h, S):
        for x in range(0, w, S): im.paste(tile, (x, y))
    a = np.asarray(im).astype(float)
    yy = np.linspace(0, 1, h)[:, None, None]
    a *= 1.18 - .42 * yy  # dégradé : clair en haut, sombre en bas
    mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), rad, fill=255)
    # biseau : distance au bord -> hauteur, éclairée en haut à gauche
    m = np.asarray(mask.filter(ImageFilter.GaussianBlur(depth))).astype(float) / 255
    hm = np.clip(m * 2, 0, 1)
    gy, gx = np.gradient(hm)
    lit = (-gx - gy) * depth * 2.2
    a += (np.clip(lit, -1, 1) * 150)[..., None]
    a = np.clip(a, 0, 255)
    im = Image.fromarray(a.astype(np.uint8))
    d = ImageDraw.Draw(im)
    for cx, cy in ((14, 14), (w - 15, 14), (14, h - 15), (w - 15, h - 15)):
        d.ellipse((cx - 6, cy - 6, cx + 6, cy + 6), fill=(30, 30, 32))
        d.ellipse((cx - 5, cy - 5, cx + 4, cy + 4), fill=(150, 152, 156))
        d.ellipse((cx - 3, cy - 3, cx, cy), fill=(225, 226, 228))
    tw = d.textlength(label, font=font); tx, ty = (w - tw) / 2, h / 2 - font.size * .6
    if dark_text:
        d.text((tx, ty + 1), label, font=font, fill=(255, 245, 220)); d.text((tx, ty), label, font=font, fill=(34, 24, 16))
    else:
        d.text((tx + 2, ty + 2), label, font=font, fill=(0, 0, 0)); d.text((tx, ty), label, font=font, fill=(244, 232, 205))
    return im, mask

def main():
    os.makedirs(OUT, exist_ok=True); os.makedirs(PREV, exist_ok=True)
    fp = os.path.join(os.path.dirname(__file__), '..', 'assets', 'fonts')
    def load(sz):
        try:  # Oswald du jeu (woff2 -> ttf en mémoire, demande fonttools + brotli)
            import io; from fontTools.ttLib import TTFont
            f = TTFont(os.path.join(fp, 'oswald-600.woff2')); f.flavor = None; b = io.BytesIO(); f.save(b); b.seek(0)
            return ImageFont.truetype(b, sz)
        except Exception:
            try: return ImageFont.truetype('DejaVuSans-Bold.ttf', sz)
            except Exception: return ImageFont.load_default()
    font, small = load(36), load(22)
    texs = []
    for name, label, fn in MATS:
        t = fn(); texs.append((label, t))
        Image.fromarray(t.astype(np.uint8)).save(os.path.join(OUT, name + '.webp'), quality=88)
    W, CW, CH = 780, 370, 300
    sheet = Image.new('RGB', (W, 30 + 3 * (CH + 20)), (18, 16, 15))
    d = ImageDraw.Draw(sheet)
    for i, (label, t) in enumerate(texs):
        x0, y0 = 15 + (i % 2) * (CW + 10), 15 + (i // 2) * (CH + 20)
        # carreau brut répété 2 fois (vérifie le raccord)
        tile = Image.fromarray(t.astype(np.uint8)).resize((128, 128))
        raw = Image.new('RGB', (CW, 110))
        for x in range(0, CW, 128): raw.paste(tile, (x, -9))
        sheet.paste(raw, (x0, y0))
        d.text((x0 + 8, y0 + 6), label, font=small, fill=(255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0))
        # élément en relief avec dégradé et ombre
        dark = label in ('Parchemin', 'Papier')
        p, mk = bevel_panel(t, CW - 40, 140, 16, 9, 'AFFRONTER' if label == 'Tôle rouge' else label.upper(), font, dark)
        sh = Image.new('L', sheet.size, 0); sh.paste(mk, (x0 + 26, y0 + 136)); sh = sh.filter(ImageFilter.GaussianBlur(8))
        sheet.paste(Image.new('RGB', sheet.size, (0, 0, 0)), (0, 0), sh.point(lambda v: int(v * .75)))
        sheet.paste(p, (x0 + 20, y0 + 128), mk)
    out = os.path.join(PREV, 'textures-apercu.png'); sheet.save(out); print(out)

main()
