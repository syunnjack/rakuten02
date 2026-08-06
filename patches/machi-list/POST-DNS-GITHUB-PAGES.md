# machi-list.jp — DNS 反映後の仕上げ

**2026-08-06 確認:** お名前.com DNS は GitHub Pages A レコードに変更済み。  
`http://machi-list.jp/` は **200 OK**（HTTP で公開中）。

**残り:** GitHub Pages で HTTPS 有効化 + Secrets 設定 + 再デプロイ

---

## 症状（いま起きていること）

| 確認 | 結果 |
|------|------|
| `nslookup machi-list.jp` | `185.199.108–111.153` ✅ |
| `http://machi-list.jp/` | 200 OK ✅ |
| `https://machi-list.jp/` | 証明書エラー（`*.github.io`）❌ |
| HTML 内 GA4 / GSC | タグなし ❌ |

HTTPS が効く前は `check-sites.ps1` が **FAIL** になることがあります（スクリプトは `https://` でアクセス）。

---

## 手順 1: GitHub Pages — カスタムドメイン + HTTPS

https://github.com/syunnjack/machi-list/settings/pages

1. **Custom domain:** `machi-list.jp`（未入力なら入力して Save）
2. **DNS Check** が成功するまで数分待つ（A レコード 4 つが正しければ OK）
3. **Enforce HTTPS** を **ON**（DNS Check 成功後に有効化ボタンが出る）
4. 証明書発行まで **最大 24 時間**（通常は数分〜1 時間）

---

## 手順 2: GitHub Secrets + 再デプロイ

https://github.com/syunnjack/machi-list/settings/secrets/actions

| Secret | 値 |
|--------|-----|
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 測定 ID |
| `GOOGLE_SITE_VERIFICATION` | Search Console meta `content` |
| `INDEXNOW_KEY` | `machilistindex2026` |

Secrets 設定後:

https://github.com/syunnjack/machi-list/actions/workflows/deploy-static-site.yml  
→ **Deploy static site** → **Run workflow**（Re-run latest でも可）

---

## 手順 3: 確認（PowerShell）

```powershell
# HTTPS が効くまで HTTP でも可
Invoke-WebRequest -Uri "http://machi-list.jp/" -UseBasicParsing
Invoke-WebRequest -Uri "https://machi-list.jp/" -UseBasicParsing   # Enforce HTTPS 後

$html = (Invoke-WebRequest -Uri "https://machi-list.jp/" -UseBasicParsing).Content
"ga4: $($html -match 'googletagmanager')"
"gsc: $($html -match 'google-site-verification')"

cd C:\Users\syunn\rakuten02
.\scripts\site-analytics\check-sites.ps1
```

Search Console → `https://machi-list.jp/sitemap.xml` 送信

---

## 関連

- 初回 DNS 手順: `DEPLOY-GITHUB-PAGES-DNS.md`
- busselect（未完了）: `../kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md`
