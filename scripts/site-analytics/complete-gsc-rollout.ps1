#Requires -Version 5.1
<#
.SYNOPSIS
  Finish the remaining GSC rollout in one shot (requires write access to syunnjack/*).

.DESCRIPTION
  1. Pulls latest rakuten02
  2. Merges already-open helpful Devin PRs on each satellite repo
  3. Applies rakuten02 GSC patches (git am), pushes, opens/merges PRs
  4. Re-checks live GSC signals + IndexNow

.EXAMPLE
  cd C:\Users\syunn\rakuten02
  git pull origin master
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

# Open PRs that already fix overlapping GSC issues (merge first when clean).
$existingPrs = @(
  @{ Repo = "syunnjack/task-dashboard"; Number = 8; Note = "percent-encode actress URLs" },
  @{ Repo = "syunnjack/machi-list"; Number = 1; Note = "shop detail pages + sitemap" },
  @{ Repo = "syunnjack/hey-douga-guide"; Number = 2; Note = "canonical/robots from APP_URL" },
  @{ Repo = "syunnjack/hey-douga-guide"; Number = 3; Note = "https sample media" },
  @{ Repo = "syunnjack/hey-douga-guide"; Number = 4; Note = "crawlable work/provider pages" },
  @{ Repo = "syunnjack/free-sample-hub"; Number = 1; Note = "DTI CSV import + https samples" }
)

Write-Host "`n== Merge existing Devin PRs ==" -ForegroundColor Cyan
foreach ($pr in $existingPrs) {
  Write-Host "- $($pr.Repo) #$($pr.Number) ($($pr.Note))"
  gh pr merge $pr.Number --repo $pr.Repo --merge 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "  MERGED" -ForegroundColor Green
  } else {
    $state = gh pr view $pr.Number --repo $pr.Repo --json state,mergeable -q '"\(.state) mergeable=\(.mergeable)"' 2>$null
    Write-Host "  skip ($state) — merge in GitHub UI if still open" -ForegroundColor Yellow
  }
}

$reposRoot = Split-Path $root -Parent
$jobs = @(
  @{
    Dir = "kousokubus-benri"
    Base = "main"
    Patch = @(
      "patches/kousokubus-benri/0005-Reject-placeholder-GA4-GSC-and-fix-title.patch",
      "patches/kousokubus-benri/0006-Noindex-search-add-faq-jsonld-and-fix-layout-canonical.patch"
    )
    Title = "GSC: reject fake GA4/GSC, noindex search, FAQ JSON-LD"
  },
  @{
    Dir = "task-dashboard"
    Base = "main"
    Patch = @(
      "patches/task-dashboard/0005-Improve-GSC-title-noindex-query-and-sitemap-encoding.patch",
      "patches/task-dashboard/0006-Add-FAQ-JSON-LD-encoded-canonicals-and-robots-query.patch"
    )
    Title = "GSC: richer title, FAQ JSON-LD, noindex search queries"
  },
  @{
    Dir = "machi-list"
    Base = "main"
    Patch = @(
      "patches/machi-list/0003-Fix-robots-conflict-and-valuecommerce-placeholders.patch",
      "patches/machi-list/0004-Add-faq-jsonld-og-tags-and-query-robots.patch"
    )
    Title = "GSC: fix VC placeholders, FAQ JSON-LD, og tags, query robots"
  },
  @{
    Dir = "goal-pilot-app"
    Base = "main"
    Patch = @(
      "patches/goal-pilot-app/0002-Expand-sitemap-remove-vercel-robots-add-jsonld.patch",
      "patches/goal-pilot-app/0003-Add-per-route-canonicals-faq-jsonld-and-indexnow.patch"
    )
    Title = "GSC: per-route canonicals, FAQ JSON-LD, IndexNow"
  }
)

$branch = "cursor/gsc-site-patches-86e1"
$ok = 0
$fail = 0

Write-Host "`n== Apply rakuten02 patches ==" -ForegroundColor Cyan
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
    foreach ($rel in @($job.Patch)) {
      $patchPath = Join-Path $root $rel
      Write-Host "  am $rel"
      git am $patchPath
      if ($LASTEXITCODE -ne 0) {
        Write-Host "git am failed — trying 3-way apply" -ForegroundColor Yellow
        git am --abort 2>$null
        git apply --3way $patchPath
        git add -A
        git commit -m $job.Title
      }
    }
    git push -u origin $branch
    $prUrl = gh pr create --base $job.Base --head $branch --title $job.Title --body "Applied from rakuten02/$($job.Patch)`n`nSee also docs/GSC-FINISH.md" 2>$null
    if (-not $prUrl) {
      $prUrl = gh pr view --json url -q .url 2>$null
    }
    Write-Host "PR: $prUrl"
    gh pr merge --merge --delete-branch 2>$null
    if ($LASTEXITCODE -eq 0) {
      Write-Host "MERGED" -ForegroundColor Green
    } else {
      Write-Host "Opened/updated PR (merge in UI if needed)" -ForegroundColor Yellow
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
Write-Host "3. Bing Webmaster: verify shudenhotel.jp (clears IndexNow Bing 403)"
Write-Host "4. DTI: bash scripts/site-analytics/apply-dti-patches.sh (or complete-dti-rollout.sh; included above)"
Write-Host "5. Ranking trailing-slash: PUSH=false bash scripts/site-analytics/apply-ranking-canonical-patches.sh"
Write-Host "6. After busselect redeploy, re-run check-sites.ps1"
Write-Host "`nok=$ok fail=$fail"
if ($fail -gt 0) { exit 1 }
