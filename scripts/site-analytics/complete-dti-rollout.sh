#!/usr/bin/env bash
# Finish remaining DTI (hey-douga-guide / free-sample-hub) work.
# Local rakuten02 patches for hey-douga 0001/0002 are already on master (PR #1).
# Remaining: merge Devin PRs (via apply-dti) + git am leftovers, then production migrate+import.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "== DTI rollout completer =="

if [[ -n "${CROSS_REPO_PAT:-}" ]]; then
  export GH_TOKEN="$CROSS_REPO_PAT"
fi

# Merges Devin PRs then applies local patches (PUSH/CREATE_PRS default true).
PUSH="${PUSH:-true}" CREATE_PRS="${CREATE_PRS:-true}" \
  bash "$ROOT/scripts/site-analytics/apply-dti-patches.sh"

echo
echo "Production leftovers (server with .env):"
echo "  hey-douga-guide: composer install && php artisan migrate && php artisan dti:import-csv"
echo "  free-sample-hub: composer install && php artisan migrate && php artisan samples:import-csv"
echo "See patches/DEPLOY-WINDOWS.md"
