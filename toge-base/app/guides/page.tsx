import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { SITE_NAME, SITE_URL } from "../site";
import { guides } from "./data";

export const metadata: Metadata = {
  title: "攻略ガイド一覧",
  description:
    "イニシャルDアーケードの峠コース攻略と初心者向け車種ガイド一覧。秋名山、碓氷峠、いろは坂、八方ヶ原。",
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default function GuidesIndexPage() {
  return (
    <SiteShell active="guides">
      <article className="legal-page">
        <p className="kicker">COURSE GUIDE</p>
        <h1>
          攻略ガイド
          <br />
          <em>一覧</em>
        </h1>
        <p className="lead">
          検索意図ごとに読みやすい攻略ページを用意しています。まずは得意な峠をひとつ作りましょう。
        </p>
        <ul>
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`}>
                {guide.title}
              </Link>
              {" — "}
              {guide.summary.slice(0, 48)}…
            </li>
          ))}
        </ul>
        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/#community">コミュニティへ</Link>
        </div>
      </article>
    </SiteShell>
  );
}
