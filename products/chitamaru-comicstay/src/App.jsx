import { useMemo, useState } from 'react'
import './App.css'

const favKey = 'comicstay.favs'
const items = [
  {
    "title": "名駅 個室＋シャワー",
    "area": "名古屋",
    "kind": "個室",
    "price": 2200,
    "tags": "シャワー / 深夜"
  },
  {
    "title": "池袋 女性専用フロア",
    "area": "東京",
    "kind": "深夜滞在",
    "price": 2800,
    "tags": "個室"
  },
  {
    "title": "難波 座席多め",
    "area": "大阪",
    "kind": "座席",
    "price": 1500,
    "tags": "飲食可"
  },
  {
    "title": "金山 終電後に強い",
    "area": "名古屋",
    "kind": "深夜滞在",
    "price": 1900,
    "tags": "シャワーなし"
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
              <div className="kicker">📚 ComicStay / 漫画喫茶／ネットカフェ UGC検索</div>
              <h1>漫画喫茶／ネットカフェ UGC検索</h1>
              <p className="lede">個室・シャワー・深夜滞在。条件で漫画喫茶を探す。</p>
              <div className="meta">
                <span className="pill">¥980 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">個室・シャワー・深夜滞在などの条件で探したい人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/comicstay" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>個室／シャワー／深夜のフィルター</li>
        <li>UGCメモ</li>
        <li>施設カード</li>
        <li>掲載・キーワード広告枠</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "manga-cafe-finder との関係は？",
    "プロトタイプ。ComicStay が商品名の独立リポです。"
  ],
  [
    "終電後スポットとの違いは？",
    "漫画喫茶に特化し、滞在条件フィルターが本体です。"
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
