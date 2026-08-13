import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'welfare-job-alert.saved'
const items = [
  {
    "title": "就労継続支援B型 スタッフ",
    "area": "名古屋",
    "kind": "新着",
    "price": 240,
    "tags": "未経験可"
  },
  {
    "title": "障害者雇用 事務補助",
    "area": "東京",
    "kind": "配慮あり",
    "price": 220,
    "tags": "時短"
  },
  {
    "title": "生活相談員",
    "area": "大阪",
    "kind": "締切",
    "price": 310,
    "tags": "資格優遇"
  },
  {
    "title": "グループホーム夜勤",
    "area": "愛知",
    "kind": "夜勤",
    "price": 280,
    "tags": "週2〜"
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
              <div className="kicker">🤝 Welfare Job Alert / 福祉系求人通知</div>
              <h1>福祉系求人通知</h1>
              <p className="lede">福祉・障害者雇用に特化した条件一致だけを追う。</p>
              <div className="meta">
                <span className="pill">¥980 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">障害者雇用・福祉領域の就職／採用</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/welfare-job-alert" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>職種・雇用形態・配慮条件</li>
        <li>事業所シードの一致表示</li>
        <li>求職者ウォッチ</li>
        <li>事業所掲載枠（準備）</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "なぜ特化？",
    "総合求人より競合が少なく、条件一致の価値がはっきりしています。"
  ],
  [
    "B2Bは？",
    "求職者の利用実績を見て事業所掲載に拡張します。"
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
