#!/usr/bin/env python3
"""Car physics overhaul hooks for A's minified bundle (idempotent).
Installs window.__awCar hooks (addons/src/carPhysics.ts):
  - 4-wheel independent suspension with dynamic chassis sprung-mass compliance
  - Longitudinal & lateral weight transfer (squat/dive and cornering body roll)
  - Surface-dependent tire grip (asphalt: 1.0, dirt: 0.75, sand: 0.55)
  - Handbrake drifts with realistic slip angle (beta) and counter-steer balance
  - Speed-sensitive chase camera with drift lookahead and dynamic framing

Every hook falls back to stock handling when window.__awCar is absent (?carphysics=0 / ?addons=0).
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
P = ROOT / "game/assets/index-D_YJh5Nn.js"
s = P.read_text()
changed = 0

def swap(label: str, old: str, new: str) -> None:
    global s, changed
    if new in s:
        return
    count = s.count(old)
    if count != 1:
        sys.exit(f"{label}: expected 1 occurrence of old pattern, found {count}")
    s = s.replace(old, new)
    changed += 1

# 1. Surface-dependent engine acceleration
swap(
    "car acceleration",
    "s>0&&(a.s+=Math.min(1,s)*14*(o&&window.__awMotoEnabled?.85:1)*e*(a.s<0?2:1))",
    "s>0&&(a.s+=Math.min(1,s)*14*(o&&window.__awMotoEnabled?.85:!o&&window.__awCar?window.__awCar.accel(a,Ag):1)*e*(a.s<0?2:1))",
)

# 2. Surface-dependent braking deceleration
swap(
    "car braking",
    "c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),(o&&window.__awMotoEnabled?(Math.abs(t)>.3&&Math.abs(a.s)>9?5.5:20):30)*e))",
    "c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),(o&&window.__awMotoEnabled?(Math.abs(t)>.3&&Math.abs(a.s)>9?5.5:20):!o&&window.__awCar?window.__awCar.brake(a,Ag,t,c):30)*e))",
)

# 3. Surface-dependent rolling resistance and coast drag
swap(
    "car rolling resistance",
    "a.s-=a.s*(o&&window.__awMotoEnabled?(c&&Math.abs(t)>.3&&Math.abs(a.s)>9?.08:c?.2:s?.25:.12):.25)*e+Math.sign(a.s)*Math.min(Math.abs(a.s),(s||l||yv&&yv.active||o&&window.__awMotoEnabled&&c&&Math.abs(t)>.3&&Math.abs(a.s)>9?0:o&&window.__awMotoEnabled?2.5:o?6.5:7.5)*e)",
    "a.s-=a.s*(o&&window.__awMotoEnabled?(c&&Math.abs(t)>.3&&Math.abs(a.s)>9?.08:c?.2:s?.25:.12):!o&&window.__awCar?window.__awCar.rollRes(a,Ag,s,c,t):.25)*e+Math.sign(a.s)*Math.min(Math.abs(a.s),(s||l||yv&&yv.active||o&&window.__awMotoEnabled&&c&&Math.abs(t)>.3&&Math.abs(a.s)>9?0:o&&window.__awMotoEnabled?2.5:o?6.5:!o&&window.__awCar?window.__awCar.coastDrag(a,Ag):7.5)*e)",
)

# 4. Drift target: handbrake & high-speed loose surface slip
swap(
    "car drift target",
    "a.drift=(a.drift||0)+((window.__awFan?0:o&&window.__awMotoEnabled&&c&&Math.abs(a.st)>.3&&Math.abs(a.s)>9?1:0)-(a.drift||0))*Math.min(1,e*(window.__awFan?18:c?7.5:3.5));window.__awDrift=o&&window.__awMotoEnabled?a.drift:0;",
    "a.drift=(a.drift||0)+((!o&&window.__awCar?window.__awCar.driftTarget(a,c,t,Ag):window.__awFan?0:o&&window.__awMotoEnabled&&c&&Math.abs(a.st)>.3&&Math.abs(a.s)>9?1:0)-(a.drift||0))*Math.min(1,e*(!o&&window.__awCar?(c?7.5:3.5):window.__awFan?18:c?7.5:3.5));window.__awDrift=o&&window.__awMotoEnabled||!o&&window.__awCar?a.drift:0;",
)

# 5. Yaw authority during drift
swap(
    "car turn multiplier",
    "*(1+(window.__awFan?0:o&&window.__awMotoEnabled?a.drift*.55:0))",
    "*(1+(!o&&window.__awCar?window.__awCar.turnMult(a):window.__awFan?0:o&&window.__awMotoEnabled?a.drift*.55:0))",
)

# 6. Chassis body slip angle (heading yaw deviation)
swap(
    "car body slip",
    "$_.rotation.set(a.pitch,a.h-(o&&window.__awMotoEnabled?a.drift*a.st*.32*Math.sign(a.s||1):0),a.roll,`YXZ`)",
    "$_.rotation.set(a.pitch,a.h-(o&&window.__awMotoEnabled?a.drift*a.st*.32*Math.sign(a.s||1):!o&&window.__awCar?window.__awCar.bodySlip(a):0),a.roll,`YXZ`)",
)

# 7. 4-wheel independent suspension compression
swap(
    "car suspension",
    "$_.setWheels&&$_.setWheels(a.s*e,-a.steerVis)}",
    "$_.setWheels&&$_.setWheels(a.s*e,-a.steerVis),!o&&window.__awCar&&window.__awCar.suspension(a,$_,[W0,W1,W2,W3],x,u*a.s,e)}",
)

# 8. Speed-sensitive chase camera with drift framing
swap(
    "car chase camera",
    "window.__awMotoCam&&window.__awMotoCam(zv,a,e,o),X_(Rv,zv)",
    "(window.__awCar?window.__awCar.cam(zv,Rv,a,e,o):window.__awMotoCam&&window.__awMotoCam(zv,a,e,o)),X_(Rv,zv)",
)

if changed > 0:
    P.write_text(s)
    print(f"Patched {changed} car physics hooks in {P.name}")
else:
    print("All car physics hooks already up to date")
