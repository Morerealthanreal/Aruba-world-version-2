#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent / "sn_paintings" / "sacbatch7"
OUT.mkdir(parents=True, exist_ok=True)


def night_watcher():
    im = Image.new("RGB", (800, 280), (245, 235, 210))
    d = ImageDraw.Draw(im)
    d.ellipse([280, 40, 520, 220], fill=(80, 50, 30))
    d.ellipse([340, 100, 400, 150], fill=(255, 220, 80))
    d.ellipse([420, 100, 480, 150], fill=(255, 220, 80))
    im.save(OUT / "b7-night-watcher.jpg", quality=85)


def flamingos():
    im = Image.new("RGB", (900, 300), (200, 40, 50))
    d = ImageDraw.Draw(im)
    d.ellipse([120, 80, 280, 260], fill=(255, 120, 160))
    d.ellipse([400, 60, 560, 240], fill=(255, 100, 140))
    d.rectangle([0, 0, 900, 300], fill=(200, 40, 50))
    im.save(OUT / "b7-flamingos.jpg", quality=85)


def iguana():
    im = Image.new("RGB", (960, 220), (60, 140, 80))
    d = ImageDraw.Draw(im)
    d.polygon([(40, 180), (200, 40), (880, 60), (720, 200)], fill=(40, 180, 90))
    d.polygon([(200, 40), (320, 100), (240, 120)], fill=(255, 80, 40))
    im.save(OUT / "b7-iguana.jpg", quality=85)


def prikichi():
    im = Image.new("RGB", (520, 240), (120, 180, 220))
    d = ImageDraw.Draw(im)
    d.ellipse([160, 60, 360, 200], fill=(30, 30, 40))
    d.polygon([(260, 20), (300, 80), (220, 80)], fill=(200, 60, 40))
    im.save(OUT / "b7-prikichi.jpg", quality=85)


def melting_pot():
    im = Image.new("RGB", (700, 200), (90, 60, 120))
    d = ImageDraw.Draw(im)
    for i in range(5):
        d.ellipse([40 + i * 130, 40, 140 + i * 130, 160], fill=(200 + i * 10, 150, 100 + i * 20))
    im.save(OUT / "b7-melting-pot.jpg", quality=85)


if __name__ == "__main__":
    night_watcher()
    flamingos()
    iguana()
    prikichi()
    melting_pot()
    print("wrote", OUT)
