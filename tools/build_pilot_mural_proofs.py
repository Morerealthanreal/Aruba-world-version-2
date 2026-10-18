#!/usr/bin/env python3
"""Side-by-side: SAC street photo (crop) vs rectified atlas tile."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from mural_rectify import RECTIFIED_MURAL_IDS, rectify_one

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "refs" / "murals"
OUT = ROOT / "docs" / "mural-proofs"
RECT = ROOT / "tools" / "sn_paintings" / "rectified"

REF_CROP: dict[str, tuple[int, int, int, int]] = {
    "night_watcher": (120, 520, 1880, 3000),
    "lionfish": (40, 280, 1280, 1180),
}


def label(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], font) -> None:
    draw.rectangle([xy[0] - 4, xy[1] - 2, xy[0] + 320, xy[1] + 22], fill=(0, 0, 0, 200))
    draw.text(xy, text, fill=(255, 255, 255), font=font)


def main() -> None:
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except OSError:
        font = ImageFont.load_default()

    OUT.mkdir(parents=True, exist_ok=True)
    for mid in sorted(RECTIFIED_MURAL_IDS):
        rectify_one(mid)
        ref_path = REF / mid / "street-photo.jpg"
        ref = Image.open(ref_path).convert("RGB").crop(REF_CROP[mid])
        painted = Image.open(RECT / f"{mid}.jpg").convert("RGB")
        target_h = 720
        ref = ref.resize((int(ref.width * target_h / ref.height), target_h), Image.Resampling.LANCZOS)
        painted = painted.resize(
            (int(painted.width * target_h / painted.height), target_h), Image.Resampling.LANCZOS
        )
        gap = 24
        canvas = Image.new("RGB", (ref.width + painted.width + gap * 3, target_h + 48), (32, 32, 36))
        canvas.paste(ref, (gap, 40))
        canvas.paste(painted, (gap * 2 + ref.width, 40))
        d = ImageDraw.Draw(canvas)
        label(d, "SAC reference (crop)", (gap, 12), font)
        label(d, "Rectified texture", (gap * 2 + ref.width, 12), font)
        out = OUT / f"{mid}_pilot.jpg"
        canvas.save(out, quality=88)
        print("wrote", out)


if __name__ == "__main__":
    main()
