# darekore.jp — Search Console 設定（手順 1）

GA4（`G-5P2QCWYG8V`）は反映済み。**Search Console タグだけ未反映**です。

## 方法 D: HTML ファイル（最も簡単・Secret 不要）★推奨

コード変更・Secret 登録なしで確認できます。

1. Search Console → プロパティ追加 `https://darekore.jp/`
2. 確認方法: **HTML ファイル**
3. `googleXXXXXXXX.html` をダウンロード
4. task-dashboard の `public/` にそのファイルを置く

```powershell
cd C:\Users\syunn\source\repos\task-dashboard
# ダウンロードした googleXXXX.html を public\ にコピー
git add public/google*.html
git commit -m "Add Search Console verification file"
git push origin main
```

5. 2〜3 分後、Search Console で **確認** ボタン

確認 URL 例: `https://darekore.jp/googleXXXXXXXX.html`

---

## 方法 A: GitHub Secret（HTML タグ方式）

### 1. Search Console でトークン取得

1. https://search.google.com/search-console → **プロパティを追加**
2. URL: `https://darekore.jp/`
3. 確認方法: **HTML タグ**
4. `content="..."` の値だけコピー

### 2. Secret 登録（PowerShell）

```powershell
# GitHub CLI が入っている場合
gh secret set VITE_GOOGLE_SITE_VERIFICATION -R syunnjack/task-dashboard -b"ここにcontentの値"

# またはブラウザで登録
# https://github.com/syunnjack/task-dashboard/settings/secrets/actions
```

### 3. 再デプロイ

```powershell
gh workflow run "Deploy to GitHub Pages" -R syunnjack/task-dashboard
```

2〜3 分後:

```powershell
$html = (Invoke-WebRequest -Uri "https://darekore.jp/" -UseBasicParsing).Content
"site-verification: $($html -match 'google-site-verification')"
```

---

## 方法 B: workflow_dispatch（Secret なしで1回だけ）

パッチ 0002 適用後:

```powershell
cd C:\Users\syunn\source\repos\task-dashboard
curl.exe -L -o sc.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/task-dashboard/0002-Add-workflow-dispatch-for-Search-Console-token.patch"
git am sc.patch
git push origin main

gh workflow run "Deploy to GitHub Pages" -R syunnjack/task-dashboard `
  -f google_site_verification="ここにcontentの値"
```

---

## 方法 C: DNS TXT（HTML タグ不要）

darekore.jp は Cloudflare 経由のため、HTML を変えずに確認できます。

1. Search Console → 確認方法 **ドメイン名プロバイダ** または **DNS レコード**
2. TXT レコード `google-site-verification=...` を Cloudflare DNS に追加
3. Search Console で **確認**

この方法なら GitHub 再デプロイは不要です。

---

## 確認後

Search Console → **サイトマップ** → `https://darekore.jp/sitemap.xml` を送信
