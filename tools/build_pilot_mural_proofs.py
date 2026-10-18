#!/usr/bin/env python3
"""Side-by-side proofs for hand-painted mural pilot (reference crop vs painted texture).

Reference street photos are for verification and documentation only; textures come
from paint_sn_murals.PAINT functions, never from photo paste.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from paint_sn_murals import PAINT, SPECS

ROOT = Path(__file__).resolve().parents[1]
REF = ROOT / "refs" / "murals"
OUT = ROOT / "docs" / "mural-proofs"
OUT.mkdir(parents=True, exist_ok=True)

PILOT = ("night_watcher", "lionfish", "flamingos", "nothing_to_declare")

# Loose crops of the painted surface on each SAC photo (proof display only).
REF_CROP: dict[str, tuple[int, int, int, int]] = {
    "night_watcher": (120, 520, 1880, 3000),
    "lionfish": (40, 280, 1280, 2100),
    "flamingos": (320, 180, 1980, 2480),
    "nothing_to_declare": (520, 160, 1980, 2900),
}


def label(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], font) -> None:
    draw.rectangle([xy[0] - 4, xy[1] - 2, xy[0] + 280, xy[1] + 22], fill=(0, 0, 0, 200))
    draw.text(xy, text, fill=(255, 255, 255), font=font)


def main() -> None:
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    except OSError:
        font = ImageFont.load_default()

    spec_by_id = {s["id"]: s for s in SPECS}

    for mid in PILOT:
        spec = spec_by_id[mid]
        painted = PAINT[mid](spec["pw"], spec["ph"])
        ref_path = REF / mid / "street-photo.jpg"
        if not ref_path.is_file():
            raise SystemExit(f"missing reference: {ref_path}")
        ref = Image.open(ref_path).convert("RGB")
        ref = ref.crop(REF_CROP[mid])
        target_h = 720
        ref = ref.resize((int(ref.width * target_h / ref.height), target_h), Image.Resampling.LANCZOS)
        painted = painted.resize((int(painted.width * target_h / painted.height), target_h), Image.Resampling.LANCZOS)
        gap = 24
        canvas = Image.new("RGB", (ref.width + painted.width + gap * 3, target_h + 48), (32, 32, 36))
        canvas.paste(ref, (gap, 40))
        canvas.paste(painted, (gap * 2 + ref.width, 40))
        d = ImageDraw.Draw(canvas)
        label(d, "SAC reference (cropped)", (gap, 12), font)
        label(d, "Hand-painted texture", (gap * 2 + ref.width, 12), font)
        out = OUT / f"{mid}_pilot.jpg"
        canvas.save(out, quality=88)
        print("wrote", out)


if __name__ == "__main__":
    main()
