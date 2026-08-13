#Requires -Version 5.1
<#
.SYNOPSIS
  全サイトの公開・SEO タグ状況を一括確認します。
.EXAMPLE
  .\scripts\site-analytics\check-sites.ps1
#>

$sites = @(
  @{ Name = "shudenhotel.jp";   Url = "https://shudenhotel.jp/" },
  @{ Name = "darekore.jp";      Url = "https://darekore.jp/" },
  @{ Name = "goalpilot.jp";     Url = "https://goalpilot.jp/" },
  @{ Name = "machi-list.jp";    Url = "https://machi-list.jp/" },
  @{ Name = "busselect.jp";     Url = "https://busselect.jp/" },
  @{ Name = "rakuafi-tool";     Url = "https://syunnjack.github.io/rakuafi-tool/" }
)

Write-Host ("{0,-22} {1,-6} {2,-4} {3,-4} {4,-6} {5,-4} {6}" -f "SITE", "HTTP", "GA4", "GSC", "CANON", "MAP", "NOTES")
Write-Host ("-" * 78)

$critical = 0
foreach ($site in $sites) {
  $http = "-"
  $ga4 = "-"
  $gsc = "-"
  $canon = "-"
  $map = "-"
  $notes = @()

  try {
    $resp = Invoke-WebRequest -Uri $site.Url -UseBasicParsing -TimeoutSec 15
    $http = [string]$resp.StatusCode
    $html = $resp.Content

    if ($html -match 'gtag/js\?id=(G-[A-Z0-9]+)') {
      $ga4 = "Y"
    } elseif ($html -match "googletagmanager|gtag\(") {
      $ga4 = "FAKE"
      $notes += "ga4-placeholder"
      $critical++
    }

    if ($html -match 'google-site-verification"\s+content="([^"]+)"') {
      $token = $Matches[1]
      if ($token -match 'HTML|content値|測定ID|XXXX|YOUR_') {
        $gsc = "FAKE"
        $notes += "gsc-placeholder"
        $critical++
      } else {
        $gsc = "Y"
      }
    }

    if ($html -match 'rel="canonical"\s+href="([^"]+)"') {
      $href = $Matches[1]
      if ($href -like "http://*") {
        $canon = "HTTP"
        $notes += "canonical-http"
        $critical++
      } elseif ($href -like "https://*") {
        $canon = "Y"
      } else {
        $canon = "BAD"
        $critical++
      }
    }

    if ($html -match 'YOUR_VC_SID|GA4測定ID|Search Console HTMLタグ') {
      $notes += "placeholder-text"
      $critical++
    }
  } catch {
    $http = "FAIL"
    $critical++
  }

  try {
    $sm = Invoke-WebRequest -Uri ($site.Url.TrimEnd("/") + "/sitemap.xml") -UseBasicParsing -TimeoutSec 10
    if ($sm.StatusCode -eq 200) {
      $map = "Y"
      if ($sm.Content -match 'http://shudenhotel\.jp') {
        $map = "HTTP"
        $notes += "sitemap-http"
        $critical++
      }
    }
  } catch {
    $map = "-"
  }

  $noteText = if ($notes.Count) { ($notes -join ",") } else { "ok" }
  Write-Host ("{0,-22} {1,-6} {2,-4} {3,-4} {4,-6} {5,-4} {6}" -f $site.Name, $http, $ga4, $gsc, $canon, $map, $noteText)
}

Write-Host ""
Write-Host "critical=$critical"
if ($critical -gt 0) { exit 1 }
