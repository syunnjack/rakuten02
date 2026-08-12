import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "../../components/site-shell";
import {
  BOOTH_PRODUCTS,
  BOOTH_SHOP_URL,
  COMMON_LEAD,
  COMMON_NOTES,
  boothRel,
  getBoothProduct,
} from "../../booth";
import { SITE_NAME, SITE_URL } from "../../site";

export function generateStaticParams() {
  return BOOTH_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getBoothProduct(slug);
  if (!product) return {};
  return {
    title: product.title,
    description: product.blurb,
    alternates: { canonical: `${SITE_URL}/shop/${product.slug}` },
    openGraph: {
      title: `${product.title}｜${SITE_NAME}`,
      description: product.blurb,
      url: `${SITE_URL}/shop/${product.slug}`,
    },
  };
}

export default async function ShopProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getBoothProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.blurb,
    brand: { "@type": "Brand", name: SITE_NAME },
    url: `${SITE_URL}/shop/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: product.href,
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "TOGE BASE / BOOTH" },
    },
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
          {product.label}
          <br />
          <em>デジタル商品</em>
        </h1>
        <div className="guide-meta">
          <span className="booth-pr">PR</span>
          <span>{product.priceLabel}</span>
          <span>任意購入</span>
        </div>
        <p className="lead">{product.title}</p>
        <p>{COMMON_LEAD}</p>

        <p className="shop-price detail">
          <strong>{product.priceLabel}</strong>
          <span>{product.priceNote}</span>
        </p>

        <div className="guide-actions">
          <a
            className="primary"
            href={product.href}
            target="_blank"
            rel={boothRel}
          >
            BOOTHで購入する ↗
          </a>
          <a
            className="secondary"
            href={BOOTH_SHOP_URL}
            target="_blank"
            rel={boothRel}
          >
            ショップTOP
          </a>
        </div>

        <h2>内容</h2>
        <ul>
          {product.contents.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <h2>こんな人向け</h2>
        <ul>
          {product.audience.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <h2>注意</h2>
        <ul>
          {COMMON_NOTES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p className="booth-inline">
          決済・ダウンロードはBOOTHで行います。公開前の商品URLはショップTOPへフォールバックします。
        </p>

        <div className="legal-nav">
          <Link href="/shop">ショップ一覧へ</Link>
          <Link href="/guides">無料攻略へ</Link>
          <Link href="/affiliate-disclosure">広告表記</Link>
        </div>
      </article>
    </SiteShell>
  );
}
