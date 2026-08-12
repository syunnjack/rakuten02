import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import {
  BOOTH_PRODUCTS,
  BOOTH_SHOP_URL,
  COMMON_LEAD,
  boothRel,
} from "../booth";
import { SITE_NAME, SITE_URL } from "../site";

export const metadata: Metadata = {
  title: "ショップ｜BOOTHデジタル商品",
  description:
    "TOGE BASEのBOOTHショップ。秋名・碓氷メモ、初心者チェックリスト、運営応援パックを任意購入できます。攻略本文は無料です。",
  alternates: { canonical: `${SITE_URL}/shop` },
  openGraph: {
    title: `ショップ｜${SITE_NAME}`,
    description:
      "ファン運営の任意購入コンテンツ。峠メモ・チェックリスト・応援パック。",
    url: `${SITE_URL}/shop`,
  },
};

export default function ShopPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "TOGE BASE ショップ",
        url: `${SITE_URL}/shop`,
        description:
          "イニシャルD非公式コミュニティ TOGE BASE のBOOTHデジタル商品一覧",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "ItemList",
        itemListElement: BOOTH_PRODUCTS.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.title,
            description: product.blurb,
            url: `${SITE_URL}/shop/${product.slug}`,
            brand: { "@type": "Brand", name: SITE_NAME },
            offers: {
              "@type": "Offer",
              url: product.href,
              priceCurrency: "JPY",
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: "TOGE BASE / BOOTH" },
            },
          },
        })),
      },
    ],
  };

  return (
    <SiteShell active="shop">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="legal-page shop-page">
        <p className="kicker">SHOP / BOOTH</p>
        <h1>
          任意購入の
          <br />
          <em>デジタル商品</em>
        </h1>
        <p className="lead">
          {COMMON_LEAD} 攻略本文はこれまで通り無料です。手元に残したいとき、応援したいときだけどうぞ。
        </p>

        <div className="guide-meta">
          <span>PR</span>
          <span>デジタルデータ</span>
          <span>購入は任意</span>
        </div>

        <div className="guide-actions">
          <a
            className="primary"
            href={BOOTH_SHOP_URL}
            target="_blank"
            rel={boothRel}
          >
            BOOTHショップを開く ↗
          </a>
          <Link className="secondary" href="/guides">
            無料の攻略を見る
          </Link>
        </div>

        <div className="shop-grid">
          {BOOTH_PRODUCTS.map((product) => (
            <article key={product.id} className="shop-card">
              <div className="shop-card-top">
                <span className="booth-pr">PR</span>
                <small>{product.label}</small>
              </div>
              <h2>{product.title}</h2>
              <p className="shop-price">
                <strong>{product.priceLabel}</strong>
                <span>{product.priceNote}</span>
              </p>
              <p>{product.blurb}</p>
              <h3>内容</h3>
              <ul>
                {product.contents.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="shop-card-actions">
                <a href={product.href} target="_blank" rel={boothRel}>
                  BOOTHで購入 ↗
                </a>
                <Link href={`/shop/${product.slug}`}>詳細を見る →</Link>
              </div>
            </article>
          ))}
        </div>

        <h2>購入前に</h2>
        <ul>
          <li>決済・ダウンロードはBOOTH上で完結します</li>
          <li>商品URL未設定の項目は、ショップTOPへ案内されます</li>
          <li>
            表記の詳細は{" "}
            <Link href="/affiliate-disclosure">広告・アフィリエイト表記</Link>
          </li>
        </ul>

        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/#support">支援セクション</Link>
          <Link href="/about">サイトについて</Link>
        </div>
      </article>
    </SiteShell>
  );
}
