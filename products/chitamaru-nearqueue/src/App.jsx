import { useState } from 'react'
import './App.css'

const key = 'nearqueue.tickets'
const pin = '2468'

function load() {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

export default function App() {
  const [tickets, setTickets] = useState(load)
  const [staff, setStaff] = useState(false)
  const [code, setCode] = useState('')

  function persist(next) {
    setTickets(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  function take() {
    const number = (tickets.at(-1)?.number ?? 0) + 1
    persist([...tickets, { number, status: 'waiting', at: new Date().toLocaleTimeString('ja-JP') }])
  }

  function setStatus(number, status) {
    persist(tickets.map((t) => t.number === number ? { ...t, status } : t))
  }

  const waiting = tickets.filter((t) => t.status === 'waiting')

  return (
    <div className="wrap">
      <Header />
      <section className="card">
        <h2>来店者</h2>
        <p className="muted">待ち {waiting.length} 組 / 目安 {waiting.length * 8} 分</p>
        <button onClick={take}>受付番号を取る</button>
        <div className="list" style={{marginTop: 12}}>
          {tickets.slice().reverse().map((t) => (
            <div className="item" key={t.number}>
              <strong>#{t.number}</strong> {t.status} <span className="muted">{t.at}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="staff">
        <h2>店舗ボード</h2>
        {!staff ? (
          <div className="row">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="スタッフPIN（2468）" />
            <button className="ghost" onClick={() => setStaff(code === pin)}>入室</button>
          </div>
        ) : (
          <div className="list">
            {waiting.map((t) => (
              <div className="item" key={t.number}>
                #{t.number}
                <button className="plain" onClick={() => setStatus(t.number, 'called')}>呼び出し</button>
                <button className="plain" onClick={() => setStatus(t.number, 'done')}>案内済</button>
              </div>
            ))}
            {waiting.length === 0 && <p className="muted">待ちはありません</p>}
          </div>
        )}
      </section>
      <Faq />
    </div>
  )
}


        function Header() {
          return (
            <header className="hero">
              <div className="kicker">🎟️ NearQueue / 受付番号・待ち時間システム</div>
              <h1>受付番号・待ち時間システム</h1>
              <p className="lede">近くの店舗で番号を取り、待ち時間を自分の時間に変える。</p>
              <div className="meta">
                <span className="pill">¥3,800 / B2B</span>
                <span className="pill">Phase 3</span>
                <span className="pill">美容・飲食・医療など、順番待ちを改善したい店舗</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/nearqueue" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>来店者の受付番号発行（デモ）</li>
        <li>待ち組数・目安時間</li>
        <li>スタッフボード（呼び出し／案内済）</li>
        <li>受付後のクーポン枠</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "個人向けに売る？",
    "デモは無料公開。売上は店舗ライセンスが本体です。"
  ],
  [
    "既存の reservation-waiting-time-v1 は？",
    "プロトタイプ。本リポが商品名・価格・導入導線を持った独立製品です。"
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
