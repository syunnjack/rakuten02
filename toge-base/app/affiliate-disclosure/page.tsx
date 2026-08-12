import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { SITE_NAME, SITE_URL } from "../site";

export const metadata: Metadata = {
  title: "広告・アフィリエイト表記",
  description: `${SITE_NAME}の広告・アフィリエイト・スポンサー掲載に関する表記です。`,
  alternates: { canonical: `${SITE_URL}/affiliate-disclosure` },
};

export default function AffiliateDisclosurePage() {
  return (
    <SiteShell>
      <article className="legal-page">
        <p className="kicker">DISCLOSURE</p>
        <h1>広告・アフィリエイト表記</h1>
        <p className="lead">
          TOGE BASEでは、サイト運営のためにアフィリエイトリンクやスポンサー掲載を行う場合があります。
        </p>
        <h2>方針</h2>
        <ul>
          <li>攻略評価は広告・提携の有無で変更しません</li>
          <li>広告・スポンサー投稿には「PR」を明示します</li>
          <li>
            外部アフィリエイトリンクには{" "}
            <code>rel=&quot;nofollow sponsored noopener&quot;</code>{" "}
            を付与します
          </li>
        </ul>
        <h2>お問い合わせ</h2>
        <p>
          掲載相談:{" "}
          <a href="mailto:partner@togepass.jp">partner@togepass.jp</a>
        </p>
        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/#support">支援・掲載セクション</Link>
        </div>
      </article>
    </SiteShell>
  );
}
