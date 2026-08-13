import { useMemo, useState } from 'react'
import './App.css'

const templates = [
  { id: 'nagoya-1', title: '名古屋 1泊：名駅→大須→金山', spots: '名駅グルメ → 大須商店街 → 金山サウナ', stay: '名駅徒歩5分ビジネスホテル' },
  { id: 'tokyo-1', title: '東京 1泊：終電回避ルート', spots: 'ライブ会場 → 終電確認 → 駅チカ宿', stay: '新宿または東京駅' },
  { id: 'osaka-2', title: '大阪 2泊：食い倒れ＋移動', spots: '梅田 → 難波 → 神戸日帰り', stay: '難波＋三宮' },
]

export default function App() {
  const [from, setFrom] = useState('名古屋')
  const [to, setTo] = useState('大阪')
  const [days, setDays] = useState('1')
  const [picked, setPicked] = useState(templates[0].id)
  const tpl = useMemo(() => templates.find((t) => t.id === picked), [picked])
  const text = `${from} → ${to}（${days}泊）\n${tpl.title}\nスポット: ${tpl.spots}\n宿: ${tpl.stay}`

  return (
    <div className="wrap">
      <Header />
      <div className="form">
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="出発" />
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="到着" />
        <select value={days} onChange={(e) => setDays(e.target.value)}>
          <option value="1">1泊</option>
          <option value="2">2泊</option>
          <option value="3">3泊</option>
        </select>
      </div>
      <div className="grid two">
        {templates.map((t) => (
          <button key={t.id} className={picked === t.id ? '' : 'plain'} onClick={() => setPicked(t.id)}>{t.title}</button>
        ))}
      </div>
      <section className="card">
        <h2>旅程ドラフト</h2>
        <pre className="muted" style={{whiteSpace: 'pre-wrap'}}>{text}</pre>
        <button onClick={() => navigator.clipboard.writeText(text)}>コピー</button>
      </section>
      <Faq />
    </div>
  )
}


        function Header() {
          return (
            <header className="hero">
              <div className="kicker">🗺️ Trip Route Stay / 移動×宿×スポットの旅ルート支援</div>
              <h1>移動×宿×スポットの旅ルート支援</h1>
              <p className="lede">移動・宿・ローカルスポットを1本の旅程にする。</p>
              <div className="meta">
                <span className="pill">¥580 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">旅のルート設計を効率化したい人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/trip-route-stay" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>出発・到着・日数の入力</li>
        <li>スポット＋宿のテンプレ旅程</li>
        <li>コピー用 itinerary</li>
        <li>宿泊・スポットの monetization 枠</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "買い切りで何が届く？",
    "旅程テンプレとルート組み立てUIです。Pro で保存数と自動提案が増えます。"
  ],
  [
    "収益は？",
    "今はテンプレ買い切り。後から宿・スポット送客です。"
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
