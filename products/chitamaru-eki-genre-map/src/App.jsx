import { useMemo, useState } from 'react'
import './App.css'

const favKey = 'eki-genre-map.favs'
const items = [
  {
    "title": "金山 × ラーメン",
    "area": "金山",
    "kind": "ラーメン",
    "price": 0,
    "tags": "深夜"
  },
  {
    "title": "栄 × ダーツ",
    "area": "栄",
    "kind": "ダーツ",
    "price": 0,
    "tags": "クーポン"
  },
  {
    "title": "東京 × サウナ",
    "area": "東京",
    "kind": "サウナ",
    "price": 0,
    "tags": "終電後"
  },
  {
    "title": "大阪 × 漫画喫茶",
    "area": "大阪",
    "kind": "漫画喫茶",
    "price": 0,
    "tags": "個室"
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
              <div className="kicker">🚉 Eki Genre Map / 駅×ジャンルのローカル発見マップ</div>
              <h1>駅×ジャンルのローカル発見マップ</h1>
              <p className="lede">駅名とジャンルを選ぶだけで、近場の候補が出る。</p>
              <div className="meta">
                <span className="pill">¥980 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">近場で何があるかを駅から探したい人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/eki-genre-map" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>駅×ジャンルのマトリクス</li>
        <li>スポットカード</li>
        <li>お気に入り保存</li>
        <li>ローカル広告・掲載枠</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "まちリストとの違いは？",
    "駅起点×ジャンル発見に特化しています。"
  ],
  [
    "掲載単価は？",
    "B2Bは ¥1,980〜。個人の発見ツールは ¥980 買い切りです。"
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
