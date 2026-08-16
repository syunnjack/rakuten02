# 追加16製品を tsumiage-log ストアへ載せる

## ファイル

| パッチ | 配置先 |
|--------|--------|
| `store-16-products.ts` | `app/store/store-16-products.ts`（新規） |

`store-products.ts` で `additional16ProductRepos` を import し、おすすめ順セクションに連結する。

```ts
import { additional16ProductRepos } from "./store-16-products"

// recommendedNewProducts の後、または独立セクション
export const phase1AlertProducts = additional16ProductRepos
```

ヒーロー3入口（副業 / 個人開発 / せどり）は変えない。  
16本は「通知・地域・B2B準備」として下に置く。個人価格だけ前面。

BOOTH文は `products/BOOTH-LISTINGS.md`。納品ZIPは `./products/pack-booth-zips.sh`。
