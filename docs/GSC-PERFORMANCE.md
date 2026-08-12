# Search Console パフォーマンス改善ログ

最終更新: **2026-08-12**

対象プロパティ（ライブ監査）:

| # | サイト | 重大Issue | 本ラウンドの対応 |
|---|--------|-----------|-----------------|
| 1 | shudenhotel.jp | canonical/sitemap が `http://`、`/search` が index、IndexNow key 404、HEAD 405 | コード修正（本リポジトリ） |
| 2 | busselect.jp | GSC/GA4 が日本語プレースホルダ、title 二重 `| NOLU` | 各リポジトリへ PR |
| 3 | darekore.jp | title が薄い、`/?q=` が index、sitemap 未エンコード | 各リポジトリへ PR |
| 4 | machi-list.jp | 空ページで robots 競合、ホームに YOUR_VC_* | 各リポジトリへ PR |
| 5 | goalpilot.jp | sitemap 欠落ルート、OG image なし、vercel robots 残骸 | 各リポジトリへ PR |

## Site 1 — shudenhotel.jp（完了コード）

- ForwardedHeaders で `X-Forwarded-Proto` を信頼
- `PUBLIC_BASE_URL=http://...` でも本番ホストは `https://` に正規化
- `www` → apex 301、HSTS
- `/search` を `noindex`、sitemap から除外、エラー時は 400/503
- IndexNow key を常時配信（デフォルト `shudenhotelindex2026`）
- 主要 HTML ルートで HEAD を許可

デプロイ後チェック:

```bash
curl -s https://shudenhotel.jp/ | grep canonical   # https://
curl -s https://shudenhotel.jp/sitemap.xml | grep -c 'search?'  # 0
curl -sI -X HEAD https://shudenhotel.jp/ | head -1  # 200
curl -sI https://shudenhotel.jp/shudenhotelindex2026.txt | head -1  # 200
```

## ユーザー側（エージェント不可）

- Search Console で各プロパティのサイトマップ再送信 / カバレッジ確認
- busselect: Site Creator の `NEXT_PUBLIC_GOOGLE_*` を実トークンへ差し替え（プレースホルダ文字を削除）
