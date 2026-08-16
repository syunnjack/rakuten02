import { useMemo, useState } from 'react'
import './App.css'

const favKey = 'my-dartslive.favs'
const items = [
  {
    "title": "名古屋 大会会場（ thr.）",
    "area": "名古屋",
    "kind": "大会",
    "price": 0,
    "tags": "クーポン"
  },
  {
    "title": "新宿 深夜営業",
    "area": "東京",
    "kind": "深夜",
    "price": 0,
    "tags": "LIVE"
  },
  {
    "title": "梅田 初回クーポン",
    "area": "大阪",
    "kind": "クーポン",
    "price": 500,
    "tags": "2時間"
  },
  {
    "title": "栄 マシン多め",
    "area": "名古屋",
    "kind": "設備",
    "price": 0,
    "tags": "大会可"
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
              <div className="kicker">🎯 My Dartslive / ダーツ施設横断 UGC</div>
              <h1>ダーツ施設横断 UGC</h1>
              <p className="lede">大会・クーポン・深夜。ダーツ施設を横断して探す。</p>
              <div className="meta">
                <span className="pill">¥2,480 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">大会／クーポン／深夜営業などで施設を探す層</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/my-dartslive" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>施設条件フィルター</li>
        <li>大会・クーポン・深夜タグ</li>
        <li>UGC</li>
        <li>施設掲載課金枠</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "なぜ ¥2,480？",
    "UGC・大会・クーポンまで揃う横断検索で、本気で施設を探す層向けです。"
  ],
  [
    "B2Bは？",
    "個人利用のあと、施設掲載とクーポン枠です。"
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
