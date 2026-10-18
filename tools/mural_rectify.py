#!/usr/bin/env python3
"""Perspective-rectify verified mural photos → flat artwork textures.

Pipeline per refs/murals/<id>/rectify.json:
  4-point homography → optional inpaint (obstructions / windows) → mild colour balance.
No blur, posterize, or grain.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
REF_ROOT = ROOT / "refs" / "murals"
OUT_DIR = ROOT / "tools" / "sn_paintings" / "rectified"

RECTIFIED_MURAL_IDS = frozenset({
    "night_watcher",
    "lionfish",
    "flamingos",
    "nothing_to_declare",
})

DEFAULT_TARGET_H = 512


def _norm_pts(poly: list[list[float]], w: int, h: int) -> np.ndarray:
    return np.array([[int(x * w), int(y * h)] for x, y in poly], dtype=np.int32)


def mild_color_balance(rgb: np.ndarray) -> np.ndarray:
    """Light gray-world on the outer 3% border only."""
    f = rgb.astype(np.float32)
    bh = max(2, int(f.shape[0] * 0.03))
    bw = max(2, int(f.shape[1] * 0.03))
    strips = np.concatenate(
        [
            f[:bh, :].reshape(-1, 3),
            f[-bh:, :].reshape(-1, 3),
            f[:, :bw].reshape(-1, 3),
            f[:, -bw:].reshape(-1, 3),
        ],
        axis=0,
    )
    means = strips.mean(axis=0)
    target = float(means.mean())
    scale = target / np.maximum(means, 1.0)
    # Pull only 35% toward balanced so we do not wash the mural out.
    scale = 1.0 + 0.35 * (scale - 1.0)
    out = np.clip(f * scale, 0, 255).astype(np.uint8)
    return out


def _fill_mask(mask: np.ndarray, polys: list[list[list[float]]], w: int, h: int, value: int = 255) -> None:
    for poly in polys:
        if len(poly) < 3:
            continue
        cv2.fillPoly(mask, [_norm_pts(poly, w, h)], value)


def rectify_one(mural_id: str, target_h: int = DEFAULT_TARGET_H) -> Path:
    ref_dir = REF_ROOT / mural_id
    photo = ref_dir / "street-photo.jpg"
    cfg_path = ref_dir / "rectify.json"
    if not photo.is_file():
        raise FileNotFoundError(photo)
    cfg: dict[str, Any] = json.loads(cfg_path.read_text())
    aspect = float(cfg.get("aspect") or cfg.get("pw_ph") or 1.0)
    out_w = max(4, int(round(target_h * aspect)))
    out_h = target_h

    bgr = cv2.imread(str(photo))
    if bgr is None:
        raise RuntimeError(f"cv2 could not read {photo}")
    src = np.float32(cfg["src_quad"])
    dst = np.float32([[0, 0], [out_w - 1, 0], [out_w - 1, out_h - 1], [0, out_h - 1]])
    m = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(bgr, m, (out_w, out_h), flags=cv2.INTER_LANCZOS4)

    mask = np.zeros((out_h, out_w), dtype=np.uint8)
    _fill_mask(mask, cfg.get("inpaint_polys") or [], out_w, out_h)
    for rect in cfg.get("inpaint_rects") or []:
        x0, y0, x1, y1 = rect
        cv2.rectangle(
            mask,
            (int(x0 * out_w), int(y0 * out_h)),
            (int(x1 * out_w), int(y1 * out_h)),
            255,
            -1,
        )
    _fill_mask(mask, cfg.get("exclude_polys") or [], out_w, out_h)

    for rect in cfg.get("fill_rects") or []:
        x0, y0, x1, y1 = rect["rect"]
        color = tuple(rect.get("color", [0, 0, 0]))
        cv2.rectangle(
            warped,
            (int(x0 * out_w), int(y0 * out_h)),
            (int(x1 * out_w), int(y1 * out_h)),
            color,
            -1,
        )

    if mask.any():
        warped = cv2.inpaint(warped, mask, inpaintRadius=4, flags=cv2.INPAINT_TELEA)

    if cfg.get("art_poly"):
        keep = np.zeros((out_h, out_w), dtype=np.uint8)
        _fill_mask(keep, [cfg["art_poly"]], out_w, out_h, 255)
        drop = cv2.bitwise_not(keep)
        if drop.any():
            warped = cv2.inpaint(warped, drop, inpaintRadius=5, flags=cv2.INPAINT_TELEA)

    rgb = cv2.cvtColor(warped, cv2.COLOR_BGR2RGB)
    if cfg.get("color_balance", True):
        rgb = mild_color_balance(rgb)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{mural_id}.jpg"
    cv2.imwrite(str(out_path), cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), [int(cv2.IMWRITE_JPEG_QUALITY), 82])
    return out_path


def load_rectified_pil(mural_id: str):
    from PIL import Image

    path = OUT_DIR / f"{mural_id}.jpg"
    if not path.is_file():
        rectify_one(mural_id)
    return Image.open(path).convert("RGB")


def build_all(ids: list[str] | None = None) -> None:
    ids = ids or sorted(RECTIFIED_MURAL_IDS)
    for mid in ids:
        p = rectify_one(mid)
        print("rectified", mid, "→", p)


if __name__ == "__main__":
    build_all()
