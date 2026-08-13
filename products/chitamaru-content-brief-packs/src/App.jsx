import { useMemo, useState } from 'react'
import './App.css'

const packs = {
  不動産: {
    intent: 'エリア × 家賃 × 駅徒歩で比較したい',
    h2: ['駅徒歩の目安', '初期費用の内訳', '周辺の生活施設'],
    cta: '希望条件を保存して物件アラートへ',
  },
  転職: {
    intent: '条件一致の求人だけを追いたい',
    h2: ['必須スキル', '働き方（リモート/夜勤）', '選考の次アクション'],
    cta: '条件をウォッチに追加',
  },
  飲食: {
    intent: '駅チカで今夜空いている店を選びたい',
    h2: ['ジャンル', '予算', '終電までの滞在可否'],
    cta: '店舗の空き状況を見る',
  },
}

export default function App() {
  const [industry, setIndustry] = useState('不動産')
  const [keyword, setKeyword] = useState('金山 賃貸')
  const pack = packs[industry]
  const brief = useMemo(() => {
    return [
      `# ${keyword}｜${industry}ブリーフ`,
      `検索意図: ${pack.intent}`,
      ...pack.h2.map((h, i) => `H2-${i + 1}: ${h}`),
      `CTA: ${pack.cta}`,
      '一次情報: 公式・料金・アクセスを必ず確認',
    ].join('\n')
  }, [industry, keyword, pack])

  return (
    <div className="wrap">
      <Header />
      <div className="form">
        <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
          {Object.keys(packs).map((k) => <option key={k}>{k}</option>)}
        </select>
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="キーワード" />
      </div>
      <section className="card">
        <h2>{industry}パック（¥580）</h2>
        <pre className="muted" style={{whiteSpace: 'pre-wrap'}}>{brief}</pre>
        <button onClick={() => navigator.clipboard.writeText(brief)}>ブリーフをコピー</button>
      </section>
      <Faq />
    </div>
  )
}


        function Header() {
          return (
            <header className="hero">
              <div className="kicker">📝 Content Brief Packs / 業界別コンテンツブリーフ素材集</div>
              <h1>業界別コンテンツブリーフ素材集</h1>
              <p className="lede">業界別テンプレで、ブリーフをすぐ書き出せる。</p>
              <div className="meta">
                <span className="pill">¥580 / 買い切り</span>
                <span className="pill">Phase 1</span>
                <span className="pill">不動産／転職／飲食の記事を量産したい個人</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/content-brief-packs" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                <li>不動産・転職・飲食の3パック</li>
        <li>見出し・検索意図・CTAの雛形</li>
        <li>コピー出力</li>
        <li>シリーズ追加販売</li>
              </ul>
            </header>
          )
        }

        function Faq() {
          const faqs = [
  [
    "既存の Content Brief Engine は？",
    "本体ツールは既掲載。本リポは業界別素材の分岐商品です。"
  ],
  [
    "なぜ ¥580？",
    "試し買い単価。業界を増やして複数買いを取ります。"
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
