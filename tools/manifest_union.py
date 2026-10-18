#!/usr/bin/env python3
"""Merge the staged landmark manifest into the repo's hero manifest: union by id, repo wins.
Writes the result to the game manifest and back to the staged copy, so a ship can never drop
an entry that is in the repo. Note: to remove a landmark, delete it from BOTH files.
usage: manifest_union.py <repo_manifest> <staged_manifest>"""
import json, sys
repo_p, staged_p = sys.argv[1], sys.argv[2]
repo = json.load(open(repo_p))
try: staged = json.load(open(staged_p))
except FileNotFoundError: staged = []
ids = {h['id'] for h in repo}
out = repo + [h for h in staged if h['id'] not in ids]
added = len(out) - len(repo)
for p in (repo_p, staged_p): json.dump(out, open(p, 'w'), indent=1)
print(f"manifest union: repo {len(repo)} + staged-only {added} = {len(out)} entries")
