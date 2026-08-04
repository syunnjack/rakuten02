# 全サイト ロールアウト手順（1→4）

最終確認: 2026-08-04

## 手順 1: darekore.jp — Search Console タグ

**状態:** GA4 ✅ / Search Console HTML タグ ❌

```powershell
# Secret 登録（content 値のみ）
gh secret set VITE_GOOGLE_SITE_VERIFICATION -R syunnjack/task-dashboard -b"YOUR_TOKEN"

# 再デプロイ
gh workflow run "Deploy to GitHub Pages" -R syunnjack/task-dashboard

# 確認
$html = (Invoke-WebRequest -Uri "https://darekore.jp/" -UseBasicParsing).Content
"site-verification: $($html -match 'google-site-verification')"
```

詳細: `patches/task-dashboard/SETUP-SEARCH-CONSOLE.md`

---

## 手順 2: machi-list.jp — 独自ドメイン公開

**状態:** GitHub Actions デプロイ ✅ / DNS パーキング ❌

Render 公開（GitHub Pages 不使用）:

```powershell
cd C:\Users\syunn\source\repos\machi-list
curl.exe -L -o render.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/machi-list/0002-Switch-to-Render-custom-domain.patch"
git am render.patch
git push origin main
```

1. Render Blueprint で `render.yaml` をデプロイ
2. Environment: `GOOGLE_ANALYTICS_MEASUREMENT_ID`, `GOOGLE_SITE_VERIFICATION`
3. お名前.com: `150.95.255.38` 削除 → Render の A/CNAME を設定
4. GitHub Pages → Source: None

詳細: `patches/machi-list/DEPLOY-CUSTOM-DOMAIN.md`

---

## 手順 3: goalpilot.jp — Search Console サイトマップ

**状態:** GA4 ✅ / 確認タグ ✅ / sitemap ✅

```powershell
cd C:\Users\syunn\source\repos\goal-pilot-app
curl.exe -L -o gp.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/goal-pilot-app/0001-Add-robots-canonical-and-search-console-doc.patch"
git am gp.patch
git push origin main
```

Search Console → サイトマップ → `https://goalpilot.jp/sitemap.xml`

---

## 手順 4: busselect.jp — GA4 + DNS

**状態:** コード準備済み / DNS パーキング ❌

```powershell
cd C:\Users\syunn\source\repos\kousokubus-benri
curl.exe -L -o bs.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/kousokubus-benri/0001-Add-GA4-Search-Console-and-IndexNow.patch"
git am bs.patch
git push origin main
```

詳細: パッチ内 `docs/SETUP-ANALYTICS.md`
