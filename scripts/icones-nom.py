"""Canvia el nom escrit a les icones de public/icons (plat i coberts es conserven).

Ús: python3 scripts/icones-nom.py
Busca la franja del text (la darrera franja de píxels clars), la pinta amb el
degradat vertical del fons i hi escriu el nom nou centrat, amb la mateixa alçada.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BLANC = (237, 235, 228)
TARONJA_A = (248, 148, 44)  # #F8942C
TARONJA_B = (239, 95, 16)   # #EF5F10
PARTS = [('A ', 'blanc'), ('Taula', 'taronja')]
LLETRA = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
ESCALA = 8  # supermostreig

CARPETA = Path(__file__).resolve().parent.parent / 'public' / 'icons'
FITXERS = ['icona-512.png', 'icona-192.png', 'icona-adaptable-512.png',
           'icona-adaptable-192.png', 'apple-touch-icon.png', 'favicon-48.png']


def franja_text(im):
    w, h = im.size
    clars = [sum(1 for x in range(w) if sum(im.getpixel((x, y))[:3]) > 360) for y in range(h)]
    y = h - 1
    while clars[y] == 0:
        y -= 1
    fi = y
    while clars[y] > 0:
        y -= 1
    return y + 1, fi


def pintar(nom):
    ruta = CARPETA / nom
    im = Image.open(ruta).convert('RGB')
    w, h = im.size
    y0, y1 = franja_text(im)
    alt = y1 - y0 + 1
    # Fons: degradat vertical, el mateix color de la columna 0 a cada fila.
    marge = max(2, alt // 6)
    for y in range(y0 - marge, min(h, y1 + marge + 1)):
        c = im.getpixel((0, y))
        for x in range(w):
            im.putpixel((x, y), c)

    # Text a gran resolució i després reduït.
    S = ESCALA
    mida = 200
    lletra = ImageFont.truetype(LLETRA, mida)
    cap = lletra.getbbox('T')[3] - lletra.getbbox('T')[1]
    mida = round(mida * alt * S / cap)
    lletra = ImageFont.truetype(LLETRA, mida)
    amples = [lletra.getlength(t) for t, _ in PARTS]
    total = sum(amples)
    capa = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
    mascara_taronja = Image.new('L', (w * S, h * S), 0)
    d = ImageDraw.Draw(capa)
    dm = ImageDraw.Draw(mascara_taronja)
    top = lletra.getbbox('T')[1]
    x = (w * S - total) / 2
    y = y0 * S - top
    inici_taronja = fi_taronja = 0
    for (text, color), ample in zip(PARTS, amples):
        if color == 'blanc':
            d.text((x, y), text, font=lletra, fill=BLANC + (255,))
        else:
            dm.text((x, y), text, font=lletra, fill=255)
            inici_taronja, fi_taronja = x, x + ample
        x += ample
    degradat = Image.new('RGBA', (w * S, h * S))
    dg = ImageDraw.Draw(degradat)
    for xx in range(int(inici_taronja), int(fi_taronja) + 1):
        t = (xx - inici_taronja) / max(1, fi_taronja - inici_taronja)
        c = tuple(round(a + (b - a) * t) for a, b in zip(TARONJA_A, TARONJA_B))
        dg.line([(xx, 0), (xx, h * S)], fill=c + (255,))
    capa = Image.alpha_composite(capa, Image.composite(degradat, Image.new('RGBA', capa.size), mascara_taronja))
    capa = capa.resize((w, h), Image.LANCZOS)
    im = Image.alpha_composite(im.convert('RGBA'), capa).convert('RGB')
    im.save(ruta, optimize=True)
    print(f'{nom}: franja {y0}-{y1}')


for f in FITXERS:
    pintar(f)
