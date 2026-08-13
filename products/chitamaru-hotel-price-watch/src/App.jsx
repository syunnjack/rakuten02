import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'hotel-price-watch.saved'
const items = [
  {
    "title": "名駅カプセル 今夜空室",
    "area": "名古屋",
    "kind": "空室",
    "price": 4800,
    "delta": -900,
    "walk": 4
  },
  {
    "title": "東京駅前ビジネスホテル 値下げ",
    "area": "東京",
    "kind": "値下げ",
    "price": 8900,
    "delta": -1500,
    "walk": 6
  },
  {
    "title": "大阪難波 週末プラン",
    "area": "大阪",
    "kind": "週末",
    "price": 7200,
    "delta": -400,
    "walk": 8
  },
  {
    "title": "静岡駅 イベント翌日",
    "area": "静岡",
    "kind": "イベント",
    "price": 6100,
    "delta": -200,
    "walk": 5
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
              <div className="kicker">🏨 Hotel Price Watch / 宿泊空室・値下げアラート</div>
              <h1>宿泊空室・値下げアラート</h1>
              <p className="lede">エリアと上限金額を保存して、空室と値下げの瞬間を逃さない。</p>
              <div className="meta">
                <span className="pill">¥980 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">出張・旅行で今安い／空いている宿を即取りたい人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/hotel-price-watch" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>エリア・日程・上限金額のウォッチ登録</li>
        <li>空室・値下げシードの条件一致表示</li>
        <li>保存ウォッチのローカル管理</li>
        <li>予約アフィ／有料通知への導線</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "無料と有料の違いは？",
    "閲覧は無料。条件保存と通知は買い切りキット、継続通知は月額 Pro です。"
  ],
  [
    "B2Bはいつ？",
    "個人のウォッチ実績ができてから、ホテル掲載枠として拡張します。"
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
