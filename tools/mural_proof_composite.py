#!/usr/bin/env python3
"""Side-by-side reference | in-game texture for mural PR proofs."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def composite(ref: Path, game: Path, out: Path, label_ref: str = "Reference", label_game: str = "In-game texture") -> None:
    r = Image.open(ref).convert("RGB")
    g = Image.open(game).convert("RGB")
    h = max(r.height, g.height)
    rw = int(r.width * h / r.height)
    gw = int(g.width * h / g.height)
    r = r.resize((rw, h), Image.Resampling.LANCZOS)
    g = g.resize((gw, h), Image.Resampling.LANCZOS)
    pad = 8
    banner = 28
    w = rw + gw + pad * 3
    canvas = Image.new("RGB", (w, h + banner), (24, 24, 28))
    canvas.paste(r, (pad, banner))
    canvas.paste(g, (pad * 2 + rw, banner))
    d = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except OSError:
        font = ImageFont.load_default()
    d.text((pad, 6), label_ref, fill=(220, 220, 230), font=font)
    d.text((pad * 2 + rw, 6), label_game, fill=(220, 220, 230), font=font)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, quality=92)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("ref")
    ap.add_argument("game_texture")
    ap.add_argument("out")
    args = ap.parse_args()
    composite(Path(args.ref), Path(args.game_texture), Path(args.out))


if __name__ == "__main__":
    main()
