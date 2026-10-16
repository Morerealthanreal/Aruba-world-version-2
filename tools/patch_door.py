#!/usr/bin/env python3
"""Let walk-in interiors open a doorway in A's building collision.

A's walk step rejects any point inside a footprint polygon (M_). The interiors
add-on sets window.__awDoor(x, z) true for a shop's doorway and walkable floor.
When the add-on is absent the hook is undefined and collision is unchanged.
Idempotent. Off with the add-on (?interiors=0 never installs the hook).
"""
import os, sys
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'game', 'assets', 'index-D_YJh5Nn.js')
s = open(P).read()
OLD = "function M_(e,t){if(!awCF)return M_0(e,t);"
NEW = "function M_(e,t){if(window.__awDoor&&window.__awDoor(e,t))return!1;if(!awCF)return M_0(e,t);"
if NEW in s:
    print("already")
    raise SystemExit
n = s.count(OLD)
if n != 1:
    sys.exit(f"pattern count {n}")
s = s.replace(OLD, NEW, 1)
open(P, "w").write(s)
print("patched door")
