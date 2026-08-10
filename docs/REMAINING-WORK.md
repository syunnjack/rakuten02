# 残り作業チェックリスト — 2026-08-10 更新

ライブ確認済み。✅ = 完了 / 🟡 = 一部残 / ❌ = 未着手

---

## トラック A — カスタムドメイン（5サイト）

| サイト | 公開 | GA4 | GSC | 残り |
|--------|------|-----|-----|------|
| shudenhotel.jp | ✅ | ✅ | ✅ | なし |
| darekore.jp | ✅ | ✅ | ✅ | **Search Console でサイトマップ送信** |
| goalpilot.jp | ✅ | ✅ | ✅ | **Search Console でサイトマップ送信** |
| machi-list.jp | ✅ HTTPS | ❌ | ✅ | **GitHub Secret `GOOGLE_ANALYTICS_MEASUREMENT_ID` + Deploy 再実行** |
| busselect.jp | ✅ | ✅ | ✅ | **Search Console サイトマップ送信**（任意） |

### machi-list — GA4 だけ未注入

GSC メタは live。GA4 タグが HTML にない → Secret 未設定 or 再デプロイ未実施。

1. https://github.com/syunnjack/machi-list/settings/secrets/actions  
   `GOOGLE_ANALYTICS_MEASUREMENT_ID` = `G-XXXXXXXX`
2. Actions → **Deploy static site** → Run workflow

詳細: `patches/machi-list/POST-DNS-GITHUB-PAGES.md`

### darekore / goalpilot / busselect — Search Console（ブラウザ 2分×）

1. https://search.google.com/search-console
2. 各ドメイン → **サイトマップ** → 追加:
   - `https://darekore.jp/sitemap.xml`
   - `https://goalpilot.jp/sitemap.xml`
   - `https://busselect.jp/sitemap.xml`

### busselect — 完了済み（参考）

- パッチ 0002（GA4/GSC/IndexNow）✅
- パッチ 0003（Leaflet ルート地図）✅ — 秋葉原で動作確認済
- パッチ 0004（Windows `npm run dev`）— 任意

---

## トラック B — DTI 動画サイト

| リポジトリ | 状態 | 残り |
|------------|------|------|
| hey-douga-guide | PR #1 マージ済 | **本番サーバー** migrate + import |
| free-sample-hub | 未セットアップ | パッチ 0001–0003 適用 |

### hey-douga-guide 本番

```powershell
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan dti:import-csv database\seeders\data\dti-movies.csv
php artisan dti:sync
```

`patches/hey-douga-guide/MERGE-PR.md`

### free-sample-hub

`patches/free-sample-hub/SETUP.md` / `patches/DEPLOY-WINDOWS.md`

---

## トラック C — ランキングサイト（41 repo）

未デプロイ。ドメイン割当・デプロイ方針の相談待ち。`docs/RANKING-SITES.md`

---

## 一括確認（PowerShell）

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```

---

## 優先順位

| # | 作業 | 担当 | 時間目安 |
|---|------|------|----------|
| 1 | machi-list GA4 Secret + Deploy | GitHub UI | 5分 |
| 2 | Search Console サイトマップ ×3〜4 | ブラウザ | 10分 |
| 3 | hey-douga 本番 migrate | 本番 PowerShell | 10分 |
| 4 | free-sample-hub セットアップ | ローカル PowerShell | 20分 |
