#!/usr/bin/env python3
"""Apply the idempotent arcade-motorcycle hooks to the shipped minified bundle.

The add-on sets window.__awMotoEnabled. With ?gvmoto=0 (or ?addons=0), every
conditional below takes the original handling path. This script accepts either
the original bundle or the previous r191 motorcycle patch as input.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
P = ROOT / "game/assets/index-D_YJh5Nn.js"
s = P.read_text()
changed = 0


def swap(label: str, new: str, *old: str) -> None:
    global s, changed
    if new in s:
        return
    hits = [(candidate, s.count(candidate)) for candidate in old]
    matches = [(candidate, count) for candidate, count in hits if count]
    # Some upgraded expressions intentionally contain the original expression as
    # their disabled-path fallback. Prefer the most specific (longest) match.
    if matches:
        longest = max(len(candidate) for candidate, _ in matches)
        matches = [(candidate, count) for candidate, count in matches if len(candidate) == longest]
    if len(matches) != 1 or matches[0][1] != 1:
        detail = ", ".join(str(count) for _, count in hits)
        sys.exit(f"{label}: expected one source pattern, got [{detail}]")
    s = s.replace(matches[0][0], new)
    changed += 1


enabled = "window.__awMotoEnabled"

swap(
    "bike base acceleration",
    f"s>0&&(a.s+=Math.min(1,s)*14*(o&&{enabled}?.65:1)*e*(a.s<0?2:1))",
    "s>0&&(a.s+=Math.min(1,s)*14*e*(a.s<0?2:1))",
)
swap(
    "bike throttle",
    f"o&&s>0&&(a.s+=Math.min(1,s)*({enabled}?(a.s<18?3:a.s<34?2:1.5):6)*e)",
    "o&&s>0&&(a.s+=Math.min(1,s)*6*e)",
    "o&&s>0&&(a.s+=Math.min(1,s)*(a.s<20?10:6)*e)",
    f"o&&s>0&&(a.s+=Math.min(1,s)*({enabled}?(a.s<18?13:a.s<38?7:3.5):6)*e)",
)
swap(
    "brake drift",
    f"c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),(o&&{enabled}?(Math.abs(t)>.3&&Math.abs(a.s)>9?5.5:15):30)*e))",
    "c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),30*e))",
    "c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),(Math.abs(t)>.35&&Math.abs(a.s)>11?8:30)*e))",
    f"c&&(a.s-=Math.sign(a.s)*Math.min(Math.abs(a.s),(o&&{enabled}&&Math.abs(t)>.3&&Math.abs(a.s)>9?5.5:30)*e))",
)
swap(
    "bike top speed",
    f"a.s=Math.max(-7,Math.min(o&&{enabled}?45:o?55:48,a.s))",
    "a.s=Math.max(-7,Math.min(o?55:48,a.s))",
    f"a.s=Math.max(-7,Math.min(o&&{enabled}?52:o?55:48,a.s))",
)
swap(
    "steering response",
    f"(o?({enabled}?Math.abs(t)>.05?8:10:Math.abs(t)>.05?3.2:6):9)",
    "(o?Math.abs(t)>.05?3.2:6:9)",
    "(o?Math.abs(t)>.05?6.5:8:9)",
)
swap(
    "drift and turn",
    f";a.drift=(a.drift||0)+((o&&{enabled}&&c&&Math.abs(a.st)>.3&&Math.abs(a.s)>9?1:0)-(a.drift||0))*Math.min(1,e*(c?7.5:3.5));window.__awDrift=o&&{enabled}?a.drift:0;let u=a.st*((o?({enabled}?1.95:1.35):2)/(1+Math.abs(a.s)*(o?({enabled}?.055:.1):.06)))*(1+(o&&{enabled}?a.drift*.55:0))",
    ";let u=a.st*((o?1.35:2)/(1+Math.abs(a.s)*(o?.1:.06)))",
    ";a.drift=(a.drift||0)+((c&&Math.abs(a.st)>.35&&Math.abs(a.s)>11?1:0)-(a.drift||0))*Math.min(1,e*(c?5:2.5));window.__awDrift=a.drift;let u=a.st*((o?1.8:2)/(1+Math.abs(a.s)*(o?.065:.06)))*(1+a.drift*.75)",
)
swap(
    "body slip",
    f"$_.rotation.set(a.pitch,a.h-(o&&{enabled}?a.drift*a.st*.32*Math.sign(a.s||1):0),a.roll,`YXZ`)",
    "$_.rotation.set(a.pitch,a.h,a.roll,`YXZ`)",
    "$_.rotation.set(a.pitch,a.h-a.drift*a.st*.4*Math.sign(a.s||1),a.roll,`YXZ`)",
)
swap(
    "lean angle",
    f"{enabled}?Math.max(-.72,Math.min(.72,-Math.atan(Math.abs(a.s)*u/9.8)*1.05)):Math.max(-.45,Math.min(.45,-Math.atan(Math.abs(a.s)*u/9.8)*.8))",
    "Math.max(-.45,Math.min(.45,-Math.atan(Math.abs(a.s)*u/9.8)*.8))",
    "Math.max(-.72,Math.min(.72,-Math.atan(Math.abs(a.s)*u/9.8)*1.05))",
    f"{enabled}?Math.max(-.78,Math.min(.78,-Math.atan(Math.abs(a.s)*u/9.8)*1.12)):Math.max(-.45,Math.min(.45,-Math.atan(Math.abs(a.s)*u/9.8)*.8))",
)
swap(
    "lean response",
    f"a.lean=(a.lean||0)+(t-(a.lean||0))*Math.min(1,({enabled}?7:3.5)*e)",
    "a.lean=(a.lean||0)+(t-(a.lean||0))*Math.min(1,3.5*e)",
    "a.lean=(a.lean||0)+(t-(a.lean||0))*Math.min(1,6*e)",
    f"a.lean=(a.lean||0)+(t-(a.lean||0))*Math.min(1,({enabled}?8:3.5)*e)",
)
swap(
    "bike slip",
    f"ev.rotation.set(a.pitch,a.h-({enabled}?a.drift*a.st*.3*Math.sign(a.s||1):0),0,`YXZ`)",
    "ev.rotation.set(a.pitch,a.h,0,`YXZ`)",
    "ev.rotation.set(a.pitch,a.h-a.drift*a.st*.35*Math.sign(a.s||1),0,`YXZ`)",
)
swap(
    "camera follow",
    f"a.camH=(a.camH??a.h)+t*Math.min(1,e*(o?({enabled}?6.2:3):6))",
    "a.camH=(a.camH??a.h)+t*Math.min(1,e*(o?3:6))",
    "a.camH=(a.camH??a.h)+t*Math.min(1,e*(o?4.5:6))",
)
swap(
    "camera distance",
    f"((o?({enabled}?5.1:6.2):8.5)+Math.abs(a.s)*(o?({enabled}?.03:.06):.06))*(o_.aspect<.8?(o&&{enabled}?1.18:1.4):1)*(window.__awCamD||1)",
    "((o?6.2:8.5)+Math.abs(a.s)*.06)*(o_.aspect<.8?1.4:1)",
    "((o?5.4:8.5)+Math.abs(a.s)*(o?.05:.06))*(o_.aspect<.8?1.4:1)",
    "((o?6.2:8.5)+Math.abs(a.s)*.06)*(o_.aspect<.8?1.4:1)*(window.__awCamD||1)",
    "((o?5.4:8.5)+Math.abs(a.s)*(o?.05:.06))*(o_.aspect<.8?1.4:1)*(window.__awCamD||1)",
    f"((o?({enabled}?5.1:6.2):8.5)+Math.abs(a.s)*(o?({enabled}?.055:.06):.06))*(o_.aspect<.8?(o&&{enabled}?1.22:1.4):1)*(window.__awCamD||1)",
)
swap(
    "camera pitch",
    "v=.2+$.lookPitch+(window.__awCamP||0)",
    "v=.2+$.lookPitch",
)
swap(
    "collision bump",
    f":(o&&{enabled}?(a.s*=-.1,window.__awMotoBump=1):a.s*=-.25);",
    ":a.s*=-.25;",
)
swap(
    "camera shake hook",
    "zv.set(a.x+Math.sin(_)*y*Math.cos(v),a.y+1.5+Math.sin(v)*y,a.z+Math.cos(_)*y*Math.cos(v)),window.__awMotoCam&&window.__awMotoCam(zv,a,e,o),X_(Rv,zv),o_.position.lerp",
    "zv.set(a.x+Math.sin(_)*y*Math.cos(v),a.y+1.5+Math.sin(v)*y,a.z+Math.cos(_)*y*Math.cos(v)),X_(Rv,zv),o_.position.lerp",
)

P.write_text(s)
print(f"patched {changed}" if changed else "already patched")
