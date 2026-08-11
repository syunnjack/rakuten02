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
  @{ Name = "municipality-car.jp"; Url = "https://municipality-car.jp/" },
  @{ Name = "rakuafi-tool";     Url = "https://syunnjack.github.io/rakuafi-tool/" },
  @{ Name = "sosoru.asia";      Url = "https://sosoru.asia/" },
  @{ Name = "sosoru.org";       Url = "https://sosoru.org/" }
)

Write-Host ("{0,-22} {1,-6} {2,-4} {3,-4} {4,-4} {5,-4} {6}" -f "SITE", "HTTP", "GA4", "GSC", "ROB", "MAP", "CANON")
Write-Host ("-" * 70)

foreach ($site in $sites) {
  $http = "-"
  $ga4 = "-"
  $gsc = "-"
  $rob = "-"
  $map = "-"
  $canon = "-"

  try {
    $resp = Invoke-WebRequest -Uri $site.Url -UseBasicParsing -TimeoutSec 15
    $http = [string]$resp.StatusCode
    $html = $resp.Content
    if ($html -match "googletagmanager|gtag\(") { $ga4 = "Y" }
    if ($html -match "google-site-verification") { $gsc = "Y" }
    if ($html -match 'name="robots"') { $rob = "Y" }
    # http のcanonicalはhttpsで配信しているページと矛盾するので警告する。
    if ($html -match '<link rel="canonical"[^>]*href="([^"]+)"') {
      if ($matches[1].StartsWith("https://")) { $canon = "Y" } else { $canon = "HTTP!" }
    }
    # ホスト側のBot判定ページは200でHTMLを返すので、中身を見ないと正常公開に見えてしまう。
    if ($html -match "One moment, please") { $canon = "BOT-WALL!" }
  } catch {
    $http = "FAIL"
  }

  try {
    $sm = Invoke-WebRequest -Uri ($site.Url.TrimEnd("/") + "/sitemap.xml") -UseBasicParsing -TimeoutSec 10
    if ($sm.StatusCode -eq 200 -and $sm.Content -match "<urlset|<sitemapindex") { $map = "Y" }
    elseif ($sm.StatusCode -eq 200) { $map = "HTML!" }
  } catch {
    $map = "-"
  }

  Write-Host ("{0,-22} {1,-6} {2,-4} {3,-4} {4,-4} {5,-4} {6}" -f $site.Name, $http, $ga4, $gsc, $rob, $map, $canon)
}
