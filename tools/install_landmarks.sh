#!/bin/bash
# copy generated GLBs + staged manifest entries into the game (models/hero, data/hero only)
set -e; G=/workspace/aruba-world-merged/game
cp /workspace/landmarks/out/*.glb $G/models/hero/
# never overwrite: union staged into the repo manifest (repo wins), then verify nothing from the repo was dropped
cp $G/data/hero/manifest.json /tmp/manifest.repo.json
python3 /workspace/aruba-world-merged/tools/manifest_union.py $G/data/hero/manifest.json /workspace/landmarks/manifest.staged.json
python3 /workspace/aruba-world-merged/tools/check_manifest.py /tmp/manifest.repo.json $G/data/hero/manifest.json
python3 -c "import json;m=json.load(open('$G/data/hero/manifest.json'));print(len(m),'entries')"
# bump the landmark cache version (one constant in tools/patch_herover.py) and re-patch the bundle
HV=h$(date +%Y%m%d%H%M); sed -i "s/^HV='[a-z0-9]*'/HV='$HV'/" /workspace/aruba-world-merged/tools/patch_herover.py
python3 /workspace/aruba-world-merged/tools/patch_herover.py
sed -i -E "s/(index-[A-Za-z0-9_]+\.js)\?v=[A-Za-z0-9]+/\1?v=$HV/" /workspace/aruba-world-merged/game/index.html
python3 /workspace/aruba-world-merged/tools/patch_yard_palms.py; python3 /workspace/aruba-world-merged/tools/patch_pb_sidewalks.py; python3 /workspace/aruba-world-merged/tools/patch_lh_lot.py; python3 /workspace/aruba-world-merged/tools/patch_drop_walls.py; python3 /workspace/aruba-world-merged/tools/patch_no_sv.py; python3 /workspace/aruba-world-merged/tools/patch_intro.py; python3 /workspace/aruba-world-merged/tools/patch_perf_smooth.py
# map data cache version: hash of data/real/*.json -> tools/patch_dataver.py DV
DV=d$(cat /workspace/aruba-world-merged/game/data/real/*.json /workspace/aruba-world-merged/game/data/real/*.png | md5sum | cut -c1-10); sed -i "s/^DV='[a-z0-9]*'/DV='$DV'/" /workspace/aruba-world-merged/tools/patch_dataver.py
python3 /workspace/aruba-world-merged/tools/patch_dataver.py
