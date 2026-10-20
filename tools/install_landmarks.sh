#!/bin/bash
# copy generated GLBs + staged manifest entries into the game (models/hero, data/hero only)
set -e; G=/workspace/aruba-world-merged/game
cp /workspace/landmarks/out/*.glb $G/models/hero/
# never overwrite: union staged into the repo manifest (repo wins), then verify nothing from the repo was dropped
cp $G/data/hero/manifest.json /tmp/manifest.repo.json
python3 /workspace/aruba-world-merged/tools/manifest_union.py $G/data/hero/manifest.json /workspace/landmarks/manifest.staged.json
python3 /workspace/aruba-world-merged/tools/check_manifest.py /tmp/manifest.repo.json $G/data/hero/manifest.json
python3 -c "import json;m=json.load(open('$G/data/hero/manifest.json'));print(len(m),'entries')"
# Cache-bust a changed GLB with "rev" on that place file. Do not stamp the bundle.
if [ -d /workspace/aruba-world-merged/refs/places/_registry ]; then
  python3 /workspace/aruba-world-merged/tools/build_hero_manifest.py --adopt
fi
python3 /workspace/aruba-world-merged/tools/patch_herover.py
python3 /workspace/aruba-world-merged/tools/patch_yard_palms.py; python3 /workspace/aruba-world-merged/tools/patch_pb_sidewalks.py; python3 /workspace/aruba-world-merged/tools/patch_lh_lot.py; python3 /workspace/aruba-world-merged/tools/patch_drop_walls.py; python3 /workspace/aruba-world-merged/tools/patch_no_sv.py; python3 /workspace/aruba-world-merged/tools/patch_intro.py; python3 /workspace/aruba-world-merged/tools/patch_perf_smooth.py
# map data cache version: hash of data/real/*.json -> tools/patch_dataver.py DV
DV=d$(cat /workspace/aruba-world-merged/game/data/real/*.json /workspace/aruba-world-merged/game/data/real/*.png | md5sum | cut -c1-10); sed -i "s/^DV='[a-z0-9]*'/DV='$DV'/" /workspace/aruba-world-merged/tools/patch_dataver.py
python3 /workspace/aruba-world-merged/tools/patch_dataver.py
