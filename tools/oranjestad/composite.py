#!/usr/bin/env python3
"""Side-by-side before / after / reference boards for the Oranjestad PR.

Reference photos stay out of the game. They are only pasted into these
review boards.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BEFORE = Path("/opt/cursor/artifacts/oranjestad/before")
AFTER = Path("/opt/cursor/artifacts/oranjestad/after")
REFS = Path("/tmp/ora_refs/img")
OUT = Path("/opt/cursor/artifacts/oranjestad/compare")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_SM = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# name, reference file, license line, before file or None
BOARDS = [
    (
        "main-street",
        "mainstreet",
        "street-row",
        "Aruba Oranjestad MainStreet.jpg.jpg",
        "Main Street reference, Wikimedia Commons",
    ),
    (
        "main-street-east",
        "mainstreet-east",
        "mainstreet-east",
        "Caya G.F. Betico Croes.jpg.jpg",
        "Caya G.F. Betico Croes, CC BY-SA 4.0",
    ),
    (
        "shop-gables",
        None,
        "facade-close",
        "Downtown Oranjestad, Aruba (4901401611).jpg.jpg",
        "Downtown Oranjestad gables, CC BY 2.0",
    ),
    (
        "lg-smith",
        "lg-smith",
        "lg-smith",
        "ARUBA-oranjestad-lgsmithboulev.jpg.jpg",
        "L.G. Smith Boulevard, Wikimedia Commons",
    ),
    (
        "royal-plaza",
        "royal-plaza",
        "royal-plaza",
        "ARUBA-oranjestad-royalplaza.jpg.jpg",
        "Royal Plaza from the harbour, Wikimedia Commons",
    ),
    (
        "fort-zoutman",
        "fort-zoutman",
        "fort-close",
        "Fort Zoutman Willem III Toren.jpg.jpg",
        "Fort Zoutman / Willem III Tower, CC BY-SA 3.0",
    ),
    (
        "wilhelmina",
        "wilhelmina",
        "park-close",
        "Wilhelminapark (Oranjestad) - 1.jpg.jpg",
        "Wilhelmina Park, CC BY-SA 4.0",
    ),
    (
        "cruise-terminal",
        "cruise-terminal",
        "cruise-close",
        "ARUBA CRUISE SHIP TERMINAL - panoramio.jpg.jpg",
        "Cruise terminal skyline, CC BY 3.0",
    ),
    (
        "renaissance",
        "renaissance",
        "renaissance",
        "Oranjestad -Centro de Aruba- L.G. Smith Blvd - Renaissance Mall - panoramio.jpg.jpg",
        "Renaissance Mall, CC BY 3.0",
    ),
    (
        "harbour",
        "harbour-overview",
        "harbour-overview",
        "ARUBA-oranjestad-hafen-1.jpg.jpg",
        "Oranjestad harbour, Wikimedia Commons",
    ),
    (
        "tram",
        None,
        "street-row",
        "Tourist tram in Oranjestad - 1.jpg.jpg",
        "Downtown tram, CC BY-SA 4.0",
    ),
]


def fit(im, w, h):
    im = im.convert("RGB")
    scale = max(w / im.width, h / im.height)
    nw, nh = int(im.width * scale), int(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left, top = (nw - w) // 2, (nh - h) // 2
    return im.crop((left, top, left + w, top + h))


def panel(path, w, h, label, font, small):
    canvas = Image.new("RGB", (w, h + 36), (28, 32, 38))
    if path and path.exists():
        canvas.paste(fit(Image.open(path), w, h), (0, 36))
    else:
        ImageDraw.Draw(canvas).rectangle((0, 36, w, h + 36), fill=(60, 64, 72))
    draw = ImageDraw.Draw(canvas)
    draw.text((10, 8), label, fill=(255, 255, 255), font=font)
    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype(FONT, 18)
    small = ImageFont.truetype(FONT_SM, 14)
    pw, ph = 560, 315
    for name, before, after, ref, credit in BOARDS:
        parts = []
        if before:
            parts.append(panel(BEFORE / f"{before}.png", pw, ph, "Before", font, small))
        parts.append(panel(AFTER / f"{after}.png", pw, ph, "After", font, small))
        parts.append(panel(REFS / ref, pw, ph, "Reference", font, small))
        gap = 8
        width = sum(p.width for p in parts) + gap * (len(parts) - 1)
        board = Image.new("RGB", (width, parts[0].height + 28), (16, 18, 22))
        x = 0
        for p in parts:
            board.paste(p, (x, 0))
            x += p.width + gap
        ImageDraw.Draw(board).text((10, parts[0].height + 6), credit, fill=(210, 214, 220), font=small)
        dest = OUT / f"{name}.jpg"
        board.save(dest, quality=86)
        print(dest, board.size)


if __name__ == "__main__":
    main()
