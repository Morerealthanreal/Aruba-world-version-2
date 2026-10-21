#!/usr/bin/env python3
"""Photo | in game boards for the Palm Beach ground seat.

Reference photos stay off the geometry. A photo is included only when it
has no people. Palm Beach and Paseo Herencia references are crowded or
absent, so those boards are the in-game pair.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

SHOTS = Path("/tmp/palm-boards")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
OUTS = {
    "palm": Path("/tmp/wt-ground/refs/places/palm-eagle-beach/palm-beach/ground.jpg"),
    "ritz": Path("/tmp/wt-ground/refs/places/palm-eagle-beach/ritz/ground.jpg"),
    "paseo": Path("/tmp/wt-ground/refs/places/palm-eagle-beach/paseo-herencia/ground.jpg"),
}
PHOTO = {
    "ritz": Path("/tmp/wt-ground/refs/places/palm-eagle-beach/ritz/esri_aerial.jpg"),
}


def fit(im, w, h):
    im = im.convert("RGB")
    scale = max(w / im.width, h / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left, top = max(0, (nw - w) // 2), max(0, (nh - h) // 2)
    return im.crop((left, top, left + w, top + h))


def panel(path, w, h, label, font):
    canvas = Image.new("RGB", (w, h + 36), (24, 28, 34))
    canvas.paste(fit(Image.open(path), w, h), (0, 36))
    ImageDraw.Draw(canvas).text((12, 8), label, fill=(255, 255, 255), font=font)
    return canvas


def main():
    font = ImageFont.truetype(FONT, 22)
    pw, ph = 640, 360
    for name, dest in OUTS.items():
        parts = []
        photo = PHOTO.get(name)
        if photo:
            parts.append(panel(photo, pw, ph, "photo", font))
        parts.append(panel(SHOTS / f"{name}-before.jpg", pw, ph, "in game, before", font))
        parts.append(panel(SHOTS / f"{name}-after.jpg", pw, ph, "in game, after", font))
        gap = 8
        width = sum(p.width for p in parts) + gap * (len(parts) - 1)
        board = Image.new("RGB", (width, parts[0].height), (12, 14, 18))
        x = 0
        for p in parts:
            board.paste(p, (x, 0))
            x += p.width + gap
        dest.parent.mkdir(parents=True, exist_ok=True)
        board.save(dest, quality=86)
        print(dest, board.size)


if __name__ == "__main__":
    main()
