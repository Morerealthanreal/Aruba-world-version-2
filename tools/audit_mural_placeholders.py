#!/usr/bin/env python3
"""List mural gen scripts that draw crude PIL shapes (ellipse/polygon placeholders)."""
import re
import subprocess
import sys
from pathlib import Path

PAT = re.compile(r"d\.(ellipse|polygon|rectangle)\(", re.I)
ROOT = Path(__file__).resolve().parents[1]


def scan_file(path: Path) -> bool:
    try:
        text = path.read_text()
    except OSError:
        return False
    return bool(PAT.search(text)) and "gen_" in path.name and "painting" in path.name


def main() -> None:
    branches = sys.argv[1:] or [
        "cursor/sn-iconic-murals-add7",
        "cursor/ora-street-murals-add7",
        "cursor/sn-sac-side-batch-add7",
        "cursor/sn-sac-classics-add7",
        "cursor/sn-sac-batch7-add7",
        "cursor/sn-sac-batch8-add7",
    ]
    bad = []
    for br in branches:
        out = subprocess.run(
            ["git", "ls-tree", "-r", "--name-only", f"origin/{br}", "tools/"],
            capture_output=True,
            text=True,
            cwd=ROOT,
        )
        if out.returncode != 0:
            continue
        for line in out.stdout.splitlines():
            if "gen_" in line and line.endswith(".py"):
                show = subprocess.run(
                    ["git", "show", f"origin/{br}:{line}"],
                    capture_output=True,
                    text=True,
                    cwd=ROOT,
                )
                if show.returncode == 0 and PAT.search(show.stdout):
                    bad.append((br, line))
    for br, f in bad:
        print(f"{br}: {f}")
    if not bad:
        print("no placeholder gen scripts found on listed branches")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
