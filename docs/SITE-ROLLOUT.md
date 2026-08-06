# 全サイト ロールアウト手順（1→4）

最終確認: **2026-08-06**（引き継ぎ更新）

マスター台帳: `docs/HANDOFF.md`

## 現状スナップショット

| サイト | 公開 | GA4 | GSC | 次のアクション |
|--------|------|-----|-----|----------------|
| shudenhotel.jp | ✅ | ✅ | ✅ | **完了** |
| darekore.jp | ✅ | ✅ | メタ live | **Search Console で「確認」→ サイトマップ送信** |
| goalpilot.jp | ✅ | ✅ | メタ live | **Search Console でサイトマップ送信** |
| machi-list.jp | 🟡 HTTP | 未 | 未 | **GitHub Pages HTTPS + Secrets + 再デプロイ** |
| busselect.jp | ❌ DNS | 準備済 | 準備済 | **Site Creator env + お名前.com DNS**（パッチ 0002 適用済） |

DNS: `machi-list.jp` → GitHub Pages A レコード ✅ / `busselect.jp` → **150.95.255.38** パーキング ❌

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

## 手順 2: machi-list.jp — HTTPS + Secrets 仕上げ

**DNS 反映済**（2026-08-06）。`http://machi-list.jp/` は 200 OK。  
**残り:** GitHub Pages Enforce HTTPS + Secrets + 再デプロイ

詳細: **`patches/machi-list/POST-DNS-GITHUB-PAGES.md`**

1. https://github.com/syunnjack/machi-list/settings/pages  
   Custom domain `machi-list.jp` → DNS Check OK → **Enforce HTTPS ON**
2. https://github.com/syunnjack/machi-list/settings/secrets/actions  
   `GOOGLE_ANALYTICS_MEASUREMENT_ID` / `GOOGLE_SITE_VERIFICATION` / `INDEXNOW_KEY`
3. Actions → **Deploy static site** → Run workflow

初回 DNS 手順（参考・完了済）: `patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md`

---

## 手順 3: goalpilot.jp — Search Console サイトマップ

タグは live。ブラウザで:

1. https://search.google.com/search-console
2. `https://goalpilot.jp/` → 所有権確認（HTML タグ）
3. サイトマップ → `https://goalpilot.jp/sitemap.xml`

---

## 手順 4: busselect.jp — Site Creator env + DNS

**パッチ 0002: 適用済**（2026-08-06）。残り 2 ステップ:

詳細: **`patches/kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md`**

### 1. Site Creator 環境変数（GA4 / GSC）

ChatGPT → Sites → busselect → Settings → Environment variables

| 変数 | 値 |
|------|-----|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 測定 ID |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console meta `content` |

→ 保存後 **再デプロイ**

### 2. GitHub Secret（IndexNow）

https://github.com/syunnjack/kousokubus-benri/settings/secrets/actions  
`INDEXNOW_KEY` = `busselectindex2026`（省略可）

### 3. お名前.com DNS

- **削除:** `@ A 150.95.255.38`（パーキング）
- **追加:** Site Creator → Add domain → `busselect.jp` → 表示された DNS レコード

### 確認

```powershell
cd C:\Users\syunn\rakuten02
.\scripts\site-analytics\check-sites.ps1
```

---

<details>
<summary>パッチ適用手順（参考・完了済）</summary>

```powershell
cd C:\Users\syunn\kousokubus-benri
curl.exe -L -o bs.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/kousokubus-benri/0002-Add-GA4-Search-Console-and-IndexNow-for-current-layout.patch"
git am bs.patch
git push origin main
```

</details>

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
