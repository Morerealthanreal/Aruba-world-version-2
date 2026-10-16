#!/usr/bin/env python3
"""San Nicolas water tower / Museum of Industry.

Improves museumindustry.glb in place: same id, origin, and node names.
The driver's view was a low white hall. The 1939 tower, as the museum looks
now, is a yellow cylinder with tan ribs, a dark cap, and a blue glass drum
at the base. The low wing and the museum sign stay.

The Commons photo is a visual guide only. Nothing here is a pasted texture.
"""
import io
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from hero_glb import Model, box, check_glb, fan, prism, sign_quad, wall_ring, write_glb

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero" / "museumindustry.glb"
FONT = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"

YELLOW = (0.93, 0.74, 0.18)
TAN = (0.70, 0.52, 0.30)
WHITE = (0.94, 0.92, 0.86)
DARK = (0.16, 0.16, 0.17)
GLASS = (0.15, 0.45, 0.78)
CLOCK = (0.95, 0.95, 0.93)


def ring(n, r, cx, cz):
    pts = [(cx + r * math.cos(i * 2 * math.pi / n), cz + r * math.sin(i * 2 * math.pi / n)) for i in range(n)]
    area = sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n))
    if area < 0:
        pts.reverse()
    return pts


def cyl(mesh, cx, cz, r, y0, y1, n=10):
    pts = ring(n, r, cx, cz)
    wall_ring(mesh, pts, y0, y1)
    fan(mesh, pts, y1, up=True)
    fan(mesh, pts, y0, up=False)


def sign_png():
    im = Image.new("RGBA", (640, 96), (238, 190, 48, 255))
    draw = ImageDraw.Draw(im)
    font = ImageFont.truetype(FONT, 42)
    text = "MUSEUM OF INDUSTRY"
    box_ = draw.textbbox((0, 0), text, font=font)
    draw.text(((640 - (box_[2] - box_[0])) / 2, (96 - (box_[3] - box_[1])) / 2 - 4), text, font=font, fill=(30, 24, 16, 255))
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return buf.getvalue()


def build():
    M = Model("museumindustry")
    wall = M.material("wall", YELLOW, 0.8)
    trim = M.material("trim", TAN, 0.75)
    cap = M.material("cap", DARK, 0.6)
    glass = M.material("glass", GLASS, 0.2, double=True)
    white = M.material("white", WHITE, 0.7)
    sign = M.material("sign", YELLOW, 0.5, textured=True, emissive=0.2)
    png = sign_png()
    # Tower sits in the footprint. Bernhardstraat is to the north (local -Z).
    tx, tz = 1.5, 1.2
    for lod in (0, 1):
        W, T, C = M.mesh(lod, wall), M.mesh(lod, trim), M.mesh(lod, cap)
        n = 10 if lod == 0 else 6
        # low museum wing, yellow, under the shaft
        prism(W, -12, 14, -11, 8, 0.05, 4.4)
        prism(T, -12.2, 14.2, -11.2, 8.2, 4.15, 4.55)
        cyl(W, tx, tz, 5.1, 3.6, 33.5, n)
        cyl(C, tx, tz, 5.45, 33.2, 34.6, n)
        cyl(T, tx, tz, 2.2, 34.5, 36.2, n)
        if lod == 0:
            G, S, Wh = M.mesh(lod, glass), M.mesh(lod, sign), M.mesh(lod, white)
            # blue glass drum on the street side of the shaft
            cyl(G, tx, tz - 4.6, 2.7, 0.15, 8.6, 10)
            # tan ribs
            for k in range(6):
                a = k * math.pi / 3
                px = tx + 5.15 * math.cos(a)
                pz = tz + 5.15 * math.sin(a)
                prism(T, px - 0.28, px + 0.28, pz - 0.28, pz + 0.28, 6.0, 31.5)
            # art-deco slits on the north face
            for y0, y1 in ((18.0, 24.5), (26.5, 31.0)):
                prism(C, tx - 0.22, tx + 0.22, tz - 5.35, tz - 5.05, y0, y1)
            # clock, small, on the upper north face
            prism(Wh, tx - 1.15, tx + 1.15, tz - 5.4, tz - 5.15, 27.6, 29.9)
            prism(C, tx - 0.12, tx + 0.12, tz - 5.5, tz - 5.35, 27.7, 29.8)
            prism(C, tx - 1.0, tx + 1.0, tz - 5.5, tz - 5.35, 28.6, 28.85)
            # sign on the north wall of the wing, facing the road
            # North face. From the road, left is +X.
            sign_quad(
                S,
                (6.2, 3.55, -11.25),
                (-6.2, 3.55, -11.25),
                (-6.2, 2.35, -11.25),
                (6.2, 2.35, -11.25),
            )
        else:
            cyl(M.mesh(lod, glass), tx, tz - 4.6, 2.7, 0.2, 8.2, 6)
    info = write_glb(M, HERO, images=[png])
    check_glb(HERO)
    print(info)
    return info


if __name__ == "__main__":
    build()
