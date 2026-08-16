import { useMemo, useState } from 'react'
import './App.css'

const favKey = 'busstay.favs'
const items = [
  {
    "title": "名鉄バスセンター徒歩3分",
    "area": "名古屋",
    "kind": "徒歩3分",
    "price": 6900,
    "walk": 3
  },
  {
    "title": "東京駅八重洲口 4分",
    "area": "東京",
    "kind": "徒歩4分",
    "price": 9800,
    "walk": 4
  },
  {
    "title": "大阪駅前 6分",
    "area": "大阪",
    "kind": "徒歩6分",
    "price": 8200,
    "walk": 6
  },
  {
    "title": "静岡駅バスターミナル 5分",
    "area": "静岡",
    "kind": "徒歩5分",
    "price": 5400,
    "walk": 5
  }
]

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('すべて')
  const [favs, setFavs] = useState(() => readArray(favKey))
  const kinds = ['すべて', ...new Set(items.map((item) => item.kind))]
  const filtered = useMemo(() => items.filter((item) => {
    const text = [item.title, item.area, item.kind, item.tags].join(' ')
    return text.includes(query) && (kind === 'すべて' || item.kind === kind)
  }), [query, kind])

  function toggle(id) {
    const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]
    setFavs(next)
    localStorage.setItem(favKey, JSON.stringify(next))
  }

  return (
    <div className="wrap">
      <Header />
      <div className="toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="駅・エリア・条件" />
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          {kinds.map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>
      <div className="grid two">
        {filtered.map((item) => (
          <article className="card" key={item.title}>
            <div className="meta">
              <span className="pill">{item.area}</span>
              <span className="pill">{item.kind}</span>
              {item.walk ? <span className="pill">徒歩{item.walk}分</span> : null}
            </div>
            <h2>{item.title}</h2>
            <p className="muted">{item.tags || '掲載サンプル'}</p>
            {item.price ? <p className="price">¥{item.price.toLocaleString()}</p> : null}
            <button className="plain" onClick={() => toggle(item.title)}>{favs.includes(item.title) ? '保存済み' : '保存'}</button>
          </article>
        ))}
      </div>
      <Faq />
    </div>
  )
}


        function Header() {
          return (
            <header className="hero">
              <div className="kicker">🚌 BusStay / バス到着後の宿探し</div>
              <h1>バス到着後の宿探し</h1>
              <p className="lede">到着バスターミナルから徒歩圏の宿だけを出す。</p>
              <div className="meta">
                <span className="pill">¥980 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">高速バス到着後に近い宿を即探したい人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/busstay" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>到着地点の選択</li>
        <li>徒歩分数での絞り込み</li>
        <li>今夜空きシード</li>
        <li>宿泊予約アフィ導線</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "bus-arrival-guide との関係は？",
    "プロトタイプ。BusStay が商品名・価格を持った独立リポです。"
  ],
  [
    "終電ホテルとの違いは？",
    "鉄道の終電ではなく、高速バス到着後の徒歩圏に特化します。"
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
