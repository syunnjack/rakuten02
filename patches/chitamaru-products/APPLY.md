# tsumiage-log ストア更新 — 全リポジトリから厳選16製品

## 適用ファイル

| パッチファイル | 配置先 |
|---------------|--------|
| `GlobalNav.tsx` | `app/components/GlobalNav.tsx` |
| `globals.css` | `app/globals.css` |
| `store-page.tsx` | `app/store/page.tsx`（個人おすすめ3入口 + FAQ更新済み） |
| `store-products.ts` | `app/store/store-products.ts` **（新規）** |
| `store-videos.json` | `app/data/store-videos.json` |

運用ドキュメント（リポ内参照用・tsumiage-logへコピー不要）:

| ファイル | 内容 |
|----------|------|
| `BOOTH-LISTINGS.md` | 未出品の出品文・価格・納品チェックリスト |
| `STORE-COPY.md` | ストア3入口・ヒーロー・FAQ文案 |
| `PHASE2-MONTHLY.md` | Phase2 個人月額（終電ホテル Pro）選定 |
| `PRODUCT-IDEAS.md` | 追加アイデア原案 |
| `REPOS.md` | **新規78リポ**の配置・GitHub push・ストア反映 |
| `repos/chitamaru-*/` | おすすめ順スキャフォールド（各独立リポ構成） |
| `catalog/new-products.json` | 78製品メタデータ |

## ワンライナー

```bash
cd /path/to/tsumiage-log
PATCH="/path/to/rakuten02/patches/chitamaru-products"
cp "$PATCH/GlobalNav.tsx"       app/components/GlobalNav.tsx
cp "$PATCH/globals.css"         app/globals.css
cp "$PATCH/store-page.tsx"      app/store/page.tsx
cp "$PATCH/store-products.ts"   app/store/store-products.ts
cp "$PATCH/store-videos.json"   app/data/store-videos.json
git add -A && git commit -m "Store: add 16 curated products from all repos, category layout" && git push
```

## 追加した製品一覧（16点）

### アフィリエイト・収益化（3点）
| 製品 | 価格 | リポジトリ |
|------|------|-----------|
| 楽天ROOMクリック改善ツール PRO | ¥2,480 | rakuafi-tool |
| えらびより（楽天横断検索） | ¥2,480 | raku-toolv2 |
| 副業アフィリエイト 週次収支ログブック | ¥580 | — |

### SEO・サイト運用（3点）
| 製品 | 価格 | リポジトリ |
|------|------|-----------|
| SEO管理ダッシュボード Pro | ¥3,800 | — |
| 個人開発サイト公開キット | ¥980 | rakuten02 |
| RepoKura（リポジトリ棚卸し） | ¥2,480 | togo-kanri-tool |

### せどり・買取・在庫（3点）
| 製品 | 価格 | リポジトリ |
|------|------|-----------|
| JAN・ISBN一括査定（せどらーS） | ¥3,800 | sedora-s |
| DVD JAN Scan DB | ¥2,480 | dvd-jan-scan-db |
| BuybackAlert 仕入れ価格差 | ¥980 | buyback-price-alert |

### 生活・学習・習慣化（5点）
| 製品 | 価格 | リポジトリ |
|------|------|-----------|
| 時短レシピ支援アプリ | ¥580 | jitan-recipe |
| GoalPilot 目標達成アプリ | ¥980 | goal-pilot-app |
| レシート家計簿 | ¥980 | receipt-jp |
| AI Quiz Study | ¥980 | ai-quiz-study |
| StudyLaw App（クイズテンプレ） | ¥980 | studylaw-app |

### コンテンツ制作（1点）
| 製品 | 価格 | リポジトリ |
|------|------|-----------|
| コンテンツブリーフ生成エンジン | ¥580 | content-brief-engine |

### 不動産・投資（1点）
| 製品 | 価格 | リポジトリ |
|------|------|-----------|
| 不動産価格ウォッチ | ¥2,480 | fudousan-kakaku-watch |

## 選定基準

- ✅ 単体で価値がある完成度の高いツール
- ✅ 明確なターゲットユーザーがいる
- ✅ ソースコードまたはテンプレートとして納品可能
- ❌ アダルト系ランキングサイトのみ（除外）
- ❌ アフィリエイト送客のみの比較サイト（除外）
- ❌ 空テンプレ・未完成リポジトリ（除外）

## BOOTH出品が必要な新商品

出品文・価格・納品チェックリストは **`BOOTH-LISTINGS.md`** を参照（コピペ用）。

`chitamaru.booth.pm/items/` 以下に出品してください:

- 優先: `rakuafi-tool` `affiliate-logbook` `site-launch-kit`
- 未出品11: `raku-toolv2` `togo-kanri-tool` `sedora-s` `dvd-jan-scan-db`
  `buyback-price-alert` `goal-pilot-app` `receipt-jp` `ai-quiz-study`
  `studylaw-app` `content-brief-engine` `fudousan-kakaku-watch`
- PPV: `hobby-log-special`
