# 全サイト ロールアウト手順（1→4）

最終確認: 2026-08-05

## 現状スナップショット

| サイト | 公開 | GA4 | GSC | 次のアクション |
|--------|------|-----|-----|----------------|
| shudenhotel.jp | ✅ | ✅ | ✅ | 完了 |
| darekore.jp | ✅ | ✅ | ❌ | **HTML ファイルで Search Console 確認** |
| goalpilot.jp | ✅ | ✅ | ✅ | Search Console でサイトマップ送信 |
| machi-list.jp | ❌ DNS | ❓ | ❓ | **お名前.com DNS 変更** |
| busselect.jp | ❌ DNS | ❌ | ❌ | パッチ適用 + DNS |

一括確認:

```powershell
.\scripts\site-analytics\check-sites.ps1
```

---

## 手順 1: darekore.jp — Search Console（★ HTML ファイル方式が最短）

Secret 不要。`public/googleXXXX.html` を push するだけ。

```powershell
cd C:\Users\syunn\source\repos\task-dashboard
# Search Console からダウンロードした googleXXXX.html を public\ に配置
git add public/google*.html
git commit -m "Add Search Console verification file"
git push origin main
```

Search Console → 確認 → サイトマップ `https://darekore.jp/sitemap.xml` 送信

詳細: `patches/task-dashboard/SETUP-SEARCH-CONSOLE.md`

---

## 手順 2: machi-list.jp — 独自ドメイン公開

**最短:** GitHub Pages + DNS（デプロイは既に成功済み）

```powershell
# お名前.com: 150.95.255.38 削除 → GitHub Pages A レコード 4 つ追加
# 詳細: patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md
```

**Render 移行:** パッチ 0002 + `DEPLOY-CUSTOM-DOMAIN.md`

Secrets 設定後 Re-run:

| Secret | 値 |
|--------|-----|
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 |
| `GOOGLE_SITE_VERIFICATION` | GSC content |
| `INDEXNOW_KEY` | `machilistindex2026` |

---

## 手順 3: goalpilot.jp — Search Console サイトマップ

タグは live。ブラウザで:

1. https://search.google.com/search-console
2. `https://goalpilot.jp/` → 所有権確認（HTML タグ）
3. サイトマップ → `https://goalpilot.jp/sitemap.xml`

任意（robots/canonical 改善）:

```powershell
cd C:\Users\syunn\source\repos\goal-pilot-app
curl.exe -L -o gp.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/goal-pilot-app/0001-Add-robots-canonical-and-search-console-doc.patch"
git am gp.patch
git push origin main
```

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
cd C:\Users\syunn\source\repos\rakuten02
.\scripts\site-analytics\apply-patches.ps1
```
