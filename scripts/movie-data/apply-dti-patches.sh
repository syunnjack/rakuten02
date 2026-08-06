#!/usr/bin/env bash
# Apply DTI CSV patches to hey-douga-guide and free-sample-hub.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATCHES="$ROOT/patches"

apply_patch() {
  local repo="$1"
  local dir="$2"
  shift 2
  local patches=("$@")

  echo "==> $repo"
  if [[ -d "$dir/.git" ]]; then
    echo "    Using existing clone: $dir"
  else
    git clone --depth 1 "https://github.com/syunnjack/${repo}.git" "$dir"
  fi

  cd "$dir"
  git checkout master 2>/dev/null || git checkout main
  git pull --ff-only origin "$(git branch --show-current)" 2>/dev/null || true

  for patch in "${patches[@]}"; do
    echo "    Applying $(basename "$patch")"
    git am "$patch"
  done
}

case "${1:-all}" in
  hey-douga-guide)
    apply_patch hey-douga-guide /tmp/hey-douga-guide-deploy \
      "$PATCHES/hey-douga-guide/"*.patch
    echo "Run: cd /tmp/hey-douga-guide-deploy && php artisan migrate && php artisan dti:import-csv database/seeders/data/dti-movies.csv --verify-sample"
    ;;
  free-sample-hub)
    apply_patch free-sample-hub /tmp/free-sample-hub-deploy \
      "$PATCHES/free-sample-hub/"*.patch
    echo "Run: cd /tmp/free-sample-hub-deploy && php artisan migrate && php artisan samples:import-csv database/seeders/data/dti-movies.csv"
    ;;
  all)
    "$0" hey-douga-guide
    "$0" free-sample-hub
    ;;
  *)
    echo "Usage: $0 [hey-douga-guide|free-sample-hub|all]"
    exit 1
    ;;
esac

echo "Done."
