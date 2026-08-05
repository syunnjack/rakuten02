#Requires -Version 5.1
<#
.SYNOPSIS
  rakuten02 のパッチを各リポジトリに順番適用します（git am）。
  各リポジトリは事前に clone 済みであること。
#>

$ErrorActionPreference = "Stop"
$patchBase = "https://github.com/syunnjack/rakuten02/raw/master/patches"

$jobs = @(
  @{
    Name = "task-dashboard (darekore GSC dispatch)"
    Dir  = "task-dashboard"
    Patch = "$patchBase/task-dashboard/0002-Add-workflow-dispatch-for-Search-Console-token.patch"
    Optional = $true
  },
  @{
    Name = "machi-list (Render)"
    Dir  = "machi-list"
    Patch = "$patchBase/machi-list/0002-Switch-to-Render-custom-domain.patch"
    Optional = $true
  },
  @{
    Name = "goal-pilot-app"
    Dir  = "goal-pilot-app"
    Patch = "$patchBase/goal-pilot-app/0001-Add-robots-canonical-and-search-console-doc.patch"
    Optional = $true
  },
  @{
    Name = "kousokubus-benri (busselect)"
    Dir  = "kousokubus-benri"
    Patch = "$patchBase/kousokubus-benri/0001-Add-GA4-Search-Console-and-IndexNow.patch"
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
