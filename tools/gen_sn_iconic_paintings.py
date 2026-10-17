#!/usr/bin/env python3
"""Original reference paintings for the iconic San Nicolas mural batch (not shipped as photos)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent / "sn_paintings" / "iconic"
OUT.mkdir(parents=True, exist_ok=True)


def glow_dark():
    im = Image.new("RGB", (520, 300), (8, 12, 40))
    d = ImageDraw.Draw(im)
    for i in range(6):
        y = 80 + i * 28
        d.ellipse([60 + i * 70, y, 140 + i * 70, y + 50], fill=(20, 180, 220))
        d.arc([50 + i * 70, y - 10, 150 + i * 70, y + 60], 200, 340, fill=(180, 240, 255), width=3)
    d.rectangle([0, 250, 520, 300], fill=(40, 42, 55))
    im.save(OUT / "iconic-glow.jpg", quality=85)


def mucha_bunita():
    im = Image.new("RGB", (480, 320), (220, 180, 140))
    d = ImageDraw.Draw(im)
    d.ellipse([170, 40, 310, 200], fill=(255, 210, 190))
    d.polygon([(240, 30), (270, 90), (210, 90)], fill=(180, 40, 60))
    d.rectangle([120, 200, 360, 320], fill=(200, 50, 80))
    for x in range(130, 350, 18):
        d.line([(x, 210), (x, 310)], fill=(255, 220, 100), width=2)
    im.save(OUT / "iconic-mucha.jpg", quality=85)


def greetings():
    im = Image.new("RGB", (640, 280), (240, 90, 70))
    d = ImageDraw.Draw(im)
    d.rectangle([20, 20, 620, 260], outline=(255, 255, 240), width=6)
    d.rectangle([40, 50, 600, 230], fill=(30, 140, 200))
    d.text((70, 100), "GREETINGS", fill=(255, 255, 255))
    d.text((70, 140), "from ARUBA", fill=(255, 240, 120))
    im.save(OUT / "iconic-greetings.jpg", quality=85)


def flying_ducks():
    im = Image.new("RGB", (700, 260), (160, 45, 40))
    d = ImageDraw.Draw(im)
    for i in range(5):
        x = 40 + i * 130
        d.polygon([(x, 140), (x + 50, 100), (x + 100, 140)], fill=(255, 255, 255))
        d.ellipse([x + 30, 130, x + 70, 155], fill=(255, 220, 80))
    im.save(OUT / "iconic-ducks.jpg", quality=85)


def theater_mask():
    im = Image.new("RGB", (500, 300), (25, 25, 35))
    d = ImageDraw.Draw(im)
    d.ellipse([150, 60, 350, 240], fill=(255, 200, 40))
    d.ellipse([190, 120, 230, 160], fill=(20, 20, 20))
    d.ellipse([270, 120, 310, 160], fill=(20, 20, 20))
    d.arc([200, 170, 300, 220], 20, 160, fill=(180, 30, 30), width=6)
    im.save(OUT / "iconic-theater.jpg", quality=85)


def charlies_strip():
    im = Image.new("RGB", (540, 280), (255, 230, 200))
    d = ImageDraw.Draw(im)
    colors = [(255, 120, 90), (120, 200, 255), (255, 220, 100), (180, 255, 180)]
    w = 540 // len(colors)
    for i, c in enumerate(colors):
        d.rectangle([i * w, 0, (i + 1) * w, 280], fill=c)
    d.rectangle([0, 200, 540, 280], fill=(60, 60, 70))
    im.save(OUT / "iconic-charlie.jpg", quality=85)


if __name__ == "__main__":
    glow_dark()
    mucha_bunita()
    greetings()
    flying_ducks()
    theater_mask()
    charlies_strip()
    print("wrote iconic paintings to", OUT)
