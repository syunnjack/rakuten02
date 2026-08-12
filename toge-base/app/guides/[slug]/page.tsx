import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoothSoftCta } from "../../components/booth-soft-cta";
import { SiteShell } from "../../components/site-shell";
import { SITE_NAME, SITE_URL } from "../../site";
import { getGuide, guides } from "../data";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const title = `${guide.title}｜${SITE_NAME}`;
  const description = guide.summary;
  return {
    title: guide.title,
    description,
    alternates: { canonical: `${SITE_URL}/guides/${guide.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/guides/${guide.slug}`,
      images: [{ url: "/og.svg", width: 1200, height: 630 }],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.summary,
        inLanguage: "ja",
        mainEntityOfPage: `${SITE_URL}/guides/${guide.slug}`,
        author: { "@type": "Organization", name: SITE_NAME },
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
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
            name: "攻略ガイド",
            item: `${SITE_URL}/guides`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: `${SITE_URL}/guides/${guide.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <SiteShell active="guides">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="legal-page">
        <p className="kicker">COURSE GUIDE</p>
        <h1>
          {guide.course}
          <br />
          <em>攻略ポイント</em>
        </h1>
        <div className="guide-meta">
          <span>{guide.level}</span>
          <span>{guide.course}</span>
          <span>非公式ガイド</span>
        </div>
        <p className="lead">{guide.summary}</p>

        <h2>AI検索向けの要点</h2>
        <ul>
          {guide.keypoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <h2>練習メニュー</h2>
        <ul>
          {guide.practice.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>よくある質問</h2>
        {guide.faq.map((item) => (
          <div key={item.q}>
            <h3 style={{ fontSize: 16, marginTop: 20 }}>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}

        <div className="guide-actions">
          <Link className="primary" href="/#community">
            コミュニティで質問する →
          </Link>
          <Link className="secondary" href="/guides">
            ガイド一覧へ
          </Link>
        </div>

        <BoothSoftCta variant="guide" guideTitle={guide.title} />

        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/about">サイトについて</Link>
        </div>
      </article>
    </SiteShell>
  );
}
