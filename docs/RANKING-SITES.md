# ランキングサイト一覧（デプロイ状況）

最終更新: **2026-08-13**

旧メモの「未デプロイ」は誤り。`docs/XSERVER-DEPLOY.md` のとおり多くが本番稼働中。

## 現状サマリ

| グループ | 件数 | ホスト | 状態 |
|----------|------|--------|------|
| ColorfulBOX（sosolu/sosoru） | 10 ranking + 他 | `183.90.183.168` | **ライブ**（DNS 済） |
| WPX（*.jp / *.site 系） | 17 ranking | `wp858043.wpx.jp` | サーバー配置済・**DNS 未向** |
| GitHub 上 `*-ranking` | ~41 | — | ソースあり |

## ColorfulBOX ライブ信号（2026-08-13 `check-ranking-signals.sh`）

`critical=0`。共通 warn: canonical が末尾スラッシュなし → **パッチ用意済み**（`patches/ranking-sites/README.md`）。

| ドメイン | GA4 | GSC | メモ |
|----------|-----|-----|------|
| sosolu.pro / .link / .help / .org / .xyz | ✅ | ✅ | |
| sosoru.click / .org / .asia | ✅ | ✅ | DTI: sosoru.org / .asia |
| sosolu.email | ✅ | ❌ 欠 | Search Console 実トークンが必要（捏造しない） |
| sosolu.net / .tokyo / sosoru.tokyo | ❌ | ✅ | ColorfulBOX `.env` の `GA4_MEASUREMENT_ID` のみ（ID 捏造不可） |

| リポジトリ | ドメイン | 備考 |
|------------|----------|------|
| adult-comic-ranking | sosolu.pro | GA4+GSC ライブ / trailing-slash パッチ ready |
| adult-figure-ranking | sosolu.link | trailing-slash パッチ ready |
| adult-novel-ranking | sosolu.email | trailing-slash + GSC docs 注記 |
| bl-tl-doujin-ranking | sosolu.help | trailing-slash パッチ ready |
| bl-tl-novel-ranking | sosolu.org | trailing-slash パッチ ready |
| cross-asp-ranking | sosoru.click | trailing-slash パッチ ready |
| duga-video-ranking | sosoru.tokyo | **API キー空（復旧待ち）** / trailing-slash パッチ ready |
| gravure-photo-ranking | sosolu.net | **API キー空（復旧待ち）** / trailing-slash パッチ ready |
| mature-genre-ranking | sosolu.tokyo | **API キー空（復旧待ち）** / trailing-slash パッチ ready |
| r18-anime-ranking | sosolu.xyz | trailing-slash パッチ ready |

適用（dry-run）:

```bash
PUSH=false bash scripts/site-analytics/apply-ranking-canonical-patches.sh
```

関連ライブ（ranking 以外）:
- hey-douga-guide → **sosoru.org**（GA4 `G-DDSV1YXLEB` / GSC 済）
- free-sample-hub → **sosoru.asia**（GA4 `G-F1L60W8K4L` / GSC 済）

## WPX（配置済・DNS 待ち）

`back-piston.jp` `hard-piston.jp` `kosupure.jp` `kyonyu.site` `mesuiki.jp` `mesuochi.jp` `neback.jp` `netorare.net` `play-inbus.jp` `play-inplane.jp` `play-with-promotionalgirl.jp` `play-with-roundgirl.jp` `playincar.jp` `shibari.click` `shirouto.tech` `tachiback.jp` `taimenzai.jp`

次: お名前.com / 各レジストラで A/NS を WPX へ。詳細は `docs/XSERVER-DEPLOY.md`。

## スタック

| 種別 | 例 | 技術 |
|------|-----|------|
| PHP/Laravel | netorare-ranking, adult-comic-ranking | DmmClient + Actions rsync |
| Astro | play-withca-ranking, duga-video-ranking | Astro 7 |

## 次フェーズ（エージェントは権限不足）

1. WPX 17 件の DNS を本番へ
2. ColorfulBOX 3 件の DMM/DUGA API キー再投入（インシデント復旧）
3. trailing-slash canonical パッチ適用（`apply-ranking-canonical-patches.sh`）
4. sosolu.net / sosolu.tokyo / sosoru.tokyo の `GA4_MEASUREMENT_ID` を ColorfulBOX `.env` で設定
5. sosolu.email の Search Console 実トークン
6. `scripts/site-analytics/check-ranking-signals.sh` でライブ SEO 監視

## 関連

- デプロイ詳細: `docs/XSERVER-DEPLOY.md`
- カスタムドメイン 5 サイト: `docs/SITE-ROLLOUT.md` / `docs/GSC-FINISH.md`
- DTI: `patches/DEPLOY-WINDOWS.md` / `apply-dti-patches.sh` / `complete-dti-rollout.sh`
- Ranking patches: `patches/ranking-sites/README.md`
