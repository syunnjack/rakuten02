import locations from "./locations.json";

export type ArcadeStore = {
  name: string;
  address: string;
};

export type PrefectureArcades = {
  slug: string;
  name: string;
  region: string;
  regionLabel: string;
  allNetCode: number;
  storeCount: number;
  source: string;
  stores: ArcadeStore[];
};

export type ArcadeLocations = {
  title: string;
  updated: string;
  source: string;
  sourceLabel: string;
  disclaimer: string;
  regions: Record<string, string>;
  totalStores: number;
  prefectures: PrefectureArcades[];
};

export const arcadeData = locations as ArcadeLocations;

export const OFFICIAL_LOCATION_SEARCH =
  "https://location.am-all.net/alm/location?gm=105";

export function getPrefecture(slug: string) {
  return arcadeData.prefectures.find((pref) => pref.slug === slug);
}

export function getRegionSummaries() {
  const order = Object.keys(arcadeData.regions);
  return order.map((region) => {
    const prefs = arcadeData.prefectures.filter((p) => p.region === region);
    return {
      region,
      label: arcadeData.regions[region],
      prefectureCount: prefs.length,
      storeCount: prefs.reduce((sum, p) => sum + p.storeCount, 0),
      prefectures: prefs,
    };
  });
}

export function getFeaturedStores(limit = 8) {
  const featuredSlugs = ["tokyo", "osaka", "aichi", "fukuoka", "hokkaido"];
  const picks: { prefecture: string; slug: string; store: ArcadeStore }[] = [];
  for (const slug of featuredSlugs) {
    const pref = getPrefecture(slug);
    if (!pref?.stores[0]) continue;
    picks.push({
      prefecture: pref.name,
      slug: pref.slug,
      store: pref.stores[0],
    });
  }
  return picks.slice(0, limit);
}

export function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
