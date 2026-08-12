# 終電ホテル

終電後、飲み会後、ライブ後、急な出張延長などで「今夜近くに泊まれるホテル」を探すための楽天トラベル空室検索アプリです。

本番ドメインは `https://shudenhotel.jp/` です。

## 構成

- `rakuten02`: Windows Formsアプリ版
- `rakuten02.Core`: 楽天トラベル検索とジオコーディングの共通ロジック
- `rakuten02.Web`: ASP.NET Core Web版

## Web版の起動

楽天APIの `applicationId`、`accessKey`、任意の `affiliateId`、本番URLを環境変数で設定します。

```powershell
$env:RAKUTEN_APPLICATION_ID="your_application_id"
$env:RAKUTEN_AFFILIATE_ID="your_affiliate_id"
$env:RAKUTEN_ACCESS_KEY="your_access_key"
$env:RAKUTEN_ALLOWED_ORIGIN="https://shudenhotel.jp"
$env:PUBLIC_BASE_URL="https://shudenhotel.jp"
$env:GOOGLE_ANALYTICS_MEASUREMENT_ID="G-XXXXXXXXXX"
dotnet run --project rakuten02.Web
```

`PUBLIC_BASE_URL` はcanonical、OGP URL、sitemap、llms.txtに使われます。
`GOOGLE_ANALYTICS_MEASUREMENT_ID` はGoogle Analytics 4の測定ID（`G-` で始まる文字列）です。未設定の場合は計測タグを出力しません。

## アプリ版の起動

Windowsアプリ版も楽天APIキーを環境変数から読み込みます。

```powershell
$env:RAKUTEN_APPLICATION_ID="your_application_id"
$env:RAKUTEN_AFFILIATE_ID="your_affiliate_id"
$env:RAKUTEN_ACCESS_KEY="your_access_key"
dotnet run --project rakuten02
```

既に公開リポジトリへ古い `applicationId` をpushしている場合は、楽天ウェブサービス側で新しいアプリIDを発行し、古いIDを使わない運用に切り替えることをおすすめします。

## 楽天アフィリエイト対応

Web版では楽天APIリクエストに `affiliateId` を渡します。予約リンクは次の優先順位で出力します。

1. `affiliateUrl`
2. `reserveUrl`
3. `hotelAffiliateUrl`
4. `hotelInformationUrl`
5. `planListUrl`

リンクには `rel="nofollow sponsored noopener"` を付け、広告・アフィリエイトリンクとして扱われるようにしています。

## キャッシュ

外部APIへの負荷を抑えるため、Web版はアプリ内メモリに短時間キャッシュします。

- 地名・駅名の緯度経度: 14日
- 楽天トラベル空室検索結果: 10分

空室情報は変動するため、予約前には必ずリンク先の楽天トラベルで最新情報を確認してください。

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
  -e RAKUTEN_ACCESS_KEY="your_access_key" `
  -e RAKUTEN_ALLOWED_ORIGIN="https://shudenhotel.jp" `
  -e PUBLIC_BASE_URL="https://shudenhotel.jp" `
  shudenhotel
```

Renderで公開する場合は `render.yaml` をBlueprintとして読み込み、`RAKUTEN_APPLICATION_ID`、`RAKUTEN_ACCESS_KEY`、任意の `RAKUTEN_AFFILIATE_ID` を環境変数に設定します。

## 初期訴求

- 終電逃した ホテル
- 今夜 泊まれる ホテル 近く
- ライブ後 泊まれる ホテル
- 新宿駅 周辺 空室 ホテル
- 渋谷駅 終電逃した ホテル

駅名・会場名別の検索URLをX、TikTok、ブログ、YouTube Shortsの着地点にすると展開しやすくなります。

## 開発支援（BOOTH）

<!-- booth-support:readme -->

有料ツール・特典コンテンツは [BOOTH（chitamaru）](https://chitamaru.booth.pm/) で販売しています。応援購入いただけると開発の継続に役立ちます。

Web版フッターにも BOOTH への導線を表示します。ショップURLは環境変数 `BOOTH_SHOP_URL` で変更できます（未設定時は `https://chitamaru.booth.pm`）。

## 公開前チェック

- `/affiliate-disclosure` の広告・アフィリエイト表記を確認
- `/privacy` のプライバシーポリシーを確認
- `/terms` の利用規約を確認
- `/sitemap.xml` に主要ページが含まれることを確認
- `/robots.txt` のSitemap URLが `https://shudenhotel.jp/sitemap.xml` になっていることを確認
- `/og-image.svg` と `/favicon.svg` が表示されることを確認
- `/areas/*`, `/venues/*`, `/guides/*` のLPが200で返ることを確認
