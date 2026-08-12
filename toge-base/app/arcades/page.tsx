import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { SITE_NAME, SITE_URL } from "../site";
import { ArcadeExplorer } from "./arcade-explorer";
import { BoothSoftCta } from "../components/booth-soft-cta";
import {
  OFFICIAL_LOCATION_SEARCH,
  arcadeData,
  getRegionSummaries,
} from "./data";

export const metadata: Metadata = {
  title: "全国設置店舗一覧｜イニシャルD筐体のゲームセンター",
  description: `頭文字D THE ARCADEの筐体が設置されている全国のゲームセンター一覧。${arcadeData.totalStores}店舗を都道府県別に掲載。`,
  alternates: { canonical: `${SITE_URL}/arcades` },
  openGraph: {
    title: `全国設置店舗一覧｜${SITE_NAME}`,
    description: `イニシャルD筐体の設置ゲーセンを全国${arcadeData.totalStores}店舗掲載。`,
    url: `${SITE_URL}/arcades`,
  },
};

export default function ArcadesPage() {
  const regions = getRegionSummaries();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "イニシャルD 全国設置店舗一覧",
    description: arcadeData.disclaimer,
    url: `${SITE_URL}/arcades`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: "頭文字D THE ARCADE 設置店舗",
  };

  return (
    <SiteShell active="arcades">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="legal-page arcade-page">
        <p className="kicker">ARCADE LOCATIONS</p>
        <h1>
          全国の設置店舗
          <br />
          <em>ゲームセンター</em>
        </h1>
        <p className="lead">
          頭文字D THE ARCADEの筐体がネットワーク接続されている店舗を、都道府県別にまとめています。現在{" "}
          <strong>{arcadeData.totalStores}</strong> 店舗を収録（{arcadeData.updated}{" "}
          反映）。行く前に公式検索でも再確認してください。
        </p>

        <div className="guide-actions">
          <a
            className="primary"
            href={OFFICIAL_LOCATION_SEARCH}
            target="_blank"
            rel="noopener noreferrer"
          >
            公式の設置店舗検索 ↗
          </a>
          <Link className="secondary" href="/#community">
            店舗情報を投稿する
          </Link>
        </div>

        <h2>地方から探す</h2>
        <div className="arcade-region-grid">
          {regions.map((region) => (
            <Link
              key={region.region}
              href={`/arcades#${region.region}`}
              className="arcade-region-card"
            >
              <small>{region.prefectureCount}都道府県</small>
              <strong>{region.label}</strong>
              <span>{region.storeCount} 店舗</span>
            </Link>
          ))}
        </div>

        <h2>都道府県一覧</h2>
        <div className="arcade-pref-grid">
          {arcadeData.prefectures.map((pref) => (
            <Link key={pref.slug} href={`/arcades/${pref.slug}`}>
              <b>{pref.name}</b>
              <span>{pref.storeCount}</span>
            </Link>
          ))}
        </div>

        <h2 id="list">店舗を絞り込む</h2>
        <ArcadeExplorer />
        <BoothSoftCta variant="inline" />

        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/guides">攻略ガイド</Link>
          <Link href="/about">サイトについて</Link>
        </div>
      </article>
    </SiteShell>
  );
}
