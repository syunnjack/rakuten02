# 知多丸ブランド 商品ラインナップ

BOOTH（`https://chitamaru.booth.pm`）で販売する商品データと適用手順です。

## 進め方（順番）

1. **`BOOTH-LISTINGS.md`** — 未出品の出品文・価格・納品チェック
2. **`STORE-COPY.md`** — ストア「個人おすすめ3入口」コピー（`store-page.tsx` 反映済み）
3. **`PHASE2-MONTHLY.md`** — 個人月額は「終電ホテル Pro ¥480」に一本化
4. **`REPOS.md`** — 新規78製品スキャフォールド＋GitHub一括push＋ストア反映
5. **`APPLY.md`** — `tsumiage-log` へパッチ適用

---

## 商品一覧

| # | 商品名 | BOOTH URL | 価格 | 形態 |
|---|--------|-----------|------|------|
| 1 | 楽天ROOMクリック改善ツール PRO版 | `chitamaru.booth.pm/items/rakuafi-tool` | ¥2,480 | 買い切り（Webアプリ） |
| 2 | 副業アフィリエイト 週次収支ログブック | `chitamaru.booth.pm/items/affiliate-logbook` | ¥580 | 買い切り（スプレッドシート） |
| 3 | 個人開発サイト公開キット | `chitamaru.booth.pm/items/site-launch-kit` | ¥980 | 買い切り（テンプレ+PDF） |

---

## 商品詳細

### 1. 楽天ROOMクリック改善ツール PRO版 — ¥2,480

**ターゲット**: 楽天ROOMを運用しているが、何を投稿すればいいか・なぜ報酬が出ないか分からない個人アフィリエイター

**ソースリポジトリ**: `syunnjack/rakuafi-tool`

**主な機能**:
- ROOM投稿文の自動生成（商品名・悩み・メリットを入力するだけ）
- 汎用リンク vs 商品別リンク の自動診断・警告
- 楽天アフィリエイトCSV取り込み + 収益グラフ
- 報酬ゼロ原因の自動言語化（クリック数・投稿充実度・ROOM運用量を診断）
- 訴求文のA/Bバリエーション生成（悩み訴求・価格訴求・根拠訴求）
- データはブラウザ内のみ（サーバー送信なし）

**購入特典**: 購入後に合言葉をお伝えします（合言葉でアプリにアクセス可能）

---

### 2. 副業アフィリエイト 週次収支ログブック — ¥580

**ターゲット**: 複数ASP掛け持ち中で「どのコンテンツが稼いでいるか」把握できていない副業アフィリエイター

**形態**: Googleスプレッドシートテンプレート（購入後コピー用URL提供）

**シートの構成**:
- 週次入力シート（ASP別 クリック・承認・報酬）
- 月別・ASP別 自動集計サマリー
- コンテンツ別貢献度シート（チャネル × 収益マッピング）
- 週次メモ欄（施策と結果を記録するスペース）

**購入特典**: GoogleスプレッドシートのコピーURL（自分のドライブに複製して自由に編集可能）

---

### 3. 個人開発サイト公開キット — ¥980

**ターゲット**: Next.js / Vite / 静的サイトを公開するたびに同じSEO設定を調べながらやっている個人開発者

**形態**: テンプレートファイル一式 + 手順書PDF（即ダウンロード）

**同梱内容**:
- `next.config.ts` canonical / robots / sitemap 設定スニペット
- `vite.config.js` + `index.html` メタタグテンプレート
- GitHub Actions workflow（GA4注入 + IndexNow自動送信）
- `robots.txt` / `sitemap.xml` 静的テンプレート
- 公開前チェックリスト PDF（30項目）

**実績**: `shudenhotel.jp` `darekore.jp` `goalpilot.jp` `busselect.jp` `machi-list.jp` で使用済みの実践テンプレート

---

## tsumiage-log ストアへの適用手順

`patches/chitamaru-products/store-videos-patch.json` の `products` 配列を
`tsumiage-log/app/data/store-videos.json` の `videos` 配列の先頭に追加します。

```bash
cd /path/to/tsumiage-log
node -e "
const fs = require('fs');
const patch = JSON.parse(fs.readFileSync('../rakuten02/patches/chitamaru-products/store-videos-patch.json', 'utf8'));
const store = JSON.parse(fs.readFileSync('app/data/store-videos.json', 'utf8'));
store.videos = [...patch.products, ...store.videos];
fs.writeFileSync('app/data/store-videos.json', JSON.stringify(store, null, 2) + '\n');
console.log('Updated:', store.videos.length, 'videos');
"
git add app/data/store-videos.json
git commit -m "Add 3 Chitamaru brand products to store"
git push
```

## rakuafi-tool の BOOTH URL 接続

`index.html` の `data-purchase-link` を持つ `<a>` 要素の `href="#"` を、BOOTH URLに更新します。

```bash
cd /path/to/rakuafi-tool
sed -i 's|href="#" data-purchase-link|href="https://chitamaru.booth.pm/items/rakuafi-tool" data-purchase-link|g' index.html
git add index.html
git commit -m "Connect BOOTH purchase link for rakuafi-tool"
git push
```

## BOOTH出品手順（商品ごと）

### 商品1: 楽天ROOMクリック改善ツール

1. BOOTH管理画面 → 新規商品作成
2. URL: `https://chitamaru.booth.pm/items/rakuafi-tool`
3. 種別: デジタルコンテンツ（テキスト形式の合言葉）
4. 価格: ¥2,480
5. 説明文: `store-videos-patch.json` の `description` を使用
6. 購入者へのメッセージ: 「ご購入ありがとうございます。アクセス用の合言葉は **[合言葉]** です。https://syunnjack.github.io/rakuafi-tool/ を開き、合言葉を入力してください。」

### 商品2: 副業アフィリエイト 週次収支ログブック

1. BOOTH管理画面 → 新規商品作成
2. URL: `https://chitamaru.booth.pm/items/affiliate-logbook`
3. 種別: デジタルコンテンツ（PDF or テキストでスプレッドシートURL）
4. 価格: ¥580
5. 購入者へのメッセージ: 「Googleスプレッドシートのコピー用URL: [URL]」

### 商品3: 個人開発サイト公開キット

1. BOOTH管理画面 → 新規商品作成
2. URL: `https://chitamaru.booth.pm/items/site-launch-kit`
3. 種別: デジタルコンテンツ（ZIPファイル）
4. 価格: ¥980
5. ZIPにテンプレートファイル一式 + チェックリストPDFを同梱
