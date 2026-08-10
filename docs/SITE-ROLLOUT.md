# 全サイト ロールアウト手順

最終確認: **2026-08-10**

マスター台帳: `docs/HANDOFF.md` / 残り作業: `docs/REMAINING-WORK.md`

## 現状スナップショット

| サイト | 公開 | GA4 | GSC | 次のアクション |
|--------|------|-----|-----|----------------|
| shudenhotel.jp | ✅ | ✅ | ✅ | **完了** |
| darekore.jp | ✅ | ✅ | ✅ | **Search Console サイトマップ送信** |
| goalpilot.jp | ✅ | ✅ | ✅ | **Search Console サイトマップ送信** |
| machi-list.jp | ✅ HTTPS | ❌ | ✅ | **GA4 Secret + Deploy 再実行** |
| busselect.jp | ✅ | ✅ | ✅ | **Search Console サイトマップ送信**（Leaflet 適用済） |

一括確認:

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```

---

## 手順 1: darekore.jp — Search Console

**メタタグは本番に反映済み**（2026-08-05 以降）。ブラウザのみ:

1. https://search.google.com/search-console
2. プロパティ `https://darekore.jp/` → **所有権の確認**（HTML タグ方式）
3. サイトマップ → `https://darekore.jp/sitemap.xml` 送信

（HTML ファイル方式も可: `patches/task-dashboard/SETUP-SEARCH-CONSOLE.md`）

---

## 手順 2: machi-list.jp — GA4 Secret + 再デプロイ

**HTTPS + GSC: 完了**（2026-08-10）。**GA4 のみ未注入。**

1. https://github.com/syunnjack/machi-list/settings/secrets/actions  
   `GOOGLE_ANALYTICS_MEASUREMENT_ID` = GA4 測定 ID
2. Actions → **Deploy static site** → Run workflow

詳細: `patches/machi-list/POST-DNS-GITHUB-PAGES.md`

---

## 手順 3: goalpilot.jp — Search Console サイトマップ

タグは live。ブラウザで:

1. https://search.google.com/search-console
2. `https://goalpilot.jp/` → 所有権確認（HTML タグ）
3. サイトマップ → `https://goalpilot.jp/sitemap.xml`

---

## 手順 4: busselect.jp — 完了 / Search Console のみ

**公開・GA4/GSC・Leaflet ルート地図: 完了**（2026-08-10）

残り（任意）: Search Console → `https://busselect.jp/sitemap.xml` 送信

パッチ参考:
- `patches/kousokubus-benri/APPLY-0003-LEAFLET.md`
- `patches/kousokubus-benri/WINDOWS-DEV.md`（ローカル dev）

---

## パッチ一括適用（任意）

```powershell
cd C:\Users\syunn\rakuten02
.\scripts\site-analytics\apply-patches.ps1
```

---

## 別トラック: DTI 動画サイト

hey-douga-guide / free-sample-hub → `patches/DEPLOY-WINDOWS.md` / `docs/HANDOFF.md` セクション B

## 別トラック: ランキングサイト（41 repo）

未デプロイ → `docs/HANDOFF.md` セクション C
