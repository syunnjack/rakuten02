# 積み上げログ ストアへ Sitemap Auto を追加

対象リポジトリ: [syunnjack/tsumiage-log](https://github.com/syunnjack/tsumiage-log)  
パッチ: `0001-Add-Sitemap-Auto-to-store-software-products.patch`

## 適用手順

```bash
git clone https://github.com/syunnjack/tsumiage-log.git
cd tsumiage-log
git checkout -b add-sitemap-auto-store

# rakuten02 からパッチを取得
curl -L -o store.patch \
  "https://github.com/syunnjack/rakuten02/raw/cursor/sitemap-auto-tool-708b/patches/tsumiage-log/0001-Add-Sitemap-Auto-to-store-software-products.patch"

git apply store.patch
# または: git am < store.patch  （形式によっては apply のみ）

git add app/store/page.tsx
git commit -m "Add Sitemap Auto to store software products"
git push -u origin add-sitemap-auto-store
```

## 変更内容

- `/store` の「ソフトウェア製品」に **Sitemap Auto** カードを追加
- FAQ（動作環境）に Node.js / GSC サービスアカウント要件を追記
- CTA は `https://github.com/syunnjack/sitemap-auto`（無料・MIT）

## 補足

`sitemap-auto` 本体のソースは `rakuten02/sitemap-auto/` にあります。  
単体リポジトリ公開手順は `sitemap-auto/docs/SETUP-REPO.md` を参照してください。
