#!/usr/bin/env python3
import shutil
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent / "sn_paintings" / "sacbatch8"
PAINT = Path(__file__).resolve().parent / "sn_paintings"
OUT.mkdir(parents=True, exist_ok=True)


def boss():
    src = PAINT / "boss.jpg"
    if src.is_file():
        shutil.copy2(src, OUT / "b8-boss.jpg")
    else:
        im = Image.new("RGB", (2048, 328), (60, 120, 180))
        im.save(OUT / "b8-boss.jpg", quality=85)


def nothing():
    im = Image.new("RGB", (480, 260), (220, 200, 160))
    d = ImageDraw.Draw(im)
    d.rectangle([40, 60, 440, 220], fill=(80, 60, 40))
    d.rectangle([180, 100, 300, 180], fill=(200, 180, 140))
    im.save(OUT / "b8-nothing.jpg", quality=85)


if __name__ == "__main__":
    boss()
    nothing()
    print("wrote", OUT)
