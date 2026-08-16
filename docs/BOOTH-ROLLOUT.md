# BOOTH 収入導線ロールアウト

全リポジトリに BOOTH ショップへの導線を追加する手順です。

## 設定

- ショップURL: `https://chitamaru.booth.pm`
- 設定ファイル: `scripts/booth-rollout/booth.config.json`

## 単一リポジトリへ適用

```bash
./scripts/booth-rollout/apply-booth-support.sh /path/to/repo
```

追加内容:

1. `README.md` に「開発支援（BOOTH）」セクション（マーカー `<!-- booth-support:readme -->` 付き）
2. ルート付近の `index.html` にフッターリンク（マーカー `<!-- booth-support:footer -->` 付き）

## 全リポジトリ一括適用

### ローカル（推奨）

自分の GitHub 認証情報で実行します。

```bash
export GITHUB_OWNER=syunnjack
./scripts/booth-rollout/rollout-all-repos.sh
```

### GitHub Actions

1. リポジトリ Secret に `BOOTH_ROLLOUT_PAT` を登録（`repo` スコープ付き classic PAT）
2. Actions → **BOOTH rollout** → Run workflow

各リポジトリに `cursor/booth-revenue-funnel-80c6` ブランチが push されます。マージはリポジトリごとに PR を作成して確認してください。

- 既に BOOTH セクションがあるリポジトリはスキップ

## rakuten02（終電ホテル）固有

Web版は README 以外に次も実装済み:

- フッター「開発支援（BOOTH）」リンク
- `/affiliate-disclosure` の BOOTH 表記
- `llms.txt` の Support セクション
- 環境変数 `BOOTH_SHOP_URL`（未設定時は `https://chitamaru.booth.pm`）
