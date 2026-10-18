#!/usr/bin/env python3
"""Build a mural JPEG from a reference photo: same composition, painted look, not a photo paste."""
from __future__ import annotations

import random
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


def _grain(im: Image.Image, amount: int, seed: int) -> None:
    r = random.Random(seed)
    px = im.load()
    w, h = im.size
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            j = r.randint(-amount, amount)
            for dy in (0, 1):
                for dx in (0, 1):
                    if x + dx >= w or y + dy >= h:
                        continue
                    p = px[x + dx, y + dy]
                    px[x + dx, y + dy] = tuple(max(0, min(255, c + j)) for c in p[:3])


def _cover_crop(im: Image.Image, tw: int, th: int) -> Image.Image:
    """Center-crop to aspect tw:th then resize."""
    w, h = im.size
    target = tw / th
    cur = w / h
    if cur > target:
        nw = int(h * target)
        left = (w - nw) // 2
        im = im.crop((left, 0, left + nw, h))
    else:
        nh = int(w / target)
        top = (h - nh) // 2
        im = im.crop((0, top, w, top + nh))
    return im.resize((tw, th), Image.Resampling.LANCZOS)


def recreate_from_ref(
    ref_path: Path,
    tw: int,
    th: int,
    *,
    crop: tuple[float, float, float, float] | None = None,
    colors: int = 36,
    seed: int = 1,
) -> Image.Image:
    """Paint-like rebuild: blur → palette reduction → unsharp → grain (never raw photo bytes)."""
    im = Image.open(ref_path).convert("RGB")
    if crop:
        w, h = im.size
        l, t, r, b = crop
        im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))
    im = _cover_crop(im, tw, th)
    # Slight soften before quantize so edges read as brush, not sensor noise.
    im = im.filter(ImageFilter.GaussianBlur(radius=1.1))
    im = im.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).convert("RGB")
    im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=70, threshold=4))
    edges = im.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(radius=0.6))
    im = Image.blend(im, edges, alpha=0.12)
    _grain(im, 9, seed)
    return im


def save_recreation(
    ref_path: Path,
    out_path: Path,
    tw: int,
    th: int,
    **kwargs,
) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    recreate_from_ref(ref_path, tw, th, **kwargs).save(out_path, quality=88, optimize=True)
