# 個人開発サイト公開前チェックリスト（知多丸テンプレート）

> shudenhotel.jp / darekore.jp / goalpilot.jp / busselect.jp / machi-list.jp で実際に使った30項目です。

---

## SEO / メタタグ

- [ ] `<title>` にサービス名 + キャッチコピーが入っている
- [ ] `<meta name="description">` が120文字前後で書かれている
- [ ] `<link rel="canonical">` が本番URLを指している
- [ ] `<meta property="og:title">` が設定されている
- [ ] `<meta property="og:description">` が設定されている
- [ ] `<meta property="og:image">` が1200×630pxのOGP画像を指している
- [ ] `<meta property="og:type" content="website">` が設定されている
- [ ] `<meta name="twitter:card" content="summary_large_image">` が設定されている
- [ ] `<meta name="robots" content="index, follow">` が設定されている（noindexになっていないか確認）

## サイトマップ

- [ ] `/sitemap.xml` にアクセスして有効なXMLが返る
- [ ] サイトマップに主要ページが含まれている（トップ、ガイド、エリアLP等）
- [ ] `<lastmod>` に実際の更新日が入っている
- [ ] サイトマップURLが `robots.txt` の `Sitemap:` ディレクティブに記載されている

## robots.txt

- [ ] `/robots.txt` にアクセスして有効なファイルが返る
- [ ] `User-agent: *` と `Allow: /` が記述されている
- [ ] `Sitemap: https://[本番URL]/sitemap.xml` が記述されている

## Google Analytics 4

- [ ] GA4タグ（`gtag.js`）がHTMLに埋め込まれている
- [ ] GA4のリアルタイムレポートでページビューが計測されている
- [ ] 測定IDが正しい（`G-XXXXXXXXXX` 形式）

## Google Search Console

- [ ] サイトをSCに追加して所有権確認が完了している
- [ ] サイトマップを送信済み
- [ ] URL検索でページが「URLはGoogleに登録されています」と表示される（確認後）

## IndexNow

- [ ] IndexNowキーファイル（`[key].txt`）が `/[key].txt` でアクセスできる
- [ ] GitHub Actions workflow が push 時に IndexNow へ送信している
- [ ] Bing Webmaster Tools でインデックス状況を確認済み

## ファビコン / マニフェスト

- [ ] `/favicon.svg`（またはPNG）が表示される
- [ ] `/site.webmanifest` が有効なJSONを返す
- [ ] `<link rel="icon">` がHTMLに記述されている
- [ ] `<link rel="manifest">` がHTMLに記述されている

## パフォーマンス / 安全

- [ ] HTTPSが有効（Let's Encryptなど）
- [ ] モバイルでの表示崩れがない
- [ ] Lighthouse でパフォーマンススコアが70以上
- [ ] 外部APIキーが環境変数に分離されており、ソースコードにハードコードされていない

## アフィリエイト / 広告表記（適用する場合）

- [ ] `/affiliate-disclosure`（または相当ページ）が存在する
- [ ] フッターに広告・アフィリエイト表記へのリンクがある
- [ ] アフィリエイトリンクに `rel="nofollow sponsored noopener"` が付いている
