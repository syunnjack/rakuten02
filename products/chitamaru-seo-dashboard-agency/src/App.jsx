import { useMemo, useState } from 'react'
import './App.css'

const clients = [
  { name: '終電ホテル', clicks: 1280, drop: -12, issue: '駅LPの内部リンク不足' },
  { name: 'GoalPilot', clicks: 420, drop: 4, issue: 'FAQの構造化未設置' },
  { name: 'まちリスト', clicks: 890, drop: -7, issue: '地域ページの重複タイトル' },
]

export default function App() {
  const [picked, setPicked] = useState(clients[0].name)
  const client = useMemo(() => clients.find((c) => c.name === picked), [picked])
  const report = `${client.name} 月次レポート\n流入: ${client.clicks}\n前月比: ${client.drop}%\n指摘: ${client.issue}\n次アクション: 指摘チケットを1件消化`

  return (
    <div className="wrap">
      <Header />
      <div className="grid two">
        {clients.map((c) => (
          <article className="card" key={c.name}>
            <h2>{c.name}</h2>
            <p>流入 {c.clicks} / 前月比 {c.drop}%</p>
            <p className="muted">指摘: {c.issue}</p>
            <button className="plain" onClick={() => setPicked(c.name)}>レポート対象にする</button>
          </article>
        ))}
      </div>
      <section className="card">
        <h2>月次レポ下書き — {client.name}</h2>
        <pre className="muted" style={{whiteSpace: 'pre-wrap'}}>{report}</pre>
        <button onClick={() => navigator.clipboard.writeText(report)}>コピー</button>
      </section>
      <Faq />
    </div>
  )
}


        function Header() {
          return (
            <header className="hero">
              <div className="kicker">📊 SEO Dashboard Agency / SEO管理ダッシュボード Agency</div>
              <h1>SEO管理ダッシュボード Agency</h1>
              <p className="lede">顧客ごとの順位・指摘・月次レポを1画面に。</p>
              <div className="meta">
                <span className="pill">¥3,800 / B2B</span>
                <span className="pill">Phase 3</span>
                <span className="pill">複数サイト／複数顧客のSEOを見る個人と制作会社</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/seo-dashboard-agency" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>複数顧客カード</li>
        <li>仮想の順位・流入サマリー</li>
        <li>指摘チケット</li>
        <li>月次レポート下書き</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "個人 Pro との違いは？",
    "個人 Pro は自サイト。Agency は複数顧客とレポ・チケットです。"
  ],
  [
    "今すぐ売るか？",
    "個人 Pro の実績後。リポは先に独立させておきます。"
  ]
]
          return (
            <section className="faq">
              <h2>FAQ</h2>
              {faqs.map(([q, a]) => (
                <div className="item" key={q}><strong>{q}</strong><p className="muted">{a}</p></div>
              ))}
            </section>
          )
        }
