# sitemap-auto を単体リポジトリへ公開する

このディレクトリは `rakuten02/sitemap-auto` に同梱されています。  
空リポジトリ [syunnjack/sitemap-auto](https://github.com/syunnjack/sitemap-auto) へ初回プッシュする手順です。

## Windows / macOS / Linux

```bash
# rakuten02 を最新化
cd /path/to/rakuten02
git pull

# 単体リポジトリへミラー
cd sitemap-auto
git init
git add -A
git commit -m "Initial commit: sitemap-auto GSC/IndexNow submitter"
git branch -M main
git remote add origin https://github.com/syunnjack/sitemap-auto.git
git push -u origin main
```

## GitHub Secrets（sitemap-auto 側）

| Secret | 内容 |
|--------|------|
| `GSC_SERVICE_ACCOUNT_JSON` | Search Console API 用サービスアカウント JSON（生 or base64） |
| `INDEXNOW_KEY` | 任意。サイトごとの `indexNowKey` でも可 |

サービスアカウントのメールを、各 Search Console プロパティのユーザーに追加してください（所有者推奨）。

## 動作確認

```bash
npm install
npm test
npm run check -- --site darekore
npm start -- --dry-run
```
