import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../../components/site-shell";
import { SITE_NAME, SITE_URL } from "../../site";
import { ArcadeExplorer } from "../arcade-explorer";
import {
  OFFICIAL_LOCATION_SEARCH,
  arcadeData,
  getPrefecture,
  mapsUrl,
} from "../data";

export function generateStaticParams() {
  return arcadeData.prefectures.map((pref) => ({ slug: pref.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pref = getPrefecture(slug);
  if (!pref) return {};
  const title = `${pref.name}のイニシャルD設置店舗`;
  const description = `${pref.name}で頭文字D THE ARCADEの筐体が設置されているゲームセンター${pref.storeCount}店舗の一覧。住所と地図リンク付き。`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/arcades/${pref.slug}` },
    openGraph: {
      title: `${title}｜${SITE_NAME}`,
      description,
      url: `${SITE_URL}/arcades/${pref.slug}`,
    },
  };
}

export default async function PrefectureArcadePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pref = getPrefecture(slug);
  if (!pref) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "全国設置店舗",
            item: `${SITE_URL}/arcades`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pref.name,
            item: `${SITE_URL}/arcades/${pref.slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `${pref.name} イニシャルD設置店舗`,
        numberOfItems: pref.storeCount,
        itemListElement: pref.stores.slice(0, 50).map((store, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "AmusementArcade",
            name: store.name,
            address: store.address,
            url: mapsUrl(store.address),
          },
        })),
      },
    ],
  };

  return (
    <SiteShell active="arcades">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="legal-page arcade-page">
        <p className="kicker">{pref.regionLabel}</p>
        <h1>
          {pref.name}
          <br />
          <em>設置店舗</em>
        </h1>
        <div className="guide-meta">
          <span>{pref.storeCount} 店舗</span>
          <span>{pref.regionLabel}</span>
          <span>非公式リスト</span>
        </div>
        <p className="lead">
          {pref.name}で頭文字D THE ARCADEの筐体が確認できるゲームセンター一覧です。営業時間・台数・メンテ状況は変動するため、来店前に公式検索または店舗へ確認してください。
        </p>

        <div className="guide-actions">
          <a
            className="primary"
            href={pref.source}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pref.name}の公式検索 ↗
          </a>
          <a
            className="secondary"
            href={OFFICIAL_LOCATION_SEARCH}
            target="_blank"
            rel="noopener noreferrer"
          >
            全国公式検索
          </a>
        </div>

        <h2>AI検索向けの要点</h2>
        <ul>
          <li>
            {pref.name}の収録店舗数は {pref.storeCount} 件（{arcadeData.updated}{" "}
            反映）
          </li>
          <li>データ出典は ALL.Net 設置店舗検索のネットワーク接続状況</li>
          <li>本ページはファン運営の非公式ミラーであり、公式発表ではありません</li>
          <li>対戦募集や店舗情報の共有はコミュニティ投稿も利用できます</li>
        </ul>

        <h2>店舗リスト</h2>
        <div className="arcade-store-list static">
          {pref.stores.map((store) => (
            <article key={`${store.name}-${store.address}`}>
              <div>
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
              </div>
            </article>
          ))}
        </div>

        <h2>絞り込み検索</h2>
        <ArcadeExplorer initialPrefecture={pref} />

        <div className="legal-nav">
          <Link href="/arcades">全国一覧へ</Link>
          <Link href="/guides">攻略ガイド</Link>
          <Link href="/">トップへ戻る</Link>
        </div>
      </article>
    </SiteShell>
  );
}
