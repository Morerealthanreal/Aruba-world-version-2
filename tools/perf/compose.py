"""Before | after | diff composite of two screenshots (pixels whose RGB sum differs by > 24 in red)."""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# python3 compose.py out.png before.png after.png "title"
out, a_p, b_p, title = sys.argv[1:5]
a = Image.open(a_p).convert("RGB"); b = Image.open(b_p).convert("RGB")
x = np.abs(np.asarray(a).astype(int) - np.asarray(b).astype(int)).sum(2)
m = x > 24
d = (np.asarray(a) * 0.35).astype(np.uint8); d[m] = [255, 0, 0]
diff = Image.fromarray(d)
s = 0.45
W, H = int(a.width * s), int(a.height * s)
pad = 56
o = Image.new("RGB", (W * 3 + 20, H + pad), (20, 20, 20))
dr = ImageDraw.Draw(o)
try:
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
except OSError:
    f = ImageFont.load_default()
pct = 100.0 * m.sum() / m.size
for i, (im, lab) in enumerate([(a, "before (main)"), (b, "after (this PR)"), (diff, f"diff: {m.sum()} px ({pct:.2f}%)")]):
    o.paste(im.resize((W, H), Image.LANCZOS), (i * (W + 10), pad))
    dr.text((i * (W + 10) + 8, 6), lab, fill=(255, 255, 255), font=f)
dr.text((8, 32), title, fill=(200, 200, 200), font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16) if f != ImageFont.load_default() else f)
o.save(out)
print(out, m.sum(), round(pct, 3))
