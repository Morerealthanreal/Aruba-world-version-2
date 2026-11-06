#!/bin/bash
# Deploy + verify + pull/push with hard timeouts on every step (nothing can hang).
# usage: ./ship.sh   (run from anywhere; commit first)
cd "$(dirname "$0")"; L=/workspace/landmarks
python3 tools/build_hero_manifest.py
python3 tools/manifest_at.py HEAD /tmp/head-manifest.json || { echo "ship aborted: no hero manifest at HEAD"; exit 1; }
python3 tools/check_manifest.py /tmp/head-manifest.json game/data/hero/manifest.json || { echo "ship aborted: local manifest dropped entries"; exit 1; }
timeout 900 ./redeploy.sh >/tmp/dep.log 2>&1; echo "deploy rc=$? $(tail -2 /tmp/dep.log | tr '\n' ' ')"
(cd $L && timeout 300 node lc2.mjs 2>&1 | tail -1 | sed 's/^/local /') || echo "local lc2 TIMEOUT/FAIL"
for i in 1 2; do r=$(cd $L && URL=https://aruba-world-justin.surge.sh/ timeout 300 node lc2.mjs live 2>&1 | tail -1); case "$r" in errors*) echo "live $r"; break;; *) echo "live attempt $i failed: $r";; esac; done
python3 tools/check_manifest.py /tmp/head-manifest.json "https://aruba-world-justin.surge.sh/data/hero/manifest.json?nc=$(date +%s)" || { echo "SHIP FAIL: live manifest is missing entries; not pushing"; exit 1; }
H='!f(){ echo username=x-access-token; echo "password=$GITHUB_PUSH_TOKEN"; }; f'
timeout 90 git -c credential.helper="$H" fetch -q github main && git -c user.name="Grok Bot" -c user.email="bot@local" merge -q github/main 2>&1 | tail -1
timeout 90 git -c credential.helper="$H" push -q github HEAD:main && timeout 30 git ls-remote github main
