# 終電ホテル

終電後、飲み会後、ライブ後、急な出張延長などで「今夜近くに泊まれるホテル」を探すための楽天トラベル空室検索アプリです。

本番ドメインは `https://shudenhotel.jp/` です。

## 構成

- `rakuten02`: Windows Formsアプリ版
- `rakuten02.Core`: 楽天トラベル検索とジオコーディングの共通ロジック
- `rakuten02.Web`: ASP.NET Core Web版

## Web版の起動

楽天APIの `applicationId` と `affiliateId`、本番URLを環境変数で設定します。

```powershell
$env:RAKUTEN_APPLICATION_ID="your_application_id"
$env:RAKUTEN_AFFILIATE_ID="your_affiliate_id"
$env:PUBLIC_BASE_URL="https://shudenhotel.jp"
dotnet run --project rakuten02.Web
```

`PUBLIC_BASE_URL` はcanonical、OGP URL、sitemap、llms.txtに使われます。

## 楽天アフィリエイト対応

Web版では楽天APIリクエストに `affiliateId` を渡します。予約リンクは次の優先順位で出力します。

1. `affiliateUrl`
2. `reserveUrl`
3. `hotelAffiliateUrl`
4. `hotelInformationUrl`
5. `planListUrl`

リンクには `rel="nofollow sponsored noopener"` を付け、広告・アフィリエイトリンクとして扱われるようにしています。

## SEO/AIO/LLMO対応

Web版には次を実装しています。

- トップページのtitle、description、canonical、OGP、Twitter Card
- 検索結果ページのサーバーレンダリング
- `WebApplication` / `ItemList` のJSON-LD
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- 広告・アフィリエイト表記
- プライバシーポリシー
- 利用規約

詳細は [docs/SEO-AIO-LLMO.md](docs/SEO-AIO-LLMO.md) を参照してください。

## デプロイ

DockerまたはRenderでWeb版を公開できます。詳細は [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) を参照してください。

```powershell
docker build -t shudenhotel .
docker run --rm -p 8080:8080 `
  -e RAKUTEN_APPLICATION_ID="your_application_id" `
  -e RAKUTEN_AFFILIATE_ID="your_affiliate_id" `
  -e PUBLIC_BASE_URL="https://shudenhotel.jp" `
  shudenhotel
```

Renderで公開する場合は `render.yaml` をBlueprintとして読み込み、`RAKUTEN_APPLICATION_ID` と `RAKUTEN_AFFILIATE_ID` を環境変数に設定します。

## 初期訴求

- 終電逃した ホテル
- 今夜 泊まれる ホテル 近く
- ライブ後 泊まれる ホテル
- 新宿駅 周辺 空室 ホテル
- 渋谷駅 終電逃した ホテル

駅名・会場名別の検索URLをX、TikTok、ブログ、YouTube Shortsの着地点にすると展開しやすくなります。

## 公開前チェック

- `/affiliate-disclosure` の広告・アフィリエイト表記を確認
- `/privacy` のプライバシーポリシーを確認
- `/terms` の利用規約を確認
- `/sitemap.xml` に主要ページが含まれることを確認
- `/robots.txt` のSitemap URLが `https://shudenhotel.jp/sitemap.xml` になっていることを確認
