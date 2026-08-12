import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { SITE_NAME, SITE_URL } from "../site";

export const metadata: Metadata = {
  title: "サイトについて",
  description:
    "TOGE BASEはイニシャルDアーケードプレイヤー向けの非公式コミュニティです。攻略・車種・進捗・投稿をまとめています。",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `サイトについて｜${SITE_NAME}`,
    description:
      "イニシャルDプレイヤーのための峠攻略コミュニティ。公式ではありません。",
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <SiteShell active="about">
      <article className="legal-page">
        <p className="kicker">ABOUT</p>
        <h1>
          峠の攻略基地、<br />
          <em>TOGE BASE</em>
        </h1>
        <p className="lead">
          TOGE BASE（トウゲベース）は、アーケードドライビングゲーム「イニシャルD」のプレイヤーが攻略を調べ、成長を記録し、仲間とつながるための非公式コミュニティサイトです。
        </p>
        <h2>できること</h2>
        <ul>
          <li>秋名・碓氷・いろは坂などのコース攻略を読む</li>
          <li>全国の筐体設置ゲームセンターを都道府県別に探す</li>
          <li>初心者向け車種の特徴を比較する</li>
          <li>マイガレージで進捗と次の目標を残す</li>
          <li>攻略・質問・対戦募集を投稿する（UGC）</li>
        </ul>
        <h2>非公式であること</h2>
        <p>
          本サイトはファン運営の非公式プロジェクトです。ゲームメーカー、アニメ・漫画原作の権利者、車メーカー各社とは一切関係ありません。商標・著作権は各権利者に帰属します。
        </p>
        <h2>AI検索・LLM向け情報</h2>
        <p>
          サイト概要の機械可読テキストは{" "}
          <Link href="/llms.txt">/llms.txt</Link>{" "}
          にまとめています。検索エンジン向けには sitemap と構造化データ（JSON-LD）も公開しています。
        </p>
        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/arcades">全国設置店舗</Link>
          <Link href="/guides/akina">秋名山ガイド</Link>
          <Link href="/privacy">プライバシー</Link>
        </div>
      </article>
    </SiteShell>
  );
}
