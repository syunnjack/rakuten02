import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'midnight-spot-alert.saved'
const items = [
  {
    "title": "名駅サウナ 終電後休憩",
    "area": "名古屋",
    "kind": "休憩",
    "price": 1800,
    "tags": "仮眠可"
  },
  {
    "title": "新宿 漫画喫茶 個室",
    "area": "東京",
    "kind": "仮眠",
    "price": 2500,
    "tags": "シャワー"
  },
  {
    "title": "梅田 24h食堂",
    "area": "大阪",
    "kind": "食事",
    "price": 980,
    "tags": "駅ナカ"
  },
  {
    "title": "静岡駅前 カプセル",
    "area": "静岡",
    "kind": "仮眠",
    "price": 3200,
    "tags": "荷物預かり"
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
              <div className="kicker">🌙 Midnight Spot Alert / 終電後スポット通知</div>
              <h1>終電後スポット通知</h1>
              <p className="lede">終電を逃した夜に、休憩・食事・仮眠の候補をすぐ出す。</p>
              <div className="meta">
                <span className="pill">¥580 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">終電後の休憩／食事／仮眠を探す人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/midnight-spot-alert" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>駅・種別（休憩／食事／仮眠）</li>
        <li>終電後スポットのシード検索</li>
        <li>ウォッチ保存</li>
        <li>終電ホテルへの送客</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "終電ホテルとの違いは？",
    "ホテル以外（サウナ・漫画喫茶・飲食）を先に出す補完ラインです。"
  ],
  [
    "月額は？",
    "Phase 2 で通知月額 ¥580。今は買い切りガイドとして出します。"
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
