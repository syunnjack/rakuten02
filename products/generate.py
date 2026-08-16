#!/usr/bin/env python3
"""Generate 16 independent Chitamaru product repositories from catalog.json."""

from __future__ import annotations

import json
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
OWNER = CATALOG["owner"]

GITIGNORE = """node_modules
dist
.DS_Store
*.local
.env
.env.*
"""

LICENSE = "MIT License — Copyright (c) 2026 Chitamaru / syunnjack\n"

INDEX_CSS = """:root {
  color-scheme: light;
  --bg: #f6f3ee;
  --card: #fffdf8;
  --ink: #1f1a16;
  --muted: #6b6158;
  --line: #e6ddd2;
  --accent: #c45c26;
  --accent-2: #2f5d50;
  font-family: "Hiragino Sans", "Noto Sans JP", sans-serif;
}
* { box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; background: var(--bg); color: var(--ink); }
button, input, select, textarea {
  font: inherit;
}
"""

APP_CSS = """.wrap { max-width: 960px; margin: 0 auto; padding: 24px 16px 80px; }
.hero { display: grid; gap: 10px; margin-bottom: 20px; }
.kicker { color: var(--accent); font-weight: 700; letter-spacing: .08em; font-size: 12px; }
h1 { margin: 0; font-size: 28px; line-height: 1.3; }
.lede { color: var(--muted); margin: 0; }
.meta { display: flex; gap: 8px; flex-wrap: wrap; }
.pill, .tag {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
}
.toolbar, .form, .card, .faq, .staff {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
}
.toolbar, .form, .row { display: flex; gap: 8px; flex-wrap: wrap; }
input, select, textarea {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  min-width: 140px;
  flex: 1;
}
textarea { min-height: 88px; width: 100%; }
button {
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
}
button.ghost { background: var(--accent-2); }
button.plain { background: #fff; color: var(--ink); border: 1px solid var(--line); }
.grid { display: grid; gap: 12px; }
@media (min-width: 720px) { .grid.two { grid-template-columns: 1fr 1fr; } }
.card h2, .card h3 { margin: 0 0 8px; font-size: 18px; }
.muted { color: var(--muted); font-size: 14px; }
.price { font-weight: 800; color: var(--accent-2); }
.cta {
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
  margin: 8px 0 16px;
}
a.buy {
  display: inline-block;
  background: var(--ink);
  color: #fff;
  text-decoration: none;
  border-radius: 999px;
  padding: 10px 16px;
}
.list { display: grid; gap: 8px; }
.item { border-bottom: 1px dashed var(--line); padding-bottom: 8px; }
"""

MAIN_JSX = """import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
"""


def js_str(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def js(value) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2)


SEEDS = {
    "hotel": [
        {"title": "名駅カプセル 今夜空室", "area": "名古屋", "kind": "空室", "price": 4800, "delta": -900, "walk": 4},
        {"title": "東京駅前ビジネスホテル 値下げ", "area": "東京", "kind": "値下げ", "price": 8900, "delta": -1500, "walk": 6},
        {"title": "大阪難波 週末プラン", "area": "大阪", "kind": "週末", "price": 7200, "delta": -400, "walk": 8},
        {"title": "静岡駅 イベント翌日", "area": "静岡", "kind": "イベント", "price": 6100, "delta": -200, "walk": 5},
    ],
    "job": [
        {"title": "フロントエンド（リモート可）", "area": "東京", "kind": "新着", "price": 520, "tags": "React / 週4"},
        {"title": "カスタマーサポート締切間近", "area": "名古屋", "kind": "締切", "price": 280, "tags": "時短 / 駅チカ"},
        {"title": "面接枠 今週木曜 19時", "area": "大阪", "kind": "面接枠", "price": 350, "tags": "インサイドセールス"},
        {"title": "PdM 業務委託", "area": "福岡", "kind": "新着", "price": 700, "tags": "スタートアップ"},
    ],
    "subsidy": [
        {"title": "小規模持続化補助金", "area": "全国", "kind": "締切21日", "price": 50, "tags": "販路開拓"},
        {"title": "IT導入補助金", "area": "全国", "kind": "締切35日", "price": 450, "tags": "ツール導入"},
        {"title": "愛知県 創業支援", "area": "愛知", "kind": "締切12日", "price": 100, "tags": "創業"},
        {"title": "ものづくり補助金", "area": "全国", "kind": "締切48日", "price": 750, "tags": "設備"},
    ],
    "midnight": [
        {"title": "名駅サウナ 終電後休憩", "area": "名古屋", "kind": "休憩", "price": 1800, "tags": "仮眠可"},
        {"title": "新宿 漫画喫茶 個室", "area": "東京", "kind": "仮眠", "price": 2500, "tags": "シャワー"},
        {"title": "梅田 24h食堂", "area": "大阪", "kind": "食事", "price": 980, "tags": "駅ナカ"},
        {"title": "静岡駅前 カプセル", "area": "静岡", "kind": "仮眠", "price": 3200, "tags": "荷物預かり"},
    ],
    "welfare": [
        {"title": "就労継続支援B型 スタッフ", "area": "名古屋", "kind": "新着", "price": 240, "tags": "未経験可"},
        {"title": "障害者雇用 事務補助", "area": "東京", "kind": "配慮あり", "price": 220, "tags": "時短"},
        {"title": "生活相談員", "area": "大阪", "kind": "締切", "price": 310, "tags": "資格優遇"},
        {"title": "グループホーム夜勤", "area": "愛知", "kind": "夜勤", "price": 280, "tags": "週2〜"},
    ],
    "openclose": [
        {"title": "金山に新ラーメン店", "area": "名古屋", "kind": "開店", "price": 0, "tags": "深夜"},
        {"title": "大須の古書店が閉店", "area": "名古屋", "kind": "閉店", "price": 0, "tags": "週末まで"},
        {"title": "下北沢にコーヒー新店", "area": "東京", "kind": "開店", "price": 0, "tags": "11時〜"},
        {"title": "心斎橋の雑貨店が移転", "area": "大阪", "kind": "閉店", "price": 0, "tags": "移転先あり"},
    ],
    "workbar": [
        {"title": "名駅 ガールズバーホール", "area": "名古屋", "kind": "求人", "price": 18000, "tags": "日払い"},
        {"title": "錦 スナックママ候補", "area": "名古屋", "kind": "お店", "price": 0, "tags": "21時〜"},
        {"title": "新宿 短時間キッチン", "area": "東京", "kind": "求人", "price": 1500, "tags": "時給"},
        {"title": "梅田 スポンサー枠サンプル", "area": "大阪", "kind": "掲載", "price": 2480, "tags": "広告"},
    ],
    "busstay": [
        {"title": "名鉄バスセンター徒歩3分", "area": "名古屋", "kind": "徒歩3分", "price": 6900, "walk": 3},
        {"title": "東京駅八重洲口 4分", "area": "東京", "kind": "徒歩4分", "price": 9800, "walk": 4},
        {"title": "大阪駅前 6分", "area": "大阪", "kind": "徒歩6分", "price": 8200, "walk": 6},
        {"title": "静岡駅バスターミナル 5分", "area": "静岡", "kind": "徒歩5分", "price": 5400, "walk": 5},
    ],
    "comic": [
        {"title": "名駅 個室＋シャワー", "area": "名古屋", "kind": "個室", "price": 2200, "tags": "シャワー / 深夜"},
        {"title": "池袋 女性専用フロア", "area": "東京", "kind": "深夜滞在", "price": 2800, "tags": "個室"},
        {"title": "難波 座席多め", "area": "大阪", "kind": "座席", "price": 1500, "tags": "飲食可"},
        {"title": "金山 終電後に強い", "area": "名古屋", "kind": "深夜滞在", "price": 1900, "tags": "シャワーなし"},
    ],
    "darts": [
        {"title": "名古屋 大会会場（ thr.）", "area": "名古屋", "kind": "大会", "price": 0, "tags": "クーポン"},
        {"title": "新宿 深夜営業", "area": "東京", "kind": "深夜", "price": 0, "tags": "LIVE"},
        {"title": "梅田 初回クーポン", "area": "大阪", "kind": "クーポン", "price": 500, "tags": "2時間"},
        {"title": "栄 マシン多め", "area": "名古屋", "kind": "設備", "price": 0, "tags": "大会可"},
    ],
    "eki": [
        {"title": "金山 × ラーメン", "area": "金山", "kind": "ラーメン", "price": 0, "tags": "深夜"},
        {"title": "栄 × ダーツ", "area": "栄", "kind": "ダーツ", "price": 0, "tags": "クーポン"},
        {"title": "東京 × サウナ", "area": "東京", "kind": "サウナ", "price": 0, "tags": "終電後"},
        {"title": "大阪 × 漫画喫茶", "area": "大阪", "kind": "漫画喫茶", "price": 0, "tags": "個室"},
    ],
}


def watch_app(p: dict) -> str:
    seed = SEEDS[p["seedKind"]]
    return f"""import {{ useMemo, useState }} from 'react'
import './App.css'

const saveKey = '{p["slug"]}.saved'
const items = {js(seed)}

function readArray(key) {{
  try {{ return JSON.parse(localStorage.getItem(key)) ?? [] }} catch {{ return [] }}
}}

export default function App() {{
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('すべて')
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const kinds = ['すべて', ...new Set(items.map((item) => item.kind))]
  const filtered = useMemo(() => items.filter((item) => {{
    const text = [item.title, item.area, item.kind, item.tags].join(' ')
    return text.includes(query) && (kind === 'すべて' || item.kind === kind)
  }}), [query, kind])

  function toggle(id) {{
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }}

  return (
    <div className="wrap">
      <Header />
      <div className="toolbar">
        <input value={{query}} onChange={{(e) => setQuery(e.target.value)}} placeholder="エリア・条件で検索" />
        <select value={{kind}} onChange={{(e) => setKind(e.target.value)}}>
          {{kinds.map((k) => <option key={{k}}>{{k}}</option>)}}
        </select>
      </div>
      <div className="grid two">
        {{filtered.map((item) => (
          <article className="card" key={{item.title}}>
            <div className="meta"><span className="pill">{{item.area}}</span><span className="pill">{{item.kind}}</span></div>
            <h2>{{item.title}}</h2>
            <p className="muted">{{item.tags || '条件一致のサンプル'}}</p>
            {{item.price ? <p className="price">¥{{item.price.toLocaleString()}}{{item.delta ? '（' + item.delta + '）' : ''}}</p> : null}}
            <button className="plain" onClick={{() => toggle(item.title)}}>{{saved.includes(item.title) ? 'ウォッチ中' : 'ウォッチに追加'}}</button>
          </article>
        ))}}
      </div>
      <p className="muted">保存中 {{saved.length}} 件（この端末の localStorage）</p>
      <Faq />
    </div>
  )
}}
"""


def listings_app(p: dict) -> str:
    seed = SEEDS[p["seedKind"]]
    return f"""import {{ useMemo, useState }} from 'react'
import './App.css'

const favKey = '{p["slug"]}.favs'
const items = {js(seed)}

function readArray(key) {{
  try {{ return JSON.parse(localStorage.getItem(key)) ?? [] }} catch {{ return [] }}
}}

export default function App() {{
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState('すべて')
  const [favs, setFavs] = useState(() => readArray(favKey))
  const kinds = ['すべて', ...new Set(items.map((item) => item.kind))]
  const filtered = useMemo(() => items.filter((item) => {{
    const text = [item.title, item.area, item.kind, item.tags].join(' ')
    return text.includes(query) && (kind === 'すべて' || item.kind === kind)
  }}), [query, kind])

  function toggle(id) {{
    const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]
    setFavs(next)
    localStorage.setItem(favKey, JSON.stringify(next))
  }}

  return (
    <div className="wrap">
      <Header />
      <div className="toolbar">
        <input value={{query}} onChange={{(e) => setQuery(e.target.value)}} placeholder="駅・エリア・条件" />
        <select value={{kind}} onChange={{(e) => setKind(e.target.value)}}>
          {{kinds.map((k) => <option key={{k}}>{{k}}</option>)}}
        </select>
      </div>
      <div className="grid two">
        {{filtered.map((item) => (
          <article className="card" key={{item.title}}>
            <div className="meta">
              <span className="pill">{{item.area}}</span>
              <span className="pill">{{item.kind}}</span>
              {{item.walk ? <span className="pill">徒歩{{item.walk}}分</span> : null}}
            </div>
            <h2>{{item.title}}</h2>
            <p className="muted">{{item.tags || '掲載サンプル'}}</p>
            {{item.price ? <p className="price">¥{{item.price.toLocaleString()}}</p> : null}}
            <button className="plain" onClick={{() => toggle(item.title)}}>{{favs.includes(item.title) ? '保存済み' : '保存'}}</button>
          </article>
        ))}}
      </div>
      <Faq />
    </div>
  )
}}
"""


def queue_app(_p: dict) -> str:
    return """import { useState } from 'react'
import './App.css'

const key = 'nearqueue.tickets'
const pin = '2468'

function load() {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

export default function App() {
  const [tickets, setTickets] = useState(load)
  const [staff, setStaff] = useState(false)
  const [code, setCode] = useState('')

  function persist(next) {
    setTickets(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  function take() {
    const number = (tickets.at(-1)?.number ?? 0) + 1
    persist([...tickets, { number, status: 'waiting', at: new Date().toLocaleTimeString('ja-JP') }])
  }

  function setStatus(number, status) {
    persist(tickets.map((t) => t.number === number ? { ...t, status } : t))
  }

  const waiting = tickets.filter((t) => t.status === 'waiting')

  return (
    <div className="wrap">
      <Header />
      <section className="card">
        <h2>来店者</h2>
        <p className="muted">待ち {waiting.length} 組 / 目安 {waiting.length * 8} 分</p>
        <button onClick={take}>受付番号を取る</button>
        <div className="list" style={{marginTop: 12}}>
          {tickets.slice().reverse().map((t) => (
            <div className="item" key={t.number}>
              <strong>#{t.number}</strong> {t.status} <span className="muted">{t.at}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="staff">
        <h2>店舗ボード</h2>
        {!staff ? (
          <div className="row">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="スタッフPIN（2468）" />
            <button className="ghost" onClick={() => setStaff(code === pin)}>入室</button>
          </div>
        ) : (
          <div className="list">
            {waiting.map((t) => (
              <div className="item" key={t.number}>
                #{t.number}
                <button className="plain" onClick={() => setStatus(t.number, 'called')}>呼び出し</button>
                <button className="plain" onClick={() => setStatus(t.number, 'done')}>案内済</button>
              </div>
            ))}
            {waiting.length === 0 && <p className="muted">待ちはありません</p>}
          </div>
        )}
      </section>
      <Faq />
    </div>
  )
}
"""


def planner_app(_p: dict) -> str:
    return """import { useMemo, useState } from 'react'
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
  const text = `${from} → ${to}（${days}泊）\\n${tpl.title}\\nスポット: ${tpl.spots}\\n宿: ${tpl.stay}`

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
"""


def briefs_app(_p: dict) -> str:
    return """import { useMemo, useState } from 'react'
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
    ].join('\\n')
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
"""


def dashboard_app(_p: dict) -> str:
    return """import { useMemo, useState } from 'react'
import './App.css'

const clients = [
  { name: '終電ホテル', clicks: 1280, drop: -12, issue: '駅LPの内部リンク不足' },
  { name: 'GoalPilot', clicks: 420, drop: 4, issue: 'FAQの構造化未設置' },
  { name: 'まちリスト', clicks: 890, drop: -7, issue: '地域ページの重複タイトル' },
]

export default function App() {
  const [picked, setPicked] = useState(clients[0].name)
  const client = useMemo(() => clients.find((c) => c.name === picked), [picked])
  const report = `${client.name} 月次レポート\\n流入: ${client.clicks}\\n前月比: ${client.drop}%\\n指摘: ${client.issue}\\n次アクション: 指摘チケットを1件消化`

  return (
    <div className="wrap">
      <Header />
      <div className="grid two">
        {clients.map((c) => (
          <article className="card" key={c.name}>
            <h2>{c.name}</h2>
            <p>流入 {c.clicks} / 前月比 {c.drop}%</p>
            <p className="muted">指摘: {c.issue}</p>
            <button className="plain" onClick={() => setPicked(c.name)}>レポート対象にする</button>
          </article>
        ))}
      </div>
      <section className="card">
        <h2>月次レポ下書き — {client.name}</h2>
        <pre className="muted" style={{whiteSpace: 'pre-wrap'}}>{report}</pre>
        <button onClick={() => navigator.clipboard.writeText(report)}>コピー</button>
      </section>
      <Faq />
    </div>
  )
}
"""


def tickets_app(_p: dict) -> str:
    return """import { useState } from 'react'
import './App.css'

const key = 'room-ops.orders'
const checks = ['投稿文の差し替え', 'リンク診断', '週次の勝ちパターンメモ', 'ROOMプロフィール点検']

function load() {
  try { return JSON.parse(localStorage.getItem(key)) ?? [] } catch { return [] }
}

export default function App() {
  const [orders, setOrders] = useState(load)
  const [memo, setMemo] = useState('')
  const [picked, setPicked] = useState([checks[0]])

  function toggle(item) {
    setPicked((cur) => cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item])
  }

  function submit(event) {
    event.preventDefault()
    const next = [{ id: crypto.randomUUID(), memo, picked, price: 4800, date: new Date().toLocaleString('ja-JP') }, ...orders]
    setOrders(next)
    localStorage.setItem(key, JSON.stringify(next))
    setMemo('')
  }

  return (
    <div className="wrap">
      <Header />
      <form className="form" onSubmit={submit} style={{flexDirection: 'column'}}>
        <p className="price">1回 ¥4,800（作業範囲が読みやすいPPV）</p>
        {checks.map((item) => (
          <label key={item}><input type="checkbox" checked={picked.includes(item)} onChange={() => toggle(item)} /> {item}</label>
        ))}
        <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="今週見てほしいROOM URL / 困りごと" />
        <button type="submit">チケット下書きを残す</button>
      </form>
      <section className="card">
        <h2>この端末の申込下書き</h2>
        {orders.length === 0 && <p className="muted">まだありません。BOOTHで決済後、この内容をメッセージに貼ってください。</p>}
        {orders.map((o) => (
          <div className="item" key={o.id}>
            <strong>{o.date}</strong> ¥{o.price.toLocaleString()} — {o.picked.join(' / ')}
            <div className="muted">{o.memo}</div>
          </div>
        ))}
      </section>
      <Faq />
    </div>
  )
}
"""


HEADER_AND_FAQ = """
function Header() {
  return (
    <header className="hero">
      <div className="kicker">{kicker}</div>
      <h1>{title}</h1>
      <p className="lede">{tagline}</p>
      <div className="meta">
        <span className="pill">{price} / {formLabel}</span>
        <span className="pill">Phase {phase}</span>
        <span className="pill">{who}</span>
      </div>
      <div className="cta">
        <a className="buy" href={booth} target="_blank" rel="noreferrer">BOOTHで見る</a>
        <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
      </div>
      <ul className="muted">{features}</ul>
    </header>
  )
}

function Faq() {
  const faqs = {faqs}
  return (
    <section className="faq">
      <h2>FAQ</h2>
      {faqs.map(([q, a]) => (
        <div className="item" key={q}><strong>{q}</strong><p className="muted">{a}</p></div>
      ))}
    </section>
  )
}
"""


def app_shell(p: dict, body: str) -> str:
    form_label = {
        "B": "買い切り",
        "M": "月額",
        "S": "B2B",
        "P": "PPV",
    }[p["form"]]
    features = "\n        ".join(
        f"<li>{f}</li>" for f in p["features"]
    )
    header = textwrap.dedent(
        f"""
        function Header() {{
          return (
            <header className="hero">
              <div className="kicker">{p["emoji"]} {p["title"]} / {p["titleJa"]}</div>
              <h1>{p["titleJa"]}</h1>
              <p className="lede">{p["tagline"]}</p>
              <div className="meta">
                <span className="pill">{p["price"]} / {form_label}</span>
                <span className="pill">Phase {p["phase"]}</span>
                <span className="pill">{p["who"]}</span>
              </div>
              <div className="cta">
                <a className="buy" href="https://chitamaru.booth.pm/items/{p["boothItem"]}" target="_blank" rel="noreferrer">BOOTHで見る</a>
                <a className="buy" href="https://syunnjack.dev/store" target="_blank" rel="noreferrer">ストア</a>
              </div>
              <ul className="muted">
                {features}
              </ul>
            </header>
          )
        }}

        function Faq() {{
          const faqs = {js(p["faqs"])}
          return (
            <section className="faq">
              <h2>FAQ</h2>
              {{faqs.map(([q, a]) => (
                <div className="item" key={{q}}><strong>{{q}}</strong><p className="muted">{{a}}</p></div>
              ))}}
            </section>
          )
        }}
        """
    )
    # body currently references Header and Faq - append helpers
    return body.replace(
        "import './App.css'\n",
        "import './App.css'\n",
    ) + "\n" + header


MODES = {
    "watch": watch_app,
    "listings": listings_app,
    "queue": queue_app,
    "planner": planner_app,
    "briefs": briefs_app,
    "dashboard": dashboard_app,
    "tickets": tickets_app,
}


def package_json(p: dict) -> str:
    return js({
        "name": p["repo"],
        "private": True,
        "version": "0.1.0",
        "type": "module",
        "scripts": {
            "dev": "vite",
            "build": "vite build",
            "preview": "vite preview",
        },
        "dependencies": {
            "react": "^19.2.7",
            "react-dom": "^19.2.7",
        },
        "devDependencies": {
            "@vitejs/plugin-react": "^6.0.3",
            "vite": "^8.1.1",
        },
    }) + "\n"


def vite_config(p: dict) -> str:
    return f"""import {{ defineConfig }} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({{
  base: '/{p["repo"]}/',
  plugins: [react()],
}})
"""


def index_html(p: dict) -> str:
    desc = p["tagline"]
    url = f"https://syunnjack.github.io/{p['repo']}/"
    schema = js({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": p["title"],
        "url": url,
        "applicationCategory": "BusinessApplication",
        "offers": {"@type": "Offer", "price": p["price"].replace("¥", "").replace(",", ""), "priceCurrency": "JPY"},
        "description": desc,
    })
    return f"""<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{p["title"]}｜{p["titleJa"]}</title>
    <meta name="description" content="{desc}" />
    <link rel="canonical" href="{url}" />
    <script type="application/ld+json">{schema}</script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""


def pages_yml(p: dict) -> str:
    return f"""name: GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{{{ steps.deployment.outputs.page_url }}}}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
"""


def readme(p: dict) -> str:
    proto = f"- プロトタイプ: https://github.com/{p['prototype']}\n" if p.get("prototype") else ""
    return f"""# {p["title"]}（{p["titleJa"]}）

知多丸の**独立製品リポジトリ**です。既存プロトタイプを商品化するために新規作成しています。

- おすすめ順: **#{p["rank"]}**
- Phase: **{p["phase"]}**（1=個人買い切り下地 / 2=個人月額 / 3=B2B）
- 価格: 個人 **{p["price"]}** ／ 月額目安 {p["priceMonthly"]} ／ B2B {p["priceB2B"]}
- BOOTH（予定）: https://chitamaru.booth.pm/items/{p["boothItem"]}
- Pages: https://syunnjack.github.io/{p["repo"]}/
{proto}
## 誰向け

{p["who"]}

{p["tagline"]}

## できること

{chr(10).join(f"- {f}" for f in p["features"])}

## 開発

```bash
npm install
npm run dev
npm run build
```

GitHub Pages は `base: '/{p["repo"]}/'` です。リポジトリの Pages を GitHub Actions に設定してください。

## 既存リポを上書きしない理由

同名のプロトタイプ（例: `{p["slug"]}`）が既にある場合でも、**商品名・価格・BOOTH導線・Phase 設計を持った製品版**として別リポにしています。

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev/store
"""


def product_json(p: dict) -> str:
    data = {
        **p,
        "repoUrl": f"https://github.com/{OWNER}/{p['repo']}",
        "pagesUrl": f"https://syunnjack.github.io/{p['repo']}/",
        "boothUrl": f"https://chitamaru.booth.pm/items/{p['boothItem']}",
    }
    return js(data) + "\n"


def booth_md(p: dict) -> str:
    return f"""# BOOTH 出品文（コピペ用）

**商品名:** 【{p["price"]}】{p["title"]}｜{p["titleJa"]}

**価格:** {p["price"]}（税込）

**種別:** デジタルコンテンツ（GitHub Pages デモ + ソースZIP）

## 本文

{p["tagline"]}

対象: {p["who"]}

{chr(10).join(f"- {f}" for f in p["features"])}

デモ: https://syunnjack.github.io/{p["repo"]}/
ソース: https://github.com/{OWNER}/{p["repo"]}

## 納品チェック

- [ ] ZIP に `README.md` と `src/` が入っている
- [ ] Pages デモが開く
- [ ] 価格が {p["price"]}
- [ ] 購入者メッセージにデモURLと使い方1行
"""


def write_repo(p: dict) -> None:
    dest = ROOT / p["repo"]
    (dest / "src").mkdir(parents=True, exist_ok=True)
    (dest / "docs").mkdir(parents=True, exist_ok=True)
    (dest / ".github" / "workflows").mkdir(parents=True, exist_ok=True)
    (dest / "public").mkdir(parents=True, exist_ok=True)

    body = MODES[p["mode"]](p)
    (dest / "src" / "App.jsx").write_text(app_shell(p, body), encoding="utf-8")
    (dest / "src" / "main.jsx").write_text(MAIN_JSX, encoding="utf-8")
    (dest / "src" / "index.css").write_text(INDEX_CSS, encoding="utf-8")
    (dest / "src" / "App.css").write_text(APP_CSS, encoding="utf-8")
    (dest / "package.json").write_text(package_json(p), encoding="utf-8")
    (dest / "vite.config.js").write_text(vite_config(p), encoding="utf-8")
    (dest / "index.html").write_text(index_html(p), encoding="utf-8")
    (dest / ".gitignore").write_text(GITIGNORE, encoding="utf-8")
    (dest / "LICENSE").write_text(LICENSE, encoding="utf-8")
    (dest / "README.md").write_text(readme(p), encoding="utf-8")
    (dest / "chitamaru.product.json").write_text(product_json(p), encoding="utf-8")
    (dest / "docs" / "BOOTH.md").write_text(booth_md(p), encoding="utf-8")
    (dest / "docs" / "PRICING.md").write_text(
        f"# 価格\n\n- 個人: {p['price']}\n- 月額目安: {p['priceMonthly']}\n- B2B: {p['priceB2B']}\n",
        encoding="utf-8",
    )
    (dest / ".github" / "workflows" / "pages.yml").write_text(pages_yml(p), encoding="utf-8")
    (dest / "public" / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\nSitemap: https://syunnjack.github.io/{p['repo']}/\n",
        encoding="utf-8",
    )
    (dest / "public" / "llms.txt").write_text(
        f"# {p['title']}\n\n{p['tagline']}\n\nPrice: {p['price']}\n",
        encoding="utf-8",
    )


def main() -> None:
    for p in CATALOG["products"]:
        write_repo(p)
        print("wrote", p["repo"])


if __name__ == "__main__":
    main()
