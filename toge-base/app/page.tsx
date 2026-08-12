import type { Metadata } from "next";
import TogeApp from "./toge-app";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "./site";

const title = `${SITE_NAME}｜イニシャルDプレイヤーの攻略基地`;
const description = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: [
    "イニシャルD",
    "Initial D",
    "アーケード",
    "峠",
    "攻略",
    "コミュニティ",
    "秋名山",
    "碓氷峠",
    "AE86",
    "TOGE BASE",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title,
    description,
    url: SITE_URL,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description,
      inLanguage: "ja",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/#community?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
      logo: `${SITE_URL}/favicon.svg`,
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "TOGE BASEとは何ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "イニシャルDアーケードのプレイヤー向け非公式コミュニティです。攻略、車種情報、進捗記録、投稿をひとつの場所にまとめています。",
          },
        },
        {
          "@type": "Question",
          name: "初心者におすすめの車種は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "回頭性が高く扱いやすいAE86やEG6から始めるプレイヤーが多いです。詳細は初心者向け車種ガイドを参照してください。",
          },
        },
        {
          "@type": "Question",
          name: "公式サイトですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "いいえ。ファンによる非公式コミュニティサイトです。ゲームメーカーおよび権利者各社とは関係ありません。",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TogeApp />
    </>
  );
}
