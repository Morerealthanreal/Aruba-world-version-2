#!/usr/bin/env python3
"""Download mural reference photos into refs/murals/<id>/ per mural_ref_manifest.json."""
from __future__ import annotations

import json
import re
import subprocess
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = Path(__file__).resolve().parent / "mural_ref_manifest.json"
REFS = ROOT / "refs" / "murals"


def sac_image_url(marker: int) -> str | None:
    url = f"https://streetartcities.com/markers/{marker}"
    html = subprocess.check_output(["curl", "-fsSL", url], text=True)
    for pat in (
        r"(https://streetartcities\.com/media/[^\"\s]+/2048\.jpg)",
        r"(https://streetart\.media/[^\"\s]+\.jpg)",
    ):
        m = re.search(pat, html)
        if m:
            return m.group(1)
    return None


def wiki_download(filename: str, dest: Path) -> bool:
    enc = urllib.parse.quote(filename.replace(" ", "_"))
    url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{enc}"
    try:
        subprocess.check_call(["curl", "-fsSL", "-o", str(dest), url])
        return dest.stat().st_size > 5000
    except subprocess.CalledProcessError:
        return False


def write_sources(mid: str, lines: list[str]) -> None:
    d = REFS / mid
    d.mkdir(parents=True, exist_ok=True)
    body = f"# {mid}\n\n" + "\n".join(f"- {line}" for line in lines) + "\n"
    (d / "SOURCES.md").write_text(body)


def main() -> None:
    data = json.loads(MANIFEST.read_text())
    ok: list[str] = []
    skip: list[str] = []
    for mid, spec in data.items():
        if spec.get("skip"):
            skip.append(mid)
            write_sources(mid, [spec.get("note", "skipped — no reference")])
            continue
        d = REFS / mid
        d.mkdir(parents=True, exist_ok=True)
        sources: list[str] = []
        dest = d / "reference.jpg"
        if spec.get("sac_marker"):
            page = spec.get("page") or f"https://streetartcities.com/markers/{spec['sac_marker']}"
            img = sac_image_url(int(spec["sac_marker"]))
            if img:
                subprocess.check_call(["curl", "-fsSL", "-o", str(dest), img])
                sources.append(f"Street Art Cities: {page}")
                sources.append(f"Image: {img}")
        elif spec.get("wikimedia"):
            fn = spec["wikimedia"]
            if wiki_download(fn, dest):
                sources.append(f"Wikimedia Commons File:{fn}")
                if spec.get("page"):
                    sources.append(spec["page"])
        if dest.exists() and dest.stat().st_size > 5000:
            write_sources(mid, sources)
            ok.append(mid)
            print("ok", mid, dest.stat().st_size)
        else:
            skip.append(mid)
            print("FAIL", mid)
    print("downloaded", len(ok), "skipped", skip)


if __name__ == "__main__":
    main()
