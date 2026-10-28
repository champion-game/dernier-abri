# Images de l'artiste (essai)

Chaque image remplace l'image actuelle **du même nom** :

| Dossier | Remplace | Format |
|---|---|---|
| `cards/` | `assets/cards_cartoon/` | illustration sans texte, ~896 × 793 (chefs : aussi `<id>_pop.webp`, 768 × 1024, fond transparent) |
| `sprites/` | `assets/sprites_cartoon/` | vu du dessus, fond transparent, personnages et zombies tournés vers le bas, murs à l'horizontale, 256 px max |
| `relics/` | `assets/relics/` | ~192 px, fond transparent |
| `ui/` | `assets/ui/` | même nom et même extension (cadre, dos, fonds, logo…) |

Après chaque ajout : `node tools/art-liste.js` (met à jour `liste.json`).
En jeu : Options → « Images de l'artiste » (site GitHub et local seulement ; ce dossier n'est pas envoyé sur itch.io).
