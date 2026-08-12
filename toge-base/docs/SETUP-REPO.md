# toge-base リポジトリ公開手順

このディレクトリは `wangan-base`（湾岸）と同型の、イニシャルD向けコミュニティサイト本体です。
`rakuten02` 配下に同梱しているため、単体リポジトリとして切り出す場合は次を実行します。

## 1. GitHub リポジトリ作成

GitHub 上で `syunnjack/toge-base` を新規作成（空リポジトリ）。

## 2. 単体リポジトリとして push

```powershell
cd C:\Users\syunn\rakuten02\toge-base
git init
git add .
git commit -m "Initial commit: TOGE BASE Initial D community portal"
git branch -M main
git remote add origin https://github.com/syunnjack/toge-base.git
git push -u origin main
```

## 3. GitHub Pages

1. Settings → Pages → Source: GitHub Actions
2. `Deploy to GitHub Pages` ワークフローを実行
3. Custom domain に `togepass.jp`（`public/CNAME` 済み）

## 4. DNS

お名前.com などで `togepass.jp` の A / CNAME を GitHub Pages 向けに設定。

## 5. 解析・Search Console

- Actions Secrets またはビルド時に `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Search Console で所有権確認 → `https://togepass.jp/sitemap.xml` 送信

## 6. 設置店舗データの更新

ALL.Net から全国店舗を再取得:

```bash
cd toge-base
npm run arcades:refresh
npm run build:pages
```

更新後は `public/sitemap.xml` の `lastmod` も必要なら合わせてください。
