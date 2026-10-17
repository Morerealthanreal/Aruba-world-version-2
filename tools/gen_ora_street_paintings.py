#!/usr/bin/env python3
"""Original reference paintings for Oranjestad street murals (not shipped as photos)."""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent / "sn_paintings" / "orastreet"
OUT.mkdir(parents=True, exist_ok=True)


def harbor_wil():
    im = Image.new("RGB", (560, 300), (200, 220, 240))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 180, 560, 300], fill=(30, 90, 140))
    d.polygon([(80, 180), (200, 120), (320, 160), (420, 100), (520, 180)], fill=(220, 200, 160))
    d.rectangle([250, 90, 310, 150], fill=(180, 60, 50))
    im.save(OUT / "ora-harbor.jpg", quality=85)


def main_betico():
    im = Image.new("RGB", (720, 280), (255, 245, 230))
    d = ImageDraw.Draw(im)
    for i, c in enumerate([(255, 200, 180), (180, 220, 255), (255, 230, 150), (200, 255, 200)]):
        d.rectangle([i * 180, 40, (i + 1) * 180, 240], fill=c)
    d.rectangle([0, 0, 720, 35], fill=(220, 50, 60))
    im.save(OUT / "ora-betico.jpg", quality=85)


def fort_reef():
    im = Image.new("RGB", (800, 260), (20, 80, 120))
    d = ImageDraw.Draw(im)
    for i in range(8):
        d.ellipse([40 + i * 95, 80, 120 + i * 95, 160], fill=(255, 120, 100))
    d.rectangle([0, 170, 800, 260], fill=(40, 160, 140))
    im.save(OUT / "ora-reef.jpg", quality=85)


def penha_color():
    im = Image.new("RGB", (480, 290), (255, 200, 60))
    d = ImageDraw.Draw(im)
    d.ellipse([140, 50, 340, 220], fill=(255, 120, 160))
    d.rectangle([0, 220, 480, 290], fill=(90, 160, 220))
    im.save(OUT / "ora-penha.jpg", quality=85)


if __name__ == "__main__":
    harbor_wil()
    main_betico()
    fort_reef()
    penha_color()
    print("wrote ora street paintings to", OUT)
