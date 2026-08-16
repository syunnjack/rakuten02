import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'open-close-radar.saved'
const items = [
  {
    "title": "金山に新ラーメン店",
    "area": "名古屋",
    "kind": "開店",
    "price": 0,
    "tags": "深夜"
  },
  {
    "title": "大須の古書店が閉店",
    "area": "名古屋",
    "kind": "閉店",
    "price": 0,
    "tags": "週末まで"
  },
  {
    "title": "下北沢にコーヒー新店",
    "area": "東京",
    "kind": "開店",
    "price": 0,
    "tags": "11時〜"
  },
  {
    "title": "心斎橋の雑貨店が移転",
    "area": "大阪",
    "kind": "閉店",
    "price": 0,
    "tags": "移転先あり"
  }
]

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('すべて')
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const kinds = ['すべて', ...new Set(items.map((item) => item.kind))]
  const filtered = useMemo(() => items.filter((item) => {
    const text = [item.title, item.area, item.kind, item.tags].join(' ')
    return text.includes(query) && (kind === 'すべて' || item.kind === kind)
  }), [query, kind])

  function toggle(id) {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  return (
    <div className="wrap">
      <Header />
      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="エリア・条件で検索" />
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          {kinds.map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="grid two">
        {filtered.map((item) => (
          <article className="card" key={item.title}>
            <div className="meta"><span className="pill">{item.area}</span><span className="pill">{item.kind}</span></div>
            <h2>{item.title}</h2>
            <p className="muted">{item.tags || '条件一致のサンプル'}</p>
            {item.price ? <p className="price">¥{item.price.toLocaleString()}{item.delta ? '（' + item.delta + '）' : ''}</p> : null}
            <button className="plain" onClick={() => toggle(item.title)}>{saved.includes(item.title) ? 'ウォッチ中' : 'ウォッチに追加'}</button>
          </article>
        ))}
      </div>
      <p className="muted">保存中 {saved.length} 件（この端末の localStorage）</p>
      <Faq />
    </div>
  )
}


        function Header() {
          return (
            <header className="hero">
              <div className="kicker">📡 Open/Close Radar / 開店閉店レーダー＋通知</div>
              <h1>開店閉店レーダー＋通知</h1>
              <p className="lede">近所の開店・閉店を、UGCと通知で速報する。</p>
              <div className="meta">
                <span className="pill">¥580 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">地域の開店閉店速報を追う生活者＋露出したい店舗</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/open-close-radar" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>地域の開店／閉店シード</li>
        <li>UGC投稿（ローカル保存）</li>
        <li>ウォッチ</li>
        <li>店舗掲載・スポンサー枠</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "情報の鮮度は？",
    "MVPはシード＋UGC。通知月額で継続率を見てから自動収集します。"
  ],
  [
    "店舗側は？",
    "個人の速報が回ってから掲載課金にします。"
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
