# お名前.com DNS 一括変更（machi-list + busselect）

**更新 2026-08-06:**

| ドメイン | DNS | 次 |
|----------|-----|-----|
| machi-list.jp | ✅ GitHub Pages A レコード | GitHub Pages HTTPS + Secrets（`POST-DNS-GITHUB-PAGES.md`） |
| busselect.jp | ❌ 150.95.255.38 パーキング | Site Creator Add domain + env |

---

## busselect.jp — お名前.com（未完了）

### パーキング解除

```text
@  A  150.95.255.38   ← 削除
```

### Site Creator DNS 追加

ChatGPT → Sites → busselect → Settings → **Add domain** → `busselect.jp`  
→ 表示 CNAME / TXT をお名前.com に追加

**Site Creator 環境変数:**

| 変数 | 用途 |
|------|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console |

**GitHub Secret:** `INDEXNOW_KEY` = `busselectindex2026`

詳細: `patches/kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md`

---

## machi-list.jp — 仕上げ（DNS 済）

DNS は反映済み。GitHub 側の作業:

**`patches/machi-list/POST-DNS-GITHUB-PAGES.md`**

1. Pages → Custom domain + **Enforce HTTPS**
2. Secrets 設定
3. Deploy static site 再実行

初回 DNS 手順（参考）: `patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md`

---

## 確認（PowerShell）

```powershell
nslookup machi-list.jp    # → 185.199.108.x
nslookup busselect.jp     # → 150.95.255.38 以外（未完了ならまだパーキング）

cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```
