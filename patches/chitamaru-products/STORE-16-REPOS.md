# 追加16製品 — ストア掲載用（個人おすすめ順）

`products/catalog.json` が正本。tsumiage-log の `store-products.ts` に足すときのコピー元。

ヒーロー3入口は既存のまま（副業 / 個人開発 / せどり）。  
この16本は「通知・地域・B2B準備」として下に置く。個人価格だけ前面に出す。

```ts
export const additionalProductRepos = [
  { rank: 1, id: "hotel-price-watch", title: "Hotel Price Watch", price: "¥980", category: "hotel" },
  { rank: 2, id: "job-match-alert", title: "Job Match Alert", price: "¥980", category: "job" },
  { rank: 3, id: "subsidy-alert-hub", title: "Subsidy Alert Hub", price: "¥2,480", category: "biz" },
  { rank: 4, id: "nearqueue", title: "NearQueue", price: "¥3,800", category: "b2b" },
  { rank: 5, id: "work-bar-navi", title: "Work Bar Navi", price: "¥980", category: "local" },
  { rank: 6, id: "midnight-spot-alert", title: "Midnight Spot Alert", price: "¥580", category: "hotel" },
  { rank: 7, id: "welfare-job-alert", title: "Welfare Job Alert", price: "¥980", category: "job" },
  { rank: 8, id: "busstay", title: "BusStay", price: "¥980", category: "hotel" },
  { rank: 9, id: "trip-route-stay", title: "Trip Route Stay", price: "¥580", category: "travel" },
  { rank: 10, id: "open-close-radar", title: "Open/Close Radar", price: "¥580", category: "local" },
  { rank: 11, id: "comicstay", title: "ComicStay", price: "¥980", category: "local" },
  { rank: 12, id: "my-dartslive", title: "My Dartslive", price: "¥2,480", category: "hobby" },
  { rank: 13, id: "eki-genre-map", title: "Eki Genre Map", price: "¥980", category: "local" },
  { rank: 14, id: "content-brief-packs", title: "Content Brief Packs", price: "¥580", category: "content" },
  { rank: 15, id: "seo-dashboard-agency", title: "SEO Dashboard Agency", price: "¥3,800", category: "seo-ops" },
  { rank: 16, id: "room-ops-tickets", title: "ROOM Ops Tickets", price: "¥4,800", category: "affiliate" },
] as const;
```

GitHub: `https://github.com/syunnjack/chitamaru-<slug>`（NearQueue は `chitamaru-nearqueue`、BusStay は `chitamaru-busstay`、ComicStay は `chitamaru-comicstay`、ROOM は `chitamaru-room-ops-tickets`、SEO は `chitamaru-seo-dashboard-agency`、Briefs は `chitamaru-content-brief-packs`）。
