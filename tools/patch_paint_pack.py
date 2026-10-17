#!/usr/bin/env python3
"""Replace inline pack() in a paint script with mural_pack.pack_atlas."""
import re
import sys
from pathlib import Path

path = Path(sys.argv[1])
text = path.read_text()
if "from mural_pack import pack_atlas as pack" in text:
    print(f"already patched {path}")
    sys.exit(0)
text = text.replace(
    "from PIL import Image\n\nROOT = Path(__file__).resolve().parents[1]",
    "from PIL import Image\n\n_TOOLS = Path(__file__).resolve().parent\nimport sys\n\n"
    "if str(_TOOLS) not in sys.path:\n    sys.path.insert(0, str(_TOOLS))\n"
    "from mural_pack import pack_atlas as pack\n\nROOT = Path(__file__).resolve().parents[1]",
)
text = re.sub(
    r"\ndef pack\(images: list\[Image\.Image\]\):.*?return atlas, boxes\n\n",
    "\n",
    text,
    count=1,
    flags=re.DOTALL,
)
path.write_text(text)
print(f"patched {path}")
