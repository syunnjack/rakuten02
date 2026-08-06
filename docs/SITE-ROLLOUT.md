# 全サイト ロールアウト手順（1→4）

最終確認: **2026-08-06**（引き継ぎ更新）

マスター台帳: `docs/HANDOFF.md`

## 現状スナップショット

| サイト | 公開 | GA4 | GSC | 次のアクション |
|--------|------|-----|-----|----------------|
| shudenhotel.jp | ✅ | ✅ | ✅ | **完了** |
| darekore.jp | ✅ | ✅ | メタ live | **Search Console で「確認」→ サイトマップ送信** |
| goalpilot.jp | ✅ | ✅ | メタ live | **Search Console でサイトマップ送信** |
| machi-list.jp | ❌ DNS | 準備済 | 準備済 | **お名前.com DNS 変更**（パーキング解除） |
| busselect.jp | ❌ DNS | ❌ | ❌ | パッチ適用 + DNS |

DNS 確認: `machi-list.jp` / `busselect.jp` → いずれも `150.95.255.38`（お名前.com パーキング）

一括確認:

```powershell
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

## 手順 2: machi-list.jp — 独自ドメイン公開 ★最優先

**最短:** GitHub Pages + DNS（コード・ワークフローは repo 準備済み）

```powershell
# お名前.com:
# 1. @ A 150.95.255.38 を削除
# 2. GitHub Pages A レコード 4 つ追加
# 詳細: patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md
```

GitHub Secrets 設定 → Actions **Deploy static site** を Re-run:

| Secret | 用途 |
|--------|------|
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 |
| `GOOGLE_SITE_VERIFICATION` | GSC content |
| `INDEXNOW_KEY` | `machilistindex2026` |

**Render 移行（任意・非推奨 unless 方針変更）:** `patches/machi-list/DEPLOY-CUSTOM-DOMAIN.md`  
※ PR #10 は GitHub Pages 方針に統合済みのためクローズ。

---

## 手順 3: goalpilot.jp — Search Console サイトマップ

タグは live。ブラウザで:

1. https://search.google.com/search-console
2. `https://goalpilot.jp/` → 所有権確認（HTML タグ）
3. サイトマップ → `https://goalpilot.jp/sitemap.xml`

---

## 手順 4: busselect.jp — パッチ + DNS

```powershell
cd C:\Users\syunn\source\repos\kousokubus-benri
curl.exe -L -o bs.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/kousokubus-benri/0001-Add-GA4-Search-Console-and-IndexNow.patch"
git am bs.patch
git push origin main
```

お名前.com: パーキング解除 → Site Creator DNS 設定

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
