#!/usr/bin/env python3
"""Rebuild SAC recent mural panels from refs/murals/* (reference photos, not shipped textures)."""
from pathlib import Path

from mural_recreate_from_ref import save_recreation

ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / "refs" / "murals"
OUT = Path(__file__).resolve().parent / "sn_paintings" / "sacrecent"
OUT.mkdir(parents=True, exist_ok=True)

# Tile pixel heights match paint_sn_sac_recent.py ph; widths follow wall aspect after fit().
JOBS = [
    {
        "id": "sarah_quitta",
        "ref": REFS / "sarah_quitta" / "streetartcities-2048.jpg",
        "out": OUT / "sac-sarah.jpg",
        "tw": 520,
        "th": 300,
        # Full facade; mural band is upper-center on SAC hunter photo.
        "crop": (0.08, 0.12, 0.92, 0.88),
        "colors": 40,
        "seed": 11,
    },
    {
        "id": "belted_kingfisher",
        "ref": REFS / "belted_kingfisher" / "streetartcities-2048.jpg",
        "out": OUT / "sac-kingfisher.jpg",
        "tw": 560,
        "th": 260,
        "crop": (0.05, 0.08, 0.95, 0.92),
        "colors": 44,
        "seed": 17,
    },
]


def main() -> None:
    for job in JOBS:
        save_recreation(
            job["ref"],
            job["out"],
            job["tw"],
            job["th"],
            crop=job.get("crop"),
            colors=job["colors"],
            seed=job["seed"],
        )
        print("wrote", job["out"], "from", job["ref"].relative_to(ROOT))
    print("skipped walker_woman — see refs/murals/walker_woman/SOURCES.md")


if __name__ == "__main__":
    main()
