#!/usr/bin/env python3
"""Letterboxed before | after boards for the side-street and harbour batch."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/opt/cursor/artifacts/oranjestad-lanes")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
W, H = 520, 300
LABEL_H = 36

# Harbour ground photo. The side-street boards stay before | after; the
# reference files we have are Main Street and the harbour, not Schelpstraat.
HARBOR_REF = Path("/tmp/ora_refs/img/Downtown Oranjestad, Aruba (4901401611).jpg.jpg")


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
    for name in ("schelp", "klip", "haven", "west"):
        board(
            name,
            [
                ("Before", ROOT / "before" / f"{name}.png"),
                ("After", ROOT / "after" / f"{name}.png"),
            ],
        )
    panels = [
        ("Before", ROOT / "before" / "harbor.png"),
        ("After", ROOT / "after" / "harbor.png"),
    ]
    if HARBOR_REF.exists():
        panels.append(("Reference", HARBOR_REF))
    board("harbor", panels)


if __name__ == "__main__":
    main()
