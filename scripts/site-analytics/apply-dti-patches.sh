#!/usr/bin/env bash
# Apply DTI patches to hey-douga-guide / free-sample-hub, push branches, and optionally open PRs.
# Auth: CROSS_REPO_PAT (repo-scoped classic PAT) or an already-authenticated gh/git.
#
# Prefer merging open Devin PRs when MERGE_EXISTING_PRS=true (default).
# Then git am of local rakuten02 patches; skip patches already applied after Devin merge.
#
# Dry-run:
#   PUSH=false bash scripts/site-analytics/apply-dti-patches.sh
#   PUSH=false MERGE_EXISTING_PRS=false bash scripts/site-analytics/apply-dti-patches.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${TMPDIR:-/tmp}/dti-patch-apply-$$"
PUSH="${PUSH:-true}"
CREATE_PRS="${CREATE_PRS:-true}"
MERGE_EXISTING_PRS="${MERGE_EXISTING_PRS:-true}"
BRANCH="cursor/gsc-site-patches-86e1"

if [[ -n "${CROSS_REPO_PAT:-}" ]]; then
  export GH_TOKEN="$CROSS_REPO_PAT"
  AUTH="https://x-access-token:${CROSS_REPO_PAT}@github.com"
else
  AUTH="https://github.com"
fi

if [[ "$MERGE_EXISTING_PRS" == "true" ]]; then
  echo "== Merge existing Devin PRs (best-effort) =="
  for item in \
    "syunnjack/hey-douga-guide|2" \
    "syunnjack/hey-douga-guide|3" \
    "syunnjack/hey-douga-guide|4" \
    "syunnjack/free-sample-hub|1"
  do
    IFS='|' read -r repo number <<<"$item"
    if gh pr merge "$number" --repo "$repo" --merge 2>/dev/null; then
      echo "MERGED $repo#$number"
    else
      echo "skip $repo#$number"
    fi
  done
fi

# repo|base|comma-separated patches|PR title
jobs=(
  "hey-douga-guide|master|patches/hey-douga-guide/0003-Derive-canonical-robots-and-sitemap-URLs-from-APP_URL.patch,patches/hey-douga-guide/0004-Serve-DTI-sample-media-over-https-to-avoid-mixed-content.patch,patches/hey-douga-guide/0005-Give-every-DTI-work-and-provider-its-own-crawlable-page.patch|DTI: APP_URL canonicals, https samples, crawlable pages"
  "free-sample-hub|master|patches/free-sample-hub/0004-Add-DTI-CSV-import-with-https-only-sample-media.patch|DTI: CSV import with https-only samples"
)

mkdir -p "$WORK"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

ok=0
fail=0

patch_already_applied() {
  local patch="$1"
  # Reverse check: if reverse applies cleanly, content is already present.
  if git apply --check -R "$patch" >/dev/null 2>&1; then
    return 0
  fi
  # Empty / no-op apply after merge
  local out
  out="$(git apply --check "$patch" 2>&1 || true)"
  if echo "$out" | grep -qiE 'already applied|patch does not apply|No such file'; then
    # Distinguish "already applied" vs missing targets: try reverse again after soft clues
    if echo "$out" | grep -qiE 'already applied'; then
      return 0
    fi
  fi
  return 1
}

for job in "${jobs[@]}"; do
  IFS='|' read -r repo base patch_rel title <<<"$job"
  echo "======== $repo ========"
  dest="$WORK/$repo"
  git clone --depth 40 "$AUTH/syunnjack/${repo}.git" "$dest"
  cd "$dest"

  git checkout -B "$BRANCH" "origin/$base"

  am_ok=1
  applied=0
  IFS=',' read -r -a patch_list <<<"$patch_rel"
  for rel in "${patch_list[@]}"; do
    patch="$ROOT/$rel"
    echo "---- $(basename "$patch") ----"
    if [[ ! -f "$patch" ]]; then
      echo "MISSING patch: $patch"
      am_ok=0
      break
    fi

    if patch_already_applied "$patch"; then
      echo "already applied; skip $rel"
      continue
    fi

    if git am --check "$patch" >/dev/null 2>&1; then
      :
    elif git apply --check "$patch" >/dev/null 2>&1; then
      :
    else
      if patch_already_applied "$patch"; then
        echo "already applied (after check fail); skip $rel"
        continue
      fi
    fi

    if git am "$patch"; then
      applied=$((applied + 1))
    else
      echo "git am failed for $rel — trying 3-way apply"
      git am --abort 2>/dev/null || true
      if git apply --3way "$patch"; then
        git add -A
        subj="$(sed -n 's/^Subject: \[PATCH\] //p' "$patch" | head -1)"
        # Skip empty commit if 3-way produced no diff (already applied)
        if git diff --cached --quiet; then
          echo "empty apply after 3-way (already applied); skip $rel"
          continue
        fi
        git commit -m "${subj:-$title}"
        applied=$((applied + 1))
      else
        if patch_already_applied "$patch"; then
          echo "already applied; skip $rel"
          continue
        fi
        echo "apply failed for $rel"
        am_ok=0
        break
      fi
    fi
  done

  if [[ "$am_ok" -ne 1 ]]; then
    fail=$((fail + 1))
    continue
  fi

  if [[ "$applied" -eq 0 ]]; then
    echo "No new commits (Devin PRs / patches already on $base)"
    ok=$((ok + 1))
    continue
  fi

  if [[ "$PUSH" == "true" ]]; then
    if git push -u origin "$BRANCH"; then
      echo "Pushed $repo:$BRANCH"
      if [[ "$CREATE_PRS" == "true" ]]; then
        gh pr create --repo "syunnjack/$repo" --base "$base" --head "$BRANCH" \
          --title "$title" \
          --body "Applied from syunnjack/rakuten02 \`$patch_rel\` (DTI rollout). See https://github.com/syunnjack/rakuten02/blob/master/patches/DEPLOY-WINDOWS.md and \`scripts/site-analytics/apply-dti-patches.sh\`." \
          || echo "PR create skipped/failed (may already exist)"
        pr_num="$(gh pr list --repo "syunnjack/$repo" --head "$BRANCH" --json number -q '.[0].number' 2>/dev/null || true)"
        if [[ -n "$pr_num" ]]; then
          gh pr merge "$pr_num" --repo "syunnjack/$repo" --merge --delete-branch 2>/dev/null \
            && echo "MERGED PR #$pr_num" \
            || echo "PR #$pr_num open (merge in UI if needed)"
        fi
      fi
      ok=$((ok + 1))
    else
      echo "Push failed for $repo"
      fail=$((fail + 1))
    fi
  else
    echo "Dry-run only (PUSH=false); am succeeded (applied=$applied)"
    ok=$((ok + 1))
  fi
done

echo
echo "ok=$ok fail=$fail"
echo "Production leftovers after merge:"
echo "  hey-douga-guide: composer install && php artisan migrate && php artisan dti:import-csv"
echo "  free-sample-hub: composer install && php artisan migrate && php artisan samples:import-csv"
[[ "$fail" -eq 0 ]]
