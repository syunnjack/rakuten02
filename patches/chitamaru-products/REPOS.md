# 新規78リポジトリ（おすすめ順スキャフォールド）

`PRODUCT-IDEAS.md` の案を**おすすめ順（#1〜#78）**で実装した初期リポジトリ群です。

## 場所

| パス | 内容 |
|------|------|
| `repos/chitamaru-<slug>/` | 各商品のソース（独立リポ構成） |
| `catalog/new-products.json` | メタデータ一式 |
| `catalog/repo-manifest.txt` | push順（おすすめ順） |
| `scripts/generate-new-products.py` | 再生成スクリプト |
| `scripts/push-repos-with-pat.sh` | GitHubへ一括 create/push |

## GitHubへの公開（必須・手元で実行）

この Cloud Agent のトークンは **他リポジトリの作成・push が 403** のため、GitHub上の `syunnjack/chitamaru-*` は未作成です。  
ご自身の PAT（`repo` スコープ）で:

```bash
cd /path/to/rakuten02
export GH_TOKEN=ghp_xxxxxxxx   # syunnjack で repo 作成できる PAT
chmod +x patches/chitamaru-products/scripts/push-repos-with-pat.sh

# まず優先10件
START=1 LIMIT=10 ./patches/chitamaru-products/scripts/push-repos-with-pat.sh

# 残り全部
START=11 ./patches/chitamaru-products/scripts/push-repos-with-pat.sh
```

作成後の URL 例: `https://github.com/syunnjack/chitamaru-zero-conversion-sheet`

## 積み上げログ ストアへの反映

```bash
cd /path/to/tsumiage-log
PATCH="/path/to/rakuten02/patches/chitamaru-products"
cp "$PATCH/GlobalNav.tsx"     app/components/GlobalNav.tsx
cp "$PATCH/globals.css"       app/globals.css
cp "$PATCH/store-page.tsx"    app/store/page.tsx
cp "$PATCH/store-products.ts" app/store/store-products.ts
cp "$PATCH/store-videos.json" app/data/store-videos.json
git add -A && git commit -m "Store: add 78 recommended Chitamaru products" && git push
```

ストア先頭に「おすすめ順」一覧＋カード、カテゴリには既存16＋新規へのリンクが出ます。

## 各リポの中身（初期）

| kind | 同梱 |
|------|------|
| tool / monthly / b2b | `app/index.html` + JS/CSS の動く雛形 |
| template | `docs/TEMPLATE.md` + `data.csv` |
| guide | `docs/GUIDE.md` |
| content | `content/OUTLINE.md` |

いずれも `README.md` と `chitamaru.product.json` 付き。BOOTH出品・機能の本実装は各リポで継続してください。
