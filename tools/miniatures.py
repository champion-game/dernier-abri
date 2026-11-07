"""Miniatures des illustrations de cartes (320 px de large), sans toucher aux originaux :
    assets/cards_cartoon/*.webp -> assets/cards_min/*.webp
    assets/art/cards/*.webp     -> assets/art_min/cards/*.webp   (style artiste)

Les petites cartes (main, collection, decks, listes) affichent la miniature ; la grande carte (zoom, aube, détail)
charge l'image complète. À relancer après l'ajout ou le remplacement d'une illustration :
    python3 tools/miniatures.py
Le test moteur (tools/test-engine.js) signale une miniature manquante.
"""
import os
import sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DOSSIERS = [
    (os.path.join(ROOT, 'assets', 'cards_cartoon'), os.path.join(ROOT, 'assets', 'cards_min')),
    (os.path.join(ROOT, 'assets', 'art', 'cards'), os.path.join(ROOT, 'assets', 'art_min', 'cards')),
]
LARGEUR = 320
QUALITE = 80

faits = 0
for SRC, DST in DOSSIERS:
    os.makedirs(DST, exist_ok=True)
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
print(f'{faits} miniature(s) créée(s)')
