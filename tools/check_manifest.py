#!/usr/bin/env python3
"""Fail (exit 1) if any model id in the reference manifest is missing from the candidate manifest.
usage: check_manifest.py <reference.json> <candidate.json | URL>"""
import json, sys, urllib.request
ref, cand = sys.argv[1], sys.argv[2]
a = {h['id'] for h in json.load(open(ref))}
if cand.startswith('http'):
    b = {h['id'] for h in json.load(urllib.request.urlopen(cand, timeout=60))}
else:
    b = {h['id'] for h in json.load(open(cand))}
miss = sorted(a - b)
if miss: print(f"MANIFEST CHECK FAIL: {len(miss)} missing: {', '.join(miss[:20])}"); sys.exit(1)
print(f"manifest check ok: {len(a)} ids present ({len(b)} in candidate)")
