"""Génère la texture de bois des menus (assets/ui/wood.webp) et le clou (assets/ui/nail.png).
Texture raccordable dans les deux sens (pas de démarcation quand elle se répète). Lancer : python3 tools/wood.py"""
import numpy as np
from PIL import Image, ImageFilter
rng=np.random.default_rng(7)
W,H,P=1024,768,128  # largeur, hauteur, hauteur d'une planche

def noise(fx,fy,seed):
    """bruit périodique (FFT) : fx, fy = finesse horizontale et verticale (plus petit = plus étiré)"""
    r=np.random.default_rng(seed)
    kx=np.fft.fftfreq(W)[None,:]*W; ky=np.fft.fftfreq(H)[:,None]*H
    amp=np.exp(-((kx/fx)**2+(ky/fy)**2)); amp[0,0]=0
    spec=amp*(r.normal(size=(H,W))+1j*r.normal(size=(H,W)))
    n=np.fft.ifft2(spec).real; return n/n.std()

Y,X=np.mgrid[0:H,0:W].astype(float)
warp=noise(1.5,5,1)*9+noise(6,30,2)*1.6
fib=noise(14,320,3)              # fibres fines, longues
pores=noise(120,500,4)
img=np.zeros((H,W,3))
dark=np.array([62,38,20]);mid=np.array([104,67,38]);light=np.array([138,93,55])
for i in range(H//P):
    sl=slice(i*P,(i+1)*P);y=Y[sl]-i*P;x=X[sl]
    freq=rng.uniform(.07,.11);ph=rng.uniform(0,6.28)
    g=np.sin((y+warp[sl]*(1+i%3*.3))*freq+ph)
    t=np.clip(.5+.2*g+.24*fib[sl]+.06*pores[sl],0,1)
    t=t**1.25
    col=np.where(t[...,None]<.5,dark+(mid-dark)*(t[...,None]*2),mid+(light-mid)*((t[...,None]-.5)*2))
    col*=rng.uniform(.86,1.07)
    # biseau : lumière en haut, joint sombre en bas
    e=np.ones_like(y);e[y<2]=1.35;e[(y>=2)&(y<4)]=1.12;e[y>=P-3]=.35;e[(y>=P-5)&(y<P-3)]=.7
    col*=e[...,None]
    # aboutement des planches (décalé d'une planche à l'autre)
    jx=int((i*397+150)%W)
    dx=(x-jx)%W
    col[dx<2]*=.35;col[(dx>=2)&(dx<4)]*=1.18
    img[sl]=col
img+=noise(200,200,9)[...,None]*4
Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save('assets/ui/wood.webp',quality=82)

# clou : tête bombée en acier, rendu en grand puis réduit (bords parfaitement ronds)
S=96;yy,xx=np.mgrid[0:S,0:S]+.5;c=S/2;r=np.hypot(xx-c,yy-c)/(S*.40)
a=np.clip((1-r)*S*.4,0,1)
hl=np.exp(-(((xx-c*.78)**2+(yy-c*.72)**2)/(S*.12)**2))
base=np.clip(.30+.45*(1-r**2)+.0,0,1)
v=np.clip(base[...,None]*np.array([150,140,128])[None,None,:]/255+hl[...,None]*.75,0,1)
shade=np.clip(r,0,1)**3
v=v*(1-.55*shade[...,None])
rim=np.clip(1-abs(r-.97)*14,0,1)
v=v*(1-.6*rim[...,None])
im=np.dstack([v*255,a*255]).astype(np.uint8)
Image.fromarray(im,'RGBA').resize((32,32),Image.LANCZOS).save('assets/ui/nail.png')
print('ok')
