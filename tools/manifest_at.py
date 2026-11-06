#!/usr/bin/env python3
"""Write the hero manifest as of a git revision.

Usage: manifest_at.py <rev> <outfile>

Uses game/data/hero/manifest.json when that revision still has the monolith.
Otherwise rebuilds it from refs/places/_registry at that revision.
Exit 2 when that revision has neither.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def git(*args):
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        capture_output=True,
        check=False,
    )


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: manifest_at.py <rev> <outfile>")
    rev, outfile = sys.argv[1], Path(sys.argv[2])
    shown = git("show", f"{rev}:game/data/hero/manifest.json")
    if shown.returncode == 0 and shown.stdout.strip():
        outfile.write_bytes(shown.stdout)
        print(f"manifest from {rev} monolith")
        return
    listing = git("ls-tree", "-r", "--name-only", rev, "refs/places/_registry")
    names = [line for line in listing.stdout.decode().splitlines() if line.endswith(".json")]
    if listing.returncode != 0 or not names:
        print(f"no hero manifest at {rev}", file=sys.stderr)
        sys.exit(2)
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "registry"
        src.mkdir()
        for rel in names:
            blob = git("show", f"{rev}:{rel}")
            if blob.returncode != 0:
                sys.exit(f"missing {rev}:{rel}")
            (src / Path(rel).name).write_bytes(blob.stdout)
        sys.path.insert(0, str(ROOT / "tools"))
        import build_hero_manifest as registry
        registry.build(src, outfile)
    print(f"manifest rebuilt from {rev} registry")


if __name__ == "__main__":
    main()
