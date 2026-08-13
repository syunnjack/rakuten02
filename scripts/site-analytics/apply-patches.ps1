#Requires -Version 5.1
<#
.SYNOPSIS
  rakuten02 のパッチを各リポジトリに順番適用します（git am）。
  各リポジトリは事前に clone 済みであること。

  2026-08-12 GSC 改善パッチ詳細: patches/APPLY-GSC-2026-08-12.md
#>

$ErrorActionPreference = "Stop"
$patchBase = "https://github.com/syunnjack/rakuten02/raw/master/patches"

$jobs = @(
  @{
    Name = "task-dashboard (darekore GSC title/noindex/sitemap)"
    Dir  = "task-dashboard"
    Patch = "$patchBase/task-dashboard/0005-Improve-GSC-title-noindex-query-and-sitemap-encoding.patch"
    Optional = $true
  },
  @{
    Name = "machi-list (robots conflict + VC SID)"
    Dir  = "machi-list"
    Patch = "$patchBase/machi-list/0003-Fix-robots-conflict-and-valuecommerce-placeholders.patch"
    Optional = $true
  },
  @{
    Name = "goal-pilot-app (sitemap + JSON-LD)"
    Dir  = "goal-pilot-app"
    Patch = "$patchBase/goal-pilot-app/0002-Expand-sitemap-remove-vercel-robots-add-jsonld.patch"
    Optional = $true
  },
  @{
    Name = "kousokubus-benri (busselect placeholder guard)"
    Dir  = "kousokubus-benri"
    Patch = "$patchBase/kousokubus-benri/0005-Reject-placeholder-GA4-GSC-and-fix-title.patch"
    Optional = $true
  }
)

foreach ($job in $jobs) {
  Write-Host "`n=== $($job.Name) ===" -ForegroundColor Cyan
  if (-not (Test-Path $job.Dir)) {
    Write-Host "SKIP: $($job.Dir) not found" -ForegroundColor Yellow
    continue
  }
  Push-Location $job.Dir
  try {
    $patchFile = Join-Path $env:TEMP ("patch-" + [guid]::NewGuid().ToString() + ".patch")
    curl.exe -fsSL -o $patchFile $job.Patch
    git am $patchFile
    git push origin main
    Write-Host "OK: pushed" -ForegroundColor Green
  } catch {
    if ($job.Optional) {
      Write-Host "SKIP (optional/already applied): $_" -ForegroundColor Yellow
    } else {
      throw
    }
  } finally {
    Pop-Location
  }
}

Write-Host "`nDone. Run check-sites.ps1 to verify." -ForegroundColor Green
Write-Host "Then follow patches/APPLY-GSC-2026-08-12.md for Search Console / Site Creator steps." -ForegroundColor Cyan
