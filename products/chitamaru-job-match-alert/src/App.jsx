import { useMemo, useState } from 'react'
import './App.css'

const saveKey = 'job-match-alert.saved'
const items = [
  {
    "title": "フロントエンド（リモート可）",
    "area": "東京",
    "kind": "新着",
    "price": 520,
    "tags": "React / 週4"
  },
  {
    "title": "カスタマーサポート締切間近",
    "area": "名古屋",
    "kind": "締切",
    "price": 280,
    "tags": "時短 / 駅チカ"
  },
  {
    "title": "面接枠 今週木曜 19時",
    "area": "大阪",
    "kind": "面接枠",
    "price": 350,
    "tags": "インサイドセールス"
  },
  {
    "title": "PdM 業務委託",
    "area": "福岡",
    "kind": "新着",
    "price": 700,
    "tags": "スタートアップ"
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
              <div className="kicker">💼 Job Match Alert / 求人条件一致通知</div>
              <h1>求人条件一致通知</h1>
              <p className="lede">希望条件を一度保存すれば、一致した求人だけを追える。</p>
              <div className="meta">
                <span className="pill">¥980 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">転職活動を通知で回したい人（新着・締切・面接枠）</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/job-match-alert" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>職種・年収・勤務地・リモート条件</li>
        <li>新着・締切・面接枠の一致表示</li>
        <li>保存条件のローカル管理</li>
        <li>後の採用媒体・人材紹介課金へ接続</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "誰向け？",
    "通知で転職を回したい個人。事業所掲載は Phase 3 です。"
  ],
  [
    "成果報酬は？",
    "個人の継続利用が見えてから、掲載・採用課金に拡張します。"
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
