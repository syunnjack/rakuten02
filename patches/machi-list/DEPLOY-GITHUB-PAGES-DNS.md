# machi-list.jp — GitHub Pages + 独自ドメイン（最短ルート）

Render を使わず、**既に成功している GitHub Pages デプロイ**のまま `machi-list.jp` で公開する手順です。  
公開 URL は `https://machi-list.jp/`（`syunnjack.github.io` ではありません）。

## 前提

- パッチ 0001（GA4 / sitemap / IndexNow）は適用済み
- GitHub Actions の Deploy static site は success
- `CNAME` に `machi-list.jp` が設定済み

## 1. お名前.com DNS 変更

**削除（必須）:**

```text
@  A  150.95.255.38   ← お名前.com パーキング
```

**追加（GitHub Pages 用 A レコード ×4）:**

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

**www がある場合:**

```text
www  CNAME  syunnjack.github.io
```

## 2. GitHub Pages 設定

https://github.com/syunnjack/machi-list/settings/pages

- Source: **GitHub Actions**（Deploy static site workflow）
- Custom domain: `machi-list.jp`（Enforce HTTPS を ON）

## 3. GitHub Secrets（ビルド時に GA4 タグ注入）

https://github.com/syunnjack/machi-list/settings/secrets/actions

| Secret | 値 |
|--------|-----|
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | `G-XXXXXXXX` |
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML タグの content |
| `INDEXNOW_KEY` | `machilistindex2026` |

Secrets 設定後 → Actions → Deploy static site → **Re-run**

## 4. 確認（PowerShell）

```powershell
nslookup machi-list.jp
# → 185.199.108.x など（150.95.255.38 ではないこと）

Invoke-WebRequest -Uri "https://machi-list.jp/" -UseBasicParsing
Invoke-WebRequest -Uri "https://machi-list.jp/sitemap.xml" -UseBasicParsing

$html = (Invoke-WebRequest -Uri "https://machi-list.jp/" -UseBasicParsing).Content
"ga4: $($html -match 'googletagmanager')"
"gsc: $($html -match 'google-site-verification')"
```

## Render を使う場合

GitHub Pages をやめて Render に移行する場合は `DEPLOY-CUSTOM-DOMAIN.md` とパッチ 0002 を参照してください。
