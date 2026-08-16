import { useMemo, useState } from 'react'
import './App.css'

const favKey = 'work-bar-navi.favs'
const items = [
  {
    "title": "名駅 ガールズバーホール",
    "area": "名古屋",
    "kind": "求人",
    "price": 18000,
    "tags": "日払い"
  },
  {
    "title": "錦 スナックママ候補",
    "area": "名古屋",
    "kind": "お店",
    "price": 0,
    "tags": "21時〜"
  },
  {
    "title": "新宿 短時間キッチン",
    "area": "東京",
    "kind": "求人",
    "price": 1500,
    "tags": "時給"
  },
  {
    "title": "梅田 スポンサー枠サンプル",
    "area": "大阪",
    "kind": "掲載",
    "price": 2480,
    "tags": "広告"
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
              <div className="kicker">🌃 Work Bar Navi / 夜のお店／仕事／エリアナビ</div>
              <h1>夜のお店／仕事／エリアナビ</h1>
              <p className="lede">エリア×業態で、夜の仕事とお店を一本のナビにする。</p>
              <div className="meta">
                <span className="pill">¥980 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">夜勤・短時間・飲み／仕事導線をまとめたい層</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/work-bar-navi" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>エリア・業態フィルター</li>
        <li>求人／店舗カード</li>
        <li>スポンサー枠のプレースホルダ</li>
        <li>送客・掲載課金の導線</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "個人の買い切りは何？",
    "エリアナビの使い方キットとローカル保存。掲載課金は店舗向けです。"
  ],
  [
    "収益の柱は？",
    "最終的にはスポンサー・掲載・送客アフィです。"
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
