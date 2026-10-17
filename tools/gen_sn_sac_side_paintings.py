#!/usr/bin/env python3
"""Reference paintings for SAC side-street San Nicolas murals (batch 4)."""
from pathlib import Path
import shutil

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent / "sn_paintings" / "sacside"
PAINT = Path(__file__).resolve().parent / "sn_paintings"
OUT.mkdir(parents=True, exist_ok=True)


def lionfish():
    im = Image.new("RGB", (640, 220), (12, 12, 18))
    d = ImageDraw.Draw(im)
    d.polygon([(80, 120), (520, 40), (560, 140), (200, 200)], fill=(255, 80, 40))
    d.polygon([(520, 40), (600, 90), (560, 140)], fill=(200, 40, 30))
    for i in range(6):
        d.line([(120 + i * 70, 200), (100 + i * 70, 160)], fill=(255, 200, 60), width=4)
    im.save(OUT / "side-lionfish.jpg", quality=85)


def guache():
    im = Image.new("RGB", (720, 320), (40, 20, 80))
    d = ImageDraw.Draw(im)
    d.ellipse([80, 40, 320, 280], fill=(255, 220, 80))
    d.ellipse([400, 50, 640, 290], fill=(80, 200, 255))
    d.rectangle([0, 0, 720, 60], fill=(200, 40, 120))
    im.save(OUT / "side-guache.jpg", quality=85)


def casa_pescador():
    im = Image.new("RGB", (520, 260), (30, 90, 140))
    d = ImageDraw.Draw(im)
    d.rectangle([60, 80, 460, 240], fill=(220, 200, 170))
    d.polygon([(60, 80), (260, 20), (460, 80)], fill=(180, 60, 50))
    d.ellipse([200, 120, 280, 200], fill=(255, 210, 180))
    d.rectangle([0, 220, 520, 260], fill=(60, 140, 200))
    im.save(OUT / "side-casa-pescador.jpg", quality=85)


def robot_ship():
    im = Image.new("RGB", (580, 240), (120, 200, 230))
    d = ImageDraw.Draw(im)
    d.polygon([(40, 200), (120, 80), (480, 100), (540, 200)], fill=(90, 90, 100))
    d.rectangle([200, 40, 360, 120], fill=(200, 60, 80))
    d.ellipse([250, 130, 310, 170], fill=(40, 200, 220))
    im.save(OUT / "side-robot-ship.jpg", quality=85)


def mujer():
    src = PAINT / "mujer_azul.jpg"
    if src.is_file():
        shutil.copy2(src, OUT / "side-mujer.jpg")
    else:
        im = Image.new("RGB", (600, 300), (0, 160, 220))
        d = ImageDraw.Draw(im)
        d.ellipse([180, 40, 420, 260], fill=(255, 220, 200))
        im.save(OUT / "side-mujer.jpg", quality=85)


if __name__ == "__main__":
    lionfish()
    guache()
    casa_pescador()
    robot_ship()
    mujer()
    print("wrote", OUT)
