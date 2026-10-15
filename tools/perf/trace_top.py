"""Longest main-thread tasks in a Chrome trace written by `measure.mjs <label> --drive --trace`.

python3 trace_top.py res/<label>_trace.json [N]
Prints task count, p50/p95/p99/max and the N longest RunTask durations on the page's main thread
(CrRendererMain with the most tasks), plus how many exceed 16/33/50/100 ms. Headless GL is
SwiftShader, so render tasks include time blocked on the software GPU (see measure.mjs nonGl).
"""
import json
import sys

path = sys.argv[1]
top_n = int(sys.argv[2]) if len(sys.argv) > 2 else 15
with open(path) as f:
    data = json.load(f)
ev = data["traceEvents"] if isinstance(data, dict) else data

main = {(e["pid"], e["tid"]) for e in ev if e.get("ph") == "M" and e.get("name") == "thread_name" and e["args"].get("name") == "CrRendererMain"}
tasks = {}
for e in ev:
    if e.get("ph") == "X" and e.get("name") in ("RunTask", "ThreadControllerImpl::RunTask") and (e["pid"], e["tid"]) in main:
        tasks.setdefault((e["pid"], e["tid"]), []).append(e["dur"] / 1000.0)
key = max(tasks, key=lambda k: len(tasks[k]))
d = sorted(tasks[key])
q = lambda p: d[min(len(d) - 1, int(p * len(d)))]
print(f"tasks {len(d)}  p50 {q(0.5):.1f}  p95 {q(0.95):.1f}  p99 {q(0.99):.1f}  max {d[-1]:.1f} ms")
print("  over 16/33/50/100 ms:", *[sum(x > t for x in d) for t in (16, 33, 50, 100)])
print("  longest:", ", ".join(f"{x:.0f}" for x in d[::-1][:top_n]))
