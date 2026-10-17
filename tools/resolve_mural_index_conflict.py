#!/usr/bin/env python3
"""Resolve index.ts / index.html rebase conflicts: keep both sides."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_, cache_bust = sys.argv[1], sys.argv[2]


def merge_conflicts(text: str) -> str:
    lines = text.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        if lines[i].startswith("<<<<<<< HEAD"):
            head: list[str] = []
            i += 1
            while i < len(lines) and not lines[i].startswith("======="):
                head.append(lines[i])
                i += 1
            i += 1
            other: list[str] = []
            while i < len(lines) and not lines[i].startswith(">>>>>>>"):
                other.append(lines[i])
                i += 1
            i += 1
            out.extend(head)
            out.extend(other)
        else:
            out.append(lines[i])
            i += 1
    return "\n".join(out) + "\n"


index_path = ROOT / "addons/src/index.ts"
index_path.write_text(merge_conflicts(index_path.read_text()))

html_path = ROOT / "game/index.html"
html = merge_conflicts(html_path.read_text())
html = re.sub(
    r'(<script type="module" src="\./addons/aw-addons\.js\?v=)[^"]+("></script>)',
    rf"\g<1>{cache_bust}\2",
    html,
    count=1,
)
html_path.write_text(html)
print("resolved conflicts, cache bust", cache_bust)
