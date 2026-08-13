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

`critical=0`。共通 warn: canonical が末尾スラッシュなし。

| ドメイン | GA4 | GSC | メモ |
|----------|-----|-----|------|
| sosolu.pro / .link / .help / .org / .xyz | ✅ | ✅ | |
| sosoru.click / .org / .asia | ✅ | ✅ | DTI: sosoru.org / .asia |
| sosolu.email | ✅ | ❌ 欠 | verification 追加 |
| sosolu.net / .tokyo / sosoru.tokyo | ❌ | ✅ | 2026-08-08 API キー空インシデントと一致 |

| リポジトリ | ドメイン | 備考 |
|------------|----------|------|
| adult-comic-ranking | sosolu.pro | GA4+GSC ライブ |
| adult-figure-ranking | sosolu.link | |
| adult-novel-ranking | sosolu.email | |
| bl-tl-doujin-ranking | sosolu.help | |
| bl-tl-novel-ranking | sosolu.org | |
| cross-asp-ranking | sosoru.click | |
| duga-video-ranking | sosoru.tokyo | **API キー空（復旧待ち）** |
| gravure-photo-ranking | sosolu.net | **API キー空（復旧待ち）** |
| mature-genre-ranking | sosolu.tokyo | **API キー空（復旧待ち）** |
| r18-anime-ranking | sosolu.xyz | |

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
3. `scripts/site-analytics/check-ranking-signals.sh` でライブ SEO 監視
4. GA4/GSC 未設定ドメインがあれば横展開

## 関連

- デプロイ詳細: `docs/XSERVER-DEPLOY.md`
- カスタムドメイン 5 サイト: `docs/SITE-ROLLOUT.md` / `docs/GSC-FINISH.md`
- DTI: `patches/DEPLOY-WINDOWS.md` / `complete-dti-rollout.sh`
