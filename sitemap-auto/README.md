# sitemap-auto

記事やページが更新されたとき、**サイトマップの差分を検知**して  
**Google Search Console** と **IndexNow（Bing 等）** へ自動送信するツールです。

Google の旧 ping エンドポイントは廃止済みのため、Search Console API（`sitemaps.submit`）を使います。

## できること

- 公開中の `sitemap.xml` を取得し、ハッシュ / 新規 URL / `lastmod` 変化を検知
- 変化時（または `--force`）に GSC へサイトマップ再送信
- 変化した URL を IndexNow で通知
- GitHub Actions の定期実行・手動実行・`repository_dispatch` 連携
- 各サイトリポジトリから呼べる Composite Action

## セットアップ（このリポジトリをハブにする場合）

1. `sites.example.json` を `sites.json` にコピーし、対象サイトを編集
2. Google Cloud でサービスアカウントを作成し、**Search Console API** を有効化
3. サービスアカウントのメールを、各 GSC プロパティのユーザーに追加（権限: 所有者推奨）
4. GitHub Secrets を設定
   - `GSC_SERVICE_ACCOUNT_JSON` … サービスアカウント JSON（生 JSON または base64）
   - `INDEXNOW_KEY` … 任意（サイトごとの `indexNowKey` でも可）
5. Actions の **Sitemap Auto Submit** を有効化（毎時 + 手動）

```bash
cp sites.example.json sites.json
cp .env.example .env
npm install
npm run check          # 差分確認のみ
npm start -- --dry-run # 送信シミュレーション
npm start              # 変更があれば送信
npm run submit         # 強制送信
```

## CLI

```bash
npx sitemap-auto run [--force] [--dry-run] [--wait] [--site <id>] [--config sites.json]
npx sitemap-auto check [--site <id>]
npx sitemap-auto submit --force
npx sitemap-auto wait --url https://example.com/sitemap.xml
```

## サイト側リポジトリからの呼び出し

デプロイ後にハブへ通知する例:

```yaml
# .github/workflows/notify-sitemap-auto.yml
name: Notify sitemap-auto
on:
  push:
    branches: [main]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: repository_dispatch
        env:
          GH_TOKEN: ${{ secrets.SITEMAP_AUTO_DISPATCH_TOKEN }}
        run: |
          gh api repos/syunnjack/sitemap-auto/dispatches \
            -f event_type=content-published \
            -f client_payload[site]=darekore
```

または Composite Action を直接使う:

```yaml
- uses: syunnjack/sitemap-auto@main
  with:
    config: sites.json
    site: darekore
    wait: "true"
    gsc_service_account_json: ${{ secrets.GSC_SERVICE_ACCOUNT_JSON }}
```

## sites.json の例

```json
{
  "sites": [
    {
      "id": "darekore",
      "name": "ダレコレ",
      "siteUrl": "https://darekore.jp/",
      "sitemapUrl": "https://darekore.jp/sitemap.xml",
      "gscProperty": "https://darekore.jp/",
      "indexNowKey": "darekoreindex2026",
      "indexNowKeyLocation": "https://darekore.jp/darekoreindex2026.txt",
      "enabled": true
    }
  ]
}
```

`gscProperty` は URL プレフィックス（`https://example.com/`）かドメインプロパティ（`sc-domain:example.com`）を指定します。

## 状態ファイル

差分検知の状態は `.sitemap-auto/state.json` に保存します。  
Actions では cache で引き継ぎます。

## ライセンス

MIT
