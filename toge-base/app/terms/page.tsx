import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { SITE_NAME, SITE_URL } from "../site";

export const metadata: Metadata = {
  title: "利用規約",
  description: `${SITE_NAME}の利用規約。投稿内容と免責事項について定めます。`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <SiteShell>
      <article className="legal-page">
        <p className="kicker">TERMS</p>
        <h1>利用規約</h1>
        <p className="lead">最終更新: 2026-08-12</p>
        <h2>サービスの位置づけ</h2>
        <p>
          TOGE BASEはファンによる非公式コミュニティです。公式サポートではありません。掲載情報はプレイヤーの参考用であり、正確性や完全性を保証しません。
        </p>
        <h2>投稿について</h2>
        <ul>
          <li>法令や権利を侵害する投稿は禁止です</li>
          <li>個人情報や誹謗中傷を含む投稿は禁止です</li>
          <li>運営は不適切と判断した投稿を削除・非表示にできるものとします</li>
        </ul>
        <h2>免責</h2>
        <p>
          本サイトの利用により生じた損害について、運営は法令上許される範囲で責任を負いません。ゲーム内の仕様変更により攻略内容が古くなる場合があります。
        </p>
        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/affiliate-disclosure">広告表記</Link>
        </div>
      </article>
    </SiteShell>
  );
}
