# Fabrique clean/assets/plateau-clean.webp : plateau 9 x 9 au style du pack Clean UI (papier beige, encre, cadre acier).
# Même géométrie que assets/art/ui/plateau.webp : 1245 x 1263, cases de 94,1 px, grille à partir de (200, 162).
import random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops
random.seed(7)
W,H,C,X0,Y0=1245,1263,94.1,200,162
PAPER=(235,215,177);PAPER2=(217,191,142);INK=(17,17,17);STEEL=(74,79,82);PANEL=(27,31,32);ORANGE=(230,57,29)
im=Image.new('RGBA',(W,H),(0,0,0,0))
gx0,gy0,gx1,gy1=X0,Y0,X0+9*C,Y0+9*C
# cadre acier : un anneau d'une case autour de la grille
fx0,fy0,fx1,fy1=gx0-C,gy0-C,gx1+C,gy1+C
d=ImageDraw.Draw(im)
d.rounded_rectangle([fx0,fy0,fx1,fy1],radius=18,fill=PANEL+(255,),outline=INK+(255,),width=6)
d.rounded_rectangle([fx0+10,fy0+10,fx1-10,fy1-10],radius=12,outline=STEEL+(255,),width=5)
# plaques de métal (joints) et rivets
for i in range(1,10):
  for (x,y) in [(gx0+i*C,fy0 ),(gx0+i*C,gy1)]: d.line([x,y+12,x,y+C-12],fill=(12,14,15,255),width=3)
  for (x,y) in [(fx0,gy0+i*C),(gx1,gy0+i*C)]: d.line([x+12,y,x+C-12,y],fill=(12,14,15,255),width=3)
def rivet(x,y,r=7):
  d.ellipse([x-r-1,y-r-1,x+r+1,y+r+1],fill=INK+(255,))
  d.ellipse([x-r,y-r,x+r,y+r],fill=(110,116,119,255));d.ellipse([x-r+2,y-r+2,x+1,y+1],fill=(190,195,196,255))
for i in range(0,10):
  for x,y in [(gx0+i*C+C/2,fy0+24),(gx0+i*C+C/2,fy1-24),(fx0+24,gy0+i*C+C/2),(fx1-24,gy0+i*C+C/2)]:
    if i<9: rivet(x,y,6)
for x,y in [(fx0+30,fy0+30),(fx1-30,fy0+30),(fx0+30,fy1-30),(fx1-30,fy1-30)]: rivet(x,y,10)
# papier : grain + taches grises douces
paper=Image.new('RGB',(int(gx1-gx0)+1,int(gy1-gy0)+1),PAPER)
pw,ph=paper.size
noise=Image.effect_noise((pw,ph),22).convert('L')
grain=Image.merge('RGB',[noise]*3)
paper=ImageChops.blend(paper,ImageChops.multiply(paper,ImageChops.add(grain,Image.new('RGB',(pw,ph),(150,150,150)))),.35)
stain=Image.new('L',(pw,ph),0);sd=ImageDraw.Draw(stain)
for _ in range(40):
  x,y,r=random.randint(0,pw),random.randint(0,ph),random.randint(25,90)
  sd.ellipse([x-r,y-r*.7,x+r,y+r*.7],fill=random.randint(55,115))
stain=stain.filter(ImageFilter.GaussianBlur(28))
paper=Image.composite(Image.new('RGB',(pw,ph),(160,150,130)),paper,stain)
pd=ImageDraw.Draw(paper)
# légère variation de teinte par case
for r in range(9):
  for c in range(9):
    if random.random()<.35:
      x,y=c*C,r*C;t=random.randint(6,16)
      ov=Image.new('RGBA',(int(C),int(C)),(120,95,60,t));paper.paste(ov,(int(x),int(y)),ov)
# croix du chemin (colonne et ligne du milieu) : papier plus sombre
for k in range(9):
  for (c,r) in [(4,k),(k,4)]:
    ov=Image.new('RGBA',(int(C),int(C)),(80,72,60,70));paper.paste(ov,(int(c*C),int(r*C)),ov)
# éclaboussures orange discrètes
for _ in range(7):
  x,y=random.randint(30,pw-30),random.randint(30,ph-30)
  for _ in range(14):
    a=random.random()*6.28;rr=random.random()*22;s=random.randint(2,7)
    pd.ellipse([x+math.cos(a)*rr-s,y+math.sin(a)*rr-s,x+math.cos(a)*rr+s,y+math.sin(a)*rr+s],fill=(196,64,38))
# traits d'encre de la grille
for i in range(10):
  w=4 if i in (0,9) else 2
  pd.line([i*C,0,i*C,ph],fill=(58,50,40),width=w);pd.line([0,i*C,pw,i*C],fill=(58,50,40),width=w)
im.paste(paper,(int(gx0),int(gy0)))
d=ImageDraw.Draw(im)
d.rectangle([gx0-3,gy0-3,gx1+3,gy1+3],outline=INK+(255,),width=5)
# ouvertures du cadre au bout du chemin (haut, bas, gauche, droite)
mx,my=gx0+4*C,gy0+4*C
for box in [(mx,fy0,mx+C,gy0),(mx,gy1,mx+C,fy1),(fx0,my,gx0,my+C),(gx1,my,fx1,my+C)]:
  d.rectangle(box,fill=(150,138,115,255),outline=INK+(255,),width=3)
im.save('clean/assets/plateau-clean.webp',quality=86)
print('ok',im.size)
