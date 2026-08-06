# ランキングサイト一覧（AI 作成・未デプロイ）

2026-08-05〜06 に作成された FANZA/DMM アフィリエイト系ランキングサイト群。
2026-08-06 に41リポジトリ全件をクローンしてスタック横断調査を実施（詳細: 本ファイル末尾の生データ参照）。

## 現状

- GitHub 上に **41 リポジトリ**（`*-ranking` suffix）
- **未デプロイ:** `https://syunnjack.github.io/{repo}/` → 404
- **デプロイ設定ゼロ:** 41件すべてで `CNAME` / `vercel.json` / `wrangler.toml` / GitHub Pages 用ワークフローのいずれも未設置（コードのみの状態）
- **独自ドメイン:** 未割当（カスタムドメイン rollout 対象外）

## スタック内訳（41件・実測）

| 種別 | 件数 | 技術 | 代表例 |
|------|-----:|------|--------|
| PHP（Laravel） | 26 | `composer.json` + `artisan`、Vite+Tailwind | netorare-ranking, gyaru-ranking, duga-video-ranking, adult-comic-ranking |
| Astro（SSR） | 15 | Astro 7、`@astrojs/vercel` アダプタ組み込み済み（`output: 'server'`） | play-withca-ranking, play-withladies-ranking, gyakyu-netorare-ranking, ahegao-ranking |

> 旧版ドキュメントは `duga-video-ranking` をAstro例として記載していましたが誤りで、実際はLaravel（PHP）です。上表が実測に基づく正しい分類です。

<details>
<summary>PHP（Laravel）26件</summary>

duga-video-ranking, play-with-roundgirl-ranking, play-with-promotionalgirl-ranking,
playincar-ranking, play-inplane-ranking, play-inbus-ranking, neback-ranking,
mesuochi-ranking, hard-piston-ranking, back-piston-ranking, shibari-ranking,
netorare-ranking, tachiback-ranking, kosupure-ranking, adult-comic-ranking,
adult-novel-ranking, bl-tl-novel-ranking, bl-tl-doujin-ranking, shirouto-ranking,
taimenzai-ranking, mesuiki-ranking, kyonyu-ranking, mature-genre-ranking,
adult-figure-ranking, gravure-photo-ranking, r18-anime-ranking, cross-asp-ranking

（27件表記されているように見えますが `cross-asp-ranking` を含め26件です）

</details>

<details>
<summary>Astro（SSR / Vercelアダプタ）15件</summary>

play-withladies-ranking, play-withca-ranking, play-with-stewardess-ranking,
play-with-racequeen-ranking, play-intrain-ranking, ntr-exchange-ranking,
ikigaman-ranking, gyakyu-netorare-ranking, gyaru-ranking, onsen-ranking,
chijo-ranking, ohogao-ranking, netorase-ranking, kijoi-ranking, ahegao-ranking

</details>

## デプロイ方針（提案）

コードが既に前提としている技術に合わせるのが最短です。

| 種別 | 推奨デプロイ先 | 理由 |
|------|----------------|------|
| Astro（15件） | **Vercel** | `@astrojs/vercel` アダプタが既にコードに組み込み済み。追加設定はVercel側のプロジェクト作成のみ（コード変更不要） |
| PHP/Laravel（26件） | **Render**（Web Service、PHP runtime） | `shudenhotel`/`machi-list` で既にRender運用実績あり。Laravel標準構成なのでBuildpack/Dockerで対応可 |

## 未確定事項（ユーザー判断待ち）

1. **ドメイン割当**（41件 × 個別ドメイン取得は現実的なコストか？サブドメイン運用や一部サイトの絞り込みも要検討）
2. 41件を一括デプロイするか、**まず数件のパイロットで動作確認**してから横展開するか
3. GA4/GSC/sitemap（`scripts/site-analytics/` キット）の適用順序

ドメインが未定でも、Vercel/Renderのデフォルトサブドメイン（`*.vercel.app` / `*.onrender.com`）で
先行公開すること自体は可能です。

## 一覧取得（元リポジトリ確認用）

```powershell
gh repo list syunnjack --limit 100 --json name,updatedAt `
  --jq '.[] | select(.name | test("-ranking$")) | .name' | Sort-Object
```

## 次フェーズ

1. ~~ドメイン一覧の確定~~ → ユーザー判断待ち（上記「未確定事項」参照）
2. ~~デプロイ先の統一~~ → 上記「デプロイ方針」の通り確定（Astro→Vercel、PHP→Render）
3. `scripts/site-analytics/` キットの横展開（デプロイ後）
4. DTI CSV 連携が必要なサイトの選定（hey-douga / free-sample-hub とは別系統）

## 関連

- カスタムドメイン 5 サイト: `docs/SITE-ROLLOUT.md`
- DTI 動画: `patches/DEPLOY-WINDOWS.md`
- Xserverアカウント調査: `docs/XSERVER-ACCOUNT-AUDIT.md`
