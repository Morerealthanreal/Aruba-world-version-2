"""Markdown before/after table from two `measure.mjs --drive` results.

python3 cmpdrive.py res/<base>.json res/<new>.json
"""
import json
import sys

b = json.load(open(sys.argv[1]))["drive"]
n = json.load(open(sys.argv[2]))["drive"]


def row(name, f):
    print(f"| {name} | {f(b)} | {f(n)} |")


print("| metric | before | after |\n|---|---|---|")
row("frames", lambda d: d["frames"])
for k in ["p50", "p95", "p99", "max", "over33", "over50"]:
    row("CPU frame task " + k + (" (ms)" if k[0] in "pm" else " (frames)"), lambda d, k=k: d["nonGl"][k])
for k in ["p50", "p95", "p99", "max", "over50"]:
    row("raw frame task incl. GL " + k, lambda d, k=k: d["cbt"][k])
row("draw calls avg / max", lambda d: f"{d['calls']['avg']} / {d['calls']['max']}")
row("triangles avg", lambda d: d["tris"]["avg"])
row("alloc MB/frame", lambda d: d.get("allocMBperFrame", d.get("alloc", "-")))
for k in ["scene.updateMatrixWorld", "A.update", "jobPump.run", "job:buildings.build", "job:streets.build", "job:roads.build",
          "flora.update", "tileInst.update", "mperf.frame", "renderer.compile", "mon.update"]:
    row(f"`{k}` avg / max ms", lambda d, k=k: f"{d['fn'].get(k, {}).get('perFrame', '-')} / {d['fn'].get(k, {}).get('max', '-')}")
