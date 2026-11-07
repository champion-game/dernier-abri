"""Miniatures des illustrations de cartes : assets/cards_cartoon/*.webp -> assets/cards_min/*.webp (320 px de large).

Les petites cartes (main, collection, decks, listes) affichent la miniature ; la grande carte (zoom, aube, détail)
charge l'image complète. À relancer après l'ajout ou le remplacement d'une illustration :
    python3 tools/miniatures.py
Le test moteur (tools/test-engine.js) signale une miniature manquante.
"""
import os
import sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'assets', 'cards_cartoon')
DST = os.path.join(ROOT, 'assets', 'cards_min')
LARGEUR = 320
QUALITE = 80

os.makedirs(DST, exist_ok=True)
faits = 0
for nom in sorted(os.listdir(SRC)):
    if not nom.endswith('.webp'):
        continue
    src, dst = os.path.join(SRC, nom), os.path.join(DST, nom)
    if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src) and '--tout' not in sys.argv:
        continue
    im = Image.open(src)
    w, h = im.size
    if w > LARGEUR:
        im = im.resize((LARGEUR, round(h * LARGEUR / w)), Image.LANCZOS)
    im.save(dst, 'webp', quality=QUALITE, method=6)
    faits += 1
# miniatures dont l'image a disparu
for nom in os.listdir(DST):
    if not os.path.exists(os.path.join(SRC, nom)):
        os.remove(os.path.join(DST, nom))
print(f'{faits} miniature(s) créée(s) dans assets/cards_min/')
