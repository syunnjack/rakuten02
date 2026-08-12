"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  OFFICIAL_LOCATION_SEARCH,
  arcadeData,
  getRegionSummaries,
  mapsUrl,
  type PrefectureArcades,
} from "./data";

export function ArcadeExplorer({
  initialPrefecture,
}: {
  initialPrefecture?: PrefectureArcades;
}) {
  const regions = getRegionSummaries();
  const [region, setRegion] = useState(initialPrefecture?.region || "all");
  const [query, setQuery] = useState("");
  const [prefSlug, setPrefSlug] = useState(initialPrefecture?.slug || "all");

  const filteredPrefs = useMemo(() => {
    return arcadeData.prefectures.filter((pref) => {
      if (region !== "all" && pref.region !== region) return false;
      if (prefSlug !== "all" && pref.slug !== prefSlug) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      if (pref.name.toLowerCase().includes(q)) return true;
      return pref.stores.some(
        (store) =>
          store.name.toLowerCase().includes(q) ||
          store.address.toLowerCase().includes(q),
      );
    });
  }, [region, prefSlug, query]);

  const visibleStores = useMemo(() => {
    const q = query.trim().toLowerCase();
    return filteredPrefs.flatMap((pref) =>
      pref.stores
        .filter(
          (store) =>
            !q ||
            store.name.toLowerCase().includes(q) ||
            store.address.toLowerCase().includes(q) ||
            pref.name.toLowerCase().includes(q),
        )
        .map((store) => ({ pref, store })),
    );
  }, [filteredPrefs, query]);

  const prefOptions =
    region === "all"
      ? arcadeData.prefectures
      : arcadeData.prefectures.filter((p) => p.region === region);

  return (
    <div className="arcade-explorer">
      <div className="arcade-toolbar">
        <label>
          地方
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPrefSlug("all");
            }}
          >
            <option value="all">全国</option>
            {regions.map((item) => (
              <option key={item.region} value={item.region}>
                {item.label}（{item.storeCount}）
              </option>
            ))}
          </select>
        </label>
        <label>
          都道府県
          <select
            value={prefSlug}
            onChange={(e) => setPrefSlug(e.target.value)}
          >
            <option value="all">すべて</option>
            {prefOptions.map((pref) => (
              <option key={pref.slug} value={pref.slug}>
                {pref.name}（{pref.storeCount}）
              </option>
            ))}
          </select>
        </label>
        <label className="arcade-search">
          店舗名 / 住所
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="例：池袋、GiGO、ラウンドワン"
          />
        </label>
      </div>

      <p className="arcade-result-count">
        <strong>{visibleStores.length}</strong> 店舗を表示中
        {prefSlug !== "all" && (
          <>
            {" "}
            /{" "}
            <Link href={`/arcades/${prefSlug}`}>
              都道府県ページを開く →
            </Link>
          </>
        )}
      </p>

      <div className="arcade-store-list">
        {visibleStores.slice(0, 200).map(({ pref, store }) => (
          <article key={`${pref.slug}-${store.name}-${store.address}`}>
            <div>
              <Link className="arcade-pref-chip" href={`/arcades/${pref.slug}`}>
                {pref.name}
              </Link>
              <h3>{store.name}</h3>
              <p>{store.address}</p>
            </div>
            <div className="arcade-store-actions">
              <a
                href={mapsUrl(store.address)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Map
              </a>
              <a
                href={pref.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                公式確認
              </a>
            </div>
          </article>
        ))}
      </div>

      {visibleStores.length > 200 && (
        <p className="arcade-note">
          表示は先頭200件までです。都道府県を絞るか検索語を追加してください。
        </p>
      )}
      {visibleStores.length === 0 && (
        <p className="arcade-note">条件に一致する店舗がありません。</p>
      )}

      <p className="arcade-disclaimer">
        {arcadeData.disclaimer} 最終反映: {arcadeData.updated} / 収録{" "}
        {arcadeData.totalStores} 店舗。最新確認は{" "}
        <a href={OFFICIAL_LOCATION_SEARCH} target="_blank" rel="noopener noreferrer">
          {arcadeData.sourceLabel}
        </a>
        。
      </p>
    </div>
  );
}
