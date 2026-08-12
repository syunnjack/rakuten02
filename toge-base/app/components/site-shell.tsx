import Link from "next/link";
import { SITE_NAME } from "../site";
import { BOOTH_SHOP_URL, boothRel } from "../booth";

export function SiteShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label={`${SITE_NAME} ホーム`}>
          <span className="brand-mark">
            <i />
          </span>
          <span>
            TOGE <b>BASE</b>
            <small>TOUGE PLAYER COMMUNITY</small>
          </span>
        </Link>
        <nav aria-label="メインメニュー">
          <Link className={active === "home" ? "active" : ""} href="/">
            ホーム
          </Link>
          <Link className={active === "guides" ? "active" : ""} href="/#guides">
            攻略
          </Link>
          <Link
            className={active === "arcades" ? "active" : ""}
            href="/arcades"
          >
            店舗
          </Link>
          <Link className={active === "about" ? "active" : ""} href="/about">
            について
          </Link>
          <Link href="/#community">コミュニティ</Link>
        </nav>
        <Link className="garage-button" href="/#community">
          <span>◉</span> コミュニティへ
        </Link>
      </header>
      {children}
      <footer className="footer">
        <div className="brand">
          <span className="brand-mark">
            <i />
          </span>
          <span>
            TOGE <b>BASE</b>
          </span>
        </div>
        <p>
          ファンによる非公式コミュニティサイトです。ゲームメーカーおよび権利者各社とは関係ありません。
        </p>
        <div>
          <Link href="/about">サイトについて</Link>
          <Link href="/privacy">プライバシー</Link>
          <Link href="/terms">利用規約</Link>
          <Link href="/affiliate-disclosure">広告表記</Link>
          <a href={BOOTH_SHOP_URL} target="_blank" rel={boothRel}>
            BOOTH
          </a>
          <Link href="/llms.txt">llms.txt</Link>
        </div>
      </footer>
    </main>
  );
}
