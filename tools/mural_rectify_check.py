#!/usr/bin/env python3
"""Quick QA heuristics on rectified mural tiles."""
from __future__ import annotations

import sys
from pathlib import Path

import cv2
import numpy as np

from mural_rectify import OUT_DIR, RECTIFIED_MURAL_IDS


def check(path: Path) -> list[str]:
    issues: list[str] = []
    bgr = cv2.imread(str(path))
    if bgr is None:
        return ["unreadable"]
    h, w = bgr.shape[:2]
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

    # Sky-like band at top
    top = rgb[: max(1, h // 12), :, :].reshape(-1, 3).astype(np.float32)
    if top[:, 2].mean() > 165 and top[:, 0].mean() < 140:
        issues.append("sky-like top band")

    # Skin-tone heuristic (person)
    f = rgb.reshape(-1, 3).astype(np.float32)
    r, g, b = f[:, 0], f[:, 1], f[:, 2]
    skin = (r > 95) & (g > 40) & (b > 20) & (r > g) & (r > b) & (np.abs(r - g) > 15)
    if skin.mean() > 0.02:
        issues.append(f"skin-tone pixels {skin.mean()*100:.1f}%")

    # Large flat blocks (window paste)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    for y0 in range(0, h - 20, max(8, h // 32)):
        for x0 in range(0, w - 20, max(8, w // 32)):
            patch = gray[y0 : y0 + 24, x0 : x0 + 24]
            if patch.size and patch.std() < 4.0 and 20 < patch.mean() < 235:
                issues.append(f"flat block near ({x0},{y0}) std={patch.std():.1f}")

    # Vertical seam (column correlation dip)
    if w > 80:
        col = gray[:, w // 2 - 2 : w // 2 + 2].mean()
        side = 0.5 * (gray[:, : w // 4].mean() + gray[:, -w // 4 :].mean())
        if abs(col - side) > 35:
            issues.append("strong vertical center seam")

    ar = w / max(h, 1)
    if path.stem == "night_watcher" and (ar < 0.75 or ar > 1.35):
        issues.append(f"owl aspect {ar:.2f} not ~square")

    return issues[:8]


def main() -> int:
    bad = False
    for mid in sorted(RECTIFIED_MURAL_IDS):
        p = OUT_DIR / f"{mid}.jpg"
        issues = check(p)
        status = "OK" if not issues else "FAIL"
        print(f"{mid}: {status}", "; ".join(issues) if issues else "")
        bad = bad or bool(issues)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
