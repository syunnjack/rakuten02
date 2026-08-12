import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../components/site-shell";
import { SITE_NAME, SITE_URL } from "../site";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${SITE_NAME}のプライバシーポリシー。アクセス解析とブラウザ保存データの取り扱いを説明します。`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <article className="legal-page">
        <p className="kicker">PRIVACY</p>
        <h1>プライバシーポリシー</h1>
        <p className="lead">最終更新: 2026-08-12</p>
        <h2>収集する情報</h2>
        <p>
          マイガレージの進捗、コミュニティ投稿、アンケート投票は、原則としてお使いのブラウザ内（localStorage）に保存されます。サーバーへ送信する会員登録はありません。
        </p>
        <h2>アクセス解析</h2>
        <p>
          Google Analytics 4 を設定している場合、匿名化された利用状況を計測することがあります。広告識別子の取扱いは Google のポリシーに従います。
        </p>
        <h2>外部リンク</h2>
        <p>
          アフィリエイトや店舗リンク先での個人情報の取扱いは、各リンク先のポリシーが適用されます。
        </p>
        <h2>お問い合わせ</h2>
        <p>
          プライバシーに関するお問い合わせは{" "}
          <a href="mailto:support@togepass.jp">support@togepass.jp</a>{" "}
          までご連絡ください。
        </p>
        <div className="legal-nav">
          <Link href="/">トップへ戻る</Link>
          <Link href="/terms">利用規約</Link>
        </div>
      </article>
    </SiteShell>
  );
}
