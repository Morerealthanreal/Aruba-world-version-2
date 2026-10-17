#!/bin/bash
# Usage: ./tools/rebase_sac_branch.sh <branch> <paint_script> <import_class> <param> <atlas_texture> <cache_bust>
set -euo pipefail
BRANCH="$1"
PAINT="$2"
IMPORT="$3"
PARAM="$4"
ATLAS="$5"
BUST="$6"
cd "$(git rev-parse --show-toplevel)"
git fetch origin main
git checkout "$BRANCH"
git rebase origin/main || true
if git diff --name-only --diff-filter=U | grep -q .; then
  python3 tools/resolve_mural_index_conflict.py "$IMPORT" "$PARAM" "$ATLAS" "$BUST"
fi
cp tools/mural_pack.py tools/mural_pack.py 2>/dev/null || git show cursor/ora-street-murals-add7:tools/mural_pack.py > tools/mural_pack.py
python3 tools/patch_paint_pack.py "tools/$PAINT"
python3 tools/paint_"${PAINT#paint_}".py 2>/dev/null || python3 "tools/$PAINT"
python3 tools/audit_mural_uv.py
cp addons/src/sacMuralSkip.ts /tmp/sac_union.ts 2>/dev/null || true
if [[ -f addons/src/sacMuralSkip.ts ]]; then
  git show cursor/sn-sac-side-batch-add7:addons/src/sacMuralSkip.ts > addons/src/sacMuralSkip.ts
fi
npm run build
git add -A
if git diff --name-only --diff-filter=U | grep -q .; then
  echo "Still conflicted"; exit 1
fi
while git rebase --continue 2>/dev/null; do
  if git diff --name-only --diff-filter=U | grep -q .; then
    python3 tools/resolve_mural_index_conflict.py "$IMPORT" "$PARAM" "$ATLAS" "$BUST"
    python3 tools/patch_paint_pack.py "tools/$PAINT" 2>/dev/null || true
    git show cursor/sn-sac-side-batch-add7:addons/src/sacMuralSkip.ts > addons/src/sacMuralSkip.ts
    npm run build
    git add -A
  fi
done
git push -u origin "$BRANCH" --force-with-lease
