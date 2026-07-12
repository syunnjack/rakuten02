# SEO/AIO/LLMO展開メモ

## ドメイン

- 本番URL: `https://shudenhotel.jp/`
- サービス名: 終電ホテル
- 指名検索の狙い: `終電ホテル`、`shuden hotel`、`shudenhotel`

## 基本方針

GoogleのAI Overview / AI Mode向けに特別な隠し最適化を狙うより、通常SEOの基礎を強くします。

- インデックス可能なHTMLを返す
- 重要情報を画像ではなく本文テキストにする
- title、description、canonicalを検索意図ごとに分ける
- JSON-LDは画面上の表示内容と一致させる
- アフィリエイトリンクは `rel="nofollow sponsored noopener"` を付ける

## 狙う検索意図

### 緊急系

- 終電逃した ホテル
- 今夜 泊まれる ホテル 近く
- 今日 空室 ホテル 駅近
- タクシーより安い ホテル

### 地名系

- 新宿駅 終電逃した ホテル
- 渋谷駅 今夜 泊まれる ホテル
- 東京駅 周辺 空室 ホテル
- 横浜駅 終電後 ホテル

### イベント系

- ライブ後 泊まれる ホテル
- フェス後 ホテル 空室
- 終演後 帰れない ホテル
- 遠征 ホテル 当日

## Webページ展開案

現状は `/search?place=...` で検索できます。次の段階では、静的な着地ページを増やすとSEOが強くなります。

- `/areas/shinjuku-last-train`
- `/areas/shibuya-tonight-hotel`
- `/venues/tokyo-dome-after-live`
- `/guides/missed-last-train`

各ページには、検索フォームだけでなく「どう探すか」「相場」「徒歩圏」「朝まで過ごす代替案」を本文で入れます。

## SNSでバズらせる切り口

- 「終電逃した瞬間に開くサイト」
- 「飲み会後、現在地から1km以内の空室だけ見る」
- 「ライブ終演後に、駅周辺のホテルを一発検索」
- 「タクシー代とホテル代、どっちが安い？」

投稿には駅名別URLを添えます。例:

```text
終電逃したらこれ開いて。
新宿駅から1km以内で、今夜泊まれるホテルだけ探せる。
https://shudenhotel.jp/search?place=%E6%96%B0%E5%AE%BF%E9%A7%85&radius=1.0
```

## DNS/公開後チェック

1. `https://shudenhotel.jp/` が200で返る
2. `https://shudenhotel.jp/robots.txt` にsitemapが出る
3. `https://shudenhotel.jp/sitemap.xml` のURLが `https://shudenhotel.jp` になる
4. `https://shudenhotel.jp/llms.txt` が読める
5. Search Consoleに `https://shudenhotel.jp/` を登録する
6. 楽天アフィリエイトのクリックURLが `affiliateUrl` 優先で出ているか確認する

## アフィリエイト確認

1. `RAKUTEN_AFFILIATE_ID` を設定してWeb版を起動する
2. `/search?place=新宿駅&radius=1.0` を開く
3. 「価格で見る」リンクのURLが楽天のアフィリエイト対応URLになっているか確認する
4. 本番環境でも同じ環境変数を設定する
