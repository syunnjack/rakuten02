#!/usr/bin/env bash
# Apply GSC patches to the four satellite repos, push branches, and optionally open PRs.
# Auth: CROSS_REPO_PAT (repo-scoped classic PAT) or an already-authenticated gh/git.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${TMPDIR:-/tmp}/gsc-patch-apply-$$"
PUSH="${PUSH:-true}"
CREATE_PRS="${CREATE_PRS:-true}"
BRANCH="cursor/gsc-site-patches-86e1"

if [[ -n "${CROSS_REPO_PAT:-}" ]]; then
  export GH_TOKEN="$CROSS_REPO_PAT"
  AUTH="https://x-access-token:${CROSS_REPO_PAT}@github.com"
else
  AUTH="https://github.com"
fi

jobs=(
  "kousokubus-benri|main|patches/kousokubus-benri/0005-Reject-placeholder-GA4-GSC-and-fix-title.patch|GSC: reject placeholder GA4/GSC tokens and fix title"
  "task-dashboard|main|patches/task-dashboard/0005-Improve-GSC-title-noindex-query-and-sitemap-encoding.patch|GSC: richer title, noindex search queries, encode sitemap"
  "machi-list|main|patches/machi-list/0003-Fix-robots-conflict-and-valuecommerce-placeholders.patch|GSC: fix robots conflict and ValueCommerce placeholders"
  "goal-pilot-app|main|patches/goal-pilot-app/0002-Expand-sitemap-remove-vercel-robots-add-jsonld.patch|GSC: expand sitemap, remove vercel robots, add JSON-LD"
)

mkdir -p "$WORK"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

ok=0
fail=0

for job in "${jobs[@]}"; do
  IFS='|' read -r repo base patch_rel title <<<"$job"
  patch="$ROOT/$patch_rel"
  echo "======== $repo ========"
  if [[ ! -f "$patch" ]]; then
    echo "MISSING patch: $patch"
    fail=$((fail + 1))
    continue
  fi

  dest="$WORK/$repo"
  git clone --depth 40 "$AUTH/syunnjack/${repo}.git" "$dest"
  cd "$dest"
  git checkout -B "$BRANCH" "origin/$base"
  if ! git am "$patch"; then
    echo "git am failed for $repo"
    git am --abort 2>/dev/null || true
    fail=$((fail + 1))
    continue
  fi

  if [[ "$PUSH" == "true" ]]; then
    if git push -u origin "$BRANCH"; then
      echo "Pushed $repo:$BRANCH"
      if [[ "$CREATE_PRS" == "true" ]]; then
        gh pr create --repo "syunnjack/$repo" --base "$base" --head "$BRANCH" \
          --title "$title" \
          --body "Applied from syunnjack/rakuten02 \`$patch_rel\` (GSC performance rollout). See https://github.com/syunnjack/rakuten02/blob/master/patches/APPLY-GSC-2026-08-12.md" \
          || echo "PR create skipped/failed (may already exist)"
      fi
      ok=$((ok + 1))
    else
      echo "Push failed for $repo"
      fail=$((fail + 1))
    fi
  else
    echo "Dry-run only (PUSH=false); am succeeded"
    ok=$((ok + 1))
  fi
done

echo
echo "ok=$ok fail=$fail"
[[ "$fail" -eq 0 ]]
