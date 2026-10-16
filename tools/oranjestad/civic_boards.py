#!/usr/bin/env python3
"""Letterboxed before | after boards for the civic batch. Reference photos are included only when the file actually shows that subject."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/opt/cursor/artifacts/oranjestad-civic")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
W, H = 520, 300
LABEL_H = 36


def contain(im, w, h):
    im = im.convert("RGB")
    scale = min(w / im.width, h / im.height)
    nw, nh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (w, h), (28, 32, 36))
    canvas.paste(resized, ((w - nw) // 2, (h - nh) // 2))
    return canvas


def board(name, panels):
    font = ImageFont.truetype(FONT, 18)
    cols = len(panels)
    out = Image.new("RGB", (cols * W, H + LABEL_H), (18, 20, 22))
    draw = ImageDraw.Draw(out)
    for i, (label, path) in enumerate(panels):
        tile = contain(Image.open(path), W, H)
        out.paste(tile, (i * W, LABEL_H))
        draw.text((i * W + 12, 8), label, fill=(236, 232, 220), font=font)
    dest = ROOT / "compare" / f"{name}.jpg"
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, quality=86)
    print("wrote", dest, out.size)


def main():
    marina_ref = Path("/tmp/ora_refs/img/Marina in Oranjestad- 1.jpg.jpg")
    pairs = ["cruise", "ferry", "parliament", "portico", "govern", "cityhall", "plaza", "museum"]
    for name in pairs:
        board(
            name,
            [
                ("Before", ROOT / "before" / f"{name}.png"),
                ("After", ROOT / "after" / f"{name}.png"),
            ],
        )
    board(
        "marina",
        [
            ("Before", ROOT / "before" / "marina.png"),
            ("After", ROOT / "after" / "marina.png"),
            ("Reference", marina_ref),
        ],
    )


if __name__ == "__main__":
    main()
