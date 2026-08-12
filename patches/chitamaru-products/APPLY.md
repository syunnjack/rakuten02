# tsumiage-log への適用手順

このフォルダのファイルを `syunnjack/tsumiage-log` リポジトリに適用します。

## 対象ファイルと配置先

| このフォルダ | tsumiage-log での配置先 |
|-------------|------------------------|
| `GlobalNav.tsx` | `app/components/GlobalNav.tsx` |
| `globals.css` | `app/globals.css` |
| `store-page.tsx` | `app/store/page.tsx` |
| `store-videos.json` | `app/data/store-videos.json` |

## ワンライナーで適用

```bash
cd /path/to/tsumiage-log
PATCH_DIR="/path/to/rakuten02/patches/chitamaru-products"

cp "$PATCH_DIR/GlobalNav.tsx"    app/components/GlobalNav.tsx
cp "$PATCH_DIR/globals.css"      app/globals.css
cp "$PATCH_DIR/store-page.tsx"   app/store/page.tsx
cp "$PATCH_DIR/store-videos.json" app/data/store-videos.json

git add app/components/GlobalNav.tsx app/globals.css app/store/page.tsx app/data/store-videos.json
git commit -m "Redesign store: nav 9 items, store button, reorder sections, add 5 products"
git push
```

## 変更内容サマリー

### GlobalNav.tsx（13項目→9項目 + 🛒ストアボタン）

**削除**: このブログについて / 見積依頼 / お問い合わせ / お気に入り動画（→フッターへ）
**変更**: 「サービス」+「見積依頼」→「相談する」 / 「販売プラットフォーム」→ヘッダー右端の「🛒 ストア」ボタン

**Before**: 13項目を横スクロール、「販売プラットフォーム」が末尾に埋もれる
**After**: 8項目のメインナビ + 右端に「🛒 ストア」（アンバー色ボタン）+ 「GitHub ↗」

### globals.css

追加CSS:
- `.global-actions` — ストアとGitHubをまとめるフレックスコンテナ
- `.global-store` — アンバー色の購入促進ボタン（モバイルでは非表示）
- `.store-feature-list` — 商品機能リストのスタイル
- `.store-coming-soon` — BOOTH出品準備中の表示スタイル
- `.store-products-section` — ソフトウェア製品セクションのパディング

### store/page.tsx（セクション順序変更 + 商品5件追加）

**Before**: PPV動画 → 無料紹介動画 → ソフトウェア製品
**After**: ソフトウェア製品（5件）→ PPV動画 → 無料紹介動画

ソフトウェア製品として新規追加:
1. SEO管理ダッシュボード Pro ¥3,800（既存）
2. 時短レシピ支援アプリ ¥580（既存）
3. 楽天ROOMクリック改善ツール PRO版 ¥2,480（新規）
4. 副業アフィリエイト 週次収支ログブック ¥580（新規）
5. 個人開発サイト公開キット ¥980（新規）

ページタイトルを「販売プラットフォーム」→「ストア」に変更
ページdescriptionを収益商品中心に更新

### store-videos.json

- `hobby-log-special` の `boothUrl` を `https://chitamaru.booth.pm/items/hobby-log-special` に設定
  （BOOTH出品後に本URLへ更新してください）

## BOOTH出品が必要な商品（手動作業）

| 商品 | BOOTH URL（予定） | 状態 |
|------|----------|------|
| SEO管理ダッシュボード Pro | `/items/seo-dashboard-pro` | 出品済み |
| 時短レシピ支援アプリ | `/items/jitan-recipe` | 出品済み |
| 楽天ROOMクリック改善ツール | `/items/rakuafi-tool` | **出品が必要** |
| 副業アフィリエイト 週次収支ログブック | `/items/affiliate-logbook` | **出品が必要** |
| 個人開発サイト公開キット | `/items/site-launch-kit` | **出品が必要** |
| 推し活・趣味記録【PPV特別版】 | `/items/hobby-log-special` | **出品が必要** |
