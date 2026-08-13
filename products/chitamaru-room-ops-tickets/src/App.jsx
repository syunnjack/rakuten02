import { useState } from 'react'
import './App.css'

const key = 'room-ops.orders'
const checks = ['投稿文の差し替え', 'リンク診断', '週次の勝ちパターンメモ', 'ROOMプロフィール点検']

function load() {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

export default function App() {
  const [orders, setOrders] = useState(load)
  const [memo, setMemo] = useState('')
  const [picked, setPicked] = useState([checks[0]])

  function toggle(item) {
    setPicked((cur) => cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item])
  }

  function submit(event) {
    event.preventDefault()
    const next = [{ id: crypto.randomUUID(), memo, picked, price: 4800, date: new Date().toLocaleString('ja-JP') }, ...orders]
    setOrders(next)
    localStorage.setItem(key, JSON.stringify(next))
    setMemo('')
  }

  return (
    <div className="wrap">
      <Header />
      <form className="form" onSubmit={submit} style={{flexDirection: 'column'}}>
        <p className="price">1回 ¥4,800（作業範囲が読みやすいPPV）</p>
        {checks.map((item) => (
          <label key={item}><input type="checkbox" checked={picked.includes(item)} onChange={() => toggle(item)} /> {item}</label>
        ))}
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="今週見てほしいROOM URL / 困りごと" />
        <button type="submit">チケット下書きを残す</button>
      </form>
      <section className="card">
        <h2>この端末の申込下書き</h2>
        {orders.length === 0 && <p className="muted">まだありません。BOOTHで決済後、この内容をメッセージに貼ってください。</p>}
        {orders.map((o) => (
          <div className="item" key={o.id}>
            <strong>{o.date}</strong> ¥{o.price.toLocaleString()} — {o.picked.join(' / ')}
            <div className="muted">{o.memo}</div>
          </div>
        ))}
      </section>
      <Faq />
    </div>
  )
}


        function Header() {
          return (
            <header className="hero">
              <div className="kicker">🛠️ ROOM Ops Tickets / 楽天ROOM 週次改善チケット</div>
              <h1>楽天ROOM 週次改善チケット</h1>
              <p className="lede">週次で投稿・差し替えを1チケットずつ頼める。</p>
              <div className="meta">
                <span className="pill">¥4,800 / PPV</span>
                <span className="pill">Phase 1</span>
                <span className="pill">ROOMツール購入者で、投稿の差し替えを任せたい人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/room-ops-tickets" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>改善チケットの申込フォーム</li>
        <li>作業範囲のチェックリスト</li>
        <li>見積が立てやすい1回 ¥4,800</li>
        <li>ROOMツールへのアップセル</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "ツール本体との違いは？",
    "本体は買い切りWebアプリ。これは運用代行のPPVです。"
  ],
  [
    "納品物は？",
    "投稿文差し替え案とチェック結果。申込内容はローカルに残します。"
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
