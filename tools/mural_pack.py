"""Shared JPEG atlas bin-packer for mural paint scripts."""
from __future__ import annotations

from PIL import Image


def pack_atlas(
    images: list[Image.Image],
    max_w: int = 2048,
    pad: int = 2,
    bg: tuple[int, int, int] = (18, 18, 18),
) -> tuple[Image.Image, list[tuple[int, int, int, int]]]:
    """Pack mural tiles into one atlas. Tiles wider than max_w are scaled down; rows wrap at max_w."""
    normalized: list[Image.Image] = []
    for im in images:
        w, h = im.size
        if w > max_w:
            nh = max(1, int(round(h * max_w / w)))
            im = im.resize((max_w, nh), Image.Resampling.LANCZOS)
        normalized.append(im)

    order = sorted(range(len(normalized)), key=lambda i: (-normalized[i].size[1], -normalized[i].size[0]))
    rows: list[dict] = []
    for i in order:
        w, h = normalized[i].size
        placed = False
        for row in rows:
            if row["x"] + w <= max_w:
                row["items"].append((i, row["x"]))
                row["x"] += w + pad
                row["h"] = max(row["h"], h)
                placed = True
                break
        if not placed:
            rows.append({"x": w + pad, "h": h, "items": [(i, 0)]})

    boxes: list[tuple[int, int, int, int] | None] = [None] * len(normalized)
    y = 0
    for row in rows:
        for i, x in row["items"]:
            w, h = normalized[i].size
            boxes[i] = (x, y, w, h)
        y += row["h"] + pad

    atlas_h = (max(4, y - pad) + 3) & ~3
    atlas = Image.new("RGB", (max_w, atlas_h), bg)
    for im, box in zip(normalized, boxes):
        assert box is not None
        px, py, w, h = box
        if px + w > max_w:
            raise ValueError(f"tile {w}×{h} at x={px} exceeds atlas width {max_w}")
        atlas.paste(im, (px, py))

    assert all(b is not None for b in boxes)
    return atlas, boxes  # type: ignore[return-value]
