#!/usr/bin/env bash
# Finish remaining DTI (hey-douga-guide / free-sample-hub) work.
# Local rakuten02 patches for hey-douga 0001/0002 are already on master (PR #1).
# Remaining: merge open Devin PRs, then production migrate+import.
set -euo pipefail

echo "== DTI rollout completer =="

if [[ -n "${CROSS_REPO_PAT:-}" ]]; then
  export GH_TOKEN="$CROSS_REPO_PAT"
fi

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

echo
echo "== Merge Devin PRs =="
merge_pr syunnjack/hey-douga-guide 2 "canonical/robots from APP_URL"
merge_pr syunnjack/hey-douga-guide 3 "https sample media"
merge_pr syunnjack/hey-douga-guide 4 "crawlable work/provider pages"
merge_pr syunnjack/free-sample-hub 1 "DTI CSV import + https samples"

echo
echo "Done. Production leftovers (server with .env):"
echo "  hey-douga-guide: composer install && php artisan migrate && php artisan dti:import-csv"
echo "  free-sample-hub: composer install && php artisan migrate && php artisan samples:import-csv"
echo "See patches/DEPLOY-WINDOWS.md"
