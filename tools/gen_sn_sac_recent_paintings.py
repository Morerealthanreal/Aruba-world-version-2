#!/usr/bin/env python3
"""Reference paintings for newer SAC-listed San Nicolas murals."""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent / "sn_paintings" / "sacrecent"
OUT.mkdir(parents=True, exist_ok=True)


def sarah():
    im = Image.new("RGB", (520, 300), (30, 30, 35))
    d = ImageDraw.Draw(im)
    d.ellipse([160, 40, 360, 240], fill=(220, 180, 160))
    d.polygon([(240, 20), (300, 80), (180, 80)], fill=(200, 40, 80))
    d.rectangle([0, 240, 520, 300], fill=(80, 200, 220))
    im.save(OUT / "sac-sarah.jpg", quality=85)


def walker():
    im = Image.new("RGB", (480, 320), (180, 60, 90))
    d = ImageDraw.Draw(im)
    d.ellipse([140, 50, 340, 250], fill=(255, 220, 210))
    d.ellipse([190, 120, 230, 150], fill=(40, 40, 50))
    d.ellipse([250, 120, 290, 150], fill=(40, 40, 50))
    d.arc([200, 170, 280, 220], 10, 170, fill=(30, 30, 30), width=5)
    im.save(OUT / "sac-walker.jpg", quality=85)


def kingfisher():
    im = Image.new("RGB", (560, 260), (120, 200, 230))
    d = ImageDraw.Draw(im)
    d.polygon([(280, 40), (420, 120), (360, 200), (200, 200), (140, 120)], fill=(20, 140, 80))
    d.polygon([(280, 60), (360, 110), (300, 90)], fill=(255, 200, 40))
    d.rectangle([0, 210, 560, 260], fill=(60, 120, 90))
    im.save(OUT / "sac-kingfisher.jpg", quality=85)


if __name__ == "__main__":
    sarah()
    walker()
    kingfisher()
    print("wrote", OUT)
