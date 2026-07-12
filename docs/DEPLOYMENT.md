# shudenhotel.jp 公開手順

## 必須環境変数

本番環境では次を設定します。

```text
RAKUTEN_APPLICATION_ID=your_application_id
RAKUTEN_AFFILIATE_ID=your_affiliate_id
PUBLIC_BASE_URL=https://shudenhotel.jp
ASPNETCORE_ENVIRONMENT=Production
```

`PUBLIC_BASE_URL` はcanonical、OGP URL、robots.txt、sitemap.xml、llms.txtで使われます。

## Dockerで起動

```powershell
docker build -t shudenhotel .
docker run --rm -p 8080:8080 `
  -e RAKUTEN_APPLICATION_ID="your_application_id" `
  -e RAKUTEN_AFFILIATE_ID="your_affiliate_id" `
  -e PUBLIC_BASE_URL="https://shudenhotel.jp" `
  shudenhotel
```

確認URL:

- `http://localhost:8080/`
- `http://localhost:8080/healthz`
- `http://localhost:8080/robots.txt`
- `http://localhost:8080/sitemap.xml`
- `http://localhost:8080/llms.txt`

## Renderで公開

このリポジトリには `render.yaml` を含めています。GitHubにpushした後、RenderでBlueprintとして読み込むとWeb Serviceを作れます。

1. RenderでNew Blueprintを選択
2. GitHubの `syunnjack/rakuten02` を選択
3. `render.yaml` を読み込む
4. 環境変数に `RAKUTEN_APPLICATION_ID` と `RAKUTEN_AFFILIATE_ID` を設定
5. デプロイ完了後、RenderのCustom Domainに `shudenhotel.jp` を追加
6. Renderが表示するDNS設定を、お名前.com側に登録

Render側で `PUBLIC_BASE_URL=https://shudenhotel.jp` は設定済みです。

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
- `https://shudenhotel.jp/guides/missed-last-train`
- `https://shudenhotel.jp/areas/shinjuku-last-train`
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
