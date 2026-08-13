#!/usr/bin/env bash
# Finish remaining GSC rollout in one shot (needs write access to syunnjack/*).
# Prefer: export CROSS_REPO_PAT=ghp_...   # classic PAT with repo scope
# Or:     gh auth login                   # as the repo owner
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "== GSC rollout completer (bash) =="
echo "root=$ROOT"

if [[ -n "${CROSS_REPO_PAT:-}" ]]; then
  export GH_TOKEN="$CROSS_REPO_PAT"
  export GIT_ASKPASS=echo
  git config --global url."https://x-access-token:${CROSS_REPO_PAT}@github.com/".insteadOf "https://github.com/"
fi

git checkout master
git pull origin master

echo
echo "== Merge existing Devin PRs =="
merge_pr() {
  local repo="$1" number="$2" note="$3"
  echo "- $repo #$number ($note)"
  if gh pr merge "$number" --repo "$repo" --merge 2>/dev/null; then
    echo "  MERGED"
  else
    local state
    state="$(gh pr view "$number" --repo "$repo" --json state,mergeable -q '"\(.state) mergeable=\(.mergeable)"' 2>/dev/null || echo unknown)"
    echo "  skip ($state) — merge in GitHub UI if still open"
  fi
}

merge_pr syunnjack/task-dashboard 8 "percent-encode actress URLs"
merge_pr syunnjack/machi-list 1 "shop detail pages + sitemap"

echo
echo "== DTI Devin PRs =="
bash "$ROOT/scripts/site-analytics/complete-dti-rollout.sh" || true

echo
echo "== Apply rakuten02 patches =="
PUSH=true CREATE_PRS=true bash "$ROOT/scripts/site-analytics/apply-gsc-patches.sh"

echo
echo "== Merge newly opened patch PRs (if any) =="
for repo in kousokubus-benri task-dashboard machi-list goal-pilot-app; do
  pr="$(gh pr list --repo "syunnjack/$repo" --head cursor/gsc-site-patches-86e1 --json number -q '.[0].number' 2>/dev/null || true)"
  if [[ -n "$pr" ]]; then
    echo "- syunnjack/$repo #$pr"
    gh pr merge "$pr" --repo "syunnjack/$repo" --merge --delete-branch 2>/dev/null \
      && echo "  MERGED" \
      || echo "  open — merge in UI"
  fi
done

echo
echo "== Live signal check =="
bash "$ROOT/scripts/site-analytics/check-gsc-signals.sh" || true

echo
echo "== IndexNow =="
bash "$ROOT/scripts/site-analytics/submit-indexnow.sh" || true

echo
echo "Done. Manual leftovers:"
echo "  1) busselect Site Creator: fix/remove NEXT_PUBLIC_GOOGLE_* placeholders"
echo "  2) Search Console: resubmit sitemap.xml x5"
echo "  3) Bing Webmaster: verify shudenhotel.jp (clears IndexNow 403)"
echo "  4) DTI: bash scripts/site-analytics/complete-dti-rollout.sh  (or included above)"
echo "See docs/GSC-FINISH.md"
