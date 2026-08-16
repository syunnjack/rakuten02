import Link from "next/link"

const navItems = [
  ["トップ", "/"],
  ["スマホ・パソコン入門", "/beginner"],
  ["記事", "/articles"],
  ["ポートフォリオ", "/portfolio"],
  ["プロフィール", "/profile"],
  ["キャリア・学習", "/career-support"],
  ["相談する", "/services"],
  ["動画", "/videos"],
]

export default function GlobalNav() {
  return (
    <header className="global-header">
      <Link className="global-brand" href="/">
        <span>つ</span>
        <strong>積み上げログ<small>技術ブログ</small></strong>
      </Link>
      <nav aria-label="グローバルメニュー">
        {navItems.map(([label, href]) => (
          <Link href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <div className="global-actions">
        <Link className="global-store" href="/store">🛒&nbsp;ストア</Link>
        <Link className="global-github" href="https://github.com/syunnjack">GitHub ↗</Link>
      </div>
    </header>
  )
}
