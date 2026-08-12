#!/usr/bin/env bash
set -euo pipefail

OWNER="${GITHUB_OWNER:-syunnjack}"
WORK_DIR="${WORK_DIR:-/tmp/booth-rollout}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APPLY_SCRIPT="$SCRIPT_DIR/apply-booth-support.sh"
BRANCH="${BOOTH_BRANCH:-cursor/booth-revenue-funnel-80c6}"
COMMIT_MSG="Add BOOTH revenue funnel (README + footer link)"

mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required"
  exit 1
fi

mapfile -t REPOS < <(gh repo list "$OWNER" --limit 500 --json name --jq '.[].name')

updated=()
skipped=()
failed=()

for repo in "${REPOS[@]}"; do
  echo "=== $repo ==="
  target="$WORK_DIR/$repo"

  if [[ -d "$target/.git" ]]; then
    git -C "$target" fetch origin --prune >/dev/null 2>&1 || true
    git -C "$target" reset --hard >/dev/null 2>&1 || true
    git -C "$target" clean -fd >/dev/null 2>&1 || true
  else
    rm -rf "$target"
    if ! gh repo clone "$OWNER/$repo" "$target" -- --depth 1 2>/dev/null; then
      failed+=("$repo (clone)")
      continue
    fi
  fi

  default_branch="$(gh api "repos/$OWNER/$repo" --jq '.default_branch' 2>/dev/null || echo main)"
  if [[ -z "$default_branch" || "$default_branch" == "null" ]]; then
    default_branch="main"
  fi

  git -C "$target" checkout "$default_branch" >/dev/null 2>&1 || git -C "$target" checkout -b "$default_branch" >/dev/null 2>&1 || true
  git -C "$target" pull origin "$default_branch" >/dev/null 2>&1 || true

  set +e
  "$APPLY_SCRIPT" "$target"
  apply_status=$?
  set -e

  if [[ "$apply_status" -eq 0 ]]; then
    skipped+=("$repo")
    continue
  fi
  if [[ "$apply_status" -ne 2 ]]; then
    failed+=("$repo (apply)")
    continue
  fi

  git -C "$target" checkout -B "$BRANCH" >/dev/null 2>&1
  git -C "$target" add -A
  if git -C "$target" diff --cached --quiet; then
    skipped+=("$repo")
    continue
  fi

  git -C "$target" commit -m "$COMMIT_MSG" >/dev/null 2>&1
  if git -C "$target" push -u origin "$BRANCH" --force 2>/dev/null; then
    updated+=("$repo")
  else
    failed+=("$repo (push)")
  fi
done

echo
echo "Updated (${#updated[@]}): ${updated[*]:-none}"
echo "Skipped (${#skipped[@]}): already had BOOTH or no changes"
echo "Failed (${#failed[@]}): ${failed[*]:-none}"
