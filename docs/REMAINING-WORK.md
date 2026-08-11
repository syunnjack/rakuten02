# 残り作業チェックリスト — 2026-08-11 更新

ライブHTMLを再確認して更新。✅ = 完了 / 🟡 = 一部残 / ❌ = 未着手

---

## トラック A — カスタムドメイン（6サイト）

GA4 / canonical はライブHTMLの実測値。

| サイト | 公開 | GA4 | GSC | 残り |
|--------|------|-----|-----|------|
| shudenhotel.jp | ✅ | ❌ | 🟡 | **Render に env 4件追加**（下記） / PR #27・#29 マージ |
| darekore.jp | ✅ | ✅ | ✅ | Search Console サイトマップ送信 / PR task-dashboard#8 マージ |
| goalpilot.jp | ✅ | ✅ | ✅ | canonical・robots が未出力 → PR goal-pilot-app#1 マージ |
| machi-list.jp | ✅ HTTPS | ❌ | ✅ | **GitHub Secret `GOOGLE_ANALYTICS_MEASUREMENT_ID` + Deploy 再実行** / PR machi-list#1 |
| busselect.jp | ✅ | ❌ | ✅ | **ホスティング側に `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID`** / PR kousokubus-benri#1 |
| municipality-car.jp | ✅ | ✅ | ✅ | robots.txt が vercel.app の sitemap を宣言 → PR municipacipality-car#1 |

### shudenhotel — Render の env が未反映

サービスがBlueprint管理でないため `render.yaml` の `envVars` が効いていない。Dashboard → `shudenhotel` → Environment に直接追加する。

| key | value |
|-----|-------|
| `PUBLIC_BASE_URL` | `https://shudenhotel.jp` |
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 の測定ID（`render.yaml` の `G-542370310` はGA4の形式ではないので要確認） |
| `GOOGLE_SITE_VERIFICATION` | `render.yaml` と同じ値 |
| `INDEXNOW_KEY` | `shudenhotelindex2026` |

未設定の間は GA4 タグと GSC メタが出力されない。canonical の http→https は PR #29 で env なしでも直る。

### machi-list — GA4 だけ未注入

GSC メタは live。GA4 タグが HTML にない → Secret 未設定 or 再デプロイ未実施。

1. https://github.com/syunnjack/machi-list/settings/secrets/actions  
   `GOOGLE_ANALYTICS_MEASUREMENT_ID` = `G-XXXXXXXX`
2. Actions → **Deploy static site** → Run workflow

詳細: `patches/machi-list/POST-DNS-GITHUB-PAGES.md`

### Search Console サイトマップ送信（ブラウザ 2分×）

1. https://search.google.com/search-console
2. 各ドメイン → **サイトマップ** → 追加:
   - `https://darekore.jp/sitemap.xml`
   - `https://goalpilot.jp/sitemap.xml`
   - `https://busselect.jp/sitemap.xml`
   - `https://municipality-car.jp/sitemap.xml`

### 未マージのSEO PR（マージ＋デプロイで反映）

| PR | 内容 |
|----|------|
| rakuten02 #27 | `/search` を noindex にして sitemap から除外 |
| rakuten02 #29 | プロキシ経由でも canonical / sitemap を https に |
| kousokubus-benri #1 | busselect の `/search` noindex、トップ title の `\| NOLU` 二重を解消 |
| task-dashboard #8 | darekore の URL パーセントエンコードと出演者一覧ページ生成 |
| machi-list #1 | 店舗詳細ページ生成 |
| goal-pilot-app #1 | 自己参照 canonical と全ルートの sitemap 登録 |
| municipacipality-car #1 | 静的HTMLのプリレンダーと robots.txt の sitemap ホスト修正 |
| maportal #3 / golf-search #1 / wait-time-alert #1 / tsumiage-log #32 / hey-douga-guide #2 | robots・canonical・sitemap の整合 |
| hey-douga-guide #3 | サンプルMP4・サムネイルを https にして mixed content 解消 |
| free-sample-hub #1 | DTI CSV インポート基盤の取り込みと https 化 |

### busselect — 完了済み（参考）

- パッチ 0002（GA4/GSC/IndexNow）✅ — ただし GA4 の環境変数が未設定でタグは未出力
- パッチ 0003（Leaflet ルート地図）✅ — 秋葉原で動作確認済
- パッチ 0004（Windows `npm run dev`）— 任意

---

## トラック B — DTI 動画サイト

| リポジトリ | 状態 | 残り |
|------------|------|------|
| hey-douga-guide | PR #1 マージ済 / PR #3 で https 修正 | PR #2・#3 マージ → **本番** migrate + 再 import |
| free-sample-hub | PR #1 でパッチ 0001–0003 適用済（ローカル検証済） | PR #1 マージ → **本番** migrate + import |

どちらも DTI の CSV / RSS が `http://` のサンプルMP4・サムネイルを返すため、https配信のサイトでは全カードが mixed content でブロックされていた（hey-douga-guide は48件中25件）。`secureUrl()` で既知ホストのみ https に上げる修正を両リポジトリに入れた（hey-douga-guide #3 / free-sample-hub #1）。

**既存レコードは http のまま DB に入っているので、マージ後に本番で再 import が必要。**

### hey-douga-guide 本番

```powershell
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan dti:import-csv database\seeders\data\dti-movies.csv
php artisan dti:sync
```

`patches/hey-douga-guide/MERGE-PR.md`

### free-sample-hub 本番

ローカル検証値: CSV 424行 → 393件 import、トップに `<video>` 48枚、`http://` の `src`/`poster` は 0件。

```powershell
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan samples:import-csv database\seeders\data\dti-movies.csv
```

`patches/free-sample-hub/SETUP.md` / `patches/DEPLOY-WINDOWS.md`

---

## トラック C — ランキングサイト（41 repo）

未デプロイ。ドメイン割当・デプロイ方針の相談待ち。`docs/RANKING-SITES.md`

---

## 一括確認（PowerShell）

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```

---

## 優先順位

| # | 作業 | 担当 | 時間目安 |
|---|------|------|----------|
| 1 | 未マージのSEO PR をマージ（上記表） | GitHub UI | 10分 |
| 2 | shudenhotel Render env 4件 | Render UI | 5分 |
| 3 | machi-list GA4 Secret + Deploy / busselect GA4 env | GitHub・ホスティングUI | 5分 |
| 4 | Search Console サイトマップ ×4 | ブラウザ | 10分 |
| 5 | hey-douga / free-sample-hub 本番 migrate + import | 本番 PowerShell | 15分 |
