import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'subsidy-alert-hub.saved'
const items = [
  {
    "title": "小規模持続化補助金",
    "area": "全国",
    "kind": "締切21日",
    "price": 50,
    "tags": "販路開拓"
  },
  {
    "title": "IT導入補助金",
    "area": "全国",
    "kind": "締切35日",
    "price": 450,
    "tags": "ツール導入"
  },
  {
    "title": "愛知県 創業支援",
    "area": "愛知",
    "kind": "締切12日",
    "price": 100,
    "tags": "創業"
  },
  {
    "title": "ものづくり補助金",
    "area": "全国",
    "kind": "締切48日",
    "price": 750,
    "tags": "設備"
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
              <div className="kicker">📋 Subsidy Alert Hub / 補助金・助成金期限通知</div>
              <h1>補助金・助成金期限通知</h1>
              <p className="lede">締切が命の補助金を、期限順で見逃さない。</p>
              <div className="meta">
                <span className="pill">¥2,480 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">個人事業主・小規模事業者（期限が命）</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/subsidy-alert-hub" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>制度名・対象・締切の一覧</li>
        <li>残り日数ソート</li>
        <li>ウォッチ登録</li>
        <li>士業相談への橋渡し枠</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "個人事業主でも使える？",
    "はい。Phase 1 は個人事業主の買い切り。事務所向けは同じ画面の複数顧客版です。"
  ],
  [
    "通知上限は？",
    "買い切りはローカル保存。月額・B2Bで件数上限を制御します。"
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
