#Requires -Version 5.1
<#
.SYNOPSIS
  ロールアウト手順 1→4 を順番に案内・確認します。
#>

function Test-Site($Name, $Url) {
  $r = [ordered]@{ Site = $Name; Http = "-"; Ga4 = "-"; Gsc = "-"; Map = "-" }
  try {
    $resp = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15
    $r.Http = [string]$resp.StatusCode
    if ($resp.Content -match "googletagmanager|gtag\(") { $r.Ga4 = "Y" }
    if ($resp.Content -match "google-site-verification") { $r.Gsc = "Y" }
  } catch { $r.Http = "FAIL" }
  try {
    $sm = Invoke-WebRequest -Uri ($Url.TrimEnd("/") + "/sitemap.xml") -UseBasicParsing -TimeoutSec 10
    if ($sm.StatusCode -eq 200) { $r.Map = "Y" }
  } catch {}
  return [pscustomobject]$r
}

Write-Host "`n=== 手順 1: darekore.jp ===" -ForegroundColor Cyan
$d = Test-Site "darekore.jp" "https://darekore.jp/"
$d | Format-Table -AutoSize

if ($d.Gsc -ne "Y") {
  Write-Host @"

【未完了】Search Console タグがありません。次を実行:

1) https://search.google.com/search-console → プロパティ追加 https://darekore.jp/
2) 確認方法を選ぶ:
   A) HTML タグ → content 値をコピー
   B) HTML ファイル → googleXXXX.html をダウンロード

--- 方法A: index.html に直接追加（GA4 と同じやり方）---
cd C:\Users\syunn\task-dashboard
curl.exe -L -o sc.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/task-dashboard/0003-Add-Search-Console-meta-to-index-html.patch"
git am sc.patch
# index.html の REPLACE_WITH_GSC_TOKEN を Search Console の content 値に置換
git add index.html
git commit -m "Add Search Console verification meta tag"
git push origin main

--- 方法B: HTML ファイル（より簡単）---
# googleXXXX.html を public\ にコピーして push

確認:
`$html = (Invoke-WebRequest -Uri "https://darekore.jp/" -UseBasicParsing).Content
`"gsc: `$(`$html -match 'google-site-verification')`"

Search Console → 確認 → サイトマップ https://darekore.jp/sitemap.xml 送信
"@ -ForegroundColor Yellow
  exit 1
}

Write-Host "手順 1 完了" -ForegroundColor Green

Write-Host "`n=== 手順 2: machi-list.jp ===" -ForegroundColor Cyan
$m = Test-Site "machi-list.jp" "https://machi-list.jp/"
$m | Format-Table -AutoSize
if ($m.Http -eq "FAIL" -or $m.Http -eq "000") {
  Write-Host @"

【未完了】DNS がパーキングのままです。お名前.com で:
  削除: @ A 150.95.255.38
  追加: @ A 185.199.108.153 / .109.153 / .110.153 / .111.153

詳細: rakuten02/patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md
"@ -ForegroundColor Yellow
  exit 1
}
Write-Host "手順 2 完了" -ForegroundColor Green

Write-Host "`n=== 手順 3: goalpilot.jp ===" -ForegroundColor Cyan
$g = Test-Site "goalpilot.jp" "https://goalpilot.jp/"
$g | Format-Table -AutoSize
Write-Host "Search Console → サイトマップ → https://goalpilot.jp/sitemap.xml 送信（ブラウザ）" -ForegroundColor Yellow

Write-Host "`n=== 手順 4: busselect.jp ===" -ForegroundColor Cyan
$b = Test-Site "busselect.jp" "https://busselect.jp/"
$b | Format-Table -AutoSize
if ($b.Http -eq "FAIL") {
  Write-Host @"

【未完了】パッチ適用 + DNS 変更:
cd C:\Users\syunn\kousokubus-benri
curl.exe -L -o bs.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/kousokubus-benri/0001-Add-GA4-Search-Console-and-IndexNow.patch"
git am bs.patch && git push origin main
"@ -ForegroundColor Yellow
}

Write-Host "`n全手順チェック終了" -ForegroundColor Green
