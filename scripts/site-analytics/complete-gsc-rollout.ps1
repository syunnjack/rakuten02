#Requires -Version 5.1
<#
.SYNOPSIS
  Finish the remaining GSC rollout in one shot on a machine that can push
  to syunnjack/* repos (your Windows PC with GitHub auth).

.DESCRIPTION
  1. Pulls latest rakuten02
  2. Applies the four site patches (git am) and pushes/PRs/merges when possible
  3. Re-checks live GSC signals
  4. Submits IndexNow for sites with working keys

.EXAMPLE
  cd C:\Users\syunn\rakuten02
  .\scripts\site-analytics\complete-gsc-rollout.ps1
#>

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path (Join-Path $root "patches"))) {
  $root = (Get-Location).Path
}

Write-Host "== GSC rollout completer ==" -ForegroundColor Cyan
Write-Host "root=$root"

Push-Location $root
try {
  git checkout master
  git pull origin master
} finally {
  Pop-Location
}

$reposRoot = Split-Path $root -Parent
$jobs = @(
  @{
    Dir = "kousokubus-benri"
    Base = "main"
    Patch = "patches/kousokubus-benri/0005-Reject-placeholder-GA4-GSC-and-fix-title.patch"
    Title = "GSC: reject placeholder GA4/GSC tokens and fix title"
  },
  @{
    Dir = "task-dashboard"
    Base = "main"
    Patch = "patches/task-dashboard/0005-Improve-GSC-title-noindex-query-and-sitemap-encoding.patch"
    Title = "GSC: richer title, noindex search queries, encode sitemap"
  },
  @{
    Dir = "machi-list"
    Base = "main"
    Patch = "patches/machi-list/0003-Fix-robots-conflict-and-valuecommerce-placeholders.patch"
    Title = "GSC: fix robots conflict and ValueCommerce placeholders"
  },
  @{
    Dir = "goal-pilot-app"
    Base = "main"
    Patch = "patches/goal-pilot-app/0002-Expand-sitemap-remove-vercel-robots-add-jsonld.patch"
    Title = "GSC: expand sitemap, remove vercel robots, add JSON-LD"
  }
)

$branch = "cursor/gsc-site-patches-86e1"
$ok = 0
$fail = 0

foreach ($job in $jobs) {
  Write-Host "`n=== $($job.Dir) ===" -ForegroundColor Cyan
  $dir = Join-Path $reposRoot $job.Dir
  if (-not (Test-Path $dir)) {
    Write-Host "Cloning $($job.Dir)..."
    git clone "https://github.com/syunnjack/$($job.Dir).git" $dir
  }
  Push-Location $dir
  try {
    git fetch origin
    git checkout $job.Base
    git pull origin $job.Base
    git checkout -B $branch "origin/$($job.Base)"
    $patchPath = Join-Path $root $job.Patch
    git am $patchPath
    git push -u origin $branch
    $prUrl = gh pr create --base $job.Base --head $branch --title $job.Title --body "Applied from rakuten02/$($job.Patch)" 2>$null
    if (-not $prUrl) {
      $prUrl = gh pr view --json url -q .url 2>$null
    }
    Write-Host "PR: $prUrl"
    gh pr merge --merge --delete-branch 2>$null
    if ($LASTEXITCODE -eq 0) {
      Write-Host "MERGED" -ForegroundColor Green
    } else {
      Write-Host "Opened/updated PR (merge manually if needed)" -ForegroundColor Yellow
    }
    $ok++
  } catch {
    Write-Host "FAIL: $_" -ForegroundColor Red
    git am --abort 2>$null
    $fail++
  } finally {
    Pop-Location
  }
}

Write-Host "`n== Live check ==" -ForegroundColor Cyan
& "$root\scripts\site-analytics\check-sites.ps1"

Write-Host "`n== IndexNow ==" -ForegroundColor Cyan
if (Get-Command bash -ErrorAction SilentlyContinue) {
  bash "$root/scripts/site-analytics/submit-indexnow.sh"
} else {
  Write-Host "bash not found; skip IndexNow script"
}

Write-Host "`n== Manual leftovers ==" -ForegroundColor Yellow
Write-Host "1. busselect Site Creator: set real NEXT_PUBLIC_GOOGLE_* (remove Japanese placeholders)"
Write-Host "2. Search Console: resubmit sitemap.xml for all 5 properties"
Write-Host "3. After busselect redeploy, re-run check-sites.ps1"
Write-Host "`nok=$ok fail=$fail"
if ($fail -gt 0) { exit 1 }
