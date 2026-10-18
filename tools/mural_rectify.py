#!/usr/bin/env python3
"""Perspective-rectify verified mural photos → flat artwork textures."""
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


def _quad_size(quad: np.ndarray) -> tuple[float, float]:
    tl, tr, br, bl = quad
    w = 0.5 * (np.linalg.norm(tr - tl) + np.linalg.norm(br - bl))
    h = 0.5 * (np.linalg.norm(bl - tl) + np.linalg.norm(br - tr))
    return float(w), float(h)


def _warp_quad(bgr: np.ndarray, src_quad: list, out_w: int, out_h: int) -> np.ndarray:
    src = np.float32(src_quad)
    dst = np.float32([[0, 0], [out_w - 1, 0], [out_w - 1, out_h - 1], [0, out_h - 1]])
    m = cv2.getPerspectiveTransform(src, dst)
    return cv2.warpPerspective(bgr, m, (out_w, out_h), flags=cv2.INTER_LANCZOS4)


def _polys_to_mask(
    polys: list[list[list[float]]], w: int, h: int, rects: list[list[float]] | None = None
) -> np.ndarray:
    mask = np.zeros((h, w), dtype=np.uint8)
    for poly in polys:
        if len(poly) < 3:
            continue
        pts = np.array([[int(x * w), int(y * h)] for x, y in poly], dtype=np.int32)
        cv2.fillPoly(mask, [pts], 255)
    for rect in rects or []:
        x0, y0, x1, y1 = rect
        cv2.rectangle(mask, (int(x0 * w), int(y0 * h)), (int(x1 * w), int(y1 * h)), 255, -1)
    return mask


def _inpaint(bgr: np.ndarray, mask: np.ndarray, radius: int = 8) -> np.ndarray:
    if not mask.any():
        return bgr
    out = cv2.inpaint(bgr, mask, inpaintRadius=radius, flags=cv2.INPAINT_NS)
    out = cv2.inpaint(out, mask, inpaintRadius=max(3, radius // 2), flags=cv2.INPAINT_TELEA)
    return out


def _apply_patches(bgr: np.ndarray, patches: list[dict], w: int, h: int) -> np.ndarray:
    out = bgr.copy()
    for p in patches:
        dx0, dy0, dx1, dy1 = p["dst"]
        sx0, sy0, sx1, sy1 = p["src"]
        dw, dh = int((dx1 - dx0) * w), int((dy1 - dy0) * h)
        sw, sh = int((sx1 - sx0) * w), int((sy1 - sy0) * h)
        if dw < 2 or dh < 2 or sw < 2 or sh < 2:
            continue
        patch = out[
            int(sy0 * h) : int(sy1 * h),
            int(sx0 * w) : int(sx1 * w),
        ]
        if patch.size == 0:
            continue
        patch = cv2.resize(patch, (dw, dh), interpolation=cv2.INTER_LINEAR)
        out[int(dy0 * h) : int(dy0 * h) + dh, int(dx0 * w) : int(dx0 * w) + dw] = patch
    return out


def _crop_to_art(bgr: np.ndarray, art_poly: list[list[float]] | None) -> np.ndarray:
    if not art_poly:
        return bgr
    h, w = bgr.shape[:2]
    keep = np.zeros((h, w), dtype=np.uint8)
    pts = np.array([[int(x * w), int(y * h)] for x, y in art_poly], dtype=np.int32)
    cv2.fillPoly(keep, [pts], 255)
    ys, xs = np.where(keep > 0)
    if len(xs) == 0:
        return bgr
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    crop = bgr[y0:y1, x0:x1].copy()
    ckeep = keep[y0:y1, x0:x1]
    drop = cv2.bitwise_not(ckeep)
    if drop.any():
        crop = _inpaint(crop, drop, radius=3)
    return crop


def mild_color_balance(rgb: np.ndarray) -> np.ndarray:
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
    scale = 1.0 + 0.25 * (target / np.maximum(means, 1.0) - 1.0)
    return np.clip(f * scale, 0, 255).astype(np.uint8)


def _process_face(
    bgr: np.ndarray,
    face: dict[str, Any],
    target_h: int,
) -> np.ndarray:
    quad = np.float32(face["src_quad"])
    qw, qh = _quad_size(quad)
    if face.get("square"):
        side = target_h
        out_w, out_h = side, side
    else:
        scale = target_h / max(qh, 1.0)
        out_w = max(4, int(round(qw * scale)))
        out_h = target_h

    warped = _warp_quad(bgr, face["src_quad"], out_w, out_h)

    mask = _polys_to_mask(
        face.get("inpaint_polys") or [],
        out_w,
        out_h,
        face.get("inpaint_rects"),
    )
    rad = int(face.get("inpaint_radius", 10))
    passes = int(face.get("inpaint_passes", 2 if mask.any() else 1))
    for _ in range(passes):
        warped = _inpaint(warped, mask, radius=rad)
    if face.get("patch_rects"):
        h0, w0 = warped.shape[:2]
        warped = _apply_patches(warped, face.get("patch_rects") or [], w0, h0)
        # Blend patch seams
        warped = _inpaint(warped, mask, radius=max(5, rad // 2))
    warped = _crop_to_art(warped, face.get("art_poly"))
    return warped


def _stitch_horizontal(faces: list[np.ndarray], gap: int = 0) -> np.ndarray:
    if len(faces) == 1:
        return faces[0]
    h = max(im.shape[0] for im in faces)
    parts = []
    for im in faces:
        if im.shape[0] != h:
            nw = int(im.shape[1] * h / im.shape[0])
            im = cv2.resize(im, (nw, h), interpolation=cv2.INTER_LANCZOS4)
        parts.append(im)
        if gap:
            parts.append(np.full((h, gap, 3), 20, dtype=np.uint8))
    return np.concatenate(parts, axis=1)


def rectify_one(mural_id: str, target_h: int = DEFAULT_TARGET_H) -> Path:
    ref_dir = REF_ROOT / mural_id
    cfg_path = ref_dir / "rectify.json"
    cfg: dict[str, Any] = json.loads(cfg_path.read_text())
    photo = ref_dir / str(cfg.get("photo", "street-photo.jpg"))
    if not photo.is_file():
        raise FileNotFoundError(photo)
    bgr = cv2.imread(str(photo))
    if bgr is None:
        raise RuntimeError(f"cv2 could not read {photo}")

    for poly in cfg.get("src_inpaint_polys") or []:
        sm = np.zeros(bgr.shape[:2], dtype=np.uint8)
        pts = np.array(poly, dtype=np.int32)
        cv2.fillPoly(sm, [pts], 255)
        bgr = _inpaint(bgr, sm, radius=int(cfg.get("src_inpaint_radius", 18)))

    th = int(cfg.get("target_h", target_h))
    if cfg.get("faces"):
        warped_faces = [_process_face(bgr, f, th) for f in cfg["faces"]]
        warped = _stitch_horizontal(warped_faces, gap=int(cfg.get("stitch_gap", 0)))
    else:
        face = {
            "src_quad": cfg["src_quad"],
            "square": cfg.get("square"),
            "inpaint_polys": cfg.get("inpaint_polys"),
            "inpaint_rects": cfg.get("inpaint_rects"),
            "patch_rects": cfg.get("patch_rects"),
            "inpaint_radius": cfg.get("inpaint_radius", 10),
            "art_poly": cfg.get("art_poly"),
        }
        warped = _process_face(bgr, face, th)

    # Global inpaint on stitched result (person, pole, etc.)
    h, w = warped.shape[:2]
    gmask = _polys_to_mask(
        cfg.get("global_inpaint_polys") or [],
        w,
        h,
        cfg.get("global_inpaint_rects"),
    )
    gr = int(cfg.get("global_inpaint_radius", 12))
    for _ in range(int(cfg.get("global_inpaint_passes", 2))):
        warped = _inpaint(warped, gmask, radius=gr)

    if cfg.get("global_art_poly"):
        warped = _crop_to_art(warped, cfg["global_art_poly"])

    margin = cfg.get("crop_margin") or {}
    t = int(margin.get("top", 0) * h)
    b = int(margin.get("bottom", 0) * h)
    l = int(margin.get("left", 0) * w)
    r = int(margin.get("right", 0) * w)
    if t or b or l or r:
        warped = warped[t : h - b if b else h, l : w - r if r else w]

    rgb = cv2.cvtColor(warped, cv2.COLOR_BGR2RGB)
    if cfg.get("color_balance", True):
        rgb = mild_color_balance(rgb)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{mural_id}.jpg"
    cv2.imwrite(str(out_path), cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), [int(cv2.IMWRITE_JPEG_QUALITY), 85])
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
        print("rectified", mid, "→", p, _size(p))


def _size(p: Path) -> tuple[int, int]:
    im = cv2.imread(str(p))
    return (im.shape[1], im.shape[0]) if im is not None else (0, 0)


if __name__ == "__main__":
    build_all()
