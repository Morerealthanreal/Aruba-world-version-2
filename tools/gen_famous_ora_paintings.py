#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent / "sn_paintings" / "famous"
OUT.mkdir(parents=True, exist_ok=True)

def saffron():
    im = Image.new("RGB", (480, 320), (18, 18, 22))
    d = ImageDraw.Draw(im)
    for i, c in enumerate([(210, 40, 45), (240, 200, 40), (35, 90, 200)]):
        d.rectangle([40 + i * 140, 40, 160 + i * 140, 280], fill=c)
    d.polygon([(60, 260), (420, 260), (390, 300), (90, 300)], fill=(120, 80, 40))
    im.save(OUT / "famous-saffron.jpg", quality=85)

def holambra():
    im = Image.new("RGB", (420, 300), (120, 200, 220))
    d = ImageDraw.Draw(im)
    d.ellipse([120, 80, 300, 220], fill=(255, 120, 160))
    d.polygon([(200, 60), (230, 120), (170, 120)], fill=(255, 200, 60))
    d.rectangle([0, 250, 420, 300], fill=(90, 160, 90))
    im.save(OUT / "famous-holambra.jpg", quality=85)

if __name__ == "__main__":
    saffron()
    holambra()
    print("wrote ora reference paintings to", OUT)
