#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent / "sn_paintings" / "sacclassics"
OUT.mkdir(parents=True, exist_ok=True)


def pelican():
    im = Image.new("RGB", (520, 240), (200, 220, 240))
    d = ImageDraw.Draw(im)
    d.polygon([(80, 180), (200, 40), (420, 60), (360, 200)], fill=(240, 240, 250))
    d.polygon([(200, 40), (280, 80), (240, 120)], fill=(255, 180, 40))
    im.save(OUT / "classic-pelican.jpg", quality=85)


def turtles():
    im = Image.new("RGB", (600, 220), (40, 120, 90))
    d = ImageDraw.Draw(im)
    for i, c in enumerate([(120, 140), (280, 130), (440, 150)]):
        d.ellipse([c[0] - 50, c[1] - 30, c[0] + 50, c[1] + 30], fill=(60, 160, 100))
        d.ellipse([c[0] + 40, c[1] - 10, c[0] + 70, c[1] + 10], fill=(80, 180, 120))
    im.save(OUT / "classic-turtles.jpg", quality=85)


def alice():
    im = Image.new("RGB", (640, 200), (30, 30, 40))
    d = ImageDraw.Draw(im)
    d.ellipse([220, 30, 420, 180], fill=(255, 220, 200))
    d.rectangle([280, 20, 360, 60], fill=(200, 40, 80))
    im.save(OUT / "classic-alice.jpg", quality=85)


if __name__ == "__main__":
    pelican()
    turtles()
    alice()
    print("wrote", OUT)
