#!/bin/bash
# Deploy + verify + pull/push with hard timeouts on every step (nothing can hang).
# usage: ./ship.sh   (run from anywhere; commit first)
cd "$(dirname "$0")"; L=/workspace/landmarks
timeout 900 ./redeploy.sh >/tmp/dep.log 2>&1; echo "deploy rc=$? $(tail -2 /tmp/dep.log | tr '\n' ' ')"
(cd $L && timeout 300 node lc2.mjs 2>&1 | tail -1 | sed 's/^/local /') || echo "local lc2 TIMEOUT/FAIL"
(cd $L && URL=https://aruba-world-justin.surge.sh/ timeout 300 node lc2.mjs live 2>&1 | tail -1 | sed 's/^/live /') || echo "live lc2 TIMEOUT/FAIL"
H='!f(){ echo username=x-access-token; echo "password=$GITHUB_PUSH_TOKEN"; }; f'
timeout 90 git -c credential.helper="$H" fetch -q github main && git -c user.name="Grok Bot" -c user.email="bot@local" merge -q github/main 2>&1 | tail -1
timeout 90 git -c credential.helper="$H" push -q github HEAD:main && timeout 30 git ls-remote github main
