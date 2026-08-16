#!/usr/bin/env bash
# Apply trailing-slash homepage canonical patches to ColorfulBOX ranking repos.
# Auth: CROSS_REPO_PAT (repo-scoped classic PAT) or an already-authenticated gh/git.
#
# Dry-run:
#   PUSH=false bash scripts/site-analytics/apply-ranking-canonical-patches.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${TMPDIR:-/tmp}/ranking-canonical-apply-$$"
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
  "adult-comic-ranking|master|patches/adult-comic-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "adult-figure-ranking|master|patches/adult-figure-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "adult-novel-ranking|master|patches/adult-novel-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical + Search Console note"
  "bl-tl-doujin-ranking|master|patches/bl-tl-doujin-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "bl-tl-novel-ranking|master|patches/bl-tl-novel-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "cross-asp-ranking|master|patches/cross-asp-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "duga-video-ranking|master|patches/duga-video-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "gravure-photo-ranking|master|patches/gravure-photo-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "mature-genre-ranking|master|patches/mature-genre-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
  "r18-anime-ranking|master|patches/r18-anime-ranking/0001-Use-trailing-slash-homepage-canonical.patch|GSC: trailing-slash homepage canonical"
)

mkdir -p "$WORK"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

ok=0
fail=0

for job in "${jobs[@]}"; do
  IFS='|' read -r repo base patch_rel title <<<"$job"
  echo "======== $repo ========"
  dest="$WORK/$repo"
  git clone --depth 40 "$AUTH/syunnjack/${repo}.git" "$dest"
  cd "$dest"
  git checkout -B "$BRANCH" "origin/$base"

  patch="$ROOT/$patch_rel"
  if [[ ! -f "$patch" ]]; then
    echo "MISSING patch: $patch"
    fail=$((fail + 1))
    continue
  fi

  if git apply --check -R "$patch" >/dev/null 2>&1; then
    echo "already applied; skip"
    ok=$((ok + 1))
    continue
  fi

  if git am "$patch"; then
    :
  else
    echo "git am failed — trying 3-way apply"
    git am --abort 2>/dev/null || true
    if git apply --3way "$patch"; then
      git add -A
      if git diff --cached --quiet; then
        echo "empty apply (already applied)"
        ok=$((ok + 1))
        continue
      fi
      git commit -m "$title"
    else
      if git apply --check -R "$patch" >/dev/null 2>&1; then
        echo "already applied; skip"
        ok=$((ok + 1))
        continue
      fi
      echo "apply failed for $repo"
      fail=$((fail + 1))
      continue
    fi
  fi

  if [[ "$PUSH" == "true" ]]; then
    if git push -u origin "$BRANCH"; then
      echo "Pushed $repo:$BRANCH"
      if [[ "$CREATE_PRS" == "true" ]]; then
        gh pr create --repo "syunnjack/$repo" --base "$base" --head "$BRANCH" \
          --title "$title" \
          --body "Applied from syunnjack/rakuten02 \`$patch_rel\`. See patches/ranking-sites/README.md" \
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
echo "Note: sosolu.net / sosolu.tokyo / sosoru.tokyo GA4 = ColorfulBOX .env GA4_MEASUREMENT_ID only (do not invent IDs)."
echo "Note: sosolu.email still needs a real Search Console verification token (see adult-novel-ranking docs)."
[[ "$fail" -eq 0 ]]
