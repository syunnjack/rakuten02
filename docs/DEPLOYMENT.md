# shudenhotel.jp 公開手順

## 必須環境変数

本番環境では次を設定します。

```text
RAKUTEN_APPLICATION_ID=your_application_id
RAKUTEN_AFFILIATE_ID=your_affiliate_id
RAKUTEN_ACCESS_KEY=your_access_key
RAKUTEN_ALLOWED_ORIGIN=https://shudenhotel.jp
PUBLIC_BASE_URL=https://shudenhotel.jp
ASPNETCORE_ENVIRONMENT=Production
```

`PUBLIC_BASE_URL` はcanonical、OGP URL、robots.txt、sitemap.xml、llms.txtで使われます。

## APIタイムアウトとキャッシュ

Web版は外部APIの応答待ちで詰まらないよう、楽天トラベルAPIとNominatimへのHTTPリクエストを10秒でタイムアウトします。

また、外部APIへの負荷を抑えるため、アプリ内メモリで次のキャッシュを行います。

- 地名・駅名の緯度経度: 14日
- 楽天トラベル空室検索結果: 10分

Renderのインスタンス再起動時にメモリキャッシュは消えます。

## Dockerで起動

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

確認URL:

- `http://localhost:8080/`
- `http://localhost:8080/healthz`
- `http://localhost:8080/affiliate-disclosure`
- `http://localhost:8080/privacy`
- `http://localhost:8080/terms`
- `http://localhost:8080/og-image.svg`
- `http://localhost:8080/favicon.svg`
- `http://localhost:8080/robots.txt`
- `http://localhost:8080/sitemap.xml`
- `http://localhost:8080/llms.txt`

## Renderで公開

このリポジトリには `render.yaml` を含めています。GitHubにpushした後、RenderでBlueprintとして読み込むとWeb Serviceを作れます。

1. RenderでNew Blueprintを選択
2. GitHubの `syunnjack/rakuten02` を選択
3. `render.yaml` を読み込む
4. 環境変数に `RAKUTEN_APPLICATION_ID`、`RAKUTEN_ACCESS_KEY`、任意の `RAKUTEN_AFFILIATE_ID` を設定
5. デプロイ完了後、Custom Domainsに `shudenhotel.jp` が追加されていることを確認
6. Renderが表示するDNS設定を、お名前.com側に登録

Render側で `PUBLIC_BASE_URL=https://shudenhotel.jp` と `RAKUTEN_ALLOWED_ORIGIN=https://shudenhotel.jp` は設定済みです。

`render.yaml` の `domains` にルートドメインを定義しているため、Renderは `www.shudenhotel.jp` も自動追加し、ルートドメインへリダイレクトします。

お名前.comでは、初期パーキング用Aレコード（`150.95.255.38`）を削除し、次を登録します。

```text
ホスト名: @
TYPE: A
VALUE: 216.24.57.1
TTL: 3600

ホスト名: www
TYPE: CNAME
VALUE: Renderの画面に表示された <サービス名>.onrender.com
TTL: 3600
```

競合するA/CNAMEレコードやAAAAレコードがあれば削除してください。DNS反映後にRenderが検証し、TLS証明書を自動発行します。

## お名前.com DNS

ホスティング先が決まったら、DNSは次のどちらかで設定します。

### Aレコード

固定IPがある場合:

```text
ホスト名: @
TYPE: A
VALUE: ホスティング先のIPv4
TTL: 3600
```

`www` も使う場合:

```text
ホスト名: www
TYPE: CNAME
VALUE: shudenhotel.jp
TTL: 3600
```

### CNAME

Vercel、Render、Fly.io、Azure App Serviceなどで指定ホスト名が出る場合:

```text
ホスト名: @ または www
TYPE: CNAME
VALUE: ホスティング先から指定されたホスト名
TTL: 3600
```

ルートドメイン `@` にCNAMEを置けないサービスもあるため、その場合はホスティング先の案内に従ってALIAS/ANAME相当の設定、またはAレコードを使います。

## 公開後チェック

```powershell
curl https://shudenhotel.jp/healthz
curl https://shudenhotel.jp/robots.txt
curl https://shudenhotel.jp/sitemap.xml
curl https://shudenhotel.jp/llms.txt
```

ブラウザで確認:

- `https://shudenhotel.jp/`
- `https://shudenhotel.jp/affiliate-disclosure`
- `https://shudenhotel.jp/privacy`
- `https://shudenhotel.jp/terms`
- `https://shudenhotel.jp/og-image.svg`
- `https://shudenhotel.jp/favicon.svg`
- `https://shudenhotel.jp/guides/missed-last-train`
- `https://shudenhotel.jp/areas/shinjuku-last-train`
- `https://shudenhotel.jp/areas/tokyo-station-tonight-hotel`
- `https://shudenhotel.jp/venues/yokohama-arena-after-live`
- `https://shudenhotel.jp/guides/taxi-or-hotel`
- `https://shudenhotel.jp/search?place=%E6%96%B0%E5%AE%BF%E9%A7%85&radius=1.0`

## Search Console

1. `https://shudenhotel.jp/` をプロパティ追加
2. DNS TXTで所有権確認
3. `https://shudenhotel.jp/sitemap.xml` を送信
4. トップページと主要LPのURL検査を実行
5. インデックス登録をリクエスト

## 初期LP

- `/guides/missed-last-train`
- `/areas/shinjuku-last-train`
- `/areas/shibuya-tonight-hotel`
- `/venues/tokyo-dome-after-live`
- `/areas/tokyo-station-tonight-hotel`
- `/areas/yokohama-last-train`
- `/areas/ikebukuro-last-train`
- `/areas/ueno-tonight-hotel`
- `/areas/shinagawa-business-hotel`
- `/areas/namba-last-train`
- `/venues/saitama-super-arena-after-live`
- `/venues/yokohama-arena-after-live`
- `/venues/makuhari-messe-after-event`
- `/guides/taxi-or-hotel`
- `/guides/after-live-hotel`
- `/guides/nomikai-after-hotel`
